(function(root){
"use strict";
// GeckoDoku / SpaceFortress pattern: immutable per-run IDs, local outbox,
// idempotent POST acknowledgments, paginated world cache and offline fallback.
// The shared API must provision the "partoutetris" game separately. Never
// represent a local score as a remote score without a server acknowledgment.
const PENDING_KEY="partoutetris-hall-pending-v1";
const CACHE_KEY="partoutetris-hall-world-v1";
const MAX_PENDING=1000,MAX_WORLD=5000;
const load=(storage,key,fallback)=>{
  try {const v=JSON.parse(storage?.getItem(key)||"null");return v??fallback;}
  catch(e){return fallback;}
};
const store=(storage,key,value)=>{
  try {storage?.setItem(key,JSON.stringify(value));return !!storage;}
  catch(e){return false;}
};
const positive=x=>Number.isSafeInteger(x)&&x>0;
const cleanRemote=x=>{
  if(!x||typeof x!=="object")return null;
  const score=x.points??x.score??x.metadata?.score;
  if(!positive(score))return null;
  const name=String(x.playerName??x.name??"Pharaonite")
    .replace(/[<>\x00-\x1f\x7f]/g,"").trim().slice(0,32)||"Pharaonite";
  const runId=String(x.runId??x.submissionId??"").slice(0,120);
  const scoreId=String(x.scoreId??x.id??runId).slice(0,120);
  if(!scoreId)return null;
  return {scoreId,runId,name,score,
    crowns:Number.isInteger(x.crowns)?x.crowns:
      Number.isInteger(x.metadata?.crowns)?x.metadata.crowns:0,
    at:Number.isFinite(x.completedAt)?x.completedAt:
      Number.isFinite(x.receivedAt)?x.receivedAt:0};
};
function payload(entry){
  if(!entry||!positive(entry.score)||typeof entry.runId!=="string"||
     entry.runId.length<3||entry.runId.length>120)throw Error("invalid score");
  // Protocol shape follows the GeckoDoku common schema; server-side
  // acceptance of this *new gameId* is intentionally NOT assumed.
  return JSON.stringify({
    schemaVersion:1,scoreVersion:1,runId:entry.runId,
    playerName:entry.name,mode:"LUNAR_FOUR_FRONTS",difficulty:"CROWN_PROGRESSION",
    size:48,completed:true,stars:Math.max(1,Math.min(5,entry.crowns+1)),
    elapsedSeconds:Math.floor(entry.elapsedSeconds),mistakes:0,
    assistancePoints:0,usedProfessor:false,
    completedAt:Math.floor(entry.at),
    appVersion:entry.appVersion||"0.2.12",
    points:entry.score,score:entry.score,
    metadata:{score:entry.score,crowns:entry.crowns,level:entry.level}
  });
}
class GlobalHall{
 constructor(storage,transport=null){
  this.storage=storage;this.transport=transport;
  const raw=load(storage,PENDING_KEY,[]);
  this.pending=Array.isArray(raw)?raw.filter(x=>x&&typeof x.runId==="string"&&positive(x.score)).slice(0,MAX_PENDING):[];
  const old=load(storage,CACHE_KEY,{cursor:"0",entries:[]});
  this.cursor=typeof old.cursor==="string"?old.cursor:"0";
  this.entries=Array.isArray(old.entries)?old.entries.map(cleanRemote).filter(Boolean).slice(-MAX_WORLD):[];
  this.status=transport?"non_verifie":"non_configure";
  this.inflight=new Map();this.sequence=0;this.fetchBusy=false;this.postBusy=false;
  this.onChange=()=>{};
 }
 notify(){this.onChange();}
 get world(){return this.entries.slice().sort((a,b)=>b.score-a.score||a.at-b.at);}
 top(n=10){return this.world.slice(0,Math.max(0,Math.min(100,n)));}
 queue(entry){
  if(!entry||!positive(entry.score)||!entry.runId)return false;
  if(this.pending.some(x=>x.runId===entry.runId)||
     this.entries.some(x=>x.runId===entry.runId))return false;
  if(this.pending.length>=MAX_PENDING)return false;
  const frozen={runId:entry.runId,name:entry.name,score:entry.score,
    crowns:entry.crowns||0,level:entry.level||1,
    elapsedSeconds:entry.elapsedSeconds||0,at:entry.at,
    appVersion:entry.appVersion||"0.2.12"};
  this.pending.push(frozen);
  store(this.storage,PENDING_KEY,this.pending);
  this.notify();this.uploadNext();return true;
 }
 request(kind,data){
  if(!this.transport)return false;
  const id="h"+(++this.sequence);
  this.inflight.set(id,{kind});
  try{
   if(kind==="post")this.transport.post(payload(data),id);
   else this.transport.sync(this.cursor,id);
   return true;
  }catch(e){this.inflight.delete(id);this.status="hors_ligne";this.notify();return false;}
 }
 uploadNext(){
  if(this.postBusy||!this.pending.length||!this.transport||
     this.status==="serveur_indisponible")return;
  this.postBusy=true;
  if(!this.request("post",this.pending[0]))this.postBusy=false;
 }
 refresh(){
  if(this.fetchBusy||!this.transport)return false;
  this.fetchBusy=true;
  if(!this.request("sync")){this.fetchBusy=false;return false;}
  return true;
 }
 receive(id,status,body){
  const info=this.inflight.get(id);
  if(!info)return false;
  this.inflight.delete(id);
  let parsed=null;
  try{parsed=JSON.parse(body||"{}");}catch(e){}
  if(info.kind==="post"){
   this.postBusy=false;
   const first=this.pending[0];
   const accepted=(status===200||status===201)&&parsed&&first&&
    (parsed.accepted===true&&parsed.runId===first.runId||
     parsed.submissionId===first.runId&&["accepted","already_received"].includes(parsed.status));
   if(accepted){
    this.pending.shift();
    store(this.storage,PENDING_KEY,this.pending);
    this.status="en_ligne";this.notify();this.uploadNext();
   }else{
    this.status=status===404||status===403?"serveur_indisponible":
      status===0?"hors_ligne":"en_attente";
    this.notify();
   }
   return true;
  }
  this.fetchBusy=false;
  if(status!==200||!parsed||!Array.isArray(parsed.entries)||
     typeof parsed.nextCursor!=="string"||typeof parsed.hasMore!=="boolean"){
    this.status=status===404||status===403?"serveur_indisponible":
      status===0?"hors_ligne":"en_attente";
    this.notify();return true;
  }
  // A retry may expose the same run with another server scoreId.
  // The immutable run ID, never the player's nickname, defines identity.
  const key=e=>e.runId||e.scoreId;
  const merged=new Map(this.entries.map(e=>[key(e),e]));
  for(const raw of parsed.entries){
   const e=cleanRemote(raw);if(e)merged.set(key(e),e);
  }
  this.entries=[...merged.values()].slice(-MAX_WORLD);
  this.cursor=parsed.nextCursor;
  store(this.storage,CACHE_KEY,{cursor:this.cursor,entries:this.entries});
  this.status="en_ligne";this.notify();
  if(parsed.hasMore&&parsed.entries.length&&this.sequence<200){
    this.refresh();
  }else this.uploadNext();
  return true;
 }
}
const api={GlobalHall,payload,cleanRemote,PENDING_KEY,CACHE_KEY};
root.PartouGlobalHall=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof globalThis!=="undefined"?globalThis:this);

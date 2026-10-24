(function(root){
"use strict";
const KEY="partoutetris-leaderboard-v1",PREVIOUS_RECORD="partouteris-record";
const HISTORY_KEY="partoutetris-score-history-v1";
function newRunId(at=Date.now()){
  const rand=()=>Math.floor(Math.random()*0x100000000).toString(16).padStart(8,"0");
  return "pt-"+at.toString(36)+"-"+rand()+"-"+rand();
}
function validEntry(x){
  return x&&typeof x.runId==="string"&&x.runId.length<=120&&x.runId.length>=3&&
    Number.isSafeInteger(x.score)&&x.score>0&&Number.isFinite(x.at);
}
function historyEntry(x){
  return {runId:x.runId,name:cleanName(x.name),score:x.score,at:x.at,
    crowns:Number.isInteger(x.crowns)&&x.crowns>=0?x.crowns:0,
    level:Number.isInteger(x.level)&&x.level>=1?x.level:1,
    elapsedSeconds:Number.isFinite(x.elapsedSeconds)&&x.elapsedSeconds>=0?x.elapsedSeconds:0,
    appVersion:typeof x.appVersion==="string"?x.appVersion.slice(0,32):"legacy"};
}
const DEFAULT_NICKNAME="Tous3nKamion",OLD_DEFAULT_NICKNAME="PHARAON";
function cleanName(value) {
  const text=String(value??"").replace(/[<>\x00-\x1f\x7f]/g,"").trim().replace(/\s+/g," ");
  return Array.from(text).slice(0,16).join("")||DEFAULT_NICKNAME;
}
function normalize(items) {
  if(!Array.isArray(items))return [];
  return items.filter(x=>x&&Number.isSafeInteger(x.score)&&x.score>0)
    .map(x=>({name:cleanName(x.name),score:x.score,at:Number.isFinite(x.at)?x.at:0}))
    .sort((a,b)=>b.score-a.score||a.at-b.at).slice(0,10);
}
class Leaderboard {
  constructor(storage){
    this.storage=storage;this.scores=[];this.history=[];this.name=DEFAULT_NICKNAME;
    if(!storage)return;
    try{
      const raw=JSON.parse(storage.getItem(KEY)||"{}");
      // Upgrade only the old generic nickname, not archived scores.
      this.name=raw.name===OLD_DEFAULT_NICKNAME?DEFAULT_NICKNAME:cleanName(raw.name);
      this.scores=normalize(raw.scores);
      // The previous single best record must not be lost on upgrade.
      const legacy=Number(storage.getItem(PREVIOUS_RECORD)||0);
      if(Number.isSafeInteger(legacy)&&legacy>0&&!this.scores.some(x=>x.score===legacy))
        this.scores=normalize([...this.scores,{name:"ANCIEN RECORD",score:legacy,at:0}]);
      const archived=JSON.parse(storage.getItem(HISTORY_KEY)||"null");
      this.history=Array.isArray(archived)?archived.filter(validEntry).map(historyEntry):[];
      // Recover all we can from older builds without inventing missing plays.
      if(!this.history.length)this.history=this.scores.map((entry,index)=>historyEntry({
        ...entry,runId:"legacy-"+entry.at+"-"+index
      }));
    }catch(e){this.name=DEFAULT_NICKNAME;this.scores=[];this.history=[];}
  }
  setName(value){this.name=cleanName(value);this.save();return this.name;}
  add(score,at=Date.now(),details={}){
    if(!Number.isSafeInteger(score)||score<=0)return false;
    const runId=typeof details.runId==="string"&&details.runId.length>=3&&
      details.runId.length<=120?details.runId:newRunId(at);
    if(this.history.some(x=>x.runId===runId))return false;
    const entry=historyEntry({name:this.name,score,at,runId,...details});
    this.history.push(entry);
    this.scores=normalize([...this.scores,{name:entry.name,score,at}]);
    this.save();return true;
  }
  all(amount=100){
    const n=Math.min(10000,Math.max(0,Math.floor(amount)));
    return this.history.slice().sort((a,b)=>b.score-a.score||a.at-b.at).slice(0,n);
  }
  session(runId){return this.history.find(x=>x.runId===runId)||null;}
  top(amount=3){return this.scores.slice(0,Math.max(0,Math.min(10,amount)));}
  best(){return this.scores.length?this.scores[0].score:0;}
  save(){
    try{
      this.storage?.setItem(KEY,JSON.stringify({name:this.name,scores:this.scores}));
      this.storage?.setItem(HISTORY_KEY,JSON.stringify(this.history));
    }catch(e){}
  }
}
root.PartouScores={Leaderboard,cleanName,normalize,KEY,HISTORY_KEY,DEFAULT_NICKNAME,newRunId};
if(typeof module!=="undefined"&&module.exports)module.exports={Leaderboard,cleanName,normalize,KEY,HISTORY_KEY,DEFAULT_NICKNAME,newRunId};
})(typeof globalThis!=="undefined"?globalThis:this);

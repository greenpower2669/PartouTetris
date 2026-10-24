const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {Leaderboard,HISTORY_KEY}=require("../app/src/main/assets/leaderboard.js");
const {GlobalHall,payload,PENDING_KEY,CACHE_KEY}=require("../app/src/main/assets/global-hall.js");
function memory(initial={}){
 const m=new Map(Object.entries(initial));
 return {getItem:key=>m.has(key)?m.get(key):null,
  setItem:(key,v)=>m.set(key,String(v)),removeItem:key=>m.delete(key),m};
}
function remote(){
 const calls=[];
 return {calls,post:(body,id)=>calls.push({kind:"post",id,body:JSON.parse(body)}),
   sync:(cursor,id)=>calls.push({kind:"sync",id,cursor})};
}
test("PT025 full local history persists beyond top ten without erasing old records",()=>{
 const mem=memory({"partouteris-record":"7777"}),lb=new Leaderboard(mem);
 assert.equal(lb.best(),7777);
 for(let i=1;i<=22;i++)lb.add(i*100,1700000000000+i,{runId:"run-"+i,crowns:i%6,appVersion:"0.2.12"});
 assert.equal(lb.top(10).length,10);
 assert.equal(lb.history.length,23); // historical record + 22 new games
 assert.equal(new Leaderboard(mem).history.length,23);
 assert.equal(new Leaderboard(mem).all(50).length,23);
 assert.equal(lb.best(),7777);
 assert.equal(lb.all(1)[0].score,7777);
 assert.ok(mem.getItem(HISTORY_KEY));
});
test("PT025 exact run ID dedupes only same play, not two players with same name/score",()=>{
 const mem=memory(),lb=new Leaderboard(mem);
 assert.equal(lb.add(400,100,{runId:"run-123",crowns:2}),true);
 assert.equal(lb.add(400,100,{runId:"run-123",crowns:2}),false);
 assert.equal(lb.add(400,100,{runId:"run-124",crowns:2}),true);
 assert.equal(lb.history.length,2);
 assert.equal(lb.top(3).length,2);
});
test("PT025 offline local score remains while outbox retains unsent record",()=>{
 const mem=memory(),lb=new Leaderboard(mem),global=new GlobalHall(mem,null);
 lb.add(850,1700000000000,{runId:"run-offline",crowns:2,level:3,appVersion:"0.2.12"});
 const entry=lb.session("run-offline");
 assert.ok(global.queue(entry));
 assert.equal(global.pending.length,1);
 assert.equal(global.status,"non_configure");
 assert.equal(new GlobalHall(mem,null).pending[0].runId,"run-offline");
 assert.equal(global.top(10).length,0);
});
test("PT025 valid idempotent ack removes pending and can send next run",()=>{
 const mem=memory(),mock=remote(),global=new GlobalHall(mem,mock);
 const a={runId:"run-a",name:"Tous3nKamion",score:800,at:1700000000000,crowns:3,level:4,elapsedSeconds:120};
 const b={...a,runId:"run-b",score:810};
 global.queue(a);global.queue(b);
 assert.equal(mock.calls.length,1);
 assert.equal(mock.calls[0].body.runId,"run-a");
 assert.equal(mock.calls[0].body.points,800);
 assert.equal(mock.calls[0].body.metadata.crowns,3);
 assert.equal(mock.calls[0].body.playerName,"Tous3nKamion");
 assert.equal(global.receive(mock.calls[0].id,201,JSON.stringify({accepted:true,scoreId:"s1",runId:"run-a",sequence:7})),true);
 assert.equal(global.pending.length,1);
 assert.equal(mock.calls.length,2);
 global.receive(mock.calls[1].id,200,JSON.stringify({accepted:true,duplicate:true,scoreId:"s2",runId:"run-b",sequence:8}));
 assert.equal(global.pending.length,0);
});
test("PT025 wrong ack, offline, missing server preserve queue with honest status",()=>{
 const mem=memory(),mock=remote(),global=new GlobalHall(mem,mock);
 global.queue({runId:"r1x",name:"Cléo",score:650,at:1700000000000});
 assert.equal(global.receive(mock.calls[0].id,201,JSON.stringify({accepted:true,runId:"OTHER",scoreId:"s1"})),true);
 assert.equal(global.pending.length,1);
 assert.equal(global.status,"en_attente");
 assert.equal(global.refresh(),true);
 global.receive(mock.calls.at(-1).id,404,JSON.stringify({error:"game not provisioned"}));
 assert.equal(global.status,"serveur_indisponible");
 assert.equal(global.pending.length,1);
 assert.equal(global.top(10).length,0);
});
test("PT025 world records come exclusively from confirmed remote sync, cached offline",()=>{
 const mem=memory(),mock=remote(),global=new GlobalHall(mem,mock);
 assert.equal(global.refresh(),true);
 const id=mock.calls.at(-1).id;
 global.receive(id,200,JSON.stringify({entries:[
  {scoreId:"s1",runId:"r1",playerName:"Ramsès",points:2500,completedAt:1700000000000,metadata:{crowns:5}},
  {scoreId:"s2",runId:"r2",playerName:"Hatshepsout",points:7400,completedAt:1700000002000},
  {scoreId:"s3",runId:"r1",playerName:"Ramsès",points:2500,completedAt:1700000000000}
 ],nextCursor:"cursor-9",hasMore:false}));
 assert.equal(global.status,"en_ligne");
 assert.deepEqual(global.top(2).map(x=>x.score),[7400,2500]);
 assert.ok(mem.getItem(CACHE_KEY));
 assert.deepEqual(new GlobalHall(mem,null).top(2).map(x=>x.score),[7400,2500]);
 assert.equal(global.entries.length,2);
});
test("PT025 UI truly separates local and world with visible offline warning",()=>{
 const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
 const manifest=fs.readFileSync("app/src/main/AndroidManifest.xml","utf8");
 const activity=fs.readFileSync("app/src/main/java/com/greenpower2669/partouteris/MainActivity.java","utf8");
 const bridge=fs.readFileSync("app/src/main/java/com/greenpower2669/partouteris/PartouHallApiBridge.java","utf8");
 assert.match(html,/id="hallLocal"/);
 assert.match(html,/id="hallWorld"/);
 assert.match(html,/id="hallHistoryMode"/);
 assert.match(html,/leaderboard\.all\(10000\)/);
 assert.match(html,/globalHall\.top\(100\)/);
 assert.match(html,/globalHall\.queue\(leaderboard\.session\(runId\)\)/);
 assert.match(html,/globalHall\.refresh\(\)/);
 assert.match(manifest,/android.permission.INTERNET/);
 assert.match(activity,/addJavascriptInterface\(hallBridge, "PartouHall"\)/);
 assert.match(bridge,/fab-hall-of-fame\.gnrationsia\.chatgpt\.site\/api\/v1\/games\/partoutetris/);
 assert.doesNotMatch(bridge,/HOF_API_KEY|PRIVATE_KEY|PASSWORD/);
});

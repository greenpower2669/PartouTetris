const test=require("node:test");
const assert=require("node:assert/strict");
const {Leaderboard,cleanName}=require("../app/src/main/assets/leaderboard.js");
function store(initial={}){
 const data=new Map(Object.entries(initial));
 return {getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v)),data};
}
test("Pseudonym sanitizes markup and limits characters",()=>{
 assert.equal(cleanName("  <Râ>  "),"Râ");
 assert.equal(cleanName(" "),"Tous3nKamion");
 assert.equal(cleanName("ABCDEFGHIJKLMNOPQRSTUVWXYZ").length,16);
});
test("Leaderboard stores nickname, ranked best 3 and scores offline",()=>{
 const storage=store();const a=new Leaderboard(storage);
 a.setName("  Cléopâtre ");a.add(600,20);a.add(200,25);a.setName("Ramsès");a.add(800,30);
 assert.deepEqual(a.top().map(x=>x.score),[800,600,200]);
 assert.deepEqual(new Leaderboard(storage).top().map(x=>x.name),["Ramsès","Cléopâtre","Cléopâtre"]);
 assert.equal(new Leaderboard(storage).name,"Ramsès");
});
test("Migrates previous single record without erasing it",()=>{
 const storage=store({"partouteris-record":"1337"});
 const scores=new Leaderboard(storage);
 assert.deepEqual(scores.top().map(x=>x.score),[1337]);
 assert.equal(scores.top()[0].name,"ANCIEN RECORD");
 scores.add(100,8);
 assert.equal(new Leaderboard(storage).best(),1337);
});
test("No score is recorded for zero-point sessions, and list is capped at 10",()=>{
 const lb=new Leaderboard(store());
 assert.equal(lb.add(0),false);
 for(let i=1;i<=15;i++)lb.add(i*10,i);
 assert.equal(lb.scores.length,10);
 assert.equal(lb.best(),150);
 assert.equal(lb.top().length,3);
});
test("Corrupted storage and missing localStorage cannot crash the game",()=>{
 const bad=store({"partoutetris-leaderboard-v1":"bad json"});
 assert.deepEqual(new Leaderboard(bad).top(),[]);
 const lb=new Leaderboard(null);
 lb.add(100);
 assert.equal(lb.best(),100);
});

test("PT-015 defaults and migration do not erase existing Pharaonite records",()=>{
 const fresh=new Leaderboard(store());
 assert.equal(fresh.name,"Tous3nKamion");
 assert.equal(cleanName(null),"Tous3nKamion");
 const previous=store({"partoutetris-leaderboard-v1":JSON.stringify({name:"PHARAON",
   scores:[{name:"ANCIEN RECORD",score:20319,at:10},{name:"Cléopâtre",score:340,at:11}]})});
 const migrated=new Leaderboard(previous);
 assert.equal(migrated.name,"Tous3nKamion");
 assert.deepEqual(migrated.top(3).map(x=>[x.name,x.score]),
   [["ANCIEN RECORD",20319],["Cléopâtre",340]]);
 const custom=store({"partoutetris-leaderboard-v1":JSON.stringify({name:"Ramsès",
   scores:[{name:"Ramsès",score:500,at:1}]})});
 assert.equal(new Leaderboard(custom).name,"Ramsès");
 assert.equal(new Leaderboard(custom).best(),500);
});
test("PT-015 display reads Meilleur score de Pharaonite and nickname",()=>{
 const fs=require("node:fs");
 const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
 assert.match(html,/MEILLEUR SCORE DE PHARAONITE/);
 assert.match(html,/placeholder="Tous3nKamion"/);
 assert.match(html,/Tous3nKamion · Record 0/);
 assert.match(html,/leaderboard\.name\+" · Record "/);
});

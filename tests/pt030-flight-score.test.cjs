const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {Game,MAX_WAIT_SECONDS,RINGS,SPACE_STEPS,SPACE_INTERVAL_FACTOR}=
  require("../app/src/main/assets/engine.js");
const S=require("../app/src/main/assets/session.js");
function near(a,b,tolerance=1e-8){
 assert.ok(Math.abs(a-b)<=tolerance,`${a} != ${b}`);
}
function storage(){
 const m=new Map();
 return {getItem:key=>m.get(key)||null,setItem:(key,value)=>m.set(key,value),
  removeItem:key=>m.delete(key)};
}
function event(g,reason){
 return g.drainEvents().find(e=>e.type==="points"&&e.reason===reason);
}
test("PT030: every newly created space piece has independent active game-time birth",()=>{
 const g=new Game(()=>0);
 assert.deepEqual(g.pieces.map(p=>p.spawnedAtSeconds),[0,0,0,0]);
 g.seconds=63;g.spawn(2);
 assert.equal(g.pieces[2].spawnedAtSeconds,63);
 assert.equal(g.pieces[1].spawnedAtSeconds,0);
 assert.equal(g.pieces[2].radius,RINGS+SPACE_STEPS);
});
test("PT030: reference travel duration includes space and final collision stage",()=>{
 const g=new Game(()=>0);
 near(g.nominalFlightSeconds({radius:0}),
   MAX_WAIT_SECONDS*((SPACE_STEPS+1)*SPACE_INTERVAL_FACTOR+RINGS));
 near(g.nominalFlightSeconds({radius:8}),
   MAX_WAIT_SECONDS*((SPACE_STEPS+1)*SPACE_INTERVAL_FACTOR+2));
});
test("PT030 exploit blocked: changing slider only just before landing gives no instantaneous jackpot",()=>{
 const g=new Game(()=>0);
 g.pieces[0].type=1;g.pieces[0].radius=0;
 g.seconds=100; // piece was born at active second 0
 const before=g.flightSpeedMultiplier(g.pieces[0]);
 g.setBaseFallSeconds(2); // old code paid ×10 instantly here
 assert.equal(g.speedMultiplier(),10); // old PT024 API remains for difficulty
 near(g.flightSpeedMultiplier(g.pieces[0]),before);
 assert.ok(before<1.1);
 assert.equal(g.lock(0),true);
 const placement=event(g,"placement");
 assert.ok(placement);
 near(placement.speedMultiplier,Math.round(before*1000)/1000,1e-8);
 const unboosted=placement.base*Math.max(1,placement.contacts)+
   placement.continuityPoints+placement.bridgePoints+placement.geodesyPoints;
 assert.ok(placement.gained<unboosted*1.1,"last-minute slider must not multiply whole-flight payout");
 near(placement.flightSeconds,100);
 near(placement.nominalSeconds,119.36);
 assert.equal(placement.speedSource,"measured-flight");
});
test("PT030: a legitimately faster whole flight earns the squared speed differential",()=>{
 const g=new Game(()=>0),p=g.pieces[0];
 p.radius=0;
 g.seconds=g.nominalFlightSeconds(p)/4;
 near(g.flightSpeedMultiplier(p),10);
 g.seconds=g.nominalFlightSeconds(p)/2;
 near(g.flightSpeedMultiplier(p),2);
 g.seconds=g.nominalFlightSeconds(p)*2;
 near(g.flightSpeedMultiplier(p),1);
});
test("PT030: paused time does not count against a traveling piece",()=>{
 const g=new Game(()=>0);g.step(.12);
 const birth=g.pieces[0].spawnedAtSeconds,before=g.seconds;
 g.paused=true;g.step(100000);
 near(g.seconds,before);
 assert.equal(g.pieces[0].spawnedAtSeconds,birth);
 g.paused=false;g.step(.12);
 near(g.seconds,before+.12);
});
test("PT030: x10 boosted only at the end cannot masquerade as an all-flight boost",()=>{
 const g=new Game(()=>0),p=g.pieces[0];
 p.radius=0;g.seconds=110;const before=g.flightSpeedMultiplier(p);
 g.boost(0,true);
 near(g.flightSpeedMultiplier(p),before);
 g.step(.12); // the actual active elapsed time advances, multiplier stays bounded
 assert.ok(g.score<400);
 const scoreEvent=g.drainEvents().find(e=>e.reason==="placement");
 if(scoreEvent)assert.ok(scoreEvent.speedMultiplier<1.1);
});
test("PT030: crown reward uses landing piece's earned speed, not post-clear instant gravity",()=>{
 const g=new Game(()=>0);
 const lane=0,p=g.pieces[lane];
 p.type=1;p.angle=5;p.radius=0;p.rot=0;p.spawnedAtSeconds=0;
 for(let a=0;a<48;a++){
  if(a===5||a===6)continue;
  g.board[0][a]=1;g.boardTypes[0][a]=0;
 }
 g.seconds=100;
 g.setBaseFallSeconds(2);g.fall[lane]=2.1;
 g.step(.12);
 const events=g.drainEvents();
 const placement=events.find(e=>e.type==="points"&&e.reason==="placement");
 const ring=events.find(e=>e.type==="points"&&e.reason==="ring");
 assert.ok(placement&&ring,"the last piece must land and clear the crown");
 assert.equal(g.cleared,1);
 assert.ok(placement.speedMultiplier<1.1);
 near(ring.speedMultiplier,placement.speedMultiplier,.001);
 assert.ok(ring.speedMultiplier<g.speedMultiplier());
});
test("PT030: scoring cannot mint time-based bonuses for missing, future or zero-time birth",()=>{
 const g=new Game(()=>0),p=g.pieces[0];
 p.radius=0;p.spawnedAtSeconds=null;assert.equal(g.flightSpeedMultiplier(p),1);
 p.spawnedAtSeconds=99;g.seconds=5;assert.equal(g.flightSpeedMultiplier(p),1);
 p.spawnedAtSeconds=5;assert.equal(g.flightSpeedMultiplier(p),1);
 p.spawnedAtSeconds=-100;g.seconds=5;
 assert.equal(g.flightSpeedMultiplier(p),1,"an invalid negative birth should not pay a speed bonus");
});
test("PT030: save/restore keeps born-at game time and old v1 checkpoint without birth is safe",()=>{
 const store=storage(),g=new Game(()=>0);
 g.seconds=74;g.spawn(0);g.seconds=82;g.spawn(3);
 assert.ok(S.save(store,g,2));
 const saved=S.read(store),restored=new Game(()=>0);
 assert.equal(saved.pieces[0].spawnedAtSeconds,74);
 assert.equal(saved.pieces[3].spawnedAtSeconds,82);
 assert.ok(S.restore(restored,saved));
 assert.equal(restored.pieces[0].spawnedAtSeconds,74);
 assert.equal(restored.pieces[3].spawnedAtSeconds,82);
 const legacy=S.capture(g);
 for(const p of legacy.pieces)delete p.spawnedAtSeconds;
 assert.ok(S.valid(legacy));
 const before=new Game(()=>0);
 assert.ok(S.restore(before,legacy));
 assert.ok(before.pieces.every(p=>p.spawnedAtSeconds===null));
 before.seconds+=25;
 assert.equal(before.flightSpeedMultiplier(before.pieces[0]),1);
 before.spawn(0);
 assert.equal(before.pieces[0].spawnedAtSeconds,before.seconds);
});
test("PT030: malformed future birth rejected without deleting an old valid run",()=>{
 const g=new Game(()=>0),cp=S.capture(g);
 cp.pieces[0].spawnedAtSeconds=1e20;
 assert.equal(S.valid(cp),false);
});
test("PT030: gameplay visuals and HOF remain untouched by scoring-only patch",()=>{
 const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
 assert.match(html,/ghostMoonGuide\.render/);
 assert.match(html,/id="hallWorld"/);
 assert.match(html,/id="experimentalTouch"/);
 assert.match(html,/src="tangent-control.js"/);
});

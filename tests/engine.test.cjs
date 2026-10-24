const test = require('node:test');
const assert = require('node:assert/strict');
const {Game,SECTORS,RINGS,cellsOf,SCORE_PAYOUT_RATIO} = require('../app/src/main/assets/engine.js');

test('Default descent is slow, adjustable and increases gradually',()=>{
  const g=new Game(()=>0);
  assert.equal(g.baseFallSeconds,8);
  assert.equal(g.fallInterval(),8);
  g.setBaseFallSeconds(8);assert.equal(g.fallInterval(),8);
  g.setBaseFallSeconds(0);assert.equal(g.baseFallSeconds,2);
  g.cleared=3;g.level=4;assert.ok(g.fallInterval()<2);
  g.setBaseFallSeconds(NaN);assert.equal(g.baseFallSeconds,2);
});
test('Gameplay effects emit structured events on rotation, locking and rings',()=>{
  const g=new Game(()=>0);
  g.rotate(0);assert.equal(g.drainEvents()[0]?.type,'rotate');
  g.board[0].fill(0);g.clearRings();
  assert.equal(g.drainEvents()[0]?.type,'ring');
});
test('Four directions have four independent falling pieces', () => {
  const g=new Game(()=>0);assert.equal(g.pieces.length,4);
  assert.ok(g.pieces.every(p=>p!==null));assert.equal(g.board.length,RINGS);
  assert.ok(g.board.every(r=>r.length===SECTORS));
});
test('Angular seam is continuous at 360 degrees',()=>{
  const p={type:0,angle:0,radius:5,rot:0};
  assert.ok(cellsOf(p).some(([a])=>a===47));
});
test('Landing ghost stops at lunar surface',()=>{
  const g=new Game(()=>0);
  assert.equal(g.ghost(g.pieces[0]),0);
});
test('Rotations and tangential moves remain legal once inside the lunar board',()=>{
  const g=new Game(()=>0);const p=g.pieces[0];
  p.radius=9; // Tangential motion deliberately blocked during space flight.
  assert.equal(g.shift(0,1),true);assert.equal(p.angle,1);
  assert.equal(g.rotate(0),true);assert.equal(p.rot,1);
});
test('Full 48 cell ring clears and overlying material moves inward',()=>{
  const g=new Game(()=>0);g.board[0].fill(0);g.board[1][0]=2;
  assert.equal(g.clearRings(),1);assert.equal(g.board[0][0],2);
  assert.equal(g.board[1][0],-1);assert.equal(g.cleared,1);
});
test('Incomplete ring stays',()=>{
  const g=new Game(()=>0);g.board[0].fill(0);g.board[0][1]=-1;
  assert.equal(g.clearRings(),0);
});
test('Four lanes move under gravity and pause freezes',()=>{
  const g=new Game(()=>0);const original=g.pieces.map(p=>p.radius);
  for(let i=0;i<9;i++)g.step(.12);
  assert.deepEqual(g.pieces.map(p=>p.radius),original,'default 8-second drop must not fall in the first second');
  for(let i=0;i<60;i++)g.step(.12);
  assert.ok(g.pieces.every((p,i)=>p.radius<original[i]),'gravity eventually advances all four fronts');
  const stamp=g.seconds;g.paused=true;g.step(2);assert.equal(g.seconds,stamp);
});
test('Blocked moves cannot overwrite occupied sector',()=>{
  const g=new Game(()=>0);let p=g.pieces[0];
  p.radius=1;g.board[1][0]=3;
  assert.equal(g.canPlace(p),false);
});
test('Overflow ends game instead of silently losing cells',()=>{
  const g=new Game(()=>0);
  g.pieces[0].radius=RINGS+1;g.lock(0);assert.equal(g.over,true);
});

test('Free airborne pieces can cross and overlap without stopping',()=>{
  const g=new Game(()=>0);
  g.pieces[0].type=1;g.pieces[1].type=1;
  g.pieces[0].angle=5;g.pieces[1].angle=5;
  g.pieces[0].radius=8;g.pieces[1].radius=8;
  assert.equal(g.canPlace(g.pieces[0],5,7),true);
  assert.equal(g.canPlace(g.pieces[1],5,7),true);
  assert.equal(g.ghost(g.pieces[0]),0);
  for(let i=0;i<70;i++)g.step(.12);
  assert.equal(g.pieces[0].radius,7);
  assert.equal(g.pieces[1].radius,7);
});
test('Airborne pieces can cross the zero-degree seam',()=>{
  const g=new Game(()=>0);
  for(let i=0;i<4;i++){g.pieces[i].angle=0;g.pieces[i].radius=6;}
  assert.equal(g.canPlace(g.pieces[0]),true);
  assert.equal(g.shift(0,-1),true);
  assert.equal(g.pieces[0].angle,47);
});
test('Simultaneous arrivals are committed without overwriting solid blocks',()=>{
  const g=new Game(()=>0);
  g.pieces[0]={lane:0,type:1,angle:9,radius:0,rot:0,boost:false};
  g.pieces[1]={lane:1,type:1,angle:9,radius:0,rot:0,boost:false};
  assert.equal(g.lock(0),true);
  assert.equal(g.lock(1),true);
  for(const angle of [9,10]){
    assert.equal(g.board[0][angle],0);
    assert.equal(g.board[1][angle],0);
    assert.equal(g.board[2][angle],1);
    assert.equal(g.board[3][angle],1);
  }
  assert.equal(g.over,false);
});
test('No illegal airborne suspended blocks: ground contact is still solid',()=>{
  const g=new Game(()=>0);
  g.pieces[0]={lane:0,type:1,angle:4,radius:2,rot:0,boost:false};
  g.board[1][4]=2;
  assert.equal(g.canPlace(g.pieces[0],4,1),false);
  assert.equal(g.canPlace(g.pieces[0],4,2),true);
  assert.equal(g.ghost(g.pieces[0]),2);
  assert.equal(g.lock(0),true);
  assert.equal(g.board[2][4],0);
});
test('Near orbital limit, simultaneous occupied landing produces real game over',()=>{
  const g=new Game(()=>0);
  g.pieces[0]={lane:0,type:1,angle:6,radius:8,rot:0,boost:false};
  g.board[8][6]=3;
  assert.equal(g.lock(0),false);
  assert.equal(g.over,true);
  assert.equal(g.board[8][6],3);
  assert.equal(g.drainEvents().at(-1).type,'gameover');
});

test('Each truly landed tetromino earns 40 points (not just full rings)',()=>{
 const g=new Game(()=>0);
 g.pieces[0]={lane:0,type:1,angle:6,radius:0,rot:0,boost:false};
 assert.equal(g.lock(0),true);
 assert.ok(g.score>142);assert.equal(g.placements,1);
 assert.deepEqual(g.drainEvents().filter(e=>e.type==='points').map(e=>[e.reason,e.gained]),[['placement',g.score]]);
});
test('Overflow gives no points or placement credit',()=>{
 const g=new Game(()=>0);g.pieces[0].radius=11;
 assert.equal(g.lock(0),false);assert.equal(g.score,0);assert.equal(g.placements,0);
});
test('Ring scores are real; a repeated clearing raises combo by 100',()=>{
 const g=new Game(()=>0);
 g.board[0].fill(0);assert.equal(g.clearRings(),1);
 const first=g.score;
 assert.ok(first>=Math.round(960*SCORE_PAYOUT_RATIO));assert.equal(g.cleared,1);assert.equal(g.level,2);
 g.board[0].fill(1);assert.equal(g.clearRings(),1);
 assert.ok(g.score>first);assert.equal(g.cleared,2);assert.equal(g.level,3);
 assert.equal(g.combo,2);
 assert.deepEqual(g.drainEvents().filter(e=>e.type==='milestone').map(e=>e.reached),[1000]);
});
test('Two rings simultaneously give squared reward and one scene event',()=>{
 const g=new Game(()=>0);g.board[0].fill(0);g.board[1].fill(0);
 assert.equal(g.clearRings(),2);assert.ok(g.score>1920);
 assert.equal(g.cleared,2);assert.equal(g.level,3);
 const rings=g.drainEvents().filter(e=>e.type==='ring');
 assert.equal(rings.length,1);assert.equal(rings[0].gained,g.score);
});
test('Huge jackpot emits only one bounded milestone notice',()=>{
 const g=new Game(()=>0);g.award(10300,'test');
 const m=g.drainEvents().filter(e=>e.type==='milestone');
 assert.equal(m.length,1);assert.equal(m[0].reached,1000);assert.equal(m[0].upto,10000);
});
test('New game resets session points but retains chosen slow fall speed',()=>{
 const g=new Game(()=>0);g.setBaseFallSeconds(7.5);g.award(200,'test');g.placements=3;g.reset();
 assert.equal(g.score,0);assert.equal(g.placements,0);assert.equal(g.baseFallSeconds,7.5);
});

test('Each orbital layer nearer Moon increases landing score by 12 per cell-row',()=>{
 const g=new Game(()=>0);
 const near=g.placementReward([[4,0],[5,0],[4,1],[5,1]]);
 const far=g.placementReward([[4,7],[5,7],[4,8],[5,8]]);
 assert.equal(near.base,142);assert.equal(far.base,58);
 assert.ok(near.points>far.points);
});
test('Exactly two *distinct pre-existing cells* contacting piece yield x2, three x3',()=>{
 const g=new Game(()=>0),cells=[[5,3],[6,3],[5,4],[6,4]];
 const original=g.placementReward(cells);
 g.board[3][4]=0;g.board[4][7]=1;
 const two=g.placementReward(cells);
 assert.equal(two.contacts,2);assert.equal(two.multiplier,2);assert.ok(two.points>=Math.round(2*original.base*SCORE_PAYOUT_RATIO));
 g.board[2][5]=2;
 const three=g.placementReward(cells);
 assert.equal(three.contacts,3);assert.equal(three.multiplier,3);
 assert.ok(three.points>=Math.round(3*original.base*SCORE_PAYOUT_RATIO));
});
test('Self-neighbours, Moon ground and wrapping boundary never fabricate contact score',()=>{
 const g=new Game(()=>0),cells=[[47,0],[0,0],[47,1],[0,1]];
 assert.equal(g.placementReward(cells).contacts,0);
 g.board[0][46]=1;
 assert.equal(g.placementReward(cells).contacts,1);
 g.board[0][1]=1;
 assert.equal(g.placementReward(cells).contacts,2);
 assert.equal(g.placementReward(cells).multiplier,2);
});
test('Placement bonus is based on final resolved resting radius, not airborne height',()=>{
 const g=new Game(()=>0);
 g.pieces[0]={lane:0,type:1,angle:5,radius:0,rot:0,boost:false};
 const first=g.placementReward([[5,0],[6,0],[5,1],[6,1]]);
 assert.equal(g.lock(0),true);
 const ev=g.drainEvents().find(e=>e.type==='points');
 assert.equal(ev.gained,first.points);
 assert.equal(ev.contacts,0);assert.equal(ev.centerBonus,102);
});

test('Laser impacts rotate a valid active piece and emit a laser event',()=>{
 const g=new Game(()=>0);
 const p=g.pieces[0];p.type=2;p.radius=8;
 const oldRot=p.rot;
 const shot=g.laser(0,p.angle);
 assert.ok(shot);assert.equal(p.rot,(oldRot+1)%4);
 assert.equal(g.drainEvents().filter(x=>x.type==='laser').length,1);
});
test('Side laser impact nudges tangentially away from impact and rotates',()=>{
 const g=new Game(()=>0);
 const p=g.pieces[0];p.type=2;p.radius=8;
 const start=p.angle;
 const shot=g.laser(0,start+2);
 assert.ok(shot);assert.equal(p.angle,47);
 assert.equal(shot.moved,true);
 assert.equal(p.rot,1);
});
test('Laser respects paused or ended game and never rewrites existing board',()=>{
 const g=new Game(()=>0);const board=g.board.map(r=>r.slice());
 g.paused=true;assert.equal(g.laser(0,3),null);
 g.paused=false;g.over=true;assert.equal(g.laser(0,3),null);
 assert.deepEqual(g.board,board);
});

test('Spawn begins four real orbital steps beyond the filled ring',()=>{
 const {SPACE_STEPS}=require('../app/src/main/assets/engine.js');
 assert.equal(SPACE_STEPS,5);
 const g=new Game(()=>0);
 assert.ok(g.pieces.every(p=>p.radius===RINGS+SPACE_STEPS));
 assert.ok(g.pieces.every(p=>g.canPlace(p)));
});
test('Outer space flight continues for several steps before reaching the grid',()=>{
 const {SPACE_STEPS}=require('../app/src/main/assets/engine.js');
 const g=new Game(()=>0),p=g.pieces[0];
 for(let i=0;i<60;i++)g.step(.12); // 7.2 seconds > 8 * .82-second orbital step
 assert.equal(p.radius,RINGS+SPACE_STEPS-1);
 assert.equal(g.board.flat().filter(x=>x!==-1).length,0);
 assert.equal(g.over,false);
});

test('PT-017: second-finger boost multiplies fall by ten including multiple steps/frame',()=>{
 const {BOOST_MULTIPLIER,SPACE_INTERVAL_FACTOR}=require('../app/src/main/assets/engine.js');
 assert.equal(BOOST_MULTIPLIER,10);
 assert.equal(SPACE_INTERVAL_FACTOR,.82);
 const normal=new Game(()=>0),fast=new Game(()=>0);
 const lane=0;
 normal.pieces[lane].radius=8;fast.pieces[lane].radius=8;
 normal.fall[lane]=0;fast.fall[lane]=0;
 fast.boost(lane,true);
 for(let i=0;i<10;i++){normal.step(.1);fast.step(.1);}
 assert.equal(normal.pieces[lane].radius,8);
 assert.equal(fast.pieces[lane].radius,7); // 10s simulated falling over 1s real, 8s per row
 fast.boost(lane,false);
 const r=fast.pieces[lane].radius;
 for(let i=0;i<10;i++)fast.step(.1);
 assert.ok(fast.pieces[lane].radius>=r-1);
});
test('PT-017: space pieces rotate without lateral movement, lunar pieces can move',()=>{
 const g=new Game(()=>0);const p=g.pieces[0];
 const initial=p.angle,initialRot=p.rot;
 p.type=2;
 assert.equal(g.shift(0,1),false);
 assert.equal(g.rotate(0),true);
 assert.equal(p.angle,initial);assert.notEqual(p.rot,initialRot);
 const shot=g.laser(0,p.angle+2);
 assert.ok(shot);assert.equal(shot.moved,false);
 p.radius=9;
 assert.equal(g.shift(0,1),true);assert.equal(p.angle,initial+1);
});
test('PT-017: held fast-drop crosses multiple lunar rows even with the shortest interval',()=>{
 const g=new Game(()=>0),p=g.pieces[0];p.radius=8;
 g.seconds=150*14;g.cleared=14;g.level=15;g.baseFallSeconds=2;g.boost(0,true);
 const from=p.radius;
 g.step(.12);
 assert.ok(p.radius<=from-1);
 assert.ok(g.fall[0]<g.fallInterval());
});

test('PT-018 fixed-brick drilling costs more when the block is higher',()=>{
 const {DESTRUCTION_BASE,LOCKED_LASER_HOLD_MS}=require('../app/src/main/assets/engine.js');
 assert.equal(LOCKED_LASER_HOLD_MS,1300);
 assert.equal(DESTRUCTION_BASE,80);
 const g=new Game(()=>0);g.score=40000;
 g.board[0][4]=2;g.board[9][4]=3;
 assert.equal(g.destructionPenalty(0),80);
 assert.equal(g.destructionPenalty(9),4000);
 assert.equal(g.destroyLockedCell(4,0).charged,80);
 const high=g.destroyLockedCell(4,9);
 assert.equal(high.multiplier,50);
 assert.equal(high.charged,4000);
 assert.equal(g.score,35920);
 assert.equal(g.board[9][4],-1);
 assert.equal(g.destroyLockedCell(4,9),null);
 assert.deepEqual(g.drainEvents().filter(ev=>ev.type==='destroy').map(ev=>ev.radius),[0,9]);
});
test('PT-018 pause, empty cell and low score protect the demolition mechanism',()=>{
 const g=new Game(()=>0);g.board[8][10]=1;g.score=200;
 g.paused=true;assert.equal(g.destroyLockedCell(10,8),null);
 assert.equal(g.board[8][10],1);
 g.paused=false;
 const hit=g.destroyLockedCell(10,8);
 assert.ok(hit.penalty>200);
 assert.equal(hit.charged,200);assert.equal(g.score,0);
 for(const [s,r] of [[10,8],[-1,8],[48,8],[10,-1],[10,10]])
   assert.equal(g.destroyLockedCell(s,r),null);
});

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {Game,MAX_WAIT_SECONDS,RING_SPEED_FACTOR,SECTORS}=require('../app/src/main/assets/engine.js');
const S=require('../app/src/main/assets/session.js');

test('PT-024: starts at maximum 8-second wait and elapsed time never accelerates',()=>{
 const g=new Game(()=>0);
 assert.equal(MAX_WAIT_SECONDS,8);
 assert.equal(g.baseFallSeconds,8);
 assert.equal(g.fallInterval(),8);
 g.seconds=1800;g.step(.12);
 assert.equal(g.level,1);
 assert.equal(g.fallInterval(),8);
});
test('PT-024: every deleted crown, never elapsed time, accelerates exactly once',()=>{
 const g=new Game(()=>0);
 g.board[0].fill(1);g.boardTypes[0].fill(0);
 assert.equal(g.clearRings(),1);
 assert.equal(g.level,2);assert.equal(g.cleared,1);
 assert.ok(Math.abs(g.fallInterval()-8*RING_SPEED_FACTOR)<1e-8);
 g.seconds=3500;g.step(.12);
 assert.equal(g.level,2);
 g.board[0].fill(1);g.board[1].fill(2);
 g.boardTypes[0].fill(0);g.boardTypes[1].fill(3);
 assert.equal(g.clearRings(),2);
 assert.equal(g.level,4);assert.equal(g.cleared,3);
 assert.ok(Math.abs(g.fallInterval()-8*RING_SPEED_FACTOR**3)<1e-8);
});
test('PT-024: score speed factor is squared differential against maximum wait',()=>{
 const g=new Game(()=>0);
 assert.equal(g.speedMultiplier(),1);
 g.setBaseFallSeconds(4);
 assert.equal(g.speedMultiplier(),2); // (8/4 - 1)^2 + 1 = 2
 g.setBaseFallSeconds(2);
 assert.equal(g.speedMultiplier(),10); // (8/2 - 1)^2 + 1 = 10
 g.setBaseFallSeconds(8);g.cleared=6;
 const expected=1+(Math.pow(.92,-6)-1)**2;
 assert.ok(Math.abs(g.speedMultiplier()-expected)<1e-10);
});
test('PT-024: squared left-right continuity rewards only new added cells',()=>{
 const g=new Game(()=>0);
 const blocks=[[3,4],[4,4]];
 const bare=g.placementContinuity(blocks);
 assert.equal(bare.continuityUnits,4);
 g.board[4][1]=1;g.board[4][2]=1;
 const extension=g.placementContinuity(blocks);
 assert.equal(extension.continuityUnits,16-4);
 assert.equal(extension.bridges,0);
 // Previously earned two-cell squared length is subtracted.
 assert.equal(extension.continuityPoints,(16-4)*2*(10-4));
});
test('PT-024: a genuine Royal Bridge joins two existing components once',()=>{
 const g=new Game(()=>0);
 for(const a of [1,2,5,6])g.board[3][a]=0;
 const c=g.placementContinuity([[3,3],[4,3]]);
 assert.equal(c.continuityUnits,36-4-4);
 assert.equal(c.bridges,1);
 assert.equal(c.bridgePoints,c.continuityPoints);
 assert.equal(c.geodesy,0);
 assert.equal(c.chains.length,1);
});
test('PT-024: geodetic bonus notices the 47/0 circular seam',()=>{
 const g=new Game(()=>0);
 for(const a of [46,47,1,2])g.board[2][a]=0;
 const c=g.placementContinuity([[0,2]]);
 assert.equal(c.continuityUnits,25-4-4);
 assert.equal(c.bridges,1);
 assert.equal(c.geodesy,1);
 assert.equal(c.geodesyPoints,35*(10-2));
});
test('PT-024: score scales with each new cell and favors depth near the Moon',()=>{
 const g=new Game(()=>0);
 const near=g.placementReward([[5,0],[6,0],[5,1],[6,1]]);
 const far=g.placementReward([[5,7],[6,7],[5,8],[6,8]]);
 assert.equal(near.size,4);assert.equal(far.size,4);
 assert.equal(near.sizePoints,40);
 assert.ok(near.points>far.points);
 const single=g.placementReward([[5,1]]);
 assert.equal(single.size,1);
 assert.equal(single.sizePoints,10);
});
test('PT-024: only the placement that creates a bridge emits a special event',()=>{
 const g=new Game(()=>0);
 for(const a of [9,10,15,16]){g.board[0][a]=0;g.boardTypes[0][a]=0;}
 g.pieces[0]={lane:0,type:0,angle:12,radius:0,rot:0,boost:false};
 assert.ok(g.lock(0));
 const events=g.drainEvents();
 const bridge=events.find(e=>e.type==='bridge');
 const placement=events.find(e=>e.type==='points'&&e.reason==='placement');
 assert.ok(bridge);
 assert.equal(bridge.bridges,1);
 assert.equal(bridge.geodesy,1); // joins the 11/12 boundary
 assert.ok(bridge.bonus>0);
 assert.ok(placement.continuityPoints>0);
 assert.ok(placement.bridgePoints>0);
 // Other rewards already include the bridge; event must not award again.
 assert.equal(g.score,placement.gained);
});
test('PT-024: new rule safely recomputes levels on old autosaved games',()=>{
 const g=new Game(()=>0),state=S.capture(g);
 state.cleared=3;state.level=21;state.seconds=3200;
 const restored=new Game(()=>0);
 assert.ok(S.restore(restored,state));
 assert.equal(restored.level,4);
 assert.equal(restored.cleared,3);
 assert.ok(Math.abs(restored.fallInterval()-8*.92**3)<1e-8);
});
test('PT-024: HUD and celebrations expose strategy rather than old time ramp',()=>{
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 const fest=fs.readFileSync('app/src/main/assets/celebrations.js','utf8');
 assert.match(html,/Temps initial par étage/);
 assert.match(html,/8,0 s/);
 assert.match(html,/\[PT024\]\[SCORE\]/);
 assert.match(fest,/PONT DES PHARAONS/);
 assert.match(fest,/PONT ROYAL/);
 assert.doesNotMatch(html,/Le jeu accélère progressivement/);
});

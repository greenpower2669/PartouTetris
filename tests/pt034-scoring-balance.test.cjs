const test=require('node:test');
const assert=require('node:assert/strict');
const {Game,SCORE_PAYOUT_RATIO,SPEED_BONUS_CAP}=require('../app/src/main/assets/engine.js');
const Session=require('../app/src/main/assets/session.js');

test('PT034: squared demolition cost follows permanent game speed, not touch ×10',()=>{
  const g=new Game(()=>0);
  assert.equal(g.destructionPenalty(0),80);
  assert.equal(g.destructionPenalty(9),4000);
  g.setBaseFallSeconds(4);
  assert.equal(g.destructionPenalty(0),320); // (8 / 4)^2 = 4
  assert.equal(g.destructionPenalty(9),16000);
  g.setBaseFallSeconds(2);
  assert.equal(g.destructionPenalty(0),1280); // (8 / 2)^2 = 16
  assert.equal(g.destructionPenalty(9),64000);
  const unchanged=g.destructionPenalty(2);
  g.boost(0,true);
  assert.equal(g.destructionPenalty(2),unchanged);
  g.boost(0,false);
  g.setBaseFallSeconds(8);
  g.cleared=1; // one crown permanently speeds up gravity
  assert.equal(g.destructionPenalty(0),Math.round(80/(.92*.92)));
});

test('PT034: demolition emits full computed cost but never creates negative score',()=>{
  const g=new Game(()=>0);
  g.setBaseFallSeconds(2);g.score=900;g.board[0][4]=2;g.boardTypes[0][4]=3;
  const ev=g.destroyLockedCell(4,0);
  assert.equal(ev.penalty,1280);assert.equal(ev.charged,900);
  assert.equal(ev.speedPenaltyMultiplier,16);
  assert.equal(ev.multiplier,1);assert.equal(g.score,0);
  assert.equal(g.board[0][4],-1);assert.equal(g.boardTypes[0][4],-1);
});

test('PT034: new placement rewards have a 35 percent haircut and ×10 max flight factor',()=>{
  const g=new Game(()=>0),p=g.pieces[0];p.radius=0;
  assert.equal(SCORE_PAYOUT_RATIO,.65);assert.equal(SPEED_BONUS_CAP,10);
  g.seconds=g.nominalFlightSeconds(p)/100;
  assert.equal(g.flightSpeedMultiplier(p),10);
  const blocks=[[5,0],[6,0],[5,1],[6,1]];
  const reward=g.placementReward(blocks,100);
  const raw=reward.base*reward.multiplier+reward.continuityPoints+
    reward.bridgePoints+reward.geodesyPoints;
  assert.equal(reward.speedMultiplier,10);
  assert.equal(reward.points,Math.round(raw*10*.65));
  assert.equal(g.placementReward(blocks).points,Math.round(raw*.65));
});

test('PT034: crown bonus uses same 35 percent reduction and ×10 speed cap',()=>{
  const g=new Game(()=>0);g.board[0].fill(1);
  assert.equal(g.clearRings(100),1);
  const ev=g.drainEvents().find(e=>e.type==='ring');
  assert.equal(ev.speedMultiplier,10);
  assert.equal(ev.gained,6240); // old 960 × 10 × 0.65
  assert.equal(g.score,6240);
});

test('PT034: old session points are not rescaled by scoring update',()=>{
  const old=new Game(()=>0);old.score=123456;old.placements=8;
  const saved=Session.capture(old),restored=new Game(()=>0);
  assert.ok(Session.restore(restored,saved));
  assert.equal(restored.score,123456);
  assert.equal(restored.placements,8);
});

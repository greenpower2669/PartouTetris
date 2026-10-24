const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {findLocked}=require('../app/src/main/assets/laser-aim.js');
const cfg={cx:200,cy:350,inner:55,stepR:11,sectors:48};
const board=()=>Array.from({length:10},()=>Array(48).fill(-1));
const pt=(s,r)=>{const a=-Math.PI/2+(s+.5)*2*Math.PI/48,R=55+(r+.5)*11;
return {x:200+Math.cos(a)*R,y:350+Math.sin(a)*R}};
test('PT-019 direct laser hit targets a locked annular brick',()=>{
 const b=board();b[3][7]=1;const p=findLocked({board:b,...cfg,...pt(7,3)});
 assert.equal(p.ring,3);assert.equal(p.sector,7);
});
test('PT-019 magnetic aim helps shaky fingers but ignores empty space and active pieces',()=>{
 const b=board();b[7][29]=2;const p=pt(29,7);
 const hit=findLocked({board:b,...cfg,x:p.x+13,y:p.y+16});
 assert.equal(hit.ring,7);assert.equal(hit.sector,29);
 assert.equal(findLocked({board:b,...cfg,x:0,y:0}),null);
 assert.equal(findLocked({board:board(),...cfg,...p}),null);
});
test('PT-019 focus is not reset by pointerup, charge and destruction take 1300ms',()=>{
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 const {LOCKED_LASER_HOLD_MS}=require('../app/src/main/assets/engine.js');
 assert.equal(LOCKED_LASER_HOLD_MS,1300);
 assert.match(html,/id="laserFocusHud"/);
 assert.match(html,/findLocked\(/);
 assert.match(html,/laserTarget=\{\.\.\.fixed,startedAt:now\}/);
 assert.match(html,/laserFocusBar\.style\.width=Math\.round\(fraction\*100\)/);
 assert.match(html,/if\(laserMode\)return; \/\/ focus persists after pointerup\/pointercancel/);
});

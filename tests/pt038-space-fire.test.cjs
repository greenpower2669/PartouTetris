const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {Game,RINGS}=require('../app/src/main/assets/engine.js');
test('PT038: only a parachute-phase piece catches fire',()=>{
 const g=new Game(()=>0);const p=g.pieces[0];
 assert.equal(g.ignite(0),false);p.radius=7;
 assert.equal(g.ignite(0),true);assert.equal(p.ignitedUntil,4);
 assert.equal(g.drainEvents().at(-1).type,'ignite');
});
test('PT038: fire descent is independent from manual x10 and expires',()=>{
 const g=new Game(()=>0);const p=g.pieces[0];p.radius=8;
 assert.equal(g.ignite(0),true);
 g.step(.1);assert.ok(g.fall[0]>.29&&g.fall[0]<.31);
 g.boost(0,true);g.step(.1);assert.ok(g.fall[0]>1.29);
 g.boost(0,false);g.seconds=5;const v=g.fall[0];g.step(.1);
 assert.ok(g.fall[0]-v<.11);
});
test('PT038: ignition never reaches later respawned piece',()=>{
 const g=new Game(()=>0);g.pieces[0].radius=0;g.ignite(0);
 g.lock(0);assert.equal(g.pieces[0].ignitedUntil,0);
});
test('PT038: aura in space and fiery canopy event are render-only',()=>{
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 assert.match(html,/if\(p\.lane===selected\)\{/);
 assert.match(html,/ctx\.shadowBlur=18\+26\*pulse/);
 assert.match(html,/const burning=\(p\.ignitedUntil\|\|0\)>game\.seconds/);
 assert.match(html,/game\.ignite\(lane\)/);
 assert.match(html,/PARACHUTE EN FEU/);
 assert.match(html,/window\.PartouTangentLanding\.drawLocalTangent/);
});

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {BoostSources}=require('../app/src/main/assets/boost-sources.js');
function rig(){
 const boost=[false,false,false,false],events=[];
 const s=new BoostSources((lane,on)=>{boost[lane]=on;events.push([lane,on]);});
 return {s,boost,events};
}
test('PT-021 button release stops original front even if selection changed',()=>{
 const {s,boost,events}=rig();
 s.set('button',2,true);
 // Selection change to 0 has NO effect on held ownership of lane 2.
 assert.deepEqual(boost,[false,false,true,false]);
 s.set('button',0,false);
 assert.deepEqual(boost,[false,false,false,false]);
 assert.deepEqual(events,[[2,true],[2,false]]);
});
test('PT-021 overlapping second finger and button cannot interrupt each other',()=>{
 const {s,boost,events}=rig();
 s.set('touch',1,true);
 s.set('button',1,true);
 s.set('touch',1,false);
 assert.equal(boost[1],true,'button must keep x10 active');
 s.set('button',0,false);
 assert.equal(boost[1],false);
 assert.deepEqual(events,[[1,true],[1,false]]);
});
test('PT-021 a new owner never inherits acceleration across fronts',()=>{
 const {s,boost,events}=rig();
 s.set('keyboard',0,true);s.set('button',3,true);
 assert.deepEqual(boost,[true,false,false,true]);
 s.set('keyboard',0,false);
 assert.deepEqual(boost,[false,false,false,true]);
 s.clear();
 assert.deepEqual(boost,[false,false,false,false]);
 assert.deepEqual(events,[[0,true],[3,true],[0,false],[3,false]]);
});
test('PT-021 input repeats and stray releases never toggle boost',()=>{
 const {s,events}=rig();
 assert.equal(s.set('button',2,false),false);
 assert.equal(s.set('button',2,true),true);
 assert.equal(s.set('button',2,true),false);
 assert.equal(s.set('button',0,false),true);
 assert.equal(s.set('button',0,false),false);
 assert.deepEqual(events,[[2,true],[2,false]]);
});
test('PT-021 UI routes boost sources through owner manager without radial gestures',()=>{
 const touch=fs.readFileSync('app/src/main/assets/touch.js','utf8');
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 assert.doesNotMatch(touch,/grip\.inward|g\.inward|startDistance-17/);
 assert.match(touch,/t\.long&&!t\.moved/);
 assert.match(html,/new window\.PartouBoostSources\.BoostSources/);
 assert.match(html,/boostSources\.set\("touch"/);
 assert.match(html,/boostSources\.set\("button"/);
 assert.match(html,/boostSources\.set\("keyboard"/);
 assert.match(html,/\[PT021\]\[BOOST\]/);
});

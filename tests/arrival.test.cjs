const test=require('node:test');
const assert=require('node:assert/strict');
const {projectEarthApproach}=require('../app/src/main/assets/arrival.js');
const earth={x:206,y:835,r:210};
test('Space flight starts at Earth and ends on the correct lunar front',()=>{
 for(let lane=0;lane<4;lane++){
  const sector=lane*12;
  const params={earth,cx:206,cy:444,outer:166,sector,lane,rings:10,spaceSteps:5};
  const start=projectEarthApproach({...params,radial:15});
  const halfway=projectEarthApproach({...params,radial:12.5});
  const end=projectEarthApproach({...params,radial:10});
  assert.ok(Math.abs(start.x-start.launch.x)<1e-6);
  assert.ok(Math.abs(start.y-start.launch.y)<1e-6);
  assert.ok(Math.abs(end.x-end.endpoint.x)<1e-6);
  assert.ok(Math.abs(end.y-end.endpoint.y)<1e-6);
  assert.ok(halfway.progress>.45&&halfway.progress<.55);
  assert.ok(start.scale<end.scale);
 }
});
test('Four directions remain distinct and travel inward from viewer toward Moon',()=>{
 const ends=Array.from({length:4},(_,lane)=>projectEarthApproach({
  earth,cx:206,cy:444,outer:166,sector:lane*12,lane,radial:10
 }));
 assert.ok(ends[0].y<444);assert.ok(ends[2].y>444);
 assert.ok(ends[1].x>206);assert.ok(ends[3].x<206);
 assert.ok(projectEarthApproach({earth,cx:206,cy:444,outer:166,sector:0,lane:0,radial:15,spaceSteps:5,rings:10,stepFraction:.5}).progress>.0);
});

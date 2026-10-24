const test=require("node:test");
const assert=require("node:assert/strict");
const {projectDrag}=require("../app/src/main/assets/tangent-control.js");
const {TwoHandControls}=require("../app/src/main/assets/touch.js");
function drag(angle,dx,dy,extras={}){
  return projectDrag({from:{x:25,y:220,time:0},
    to:{x:25+dx,y:220+dy,time:120},angle,sectorCount:48,
    centerX:180,centerY:300,orbitRadius:100,screenWidth:360,...extras});
}
test("PT026: moving right keeps on-screen direction at top and bottom",()=>{
  assert.ok(drag(0,25,0).sectorDelta>0);
  assert.ok(drag(24,25,0).sectorDelta<0);
  assert.ok(Math.abs(drag(0,25,0).sectorDelta+drag(24,25,0).sectorDelta)<1e-9);
});
test("PT026: moving down keeps on-screen direction at both sides",()=>{
  assert.ok(drag(12,0,30).sectorDelta>0);
  assert.ok(drag(36,0,30).sectorDelta<0);
});
test("PT026: diagonal positions rotate tangent smoothly, not by quadrants",()=>{
  const a=drag(5,25,0).sectorDelta,b=drag(6,25,0).sectorDelta;
  const c=drag(7,25,0).sectorDelta;
  assert.ok(a>b&&b>c&&c>0);
  assert.ok(Math.abs(a-b)<1);
  assert.ok(Math.abs(b-c)<1);
});
test("PT026: projected observer is behind the Moon, opposing the piece",()=>{
  const a=drag(0,0,0),b=drag(12,0,0),c=drag(24,0,0);
  assert.ok(a.observer.y>300);
  assert.ok(b.observer.x<180);
  assert.ok(c.observer.y<300);
});
test("PT026: changing radius or absolute finger position does not change angle precision",()=>{
 const start={x:320,y:700,time:100},end={x:343,y:700,time:180};
 const a=projectDrag({from:start,to:end,angle:0,orbitRadius:52,centerX:160,centerY:300,screenWidth:360});
 const b=projectDrag({from:start,to:end,angle:0,orbitRadius:160,centerX:160,centerY:300,screenWidth:360});
 const c=projectDrag({from:{x:25,y:60,time:100},to:{x:48,y:60,time:180},angle:0,orbitRadius:160,centerX:160,centerY:300,screenWidth:360});
 assert.ok(Math.abs(a.sectorDelta-b.sectorDelta)<1e-9);
 assert.ok(Math.abs(a.sectorDelta-c.sectorDelta)<1e-9);
});
test("PT026: stationary finger cannot move piece when observer follows it",()=>{
 for(const angle of [0,4,12,17,24,36,47])assert.equal(drag(angle,0,0).sectorDelta,0);
});
test("PT026: faster gestures offer more movement for the same displacement",()=>{
 const slow=projectDrag({from:{x:100,y:100,time:0},to:{x:130,y:100,time:250},angle:0,orbitRadius:95,screenWidth:400});
 const fast=projectDrag({from:{x:100,y:100,time:0},to:{x:130,y:100,time:20},angle:0,orbitRadius:95,screenWidth:400});
 assert.ok(fast.sectorDelta>slow.sectorDelta);
});
test("PT026: two-hand grip uses incremental projection but secondary tap still rotates",()=>{
 const events=[],controls=new TwoHandControls({
  chooseLane:()=>0,
  projectDrag:(lane,from,to)=>drag(0,to.x-from.x,to.y-from.y).sectorDelta,
  experimental:true,
  onSelect:l=>events.push(["select",l]),
  onMove:(l,d)=>events.push(["move",l,d]),
  onRotate:l=>events.push(["rotate",l]),
  onBoost:(l,v)=>events.push(["boost",l,v])
 });
 controls.down({id:1,x:80,y:320,angle:0,time:0});
 controls.move({id:1,x:110,y:320,angle:0,time:100});
 controls.down({id:2,x:40,y:100,angle:12,time:110});
 controls.up({id:2,x:40,y:100,angle:12,time:150});
 assert.ok(events.some(e=>e[0]==="move"&&e[2]>0));
 assert.deepEqual(events.filter(e=>e[0]==="rotate"),[["rotate",0]]);
 assert.equal(events.some(e=>e[0]==="boost"&&e[2]),false);
 controls.up({id:1,x:110,y:320,angle:0,time:200});
});

const test=require('node:test');
const assert=require('node:assert/strict');
const {TwoHandControls}=require('../app/src/main/assets/touch.js');
function rig(){
  const events=[];
  const controls=new TwoHandControls({
    chooseLane:a=>a<12?0:1,
    onSelect:l=>events.push(['select',l]),
    onMove:(l,d)=>events.push(['move',l,d]),
    onRotate:l=>events.push(['rotate',l]),
    onBoost:(l,v)=>events.push(['boost',l,v])
  });
  function p(id,angle=5,x=200,y=80,time=0,distance=70){return {id,angle,x,y,time,distance};}
  return {controls,events,p};
}
test('Right-hand grip persists while repeated left-hand taps rotate the held lane',()=>{
  const {controls:c,events:e,p}=rig();
  c.down(p(1,5,250,90,0)); // right finger holds lane 0
  c.down(p(2,18,40,100,50));c.up(p(2,18,41,102,115));
  c.down(p(3,18,40,100,160));c.up(p(3,18,42,101,210));
  assert.equal(c.isGripping(),true);
  assert.deepEqual(e.filter(x=>x[0]==='rotate'),[['rotate',0],['rotate',0]]);
  assert.deepEqual(e.filter(x=>x[0]==='select'),[['select',0]]);
});
test('Grip tangential motion continues while the other hand taps',()=>{
  const {controls:c,events:e,p}=rig();
  c.down(p(1,13,240,140,0));
  c.down(p(2,6,20,120,10));
  c.move(p(1,16.3,240,150,80));
  c.up(p(2,7,20,120,150));
  assert.ok(e.some(x=>x[0]==='move'&&x[1]===1));
  assert.deepEqual(e.filter(x=>x[0]==='rotate'),[['rotate',1]]);
});
test('Rotations require short stable second-finger taps, not slides, holds or cancels',()=>{
  const {controls:c,events:e,p}=rig();
  c.down(p(1,0,250,80,0));
  c.down(p(2,0,40,60,5));c.up(p(2,0,90,90,80));
  c.down(p(3,0,40,60,100));c.up(p(3,0,40,60,700));
  c.down(p(4,0,40,60,800));c.cancel(p(4,0,40,60,810));
  assert.equal(e.filter(x=>x[0]==='rotate').length,0);
});
test('Releasing gripping finger cancels secondary tap and clears fast fall',()=>{
  const {controls:c,events:e,p}=rig();
  c.down(p(1,0,250,80,0,100));
  c.move(p(1,1,250,80,20,50));
  c.down(p(2,0,50,80,25));c.up(p(1,1,250,80,30));
  c.up(p(2,0,50,80,45));
  assert.equal(c.isGripping(),false);
  assert.equal(e.filter(x=>x[0]==='rotate').length,0);
  assert.deepEqual(e.filter(x=>x[0]==='boost').at(-1),['boost',0,false]);
});
test('First-finger tap merely selects: no surprise rotation after releasing',()=>{
  const {controls:c,events:e,p}=rig();
  c.down(p(1,0,250,80,0));c.up(p(1,0,250,80,40));
  assert.deepEqual(e.filter(x=>x[0]==='rotate'),[]);
});
test('Rotation targets the newly grabbed piece after a release',()=>{
  const {controls:c,events:e,p}=rig();
  c.down(p(1,0));c.up(p(1,0,200,80,10));
  c.down(p(2,18,250,80,30));
  c.down(p(3,0,40,80,35));c.up(p(3,0,40,80,95));
  assert.deepEqual(e.filter(x=>x[0]==='rotate'),[['rotate',1]]);
});

test('Second finger long hold accelerates selected right-hand piece, without rotation',()=>{
 const {controls:c,events:e,p}=rig();
 c.down(p(1,5,240,90,0,90));
 c.down(p(2,18,50,85,20,110));
 c.tick(400);assert.equal(e.some(x=>x[0]==='boost'&&x[2]===true),false);
 c.tick(442);assert.deepEqual(e.filter(x=>x[0]==='boost').at(-1),['boost',0,true]);
 c.up(p(2,18,50,85,900,110));
 assert.deepEqual(e.filter(x=>x[0]==='boost').at(-1),['boost',0,false]);
 assert.equal(e.filter(x=>x[0]==='rotate').length,0);
 assert.equal(c.isGripping(),true);
});
test('Quick left tap still rotates and never starts boost',()=>{
 const {controls:c,events:e,p}=rig();
 c.down(p(1,4,250,90,0));c.down(p(2,18,30,100,50));
 c.tick(210);c.up(p(2,18,30,100,230));
 assert.deepEqual(e.filter(x=>x[0]==='rotate'),[['rotate',0]]);
 assert.equal(e.some(x=>x[0]==='boost'&&x[2]===true),false);
});
test('Moving the second finger past tolerance cancels its long hold',()=>{
 const {controls:c,events:e,p}=rig();
 c.down(p(1,4,250,90,0));c.down(p(2,18,30,100,10));
 c.move(p(2,18,100,100,80));
 c.tick(1000);
 assert.equal(e.some(x=>x[0]==='boost'&&x[2]===true),false);
 c.up(p(2,18,100,100,1200));
 assert.equal(e.some(x=>x[0]==='rotate'),false);
});
test('Ending primary grip while secondary held instantly cancels fast drop',()=>{
 const {controls:c,events:e,p}=rig();
 c.down(p(1,4,250,90,0));c.down(p(2,18,30,100,30));
 c.tick(520);c.up(p(1,4,250,90,540));
 assert.deepEqual(e.filter(x=>x[0]==='boost').at(-1),['boost',0,false]);
 c.up(p(2,18,30,100,600));
 assert.equal(e.some(x=>x[0]==='rotate'),false);
});
test('PT-021: dragging inward by 40 pixels while changing quadrant never accelerates',()=>{
 const {controls:c,events:e,p}=rig();
 c.down(p(1,4,250,90,0,140));
 // Long diagonal inward grip movement across two distinct quadrants.
 c.move(p(1,17,210,135,120,92));
 c.move(p(1,31,180,160,240,48));
 c.tick(1200);
 assert.equal(e.filter(x=>x[0]==='boost'&&x[2]===true).length,0);
 assert.ok(e.some(x=>x[0]==='move'));
 c.up(p(1,31,180,160,1250,48));
 assert.equal(e.filter(x=>x[0]==='boost'&&x[2]===true).length,0);
});
test('PT-021: releasing a deliberate second-finger hold stops x10 even if first finger moved inward',()=>{
 const {controls:c,events:e,p}=rig();
 c.down(p(1,4,250,90,0,90));c.move(p(1,4,250,90,20,50));
 c.down(p(2,18,30,100,30));c.tick(550);c.up(p(2,18,30,100,600));
 assert.deepEqual(e.filter(x=>x[0]==='boost').at(-1),['boost',0,false]);
 c.up(p(1,4,250,90,610));
});
test('PT-021: a second finger sliding after activation immediately stops boost',()=>{
 const {controls:c,events:e,p}=rig();
 c.down(p(1,4,250,90,0));
 c.down(p(2,18,35,100,100));
 c.tick(540);
 assert.deepEqual(e.filter(x=>x[0]==='boost').at(-1),['boost',0,true]);
 c.move(p(2,18,101,160,555));
 assert.deepEqual(e.filter(x=>x[0]==='boost').at(-1),['boost',0,false]);
 c.tick(1200);
 assert.deepEqual(e.filter(x=>x[0]==='boost'&&x[2]),[['boost',0,true]]);
 c.up(p(2,18,101,160,1300));
 assert.equal(e.filter(x=>x[0]==='rotate').length,0);
});

const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {projectedAnchor,GhostMoonGuide}=require("../app/src/main/assets/ghost-moon-guide.js");
const {projectDrag}=require("../app/src/main/assets/tangent-control.js");
const {axisForAngle}=require("../app/src/main/assets/joystick-guide.js");
function near(a,b,tol=1e-7){assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}`);}
function mock(){
 const calls=[];
 const ctx={save:()=>calls.push("save"),restore:()=>calls.push("restore"),
  beginPath(){},arc(){},fill(){},stroke(){}};
 return {ctx,calls};
}
function isInside(guide,center,finger){
 const ax=guide.anchor.x-center.x,ay=guide.anchor.y-center.y;
 const fx=finger.lastX-center.x,fy=finger.lastY-center.y;
 const dist=fx*fx+fy*fy;
 assert.ok(dist>0);
 const fraction=(ax*fx+ay*fy)/dist;
 assert.ok(fraction>.0&&fraction<1,`not inside segment: ${fraction}`);
 near(ax*fy-ay*fx,0,1e-5);
 return fraction;
}
test("PT031: projected centre lies strictly between Moon and finger all directions",()=>{
 const c={x:350,y:770};
 for(let angle=0;angle<48;angle++){
  const theta=-Math.PI/2+angle*Math.PI*2/48;
  for(const distance of [12,58,83,160,400]){
   const x=c.x+Math.cos(theta)*distance,y=c.y+Math.sin(theta)*distance;
   const a=projectedAnchor({x,y,moonCenter:c,radius:58});
   assert.ok(a);
   const grip={lastX:x,lastY:y};
   const segment=((a.x-c.x)*(x-c.x)+(a.y-c.y)*(y-c.y))/(distance**2);
   assert.ok(segment>0&&segment<1);
   near((a.x-c.x)*(y-c.y)-(a.y-c.y)*(x-c.x),0,1e-5);
  }
 }
});
test("PT031: finger travelling top-to-bottom moves the ghost centre down",()=>{
 const {ctx}=mock(),guide=new GhostMoonGuide(58),c={x:350,y:770};
 const grip={id:1,lane:0,lastX:350,lastY:560};
 assert.equal(guide.render(ctx,{grip,angle:0,moonCenter:c,time:0}),true);
 const topY=guide.anchor.y;
 grip.lastY=980;
 assert.equal(guide.render(ctx,{grip,angle:24,moonCenter:c,time:16}),true);
 const bottomY=guide.anchor.y;
 assert.ok(topY<c.y&&bottomY>c.y,`centre stayed frozen: ${topY}, ${bottomY}`);
 isInside(guide,c,grip);
});
test("PT031: mobile pivot never leaves C-to-finger segment in a 360-degree sweep",()=>{
 const {ctx}=mock(),guide=new GhostMoonGuide(),c={x:250,y:370};
 const grip={id:42,lane:1,lastX:250,lastY:160};
 let previous=null,largest=0;
 for(let i=0;i<=48;i++){
  const theta=-Math.PI/2+i*Math.PI*2/48;
  grip.lastX=c.x+210*Math.cos(theta);
  grip.lastY=c.y+210*Math.sin(theta);
  assert.equal(guide.render(ctx,{grip,angle:i%48,moonCenter:c,time:16*i}),true);
  isInside(guide,c,grip);
  if(previous){
   const moved=Math.hypot(guide.anchor.x-previous.x,guide.anchor.y-previous.y);
   largest=Math.max(largest,moved);
  }
  previous={...guide.anchor};
 }
 assert.ok(largest<29,`jump in guide centre of ${largest} px`);
 near(guide.anchor.x,c.x);
 assert.ok(guide.anchor.y<c.y);
});
test("PT031: slowly moving diagonal changes anchor smoothly, no frozen pivot",()=>{
 const {ctx}=mock(),guide=new GhostMoonGuide(),c={x:100,y:200};
 const grip={id:11,lane:2,lastX:230,lastY:330};
 guide.render(ctx,{grip,angle:6,moonCenter:c,time:0});
 let lastX=guide.anchor.x,lastY=guide.anchor.y;
 for(let i=1;i<=15;i++){
  grip.lastX+=4;grip.lastY+=3;
  guide.render(ctx,{grip,angle:6+i/4,moonCenter:c,time:i*16});
  assert.ok(guide.anchor.x>lastX&&guide.anchor.y>lastY);
  assert.ok(Math.hypot(guide.anchor.x-lastX,guide.anchor.y-lastY)<8);
  isInside(guide,c,grip);
  lastX=guide.anchor.x;lastY=guide.anchor.y;
 }
});
test("PT031: a still finger keeps pivot fixed despite piece rotation",()=>{
 const {ctx}=mock(),guide=new GhostMoonGuide(),c={x:130,y:320};
 const grip={id:11,lane:1,lastX:300,lastY:450};
 guide.render(ctx,{grip,angle:0,moonCenter:c,time:0});
 const a={...guide.anchor};
 for(let step=1;step<96;step++){
  const angle=step%48;
  assert.equal(guide.render(ctx,{grip,angle,moonCenter:c,time:step*16}),true);
  near(guide.anchor.x,a.x);near(guide.anchor.y,a.y);
  const t=axisForAngle(angle);
  const projection=projectDrag({
   from:{x:grip.lastX,y:grip.lastY,time:step*16-16},
   to:{x:grip.lastX,y:grip.lastY,time:step*16},
   angle,orbitRadius:85
  });
  near(projection.sectorDelta,0);
  near(t.x,projection.tangent.x);
  near(t.y,projection.tangent.y);
 }
});
test("PT031: release, pointer reassignment, laser/pause invalidation clears pivot",()=>{
 const {ctx}=mock(),guide=new GhostMoonGuide(),c={x:130,y:320};
 const grip={id:3,lane:0,lastX:340,lastY:300};
 guide.render(ctx,{grip,angle:12,moonCenter:c,time:0});
 let first={...guide.anchor};
 guide.hide();assert.equal(guide.anchor,null);assert.equal(guide.pointerId,null);
 grip.lastX=400;grip.lastY=500;
 guide.render(ctx,{grip,angle:19,moonCenter:c,time:16});
 assert.ok(Math.hypot(first.x-guide.anchor.x,first.y-guide.anchor.y)>60);
 first={...guide.anchor};
 grip.id=4;grip.lastX=250;grip.lastY=490;
 guide.render(ctx,{grip,angle:31,moonCenter:c,time:32});
 assert.ok(Math.hypot(first.x-guide.anchor.x,first.y-guide.anchor.y)>15);
 guide.render(ctx,{grip:null,angle:0,moonCenter:c,time:48});
 assert.equal(guide.anchor,null);
});
test("PT031: geometric guide is display-only, preserves PT030 score source",()=>{
 const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
 const ghost=fs.readFileSync("app/src/main/assets/ghost-moon-guide.js","utf8");
 const scoring=fs.readFileSync("app/src/main/assets/engine.js","utf8");
 assert.match(html,/ghostMoonGuide\.render\(ctx,\{grip,angle:target\?\.angle\?\?piece\.angle,/);
 assert.match(html,/moonCenter:\{x:cx,y:cy\},target,time/);
 assert.match(html,/window\.PartouGripVectors\.drawGripVectors/);
 assert.match(html,/src="tangent-control.js"/);
 assert.match(scoring,/flightSpeedMultiplier\(p\)/);
 assert.doesNotMatch(ghost,/game\.shift|game\.rotate|pointerdown|addEventListener|setPointerCapture/);
});

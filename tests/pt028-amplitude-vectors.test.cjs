const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {vectorsForGrip,drawGripVectors}=require("../app/src/main/assets/grip-vectors.js");
const {axisForAngle,railForAxis}=require("../app/src/main/assets/joystick-guide.js");
const {projectDrag}=require("../app/src/main/assets/tangent-control.js");
function near(a,b){assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);}
test("PT028 guide rail is the SAME length in every sector incl. diagonals",()=>{
 for(let angle=0;angle<48;angle++){
  const rail=railForAxis(axisForAngle(angle));
  near(Math.hypot(rail.b.x-rail.a.x,rail.b.y-rail.a.y),104);
  near(rail.half,52);
  assert.ok(rail.a.y>=7.9&&rail.b.y<=112.1);
  assert.ok(rail.a.x>=52.9&&rail.b.x<=157.1);
 }
});
test("PT028 one tangent-aligned hand distance equals same angular delta anywhere around Moon",()=>{
 const delta=24,from={x:200,y:490,time:0};
 const sectors=[];
 for(let angle=0;angle<48;angle++){
  const tangent=axisForAngle(angle);
  const to={x:from.x+tangent.x*delta,y:from.y+tangent.y*delta,time:125};
  const result=projectDrag({from,to,angle,orbitRadius:65+angle,
    centerX:130,centerY:320,screenWidth:360,sectorCount:48});
  sectors.push(result.sectorDelta);
 }
 const spread=Math.max(...sectors)-Math.min(...sectors);
 assert.ok(spread<1e-8,`unequal angular control: ${spread}`);
});
test("PT028 fingertip vectors are opposed and perpendicular to Moon radius",()=>{
 for(let angle=0;angle<48;angle++){
  const v=vectorsForGrip({x:150,y:450,angle,time:100});
  assert.equal(v.arrows.length,2);
  const a=v.arrows[0],b=v.arrows[1];
  near((a.tip.x-a.from.x)+(b.tip.x-b.from.x),0);
  near((a.tip.y-a.from.y)+(b.tip.y-b.from.y),0);
  const axis=axisForAngle(angle);
  near(v.tangent.x,axis.x);near(v.tangent.y,axis.y);
  near(Math.hypot(b.tip.x-b.from.x,b.tip.y-b.from.y),v.length);
 }
});
test("PT028 pulse breathes in and out; reduced-motion is stable",()=>{
 const input={x:150,y:200,angle:12};
 const a=vectorsForGrip({...input,time:0}),b=vectorsForGrip({...input,time:370*Math.PI/2}),
   c=vectorsForGrip({...input,time:370*Math.PI*1.5});
 assert.ok(b.length>a.length&&a.length>c.length);
 near(vectorsForGrip({...input,reducedMotion:true,time:1}).length,
      vectorsForGrip({...input,reducedMotion:true,time:1000}).length);
});
test("PT028 paint restores Canvas state and is disabled for invalid data",()=>{
 const events=[];
 const ctx={save:()=>events.push("save"),restore:()=>events.push("restore"),
  beginPath:()=>events.push("begin"),moveTo:()=>{},lineTo:()=>{},stroke:()=>events.push("stroke")};
 assert.equal(drawGripVectors(ctx,{x:100,y:100,angle:0,time:400}),true);
 assert.deepEqual(events,["save","begin","stroke","begin","stroke","restore"]);
 assert.equal(drawGripVectors(ctx,{x:NaN,y:100,angle:0}),false);
});
test("PT028 new cues do not steal pointers and only appear during a valid grip",()=>{
 const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
 const src=fs.readFileSync("app/src/main/assets/grip-vectors.js","utf8");
 assert.match(html,/src="grip-vectors.js"/);
 assert.match(html,/window\.PartouGripVectors\.drawGripVectors/);
 assert.match(html,/hands\.grip/);
 assert.match(html,/game\.pieces\[grip\.lane\]/);
 assert.match(html,/!laserMode/);
 assert.doesNotMatch(src,/addEventListener|setPointerCapture|game\.shift\(/);
});

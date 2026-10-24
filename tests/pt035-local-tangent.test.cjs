const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {localTangent,drawLocalTangent}=
  require("../app/src/main/assets/tangent-landing-guide.js");
const {axisForAngle}=require("../app/src/main/assets/joystick-guide.js");
const {projectDrag}=require("../app/src/main/assets/tangent-control.js");
const {Game}=require("../app/src/main/assets/engine.js");
const near=(a,b,e=1e-7)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const target={x:260,y:300,angle:0};
const anchor={x:290,y:345};
const finger={x:370,y:465};
function g(angle=0,a=anchor){
 return localTangent({anchor:a,target,finger,angle,sectors:48,stepR:22});
}
function canvas(){
 const calls=[];
 const ctx={calls,save(){calls.push("save")},restore(){calls.push("restore")},
   beginPath(){calls.push("begin")},moveTo(x,y){calls.push(["move",x,y])},
   lineTo(x,y){calls.push(["line",x,y])},
   arc(x,y,r){calls.push(["arc",x,y,r])},
   stroke(){calls.push("stroke")},
   setLineDash(xs){calls.push(["dash",...xs])}};
 return ctx;
}
test("PT035: tangent is centered on the CURRENT projected lunar anchor, not on the finger",()=>{
 const q=g(0);
 near((q.ends[0].x+q.ends[1].x)/2,anchor.x);
 near((q.ends[0].y+q.ends[1].y)/2,anchor.y);
 assert.notDeepEqual(q.center,finger);
 assert.notDeepEqual(q.center,target);
 assert.deepEqual(q.links[0],[{x:target.x,y:target.y},anchor]);
 assert.deepEqual(q.links[1],[anchor,finger]);
});
test("PT035: tangent orientation matches same input engine and joystick for all 48 sectors",()=>{
 const from={x:190,y:250,time:0},to={x:190,y:250,time:16};
 for(let a=0;a<48;a++){
  const q=g(a),ui=axisForAngle(a);
  const engine=projectDrag({from,to,angle:a,orbitRadius:95});
  near(q.tangent.x,ui.x);near(q.tangent.y,ui.y);
  near(q.tangent.x,engine.tangent.x);near(q.tangent.y,engine.tangent.y);
  near((q.ends[1].x-q.ends[0].x),q.tangent.x*2*q.half);
  near((q.ends[1].y-q.ends[0].y),q.tangent.y*2*q.half);
  near(engine.sectorDelta,0);
 }
});
test("PT035: seam 47 to 0 stays continuous even if the marker stays with the projected landing",()=>{
 const a=g(47),b=g(0);
 assert.ok(Math.hypot(a.tangent.x-b.tangent.x,a.tangent.y-b.tangent.y)<.14);
 assert.deepEqual(a.center,b.center);
});
test("PT035: real-time lunar projection movement moves the cue without moving the piece",()=>{
 const moved={x:340,y:380},before=g(9),after=g(9,moved);
 near(after.center.x,moved.x);near(after.center.y,moved.y);
 assert.ok(Math.hypot(before.center.x-after.center.x,before.center.y-after.center.y)>50);
 const game=new Game(()=>0),score=game.score;
 assert.equal(score,0);
});
test("PT035: graceful failure on missing/non-finite geometry",()=>{
 for(const q of [{},{anchor,target,finger,angle:NaN},
    {anchor:{x:NaN,y:4},target,finger,angle:0},
    {anchor,target,finger,angle:0,sectors:0},
    {anchor,target,finger,angle:0,stepR:-1}]){
  assert.equal(localTangent(q),null);
  assert.equal(drawLocalTangent(canvas(),q),false);
 }
});
test("PT035: draw translucent local rail, arrowheads and two guided links behind bricks",()=>{
 const ctx=canvas();
 assert.equal(drawLocalTangent(ctx,{
  anchor,target,finger,angle:12,stepR:20,time:300,reducedMotion:true
 }),true);
 assert.deepEqual(ctx.calls[0],"save");
 assert.equal(ctx.calls.at(-1),"restore");
 assert.equal(ctx.calls.filter(v=>v==="stroke").length,6);
 assert.ok(ctx.calls.some(v=>Array.isArray(v)&&v[0]==="dash"&&v.length===3));
 assert.ok(ctx.calls.some(v=>Array.isArray(v)&&v[0]==="arc"&&v[1]===anchor.x&&v[2]===anchor.y));
});
test("PT035: engine and touch unchanged; marker is visual-only and only on active grip",()=>{
 const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
 const module=fs.readFileSync("app/src/main/assets/tangent-landing-guide.js","utf8");
 assert.match(html,/src="tangent-landing-guide.js"/);
 assert.match(html,/if\(grip&&hands\.experimental&&!laserMode&&!game\.paused&&!game\.over&&!settingsOpen\)/);
 assert.match(html,/anchor:ghostMoonGuide\.anchor,target,/);
 assert.match(html,/finger:\{x:grip\.lastX,y:grip\.lastY\}/);
 assert.match(html,/window\.PartouGripVectors\.drawGripVectors/);
 assert.equal(html.includes('window.PartouLandingGuide.drawLandingCue(ctx,target'),false);
 assert.match(html,/joystick\.render\(landing\?\.angle\?\?piece\.angle/);
 assert.doesNotMatch(module,/game\.shift|game\.rotate|game\.score|setPointerCapture|addEventListener|pointerdown|localStorage/);
});

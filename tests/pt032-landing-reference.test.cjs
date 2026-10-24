const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {Game,cellsOf,SECTORS,RINGS}=require("../app/src/main/assets/engine.js");
const {landingReference,resolveLandingReference,drawLandingCue}=
 require("../app/src/main/assets/landing-guide.js");
const {GhostMoonGuide}=require("../app/src/main/assets/ghost-moon-guide.js");
const {projectDrag}=require("../app/src/main/assets/tangent-control.js");
const {axisForAngle}=require("../app/src/main/assets/joystick-guide.js");
const moonCenter={x:210,y:350},inner=70,stepR=20;
const layout={moonCenter,inner,stepR,sectors:SECTORS};
const near=(a,b,tol=1e-6)=>assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}`);
const project=(g,p)=>resolveLandingReference({game:g,piece:p,cellsOf,...layout});
function mockCtx(){
 const calls=[];
 return {calls,
  save:()=>calls.push("save"),restore:()=>calls.push("restore"),
  beginPath:()=>calls.push("begin"),
  arc:(...x)=>calls.push(["arc",...x]),
  stroke:()=>calls.push("stroke"),fill:()=>calls.push("fill")
 };
}
function assertBetween(a,origin,end){
 const dx=end.x-origin.x,dy=end.y-origin.y,
  ax=a.x-origin.x,ay=a.y-origin.y;
 const t=(ax*dx+ay*dy)/(dx*dx+dy*dy);
 assert.ok(t>0&&t<1,`pivot not between forecast and finger: ${t}`);
 near(ax*dy-ay*dx,0);
}
test("PT032: projected reference is the centroid of the ACTUAL landing minos",()=>{
 const game=new Game(()=>0),p=game.pieces[0];
 p.radius=9;p.angle=10;p.type=1;p.rot=0;
 const predicted=game.ghost(p);
 const footprint=cellsOf(p,p.angle,predicted,p.rot);
 const q=project(game,p);
 assert.ok(q);
 assert.equal(q.landingRadius,predicted);
 assert.equal(q.count,footprint.length);
 assert.ok(q.ring<p.radius);
 const expected=footprint.map(([a,r])=>{
  const theta=-Math.PI/2+(a+.5)*Math.PI*2/SECTORS;
  const rad=inner+(r+.5)*stepR;
  return {x:moonCenter.x+rad*Math.cos(theta),y:moonCenter.y+rad*Math.sin(theta)};
 });
 near(q.x,expected.reduce((acc,x)=>acc+x.x,0)/expected.length);
 near(q.y,expected.reduce((acc,x)=>acc+x.y,0)/expected.length);
 assert.equal(q.source,"landing-ghost");
});
test("PT032: projected target is stable as the real piece falls through empty rows",()=>{
 const game=new Game(()=>0),p=game.pieces[0];
 p.type=1;p.radius=9;p.angle=11;
 const old=project(game,p);
 p.radius=7;
 const next=project(game,p);
 near(next.x,old.x);near(next.y,old.y);
 assert.equal(next.landingRadius,old.landingRadius);
});
test("PT032: target moves with block placement, lateral shift and rotation",()=>{
 const game=new Game(()=>0),p=game.pieces[0];
 p.type=2;p.radius=9;p.angle=9;p.rot=0;
 const before=project(game,p);
 game.board[0][9]=1;game.boardTypes[0][9]=1;
 const obstructed=project(game,p);
 assert.ok(obstructed.landingRadius>before.landingRadius);
 assert.ok(Math.hypot(before.x-obstructed.x,before.y-obstructed.y)>stepR*.6);
 const atBlock=project(game,p);
 assert.equal(game.shift(0,1),true);
 const shifted=project(game,p);
 assert.ok(Math.hypot(shifted.x-atBlock.x,shifted.y-atBlock.y)>0.2);
 const prev=project(game,p);
 assert.equal(game.rotate(0),true);
 const rotated=project(game,p);
 assert.ok(Math.hypot(prev.x-rotated.x,prev.y-rotated.y)>0.1);
});
test("PT032: 47-to-0 seam is a short continuous centroid, not a jump",()=>{
 const a=landingReference({cells:[[47,2],[0,2]],...layout});
 const b=landingReference({cells:[[0,2],[1,2]],...layout});
 assert.ok(a.y<moonCenter.y&&b.y<moonCenter.y);
 assert.ok(Math.abs(a.x-moonCenter.x)<1);
 assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<stepR);
});
test("PT032: ghost pivot uses future target and moves when the forecast moves",()=>{
 const ctx=mockCtx(),guide=new GhostMoonGuide(58);
 const grip={id:3,lane:1,lastX:200,lastY:700};
 const a={x:100,y:440},b={x:190,y:490};
 assert.equal(guide.render(ctx,{grip,angle:10,moonCenter,target:a,time:0}),true);
 const first={...guide.anchor};
 assertBetween(guide.anchor,a,{x:grip.lastX,y:grip.lastY});
 assert.equal(guide.render(ctx,{grip,angle:10,moonCenter,target:b,time:16}),true);
 assertBetween(guide.anchor,b,{x:grip.lastX,y:grip.lastY});
 assert.ok(Math.hypot(first.x-guide.anchor.x,first.y-guide.anchor.y)>10);
});
test("PT032: landing projection does not move the brick with a stationary finger",()=>{
 const game=new Game(()=>0),p=game.pieces[0];
 p.type=2;p.radius=8;
 const before=project(game,p);
 const f={x:280,y:410,time:0};
 const g={x:280,y:410,time:20};
 const delta=projectDrag({from:f,to:g,angle:before.angle,
   orbitRadius:Math.hypot(before.x-moonCenter.x,before.y-moonCenter.y),
   centerX:moonCenter.x,centerY:moonCenter.y,screenWidth:400});
 near(delta.sectorDelta,0);
 const t=axisForAngle(p.angle);
 near(delta.tangent.x,t.x);near(delta.tangent.y,t.y);
});
test("PT032: selection is still on actual piece and guide still only while grabbed",()=>{
 const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
 assert.match(html,/chooseLane:nearestLane/);
 assert.match(html,/onSelect:lane=>\{selected=lane;\}/);
 assert.match(html,/projectedLanding\(piece\)/);
 assert.match(html,/projectedLanding\(p\)/);
 assert.match(html,/src="landing-guide.js"/);
 assert.match(html,/target=projectedLanding\(piece\)/);
 assert.match(html,/moonCenter:\{x:cx,y:cy\},target,time/);
 assert.equal(html.includes('window.PartouLandingGuide.drawLandingCue(ctx,target'),false);
 assert.match(html,/if\(grip&&hands\.experimental&&!laserMode&&!game\.paused&&!game\.over&&!settingsOpen\)/);
});
test("PT032: no score/controls mutation; reticle is translucent and display-only",()=>{
 const source=fs.readFileSync("app/src/main/assets/landing-guide.js","utf8");
 const scoring=fs.readFileSync("app/src/main/assets/engine.js","utf8");
 const controls=fs.readFileSync("app/src/main/assets/tangent-control.js","utf8");
 assert.match(scoring,/flightSpeedMultiplier\(p\)/);
 assert.match(controls,/const projectedPixels=along\(to\)-along\(from\)/);
 assert.doesNotMatch(source,/game\.shift|game\.rotate|game\.score|setPointerCapture|addEventListener|onpointer/);
 assert.match(source,/rgba\(138,245,255,0\.38\)/);
 const ctx=mockCtx();
 assert.equal(drawLandingCue(ctx,{x:150,y:200},{stepR:20}),true);
 assert.deepEqual([ctx.calls[0],ctx.calls.at(-1)],["save","restore"]);
});

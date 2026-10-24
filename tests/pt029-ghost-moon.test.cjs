const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {ghostMoonGeometry,drawGhostMoon,GhostMoonGuide}=
  require("../app/src/main/assets/ghost-moon-guide.js");
const {vectorsForGrip}=require("../app/src/main/assets/grip-vectors.js");
const {projectDrag}=require("../app/src/main/assets/tangent-control.js");
function near(a,b,tol=1e-8){assert.ok(Math.abs(a-b)<tol,`${a} vs ${b}`);}
const p={x:175,y:410};
test("PT029: the finger starts exactly on the ghost orbit at any sector",()=>{
 for(let angle=0;angle<48;angle++){
  const g=ghostMoonGeometry({...p,angle,radius:58});
  near(Math.hypot(p.x-g.center.x,p.y-g.center.y),58);
  near(g.contact.x,p.x);near(g.contact.y,p.y);
  near(g.tangent.x*g.radial.x+g.tangent.y*g.radial.y,0);
  const projection=projectDrag({
   from:{...p,time:0},to:{...p,time:16},angle,orbitRadius:95
  });
  near(g.tangent.x,projection.tangent.x);
  near(g.tangent.y,projection.tangent.y);
 }
});
test("PT029: stable anchor through 360 degrees, no reversal and no jumps",()=>{
 const center={x:108,y:305};
 for(let angle=0;angle<48;angle++){
  const g=ghostMoonGeometry({...p,angle,anchor:center,radius:58});
  const next=ghostMoonGeometry({...p,angle:(angle+1)%48,anchor:center,radius:58});
  near(g.center.x,center.x);near(g.center.y,center.y);
  near(Math.hypot(g.contact.x-center.x,g.contact.y-center.y),58);
  assert.ok(Math.hypot(g.contact.x-next.contact.x,g.contact.y-next.contact.y)<8);
 }
});
function mock(){
 const acts=[];
 const ctx={
  save(){acts.push("save");},restore(){acts.push("restore");},
  beginPath(){acts.push("begin");},arc(){acts.push("arc");},
  fill(){acts.push("fill");},stroke(){acts.push("stroke");}
 };
 return {ctx,acts};
}
test("PT029: draw only when valid and always restore canvas state",()=>{
 const {ctx,acts}=mock();
 assert.equal(drawGhostMoon(ctx,{...p,angle:4}),true);
 assert.equal(acts.at(0),"save");
 assert.equal(acts.at(-1),"restore");
 assert.ok(acts.filter(a=>a==="arc").length>=5);
 assert.equal(drawGhostMoon(ctx,{x:NaN,y:10,angle:4}),false);
});
test("PT029/PT031: projected pivot follows grip and reanchors after release",()=>{
 const {ctx}=mock(),guide=new GhostMoonGuide(58);
 const grip={id:7,lane:0,lastX:175,lastY:410};
 const moonCenter={x:120,y:310};
 assert.equal(guide.render(ctx,{grip,angle:5,moonCenter,time:0}),true);
 const first={...guide.anchor};
 grip.lastX=265;grip.lastY=440;
 assert.equal(guide.render(ctx,{grip,angle:9,moonCenter,time:16}),true);
 assert.ok(Math.hypot(guide.anchor.x-first.x,guide.anchor.y-first.y)>30);
 guide.hide();assert.equal(guide.anchor,null);
 assert.equal(guide.render(ctx,{grip,angle:9,moonCenter,time:32}),true);
 assert.ok(Math.hypot(guide.anchor.x-first.x,guide.anchor.y-first.y)>30);
 guide.render(ctx,{grip:null,angle:9,moonCenter,time:48});
 assert.equal(guide.anchor,null);
});
test("PT029: longer fingertip vectors remain opposed and semi-transparent neon",()=>{
 for(let angle=0;angle<48;angle++){
  const v=vectorsForGrip({...p,angle,time:0});
  assert.ok(v.length>=24&&v.length<=42);
  near(v.arrows[0].tip.x+v.arrows[1].tip.x,2*p.x);
  near(v.arrows[0].tip.y+v.arrows[1].tip.y,2*p.y);
  assert.ok(Math.hypot(v.arrows[0].tip.x-p.x,v.arrows[0].tip.y-p.y)>=54);
 }
 const src=fs.readFileSync("app/src/main/assets/grip-vectors.js","utf8");
 assert.match(src,/globalAlpha=\.58/);
 assert.match(src,/shadowBlur=12/);
});
test("PT029: ghost is faint and cannot intercept touch or alter game physics",()=>{
 const ghost=fs.readFileSync("app/src/main/assets/ghost-moon-guide.js","utf8");
 const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
 assert.match(ghost,/rgba\(116,186,225,0\.032\)/);
 assert.match(ghost,/rgba\(135,235,253,0\.15\)/);
 assert.doesNotMatch(ghost,/pointerdown|addEventListener|setPointerCapture|game\.shift|game\.rotate/);
 assert.match(html,/src="ghost-moon-guide.js"/);
 assert.match(html,/ghostMoonGuide\.render\(ctx,\{grip,angle:target\?\.angle\?\?piece\.angle,/);
 assert.ok(html.indexOf("ghostMoonGuide.render(ctx")<html.indexOf("pieces();overlays();"));
 assert.match(html,/ghostMoonGuide\.hide\(\)/);
 assert.match(html,/if\(grip&&hands\.experimental&&!laserMode&&!game\.paused&&!game\.over&&!settingsOpen\)/);
});

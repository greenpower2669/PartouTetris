const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {axisForAngle,railForAxis,Guide}=require("../app/src/main/assets/joystick-guide.js");
const {projectDrag}=require("../app/src/main/assets/tangent-control.js");
function near(a,b){assert.ok(Math.abs(a-b)<1e-10,`${a} not near ${b}`);}
test("PT027 axis and real tangent agree at all 48 sectors",()=>{
 for(let a=0;a<48;a++){
  const guide=axisForAngle(a);
  const model=projectDrag({from:{x:40,y:40,time:0},
    to:{x:40,y:40,time:100},angle:a,orbitRadius:80});
  near(guide.x,model.tangent.x);near(guide.y,model.tangent.y);
 }
});
test("PT027 joystick rotates smoothly through quadrants, no discontinuity",()=>{
 for(let a=0;a<48;a++){
  const u=axisForAngle(a),v=axisForAngle((a+1)%48);
  near(Math.hypot(u.x,u.y),1);
  assert.ok(u.x*v.x+u.y*v.y>0.99);
  const rail=railForAxis(u);
  assert.ok(rail.a.x>=52.9&&rail.b.x<=157.1);
  assert.ok(rail.a.y>=7.9&&rail.b.y<=112.1);
  near(Math.hypot(rail.b.x-rail.a.x,rail.b.y-rail.a.y),104);
 }
});
test("PT027 all four sides and diagonal directions are legible",()=>{
 assert.match(axisForAngle(0).label,/GAUCHE/);
 assert.match(axisForAngle(12).label,/HAUT/);
 assert.match(axisForAngle(24).label,/GAUCHE/);
 assert.match(axisForAngle(36).label,/HAUT/);
 assert.match(axisForAngle(6).label,/DIAGONALE/);
});
function element(){
 const nodes=new Map();
 const host={added:new Set(),classList:{add(x){host.added.add(x);},remove(x){host.added.delete(x);}}};
 function get(id){
  if(!nodes.has(id))nodes.set(id,{attrs:{},textContent:"",
    setAttribute(k,v){this.attrs[k]=v;}});
  return nodes.get(id);
 }
 const el={hidden:true,querySelector(q){return get(q.slice(1));}};
 return {el,host,get};
}
test("PT027 guide stays hidden until grip, follows finger, hides after release",()=>{
 const {el,host,get}=element(),guide=new Guide(el,host);
 assert.equal(el.hidden,true);
 guide.show(2);
 assert.equal(el.hidden,false);
 assert.equal(host.added.has("guide-active"),true);
 guide.movement(28,80);
 guide.render(18,100);
 assert.match(get("guideTrack").attrs.d,/M /);
 assert.notEqual(get("guideThumb").attrs.cx,"105.00");
 guide.hide();
 assert.equal(el.hidden,true);
 assert.equal(host.added.has("guide-active"),false);
});
test("PT027 pause/laser/old control can force hidden guide; one lane does not reset on every frame",()=>{
 const {el,host}=element(),guide=new Guide(el,host);
 guide.show(1);guide.movement(26,10);
 const old=guide.finger;
 guide.show(1);assert.equal(guide.finger,old);
 guide.hide();assert.equal(guide.finger,0);assert.equal(host.added.size,0);
});
test("PT027 portrait DOM keeps laser separately touchable and never listens for guide pointers",()=>{
 const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
 const css=fs.readFileSync("app/src/main/assets/joystick-guide.css","utf8");
 assert.match(html,/id="touchGuide"/);
 assert.match(html,/src="joystick-guide.js"/);
 assert.match(html,/updateTouchGuide/);
 assert.match(html,/joystick\.movement/);
 assert.match(css,/#tip\.guide-active \.gesture/);
 assert.match(css,/#touchGuide[^\n]*\{/);
 assert.match(css,/pointer-events:none/);
 assert.match(html,/id="laserButton"/);
 assert.doesNotMatch(html,/touchGuide\.addEventListener/);
});

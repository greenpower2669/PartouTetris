const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {EarthEvents}=require("../app/src/main/assets/earth-events.js");

const geom={W:390,earth:{x:195,y:1240,r:184}};
const approx=(a,b,e=.001)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const active=()=>{
  const e=new EarthEvents(()=>.27);
  e.spawn(10,geom);
  return e;
};

test("PT040: particle exhaust replaces the former rigid colored stick",()=>{
  const source=fs.readFileSync("app/src/main/assets/earth-events.js","utf8");
  assert.doesNotMatch(source,/ctx\.lineTo\(-24-p\.t\*10,36\)/);
  assert.doesNotMatch(source,/ctx\.moveTo\(-9,14\)/);
  assert.ok(source.includes("trailParticles(this.pending?.firedAt??now,{reduced,speedRatio})"));
  assert.match(source,/ctx\.globalCompositeOperation="lighter"/);
});

test("PT040: incandescent embers follow historic travel path, not piece rotation",()=>{
  const e=active(),now=12.9,here=e.position(e.active,now);
  const sparks=e.trailParticles(now);
  assert.ok(sparks.length>=12);
  const v={x:e.active.endX-e.active.x0,y:e.active.endY-e.active.y0};
  const length=Math.hypot(v.x,v.y);
  // All the dust is BEHIND the piece's actual motion, with only small
  // perpendicular turbulence, even while the mino itself rotates.
  for(const s of sparks){
    const projection=((s.x-here.x)*v.x+(s.y-here.y)*v.y)/length;
    assert.ok(projection<0);
    assert.ok(s.radius>0&&s.radius<7);
    assert.ok(s.opacity>0&&s.opacity<=1);
    assert.ok(Number.isFinite(s.x)&&Number.isFinite(s.y));
  }
  const spin=e.active.spin;
  e.active.spin+=2.2;
  const rotated=e.trailParticles(now);
  // Rotation may change decorative jitter but cannot reverse the trail.
  assert.ok(rotated.every(s=>((s.x-here.x)*v.x+(s.y-here.y)*v.y)<0));
  assert.ok(spin!==e.active.spin);
});

test("PT040: heat gradient is not a monochrome extension of the tetromino",()=>{
  const e=active(),sparks=e.trailParticles(13);
  const colors=new Set(sparks.map(s=>s.color));
  assert.ok(colors.size>=4);
  assert.ok(colors.has("#fff1cb"));
  assert.ok(colors.has("#ffcf62"));
  assert.ok(colors.has("#ff922e"));
  assert.ok(colors.has("#e85a24"));
  assert.ok(sparks[0].opacity>sparks.at(-1).opacity);
});

test("PT040: increased permanent speed lengthens the trajectory tail",()=>{
  const e=active(),now=13;
  const slow=e.trailParticles(now,{speedRatio:1});
  const fast=e.trailParticles(now,{speedRatio:2.5});
  const here=e.position(e.active,now);
  const maxDist=x=>Math.max(...x.map(s=>Math.hypot(s.x-here.x,s.y-here.y)));
  assert.ok(maxDist(fast)>maxDist(slow));
});

test("PT040: reduced-motion option produces fewer and dimmer sparks",()=>{
  const e=active(),normal=e.trailParticles(12.9);
  const reduced=e.trailParticles(12.9,{reduced:true});
  assert.ok(reduced.length<normal.length);
  assert.ok(Math.max(...reduced.map(s=>s.opacity))<
            Math.max(...normal.map(s=>s.opacity)));
  assert.deepEqual(e.trailParticles(9.9),[]);
});

test("PT040: draw emits distinct soft circles but no rigid line attached to moving piece",()=>{
  const e=active(),calls=[];
  const ctx=new Proxy({},{
    get(_target,key){
      if(["save","restore","translate","rotate","beginPath","arc","fill",
           "stroke","fillRect","strokeRect","moveTo","lineTo"].includes(key))
        return (...args)=>{calls.push([key,...args]);};
    },
    set(){return true;}
  });
  assert.doesNotThrow(()=>e.draw(ctx,{now:12.9,speedRatio:1.8}));
  assert.ok(calls.filter(x=>x[0]==="arc").length>10);
  assert.ok(calls.filter(x=>x[0]==="fill").length>10);
  assert.equal(calls.filter(x=>x[0]==="moveTo").length,0);
  assert.equal(calls.filter(x=>x[0]==="lineTo").length,0);
  assert.equal(calls.filter(x=>x[0]==="fillRect").length,4);
  assert.equal(calls.filter(x=>x[0]==="strokeRect").length,4);
});

test("PT040: Earth-event effects and score contract are not changed",()=>{
  const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
  assert.match(html,/speedRatio:Math\.max\(1,8\/game\.fallInterval\(\)\)/);
  assert.match(html,/earthEvents\.hit\(pos\.x,pos\.y,game\.seconds,game\.fallInterval\(\)\)/);
  assert.match(html,/game\.award\(ev\.bonus,"earth-defense"/);
});

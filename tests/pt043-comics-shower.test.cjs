const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {MeteorShower}=require("../app/src/main/assets/earth-shower.js");
const {defenseBonus}=require("../app/src/main/assets/earth-events.js");
const {ComicFeedback,comicModel,PhraseDeck,BANKS}=require("../app/src/main/assets/comic-feedback.js");
const geometry={W:390,earth:{x:195,y:1240,r:184}};
const fixed=(v)=>()=>v;

test("PT043: shower is rare: never before 45 seconds of active play",()=>{
 const rain=new MeteorShower(fixed(0));
 assert.equal(rain.nextAt,45);
 assert.deepEqual(rain.tick(0,geometry),[]);
 assert.deepEqual(rain.tick(44.999,geometry),[]);
 const events=rain.tick(45,geometry);
 assert.equal(events[0].type,"earth-shower");
 assert.equal(events[0].count,3);
 assert.equal(events[1].type,"earth-spawn");
 assert.equal(rain.entries.length,1);
 assert.equal(rain.wave.remaining,2);
 // Calling with the SAME game time (as when paused) cannot add targets.
 for(let k=0;k<10;k++)rain.tick(45,geometry);
 assert.equal(rain.entries.length,1);
});

test("PT043: 3-6 independent targets in each rain, bounded to six max",()=>{
 for(const [r,count] of [[0,3],[.25,4],[.5,5],[.9999,6]]){
  const rain=new MeteorShower(fixed(r));
  const event=rain.start(2);
  assert.equal(event.count,count);
  let t=2;
  for(let i=0;i<count;i++){
   const ev=rain.tick(t,geometry);
   assert.ok(ev.some(x=>x.type==="earth-spawn"),"missing target "+i);
   t=rain.wave.nextSpawn+.001;
  }
  assert.equal(rain.entries.length,count);
  assert.equal(rain.wave.remaining,0);
  assert.ok(rain.entries.every(x=>x.event.active.duration>=3.7&&x.event.active.duration<4.61));
  const shapes=rain.entries.map(e=>e.event.active.type);
  for(let i=1;i<shapes.length;i++)assert.notEqual(shapes[i],shapes[i-1]);
  assert.equal(rain.tick(t,geometry).filter(x=>x.type==="earth-spawn").length,0);
 }
});

test("PT043: multiple arrivals resolve automatically; no coins for satellites or natural explosions",()=>{
 const rain=new MeteorShower(fixed(0));
 const results=[];
 for(let t=45;t<65;t+=.1)results.push(...rain.tick(t,geometry));
 const arrivals=results.filter(e=>e.type==="earth-spawn");
 const impacts=results.filter(e=>e.type==="earth-impact");
 assert.equal(arrivals.length,3);
 assert.equal(impacts.length,3);
 assert.ok(impacts.every(e=>["satellite","spontaneous"].includes(e.reason)));
 assert.ok(impacts.every(e=>e.bonus===undefined));
 assert.equal(new Set(impacts.map(e=>e.targetId)).size,3);
 assert.equal(rain.wave,null);
 assert.ok(rain.nextAt>=95); // quiet interval after final fragments fade.
});

test("PT043: player intercepts a specific shower target, then a SINGLE 3-beam volley precedes points",()=>{
 const rain=new MeteorShower(fixed(0));
 rain.start(2);rain.tick(2,geometry);
 const e=rain.entries[0].event;
 const p=e.position(e.active,3);
 const locked=rain.hit(p.x,p.y,3,2);
 assert.equal(locked.type,"earth-locked");
 assert.equal(locked.bonus,defenseBonus(2));
 assert.equal(rain.hit(p.x,p.y,3.02,2),null);
 assert.equal(rain.tick(3.1,geometry).some(x=>x.type==="earth-impact"&&x.reason==="player"),false);
 const emitters=[{x:10,y:800},{x:195,y:900},{x:385,y:800}];
 const calls=[];
 const ctx=new Proxy({},{
  get(_t,k){
   if(["save","restore","beginPath","moveTo","lineTo","arc","stroke","fill",
      "fillRect","strokeRect","translate","rotate"].includes(k))
      return (...args)=>calls.push([k,...args]);
  },set(){return true;}
 });
 assert.doesNotThrow(()=>rain.draw(ctx,{now:3.15,emitters,reduced:true}));
 assert.equal(calls.filter(x=>x[0]==="lineTo").length,3);
 assert.equal(calls.filter(x=>x[0]==="moveTo").length,3);
 assert.equal(e.active!==null,true);
 const done=rain.tick(3.321,geometry).filter(x=>x.reason==="player");
 assert.equal(done.length,1);
 assert.equal(done[0].targetId,locked.targetId);
 assert.equal(done[0].bonus,1920);
 assert.equal(done[0].speedSquare,16);
 assert.equal(rain.locked,null);
 assert.equal(rain.tick(3.322,geometry).filter(x=>x.reason==="player").length,0);
});

test("PT043: frozen pause clock freezes storm motion and timing",()=>{
 const rain=new MeteorShower(fixed(.25));
 rain.start(9);rain.tick(9,geometry);
 const e=rain.entries[0].event;
 const a=e.position(e.active,9.8),b=e.position(e.active,9.8);
 assert.deepEqual(a,b);
 const before=rain.wave.remaining;
 for(let k=0;k<20;k++)rain.tick(9,geometry);
 assert.equal(rain.wave.remaining,before);
});

test("PT043: alert comics are zigzag, not fake point rewards, and use a rich rotating lexicon",()=>{
 assert.ok(BANKS.meteor.length>=10);
 const deck=new PhraseDeck(fixed(0));
 const first=comicModel({type:"info",reason:"meteor-shower",count:5},deck);
 assert.equal(first.category,"meteor");
 assert.equal(first.frame,"burst");
 assert.equal(first.priority,2);
 assert.equal(first.gain,0);
 assert.equal(first.speed,0);
 assert.deepEqual(first.stages,[]);
 assert.equal(first.score,"DÉFENSE TERRE");
 const phrases=[first.phrase];
 for(let i=0;i<12;i++)phrases.push(comicModel({type:"info",reason:"meteor-shower",count:3},deck).phrase);
 for(let i=2;i<phrases.length;i++){
  assert.notEqual(phrases[i],phrases[i-1]);
  assert.notEqual(phrases[i],phrases[i-2]);
 }
});

test("PT043: bottom comic zoom peaks then RETURNS to 100% rapidly and remains translucent",()=>{
 const css=fs.readFileSync("app/src/main/assets/comic-feedback.css","utf8");
 assert.match(css,/left:50%;right:auto;transform:translateX\(-50%\)/);
 assert.match(css,/--comic-peak:1\.24/);
 assert.match(css,/--comic-peak:1\.10/);
 assert.match(css,/24%\{opacity:1;transform:translateY\(-2px\) scale\(var\(--comic-peak\)\)\}/);
 assert.match(css,/100%\{opacity:1;transform:translateY\(0\) scale\(1\)\}/);
 assert.match(css,/--panel-start:rgba\(14,47,77,\.43\)/);
 assert.match(css,/--panel-end:rgba\(5,25,48,\.31\)/);
 assert.match(css,/#comicFeed \.comic-malus[\s\S]*?rgba\(99,20,48,\.45\)/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});

test("PT043: shower draw capped and simple renders cannot mutate the main game",()=>{
 const rain=new MeteorShower(fixed(0));
 rain.start(2);
 for(let i=0;i<3;i++)rain.tick(2+i*.65,geometry);
 const calls=[];
 const ctx=new Proxy({},{
  get(_t,k){
   if(["save","restore","beginPath","moveTo","lineTo","arc","stroke","fill",
    "fillRect","strokeRect","translate","rotate"].includes(k))
     return (...args)=>calls.push([k,...args]);
  },set(){return true;}
 });
 assert.doesNotThrow(()=>rain.draw(ctx,{now:3.4,reduced:true,emitters:[]}));
 assert.ok(calls.filter(c=>c[0]==="fillRect").length<=24);
 assert.ok(calls.filter(c=>c[0]==="arc").length<200);
 const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
 assert.match(html,/const meteorShower=new window\.PartouMeteorShower\.MeteorShower/);
 assert.match(html,/meteorShower\.reset\(game\.seconds\)/);
 assert.match(html,/meteorShower\.tick\(game\.seconds,\{W,earth\}\)/);
 assert.match(html,/meteorShower\.draw\(ctx,\{now:game\.seconds/);
 assert.match(html,/meteorShower\.hit\(pos\.x,pos\.y,game\.seconds/);
 assert.match(html,/comic\.enqueue\(\{type:"info",reason:"meteor-shower"/);
 assert.match(html,/game\.award\(ev\.bonus,"earth-defense"/);
 assert.match(html,/window\.PartouTangentLanding\.drawLocalTangent/);
});

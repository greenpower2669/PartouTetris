const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {EarthEvents,defenseBonus}=require("../app/src/main/assets/earth-events.js");
const {BANKS,PhraseDeck,categoryFor,speedPercent,speedStages,comicModel,ComicFeedback}=
  require("../app/src/main/assets/comic-feedback.js");
const geom={W:390,earth:{x:195,y:1240,r:184}};
function setup(){
 const events=new EarthEvents(()=>.25);events.spawn(10,geom);
 const p=events.position(events.active,12);
 return {events,p};
}
function spy(){
 const calls=[];
 const ctx=new Proxy({},{
  get(_t,key){
   if(["save","restore","beginPath","translate","rotate","arc","stroke",
       "fill","fillRect","strokeRect","moveTo","lineTo"].includes(key))
       return (...a)=>calls.push([key,...a]);
  },set(){return true}
 });
 return {ctx,calls};
}
test("PT041: player's laser locks an asteroid without destroying it or paying early",()=>{
 const {events,p}=setup();
 const locked=events.hit(p.x,p.y,12,4);
 assert.equal(locked.type,"earth-locked");
 assert.equal(locked.reason,"player");
 assert.equal(locked.bonus,defenseBonus(4));
 assert.equal(events.effects.length,0);
 assert.ok(events.active);
 assert.equal(events.hit(p.x,p.y,12.01,4),null);
 assert.deepEqual(events.tick(12.16,geom),[]);
 assert.deepEqual(events.tick(12.31,geom),[]);
 assert.ok(events.active);
});
test("PT041: all THREE satellite beams are visible before the explosion",()=>{
 const {events,p}=setup();events.hit(p.x,p.y,12,2);
 const emitters=[{x:10,y:720},{x:195,y:960},{x:375,y:720}];
 const {ctx,calls}=spy();
 assert.doesNotThrow(()=>events.draw(ctx,{now:12.20,emitters}));
 const lines=calls.filter(a=>a[0]==="lineTo");
 // Each laser has two strokes (cyan plus white core), same 3 endpoints.
 assert.equal(lines.length,3);
 for(const line of lines){
   assert.equal(line[1],p.x);assert.equal(line[2],p.y);
 }
 assert.equal(calls.filter(a=>a[0]==="moveTo").length,3);
 assert.ok(events.active);assert.equal(events.effects.length,0);
});
test("PT041: explosion and exact points happen ONLY after the 320ms coordinated volley",()=>{
 const {events,p}=setup();
 events.hit(p.x,p.y,12,2);
 assert.equal(events.tick(12.319,geom).length,0);
 const list=events.tick(12.321,geom);
 assert.equal(list.length,1);
 assert.equal(list[0].type,"earth-impact");
 assert.equal(list[0].reason,"player");
 assert.equal(list[0].bonus,defenseBonus(2));
 assert.equal(list[0].speedSquare,16);
 assert.equal(events.active,null);
 assert.equal(events.pending,null);
 assert.equal(events.effects.length,1);
 assert.equal(events.tick(12.322,geom).length,0); // no duplicate
});
test("PT041: a slow 8 s approach has NO fabricated +40% boost; capped multiplier accurate",()=>{
 const e8=comicModel({type:"points",reason:"earth-defense",gained:120,speedSquare:1},new PhraseDeck(()=>0));
 assert.equal(e8.score,"+120 pts");assert.equal(e8.speed,0);
 assert.deepEqual(e8.stages,[]);
 const e4=comicModel({type:"points",reason:"earth-defense",gained:480,speedSquare:4},new PhraseDeck(()=>0));
 assert.equal(e4.speed,300);
 assert.deepEqual(e4.stages.slice(0,3),["+40 %","+40 %","+40 %"]);
 assert.equal(e4.stages.at(-1),"+300 % TOTAL");
 assert.equal(speedPercent({reason:"earth-defense",speedSquare:25}),2400);
 assert.equal(speedStages(2400).at(-1),"+2400 % TOTAL");
});
test("PT041: actual placement and ring speed bonuses split into honest 40% stages",()=>{
 assert.deepEqual(speedStages(0),[]);
 assert.deepEqual(speedStages(40),["+40 %"]);
 assert.deepEqual(speedStages(82),["+40 %","+40 %","+2 %"]);
 assert.deepEqual(speedStages(140),["+40 %","+40 %","+40 %","+20 %"]);
 assert.equal(speedPercent({reason:"placement",speedMultiplier:1.82}),82);
 assert.equal(speedPercent({reason:"placement",speedMultiplier:1}),0);
});
test("PT041: banks are substantial and never repeat either of previous two phrases",()=>{
 for(const key of ["earth","placement","ring","bridge","malus","gain","speed"]){
   assert.ok(BANKS[key].length>=8,key);
   const deck=new PhraseDeck(()=>0),last=[];
   for(let i=0;i<20;i++){
     const phrase=deck.pick(key);
     assert.ok(!last.slice(-2).includes(phrase),key+" repeats "+phrase);
     last.push(phrase);
   }
 }
});
test("PT041: classify all score mutations without faking gains",()=>{
 const deck=new PhraseDeck(()=>0);
 for(const ev of [{type:"points",reason:"placement",gained:45},
                  {type:"points",reason:"ring",gained:465},
                  {type:"points",reason:"earth-defense",gained:120},
                  {type:"points",reason:"placement",gained:980,bridges:2},
                  {type:"points",reason:"bonus",gained:80}]){
  const m=comicModel(ev,deck);
  assert.ok(m);assert.equal(m.gain,ev.gained);assert.ok(m.score.startsWith("+"));
 }
 const malus=comicModel({type:"destroy",penalty:640,charged:200},deck);
 assert.equal(malus.score,"−200 pts");
 assert.equal(malus.category,"malus");
 const free=comicModel({type:"destroy",penalty:640,charged:0},deck);
 assert.equal(free.score,"−0 pts");
 assert.equal(categoryFor({type:"laser"}),null);
 assert.equal(comicModel({type:"points",reason:"placement",gained:0},deck),null);
});
test("PT041: comic bubbles obey queue limit, pause, and reduced mode",()=>{
 const doc=global.document;
 const dom=(tag)=>({
  tag,children:[],style:{setProperty(){}},classList:{add(){},toggle(){}},
  append(...nodes){this.children.push(...nodes)},replaceChildren(...nodes){this.children=nodes},
  setAttribute(){},textContent:"",hidden:false
 });
 const root=dom("div");
 global.document={createElement:dom};
 try{
  const feedback=new ComicFeedback(root,{rng:()=>0,reduced:()=>true});
  for(let i=0;i<10;i++)feedback.enqueue({type:"points",reason:"placement",gained:30+i});
  assert.ok(feedback.queue.length<=5);
  feedback.update(1,false);
  assert.equal(root.hidden,false);assert.equal(root.children.length,1);
  assert.ok(root.children[0].children.length>=3);
  const first=feedback.current;
  feedback.update(8,true);
  assert.equal(feedback.current,first);
  feedback.update(8.1,false);
  assert.notEqual(feedback.current,first);
  feedback.reset();assert.equal(root.hidden,true);
 }finally{if(doc===undefined)delete global.document;else global.document=doc;}
});
test("PT041: game wires real impact awards, comic HUD, three lasers and original festival",()=>{
 const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
 const css=fs.readFileSync("app/src/main/assets/comic-feedback.css","utf8");
 assert.match(html,/src="comic-feedback.js"/);
 assert.match(html,/href="comic-feedback.css"/);
 assert.match(html,/id="comicFeed" role="status"/);
 assert.match(html,/comic\.enqueue\(ev\)/);
 assert.match(html,/comic\.update\(game\.seconds/);
 assert.match(html,/game\.award\(ev\.bonus,"earth-defense"/);
 assert.match(html,/earthEvents\.hit\(pos\.x,pos\.y,game\.seconds/);
 assert.match(html,/festival\.handle\(ev\)/);
 assert.doesNotMatch(html,/game\.award\(interception\.bonus/);
 assert.match(css,/#comicFeed\{/);
 assert.match(css,/@keyframes comicStep/);
 assert.match(css,/pointer-events:none/);
});

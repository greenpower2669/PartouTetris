const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {comicModel,PhraseDeck,ComicFeedback}=require("../app/src/main/assets/comic-feedback.js");
const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
const css=fs.readFileSync("app/src/main/assets/comic-feedback.css","utf8");
const model=(event)=>comicModel(event,new PhraseDeck(()=>0));
test("PT042: comic feed is docked INSIDE controls, before tip and buttons, never at HUD top",()=>{
 const deck=html.indexOf('<div id="controlDeck">');
 const comic=html.indexOf('<div id="comicFeed"');
 const tip=html.indexOf('<div id="tip">');
 const buttons=html.indexOf('<div id="buttons">');
 assert.ok(deck>0&&deck<comic&&comic<tip&&tip<buttons);
 assert.equal((html.match(/id="comicFeed"/g)||[]).length,1);
 assert.doesNotMatch(html,/--comic-top/);
 assert.match(css,/#comicFeed\{[\s\S]*?position:absolute;z-index:5;[\s\S]*?bottom:calc\(100% \+ 8px\)/);
});
test("PT042: card is light and translucent, bottom aligned, non-blocking on touchscreen",()=>{
 assert.match(css,/#comicFeed\{[\s\S]*?pointer-events:none/);
 assert.ok(css.includes("--panel-start:rgba(14,47,77,.43)"));
 assert.ok(css.includes("--panel-end:rgba(5,25,48,.31)"));
 assert.doesNotMatch(css,/background:linear-gradient\(160deg,#0d1a35f5/);
 assert.ok(css.includes("width:min(60vw,280px)"));
 assert.match(css,/@media\(max-height:700px\)/);
 assert.match(css,/@media\(max-width:360px\)/);
});
test("PT042: ordinary messages receive a smooth rounded border",()=>{
 for(const ev of [
  {type:"points",reason:"placement",gained:240},
  {type:"points",reason:"generic",gained:99},
  {type:"points",reason:"placement",gained:400,combo:1}
 ]){
  const m=model(ev);
  assert.equal(m.priority,1);
  assert.equal(m.frame,"smooth");
 }
 assert.match(css,/#comicFeed \.comic-smooth\{[\s\S]*?border-radius:15px/);
});
test("PT042: alerts, interceptions, crowns, bridges, combos and large gains use zigzags",()=>{
 for(const ev of [
  {type:"destroy",charged:200},
  {type:"points",reason:"earth-defense",gained:120,speedSquare:1},
  {type:"points",reason:"ring",gained:300},
  {type:"points",reason:"placement",gained:500,bridges:1},
  {type:"points",reason:"placement",gained:540,combo:3},
  {type:"points",reason:"placement",gained:2000},
  {type:"points",reason:"milestone",gained:150}
 ]){
  const m=model(ev);
  assert.equal(m.priority,2,JSON.stringify(ev));
  assert.equal(m.frame,"burst");
 }
 assert.match(css,/#comicFeed \.comic-burst\{[\s\S]*?clip-path:polygon\(/);
 assert.match(css,/#comicFeed \.comic-burst::before\{/);
});
test("PT042: actual DOM card gets the smooth or burst class, while retaining amounts",()=>{
 const old=global.document;
 const node=(tag)=>({tag,className:"",children:[],hidden:false,
  textContent:"",style:{setProperty(){}},
  classList:{add(){},toggle(){}},setAttribute(){},
  append(...items){this.children.push(...items);},
  replaceChildren(...items){this.children=items;}});
 const host=node("div");global.document={createElement:node};
 try{
  const cf=new ComicFeedback(host,{rng:()=>0,reduced:()=>true});
  cf.enqueue({type:"points",reason:"placement",gained:100});
  cf.update(1,false);
  assert.match(host.children[0].className,/comic-smooth/);
  assert.equal(host.children[0].children[2].textContent,"+100 pts");
  cf.reset();
  cf.enqueue({type:"destroy",charged:75});
  cf.update(2,false);
  assert.match(host.children[0].className,/comic-burst/);
  assert.equal(host.children[0].children[2].textContent,"−75 pts");
 }finally{if(old===undefined)delete global.document;else global.document=old;}
});
test("PT042: all PT041 storytelling, staged speed animation and gentle mode remain",()=>{
 assert.match(html,/game\.award\(ev\.bonus,"earth-defense"/);
 assert.match(html,/comic\.enqueue\(ev\)/);
 assert.match(html,/earthEvents\.draw\(ctx/);
 assert.match(css,/@keyframes comicStep/);
 assert.match(css,/comic-still/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 const js=fs.readFileSync("app/src/main/assets/comic-feedback.js","utf8");
 assert.match(js,/recent\.set\(key,\[\.\.\.prev\.slice\(-1\),index\]\)/);
 assert.match(js,/stages:speedStages\(percent\)/);
});

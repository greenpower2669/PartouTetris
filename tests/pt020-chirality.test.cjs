const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {Game,FORMS,cellsOf,FORM_NAMES,TYPE_COLORS,CHIRALITY}=require('../app/src/main/assets/engine.js');
const canon=p=>{
 const xmin=Math.min(...p.map(a=>a[0])),ymin=Math.min(...p.map(a=>a[1]));
 return p.map(([x,y])=>(x-xmin)+':'+(y-ymin)).sort().join('|');
};
const spin=p=>p.map(([x,y])=>[-y,x]);
const variants=p=>{const set=new Set();for(let i=0;i<4;i++){set.add(canon(p));p=spin(p);}return set;};
test('PT020 mirrors L/J and Z/S differ under rotation yet coincide under reflection',()=>{
 for(const [left,right] of [[2,3],[4,5]]){
  const a=variants(FORMS[left]),b=variants(FORMS[right]);
  assert.ok([...a].every(v=>!b.has(v)));
  const mirror=variants(FORMS[left].map(([x,y])=>[-x,y]));
  assert.ok([...mirror].some(v=>b.has(v)));
  for(const front of [0,12,24,36]){
   const p={type:left,angle:front,radius:4,rot:0};
   for(let q=0;q<4;q++){p.rot=q;assert.equal(cellsOf(p).length,4);}
  }
 }
});
test('PT020 seven distinct standard colors, with accurate S/Z shape labels',()=>{
 assert.deepEqual(FORM_NAMES,['I','O','L','J','Z','S','T']);
 assert.equal(TYPE_COLORS.length,7);
 assert.equal(new Set(TYPE_COLORS).size,7);
 for(const t of [2,3,4,5])assert.notEqual(CHIRALITY[t],'non chirale');
});
test('PT020 global bag serves all seven pieces before repetition',()=>{
 const g=new Game(()=>.49),drawn=g.pieces.map(p=>p.type);
 for(let n=0;n<17;n++){const lane=n%4;g.spawn(lane);drawn.push(g.pieces[lane].type);}
 assert.equal(drawn.length,21);
 for(let i=0;i<3;i++)assert.equal(new Set(drawn.slice(7*i,7*i+7)).size,7);
 assert.equal(g.spawnedTypes.reduce((a,b)=>a+b,0),21);
 assert.equal(g.bag.length,0);
});
test('PT020 after lock, pieces preserve original type, color and chirality',()=>{
 const g=new Game(()=>0);
 g.pieces[0]={lane:0,type:2,angle:10,radius:0,rot:1,boost:false};
 assert.equal(g.lock(0),true);
 const ev=g.drainEvents().find(e=>e.type==='lock');
 assert.equal(ev.form,'L');
 assert.equal(ev.color,TYPE_COLORS[2]);
 assert.equal(ev.placedCounts[2],1);
 assert.equal(ev.rotation,1);
 for(const [a,r] of cellsOf({type:2,angle:10,radius:ev.radius,rot:1}))
  assert.equal(g.boardTypes[r][a],2);
});
test('PT020 ring compression and laser demolition keep metadata in sync',()=>{
 const g=new Game(()=>0);
 g.board[0].fill(0);g.boardTypes[0].fill(4);
 g.board[1][3]=1;g.boardTypes[1][3]=5;
 assert.equal(g.clearRings(),1);
 assert.equal(g.board[0][3],1);
 assert.equal(g.boardTypes[0][3],5);
 assert.equal(g.boardTypes[9][3],-1);
 g.score=200;assert.ok(g.destroyLockedCell(3,0));
 assert.equal(g.board[0][3],-1);
 assert.equal(g.boardTypes[0][3],-1);
});
test('PT020 UI uses type not front for flying, ghost and locked pieces, and logs on Android',()=>{
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 const art=fs.readFileSync('app/src/main/assets/visuals.js','utf8');
 const java=fs.readFileSync('app/src/main/java/com/greenpower2669/partouteris/MainActivity.java','utf8');
 assert.match(html,/TYPE_COLORS\[p\.type\]/);
 assert.match(html,/game\.boardTypes\[r\]\[a\]/);
 assert.match(html,/\[PT020\]\[POSE\]/);
 assert.match(java,/Log\.d\("PartouChirality"/);
 assert.match(art,/function shadeFor\(color\)/);
});

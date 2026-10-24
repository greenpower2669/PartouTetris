const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {milestones,chooseScene,FIREWORKS_DURATION}=require('../app/src/main/assets/celebrations.js');
test('Milestone windows are correct and bounded',()=>{
  assert.deepEqual(milestones(0,999),[]);
  assert.deepEqual(milestones(999,1000),[1000,1000]);
  assert.deepEqual(milestones(250,3200),[1000,3000]);
  assert.deepEqual(milestones(800,800),[]);
  assert.deepEqual(milestones(-1,1200),[]);
});
test('Single-ring bubbles; double-ring disco; every 1000 fireworks',()=>{
  assert.equal(chooseScene({type:'ring',count:1,gained:480,combo:1}).kind,'bubbles');
  assert.equal(chooseScene({type:'ring',count:2,gained:1920,combo:1}).kind,'disco');
  const scene=chooseScene({type:'milestone',reached:1000,upto:1000});
  assert.equal(scene.kind,'fireworks');assert.equal(scene.duration,FIREWORKS_DURATION);
});
test('Ordinary placements do not trigger obstructing full-screen scenes',()=>{
  assert.equal(chooseScene({type:'points',reason:'placement',gained:40}),null);
});
test('Portrait UI connects noninteractive FX and soft-effects preference',()=>{
  const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
  assert.match(html,/<script src="celebrations.js"><\/script>/);
  assert.match(html,/id="scoreBurst"/);
  assert.match(html,/#scoreBurst\s*\{[^}]*pointer-events:none/);
  assert.match(html,/festival\.handle\(ev\)/);
  assert.match(html,/id="reducedCelebrations"/);
  assert.match(html,/festival\.reset\(\)/);
});
test('Reduced-motion support disables visually active particles',()=>{
  const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
  assert.match(html,/prefers-reduced-motion:reduce/);
  assert.match(html,/\.fx-reduced \.fx-burst/);
});

test('Earth is the origin for festival sparks and beams, not the Moon itself',()=>{
 const fx=fs.readFileSync('app/src/main/assets/celebrations.js','utf8');
 const scene=fs.readFileSync('app/src/main/assets/index.html','utf8');
 const art=fs.readFileSync('app/src/main/assets/visuals.js','utf8');
 assert.match(fx,/--earth-x/);assert.match(fx,/--earth-y/);
 assert.match(fx,/--tx/);assert.match(fx,/fx-earth-beam/);
 assert.match(scene,/@keyframes earthSpark/);
 assert.match(art,/earth=null/);
 assert.match(scene,/festival\.position\(\{cx,cy,outer,inner,stepR,earth\}\)/);
});

test('PT-014 supersedes old below-lunar-board placement: scores remain entirely inside the HUD',()=>{
 const file=fs.readFileSync('app/src/main/assets/celebrations.js','utf8');
 assert.match(file,/this\.gainHost\.textContent/);
 assert.doesNotMatch(file,/free band BELOW the lunar board/);
 assert.doesNotMatch(file,/cy\+outer\+33/);
});

test('PT-014 score announcements are in the HUD instead of the lunar grid',()=>{
  const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
  const src=fs.readFileSync('app/src/main/assets/celebrations.js','utf8');
  const hud=html.split('<div id="hud">')[1]?.split('<div id="controlDeck">')[0];
  assert.ok(hud?.includes('id="pointFeed"'));
  assert.ok(hud?.includes('id="scoreAnnouncement"'));
  assert.match(html,/#hud \.scoreboard\{position:relative;overflow:hidden\}/);
  assert.match(html,/#pointFeed\[hidden\]\{display:none!important\}/);
  assert.match(src,/this\.bannerHost\.appendChild\(banner\)/);
  assert.doesNotMatch(src,/this\.root\.appendChild\(banner\)/);
  assert.doesNotMatch(src,/cy\+outer\+33/);
  assert.doesNotMatch(html,/pointFeed\.style\.top=/);
});

test('PT-014 short gains and important milestones use independent slots',()=>{
  const {Festival}=require('../app/src/main/assets/celebrations.js');
  const element=()=>({children:[],style:{setProperty(){}},setAttribute(){},
    appendChild(node){this.children.push(node);},replaceChildren(){this.children=[];}});
  const fxRoot=element(),banner=element(),gain={textContent:'',hidden:true};
  const oldDocument=global.document;
  global.document={createElement:tag=>({tag,textContent:'',className:'',
    children:[],appendChild(x){this.children.push(x);}})};
  try{
    const f=new Festival(fxRoot,{bannerHost:banner,gainHost:gain,reduced:()=>true});
    f.floatScore({gained:484,multiplier:4});
    assert.equal(gain.textContent,'GAIN +484 ×4');
    assert.equal(gain.hidden,false);
    f.show({type:'milestone',reached:20000,upto:20000});
    assert.equal(banner.children.length,1);
    assert.equal(fxRoot.children.length,0);
    assert.match(banner.children[0].children[0].textContent,/20.000 POINTS/);
    f.reset();
    assert.equal(banner.children.length,0);assert.equal(gain.hidden,true);
  }finally{if(oldDocument===undefined)delete global.document;else global.document=oldDocument;}
});

test('PT-018 demolition cost appears in the HUD, never across the Moon',()=>{
 const source=require('node:fs').readFileSync('app/src/main/assets/celebrations.js','utf8');
 const html=require('node:fs').readFileSync('app/src/main/assets/index.html','utf8');
 assert.match(source,/event\.type==="destroy"/);
 assert.match(source,/MALUS −/);
 assert.match(html,/#hud #pointFeed\.penalty/);
 assert.match(html,/sound\.cue\("destroy"\)/);
});

test('PT-018 actual malus text is bounded by current score, never invents lost points',()=>{
 const fs=require('node:fs');
 const src=fs.readFileSync('app/src/main/assets/celebrations.js','utf8');
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 assert.match(src,/event\.charged\.toLocaleString/);
 assert.match(html,/ev\.type!=="points"&&ev\.type!=="destroy"/);
 assert.match(html,/sound\.cue\("destroy"\)/);
});

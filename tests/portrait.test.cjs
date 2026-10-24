const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {computePortraitLayout}=require('../app/src/main/assets/layout.js');
const load=path=>fs.readFileSync(path,'utf8');
test('Android orientation is always portrait, never sensor landscape',()=>{
  const manifest=load('app/src/main/AndroidManifest.xml');
  const activity=load('app/src/main/java/com/greenpower2669/partouteris/MainActivity.java');
  assert.match(manifest,/android:screenOrientation="portrait"/);
  assert.doesNotMatch(manifest,/sensorLandscape/);
  assert.match(activity,/SCREEN_ORIENTATION_PORTRAIT/);
});
test('Title owns pyramid emblem; lunar surface no longer paints three pyramids',()=>{
  const html=load('app/src/main/assets/index.html');
  const visual=load('app/src/main/assets/visuals.js');
  assert.match(html,/<img class="pyramids-mark" src="brand-icon.webp"/);
  assert.match(html,/class="brand-title">PARTOUTETRIS/);
  assert.doesNotMatch(visual,/pyramid\(cx[+-]/);
});
test('Portrait 320, 360, 412, 480 width: lunar board never overlaps header or controls',()=>{
  for(const [width,height,headerBottom,controlsTop] of [
    [320,568,72,365],[360,780,85,595],[412,915,94,735],[480,900,100,714]
  ]){
    const p=computePortraitLayout({width,height,headerBottom,controlsTop});
    assert.ok(p.cy-p.outer>headerBottom+8,JSON.stringify(p));
    assert.ok(p.cy+p.outer<controlsTop-7,JSON.stringify(p));
    assert.ok(p.cx-p.outer>0&&p.cx+p.outer<width);
    assert.ok(p.outer>85);
  }
});
test('Portrait UI has two-row buttons in a dedicated dock, with four independent fronts',()=>{
  const html=load('app/src/main/assets/index.html');
  assert.match(html,/id="controlDeck"/);
  assert.match(html,/#buttons\{position:static;.*display:grid;/s);
  assert.match(html,/#turn,#fast\{grid-column:span 3\}/);
  assert.match(html,/#audioButton,#options,#pause\{grid-column:span 2\}/);
  assert.match(html,/computePortraitLayout\(/);
  assert.match(html,/labels=\["N","E","S","O"\]/);
});

test('Full-width header presents the big score above the local podium',()=>{
 const html=load('app/src/main/assets/index.html');
 assert.match(html,/id="scoreTotal"/);
 assert.match(html,/id="highscores"/);
 assert.match(html,/#hud\{display:flex;flex-direction:column/);
 assert.match(html,/#hud #scoreTotal/);
 assert.match(html,/id="nickname"/);
 assert.match(html,/id="pointFeed"/);
});
test('Portrait deck retains existing buttons and introduces a laser button',()=>{
 const html=load('app/src/main/assets/index.html');
 assert.match(html,/id="laserButton"/);
 assert.match(html,/aria-pressed="false"/);
 assert.match(html,/#turn,#fast,#laserButton\{grid-column:span 2\}/);
 assert.match(html,/nearestLaserPiece\(/);
});

test('Satellites from Earth remain inside portrait screen',()=>{
 const {Artist}=require('../app/src/main/assets/visuals.js');
 const proto=Artist.prototype;
 const pts=proto.satelliteOrigins.call({}, {earth:{x:281,y:550,r:38},W:360,H:780});
 assert.equal(pts.length,3);
 assert.ok(pts.every(p=>p.x>=17&&p.x<=343&&p.y>=14&&p.y<=763));
});

test('Horizontal space outside the circular puzzle fits outer entry cells',()=>{
 for(const [width,height,headerBottom,controlsTop] of [
 [320,568,72,365],[360,780,85,595],[412,915,94,735],[480,900,100,714]]){
  const l=computePortraitLayout({width,height,headerBottom,controlsTop});
  assert.ok(l.outer<=width*.395+.001);
  assert.ok(width/2-l.outer>=width*.10);
 }
});

test('Landing canopy appears in lunar play zone, not in four-step approach from space',()=>{
 const {shouldDeployCanopy}=require('../app/src/main/assets/visuals.js');
 const {RINGS,SPACE_STEPS}=require('../app/src/main/assets/engine.js');
 for(let r=RINGS;r<=RINGS+SPACE_STEPS;r++)assert.equal(shouldDeployCanopy(r,RINGS),false);
 assert.equal(shouldDeployCanopy(RINGS-1,RINGS),true);
});

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
test('Procedural lunar artist parses as strict JavaScript and is included in game',()=>{
  const p='app/src/main/assets/visuals.js';
  assert.doesNotThrow(()=>new vm.Script(fs.readFileSync(p,'utf8')));
  const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
  assert.match(html,/<script src="visuals.js"><\/script>/);
  assert.match(html,/new window.PartouVisuals.Artist\(ctx\)/);
  assert.match(html,/art\.backdrop\(/);
  assert.match(html,/art\.cell\(/);
  assert.match(html,/art\.moon\(/);
});

test('Incoming flaming trails and Earth laser are visual-only Canvas primitives',()=>{
 const src=fs.readFileSync('app/src/main/assets/visuals.js','utf8');
 assert.match(src,/incoming\(\{/);
 assert.match(src,/laser\(\{/);
 assert.match(src,/radial<9/);
 assert.match(src,/createLinearGradient/);
});

test('Small landing canopy deploys only inside the ten lunar rings',()=>{
 const {shouldDeployCanopy}=require('../app/src/main/assets/visuals.js');
 for(const r of [14,13,12,11,10,-1,NaN])assert.equal(shouldDeployCanopy(r,10),false);
 for(const r of [9,8,5,1,0])assert.equal(shouldDeployCanopy(r,10),true);
});
test('Parachutes are visual-only and constrained by the same zone rule',()=>{
 const art=fs.readFileSync('app/src/main/assets/visuals.js','utf8');
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 assert.match(art,/canopy\(\{cx,cy,inner,stepR,angle,radial/);
 assert.match(art,/if\(!shouldDeployCanopy\(radial\)\)return false/);
 assert.ok(html.includes('shouldDeployCanopy(p.radius,RINGS)&&!burning'));
 assert.match(html,/art\.canopy\(/);
 assert.ok(html.includes('if(burning){'));
});
test('Three terrestrial satellites are positioned and used as convergent laser emitters',()=>{
 const art=fs.readFileSync('app/src/main/assets/visuals.js','utf8');
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 assert.match(art,/satelliteOrigins\(\{/);
 assert.match(art,/satellites\(\{/);
 assert.match(html,/const emitters=art\.satellites\(/);
 assert.match(html,/for\(const shot of laserShots\)for\(const from of emitters\)/);
});
test('Outer flight debris remains visually rendered beyond the ten radial rings',()=>{
 const art=fs.readFileSync('app/src/main/assets/visuals.js','utf8');
 assert.match(art,/ring>=16/);
 assert.match(art,/space=stepR\*\.58/);
 assert.match(art,/radial<9/);
 assert.doesNotMatch(art,/pyramid\(cx[+-]/);
});

test('Authentic user icon is present as Android drawable and as in-game image',()=>{
 const art='app/src/main/assets/brand-icon.webp',launcher='app/src/main/res/drawable-nodpi/icon.webp';
 assert.ok(fs.existsSync(art));assert.ok(fs.existsSync(launcher));
 assert.deepEqual(fs.readFileSync(art),fs.readFileSync(launcher));
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 const manifest=fs.readFileSync('app/src/main/AndroidManifest.xml','utf8');
 assert.match(html,/<img class="pyramids-mark" src="brand-icon.webp"/);
 assert.match(manifest,/android:icon="@drawable\/icon"/);
 assert.equal(fs.existsSync('app/src/main/res/drawable/icon.xml'),false);
});

test('The optimized user icon has the exact validated Git binary hash',()=>{
 const crypto=require('node:crypto');
 const p='app/src/main/assets/brand-icon.webp';
 const data=fs.readFileSync(p);
 const gitBlob=Buffer.concat([Buffer.from('blob '+data.length+'\0'),data]);
 assert.equal(crypto.createHash('sha1').update(gitBlob).digest('hex'),'e0eedc703359d7e27be9501b0f3c67bec1186229');
});

test('Satellite craft show gold triangular hulls and cyan propulsion rings',()=>{
 const src=fs.readFileSync('app/src/main/assets/visuals.js','utf8');
 assert.match(src,/Pyramid-shaped defence craft/);
 assert.match(src,/c\.ellipse\(0,11,17,4\.3/);
 assert.match(src,/c\.moveTo\(0,-17\);c\.lineTo\(16,7\)/);
 assert.match(src,/rgba\(41,210,249/);
 assert.doesNotMatch(src,/pyramid\(cx[+-]/);
});

test('PT-017 Earth entry visuals are independent of the lunar collider',()=>{
 const art=fs.readFileSync('app/src/main/assets/visuals.js','utf8');
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 assert.match(art,/spacePiece\(\{position,cells/);
 assert.match(html,/projectEarthApproach\(/);
 assert.match(html,/p\.radius>=RINGS/);
 assert.match(html,/art\.spacePiece\(/);
 assert.match(html,/<script src="arrival.js"><\/script>/);
});

test('PT-018 procedural atmosphere and satellite propulsion are animated locally',()=>{
 const art=fs.readFileSync('app/src/main/assets/visuals.js','utf8');
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 assert.match(art,/makeCloudBand\(\)/);
 assert.match(art,/cyclones\(\{x,y,r,time=0,reduced=false\}\)/);
 assert.match(art,/satelliteOrigins\(\{earth,W=360,H=780,time=0\}\)/);
 assert.match(art,/laserDrill\(\{from,to,progress=0,reduced=false\}\)/);
 assert.match(html,/art\.laserDrill\(/);
 assert.match(html,/lockedLaserCell\(pos\)/);
 assert.match(html,/LOCKED_LASER_HOLD_MS/);
 assert.match(html,/laserTarget=null/);
});

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {Soundtrack}=require('../app/src/main/assets/audio.js');
test('PT-013 official soundtrack URL is separate from synthesis fallback',()=>{
 const s=new Soundtrack();
 assert.equal(s.officialUrl,'official-theme.mp3');
 assert.equal(s.official,null);
 assert.equal(s.officialFailed,false);
});
test('PT-013 official music and design remain offline, immutable reference assets',()=>{
 const mp3=fs.readFileSync('app/src/main/assets/official-theme.mp3');
 assert.ok(mp3.subarray(0,3).toString('latin1')==='ID3' || (mp3[0]===255&&(mp3[1]&224)===224));
 assert.ok(mp3.length>1000000);
 const png=fs.readFileSync('design/charte-officielle.png');
 assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 assert.ok(png.length>100000);
});
test('PT-013 offline UI does not request external streaming',()=>{
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 const audio=fs.readFileSync('app/src/main/assets/audio.js','utf8');
 assert.ok(audio.includes('official-theme.mp3'));
 assert.ok(!audio.includes('http://')&&!audio.includes('https://'));
 assert.ok(html.includes('PARTOUTETRIS'));
});

test('PT-013 composite visuals remain dynamically separated from game controls',()=>{
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 const art=fs.readFileSync('app/src/main/assets/visuals.js','utf8');
 assert.ok(html.includes('class="gesture"'));
 assert.ok(html.includes('art.charge('));
 assert.ok(art.includes('charge({from'));
 assert.ok(art.includes('for(let tick=0;tick<96;tick++)'));
 assert.ok(!html.includes('charte-officielle.png'));
});

test('PT-013 Earth enlarges without changing gameplay and satellites follow its horizon',()=>{
 const {computePortraitLayout}=require('../app/src/main/assets/layout.js');
 const {Artist}=require('../app/src/main/assets/visuals.js');
 const l=computePortraitLayout({width:360,height:780,headerBottom:125,controlsTop:594});
 assert.ok(l.earth.r>130,'Earth is now a major lower-viewport element');
 assert.ok(l.earth.y-l.earth.r>l.cy+l.outer-35,'Earth begins near the ring');
 const points=Artist.prototype.satelliteOrigins.call({}, {earth:l.earth,W:360,H:780});
 assert.equal(points.length,3);
 assert.ok(points[0].x<points[1].x&&points[1].x<points[2].x);
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 assert.ok(html.includes('repeat(5,minmax(0,1fr))'));
});

test('PT-013 real browser QA: score takes full width and laser never overlaps help',()=>{
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 assert.ok(html.includes('#hud .scoreboard{display:block;width:100%;max-width:100%;'));
 const help=html.split('<div id="tip">')[1]?.split('</div>')[0];
 assert.ok(help&&help.includes('id="laserButton"'));
 const dock=html.split('<div id="buttons">')[1]?.split('</div>')[0];
 assert.ok(dock&&!dock.includes('id="laserButton"'));
 assert.ok(html.includes('#tip{pointer-events:auto;grid-template-columns:'));
});

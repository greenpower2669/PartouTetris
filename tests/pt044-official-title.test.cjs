const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.join(__dirname,"..","app","src","main","assets");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const css=fs.readFileSync(path.join(root,"title-pt044.css"),"utf8");
const logo=fs.readFileSync(path.join(root,"partout-title-044.avif"));

test("PT044: Fab's supplied title is a real, bundled transparent AVIF asset",()=>{
  assert.ok(logo.length>5000,"image must be bundled and contain real artwork");
  assert.equal(logo.toString("ascii",4,8),"ftyp");
  assert.equal(logo.toString("ascii",8,12),"avif");
  assert.match(html,/class="brand-wordmark-image" src="partout-title-044\.avif"/);
  assert.match(html,/alt="PartouTetris"/);
  assert.match(html,/href="title-pt044\.css"/);
});
test("PT044: original fallback title is preserved for older WebViews",()=>{
  assert.match(html,/<strong class="brand-title">PARTOUTETRIS<\/strong>/);
  assert.match(html,/function mountMoonWordmark\(\)/);
  assert.match(html,/image\.addEventListener\("load",ready\)/);
  assert.match(html,/if\(image\.complete\)ready\(\)/);
  assert.match(html,/image\.naturalWidth>0/);
  assert.match(css,/#hud \.brand-copy\.image-ready \.brand-title\{visibility:hidden\}/);
  assert.match(css,/#hud \.brand-wordmark-image\.ready\{/);
});
test("PT044: title is scaled without cropping and keeps game controls unchanged",()=>{
  assert.match(css,/width:100%;height:100%;object-fit:contain/);
  assert.match(css,/pointer-events:none;user-select:none/);
  assert.match(css,/@media\(max-width:360px\)/);
  assert.match(css,/@media\(max-height:690px\)/);
  assert.match(html,/id="controlDeck"/);
  assert.match(html,/id="laserButton"/);
  assert.match(html,/src="earth-shower\.js"/);
  assert.match(html,/comic\.enqueue\(ev\)/);
});

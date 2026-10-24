const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
const visual=fs.readFileSync("app/src/main/assets/visuals.js","utf8");
test("PT036: light is emitted explicitly from exact mino paths",()=>{
 assert.match(visual,/glow=0/);
 assert.match(visual,/globalCompositeOperation="screen"/);
 assert.match(visual,/c\.shadowBlur=stepR\*\(2\+2\*energy\)/);
 assert.match(visual,/c\.strokeStyle=radiance/);
 assert.doesNotMatch(html,/window\.PartouLandingGuide\.drawLandingCue\(ctx,target/);
});
test("PT036: same visible irradiant breathing on piece and projected landing",()=>{
 assert.match(html,/active\?\.12\+\.88\*pulse:0/);
 assert.match(html,/p\.lane===selected\?\.12\+\.88\*pulse:0/);
 assert.match(html,/return 0\.5\+0\.5\*Math\.sin\(time\/420\)/);
 assert.match(html,/if\(reducedCelebrations\.checked\)return 0\.65/);
});

const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const html=fs.readFileSync("app/src/main/assets/index.html","utf8");
test("PT033: no yellow selection ring nor circular landing reticle in the live frame",()=>{
 assert.doesNotMatch(html,/ctx\.arc\(x,y,hands\.isGripping\(\)\?13:8/);
 assert.doesNotMatch(html,/window\.PartouLandingGuide\.drawLandingCue\(ctx,target/);
 assert.match(html,/selected piece and ghost glow directly/);
});
test("PT033: both selected minos and landing minos pulse with matching color",()=>{
 assert.match(html,/const pulse=selectionLuminance\(performance\.now\(\)\)/);
 assert.match(html,/p\.lane===selected/);
 assert.match(html,/ctx\.shadowColor=TYPE_COLORS\[p\.type\]/);
 assert.match(html,/active\?\.42\+\.2\*pulse:\.20/);
 assert.match(html,/\.94\+\.06\*pulse/);
});
test("PT033: accessible reduced-motion preference holds luminance steady",()=>{
 assert.match(html,/if\(reducedCelebrations\.checked\)return 0\.65/);
 assert.match(html,/ctx\.restore\(\)/);
});
test("PT033: no changes to input control, scores or tangent guide",()=>{
 assert.match(html,/window\.PartouTangentLanding\.drawLocalTangent/);
 assert.match(html,/window\.PartouGripVectors\.drawGripVectors/);
 assert.match(html,/projectDrag:\(lane,from,to\)=>/);
});

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
const css=fs.readFileSync('app/src/main/assets/hud-pt016.css','utf8');
test('PT-016 premium HUD is dynamically constructed without replacing the game canvas',()=>{
 assert.match(html,/<link rel="stylesheet" href="hud-pt016.css">/);
 assert.match(html,/<strong class="brand-title">PARTOUTETRIS<\/strong>/);
 assert.match(html,/function mountMoonWordmark\(\)/);
 assert.match(html,/mountMoonWordmark\(\)/);
 assert.match(html,/createElement\("span"\)/);
 assert.match(html,/className="brand-moon"/);
 assert.match(html,/id="scoreTotal"/);
 assert.match(html,/id="bestScoreValue"/);
 assert.match(html,/bestScoreValue\.textContent=best\.toLocaleString\("fr-FR"\)/);
 assert.match(css,/#hud \.brand-moon/);
 assert.match(css,/#hud \.mino-cyan/);
 assert.match(css,/#hud #scoreTotal/);
});
test('PT-016 four CSS tetrominos each have four blocks and are visual-only',()=>{
 const match=html.match(/<div class="brand-minos" aria-hidden="true">([\s\S]*?)<\/div>/);
 assert.ok(match);
 assert.equal((match[1].match(/class="mino mino-/g)||[]).length,4);
 assert.equal((match[1].match(/<i><\/i>/g)||[]).length,16);
 assert.match(css,/#hud \.mino-purple/);
 assert.match(css,/#hud \.mino-gold/);
});
test('PT-016 score and best-score data stay independent and saved',()=>{
 assert.match(html,/const best=Math\.max\(record,leaderboard\.best\(\)\)/);
 assert.match(html,/ui\.stats\.textContent=leaderboard\.name\+" · Record "/);
 assert.match(html,/bestScoreValue\.textContent=best\.toLocaleString\("fr-FR"\)/);
 assert.match(html,/MEILLEUR SCORE DE PHARAONITE/);
 assert.match(html,/id="highscores"/);
 assert.match(html,/id="scoreAnnouncement"/);
 assert.match(html,/id="pointFeed"/);
 assert.match(css,/\.highscore-title/);
});
test('PT-016 module is pure CSS and scripts remain syntactically valid',()=>{
 for(const sc of html.matchAll(/<script>([\s\S]*?)<\/script>/g))
   assert.doesNotThrow(()=>new vm.Script(sc[1]));
 assert.doesNotMatch(css,/url\s*\(/);
 assert.doesNotMatch(css,/position\s*:\s*fixed/);
});

test('PT-016 title cabinet cannot collapse when decorative children use absolute positioning',()=>{
 assert.match(css,/#hud \.brand\{flex:0 0 auto;min-height:64px;height:clamp/);
 assert.match(css,/#hud \.brand-copy\{[\s\S]*?position:absolute/);
});

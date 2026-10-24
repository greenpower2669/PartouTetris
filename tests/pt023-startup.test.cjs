const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {ResumeDecision}=require('../app/src/main/assets/resume-flow.js');
const {Leaderboard}=require('../app/src/main/assets/leaderboard.js');
const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
test('PT023 first Non only asks confirmation',()=>{
 const flow=new ResumeDecision(true);
 assert.equal(flow.phase,'question');
 assert.equal(flow.discard(),null);
 assert.equal(flow.reject(),'confirm');
 assert.equal(flow.back(),'question');
 assert.equal(flow.reject(),'confirm');
 assert.equal(flow.discard(),'new');
 assert.equal(flow.discard(),null);
});
test('PT023 resume and no-checkpoint states',()=>{
 const good=new ResumeDecision(true);
 assert.equal(good.resume(),'resume');
 assert.equal(good.reject(),null);
 assert.equal(new ResumeDecision(false).resume(),null);
});
test('PT023 Hall of Fame retains 10 local scores',()=>{
 const data=new Map();
 const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};
 const lb=new Leaderboard(storage);
 for(let i=1;i<=13;i++)lb.add(i*100,i);
 assert.deepEqual(lb.top(10).map(x=>x.score),[1300,1200,1100,1000,900,800,700,600,500,400]);
});
test('PT023 start is simple and restart requires confirmation',()=>{
 assert.match(html,/id="resumePopup"/);
 assert.match(html,/id="resumeConfirm"/);
 assert.match(html,/resumeDecision\.discard\(\)/);
 assert.match(html,/id="start"[^>]*>▶ JOUER<\/button>/);
 assert.doesNotMatch(html,/▶ JOUER AVEC LE SON/);
});
test('PT023 dedicated Hall of Fame is accessible from settings and end',()=>{
 assert.match(html,/id="hallOfFame"/);
 assert.match(html,/id="hallEntries"/);
 assert.match(html,/id="hallFromSettings"/);
 assert.match(html,/id="hallFromEnd"/);
 assert.match(html,/leaderboard\.top\(10\)/);
});

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {Game,cellsOf}=require('../app/src/main/assets/engine.js');
const S=require('../app/src/main/assets/session.js');
function storage(){
 const data=new Map();
 return {data,
  getItem:key=>data.get(key)||null,
  setItem:(key,v)=>data.set(key,v),
  removeItem:key=>data.delete(key)};
}
test('PT-022 saves/restores exact four-front gameplay state and ongoing 7-bag',()=>{
 const original=new Game(()=>.35);
 original.paused=false;
 original.pieces[0].radius=7;original.pieces[0].angle=13;original.pieces[0].rot=2;
 original.pieces[1].radius=4;original.pieces[1].boost=true;
 original.fall=[.7,2.5,1.25,3.6];
 original.board[2][14]=0;original.boardTypes[2][14]=4;
 original.board[3][45]=2;original.boardTypes[3][45]=5;
 original.score=20319;original.seconds=402.6;original.cleared=2;
 original.combo=3;original.placements=18;original.level=5;
 original.events.push({type:'some-pending-audio'});
 const s=storage();
 assert.ok(S.save(s,original,3));
 const v=S.read(s);
 assert.ok(v);
 assert.equal(v.selected,3);
 assert.equal(v.score,20319);
 assert.equal(v.boardTypes[3][45],5);
 const restored=new Game(()=>.95);
 assert.equal(S.restore(restored,v),true);
 assert.deepEqual(restored.board,original.board);
 assert.deepEqual(restored.boardTypes,original.boardTypes);
 assert.deepEqual(restored.fall,original.fall);
 assert.deepEqual(restored.bag,original.bag);
 assert.deepEqual(restored.spawnedTypes,original.spawnedTypes);
 assert.deepEqual(restored.placedTypes,original.placedTypes);
 for(let lane=0;lane<4;lane++){
   assert.equal(restored.pieces[lane].type,original.pieces[lane].type);
   assert.equal(restored.pieces[lane].angle,original.pieces[lane].angle);
   assert.equal(restored.pieces[lane].radius,original.pieces[lane].radius);
   assert.equal(restored.pieces[lane].boost,false);
 }
 assert.deepEqual(restored.events,[]);
 assert.equal(restored.paused,true);
 assert.equal(restored.score,20319);
 assert.equal(restored.combo,3);
 assert.equal(restored.placements,18);
 assert.equal(restored.seconds,402.6);
});
test('PT-022 checkpoints clone nested arrays; no shared mutated live state',()=>{
 const g=new Game(()=>.4);
 const cp=S.capture(g,2);
 g.board[0][0]=1;g.boardTypes[0][0]=6;
 g.pieces[0].radius=3;g.bag.reverse();
 assert.equal(cp.board[0][0],-1);
 assert.equal(cp.boardTypes[0][0],-1);
 assert.equal(cp.pieces[0].radius,15);
 assert.equal(cp.selected,2);
 const reloaded=new Game(()=>0);
 assert.ok(S.restore(reloaded,cp));
 cp.board[2][8]=1;
 assert.equal(reloaded.board[2][8],-1);
});
test('PT-022 rejects invalid/corrupted saves before touching running game',()=>{
 const s=storage(),g=new Game(()=>0);
 g.score=777;
 s.setItem(S.KEY,'{broken-json');
 assert.equal(S.read(s),null);
 assert.equal(g.score,777);
 const good=S.capture(g);
 good.board[1].pop();
 s.setItem(S.KEY,JSON.stringify(good));
 assert.equal(S.read(s),null);
 assert.equal(s.getItem(S.KEY),null);
 assert.equal(S.restore(g,good),false);
 assert.equal(g.score,777);
});
test('PT-022 no saved game after game over; explicit new game only clears session key',()=>{
 const s=storage(),g=new Game(()=>0);
 assert.ok(S.save(s,g,0));
 assert.ok(s.getItem(S.KEY));
 g.over=true;
 assert.equal(S.save(s,g,0),false);
 S.clear(s);
 assert.equal(S.read(s),null);
});
test('PT-022 checkpoint key does not collide with nickname, records or audio',()=>{
 const s=storage(),g=new Game(()=>0);
 s.setItem('partouteris-record','9999');
 s.setItem('partouteris-audio-and-speed-v1','{"enabled":true}');
 s.setItem('partouteris-leaderboard-v1','{"name":"Tous3nKamion"}');
 S.save(s,g,0);
 S.clear(s);
 assert.equal(s.getItem('partouteris-record'),'9999');
 assert.ok(s.getItem('partouteris-audio-and-speed-v1'));
 assert.ok(s.getItem('partouteris-leaderboard-v1'));
});
test('PT-022 UI resumes after an explicit audio gesture and flushes on Android lifecycle',()=>{
 const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
 const css=fs.readFileSync('app/src/main/assets/hud-pt016.css','utf8');
 assert.match(html,/<script src="session.js"><\/script>/);
 assert.match(html,/session\.read\(storage\)/);
 assert.match(html,/session\.restore\(game,savedSession\)/);
 assert.match(html,/id="resumeYes"[^>]*>✓ OUI, REPRENDRE<\/button>/);
 assert.match(html,/id="resumePopup"/);
 assert.match(html,/id="resumeConfirm"/);
 assert.match(html,/id="resumeDiscard"/);
 assert.match(html,/window\.addEventListener\("pagehide"/);
 assert.match(html,/document\.addEventListener\("visibilitychange"/);
 assert.match(html,/session\.save\(storage,game,selected\)/);
 assert.match(html,/session\.clear\(storage\)/);
 assert.match(html,/className="brand-pyramid"/);
 assert.match(css,/#hud \.brand-pyramid/);
 assert.match(html,/className="brand-moon"/);
});

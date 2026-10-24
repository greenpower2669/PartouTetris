(function(root){
"use strict";
// PT-022: independently versioned, local, crash-tolerant checkpoint.
// The state is validated fully BEFORE any existing Game instance is changed.
const KEY="partouteris-session-v1",VERSION=1;
const RINGS=10,SECTORS=48,LANES=4,TYPES=7;
const finite=(x,min,max)=>typeof x==="number"&&Number.isFinite(x)&&x>=min&&x<=max;
const integer=(x,min,max)=>Number.isInteger(x)&&x>=min&&x<=max;
const matrix=(a,rows,cols,lower,upper)=>{
  if(!Array.isArray(a)||a.length!==rows)return false;
  return a.every(row=>Array.isArray(row)&&row.length===cols&&
    row.every(v=>integer(v,lower,upper)));
};
function capture(game,selected=0){
  if(!game||game.over||!integer(selected,0,LANES-1))return null;
  return {
    version:VERSION, savedAt:Date.now(), selected,
    board:game.board.map(r=>r.slice()),
    boardTypes:game.boardTypes.map(r=>r.slice()),
    pieces:game.pieces.map(p=>({
      lane:p.lane,type:p.type,angle:p.angle,radius:p.radius,rot:p.rot,
      // Nullable for backwards compatibility with checkpoints predating PT-030.
      spawnedAtSeconds:Number.isFinite(p.spawnedAtSeconds)?
        p.spawnedAtSeconds:null
    })),
    fall:game.fall.slice(),
    bag:game.bag.slice(),
    spawnedTypes:game.spawnedTypes.slice(),
    placedTypes:game.placedTypes.slice(),
    baseFallSeconds:game.baseFallSeconds,
    score:game.score,cleared:game.cleared,level:game.level,
    seconds:game.seconds,placements:game.placements,combo:game.combo
  };
}
function valid(v){
  if(!v||v.version!==VERSION||!integer(v.selected,0,3)||
     !integer(v.savedAt,0,9e15))return false;
  if(!matrix(v.board,RINGS,SECTORS,-1,LANES-1)||
     !matrix(v.boardTypes,RINGS,SECTORS,-1,TYPES-1))return false;
  // Each occupied cell must have the same vacancy status in both grids.
  for(let r=0;r<RINGS;r++)for(let a=0;a<SECTORS;a++)
    if((v.board[r][a]===-1)!==(v.boardTypes[r][a]===-1))return false;
  if(!Array.isArray(v.pieces)||v.pieces.length!==LANES)return false;
  for(let lane=0;lane<LANES;lane++){
    const p=v.pieces[lane];
    if(!p||!integer(p.lane,lane,lane)||!integer(p.type,0,TYPES-1)||
       !integer(p.angle,0,SECTORS-1)||!integer(p.radius,0,RINGS+5)||
       !integer(p.rot,0,3)||
       // Old v1 save format omitted the creation timestamp. Never invent
       // one: a resumed old piece receives the conservative ×1 factor.
       !(p.spawnedAtSeconds===undefined||p.spawnedAtSeconds===null||
         finite(p.spawnedAtSeconds,0,v.seconds)))return false;
  }
  if(!Array.isArray(v.fall)||v.fall.length!==LANES||
     !v.fall.every(n=>finite(n,0,100)))return false;
  if(!Array.isArray(v.bag)||v.bag.length>TYPES||
     !v.bag.every(n=>integer(n,0,TYPES-1))||
     new Set(v.bag).size!==v.bag.length)return false;
  if(!Array.isArray(v.spawnedTypes)||!Array.isArray(v.placedTypes)||
     v.spawnedTypes.length!==TYPES||v.placedTypes.length!==TYPES||
     !v.spawnedTypes.every(n=>integer(n,0,1e7))||
     !v.placedTypes.every(n=>integer(n,0,1e7)))return false;
  return finite(v.baseFallSeconds,2,8)&&integer(v.score,0,1e12)&&
    integer(v.cleared,0,1e7)&&integer(v.level,1,1e7)&&
    finite(v.seconds,0,1e9)&&integer(v.placements,0,1e7)&&
    integer(v.combo,0,1e7);
}
function restore(game,v){
  if(!game||!valid(v))return false;
  // Deep-copy validated values; never revive old pointer ownership or timers.
  game.board=v.board.map(row=>row.slice());
  game.boardTypes=v.boardTypes.map(row=>row.slice());
  game.pieces=v.pieces.map(p=>({
    ...p,boost:false,
    spawnedAtSeconds:Number.isFinite(p.spawnedAtSeconds)?
      p.spawnedAtSeconds:null
  }));
  game.fall=v.fall.slice();
  game.bag=v.bag.slice();
  game.spawnedTypes=v.spawnedTypes.slice();
  game.placedTypes=v.placedTypes.slice();
  game.baseFallSeconds=v.baseFallSeconds;
  game.score=v.score;game.cleared=v.cleared;
  // Normalize older saves whose level used to increase with elapsed time.
  game.level=1+v.cleared;game.seconds=v.seconds;
  game.placements=v.placements;game.combo=v.combo;
  game.over=false;game.paused=true;game.flash=0;game.events=[];
  return true;
}
function read(storage){
  try{
    const raw=storage?.getItem(KEY);
    if(!raw)return null;
    const v=JSON.parse(raw);
    if(valid(v))return v;
    storage?.removeItem(KEY); // reject invalid or incompatible checkpoints
  }catch(e){return null;}
  return null;
}
function save(storage,game,selected){
  const checkpoint=capture(game,selected);
  if(!checkpoint||!valid(checkpoint))return false;
  try{
    if(!storage)return false;
    storage.setItem(KEY,JSON.stringify(checkpoint));
    return true;
  }catch(e){return false;}
}
function clear(storage){
  try{storage?.removeItem(KEY);return true;}catch(e){return false;}
}
const api={KEY,VERSION,capture,valid,restore,read,save,clear};
root.PartouSession=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof globalThis!=="undefined"?globalThis:this);

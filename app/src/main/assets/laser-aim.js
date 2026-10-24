(function(root){'use strict';
const TAU=Math.PI*2;
function findLocked({board,x,y,cx,cy,inner,stepR,sectors=48}){
 if(!Array.isArray(board)||!(stepR>0)||![x,y,cx,cy,inner].every(Number.isFinite))return null;
 const dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy);
 const a=((Math.atan2(dy,dx)+Math.PI/2)/TAU*sectors%sectors+sectors)%sectors;
 const sector=Math.floor(a),ring=Math.floor((d-inner)/stepR);
 const spot=(s,r)=>{const angle=-Math.PI/2+(s+.5)*TAU/sectors,rad=inner+(r+.5)*stepR;
  return{sector:s,ring:r,to:{x:cx+Math.cos(angle)*rad,y:cy+Math.sin(angle)*rad}}};
 if(board[ring]?.[sector]!==undefined&&board[ring][sector]!==-1)
   return spot(sector,ring);
 const reach=Math.max(22,Math.min(39,stepR*2.9));
 let nearest=null,best=reach*reach;
 for(let r=0;r<board.length;r++)for(let s=0;s<sectors;s++){
  if(board[r]?.[s]===undefined||board[r][s]===-1)continue;
  const target=spot(s,r),dd=(target.to.x-x)**2+(target.to.y-y)**2;
  if(dd<=best){nearest=target;best=dd}
 }
 return nearest;
}
const api={findLocked};root.PartouLaserAim=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof globalThis!=="undefined"?globalThis:this);
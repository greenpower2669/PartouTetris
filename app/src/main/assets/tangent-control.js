(function(root){
  "use strict";
  const TAU=Math.PI*2;
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

  // PT-026: The virtual observer is projected BEHIND the Moon, opposite the
  // grabbed piece along the same centre/piece line (the billiards construction).
  // Both finger samples are evaluated in ONE local frame, so the moving observer
  // itself cannot move the brick when the finger is stationary.
  //
  // For pure tangential motion the offset of that observer cancels in the
  // difference of the two projections. This is deliberate: a translated origin
  // alone cannot fix control reversal; incremental tangent projection can.
  function projectDrag({from,to,angle,orbitRadius,centerX=0,centerY=0,
                        screenWidth=360,sectorCount=48,observerFactor=2.5,
                        baseGain=1}={}){
    if(!from||!to||![from.x,from.y,to.x,to.y,angle].every(Number.isFinite)||
       !Number.isFinite(sectorCount)||sectorCount<=0){
      return {sectorDelta:0,projectedPixels:0,observer:null,tangent:null,gain:0};
    }
    const radius=Math.max(1,Number.isFinite(orbitRadius)?orbitRadius:1);
    const theta=-Math.PI/2+angle*TAU/sectorCount;
    const radial={x:Math.cos(theta),y:Math.sin(theta)};
    const observer={
      x:centerX-radius*Math.max(.1,observerFactor)*radial.x,
      y:centerY-radius*Math.max(.1,observerFactor)*radial.y
    };
    const tangent={x:-radial.y,y:radial.x};
    const along=point=>(point.x-observer.x)*tangent.x+
                         (point.y-observer.y)*tangent.y;
    const projectedPixels=along(to)-along(from);
    const dx=to.x-from.x,dy=to.y-from.y;
    const dt=Number.isFinite(to.time)&&Number.isFinite(from.time)?
      clamp(to.time-from.time,8,100):16;
    const velocity=Math.hypot(dx,dy)*1000/dt;
    // One angular cell should require roughly the same hand travel, even
    // when a brick moves radially or the finger is away from the Moon.
    const referenceRadius=clamp(screenWidth*.22,54,96);
    // Slow hand = greater precision. Quick hand = more range, no hard switch.
    const gain=clamp(Number.isFinite(baseGain)?baseGain:1,.3,3)*
      (.82+.55*clamp((velocity-85)/850,0,1));
    return {
      sectorDelta:clamp(projectedPixels/referenceRadius*sectorCount/TAU*gain,-9,9),
      projectedPixels,observer,tangent,gain,referenceRadius
    };
  }
  root.PartouTangent={projectDrag};
  if(typeof module!=="undefined"&&module.exports)module.exports={projectDrag};
})(typeof globalThis!=="undefined"?globalThis:this);

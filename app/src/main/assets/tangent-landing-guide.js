(function(root){
  "use strict";
  const TAU=Math.PI*2;
  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  const validPoint=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);

  // PT-035: read-only visual bridge between the REAL touch, the mobile
  // ghost-Moon centre (PT-032) and the exact future landing footprint.
  // Never change sector selection, input projection or game state here.
  function localTangent({anchor,target,finger,angle,sectors=48,stepR=16}={}){
    if(!validPoint(anchor)||!validPoint(target)||!validPoint(finger)||
       ![angle,sectors,stepR].every(Number.isFinite)||
       sectors<=0||stepR<=0)return null;
    // Match joystick-guide.js / tangent-control.js; keep 47 -> 0 smooth.
    const theta=-Math.PI/2+(angle/sectors)*TAU;
    const tangent={x:-Math.sin(theta),y:Math.cos(theta)};
    const half=clamp(stepR*1.6,20,32);
    const ends=[-1,1].map(sign=>({
      x:anchor.x+sign*half*tangent.x,
      y:anchor.y+sign*half*tangent.y,
      sign
    }));
    return {
      center:{x:anchor.x,y:anchor.y},
      ends,tangent,half,
      // Separate very faint links show the RELATION, not a new direction
      // for moving the piece. The local tangent is always at ghost Moon.
      links:[
        [{x:target.x,y:target.y},{x:anchor.x,y:anchor.y}],
        [{x:anchor.x,y:anchor.y},{x:finger.x,y:finger.y}]
      ]
    };
  }

  function drawLocalTangent(ctx,args={}){
    const g=localTangent(args);
    if(!ctx||!g)return false;
    const {center,ends,tangent,links}=g;
    const reduced=!!args.reducedMotion;
    const time=Number.isFinite(args.time)?args.time:0;
    const pulse=reduced ? 0.5 : (0.5+0.5*Math.sin(time/550));
    ctx.save();
    ctx.lineCap="round";ctx.lineJoin="round";
    // These links are behind all pieces and as discreet as the ghost Moon:
    // they don't pass input through a second coordinate system.
    ctx.shadowBlur=0;
    ctx.strokeStyle="rgba(130,232,255,0.13)";
    ctx.lineWidth=1.1;
    if(typeof ctx.setLineDash==="function")ctx.setLineDash([3,8]);
    for(const [a,b] of links){
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
    }
    if(typeof ctx.setLineDash==="function")ctx.setLineDash([]);
    // Tiny, symmetric tangent through the ACTUAL ghost-Moon anchor; direction
    // is the same as the bottom joystick and the input engine tangent.
    ctx.strokeStyle="rgba(128,243,255,"+(0.47+0.12*pulse).toFixed(3)+")";
    ctx.lineWidth=2.2;
    ctx.shadowColor="rgba(58,218,250,0.26)";ctx.shadowBlur=reduced?3:6;
    ctx.beginPath();
    ctx.moveTo(ends[0].x,ends[0].y);
    ctx.lineTo(ends[1].x,ends[1].y);
    ctx.stroke();
    const n={x:-tangent.y,y:tangent.x};
    ctx.lineWidth=1.7;
    for(const end of ends){
      const back={x:end.x-end.sign*9*tangent.x,
                  y:end.y-end.sign*9*tangent.y};
      ctx.beginPath();
      ctx.moveTo(back.x+n.x*5,back.y+n.y*5);
      ctx.lineTo(end.x,end.y);
      ctx.lineTo(back.x-n.x*5,back.y-n.y*5);
      ctx.stroke();
    }
    // Hollow pivot; no opaque disc and no flash over a brick.
    ctx.shadowBlur=0;ctx.beginPath();
    ctx.arc(center.x,center.y,3.8,0,TAU);
    ctx.strokeStyle="rgba(210,251,255,0.48)";
    ctx.lineWidth=1.25;ctx.stroke();
    ctx.restore();
    return true;
  }
  root.PartouTangentLanding={localTangent,drawLocalTangent};
  if(typeof module!=="undefined"&&module.exports)
    module.exports={localTangent,drawLocalTangent};
})(typeof globalThis!=="undefined"?globalThis:this);

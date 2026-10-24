(function(root){
  "use strict";
  // PT-028: two small, non-interactive tangent vectors beside the gripping
  // finger. Orientation is derived ONLY from the grabbed piece's current
  // sector; a pointer at an arbitrary screen location never re-anchors it.
  const TAU=Math.PI*2;
  function vectorsForGrip({x,y,angle,sectors=48,time=0,reducedMotion=false}={}){
    if(![x,y,angle].every(Number.isFinite)||!Number.isFinite(sectors)||sectors<=0)return null;
    const theta=-Math.PI/2+angle*TAU/sectors;
    const tangent={x:-Math.sin(theta),y:Math.cos(theta)};
    // Symmetric soft pulse, one single angle and length at all four fronts.
    const pulse=reducedMotion?0.5:(1+Math.sin(time/370))/2;
    // Wider neon arrows stay legible beyond a fingertip without flooding the playfield.
    const inner=30, length=24+18*pulse;
    const normal={x:-tangent.y,y:tangent.x};
    const arrows=[-1,1].map(sign=>{
      const dir={x:tangent.x*sign,y:tangent.y*sign};
      const from={x:x+dir.x*inner,y:y+dir.y*inner};
      const tip={x:from.x+dir.x*length,y:from.y+dir.y*length};
      const wing=7,back=10;
      return {from,tip,headLeft:{x:tip.x-dir.x*back+normal.x*wing,y:tip.y-dir.y*back+normal.y*wing},
        headRight:{x:tip.x-dir.x*back-normal.x*wing,y:tip.y-dir.y*back-normal.y*wing}};
    });
    return {tangent,arrows,length};
  }
  function drawGripVectors(ctx,args){
    const vectors=vectorsForGrip(args);
    if(!vectors||!ctx)return false;
    ctx.save();
    ctx.lineCap="round";ctx.lineJoin="round";
    ctx.globalAlpha=.58; // semi-transparent cyan neon
    ctx.shadowColor="#42dfff";ctx.shadowBlur=12;
    ctx.strokeStyle="#a3f5ff";ctx.lineWidth=4.2;
    for(const a of vectors.arrows){
      ctx.beginPath();
      ctx.moveTo(a.from.x,a.from.y);
      ctx.lineTo(a.tip.x,a.tip.y);
      ctx.lineTo(a.headLeft.x,a.headLeft.y);
      ctx.moveTo(a.tip.x,a.tip.y);
      ctx.lineTo(a.headRight.x,a.headRight.y);
      ctx.stroke();
    }
    ctx.restore();
    return true;
  }
  root.PartouGripVectors={vectorsForGrip,drawGripVectors};
  if(typeof module!=="undefined"&&module.exports)
    module.exports={vectorsForGrip,drawGripVectors};
})(typeof globalThis!=="undefined"?globalThis:this);

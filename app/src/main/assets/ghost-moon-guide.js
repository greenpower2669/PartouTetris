(function(root){
  "use strict";
  const TAU=Math.PI*2;

  // PT-031: pedagogical projection, never a second controller. The centre
  // belongs to the open segment from real Moon C to gripping finger F:
  // A = C + lambda * (F-C), 0 < lambda < 1. The scalar lambda is smoothed
  // over time, and the anchor reprojects onto the CURRENT segment each frame
  // (not fixed at first contact). The arc orientation remains the real
  // brick's radial angle: its tangent is exactly the control tangent.
  function projectedAnchor({x,y,moonCenter,radius=58,lambda=null}={}){
    if(![x,y,moonCenter?.x,moonCenter?.y,radius].every(Number.isFinite)||
       radius<=0)return null;
    const dx=x-moonCenter.x,dy=y-moonCenter.y;
    const distance=Math.hypot(dx,dy);
    // For nearby fingers the circle is deliberately NOT resized: keep a
    // very light visual marker, halfway close to the actual Moon if needed.
    const target=Math.max(.12,Math.min(.94,1-radius/Math.max(distance,1)));
    const portion=Number.isFinite(lambda)?
      Math.max(.12,Math.min(.94,lambda)):target;
    return {x:moonCenter.x+dx*portion,y:moonCenter.y+dy*portion,
      lambda:portion,target};
  }
  function ghostMoonGeometry({x,y,angle,sectors=48,radius=58,anchor=null}={}){
    if(![x,y,angle].every(Number.isFinite)||
       !Number.isFinite(sectors)||sectors<=0||
       !Number.isFinite(radius)||radius<=0)return null;
    const theta=-Math.PI/2+(angle/sectors)*TAU;
    const radial={x:Math.cos(theta),y:Math.sin(theta)};
    const tangent={x:-radial.y,y:radial.x};
    const center=anchor&&Number.isFinite(anchor.x)&&Number.isFinite(anchor.y)?
      {x:anchor.x,y:anchor.y}:{x:x-radius*radial.x,y:y-radius*radial.y};
    return {
      center,
      // This marker follows the brick's angle while the virtual Moon's
      // centre stays at the initial grip anchor.
      contact:{x:center.x+radius*radial.x,y:center.y+radius*radial.y},
      finger:{x,y},radial,tangent,radius,theta
    };
  }

  function drawGhostMoon(ctx,options){
    const g=ghostMoonGeometry(options);
    if(!ctx||!g)return false;
    const {center:c,radius:r,theta}=g;
    ctx.save();
    // Extremely low-opacity lunar disc. Blocks, falling pieces and target
    // remain visible through it. The ghost is drawn BEHIND game pieces.
    ctx.beginPath();
    ctx.arc(c.x,c.y,r,0,TAU);
    ctx.fillStyle="rgba(116,186,225,0.032)";
    ctx.fill();
    ctx.lineWidth=1.3;
    ctx.strokeStyle="rgba(135,235,253,0.15)";
    ctx.stroke();

    // Sparse, ghostly lunar craters: subtle depth without a solid image.
    ctx.strokeStyle="rgba(169,215,236,0.095)";
    ctx.lineWidth=1;
    for(const [dx,dy,scale] of [[-.32,-.19,.15],[.23,.28,.11],[.34,-.28,.085]]){
      ctx.beginPath();
      ctx.arc(c.x+dx*r,c.y+dy*r,r*scale,0,TAU);
      ctx.stroke();
    }

    // Highlight the rim around the held finger, showing the 360° turn
    // and the direction along which the tangent smoothly evolves.
    ctx.beginPath();
    ctx.arc(c.x,c.y,r,theta-.42,theta+.42);
    ctx.strokeStyle="rgba(122,244,255,0.27)";
    ctx.lineWidth=2.4;
    ctx.shadowColor="rgba(72,215,244,0.34)";
    ctx.shadowBlur=6;
    ctx.stroke();

    // A tiny center pin makes the pivot legible, never opaque.
    ctx.shadowBlur=0;
    ctx.beginPath();
    ctx.arc(c.x,c.y,2.7,0,TAU);
    ctx.fillStyle="rgba(177,242,255,0.23)";
    ctx.fill();
    ctx.restore();
    return true;
  }

  class GhostMoonGuide{
    constructor(radius=58){
      this.radius=radius;
      this.pointerId=null;this.lane=null;
      this.anchor=null;this.lambda=null;this.lastTime=null;
    }
    hide(){
      this.pointerId=null;this.lane=null;
      this.anchor=null;this.lambda=null;this.lastTime=null;
    }
    render(ctx,{grip,angle,sectors=48,moonCenter,target,time}={}){
      if(!grip||![grip.lastX,grip.lastY,angle,moonCenter?.x,
          moonCenter?.y].every(Number.isFinite)){
        this.hide();return false;
      }
      // PT-032: after a real grab, replace the airborne piece's frame by
      // the exact projected touchdown footprint. Older callers may omit
      // target; keep the PT-031 Moon-centre fallback.
      const reference=target&&Number.isFinite(target.x)&&
        Number.isFinite(target.y)?target:moonCenter;
      const projection=projectedAnchor({
        x:grip.lastX,y:grip.lastY,moonCenter:reference,radius:this.radius
      });
      if(!projection){this.hide();return false;}
      // Regripping, changing lane or losing focus creates a fresh visual
      // anchor. A pointer that hasn't moved NEVER triggers piece movement.
      if(this.pointerId!==grip.id||this.lane!==grip.lane||
         this.lambda===null){
        this.pointerId=grip.id;this.lane=grip.lane;
        this.lambda=projection.target;
      }else{
        // Smooth ONLY the proportional distance along C -> F, not the
        // position from an outdated axis. Hence the centre is always
        // between the Moon and the CURRENT finger, including diagonals.
        const dt=Number.isFinite(time)&&Number.isFinite(this.lastTime)?
          Math.max(0,Math.min(64,time-this.lastTime)):16;
        const blend=1-Math.exp(-dt/90);
        this.lambda+=(projection.target-this.lambda)*blend;
      }
      this.lastTime=Number.isFinite(time)?time:null;
      const now=projectedAnchor({
        x:grip.lastX,y:grip.lastY,moonCenter:reference,
        radius:this.radius,lambda:this.lambda
      });
      this.anchor={x:now.x,y:now.y};
      return drawGhostMoon(ctx,{
        x:grip.lastX,y:grip.lastY,angle,sectors,radius:this.radius,
        anchor:this.anchor
      });
    }
  }
  root.PartouGhostMoon={ghostMoonGeometry,projectedAnchor,
    drawGhostMoon,GhostMoonGuide};
  if(typeof module!=="undefined"&&module.exports)
    module.exports={ghostMoonGeometry,projectedAnchor,
      drawGhostMoon,GhostMoonGuide};
})(typeof globalThis!=="undefined"?globalThis:this);

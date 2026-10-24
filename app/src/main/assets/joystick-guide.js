(function(root){
  "use strict";
  const TAU=Math.PI*2;
  const clamp=(x,lo,hi)=>Math.min(hi,Math.max(lo,x));

  // PT-027: same local orientation and sector convention as tangent-control.js.
  // This is a READ-ONLY display, not a second pointer input.
  function axisForAngle(angle,sectors=48){
    if(!Number.isFinite(angle)||!Number.isFinite(sectors)||sectors<=0)
      return {x:1,y:0,label:"↔ GAUCHE–DROITE"};
    const theta=-Math.PI/2+angle*TAU/sectors;
    const x=-Math.sin(theta),y=Math.cos(theta);
    const label=Math.abs(x)>.87?"↔ GAUCHE–DROITE":
      Math.abs(y)>.87?"↕ HAUT–BAS":
      x*y>=0?"↘ ↖ DIAGONALE":"↗ ↙ DIAGONALE";
    return {x,y,label};
  }
  function railForAxis({x,y}){
    // PT-028: constant LENGTH (104 SVG units) at every angle. PT-027
    // shortened the vertical rail to 62 units, visually suggesting weaker
    // control on the sides. The tangent maths already uses unit vectors.
    const half=52;
    const a={x:105-x*half,y:60-y*half};
    const b={x:105+x*half,y:60+y*half};
    const wing=8,tip=9;
    const nx=-y,ny=x;
    function arrow(p,d){
      const backX=p.x-x*tip*d,backY=p.y-y*tip*d;
      return "M "+(backX+nx*wing)+" "+(backY+ny*wing)+
        " L "+p.x+" "+p.y+" L "+(backX-nx*wing)+" "+(backY-ny*wing);
    }
    return {half,a,b,path:"M "+a.x+" "+a.y+" L "+b.x+" "+b.y+
      " "+arrow(a,-1)+" "+arrow(b,1)};
  }

  class Guide{
    constructor(element,host){
      this.element=element;this.host=host;
      this.axisLabel=element.querySelector("#guideAxisText");
      this.track=element.querySelector("#guideTrack");
      this.ghost=element.querySelector("#guideGhost");
      this.thumb=element.querySelector("#guideThumb");
      this.active=false;this.lane=-1;this.finger=0;this.lastMotion=0;
      this.lastLabel="";
      this.hide();
    }
    show(lane){
      if(this.active&&this.lane===lane)return;
      this.active=true;this.lane=lane;this.finger=0;this.lastMotion=0;
      this.element.hidden=false;
      this.host.classList.add("guide-active");
    }
    hide(){
      this.active=false;this.lane=-1;this.finger=0;this.lastMotion=0;
      this.element.hidden=true;
      this.host.classList.remove("guide-active");
    }
    movement(projectedPixels,time){
      if(!this.active||!Number.isFinite(projectedPixels))return;
      // Last tiny local input, not an absolute finger angle or target position.
      this.finger=clamp(this.finger*.38+projectedPixels/26,-1,1);
      this.lastMotion=Number.isFinite(time)?time:0;
    }
    render(angle,time,{reducedMotion=false,inSpace=false,landing=false}={}){
      if(!this.active)return;
      const t=axisForAngle(angle),rail=railForAxis(t);
      const label=inSpace?"ESPACE · GUIDAGE APRÈS L’APPROCHE":
        landing?"POSE · "+t.label:t.label;
      if(label!==this.lastLabel){
        this.axisLabel.textContent=label;this.lastLabel=label;
      }
      this.track.setAttribute("d",rail.path);
      // The ghost hand demonstrates the same line; it cannot move the game.
      const travel=reducedMotion?0:Math.sin(time/550)*rail.half*.64;
      const gx=105+t.x*travel,gy=60+t.y*travel;
      this.ghost.setAttribute("transform","translate("+gx.toFixed(2)+" "+gy.toFixed(2)+")");
      // The golden mark is the actual recent tangential finger motion.
      const tx=105+t.x*rail.half*.72*this.finger;
      const ty=60+t.y*rail.half*.72*this.finger;
      this.thumb.setAttribute("cx",tx.toFixed(2));
      this.thumb.setAttribute("cy",ty.toFixed(2));
      this.finger*=.94;
      if(Math.abs(this.finger)<.01)this.finger=0;
    }
  }
  root.PartouJoystickGuide={Guide,axisForAngle,railForAxis};
  if(typeof module!=="undefined"&&module.exports)
    module.exports={Guide,axisForAngle,railForAxis};
})(typeof globalThis!=="undefined"?globalThis:this);

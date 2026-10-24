(function(root) {
  "use strict";
  // The first contact is a persistent grip. Short taps by another finger
  // rotate ONLY that gripped piece, without stealing selection or movement.
  class TwoHandControls {
    constructor({sectorCount=48,chooseLane,onSelect,onMove,onRotate,onBoost,projectDrag=null,experimental=false}) {
      this.sectorCount=sectorCount;
      this.chooseLane=chooseLane;
      this.onSelect=onSelect;
      this.onMove=onMove;
      this.onRotate=onRotate;
      this.onBoost=onBoost;
      this.projectDrag=projectDrag;
      this.experimental=!!experimental;
      this.grip=null;
      this.boostActive=false;
      this.holdDuration=420; // 420ms starts a ten-times-speed fall; tap remains rotate
      this.longTapTravel=26;
      this.taps=new Map();
      this.tapDistance=26;  // tolerance in CSS pixels
      this.tapDuration=360; // long touches never rotate
    }
    isGripping(){return this.grip!==null;}
    down(p) {
      if(this.grip && this.grip.id===p.id)return false;
      if(!this.grip){
        const lane=this.chooseLane(p.angle);
        this.grip={id:p.id,lane,lastAngle:p.angle,lastX:p.x,lastY:p.y,lastTime:p.time,accumulator:0};
        this.onSelect(lane);
        return true;
      }
      if(this.taps.has(p.id))return false;
      this.taps.set(p.id,{x:p.x,y:p.y,time:p.time,moved:false,long:false});
      return true;
    }
    move(p) {
      if(this.grip && p.id===this.grip.id) {
        const g=this.grip,n=this.sectorCount;
        // PT-026: use the LAST finger sample, not the finger's absolute angle
        // around the Moon. This prevents snapping, dead zones and reversals
        // when the hand moves away from the grabbed piece.
        const delta=this.experimental&&typeof this.projectDrag==="function"?
          this.projectDrag(g.lane,{x:g.lastX,y:g.lastY,time:g.lastTime},
            {x:p.x,y:p.y,time:p.time}):
          ((p.angle-g.lastAngle+n*1.5)%n+n)%n-n/2;
        g.lastAngle=p.angle;
        g.lastX=p.x;g.lastY=p.y;g.lastTime=p.time;
        if(!Number.isFinite(delta))return true;
        g.accumulator=Math.max(-8,Math.min(8,g.accumulator+delta));
        for(let i=0;Math.abs(g.accumulator)>=.8&&i<8;i++){
          const direction=Math.sign(g.accumulator);
          this.onMove(g.lane,direction);
          g.accumulator-=direction;
        }
        // PT-021: dragging inward across a lunar quadrant must NEVER
        // trigger a hard drop. Only a deliberate second-finger hold can.
        // The fall boost has no relationship to radial grip motion.
        return true;
      }
      const t=this.taps.get(p.id);
      if(!t)return false;
      if(Math.hypot(p.x-t.x,p.y-t.y)>this.longTapTravel){
        t.moved=true;
        // If the second finger starts sliding after its hold activated,
        // release the boost immediately; it cannot reactivate on this tap.
        if(t.long){t.long=false;this.updateBoost();}
      }
      return true;
    }
    updateBoost(force=false) {
      const active=!!(this.grip&&[...this.taps.values()].some(t=>t.long&&!t.moved));
      if(this.grip&&(force||active!==this.boostActive)){
        this.boostActive=active;
        this.onBoost(this.grip.lane,active);
      }
    }
    tick(time) {
      if(!this.grip)return;
      let changed=false;
      for(const tap of this.taps.values()) {
        if(!tap.moved&&!tap.long&&time-tap.time>=this.holdDuration) {
          tap.long=true;changed=true;
        }
      }
      if(changed)this.updateBoost();
    }
    up(p) {
      if(this.grip && p.id===this.grip.id){
        this.reset();
        return "release";
      }
      const t=this.taps.get(p.id);
      if(!t)return null;
      this.taps.delete(p.id);
      const shortTap=p.time>=t.time && p.time-t.time<=this.tapDuration;
      const stable=!t.moved&&Math.hypot(p.x-t.x,p.y-t.y)<=this.tapDistance;
      // Release a held fast fall immediately, without rotating the piece.
      const wasLong=t.long||p.time-t.time>=this.holdDuration;
      this.updateBoost();
      if(this.grip&&!wasLong&&shortTap&&stable){
        this.onRotate(this.grip.lane);
        return "rotate";
      }
      return "ignored";
    }
    cancel(p) {
      if(this.grip&&this.grip.id===p.id){
        this.reset();
      } else {
        this.taps.delete(p.id);
        this.updateBoost();
      }
    }
    reset() {
      if(this.grip)this.onBoost(this.grip.lane,false);
      this.boostActive=false;
      this.grip=null;
      this.taps.clear();
    }
  }
  root.PartouTouch={TwoHandControls};
  if(typeof module!=="undefined"&&module.exports)module.exports={TwoHandControls};
})(typeof globalThis!=="undefined"?globalThis:this);

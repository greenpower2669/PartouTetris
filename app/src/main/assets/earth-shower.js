(function(root){
  "use strict";
  // PT-043 — Rare, bounded Earth-bound meteor shower.
  // Each target reuses the tested PT-039/040/041 EarthEvents projectile
  // rendering and laser lock; none of them touches gameplay lanes.
  const EarthEvents=root.PartouEarthEvents?.EarthEvents||
    (typeof require==="function"?require("./earth-events.js").EarthEvents:null);
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  class MeteorShower {
    constructor(rng=Math.random){
      this.rng=rng;
      this.reset();
    }
    random(){return clamp(Number(this.rng())||0,0,0.9999999);}
    reset(now=0){
      this.entries=[];
      this.wave=null;
      this.locked=null;
      this.lastType=-1;
      this.nextId=1;
      // 45–90 seconds of actual play before the first rain.
      this.nextAt=now+45+this.random()*45;
    }
    start(now){
      if(this.wave||this.entries.length||!Number.isFinite(now))return null;
      const count=3+Math.floor(this.random()*4); // 3–6 targets.
      this.wave={remaining:count,total:count,nextSpawn:now};
      return {type:"earth-shower",count};
    }
    spawn(now,geometry){
      if(!this.wave||this.wave.remaining<=0||this.entries.length>=6||
         !geometry?.earth||!Number.isFinite(geometry.W))return null;
      const e=new EarthEvents(this.rng);
      e.lastType=this.lastType;
      const ev=e.spawn(now,geometry);
      if(!ev)return null;
      this.lastType=e.active.type;
      // A compact cinematic rain, not a permanent second game mode.
      e.active.duration=3.7+this.random()*.9;
      const entry={id:this.nextId++,event:e};
      this.entries.push(entry);
      this.wave.remaining--;
      this.wave.nextSpawn=now+.45+this.random()*.24;
      return {...ev,shower:true,targetId:entry.id};
    }
    tick(now,geometry){
      if(!Number.isFinite(now)||!geometry?.earth)return [];
      const events=[];
      for(const entry of this.entries){
        const e=entry.event;
        // Do not call EarthEvents.tick on an empty projectile: that method
        // schedules ordinary single-projectile respawns.
        if(e.active||e.pending){
          for(const result of e.tick(now,geometry)){
            events.push({...result,shower:true,targetId:entry.id});
            if(result.type==="earth-impact"&&this.locked===entry.id)
              this.locked=null;
          }
        }else{
          e.effects=e.effects.filter(x=>now-x.start<1.15);
        }
      }
      this.entries=this.entries.filter(({event})=>
        event.active||event.pending||event.effects.length>0);
      if(this.wave&&this.wave.remaining===0&&this.entries.length===0){
        this.wave=null;
        // Full 45–90 quiet seconds after the last shower concludes.
        this.nextAt=now+45+this.random()*45;
      }
      if(!this.wave&&!this.entries.length&&now>=this.nextAt){
        const start=this.start(now);
        if(start)events.push(start);
      }
      if(this.wave&&this.wave.remaining>0&&
         now>=this.wave.nextSpawn){
        const arrival=this.spawn(now,geometry);
        if(arrival)events.push(arrival);
      }
      return events;
    }
    hit(x,y,now,fallSeconds){
      if(!this.wave||this.locked!==null||
         !Number.isFinite(x)||!Number.isFinite(y))return null;
      let chosen=null,nearest=30;
      for(const entry of this.entries){
        const e=entry.event;
        if(!e.active||e.pending)continue;
        const p=e.position(e.active,now);
        if(!p||p.t>=1)continue;
        const distance=Math.hypot(p.x-x,p.y-y);
        if(distance<=nearest){nearest=distance;chosen=entry;}
      }
      if(!chosen)return null;
      const response=chosen.event.hit(x,y,now,fallSeconds);
      if(!response)return null;
      this.locked=chosen.id;
      return {...response,shower:true,targetId:chosen.id};
    }
    draw(ctx,options={}){
      if(!ctx)return;
      // Max six targets, ~27 spark particles each (~162 total); reduced
      // effects use only eight sparks per target for mobile performance.
      for(const entry of this.entries)
        entry.event.draw(ctx,options);
    }
  }
  root.PartouMeteorShower={MeteorShower};
  if(typeof module!=="undefined"&&module.exports)
    module.exports={MeteorShower};
})(typeof globalThis!=="undefined"?globalThis:this);

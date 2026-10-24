(function(root){
  "use strict";
  // PT-039: a self-contained Earth-defense vignette, never a gameplay tetromino.
  // No collisions, no lane changes, no Hall of Fame mutation here.
  const SHAPES=[
    [[-1,0],[0,0],[1,0],[2,0]],[[0,0],[1,0],[0,1],[1,1]],
    [[-1,0],[0,0],[1,0],[1,1]],[[-1,1],[-1,0],[0,0],[1,0]],
    [[-1,0],[0,0],[0,1],[1,1]],[[-1,1],[0,1],[0,0],[1,0]],
    [[-1,0],[0,0],[1,0],[0,1]]
  ];
  const COLORS=["#49e9ff","#ffb95a","#be91ff","#75f0b2","#ff7598","#ffe17c","#6aa7ff"];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function defenseBonus(fallSeconds){
    // Square of PERMANENT gravity only (8 sec baseline); no touch x10 exploit.
    const ratio=8/(Number.isFinite(fallSeconds)&&fallSeconds>0?fallSeconds:8);
    return Math.round(120*clamp(ratio*ratio,1,25));
  }
  class EarthEvents {
    constructor(rng=Math.random){this.rng=rng;this.reset();}
    random(){return clamp(Number(this.rng())||0,0,0.9999999);}
    reset(now=0){
      this.active=null;this.pending=null;this.effects=[];this.lastType=-1;
      this.nextAt=now+9+this.random()*5;
    }
    spawn(now,{W,earth}){
      if(this.active||!earth||!Number.isFinite(W)||W<=0)return null;
      // Seven rotating mino silhouettes, with no consecutive repeated shape.
      const n=SHAPES.length;
      let type=Math.floor(this.random()*(this.lastType<0?n:n-1));
      if(this.lastType>=0&&type>=this.lastType)type++;
      this.lastType=type;
      const side=this.random()<.5?-1:1;
      const x0=side<0?-22:W+22;
      const targetX=earth.x+(this.random()-.5)*earth.r*.95;
      const surfaceY=earth.y-earth.r;
      this.active={type,side,start:now,duration:5.5+this.random()*2,
        x0,y0:surfaceY-120-this.random()*46,
        endX:targetX,endY:surfaceY+9,spin:this.random()*Math.PI*2};
      this.nextAt=now+17+this.random()*12;
      return {type:"earth-spawn",form:type};
    }
    position(active=this.active,now=0){
      if(!active)return null;
      const t=clamp((now-active.start)/active.duration,0,1);
      const e=t*t*(3-2*t);
      return {x:active.x0+(active.endX-active.x0)*e,
        y:active.y0+(active.endY-active.y0)*e,
        t,angle:active.spin+3.8*t,form:active.type};
    }
    // PT-040: luminous particles sampled along the REAL past trajectory.
    // Drawing from past positions, rather than rotating a rigid segment,
    // prevents the old colored "stick" from turning with the tetromino.
    trailParticles(now,{reduced=false,speedRatio=1}={}){
      const a=this.active,p=this.position(a,now);
      if(!a||!p||p.t<=0)return [];
      const speed=clamp(Number(speedRatio)||1,1,2.5);
      // Quicker permanent gravity produces a slightly longer energetic tail.
      const history=(reduced ? 0.32 : 0.72)*Math.sqrt(speed);
      const count=reduced ? 8 : 27;
      const dx=a.endX-a.x0,dy=a.endY-a.y0;
      const length=Math.hypot(dx,dy)||1;
      const perpendicular={x:-dy/length,y:dx/length};
      const particles=[];
      for(let i=0;i<count;i++){
        const fraction=(i+1)/(count+1),age=history*fraction;
        const pastTime=now-age;
        if(pastTime<=a.start)break;
        const past=this.position(a,pastTime);
        if(Math.hypot(past.x-p.x,past.y-p.y)<1.3)continue;
        // Deterministic jitter: no random calls or animation flicker.
        const jitter=Math.sin(i*17.17+a.type*4.31+a.spin*2.7);
        const spread=jitter*(1.5+3.5*fraction);
        const color=fraction<.09?COLORS[a.type]:
          fraction<.30?"#fff1cb":fraction<.53?"#ffcf62":
          fraction<.77?"#ff922e":"#e85a24";
        particles.push({
          x:past.x+perpendicular.x*spread,
          y:past.y+perpendicular.y*spread,
          radius:(reduced ? 0.85 : 1.05)+(1-fraction)*(reduced ? 1.0 : 2.6)
            +(i%5===0?.85:0),
          opacity:(reduced ? 0.57 : 0.87)*Math.pow(1-fraction,1.45),
          color
        });
      }
      return particles;
    }
    resolve(now,reason){
      if(!this.active)return null;
      const obj=this.active,point=this.pending?.point||this.position(obj,now);
      this.active=null;this.pending=null;
      this.effects.push({...point,start:now,reason,form:obj.type});
      if(this.effects.length>7)this.effects.shift();
      return {type:"earth-impact",reason,x:point.x,y:point.y,form:obj.type};
    }
    tick(now,geometry){
      if(!Number.isFinite(now))return [];
      this.effects=this.effects.filter(e=>now-e.start<1.15);
      // PT-041: a player's three beams visibly converge BEFORE detonation.
      // Game time, not wall clock, suspends this phase during pauses.
      if(this.pending){
        if(now>=this.pending.impactAt){
          const pending=this.pending;
          return [{...this.resolve(now,"player"),bonus:pending.bonus,
            speedSquare:pending.speedSquare}];
        }
        return [];
      }
      if(!this.active){
        if(now>=this.nextAt){
          const ev=this.spawn(now,geometry);
          return ev?[ev]:[];
        }
        return [];
      }
      if(now-this.active.start>=this.active.duration){
        // Sometimes it explodes on its own, otherwise a satellite intercepts.
        return [this.resolve(now,this.random()<.65?"satellite":"spontaneous")];
      }
      return [];
    }
    hit(x,y,now,fallSeconds){
      if(!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(now)||
         !this.active||this.pending)return null;
      const p=this.position(this.active,now);
      if(!p||p.t>=1||Math.hypot(p.x-x,p.y-y)>30)return null;
      const bonus=defenseBonus(fallSeconds);
      this.pending={point:p,firedAt:now,impactAt:now+.32,
        bonus,speedSquare:Math.min(25,Math.pow(8/fallSeconds,2))};
      return {type:"earth-locked",reason:"player",x:p.x,y:p.y,
        bonus,form:p.form,impactAt:this.pending.impactAt};
    }
    draw(ctx,{now,reduced=false,emitters=[],speedRatio=1}={}){
      if(!ctx||!Number.isFinite(now))return;
      const p=this.pending?this.pending.point:this.position(this.active,now);
      if(p){
        const shape=SHAPES[p.form],color=COLORS[p.form];
        // Hot particles trail BEHIND the moving tetromino in world coordinates.
        // Soft incandescent white/yellow/orange fades into scattered embers.
        ctx.save();
        ctx.globalCompositeOperation="lighter";
        for(const spark of this.trailParticles(this.pending?.firedAt??now,{reduced,speedRatio})){
          ctx.globalAlpha=spark.opacity;
          ctx.fillStyle=spark.color;
          ctx.shadowColor=spark.color;
          ctx.shadowBlur=reduced?2:Math.min(10,spark.radius*2.4);
          ctx.beginPath();ctx.arc(spark.x,spark.y,spark.radius,0,Math.PI*2);ctx.fill();
        }
        ctx.restore();
        ctx.save();
        ctx.translate(p.x,p.y);ctx.rotate(p.angle);
        ctx.shadowColor=color;ctx.shadowBlur=reduced?4:8;
        ctx.globalAlpha=.95;
        for(const [sx,sy] of shape){
          ctx.fillStyle=color;ctx.fillRect(sx*10-4.5,sy*10-4.5,9,9);
          ctx.strokeStyle="#f4fbff";ctx.lineWidth=.9;
          ctx.strokeRect(sx*10-4.5,sy*10-4.5,9,9);
        }
        ctx.restore();
      }
      if(this.pending&&emitters.length){
        const phase=clamp((now-this.pending.firedAt)/.32,0,1);
        // Three simultaneous laser rays, one per actual pyramid satellite;
        // never hide or remove the target until the subsequent impact tick.
        const point=this.pending.point;
        for(const from of emitters.slice(0,3)){
          if(!from||!Number.isFinite(from.x)||!Number.isFinite(from.y))continue;
          ctx.save();ctx.globalCompositeOperation="lighter";
          ctx.lineCap="round";
          ctx.shadowColor="#55e8ff";ctx.shadowBlur=reduced?6:17+10*phase;
          ctx.strokeStyle="#22cfff";ctx.globalAlpha=.75+.2*phase;
          ctx.lineWidth=reduced?2:4.2;ctx.beginPath();
          ctx.moveTo(from.x,from.y);ctx.lineTo(point.x,point.y);ctx.stroke();
          ctx.shadowColor="#faffff";ctx.shadowBlur=6;
          ctx.lineWidth=1.6;ctx.strokeStyle="#eaffff";ctx.stroke();
          ctx.restore();
        }
      }
      for(const e of this.effects){
        const life=clamp((now-e.start)/1.15,0,1);
        const alpha=1-life;
        ctx.save();
        const color=e.reason==="player"?"#ffe77c":e.reason==="satellite"?"#65eaff":"#ff964f";
        if(e.reason==="satellite"&&emitters.length){
          const source=emitters[e.form%emitters.length];
          if(source&&Number.isFinite(source.x)&&Number.isFinite(source.y)){
            ctx.strokeStyle="#8bf5ff";ctx.lineWidth=3.2*alpha;ctx.shadowColor="#55eaff";
            ctx.shadowBlur=reduced?3:12;
            ctx.beginPath();ctx.moveTo(source.x,source.y);ctx.lineTo(e.x,e.y);ctx.stroke();
          }
        }
        ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.shadowColor=color;
        ctx.shadowBlur=reduced?3:13;ctx.lineWidth=2.5;
        ctx.beginPath();ctx.arc(e.x,e.y,6+life*(reduced?19:43),0,Math.PI*2);ctx.stroke();
        if(!reduced){
          for(let k=0;k<12;k++){
            const a=k*Math.PI/6+e.form*.5;
            const length=8+life*(26+(k%3)*7);
            ctx.beginPath();ctx.moveTo(e.x+Math.cos(a)*8,e.y+Math.sin(a)*8);
            ctx.lineTo(e.x+Math.cos(a)*length,e.y+Math.sin(a)*length);ctx.stroke();
          }
        }
        ctx.restore();
      }
    }
  }
  root.PartouEarthEvents={EarthEvents,defenseBonus,SHAPES};
  if(typeof module!=="undefined"&&module.exports)
    module.exports={EarthEvents,defenseBonus,SHAPES};
})(typeof globalThis!=="undefined"?globalThis:this);

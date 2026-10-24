(function(root) {
"use strict";
// Lunar Temple: deterministic procedural art, offline and lightweight.
// Geometry/game state remain owned by engine.js.
const TAU=Math.PI*2;
const PALETTE=[
  ["#e6fcff","#62d7f1","#146a91"],
  ["#fff2b8","#e6ae51","#855122"],
  ["#f0e7ff","#ab8cf3","#55469d"],
  ["#ffd8b5","#f47c69","#8b394c"]
];
function shadeFor(color){
  const i=["#67dcf1","#ffd567","#bca5ff","#ff9077"].indexOf(color);
  if(i>=0)return PALETTE[i];
  const n=parseInt(color.slice(1),16),rgb=[(n>>16)&255,(n>>8)&255,n&255];
  const mix=(p)=>"#"+rgb.map(x=>Math.round(x*p).toString(16).padStart(2,"0")).join("");
  return ["#ffffff",color,mix(.45)];
}
function rng(seed){return function(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function position(cx,cy,r,a){return [cx+Math.cos(a)*r,cy+Math.sin(a)*r];}
// The chute is a landing aid, never a feature of the outer-space journey.
function shouldDeployCanopy(radial,ringCount=10){
  return Number.isFinite(radial) && radial>=0 && radial<ringCount;
}
class Artist {
  constructor(ctx) {
    this.ctx=ctx;
    const rand=rng(72841);this.stars=[];
    for(let i=0;i<170;i++)this.stars.push({x:rand(),y:rand(),r:.25+rand()*1.25,a:.24+rand()*.6});
    this.moonTexture=this.makeMoonTexture();
    this.earthTexture=this.makeEarthTexture();
    this.cloudBand=this.makeCloudBand();
  }
  makeEarthTexture(){
    // Prebaked once per launch: textured Earth remains one draw call per frame.
    // Deterministic cloud/ocean/land fractals avoid network or bulky third-party assets.
    const size=480, el=document.createElement("canvas");el.width=size;el.height=size;
    const c=el.getContext("2d"),pixels=c.createImageData(size,size),out=pixels.data;
    const hash=(x,y)=>{
      let h=(Math.imul(x,374761393)^Math.imul(y,668265263))|0;
      h=Math.imul(h^(h>>>13),1274126177);
      return ((h^(h>>>16))>>>0)/4294967295;
    };
    const smooth=t=>t*t*(3-2*t);
    const noise=(u,v)=>{
      const x=Math.floor(u),y=Math.floor(v),fx=smooth(u-x),fy=smooth(v-y);
      const a=hash(x,y)*(1-fx)+hash(x+1,y)*fx;
      const b=hash(x,y+1)*(1-fx)+hash(x+1,y+1)*fx;
      return a*(1-fy)+b*fy;
    };
    const clamp=v=>Math.max(0,Math.min(255,Math.round(v)));
    for(let yy=0;yy<size;yy++)for(let xx=0;xx<size;xx++){
      const x=(xx+.5-size/2)/(size*.478),y=(yy+.5-size/2)/(size*.478);
      const d=x*x+y*y;if(d>1)continue;
      const rim=Math.sqrt(Math.max(0,1-d));
      const lon=x/(.6+.4*rim),lat=y/(.6+.4*rim);
      const landNoise=.52*noise(lon*3+4,lat*3+8)
        +.29*noise(lon*9+7,lat*9+2)+.19*noise(lon*26+6,lat*26+11);
      const isLand=landNoise>.53;
      const terrain=Math.max(0,Math.min(1,(landNoise-.51)*6));
      const clouds=Math.max(0,(noise(lon*18+13,lat*16+37)*.67+
        noise(lon*42+40,lat*40+5)*.33-.63)*2.8);
      const oceanVariation=noise(lon*17+1,lat*15+4);
      const light=Math.max(.22,Math.min(1.1,.56-.30*x-.37*y+.23*rim));
      const cloudAlpha=Math.min(.67,clouds*.78);
      let R=isLand?43+terrain*62:7+oceanVariation*24;
      let G=isLand?88+terrain*63:62+oceanVariation*47;
      let B=isLand?61+terrain*18:133+oceanVariation*91;
      const city=isLand&&light<.58&&noise(lon*108+1,lat*98+2)>.78;
      if(city){R+=110;G+=70;B+=7;}
      R=(R*(1-cloudAlpha)+225*cloudAlpha)*light;
      G=(G*(1-cloudAlpha)+241*cloudAlpha)*light;
      B=(B*(1-cloudAlpha)+249*cloudAlpha)*light;
      // Thin pale atmosphere at grazing angles, like the illuminated rim.
      const atmosphere=Math.pow(1-rim,4)*.52;
      const k=(yy*size+xx)*4;
      out[k]=clamp(R*(1-atmosphere)+126*atmosphere);
      out[k+1]=clamp(G*(1-atmosphere)+221*atmosphere);
      out[k+2]=clamp(B*(1-atmosphere)+255*atmosphere);
      out[k+3]=255;
    }
    c.putImageData(pixels,0,0);
    return el;
  }
  makeCloudBand(){
    // White translucent atmospheric strokes generated once, not per frame.
    const el=document.createElement("canvas");
    el.width=512;el.height=256;
    const c=el.getContext("2d"),rand=rng(782103);
    for(let i=0;i<160;i++){
      const x=rand()*512,y=18+rand()*220,w=8+rand()*68;
      c.save();c.globalAlpha=.035+rand()*.10;
      c.strokeStyle="#ffffff";c.shadowColor="#e5f6ff";
      c.shadowBlur=rand()*7;c.lineWidth=1+rand()*7;
      c.beginPath();c.moveTo(x-w*.5,y);
      c.bezierCurveTo(x-w*.2,y-8-rand()*9,x+w*.2,y+10+rand()*9,x+w*.5,y);
      c.stroke();c.restore();
    }
    return el;
  }
  cyclones({x,y,r,time=0,reduced=false}){
    const c=this.ctx;
    for(let i=0;i<3;i++){
      const latitude=[-.32,.06,.38][i],theta=time*.043+i*2.38+.5;
      const horizontal=Math.sin(theta),front=Math.cos(theta);
      if(front<-.12)continue;
      const xx=x+horizontal*r*.68,yy=y+latitude*r;
      const size=r*[.16,.115,.085][i]*(reduced?.8:1);
      c.save();c.translate(xx,yy);c.rotate(time*.22*(i%2?1:-1));
      c.scale(Math.max(.15,front),1);
      c.strokeStyle="rgba(246,253,255,"+(.19+.29*Math.max(0,front))+")";
      c.shadowColor="#d9f5ff";c.shadowBlur=reduced?0:5;
      for(let k=0;k<3;k++){
        c.lineWidth=Math.max(.7,size*.065);c.beginPath();
        for(let j=0;j<=44;j++){
          const t=j/44*Math.PI*3.4+k*.36,rad=size*(.12+j/55);
          const px=Math.cos(t)*rad,py=Math.sin(t)*rad*.66;
          if(j===0)c.moveTo(px,py);else c.lineTo(px,py);
        }
        c.stroke();
      }
      c.fillStyle="rgba(228,247,255,.20)";
      c.beginPath();c.arc(0,0,size*.11,0,TAU);c.fill();
      c.restore();
    }
  }
  makeMoonTexture(){
    const size=640,c=document.createElement("canvas");c.width=size;c.height=size;
    const x=c.getContext("2d"),cx=size/2,cy=size/2,r=size*.47;
    const gradient=x.createRadialGradient(cx-r*.46,cy-r*.50,r*.05,cx,cy,r*1.28);
    gradient.addColorStop(0,"#e6e3d1");gradient.addColorStop(.3,"#b4b9b5");
    gradient.addColorStop(.68,"#6e7f87");gradient.addColorStop(1,"#202e43");
    x.fillStyle=gradient;x.beginPath();x.arc(cx,cy,r,0,TAU);x.fill();
    x.save();x.beginPath();x.arc(cx,cy,r-2,0,TAU);x.clip();
    const random=rng(31317);
    for(let i=0;i<105;i++){
      const xx=cx+(random()*1.8-.9)*r, yy=cy+(random()*1.8-.9)*r;
      if(Math.hypot(xx-cx,yy-cy)>r*.87)continue;
      const cr=(.013+random()*.065)*r;
      x.fillStyle="rgba(25,46,62,.27)";
      x.beginPath();x.ellipse(xx+cr*.21,yy+cr*.28,cr*1.16,cr*.83,random(),0,TAU);x.fill();
      x.strokeStyle="rgba(241,242,222,.38)";x.lineWidth=Math.max(1,cr*.16);
      x.beginPath();x.arc(xx-cr*.12,yy-cr*.12,cr,.15,Math.PI*1.32);x.stroke();
      x.strokeStyle="rgba(22,46,64,.45)";x.lineWidth=Math.max(1,cr*.10);
      x.beginPath();x.arc(xx,yy,cr,-.05,Math.PI);x.stroke();
    }
    for(let i=0;i<1800;i++){
      const xx=cx+(random()*2-1)*r, yy=cy+(random()*2-1)*r;
      if((xx-cx)**2+(yy-cy)**2>r*r)continue;
      x.fillStyle=random()>.54?"rgba(245,245,224,.095)":"rgba(8,27,45,.10)";
      x.fillRect(xx,yy,.6+random()*1.7,.6+random()*1.8);
    }
    // PT-007: Pyramids now live beside the title, leaving the Moon unobstructed.
    // Golden crown / visual focus.
    const glow=x.createRadialGradient(cx,cy-r*.2,3,cx,cy-r*.2,r*.35);
    glow.addColorStop(0,"rgba(255,237,153,.35)");glow.addColorStop(1,"rgba(255,215,140,0)");
    x.fillStyle=glow;x.fillRect(cx-r*.4,cy-r*.58,r*.8,r*.8);
    x.restore();
    x.lineWidth=r*.025;x.strokeStyle="#fff6d089";x.beginPath();x.arc(cx,cy,r-2,3.0,5.25);x.stroke();
    return c;
  }
  backdrop({W,H,cx,cy,inner,outer,stepR,sectors,flash=0,earth=null,time=0,reduced=false}){
    const c=this.ctx;
    const deep=c.createRadialGradient(cx,cy,inner*.4,cx,cy,Math.max(W,H)*.74);
    deep.addColorStop(0,"#1c284a");deep.addColorStop(.38,"#080f26");deep.addColorStop(1,"#020512");
    c.fillStyle=deep;c.fillRect(0,0,W,H);
    const nebula=[[.2,.25,.3,"69,75,139"],[.75,.3,.3,"34,90,122"],[.18,.9,.4,"57,55,100"]];
    for(const [xx,yy,sz,col] of nebula){
      const R=Math.max(W,H)*sz,g=c.createRadialGradient(xx*W,yy*H,0,xx*W,yy*H,R);
      g.addColorStop(0,"rgba("+col+",.21)");g.addColorStop(1,"rgba("+col+",0)");
      c.fillStyle=g;c.fillRect(xx*W-R,yy*H-R,R*2,R*2);
    }
    // Nebula depth in the existing Canvas: no flattened screenshot overlay.
    for(const [px,py,rx,ry,col] of [[.08,.40,.31,.27,"32,110,174"],[.94,.58,.39,.33,"124,69,153"]]){
      c.save();c.translate(px*W,py*H);c.scale(rx*W,ry*H);
      const mist=c.createRadialGradient(0,0,0,0,0,1);
      mist.addColorStop(0,"rgba("+col+",.17)");
      mist.addColorStop(1,"rgba("+col+",0)");
      c.fillStyle=mist;c.beginPath();c.arc(0,0,1,0,TAU);c.fill();c.restore();
    }
    for(let i=0;i<this.stars.length;i++){
      const s=this.stars[i];const x=s.x*W,y=s.y*H;
      c.fillStyle=i%7===0?"rgba(251,222,155,"+s.a+")":"rgba(207,232,255,"+s.a+")";
      c.beginPath();c.arc(x,y,s.r,0,TAU);c.fill();
      if(i%27===0){
        c.strokeStyle="rgba(187,227,254,.24)";c.lineWidth=.7;
        c.beginPath();c.moveTo(x-4,y);c.lineTo(x+4,y);c.moveTo(x,y-4);c.lineTo(x,y+4);c.stroke();
      }
    }
    // Earth is large and decorative; touch remains delegated to the orbital canvas.
    if(earth&&earth.r>3){
      const {x,y,r}=earth;
      c.save();
      const aura=c.createRadialGradient(x,y,r*.78,x,y,r*1.28);
      aura.addColorStop(0,"rgba(84,196,255,.10)");
      aura.addColorStop(.67,"rgba(58,150,245,.34)");
      aura.addColorStop(1,"rgba(42,98,221,0)");
      c.fillStyle=aura;c.beginPath();c.arc(x,y,r*1.28,0,TAU);c.fill();
      c.shadowColor="#67d8ff";c.shadowBlur=r*.22;
      c.save();c.translate(x,y);
      c.rotate(reduced?0:(time*.018)%TAU); // uninterrupted planetary rotation
      c.drawImage(this.earthTexture,-r,-r,r*2,r*2);
      c.restore();c.shadowBlur=0;
      c.save();c.beginPath();c.arc(x,y,r*.958,0,TAU);c.clip();
      c.globalAlpha=reduced?.20:.37;
      const layerWidth=r*2.15,layerHeight=r*2;
      const offset=((time*(reduced?1:4.8))%layerWidth+layerWidth)%layerWidth;
      for(let k=-1;k<=1;k++)
        c.drawImage(this.cloudBand,x-r+offset+k*layerWidth,y-r,layerWidth,layerHeight);
      c.globalAlpha=1;
      this.cyclones({x,y,r,time,reduced});
      c.restore();
      c.strokeStyle="rgba(161,229,255,.80)";c.lineWidth=Math.max(2,r*.014);
      c.beginPath();c.arc(x,y,r*.965,Math.PI*1.08,Math.PI*1.91);c.stroke();
      c.restore();
    }
    // Low-contrast cyan/gold orbital halos around Earth, inspired by the
    // official PT icon and the user's pyramid-satellite defence illustration.
    // Their rear-plane placement keeps the planet and falling blocks legible.
    if(earth&&earth.r>3){
      c.save();
      c.lineWidth=1.3;
      c.strokeStyle="rgba(67,210,252,.30)";
      c.beginPath();c.ellipse(earth.x,earth.y,earth.r*2.05,earth.r*.73,-.18,0,TAU);c.stroke();
      c.shadowColor="#f7d082";c.shadowBlur=5;
      c.strokeStyle="rgba(241,192,103,.55)";
      c.lineWidth=2;
      c.beginPath();c.ellipse(earth.x,earth.y,earth.r*2.06,earth.r*.74,-.18,.2,1.20);c.stroke();
      c.shadowBlur=0;
      c.restore();
    }
    // Gold-tech temple orbital machinery, restrained grid for clarity.
    c.save();c.shadowColor="#edb35d";c.shadowBlur=flash>0?16:5;
    c.lineWidth=3;c.strokeStyle="rgba(216,172,96,.50)";
    c.beginPath();c.arc(cx,cy,outer+6,0,TAU);c.stroke();
    c.shadowBlur=0;c.lineWidth=1.1;
    c.strokeStyle="rgba(118,208,230,.11)";
    for(let r=0;r<=Math.round((outer-inner)/stepR);r++){
      c.beginPath();c.arc(cx,cy,inner+r*stepR,0,TAU);c.stroke();
    }
    // Detailed gold/cyan dial ticks follow the user's concentric visual grammar.
    c.strokeStyle="rgba(111,228,250,.64)";c.lineWidth=1.6;
    c.beginPath();c.arc(cx,cy,outer-3,0,TAU);c.stroke();
    for(let tick=0;tick<96;tick++){
      const a=-Math.PI/2+tick*TAU/96;
      const big=tick%24===0,mid=tick%6===0;
      const p0=position(cx,cy,outer+5,a),p1=position(cx,cy,outer+(big?15:mid?11:8),a);
      c.strokeStyle=big?"#fbe1a2":mid?"rgba(116,231,252,.76)":"rgba(204,174,123,.34)";
      c.lineWidth=big?1.8:.9;c.beginPath();c.moveTo(...p0);c.lineTo(...p1);c.stroke();
    }
    const len=outer-inner;
    for(let a=0;a<sectors;a++){
      const theta=-Math.PI/2+a*TAU/sectors;
      const [x0,y0]=position(cx,cy,inner,theta);
      const [x1,y1]=position(cx,cy,outer,theta);
      c.strokeStyle=a%12===0?"rgba(242,184,91,.50)":a%4===0?"rgba(96,197,224,.18)":"rgba(105,161,189,.075)";
      c.lineWidth=a%12===0?2:a%4===0?1:.6;
      c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();
    }
    c.strokeStyle="rgba(246,210,140,.60)";c.lineWidth=3;
    for(let k=0;k<4;k++){
      const a=-Math.PI/2+k*Math.PI/2;
      c.beginPath();c.arc(cx,cy,outer+13,a-.17,a+.17);c.stroke();
      for(const d of [-.12,.12]){
        const [x,y]=position(cx,cy,outer+13,a+d);
        c.fillStyle="#e0b36a";c.beginPath();c.arc(x,y,2.3,0,TAU);c.fill();
      }
    }
    c.restore();
  }
  moon({cx,cy,inner}){
    const c=this.ctx,r=inner*.96;
    c.save();c.shadowColor="#a0dfff";c.shadowBlur=r*.28;
    c.fillStyle="#9edaff22";c.beginPath();c.arc(cx,cy,r*1.08,0,TAU);c.fill();
    c.restore();
    c.drawImage(this.moonTexture,cx-r,cy-r,r*2,r*2);
    c.save();c.strokeStyle="rgba(127,223,245,.46)";c.lineWidth=Math.max(1,r*.017);
    c.shadowColor="#74d5fc";c.shadowBlur=Math.max(4,r*.10);
    c.beginPath();c.arc(cx,cy,r*1.018,0,TAU);c.stroke();c.restore();
    c.lineWidth=Math.max(1.5,r*.032);c.strokeStyle="#f8d28b99";
    c.beginPath();c.arc(cx,cy,r,3.5,5.55);c.stroke();
  }
  cell({cx,cy,inner,stepR,sector,ring,color,opacity=1,stroke=true,glow=0}){
    if(ring<0||ring>=16)return;
    const c=this.ctx, palette=shadeFor(color);
    const a0=-Math.PI/2+sector*TAU/48+.009;
    const a1=-Math.PI/2+(sector+1)*TAU/48-.009;
    const space=stepR*.58;
    const radiusAt=(r)=>inner+stepR*Math.min(10,r)+Math.max(0,r-10)*space;
    const low=radiusAt(ring)+.5,high=radiusAt(ring+1)-.5;
    const gradient=c.createLinearGradient(...position(cx,cy,high,a0),...position(cx,cy,low,a1));
    gradient.addColorStop(0,palette[0]);gradient.addColorStop(.46,palette[1]);gradient.addColorStop(1,palette[2]);
    c.save();c.globalAlpha=opacity;
    c.beginPath();c.arc(cx,cy,high,a0,a1,false);
    c.arc(cx,cy,low,a1,a0,true);c.closePath();
    c.fillStyle=gradient;c.fill();
    // PT-037: visible breathing halo, emitted OUTSIDE each cell silhouette.
    // The two luminous colors cross-fade as energy rises / falls.
    // Canvas shadow alone was too weak on Android WebView.
    const energy=Math.max(0,Math.min(1,Number(glow)||0));
    if(energy>0){
      const blend=Math.max(0,Math.min(1,Number(arguments[0].colorMix)||0));
      const a=arguments[0].glowA||"#38eaff";
      const b=arguments[0].glowB||"#ffd36a";
      const rgb=(hex)=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
      const ar=rgb(a),br=rgb(b);
      const mix=(t)=>"rgb("+ar.map((v,i)=>Math.round(v*(1-t)+br[i]*t)).join(",")+")";
      const radiance=mix(blend),opposite=mix(1-blend);
      c.save();
      c.globalCompositeOperation="screen";
      // Outward glow follows the annular cell shape, not a circle.
      // Multiple strokes at descending width make a strong, visible aura.
      c.lineJoin="round";
      c.strokeStyle=radiance;
      c.shadowColor=radiance;
      c.shadowBlur=stepR*(2+2*energy);
      c.globalAlpha=.35+.53*energy;
      c.lineWidth=stepR*(.36+.27*energy);
      c.stroke();
      c.shadowBlur=stepR*(.75+energy);
      c.globalAlpha=.65+.3*energy;
      c.lineWidth=stepR*.22;
      c.strokeStyle=opposite;c.shadowColor=opposite;c.stroke();
      // Cell interior clearly fluctuates; preserve original color/texture.
      c.shadowBlur=stepR*.6;
      c.globalAlpha=.06+.36*energy;
      c.fillStyle=radiance;c.fill();
      c.restore();
    }
    if(stroke){
      c.strokeStyle="rgba(255,252,228,.65)";c.lineWidth=.85;c.stroke();
      c.beginPath();c.arc(cx,cy,high-1.2,a0+.004,a1-.004);
      c.strokeStyle="rgba(255,255,255,.48)";c.lineWidth=1.4;c.stroke();
      c.beginPath();c.arc(cx,cy,low+.5,a0,a1);
      c.strokeStyle="rgba(10,27,44,.65)";c.lineWidth=1.7;c.stroke();
      const mid=(a0+a1)/2;
      const [x,y]=position(cx,cy,(low+high)/2,mid);
      c.fillStyle="rgba(255,255,224,.44)";
      c.beginPath();c.arc(x,y,Math.min(stepR*.10,1.15),0,TAU);c.fill();
    }
    c.restore();
  }
  // PT-017: pieces travel visually FROM Earth TO their own lunar front.
  // Canvas-only projection, not new physics and not another collision layer.
  spacePiece({position,cells,angle,color,time=0,reduced=false,size=11}){
    if(!position)return;
    const c=this.ctx,{x,y,launch,progress,scale}=position;
    const dx=x-launch.x,dy=y-launch.y,travel=Math.hypot(dx,dy)||1;
    const ux=dx/travel,uy=dy/travel;
    const s=Math.max(6,Math.min(14,size*1.2))*scale;
    const palette=shadeFor(color);
    c.save();
    // Small warm plasma tail, behind the oncoming cluster.
    c.shadowBlur=reduced?2:10;c.shadowColor="#ff6a1f";
    const trail=reduced?8:13+12*progress;
    const gradient=c.createLinearGradient(x,y,x-ux*trail,y-uy*trail);
    gradient.addColorStop(0,"#fff4af");gradient.addColorStop(.4,"#ff8b30");
    gradient.addColorStop(1,"rgba(242,67,21,0)");
    c.lineWidth=Math.max(2,s*.45);c.strokeStyle=gradient;
    c.beginPath();c.moveTo(x,y);
    c.lineTo(x-ux*trail,y-uy*trail);c.stroke();
    c.shadowColor=color;c.shadowBlur=reduced?1:9;
    for(const [da,dr] of cells){
      const px=x+da*s,py=y+dr*s;
      c.fillStyle=palette[1];c.fillRect(px-s*.45,py-s*.45,s*.91,s*.91);
      c.strokeStyle=palette[0];c.lineWidth=1;c.strokeRect(px-s*.45,py-s*.45,s*.91,s*.91);
      c.fillStyle="rgba(255,255,255,.45)";c.fillRect(px-s*.30,py-s*.30,s*.35,Math.max(.8,s*.09));
    }
    c.restore();
  }
  // Hot wreckage approaches radially from space, flame tails outward.
  // Purely visual: it never changes gravity or creates collisions in flight.
  incoming({cx,cy,inner,stepR,angle,radial,time=0,reduced=false}) {
    if(radial<9)return; // Space flight, not a parachute or fire near the Moon
    const c=this.ctx;
    const radius=inner+Math.min(radial,10)*stepR+Math.max(0,radial-10)*stepR*.58+stepR*.4;
    const a=-Math.PI/2+(angle+.5)*TAU/48;
    const ux=Math.cos(a),uy=Math.sin(a);
    const x=cx+ux*radius,y=cy+uy*radius;
    const k=Math.max(0,Math.min(1,(radial-9)/5));
    const len=(reduced?10:15+Math.min(27,radial*2.3))*k;
    c.save();c.globalAlpha=Math.max(.05,k*(reduced?.38:.84));
    c.shadowColor="#ff8227";c.shadowBlur=reduced?3:13;
    for(let j=0;j<3;j++){
      const side=(j-1)*(3+2*k);
      const wave=reduced?0:Math.sin(time*8+j*3+angle*.4)*2.2;
      const tangentX=-uy,tangentY=ux;
      const x0=x+side*tangentX,y0=y+side*tangentY;
      const g=c.createLinearGradient(x0,y0,x0+ux*len,y0+uy*len);
      g.addColorStop(0,j===1?"#fff0ad":"#ffd36c");
      g.addColorStop(.4,j===1?"#ff7522":"#e94d1d");
      g.addColorStop(1,"rgba(160,28,15,0)");
      c.lineWidth=j===1?5.5*k:3*k;c.strokeStyle=g;
      c.beginPath();c.moveTo(x0,y0);
      c.quadraticCurveTo(x0+ux*len*.48+tangentX*wave,
                         y0+uy*len*.48+tangentY*wave,
                         x0+ux*len+tangentX*wave*2,
                         y0+uy*len+tangentY*wave*2);c.stroke();
    }
    c.restore();
  }
  charge({from,progress=0,reduced=false}){
    if(!from)return;
    const c=this.ctx,p=Math.max(0,Math.min(1,progress));
    c.save();c.globalAlpha=1-p*.3;
    c.strokeStyle="#ffd595";c.lineWidth=1.4;c.shadowColor="#76ecff";
    c.shadowBlur=reduced?2:9+6*p;
    c.beginPath();c.arc(from.x,from.y,3+8*p,0,TAU);c.stroke();
    c.fillStyle="#f6ffff";c.beginPath();c.arc(from.x,from.y,2+2*p,0,TAU);c.fill();
    c.restore();
  }
  laser({from,to,life=1,color="#7df5ff",reduced=false}){
    if(!from||!to)return;
    const c=this.ctx,k=Math.max(0,Math.min(1,life));
    c.save();c.globalAlpha=k;
    c.strokeStyle=color;c.shadowColor=color;c.shadowBlur=reduced?3:16;
    c.lineWidth=reduced?2:3.5;c.lineCap="round";
    c.beginPath();c.moveTo(from.x,from.y);c.lineTo(to.x,to.y);c.stroke();
    c.shadowBlur=0;c.strokeStyle="#fffad1";c.lineWidth=1.2;
    c.beginPath();c.moveTo(from.x,from.y);c.lineTo(to.x,to.y);c.stroke();
    if(!reduced){
      c.strokeStyle=color;c.lineWidth=2.6;
      c.beginPath();c.arc(to.x,to.y,10+(1-k)*19,0,TAU);c.stroke();
    }
    if(!reduced){
      const dx=to.x-from.x,dy=to.y-from.y;
      c.fillStyle="rgba(247,255,255,.94)";c.shadowColor=color;c.shadowBlur=9;
      for(const t of [.29,.62,.91]){
        c.beginPath();c.arc(from.x+dx*t,from.y+dy*t,1.3+1.4*(1-k),0,TAU);c.fill();
      }
    }
    c.restore();
  }
  canopy({cx,cy,inner,stepR,angle,radial,color="#72e8ff",reduced=false}){
    if(!shouldDeployCanopy(radial))return false;
    const c=this.ctx;
    const theta=-Math.PI/2+(angle+.5)*TAU/48;
    // Tether stays on the outside of the currently controlled piece.
    const r=inner+(radial+1.95)*stepR;
    const [x,y]=position(cx,cy,r,theta);
    // One small foldable gold/cyan foil, much subtler than the old parachute.
    const s=Math.max(6,Math.min(11,stepR*1.6));
    c.save();
    c.translate(x,y);c.rotate(theta+Math.PI/2);
    c.globalAlpha=reduced?.48:.67;
    const g=c.createLinearGradient(-s,-s,s,0);
    g.addColorStop(0,"rgba(255,243,205,.75)");
    g.addColorStop(.52,"rgba(83,204,234,.63)");
    g.addColorStop(1,"rgba(212,154,71,.84)");
    c.fillStyle=g;c.strokeStyle="rgba(252,221,154,.90)";c.lineWidth=.85;
    c.beginPath();c.moveTo(-s,-s*.25);
    c.quadraticCurveTo(-s*.73,-s*.85,0,-s*.82);
    c.quadraticCurveTo(s*.73,-s*.85,s,-s*.25);
    c.quadraticCurveTo(0,-s*.47,-s,-s*.25);
    c.closePath();c.fill();c.stroke();
    c.strokeStyle="rgba(151,229,242,.76)";c.lineWidth=.65;
    c.beginPath();c.moveTo(-s,-s*.25);c.lineTo(0,s*.38);
    c.moveTo(s,-s*.25);c.lineTo(0,s*.38);c.stroke();
    // Tiny cyan stabilizer instead of a large canopy and hanging capsule.
    c.fillStyle=color;c.globalAlpha*=.7;
    c.beginPath();c.arc(0,s*.38,Math.max(1,s*.1),0,TAU);c.fill();
    c.restore();
    return true;
  }
  satelliteOrigins({earth,W=360,H=780,time=0}) {
    if(!earth)return [];
    const {x,y,r}=earth;
    const points=[
      // Three pyramid satellites along Earth's bright horizon: left, front, right.
      {x:x-.72*r,y:y-.93*r},
      {x:x,y:y-.30*r},
      {x:x+.72*r,y:y-.93*r}
    ];
    return points.map((p,i)=>({
      x:Math.max(17,Math.min(W-17,p.x+(time?Math.sin(time*.95+i*2.3)*2.8:0))),
      y:Math.max(14,Math.min(H-17,p.y+(time?Math.cos(time*1.1+i*2.1)*3.4:0)))
    }));
  }
  satellites({earth,W=360,H=780,time=0,reduced=false}){
    const origins=this.satelliteOrigins({earth,W,H,time});
    if(!earth)return origins;
    const c=this.ctx;
    for(let i=0;i<origins.length;i++){
      const {x,y}=origins[i],scale=Math.max(.65,Math.min(1.25,earth.r/40));
      c.save();c.translate(x,y);c.rotate((i-1)*.20);c.scale(scale,scale);
      // Pyramid-shaped defence craft: gold facets, dark side, cyan energy.
      // Satellites are outside the Moon; the Moon texture stays geological.
      c.shadowColor="#69dfff";c.shadowBlur=reduced?2:8;
      c.fillStyle="rgba(41,210,249,.22)";
      c.beginPath();c.ellipse(0,11,19,6,0,0,TAU);c.fill();
      c.strokeStyle="#6ee7fc";c.lineWidth=2.4;
      c.beginPath();c.ellipse(0,11,17,4.3,0,0,TAU);c.stroke();
      c.shadowBlur=0;
      c.fillStyle="#edc27d";c.strokeStyle="#ffe9af";c.lineWidth=1.3;
      c.beginPath();c.moveTo(-16,7);c.lineTo(0,-17);c.lineTo(0,7);c.closePath();c.fill();c.stroke();
      c.fillStyle="#96643e";c.beginPath();
      c.moveTo(0,-17);c.lineTo(16,7);c.lineTo(0,7);c.closePath();c.fill();c.stroke();
      c.strokeStyle="rgba(255,236,179,.56)";c.lineWidth=.85;
      c.beginPath();c.moveTo(-11,-1);c.lineTo(11,-1);c.moveTo(-7,4);c.lineTo(7,4);c.stroke();
      c.fillStyle="#193559";c.fillRect(-6,8,12,3.5);
      const pulse=reduced?.5:.65+.35*Math.sin(time*5+i*2.4);
      c.shadowColor="#55d6ff";c.shadowBlur=reduced?0:9+11*pulse;
      c.fillStyle="#a1efff";c.beginPath();c.ellipse(0,12,4.6+1.8*pulse,2.4+1.5*pulse,0,0,TAU);c.fill();
      // Animated blue ion propulsion and a live navigational beacon.
      c.fillStyle="rgba(64,214,255,"+(.25+.38*pulse)+")";
      c.beginPath();c.moveTo(-3,14);c.lineTo(0,19+8*pulse);c.lineTo(3,14);c.closePath();c.fill();
      c.fillStyle="#fff7c9";c.shadowColor="#f9d781";
      c.shadowBlur=reduced?0:5+6*pulse;
      c.beginPath();c.arc(0,-10,1.4+.7*pulse,0,TAU);c.fill();
      c.restore();
    }
    return origins;
  }
  laserDrill({from,to,progress=0,reduced=false}){
    if(!from||!to)return;
    this.laser({from,to,life:.28+.7*progress,reduced});
    const c=this.ctx,r=11+8*progress;
    c.save();c.strokeStyle="#ffda84";c.shadowColor="#ffbb41";
    c.shadowBlur=reduced?2:14;c.lineWidth=2.5;
    c.beginPath();c.arc(to.x,to.y,r,-Math.PI/2,-Math.PI/2+TAU*progress);c.stroke();
    c.restore();
  }
  energy({cx,cy,inner,outer,flash,time=0}){
    const c=this.ctx;
    c.save();const a=.13+Math.max(0,flash)*.54;
    const g=c.createRadialGradient(cx,cy,inner,cx,cy,outer+30);
    g.addColorStop(0,"rgba(249,187,103,0)");
    g.addColorStop(.66,"rgba(231,178,95,"+(a*.26)+")");
    g.addColorStop(.92,"rgba(109,226,245,"+(a*.34)+")");
    g.addColorStop(1,"rgba(82,178,237,0)");
    c.fillStyle=g;c.beginPath();c.arc(cx,cy,outer+25,0,TAU);c.fill();
    c.globalAlpha=.37+flash*.40;
    c.shadowColor="#f6ca8d";c.shadowBlur=flash*23+4;
    c.lineWidth=flash>0?3.6:1.4;
    for(let k=0;k<4;k++){
      const th=time*.085+k*Math.PI/2;
      c.strokeStyle=k%2===0?"#dbb978":"#79dfea";
      c.beginPath();c.arc(cx,cy,outer+8,th,th+.22);c.stroke();
    }
    c.restore();
  }
}
root.PartouVisuals={Artist,shouldDeployCanopy};
if(typeof module!=="undefined"&&module.exports)module.exports={Artist,shouldDeployCanopy};
})(typeof globalThis!=="undefined"?globalThis:this);

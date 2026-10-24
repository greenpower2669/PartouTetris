(function(root){
"use strict";
// Block Boost inspired scenes; fully original, offline, no imported private FX.
const FIREWORKS_STEP=1000,FIREWORKS_DURATION=5600;
const COLORS=["#ffd578","#72e8ff","#ff9dd8","#acebbe","#c3b5ff","#fff2c1"];
function milestones(before,after,step=FIREWORKS_STEP){
 if(!Number.isSafeInteger(before)||!Number.isSafeInteger(after)||before<0||after<=before||!Number.isSafeInteger(step)||step<=0)return [];
 const start=Math.floor(before/step)+1,end=Math.floor(after/step);
 return end<start?[]:[start*step,end*step];
}
function chooseScene(event){
 if(!event)return null;
 if(event.type==="milestone")return {
   kind:"fireworks",priority:3,duration:FIREWORKS_DURATION,
   title:event.reached===event.upto?"🎆 "+event.reached.toLocaleString("fr-FR")+" POINTS !":"🎆 "+event.reached.toLocaleString("fr-FR")+" À "+event.upto.toLocaleString("fr-FR")+" POINTS !"
 };
 if(event.type==="bridge")return {
   kind:"bubbles",priority:1,duration:2400,
   title:event.geodesy>0?"🌉 PONT ROYAL · GÉODÉSIE !":"🌉 PONT DES PHARAONS !",
   subtitle:"+"+event.bonus.toLocaleString("fr-FR")+
     " BONUS · "+event.bridges+" pont"+(event.bridges>1?"s":"")
 };
 if(event.type==="ring"&&event.count>=2)return {
   kind:"disco",priority:2,duration:4100,
   title:"🪩 DOUBLE COURONNE !",subtitle:"+"+event.gained+" POINTS · COMBO ×"+event.combo
 };
 if(event.type==="ring")return {
   kind:"bubbles",priority:1,duration:2900,
   title:"🫧 COURONNE TERMINÉE !",subtitle:"+"+event.gained+" POINTS"
 };
 return null;
}
class Festival {
 constructor(element,{reduced=()=>false,bannerHost=null,gainHost=null}={}){
   this.root=element;this.reduced=reduced;this.bannerHost=bannerHost;this.gainHost=gainHost;
   this.scene=null;this.priority=0;this.timer=null;this.gainTimer=null;
   this.pos={cx:0,cy:0,outer:1,inner:0,stepR:1,earth:{x:0,y:0,r:1}};
   this.root.setAttribute("aria-hidden","true");
 }
 position(p){
   this.pos={...this.pos,...p};
   const {cx,cy,outer}=this.pos;
   this.root.style.setProperty("--fx-x",cx+"px");
   this.root.style.setProperty("--fx-y",cy+"px");
   this.root.style.setProperty("--fx-r",outer+"px");
   const e=this.pos.earth||{x:cx,y:cy,r:1};
   this.root.style.setProperty("--earth-x",e.x+"px");
   this.root.style.setProperty("--earth-y",e.y+"px");
   this.root.style.setProperty("--earth-r",e.r+"px");
 }
 stop(){
   if(this.timer)clearTimeout(this.timer);
   this.timer=null;this.scene=null;this.priority=0;this.root.replaceChildren();
   if(this.bannerHost)this.bannerHost.replaceChildren();
 }
 reset(){
   this.stop();
   if(this.gainTimer)clearTimeout(this.gainTimer);
   this.gainTimer=null;
   if(this.gainHost){this.gainHost.textContent="";this.gainHost.hidden=true;}
 }
 floatScore(event){
   // PT-014: gains are displayed ONLY within the existing scoreboard.
   // Never create flying text on top of a block, the Moon or a satellite.
   if(!this.gainHost)return;
   this.gainHost.classList?.remove("penalty");
   this.gainHost.textContent="GAIN +"+event.gained.toLocaleString("fr-FR")+
     (event.multiplier>1?" ×"+event.multiplier:"");
   this.gainHost.hidden=false;
   if(this.gainTimer)clearTimeout(this.gainTimer);
   this.gainTimer=setTimeout(()=>{this.gainHost.hidden=true;this.gainTimer=null;},1600);
 }
 particles(kind){
   if(this.reduced())return;
   const box=document.createElement("div");box.className="fx-burst fx-"+kind;
   const amount=kind==="fireworks"?25:kind==="disco"?26:18;
   for(let i=0;i<amount;i++){
     const spark=document.createElement("i");
     const {cx,cy,outer,earth}=this.pos;
     const e=earth||{x:cx,y:cy};
     const theta=i*2.399963;
     const dist=outer*(.25+.62*((i*17)%23)/22);
     spark.style.setProperty("--tx",(cx+Math.cos(theta)*dist-e.x).toFixed(1)+"px");
     spark.style.setProperty("--ty",(cy+Math.sin(theta)*dist-e.y).toFixed(1)+"px");
     spark.style.setProperty("--delay",(i*71%1300)+"ms");
     spark.style.setProperty("--color",COLORS[i%COLORS.length]);
     spark.style.setProperty("--size",(kind==="bubbles"?9+i%5*5:3+i%4*2)+"px");
     box.appendChild(spark);
   }
   if(kind==="disco"){
     const ball=document.createElement("div");ball.className="fx-mirrorball";
     const tiles=document.createElement("div");tiles.className="fx-mirror-tiles";
     ball.appendChild(tiles);box.appendChild(ball);
   }
   if(kind==="disco"||kind==="bubbles"||kind==="fireworks"){
     const {cx,cy,earth}=this.pos,e=earth||{x:cx,y:cy};
     const dx=cx-e.x,dy=cy-e.y;
     const beam=document.createElement("div");beam.className="fx-earth-beam";
     beam.style.setProperty("--beam-length",Math.hypot(dx,dy)+"px");
     beam.style.setProperty("--beam-angle",Math.atan2(-dx,dy)+"rad");
     box.appendChild(beam);
   }
   this.root.appendChild(box);
 }
 show(event){
   const scene=chooseScene(event);if(!scene)return;
   if(this.scene&&scene.priority<this.priority)return;
   this.stop();this.scene=scene.kind;this.priority=scene.priority;
   const banner=document.createElement("div");banner.className="fx-banner fx-banner-"+scene.kind;
   const title=document.createElement("strong");title.textContent=scene.title;banner.appendChild(title);
   if(scene.subtitle){const small=document.createElement("small");small.textContent=scene.subtitle;banner.appendChild(small);}
   // Overlay the high-score row INSIDE the HUD, never the circular board.
   if(this.bannerHost)this.bannerHost.appendChild(banner);
   this.particles(scene.kind);
   this.timer=setTimeout(()=>this.stop(),this.reduced()?1400:scene.duration);
 }
 handle(event){
   if(!event)return;
   if(event.type==="points"&&event.reason==="placement")this.floatScore(event);
   else if(event.type==="destroy"){
     if(this.gainHost){
       this.gainHost.textContent="MALUS −"+event.charged.toLocaleString("fr-FR")+
         " ×"+event.multiplier;
       this.gainHost.classList?.add("penalty");
       this.gainHost.hidden=false;
       if(this.gainTimer)clearTimeout(this.gainTimer);
       this.gainTimer=setTimeout(()=>{this.gainHost.hidden=true;this.gainTimer=null;},2100);
     }
   }
   else if(event.type==="ring"||event.type==="milestone"||event.type==="bridge")this.show(event);
 }
}
root.PartouFestival={Festival,chooseScene,milestones,FIREWORKS_STEP,FIREWORKS_DURATION};
if(typeof module!=="undefined"&&module.exports)module.exports={Festival,chooseScene,milestones,FIREWORKS_STEP,FIREWORKS_DURATION};
})(typeof globalThis!=="undefined"?globalThis:this);

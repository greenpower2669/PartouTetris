(function(root){
"use strict";
// PT-017. Pure Earth-to-Moon screen-space projection, keeping four gameplay
// lanes unchanged. Only the displayed position changes during SPACE_STEPS.
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
function projectEarthApproach({earth,cx,cy,outer,sector,lane,radial,rings=10,spaceSteps=5,stepFraction=0}){
 if(!earth||!Number.isFinite(radial))return null;
 const phase=clamp((rings+spaceSteps-radial+clamp(stepFraction,0,1))/spaceSteps,0,1);
 const a=-Math.PI/2+(sector+.5)*Math.PI*2/48;
 // Launch visibly from the Earth horizon; four separable source paths.
 const launch={x:earth.x+(lane-1.5)*earth.r*.24,y:earth.y-earth.r*.84};
 const endpoint={x:cx+Math.cos(a)*(outer+7),y:cy+Math.sin(a)*(outer+7)};
 const x=launch.x+(endpoint.x-launch.x)*phase;
 const y=launch.y+(endpoint.y-launch.y)*phase;
 return {x,y,progress:phase,scale:.48+.52*phase,launch,endpoint};
}
root.PartouArrival={projectEarthApproach};
if(typeof module!=="undefined"&&module.exports)module.exports={projectEarthApproach};
})(typeof globalThis!=="undefined"?globalThis:this);

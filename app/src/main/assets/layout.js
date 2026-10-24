(function(root){
  "use strict";
  function computePortraitLayout({width,height,headerBottom,controlsTop}) {
    const W=Math.max(1,Number(width)||1),H=Math.max(1,Number(height)||1);
    const top=Math.max(8,Math.min(H-20,Number(headerBottom)||0)+17);
    const lower=Math.max(top+30,Math.min(H-5,Number(controlsTop)||H)-12);
    const span=lower-top;
    // Preserve a small dedicated pocket *beneath* the Moon for Earth.
    // Earth is deliberately ~2x the former portrait size.
    const earthR=Math.max(13,Math.min(W*.105,42));
    // Margin for four extra, visible outer-space orbital lanes (not under HUD).
    const outer=Math.max(1,Math.min(W*.395,(span-(earthR*2+18))/2));
    const free=Math.max(0,span-2*outer);
    const lift=Math.min(earthR,free*.26);
    const cx=W*.5,cy=(top+lower)*.5-lift;
    // PT-013: a giant Earth on the lower horizon, independent of the lunar board.
    // Its radius adapts to short screens so the playfield is still visible.
    const globeR=Math.max(earthR,Math.min(W*.57,Math.max(35,Number(controlsTop)-cy-outer)+W*.19));
    const earth={x:W*.5,y:Math.min(H+W*.08,Number(controlsTop)+W*.10),r:globeR};
    const scale=outer/.98;
    const inner=scale*.34;
    return {cx,cy,scale,outer,inner,stepR:(outer-inner)/10,top,lower,earth};
  }
  root.PartouLayout={computePortraitLayout};
  if(typeof module!=="undefined"&&module.exports)module.exports={computePortraitLayout};
})(typeof globalThis!=="undefined"?globalThis:this);

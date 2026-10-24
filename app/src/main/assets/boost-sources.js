(function(root){
"use strict";
// PT-021: one intentional boost owner per physical control and an immutable
// target lane until that control releases, even if selection changes.
class BoostSources {
  constructor(apply,trace=()=>{}){
    this.apply=apply;this.trace=trace;this.sources=new Map();
  }
  has(source){return this.sources.has(source);}
  activeFor(lane){return [...this.sources.values()].some(v=>v===lane);}
  set(source,lane,enabled){
    if(typeof source!=="string"||!source)return false;
    const old=this.sources.get(source);
    if(enabled){
      if(!Number.isInteger(lane)||lane<0||lane>3)return false;
      if(old===lane)return false;
    }else if(old===undefined)return false;
    const affected=new Set();
    if(old!==undefined)affected.add(old);
    if(enabled)affected.add(lane);
    const before=new Map([...affected].map(l=>[l,this.activeFor(l)]));
    if(enabled)this.sources.set(source,lane);else this.sources.delete(source);
    for(const l of affected){
      const active=this.activeFor(l);
      if(before.get(l)!==active){
        this.apply(l,active);
        this.trace({source,lane:l,active});
      }
    }
    return true;
  }
  clear(){
    const lanes=new Set(this.sources.values());
    this.sources.clear();
    for(const lane of lanes){
      this.apply(lane,false);
      this.trace({source:"reset",lane,active:false});
    }
  }
}
root.PartouBoostSources={BoostSources};
if(typeof module!=="undefined"&&module.exports)module.exports={BoostSources};
})(typeof globalThis!=="undefined"?globalThis:this);

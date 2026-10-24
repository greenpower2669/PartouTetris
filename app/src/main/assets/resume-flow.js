(function(root){
"use strict";
// Pure PT-023 decision state: "Non" NEVER deletes a checkpoint.
// Only a second, explicit confirmation permits a fresh session.
class ResumeDecision{
  constructor(hasCheckpoint){this.phase=hasCheckpoint?"question":"none";}
  resume(){
    if(this.phase!=="question")return null;
    this.phase="done";return "resume";
  }
  reject(){
    if(this.phase!=="question")return null;
    this.phase="confirm";return "confirm";
  }
  back(){
    if(this.phase!=="confirm")return null;
    this.phase="question";return "question";
  }
  discard(){
    if(this.phase!=="confirm")return null;
    this.phase="done";return "new";
  }
}
const api={ResumeDecision};
root.PartouResumeFlow=api;
if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof globalThis!=="undefined"?globalThis:this);

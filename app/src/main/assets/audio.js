(function(root) {
  "use strict";
  // A completely original, offline, synthesized theme. No external downloads.
  const MELODY = [329.63, 349.23, 415.30, 440.00, 493.88, 523.25, 587.33];
  const PHRASE = [0,-1,2,3,4,-1,3,2,0,1,2,-1,4,3,2,1];
  class Soundtrack {
    constructor() {
      this.context=null;
      this.music=null;
      this.effects=null;
      this.enabled=true;
      this.musicVolume=0.33;
      this.effectsVolume=0.75;
      this.beat=0;
      this.nextBeat=0;
      this.lastCue=-1;
      this.lastLaserCue=-1;
      // PT-013: soundtrack from Fab, packaged locally with the app.
      // The synthesized theme remains a fallback and never overlaps the MP3.
      this.official=null;
      this.officialFailed=false;
      this.officialUrl="official-theme.mp3";
      this.supported=!!(root.Audio || root.AudioContext || root.webkitAudioContext);
    }
    start() {
      if(!this.supported)return false;
      // Create/play only after a trusted tap or button activation.
      if(root.Audio && !this.official && !this.officialFailed){
        try {
          const track=this.official=new root.Audio(this.officialUrl);
          track.loop=true;track.preload="auto";
          track.volume=this.enabled?this.musicVolume*.58:0;
          track.addEventListener("error",()=>{this.officialFailed=true;this.official=null;this.nextBeat=0;});
        } catch(e){this.officialFailed=true;this.official=null;}
      }
      if(this.official && this.enabled && this.official.paused){
        try{
          const pending=this.official.play();
          if(pending&&typeof pending.catch==="function")
            pending.catch(()=>{this.officialFailed=true;this.official=null;this.nextBeat=0;});
        }catch(e){this.officialFailed=true;this.official=null;}
      }
      if(!(root.AudioContext||root.webkitAudioContext))return !!this.official;
      try {
        if(!this.context) {
          const Context=root.AudioContext||root.webkitAudioContext;
          const ctx=this.context=new Context();
          const compressor=ctx.createDynamicsCompressor();
          compressor.threshold.value=-19;
          compressor.knee.value=15;
          compressor.ratio.value=3;
          compressor.attack.value=.008;
          compressor.release.value=.19;
          compressor.connect(ctx.destination);
          this.music=ctx.createGain();this.music.connect(compressor);
          this.effects=ctx.createGain();this.effects.connect(compressor);
          this.setVolumes(this.musicVolume,this.effectsVolume);
        }
        if(this.context.state!=="running") {
          this.context.resume().catch(()=>{});
          this.nextBeat=0;
        }
        return true;
      } catch(e) {this.supported=!!this.official;return !!this.official;}
    }
    setVolumes(music, effects) {
      this.musicVolume=Math.max(0,Math.min(1,Number(music)||0));
      this.effectsVolume=Math.max(0,Math.min(1,Number(effects)||0));
      if(this.official) this.official.volume=this.enabled?this.musicVolume*.58:0;
      if(this.context) {
        this.music.gain.setTargetAtTime(this.enabled?this.musicVolume:0,this.context.currentTime,.03);
        this.effects.gain.setTargetAtTime(this.enabled?this.effectsVolume:0,this.context.currentTime,.03);
      }
    }
    setEnabled(enabled) {
      this.enabled=!!enabled;
      this.setVolumes(this.musicVolume,this.effectsVolume);
      if(!this.enabled&&this.official)this.official.pause();
      if(this.enabled && this.context)this.nextBeat=0;
    }
    tone(freq,start,duration,peak,voice="triangle",bus=this.music,glide=null) {
      const c=this.context;
      if(!c||!bus||!this.enabled||c.state!=="running")return;
      const o=c.createOscillator(),g=c.createGain();
      o.type=voice;
      o.frequency.setValueAtTime(Math.max(30,freq),start);
      if(glide)o.frequency.exponentialRampToValueAtTime(Math.max(30,glide),start+duration*.8);
      g.gain.setValueAtTime(.0001,start);
      g.gain.exponentialRampToValueAtTime(Math.max(.0002,peak),start+.012);
      g.gain.exponentialRampToValueAtTime(.0001,start+duration);
      o.connect(g);g.connect(bus);
      o.start(start);o.stop(start+duration+.01);
    }
    noise(start,duration,peak,bus=this.music) {
      const c=this.context;
      if(!c||!bus||!this.enabled||c.state!=="running")return;
      if(!this.noiseBuffer){
        const length=Math.ceil(c.sampleRate*.12),b=c.createBuffer(1,length,c.sampleRate),data=b.getChannelData(0);
        let state=714345;
        for(let i=0;i<length;i++){state=(1664525*state+1013904223)>>>0;data[i]=((state>>>8)/16777216)*2-1;}
        this.noiseBuffer=b;
      }
      const source=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
      source.buffer=this.noiseBuffer;f.type="highpass";f.frequency.value=4200;
      g.gain.setValueAtTime(Math.max(.0001,peak),start);
      g.gain.exponentialRampToValueAtTime(.0001,start+Math.min(duration,.11));
      source.connect(f);f.connect(g);g.connect(bus);
      source.start(start);source.stop(start+Math.min(duration,.11));
    }
    rhythm(step,t) {
      if(step%4===0) this.tone(115,t,.17,.22,"sine",this.music,49);
      if(step%4===2)this.noise(t,.08,.10);
      if(step%2===0)this.noise(t,.035,.052);
      if(step%4===0)this.tone([82.41,123.47,130.81,123.47][Math.floor(step/4)],t,.34,.10,"triangle");
      const note=PHRASE[step];
      if(note>=0) {
        this.tone(MELODY[note],t,.19,.12,"triangle");
        if(step%4===0)this.tone(MELODY[note]*2,t,.12,.045,"sine");
      }
    }
    tick(paused=false,level=1) {
      const c=this.context;
      if(paused){
        if(this.official&&!this.official.paused)this.official.pause();
        this.nextBeat=0;return;
      }
      // Native MP3 loop has priority over the synthesized backing track.
      if(this.official&&!this.officialFailed)return;
      if(!c||!this.enabled||c.state!=="running")return;
      const quarter=60/(104+Math.min(level-1,12)*2);
      const half=quarter/2;
      const now=c.currentTime;
      if(this.nextBeat===0||this.nextBeat<now-.25)this.nextBeat=now+.025;
      for(let n=0;this.nextBeat<now+.16&&n<5;n++) {
        this.rhythm(this.beat%16,this.nextBeat);
        this.beat++;
        this.nextBeat+=half;
      }
    }
    cue(kind,count=1) {
      const c=this.context;
      if(!c||!this.enabled||c.state!=="running")return;
      const now=c.currentTime+.006;
      if(kind==="move"){
        if(now-this.lastCue<.085)return;
        this.lastCue=now;
        this.tone(335,now,.055,.05,"sine",this.effects,465);
      } else if(kind==="rotate") {
        this.tone(460,now,.095,.17,"triangle",this.effects,635);
      } else if(kind==="lock"){
        this.tone(160,now,.15,.24,"sine",this.effects,70);
        this.noise(now,.055,.07,this.effects);
      } else if(kind==="bridge"){
        // Short ascending arpeggio for a genuine two-bank connection.
        for(let i=0;i<3;i++)
          this.tone([392,587.33,783.99][i],now+i*.095,.16,.11,"triangle",this.effects);
      } else if(kind==="ring"){
        const notes=[523.25,659.25,783.99,1046.50,1318.5];
        for(let i=0;i<Math.min(5,3+count);i++)
          this.tone(notes[i],now+i*.07,.37,.23,"triangle",this.effects);
      } else if(kind==="milestone"){
        // Short original fanfare, without muting the background bed.
        const melody=[523.25,659.25,783.99,1046.50,783.99,1174.66,1318.50];
        for(let i=0;i<melody.length;i++){
          this.tone(melody[i],now+i*.19,.26,.16,"triangle",this.effects);
          if(i%2===0)this.tone(melody[i]/2,now+i*.19,.27,.048,"sine",this.effects);
        }
      } else if(kind==="laser"){
        // Three closely timed stages: emitter wake-up, plasma ignition,
        // beam travel and a short metallic impact; peak levels kept bounded.
        if(now-this.lastLaserCue<.16)return;
        this.lastLaserCue=now;
        this.tone(1270,now,.045,.044,"sine",this.effects,840);
        this.tone(360,now+.024,.14,.078,"sawtooth",this.effects,1010);
        this.tone(1720,now+.068,.14,.064,"sawtooth",this.effects,205);
        this.noise(now+.114,.055,.052,this.effects);
        this.tone(165,now+.13,.13,.12,"triangle",this.effects,81);
      } else if(kind==="destroy"){
        this.tone(560,now,.11,.13,"sawtooth",this.effects,128);
        this.noise(now+.04,.20,.10,this.effects);
        this.tone(130,now+.08,.23,.14,"triangle",this.effects,55);
      } else if(kind==="gameover"){
        for(let i=0;i<4;i++)this.tone(380*Math.pow(.81,i),now+i*.20,.30,.21,"sawtooth",this.effects);
      }
    }
  }
  root.PartouAudio={Soundtrack,MELODY,PHRASE};
  if(typeof module!=="undefined"&&module.exports)module.exports={Soundtrack,MELODY,PHRASE};
})(typeof globalThis!=="undefined"?globalThis:this);

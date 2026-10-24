const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const {Soundtrack,PHRASE,MELODY}=require('../app/src/main/assets/audio.js');
test('Melodic pattern includes note and rest, complete loop',()=>{
  assert.equal(PHRASE.length,16);assert.ok(PHRASE.includes(-1));
  assert.ok(MELODY.length>=7);
});
test('Audio initializes lazily and safely without WebAudio',()=>{
  const s=new Soundtrack();assert.equal(s.context,null);
  assert.equal(s.start(),false);s.tick(false);s.cue('lock');
});
test('Sound levels clamp and muting persists',()=>{
  const s=new Soundtrack();s.setVolumes(-1,9);
  assert.equal(s.musicVolume,0);assert.equal(s.effectsVolume,1);
  s.setEnabled(false);assert.equal(s.enabled,false);
});
test('Browser inline script parses',()=>{
  const html=fs.readFileSync('app/src/main/assets/index.html','utf8');
  const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
  assert.ok(scripts.length>0);
  for(const script of scripts)assert.doesNotThrow(()=>new vm.Script(script));
});

test('Repeated touch does not restart a playing melody',()=>{
  const old=globalThis.AudioContext;
  class MockContext {
    constructor(){this.state='running';this.currentTime=0;this.destination={};}
    createDynamicsCompressor(){
      return {threshold:{value:0},knee:{value:0},ratio:{value:0},attack:{value:0},release:{value:0},connect(){}};
    }
    createGain(){return {gain:{setTargetAtTime(){}},connect(){}};}
  }
  try{
    globalThis.AudioContext=MockContext;
    const s=new Soundtrack();
    assert.equal(s.start(),true);
    s.nextBeat=42;
    assert.equal(s.start(),true);
    assert.equal(s.nextBeat,42);
  }finally{if(old)globalThis.AudioContext=old;else delete globalThis.AudioContext;}
});

test('Milestone fanfare is safe without an audio context',()=>{
  const s=new Soundtrack();assert.doesNotThrow(()=>s.cue('milestone'));
});

test('Laser audio works safely when context is unavailable or muted',()=>{
 const s=new Soundtrack();
 assert.doesNotThrow(()=>s.cue('laser'));
 s.setEnabled(false);
 assert.doesNotThrow(()=>s.cue('laser'));
});

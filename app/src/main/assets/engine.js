(function (root) {
  "use strict";
  const SECTORS = 48, RINGS = 10, LANES = 4, SPACE_STEPS = 5, BOOST_MULTIPLIER=10, SPACE_INTERVAL_FACTOR=.82, MILESTONE_STEP = 1000, PLACEMENT_POINTS = 40;
  const LOCKED_LASER_HOLD_MS=1300, DESTRUCTION_BASE=80;
  const MAX_WAIT_SECONDS=8, RING_SPEED_FACTOR=.92, CONTINUITY_FACTOR=2, ROYAL_BRIDGE_FACTOR=2, GEODESY_FACTOR=35;
  // PT-034: score moderation applies to new gains only; never rescale saved records.
  const SCORE_PAYOUT_RATIO=.65, SPEED_BONUS_CAP=10;
  const FORMS = [
    [[-1,0],[0,0],[1,0],[2,0]],
    [[0,0],[1,0],[0,1],[1,1]],
    [[-1,0],[0,0],[1,0],[1,1]],
    [[-1,1],[-1,0],[0,0],[1,0]],
    [[-1,0],[0,0],[0,1],[1,1]],
    [[-1,1],[0,1],[0,0],[1,0]],
    [[-1,0],[0,0],[1,0],[0,1]]
  ];
  const COLORS = ["#67dcf1","#ffd567","#bca5ff","#ff9077"]; // legacy front accents
  const FORM_NAMES=Object.freeze(["I","O","L","J","Z","S","T"]);
  const TYPE_COLORS=Object.freeze(["#31dfff","#ffd34d","#ff9b36","#397bff","#ff5969","#46e58b","#bb83ff"]);
  const CHIRALITY=Object.freeze(["non chirale","non chirale","L (miroir J)","J (miroir L)","Z (miroir S)","S (miroir Z)","non chirale"]);
  const mod = (n, m) => ((n % m) + m) % m;
  function cellsOf(p, a=p.angle, r=p.radius, rot=p.rot) {
    const offsets = FORMS[p.type];
    return offsets.map(([x,y]) => {
      if (p.type !== 1) for (let k=0;k<rot;k++) [x,y] = [-y,x];
      return [mod(a+x, SECTORS), r+y];
    });
  }
  // Decompose a complete 360-degree row into maximal circular chains.
  // Unlike linear runs, sector 47 is adjacent to sector 0.
  function circularRuns(occupied) {
    if(occupied.every(Boolean))return [Array.from({length:SECTORS},(_,i)=>i)];
    const empty=occupied.findIndex(v=>!v),out=[];
    let group=[];
    for(let k=1;k<=SECTORS;k++){
      const sector=mod(empty+k,SECTORS);
      if(occupied[sector])group.push(sector);
      else if(group.length){out.push(group);group=[];}
    }
    return out;
  }
  class Game {
    constructor(rng=Math.random) { this.rng=rng; this.reset(); }
    reset() {
      this.baseFallSeconds=this.baseFallSeconds||MAX_WAIT_SECONDS;
      this.events=[];
      this.board = Array.from({length:RINGS},()=>Array(SECTORS).fill(-1));
      this.boardTypes=Array.from({length:RINGS},()=>Array(SECTORS).fill(-1));
      this.bag=[];this.spawnedTypes=Array(FORMS.length).fill(0);
      this.placedTypes=Array(FORMS.length).fill(0);
      this.score=0; this.cleared=0; this.level=1; this.seconds=0; this.placements=0;
      this.combo=0; this.flash=0; this.over=false; this.paused=false;
      this.pieces=Array(LANES).fill(null);
      this.fall=Array(LANES).fill(0);
      for(let i=0;i<LANES;i++) this.spawn(i);
    }
    setBaseFallSeconds(value) {
      if(!Number.isFinite(Number(value)))return this.baseFallSeconds;
      this.baseFallSeconds=Math.min(8,Math.max(2,Number(value)));
      return this.baseFallSeconds;
    }
    fallInterval() {
      // PT-024: time alone NEVER increases gravity. Each removed ring
      // advances speed by one permanent step. Manual speed stays possible.
      return Math.max(.8,this.baseFallSeconds*Math.pow(RING_SPEED_FACTOR,this.cleared));
    }
    speedMultiplier(){
      // Difficulty preview only. PT-030: never use the CURRENT slider state
      // as the payout of a piece already travelling.
      const relativeSpeed=MAX_WAIT_SECONDS/this.fallInterval();
      return Math.min(SPEED_BONUS_CAP,1+Math.pow(Math.max(0,relativeSpeed-1),2));
    }
    // Reference time for the same route if gravity remained at the original
    // eight-second difficulty. Includes the final blocked downward step,
    // so a high landing is compared to a high landing, not to a full descent.
    nominalFlightSeconds(p){
      if(!p||!Number.isInteger(p.radius)||p.radius<0||
         p.radius>RINGS+SPACE_STEPS)return 0;
      let weightedSteps=0;
      for(let r=RINGS+SPACE_STEPS;r>=p.radius;r--){
        weightedSteps+=r>=RINGS?SPACE_INTERVAL_FACTOR:1;
      }
      return MAX_WAIT_SECONDS*weightedSteps;
    }
    flightSpeedMultiplier(p){
      const birth=p?.spawnedAtSeconds;
      const duration=Number.isFinite(birth)?this.seconds-birth:NaN;
      // Old checkpoints carry no birth time. They retain their progress and
      // existing points, but the first resumed piece earns the safe ×1
      // rather than a guessed/instant jackpot.
      if(!Number.isFinite(birth)||birth<0||
         !Number.isFinite(duration)||duration<.05)return 1;
      const nominal=this.nominalFlightSeconds(p);
      if(!Number.isFinite(nominal)||nominal<=0)return 1;
      const relativeSpeed=nominal/duration;
      return Math.min(SPEED_BONUS_CAP,1+Math.pow(Math.max(0,relativeSpeed-1),2));
    }
    drainEvents(){return this.events.splice(0);}
    // PT-034: high bricks cost more, multiplied by the square of sustained
    // gravitational speed versus the initial 8 seconds/stage. Short ×10
    // touch boosts must never change this permanent-speed penalty.
    destructionPenalty(radius){
      if(!Number.isInteger(radius)||radius<0||radius>=RINGS)return 0;
      const speedRatio=MAX_WAIT_SECONDS/this.fallInterval();
      return Math.round(DESTRUCTION_BASE*(radius+1)*Math.ceil((radius+1)/2)*speedRatio*speedRatio);
    }
    destroyLockedCell(sector,radius){
      if(this.over||this.paused||!Number.isInteger(sector)||!Number.isInteger(radius)||
         sector<0||sector>=SECTORS||radius<0||radius>=RINGS||
         this.board[radius][sector]===-1)return null;
      const owner=this.board[radius][sector],penalty=this.destructionPenalty(radius);
      this.board[radius][sector]=-1;
      this.boardTypes[radius][sector]=-1;
      const charged=Math.min(this.score,penalty);
      this.score-=charged;
      const result={type:"destroy",sector,radius,owner,penalty,charged,
        multiplier:(radius+1)*Math.ceil((radius+1)/2),
        speedPenaltyMultiplier:Math.pow(MAX_WAIT_SECONDS/this.fallInterval(),2),total:this.score};
      this.events.push(result);
      return result;
    }
    award(points,reason,details={}) {
      if(!Number.isSafeInteger(points)||points<=0) return 0;
      const before=this.score;
      this.score+=points;
      this.events.push({type:'points',reason,gained:points,total:this.score,...details});
      const first=Math.floor(before/MILESTONE_STEP)+1;
      const last=Math.floor(this.score/MILESTONE_STEP);
      if(last>=first) {
        this.events.push({type:'milestone',reached:first*MILESTONE_STEP,upto:last*MILESTONE_STEP,total:this.score});
      }
      return points;
    }
    spawn(lane) {
      if(!this.bag.length)this.bag=FORMS.map((_,i)=>i);
      const i=Math.max(0,Math.min(this.bag.length-1,Math.floor(this.rng()*this.bag.length)));
      const type=this.bag.splice(i,1)[0];
      this.spawnedTypes[type]++;
      this.pieces[lane]={lane,type,angle:12*lane,radius:RINGS+SPACE_STEPS,
        rot:0,boost:false,ignitedUntil:0,spawnedAtSeconds:this.seconds};
      this.fall[lane]=0;
    }
    canPlace(p,angle=p.angle,radius=p.radius,rot=p.rot) {
      const cells=cellsOf(p,angle,radius,rot);
      for(const [a,r] of cells){
        if(r<0) return false;
        if(r>=RINGS) continue;
        if(this.board[r][a]!==-1) return false;
      }
      return true;
    }
    shift(lane,delta) {
      const p=this.pieces[lane];
      if(this.over||this.paused||!p) return false;
      // PT-017: the space phase is an approach corridor, not a playable
      // lateral lane. Rotation remains enabled there.
      if(p.radius>=RINGS)return false;
      const a=mod(p.angle+Math.sign(delta),SECTORS);
      if(!delta||!this.canPlace(p,a,p.radius,p.rot)) return false;
      p.angle=a; return true;
    }
    rotate(lane) {
      const p=this.pieces[lane];
      if(this.over||this.paused||!p) return false;
      if(p.type===1) return true;
      const rot=mod(p.rot+1,4);
      // A rotation in space must never secretly shift the locked direction.
      for(const kick of p.radius>=RINGS?[0]:[0,-1,1,-2,2]) {
        if(this.canPlace(p,mod(p.angle+kick,SECTORS),p.radius,rot)) {
          p.angle=mod(p.angle+kick,SECTORS); p.rot=rot; this.events.push({type:'rotate',lane}); return true;
        }
      }
      return false;
    }
    // A laser fired at the middle turns a piece, while a side hit also
    // nudges it tangentially AWAY from the impact. Solid blocks still win.
    laser(lane,impactSector) {
      const p=this.pieces[lane];
      if(this.over||this.paused||!p||!Number.isFinite(impactSector))return null;
      const rel=mod(impactSector-p.angle+SECTORS/2,SECTORS)-SECTORS/2;
      const nudge=Math.abs(rel)>.75?-Math.sign(rel):0;
      const moved=nudge?this.shift(lane,nudge):false;
      const rotated=this.rotate(lane);
      if(!rotated&&!moved)return null;
      const data={type:'laser',lane,angle:p.angle,radius:p.radius,moved,rotated,impactSector};
      this.events.push(data);
      return data;
    }
    ignite(lane){
      const piece=this.pieces[lane];
      if(this.over||this.paused||!piece||piece.radius>=RINGS)return false;
      // A laser burns the lunar parachute for four seconds of active play.
      // It is independent from touch boost and cannot affect later pieces.
      piece.ignitedUntil=Math.max(piece.ignitedUntil||0,this.seconds+4);
      this.events.push({type:"ignite",lane,radius:piece.radius,until:piece.ignitedUntil});
      return true;
    }
    boost(lane,value) {
      if(this.pieces[lane]) this.pieces[lane].boost=!!value;
    }
    ghost(p) {
      let radius=p.radius;
      while(this.canPlace(p,p.angle,radius-1,p.rot)) radius--;
      return radius;
    }
    // During descent, airborne pieces are non-solid. At touchdown they are
    // resolved in lane order, against committed material ONLY. If a piece is
    // now embedded in a block placed in the same frame, lift it outward to
    // the nearest legal supported resting layer; never overwrite board cells.
    landingRadius(p) {
      const legal = radius => {
        const cells=cellsOf(p,p.angle,radius,p.rot);
        return cells.every(([a,r])=>r>=0 && r<RINGS && this.board[r][a]===-1);
      };
      // Start at the present altitude. Going outward avoids teleportation
      // through the Moon and is needed only for simultaneous arrivals.
      for(let radius=p.radius;radius<=RINGS+2;radius++){
        if(legal(radius))return radius;
      }
      return null; // material has reached the orbital limit
    }
    // Only changed connections are rewarded: the squared lengths of each
    // newly touched circular chain MINUS the squared lengths it inherited.
    // This makes left/right extensions and bridging additive without
    // farming the same existing chain's previous score.
    placementContinuity(blocks) {
      const byRing=new Map();
      for(const [a,r] of blocks) {
        if(r<0||r>=RINGS)continue;
        if(!byRing.has(r))byRing.set(r,new Set());
        byRing.get(r).add(a);
      }
      let continuityUnits=0,continuityPoints=0,bridgePoints=0,geodesyPoints=0;
      let bridges=0,geodesy=0;
      const summaries=[];
      for(const [r,added] of byRing){
        const old=this.board[r].map(value=>value!==-1);
        const updated=old.slice();
        for(const a of added)updated[a]=true;
        const before=circularRuns(old),after=circularRuns(updated);
        const depth=RINGS-r;
        for(const chain of after){
          if(!chain.some(a=>added.has(a)))continue;
          const chainSet=new Set(chain);
          const oldComponents=before.filter(run=>run.some(a=>chainSet.has(a)));
          const oldSquares=oldComponents.reduce((sum,run)=>sum+run.length**2,0);
          const squareGain=chain.length**2-oldSquares;
          // Square gain is strictly positive whenever at least one new
          // cell extends a chain; old connected cells are never re-awarded.
          continuityUnits+=squareGain;
          continuityPoints+=squareGain*CONTINUITY_FACTOR*depth;
          let crossings=0;
          if(oldComponents.length>=2){
            bridges++;
            bridgePoints+=squareGain*ROYAL_BRIDGE_FACTOR*depth;
            for(const edge of [11,23,35,47]) {
              const other=mod(edge+1,SECTORS);
              if(chainSet.has(edge)&&chainSet.has(other)&&
                 !(old[edge]&&old[other])) {
                crossings++;
                geodesy++;
                geodesyPoints+=GEODESY_FACTOR*depth;
              }
            }
          }
          summaries.push({ring:r,length:chain.length,squareGain,depth,
            existingChains:oldComponents.length,crossings});
        }
      }
      return {continuityUnits,continuityPoints,bridgePoints,
        geodesyPoints,bridges,geodesy,chains:summaries};
    }
    // Four canonical minos are scored by their actual cell count, then by
    // depth: nearer the Moon yields more than an otherwise identical pose
    // high in orbit. Each new left/right continuation earns Δ(length²).
    placementReward(blocks,earnedFlightMultiplier=1) {
      const current=new Set(blocks.map(([a,r])=>r+":"+a));
      const neighbourCells=new Set();
      let radialSum=0;
      for(const [a,r] of blocks) {
        radialSum+=r;
        for(const [na,nr] of [[mod(a-1,SECTORS),r],[mod(a+1,SECTORS),r],[a,r-1],[a,r+1]]) {
          if(nr<0||nr>=RINGS)continue;
          const key=nr+":"+na;
          if(!current.has(key)&&this.board[nr][na]!==-1)neighbourCells.add(key);
        }
      }
      const contacts=neighbourCells.size;
      const meanRadius=radialSum/blocks.length;
      const centerBonus=Math.max(0,Math.round((RINGS-1-meanRadius)*12));
      const size=blocks.length,sizePoints=Math.round(PLACEMENT_POINTS*size/4);
      const base=sizePoints+centerBonus;
      const multiplier=Math.max(1,contacts);
      const chain=this.placementContinuity(blocks);
      const speedMultiplier=Number.isFinite(earnedFlightMultiplier)?
        Math.max(1,Math.min(SPEED_BONUS_CAP,earnedFlightMultiplier)):1;
      const rawPoints=base*multiplier+chain.continuityPoints+
        chain.bridgePoints+chain.geodesyPoints;
      return {points:Math.max(1,Math.round(rawPoints*speedMultiplier*SCORE_PAYOUT_RATIO)),
        base,size,sizePoints,centerBonus,contacts,multiplier,
        speedMultiplier:Math.round(speedMultiplier*1000)/1000,
        ...chain};
    }
    lock(lane,arrivals=null) {
      const p=this.pieces[lane];
      if(!p || this.over) return false;
      const radius=this.landingRadius(p);
      if(radius===null){
        this.over=true;this.events.push({type:'gameover',lane});return false;
      }
      const blocks=cellsOf(p,p.angle,radius,p.rot);
      const earnedFlightMultiplier=this.flightSpeedMultiplier(p);
      const flightSeconds=Number.isFinite(p.spawnedAtSeconds)?
        Math.max(0,this.seconds-p.spawnedAtSeconds):null;
      const reward=this.placementReward(blocks,earnedFlightMultiplier); // BEFORE committing
      for(const [a,r] of blocks){
        this.board[r][a]=lane;
        this.boardTypes[r][a]=p.type;
      }
      this.placements++;
      this.placedTypes[p.type]++;
      this.events.push({
        type:'lock',lane,angle:p.angle,radius,rotation:p.rot,
        pieceType:p.type,form:FORM_NAMES[p.type],chirality:CHIRALITY[p.type],
        color:TYPE_COLORS[p.type],placement:this.placements,
        placedCounts:this.placedTypes.slice(),spawnCounts:this.spawnedTypes.slice()
      });
      this.award(reward.points,'placement',{lane,angle:p.angle,radius,
        ...reward,flightSeconds,
        nominalSeconds:this.nominalFlightSeconds(p),
        speedSource:"measured-flight"});
      if(reward.bridges>0)this.events.push({type:'bridge',lane,
        bridges:reward.bridges,geodesy:reward.geodesy,
        bonus:Math.round((reward.bridgePoints+reward.geodesyPoints)*reward.speedMultiplier*SCORE_PAYOUT_RATIO),
        chains:reward.chains});
      if(Array.isArray(arrivals))arrivals.push(earnedFlightMultiplier);
      this.pieces[lane]=null;
      this.spawn(lane);
      return true;
    }
    clearRings(earnedFlightMultiplier=1) {
      let n=0;
      for(let r=0;r<RINGS;r++) {
        if(this.board[r].every(x=>x>=0)){
          this.board.splice(r,1);
          this.board.push(Array(SECTORS).fill(-1));
          this.boardTypes.splice(r,1);
          this.boardTypes.push(Array(SECTORS).fill(-1));
          n++; r--;
        }
      }
      if(n){
        this.combo++;
        this.cleared+=n;
        this.level=1+this.cleared; // exactly one step per cleared ring
        // The crown triggered by this landing cannot use the newly selected
        // slider speed, nor the gravity that changes AFTER the crown clears.
        const speedMultiplier=Number.isFinite(earnedFlightMultiplier)?
          Math.max(1,Math.min(SPEED_BONUS_CAP,earnedFlightMultiplier)):1;
        const gained=Math.round((480*n*n*this.level+
          100*Math.max(0,this.combo-1))*speedMultiplier*SCORE_PAYOUT_RATIO);
        this.flash=1;
        this.events.push({type:'ring',count:n,gained,combo:this.combo,
          level:this.level,fallInterval:this.fallInterval(),speedMultiplier});
        this.award(gained,'ring',{count:n,combo:this.combo,speedMultiplier});
      }else this.combo=0;
      return n;
    }
    step(dtSeconds) {
      if(this.over||this.paused) return;
      const dt=Math.min(Math.max(dtSeconds,0),0.12);
      this.seconds+=dt;
      this.level=1+this.cleared; // passage of time is NOT a difficulty trigger
      const interval=this.fallInterval();
      let didLock=false;
      const landedMultipliers=[];
      for(let lane=0;lane<LANES;lane++) {
        let p=this.pieces[lane];
        if(!p)continue;
        this.fall[lane]+=dt*Math.max(p.boost?BOOST_MULTIPLIER:1,
          (p.ignitedUntil||0)>this.seconds?3:1);
        // A longer Earth-to-Moon approach (5 stages at 82% of the interval).
        // A bounded while loop makes ×10 exact, even at high levels / 60fps.
        for(let moves=0;moves<8;moves++){
          p=this.pieces[lane];
          const laneInterval=p.radius>=RINGS?interval*SPACE_INTERVAL_FACTOR:interval;
          if(this.fall[lane]<laneInterval)break;
          this.fall[lane]-=laneInterval;
          if(this.canPlace(p,p.angle,p.radius-1,p.rot))p.radius--;
          else{
            didLock=this.lock(lane,landedMultipliers)||didLock;
            // Never accelerate the freshly spawned replacement this frame.
            break;
          }
          if(this.over)break;
        }
        if(this.over)break;
      }
      if(didLock&&!this.over){
        // If several pieces land in the same frame, use the conservative
        // earned factor rather than the highest one as the crown trigger.
        const earned=landedMultipliers.length?Math.min(...landedMultipliers):1;
        this.clearRings(earned);
      }
      this.flash=Math.max(0,this.flash-dt*1.2);
    }
  }
  const api={Game,SECTORS,RINGS,LANES,SPACE_STEPS,BOOST_MULTIPLIER,SPACE_INTERVAL_FACTOR,LOCKED_LASER_HOLD_MS,DESTRUCTION_BASE,MILESTONE_STEP,PLACEMENT_POINTS,MAX_WAIT_SECONDS,RING_SPEED_FACTOR,SCORE_PAYOUT_RATIO,SPEED_BONUS_CAP,FORMS,COLORS,FORM_NAMES,TYPE_COLORS,CHIRALITY,cellsOf,mod};
  root.PartouEngine=api;
  if(typeof module!=="undefined"&&module.exports) module.exports=api;
})(typeof globalThis!=="undefined"?globalThis:this);

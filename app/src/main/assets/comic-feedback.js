(function(root){
"use strict";
// PT-041 — one shared, non-interactive comic narrator for every score mutation.
// This layer NEVER awards points; it only reads finalized engine events.
const BANKS=Object.freeze({
  earth:[
    "Astéroïde intercepté !","Interception réussie !","Débris neutralisé !",
    "Défense terrestre !","Cible pulvérisée !","Menace stoppée net !",
    "Tir décisif !","Mission accomplie !","Impact évité !",
    "Menace écartée !","Cible abattue !","Feu croisé victorieux !",
    "Astéroïde stoppé !","Bouclier terrestre activé !","Interception parfaite !",
    "Débris réduit en poussière !","Sauvetage orbital !",
    "Cible anéantie !","L'espace est sécurisé !","La Terre est protégée !",
    "Défense synchronisée !","Trois lasers, une victoire !"
  ],
  placement:[
    "Pose réussie !","Placement impeccable !","Assemblage réussi !",
    "Beau placement !","Briques en place !","Précision lunaire !",
    "Bien joué, Pharaonite !","Trajectoire maîtrisée !",
    "Pièce stabilisée !","Un coup bien placé !","Pose millimétrée !",
    "Architecture renforcée !","Quatre blocs à la bonne place !",
    "Mission lunaire accomplie !","Placement validé !",
    "Joli coup !","La structure avance !","Belle construction !"
  ],
  ring:[
    "Couronne achevée !","Tour complet !","Cercle parfait !",
    "Couronne balayée !","Anneau effacé !","Révolution accomplie !",
    "360 degrés maîtrisés !","Victoire circulaire !",
    "La couronne s'illumine !","Tour de force !",
    "Couronne pharaonique !","Ronde lunaire réussie !",
    "Anneau intégral !","La Lune rayonne !","Couronne pulvérisée !"
  ],
  bridge:[
    "Pont royal !","Connexion établie !","Les fronts se rejoignent !",
    "Architecture connectée !","Pont des Pharaons !",
    "Liaison parfaite !","Chaîne continue !","Géodésie maîtrisée !",
    "Assemblage magistral !","Trait d'union lunaire !"
  ],
  malus:[
    "Destruction coûteuse !","Mauvais tir !","Casse pénalisante !",
    "Malus de destruction !","Erreur coûteuse !","Brique sacrifiée !",
    "Intervention risquée !","Coût du laser !","Attention aux dégâts !",
    "Casse sanctionnée !","Impact pénalisant !",
    "Oups, des points en moins !","Pénalité appliquée !",
    "Le tir se paie !","Dégâts collatéraux !",
    "Coup mal calculé !","La facture tombe !"
  ],
  milestone:[
    "Cap franchi !","Record de puissance !","Nouveau palier !",
    "Score en orbite !","La légende grandit !","Pharaonite en feu !",
    "Exploit débloqué !","Un cap historique !","Magnifique progression !"
  ],
  gain:[
    "Points gagnés !","Prime encaissée !","Score renforcé !",
    "Récompense obtenue !","Bonus confirmé !","Points à bord !",
    "Crédit lunaire !","Belle récolte !"
  ],
  speed:[
    "Vitesse en action !","Accélération récompensée !",
    "Bonus de rapidité !","L'élan fait la différence !",
    "Trajectoire express !","Cadence gagnante !",
    "Poussée gagnante !","Élan orbital !","Vitesse payante !"
  ],
  meteor:[
    "Pluie de météores !","Alerte sur la Terre !",
    "Débris en approche !","Menaces multiples !",
    "Bombardement orbital !","Défense planétaire !",
    "Vague de blocs !","Alerte Pharaonites !",
    "Ciel incandescent !","Déluge spatial !",
    "Les satellites en position !","Tempête de débris !"
  ]
});
const HEADINGS={
 earth:["BONUS !","INTERCEPTION !","DÉFENSE !","BRAVO !","TIR GAGNANT !"],
 placement:["BIEN JOUÉ !","POSE !","GAIN !","JOLI COUP !"],
 ring:["COURONNE !","360° !","EXPLOIT !","TOUR COMPLET !"],
 bridge:["PONT ROYAL !","LIAISON !","COMBO !"],
 malus:["MALUS !","OUPS !","PÉNALITÉ !","ATTENTION !"],
 milestone:["PALIER !","EXPLOIT !","WAOUH !"],
 gain:["BONUS !","POINTS !","GAGNÉ !"],
 speed:["VITESSE !","TURBO !","ACCÉLÉRATION !"],
 meteor:["ALERTE !","MENACES !","TEMPÊTE !","DÉFENSE !"]
};
function categoryFor(ev){
 if(!ev)return null;
 if(ev.type==="info"&&ev.reason==="meteor-shower")return "meteor";
 if(ev.type==="destroy")return "malus";
 if(ev.type!=="points"||!(ev.gained>0))return null;
 if(ev.reason==="earth-defense")return "earth";
 if(ev.reason==="ring")return "ring";
 if(ev.reason==="placement")return ev.bridges>0?"bridge":"placement";
 if(ev.reason==="milestone")return "milestone";
 return "gain";
}
function speedPercent(event){
 const multiplier=event.reason==="earth-defense"?
   Number(event.speedSquare):Number(event.speedMultiplier);
 if(!Number.isFinite(multiplier)||multiplier<=1.005)return 0;
 return Math.min(2400,Math.max(0,Math.round((multiplier-1)*100)));
}
function speedStages(percent){
 const total=Math.max(0,Math.min(2400,Math.round(Number(percent)||0)));
 if(!total)return [];
 const count=Math.floor(total/40),remainder=total%40;
 // Display only three of potentially 22 incremental chunks, then an
 // unambiguous total; avoids covering the playfield with dozens of badges.
 const stages=Array(Math.min(count,3)).fill("+40 %");
 if(count>3){
   stages.push("+"+total+" % TOTAL");
 }else if(remainder){
   stages.push("+"+remainder+" %");
 }
 return stages;
}
class PhraseDeck {
 constructor(rng=Math.random){this.rng=rng;this.recent=new Map();}
 pick(category,head=false){
   const choices=head?HEADINGS[category]:BANKS[category];
   if(!choices||!choices.length)return "";
   const key=(head?"heading-":"phrase-")+category;
   const prev=this.recent.get(key)||[];
   const available=choices.map((value,index)=>index).filter(i=>!prev.includes(i));
   const values=available.length?available:choices.map((_,i)=>i);
   const r=Number(this.rng());
   const index=values[Math.min(values.length-1,Math.max(0,Math.floor((Number.isFinite(r)?r:0)*values.length)))];
   this.recent.set(key,[...prev.slice(-1),index]);
   return choices[index];
 }
}
function comicModel(event,deck){
 const category=categoryFor(event);
 if(!category)return null;
 const info=category==="meteor";
 const value=info?0:category==="malus"?(event.charged||0):event.gained;
 const percent=info||category==="malus"?0:speedPercent(event);
 return {
   category,heading:deck.pick(category,true),phrase:deck.pick(category),
   score:info?"DÉFENSE TERRE":(category==="malus"?"−":"+")+
     value.toLocaleString("fr-FR")+" pts",
   speed:percent,stages:speedStages(percent),
   // Displayed score is always the ACTUAL awarded/charged amount.
   gain:value,
   // PT-042: importance is part of the message model, not guessed from
   // decorative text. Big points and all alert/wow events have jagged edges.
   priority:["earth","ring","malus","bridge","milestone","meteor"].includes(category)||
     event.combo>=2||value>=1500?2:1,
   frame:["earth","ring","malus","bridge","milestone","meteor"].includes(category)||
     event.combo>=2||value>=1500?"burst":"smooth"
 };
}
class ComicFeedback {
 constructor(host,{rng=Math.random,reduced=()=>false}={}){
   this.host=host;this.deck=new PhraseDeck(rng);this.reduced=reduced;
   this.queue=[];this.current=null;this.startedAt=0;this.shown=[];
   if(this.host){this.host.hidden=true;this.host.setAttribute("aria-live","polite");}
 }
 reset(){
   this.queue=[];this.current=null;this.startedAt=0;
   if(this.host){this.host.replaceChildren();this.host.hidden=true;}
 }
 enqueue(event){
   const model=comicModel(event,this.deck);if(!model)return null;
   // Bound the backlog: keep all rare impactful events and newest routine
   // score updates; never let a long combo leave minutes of stale bubbles.
   if(this.queue.length>=5){
     const ordinary=this.queue.findIndex(item=>item.priority===1);
     this.queue.splice(ordinary>=0?ordinary:0,1);
   }
   // Meteor showers are rare and must not wait behind routine placement
   // messages; queue the alert at the front without interrupting a reader.
   if(model.category==="meteor")this.queue.unshift(model);
   else this.queue.push(model);
   return model;
 }
 paint(model){
   if(!this.host)return;
   const card=document.createElement("div");
   card.className="comic-card comic-"+model.category+" comic-"+model.frame;
   const head=document.createElement("strong");
   head.className="comic-heading";head.textContent=model.heading;
   const phrase=document.createElement("span");
   phrase.className="comic-phrase";phrase.textContent=model.phrase;
   const amount=document.createElement("b");
   amount.className="comic-amount";amount.textContent=model.score;
   card.append(head,phrase,amount);
   if(model.stages.length){
     const wrapper=document.createElement("div");
     wrapper.className="comic-stages";
     const small=document.createElement("span");
     small.className="comic-speed-title";small.textContent="BONUS VITESSE";
     wrapper.append(small);
     for(const [i,part]of model.stages.entries()){
       const tag=document.createElement("em");
       tag.className="comic-stage";tag.textContent=part;
       tag.style.setProperty("--stage-index",i);
       wrapper.append(tag);
     }
     card.append(wrapper);
   }
   if(this.reduced())card.classList.add("comic-still");
   this.host.replaceChildren(card);
   this.host.hidden=false;
 }
 update(now,paused=false){
   if(!Number.isFinite(now)||!this.host)return;
   this.host.classList.toggle("comic-paused",paused);
   if(paused)return;
   if(this.current&&now-this.startedAt>this.duration(this.current)){
     this.current=null;
     this.host.replaceChildren();this.host.hidden=true;
   }
   if(!this.current&&this.queue.length){
     this.current=this.queue.shift();this.startedAt=now;
     this.shown.push(this.current.category);
     this.paint(this.current);
   }
 }
 duration(model){return this.reduced()?1.2:Math.min(2.5,1.68+.19*model.stages.length);}
}
root.PartouComic={BANKS,HEADINGS,PhraseDeck,categoryFor,speedPercent,
  speedStages,comicModel,ComicFeedback};
if(typeof module!=="undefined"&&module.exports)
 module.exports=root.PartouComic;
})(typeof globalThis!=="undefined"?globalThis:this);

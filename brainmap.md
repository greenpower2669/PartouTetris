# Carte technique — PartouTetris
- `app/src/main/assets/engine.js` : logique indépendante du rendu, Game, pièces actives, mouvements, gravité, collision, ghost, suppression des anneaux, score et fin.
- `app/src/main/assets/index.html` : Canvas polaire, vue lunaire/pyramides, parachutes stylisés, contrôles Pointer Events, HUD et record local.
- `app/src/main/java/com/greenpower2669/partouteris/MainActivity.java` : Android WebView locale, plein écran immersif, portrait, conservation d'écran actif.
- `app/src/main/res/drawable/icon.xml` : icône vectorielle.
- `app/build.gradle`, `settings.gradle`, `build.gradle` : application Android SDK 35.
- `tests/engine.test.cjs` : tests de logique via Node.
- `.github/workflows/android-debug.yml` : exécute tests, build et copie APK brute dans `temp/` de la branche de travail.
- `ordres-de-mission.md` : missions explicites ; `todo.md` : étapes de livraison ; `debughistorical.md` : diagnostics.

- `app/src/main/assets/audio.js` : synthèse musicale offline via WebAudio avec pattern 16 temps, sons de rotation/déplacement/verrouillage/couronne/défaite, activation après geste utilisateur.
- `engine.js` : `baseFallSeconds`, `setBaseFallSeconds`, `fallInterval`, `events`, `drainEvents` pour découpler l'audio de la simulation.
- `index.html` : écran de lancement sonore, réglage vitesse 2–8 s, volumes de musique/FX, mute, préférences localStorage.
- `tests/audio.test.cjs` : pattern sonore, sécurité sans WebAudio et analyse syntaxique des scripts inline.

- `app/src/main/assets/touch.js` : contrôleur logique indépendant des Pointer Events ; un contact primaire exclusif (grip), touches secondaires courtes = rotations du même lane, seuil de déplacement et durée, remise à zéro à la pause/perte de focus.
- `app/src/main/assets/index.html` : adapte les Pointer Events à TwoHandControls, pointage et halo de prise ; `tests/touch.test.cjs` : tests d'interactions à deux mains (tap gauche, drag droite, faux gestes, relâchement, changement de front).

- PT-005 : `engine.js` `canPlace()` ignore les autres blocs actifs ; `landingRadius()` corrige un chevauchement éventuel uniquement au verrouillage. `tests/engine.test.cjs` vérifie les croisements en vol, le raccord angulaire et les atterrissages synchronisés.
- PT-006 : `app/src/main/assets/visuals.js` est le moteur visuel procédural Canvas 2D ; `index.html` lui délègue le fond, la Lune, les cellules, les parachutes, les impulsions énergétiques. Rendu hors ligne.

- PT-007 : `app/src/main/assets/layout.js` calcule un plateau portrait borné entre HUD et dock bas. `index.html` intègre emblème SVG des trois pyramides à côté du titre, commandes en grille 2 lignes ; `visuals.js` conserve une Lune à cratères sans pyramides. `AndroidManifest.xml` et `MainActivity.java` forcent le mode portrait. `tests/portrait.test.cjs` garantit orientation et espacements portrait.

- PT-008 : engine.js award et événements points/ring/milestone ; celebrations.js gère float +40, bulles/disco/feux ; index.html ajoute scoreBurst transparent, mode doux et score lisible ; audio.js fanfare originale. Tests celebrations.test.cjs, engine.test.cjs et audio.test.cjs.

- NOM : PartouTetris (dépôt greenpower2669/PartouTetris) ; garder ancien package Android interne com.greenpower2669.partouteris.
- PT-009 `engine.js` -> placementReward() contacts polaires distincts, rayon moyen, xN ; `touch.js` -> tick(), 420ms deuxième doigt, boosts combinés ; `layout.js` -> Terre agrandie réservée, `visuals.js` -> Terre plus belle, `celebrations.js` + `index.html` -> origine terrestre des particules/faisceaux.
- Tests PT-009 `tests/engine.test.cjs`, `tests/touch.test.cjs`, `tests/portrait.test.cjs`, `tests/celebrations.test.cjs`.

- PT-010 : `app/src/main/assets/leaderboard.js` localStorage pseudo/records (ancienne clé record conservée), top 10 persisté, top 3 affiché, assainissement des noms ; `tests/leaderboard.test.cjs`.
- PT-010 : `index.html` HUD score sur largeur, podium sous score, pointFeed bas, formulaire pseudo, bouton de mode LASER, visée de pièce et tir rendu en Canvas ; `engine.js` `laser()` pour impact réorientant avec vérifications de collision ; `visuals.js` `incoming()` flammes et `laser()` faisceau Terre-pièce ; `audio.js` effet laser, `celebrations.js` points flottants en bas.

- PT-011 : icône utilisateur : `app/src/main/res/drawable-nodpi/icon.webp` Android et `app/src/main/assets/brand-icon.webp` titre, depuis l'image originale fournie par Fab ; l'ancien `drawable/icon.xml` ne doit plus être utilisé. `engine.js` SPACE_STEPS=4 pour l'approche spatiale ; `visuals.js` cellules lumineuses hors anneaux, flame trails uniquement avant la Lune, zero parachute, `satelliteOrigins` et `satellites` pour 3 émetteurs. `index.html` trois rayons convergents vers une cible et emblème officiel. `tests/visuals.test.cjs` et `tests/engine.test.cjs` testent rendu et phase.

- PT-012 (0.1.9) : `visuals.js` `shouldDeployCanopy(radial,RINGS)` borne strictement les voiles à la zone de grille ; `Artist.canopy()` voile légère cyan/or (petit gabarit, câble fin, transparent) ; `Artist.satellites()` coque pyramidale à facettes dorées, anneau moteur cyan, toujours 3 émetteurs. `index.html` appelle canopy pour les seules pièces actives r<10 et conserve les flammes hors de la Lune. Tests dans `tests/visuals.test.cjs` et `tests/portrait.test.cjs`.

- PT-013 / 0.2.0 : `design/charte-officielle.png` = référence PNG originale de Fab (hors rendu temps réel), `app/src/main/assets/official-theme.mp3` = piste officielle locale reprise depuis le blob `main` sans réencodage.
- `audio.js` = HTMLAudioElement (loop, activation geste, pause/mute, volumes) avec fallback musical WebAudio exclusif et FX laser synthétique multi-phase.
- `visuals.js` = nébuleuses, anneaux cyan/or, tracé de charge des 3 satellites, faisceaux/impacts Canvas. `index.html` = thème HUD doré, tutoriel tactile corrigé, synchronisation de charge et laser. `tests/pt013.test.cjs` = intégrité de l'import et séparation graphique/audio.

- PT-013 : `layout.js` réserve une Terre basse à fort diamètre ; `Artist.makeEarthTexture()` précalcule le globe hors écran, `satelliteOrigins` déploie les trois satellites sur l'horizon. `index.html` centre le logo or et dispose cinq boutons sur une rangée, LASER supplémentaire. `design/charte-apercu.jpg` = source; `design/rendu-jeu-apercu.jpg` = instantané CI optionnel.

- PT-014 : `index.html` héberge désormais `#pointFeed` et `#scoreAnnouncement` **dans `#hud .scoreboard`**, sans flottement Canvas. `Festival` dans `celebrations.js` reçoit `bannerHost` et `gainHost` ; petit gain temporaire géré par `floatScore`, scène temporaire par `show/stop` et réinitialisation par `reset`. `#scoreBurst` ne garde que les particules décoratives passantes. `tests/celebrations.test.cjs` couvre confinement, simultanéité et nettoyage. Aucune modification des clés de sauvegarde.

- PT-015 : `leaderboard.js` DEFAULT_NICKNAME « Tous3nKamion », migration conditionnelle `raw.name === "PHARAON"`; clés `KEY`/`PREVIOUS_RECORD` et `scores` inchangées. `index.html` label Pharaonite, pseudo au HUD et placeholder ; `tests/leaderboard.test.cjs` vérifie migration sans pertes.

- PT-016 : `app/src/main/assets/hud-pt016.css` = couche CSS premium (formes, lumières, tétriminos, mini-lune, cadre, score et record sans image). `index.html` conserve la marque texte HTML et installe le O lunaire via `mountMoonWordmark()` ; nouveau nœud `#bestScoreValue` alimenté à chaque frame par `Math.max(record, leaderboard.best())`. `tests/pt016-branding.test.cjs` vérifie la séparation données/rendu et les quatre objets décoratifs. Version 0.2.3.

- PT-017 : `engine.js` BOOST_MULTIPLIER=10, SPACE_STEPS=5, SPACE_INTERVAL_FACTOR=.82, `step` traite plusieurs rangs/frame puis sort lors du verrouillage ; `shift` bloqué tant que radius>=RINGS et `rotate` sans wall-kick dans l'espace.
- `arrival.js` exporte `projectEarthApproach` (projection Terre → entrée front, interpolation 0..1), chargée par `index.html`; `visuals.js` `Artist.spacePiece` dessine cellules et flammes pendant phase extra-lunaire, avant de passer au Canvas polaire dans les couronnes. Tests `arrival.test.cjs` et engine.

- PT-018 : `engine.js` : `destructionPenalty(r)`, `destroyLockedCell(sector,r)` événement destroy et LOCKED_LASER_HOLD_MS=1300. `visuals.js` : `makeCloudBand`, `cyclones`, `satelliteOrigins(time)`, pulsations / `laserDrill`. `index.html` : `lockedLaserCell`, laserTarget, suivi pointeur/cancel, projection des débris volants depuis Terre, draw laser charge. `celebrations.js` : malus dans gainHost haut sans masquer jeu. `audio.js` : son destroy distinct. Tests engine/visuals/celebrations.

- PT-019 : `laser-aim.js` offre `findLocked` pour cases fixées avec tolérance de visée. `index.html` maintient `laserTarget` au relâchement, affiche `laserFocusHud` pendant 1,3 s et annule sur pause ou changement de mode ; tests `laser-aim.test.cjs`.

- PT-020 : `engine.js` expose FORM_NAMES, TYPE_COLORS, CHIRALITY et un sac global de 7 ; le tableau `boardTypes` garde le type des pièces verrouillées en parallèle à `board`, notamment lors de la suppression d'anneau et du laser. `index.html` choisit les couleurs par type, journalise chaque pose dans la console ; `MainActivity.java` transfère `[PT020][POSE]` dans Android Logcat `PartouChirality`. Tests : `tests/pt020-chirality.test.cjs`.

- PT-021 : `touch.js` supprime l'ancienne commande de boost cachée `g.inward` déclenchée par −17px de rayon. `boost-sources.js` coordonne séparément `touch`, `button` et `keyboard`, retient le front de départ et combine leurs durées sans laisser de boost bloqué. `index.html` connecte ces sources, relâche sur pause/blur et console `[PT021][BOOST]`. `MainActivity.java` redirige vers Logcat tag `PartouTouch`. Tests `tests/touch.test.cjs`, `tests/pt021-boost.test.cjs`.

- PT-022 : `app/src/main/assets/session.js` KEY `partouteris-session-v1`, capture/valid/read/restore/save/clear, contrôles stricts avant restauration, copie profonde, aucun `boost` restauré. `index.html` installe `brand-pyramid` comme A, conserve O lunaire, présente choix Reprendre/Nouvelle partie, sauvegarde via boucle de jeu 850ms, pause, visibilitychange, pagehide et beforeunload ; `window.partouFlushSession` appelé dans `MainActivity.onPause()`. `hud-pt016.css` contient pyramide CSS ; tests `pt022-session.test.cjs`, build #39760329152.

- PT-023 : `app/src/main/assets/resume-flow.js` fournit `ResumeDecision` (question → confirm → new, avec retour possible ; question → resume). `index.html` : `#resumePopup`, `#resumeConfirm` affichés seulement au chargement avec `savedSession`; `session.restore` seulement après OUI, `session.clear` uniquement après deuxième confirmation. Hall de dix places via `renderHallOfFame()` et `leaderboard.top(10)`, `#hallOfFame` accessible depuis `#hallFromSettings` et `#hallFromEnd` ; `hud-pt016.css` rend les dialogues lisibles. Tests `pt023-startup.test.cjs` et contrat `pt022-session.test.cjs`. Version 0.2.10.

- PT-024 : moteur engine.js circularRuns() et placementContinuity() (gains différentiels sur chaînes 48 secteurs avec boucle 47↔0), placementReward() (taille, profondeur, contacts, carré du différentiel vitesse, pont, géodésie), speedMultiplier() et clearRings() accélération uniquement par couronne. startPlay(true) règle le max 8s dans index.html, HUD indique couronnes et temps réel par étage. Festival chooseScene bridge dans celebrations.js, audio.js cue bridge. Logs Android PartouScore. session.js restaure anciens niveaux via cleared (ancien format v1 conservé). Tests pt024-strategy.test.cjs et engine.test.cjs. CI #39938398035.

- PT-025 : leaderboard.js stocke historique local sous partoutetris-score-history-v1 et préserve le Top10 legacy ; global-hall.js stocke une outbox et un cache du classement mondial, dédoublonne les pages par runId ; index.html propose Local / Mondial / historique et enregistre à gameover une partie unique. PartouHallApiBridge.java assure POST/GET HTTPS asynchrones à origine fixe, MainActivity.java ajoute JS interface pour les seuls assets fiables, manifest INTERNET. Tests : pt025-hall.test.cjs. Endpoint serveur PartouTetris non confirmé.

- PT-034 (24/10) : `engine.js` multiplie le coût du laser PT-018 par (8 / fallInterval())² ; nouvelle attribution de poses/couronnes ×0,65 et bonus vitesse mesuré plafonné ×10 au lieu de ×100. `tests/pt034-scoring-balance.test.cjs` vérifie vitesse permanente, boost provisoire, plafonnement et non-recalcul des scores sauvegardés. Branche `feature/lunar-four-fronts-score-balance-034` issue de PT-032 ; PT-033 visuel reste distinct et non codé.

- PT-035 (24/10) : `app/src/main/assets/tangent-landing-guide.js` affiche **uniquement un repère visuel** tangent court au centre `ghostMoonGuide.anchor`, avec liens transparents vers `projectedLanding(piece)` et le doigt. Intégration dans `index.html` après `ghostMoonGuide.render()`, derrière les pièces ; aucune modification de `touch.js`, `tangent-control.js` ou du score PT-034. Tests : `tests/pt035-local-tangent.test.cjs`. Branche `feature/lunar-four-fronts-tangent-035`, debug 0.2.21.

- PT-033 (24/10, implémenté après PT-035) : `index.html` supprime les cercles occultants sur sélection et projection et met en lumière les minos réels + minos de pose par halos modulés, en respectant « effets visuels doux ». `tests/pt033-selection-glow.test.cjs`. Branche `feature/lunar-four-fronts-glow-033`, APK cible 0.2.22 ; PT-035 et PT-034 conservés.

- PT-039 (24/10) : `earth-events.js` expose `EarthEvents` et `defenseBonus` (objet cosmétique indépendant près de Terre, 7 silhouettes, hasard satellite/explosion, clic LASER utilisateur rémunéré à vitesse durable²), intégré depuis `index.html` ; `joystick-guide.css` compacte l'aide inférieure en préservant le joystick. Tests `tests/pt039-earth-events.test.cjs`, branche `feature/lunar-four-fronts-earth-events-039`, cible debug 0.2.26. `main` intacte.

- PT-040 (24/10) : `app/src/main/assets/earth-events.js` `trailParticles(now,{reduced,speedRatio})` retire la tige rigide derrière l'objet PT-039 et dessine des points incandescents suivant les positions passées, indépendantes de la rotation, blanc-jaune-orange, dissipation et léger flou ; `index.html` passe le facteur vitesse permanente. Tests `tests/pt040-particle-tail.test.cjs`. Branche `feature/lunar-four-fronts-particle-tail-040`, cible APK 0.2.27. Aucun merge main.

- PT-041 (24/10) : branche `feature/lunar-four-fronts-comic-feedback-041`, base PT-040. `earth-events.js` sépare verrouillage joueur (`earth-locked`, `pending`) et impact + score différés de 320 ms temps de jeu ; durant la phase, **3 faisceaux réels** convergent des 3 satellites. `index.html` attribue alors le bonus Terre exactement une fois. `comic-feedback.js` / `comic-feedback.css` : banque française variée anti-répétition, popups BD pour `points` / `destroy` et phases +40 % représentant uniquement la vraie composante vitesse. Tests `tests/pt041-comic-volley.test.cjs`; APK v0.2.28 ; pas de merge `main`.

- PT-042 (24/10) : branche `feature/lunar-four-fronts-bottom-comics-042` issue de PT-041, sans merge main. `#comicFeed` (index.html) a déménagé **à l'intérieur de `#controlDeck`**, `comic-feedback.css` l'ancre `bottom:calc(100% + 8px)`, semi-transparent et non interactif ; `comic-feedback.js` ajoute `frame: 'smooth'|'burst'` selon importance (alerte/malus/couronne/interception/ponte/1500+), séparé de la banque de phrases. Tests `tests/pt042-bottom-comics.test.cjs`. Cible APK 0.2.29.

- PT-043 (25/10) : `comic-feedback.css` recentre le cartouche BD bas au-dessus des commandes (`left:50%`) et ajoute un très bref zoom à ×1,10 / ×1,24, fond bleu/rouge davantage translucide. `comic-feedback.js` ajoute les alertes de pluie météoritique avec banque de mots anti-répétition, sans points fictifs. `earth-shower.js` (nouveau) supervise 3–6 `EarthEvents` autonomes vers la Terre, rarement (45–90 s entre pluies), visuels réutilisés PT-040 et interceptions automatiques ou manuelles (tri-laser PT-041, récompense vitesse² une fois). Câblage `index.html`; tests `tests/pt043-comics-shower.test.cjs`; branche `feature/lunar-four-fronts-comic-meteor-shower-043`, APK cible 0.2.30, sans merge main.

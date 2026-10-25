# Débogage — PartouTetris
## PT-001, 20/10/2026
- Dépôt neuf, seuls README et LICENSE présents lors de l'audit.
- Problèmes à vérifier en conditions réelles : maniabilité sur écran tactile Android, collisions au raccord 0°/360°, simultanéité de plusieurs contacts, comportement de WebView Android 16, performance Canvas et signature APK debug.
- Vérifications initiales : tests purs du moteur (sans Android) exécutés pendant le développement.
- CI initiale : `android-actions/setup-android@v3` a échoué sur `sdkmanager tools` (package obsolète). Contournement initial par appel direct `sdkmanager` ensuite en échec, commande absente du PATH.
- Correctif vérifié : localisation de `sdkmanager` dans `$ANDROID_HOME/cmdline-tools/` du runner, puis installation SDK 35.
- Preuve : run GitHub Actions #39504100261 **success**, avec tests Node, compilation Android, upload artifact et copie directe APK dans `temp/`.
- Reste non testé : installation et contrôles réels sur Android 16 / SM-A576B.

## PT-003 — Retour téléphone, 21/10/2026
- Symptôme confirmé par Fab : quatre descentes trop rapides ; aucun son et ambiance peu vivante.
- Cause de vitesse dans la 0.1.0 : intervalle initial codé à 0,82 seconde par case radiale, avec quatre fronts simultanés : trop peu de temps de décision.
- Correction de code 0.1.1 : intervalle initial 5,0 secondes (réglable 2–8 s), palier de progression tempéré, FX et musique WebAudio originaux.
- Risque à tester : WebAudio nécessite un geste Android ; activé par écran de démarrage explicite. Performance et volumes réels à vérifier.

- CI premier essai 0.1.1 : 14 tests / 15, échec d'un ancien test qui attendait une chute après seulement 1,08 s. Contrat modifié : 5 s/étage ; test corrigé pour vérifier l'absence de chute à 1,08 s et une chute après 5 s. Ce n'était pas une panne moteur.

- Correction complémentaire : un toucher ne doit pas remettre l'horloge musicale à zéro ; test mock WebAudio ajouté.
- CI finale 0.1.1 #39509803472 : tests Node et build Android réussis, fichier `temp/PartouTetris-v0.1.1-debug.apk` confirmé (20 206 octets). Un build intermédiaire a échoué uniquement lors du push de l'APK à cause de builds parallèles ; le dernier a réussi.
- Audio réel sur téléphone toujours **à valider**, pas de conclusion tirée du simple build.

## PT-004 — Retour ergonomique, 21/10/2026
- Observation : le geste de rotation sur un tap du doigt principal obligeait à lâcher le contrôle. Fab préfère attraper/déplacer de la droite tout en tapotant de la gauche pour pivoter.
- Changement : `touch.js` garde le doigt primaire responsable de la prise et donne aux taps rapides d'un autre doigt la seule commande de rotation. Un contact secondaire ne sélectionne plus un autre front. Les gestes secondaires glissés, longs ou annulés ne pivotent pas ; si la prise se termine avant le tap, celui-ci est annulé.
- À vérifier sur téléphone : double tactile WebView Samsung, sensibilité des 26 px / 360 ms, possibilité de manipuler les quatre cadrans sur écran paysage.

- Vérification livraison PT-004 : GitHub Actions #39513900116 réussie, compilation Android et tests Node verts ; `temp/PartouTetris-v0.1.2-debug.apk` confirmée (21 283 octets). Essai humain non encore effectué.

## PT-005/PT-006 — 21/10/2026
- Bug rapporté par Fab : les pièces sous parachute se bloquent mutuellement **en l'air** ; cause confirmée par lecture : `canPlace()` comparait chaque case aux quatre pièces actives, ce qui gelait leur descente.
- Correctif : `canPlace()` ignore les pièces aériennes et consulte seulement les blocs définitivement posés ; `landingRadius()` résout les arrivées concurrentes avant écriture sur le plateau et ne permet plus d'écrasement.
- Visuel : rendu Canvas initial trop minimal (petite Lune, arcs unis, parachute filaire) ; remplacé par art procédural hors ligne, cratères/pyramides ombrés, cellules réfléchissantes et HUD métallique.
- Tests CI et performances/ergonomie Android réelles restent à vérifier.

- Preuve technique PT-005/PT-006 : GitHub Actions #39517259972 réussie (tests Node, compilation Android, copie Git du fichier). APK `temp/PartouTetris-v0.1.3-debug.apk` vérifiée, 25 278 octets. Les rendus sur appareil ne sont pas encore observés.

## PT-007 — Capture paysage 0.1.3 (21/10/2026)
- Problème constaté sur la capture fournie : plateau immense en paysage, fond du cercle caché sous les cinq boutons horizontaux ; pyramides posées sur la Lune alors que Fab les veut près du titre.
- Résolution : portrait Android forcé, mise en page HUD/cercle/commandes en trois zones avec bornes calculées depuis les rectangles DOM. Pyramides en icône SVG près du titre, cratères lunaires laissés libres.
- Risques à confirmer sur Samsung : taille réelle des boutons, zones tactiles et disponibilité de l'espace pour les quatre voiles en portrait.

- CI PT-007 : run #39518335994 **success**, tests Node, build Android et publication APK brute de 26 736 octets dans `temp/PartouTetris-v0.1.4-debug.apk`. Aucune fusion `main` ; capture réelle du mode portrait en attente.

## PT-008 — Récompenses (21 octobre 2026)
- Lacune 0.1.4 : aucun score au placement ; célébrations trop rares.
- Correctif : points calculés uniquement à la pose solide (+40), combo de couronnes réelles, palier 1000 détecté une seule fois même en cas de jackpot.
- Scènes inspirées de Block Boost, mais synthèse graphique/sonore autonome ; pas de fichiers audio privés.
- Animation limitée, option douce, pas de stroboscope et overlay pointer-events:none. Tests et rendu réel sur Samsung à confirmer.

- Livraison 0.1.5 vérifiée : GitHub Actions #39521425766 success (tests et Gradle), fichier brut temp/PartouTetris-v0.1.5-debug.apk : 31 036 octets. Aucune fusion main ; démonstration visuelle et audio réelle à vérifier sur téléphone.

## PT-009 — 21 octobre 2026
- Renommage confirmé du dépôt PartouTeris vers **PartouTetris**, avec correction du titre, de l'APK et de la documentation. Package Android com.greenpower2669.partouteris non modifié pour maintenir l'installation/sauvegarde.
- Nouvelle règle score : proximité du centre + contacts avec cases verrouillées préexistantes (distinctes), 2 → ×2, 3 → ×3 ; aucun bonus artificiel pour cellules nouvelles ni Lune elle-même.
- Tactile : tap secondaire < 360ms tourne ; appui secondaire stable ≥420ms accélère et n'entraîne pas de rotation ; test d'annulation au relâchement.
- Visuel : Terre plus grande dans espace sous Lune, particules / faisceau sortant de la Terre, non interceptant, préférence effets doux conservée.
- Tests et compilation 0.1.6 à contrôler avant d'annoncer une APK.

- CI et sortie finales : GitHub Actions #39573299164 success (tests Node, Android, dépôt APK directe). Fichier temp/PartouTetris-v0.1.6-debug.apk 33 060 octets. Correctif supplémentaire : 6 coordonnées aux appels Bézier de la Terre pour éviter une exception Canvas au rendu. main non fusionnée ; vérification sur téléphone encore nécessaire.

## PT-010 — Score, leaderboard, pseudo et lasers (21/10/2026)
- Observation : manque de hiérarchie du score en tête et petits gains de points couvrant les pièces au lieu de s'afficher en bas.
- Modifications : affichage score plein bandeau, podium top 3 local, pseudo paramétrable et sauvegardé, migration du record individuel historique ; aucun service externe.
- Débris en flammes : nouvel effet procédural limité à la phase haute de chute ; aucune collision ni vitesse modifiée.
- Lasers : sélection de la cible proche seulement lorsque mode laser activé ; rotation 90° et poussée d'un secteur en cas de visée latérale, respect strict des blocs verrouillés ; son et faisceau Canvas depuis la Terre ; cooldown 420 ms.
- Tests intégration, performances et gestes Android réels nécessaires avant validation finale.

- Preuve livraison PT-010 : GitHub Actions #39578438005 **success**, tests Node, compilation Android, dépôt APK directe (37 691 octets) sous temp/PartouTetris-v0.1.7-debug.apk. main inchangée. Ergonomie du podium, pseudo, lasers et flammes à confirmer sur téléphone.

## PT-011 — Corrections conceptuelles (21/10/2026)
- Écart avec demande : la précédente réponse a généré une nouvelle illustration au lieu de coder. Fab réclame un **APK de jeu corrigé**, et sa propre icône doit servir à l'application.
- Cause : `spawn` à RINGS+1, cellules dessinées seulement sur r<10, parachute toujours rendu, laser depuis l'objet Terre unique.
- Correction : apparition à RINGS+4, cellules rendues jusqu'à r<16 avec compression de l'espace, traînée de flammes en phase spatiale ; parachute entièrement retiré, 3 satellites terrestres affichés et 3 rayons par tir, visée et scoring conservés.
- Lune sans pyramides (elles figurent dans l'icône et près du titre seulement). Tests et rendu téléphone à valider.

- PT-011 CI finale : première tentative échouée à cause d'une ancienne assertion `radial<4.5` non mise à jour vers `radial<9` ; corrigée. Deuxième passage détection d'une variation lors de la transcription binaire WebP optimisée ; l'icône a été corrigée en confrontant les blocs encodés à l'original et SHA Git exact `e0eedc703359d7e27be9501b0f3c67bec1186229`. Test d'empreinte ajouté et vert.
- **Build final réussi GitHub Actions #39591033182** : tests Node, compilation Gradle, APK directe `temp/PartouTetris-v0.1.8-debug.apk` vérifiée à 47 265 octets. `main` non fusionnée. Essai tactile/visuel Samsung encore à faire.

## PT-012 — Nouvelle convention parachutes après phase spatiale (21 octobre 2026)
- Précision de Fab : le retrait total des parachutes (PT-011) était trop radical. Ils doivent revenir **uniquement dans la zone lunaire**, en taille plus discrète.
- Ancien test « No parachutes » est remplacé par tests sur la règle r<10 ; logique des collisions inchangée. Petite voile cyan/or à fils discrets, sans capsule massive.
- Les satellites rectangulaires du prototype ne représentaient pas suffisamment les deux dernières références : remplacés par **pyramides-satellites dorées**, anneaux de propulsion cyan. Orbits fines ajoutées autour de la Terre ; aucun objet pyramidal ajouté à la Lune.
- À valider : cohérence visuelle sur petit écran Samsung Android 16, non-obstruction des blocs, phonophobie/contrastes ; CI et APK en attente.

- PT-012 : validation technique GitHub Actions #39594087561 **success** (tests Node, Android Gradle, artifact et push de l'APK directe). Fichier `temp/PartouTetris-v0.1.9-debug.apk` présent, 48 461 octets. `main` non fusionnée ; ressenti esthétique et commandes sur Samsung à valider.

## PT-013 — Première intégration officielle 0.2.0 (21/10/2026)
- Image PNG (2,6 Mio) et musique MP3 (8,7 Mio) déjà déposées sur `main`. Le canal de consultation du contenu binaire n'a pas permis de visualiser le PNG ni d'écouter le MP3 directement. Import fiable par référence de leurs blobs SHA Git exacts dans la branche de travail ; aucun réupload, aucune modification de `main`.
- Référence graphique non directement visible pendant cette session : fidélité fine non vérifiée visuellement. Conservé comme source entière sans l'utiliser comme image plaquée sur le Canvas. Interface et cadrans améliorés par code indépendant ; comparaison avec Fab indispensable.
- Audio : HTMLAudioElement local en boucle après un geste, fallback WebAudio seulement en cas de fichier/lecture indisponible ; joindre une lecture réelle sur Samsung pour contrôler latence, gap à la boucle et niveau de fond.
- Sons Djipie : index consultés, nombreuses sources privées, droits unitaires/identité de provenance insuffisamment vérifiés ; aucun son préexistant copié en public. Laser synthétique construit en couches, non assimilé abusivement à des prises sonores réalistes certifiées.
- Statut CI 0.2.0 et install Android : **à vérifier** avant de confirmer une APK finale.

- PT-013 : une miniature GitHub CI a permis d'examiner la charte authentique : Terre occupante massive, titre or centré et cinq commandes sur une rangée. La refonte Terre/horizon correspondante a passé CI #39627108353 ; le rendu écran reste à comparer et valider sur Android.

- PT-013 capture headless Chromium 412x915 obtenue, `design/rendu-jeu-apercu.jpg` : deux écarts avérés malgré CI verte : scoreboard étroit à cause du max-width de `#hud .scoreboard` et LASER flottant recouvrant partiellement consignes. Correctifs : scoreboard forcé width/max-width 100%, bouton LASER intégré au panneau d'aide avec pointer-events réactivés uniquement pour lui. Nouveau contrôle sur image CI requis.

- CI b4ee2e6 (#39628428178) : une unique assertion du nouveau test PT-013 a échoué : l'expression régulière du test utilisait `\\s` au lieu de `\s`, sans échec de compilation ni bogue runtime prouvé. Correctif du test par séparation DOM textuelle plutôt que regex échappée ; build à revalider. L'APK 0.2.0 précédent reste disponible.

## PT-013 — Résultat final CI provisoire (21/10/2026)
- **Exécution #39628651992 = success** : 0.2.0 construite, APK brute 8 782 536 octets dans `temp/`. SHA Git `01e56c4ae65ca8fd0f5ea7be2b98d22aeb07c997`.
- Vrai snapshot Chromium `design/rendu-jeu-apercu.jpg` : score de nouveau plein format et LASER intégré au panneau d'aide, sans chevauchement. Comparaison avec la charte PNG : style or/cyan, Terre large, Lune et trois satellites reconnaissables ; photo-réalisme du modèle et densité des décors encore inférieurs à l'illustration. Ne pas marquer fidélité 1:1 achevée.
- **Différence vérifiable :** CI garantit syntaxe, tests moteur et compilation ; elle ne garantit ni qualité audio perceptive, ni performance/gestes réels sur SM-A576B. Pas de sons privés Djipie embarqués sans autorisation documentaire.

## PT-014 — Annonces masquant le plateau (21/10/2026)
- Preuve : capture réelle Fab 0.2.0, score 20 319, niveau 5 ; la bannière « 20 000 POINTS ! » traverse le centre lunaire et « GAIN +484 ×4 » chevauche le bas des anneaux.
- Cause isolée dans le code : `Festival.show` ajoutait `.fx-banner` à `#scoreBurst` qui définissait `left:var(--fx-x)` et `top:var(--fx-y)` au centre du jeu ; `Festival.floatScore` créait des nodes sous le plateau ; `index.html` positionnait `#pointFeed` à proximité du bord lunaire.
- Solution : bannière dans un hôte absolu *interne* au scoreboard, gain court sur sa ligne de titre, timers bornés et nettoyage ; aucun changement de géométrie du moteur ni du comportement des sons. Vérification CI/capture requise.

- **PT-014, preuve finale :** Actions #39644183018 **success** après mise à jour de l'ancienne assertion PT-010 devenue obsolète ; APK 0.2.1 brute vérifiée 8 783 364 octets. La nouvelle capture Chromium confirme le HUD au repos ; pas de capture d'événement réel au palier 20 000, donc test tactile visuel humain ouvert. La musique officielle conserve `HTMLAudioElement.loop=true` et doit être écoutée jusqu'à son raccord pour confirmer l'absence de blanc audible.

## PT-015 — Pseudo et titre de classement (21/10/2026)
- Fab précise qu'il ne demande pas une nouvelle récompense en jeu mais le **libellé du meilleur score de Pharaonite** et un **pseudo par défaut Tous3nKamion** (Toutânkhamon).
- Ancien défaut `PHARAON` dans `cleanName`, constructeur, fallback et placeholder. Correction des textes ; `partoutetris-leaderboard-v1`/`partouteris-record` et scores historiques conservés. L'ancien défaut exact est migré à la lecture. Une ancienne valeur personnalisée exactement « PHARAON » n'est pas distinguable du défaut d'origine.

- **PT-015 CI finale :** #39647494324 success, APK directe v0.2.2 présente sur branche (8 783 572 octets). Capture Chromium portrait vérifiée : libellé complet, pseudo exact sans obstruction du jeu. Tests de conservation des scores et de migration de l'ancien défaut exécutés en CI. Installation réelle Android à valider.

## PT-016 — Changement de spécification confirmé (21/10/2026)
- La demande « Notre bannière est triste, tu peux faire comme celle-là ? » concerne le **HUD intégré dans le logiciel**, et non une image générée. Fab corrige explicitement « Non, en code ^^ » après proposition d'image.
- Solution : composition CSS sans asset externe `hud-pt016.css`, vraie typographie dorée et tranches de néon, quatre tétriminos construits chacun de quatre carrés HTML, mini-Lune CSS dans le O à l'exécution, score, pseudo et meilleur score reliés aux données.
- Préserver impérativement l'espace de plateau par layout mesuré DOM et éviter tout modèle statique impossible à actualiser.

- PT-016 CI #39654253505 success mais capture Chrome révèle un bug de rendu : la marque est écrasée à hauteur quasi nulle. Cause CSS : ancien `flex:1 1 66%` en contexte colonne, alors que tous les enfants de la marque sont désormais absolus => taille intrinsèque zéro ; `height` ne fixe pas la base flexible. Correctif `flex:0 0 auto` et min-height adaptatif. Nouvelle capture nécessaire avant livraison.

## PT-016 — Livraison en CODE, CI et examen visuel (21/10/2026)
- Correction du bandeau finale v0.2.3 : HTML/CSS/JS sans image plaquée, score et record dynamiques, titre gold PART🌕UTETRIS et quatre tétriminos CSS.
- Premier rendu CI #39654253505 : succès technique mais bandeau masqué par effondrement Flex (tous enfants absolus) ; correctif `flex:0 0 auto` CI #39654800396 succès, visuel visible ; taille titre et score augmentée.
- Run final **#39655192888 success**, screenshot `design/rendu-jeu-apercu.jpg` inspecté : titre or lisible, mini-lune, tétriminos lumineux, scoreboard intact ; plateau et commandes restent exposés.
- `temp/PartouTetris-v0.2.3-debug.apk` brute 8 787 418 octets (Git blob SHA `d634edadaa9f9f46661b44b1c3838f69255055bd`). Confirmation tactile Android réelle et fidélité esthétique finale à recueillir auprès de Fab.

## PT-017 — Descente et distance de la phase spatiale (21/10/2026)
- Diagnostic : `Game.step()` cumulait `dt*(boost?5:1)` et ne consommait **qu'un** intervalle/frame, donc la descente freinait artificiellement malgré un appui long.
- Correction : `BOOST_MULTIPLIER=10`, consommation répétée (cap 8 pour éviter les cycles infinis et ne pas booster le nouveau bloc spawn). Deuxième doigt toujours 420 ms/tap bref inchangé ; nouveau libellé CHUTE ×10.
- Phase espace : 4→5 marches, multiplicateur intervalle .72→.82, `shift` refusé (y compris après laser), `rotate` sans kick angulaire.
- Affichage : pièce extra-lunaire dessinée avec projection de Terre vers la porte polaire (art.spacePiece) ; aucun changement des collisions, ni de la sauvegarde. CI et visionnage Android à valider.

### PT-017 — Retour du CI et analyse visuelle
- Deux CI intermédiaires ont échoué sur d'**anciennes assertions de test** devenues invalides (déplacement autorisé dès le départ dans l'espace, ancienne initialisation artificielle du niveau). Tests corrigés en indiquant explicitement la phase lunaire et en ajustant le chronomètre. Aucun rollback du comportement demandé.
- Exécution finale **#39682743622 success** : Node + Android Gradle + APK 0.2.4 non compressée. Capture `design/rendu-jeu-apercu.jpg` confirme les quatre petites pièces distinctes au départ de la Terre, contrairement à l'ancienne apparition radiale tout autour du cercle.
- La trajectoire est une **projection graphique depuis la Terre vers les quatre points d'entrée**, tandis que `p.radius` est la seule altitude de collision/gravité. Cela assure la stabilité logique et les quatre fronts, mais l'impression de perspective reste à juger sur le Samsung.

## PT-018 — Diagnostics du tir laser maintenu
- Règle Fab : satellites plus vivants, Terre animée, nuages blancs transparents et cyclones, destruction coûteuse des briques fixées au laser long. Implémentation hors-ligne et purement graphique pour météo (pas de données météo réelles).
- Risque de régression : laser bref sur pièce mobile = déjà rotation, et gestes à deux doigts ; séparation du laser par mode et hit-test des **cases fixées** uniquement. Maintien unique 1300 ms et tolérance 23 px ; arrêt sur sortie de mode, pause, annulation, relâchement et perte de focus.
- Formule prototype : 80 × (r+1) × ceil((r+1)/2), facturation bornée au score existant, affichage MALUS théorique dans scoreboard, records intacts. Cases vides, limites polaires et partie arrêtée refusées.
- Concurrence CI : publication automatique antérieure APK 0.2.4 sur la branche pendant les commits. Toutes les écritures suivantes utilisent le SHA de tête actualisé. CI 0.2.5 encore à confirmer.

- **PT-018 rendu final :** CI #39687843781 réussie après correction doublon sonore et défilement continu de la rotation planétaire. APK 0.2.5 brute 8 791 813 octets vérifiée ; capture statique Chromium montre au moins un cyclone et les trois satellites, mais ne remplace pas un essai animé/tactile. Un run intermédiaire a échoué uniquement sur l'étape de publication Git après une mise à jour concurrente, tests + Gradle y avaient réussi ; le run final s'est publié avec succès.

## PT-019 : Ciblage laser trop précis sur Android
Une brique occupe une surface très étroite dans les 48 secteurs. En version 0.2.5, le pointeur devait rester appuyé, sans bouger, pendant 1300 ms ; un relâchement interrompait le focus. Version 0.2.6 : visée magnétique, focus conservé après levée du doigt, progression visible en haut de l'écran. Run #39689590579 réussi, test réel Samsung à effectuer.

## PT-020 — Chiralités, couleurs et séries de tirages (22/10/2026)
- Cause confirmée : les couleurs étaient codées par front (`COLORS[p.lane]`) et les cellules verrouillées ne mémorisaient que ce front. Le tirage était indépendant, avec possibilité de répétitions longues.
- Correction : sept couleurs par type I/O/L/J/Z/S/T, `boardTypes` synchronisé à la pose, aux couronnes et au laser, tirage équitable par sac global de sept, et log des chiralités posées sous `PartouChirality` (forme, rotation, front, couleur, compteurs tirés/posés).
- Tests Node, compilation Gradle et aperçu Chromium réussis : Actions #39742860690. Aucun log réel de partie sur Samsung encore recueilli. La réflexion du repère polaire n'est pas modifiée afin de préserver collisions et commandes ; l'observation des logs et visuels déterminera la suite.

## PT-021 — Chute accélérée aléatoire rapportée par Fab
- Symptôme : chute « de son plein gré » pendant le guidage d'une pièce, souvent au passage entre quartiers.
- Deux causes concrètes visibles en code 0.2.7 : `g.inward=p.distance<g.startDistance-17` suivie de `active=this.grip.inward||secondFinger.long` accélère sans deuxième doigt ; `fast pointerup => game.boost(selected,false)` peut laisser accéléré le front qui était sélectionné au début de la pression.
- Correction 0.2.8 : suppression totale du boost par direction radiale ; le second doigt doit être immobile et maintenu ≥420 ms, et tout glissement significatif après activation l'arrête. Sources de boost séparées/pinnées par front pour bouton, doigts et clavier ; remise à zéro sur pause, cache et changement de mode ; traces Android `PartouTouch`.
- CI Node + Android et essai réel Samsung à confirmer. Collisions et vitesse de gravité non modifiées.

## PT-022 — Sauvegarde persistante et titre pharaonique (22/10/2026)
- Avant : preferences audio/vitesse et leaderboard uniquement ; pas de partie en cours persistante. La réouverture réinitialisait quatre pièces et score.
- Correction : `session.js` (version 1, clé distincte) enregistre l'état complet y compris position/rotation des quatre pièces, metadata des couleurs posées, bag aléatoire, compteurs, gravité, combinaisons. Vérification dimension/type + copie profonde avant restauration. Aucune reprise d'un boost encore tenu ni ancienne file d'événements.
- Vue : `startPanel` propose REPRENDRE avec score retrouvé ou NOUVELLE PARTIE, le moteur reste en pause en attente du geste qui autorise aussi la musique. Sauvegarde régulière ~850ms + pagehide/visibilitychange + WebView Activity.onPause. Quand le jeu se termine, checkpoint supprimé sans effacer records/paramètres.
- Identité : A pyramide CSS sculpté en or, O reste une Lune bleue. Capture Chromium 412×915 inspectée, logo lisible, écran lunaire dégagé.
- Tests Node et assemblage Android réussis : CI #39760329152 ; `temp/PartouTetris-v0.2.9-debug.apk` 8 799 042 octets SHA blob f8322d35b2b938ba14115bb18ad3f939200dbe83.
- Essai réel restant : démarrer une partie, placer quelques blocs, quitter/forcer arrêt de l'application puis relancer et tester reprise exacte du score, cellules, pièces et palette ; nouveau jeu doit laisser les records intacts.

## PT-023 — Audit sauvegarde, ouverture et Hall of Fame
- Avant : dès le chargement `session.restore(game,savedSession)` mutait le moteur avant le choix et proposait « REPRENDRE » / « NOUVELLE PARTIE » dans le démarrage avec libellé « JOUER AVEC LE SON ».
- Après : aucune restauration avant OUI. NON demande une confirmation indépendante ; simple annulation revient à la question initiale et préserve checkpoint. Machine à état pure `ResumeDecision` empêche un effacement sans passer par la confirmation.
- Hall of Fame local déjà sauvegardé au format leaderboard-v1 (10 meilleurs) mais jusqu'ici top3 seulement dans HUD ; désormais popup hors démarrage, consultable depuis Réglages ou game over. Aucun appel réseau ni classement global.
- Premier essai CI : deux anciens tests attendent un ancien libellé et interdisent `position:fixed` dans feuille HUD. Test mis à jour, dialogue passé en `position:absolute` dans viewport ; rerun #39763997838 **success** (Node, Gradle, capture, publication APK). Test Android réel de cycle fermeture/relancement puis confirmations nécessaire.

## PT-024 — Audit et QA (23 octobre 2026)
- Avant : vitesse initiale 5s, niveau augmentant périodiquement avec seconds/150 et tous les trois anneaux ; score de pose 40 + profondeur × contacts, sans calcul carré sur les chaînes.
- Après : niveau par couronne uniquement, vitesse max lente 8s au départ, coefficient 0,92 par couronne ; aucun accroissement par le temps. Récompense différentielle sur les composantes circulaires affectées : (L_fin² - Σ L_avant²) pondérée par profondeur. Pas de double prime des portions déjà posées. Un bonus Royal Bridge et Géodésie s'ajoute une seule fois à l'événement de placement ; la scène n'attribue pas de points additionnels.
- Points de vitesse : 1+(max(0,8/tempsEtage-1))², borné ×100. Une pression sur CHUTE ×10 n'entre pas dans ce multiplicateur. Nouvelle partie à 8s ; ancienne sauvegarde continue avec sa base manuelle mais son ancien niveau automatique dû au temps est recalculé selon les couronnes.
- CI finale #39938398035 SUCCESS : tests Node, Gradle, capture du jeu et publication APK brute v0.2.11 réussis. Visuel inspecté, Lune/terre/satellites/HUD lisibles. À confirmer sur Samsung le rythme initial, la première couronne, les ponts, l'absence de double prime et les performances.

## PT-025 — État des services partagés et protection des scores
- SpaceFortressVs : HallOfFameSyncClient avec serveur partagé, protocoles de scores et clé d'upload spécifique ; GeckoDoku : transport sans clé, payload avec runId, file de synchronisation persistante et cache paginé.
- PartouTetris n'avait qu'un Top10 en local. Ajout de l'historique complet, idempotence par runId et synchronisation cache/world inspirées de ces projets.
- Sur serveur commun, la route du gameId partoutetris n'a pas pu être confirmée ; l'application garde les scores localement, signale 403/404, aucune fabrication de classement en cas de panne.
- Test Android requis : publication réelle, sync deux appareils, hors ligne et doublons.


## PT-034 — Diagnostic du score excessif et des destructions peu pénalisantes (24/10/2026)
- Sur PT-032, le score au carré de la durée de vol PT-030 peut atteindre ×100 pour une pose ou une couronne. Ce plafond multiplie le rendement des enchaînements, expliquant l'envolée des scores ressentie par Fab.
- Le malus PT-018 avant PT-034 ne dépendait que de la hauteur du bloc, pas de la vitesse permanente de gravité ; il restait 80 à 4000 points pour une seule brique.
- Correction sur branche PT-034 : multiplier la pénalité hauteur par (8 / fallInterval())² ; réduire les nouvelles récompenses globales à 65 %, plafonner le facteur de vitesse du gain à ×10. L'anti-exploit PT-030 reste fondé sur la durée de vol réellement mesurée.
- Cas à recontrôler : coût nul seulement pour coordonnées invalides, score non négatif si malus supérieur au solde, boost tactile sans impact sur le prix, anciennes sessions et historiques inchangés, calcul du bonus pont/géodésie cohérent.
- CI #40085127619 **SUCCESS** : tests Node (206), Gradle Android et publication de l'APK brute sous `temp/PartouTetris-v0.2.20-scoring-debug.apk`. **Essai réel Samsung encore à effectuer** ; aucun résultat de terrain présumé.


## PT-035 — Décalage perceptif entre Lune projetée et direction tangentielle (24/10/2026)
- Observation Fab après essai de PT-032 : la petite Lune projetée est à peu près correctement placée, mais les grands vecteurs tangentiels étaient visibles autour du doigt, séparés du pivot lunaire intermédiaire. Le joueur veut lire la tangente **au niveau du pivot entre doigt et pose future**.
- Correction visuelle seulement : un petit axe cyan local et des flèches sont calculés à `ghostMoonGuide.anchor` sur l'axe tangent de `target.angle`; deux traits translucides relient `target`, `anchor` et la coordonnée du doigt. Rendu avant les blocs, sans modifier la projection d'entrée ni la position des pièces.
- Tests de référence : mêmes vecteurs unitaires que joystick et moteur dans les 48 secteurs, raccord 47/0 et recalcul lorsque la projection bouge. Ne pas confondre avec le besoin PT-033 de supprimer ultérieurement le cercle jaune de sélection.
- CI et test réel Samsung non encore validés au moment de la rédaction ; vérifier avant livraison.


## PT-033 — Anneaux occultants (24/10/2026)
- Capture annotée : les deux anneaux de sélection/pose recouvrent visuellement les blocs et leur silhouette future.
- Correctif : retrait de l'arc de sélection dessiné sur la pièce et du cercle de destination affiché par `drawLandingCue` ; aura colorée très légère sur les quatre cellules actives et leurs quatre silhouettes de pose, avec oscillation lente et réduction de mouvement honorée.
- Préservation de PT-035 (tangente Lune projetée), PT-034 (scores) et du moteur de contrôle. Vérifier CI puis test sur smartphone.


## PT-039 — Zone d'aide trop haute et manque de rythme près de la Terre (24/10/2026)
- Captures Fab : le grand panneau inférieur occulte inutilement une fraction importante de la Terre, même quand le joystick pédagogique est affiché ; `joystick-guide.css` imposait auparavant 136 px de hauteur au panneau et 121 px au guide actif. PT-039 réduit ces valeurs à 84 px et 75 px avec limites adaptatives et libellés compacts ; maintenir laser accessible.
- Nouveau scénario indépendant du jeu : mini-blocs arrivant vers la Terre, interception automatique par les satellites ou explosions aléatoires ; en mode laser, un contact sur un bloc événementiel donne un bonus proportionnel au carré de la gravité durable. Anciennes sauvegardes et scores restent inchangés.
- Hypothèses de gameplay de cette première livraison : une cible à la fois, un tir payant au plus, +120 points à 8 s, +480 à 4 s, +1920 à 2 s, cap +3000 ; aucune hausse par boost manuel. Temps suspendu pendant pause. À vérifier en test Android, aucune validation tactile présumée.


## PT-040 — « tige » parasite sur débris spatial (24/10/2026)
- Capture fournie par Fab : sur mini-bloc coloré approchant la Terre, `earth-events.js.draw()` utilisait un segment fixe `moveTo(-9,14)` → `lineTo(-24-p.t*10,36)`, dans la couleur identique au bloc et dans les coordonnées tournantes du tétraminos ; rendait une barre inorganique, orientée selon sa rotation plutôt que selon le mouvement.
- Correction : particules discrètes obtenues par échantillonnage temporel de la trajectoire, non vecteur fixe, décalage transversal léger, palette chaude et extinction progressive. Appels `arc/fill` additifs, respect de l'option de mouvements doux. Vérifier la qualité sur vrai écran AMOLED Android ; tests unitaires ne prouvent pas la perception réelle.


## PT-041 — Les lasers arrivaient après la disparition de la cible; score trop monotone (24/10/2026)
- Échec perceptif constaté par Fab : un tap laser sur le bloc PT-039 provoquait `resolve(now,'player')` immédiatement. `earth-events.js` affichait donc l'explosion sans tir préalable, avec **zéro rayon satellite** pour un `reason='player'` (son dessin de faisceau était réservé à `reason='satellite'`).
- Correction du pipeline en deux phases : `hit` crée un état `pending` avec point et bonus figés ; les trois faisceaux réels issus des satellites sont dessinés 320 ms, puis `tick` lance une seule explosion/récompense. L'appel direct à `game.award(interception.bonus)` sur tap est retiré. Aucune duplication possible pendant le verrouillage.
- Les anciens retours de points utilisaient surtout le podium/scoreboard et des formulations statiques. Un narrateur BD centralisé lit uniquement les événements effectivement émis par le moteur et varie les phrases anti-répétition, montre les montants exacts et décompose l'accélération *réellement rémunérée* en tranches de 40 % pour l'animation.
- CI GitHub Actions #40129936727 **SUCCESS**, 248 tests et APK Android v0.2.28 générée (8 839 507 octets). Vérification visuelle sur Samsung à effectuer : les tests DOM assurent la géométrie et la chronologie, pas la lisibilité réelle sur écran.


## PT-042 — Cartouche comic opaque masquant la moitié droite du plateau (24/10/2026)
- Capture Fab : le `#comicFeed` PT-041 utilisait `position:fixed;top:var(--comic-top)` et un panneau opaque avec découpe polygonale pour **tous** les événements. Résultat : gros cartouche `COMBO ! Assemblage magistral +2234 pts` affiché au-dessus du centre et masquant les pièces.
- Réparation sans modifier les scores : l'élément est désormais un enfant absolu du deck de commandes, `bottom:calc(100% + 8px)` ; fonds semi-transparents, typographie et dimensions réduites ; formes **arrondies** pour gains normaux et **zigzag** pour messages prioritaires. Pas d'écoute tactile, composition responsive, trois satellites PT-041 intacts.
- GitHub Actions #40133532082 **SUCCESS** : 254 tests Node, Gradle Android réussi, APK directe 0.2.29 vérifiée. Essai visuel Samsung encore à faire. Attention au mode guide actif qui modifie la taille du panneau : l'ancrage DOM suit automatiquement la limite supérieure du deck.


## PT-043 — Centrage/comics et manque de variation de rythme (25/10/2026)
- Retour Fab : après PT-042, les bulles sont à la bonne hauteur, mais restent trop décentrées. Il faut un « zoom-out » au sens *petit grossissement ponctuel puis retour* ; éviter que le grossissement dure et accentuer le fond semi-transparent. Correctif CSS : centre horizontal dans le deck, pic d'échelle avant 90 ms puis retour à 100 % en 360 ms, maintien de l'animation de disparition ; transparence revue de ~.68/.49 vers .43/.31 (alerte rouge ~.45/.33). Modes doux fixes.
- Animation rare de pluie demandée pour casser la monotonie : nouveau contrôleur d'instances `EarthEvents` dans `earth-shower.js`, 3–6 trajectoires indépendantes vers Terre et échelonnées, cible de forme renouvelée, intervalle 45–90 s de jeu entre pluies, 6 cibles max ; retours incendiaires/lasers/comic PT-039/041 conservés. Aucune conséquence physique pour la grille ni nouvelle pénalité. Test réel de performances et d'impact visuel sur Samsung requis.
- Le ciblage manuel d'un mini-bloc de pluie reprend le verrouillage tri-laser existant et le gain exact appliqué à l'impact. Le gestionnaire plafonne à un tir utilisateur simultané et évite les doubles récompenses. Les événements atmosphériques automatiques restent gratuits en points.
- CI GitHub Actions #40142339981 **SUCCESS**, 262 tests Node réussis, aucun échec, compilation Android v0.2.30 et APK brute vérifiée (8 842 555 octets). L'unitaire vérifie la logique et le budget de rendu, mais pas l'ergonomie perceptive réelle : essais sur Samsung restant.


## PT-044 — Le titre CSS ne correspondait plus au nouveau visuel officiel (25/10/2026)
- Fab fournit un nouveau wordmark transparent PARTOUTETRIS : lettres dorées pyramidales, A architectural et O = Lune bleue. L'ancien titre était fabriqué par `mountMoonWordmark()` (texte + éléments CSS), donc ne pouvait pas respecter exactement la nouvelle charte.
- Résolution : image officielle locale WebP avec alpha conservé, suppression des grandes marges transparentes (sans effacer de pixels opaques), taille 700×105, fallback ancien titre CSS uniquement en cas de non-chargement de l'image. Style responsive autonome pour éviter d'étirer/couper le logo.
- Le premier essai en AVIF s'affichait en titre CSS de secours sur la capture Chrome headless ; remplacé par le WebP transparent plus compatible, puis nouveau contrôle visuel/CI demandé. Essai téléphone à vérifier.

- GitHub Actions #40146890756 **SUCCESS** : 265 tests réussis, 0 échec, compilation Android et APK brute 0.2.31 vérifiées (8 872 182 octets). L'ancien aperçu JPG est resté inchangé malgré l'exécution : ne pas le confondre avec une validation visuelle du nouveau logo. Vérification d'affichage réelle sur Samsung encore nécessaire.

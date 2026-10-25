# TODO — PartouTetris
- [x] Identifier le vrai dépôt `greenpower2669/PartouTetris` et lire son état.
- [x] Créer la branche `feature/lunar-four-fronts-001` sans modifier main.
- [x] Implémenter grille polaire et quatre pièces simultanées.
- [x] Ajouter commandes tactiles, ghosts, graphismes provisoires, score, pause.
- [x] Préparer l'application Android et son icône.
- [x] Ajouter tests Node et workflow de génération d'APK directe.
- [x] Build et tests verts : GitHub Actions run 39504100261 ; APK direct vérifié (16 005 octets) dans `temp/PartouTetris-v0.1.0-debug.apk`.
- [ ] Tester l'APK sur SM-A576B Android 16, ajuster contrôle/police/contraste selon retour Fab.
- [ ] Valider les règles de concurrence de pièces sur la frontière de deux cadrans.
- [ ] Ajouter les FX sonores, animations pyramidales, aides tactiles réglables et réglages d'accessibilité.
- [ ] Valider avec Fab le package Android avant toute publication Play Store ; AAB signé plus tard.
- [ ] Ne pas fusionner main ou publier de Release définitive sans validation explicite.

## PT-003 — Descente/audio 0.1.1
- [x] Ralentir la chute initiale et ajouter contrôle de vitesse sauvegardé.
- [x] Produire une musique de fond synthétique originale sans accès réseau.
- [x] Effets rotation, déplacement, collision, couronne, game over ; volumes indépendants et mute.
- [x] Déclenchement WebAudio après un geste de démarrage explicite.
- [x] Tests et compilation APK 0.1.1 validés par GitHub Actions #39509803472 ; fichier brut `temp/PartouTetris-v0.1.1-debug.apk` vérifié (20 206 octets).
- [ ] Tester la nouvelle vitesse et l'audio réellement sur SM-A576B Android 16.
- [ ] Selon retour Fab, enrichir FX pharaons/pyramides avec les ressources partagées (sans créer de dépendance obligatoire).
- [x] Adapter le test de gravité à la nouvelle durée (ancienne hypothèse 0,82 s incompatible avec 5 s).

## PT-004 — Tactile à deux mains
- [x] Attraper et guider d'une main pendant que l'autre tapote pour pivoter la pièce tenue.
- [x] Bloquer les rotations accidentelles sur glissement/maintien du second doigt et relâchement du doigt principal.
- [x] Préserver commandes alternatives, pause, son et sauvegardes.
- [x] Ajouter six scénarios de test sur les deux doigts.
- [x] Build et tests verts dans GitHub Actions #39513900116 ; APK directe vérifiée : `temp/PartouTetris-v0.1.2-debug.apk` (21 283 octets).
- [ ] Confirmer ressenti et multitouch réel sur SM-A576B Android 16, puis ajuster seuils si nécessaire.

## PT-005 et PT-006 — Version 0.1.3
- [x] Retirer les collisions entre pièces aériennes, sans supprimer les collisions sol/blocs verrouillés.
- [x] Déterminiser les poses synchronisées et empêcher l'écrasement de blocs.
- [x] Ajouter tests moteur pour croisements, contact et débordement.
- [x] Refaire les décors lunaires et pyramides, les cellules, les voiles, les halos et le HUD en rendu procédural.
- [x] GitHub Actions #39517259972 : tests Node et build Android réussis ; APK brute vérifiée dans `temp/PartouTetris-v0.1.3-debug.apk` (25 278 octets).
- [ ] Valider qualité, lisibilité et cadence sur Samsung SM-A576B.
- [ ] Enrichir textures/sons et affiner les effets suivant le ressenti Fab, sans changer le concept.

## PT-007 — Portrait et titre
- [x] Verrouiller Android en portrait via manifeste et activité.
- [x] Adapter géométrie lunaire au rectangle central libre.
- [x] Réorganiser les cinq boutons en deux rangées sans recouvrir le jeu.
- [x] Déplacer les pyramides près du titre et nettoyer la texture lunaire.
- [x] Ajouter tests Node orientation et géométrie aux tailles portrait.
- [x] CI GitHub Actions #39518335994 réussie (tests Node + compilation Android) ; APK directe vérifiée `temp/PartouTetris-v0.1.4-debug.apk` (26 736 octets).
- [ ] Valider visuellement sur SM-A576B Android 16 avec une nouvelle capture.

## PT-008 — Score et célébrations 0.1.5
- [x] Récompenser pièces posées, couronnes et combos réels.
- [x] Afficher +40 flottants, bulles et projecteurs sur couronnes.
- [x] Boule à facettes aux doubles couronnes et feux d'artifice à chaque 1000 points.
- [x] Fanfare WebAudio indépendante du fond musical, mode visuel doux.
- [x] Préserver portrait, quatre chutes, tactile 2 mains, sauvegardes.
- [x] Ajouter tests des scores, seuils et animations.
- [x] CI GitHub Actions #39521425766 verte (tests Node et compilation Android), APK directe 0.1.5 vérifiée dans temp/ (31 036 octets).
- [ ] Tester l'affichage des scores, des animations et des sons sur Samsung SM-A576B Android 16.

## PT-009 — Version 0.1.6 / nom officiel PartouTetris
- [x] Préserver le nom corrigé dans le titre, le dépôt, l'APK, Android, Actions et les mémoires.
- [x] Agrandir la Terre, préserver une place dédiée, créer trajectoires de célébration Terre → Lune.
- [x] Valoriser placement près du centre et multiplicateur xN par N cellules déjà posées voisines.
- [x] Appui long stable du second doigt pour chute rapide, tap bref conservé pour tourner.
- [x] Couvrir les nouveaux comportements par tests Node, sans désactiver les tests précédents.
- [x] CI GitHub Actions #39573299164 réussie après correction Bézier des continents ; tests Node + build Android, APK 0.1.6 brute vérifiée, 33 060 octets.
- [ ] Tester physiquement sur Samsung SM-A576B Android 16 : taille Terre, audio, récompenses, gestes 2 doigts.

## PT-010 — Android 0.1.7
- [x] Déplacer gains flottants et panneau du dernier gain dans la bande libre sous la Lune.
- [x] Grand score en haut sur toute la largeur, trois meilleurs scores immédiatement dessous.
- [x] Local highscore top 10 avec migration de l'ancien record et pseudo éditable en options.
- [x] Traînées de flammes sur les quatre débris entrants, tout en conservant les voiles.
- [x] Tir laser depuis Terre vers une pièce, rotation et éventuelle correction tangentielle si collision libre ; mode explicite.
- [x] Sons laser et respect du mode visuel doux ; anciens contrôles préservés.
- [x] Tests Node pour pseudo, classement, collisions laser et interfaces.
- [x] CI GitHub Actions #39578438005 : tests Node et compilation Android réussis ; APK brute PartouTetris-v0.1.7-debug.apk vérifiée sur branche (37 691 octets).
- [ ] Tester intuitivité lasers, lisibilité haut/bas et sensation des flammes sur SM-A576B Android 16.

## PT-011 — 0.1.8 / direction artistique corrigée
- [x] Remplacer l'icône Android de prototype par l'icône authentique de Fab (WebP optimisé).
- [x] Afficher l'icône d'origine à côté du titre.
- [x] Déplacer le spawn quatre étapes en dehors des anneaux, sans collisions aériennes supplémentaires.
- [x] Rendre les blocs extérieurs effectivement visibles et enflammés.
- [x] Supprimer tous les parachutes du jeu, sans retirer le motif de l'icône originale.
- [x] Dessiner trois satellites autour de la Terre et faire converger leurs lasers vers la cible.
- [x] Conserver une Lune à cratères, sans pyramides.
- [x] GitHub Actions #39591033182 : tests Node et APK Android 0.1.8 validés ; fichier direct vérifié (47 265 octets). Icône WebP exacte contrôlée par le SHA Git `e0eedc703359d7e27be9501b0f3c67bec1186229` dans Android + assets.
- [ ] Confirmer esthétique, espaces, lasers, fluidité sur SM-A576B Android 16.

## PT-012 — 0.1.9 Pharaonites et parachutes légers
- [x] Parachutes discrets uniquement à l'intérieur des 10 couronnes ; jamais dans l'espace.
- [x] Voiles cyan/or semi-transparentes, petites et dessinées sous les cellules.
- [x] Refonte des trois satellites vers des pyramides spatiales dorées à propulsion cyan.
- [x] Ajouter orbites cyan/or autour de la Terre, sans pyramide sur la Lune.
- [x] Préserver flammes hors zone, collisions, lasers, score, highscore, tactile et musique.
- [x] Tests Node sur transition des deux phases et intégration des trois satellites pyramidaux.
- [x] GitHub Actions #39594087561 : tests Node, compilation Android et publication APK brutes réussis. Fichier direct vérifié `temp/PartouTetris-v0.1.9-debug.apk` (48 461 octets).
- [ ] Essai réel SM-A576B : élégance, taille et visibilité des voiles, trois lasers satellites, nouvelles lumières.

## PT-013 — Charte, musique, lasers (0.2.0)
- [x] Lire les mémoires, auditer les commandes, la branche, le packaging et la médiathèque Djipie.
- [x] Copier par objet Git exact la charte officielle dans `design/charte-officielle.png`, indépendamment de l'interface.
- [x] Intégrer par objet Git le MP3 officiel dans les assets Android, mettre les volumes/mute/boucle et le secours audio exclusif.
- [x] Refiner les panneaux/titre/score avec or et cyan, rendre l'aide droite/gauche compacte et lisible, préserver toutes les commandes.
- [x] Ajouter la charge lumineuse des satellites et un effet laser à plusieurs phases ; sans média privé.
- [x] Mettre version Android et noms d'APK 0.2.0, ajouter des tests de ressources et de rendu.
- [ ] Vérifier GitHub Actions, tests Node, construction et dépôt direct `temp/PartouTetris-v0.2.0-debug.apk`.
- [ ] Valider visuellement l'APK sur Samsung avec le PNG officiel (charte non directement prévisualisable via l'API binaire ici) ; ajuster textures, Terre, Lune, satellites et HUD si nécessaire.
- [ ] Écouter le MP3 en entier et vérifier sa boucle sans blanc perceptible. Valider les effets laser avec Fab.
- [ ] Examiner provenance et droits de chaque son Djipie avant éventuelle intégration individuelle au dépôt public ; aucun son privé automatiquement redistribué.
- [ ] Préserver `main`, package, données locales, et publier Release/AAB uniquement après accord de Fab.

- [x] #39627108353 : tests Node, Android Gradle et APK brut 0.2.0 vérifiés après reprise du modèle Terre/horizon.
- [x] Aperçu de la véritable charte graphique généré et inspecté ; correction des proportions terre et disposition 5 boutons.
- [ ] Contrôler capture du rendu réel par Chromium CI (si disponible), puis test visuel/tactile/sonore sur Samsung.

- [x] Capturer le vrai rendu Chromium ; détecter HUD score tronqué et laser sur consignes ; correctifs DOM/CSS appliqués.
- [ ] Vérifier le nouvel aperçu Chromium après correction du panneau de score, du bouton laser et de l'aide tactile.

- [x] Corriger assertion PT-013 inutilement échouée à cause d'une échappement dans la regex du test ; relancer CI et vérifier capture actualisée.

## PT-013 — Contrôle de clôture technique (21/10/2026)
- [x] **GitHub Actions #39628651992 : succès** (65+ tests Node, Gradle, APK directe et aperçu Chromium).
- [x] **APK brute vérifiée** : `temp/PartouTetris-v0.2.0-debug.apk` (8 782 536 octets, SHA Git `01e56c4ae65ca8fd0f5ea7be2b98d22aeb07c997`).
- [x] Capture réelle du rendu sur navigateur sous `design/rendu-jeu-apercu.jpg` ; panneau score 100 % et LASER sans recouvrement de l'aide confirmés par inspection.
- [ ] Valider la fidélité fine de la charte par Fab : jeu actuel = refonte graphique codée fonctionnelle mais encore moins photoréaliste que le PNG fourni (Terre, nébuleuses, météorites).
- [ ] Écoute réelle du MP3 complet et de sa jonction en boucle, latence et sons laser sur Android 16 ; aucun test matériel humain effectué ici.
- [ ] Définir une sélection Djipie dont provenance et licence sont vérifiées individuellement puis intégrer uniquement ces sons autorisés (aucun son privé recopié actuellement).
- [ ] Vérifier visuellement, tactilement et en performance l'APK sur Samsung SM-A576B. AAB de publication et merge main non autorisés avant validation.

## PT-014 — Correction annonces de score (21/10/2026)
- [x] Auditer screenshot et identifier `#scoreBurst .fx-banner`, `floatScore` et `#pointFeed` comme trois sources de recouvrement.
- [x] Annonces de palier/couronne uniquement dans le HUD supérieur, sans changer sa hauteur ; cacher le podium au lieu du plateau pendant la scène.
- [x] Gains ordinaires dans la ligne du classement en haut, petite bulle courte, aucune création de textes flottants sur la Lune.
- [x] Tests de confinement et simultanéité ajoutés, identité Android et paramètres préservés ; version cible 0.2.1.
- [ ] Exécuter tests Node et Gradle GitHub Actions, valider capture Chromium, vérifier fichier `temp/PartouTetris-v0.2.1-debug.apk` brut.
- [ ] Vérifier lisibilité au niveau 5 avec couronnes remplies, petits écrans et double tactile sur Samsung.
- [ ] Écouter boucle de musique officielle MP3 sur Samsung pour certifier que le raccord est inaudible.

### PT-014 — Livraison automatisée vérifiée
- [x] Run GitHub Actions **#39644183018 = success** : tests Node (dont placement des annonces), Gradle, génération APK brute.
- [x] APK directe **`temp/PartouTetris-v0.2.1-debug.apk`**, 8 783 364 octets, blob Git SHA `227577f65bdd14fd61996d22e7c5deca160d6b07` (confirmé sur branche).
- [x] Aperçu portrait Chromium actuel `design/rendu-jeu-apercu.jpg` inspecté : aucune annonce au centre au repos, interface intacte.
- [ ] Test Samsung avec franchissement de 20 000 points et combos pour vérifier l'effet *en situation* ; continuité perceptive de la boucle MP3 à écouter.

## PT-015 — Meilleur score de Pharaonite et Tous3nKamion
- [x] Nouveau libellé « MEILLEUR SCORE DE PHARAONITE » dans le HUD.
- [x] Nouveau pseudo par défaut « Tous3nKamion » dans le code et le champ de réglages.
- [x] Migration de l'ancien défaut, sans changement des records/personnalisations sauvegardés.
- [x] Tests du pseudo et de la préservation des scores. Version Android 0.2.2.
- [ ] Vérifier compilation Actions et APK brute `temp/PartouTetris-v0.2.2-debug.apk`.
- [ ] Vérifier le libellé et pseudo sur SM-A576B.

### PT-015 — Validation technique finale
- [x] Exécution GitHub Actions [#39647494324](https://github.com/greenpower2669/PartouTetris/actions/runs/39647494324) : **success** (tests Node et APK Android).
- [x] Fichier non compressé `temp/PartouTetris-v0.2.2-debug.apk` vérifié (8 783 572 octets ; SHA blob Git `07ada0aa7d5a00acf77dce04c42319d39f4f9048`).
- [x] Aperçu portrait `design/rendu-jeu-apercu.jpg` inspecté : « MEILLEUR SCORE DE PHARAONITE » et « Tous3nKamion » visibles sans chevauchement du plateau.
- [ ] Validation sur Samsung du pseudo migré et des anciens records sur une installation existante.

## PT-016 — Bannière arcade en CODE 0.2.3
- [x] Conserver le HUD vrai DOM et les clés de records, pseudo, score et classement.
- [x] Titre doré, O lunaire en CSS, quatre tétriminos de 4 carrés et carénage cyan/or en CSS responsive.
- [x] Score géant live or + meilleur score Pharaonite live cyan ; annonce PT-014 et classement restant accessibles.
- [x] Tests statiques du module bannière, version Gradle et chemin APK 0.2.3.
- [ ] Valider tous les tests Node, GitHub Actions Gradle et fichier `temp/PartouTetris-v0.2.3-debug.apk`.
- [ ] Examiner le rendu Chromium de 0.2.3 et ajuster si chevauchement ou réduction du plateau.
- [ ] Essai réel SM-A576B Android 16 avant publication, `main` intacte.

### PT-016 — Vérification finale (21/10/2026)
- [x] Build GitHub Actions [#39655192888](https://github.com/greenpower2669/PartouTetris/actions/runs/39655192888) réussi : tests Node + Gradle et capture portrait Chromium.
- [x] APK brute vérifiée : `temp/PartouTetris-v0.2.3-debug.apk`, 8 787 418 octets (Git blob SHA `d634edadaa9f9f46661b44b1c3838f69255055bd`).
- [x] Capture `design/rendu-jeu-apercu.jpg` inspectée : quatre tétriminos néon, titre or avec O-Lune agrandi, panneau score et meilleur score Pharaonite visibles, anneaux lunaires et boutons libres.
- [x] Correction d'effondrement Flex du titre (`flex:0 0 auto`), agrandissement du mot titre et meilleure taille de score.
- [ ] Tester réellement l'esthétique et la lisibilité avec Fab sur SM-A576B, notamment en cours de partie avec score > 10 000 et top 3 rempli.
- [ ] Valider l'audio MP3 réel et le comportement multitouch en conditions Samsung ; `main` inchangée.

## PT-017 — Vitesse ×10 et approche depuis Terre (21/10/2026)
- [x] Comprendre l'ancienne accélération ×5, limitée à une seule marche par frame.
- [x] Accélération ×10 au deuxième doigt après 420 ms, et bouton de chute rapide ; boucles d'étages bornées en 8 passages max par frame pour ne pas perdre la vitesse en fin de partie.
- [x] Conserver tap bref pour rotation. Pendant approche spatiale : rotations autorisées, translation interdite (y compris kick de rotation). Translations rétablies à la première couronne lunaire.
- [x] Étendre trajet orbital de quatre à cinq étapes, ralentissement modéré de la phase spatiale (.72 → .82 du temps normal).
- [x] Projeter les blocs par code Canvas depuis la Terre vers chacun des quatre fronts, sans changer leur angle/secteur de collision, avec flammes arrière et taille croissante.
- [x] Ajouter tests accélération moteur, comportement de rotation, déplacement, projection depuis la Terre et quatre directions.
- [ ] CI GitHub Actions / APK brute v0.2.4 et capture Chromium.
- [ ] Test tactile réel sur SM-A576B : ×10 et relâchement, rotation en espace, arrivée dirigée, accessibilité et collisions.

### PT-017 — Résultat GitHub Actions 0.2.4
- [x] GitHub Actions [#39682743622](https://github.com/greenpower2669/PartouTetris/actions/runs/39682743622) **success** : tests Node, Android Gradle, APK brute et aperçu Chromium.
- [x] APK brute vérifiée sur `feature/lunar-four-fronts-001` : `temp/PartouTetris-v0.2.4-debug.apk` (8 789 389 octets ; blob SHA `fb12e81c33e5b02fec66a9a1c76d0dd0d31c8970`).
- [x] `design/rendu-jeu-apercu.jpg` (SHA `dd37613097f7345a3b03cfa8497676264153cb28`) inspectée : quatre pièces arrivant en petits groupes depuis l'horizon de Terre, quatre fronts dégagés et aide « maintien = chute ×10 » correcte.
- [ ] Tester en conditions réelles : seconde main maintenue, immédiat au relâchement, transition espace → couronnes, verrouillage de collision, lisibilité des trajectoires à différents niveaux.

## PT-018 — Terre et satellites vivants, laser de démolition
- [x] Terre : rotation apparente douce des continents, couche de nuages blancs translucides et 3 cyclones mobiles, réduction de mouvement.
- [x] 3 satellites-pyramides : légers mouvements orbitaux, balises et propulseurs cyan pulsants, faisceaux synchronisés sur leurs positions.
- [x] LASER : maintien stable 1,3 s sur brique verrouillée, indication charge, destruction d'une seule cellule ; annulation sur relâchement/glissement/pause/mode et perte de focus.
- [x] Coût = 80 × (r+1) × plafond((r+1)/2), 80 près du centre et 4000 à la couronne extérieure ; score courant jamais négatif, meilleurs scores non modifiés.
- [x] Tir bref conservé sur débris en vol, ciblage aligné avec la trajectoire depuis la Terre.
- [x] HUD signale le MALUS, nouveau son de destruction ; tests et build Android 0.2.5 déclenchés.
- [ ] Valider GitHub Actions et présence de l'APK directe v0.2.5.
- [ ] Tester le maintien avec les doigts sur Samsung et observer la performance des nuages/cyclones.

### PT-018 — Compilation finale vérifiée
- [x] GitHub Actions [#39687843781](https://github.com/greenpower2669/PartouTetris/actions/runs/39687843781) : **success** (tests Node, Gradle, capture Chromium, APK brute).
- [x] `temp/PartouTetris-v0.2.5-debug.apk` (8 791 813 octets, blob Git `734e4e8ac4c40629abbcfc52b26e1af275e8d060`) vérifiée sur `feature/lunar-four-fronts-001`.
- [x] Capture `design/rendu-jeu-apercu.jpg` inspectée : cyclones blancs visibles sur la Terre sans empiéter sur les couronnes, trois satellites présents. Rotation continue (petite vitesse) et nuages indépendants vérifiés dans le code.
- [ ] Valider visuellement en mouvement réel sur Samsung les nuages/cyclones/rotation, puis maintenir le laser 1,3s sur brique fixe et contrôler le malus, les annulations et la vibration.
- [ ] Vérifier également stabilité du maintien avec deux doigts et absence de décrochage audio sur appareil réel.

## PT-019 — Laser de correction, Android 0.2.6
- [x] Ciblage facilité des briques fixées et visée persistante après relâchement du doigt.
- [x] Barre de progression pendant 1,3 seconde et retrait d'une brique avec le malus existant.
- [x] Tests et compilation GitHub Actions #39689590579 réussis ; APK brute dans temp/PartouTetris-v0.2.6-debug.apk.
- [ ] Essai sur Samsung : choix de la cible, progression visible, pénalité, annulation et conservation des records.

## PT-020 — Chiralités et couleurs (22 octobre 2026)
- [x] Couleurs fixes selon la forme : I cyan, O jaune, L orange, J bleu, Z rouge, S vert, T violet.
- [x] Conserver le type/couleur des pièces posées à travers les couronnes et le laser.
- [x] Générateur équitable par sac global de sept pièces sans remise.
- [x] Debug console et Android Logcat `PartouChirality` à chaque pose : L/J/S/Z, front, rotation, couleur, cumuls posés et tirés.
- [x] Tests chiralités miroirs, tirage, conservation des couleurs et APK 0.2.7 : Actions #39742860690 success.
- [x] APK brute `temp/PartouTetris-v0.2.7-debug.apk`, 8 794 454 octets, vérifiée.
- [ ] Contrôler sur Samsung les couleurs des quatre fronts et capturer les logs après au moins 14 placements.
- [ ] Ne pas inverser les coordonnées polaires avant accord et vérification des impacts sur les commandes/collisions.

## PT-021 — Chutes ×10 involontaires pendant le déplacement
- [x] Identifier déclenchement caché radial de 17px dans `touch.js`.
- [x] Supprimer complètement cette action involontaire ; premier doigt = déplacement uniquement, y compris franchissement des quartiers.
- [x] Le deuxième doigt stable ≥420ms reste la seule accélération multitouch ; glissement après hold coupe immédiatement ×10.
- [x] Verrouiller la cible du bouton CHUTE sur le front initial jusqu'au relâchement ; gérer simultanéité avec boost du second doigt et clavier via `boost-sources.js`.
- [x] Ajouter traces debug `PartouTouch` pour ON/OFF et source.
- [x] Ajouter tests du glissement radial, des changements de quartier/front, des sources simultanées, des relâchements et interruptions.
- [x] GitHub Actions #39749278236 **success** : tests Node, Android Gradle, capture Chromium ; APK directe `temp/PartouTetris-v0.2.8-debug.apk` vérifiée, 8 795 703 octets, SHA blob `babf831b701c8e7baf912da2fcdbe39eafc9c8e5`.
- [ ] Essai Samsung : placer plusieurs pièces en promenant le doigt au centre et entre quartiers, aucune chute rapide sans second doigt.

## PT-022 — Lettre pyramide et reprise automatique
- [x] Sculpture CSS du A doré du titre, O lunaire conservé, lecture accessible complète.
- [x] Autosave versionné et validé des 4 pièces, du tableau polaire et des types fixés, score, rythme de chute, sac des 7 formes, temps, niveau et combo.
- [x] Sauvegarde toutes ~850 ms et lorsqu'Android suspend / cache / ferme la WebView ; restauration en pause au démarrage.
- [x] Boutons Reprendre la partie et Nouvelle partie, nouvelle partie et game-over nettoient seulement la clé de session.
- [x] Tests Node : round-trip complet, copies indépendantes, sauvegarde corrompue, nettoyage, non-régression des records et contrats visuels.
- [x] GitHub Actions #39760329152 success, APK brute `temp/PartouTetris-v0.2.9-debug.apk` (8 799 042 octets) vérifiée ; capture CSS A inspectée.
- [ ] Valider reprise réelle sur SM-A576B : fermer l'app, rouvrir, reprendre après action utilisateur et comparer les quatre fronts et score. Tester aussi la sauvegarde au milieu d'un déplacement, sans boost résiduel.
- [ ] Demander accord Fab avant fusion main / publication AAB.

## PT-023 — Accueil, sauvegarde et Hall of Fame
- [x] Popup de reprise seulement après réouverture complète avec partie sauvegardée : « Voulez-vous continuer là où vous en étiez ? ».
- [x] OUI reprend les 4 fronts restaurés avec score/combos/paramètres sauvegardés ; aucune restauration avant le choix.
- [x] NON affiche une deuxième confirmation « Vous êtes sûr ? » ; possibilité de garder la partie ; effacement uniquement sur deuxième validation.
- [x] Hall of Fame local indépendant (top 10 avec pseudo/points) accessible dans Réglages et sur écran de défaite, absent de la fenêtre initiale.
- [x] Remplacement de « JOUER AVEC LE SON » par « ▶ JOUER », suppression du texte technique audio de démarrage.
- [x] Tests adaptés et build GitHub Actions #39763997838 réussi ; APK brute `temp/PartouTetris-v0.2.10-debug.apk` 8 801 497 octets vérifiée ; capture de plateau contrôlée.
- [ ] Essayer sur Samsung : fermer complètement l'app avec une partie, la rouvrir, Oui → bonne reprise ; Non → annuler (conservation) puis Non → confirmation finale (nouveau jeu) ; ouvrir Hall of Fame, vérifier historique inchangé.

## PT-024 — Score au carré et progression stratégique
- [x] Vitesse lente initiale maximum 8 secondes/case sur nouvelle partie ; aucune accélération due au temps.
- [x] À chaque couronne complète supprimée, baisse progressive et immédiate de l'attente (facteur 0,92, minimum 0,8s).
- [x] Bonus multiplicateur de vitesse au carré du différentiel, indépendant du boost tactile ×10.
- [x] Score selon taille réelle de la pièce, profondeur et contacts, chaîne continue 360° à gauche/droite valorisée par gain de carrés sans recompter les anciennes chaînes.
- [x] Bonus Pont des Pharaons en réunissant deux structures et prime Géodésie au raccord interquartiers, célébrations HUD et son court.
- [x] Tests de cercle 47/0, chaînes anciennes, pont, profondeur, progression couronnes, vitesse² et migration session.
- [x] CI et compilation Android #39938398035 réussies. APK non ZIP temp/PartouTetris-v0.2.11-debug.apk vérifiée (8 803 677 octets) ; capture portrait inspectée.
- [ ] Test sur Samsung SM-A576B : temps constant sur partie longue sans couronne, vitesse accrue après 1 couronne, points bonus et garde-fous, animations/sons.
- [ ] Ne pas fusionner main ou publier AAB sans validation explicite de Fab.

## PT-025 — Hall of Fame inspiré de SpaceFortress et GeckoDoku
- [x] Auditer les implémentations globales des deux autres jeux.
- [x] Enregistrer tous les scores locaux avec identifiant unique ; conserver les meilleurs historiques.
- [x] Hall Local / Mondial / historique, informations claires sur absence de réseau ou serveur non configuré.
- [x] Outbox hors ligne et cache monde persistants, contrôle d'accusé par runId, pas de dédoublonnage par pseudo.
- [x] Bridge Android HTTPS limité au service commun, permission réseau, aucune clé embarquée.
- [x] Tests automatisés JS d'archives locales, fiabilité de file, cache, reconnexion et dédoublonnage.
- [x] Actions #39946832870 réussie : tests Node, rendu Chromium et compilation Android. APK directe temp/PartouTetris-v0.2.12-debug.apk vérifiée, 8 812 320 octets (blob Git SHA d10635408467764c9f25243ed9d5aa3838fcf602).
- [ ] Activer ou valider réellement la route serveur du jeu partoutetris et son schéma de score.
- [ ] Faire essai Android 16, deux appareils pour classement inter-joueurs, test hors ligne.
- [ ] Ne pas fusionner main sans accord.


## PT-034 — Rééquilibrage des scores et destruction vitesse² (24/10/2026)
- [x] Branche isolée créée depuis `feature/lunar-four-fronts-landing-032` ; `main` préservée.
- [x] Coût d'une destruction = ancien coût selon la hauteur × carré du rapport entre vitesse réelle permanente et vitesse de départ à 8 secondes/étage.
- [x] Les raccourcis tactiles de chute ×10 ne changent pas le prix du laser ; score ne descend jamais en dessous de zéro.
- [x] Gains des poses et couronnes réduits de 35 % ; bonus de vitesse réelle limité à ×10 ; affichage des bonus pont/géodésie ajusté.
- [x] Anciennes sauvegardes et scores conservés ; tests spécialisés ajoutés dans `tests/pt034-scoring-balance.test.cjs`.
- [x] CI GitHub Actions #40085127619 réussie : 206 tests Node, compilation Gradle, publication de l'APK brute.
- [x] APK brute `temp/PartouTetris-v0.2.20-scoring-debug.apk` vérifiée sur GitHub (8 825 021 octets, SHA Git blob `f14a2627b890fc3de72a03ac6b1dfd5bf839a454`).
- [ ] Essai réel Fab sur Samsung Android 16 : partie lente/rapide, coût du laser et équilibre des nouveaux scores ; évaluer les anciens classements non recalculés.
- [ ] PT-033 visuel à coder séparément, seulement après ordre explicite, puis fusion des changements envisagée après tests.
- [ ] Aucun merge `main` ni publication définitive sans validation.


## PT-035 — Tangente sur la Lune projetée (24/10/2026)
- [x] Branche isolée `feature/lunar-four-fronts-tangent-035` à partir de PT-034, préserver les scores et `main`.
- [x] Ajouter le repère tangent local au centre mobile de la Lune projetée, en liaison visuelle légère avec la pose future et le doigt.
- [x] Orienter ce repère comme `joystick-guide.js` et `tangent-control.js`, sans changer les commandes ni la sensibilité.
- [x] Conserver repère de pose PT-032, flèches bleues au doigt et joystick « POSE » sous le jeu.
- [x] Ajouter tests géométriques sur 48 secteurs, franchissement 47/0, pivot mobile, rendu discret, absence de mutation du moteur et compatibilité PT-034.
- [x] CI #40087650577 : **213 tests Node réussis, zéro échec**, compilation Gradle Android et publication APK directe 0.2.21 **SUCCESS**.
- [x] APK non ZIP `temp/PartouTetris-v0.2.21-tangent-debug.apk` vérifiée : 8 826 914 octets, blob SHA Git `a6c44cac5c97316fb4924db71b3b24ad7c214359`. Téléchargement direct : https://raw.githubusercontent.com/greenpower2669/PartouTetris/feature/lunar-four-fronts-tangent-035/temp/PartouTetris-v0.2.21-tangent-debug.apk
- [ ] Essai sur Samsung SM-A576B Android 16 : doigt loin, doigt proche, tangente locale, diagonales, quatre fronts, rotation et mouvements rapides, compatibilité PT-034.
- [ ] PT-033 reste séparé (remplacement du cercle jaune et pulsation de la projection), ne pas le réaliser implicitement.
- [ ] Pas de fusion `main` ni publication définitive sans validation.


## PT-033 — Aura sur pièce et projection (24/10/2026)
- [x] Branche dédiée issue de PT-035, main intacte.
- [x] Supprimer l'anneau jaune de la pièce et l'appel du cercle de projection.
- [x] Illuminer les cellules réelles et projetées, même couleur, pulsation douce ; respecter effets visuels doux.
- [x] Préserver tangente PT-035 et scoring PT-034, tests PT-033 ajoutés.
- [x] CI GitHub Actions #40106508588 : 217/217 tests réussis, Gradle Android réussi et APK directe publiée ; fichier vérifié `temp/PartouTetris-v0.2.22-glow-debug.apk` (8 827 066 octets).
- [ ] Essai réel Samsung Android 16 : lisibilité avec doigt sur pièce, sur projection et en mouvement rapide.
- [ ] Jamais de fusion main sans accord explicite de Fab.


## PT-036 — Aura irradiante visible (24/10/2026)
- [x] Branche issue de PT-033, score PT-034 et guide PT-035 conservés.
- [x] Dessiner des halos qui épousent chaque mino réel et projeté avec deux passes lumineuses et variation de luminance claire.
- [x] Conserver l'absence d'anneaux et le mode visuel doux.
- [x] Ajouter tests de non-régression PT-036 et préparer debug 0.2.23.
- [x] CI #40107340300 réussie : **219/219 tests**, build Android Gradle et APK directe vérifiée `temp/PartouTetris-v0.2.23-irradiant-debug.apk` (8 827 338 octets).
- [ ] Vérifier l'effet visuel sur Samsung et ajuster après retour de Fab si besoin.
- [ ] Aucun merge main sans validation.


## PT-037 — Intensité, alternance cyan-or et aura (24/10/2026)
- [x] Branche `feature/lunar-four-fronts-bicolor-aura-037` créée depuis PT-036 ; `main` intacte.
- [x] Large aura externe suivant exactement chaque cellule sélectionnée et sa projection.
- [x] Transition progressive et cyclique cyan ↔ or, intensité fortement variable et mode visuel doux stable.
- [x] Préserver scores PT-034, tangente PT-035, commandes et HOF.
- [x] CI GitHub Actions #40108753328 **SUCCESS** : 219/219 tests, compilation Android réussie ; APK brute vérifiée `temp/PartouTetris-v0.2.24-bicolor-aura-debug.apk` (8 827 774 octets).
- [ ] Retour perceptif Fab sur Samsung, contrôler alternance et aura sans anneaux.


## PT-038 — Événements waouh, feu laser et espace
- [x] Branche PT-038 basée sur PT-037, main inchangée.
- [x] Appliquer aura bicolore pulsée sur la pièce sélectionnée dans l'espace.
- [x] Ajouter laser → combustion d'une pièce sous parachute et chute temporaire ×3, sans persistance sur le remplacement.
- [x] Ajouter feu, HUD et vibrations discrètes ainsi que tests moteur/rendu.
- [x] GitHub Actions #40111344628 **SUCCESS** : 223 tests réussis, zéro échec, Gradle et APK brute `temp/PartouTetris-v0.2.25-wow-debug.apk` vérifiée (8 828 482 octets).
- [ ] Tester effets et cadence sur Samsung Android 16, puis ajuster avec Fab.
- [ ] Ne pas fusionner main sans validation.


## PT-039 — Débris Terre, défense et fenêtre basse (24/10/2026)
- [x] Branche isolée `feature/lunar-four-fronts-earth-events-039` issue de PT-038 ; garder toutes les fonctions antérieures.
- [x] Nouvel objet secondaire aléatoire s'approchant de la Terre ; sept formes, pas de répétition consécutive.
- [x] Résolutions automatiques : laser satellite ou explosion autonome avec événements graphiques.
- [x] Interception manuelle dans le mode LASER ; bonus de score 120 × vitesse gravitationnelle permanente² plafonné, tir unique par objet et aucun détournement avec chute ×10.
- [x] Fenêtre d'aide et joystick du bas réellement réduits ; textes plus compacts et laser utilisable.
- [x] Tests Node PT-039 ajoutés et application Android 0.2.26 préparée.
- [x] CI GitHub Actions #40119045022 **SUCCESS** : 232/232 tests Node, zéro échec, Gradle Android terminé, APK brute vérifiée `temp/PartouTetris-v0.2.26-earth-events-debug.apk` (8 831 682 octets, blob SHA `14bb2952780c6d55eee68fbe2f01827d5f44c704`). Téléchargement brut : https://raw.githubusercontent.com/greenpower2669/PartouTetris/feature/lunar-four-fronts-earth-events-039/temp/PartouTetris-v0.2.26-earth-events-debug.apk
- [ ] Test réel Samsung : objets bien visibles près de la Terre, laser manuel gagnant des points, satellites automatiques, panneau compact y compris avec joystick actif.
- [ ] Pas de merge main / Release / Play sans validation de Fab.


## PT-040 — Remplacer la tige par une queue de particules (24/10/2026)
- [x] Branche autonome `feature/lunar-four-fronts-particle-tail-040` issue de PT-039 ; rien fusionné sur `main`.
- [x] Retirer le trait plein coloré derrière le bloc événementiel se dirigeant vers la Terre.
- [x] Émettre des particules étincelantes blanc-jaune-orange déclinant en taille et opacité, en suivant l'historique réel du déplacement et non la rotation.
- [x] Longueur légèrement fonction de la gravité permanente, sans influence de la chute manuelle ×10 ; mode visuel doux allégé.
- [x] Maintenir gameplay, bonus, lasers et interfaces PT-039 ; ajouter tests PT-040.
- [x] CI GitHub Actions #40122239539 **SUCCESS** : **239/239 tests Node**, zéro échec ; Gradle Android réussi ; APK brute `temp/PartouTetris-v0.2.27-particle-tail-debug.apk` vérifiée (8 832 546 octets, blob SHA `04eab107f1aac02300f1ee09311b19fffac00380`). Lien direct : https://raw.githubusercontent.com/greenpower2669/PartouTetris/feature/lunar-four-fronts-particle-tail-040/temp/PartouTetris-v0.2.27-particle-tail-debug.apk
- [ ] Test visuel sur Samsung SM-A576B : traînée visible, détachée en étincelles et non en « bâton » lors d'une rotation, absence d'occlusion du terrain.
- [ ] Aucune fusion `main` sans validation explicite de Fab.


## PT-041 — Feedback BD multiformule, phases vitesse et interception tri-laser
- [x] Nouvelle branche `feature/lunar-four-fronts-comic-feedback-041` issue de PT-040 ; aucun merge `main`.
- [x] Appui joueur → cible conservée → salve **trois lasers simultanés** des trois satellites pendant 320 ms → impact → disparition et explosion → unique bonus réel et popup.
- [x] Banque riche de formulations françaises pour défense, poses, couronnes, ponts, malus et gains ; éviter de réutiliser les deux dernières phrases.
- [x] Cartouches temporaires façon comics visibles mais non tactiles, couleur distincte pour gains/malus, texte hiérarchisé ; pause/effets doux respectés.
- [x] Petites bulles `+40 %` par phase lorsque le vrai bonus vitesse existe, pourcentage total exact si le bonus est grand. Aucun faux bonus ni score ajouté.
- [x] Câblage pour toutes les mutations `points` et `destroy`, anciens festivals conservés, tests PT-041 ajoutés et vieux tests d'interception actualisés.
- [x] GitHub Actions #40129936727 **SUCCESS** : 248/248 tests Node (0 échec), build Gradle Android et APK brute vérifiée `temp/PartouTetris-v0.2.28-comic-trilaser-debug.apk` (8 839 507 octets, blob SHA Git `c14bb0b38393ae94ba5238a12358b5e4a67fc406`). Lien direct : https://raw.githubusercontent.com/greenpower2669/PartouTetris/feature/lunar-four-fronts-comic-feedback-041/temp/PartouTetris-v0.2.28-comic-trilaser-debug.apk
- [ ] Test Android Samsung : trois faisceaux lisibles pendant le ciblage, explosion et score après 320 ms, popups BD variés, malus vrai, bon placement et non-occlusion des blocs.
- [ ] Attendre validation Fab avant toute fusion `main`.


## PT-042 — Repositionner les bulles BD et hiérarchiser les cadres
- [x] Branche `feature/lunar-four-fronts-bottom-comics-042` issue de PT-041, main intacte.
- [x] Déplacer `#comicFeed` directement à l'intérieur du panneau de commandes et le fixer juste au-dessus, sans calcul d'écran et sans toucher aux boutons.
- [x] Réduire taille et opacité du fond, conserver texte lisible et clics traversants.
- [x] Bulles ordinaires à coins arrondis et alertes/waouh à contour polygonal zigzag (interception, couronne, combo, malus, gros gain).
- [x] Conserver bande de mots, anti-répétition, bonus vitesse fractionné, trois lasers synchronisés et score original.
- [x] Ajouter tests PT-042 et préparer APK 0.2.29 directe.
- [x] CI [GitHub Actions #40133532082](https://github.com/greenpower2669/PartouTetris/actions/runs/40133532082) **SUCCESS** : 254 tests Node réussis / zéro échec, compilation Gradle Android ; APK non ZIP `temp/PartouTetris-v0.2.29-bottom-comics-debug.apk` vérifiée (8 840 047 octets, blob SHA `b89c4d0b3caefb78ae8d87280afe749abeba7369`). Téléchargement direct : https://raw.githubusercontent.com/greenpower2669/PartouTetris/feature/lunar-four-fronts-bottom-comics-042/temp/PartouTetris-v0.2.29-bottom-comics-debug.apk
- [ ] Essai visuel Samsung : bas du plateau, aucun masquage central, toutes les bulles et formes, petit écran, panneau « POSE » en action.
- [ ] Pas de fusion main / Release / Play sans accord Fab.


## PT-043 — Micro-zoom BD et pluies de blocs occasionnelles (25/10/2026)
- [x] Créer `feature/lunar-four-fronts-comic-meteor-shower-043` à partir de PT-042 sans modifier `main`.
- [x] Bulles BD recentrées horizontalement au-dessus des commandes et fonds nettement plus transparents.
- [x] Micro-grossissement fort très court (×1,10 lisse / ×1,24 zigzag), retour à la taille habituelle, fade, modes doux conservés.
- [x] Ajouter alertes BD `meteor` avec vocabulaire varié et sans points fictifs, priorité devant messages ordinaires.
- [x] Introduire de rares pluies de 3–6 objets Terre indépendants et décalés, 45–90 s d'intervalle, trajectoires et formes variées ; 6 cibles et 162 particules max.
- [x] Réutiliser pour chaque mini-bloc les interceptions satellites/spontanées, le ciblage par les 3 lasers du joueur, l'explosion post-salve et le bonus vitesse² PT-039 sans duplication.
- [x] Pause, mode effets doux, ancienne grille lunaire, score anti-inflation, sauvegardes et HOF conservés.
- [x] Tests PT-043 ajoutés et Android 0.2.30 préparé.
- [x] GitHub Actions #40142339981 **SUCCESS** : 262/262 tests Node (zéro échec), compilation Gradle Android et APK brute vérifiée `temp/PartouTetris-v0.2.30-meteor-shower-debug.apk` (8 842 555 octets, SHA Git `39a67c0f26d49502a7d537781f34b9d3c65eca3f`). Téléchargement direct : https://raw.githubusercontent.com/greenpower2669/PartouTetris/feature/lunar-four-fronts-comic-meteor-shower-043/temp/PartouTetris-v0.2.30-meteor-shower-debug.apk
- [ ] Essai Samsung SM-A576B Android 16 : popup centrée et très brève, visibilité Terre lors des pluies, fréquence, laser manuel et cadence générale.
- [ ] Aucun merge `main` ou Release sans validation explicite de Fab.


## PT-044 — Logo officiel Fab dans le bandeau titre
- [x] Repartir de la branche `releases` PT-043 avec une branche de travail dédiée.
- [x] Récupérer le PNG original fourni dans la conversation et découper uniquement les grandes marges transparentes.
- [x] Ajouter le véritable logo doré avec la Lune bleue dans `app/src/main/assets/partout-title-044.webp` (local et hors connexion).
- [x] Afficher l'image à la place du titre CSS, avec fallback texte si le chargement du WebP échoue.
- [x] Adapter la taille du bandeau et les écrans étroits/petites hauteurs sans masquer les commandes du jeu.
- [x] Ajouter tests PT-044 ; préparer v0.2.31/versionCode 42.
- [x] **GitHub Actions #40146890756 SUCCESS : 265/265 tests Node (zéro échec), build Gradle Android réussi.** APK brute `temp/PartouTetris-v0.2.31-official-title-debug.apk` vérifiée (8 872 182 octets, SHA Git `95e020ece4378f0e24dec77d1d157fd7abf38a33`).
- [ ] Valider visuellement sur le Samsung la taille du nouveau titre et le positionnement par rapport au niveau/pictogrammes.
- [ ] Ne pas fusionner `main` sans accord de Fab.

# Ordres de mission — PartouTetris

## IMMUTABLE / À PRÉSERVER
- Dépôt canonique : `greenpower2669/PartouTetris` (orthographe vérifiée sur GitHub).
- Licence MIT existante préservée.
- Ne jamais fusionner `main` ni publier une Release définitive sans l'accord explicite de Fab.
- Fournir une APK Android directe, non enfermée dans un ZIP, et prévoir distinctement un AAB pour une future publication.
- Package Android `com.greenpower2669.partouteris` : **provisoire, non validé pour publication**.

## PT-001 — Concept quatre fronts
- **Demande de Fab, 20/10/2026 :** Lune ronde vue latéralement ; quatre cadrans de 90°, quatre pièces chutant simultanément et indépendamment sous des parachutes ; rotation et correction tangentielle ; projections semi-transparentes ; Tetris de plus en plus rapide ; couronne géodésique continue 360° qui disparaît ; effets Égypte/pharaons futuristes ; destruction de la Terre si débordement.
- **Demande de Fab :** « Ok code ça ».
- **Statut :** Prototype initial 0.1.0 codé sur branche `feature/lunar-four-fronts-001` ; APK construite, validation tactile humaine attendue.

## PT-002 — Livraison et identité Android
- Livrer une APK debug directement installable depuis GitHub Actions sans extraction ZIP sur téléphone.
- Tester Android 16 / SM-A576B.
- **Statut :** APK 0.1.0 debug créée et vérifiée dans GitHub (run #39504100261), lien direct dans README ; validation humaine sur Android 16 attendue, pas de publication Play.

## PT-003 — Descente lente et jeu vivant (21/10/2026)
- **Retour utilisateur :** « Trop rapide la descente et pa,de sons c pas gai ».
- **Action demandée :** réduire fortement la cadence et ajouter sons/musique motivants.
- **Implémentation :** v0.1.1 : 5 s/étage, vitesse réglable 2–8 s, progression lente, thème original WebAudio et sons d'interaction, curseurs indépendants et mute.
- **Statut :** Build Android et tests CI vérifiés (#39509803472), APK directe 0.1.1 disponible ; ressenti de Fab et son Android réels restent à valider.

## PT-004 — Contrôle naturel à deux mains (21/10/2026)
- Retour de Fab : « Pour moi mlus intuitif j attrape main droite et je tapote main gauche pour pivoter ».
- Contrat : un doigt de la main droite attrape et guide la pièce, le second doigt de la gauche fait tourner **la pièce tenue** par tapotements successifs sans avoir à relâcher la prise ; le second doigt ne détourne jamais la pièce sélectionnée. Bouton de rotation conservé pour un doigt.
- Statut : implémenté en 0.1.2 ; tests automatiques et build Android validés (#39513900116), APK directe disponible ; validation tactile humaine sur Samsung SM-A576B Android 16 attendue.

## PT-005 — Collision aérienne non bloquante (21/10/2026)
- **Demande Fab :** « Les block entre se bloque dàs les air il ne faut pas tans que parachute, bousculé mais continu vers le sol ».
- **Contrat :** aucune collision solide entre blocs actifs en vol ; les blocs verrouillés et le sol sont les seuls obstacles ; priorité de pose déterministe et zéro écrasement lors d'atterrissages simultanés.
- **Statut :** implémenté dans la 0.1.3 ; CI #39517259972 réussie, APK 0.1.3 directe vérifiée ; test sur téléphone encore attendu.

## PT-006 — Refonte visuelle pharaons (21/10/2026)
- **Demande Fab :** « les graphismes doivent être plus beaux que la, on dirait un poc dégeux » ; « Ok code ça ».
- **Contrat :** Lune plus volumétrique, cratères et ombrages, blocs à facettes/reflets, voiles techno-pharaoniques, fond spatial, effets d'énergie, interface plus soignée ; maintenir la lisibilité.
- **Statut :** première refonte graphique procédurale codée en 0.1.3 ; build CI #39517259972 validé ; rendu visuel réel et ressenti de Fab à valider sur téléphone.

## PT-007 — Portrait fixe et pyramides près du titre (21/10/2026)
- Source : capture Android paysage de la 0.1.3 envoyée par Fab.
- Demande explicite : « Met ça en portrait figé stp et les piramides met les plutôt vers le titre en haut ^^ ».
- Verrouillage Android portrait via manifeste et activité, plein écran maintenu.
- Le plateau doit rester entre le HUD et les boutons, jamais sous les contrôles ; l'interface portrait place les commandes sur deux rangées.
- Trois pyramides décoratives à côté du titre en haut, retirées de la texture lunaire (cratères conservés).
- Statut : code et tests validés par CI #39518335994, APK directe 0.1.4 vérifiée ; contrôle du rendu portrait sur Samsung toujours attendu.

## PT-008 — Points et célébrations Block Boost (21 octobre 2026)
- Demande : « Faut des points et des célébrations comme avec block boost pour dynamiser ».
- Référence auditée : Block-Boost (fireworks.mjs, result-celebration.mjs, disco-sprites.mjs) ; principes des scènes bornées et seuils de 1 000 points.
- Code 0.1.5 : +40 points à chaque pose valable, score réel de couronnes et combos, gains flottants ; bulles/projecteurs, disco, feux d'artifice, fanfare originale et option visuelle douce.
- Préserver la licence, les sauvegardes, le tactile, le portrait et les sons existants. Aucun média privé de Djipie transféré.
- Statut : code et build CI #39521425766 vérifiés, APK 0.1.5 non compressée présente sur branche ; validation téléphone attendue.

## IMMUTABLE — Correction officielle de nom (21 octobre 2026)
- Fab confirme : « J ai corrigé le nomnc est PartouTetris ».
- **Dépôt et appellation officiels : `greenpower2669/PartouTetris`**, APK, title Android, en-tête graphique, README, Actions et documentation doivent utiliser ce nom.
- L'ancien nom « PartouTeris » est abandonné pour la présentation ; on préserve le package interne `com.greenpower2669.partouteris` afin de ne pas perdre sauvegardes et compatibilité des APK précédentes.
- N'effectuer aucun renommage du package Android ou des clés localStorage sans accord et migration explicite.

## PT-009 — Terre source des festivités, profondeur, contacts, appui long du deuxième doigt
- Demande Fab : « des célébration devrait venir se la terre que devrait aussibêtre plus grosse » ; « plus il les bloque se pose au centre plus il font des points et plus ils sont en contact avec s autre block aussi 2 autre bloc bonus fois 2 ainsi se suite le deuxieme doigt appuis long accélère la dézcente ».
- Scoring : 40 points de base + 12 × proximité radiale moyenne vers la Lune, multiplicateur ×N à partir de N=2 cellules déjà posées distinctes en contact radial ou tangentiel. Un contact = ×1. Contacts évalués avant placement ; pas de bonus avec la nouvelle pièce elle-même.
- Gestes : doigt primaire guide ; deuxième doigt tap court = rotation ; maintien stable ≥420 ms = chute rapide, retour à normal au relâchement, aucune rotation lors du maintien.
- Visuel : Terre plus grosse, place réservée sous le cercle en portrait ; faisceau, bulles et particules sortent de la Terre vers la Lune ; accessibilité préservée.
- Statut : code PT-009 et APK 0.1.6 compilés avec succès en CI #39573299164 ; test visuel/multitactile Samsung toujours à faire.

## PT-010 — Score, meilleurs scores, pseudo, rentrées enflammées et tirs laser (21/10/2026)
- **Demande Fab :** afficher les points gagnés plus bas ; rendre les débris arrivant de l'espace en flammes ; donner la possibilité de tirer au laser pour orienter les pièces ; en haut, score occupant toute la largeur, avec meilleurs scores en dessous ; réglage d'un pseudo.
- **Scoring inchangé :** points de proximité + contacts et combos conservés. Afficher les gains bas sans recouvrir la Lune ; bandeau supérieur affiche grand score et podium 3 local.
- **Classement :** garder l'ancienne valeur de record (`partouteris-record`) lors de l'introduction du classement local à pseudo modifiable; ne pas perdre les sauvegardes.
- **Laser :** mode explicite par bouton, viser/toucher une pièce volante proche de la trajectoire ; rotation + poussée tangentielle opposée au côté touché si possible ; pas de traversée des blocs fixes, pas d'interruption du contrôle standard lorsqu'on désactive le mode. Son/trace depuis Terre, cadence raisonnable.
- **Entrée en flammes :** simple présentation Canvas, non liée à collision physique ou à un temps de chute différent ; mouvement réduit honoré.
- **Statut :** code et tests PT-010 en 0.1.7 ; CI et vérification humaine Samsung en attente.

## PT-011 — Icône authentique, long trajet spatial, satellites convergents, lune sans pyramides (21 octobre 2026)
- Correction de Fab : « Mais non dessine pas code et prends la nouvelle icone 😀 ... sauf que je ne veux pas de pyramide sur la lune, pas plus maintenant 😜 ».
- Préserver **exactement le concept graphique de l'icône fournie** ; intégrer en ressource binaire Android et en emblème du bandeau, sans nouveau dessin IA. La source originale envoyée est /mnt/data/25255.png.
- Arrivées : les quatre pièces démarrent 4 niveaux radiaux hors du plateau (approche spatiale distincte), traînées incandescentes et blocs réellement visibles en espace libre ; enlever tout parachute du jeu. Maintenir vitesse réglée, quatre fronts, collisions uniquement avec blocs verrouillés, et contrôle tactile à deux doigts.
- Lasers : le tir n'émane plus d'un point central de la Terre mais de **3 satellites terrestres visibles et distincts**, leurs faisceaux convergeant vers une cible unique. Préserver impacts et effets sonores existants.
- Lune : conserver seulement cratères et texture géologique, **aucune pyramide**, aucune icône collée sur le globe ; l'Égypte futuriste reste dans logo et HUD.
- Branches/FabCopilot : intervenir uniquement sur feature/lunar-four-fronts-001, sans fusion main ni Release; APK directe non ZIP. Statut : CI #39591033182 et APK 0.1.8 brute vérifiées ; rendu visuel à valider sur Samsung.

## PT-012 — Petites voiles en zone lunaire et esthétique des deux images (21 octobre 2026)
- Fab précise : les parachutes doivent se déployer **une fois que les pièces entrent dans la zone de jeu**, et rester beaucoup plus discrets qu'au début.
- Phase spatiale de quatre rayons au-delà des dix couronnes : blocs incandescents **sans parachute** ; zone de dix couronnes : petites voiles de stabilisation cyan/or, transparentes, accessoires purement graphiques.
- Inspiration visuelle obligatoire : **icône officielle PartouTetris** (bleu, cyan néon, or, pyramides) + visuel récent de pharaons futuristes, Terre et pyramides-satellites. Satellites modélisés en forme de pyramides dorées avec anneaux et moteurs cyan. Aucun nouveau dessin généré, exclusivement code Canvas Android.
- **Interdit de dessiner des pyramides sur la surface lunaire.** Conserver textures/cratères et tous les contrôles, sauvegardes, scores, vitesse, musique.
- Travaux v0.1.9 dans `feature/lunar-four-fronts-001` ; aucun merge main/release définitive. GitHub Actions #39594087561 et APK 0.1.9 vérifiées ; test visuel/tactile sur téléphone toujours en attente.

## PT-013 — Refonte fidèle, musique officielle et Djipie (21/10/2026)
- Source du design : le PNG déposé sur `main` par Fab, désormais copié à l'identique dans `design/charte-officielle.png` sur la branche de travail. Référence esthétique absolue. Ne pas l'aplatir en fond masquant les commandes.
- UI : titre doré, panneaux cadrés or/cyan, score large, aide gestuelle compacte correcte et commandes existantes conservées. Lune géologique sans pyramides, blocs sur quatre fronts, Terre et satellites-pyramides indépendants, lasers convergents.
- Audio : le MP3 `musique PartouTetris .mp3` de `main` est importé byte-identical comme `official-theme.mp3` ; lecture déclenchée au toucher, boucle et volume paramétrable. Synthèse originale en secours ; laser synthétique étagé activation/charge/tir/impact.
- Djipie : sources des catégories audio consultées ; droits des fichiers individuels non confirmés pour publication publique, donc **aucune copie des sons privés**.
- Livraison attendue : APK brute v0.2.0 sous `temp/`, branche `feature/lunar-four-fronts-001` uniquement, `main` inchangée. État : développé sur branche ; tests CI et fidélité visuelle réelle à valider, aucune fusion/release.

### PT-013 — État technique (21 octobre 2026)
- **Livré sur branche, à valider par Fab :** APK 0.2.0 directe, #39628651992 success, accès via `temp/PartouTetris-v0.2.0-debug.apk`.
- **Non clos :** fidélité fine à la charte officielle ; écoute et boucle musicale sur Samsung ; sons Djipie privés soumis à preuve de droits ; contrôle tactile réel. Aucune fusion `main`, aucune Release et aucun AAB de publication.

## PT-014 — Annonces de score hors plateau (21 octobre 2026)
- **Retour Fab, capture Android 0.2.0 :** le bandeau « 20 000 POINTS ! » au centre cache des couronnes et des pièces ; le bandeau « GAIN +484 ×4 » cache une partie de la vue.
- **Commande explicite « Ok go » :** faire apparaître ces messages **en haut ou en bas, jamais sur le plateau**. Conserver tous les effets, le scoring, les commandes et la musique.
- **Implémentation v0.2.1 :** bannière de célébration dans le panneau score supérieur, remplaçant uniquement le classement pendant l'événement ; petit gain compact sur la ligne « meilleurs scores », sans reflow du HUD. Les animations de particules subsistent sans obstacle tactile. Ces annonces disparaissent automatiquement et libèrent le classement.
- **Musique :** loop HTMLAudioElement (MP3 local officiel), réglages/mute et solution de secours préservés ; raccord sonore réel à tester à l'écoute.
- **État :** correction codée sur `feature/lunar-four-fronts-001`, CI et contrôle Samsung à vérifier. `main` intacte.

### PT-014 — État de livraison (21/10/2026)
- **Livré, à valider par Fab :** version Android 0.2.1 via Actions #39644183018 (success), fichier .apk non compressé dans `temp/`.
- Maintien du lecteur officiel en boucle `track.loop=true`, sans modification du fichier musical ni des préférences de volume. La présence de la boucle dans le code est confirmée, mais la qualité du raccord ne peut être certifiée sans écoute de toute la piste.
- Aucun merge `main` ni Release officielle, prochain essai humain : palier 20 000 et gains simultanés sur Samsung.

## PT-015 — Score de Pharaonite et pseudo Tous3nKamion (21/10/2026)
- Correction de Fab : **« Meilleur score de Pharaonite »** (libellé de la rubrique) et pseudo **« Tous3nKamion »** par défaut, jeu de mots avec Toutânkhamon.
- Préserver classement top 3/top 10, sauvegardes, anciens records, pseudos personnalisés et package Android. Migration de la seule ancienne valeur par défaut « PHARAON », sans altérer les entrées du classement.
- Version cible 0.2.2, branche `feature/lunar-four-fronts-001` seulement ; `main` inchangée. CI et APK à vérifier.

### PT-015 — Livraison à valider
- Version 0.2.2 compilée et tests verts, Actions #39647494324 ; APK brute disponible sur branche via `temp/PartouTetris-v0.2.2-debug.apk`.
- Contrôle visuel Chromium de la bannière « MEILLEUR SCORE DE PHARAONITE » et du pseudo « Tous3nKamion » effectué ; tests réels Samsung et audio restent ouverts. `main` intacte.

## PT-016 — Bannière de jeu néon/or recréée en CODE (21/10/2026)
- Fab fournit visuel de référence titre PARTOUTETRIS doré, O lunaire cyan, pièces géométriques colorées, carénage science-fiction cyan/or, score or géant, record cyan ; il précise expressément « Non, en code ^^ » après une génération d'image incorrecte.
- **Contrat : aucun visuel généré plaqué en fond.** Construire le bandeau en HTML/CSS/DOM, chiffres, pseudo, records toujours dynamiques et sauvegardes inchangées. Ne pas dégrader la zone jouable en portrait ni chevaucher les annonces PT-014.
- Le titre reste accessible sous sa chaîne d'origine, le O visible est une sphère lunaire à cratères dessinée en CSS, 4 tétriminos lumineux sont composés de cellules CSS, les panneaux affichent le score vivant et la meilleure valeur Pharaonite.
- Branche de travail `feature/lunar-four-fronts-001`, cible Android 0.2.3, CI et photo comparative à valider, aucune fusion de main.

### PT-016 — Validation technique
- **Livré pour essai** sur `feature/lunar-four-fronts-001` : Gradle v0.2.3, APK directe non ZIP `temp/PartouTetris-v0.2.3-debug.apk` et capture Chromium `design/rendu-jeu-apercu.jpg`, GitHub Actions #39655192888 success.
- Décor du bandeau 100 % HTML/CSS ; le jeu lui-même et les scores restent dynamiques. `main` n'a pas été fusionnée ni publiée. Attendre feu vert de Fab avant Release/AAB.

## PT-017 — Boost franc ×10 et arrivée depuis la Terre (21 octobre 2026)
- Demande Fab : deuxième doigt maintenu → descente **dix fois plus rapide** et réellement fluide comme dans Tetris, rotation au tap court inchangée ; bouton CHUTE de même puissance.
- Annonce spatiale plus longue (cinq étapes au lieu de quatre, phase légèrement ralentie) ; dans l'espace on peut **tourner mais pas déplacer latéralement**, la prise et l'orientation sont conservées à l'entrée des couronnes.
- Trajectoires graphiques depuis la Terre au premier plan vers quatre directions d'arrivée autour de la Lune ; le visuel 3D simulé n'affecte ni la position logique du moteur ni le contact des blocs.
- Préserver quatre fronts, music loop, nouveaux HUD PT-016, pseudo Tous3nKamion, scores/records et package Android. Cible 0.2.4 sur `feature/lunar-four-fronts-001` ; ne pas fusionner `main`.

### PT-017 — Livraison à tester
- GitHub Actions #39682743622 confirmé **success**, `temp/PartouTetris-v0.2.4-debug.apk` vérifiée 8 789 389 octets sur la branche. Aperçu Chrome réel inspecté : quatre unités spatiales naissent près de l'horizon terrestre et HUD inchangé.
- Le `×10` signifie une vraie multiplication de progression de chute, non une animation artificielle. Rotation conserve tap court, long appui accélère ; pas de translation de secteur pendant approche.
- Test humain sur Samsung requis avant validation définitive. Aucune fusion `main`, aucune Release/AAB.

## PT-018 — Satellites plus vivants, Terre en mouvement et malus laser
- Demande Fab : effets de vie des satellites-pyramides, rotation apparente de la Terre, nuages et cyclones blancs semi-transparents, destruction au tir laser prolongé sur une brique posée avec malus fortement croissant vers les couches élevées.
- Prototype : maintien LASER 1,3 s sur une case verrouillée ; glissement >23px ou relâchement annule la charge, effet visible, une seule case détruite, pas de destruction en chaîne.
- Pénalité = 80×(r+1)×ceil((r+1)/2), facturation plafonnée au score pour empêcher les points négatifs ; toutes les sauvegardes restent inchangées.
- Tout est rendu en Canvas local, satellites avec micro-orbites et poussée cyan pulsante, météo illustrée, réduction effets honorée. Aucun merge `main`, version 0.2.5 branch test.

### PT-018 — Prêt pour validation de Fab
- APK Android de test 0.2.5 livrée non compressée, Actions #39687843781 **success** ; artefact `temp/PartouTetris-v0.2.5-debug.apk` sur branche. Aucune fusion `main`, aucun AAB de publication.
- Les animations Terre/cloud/cyclones/satellites sont calculées localement sans asset de météo ; scoring de laser maintenu et chute ×10 inchangés. Essai réel sur Samsung encore requis.

## PT-019 : Correction laser approuvée par retour utilisateur
Objectif : corriger un mauvais placement moyennant du temps et des points. L'ancienne manipulation empêchait souvent de terminer le tir. Nouvelle manipulation : LASER activé, touche sur une brique posée, focus automatique 1,3 seconde, malus croissant puis retrait d'une brique. Conserver les sauvegardes et `main` intacte ; APK de test 0.2.6 sur la branche.

## PT-020 (22/10/2026)
Fab demande 7 couleurs fixes par forme, sac de 7 tirages et logs L/J/S/Z des poses. Modifications sur la branche : boardTypes, chiralités et statistiques. CI #39742860690 réussie, APK 0.2.7. main à préserver, test Samsung requis.

## PT-021 — Accélérations involontaires (22/10/2026)
- Fab signale des chutes ×10 sans consentement en déplaçant une pièce, notamment entre quartiers.
- Cause confirmée : `touch.js` interprétait un déplacement radial vers la Lune supérieur à 17 px comme commande de boost ; ce geste doit rester exclusivement un déplacement. Autre défaut : bouton CHUTE activait un front mais désactivait le front *actuellement sélectionné*, laissant l'ancien boost actif après changement de sélection.
- Contrat : seul le deuxième doigt maintenu volontairement au moins 420 ms ou un bouton/une touche explicite déclenche ×10. Une glissade du deuxième doigt annule le boost. Chaque source conserve son front initial jusqu'au relâchement, sans conflits entre sources simultanées.
- Debug Android `PartouTouch` : ON/OFF + source et front. Préserver chiralités, couleurs, audio, records et package Android. Branche de travail uniquement, sans fusion `main`. Version 0.2.8 à tester sur SM-A576B.

## PT-022 — A pyramidal et reprise automatique (22 octobre 2026)
- Fab souhaite transformer une lettre du titre stylisé en pyramide et sauvegarder automatiquement une partie pour la reprendre après réouverture.
- Le **A** de PARTOUTETRIS devient une pyramide dorée sculptée en CSS, conservant le O lunaire cyan, les tétriminos, le titre vocal complet et le cadre original. Aucun PNG du logo n'est collé sur le jeu.
- État sauvegardé : les deux grilles polaires 10×48 (front et couleur/type), quatre pièces et angles/rayons/rotations, intervalles de chute, sac global des sept formes + historiques, score, temps, niveau, nombre de poses, couronnes et combos, sélection. Checkpoint toutes les ~850ms, lors de pause, Android onPause, pagehide et background.
- Au démarrage : lire et valider la sauvegarde, proposer « REPRENDRE LA PARTIE » ou « NOUVELLE PARTIE », sans démarrer automatiquement le son tant qu'Android n'a pas reçu un geste. Retirer les accélérations et pointeurs encore en cours avant reprise. Partie terminée ou redémarrée => effacer uniquement checkpoint, préserver pseudo, paramètres, records et classement.
- Fichiers : `session.js` validé/versionné/isolé, `index.html` bouton et déclencheurs, `MainActivity.java` flush onPause, `hud-pt016.css` pyramide CSS ; tests `pt022-session.test.cjs`.
- Build GitHub Actions [#39760329152](https://github.com/greenpower2669/PartouTetris/actions/runs/39760329152) **success**, Android 0.2.9, APK brute `temp/PartouTetris-v0.2.9-debug.apk` (8 799 042 octets). Capture `design/rendu-jeu-apercu.jpg` inspectée : A pyramidal et O lunaire présents sans masquer le plateau.
- Main intacte, validation d'une fermeture/réouverture sur Samsung SM-A576B encore nécessaire avant Release.

## PT-023 — Reprise confirmée et Hall of Fame local (22 octobre 2026)
- Après fermeture complète/réouverture WebView avec checkpoint valide, afficher une question séparée : « Voulez-vous continuer là où vous en étiez ? ».
- OUI : restaurer à ce moment seulement les quatre fronts sauvegardés, puis reprendre au toucher. Le checkpoint n'est pas modifié avant la réponse.
- NON : afficher une **deuxième** fenêtre « Vous êtes sûr ? » ; « GARDER MA PARTIE » retourne à la question initiale sans effacer ; « OUI, NOUVELLE PARTIE » est l'unique voie qui supprime la session et commence à zéro. Records, classements, pseudo et préférences jamais supprimés.
- Hall of Fame **local et hors démarrage** : fenêtre distincte depuis Réglages et fin de partie, dix meilleures performances, pseudo, points, médailles; données déjà conservées par leaderboard.js. Le résumé des trois meilleurs scores dans le HUD reste lisible pendant une partie.
- L'accueil initial affiche « ▶ JOUER » et non « Démarrer avec le son » ni une explication technique Android sur l'audio. La musique suit ses préférences et démarre après un geste, inchangée.
- Tests PT-023 plus ajustement des anciens contrats PT-016 et PT-022, build [GitHub Actions #39763997838](https://github.com/greenpower2669/PartouTetris/actions/runs/39763997838) réussi. APK brute `temp/PartouTetris-v0.2.10-debug.apk`, 8 801 497 octets, sur branche `feature/lunar-four-fronts-001`. Capture de plateau inspectée. Tester la séquence complète sur Samsung. Main intacte.

## PT-024 — Économie stratégique validée en code (23 octobre 2026)
- Mission Fab : vitesse de départ au maximum d'attente 8 secondes/étage, progression de difficulté uniquement quand une couronne disparaît, bonus de vitesse au carré du différentiel, récompense par taille et profondeur, bonus de continuité au carré sur la même couronne et Pont des Pharaons/Géodésie.
- Règle : attente = max(0,8, base*0,92^couronnes), niveau = 1+couronnes. Chaque couronne supprimée accélère immédiatement, jamais le simple temps écoulé ; réglage manuel conservé comme exception explicite.
- Multiplicateur de vitesse = 1 + max(0,8/attente - 1)^2 (plafonné x100) ; le maintien volontaire CHUTE x10 ne modifie pas la difficulté générale du jeu.
- La prime de continuité couvre 48 secteurs circulaires et utilise carré(longueur nouvelle chaîne) moins somme(carrés chaînes antérieures) : seule la nouveauté est récompensée, pas l'ancien score. Pont Royal si au moins deux anciennes chaînes sont réunies, Géodésie lorsque le raccord franchit une frontière 11/12,23/24,35/36,47/0.
- Garder les quatre fronts, contrôles, lasers correcteurs, musique, Hall of Fame local, sauvegardes et records. Aucune fusion main.
- Tests Node + Gradle + capture Chromium et APK v0.2.11 directs : GitHub Actions #39938398035 SUCCESS ; APK brute temp/PartouTetris-v0.2.11-debug.apk (8 803 677 octets, blob SHA 8fa54a73c4d508b2bc254bc9b189540986390c39). Essai Android réel encore requis.

## PT-025 — Hall of Fame inspiré de SpaceFortressVs / GeckoDoku (23 octobre 2026)
- Mission Fab : highscores complets et classement partagé.
- Archivage local de toutes les parties terminées avec ID de session unique, conservation des anciens records et du pseudo.
- Hall local avec Top10 / historique, onglet Monde avec statut de synchronisation et cache.
- Reprise après réseau absent via file persistante, accusés idempotents et déduplication par identifiant réel de partie, jamais par pseudo.
- Bridge Java HTTPS vers le service commun connu, aucune clé privée intégrée.
- Le gameId PartouTetris n'est PAS confirmé sur le serveur partagé : tant que la route /api/v1/games/partoutetris/ n'est pas disponible et testée, ne pas prétendre que des scores mondiaux sont reçus.
- Travail sur la branche existante ; pas de fusion vers main ou de publication Play sans validation.

## PT-026 — Projection tangentielle et observateur virtuel glissant (23/10/2026)
- Fab valide l'expérimentation du contrôle : observateur virtuel projeté au-delà du centre de la Lune sur l'axe opposé à la pièce, projection différentielle des gestes sur la tangente locale, contrôle continu haut/bas/côtés/diagonales sans inversion visible ni retour imposé au centre.
- La main droite garde le bloc ; la seconde main conserve tap pour tourner et maintien pour chute x10. Sensibilité continue plus précise lentement, plus ample rapidement ; contrôles originaux récupérables dans Réglages via « Guidage tangentiel projeté (essai) ».
- Réalisation exclusivement sur `feature/lunar-four-fronts-tangent-026` à partir de `feature/lunar-four-fronts-001`, sans merge main : `tangent-control.js`, `touch.js`, `index.html`, `tests/pt026-tangent.test.cjs`, `design/PT-026-controle-tangentiel.md`.
- Validation CI : [run #39999637500](https://github.com/greenpower2669/PartouTetris/actions/runs/39999637500) SUCCESS (tests Node, build Gradle, publication APK). APK directe : `temp/PartouTetris-v0.2.13-tangent-debug.apk` (8 814 495 octets), versionCode 24. Ne pas confondre la validation technique avec une validation ergonomique humaine.
- Attente : test tactile sur SM-A576B Android 16 en haut, bas, côtés et diagonales, précision doigt éloigné, doigt réagrippé, boutons, laser, chute x10, compatibilité sauvegardes et Hall of Fame. **Fab décide avant fusion, sortie de test ou modification définitive du guidage.**

## PT-027 — Joystick pédagogique de projection tangentielle (23/10/2026)
- Fab : lorsque la pièce passe de l'axe latéral au perpendiculaire, le geste semble exiger une courbe. Placer un petit joystick virtuel **dans le bandeau inférieur**, visible seulement pendant une prise, pour montrer l'axe efficace et le doigt fantôme qui le suit.
- Prototype visuel non interactif : ligne à deux flèches cyan orientée sur la tangente actuelle du morceau, indication horizontal / vertical / diagonal, doigt fantôme animé et marqueur doré reflétant le vrai glissement projeté. Pivot continu avec l'objet ; transitions lisibles, préférence « Effets visuels doux » respectée.
- Ne perturbe ni la prise, le deuxième doigt (rotation ou chute x10), ni le LASER, les paramètres, scores, sauvegardes ou Hall of Fame. Guide masqué au relâchement, pause, laser, perte de focus, mode classique, fin de partie.
- Implémentation isolée dans `feature/lunar-four-fronts-guide-027`, origine `feature/lunar-four-fronts-tangent-026`. Version d'essai **0.2.14 / versionCode 25**. Voir `design/PT-027-joystick-guide.md`, `joystick-guide.js` et tests `pt027-joystick-guide.test.cjs`.
- Validation Android SM-A576B requise avant toute adoption : visibilité en bas, axe conforme aux 48 secteurs et transitions, sensation du contrôle et non-interférence. **Interdiction de fusion vers main sans l'accord explicite de Fab.**
- **Validation technique :** [GitHub Actions #40003656255](https://github.com/greenpower2669/PartouTetris/actions/runs/40003656255) **SUCCESS** : tests Node et build Gradle ; APK directe `temp/PartouTetris-v0.2.14-joystick-debug.apk` (8 817 716 octets) publiée sur la seule branche de test. L'essai tactile réel sur Samsung reste nécessaire avant validation ergonomique.

## PT-028 — Amplitude uniforme et vecteurs tangentiels autour du doigt (23/10/2026)
- Sur captures réelles PT-027, Fab observe que le rail vertical semble nettement plus court que l'horizontal alors que la taille de la Lune reste constante. Demande une **même amplitude de représentation ET de précision tangible** en haut, bas, sur les côtés et diagonales.
- Garder le joystick inférieur et toute l'interface; retirer la limitation verticale du rail (31 unités) et afficher un axe symétrique de même longueur (104 unités SVG) quels que soient les 48 secteurs. Le contrôle `projectDrag` projette déjà sur une tangente unitaire avec gain indépendant de l'angle : vérifier cette invariance sur 48 secteurs sans introduire de zoom / sensibilité arbitraires qui ruinent la finesse.
- Ajouter autour du **premier doigt de prise** deux petits vecteurs cyan de part et d'autre, alignés sur la tangente actuelle à la pièce, qui grandissent/rétrécissent doucement et suivent la pièce en temps réel, sans toucher à la sélection ou au déplacement. Effets doux => tracés fixes.
- Visuels non interactifs seulement ; disparition à la fin de la prise, pause, laser, réglages, mode traditionnel, fin de partie ; second doigt rotation/chute x10, sons, scores/HOF, sauvegardes et ancien mode intacts.
- Branche réservée `feature/lunar-four-fronts-amplitude-028` issue de PT-027, APK d'essai Android **0.2.15** (versionCode 26) ; aucun merge de `main` sans feu vert. Détails de conception : `design/PT-028-amplitude-et-vecteurs.md`. Essai humain sur SM-A576B requis.
- **Livraison vérifiée :** [Actions #40006601647](https://github.com/greenpower2669/PartouTetris/actions/runs/40006601647) SUCCESS (tests + Gradle + publication) ; APK brute `temp/PartouTetris-v0.2.15-amplitude-debug.apk` (8 819 044 octets, SHA Git `fdd4b133aa757ebed843e684013cc7898b4c1e46`). Validation du confort tactile par Fab encore attendue.

## PT-029 — Lune fantôme de guidage orbital et vecteurs néon renforcés (23/10/2026)
- Fab valide la mathématique tangentielle et l'amélioration PT-028 constatée sur Samsung; le frein résiduel se situe dans la compréhension **visuelle** des transitions circulaires sur 360°. Ne pas retoucher la projection ni la vitesse/sensibilité des gestes.
- Dessiner en arrière-plan des pièces une **lune fantôme extrêmement translucide** autour d'un pivot pédagogique créé au premier point de prise : centre local projeté en arrière du doigt le long de la radiale de la pièce. L'ancre reste stable pendant la prise; un arc doux sur la circonférence suit le secteur actuel pour expliquer l'orbite à 360°. Rayon de 58 px et couleurs bleu/cyan alpha bas, sans masquer briques et dangers. Invisible sans prise, en pause, laser, réglages, mode ancien, hors zone lunaire, ou après relâchement/annulation.
- Les **deux vecteurs opposés près du doigt** deviennent plus longs (départ 30 px, longueur 24 à 42 px), semi-transparents (alpha 0,58) et néon cyan; ils suivent la tangente actuelle avec pulsation douce ou fixe quand « Effets visuels doux » est coché.
- Conserver le joystick inférieur, le calcul PT-026, le gain PT-028, le second doigt (rotation et chute x10), lasers, scores/HOF, sauvegardes, compatibilité APK et visuels originaux.
- Prototype exclusivement `feature/lunar-four-fronts-ghostmoon-029`, version Android d'essai **0.2.16** (versionCode 27) ; design et tests : `design/PT-029-lune-fantome.md` et `tests/pt029-ghost-moon.test.cjs`. Essai ergonomique réel à valider avant merge. **Aucun merge main ni publication de production sans validation explicite de Fab.**
- **Validation technique :** [GitHub Actions #40017033820](https://github.com/greenpower2669/PartouTetris/actions/runs/40017033820) **SUCCESS** : tous les tests Node, compilation Gradle et publication de l'APK réussis. Fichier téléchargeable directement : `temp/PartouTetris-v0.2.16-ghostmoon-debug.apk` (8 821 068 octets, SHA blob Git `dc54f2c8127ec018568674e3bd9306d7020d3fcb`). Vérification ergonomique sur le téléphone de Fab **encore à réaliser**, sans fusion sur `main`.

## PT-030 — Anti-exploit bonus de vitesse réellement gagné pendant le vol (23/10/2026)
- Fab a détecté qu'un joueur pouvait **augmenter la vitesse juste avant la pose**, faisant appliquer à la pièce entière le multiplicateur au carré instantané. Il faut chronométrer chaque pièce **depuis sa création dans l'espace jusqu'à son verrouillage**, mesurer la durée de jeu actif et calculer le bonus sur sa **vitesse moyenne réelle de parcours** par rapport à une référence de même distance au rythme initial 8 s/étage. Une pose plus haute doit utiliser une référence adaptée, sans simuler de trajet jusqu'au sol.
- Conserver le carré du différentiel positif de vitesse, plafond ×100, et **interdire tout recours au curseur de vitesse instantanée pour le paiement**. Chute volontaire ×10 toujours possible : elle ne récompense que le temps réellement gagné. Les couronnes utilisent aussi le multiplicateur acquis par les pièces qui les déclenchent (minimum en cas de plusieurs arrivées simultanées), pas la gravité recalculée après nettoyage de couronne.
- Utiliser `game.seconds` (temps de jeu actif hors pause), avec `spawnedAtSeconds` par pièce, sérialisé dans le checkpoint local ; **compatibilité des sauvegardes v1** garanties, y compris anciennes pièces sans horodatage (multiplieur prudent ×1 au prochain placement). Garder scores déjà gagnés, pseudo, HOF local/mondial.
- **Ne rien changer d'autre** : géométrie de guidage tangent, Lune fantôme, vecteurs néon, laser, contrôles 2 mains, difficultés, couronnes, bruitages et tous les assets précédents. Travail exclusivement en `feature/lunar-four-fronts-score-flight-030`, sans fusion sur main ni publication définitive.
- Prompt complet de passation : `design/PT-030-anti-exploit-score-vol.md`. Tests automatisés `tests/pt030-flight-score.test.cjs` ; APK d'essai `0.2.17` à valider sur Samsung.
- **Portée de l'anti-triche :** correction du calcul honnête de l'APK ; elle ne remplace pas une validation serveur cryptographiquement fondée contre des clients modifiés. Aucun ancien score HOF ne doit être altéré.
- **Livraison vérifiée :** [GitHub Actions #40019418828](https://github.com/greenpower2669/PartouTetris/actions/runs/40019418828) SUCCESS (tests Node, compilation Gradle et publication APK brute). APK directement téléchargeable : `temp/PartouTetris-v0.2.17-scoreflight-debug.apk` (8 822 160 octets ; SHA de blob Git `4a95b732721cf653532485c437459859bb9485d8`). Compatibilité des anciens checkpoints testée, et tests de non-exploitation du changement tardif de vitesse réussis ; validation tactile sur Samsung et contrôle HOF réel restent à faire.

## PT-031 — Centre projeté mobile pour Lune fantôme 360° (23/10/2026)
- Après essai PT-030 sur Samsung, Fab confirme que tangente, largeur latérale, joystick et grands vecteurs néon sont satisfaisants. Un défaut de lisibilité subsiste : le **centre de la Lune fantomatique reste figé au début d'une prise** alors que le doigt et la pièce changent de place. En passant du haut vers le bas, l'affichage montre un faux centre de rotation.
- **Correction visuelle exclusivement.** Pendant la prise, calculer la cible `A=C+λ(F−C)`, où C est le centre réel de la Lune et F la position actuelle du doigt ; `λ=clamp(1−58/|F−C|,0.12,0.94)` garantit que A reste strictement entre C et F. Lisser uniquement λ sur la durée (tau ~90 ms), et **reprojeter A sur le segment C→F actuel à chaque image** pour éviter les pivots figés et les centres hors du segment en diagonale. Recalculer une nouvelle ancre quand la prise change.
- Arc fantôme orienté par l'angle réel de la pièce sur 48 secteurs, sans servir à déplacer celle-ci ; le repère circulaire et le pivot suivent la main sans modifier la géométrie de commande. Vecteurs néon, joystick inférieur, effets doux, transparences légères et rendu derrière les blocs conservés. La projection tactile de `tangent-control.js` reste inchangée.
- Libérer immédiatement le centre virtuel lors des reset de prise (relâchement, annulation, pause, laser, changement de mode, affichage du Hall, réglages, fin de jeu, perte de focus), y compris lorsqu'Android réutilise un identifiant de pointeur.
- Préserver **intégralement** scores anti-exploit PT-030, jeu, Hall of Fame, sauvegardes, musique, deux mains, chute ×10 et lasers. Tester les 48 secteurs, tour 360° et franchissement 47/0, geste haut→bas, diagonales, doigt immobile, re-prise, visibilité des briques.
- Branche dédiée `feature/lunar-four-fronts-anchor-031` issue de `feature/lunar-four-fronts-score-flight-030`, APK debug cible **0.2.18 / versionCode 29**. Passation détaillée `design/PT-031-centre-virtuel-mobile.md`, tests `tests/pt031-mobile-anchor.test.cjs`. **Aucun merge ni Release/Play sans validation explicite de Fab** ; essai réel sur Samsung SM-A576B Android 16 encore requis.
- **Résultat PT-031 :** [GitHub Actions #40020943067](https://github.com/greenpower2669/PartouTetris/actions/runs/40020943067) **SUCCESS** (tous les tests Node, compilation Gradle, publication brute). APK : `temp/PartouTetris-v0.2.18-anchor-debug.apk` (8 822 924 octets ; blob Git SHA `28e0aeb0379541650c6da11372749a30d3f6e556`). Validation ergonomique avec le doigt sur Samsung encore à effectuer. `main` inchangée.

## PT-032 — Le repère est la projection de pose, pas la pièce en vol (23/10/2026)
- Fab : à haute vitesse, l'œil suit la **pièce transparente à l'endroit où elle va effectivement atterrir**, pas la pièce qui tombe. La sélection tactile reste sur la vraie pièce ; **après prise**, le centre de guidage et la référence géométrique doivent se situer sur **sa future silhouette au sol**.
- Reprendre la projection `game.ghost(piece)` et les quatre cases `cellsOf(piece,p.angle,landingRadius,p.rot)` utilisées par le moteur / rendu, en déduire le centroïde 2D des cellules à leurs angles et couronnes réels. Toujours moyenner les positions cartésiennes, jamais les numéros de secteur (continuité 47/0).
- Centre de la Lune fantôme PT-031 : glissement mobile sur le segment **projection de pose → doigt actuel**, sans cacher les blocs, sans figer le point, avec le même lissage de proportion. La projection mise à jour en temps réel suit les changements de direction, rotation, blocage et niveau de pose.
- Joystick du bas marqué « POSE », axes et flèches néon alignés sur le secteur du point futur (identique à l'orientation tangentielle du moteur) ; discret cercle cyan sur le centroïde de destination. Conserver intégralement l'ergonomie tangentielle, sensibilité latérale, score anti-exploit PT-030, quatre fronts, laser, chute ×10, second doigt, Hall of Fame, sauvegardes, audio, assets. Pas de déplacement parasite dû à un centre graphique qui bouge.
- Branche expérimentale `feature/lunar-four-fronts-landing-032` issue de PT-031 ; tests `tests/pt032-landing-reference.test.cjs`, conception et passation `design/PT-032-repere-pose-projetee.md`. APK debug cible **0.2.19 / versionCode 30** et tests Android SM-A576B. **Ne pas fusionner `main` ni publier de Release/Play avant validation de Fab.**
- **Livraison technique PT-032 :** [GitHub Actions #40027048778](https://github.com/greenpower2669/PartouTetris/actions/runs/40027048778) **SUCCESS** : tests Node, compilation Gradle et publication de l'APK brute. APK directement accessible `temp/PartouTetris-v0.2.19-landing-debug.apk` (8 824 797 octets ; blob Git SHA `235342119f4154769f674e9a854872e86049cc52`). **Test ergonomique réel Samsung à réaliser** ; ne pas merger `main` sans validation de Fab.


## PT-034 — Malus de destruction vitesse² et modération des scores (24/10/2026)
- **Demande de Fab :** « ajouter un carré de vitesse au malus de destruction de pièces pour dissuader plus la destruction facile et aussi faire moins de points car ça s'envole trop ».
- **Calcul destructeur :** coût PT-018 par hauteur × (8 secondes / intervalle de gravité permanent actuel)², arrondi au point. Exemples sans couronne : à 8 s ×1, à 4 s ×4, à 2 s ×16. Les couronnes accélèrent la gravité, donc aussi le malus. La chute tactile temporaire ×10 n'accélère pas ce coût.
- **Modération des nouveaux gains :** poses et couronnes payées à 65 % des gains anciens, bonus de vol réel plafonné à ×10 au lieu de ×100, tout en conservant le carré du différentiel en dessous du plafond ; ponts/géodésie affichés avec la même modération. Les scores déjà gagnés, sessions et records du Hall of Fame ne sont jamais recalculés.
- Aucun changement de la sélection visuelle : PT-033 reste une mission distincte, préparée et en attente d'ordre de code. Tactile, lasers, sauvegardes, progression, classement, audio et assets préservés.
- Branche : `feature/lunar-four-fronts-score-balance-034`, créée depuis PT-032 ; cible debug 0.2.20 / versionCode 31. Ajouter des tests de calcul et un APK brut téléchargeable. **Ne jamais fusionner `main` sans validation explicite de Fab.**
- Statut : GitHub Actions #40085127619 **SUCCESS** : 206 tests Node réussis, Gradle et APK brute v0.2.20 construite et publiée (8 825 021 octets). **Essai réel Samsung restant à effectuer**, aucune validation tactile présumée.


## PT-035 — Tangente locale au niveau de la Lune projetée (24/10/2026)
- **Ordre explicite de Fab :** « Maintenant c'est la tangentielle qui devrait être au niveau de la lune. Pièce projetée et doigt. » puis « Tu peux coder louloute ».
- Fab estime que le positionnement de la petite Lune fantôme PT-032 est bon ; il demande que la **lecture de la tangente** apparaisse au niveau de **cette Lune projetée**, en relation avec la projection de pose et le doigt. Ne pas déplacer la vraie pièce en modifiant uniquement la lecture visuelle.
- **Implémentation :** `tangent-landing-guide.js` calcule une tangente au centre mobile `ghostMoonGuide.anchor` avec `target.angle`, commune à `joystick-guide.js` et `tangent-control.js`. Deux traits fins translucides relient la projection de pose au pivot, puis celui-ci au doigt réel. La tangente cyan est courte, symétrique, peu opaque, avec flèches et point pivot creux ; dessinée derrière les pièces. Pulsation désactivée ou stabilisée en mode visuel doux.
- **Intégration :** `index.html` l'affiche seulement pendant une prise valide, dans la zone lunaire, en mode tangentiel, hors pause/laser/réglages/fin ; recalcul à chaque frame après le repositionnement PT-032 de la lune fantôme. Flèches bleues autour du doigt, joystick pédagogique inférieur et repère de la pose conservés.
- **Non-régression :** `tangent-control.js`, `touch.js`, `engine.js`, sauvegardes, anti-exploit PT-030, score modéré PT-034, Hall of Fame, laser, chute ×10 et audio inchangés par PT-035. La correction visuelle distincte PT-033 (cercle jaune / pulsation de la pièce) n'est pas incluse.
- **Branche :** `feature/lunar-four-fronts-tangent-035` issue de PT-034 pour garder les correctifs de score ; version debug `0.2.21`, versionCode 32 ; tests `tests/pt035-local-tangent.test.cjs`. Pas de fusion `main` ou publication Release/Play sans validation explicite de Fab.
- **Livraison technique validée :** [GitHub Actions #40087650577](https://github.com/greenpower2669/PartouTetris/actions/runs/40087650577) **SUCCESS** (213 tests Node, zéro échec, build Gradle). APK debug brute 0.2.21 disponible sous `temp/PartouTetris-v0.2.21-tangent-debug.apk` (8 826 914 octets, SHA Git blob `a6c44cac5c97316fb4924db71b3b24ad7c214359`). **Essai perceptif réel Fab/Samsung toujours à faire.**


## PT-033 — Sélection et projection lumineuses, sans anneaux (24/10/2026)
- Ordre de Fab après capture annotée : retirer les cercles qui occultent la pièce sélectionnée et sa pose projetée ; les remplacer par une aura discrète et une modulation douce de luminance.
- Développement réalisé **après** PT-035 sur `feature/lunar-four-fronts-glow-033` issue de `feature/lunar-four-fronts-tangent-035`, pour conserver la tangente projetée PT-035 et les scores PT-034.
- `index.html` : suppression du dessin de l'anneau jaune de sélection ; suppression de l'appel au cercle cyan de pose ; halo coloré et modulation de luminance directement sur les cellules de la pièce active et de la projection. Animation stabilisée en mode « effets visuels doux », aucune forme géométrique opaque ajoutée.
- Contrôles, mouvement tangent, lune fantôme, guidage doigt, laser, sauvegarde, score PT-034, HOF et sons inchangés. Version debug 0.2.22 / versionCode 33 ; tests `tests/pt033-selection-glow.test.cjs`.
- Livraison CI #40106508588 **SUCCESS** : 217 tests Node sans échec, compilation Gradle, APK directe `temp/PartouTetris-v0.2.22-glow-debug.apk` vérifiée (8 827 066 octets). **Essai visuel Samsung restant.** Aucun merge `main` sans validation explicite de Fab.


## PT-036 — Aura réellement irradiante sur minos sélectionnés (24/10/2026)
- Retour d'essai Fab PT-033 : l'éclairage et les variations ne se voient pas assez. Il faut une luminosité variable irradiant autour de la forme de la pièce tenue **et** de sa projection, sans remettre de cercles.
- Branche `feature/lunar-four-fronts-irradiant-036` issue de PT-033/PT-035/PT-034.
- Correction dans `visuals.js` : nouvelles passes de lumière en composition `screen`, avec flou lumineux variable et rehausse cyan/blanc directement sur chaque cellule et son contour. L'aura suit la géométrie réelle des quatre minos, jamais un marqueur circulaire. `index.html` donne à la vraie pièce et à sa projection la même respiration lente plus contrastée, sans déformer la forme ; effet fixe en mode visuel doux.
- Éviter tout changement de commande, HOF, scores, audio et sauvegardes. Android 0.2.23 / versionCode 34, tests PT-036, APK brute CI ; aucun merge main sans accord de Fab.
- Statut : attente du résultat CI et de validation visuelle sur Samsung.


## PT-037 — Aura bicolore alternée et intensité visible (24/10/2026)
- **Retour Fab :** le bloc PT-036 paraît lumineux, mais aucune variation perceptible d'intensité, pas de bascule bicolore et aura extérieure absente. Corriger et consigner dans Git.
- Branche `feature/lunar-four-fronts-bicolor-aura-037` créée depuis PT-036. `visuals.js` : aura de forme cellulaire par traits diffus larges (non circulaires), composition lumineuse, alternance interpolée cyan/or, énergie modulant l'épaisseur et l'opacité. `index.html` : phase de couleur et respiration synchronisées sur la pièce choisie et sa projection. Mode « effets doux » fixe pour limiter le scintillement.
- Aucun changement gameplay, scores PT-034, repère tangent PT-035, sauvegarde, Hall of Fame ni musique ; `main` préservée. APK cible 0.2.24 debug directe ; validation visuelle Samsung indispensable.


## PT-038 — Énergie spatiale, embrasement laser et animation renforcée (24/10/2026)
- Fab demande de prolonger l'aura de sélection bicolore cyan/or dans l'espace avant parachute, d'augmenter l'animation et qu'un tir laser sur un bloc sous parachute l'enflamme et accélère sa chute.
- Branche expérimentale `feature/lunar-four-fronts-wow-038` issue de PT-037, conservation PT-034/035/037.
- `index.html` affiche la respiration énergétique en espace sur la pièce sélectionnée ; une pièce lunaire frappée au laser peut être embrasée, perdre temporairement son voile, produire une traînée enflammée et afficher un événement HUD.
- `engine.js` : `ignite(lane)` limite la combustion à une pièce entrée dans la zone lunaire ; accélération ×3 durant 4 secondes actives, distincte de la commande chute ×10, état remis à zéro à la prochaine apparition.
- Effets de feu et halos procéduraux, sans fichiers sonores externes ; conserver collisions, sauvegardes, Hall of Fame, scores, tangente, musique et sécurité du laser. Version d'essai 0.2.25. Aucun merge `main` sans consentement.
- Vérifier CI et essai réel sur Samsung : intensité en espace, explosion visuelle et récupération normale après 4 s.


## PT-039 — Événements défense terrestre et panneau d'aide compact (24/10/2026)
- **Ordre de Fab :** ajouter aléatoirement un nouveau bloc différent de la pièce du jeu, arrivant **vers la Terre** ; il peut exploser spontanément ou être détruit automatiquement par les satellites laser. Si Fab tire lui-même dessus au laser, accorder un **bonus de points basé sur la vitesse permanente²**. Sur les deux captures, réduire le grand panneau d'aide inférieur et réagencer ses textes sans perdre les contrôles ni le joystick « POSE ».
- Branche d'essai dédiée `feature/lunar-four-fronts-earth-events-039`, issue de PT-038 pour préserver l'aura spatiale bicolore PT-037, la tangente PT-035, les scores PT-034 et le laser incendiaire PT-038.
- Nouveau module autonome `app/src/main/assets/earth-events.js` : sept silhouettes de tétraminos et couleurs variées, aucune silhouette identique sur deux apparitions consécutives, événement unique à la fois, trajet depuis un côté de l'écran vers la surface haute de la Terre, arrivée après 9 à 14 s, puis espacements aléatoires de 17 à 29 s, durée de trajet 5,5 à 7,5 s. Fin sans intervention : tir automatique satellite (65 %) ou explosion spontanée (35 %). Effets traînée, impact, éclats, faisceau satellite ; aucune collision avec le plateau ni modification des quatre pièces actives.
- Tir utilisateur : mode LASER, toucher visuellement le bloc événementiel mobile (tolérance 30 px), priorité de détection avant les briques fixées ; un seul tir rémunéré par cible, pas de bonus automatique. `game.award(...,'earth-defense')` : `120 × min(25,(8 / game.fallInterval())²)` points, arrondi ; chute tactile temporaire ×10 exclue ; gains inscrits dans le score local et les événements normaux, sessions anciennes inchangées. Retours son, vibration et message de bonus dans HUD.
- Fenêtre d'aide : `joystick-guide.css` réduit la réservation ancienne de 136 px à 84 px (max 98 px) et le guide de 121 px à 75 px, dimension adaptative petit écran ; textes des gestes raccourcis sur deux colonnes, bouton LASER conservé en troisième colonne. Le nouvel espace libéré profite au jeu et à la Terre. Accessibilité, tactile et taille des boutons principaux préservés.
- **Livraison technique :** version 0.2.26 / versionCode 37, `tests/pt039-earth-events.test.cjs`, [CI #40119045022](https://github.com/greenpower2669/PartouTetris/actions/runs/40119045022) **SUCCESS** (232 tests Node sur 232, Gradle Android). APK brute `temp/PartouTetris-v0.2.26-earth-events-debug.apk` publiée et vérifiée (8 831 682 octets). Aucune fusion sur `main`. Les effets et la disposition finale nécessitent encore essai sur Samsung SM-A576B Android 16.


## PT-040 — Traînée incandescente particulaire, sans tige (24/10/2026)
- **Retour direct Fab après essai PT-039 :** la ligne rigide fixée au mini-bloc événementiel descendant vers la Terre ressemble à une tige colorée, peu naturelle. Fab valide son remplacement par une vraie **queue de particules incandescentes** : points chauds discontinus, plus chauds près de l'objet, plus orangés et atténués à distance, traînée alignée avec la trajectoire réelle, non avec la rotation arbitraire du bloc. Ordre explicite : « Code ça sur mon git ».
- Branche dédiée `feature/lunar-four-fronts-particle-tail-040` issue de PT-039, `main` préservée. `earth-events.js` : suppression totale du segment dessiné par `moveTo(-9,14)` / `lineTo(-24-p.t*10,36)`. Nouveau `EarthEvents.trailParticles()` : 27 petits points maximum (8 en mode visuel doux), positionnés à partir des positions passées du mobile sur la courbe de déplacement, léger éparpillement déterministe perpendiculaire, dégradé couleur bloc → blanc chaud → jaune → orange → braise, transparence et diamètre décroissants. Composition additive Canvas `lighter`, flou léger à l'échelle de chaque particule, sans ruban ni trait fixe.
- La longueur de la queue varie modérément selon le facteur de gravité **permanent** `Math.max(1,8/game.fallInterval())`, borné ; jamais selon la chute manuelle ×10. Toutes les particules sont purement graphiques, calculées avec `game.seconds` pour rester immobiles durant une pause. Chaque forme, bonus vitesse², interception laser, explosions satellites, gameplay et sauvegardes PT-039 restent inchangés.
- Tests `tests/pt040-particle-tail.test.cjs` : absence de tige, suivis de trajectoire / rotation, gradient incandescent, dissipation, vitesse, accessibilité douce et appels Canvas non-régression ; ajustement de l'espion Canvas de PT-039 pour supporter le remplissage des particules. **Livraison CI #40122239539 SUCCESS** : 239 tests, zéro échec, build Gradle réussi, APK debug brute 0.2.27 (versionCode 38) disponible dans `temp/` (8 832 546 octets). Aucun merge `main`. Essai esthétique réel sur Samsung toujours à faire.


## PT-041 — Tri-laser avant explosion, popups BD et banque de mots (24/10/2026)
- **Ordre explicite de Fab :** « Ok, code tout sur le git ». Référence : maquette BD validée ; très nombreux libellés français alternés sur tout événement rapportant / retirant des points, bonus de vitesse présenté par petites phases de 40 % qui grossissent puis s'effacent, et **3 satellites** tirant ensemble **avant** l'explosion de la cible Terre lorsque le joueur active le laser.
- Branche dédiée `feature/lunar-four-fronts-comic-feedback-041` issue de PT-040 pour conserver PT-034 (score équilibré), PT-035 (tangente), PT-037 (aura), PT-038 (incendie), PT-039 (défense terrestre et panneau compact) et PT-040 (traînée incandescente). Aucun merge `main`.
- `earth-events.js` : `hit` **verrouille** la cible et renvoie `earth-locked`, la laisse visible. L'état transitoire `pending` dure **320 ms de temps de jeu** ; trois faisceaux cyan/blanc à cœur brillant partent **simultanément** des trois coordonnées réelles renvoyées par `art.satellites()` et convergent vers le bloc mémorisé. Aucun deuxième tir accepté durant l'attente. `tick()` déclenche seulement ensuite `earth-impact` : suppression du bloc, explosion, et `bonus` calculé et figé au verrouillage. Le score est ajouté **une seule fois au moment de l'impact**, via `game.award(...,'earth-defense')`, et non au clic. En pause, la séquence se fige. Interception automatique et explosion spontanée restent indépendantes de cette salve joueur.
- Nouveau `comic-feedback.js` : banque de formulations françaises (défense, pose, couronne, pont, malus, palier, gain générique et vitesse), en-têtes variés, sélection excluant les deux dernières phrases par catégorie ; `ComicFeedback` sérialise les annonces issues des **événements réels** `points` et `destroy`, en file bornée. Un malus affiche la **perte réellement débitée** `charged`, jamais la pénalité théorique si le score est insuffisant. Les gains et les points effectifs sont ceux du moteur, inchangé.
- `comic-feedback.css` : cartouches BD légers et temporaires, alternance bleu/or (gains) et rouge (malus), entrée légèrement agrandie, disparition, sous-formulations et valeur chiffrée. Le panneau est `pointer-events:none`, compact, positionné sous le HUD / près du bord supérieur du plateau. Accessibilité `aria-live` et respect `prefers-reduced-motion` / option effets doux ; la pause suspend les animations et la chronologie du commentaire.
- Bonus vitesse : uniquement quand le **multiplicateur réellement gagné** dépasse ×1 ; différence affichée en pourcentage réel. Jusqu'à trois bulles incrémentales `+40 %`, complément éventuel et **pourcentage TOTAL** explicite si le bonus dépasse trois phases, pour éviter vingt-deux bulles simultanées. Le plafond du gain Terre ×25 correspond au maximum réel `+2400 % TOTAL`. Ce sont des **effets de lecture**, sans nouveau crédit de points ni changement de vitesse.
- Tests : `tests/pt041-comic-volley.test.cjs` vérifie ordre de salve/impact, 3 faisceaux, 320 ms, bloc toujours affiché avant impact, récompense unique, banque sans répétition immédiate, gains/malus exacts, vitesse 40 %, file bornée, pause, HTML/CSS. Tests historiques PT-039/040 adaptés au gain désormais appliqué à l'impact. **Livraison confirmée :** GitHub Actions #40129936727 **SUCCESS** (248/248 tests, aucun échec, build Gradle). APK directe v0.2.28/versionCode 39 dans `temp/PartouTetris-v0.2.28-comic-trilaser-debug.apk`, 8 839 507 octets, SHA blob `c14bb0b38393ae94ba5238a12358b5e4a67fc406`. Aucun merge `main` ni livraison Release sans Fab. Une vérification visuelle/tactile sur Samsung reste nécessaire.


## PT-042 — Bulles BD en bas, fonds translucides, cadres hiérarchisés (24/10/2026)
- **Retour visuel de Fab après PT-041 :** sur capture Samsung, le cartouche de score BD est encore trop haut et opaque, masquant les blocs proches du centre lunaire. Fab demande de déplacer toutes les bulles **en bas**, immédiatement **au-dessus des commandes**, avec une texture semi-transparente et des cadres variés selon l'importance ; « en zigzag si alerte ou waouh, si normal alors lisse ». L'ordre « Ok code » autorise cette mission.
- Branche isolée `feature/lunar-four-fronts-bottom-comics-042`, fondée sur PT-041 ; toutes les logiques gameplay, les 3 lasers et les bonus restent intacts ; `main` préservée.
- `index.html` : `#comicFeed` transféré du haut de page vers **le début de `#controlDeck`**, avant l'aide tactile et les boutons. Suppression du placement dynamique calculé par `--comic-top`. Cette implantation DOM est un **ancrage direct** au deck, non un calcul de taille d'écran : elle suit automatiquement les hauteurs variables du tutoriel/joystick et la zone de sécurité Android.
- `comic-feedback.css` : `#comicFeed` en `position:absolute;bottom:calc(100% + 8px)` : cartouches près du bas, transparents (`rgba(...,.49-.70)`), petits, lisibles, `pointer-events:none`, non intrusifs ; normal `comic-smooth` = rectangle arrondi régulier ; événements forts `comic-burst` = contour en zigzag polygonal façon BD avec intérieur transparent. Couleurs distinctes positives / alerte / malus, élargissement léger uniquement lors de l'apparition, petites pastilles de vitesse PT-041 conservées ; variantes responsive petite hauteur/petit écran et mode « effets doux » conservés.
- `comic-feedback.js` : le **type de cadre** est déterminé par la nature des données, pas par un mot choisi aléatoirement. Priorité forte pour interception Terre, couronne, pont, malus, palier, combo ×2+ et gain exceptionnel à partir de 1 500 pts ; priorité faible et bord lisse pour les poses ordinaires. Les données de score et le texte d'origine ne changent pas.
- Tests `tests/pt042-bottom-comics.test.cjs` : contrôle d'ancrage réel, transparence, formes selon priorité, rendu DOM, montants exacts, conservation tri-laser, banque de phrases, phases +40 % et modes doux. **Livraison GitHub Actions #40133532082 SUCCESS : 254/254 tests Node, zéro échec, compilation Gradle.** Version Android debug 0.2.29 / versionCode 40 ; APK brute directe `temp/PartouTetris-v0.2.29-bottom-comics-debug.apk` vérifiée (8 840 047 octets). Aucune fusion `main`. Essai tactile et visuel sur Samsung nécessaire.


## PT-043 — Bulles BD recentrées, micro-punch et pluie de blocs vers la Terre (25/10/2026)
- **Ordre explicite Fab :** « Ok code tout ». Reprendre la passation PT-043 : recentrage horizontal en bas, apparition avec agrandissement très bref puis retour rapide à la taille normale, fond plus transparent ; parfois une pluie de 3 à 6 blocs vers la Terre pour rythmer le jeu, avec satellites, lasers, explosions et bonus joueur préservés.
- Branche dédiée `feature/lunar-four-fronts-comic-meteor-shower-043` issue de PT-042, préservant PT-034 à PT-042, sans fusion `main`.
- `comic-feedback.css` : cartouche `#comicFeed` ancré au même bas de l'écran/au-dessus du deck de commandes (`bottom:calc(100% + 8px)`), **centré par `left:50%;transform:translateX(-50%)`**, quel que soit le type/malus ; taille plafonnée responsive. Fond normal bleu opacité .43→.31, malus rouge .45→.33, texte/cadre contrastés. `comicPunch` monte brièvement à **×1,10** en lisse ou **×1,24** en zigzag dès le premier quart de 360 ms puis revient à **×1** dans la même animation ; la popup reste lisible et s'efface. Respect du mode effets doux et `prefers-reduced-motion`.
- `comic-feedback.js` : nouvelle banque `meteor` d'une douzaine d'alertes à formulations anti-répétition, popup BD prioritaire en zigzag **sans faux points** (« DÉFENSE TERRE »). Durée de lecture alignée sur le nouveau zoom ; la banque initiale, score exact et les vrais bonus vitesse PT-041 restent intacts. Les alertes météo de débris sont placées devant la file d'annonces ordinaires, sans couper l'annonce déjà en lecture.
- Nouveau `earth-shower.js` : classe `MeteorShower` indépendante. Première pluie après **45 à 90 s de temps de jeu**, puis intervalle **45 à 90 s après la fin d'une pluie**. Chaque pluie déclenche **3 à 6 mini-blocs** de formes et couleurs variées, sans même forme consécutive, départs décalés **0,45 à 0,69 s**, durées propres **3,7 à 4,6 s** ; les événements simples PT-039 restent actifs en parallèle. Limite **six cibles** et **162 particules** (48 en effets doux). Les objets sont de petites instances `EarthEvents` à collisions strictement indépendantes de la grille et des 4 pièces jouables.
- Chaque mini-bloc peut exploser ou être abattu automatiquement par les satellites comme PT-039. Le joueur peut viser chaque cible en mode LASER : le gestionnaire choisit la plus proche de son toucher, gèle sa position, laisse agir les **trois lasers synchronisés 320 ms avant l'impact**, puis résout et attribue **une seule prime vitesse permanente²** à cette cible. Un seul verrouillage manuel simultané, également coordonné avec le bloc simple ; les auto-interceptions ne rapportent rien. Bonus anti-inflation PT-039 inchangés, aucune pluie à dégâts/pénalités supplémentaires. Les effets et annonces cessent de progresser en pause, suivent le temps de jeu.
- Intégration `index.html` : reset à la nouvelle partie, `tick` combiné, message d'alerte à l'apparition, `draw` des plusieurs mini-blocs, `hit` pluie prioritaire avant bloc simple et bloc fixé, sans toucher aux commandes du jeu. Tests `tests/pt043-comics-shower.test.cjs`, version Android 0.2.30 / versionCode 41. **Livraison vérifiée GitHub Actions #40142339981 SUCCESS : 262/262 tests Node (0 échec), build Gradle Android réussi et APK brute** `temp/PartouTetris-v0.2.30-meteor-shower-debug.apk` publiée (8 842 555 octets, SHA Git `39a67c0f26d49502a7d537781f34b9d3c65eca3f`). Aucun merge `main` sans validation. Test réel Samsung nécessaire.


## PT-044 — Remplacer le titre par l'image officielle dorée et lunaire (25/10/2026)
- **Demande explicite Fab :** « Ha change le titre avec celui-là » avec nouvelle image PNG transparente (nom source : `25517.png`) montrant PARTOUTETRIS en lettres dorées, un A pyramidal, une Lune O bleue lumineuse. Conserver **exactement son visuel**, sans recomposer le mot en polices CSS.
- Branche de travail `feature/lunar-four-fronts-title-image-044` issue de `releases` (PT-043), **main intouchée**.
- L'image source RGBA 2172 × 724 possédait une grande marge alpha, rognée au contenu effectif (seuil alpha >2), puis optimisée avec transparence en `app/src/main/assets/partout-title-044.avif` (700 × 105 px ; 12 013 octets). Le JPEG opaque et l'ancien dessin CSS ne remplacent jamais le visuel utilisateur.
- `index.html` conserve le mot `PARTOUTETRIS` de secours et insère `<img id="brandWordmarkImage" class="brand-wordmark-image" src="partout-title-044.avif" alt="PartouTetris">`. Dès chargement validé (`naturalWidth>0`), la nouvelle image apparaît et masque l'ancien titre CSS. Sur une WebView sans AVIF, l'ancien titre CSS reste lisible (fallback), sans crash.
- `title-pt044.css` ajuste le bandeau supérieur responsive, logo centré en `object-fit:contain` sans recadrage/distorsion, transparence préservée, non interactif ; variantes pour faible largeur et faible hauteur. Aucune modification du calcul des points, du joystick, des pluies PT-043, des sauvegardes ni du Hall of Fame.
- Tests `tests/pt044-official-title.test.cjs` vérifient le fichier image local, sa signature AVIF, les chemins, le secours de compatibilité et le dimensionnement ; livraison Android cible v0.2.31/versionCode 42 et APK directe `temp/PartouTetris-v0.2.31-official-title-debug.apk`. Valider GitHub Actions, puis possibilité de fusion dans `releases`, **jamais dans main** sans autorisation.

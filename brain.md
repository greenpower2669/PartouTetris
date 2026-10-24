# Contrat de gameplay — PartouTetris 0.2.0 (base 0.1.9 préservée)
- Monde égyptien futuriste : sauver la Terre en supprimant des anneaux de débris sur la Lune.
- Four fronts : quatre pièces simultanées; les trois autres continuent quand l'une est manipulée.
- Jeu logique : 48 secteurs continus modulo 48, 10 couronnes radiales, 7 tétriminos, rotations par pas de 90°, tangentiel, chute au centre, collisions, silhouette fantôme.
- Couronne remplie à 360° : suppression, glissement radial des couronnes extérieures vers le centre, score/combo.
- Accélération progressive lente : défaut 5 s/étage, réglage 2–8 s, progression toutes les 150 s ou via les couronnes. Pause, fin par débordement.
- État réel : première implémentation jouable en HTML Canvas embarquée dans une WebView Android sans Internet. Graphismes vectoriels de prototype ; musique électronique originale et FX synthétisés en WebAudio après geste utilisateur, volumes distincts, mute. Pas encore de sprites 3D ni de médias externes.
- Distinguer moteur testé avec Node et interface tactile à valider sur le téléphone.

- Interaction PT-004 : contact primaire maintenu = prise et glissement tangentiel ; tap rapide secondaire (autre doigt) = rotation de 90° de la pièce tenue ; relâchement du primaire = fin de prise et de chute accélérée. Pas de rotation sur simple relâchement du doigt primaire. Le bouton de rotation reste disponible.

- PT-005 : les pièces actives sont non solides entre elles en l'air. canPlace() ne consulte que la grille verrouillée ; lock() résout le placement final vers l'extérieur si un autre bloc a été posé simultanément, puis game-over si aucun logement orbital valide.
- PT-006 : décor lunaire procédural hors ligne (cratères, texture, pyramides), Terre lointaine, panneaux dorés, blocs à reflets et voiles solaires ; pas encore de textures 3D importées.

- PT-007 : verrouillage portrait Android (manifest + Activity), plateau calculé entre HUD et dock inférieur via layout.js. Pyramides déplacées près du titre, effacées de la surface lunaire ; quatre chutes conservées.

- PT-008 : award centralise vrais points et franchissements de 1000. +40 par verrouillage réussi ; gain couronne 480*n²*niveau + 100 par combo répété ; aucune récompense sur game-over.
- Festival : couronne simple bulles et 5 projecteurs ; double couronne boule à facettes et bulles ; paliers 1000 feux pendant au plus 5,6s et mini-fanfare WebAudio. Gains de pose flottants sans scène envahissante ; effets doux enregistrés et overlay transparent aux touches.

- NOM OFFICIEL : PartouTetris ; ancien dépôt PartouTeris renommé. Package interne com.greenpower2669.partouteris maintenu afin de préserver record et réglages Android.
- PT-009 : proximité du centre = base 40 + arrondi((9 - moyenne des rayons des 4 cellules) × 12). Contacts distincts avec cellules verrouillées préexistantes sur voisins polaires → 2 cases : ×2, 3 : ×3, etc., x1 pour 0 ou 1. Gain évalué avant l'écriture des blocs.
- Deuxième doigt : appui long stable 420ms = accélération de la pièce tenue, relâchement = retour normal ; tap court garde rotation à 90°. Le déplacement radial du premier doigt reste disponible.
- Terre agrandie avec position réservée sous Lune ; célébrations Block Boost réorientées de la Terre vers l'orbite ; animations douces et cinq boutons maintenus.

- PT-010 : HUD score géant sur toute la largeur, local top 3 sous le score, bonus de pose dans la bande libre sous la Lune. Pseudo modifiable localement (16 caractères), protection contre HTML et remplacement du seul meilleur record par top 10 local sans perte de l'ancien score.
- PT-010 : blocs entrants possèdent traînées de flammes dessinées en Canvas, purement visuelles ; mode Laser explicite : tap sur une pièce → rayon Terre-pièce, rotation 90° et recul tangentiel opposé au côté visé si libre. Collisions solides inchangées ; gestes droit/gauche restent actifs hors mode laser.
- Le package et les anciennes clés localStorage doivent rester inchangés pour éviter une perte de progression.

- PT-011 : icône fournie par Fab (PT doré + éléments pharaoniques, futuristes) intégrée dans drawable-nodpi/icon.webp et assets/brand-icon.webp sans réinterprétation graphique. La Lune ne contient aucune pyramide ; elles n'existent que dans l'identité visuelle.
- Débris : 4 étapes spatiales à l'extérieur des 10 anneaux (SPACES_STEPS 4), cellules visibles au-delà de la zone occupable, flammes spatiales, zéro parachute dans gameplay.
- Défense : satellites terrestres distincts au nombre de trois près de la Terre ; trois faisceaux convergent vers la pièce ciblée lors du tir laser. Garder l'effet et la collision précédente.

- PT-012 : deux phases strictes. r ≥ RINGS (10) = espace avec flammes, aucun parachute. r dans [0,9] = petite voile de stabilisation semi-transparente, simple dessin derrière la pièce, sans physique. Aucun parachute n'affecte la gravité.
- Direction esthétique définie par l'icône officielle PT et l'illustration des Pharaonites : or et cyan, anneaux lumineux, satellites **pyramidaux** avec noyau cyan, Terre orbitale. La Lune reste naturelle et sans pyramides.

- PT-013 / 0.2.0 : référence visuelle canonique copiée sans altération dans `design/charte-officielle.png`, rendu toujours dynamique Canvas et DOM indépendant, panneaux/titre or et cyan renforcés, aides gestes main droite (maintenir/guider) + main gauche (tap 90°, maintien boost). Laser multi-émetteurs accompagné d'une charge Canvas.
- Musique officielle MP3 locale, boucle HTMLAudioElement après interaction, niveau *0,58 du volume musique réglé ; thème WebAudio original strictement secours sans superposition. FX laser synthétique à phases courtes. Audio Djipie privé non copié sans licences individuelles vérifiées.

- PT-013 après lecture de la charte : Terre monumentale texturée une fois (480×480), satellites alignés sur horizon gauche/centre/droite, titre doré centré et dock de cinq boutons avec laser séparé.

- PT-014 (v0.2.1) : toute annonce de gain ou de couronne/palier est restreinte au panneau supérieur des scores. `pointFeed` dans l'entête du classement, `scoreAnnouncement` par-dessus la seule ligne du podium pendant la scène. Aucun texte de score dans la surface lunaire, même lors des milestones, de doubles couronnes ou d'événements simultanés. Grand score, classements, bonus et effets sonores intacts. Musique officielle boucle avec `HTMLAudioElement.loop=true` ; continuité acoustique à valider sur Samsung.

- PT-015 : libellé « MEILLEUR SCORE DE PHARAONITE » et pseudo par défaut « Tous3nKamion » modifiable. Migration à la lecture de l'ancienne valeur par défaut « PHARAON » sans modifier les lignes de records du classement ni les noms personnalisés.

- PT-016 : la bannière devient une composition **HTML/CSS/DOM vivant**, pas une image. `hud-pt016.css` ajoute tétriminos CSS néon, titre métal or, O = mini-lune CSS, cadre techno cyan et or, score courant brillant, meilleure valeur Pharaonite cyan, rangées top3 et pseudo inchangés. `mountMoonWordmark()` conserve libellé accessible ; `updateHud()` actualise `#bestScoreValue`. Portrait borné par `computePortraitLayout()`.

- PT-017 : accélération authentique ×10 après 420 ms deuxième doigt (ou bouton CHUTE), boucle de transitions de rayon multi-étapes (max huit/frame) compatible FPS/higher levels. Espace rallongé 5 marches à facteur de durée .82, rotation seule / pas de glissement. Arrivée graphique via `arrival.js` depuis le haut de la Terre jusqu'aux quatre portes lunaire et `Artist.spacePiece()`. Rayon/collisions toujours pilotés par `Game`.

- PT-018 : Terre animée avec nuages blancs semi-transparents, trois cyclones procéduraux et rotation apparente, satellites vivants (mouvements orbitaux de faible amplitude, propulsion pulsée). Laser 1,3s en mode LASER sur brique verrouillée détruit exactement une cellule, pénalité hauteur 80 × (r+1) × ceil((r+1)/2) sans score négatif ni record affecté. Annulation tactile; ancien tir bref sur pièce active maintenu.

- PT-019 : laser de correction au toucher sur case verrouillée. Ciblage magnétique, maintien automatique de la visée 1,3 s et barre de progression dans le HUD. Une case retirée avec coût de points suivant la hauteur ; records et tirs brefs conservés.

- PT-020 (0.2.7) : couleur stable selon la forme et non le front : I cyan, O jaune, L orange, J bleu, Z rouge, S vert, T violet. boardTypes conserve le type après verrouillage et suppression des couronnes. Tirage global de 7 sans remise. Journal de chaque pose avec chiralité, orientation, front et compte des L/J/S/Z dans Logcat PartouChirality. Collisions inchangées.

- PT-021 : la prise au premier doigt ne commande **jamais** la chute ×10, même si l'utilisateur rapproche le doigt du centre ou traverse un autre quartier. Second doigt stable ≥420 ms, bouton CHUTE et touche clavier explicites uniquement. Boost par source et front initial via `BoostSources`, annulation lors d'un glissement du second doigt, pause, changement de mode et perte de focus. Traces Android `PartouTouch` pour ON/OFF et front.

- PT-022 : le mot-symbole conserve le O lunaire et remplace le A par une pyramide égyptienne dorée sculptée en CSS, nom accessible « PARTOUTETRIS ». `session.js` persiste automatiquement toutes les ~850ms l'intégralité du moteur (grilles board/boardTypes, 4 pièces, angles, rotations, chutes, score, combo, niveau, temps, 7-bag, statistiques), puis sur pagehide / Android onPause. À la réouverture un bouton REPRENDRE restaure la partie **en pause jusqu'au geste de l'utilisateur** et un bouton NOUVELLE PARTIE efface l'ancien checkpoint. Aucun boost ni événement audio/tactile périmé n'est restauré. Records et pseudo inchangés.

- PT-023 : au vrai redémarrage si checkpoint local valide, fenêtre « Voulez-vous continuer là où vous en étiez ? » ; OUI restaure et reprend, NON mène à la deuxième confirmation « Vous êtes sûr ? ». Seule l'acceptation finale du remplacement efface la session ; « Garder ma partie » annule l'abandon. Hall of Fame séparé **top 10 local** consultable depuis Réglages et game over, jamais dans l'accueil. Bouton de premier jeu « ▶ JOUER », audio selon préférences sans message technique. Version test 0.2.10.

- PT-024 : stratégie avant vitesse. Partie neuve à 8s/étage ; temps seul n'accélère jamais. Chaque couronne supprimée réduit l'attente ×0,92 (minimum 0,8s) ; niveau = 1+nombre de couronnes. Score basé sur nombre de cellules de pièce (10 points par cellule), profondeur lunaire, voisins déjà fixés, variation de longueur² des chaînes contiguës circulaires 360°, Pont Royal lorsqu'une pose relie deux anciennes chaînes, prime Géodésie au passage de frontière de quartier. Multiplicateur des points par carré de différence des vitesses relatives (plafond x100), indépendant de CHUTE x10. Records/musique/sauvegardes inchangés. PT-024 validée CI #39938398035, essai utilisateur à venir.

- PT-025 : Hall de Fame local et mondial sur le modèle de GeckoDoku / SpaceFortressVs. Historique complet de scores locaux avec ID de session, Top10 maintenu, pseudo Tous3nKamion inchangé, file d'envoi hors-ligne et cache mondial. Boutons Local / Mondial / Historique, statut réseau. Route serveur PartouTetris encore à créer ou vérifier : ne jamais afficher d'anciens scores locaux comme mondiaux.

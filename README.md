# 🌙 PartouTetris — Les Pharaons de la Lune

## Prototype Android 0.2.10 — PT-014 : annonces hors plateau, musique officielle

**Branche :** `feature/lunar-four-fronts-001` — `main` conservée intacte.

### 📲 APK Android direct (sans ZIP)

**[Télécharger PartouTetris-v0.2.10-debug.apk](https://raw.githubusercontent.com/greenpower2669/PartouTetris/feature/lunar-four-fronts-001/temp/PartouTetris-v0.2.10-debug.apk)**

APK debug compilé par [GitHub Actions](https://github.com/greenpower2669/PartouTetris/actions), directement installable sur Android ; AAB de publication seulement après validation de Fab.

### Visuels et règles

La charte graphique déposée par Fab sur `main` est copiée à l'identique dans `design/charte-officielle.png`. Miniature pour contrôle : `design/charte-apercu.jpg`.

Rendu dynamique Canvas et DOM : titre doré, score géant, couronnes cyan/or, Lune géologique sans pyramides, quatre fronts et débris incandescents venant de l'espace, voiles légères seulement en zone lunaire, grande Terre texturée en bas, trois satellites pyramidaux, lasers convergents, cinq boutons en bas et icône officielle. La fidélité finale à la charte est **encore à valider à l'écran**.

Gestes préservés : main droite maintenue pour attraper et déplacer ; main gauche tap bref pour rotation 90°, appui long pour descente accélérée. Mode Laser et commandes alternatives maintenus. Gameplay, collisions aériennes non bloquantes, scores, couronnes 360°, records, pseudo et paramètres conservés.

### Audio

Musique officielle fournie dans `main`, copiée octet par octet dans `app/src/main/assets/official-theme.mp3`. Lecture après interaction, volume indépendant/mute sauvegardés, répétition en boucle, secours musical synthétique WebAudio sans superposition. Laser synthétique multi-phase (activation, plasma, départ, impact).

Catalogue Djipie consulté : aucun son privé recopié dans le dépôt public faute de droits de redistribution vérifiés par ressource.

### Tests et validation

Tests Node : `node --test tests/*.test.cjs`. Compilation APK : `gradle :app:assembleDebug`. Workflow `.github/workflows/android-debug.yml` ; apk brute en `temp/`.

À vérifier réellement sur **Samsung SM-A576B, Android 16** : fidélité du visuel, rendu du plateau, performance de la Terre précalculée, multitouch, volume et écoute complète de la musique, éventuel raccord audible de boucle, laser et vibrations.

Package interne `com.greenpower2669.partouteris` inchangé pour préserver les sauvegardes. Pas de Release ni fusion vers `main` sans autorisation de Fab.

### PT-014 — Annonces de score
Les messages « 20 000 POINTS ! », couronnes et combos apparaissent dans le panneau des scores supérieur, sur le podium temporairement remplacé, tandis que le petit gain se positionne à côté de « MEILLEURS SCORES ». Aucun texte de points sur la Lune, ni au bas des anneaux. La musique MP3 locale reste en boucle et les préférences existantes sont conservées.

### PT-015 — Pseudo Tous3nKamion
Le titre du classement est désormais « MEILLEUR SCORE DE PHARAONITE ». Le pseudo par défaut « Tous3nKamion » (Toutânkhamon) reste modifiable dans Réglages. Les anciens scores et autres pseudos ne changent pas ; seule l'ancienne valeur de défaut « PHARAON » est remplacée à la lecture.

### PT-016 — Bannière futuriste vivante
Le bandeau supérieur est entièrement codé en CSS/DOM : tétriminos lumineux, titre doré avec O lunaire cyan, châssis sci-fi néon et meilleure marque de Pharaonite cyan. Ce n'est **pas** une capture ni une texture statique : score, record, pseudo, annonces et podium se mettent à jour en jeu. Module : `app/src/main/assets/hud-pt016.css`. Aucun changement du gameplay, des commandes ou de la musique.

### PT-017 — Contrôle Tetris ×10 et approche des quatre fronts
Un appui long (420 ms) avec le second doigt ou le bouton « ⇣ ×10 » accélère réellement la chute par dix, y compris si plusieurs rangs sont parcourus entre deux frames. Un tap court continue à pivoter. En espace, les pièces descendent de la direction visuelle de la Terre vers chaque porte lunaire en **cinq** étapes ; leur rotation est possible mais la translation attend l'entrée dans le plateau. Le score, la musique, le pseudo et la sauvegarde existants sont conservés.

### PT-018 — Nuages et cyclones, laser de démolition
La Terre s'anime par rotation apparente et nuages blancs translucides mobiles, avec cyclones stylisés ; les trois satellites-pharaons bougent et pulsent. Mode LASER : appui **1,3 seconde** sur une brique déjà posée pour la détruire et payer un malus de plus en plus fort suivant sa hauteur ; viser brièvement une pièce en vol garde la rotation originale. Le classement/record sauvegardé n'est pas débité et le score ne devient jamais négatif.

### PT-019 : Corriger une erreur avec le laser

Active ⚡ LASER puis touche une brique déjà posée. Le laser cible la brique pendant 1,3 seconde, même si tu retires ton doigt. La barre en haut indique la charge. À la fin, une seule brique est retirée avec une pénalité de points adaptée à sa hauteur. Toucher hors cible annule. Le classement, les sauvegardes et le mode tir bref sur pièces volantes sont inchangés.

### PT-020 — Couleurs et chiralités
Les couleurs suivent maintenant la forme : I cyan, O jaune, L orange, J bleu, S vert, Z rouge, T violet. Le bloc garde sa couleur après la pose. Le tirage est équilibré par sacs de 7 pièces. Chaque pose produit une trace `[PT020][POSE]` avec les compteurs L/J/S/Z, front, rotation et couleur, visible dans Android Logcat sous `PartouChirality`. Tests et APK debug 0.2.10 : Actions #39742860690.

### PT-021 — Descente rapide uniquement sur commande consciente
Le premier doigt sert exclusivement à saisir et guider une pièce, même si sa trajectoire se rapproche du centre ou traverse d'autres quartiers. La descente ×10 ne s'active que lorsque le deuxième doigt est maintenu immobile au moins 420 ms, ou par la commande CHUTE ×10. Si ce deuxième doigt glisse, l'accélération s'arrête ; relâcher CHUTE arrête le front sur lequel elle avait commencé, même après changement de sélection. La touche clavier ↓ fonctionne avec la même sécurité. Les transitions ON/OFF et leur source sont enregistrées dans Logcat : `PartouTouch`.

Tests et compilation : [GitHub Actions #39749278236](https://github.com/greenpower2669/PartouTetris/actions/runs/39749278236) — succès. APK directe [PartouTetris-v0.2.10-debug.apk](https://raw.githubusercontent.com/greenpower2669/PartouTetris/feature/lunar-four-fronts-001/temp/PartouTetris-v0.2.10-debug.apk). Essai tactile réel Samsung encore requis.

### PT-022 — Pyramide du titre et reprise de partie
Le **A** du logo PARTOUTETRIS est une pyramide dorée dessinée en CSS ; la Lune bleue reste le « O ». L'application sauvegarde automatiquement sa partie complète sur le téléphone, environ toutes les 850 ms ainsi qu'à la mise en veille ou à la sortie. Au lancement suivant, « ▶ REPRENDRE LA PARTIE » recharge les blocs, les quatre pièces, la progression, le score, les combos et le tirage des sept formes. Choisir « Nouvelle partie » efface uniquement cette session, jamais les records ni les préférences. Le moteur attend le toucher de reprise pour respecter l'activation du son sur Android.

Tests automatisés et build Android : [Actions #39760329152](https://github.com/greenpower2669/PartouTetris/actions/runs/39760329152), réussis. APK directe [PartouTetris-v0.2.10-debug.apk](https://raw.githubusercontent.com/greenpower2669/PartouTetris/feature/lunar-four-fronts-001/temp/PartouTetris-v0.2.10-debug.apk). Test réel de fermeture/réouverture Samsung encore à faire.

### PT-023 — Choix de reprise, double confirmation et Hall of Fame local
Au démarrage suivant une **fermeture complète**, si une session sauvegardée existe, une fenêtre demande « Voulez-vous continuer là où vous en étiez ? ». **Oui** reprend la partie ; **Non** ouvre « Vous êtes sûr ? » avec le choix de revenir ou de confirmer une nouvelle partie. Le checkpoint n'est pas détruit au premier Non.

Les dix meilleurs scores locaux sont affichés dans un **Hall of Fame** accessible dans les Réglages ou sur l'écran de fin. Les records restent sur cet appareil. L'écran de lancement ordinaire affiche désormais simplement **▶ JOUER**, sans message technique concernant le démarrage du son. Les préférences audio restent conservées.

[GitHub Actions #39763997838](https://github.com/greenpower2669/PartouTetris/actions/runs/39763997838) : tests et compilation réussis. APK directe [PartouTetris-v0.2.10-debug.apk](https://raw.githubusercontent.com/greenpower2669/PartouTetris/feature/lunar-four-fronts-001/temp/PartouTetris-v0.2.10-debug.apk). Test tactile de fermeture/réouverture réelle sur Samsung à réaliser.

### PT-024 — Vitesse gagnée aux couronnes et score de construction stratégique (0.2.11)
Chaque nouvelle partie démarre au maximum de patience, 8 secondes par étage. La vitesse ne progresse plus avec le temps : une couronne retirée réduit l'attente par un facteur 0,92 et déverrouille un nouveau niveau. Les joueurs peuvent ajuster manuellement la vitesse dans Réglages.
Les points prennent en compte les cellules de la pièce, la proximité avec la Lune et les contacts anciens. Pour les chaînes d'une même couronne, le gain est calculé sur la variation des longueurs au carré (L_final² moins somme L_ancien²), avec continuité à 360° entre secteurs 47 et 0. Réunir deux constructions génère le Pont des Pharaons ; le passage d'une frontière de quartier accorde un bonus de Géodésie. Le multiplicateur de difficulté suit le carré du différentiel de vitesse relative : 1+(max(0,8/secondesEtage-1))², plafonné ×100 ; le bouton CHUTE ×10 ne modifie pas ce score de difficulté. Les sauvegardes d'anciennes sessions sont conservées et migrées sans effacer le plateau.
CI et test Android compilé : https://github.com/greenpower2669/PartouTetris/actions/runs/39938398035 ; APK non compressée : https://raw.githubusercontent.com/greenpower2669/PartouTetris/feature/lunar-four-fronts-001/temp/PartouTetris-v0.2.11-debug.apk

### PT-025 — Hall of Fame local et mondial
Top10 local et historique de toutes les parties avec pseudo ; les anciennes performances sont conservées. Un identifiant unique est attribué à chaque partie terminée. Le système prépare aussi les scores à transmettre au serveur Hall of Fame partagé de SpaceFortressVs / GeckoDoku, avec reprise après perte réseau et cache de consultation. L'onglet Mondial n'affiche que les résultats confirmés par le serveur et signale son indisponibilité en cas d'absence de route. IMPORTANT : gameId partoutetris doit encore être vérifié ou provisionné côté serveur commun avant de considérer la synchronisation mondiale opérationnelle. Aucune clé privée n'est intégrée à l'APK.

### PT-025 — Version Android 0.2.12 de test
APK directe : https://raw.githubusercontent.com/greenpower2669/PartouTetris/feature/lunar-four-fronts-001/temp/PartouTetris-v0.2.12-debug.apk

Tests Node, Gradle et capture Chromium : https://github.com/greenpower2669/PartouTetris/actions/runs/39946832870 — succès.

À tester : jeu terminé → score local conservé ; Hall depuis Réglages → Local Top10, historique et Mondial ; sans réseau, scores en attente ; après retour réseau, distinguer un vrai accusé du serveur d'une absence de route PartouTetris. Sans provisionnement du gameId, la partie Mondial reste techniquement préparée mais non opérationnelle.

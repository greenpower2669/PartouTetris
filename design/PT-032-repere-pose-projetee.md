# PASSATION PT-032 — Piloter mentalement la pièce à son emplacement de pose

**Date : 23 octobre 2026**  
**Dépôt :** `greenpower2669/PartouTetris`  
**Branche :** `feature/lunar-four-fronts-landing-032` issue de `feature/lunar-four-fronts-anchor-031`  
**Cible APK :** 0.2.19 (versionCode 30)

## Idée de Fab — impératif
À vitesse importante, le cerveau se focalise sur **la projection à la surface de la Lune**, là où la pièce sera réellement déposée. **La pièce visible en vol doit toujours être touchée pour la sélectionner**, mais après cette prise les repères doivent considérer **la future silhouette de pose** comme l'objet manipulé. Il ne s'agit pas d'accrocher le doigt à la silhouette fantôme ni de téléporter la pièce.

## Solution technique limitée
- Utiliser la **même prévision `game.ghost(piece)` et les mêmes `cellsOf(...)`** que la projection de pose déjà dessinée par `pieces()`, en tenant compte de la forme, de la rotation, du secteur et du plateau occupé.
- Calculer le **centroïde à l'écran des quatre cellules prévisionnelles** à partir de leur véritable centre d'anneau `inner + (ring + .5)*stepR` et de secteur `-π/2 + (sector+.5)*2π/48`. Ne pas moyenner les numéros de secteur (risque de rupture 47→0).
- Pendant la prise, **le centre virtuel de la Lune fantôme PT-031 est reprojeté sur l'axe segment reliant cette destination prévue et la position réelle du doigt**, avec le même lissage de proportion λ. Ce repère suit les changements de destination dus aux déplacements, rotations ou nouveaux obstacles, même si la pièce est encore loin en altitude.
- Conserver la **tangente par secteur du moteur** (la projection latérale confirmée par Fab), les gains et la commande incrémentale. L'angle prévisionnel reste celui de la pièce ; seul le rayon de référence de l'observateur devient la distance au point d'atterrissage, qui ne change pas la sensibilité.
- Orienter le joystick inférieur et les deux flèches néon avec l'angle correspondant à la destination (identique au secteur de commande) ; indiquer « POSE » dans le joystick pour lever l'ambiguïté.
- Un petit cercle cyan très translucide pointe le **centroïde du futur emplacement**, derrière les vrais blocs et les projections ; aucun masque opaque et aucune interception du toucher.
- Dans l'espace, conserver l'interdiction de mouvement latéral et l'indication « ESPACE · GUIDAGE APRÈS L’APPROCHE » ; ne pas modifier le gameplay.
- Si la projection n'est pas disponible (jeu terminé, données invalides, etc.), conserver le comportement de secours sans inventer de coordonnées.

## Contraintes de non-régression
Garder intégralement : moteur des collisions, vitesse/score anti-exploit PT-030, timer par pièce et anciennes sauvegardes, Lune fantôme ultra discrète, joystick, vecteurs néon, amplitude PT-028, laser, rotation au second doigt, chute x10, Hall of Fame, sons, graphismes et pauses.

## Validation exigée
1. Prise d'une pièce éloignée de la surface : le repère pointe déjà sur le lieu de pose, et **ne migre pas artificiellement avec l'altitude** si la destination reste identique.
2. Déplacement tangentiel : la prévision de pose se décale, le guide la suit ; aucune inversion et aucune sensibilité changeante.
3. Rotation de la pièce : silhouette prévisionnelle mise à jour, sans toucher la commande validée.
4. Un bloc est posé sous la pièce : nouveau niveau de pose prévu ; le repère est recalculé.
5. Franchissement 47/0 : centroïde circulaire continu ; pas de saut de 180°.
6. Relâchement / reprise, pause, réglages, laser et fin de partie : pas de repère fantôme actif sans prise.
7. L'interface reste lisible sur Samsung SM-A576B Android 16.

**Ne pas fusionner vers `main` sans la validation expresse de Fab. Aucune Release de production ni publication Play.**

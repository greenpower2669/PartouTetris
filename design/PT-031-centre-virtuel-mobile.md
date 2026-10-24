# PT-031 — Passation : correction du centre de rotation fantôme mobile

**Date :** 23 octobre 2026  
**Statut :** mission codée sur branche de test, approbation ergonomique encore attendue  
**Dépôt :** `greenpower2669/PartouTetris`  
**Origine :** `feature/lunar-four-fronts-score-flight-030`  
**Branche de réalisation :** `feature/lunar-four-fronts-anchor-031`

## Constat utilisateur, après captures du téléphone
La projection tangentielle PT-026, l'amplitude homogène PT-028, les flèches néon et le joystick inférieur sont désormais jugés bons par Fab. La Lune fantomatique PT-029 a révélé un autre problème : son **centre était figé au premier point d'ancrage**. Lors d'une prise en haut suivie d'un geste descendant puis d'un tour de la Lune, le repère circulaire reste à son ancien emplacement pendant que le doigt et la pièce changent de côté. Cela fausse la perception du tour complet malgré une tangente correcte.

## Contrainte fondamentale
**Ne pas modifier la physique, l'angle des pièces, leur vitesse, la projection tactile, la sensibilité, les points, le bonus PT-030, ni les fonctions de sauvegarde/HOF.** La mission concerne exclusivement un repère *visuel*.

## Géométrie adoptée pour l'expérience
- C = centre réel de la Lune, lu du layout Android.
- F = point actuel du doigt principal, issu de `hands.grip.lastX/lastY`.
- A = centre de la petite Lune fantôme.
- Le centre **A** appartient strictement au segment C→F, et sa position évolue continuellement :
  `A = C + λ(F−C)`, avec `0 < λ < 1`.
- La cible est `λ_cible = clamp(1 - Rfantôme/|F−C|, 0.12, 0.94)` pour `Rfantôme=58px`. Elle tend à placer le centre à 58 px derrière le doigt dans la direction de la Lune, sans sortir du segment en cas de prise rapprochée.
- Au début de prise, λ adopte la cible immédiatement. Ensuite, il est interpolé doucement au fil des images (`1−exp(−dt/90 ms)` avec dt borné à 64 ms). **Seul le scalaire λ est lissé** ; A est recalculé sur le *segment actuel* C→F. Cela garantit que le centre reste entre la vraie Lune et le doigt, y compris lorsque celui-ci décrit une diagonale ou un tour complet.
- L'arc de la couronne fantôme suit l'angle réel de la pièce, dont la tangente locale reste calculée exclusivement à partir de son secteur. **Le centre A n'est pas utilisé par la commande `projectDrag`** et ne crée aucun déplacement lorsque le doigt est immobile. Lors des prises décalées, l'arc représente une orientation tangentielle pédagogique et pas une tangente géométrique au point exact du doigt.
- Une prise terminée, annulée ou perdue libère λ et le pointeur. Nouveau premier doigt ou autre front = nouvel ancrage.
- La Lune fantôme garde la même **transparence extrême** que PT-029, reste sous les pièces et ne capture aucune interaction. Joystick inférieur, grands vecteurs néon et option « Effets visuels doux » inchangés.

## Cas de test / validation
1. Prendre une pièce en haut puis descendre : le centre fantôme descend lui aussi et reste côté doigt par rapport au centre lunaire.
2. Décrire le tour complet autour de C en 48 secteurs : continuité sans saut à 0/47.
3. Glisser en diagonale : A suit le segment couramment défini sans téléportation.
4. Garder le doigt immobile et faire évoluer l'orientation de la pièce : A reste immobile, tandis que l'arc tourne selon la pièce; aucun changement de direction du moteur.
5. Relâcher puis reprendre : le nouveau repère correspond à la nouvelle prise, même si Android réutilise l'identifiant de pointeur.
6. Pause, réglages, LASER, hors zone lunaire, fin de partie : repère absent et ancre libérée.
7. Le calcul du score PT-030 et la compatibilité des sauvegardes historiques sont inchangés.

## Livraison
- Modifier seulement `app/src/main/assets/ghost-moon-guide.js` et le passage du centre réel + temps d'animation depuis `index.html`.
- Adapter les anciens tests qui vérifiaient explicitement l'ancrage figé, et ajouter `tests/pt031-mobile-anchor.test.cjs`.
- Lancer les tests Node + Gradle dans GitHub Actions, et publier une APK brute test **0.2.18 / versionCode 29**.
- Faire valider visuellement par Fab sur son Samsung SM-A576B Android 16.
- **NE PAS merger sur `main` ni publier une Release/Play sans approbation de Fab.**

Le fait que l'ancrage apparaisse plus intuitif doit être confirmé en situation : les tests géométriques ne prouvent pas le ressenti humain.

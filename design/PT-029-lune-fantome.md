# PT-029 — Lune fantôme à 360° et vecteurs néon allongés

**Demande de Fab : 23 octobre 2026. Statut : prototype sur branche de test.**

## Diagnostic utilisateur
Les commandes tangentielle et la représentation d'amplitude uniformisée PT-028 se comportent bien, selon les essais sur téléphone. Les hésitations restantes lors d'un mouvement circulaire complet sont liées au **repérage visuel du mouvement**, et non à une correction de l'algorithme de projection. Ne PAS changer la formule tangentielle, le gain, les couronnes ou les gestes.

## Repère lunaire fantomatique
- Pendant une prise de pièce (premier doigt, mode tangentiel expérimental, pièce en zone lunaire), dessiner un **petit disque lunaire translucide** de 58 px de rayon, sous les pièces et leurs effets.
- Projeté au premier point de contact sur l'axe opposé à la direction centre de Lune → pièce : `centreFantôme = doigtInitial - rayonFantôme * radial(angleInitial)`. Le doigt se trouve initialement sur la bordure du cercle.
- **Le centre visuel reste stable jusqu'au relâchement** (même si le doigt se décale) : cela donne un repère clair pour comprendre le virage complet. Le léger arc mis en valeur suit la position angulaire réelle de la pièce le long du cercle. Le repère est un guide pédagogique local, pas un autre objet physique ni le centre du moteur; il ne modifie aucun calcul de déplacement.
- Style extrêmement discret : remplissage alpha 0,032, cercle alpha 0,15, cratères alpha 0,095, arc local alpha 0,27, centre très discret. Tout reste visible à travers, notamment les blocs et éléments urgents. Aucune interaction tactile, aucune zone capturant le toucher, aucun son ni vibration supplémentaires.
- Libérer l'ancre au relâchement, annulation, perte de focus, pause, fin de partie, activation LASER, ouverture de réglages ou passage au mode ancien. La rotation d'une pièce ne redéfinit pas brusquement le pivot. Aucun mouvement automatique de jeu.

## Deux vecteurs cyan néon
- Garder les **deux flèches opposées autour du doigt de prise**, alignées sur la tangente dynamique, mais augmenter le dégagement : départ à 30 px du doigt au lieu de 20, longueur animée 24–42 px au lieu de 13–25.
- Transparence visuelle alpha 0,58 avec contour bleu-cyan et halo néon doux; conserver le style et les animations existants. En mode « Effets visuels doux », longueur fixe, pas de pulsation.
- Joystick inférieur normalisé PT-028 inchangé, tout comme la logique tangentielle PT-026, second doigt rotation/chute ×10, LASER, Hall of Fame, sauvegardes, paramètres, musique, et jeu historique.

## Implémentation
- Branche **`feature/lunar-four-fronts-ghostmoon-029`**, dérivée de `feature/lunar-four-fronts-amplitude-028`.
- `app/src/main/assets/ghost-moon-guide.js` : géométrie indépendante et rendu Canvas sous les pièces, classe `GhostMoonGuide` qui conserve l'ancrage pour la durée de la prise.
- `grip-vectors.js` : flèches plus longues, translucides, néon.
- `index.html` : branchement du rendu, nettoyage du pointeur.
- `tests/pt029-ghost-moon.test.cjs` : cohérence géométrique 48 secteurs, ancrage stable, lisibilité, aucune nouvelle action sur le moteur.
- Android debug **0.2.16 / versionCode 27** ; les vrais tests tactiles sur Samsung SM-A576B Android 16 restent nécessaires.

**Interdictions :** aucune modification de `main`, aucun merge, aucun déploiement Play ni Release sans validation de Fab.

# PT-028 — Amplitude uniforme et deux vecteurs de guidage autour du doigt

**Demande de Fab, 23 octobre 2026, après essai en captures PT-027.**

## Ce que les captures révèlent
Le rail affiché horizontalement est plus long que le rail vertical sur les côtés, non parce que la Lune rétrécit mais parce que la représentation raccourcit volontairement la longueur verticale à 31 unités. À taille angulaire lunaire comparable, cet écart ne doit plus exister.

## Contrat
- Conserver le joystick pédagogique fixé dans le bandeau inférieur et visible uniquement pendant la prise.
- Donner à son rail une **longueur géométrique constante de 104 unités SVG**, sur 48 secteurs, y compris diagonales et côtés. Centre de la représentation à (105,60), demi-longueur 52. Augmenter **modérément et constamment** la hauteur du bandeau pour contenir l'orientation verticale sans chevauchement et sans saut lors du toucher.
- Ne pas modifier artificiellement la sensibilité selon les secteurs : `tangent-control.js` utilise déjà le produit scalaire sur une tangente **unitaire** et un rayon de commande fixé par la largeur d'écran. Ainsi, **24 px glissés sur la tangente correspondent au même Δsecteur partout**. La limite physique des bords de l'écran n'est pas complètement résolue par ce changement ; ne pas prétendre le contraire.
- Ajouter au niveau du **doigt qui tient la pièce** deux petits vecteurs cyan opposés, pulsants en longueur entre 13 et 25 pixels, séparés du doigt par 20 px, alignés sur la tangente actuelle du morceau : ils tournent continuellement avec le morceau. Les flèches ne créent aucune commande ni interception tactile.
- Les vecteurs sont dessinés par-dessus le plateau dans le Canvas existant, sans modification de la physique, des positions, des scores ou des sauvegardes. Ils n'apparaissent que lors d'une prise en mode tangentiel, sur une pièce dans la zone lunaire, et disparaissent après relâchement, annulation, pause, laser, ouverture des réglages ou partie terminée.
- Respecter l'option `Effets visuels doux` : sans pulsation lorsque l'option est active. Conserver les commandes de rotation du second doigt, chute x10, laser, Hall of Fame et tous les visuels existants.
- Ne pas fusionner `main` ni publier Play / Release définitive sans validation de Fab.

## Fichiers
- `app/src/main/assets/joystick-guide.js` et `joystick-guide.css` : rail normalisé
- `app/src/main/assets/grip-vectors.js` : géométrie/dessin des 2 flèches autour du doigt
- `app/src/main/assets/index.html` : SVG et branchement non interactif
- `tests/pt028-amplitude-vectors.test.cjs` : longueur du rail, 48 angles, précision angulaire constante, deux flèches et motion reduction
- `tests/pt027-joystick-guide.test.cjs` : adaptation des assertions au nouveau repère

## Essai humain
Comparer PT-027 et PT-028 dans le même mode tangentiel : déplacements haut, bas, côtés, diagonales, même distance de doigt le long de l'axe, ré-agrippement, rotation du deuxième doigt, laser et sauvegarde. Noter si l'amplitude réelle reste pénible près des bords ; si oui, expérimenter une stratégie de reprise du doigt ou d'amplification adaptée **sur une mission ultérieure** sans sacrifier la finesse.

**Version de test :** 0.2.15 (Android versionCode 26), branche `feature/lunar-four-fronts-amplitude-028`.

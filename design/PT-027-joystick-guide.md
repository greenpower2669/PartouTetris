# PT-027 — Joystick pédagogique tangentiel (prototype)

**Date : 23 octobre 2026. Statut : à tester sur Samsung SM-A576B Android 16.**

## Constat de Fab
Le geste de PT-026 suit la tangente, mais il n'est pas toujours intuitif lors des transitions de la droite/gauche vers le haut/bas. Il faut montrer **où déplacer le doigt**, pas ajouter une seconde commande qui prendrait le contrôle du jeu.

## Contrat de l'expérience
- Un mini-joystick **visuel seulement**, fixé dans le bandeau de commandes **en bas** (il remplace temporairement les deux phrases d'aide, ne touche pas au bouton LASER), avec des contrastes cyan/or lisibles.
- Apparaît **uniquement pendant une prise effective du premier doigt** et uniquement si le guidage tangentiel expérimental PT-026 est activé.
- Un rail à deux flèches pivote suivant la **tangente de la pièce réellement sélectionnée** : en haut/bas horizontal, sur les côtés vertical, en diagonale oblique, **sans saut de quadrant**.
- Un **doigt fantôme cyan** oscille doucement sur ce rail et enseigne le geste. Un **marqueur doré** reflète la dernière composante tangentielle réelle du doigt.
- Le repère est actualisé à chaque image, y compris quand la pièce se déplace pendant la prise. Lorsque l'objet approche depuis l'espace, le libellé annonce que le guidage devient effectif une fois entré dans les couronnes.
- Disparaît au relâchement/cancel du doigt principal, à la pause, au changement vers LASER, dans les Réglages, en fin de partie, sur perte du focus et dans le mode tactile classique.
- **Strictement non interactif** : aucun pointer-handler ni translation moteur créée par le dessin. Les trois actions existantes, second doigt tap = rotation et second doigt maintien = chute ×10, laser, Hall of Fame, sauvegardes, audio, et moteur restent conservés.
- Animation désactivée lorsque « Effets visuels doux » est coché (repère statique, axe toujours suivi).
- Réserve une petite hauteur stable dans le bandeau bas pour éviter les variations de mise en page lors d'une prise.

## Réalisation
Branche exclusivement de test : `feature/lunar-four-fronts-guide-027`, descendante de `feature/lunar-four-fronts-tangent-026`. Sources `joystick-guide.js`, `joystick-guide.css` et liaison `index.html`. Tests automatisés `tests/pt027-joystick-guide.test.cjs`.

**Validation humaine obligatoire :** comparer PT-026 puis PT-027 sur le téléphone ; essayer le haut, le bas, les côtés et les diagonales ; vérifier que le guide correspond au geste réellement efficace, reste lisible au-dessous de la Lune, ne masque pas le laser et s'efface après un relâchement, une pause ou une rotation. Ne pas confondre test visuel et preuve de correction complète de la trajectoire.

**Interdit :** aucun merge sur `main`, aucune release définitive ou publication Play sans accord de Fab.

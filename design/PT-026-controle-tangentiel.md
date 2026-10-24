# PT-026 — Contrôle tangentiel à observateur virtuel projeté

**Statut : prototype expérimental sur branche dédiée, sans fusion main.**

## Géométrie
- C = centre visuel de la Lune ; P = position de la pièce ; r = rayon apparent de l'orbite de cette pièce.
- u = (P-C)/r, avec le secteur 0 en haut et les secteurs croissant dans le sens horaire.
- Observateur virtuel O = C - 2,5 r u, donc prolongement *opposé* à la pièce, au-delà du centre de la Lune.
- Tangente unitaire t = (-u_y, u_x), orientée dans le sens des secteurs croissants.
- Chaque geste est évalué dans **un seul repère** : ancienne et nouvelle positions du doigt, F0 et F1, sont projetées relativement au même observateur virtuel courant.

```text
projeté = dot(F1-O, t) - dot(F0-O, t)
        = dot(F1-F0, t)
Δ secteurs = projeté / R_contrôle × (48 / 2π) × gain(vitesse)
```

Point mathématique crucial : **la simple translation de O le long de C-P s'annule dans la différence**. Elle ne suffit donc pas, à elle seule, à éviter les inversions. L'amélioration vient du calcul incrémental du geste sur la tangente **de la pièce**, et non d'un angle absolu mesuré depuis la Lune ou depuis le doigt. L'ancrage virtuel suit le secteur courant progressivement ; on ne recalcule jamais un « nouvel angle cible » absolu à partir du doigt, et un doigt immobile n'entraîne aucun mouvement.

## Précision et comportement
- R_contrôle = borne de 0,22 × largeur CSS de l'écran entre 54 et 96 pixels ; rayon de commande indépendant de la hauteur lunaire et de la distance doigt/pièce.
- Gain continu 0,82 à 1,37 selon la vitesse (85 à 935 px/s), sans accélération inertielle après relâchement.
- Accumulation sous-secteur, déplacements entiers envoyés au moteur existant par `shift()` ; collisions et interdiction de translation avant la zone lunaire restent inchangées.
- Haut : glisser à droite -> déplacement visuel à droite. Bas : glisser à droite -> déplacement visuel à droite via secteur décroissant. Côtés : haut-bas. Diagonales : orientation tangentielle continue.
- Reprise depuis la dernière position tactile à chaque événement ; aucun bond dû au déplacement de l'observateur, ni recentrage demandé. La limite de déplacements par événement évite les sauts anormaux.
- Main droite : prise/déplacement. Tap bref deuxième doigt : rotation. Maintien délibéré deuxième doigt : accélération ×10. Tir laser, sauvegardes, HOF et ancien contrôle inchangés.

## Expérimentation
Dans Réglages : cocher « Guidage tangentiel projeté (essai) » (actif par défaut sur cette branche). Décocher pour restaurer **immédiatement** l'ancien guidage angulaire, sans toucher aux données personnelles.

### Tests demandés sur SM-A576B Android 16
1. Déplacer une pièce au-dessus, au-dessous, à gauche et à droite de la Lune ; vérifier que le sens visible du déplacement suit le doigt.
2. Glisser dans les diagonales, à vitesse lente puis rapide, et constater l'absence de saut / inversion.
3. Prendre la pièce avec le doigt à proximité puis de loin ; vérifier que l'amplitude angulaire par pixel est similaire.
4. Essayer un bord d'écran, changer de prise, la main gauche, le maintien ×10 et les collisions.
5. Comparer directement au mode classique grâce à l'interrupteur.

**Ce test ne prouve pas encore le ressenti tactile réel**. Il s'agit d'une hypothèse d'interaction à valider par Fab avant intégration définitive. Aucun merge sur main ni Release de production.

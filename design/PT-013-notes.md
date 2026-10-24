# PT-013 — Charte officielle, musique et sons
Référence graphique canonique : `design/charte-officielle.png`, copie Git octet-pour-octet du fichier PNG déposé par Fab sur `main` (SHA de blob `ef9eec32c3cf05d88b64a68ccab26aae03f6d571`).
Musique officielle : `app/src/main/assets/official-theme.mp3` (SHA de blob `2e815ce52c6dff1fbc3a11685b8165388eac6425`). Transport Git **par référence de blob** ; aucune recompression ni conversion.
Le PNG est une **référence de production**, et n'est pas utilisé comme une couche plein écran qui recouvre les commandes ou le plateau. HUD, terre, lune, cellules, satellites et lasers doivent rester des objets/contrôles indépendants.
Le code charge le MP3 hors ligne à la première interaction et tente une lecture en boucle ; le thème WebAudio d'origine reste un mode de secours exclusif.
À valider sur SM-A576B : position exacte des éléments visuels par comparaison avec cette charte, écoute de la jonction musicale, touche multi-main, latence/volume du laser.
Djipie : catalogue de 579 références consulté par catégories, mais aucun WAV/OGG privé incorporé : licences et provenance individuelles non suffisamment vérifiées pour redistribution dans le dépôt public.

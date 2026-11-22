# Modèle cible, partie 3a : problèmes d'alignement (version d'étape)

Comment conclure que deux données différentes, dans des formats différents, désignent la même chose. Règle générale : **joindre sur un code, jamais sur un libellé**, sauf quand il n'y a pas de code (cas 1), et alors prouver la correspondance. Tous les cas ci-dessous sont tranchés.

## 1. Commune : nom (S01) contre code (S02, S10, S11)
- **Problème.** Les fichiers 1973–1980 et 1981–1989 (S01) donnent le nom de la commune (`COMMUNE`) sans code. S02, S10 et S11 donnent un code.
- **Règle.** Normaliser le nom (majuscules, accents retirés, tirets et apostrophes retirés) et le rapprocher de `name_ncc` dans `DimTerritoire`.
- **Preuve (mesurée).** 121 noms distincts dans chacun des deux fichiers S01 ; 125 dans S02. **Aucun nom sans correspondance.** Les 124 noms actuels sont uniques, donc pas d'ambiguïté. Dans S02, le nom de `COMMUNE` et `INSEE_COM` concordent sur les 13 191 lignes.
- **Limite.** Le rapprochement se fait avec les noms actuels : une commune renommée avant 1990 serait absente. Ce n'est pas observé (0 nom sans correspondance), donc la règle suffit.
- **Précision spatiale.** Les points de 1973–1980 sont placés au centroïde de la commune, et les points Prométhée plus récents au centroïde d'un carreau DFCI d'environ 1 km (métadonnées XML). **Conséquence : la position ne sert qu'à la commune, jamais à un calcul de distance fine ; l'analyse spatiale se fait à l'échelle de la commune.**

## 2. Code département : `20` contre `2A` / `2B`
- **Problème.** Avant le 01/01/1976 la Corse est le département `20`, et les communes ont des codes `20xxx`. Depuis, elles ont `2Axxx` ou `2Bxxx`. S08 (météo) garde `20` pour toute la Corse. S06 et S15 utilisent `2A` et `2B`.
- **Règle pour les communes.** `crosswalk.csv` (`20xxx` vers `2Axxx`, 124 lignes, événement 41 « changement de département ») ; `DimTerritoire.current_code` donne le code courant.
- **Règle pour les stations météo (construite).** S08 donne `LAT` et `LON`, pas de commune. Point-dans-polygone avec les limites de S11 : **104 des 252 postes sont en Corse-du-Sud** ; les 148 autres (Haute-Corse ou hors limites) sont ignorés. Script : `pipeline/weather/build_station_crosswalk.py` ; table : `data/staging/weather/station_crosswalk.csv`.

## 3. Format et sens des dates
| Source | Format | Sens |
|---|---|---|
| S01, S02 | `AAAA-MM-JJ` + champs séparés | jour du départ de feu |
| S06 | horodatage ISO (`2025-06-03T14:50:06Z`) | date et heure du bulletin ; le bulletin de 17 h donne le niveau du lendemain (`niveau_j1`) et du surlendemain (`niveau_j2`) |
| S08 | `AAAAMMJJ` | jour de la mesure ; la pluie du jour J est relevée à J+1 à 6 h |
- **Règle.** Clé `AAAAMMJJ`. **Le niveau du jour D est le `niveau_j1` du bulletin du jour D−1** (c'est ce que dit la présentation de Météo-France).
- **Test.** Saison 2024 en Corse-du-Sud, 119 jours : avec cette règle, un feu a lieu dans 11 des 48 jours de niveau 1 (23 %), 31 des 68 jours de niveau 2 (46 %) et 3 des 3 jours de niveau 3. En lisant le bulletin de D comme le jour D : 13 sur 48 (27 %), 29 sur 68 (43 %), 3 sur 3. Les deux lectures concluent pareil ; on garde celle de la documentation.

## 4. Code du département dans S06
`num_dep` vaut `1` en 2024 et 2025, `01` en 2026. Règle : texte de 2 caractères. Séparateur `;` en 2026 (virgule avant) et colonne `nom_dep` (2025 : `dep_nom`) : détectés et renommés au chargement.

## 5. Millésime du référentiel communal
S12 (CORINE) est indexée par le COG 2010 (colonne `cog_commune_2010`), S10 est le COG 2026. Pour la Corse-du-Sud, S12 compte 124 communes à chaque millésime et S10 124 communes actuelles : le nombre ne change pas. Règle : jointure par code ; le contrôle code par code est fait pour S10 contre S11 (identiques), et la jointure S12 se fait sur les mêmes codes `2Axxx`.

## 6. Unités de surface
- **1973–1980 : mètres carrés. 1981–2024 : hectares.** Preuves : (1) la valeur maximale de 1973–1980 est 7 000 000, impossible en hectares car la Corse-du-Sud fait 401 410 ha (somme des surfaces communales de S11) ; (2) sur 13 feux présents à la fois dans les points 1973–1989 et dans les contours 1949–1980, le rapport médian contour/point est de 0,00012, soit environ 1/10 000 ; (3) pour 1990–2024, le rapport médian contour/point est de 1,0 sur 1 121 feux, et de 1,3 pour 1981–1989 sur 41 feux.
- **Règle.** Diviser par 10 000 les surfaces de 1973–1980.

## 7. Types de feu
`FF` devient `FORET` et `AFERPU` devient `VEGETATION` à partir du 1er janvier 2023 (métadonnées XML) ; `FV` apparaît en 2024 sans définition. Règle : `FF` et `FORET` donnent `FORET` ; `AFERPU`, `VEGETATION` et `FV` donnent `AUTRE_VEGETATION`. L'hypothèse sur `FV` (même sens que `VEGETATION`) est écrite ; elle porte sur 45 lignes de 2024.

## 8. Saison
La colonne `PERIODE` suit une règle qui change en juin 2018 (SAISON = 15 juin au 30 septembre depuis). Règle : ne pas l'utiliser, recalculer la saison à partir de la date.

## 9. Niveau de danger entre départements
Le niveau de S06 dépend de la surface forestière et des zones sensibles de chaque département (présentation PDF). La comparaison de la Corse-du-Sud avec les autres départements porte donc sur la **distribution des niveaux**, pas sur une valeur d'indice commune.

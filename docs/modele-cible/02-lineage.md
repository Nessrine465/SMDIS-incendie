# Modèle cible, partie 2 : lineage (version d'étape)

Chaque ligne : la donnée du modèle cible, sa source, les transformations, le problème d'alignement et le traitement des concurrentes. Les détails sont dans `03-alignement.md` et `04-donnees-concurrentes.md`. Statut : **règle écrite** (à exécuter dans le pipeline) sauf mention « construit ».

| Donnée cible | Source (champ) | Transformations | Alignement | Données concurrentes |
|---|---|---|---|---|
| `FaitDepartFeu.date_key` | S01, S02 (`DATE_FEU`) | texte `AAAA-MM-JJ` converti en date puis en clé `AAAAMMJJ` ; `MOIS_FEU` ignoré | format de date différent de S08 (`AAAAMMJJ`) et S06 (horodatage ISO) : tous ramenés à `AAAAMMJJ` | aucune |
| `FaitDepartFeu.heure` | S01, S02 (`HEURE_FEU`) | texte `hh:mm` converti en heure | aucun | aucune |
| `FaitDepartFeu.territory_key` | S02 (`INSEE_COM`) ; S01 (`COMMUNE`, nom seulement) | S02 : jointure directe sur le code. S01 : nom normalisé (majuscules, sans accents ni tirets) rapproché de `name_ncc` de la dimension territoire, puis version valide à la date du feu | **nom contre code** pour 1973–1989 ; code `20xxx` avant 1976 | aucune après alignement (0 nom sans correspondance sur les trois fichiers) |
| `FaitDepartFeu.surface_ha` | S01, S02 (`SURFACE`) | typage numérique ; **1973–1980 : divisé par 10 000 (m² vers ha)**, 1981–2024 inchangé (déjà en ha) ; 0 conservé, signalé par un indicateur `surface_nulle` | **unités différentes** selon le fichier, tranchées (voir `03-alignement.md`, section 6) | doublons : voir règle de déduplication |
| `FaitDepartFeu.type_feu_key` | S01, S02 (`TYPE_FEU`) | `FF` et `FORET` deviennent `FORET` ; `AFERPU`, `VEGETATION` et `FV` deviennent `AUTRE_VEGETATION` | codes renommés en 2023 (`FF` vers `FORET`, `AFERPU` vers `VEGETATION`), et `FV` en 2024 non défini : hypothèse écrite | aucune |
| `FaitDepartFeu.cause_key` | S01, S02 (`CAUSE`) | code gardé ; `0` et vide regroupés en « inconnue » ; jamais imputée | 61 à 98 % de valeurs inconnues selon la période | doublons dont la cause diffère : 9 groupes |
| `FaitDepartFeu.source_key` | S02 (`SOURCE`) ; S01 : `PROMETHEE` pour toutes les lignes sauf une | `PROMETHE` corrigé en `PROMETHEE` ; sert de traçabilité et de priorité entre doublons | série mixte DDT2A/PROMETHEE/OPENDFCI2A | voir `04` |
| `FaitDepartFeu.id_depart_cle` | S01, S02 (`ID_DDT2A`, code commune, `HEURE_FEU`) | clé de substitution sur la combinaison (`ID_DDT2A`, code commune, heure) ; lignes strictement identiques ramenées à une | **`ID_DDT2A` n'est pas unique** malgré les métadonnées (172 identifiants partagés par 816 lignes) | voir `04` : 22 699 lignes brutes, 22 080 après déduplication |
| `FaitNiveauDanger.date_key` | S06 (`date`) | horodatage ISO converti en date, puis **décalage de un jour** : le niveau du jour D est le `niveau_j1` du bulletin du jour D−1 | `date` = date et heure du bulletin (diffusé à 17 h pour le lendemain), pas le jour concerné (présentation Météo-France) | aucune |
| `FaitNiveauDanger.departement_key` | S06 (`num_dep`) | forcé en texte de 2 caractères (`1` devient `01`) | `1` (2024, 2025) contre `01` (2026) ; Corse : `2A` et `2B` | aucune |
| `FaitNiveauDanger.niveau_j1`, `niveau_j2` | S06 | entiers 1 à 4 ; chargeur adapté au séparateur (`;` en 2026) et au nom de colonne (`nom_dep` / `dep_nom`) | dérive de format entre les années | aucune |
| `FaitMeteoJour.date_key` | S08 (`AAAAMMJJ`) | converti en date | format différent des autres sources | aucune |
| `FaitMeteoJour.station_key` | S08 (`NUM_POSTE`, `LAT`, `LON`) | poste rattaché à une commune puis à 2A ou 2B par point-dans-polygone avec S11 (**construit** : 104 postes sur 252 en Corse-du-Sud) | **S08 utilise le code département `20` pour toute la Corse** | fichiers ancien (≤ 2024) et récent (2025+) raccordés ; dates distinctes, sans recouvrement |
| `FaitMeteoJour.tx`, `rr`, `ffm`, `humidite` | S08 (`TX`, `RR`, `FFM`, `UN`/`UM`) | valeurs vides gardées à NULL, jamais imputées ; indicateurs de qualité conservés ; valeur du jour pour le proxy : médiane des postes de 2A qui mesurent le champ | 4 à 5 postes mesurent l'humidité en 1990, 13 en 2024 ; au moins un poste chaque jour de la saison | aucune |
| `DimTerritoire.*` | S10 (`v_commune_depuis_1943`, mouvements) | filtre Corse-du-Sud ; une ligne par version valide ; `crosswalk` `20xxx` vers `2Axxx` | codes `20xxx` (avant 1976) contre `2Axxx` ; **construit** (251 lignes) et **testé** (six tests réussis) | aucune |
| `DimTerritoire` (population, surface, géométrie) | S11 (`population`, `superficie_cadastrale` en ha, `geometry`) | jointure sur `code_insee` | 124 codes identiques à S10 | population datée 2022 ou 2023 selon la commune : date conservée |
| `FaitBudgetSdis.montant_eur` | S15 (`Montant`, `Agrégat`) | filtre `Code Département = 2A` ; sélection d'agrégats ; hiérarchie des agrégats documentée | `2A` contre `20` : S15 suit le code des fichiers de feu | agrégats imbriqués : ne pas additionner |
| `FaitOccupationSol.superficie_ha` | S12 (postes CORINE) | filtre sur les codes `2A…` ; jointure aux communes par code ; millésimes 1990, 2000 révisé, 2006 révisé, 2012 révisé, 2018 | colonne `cog_commune_2010` : les 124 communes de 2A sont les mêmes qu'en 2026 | deux versions pour 2000, 2006 et 2012 (`CLC 2000` et `CLC 2000 révisée`, etc.) : on garde la version révisée |
| Contours de feux (table séparée, pour la carte) | S03 (`ID_DDT2A`, `SURFACE`) | jointure sur `ID_DDT2A` ; `SURFACE` en ha ; `SASION` corrigé en `SAISON` | 1 368 contours sur 1 380 retrouvent un départ | surfaces cohérentes (médiane du rapport 1,0) |

## Ce qui est exécuté
- `DimTerritoire` (`pipeline/territory/build_dim_territory.py`) et ses six tests.
- La table des stations (`pipeline/weather/build_station_crosswalk.py`).
- Les règles de déduplication ont été **mesurées** sur les données (voir `04`), pas encore codées en table.
Les autres lignes sont des règles écrites, qui seront codées dans le pipeline v0.1.

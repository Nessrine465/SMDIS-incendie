# Fiche d'identité : S08 · Météo-France, climatologie de base quotidienne (Corse, département 20)

Rempli par : Nessrine Bouzrina · Date : 20261120 · Fichiers ouverts : oui, quatre fichiers `Q_20_*` (anciennes données 1950–2024 et récentes 2025–2026, pour « RR-T-Vent » et « autres paramètres ») et les deux descriptifs de champs

| # | Champ | Annoncé (catalogue) | Observé (fichier ouvert) |
|---|---|---|---|
| 1 | Propriétaire | Météo-France | Idem |
| 2 | Contenu | Pluie, température, vent, humidité quotidiens, par station | Mesures quotidiennes par poste. **Un fichier pour toute la Corse (code `20`), 2A et 2B mélangés** |
| 3 | Accès | data.gouv.fr, CSV.gz par département | Téléchargement direct, sans clé |
| 4 | Granularité | Station × jour | Une ligne = un poste pour un jour |
| 5 | Historique | depuis 1786 pour la base nationale | 1950-01-01 à 2024-12-31 (fichier ancien), 2025-01-01 à 2026-11-19 (fichier récent) |
| 6 | Fraîcheur | mise à jour quotidienne | Dernier jour : 2026-11-18 (RR-T-Vent) et 2026-11-19 (autres), au 20261120 |
| 7 | Volumétrie | 628 fichiers au niveau national | RR-T-Vent : 1 786 257 lignes (ancien) + 38 238 (récent) ; autres paramètres : 1 068 908 + 37 595. 248 postes dans l'ancien fichier RR-T-Vent, 58 dans le récent |
| 8 | Clés | `NUM_POSTE` (8 chiffres) | `NUM_POSTE`, `LAT`, `LON`, `ALTI` dans chaque ligne. **Pas de code commune** |
| 9 | Historisation | non annoncée | Fichiers « ancien » et « récent » à raccorder en 2024/2025 |
| 10 | Données personnelles | non annoncées | Aucune |
| 11 | Licence | Licence Ouverte 2.0 | Confirmée par le catalogue data.gouv.fr (`lov2`, producteur Météo-France, mise à jour quotidienne) |
| 12 | Millésime | non annoncé | Date au format `AAAAMMJJ` |

## Typologie
Origine : établissement public · Structure : tabulaire · Production : mesures de stations · Accès : ouvert · Statut : référence pour la météo

## Questions servies
D2 (proxy d'indice avant 2024, modèle M1), M2 (risque quotidien).

## Profil qualité (part de valeurs vides, tout département 20)
| Champ | Ancien fichier (1950–2024) | Récent (2025–2026) |
|---|---|---|
| `TX` (température maximale) | 50 % vides | 0 % vides |
| `RR` (pluie) | 2 % vides | 4 % vides |
| `FFM` (vent moyen) | 78 % vides | 43 % vides |
| `UN`, `UM` (humidité) | 69 % et 71 % vides | 51 % et 48 % vides |

Les chiffres ci-dessus concernent toute la Corse. **Pour les seuls postes de la Corse-du-Sud** (104 postes sur 252 rattachés à la commune par point-dans-polygone, voir `pipeline/weather/build_station_crosswalk.py` et `data/staging/weather/station_crosswalk.csv`) :

| Champ | Part de valeurs renseignées (toutes années, tous postes) | Part en juin–septembre | Postes qui mesurent le champ (1990 / 2000 / 2010 / 2020 / 2024) |
|---|---|---|---|
| `RR` pluie | 99 % | 99 % | 33 / 37 / 47 / 39 / 26 |
| `TX` température max | 48 % | 47 % | 18 / 20 / 22 / 27 / 26 |
| `FFM` vent moyen | 23 % | 23 % | 5 / 9 / 13 / 15 / 15 |
| `UN`, `UM` humidité | 31 % et 30 % | 32 % et 30 % | 4 / 9 / 12 / 13 / 13 |

Ces pourcentages sont faibles parce que beaucoup de postes ne mesurent pas ces champs. Ce qui compte pour le proxy est la disponibilité par jour : **chaque jour de juin à septembre, de 1990 à 2024, au moins un poste de la Corse-du-Sud renseigne chacun des cinq champs (100 % des jours)**. Le proxy est donc faisable en prenant une valeur par jour (médiane ou maximum sur les postes), mais le nombre de postes passe de 4 à 5 en 1990 à 13 à 15 en 2024 pour le vent et l'humidité : la qualité du proxy n'est pas constante dans le temps, et il faut le signaler dans tout résultat.

## Champs à garder
| Champ | Question | Perso. ? | Décision | Pourquoi |
|---|---|---|---|---|
| `NUM_POSTE`, `NOM_USUEL`, `LAT`, `LON` | rattachement à 2A | non | garder | `station_crosswalk.csv` (construit) |
| `AAAAMMJJ` | jointure | non | garder, convertir | |
| `TX`, `RR`, `FFM`, `UN`, `UM` | M1, M2 | non | garder | |
| champs de qualité `Q*` | contrôle | non | garder pour filtrer | |

## Obstacles
Pas de département 2A/2B dans le fichier : table de correspondance station → commune → département construite avec les coordonnées (252 postes, 104 en Corse-du-Sud, 148 en Haute-Corse ou hors limites).

## Décision
**Garder comme source météo unique** (104 postes de la Corse-du-Sud). Pas de source en grille : la disponibilité par jour (100 %) rend l'ajout inutile pour le périmètre de l'étape.

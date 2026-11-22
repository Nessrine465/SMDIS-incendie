# Fiche d'identité : S01 · DDTM 2A, départs de feu 1973–1980 et 1981–1989

Rempli par : Menad Ouassim · Date : 20261120 · Fichiers ouverts : oui, `L_DFCI_DEPART_FEUX_1973-1980_P_02A.dbf` et `L_DFCI_DEPART_FEUX_1981-1989_P_02A.dbf` (archive DDTM 2A, copiée le 20261120, voir `data/raw/fire/ddtm2a-feux-1973-2025/PROVENANCE.txt`)

| # | Champ | Annoncé (catalogue) | Observé (fichier ouvert) |
|---|---|---|---|
| 1 | Propriétaire | DDTM de Corse-du-Sud | Idem (métadonnées XML du jeu) |
| 2 | Contenu | Départs de feu 1973–2025, points | Points de départ de feu, Corse-du-Sud. Ce sont des **interprétations cartographiques issues de Prométhée** (métadonnées XML). Ne décrit pas la forme du feu (voir S03) ni la cause de façon exploitable (97 à 98 % de causes à `0`) |
| 3 | Accès | data.gouv.fr, shapefile, WFS | Archive zip téléchargée, un shapefile par période. Pas de clé nécessaire |
| 4 | Granularité | Un départ de feu | Une ligne = un départ de feu, 17 champs (`PROMETHEE`, `COMMUNE`, `DATE_FEU`, `SURFACE`, `CAUSE`, …) |
| 5 | Historique | 1973–2025 | 1973-01 à 1989-12 : 3 190 lignes (1973–1980) + 6 318 lignes (1981–1989). Fait observé : aucun fichier pour 2025 |
| 6 | Fraîcheur | Jeu modifié le 2026-05-27 (page) | Dernière année de données : 2024 dans la couche 1990–2024. Date de la page différente de la fraîcheur des données |
| 7 | Volumétrie | non annoncée | 9 508 lignes pour les deux fichiers |
| 8 | Clés | `ID_DDT2A` | `ID_DDT2A` = numéro Prométhée + date. Presque unique (1 doublon par fichier). **Pas de code INSEE : seulement le nom de commune** (121 noms distincts) |
| 9 | Historisation | non annoncée | Un état courant, pas de versions. Champ `MODIF` (OUI/NON) dans 1981–1989 seulement |
| 10 | Données personnelles | non annoncées | Aucune personne. Indirect : lieu-dit + date + heure, mais pas d'adresse (lieu-dit rempli à 0 à 1 %) |
| 11 | Licence | Licence Ouverte 2.0 | Confirmée dans les métadonnées XML et par le catalogue data.gouv.fr (`lov2`). Obligation : citer la source |
| 12 | Millésime | non annoncé | Référentiel communal : noms actuels. Tous les noms trouvés dans le COG (0 nom sans correspondance après normalisation). Localisation : un point de 1973–1980 est placé au **centroïde de la commune** (carreau DFCI de 2 km), pas au lieu réel (métadonnées XML) |

## Typologie
Origine : service de l'État · Structure : géographique structuré (points) · Production : saisie et interprétation (Prométhée) · Accès : ouvert · Statut : référence pour 1973–1989

## Questions servies
Q-FA, Q-MF, Q-ZONE. **Aucune utilité pour Q-FA et Q-MF avant 2024**, tant que l'indice officiel n'existe pas (le proxy M1 en dépend).

## Profil qualité
- `SURFACE` : **unité différente selon le fichier, et elle est établie.** 1973–1980 : en **m²** (médiane 3 000, max 7 000 000, impossible en hectares puisque la Corse-du-Sud fait 401 410 ha d'après S11 ; et sur 13 feux présents à la fois dans les points 1973–1989 et dans les contours 1949–1980 en hectares, le rapport médian contour/point est de 0,00012, soit environ 1/10 000). 1981–1989 et 1990–2024 : en hectares (rapport médian de 1,3 sur 41 feux communs avec les contours 1981–1989, et de 1,0 sur 1 121 feux pour 1990–2024). **Règle : diviser la surface de 1973–1980 par 10 000.**
- `CAUSE` : 97 % (1973–1980) et 98 % (1981–1989) valent `0`. À traiter comme inconnue.
- `SURFACE = 0` : 215 lignes (1973–1980), 1 972 lignes (1981–1989, toutes `AFERPU`).
- `TYPE_FEU` : FF = feu de forêt, AFERPU = autres feux urbains ou péri-urbains (métadonnées XML).
- Dates : 0 date invalide, 0 écart entre `DATE_FEU` et année/mois/jour.
- Doublon d'identifiant : 1 identifiant dans chaque fichier.

## Champs à garder
| Champ | Question | Perso. ? | Décision | Pourquoi |
|---|---|---|---|---|
| `DATE_FEU`, `HEURE_FEU` | Q-FA, Q-MF | non | garder | jointure avec l'indice |
| `COMMUNE` | Q-ZONE | non | garder, convertir en code | jointure par code, jamais par nom |
| `SURFACE` | seuil de définition d'un feu | non | garder, convertie en hectares | voir profil |
| `TYPE_FEU` | définition d'un feu | non | garder (FF et AFERPU, définitions ci-dessus) | seuil et test de sensibilité |
| `CAUSE` | aucune fiable | non | garder en « inconnue » | trop incomplet |
| `LIEU_DIT`, `PR_4`, `CODE_CAR` | aucune | indirect (lieu) | écarter | pas de question |

## Obstacles
Le lecteur DBF maison (`pipeline/fire/dbf_reader.py`) lit les deux fichiers sans erreur (0 enregistrement supprimé).

## Décision
**Garder** pour l'historique des feux (carte et saisonnalité). Ne sert pas aux analyses d'indice avant 2024.

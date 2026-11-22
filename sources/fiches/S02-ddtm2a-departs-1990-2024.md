# Fiche d'identité : S02 · DDTM 2A, départs de feu 1990–2024

Rempli par : Menad Ouassim · Date : 20261120 · Fichier ouvert : oui, `L_DFCI_DEPART_FEUX_1990-2024_P_02A.dbf`

| # | Champ | Annoncé (catalogue) | Observé (fichier ouvert) |
|---|---|---|---|
| 1 | Propriétaire | DDTM de Corse-du-Sud | Idem |
| 2 | Contenu | Départs de feu 1990–2024 | Points de départ de feu issus de relevés terrain (DDT2A, ONF) et d'exports Prométhée et OpenDFCI 2A, avec saisie manuelle de la cause et de la surface (métadonnées XML). Ne dit pas comment le feu s'est propagé (voir S03). Position : un point Prométhée est placé au centroïde d'un carreau DFCI de 1 km × 1 km : **précision d'environ 1 km** |
| 3 | Accès | data.gouv.fr, shapefile, WFS | Archive zip, shapefile. Pas de clé |
| 4 | Granularité | Un départ de feu | Une ligne = un départ de feu, 19 champs |
| 5 | Historique | 1990-01-01 à 2024-12-31 | 1990 à 2024 (35 années) |
| 6 | Fraîcheur | Modifié le 2025-05-14 (page) | Dernier départ : 2024. Pas de données 2025, même si le titre du jeu parent annonce 2025 |
| 7 | Volumétrie | non annoncée | **13 191 lignes**, 19 champs |
| 8 | Clés | `ID_DDT2A` | `ID_DDT2A` = numéro Prométhée + date. **Non unique** : 12 547 valeurs pour 13 191 lignes (172 identifiants partagés par 816 lignes). `INSEE_COM` rempli à 100 % |
| 9 | Historisation | non annoncée | Pas de versions. Champ `MODIF` (OUI/NON) |
| 10 | Données personnelles | non annoncées | Aucune personne. Indirect : lieu-dit (4 192 valeurs) + date + heure |
| 11 | Licence | Licence Ouverte 2.0 | Confirmée dans les métadonnées XML et par le catalogue data.gouv.fr (`lov2`). Obligation : citer la source |
| 12 | Millésime | non annoncé | Codes communes actuels (`INSEE_COM` : 124 codes, 2A…). Chaque nom de `COMMUNE` correspond à son code (0 écart) |

## Typologie
Origine : service de l'État, avec saisie manuelle · Structure : géographique structuré · Production : Prométhée, OpenDFCI, DDT · Accès : ouvert · Statut : **référence pour les feux**

## Questions servies
Q-FA, Q-MF, Q-ZONE, D1, D2.

## Profil qualité (fichier ouvert)
| Constat | Chiffre | Décision |
|---|---|---|
| `CAUSE` vide ou `0` | 61 % (8 035 lignes) | la valeur `0` est traitée comme « inconnue » (convention de travail : les métadonnées ne publient pas la table des codes de cause) ; jamais imputée ; la cause n'est utilisée dans aucune analyse |
| `SURFACE = 0` | 3 230 lignes (24 %), médiane 0,04 | définir ce qu'est un feu (seuil), tester deux seuils |
| `TYPE_FEU` | FF 11 516, AFERPU 1 489, FORET 87, VEGETATION 54, FV 45 | **Sens établi par les métadonnées XML** : FF = feu de forêt, AFERPU = autres feux urbains ou péri-urbains ; depuis le 1er janvier 2023, FF devient FORET et AFERPU devient VEGETATION (brûlis de chaume, feux agricoles, autres surfaces). Dans les données, FORET et VEGETATION n'existent qu'en 2023 et FV qu'en 2024 (45 lignes). FV n'est pas défini dans les métadonnées : traité comme VEGETATION par hypothèse. **Règle : FF et FORET deviennent `FORET` ; AFERPU, VEGETATION et FV deviennent `AUTRE_VEGETATION`** |
| `MOIS_FEU` | 4 lignes à `1` au lieu de `01` (10 lignes en désaccord avec `DATE_FEU`) | normaliser à deux chiffres ; `DATE_FEU` fait foi |
| `SOURCE` | DDT2A 7 489, PROMETHEE 5 402, OPENDFCI2A 295, ONF 3, `PROMETHE` 2 (faute) | sens établi par les métadonnées : DDT2A = constaté sur le terrain, ONF = grands feux (interprétation cartographique ; seuil de 20 ou de 50 ha selon le passage du texte), PROMETHEE = données Prométhée, OPENDFCI2A = à partir de 2022. Corriger `PROMETHE` en `PROMETHEE` ; garder comme traçabilité |
| `PERIODE` | SAISON / HORS-SAISON | Définition officielle depuis l'arrêté de juin 2018 : SAISON du 15 juin au 30 septembre. Avant 2018 la règle est différente (1 244 écarts avec la règle actuelle avant 2018, 61 après). **Règle : recalculer notre propre indicateur de saison à partir de la date, et ne pas utiliser `PERIODE`** |
| Identifiants | 172 identifiants partagés : 68 groupes strictement identiques, 77 groupes qui décrivent le même feu avec des attributs différents, 27 groupes de feux distincts. Les métadonnées affirment que l'identifiant est unique : **les données le contredisent** | règle de déduplication dans `docs/modele-cible/04-donnees-concurrentes.md` |
| Déclin apparent | 777 feux en 1990, 122 en 2024 | changement de saisie (Prométhée dominant 1990s–2010s, DDT2A/OpenDFCI après) : non prouvé ; vérifier par source et par année avant toute tendance |

## Champs à garder
| Champ | Question | Perso. ? | Décision | Pourquoi |
|---|---|---|---|---|
| `DATE_FEU`, `HEURE_FEU` | Q-FA, Q-MF | non | garder | jointure avec l'indice |
| `INSEE_COM` | Q-ZONE, jointures | non | garder (clé) | jointure par code |
| `SURFACE`, `TYPE_FEU` | définition d'un feu | non | garder (surface en hectares ; type harmonisé FORET / AUTRE_VEGETATION) | seuils |
| `CAUSE` | aucune fiable | non | garder « inconnue » | 61 % manquant |
| `SOURCE` | traçabilité et règle de survie | non | garder | explique les changements de série ; sert à choisir entre doublons |
| `ID_DDT2A`, `PROMETHEE` | identification | non | garder pour la déduplication | |
| `LIEU_DIT`, `PR_4`, `CODE_CAR`, `COMMUNE` | aucune | indirect | écarter (`COMMUNE` remplacé par le code) | minimisation |

## Obstacles
Identifiants non uniques : traités par règle de déduplication. Aucun fichier 2025.

## Décision
**Garder comme référence des feux.** Les fichiers de 1973 à 1989 (S01) sont ajoutés par empilement après alignement des unités et des communes.

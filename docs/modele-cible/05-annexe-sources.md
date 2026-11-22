# Modèle cible, annexe : sources utilisées

## Sources retenues
| ID | Source | Fiche | Fichiers ouverts | Décision |
|---|---|---|---|---|
| S01 | DDTM 2A, départs de feu 1973–1989 | [S01](../../sources/fiches/S01-ddtm2a-departs-1973-1989.md) | oui | gardé |
| S02 | DDTM 2A, départs de feu 1990–2024 | [S02](../../sources/fiches/S02-ddtm2a-departs-1990-2024.md) | oui | **référence feux** |
| S03 | DDTM 2A, contours de feux | [S03](../../sources/fiches/S03-ddtm2a-contours-de-feux.md) | oui | gardé (carte des grands feux) |
| S06 | Météo-France, Météo des forêts | [S06](../../sources/fiches/S06-meteo-des-forets.md) | oui | **référence danger** |
| S08 | Météo-France, climatologie quotidienne | [S08](../../sources/fiches/S08-climatologie-quotidienne.md) | oui | gardé |
| S10 | INSEE, COG | [S10](../../sources/fiches/S10-insee-cog.md) | oui | **clé territoire** |
| S11 | IGN, ADMIN EXPRESS | [S11](../../sources/fiches/S11-ign-admin-express.md) | oui | gardé (géométrie, population) |
| S12 | CORINE Land Cover | [S12](../../sources/fiches/S12-occupation-du-sol.md) | oui | gardé |
| S15 | OFGL, comptes des SDIS | [S15](../../sources/fiches/S15-ofgl-comptes-sdis.md) | oui | gardé (budget) |

## Sources examinées et écartées
| ID | Source | Fiche ou raison |
|---|---|---|
| S05 | BDIFF | [S05](../../sources/fiches/S05-bdiff.md) : aucun fichier sans compte, données jusqu'en 2022 |
| S12bis | BD Forêt | archive tronquée (voir [S12](../../sources/fiches/S12-occupation-du-sol.md)) ; CORINE retenue |
| S04 | Lieux-dits associés aux départs | déjà portés par le champ `LIEU_DIT` des départs de feu |
| S07 | API Météo des forêts | prévision en direct seulement ; inutile pour l'historique |
| S09 | IFM/FWI horaire | « inactif pour le moment » selon son producteur |
| S13 | Grille DFCI 2 × 2 km | présente dans l'archive DDTM ; aucune question ne demande une position fine |
| S14 | Zones d'aléa PPRN | non ouverte ; le catalogue ne dit pas si le feu de forêt y figure ; aucune question n'en dépend |
| S16 | Populations légales INSEE | la population de S11 vient du recensement INSEE |
| S17 | Débroussaillement | non ouverte ; aucune question n'en dépend |
| S19 | Prométhée, OpenDFCI 2A | accès sous conditions ; leurs données sont déjà dans S01 et S02 |

Les raisons détaillées figurent dans `docs/analyse/matrice-questions-sources.md`.

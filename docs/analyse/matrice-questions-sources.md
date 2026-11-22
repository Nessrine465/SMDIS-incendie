# Matrice questions × sources (version d'étape, 20 novembre 2026)

Légende : **●** source indispensable · ○ source utile · — non utilisée. Une source sans question est écartée ; une question sans source est un manque documenté.

| Source | Q-FA | Q-MF | Q-CMP | Q-ZONE | Q-MOY | Q-SIM | Statut |
|---|---|---|---|---|---|---|---|
| S01 départs 1973–1989 | — | — | — | ● | — | ○ | gardé ; surfaces de 1973–1980 converties de m² en ha |
| S02 départs 1990–2024 | ● | ● | — | ● | — | ● | **référence feux** |
| S03 contours de feux | — | — | — | ○ | — | ○ | gardé pour la carte des grands feux |
| S05 BDIFF | — | — | — | — | — | — | **écartée** : pas de fichier sans compte, données jusqu'en 2022 |
| S06 Météo des forêts | ● | ● | ● | — | — | ● | **référence danger** |
| S08 climatologie | ○ | ● | — | — | — | ● | gardé (proxy et météo) |
| S10 COG | ○ | ○ | ○ | ● | — | ○ | **clé territoire** |
| S11 ADMIN EXPRESS | — | — | — | ● | — | ● | gardé |
| S12 occupation du sol (CORINE) | — | — | — | ● | — | ○ | gardé ; BD Forêt écartée (archive tronquée) |
| S15 comptes des SDIS | — | — | — | — | ● | ● | gardé (budget) |
| Effectifs, véhicules, casernes | — | — | — | — | ● | ● | **manque** : paramètres de simulation |
| Indice historique officiel avant 2024 | ● | ● | — | — | — | — | **manque** : proxy M1 ou demande au client |

## Sources écartées (avec la raison)
| Source | Raison |
|---|---|
| IFM/FWI horaire (S09) | décrit comme « inactif pour le moment » par son propre producteur ; aucune question n'en dépend |
| API Météo des Forêts (S07) | prévision en direct seulement ; inutile pour l'historique |
| Images de feux (Pyronear) | aucune question n'utilise d'images |
| Jeux de données d'autres départements | non nécessaires ; la comparaison porte sur l'indice S06 |
| S04 lieux-dits | déjà portés par le champ `LIEU_DIT` des départs de feu |
| S13 grille DFCI | présente dans l'archive DDTM, mais aucune question ne demande la position à moins de 1 km |
| S14 zones PPRN | non ouverte ; le catalogue ne dit pas si l'aléa feu de forêt y figure ; aucune question n'en dépend |
| S16 populations INSEE | la population de S11 provient du recensement INSEE |
| S17 débroussaillement | non ouverte ; aucune question n'en dépend |
| S19 Prométhée, OpenDFCI | accès sous conditions ; leurs données sont déjà dans S01 et S02 |

## Lecture
- Q-FA et Q-MF dépendent des **deux seules** sources S02 et S06, avec une saison commune (2024). Tout le reste de ces questions repose sur le proxy M1 (S08).
- Q-MOY n'a qu'une source financière (S15) : c'est le principal manque du projet.

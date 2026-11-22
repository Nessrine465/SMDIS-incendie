# Fiche d'identité : S10 · INSEE, Code officiel géographique (COG)

Rempli par : El Karimi Yassine · Date : 20261120 · Fichiers ouverts : oui, `v_commune_2026.csv`, `v_commune_depuis_1943.csv`, `v_mvt_commune_2026.csv`, `v_mvt_commune_2025.csv` ; script `pipeline/territory/build_dim_territory.py`

| # | Champ | Annoncé (catalogue) | Observé (fichier ouvert) |
|---|---|---|---|
| 1 | Propriétaire | INSEE | Idem |
| 2 | Contenu | Communes, historique depuis 1943, événements | Liste des communes, noms, codes, et mouvements (fusions, changement de département) |
| 3 | Accès | data.gouv.fr, CSV | Téléchargement direct, sans clé |
| 4 | Granularité | Commune ; événement | `v_commune_2026` : une ligne par entité (communes, communes déléguées, associées, arrondissements) ; `v_mvt_commune` : un mouvement |
| 5 | Historique | depuis 1943 | `v_commune_depuis_1943` : 42 333 lignes avec `DATE_DEBUT`, `DATE_FIN` |
| 6 | Fraîcheur | millésime annuel | Millésime 2026 ; mouvements 2025 et 2026 présents |
| 7 | Volumétrie | non annoncée | `v_commune_2026` : 37 496 lignes (dont 124 pour `2A`, 236 pour `2B`) ; `v_mvt_commune_2026` : 13 734 lignes |
| 8 | Clés | `COM` | `COM` : 2A001…, et les anciens codes `20xxx` avant 1976 |
| 9 | Historisation | oui | Oui : dates de début et de fin, mouvements. C'est la source de la dimension territoire de type 2 |
| 10 | Données personnelles | non | Aucune |
| 11 | Licence | Licence Ouverte | Confirmée par le catalogue data.gouv.fr (`fr-lo`, producteur INSEE, mise à jour annuelle) |
| 12 | Millésime | 2026 | Millésime 2026 |

## Typologie
Origine : établissement public · Structure : tabulaire · Production : référentiel officiel · Accès : ouvert · Statut : référence

## Questions servies
Toutes (clé territoire), en particulier Q-CMP et Q-ZONE.

## Profil qualité
- Corse-du-Sud : 124 communes actuelles. Pour chacune, une ligne avant 1976 (département `20`) et une ligne depuis 1976 (département `2A`). `dim_territory.csv` : 251 lignes ; `crosswalk.csv` : 124 correspondances (`20xxx` vers `2Axxx`) ; `events.csv` : 131 événements.
- Noms uniques parmi les 124 communes actuelles : aucun doublon.
- Les 124 codes de S10 sont exactement les 124 codes de S11 (0 écart).

## Champs à garder
| Champ | Décision |
|---|---|
| `COM`, `LIBELLE`, `NCC`, `DATE_DEBUT`, `DATE_FIN` | garder |
| `TYPECOM` | garder pour ne retenir que `COM` |
| mouvements (`MOD`, `DATE_EFF`, `COM_AV`, `COM_AP`) | garder pour la table de correspondance |

## Obstacles
Plus de 99 % du fichier concerne d'autres départements : filtrer sur `2A` et sur les anciens codes `20xxx` qui y correspondent.

## Décision
**Garder.** Table de correspondance (`crosswalk.csv`) à utiliser pour toutes les jointures de territoire.

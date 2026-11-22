# Fiche d'identité : S11 · IGN, ADMIN EXPRESS (communes de la Corse-du-Sud)

Rempli par : El Karimi Yassine · Date : 20261120 · Fichier ouvert : oui, `data/raw/territory/s11-ign-adminexpress-wfs-2a/communes_2A.geojson`

| # | Champ | Annoncé (catalogue) | Observé (fichier ouvert) |
|---|---|---|---|
| 1 | Propriétaire | IGN | Idem |
| 2 | Contenu | Limites administratives | Polygones des communes de la Corse-du-Sud, avec population et codes. Ne contient pas l'historique des limites |
| 3 | Accès | data.gouv.fr, WFS | Extraction WFS limitée à la Corse-du-Sud, sans clé |
| 4 | Granularité | commune | Une ligne = une commune (MultiPolygon, EPSG:4326) |
| 5 | Historique | état courant | État courant uniquement |
| 6 | Fraîcheur | page modifiée le 2026-11-19 | Extraction du 2026-11-20 ; recensement de population daté de 2022 ou 2023 selon la commune |
| 7 | Volumétrie | non annoncée | 124 communes |
| 8 | Clés | `code_insee` | `code_insee` : `2A006`… ; 124 valeurs, identiques à S10 |
| 9 | Historisation | non | Non |
| 10 | Données personnelles | non | Aucune (population agrégée par commune) |
| 11 | Licence | Licence Ouverte 2.0 | Confirmée par le catalogue data.gouv.fr (`lov2`, producteur IGN) |
| 12 | Millésime | 2026 | Extraction de novembre 2026 ; population totale des 124 communes : 168 306 (recensements de 2022 et 2023) |

## Typologie
Origine : établissement public · Structure : géographique · Production : IGN · Accès : ouvert · Statut : référence pour la géométrie et la population communale

## Questions servies
Q-ZONE, D1 (cartes, surface, population).

## Profil qualité
- 124 communes, 0 population vide, 0 code absent de S10.
- Population : une seule valeur par commune, date de recensement 2022 ou 2023. Écart de 1 an entre communes, à signaler.
- `superficie_cadastrale` : la somme des 124 communes vaut 401 410, soit les 4 014 km² du département : l'unité est l'**hectare**.

## Champs à garder
`code_insee`, `nom_officiel`, `population`, `date_du_recensement`, `superficie_cadastrale`, `geometry` : garder. Autres codes (canton, EPCI, postal) : écarter, sauf besoin.

## Décision
**Garder.** Seule source de la géométrie des communes. Elle fournit aussi la population (recensement INSEE : champ `organisme_recenseur`), ce qui rend inutile une source de population séparée (S16).

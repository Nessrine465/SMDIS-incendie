# Fiche d'identité : S03 · DDTM 2A, contours de feux

Rempli par : Nessrine Bouzrina · Date : 20261120 · Fichiers ouverts : oui, `N_DFCI_CONTOUR_FEUX_1990-2024_S_02A.dbf` (1 380), `..._1981-1989_...` (47), `..._1949-1980_...` (61)

| # | Champ | Annoncé (catalogue) | Observé (fichier ouvert) |
|---|---|---|---|
| 1 | Propriétaire | DDTM de Corse-du-Sud | Idem |
| 2 | Contenu | Polygones des feux 1949–2025 | Contours (forme) des feux les plus importants (interprétation cartographique ONF et relevés terrain DDT2A). Ne couvre pas tous les départs de feu. Depuis 2023, alimenté par la BDIFF |
| 3 | Accès | data.gouv.fr, shapefile | Archive zip, sans clé |
| 4 | Granularité | Un feu | Une ligne = un polygone de feu |
| 5 | Historique | 1949–2025 | 1949–1980 (61), 1981–1989 (47), 1990–2024 (1 380) |
| 6 | Fraîcheur | 1990–2024 modifié le 2025-05-14 | Dernier feu : 2024 |
| 7 | Volumétrie | non annoncée | 1 488 polygones au total |
| 8 | Clés | `ID_DDT2A` | Même clé que S02 : 1 368 des 1 380 contours 1990–2024 retrouvent un départ (analyse du 20261120, voir `docs/source-strategy.md`). Dans 1949–1980, `ID_DDT2A` commence par `-` (numéro Prométhée vide) |
| 9 | Historisation | non annoncée | Pas de versions |
| 10 | Données personnelles | non annoncées | Aucune |
| 11 | Licence | Licence Ouverte 2.0 | Confirmée dans les métadonnées XML et par le catalogue (`lov2`) |
| 12 | Millésime | non annoncé | Noms de commune actuels. Pas de code INSEE dans les contours |

## Typologie
Origine : service de l'État · Structure : géographique (polygones) · Production : relevés terrain, ONF · Accès : ouvert · Statut : complément de S02, pas une copie

## Questions servies
Q-ZONE (carte des surfaces brûlées). Utile à M5 (étalonnage de la propagation, hors périmètre noté). **Pas nécessaire aux deux décisions D1 et D2.**

## Profil qualité
| Constat | Chiffre |
|---|---|
| `SURFACE` | **hectares** pour 1990–2024 (rapport médian de 1,0 avec S02 sur 1 121 feux) et pour 1949–1980 (rapport de 0,00012 avec les points de 1973–1980 en m²). Pour 1981–1989 : rapport médian de 1,3 avec les points (41 feux), donc même unité que les points, les hectares |
| `PERIODE` | faute `SASION` dans 1990–2024 : corrigée en `SAISON`, et de toute façon recalculée à partir de la date |
| `MOIS_FEU` | 13 valeurs distinctes dans 1990–2024 (une valeur hors calendrier, probablement `1`) |
| `SOURCE` (1990–2024) | 5 valeurs dont `ONF` |
| Lien avec S02 | surfaces cohérentes quand les deux existent (médiane du rapport 1,0, n = 1 121) |

## Décision
**Garder pour la carte des grands feux dans la dataviz ; non fusionné au modèle des faits.** La fusion ne compléterait que la surface d'environ 130 départs à surface nulle, ce qui ne change aucune des deux décisions. Les contours restent une table séparée, reliée à `FaitDepartFeu` par `ID_DDT2A`.

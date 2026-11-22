# Fiche d'identité : S12 · Occupation du sol (CORINE Land Cover par commune, BD Forêt v2 pour la Corse-du-Sud)

Rempli par : Nessrine Bouzrina · Date : 20261122 · Fichiers : CORINE ouvert (`clc_etat_com_n3.csv` extrait de `clc44.zip`) ; **BD Forêt : archive illisible** (`bdf2a.7z` est tronquée : l'outil 7z signale « next header size exceeds the archive size », le téléchargement est incomplet)

| # | Champ | Annoncé (catalogue) | Observé (fichier ouvert) |
|---|---|---|---|
| 1 | Propriétaire | CORINE : Ministère de la Transition écologique (catalogue) ; BD Forêt : IGN | Idem |
| 2 | Contenu | Occupation du sol | CORINE : superficie en hectares de chaque poste (111, 112, …, 311 forêts de feuillus, 322 landes et broussailles, 323 végétation sclérophylle…) par commune |
| 3 | Accès | data.gouv.fr | Zip de 14 Mo (78 Mo une fois extrait) ; BD Forêt : archive 7z de 13 Mo |
| 4 | Granularité | commune | Une ligne = une commune pour un millésime. Colonne `cog_commune_2010` : **codes du COG 2010** |
| 5 | Historique | 1990–2018 | Millésimes 1990, 2000, 2006, 2012, 2018 |
| 6 | Fraîcheur | non annoncée | Dernier millésime : 2018 |
| 7 | Volumétrie | non annoncée | 286 051 lignes (France entière, tous millésimes). Pour la Corse-du-Sud : 124 communes par jeu. Les millésimes 2000, 2006 et 2012 existent en deux versions, `CLC 2000` et `CLC 2000 révisée` (idem 2006 et 2012) : 8 jeux de 124 communes au total |
| 8 | Clés | code commune | `Code Insee de la commune` (2A001…) |
| 9 | Historisation | non annoncée | Un état par millésime |
| 10 | Données personnelles | non annoncées | Aucune |
| 11 | Licence | Licence Ouverte (CORINE) | Confirmée par le catalogue (`fr-lo`, mise à jour tous les trois ans). BD Forêt : Licence Ouverte 2.0 (`lov2`, catalogue) |
| 12 | Millésime | 1990–2018 | `cog_commune_2010`. Les 124 codes de la Corse-du-Sud pour 1990 et pour 2018 sont les mêmes que ceux du COG 2026 de S10 (même nombre ; comparaison code par code faite pour S11 et S10, pas refaite ici) |

## Typologie
Origine : ministère de la Transition écologique · Structure : tabulaire (CORINE), géographique (BD Forêt) · Production : interprétation d'images satellite · Accès : ouvert · Statut : référence

## Questions servies
Q-ZONE (végétation à risque). Concerne M4 (où concentrer les moyens).

## Profil qualité
- La résolution de CORINE n'est pas documentée dans nos fichiers : on s'en sert uniquement à l'échelle de la commune, jamais pour localiser un point.
- 124 communes de la Corse-du-Sud trouvées pour 1990 et 2018, ce qui correspond au nombre de communes de S10 et S11.
- Le maquis est décrit par les postes 322 (landes et broussailles) et 323 (végétation sclérophylle) : ils sont présents dans les colonnes du fichier, ce qui suffit pour une analyse par commune.

## Choix CORINE ou BD Forêt
**CORINE retenue.** Raisons : (1) le fichier est ouvert, lisible, et donne des superficies par commune et par poste, dont les postes du maquis (322, 323) ; (2) l'archive BD Forêt est tronquée, donc inutilisable en l'état ; (3) les deux décisions D1 et D2 ne demandent qu'un niveau de détail communal. BD Forêt (disponible en WFS sur data.geopf.fr, couche `LANDCOVER.FORESTINVENTORY.V2:formation_vegetale`) reste une piste pour une analyse plus fine après l'étape. Les deux ne sont jamais utilisées pour une même classe.

## Décision
**Garder CORINE**, par commune. Millésime 2018 pour l'état actuel ; pour l'évolution, 2000, 2006 et 2012 en version révisée. Le millésime 1990 n'a pas de version révisée.

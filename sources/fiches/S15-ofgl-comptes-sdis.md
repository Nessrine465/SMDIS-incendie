# Fiche d'identité : S15 · OFGL, comptes des SDIS 2012–2025

Rempli par : Ahmed Mokni · Date : 20261120 · Fichier ouvert : oui, `data/raw/context/ofgl-sdis/ofgl-base-sdis.csv`

| # | Champ | Annoncé (catalogue) | Observé (fichier ouvert) |
|---|---|---|---|
| 1 | Propriétaire | Observatoire des finances et de la gestion publique locales (OFGL) | Idem |
| 2 | Contenu | Comptes des SDIS | Montants par SDIS, exercice et agrégat comptable. Ne contient **ni effectifs, ni véhicules, ni casernes** |
| 3 | Accès | data.gouv.fr, CSV | Téléchargement direct, sans clé |
| 4 | Granularité | SDIS × année × agrégat | Une ligne = un agrégat comptable d'un budget SDIS pour un exercice |
| 5 | Historique | 2012–2025 (titre) ; champ de couverture temporelle annonçant fin 2023 (**conflit**) | Exercices 2012 à 2025 présents (14 années) |
| 6 | Fraîcheur | modifié le 2026-08-13 | Dernière année : 2025 |
| 7 | Volumétrie | non annoncée | 84 420 lignes, 21 colonnes ; 757 lignes pour la Corse-du-Sud |
| 8 | Clés | `Code Département`, `Siren SDIS`, `SIRET Budget` | `Code Département` : `2A` pour la Corse-du-Sud ; un seul budget « SDIS CORSE-DU-SUD » ; 97 départements |
| 9 | Historisation | non annoncée | Un exercice par année, pas de versions |
| 10 | Données personnelles | non annoncées | Aucune (comptes d'une collectivité) |
| 11 | Licence | Licence Ouverte 2.0 | Confirmée par le catalogue (`lov2`, producteur OFGL). Le champ de couverture temporelle du catalogue s'arrête au 2023-12-31 alors que le fichier va jusqu'en 2025 |
| 12 | Millésime | non annoncé | Les colonnes « 2025 » (interventions, population équivalent habitant) sont des valeurs de 2025 répétées sur toutes les années, pas des valeurs de l'année de la ligne |

## Typologie
Origine : collectivités (comptes publics) · Structure : tabulaire · Production : agrégation de comptes · Accès : ouvert · Statut : référence pour l'argent

## Questions servies
D1 (où concentrer les moyens financiers). Sert de paramètre budgétaire de la simulation.

## Profil qualité
- 58 agrégats distincts pour la Corse-du-Sud (dont « Frais de personnel », « Dépenses d'équipement - véhicules », « Dépenses totales »). Certains agrégats contiennent d'autres (par exemple « Dépenses totales » = somme) : **ne pas additionner tous les agrégats**.
- `Montant` : 0 valeur vide pour la Corse-du-Sud.
- La Corse-du-Sud est présente (SDIS CORSE-DU-SUD, population totale 143 724 en 2012) : la question « le SDIS 2A est-il dedans ? » est résolue.

## Champs à garder
| Champ | Question | Perso. ? | Décision | Pourquoi |
|---|---|---|---|---|
| `Exercice`, `Code Département`, `Libellé Budget` | clés | non | garder | |
| `Agrégat`, `Montant`, `Montant en € par habitant` | D1 | non | garder une sélection (frais de personnel, équipement, véhicules, dépenses totales) | |
| `Population totale SDIS`, `Nombre d'interventions 2025` | exposition | non | garder avec la réserve ci-dessus | |
| Colonnes de strate et de catégorie | aucune | non | écarter | |

## Obstacles
Conflit de couverture (titre 2025, métadonnée 2023) : résolu par l'observation, l'année 2025 est présente.

## Décision
**Garder.** Seule source financière. Manque documenté : aucun effectif ni véhicule en nombre.

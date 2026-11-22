# Fiche d'identité : S06 · Météo-France, archives de la Météo des forêts

Rempli par : Ahmed Mokni · Date : 20261120 · Fichiers ouverts : oui, `mdf_2024.csv.gz`, `mdf_2025.csv.gz`, `mdf_2026.csv.gz`, et la présentation PDF (`donnees-expertisees-presentation-meteodesforets-20260909.pdf`)

| # | Champ | Annoncé (catalogue) | Observé (fichier ouvert) |
|---|---|---|---|
| 1 | Propriétaire | Météo-France | Idem (PDF signé Météo-France) |
| 2 | Contenu | Niveau de danger de feu par département | Niveau prévu pour J+1 (`niveau_j1`) et J+2 (`niveau_j2`). **C'est un niveau, pas une valeur d'indice, et c'est une prévision** |
| 3 | Accès | data.gouv.fr, CSV.gz par année | Téléchargement direct, sans clé |
| 4 | Granularité | Département, jour | Une ligne = un département à un jour (96 départements par jour) |
| 5 | Historique | à partir de 2024 | 2024-06-03 à 2024-09-30 (120 jours) ; 2025-06-03 à 2025-09-30 (120 jours) ; 2026-05-28 à 2026-10-05 (131 jours). Saison uniquement |
| 6 | Fraîcheur | quotidienne en saison | Dernier jour 2026-10-05 (au 20261120) |
| 7 | Volumétrie | non annoncée | 11 520 lignes (2024), 11 520 (2025), 12 576 (2026) ; 5 colonnes |
| 8 | Clés | `num_dep` | `num_dep` : `1` en 2024 et 2025, `01` en 2026. Corse-du-Sud : `2A` (120 lignes en 2024, une par jour) |
| 9 | Historisation | non annoncée | Un fichier par saison, pas de correction visible |
| 10 | Données personnelles | non annoncées | Aucune (niveau par département) |
| 11 | Licence | Licence Ouverte 2.0 | Confirmée par le catalogue data.gouv.fr (`lov2`, producteur Météo-France, fréquence quotidienne, début 2024-06-03). Obligation : citer la source |
| 12 | Millésime | non annoncé | Départements actuels. Pas de référentiel de code en dehors de `num_dep` |

## Ce que dit la présentation PDF (lue)
- Échelle à **4 niveaux** : faible, modéré, élevé, très élevé (vert, jaune, orange, rouge). Les niveaux 1 à 4 des fichiers correspondent à cette échelle, dans l'ordre (1 faible, 2 modéré, 3 élevé, 4 très élevé) : hypothèse naturelle, la présentation ne donne pas la table nombre/couleur.
- Diffusée chaque jour à **17 h**, pour le lendemain et le surlendemain. Le champ `date` des fichiers (14:50 UTC en 2025 et 2026 ; l'échantillon de 2024 est à 16:00 UTC) est la date et l'heure du bulletin, pas le jour concerné : le bulletin de 17 h du jour D donne le niveau du lendemain (`niveau_j1`) et du surlendemain (`niveau_j2`). **Règle retenue : le niveau du jour D est le `niveau_j1` du bulletin du jour D−1.** Test sur la saison 2024 de la Corse-du-Sud (119 jours) : avec cette règle, les jours de niveau 1 contiennent un départ de feu dans 23 % des cas (11 jours sur 48), ceux de niveau 2 dans 46 % (31 sur 68), ceux de niveau 3 dans 100 % (3 sur 3) ; en lisant le bulletin du jour D comme le jour D, on obtient 27 %, 43 % et 100 %. Les deux lectures donnent la même conclusion ; on garde celle que la documentation justifie.
- Calcul à partir de l'Indice de danger intégré (dérivé de l'Indice Forêt Météo), plus la surface forestière et les zones sensibles du département. **Le niveau n'est donc pas comparable d'un département à l'autre sans précaution.**
- Disponible à partir du 3 juin jusqu'à l'automne.

## Typologie
Origine : établissement public · Structure : tabulaire · Production : modèle météo · Accès : ouvert · Statut : **référence pour le danger**

## Questions servies
D2, Q-FA, Q-MF, Q-CMP.

## Profil qualité
| Constat | Chiffre | Décision |
|---|---|---|
| Format 2026 différent | séparateur `;` (virgule avant), colonne `nom_dep` (2025 : `dep_nom`), codes `01` au lieu de `1` | le chargeur détecte le séparateur, renomme les colonnes, force `num_dep` en texte de 2 caractères |
| Niveau 4 | 1 ligne (2024), 29 (2025), 99 (2026) en `niveau_j1` | niveau « très élevé » valide ; garder |
| Valeurs vides | 0 en `niveau_j1` dans les trois fichiers | OK |
| Couverture | uniquement juin à septembre en 2024 et 2025 ; du 28 mai au 5 octobre en 2026 | limite : pas d'indice en dehors de la saison |
| Recouvrement avec les feux | feux jusqu'en 2024 seulement : une seule saison commune (2024) | voir `docs/data-solutions.md` ; proxy M1 |

## Champs à garder
| Champ | Question | Perso. ? | Décision | Pourquoi |
|---|---|---|---|---|
| `date` | jointure | non | garder, convertir en date | |
| `num_dep` | jointure | non | garder (texte, 2 caractères) | clé |
| `niveau_j1`, `niveau_j2` | D2 | non | garder | cœur du sujet |
| `nom_dep` / `dep_nom` | aucune | non | écarter | code suffisant |

## Obstacles
Dérive de format entre 2025 et 2026 (séparateur, noms de colonnes, zéro initial) : traité dans le chargeur.

## Décision
**Garder comme référence officielle du danger.** Alignement : `niveau_j1` du bulletin D−1 pour le jour D (voir ci-dessus).

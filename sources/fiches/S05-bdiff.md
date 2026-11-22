# Fiche d'identité : S05 · BDIFF, base nationale des incendies de forêt

Rempli par : Menad Ouassim · Date : 20261122 · Vérifié : fiche du catalogue data.gouv.fr (API) et pages d'aide du portail (`data/raw/context/bdiff-portal/`). **Aucun fichier de données n'existe à télécharger.**

| # | Champ | Annoncé (catalogue) | Observé |
|---|---|---|---|
| 1 | Propriétaire | Ministère de l'Agriculture (portail bdiff.agriculture.gouv.fr) | Idem (mentions légales du portail) |
| 2 | Contenu | Incendies de forêt en France, niveau commune | Portail de consultation : recherche, cartes, indicateurs, graphiques |
| 3 | Accès | data.gouv.fr | **La fiche data.gouv.fr ne contient qu'un lien vers le portail** (une seule ressource, de type « api »). Le portail demande de s'authentifier ou de s'inscrire. Aucun fichier en téléchargement libre |
| 4 | Granularité | commune, annuelle | Non observable sans compte |
| 5 | Historique | 2006–2022 | 2006-01-01 à 2022-12-31 (champ de couverture temporelle du catalogue) |
| 6 | Fraîcheur | modifié le 2025-08-11 (page) | Les données s'arrêtent en 2022 d'après le catalogue |
| 7 | Volumétrie | non annoncée | Non observable |
| 8 | Clés | non annoncées | Non observable |
| 9 | Historisation | non annoncée | Non observable |
| 10 | Données personnelles | non annoncées | L'inscription au portail crée un compte nominatif : à éviter pour un projet de groupe |
| 11 | Licence | Licence Ouverte 2.0 (`lov2`, catalogue) | Confirmée par le catalogue |
| 12 | Millésime | non annoncé | Non observable |

## Typologie
Origine : service de l'État · Structure : tabulaire/géographique · Production : alimentée par les services départementaux (depuis 2023, la BDIFF alimente aussi le numéro `PROMETHEE` de S02 : métadonnées XML) · Accès : sur inscription · Statut : copie nationale

## Questions servies
Q-CMP uniquement en théorie. **En pratique aucune**, voir la décision.

## Décision
**Écartée pour cette étape, et documentée comme manque.** Raisons vérifiées :
1. Aucune donnée n'est téléchargeable sans compte sur le portail.
2. Le catalogue annonce une couverture qui s'arrête en 2022, alors que l'indice officiel (S06) commence en 2024 : il n'y aurait aucun jour commun entre BDIFF et l'indice, donc aucune utilité pour Q-FA, Q-MF ni Q-CMP.
3. Pour la Corse-du-Sud, S02 contient déjà les feux jusqu'en 2024, et reprend la BDIFF depuis 2023.

Conséquence : la réconciliation des totaux de S02 avec une source externe n'est pas faite (voir `docs/modele-cible/04-donnees-concurrentes.md`, section 4). Si le client fournit un accès au portail, l'ajouter comme source de contrôle.

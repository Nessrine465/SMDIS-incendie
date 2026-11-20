# Document de rendu : sources et stack technique

**Projet :** lutte contre les feux de forêt en Corse-du-Sud, client SDIS 2A, saison 2027.
**Groupe :** Menad Ouassim, Ahmed Mokni, Nessrine Bouzrina, El Karimi Yassine
**Dépôt GitHub :** https://github.com/Nessrine465/SMDIS-incendie (branches `main`, `dev`, `progress-tracker`)
**Suivi d'avancement :** https://smdis-progress-tracker.vercel.app (code dans la branche `progress-tracker`, dossier `site/`)

## Sources prévues

| Source | Rôle |
|---|---|
| DDTM 2A, départs de feu 1973–2024 | référence des feux |
| DDTM 2A, contours de feux | surface brûlée et cartes, optionnel |
| BDIFF, Prométhée | réconciliation des totaux annuels (accès à confirmer) |
| Météo-France, archives Météo des forêts (2024+) | niveau de danger officiel |
| Météo-France, climatologie quotidienne | météo, et indice proxy avant 2024 |
| INSEE COG et IGN ADMIN EXPRESS | territoire, avec historique |
| CORINE Land Cover ou BD Forêt (un seul à choisir) | végétation |
| INSEE, populations légales | exposition |
| OFGL, comptes des SDIS | budget |

Manque documenté : aucune donnée sur les effectifs ni les véhicules n'a été trouvée. Dans la simulation, ces valeurs deviennent des paramètres, fixés par des hypothèses documentées ou fournis par le client.

## Stack technique

- **Pipeline :** Python pour le chargement, dbt pour les couches et le schéma en étoile, base de données [à décider].
- **Moteurs (couverture, acheminement, dimensionnement, instructions) :** Python.
- **Modèles prédictifs (M1 à M4) :** Python avec scikit-learn (régression logistique de référence) et XGBoost ou LightGBM (gradient boosting). Validation par découpage temporel, jamais aléatoire.
- **Apprentissage par renforcement (M6, dispatch) :** [bibliothèque à décider], objectif optionnel après le 11 décembre.
- **Simulation et dataviz :** application web interactive hébergée sur Vercel. Elle affiche les résultats et fait tourner les scénarios « et si », sans rien entraîner.

## Solution proposée au client

- Une simulation qui teste chaque moteur sur des feux historiques.
- Des scénarios « et si » : météo différente, plus de personnel, autre positionnement des unités.
- Des indicateurs de comparaison : temps d'arrivée, part du territoire couverte, fausses alertes contre feux manqués.

## État d'avancement

Le moteur d'acheminement n'existe pour l'instant qu'en prototype sur des données fictives. D'ici le 11 décembre, les modèles prédictifs M1 à M4 seront entraînés sur les données du pipeline et reliés à la simulation.

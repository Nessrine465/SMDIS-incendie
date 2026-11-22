# Questions analytiques (version d'étape, 20 novembre 2026)

Client : SDIS 2A (Corse-du-Sud), saison 2027. Chaque question est reliée à une décision, avec son grain, sa période, sa fraîcheur et son périmètre. Les inconnues sont écrites « non vérifié ».

## Les deux décisions
- **D1** : où concentrer les moyens humains et financiers contre les départs de feu ?
- **D2** : à partir de quel niveau de la Météo des forêts déclencher le dispositif renforcé ? (Le seuil actuel se trompe dans les deux sens : jours de danger élevé sans feu, et feux les jours de danger faible.)

## Questions

| ID | Question | Décision | Grain | Période | Fraîcheur visée | Périmètre | Sources |
|---|---|---|---|---|---|---|---|
| Q-FA | Quelle part des jours de danger élevé n'a aucun départ de feu, par seuil ? | D2 | département × jour | juin–septembre ; recouvrement indice/feux : saison 2024 seulement aujourd'hui | à la saison | Corse-du-Sud | S02, S06 |
| Q-MF | Quelle part des départs de feu a lieu un jour de danger faible ? | D2 | départ de feu | 2024 (officiel) ; 1990–2024 (avec proxy M1) | à la saison | Corse-du-Sud | S02, S06, S08 |
| Q-CMP | Comment l'indice se comporte-t-il en Corse-du-Sud, dans les autres départements de la région et en France ? | D2 | département × jour | 2024–2026 | à la saison | 2A, 2B, France | S06 |
| Q-ZONE | Quelles communes ou zones concentrent le plus de départs de feu ? | D1 | commune × année | 1973–2024 | annuelle | Corse-du-Sud | S01, S02, S10, S11, S12 |
| Q-MOY | Quels moyens (budget, personnel, véhicules) sont disponibles et où ? | D1 | SDIS × année | 2012–2025 | annuelle | Corse-du-Sud | S15 ; effectifs et véhicules : **manque** |
| Q-SIM | Que change une meilleure météo ou davantage de personnel sur les temps d'arrivée et la couverture ? | D1, D2 | scénario de simulation | scénarios | sans objet | Corse-du-Sud | tous (paramètres) |

## Ce qui n'est pas répondable aujourd'hui
1. Q-FA et Q-MF n'ont **qu'une saison de recouvrement** (2024) entre indice officiel et feux : 119 jours de la saison, dont 48 de niveau 1, 68 de niveau 2 et 3 de niveau 3. Aperçu : un départ de feu a lieu dans 23 % des jours de niveau 1, 46 % des jours de niveau 2 et 3 jours sur 3 au niveau 3. Pour 1990–2023 il faut le proxy M1, calibré sur 2024–2026, et il restera étiqueté « proxy ». Une donnée météo existe chaque jour de la saison de 1990 à 2024 (au moins un poste de la Corse-du-Sud), donc le proxy est faisable.
2. Q-CMP : le niveau officiel n'est pas comparable d'un département à l'autre sans précaution (le calcul dépend des surfaces forestières du département, selon la présentation de Météo-France). Les feux des autres départements ne sont pas dans nos sources : la comparaison porte sur le niveau d'indice, pas sur les feux.
3. Q-MOY : aucune donnée d'effectifs, de véhicules ou de casernes trouvée.
4. « Les autres départements de la région » : la Corse n'a que 2A et 2B. **Hypothèse retenue** : la comparaison porte sur 2A contre 2B (région) et contre l'ensemble des 96 départements de S06 (France), sans retenir de départements voisins.

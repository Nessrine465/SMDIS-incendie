# Analyse de la commande - Menad Ouassim

Le SDIS 2A prépare la saison feux 2027 et on nous demande deux choses : savoir où mettre les moyens contre les départs de feu, et savoir à partir de quel niveau de la Météo des forêts on lance le dispositif renforcé.

Le seuil actuel ne convient pas : des fois l'indice est haut et il n'y a pas de feu, et des fois des feux partent alors que l'indice est au plus bas. Le budget ne permet pas de renforcer partout tout l'été.

## 1. Questions

1. Quels secteurs du 2A ont le plus de départs de feu, et est-ce que ce sont les mêmes d'une année à l'autre ? (pour décider où placer les patrouilles et le budget)
2. À quelle période de l'année et à quelle heure les feux partent-ils ? (pour décider des dates de la saison et des heures de guet)
3. Quelle part des feux est d'origine humaine (travaux, mégots, écobuage, malveillance) ? (pour voir si la prévention vaut le coup)
4. À partir de quel niveau d'indice les départs de feu augmentent vraiment dans le 2A ? (pour fixer le seuil du dispositif renforcé)
5. Pour chaque niveau d'indice, combien de jours sans aucun feu et combien de feux les jours d'indice bas ? (pour choisir entre déclencher pour rien et ne pas être prêt)
6. Le bon seuil est-il le même sur le littoral, dans le maquis et en montagne ? (pour renforcer seulement certaines zones)
7. L'indice se comporte-t-il pareil dans le 2A, en Haute-Corse, dans le reste du Sud et en France ? (pour reprendre un seuil existant ou en faire un pour le 2A)
8. Qu'est-ce qui fait qu'un feu devient grand (indice, vent, temps d'intervention) ? (pour savoir où la première intervention doit être la plus rapide)
9. 2026 était-elle vraiment pire que les années d'avant ? (pour vérifier l'hypothèse de la direction avant de fixer le budget)

Je n'ai pas gardé les questions du type « combien de feux en France ? » ou « quel est l'indice moyen sur l'année ? », parce que la direction ne ferait rien de différent selon la réponse.

## 2. Termes inconnus

- **SDIS 2A** : service départemental d'incendie et de secours de la Corse-du-Sud.
- **Météo des forêts** : indicateur de Météo-France sur le risque de feu de végétation, par zone et par jour.
- **IFM (indice forêt météo)** : l'indice calculé à partir de la météo (température, humidité, vent, pluie) et de la sécheresse de la végétation.
- **Niveau de danger** : la classe obtenue à partir de l'indice (faible, élevé, très élevé...).
- **Dispositif renforcé** : patrouilles, guet et autres moyens en plus.
- **Massif / zone de prévision** : le découpage géographique pour lequel l'indice est publié.
- **BDIFF** : base de données sur les incendies de forêt en France.
- **Prométhée** : base des incendies de forêt de la zone méditerranéenne.
- **DFCI** : défense des forêts contre l'incendie.
- **Écobuage** : brûlage de la végétation, qui peut déclencher un feu.
- **Grain** : le niveau de détail d'une donnée (un feu, un jour, une commune...).
- **Emprise** : la zone géographique couverte.
- **Fraîcheur** : le délai entre l'événement et le moment où la donnée est disponible.
- **Entrepôt de données** : la base où on rassemble les sources une fois nettoyées.
- **Matrice questions × sources** : tableau qui dit quelle source répond à quelle question.

Dans la suite, « fausse alerte » veut dire jour d'indice élevé sans feu, et « alerte manquée » veut dire feu un jour d'indice bas.

## 3. Besoins

Pour savoir où mettre les moyens :
- chaque départ de feu avec sa commune (ou ses coordonnées), sa date, son heure, sa cause et sa surface ;
- des infos sur le territoire : végétation, relief, population, routes.

Pour fixer le seuil :
- l'indice de chaque jour et de chaque zone sur plusieurs années ;
- les feux aux mêmes dates et dans les mêmes zones pour pouvoir les comparer ;
- les mêmes données pour la Haute-Corse, la région et la France ;
- une définition d'un « jour sans feu », sinon on ne peut pas compter les fausses alertes.

Problèmes possibles :
- les zones de l'indice ne sont pas les communes, donc il faudra une table de correspondance ;
- les feux sont saisis après coup, avec des causes inconnues ou des lieux approximatifs ;
- les dernières années peuvent être incomplètes.

## 4. Données

| Questions | Donnée idéale | Grain | Période | Fraîcheur | Emprise | Source possible |
|---|---|---|---|---|---|---|
| 1, 2, 3, 8 | Départs de feu (date, heure, lieu, cause, surface) | un feu par ligne | 10 ans ou plus, jusqu'à 2026 | mise à jour en fin de saison au moins | Corse (2A et 2B) | BDIFF / Prométhée, interventions du SDIS 2A |
| 4, 5, 6 | Indice et niveau de danger | par jour et par zone | même période | quotidienne | Corse, puis région et France | Météo-France |
| 4, 5 | Température, humidité, vent, pluie | par jour (ou par heure) | même période | quotidienne | Corse | Météo-France |
| 1, 6 | Correspondance commune / zone de prévision | une commune par ligne | version actuelle | à jour | Corse | Météo-France, IGN |
| 1, 6, 8 | Occupation du sol, végétation, relief | parcelle ou maille | dernière version | annuelle | Corse | Corine Land Cover, IGN |
| 7 | Feux et indice des autres départements | un feu ou un jour par zone | même période | comme la Corse | départements du Sud, puis France | BDIFF, Météo-France |
| 9 | Historique des saisons (nombre de feux, surfaces, jours d'indice élevé) | par saison | 10 ans ou plus | fin de saison | Corse-du-Sud | calculé à partir des autres sources |

Pour commencer, trois sources suffisent : les feux, l'indice par jour et par zone, et la table de correspondance commune / zone. Avec elles on peut déjà répondre aux questions 1, 4, 5 et 7.

Les sources sont des pistes, il faut encore vérifier l'accès, la licence et le grain exact de chacune.

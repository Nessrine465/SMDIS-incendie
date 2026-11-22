# Feux de forêt en Corse-du-Sud (SDIS 2A)

**Région :** Corse (département de la Corse-du-Sud, 2A, et Haute-Corse, 2B, pour la comparaison régionale)

**Contexte :** le SDIS 2A prépare la saison feux 2027. Le projet doit aider la direction à décider
(1) où concentrer les moyens humains et financiers contre les départs de feu et
(2) à partir de quel niveau de la Météo des forêts déclencher le dispositif renforcé.

Le détail de la commande est dans `Exercice 1 - De la commande aux données - Corse.pdf`.
Version d'étape du 22 novembre 2026, susceptible d'évoluer.

## Équipe et rôles

| Membre | Rôle | Responsable de |
|---|---|---|
| Menad Ouassim | Chef de projet | dépôt, README, questions analytiques, données concurrentes ; sources S01, S02, S05 |
| Ahmed Mokni | Responsable sources | glossaire, matrice questions × sources ; sources S06, S15 |
| Nessrine Bouzrina | Responsable qualité et conformité | lineage, annexe des sources, table de correspondance des stations météo ; sources S03, S08, S12 |
| Yassine El Karimi | Responsable pipeline et modèle | diagramme du modèle cible, alignement, tests de la dimension territoire ; sources S10, S11 |

Un rôle veut dire posséder et relire un domaine, pas seulement y travailler : chacun code, committe et profile des données. Tout changement de rôle est consigné ici.

## Branches
- `main` : versions rendues.
- `dev` : intégration ; le travail de chaque membre y est déposé.
- `progress-tracker` : code du suivi d'avancement (https://smdis-progress-tracker.vercel.app).
- Travail courant : une branche `<prénom>/<sujet>` par lot, puis fusion dans `dev`.

## Où trouver quoi
| Document demandé | Fichier |
|---|---|
| Analyses individuelles de la commande | `docs/analyse/commande-prenom-nom.md` |
| Questions analytiques | `docs/analyse/questions-analytiques.md` |
| Glossaire | `docs/analyse/glossaire.md` |
| Matrice questions × sources | `docs/analyse/matrice-questions-sources.md` |
| Description des sources (fiches d'identité) | `sources/fiches/` (une fiche par source) |
| Modèle cible, partie 1 : diagramme | `docs/modele-cible/01-diagramme.md` |
| Modèle cible, partie 2 : lineage | `docs/modele-cible/02-lineage.md` |
| Modèle cible, partie 3 : alignement et données concurrentes | `docs/modele-cible/03-alignement.md`, `docs/modele-cible/04-donnees-concurrentes.md` |
| Annexe : liste des sources | `docs/modele-cible/05-annexe-sources.md` |
| Stack et sources prévues | `docs/Stack-and-sources.md` |
| Pipeline | `pipeline/` (stations météo : `pipeline/weather/`, territoire : `pipeline/territory/`) |

## État du travail
- **Fait :** fiches de sources remplies avec les fichiers ouverts (neuf sources utilisées ; BDIFF et BD Forêt examinées et écartées, avec la raison) ; questions, glossaire, matrice ; modèle cible (diagramme, lineage, alignement, données concurrentes, annexe) ; dimension territoire historisée (251 lignes) avec six tests ; table de correspondance des stations météo (104 postes sur 252 en Corse-du-Sud).
- **Constats principaux :** le niveau de danger officiel n'existe que depuis 2024, donc une seule saison commune avec les feux (119 jours, dont 3 au niveau 3) ; les identifiants de feux ne sont pas uniques (172 identifiants sur 816 lignes : 22 699 lignes brutes, 22 080 après déduplication) ; les surfaces de 1973–1980 sont en m² et celles de 1981–2024 en hectares ; une donnée météo existe chaque jour de la saison de 1990 à 2024, donc un indice proxy est faisable ; aucune donnée d'effectifs ni de véhicules : ces valeurs deviennent des paramètres de simulation.
- **Prochaines étapes :** charger les faits dans les couches raw, staging et consolidée ; construire et valider le proxy d'indice ; entraîner les modèles M1 à M4 ; relier la simulation aux données.

## Données brutes
Les données brutes (325 Mo) ne sont pas dans le dépôt. Chaque fiche donne l'origine du fichier.

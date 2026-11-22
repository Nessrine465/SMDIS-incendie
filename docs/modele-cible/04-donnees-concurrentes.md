# Modèle cible, partie 3b : données concurrentes (version d'étape)

Quand deux versions d'une même donnée existent, on dit laquelle est gardée et pourquoi. Aucune moyenne ni mélange sans règle écrite. Les nombres ci-dessous sont mesurés sur les fichiers.

## 1. Doublons dans les départs de feu
Les métadonnées de la DDTM affirment que `ID_DDT2A` (numéro Prométhée + date) est unique. **Les données le contredisent** : dans S02 (1990–2024), 172 identifiants apparaissent plusieurs fois, sur 816 lignes (644 lignes en trop). Dans S01, 1 identifiant par fichier.

Les 172 groupes se répartissent ainsi :
| Type de groupe | Nombre | Interprétation | Règle |
|---|---|---|---|
| Lignes strictement identiques | 68 | doublon exact | garder une ligne |
| Même identifiant, même commune, même heure, attributs différents (`LIEU_DIT`, `PR_4`, `CODE_CAR`, `SOURCE`, `CAUSE`, `SURFACE`) | 77 | le même feu décrit deux fois | garder une ligne, choisie par la règle de survie ci-dessous |
| Même identifiant, commune ou heure différente | 27 | **feux distincts** (exemple : le numéro 3900 du 30/06/2006 existe pour FOCE, 0,08 ha, et pour PORTO-VECCHIO, 0,30 ha) | garder les deux lignes |

**Clé retenue :** (`ID_DDT2A`, code commune, heure du feu). Résultat : **22 699 lignes brutes, 22 080 après déduplication** (619 lignes retirées) ; S02 seul : 13 191 vers 12 574.

**Règle de survie** (quand plusieurs lignes ont la même clé), dans cet ordre :
1. `SOURCE` : `DDT2A` d'abord (constaté sur le terrain par les agents), puis `ONF`, puis `OPENDFCI2A`, puis `PROMETHEE`. Justification : les métadonnées décrivent DDT2A comme le constat de terrain, et Prométhée comme un export dont certains attributs ont été ressaisis à la main.
2. Cause renseignée (différente de `0`) avant cause inconnue.
3. Surface supérieure à 0 avant surface nulle.
4. À égalité, la première ligne du fichier.

## 2. Mélange de séries dans S02
La colonne `SOURCE` mêle DDT2A, PROMETHEE et OPENDFCI2A, et la répartition change selon la décennie (années 1990 : DDT2A 4 642, PROMETHEE 686 ; années 2000 : PROMETHEE 2 354, DDT2A 1 627 ; années 2010 : PROMETHEE 2 291, DDT2A 635 ; années 2020 : DDT2A 585, OPENDFCI2A 295, PROMETHEE 71). Les feux par an passent de 777 (1990) à 122 (2024). **Aucune conclusion de tendance n'est tirée** : le changement de saisie peut suffire à l'expliquer, et seule une décomposition par source et par année pourrait le trancher. Règle : garder `SOURCE` comme traçabilité dans le fait.

## 3. Départs de feu (S02) contre contours de feux (S03)
Complémentaires : S03 ne couvre que les grands feux. Quand les deux ont une surface, elles concordent (médiane du rapport 1,0 sur 1 121 feux ; 1 368 des 1 380 contours retrouvent un départ). **Règle : S02 est la référence ; S03 reste une table séparée pour la carte des grands feux**, et sa surface pourrait compléter les environ 130 départs de surface nulle, ce que nous ne faisons pas parce que cela ne change aucune des deux décisions.

## 4. Total de S02 contre un chiffre externe
Les trois fichiers donnent 22 699 départs pour 1973–2024. Une page de préfecture trouvée par recherche parle de « plus de 17 790 feux de forêt depuis 1973 » (date non précisée).
| Variante | Nombre |
|---|---|
| Lignes brutes, tous types | 22 699 |
| Après déduplication, tous types | 22 080 |
| Brutes, feux de forêt seuls (`FF` ou `FORET`) | 18 924 |
| **Après déduplication, feux de forêt seuls** | **18 382** |

Le cumul des feux de forêt dédupliqués atteint 17 721 fin 2019 et 17 867 fin 2020 : **le chiffre de la préfecture est cohérent avec un comptage des feux de forêt seuls, dédupliqués, arrêté vers 2020**, et non avec les 22 699 lignes brutes. C'est l'explication la plus simple de l'écart ; elle n'est pas démontrée, puisque la date de la page est inconnue. Conclusion pour le projet : le nombre de « feux » dépend de la définition (feux de forêt seuls ou tous types) et de la déduplication, et chaque résultat doit dire laquelle il utilise.

BDIFF (S05) n'est pas disponible (voir sa fiche), donc aucune réconciliation par commune n'est faite.

## 5. Contours : plusieurs périodes
S03 est en trois fichiers (1949–1980, 1981–1989, 1990–2024) sans recouvrement d'années : empilement simple, sans règle de survie.

## 6. Population : plusieurs dates dans S11
La population est de 2022 ou de 2023 selon la commune. Règle : garder la valeur et la date de recensement ensemble, sans les harmoniser.

## 7. Météo : fichier ancien et fichier récent (S08)
Les fichiers couvrent 1950–2024 et 2025–2026 : aucune date en commun. Pas de règle de survie nécessaire.

## 8. CORINE : version et version révisée
Pour 2000, 2006 et 2012, S12 contient deux jeux (`CLC 2000` et `CLC 2000 révisée`, etc.). Règle : garder la version révisée ; 1990 et 2018 n'en ont qu'une.

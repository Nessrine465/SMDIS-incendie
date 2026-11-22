# Glossaire (version d'étape, 20 novembre 2026)

« Non vérifié » signifie que le sens n'a pas été confirmé avec la source ouverte.

## Métier
| Terme | Définition |
|---|---|
| SDIS | Service départemental d'incendie et de secours ; ici le SDIS 2A (Corse-du-Sud), client |
| DDTM | Direction départementale des territoires et de la mer ; produit les fichiers de départs de feu de la Corse-du-Sud |
| DFCI | Défense des forêts contre l'incendie ; grille 2 × 2 km utilisée pour localiser un départ de feu |
| ONF | Office national des forêts ; apparaît dans les valeurs de `SOURCE` |
| Départ de feu | Début d'un incendie enregistré à une date, une heure et un lieu |
| Posture renforcée | Dispositif accru (personnel et moyens) déclenché à partir d'un niveau de danger. Le contenu précis de ce dispositif n'est pas dans nos sources ; la simulation le paramètre (nombre d'unités et de personnels mobilisés) |
| Maquis | Végétation arbustive méditerranéenne très présente en Corse ; décrite par les classes CORINE 322 et 323 |
| `FF` | Valeur de `TYPE_FEU` : feu de forêt (métadonnées DDTM 2A). Devient `FORET` à partir de 2023 |
| `AFERPU` | Valeur de `TYPE_FEU` : autres feux urbains ou péri-urbains. Devient `VEGETATION` à partir de 2023 (brûlis de chaume, feux agricoles, autres surfaces) |
| `FV` | Valeur de `TYPE_FEU` rencontrée seulement en 2024 (45 lignes) ; non définie dans les métadonnées, traitée comme `VEGETATION` |
| Saison (`SAISON`) | Du 15 juin au 30 septembre depuis l'arrêté de juin 2018 ; avant, une autre règle |
| `SOURCE` | Origine d'un départ de feu : `DDT2A` (constaté sur le terrain), `ONF` (grands feux, interprétation cartographique), `PROMETHEE`, `OPENDFCI2A` (à partir de 2022) |

## Météo et indice
| Terme | Définition |
|---|---|
| Météo des forêts | Dispositif d'information de Météo-France, diffusé depuis 2023 : niveau de danger de feu par département pour le lendemain et le surlendemain |
| Niveau de danger | Échelle à 4 niveaux : faible, modéré, élevé, très élevé (vert, jaune, orange, rouge) |
| `niveau_j1`, `niveau_j2` | Niveau prévu pour le lendemain (J+1) et le surlendemain (J+2) dans les fichiers S06 |
| IFM (Indice Forêt Météo) | Indice météorologique de danger de feu (température, humidité, vent, pluie) |
| Indice de danger intégré | Indice de Météo-France construit à partir de l'IFM et de l'état de sécheresse de la végétation |
| Proxy | Indicateur que nous reconstruisons nous-mêmes pour les années sans indice officiel ; toujours étiqueté « proxy » |

## Sources et référentiels
| Terme | Définition |
|---|---|
| Prométhée | Base de données des feux de forêt des départements méditerranéens de la France. Source de nombreux départs de feu de S01 et S02 ; la base elle-même n'est pas consultée par le projet |
| OpenDFCI | Outil de la défense des forêts ; une des valeurs de `SOURCE` dans S02 |
| BDIFF | Base de données nationale sur les incendies de forêt, au niveau de la commune |
| COG | Code officiel géographique de l'INSEE (communes, départements, historique) |
| ADMIN EXPRESS | Limites administratives de l'IGN |
| CORINE Land Cover | Occupation du sol européenne, par poste de nomenclature |
| BD Forêt | Cartographie des formations végétales de l'IGN |
| Licence Ouverte 2.0 | Licence Etalab : réutilisation libre, avec obligation de citer la source |

## Modèle de données
| Terme | Définition |
|---|---|
| Grain | Ce que représente une ligne d'une table (par exemple : un départ de feu) |
| Schéma en étoile | Tables de faits entourées de dimensions |
| Dimension de type 2 (SCD2) | Dimension qui garde l'historique par des dates de début et de fin de validité |
| Millésime | Année de référence des données ou du code de référence (par exemple COG 2026) |
| Lineage | Chemin d'une donnée de sa source jusqu'au modèle cible, avec ses transformations |
| Table de correspondance (crosswalk) | Table qui relie deux codes pour la même chose (par exemple `20004` et `2A004`) |
| Survie (règle de survivance) | Règle qui dit quelle valeur garder quand deux sources diffèrent |
| Couches raw, staging, intermediate, marts | Données brutes, typées et renommées, consolidées, puis tables finales |
| Modèles M1 à M7 | M1 indice proxy, M2 risque quotidien, M3 analyse du seuil, M4 où concentrer les moyens ; M5 à M7 optionnels (propagation, dispatch, satellite) |

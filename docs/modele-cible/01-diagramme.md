# Modèle cible, partie 1 : diagramme (version d'étape)

Schéma en étoile, représenté en diagramme de classes UML (Mermaid, affiché directement par GitHub). Chaque fait a un grain écrit en une phrase. Les mesures sont classées : additive, semi-additive ou non additive.

```mermaid
classDiagram
    class FaitDepartFeu {
        +id_depart_cle
        +date_key
        +heure
        +territory_key
        +type_feu_key
        +cause_key
        +source_key
        +surface_ha  [additive, en hectares]
        +nb_depart  [additive, = 1]
    }
    class FaitNiveauDanger {
        +date_key
        +departement_key
        +niveau_j1  [non additive, 1 à 4]
        +niveau_j2  [non additive, 1 à 4]
    }
    class FaitMeteoJour {
        +date_key
        +station_key
        +tx  [non additive, °C]
        +rr  [additive sur le temps, mm]
        +ffm  [non additive, m/s]
        +humidite  [non additive]
    }
    class FaitBudgetSdis {
        +exercice
        +sdis_key
        +agregat_key
        +montant_eur  [semi-additive : ne pas sommer les agrégats imbriqués]
    }
    class FaitOccupationSol {
        +millesime
        +territory_key
        +classe_sol_key
        +superficie_ha  [additive sur les classes]
    }
    class DimDate {
        +date_key
        +date
        +annee
        +mois
        +saison  [juin à septembre]
    }
    class DimTerritoire {
        +territory_key
        +commune_code
        +nom
        +departement_code
        +valid_from
        +valid_to
        +is_current
        +current_code
    }
    class DimStation {
        +station_key
        +num_poste
        +nom
        +lat
        +lon
        +alti
        +departement_code
    }
    class DimNiveauDanger {
        +niveau
        +libelle  [faible, modéré, élevé, très élevé]
    }
    class DimTypeFeu {
        +type_feu_key
        +code  [FORET ou AUTRE_VEGETATION]
    }
    class DimCause {
        +cause_key
        +code  [0 = inconnue]
    }
    class DimSourceFeu {
        +source_key
        +nom  [DDT2A, PROMETHEE, OPENDFCI2A, ONF]
    }
    class DimAgregat {
        +agregat_key
        +libelle
        +parent  [hiérarchie]
    }
    class DimClasseSol {
        +classe_sol_key
        +code_clc
        +libelle
    }

    FaitDepartFeu --> DimDate
    FaitDepartFeu --> DimTerritoire
    FaitDepartFeu --> DimTypeFeu
    FaitDepartFeu --> DimCause
    FaitDepartFeu --> DimSourceFeu
    FaitNiveauDanger --> DimDate
    FaitNiveauDanger --> DimTerritoire : département
    FaitNiveauDanger --> DimNiveauDanger
    FaitMeteoJour --> DimDate
    FaitMeteoJour --> DimStation
    DimStation --> DimTerritoire : commune d'implantation
    FaitBudgetSdis --> DimAgregat
    FaitOccupationSol --> DimTerritoire
    FaitOccupationSol --> DimClasseSol
```

## Grain de chaque fait
| Fait | Grain (une ligne = …) | Source |
|---|---|---|
| `FaitDepartFeu` | un départ de feu enregistré, après déduplication | S01, S02 |
| `FaitNiveauDanger` | un département pour un jour de la saison | S06 |
| `FaitMeteoJour` | un poste météo pour un jour | S08 |
| `FaitBudgetSdis` | un agrégat comptable d'un SDIS pour un exercice | S15 |
| `FaitOccupationSol` | une classe d'occupation du sol d'une commune pour un millésime | S12 |

## Dimension territoire de type 2
`DimTerritoire` garde l'historique : chaque commune a une ligne par version valide (par exemple `20004` jusqu'au 31/12/1975 puis `2A004` à partir du 01/01/1976), avec `valid_from`, `valid_to` et `current_code`. Un fait est relié à la version valide à sa date. Données construites : 251 lignes (`data/staging/territory/dim_territory.csv`).

## Ce qui est construit
- `DimTerritoire` : 251 lignes (`pipeline/territory/build_dim_territory.py`), validée par six tests (`pipeline/territory/test_dim_territory.py`, tous réussis : clé unique, périodes sans chevauchement ni trou, une version courante par commune, 124 communes égales à S11, anciens codes présents).
- `DimStation` : 252 postes dont 104 en Corse-du-Sud (`pipeline/weather/build_station_crosswalk.py`, sortie `data/staging/weather/station_crosswalk.csv`).
- Les tables de faits sont définies par leurs règles dans `02-lineage.md` ; elles seront chargées par le pipeline (étape suivante du plan : v0.1 du pipeline).

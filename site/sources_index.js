(window.SRC = window.SRC || {})["S06"] = {
  name: "Météo des forêts, archives",
  publisher: "Météo-France (via data.gouv.fr)",
  what: "Niveau de danger météo-feu quotidien par département, prévu à J+1 et J+2. Un niveau de 1 à 4, pas une valeur d'indice continue.",
  links: [
    { label: "Page du jeu de données (data.gouv.fr)", url: "https://www.data.gouv.fr/datasets/archives-de-la-meteo-des-forets" }
  ],
  got: [
    { item: "mdf_2024, mdf_2025, mdf_2026 (CSV.gz)", detail: "11 520 / 11 520 / 12 576 lignes, 96 départements chacun" },
    { item: "Couverture", detail: "2024-06-03 à 2026-10-05 ; environ 120 à 131 dates par saison" },
    { item: "Colonnes", detail: "date, num_dep, niveau_j1, niveau_j2, nom du département" },
    { item: "Corse-du-Sud (2A)", detail: "Présent dans les trois fichiers, avec ses propres lignes" },
    { item: "Compléments : GeoJSON, PDF, zip d'échantillons", detail: "Limites des départements et définitions des niveaux ; PDF pas encore lu" }
  ],
  caveats: [
    "Le fichier 2026 utilise des points-virgules et change un nom de colonne ; le chargeur doit s'adapter.",
    "Les niveaux observés vont de 1 à 4 ; leur sens officiel est non vérifié.",
    "La date est un horodatage du bulletin ; le jour concerné est non vérifié."
  ]
};

(window.SRC = window.SRC || {})["S08"] = {
  name: "Climatologie quotidienne de base (Corse, code 20)",
  publisher: "Météo-France (via data.gouv.fr)",
  what: "Mesures quotidiennes des stations : pluie, température, vent et humidité. Notre source météo, et la base d'un indice de danger approché avant 2024.",
  links: [
    { label: "Page du jeu de données (data.gouv.fr)", url: "https://www.data.gouv.fr/datasets/donnees-climatologiques-de-base-quotidiennes" }
  ],
  got: [
    { item: "Fichier précédent, 1950-2024 (pluie/temp./vent)", detail: "1 786 257 lignes, 248 stations, jusqu'au 2024-12-31" },
    { item: "Dernier fichier, 2025-2026 (pluie/temp./vent)", detail: "38 238 lignes, 58 stations, jusqu'au 2026-11-18" },
    { item: "Fichiers des autres paramètres (humidité, ensoleillement)", detail: "1 068 908 lignes avant 2025 ; 37 595 depuis ; jusqu'au 2026-11-19" },
    { item: "Champs : RR, TX, TN, FFM, UM", detail: "Pluie, température max. et min., vent, humidité" },
    { item: "Descriptions des champs (2 fichiers CSV)", detail: "Définition de chaque colonne, enregistrée avec les données" }
  ],
  caveats: [
    "Le code 20 couvre toute la Corse ; 2A et 2B ne sont pas séparés dans les fichiers.",
    "Nombreuses lacunes : environ la moitié des lignes avant 2025 n'ont pas de TX.",
    "L'humidité UM est renseignée dans environ 29 % des lignes avant 2025."
  ]
};

(window.SRC = window.SRC || {})["S15"] = {
  name: "Comptes des SDIS 2012-2025",
  publisher: "OFGL (via data.gouv.fr)",
  what: "Comptes budgétaires annuels de chaque service départemental d'incendie et de secours (SDIS), par agrégat comptable. Notre seule source financière.",
  links: [
    { label: "Page du jeu de données (data.gouv.fr)", url: "https://www.data.gouv.fr/datasets/comptes-des-sdis-2012-2025" }
  ],
  got: [
    { item: "ofgl-base-sdis.csv", detail: "84 420 lignes, CSV à points-virgules, années 2012 à 2025, 97 départements" },
    { item: "SDIS CORSE-DU-SUD (2A)", detail: "Présent : 757 lignes, chaque année de 2012 à 2025" },
    { item: "Agrégats", detail: "63 types, p. ex. dépenses totales, charges de personnel, équipement, dette" },
    { item: "Montants", detail: "Euros et euros par habitant ; 2A en 2024 : 36,9 M€ de dépenses totales" },
    { item: "Colonnes de contexte", detail: "Population, nombre d'interventions 2025, tranche d'effectif" }
  ],
  caveats: [
    "Finances uniquement : aucun effectif, véhicule ou caserne dans ce fichier.",
    "Le catalogue indiquait 2023 mais le fichier contient 2025 ; le fichier prévaut.",
    "Le nombre d'interventions et la tranche d'effectif sont des valeurs 2025 répétées sur chaque année."
  ]
};

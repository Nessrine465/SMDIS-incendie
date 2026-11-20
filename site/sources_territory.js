(window.SRC = window.SRC || {})["S10"] = {
  name: "Code officiel géographique (COG)",
  publisher: "INSEE",
  what: "Liste officielle des communes françaises depuis 1943, avec fusions et changements de code. Elle donne à chaque commune de Corse-du-Sud un code stable dans le temps.",
  links: [
    {label: "COG INSEE sur data.gouv.fr", url: "https://www.data.gouv.fr/datasets/code-officiel-geographique-1"}
  ],
  got: [
    {item: "v_commune_2026.csv", detail: "124 communes en 2A (236 en 2B, hors périmètre)"},
    {item: "v_commune_depuis_1943.csv", detail: "42 333 lignes d'historique des communes, France entière"},
    {item: "dim_territory.csv (intermédiaire)", detail: "251 lignes de dimension, dont 124 actuelles"},
    {item: "crosswalk.csv (intermédiaire)", detail: "124 lignes reliant anciens codes et codes actuels"},
    {item: "events.csv (intermédiaire)", detail: "131 événements, comme les fusions et la scission 2A/2B de 1976"}
  ],
  caveats: [
    "Avant 1976, la Corse est le département 20 ; les codes 20xxx deviennent 2A/2B.",
    "Les codes sont du texte avec des lettres ; ne jamais les convertir en nombres.",
    "Le millésime doit correspondre aux limites de S11."
  ]
};

(window.SRC = window.SRC || {})["S11"] = {
  name: "ADMIN EXPRESS",
  publisher: "IGN",
  what: "Limites officielles des communes et départements. Elles servent à placer chaque feu dans une commune par jointure spatiale.",
  links: [
    {label: "ADMIN EXPRESS sur data.gouv.fr", url: "https://www.data.gouv.fr/datasets/admin-express-admin-express-cog-admin-express-cog-carto-admin-express-"}
  ],
  got: [
    {item: "communes_2A.geojson", detail: "11,2 Mo, 124 entités communales (MultiPolygon, WGS84)"},
    {item: "Attributs", detail: "nom, code INSEE, population, SIREN, canton, code postal, superficie"},
    {item: "Licence du jeu de données", detail: "Licence Ouverte 2.0, modifié le 2026-11-19 (selon l'inventaire)"}
  ],
  caveats: [
    "Limites actuelles seulement : pas d'historique des anciennes communes.",
    "La méthode de téléchargement (WFS) ne donne que l'extrait 2A.",
    "Millésime par rapport au COG S10 : pas encore vérifié."
  ]
};

(window.SRC = window.SRC || {})["S12"] = {
  name: "Occupation du sol : CORINE Land Cover et BD Forêt",
  publisher: "non vérifié (voir les pages des jeux de données)",
  what: "Cartes de ce qui couvre le sol (forêt, maquis, urbain). Elles montrent quelle végétation peut brûler. Il reste à choisir l'une des deux.",
  links: [
    {label: "CORINE Land Cover", url: "https://www.data.gouv.fr/datasets/corine-land-cover-occupation-des-sols-en-france"},
    {label: "BD Forêt", url: "https://www.data.gouv.fr/datasets/bd-foret-r"}
  ],
  got: [
    {item: "clc44.zip", detail: "Archive de 14,2 Mo, contient un CSV"},
    {item: "clc_etat_com_n3.csv", detail: "78,5 Mo, 286 048 lignes commune-année, France entière ; 124 sont en 2A"},
    {item: "Années CLC", detail: "1990, 2000, 2006, 2012, 2018 ; hectares par classe, par commune"},
    {item: "bdf2a.7z (BD Forêt v2, 2A)", detail: "13,7 Mo, pas encore ouvert"}
  ],
  caveats: [
    "Choisir une seule source ; ne pas mélanger les deux pour une même classe.",
    "Couvre-t-elle bien le maquis ? Non vérifié.",
    "CLC est un état de 2018 ; millésime BD Forêt non vérifié."
  ]
};

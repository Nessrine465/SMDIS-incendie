# Analyse de la commande — Ahmed Mokni

## 1. Les questions

La direction du SDIS 2A prépare la saison feux 2027 (réponse attendue le 11 décembre 2026) et doit arbitrer deux points : où concentrer les moyens humains et financiers, et à partir de quel niveau de la Météo des forêts déclencher le dispositif renforcé. Le budget interdit un renforcement permanent sur tout le département.

| ID | Question | Décision rendue possible |
|---|---|---|
| Q1 | Dans quelles communes ou secteurs de Corse-du-Sud, et à quelles périodes de l'été, les départs de feu et leurs conséquences (surface brûlée, durée, enjeux touchés) sont-ils les plus fréquents ? | Choisir les secteurs et les semaines où concentrer patrouilles, guet et investissements. |
| Q2 | Dans ces secteurs, quels sont les délais d'arrivée des premiers moyens et la disponibilité des équipes par centre ? | Prépositionner équipes et véhicules, ajuster horaires et renforts. |
| Q3 | Pour chaque niveau de la Météo des forêts, quelle part des jours compte au moins un départ de feu, et quelle est la gravité de ces feux ? | Juger si l'indice est assez discriminant pour piloter le déclenchement. |
| Q4 | Pour chaque seuil possible, combien de jours aurait-il déclenché le dispositif (avec feu / sans feu), et pour quel coût en moyens ? | Comparer les seuils et arbitrer entre couverture du risque et budget. |
| Q5 | Les feux survenus aux niveaux les plus bas se concentrent-ils sur certains lieux, périodes, causes ou conditions (vent, sécheresse locale) ? | Prévoir des mesures ciblées complémentaires là où l'indice départemental ne suffit pas. |
| Q6 | La relation entre niveau annoncé et feux observés est-elle la même en Corse-du-Sud, en Haute-Corse et dans les départements comparables du reste du territoire ? | Décider si le seuil national convient ou s'il faut l'adapter localement. |
| Q7 | Quels scénarios de renforcement sont tenables avec les effectifs et le budget 2027, y compris si la saison dépasse celle de 2026 ? | Retenir un dispositif réaliste et constituer une réserve mobilisable. |

Écartées : « combien de feux en France ? » ou « quelle est la météo moyenne en Corse ? » ne changent aucune décision de la direction.

## 2. Les termes inconnus ou à clarifier

Définitions de travail, à confirmer avec le SDIS et les sources officielles (contribution au glossaire du groupe).

| Terme | Définition de travail / point à vérifier |
|---|---|
| SDIS 2A | Service départemental d'incendie et de secours de la Corse-du-Sud, commanditaire. |
| Départ de feu | Début d'incendie. À préciser : forêt seule ou aussi maquis, garrigue, espaces agricoles ? Différence entre feu, intervention et fausse alerte ? |
| Météo des forêts | Prévision du danger météorologique de feu de végétation produite par Météo-France. Vérifier niveaux, maille (département, zone), horizon, heure de publication, archives. Ce n'est pas une prédiction de départ de feu. |
| Indice / niveau de danger | La commande dit « indice » : confirmer qu'il s'agit bien du niveau de la Météo des forêts et pas d'un indice brut (IFM). |
| Seuil de déclenchement | Niveau à partir duquel le dispositif renforcé est activé. Quel est le seuil actuel, sur quelle maille, avec quelles exceptions ? |
| Dispositif renforcé | Patrouilles, guet, etc. : liste exacte, moyens mobilisés et coût par activation à obtenir. |
| Faux positif / faux négatif | Faux positif : jour déclenché sans feu. Faux négatif : feu un jour non déclenché. Les chefs de centre décrivent les deux. |
| Gravité | À définir : surface brûlée, durée d'intervention, moyens engagés, enjeux touchés. |
| Délai d'arrivée | Intervalle entre alerte et arrivée des premiers moyens ; à distinguer du délai de départ et de la durée d'intervention. |
| Vacation | Période de service d'une équipe ; sert à mesurer la disponibilité des moyens. |
| BDIFF | Base de données sur les incendies de forêt en France : source nationale de feux à vérifier (couverture, mise à jour, définitions). |
| Prométhée | Base régionale des feux de forêt de l'arc méditerranéen : à vérifier, notamment les périodes couvertes. |
| Saison commune | Saisons où feux et archives de l'indice existent tous deux ; condition d'une comparaison valable. |
| Région / territoire de comparaison | « Autres départements de la région » : Haute-Corse seule, ou aussi le pourtour méditerranéen ? À valider avec la direction. |
| « Autant, voire davantage » qu'en 2026 | Hypothèse de planification de la direction, non démontrée : à traiter par scénarios. |

## 3. Les besoins

**Besoins métier**
- Une réponse chiffrée à la question du seuil : taux de jours avec feu par niveau, avec effectifs.
- Une cartographie des secteurs et des périodes à risque avec leurs délais d'intervention.
- Un comparatif de scénarios de renforcement chiffrés (jours déclenchés, moyens, coût).
- Un positionnement de la Corse-du-Sud par rapport à la Haute-Corse et au national.

**Besoins data**
- Rapprocher feux, niveau de l'indice et activations sur un même grain (département-jour) sans multiplier les lignes quand un jour compte plusieurs feux.
- Utiliser pour chaque jour le niveau réellement connu au moment de la décision (dernière émission avant déclenchement), pas une valeur révisée a posteriori.
- Garder aussi les jours sans feu : sans eux, aucun taux n'est calculable.
- Conserver provenance, date d'extraction et règles de transformation de chaque source.

**Contraintes et précautions**
- Qualité : doublons, coordonnées, dates, fuseaux horaires, unités de surface, valeurs manquantes, changements de définition entre années, codes communes/départements.
- Statistique : présenter les effectifs et l'incertitude, surtout pour les niveaux ou territoires peu représentés ; valider le seuil sur une saison distincte de celles servant à le choisir.
- Causalité : une corrélation ne prouve pas qu'un renforcement évite un feu ; surfaces et délais dépendent aussi du terrain et des interventions.
- Conformité : limiter les données personnelles au strict nécessaire (auteurs, appelants, adresses) et restreindre l'accès aux données opérationnelles sensibles ; vérifier les licences des sources.

## 4. Les données

Données idéales : disponibilité, licence, couverture et qualité restent à vérifier, aucune extraction n'a été faite.

| Questions | Donnée idéale et grain | Période | Fraîcheur | Emprise | Sources candidates |
|---|---|---|---|---|---|
| Q1 à Q7 | **Feux** : un enregistrement par feu (id, date-heure de départ, localisation, végétation, surface brûlée, cause, conséquences). | Étés 2022–2026 (plus si définitions homogènes), focus 2026. | Dernière extraction avant le rendu, statut provisoire/consolidé indiqué. | Fin en Corse-du-Sud ; harmonisé Haute-Corse et national. | SDIS 2A, BDIFF, Prométhée. |
| Q3 à Q7 | **Niveau Météo des forêts** : un département × une date de validité × une émission × un horizon. | Toutes les saisons archivées communes avec les feux, jusqu'à 2026 (disponibilité dès 2022 non supposée). | Archive complète avant le rendu ; à chaque publication en exploitation. | Corse-du-Sud, Haute-Corse, départements couverts pour la comparaison nationale. | Archives Météo-France (accès à vérifier). |
| Q2, Q7 | **Interventions et moyens** : une intervention avec heures d'alerte, départ, arrivée, libération ; disponibilité par centre et vacation. | Étés 2022–2026 ; état prévu 2027. | Dernier historique consolidé ; disponibilité par vacation en exploitation. | Centres et secteurs de Corse-du-Sud. | Données opérationnelles internes du SDIS 2A. |
| Q4, Q7 | **Activations, coûts, capacités** : un secteur × un jour ou une vacation (activation, motif, moyens ajoutés, heures, coûts) ; enveloppes 2027. | Saisons comparables + prévisions budgétaires 2027. | Version validée avant le rendu ; mise à jour à chaque arbitrage. | Corse-du-Sud, ventilation sectorielle si possible. | Direction, finances et opérations du SDIS 2A. |
| Q1, Q5, Q6 | **Contexte local** : une station ou zone × pas horaire/journalier (vent, température, humidité, précipitations) ; relief, végétation, accès, enjeux exposés. | Mêmes saisons que les feux ; référentiels datés. | Historique consolidé ; référentiels récents. | Corse-du-Sud et territoires de comparaison. | Météo-France, IGN, occupation du sol (Corine Land Cover), INSEE. |
| Q1 à Q7 | **Calendrier département-jour** et référentiels de codes, avec suivi de complétude. | Tous les jours des saisons étudiées, y compris sans feu. | Alignée sur les autres jeux. | Ensemble du périmètre. | Construit pour l'étude ; référentiels INSEE ; métadonnées des producteurs. |

**Grain de la première table d'analyse :** département-jour (niveau connu à la décision, nombre de feux, conséquences, coût agrégé). Les feux détaillés restent dans une table séparée pour l'analyse spatiale.

**Si des données manquent** (archives de l'indice, coûts, effectifs) : le documenter, travailler sur la période commune disponible ou sur des scénarios paramétrés, sans inventer de seuil optimal ni de budget.

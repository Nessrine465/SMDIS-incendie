(window.TRAINING = window.TRAINING || {}).m1 = {
  type: "Supervised learning · ordinal classification",
  status: "Not trained",
  rows: [
    ["Type of model", "Supervised ordinal classification. The classes are ordered: level 1, 2, 3. The output is always labelled \"proxy\"."],
    ["Learns from", "The official Météo des forêts level (1 to 3), 2024 to 2026. It learns which daily weather values match each level. Then it rebuilds a daily index back to 1990, where no official level exists."],
    ["Training data", "Official levels from file S06: 3 June to 30 September in 2024 and 2025, from 28 May in 2026. Inputs: daily max temperature, humidity, wind and rain at the 2A stations (S08). The level meaning and the bulletin date alignment are non vérifié."],
    ["Algorithms", "Baseline: a simple fire-weather formula with cut-offs. Then ordinal logistic regression. Gradient boosting only if it helps (proposed)."],
    ["How we split the data", "Leave one season out. Train on two seasons, test on the third, and repeat three times. There are only 3 seasons, so no random split and no tuning set. Test both date alignments (same day and next day)."],
    ["Metrics", "Confusion table: rows are official levels, columns are predicted levels. It shows which levels get mixed up. Level 3 is rare (3 days in the 2024 preliminary look, non vérifié). Other metrics are proposed: accuracy within one level."],
    ["Baseline to beat", "The simple fire-weather formula with cut-offs."],
    ["Stop rule", "If the model does not beat the baseline, drop the proxy and use the official overlap only (option A). A documented failure is acceptable. A hidden one is not."],
    ["Main risk", "Overfitting. Three seasons is very little data, and boosting can memorise them. The proxy may also fit 2024 to 2026 but not the 1990s climate. That cannot be checked, since no official level exists before 2024."]
  ]
};

(window.TRAINING = window.TRAINING || {}).m2 = {
  type: "Supervised learning · binary classification with probabilities",
  status: "Not trained",
  rows: [
    ["Type of model", "Supervised binary classification. The output is a probability, not just yes or no."],
    ["Learns from", "Whether at least one fire started in 2A on a given day. Inputs: weather and recent history (days since rain), the proxy or official level, and the month. The fire definition is undecided, so the target is not final."],
    ["Training data", "Fire starts from S02: 13,191 rows, 1990 to 2024. Fire area and type filters are to decide (24% have SURFACE 0). Weather from S08, 2A stations. Level from M1. Source changes over time (fires per year fall from 777 to 122) are unchecked."],
    ["Algorithms", "Baseline: logistic regression. Then gradient boosting, XGBoost or LightGBM."],
    ["How we split the data", "By time, never random. Train 1990 to 2017, tune 2018 to 2021, test 2022 to 2024."],
    ["Metrics", "Precision-recall AUC, Brier score and a calibration curve. Precision-recall AUC suits rare events. The calibration curve checks that a predicted 30% really means about 30% of days with a fire."],
    ["Baseline to beat", "Logistic regression first. Also compare with the official level alone, on the 2024 overlap (proposed)."],
    ["Stop rule", "If boosting does not beat logistic regression on the test years, we keep the simpler model and say so."],
    ["Main risk", "Class imbalance. Most days have no fire (in the 2024 preliminary look, 75 of 120 index days, non vérifié). Raw scores can mislead, so calibration matters. Also: 31% of fires fall outside June to September, and the fire count may reflect recording changes."]
  ]
};

(window.TRAINING = window.TRAINING || {}).m3 = {
  type: "Decision analysis · not a trained model",
  status: "Not trained",
  rows: [
    ["Type of model", "Decision analysis. Nothing is trained here. It reads the output of M2 or the official index."],
    ["Learns from", "It trains nothing. It uses M2 daily scores, or the official index levels. For each candidate trigger level it counts false alerts (alert days with no fire) and missed fires (fires on non-alert days). It draws a trade-off curve under a budget of alert days."],
    ["Training data", "Fire starts (S02, 1990 to 2024) with M2 scores, and the official index with fires on the 2024 overlap. The index only covers about June to September. 31% of fires (4,098 of 13,191) fall outside it. The posture analysis cannot cover them."],
    ["Algorithms", "No learning algorithm. Counting and a trade-off curve. Uncertainty comes from resampling whole seasons (proposed: with replacement)."],
    ["How we split the data", "Resample seasons, not days, to keep days of one season together. Repeat the whole analysis under two fire definitions (two area thresholds, values to decide). The M2 test years 2022 to 2024 stay unseen by M2 tuning."],
    ["Metrics", "False alerts, missed fires and the trade-off curve per level. Intervals from the season resampling. Output: a recommended level and the cost of being wrong in each direction."],
    ["Baseline to beat", "The current threshold, which fails both ways: high-danger days with no fire, and fires on low-danger days. Its exact level is non vérifié."],
    ["Stop rule", "If the intervals are too wide to separate two levels, we report the range and do not pick a single level."],
    ["Main risk", "Few seasons, so wide intervals. The result depends on the fire definition and on M2 quality. The 2024 look has only 3 level-3 days."]
  ]
};

(window.TRAINING = window.TRAINING || {}).m4 = {
  type: "Supervised learning · count regression",
  status: "Not trained",
  rows: [
    ["Type of model", "Supervised regression on counts. The target is a whole number of fire starts."],
    ["Learns from", "Fire starts per commune per year. Inputs: past fires per commune, land cover, population and the DFCI grid cell. The output ranks communes by expected fire starts."],
    ["Training data", "Fire starts from S02, 1990 to 2024, counted per commune with the INSEE_COM code (present on every row). Land cover: CORINE or BD Forêt, not yet chosen. Population: INSEE, original not yet located. Number of communes: non vérifié."],
    ["Algorithms", "Baseline: Poisson or negative-binomial regression. Then gradient boosting with a count objective."],
    ["How we split the data", "Hold out the last 3 years (2022 to 2024). Also hold out groups of communes, so the model is tested on places it never saw. Never random."],
    ["Metrics", "Rank correlation with observed counts. Share of fires inside the predicted top 10% of communes."],
    ["Baseline to beat", "The Poisson or negative-binomial regression. A simple ranking by past fires per commune is also proposed."],
    ["Stop rule", "If boosting does not beat the regression on the held-out years and communes, we keep the regression."],
    ["Main risk", "Spatial leakage. Neighbouring communes look alike, so a random split would flatter the score. Many communes have zero fires. Recording changes by source can fake a trend."]
  ]
};

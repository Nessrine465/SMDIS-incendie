(window.TRAINING = window.TRAINING || {}).e1 = {
  type: "Data extraction and quality checks. This is not a trained model.",
  status: "Not trained",
  rows: [
    ["Type of model", "None. E1 reads roads from a road dataset (IGN BD TOPO and OpenStreetMap are candidates), clips them to the area and builds a graph. It is a data pipeline with checks."],
    ["Learns from", "Nothing, it is not trained."],
    ["Training data", "None. Validation uses a reference road dataset. Whether any dataset covers Corse-du-Sud forest tracks, its date and its licence: non vérifié."],
    ["Algorithms", "Optional later (proposed): image-based road detection (segmentation) on satellite images. Only if no dataset covers the area. It would need images with roads outlined by hand, including forest tracks, over Corse-du-Sud. Not planned."],
    ["How we split the data", "For the optional image model (proposed): train on some communes and test on other communes, so the test area is never seen in training. Not needed for the extraction itself."],
    ["Metrics", "Road length per commune against the reference. Is the graph connected, and which pieces are not. For the optional image model (proposed): share of reference road length found, and share of detected road that is real."],
    ["Baseline to beat", "The reference dataset read as it is. Image detection is only worth building if it covers tracks that the dataset misses."],
    ["Stop rule", "If the graph is not connected or length per commune is far off the reference, list the gaps and do not route over them silently."],
    ["Main risk", "A dataset that misses forest and DFCI tracks, which are the roads that matter most. Date and licence: non vérifié."]
  ]
};

(window.TRAINING = window.TRAINING || {}).e2 = {
  type: "Shortest-path search (Dijkstra or A*). No training.",
  status: "Not trained",
  rows: [
    ["Type of model", "Shortest-path search on the road graph. The prototype in engine/router.py uses Dijkstra. The cost of a segment is travel time for the vehicle type. Tankers are barred from tracks."],
    ["Learns from", "Nothing, it is not trained. Its parameters are calibrated instead."],
    ["Training data", "To calibrate: real response times from the SDIS, with start station, vehicle, destination and arrival time. We do not have them yet, so this is a gap. Without them, the prototype values are assumptions."],
    ["Algorithms", "Calibrate by adjusting speed by road class, the slope penalty and the wind buffer so computed times match real ones (proposed: least squares). Later, the wind buffer is replaced by the spread model M5, which would give the predicted fire area."],
    ["How we split the data", "Proposed: fit the parameters on older responses and check on the most recent ones. Keep whole fire seasons together. No random shuffle."],
    ["Metrics", "Error between computed and real time (median and worst cases). Share of real routes found among the ranked alternatives. Replay of past fires: does the route avoid the burned contour?"],
    ["Baseline to beat", "The default speeds in router.py: primary 70, secondary 55, residential 35, track 20, DFCI track 15 km/h. These are synthetic assumptions."],
    ["Stop rule", "If times cannot be checked against real ones, label every time as an estimate."],
    ["Main risk", "No real response times, so the speeds stay unchecked. A wind buffer is not a spread model: it can route crews through ground the fire will reach."]
  ]
};

(window.TRAINING = window.TRAINING || {}).e3 = {
  type: "Rules table first (SDIS-owned), then a supervised model that predicts final fire size.",
  status: "Not trained",
  rows: [
    ["Type of model", "Step 1: a rules table of size bands with modifiers for wind, risk, vegetation, slope and access time (engine/sizing.py, placeholder values). Step 2 (proposed): regression or classification of final fire size. Headcount always comes from the rules."],
    ["Learns from", "Only the size model learns, from past fires. Staffing cannot be learned: we have no record of how many people were sent. The SDIS must provide the rules."],
    ["Training data", "DDTM Corse-du-Sud fire starts, field SURFACE. 24% have SURFACE 0 and the definition of a fire is undecided. First-report features such as weather, vegetation and slope would be joined to each start. Which features exist: non vérifié."],
    ["Algorithms", "Proposed: gradient-boosted trees or random forest, predicting log area (regression) or the size band (classification). Compared with a simple linear model. The size_forecast heuristic in sizing.py is not trained."],
    ["How we split the data", "Proposed: split by time. Train on earlier years, test on the latest years. Fires per year fall from 777 (1990) to 122 (2024), and a source change is possible, so check by source."],
    ["Metrics", "Under-sizing rate and over-sizing rate by band. MAE on log area. Run each metric at two SURFACE thresholds, because the fire definition is undecided."],
    ["Baseline to beat", "The heuristic multiplier in sizing.py (wind, vegetation, slope on current area), and the reported area used as it is."],
    ["Stop rule", "In sizing.py, headcount_enabled=False returns zero units and only the forecast band. Without SDIS rules we output a size forecast, never a headcount."],
    ["Main risk", "Fire starts hold the final size but not the first-report size, so the model may not match real use. Many near-zero areas can distort the fit."]
  ]
};

(window.TRAINING = window.TRAINING || {}).e5 = {
  type: "Template-based text generation. This is not machine learning.",
  status: "Not trained",
  rows: [
    ["Type of model", "Templates filled from the structured results of E1 to E4 (engine/instructions.py). No free-text invention. A place that is not in the graph raises an error."],
    ["Learns from", "Nothing, it is not trained."],
    ["Training data", "None. The templates need the SDIS radio and reporting conventions: non vérifié. They must come from the SDIS."],
    ["Algorithms", "Optional (proposed): a language model used only to reword an order. Every place, number and route would be checked against the template output, and any mismatch falls back to the template text."],
    ["How we split the data", "Not applicable, nothing is trained. Evaluation uses a set of past fires replayed through the whole engine."],
    ["Metrics", "Officer ratings of the orders on past fires (clarity, usability). Automatic check: every named place and route exists in the graph. Share of orders that pass the check."],
    ["Baseline to beat", "The plain template output. A reworded order is kept only if it scores better with officers and passes every check."],
    ["Stop rule", "A person always confirms before anything is sent. Any order that fails the graph check is not shown."],
    ["Main risk", "Orders that read well but do not match SDIS practice. A reworded order that drifts from the facts."]
  ]
};

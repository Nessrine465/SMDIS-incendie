(window.TRAINING = window.TRAINING || {}).m6 = {
  type: "Reinforcement learning (sequential decision making), trained in a simulator. Proposed.",
  status: "Not trained",
  rows: [
    ["Type of model", "Proposed: reinforcement learning. An agent makes a chain of dispatch decisions and learns from a reward. It learns only inside a simulator we must build. It is a stretch model that starts after Dec 11 and needs M5 and unit data."],
    ["Why RL at all", "Honest answer: one incident at a time is already handled well by the assignment solver in engine/dispatch.py. RL is proposed only for sequential choices: several fires at once, holding units in reserve, and repositioning. Greedy rules are weak there. We would NOT use RL for a single fire, or if the simulator cannot be validated."],
    ["Environment", "Proposed: a simulator we must build. Incidents replay or resample real fire starts 1990-2024 from the DDTM data, with date, commune and size. Travel times come from the router (engine/router.py). Fire growth comes from M5. Units and stations are a data gap, so they are synthetic or SDIS-provided."],
    ["State", "Proposed: what the agent sees. Open incidents with size and wind. Unit positions and availability. The clock time. The risk level from M2. The reserve left at each station. Wind direction in the weather source is non vérifié."],
    ["Actions", "Proposed: assign a unit to an incident or role, hold a unit in reserve, or move a unit to another station. Action masking removes illegal or unreachable moves, such as a busy unit or a tanker on a track barred to tankers. The agent can never choose a masked move."],
    ["Reward", "Proposed terms: time to first arrival, final burned area, a penalty for an uncovered station, and a cost for over-dispatch. The weights are a value judgement. The SDIS must set them. They are not data, and we must not fit them to data."],
    ["Algorithm", "Proposed: start with a contextual bandit or tabular Q-learning on a small instance. Then try PPO or DQN with action masking. Small first, so we can check the reward and the simulator. No deep-learning library is installed and the prototype is stdlib Python, so the stack choice is open (non vérifié)."],
    ["Training data", "No logged real dispatch decisions exist in our sources. So offline RL from logs is impossible. Only online RL inside the simulator. Real data that calibrates it: DDTM fire starts and dates, the 1,380 contours, S08 weather, the official risk index 2024-2026, and the road graph. Unit data is missing."],
    ["Training stages", "Proposed. 1. Build the simulator and validate it against real fire counts and sizes. 2. Run the baseline solver inside it. 3. Train RL with several random seeds. 4. Curriculum from one fire to many simultaneous fires. 5. Evaluate on held-out data."],
    ["Baseline to beat", "The min-cost assignment solver in engine/dispatch.py. It uses branch and bound and keeps a minimum cover per station. Also the greedy variant, which is the same function with improve=False. RL must beat both inside the same simulator."],
    ["Evaluation", "Proposed: held-out simulated seasons, with at least 3 random seeds. Also replay real fire days 2022-2024. The caveat is that counterfactual outcomes are simulated, not observed. Metrics: time to first arrival, burned area, uncovered station time, units sent."],
    ["Safety", "Never autonomous. A person confirms every order, as Order.needs_confirmation already requires. Fall back to the baseline solver when the agent is unsure or the state is unusual. Action masks block illegal moves. Log every suggestion and the answer given."],
    ["Sim-to-real gap", "The simulator may differ from reality. Synthetic units and stations may not match the SDIS. M5 fire growth may be wrong. Road speeds are assumptions. Fires per year fell from 777 (1990) to 122 (2024), and whether this is real or a recording change is open. The agent may exploit simulator quirks."],
    ["Stop rule", "If RL does not beat the baseline by a margin on held-out seasons across all seeds, we do not use it and we say so. The margin is to be set before training (non vérifié). We keep the assignment solver."]
  ]
};

window.TRAINING.e4 = {
  type: "Optimisation (min-cost assignment by branch and bound). No training. Proposed to build FIRST.",
  status: "Not trained",
  rows: [
    ["Type of model", "Optimisation, not machine learning. engine/dispatch.py picks units so total arrival time is minimal. It uses an exact branch and bound search. Same-kind slots are interchangeable. This is the step proposed to build first."],
    ["Learns from", "Nothing. It has no training data and no fitted parameters. It only needs the list of units, the stations and a travel time function."],
    ["Calibration", "Travel times come from the router: road class speeds, slope penalty and tanker limits. Real speeds are non vérifié. The cover rule min_cover_per_station keeps units at home. Its value is a choice for the SDIS to set. Unit data is a gap, so tests use synthetic data."],
    ["Baseline to beat", "The greedy variant: each slot takes the nearest unit that respects the station cap. It is the same function with improve=False. The exact search must give a lower total travel time, or equal."],
    ["Evaluation", "Proposed: simulate days with two fires at once. Compare total and worst arrival time, shortfalls and cover breaches against greedy. Check that the cover rule relaxes only with a warning. Results on synthetic data prove nothing about the real SDIS."],
    ["Upgrade path", "RL dispatch (M6) later, if the simulator exists and M5 and unit data are available. M6 must beat this solver on held-out simulated seasons. If not, this solver stays."]
  ]
};

window.TRAINING.m5 = {
  type: "Calibration of a physical or semi-empirical fire-spread simulation. Not a pure neural network. Proposed.",
  status: "Not trained",
  rows: [
    ["Type of model", "Proposed: calibration of a physical or semi-empirical spread model. We fit its few parameters so simulated burned shapes match real ones. Not a pure neural network, because 1,380 contours are too few and a physical model stays explainable."],
    ["Learns from", "The S03 contours (1,380 polygons, 1990-2024), the matching starts, wind and vegetation. 1,368 of 1,380 contours match a start on ID_DDT2A. Vegetation and slope source for 2A is non vérifié."],
    ["Training data", "Contour shape and area, and the fire start point and date. Wind from S08 weather (wind speed FFM is listed, wind direction is non vérifié). Contours and DDTM areas agree, with a median ratio of 1.0 (n=1,121)."],
    ["Algorithms", "Proposed: a semi-empirical spread rule, such as an ellipse driven by wind, slope and vegetation. Fit its parameters by least squares or Bayesian search against contour shape. The exact model family is open (non vérifié)."],
    ["How we split the data", "Proposed: split by time, as for M2. Fit on early years, tune on a middle block and test on the last years. Also hold out groups of communes. Never a random split of fires."],
    ["Metrics", "Proposed: overlap of simulated and real shape (intersection over union), area error, and error in the main spread direction. Reported as intervals, not one number."],
    ["Baseline to beat", "A simple wind-based buffer: a circle or an ellipse stretched along the wind, sized from the final area. The calibrated model must be closer to the real contours than this buffer."],
    ["Stop rule", "If the calibrated model does not beat the wind buffer on held-out years, we keep the buffer and say so. M6 would then use the buffer as its fire growth."],
    ["Main risk", "Contours may be final shapes only. A time dimension inside a fire (spread over hours) is not stated in docs/data-solutions.md or docs/source-strategy.md, so it is non vérifié. Without it we can fit the final shape, not the speed of spread."]
  ]
};

window.TRAINING.m7 = {
  type: "Supervised detection or classification on a new data source. No source identified. Proposed.",
  status: "Not trained",
  rows: [
    ["Type of model", "Proposed: supervised detection or classification of satellite hotspots, to flag a fire start early. Nothing is chosen. The data source is not identified in our files. Everything below is non vérifié."],
    ["Learns from", "A new data source that is not in our source list (non vérifié). Candidates, access, coverage of Corse-du-Sud and revisit time are all non vérifié. This model cannot start until a source is found."],
    ["Training data", "Needed: hotspot detections with time and position, labelled as real fire or not. Labels could come from the DDTM fire starts 1990-2024, but the satellite record may not go back that far. Date range and match quality are non vérifié."],
    ["Algorithms", "Non vérifié. A simple rule on hotspot confidence is the first thing to try. A classifier on hotspot features, such as gradient boosting, only if labelled data is enough. Image models are not proposed."],
    ["How we split the data", "Proposed: split by time, with the latest seasons held out. Also hold out areas. Never a random split, because hotspots near each other in time are correlated."],
    ["Metrics", "Proposed: detection rate (share of real fires seen), false alarm rate, and delay between the real start and the first hotspot. Thresholds are for the SDIS to set."],
    ["Baseline to beat", "Proposed: the plain hotspot alert with no model, and the current way fires are reported. The model must add value over both. Baseline performance is non vérifié."],
    ["Stop rule", "If no source is found, or the model does not beat the plain alert on held-out seasons, we drop M7 and say so."],
    ["Main risk", "Satellite pixels are coarse and revisit gaps are long, so small fires may be missed. Fires per year are mostly small. Fire size distribution against pixel size is non vérifié. Reporting changes over time may also bias the labels."]
  ]
};

/* Content for the Source Workbench site. Globals: STAGES, STATUS, SOURCES, MISMATCHES, DROPPED, GAPS, RUBRIC. */
var STAGES = [
  { key: "raw",    name: "1 · Raw",          sub: "as received, with provenance" },
  { key: "stg",    name: "2 · Staging",      sub: "typed, renamed, rules applied" },
  { key: "con",    name: "3 · Consolidated", sub: "crosswalks, rejects, reconcile" },
  { key: "mod",    name: "4 · Star schema",  sub: "facts, dimensions, tests" }
];
var STATUS = { done: "Done", prog: "In progress", todo: "To do", gap: "Gap" };

var SOURCES = [
  { id: "S01+S02", name: "DDTM 2A fire starts, 1973–2024", owner: "P1 · Sources", role: "P1", serves: "Q-FA, Q-MF, Q-ZONE",
    stages: {
      raw: { s: "done", short: "3 period files + provenance",
        steps: ["Keep the three DDTM 2A period files as delivered: 1973–1980, 1981–1989, 1990–2024 (shapefile plus XML metadata).",
                "PROVENANCE.txt records the download URL and the copy date. The original zip was not kept."],
        rules: [["block", "Raw files are never edited. A rerun reads them only."]],
        why: "Raw is the proof of what we received. The brief asks for provenance on every source.",
        open: "No checksum is recorded yet, only URL and date. This is also the only raw folder with a PROVENANCE.txt; the other sources have none yet." },
      stg: { s: "prog", short: "Reader exists, rules to write",
        steps: ["Read the .dbf tables with the project's own reader (pipeline/fire/dbf_reader.py).",
                "Union the three period files into one table: 3,190 + 6,318 + 13,191 = 22,699 starts. Same product, split by date.",
                "Keep INSEE_COM as 5-character text. Never cast to a number.",
                "Pad MOIS_FEU to two digits (4 rows hold 1 instead of 01).",
                "Turn CAUSE missing or 0 into an explicit 'unknown'. Do not fill it in.",
                "Keep SOURCE (DDT2A, PROMETHEE, OPENDFCI2A) as a lineage column."],
        rules: [["warn", "ID_DDT2A is not unique: about 12,547 distinct values for 13,191 rows in 1990–2024."],
                ["block", "INSEE_COM empty or unknown to the territory dimension goes to the reject table. (Present on all 13,191 rows of 1990–2024.)"],
                ["tolerate", "CAUSE unknown on 61% of rows. Stated as a limit; no cause analysis."],
                ["tolerate", "SURFACE = 0 on 24% of rows. Test the answer with two area thresholds."],
                ["warn", "TYPE_FEU mixes FF, AFERPU, FORET, VEGETATION, FV. Meaning of each is non vérifié."]],
        why: "The rule for two files describing the same facts: one reference, no blending. The three period files are one product, so they are unioned. The other fire sources only check totals.",
        open: "Are the repeated IDs second fires on the same day, or duplicate rows? Settle this before counting fires." },
      con: { s: "todo", short: "Join to territory, reconcile",
        steps: ["Resolve each fire to the territory version valid at its date, on commune code plus date. Before 1976 the code is 20xxx, after it 2Axxx.",
                "Send unmatched rows to the reject table, with the reason.",
                "Reconcile yearly counts per commune against BDIFF. BDIFF is for checking only, never merged.",
                "Explain the gap between 22,699 starts here and the prefecture page's 'more than 17,790 since 1973'.",
                "Count fires per year by SOURCE, to see whether the fall from 777 (1990) to 122 (2024) is real."],
        rules: [["block", "Each fire resolves to exactly one territory version."],
                ["warn", "Totals differ from a reference: the cause must be written, not hidden."]],
        why: "The course asks for reconciliation of totals back to the sources. A decline that follows a change of recording source would be a data artefact, not a trend.",
        open: "Definition and date of the 17,790 figure are unknown. They may count different things." },
      mod: { s: "todo", short: "fact_fire_start",
        steps: ["Grain, in one sentence: one fire start, at one place, on one day.",
                "Measure: SURFACE in hectares (additive). Count of fires is derived.",
                "Foreign keys: date, territory version (type 2), fire type.",
                "Feeds query 1 (fires on high-danger days) and query 2 (share of fires on low-danger days)."],
        rules: [["block", "Non-loss test: fires in the fact = fires in staging minus rejected rows."],
                ["warn", "A 'fire' is defined for the question (area threshold, TYPE_FEU), and the result is shown for two definitions."]],
        why: "The grain sentence is graded. Defining what counts as a fire changes every share we report.",
        open: "Which threshold defines a fire for the SDIS? Ask the client or state the assumption." }
    } },

  { id: "S03", name: "DDTM 2A fire contours, 1990–2024", owner: "P1 · Sources", role: "P1", serves: "Burned area, map",
    stages: {
      raw: { s: "done", short: "Polygons loaded",
        steps: ["Keep the contour shapefiles as delivered: 1990–2024 (1,380 polygons), plus the older layers 1949–1980 and 1981–1989."], rules: [],
        why: "Same raw rule as every source.", open: "" },
      stg: { s: "todo", short: "Optional",
        steps: ["Read ID_DDT2A and the area field only. Geometry is not needed for the two decisions."], rules: [["warn", "Contour area and start-point area disagree: report it."]],
        why: "1,368 of 1,380 contours match a start on ID_DDT2A. Where both have an area they agree (median ratio 1.0, n = 1,121).",
        open: "" },
      con: { s: "todo", short: "Not merged by default",
        steps: ["Do not merge by default. The merge would fill the area of only about 130 starts that have SURFACE = 0."], rules: [["tolerate", "12 contours have no matching start."]],
        why: "A source that doesn't serve a decision is kept out of the pipeline. Contours stay available for a map.",
        open: "P1 decides whether S03 is kept at all." },
      mod: { s: "na", short: "Not in the model" , steps: [], rules: [], why: "", open: "" }
    } },

  { id: "S06", name: "Météo des forêts archives, 2024–2026", owner: "P2 · Index and weather", role: "P2", serves: "D2, Q-FA, Q-MF, Q-CMP",
    stages: {
      raw: { s: "done", short: "3 yearly files + PDF",
        steps: ["Keep the yearly csv.gz files (2024, 2025, 2026), the department GeoJSON and the presentation PDF that defines the levels."], rules: [],
        why: "The PDF is the only documentation of the levels, so it is kept next to the data.",
        open: "" },
      stg: { s: "todo", short: "Levels, dates, departments",
        steps: ["Columns seen: date, num_dep, niveau_j1, niveau_j2, dep_nom.",
                "Treat niveau as a forecast level (D+1 and D+2), not as an index value.",
                "Keep num_dep as text ('2A', '2B').",
                "Decide what the date means. It looks like the bulletin time (14:50 UTC), not the day concerned."],
        rules: [["warn", "A level outside 1 to 4. Level 4 does exist (1 row in 2024, 29 in 2025, 99 in 2026); its meaning is non vérifié."],
                ["warn", "Missing days inside the season for a department."],
                ["tolerate", "No data outside the season (about 3 June to 30 September; from 28 May in 2026)."]],
        why: "Fires are only comparable with the index if both are on the same day. Both alignments (same day, next day) are tested, and the one the documentation supports is kept.",
        open: "Scale and meaning of each level, and the meaning of the date column, are non vérifié until the PDF is read." },
      con: { s: "todo", short: "Season limit, 2A vs 2B",
        steps: ["Keep 2A and 2B and all other departments. The comparison '2A vs region vs France' can be answered from this file alone.",
                "State the season limit: 31% of 2A fires (4,098 of 13,191) fall outside June–September and have no level."], rules: [["tolerate", "Spring and autumn fires are out of scope for the trigger question."]],
        why: "Defining the question inside the season is honest. Stretching a summer-only index over the whole year is not.",
        open: "" },
      mod: { s: "todo", short: "dim_danger_level + daily fact",
        steps: ["dim_danger_level is a conformed dimension (level, label, meaning).",
                "Daily fact: department, day, level at D+1, level at D+2.",
                "Feeds queries 1, 2 and 3."], rules: [["block", "Referential integrity: every level in the fact exists in dim_danger_level."]],
        why: "The decision log must say which alignment was chosen and why.", open: "" }
    } },

  { id: "S08", name: "Météo-France daily climatology", owner: "P2 · Index and weather", role: "P2", serves: "Proxy index before 2024",
    stages: {
      raw: { s: "done", short: "Q_20 files + field lists",
        steps: ["Keep the Q_20 files: 1950–2024 and 2025–2026, in two flavours (RR-T-Vent and autres-parametres), plus the field descriptions."], rules: [],
        why: "", open: "" },
      stg: { s: "todo", short: "Keep 2A stations only",
        steps: ["The department code is 20 for all of Corse. Keep only 2A stations, through a station crosswalk.",
                "Fields used: TX (max temperature), UN/UM (humidity), FFM (wind), RR (rain)."],
        rules: [["warn", "Gaps per station, by period."], ["block", "A station with no 2A mapping is excluded, not guessed."]],
        why: "Station codes and coordinates decide the department. A guess here would put 2B weather into 2A fires.",
        open: "Which stations are in 2A, and how complete are they? Named so far: Ajaccio, Bocognano, Propriano, Figari, Levie." },
      con: { s: "todo", short: "Proxy as a separate column",
        steps: ["Compute a daily fire-weather proxy from the 2A stations (simplified fire weather index or a documented score).",
                "Calibrate on the 2024–2026 overlap with S06: which proxy values match official levels 1 to 4? Report a confusion table.",
                "Store it in its own column. Never mix it into the official level."],
        rules: [["warn", "Proxy label on every result that uses it: 'our model, not the official index'."]],
        why: "Fires go back to 1990 and the official index starts in 2024. A calibrated proxy is the only way to get statistics, and a failed calibration is a documented result.",
        open: "If the match on the overlap is poor, fall back to the overlap only. State it." },
      mod: { s: "todo", short: "Second danger measure",
        steps: ["Daily fact gets a proxy column beside the official level, clearly named."], rules: [],
        why: "", open: "" }
    } },

  { id: "S10", name: "INSEE Code officiel géographique", owner: "P3 · Territory", role: "P3", serves: "Territory dimension, history",
    stages: {
      raw: { s: "done", short: "COG 2026 + 2025 movements",
        steps: ["Keep v_commune_depuis_1943, v_mvt_commune_2026, v_commune_2026 and v_departement_2026, plus the 2025 movements file."], rules: [],
        why: "", open: "" },
      stg: { s: "done", short: "dim_territory built",
        steps: ["pipeline/territory/build_dim_territory.py builds the dimension, a crosswalk and an events file. 251 dimension rows, 124 crosswalk rows, 131 events.",
                "Codes are 5-character text: '2A004' and '20004' are different codes.",
                "valid_from is the first valid day. valid_to is the last valid day, inclusive. INSEE's DATE_FIN is exclusive, so valid_to = DATE_FIN minus one day.",
                "Scope: today's 2A communes plus their 20xxx predecessors, so fires of 1973–1975 resolve.",
                "Runs twice with byte-identical output: sorted, no timestamp, atomic write."],
        rules: [["block", "Periods of one commune must not overlap. (The script's design says so; I did not find a test for it in the repo.)"]],
        why: "A type-2 dimension lets each fact point at the territory version valid on its date. That is the star-schema requirement.",
        open: "Vintage 2026 here versus the vintage of the fire and index sources: non vérifié." },
      con: { s: "prog", short: "Crosswalk exists",
        steps: ["The old-code to current-code crosswalk follows chains (for example 20308 → 2A308 in 1976; the 1965 merger of 20237 into 20308 is recorded in events.csv).",
                "Still to do: use it to resolve every fire, and report unresolved ones to the reject table."],
        rules: [["block", "Every fire commune code resolves, or the row is rejected with a reason."]],
        why: "Join on codes, never on commune names.", open: "" },
      mod: { s: "prog", short: "Dimension file, tests to write",
        steps: ["dim_territory is the conformed territory dimension. The four required tests, including the non-overlap test, are still to be written."], rules: [],
        why: "", open: "" }
    } },

  { id: "S11", name: "IGN ADMIN EXPRESS", owner: "P3 · Territory", role: "P3", serves: "Commune boundaries, maps",
    stages: {
      raw: { s: "done", short: "communes_2A.geojson",
        steps: ["Keep the 2A communes GeoJSON from the IGN web service."], rules: [], why: "", open: "" },
      stg: { s: "todo", short: "Code and geometry",
        steps: ["Keep the commune code and the geometry. Fires already carry INSEE_COM, so no spatial join is needed for the questions."], rules: [["warn", "Commune codes absent from dim_territory."]],
        why: "Fires carry a commune code, so a code join is exact and a spatial join is not needed for the decisions.", open: "Vintage versus the COG (S10) is non vérifié." },
      con: { s: "todo", short: "Merge on commune code",
        steps: ["Merge with S10 on commune code. They hold different attributes: history versus geometry."], rules: [["block", "Codes in one and not the other are listed, not silently dropped."]],
        why: "Complementary sources are merged on a code.", open: "" },
      mod: { s: "na", short: "Attribute of dim_territory", steps: [], rules: [], why: "", open: "" }
    } },

  { id: "S05", name: "BDIFF national fire database", owner: "P4 · Pipeline and model", role: "P4", serves: "Q-CMP, reconcile totals",
    stages: {
      raw: { s: "gap", short: "Portal pages only, no data",
        steps: ["Only the portal's help pages and robots.txt are in raw. The fire data itself has not been downloaded."], rules: [],
        why: "", open: "How to download is non vérifié (API?). The catalogue says 2006–2022." },
      stg: { s: "todo", short: "After download", steps: ["Commune-level yearly counts for Corse-du-Sud."], rules: [], why: "", open: "" },
      con: { s: "todo", short: "Reconcile only",
        steps: ["Compare yearly counts per commune with the DDTM points. Do not merge."], rules: [["warn", "Counts differ: write the cause."]],
        why: "Two sources describing the same facts: keep one reference and use the other to check totals.",
        open: "If it stops in 2022 it never overlaps the index (from mid-2024). The Corse versus France comparison of fires on index days may be impossible." },
      mod: { s: "na", short: "Not in the model", steps: [], rules: [], why: "", open: "" }
    } },

  { id: "S12", name: "Land cover: CORINE or BD Forêt", owner: "P4 · Pipeline and model", role: "P4", serves: "Q-ZONE (vegetation)",
    stages: {
      raw: { s: "done", short: "Both downloaded",
        steps: ["CORINE commune table (national, it holds 2A rows) and the BD Forêt 2A archive are both in raw. The CORINE folder is named clc-commune-44, which is misleading; its vintage is non vérifié."], rules: [], why: "", open: "" },
      stg: { s: "todo", short: "Pick one",
        steps: ["Choose one. Check that it describes scrub (maquis) well, since that is what burns.", "Check the vintage."], rules: [],
        why: "Do not use both for the same class.", open: "Which one, and why? Needs to be written in the decision log." },
      con: { s: "todo", short: "Join by commune", steps: ["Attach vegetation share per commune."], rules: [], why: "", open: "" },
      mod: { s: "todo", short: "Territory attribute", steps: ["Vegetation attributes on the commune dimension."], rules: [], why: "", open: "" }
    } },

  { id: "S15", name: "OFGL SDIS accounts", owner: "P4 · Pipeline and model", role: "P4", serves: "D1 (budget)",
    stages: {
      raw: { s: "done", short: "ofgl-base-sdis.csv",
        steps: ["Keep the CSV as downloaded."], rules: [], why: "", open: "" },
      stg: { s: "todo", short: "Pick the aggregates",
        steps: ["Find the SDIS 2A rows. Pick the accounting aggregates that answer D1."], rules: [["warn", "Temporal coverage field says end 2023 while the title says 2025. Resolve it."]],
        why: "", open: "SDIS CORSE-DU-SUD rows exist in the file. Which aggregates answer D1 is non vérifié." },
      con: { s: "todo", short: "Money only", steps: ["Single source for money."], rules: [], why: "No staffing, vehicle or station data was found. That stays a documented gap.", open: "" },
      mod: { s: "todo", short: "Budget by year", steps: ["Yearly budget figures for the where-to-concentrate-means question."], rules: [], why: "", open: "" }
    } }
];

var MISMATCHES = [
  { t: "Department code: 20, 2A, 2B", a: "Fires and the index use 2A and 2B. Weather uses 20 for all of Corse. Before 1976 every commune code starts with 20.",
    f: "Station crosswalk for weather. Territory dimension with 20xxx → 2Axxx for fires." },
  { t: "Commune codes across time", a: "Mergers and the 1976 department split change codes. A fire in 1974 and a boundary file from 2026 do not share codes.",
    f: "Type-2 territory dimension. Facts point to the version valid on their date." },
  { t: "Index is a level, and a forecast", a: "niveau_j1 and niveau_j2 are levels 1 to 4 forecast for the next day and the day after. The client may be calling this 'the index'.",
    f: "Say 'level' in every result. Test same-day and next-day alignment and keep the one the PDF supports." },
  { t: "Index history versus fire history", a: "Levels start in June 2024. Fire starts run from 1973, but stop at 2024-12-31. Today the overlap is one season.",
    f: "Proxy from S08 as a separate column, calibrated on the overlap. Or use the overlap only. Or ask the client." },
  { t: "Season coverage", a: "Levels exist for about June to September. 31% of 2A fires happen outside it.",
    f: "Define the trigger question inside the season. Report the share outside as a limit." },
  { t: "Fire IDs are not unique", a: "About 644 rows of 1990–2024 share an ID_DDT2A with another row. 2,932 PROMETHEE numbers appear more than once.",
    f: "Investigate before counting. Second fires on one day, or duplicates? Decide, then log it." },
  { t: "Fire totals", a: "22,699 starts in the DDTM files for 1973–2024, against 'more than 17,790 since 1973' on a prefecture page.",
    f: "Reconcile to the source and write the cause. They may count different things." },
  { t: "Recording source changes over time", a: "SOURCE mixes DDT2A, PROMETHEE and OPENDFCI2A, in different shares by decade. Fires per year fall from 777 in 1990 to 122 in 2024.",
    f: "Count by SOURCE per year before trusting any trend. Not proven either way." }
];

var DROPPED = [
  ["S09 IFM/FWI hourly", "Its own description says 'not active for the moment', no quality guarantee.", "Reject"],
  ["S07 Météo des Forêts API", "Live forecast only, and needs an API key. A historical analysis does not need it.", "On hold, keep only if a live feed is wanted"],
  ["S04 Place names tied to fire starts", "Fires already carry a commune code.", "To decide: drop and say why"],
  ["S13 DFCI 2×2 km grid", "Only useful if fire starts use the grid. Non vérifié.", "To decide"],
  ["S14 PPRN hazard zones", "If it only covers floods it is irrelevant. Non vérifié.", "To decide"],
  ["S19 Prométhée and OpenDFCI 2A", "Not on data.gouv.fr. Access and licence non vérifié. Already one of the SOURCE values in S02.", "Possible gap"],
  ["Pyro-SDIS fire images", "Images for smoke detection. No question of the order uses images.", "Reject"],
  ["Fire data from other departments", "National comparison goes through BDIFF.", "Reject"]
];

var GAPS = [
  { t: "Official index before 2024", b: "One season of overlap with fires. Options: calibrated proxy, official history from the client, or give up the threshold question." },
  { t: "Fire data after 2024", b: "The fire files stop at 2024-12-31, even though one catalogue title says 2025." },
  { t: "Fire data for Haute-Corse (2B)", b: "No equivalent found. The 2B comparison is for the index only." },
  { t: "Staff, vehicles, stations, water points", b: "No public data found for Corse-du-Sud. Collect, use a proxy, or give up, with the reason written." },
  { t: "Fire cause", b: "61% unknown. Not enough to build an answer on." },
  { t: "National comparison on index days", b: "BDIFF may stop in 2022 while the index starts in 2024, so the two may never overlap." }
];

var RUBRIC = [
  ["Dates", "todo", "Pipeline v0.1 about Dec 4 (to confirm), star schema Dec 9, client answer Dec 11. Source dossier v1 was due Nov 17: whether it was handed in is not known."],
  ["Star-schema tests and queries", "todo", "Four tests required: non-loss, uniqueness, referential integrity, non-overlap of type-2 periods. Three decision queries: high-danger days with no fire, fires on low-danger days, Corse-du-Sud versus region versus France. None written yet."],
  ["Sources justified", "prog", "17 candidate sources inventoried with the question each serves. Strategy page decides merge versus reference per need. Identity sheets (12 fields) exist only as a template so far."],
  ["Gaps identified", "done", "Gaps and risks are listed in the inventory and in the data-solutions page. Each needs a final decision: collect, proxy, or give up."],
  ["GDPR and compliance", "todo", "No personal data is expected in the geographic sources. Fire cause and place names could be indirect identifiers. The minimization table (field, question, keep/pseudonymize/drop) is not written yet. Licences announced: Licence Ouverte 2.0, no ODbL found."],
  ["Decision log", "todo", "Several decisions are ready to log (union of fire files, index alignment, proxy, fire definition) but the docs/decisions/ folder does not exist yet."],
  ["Project management", "todo", "The roadmap defines four roles (project lead, sources lead, quality and compliance lead, pipeline and model lead) with no names, while the source split gives each person a family of sources. Reconcile the two. This folder is not a git repository yet, so tickets, branches and individual commits are not visible."]
];


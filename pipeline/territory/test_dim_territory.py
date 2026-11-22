"""Tests de la dimension territoire (type 2). Lancer : python3 -I pipeline/territory/test_dim_territory.py
Lit data/staging/territory/dim_territory.csv, crosswalk.csv et le GeoJSON S11 ; sort avec un code d'erreur si un test échoue."""
import csv, json, os, sys, collections

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
dim = list(csv.DictReader(open(os.path.join(ROOT, "data/staging/territory/dim_territory.csv"), encoding="utf-8")))
xw = list(csv.DictReader(open(os.path.join(ROOT, "data/staging/territory/crosswalk.csv"), encoding="utf-8")))
geo = json.load(open(os.path.join(ROOT, "data/raw/territory/s11-ign-adminexpress-wfs-2a/communes_2A.geojson"), encoding="utf-8"))
failures = []


def check(name, ok, detail=""):
    print(("OK   " if ok else "ECHEC"), name, detail)
    if not ok:
        failures.append(name)


# 1. clé de substitution unique
keys = [d["territory_key"] for d in dim]
check("territory_key unique", len(keys) == len(set(keys)), f"({len(keys)} lignes)")

# 2. périodes valides non chevauchantes pour une même commune actuelle
by_cur = collections.defaultdict(list)
for d in dim:
    by_cur[d["current_code"]].append((d["valid_from"], d["valid_to"], d["commune_code"]))
overlaps = []
for cur, periods in by_cur.items():
    periods.sort()
    for (f1, t1, c1), (f2, t2, c2) in zip(periods, periods[1:]):
        if f2 <= t1:
            overlaps.append((cur, c1, c2))
check("périodes sans chevauchement par commune", not overlaps, f"({len(overlaps)} chevauchements)")

# 3. pas de trou : la période suivante commence le lendemain de la fin de la précédente
gaps = []
for cur, periods in by_cur.items():
    periods.sort()
    for (f1, t1, _), (f2, t2, _) in zip(periods, periods[1:]):
        if int(f2) != int(t1) + 1 and not (t1[4:] == "1231" and f2[4:] == "0101" and int(f2[:4]) == int(t1[:4]) + 1):
            gaps.append((cur, t1, f2))
check("périodes contiguës", not gaps, f"({len(gaps)} trous)")

# 4. une seule version courante par commune
cur_counts = collections.Counter(d["current_code"] for d in dim if d["is_current"] == "1")
check("une version courante par commune", all(v == 1 for v in cur_counts.values()), f"({len(cur_counts)} communes)")

# 5. les 124 communes courantes sont celles de S11
codes_geo = {f["properties"]["code_insee"] for f in geo["features"]}
codes_dim = {d["commune_code"] for d in dim if d["is_current"] == "1"}
check("communes courantes = communes S11", codes_geo == codes_dim, f"({len(codes_dim)} contre {len(codes_geo)})")

# 6. chaque ancien code 20xxx de la table de correspondance existe dans la dimension
known = {d["commune_code"] for d in dim}
missing = [x["old_code"] for x in xw if x["old_code"] not in known]
check("correspondances : anciens codes présents", not missing, f"({len(missing)} absents)")

sys.exit(1 if failures else 0)

"""Rattache chaque poste Météo-France du département 20 (Corse) à une commune de la Corse-du-Sud (2A)
par point-dans-polygone avec les limites IGN (S11). Sortie : data/staging/weather/station_crosswalk.csv.
Lecture seule de data/raw ; à lancer avec python3 -I."""
import csv, gzip, io, json, glob, os

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
GEO = os.path.join(ROOT, "data/raw/territory/s11-ign-adminexpress-wfs-2a/communes_2A.geojson")
FILES = glob.glob(os.path.join(ROOT, "data/raw/index_weather/s08_q20_*/*.csv.gz"))
OUT = os.path.join(ROOT, "data/staging/weather/station_crosswalk.csv")


def ring_contains(ring, x, y):
    inside = False
    j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i][0], ring[i][1]
        xj, yj = ring[j][0], ring[j][1]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            inside = not inside
        j = i
    return inside


def polygons(geom):
    return [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]


def contains(geom, x, y):
    for poly in polygons(geom):
        if ring_contains(poly[0], x, y) and not any(ring_contains(h, x, y) for h in poly[1:]):
            return True
    return False


def bbox(geom):
    pts = [p for poly in polygons(geom) for p in poly[0]]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


def main():
    feats = json.load(open(GEO, encoding="utf-8"))["features"]
    boxes = [(bbox(f["geometry"]), f) for f in feats]
    stations = {}
    for path in FILES:
        with gzip.open(path, "rt", encoding="utf-8", errors="replace") as g:
            rd = csv.DictReader(g, delimiter=";")
            for r in rd:
                k = r["NUM_POSTE"]
                if k not in stations:
                    stations[k] = (r["NOM_USUEL"], r["LAT"], r["LON"], r["ALTI"])
    rows = []
    for k, (nom, lat, lon, alti) in sorted(stations.items()):
        try:
            x, y = float(lon), float(lat)
        except ValueError:
            rows.append((k, nom, lat, lon, alti, "", "", "coordonnees_invalides"))
            continue
        found = None
        for (x0, y0, x1, y1), f in boxes:
            if x0 <= x <= x1 and y0 <= y <= y1 and contains(f["geometry"], x, y):
                found = f["properties"]
                break
        if found:
            rows.append((k, nom, lat, lon, alti, found["code_insee"], "2A", "dans_commune_2A"))
        else:
            rows.append((k, nom, lat, lon, alti, "", "2B_ou_hors_2A", "hors_limites_2A"))
    with open(OUT, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["num_poste", "nom_usuel", "lat", "lon", "alti", "commune_code", "departement", "methode"])
        w.writerows(rows)
    n2a = sum(1 for r in rows if r[6] == "2A")
    print(f"{len(rows)} postes, {n2a} en Corse-du-Sud, ecrit {OUT}")


if __name__ == "__main__":
    main()

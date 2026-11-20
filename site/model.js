/* Graph 2: the proposed response engine. Graph only, no text panels.
   Reuses ns() and Y0 and the shared playing / speedMul controls from app.js. */
(function () {
  var svg2 = document.getElementById("graph2"), N = {}, E = [];
  function node(id, x, y, w, h, o) { N[id] = Object.assign({ id: id, x: x, y: y + Y0, w: w, h: h }, o); }
  function inp(id, x, y, title, sub, status) { node(id, x, y, 230, 70, { kind: "src", title: title, sub: sub, status: status }); }
  inp("in_alert", 25, 10, "Lieu et heure du feu", "entrée en direct", "todo");
  inp("in_terrain", 275, 10, "Terrain et météo", "en partie dans nos sources", "prog");
  inp("in_risk", 525, 10, "Modèles de risque", "du plan de modèles", "todo");
  inp("in_cover", 775, 10, "Plan de couverture", "planche 2", "todo");
  inp("in_roads", 25, 420, "Réseau routier", "données manquantes", "gap");
  inp("in_units", 775, 420, "Casernes et moyens", "données manquantes", "gap");
  inp("in_water", 1025, 420, "Points d'eau et pistes", "données manquantes", "gap");
  [["e1", 40, "E1", "Zone et routes", "extraction"], ["e2", 290, "E2", "Moteur d'itinéraires", "recherche de chemin"], ["e3", 540, "E3", "Dimensionnement", "règles, puis ML"],
   ["e4", 790, "E4", "Engagement", "optimisation + RL"], ["e5", 1040, "E5", "Instructions", "modèles de texte"]].forEach(function (p) {
    node(p[0], p[1], 190, 150, 120, { kind: "model", eid: p[2], title: p[3], sub: p[4], status: "todo" });
  });
  node("out", 1250, 190, 140, 120, { kind: "decision", title: "Équipes et commandant", sub: "humain valide", status: "todo" });

  function edge(a, b, cls, o) {
    o = o || {}; var A = N[a], B = N[b], d, cx, x1, x2, y1, y2, dx;
    if (o.d) d = o.d;
    else if (o.up) { cx = A.x + A.w / 2; d = "M" + cx + " " + A.y + " L" + cx + " " + (B.y + B.h); }
    else if (o.down) { cx = A.x + A.w / 2; d = "M" + cx + " " + (A.y + A.h) + " L" + cx + " " + B.y; }
    else { x1 = A.x + A.w; x2 = B.x; y1 = A.y + A.h / 2; y2 = B.y + B.h / 2; dx = (x2 - x1) / 2; d = "M" + x1 + " " + y1 + " C" + (x1 + dx) + " " + y1 + " " + (x2 - dx) + " " + y2 + " " + x2 + " " + y2; }
    E.push({ a: a, b: b, cls: cls, label: o.label, d: d, lx: o.lx, ly: o.ly });
  }
  edge("in_cover", "e4", "plan", { down: 1 }); edge("in_alert", "e1", "plan", { down: 1 }); edge("in_terrain", "e2", "prog", { down: 1 }); edge("in_risk", "e3", "plan", { down: 1 });
  edge("in_roads", "e1", "gap", { up: 1 }); edge("in_units", "e4", "gap", { up: 1 }); edge("in_water", "e5", "gap", { up: 1 });
  edge("e1", "e2", "plan", { label: "graphe routier" }); edge("e2", "e3", "plan", { label: "temps de trajet" });
  edge("e3", "e4", "plan", { label: "besoins" }); edge("e4", "e5", "plan", { label: "affectations" }); edge("e5", "out", "plan", { label: "ordres" });
  edge("out", "e1", "plan", { d: "M1320 " + (190 + Y0) + " C1320 " + (120 + Y0) + " 175 " + (120 + Y0) + " 175 " + (190 + Y0), label: "replanifier selon le feu", lx: 700, ly: 128 + Y0 });

  var gE = ns("g", {}, svg2), gP = ns("g", {}, svg2), gN = ns("g", {}, svg2);
  ns("text", { x: 25, y: 16, "class": "colhead" }, svg2).textContent = "Entrées";
  E.forEach(function (e) {
    e.path = ns("path", { d: e.d, "class": "edge " + e.cls }, gE); e.len = e.path.getTotalLength(); e.parts = [];
    if (e.label) { var pt = e.lx ? { x: e.lx, y: e.ly + 7 } : e.path.getPointAtLength(e.len / 2); ns("text", { x: pt.x, y: pt.y - 7, "class": "elabel" }, gE).textContent = e.label; }
    if (e.cls === "gap") return;
    var n = Math.max(2, Math.round(e.len / 75)), v = e.cls === "plan" ? 70 : 55;
    for (var i = 0; i < n; i++) e.parts.push({ el: ns("circle", { r: 3.2, "class": "p " + e.cls }, gP), t: i / n, v: v * (0.85 + Math.random() * 0.3) });
  });

  Object.keys(N).forEach(function (id) {
    var n = N[id], g = ns("g", { "class": "node " + n.kind + " id-" + String(id).replace(/[^a-z0-9]+/gi, "-"), tabindex: 0, role: "button", "aria-label": n.title + ", " + n.sub }, gN); n.g = g;
    ns("rect", { x: n.x, y: n.y, width: n.w, height: n.h, rx: 8 }, g);
    ns("circle", { cx: n.x + 14, cy: n.y + 15, r: 4, "class": "sd " + n.status }, g);
    if (n.eid) {
      ns("text", { x: n.x + 24, y: n.y + 19, "class": "id" }, g).textContent = n.eid;
      var words = n.title.split(" "), half = Math.ceil(words.length / 2), two = n.title.length > 14;
      ns("text", { x: n.x + 12, y: n.y + 52, "class": "t" }, g).textContent = two ? words.slice(0, half).join(" ") : n.title;
      if (two) ns("text", { x: n.x + 12, y: n.y + 70, "class": "t" }, g).textContent = words.slice(half).join(" ");
      ns("text", { x: n.x + 12, y: n.y + 100, "class": "s" }, g).textContent = n.sub;
    } else if (n.id === "out") {
      ns("text", { x: n.x + 12, y: n.y + 52, "class": "t" }, g).textContent = "Équipes et";
      ns("text", { x: n.x + 12, y: n.y + 70, "class": "t" }, g).textContent = "commandant";
      ns("text", { x: n.x + 12, y: n.y + 100, "class": "s" }, g).textContent = n.sub;
    } else {
      ns("text", { x: n.x + 24, y: n.y + 19, "class": "t" }, g).textContent = n.title;
      ns("text", { x: n.x + 12, y: n.y + 46, "class": "s" }, g).textContent = n.sub;
    }
    g.addEventListener("mouseenter", function () { trace(id); }); g.addEventListener("mouseleave", function () { trace(null); });
    g.addEventListener("focus", function () { trace(id); }); g.addEventListener("blur", function () { trace(null); });
  });

  function reach(start, dir) {
    var seen = {}; seen[start] = 1; var q = [start];
    while (q.length) { var c = q.pop(); E.forEach(function (e) { var f = dir > 0 ? e.a : e.b, t = dir > 0 ? e.b : e.a; if (f === c && !seen[t]) { seen[t] = 1; q.push(t); } }); }
    return seen;
  }
  function trace(id) {
    var keep = null;
    if (id) { keep = {}; var u = reach(id, -1), d = reach(id, 1); Object.keys(u).forEach(function (k) { keep[k] = 1; }); Object.keys(d).forEach(function (k) { keep[k] = 1; }); }
    Object.keys(N).forEach(function (k) { N[k].g.classList.toggle("dim", !!keep && !keep[k]); });
    E.forEach(function (e) { var off = !!keep && !(keep[e.a] && keep[e.b]); e.path.classList.toggle("dim", off); e.parts.forEach(function (p) { p.el.classList.toggle("dim", off); }); });
  }

  var last = 0;
  function place() { E.forEach(function (e) { e.parts.forEach(function (p) { var pt = e.path.getPointAtLength(p.t * e.len); p.el.setAttribute("cx", pt.x); p.el.setAttribute("cy", pt.y); }); }); }
  function frame(ts) {
    var dt = Math.min((ts - last) / 1000, 0.05); last = ts;
    if (playing) { E.forEach(function (e) { e.parts.forEach(function (p) { p.t += (p.v * speedMul * dt) / e.len; if (p.t > 1) p.t -= 1; }); }); place(); }
    requestAnimationFrame(frame);
  }
  place(); requestAnimationFrame(frame);
})();

/* Graph 4: the proposed maximum coverage engine (runs before a fire). Graph only.
   Reuses ns() and Y0 and the shared playing / speedMul controls from app.js. */
(function () {
  var svg4 = document.getElementById("graph4"), N = {}, E = [];
  function node(id, x, y, w, h, o) { N[id] = Object.assign({ id: id, x: x, y: y + Y0, w: w, h: h }, o); }
  function inp(id, x, y, title, sub, status) { node(id, x, y, 230, 70, { kind: "src", title: title, sub: sub, status: status }); }
  inp("c_risk", 535, 10, "Carte de risque", "modèles M2, M4, M3", "todo");
  inp("c_time", 800, 10, "Temps de réponse visé", "à fixer avec le SDIS", "todo");
  inp("c_roads", 60, 410, "Réseau routier", "données manquantes", "gap");
  inp("c_units", 470, 410, "Casernes et moyens", "données manquantes", "gap");
  node("k1", 320, 170, 160, 120, { kind: "model", eid: "K1", lines: ["Temps de trajet"], title: "Temps de trajet", sub: "calcul de chemins", status: "todo" });
  node("k2", 570, 170, 160, 120, { kind: "model", eid: "K2", lines: ["Couverture", "maximale"], title: "Couverture maximale", sub: "optimisation", status: "todo" });
  node("k3", 820, 170, 160, 120, { kind: "model", eid: "K3", lines: ["Plan de", "positionnement"], title: "Plan de positionnement", sub: "où placer, patrouiller", status: "todo" });
  node("k4", 820, 340, 160, 90, { kind: "model", eid: "K4", lines: ["Contrôle"], title: "Contrôle", sub: "part du risque couverte", status: "todo" });
  node("o1", 1290, 150, 170, 70, { kind: "decision", title: "Commandant", sub: "une personne valide", status: "todo" });
  node("o2", 1290, 300, 170, 70, { kind: "decision", title: "Vers le feu", sub: "garde la couverture mini", status: "todo" });

  function edge(a, b, cls, d, o) { o = o || {}; E.push({ a: a, b: b, cls: cls, d: d, label: o.label, lx: o.lx, ly: o.ly }); }
  function vc(x1, y1, x2, y2) { var m = (y1 + y2) / 2; return "M" + x1 + " " + (y1 + Y0) + " C" + x1 + " " + (m + Y0) + " " + x2 + " " + (m + Y0) + " " + x2 + " " + (y2 + Y0); }
  edge("c_risk", "k2", "plan", "M650 " + (80 + Y0) + " C650 " + (125 + Y0) + " 625 " + (125 + Y0) + " 625 " + (170 + Y0));
  edge("c_time", "k2", "todo", vc(915, 80, 675, 170));
  edge("c_roads", "k1", "gap", vc(175, 410, 370, 290));
  edge("c_units", "k1", "gap", vc(585, 410, 430, 290));
  edge("k1", "k2", "plan", "M480 " + (230 + Y0) + " L570 " + (230 + Y0), { label: "temps de trajet" });
  edge("k2", "k3", "plan", "M730 " + (230 + Y0) + " L820 " + (230 + Y0), { label: "positions" });
  edge("k3", "o1", "plan", "M980 " + (230 + Y0) + " C1130 " + (230 + Y0) + " 1140 " + (185 + Y0) + " 1290 " + (185 + Y0));
  edge("k3", "k4", "plan", "M900 " + (290 + Y0) + " L900 " + (340 + Y0));
  edge("k4", "o2", "plan", "M980 " + (385 + Y0) + " C1130 " + (385 + Y0) + " 1140 " + (335 + Y0) + " 1290 " + (335 + Y0));
  edge("k4", "k2", "plan", "M820 " + (385 + Y0) + " C740 " + (385 + Y0) + " 650 " + (360 + Y0) + " 650 " + (290 + Y0), { label: "replanifier", lx: 700, ly: 375 + Y0 });

  var gE = ns("g", {}, svg4), gP = ns("g", {}, svg4), gN = ns("g", {}, svg4);
  [["Entrées", 60], ["Le moteur", 320], ["Résultat", 1290]].forEach(function (h) { ns("text", { x: h[1], y: 16, "class": "colhead" }, svg4).textContent = h[0]; });
  E.forEach(function (e) {
    e.path = ns("path", { d: e.d, "class": "edge " + e.cls }, gE); e.len = e.path.getTotalLength(); e.parts = [];
    if (e.label) { var pt = e.lx ? { x: e.lx, y: e.ly + 7 } : e.path.getPointAtLength(e.len / 2); ns("text", { x: pt.x, y: pt.y - 7, "class": "elabel" }, gE).textContent = e.label; }
    if (e.cls === "gap") return;
    var n = e.cls === "todo" ? 1 : Math.max(2, Math.round(e.len / 75)), v = e.cls === "plan" ? 70 : 30;
    for (var i = 0; i < n; i++) e.parts.push({ el: ns("circle", { r: 3.2, "class": "p " + e.cls }, gP), t: i / n, v: v * (0.85 + Math.random() * 0.3) });
  });

  Object.keys(N).forEach(function (id) {
    var n = N[id], g = ns("g", { "class": "node " + n.kind + " id-" + String(id).replace(/[^a-z0-9]+/gi, "-"), tabindex: 0, role: "button", "aria-label": n.title + ", " + n.sub }, gN); n.g = g;
    ns("rect", { x: n.x, y: n.y, width: n.w, height: n.h, rx: 8 }, g);
    ns("circle", { cx: n.x + 14, cy: n.y + 15, r: 4, "class": "sd " + n.status }, g);
    if (n.eid) {
      ns("text", { x: n.x + 24, y: n.y + 19, "class": "id" }, g).textContent = n.eid;
      n.lines.forEach(function (ln, i) { ns("text", { x: n.x + 12, y: n.y + 52 + 18 * i, "class": "t" }, g).textContent = ln; });
      ns("text", { x: n.x + 12, y: n.y + (n.h === 120 ? 100 : n.h - 14), "class": "s" }, g).textContent = n.sub;
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

/* Graph 3: reinforcement-learning training loop for dispatch. Reuses ns(), playing, speedMul from app.js. */
(function () {
  var svg = document.getElementById("graph3");
  if (!svg) return;
  var N = {}, E = [];
  function node(id, x, y, w, h, title, sub, status, cls, centre) { N[id] = { id: id, x: x, y: y, w: w, h: h, title: title, sub: sub, status: status, cls: cls || "", centre: centre }; }
  node("in_fire", 20, 20, 210, 56, "Départs de feu passés", "13 191 · 1990–2024", "prog");
  node("in_roads", 20, 120, 210, 56, "Graphe routier", "données routières requises", "gap");
  node("in_growth", 20, 220, 210, 56, "Propagation (M5)", "calibrée sur 1 380 contours", "gap");
  node("in_units", 20, 320, 210, 56, "Unités et casernes", "synthétiques ou SDIS", "gap");
  node("sim", 330, 140, 190, 150, "SIMULATEUR", "à construire", "todo", "model", 1);
  node("state", 600, 20, 170, 60, "État", "feux, unités, vent", "todo");
  node("reward", 600, 185, 170, 60, "Récompense", "arrivée · surface", "todo");
  node("action", 600, 350, 170, 60, "Action masquée", "affecter, garder, déplacer", "todo");
  node("agent", 850, 150, 170, 130, "AGENT", "politique : PPO ou DQN", "todo", "model", 1);
  node("eval", 1090, 185, 150, 60, "Évaluation", "test · 3+ graines", "todo");
  node("base", 1090, 340, 150, 60, "Solveur actuel", "engine/dispatch.py", "prog");
  node("yes", 1300, 90, 190, 60, "Au commandant", "humain valide", "todo", "decision");
  node("no", 1300, 300, 190, 60, "Garder le solveur", "RL abandonné", "todo");
  function edge(a, b, cls, d, label) { E.push({ a: a, b: b, cls: cls, d: d, label: label }); }
  edge("in_fire", "sim", "prog", "M230 48 C280 48 280 170 330 170");
  edge("in_roads", "sim", "gap", "M230 148 C280 148 280 200 330 200");
  edge("in_growth", "sim", "gap", "M230 248 C280 248 280 230 330 230");
  edge("in_units", "sim", "gap", "M230 348 C280 348 280 260 330 260");
  edge("sim", "state", "plan", "M425 140 C425 50 500 50 600 50", "observer");
  edge("state", "agent", "plan", "M770 50 C880 50 935 70 935 150");
  edge("sim", "reward", "plan", "M520 215 L600 215");
  edge("reward", "agent", "plan", "M770 215 L850 215", "apprendre");
  edge("agent", "action", "plan", "M935 280 C935 380 880 380 770 380", "agir");
  edge("action", "sim", "plan", "M600 380 C500 380 425 360 425 290", "avancer");
  edge("agent", "eval", "plan", "M1020 215 L1090 215");
  edge("base", "eval", "todo", "M1165 340 L1165 245");
  edge("eval", "yes", "plan", "M1240 215 C1270 215 1270 120 1300 120");
  edge("eval", "no", "todo", "M1240 215 C1270 215 1270 330 1300 330");

  [["Données réelles", 20], ["Simulateur", 330], ["Boucle d'apprentissage", 600], ["Évaluation", 1090], ["Décision", 1300]].forEach(function (h) {
    ns("text", { x: h[1], y: 16, "class": "colhead" }, svg).textContent = h[0];
  });
  var root = ns("g", { transform: "translate(0,34)" }, svg);
  var gE = ns("g", {}, root), gP = ns("g", {}, root), gN = ns("g", {}, root);

  E.forEach(function (e) {
    e.path = ns("path", { d: e.d, "class": "edge " + e.cls }, gE); e.len = e.path.getTotalLength(); e.parts = [];
    if (e.label) { var pt = e.path.getPointAtLength(e.len / 2); ns("text", { x: pt.x, y: pt.y - 7, "class": "elabel" }, gE).textContent = e.label; }
    if (e.cls === "gap") return;
    var n = e.cls === "todo" ? 1 : Math.max(2, Math.round(e.len / 75)), v = e.cls === "plan" ? 70 : e.cls === "prog" ? 55 : 30;
    for (var i = 0; i < n; i++) e.parts.push({ el: ns("circle", { r: 3.2, "class": "p " + e.cls }, gP), t: i / n, v: v * (0.85 + Math.random() * 0.3) });
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

  Object.keys(N).forEach(function (id) {
    var n = N[id], g = ns("g", { "class": "node " + n.cls + " id-" + String(id).replace(/[^a-z0-9]+/gi, "-"), tabindex: 0, role: "button", "aria-label": n.title + ", " + n.sub }, gN); n.g = g;
    ns("rect", { x: n.x, y: n.y, width: n.w, height: n.h, rx: 8 }, g);
    ns("circle", { cx: n.x + 14, cy: n.y + 15, r: 4, "class": "sd " + n.status }, g);
    if (n.centre) {
      ns("text", { x: n.x + n.w / 2, y: n.y + n.h / 2 - 2, "class": "t", "text-anchor": "middle" }, g).textContent = n.title;
      ns("text", { x: n.x + n.w / 2, y: n.y + n.h / 2 + 16, "class": "s", "text-anchor": "middle" }, g).textContent = n.sub;
    } else {
      ns("text", { x: n.x + 24, y: n.y + 19, "class": "t" }, g).textContent = n.title;
      ns("text", { x: n.x + 12, y: n.y + 40, "class": "s" }, g).textContent = n.sub;
    }
    g.addEventListener("mouseenter", function () { trace(id); }); g.addEventListener("mouseleave", function () { trace(null); });
    g.addEventListener("focus", function () { trace(id); }); g.addEventListener("blur", function () { trace(null); });
  });

  var last = 0;
  function place() { E.forEach(function (e) { e.parts.forEach(function (p) { var pt = e.path.getPointAtLength(p.t * e.len); p.el.setAttribute("cx", pt.x); p.el.setAttribute("cy", pt.y); }); }); }
  function frame(ts) {
    var dt = Math.min((ts - last) / 1000, 0.05); last = ts;
    if (playing) { E.forEach(function (e) { e.parts.forEach(function (p) { p.t += (p.v * speedMul * dt) / e.len; if (p.t > 1) p.t -= 1; }); }); place(); }
    requestAnimationFrame(frame);
  }
  place(); requestAnimationFrame(frame);
})();

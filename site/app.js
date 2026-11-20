/* Animated pipeline graph. Content comes from data.js (SOURCES, MISMATCHES, GAPS, DROPPED, STAGES, STATUS). */
var NS = "http://www.w3.org/2000/svg";
var Y0 = 34; // room for column headings
var svg = document.getElementById("graph");

var SHORT = { "S01+S02": "DDTM départs de feu", "S03": "DDTM contours", "S05": "BDIFF national", "S06": "Météo des forêts",
  "S08": "Météo-France climat", "S10": "INSEE COG", "S11": "IGN ADMIN EXPRESS", "S12": "CORINE / BD Forêt", "S15": "OFGL comptes SDIS" };
var FAMILIES = [
  { id: "fam:fire", title: "Feu", sub: "départs, contours", members: ["S01+S02", "S03", "S05"] },
  { id: "fam:index", title: "Indice et météo", sub: "niveaux, climatologie", members: ["S06", "S08"] },
  { id: "fam:terr", title: "Territoire", sub: "codes, limites", members: ["S10", "S11"] },
  { id: "fam:ctx", title: "Contexte", sub: "sol, budget", members: ["S12", "S15"] }
];
var FAMOF = {};
FAMILIES.forEach(function (f) { f.members.forEach(function (m) { FAMOF[m] = f.id.split(":")[1]; }); });
function famOf(id) { if (id.indexOf("src:") === 0) return FAMOF[id.slice(4)] || ""; if (id.indexOf("fam:") === 0) return id.slice(4); return ""; }
function S(id) { return SOURCES.filter(function (s) { return s.id === id; })[0]; }
function stat(id, stage) { return S(id).stages[stage].s; }
function agg(list) {
  var v = list.filter(function (x) { return x !== "na"; });
  if (!v.length) return "todo";
  if (v.every(function (x) { return x === "done"; })) return "done";
  return v.some(function (x) { return x === "done" || x === "prog"; }) ? "prog" : "todo";
}
function ns(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function pill(s) { return '<span class="pill s-' + s + '"><i></i>' + STATUS[s] + '</span>'; }

/* ---------- nodes ---------- */
var nodes = {}, edges = [];
function node(id, x, y, w, h, o) { nodes[id] = Object.assign({ id: id, x: x, y: y + Y0, w: w, h: h }, o); return nodes[id]; }

var srcOrder = ["S01+S02", "S03", "S05", "S06", "S08", "S10", "S11", "S12", "S15"];
srcOrder.forEach(function (id, i) {
  var s = S(id), done = 0, tot = 0;
  Object.keys(s.stages).forEach(function (k) { if (s.stages[k].s !== "na") { tot++; if (s.stages[k].s === "done") done++; } });
  node("src:" + id, 10, i * 60, 200, 46, { kind: "src", src: id, title: SHORT[id], idtxt: id, st: done + "/" + tot, status: agg(Object.keys(s.stages).map(function (k) { return s.stages[k].s; })) });
});
node("raw", 290, 0, 110, 546, { kind: "layer", title: "BRUT", sub: "tel que reçu", status: agg(srcOrder.map(function (i) { return stat(i, "raw"); })), info: "raw", stage: "raw" });
FAMILIES.forEach(function (f, i) {
  node(f.id, 480, 10 + i * 130, 170, 84, { kind: "layer", title: f.title, sub: f.sub, fam: f, stage: "stg", status: agg(f.members.map(function (m) { return stat(m, "stg"); })) });
});
node("con", 730, 150, 150, 170, { kind: "layer", title: "CONSOLIDÉ", sub: "codes · règles", status: agg(srcOrder.map(function (i) { return stat(i, "con"); })), info: "con", stage: "con" });
node("rej", 730, 410, 150, 76, { kind: "layer", title: "Table de rejet", sub: "rien perdu en silence", status: "todo", info: "rej" });
var STAR = [["dim_territory", "dim_territory", "historisée (type 2)", "prog"], ["dim_date", "dim_date", "conformée", "todo"], ["dim_level", "dim_danger_level", "niveaux 1–4", "todo"],
  ["fact_fire", "fact_fire_start", "grain : un feu", "todo"], ["fact_danger", "fact_danger_day", "grain : dép. · jour", "todo"]];
STAR.forEach(function (d, i) { node(d[0], 920, i * 105, 160, 60, { kind: "layer", title: d[1], sub: d[2], status: d[3], info: d[0] }); });
node("db", 1130, 0, 110, 500, { kind: "layer", title: "BASE FINALE", sub: "étoile historisée", status: agg(STAR.map(function (d) { return d[3]; })), info: "db" });
var QS = [["q3", "Q3 · 2A vs France", 10], ["q1", "Q1 · alerte sans feu", 110], ["q2", "Q2 · feu sans alerte", 210]];
QS.forEach(function (q) { node(q[0], 1310, q[2], 180, 64, { kind: "decision", title: q[1], sub: "requête décisionnelle", status: "todo", info: q[0] }); });
node("stage2", 1310, 340, 180, 100, { kind: "decision", title: "Modèles et moteur", sub: "Étape 2 : risque", status: "todo", info: "stage2" });

/* ---------- edges ---------- */
function edge(a, b, status, o) {
  var A = nodes[a], B = nodes[b], x1 = A.x + A.w, x2 = B.x, y1, y2;
  o = o || {};
  y1 = o.y1 != null ? o.y1 + Y0 : A.y + A.h / 2; y2 = o.y2 != null ? o.y2 + Y0 : B.y + B.h / 2;
  var d;
  if (o.vertical) { x1 = A.x + A.w / 2; x2 = B.x + B.w / 2; y1 = A.y + A.h; y2 = B.y; d = "M" + x1 + " " + y1 + " L" + x2 + " " + y2; }
  else { var dx = (x2 - x1) / 2; d = "M" + x1 + " " + y1 + " C" + (x1 + dx) + " " + y1 + " " + (x2 - dx) + " " + y2 + " " + x2 + " " + y2; }
  edges.push({ a: a, b: b, d: d, status: status, rej: !!o.rej, fam: famOf(a) || famOf(b) });
}
srcOrder.forEach(function (id) { edge("src:" + id, "raw", stat(id, "raw"), { y2: nodes["src:" + id].y - Y0 + 23 }); });
FAMILIES.forEach(function (f) { edge("raw", f.id, nodes[f.id].status === "todo" ? "todo" : agg(f.members.map(function (m) { return stat(m, "stg"); })), { y1: nodes[f.id].y - Y0 + 42 }); });
FAMILIES.forEach(function (f, i) { edge(f.id, "con", agg(f.members.map(function (m) { return stat(m, "con"); })), { y2: 185 + i * 40 - 0 }); });
edge("con", "rej", "todo", { vertical: true, rej: true });
STAR.forEach(function (d, i) { edge("con", d[0], d[3], { y1: 170 + i * 30 }); });
STAR.forEach(function (d, i) { edge(d[0], "db", d[3], { y2: i * 105 + 30 }); });
QS.forEach(function (q) { edge("db", q[0], "todo", { y1: q[2] + 32 }); });
edge("db", "stage2", "todo", { y1: 390 });

/* ---------- draw ---------- */
var gEdges = ns("g", {}, svg), gParts = ns("g", {}, svg), gNodes = ns("g", {}, svg);
[["Sources", 10], ["Brut", 290], ["Préparation", 480], ["Consolidé", 730], ["Schéma en étoile", 920], ["Base finale", 1130], ["Décisions · Étape 2", 1310]].forEach(function (h) {
  var t = ns("text", { x: h[1], y: 16, "class": "colhead" }, svg); t.textContent = h[0];
});
edges.forEach(function (e) {
  e.path = ns("path", { d: e.d, "class": "edge " + e.status + (e.rej ? " rej" : "") + (e.fam ? " f-" + e.fam : "") }, gEdges);
  e.len = e.path.getTotalLength(); e.parts = [];
  if (e.status === "gap") return;
  var n = e.rej ? 1 : e.status === "done" ? Math.max(2, Math.round(e.len / 70)) : e.status === "prog" ? Math.max(1, Math.round(e.len / 130)) : 1;
  var speed = e.status === "done" ? 95 : e.status === "prog" ? 60 : 32;
  for (var i = 0; i < n; i++) {
    var c = ns("circle", { r: e.status === "done" ? 3.6 : 3, "class": "p " + (e.rej ? "rej" : e.status) + (e.fam ? " f-" + e.fam : "") }, gParts);
    e.parts.push({ el: c, t: i / n, v: speed * (0.85 + Math.random() * 0.3) });
  }
});
Object.keys(nodes).forEach(function (id) {
  var n = nodes[id];
  var g = ns("g", { "class": "node " + n.kind + " id-" + String(n.id).replace(/[^a-z0-9]+/gi, "-") + (famOf(n.id) ? " fam-" + famOf(n.id) : ""), tabindex: 0, role: "button", "aria-label": n.title + (n.src ? ", ouvrir le détail" : "") }, gNodes);
  if (n.src) g.setAttribute("data-src", n.src);
  n.g = g;
  ns("rect", { x: n.x, y: n.y, width: n.w, height: n.h, rx: 8 }, g);
  var dotClass = n.status === "gap" ? "gap" : n.status;
  if (n.kind === "src") {
    ns("circle", { cx: n.x + 14, cy: n.y + 15, r: 4, "class": "sd " + dotClass }, g);
    var a = ns("text", { x: n.x + 24, y: n.y + 18, "class": "id" }, g); a.textContent = n.idtxt;
    var b = ns("text", { x: n.x + 12, y: n.y + 36, "class": "t" }, g); b.textContent = n.title;
    var c = ns("text", { x: n.x + n.w - 10, y: n.y + 18, "class": "st", "text-anchor": "end" }, g); c.textContent = n.st + " étapes";
  } else {
    var cx = n.x + n.w / 2, big = n.h > 200;
    ns("circle", { cx: n.x + 14, cy: n.y + 15, r: 4, "class": "sd " + dotClass }, g);
    var t = ns("text", { x: big ? cx : n.x + 24, y: big ? n.y + n.h / 2 - 4 : n.y + 19, "class": "t", "text-anchor": big ? "middle" : "start" }, g); t.textContent = n.title;
    var s = ns("text", { x: big ? cx : n.x + 24, y: big ? n.y + n.h / 2 + 14 : n.y + 36, "class": "s", "text-anchor": big ? "middle" : "start" }, g); s.textContent = n.sub;
    if (n.title.length > 20 && n.w < 180) t.setAttribute("font-size", "11.5");
  }
  g.addEventListener("mouseenter", function () { trace(id); });
  g.addEventListener("mouseleave", function () { trace(null); });
  g.addEventListener("focus", function () { trace(id); });
  g.addEventListener("blur", function () { trace(null); });
});

/* ---------- trace path on hover ---------- */
function reach(start, dir) {
  var seen = {}; seen[start] = 1; var q = [start];
  while (q.length) { var cur = q.pop(); edges.forEach(function (e) { var from = dir > 0 ? e.a : e.b, to = dir > 0 ? e.b : e.a; if (from === cur && !seen[to]) { seen[to] = 1; q.push(to); } }); }
  return seen;
}
function trace(id) {
  var keep = null;
  if (id) { var up = reach(id, -1), dn = reach(id, 1); keep = {}; Object.keys(up).forEach(function (k) { keep[k] = 1; }); Object.keys(dn).forEach(function (k) { keep[k] = 1; }); }
  Object.keys(nodes).forEach(function (k) { nodes[k].g.classList.toggle("dim", !!keep && !keep[k]); });
  edges.forEach(function (e) {
    var off = !!keep && !(keep[e.a] && keep[e.b]);
    e.path.classList.toggle("dim", off); e.parts.forEach(function (p) { p.el.classList.toggle("dim", off); });
  });
}

/* ---------- animation ---------- */
var playing = !window.matchMedia("(prefers-reduced-motion: reduce)").matches, speedMul = 1, last = 0;
function place() { edges.forEach(function (e) { e.parts.forEach(function (p) { var pt = e.path.getPointAtLength(p.t * e.len); p.el.setAttribute("cx", pt.x); p.el.setAttribute("cy", pt.y); }); }); }
function frame(ts) {
  var dt = Math.min((ts - last) / 1000, 0.05); last = ts;
  if (playing) { edges.forEach(function (e) { e.parts.forEach(function (p) { p.t += (p.v * speedMul * dt) / e.len; if (p.t > 1) p.t -= 1; }); }); place(); }
  requestAnimationFrame(frame);
}
var playBtn = document.getElementById("playBtn");
function syncBtn() { playBtn.textContent = playing ? "Pause" : "Lecture"; playBtn.setAttribute("aria-pressed", playing); }
playBtn.addEventListener("click", function () { playing = !playing; syncBtn(); });
document.getElementById("speed").addEventListener("input", function (e) { speedMul = parseFloat(e.target.value); });
syncBtn(); place(); requestAnimationFrame(frame);


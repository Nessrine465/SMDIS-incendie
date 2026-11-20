/* Source modal: click a source node in the pipeline graph to see what it is, its links, and what we got. Content: window.SRC (sources_*.js). */
(function () {
  var modal = document.getElementById("modal"), sheet = modal.querySelector(".sheet"), svgEl = document.getElementById("graph"), opener = null;
  function $(id) { return document.getElementById(id); }
  function safeUrl(u) { return /^https?:\/\//i.test(u) ? u : "#"; }
  function open(id, trigger) {
    var c = (window.SRC || {})[id], s = SOURCES.filter(function (x) { return x.id === id; })[0] || {};
    opener = trigger || null;
    $("mId").textContent = id;
    $("mTitle").textContent = c ? c.name : (s.name || id);
    $("mPub").textContent = c && c.publisher ? c.publisher : "";
    $("mWhat").textContent = c ? c.what : "Détails non chargés pour cette source.";
    $("mLinks").innerHTML = c && c.links && c.links.length ? c.links.map(function (l) { return '<a href="' + esc(safeUrl(l.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(l.label) + " ↗</a>"; }).join("") : '<span style="color:var(--muted)">Aucun lien enregistré</span>';
    $("mGot").innerHTML = c && c.got && c.got.length ? c.got.map(function (g) { return "<li><b>" + esc(g.item) + "</b><span>" + esc(g.detail) + "</span></li>"; }).join("") : '<li><span style="color:var(--muted)">Rien d\u2019enregistré pour l\u2019instant</span></li>';
    var cav = c && c.caveats ? c.caveats : [];
    $("mCav").innerHTML = cav.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    $("mCavBox").hidden = !cav.length;
    modal.hidden = false; document.body.style.overflow = "hidden"; sheet.scrollTop = 0; $("mClose").focus();
  }
  function close() { modal.hidden = true; document.body.style.overflow = ""; if (opener && opener.focus) { try { opener.focus({ preventScroll: true }); } catch (e) {} } }
  svgEl.addEventListener("click", function (e) { var n = e.target.closest(".node[data-src]"); if (n) open(n.getAttribute("data-src"), n); });
  svgEl.addEventListener("keydown", function (e) { if (e.key !== "Enter" && e.key !== " ") return; var n = e.target.closest(".node[data-src]"); if (n) { e.preventDefault(); open(n.getAttribute("data-src"), n); } });
  $("mClose").addEventListener("click", close);
  modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") { close(); return; }
    if (e.key === "Tab") {
      var f = sheet.querySelectorAll("a[href], button"); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();

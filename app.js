/* Rede de Egressos PPG-CTM: lê os dados (planilha publicada ou exemplo) e monta mapa, lista, painel e demais seções. */
(function () {
  "use strict";
  var CFG = window.REDE_CONFIG || {};
  var NS = "http://www.w3.org/2000/svg";
  var $ = function (id) { return document.getElementById(id); };

  // ---------- utilidades ----------
  function norm(s) { return String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(); }
  function esc(t) { var d = document.createElement("div"); d.textContent = t == null ? "" : String(t); return d.innerHTML; }
  function safeUrl(u) { u = String(u || "").trim(); return /^https?:\/\//i.test(u) ? u : ""; }
  function isRJ(r) { var u = norm(r.uf); return u === "rj" || u === "rio de janeiro"; }
  function placeKey(r) { return norm(r.cidade) + "|" + norm(r.uf); }
  function placeLabel(r) { return r.cidade + (isRJ(r) ? "" : (r.uf ? ", " + r.uf : "")); }

  // Lê CSV com aspas e quebras de linha dentro das células
  function parseCSV(text) {
    var rows = [], row = [], f = "", q = false, i, c;
    text = String(text).replace(/^﻿/, "");
    for (i = 0; i < text.length; i++) {
      c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else { q = false; } }
        else { f += c; }
      } else if (c === '"') { q = true; }
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(f); f = ""; rows.push(row); row = [];
      } else { f += c; }
    }
    if (f !== "" || row.length) { row.push(f); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (x) { return String(x).trim() !== ""; }); });
  }
  function toObjects(rows) {
    if (!rows.length) return [];
    var head = rows[0].map(norm);
    return rows.slice(1).map(function (r) {
      var o = {}; head.forEach(function (h, i) { o[h] = (r[i] || "").trim(); }); return o;
    });
  }

  // ---------- coordenadas aproximadas (lat, lon) ----------
  // Para mostrar uma nova cidade do RJ no mapa, basta incluí-la aqui (sem acentos, minúscula).
  var COORD = {
    "nova friburgo": [-22.28, -42.53], "rio de janeiro": [-22.91, -43.17], "niteroi": [-22.88, -43.10],
    "petropolis": [-22.51, -43.18], "macae": [-22.37, -41.79], "campos dos goytacazes": [-21.75, -41.32],
    "volta redonda": [-22.52, -44.10], "cabo frio": [-22.88, -42.02], "resende": [-22.47, -44.45],
    "teresopolis": [-22.41, -42.97], "angra dos reis": [-23.0, -44.32], "nova iguacu": [-22.76, -43.45],
    "duque de caxias": [-22.79, -43.31], "sao goncalo": [-22.83, -43.05], "marica": [-22.92, -42.82],
    "araruama": [-22.87, -42.34], "buzios": [-22.75, -41.88], "armacao dos buzios": [-22.75, -41.88],
    "rio das ostras": [-22.53, -41.94], "barra mansa": [-22.54, -44.17], "barra do pirai": [-22.47, -43.83],
    "tres rios": [-22.12, -43.21], "itaperuna": [-21.20, -41.89], "cordeiro": [-22.03, -42.36],
    "bom jardim": [-22.15, -42.42], "itatiaia": [-22.50, -44.56], "paraty": [-23.22, -44.71],
    "sao joao da barra": [-21.64, -41.05], "saquarema": [-22.92, -42.51], "itaborai": [-22.74, -42.86],
    "mesquita": [-22.80, -43.43], "belford roxo": [-22.76, -43.40], "sao joao de meriti": [-22.80, -43.37],
    "vassouras": [-22.40, -43.66], "valenca": [-22.25, -43.70], "sumidouro": [-22.05, -42.68],
    "sao pedro da aldeia": [-22.84, -42.10], "casimiro de abreu": [-22.48, -42.20], "conceicao de macabu": [-22.08, -41.87]
  };
  var OUTLINE = [[-44.88,-23.36],[-44.4,-23.2],[-43.9,-23.05],[-43.2,-23.06],[-42.6,-22.93],[-42.0,-22.97],[-41.7,-22.5],[-41.3,-22.0],[-41.0,-21.62],[-41.02,-21.2],[-41.4,-21.05],[-41.85,-20.98],[-42.1,-21.1],[-42.2,-21.6],[-42.7,-21.45],[-42.95,-21.2],[-43.2,-21.35],[-43.7,-21.55],[-44.1,-22.05],[-44.6,-22.2],[-44.88,-22.5]];
  var LON0 = -45.0, LAT0 = -20.7, DX = 97.6, DY = 106;
  function px(lon) { return (lon - LON0) * DX; }
  function py(lat) { return (LAT0 - lat) * DY; }

  // ---------- dados ----------
  var DATA = [], OPS = [], usingExample = false;
  var state = { q: "", setor: "", phd: "", linha: "", mentor: false, place: "" };

  function mapEgresso(o) {
    var phdRaw = norm(o.doutorado);
    var phd = phdRaw.indexOf("sim") === 0 ? (phdRaw.indexOf("uerj") >= 0 ? "UERJ" : "outra") : "";
    return {
      nome: o.nome, ano: parseInt(o.ano, 10) || 0, cidade: o.cidade, uf: o.uf, setor: o.setor || "Outra área",
      org: o.organizacao || o.empresa || "", cargo: o.cargo || "", phd: phd, titulo: o.titulo || "",
      linha: o.linha || "", orientador: o.orientador || "", mentor: norm(o.mentoria).indexOf("sim") === 0,
      linkedin: o.linkedin || "", lattes: o.lattes || ""
    };
  }
  function mapOp(o) {
    return { titulo: o.titulo, org: o.organizacao || "", tipo: o.tipo || "", local: o.local || "", data: o.data || "", link: o.link || "", descricao: o.descricao || "" };
  }
  function fetchCSV(url) {
    return fetch(url).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); }).then(function (t) { return toObjects(parseCSV(t)); });
  }
  function loadAll() {
    var p1, p2;
    if (CFG.EGRESSOS_CSV_URL) {
      p1 = fetchCSV(CFG.EGRESSOS_CSV_URL).then(function (rows) { return rows.filter(function (o) { return o.nome; }).map(mapEgresso); })
        .catch(function () { usingExample = true; showError(); return window.EXEMPLO_EGRESSOS || []; });
    } else { usingExample = true; p1 = Promise.resolve(window.EXEMPLO_EGRESSOS || []); }
    if (CFG.OPORTUNIDADES_CSV_URL) {
      p2 = fetchCSV(CFG.OPORTUNIDADES_CSV_URL).then(function (rows) { return rows.filter(function (o) { return o.titulo; }).map(mapOp); })
        .catch(function () { return []; });
    } else { p2 = Promise.resolve(window.EXEMPLO_OPORTUNIDADES || []); }
    return Promise.all([p1, p2]).then(function (v) { DATA = v[0]; OPS = v[1]; });
  }
  function showError() {
    var a = $("aviso-exemplo");
    a.hidden = false; a.textContent = "Não foi possível carregar a planilha. Mostrando dados de exemplo.";
  }

  // ---------- filtros ----------
  function matches(r, skipPlace) {
    var s = state;
    if (s.q) {
      var hay = norm([r.nome, r.cidade, r.uf, r.org, r.cargo, r.titulo, r.linha, r.setor, r.orientador].join(" "));
      if (hay.indexOf(norm(s.q)) < 0) return false;
    }
    if (s.setor && r.setor !== s.setor) return false;
    if (s.phd === "sim" && !r.phd) return false;
    if (s.phd === "nao" && r.phd) return false;
    if (s.linha && r.linha !== s.linha) return false;
    if (s.mentor && !r.mentor) return false;
    if (!skipPlace && s.place && placeKey(r) !== s.place) return false;
    return true;
  }

  // ---------- render ----------
  function renderFigures() {
    var places = {};
    DATA.forEach(function (r) { places[placeKey(r)] = 1; });
    $("n-total").textContent = DATA.length;
    $("n-area").textContent = DATA.filter(function (r) { return norm(r.setor) !== "outra area"; }).length;
    $("n-phd").textContent = DATA.filter(function (r) { return r.phd; }).length;
    $("n-cities").textContent = Object.keys(places).length;
  }

  function renderMap() {
    var svg = $("map"); svg.innerHTML = "";
    var poly = document.createElementNS(NS, "polygon");
    poly.setAttribute("class", "land");
    poly.setAttribute("points", OUTLINE.map(function (p) { return px(p[0]).toFixed(1) + "," + py(p[1]).toFixed(1); }).join(" "));
    svg.appendChild(poly);

    var groups = {};
    DATA.filter(function (r) { return matches(r, true); }).forEach(function (r) {
      var k = placeKey(r);
      if (!groups[k]) groups[k] = { label: placeLabel(r), n: 0, onMap: isRJ(r) && !!COORD[norm(r.cidade)], xy: COORD[norm(r.cidade)] };
      groups[k].n++;
    });

    Object.keys(groups).forEach(function (k) {
      var g = groups[k]; if (!g.onMap) return;
      var x = px(g.xy[1]), y = py(g.xy[0]), rad = 8 + Math.sqrt(g.n) * 4;
      var el = document.createElementNS(NS, "g");
      el.setAttribute("role", "button"); el.setAttribute("tabindex", "0");
      el.setAttribute("aria-label", g.label + ": " + g.n + (g.n === 1 ? " egresso" : " egressos"));
      el.setAttribute("aria-pressed", state.place === k ? "true" : "false");
      var c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", x); c.setAttribute("cy", y); c.setAttribute("r", rad);
      c.setAttribute("class", "dot" + (state.place === k ? " on" : ""));
      var n = document.createElementNS(NS, "text");
      n.setAttribute("x", x); n.setAttribute("y", y + 3.5); n.setAttribute("class", "cnt"); n.textContent = g.n;
      var tip = document.createElementNS(NS, "title"); tip.textContent = g.label + ": " + g.n;
      el.appendChild(tip); el.appendChild(c); el.appendChild(n);
      if (state.place === k) {
        var l = document.createElementNS(NS, "text"), right = x < 290;
        l.setAttribute("x", right ? x + rad + 4 : x - rad - 4); l.setAttribute("y", y - rad - 4);
        l.setAttribute("class", "lbl"); l.setAttribute("text-anchor", right ? "start" : "end"); l.textContent = g.label;
        el.appendChild(l);
      }
      var pick = function () { state.place = state.place === k ? "" : k; render(); };
      el.addEventListener("click", pick);
      el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
      svg.appendChild(el);
    });

    var out = $("chips-out"); out.innerHTML = "";
    var keys = Object.keys(groups).sort(function (a, b) { return groups[b].n - groups[a].n || groups[a].label.localeCompare(groups[b].label); });
    if (!keys.length) { out.innerHTML = '<span class="muted-small">Nenhum com os filtros atuais.</span>'; }
    keys.forEach(function (k) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip" + (state.place === k ? " on" : "");
      b.textContent = groups[k].label + " · " + groups[k].n;
      b.setAttribute("aria-pressed", state.place === k ? "true" : "false");
      b.addEventListener("click", function () { state.place = state.place === k ? "" : k; render(); });
      out.appendChild(b);
    });
  }

  function renderCards() {
    var list = DATA.filter(function (r) { return matches(r); }).sort(function (a, b) { return b.ano - a.ano || String(a.nome).localeCompare(String(b.nome)); });
    $("count").textContent = list.length + (list.length === 1 ? " egresso" : " egressos") + (list.length === DATA.length ? "" : " de " + DATA.length);
    $("clear").hidden = !(state.q || state.setor || state.phd || state.linha || state.mentor || state.place);
    var box = $("cards");
    if (!list.length) { box.innerHTML = '<div class="empty">Ninguém encontrado com esses filtros. Tente tirar um deles ou buscar outra palavra.</div>'; return; }
    box.innerHTML = list.map(function (r) {
      var phd = r.phd === "UERJ" ? "Doutorado na UERJ" : r.phd ? "Doutorado em outra instituição" : "";
      var li = safeUrl(r.linkedin), la = safeUrl(r.lattes);
      var role = [r.cargo, r.org].filter(Boolean).join(" · ");
      return '<article class="card">' +
        '<div class="top"><h3>' + esc(r.nome) + '</h3>' + (r.ano ? '<span class="yr">defesa ' + r.ano + '</span>' : '') + '</div>' +
        (role ? '<div class="role">' + esc(role) + '</div>' : '') +
        '<div class="where">' + esc(placeLabel(r)) + '</div>' +
        '<div class="tags">' + (r.setor ? '<span class="tag">' + esc(r.setor) + '</span>' : '') +
        (r.linha ? '<span class="tag">' + esc(r.linha) + '</span>' : '') +
        (phd ? '<span class="tag">' + phd + '</span>' : '') +
        (r.mentor ? '<span class="tag m">Aceita mentoria</span>' : '') + '</div>' +
        (r.titulo ? '<div class="thesis"><i>Dissertação:</i> ' + esc(r.titulo) + (r.orientador ? '<br><i>Orientação:</i> ' + esc(r.orientador) : '') + '</div>' : '') +
        ((li || la) ? '<div class="links">' + (li ? '<a href="' + esc(li) + '" target="_blank" rel="noopener noreferrer">LinkedIn</a>' : '') + (la ? '<a href="' + esc(la) + '" target="_blank" rel="noopener noreferrer">Lattes</a>' : '') + '</div>' : '') +
        '</article>';
    }).join("");
  }

  function bars(id, pairs) {
    var max = Math.max.apply(null, pairs.map(function (p) { return p[1]; }).concat([1]));
    $(id).innerHTML = pairs.length ? pairs.map(function (p) {
      return '<div class="bar"><span>' + esc(p[0]) + '</span><div class="track"><div class="fill" style="width:' + (p[1] / max * 100) + '%"></div></div><b>' + p[1] + '</b></div>';
    }).join("") : '<span class="muted-small">Sem dados com os filtros atuais.</span>';
  }
  function tally(rows, key) { var m = {}; rows.forEach(function (r) { var v = r[key] || "Não informado"; m[v] = (m[v] || 0) + 1; }); return m; }
  function sorted(m) { return Object.keys(m).map(function (k) { return [k, m[k]]; }).sort(function (a, b) { return b[1] - a[1]; }); }
  function renderPanel() {
    var rows = DATA.filter(function (r) { return matches(r); });
    bars("bars-setor", sorted(tally(rows, "setor")));
    bars("bars-linha", sorted(tally(rows, "linha")));
    var a = tally(rows.filter(function (r) { return r.ano; }), "ano");
    bars("bars-ano", Object.keys(a).sort().map(function (y) { return [y, a[y]]; }));
  }

  function renderOps() {
    var box = $("ops");
    if (!OPS.length) { box.innerHTML = '<div class="empty">Nenhuma oportunidade divulgada no momento.</div>'; }
    else {
      var list = OPS.slice().sort(function (a, b) { return String(b.data).localeCompare(String(a.data)); });
      box.innerHTML = list.map(function (o) {
        var u = safeUrl(o.link);
        return '<article class="card"><div class="top"><h3>' + esc(o.titulo) + '</h3>' + (o.data ? '<span class="yr">' + esc(o.data) + '</span>' : '') + '</div>' +
          '<div class="role">' + esc(o.org) + '</div>' +
          '<div class="tags">' + (o.tipo ? '<span class="tag m">' + esc(o.tipo) + '</span>' : '') + (o.local ? '<span class="tag">' + esc(o.local) + '</span>' : '') + '</div>' +
          (o.descricao ? '<div class="thesis">' + esc(o.descricao) + '</div>' : '') +
          (u ? '<div class="links"><a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">Saiba mais</a></div>' : '') + '</article>';
      }).join("");
    }
    var cta = $("ops-cta"), f = safeUrl(CFG.FORM_OPORTUNIDADE_URL);
    cta.innerHTML = f ? 'Tem uma oportunidade para divulgar? <a href="' + esc(f) + '" target="_blank" rel="noopener noreferrer">Envie por aqui</a>.' : "";
  }

  function render() { renderMap(); renderCards(); renderPanel(); renderFigures(); }

  function fillSelect(id, values) {
    var sel = $(id);
    Array.from(new Set(values.filter(Boolean))).sort().forEach(function (v) {
      var o = document.createElement("option"); o.value = v; o.textContent = v; sel.appendChild(o);
    });
  }

  function setupStatic() {
    var prog = CFG.PROGRAMA || "PPG-CTM";
    $("sobre-programa").textContent = CFG.PROGRAMA_LONGO || prog;
    if (usingExample) { $("aviso-exemplo").hidden = false; }

    var f = safeUrl(CFG.FORM_URL);
    if (f) { $("form-text").textContent = "O formulário abre em outra aba e leva cerca de 3 minutos."; var fb = $("form-btn"); fb.href = f; fb.hidden = false; }

    var c = safeUrl(CFG.CHAT_URL);
    if (c) { $("chat-text").textContent = "Entre no " + (CFG.CHAT_NOME || "grupo de egressos") + " para avisos, vagas e conversas do dia a dia."; var cb = $("chat-btn"); cb.href = c; cb.target = "_blank"; cb.rel = "noopener noreferrer"; cb.hidden = false; }

    var parts = [];
    var ig = safeUrl(CFG.INSTAGRAM_URL);
    if (ig) parts.push('<a href="' + esc(ig) + '" target="_blank" rel="noopener noreferrer">Instagram do programa</a>');
    if (CFG.CONTATO_EMAIL) parts.push('Contato: ' + esc(CFG.CONTATO_EMAIL));
    $("contatos").innerHTML = parts.join(" · ");

    var G = CFG.GISCUS || {};
    var slot = $("giscus-slot");
    if (G.repo && G.repoId && G.categoryId) {
      var s = document.createElement("script");
      s.src = "https://giscus.app/client.js";
      var at = { "data-repo": G.repo, "data-repo-id": G.repoId, "data-category": G.category || "Fórum", "data-category-id": G.categoryId,
        "data-mapping": "specific", "data-term": "Fórum geral", "data-strict": "0", "data-reactions-enabled": "1",
        "data-emit-metadata": "0", "data-input-position": "top", "data-theme": "preferred_color_scheme", "data-lang": "pt", "crossorigin": "anonymous" };
      Object.keys(at).forEach(function (k) { s.setAttribute(k, at[k]); });
      s.async = true; slot.appendChild(s);
    } else {
      slot.innerHTML = '<div class="empty">O fórum ainda não foi configurado.</div>';
    }
  }

  function bindFilters() {
    $("q").addEventListener("input", function (e) { state.q = e.target.value.trim(); render(); });
    $("f-setor").addEventListener("change", function (e) { state.setor = e.target.value; render(); });
    $("f-phd").addEventListener("change", function (e) { state.phd = e.target.value; render(); });
    $("f-linha").addEventListener("change", function (e) { state.linha = e.target.value; render(); });
    $("f-mentor").addEventListener("change", function (e) { state.mentor = e.target.checked; render(); });
    $("clear").addEventListener("click", function () {
      state = { q: "", setor: "", phd: "", linha: "", mentor: false, place: "" };
      $("q").value = ""; $("f-setor").value = ""; $("f-phd").value = ""; $("f-linha").value = ""; $("f-mentor").checked = false;
      render();
    });
  }

  loadAll().then(function () {
    fillSelect("f-setor", DATA.map(function (r) { return r.setor; }));
    fillSelect("f-linha", DATA.map(function (r) { return r.linha; }));
    bindFilters(); setupStatic(); renderOps(); render();
  });
})();

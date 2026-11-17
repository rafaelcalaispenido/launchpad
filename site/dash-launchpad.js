/* Dash Launchpad: o símbolo do Launchpad se monta, vai para o título e o dash abre.
   Dados em dash-launchpad-data.js (window.LP_TICKETS). */
(function(){
  var DATA = window.LP_TICKETS || [];
  var root = document.getElementById('dashLaunchpad');
  if (!root || !DATA.length) return;

  /* Símbolo do Launchpad, 9 x 13 quadrados (X laranja, W branco, K escuro) */
  var CAT = ['.X.......','.XX..X...','XXX.XXXX.','XXX.XXXXX','XXXXXXXXX','XXWXXXWXX','XWKWXWKWX','XXWXXXWXX','XXXXKXXXX','XXXXXXXXX','XXXXXXXXX','XXXXXXXX.','.XXXXXX..'];
  function catHTML(cls){
    var h = '<div class="' + cls + '" aria-hidden="true">';
    CAT.forEach(function(row){ for (var i = 0; i < row.length; i++){ var c = row[i]; h += '<span class="' + (c === '.' ? 'e' : 'c c' + c) + '"></span>'; } });
    return h + '</div>';
  }

  /* Rótulos em português */
  var LBL_MES = { '2026-09': 'Set/2026', '2026-10': 'Out/2026' };
  var LBL_IDIOMA = { Portuguese: 'Português', Spanish: 'Espanhol' };
  var LBL_CANAL = { Whatsapp: 'WhatsApp' };
  var LBL_SEG = { 'SEED': 'Seed', 'NO SEGMENTATION': 'Sem segmentação', 'PRE-ACTIVATED': 'Pré-ativado', 'SMALL': 'Small', 'STARTER': 'Starter', 'MEDIUM': 'Medium', 'FULL CHURN': 'Full churn', 'NOT FOUND': 'Não encontrado' };
  var FIELDS = [
    { key: 'mes', idx: 1, label: 'Período', all: 'Set e out/2026', map: LBL_MES },
    { key: 'motivo', idx: 2, label: 'Motivo de contato', all: 'Todos os motivos' },
    { key: 'canal', idx: 3, label: 'Canal', all: 'Todos os canais', map: LBL_CANAL },
    { key: 'idioma', idx: 4, label: 'Idioma', all: 'Todos os idiomas', map: LBL_IDIOMA },
    { key: 'seg', idx: 5, label: 'Segmento', all: 'Todos os segmentos', map: LBL_SEG }
  ];
  function lbl(f, v){ return (f.map && f.map[v]) || v; }
  var sel = {}; FIELDS.forEach(function(f){ sel[f.key] = []; });

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmtN(n){ return n.toLocaleString('pt-BR'); }
  function pct(a, b){ return b ? (a / b * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%' : '–'; }
  function fmtMin(m){
    if (m == null) return '–';
    if (m < 60) return Math.round(m) + ' min';
    if (m < 1440){ var h = Math.floor(m / 60), r = Math.round(m % 60); return h + 'h' + (r < 10 ? '0' : '') + r; }
    var dd = Math.round(m / 144) / 10;
    return dd.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + (dd < 2 ? ' dia' : ' dias');
  }
  function count(rows, idx){
    var c = {}; rows.forEach(function(r){ c[r[idx]] = (c[r[idx]] || 0) + 1; });
    return Object.keys(c).map(function(k){ return [k, c[k]]; }).sort(function(a, b){ return b[1] - a[1] || (a[0] < b[0] ? -1 : 1); });
  }
  function filtered(except){
    return DATA.filter(function(r){
      return FIELDS.every(function(f){ return f.key === except || !sel[f.key].length || sel[f.key].indexOf(r[f.idx]) >= 0; });
    });
  }

  /* Estrutura */
  root.innerHTML =
    '<div class="dash-stage" id="dashStage">' +
      catHTML('lp-cat ghost') +
      '<button class="btn cta" type="button" id="dashOpen"><i data-lucide="sparkles" class="icon"></i>Montar o Dash</button>' +
    '</div>' +
    '<div class="dash-body" id="dashBody" hidden>' +
      '<div class="dash-filters" id="dashFilters"></div>' +
      '<div class="dash-kpis" id="dashKpis"></div>' +
      '<p class="dash-summary" id="dashSummary"></p>' +
      '<div class="dash-charts" id="dashCharts"></div>' +
      '<details class="dash-table"><summary id="dashTableSum"></summary><div class="dash-scroll" id="dashTable"></div></details>' +
      '<p class="dash-source">Fonte: tickets de suporte da Hotmart de setembro e outubro de 2026 classificados como dúvida de explicação sobre o Launchpad, sem escalação para N2. Tempo de resolução em mediana.</p>' +
    '</div>';

  /* Filtros (seleção múltipla) */
  var fwrap = document.getElementById('dashFilters');
  var fh = '';
  FIELDS.forEach(function(f){
    fh += '<div class="ms" data-key="' + f.key + '"><span class="ms-cap" id="ms-cap-' + f.key + '">' + f.label + '</span>' +
      '<button type="button" class="ms-btn" aria-haspopup="true" aria-expanded="false" aria-labelledby="ms-cap-' + f.key + ' ms-val-' + f.key + '"><span class="ms-val" id="ms-val-' + f.key + '"></span><i data-lucide="chevron-down" class="icon"></i></button>' +
      '<div class="ms-panel" hidden></div></div>';
  });
  fh += '<button type="button" class="btn outline ms-clear" id="dashClear"><i data-lucide="rotate-ccw" class="icon"></i>Limpar</button>';
  fwrap.innerHTML = fh;

  function buildPanels(){
    FIELDS.forEach(function(f){
      var box = fwrap.querySelector('.ms[data-key="' + f.key + '"]');
      var opts = count(filtered(f.key), f.idx);
      sel[f.key].forEach(function(v){ if (!opts.some(function(o){ return o[0] === v; })) opts.push([v, 0]); });
      if (f.key === 'mes') opts.sort(function(a, b){ return a[0] < b[0] ? -1 : 1; });
      var p = '';
      opts.forEach(function(o){
        var on = sel[f.key].indexOf(o[0]) >= 0;
        p += '<label class="ms-opt"><input type="checkbox" value="' + esc(o[0]) + '"' + (on ? ' checked' : '') + '><span>' + esc(lbl(f, o[0])) + '</span><em>' + o[1] + '</em></label>';
      });
      box.querySelector('.ms-panel').innerHTML = p;
      var s = sel[f.key];
      box.querySelector('.ms-val').textContent = !s.length ? f.all : s.length === 1 ? lbl(f, s[0]) : s.length + ' selecionados';
      box.classList.toggle('on', s.length > 0);
    });
    var n = FIELDS.reduce(function(a, f){ return a + (sel[f.key].length ? 1 : 0); }, 0);
    document.getElementById('dashClear').hidden = !n;
  }
  function closeAll(except){
    fwrap.querySelectorAll('.ms').forEach(function(b){
      if (b === except) return;
      b.querySelector('.ms-panel').hidden = true; b.querySelector('.ms-btn').setAttribute('aria-expanded', 'false');
    });
  }
  fwrap.addEventListener('click', function(e){
    var btn = e.target.closest('.ms-btn');
    if (btn){
      var box = btn.parentNode, panel = box.querySelector('.ms-panel'), open = panel.hidden;
      closeAll(box); panel.hidden = !open; btn.setAttribute('aria-expanded', String(open));
      return;
    }
    if (e.target.closest('#dashClear')){ FIELDS.forEach(function(f){ sel[f.key] = []; }); update(); }
  });
  fwrap.addEventListener('change', function(e){
    var box = e.target.closest('.ms'); if (!box) return;
    var k = box.getAttribute('data-key'), v = e.target.value, i = sel[k].indexOf(v);
    if (e.target.checked && i < 0) sel[k].push(v); else if (!e.target.checked && i >= 0) sel[k].splice(i, 1);
    update(true);
  });
  document.addEventListener('click', function(e){ if (!e.target.closest('#dashFilters .ms')) closeAll(); });
  document.addEventListener('keydown', function(e){
    if (e.key !== 'Escape') return;
    var open = fwrap.querySelector('.ms-panel:not([hidden])');
    if (open){ closeAll(); open.parentNode.querySelector('.ms-btn').focus(); }
  });

  /* Gráficos de barras: clicar numa barra filtra por ela */
  function bars(title, icon, f, rows, top){
    var list = count(rows, f.idx), total = rows.length;
    if (f.key === 'mes') list.sort(function(a, b){ return a[0] < b[0] ? -1 : 1; });
    if (top && list.length > top){
      var rest = list.slice(top).reduce(function(a, o){ return a + o[1]; }, 0);
      list = list.slice(0, top).concat([['__outros', rest, list.length - top]]);
    }
    var max = list.reduce(function(a, o){ return Math.max(a, o[1]); }, 0) || 1;
    var h = '<div class="dash-card"><h3><i data-lucide="' + icon + '" class="icon"></i>' + title + '</h3><ul class="bars">';
    list.forEach(function(o){
      var other = o[0] === '__outros', on = sel[f.key].indexOf(o[0]) >= 0;
      var name = other ? 'Outros (' + o[2] + ' motivos)' : lbl(f, o[0]);
      var inner = '<span class="b-name">' + esc(name) + '</span><span class="b-track"><span class="b-fill" style="width:' + (o[1] / max * 100).toFixed(1) + '%"></span></span><span class="b-val">' + o[1] + ' <small>' + pct(o[1], total) + '</small></span>';
      h += other ? '<li class="bar-row other">' + inner + '</li>'
        : '<li><button type="button" class="bar-row' + (on ? ' on' : '') + '" data-key="' + f.key + '" data-v="' + esc(o[0]) + '" aria-pressed="' + on + '" title="Filtrar por ' + esc(name) + '">' + inner + '</button></li>';
    });
    return h + '</ul></div>';
  }
  document.getElementById('dashCharts').addEventListener('click', function(e){
    var b = e.target.closest('button.bar-row'); if (!b) return;
    var k = b.getAttribute('data-key'), v = b.getAttribute('data-v'), i = sel[k].indexOf(v);
    if (i >= 0) sel[k].splice(i, 1); else sel[k].push(v);
    update();
  });

  function kpi(icon, label, value, sub){
    return '<div class="dash-kpi"><span class="k-label"><i data-lucide="' + icon + '" class="icon"></i>' + label + '</span><span class="k-value">' + value + '</span><span class="k-sub">' + sub + '</span></div>';
  }

  function update(keepPanel){
    var openKey = null;
    if (keepPanel){ var op = fwrap.querySelector('.ms-panel:not([hidden])'); if (op) openKey = op.parentNode.getAttribute('data-key'); }
    buildPanels();
    if (openKey){ var bx = fwrap.querySelector('.ms[data-key="' + openKey + '"]'); bx.querySelector('.ms-panel').hidden = false; bx.querySelector('.ms-btn').setAttribute('aria-expanded', 'true'); }

    var rows = filtered(), n = rows.length;
    var kEl = document.getElementById('dashKpis'), sEl = document.getElementById('dashSummary'), cEl = document.getElementById('dashCharts');
    if (!n){
      kEl.innerHTML = ''; sEl.textContent = 'Nenhum ticket com esses filtros. Use "Limpar" para ver todos.'; cEl.innerHTML = '';
      document.getElementById('dashTableSum').textContent = 'Nenhum ticket'; document.getElementById('dashTable').innerHTML = '';
      return;
    }
    var months = {}; rows.forEach(function(r){ months[r[1]] = 1; }); var nm = Object.keys(months).length || 1;
    var cs = rows.map(function(r){ return r[6]; }).filter(function(v){ return v != null; });
    var csAvg = cs.length ? cs.reduce(function(a, b){ return a + b; }, 0) / cs.length : null;
    var cs45 = cs.filter(function(v){ return v >= 4; }).length;
    var fcr = rows.filter(function(r){ return r[7] === 1; }).length;
    var n3 = rows.filter(function(r){ return r[9] === 1; }).length;
    var t = rows.map(function(r){ return r[8]; }).filter(function(v){ return v != null; }).sort(function(a, b){ return a - b; });
    var med = t.length ? (t.length % 2 ? t[(t.length - 1) / 2] : (t[t.length / 2 - 1] + t[t.length / 2]) / 2) : null;

    kEl.innerHTML =
      kpi('ticket', 'Tickets', fmtN(n), fmtN(Math.round(n / nm)) + ' por mês em média') +
      kpi('star', 'CSAT médio', csAvg == null ? '–' : csAvg.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), cs.length ? pct(cs45, cs.length) + ' de notas 4 e 5 · ' + cs.length + (cs.length === 1 ? ' avaliação' : ' avaliações') : 'sem avaliações') +
      kpi('circle-check', 'Resolvido no 1º contato', pct(fcr, n), fmtN(fcr) + ' de ' + fmtN(n) + ' em até 2 dias (FCR)') +
      kpi('arrow-up-right', 'Escalados para N3', pct(n3, n), fmtN(n3) + ' de ' + fmtN(n) + ' tickets') +
      kpi('clock', 'Tempo de resolução', fmtMin(med), 'mediana por ticket');

    var mot = count(rows, 2), topM = mot[0];
    sEl.innerHTML = '<strong>' + fmtN(n) + '</strong> ' + (n === 1 ? 'ticket' : 'tickets') + ' em ' + mot.length + (mot.length === 1 ? ' motivo' : ' motivos') +
      (mot.length > 1 ? '. <strong>' + esc(topM[0]) + '</strong> concentra ' + pct(topM[1], n) + '.' : '.');

    cEl.innerHTML =
      '<div class="dash-wide">' + bars('Volume por motivo', 'bar-chart-3', FIELDS[1], rows, 8) + '</div>' +
      bars('Tickets por mês', 'calendar', FIELDS[0], rows) +
      bars('Canal', 'message-square', FIELDS[2], rows) +
      bars('Segmento do usuário', 'users', FIELDS[4], rows) +
      bars('Idioma', 'languages', FIELDS[3], rows);

    document.getElementById('dashTableSum').innerHTML = '<i data-lucide="table" class="icon"></i>Ver ' + (n === 1 ? 'o ticket' : 'os ' + fmtN(n) + ' tickets');
    var th = '<table><thead><tr><th>Ticket</th><th>Mês</th><th>Motivo</th><th>Canal</th><th>Idioma</th><th>Segmento</th><th class="n">CSAT</th><th class="n">FCR</th><th class="n">Resolução</th><th class="n">N3</th></tr></thead><tbody>';
    rows.slice().sort(function(a, b){ return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0; }).forEach(function(r){
      th += '<tr><td><button type="button" class="tk-link" data-tk="' + esc(r[0]) + '" aria-label="Abrir o ticket ' + esc(r[0]) + '">#' + esc(r[0]) + '</button></td><td>' + lbl(FIELDS[0], r[1]) + '</td><td>' + esc(r[2]) + '</td><td>' + esc(lbl(FIELDS[2], r[3])) + '</td><td>' + lbl(FIELDS[3], r[4]) + '</td><td>' + esc(lbl(FIELDS[4], r[5])) + '</td>' +
        '<td class="n">' + (r[6] == null ? '–' : r[6]) + '</td><td class="n">' + (r[7] ? 'Sim' : 'Não') + '</td><td class="n">' + fmtMin(r[8]) + '</td><td class="n">' + (r[9] ? 'Sim' : 'Não') + '</td></tr>';
    });
    document.getElementById('dashTable').innerHTML = th + '</tbody></table>';
    if (window.lucide) lucide.createIcons();
  }

  /* Abertura: os quadrados surgem, o gatinho pisca, encolhe para o título e o dash abre */
  var stage = document.getElementById('dashStage'), body = document.getElementById('dashBody'), slot = document.getElementById('lpSlot');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function showDash(){
    if (slot) slot.innerHTML = catHTML('lp-cat mini');
    stage.hidden = true; body.hidden = false; update();
    var sb = document.getElementById('studyBar'); if (sb) sb.hidden = false;
    requestAnimationFrame(function(){ body.classList.add('in'); });
  }
  function open(){
    var btn = document.getElementById('dashOpen'); btn.disabled = true;
    if (reduce){ showDash(); document.getElementById('dashFilters').querySelector('.ms-btn').focus(); return; }
    var cat = stage.querySelector('.lp-cat'), cells = Array.prototype.slice.call(cat.querySelectorAll('.c'));
    btn.classList.add('fade');
    /* As peças vêm de longe, de frente para a tela, e montam o corpo primeiro; olhos e boca chegam por último */
    function shuffle(a){ for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    var bodyCells = shuffle(cells.filter(function(c){ return c.classList.contains('cX'); }));
    var faceCells = shuffle(cells.filter(function(c){ return !c.classList.contains('cX'); }));
    var order = bodyCells.concat(faceCells), FLY = 950, SPREAD = 3000;
    cat.classList.remove('ghost');
    if (!cat.animate){ cat.classList.add('build'); requestAnimationFrame(function(){ requestAnimationFrame(function(){ cat.classList.add('built'); }); }); }
    else order.forEach(function(c, i){
      var dx = Math.round((Math.random() - .5) * 900), dy = Math.round((Math.random() - .5) * 600), rot = Math.round((Math.random() - .5) * 240);
      c.animate([
        { transform: 'translate3d(' + dx + 'px,' + dy + 'px,-2200px) rotate(' + rot + 'deg)', opacity: 0 },
        { opacity: 1, offset: .25 },
        { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 }
      ], { duration: FLY, delay: Math.round(i / (order.length - 1) * SPREAD), easing: 'cubic-bezier(.16,.84,.3,1)', fill: 'backwards' });
    });
    var done = SPREAD + FLY;
    setTimeout(function(){
      cat.classList.add('blink'); setTimeout(function(){ cat.classList.remove('blink'); }, 160);
      setTimeout(function(){ cat.classList.add('blink'); setTimeout(function(){ cat.classList.remove('blink'); }, 140); }, 320);
    }, done + 150);
    setTimeout(function(){
      var a = cat.getBoundingClientRect(), b = slot.getBoundingClientRect();
      var visible = b.bottom > 0 && b.top < innerHeight;
      if (!visible){ showDash(); return; }
      var s = b.width / a.width;
      cat.style.transformOrigin = '0 0';
      cat.style.transform = 'translate(' + (b.left - a.left) + 'px,' + (b.top - a.top) + 'px) scale(' + s + ')';
      cat.classList.add('fly');
      setTimeout(showDash, 620);
    }, done + 900);
  }
  document.getElementById('dashOpen').addEventListener('click', open);

  /* Pop-up do ticket: a conversa no formato do Zendesk, a partir da extração de comentários (anonimizada) */
  var BY_ID = {}; DATA.forEach(function(r){ BY_ID[r[0]] = r; });
  var modal = document.createElement('div');
  modal.className = 'tk-modal'; modal.hidden = true;
  modal.innerHTML = '<div class="tk-backdrop" data-close></div><div class="tk-dialog" role="dialog" aria-modal="true" aria-labelledby="tkTitle"><header class="tk-head"><div><p class="tk-sub" id="tkSub"></p><h3 id="tkTitle"></h3></div><button type="button" class="tk-close" data-close aria-label="Fechar"><i data-lucide="x" class="icon"></i></button></header><div class="tk-body"><div class="tk-conv" id="tkConv" tabindex="0" aria-label="Conversa do ticket"></div><aside class="tk-props" id="tkProps"></aside></div></div>';
  document.body.appendChild(modal);
  var lastFocus = null, convLoading = null;
  function loadConv(){
    if (window.LP_CONV) return Promise.resolve();
    if (convLoading) return convLoading;
    convLoading = new Promise(function(ok, fail){ var s = document.createElement('script'); s.src = 'dash-launchpad-tickets.js'; s.onload = ok; s.onerror = fail; document.head.appendChild(s); });
    return convLoading;
  }
  var WHO = { c: 'Cliente', a: 'Agente', s: 'Sistema', b: 'CAIO (bot)' };
  function clean(t){
    return esc(t.replace(/\r/g, '').replace(/^#{1,6}\s*/gm, '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*\*/g, '').replace(/(^|\s)_([^_\n]+)_(?=\s|$)/g, '$1$2').replace(/\n{3,}/g, '\n\n').trim())
      .replace(/\[(cliente|agente|nome|e-mail|telefone|documento|link|id|@perfil|projeto|transação)\]/g, '<span class="tk-red">[$1]</span>');
  }
  function renderTicket(id){
    var r = BY_ID[id], conv = (window.LP_CONV || {})[id] || [];
    document.getElementById('tkTitle').textContent = r[2];
    document.getElementById('tkSub').textContent = 'Ticket #' + id + ' · ' + lbl(FIELDS[0], r[1]);
    var props = [['Status', 'Fechado'], ['Canal', lbl(FIELDS[2], r[3])], ['Idioma', lbl(FIELDS[3], r[4])], ['Segmento', lbl(FIELDS[4], r[5])], ['CSAT', r[6] == null ? 'Sem avaliação' : r[6]], ['FCR (2 dias)', r[7] ? 'Sim' : 'Não'], ['Escalado para N3', r[9] ? 'Sim' : 'Não'], ['Tempo de resolução', fmtMin(r[8])]];
    document.getElementById('tkProps').innerHTML = props.map(function(p){ return '<div><span>' + p[0] + '</span><b>' + esc(p[1]) + '</b></div>'; }).join('') + '<p class="tk-note">Nomes, e-mails, telefones, links e códigos foram trocados automaticamente por marcadores.</p>';
    var h = '';
    if (!conv.length) h = '<p class="tk-empty">Conversa não disponível para este ticket.</p>';
    conv.forEach(function(cm){
      var who = cm[1], internal = cm[2] === 1, parts = cm[3];
      var chat = parts.length > 1 || parts.some(function(p){ return p[1]; });
      h += '<article class="tk-msg ' + (internal ? 'internal' : 'r-' + who) + '"><span class="tk-av r-' + who + '" aria-hidden="true">' + (who === 'c' ? 'C' : who === 'a' ? 'A' : 'S') + '</span><div class="tk-main">' +
        '<div class="tk-meta"><b>' + WHO[who] + '</b>' + (internal ? '<span class="tk-tag">Nota interna</span>' : '') + '<time>' + esc(cm[0]) + '</time></div>';
      if (!chat) h += '<div class="tk-text">' + clean(parts[0][2]) + '</div>';
      else {
        h += '<div class="tk-chat">';
        parts.forEach(function(p){
          if (!p[1] && p[0] === who) { h += '<div class="tk-text">' + clean(p[2]) + '</div>'; return; }
          h += '<div class="tk-bubble b-' + p[0] + '"><span class="tk-bwho">' + WHO[p[0]] + (p[1] ? ' · ' + esc(p[1]) : '') + '</span>' + clean(p[2]) + '</div>';
        });
        h += '</div>';
      }
      h += '</div></article>';
    });
    document.getElementById('tkConv').innerHTML = h;
    document.getElementById('tkConv').scrollTop = 0;
  }
  function openTicket(id, from){
    if (!BY_ID[id]) return;
    lastFocus = from || document.activeElement;
    modal.hidden = false; document.body.classList.add('tk-open');
    document.getElementById('tkTitle').textContent = 'Carregando o ticket…';
    document.getElementById('tkConv').innerHTML = ''; document.getElementById('tkProps').innerHTML = '';
    if (window.lucide) lucide.createIcons();
    modal.querySelector('.tk-close').focus();
    loadConv().then(function(){ renderTicket(id); }, function(){ document.getElementById('tkConv').innerHTML = '<p class="tk-empty">Não foi possível carregar as conversas.</p>'; });
  }
  function closeTicket(){
    if (modal.hidden) return;
    modal.hidden = true; document.body.classList.remove('tk-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  modal.addEventListener('click', function(e){ if (e.target.closest('[data-close]')) closeTicket(); });
  document.addEventListener('keydown', function(e){
    if (modal.hidden) return;
    if (e.key === 'Escape'){ e.stopPropagation(); closeTicket(); }
    if (e.key === 'Tab'){
      var f = modal.querySelectorAll('button,[href],[tabindex]:not([tabindex="-1"])'), a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a){ e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z){ e.preventDefault(); a.focus(); }
    }
  }, true);
  document.addEventListener('click', function(e){ var b = e.target.closest('.tk-link'); if (b){ e.preventDefault(); openTicket(b.getAttribute('data-tk'), b); } });
  window.__openTicket = openTicket;

  /* Estudo qualitativo: abre e fecha abaixo do dash; o menu lateral leva a cada parte */
  var study = document.getElementById('estudo'), tgl = document.getElementById('studyToggle');
  if (study && tgl){
    tgl.addEventListener('click', function(){
      var open = study.hidden;
      study.hidden = !open; tgl.setAttribute('aria-expanded', String(open));
      tgl.querySelector('span').textContent = open ? 'Fechar estudo qualitativo' : 'Ver estudo qualitativo';
      if (open) study.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
    var links = Array.prototype.slice.call(study.querySelectorAll('.eq-toc a'));
    links.forEach(function(a){
      a.addEventListener('click', function(e){
        var t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
        e.preventDefault(); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        if (t.tabIndex < 0) t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true });
      });
    });
    study.querySelectorAll('.eq-map a').forEach(function(a){
      a.addEventListener('click', function(e){ var t = document.getElementById(a.getAttribute('href').slice(1)); if (t){ e.preventDefault(); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); } });
    });
    /* Destaca no menu a parte que está na tela */
    if ('IntersectionObserver' in window){
      var targets = links.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
      var io = new IntersectionObserver(function(en){
        en.forEach(function(x){ if (x.isIntersecting){ links.forEach(function(a){ a.classList.toggle('on', a.getAttribute('href') === '#' + x.target.id); }); } });
      }, { rootMargin: '-90px 0px -70% 0px' });
      targets.forEach(function(t){ io.observe(t); });
    }
  }
  if (window.lucide) lucide.createIcons();
  window.__dash = { open: open, sel: sel, update: update };
})();

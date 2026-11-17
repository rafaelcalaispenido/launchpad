/* Vídeo da trajetória (pixel art, seis fases, com música).
   Arquivo único: cria o próprio HTML e CSS. Não depende de biblioteca.
   Uso: var v = TrajetoriaVideo.mount(elemento, { assets: 'assets/', onFinish: function(){ ... } });
        v.stop() para o som e a animação; v.reset() volta à tela "Start".
   Imagens esperadas na pasta de assets: logo-enotas.png, hotmart-logo-color-positive.png, launchpad-assinatura.mp4 */
(function(){
'use strict';
var CSS = ".tv .stage{position:relative;aspect-ratio:16/9;container-type:inline-size;border-radius:12px;overflow:hidden;border:1px solid #3A3936;background:#000;user-select:none}\n.tv .stage canvas{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges;display:block}\n.tv .stage [data-show]{display:none}\n.tv .stage [data-show].on{display:block}\n.tv .hud{position:absolute;z-index:5;left:0;right:0;top:0;display:flex;justify-content:space-between;gap:2cqw;padding:1.6cqw 2.2cqw;font-size:1.9cqw;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#F5F3EF;background:#0D0D0D;white-space:nowrap}\n.tv .hud b{color:#FF7A52;font-weight:700}\n.tv .caption{position:absolute;z-index:5;left:4cqw;right:4cqw;bottom:2cqw;background:#0D0D0D;border:.5cqw solid #F5F3EF;box-shadow:0 0 0 .5cqw #0D0D0D;padding:1cqw 2.2cqw;font-size:2.3cqw;line-height:1.3;min-height:7.6cqw;display:flex;align-items:center;gap:2cqw}\n.tv .caption:empty{display:none}\n.tv .caption::after{content:\"\";width:1.2cqw;height:1.2cqw;background:#FF4000;margin-left:auto;flex:none;animation:blink 1s steps(2) infinite}\n@keyframes blink{50%{opacity:0}}\n.tv .popup{position:absolute;z-index:5;left:50%;top:15%;transform:translateX(-50%);background:#FF4000;color:#0D0D0D;border:.5cqw solid #0D0D0D;box-shadow:0 0 0 .5cqw #F5F3EF;padding:1.2cqw 2.6cqw;text-align:center;font-weight:700;font-size:2.4cqw;line-height:1.25;white-space:nowrap}\n.tv .popup small{display:block;font-size:1.6cqw;letter-spacing:.06em;text-transform:uppercase}\n.tv .popup.on{animation:pop .2s steps(3)}\n@keyframes pop{from{transform:translateX(-50%) scale(.6)}}\n.tv .label{position:absolute;z-index:2;transform:translate(-50%,-100%);background:#0D0D0D;color:#F5F3EF;font-size:1.7cqw;font-weight:700;padding:.3cqw 1cqw;white-space:nowrap}\n/* Logos oficiais: sempre nítidos, nunca pixelados nem recoloridos */\n.tv .plate{position:absolute;z-index:2;background:#FFFFFF;display:flex;align-items:center;justify-content:center}\n.tv .plate img{width:76%;height:auto;display:block}\n.tv .stage [data-show].plate.on{display:flex}\n.tv #wallEnotas{left:5%;top:15%;width:23cqw;height:9cqw;border:.4cqw solid #0D0D0D}\n.tv #wallHot{left:5%;top:15%;width:23cqw;height:9cqw;background:#F5F3EF}\n.tv #fE,.tv #fH{top:50%;width:27cqw;height:11cqw;margin-top:-5.5cqw}\n.tv #fE{border-radius:1.4cqw 0 0 1.4cqw}.tv #fH{border-radius:0 1.4cqw 1.4cqw 0}\n.tv #fE.apart,.tv #fH.apart{border-radius:1.4cqw}\n.tv .sign{position:absolute;z-index:2;left:36%;top:15%;background:#0D0D0D;color:#F5F3EF;font-size:1.9cqw;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:.8cqw 1.6cqw;white-space:nowrap}\n.tv .sign b{color:#FF7A52}\n.tv .bubble{position:absolute;z-index:2;left:4%;top:14%;width:33cqw;background:#FFFFFF;color:#0D0D0D;border:.4cqw solid #0D0D0D;padding:1cqw 1.4cqw;font-size:1.9cqw;font-weight:700;line-height:1.3;min-height:7cqw}\n.tv .bubble::after{content:\"\";position:absolute;left:8cqw;bottom:-1.6cqw;width:1.6cqw;height:1.6cqw;background:#FFFFFF;border:solid #0D0D0D;border-width:0 .4cqw .4cqw 0}\n/* Painel de VOC (versão ilustrativa, com dados de exemplo) */\n.tv .dash{position:absolute;z-index:3;inset:0;background:#F5F3EF;color:#0D0D0D;padding:7.4cqw 4cqw 0;transform-origin:61% 43%}\n.tv .dash-top{display:flex;align-items:center;gap:1.4cqw;margin-bottom:1.4cqw}\n.tv .dash-top strong{font-family:\"Hotmart Display\",\"Times New Roman\",serif;font-weight:400;font-size:3cqw;letter-spacing:-.02em;line-height:1}\n.tv .dash-top span{font-size:1.3cqw;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border:.15cqw solid #C3BFB8;border-radius:99cqw;padding:.2cqw 1cqw;color:#52514E}\n.tv .dash-top i{margin-left:auto;font-style:normal;font-size:1.4cqw;font-weight:700;border-bottom:.3cqw solid #0D0D0D;padding-bottom:.3cqw}\n.tv .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2cqw}\n.tv .k{background:#FFFFFF;border:.15cqw solid #DCDAD6;border-radius:1.2cqw;padding:1.2cqw 1.4cqw}\n.tv .k.inv{background:#0D0D0D;color:#F5F3EF;border-color:#0D0D0D}\n.tv .k small{display:block;font-size:1.15cqw;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#52514E}\n.tv .k.inv small{color:#B2AFA8}\n.tv .k b{display:block;font-family:\"Hotmart Display\",\"Times New Roman\",serif;font-weight:400;font-size:3.6cqw;line-height:1.1;letter-spacing:-.02em}\n.tv .panels{display:grid;grid-template-columns:1.5fr 1fr;gap:1.2cqw;margin-top:1.2cqw}\n.tv .pn{background:#FFFFFF;border:.15cqw solid #DCDAD6;border-radius:1.2cqw;padding:1.2cqw 1.4cqw;height:17cqw}\n.tv .pn h4{margin:0 0 1cqw;font-size:1.5cqw;font-weight:700}\n.tv .bars{display:flex;align-items:flex-end;gap:1.6cqw;height:11.5cqw}\n.tv .bars div{flex:1;display:flex;flex-direction:column;justify-content:flex-end;gap:.2cqw;height:100%}\n.tv .bars u{display:block;border-radius:.3cqw}\n.tv .rowp{font-size:1.3cqw;margin-bottom:1.1cqw}\n.tv .rowp span{display:flex;justify-content:space-between;margin-bottom:.3cqw}\n.tv .rowp em{display:block;height:.7cqw;border-radius:99cqw;background:#EAE9E7;overflow:hidden}\n.tv .rowp em s{display:block;height:100%;background:#0D0D0D}\n.tv .rowp:first-of-type em s{background:#FF4000}\n.tv .overlay{position:absolute;z-index:9;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.4cqw;background:#0D0D0D;text-align:center;padding:4cqw}\n.tv .overlay[hidden]{display:none}\n.tv .overlay .big{font-family:\"Hotmart Display\",\"Times New Roman\",serif;font-size:6cqw;line-height:1.05;letter-spacing:-.02em}\n.tv .overlay p{margin:0;color:#B2AFA8;font-size:2.2cqw;max-width:60cqw}\n.tv .overlay .row{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}\n.tv #end{flex-direction:row;gap:5cqw;text-align:left}\n.tv #end video{height:42cqw;aspect-ratio:9/16;border-radius:1.6cqw;border:1px solid #3A3936;object-fit:cover;flex:none}\n.tv #end .txt{display:flex;flex-direction:column;gap:2.4cqw;align-items:flex-start;max-width:52cqw}\n.tv #end .row{justify-content:flex-start}\n.tv .btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 24px;border-radius:6px;border:1px solid transparent;background:#FF4000;color:#FFFFFF;font:700 16px \"Hotmart Sans\",Arial,sans-serif;cursor:pointer;text-decoration:none}\n.tv .btn:hover{background:#E73B01}\n.tv .btn.outline{background:transparent;border-color:#52514E;color:#F5F3EF}\n.tv .btn.outline:hover{background:transparent;border-color:#F5F3EF}\n.tv .sound{position:absolute;z-index:6;right:1.6cqw;top:6cqw;width:44px;height:44px;border-radius:50%;border:1px solid #52514E;background:#0D0D0D;color:#F5F3EF;font:700 12px \"Hotmart Sans\",Arial,sans-serif;cursor:pointer}";
var HTML = "\n    <canvas id=\"cv\" width=\"320\" height=\"180\" aria-label=\"Animação em pixel art da trajetória de Rafael\"></canvas>\n\n    <div class=\"plate\" id=\"wallEnotas\" data-show><img src=\"assets/logo-enotas.png\" alt=\"eNotas\"></div>\n    <div class=\"plate\" id=\"wallHot\" data-show><img src=\"assets/hotmart-logo-color-positive.png\" alt=\"Hotmart\"></div>\n    <div class=\"sign\" id=\"vocSign\" data-show><b>VOC</b> · Voice of Customer</div>\n    <div class=\"plate apart\" id=\"fE\" data-show><img src=\"assets/logo-enotas.png\" alt=\"eNotas\"></div>\n    <div class=\"plate apart\" id=\"fH\" data-show><img src=\"assets/hotmart-logo-color-positive.png\" alt=\"Hotmart\"></div>\n    <div class=\"bubble\" id=\"bubble\" data-show></div>\n    <div class=\"label\" id=\"lbFaro\" data-show>Faro</div>\n    <div class=\"label\" id=\"lbBH\" data-show>Belo Horizonte</div>\n\n    <div class=\"dash\" id=\"dash\" data-show>\n      <div class=\"dash-top\"><strong>Ferramenta VOC</strong><span>Dados de exemplo</span><i>Visão geral</i></div>\n      <div class=\"kpis\">\n        <div class=\"k inv\"><small>Iniciativas em andamento</small><b>24</b></div>\n        <div class=\"k\"><small>Motivos mapeados</small><b>128</b></div>\n        <div class=\"k\"><small>CSAT médio</small><b>4,2</b></div>\n        <div class=\"k\"><small>Squads acompanhados</small><b>12</b></div>\n      </div>\n      <div class=\"panels\">\n        <div class=\"pn\"><h4>Volume por motivo</h4><div class=\"bars\" id=\"bars\"></div></div>\n        <div class=\"pn\"><h4>Iniciativas por frente</h4>\n          <div class=\"rowp\"><span>Produto<b>62%</b></span><em><s style=\"width:62%\"></s></em></div>\n          <div class=\"rowp\"><span>Processos<b>24%</b></span><em><s style=\"width:24%\"></s></em></div>\n          <div class=\"rowp\"><span>Conteúdos<b>14%</b></span><em><s style=\"width:14%\"></s></em></div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"hud\"><span id=\"hudL\"></span><span id=\"hudR\"></span></div>\n    <div class=\"popup\" id=\"popup\" data-show><small></small><span></span></div>\n    <div class=\"caption\" id=\"caption\" aria-live=\"polite\"></div>\n    <button class=\"sound\" id=\"sound\" type=\"button\" aria-label=\"Desligar o som\" data-show>SOM</button>\n\n    <div class=\"overlay\" id=\"start\">\n      <div class=\"big\">A trajetória de Rafael</div>\n      \n      <button class=\"btn\" id=\"play\" type=\"button\">Start</button>\n    </div>\n    <div class=\"overlay\" id=\"end\" hidden>\n      <video src=\"assets/launchpad-assinatura.mp4\" muted loop playsinline aria-label=\"Assinatura animada do Launchpad\"></video>\n      <div class=\"txt\">\n        <div class=\"big\">Próxima fase: Launchpad Partner 2027.</div>\n        <p>Continuar?</p>\n        <div class=\"row\"><button class=\"btn\" id=\"finish\" type=\"button\">Ver o projeto 2027</button></div>\n      </div>\n    </div>";
function mount(root, opts){
opts = opts || {};
if (!document.getElementById('tv-style')){ var st = document.createElement('style'); st.id = 'tv-style'; st.textContent = CSS; document.head.appendChild(st); }
root.classList.add('tv');
root.innerHTML = '<div class="stage" id="stage">' + HTML.replace(/assets\//g, opts.assets || 'assets/') + '</div>';

var cv = root.querySelector('#cv'), ctx = cv.getContext('2d');
var $ = function(id){ return root.querySelector('#' + id); };
var hudL = $('hudL'), hudR = $('hudR'), caption = $('caption'), popup = $('popup');
function show(id, on){ $(id).classList.toggle('on', !!on); }

/* ---------- Desenho ---------- */
function px(x, y, w, h, c){ ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }
function circle(cx, cy, r, c){ for (var dy = -r; dy <= r; dy++){ var w = Math.floor(Math.sqrt(r*r - dy*dy)); px(cx - w, cy + dy, 2*w, 1, c); } }
function sprite(rows, pal, x, y, s){
  for (var r = 0; r < rows.length; r++) for (var c = 0; c < rows[r].length; c++){
    var ch = rows[r][c]; if (ch !== '.') px(x + c*s, y + r*s, s, s, pal[ch]);
  }
}
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function ease(x){ x = clamp(x, 0, 1); return x*x*(3 - 2*x); }
function rnd(i){ var x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); }
function sparkle(x, y, c){ px(x, y - 2, 1, 5, c); px(x - 2, y, 5, 1, c); }

/* ---------- Personagem (opção C: sem contorno) ---------- */
var SKIN = '#E8B48C';
var PAL = { H:'#2B1D14', h:'#4A3324', S:SKIN, s:'#C98F68', B:'#3A2A1F', G:'#111111', L:'#DFF3FF', W:'#FFFFFF', K:'#5A1A10', T:'#2F6F73', t:'#245659', O:'#FF4000', o:'#C93200' };
var PAL_LP = Object.assign({}, PAL, { T:'#111111', t:'#000000', M:'#FF4000', O:'#2E3A55', o:'#232D44' });   // camiseta preta do Launchpad
var HEAD = ['....HHHHHH....','...HHHHHHHH...','..HHhhHHHHHH..','..HHHHHHHHHH..','..HHSSSSSSHH..','..HSSSSSSSSH..','..SGGGSSGGGS..','..SGLGGGGLGS..','..SGGGSSGGGS..','..BSSSssSSSB..','..BBSWWWWSBB..','..BBBBBBBBBB..','...BBBBBBBB...','.....ssss.....'];
var HEAD_OH = HEAD.slice(0, 10).concat(['..BBSKKKKSBB..','..BBBKKKKBBB..','...BBBBBBBB...','.....ssss.....']);
var STAND = ['..TTTTTTTTTT..','.TTTTTTTTTTTT.','.TTTTTTTTTTTT.','.SSTTTTTTTTSS.','.SSTTTTTTTTSS.','.SStTTTTTTtSS.','.ss.OOOOOO.ss.','...OOOOOOOO...','...OOOooOOO...','...OOO..OOO...','...SSS..SSS...','...SSS..SSS...','...SSs..SSs...','..SSSS..SSSS..'];
var LP_LOGO = ['.X.......','.XX..X...','XXX.XXXX.','XXX.XXXXX','XXXXXXXXX','XXWXXXWXX','XWKWXWKWX','XXWXXXWXX','XXXXKXXXX','XXXXXXXXX','XXXXXXXX.','.XXXXXX..'];   // símbolo do Launchpad, 1 pixel por quadrado
var PAL_LOGO = { X:'#FF4000', W:'#FFFFFF', K:'#1A1A1A' };
var STAND_LP = ['..TTTTTTTTTT..','.TTTTTTTTTTTT.','.TTTTTTTTTTTT.','.SSTTTTTTTTSS.','.SSTTTTTTTTSS.','.SStTTTTTTtSS.','.ss.OOOOOO.ss.','...OOOOOOOO...','...OOOooOOO...','...OOO..OOO...','...OOO..OOO...','...OOO..OOO...','...OOo..OOo...','..HHHH..HHHH..'];
var SIT = ['..TTTTTTTTTT........','.TTTTTTTTTTTT.......','.TTTTTTTTTTTT.......','.SSTTTTTTTTSS.......','.SSTTTTTTOOOOOOSSSS.','.ss.tTTTTOOOOOOSSSSS','.................sss'];
var PLANE = ['....W...','...WW..O','WWWWWWWO','...WW...','....W...'];
function atDesk(x, y, u){   // cabeça e tronco atrás da mesa
  sprite(STAND.slice(0, 6), PAL, x, y + 28, 2); sprite(HEAD, PAL, x, y, 2);
}

/* ---------- Fase 1: Algarve ---------- */
var SPILL = 7.2;
function scene1(t){
  px(0, 0, 320, 40, '#4FB3E8'); px(0, 40, 320, 28, '#7FCDF0'); px(0, 68, 320, 22, '#BFE8F5');
  circle(262, 56, 13, '#FFD23F'); circle(262, 56, 9, '#FFE680');
  for (var c = 0; c < 3; c++){ var cx = ((c*130 + t*4) % 400) - 50, cy = 46 + c*9; px(cx, cy, 30, 5, '#FFFFFF'); px(cx + 6, cy - 4, 16, 4, '#FFFFFF'); }
  var gx = ((t*24) % 380) - 30, gy = 46 + Math.sin(t*2)*4, up = Math.floor(t*5) % 2;
  px(gx, gy + (up ? 0 : 2), 3, 1, '#333'); px(gx + 3, gy + 1, 2, 1, '#333'); px(gx + 5, gy + (up ? 0 : 2), 3, 1, '#333');
  px(0, 88, 320, 42, '#1C7CB8');
  for (var i = 0; i < 7; i++){ var y = 92 + i*5, off = Math.sin(t*1.2 + i)*6; for (var k = 0; k < 8; k++) px(((k*46 + i*17 + off) % 340) - 10, y, 14, 1, '#6FC3EA'); }
  // falésias do Algarve
  px(0, 52, 52, 78, '#D48A2C'); px(52, 64, 14, 66, '#D48A2C'); px(66, 80, 10, 50, '#D48A2C'); px(0, 50, 52, 3, '#5C9A3A'); px(52, 62, 14, 3, '#5C9A3A');
  px(10, 62, 3, 60, '#B06A1C'); px(30, 58, 3, 68, '#B06A1C'); px(46, 70, 3, 56, '#B06A1C'); px(60, 74, 2, 52, '#B06A1C');
  px(92, 74, 16, 56, '#D48A2C'); px(94, 70, 12, 4, '#D48A2C'); px(104, 74, 4, 56, '#B06A1C'); px(96, 106, 6, 24, '#1C7CB8');
  px(0, 128, 320, 72, '#F0D49A');
  for (var s = 0; s < 60; s++) px(Math.floor(rnd(s)*320), 132 + Math.floor(rnd(s + 99)*46), 1, 1, '#D9BB7C');
  px(0, 126 + Math.sin(t*1.5)*1.5, 320, 2, '#FFFFFF');
  // bandeira de Portugal fincada na areia
  px(278, 96, 2, 58, '#EEEEEE'); px(276, 153, 6, 2, '#D9BB7C');
  for (var f = 0; f < 24; f++){ var wy = 98 + Math.round(Math.sin(t*4 - f*.45)*1.4*(f/24)); px(280 + f, wy, 1, 16, f < 9 ? '#046A38' : '#DA291C'); }
  var cyF = 106 + Math.round(Math.sin(t*4 - 9*.45)*.5); px(286, cyF - 3, 6, 6, '#FFE900'); px(287, cyF - 4, 4, 8, '#FFE900'); px(288, cyF - 2, 2, 4, '#DA291C');
  // guarda-sol
  px(150, 162, 84, 3, '#D9BB7C');
  px(206, 84, 2, 64, '#7A5230');
  for (var r = 0; r < 12; r++){ var hw = Math.round(Math.sqrt(1 - Math.pow((11 - r)/12, 2)) * 40); for (var x = 207 - hw; x < 207 + hw; x++) px(x, 72 + r, 1, 1, (Math.floor((x + 400)/9) % 2) ? '#FF4000' : '#FFFFFF'); }
  px(206, 69, 2, 3, '#7A5230');
  // telefone na areia
  var ring = t > 5.6 && t < SPILL, shake = ring ? Math.round(Math.sin(t*60)) : 0;
  px(108 + shake, 156, 6, 10, '#222222'); px(109 + shake, 157, 4, 7, ring ? '#FF4000' : '#555555');
  // cadeira
  for (var b = 0; b < 11; b++) px(121 + b, 128 + b*2, 3, 3, '#FFFFFF');
  px(131, 150, 50, 3, '#FFFFFF'); px(135, 153, 2, 8, '#BBBBBB'); px(175, 153, 2, 8, '#BBBBBB');
  // personagem sentado
  var jy = (t > SPILL && t < SPILL + .4) ? -7*Math.sin(Math.PI*(t - SPILL)/.4) : 0, hx = 132, hy = 108 + jy;
  sprite(SIT, PAL, hx, hy + 28, 2);
  sprite(t > SPILL && t < SPILL + 1.6 ? HEAD_OH : HEAD, PAL, hx, hy, 2);
  // copo: em repouso, bebendo ou voando
  var gX = 166, gY = 128, flying = t >= SPILL, g = t - SPILL;
  if (!flying){ var ph = t % 3.2, sip = clamp(1 - Math.abs(ph - 2.1)/.5, 0, 1); gX = 166 - 14*sip; gY = 128 - 8*sip; }
  if (!flying) for (var a = 0; a <= 5; a++) px(156 + (gX - 154)*a/5, 142 + jy + (gY + 7 - 142)*a/5, 4, 4, a < 4 ? SKIN : '#C98F68');
  if (flying){ gX = 166 + g*62; gY = 128 - 62*g + 118*g*g; }
  if (flying && gY >= 152){
    px(216, 156, 11, 8, '#DFF0C0'); px(226, 158, 12, 2, '#B9DD7A'); px(232, 161, 9, 2, '#B9DD7A'); px(213, 153, 4, 3, '#6FBF3A');
  } else {
    px(gX, gY, 8, 11, '#DFF0C0'); px(gX + 1, gY + 3, 6, 7, '#B9DD7A'); px(gX + 5, gY - 2, 4, 3, '#6FBF3A'); px(gX + 2, gY - 5, 1, 7, '#FF4000');
    if (flying) for (var d = 0; d < 4; d++) px(gX - 4 - d*5, gY + 4 + d*3, 2, 2, '#B9DD7A');
  }
  if (ring && Math.floor(t*6) % 2){ px(118, 136, 9, 13, '#FFFFFF'); px(121, 149, 3, 2, '#FFFFFF'); px(121, 138, 3, 6, '#FF4000'); px(121, 145, 3, 2, '#FF4000'); }
}

/* ---------- Fase 2: a travessia ---------- */
var FARO = [228, 50], BH = [106, 124], CTRL = [150, 46];
function bez(p){ var q = 1 - p; return [q*q*FARO[0] + 2*q*p*CTRL[0] + p*p*BH[0], q*q*FARO[1] + 2*q*p*CTRL[1] + p*p*BH[1]]; }
function pin(x, y, pulse){ if (pulse) px(x - 4, y - 8, 9, 9, '#FFFFFF'); px(x - 2, y - 6, 5, 5, '#FF4000'); px(x, y - 1, 1, 2, '#FF4000'); }
function scene2(u){
  px(0, 0, 320, 180, '#155E94');
  for (var i = 0; i < 40; i++) px(((rnd(i)*340 + u*6) % 340) - 10, 20 + Math.floor(rnd(i + 50)*160), 6, 1, '#2C7DB8');
  var L = '#4FA44A', D = '#3D8A3B';
  px(222, 24, 36, 30, L); px(246, 14, 74, 20, L); px(270, 14, 50, 44, L); px(222, 28, 7, 24, '#7ED06F');
  px(234, 66, 86, 114, L); px(214, 80, 22, 42, L); px(234, 66, 86, 3, D);
  px(40, 62, 72, 20, L); px(28, 82, 100, 40, L); px(128, 90, 12, 24, L); px(48, 122, 74, 30, L); px(58, 152, 42, 28, L); px(40, 62, 72, 3, D);
  var p = clamp((u - 1.2)/5.2, 0, 1);
  for (var k = 0; k <= p; k += .035){ var b = bez(k); px(b[0], b[1], 2, 2, '#FFFFFF'); }
  var arrived = p >= 1;
  pin(FARO[0], FARO[1], false); pin(BH[0], BH[1], arrived && Math.floor(u*5) % 2);
  if (!arrived){ var pl = bez(p); sprite(PLANE, { W: '#FFFFFF', O: '#FF4000' }, pl[0] - 8, pl[1] - 9 + Math.sin(u*6), 2); }
}

/* ---------- Fase 3: eNotas ---------- */
function bubbleQ(x, y, ok){
  px(x, y, 12, 11, '#FFFFFF'); px(x + 2, y + 11, 3, 2, '#FFFFFF');
  if (ok){ var g = '#0A8F3C'; px(x + 2, y + 5, 2, 2, g); px(x + 4, y + 7, 2, 2, g); px(x + 6, y + 5, 2, 2, g); px(x + 8, y + 3, 2, 2, g); }
  else { var o = '#FF4000'; px(x + 4, y + 2, 4, 1, o); px(x + 7, y + 3, 1, 2, o); px(x + 5, y + 5, 2, 1, o); px(x + 5, y + 8, 2, 1, o); }
}
function scene3(u){
  px(0, 0, 320, 124, '#DDE6EC'); px(0, 122, 320, 2, '#C4CED6');
  px(0, 124, 320, 56, '#B9855A'); for (var i = 1; i < 4; i++) px(0, 124 + i*14, 320, 1, '#9C6B43');
  // planta
  px(282, 104, 14, 18, '#C96A3A'); px(286, 84, 6, 20, '#3D8A3B'); px(278, 90, 8, 5, '#4FA44A'); px(292, 86, 8, 5, '#4FA44A'); px(282, 78, 6, 6, '#4FA44A');
  // dúvidas dos clientes: viram resolvidas depois do guia
  var ok = u > 8.2, Q = [[30, 74], [58, 88], [254, 54], [286, 42], [232, 34]];
  for (var q = 0; q < Q.length; q++) if (u > .6 + q*.5) bubbleQ(Q[q][0], Q[q][1] + Math.round(Math.sin(u*2 + q)*2), ok);
  // personagem, mesa e monitor
  atDesk(112, 60, u);
  px(84, 100, 170, 6, '#8A5A33'); px(84, 106, 170, 2, '#6E4526'); px(90, 108, 6, 36, '#6E4526'); px(242, 108, 6, 36, '#6E4526');
  px(178, 60, 62, 36, '#222222'); px(204, 96, 10, 4, '#222222');
  var auto = u > 12, flash = u > 12 && u < 12.5 && Math.floor(u*16) % 2;
  px(181, 63, 56, 30, flash ? '#B7F6CB' : '#F7FAFC');
  px(184, 66, 18, 3, '#FF4000');
  for (var l = 0; l < 4; l++){ px(184, 72 + l*5, 30, 2, '#C4CED6'); if (auto || (u > 6.8 + l*.5)){ var g = '#0A8F3C'; px(220, 72 + l*5, 2, 2, g); px(222, 73 + l*5, 2, 2, g); px(224, 71 + l*5, 2, 2, g); } }
  px(146, 97, 26, 3, '#C9CDD2');
  var tk = Math.floor(u*8) % 2; px(148 + (tk ? 2 : 0), 94, 4, 3, SKIN); px(160 - (tk ? 2 : 0), 94, 4, 3, SKIN);
  // item 1: guia de configurações
  if (u > 6.4 && u < 9.8){
    var by = 36 - Math.abs(Math.sin((u - 6.4)*3))*5, bx = 262;
    px(bx, by, 16, 19, '#FF4000'); px(bx + 2, by + 2, 12, 15, '#FFFFFF'); for (var n = 0; n < 4; n++) px(bx + 4, by + 5 + n*3, 8, 1, '#7A7773');
    if (Math.floor(u*6) % 2){ sparkle(bx - 5, by + 2, '#FFC000'); sparkle(bx + 22, by + 12, '#FFC000'); } else { sparkle(bx + 20, by - 2, '#FFC000'); sparkle(bx - 4, by + 16, '#FFC000'); }
  }
  // item 2: a nota fiscal voa para dentro do sistema
  if (u > 10.4 && u < 12){
    var p = ease((u - 10.4)/1.6), nx = 40 + (203 - 40)*p, ny = 70 - Math.sin(p*Math.PI)*34 + 4*p;
    px(nx, ny, 12, 15, '#FFFFFF'); px(nx, ny, 12, 3, '#FF4000'); for (var m = 0; m < 3; m++) px(nx + 2, ny + 5 + m*3, 8, 1, '#7A7773');
  }
  if (u > 12 && u < 14.4 && Math.floor(u*6) % 2){ sparkle(174, 58, '#FFC000'); sparkle(244, 70, '#FFC000'); sparkle(236, 54, '#FFC000'); }
}

/* ---------- Fase 4: eNotas + Hotmart ---------- */
function scene4(u){
  px(0, 0, 320, 180, '#0D0D0D');
  for (var i = 0; i < 70; i++){ var on = Math.floor(u*3 + rnd(i)*10) % 3; if (on) px(Math.floor(rnd(i + 3)*320), Math.floor(rnd(i + 31)*180), 1 + (i % 2), 1 + (i % 2), i % 5 ? '#52514E' : '#FF4000'); }
  if (u > 3){
    for (var k = 0; k < 14; k++){ var a = k/14*Math.PI*2, d = 30 + (u - 3)*46; if (d < 170) px(160 + Math.cos(a)*d*1.3, 90 + Math.sin(a)*d*.75, 3, 3, k % 2 ? '#FF4000' : '#FFC000'); }
    if (u < 3.6){ ctx.globalAlpha = 1 - (u - 3)/.6; px(0, 0, 320, 180, '#FFFFFF'); ctx.globalAlpha = 1; }
  }
}
function fusionDom(u, active){
  show('fE', active); show('fH', active); if (!active) return;
  var p = ease((u - .5)/2), joined = u >= 3, shake = (u > 2.5 && u < 3) ? Math.round(Math.sin(u*90))*.5 : 0;
  var fe = $('fE'), fh = $('fH');
  fe.style.left = (-30 + 53*p) + 'cqw'; fh.style.left = (103 - 53*p) + 'cqw';
  fe.style.transform = fh.style.transform = 'translateY(' + shake + 'cqw)';
  fe.classList.toggle('apart', !joined); fh.classList.toggle('apart', !joined);
}

/* ---------- Fase 5: Voice of Customer ---------- */
var ZOOM0 = 6, MON = [195, 78];
function scene5(u){
  var z = 1 + ease((u - ZOOM0)/1.6)*5;
  ctx.save(); ctx.translate(MON[0], MON[1]); ctx.scale(z, z); ctx.translate(-MON[0], -MON[1]);
  px(-200, -200, 720, 324, '#F5F3EF'); px(-200, 118, 720, 6, '#FF4000'); px(-200, 124, 720, 200, '#2E2E2C');
  // janela com a serra e os prédios de Belo Horizonte
  px(246, 30, 62, 56, '#0D0D0D'); px(249, 33, 56, 50, '#8FD3F4');
  px(249, 58, 56, 25, '#5C9A3A'); px(249, 54, 20, 4, '#5C9A3A'); px(275, 50, 30, 8, '#5C9A3A'); px(287, 46, 14, 4, '#5C9A3A');
  var bl = [[252, 62, 8, 21], [262, 56, 7, 27], [271, 66, 9, 17], [282, 60, 8, 23], [292, 68, 10, 15]];
  for (var b = 0; b < bl.length; b++){ px(bl[b][0], bl[b][1], bl[b][2], bl[b][3], '#52514E'); for (var w = 0; w < 3; w++) px(bl[b][0] + 2, bl[b][1] + 3 + w*5, 2, 2, '#FFE680'); }
  px(276, 33, 2, 50, '#0D0D0D');
  // a voz dos clientes chegando ao monitor
  if (u < ZOOM0 + .4) for (var c = 0; c < 5; c++){ var p = ((u*.32 + c*.2) % 1), bx = -10 + p*172, by = 46 + c*9 + Math.sin(u*3 + c)*2, col = c % 2 ? '#0D0D0D' : '#FF4000'; px(bx, by, 10, 7, col); px(bx + 2, by + 7, 2, 2, col); px(bx + 2, by + 2, 6, 1, '#F5F3EF'); px(bx + 2, by + 4, 4, 1, '#F5F3EF'); }
  atDesk(96, 60, u);
  px(70, 100, 180, 6, '#52514E'); px(70, 106, 180, 2, '#3A3936'); px(76, 108, 6, 36, '#3A3936'); px(238, 108, 6, 36, '#3A3936');
  px(160, 56, 70, 40, '#0D0D0D'); px(190, 96, 10, 4, '#0D0D0D');
  px(163, 59, 64, 34, '#F5F3EF');
  px(166, 62, 13, 8, '#0D0D0D'); for (var k = 0; k < 3; k++){ px(181 + k*15, 62, 13, 8, '#FFFFFF'); px(183 + k*15, 64, 6, 1, '#7A7773'); px(183 + k*15, 66, 8, 2, '#0D0D0D'); }
  px(168, 64, 6, 1, '#B2AFA8'); px(168, 66, 8, 2, '#F5F3EF');
  for (var j = 0; j < 7; j++){ var h = 6 + Math.round(rnd(j + 5)*10); px(167 + j*6, 91 - h, 4, h, '#0D0D0D'); px(167 + j*6, 91 - h, 4, 3, '#FF4000'); }
  px(212, 74, 13, 2, '#FF4000'); px(212, 79, 9, 2, '#0D0D0D'); px(212, 84, 6, 2, '#0D0D0D');
  px(128, 97, 26, 3, '#C9CDD2');
  var tk = Math.floor(u*8) % 2; px(130 + (tk ? 2 : 0), 94, 4, 3, SKIN); px(142 - (tk ? 2 : 0), 94, 4, 3, SKIN);
  ctx.restore();
}
function dashDom(u, active){
  var on = active && u > ZOOM0 + 1; show('dash', on); if (!on) return;
  var p = ease((u - ZOOM0 - 1)/.8), d = $('dash');
  d.style.opacity = p; d.style.transform = 'scale(' + (.55 + .45*p) + ')';
}

/* ---------- Fase 6: Launchpad ---------- */
var BLOCKS = [[130,38,172,9,'#FFFFFF'],[134,40,5,5,'#FF4000'],[136,53,44,5,'#FF4000'],[136,61,74,6,'#0D0D0D'],[136,69,60,6,'#0D0D0D'],[136,79,66,2,'#7A7773'],[136,83,56,2,'#7A7773'],[136,89,28,7,'#FF4000'],[167,89,24,7,'#C3BFB8'],[244,51,38,62,'#0D0D0D'],[136,102,30,22,'#FFFFFF'],[170,102,30,22,'#FFFFFF'],[204,102,30,22,'#FFFFFF']];
var PROMPT = 'Crie o site do meu projeto 2027 para o Launchpad Partners.';
function scene6(u){
  px(0, 0, 320, 128, '#3A3936'); px(0, 128, 320, 52, '#181817'); px(0, 126, 320, 2, '#52514E');
  px(126, 26, 180, 106, '#0D0D0D'); px(128, 28, 176, 9, '#2E2E2C'); px(131, 31, 3, 3, '#FF4000'); px(136, 31, 3, 3, '#7A7773'); px(141, 31, 3, 3, '#7A7773');
  px(128, 37, 176, 93, '#F5F3EF');
  ctx.save(); ctx.beginPath(); ctx.rect(128, 37, 176, 93); ctx.clip();
  for (var i = 0; i < BLOCKS.length; i++){ var t0 = 2.4 + i*.42; if (u < t0) continue; var b = BLOCKS[i], p = ease((u - t0)/.35); px(b[0], b[1] - (1 - p)*26, b[2], b[3], b[4]); }
  if (u > 6.5 && Math.floor(u*2) % 2) px(258, 78, 10, 3, '#FF4000');
  ctx.restore();
  var done = u > 2.4 + BLOCKS.length*.42;
  if (done && Math.floor(u*6) % 2){ sparkle(122, 30, '#FFC000'); sparkle(310, 60, '#FFC000'); sparkle(300, 136, '#FFC000'); sparkle(118, 110, '#FFC000'); }
  // personagem em pé, de camiseta preta
  var bob = done ? Math.round(Math.abs(Math.sin(u*5))*-3) : 0;
  px(58, 141, 34, 3, '#0D0D0D');
  sprite(STAND_LP, PAL_LP, 60, 112 + bob, 2); sprite(LP_LOGO, PAL_LOGO, 70, 112 + bob, 1); sprite(HEAD, PAL, 60, 84 + bob, 2);
}

/* ---------- Transição em blocos ---------- */
function wipe(amount){ for (var i = 0; i < 144; i++) if (rnd(i + 7) < amount) px((i % 16)*20, Math.floor(i/16)*20, 20, 20, '#0D0D0D'); }

/* ---------- Roteiro ---------- */
var T2 = 10.6, T3 = T2 + 9.6, T4 = T3 + 15, T5 = T4 + 7, T6 = T5 + 13, END = T6 + 11;
var STARTS = [0, T2, T3, T4, T5, T6];
var NAMES = ['Algarve', 'A travessia', 'eNotas', 'Power-up', 'Voice of Customer', 'Launchpad'];
var CAPTIONS = [
  [.4, 'Algarve, Portugal. Sol, mar e zero preocupações.'],
  [3.4, 'O plano do dia era ambicioso: terminar a caipirinha.'],
  [5.6, 'Até que o telefone tocou.'],
  [SPILL + .3, 'A caipirinha não sobreviveu. A missão foi aceita.'],
  [T2 + .3, 'Fase 2: atravessar o Atlântico.'],
  [T2 + 3.2, 'Na bagagem: uma mala e a mania de ajudar os outros a destravar.'],
  [T2 + 6.6, 'Belo Horizonte. Troquei o mar pelo pão de queijo.'],
  [T3 + .3, 'Fase 3: eNotas. Missão: ajudar clientes a configurar a plataforma.'],
  [T3 + 3.4, 'Eram até 60 dias de reuniões, e-mails e mensagens no WhatsApp.'],
  [T3 + 6.4, 'Então criei um guia de configurações. O prazo máximo caiu para 35 dias.'],
  [T3 + 10.2, 'Depois ajudei a criar o onboarding automatizado: o cliente envia uma nota e o sistema preenche o resto.'],
  [T4 + .3, 'Fase 4: duas forças se aproximam.'],
  [T4 + 3.2, 'Power-up desbloqueado: o eNotas agora é Hotmart.'],
  [T5 + .3, 'Fase 5: Voice of Customer, na Hotmart.'],
  [T5 + 3.2, 'A missão cresceu: ouvir clientes de todas as áreas de produto.'],
  [T5 + 6.2, 'Para dar conta, construí um painel.'],
  [T5 + 8.8, 'Ferramenta VOC: indicadores e iniciativas em um só lugar.'],
  [T6 + .3, 'Fase 6: Launchpad. Camiseta nova, ferramenta nova.'],
  [T6 + 3.6, 'Primeira construção: este site que você está vendo.'],
  [T6 + 8, 'Próxima missão: destravar builders em 2027.']
];
var POPUPS = [
  [5.9, SPILL + 1.6, 'Nova missão disponível', 'eNotas · Belo Horizonte'],
  [T3 + 6.4, T3 + 9.8, 'Item criado', 'Guia de configurações'],
  [T3 + 12, T3 + 14.6, 'Item criado', 'Onboarding automatizado'],
  [T4 + 3.2, T4 + 6.5, 'Power-up', 'eNotas + Hotmart'],
  [T5 + 8.8, T5 + 12.4, 'Item criado', 'Ferramenta VOC']
];
var EVENTS = [[5.6, 'blip'], [SPILL, 'splash'], [T2 + 6.4, 'arrive'], [T3 + 6.4, 'item'], [T3 + 12, 'item'], [T4 + 3, 'power'], [T5 + ZOOM0, 'zoom'], [T5 + 8.8, 'item'], [T6 + 8, 'arrive']];
for (var bi = 0; bi < BLOCKS.length; bi++) EVENTS.push([T6 + 2.4 + bi*.42, 'tick' + bi]);
var t0 = 0, running = false, fired = {}, lastCap = -1, lastPop = -1, lastPhase = -1;
var phaseEls = [];

function hudRight(i, u){
  if (i === 0) return 'Caipirinhas: ' + (u >= SPILL ? 0 : 1);
  if (i === 1) return 'Destino: Belo Horizonte';
  if (i === 2) return 'Prazo de onboarding: ' + Math.round(60 - 25*clamp((u - 6.6)/2, 0, 1)) + ' dias';
  if (i === 3) return u >= 3 ? 'eNotas + Hotmart' : 'Carregando...';
  if (i === 4) return 'Áreas ouvidas: todas';
  return 'Construindo: projeto 2027';
}
function frame(now){ if (!running) return; render((now - t0)/1000); requestAnimationFrame(frame); }
function render(t){
  var i = 0; for (var s = 0; s < STARTS.length; s++) if (t >= STARTS[s]) i = s;
  var u = t - STARTS[i];
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  if (i === 0){ ctx.save(); ctx.translate(0, -20); scene1(u); ctx.restore(); }   // sobe a praia para a legenda não cobrir a cena
  else if (i === 1) scene2(u); else if (i === 2) scene3(u); else if (i === 3) scene4(u); else if (i === 4) scene5(u); else scene6(u);
  for (var b = 1; b < STARTS.length; b++){
    if (t > STARTS[b] - .5 && t < STARTS[b]) wipe((t - (STARTS[b] - .5))/.5);
    if (t >= STARTS[b] && t < STARTS[b] + .5) wipe(1 - (t - STARTS[b])/.5);
  }
  var settled = u > .5 && t < END;
  hudL.innerHTML = '<b>Fase ' + (i + 1) + '</b> · ' + NAMES[i];
  hudR.textContent = hudRight(i, u);
  if (i !== lastPhase){ lastPhase = i; phaseEls.forEach(function(el, k){ el.classList.toggle('now', k === i); }); }
  show('lbFaro', i === 1 && settled); show('lbBH', i === 1 && settled);
  show('wallEnotas', i === 2 && settled && u < 14.5);
  fusionDom(u, i === 3 && u > .4 && u < 6.5);
  show('wallHot', i === 4 && settled && u < ZOOM0); show('vocSign', i === 4 && settled && u < ZOOM0);
  dashDom(u, i === 4 && u < 12.5);
  var bub = i === 5 && u > .8 && u < 10.5; show('bubble', bub);
  if (bub) $('bubble').textContent = PROMPT.slice(0, Math.floor(clamp((u - 1)/1.6, 0, 1)*PROMPT.length));
  var pi = -1; for (var p = 0; p < POPUPS.length; p++) if (t > POPUPS[p][0] && t < POPUPS[p][1]) pi = p;
  if (pi !== lastPop){ lastPop = pi; show('popup', pi >= 0); if (pi >= 0){ popup.firstChild.textContent = POPUPS[pi][2]; popup.lastChild.textContent = POPUPS[pi][3]; } }
  var ci = -1; for (var c = 0; c < CAPTIONS.length; c++) if (t >= CAPTIONS[c][0]) ci = c;
  if (t >= END) ci = -1;
  if (ci !== lastCap){ lastCap = ci; caption.textContent = ci < 0 ? '' : CAPTIONS[ci][1]; }
  EVENTS.forEach(function(e){ if (t >= e[0] && !fired[e[1] + e[0]]){ fired[e[1] + e[0]] = 1; if (t < e[0] + .5) sfx(e[1]); } });
  if (t >= END && $('end').hidden){ $('end').hidden = false; show('bubble', false); var v = $('end').querySelector('video'); try { v.currentTime = 0; v.play(); } catch (e) {} }
}
function place(el, p){ el.style.left = (p[0]/320*100) + '%'; el.style.top = ((p[1] - 10)/180*100) + '%'; }
place($('lbFaro'), FARO); place($('lbBH'), BH);
(function(){ var cols = [[5,7,4],[7,5,3],[9,6,5],[6,8,4],[8,9,6],[10,7,5]], h = ''; cols.forEach(function(c){ h += '<div><u style="height:' + c[2]*4 + '%;background:#C3BFB8"></u><u style="height:' + c[1]*4 + '%;background:#FF4000"></u><u style="height:' + c[0]*4 + '%;background:#0D0D0D"></u></div>'; }); $('bars').innerHTML = h; })();

/* ---------- Som (chiptune sintetizado no navegador) ---------- */
var ac = null, master = null, muted = false, step = 0, nextT = 0, timer = null;
var LEAD = [72,76,79,76,72,76,79,84, 69,72,76,72,69,72,76,81, 65,69,72,69,65,69,72,77, 67,71,74,71,79,77,74,71];
var BASS = [48,55,48,55, 45,52,45,52, 41,48,41,48, 43,50,43,50];
var EIGHTH = .2;
function hz(m){ return 440*Math.pow(2, (m - 69)/12); }
function note(m, when, dur, type, vol){
  var o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.value = hz(m);
  g.gain.setValueAtTime(vol, when); g.gain.exponentialRampToValueAtTime(.001, when + dur);
  o.connect(g); g.connect(master); o.start(when); o.stop(when + dur + .02);
}
function schedule(){
  if (!running){ clearInterval(timer); return; }
  while (nextT < ac.currentTime + .25){
    note(LEAD[step % 32], nextT, EIGHTH*.9, 'square', .16);
    if (step % 2 === 0) note(BASS[(step/2) % 16], nextT, EIGHTH*1.8, 'triangle', .34);
    nextT += EIGHTH; step++;
  }
}
function startAudio(){
  try {
    if (!ac){ ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.connect(ac.destination); }
    master.gain.value = muted ? 0 : .22; ac.resume();
    step = 0; nextT = ac.currentTime + .05; clearInterval(timer); timer = setInterval(schedule, 60);
  } catch (e) { ac = null; }
}
function sfx(name){
  if (!ac) return; var n = ac.currentTime;
  if (name === 'blip'){ note(88, n, .09, 'square', .3); note(93, n + .1, .14, 'square', .3); note(88, n + .35, .09, 'square', .3); note(93, n + .45, .14, 'square', .3); }
  else if (name === 'splash'){ for (var i = 0; i < 6; i++) note(76 - i*5, n + i*.05, .08, 'sawtooth', .28); }
  else if (name === 'arrive'){ [72, 76, 79, 84, 88].forEach(function(m, k){ note(m, n + k*.09, .2, 'square', .3); }); }
  else if (name === 'item'){ [84, 88, 91, 96].forEach(function(m, k){ note(m, n + k*.07, .16, 'square', .3); }); }
  else if (name === 'power'){ for (var j = 0; j < 12; j++) note(60 + j*3, n + j*.045, .1, 'square', .3); }
  else if (name === 'zoom'){ for (var z = 0; z < 8; z++) note(55 + z*4, n + z*.06, .08, 'triangle', .4); }
  else if (name.indexOf('tick') === 0){ note(96, n, .05, 'square', .18); }
}

/* ---------- Controles ---------- */
function start(){
  $('start').hidden = true; $('end').hidden = true; show('sound', true);
  fired = {}; lastCap = lastPop = lastPhase = -1; caption.textContent = '';
  t0 = performance.now(); running = true; startAudio(); requestAnimationFrame(frame);
}
$('play').addEventListener('click', start);
$('sound').addEventListener('click', function(){
  muted = !muted; if (master) master.gain.value = muted ? 0 : .22;
  this.textContent = muted ? 'MUDO' : 'SOM'; this.setAttribute('aria-label', muted ? 'Ligar o som' : 'Desligar o som');
});
ctx.translate(0, -20); scene1(0); ctx.setTransform(1, 0, 0, 1, 0, 0);
function firstFrame(){ ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(0, -20); scene1(0); ctx.setTransform(1, 0, 0, 1, 0, 0); }
function stop(){
  running = false; clearInterval(timer); if (master) master.gain.value = 0;
  try { $('end').querySelector('video').pause(); } catch (e) {}
}
function reset(){
  stop(); $('start').hidden = false; $('end').hidden = true; caption.textContent = ''; hudL.textContent = ''; hudR.textContent = '';
  root.querySelectorAll('[data-show].on').forEach(function(el){ el.classList.remove('on'); });
  firstFrame();
}
$('finish').addEventListener('click', function(){ stop(); if (opts.onFinish) opts.onFinish(); });
return { stop: stop, reset: reset, preview: function(t){ running = false; $('start').hidden = true; $('end').hidden = true; render(t); return [T2, T3, T4, T5, T6, END]; } };
}
window.TrajetoriaVideo = { mount: mount };
})();

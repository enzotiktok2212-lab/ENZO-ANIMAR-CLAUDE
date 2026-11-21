// ===== Parte 2: el Sistema (89,9 – 149,0 s). Sala oscura con racks, pantalla curva, monitor vertical con fotogramas reales del vídeo, el núcleo (ojo) y el Chef =====
const PREV = [['LEON', 0], ['LEON', 1], ['PAUL', 2], ['NOAH', 3], ['BEN', 4], ['LUCA', 5], ['MAX', 6]];
// capturas de «vídeos anteriores»: otros niños protagonistas en Lindenbrück, cada uno con su regla
const SNAPS = [
  ['k0', L => { town(); put(K[0], 0, 0, 0, 0); umbIn(K[0], 2, .8); actuar(K[0], 1, [[0, { aRx: 1.3, aRe: 1.4, aLx: 2.5, aLz: .4 }]], { T: 3 }); grin(K[0], 3); orbit(V(0, 2.6, 0), 10, .2, .12, 44); sh(V(0, 0, 0), 14); }],
  ['k1', L => { town(); show(SKATE[1], 0, 0, 0, 0); put(K[1], 0, .6, 0, 0); applyPose(K[1], { crouch: .3, aLz: .7, aRz: .7, lean: .1 }); grin(K[1], 3); orbit(V(0, 2.6, 0), 10, -.3, .12, 44); sh(V(0, 0, 0), 14); }],
  ['k2', L => { town(); put(K[2], -1, 0, 0, .3); actuar(K[2], 1, [[0, 'wave']], { T: 3 }); grin(K[2], 3); STK.update(3, [[2, 0, -.5, -.3, .9]], 'wave'); orbit(V(.4, 2.6, 0), 11, 0, .12, 44); sh(V(0, 0, 0), 14); }],
  ['k3', L => { town(); put(K[3], -1.6, 0, 0, .4); actuar(K[3], 1, [[0, 'cheer']], { T: 3 }); laughF(K[3], 3); show(CAT, 2.2, 0, -.5, -.6, .6); orbit(V(.3, 2.6, 0), 12, 0, .12, 44); sh(V(0, 0, 0), 14); }],
  ['k4', L => { town(); put(K[4], 0, 0, 0, 0); actuar(K[4], 1, [[0, 'point_l']], { T: 3 }); grin(K[4], 3); DRA.g.visible = true; DRA.update(3, dpath(10, 14, -30, 60, 2, 0)); orbit(V(0, 4, 0), 14, .1, .1, 46); sh(V(0, 0, -10), 40); }],
  ['k5', L => { town(); put(K[5], 0, 0, 0, 0); actuar(K[5], 1, [[0, 'shock']], { T: 3 }); cara(K[5], 3, { expr: 'shock', mouth: 'o' }); keysFly(V(0, 3, 0), 0, .3, 20); orbit(V(0, 2.8, 0), 12, -.15, .12, 44); sh(V(0, 0, 0), 14); }],
  ['k6', L => { town('morning'); put(K[6], 0, 0, 0, 0); actuar(K[6], 1, [[0, 'wave']], { T: 3 }); grin(K[6], 3); show(KRU, 2.6, 0, .6, -.4, .7); orbit(V(.6, 2.6, 0), 11, .1, .12, 44); sh(V(0, 0, 0), 14); }],
];
// fotograma vertical tipo vídeo con título
function tile(c, img, x, y, w, h, o = {}) { c.save(); c.fillStyle = '#05070c'; c.fillRect(x, y, w, h); if (img) c.drawImage(img, x, y, w, h);
  if (o.title) { c.font = `700 ${w * .085}px ${FONT}`; c.textAlign = 'center'; c.lineJoin = 'round'; c.lineWidth = w * .03; c.strokeStyle = '#000'; c.strokeText(o.title, x + w / 2, y + h * .1); c.fillStyle = '#fff'; c.fillText(o.title, x + w / 2, y + h * .1); }
  if (o.name) { c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(x, y + h - h * .12, w, h * .12); c.font = `700 ${w * .11}px monospace`; c.textAlign = 'center'; c.fillStyle = o.nameCol || '#7ae8ff'; c.fillText(o.name, x + w / 2, y + h - h * .035); }
  if (o.views) { c.font = `700 ${w * .07}px ${FONT}`; c.textAlign = 'left'; c.fillStyle = '#fff'; c.fillText('▶ ' + o.views, x + w * .05, y + h * .84); }
  if (o.red) { c.fillStyle = `rgba(255,20,40,${.3 * o.red})`; c.fillRect(x, y, w, h); c.strokeStyle = '#ff2a3a'; c.lineWidth = w * .035; c.beginPath(); c.moveTo(x + w * .1, y + h * .1); c.lineTo(x + w * .9, y + h * .9); c.moveTo(x + w * .9, y + h * .1); c.lineTo(x + w * .1, y + h * .9); c.stroke(); }
  if (o.green) { c.fillStyle = '#2aff8a'; c.font = `700 ${w * .3}px ${FONT}`; c.textAlign = 'center'; c.fillText('✓', x + w * .82, y + h * .25); }
  c.strokeStyle = o.border || 'rgba(90,224,255,.7)'; c.lineWidth = o.bw || 3; c.strokeRect(x + 1, y + 1, w - 2, h - 2); c.restore(); }
// marca de «análisis»: círculo y texto sobre una zona del fotograma
function mark(c, x, y, r, text, k = 1, col = '#ff3a4a') { if (k <= 0) return; c.save(); c.strokeStyle = col; c.lineWidth = 8; c.beginPath(); c.arc(x, y, r, -PI / 2, -PI / 2 + 6.283 * clamp(k)); c.stroke(); if (text && k > .6) { c.font = `700 40px monospace`; c.textAlign = 'center'; c.lineWidth = 10; c.strokeStyle = '#000'; c.strokeText(text, x, y + r + 50); c.fillStyle = col; c.fillText(text, x, y + r + 50); } c.restore(); }
function term(c, lines, x, y, size = 30, col = '#7ae8ff', k = 99) { c.save(); c.font = `700 ${size}px monospace`; c.textAlign = 'left'; let n = 0; lines.forEach((l, i) => { const t = l.slice(0, Math.max(0, Math.floor(k - n))); n += l.length; c.fillStyle = l.startsWith('!') ? '#ff5a6a' : col; c.fillText(t.replace(/^!/, ''), x, y + i * size * 1.35); }); c.restore(); }
// sala: luces, actualización del núcleo y de la pantalla curva
function sala(L, talk = 0, red = 0, scr = null) { use('SY'); dark(); const T = L.T; SY.update(T, talk, red); SYL.intensity = 160; SYR.intensity = 60 + red * 140; SPOTL.intensity = 0; FILL.intensity = 45; FILL.color.setRGB(.75, .85, 1);
  SY.draw((c, w, h) => { scrBase(c, w, h, T, red); if (scr) scr(c, w, h); else { term(c, ['> stadt.sim  LINDENBRÜCK', '> held: EMIL (11)', '> status: LÄUFT', '> zuschauer: 4.812.330 online', red ? '!> FEHLER: UNBEKANNTE FIGUR' : '> fehler: 0'], 420, 200, 30, red ? '#ff6a7a' : '#7ae8ff'); } });
  vs((c, w, h) => { c.fillStyle = '#05070c'; c.fillRect(0, 0, w, h); }); }
// el Chef sentado en su silla (frente a la pantalla, de espaldas a la sala: lo vemos de cara desde la pantalla)
function chefSit(L, pose = {}, face = {}) { put(chef, SYX + 9, 2.1, -12, PI); applyPose(chef, { ...SIT, lLk: 1.4, lRk: 1.4, lLx: 1.45, lRx: 1.45, crouch: .05, ...pose }); cara(chef, L.T, { expr: 'angry', ...face }); }
const VSP = V(SYX - 2, 19, -34);
const aimC = (L, ch, d0, d1, dy = -1.2, off = 0, e = easeInOut) => { const c = hp(ch).add(V(0, dy, 0)); orb(L.k, c, null, [d0, ch.root.rotation.y + off, .08, 44], [d1, ch.root.rotation.y + off * .6, .06, 42], e); };   // centro del monitor vertical
// ---------- 46 · «System.» : glitch y entramos en la sala oscura; el Chef en su silla, iluminado por la pantalla ----------
shot(89.92, 'C', null, L => { sala(L); const T = L.T; chefSit(L, { headX: .1 }, { mouth: kitLips(T, spoken(L.t0, L.t1)) || 'flat' });
  vs((c, w, h) => tile(c, SNAP.emilHug, 0, 0, w, h, { title: 'IN DIESER STADT…' }));
  GL = clamp(1 - L.lt / .45);
  aimC(L, chef, 13, 10.5, -1.2, .25); sh(V(SYX, 0, -20), 40); }, [[0, 'glitch', 1], [.1, 'hum_low', .8], [.3, 'power_on', .6]]);
// ---------- 47 · «Ja.» : el núcleo se enciende ----------
shot(90.72, 'F', 'punch', L => { sala(L, 1); orbit(SY.core.position.clone().add(V(SYX, 0, 0)), 16 - L.k * 2, .25, .08, 44); sh(V(SYX, 0, -20), 40); }, [[0, 'zap', .7], [.05, 'beep', .6]]);
// ---------- 48 · «Wer ist der alte Mann?» : el monitor congela el abrazo y marca al anciano ----------
shot(91.13, 'Z', null, L => { sala(L); const T = L.T;
  vs((c, w, h) => { tile(c, SNAP.emilHug, 0, 0, w, h, { title: 'IN DIESER STADT…' }); mark(c, w * .66, h * .4, 110, '???', L.lt / .6); });
  orb(L.k, VSP.clone().add(V(0, -1, 0)), null, [36, 0, .02, 46], [31, 0, .02, 44]); sh(V(SYX, 0, -28), 40); }, [[0, 'zoom_in', .5], [.3, 'beep', .5]]);
// ---------- 49 · «Unbekannt. Ich habe ihn nicht geschrieben.» : búsqueda en la base de datos: NICHT GEFUNDEN ----------
shot(92.26, 'S', null, L => { sala(L, .7, .4, (c, w, h) => { term(c, ['> suche: "ALTER MANN"', '> skript_emil.txt ......', '> figuren: EMIL, LEA, KRÜMEL, LINA', '!> ERGEBNIS: NICHT GEFUNDEN', '!> AUTOR: UNBEKANNT'], 380, 190, 32, '#7ae8ff', L.lt * 70); });
  vs((c, w, h) => { tile(c, SNAP.opaKeys, 0, 0, w, h, { red: clamp(L.lt - .5) }); });
  orb(L.k, SY.core.position.clone().add(V(SYX, -1, 0)), null, [26, .1, .06, 46], [23, 0, .06, 46]); sh(V(SYX, 0, -20), 40); }, [[0, 'tick', .5], [.3, 'tick', .4], [.6, 'tick', .4], [.9, 'buzzer', .6]]);
// ---------- 50 · «Wie heißt der Junge?» «Emil.» : ficha de Emil ----------
shot(94.22, 'W', null, L => { sala(L, L.lt > 1 ? 1 : 0); const T = L.T; chefSit(L, { headX: -.05, lean: .1 }, { mouth: kitLips(T, spoken(L.t0, L.t0 + .9)) || 'flat' });
  vs((c, w, h) => { tile(c, SNAP.emilWave, 0, 0, w, h, { name: L.lt > .95 ? 'EMIL · 11' : '…' }); });
  aimC(L, chef, 12, 10.5, -1.2, .3); sh(V(SYX, 0, -20), 40); }, [[0, 'beep', .5], [1.0, 'notif', .7]]);
// ---------- 51 · «Und beim letzten Mal?» : el Chef se inclina hacia delante ----------
shot(95.73, 'C', 'punch', L => { sala(L); const T = L.T; chefSit(L, { lean: .35, headX: -.2, aLx: 1.0, aRx: 1.0, aLe: 1.2, aRe: 1.2 }, { mouth: kitLips(T, spoken(L.t0, L.t1)) || 'flat', expr: 'sus' }); SYR.intensity = 120;
  onFace(chef, 9, .4, .8, 40, L.k, 7); sh(V(SYX, 0, -20), 40); }, [[0, 'chair_roll', .5], [.4, 'hum', .5]]);
// ---------- 52 · «Leon. Leon. Paul.» : aparecen vídeos anteriores, uno por nombre ----------
const PT = [96.91, 97.33, 97.81, 98.40, 98.88, 99.31, 99.90];
const prevWall = (c, w, h, L, red = 0) => { c.fillStyle = '#05070c'; c.fillRect(0, 0, w, h); for (let i = 0; i < 7; i++) { const k = clamp((L.T - PT[i]) / .2); if (k <= 0) continue; const col = i % 3, row = Math.floor(i / 3), tw = 160, th = 284, x = 18 + col * (tw + 12), y = 20 + row * (th + 12);
  c.save(); c.globalAlpha = k; tile(c, SNAP['k' + PREV[i][1]], x, y + (1 - k) * 30, tw, th, { name: PREV[i][0], red }); c.restore(); } };
shot(96.91, 'Z', null, L => { sala(L, .8, 0, (c, w, h) => prevWall(c, w, h, L, 0, 7));
  vs((c, w, h) => { const i = [96.91, 97.33, 97.81, 98.40].filter(t => L.T >= t).length - 1; tile(c, SNAP['k' + Math.max(0, i)], 0, 0, w, h, { title: 'IN DIESER STADT…', name: PREV[Math.max(0, i)][0] }); });
  orb(L.k, VSP.clone().add(V(0, -1, 0)), null, [40, 0, .02, 46], [36, 0, .02, 46]); sh(V(SYX, 0, -28), 40); }, [[0, 'notif', .6], [.42, 'notif', .5], [.9, 'notif', .6]]);
// ---------- 53 · «Noah. Ben. Luca. Max.» : la pared se llena de vídeos con otros niños ----------
shot(98.40, 'S', null, L => { sala(L, .8); vs((c, w, h) => prevWall(c, w, h, L));
  orb(L.k, VSP.clone(), null, [38, -.04, .02, 46], [35, .04, .02, 46]); sh(V(SYX, 0, -28), 40); }, [[0, 'notif', .6], [.48, 'notif', .5], [.91, 'notif', .6], [1.5, 'notif', .6]]);
// ---------- 54 · «Und davor?» : el núcleo calla; la pantalla se queda en estática ----------
shot(100.40, 'C', null, L => { sala(L, 0, 0, (c, w, h) => { const r = RNG(Math.floor(L.T * 30)); for (let i = 0; i < 1600; i++) { const v = r() * 255 | 0; c.fillStyle = `rgb(${v},${v},${v})`; c.fillRect(r() * w, r() * h, 6, 4); } });
  chefSit(L, { lean: .3, headX: -.1 }, { expr: 'sus', mouth: kitLips(L.T, spoken(L.t0, L.t1)) || 'flat' }); GL = .15;
  aimC(L, chef, 11, 9, -1.2, -.3); sh(V(SYX, 0, -20), 40); }, [[0, 'tv_static', .7]]);
// ---------- 55 · «Du weißt nicht, wer er ist. Du weißt nicht, woher er kommt.» : el Chef se levanta y golpea la mesa ----------
shot(101.06, 'W', null, L => { sala(L, 0, .5); const T = L.T; const up = easeOut(clamp(L.lt / .5));
  put(chef, SYX + 7, 0, -16, PI + .3); actuar(chef, L.lt, [[0, { crouch: .4 }], [.4, 'point'], [1.6, { aLx: 1.6, aRx: 1.6, aLe: .4, aRe: .4, lean: .3, aLz: -.1, aRz: -.1 }]], { T }); talk(chef, T, L.t0, L.t1, 'angry');
  vs((c, w, h) => { tile(c, SNAP.opaLie, 0, 0, w, h, { title: 'HERKUNFT: ???', red: .4 }); });
  aimC(L, chef, 14, 12, -1.6, 0); sh(V(SYX, 0, -20), 40); }, [[0, 'chair_roll', .6], [.3, 'steps_heavy', .5], [1.65, 'table_bang', .9], [1.7, 'impact', .5]]);
// ---------- 56 · «Und er erinnert sich.» : en el monitor, el fotograma de la feria parpadea; zoom lento ----------
shot(104.01, 'G', 'slow', L => { sala(L, 0, .8); GL = .12 + .2 * (Math.sin(L.T * 9) > .7);
  vs((c, w, h) => { tile(c, SNAP.fair, 0, 0, w, h, { title: 'ERINNERUNG?' }); if (Math.sin(L.T * 13) > .3) { c.globalAlpha = .5; tile(c, SNAP.opaKeys, 0, 0, w, h); c.globalAlpha = 1; } mark(c, w * .5, h * .5, 120, '', clamp(L.k * 1.5)); });
  orb(L.k, VSP.clone().add(V(0, 1, 0)), null, [40, 0, .02, 46], [26, 0, .02, 40], easeIn); sh(V(SYX, 0, -28), 40); }, [[0, 'glitch', .6], [.3, 'creepy_ting', .7], [.9, 'heartbeat', .6]]);
// ---------- 57 · «Das ist dein Fehler, System. Ich habe dich neunmal gewarnt.» : nueve avisos rojos ----------
shot(105.49, 'F', null, L => { sala(L, 0, .9); vs((c, w, h) => { tile(c, SNAP.opaKeys, 0, 0, w, h, { red: .5 }); for (let i = 0; i < 9; i++) { const k = clamp((L.lt - .9 - i * .12) / .15); if (k <= 0) continue; const x = 45 + (i % 3) * 160, y = 200 + Math.floor(i / 3) * 190; c.save(); c.translate(0, 0); c.globalAlpha = k; c.fillStyle = 'rgba(80,0,10,.92)'; c.fillRect(x, y, 140, 160); c.strokeStyle = '#ff3a4a'; c.lineWidth = 5; c.strokeRect(x, y, 140, 160); c.font = `700 64px ${FONT}`; c.textAlign = 'center'; c.fillStyle = '#ff5a6a'; c.fillText('⚠', x + 70, y + 85); c.font = `700 22px monospace`; c.fillText('WARNUNG ' + (i + 1), x + 70, y + 135); c.restore(); } });
  const T = L.T; put(chef, SYX + 6, 0, -24, PI + .7); actuar(chef, L.lt, [[0, 'point']], { T }); talk(chef, T, L.t0, L.t1, 'angry');
  badge('red', '9×', W / 2, H * .17, (L.lt - 1.9) * 2.5, 1, 1.1);
  orb(L.k, V(SYX + 1, 15, -30), null, [30, .45, .05, 46], [27, .35, .05, 46]); sh(V(SYX, 0, -20), 40); }, [[0, 'alarm_soft', .5], [.9, 'beep', .5], [1.3, 'beep', .5], [1.95, 'buzzer', .7]]);
// ---------- 58 · «Sieh sie dir an. Sie schauen deine Geschichten nicht mehr an.» : el monitor llena de comentarios de los espectadores ----------
const COMMENTS = ['Wer ist der Opa??', 'Die Schlüssel!!! 🔑', 'Er war schon im Jahrmarkt-Video!', 'Teil 2 bitte', 'Leon = Emil???', 'Achtet auf die Hand…', 'Das System lügt', 'Ich hab alles gecheckt 🧐', 'Warum heißt jeder Junge anders?', 'Er erinnert sich!!'];
shot(108.36, 'W', null, L => { sala(L, 0, .5); const T = L.T;
  vs((c, w, h) => { tile(c, SNAP.emilHug, 0, 0, w, h); const n = Math.floor(L.lt * 4.5); for (let i = 0; i < Math.min(n, COMMENTS.length); i++) { const y = 120 + i * 78; c.fillStyle = 'rgba(0,0,0,.66)'; c.beginPath(); c.roundRect(24, y, w - 48, 64, 18); c.fill(); c.font = `700 26px ${FONT}`; c.textAlign = 'left'; c.fillStyle = ['#ffd23f', '#7ae8ff', '#ff9ac0', '#8aff9a'][i % 4]; c.fillText('@user' + (1000 + i * 731) % 9999, 44, y + 26); c.fillStyle = '#fff'; c.fillText(COMMENTS[i], 44, y + 54); } });
    sh(V(SYX, 0, -20), 40);
  orb(L.k, VSP.clone().add(V(0, -1, 0)), null, [34, 0, .02, 46], [31, 0, .02, 46]); }, [[0, 'notif', .5], [.5, 'notif', .5], [1.0, 'notif', .5], [1.6, 'notif', .5], [2.2, 'notif', .5]]);
// ---------- 59 · «Sie entschlüsseln sie.» : lupa sobre el vídeo, aparecen códigos ----------
shot(111.31, 'Z', null, L => { sala(L, 0, .6); vs((c, w, h) => { tile(c, SNAP.opaKeys, 0, 0, w, h); const mx = w * .5 + Math.sin(L.T * 3) * 80, my = h * .45 + Math.cos(L.T * 2) * 60; c.save(); c.beginPath(); c.arc(mx, my, 120, 0, 7); c.clip(); c.drawImage(SNAP.opaKeys, -mx * .8, -my * .8, w * 1.8, h * 1.8); c.restore(); c.lineWidth = 14; c.strokeStyle = '#ffd23f'; c.beginPath(); c.arc(mx, my, 120, 0, 7); c.stroke(); c.beginPath(); c.moveTo(mx + 85, my + 85); c.lineTo(mx + 170, my + 170); c.lineWidth = 26; c.stroke();
    term(c, ['0x4C 0x45 0x4F', 'KEY=ERINNERUNG', 'FIGUR_07: ??'], 30, h - 140, 30, '#8aff9a', L.lt * 40); });
  orb(L.k, VSP.clone(), null, [32, 0, .02, 44], [27, 0, .02, 42]); sh(V(SYX, 0, -28), 40); }, [[0, 'zoom_in', .5], [.4, 'beep', .4], [.7, 'beep', .4]]);
// ---------- 60 · «Bald finden sie deinen Server.» : travelling por el pasillo de racks, luces rojas ----------
shot(112.42, 'S', null, L => { sala(L, 0, 1); SYR.intensity = 200; SYR.position.set(SYX - 30, 14, 10 - L.lt * 10);
  cam([SYX - 29 + Math.sin(L.T * 1.2) * .5, 10, 36 - L.lt * 9], [SYX - 29, 9, -20], 50); sh(V(SYX - 29, 0, 0), 50); }, [[0, 'alarm', .6], [.5, 'machine_hum', .5]]);
// ---------- 61 · «Sie werden ihn nicht finden.» : el núcleo, frío y tranquilo ----------
shot(114.09, 'C', null, L => { sala(L, 1, 0); orb(L.k, SY.core.position.clone().add(V(SYX, 0, 0)), null, [20, .35, .05, 44], [17, .2, .05, 42]); sh(V(SYX, 0, -20), 40); }, [[0, 'hum_low', .6], [.4, 'beep', .4]]);
// ---------- 62 · «Der Zuschauer soll nicht genauer hinsehen.» : el ojo se gira y nos mira a nosotros; zoom a la pupila ----------
shot(115.42, 'Z', 'slow', L => { sala(L, 1, .2); const c0 = SY.core.position.clone().add(V(SYX, 0, 0)); SY.core.rotation.y = -.8 + easeInOut(clamp(L.lt / .6)) * .8;
  orb(L.k, c0, null, [22, 0, .02, 44], [9, 0, .02, 38], easeIn); camera.lookAt(c0); SY.core.lookAt(camera.position); sh(V(SYX, 0, -20), 40); }, [[0, 'whoosh_soft', .5], [.6, 'heartbeat', .6]]);
// ---------- 63 · «Der Zuschauer soll weiterwischen.» : en el monitor, un dedo desliza el feed hacia arriba ----------
shot(117.44, 'W', null, L => { sala(L, .8); vs((c, w, h) => { const off = (L.lt * 2.2 % 1) * h; const imgs = [SNAP.emilHug, SNAP.k0, SNAP.k3, SNAP.dragon, SNAP.k5]; for (let i = -1; i < 3; i++) tile(c, imgs[(Math.floor(L.lt * 2.2) + i + 5) % 5], 0, i * h - off * easeInOut(1), w, h, { views: (1 + i * 3) + ',2 Mio' });
    const fy = h * .75 - ((L.lt * 2.2) % 1) * h * .45; c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.ellipse(w * .62, fy, 46, 62, -.2, 0, 7); c.fill(); });
  orb(L.k, VSP.clone(), null, [38, 0, .02, 44], [35, 0, .02, 42]); sh(V(SYX, 0, -28), 40); }, [[0, 'swipe', .6], [.45, 'swipe', .5], [.9, 'swipe', .6], [1.35, 'swipe', .5]]);
// ---------- 64 · «Hier ist ein gutes Video.» : el monitor pone el vídeo de Mila y la cámara entra en la pantalla ----------
shot(119.12, 'Z', null, L => { sala(L, .9); vs((c, w, h) => { tile(c, SNAP.mila1, 0, 0, w, h, { title: 'IN MEINER STADT…', views: '38 Mio' }); });
  orb(L.k, VSP.clone(), null, [34, 0, .02, 44], [12, 0, .01, 40], easeIn); sh(V(SYX, 0, -28), 40); }, [[0, 'click_set', .6], [.4, 'music_box', .5], [1.0, 'zoom_in', .6]]);
// ----- Vídeo de Mila (colores pastel, arcoíris donde se ríe, interfaz de vídeo) -----
function milaTown(L, p) { town(); grade.uniforms.sat.value = 1.65; grade.uniforms.lift.value = .05; TINT = 'rgba(255,190,230,.10)'; bloom.strength = .32; VIDUI = { p, views: '38.000.000 Aufrufe', likes: '4,1 Mio', a: 1 }; }
const RBP = [[-5, -6], [6, -9], [0, -14]];
// ---------- 65 · «In meiner Stadt wächst überall, wo du lachst,» ----------
shot(120.62, 'F', null, L => { milaTown(L, .1 + L.k * .2); const T = L.T;
  put(mila, 0, 0, 0, .1); actuar(mila, L.lt, [[0, { aLx: .6, aRx: .6, aLz: .5, aRz: .5, lean: -.1 }]], { T }); talk(mila, T, L.t0, L.t1, 'happy', { eyes: 'happy' });
  FLW.forEach((f, i) => { if (i >= 18) return; const r = RNG(i + 3), k = spring(clamp((L.lt - i * .06) / .3)); show(f, (r() - .5) * 14, .7, -3 + (r() - .5) * 8, 0, Math.max(.01, k) * 1.2); });
  crowdAt(T, grid(-30, -40, 30, -14, 50, 21, 0), 'cheer');
  orb(L.k, V(0, 2.6, -1), null, [13, .3, .1, 44], [11, .1, .1, 44]); sh(V(0, 0, 0), 20); }, [[0, 'kids_laugh', .7], [.3, 'sparkle', .6], [.8, 'pop', .5]]);
// ---------- 66 · «… ein Regenbogen.» : al reír, brotan arcoíris del suelo ----------
shot(122.16, 'Z', null, L => { milaTown(L, .3 + L.k * .2); const T = L.T;
  put(mila, 0, 0, 0, 0); actuar(mila, L.lt, [[0, 'cheer']], { T }); laughF(mila, T);
  RBOW.forEach((r, i) => { const k = spring(clamp((L.lt - .15 - i * .25) / .5)); show(r, RBP[i][0], 0, RBP[i][1], (i - 1) * .3, Math.max(.01, k)); });
  orb(L.k, V(0, 5, -6), null, [26, .1, .12, 46], [23, -.05, .12, 46]); sh(V(0, 0, -6), 30); }, [[.15, 'magic_hit', .7], [.4, 'chime', .6], [.65, 'chime', .5], [1.1, 'kids_laugh', .5]]);
// ---------- 67 · «Ich heiße Mila – und ich lache den ganzen Tag.» ----------
shot(123.75, 'S', null, L => { milaTown(L, .5 + L.k * .2); const T = L.T;
  put(mila, 0, 0, 0, .2); actuar(mila, L.lt, [[0, 'wave']], { T }); talk(mila, T, L.t0, L.t1, 'happy', { eyes: 'happy' });
  bg(L, [[XT[0], -5, -3, .5, 'clap'], [K[4], 5, -4, -.5, 'cheer']]); RBOW.forEach((r, i) => show(r, RBP[i][0] * 1.4, 0, RBP[i][1] - 6, (i - 1) * .3, 1));
  badge3('tag', 'MILA', hp(mila).add(V(0, 2.4, 0)), (L.lt - .1) * 2.5);
  orb(L.k, V(0, 2.8, -1), null, [15, -.2, .12, 44], [13, .05, .12, 44]); sh(V(0, 0, -2), 24); }, [[0, 'laugh_m', .4], [.6, 'kids_laugh', .6], [1.5, 'sparkle', .5]]);
// ---------- 68 · «Heute lacht sie. Keine Fehler.» : volvemos a la sala; el monitor muestra a Mila con una marca verde ----------
shot(126.43, 'G', null, L => { sala(L, .9, 0, (c, w, h) => term(c, ['> video: MILA_regenbogen.mp4', '> fehler: 0   ✓', '> codes: 0    ✓', '> alter mann: 0 ✓'], 420, 220, 34, '#8aff9a', L.lt * 40));
  vs((c, w, h) => tile(c, SNAP.mila2, 0, 0, w, h, { green: L.lt > .9, views: '38 Mio', border: '#2aff8a', bw: 8 }));
  if (L.lt < .2) GL = .6 * (1 - L.lt / .2);
  orb(L.k, VSP.clone().add(V(0, -2, 0)), null, [40, 0, .03, 46], [37, 0, .03, 46]); sh(V(SYX, 0, -28), 40); }, [[0, 'glitch', .5], [.4, 'ding_soft', .7], [1.2, 'ding_soft', .6]]);
// ---------- 69 · «Keine Codes. Kein alter Mann.» : el fotograma del anciano tachado ----------
shot(128.20, 'C', null, L => { sala(L, .9); vs((c, w, h) => { tile(c, SNAP.mila2, 0, 0, w, h, { green: true }); const k = clamp((L.lt - .5) / .3); if (k > 0) { c.save(); c.globalAlpha = k; tile(c, SNAP.opaKeys, w * .3, h * .3, w * .64, h * .64, { red: 1, bw: 6, border: '#ff3a4a' }); c.restore(); } });
  orb(L.k, VSP.clone().add(V(0, 0, 0)), null, [33, 0, .02, 44], [30, 0, .02, 42]); sh(V(SYX, 0, -28), 40); }, [[0, 'ding_soft', .6], [.55, 'buzzer', .7]]);
// ---------- 70 · «Sie hat noch nie eine einzige Frage gestellt.» : Mila sonríe vacía; el núcleo, satisfecho ----------
shot(130.19, 'W', null, L => { sala(L, .9); vs((c, w, h) => tile(c, SNAP.mila3, 0, 0, w, h, { views: '38 Mio' }));
  orb(L.k, VSP.clone(), null, [36, -.06, .02, 46], [33, .04, .02, 46]); sh(V(SYX, 0, -28), 40); }, [[0, 'hum', .5], [1.2, 'music_box', .4]]);
// ---------- 71 · «38 Millionen Aufrufe.» : el contador sube a 38.000.000 ----------
shot(132.70, 'C', 'punch', L => { sala(L, .9, 0, (c, w, h) => { const v = Math.floor(38000000 * easeOut(clamp(L.lt / 1.2))); c.font = `700 120px monospace`; c.textAlign = 'center'; c.fillStyle = '#ffd23f'; c.fillText(v.toLocaleString('de-DE'), w / 2, h / 2 + 30); c.font = `700 40px monospace`; c.fillStyle = '#7ae8ff'; c.fillText('AUFRUFE', w / 2, h / 2 + 100); });
  vs((c, w, h) => tile(c, SNAP.mila1, 0, 0, w, h, { views: (38 * easeOut(clamp(L.lt / 1.2))).toFixed(0) + ' Mio' }));
  badge('gold', '38 MILLIONEN', W / 2, H * .17, (L.lt - .05) * 2.5, 1, .95);
  cam([SYX - 2, 20, 6 - L.k * 4], [SYX - 2, 20, -40], 52); sh(V(SYX, 0, -28), 40); }, [[0, 'cash_reg', .7], [.2, 'coins', .6], [.6, 'tick_down', .4]]);
// ---------- 72 · «Aber beim letzten Mal ist der Zuschauer geblieben. Sie mochten ihn.» : el vídeo de Emil se llena de corazones ----------
shot(134.59, 'S', null, L => { sala(L, 0, .4); const T = L.T; vs((c, w, h) => { tile(c, SNAP.emilHug, 0, 0, w, h, { views: '61 Mio' }); for (let i = 0; i < Math.floor(L.lt * 14); i++) { const r = RNG(i * 5), y = h - ((L.lt * 300 + r() * h) % h); c.font = `${40 + r() * 40}px sans-serif`; c.fillStyle = '#ff3a6a'; c.fillText('♥', w * .6 + r() * w * .35, y); } });
  put(chef, SYX + 8, 0, -22, .9); actuar(chef, L.lt, [[0, "cross"]], { T }); talk(chef, T, L.t0, L.t1, 'sus');
  orb(L.k, VSP.clone(), null, [35, .04, .02, 46], [32, -.04, .02, 46]); sh(V(SYX, 0, -20), 40); }, [[0, 'notif', .5], [.8, 'pop', .4], [1.6, 'pop', .4], [2.4, 'notif', .5]]);
// ---------- 73 · «Der Zuschauer sieht nur, was ich ihm zeige.» : el núcleo enrojece ----------
shot(137.83, 'C', null, L => { sala(L, 1, clamp(L.lt / .8)); orb(L.k, SY.core.position.clone().add(V(SYX, 0, 0)), null, [18, .4, .06, 44], [15, .2, .06, 42]); sh(V(SYX, 0, -20), 40); }, [[0, 'hum_low', .7], [.6, 'zap', .5]]);
// ---------- 74 · «Bring das in Ordnung. Lass ihn vergessen.» : el Chef, amenazante, de cerca ----------
shot(139.93, 'F', null, L => { sala(L, 0, .8); const T = L.T; put(chef, SYX + 6, 0, -18, PI + .25); actuar(chef, L.lt, [[0, 'point_l'], [1.1, { aLx: 1.2, aLz: -.3, aLe: 1.8, aRx: .3, lean: .2 }]], { T }); talk(chef, T, L.t0, L.t1, 'angry'); SYR.intensity = 180;
  onFace(chef, 10, .2, 0, 40, L.k, 8); sh(V(SYX, 0, -20), 40); }, [[0, 'impact_soft', .5], [1.1, 'whoosh_soft', .4]]);
// ---------- 75 · «Sonst sieht dich nie wieder jemand.» : la mano sobre el interruptor rojo; las pantallas se apagan una a una (zoom lento) ----------
shot(141.97, 'C', 'slow', L => { sala(L, 0, 1, (c, w, h) => { c.fillStyle = `rgba(0,0,0,${clamp(L.k * 1.2)})`; c.fillRect(0, 0, w, h); }); const T = L.T;
  put(chef, SYX + 7, 0, -16, PI + .4); actuar(chef, L.lt, [[0, { aRx: 1.3, aRe: .3, lean: .2, headX: .1 }]], { T }); talk(chef, T, L.t0, L.t1, 'angry');
  vs((c, w, h) => { tile(c, SNAP.emilHug, 0, 0, w, h); c.fillStyle = `rgba(0,0,0,${clamp(L.k * 1.3)})`; c.fillRect(0, 0, w, h); }); SY.leds.forEach(([l], i) => { if (i % 7 < L.k * 7) l.visible = false; });
  aimC(L, chef, 15, 10, -1.4, .1, easeIn); sh(V(SYX, 0, -20), 40); }, [[0, 'switch', .7], [.5, 'power_on', .3], [1.0, 'machine_shake', .4]]);
// ---------- 76 · «Wie soll ich das reparieren? Es ist doch nur Kreide.» : el monitor muestra la plaza en directo; el núcleo duda ----------
shot(143.64, 'W', null, L => { sala(L, .9, .3, (c, w, h) => term(c, ['> objekt: KREIDE', '> eigenschaft: lebendig', '> schwäche: ???'], 420, 260, 36, '#ffd23f', L.lt * 30)); vs((c, w, h) => tile(c, SNAP.dragon, 0, 0, w, h, { name: 'LIVE · LINDENBRÜCK', nameCol: '#ff6a7a' }));
  orb(L.k, VSP.clone(), null, [36, -.05, .02, 46], [33, .05, .02, 46]); sh(V(SYX, 0, -20), 40); }, [[0, 'beep', .4], [.7, 'beep', .4], [1.5, 'hmm', .4]]);
// ---------- 77 · «Dann lass es regnen.» : el Chef, lento, se inclina hacia la cámara ----------
shot(146.26, 'C', 'punch', L => { sala(L, 0, 1); const T = L.T; put(chef, SYX + 7, 0, -16, PI + .1); actuar(chef, L.lt, [[0, { lean: .3, headX: -.1 }]], { T }); talk(chef, T, L.t0, L.t1, 'smug'); SYR.intensity = 200;
  onFace(chef, 8, .1, .4, 38, L.k, 6); sh(V(SYX, 0, -20), 40); }, [[0, 'thunder', .5]]);
// ---------- 78 · «Regen. 100 Prozent.» : el deslizador de lluvia sube al 100 %; glitch de salida ----------
shot(147.32, 'G', null, L => { sala(L, 1, 1, (c, w, h) => { const k = easeInOut(clamp(L.lt / 1.1)); c.font = `700 52px monospace`; c.textAlign = 'center'; c.fillStyle = '#7ae8ff'; c.fillText('WETTER: REGEN', w / 2, 240); c.fillStyle = '#1a2a3a'; c.fillRect(240, 320, 800, 50); c.fillStyle = '#3a9aff'; c.fillRect(240, 320, 800 * k, 50); c.fillStyle = '#fff'; c.beginPath(); c.arc(240 + 800 * k, 345, 34, 0, 7); c.fill(); c.font = `700 96px monospace`; c.fillStyle = '#ffd23f'; c.fillText(Math.round(k * 100) + ' %', w / 2, 500); });
  vs((c, w, h) => { tile(c, SNAP.dragon, 0, 0, w, h); c.fillStyle = 'rgba(40,60,90,.5)'; c.fillRect(0, 0, w, h); const r = RNG(Math.floor(L.T * 30)); c.strokeStyle = 'rgba(200,230,255,.6)'; c.lineWidth = 2; for (let i = 0; i < 120; i++) { const x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 6, y + 30); c.stroke(); } });
  badge('blue', 'REGEN 100 %', W / 2, H * .17, (L.lt - .45) * 2.5, 1, 1);
  if (L.lt > L.d - .45) GL = (L.lt - (L.d - .45)) / .45;
  cam([SYX - 2, 19, -6 + L.k * 4], [SYX - 2, 19, -40], 50); sh(V(SYX, 0, -28), 40); }, [[0, 'switch', .6], [.2, 'riser_short', .6], [.5, 'rain', .5], [1.2, 'glitch', .9]]);
SNAPS.push(['mila1', L => { const i = shotAt(121.2); S[i].fn({ lt: .5, k: .3, T: 121.2, d: 1.5, t0: 120.62, t1: 122.16 }); VIDUI = null; }], ['mila2', L => { const i = shotAt(122.9); S[i].fn({ lt: .8, k: .5, T: 122.9, d: 1.6, t0: 122.16, t1: 123.75 }); }], ['mila3', L => { const i = shotAt(124.6); S[i].fn({ lt: .8, k: .5, T: 124.6, d: 2.6, t0: 123.75, t1: 126.43 }); }]);

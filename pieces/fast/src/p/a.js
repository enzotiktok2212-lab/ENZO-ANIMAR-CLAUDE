// ---------- a: gancho, la regla de los números, el pueblo del «fast», yo con un 7 (0 – 42 s) ----------
const sc_ = ch => ch.spec.scale || 1;
const headC = ch => hp(ch).add(V(0, .65 * sc_(ch), 0));
const runC = (ch, lt, x, z, ry, sp, T, o = {}) => caminar(ch, lt, { x, z, ry, speed: sp, run: true, accel: .05, T, y: o.y, extra: o.extra, stopAt: o.stopAt });
const walkC = (ch, lt, x, z, ry, sp = 3.4, T, o = {}) => caminar(ch, lt, { x, z, ry, speed: sp, accel: .1, T, y: o.y, extra: o.extra, stopAt: o.stopAt });
const SIT = { crouch: 1.0, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5 };
const FLEX = { aLx: 1.4, aLz: 1.0, aLe: 2.1, aRx: 1.4, aRz: 1.0, aRe: 2.1, lean: -.08, headX: -.05 };
const HANG = T => ({ aLx: 2.95, aRx: 2.95, aLz: .12, aRz: .12, aLe: .15, aRe: .15, lLx: .3 + Math.sin(T * 5) * .25, lRx: -.1 - Math.sin(T * 5) * .25, lLk: .6, lRk: .4, headX: -.12 });
const tramAt = (z) => show(TRAM, 26, 0, z, PI);
// dibujar el marcador del parcours
const sbDraw = (n, sub = 'SEIT 20 JAHREN', flash = false) => PC.SB.userData.draw('sb' + n + sub + flash, (c, w, h) => { c.fillStyle = '#05060c'; c.fillRect(0, 0, w, h); txt(c, 'KNOPF GEDRÜCKT', w / 2, 52, 50, '#ffd23f'); c.shadowColor = '#ff4a3a'; c.shadowBlur = 24; txt(c, String(n), w / 2, 170, 150, flash ? '#ffffff' : n ? '#5aff7a' : '#ff4a3a'); c.shadowBlur = 0; txt(c, sub, w / 2, 280, 40, '#ffffff'); c.fillStyle = 'rgba(255,255,255,.06)'; for (let y = 0; y < h; y += 6) c.fillRect(0, y, w, 2); });
// robar la fuerza: el orbe sale de encima de la cabeza y va a la mano del Beinahe-Mann
const steal = (from, k, o = ORB) => { const a = headC(from).add(V(0, 2.4 * sc_(from), 0)); const b = wpos(bm.aR.hand).add(V(0, -.8, 0)); const q = easeInOut(clamp(k)); show(o, 0, 0, 0, 0, lerp(.6, 1, q)).position.copy(arc(a, b, 2, q)); };
// número que baja a 0 (la fuerza robada)
const numDrop = (ch, k) => { const n0 = NV.get(ch); const v = Math.round(lerp(n0, 0, easeIn(clamp(k)))); num(ch, v, 1, v < 100 ? 'red' : 'zero'); };

// 1 «In dieser Stadt gewinnt jeder fast.» (zoom lento): carrera en la plaza; el corredor (950) cae a un palmo de la cinta de ZIEL; gente con números
shot(0, 'Z', 'slow', L => { town(); ZIELB.visible = true; folk(-6, -24, 70, 9, 42, L.T, 3, { face: V(-6, 0, -26), mode: 'cheer' }); const r = K[3]; NV.set(r, 950);
  const fall = clamp((L.lt - 1.35) / .4); const w = runC(r, Math.min(L.lt, 1.35), -6, -16, PI, 7.5, L.T); if (fall > 0) { r.root.position.z = -16 - 7.5 * 1.33 - fall * 1.2; applyPose(r, { lean: lerp(.4, 1.3, fall), aLx: 2.6, aRx: 2.8, aLe: .1, aRe: .1, lLx: -.4, lRx: .6, lRk: .8, crouch: fall * .6 }); r.root.position.y = -fall * .6; }
  num(r, 950); cara(r, L.T, { expr: fall > .3 ? 'shock' : 'determined' }); const k2 = put(K[6], -10.5, 0, -19, PI + .1); runC(k2, Math.min(L.lt, 1.35), -10.5, -12, PI, 6.4, L.T + 1); num(k2); cara(k2, L.T, { expr: 'determined' });
  const rp = r.root.position; orbit(V(rp.x - .3, lerp(4.4, 2.4, fall), rp.z), lerp(22, 14, easeOut(L.k)), PI + .05, lerp(.06, .2, fall), 46); sh(V(-6, 0, -26), 60); }, [[0, 'crowd_cheer', .6], [.1, 'steps_run', .5], [1.4, 'thud', .7], [1.5, 'crowd_ooh', .5]]);
// 2 «Außer mir.»: yo, el más pequeño, con un 7 rojo; los de alrededor (900+) me señalan y se ríen
shot(2.15, 'C', 'punch', L => { town(); folk(-6, -6, 50, 7, 36, L.T, 5); const c = put(ich, -6, 0, -6, 0); num(c, 7, (L.lt - .05) * 4); actuar(c, L.lt, [[0, 'idle'], [.15, 'shrug', { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  [[K[0], -9.6, -8.6, .6], [XT[4], -2.6, -8.8, -.6]].forEach(([k, x, z, ry], i) => { put(k, x, 0, z, ry); num(k); actuar(k, L.lt, [[0, i ? 'point_l' : 'point']], { T: L.T + i }); laughF(k, L.T + i); });
  orbit(headC(c).add(V(0, .6, 0)), lerp(14, 11, L.k), .05, .06, 44); sh(V(-6, 0, -6), 30); }, [[0, 'pop', .5], [.2, 'laugh_crowd', .5]]);
// 3–4 «AH! ALMOST, ALMOST, ALMOST!» (audio original): solo el corredor que perdió, sentado junto a la cinta, decepcionado, diciéndolo
shot(3.08, 'C', 'punch', L => { town(); ZIELB.visible = true; folk(-6, -24, 12, 10, 36, L.T, 7, { face: V(-6, 0, -27) }); const r = put(K[3], -6, 0, -27.6, PI); actuar(r, L.lt, [[0, { ...SIT, ...GEST.hands_head, crouch: 1.3 }], [1.1, { ...SIT, crouch: 1.3, aLx: .6, aRx: .6, aLe: 1.2, aRe: 1.2, headX: .15 }, { dur: .5 }]], { T: L.T, extra: { headY: Math.sin(L.T * 7) * .18 } }); r.root.position.y = -.2; num(r, 950); talk(r, L.T, 3.08, 5.26, 'sad');
  orbit(headC(r).add(V(0, -.3, 0)), lerp(13, 9, L.k), PI - .15 + L.k * .2, .1, 44); sh(V(-6, 0, -27), 30); }, [[0, 'groan', .5], [.4, 'crowd_ooh', .4], [1.4, 'sigh', .4]]);
// 5 «Hier hat jeder eine Zahl über dem Kopf:» grúa sobre la multitud: los números van saliendo uno a uno
shot(5.26, 'S', null, L => { town(); folk(-6, -12, 16, 3, 22, L.T, 11, { arc: [-PI, 0], max: 16 }); POST.push(() => BG.forEach((c, i) => { if (c.root.visible) num(c, NV.get(c), (L.lt - i * .08) * 4); }));
  cm([-6, 9, 14, -6, 5, -14, 50], [4, 15, 8, -7, 5, -16, 50], L.k); sh(V(-6, 0, -12), 40); }, [[0, 'pop', .5], [.3, 'pop', .4], [.6, 'pop', .4], [.9, 'pop', .4], [1.2, 'murmur', .4]]);
// 6 «seine Kraft.»: un vecino (860) saca bíceps y su número late
shot(7.32, 'C', 'punch', L => { town(); folk(-20, 10, 30, 9, 32, L.T, 13); const k = put(K[2], -20, 0, 10, .3); actuar(k, L.lt, [[0, 'idle'], [.1, FLEX, { dur: .3 }]], { T: L.T }); grin(k, L.T); num(k, 860, 1 + Math.sin(L.lt * 14) * .08);
  orbit(hp(k).add(V(0, .6, 0)), lerp(15, 12, L.k), .3 + L.k * .3, -.02, 44); sh(V(-20, 0, 10), 30); }, [[.1, 'flex', .6], [.3, 'power_on', .4]]);
// 7 «Die Straßenbahnfahrerin hat 870.»: ella delante de su tranvía amarillo, saluda; 870
shot(8.37, 'W', null, L => { town(); tramAt(44); const f = put(fahrerin, 26, 0, 28.6, PI); num(f, 870, (L.lt - .9) * 4); actuar(f, L.lt, [[0, 'idle'], [.3, 'wave', { dur: .3 }]], { T: L.T }); talk(f, L.T, 8.37, 11.1, 'happy');
  folk(26, 20, 16, 12, 30, L.T, 15); orbit(hp(f).add(V(0, -1, 0)), lerp(20, 15, L.k), PI + .35 - L.k * .3, .06, 46); sh(V(26, 0, 30), 40); }, [[0, 'tram_bell', .6], [.4, 'tram_hum', .4], [1.0, 'pop', .5]]);
// 8 «Trotzdem erreicht sie jeden Tag»: el tranvía avanza por la calle hacia la parada (travelling lateral)
shot(11.10, 'S', null, L => { town(); const z = lerp(70, 40, easeOut(L.k)); tramAt(z); const f = put(fahrerin, 26, 2.2, z - 11.5, PI); num(f, 870); actuar(f, L.lt, [[0, 'hold']], { T: L.T }); cara(f, L.T, { expr: 'happy' });
  cm([40, 8, z - 26, 26, 5, z - 10, 48], [39, 7, z - 30, 26, 5, z - 12, 48], L.k, x => x); sh(V(26, 0, z - 10), 40); }, [[0, 'tram_hum', .6], [.3, 'rails', .5], [1.0, 'tram_bell', .4]]);
// 9 «nur fast die Haltestelle.»: el tranvía frena a dos metros del cartel H; los que esperan se dan una palmada en la frente
shot(12.56, 'C', null, L => { town(); const zs = 24; const z = lerp(36, zs, easeOut(clamp(L.k * 1.6))); tramAt(z + 13); [[XT[0], 34, 10, -2.1], [XT[2], 35.4, 6.4, -2.0], [K[4], 33.6, 3, -2.3]].forEach(([k, x, zz, ry], i) => { put(k, x, 0, zz, ry); num(k); actuar(k, L.lt, [[0, 'idle'], [.55 + i * .1, i === 1 ? 'shrug' : 'facepalm', { dur: .3 }]], { T: L.T + i }); cara(k, L.T + i, { expr: L.lt > .6 ? 'bored' : 'neutral' }); });
  badge('red', '2 METER', W / 2, H * .2, (L.lt - .6) * 4, 1, .8); cm([24, 7, -14, 30.5, 4, 16, 46], [25, 6.5, -11, 30.5, 4, 16, 44], L.k); sh(V(30, 0, 12), 40); }, [[0, 'brakes', .6], [.5, 'tram_bell', .3], [.7, 'sigh', .5]]);
// 10 «Der Dönermann hat 920.»: el del döner corta carne del asador delante de su puesto; 920
shot(14.07, 'W', 'punch', L => { town(); const d = put(doenm, 37.6, 0, 40, -PI / 2); num(d, 920, (L.lt - .8) * 4); actuar(d, L.lt, [[0, { aRx: 1.2, aRe: 1.2 + Math.sin(L.T * 16) * .5, aLx: .9, aLe: 1.4, aLz: -.2 }]], { T: L.T }); grin(d, L.T); folk(36, 40, 16, 9, 26, L.T, 19);
  orbit(V(37.6, 5.6, 40), lerp(17, 14, L.k), -PI / 2 + .3 - L.k * .4, .05, 46); sh(V(38, 0, 40), 30); }, [[0, 'sizzle', .6], [.3, 'knife', .5], [.8, 'pop', .5]]);
// 11 «Er kommt fast bis zu deiner Tür.»: camina con el döner hacia mi puerta… tropieza en el último paso y el döner sale volando
shot(16.39, 'S', null, L => { town(); const tr = 1.05; const d = doenm; walkC(d, Math.min(L.lt, tr), 21, 80, -.72, 8, L.T); num(d, 920); const f = clamp((L.lt - tr) / .35);
  if (f > 0) { const dd = 8 * (tr - .05) + f * 1.6; d.root.position.x = 21 - Math.sin(.72) * dd; d.root.position.z = 80 + Math.cos(.72) * dd; applyPose(d, { lean: lerp(.2, 1.2, f), aLx: 2.4, aRx: 2.6, lLx: -.5, lRx: .8, crouch: f * .5 }); d.root.position.y = -f * .9; }
  cara(d, L.T, { expr: f > .2 ? 'shock' : 'happy' }); if (f <= 0) attach(DOENW, d.aR.hand, [0, -.6, .5], [0, 0, 0], 1); else { const p = arc(V(d.root.position.x - 1, 4, d.root.position.z + 1), V(12.6, .4, 92), 3, clamp(f * 1.2)); show(DOENW, p.x, p.y, p.z, 0).rotation.z = L.T * 8; }
  orbit(V(15.5, 4.5, 88.5), lerp(22, 18, L.k), .45 - L.k * .15, .1, 46); sh(V(16, 0, 92), 30); }, [[0, 'steps', .5], [1.05, 'trip', .6], [1.25, 'splat', .6]]);
// 12 «Mein bester Freund Jonas hat 990.»: Jonas posa con bíceps junto al coche de autoescuela; 990
shot(18.08, 'Z', 'punch', L => { town(); show(AUTO, -20, 0, 30, .5); const j = put(jonas, -15.4, 0, 33.6, .4); num(j, 990, (L.lt - 1.1) * 4); actuar(j, L.lt, [[0, 'wave'], [.6, FLEX, { dur: .3 }]], { T: L.T }); talk(j, L.T, 18.08, 18.7, 'smug'); if (L.lt > .7) grin(j, L.T);
  folk(-16, 30, 16, 12, 30, L.T, 21); orbit(hp(j).add(V(0, -.6, 0)), lerp(17, 13, L.k), .35 - L.k * .3, .06, 44); sh(V(-17, 0, 32), 30); }, [[0, 'car_idle', .4], [.6, 'flex', .5], [1.1, 'pop', .5]]);
// 13 «Er hat 37-mal»: Jonas al volante; el coche arrolla los conos de la prueba; «37×»
shot(20.89, 'W', null, L => { town(); const z = lerp(150, 132, L.k); show(AUTO, 26, 0, z, PI); const j = put(jonas, 25, 1.25, z - .2, PI); applyPose(j, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: .6, aRe: .6, headX: -.05 }); cara(j, L.T, { expr: L.lt > .5 ? 'shock' : 'determined' }); num(j, 990);
  CONES.forEach((c, i) => { const cz = 140 - i * 4, hit = z - 5 < cz; const t = clamp((cz - (z - 5)) / 6); show(c, 26 + (i % 2 ? 1.4 : -1.4) + (hit ? (i % 2 ? 4 : -4) * t : 0), hit ? 3 * Math.sin(t * PI) : 0, cz - (hit ? 3 * t : 0), 0).rotation.set(hit ? t * 4 : 0, 0, hit ? t * 3 : 0); });
  badge('red', '37×', W * .5, H * .56, (L.lt - .2) * 4, 1, 1); cm([16, 6, z - 16, 26, 3.5, z - 2, 46], [17, 5, z - 14, 26, 3.5, z, 46], L.k); sh(V(26, 0, z - 4), 30); }, [[0, 'car_drive', .6], [.4, 'cone_hit', .6], [.8, 'cone_hit', .5]]);
// 14 «fast den Führerschein bestanden.»: el profesor le enseña la hoja: Nr. 37 – NICHT BESTANDEN; Jonas se queda helado
shot(22.13, 'C', null, L => { town(); show(AUTO, 26, 0, 132, PI); const p = put(lehrer, 21.6, 0, 129, PI / 2 + .8); num(p); actuar(p, L.lt, [[0, { aRx: 1.5, aRe: .4, aLz: .1 }]], { T: L.T }); talk(p, L.T, 22.12, 23.85, 'sus'); POST.push(() => { const hpz = wpos(p.aR.hand); show(CLIP, hpz.x + .6, hpz.y - .4, hpz.z - .6, faceTo(hpz, camera.position)); });
  const j = put(jonas, 25.2, 0, 128.4, -PI / 2 - .8); num(j, 990); actuar(j, L.lt, [[0, 'idle'], [.4, 'shock', { dur: .3 }]], { T: L.T }); cara(j, L.T, { expr: 'shock' });
  orbit(V(23.3, 5, 128.3), lerp(17, 14, L.k), PI + .1 - L.k * .2, .08, 44); sh(V(23, 0, 129), 30); }, [[0, 'paper', .6], [.4, 'gasp', .5]]);
// 15–16 «AH! ALMOST ×3»: solo Jonas, junto al coche, hundido, diciéndolo
shot(23.87, 'C', 'punch', L => { town(); show(AUTO, 26, 0, 132, PI); const j = put(jonas, 25.4, 0, 127.6, -PI / 2 - .4); num(j, 990); actuar(j, L.lt, [[0, 'hands_head'], [1.1, 'slump', { dur: .5 }]], { T: L.T, extra: { headY: Math.sin(L.T * 7) * .15 } }); talk(j, L.T, 23.87, 26.01, 'sad');
  orbit(hp(j).add(V(0, -.3, 0)), lerp(12.5, 9, L.k), -PI / 2 - .5 + L.k * .2, .05, 44); sh(V(25, 0, 128), 20); }, [[0, 'groan', .4], [1.2, 'sigh', .4]]);
// 17 «Sogar meine Oma hat ihr Kreuzworträtsel»: la Oma en su sillón con el crucigrama y el lápiz; 640
shot(26.01, 'R', null, L => { use('OS'); inside(1, 40); const o = put(oma, OSX - 6, 2.75, -3, .5); num(o, 640, (L.lt - .4) * 4); actuar(o, L.lt, [[0, { ...SIT, aLx: 1.1, aRx: 1.3, aLe: 1.0, aRe: 1.2 + Math.sin(L.T * 12) * .15, aLz: -.2, aRz: -.3, headX: .3 }]], { T: L.T }); cara(o, L.T, { expr: 'confused', eyes: 'down' });
  show(KW, OSX - 6 + Math.sin(.5) * 2.2, 5.0, -3 + Math.cos(.5) * 2.2, .5, .7); KW.rotation.x = -.7; orbit(hp(o).add(V(0, -.6, 0)), lerp(15, 12, L.k), .5 + .3 - L.k * .4, .2, 46); sh(V(OSX - 6, 0, -3), 30); }, [[0, 'clock_tick', .5], [.4, 'pencil', .5], [1.2, 'hmm', .4]]);
// 18 «vor 25 Jahren fast gelöst.»: plano del crucigrama: falta UNA casilla (en rojo); «25 JAHRE»
shot(28.09, 'Z', 'punch', L => { use('OS'); inside(1, 40); const o = put(oma, OSX - 6, 2.75, -3, .5); num(o, 640); actuar(o, L.lt, [[0, { ...SIT, aLx: 1.1, aRx: 1.3, aLe: 1.0, aRe: 1.2, aLz: -.2, aRz: -.3, headX: .3 }]], { T: L.T }); cara(o, L.T, { expr: 'sad', eyes: 'down' });
  show(KW, OSX - 6 + Math.sin(.5) * 2.2, 5.0, -3 + Math.cos(.5) * 2.2, .5, .7); KW.rotation.x = -.7; const p = wpos(KW); badge('gold', '25 JAHRE', W / 2, H * .17, (L.lt - .1) * 4, 1, .9); const n = V(Math.sin(.5) * .75, .66, Math.cos(.5) * .75); const d = lerp(8, 5, easeOut(L.k)); cam([p.x + n.x * d, p.y + n.y * d, p.z + n.z * d], [p.x, p.y + .9, p.z], 44); sh(V(OSX - 6, 0, -3), 20); }, [[0, 'zoom_fast', .4], [.3, 'clock_tick', .5], [1.0, 'sigh_old', .4]]);
// 19 «Und ich?»: yo en la plaza, me señalo a mí mismo
shot(30.22, 'W', null, L => { town(); folk(-6, -6, 40, 8, 34, L.T, 23); const c = put(ich, -6, 0, -6, .1); num(c, 7); actuar(c, L.lt, [[0, { aRx: 1.3, aRz: -.6, aRe: 1.8 }]], { T: L.T }); talk(c, L.T, 30.22, 30.8, 'confused');
  orbit(headC(c), lerp(12, 10, L.k), -.25 + L.k * .2, .05, 44); sh(V(-6, 0, -6), 30); }, [[0, 'pop', .4]]);
// 20 «Ich habe 7.»: golpe de zoom al 7 rojo, que tiembla; sonrisa nerviosa
shot(30.80, 'C', 'punch', L => { town(); folk(-6, -6, 40, 8, 34, L.T, 23); const c = put(ich, -6, 0, -6, .1); num(c, 7, 1 + Math.sin(L.lt * 20) * .06); actuar(c, L.lt, [[0, 'shrug']], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' });
  const p = wpos(NUM.get(c)); orbit(p.add(V(0, -1.6, 0)), lerp(9, 7, L.k), .05, .1, 42); sh(V(-6, 0, -6), 20); }, [[0, 'buzzer', .5], [.3, 'boing', .4]]);
// 21 «Die kleinste Zahl der ganzen Stadt.»: yo delante del tablón «KRAFT-RANGLISTE»: 412.º, ICH, 7
shot(31.62, 'S', null, L => { town(); RANKB.visible = true; folk(4, -44, 30, 10, 34, L.T, 25); const c = put(ich, 7.4, 0, -45.2, PI + .7); num(c, 7); actuar(c, L.lt, [[0, { headX: -.35 }], [1.1, 'slump', { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  [[K[5], -2, -40, PI - .3]].forEach(([k, x, z, ry], i) => { put(k, x, 0, z, ry); num(k); actuar(k, L.lt, [[0, i ? 'cross' : 'point']], { T: L.T + i }); laughF(k, L.T + i); });
  cm([12, 6, -27, 4.6, 6.5, -49, 46], [6, 9, -25, 4.6, 7, -49, 46], L.k); sh(V(4, 0, -46), 30); }, [[0, 'whoosh', .4], [.5, 'laugh_crowd', .4], [1.3, 'sad_trombone', .4]]);
// 22 «Aber ich mache alles fertig.»: yo, decidido, puño arriba delante de mi casa; «FERTIG ✓»
shot(33.89, 'Z', 'punch', L => { town(); const c = put(ich, 18, 0, 97, PI / 2 - .3); num(c, 7); actuar(c, L.lt, [[0, 'fists'], [.3, { aRx: 2.9, aRz: .3, aRe: .3, aLx: .8, aLe: 1.6 }, { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  badge('green', 'FERTIG ✓', W / 2, H * .18, (L.lt - .35) * 4, 1, .9); orbit(headC(c).add(V(0, -.8, 0)), lerp(13, 10, L.k), PI / 2 - .3 + .5 - L.k * .6, -.05, 44); sh(V(18, 0, 97), 30); }, [[0, 'whoosh', .4], [.35, 'ding', .6]]);
// 23 «Jeden Teller.»: en la cocina rebaño el plato hasta dejarlo brillante
shot(35.52, 'W', null, L => { use('KU'); inside(1, 40); KU.milk.visible = false; const c = put(ich, KUX + 7.6, 0, 2, -PI / 2); applyPose(c, { aRx: 1.1, aRe: 1.0 + Math.sin(L.T * 14) * .35, aLx: .8, aLe: 1.1, headX: .45, lean: .15 }); cara(c, L.T, { expr: 'happy', eyes: 'down' }); num(c, 7);
  show(PLATE, KUX + 5, 4.31, 2, 0); PLATE.userData.food.scale.setScalar(Math.max(.01, 1 - L.k * 1.3)); orbit(hp(c).add(V(-1.2, -1.6, 0)), lerp(12, 10, L.k), -1.0 + L.k * .2, .85, 46); sh(V(KUX + 6, 0, 2), 20); }, [[0, 'fork', .5], [.4, 'fork', .5], [.8, 'sparkle', .5]]);
// 24 «Jedes Buch bis zur letzten Seite.»: leo en la cama hasta la última página: ENDE
shot(36.34, 'S', null, L => { use('ZI'); inside(.9, 40); const c = put(ich, ZIX + 13, 2.6, -2, 0); applyPose(c, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: 1.1, aRe: 1.1, headX: .35 }); cara(c, L.T, { expr: L.k > .7 ? 'joy' : 'neutral', eyes: L.k > .7 ? 'happy' : 'down' }); num(c, 7);
  POST.push(() => { const a = wpos(c.aL.hand), b = wpos(c.aR.hand); const m = a.clone().lerp(b, .5); show(BOOK, m.x, m.y - .5, m.z + .7, 0, .8); BOOK.rotation.x = .5; }); badge('tag', 'SEITE 498 / 498', W / 2, H * .18, (L.lt - .4) * 4); orbit(hp(c).add(V(0, -1.2, 0)), lerp(12, 9, L.k), -.4 + L.k * .5, .25, 44); sh(V(ZIX + 13, 0, -2), 20); }, [[0, 'pages', .6], [1.0, 'book_close', .6]]);
// 25 «Mit 8 Jahren ein Puzzle mit 5000 Teilen,»: yo de pequeño (8 años) en el suelo con un puzle enorme; pongo la última pieza
shot(38.47, 'Z', null, L => { use('ZI'); inside(.8, 45); show(PUZZ, ZIX - 2, .08, 1.5); PUZZ.rotation.set(-PI / 2, 0, 0); const c = put(klein, ZIX - 2, 0, -4.4, 0); applyPose(c, { crouch: 1.0, lLx: 1.4, lRx: 1.4, lLk: 2.2, lRk: 2.2, lean: .5, aRx: 1.4, aRe: .4, headX: .3 }); c.root.position.y = -.3; cara(c, L.T, { expr: 'determined', eyes: 'down' }); num(c, 7);
  const q = clamp(L.lt / 1.6); show(PIECE, lerp(ZIX - 1.4, ZIX - 1.6, q), lerp(1.6, .16, easeIn(q)), lerp(-2.6, 1.6, q), 0); badge('big', '5000 TEILE', W / 2, H * .17, (L.lt - .2) * 4, 1, .85); badge('tag', '8 JAHRE', W / 2, H * .25, (L.lt - .6) * 4);
  cm([ZIX + 1, 6, 6, ZIX - 2, 2, -3.4, 46], [ZIX, 5, 5, ZIX - 2, 2, -3.6, 44], L.k); sh(V(ZIX - 2, 0, 4), 20); }, [[0, 'puzzle', .6], [.8, 'puzzle', .5], [1.8, 'click', .6]]);
// 26 «in einer Nacht.»: la cámara sube del puzle terminado a la ventana con la luna; el pequeño se estira y bosteza
shot(40.98, 'S', null, L => { use('ZI'); inside(.7, 40); show(PUZZ, ZIX - 2, .08, 2); PUZZ.rotation.set(-PI / 2, 0, 0); const c = put(klein, ZIX - 2, 0, -4.4, .3); applyPose(c, { aRx: 2.8, aLx: 2.8, aRe: .6, aLe: .6, headX: -.2 }); cara(c, L.T, { expr: 'yawn' }); num(c, 7);
  badge('tag', '1 NACHT', W / 2, H * .18, (L.lt - .3) * 4); cm([ZIX + 2, 8, 9, ZIX - 2, 2, -2, 48], [ZIX - 2, 10, 8, ZIX - 10, 8, -14, 48], L.k); sh(V(ZIX - 2, 0, 4), 20); }, [[0, 'yawn', .5], [.4, 'owl', .4]]);

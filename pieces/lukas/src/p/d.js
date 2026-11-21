// ---------- d: 5000 Lukasse, Gerhard, el garaje, «Fehler!», todos se llaman Leon, el final (97,44 – 129,9 s) ----------
const BFACE = V(SX - 34, 16, 26);          // la cabina, hacia donde se gira la grada
const DETS = { row: 1, col: 2 };            // el Neuer en la grada: fila 1, columna 2
const detSeat = () => { const row = DETS.row, col = DETS.col; return V(SX - 23.3 - row * 2.6, 1.6 + row * 1.6, -18 + col * 4.2 + (row % 2) * 2.1); };
const standsT = (L, o = {}) => stands(L, { list: CROWD.filter(c => c !== det), cols: 6, skip: (x, z, r, c) => r === DETS.row && c === DETS.col, ...o });
const GP = V(GX, 0, -8);                    // montaña de paquetes en el garaje
function garagePile(L, gone = 0) { PKGS.forEach((q, i) => { if (i < gone) return; const r = RNG(i * 5 + 1); const x = GP.x - 5 + (i % 6) * 2.1 + (r() - .5) * .5, z = GP.z - 3 + Math.floor(i / 6) % 2 * 2.6 + (r() - .5) * .6, y = Math.floor(i / 12) * 1.5; show(q, x, y, z, (r() - .5) * .5, .8); });
  KONS.forEach((k, i) => show(k, GP.x - 3 + i * 5, 3.2, GP.z + 1.2, .3 - i * .5, .8)); SNEAK.forEach((s, i) => show(s, GP.x + 2 + i * 1.4, 3.1, GP.z + 2, 1 + i, .9)); }
const shouldersS = (L, p) => { const a = put(EX[22], p.x - 1.2, 0, p.z, -PI / 2), b = put(EX[23], p.x + 1.2, 0, p.z, -PI / 2); [a, b].forEach((c, i) => { c.root.position.set(p.x, 0, p.z + (i ? 1.2 : -1.2)); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: i ? .2 : -.1, aRz: i ? -.1 : .2, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(c, L.T + i); });
  return put(me, p.x + .3, 5.6 + Math.abs(Math.sin(L.T * 5)) * .3, p.z, -PI / 2); };
const LEONS = c => c.setTag(GIRLS.has(c) ? 'LEONIE' : 'LEON');

// 80 «Fünftausend Lukasse»: toda la grada se gira a la vez hacia la cabina; «5000»
shot(97.44, 'F', null, L => { stadium(L); standsT(L, { turnAt: L.t0 + .1, face: BFACE, expr: 'shock' }); const d = put(det, ...detSeat().toArray(), PI / 2); actuar(d, 0, [[0, { aLx: .2, aRx: .2 }]], { T: L.T }); cara(d, L.T, { expr: 'neutral' });
  cm([SX - 4, 14, -24], [SX - 6, 13, -21], L.k); camera.lookAt(SX - 30, 6, 4); camera.fov = 50; badge('gold', '5000', W / 2, H * .15, clamp((L.lt - .2) / .15), 1, .95); sh(V(SX - 30, 0, -6), 34); }, [[0, 'whoosh_soft', .45], [.15, 'crowd_run', .45]]);
// 81 «drehten sich gleichzeitig um.»: desde la cabina: miles de caras mirándome
shot(99.02, 'W', null, L => { stadium(L); standsT(L, { turned: true, face: BFACE, expr: 'shock' }); const d = put(det, ...detSeat().toArray(), PI / 2); cara(d, L.T, { expr: 'neutral' }); actuar(d, 0, [[0, {}]], { T: L.T });
  cm([SX - 30, 19, 30], [SX - 28, 18, 27], L.k); camera.lookAt(SX - 30, 4, -6); camera.fov = 52; sh(V(SX - 30, 0, -6), 34); }, [[0, 'murmur', .45]]);
// 82 «Alle, außer einem.» (zoom lento): todos mirando a la cabina… menos uno, que sigue mirando el partido
shot(100.64, 'S', 'slow', L => { stadium(L); standsT(L, { turned: true, face: BFACE, expr: 'shock' }); const dp = detSeat(); const d = put(det, dp.x, dp.y, dp.z, PI / 2); actuar(d, 0, [[0, { aLx: .3, aRx: .3, headY: .1 }]], { T: L.T }); cara(d, L.T, { expr: 'happy', mouth: 'smile' });
  cm([SX - 26, 16, 28], [dp.x + 3, dp.y + 5, dp.z + 9], L.k, easeIn); camera.lookAt(dp.x, dp.y + 3, dp.z); camera.fov = lerp(46, 30, easeIn(L.k)); sh(dp, 20); }, [[0, 'heartbeat', .5]]);
// 83 «Polizist Lukas packte ihn.»: el policía le agarra del brazo en la grada
shot(101.99, 'C', 'punch', L => { stadium(L); standsT(L, { turned: true, face: V(SX - 26, 4, -9), expr: 'shock', mode: 'point' }); const dp = detSeat(); const d = put(det, dp.x, dp.y, dp.z, -.5 + PI / 2); actuar(d, 0, [[0, { ...GEST.cower, headY: -.3 }]], { T: L.T }); cara(d, L.T, { expr: 'scared' }); sweat(d, L.T);
  put(pol, dp.x + 1.6, dp.y, dp.z - 1.8, -PI / 2 + PI + .6 - PI); pol.root.rotation.y = faceTo(pol.root.position, d.root.position); actuar(pol, 0, [[0, { aRx: 1.5, aRz: -.6, aRe: .5, aLx: 1.3, aLz: -.3, aLe: .6, lean: .1 }]], { T: L.T }); cara(pol, L.T, { expr: 'angry', mouth: 'grimace' });
  orbit(V(dp.x + .8, dp.y + 3.2, dp.z - .8), 11, PI / 2 - .3, .1, 44); sh(dp, 16); }, [[0, 'cloth', .55], [.2, 'slap', .4], [.5, 'murmur', .35]]);
// 84 «Wie heißt du wirklich?»: el policía, muy serio
shot(103.69, 'Z', null, L => { stadium(L); const dp = detSeat(); const c = put(pol, dp.x + 1.6, dp.y, dp.z - 1.8, PI / 2 + .5); actuar(c, 0, [[0, { aRx: 1.5, aRz: -.6, aRe: .5, lean: .1, headY: -.2 }]], { T: L.T }); talk(c, L.T, 103.6, 104.4, 'angry');
  onFace(c, 4.4, .2, -.4, 40, L.k, 3.9); sh(dp, 12); }, [[0, 'hmm', .35]]);
// 85 «Ähm…»: él suda, mira a un lado
shot(104.43, 'C', null, L => { stadium(L); const dp = detSeat(); const c = put(det, dp.x, dp.y, dp.z, PI / 2 - .4); actuar(c, 0, [[0, { aRx: 1.8, aRz: -.6, aRe: 2.2, headY: .3, headZ: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'side_r', mouth: 'wavy' }); sweat(c, L.T, 3);
  onFace(c, 4.2, .1, .3, 40, L.k, 3.6); sh(dp, 12); }, [[0, 'hmm', .45]]);
// 86 «Gerhard.»: su placa ya dice la verdad: GERHARD
shot(105.24, 'C', 'punch', L => { stadium(L); const dp = detSeat(); const c = put(det, dp.x, dp.y, dp.z, PI / 2 - .4); c.setTag('GERHARD'); actuar(c, 0, [[0, { aLx: .2, aRx: .2, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', eyes: 'down', mouth: 'frown' });
  bubble(c, 'Gerhard…', clamp(L.lt / .1), 1.4); onBody(c, 6.8, .1, .06, 40, L.k, 6.2); sh(dp, 12); }, [[0, 'sad_tone', .45]]);
// 87 «In seiner Garage lag alles.»: el portón del garaje: una montaña de paquetes; el policía y yo, boquiabiertos
shot(105.87, 'F', null, L => { garageS(L); garagePile(L); show(GIFT, GP.x + 1, 4.6, GP.z - .5, .2, .7);
  put(pol, GX - 4, 0, 6, PI + .3); actuar(pol, 0, [[0, GEST.point]], { T: L.T }); cara(pol, L.T, { expr: 'shock', mouth: 'o' }); put(me, GX + 3.6, 0, 6.4, PI - .3); actuar(me, 0, [[0, GEST.shock]], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'open_smile' });
  cm([GX + 1, 7.4, 22], [GX + .6, 6.6, 18.5], L.k); camera.lookAt(GX, 3.6, -4); camera.fov = 48; sh(V(GX, 0, -2), 20); }, [[0, 'garage_door', .6], [.4, 'ding_reveal', .45]]);
// 88 «Jedes Paket, jede Konsole…»: los vecinos recuperan sus cosas, felices
shot(107.54, 'S', null, L => { garageS(L); garagePile(L, 8); show(GIFT, GP.x + 1, 4.6, GP.z - .5, .2, .7); const p = V(GX, 0, 5);
  const a = walkTo(BOYZ[2], p.x - 2, p.z - 1, .4, 1.6, L, 0, 7); grin(a, L.T); attach(PKGS[0], a.aR.hand, [0, -1.4, .9], [0, 0, 0], .5);
  const b = put(GIRLX[1], p.x + 2.4, 0, p.z + 1, -.3); actuar(b, 0, [[0, GEST.hold]], { T: L.T }); laughF(b, L.T); attach(PKGS[1], b.aL.hand, [.4, -.6, .6], [0, 0, 0], .45);
  const c = put(BOYZ[4], p.x + 5.5, 0, p.z - 2, -.6); actuar(c, 0, [[0, GEST.cheer]], { T: L.T }); laughF(c, L.T + 2); attach(KONS[0], c.aR.hand, [0, .5, .5], [0, 0, 0], .5);
  orb(L.k, V(p.x + 1.5, 3, p.z), null, [15, .1, .12, 46], [13, -.05, .1, 46]); sh(p, 18); }, [[0, 'box_slide', .45], [.3, 'cheer', .4]]);
// 89 «und die Kopfhörer von meiner Schwester.»: saco la caja rosa «Für Mia 6» del montón
shot(109.12, 'W', null, L => { garageS(L); garagePile(L, 10); const p = V(GX + .5, 0, -1.5); const m = put(me, p.x, 0, p.z, .1); actuar(m, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.25, aRz: -.25, aLe: .6, aRe: .6, lean: -.05 }]], { T: L.T }); grin(m, L.T);
  show(GIFT, p.x + .1, 2.4 + Math.sin(L.T * 6) * .05, p.z + 1.6, .1, .65);
  orb(L.k, V(p.x, 2.8, p.z + 1), null, [10.5, .3, .1, 42], [9, .15, .08, 42]); sh(p, 14); }, [[0, 'box_slide', .4], [.3, 'sparkle', .45]]);
// 90 «Meine Kopfhörer!»: mi hermana, con sus cascos rosas puestos, feliz; corazones
shot(111.06, 'C', null, L => { town(L); const b = put(bru, STREET.x, Math.abs(Math.sin(L.T * 8)) * .3, STREET.z, .1); actuar(b, 0, [[0, { aLx: 2.7, aRx: 2.7, aLz: .4, aRz: .4, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(b, L.T);
  attach(KOPF, b.head, [0, .55, 0], [0, 0, 0], .82); hearts(V(STREET.x, 4.4, STREET.z), L.T); bubble(b, 'Meine Kopfhörer!', clamp(L.lt / .1), 1.8);
  onBody(b, 9, .1, .12, 42, L.k, 8); sh(STREET, 12); }, [[0, 'kids_laugh', .45], [.2, 'sparkle', .4]]);
// 91 «Und das ganze Stadion fing an zu rufen:»: en el campo, me suben a hombros; la grada aplaude
shot(112.11, 'Z', null, L => { stadium(L); standsT(L, { mode: 'cheer', face: V(SX, 4, 0) }); const p = V(SX - 12, 0, 2); const m = shouldersS(L, p); actuar(m, 0, [[0, { lLx: 1.4, lRx: 1.4, lLk: 1.3, lRk: 1.3, aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5 }]], { T: L.T }); laughF(m, L.T);
  orb(L.k, V(p.x, 5.4, p.z), null, [18, -PI / 2 + .3, .08, 46], [15, -PI / 2 + .1, .06, 46]); sh(p, 22); }, [[0, 'cheer', .55], [.4, 'stadium', .4]]);
// 92 «rufen:»: los niños levantan la pancarta FEHLER… ahora con orgullo
shot(113.27, 'S', null, L => { stadium(L); const p = V(SX - 10, 0, -10); show(FSIGN, p.x, 1.6, p.z, -PI / 2, .9); [KIDS[8], KIDS[9]].forEach((k, i) => { put(k, p.x + .6, Math.abs(Math.sin(L.T * 7 + i)) * .3, p.z + (i ? -3.06 : 3.06), -PI / 2); actuar(k, 0, [[0, { aLx: 2.5, aRx: 2.5, aLe: .4, aRe: .4 }]], { T: L.T }); laughF(k, L.T + i); });
  hearts(V(p.x, 8, p.z), L.T); orb(L.k, V(p.x, 5, p.z), null, [17, -PI / 2 - .1, .06, 46], [15, -PI / 2, .05, 46]); sh(p, 18); }, [[0, 'cheer', .5], [.4, 'kids_laugh', .35]]);
// 93 «Fehler!»: yo a hombros, brazos arriba, confeti
shot(114.55, 'C', 'punch', L => { stadium(L); const p = V(SX - 12, 0, 2); const m = shouldersS(L, p); actuar(m, 0, [[0, { lLx: 1.4, lRx: 1.4, lLk: 1.3, lRk: 1.3, ...GEST.cheer }]], { T: L.T }); laughF(m, L.T); confetti(V(p.x, 4, p.z), L.t0, L.T, 60, 1);
  const h = hp(m); cm([h.x - 8.5, h.y - 2.4, h.z + 1], [h.x - 7.6, h.y - 2.2, h.z + .8], L.k); camera.lookAt(h.x, h.y - .8, h.z); camera.fov = 44; sh(p, 14); }, [[0, 'shout_crowd', .5], [.1, 'confetti', .45]]);
// 94 «Fehler!»: la grada grita, plano bajo
shot(115.29, 'C', 'punch', L => { stadium(L); standsT(L, { mode: 'shout', face: V(SX, 4, 0) });
  cm([SX - 14, 4, -2], [SX - 14.6, 4, -1.6], L.k); camera.lookAt(SX - 30, 8, -4); camera.fov = 52; fireworks(V(SX - 40, 14, -10), L.T, 3, 14); sh(V(SX - 28, 0, -4), 26); }, [[0, 'shout_crowd', .5], [.3, 'firework', .4]]);
// 95 «Fehler!»: vista aérea del estadio con fuegos artificiales
shot(116.09, 'C', 'punch', L => { stadium(L); standsT(L, { mode: 'cheer', face: V(SX, 4, 0) }); fireworks(V(SX, 10, -40), L.T, 3, 16);
  cm([SX + 30, 30, 34], [SX + 26, 27, 30], L.k); camera.lookAt(SX - 18, 6, -4); camera.fov = 52; sh(V(SX - 18, 0, 0), 40); }, [[0, 'firework', .5], [.2, 'cheer', .45]]);
// 96 «Seitdem will niemand mehr Lukas heißen.»: en la plaza, todos se arrancan su placa LUKAS
shot(116.83, 'F', null, L => { town(L); const p = V(-8, 0, 14); const off = L.lt > .6; crowdAt(L, p.x, p.z, 16, 3, 12, 96, { mode: off ? 'shrug' : 'idle', list: BOYZ, full: true, tag: off ? null : 'LUKAS', expr: 'neutral' });
  const c = put(EX[0], p.x, 0, p.z + 3, 0); c.setTag(null); actuar(c, 0, [[0, { aRx: lerp(1.0, 2.6, easeOut(clamp(L.lt / .4))), aRz: lerp(-.75, .4, easeOut(clamp(L.lt / .4))), aRe: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  const rh = wpos(c.aR.hand); show(TAGBIG, rh.x, rh.y + .4, rh.z + .3, 0, .3); TAGBIG.userData.set('LUKAS', L.lt > .5);
  orb(L.k, V(p.x, 2.8, p.z + 3), null, [14, .1, .12, 44], [12, 0, .1, 44]); sh(p, 18); }, [[0, 'tape_rip', .55], [.5, 'paper', .4]]);
// 97 «Alle Jungs wollen jetzt Leon heißen.»: los chicos, con placas nuevas: LEON
shot(118.84, 'W', null, L => { town(L); const p = V(-8, 0, 14); crowdAt(L, p.x, p.z, 16, 3, 12, 97, { mode: 'cheer', list: BOYZ, full: true, tag: 'LEON' }); const c = put(BOYZ[5], p.x, 0, p.z + 3, 0); c.setTag('LEON'); actuar(c, 0, [[0, { aLx: .9, aLz: -.75, aLe: 2.0, aRx: 2.7, aRz: .4, aRe: .3 }]], { T: L.T }); grin(c, L.T);
  confRain(V(p.x, 0, p.z), L.T, 50, 22, 18, 16); orb(L.k, V(p.x, 2.6, p.z + 3), null, [14, .1, .12, 44], [12, 0, .1, 44]); sh(p, 18); }, [[0, 'tape', .5], [.3, 'cheer', .5]]);
// 98 «Die Mädchen Leonie.»: las chicas, delante de la fuente: LEONIE
shot(120.62, 'S', null, L => { town(L); const c = V(-18, 0, -14); const g = GIRLX[0]; put(g, c.x, 0, c.z, .3); g.setTag('LEONIE'); actuar(g, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .35, aRe: .5, aLx: .9, aLz: -.75, aLe: 2.0 }]], { T: L.T }); grin(g, L.T);
  crowdAt(L, c.x, c.z - 3, GIRLX.length - 1, 4.5, 10, 98, { mode: 'cheer', list: GIRLX.slice(1), tag: 'LEONIE', gap: 1.1 });
  orb(L.k, V(c.x, 3.2, c.z), null, [13, .45, .16, 44], [11, .3, .12, 44]); sh(c, 20); }, [[0, 'kids_laugh', .45], [.3, 'tape', .4]]);
// 99 «Der Polizist Leon.»: el policía, con su placa LEON, saluda militarmente
shot(121.68, 'C', 'punch', L => { town(L); const p = V(24, 0, 24); const c = put(pol, p.x, 0, p.z, -.2); c.setTag('LEON'); actuar(c, 0, [[0, { aRx: 2.8, aRz: -.6, aRe: 2.3, headX: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'grin' });
  onBody(c, 8.6, .05, .06, 42, L.k, 7.6); sh(p, 14); }, [[0, 'whistle', .45], [.2, 'pop', .4]]);
// 100 «Sogar die Katze.»: el gato, con su placa nueva LEON, maúlla
shot(123.17, 'Z', 'punch', L => { town(L); const DP = V(16.3, 0, 113); show(CAT, DP.x, 0, DP.z, -.4, 1); CAT.userData.tag('LEON'); CAT.userData.head.rotation.x = Math.sin(L.T * 4) * .1; CAT.userData.tail.rotation.x = Math.sin(L.T * 6) * .4;
  orb(L.k, V(DP.x, 1.8, DP.z), null, [7.6, -.4, .1, 40], [6.4, -.3, .08, 40]); sh(DP, 10); }, [[0, 'meow', .6]]);
// 101 «Deshalb heißt jetzt in dieser Stadt»: el cartel de la entrada, repintado: LEONHAUSEN – 5000 Leons
shot(124.48, 'S', null, L => { town(L); WS.userData.set('Leons', 'LEONHAUSEN'); welcomeKids(L, 'LEON', 'LEONIE');
  orb(L.k, SIGNP, null, [24, .2, .04, 42], [27, .28, .05, 42]); sh(SIGNP, 26); }, [[0, 'brush', .5], [.4, 'ding_soft', .4]]);
// 102 «jeder Leon…»: Mama, Papa, mi hermana, el Hausmeister, el dependiente… todos LEON / LEONIE
shot(125.88, 'C', 'punch', L => { town(L); const p = V(-8, 0, 30); [[mama, -3.6, 0], [papa, -1.2, -.7], [lehr, 1.2, -.7], [mut, 3.6, 0]].forEach(([c, dx, dz], i) => { put(c, p.x + dx, 0, p.z + dz, -dx * .06); LEONS(c); actuar(c, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9 + i) * .3, aRe: .4 }]], { T: L.T }); grin(c, L.T + i); });
  put(bru, p.x - .3, 0, p.z + 2.2, 0); LEONS(bru); actuar(bru, 0, [[0, GEST.cheer]], { T: L.T }); laughF(bru, L.T); show(CAT, p.x + 2.4, 0, p.z + 2.8, -.3, .8); CAT.userData.tag('LEON');
  orb(L.k, V(p.x, 3.4, p.z), null, [17, 0, .1, 46], [15, 0, .08, 46]); sh(p, 16); }, [[0, 'cheer', .5], [.2, 'meow', .4]]);
// 103 «und ich hab meinen Namen gerade»: yo, pensativo, entre tanto Leon
shot(126.95, 'W', null, L => { town(L); const p = V(-10, 0, 24); const m = put(me, p.x, 0, p.z, .15); m.setTag(null); actuar(m, 0, [[0, GEST.think]], { T: L.T }); cara(m, L.T, { expr: 'sus', eyes: 'side_l', mouth: 'wavy' });
  crowdAt(L, p.x, p.z, 12, 4.5, 10, 103, { mode: 'idle', expr: 'happy' }); CROWD.forEach(LEONS);
  onBody(m, 9.5, .1, .08, 42, L.k, 8.5); sh(p, 14); }, [[0, 'hmm', .45], [.6, 'tick', .35]]);
// 104 «in Lukas geändert.»: me pego la placa LUKAS y guiño a cámara
shot(128.13, 'Z', null, L => { town(L); const p = V(-10, 0, 24); const m = put(me, p.x, 0, p.z, .15); const on = L.lt > .35; m.setTag(on ? 'LUKAS' : null);
  actuar(m, L.lt, [[0, { aRx: 1.0, aRz: -.25, aRe: .9 }], [.35, { aLx: .9, aLz: -.75, aLe: 2.0, aRx: 2.7, aRz: .5, aRe: .3 }, { dur: .2 }]], { T: L.T }); cara(m, L.T, on ? { expr: 'wink', eyes: 'wink', mouth: 'smirk' } : { expr: 'smug' });
  if (!on) { attach(TAGBIG, m.aR.hand, [0, -.6, .5], [-1.5, 0, 0], .3 / .82); TAGBIG.userData.set('LUKAS'); }
  crowdAt(L, p.x, p.z, 12, 4.5, 10, 103, { mode: 'idle', expr: 'happy' }); CROWD.forEach(LEONS);
  onBody(m, 8.5, .1, .06, 40, L.k, 6.8); sh(p, 14); }, [[.35, 'tape', .55], [.5, 'ding_reveal', .45]]);

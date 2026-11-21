// ---------- a: gancho, la cárcel, el número sobre la cabeza (0 – 15,65 s) ----------
const walkC = (ch, lt, x, z, ry, sp = 3.4, T, extra) => caminar(ch, lt, { x, z, ry, speed: sp, accel: .05, T, extra });
const crowdWalk = (L, list, x0, z0, ry, nums, sp = 3.2) => list.forEach((c, i) => { const r = RNG(i * 13 + 5); walkC(c, L.lt + r() * .4, x0 + (i % 4 - 1.5) * 4 + (r() - .5) * 1.5, z0 - Math.floor(i / 4) * 5 + r() * 2, ry + (r() - .5) * .3, sp * (.85 + r() * .3), L.T + i);
  if (nums) num(c, nums[i % nums.length], 1); cara(c, L.T + i, { expr: 'smile' }); });
// 1 «In dieser Stadt kommst du»: un preso con su 1353 corre hacia cámara por la plaza; tres policías y dos drones le persiguen; los del 0 se apartan y miran
shot(0, 'Z', 'slow', L => { town(); crowdOn(L.T, 'sway', 90); NUMX.forEach(s => s.visible = false); const z = -50 + L.lt * 8.5; caminar(haeft, L.lt + .4, { x: -4, z: -53.4, ry: 0, speed: 8.5, run: true, accel: .05, T: L.T }); num(haeft, 1353, 1); cara(haeft, L.T, { expr: 'panic', eyes: 'terror', mouth: 'scream' }); sweat(haeft, L.T, 2);
  COP.slice(0, 3).forEach((c, i) => { caminar(c, L.lt + .4, { x: -4 + (i - 1) * 3.2, z: -61 - (i % 2) * 2, ry: 0, speed: 8.5, run: true, accel: .05, T: L.T + i }); cara(c, L.T, { expr: 'shout', mouth: 'talk_wide' }); });
  [[K[0], -11, -40], [XT[0], 3.4, -38], [K[4], -11.4, -30], [XT[1], 4, -28], [K[6], -12, -22], [XT[3], 4.6, -20]].forEach(([c, x, zz], i) => { put(c, x, 0, zz, x < -4 ? PI / 2 - .3 : -PI / 2 + .3); actuar(c, L.lt, [[0, i % 2 ? 'shock' : 'point']], { T: L.T + i }); num(c, 0, 1); cara(c, L.T, { expr: 'gasp' }); });
  const hz = haeft.root.position.z; DRONES.slice(0, 2).forEach((d, i) => { show(d, -4 + (i ? 3 : -3), 12 + i, hz - 3 - i * 2); d.userData.spin(L.T + i); d.userData.beam(true, 11 + i); });
  cam([-4, 6, hz + lerp(26, 19, easeIn(L.k))], [-4, 3.8, hz - 2], 46); sh(V(-4, 0, hz - 4), 40); }, [[0, 'siren', .5], [.1, 'drone', .5], [.3, 'steps_run', .6], [.5, 'shout_m', .4]]);
// 2 «fürs Goonen»: le alcanzan: dos policías le agarran y el 1353 rojo brilla; la gente con su 0 le señala
shot(1.2, 'W', 'punch', L => { town(); const m = put(haeft, -12, 0, -20, .3); num(m, 1353, 1); actuar(m, L.lt, [[0, 'recoil'], [.3, 'cower', { dur: .3 }]], { T: L.T, extra: shiver(L.T, 1) }); cara(m, L.T, { expr: 'scared', eyes: 'terror', mouth: 'grimace_wide' }); sweat(m, L.T, 2);
  [[COP[0], -1], [COP[1], 1]].forEach(([c, s], i) => { put(c, -12 + s * 2.9, 0, -20.8, .3 - s * 1.3); actuar(c, L.lt, [[0, { aLx: 1.4, aRx: 1.4, aLe: .4, aRe: .4, lean: .15 }]], { T: L.T + i }); cara(c, L.T, { expr: 'angry' }); });
  [[K[2], -19, -12, .8], [XT[1], -5, -11, -.6], [K[4], -16, -9, .5]].forEach(([c, x, z, ry], i) => { put(c, x, 0, z, ry + PI); c.root.rotation.y = faceTo(c.root.position, V(-12, 0, -20)); actuar(c, L.lt, [[0, i === 1 ? 'shock' : 'point']], { T: L.T + i }); num(c, 0, 1); cara(c, L.T, { expr: 'shock' }); });
  const d = DRONES[0]; show(d, -12, 12, -21); d.userData.spin(L.T); d.userData.beam(true, 11.5);
  orb(L.k, V(-12, 3.4, -18), null, [19, .25, .12, 48], [17, .18, .1, 48]); sh(V(-12, 0, -18), 30); }, [[0, 'impact', .5], [.05, 'pling', .4], [.2, 'gasp_f', .4], [.4, 'cuffs', .5]]);
// 3 «ins Gefängnis» (zoom lento): el coche de policía llega al Goon-Knast al atardecer; el foco de la torre barre la entrada
shot(1.98, 'F', 'slow', L => { use('KN'); sunset(); KN.SPOT.intensity = 1800; KN.beam.visible = true; KN.beam.rotation.set(.9, Math.sin(L.T * 1.2) * .5 - .5, 0);
  const c = PCAR[0]; const z = lerp(36, 6, easeOut(clamp(L.lt / 1.0))); show(c, KX + 3, 0, z, PI); c.userData.set(L.T);
  const p = put(haeft, KX - 3, 0, -9 + L.lt * 2, PI); caminar(p, L.lt, { x: KX - 2, z: 2, ry: PI, speed: 3, T: L.T, extra: { aLx: .3, aRx: .3, aLz: -.3, aRz: -.3, headX: .3 } }); num(p, 1353, 1);
  put(COP[2], KX - 4.4, 0, 3.4 - L.lt * 3, PI - .2); caminar(COP[2], L.lt, { x: KX - 4.6, z: 4.4, ry: PI, speed: 3, T: L.T });
  cm([KX + 18, 6, 44, KX, 9, -14, 46], [KX + 12, 5, 30, KX, 10, -14, 44], L.k); sh(V(KX, 0, 0), 50); }, [[0, 'flash', .4], [.1, 'siren', .5], [.6, 'door_slam', .5]]);
// 4 «Drei Jahre Goon-Knast»: en la celda, el preso agarrado a los barrotes; palitos en la pared y cartel 3 JAHRE
shot(3.28, 'C', 'punch', L => { use('ZL'); inside(.9, 40); const p = put(haeft, ZLX + .75, 0, 5.2, 0); num(p, 1353, 1); applyPose(p, { aLx: 1.9, aRx: 1.9, aLz: .3, aRz: .3, aLe: .8, aRe: .8, headX: .15, lean: .08 }); mitts(p); cara(p, L.T, { expr: 'sad', eyes: 'down', mouth: 'frown' });
  badge('red', '3 JAHRE', W / 2, H * .3, (L.lt - .1) * 3, 1, .85); cm([ZLX + 1.4, 5.2, 17, ZLX + .75, 4.6, 4, 44], [ZLX + .9, 4.8, 13.5, ZLX + .75, 4.8, 4, 42], L.k); sh(V(ZLX, 0, 4), 20); }, [[0, 'metal_hit', .5], [.2, 'sigh', .4]]);
// 5 «und so lange musst du»: intenta comer con las manoplas de piedra: la cuchara se le cae
shot(4.76, 'W', null, L => { use('ZL'); inside(.9, 40); const p = put(haeft, ZLX - 3, 0, -4.6, .2); num(p, 1353, 1); mitts(p); const k = Math.sin(L.lt * 6) * .2;
  applyPose(p, { aRx: 1.3 + k, aRe: 1.2, aRz: -.2, aLx: .9, aLe: 1.2, aLz: -.3, headX: .25, lean: .1, crouch: .1 }); cara(p, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(p, L.T, 1);
  const f = clamp((L.lt - .45) / .4); show(TBOX[0], ZLX - 3, 2.9, -2.4, 0, .01); const w = loc(p, 1.4, 2.6 - f * 2.4, 2.2); show(CASH[0], w.x, Math.max(.1, w.y), w.z, f * 4);
  orb(L.k, V(ZLX - 3, 3.6, -4), null, [12, .2, .16, 44], [11, .3, .14, 44]); sh(V(ZLX, 0, -4), 20); }, [[0, 'swipe', .4], [.5, 'clack', .5], [.8, 'sigh', .3]]);
// 6 «Fäustlinge aus Stein tragen»: golpe de las manoplas de piedra contra el banco: polvo
shot(5.86, 'R', 'punch', L => { use('ZL'); inside(.9, 40); const p = put(haeft, ZLX - 3, 0, -4.4, .1); num(p, 1353, 1); mitts(p); const hit = clamp((L.lt - .2) / .15);
  applyPose(p, { aLx: lerp(2.4, 1.1, hit), aRx: lerp(2.4, 1.1, hit), aLe: .4, aRe: .4, lean: lerp(-.1, .3, hit), headX: .2, crouch: .15 * hit }); cara(p, L.T, { expr: hit > .9 ? 'shock' : 'angry' }); 
  badge('tag', 'STEIN', W / 2, H * .2, (L.lt - .4) * 3); orb(L.k, V(ZLX - 3, 3.0, -3.6), null, [13, .7, .2, 44], [12, .6, .2, 44]); sh(V(ZLX, 0, -4), 20); }, [[0, 'whirl', .3], [.33, 'slam', .7], [.36, 'thud', .5]]);
// 7 «Und erwischt wird hier jeder»: un dron de la policía baja sobre la plaza y su foco barre a la gente, que se aparta
shot(7.54, 'Z', null, L => { town(); const d = DRONES[0]; show(d, -8 + Math.sin(L.T) * 3, 15 - L.k * 2, -12); d.userData.spin(L.T); d.userData.beam(true, 14);
  [K[0], XT[2], K[6], XT[4], K[1]].forEach((c, i) => { const a = i / 5 * 6.28; put(c, -8 + Math.cos(a) * 6, 0, -12 + Math.sin(a) * 5, a + PI / 2); actuar(c, L.lt, [[0, i % 2 ? 'cower' : 'shock']], { T: L.T + i }); num(c, 0, 1); cara(c, L.T, { expr: 'scared' }); });
  orb(L.k, V(-8, 8, -12), null, [26, .4, .18, 50], [23, .3, .2, 50]); sh(V(-8, 0, -12), 30); }, [[0, 'zoom_in', .4], [.1, 'drone', .6], [.4, 'scan', .5]]);
// 8 «Denn über deinem Kopf steht»: a un vecino le aparece de golpe un 3 rojo encima; se tapa la cabeza
shot(9.33, 'W', 'punch', L => { town(); const c = put(K[3], -24, 0, 6, .4); num(c, 3, (L.lt - .25) * 4); actuar(c, L.lt, [[0, 'idle'], [.3, 'hands_head', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: L.lt > .3 ? 'shock' : 'smile' });
  onFace(c, 11, -1.4, .6, 42, L.k, 10); sh(V(-24, 0, 6), 30); }, [[0, 'swipe', .3], [.25, 'pling', .6], [.4, 'gasp_f', .4]]);
// 9 «wie oft du es getan hast»: una mujer pasa con un 7 enorme; los demás se giran y se ríen
shot(10.57, 'S', null, L => { town(); walkC(XT[3], L.lt, 18, -30, -PI / 2 - .2, 2.6, L.T); num(XT[3], 7, 1); cara(XT[3], L.T, { expr: 'worried', eyes: 'side_l' }); sweat(XT[3], L.T, 2);
  [[K[7], 12, -37], [K[2], 20, -37]].forEach(([c, x, z], i) => { put(c, x, 0, z, faceTo(V(x, 0, z), V(14, 0, -30))); actuar(c, L.lt, [[0, i ? 'point' : 'hands_face']], { T: L.T }); num(c, 0, 1); laughF(c, L.T + i); });
  orb(L.k, V(16, 3.4, -30), V(14.6, 3.4, -30), [15, -.5, .1, 46], [14, -.6, .1, 46]); sh(V(12, 0, -30), 30); }, [[0, 'swipe', .4], [.3, 'laugh_m', .4], [.6, 'kids_laugh', .3]]);
// 10 «Deshalb läuft hier jeder Erwachsene»: travelling por la plaza: todos caminan con su 0 verde, sacando pecho
shot(12.01, 'F', null, L => { town(); crowdWalk(L, [K[0], XT[0], K[1], XT[1], K[5], XT[4], K[6], XT[2]], -8, -30, 0, [0], 3.0); const x = lerp(-18, -2, easeInOut(L.k));
  cam([x, 6, 4 - L.k * 3], [-8, 3, -26], 50); sh(V(-8, 0, -8), 30); }, [[0, 'flash', .3], [.1, 'steps', .5], [.8, 'murmur', .3]]);
// 11 «mit einer stolzen Null»: Herr Pfeiffer saca pecho y se señala su 0 brillante con los pulgares
shot(13.65, 'Z', 'punch', L => { town(); const c = put(pfeif, -6, 0, 10, .2); num(c, 0, 1); actuar(c, L.lt, [[0, 'idle'], [.1, { aLx: 1.6, aRx: 1.6, aLz: .2, aRz: .2, aLe: 2.3, aRe: 2.3, lean: -.18, headX: -.15 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', eyes: 'half', mouth: 'smirk' });
  onFace(c, 10, -1.2, .8, 42, L.k, 9); sh(V(-6, 0, 10), 30); }, [[0, 'impact_soft', .5], [.2, 'sparkle', .5], [.5, 'hmm', .3]]);

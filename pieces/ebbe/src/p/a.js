// ---------- a: gancho, la noche de las escaleras, el amanecer, el fondo marino, Herr Brösel, la regla, las gaviotas (0 – 34,1 s) ----------
// helpers de esta pieza
function walk(ch, L, x, z, ry, sp = 2.4, i = 0, o = {}) { const d = sp * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, (o.y ?? 0) + Math.abs(Math.sin(L.T * 9 + i)) * .1, z + Math.cos(ry) * d, ry); actuar(ch, 0, [[0, { ...walkP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); if (o.expr !== false) cara(ch, L.T + i, { expr: o.expr || 'neutral', mouth: o.mouth }); return ch; }
function run(ch, L, x, z, ry, sp = 9, i = 0, o = {}) { const d = sp * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, (o.y ?? 0) + Math.abs(Math.sin(L.T * 13 + i)) * .35, z + Math.cos(ry) * d, ry); actuar(ch, 0, [[0, { ...runP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); cara(ch, L.T + i, { expr: o.expr || 'shock', mouth: o.mouth || 'o' }); return ch; }
function pose(ch, x, y, z, ry, L, p = {}, expr = 'neutral', ex = {}) { put(ch, x, y, z, ry); actuar(ch, 0, [[0, typeof p === 'string' ? p : { headY: Math.sin(L.T * .9 + ch.seed) * .12, ...p }]], { T: L.T }); cara(ch, L.T, { expr, ...ex }); return ch; }
// subir por una escalera de MW.LEIT[i] (k = 0 abajo … 1 arriba), mirando al acantilado
function onLadder(ch, i, k, L, j = 0, o = {}) { const l = MW.LEIT[i], p = l.userData.at(clamp(k)); put(ch, p.x, p.y - 1.2 * (ch.spec.scale || 1), p.z + 1.6, PI); actuar(ch, 0, [[0, climbP(L.T * (o.sp ?? 1), j)]], { T: L.T, weight: false }); ch.blob.visible = false; cara(ch, L.T + j, { expr: o.expr || 'determined', mouth: o.mouth || 'o' }); return ch; }
const LX = i => MW.LEIT[i].position.x;
// el mar bajando por el acantilado (k 0 = lleno … 1 = seco)
function seaDrop(L, k, t = 'dawn') { kueste(L, { t, sea: 1, seaY: lerp(26, 0, easeInOut(k)) }); }
const SHIP = () => MW.SCHIFF.userData.ship;
const mastP = (i, k) => SHIP().userData.mast(i, k);
function rings(c, k, n = 4, R = 120, y = 1) { RINGS.forEach((r, i) => { if (i >= n) return; const q = (k * 1.2 - i * .18); if (q <= 0 || q > 1) return; r.visible = true; r.position.set(c.x, c.y + y, c.z); r.rotation.x = PI / 2; r.scale.setScalar(4 + q * R); r.material.opacity = .45 * (1 - q); }); }

// 1 «In dieser Stadt zieht sich»: GANCHO. Amanecer dorado; el pueblo entero en el paseo, apoyado en la barandilla; bajo ellos el mar se vacía de golpe por el acantilado
// (se ven aparecer las escaleras y las rocas). Golpe de zoom + zoom lento hacia la gente que señala y celebra.
shot(0, 'C', 'hook', L => { kueste(L, { t: 'dawn', sea: 1, seaY: lerp(40, 6, easeInOut(L.k)) }); crowdBox(L, -20, 18, -6.2, -8.8, 16, 3, { y: CH, mode: i => ['point', 'cheer', 'shock', 'point', 'cheer', 'look'][i % 6], face: V(20, CH, 40), jit: .3 });
  pose(jonte, 4, CH, -5.9, .5, L, { aRx: 1.5, aRz: .1, aRe: .1, headX: .25 }, 'shock', { mouth: 'o' }); MOEW.fly(L.T, V(-10, CH - 6, 30), V(1, .1, .2), { lt: L.lt, n: 8, speed: 12, sx: 40, sy: 10, sz: 20 });
  cm([24, CH + 15, 10, -2, CH + 2, -8, 48], [19, CH + 13, 6, -2, CH + 3, -8, 44], L.k); SHC = V(2, CH, -4); }, [[0, 'water_drain', .9], [.3, 'crowd_gasp', .6]]);
// 2 «alle hundert Jahre»: Opa junto a la placa de piedra de la última Ebbe («1926 · 2026»): 100 Jahre
shot(1.62, 'Z', 'punch', L => { kueste(L, { t: 'dawn', sea: 1, seaY: 8 }); show(PLAQ, -34, CH + 5, -9, .25, .55);
  pose(opa, -29, CH, -8, -.35, L, { aRx: 1.3, aRz: -.3, aRe: .2, headY: -.3 }, 'warm', { mouth: 'smile' }); pose(jonte, -24.5, CH, -7.4, -.5, L, { headY: .3 }, 'happy', { mouth: 'open_smile' });
  orb(L.k, V(-28, CH + 4.4, -8), null, [11, .15, .04, 46], [9, -.05, .03, 46]); badge('gold', '100 JAHRE', W / 2, H * .22, (L.lt - .1) * 3); }, [[.1, 'ding_reveal', .7]]);
// 3 «das Meer zurück»: plano aéreo de la costa: el agua se retira hacia el horizonte dejando la arena al descubierto
shot(2.46, 'W', null, L => { kueste(L, { t: 'dawn', sea: lerp(.85, .4, L.k), seaY: 0 }); cm([-160, 170, 160, 0, 0, 420, 52], [-120, 160, 200, 0, 0, 520, 52], L.k); MOEW.fly(L.T, V(-40, 70, 220), V(.3, 0, 1), { lt: L.lt, n: 10, speed: 6, s: 1.6 }); }, [[0, 'wave_retreat', .8]]);
// 4 «Einen ganzen Tag lang»: el sol sube sobre el fondo marino brillante; la gente baja ya por las escaleras
shot(3.28, 'F', null, L => { kueste(L, { t: 'dawn', sea: .2 }); for (let i = 3; i < 8; i++) onLadder(NB[i], i, .35 + (i % 3) * .2 + L.k * .1, L, i, { expr: 'happy', mouth: 'open_smile' });
  cm([-20, 8, 90, 10, 30, 0, 50], [-10, 14, 80, 10, 34, 0, 50], L.k); badge('tag', '1 TAG', W / 2, H * .2, (L.lt - .15) * 3); }, [[.1, 'clock_tick', .6]]);
// 5 «Und du kannst über den Meeresboden laufen»: Jonte salta del último peldaño a la arena mojada y corre mar adentro; sus botas dejan huellas
shot(4.6, 'S', null, L => { kueste(L, { t: 'dawn', sea: .1 }); const x = LX(6); const jk = clamp(L.lt / .5);
  if (jk < 1) { put(jonte, x, arc([0, 6, 15], [0, 0, 19], 3, jk).y, lerp(15, 19, jk), 0); actuar(jonte, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: .5, aRz: .5, lLx: .6, lRx: .2, lLk: 1, lRk: .6 }]], { T: L.T }); cara(jonte, L.T, { expr: 'happy', mouth: 'open_smile' }); jonte.root.position.x = x; }
  else { run(jonte, { ...L, lt: L.lt - .5 }, x, 19, 0, 7, 0, { expr: 'happy', mouth: 'open_smile' }); dust(V(x, 0, 19), L.T0 ?? L.t0 + .5, L.T, 8, .6); }
  crowdBox(L, x - 34, x - 18, 24, 40, 5, 9, { mode: 'walk', expr: 'happy' }); cm([x + 8, 3, 46, x, 3, 22, 44], [x + 5, 4, 40, x, 2, 26, 44], L.k); }, [[.45, 'splash_step', .7], [.8, 'footsteps_sand', .5]]);

// 6 «In der Nacht davor»: noche en el paseo, farolas encendidas; vecinos cargan escaleras de madera entre faroles
shot(6.53, 'I', null, L => { kueste(L, { t: 'night', sea: 1, seaY: 12 }); lp(0, -6, CH + 10, -12, 70, 0xffb060, 50); lp(1, 10, CH + 10, -16, 60, 0xffb060, 50);
  for (let i = 0; i < 3; i++) { const c = walk(NB[i], L, -14 + i * 9, -18 + i * 3, PI / 2, 2.2, i, { y: CH, expr: 'happy' }); const l = LADS[i]; attach(l, c.aR.hand, [0, -.4, 0], [0, 0, PI / 2 - .2], .6); }
  pose(papa, 6, CH, -14, -PI / 2 + .4, L, { aLx: 1.6, aLe: .4 }, 'happy', { mouth: 'open_smile' }); attach(LANTS[0], papa.aL.hand, [0, -.8, 0]);
  cm([-24, CH + 8, 6, 0, CH + 3, -16, 48], [-18, CH + 7, 2, 2, CH + 3, -16, 48], L.k); }, [[0, 'night_crickets', .6], [.3, 'wood_creak', .6]]);
// 7 «die ganze Stadt»: plano general nocturno: decenas de faroles en la barandilla, cuerdas y escaleras bajando por todo el acantilado
shot(7.53, 'Z', null, L => { kueste(L, { t: 'night', sea: 1, seaY: 12 }); crowdBox(L, -120, 120, -6.5, -9, 30, 5, { y: CH, mode: i => i % 3 ? 'look' : 'point', face: V(0, 0, 60) });
  for (let i = 0; i < 6; i++) { show(LANTS[i], -100 + i * 40, CH + 3.6, -5, 0); lp(i % 4, -100 + i * 40, CH + 6, -2, 40, 0xffb060, 40); }
  cm([60, 70, 160, 0, 30, -10, 54], [40, 64, 140, 0, 32, -10, 52], L.k); }, [[0, 'crowd_murmur', .5]]);
// 8 «Leitern an die Klippen»: desde abajo, a la luz de los faroles, las escaleras se apoyan una tras otra en la roca
shot(8.23, 'R', null, L => { kueste(L, { t: 'night', sea: 1, seaY: 2 }); const x = LX(5); MW.LEIT.forEach((l, i) => { if (i >= 4 && i <= 8) { const k = clamp(L.k * 3 - (i - 4) * .4); l.rotation.x = (1 - easeOut(k)) * .5; } });
  crowdBox(L, x - 30, x + 30, -6.5, -8, 6, 7, { y: CH, mode: 'point', face: V(x, 0, 40) }); lp(0, x, CH + 6, 2, 80, 0xffb060, 70); lp(1, x - 26, CH + 6, 2, 60, 0xffb060, 60);
  cm([x + 4, 3, 46, x, 30, 0, 50], [x + 2, 4, 40, x, 34, 0, 50], L.k); SHC = V(x, 25, 6); }, [[.1, 'wood_clack', .7], [.5, 'wood_clack', .6]]);

// 9 «Bei Sonnenaufgang»: el sol asoma sobre el mar; el pueblo despierta en el paseo con tazas y mantas
shot(9.36, 'F', 'slow', L => { kueste(L, { t: 'dawn', sea: 1, seaY: 3 }); crowdBox(L, -14, 14, -6.4, -9, 10, 11, { y: CH, mode: i => i % 3 ? 'look' : 'wave', face: V(0, CH, 60), jit: .25 });
  cm([0, CH + 2, 16, 0, CH + 4, -8, 48], [0, CH + 2.6, 12, 0, CH + 4.4, -8, 44], L.k); }, [[0, 'birds_dawn', .4]]);
// 10 «ist das Wasser einfach weg»: a ras de arena: el agua se escurre hacia el mar a toda velocidad, peces saltando en los charcos
shot(10.47, 'P', null, L => { kueste(L, { t: 'dawn', sea: lerp(.25, .05, L.k), seaY: lerp(1.2, 0, L.k) }); cm([10, 2.2, 40, 0, 1, 140, 40], [10, 2.6, 52, 0, 1, 160, 40], L.k);
  crowdBox(L, -12, 18, 28, 34, 3, 13, { mode: 'look', face: V(0, 0, 200), expr: 'shock' }); }, [[0, 'water_drain', .9]]);
// 11 «Kilometer um Kilometer»: vuelo de dron sobre el fondo marino infinito; arena con ondas, charcos que reflejan el cielo y el barco pirata a lo lejos
shot(11.78, 'Z', null, L => { kueste(L, { t: 'dawn' }); cm([0, 90, 60, 0, 0, 600, 56], [0, 120, 160, 0, 0, 900, 56], L.k); MOEW.fly(L.T, V(0, 80, 260), V(0, 0, 1), { lt: L.lt, n: 6, speed: 8, s: 1.6 }); badge('big', 'KILOMETER', W / 2, H * .2, (L.lt - .1) * 3); }, [[0, 'wind_soft', .7]]);
// 12 «Die Leute laufen zwischen alten Schiffswracks»: familias paseando junto a la proa oxidada de un carguero hundido
shot(13.5, 'C', null, L => { kueste(L, { t: 'day' }); crowdBox(L, -76, -44, 150, 190, 9, 21, { mode: i => i % 4 === 3 ? 'point' : 'walk', ry: i => .3, speed: 2, expr: 'happy' });
  walk(papa, L, -54, 182, .4, 2.2, 1, { expr: 'happy', mouth: 'open_smile' }); cm([-30, 7, 205, -60, 12, 165, 52], [-36, 8, 210, -60, 13, 165, 52], L.k); }, [[0, 'footsteps_sand', .6], [.2, 'metal_creak', .5]]);
// 13 «Schiffswracks herum»: contrapicado bajo el casco oxidado; un niño golpea el metal y suena hueco
shot(14.83, 'W', null, L => { kueste(L, { t: 'day' }); pose(NB[3], -58, 0, 178, PI - .3, L, { aRx: 2.2 + Math.sin(L.T * 14) * .3, aRe: .4 }, 'happy', { mouth: 'open_smile' }); pose(NB[8], -54, 0, 182, PI + .5, L, { aLx: 1.5 }, 'shock', { mouth: 'o' });
  cm([-26, 2.5, 206, -58, 14, 172, 56], [-28, 2, 204, -58, 18, 170, 56], L.k); }, [[.2, 'metal_bang', .7]]);
// 14 «Die Kinder klettern auf Riffe»: niños trepando por un arrecife cubierto de corales
shot(15.92, 'S', null, L => { kueste(L, { t: 'day' }); const R = MW.RIFFE[0].position; [NB[3], NB[8], NB[13]].forEach((c, i) => { put(c, R.x - 4 + i * 4, 6 + i * 5 + L.k * 3, R.z + 9 - i, PI + (i - 1) * .2); actuar(c, 0, [[0, climbP(L.T, i)]], { T: L.T, weight: false }); c.blob.visible = false; cara(c, L.T, { expr: 'happy', mouth: 'open_smile' }); });
  cm([R.x + 6, 6, R.z + 40, R.x, 14, R.z, 50], [R.x + 8, 10, R.z + 36, R.x, 18, R.z, 50], L.k); }, [[0, 'kids_laugh', .6]]);
// 15 «höher sind als ihre Häuser»: grúa hacia arriba: los niños saludan en la cima, el arrecife más alto que el tejado de una casa (pueblo detrás, lejos)
shot(17.18, 'Z', 'punch', L => { kueste(L, { t: 'day' }); const R = MW.RIFFE[1].position; [NB[13], NB[18]].forEach((c, i) => { pose(c, R.x - 3 + i * 6, 36, R.z, PI - .2 + i * .4, L, i ? { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5 } : 'wave', 'happy', { mouth: 'open_smile' }); c.blob.visible = false; });
  cm([R.x + 10, 4, R.z - 60, R.x, 24, R.z, 54], [R.x + 6, 12, R.z - 52, R.x, 34, R.z, 50], L.k); }, [[.1, 'cheer_kids', .6]]);

// 16 «Herr Brösel hat eine Schatztruhe»: Brösel cava junto a un pecio y asoma un cofre
shot(18.46, 'I', null, L => { kueste(L, { t: 'day' }); const c = V(80, 0, 400); show(TRUHE, c.x, -1.6 + L.k * 1.4, c.z, -.3); pose(broesel, c.x - 3.6, 0, c.z + 3, .9, L, { crouch: .5, lean: .5, aLx: 1.6 + Math.sin(L.T * 9) * .5, aRx: 1.6 - Math.sin(L.T * 9) * .5, headX: .3 }, 'happy', { mouth: 'open_smile' });
  dust(V(c.x, 0, c.z + 1), L.t0, L.T, 10, .5); orb(L.k, V(c.x - 1, 2.6, c.z + 1), null, [16, .7, .2, 44], [13, .5, .16, 44]); }, [[0, 'dig_sand', .7], [.5, 'dig_sand', .6]]);
// 17 «gefunden»: levanta la tapa: un destello dorado… (expectación)
shot(19.86, 'F', 'punch', L => { kueste(L, { t: 'day' }); const c = V(80, 0, 400); show(TRUHE, c.x, -.2, c.z, -.3); TRUHE.userData.lid.rotation.x = -easeOut(clamp(L.lt / .35)) * 1.9;
  pose(broesel, c.x - 1.5, 0, c.z + 4.5, PI * .85, L, { aLx: 1.8, aRx: 1.8, aLe: .5, aRe: .5, lean: .2 }, 'shock', { mouth: 'o' }); grade.uniforms.flash.value = Math.max(0, .5 - L.lt * 1.5);
  onFace(broesel, 6, .4, -2, 42, L.k); broesel.root.rotation.y = PI * .85; }, [[0, 'chest_open', .8], [.1, 'sparkle', .6]]);
// 18 «Sie war voller Algen»: dentro del cofre: solo algas verdes chorreando
shot(20.42, 'C', null, L => { kueste(L, { t: 'day' }); const c = V(80, 0, 400); show(TRUHE, c.x, -.2, c.z, -.3); TRUHE.userData.lid.rotation.x = -1.9;
  cm([c.x + 1, 6, c.z + 4, c.x, 1.8, c.z, 40], [c.x + 1, 5, c.z + 3.2, c.x, 1.8, c.z, 38], L.k); badge('green', 'ALGEN', W / 2, H * .24, (L.lt - .15) * 3); }, [[.1, 'squish', .7]]);
// 19 «Trotzdem strahlt er»: Brösel levanta un puñado de algas como si fuera oro y ríe
shot(21.52, 'R', null, L => { kueste(L, { t: 'day' }); const c = V(80, 0, 400); show(TRUHE, c.x, -.2, c.z, -.3); TRUHE.userData.lid.rotation.x = -1.9;
  pose(broesel, c.x - 1, 0, c.z + 4, PI * .9 + PI, L, { aLx: 3, aRx: 3, aLz: .3, aRz: .3, aLe: .3, aRe: .3, lean: -.1 }, 'joy'); laughF(broesel, L.T); broesel.root.rotation.y = .3;
  onFace(broesel, 7, .6, 0, 44, L.k); }, [[0, 'laugh_old', .6], [.2, 'sparkle', .5]]);

// 20 «Und es gibt nur eine Regel»: el cartel en el paseo; zoom lento
shot(22.76, 'B', 'slow', L => { kueste(L, { t: 'day' }); crowdBox(L, -76, -44, -15, -20, 4, 17, { y: CH, mode: 'walk', ry: () => PI / 2, expr: 'neutral' });
  cm([-60, CH + 6, 16, -60, CH + 7, -12, 46], [-60, CH + 7, 8, -60, CH + 7, -12, 46], L.k); }, []);
// 21 «Vor Sonnenuntergang zurück an Land»: atardecer, Opa da golpecitos con el dedo en el cartel; reloj del cartel en rojo
shot(24.09, 'G', null, L => { kueste(L, { t: 'dusk' }); pose(opa, -67, CH, -10, .7, L, { aRx: 1.5, aRz: .2, aRe: .2 + Math.max(0, Math.sin(L.T * 10)) * .2, headY: .5 }, 'determined'); talk(opa, L.T, 24, 26, 'determined');
  cm([-70, CH + 7, 8, -62, CH + 6, -12, 50], [-71, CH + 6.5, 5, -62, CH + 6, -12, 48], L.k); badge('red', 'VOR SONNENUNTERGANG!', W / 2, H * .2, (L.lt - .2) * 3, 1, .8); }, [[.2, 'knock_wood', .7]]);
// 22 «Denn dann kommt das Meer nach Hause»: atardecer: el mar vuelve, sube suave por el pie del acantilado, las escaleras ya recogidas
shot(26.06, 'P', null, L => { kueste(L, { t: 'dusk', sea: 1, seaY: lerp(2, 9, L.k) }); MW.LEIT.forEach(l => l.visible = false); crowdBox(L, -30, 30, -7.5, -10, 8, 19, { y: CH, mode: 'look', face: V(0, 0, 400) });
  cm([30, 14, 90, 0, 24, 0, 52], [24, 16, 80, 0, 26, 0, 52], L.k); }, [[0, 'waves_shore', .8]]);
// 23 «Aber jetzt kommt das Seltsame»: tejados del pueblo por la mañana: una gaviota en una chimenea gira la cabeza… zoom lento
shot(27.53, 'Z', 'slow', L => { kueste(L, { t: 'day' }); const c = V(-60, CH + 24, -36); MOEW.fly(L.T, c, V(0, 0, 0), { n: 3, speed: 0, sx: 10, sy: 1, sz: 4, glide: true, s: 1.3 });
  cm([-46, CH + 27, -6, -60, CH + 23, -36, 46], [-50, CH + 26, -16, -60, CH + 23.5, -36, 40], L.k); }, [[0, 'gull_call', .6]]);
// 24 «Heute Morgen sind alle Möwen»: de golpe todas despegan a la vez de los tejados
shot(29.2, 'W', null, L => { kueste(L, { t: 'day' }); MOEW.fly(L.T * (.6 + L.k), V(-20, CH + 26, -40), V(0, .3, -1), { lt: L.lt, n: 44, speed: 14, sx: 120, sy: 14, sz: 30 });
  cm([20, CH + 12, 10, -20, CH + 34, -60, 56], [16, CH + 10, 14, -20, CH + 40, -70, 56], L.k); }, [[0, 'wings_flap', .8], [.1, 'gulls_flock', .7]]);
// 25 «der Stadt ins Landesinnere geflogen»: plano general: la bandada se aleja tierra adentro sobre los tejados, el mar a la espalda
shot(30.74, 'S', null, L => { kueste(L, { t: 'day' }); MOEW.fly(L.T, V(0, CH + 40, -30), V(0, .1, -1), { lt: L.lt, n: 44, speed: 20, sx: 160, sy: 26, sz: 50, s: 1.5 });
  crowdBox(L, -20, 20, -14, -20, 5, 23, { y: CH, mode: 'point', face: V(0, CH + 60, -200), expr: 'confused' });
  cm([10, CH + 8, 40, 0, CH + 36, -120, 54], [6, CH + 10, 34, 0, CH + 40, -160, 54], L.k); }, [[0, 'gulls_flock', .6]]);
// 26 «Keine einzige ist am Strand geblieben»: la playa vacía: una sola pluma blanca rueda por la arena
shot(32.33, 'I', null, L => { kueste(L, { t: 'day' }); const f = SHELLS[0]; show(f, 2 + L.k * 3, .3, 40, L.T * 2, .9); cm([6, 2, 56, 0, 1, 30, 46], [4, 2.4, 50, 0, 1, 30, 46], L.k); }, [[0, 'wind_soft', .7]]);

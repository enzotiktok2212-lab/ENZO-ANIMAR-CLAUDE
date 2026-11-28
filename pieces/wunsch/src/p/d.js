// ---------- d: el deseo de Graufeld, la ciudad sin sueño y el final (96,9 – 176 s) ----------
// Plaza de noche: banco del final en (0, -64) mirando +z (asiento ≈ 1,5); la torre detrás en (0, -86) con la campana a y ≈ 66.
const SEAT = 1.5, BZ = -64;
const benchSit = (c, x, L, pose = {}) => sit(c, x, SEAT, BZ + .2, 0, L, { aLx: .4, aRx: .4, aLe: .5, aRe: .5, ...pose });
function plazaNight(L, n = 18, mode = 'sitears', seed = 71, o = {}) { town(L, 'night', V(0, 0, BZ + 14)); crowdBox(L, o.x0 ?? -26, o.x1 ?? 26, o.z0 ?? BZ + 10, o.z1 ?? BZ + 40, n, seed, { list: SL, mode, seat: .9, jit: .5, ...o }); }
const bellSwing = (T, k = 1) => { TURM.BELL.rotation.x = Math.sin(T * 5) * .55 * k; };
// 68 «In der ersten Nacht wünschte er sich,»: Graufeld en la calle a medianoche, brazos abiertos; un remolino de chispas moradas sube al cielo
shot(96.87, 'F', 'slow', L => { town(L, 'night', V(0, 0, 40)); const c = put(grau, 0, 0, 40, 0); actuar(c, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: 1.0, aRz: 1.0, aLe: .3, aRe: .3, headX: -.3 }]], { T: L.T }); cara(c, L.T, { eyes: 'squint', mouth: 'grin' });
  SPK.S.forEach(s => s.material.color.setHex(0xc89aff)); SPK.at(V(0, 0, 40), L.T, 1, 4, 14, 34);
  orb(L.k, V(0, 4, 40), null, [20, .1, .05, 44], [15, -.05, .02, 40]); sh(V(0, 0, 40), 24); },
  [[.1, 'magic_hit', .6], [.3, 'evil_laugh', .5], [.8, 'drone', .4]]);
// 69 «dass jede Glocke,»: la campana de la torre empieza a voltear sola; ondas de ruido
shot(98.57, 'C', 'punch', L => { town(L, 'night', V(0, 0, -86)); TURM.BL.intensity = 30; bellSwing(L.T); noiseFX(V(0, 60, -78), L.T, 1);
  cm([0, 52, -44, 0, 62, -86, 44], [0, 54, -50, 0, 63, -86, 40], L.k); sh(V(0, 50, -86), 30); },
  [[.0, 'bells', .7], [.4, 'bells7', .5]]);
// 70 «jeder Hund»: tres perros salchicha ladran en un portal
shot(99.65, 'W', null, L => { town(L, 'night', V(-20, 0, 34)); DOGS.forEach((d, i) => { show(d, -24 + i * 3, 0, 34 + (i % 2) * 1.5, .5 + (i - 1) * .3, 1.2); d.position.y = Math.abs(Math.sin(L.T * 14 + i)) * .4; }); noiseFX(V(-21, 3, 35), L.T, 1, '#ff8a4a');
  cm([-12, 5, 48, -21, 2.4, 34, 44], [-13, 4.4, 45, -21, 2.4, 34, 40], L.k); sh(V(-21, 0, 34), 16); },
  [[.0, 'bark', .7], [.25, 'bark', .6], [.5, 'growl', .4]]);
// 71 «und jede Hupe in der Stadt»: dos coches aparcados pitan con los faros encendidos
shot(100.43, 'S', null, L => { town(L, 'night', V(0, 0, 110)); show(CARS[0], -1.2, 0, 98, .1, 1); show(CARS[1], 1.2, 0, 114, -.1, 1); const on = Math.sin(L.T * 18) > 0; lp(2, -1.2, 3, 104, on ? 60 : 10, 0xfff0c0, 30); lp(3, 1.2, 3, 120, on ? 10 : 60, 0xfff0c0, 30); noiseFX(V(-1.2, 4.5, 98), L.T, 1, '#ffd23f'); noiseFX(V(1.2, 4.5, 114), L.T + .3, 1, '#ffd23f');
  cm([3, 7, 140, 0, 3, 106, 46], [2, 6, 134, 0, 3, 106, 42], L.k); sh(V(0, 0, 118), 24); },
  [[.0, 'hupe', .6], [.3, 'hupe', .5], [.6, 'car', .4]]);
// 72 «die ganze Nacht Lärm macht.»: vista aérea de Sternau de noche: ondas de ruido saliendo de todos lados
shot(101.53, 'Z', null, L => { town(L, 'night', V(0, 0, 0)); bellSwing(L.T); TURM.BL.intensity = 30; for (const p of [V(0, 60, -80), V(-36, 4, 20), V(0, 4, 116), V(30, 4, -40), V(-20, 4, -60)]) noiseFX(p, L.T + p.x, .9);
  cm([60, 80, 120, 0, 10, -20, 50], [50, 90, 110, 0, 10, -20, 52], L.k); sh(V(0, 0, 0), 90); },
  [[.0, 'bells', .5], [.2, 'bark', .4], [.5, 'hupe', .4], [.9, 'bark', .3]]);
// 73 «Es war so laut,»: un vecino en su cama, la almohada apretada contra la cabeza
shot(103.15, 'I', null, L => { room('SZ', L, { night: true }); const c = SL[6]; riseBed(c, SZX + 3.2, -6.6, .7, L, { aLx: 2.4, aRx: 2.4, aLz: .3, aRz: .3, aLe: 2.3, aRe: 2.3, headX: .2 }); SZ.quilt.position.y = 4.55; cara(c, L.T, { eyes: 'squint', mouth: 'grimace_wide' }); noiseFX(hp(c), L.T, .8, '#ffd23f');
  cm([SZX + 7, 9, 6, SZX + 3, 5.4, -4.6, 42], [SZX + 6.4, 8.6, 4.6, SZX + 3, 5.6, -4.8, 38], L.k); sh(V(SZX + 3, 0, -4), 14); },
  [[.0, 'bells', .3], [.2, 'cloth', .5], [.4, 'shout_m', .3]]);
// 74 «dass niemand mehr schlafen konnte.»: ventanas de la plaza encendidas; en cada una, un vecino despierto con ojeras
shot(104.25, 'R', null, L => { town(L, 'night', V(0, 0, 24)); crowdBox(L, -7, 7, 18, 28, 6, 81, { list: SL, mode: i => i % 2 ? 'tired' : 'ears', jit: .2 }); bellSwing(L.T, .5);
  cm([0, 6, 48, 0, 4, 22, 46], [0, 5.6, 44, 0, 4, 22, 44], L.k); sh(V(0, 0, 22), 24); },
  [[.0, 'yawn_big', .4], [.4, 'bark', .3], [.8, 'sigh', .4]]);
// 75 «Und wer nicht schläft, kann auch nicht aufwachen.»: Oma en su cama con los ojos como platos mirando al techo; el despertador pasa de 3:59 a 4:00 y no pasa nada
shot(105.87, 'S', null, L => { room('OZ', L, { night: true }); const c = lie(oma, OZX + 3.4, -6.6, 4.15, L); OZ.quilt.position.y = 4.55; c.setFace({ eyes: 'wide', mouth: 'flat' });
  show(WK[0], OZX + 10, 3.4, -8.2, -.4, 1); clockAt(WK[0], L.lt < 1 ? '3:59' : '4:00', '#ff4a3a'); cm([OZX + 3.4, 13, -2, OZX + 3.4, 4.4, -5.6, 42], [OZX + 3.6, 11.6, -3, OZX + 3.4, 4.4, -5.8, 38], L.k); sh(V(OZX + 3, 0, -5), 14); },
  [[.1, 'clock_tick', .5], [.7, 'clock_tick', .5], [1.2, 'sad_tone', .4]]);
// 76 «Also gewann Herr Graufeld jeden einzelnen Tag.»: en el sótano, a las 0:00, Graufeld celebra con chispas moradas; «TAG 1, 2, 3…»
shot(107.88, 'W', null, L => { use('KE'); inside(.4, 14); lp(0, KEX + 4, 6, 4, 30, 0xb08aff, 24); const c = put(grau, KEX + 3, 0, 2, .3); const j = Math.abs(Math.sin(L.T * 7)); c.root.position.y = j * .7; actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, aLe: .3, aRe: .3 }]], { T: L.T }); cara(c, L.T, { eyes: 'happy', mouth: 'grin' });
  SPK.S.forEach(s => s.material.color.setHex(0xc89aff)); SPK.at(V(KEX + 3, 0, 2), L.T, 1, 3, 8, 26); badge('gold', 'TAG ' + (Math.floor(L.lt / .55) + 1), W / 2, H * .2, 1, 1, 1.1);
  onBody(c, 15, .3, .14, 44, L.k, 12, .1); sh(V(KEX + 3, 0, 2), 16); },
  [[.0, 'evil_laugh', .5], [.5, 'magic_hit', .4], [1.1, 'magic_hit', .4], [1.7, 'magic_hit', .4]]);
// 77 «Er verkaufte Ohrstöpsel für 100 Euro das Stück.»: cola de vecinos con ojeras ante la tienda; Graufeld cobra billetes y da un tapón
shot(110.56, 'C', null, L => { town(L, 'day'); const c = put(grau, 18.4, 0, 171, -PI / 2); actuar(c, 0, [[0, { aRx: 1.5, aRe: .3, aRz: -.1, aLx: 1.2, aLe: 1.5 }]], { T: L.T }); cara(c, L.T, { expr: 'smug' }); attach(PLUGS[0], c.aR.hand, [0, -.5, .3], [0, 0, 0], .8);
  for (let i = 0; i < 5; i++) { const e = put(SL[10 + i], 14.6 - i * 3.2, 0, 171 + i * .4, PI / 2); actuar(e, 0, [[0, i === 0 ? { aRx: 1.4, aRe: .3 } : { lean: .15, headX: .3 }]], { T: L.T }); e.setFace({ eyes: 'half', mouth: 'wavy' }); }
  attach(BUNDLES[0], SL[10].aR.hand, [0, -.5, .5], [0, 0, 0], .5); badge('red', '100 €', W / 2, H * .2, (L.lt - .2) / .2, 1, 1.2);
  cm([10, 7, 186, 17, 4, 171, 46], [12, 6.4, 183, 17, 4, 171, 44], L.k); sh(V(15, 0, 172), 22); },
  [[.1, 'cash_reg', .6], [.6, 'cash', .5], [1.2, 'yawn_big', .3], [1.8, 'coin_flip', .4]]);
// 78 «Aber gegen einen Wunsch hilft kein Ohrstöpsel.»: un vecino con dos tapones naranjas en las orejas, en la cama; las ondas de ruido le atraviesan igual
shot(113.58, 'I', null, L => { room('SZ', L, { night: true }); const c = lie(SL[10], SZX + 3.2, -6.6, 4.15, L); SZ.quilt.position.y = 4.55; c.setFace({ eyes: 'wide', mouth: 'grimace' });
  const h = c.head; attach(PLUGS[1], h, [.72, .7, 0], [0, 0, PI / 2], .7); attach(PLUGS[2], h, [-.72, .7, 0], [0, 0, -PI / 2], .7); noiseFX(hp(c), L.T, 1, '#ffd23f');
  cm([SZX + 3.2, 11, -1, SZX + 3.2, 4.4, -5.8, 40], [SZX + 3.2, 10, -2, SZX + 3.2, 4.4, -6, 36], L.k); sh(V(SZX + 3, 0, -5), 12); },
  [[.0, 'bells', .4], [.3, 'bark', .3], [.9, 'sigh', .4]]);
// 79 «Und jeden Morgen wünschte er sich etwas Neues von uns.»: Graufeld en la plaza, señala la ciudad con una sonrisa codiciosa; chispas moradas en la mano
shot(115.80, 'S', 'slow', L => { town(L, 'dawn'); const c = put(grau, 0, 0, 20, PI); actuar(c, 0, [[0, { aRx: 1.62, aRz: -.08, aRe: .05, aLx: .9, aLz: -.4, aLe: 1.6, headX: -.05 }]], { T: L.T }); cara(c, L.T, { eyes: 'squint', mouth: 'grin' });
  SPK.S.forEach(s => s.material.color.setHex(0xc89aff)); SPK.at(wpos(c.aL.hand), L.T, 1, 1.2, 3, 16); crowdBox(L, -12, 12, 32, 44, 6, 91, { list: EX, mode: 'shock', face: V(0, 4, 20) });
  cm([9, 6, 8, 0, 5, 22, 46], [7, 5.6, 10, 0, 5, 22, 42], L.k); sh(V(0, 0, 10), 30); },
  [[.1, 'evil_laugh', .4], [.6, 'magic_hit', .4]]);
// 80 «Am zweiten Tag unser ganzes Geld.»: los billetes salen volando de la cartera de Papa hacia la tienda de Graufeld; «TAG 2»
shot(118.55, 'W', null, L => { town(L, 'day'); const c = put(papa, -4, 0, 30, .4); actuar(c, 0, [[0, { aRx: 1.5, aRe: .4, aLx: 1.2, aLe: 1.3 }], [.5, 'shock', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: L.lt < .5 ? 'neutral' : 'shock' });
  BUNDLES.forEach((b, i) => { const t = clamp(L.lt * 1.3 - i * .05); if (t <= 0) return; show(b, lerp(-3, 30, t), 4 + Math.sin(t * PI) * 8 + i * .2, lerp(30, -20, t) + (i % 3) * 2, t * 9 + i, .55); });
  badge('gold', 'TAG 2', W / 2, H * .18, (L.lt - .05) / .2, 1, 1); orb(L.k, V(-3, 3.6, 30), null, [16, .5, .14, 44], [13, .3, .12, 42]); sh(V(-3, 0, 30), 22); },
  [[.1, 'money_rain', .6], [.4, 'whoosh', .5], [.6, 'gasp', .4]]);
// 81 «Am dritten Tag Leas Million.»: el montón de billetes de Lea se desvanece de golpe; Lea llora
shot(120.44, 'Z', null, L => { room('MZ', L); GELD.userData.setH(1 - easeIn(clamp(L.lt / 1.1))); const c = put(lea, MZX - 2, 0, 9.5, .3); actuar(c, 0, [[0, 'hands_face']], { T: L.T }); cara(c, L.T, { expr: 'cry' }); tears(c, L.T);
  SPK.S.forEach(s => s.material.color.setHex(0xc89aff)); SPK.at(V(MZX + 9, 0, -6), L.T, 1, 6, 12, 26); badge('gold', 'TAG 3', W / 2, H * .18, (L.lt - .05) / .2, 1, 1);
  cm([MZX - 6, 8, 22, MZX - 1, 5, 6, 48], [MZX - 5, 7.6, 20, MZX - 1, 5, 6, 46], L.k); sh(V(MZX + 2, 0, -2), 20); },
  [[.05, 'magic_hit', .5], [.2, 'whoosh_up', .5], [.6, 'cry_girl', .4]]);
// 82 «Am vierten Tag Mias Fahrrad.»: la bici rosa de Mia se eleva y se va volando; Mia estira los brazos llorando
shot(122.12, 'S', null, L => { town(L, 'day'); const t = clamp((L.lt - .2) / 1.2); show(BIKE, lerp(3, 14, t), easeIn(t) * 14, lerp(36, 10, t), t * 3, .7); const c = put(miaT, -1, 0, 38, .6); actuar(c, 0, [[0, { aLx: 2.0, aRx: 2.0, aLe: .2, aRe: .2, lean: .1, headX: -.3 }]], { T: L.T }); cara(c, L.T, { expr: 'cry' }); tears(c, L.T);
  SPK.S.forEach(s => s.material.color.setHex(0xc89aff)); SPK.at(wpos(BIKE), L.T, 1, 2, 3, 16); badge('gold', 'TAG 4', W / 2, H * .18, (L.lt - .05) / .2, 1, 1);
  orb(L.k, V(2, 4, 34), null, [18, -.4, .2, 46], [15, -.2, .26, 44]); sh(V(2, 0, 34), 22); },
  [[.1, 'magic_hit', .4], [.3, 'whoosh_up', .5], [.5, 'cry_girl', .5]]);
// 83 «Dann Omas Kürbisse.»: las calabazas gigantes ruedan solas fuera del huerto; Oma intenta frenar una
shot(123.89, 'R', null, L => { use('GA'); day('day'); GA.CAL.forEach((k, i) => { const t = clamp(L.lt * .9 - i * .05); k.position.z += t * 30; k.rotation.x = t * 6; });
  const c = put(oma, GAX - 3, 0, 18, PI); actuar(c, 0, [[0, { aLx: 1.6, aRx: 1.6, aLe: .3, aRe: .3, lean: -.2, lLx: -.4, lRx: .4, crouch: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'shock' });
  cm([GAX + 4, 6, 34, GAX - 3, 3.4, 18, 46], [GAX + 3, 5.6, 32, GAX - 3, 3.4, 18, 44], L.k); sh(V(GAX, 0, 20), 34); },
  [[.05, 'rubble', .5], [.4, 'thud', .5], [.6, 'gasp_old', .4]]);
// 84 «Am sechsten Tag gehörten ihm sogar unsere Häuser,»: un cartel «ZU VERKAUFEN · GRAUFELD» delante de nuestra casa; Papa, Mama y Mia salen con la cabeza baja
shot(125.15, 'I', null, L => { town(L, 'dusk'); show(SCH, -39, 2.6, 22, PI / 2, 1); badge('gold', 'TAG 6', W / 2, H * .18, (L.lt - .05) / .2, 1, 1);
  [[papa, -42, 30], [mama, -43, 34], [mia, -41, 38]].forEach(([c, x, z], i) => { put(c, x + L.lt * 2.4, 0, z, PI / 2 + .3); actuar(c, 0, [[0, { ...walkP(L.T * .6, i), headX: .35, aLz: .05, aRz: .05 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' }); });
  cm([-18, 6, 40, -40, 5, 28, 46], [-20, 6, 36, -40, 5, 30, 44], L.k); sh(V(-38, 0, 30), 22); },
  [[.1, 'steps', .5], [.6, 'sad_tone', .4], [1.4, 'door_crash', .3]]);
// 85 «und die ganze Stadt saß draußen auf dem Marktplatz.»: grúa sobre la plaza de noche: todo el pueblo sentado en el suelo en pijama, con mantas, tapándose las orejas
shot(127.70, 'W', 'slow', L => { plazaNight(L, 26, 'sitears', 101, { x0: -30, x1: 30, z0: -40, z1: 40 }); bellSwing(L.T, .4);
  cm([0, 16, 70, 0, 2, 0, 50], [0, 34, 60, 0, 0, -6, 52], L.k); sh(V(0, 0, 0), 60); },
  [[.1, 'crowd_run', .3], [.3, 'bells', .3], [.8, 'bark', .3], [1.4, 'hupe', .3]]);
// 86 «Papa stellte 12 Wecker»: Papa sentado en la plaza rodeado de 12 despertadores; el contador sube
shot(130.18, 'C', null, L => { plazaNight(L, 10, 'sitears', 111); const P = V(4, 0, 6); const c = sit(papa, P.x, .9, P.z, .2, L, { aRx: 1.2 + Math.sin(L.T * 9) * .2, aRe: .4, lean: .3 }); cara(c, L.T, { expr: 'determined' }); const n = Math.min(12, Math.floor(L.lt / 1.1 * 12) + 1);
  for (let i = 0; i < n; i++) { const a = i / 12 * PI * 2; show(WK[i], P.x + Math.cos(a) * 4, 0, P.z + Math.sin(a) * 4, -a + PI / 2, .9); clockAt(WK[i], '23:00', ['#ff4a3a', '#7af0ff', '#ffd23f'][i % 3]); }
  badge('num', String(n), W / 2, H * .2, 1, 1, 1.3); cm([P.x + 4, 9, P.z + 14, P.x, 2, P.z, 46], [P.x + 3, 8.4, P.z + 12, P.x, 2.4, P.z, 44], L.k); sh(V(P.x, 0, P.z), 16); },
  [[.05, 'click_metal', .5], [.3, 'click_metal', .5], [.55, 'click_metal', .5], [.8, 'click_metal', .5], [1.05, 'click_metal', .5]]);
// 87 «und trug 3 Paar Ohrstöpsel.»: primer plano de Papa con tres tapones en cada oreja, como un erizo; «3»
shot(131.42, 'Z', 'punch', L => { plazaNight(L, 6, 'sitears', 121); const P = V(4, 0, 6); const c = sit(papa, P.x, .9, P.z, .2, L, { lean: .1 }); c.setFace({ eyes: 'squint', mouth: 'grimace' });
  for (let i = 0; i < 6; i++) { const s = i < 3 ? 1 : -1, k = i % 3; attach(PLUGS[i], c.head, [s * (.7 + k * .35), .7 + (k - 1) * .18, (k - 1) * .2], [0, 0, s * PI / 2], .7); }
  badge('gold', '3', W / 2, H * .2, (L.lt - .1) / .2, 1, 1.3); onFace(c, 5.4, .3, .2, 40, L.k, 4.6); sh(V(P.x, 0, P.z), 12); },
  [[.02, 'pop', .5], [.2, 'pop', .5], [.4, 'pop', .5], [.8, 'bells', .3]]);
// 88 «Trotzdem konnte er nicht schlafen.»: Papa con los ojos como platos, temblando; ondas de ruido
shot(133.31, 'S', null, L => { plazaNight(L, 6, 'sitears', 131); const P = V(4, 0, 6); const c = sit(papa, P.x, .9, P.z, .2, L, { ...shiver(L.T, 2), lean: .1 }); c.setFace({ eyes: 'wide', mouth: 'wavy' });
  for (let i = 0; i < 6; i++) { const s = i < 3 ? 1 : -1, k = i % 3; attach(PLUGS[i], c.head, [s * (.7 + k * .35), .7 + (k - 1) * .18, (k - 1) * .2], [0, 0, s * PI / 2], .7); } noiseFX(hp(c), L.T, 1);
  onFace(c, 6.4, .3, -.6, 42, L.k, 5.4); sh(V(P.x, 0, P.z), 12); },
  [[.0, 'bells', .4], [.3, 'bark', .3], [.6, 'shiver', .5]]);
// 89 «Oma zählte Schafe bis 5000.»: Oma, en su manta, con los ojos cerrados; ovejas saltan una valla sobre su cabeza; contador 4998 → 5000
shot(134.94, 'I', null, L => { plazaNight(L, 6, 'sitears', 141); const P = V(-8, 0, 2); const c = sit(oma, P.x, .9, P.z, .3, L, { aLx: .8, aRx: .8, aLe: 1.4, aRe: 1.4 }); c.setFace({ eyes: 'closed', mouth: Math.sin(L.T * 9) > 0 ? 'talk' : 'flat' });
  SHEEP.forEach((s, i) => { const t = (L.lt * 1.4 + i / SHEEP.length) % 1; show(s, P.x + lerp(-6, 6, t), 7 + Math.sin(t * PI) * 3, P.z - 1, PI / 2, .6); });
  badge('num', String(Math.min(5000, 4997 + Math.floor(L.lt / .5))), W / 2, H * .2, 1, 1, 1.2); cm([P.x + 2, 6, P.z + 18, P.x, 6, P.z, 46], [P.x + 1.6, 6, P.z + 15, P.x, 6, P.z, 44], L.k); sh(V(P.x, 0, P.z), 16); },
  [[.1, 'baa', .5], [.5, 'baa', .4], [.9, 'baa', .4], [1.3, 'count', .4]]);
// 90 «Mama kniff die Augen so fest zu, dass sie Kopfschmerzen bekam.»: Mama aprieta los ojos con fuerza; luego se lleva las manos a la cabeza con estrellitas girando
shot(137.13, 'C', null, L => { plazaNight(L, 6, 'sitears', 151); const P = V(10, 0, -2); const k = L.lt > 1.4; const c = sit(mama, P.x, .9, P.z, -.3, L, k ? { aLx: 2.55, aLz: .55, aRx: 2.55, aRz: .55, aLe: 2.0, aRe: 2.0 } : { aLx: 1.0, aRx: 1.0, aLe: 1.8, aRe: 1.8, lean: .15, ...shiver(L.T, 1.5) });
  c.setFace({ eyes: k ? 'squint' : 'closed', mouth: k ? 'grimace_wide' : 'grimace' }); if (k) SPK.at(hp(c).add(V(0, 1.2, 0)), L.T * 2, 1, 1.4, .4, 8);
  onFace(c, 6, .3, .4, 40, L.k, 4.8); sh(V(P.x, 0, P.z), 12); },
  [[.1, 'shiver', .4], [1.4, 'boing_metal', .4], [1.6, 'sparkle', .4]]);
// 91 «Nichts half.»: plano general: todos despiertos, hundidos, en la plaza
shot(140.29, 'W', null, L => { plazaNight(L, 24, i => i % 3 ? 'sitears' : 'tired', 161, { x0: -26, x1: 26, z0: -30, z1: 30 }); put(papa, 4, sitY(papa, .9), 6, .2); put(mama, 10, sitY(mama, .9), -2, -.3); put(oma, -8, sitY(oma, .9), 2, .3);
  for (const c of [papa, mama, oma]) { actuar(c, 0, [[0, sitPose({ lean: .25, headX: .4 })]], { T: L.T, weight: false }); c.setFace({ eyes: 'half', mouth: 'wavy' }); c.blob.visible = false; }
  cm([0, 20, 54, 0, 2, 0, 48], [0, 22, 50, 0, 2, 0, 46], L.k); sh(V(0, 0, 0), 50); },
  [[.1, 'sigh', .5], [.3, 'crickets', .3]]);
// 92 «Glocken,»: la campana volteando, desde abajo
shot(141.16, 'C', 'punch', L => { town(L, 'night', V(0, 0, -86)); TURM.BL.intensity = 30; bellSwing(L.T * 1.4); noiseFX(V(0, 60, -78), L.T, 1); cm([4, 40, -60, 0, 62, -86, 40], [3, 41, -62, 0, 63, -86, 36], L.k); sh(V(0, 50, -86), 30); },
  [[.0, 'bells', .7]]);
// 93 «Hunde,»: los perros ladrando a cámara
shot(141.72, 'S', null, L => { town(L, 'night', V(-6, 0, 30)); DOGS.forEach((d, i) => { show(d, -8 + i * 3, 0, 30, 0, 1.3); d.position.y = Math.abs(Math.sin(L.T * 14 + i)) * .4; }); noiseFX(V(-5, 2.6, 31), L.T, 1, '#ff8a4a'); cm([-5, 3, 42, -5, 2, 30, 42], [-5, 2.8, 39, -5, 2, 30, 38], L.k); sh(V(-5, 0, 30), 12); },
  [[.0, 'bark', .7], [.25, 'bark', .6]]);
// 94 «Hupen.»: faros y bocina en primer plano
shot(142.22, 'Z', 'punch', L => { town(L, 'night', V(0, 0, 112)); show(CARS[1], 0, 0, 112, 0, 1); lp(2, 0, 2.4, 118, Math.sin(L.T * 22) > 0 ? 80 : 20, 0xfff0c0, 30); noiseFX(V(0, 3, 117), L.T, 1, '#ffd23f'); cm([2, 4, 128, 0, 2.4, 114, 44], [1.4, 3.6, 125, 0, 2.4, 114, 40], L.k); sh(V(0, 0, 114), 14); },
  [[.0, 'hupe', .7]]);
// 95 «Jede Minute.»: las agujas del reloj de la torre giran deprisa
shot(142.78, 'R', null, L => { town(L, 'night', V(0, 0, -86)); const m = Math.floor(L.lt * 60) % 60; TURM.setClock(23, m, .6); cm([0, 40, -48, 0, 44, -78, 36], [0, 40, -52, 0, 44, -78, 32], L.k); sh(V(0, 40, -86), 20); },
  [[.0, 'clock_spin', .6], [.3, 'clock_tick', .4]]);
// 96 «Um 23:57 Uhr»: el reloj de la torre se para en las 11:57 y el reloj de pulsera de Mia lo confirma: 23:57
shot(143.62, 'C', 'punch', L => { town(L, 'night', V(0, 0, -86)); TURM.setClock(23, 57, .6); badge('num', '23:57', W / 2, H * .62, (L.lt - .1) / .2, 1, 1.2); cm([0, 40, -46, 0, 44, -78, 38], [0, 40, -50, 0, 44, -78, 34], L.k); sh(V(0, 40, -86), 20); },
  [[.02, 'impact', .5], [.2, 'clock_tick', .5], [1.0, 'clock_tick', .5]]);
// 97 «saß ich mit Mia auf einer Bank am Marktplatz.»: yo y Mia en el banco, en pijama, con la torre detrás; alrededor, todo el pueblo despierto
shot(145.46, 'W', null, L => { plazaNight(L, 6, 'sitears', 171, { x0: -24, x1: -8, z0: BZ + 6, z1: BZ + 26 }); crowdBox(L, 8, 24, BZ + 6, BZ + 26, 6, 172, { list: SL, mode: 'sitears', seat: .9, jit: .5 }); benchSit(ich, -1, L, { headX: .2 }); cara(ich, L.T, { expr: 'tired' }); benchSit(mia, 1.2, L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6 }); cara(mia, L.T, { expr: 'sad' });
  TURM.setClock(23, 57, .6); cm([3, 4.6, BZ + 18, 0, 8, BZ - 6, 50], [2.4, 4.4, BZ + 15, 0, 8, BZ - 6, 48], L.k); sh(V(0, 0, BZ), 20); },
  [[.1, 'bells', .3], [.6, 'bark', .3], [1.2, 'sigh', .4]]);
// 98 «Und ich gähnte.»: primer plano: bostezo enorme
shot(147.64, 'C', 'punch', L => { plazaNight(L, 4, 'sitears', 181, { z0: BZ + 12, z1: BZ + 30 }); const c = benchSit(ich, -1, L, { headX: -.25, aLx: 2.6, aRx: 2.6, aLz: .4, aRz: .4, aLe: 1.6, aRe: 1.6 }); c.setFace({ eyes: 'closed', mouth: 'yawn' });
  onFace(c, 5, .3, .2, 40, L.k, 4.4); sh(V(-1, 0, BZ), 12); },
  [[.05, 'yawn_big', .8]]);
// 99 «Da fiel es mir ein.»: abro los ojos de golpe; una «!» sobre mi cabeza
shot(148.98, 'F', null, L => { plazaNight(L, 4, 'sitears', 191, { z0: BZ + 12, z1: BZ + 30 }); const c = benchSit(ich, -1, L, { aRx: 1.9, aRz: -.5, aRe: 2.3, headY: .1 }); c.setFace({ eyes: 'wide', mouth: 'o' }); badge3('q', '!', hp(c).add(V(0, 2.6, 0)), (L.lt - .05) / .2, 1.1);
  onFace(c, 5.6, .3, -.3, 40, L.k, 4.8); sh(V(-1, 0, BZ), 12); },
  [[.02, 'ding_soft', .7], [.1, 'sparkle', .4]]);
// 100 «Man muss wirklich aufwachen.»: recuerdo (en sepia): Graufeld despertándose de golpe en su sótano
shot(150.04, 'G', null, L => { use('KE'); inside(.4, 14); lp(0, KEX + 6, 6, 4, 26, 0x8a6aff, 18); grade.uniforms.sepia.value = .7; const up = easeOut(clamp(L.lt / .3)); const c = put(grau, KEX + 6, lerp(3.3, sitY(grau, 2.6), up), lerp(1.2, -1.5, up), .3); c.root.rotation.x = -PI / 2 + up * PI / 2; c.blob.visible = false;
  actuar(c, 0, [[0, { lLx: 1.5 * up, lRx: 1.5 * up, aLx: .6, aRx: .6 }]], { T: L.T, weight: false }); cara(c, L.T, { eyes: 'wide', mouth: 'smirk' }); cm([KEX + 12, 8, 8, KEX + 5.6, 4, -1, 44], [KEX + 11, 7.4, 6.6, KEX + 5.6, 4.4, -1, 40], L.k); sh(V(KEX + 6, 0, -1), 14); },
  [[.0, 'glitch', .4], [.1, 'alarm_soft', .4]]);
// 101 «Und aufwachen kann nur, wer vorher geschlafen hat.»: yo en el banco, pensativo, con un bocadillo: una cama con «Zzz» → un sol
shot(151.58, 'S', null, L => { plazaNight(L, 8, 'sitears', 201, { z0: BZ + 12, z1: BZ + 36 }); const c = benchSit(ich, -1, L, { aRx: 1.95, aRz: -.5, aRe: 2.35, headY: .2 }); cara(c, L.T, { expr: 'determined' }); bubble(c, L.lt < 1.1 ? 'Zzz… ' : 'Zzz → ☀', (L.lt - .1) / .2, 2.4);
  benchSit(mia, 1.2, L, { headY: -.4 }); cara(mia, L.T, { expr: 'confused' }); cm([2, 5.4, BZ + 13, -.5, 4, BZ, 44], [1.4, 5, BZ + 11, -.5, 4, BZ, 42], L.k); sh(V(0, 0, BZ), 14); },
  [[.1, 'pop', .4], [1.1, 'ding_soft', .4]]);
// 102 «Und bei diesem Lärm kann hier niemand schlafen.»: grúa por encima del pueblo despierto; ruido por todas partes
shot(154.01, 'R', null, L => { plazaNight(L, 26, i => i % 2 ? 'sitears' : 'tired', 211, { x0: -30, x1: 30, z0: -40, z1: 40 }); bellSwing(L.T, .6); for (const p of [V(0, 60, -80), V(-30, 4, 10), V(24, 4, 0)]) noiseFX(p, L.T + p.x, .8);
  cm([-30, 24, 50, 0, 2, -10, 50], [-20, 30, 46, 0, 2, -14, 50], L.k); sh(V(0, 0, 0), 60); },
  [[.0, 'bells', .4], [.4, 'bark', .3], [.9, 'hupe', .3], [1.4, 'yawn_big', .3]]);
// 103 «Außer mir.»: zoom lento a mi cara: sonrisa de lado
shot(156.17, 'Z', 'slow', L => { plazaNight(L, 4, 'sitears', 221, { z0: BZ + 12, z1: BZ + 30 }); const c = benchSit(ich, -1, L, { aLx: .3, aRx: .3 }); cara(c, L.T, { eyes: 'squint', mouth: 'smirk' }); onFace(c, 6.4, .2, 0, 40, L.k, 4.4); sh(V(-1, 0, BZ), 12); },
  [[.1, 'whoosh_up', .3]]);
// 104 «Ich gab Mia meine Uhr.»: le paso mi reloj de pulsera a Mia; ella lo coge con las dos manos
shot(156.89, 'W', null, L => { plazaNight(L, 4, 'sitears', 231, { z0: BZ + 12, z1: BZ + 30 }); const t = clamp(L.lt / .6); const c = benchSit(ich, -1, L, { aRx: 1.4, aRe: .3, aRz: .4, twist: -.2 }); cara(c, L.T, { expr: 'smile' });
  const m = benchSit(mia, 1.2, L, { aLx: 1.3, aRx: 1.3, aLz: -.25, aRz: -.25, aLe: 1.0, aRe: 1.0 }); cara(m, L.T, { expr: 'gasp' }); const a = wpos(c.aR.hand), b = wpos(m.aL.hand); show(UHR, lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t) + .6, 0, .12); UHR.userData.set('23:58');
  cm([.2, 4.6, BZ + 9, .1, 3.2, BZ, 40], [.2, 4.4, BZ + 8, .1, 3.2, BZ, 38], L.k); sh(V(0, 0, BZ), 10); },
  [[.1, 'watch_click', .5], [.5, 'cloth', .4]]);
// 105 «„Weck mich um Mitternacht.“»: le hablo a Mia; ella asiente muy seria y aprieta el reloj
shot(157.85, 'S', null, L => { plazaNight(L, 4, 'sitears', 241, { z0: BZ + 12, z1: BZ + 30 }); const c = benchSit(ich, -1, L, { aRx: .9, aRe: 1.2, aRz: .2, headY: -.4 }); talk(c, L.T, L.t0, L.t1);
  const m = benchSit(mia, 1.2, L, { aLx: 1.2, aRx: 1.2, aLz: -.25, aRz: -.25, aLe: 1.2, aRe: 1.2, headY: .4, headX: Math.sin(L.T * 9) * .12 }); cara(m, L.T, { expr: 'determined' }); attach(UHR, m.aR.hand, [0, -.5, .4], [0, 0, 0], .22); UHR.userData.set('23:58');
  cm([3, 4.6, BZ + 9, .1, 3.4, BZ, 42], [2.6, 4.4, BZ + 8, .1, 3.4, BZ, 40], L.k); sh(V(0, 0, BZ), 10); },
  [[.6, 'cloth', .3]]);
// 106 «Um 23 Uhr 59»: primer plano del reloj en las manos de Mia: 23:59
shot(159.23, 'C', 'punch', L => { plazaNight(L, 2, 'sitears', 251, { z0: BZ + 12, z1: BZ + 20 }); show(UHR, 0, 4, BZ + 4, 0, 1); UHR.userData.set('23:59'); cm([0, 4.4, BZ + 13, 0, 4, BZ + 4, 40], [0, 4.3, BZ + 12, 0, 4, BZ + 4, 37], L.k); sh(V(0, 0, BZ + 4), 10); },
  [[.02, 'impact', .4], [.3, 'heartbeat', .5], [1.2, 'heartbeat', .5]]);
// 107 «und 57 Sekunden»: el reloj muestra 23:59:57
shot(161.21, 'Z', null, L => { plazaNight(L, 2, 'sitears', 261, { z0: BZ + 12, z1: BZ + 20 }); show(UHR, 0, 4, BZ + 4, 0, 1); UHR.userData.set('23:59:57'); cm([0, 4.4, BZ + 12, 0, 4, BZ + 4, 38], [0, 4.3, BZ + 11, 0, 4, BZ + 4, 35], L.k); sh(V(0, 0, BZ + 4), 10); },
  [[.1, 'tick', .6], [.6, 'heartbeat', .5]]);
// 108 «schlug die Kirchturmglocke direkt über uns.»: desde abajo, el banco y la torre: la campana da un golpe enorme; onda expansiva; todos se tapan las orejas
shot(162.71, 'C', 'punch', L => { plazaNight(L, 12, 'sitears', 271, { z0: BZ + 12, z1: BZ + 34 }); TURM.BL.intensity = 40; bellSwing(L.T * 1.3, 1.2); noiseFX(V(0, 62, -84), L.T, 1, '#ffffff'); grade.uniforms.flash.value = Math.max(0, .5 - L.lt * 2);
  benchSit(ich, -1, L, { headX: .3 }); ich.setFace({ eyes: L.lt > .9 ? 'closed' : 'half', mouth: 'wavy' }); const m = benchSit(mia, 1.2, L, { aLx: 2.2, aRx: 2.2, aLz: .25, aRz: .25, aLe: 2.3, aRe: 2.3 }); m.setFace({ eyes: 'squint', mouth: 'grimace' });
  cm([3, 2.4, BZ + 20, 0, 40, BZ - 22, 54], [2, 3, BZ + 17, 0, 42, BZ - 22, 52], L.k); sh(V(0, 0, BZ - 8), 40); },
  [[.0, 'bells', .9], [.05, 'braam', .6], [.6, 'bell_far', .5]]);
// 109 «Ich schlief, bevor sie fertig war.»: yo ya dormido apoyado en Mia, Zzz; Mia me mira con los ojos muy abiertos
shot(165.12, 'I', null, L => { plazaNight(L, 6, 'sitears', 281, { z0: BZ + 12, z1: BZ + 30 }); const c = benchSit(ich, -.6, L, { headZ: -.55, lean: .1, aLz: .05, aRz: .05, twist: .2 }); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T, 1.1);
  const m = benchSit(mia, 1.2, L, { headY: .5, aLx: 1.2, aRx: 1.2, aLz: -.25, aRz: -.25, aLe: 1.2, aRe: 1.2 }); cara(m, L.T, { expr: 'gasp' }); attach(UHR, m.aR.hand, [0, -.5, .4], [0, 0, 0], .22); UHR.userData.set('23:59:58');
  cm([1, 5, BZ + 12, .3, 3.4, BZ, 42], [.8, 4.6, BZ + 10, .3, 3.4, BZ, 40], L.k); sh(V(0, 0, BZ), 12); },
  [[.1, 'snore', .6], [.8, 'gasp_f', .3]]);
// 110 «Mia starrte auf die Uhr,»: primer plano de Mia mirando el reloj fijamente; los segundos: 23:59:59
shot(167.13, 'S', 'slow', L => { plazaNight(L, 2, 'sitears', 291, { z0: BZ + 12, z1: BZ + 20 }); const m = benchSit(mia, 1.2, L, { aLx: 1.5, aRx: 1.5, aLz: -.25, aRz: -.25, aLe: 1.4, aRe: 1.4, headX: .3 }); m.setFace({ eyes: 'down', mouth: 'flat' }); attach(UHR, m.aR.hand, [0, -.5, .4], [-.6, 0, 0], .22); UHR.userData.set('23:59:59');
  onFace(m, 6.4, .1, .2, 40, L.k, 5.2); sh(V(1, 0, BZ), 10); },
  [[.1, 'heartbeat', .6], [.8, 'tick', .5]]);
// 111 «und die ganze Stadt schaute zu.»: todo el pueblo, en pijama, se gira hacia el banco conteniendo el aliento
shot(168.58, 'W', null, L => { plazaNight(L, 24, 'look', 301, { x0: -24, x1: 24, z0: BZ + 8, z1: BZ + 44, face: V(0, 2, BZ), jit: .1, expr: 'gasp' }); benchSit(ich, -.6, L, { headZ: -.5 }); ich.setFace({ eyes: 'closed', mouth: 'o' }); benchSit(mia, 1.2, L, { aLx: 1.5, aRx: 1.5, aLe: 1.4, aRe: 1.4, headX: .3 }); mia.setFace({ eyes: 'down', mouth: 'flat' });
  cm([0, 10, BZ - 8, 0, 3, BZ + 22, 50], [0, 9, BZ - 6, 0, 3, BZ + 20, 48], L.k); sh(V(0, 0, BZ + 14), 30); },
  [[.1, 'crowd_run', .3], [.6, 'heartbeat', .5]]);
// 112 «Drei.»: Mia levanta la vista con el reloj en alto: «3»
shot(170.27, 'C', 'punch', L => { plazaNight(L, 4, 'look', 311, { z0: BZ + 14, z1: BZ + 30, face: V(0, 2, BZ), expr: 'gasp' }); const m = benchSit(mia, 1.2, L, { aRx: 2.4, aRe: .6, aRz: .2 }); cara(m, L.T, { expr: 'determined' }); attach(UHR, m.aR.hand, [0, -.5, .4], [0, 0, 0], .22); UHR.userData.set('3', '#ffd23f');
  badge('red', '3', W / 2, H * .2, (L.lt - .02) / .15, 1, 1.6); onBody(m, 15, .2, .1, 42, L.k, 13, .2, 2.4); sh(V(1, 0, BZ), 12); },
  [[.0, 'heartbeat', .8], [.02, 'tick', .6]]);
// 113 «Zwei.»: corte al sótano: Graufeld duerme; su despertador marca 23:59… «2»
shot(170.79, 'C', 'punch', L => { use('KE'); inside(.25, 8); lp(0, KEX + 2, 6, 2, 22, 0xff4a3a, 18); const c = put(grau, KEX + 6, 3.3, 1.2, .3); c.root.rotation.x = -PI / 2; c.blob.visible = false; actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: -.4, aRz: -.4, aLe: 1.4, aRe: 1.4 }]], { T: L.T, weight: false }); c.setFace({ eyes: 'closed', mouth: 'smirk' });
  show(WK[0], KEX + 2, 2.8, 3, -.4, 1.3); clockAt(WK[0], '23:59', '#ff4a3a'); badge('red', '2', W / 2, H * .2, (L.lt - .02) / .15, 1, 1.6); cm([KEX + 10, 8, -9, KEX + 5.6, 3.4, 0, 46], [KEX + 9.4, 7.6, -8, KEX + 5.6, 3.6, 0, 42], L.k); sh(V(KEX + 4, 0, 1), 14); },
  [[.0, 'heartbeat', .8], [.02, 'tick', .6]]);
// 114 «Eins.»: Mia se pone de pie en el banco, flexiona las rodillas lista para saltar: «1»
shot(171.46, 'C', 'punch', L => { plazaNight(L, 6, 'look', 321, { z0: BZ + 12, z1: BZ + 30, face: V(0, 2, BZ), expr: 'gasp' }); const c = benchSit(ich, -.6, L, { headZ: -.5 }); c.setFace({ eyes: 'closed', mouth: 'o' });
  const m = put(mia, 1.4, SEAT, BZ + .2, -.3); m.blob.visible = false; actuar(m, 0, [[0, { crouch: .5, lean: .3, aLx: -.6, aRx: -.6, aLe: .3, aRe: .3, lLx: .5, lRx: .5, lLk: 1, lRk: 1 }]], { T: L.T }); cara(m, L.T, { expr: 'determined' });
  badge('red', '1', W / 2, H * .2, (L.lt - .02) / .15, 1, 1.6); cm([3, 5, BZ + 11, .3, 3.4, BZ, 44], [2.6, 4.8, BZ + 10, .3, 3.4, BZ, 42], L.k); sh(V(0, 0, BZ), 12); },
  [[.0, 'heartbeat', .8], [.02, 'tick', .6], [.4, 'anticip', .5]]);
// 115 «Sie sprang mit beiden Füßen auf mich drauf.»: cámara lenta: Mia salta con los dos pies sobre mí; el reloj marca 0:00
shot(172.22, 'F', null, L => { plazaNight(L, 10, 'look', 331, { z0: BZ + 12, z1: BZ + 34, face: V(0, 2, BZ), expr: 'gasp' }); const c = benchSit(ich, -.6, L, { headZ: -.5 }); c.setFace({ eyes: 'closed', mouth: 'o' });
  put(mia, 1.4, SEAT - .2, BZ + .2, -.3); saltar(mia, L.lt * .55, 0, { h: 5, dur: .7, base: [1.4, SEAT - .2, BZ + .2], dx: -1.6, dz: .2 }); mia.blob.visible = false; cara(mia, L.T, { expr: 'joy' }); attach(UHR, mia.aR.hand, [0, -.5, .4], [0, 0, 0], .22); UHR.userData.set('0:00', '#8aff6a');
  cm([3, 6, BZ + 14, 0, 6, BZ, 54], [2.6, 6.2, BZ + 13, 0, 6.2, BZ, 52], L.k); sh(V(0, 0, BZ), 14); },
  [[.05, 'whoosh_up', .5], [.7, 'jump', .5], [1.1, 'thud', .6]]);
// 116 «„AUFWACHEN!“»: abro los ojos de golpe; Mia encima gritando; el reloj 0:00; chispas doradas explotan y todo el pueblo se levanta
shot(174.30, 'C', 'punch', L => { plazaNight(L, 16, 'cheer', 341, { z0: BZ + 12, z1: BZ + 40, face: V(0, 2, BZ) }); bloom.strength = .5; const c = benchSit(ich, -.6, L, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9, lean: -.1 }); c.setFace({ eyes: 'wide', mouth: 'grimace_wide' });
  const m = put(mia, -.2, SEAT + 1.4, BZ + 1.6, .2); m.blob.visible = false; actuar(m, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, aLe: .2, aRe: .2, headX: -.2 }]], { T: L.T }); talk(m, L.T, L.t0, L.t1, 'shout', { eyes: 'happy' });
  SPK.S.forEach(s => s.material.color.setHex(0xfff2a0)); SPK.at(V(-.4, 0, BZ), L.T, 1, 4, 9, 34); confetti(V(-.4, 2, BZ), L.t0, L.T, 40, 1.4); TURM.setClock(0, 0, .8);
  cm([0, 5.6, BZ + 13, -.3, 4.4, BZ, 44], [0, 5.4, BZ + 11, -.3, 4.4, BZ, 42], L.k); sh(V(0, 0, BZ), 16); },
  [[.0, 'scream_girl', .3], [.02, 'impact', .7], [.1, 'magic_hit', .7], [.2, 'cheer', .6], [.4, 'sparkle', .6]]);

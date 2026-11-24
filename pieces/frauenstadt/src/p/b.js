// ---------- b: el hermano, el tío, el primo, el padre y los Pflichtkurse (28,2 – 62,8 s) ----------
// Aula (KLX): pizarra (0, 10,5, -15,45); pupitres en x = -11, 0, 11 y z = -2, 6, 14 (silla en z + 2,8, asiento ≈ 2,6); mesa de la profe (-8, -10).
// Restaurante (REX): mesa en (0, 0) con tablero a 3,85; sillas en z = ±3,4 (asiento ≈ 2,9). Supermercado: fachada oeste en x = -43, z = -43,5.
const SEAT = 2.75, RSEAT = 2.95;
const kinder = L => klasseS(L, { board: ['KINDERGARTEN', 'GRUPPE SONNENSCHEIN'] });
const KA = KLX + 5.5, KZ0 = -7.5;
const kids = (L, n = 6) => { for (let i = 0; i < n; i++) { const c = EX[10 + i], x = KLX - 11 + (i % 3) * 11, z = 6 + Math.floor(i / 3) * 8; sit(c, x, SEAT, z + 2.8, PI, L, { aLx: .9, aRx: .9, aLe: 1, aRe: 1, headY: Math.sin(L.T + i) * .3 }); c.root.scale.setScalar(.6); c.root.position.y = SEAT + .1 - 2.05 * .6; cara(c, L.T + i, { expr: i % 2 ? 'happy' : 'neutral' }); } };

// 23 «Mein kleiner Bruder hat im Kindergarten»: Paul (≈5) en su pupitre jugando con un dinosaurio; la pizarra «KINDERGARTEN»
shot(28.20, 'W', null, L => { kinder(L); kids(L, 4); const c = sit(paulK, KLX, SEAT, -2 + 2.8, PI, L, { aRx: 1.2 + Math.sin(L.T * 6) * .3, aRe: 1.2, aLx: .9, aLe: 1.2 }); c.root.position.y = sitY(c, SEAT); grin(c, L.T); show(PONY, KLX + 1.2, 3.9, -2, 0, .6);
  cm([KLX + 4.5, 7, -11], [KLX + 3, 6.2, -7.5], L.k); camera.lookAt(KLX, 4.2, .8); camera.fov = 44; sh(V(KLX, 0, 0), 22); }, [[0, 'kids_laugh', .4], [.4, 'toy', .4]]);
// 24 «einem Mädchen widersprochen.»: Mia le dice algo; Paul niega con la cabeza y se cruza de brazos
shot(29.54, 'C', null, L => { kinder(L); const p = put(paulK, KA - 1.7, 0, KZ0, PI / 2); actuar(p, 0, [[0, { ...GEST.cross, headY: Math.sin(L.T * 12) * .35 }]], { T: L.T }); cara(p, L.T, { expr: 'determined', mouth: 'flat' });
  const m = put(mia, KA + 1.7, 0, KZ0, -PI / 2); actuar(m, 0, [[0, { aRx: 1.6, aRe: .2, lean: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'angry', mouth: 'talk_wide' }); bubble(m, 'Ponys sind die Besten!', clamp(L.lt / .15), 1.6);
  orb(L.k, V(KA, 2.6, KZ0), null, [9, .05, .12, 44], [7.8, -.05, .1, 44]); sh(V(KA, 0, KZ0), 12); }, [[0, 'gasp_f', .4], [.3, 'cloth', .3]]);
// 25 «Seitdem sitzt er in Einzelhaft.»: Paul, ya mayor, solo en la celda; los barrotes delante
shot(30.84, 'F', null, L => { zelleS(L, { tally: '12 JAHRE', n: 12 }); const c = sit(paulJ, ZEX - 3, 2.7, -7, 0, L, { headX: .45, aLx: .5, aRx: .5, aLe: 1.1, aRe: 1.1 }); cara(c, L.T, { expr: 'sad' });
  cm([ZEX + 4, 7, 15], [ZEX + 2, 6.4, 10.5], L.k); camera.lookAt(ZEX - 3, 5, -7); camera.fov = 42; sh(V(ZEX, 0, -4), 14); }, [[0, 'metal_creak', .5], [.3, 'drip', .3]]);
// 26 «Zwölf Jahre.»: las rayitas en la pared: «12 JAHRE»
shot(32.14, 'Z', 'punch', L => { zelleS(L, { tally: '12 JAHRE', n: 12 }); const c = sit(paulJ, ZEX - 3, 2.7, -7, 0, L, { headX: -.3, headY: -.4 }); cara(c, L.T, { expr: 'sad' });
  cm([ZEX - 4.5, 7.4, 1], [ZEX - 5.4, 7.3, -2.4], L.k); camera.lookAt(ZEX - 6, 7.2, -8.7); camera.fov = 44; badge('red', '12 JAHRE', W / 2, H * .2, clamp(L.lt / .15), 1, 1.0); sh(V(ZEX, 0, -4), 14); }, [[0, 'chalk', .6], [.1, 'impact', .4]]);
// 27 «Denn er hat gesagt:»: vuelta al Kindergarten: Paul se sube a la silla
shot(33.31, 'S', null, L => { kinder(L); kids(L, 5); const up = easeOut(clamp(L.lt / .4)); show(STAGE.g, 0, -500, 0); const p = put(paulK, KA, up * 1.6, KZ0, 0); { const ch_ = new THREE.Object3D(); } actuar(p, 0, [[0, { aLx: .5, aRx: 1.0, lLx: -.4 * (1 - up), lLk: .8 * (1 - up) }]], { T: L.T }); cara(p, L.T, { expr: 'determined' });
  orb(L.k, V(KA, 3.2, KZ0), null, [9, .1, .2, 44], [7.6, 0, .12, 44]); sh(V(KA, 0, KZ0), 14); }, [[0, 'chair_roll', .4]]);
// 28 «Fußball ist besser als Ponys.»: Paul con el balón, mirando a Mia: lo dice (labios); Mia con su poni se queda boquiabierta
shot(34.19, 'C', 'punch', L => { kinder(L); const p = put(paulK, KA - 1.8, 0, KZ0, PI / 2 - .3); actuar(p, 0, [[0, { aRx: 2.2, aRz: .1, aRe: .9, aLx: .4 }]], { T: L.T }); talk(p, L.T, 34.19, 35.73, 'determined'); attach(BALL, p.aR.hand, [0, -.9, .3], [0, 0, 0], .8);
  const m = put(mia, KA + 1.8, 0, KZ0, -PI / 2 + .3); actuar(m, L.lt, [[0, 'idle'], [.7, GEST.shock, { dur: .2 }]], { T: L.T }); cara(m, L.T, { expr: L.lt < .7 ? 'neutral' : 'gasp' }); attach(PONY, m.aL.hand, [0, -.9, .3], [0, 0, 0], .7);
  bubble(p, 'Fußball > Ponys!', clamp((L.lt - .1) / .15), 1.6); orb(L.k, V(KA, 2.7, KZ0), null, [9, .1, .1, 44], [7.6, 0, .08, 44]); sh(V(KA, 0, KZ0), 12); }, [[0, 'kick', .4], [.7, 'gasp_f', .6]]);
// 29 «Mein Onkel hat einer Frau vor dem Lidl»: delante del supermercado: el tío Rolf saluda a una señora con dos bolsas
shot(36.23, 'W', null, L => { town(L, { statue: false }); const w = put(tfrau, -38, 0, -46, PI / 2); actuar(w, 0, [[0, { ...GEST.hold, lean: .15, crouch: .1 }]], { T: L.T }); cara(w, L.T, { expr: 'tired' }); show(BAGS[0], -37, 0, -47.2, 0); show(BAGS[1], -37, 0, -44.8, 0);
  const r = put(rolf, -30 + L.lt * -2, 0, -46, -PI / 2); actuar(r, 0, [[0, { ...walkP(L.T, 0), aRx: 2.6, aRz: .3, aRe: .4 }]], { T: L.T }); cara(r, L.T, { expr: 'happy' }); crowdAt(L, -30, -36, 5, 8, 20, 8, { mode: 'walk' });
  orb(L.k, V(-36, 5, -46), null, [26, .9, .1, 46], [22, .7, .08, 46]); sh(V(-36, 0, -46), 24); }, [[0, 'city_amb', .5], [.4, 'steps', .4]]);
// 30 «die Einkaufstüten getragen.»: Rolf lleva las dos bolsas; ella sonríe… al principio
shot(37.76, 'C', null, L => { town(L, { statue: false }); const r = put(rolf, -34 + L.lt * 1.5, 0, -44, PI / 2 - .3); actuar(r, 0, [[0, { ...walkP(L.T, 0), aLx: .2, aRx: .2, aLz: .1, aRz: .1 }]], { T: L.T }); grin(r, L.T); attach(BAGS[0], r.aL.hand, [0, -2.2, 0], [0, 0, 0], .9); attach(BAGS[1], r.aR.hand, [0, -2.2, 0], [0, 0, 0], .9);
  const w = put(tfrau, -32 + L.lt * 1.5, 0, -48, PI / 2 - .3); actuar(w, 0, [[0, walkP(L.T, 1)]], { T: L.T }); cara(w, L.T, { expr: 'smile' }); orb(L.k, V(-32 + L.lt * 1.5, 4, -46), null, [17, 1.9, .1, 44], [15, 1.7, .08, 44]); sh(V(-32, 0, -46), 18); },
  [[0, 'paper', .5], [.3, 'steps', .4]]);
// 31 «25 Jahre.»: dos guardianas le ponen las esposas; las bolsas caen al suelo
shot(39.45, 'Z', 'punch', L => { town(L, { statue: false }); const r = put(rolf, -32, 0, -44, PI / 2); actuar(r, 0, [[0, { aLx: -.5, aRx: -.5, aLz: .2, aRz: .2, aLe: .4, aRe: .4, lean: .15 }]], { T: L.T }); cara(r, L.T, { expr: 'scream' });
  for (const s of [-1, 1]) { const g = put(WA[s < 0 ? 0 : 1], -32 + s * 2.6, 0, -46.4, s < 0 ? .7 : -.7); actuar(g, 0, [[0, { aLx: 1.2, aRx: 1.2, lean: .2 }]], { T: L.T }); cara(g, L.T, { expr: 'angry' }); }
  const f = easeIn(clamp(L.lt / .4)); show(BAGS[0], -31, 2.2 * (1 - f), -42.6, f * .8); show(BAGS[1], -30.6, 2.2 * (1 - f), -45.4, -f * 1.2); dust(V(-31, 0, -44), L.t0 + .4, L.T, 6, .6);
  badge('red', '25 JAHRE', W / 2, H * .2, clamp(L.lt / .12), 1, 1.1); orb(L.k, V(-32, 4.2, -44.6), null, [15, 1.4, .12, 44], [13, 1.6, .1, 44]); sh(V(-32, 0, -44), 16); }, [[0, 'click_metal', .7], [.35, 'thud', .5], [.4, 'siren', .3]]);
// 32 «Weil er damit angedeutet hat,»: la señora le señala furiosa; la guardiana apunta en la libreta
shot(40.72, 'F', null, L => { town(L, { statue: false }); const w = put(tfrau, -36, 0, -46, PI / 2); actuar(w, 0, [[0, { ...GEST.point, lean: .1 }]], { T: L.T }); cara(w, L.T, { expr: 'furious' });
  const g = put(WA[0], -31.5, 0, -49, -.5); actuar(g, 0, [[0, { aLx: 1.1, aLe: 1.6, aRx: 1.0, aRz: -.3, aRe: 1.8, headX: .35 }]], { T: L.T }); attach(CLIP, g.aL.hand, [0, -.4, .3], [-.4, 0, 0], 1); cara(g, L.T, { expr: 'determined' });
  onFace(w, 8, -.2, -1.6, 42, L.k, 7); sh(V(-34, 0, -46), 14); }, [[0, 'shout_m', .2], [.3, 'pencil', .5]]);
// 33 «sie wäre zu schwach dafür.»: ella levanta las dos bolsas de un tirón, como pesas; «ICH SCHAFF DAS ALLEIN!»
shot(41.78, 'C', 'punch', L => { town(L, { statue: false }); const k = easeOut(clamp(L.lt / .35)); const w = put(tfrau, -36, 0, -46, PI / 2 + .5); actuar(w, 0, [[0, { aLx: lerp(.3, 2.9, k), aRx: lerp(.3, 2.9, k), aLz: .4, aRz: .4, aLe: .4, aRe: .4, lean: -.1 }]], { T: L.T }); cara(w, L.T, { expr: 'angry', mouth: 'grin' });
  attach(BAGS[0], w.aL.hand, [0, -2.2, 0], [0, 0, 0], .9); attach(BAGS[1], w.aR.hand, [0, -2.2, 0], [0, 0, 0], .9); bubble(w, 'ICH SCHAFF DAS ALLEIN!', clamp((L.lt - .2) / .15), 3.2);
  orb(L.k, V(-36, 4.6, -46), null, [16, 2.3, -.05, 46], [14, 2.1, -.08, 44]); sh(V(-36, 0, -46), 14); }, [[0, 'whoosh_up', .5], [.3, 'impact', .4]]);
// 34 «Und mein Cousin?»: Kevin se arregla la gorra delante del espejo del restaurante y guiña
shot(43.11, 'S', null, L => { restS(L); const c = put(kevin, REX + 6, 0, 8, -.5); actuar(c, 0, [[0, { aRx: 2.6, aRz: -.2, aRe: 1.8, headZ: Math.sin(L.T * 3) * .1 }]], { T: L.T }); cara(c, L.T, { expr: 'wink' });
  onFace(c, 7, 0, .8, 42, L.k, 5.6); sh(V(REX + 6, 0, 8), 12); }, [[0, 'zip', .4], [.3, 'ding_soft', .5]]);
// 35 «Der hatte sein erstes Date.»: Kevin y Selin a la mesa, vela encendida; corazones
shot(43.97, 'W', null, L => { restS(L); const k = sit(kevin, REX, RSEAT, 3.4, PI, L, { aLx: 1.2, aRx: 1.2, aLe: 1.2, aRe: 1.2 }); grin(k, L.T); const s_ = sit(selin, REX, RSEAT, -3.4, 0, L, { aRx: 1.4, aRe: 1.8, aLx: 1.1, aLe: 1.4, headZ: .15 }); cara(s_, L.T, { expr: 'love' }); show(BILL, REX + 30, 0, 0);
  hearts(V(REX, 6, 0), L.t0, L.T, 6, .8); crowdAt(L, REX, -6, 4, 12, 18, 9, { mode: 'talk', from: 18 });
  orb(L.k, V(REX, 4.2, 0), null, [18, -1.1, .2, 44], [15, -1.3, .16, 44]); sh(V(REX, 0, 0), 16); }, [[0, 'piano_note', .4], [.3, 'spoon', .3]]);
// 36 «Am Ende hat er gesagt:»: la cuenta llega a la mesa
shot(45.39, 'C', null, L => { restS(L); const k = sit(kevin, REX, RSEAT, 3.4, PI, L, { aLx: 1.2, aRx: 1.2, aLe: 1.2, aRe: 1.2 }); cara(k, L.T, { expr: 'gasp' }); const s_ = sit(selin, REX, RSEAT, -3.4, 0, L, { aLx: 1.1, aRx: 1.1, aLe: 1.4, aRe: 1.4 }); cara(s_, L.T, { expr: 'smile' });
  show(BILL, REX + lerp(4, .4, easeOut(clamp(L.lt / .4))), 4.0, .6, .2); cm([REX + 8, 7.4, 1.4], [REX + 6.4, 6.6, 1], L.k); camera.lookAt(REX + .2, 4.2, .2); camera.fov = 44; sh(V(REX, 0, 0), 10); }, [[0, 'plate_slide', .6]]);
// 37 «Lass uns die Rechnung teilen.»: Kevin lo dice (labios) con una sonrisa; a Selin se le borra la sonrisa
shot(46.51, 'Z', null, L => { restS(L); const k = sit(kevin, REX, RSEAT, 3.4, PI, L, { aRx: 1.5, aRz: -.3, aRe: .4, aLx: 1.2, aLe: 1.2 }); talk(k, L.T, 46.51, 47.59, 'happy'); show(BILL, REX + .4, 4.0, .6, .2);
  const s_ = sit(selin, REX, RSEAT, -3.4, 0, L, { aLx: 1.1, aRx: 1.1, aLe: 1.4, aRe: 1.4 }); cara(s_, L.T, { expr: L.lt > .5 ? 'angry' : 'smile' }); bubble(k, 'Lass uns teilen!', clamp(L.lt / .15), 1.6);
  onFace(k, 7.4, 0, -1.4, 42, L.k, 6.4); sh(V(REX, 0, 0), 12); }, [[0, 'paper', .4]]);
// 38 «Lebenslang.»: las guardianas entran y se lo llevan esposado de la silla
shot(48.09, 'C', 'punch', L => { restS(L); const k = put(kevin, REX + L.lt * 2, 0, 5.6, PI); actuar(k, 0, [[0, { aLx: -.4, aRx: -.4, aLz: .2, aRz: .2, lean: -.2, lLx: .4, lRx: -.3 }]], { T: L.T }); cara(k, L.T, { expr: 'scream' });
  for (const s of [-1, 1]) { const g = put(WA[s < 0 ? 0 : 2], REX + s * 2.6 + L.lt * 2, 0, 7.2, PI); actuar(g, 0, [[0, { aLx: 1.2, aRx: 1.2, lean: -.1 }]], { T: L.T }); cara(g, L.T, { expr: 'angry' }); }
  const s_ = sit(selin, REX, RSEAT, -3.4, 0, L, { ...GEST.cross }); cara(s_, L.T, { expr: 'smug' }); badge('red', 'LEBENSLANG', W / 2, H * .2, clamp(L.lt / .12), 1, 1.1);
  orb(L.k, V(REX + 1, 4.4, 3), null, [18, -.4, .14, 44], [16, -.5, .12, 44]); sh(V(REX, 0, 3), 16); }, [[0, 'click_metal', .7], [.1, 'shout_m', .3], [.2, 'chair_roll', .4]]);
// 39 «Denn hier zahlt der Mann.»: en la caja, una fila de hombres paga; las mujeres salen sin pagar
shot(48.76, 'W', null, L => { restS(L); for (let i = 0; i < 4; i++) { const c = put(INS[12 + i], REX + 10, 0, 12 - i * 3.6, PI / 2); actuar(c, 0, [[0, { aRx: 1.4, aRe: .6, headX: .2 }]], { T: L.T }); cara(c, L.T + i, { expr: 'sad' }); }
  for (let i = 0; i < 3; i++) { const c = put(EX[i * 2], REX + 2 - L.lt * 4, 0, 14 + i * 2.6, -PI / 2); actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); cara(c, L.T + i, { expr: 'happy' }); }
  coins(V(REX + 10, 3, 12), L.t0, L.T, 8); cm([REX - 6, 7, 26], [REX - 3, 6.4, 22], L.k); camera.lookAt(REX + 6, 4, 8); camera.fov = 46; sh(V(REX + 6, 0, 10), 18); }, [[0, 'cash_reg', .6], [.4, 'coin_flip', .4]]);
// 40 «Immer.»: una cartera abierta, vacía; una polilla sale volando (primer plano)
shot(49.96, 'C', 'punch', L => { restS(L); const c = put(INS[12], REX + 10, 0, 12, PI / 2); actuar(c, 0, [[0, { aRx: 1.6, aRe: 1.4, aLx: 1.6, aLe: 1.4, headX: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'cry' }); tears(c, L.T);
  onFace(c, 6, .2, 0, 42, L.k, 5); sh(V(REX + 10, 0, 12), 10); }, [[0, 'sad_tone', .5]]);
// 41 «Auch wenn er nur Wasser bestellt hat.»: en la mesa de Kevin: su vaso de agua frente a los platos y el vino de ella
shot(50.42, 'S', null, L => { restS(L); show(BILL, REX + .4, 4.0, .6, .2); cm([REX - 3.4, 6.2, -4], [REX - 2.6, 5.4, -3.2], L.k); camera.lookAt(REX - 1.6, 4.4, -1.2); camera.fov = 38; badge('cyan', '0 €', W / 2, H * .2, clamp((L.lt - .3) / .15), 1, 1); sh(V(REX, 0, 0), 8); }, [[0, 'water_bloop', .6], [.4, 'glass_rattle', .3]]);
// 42 «Mein Vater sagt, früher war alles andersrum.»: en el patio, el viejo Dieter cuenta su historia a los presos jóvenes (labios)
shot(51.80, 'R', null, L => { knast(L); const d = sit(dieter, KNX - 4, 2.4, 6, .3, L, { aRx: 1.3 + Math.sin(L.T * 3) * .3, aRz: -.2, aRe: .8, aLx: .7, aLe: 1.2 }); talk(d, L.T, 52.85, 54.13, 'warm');
  crowdAt(L, KNX - 4, 6, 5, 6, 10, 11, { list: INS, from: 4, face: V(KNX - 4, 0, 6), jit: .15, mode: 'idle', expr: 'confused' });
  orb(L.k, V(KNX - 4, 4, 6), null, [16, .6, .14, 44], [13, .4, .12, 44]); sh(V(KNX - 4, 0, 6), 18); }, [[0, 'wind', .3], [.4, 'cough', .3]]);
// 43 «Keiner glaubt ihm.»: los jóvenes se ríen y se van; Dieter suspira
shot(54.30, 'C', null, L => { knast(L); const d = sit(dieter, KNX - 4, 2.4, 6, .3, L, { headX: .4, aLx: .3, aRx: .3 }); cara(d, L.T, { expr: 'sad' });
  crowdAt(L, KNX - 4, 6, 5, 6, 10, 11, { list: INS, from: 4, face: V(KNX - 4, 0, 6), jit: .15, mode: i => i % 2 ? 'cheer' : 'walk', speed: -1.2 });
  onFace(d, 8, .3, 1, 42, L.k, 7); sh(V(KNX - 4, 0, 6), 14); }, [[0, 'laugh_deep', .5], [.3, 'sigh', .5]]);
// 44 «Im Gefängnis gibt es sogar Pflichtkurse.»: aula de la cárcel: presos en pupitres; la profe golpea la pizarra
const kursRoom = (L, t, n = 6) => { klasseS(L, { board: t }); for (let i = 0; i < n; i++) { const c = INS[i], x = KLX - 11 + (i % 3) * 11, z = -2 + Math.floor(i / 3) * 8; sit(c, x, SEAT, z + 2.8, PI, L, { aLx: .9, aRx: .9, aLe: 1, aRe: 1 }); } };
shot(55.24, 'W', null, L => { kursRoom(L, ['PFLICHTKURSE', 'FÜR MÄNNER']); INS.slice(0, 6).forEach((c, i) => cara(c, L.T + i, { expr: 'bored' })); const t = put(lehr, KLX + 4, 0, -11, 0); actuar(t, L.lt, [[0, { aRx: 2.4, aRz: -.2, aRe: .5, headY: -.4 }], [.5, { aRx: 2.0, aRe: .8 }, { dur: .15 }]], { T: L.T }); cara(t, L.T, { expr: 'angry' });
  cm([KLX + 12, 10, 22], [KLX + 6, 9, 15], L.k); camera.lookAt(KLX, 6, -6); camera.fov = 46; sh(V(KLX, 0, 0), 22); }, [[0, 'classroom', .4], [.5, 'knock', .6]]);
// 45 «Zuhören für Anfänger»: la pizarra; los presos se llevan la mano a la oreja
shot(57.27, 'Z', null, L => { kursRoom(L, ['ZUHÖREN FÜR ANFÄNGER', 'KURS 1']); INS.slice(0, 6).forEach((c, i) => { actuar(c, 0, [[0, { ...sitPose(GEST.listen) }]], { T: L.T, weight: false }); cara(c, L.T + i, { expr: 'confused' }); });
  cm([KLX - 6, 8, 12], [KLX - 3, 9.4, 4], L.k); camera.lookAt(KLX, 9.6, -15); camera.fov = 44; sh(V(KLX, 0, 0), 22); }, [[0, 'chalk', .6]]);
// 46 «Entschuldigen ohne Grund»: todos de pie se inclinan pidiendo perdón a la vez
shot(58.55, 'F', null, L => { klasseS(L, { board: ['ENTSCHULDIGEN OHNE GRUND', 'KURS 2'] }); for (let i = 0; i < 6; i++) { const c = put(INS[i], KLX - 10 + i * 4, 0, -5.4 - (i % 2) * .6, PI); const b = .5 + .4 * Math.sin(clamp(L.lt / .5) * PI / 2); actuar(c, 0, [[0, { lean: b, headX: .3, aLx: .3, aRx: .3, aLz: -.1, aRz: -.1 }]], { T: L.T }); cara(c, L.T + i, { expr: 'sad', eyes: 'closed' }); }
  const t = put(lehr, KLX - 8, 0, -12.5, .4); actuar(t, 0, [[0, 'cross']], { T: L.T }); cara(t, L.T, { expr: 'smug' });
  cm([KLX + 9, 7.6, -14], [KLX + 6, 8, -14.4], L.k); camera.lookAt(KLX, 4, -4); camera.fov = 48; sh(V(KLX, 0, -4), 22); }, [[0, 'cloth', .5], [.2, 'whisper', .5]]);
// 47 «Und mein Lieblingskurs:»: yo (Ben) en mi pupitre, sonriendo con el lápiz preparado
shot(59.92, 'S', null, L => { kursRoom(L, ['', ''], 0); const c = sit(ben, KLX, SEAT, 2.8, PI, L, { aRx: 1.1, aRe: 1.5, aLx: .9, aLe: 1.2 }); grin(c, L.T);
  onFace(c, 8.4, -.4, -.8, 42, L.k, 7.2); sh(V(KLX, 0, 2), 12); }, [[0, 'pencil', .5]]);
// 48 «Recht haben ist nicht wichtig»: levanto la mano para opinar; la profe me manda callar y bajo la mano
shot(60.84, 'C', 'punch', L => { kursRoom(L, ['RECHT HABEN IST NICHT WICHTIG', 'KURS 3']); INS.slice(0, 6).forEach((c, i) => cara(c, L.T + i, { expr: 'bored' }));
  const c = sit(ben, KLX, SEAT, 10.8, PI, L, {}); actuar(c, L.lt, [[0, sitPose({ aRx: 2.9, aRe: .2 })], [.9, sitPose({ aRx: .6, aRe: 1.2, headX: .4 }), { dur: .3 }]], { T: L.T, weight: false }); cara(c, L.T, { expr: L.lt < .9 ? 'happy' : 'sad' });
  const t = put(lehr, KLX + 2, 0, -8, PI + .2); actuar(t, 0, [[0, { aRx: 2.2, aRz: -.4, aRe: 2.3, headX: .1 }]], { T: L.T }); cara(t, L.T, { expr: 'angry', mouth: 'o' }); bubble(t, 'PSST!', clamp((L.lt - .5) / .15), 1.6);
  cm([KLX + 16, 9, 8], [KLX + 15, 8.4, 5], L.k); camera.lookAt(KLX + 1, 6, 1); camera.fov = 48; sh(V(KLX, 0, 2), 22); }, [[0, 'chalk', .5], [.6, 'whisper', .6], [1.0, 'sad_tone', .3]]);

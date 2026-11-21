// ---------- b: el vecino y sus 40, la fiesta, la noche de los ladrones, las barras, la Oma y el alcalde (33,9 – 77,9 s) ----------
const garden = () => { use('GT'); day(); };
// 40 Lirilì en la hierba del jardín (rejilla 8 × 5 con jitter), botando un poco
const herd40 = (T, n = 40, night_ = 0) => { LIH.show(n); for (let i = 0; i < n; i++) { const r = RNG(i * 7 + 3), x = TX - 15 + (i % 8) * 3.7 + (r() - .5) * 1.2, z = -20 + (i / 8 | 0) * 4.6 + (r() - .5) * 1.2; LIH.set(i, x, Math.abs(Math.sin(T * 3 + i)) * .12, z, (r() - .5) * .8 + (night_ ? 0 : Math.sin(T + i) * .1), .82); } };
const lieOn = (ch, x, y, z, ry = 0, rec = .35) => { put(ch, x, y, z, ry); ch.root.rotation.set(-PI / 2 + rec, ry, 0, 'YXZ'); applyPose(ch, { aLx: 2.9, aLz: .4, aLe: 1.6, aRx: 2.9, aRz: .4, aRe: 1.6, lLx: .1, lRx: -.05, headX: -.2 }); return ch; };
const sitOn = (ch, x, y, z, ry, extra = {}) => { put(ch, x, y, z, ry); applyPose(ch, { lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, hipY: 1.55, ...extra }); return ch; };
// 26 «Mein Nachbar hat»: en su tumbona, saluda con gafas de sol
shot(33.89, 'I', null, L => { garden(); const n = lieOn(nb, TX + 16, 2.2, 8.6, 0); applyPose(n, { aRx: 2.9, aRz: .4 + Math.sin(L.T * 9) * .35, aRe: .4, aLx: 2.9, aLz: .4, aLe: 1.6, headX: -.5 }); grin(n, L.T);
  herd40(L.T, 18); orb(L.k, V(TX + 16, 2.6, 5.4), null, [12, -.45, .7, 44], [10.5, -.4, .66, 42]); sh(V(TX + 10, 0, 2), 30); }, [[0, 'iris_pop', .5], [.2, 'birds', .3], [.5, 'laugh_m', .3]]);
// 27 «40 Lirilì Larilà im Garten»: el jardín lleno, el número en grande
shot(34.63, 'Z', null, L => { garden(); herd40(L.T); lieOn(nb, TX + 16, 2.2, 8.6, 0); grin(nb, L.T);
  cm([TX - 4, 17, 20, TX - 2, 1, -8, 50], [TX - 2, 14, 17, TX - 2, 1, -8, 48], L.k); sh(V(TX, 0, -6), 40); badge('gold', '40', W / 2, H * .15, (L.lt - .1) * 3, 1, 1.3); }, [[0, 'zoom_out', .5], [.2, 'ding_reveal', .5], [.6, 'toy', .3], [1.3, 'murmur', .3]]);
// 28 «Der war seit sechs Jahren nicht mehr arbeiten»: duerme en la tumbona sobre un montón de monedas
shot(36.81, 'W', null, L => { garden(); GT.MONEY.visible = true; const n = lieOn(nb, TX + 16, 2.2, 8.6, 0); cara(n, L.T, { eyes: 'closed', mouth: 'o', noBlink: 1 }); zzz(hp(n).add(V(.6, 1.6, 0)), L.T);
  herd40(L.T, 12); orb(L.k, V(TX + 16, 2.4, 5.2), null, [12, -.35, .5, 44], [11, -.3, .48, 42]); sh(V(TX + 14, 0, 6), 30); badge('big', '6 JAHRE', W / 2, H * .17, (L.lt - .2) * 3, 1, .9); }, [[0, 'snore', .45], [.6, 'coins', .4], [1.3, 'snore', .4]]);
// 29 «Und einmal im Jahr gibt's das große Fest»: banderines, globos, confeti y la gente bailando en la calle
shot(38.90, 'F', null, L => { street(); OR.FEST.visible = true; const z0 = -32; const P = [ich, K[0], K[4], XT[0], K[2], XT[2], K[7]];
  P.forEach((c, i) => { const x = -7 + i * 2.4, z = z0 + (i % 2) * 2.2; put(c, x, Math.abs(Math.sin(L.T * 5 + i)) * .5, z, Math.sin(i) * .3); actuar(c, L.lt, [[0, i % 2 ? 'cheer' : 'wave']], { T: L.T + i }); grin(c, L.T + i); });
  confetti(V(0, 6, z0), 0, L.lt % 2.2, 60); cm([0, 6.4, z0 + 17, 0, 6, z0 - 6, 50], [0, 5.6, z0 + 13.5, 0, 6.4, z0 - 6, 48], L.k); sh(V(0, 0, z0), 30); }, [[0, 'party_horn', .5], [.2, 'cheer', .5], [.6, 'confetti', .5], [1.4, 'firework', .4], [1.9, 'cheer', .4]]);
// 30 «Da regnet es gratis Tiere vom Himmel»: llueven Tiere sobre la calle de la fiesta y la gente los atrapa
shot(41.16, 'S', null, L => { street(); OR.FEST.visible = true; const z0 = -36;
  RAIN.forEach((h, j) => { h.show(h.n); for (let i = 0; i < h.n; i++) { const r = RNG(i * 9 + j * 31); r(); r(); const x = (r() - .5) * 13, z = z0 - r() * 22 + 2, y = ((40 + r() * 30) - (L.lt * (12 + r() * 6)) % 70); h.set(i, x, Math.max(0, y), z, r() * 6, .7, Math.sin(L.T * 2 + i) * .3, Math.cos(L.T * 2 + i) * .3); } });
  [K[1], XT[1], K[5]].forEach((c, i) => { put(c, -4 + i * 4, 0, z0 + 6 - (i % 2) * 2, Math.sin(i) * .2); actuar(c, L.lt, [[0, 'cheer']], { T: L.T + i }); grin(c, L.T + i); });
  cm([0, 4, z0 + 20, 0, 12, z0 - 6, 54], [0, 4.4, z0 + 18, 0, 13, z0 - 6, 52], L.k); sh(V(0, 0, z0), 40); badge('green', 'GRATIS!', W / 2, H * .14, (L.lt - .3) * 3, 1, .9); }, [[0, 'whoosh_down', .5], [.3, 'pop', .4], [.6, 'land', .4], [.9, 'pop', .4], [1.2, 'land', .4], [1.5, 'cheer', .4], [1.8, 'land', .4]]);
// 31 «Aber in der Nacht macht keiner ein Auge zu»: de noche, cada vecino vigila su jardín con los ojos como platos
shot(43.33, 'I', null, L => { street(); night(); const W_ = [[XT[3], LI[0], -4.2, 0], [K[0], TG[0], 4.4, -7], [lehrer, CA, -4, -16]];
  W_.forEach(([c, b, x, z], i) => { const s = x < 0 ? 1 : -1; put(c, x, 0, z, s * .35); actuar(c, L.lt, [[0, 'hug_self']], { T: L.T + i }); cara(c, L.T, { eyes: 'wide', mouth: 'flat', look: [Math.sin(L.T * 3 + i) * .6, 0], noBlink: 1 }); beast(b, x - s * 2.2, 0, z - 1.6, s * .35); b.pose(L.T, { face: { eyes: 'closed' } }); });
  cm([0, 6.4, 17, 0, 3.4, -6, 46], [0, 6, 13.5, 0, 3.4, -7, 46], L.k); sh(V(0, 0, -6), 40); }, [[0, 'crickets', .5], [.6, 'owl', .4], [1.2, 'heartbeat', .4]]);
// 32 «Denn jeder versucht, dir deine zu klauen»: un ladrón se lleva un Lirilì bajo el brazo, de puntillas
shot(45.60, 'W', null, L => { garden(); night(); herd40(L.T, 40, 1); const x = TX - 9 + L.lt * 2.6, z = 6; const d = put(dieb, x, 0, z, PI / 2); const p = { ...GEST.sneak, aRx: .9, aRe: 1.4, lLx: Math.sin(L.T * 6) * .5, lRx: -Math.sin(L.T * 6) * .5 }; applyPose(d, p); cara(d, L.T, { expr: 'sus', mouth: 'smirk' });
  const b = beast(LI[1], x + 1.4, 2.4, z + .8, PI / 2, .55); b.pose(L.T, { face: { eyes: 'wide' } }); b.root.rotation.z = -.5;
  orbit(V(x + .8, 3, z), 12, .35, .12, 44); sh(V(x, 0, z), 30); }, [[0, 'steps', .3], [.5, 'sneak' && 'crawl', .4], [1.2, 'tension_str', .4], [1.8, 'creepy_ting', .3]]);
// 33 «Mein Nachbar sitzt die ganze Nacht mit einer Taschenlampe vor seinem Zaun»: sentado en su silla, alumbra el jardín
shot(47.85, 'Z', null, L => { garden(); night(); herd40(L.T, 32, 1); show(CHAIR, TX + 20, 0, -6, -PI / 2); const n = sitOn(nb, TX + 20.2, .3, -6, -PI / 2, { aRx: 1.4, aRz: -.1, aRe: .3, aLx: .5, aLz: .2, aLe: .8 }); cara(n, L.T, { eyes: 'wide', mouth: 'flat', noBlink: 1 });
  const sw = Math.sin(L.T * 1.6) * .5; n.spine.rotation.y = sw * .6; attach(FLASHL, n.aR.hand, [0, -.5, .3], [-1.5, 0, 0], 1); TORCH.intensity = 110; FLASHL.updateMatrixWorld(true); TORCH.position.copy(wpos(FLASHL)); TORCH.target.position.set(TX - 2, 0, -6 + sw * 14);
  orb(L.k, V(TX + 19, 3.2, -6), null, [13, -PI / 2 + .8, .14, 44], [11.5, -PI / 2 + .75, .12, 42]); sh(V(TX, 0, 0), 30); }, [[0, 'switch', .5], [.4, 'crickets', .4], [1.5, 'chair_roll', .3], [2.5, 'owl', .3]]);
// 34 «und zählt sie. Alle 40.»: el foco recorre la manada; 38, 39, 40
shot(50.95, 'C', null, L => { garden(); night(); herd40(L.T, 40, 1); const n = sitOn(nb, TX + 20.2, .3, -6, -PI / 2, { aRx: 1.4, aRz: -.1, aRe: .3, aLx: 2.0, aLz: -.3, aLe: .2 }); cara(n, L.T, { expr: 'determined', mouth: kitLips(L.T, spoken(50.95, 52.9)) || 'flat' }); show(CHAIR, TX + 20, 0, -6, -PI / 2);
  attach(FLASHL, n.aR.hand, [0, -.5, .3], [-1.5, 0, 0], 1); TORCH.intensity = 110; FLASHL.updateMatrixWorld(true); TORCH.position.copy(wpos(FLASHL)); TORCH.target.position.set(TX - 2, 0, -8 + Math.sin(L.T * 2) * 10);
  cm([TX + 25, 13, 3, TX + 2, 1, -10, 48], [TX + 24.4, 12.4, 1.6, TX + 2, 1, -10, 46], L.k); sh(V(TX, 0, 0), 30); const c = L.lt < .55 ? '38' : L.lt < 1.05 ? '39' : '40'; badge(c === '40' ? 'gold' : 'big', c, W / 2, H * .16, 1, 1, c === '40' ? 1.3 : 1); }, [[0, 'tick', .5], [.55, 'tick', .5], [1.06, 'ding_reveal', .55], [1.5, 'sigh', .4]]);
// 35 «Deshalb trainiert hier jeder den ganzen Tag»: de día, la calle llena de gente haciendo dominadas
shot(52.90, 'F', null, L => { street(); const P = [[K[4], -10.6, -20.3, PI / 2], [XT[4], -10.6, -17.7, PI / 2], [K[7], -10.6, -41, PI / 2]];
  P.forEach(([c, x, z, ry], i) => { pullup(c, x, z, ry, 7.4, .5 + .5 * Math.sin(L.T * 4 + i * 1.3)); cara(c, L.T, { expr: 'determined', mouth: 'teeth' }); });
  cm([1.6, 5.6, -16, -10.6, 5.2, -19.5, 44], [.6, 5.4, -17, -10.6, 5.2, -19.5, 42], L.k); sh(V(-8, 0, -8), 40); }, [[0, 'sunrise_shine', .4], [.3, 'strain', .4], [.9, 'metal_creak', .3], [1.4, 'strain', .4], [1.9, 'birds', .3]]);
// 36 «In jeder Straße stehen Klimmzugstangen»: plano aéreo bajando por la calle llena de barras de colores
shot(55.16, 'W', null, L => { street(); const z = 30 - L.lt * 14; cam([0, 22 - L.lt * 3, z + 14], [0, 2, z - 26], 52); sh(V(0, 0, z - 20), 60);
  [[K[2], -10.6, -19, PI / 2], [K[6], 10.6, -13, -PI / 2], [K[0], -10.6, -41, PI / 2]].forEach(([c, x, z_, ry], i) => { pullup(c, x, z_, ry, 7.4, .5 + .5 * Math.sin(L.T * 4 + i)); }); }, [[0, 'whoosh', .5], [.4, 'clack', .3], [.9, 'metal_hit', .3], [1.6, 'birds', .3]]);
// 37 «Kinder,»: dos niños pequeños colgados de la barra
shot(57.46, 'Z', null, L => { street(); [[K[2], 3 - 1.2, .7], [K[6], 3 + 1.2, .68]].forEach(([c, z, s], i) => { c.root.scale.setScalar(s); pullup(c, -10.6, z, PI / 2, 7.4, .5 + .5 * Math.sin(L.T * 6 + i * 2)); cara(c, L.T, { expr: 'determined', mouth: 'grin' }); });
  orb(L.k, V(-10.6, 6.2, 3), null, [13, PI / 2 + .1, .05, 44], [12, PI / 2 + .05, .04, 44]); sh(V(-10, 0, 3), 30); }, [[0, 'kids_laugh', .45], [.3, 'spring', .4]]);
// 38 «Lehrer,»: el profe delante del colegio
shot(58.11, 'S', null, L => { street(); pullup(lehrer, 10.6, -207, -PI / 2, 7.4, .5 + .5 * Math.sin(L.T * 5)); cara(lehrer, L.T, { expr: 'determined', mouth: 'teeth' });
  orb(L.k, V(10.6, 4.8, -207), null, [13, -PI / 2 - .25, .1, 44], [12, -PI / 2 - .2, .08, 44]); sh(V(10, 0, -207), 30); }, [[0, 'whoosh_soft', .4], [.2, 'chalk', .3], [.4, 'strain', .4]]);
// 39 «sogar meine Oma.»: la Oma colgada, con su moño
shot(58.70, 'C', 'punch', L => { street(); pullup(oma, -10.6, -41, PI / 2, 7.4, .5 + .5 * Math.sin(L.T * 7)); grin(oma, L.T);
  orb(L.k, V(-10.6, 4.8, -41), null, [12.5, PI / 2 + .2, .08, 44], [11.5, PI / 2 + .15, .06, 44]); sh(V(-10, 0, -41), 30); }, [[0, 'zoom_fast', .5], [.2, 'gasp_old', .4]]);
// 40 «Die schafft 500 Klimmzüge vor dem Frühstück.»: a toda velocidad, el contador sube a 500, y el desayuno espera al lado
shot(59.76, 'W', null, L => { street(); const k = .5 + .5 * Math.sin(L.T * 16); pullup(oma, -10.6, -41, PI / 2, 7.4, k); cara(oma, L.T, { expr: 'determined', mouth: 'teeth' }); sweat(oma, L.T, 2);
  show(TABLE, -7.6, 0, -36.5, PI / 2); cm([-1.6, 5.6, -33, -9.6, 4, -39, 46], [-2.4, 5.4, -34, -9.6, 4.2, -39, 44], L.k); sh(V(-9, 0, -38), 30);
  const n = Math.min(500, Math.round(500 * easeIn(clamp(L.lt / 1.4)))); badge(n === 500 ? 'gold' : 'num', String(n), W / 2, H * .16, 1, 1, n === 500 ? 1.3 : 1); badge3('tag', 'FRÜHSTÜCK', V(-7.6, 4.8, -36.5), (L.lt - 1.2) * 3, .7); }, [[0, 'ticks', .45], [.6, 'ticks', .45], [1.2, 'ticks', .45], [1.42, 'ding_reveal', .55], [1.9, 'plate_slide', .3]]);
// 41 «Letzte Woche hat sie einen Cheeseburger so weit geworfen,»: la Oma lanza la hamburguesa en el campo
shot(62.33, 'S', null, L => { field(); const k = clamp((L.lt - .3) / 1.1); const t = thrower(oma, FX, 0, PI, k, 'burger', .55); cara(t, L.T, { expr: 'determined', mouth: 'teeth' });
  if (k >= .62) { const f = clamp((L.lt - 1.0) / 1.6), p = arc([FX + .8, 6, -.6], [FX, 180, -400], 80, f); show(FOODS.burger, p.x, p.y, p.z, L.T * 6, 1); }
  cm([FX + 5, 3.6, -9, FX, 3.6, 0, 42], [FX + 6, 3.2, -8, FX, 3.8, 0, 40], L.k); sh(V(FX, 0, 0), 30); }, [[.3, 'strain', .4], [.95, 'throw', .7], [1.0, 'whoosh_up', .6], [1.6, 'cheer', .3]]);
// 42 «dass er drei Tage zum Landen gebraucht hat»: la hamburguesa sigue volando mientras pasan días y noches
shot(65.09, 'R', null, L => { field(); const c = (Math.cos(L.lt / L.d * PI * 6) + 1) / 2; setSky([lerp(.02, .18, c), lerp(.04, .48, c), lerp(.14, .98, c)], [lerp(.06, .45, c), lerp(.1, .72, c), lerp(.3, 1, c)], [lerp(.16, .82, c), lerp(.2, .93, c), lerp(.42, 1, c)]); sun.intensity = lerp(.9, 2.5, c); hemi.intensity = lerp(.8, 1.25, c); sky.moon.visible = c < .5; sky.moon.position.set(-500, 700, -1200); BIRDSON = 0;
  const p = V(FX, 140 + L.lt * 4, -300 - L.lt * 30); show(FOODS.burger, p.x, p.y, p.z, L.T * 5, 2.4); trail(p, V(0, .1, -1), L.T, 10, 1.2); cam([p.x + 8, p.y - 6, p.z + 22], [p.x, p.y, p.z], 50);
  const day_ = Math.min(3, 1 + Math.floor(L.lt / L.d * 3)); badge('big', day_ + (day_ === 1 ? ' TAG' : ' TAGE'), W / 2, H * .17, 1, 1, .9); }, [[0, 'whirl', .5], [.5, 'rooster', .3], [.75, 'wind', .4], [1.2, 'crickets', .3], [1.5, 'rooster', .3]]);
// 43 «Jetzt gehört ihr ein Frigo Camelo.»: el camello-nevera junto a la Oma en su jardín
shot(67.33, 'Z', 'punch', L => { street(); const b = beast(FR, 15.6, 0, -7.2, -PI / 2 - .5); b.pose(L.T, { neckX: -.1, face: { eyes: 'half' } }); const o = put(oma, 13.6, 0, -3.4, -PI / 2 - .3); actuar(o, L.lt, [[0, 'cheer']], { T: L.T }); grin(o, L.T);
  orb(L.k, V(15, 5.4, -5.6), null, [22, -PI / 2, .12, 46], [20, -PI / 2 + .05, .1, 46]); sh(V(15, 0, -8), 30); rareTag(b, 'MYTHISCH', (L.lt - .3) * 3, 10); }, [[0, 'zoom_fast', .5], [.2, 'hooves', .45], [.5, 'ding_reveal', .5], [1.2, 'machine_hum', .3]]);
// 44 «Er pennt in ihrer Badewanne.»: dormido en la bañera con espuma y patito
shot(69.33, 'W', null, L => { use('BA'); inside(); const b = beast(FR, BX - .8, 2.5, -6, PI / 2, .7); b.pose(L.T, { sit: 1, sleep: 1 }); zzz(V(BX + 3.6, 8.6, -6), L.T);
  cm([BX + 9, 11, 3, BX + 2, 5.4, -6, 46], [BX + 8, 10.6, 2, BX + 2, 5.4, -6, 44], L.k); }, [[0, 'snore', .5], [.6, 'water_bloop', .4], [1.2, 'snore', .45]]);
// 45 «Und unser Bürgermeister?»: delante de su villa junto al mar, con pose
shot(70.91, 'F', null, L => { use('KS'); day(); const m = put(mayor, CX + 3.6, 0, 1.8, -.2); actuar(m, L.lt, [[0, 'idle'], [.1, { aLx: 1.0, aLz: .6, aLe: 2.0, aRx: 1.9, aRz: -.4, aRe: 2.2, headX: -.1 }]], { T: L.T }); grin(m, L.T);
  orb(L.k, V(CX + 3.4, 4, 1.8), null, [14, .3, .1, 44], [12.8, .24, .08, 44]); sh(V(CX, 0, 0), 30); badge('tag', 'BÜRGERMEISTER', W / 2, H * .17, (L.lt - .2) * 3, 1, .9); }, [[0, 'flash', .4], [.2, 'bell_far', .4], [.5, 'murmur', .3]]);
// 46 «Der hat eine komplette Pizza übers Meer geworfen.»: en la playa lanza la pizza hacia el horizonte
shot(71.92, 'S', null, L => { use('KS'); day(); const k = clamp((L.lt - .2) / 1.0); const m = put(mayor, CX, 0, 30, 0); applyPose(m, throwPose(k)); cara(m, L.T, { expr: 'determined', mouth: 'teeth' }); if (k < .62) inHand(m, 'pizza', 1, .7);
  if (k >= .62) { const f = clamp((L.lt - .85) / 1.8), p = arc([CX + .8, 6, 30.6], [CX, 30, 800], 120, f); show(FOODS.pizza, p.x, p.y, p.z, L.T * 9, 2.2); FOODS.pizza.rotation.x = .4; }
  cm([CX - 5, 3.8, 41, CX, 4.4, 30, 42], [CX - 9, 5, 22, CX + 2, 10, 70, 50], L.k > .4 ? (L.k - .4) / .6 : 0); sh(V(CX, 0, 30), 30); }, [[.2, 'strain', .4], [.85, 'throw', .7], [.9, 'whoosh_up', .6], [1.6, 'wind', .4], [2.2, 'splash', .2]]);
// 47 «Eine Woche später»: calendario +7 en la puerta de la villa
shot(74.57, 'I', null, L => { use('KS'); day(); show(CAL, CX - .2, 6.6, -5.3, 0, 1); CAL.rotation.z = Math.sin(L.T * 3) * .05; cm([CX - .2, 6, 4, CX - .2, 5.6, -5.3, 40], [CX - .2, 6, 2.4, CX - .2, 5.8, -5.3, 38], L.k); sh(V(CX, 0, -4), 30);
  badge('big', '1 WOCHE SPÄTER', W / 2, H * .17, (L.lt - .05) * 3, 1, .8); }, [[0, 'pages', .5], [.3, 'tick', .4]]);
// 48 «klopfte Tralalero Tralala an seine Tür.»: el tiburón llama con la aleta; el alcalde abre y se queda blanco
shot(75.31, 'Z', null, L => { use('KS'); day(); const b = beast(TR, CX - .6, 1.25, -1.0, PI - .55); const kn = [.0, .25, .5].some(t => L.lt > t && L.lt < t + .12); b.pose(L.T, { open: kn ? .4 : 0, face: { eyes: 'open' } }); b.body.rotation.x = kn ? .12 : 0;
  KS.DOOR.rotation.y = -1.3 * easeOut(clamp((L.lt - 1.0) / .5)); const m = put(mayor, CX + .6, 1.4, -7.4, 0); actuar(m, L.lt, [[0, 'idle'], [1.2, 'shock', { dur: .25 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'o' });
  orb(L.k, V(CX, 4.4, -3), null, [17, 1.25, .1, 44], [15.5, 1.2, .08, 44]); sh(V(CX, 0, -3), 30); rareTag(b, 'GOTT', (L.lt - .8) * 3, 6.4); }, [[0, 'knock', .6], [.25, 'knock', .6], [.5, 'knock', .6], [1.0, 'door_creak', .5], [1.3, 'gasp', .5], [1.8, 'ding_reveal', .4]]);

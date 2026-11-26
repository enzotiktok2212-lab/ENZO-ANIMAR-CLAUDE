// ---------- a: gancho, la regla, Mama, Herr Vogel, los bebés, yo, la ciudad, mis amigos (0 – 31,93 s) ----------
// helpers de esta pieza
function walk(ch, L, x, z, ry, sp = 2.4, i = 0, o = {}) { const d = sp * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, (o.y ?? 0) + Math.abs(Math.sin(L.T * 9 + i)) * .1, z + Math.cos(ry) * d, ry); actuar(ch, 0, [[0, { ...walkP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); if (o.expr !== false) cara(ch, L.T + i, { expr: o.expr || 'neutral', mouth: o.mouth }); return ch; }
function pose(ch, x, y, z, ry, L, p = {}, expr = 'neutral', ex = {}) { put(ch, x, y, z, ry); actuar(ch, 0, [[0, { headY: Math.sin(L.T * .9 + ch.seed) * .12, ...p }]], { T: L.T }); cara(ch, L.T, { expr, ...ex }); return ch; }
// bebé sentado en su cunita (cr de NU.CR)
function cribBaby(b, cr, L, o = {}) { put(b, NUX + cr.x + (o.dx ?? 0), 2.45, cr.z + (o.dz ?? 0), o.ry ?? 0); actuar(b, 0, [[0, { lLx: 1.5, lRx: 1.5, aLx: .5 + Math.sin(L.T * 4 + b.seed) * .3, aRx: .5 - Math.sin(L.T * 4 + b.seed) * .3, aLz: .3, aRz: .3, headY: Math.sin(L.T * 1.3 + b.seed) * .3 }]], { T: L.T, weight: false }); b.blob.visible = false; cara(b, L.T, { expr: o.expr || 'happy', mouth: o.mouth }); return b; }
// aparición de un angelito: escala con rebote (k desde el momento t)
const popS = (lt, t, d = .22) => { const k = clamp((lt - t) / d); return k <= 0 ? .001 : easeOut(k) + Math.sin(k * PI) * .35; };
function sparkle(c, T0, T, n = 10, col = 0xfff4c0) { EMB.burst(c, T0, T, col, n, 7); }
function noCribs(row = 0) { NU.CR.forEach((c, i) => { if (Math.floor(i / 5) === row) c.g.visible = false; }); }
function allCribs() { NU.CR.forEach(c => c.g.visible = true); }
const NP = [['sonne', 'mond'], ['feuer', 'wasser'], ['glueck', 'pech'], ['laut', 'leise'], ['oben', 'unten'], ['frieden', 'krieg'], ['sonne', 'wasser'], ['feuer', 'mond']];

// 1 «In dieser Welt wird»: GANCHO. Säuglingsstation: el médico alza a un recién nacido hacia la luz y, ¡pop, pop!, le aparecen dos angelitos opuestos
// (Sonne y Mond) a los lados con destellos; el bebé ríe y los mira. Golpe de zoom + empuje fuerte hacia el bebé.
shot(0, 'C', null, L => { nursery(L); noCribs(0); noCribs(1); const cx = NUX, cz = -12; const up = easeOut(clamp(L.lt / .4));
  const d = pose(arzt, cx, 0, cz + 3.2, 0, L, { aLx: lerp(1.4, 2.6, up), aRx: lerp(1.4, 2.6, up), aLe: .3, aRe: .3, aLz: -.12, aRz: -.12, headX: -.35 * up }, 'happy', { mouth: 'open_smile' });
  const b = BABY[2]; const h = hp(d); put(b, cx, h.y + lerp(-.6, 1.2, up), cz + 3.9, 0); actuar(b, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: .5 + Math.sin(L.T * 9) * .2, aRz: .5 - Math.sin(L.T * 9) * .2, lLx: .6 + Math.sin(L.T * 7) * .4, lRx: .6 - Math.sin(L.T * 7) * .4 }]], { T: L.T, weight: false }); b.blob.visible = false;
  cara(b, L.T, L.lt > .5 ? { eyes: 'happy', mouth: 'laugh' } : { expr: 'shock', mouth: 'o' });
  const A = engel(b, 'sonne', 'mond', L.T, { s: .9, spread: 7.5, up: .4, look: 0 }); A.forEach((a, i) => { if (a) a.scale.setScalar(.9 * popS(L.lt, .22 + i * .14)); }); sparkle(hp(b).add(V(2.4, 0, 0)), L.t0 + .36, L.T, 12);
  sparkle(hp(b).add(V(-1.4, 0, 0)), L.t0 + .42, L.T, 12);
  const p = hp(b); cm([p.x + 2, p.y - 1, p.z + 24, p.x, p.y - 2.4, p.z, 52], [p.x + .6, p.y - .6, p.z + 15, p.x, p.y - 1.8, p.z, 46], L.k, easeOut); lp(0, cx, 16, cz + 6, 60, 0xfff4d8, 40); },
  [[0, 'zoom_fast', .8], [.05, 'baby_gasp', .6], [.22, 'magic_hit', .7], [.36, 'sparkle', .7], [.7, 'kids_laugh', .4]]);
// 2 «jeder mit zwei Schutzengeln»: la plaza de Lichtenau llena de gente paseando; cada uno con sus dos angelitos revoloteando a los hombros. Grúa bajando rápido.
shot(1.10, 'W', null, L => { town(L); const P = [[-6, 4, PI * .9], [5, 8, -PI * .85], [0, -6, PI], [-12, -10, PI * .2], [11, -4, -PI * .3], [-3, 14, PI * .95], [8, 16, -PI * .6], [-10, 20, PI * .7]];
  P.forEach(([x, z, ry], i) => { const c = walk(DX[i], L, x, z, ry, 2.2, i, { expr: 'happy' }); engel(c, ...NP[i], L.T, { s: .85 }); });
  cm([2, 34, 52, 0, 2, -2, 54], [4, 10, 36, 0, 4, 0, 50], L.k, easeOut); sh(V(0, 0, 4), 40); }, [[0, 'swipe', .5], [.1, 'whoosh_magic', .5], [.4, 'city_amb', .4], [.7, 'feathers', .5]]);
// 3 «geboren.»: la fila de cunitas: un angelito aparece sobre cada bebé, uno tras otro, en ola; travelling lateral rápido
shot(2.56, 'Z', null, L => { nursery(L); NU.CR.slice(5, 10).forEach((cr, i) => { const b = cribBaby(BABY[i], cr, L); const A = engel(b, ...NP[i], L.T, { s: .55, spread: 3.6, up: 1.4, look: 0 }); A.forEach((a, j) => { if (a) a.scale.setScalar(.55 * popS(L.lt, .05 + i * .12 + j * .05)); }); });
  cm([NUX - 16, 13, 16, NUX - 10, 3.5, 2, 46], [NUX + 4, 12, 15, NUX + 8, 3.5, 2, 46], L.k); sh(V(NUX, 0, 2), 30); }, [[0, 'zoom_in', .5], [.05, 'pop', .5], [.2, 'pop', .45], [.35, 'pop', .45], [.5, 'pop', .4], [.62, 'pop', .4]]);
// 4 «Und sie sind immer Gegenteile.»: primer plano de dos angelitos de un bebé, Feuer (rojo, enfadado) y Wasser (azul, tranquilo):
// se miran, chocan de frente con las cabezas y se dan la espalda, cruzados de brazos; órbita rápida
shot(2.92, 'F', null, L => { nursery(L); const cr = NU.CR[7]; const b = cribBaby(BABY[4], cr, L, { expr: 'confused' });
  const c = V(NUX + cr.x, 6.8, cr.z); const bump = Math.sin(clamp((L.lt - .25) / .3) * PI); const turn = easeOut(clamp((L.lt - .55) / .25));
  angel('feuer', c.x - 1.6 + bump * .9, c.y, c.z, lerp(PI / 2, -PI / 2 + .4, turn), L.T, 1.5, 1); angel('wasser', c.x + 1.6 - bump * .9, c.y, c.z, lerp(-PI / 2, PI / 2 - .4, turn), L.T, 1.5, 2);
  if (L.lt > .4 && L.lt < .6) sparkle(c, L.t0 + .42, L.T, 10, 0xffe07a);
  orb(L.k, c, null, [15, -.5, .1, 42], [11, .4, .05, 40]); sh(c, 16); }, [[0, 'flash', .4], [.42, 'boing_metal', .6], [.55, 'whoosh', .4], [.75, 'clack', .4]]);
// 5 «Meine Mama zum Beispiel»: Mama en la cocina, con delantal, se gira hacia nosotros sonriendo y saluda; sus dos ángeles a los hombros. Dolly in.
shot(4.78, 'S', null, L => { kitchen(L); const m = pose(mama, KUX + 3, 0, 8, -.2, L, { aRx: 2.6 + Math.sin(L.T * 10) * .25, aRz: .3, aRe: .4, headY: .1 }, 'happy', { mouth: 'open_smile' }); engel(m, 'frieden', 'krieg', L.T);
  show(CAKES, KUX - 3, 4.4, 0, .3); onBody(m, 22, .35, .1, 42, L.k, 15, -.15); sh(V(KUX, 0, 0), 22); }, [[0, 'swipe', .4], [.1, 'steps', .4], [.3, 'pan_sizzle', .35]]);
// 6 «hat Frieden»: travelling de hombro a hombro: Frieden (blanco, paloma) sonríe y saluda con la mano
shot(5.74, 'R', null, L => { kitchen(L); const m = pose(mama, KUX + 3, 0, 8, 0, L, { headY: -.4 }, 'happy'); const A = engel(m, 'frieden', 'krieg', L.T, { look: 0 });
  const h = hp(m); cm([h.x - 5, h.y + .6, h.z + 10, h.x - 2.2, h.y - .2, h.z, 40], [h.x - 1.4, h.y + .3, h.z + 8, h.x - 1.6, h.y - .2, h.z, 40], L.k); sh(V(KUX, 0, 0), 20); }, [[0, 'whoosh', .4], [.15, 'chime', .5], [.5, 'sparkle', .4]]);
// 7 «und Krieg.»: el otro hombro: Krieg (rojo, casco, silbato) frunce el ceño y saca pecho
shot(6.68, 'C', 'punch', L => { kitchen(L); const m = pose(mama, KUX + 3, 0, 8, 0, L, { headY: .4 }, 'happy'); engel(m, 'frieden', 'krieg', L.T, { look: 0 });
  const h = hp(m); cm([h.x + 5, h.y + .8, h.z + 10, h.x + 2.2, h.y - .2, h.z, 40], [h.x + 3.2, h.y + .3, h.z + 7.4, h.x + 2.2, h.y - .2, h.z, 38], L.k); sh(V(KUX, 0, 0), 20); }, [[0, 'impact', .5], [.1, 'whistle', .5], [.3, 'growl', .3]]);
// 8 «Frieden macht ihr morgens»: Frieden en el fogón voltea una tortita con la sartén: vuela, gira y cae; vapor
shot(7.18, 'Z', null, L => { kitchen(L); const st = V(KUX - 14, 5.2, -6); const a = angel('frieden', st.x + 2.6, st.y + 2.2, st.z + .2, -.6, L.T, 1.2, 3);
  show(PAN, st.x, st.y, st.z, 0); const f = clamp((L.lt - .2) / .55); PAN.userData.cake.position.y = .25 + Math.sin(f * PI) * 3.2; PAN.userData.cake.rotation.x = f * PI * 2; PAN.rotation.z = Math.sin(clamp(L.lt / .25) * PI) * -.25;
  EMB.rise(st.clone().add(V(0, .4, 0)), L.T, 0xffffff, 2.4, 4, 10); orb(L.k, st.clone().add(V(1.2, 2, 0)), null, [17, .75, .2, 42], [12, .35, .15, 42]); sh(st, 14); }, [[0, 'zoom_in', .4], [.1, 'pan_sizzle', .6], [.2, 'whoosh_up', .5], [.75, 'plate_slide', .4]]);
// 9 «Nutella-Pfannkuchen.»: la torre de tortitas con el bote de Nutella; Mama unta con ganas y le da un bocado feliz; empuje al bote
shot(8.12, 'W', null, L => { kitchen(L); const tb = V(KUX, 4.4, 0); show(CAKES, tb.x, tb.y, tb.z, 0, 1); const m = pose(mama, KUX + 5.4, 0, 1.6, -PI / 2, L, { aRx: 1.3 + Math.sin(L.T * 8) * .2, aRe: 1.2, lean: .2, headX: .2 }, 'happy', { eyes: 'happy', mouth: L.lt > .6 ? 'grin' : 'open_smile' }); m.root.rotation.y = -PI / 2 + .3;
  engel(m, 'frieden', 'krieg', L.T, { sz: .8 }); cm([KUX + 1, 10, 19, tb.x + 3, tb.y + 1.8, tb.z + 1, 46], [KUX + 3, 9, 14.5, tb.x + 3, tb.y + 1.8, tb.z + 1, 44], L.k); sh(tb, 16); }, [[0, 'swipe', .4], [.2, 'spoon', .5], [.6, 'chew', .5]]);
// 10 «Und Krieg regelt»: el aparcamiento delante de casa: Krieg en el aire con silbato y brazo extendido dirige los coches, que entran en fila a sus plazas
shot(9.27, 'S', null, L => { vogelS(L, { park: true }); const k = clamp(L.lt / L.d);
  CARS.forEach((c, i) => { c.visible = true; const tx = VHX + 27.7 + i * 7.4 - VHX; const arr = clamp(k * 2.2 - i * .28); c.position.set(lerp(tx + 40, tx, easeOut(arr)) - (i % 2 ? 0 : 0), 0, lerp(40, 28, easeOut(clamp(arr * 1.6 - .6)))); c.rotation.y = lerp(-PI / 2, 0, easeOut(clamp(arr * 1.6 - .6))); });
  const a = angel('krieg', VHX + 46, 9.5, 36, -.5, L.T, 2.2, 4); a.userData.body.rotation.z = Math.sin(L.T * 6) * .3;
  cm([VHX + 30, 26, 74, VHX + 48, 3, 26, 50], [VHX + 40, 16, 62, VHX + 50, 3, 28, 50], L.k); sh(V(VHX + 46, 0, 30), 40); }, [[0, 'whistle', .7], [.15, 'car_pass', .5], [.45, 'brakes', .4], [.6, 'whistle', .5], [.8, 'honk', .3]]);
// 11 «den Parkplatz.»: plano medio: Krieg toca el silbato con mofletes hinchados y señala; el coche de Mama aparca perfecto delante de él
shot(10.31, 'C', 'punch', L => { vogelS(L, { park: true }); const c = CARS[0]; c.visible = true; const k = easeOut(clamp(L.lt / .6)); c.position.set(30, 0, lerp(52, 28, k));
  const a = angel('krieg', VHX + 30, 6.4, 37, .3, L.T, 2.4, 4); a.userData.body.rotation.z = -.2;
  cm([VHX + 44, 9, 62, VHX + 30, 4, 32, 46], [VHX + 38, 8, 55, VHX + 30, 4, 32, 44], L.k); sh(V(VHX + 30, 0, 32), 24); }, [[0, 'impact', .4], [.1, 'whistle', .7], [.5, 'brakes', .5], [.7, 'lock', .4]]);
// 12 «Herr Vogel von nebenan»: Herr Vogel (80) sale por su puerta verde arriba de la escalinata con la bolsa de la compra; sus ángeles Oben y Unten
shot(11.19, 'F', null, L => { vogelS(L); const v = walk(vogel, L, VHX, -1.6, 0, 1.2, 0, { y: 7.6, expr: 'happy' }); attach(BAG, v.aR.hand, [0, -1.2, .2], [0, 0, 0], .8); engel(v, 'oben', 'unten', L.T);
  cm([VHX - 9, 9, 22, VHX, 9.5, 0, 46], [VHX - 4, 10, 17, VHX, 9.5, 0, 44], L.k); sh(V(VHX, 0, 4), 24); }, [[0, 'flash', .3], [.05, 'door_open', .6], [.3, 'steps', .5], [.6, 'birds', .4]]);
// 13 «hat Oben und Unten.»: los dos ángeles: Oben apunta arriba con la flecha dorada, Unten abajo; zoom rápido de uno a otro
shot(12.35, 'Z', null, L => { vogelS(L); const v = pose(vogel, VHX, 7.6, -1, 0, L, {}, 'happy'); attach(BAG, v.aR.hand, [0, -1.2, .2], [0, 0, 0], .8); const A = engel(v, 'oben', 'unten', L.T, { s: 1.3, look: 0 });
  if (A[0]) A[0].userData.body.position.y += Math.sin(clamp(L.lt / .3) * PI) * .8; if (A[1]) A[1].userData.body.position.y -= Math.sin(clamp((L.lt - .3) / .3) * PI) * .8;
  const h = hp(v); cm([h.x - 5, h.y + 1, h.z + 15, h.x - 1.4, h.y - .4, h.z, 42], [h.x + 5, h.y - .4, h.z + 13, h.x + 1.4, h.y - .6, h.z, 42], L.k); sh(V(VHX, 0, 4), 20); }, [[0, 'zoom_in', .4], [.1, 'whoosh_up', .5], [.4, 'whoosh_down', .5]]);
// 14 «Deshalb ist er in achtzig Jahren»: Vogel pisa mal en un peldaño y se va hacia delante… Unten lo frena por el pecho y Oben tira de su cuello de vuelta
shot(13.54, 'C', 'punch', L => { vogelS(L); const k = clamp(L.lt / L.d), st = 9 - 2 * k; const y = .6 * (st + 1), z = 9.45 - .9 * st; const trip = Math.sin(clamp((L.lt - .2) / .8) * PI);
  const v = put(vogel, VHX, y, z, 0); actuar(v, 0, [[0, { lean: .2 + trip * .5, aLx: 1.2 * trip + .2, aRx: .4, aLz: .6 * trip, lLx: -.5 * trip, lRx: .6 * trip, lRk: .4 }]], { T: L.T }); cara(v, L.T, trip > .3 ? { expr: 'shock', mouth: 'o' } : { expr: 'happy' }); attach(BAG, v.aR.hand, [0, -1.2, .2], [0, 0, 0], .8);
  const h = hp(v); angel('unten', h.x, h.y - 1.6, h.z + 2.4 - trip * .3, PI, L.T, 1.2, 1); angel('oben', h.x + .3, h.y + 1.6, h.z - 1.6, 0, L.T, 1.2, 2);
  badge('gold', '80 JAHRE', W / 2, H * .2, clamp((L.lt - .5) / .3));
  cm([VHX + 12, 8, 24, VHX, 6, 4, 44], [VHX + 8, 7, 19, VHX, 6, 4, 42], L.k); sh(V(VHX, 0, 4), 22); }, [[0, 'impact', .4], [.25, 'gasp_old', .6], [.45, 'whoosh', .5], [.6, 'hug', .4], [.7, 'ding_soft', .4]]);
// 15 «nicht ein einziges Mal»: los ángeles lo llevan de los codos; baja peldaño a peldaño, tranquilo, saludando con la gorra; contador 0
shot(14.88, 'R', null, L => { vogelS(L); const k = clamp(L.lt / L.d), st = 7 - 6 * k; const y = .6 * (st + 1), z = 9.45 - .9 * st;
  const v = put(vogel, VHX, y, z, 0); actuar(v, 0, [[0, { ...walkP(L.T * .7, 0), aRx: 2.4, aRe: 1.5, aRz: .2 }]], { T: L.T }); cara(v, L.T, { expr: 'happy', eyes: 'happy', mouth: 'grin' }); attach(BAG, v.aL.hand, [0, -1.2, .2], [0, 0, 0], .8);
  engel(v, 'oben', 'unten', L.T, { spread: 1.9, up: -1.6, fw: .4, look: 0 }); badge('green', '0× GESTÜRZT', W / 2, H * .2, clamp((L.lt - .3) / .3));
  cm([VHX - 16, 4, 22, VHX, 5, 4, 46], [VHX - 9, 6, 26, VHX, 3.5, 7, 44], L.k); sh(V(VHX, 0, 4), 22); }, [[0, 'whoosh', .4], [.1, 'steps', .6], [.5, 'ding_soft', .4]]);
// 16 «die Treppe runtergefallen.»: plano picado desde lo alto de la escalinata: Vogel llega abajo de un saltito y levanta la bolsa, orgulloso
shot(16.14, 'W', null, L => { vogelS(L); const k = clamp(L.lt / .5); const v = put(vogel, VHX, lerp(.6, 0, k) + Math.sin(k * PI) * .5, lerp(9.4, 12, k), 0); actuar(v, 0, [[0, { aLx: 2.6, aLz: .4, aLe: .2, aRx: .3, crouch: Math.sin(k * PI) * .2 }]], { T: L.T }); attach(BAG, v.aL.hand, [0, -1.2, .2], [0, 0, 0], .8); cara(v, L.T, { eyes: 'happy', mouth: 'laugh' });
  engel(v, 'oben', 'unten', L.T); cm([VHX + 2, 15, 0, VHX, 3.5, 12.5, 48], [VHX + 7, 12, 3, VHX, 4, 12.5, 46], L.k); sh(V(VHX, 0, 8), 22); }, [[0, 'swipe', .4], [.35, 'land', .5], [.5, 'cheer', .3]]);
// 17 «Zwei Engel,»: sala de bebés desde arriba: todas las cunas, cada bebé con sus dos ángeles; «2» grande
shot(17.17, 'Z', null, L => { nursery(L); NU.CR.forEach((cr, i) => { if (i > 9) return; const b = cribBaby(BABY[i % 8], cr, L); engel(b, ...NP[i % 8], L.T, { s: .5, spread: 3.4, up: 1.3, look: 0 }); });
  badge('gold', '2', W / 2, H * .2, clamp(L.lt / .2), 1, 1.6); cm([NUX, 16.5, 26, NUX, 3, 0, 50], [NUX, 14, 19, NUX, 3, 0, 54], L.k); sh(V(NUX, 0, 0), 34); }, [[0, 'zoom_in', .4], [.05, 'pop', .5], [.3, 'choir', .4]]);
// 18 «jedes Baby.»: travelling a ras de cunitas: bebés distintos (piel, pelele) con sus parejas de ángeles
shot(17.96, 'S', null, L => { nursery(L); NU.CR.slice(10, 15).forEach((cr, i) => { const b = cribBaby(BABY[(i + 3) % 8], cr, L); engel(b, ...NP[(i + 2) % 8], L.T, { s: .5, spread: 3.4, up: 1.3, look: 0 }); });
  cm([NUX + 20, 6.5, 19, NUX + 14, 4.6, 10, 42], [NUX - 6, 6.5, 19, NUX - 12, 4.6, 10, 42], L.k, x => x); sh(V(NUX, 0, 10), 26); }, [[0, 'swipe', .4], [.2, 'baby_gasp', .4], [.5, 'pop', .4]]);
// 19 «Ohne Ausnahme.»: la enfermera… el médico pasa revista con su carpeta, marcando ✓ cuna por cuna; zoom lateral
shot(18.80, 'W', null, L => { nursery(L); NU.CR.slice(0, 5).forEach((cr, i) => { const b = cribBaby(BABY[i], cr, L); engel(b, ...NP[i], L.T, { s: .5, spread: 3.4, up: 1.3, look: 0 }); });
  const d = walk(arzt, L, NUX - 18 + 0, -1, PI / 2, 9, 0, { expr: 'happy', pose: { aLx: 1.2, aLe: 1.2 } }); show(BOOKS[0], 0, 0, 0); attach(BOOKS[0], d.aL.hand, [0, -.3, .4], [PI / 2, 0, 0], .8);
  for (let i = 0; i < 4; i++) badge('green', '✓', W * (.2 + i * .2), H * .25, clamp((L.lt - .1 - i * .15) / .15), 1, .8);
  orb(L.k, arzt.root.position.clone().add(V(0, 4, 0)), null, [20, .35, .18, 44], [15, -.15, .15, 44]); sh(V(NUX, 0, -4), 28); }, [[0, 'whoosh', .4], [.1, 'pencil', .5], [.3, 'pencil', .4], [.5, 'pencil', .4]]);
// 20 «Außer mir.»: una cuna sola al fondo: bebé Jonas (pelele turquesa) sin ningún ángel; mira a los lados, puchero. Golpe + viñeta
shot(19.69, 'C', 'punch', L => { nursery(L); const cr = NU.CR[14]; const b = BABY[1]; cribBaby(b, cr, L, { expr: 'sad', mouth: 'frown' }); b.head.rotation.y = Math.sin(L.T * 3) * .5;
  const n = NU.CR[13]; const nb = cribBaby(BABY[5], n, L); engel(nb, 'sonne', 'mond', L.T, { s: .5, spread: 3.4, up: 1.3, look: 0 }); grade.uniforms.vig.value = .7;
  const p = hp(b); cm([p.x + 2, p.y + 6, p.z + 9, p.x, p.y - .4, p.z, 42], [p.x + 1, p.y + 4.6, p.z + 6, p.x, p.y - .4, p.z, 38], L.k); sh(V(p.x, 0, p.z), 16); }, [[0, 'impact', .5], [.1, 'sad_tone', .6], [.4, 'sniff', .4]]);
// 21 «Als ich geboren wurde,»: el médico levanta a bebé Jonas sobre la mesa de exploración con la lámpara encendida
shot(20.38, 'S', null, L => { nursery(L); noCribs(0); noCribs(1); const cz = -12, up = easeOut(clamp(L.lt / .6)); const d = pose(arzt, NUX, 0, cz + 3, 0, L, { aLx: lerp(1.2, 1.9, up), aRx: lerp(1.2, 1.9, up), aLe: .4, aRe: .4, headX: .1 }, 'happy');
  const b = BABY[1]; const h = hp(d); put(b, NUX, h.y - 1.4 + up, cz + 4.6, 0); actuar(b, 0, [[0, { aLx: 1.6, aRx: 1.6, lLx: .5, lRx: .5 }]], { T: L.T, weight: false }); b.blob.visible = false; cara(b, L.T, { expr: 'shock', mouth: 'o' });
  lp(0, NUX - 1, 13, cz + 2, 70, 0xfff4d8, 30); onBody(d, 24, -.4, .1, 44, L.k, 17, .2, 5); sh(V(NUX, 0, cz), 20); }, [[0, 'swipe', .4], [.1, 'monitor_beep', .4], [.4, 'baby_gasp', .4]]);
// 22 «schaute der Arzt hinter meine linke Schulter.»: el médico, con gafas, se asoma por detrás del hombro izquierdo del bebé (zoom a sus ojos curiosos)
shot(21.48, 'R', null, L => { nursery(L); noCribs(0); noCribs(1); const cz = -12; const d = pose(arzt, NUX, 0, cz + 3, 0, L, { aLx: 1.9, aRx: 1.9, aLe: .4, aRe: .4, lean: .2, twist: .4, headY: .5, headZ: .2 }, 'confused');
  const b = BABY[1]; const h = hp(d); put(b, NUX + .3, h.y - .4, cz + 4.6, 0); actuar(b, 0, [[0, { aLx: 1.6, aRx: 1.6, lLx: .5, lRx: .5 }]], { T: L.T, weight: false }); b.blob.visible = false; cara(b, L.T, { expr: 'confused' });
  const p = hp(b); cm([p.x - 4, p.y + 2.4, p.z + 14, p.x - .6, p.y - .4, p.z - 1, 42], [p.x - 2, p.y + 1.8, p.z + 10.5, p.x - .6, p.y - .4, p.z - 1, 40], L.k); sh(V(NUX, 0, cz), 18);
  badge('tag', 'LINKS?', W * .3, H * .22, clamp((L.lt - .3) / .25)); }, [[0, 'whoosh', .4], [.2, 'sniff', .4], [.6, 'tick', .4]]);
// 23 «Dann hinter die rechte.»: y ahora por el derecho, con la lupa… nada
shot(23.18, 'W', null, L => { nursery(L); noCribs(0); noCribs(1); const cz = -12; const d = pose(arzt, NUX, 0, cz + 3, 0, L, { aLx: 1.9, aRx: 1.9, aLe: .4, aRe: .4, lean: .2, twist: -.4, headY: -.5, headZ: -.2 }, 'confused');
  const b = BABY[1]; const h = hp(d); put(b, NUX - .3, h.y - .4, cz + 4.6, 0); actuar(b, 0, [[0, { aLx: 1.6, aRx: 1.6, lLx: .5, lRx: .5 }]], { T: L.T, weight: false }); b.blob.visible = false; cara(b, L.T, { expr: 'confused' });
  const p = hp(b); cm([p.x + 4, p.y + 2.4, p.z + 14, p.x + .6, p.y - .4, p.z - 1, 42], [p.x + 2, p.y + 1.8, p.z + 10.5, p.x + .6, p.y - .4, p.z - 1, 40], L.k); sh(V(NUX, 0, cz), 18);
  badge('tag', 'RECHTS?', W * .7, H * .22, clamp((L.lt - .2) / .25)); }, [[0, 'swipe', .4], [.2, 'sniff', .4]]);
// 24 «Nichts.»: el médico se encoge de hombros, cara de «ni idea»; signo de interrogación enorme
shot(24.24, 'C', 'punch', L => { nursery(L); noCribs(0); noCribs(1); const cz = -12; const d = pose(arzt, NUX, 0, cz + 3, 0, L, { aLx: .4, aRx: .4, aLz: -.6, aRz: -.6, aLe: 1.6, aRe: 1.6, headZ: .15 }, 'confused', { mouth: 'grimace' });
  badge('q', '?', W / 2, H * .2, clamp(L.lt / .15), 1, 1.3); onFace(d, 9, .4, 0, 42, L.k, 6.5); sh(V(NUX, 0, cz), 18); }, [[0, 'impact', .5], [.1, 'record_scratch', .5]]);
// 25 «Und seitdem nannte mich»: Jonas (15) camina por la calle con su mochila; los vecinos (con sus ángeles) se giran y le señalan cuchicheando
shot(24.69, 'W', null, L => { town(L); const j = walk(jonas, L, 0, 18, PI, 2.2, 0, { expr: 'sad' }); j.head.rotation.x = .25;
  [[-8, 8, .9], [7, 10, -.9], [-6, -2, .6], [9, 0, -.5]].forEach(([x, z, ry], i) => { const c = pose(DX[i + 8], x, 0, z, ry, L, { ...POINT, aRx: 1.5 + Math.sin(L.T * 3 + i) * .1 }, 'sus', { mouth: i % 2 ? 'o' : 'grimace' }); c.root.rotation.y = faceTo(c.root.position, j.root.position); engel(c, ...NP[i + 2], L.T, { s: .8 }); });
  cm([3, 7, 0, 0, 4, 20, 48], [-2, 9, -6, 0, 4, 16, 48], L.k); sh(V(0, 0, 10), 30); }, [[0, 'swipe', .4], [.2, 'whisper', .6], [.6, 'steps', .4]]);
// 26 «die ganze Stadt nur noch:»: plano general: media plaza señalándole a la vez, él en el centro, encogido
shot(25.80, 'Z', null, L => { town(L); const j = pose(jonas, 0, 0, 0, 0, L, { aLx: .1, aRx: .1, headX: .3, crouch: .05 }, 'sad');
  crowdAt(L, 0, 0, 14, 9, 16, 7, { mode: 'point', expr: 'sus' }); POST.push(() => DX.forEach((c, i) => { if (c.root.visible) engel(c, ...NP[i % 8], L.T, { s: .8 }); }));
  orb(L.k, V(0, 3, 0), null, [28, .2, .5, 48], [17, -.3, .35, 46]); sh(V(0, 0, 0), 30); }, [[0, 'zoom_in', .4], [.1, 'whisper', .6], [.5, 'crowd_run', .2]]);
// 27 «das leere Kind.»: Jonas pasa por delante de la pintada «LEERES KIND» en el muro; se para, la mira y baja la cabeza. Golpe con viñeta
shot(26.84, 'C', 'punch', L => { town(L, { mauer: true }); const k = clamp(L.lt / .7); const j = put(jonas, -22 + lerp(-6, 0, easeOut(k)), 0, 44.5, PI / 2 - .3 * k); actuar(j, 0, [[0, k < 1 ? walkP(L.T, 0) : { headX: .35, aLx: .1, aRx: .1 }]], { T: L.T }); cara(j, L.T, { expr: 'sad', mouth: 'frown' });
  grade.uniforms.vig.value = .65; cm([-12, 6, 64, -22, 4.5, 41, 46], [-16, 5, 58, -22, 4.5, 41, 42], L.k); sh(V(-22, 0, 44), 22); }, [[0, 'impact', .5], [.1, 'sad_tone', .6], [.4, 'brush', .4]]);
// 28 «Aber ich war nicht allein.»: Jonas en un banco, triste; de repente Elias y Mira se dejan caer a su lado de un salto, uno a cada lado (donde irían los ángeles)
shot(28.05, 'F', null, L => { town(L); const bx = -40, bz = 6; sit(jonas, bx, 2.6, bz, PI / 2, L, { aLx: .5, aRx: .5, headX: lerp(.3, 0, clamp((L.lt - .4) / .3)) }); cara(jonas, L.T, L.lt > .5 ? { expr: 'happy', mouth: 'open_smile' } : { expr: 'sad' });
  const land = k => clamp((L.lt - k) / .35); for (const [c, s, t] of [[elias, -1, .1], [mira, 1, .25]]) { const e = land(t); if (e <= 0) { const w = walk(c, L, bx + 10, bz + s * 6, -PI / 2, 4, 0, { expr: 'happy' }); continue; } sit(c, bx, 2.6 + Math.sin(e * PI) * 1.2, bz + s * 2.6, PI / 2, L, { aLx: .4, aRx: .4 }); cara(c, L.T, { expr: 'happy', mouth: 'grin' }); }
  orb(L.k, V(bx, 4, bz), null, [17, PI / 2 + .45, .12, 44], [13, PI / 2 - .1, .1, 42]); sh(V(bx, 0, bz), 20); }, [[0, 'flash', .3], [.1, 'run_cobble', .5], [.35, 'thud', .5], [.5, 'thud', .5], [.6, 'laugh_deep', .3]]);
// 29 «Denn ich hatte Elias»: Elias le choca el puño con una sonrisa ladeada
shot(29.14, 'S', null, L => { town(L); const bx = -40, bz = 6; sit(jonas, bx, 2.6, bz, PI / 2, L, { aLx: 1.2, aLe: .6, aLz: .3 }); cara(jonas, L.T, { expr: 'happy', mouth: 'grin' });
  sit(elias, bx, 2.6, bz - 2.6, PI / 2 + .3, L, { aRx: 1.3, aRe: .3, aRz: -.3 + Math.sin(clamp(L.lt / .3) * PI) * -.1 }); cara(elias, L.T, { expr: 'smug', mouth: 'grin' });
  sit(mira, bx, 2.6, bz + 2.6, PI / 2 - .2, L, {}); cara(mira, L.T, { expr: 'happy' });
  const h = hp(elias); cm([h.x + 12, h.y + .6, h.z - 5, h.x, h.y - 1.2, h.z + 1.4, 42], [h.x + 9.5, h.y + .2, h.z - 1.5, h.x, h.y - 1.2, h.z + 1.4, 40], L.k); sh(V(bx, 0, bz), 18); }, [[0, 'swipe', .4], [.25, 'clap', .5]]);
// 30 «und Mira,»: Mira le pasa el brazo por los hombros y le guiña un ojo
shot(30.12, 'R', null, L => { town(L); const bx = -40, bz = 6; sit(jonas, bx, 2.6, bz, PI / 2 + .2, L, {}); cara(jonas, L.T, { expr: 'happy', mouth: 'grin' });
  sit(mira, bx, 2.6, bz + 2.4, PI / 2 - .3, L, { aLx: 1.8, aLz: .9, aLe: .4 }); cara(mira, L.T, { expr: 'happy', eyes: L.lt > .2 && L.lt < .45 ? 'wink' : 'happy', mouth: 'grin' }); sit(elias, bx, 2.6, bz - 2.6, PI / 2, L, {}); cara(elias, L.T, { expr: 'smug' });
  const h = hp(mira); cm([h.x + 12, h.y + .6, h.z + 5, h.x, h.y - 1.2, h.z - 1.4, 42], [h.x + 9.5, h.y + .2, h.z + 1.5, h.x, h.y - 1.2, h.z - 1.4, 40], L.k); sh(V(bx, 0, bz), 18); }, [[0, 'whoosh', .4], [.2, 'hug', .5], [.35, 'ding_soft', .3]]);
// 31 «meine besten Freunde.»: los tres caminan juntos hacia cámara por la plaza, riendo; Elias con las manos en los bolsillos, Mira dando saltitos
shot(30.70, 'C', null, L => { town(L); walk(jonas, L, 0, -6, 0, 2.4, 0, { expr: 'happy', mouth: 'laugh' }); walk(elias, L, -4, -6.6, 0, 2.4, 1.3, { expr: 'smug', pose: { aLx: -.2, aRx: -.2, aLe: .4, aRe: .4 } }); walk(mira, L, 4, -6.4, 0, 2.4, 2.1, { expr: 'happy', mouth: 'laugh', y: Math.abs(Math.sin(L.T * 6)) * .4 });
  orb(L.k, V(0, 4, -6 + L.lt * 2.4), null, [15, 0, .12, 46], [21, .35, .18, 46]); sh(V(0, 0, -4), 22); }, [[0, 'impact', .3], [.1, 'steps', .5], [.4, 'kids_laugh', .4]]);

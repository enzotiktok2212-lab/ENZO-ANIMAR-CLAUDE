// ---------- c: restaurante, compras, «no solo a mí»: Gartencenter, tren, gimnasio, oficina, los abuelos (81,25 – 125,69 s) ----------
// restaurante: mesa principal en (RX, 0); Svenja en z = -3.9 (mira +z), Lukas en z = +3.9 (mira -z), camarero a +x
const restSet = (L, o = {}) => { rest(L); RE.SOUP.visible = !!o.soup; if (o.soup) RE.SOUP.position.set(0, 3.78, 1.9);
  put(sv, RX, sitY(sv, 2.45), -3.9, 0); actuar(sv, 0, [[0, seatPose(o.sv || { aLx: .9, aRx: .9, aLe: 1.2, aRe: 1.2 })]], { T: L.T });
  put(me, RX, sitY(me, 2.45), 3.9, PI); actuar(me, 0, [[0, seatPose(o.me || { aLx: .9, aRx: .9, aLe: 1.2, aRe: 1.2 })]], { T: L.T }); };
// 61 «Im Restaurant bestellt Svenja für mich.»: Svenja pide señalando la carta; el camarero apunta; Lukas calla
shot(81.25, 'F', null, L => { restSet(L, { sv: { aRx: 1.5, aRz: .25, aRe: .1, aLx: .9, aLe: 1.2, headY: .4 } }); talk(sv, L.T, 81.3, 82.8, 'happy'); cara(me, L.T, { expr: 'neutral', eyes: 'side_l', mouth: 'flat' });
  put(kel, RX + 4.4, 0, -.6, -PI / 2); actuar(kel, 0, [[0, { aLx: 1.3, aLe: 1.6, aLz: -.2, aRx: 1.2, aRe: 1.5, aRz: -.3, headX: .25 }]], { T: L.T }); cara(kel, L.T, { expr: 'neutral', eyes: 'down' }); inHand(NOTE, kel, 'L', [0, -.6, .4], [-.4, 0, 0], .6);
  cm([RX - 13, 7.2, 3], [RX - 12, 7, 2.2], L.k); camera.lookAt(RX + .8, 4.4, -.2); camera.fov = 46; }, [[0, 'cafeteria', .45], [.5, 'pencil', .35]]);
// 62 «Ich wusste gar nicht,»: el camarero le pone una sopa verde delante
shot(82.85, 'S', null, L => { const t = clamp(L.lt / .5); restSet(L, { soup: 1 }); RE.SOUP.position.set(lerp(3.2, 0, t), 3.78 + Math.sin(t * PI) * .6, lerp(.6, 1.9, t)); cara(me, L.T, { expr: 'confused', eyes: 'down', mouth: 'o' }); cara(sv, L.T, { expr: 'smug' });
  put(kel, RX + 4.0, 0, 1.2, -PI / 2 - .4); actuar(kel, 0, [[0, { aRx: lerp(1.4, .6, t), aRe: .3, aLx: .3, lean: .2 * (1 - t) }]], { T: L.T }); cara(kel, L.T, { expr: 'happy', mouth: 'smile' });
  cm([RX + 7, 7.6, 10.4], [RX + 6.2, 7.2, 9.4], L.k); camera.lookAt(RX + .4, 4.6, 2.4); camera.fov = 44; }, [[0, 'plate_slide', .5], [.3, 'porcelain', .4]]);
// 63 «dass ich Gemüsesuppe mag.»: la sopa delante y Lukas detrás, cuchara en mano, sin entender
shot(83.82, 'W', null, L => { restSet(L, { soup: 1, me: { aRx: 1.3, aRe: 1.2, aLx: .9, aLe: 1.2 } }); cara(me, L.T, { expr: 'confused', eyes: 'side_r', mouth: 'flat' }); inHand(SPOON, me, 'R', [0, -.5, .2], [PI / 2, 0, 0]);
  badge('green', 'GEMÜSESUPPE', W * .5, H * .17, clamp((L.T - 83.96) / .12), 1, .75); cm([RX + .4, 6.2, -1.6], [RX + .35, 6.0, -1.0], L.k); camera.lookAt(RX, 4.8, 4.4); camera.fov = 44; }, [[0, 'spoon', .45], [.5, 'hmm', .35]]);
// 64 «Ehrlich gesagt weiß ich es immer noch nicht.»: prueba la cucharada… y se encoge de hombros
shot(85.04, 'Z', null, L => { restSet(L, { soup: 1, me: { aRx: 2.2, aRz: -.3, aRe: 2.1, aLx: .45, aLz: .6, aLe: 1.4, headZ: .15 } }); inHand(SPOON, me, 'R', [0, -.5, .2], [PI / 2, 0, 0]); cara(me, L.T, { expr: 'confused', eyes: 'squint', mouth: 'o' }); cara(sv, L.T, { expr: 'happy' });
  badge('q', '?', W * .5, H * .2, clamp((L.T - 85.6) / .12)); onFace(me, 5.6, .1, .5, 42, L.k, 5.0); }, [[0, 'sip', .45], [.6, 'hmm', .35]]);
// compras: acera de las tiendas (este, x ≈ 36), escaparates con toldo en x ≈ 43; caminan hacia +z
const SHP = V(35.5, 0, -16);
const shopWalk = (L, extra = {}) => { const z = SHP.z + L.T * 1.6 - 87 * 1.6 * 0; const p = V(SHP.x, 0, SHP.z + (L.T - 86.89) * 1.6); walkTo(me, p.x, p.z, 0, 0, L, 0, 7); actuar(me, 0, [[0, { ...walkP(L.T, 0, 7), aLx: .25, aRx: .25, aLz: .35, aRz: .35, aLe: .3, aRe: .3, ...extra }]], { T: L.T }); return p; };
const hangBags = (p, n = 16) => { for (let i = 0; i < n; i++) { const side = i % 2 ? 1 : -1, k = Math.floor(i / 2); const ring = k % 4, tier = Math.floor(k / 4); show(BAGS[i], p.x + side * (1.6 + ring * .35 + tier * .2), .9 + tier * 1.25 - ring * .1, p.z + (ring - 1.5) * .7, side * .3 + ring * .2, .95); } };
// 65 «Beim Shoppen trage ich 16 Tüten,»: Lukas, de pie, cargado con 16 bolsas; Svenja pasea delante
shot(86.89, 'C', null, L => { town(L); const p = shopWalk(L); hangBags(p); cara(me, L.T, { expr: 'worried', mouth: 'frown' }); sweat(me, L.T, 2);
  walkTo(sv, SHP.x - .6, SHP.z + 7, 0, 1.6, L, 1); cara(sv, L.T, { expr: 'happy' }); inHand(CUPS[2], sv, 'L', [0, -.75, .25]);
  badge('num', '16', W * .5, H * .17, clamp((L.T - 87.77) / .12)); orb(L.k, V(p.x, 3.4, p.z + 1.6), null, [17, -.75, .1, 48], [15, -.65, .08, 48]); sh(p, 24); }, [[0, 'paper', .45], [.4, 'steps', .4], [.9, 'strain', .3]]);
// 66 «ihre Handtasche und ihren Mantel.»: encima, el bolso colgado del cuello y el abrigo sobre la cabeza
shot(88.79, 'I', null, L => { town(L); const p = shopWalk(L); hangBags(p); cara(me, L.T, { expr: 'worried', mouth: 'frown', eyes: 'up' }); sweat(me, L.T, 2);
  attach(HANDBAG, me.neck, [0, -.7, .9], [0, 0, 0], 1); if (L.T > 89.6) attach(COAT, me.head, [0, 1.45, 0], [0, 0, .15], 1);
  onFace(me, 6.4, .2, -.6, 46, L.k, 5.6); sh(p, 20); }, [[0, 'zip', .4], [.8, 'cloth', .45]]);
// 67 «Trotzdem fragt sie:»: Svenja se gira con su café
shot(90.52, 'W', null, L => { town(L); const p = V(SHP.x, 0, SHP.z + 6.4); put(sv, p.x - .4, 0, p.z + 5, PI - .3 + Math.min(1, L.lt * 3) * .3); actuar(sv, 0, [[0, { aLx: 1.2, aLe: 1.4, aLz: -.2, aRx: .3 }]], { T: L.T }); inHand(CUPS[2], sv, 'L', [0, -.75, .25]); cara(sv, L.T, { expr: 'happy', mouth: 'smile' });
  put(me, p.x, 0, p.z, 0); hangBags(p); attach(HANDBAG, me.neck, [0, -.7, .9]); attach(COAT, me.head, [0, 1.45, 0], [0, 0, .15]); actuar(me, 0, [[0, { aLx: .25, aRx: .25, aLz: .35, aRz: .35 }]], { T: L.T }); cara(me, L.T, { expr: 'worried' });
  onBody(sv, 11.5, .5, .1, 44, L.k, 10.2); sh(p, 20); }, [[0, 'cloth', .35], [.4, 'steps', .3]]);
// 68 «Kannst du noch kurz meinen Kaffee halten?»
shot(91.57, 'S', null, L => { town(L); const p = V(SHP.x, 0, SHP.z + 6.4); put(sv, p.x - .4, 0, p.z + 4.4, PI); actuar(sv, 0, [[0, { aLx: 1.5, aLe: .3, aLz: -.1, aRx: .3, headZ: .12 }]], { T: L.T }); inHand(CUPS[2], sv, 'L', [0, -.75, .25]); talk(sv, L.T, 91.57, 93.0, 'happy');
  bubble(sv, 'Kaffee halten?', clamp((L.lt - .05) / .1), 1.2); put(me, p.x, 0, p.z, 0); hangBags(p); attach(HANDBAG, me.neck, [0, -.7, .9]); attach(COAT, me.head, [0, 1.45, 0], [0, 0, .15]); cara(me, L.T, { expr: 'shock', mouth: 'o' }); actuar(me, 0, [[0, { aLx: .25, aRx: .25, aLz: .35, aRz: .35 }]], { T: L.T });
  orb(L.k, V(p.x - .2, 4.4, p.z + 2.2), null, [15, -1.2, .1, 46], [13.6, -1.1, .08, 46]); sh(p, 20); }, [[0, 'sip', .35], [.2, 'pop', .4]]);
// 69 «Weil meine Hände voll sind,»: las manos, llenas de asas de bolsas
shot(93.25, 'F', null, L => { town(L); const p = V(SHP.x, 0, SHP.z + 6.4); put(me, p.x, 0, p.z, 0); hangBags(p); attach(HANDBAG, me.neck, [0, -.7, .9]); attach(COAT, me.head, [0, 1.45, 0], [0, 0, .15]); actuar(me, 0, [[0, { aLx: .45, aRx: .45, aLz: .55, aRz: .55, aLe: .3, aRe: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'worried', eyes: 'down' });
  orb(L.k, V(p.x, 2.6, p.z), null, [10.5, .1, .16, 48], [9.6, -.05, .14, 48]); sh(p, 16); }, [[0, 'paper', .5], [.5, 'strain', .35]]);
// 70 «halte ich ihn eben mit dem Mund.» (golpe de zoom): el café en la boca, ojos de esfuerzo
shot(94.45, 'C', 'punch', L => { town(L); const p = V(SHP.x, 0, SHP.z + 6.4); put(me, p.x, 0, p.z, 0); hangBags(p); attach(HANDBAG, me.neck, [0, -.7, .9]); attach(COAT, me.head, [0, 1.45, 0], [0, 0, .15]); actuar(me, 0, [[0, { aLx: .25, aRx: .25, aLz: .35, aRz: .35, headX: -.12 }]], { T: L.T });
  cara(me, L.T, { expr: 'determined', eyes: 'squint', mouth: 'o' }); attach(CUPS[2], me.head, [0, .36, 1.1], [PI / 2, 0, 0], 1); sweat(me, L.T, 2);
  onFace(me, 4.6, 0, .3, 42, L.k, 4.1); sh(p, 14); }, [[0, 'gulp', .45], [.3, 'cup_rattle', .4]]);
// 71 «Und es geht nicht nur mir so.»: la plaza: más hombres cargados y con correa
shot(95.79, 'R', null, L => { town(L); for (let i = 0; i < 6; i++) pair(L, FR[i + 6], MA[i + 10], -16 + i * 6, -4 + (i % 2) * 8, PI * (i % 2) + .1, 2.2, i);
  for (let i = 0; i < 3; i++) { const m = MA[i + 20]; walkTo(m, -10 + i * 8, 16, PI / 2 * (i % 2 ? 1 : -1), 1.6, L, i, 7); cara(m, L.T + i, { expr: 'worried', mouth: 'frown' }); const pp = m.root.position; for (let k = 0; k < 2; k++) show(BAGS[i * 2 + k], pp.x + (k ? 1.7 : -1.7), .9, pp.z, k, .95); }
  orb(L.k, V(0, 2, 6), null, [44, .35, .45, 46], [38, .25, .4, 46]); sh(V(0, 0, 6), 40); }, [[0, 'city_amb', .45], [.4, 'chain_rattle', .35]]);
// 72 «Im Gartencenter bekommen Männer nur etwas,»: la cajera se cruza de brazos ante un cliente con su planta
const KAS = V(GX + 7, 0, -7);
shot(97.2, 'W', null, L => { garden(L); put(gae, KAS.x, 0, KAS.z - 2.4, 0); actuar(gae, 0, [[0, GEST.cross]], { T: L.T }); cara(gae, L.T, { expr: 'angry', mouth: 'frown', eyes: 'squint' }); MA[12].dog = true;
  put(MA[12], KAS.x - 1.4, 0, KAS.z + 4.4, PI + .35); actuar(MA[12], 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(MA[12], L.T, { expr: 'worried', mouth: 'o' }); const pl = WO.g;
  badge('red', 'NEIN!', W * .5, H * .17, clamp((L.T - 98.24) / .12), 1, .8);
  cm([GX - 4, 8.4, 6], [GX - 3.2, 8, 5], L.k); camera.lookAt(KAS.x - .4, 4.6, KAS.z); camera.fov = 46; }, [[0, 'cash_reg', .35], [.5, 'hmm', .35]]);
// 73 «wenn sie einen Zettel von ihrer Frau dabeihaben.»: el cliente enseña el «Einkaufszettel»; la cajera asiente
shot(99.1, 'S', null, L => { garden(L); put(gae, KAS.x, 0, KAS.z - 2.4, 0); const ok = L.T > 100.2; actuar(gae, 0, [[0, ok ? { aRx: 1.6, aRz: .1, aRe: .4, aLx: .3 } : { aLx: .3, aRx: .3, headX: .2 }]], { T: L.T }); cara(gae, L.T, { expr: ok ? 'happy' : 'sus', mouth: ok ? 'smile' : 'flat', eyes: ok ? 'happy' : 'squint' });
  put(MA[12], KAS.x - .6, 0, KAS.z + 3.2, PI + .2); actuar(MA[12], 0, [[0, { aRx: 1.7, aRe: .4, aRz: -.1, aLx: .4 }]], { T: L.T }); cara(MA[12], L.T, { expr: 'happy', mouth: 'grin' });
  POST.push(() => { const h = wpos(MA[12].aR.hand); show(NOTE, h.x, h.y + .9, h.z - .2, 0, 1.2); NOTE.lookAt(camera.position); });
  cm([KAS.x + 4.6, 7.6, KAS.z + 9], [KAS.x + 4, 7.4, KAS.z + 8.2], L.k); camera.lookAt(KAS.x - .6, 5.2, KAS.z + 1); camera.fov = 44; }, [[0, 'paper', .5], [.9, 'cash_reg', .45], [1.2, 'ding_soft', .3]]);
// tren: Lukas sentado en la fila z = 3, junto al pasillo (x = ZX - 3.6), mira +z
const SEAT = V(ZX - 3.6, 0, 3.4);
const trainSet = (L, pose = {}) => { train(L); put(me, SEAT.x, sitY(me, 3.1), SEAT.z, 0); actuar(me, 0, [[0, seatPose({ aLx: .5, aLe: .9, ...pose })]], { T: L.T }); put(FR[9], SEAT.x - 2.8, sitY(FR[9], 3.1), SEAT.z, 0); actuar(FR[9], 0, [[0, seatPose({ aLx: 1.0, aRx: 1.0, aLe: 1.4, aRe: 1.4, headX: .3 })]], { T: L.T }); cara(FR[9], L.T, { expr: 'neutral', eyes: 'down' }); };
// 74 «Der Schaffner im Zug»: el revisor avanza por el pasillo; Lukas le tiende el billete
shot(101.16, 'F', null, L => { trainSet(L, { aRx: 1.5, aRe: .2, aRz: -.15 }); inHand(TICKET, me, 'R', [0, -.75, .3], [-PI / 2, 0, 0], 1.1); cara(me, L.T, { expr: 'happy', mouth: 'smile' });
  walkTo(sch, ZX + .6, 13, PI, 2.6, L, 0, 8); cara(sch, L.T, { expr: 'neutral' }); cm([ZX + 2.6, 8.6, -7], [ZX + 2.4, 8.2, -6], L.k); camera.lookAt(ZX - 1.4, 4.8, 6); camera.fov = 50; }, [[0, 'wheels', .45], [.4, 'steps', .35]]);
// 75 «will nicht meine Fahrkarte sehen.»: el revisor aparta el billete con la mano sin mirarlo
shot(102.3, 'Z', null, L => { trainSet(L, { aRx: 1.5, aRe: .2, aRz: -.15 }); inHand(TICKET, me, 'R', [0, -.75, .3], [-PI / 2, 0, 0], 1.1); cara(me, L.T, { expr: 'confused', mouth: 'o' });
  put(sch, ZX + .4, 0, SEAT.z + 4.2, faceTo(V(ZX + .4, 0, SEAT.z + 4.2), V(SEAT.x, 0, SEAT.z)) ); actuar(sch, 0, [[0, { aRx: 1.3, aRz: .5 + Math.sin(L.T * 8) * .25, aRe: .3, aLx: .3, headY: -.3 }]], { T: L.T }); cara(sch, L.T, { expr: 'sus', eyes: 'side_r', mouth: 'flat' });
  badge('red', 'EGAL!', W * .5, H * .17, clamp((L.T - 102.8) / .12), 1, .75); cm([ZX + 4, 7.6, -4], [ZX + 3.4, 7.4, -3.2], L.k); camera.lookAt(SEAT.x + 1.6, 4.8, SEAT.z + 2.4); camera.fov = 48; }, [[0, 'paper', .45], [.5, 'swipe', .3]]);
// 76 «Stattdessen fragt er:»: el revisor se inclina hacia Lukas, desconfiado
shot(103.75, 'C', null, L => { trainSet(L); cara(me, L.T, { expr: 'worried', mouth: 'flat' }); put(sch, ZX + .2, 0, SEAT.z + 3.6, faceTo(V(ZX + .2, 0, SEAT.z + 3.6), V(SEAT.x, 0, SEAT.z))); actuar(sch, 0, [[0, { lean: .35, headX: -.1, aLx: .3, aRx: .9, aRe: 1.2 }]], { T: L.T }); cara(sch, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' });
  onFace(sch, 5.6, -.2, -.8, 44, L.k, 5.0); }, [[0, 'hmm', .45]]);
// 77 «Weiß deine Frau, wo du bist?»: bocadillo; Lukas suda
shot(104.61, 'I', null, L => { trainSet(L, { aLx: 1.2, aRx: 1.2, aLe: 1.8, aRe: 1.8 }); cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); sweat(me, L.T, 3); put(sch, ZX + .2, 0, SEAT.z + 3.6, faceTo(V(ZX + .2, 0, SEAT.z + 3.6), V(SEAT.x, 0, SEAT.z))); actuar(sch, 0, [[0, { lean: .35, headX: -.1, aRx: 1.4, aRe: .3, aRz: -.2 }]], { T: L.T });
  talk(sch, L.T, 104.61, 106.1, 'sus'); bubble(sch, 'Weiß deine Frau, wo du bist?', clamp((L.lt - .05) / .1), 1.0);
  cm([SEAT.x + 3.4, 6.8, SEAT.z + 8.8], [SEAT.x + 3.2, 6.6, SEAT.z + 8.0], L.k); camera.lookAt(SEAT.x + 1.6, 5.0, SEAT.z + 1.4); camera.fov = 48; }, [[0, 'gasp', .35], [.5, 'heartbeat', .35]]);
// gimnasio
const GB = V(MX, 0, 1);
// 78 «Der Bodybuilder im Fitnessstudio»: el culturista levanta la barra por encima de la cabeza
shot(106.24, 'W', null, L => { gymS(L); put(bb, GB.x, 0, GB.z, 0); const up = (Math.sin(L.T * 3) + 1) / 2; actuar(bb, 0, [[0, { aLx: 2.4 + up * .5, aRx: 2.4 + up * .5, aLz: .7, aRz: .7, aLe: 1.4 - up * 1.0, aRe: 1.4 - up * 1.0, crouch: .1 * (1 - up) }]], { T: L.T }); cara(bb, L.T, { expr: 'determined', mouth: 'grin' });
  POST.push(() => { const a = wpos(bb.aL.hand), b = wpos(bb.aR.hand); show(BAR, (a.x + b.x) / 2, (a.y + b.y) / 2 - .2, (a.z + b.z) / 2, 0, 1); });
  for (let i = 0; i < 3; i++) { const m = MA[24 + i]; put(m, GB.x - 9 + i * 9, 0, GB.z - 9, .1); actuar(m, 0, [[0, i === 1 ? GEST.cheer : { aRx: 1.2, aRe: 1.8 + Math.sin(L.T * 4 + i) * .4, aLx: .3 }]], { T: L.T }); cara(m, L.T + i, { expr: 'happy' }); }
  onBody(bb, 16, .25, .12, 46, L.k, 14); }, [[0, 'strain', .45], [.5, 'metal_hit', .3]]);
// 79 «hat 130 Kilo Muskeln.»: posa sacando bíceps: «130 KG»
shot(107.74, 'S', null, L => { gymS(L); put(bb, GB.x, 0, GB.z, 0); actuar(bb, 0, [[0, { aLx: 1.6, aRx: 1.6, aLz: 1.3, aRz: 1.3, aLe: 2.2, aRe: 2.2, headY: .3 + Math.sin(L.T * 3) * .15, lean: -.05 }]], { T: L.T }); grin(bb, L.T);
  badge('num', '130 KG', W * .5, H * .16, clamp((L.T - 107.92) / .12)); onBody(bb, 13.5, -.25, .1, 44, L.k, 12); }, [[0, 'stretch', .4], [.3, 'ding_reveal', .4]]);
// 80 «Doch seine Freundin pfeift»: Kim, en la puerta, silba con dos dedos: «PFIFF!»
shot(109.62, 'Z', null, L => { gymS(L); put(kim, GB.x + 8, 0, GB.z + 6, -PI / 2 - .4); actuar(kim, 0, [[0, { aRx: 2.6, aRz: -.5, aRe: 2.4, aLx: .3, aLz: .3, headX: -.05 }]], { T: L.T }); cara(kim, L.T, { expr: 'smug', eyes: 'squint', mouth: 'o' });
  badge('gold', 'PFIFF!', W * .5, H * .17, clamp((L.T - 110.62) / .1), 1, .8); onBody(kim, 10.5, .2, .1, 42, L.k, 9.4); }, [[1.0, 'whistle', .7]]);
// 81 «ein einziges Mal,»: el culturista se congela con la barra en alto; ojos como platos
shot(110.96, 'C', null, L => { gymS(L); put(bb, GB.x, 0, GB.z, 0); actuar(bb, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .7, aRz: .7, aLe: .4, aRe: .4, headY: .5 }]], { T: L.T }); cara(bb, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  POST.push(() => { const a = wpos(bb.aL.hand), b = wpos(bb.aR.hand); show(BAR, (a.x + b.x) / 2, (a.y + b.y) / 2 - .2, (a.z + b.z) / 2, 0, 1); }); onFace(bb, 5.4, .2, .4, 44, L.k, 4.8); }, [[0, 'freeze', .45]]);
// 82 «und schon lässt er die Hantel fallen»: la barra cae al suelo; polvo
shot(112.1, 'F', null, L => { gymS(L); put(bb, GB.x, 0, GB.z, .5); const t = clamp((L.T - 112.5) / .35); actuar(bb, 0, [[0, { aLx: 2.0, aRx: 2.0, aLz: .9, aRz: .9, headY: .7 }]], { T: L.T }); cara(bb, L.T, { expr: 'happy', mouth: 'open_smile' });
  show(BAR, GB.x, lerp(8.6, .9 * 1.3, easeIn(t)), GB.z + 1.2, 0, 1); dust(V(GB.x, 0, GB.z + 1.2), 112.85, L.T, 12, 1); orb(L.k, V(GB.x, 3.4, GB.z), null, [18, -.35, .12, 46], [16, -.45, .1, 46]); }, [[.7, 'metal_hit', .65], [.75, 'boom', .45]]);
// 83 «und rennt.»: corre hacia Kim a toda velocidad, feliz
shot(113.44, 'W', null, L => { gymS(L); const t = L.lt; put(bb, GB.x + t * 9, Math.abs(Math.sin(L.T * 12)) * .3, GB.z + t * 4, 1.15); actuar(bb, 0, [[0, { ...walkP(L.T, 0, 16), aLx: 1.6, aRx: -.6, lean: .3 }]], { T: L.T }); laughF(bb, L.T);
  put(kim, GB.x + 12, 0, GB.z + 6.5, -PI / 2 - .4); actuar(kim, 0, [[0, { aLx: 1.0, aRx: 1.0, aLz: .6, aRz: .6 }]], { T: L.T }); cara(kim, L.T, { expr: 'smug', mouth: 'smile' }); show(BAR, GB.x, .9 * 1.3, GB.z + 1.2, 0, 1); dust(V(GB.x + t * 9, 0, GB.z + t * 4), 113.5, L.T, 6, .6);
  orb(L.k, V(GB.x + 6, 3.6, GB.z + 4), null, [20, .2, .12, 48], [18, .25, .1, 48]); }, [[0, 'steps_heavy', .55], [.3, 'whoosh', .3]]);
// oficina
const MT = V(OX, 0, -2);
const meetSet = (L, o = {}) => { office(L); put(chef, OX + 2.2, 0, -12.2, -.15); for (let k = 0; k < 6; k++) { const s = k % 2 ? 1 : -1, m = MA[12 + k]; put(m, OX + s * 4.8, sitY(m, 2.8), MT.z - 7 + Math.floor(k / 2) * 4.6, -s * PI / 2); actuar(m, 0, [[0, seatPose({ aLx: 1.1, aRx: 1.1, aLe: 1.4, aRe: 1.4, headY: s * .5 })]], { T: L.T }); cara(m, L.T + k, { expr: o.ex || 'neutral', mouth: o.mo, eyes: o.ey }); } };
// 84 «Mein Chef bekommt mitten im Meeting»: el jefe presenta los gráficos ante la mesa
shot(114.21, 'S', null, L => { meetSet(L); actuar(chef, 0, [[0, { aLx: 1.5, aLz: .5, aLe: .2, aRx: .4, aRe: .6, headY: .3 }]], { T: L.T }); talk(chef, L.T, 114.2, 115.4, 'happy');
  cm([OX + 1, 10, 13], [OX + 1, 9.6, 11.6], L.k); camera.lookAt(OX + .6, 5.4, -7); camera.fov = 48; }, [[0, 'murmur', .35], [.4, 'click_set', .35]]);
// 85 «einen Anruf.»: le vibra el móvil: «SCHATZ ♥ ruft an»
shot(115.45, 'Z', null, L => { meetSet(L); actuar(chef, 0, [[0, holdPhone]], { T: L.T }); cara(chef, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); phoneAt(chef, 'SCHATZ|ruft an...|', 1.9, -.6, 1.1); PHONE.rotation.z = Math.sin(L.T * 60) * .04;
  onFace(chef, 6.4, -.4, .2, 44, L.k, 5.6); }, [[0, 'phone_ring', .55], [.2, 'vibrate', .45]]);
// 86 «Ja, Schatz.»: contesta con voz de corderito
shot(116.63, 'C', null, L => { meetSet(L, { ex: 'confused' }); actuar(chef, 0, [[0, { ...GEST.phone, headX: .2, lean: .1 }]], { T: L.T }); cara(chef, L.T, { expr: 'worried', eyes: 'down', mouth: 'smile', blush: 1 }); bubble(chef, 'Ja, Schatz.', clamp((L.lt - .02) / .1), 1.2);
  onFace(chef, 5.6, -.1, -.5, 44, L.k, 5.0); }, [[0, 'whisper', .25]]);
// 87 «Fünf Minuten später»: el reloj de pared gira: «5 MINUTEN SPÄTER»
shot(117.33, 'Z', null, L => { meetSet(L, { ex: 'confused' }); actuar(chef, 0, [[0, { ...GEST.phone, headX: .2 }]], { T: L.T }); cara(chef, L.T, { expr: 'happy', eyes: 'closed', mouth: 'smile' });
  badge('tag', '5 MINUTEN SPÄTER', W * .5, H * .2, clamp((L.lt - .05) / .12)); TINT = 'rgba(30,40,80,.18)'; cm([OX - 6, 9, 8], [OX - 5, 8.6, 7], L.k); camera.lookAt(OX + 1.4, 5.6, -10); camera.fov = 46; }, [[0, 'clock_spin', .55]]);
// 88 «hat er die Firma verkauft.» (zoom lento): la pantalla: «FIRMA VERKAUFT»; todos alucinan
shot(118.59, 'F', 'slow', L => { meetSet(L, { ex: 'shock', mo: 'o', ey: 'wide' }); BU.SCR.userData.set('sold'); actuar(chef, 0, [[0, { aRx: 2.7, aRz: .4, aRe: .4, aLx: .3 }]], { T: L.T }); grin(chef, L.T);
  cm([OX + 1, 9, 12], [OX + .8, 8.6, 9], L.k, easeIn); camera.lookAt(OX + .6, 6.4, -12); camera.fov = 48; }, [[0, 'gasp', .45], [.3, 'cash', .35]]);
// abuelos en el banco del parque (-14, -10 respecto al parque), mirando +z
const BEN = V(PX - 14, 0, -10);
const bench2 = (L, opaPose = {}, omaPose = {}) => { parkS(L); put(opa, BEN.x + 1.6, sitY(opa, 2.45), BEN.z - .2, 0); put(oma, BEN.x - 1.6, sitY(oma, 2.45), BEN.z - .2, 0); actuar(opa, 0, [[0, seatPose({ aLx: .8, aRx: .8, aLe: 1.2, aRe: 1.2, ...opaPose })]], { T: L.T }); actuar(oma, 0, [[0, seatPose({ aLx: .9, aLe: 1.4, aRx: 1.3, aRe: .8, aRz: .2, ...omaPose })]], { T: L.T }); };
// 89 «Opa ist sogar schon seit 47 Jahren»: Oma habla sin parar; Opa asiente (con collar): «47 JAHRE»
shot(119.65, 'W', null, L => { bench2(L, { headX: Math.max(0, Math.sin(L.T * 5)) * .25 }, { aRx: 1.3 + Math.sin(L.T * 7) * .3, headY: .4 }); talk(oma, L.T, 119.6, 121.7, 'happy'); cara(opa, L.T, { expr: 'neutral', eyes: 'half', mouth: 'flat' });
  bubble(oma, 'Bla bla bla…', clamp((L.lt - .1) / .1), 1.1); badge('num', '47 JAHRE', W * .5, H * .16, clamp((L.T - 120.67) / .12), 1, .9); orb(L.k, V(BEN.x, 3.6, BEN.z), null, [14, .15, .1, 46], [12.6, .05, .08, 46]); sh(BEN, 18); }, [[0, 'birds', .4], [.5, 'murmur', .3]]);
// 90 «ein Good Boy.»: primer plano de Opa con su collar, asintiendo obediente
shot(121.73, 'S', null, L => { bench2(L, { headX: Math.max(0, Math.sin(L.T * 6)) * .3 }); cara(opa, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' }); talk(oma, L.T, 121.7, 122.6, 'happy');
  onFace(opa, 4.6, -.1, .4, 42, L.k, 4.1); sh(BEN, 14); }, [[0, 'chain_rattle', .35]]);
// 91 «Deshalb weiß keiner mehr,»: los vecinos miran a Opa, intrigados
shot(122.6, 'I', null, L => { bench2(L); cara(opa, L.T, { expr: 'neutral', mouth: 'flat' }); cara(oma, L.T, { expr: 'happy' }); [[FR[10], -4.6, 6, PI - .4], [MA[21], 0, 7.4, PI], [FR[11], 4.8, 6, PI + .4]].forEach(([c, dx, dz, ry], i) => { put(c, BEN.x + dx, 0, BEN.z + dz, ry); actuar(c, 0, [[0, i === 1 ? GEST.think : GEST.shrug]], { T: L.T }); cara(c, L.T + i, { expr: 'confused' }); });
  badge('q', '?', W * .5, H * .2, clamp((L.lt - .1) / .12)); cm([BEN.x + 2, 7.4, BEN.z - 7.6], [BEN.x + 1.6, 7.2, BEN.z - 6.8], L.k); camera.lookAt(BEN.x, 3.6, BEN.z + 4); camera.fov = 48; sh(BEN, 18); }, [[0, 'hmm', .4], [.4, 'murmur', .3]]);
// 92 «wie seine Stimme klingt.»: Opa abre la boca… y no sale nada: «…»
shot(123.66, 'Z', null, L => { bench2(L, { headX: -.1 }); cara(opa, L.T, { expr: 'neutral', eyes: 'wide', mouth: L.T > 123.9 ? 'o' : 'flat' }); cara(oma, L.T, { expr: 'happy' }); bubble(opa, '…', clamp((L.T - 124.0) / .1), 1.1);
  onFace(opa, 5.0, -.1, -.3, 42, L.k, 4.4); sh(BEN, 14); }, [[0, 'crickets', .45]]);
// 93 «Nicht mal Oma.»: Oma se encoge de hombros
shot(124.65, 'C', null, L => { bench2(L, {}, GEST.shrug); cara(oma, L.T, { expr: 'confused', mouth: 'flat' }); cara(opa, L.T, { expr: 'neutral' }); onFace(oma, 5.2, -.1, .3, 42, L.k, 4.6); sh(BEN, 14); }, [[0, 'laugh_old', .3]]);

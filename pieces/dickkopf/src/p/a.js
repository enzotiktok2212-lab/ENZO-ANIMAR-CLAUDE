// ---------- a: gancho, ejemplos, yo y la puerta (0 – 29,40 s) ----------
// Plaza de Hufenbach: acción hacia (0, 0, 30), cámara desde +z (al fondo el Rathaus). Casas del este en x ≈ 44 (fachadas), carretera x = 26.
const PZ = 30;
// 1 «In dieser Stadt»: picado desde el cielo que baja a la plaza llena de gente con cabezas enormes paseando
shot(0, 'Z', null, L => { town(L); extras(L, EXS.slice(0, 10), [[-14, 20, .6], [12, 26, -.8], [-4, 40, PI], [16, 44, -2.4], [-20, 48, 2.2], [4, 12, .3], [-10, 6, 1], [20, 8, -1.2], [-26, 30, 1.6], [8, 54, 2.8]], 'walk', { heads: [2.2, 1.6, 3, 2.6, 1.9, 2.8, 2.4, 1.7, 3.2, 2] });
  cm([30, 90, 110, 0, 0, 25, 50], [14, 26, 62, 0, 4, 22, 46], L.k, easeOut); sh(V(0, 0, 28), 50); }, [[0, 'whoosh_down', .6], [.4, 'crowd_murmur', .4]]);
// 2 «wird dein Kopf mit jedem»: un vecino de camisa azul coge aire, inflando el pecho; la gente pasa detrás
shot(.83, 'C', null, L => { town(L); const c = put(VEC[0], 0, 0, PZ, 0); const k = clamp(L.lt / 1.1); actuar(c, 0, [[0, { aLz: .2 + k * .3, aRz: .2 + k * .3, aLx: .2, aRx: .2, headX: -.15 * k, lean: -.06 * k }]], { T: L.T }); cara(c, L.T, { eyes: 'half', mouth: 'o' });
  extras(L, EXS.slice(10, 13), [[-12, PZ - 10, PI / 2], [12, PZ - 14, -PI / 2], [-6, PZ - 22, .4]], 'walk', { heads: [2.4, 2, 2.8] }); fcam(c, 15, L.k, 12.5, .25, -1.5, 42); sh(V(0, 0, PZ), 30); }, [[.1, 'inhale', .7]]);
// 3 «HUSS größer.»: ¡HUSS! y la cabeza le crece de golpe (1 → 2,2)
shot(2.09, 'F', 'punch', L => { town(L); const c = put(VEC[0], 0, 0, PZ, 0); hussPose(c, L); kopf(c, pop(1, 2.2, (L.lt - .05) / .35)); hussFX(L, 0, .17);
  extras(L, EXS.slice(10, 12), [[-12, PZ - 8, .3], [12, PZ - 12, -.4]], 'shock', { heads: [2.4, 2] }); fcam(c, 19, L.k, 16, 0, -.4, 44); sh(V(0, 0, PZ), 30); }, [[0, 'huss', 1], [.06, 'balloon_inflate', .7]]);
// 4 ¡HUSS! (2): una vecina con moño frente a la fuente: 1,8 → 2,6
shot(3.26, 'C', 'punch', L => { town(L); const c = put(VEC[1], -18, 0, -14, .5); hussPose(c, L); kopf(c, pop(1.6, 2.6, L.lt / .25)); hussFX(L, 0, .18, 1);
  orb(L.k, hc(c).add(V(0, -.5, 0)), null, [19, .7, .05, 44], [16.5, .55, .05, 44]); sh(V(-18, 0, -14), 30); }, [[0, 'huss', 1], [.03, 'balloon_inflate', .6]]);
// 5 ¡HUSS! (3): un niño de gorra junto al café: 2,2 → 3,1
shot(3.68, 'C', 'punch', L => { town(L); const c = put(KIDS[1], 30, 0, -34, -.5); hussPose(c, L); kopf(c, pop(2.2, 3.1, L.lt / .22)); hussFX(L, 0, .19, .95);
  orb(L.k, hc(c).add(V(0, -.3, 0)), null, [17, -.5, .1, 44], [15, -.35, .1, 44]); sh(V(30, 0, -34), 30); }, [[0, 'huss', 1], [.03, 'balloon_inflate', .6]]);
// 6 ¡HUSS! (4): plano general: tres cabezas enormes a la vez en la plaza; grúa hacia arriba
shot(4.0, 'W', null, L => { town(L); [[VEC[0], -8, PZ - 6, .3, 2.2], [VEC[1], 0, PZ - 10, 0, 2.6], [KIDS[1], 8, PZ - 6, -.3, 3.2]].forEach(([c, x, z, ry, s], i) => { put(c, x, 0, z, ry); hussPose(c, L, i * .05); kopf(c, s + L.k * .4); });
  hussFX(L, 0, .16, .9); cm([0, 4, PZ + 22, 0, 6, PZ - 8, 46], [0, 9, PZ + 18, 0, 7, PZ - 8, 46], L.k); sh(V(0, 0, PZ - 6), 34); }, [[0, 'huss', 1], [.05, 'balloon_inflate', .6]]);
// Paketbote: puertas de las casas del este (fachada ≈ x 44); él de espaldas a la puerta, mirando a -x
const BX = 37;
// 7 «Unser Paketbote husst»: el repartidor con un paquete delante de una puerta: ¡HUSS! (5,19) y la cabeza 1,6 → 2,3
shot(4.39, 'S', null, L => { town(L); const c = put(bote, BX, 0, 4, -PI / 2 + .25); attach(PAK[0], c.root, [0, 3.0, 1.5], [0, 0, 0], .85); const h = L.T >= 5.19;
  if (h) { hussPose(c, L, 5.19 - L.t0, { pose: { aLx: 1.2, aLe: 1.4 } }); kopf(c, pop(1.6, 2.3, (L.T - 5.19) / .25)); hussFX(L, 5.19 - L.t0, .17, .9); } else { actuar(c, 0, [[0, { aLx: 1.2, aLe: 1.4, aRx: .4, aRe: .3 }]], { T: L.T }); kopf(c, 1.6); cara(c, L.T, { expr: 'happy' }); }
  orb(L.k, hc(c).add(V(0, -.6, 0)), null, [21, -PI / 2 - .25, .08, 44], [17, -PI / 2 - .05, .08, 44]); sh(V(BX, 0, 4), 30); }, [[0, 'doorbell', .6], [.8, 'huss', 1], [.82, 'balloon_inflate', .6]]);
// 8 «an jeder Haustür.»: en la siguiente puerta, otro paquete, otro HUSS: 2,3 → 3,0; una vecina abre y se asusta
shot(5.59, 'C', 'punch', L => { town(L); const c = put(bote, BX, 0, -6, -PI / 2 - .2); attach(PAK[1], c.root, [0, 3.0, 1.5], [0, 0, 0], .85); hussPose(c, L, .05, { pose: { aLx: 1.2, aLe: 1.4 } }); kopf(c, pop(2.3, 3, (L.lt - .05) / .25)); hussFX(L, .05, .16, .9);
  const v = put(EXS[3], BX + 3, 0, -13, -PI / 2 - .6); crowdGuy(v, BX + 3, -13, L, 1, { mode: 'shock', ry: -PI / 2 + .5 }); orb(L.k, hc(c).add(V(0, -.8, 0)), null, [23, -PI / 2 + .3, .1, 44], [19, -PI / 2 + .15, .1, 44]); sh(V(BX, 0, -6), 30); }, [[0, 'doorbell', .5], [.05, 'huss', 1], [.08, 'balloon_inflate', .6]]);
// Lieferwagen en la carretera (x = 26) mirando a +z; puerta del conductor a la izquierda (x ≈ 23)
const VZ = 20;
// 9 «Jetzt passt sein Kopf nicht mehr»: camina hacia su furgoneta con la cabeza enorme (3,4) que se bambolea
shot(6.91, 'W', null, L => { town(L); show(VAN, 26, 0, VZ, 0); const c = walk(bote, L, 34, VZ + 20, -2.5, 2.6, 0, { expr: 'happy' }); kopf(c, 3.4); c.head.rotation.z = Math.sin(L.T * 4.5) * .12;
  const p = c.root.position; orbit(V(p.x, 9.5, p.z), lerp(25, 21, L.k), -2.5 + .5, .12, 46); sh(V(p.x, 0, p.z), 34); }, [[0, 'steps', .5], [.4, 'whistle', .3]]);
// 10 «in seinen Lieferwagen.»: intenta meterse por la puerta del conductor: la cabeza choca con el techo, la furgoneta se balancea
shot(8.03, 'C', 'punch', L => { town(L); const v = show(VAN, 26, 0, VZ, 0); const b = Math.max(0, Math.sin(L.lt * 9)) * Math.exp(-L.lt * 2); v.rotation.z = b * .06; const c = put(bote, 22.4, 0, VZ + 5.5, .9); kopf(c, 3.4); c.head.rotation.z = -.25 - b * .2;
  actuar(c, 0, [[0, { aRx: 1.4, aRz: .3, aRe: .4, aLx: .8, aLz: .5, lean: .15, headX: .2 }]], { T: L.T }); cara(c, L.T, { eyes: 'squint', mouth: 'grimace' }); sweat(c, L.T);
  orb(L.k, V(23, 8.5, VZ + 5), null, [24, .45, .12, 46], [21, .3, .12, 46]); sh(V(24, 0, VZ + 4), 30); }, [[0, 'bonk', .9], [.25, 'car_rock', .5], [.6, 'groan', .5]]);
// Oma en el banco del oeste (-36, 20) mirando a +x
// 11 «Omas Kopf ist so groß,»: grúa desde sus pies hasta la cabeza gigante (3,4) mientras hace punto
shot(9.4, 'Z', null, L => { town(L); const c = sit(oma, -35.4, 2.4, 20.3, PI / 2, L, { aLx: 1.0, aRx: 1.0, aLz: -.3, aRz: -.3, aLe: 1.5 + Math.sin(L.T * 9) * .2, aRe: 1.5 - Math.sin(L.T * 9) * .2 }); kopf(c, 3.4); cara(c, L.T, { expr: 'happy' });
  extras(L, EXS.slice(4, 6), [[-22, 6, -.3], [-24, 36, PI - .2]], 'walk', { heads: [2.2, 2.6] }); cm([-20, 3, 22, -35, 3, 20, 48], [-17, 9, 26, -35, 9, 20, 46], L.k); sh(V(-34, 0, 20), 30); }, [[0, 'whoosh_up', .4], [.2, 'knit', .4]]);
// 12 «dass es über ihr schneit.»: su propia nube de nieve encima de la cabeza; tirita y se sacude los copos
shot(10.52, 'F', null, L => { town(L); const c = sit(oma, -35.4, 2.4, 20.3, PI / 2, L, { aLx: .9, aRx: .9, aLz: .6, aRz: .6, aLe: 1.9, aRe: 1.9, headX: .05, ...shiver(L.T, 3) }); kopf(c, 3.4); cara(c, L.T, { expr: 'worried', mouth: 'wavy' });
  const h = hc(c); const s = show(SNOW, h.x, h.y + 4.6, h.z, 0, 1.2); s.userData.snow(L.T, 5.5); orb(L.k, h.add(V(0, -.6, 0)), null, [21, PI / 2 - .3, .08, 44], [18, PI / 2 - .1, .08, 44]); sh(V(-34, 0, 20), 30); }, [[0, 'flash', .3], [.1, 'wind_cold', .6], [.5, 'teeth_chatter', .4]]);
// Baño de Jonas (BDX): bañera en (BDX, 0, -6), borde a y ≈ 4,2
const TUBP = [BDX, 4.4, -6];
const inTub = (c, L, pose = {}) => { put(c, TUBP[0], sitY(c, TUBP[1]), TUBP[2], 0); actuar(c, 0, [[0, sitPose({ aLx: .4, aRx: .4, aLz: .5, aRz: .5, aLe: .5, aRe: .5, ...pose })]], { T: L.T, weight: false }); c.blob.visible = false; return c; };
// 13 «Mein bester Freund Jonas hat einmal in der Badewanne»: Jonas en la bañera con espuma, juega con el patito
shot(12.6, 'S', null, L => { bath(L); const c = inTub(jonas, L, { aRx: 1.2, aRe: 1.2, aRz: .1 + Math.sin(L.T * 3) * .2 }); laughF(c, L.T); show(ENTE, TUBP[0] + 2.4, 4.3 + Math.sin(L.T * 4) * .1, TUBP[2] + 1.2, -.6, 1);
  orb(L.k, hc(c).add(V(0, -1.2, 0)), null, [15, .45, .22, 44], [13, .25, .2, 44]); }, [[0, 'water_splash', .5], [.6, 'duck_squeak', .6]]);
// 14 «gehusst.» (15,18): coge aire… ¡HUSS! y la cabeza se le hace enorme (1 → 4,4), rozando el techo
shot(14.24, 'C', null, L => { bath(L); const c = inTub(jonas, L); const t = 15.18 - L.t0; if (L.lt < t) { cara(c, L.T, { eyes: 'half', mouth: 'o' }); kopf(c, 1); } else { hussPose(c, L, t, { pose: sitPose({ aLx: 1, aRx: 1, aLe: 1.6, aRe: 1.6 }) }); kopf(c, pop(1, 4.4, (L.lt - t) / .3)); hussFX(L, t, .15, .9); }
  show(ENTE, TUBP[0] + 2.4, 4.3, TUBP[2] + 1.2, -.6, 1); orb(L.k, V(BDX, 9.5, -6), null, [21, .2, .14, 46], [19, .1, .14, 46]); }, [[.1, 'inhale', .6], [.94, 'huss', 1], [.97, 'balloon_inflate', .7]]);
// 15 «Er steckt immer noch drin.»: la cabeza atascada entre las paredes; Jonas triste con el patito; calendario con días tachados
shot(15.73, 'W', null, L => { bath(L); const c = inTub(jonas, L, { aRx: .9, aRe: 1.4 }); kopf(c, 4.4); c.head.rotation.z = Math.sin(L.T * 1.5) * .05; cara(c, L.T, { expr: 'sad', mouth: 'wavy' }); attach(ENTE, c.aR.hand, [0, -.6, .6], [0, 0, 0], .5);
  orb(L.k, V(BDX, 9, -6), null, [17, -.25, .1, 46], [19, -.1, .12, 46]); bigNum('SEIT 3 WOCHEN', clamp((L.lt - .2) / .2), 'gold', .13, .8); }, [[0, 'whoosh_soft', .4], [.3, 'sad_trombone', .4]]);
// 16 «Aber ich?»: yo, cabeza normal, me giro hacia la cámara en la plaza entre cabezas gigantes
shot(16.97, 'Z', 'punch', L => { town(L); const c = put(ich, 0, 0, PZ, lerp(-.9, 0, easeOut(clamp(L.lt / .3)))); actuar(c, 0, [[0, { aRx: 1.2, aRz: -.4, aRe: 1.6, headY: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  extras(L, EXS.slice(0, 4), [[-8, PZ - 8, .5], [8, PZ - 10, -.4], [-14, PZ - 20, .2], [12, PZ - 22, -.1]], 'walk', { heads: [2.6, 3, 2.2, 2.8] }); fcam(c, 15, L.k, 12.5, 0, -1.5, 42); sh(V(0, 0, PZ), 30); }, [[0, 'zoom_in', .5]]);
// 17 «Mein Kopf ist ganz normal.»: me mido la cabeza con una cinta métrica amarilla; «NORMAL» en verde
shot(17.65, 'S', null, L => { town(L); const c = put(ich, 0, 0, PZ, .15); actuar(c, 0, [[0, { aLx: 2.6, aLz: .5, aLe: 1.2, aRx: 2.6, aRz: .5, aRe: 1.2 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'up' });
  bigNum('NORMAL ✓', clamp((L.lt - .3) / .2), 'green', .17, .95); orb(L.k, hc(c).add(V(0, -1.8, 0)), null, [13, .5, .05, 40], [11.5, .2, .05, 40]); sh(V(0, 0, PZ), 26); }, [[.3, 'pling', .5]]);
// 18 «Denn ich habe noch nie gehusst.»: hago el gesto de cerrarme la boca con cremallera y niego con la cabeza
shot(19.12, 'C', null, L => { town(L); const c = put(ich, 0, 0, PZ, -.1); const z = clamp(L.lt / .5); actuar(c, 0, [[0, { aRx: 1.7, aRz: lerp(.5, -.4, z), aRe: 1.9, headY: L.lt > .6 ? Math.sin(L.T * 12) * .25 : 0 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'flat' });
  extras(L, EXS.slice(4, 6), [[-9, PZ - 12, .3], [10, PZ - 14, -.3]], 'walk', { heads: [2.5, 2.9] }); fcam(c, 11, L.k, 9.5, -.35, -1.4, 40); sh(V(0, 0, PZ), 26); }, [[.1, 'zipper', .7]]);
// 19 «Kein einziges Mal.»: brazos cruzados, orgulloso; contador «0× HUSS»
shot(20.67, 'F', null, L => { town(L); const c = put(ich, 0, 0, PZ, 0); actuar(c, 0, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.75, aRz: -.75, aLe: 1.7, aRe: 1.7, headX: -.06 }]], { T: L.T }); cara(c, L.T, { expr: 'smug' }); bigNum('0× HUSS', clamp((L.lt - .1) / .2), 'gold', .1, 1.1);
  orb(L.k, hc(c).add(V(0, -1.6, 0)), null, [16, -.3, .1, 42], [14, -.05, .1, 42]); sh(V(0, 0, PZ), 26); }, [[.1, 'ding', .5]]);
// 20 «Alle lachen mich aus.»: los niños de cabezas enormes se ríen y me señalan; yo en primer término
shot(21.9, 'W', null, L => { town(L); [[KIDS[0], -5, PZ - 6, .3, 2.6], [KIDS[1], 0, PZ - 8, 0, 3.1], [KIDS[2], 5, PZ - 6, -.3, 2.4], [KIDS[3], 9, PZ - 3, -.6, 2.8]].forEach(([c, x, z, ry, s], i) => { put(c, x, 0, z, ry); kopf(c, s); actuar(c, 0, [[0, i % 2 ? { aRx: 1.6, aRe: .1, aLx: .8, aLz: .4, aLe: 1.6, lean: -.1 } : { aLx: 1.2, aRx: 1.2, aLz: -.3, aRz: -.3, aLe: 1.6, aRe: 1.6, lean: .15 + Math.sin(L.T * 14 + i) * .05 }]], { T: L.T }); laughF(c, L.T + i); });
  const m = put(ich, -3, 0, PZ + 9, PI - .3); actuar(m, 0, [[0, { aLx: .1, aRx: .1 }]], { T: L.T }); orb(L.k, V(1, 6, PZ - 4), null, [22, .15, .14, 46], [19, -.05, .12, 46]); sh(V(0, 0, PZ - 4), 30); }, [[0, 'kids_laugh', .7]]);
// 21 «Digga,»: un niño con cabeza enorme se agacha hacia mí burlándose
shot(22.78, 'C', 'punch', L => { town(L); const c = put(KIDS[1], 0, 0, PZ - 4, 0); kopf(c, 3.1); actuar(c, 0, [[0, { lean: .25, aLx: .4, aRx: .4, aLz: .5, aRz: .5, aLe: .6, aRe: .6 }]], { T: L.T }); talk(c, L.T, 22.78, 23.68, 'smug');
  fcam(c, 21, L.k, 18, .2, -1, 42); bubble(c, 'Digga…', clamp(L.lt / .2), 1.6); sh(V(0, 0, PZ), 30); }, [[0, 'whoosh_soft', .4]]);
// 22 «warum ist dein Kopf so winzig?»: contraplano por encima de la cabeza gigante: yo pequeñito mirando hacia arriba
shot(23.68, 'S', null, L => { town(L); const k = put(KIDS[1], 0, 0, PZ - 4, 0); kopf(k, 3.1); actuar(k, 0, [[0, { lean: .2, aRx: 1.5, aRe: .1 }]], { T: L.T }); talk(k, L.T, 23.68, 25, 'smug');
  const c = put(ich, 0, 0, PZ + 5, PI); actuar(c, 0, [[0, { headX: -.25, aLx: .2, aRx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'neutral', eyes: 'up' }); const h = hc(c);
  cm([-4, 15, PZ - 9, h.x, h.y - 1, h.z, 46], [-3, 13.5, PZ - 8, h.x, h.y - 1, h.z, 42], L.k); bigNum('WINZIG?', clamp((L.lt - .7) / .2), 'red', .15, .95); sh(V(0, 0, PZ), 26); }, [[.7, 'boing', .5]]);
// 23 «Ich lächle nur.»: primer plano: sonrío tranquilo; detrás los niños aún riéndose desenfocados
shot(25.24, 'F', null, L => { town(L); const c = put(ich, 0, 0, PZ, .1); actuar(c, 0, [[0, { aLx: .1, aRx: .1, headZ: -.08 }]], { T: L.T }); cara(c, L.T, { eyes: 'happy', mouth: 'smile', noBlink: true });
  [KIDS[0], KIDS[2]].forEach((k, i) => { put(k, i ? 6 : -6, 0, PZ - 12, i ? -.4 : .4); kopf(k, 2.6); actuar(k, 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.6, aRe: 1.6 }]], { T: L.T }); laughF(k, L.T + i); }); fcam(c, 10, L.k, 8.5, .15, -1.2, 38); sh(V(0, 0, PZ), 26); }, [[.1, 'sparkle', .4]]);
// Bäckerei (puerta abierta) en (-6, 0, 52) mirando a +z
const TX = -6, TZ = 52;
// 24 «Ich bin der Einzige, der noch durch eine Tür»: entro tan tranquilo por la puerta de la Bäckerei
shot(26.15, 'W', null, L => { town(L); show(TUER, TX, 0, TZ, 0); const c = walk(ich, L, TX + .2, TZ + 7, PI, 3.2, 0, { expr: 'happy' }); extras(L, EXS.slice(6, 8), [[TX - 12, TZ + 10, .2], [TX + 12, TZ + 12, -.3]], ['shock', 'point'], { heads: [3, 2.6] });
  cm([TX + 14, 8, TZ + 32, TX, 6, TZ + 2, 46], [TX + 8, 8, TZ + 27, TX, 6, TZ + 2, 44], L.k); sh(V(TX, 0, TZ + 6), 30); }, [[0, 'steps', .5], [.6, 'shop_bell', .6]]);
// 25 «passt.»: detrás de mí, dos vecinos de cabeza gigante se quedan atascados en el marco empujando
shot(27.29, 'C', 'punch', L => { town(L); show(TUER, TX, 0, TZ, 0); const a = put(VEC[2], TX, 0, TZ - .4, 0); kopf(a, 3.4); a.head.rotation.z = Math.sin(L.T * 10) * .08; actuar(a, 0, [[0, { lean: .3, aLx: 1.6, aRx: 1.6, aLe: .2, aRe: .2 }]], { T: L.T }); cara(a, L.T, { eyes: 'squint', mouth: 'grimace' });
  const b = put(VEC[4], TX + 1.4, 0, TZ - 2.6, 0); kopf(b, 2.8); actuar(b, 0, [[0, { lean: .35, aLx: 1.8, aRx: 1.8, aLe: .1, aRe: .1 }]], { T: L.T }); cara(b, L.T, { eyes: 'squint', mouth: 'grimace' }); sweat(a, L.T);
  orb(L.k, V(TX, 8.5, TZ + 1), null, [24, .35, .1, 46], [21, .15, .1, 46]); sh(V(TX, 0, TZ + 4), 30); }, [[0, 'bonk', .8], [.3, 'squeeze', .6], [.6, 'groan', .5]]);
// 26 «Dann wurde es schlimmer.»: la plaza al atardecer, viento; miro arriba preocupado (zoom lento)
shot(28.13, 'Z', 'slow', L => { town(L, { dusk: true }); const c = put(ich, 0, 0, PZ, 0); actuar(c, 0, [[0, { headX: -.3, aLx: .2, aRx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'up' });
  extras(L, EXS.slice(8, 11), [[-10, PZ - 14, .3], [10, PZ - 16, -.3], [0, PZ - 26, 0]], ['shock', 'point', 'shock'], { heads: [3.2, 2.8, 3.6] }); fcam(c, 17, L.k, 12, 0, -1.7, 44, -.05); sh(V(0, 0, PZ), 30); }, [[0, 'wind', .5]]);

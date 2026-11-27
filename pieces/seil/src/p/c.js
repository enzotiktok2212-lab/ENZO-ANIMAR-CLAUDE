// ---------- c: ya no hay nadie, el invierno, la cuerda de cerca, la torre de personas y Lotte (100,68 – 152,43 s) ----------
// Nieve desde x ≈ 960. Torre de Lotte en TX (cara al pueblo: ángulo π, x ≈ TX − tR(y)). Muro de gente real: wand(L, lista, a0, y0, filas, columnas).
const WX = 1060; NOGRASS.push([858, -62, 884, -34]);   // donde camino en invierno
const HORN_LOST = P_(horn()); outline(HORN_LOST, OP);
const SNOWPILE = P_(new THREE.Group()); { for (let k = 0; k < 6; k++) { const s = sphere(1.4 + k * .2, mat(0xf2f6fc, { roughness: .85 }), SNOWPILE, Math.cos(k) * 2, .2, Math.sin(k * 1.7) * 2, 10, 6); s.scale.y = .4; } }
// trozo de cuerda de primer plano pasando a mi lado (a lo largo de x, a la altura y, avanzando en z)
const nah = (x, y, z, ry = 0) => { NAH.visible = true; NAH.position.set(x, y, z); NAH.rotation.set(0, ry, 0); return NAH; };
// mi bufanda y mi gorro de invierno
const MUETZE = P_(new THREE.Group()); { const m = mat(0xd8323a, { roughness: 1 }); const c = sphere(1.0, m, MUETZE, 0, 0, 0, 14, 8); c.scale.y = .7; sphere(.35, mat(0xffffff, { roughness: 1 }), MUETZE, 0, .75, 0, 8, 6); cyl(1.02, 1.02, .4, mat(0xffffff, { roughness: 1 }), 16, MUETZE, 0, -.35, 0); }
const winterIch = c => { attach(MUETZE, c.head, [0, 1.45, -.05], [0, 0, 0], 1); };
// pose de escalada (de cara a la torre)
const KLETTER = (T) => ({ aLx: 2.6 + Math.sin(T * 3) * .2, aRx: 2.2 - Math.sin(T * 3) * .2, aLz: .3, aRz: .3, aLe: .4, aRe: .4, lLx: .9 + Math.sin(T * 3) * .3, lLk: 1.2, lRx: .2, lRk: .4, lean: .15 });
// la torre vista de cerca: muro de gente desde la fila de y0
const TA = Math.PI;   // cara de la torre que mira al pueblo
function turmNah(L, y0 = 40, o = {}) { welt(L, TX - 200, 0, { grass: false, snow: o.snow ?? false, dusk: !o.snow, rings: o.rings ?? false }); TURM.visible = true; setRope(o.phi ?? (L.T * .7)); TURM.userData.anim(o.phi ?? (L.T * .7), o.lean ?? .4);
  return wand(L, o.list || DX, TA + (o.da ?? 0), y0, o.rows ?? 4, o.cols ?? 5, o); }
const surf = (y, da = 0, out = 1.6) => turmPt(TX, y, TA + da / tR(y), -1, out);

// 88 «Danach kamen keine Menschen mehr.»: la pradera vacía al atardecer; yo, un puntito, camino hacia la torre
shot(100.675, 'W', null, L => { welt(L, 860, -60, { dusk: true }); const c = walkTo(ich, L, 850 + L.lt * 3, -60, PI / 2); hornHang(c, 0); attach(BUNDLE, c.aR.hand, [0, -.3, 0], [0, 0, -1.1], .8); actuar(c, 0, [[0, { ...walkP(L.T, 0), aRx: 2.4, aRz: -.4, aRe: 1.6 }]], { T: L.T }); cara(c, L.T, { expr: 'tired' });
  cm([826, 14, -20, 852, 3, -60, 40], [830, 13, -24, 854, 3, -60, 40], L.k); sh(V(852, 0, -60), 30); }, [[0, 'wind', .6], [.4, 'steps_grass', .4]]);
// 89 «Keine Rufer.»: un pedestal abandonado; la trompetilla de alguien tirada en la hierba
shot(102.411, 'S', null, L => { welt(L, 870, -50, { dusk: true }); show(PED2[2], 870, 0, -50, .3); show(HORN_LOST, 872.4, .7, -47, 1.2); HORN_LOST.rotation.z = 1.4;
  cm([877, 3.4, -38, 871, 1.6, -49, 40], [876, 3.2, -40, 871, 1.6, -49, 38], L.k); sh(V(871, 0, -48), 16); }, [[0, 'wind_soft', .6], [.2, 'crow', .3]]);
// 90 «Keine Welle.»: la cuerda pasa sobre la pradera vacía, sin nadie que grite
shot(103.233, 'Z', null, L => { welt(L, 880, -70, { dusk: true }); cuerda(L, .5, -70, 90); cm([890, 2.4, -46, 880, 3, -110, 42], [889, 2.6, -48, 880, 3, -110, 42], L.k); sh(V(880, 0, -70), 30); }, [[.3, 'rope_swish', .6]]);
// 91 «Ich musste das Seil mit meinen eigenen Augen beobachten.»: mis ojos entornados, vigilando la cuerda que se acerca
shot(103.978, 'C', 'punch', L => { welt(L, 900, -60, { dusk: true }); const c = put(ich, 900, 0, -60, PI); hornHang(c, 0); actuar(c, 0, [[0, { lean: .1, headX: .05, aLx: .4, aRx: .4 }]], { T: L.T }); cara(c, L.T, { eyes: L.lt > .5 ? 'squint' : 'normal', mouth: 'flat', noBlink: true });
  onFace(c, 4.2, -.3, 0, 34, L.k, 3.6); sh(V(900, 0, -60), 12); }, [[0, 'heartbeat', .5]]);
// 92 «Augen beobachten.»: salto yo solo, en medio de la nada
shot(105.378, 'W', null, L => { welt(L, 905, -60, { dusk: true }); const tp = .5, zc = -60; cuerda(L, tp, zc, VV); springer(ich, 905, -60, .3, L, tp, zc, VV, 0, { f: { expr: 'determined' } }); hornHang(ich, 0);
  orbit(V(905, 3.6, -60), lerp(30, 26, L.k), .4, .1, 44); sh(V(905, 0, -60), 30); }, [[.4, 'rope_swish', .6], [.5, 'jump', .5]]);
// 93 «Das hat mich den ganzen Winter gekostet.»: tormenta de nieve; camino encogido con gorro, hundiéndome en la nieve
shot(106.40, 'F', null, L => { welt(L, WX, 20, { snow: true, grass: false }); const c = walkTo(ich, L, WX - 4 + L.lt * 2.4, 20, PI / 2 + .2); c.root.position.y = -.6; winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, { ...walkP(L.T, 0), ...GEST.hug_self, lean: .3 }]], { T: L.T }); cara(c, L.T, { eyes: 'squint', mouth: 'wavy' }); c.root.position.x += Math.sin(L.T * 30) * .04;
  show(SNOWPILE, WX + 6, 0, 24); orbit(V(WX - 3, 3.4, 20), lerp(16, 14, L.k), 1.1, .08, 44); sh(V(WX, 0, 20), 20); }, [[0, 'blizzard', .8], [.3, 'snow_steps', .5]]);
// 94 «Winter gekostet.»: la cuerda gigante pasa por encima de mí, alta, entre los copos
shot(107.18, 'S', null, L => { welt(L, WX, 20, { snow: true, grass: false }); cuerda(L, .45, 20, 70); const c = put(ich, WX, -.5, 20, PI / 2); winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, { headX: -.6, lean: -.1, ...GEST.hug_self, headY: 0 }]], { T: L.T }); cara(c, L.T, { eyes: 'up', mouth: 'o', noBlink: true });
  cm([WX - 3, 1.2, 31, WX + 1, 9, 14, 52], [WX - 2.8, 1.3, 30, WX + 1, 10, 14, 52], L.k); sh(V(WX, 0, 20), 20); }, [[0, 'rope_whoosh_high', .8], [.4, 'blizzard', .5]]);
// 95 «Von Nahem ist das Seil gar kein Seil.»: la cuerda pasa despacio junto a mi cara; me acerco a mirarla
shot(108.211, 'W', null, L => { welt(L, WX + 40, 20, { snow: true, grass: false }); const c = put(ich, WX + 40, 0, 24, PI); winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, { lean: .2, headX: .15, aRx: 1.1, aRe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'confused' });
  nah(WX + 40, 5.2, 20 - L.lt * .6); cm([WX + 50, 8, 40, WX + 40, 4.6, 22, 42], [WX + 49, 7.6, 38, WX + 40, 4.6, 22, 40], L.k); sh(V(WX + 40, 0, 22), 18); }, [[0, 'rope_creak', .6], [.3, 'cloth', .4]]);
// 96 «kein Seil.»: los nudos de cerca
shot(109.711, 'S', null, L => { welt(L, WX + 40, 20, { snow: true, grass: false }); nah(WX + 40, 5.2, 20); const k = WX + 40 - 35 + 3 + 3 * 4.9 + 2.2; cm([k + 3, 10, 28, k, 5.2, 20, 38], [k + 2.4, 9.6, 27, k, 5.2, 20, 36], L.k); sh(V(k, 0, 20), 14); }, [[0, 'rope_creak', .6]]);
// 97-100 «Es sind Ärmel, Gürtel, Schals und Schnürsenkel.»: cada prenda en primer plano
const prenda = (L, x, dy = .8, side = 1) => { welt(L, WX + 40, 20, { snow: true, grass: false }); nah(WX + 40, 5.2, 20); const X = WX + 40 + x; cm([X + 1.6 * side, 5.2 + dy + 3.4, 30.5, X, 5.2 + dy, 21, 36], [X + 1.2 * side, 5.2 + dy + 3.2, 29.5, X, 5.2 + dy, 21, 34], L.k); sh(V(X, 0, 20), 12); };
shot(110.051, 'C', null, L => { prenda(L, -7.5, 1.4); const X = WX + 40 - 7.5; cm([X + 3, 13, 34, X, 6.4, 21, 32], [X + 2.6, 12.6, 33, X, 6.4, 21, 30], L.k); }, [[0, 'cloth', .6]]);
shot(111.116, 'C', null, L => prenda(L, -2.6, 0, -1), [[0, 'buckle', .6]]);
shot(111.731, 'C', null, L => prenda(L, 2.3, -1.6), [[0, 'cloth', .5]]);
shot(112.171, 'C', null, L => prenda(L, 7.2, 2.4), [[0, 'lace', .5]]);
// 101 «Alles zusammengeknotet.»: la cámara se aleja: kilómetros de ropa anudada
shot(112.942, 'W', null, L => { welt(L, WX + 40, 20, { snow: true, grass: false }); nah(WX + 40, 5.2, 20); const c = put(ich, WX + 40, 0, 24.5, PI); winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, { aLx: .3, headY: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  cm([WX + 44, 7, 32, WX + 40, 5, 20, 40], [WX + 50, 12, 46, WX + 40, 5, 20, 46], L.k); sh(V(WX + 40, 0, 22), 26); }, [[0, 'whoosh_soft', .5]]);
// 102 «Auf manchen Sachen sind noch Namen»: una etiqueta bordada: «OMA ROSI»
shot(114.256, 'Z', null, L => { welt(L, WX + 40, 20, { snow: true, grass: false }); nah(WX + 40, 5.2, 20); const X = WX + 40 - 35 + 3 + 6 * 4.9 - 1; cm([X + .6, 6.8, 34, X, 5.3, 22, 26], [X + .5, 6.6, 33, X, 5.3, 22, 24], L.k); sh(V(X, 0, 20), 10); }, [[0, 'pling_low', .4]]);
// 103 «Namen eingestickt.»: toco la etiqueta «PAUL» con el dedo, triste
shot(115.336, 'C', null, L => { welt(L, WX + 40, 20, { snow: true, grass: false }); nah(WX + 40, 5.2, 20); const X = WX + 40 - 35 + 3 - 1; const c = put(ich, X + 1, 0, 24, PI - .2); winterIch(c); actuar(c, 0, [[0, { aRx: 1.5, aRz: -.1, aRe: .3, lean: .15, headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  cm([X + 7, 8.4, 36, X + .6, 5.4, 22, 40], [X + 6.4, 8.2, 35, X + .6, 5.4, 22, 38], L.k); sh(V(X, 0, 22), 14); }, [[.2, 'cloth', .4], [.5, 'chime_sad', .4]]);
// 104 «Wer macht ein Seil aus Kleidern?»: miro hacia arriba: la cuerda sube hasta perderse en el cielo, hacia la torre
shot(116.459, 'W', null, L => { welt(L, 1240, 0, { snow: true, grass: false }); setRope(PI * .55 + L.lt * .3); const c = put(ich, 1240, 0, 6, PI / 2 + .4); winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, { headX: -.7, lean: -.15 }]], { T: L.T }); cara(c, L.T, { eyes: 'up', mouth: 'o', noBlink: true });
  cm([1226, 2, 22, 1340, 140, -40, 52], [1228, 2.2, 20, 1340, 150, -40, 52], L.k); sh(V(1240, 0, 6), 20); }, [[0, 'wind_high', .6]]);
// 105 «Das Ding, das es schwingt,» (zoom lento): la silueta entre los nubarrones
shot(118.516, 'W', 'slow', L => { welt(L, 1300, 0, { snow: true, grass: false, rings: true }); wolken(); setRope(1 + L.lt * .7); cm([1250, 4, 140, TX, 260, 0, 46], [1262, 5, 120, TX, 300, 0, 38], L.k); scene.fog.density = .0006; sh(V(1300, 0, 0), 60); }, [[0, 'thunder', .6], [.8, 'crank', .5]]);
// 106 «füllt den halben Himmel.»: contrapicado: la torre llena medio cielo; yo diminuto abajo
shot(119.996, 'C', null, L => { welt(L, 1450, 0, { snow: true, grass: false }); wolken(); setRope(2 + L.lt * .7); const c = put(ich, 1452, 0, 40, -1.2); winterIch(c); cara(c, L.T, { eyes: 'up', mouth: 'o', noBlink: true }); actuar(c, 0, [[0, { headX: -.6 }]], { T: L.T });
  cm([1440, 1.6, 58, 1560, 260, -20, 60], [1442, 1.8, 56, 1560, 270, -20, 60], L.k); scene.fog.density = .0006; sh(V(1452, 0, 40), 20); }, [[0, 'rumble', .7]]);
// 107 «Von Weitem hat es tausend Arme.»: de lejos, la torre se eriza de brazos; «1000»
shot(121.381, 'W', null, L => { welt(L, 1300, 0, { snow: true, grass: false, rings: true }); wolken(); setRope(1.6 + L.lt * .7); cm([1180, 30, 160, TX, 220, 0, 34], [1186, 32, 150, TX, 220, 0, 32], L.k); scene.fog.density = .0005; bigNum('1000 ARME', clamp((L.lt - .2) / .2), 'gold', .15, 1); sh(V(TX, 0, 0), 80); }, [[.2, 'pling', .4], [.4, 'crowd_moan', .5]]);
// 108 «Von Nahem ist»: la cámara vuela hacia la pared de la torre
shot(123.276, 'Z', null, L => { const W_ = turmNah(L, 64, { rows: 4, cols: 5 }); const p = surf(76); cm([p.x - 90, p.y + 20, p.z + 40, p.x, p.y, p.z, 40], [p.x - 26, p.y + 4, p.z + 6, p.x, p.y, p.z, 40], L.k, easeIn); sh(p, 30); }, [[0, 'whoosh_up', .7]]);
// 109 «jeder Arm ein Mensch.»: primer plano: cada «brazo» es una persona agarrada a las muñecas de los de al lado
shot(124.576, 'C', null, L => { const W_ = turmNah(L, 64, { rows: 4, cols: 5 }); const p = surf(75); cm([p.x - 16, p.y + 1, p.z + 2, p.x, p.y, p.z, 40], [p.x - 14, p.y + 1, p.z + 1, p.x, p.y, p.z, 40], L.k); sh(p, 20); }, [[0, 'crowd_moan', .5]]);
// 110 «Es ist kein Riese.»: yo, con la boca abierta, en la nieve
shot(125.758, 'S', null, L => { welt(L, 1440, 40, { snow: true, grass: false }); const c = put(ich, 1440, 0, 40, -1.3); winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, GEST.recoil]], { T: L.T }); cara(c, L.T, { eyes: 'terror', mouth: 'grimace', noBlink: true });
  onFace(c, 6, -.2, 1.5, 40, L.k, 5); sh(V(1440, 0, 40), 14); }, [[0, 'gasp', .6]]);
// 111 «Es ist ein Turm aus Menschen.»: la torre entera desde el pie; un mar de cuerpos hasta las nubes
shot(127.064, 'W', null, L => { welt(L, 1440, 0, { snow: true, grass: false, rings: true }); wolken(); setRope(2.4 + L.lt * .7); const c = put(ich, 1440, 0, 20, -PI / 2); winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, { headX: -.5 }]], { T: L.T }); cara(c, L.T, { eyes: 'up', mouth: 'o' });
  cm([1410, 6, 34, TX, 200, 0, 58], [1406, 4, 30, TX, 230, 0, 60], L.k); scene.fog.density = .0005; sh(V(1440, 0, 20), 20); }, [[0, 'braam', .5], [.3, 'crowd_moan', .5]]);
// 112 «Einer steht auf den Schultern des anderen,»: contrapicado del muro: los pies de cada uno en los hombros del de abajo
shot(128.935, 'Z', null, L => { const W_ = turmNah(L, 30, { rows: 5, cols: 3, dy: 5.4 }); const p = surf(36); cm([p.x - 10, p.y - 6, p.z, p.x, p.y + 10, p.z, 46], [p.x - 9, p.y - 5, p.z, p.x, p.y + 12, p.z, 46], L.k); sh(p, 20); }, [[0, 'creak', .5]]);
// 113 «und alle halten sich an den Handgelenken fest.»: las manos agarrando muñecas, en primer plano
shot(130.775, 'C', null, L => { const W_ = turmNah(L, 40, { rows: 3, cols: 4 }); const h = wpos(W_[5].aR.hand); cm([h.x - 11, h.y + 1.4, h.z + 2.4, h.x, h.y, h.z, 38], [h.x - 10, h.y + 1.3, h.z + 2.2, h.x, h.y, h.z, 36], L.k); sh(h, 12); }, [[0, 'grip', .6]]);
// 114 «Alle, die jemals vorausgegangen sind.»: barrido lento por sus caras tristes (entre ellas, el del cordón)
shot(132.868, 'W', null, L => { const W_ = turmNah(L, 50, { rows: 3, cols: 6, list: [DX[0], DX[1], DX[3], DX[4], DX[5], DX[6], DX[7], DX[8], DX[9], DX[10], DX[11], DX[12], DX[13], DX[14], DX[15], DX[16], DX[17], DX[18]], face: n => ({ expr: 'sad', eyes: n % 2 ? 'down' : 'worried' }) });
  const a = surf(56, -8 + L.k * 16); cm([a.x - 18, a.y + 1, a.z + 2, a.x, a.y, a.z, 42], [a.x - 18, a.y + 1, a.z + 2, a.x, a.y, a.z, 42], 0); sh(a, 24); }, [[0, 'chime_sad', .5]]);
// 115-116 «Sie lehnen sich nach links. Dann nach rechts.»: la torre entera se inclina a un lado y al otro
shot(134.964, 'S', null, L => { welt(L, 1300, 0, { snow: true, grass: false, rings: true }); wolken(); const phi = PI / 2 + L.lt * 1.2; setRope(phi); TURM.userData.anim(phi, 3); scene.fog.density = .00035; cm([1200, 40, 200, TX, 220, 0, 40], [1204, 40, 196, TX, 220, 0, 40], L.k); sh(V(TX, 0, 0), 80); }, [[0, 'creak_big', .7]]);
shot(136.202, 'S', null, L => { welt(L, 1300, 0, { snow: true, grass: false, rings: true }); wolken(); const phi = 3 * PI / 2 + L.lt * 1.2; setRope(phi); TURM.userData.anim(phi, 3); scene.fog.density = .00035; cm([1204, 40, 196, TX, 220, 0, 40], [1208, 40, 192, TX, 220, 0, 40], L.k); sh(V(TX, 0, 0), 80); }, [[0, 'creak_big', .7]]);
// 117 «Und so drehen sie eine Kurbel,»: la manivela gira, la cuerda sale disparada
shot(137.202, 'C', 'punch', L => { welt(L, XT - 100, 0, { grass: false, snow: true, rings: false }); wolken(); setRope(L.lt * 2.4); const h = wpos(TURM.userData.crank); cm([h.x - 60, h.y + 10, 50, h.x, h.y - 6, 0, 44], [h.x - 56, h.y + 8, 46, h.x, h.y - 6, 0, 44], L.k); sh(h, 60); }, [[0, 'crank', .9], [.2, 'rope_swish', .6]]);
// 118 «so groß wie ein Haus.»: yo, diminuto, en la nieve bajo la rueda de la manivela
shot(138.562, 'W', null, L => { welt(L, XT - 30, 30, { grass: false, snow: true, rings: false }); wolken(); setRope(.5 + L.lt * 1.4); const h = wpos(TURM.userData.crank);
  cm([h.x - 36, h.y + 14, 52, h.x + 20, h.y - 6, 0, 46], [h.x - 33, h.y + 13, 48, h.x + 20, h.y - 6, 0, 46], L.k); sh(h, 60); }, [[0, 'crank', .6], [.3, 'rumble', .5]]);
// 119 «Drei Reihen weiter oben»: trepo por el muro de gente, de hombro en hombro; miro hacia arriba
shot(140.16, 'Z', null, L => { const W_ = turmNah(L, 40, { rows: 5, cols: 4 }); const p = surf(41.6, 2, 3.4); const c = put(ich, p.x, p.y, p.z, -PI / 2 + .4); c.blob.visible = false; winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, KLETTER(L.T)]], { T: L.T }); cara(c, L.T, { eyes: 'up', mouth: 'flat' }); c.root.rotation.y = PI / 2 * 0 + Math.PI * 1.5 + .6;
  cm([p.x - 14, p.y + 2, p.z + 4, p.x, p.y + 6, p.z, 44], [p.x - 13, p.y + 3, p.z + 3, p.x, p.y + 7, p.z, 44], L.k); badge('gold', '3 REIHEN', W / 2, H * .14, clamp((L.lt - .2) / .2), 1, .9); sh(p, 20); }, [[0, 'climb', .6], [.5, 'grunt', .4]]);
// Lotte en el muro (fila 3 desde y0 = 40: y ≈ 56,8), mirando hacia fuera
function lotteWand(L, o = {}) { const list = []; let d = 0; for (let i = 0; i < 20; i++) list.push(i === 7 ? null : i === 12 ? lotte : DX[d++]); const W_ = turmNah(L, 40, { rows: 4, cols: 5, list, face: n => n === 13 ? (o.lf || { expr: 'smile' }) : { expr: 'tired' } }); return W_; }
// 120 «baute jemand eine kleine Drehung ein.»: alguien en el muro mueve la cadera, un giro pequeñito
shot(141.16, 'S', null, L => { const W_ = lotteWand(L, { lf: { eyes: 'closed', mouth: 'smile', noBlink: true } }); lotte.root.rotation.y += Math.sin(L.T * 6) * .3; applyPose(lotte, { aLz: 1.45, aRz: 1.45, aLe: .1, aRe: .1, twist: Math.sin(L.T * 6) * .5, headZ: Math.sin(L.T * 6) * .2 });
  const p = hp(lotte); cm([p.x - 20, p.y - 1, p.z, p.x, p.y - 2, p.z, 40], [p.x - 18, p.y - 1, p.z, p.x, p.y - 2, p.z, 40], L.k); sh(p, 20); }, [[.2, 'sparkle', .4]]);
// 121 «Lotte.»: su cara, con la sonrisa de siempre
shot(143.08, 'C', 'punch', L => { lotteWand(L, { lf: { expr: 'happy', mouth: 'smile' } }); const p = hp(lotte); cm([p.x - 6.4, p.y + .4, p.z, p.x, p.y - .2, p.z, 38], [p.x - 5.8, p.y + .4, p.z, p.x, p.y - .2, p.z, 36], L.k); sh(p, 12); }, [[0, 'chime', .6], [0, 'heartbeat', .4]]);
// Lotte y yo: yo agarrado al muro justo debajo y a su lado
function nosotros(L, o = {}) { const W_ = lotteWand(L, o); const p = hp(lotte); const q = surf(45.6, 2.05, 2.6); const c = put(ich, q.x, q.y, q.z, -PI / 2 + .25); c.blob.visible = false; winterIch(c); actuar(c, 0, [[0, { aLz: 1.45, aRz: 1.2, aRx: .4, aLe: .1, aRe: .3, headX: -.45, headY: -.15, ...(o.ip || {}) }]], { T: L.T }); return { W_, p, c }; }
// 122 «„Du bist früh dran“, hat sie gesagt.»
shot(143.565, 'C', null, L => { const { p, c } = nosotros(L); talk(lotte, L.T, 143.5, 144.4, 'warm'); cara(c, L.T, { expr: 'sad', eyes: 'up' }); cm([p.x - 7, p.y, p.z - 1.6, p.x, p.y - .4, p.z, 40], [p.x - 6.4, p.y, p.z - 1.4, p.x, p.y - .4, p.z, 38], L.k); sh(p, 12); }, [[0, 'wind_high', .4]]);
// 123 «Losgelassen hat sie nicht.»: sus manos siguen bien agarradas a las muñecas de los de al lado
shot(145.25, 'S', null, L => { lotteWand(L); const h = wpos(lotte.aL.hand); cm([h.x - 10, h.y + 1.2, h.z - 2, h.x, h.y, h.z, 38], [h.x - 9.4, h.y + 1.1, h.z - 1.8, h.x, h.y, h.z, 36], L.k); sh(h, 10); }, [[0, 'grip', .5]]);
// 124 «Da oben kann das keiner.»: el muro entero, todos agarrados, nadie se suelta
shot(146.479, 'W', null, L => { const W_ = lotteWand(L); const p = surf(52); cm([p.x - 40, p.y + 4, p.z - 6, p.x, p.y, p.z, 44], [p.x - 46, p.y + 6, p.z - 8, p.x, p.y, p.z, 46], L.k); sh(p, 30); }, [[0, 'crowd_moan', .5]]);
// 125 «„Ich hab dich gewarnt. Ich musste niesen.“»: yo, agarrado a su lado, con los ojos húmedos
shot(147.665, 'C', null, L => { const { p, c } = nosotros(L, { lf: { expr: 'sad' } }); talk(c, L.T, 147.6, 149.5, 'sad'); tears(c, L.T); const h = hp(c); cm([h.x - 6.4, h.y + .2, h.z - .6, h.x, h.y - .3, h.z, 38], [h.x - 5.8, h.y + .2, h.z - .5, h.x, h.y - .3, h.z, 36], L.k); sh(h, 12); }, [[0, 'sniff', .5]]);
// 126 «„Ich weiß.»
shot(149.653, 'C', null, L => { const { p, c } = nosotros(L); talk(lotte, L.T, 149.6, 150.1, 'warm'); cm([p.x - 6.4, p.y + .2, p.z - 1, p.x, p.y - .3, p.z, 38], [p.x - 6, p.y + .2, p.z - .9, p.x, p.y - .3, p.z, 36], L.k); sh(p, 12); }, []);
// 127 «Ich hab’s gehört.“»: los dos en el mismo plano
shot(150.331, 'S', null, L => { const { p, c } = nosotros(L); talk(lotte, L.T, 150.3, 150.95, 'warm'); cara(c, L.T, { expr: 'sad', eyes: 'up' }); const m = p.clone().lerp(hp(c), .5); cm([m.x - 13, m.y + .4, m.z - .5, m.x, m.y, m.z, 40], [m.x - 12, m.y + .4, m.z - .4, m.x, m.y, m.z, 40], L.k); sh(m, 14); }, [[0, 'wind_high', .3]]);
// 128 «Sie hat fast gelacht.»: casi se ríe
shot(151.198, 'Z', null, L => { const { p, c } = nosotros(L, { lf: { eyes: 'happy', mouth: Math.sin(L.T * 14) > 0 ? 'open_smile' : 'smile', noBlink: true } }); cm([p.x - 5.6, p.y + .2, p.z - .6, p.x, p.y - .3, p.z, 36], [p.x - 5.2, p.y + .2, p.z - .5, p.x, p.y - .3, p.z, 34], L.k); sh(p, 12); }, [[0, 'giggle', .5]]);

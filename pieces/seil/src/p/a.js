// ---------- a: gancho, el mundo, la boda, la sopa, los bebés, la ola y los Rufer (0 – 50,02 s) ----------
// Heimatdorf D1 en (0, 0): caminos en x = 0 (N-S) y z = 0 (E-O); las parcelas en x = ±17, ±34. La cuerda avanza hacia +z (hacia la cámara si yaw = 0).
// Pedestales de Rufer: D1.peds = (8.5, 8.5), (-8.5, -8.5), (25.5, -8.5), (-25.5, 8.5).
const VV = 120;   // velocidad de la cuerda en los planos normales (en el mundo es mucho más rápida: se «ve» a cámara lenta)
// nubarrones alrededor de la punta de la torre
const WOLKEN = P_(new THREE.Group()); { const r = RNG(19); const ms = [mat(0x5a6070, { roughness: 1 }), mat(0x4a5060, { roughness: 1 }), mat(0x6a7080, { roughness: 1 })]; for (let k = 0; k < 40; k++) { const a = r() * 6.28, d = 40 + r() * 110; const s = sphere(22 + r() * 26, ms[k % 3], WOLKEN, Math.cos(a) * d, (r() - .3) * 50, Math.sin(a) * d, 12, 8); s.castShadow = false; s.scale.y = .55; } }
const wolken = () => show(WOLKEN, TX - 30, 430, 0);
// parcela suelta para los primeros planos (mesa, cama, valla): en (PX, 0, PZ)
const PX = -140, PZ = 70; NOGRASS.push([PX - 8, PZ - 8, PX + 8, PZ + 24]); const PARC = P_(parcela(null, 0, 0, 7)); const ZAUN = P_(zaun(null, -6, 0, 6, 0));
// escoba y tablón
const BESEN = P_(new THREE.Group()); { cyl(.12, .12, 5, mat(0x9a6a3e), 6, BESEN, 0, 2.5, 0); const b = box(1.6, .9, .5, mat(0xd8b060, { roughness: 1 }), .1, BESEN, 0, .2, 0); }
const BRETT = P_(new THREE.Group()); box(4, .25, .7, mat(0xb8885a, { roughness: .8 }), .05, BRETT, 0, 0, 0);
const HAMMER = P_(new THREE.Group()); { cyl(.1, .1, 1.6, mat(0x9a6a3e), 6, HAMMER, 0, .8, 0); box(.7, .35, .35, mat(0x4a4a52, { metalness: .7 }), .05, HAMMER, 0, 1.6, 0); }
// vecinos que saltan: spots [[x, z, ry], …] con extras desde DX[from]
function vecinos(L, spots, tp, zc, v = VV, from = 0, o = {}) { spots.forEach(([x, z, ry], i) => { const c = DX[(from + i) % DX.length]; if (c.root.visible) return; springer(c, x, z, ry ?? 0, L, tp, zc, v, i + from, o); }); }
// fila de gente que levanta los brazos cuando le llega la ola de gritos (frente en zw, avanza hacia +z)
function ola(L, list, x0, z0, dz, zw, w = 14) { list.forEach((c, i) => { const z = z0 + i * dz, x = x0 + Math.sin(i * 2.3) * 3; put(c, x, 0, z, 0); const k = clamp(1 - Math.abs(z - zw) / w); actuar(c, 0, [[0, { aLx: 2.8 * k + .1, aRx: 2.8 * k + .1, aLz: .3 + .3 * k, aRz: .3 + .3 * k, aLe: .3, aRe: .3, headX: -.25 * k, lean: -.08 * k }]], { T: L.T + i * .2 }); cara(c, L.T + i, k > .3 ? { expr: 'shout', mouth: 'scream', eyes: 'squint' } : { expr: 'neutral' }); }); }
const SPOTS1 = [[-6, 4, .2], [6, 2, -.2], [-3, -6, .1], [4, -9, -.1], [-9, -14, .3], [8, -16, -.3], [-12, 12, .4], [11, 14, -.3], [0, -22, 0], [-15, -26, .2], [14, -28, -.2], [-4, -34, .1]];

// 1 «In dieser Stadt springen»: todo el pueblo salta a la vez; la cuerda de ropa llega barriendo el suelo hacia la cámara y pasa bajo sus pies (golpe de zoom en el 0)
shot(0, 'W', null, L => { welt(L, 0, 10); const tp = .5, zc = 6; cuerda(L, tp, zc, VV);
  springer(ich, 0, 6, 0, L, tp, zc, VV, 0, { f: { expr: 'happy', mouth: 'open_smile' } }); vecinos(L, SPOTS1, tp, zc, VV, 0);
  orbit(V(0, 4.6, 6), lerp(19, 15, easeOut(L.k)), .12, .06, 46); sh(V(0, 0, 2), 34); },
  [[0, 'zoom_fast', .6], [.3, 'rope_swish', .9], [.5, 'jump_crowd', .7], [.78, 'land_crowd', .5]]);
// 2 «springen wir alle»: desde arriba: la cuerda cruza el pueblo y todos saltan en ola según les llega
shot(.875, 'S', null, L => { welt(L, 0, 0); const tp = .45, zc = 0; cuerda(L, tp, zc, 90);
  vecinos(L, [...SPOTS1, [-20, 20, 0], [20, 22, 0], [-2, 30, 0], [24, 6, 0], [-24, -4, 0], [3, 16, 0], [-8, 26, 0], [9, -40, 0], [-16, -40, 0], [17, 34, 0], [-28, 30, 0], [28, -20, 0]], tp, zc, 90, 0, { J: 3 });
  orb(L.k, V(0, 0, -4), null, [70, .5, .72, 46], [62, .62, .78, 46]); sh(V(0, 0, 0), 60); }, [[.2, 'rope_swish', .7], [.4, 'jump_crowd', .7]]);
// 3 «neun Sekunden»: yo en el pedestal con la trompetilla; contador «9 SEKUNDEN»
shot(1.675, 'Z', 'punch', L => { welt(L, 8, 8); const p = D1.peds[0]; put(ich, p[0], 2.3, p[1], .3); rufen(ich, L, 0, clamp(L.lt / .2)); ich.blob.visible = false; cuerda(L, 2.6, 0, VV);
  vecinos(L, [[p[0] - 6, p[1] - 8, .3], [p[0] + 5, p[1] - 10, -.2]], 2.6, 0, VV, 12);
  onBody(ich, 13, .95, .1, 42, L.k, 11); bigNum('9 SEKUNDEN', clamp((L.lt - .15) / .2), 'gold', .19, 1.05); sh(V(p[0], 0, p[1]), 24); }, [[0, 'horn_blow', .6], [.15, 'pling', .4]]);
// 4 «Alle.»: otro pueblo entero en el aire a la vez, visto de lado entre la hierba alta
shot(2.70, 'C', null, L => { welt(L, -220, 152); const tp = .14, zc = 140; cuerda(L, tp, zc, 60);
  vecinos(L, [[-232, 140, .4], [-224, 141, .2], [-216, 139, 0], [-208, 141, -.2], [-200, 140, -.4], [-228, 132, .3], [-212, 131, -.1], [-236, 148, .5], [-204, 149, -.5], [-220, 150, 0]], tp, zc, 60, 14, { J: 3.6 });
  orbit(V(-218, 3.5, 141), lerp(24, 22, L.k), .05, .02, 44); sh(V(-218, 0, 141), 30); }, [[0, 'whoosh_down', .5], [.05, 'crowd_hey', .6]]);
// 5 «Unser ganzes»: una abuela salta con su chal y su bastón (toda la vida)
shot(2.962, 'W', null, L => { welt(L, -6, 22); const tp = .4, zc = 20; cuerda(L, tp, zc, VV); const s = springer(oma, -6, 20, .2, L, tp, zc, VV, 3, { J: 2.6, pose: { aRx: .4, aRe: .6 }, f: { expr: 'determined', mouth: 'grimace' } });
  vecinos(L, [[-12, 14, .3], [0, 13, -.2]], tp, zc, VV, 20); onBody(oma, 12, .15, .1, 42, L.k, 10.5); sh(V(-6, 0, 20), 22); }, [[.35, 'rope_swish', .6], [.4, 'jump', .5], [.7, 'land', .4]]);
// 6 «Leben lang.»: una madre salta con su bebé en brazos
shot(3.877, 'F', null, L => { welt(L, 5, 24); const tp = .3, zc = 22; cuerda(L, tp, zc, VV); springer(mutter, 5, 22, -.25, L, tp, zc, VV, 4, { pose: { aLx: 1.1, aRx: 1.1, aLe: 1.3, aRe: 1.3, aLz: -.35, aRz: -.35 }, f: { expr: 'smile' } });
  attach(BABYS[0], mutter.spine, [0, 1.05, 1.35], [0, 0, 0], .8); onBody(mutter, 11, -.1, .08, 42, L.k, 9.6); sh(V(5, 0, 22), 22); }, [[0, 'flash', .4], [.25, 'jump', .5], [.5, 'baby_coo', .5]]);
// 7 «Ein Seil fegt über die»: a ras de suelo fuera del pueblo: la cuerda viene barriendo la pradera hacia la cámara
shot(4.58, 'S', null, L => { welt(L, 70, 10, { day: false }); cuerda(L, .95, 18, 260);
  cm([70, 2.2, 34, 70, 3.2, -40, 44], [70, 2.8, 30, 70, 3, -40, 46], L.k); sh(V(70, 0, 0), 40); }, [[.2, 'rope_far', .8], [.85, 'rope_swish', 1]]);
// 8 «ganze Welt.»: desde muy alto: la cuerda es una línea que barre la pradera con los pueblos
shot(5.78, 'Z', null, L => { welt(L, 0, 0, { grass: false }); cuerda(L, .5, -60, 200);
  cm([60, 260, 360, 0, 0, -60, 46], [40, 300, 400, 0, 0, -80, 46], L.k); sh(V(0, 0, 0), 120); }, [[.1, 'wind', .5], [.3, 'rope_swish', .5]]);
// 9 «Und etwas, so hoch wie die Gewitterwolken,» (zoom lento): la torre en el horizonte, entre nubarrones; la cámara sube hacia la punta
shot(6.44, 'W', 'slow', L => { welt(L, 300, 0, { dusk: true, grass: false }); wolken(); setRope(-.5 + L.lt * .35);
  cm([340, 6, 40, TX, 150, 0, 40], [360, 10, 30, TX, 330, 0, 36], L.k); scene.fog.density = .00028; sh(V(400, 0, 0), 80); }, [[0, 'thunder', .5], [.6, 'wind', .5]]);
// 10 «schwingt es.»: la manivela gigante girando con la cuerda
shot(8.68, 'C', 'punch', L => { welt(L, XT - 100, 0, { grass: false, dusk: true, rings: false }); wolken(); setRope(1.2 + L.lt * 2.2); const h = wpos(TURM.userData.crank);
  cm([h.x - 70, h.y - 20, 70, h.x, h.y - 4, 0, 42], [h.x - 64, h.y - 16, 62, h.x, h.y - 4, 0, 42], L.k); sh(h, 60); }, [[0, 'crank', .8], [.4, 'creak', .6]]);
// 11 «Wer es verpasst,»: uno se agacha a atarse el cordón… la cuerda le llega por detrás
shot(9.60, 'W', null, L => { welt(L, 0, -30); const c = put(DX[3], 0, 0, -30, .5); const u = clamp((L.lt - .55) / .2);
  actuar(c, 0, [[0, { crouch: .55, lean: .55, headX: .4, aLx: 1.2, aRx: 1.2, aLe: .5, aRe: .5, lLx: .9, lLk: 1.4, lRx: .2, lRk: .6 }], [.6, { crouch: .2, lean: -.2, headX: -.3, aLx: 1, aRx: 1, aLz: .8, aRz: .8, aLe: 1.4, aRe: 1.4 }, { dur: .15 }]], { T: L.T });
  cara(c, L.T, u > .2 ? { eyes: 'terror', mouth: 'scream', noBlink: true } : { expr: 'neutral', eyes: 'down' }); cuerda(L, .95, -30, VV);
  vecinos(L, [[-7, -36, .3], [6, -38, -.2]], .95, -30, VV, 18); onBody(c, 12, .9, .1, 42, L.k, 10.5); sh(V(0, 0, -30), 22); }, [[.1, 'shoelace', .4], [.55, 'gasp', .5], [.85, 'rope_swish', .8]]);
// 12 «den nimmt das Seil mit.»: la cuerda se lo lleva enredado, dando vueltas, pradera adelante; la cámara le sigue de lado
shot(10.586, 'F', null, L => { welt(L, 0, -10); const v = 46, z = -30 + v * (L.lt + .15); cuerda(L, -.15, -30, v); const c = put(DX[3], 0, ropeY(z) + 1.4, z, 0); c.blob.visible = false; c.root.rotation.set(-.9 + L.lt * 5, 0, L.lt * 7);
  actuar(c, 0, [[0, { aLx: 2.6, aRx: 2.2, aLz: .9, aRz: .7, lLx: -.6, lRx: .8, lLk: 1, lRk: .4 }]], { T: L.T }); cara(c, L.T, { eyes: 'terror', mouth: 'scream', noBlink: true });
  vecinos(L, [[-8, -36, PI / 2], [8, -40, -PI / 2]], -.15, -30, v, 20, { f: { expr: 'shock', mouth: 'o' } }); cam([16, 5, z - 4], [0, 3, z], 44); sh(V(0, 0, z), 30); }, [[0, 'whoosh', .7], [.1, 'scream_far', .6], [.4, 'rope_drag', .6]]);
// 13 «Bräute springen.»: los novios saltan bajo el arco de flores (bajito), el velo vuela
shot(11.626, 'S', null, L => { welt(L, 0, -22); show(BOGEN, 0, 0, -24, 0, 1); const tp = .5, zc = -21; cuerda(L, tp, zc, VV);
  springer(braut, -1.7, -21, .25, L, tp, zc, VV, 0, { pose: { aRx: .9, aRz: -.6, aRe: .6 }, f: { expr: 'joy' } }); springer(braeut, 1.7, -21, -.25, L, tp, zc, VV, 1, { pose: { aLx: .9, aLz: -.6, aLe: .6 }, f: { expr: 'joy' } });
  orbit(V(0, 4.4, -21), lerp(15, 13, L.k), .15, .08, 44); if (L.lt > tp) confetti(V(0, 3, -21), L.t0 + tp, L.T, 36, .7); sh(V(0, 0, -22), 22); }, [[.4, 'rope_swish', .6], [.5, 'jump', .5], [.55, 'cheer_small', .5]]);
// 14 «Chirurgen springen.»: dos cirujanos saltan a los lados de la mesa de operaciones bajita; el paciente rebota dormido
shot(12.755, 'Z', null, L => { welt(L, -25, 2); show(OPT, -25, 0, 0, PI / 2); const tp = .45, zc = 0; cuerda(L, tp, zc, VV);
  springer(CH[0], -27.7, 0, PI / 2, L, tp, zc, VV, 0, { pose: { aLx: 1.2, aRx: 1.3, aLe: 1.2, aRe: 1.0 }, f: { eyes: 'squint', mouth: 'flat' } }); springer(CH[1], -22.3, 0, -PI / 2, L, tp, zc, VV, 1, { pose: { aLx: 1.3, aRx: 1.2, aLe: 1.0, aRe: 1.2 }, f: { eyes: 'normal', mouth: 'flat' } });
  const p = put(DX[5], -25, 1.45 + Math.max(0, Math.cos(PI * (L.lt - tp) / .4)) * (Math.abs(L.lt - tp) < .2 ? .6 : 0), 0, 0); p.root.position.z = 2.6; p.root.rotation.set(-PI / 2, 0, 0); p.blob.visible = false; cara(p, L.T, { eyes: 'closed', mouth: 'o' });
  orbit(V(-25, 3.4, 0), lerp(19, 17, L.k), .55, .3, 44); sh(V(-25, 0, 0), 22); }, [[.3, 'rope_swish', .6], [.45, 'jump', .6], [.55, 'beep_monitor', .4]]);
// 15 «Wir schlafen auf dem Rücken»: uno pasea con otro dormido a caballito (Zzz)
const caballito = (L, a, b, x, z, ry, tp, zc, v) => { const s = springer(a, x, z, ry, L, tp, zc, v, 0, { pose: { aLx: .4, aRx: .4, aLz: -.4, aRz: -.4, aLe: 1.6, aRe: 1.6, lean: .2 }, f: { expr: 'tired' } });
  attach(b.root, a.spine, [0, -1.5, -1.25], [.3, 0, 0], b.spec.scale / a.spec.scale); b.root.visible = true; b.blob.visible = false; applyPose(b, { lLx: 1.4, lRx: 1.4, lLk: 1.3, lRk: 1.3, aLx: 1.5, aRx: 1.5, aLz: -.5, aRz: -.5, aLe: .5, aRe: .5, headX: .3, headZ: .35 + Math.sin(L.T * 3) * .04 });
  cara(b, L.T, { eyes: 'closed', mouth: Math.sin(L.T * 2) > 0 ? 'o' : 'wavy', noBlink: true }); const h = hp(b); show(ZZZ[0], h.x + 1, h.y + 1.6 + (L.T % 1) * .8, h.z, 0, 1); return s; };
shot(13.783, 'W', null, L => { welt(L, 8, -12); caballito(L, DX[6], DX[7], 8 - L.lt * 2, -12, -.6, 9, 0, VV); vecinos(L, [[16, -20, -.3]], 9, 0, VV, 22);
  onBody(DX[6], 15, 1.1, .1, 42, L.k, 13); sh(V(8, 0, -12), 22); }, [[0, 'snore', .5], [.4, 'steps_grass', .4]]);
// 16 «von denen, die gerade wach sind.»: salta con él a cuestas; el dormido ni se entera
shot(14.663, 'F', null, L => { welt(L, -14, 18); const tp = .6, zc = 18; cuerda(L, tp, zc, VV); caballito(L, DX[8], DX[9], -14, 18, .3, tp, zc, VV);
  vecinos(L, [[-22, 12, .3], [-6, 11, -.3]], tp, zc, VV, 24); orbit(V(-14, 4.6, 18), lerp(17, 15, L.k), 1.3, .06, 44); sh(V(-14, 0, 18), 22); }, [[.5, 'rope_swish', .6], [.6, 'jump', .5], [.7, 'snore', .5]]);
// 17 «Gefragt, warum,»: un niño señala la torre del horizonte; su madre le tapa la boca
shot(16.259, 'C', null, L => { welt(L, 20, 10); const k = put(DX[10], 18, 0, 10, .9); k.root.scale.setScalar(.62); actuar(k, 0, [[0, { aRx: 1.7, aRz: .1, aRe: .1, headX: -.2 }]], { T: L.T }); cara(k, L.T, { expr: 'confused', mouth: L.lt < .35 ? 'talk' : 'o' });
  const m = put(mutter, 21, 0, 9, -.2); actuar(m, 0, [[0, {}], [.3, { aRx: 1.7, aRz: -.9, aRe: 1.6, lean: .2, headX: .2 }, { dur: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'worried', eyes: 'side_l' });
  orbit(V(19.5, 3.4, 9.5), lerp(14, 12.5, L.k), .45, .08, 42); sh(V(19.5, 0, 9.2), 20); }, [[.05, 'kid_hm', .5], [.35, 'shush', .6]]);
// 18 «hat es noch nie jemand.»: los mayores se encogen de hombros y miran al suelo
shot(16.939, 'S', null, L => { welt(L, 0, -38); [[DX[11], -4, -40, .4], [DX[12], 0, -42, .1], [DX[13], 4, -40, -.3], [oma, 0, -37, 0]].forEach(([c, x, z, r], i) => { put(c, x, 0, z, r); actuar(c, 0, [[0, {}], [.2 + i * .1, i % 2 ? 'shrug' : { headX: .45, aLz: .1, aRz: .1, lean: .1 }, { dur: .3 }]], { T: L.T + i }); cara(c, L.T + i, { expr: i % 2 ? 'confused' : 'sad', eyes: i % 2 ? undefined : 'down' }); });
  orbit(V(0, 3.6, -39.5), lerp(17, 15, L.k), .05, .1, 44); sh(V(0, 0, -40), 22); }, [[.2, 'cloth', .4], [.5, 'sigh', .4]]);
// 19 «Hier dauert alles neun Sekunden.»: alguien barre, salta y sigue barriendo; reloj 9→1
shot(18.205, 'W', null, L => { welt(L, 12, 26); const tp = 1.05, zc = 26; cuerda(L, tp, zc, VV); const c = DX[14]; const s = springer(c, 12, 26, -.3, L, tp, zc, VV, 0, { pose: { aLx: .9 + Math.sin(L.T * 9) * .3, aRx: .7 + Math.sin(L.T * 9) * .3, aLe: .6, aRe: .5, aLz: -.3, aRz: -.1, lean: .15 } });
  attach(BESEN, c.aR.hand, [0, -.4, .3], [1.3 + Math.sin(L.T * 9) * .3, 0, 0], .9); dust(V(12, 0, 28), L.t0, L.T, 6, .4);
  onBody(c, 14, .3, .1, 42, L.k, 12.5, null, 2.6); badge('gold', '0:0' + Math.max(1, 9 - Math.floor(L.lt * 6)), W * .76, H * .1, clamp(L.lt / .15)); sh(V(12, 0, 26), 22); }, [[0, 'broom', .5], [.5, 'tick', .4], [1.0, 'jump', .5]]);
// 20 «Oder es passiert in Stücken.»: uno clava la valla tabla a tabla, entre salto y salto
shot(19.785, 'Z', null, L => { welt(L, PX, PZ + 8); show(ZAUN, PX, 0, PZ + 6); const c = put(DX[15], PX + 2, 0, PZ + 8.5, PI - .2); const hit = Math.sin(L.T * 10);
  actuar(c, 0, [[0, { aRx: 1.6 + hit * .7, aRe: .8, aLx: 1.1, aLe: .6, crouch: .25, lean: .3, headX: .3 }]], { T: L.T }); attach(HAMMER, c.aR.hand, [0, -.4, .2], [1.4, 0, 0], .9); cara(c, L.T, { expr: 'determined' });
  show(BRETT, PX + 1, 1.3, PZ + 6.2, 0); onBody(c, 12, .45, .14, 42, L.k, 10.5); sh(V(PX, 0, PZ + 7), 20); }, [[.1, 'hammer', .6], [.45, 'hammer', .6], [.8, 'hammer', .6]]);
// boda: arco en (0, -24); novios en (∓1,7, -21); la Standesbeamtin con su libro detrás; invitados sentados en el suelo
function boda(L, o = {}) { welt(L, 0, -18); show(BOGEN, 0, 0, -24, 0, 1); const bt = put(beamtin, 0, 0, -25.5, 0); actuar(bt, 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); cara(bt, L.T, { expr: 'smile' }); attach(DECKE, bt.aR.hand, [0, -.3, .5], [0, 0, 0], .4);
  [[-7, -14, .5], [-4, -13, .3], [4, -13, -.3], [7, -14, -.5], [-6, -10, .4], [6, -10, -.4]].forEach(([x, z, r], i) => { const c = DX[16 + i]; if (o.jump != null) springer(c, x, z, r + PI, L, o.jump, -18, VV, i, { f: { expr: 'joy' } }); else { sit(c, x, .9, z, r + PI, L, { aLx: .4, aRx: .4 }); cara(c, L.T + i, { expr: 'smile' }); } }); }
// 21 «Eine Hochzeit geht so:»: la boda entera, bajita, en la pradera
shot(21.254, 'W', null, L => { boda(L); put(braut, -1.7, 0, -21, PI + .3); put(braeut, 1.7, 0, -21, PI - .3); for (const c of [braut, braeut]) { actuar(c, 0, [[0, { aLx: .3, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy' }); }
  orb(L.k, V(0, 3.4, -20), null, [22, PI + .5, .2, 44], [20, PI + .3, .16, 44]); sh(V(0, 0, -20), 26); }, [[0, 'birds', .4], [.3, 'organ_soft', .4]]);
// 22 «„Ja, ich will.“»: la novia lo dice emocionada
shot(22.444, 'C', null, L => { boda(L); const b = put(braut, -1.7, 0, -21, PI + .45); actuar(b, 0, [[0, { aLx: .6, aRx: .6, aLe: 1.3, aRe: 1.3, aLz: -.3, aRz: -.3 }]], { T: L.T }); talk(b, L.T, 22.4, 23.1, 'happy'); put(braeut, 1.7, 0, -21, PI - .45); cara(braeut, L.T, { expr: 'smile' });
  onFace(b, 6, -.4, .6, 40, L.k, 5.4); sh(V(0, 0, -21), 16); }, [[0, 'sparkle', .3]]);
// 23 «Sprung.»: los dos y todos los invitados saltan
shot(23.276, 'F', 'punch', L => { boda(L, { jump: .2 }); cuerda(L, .2, -21, VV); springer(braut, -1.7, -21, PI + .2, L, .2, -21, VV, 0, { f: { expr: 'joy' } }); springer(braeut, 1.7, -21, PI - .2, L, .2, -21, VV, 1, { f: { expr: 'joy' } });
  orbit(V(0, 4, -18), 20, PI + .1, .05, 46); sh(V(0, 0, -20), 26); }, [[.1, 'rope_swish', .7], [.2, 'jump_crowd', .7]]);
// 24 «„Ich auch.“»: el novio, con una sonrisa enorme
shot(23.791, 'C', null, L => { boda(L); const g = put(braeut, 1.7, 0, -21, PI - .45); actuar(g, 0, [[0, { aRx: .5, aRz: -.2, aRe: 1 }]], { T: L.T }); talk(g, L.T, 23.75, 24.3, 'happy'); put(braut, -1.7, 0, -21, PI + .45); cara(braut, L.T, { expr: 'joy' });
  onFace(g, 6, -.4, -.6, 40, L.k, 5.4); sh(V(0, 0, -21), 16); }, [[0, 'sparkle', .3]]);
// 25 «Sprung.»: desde el suelo: los novios en el aire de la mano, confeti, la cuerda bajo ellos
shot(24.511, 'W', null, L => { boda(L, { jump: .15 }); cuerda(L, .15, -21, VV); springer(braut, -1.4, -21, PI + .5, L, .15, -21, VV, 0, { pose: { aRx: 1.6, aRz: -.4 }, f: { expr: 'joy' } }); springer(braeut, 1.4, -21, PI - .5, L, .15, -21, VV, 1, { pose: { aLx: 1.6, aLz: -.4 }, f: { expr: 'joy' } });
  confetti(V(0, 2, -21), L.t0, L.T, 40, .8); cm([10, 1.4, -25, 0, 5.6, -21, 48], [9.4, 1.6, -24.4, 0, 5.8, -21, 46], L.k); sh(V(0, 0, -21), 20); }, [[.05, 'jump', .6], [.15, 'cheer_small', .6]]);
// 26 «Suppe essen ist Leistungssport.»: uno salta con el cuenco y la cuchara en la boca; la sopa vuela
shot(24.968, 'S', null, L => { welt(L, 22, 2); const tp = .8, zc = 2; cuerda(L, tp, zc, VV); const c = suppeM; const s = springer(c, 22, 2, -.4, L, tp, zc, VV, 0, { pose: { aLx: 1.2, aLe: 1.5, aLz: -.4, aRx: 1.8, aRz: -.5, aRe: 2.1, headX: .1 }, f: { expr: 'determined', mouth: 'o' } });
  attach(SUPPE, c.aL.hand, [0, -.5, .5], [0, 0, 0], 1); if (L.lt > tp - .1) spray(SPLASH, wpos(SUPPE).add(V(0, .5, 0)), V(0, 1, .3), L.t0 + tp - .1, L.T, 22, .8, 10);
  onBody(c, 11, .3, .08, 42, L.k, 9.8); sh(V(22, 0, 2), 20); }, [[.1, 'slurp', .6], [.75, 'jump', .5], [.8, 'splash', .7], [1.2, 'land', .4]]);
// 27 «Babys tragen wir»: una madre lleva al bebé en brazos mientras salta
shot(26.684, 'W', null, L => { welt(L, -12, 30); const tp = .55, zc = 30; cuerda(L, tp, zc, VV); springer(mutter, -12, 30, .3, L, tp, zc, VV, 0, { pose: { aLx: 1.1, aRx: 1.1, aLe: 1.3, aRe: 1.3, aLz: -.35, aRz: -.35 }, f: { expr: 'warm' } });
  attach(BABYS[0], mutter.spine, [0, 1.05, 1.35], [0, 0, 0], .8); orbit(V(-12, 4, 30), lerp(13, 11, L.k), .5, .1, 42); sh(V(-12, 0, 30), 20); }, [[.5, 'jump', .5], [.6, 'baby_coo', .4]]);
// 28 «ein ganzes Jahr lang.»: un padre también, con el «1 JAHR»
shot(27.964, 'Z', null, L => { welt(L, 14, 30); const tp = .2, zc = 30; cuerda(L, tp, zc, VV); springer(DX[22], 14, 30, -.3, L, tp, zc, VV, 0, { pose: { aLx: 1.1, aRx: 1.1, aLe: 1.3, aRe: 1.3, aLz: -.35, aRz: -.35 }, f: { expr: 'tired' } });
  attach(BABYS[1], DX[22].spine, [0, 1.05, 1.35], [0, 0, 0], .8); onBody(DX[22], 11, -.2, .1, 42, L.k, 9.6); bigNum('1 JAHR', clamp((L.lt - .05) / .15), 'gold', .19, 1.1); sh(V(14, 0, 30), 20); }, [[.15, 'jump', .5], [.05, 'pling', .4]]);
// 29 «Dann lernen sie es.»: un niño pequeñito da su primer salto torpe; los padres aplauden
shot(28.364, 'C', null, L => { welt(L, 0, 34); const tp = .55, zc = 34; cuerda(L, tp, zc, 80); const k = DX[23]; springer(k, 0, 34, 0, L, tp, zc, 80, 0, { J: 2.2, pose: { aLx: 1.2, aRx: 1.2, aLz: .6, aRz: .6 }, f: L.lt > tp ? { expr: 'joy' } : { expr: 'worried', mouth: 'o' } }); k.root.scale.setScalar(.48);
  for (const [c, x, r] of [[mutter, -4, .4], [DX[22], 4, -.4]]) { put(c, x, 0, 31, r); crowdGuy(c, x, 31, L, 1, { mode: 'clap', ry: r }); }
  orbit(V(0, 2.6, 33.5), lerp(13, 11.5, L.k), 0, .1, 42); sh(V(0, 0, 33), 18); }, [[.5, 'jump_small', .5], [.75, 'clap', .6]]);
// 30 «Ihr erstes Wort ist»: el bebé en brazos abre la boca; la madre se acerca a escuchar
shot(29.513, 'W', null, L => { welt(L, -6, 14); const m = put(mutter, -6, 0, 14, .3); actuar(m, 0, [[0, { aLx: 1.1, aRx: 1.1, aLe: 1.3, aRe: 1.3, aLz: -.35, aRz: -.35, headX: .35, lean: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'warm' });
  const b = attach(BABYS[0], m.spine, [0, 1.05, 1.35], [0, 0, .15], .8); b.userData.mouth.scale.y = 1 + clamp((L.lt - .5) / .2) * 2.5;
  onBody(m, 9, .15, .05, 40, L.k, 8, null, 4.6); sh(V(-6, 0, 14), 16); }, [[.3, 'baby_coo', .5]]);
// 31 «„Spring!“»: ¡el bebé lo grita! burbuja «SPRING!»; la madre, con los ojos como platos
shot(30.433, 'C', 'punch', L => { welt(L, -6, 14); const m = put(mutter, -6, 0, 14, .3); actuar(m, 0, [[0, { aLx: 1.1, aRx: 1.1, aLe: 1.3, aRe: 1.3, aLz: -.35, aRz: -.35, lean: -.1 }]], { T: L.T }); cara(m, L.T, { eyes: 'wide', mouth: 'open_smile', noBlink: true });
  const b = attach(BABYS[0], m.spine, [0, 1.05, 1.35], [0, 0, .15], .8); b.userData.mouth.scale.set(1.6, 4, 1); const bp = wpos(b); BAD_.push({ kind: 'bubble', text: 'SPRING!', w3: bp.clone().add(V(0, 3, 0)), s: spring(clamp(L.lt / .12) * 1.6) * 1.2, a: 1, on: true });
  onBody(m, 7, .1, 0, 38, L.k, 6.2, null, 4.8); sh(V(-6, 0, 14), 16); }, [[0, 'baby_shout', .8], [.1, 'pop', .5]]);
// 32-34 «Kein Tisch, kein Bett, kein Zaun»: primeros planos a ras de suelo: la mesita, la cama, la valla
shot(31.242, 'S', null, L => { welt(L, PX, PZ); show(PARC, PX, 0, PZ, 0); cm([PX + 3, 1.4, PZ + 7, PX + 3, 1, PZ + 2, 38], [PX + 4.4, 1.6, PZ + 6.4, PX + 3, 1, PZ + 2, 38], L.k); sh(V(PX, 0, PZ), 14); }, [[0, 'tap', .4]]);
shot(32.002, 'S', null, L => { welt(L, PX, PZ); show(PARC, PX, 0, PZ, 0); cm([PX - 1, 1.6, PZ + 4, PX - 3, .8, PZ - 2.6, 40], [PX - .2, 1.8, PZ + 3.6, PX - 3, .8, PZ - 2.6, 40], L.k); sh(V(PX, 0, PZ), 14); }, [[0, 'cloth', .4]]);
shot(32.617, 'S', null, L => { welt(L, PX, PZ + 8); show(PARC, PX, 0, PZ, 0); show(ZAUN, PX, 0, PZ + 10); cm([PX - 4, 1.4, PZ + 15, PX, 1, PZ + 10, 40], [PX - 2.6, 1.6, PZ + 15, PX, 1, PZ + 10, 40], L.k); sh(V(PX, 0, PZ + 10), 14); }, [[0, 'wood_knock', .4]]);
// 35 «ist bei uns höher als ein Knie.»: yo junto a la valla y la mesa: todo me llega por la rodilla; marca «KNIE»
shot(33.197, 'Z', null, L => { welt(L, PX, PZ + 8); show(PARC, PX, 0, PZ, 0); show(ZAUN, PX, 0, PZ + 10); const c = put(ich, PX + 1.5, 0, PZ + 12, 0); actuar(c, 0, [[0, { aRx: .4, aRz: .1, headX: .35, aLx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'smile', eyes: 'down' });
  orbit(V(PX + 1, 3.4, PZ + 11), lerp(15, 12.5, L.k), -.35, .06, 44); badge3('tag', 'KNIE', V(PX + 1.5, 2, PZ + 12.6), clamp((L.lt - .2) / .2)); sh(V(PX, 0, PZ + 10), 18); }, [[.2, 'pop', .5]]);
// 36 «Das Seil hat sich schon gedreht,»: hace siglos (sepia): gente de antes saltando igual
shot(34.832, 'F', null, L => { welt(L, -40, -20, { dusk: true }); const tp = .7, zc = -20; cuerda(L, tp, zc, VV); vecinos(L, [[-46, -20, .2], [-40, -22, 0], [-34, -20, -.2], [-43, -26, .1], [-37, -27, -.1]], tp, zc, VV, 24, { f: { expr: 'neutral' } });
  grade.uniforms.sepia.value = .85; BW = .5; orbit(V(-40, 4, -22), lerp(20, 17, L.k), .2, .08, 44); sh(V(-40, 0, -22), 26); }, [[0, 'old_film', .5], [.6, 'rope_swish', .5]]);
// 37 «lange bevor irgendjemand geboren wurde.»: la torre, sepia, girando ya entonces
shot(36.372, 'W', null, L => { welt(L, 600, 0, { dusk: true, grass: false }); wolken(); setRope(2 + L.lt * .5); grade.uniforms.sepia.value = .85; BW = .5; cm([700, 30, 260, TX, 200, 0, 44], [720, 34, 240, TX, 210, 0, 42], L.k); sh(V(TX, 0, 0), 80); }, [[.2, 'crank', .5], [.5, 'old_film', .4]]);
// 38 «Wir sehen es kommen.»: yo en el pedestal mirando al horizonte con la mano de visera; a lo lejos la cuerda se acerca levantando polvo
shot(38.472, 'C', null, L => { welt(L, -8, -8); const p = D1.peds[1]; const c = put(ich, p[0], 2.3, p[1], PI); c.blob.visible = false; hornHang(c, 0); actuar(c, 0, [[0, { aRx: 2.4, aRz: -.6, aRe: 2.3, headX: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', eyes: 'squint' });
  cuerda(L, 3.5, p[1], 300); onBody(c, 12, 1.15, .02, 42, L.k, 10.5); sh(V(p[0], 0, p[1]), 20); }, [[0, 'wind', .5], [.3, 'rope_far', .6]]);
// 39 «Wir hören es kommen.»: la mano en la oreja; el zumbido se acerca (ondas)
shot(39.521, 'S', null, L => { welt(L, -8, -8); const p = D1.peds[1]; const c = put(ich, p[0], 2.3, p[1], PI - .6); c.blob.visible = false; hornHang(c, 0); actuar(c, 0, [[0, GEST.listen]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'side_l' });
  for (let k = 0; k < 3; k++) { const q = ((L.lt * 1.4 + k / 3) % 1); FX2D.push(x => { x.save(); x.strokeStyle = `rgba(255,255,255,${(1 - q) * .7})`; x.lineWidth = 10; x.beginPath(); x.arc(W * .3, H * .4, 60 + q * 300, -1, 1); x.stroke(); x.restore(); }); }
  onFace(c, 7, -.6, 1.6, 40, L.k, 6); sh(V(p[0], 0, p[1]), 16); }, [[0, 'rope_far', .7]]);
// 40 «Ganz weit weg schreien die Leute»: en el pueblo de al lado, todos con los brazos arriba gritando
shot(40.617, 'W', null, L => { welt(L, -220, 140); ola(L, DX.slice(0, 10), -220, 128, 2.4, 160, 60);
  cm([-205, 6, 175, -222, 4, 138, 30], [-208, 6, 170, -222, 4, 138, 28], L.k); sh(V(-220, 0, 140), 30); }, [[.1, 'crowd_far_shout', .8]]);
// 41 «„Spring!“»: más cerca: la gente grita «SPRING!»
shot(41.997, 'C', 'punch', L => { welt(L, -220, 140); [[DX[10], -224, 140, .2], [DX[11], -219, 141, 0], [DX[12], -214, 140, -.2], [oma, -221, 136, .1]].forEach(([c, x, z, r], i) => { put(c, x, 0, z, r); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, aLe: .3, aRe: .3, headX: -.2 }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'shout', mouth: 'scream', eyes: 'squint' }); });
  orbit(V(-219, 4.4, 139), lerp(16, 14, L.k), 0, .06, 44); badge('red', 'SPRING!', W / 2, H * .2, clamp(L.lt / .12), 1, 1.2); sh(V(-219, 0, 139), 20); }, [[0, 'crowd_shout', 1]]);
// 42 «Und der Schrei rollt auf uns zu»: desde arriba: una ola de brazos levantados cruza la pradera hacia el pueblo
shot(43.113, 'Z', null, L => { welt(L, -100, 60); ola(L, DX, -100, -10, 5.2, -10 + L.lt * 90, 18);
  cm([-30, 70, 120, -100, 0, 60, 46], [-40, 64, 110, -100, 0, 70, 44], L.k); sh(V(-100, 0, 60), 80); }, [[0, 'crowd_wave', .9]]);
// 43 «wie eine Welle.»: a ras de suelo, la ola de gente pasa junto a la cámara
shot(44.533, 'W', null, L => { welt(L, -100, 60); ola(L, DX, -100, 20, 3.2, 20 + L.lt * 60, 9);
  cm([-90, 3, 70, -100, 4, 30, 44], [-90, 3.4, 66, -100, 4.4, 30, 44], L.k); sh(V(-100, 0, 50), 30); }, [[0, 'crowd_wave', .9], [.4, 'whoosh_soft', .4]]);
// 44 «Die Rufer geben ihn weiter.»: tres Rufer en sus pedestales, uno tras otro, con trompetillas
shot(45.482, 'S', null, L => { welt(L, 0, -30); [[DX[2], -14, -40], [DX[4], 0, -30], [DX[6], 14, -20]].forEach(([c, x, z], i) => { put(c, x, 2.3, z, -.4); c.root.scale.setScalar(.72); c.blob.visible = false; const on = clamp((L.lt - i * .3) / .15) * clamp((i * .3 + .45 - L.lt) / .1 + 1);
    if (on > .1) rufen(c, L, i + 1, on); else { actuar(c, 0, [[0, { aRx: .3 }]], { T: L.T }); hornHang(c, i + 1); cara(c, L.T, { expr: 'determined' }); } });
  PEDS.forEach((p, i) => show(p, [-14, 0, 14][i], 0, [-40, -30, -20][i]));
  cm([30, 9, -2, -2, 4, -30, 44], [26, 9, -6, 2, 4, -30, 44], L.k); sh(V(0, 0, -30), 30); }, [[0, 'horn_blow', .6], [.3, 'horn_blow', .6], [.6, 'horn_blow', .6]]);
const PEDS = [0, 1, 2].map(() => P_(sockel(null, 0, 0)));
// 45 «Ich bin einer davon.»: yo en mi pedestal, la trompetilla al hombro, orgulloso
shot(46.801, 'C', null, L => { welt(L, 8, 8); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], .1); c.blob.visible = false; hornHang(c, 0); actuar(c, 0, [[0, { aLx: .3, aLz: .7, aLe: 1.9, aRx: .3, aRz: .7, aRe: 1.9, lean: -.08, headX: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smile' });
  orbit(V(p[0], 5.6, p[1]), lerp(13, 10.5, L.k), .05, .02, 42); sh(V(p[0], 0, p[1]), 18); }, [[0, 'sparkle', .4]]);
// 46 «Der wichtigste Job,»: grito «SPRING!» por la trompetilla (golpe de zoom)
shot(47.918, 'Z', 'punch', L => { welt(L, 8, 8); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], .1); c.blob.visible = false; rufen(c, L, 0, clamp(L.lt / .1));
  onFace(c, 6.5, -.4, -5.2, 40, L.k, 5.4); sh(V(p[0], 0, p[1]), 16); }, [[0, 'horn_blow', .8], [.05, 'shout_kid', .7]]);
// 47 «den ein Kind haben kann.»: desde detrás de mí: el pueblo entero salta a mi señal
shot(49.118, 'W', null, L => { welt(L, 0, 0); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], PI + .3); c.blob.visible = false; rufen(c, L, 0, .8); const tp = .5, zc = -6; cuerda(L, tp, zc, VV);
  vecinos(L, [[4, -4, .3], [-2, -6, .1], [10, -8, -.2], [-8, -12, .2], [2, -14, 0], [14, -16, -.3], [-12, -20, .2], [6, -24, 0], [-4, -26, .1]], tp, zc, VV, 0, { pose: {} });
  cm([p[0] + 3, 9, p[1] + 9, p[0] - 4, 3, p[1] - 20, 46], [p[0] + 2.4, 9.4, p[1] + 8, p[0] - 4, 3, p[1] - 22, 46], L.k); sh(V(0, 0, -10), 30); }, [[.4, 'rope_swish', .6], [.5, 'jump_crowd', .6]]);

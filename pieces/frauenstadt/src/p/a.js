// ---------- a: gancho y reglas (0 – 28,2 s) ----------
// Männergefängnis (KNX): portón en (KNX, z = -14,6) (se abre deslizando a x = +13), marcador LED en (KNX-24, -12), pared de medir en (KNX+11, -14,1).
// Celda (ZEX): barrotes en z = 7, banco (-3, 2,4, -7), ventana (4, 10, -8,8). Frauenstein: estatua (0, -52), Maibaum (18, -14), fuente (-14, -26).
const KG = V(KNX, 0, -14.6);
const gateAt = k => { KN.gate.position.x = lerp(13, 0, clamp(k)); };
// guardia empujando: brazos al frente
const PUSH = { aLx: 1.55, aRx: 1.55, aLe: .3, aRe: .3, lean: .3, lLx: .4, lRx: -.35, lRk: .2 };
// preso en el patio (fila o grupo)
function yard(L, n = 6, o = {}) { crowdAt(L, KNX + (o.x ?? 0), o.z ?? 6, n, o.r0 ?? 6, o.r1 ?? 18, o.seed ?? 3, { list: INS, from: o.from ?? 6, mode: o.mode || (i => ['talk', 'walk', 'idle', 'talk'][i % 4]), speed: 1.4, expr: o.expr }); }

// 1 «In dieser Stadt sind Frauenrechte heilig.»: dos Wärterinnen arrastran a un hombre por el patio hasta el portón, lo empujan dentro y la reja se cierra de golpe
shot(0, 'C', null, L => { knast(L); const lt = L.lt, a = easeInOut(clamp(lt / .75)), b = easeIn(clamp((lt - .75) / .3));
  const m = put(INS[0], KNX + lerp(12, 0, a), 0, lerp(-10.5, -15.8, b), lt < .75 ? -PI / 2 : PI); actuar(m, lt, [[0, { lean: -.25, aLx: -.5, aRx: -.5, aLz: .5, aRz: .5, headX: -.25, ...walkP(L.T, 0) }], [.75, { lean: .45, aLx: 1.4, aRx: 1.4, headX: .3, lLx: -.6, lRx: .4 }, { dur: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'scream' });
  for (const s_ of [-1, 1]) { const g = put(WA[s_ < 0 ? 0 : 1], KNX + lerp(15, 3.2, a) + (s_ < 0 ? 0 : 1.4), 0, -10.5 + s_ * 1.6 + b * -2, lt < .75 ? -PI / 2 : PI - s_ * .4); actuar(g, lt, [[0, { ...walkP(L.T, s_ + 2), aLx: 1.3, aRx: 1.3, aLe: .4, aRe: .4, lean: .2 }], [.75, PUSH, { dur: .15 }], [1.05, { aLx: .2, aRx: .2, lean: -.05 }, { dur: .3 }]], { T: L.T }); cara(g, L.T, { expr: 'angry', mouth: lt > 1.05 ? 'smirk' : 'talk_wide' }); }
  gateAt((lt - 1.0) / .18); if (lt > 1.18) { actuar(m, 0, [[0, { aLx: 2.3, aRx: 2.3, aLz: .3, aRz: .3, aLe: 1.5, aRe: 1.5 }]], { T: L.T }); m.root.position.z = -16.2; m.root.rotation.y = 0; cara(m, L.T, { expr: 'cry' }); }
  cm([KNX + 7, 5.4, 9], [KNX + 4.6, 5.8, 3.5], L.k, easeOut); camera.lookAt(KNX + 3.5, 5, -12); camera.fov = 50; sh(V(KNX + 4, 0, -10), 24); },
  [[0, 'shout_m', .5], [.1, 'run_cobble', .4], [.75, 'thud', .5], [1.02, 'slam', .9], [1.1, 'chain_rattle', .5], [1.3, 'keys', .4]]);
// 2 «heilig.»: la estatua desde abajo, antorcha encendida; mujeres aplauden a sus pies
shot(1.50, 'Z', 'punch', L => { town(L); crowdAt(L, 0, -38, 14, 6, 18, 2, { mode: i => i % 3 ? 'clap' : 'cheer' }); orb(L.k, V(0, 26, -52), V(0, 30, -52), [62, .15, -.05, 50], [52, .05, .02, 46], easeOut); sh(V(0, 0, -44), 40); },
  [[0, 'choir', .5], [.2, 'cheer', .4]]);
// 3 «So heilig, dass jeder»: por la plaza pasa una fila de hombres con mono naranja, escoltados; las mujeres los miran y los señalan
shot(2.28, 'W', null, L => { town(L); for (let i = 0; i < 6; i++) { const c = put(INS[2 + i], -14 + i * 5.2 + L.lt * 3, 0, 4 + (i % 2) * .4, PI / 2); actuar(c, 0, [[0, { ...walkP(L.T, i), aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.3, aRe: 1.3, headX: .35 }]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 9 + i)) * .1; cara(c, L.T + i, { expr: 'sad' }); }
  const g = put(WA[2], 19 + L.lt * 3, 0, 4.6, -PI / 2); actuar(g, 0, [[0, { aRx: 1.6, aRe: .1 }]], { T: L.T }); cara(g, L.T, { expr: 'angry', mouth: 'talk_wide' });
  crowdAt(L, 0, -6, 10, 9, 22, 4, { mode: i => i % 2 ? 'point' : 'talk', expr: 'smug' }); cm([-8 + L.lt * 3, 5, 26], [-2 + L.lt * 3, 5.6, 22], L.k); camera.lookAt(0 + L.lt * 3, 4, 4); camera.fov = 46; sh(V(0, 0, 4), 34); },
  [[0, 'steps', .5], [.2, 'chain_rattle', .4], [.6, 'whistle', .35]]);
// 4 «Mann im Gefängnis geboren wird.»: en la celda, una cuna con un bebé con mono naranja «M-001»; la cámara entra por los barrotes
shot(3.40, 'F', 'slow', L => { zelleS(L, { tally: '', n: 0 }); show(CRIB, ZEX, 0, -2, 0); const b = put(baby, ZEX, 3.05, -2.2, 0); b.root.scale.setScalar(.46); b.blob.visible = false; actuar(b, L.lt, [[0, { aLx: .6, aRx: .6, aLz: .4, aRz: .4 }], [.6, { aLx: 2.2, aRx: 2.2, aLz: .3, aRz: .3, aLe: 1.2, aRe: 1.2 }, { dur: .3 }]], { T: L.T }); cara(b, L.T, { expr: L.lt < .6 ? 'gasp' : 'cry' });
  const g = put(WA[0], ZEX + 6, 0, 9, -.4); actuar(g, L.lt, [[0, { aRx: 1.5, aRe: .4 }], [.4, { aRx: .3, aRe: .2 }, { dur: .3 }]], { T: L.T }); cara(g, L.T, { expr: 'smug' }); attach(CUFFS, g.aR.hand, [0, -.6, 0], [0, 0, 0], .9);
  cm([ZEX + .5, 6.5, 15], [ZEX + .2, 5.2, 1.2], L.k, easeIn); camera.lookAt(ZEX, 4.4, -2.2); camera.fov = 44; sh(V(ZEX, 0, 0), 14); },
  [[0, 'metal_creak', .5], [.3, 'baby_gasp', .6], [.9, 'cry_girl', .2], [1.2, 'keys', .3]]);
// 5 «Und raus kommst du nur mit Punkten.»: el marcador LED «0 / 10.000»; los presos miran hacia arriba
shot(5.04, 'S', null, L => { knast(L, { sb: ['0 / 10.000'] }); gateAt(0); for (let i = 0; i < 5; i++) { const c = put(INS[8 + i], KNX - 30 + i * 3.4, 0, 4 + (i % 2) * 2.4, PI - .3); actuar(c, 0, [[0, { headX: -.5, aLx: .2, aRx: .2 }]], { T: L.T }); cara(c, L.T + i, { expr: i % 2 ? 'worried' : 'lookup' }); }
  cm([KNX - 18, 4, 24], [KNX - 20, 12, 18], L.k); camera.lookAt(KNX - 24, 13 + L.k * 3, -12); camera.fov = 46; sh(V(KNX - 22, 0, 0), 30); },
  [[0, 'power_on', .5], [.3, 'hum', .3]]);
// 6 «Zehn Punkte pro guter Tat»: un preso escoltado sostiene un paraguas sobre una señora en la terraza del café; «+10»
shot(6.62, 'W', null, L => { town(L); const w = sit(EX[1], 38, 3.0, -26, -PI / 2, L, { aRx: .9, aRe: 1.6 }); cara(w, L.T, { expr: 'smug', mouth: 'smile' }); const p = put(INS[3], 34.6, 0, -26, PI / 2); actuar(p, 0, [[0, { crouch: .55, lean: .5, lLx: .9, lLk: 1.6, lRx: -.2, lRk: 1.4, aRx: 1.2 + Math.sin(L.T * 14) * .25, aRe: .6, aLx: 1.0, aLe: .8, headX: .2 }]], { T: L.T, weight: false }); cara(p, L.T, { expr: 'determined' });
  const g = put(WA[1], 30, 0, -21, PI / 2 + .4); actuar(g, 0, [[0, 'cross']], { T: L.T }); cara(g, L.T, { expr: 'sus' }); badge('green', '+10', W / 2, H * .2, clamp((L.lt - .5) / .2), 1, 1.1);
  orb(L.k, V(35, 4.5, -26), null, [20, -1.0, .15, 44], [16, -1.25, .12, 44]); sh(V(36, 0, -26), 20); }, [[0, 'birds', .3], [.5, 'ding_soft', .7], [.6, 'coin_flip', .5]]);
// 7 «für eine Frau.»: la señora sonríe y le da el visto bueno; la guardiana apunta en su libreta
shot(7.95, 'C', null, L => { town(L); const w = sit(EX[1], 38, 3.0, -26, -PI / 2, L, { aRx: 1.5, aRz: -.1, aRe: 1.2 }); cara(w, L.T, { expr: 'happy' }); const g = put(WA[1], 32, 0, -20, PI / 2 + .6); actuar(g, 0, [[0, { aLx: 1.1, aLe: 1.6, aRx: 1.0, aRz: -.3, aRe: 1.8, headX: .3 }]], { T: L.T }); attach(CLIP, g.aL.hand, [0, -.4, .3], [-.4, 0, 0], 1); cara(g, L.T, { expr: 'neutral' });
  badge3('green', '+10', hp(w).add(V(0, 2.4, 0)), clamp(L.lt / .2)); onFace(w, 5.6, .2, .6, 40, L.k, 4.6); sh(V(36, 0, -26), 14); }, [[0, 'pencil', .5], [.3, 'sparkle', .4]]);
// 8 «Zehntausend»: el marcador salta a 10.000 en dorado
shot(8.75, 'Z', 'punch', L => { knast(L, { sb: [L.lt < .25 ? '10' : '10.000', '#ffd23f', 'SO VIELE BRAUCHST DU'] }); cm([KNX - 18, 16, 8], [KNX - 21, 17, 4.5], L.k); camera.lookAt(KNX - 24, 18, -12); camera.fov = 44; sh(V(KNX - 22, 0, 0), 30); },
  [[0, 'count', .5], [.25, 'magic_hit', .6]]);
// 9 «brauchst du.»: en el patio, los presos se llevan las manos a la cabeza
shot(9.60, 'F', null, L => { knast(L, { sb: ['10.000', '#ffd23f'] }); for (let i = 0; i < 5; i++) { const c = put(INS[9 + i], KNX - 8 + i * 4, 0, 6 + (i % 2) * 2.4, -.1 + i * .05); actuar(c, L.lt, [[0, 'idle'], [.05 + i * .04, i % 2 ? 'hands_head' : 'facepalm', { dur: .3 }]], { T: L.T }); cara(c, L.T + i, { expr: i % 2 ? 'shock' : 'cry' }); }
  orb(L.k, V(KNX, 4, 7), null, [24, .15, .12, 44], [20, .05, .1, 44]); sh(V(KNX, 0, 6), 24); }, [[0, 'gasp', .5], [.2, 'sigh', .4]]);
// 10 «Aber bevor du überhaupt Punkte sammeln darfst,»: un preso camina hacia la pared de medir; la guardiana espera con la libreta
shot(10.29, 'W', null, L => { knast(L); const c = put(INS[4], KNX + 11 + lerp(6, 0, easeOut(clamp(L.lt / 1.1))), 0, -12.6 + lerp(6, 0, easeOut(clamp(L.lt / 1.1))), lerp(PI + .8, 0, clamp((L.lt - .9) / .3))); actuar(c, 0, [[0, L.lt < 1.1 ? walkP(L.T, 1) : { aLx: 0, aRx: 0 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  const g = put(WA[0], KNX + 5, 0, -9, .8); actuar(g, 0, [[0, { aLx: 1.1, aLe: 1.6, aRx: .2 }]], { T: L.T }); attach(CLIP, g.aL.hand, [0, -.4, .3], [-.4, 0, 0], 1); cara(g, L.T, { expr: 'sus' }); yard(L, 5, { x: -10, z: 8, from: 8 });
  orb(L.k, V(KNX + 9, 4, -12), null, [24, .5, .12, 46], [18, .25, .1, 44]); sh(V(KNX + 8, 0, -10), 24); }, [[0, 'steps', .5], [.8, 'pages', .4]]);
// 11 «musst du mindestens 1,98 groß sein.»: la raya roja de 1,98 m; la cámara sube por la regla
shot(12.40, 'C', null, L => { knast(L); const c = put(INS[4], KNX + 11, 0, -12.9, 0); actuar(c, 0, [[0, { headX: -.2 }]], { T: L.T }); heightTo(c, 1.84); cara(c, L.T, { expr: 'worried' });
  cm([KNX + 11, 3, -1], [KNX + 11, 8.2, -3.6], L.k); camera.lookAt(KNX + 11, lerp(3, 7.9, easeInOut(L.k)), -14); camera.fov = 40; sh(V(KNX + 11, 0, -12), 12); }, [[0, 'tick', .4], [.6, 'impact', .5]]);
// 12 «Bist du kleiner?»: un preso bajito: la cabeza le queda muy por debajo de la raya; la guardiana se inclina a mirar
shot(14.84, 'Z', 'punch', L => { knast(L); const c = put(INS[5], KNX + 11, 0, -12.9, 0); heightTo(c, 1.62); actuar(c, 0, [[0, { headX: -.3, aLz: .1, aRz: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'scared', mouth: 'grimace' }); sweat(c, L.T);
  const g = put(WA[0], KNX + 5.6, 0, -11, .9); actuar(g, 0, [[0, { lean: .3, headZ: -.3, aLx: 1.1, aLe: 1.6 }]], { T: L.T }); cara(g, L.T, { expr: 'sus' }); attach(CLIP, g.aL.hand, [0, -.4, .3], [-.4, 0, 0], 1);
  orb(L.k, V(KNX + 9.5, 4.2, -13), null, [17, .3, .05, 44], [16, .25, .05, 44]); sh(V(KNX + 10, 0, -12), 14); }, [[0, 'boing_metal', .4]]);
// 13 «Dann bleibst du drin.»: sello rojo ABGELEHNT; lo empujan de vuelta
shot(15.54, 'C', null, L => { knast(L); const c = put(INS[5], KNX + 11 - L.lt * 3, 0, -12.9 + L.lt * 2, -.6); heightTo(c, 1.62); actuar(c, 0, [[0, { lean: -.3, aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1, aRe: 1 }]], { T: L.T }); cara(c, L.T, { expr: 'cry' });
  const g = put(WA[0], KNX + 13.5 - L.lt * 2.2, 0, -12 + L.lt * 1.4, -1.2); actuar(g, 0, [[0, PUSH]], { T: L.T }); cara(g, L.T, { expr: 'angry' });
  badge('red', 'ABGELEHNT', W / 2, H * .2, clamp(L.lt / .12), 1, 1.15); orb(L.k, V(KNX + 10, 4, -11), null, [18, -.2, .12, 44], [16, -.35, .1, 44]); sh(V(KNX + 10, 0, -11), 16); }, [[0, 'slam', .6], [.05, 'buzz', .4]]);
// 14 «Für immer.»: un preso muy viejo con barba blanca en la celda, telarañas; FÜR IMMER
shot(16.47, 'I', null, L => { zelleS(L, { tally: '∞', n: 14 }); const c = sit(dieter, ZEX - 3, 2.7, -7, 0, L, { headX: .4, aLx: .4, aRx: .4, aLe: .6, aRe: .6 }); cara(c, L.T, { expr: 'sleepy' });
  badge('red', 'FÜR IMMER', W / 2, H * .18, clamp((L.lt - .1) / .15), 1, 1.1); cm([ZEX - 2, 6, 12], [ZEX - 2.6, 5.4, 9], L.k); camera.lookAt(ZEX - 3, 4.6, -7); camera.fov = 42; sh(V(ZEX, 0, -4), 14); }, [[0, 'sad_tone', .5], [.1, 'drip', .3]]);
// 15 «Ich hatte Glück.»: yo (Ben) contra la pared de medir, sudando; la guardiana sube la escuadra
shot(17.15, 'W', null, L => { knast(L); const c = put(ben, KNX + 11, 0, -13.3, 0); actuar(c, 0, [[0, { headX: -.1, aLz: .05, aRz: .05 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T);
  const g = put(WA[1], KNX + 6, 0, -11.6, .9); actuar(g, 0, [[0, { aRx: 2.4, aRz: .3, aRe: .8 }]], { T: L.T }); cara(g, L.T, { expr: 'sus' });
  heightTo(c, 2.02); onFace(c, 9, -.3, .8, 42, L.k, 7.6); sh(V(KNX + 10, 0, -12), 14); }, [[0, 'heartbeat', .6]]);
// 16 «1,99.»: zoom lento a la coronilla: queda justo por encima de la raya roja; 1,99 m en verde
shot(17.61, 'F', 'slow', L => { knast(L); const c = put(ben, KNX + 11, 0, -13.3, 0); actuar(c, 0, [[0, { headX: -.05 }]], { T: L.T }); heightTo(c, 2.02); cara(c, L.T, { expr: 'worried', eyes: 'up', mouth: 'flat' }); sweat(c, L.T);
  cm([KNX + 13, 7.88, -4], [KNX + 11.8, 7.88, -8.4], L.k); camera.lookAt(KNX + 11, 7.88, -13.8); camera.fov = 40; badge('green', '1,99 m', W / 2, H * .19, clamp((L.lt - .9) / .2), 1, 1.1); sh(V(KNX + 11, 0, -12), 10); }, [[0, 'tick', .4]]);
// 17 «Ein einziger Zentimeter»: macro del hueco de 1 cm entre la coronilla y la raya
shot(19.11, 'C', 'punch', L => { knast(L); const c = put(ben, KNX + 11, 0, -13.3, 0); cara(c, L.T, { expr: 'gasp' }); heightTo(c, 2.02); cm([KNX + 12.6, 7.88, -8.6], [KNX + 12.2, 7.88, -9.8], L.k); camera.lookAt(KNX + 11, 7.88, -13.8); camera.fov = 34;
  badge('gold', '1 cm', W / 2, H * .2, clamp(L.lt / .15), 1, 1.1); sh(V(KNX + 11, 0, -12), 10); }, [[0, 'impact', .5], [.2, 'sparkle', .5]]);
// 18 «hat mein Leben gerettet.»: salto de alegría; los demás presos me miran con envidia
shot(20.32, 'Z', null, L => { knast(L); const j = Math.abs(Math.sin(L.lt * 7)); const c = put(ben, KNX + 9, j * 1.6, -9, .2); actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .4, aRz: .4, aLe: .2, aRe: .2, lLk: j * .8, lRk: j * .8 }]], { T: L.T }); grin(c, L.T);
  for (let i = 0; i < 3; i++) { const p = put(INS[10 + i], KNX + 1 + i * 3, 0, -4 + i, .8); actuar(p, 0, [[0, 'cross']], { T: L.T }); cara(p, L.T + i, { expr: 'sus' }); }
  orb(L.k, V(KNX + 8, 4.5, -9), null, [18, .2, .12, 44], [15, .05, .1, 44]); sh(V(KNX + 6, 0, -7), 20); }, [[0, 'cheer', .4], [.2, 'jump', .5], [.6, 'land', .4]]);
// 19 «Und das ist noch harmlos.»: la guardiana me corta la alegría: señala hacia la ciudad
shot(21.42, 'S', null, L => { knast(L); const c = put(ben, KNX + 9, 0, -9, .2); actuar(c, 0, [[0, { aLx: .4, aRx: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'confused' }); const g = put(WA[1], KNX + 5, 0, -6, .4); actuar(g, L.lt, [[0, 'idle'], [.15, 'point', { dur: .3 }]], { T: L.T }); cara(g, L.T, { expr: 'smug' });
  orb(L.k, V(KNX + 7, 4.6, -7.5), null, [16, -.6, .1, 44], [14, -.8, .1, 44]); sh(V(KNX + 7, 0, -7), 16); }, [[0, 'whoosh', .4]]);
// 20 «Denn Männer dürfen hier keine Meinung haben.»: asamblea en la plaza: un hombre levanta la mano para hablar; todas le chistan «PSST!»
shot(23.02, 'W', null, L => { town(L); const m = put(rolf, -4, 0, 6, PI); actuar(m, L.lt, [[0, { aRx: 2.8, aRz: .2, aRe: .3 }], [.9, { aRx: .3, aRe: .2, headX: .4, lean: .1 }, { dur: .3 }]], { T: L.T }); cara(m, L.T, { expr: L.lt < .9 ? 'happy' : 'sad', mouth: L.lt < .9 ? 'talk' : 'frown' });
  crowdAt(L, -4, -4, 10, 6, 14, 6, { face: V(-4, 0, 6), jit: .1, mode: i => i % 2 ? 'point' : 'idle', expr: 'angry' }); bubble(EX[3], 'PSST!', clamp((L.lt - .7) / .15)); POST.push(() => { if (EX[3].root.visible) cara(EX[3], L.T, { expr: 'angry', mouth: 'o' }); });
  orb(L.k, V(-4, 4.5, 4), null, [20, 2.2, .15, 46], [17, 2.4, .12, 44]); sh(V(-4, 0, 2), 22); }, [[0, 'crowd_run', .2], [.8, 'whisper', .7]]);
// 21 «Es gibt sogar ein Gesetz dafür:»: dos guardianas destapan el cartel de la ley en la plaza
shot(24.82, 'C', null, L => { town(L); show(LAW, 6, 0, -6, -.2); const k = clamp(L.lt / .5); show(CLOTH, 6 - .16, 13 - k * 8, -5.2, -.2); CLOTH.scale.set(1, Math.max(.05, 1 - k), 1); CLOTH.visible = k < .98;
  for (const s of [-1, 1]) { const g = put(WA[s < 0 ? 0 : 2], 6 + s * 10, 0, -3, -s * .6); actuar(g, 0, [[0, { aRx: lerp(2.6, .8, k), aLx: lerp(2.6, .8, k), lean: -.1 }]], { T: L.T }); cara(g, L.T, { expr: 'smug' }); }
  crowdAt(L, 6, 6, 8, 6, 14, 7, { mode: 'clap' }); orb(L.k, V(6, 10, -6), null, [36, -.1, .05, 46], [30, -.15, .02, 46]); sh(V(6, 0, -4), 28); }, [[0, 'cloth', .6], [.2, 'fanfare', .4]]);
// 22 «Kein Uterus, kein Urteil.»: zoom lento al cartel; delante, dos hombres leen y tragan saliva
shot(26.06, 'Z', 'slow', L => { town(L); show(LAW, 6, 0, -6, -.2); for (let i = 0; i < 2; i++) { const c = put([rolf, INS[6]][i], 2 + i * 6, 0, 3, PI - .2); actuar(c, 0, [[0, { headX: -.35, aLx: .2, aRx: .2 }]], { T: L.T }); cara(c, L.T + i, { expr: i ? 'shock' : 'worried' }); }
  cm([7, 9, 28], [6.6, 12.6, 10], L.k); camera.lookAt(6, 12.8, -6); camera.fov = 44; sh(V(6, 0, -2), 24); }, [[.1, 'gasp_old', .4]]);

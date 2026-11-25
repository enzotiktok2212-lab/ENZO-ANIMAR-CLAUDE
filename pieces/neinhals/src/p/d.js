// ---------- d: millones, el Schloss, la isla, Marco y el primer «NEIN» (147,47 – 175,6 s) ----------
// Schloss (X = 6600): puerta en (0, 0, 15,2); pórtico con columnas en z = 18…26 (tejado a y = 15,6); explanada z de 28 a 60; fuente en z = 48.
// Isla (X = 7600): isla de arena r ≈ 46 en (0, 0, 0), casita en (6, 2.6, 0). Banco (X = 9400).
const SCX_ = 6600, INX_ = 7600, BKX_ = 9400;
const CROWN = P_(new THREE.Group()); { const g = mat(0xffd23f, { metalness: .9, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .3 }); cyl(.8, .8, .5, g, 20, CROWN, 0, 0, 0); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; const t = new THREE.Mesh(new THREE.ConeGeometry(.22, .6, 6), g); t.position.set(Math.cos(a) * .72, .5, Math.sin(a) * .72); CROWN.add(t); sphere(.1, mat(0xd8202a, { roughness: .2 }), CROWN, Math.cos(a) * .8, .1, Math.sin(a) * .8, 6, 4); } }
const crown = c => attach(CROWN, c.head, [0, 1.45, 0], [0, 0, 0], 1);
function roofReset() { SC.DEB.forEach(p => { p.position.copy(p.userData.home); p.rotation.set(0, 0, 0); p.visible = true; }); }
// el tejado del pórtico salta en pedazos desde t0 (las piezas centrales)
function roofBurst(L, t0) { SC.DEB.forEach((p, i) => { const ix = Math.floor(i / 3), jz = i % 3; if (ix !== 1 && ix !== 2) return; const t = L.T - t0; if (t < 0) return; const r = RNG(i * 7 + 1); const h = p.userData.home; p.position.set(h.x + (ix === 1 ? -1 : 1) * (2 + r() * 3) * t, h.y + (14 + r() * 6) * t - 9 * t * t, h.z + (jz - 1) * (2 + r() * 2) * t); p.rotation.set(t * (3 + r() * 4), t * 2, t * (2 + r() * 3)); }); }
const sepia = (k = 1) => { grade.uniforms.sepia.value = k; grade.uniforms.vig.value = .7; };
// 101 «Am Ende der Woche»: la nave a pleno rendimiento: uno tras otro, los cuellos encogen sobre la plataforma; Luca en el panel
shot(147.47, 'F', null, L => { halleS(L); HA.on(1, L.T); HA.LASER.material.opacity = .4 + Math.sin(L.T * 30) * .15; const a = put(CR[0], MX, 2.3, MZ, .2); neck(a, lerp(26, 0, easeIn(clamp(L.lt / .9))), L.T); cara(a, L.T, { expr: 'joy', mouth: 'open_smile' }); actuar(a, L.lt, [[0, 'cheer']], { T: L.T });
  const c = put(luca, MX + 11, 0, 3, -2.4); actuar(c, L.lt, [[0, { aRx: 1.2, aRe: .6 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'grin' });
  for (let i = 0; i < 8; i++) { const p = put(CR[i + 1], MX + 6 + (i % 2) * 3, 0, 14 + i * 4.2, PI); neck(p, 14 + (i * 9) % 22, L.T, { bend: .3 }); actuar(p, L.lt, [[0, 'idle']], { T: L.T + i }); cara(p, L.T + i, { expr: 'happy' }); }
  cm([MX + 24, 12, 30, MX + 4, 10, MZ + 6, 52], [MX + 22, 12, 27, MX + 4, 10, MZ + 6, 50], L.k); sh(V(MX, 0, 0), 50); }, [[0, 'machine_hum', .5], [.1, 'zap', .4], [.6, 'cash_reg', .5]]);
// 102 «Millionen verdient.»: lluvia de billetes sobre Luca, que salta de alegría; «MILLIONEN»
shot(148.59, 'C', 'punch', L => { halleS(L); HA.on(1, L.T); const c = put(luca, MX + 6, Math.abs(Math.sin(L.T * 7)) * 1.2, 10, .2); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'open_smile', eyes: 'happy' }); billRain(V(MX + 6, 0, 10), L.T, 80, 18, 12, 18); FACES.push(c);
  badge('gold', 'MILLIONEN!', W / 2, H * .18, L.lt * 4, 1, 1.3); onBody(c, 18, -.2, .12, 48, L.k); sh(V(MX + 6, 0, 10), 30); }, [[0, 'money_rain', .7], [.1, 'cheer', .5], [.5, 'cash', .5]]);
// 103 «Einen Monat später»: en el banco, la pantalla muestra la cuenta de Luca: «1.000.000.000 €»
shot(149.78, 'W', null, L => { halleS(L); HA.on(1, L.T); const c = put(luca, MX + 5, 0, 12, .2); handyP(c, 1.4); const n = Math.floor(lerp(1e6, 1e9, easeIn(clamp(L.lt / 1.1)))); PH.userData.S.draw('acc' + Math.floor(n / 1e7), (cx, w, h) => drawBankApp(cx, w, h, n.toLocaleString('de-DE') + ' €', 'MEIN KONTO', '#5aff9a')); actuar(c, L.lt, [[0, 'phone_look']], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  badge('tag', '1 MONAT SPÄTER', W / 2, H * .14, L.lt * 4, 1, .9); PH.updateMatrixWorld(true); const p = wpos(PH), q_ = PH.getWorldQuaternion(new THREE.Quaternion()), nrm = V(0, 0, 1).applyQuaternion(q_); const d = lerp(5.4, 4.4, L.k); cam([p.x + nrm.x * d, p.y + nrm.y * d, p.z + nrm.z * d], [p.x, p.y, p.z], 44); camera.up.copy(V(0, 1, 0).applyQuaternion(q_)); camera.lookAt(p); DOF = 0; sh(V(MX + 5, 0, 12), 20); },
  [[0, 'whoosh_time', .5], [.2, 'counter_fast', .6], [1.0, 'ding_good', .5]]);
// 104 «bin ich der reichste Mensch der Welt.»: Luca con corona dorada en la plaza; confeti y vítores; «REICHSTER MENSCH DER WELT»
shot(151.12, 'F', 'punch', L => { town(L); const c = put(luca, 0, 0, 4, 0); crown(c); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'open_smile', eyes: 'happy' }); confetti(V(0, 0, 4), L.t0, L.T, 60, 1.2);
  crowdAt(L, 0, 4, 12, 7, 16, 104, { mode: i => i % 2 ? 'clap' : 'cheer', from: 0, face: V(0, 5, 4), neck: i => [2, 4, 1, 3, 2, 5, 1, 3, 4, 2, 3, 1][i] });
  badge('gold', 'REICHSTER MENSCH', W / 2, H * .16, L.lt * 4, 1, .95); badge('gold', 'DER WELT', W / 2, H * .22, (L.lt - .1) * 4, 1, .95); onBody(c, 16, 0, .12, 46, L.k, null, null, 4.4); sh(V(0, 0, 4), 30); }, [[0, 'fanfare', .6], [.1, 'confetti_pop', .5], [.2, 'crowd_cheer', .5]]);
// 105 «Ich kaufe mir ein riesiges Schloss,»: el castillo blanco de torres azules; Luca abre los brazos en la explanada
shot(152.48, 'Z', null, L => { schlossS(L); roofReset(); const c = put(luca, SCX_, 0, 40, PI); crown(c); actuar(c, L.lt, [[0, { aLx: 2.6, aRx: 2.6, aLz: .6, aRz: .6 }]], { T: L.T }); cara(c, L.T, { expr: 'joy' });
  const q = easeOut(L.k); cm([SCX_, 14, 118, SCX_, 24, 0, 52], [SCX_, 18, 100, SCX_, 26, 0, 52], q); sh(V(SCX_, 0, 20), 90); }, [[0, 'zoom_in', .4], [.1, 'angel_choir', .5], [.5, 'birds', .4]]);
// 106 «zwölf Sportwagen»: doce deportivos de colores en dos filas frente al castillo; la cámara pasa a ras de suelo; «12»
shot(153.96, 'W', null, L => { schlossS(L); roofReset(); WAGEN.forEach((w, i) => show(w, SCX_ + (i % 6 - 2.5) * 7.4, 0, 38 + Math.floor(i / 6) * 14, PI + (i % 2 ? .1 : -.1)));
  const x = lerp(-22, 12, easeInOut(L.k)); cam([SCX_ + x, 8, 82], [SCX_ + x * .3, 3, 46], 50); badge('gold', '12', W / 2, H * .2, L.lt * 4, 1, 1.6); sh(V(SCX_, 0, 58), 50); }, [[0, 'engine', .6], [.2, 'car_pass', .5], [.6, 'car_horn', .3]]);
// 107 «und meine eigene Insel.»: vista aérea de la isla turquesa; Luca saluda desde la playa
shot(155.04, 'F', null, L => { inselS(L); const c = put(luca, INX_ - 4, 3.2, 30, .2); crown(c); actuar(c, L.lt, [[0, 'wave']], { T: L.T }); cara(c, L.T, { expr: 'joy' }); IN.seaT.offset.set(L.T * .01, L.T * .006);
  const a = lerp(.3, -.1, L.k); cam([INX_ + Math.sin(a) * 120, lerp(80, 66, L.k), Math.cos(a) * 120], [INX_, 0, 6], 46); sh(V(INX_, 0, 0), 90); }, [[0, 'flash', .3], [.1, 'water', .5], [.4, 'birds', .4]]);
// 108 «Aber dann klingelt es an meinem Schloss.»: de cerca: un dedo pulsa el timbre dorado junto a la puerta; «DING DONG»
const BELL = P_(new THREE.Group()); { box(1.4, 2.2, .3, mat(0xf2c230, { metalness: .9, roughness: .2 }), .1, BELL, 0, 0, 0); cyl(.4, .4, .3, mat(0xfaf6ee), 16, BELL, 0, 0, .2).rotation.x = PI / 2; }
shot(156.65, 'S', null, L => { schlossS(L); roofReset(); show(BELL, SCX_ + 5.2, 6.5, 15.6, 0); const m = put(marco, SCX_ + 6.4, 0, 19.2, -2.8); neck(m, 0, L.T); const pr = clamp((L.lt - .25) / .2) * (L.lt < .9 ? 1 : 0); actuar(m, L.lt, [[0, { aRx: lerp(1.1, 1.45, pr), aRe: lerp(.8, .2, pr), aRz: -.3 }]], { T: L.T });
  badge('big', 'DING DONG', W / 2, H * .2, (L.lt - .45) * 4, 1, 1); const b = wpos(BELL); cm([b.x - 3.6, b.y + 1, b.z + 7, b.x + .4, b.y - .4, b.z, 42], [b.x - 3.2, b.y + .8, b.z + 6.2, b.x + .4, b.y - .4, b.z, 40], L.k); sh(V(SCX_ + 5, 0, 18), 15); }, [[0, 'swipe', .4], [.45, 'door_bell', .8]]);
// 109 «Und vor der Tür steht Marco.» (zoom lento): la puerta se abre: Marco, mayor y con su chaqueta azul, sonríe de lado
shot(158.43, null, 'slow', L => { schlossS(L); roofReset(); const m = put(marco, SCX_, 0, 27, PI); neck(m, 0, L.T); actuar(m, L.lt, [[0, 'cross']], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: 'grin' });
  cm([SCX_ + .5, 5.4, 16.8, SCX_, 5.2, 27, 44], [SCX_ + .4, 5.4, 20, SCX_, 5.4, 27, 40], easeIn(L.k)); sh(V(SCX_, 0, 24), 20); }, [[0, 'door_creak', .6], [.3, 'tension_str', .4]]);
// 110 «Der Junge, der mir früher immer das Pausenbrot geklaut hat.»: recuerdo en sepia: Marco le quita el Brezel a Luca en el patio
shot(160.01, 'B', null, L => { schuleS(L); sepia(1); const c = put(luca, SUX_ - 3, 0, 2, .7); actuar(c, L.lt, [[0, { aRx: .5, aRe: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'flat' });
  const m = put(marco, SUX_ + 3, 0, 3, -1.8); neck(m, 0, L.T); attach(BROT, m.aR.hand, [0, -.8, .4], [0, 0, 0], 1); actuar(m, L.lt, [[0, { aRx: lerp(1.4, 2.0, clamp(L.lt)), aRe: lerp(.3, 1.6, clamp(L.lt)) }]], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: 'grin' });
  orbit(V(SUX_, 5, 2.5), lerp(17, 15, L.k), .1, .08, 44); sh(V(SUX_, 0, 2), 25); }, [[0, 'memory_whoosh', .6], [.4, 'munch', .5], [1.2, 'laugh_teen', .4]]);
// 111 «„Hey, erinnerst du dich an mich?“»: Marco, en la puerta, se señala a sí mismo con chulería
shot(162.6, 'W', null, L => { schlossS(L); roofReset(); const m = put(marco, SCX_, 0, 27, PI); neck(m, 0, L.T); actuar(m, L.lt, [[0, { aRx: 1.1, aRz: -.4, aRe: 1.8 }]], { T: L.T }); talk(m, L.T, L.t0, L.t1, 'smug');
  onFace(m, 5.4, -.6, -1.0, 44, L.k); sh(V(SCX_, 0, 26), 20); }, [[0, 'whoosh_soft', .4], [.1, 'hey', .4]]);
// 112 «Krieg ich eine Million Euro?»: Marco alarga la mano abierta; «1.000.000 €?»
shot(164.0, 'C', null, L => { schlossS(L); roofReset(); const m = put(marco, SCX_, 0, 27, PI); neck(m, 0, L.T); actuar(m, L.lt, [[0, { aRx: 1.5, aRe: .1, aRz: .2 }]], { T: L.T }); talk(m, L.T, L.t0, L.t1, 'happy');
  badge('gold', '1.000.000 €?', W / 2, H * .2, (L.lt - .3) * 4, 1, 1.1); onBody(m, 8, .2, .08, 50, L.k); sh(V(SCX_, 0, 26), 20); }, [[0, 'thump', .3], [.4, 'cash', .4]]);
// 113 «Ich schaue ihn an.»: Luca, con su corona, bajo el pórtico, le mira tranquilo
shot(165.04, 'W', null, L => { schlossS(L); roofReset(); const c = put(luca, SCX_, 0, 22, 0); crown(c); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'neutral', mouth: 'flat' }); const m = put(marco, SCX_ + 3.4, 0, 28, PI); neck(m, 0, L.T);
  onFace(c, 7, 0, 0, 40, L.k); sh(V(SCX_, 0, 22), 20); }, [[0, 'whoosh_soft', .3], [.2, 'tension_tick', .4]]);
// 114 «Ich lächle.»: una sonrisa lenta
shot(166.14, null, null, L => { schlossS(L); roofReset(); const c = put(luca, SCX_, 0, 22, 0); crown(c); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: L.lt > .2 ? 'grin' : 'smile', eyes: 'squint' }); onFace(c, 6.2, 0, -.4, 40, L.k); sh(V(SCX_, 0, 22), 20); }, [[0, 'wink', .4]]);
// 115 «Und zum allerersten Mal sage ich:» (zoom lento): plano de los dos en la puerta; la viñeta se cierra
shot(166.87, 'W', 'slow', L => { schlossS(L); roofReset(); const c = put(luca, SCX_ - 1, 0, 22.5, .3); crown(c); actuar(c, L.lt, [[0, 'cross']], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grin' }); const m = put(marco, SCX_ + 3.4, 0, 28, PI - .4); neck(m, 0, L.T); actuar(m, L.lt, [[0, { aRx: 1.5, aRe: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'grin' });
  cm([SCX_ - 4, 5.5, 44, SCX_ + 1.6, 5.5, 25, 44], [SCX_ - 3.4, 5.5, 41, SCX_ + 1.6, 5.6, 25, 40], easeIn(L.k)); sh(V(SCX_, 0, 24), 20); }, [[0, 'heartbeat', .5]]);
// 116 «Nein!»: ¡golpe! primer plano de Luca: «NEIN!» enorme, destello
shot(168.78, 'C', 'punch', L => { schlossS(L); roofReset(); const c = put(luca, SCX_, 0, 22, 0); crown(c); actuar(c, L.lt, [[0, 'fists']], { T: L.T }); cara(c, L.T, { expr: 'shout', mouth: 'o' }); neck(c, grow(L.lt, .3, 0, 3, .3), L.T);
  grade.uniforms.flash.value = Math.max(0, .5 - L.lt * 2); FX2D.push(cx => { const k = spring(clamp(L.lt * 4)); cx.save(); cx.translate(W / 2, H * .2); cx.rotate(-.06); cx.scale(k * U, k * U); ntxt(cx, 'NEIN!', 0, 0, 200, '#ff2a3a', '#ffffff', 30); cx.restore(); });
  onFace(c, 6, 0, 0, 42); sh(V(SCX_, 0, 22), 20); }, [[0, 'impact', .7], [.02, 'shout_m', .5], [.3, 'stretch', .5]]);
// 117 «Mein Hals schießt durch das Dach»: contrapicado bajo el pórtico: el cuello sale disparado hacia arriba y revienta el tejado
shot(169.28, 'S', null, L => { schlossS(L); roofReset(); const c = put(luca, SCX_, 0, 22, 0); crown(c); const g = grow(L.lt, .05, 3, 70, .8); neck(c, g, L.T, { sway: .01 }); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'open_smile' }); roofBurst(L, L.t0 + .2);
  const m = put(marco, SCX_, 0, 27, PI); neck(m, 0, L.T); actuar(m, L.lt, [[0, 'shock']], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'o' });
  cam([SCX_ + 9, 3, 42], [SCX_, lerp(10, 24, easeOut(clamp(L.lt / .7))), 22], 62); sh(V(SCX_, 0, 22), 30); }, [[0, 'stretch', .9], [.2, 'wood_crack', .7], [.22, 'rubble', .6], [.3, 'explosion', .4]]);
// 118 «von meinem Schloss!»: plano general del castillo: los trozos de tejado caen y el cuello sube y sube hacia el cielo; Marco, diminuto, boquiabierto
shot(170.44, 'Z', null, L => { schlossS(L); roofReset(); const c = put(luca, SCX_, 0, 22, 0); crown(c); neck(c, lerp(70, 120, easeOut(L.k)), L.T, { sway: .01 }); cara(c, L.T, { expr: 'joy', mouth: 'open_smile' }); roofBurst(L, L.t0 - .96);
  const m = put(marco, SCX_, 0, 27, PI); neck(m, 0, L.T); actuar(m, L.lt, [[0, 'hands_head']], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'o' }); crowdAt(L, SCX_, 40, 6, 6, 14, 118, { mode: 'point', from: 0, face: V(SCX_, 40, 22), neck: i => [2, 8, 4, 12, 3, 6][i] });
  cm([SCX_ - 30, 10, 104, SCX_, 40, 10, 58], [SCX_ - 30, 14, 100, SCX_, 50, 10, 60], L.k); sh(V(SCX_, 0, 30), 80); }, [[0, 'whoosh_up', .6], [.2, 'rubble', .5], [.4, 'crowd_ohh', .5]]);
// 119 «Und zum ersten Mal in meinem Leben»: muy arriba, la cabeza de Luca (con corona) asoma sobre las nubes al atardecer, feliz; pájaros
shot(171.78, 'F', null, L => { schlossS(L); dusk(); const c = put(luca, SCX_, 0, 22, 0); crown(c); neck(c, 120, L.T, { sway: .012 }); cara(c, L.T, { expr: 'joy', mouth: 'open_smile', eyes: 'happy' }); const h = hp(c);
  CLOUDS.forEach((cl, i) => { const a = i / 14 * 6.283 * 2.3 + .4, r = 9 + (i % 4) * 9; show(cl, h.x + Math.cos(a) * r, h.y - 8 - (i % 3) * 1.5, h.z + Math.sin(a) * r, i, .7 + (i % 3) * .2); });
  BIRDSON = 1; const a = lerp(-.3, .2, L.k); cam([h.x + Math.sin(a) * 16, h.y + 2, h.z + Math.cos(a) * 16], [h.x, h.y - .5, h.z], 46); sh(h.clone().setY(0), 40); }, [[0, 'flash', .3], [.1, 'wind_soft', .5], [.4, 'happy_hum', .4], [.8, 'birds_evening', .4]]);
// 120 «bin ich richtig glücklich.»: la cámara se aleja: el cuello larguísimo desde el castillo hasta las nubes, confeti dorado y sol poniente
shot(173.26, 'W', null, L => { schlossS(L); dusk(); roofBurst(L, L.t0 - 3); const c = put(luca, SCX_, 0, 22, 0); crown(c); neck(c, 120, L.T, { sway: .012 }); cara(c, L.T, { expr: 'joy', mouth: 'open_smile', eyes: 'happy' }); const h = hp(c);
  CLOUDS.forEach((cl, i) => { const a = i / 14 * 6.283 * 2.3 + .4, r = 9 + (i % 4) * 9; show(cl, h.x + Math.cos(a) * r, h.y - 8 - (i % 3) * 1.5, h.z + Math.sin(a) * r, i, .7 + (i % 3) * .2); }); confRain(h.clone().add(V(0, -14, 0)), L.T, 60, 30, 30, 20);
  const q = easeInOut(L.k); cm([h.x, h.y + 2, h.z + 18, h.x, h.y - 1, h.z, 46], [SCX_ + 40, 70, 180, SCX_, 70, 10, 54], q); sh(V(SCX_, 0, 30), 90); }, [[0, 'whoosh_soft', .4], [.2, 'music_swell', .5], [.6, 'confetti', .4], [1.4, 'laugh_kid', .4]]);

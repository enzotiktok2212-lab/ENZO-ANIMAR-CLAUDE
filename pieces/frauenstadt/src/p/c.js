// ---------- c: «Aber ich war anders» — mis buenas obras, la cuenta atrás y la libertad (62,8 – 103,0 s) ----------
// Droguería (DRX): estanterías x = ±14 (z -15…7), caja en (0, 9). Gimnasio (THX): colchonetas en x -9…9, z -4/3; pancarta z = -21,7.
// Noche en Frauenstein: carretera x = 0 hacia +z (z > 65); farolas en x = ±34.
const SBP = n => [n, n === '10.000' ? '#5aff9a' : '#ffd23f'];
const halo = (c, T) => { const h = hp(c); show(HALO, h.x, h.y + 2.1 * (c.spec.scale || 1) + Math.sin(T * 3) * .08, h.z); HALO.rotation.set(PI / 2, 0, T); };

// 49 «Aber ich war anders.»: en el patio todos holgazanean; yo barro el suelo junto a una guardiana
shot(62.82, 'W', null, L => { knast(L, { sb: ['120 / 10.000'] }); yard(L, 6, { mode: i => ['sitb', 'idle', 'talk'][i % 3], expr: 'bored', from: 2 }); const c = put(ben, KNX + 4, 0, 2, -.5); actuar(c, 0, [[0, { aLx: 1.0, aRx: 1.2, aLz: -.2, aRz: -.4, aLe: .9, aRe: .9, lean: .2 + Math.sin(L.T * 8) * .05, twist: Math.sin(L.T * 8) * .25 }]], { T: L.T }); grin(c, L.T); POST.push(() => { const h = wpos(c.aR.hand); show(BROOM, h.x, 3.1, h.z + .4, 0); BROOM.rotation.set(.25, 0, Math.sin(L.T * 8) * .25); });
  orb(L.k, V(KNX + 3, 4, 2), null, [18, .5, .14, 46], [14, .3, .12, 44]); sh(V(KNX + 2, 0, 3), 22); }, [[0, 'brush', .6], [.4, 'whistle_inno', .4]]);
// 50 «Ich war praktisch die Mutter Teresa dieser Stadt.»: yo con una aureola dorada, rayos de luz; dos mujeres juntan las manos emocionadas
shot(63.98, 'Z', 'slow', L => { knast(L); const c = put(ben, KNX, 0, 4, 0); actuar(c, 0, [[0, { aLx: .5, aRx: .5, aLz: -.35, aRz: -.35, aLe: 1.6, aRe: 1.6, headX: -.15 }]], { T: L.T }); cara(c, L.T, { expr: 'relief' }); halo(c, L.T);
  for (const s of [-1, 1]) { const w = put(EX[s < 0 ? 4 : 2], KNX + s * 4.5, 0, 6.5, s < 0 ? .9 : -.9); actuar(w, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.5, aRz: -.5, aLe: 1.9, aRe: 1.9, headX: -.2 }]], { T: L.T }); cara(w, L.T, { expr: 'love' }); }
  hearts(V(KNX, 7, 4), L.t0, L.T, 6, .7); grade.uniforms.lift.value = .03 * L.k; orb(L.k, V(KNX, 5, 4), null, [18, 0, .1, 46], [12, 0, .06, 42]); sh(V(KNX, 0, 4), 16); }, [[0, 'choir', .6], [.3, 'sparkle', .5]]);
// 51 «Ich habe dafür gekämpft,»: en la plaza, yo con la pancarta «GRATIS BINDEN!» delante de una multitud de mujeres
shot(66.32, 'W', null, L => { town(L); const c = put(ben, 0, 0, 0, 0); const j = Math.abs(Math.sin(L.T * 6)); actuar(c, 0, [[0, { aRx: 2.7 + j * .2, aRe: .3, aLx: 1.2, aLz: .4, aLe: 1.6 }]], { T: L.T }); cara(c, L.T, { expr: 'shout' }); attach(PROTEST, c.aR.hand, [0, -.5, 0], [-PI / 2, 0, 0], 1);
  crowdAt(L, 0, -6, 14, 5, 16, 12, { mode: i => i % 2 ? 'cheer' : 'clap' }); orb(L.k, V(0, 6, 0), null, [24, .2, .05, 46], [20, .1, .02, 46]); sh(V(0, 0, -4), 26); }, [[0, 'crowd_run', .3], [.2, 'cheer', .5], [.6, 'shout_m', .3]]);
// 52 «dass Binden und Tampons»: estanterías rosa (BINDEN) y lila (TAMPONS) de la droguería
shot(67.50, 'C', null, L => { drogS(L); cm([DRX - 6, 5.6, 4], [DRX - 7.6, 5, -2], L.k); camera.lookAt(DRX - 12, 4.2, -6); camera.fov = 44; sh(V(DRX, 0, 0), 22); }, [[0, 'rummage', .5]]);
// 53 «bei dm und Rossmann»: la droguería llena: mujeres llenando las cestas felices
shot(68.54, 'S', null, L => { drogS(L); crowdAt(L, DRX, -3, 7, 3, 9, 13, { mode: i => ['cheer', 'talk', 'walk', 'clap'][i % 4], speed: 1.2 }); const k = put(EX[7], DRX - 9, 0, 4, -PI / 2); actuar(k, 0, [[0, { aRx: 1.8, aRe: .3, lean: .1 }]], { T: L.T }); grin(k, L.T);
  cm([DRX + 8, 9, 22], [DRX + 4, 8, 17], L.k); camera.lookAt(DRX - 2, 4, -6); camera.fov = 48; sh(V(DRX, 0, 0), 24); }, [[0, 'door_bell', .5], [.3, 'kids_laugh', .2], [.6, 'rummage', .4]]);
// 54 «komplett gratis sind.»: la cajera tacha el precio: 0,00 €; ella se lleva una caja gratis
shot(69.64, 'Z', 'punch', L => { drogS(L); const cs = put(EX[8], DRX - 2, 0, 6, 0); actuar(cs, 0, [[0, { aRx: 2.6, aRz: .3, aRe: .4 }]], { T: L.T }); cara(cs, L.T, { expr: 'joy' }); const cu = put(EX[9], DRX + 1.6, 0, 12.5, PI); actuar(cu, 0, [[0, { aLx: 1.4, aRx: 1.4, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); grin(cu, L.T);
  badge('green', '0,00 €', W / 2, H * .2, clamp(L.lt / .12), 1, 1.2); confetti(V(DRX, 2, 9), L.t0 + .1, L.T, 40, .8); orb(L.k, V(DRX, 4.6, 9), null, [16, .45, .14, 46], [14, .35, .12, 44]); sh(V(DRX, 0, 9), 16); }, [[0, 'cash_reg', .7], [.1, 'confetti', .5], [.3, 'cheer', .3]]);
// 55 «Dann habe ich mit Uber Nachtfahrten organisiert,»: de noche: un coche con «NACHTFAHRT 0 €» avanza por la calle iluminada
shot(71.05, 'W', null, L => { town(L, { night: true, statue: false }); show(TAXI, -3, 0, 124 - L.lt * 22, PI); crowdAt(L, -10, 104, 3, 2, 5, 14, { mode: 'walk', speed: 1.5 });
  cm([-12, 3.6, 62], [-11, 3.2, 70], L.k); camera.lookAt(-3, 3, 104 - L.lt * 16); camera.fov = 44; sh(V(4, 0, 100), 30); }, [[0, 'car', .6], [.4, 'crickets', .3]]);
// 56 «damit jede Frau nach zehn Uhr»: bajo una farola, una mujer mira el móvil: son las 22:00
shot(73.23, 'C', null, L => { town(L, { night: true, statue: false }); const w = put(hfrau, -6, 0, 80, .3); actuar(w, 0, [[0, 'phone_look']], { T: L.T }); cara(w, L.T, { expr: 'worried' }); attach(PHONE, w.aR.hand, [0, -.6, .4], [-.5, PI, 0], .8);
  badge('cyan', '22:00', W / 2, H * .2, clamp(L.lt / .15), 1, 1.1); onFace(w, 9, .4, 2.4, 44, L.k, 8); sh(V(-6, 0, 80), 14); }, [[0, 'owl', .3], [.3, 'notif', .5]]);
// 57 «kostenlos und sicher nach Hause kommt.»: el coche para; ella sube y se despide sonriendo; yo le hago el pulgar desde la acera
shot(74.69, 'S', null, L => { town(L, { night: true, statue: false }); const k = clamp(L.lt / .9); show(TAXI, -1, 0, lerp(96, 84, easeOut(k)), PI); const w = put(hfrau, -6 + k * 2.4, 0, 82, PI / 2); actuar(w, 0, [[0, k < 1 ? walkP(L.T, 0) : 'wave']], { T: L.T }); cara(w, L.T, { expr: 'happy' });
  const b = put(ben, -9, 0, 76, .7); actuar(b, 0, [[0, { aRx: 1.6, aRz: -.3, aRe: 1.6 }]], { T: L.T }); grin(b, L.T); badge('green', '0 €', W / 2, H * .2, clamp((L.lt - .4) / .15), 1, 1.1);
  orb(L.k, V(-4, 4, 82), null, [20, -.25, .12, 46], [17, -.1, .1, 46]); sh(V(-4, 0, 82), 20); }, [[0, 'car', .4], [.6, 'door_open', .5], [1.1, 'ding_soft', .5]]);
// 58 «Ich habe sogar Selbstverteidigung»: en el gimnasio, chicas practicando patadas sobre las colchonetas
shot(76.78, 'W', null, L => { hallS(L); for (let i = 0; i < 6; i++) { const c = EX[i * 2 + (i > 2 ? 1 : 0)], x = THX - 9 + (i % 3) * 9, z = -4 + Math.floor(i / 3) * 7; put(c, x, .7, z, 0); const kk = Math.max(0, Math.sin(L.T * 5 + i)); actuar(c, 0, [[0, { lRx: -1.6 * kk, lRk: .2, aLx: 1.3, aRx: 1.3, aLe: 2, aRe: 2, lean: -.15 * kk }]], { T: L.T }); cara(c, L.T + i, { expr: 'determined' }); }
  cm([THX + 12, 12, 22], [THX + 6, 10, 18], L.k); camera.lookAt(THX, 3, -2); camera.fov = 46; sh(V(THX, 0, 0), 24); }, [[0, 'whoosh', .5], [.4, 'kick', .5], [.8, 'kick', .5]]);
// 59 «als Schulfach durchgesetzt.»: la pancarta «SELBSTVERTEIDIGUNG · PFLICHTFACH»; la profe pita
shot(78.32, 'C', null, L => { hallS(L); const t = put(lehr, THX + 6, 0, -12, -.4); actuar(t, 0, [[0, { aRx: 2.3, aRz: -.5, aRe: 2.4, headX: -.1 }]], { T: L.T }); cara(t, L.T, { expr: 'determined', mouth: 'o' });
  cm([THX + 2, 8, 4], [THX + 1, 12, -2], L.k); camera.lookAt(THX, 16, -21.7); camera.fov = 46; sh(V(THX, 0, -10), 20); }, [[0, 'whistle', .7]]);
// 60 «Für jedes Mädchen.»: una fila de niñas pequeñas da un puñetazo al aire a la vez
shot(79.28, 'F', null, L => { hallS(L); for (let i = 0; i < 5; i++) { const c = i === 2 ? mia : EX[14 + i], x = THX - 5 + i * 2.5; put(c, x, .7, 0, 0); if (c !== mia) c.root.scale.setScalar(.6); const p = clamp((L.lt - .3) / .12); actuar(c, 0, [[0, { aRx: lerp(1.0, 1.6, p), aRe: lerp(2, .1, p), aLx: 1.0, aLe: 2, lean: .1 * p, lLx: -.3, lRx: .3 }]], { T: L.T }); cara(c, L.T + i, { expr: 'shout' }); }
  cm([THX, 3.6, 13], [THX, 3.3, 11], L.k); camera.lookAt(THX, 2.8, 0); camera.fov = 46; sh(V(THX, 0, 0), 16); }, [[.3, 'punch', .5], [.35, 'shout_m', .2]]);
// 61 «Ab der ersten Klasse.»: Mia (6) me lanza por encima del hombro y caigo de espaldas en la colchoneta
shot(80.66, 'Z', 'punch', L => { hallS(L); const m = put(mia, THX, .7, 0, 0); actuar(m, 0, [[0, { aLx: 2.6, aRx: 2.6, aLe: .6, aRe: .6, lean: .5 }]], { T: L.T }); cara(m, L.T, { expr: 'determined' });
  const k = easeInOut(clamp(L.lt / .6)); const b = put(ben, THX + lerp(0, 0, k), .7 + Math.sin(k * PI) * 5, lerp(-2.4, 3.8, k), 0); b.root.rotation.x = -k * PI * 1.05; actuar(b, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: .5, aRz: .5, lLx: -.5, lRx: .5 }]], { T: L.T }); cara(b, L.T, { expr: 'panic' });
  badge('gold', '1. KLASSE', W / 2, H * .18, clamp((L.lt - .6) / .15), 1, 1.1); dust(V(THX, .8, 4), L.t0 + .6, L.T, 8, .7); orb(L.k, V(THX, 4.6, 1), null, [24, 1.3, .2, 48], [21, 1.4, .16, 48]); sh(V(THX, 0, 1), 16); }, [[0, 'whoosh', .6], [.6, 'thud', .8], [.7, 'back_crack', .4]]);
// 62 «Und nein, ich habe das nicht nur wegen der Punkte gemacht.»: yo a cámara, serio, con la mano en el pecho; detrás el marcador sube
shot(81.96, 'S', null, L => { knast(L, { sb: [String(Math.round(lerp(6200, 7400, L.k))).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' / 10.000'] }); const c = put(ben, KNX - 18, 0, 4, .3); actuar(c, 0, [[0, { aRx: 1.2, aRz: -.6, aRe: 1.8, headY: Math.sin(L.T * 4) * .15 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  onBody(c, 15, 0, .1, 44, L.k, 12.5); sh(V(KNX - 18, 0, 2), 22); }, [[0, 'hum', .3]]);
// 63 «Okay.»: miro de reojo; una gota de sudor
shot(84.54, 'C', null, L => { knast(L); const c = put(ben, KNX - 18, 0, 4, .3); cara(c, L.T, { expr: 'side_r', mouth: 'grimace' }); sweat(c, L.T, 1); onFace(c, 6.6, 0, 0, 40, L.k, 6); sh(V(KNX - 18, 0, 4), 12); }, [[0, 'boing_metal', .3]]);
// 64 «Vielleicht ein bisschen.»: sonrisa pícara y el gesto de «un poquito» con los dedos
shot(85.17, 'I', null, L => { knast(L); const c = put(ben, KNX - 18, 0, 4, .3); actuar(c, 0, [[0, { aRx: 1.6, aRz: -.3, aRe: 1.2, headZ: .2 }]], { T: L.T }); grin(c, L.T); badge('gold', 'EIN BISSCHEN', W / 2, H * .2, clamp((L.lt - .2) / .15), 1, 1); onFace(c, 8, 0, 0, 42, L.k, 7); sh(V(KNX - 18, 0, 4), 12); }, [[0, 'pop', .5]]);
// 65 «Punkt für Punkt kam ich näher.»: el marcador corre de 8.000 a 9.990; yo lo miro con los puños apretados
shot(86.18, 'W', null, L => { const n = Math.round(lerp(8000, 9990, easeOut(L.k)) / 10) * 10; knast(L, { sb: [n.toLocaleString('de-DE') + ' / 10.000'] }); const c = put(ben, KNX - 18, 0, 6, PI - .3); actuar(c, 0, [[0, { ...GEST.fists, headX: -.4 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  cm([KNX - 10, 6, 22], [KNX - 13, 10, 16], L.k); camera.lookAt(KNX - 23, 15, -12); camera.fov = 46; sh(V(KNX - 20, 0, 0), 26); }, [[0, 'ticks', .5], [.6, 'count', .4]]);
// 66 «9.990.»: zoom lento al marcador: 9.990 / 10.000
shot(87.80, 'Z', 'slow', L => { knast(L, { sb: ['9.990 / 10.000'] }); cm([KNX - 17, 14, 14], [KNX - 21.5, 17.6, 2], L.k, easeIn); camera.lookAt(KNX - 24, 18, -12); camera.fov = 44; sh(V(KNX - 22, 0, 0), 30); }, [[0, 'heartbeat', .5]]);
// 67 «Mir fehlte nur noch eine einzige gute Tat.»: yo en la plaza buscando desesperado a quién ayudar; «+10?»
shot(90.10, 'C', null, L => { town(L); const c = put(ben, 0, 0, 10, Math.sin(L.T * 3) * .9); actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: .5, aRz: .5, aLe: 1, aRe: 1, headY: Math.sin(L.T * 5) * .4 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); sweat(c, L.T);
  crowdAt(L, 0, 4, 10, 8, 22, 15, { mode: 'walk', speed: 2 }); badge('gold', '+10 ?', W / 2, H * .2, clamp(L.lt / .15), 1, 1); orb(L.k, V(0, 4.5, 10), null, [18, .2, .2, 46], [15, -.2, .15, 44]); sh(V(0, 0, 8), 22); }, [[0, 'city_amb', .4], [.4, 'tick', .4]]);
// 68 «Dann hat eine Frau vor mir ihr Handy fallen lassen.»: el móvil cae a cámara lenta de su bolso al adoquín
shot(92.45, 'S', null, L => { town(L); const w = put(hfrau, 2 + L.lt * 2, 0, 4, PI / 2); actuar(w, 0, [[0, walkP(L.T, 0)]], { T: L.T }); cara(w, L.T, { expr: 'neutral' }); const f = clamp((L.lt - .3) / 1.2); const p = V(2.6 + .3 * L.lt, lerp(4.2, .2, easeIn(f)), 4.8);
  show(PHONE, p.x, p.y, p.z); PHONE.rotation.set(f * 4, f * 2, f * 3); if (f >= 1) PHONE.rotation.set(-PI / 2, 0, .4);
  const b = put(ben, -3, 0, 9, .6); actuar(b, 0, [[0, { aLx: .6, aRx: .6 }]], { T: L.T }); cara(b, L.T, { expr: 'gasp' });
  cm([6, 2, 14], [5, 1.6, 11], L.k); camera.lookAt(2.4, lerp(3, .6, L.k), 4.8); camera.fov = 42; sh(V(2, 0, 5), 14); }, [[.3, 'whoosh_down', .4], [1.5, 'glass_crack', .2], [1.55, 'thud', .5]]);
// 69 «Wenn ich es aufhebe:»: mi mano duda sobre el móvil
shot(94.69, 'C', null, L => { town(L); show(PHONE, 3.2, .2, 4.8); PHONE.rotation.set(-PI / 2, 0, .4); const b = put(ben, 3.2, 0, 8, PI); actuar(b, 0, [[0, { crouch: .4, lean: .55, aRx: 1.5 + Math.sin(L.T * 10) * .1, aRe: .4, headX: .4 }]], { T: L.T, weight: false }); cara(b, L.T, { expr: 'worried' }); sweat(b, L.T);
  cm([8, 3.2, 3.4], [7, 2.6, 4], L.k); camera.lookAt(3.2, 1.4, 5.6); camera.fov = 44; sh(V(3, 0, 6), 10); }, [[0, 'heartbeat', .5]]);
// 70 «zehn Punkte.»: imagino el marcador: +10 en verde
shot(95.44, 'Z', 'punch', L => { town(L); show(PHONE, 3.2, .2, 4.8); PHONE.rotation.set(-PI / 2, 0, .4); const b = put(ben, 3.2, 0, 8, PI); actuar(b, 0, [[0, { crouch: .4, lean: .55, aRx: 1.5, aRe: .4, headX: .2 }]], { T: L.T, weight: false }); grin(b, L.T);
  badge('green', '+10', W / 2, H * .22, clamp(L.lt / .12), 1, 1.3); onFace(b, 7, 0, 0, 42, L.k, 6); sh(V(3, 0, 6), 10); }, [[0, 'ding_soft', .7], [.05, 'coin_flip', .5]]);
// 71 «Oder 25 Jahre, wie mein Onkel.»: destello: el tío Rolf detrás de los barrotes, saludando triste
shot(96.41, 'R', null, L => { zelleS(L, { tally: '25 JAHRE', n: 25 }); const r = put(rolfJ, ZEX, 0, 5.6, 0); actuar(r, 0, [[0, { aLx: 2.0, aLz: .2, aLe: 1.4, aRx: 2.7, aRz: .3 + Math.sin(L.T * 8) * .3, aRe: .4 }]], { T: L.T }); cara(r, L.T, { expr: 'sad' }); tears(r, L.T);
  badge('red', '25 JAHRE', W / 2, H * .19, clamp((L.lt - .2) / .15), 1, 1.1); TINT = 'rgba(60,20,20,.18)'; orb(L.k, V(ZEX, 6, 5.6), null, [11, 0, .05, 42], [9, .1, .05, 42]); sh(V(ZEX, 0, 4), 12); }, [[0, 'metal_creak', .5], [.3, 'sad_tone', .5]]);
// 72 «Also habe ich gefragt:»: me acerco a la mujer con el móvil en alto, nervioso
shot(98.65, 'W', null, L => { town(L); const w = put(hfrau, 4, 0, 2, -.3); actuar(w, 0, [[0, { aLx: .4 }]], { T: L.T }); cara(w, L.T, { expr: 'confused' }); const b = put(ben, 1.4 + L.lt, 0, 6.4, PI - .6); actuar(b, 0, [[0, { aLx: .4, aRx: 1.3, aRe: .6 }]], { T: L.T }); cara(b, L.T, { expr: 'worried' }); attach(PHONE, b.aR.hand, [0, -.6, .3], [0, 0, 0], .8); sweat(b, L.T);
  orb(L.k, V(3, 4.6, 4), null, [16, 1.4, .12, 44], [13, 1.2, .1, 44]); sh(V(3, 0, 4), 14); }, [[0, 'steps', .4]]);
// 73 «Darf ich dir helfen?»: primer plano: lo pregunto (labios)
shot(99.63, 'C', null, L => { town(L); const b = put(ben, 2.6, 0, 6, PI - .5); actuar(b, 0, [[0, { aRx: 1.3, aRe: .6 }]], { T: L.T }); talk(b, L.T, 99.63, 100.21, 'worried'); attach(PHONE, b.aR.hand, [0, -.6, .3], [0, 0, 0], .8); bubble(b, 'Darf ich dir helfen?', clamp(L.lt / .12), 1.4);
  onFace(b, 7.2, 0, 1.2, 42, L.k, 6.4); sh(V(3, 0, 4), 12); }, [[0, 'breath', .3]]);
// 74 «Sie hat genickt.»: ella asiente despacio; la cámara se le acerca
shot(100.46, 'F', 'slow', L => { town(L); const w = put(hfrau, 4, 0, 2, -.6 + PI * 0); w.root.rotation.y = faceTo(V(4, 0, 2), V(2.6, 0, 6)); actuar(w, 0, [[0, { headX: .35 * Math.max(0, Math.sin(clamp(L.lt / .8) * PI * 2)) }]], { T: L.T }); cara(w, L.T, { expr: 'smile' });
  onFace(w, 8, 0, 0, 42, L.k, 6); sh(V(4, 0, 2), 12); }, []);
// 75 «Zehntausend.»: el marcador salta a 10.000 en verde; fuegos y confeti
shot(101.46, 'Z', 'punch', L => { knast(L, { sb: ['10.000 / 10.000', '#5aff9a', 'FREI!'] }); confRain(V(KNX - 24, 0, -6), L.T, 60, 30, 16, 26); cm([KNX - 14, 8, 22], [KNX - 18, 12, 16], L.k); camera.lookAt(KNX - 24, 17, -12); camera.fov = 48; sh(V(KNX - 22, 0, 0), 30); },
  [[0, 'firework', .6], [.05, 'magic_hit', .6], [.2, 'cheer', .5]]);
// 76 «Ich war frei.»: el portón se abre; salgo al sol con los brazos en alto
shot(102.18, 'C', null, L => { knast(L, { sb: ['10.000 / 10.000', '#5aff9a', 'FREI!'] }); gateAt(1 - L.lt / .4); const c = put(ben, KNX, 0, -12 + L.lt * 5, 0); actuar(c, 0, [[0, { ...walkP(L.T, 0), aLx: 2.9, aRx: 2.9, aLz: .4, aRz: .4, aLe: .2, aRe: .2 }]], { T: L.T }); laughF(c, L.T);
  grade.uniforms.flash.value = Math.max(0, .35 - L.lt); orb(L.k, V(KNX, 5, -10 + L.lt * 5), null, [18, 0, .05, 48], [15, 0, .05, 46]); sh(V(KNX, 0, -8), 18); }, [[0, 'metal_creak', .6], [.2, 'birds', .5]]);

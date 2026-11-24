// ---------- b: vecinos ricos y la ley (44,2 – 77,9 s) ----------
// Casa de Frau Huber: fachada este (x = 43) en z ≈ HZ. Bierzelt: mesas x ∈ {-26, 0, 26} (largo 18), z = -24 + 14·r, bancos a z ± 2,3, escenario en z = -46.
// Sportplatz: campo z ∈ ±35, tribuna en x = -31. Amtsstube: escritorio (0, -6), sillón (0, -11), vaso de agua (-3, 4.7, -4.4).
const HZ = LT.HS[10].position.z, HX = 43;
const ztFolk = (L, r, c, s, n, mode, from = 0, o = {}) => { const cx = BZX - 26 + c * 26, cz = -24 + r * 14 + s * 2.3; POST.push(() => { const list = (o.list || CR).filter(q => !q.root.visible).slice(from, from + n); list.forEach((q, i) => { const x = cx - (n - 1) * 1.8 + i * 3.6; put(q, x, 0, cz, s < 0 ? 0 : PI); crowdDrink(q, x, cz, L, i + r * 5 + c, o, typeof mode === 'function' ? mode(i) : mode); }); }); };
// banderas doradas «K» del alcalde en los tejados del lado oeste
const KFLAGS = []; for (let i = 0; i < 6; i++) { const g = P_(new THREE.Group()); cyl(.2, .2, 8, mat(0xd8a020, { metalness: .9 }), 6, g, 0, 4, 0); const f = textPlane(4, 2.6, 120, 78, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.fillStyle = '#8a1a1a'; c.font = `700 60px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('K', w / 2, h / 2 + 3); }); f.material.side = THREE.DoubleSide; f.position.set(2, 6.6, 0); g.add(f); KFLAGS.push(g); }
const kflags = (n, T) => KFLAGS.forEach((g, i) => { if (i >= n) return; const hp_ = LT.HS[i].position; show(g, hp_.x + 4, 27, hp_.z, PI / 2, 2.2); g.children[1].rotation.y = Math.sin(T * 3 + i) * .25; });

// 38 «Meine Nachbarin hat sich»: Frau Huber sale por la puerta de su casa con su Dirndl rojo y saluda
shot(44.21, 'F', null, L => { town(L, { bg: false }); const c = put(huber, HX - 2.6 - L.lt * 1.4, 0, HZ, -PI / 2); actuar(c, L.lt, [[0, { ...walkP(L.T, 0) }], [.35, 'wave', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' });
  crowdAt(L, HX - 12, HZ, 4, 6, 12, 51, { mode: 'walk', speed: 1.4 }); onBody(c, 15, 0, .12, 44, L.k, 12.5, -.15, 4); sh(V(HX - 4, 0, HZ), 20); }, [[0, 'door_open', .5], [.3, 'hello_f', .4], [.5, 'steps', .3]]);
// 39 «nach einem einzigen Abend auf dem Oktoberfest»: en el Bierzelt lleno, de pie en el banco, Frau Huber se bebe la Maß; todos brindan alrededor
shot(45.09, 'W', null, L => { zelt(L); const c = put(huber, BZX, 2.6, -22.3, 0); drink(c, L, L.t0 + .15, 1.1, { meter: true, expr: 'happy' }); meterOf(c).userData.set('47 Bier', '1,9 Mio. €', '#ffd23f');
  ztFolk(L, 0, 1, -1, 4, i => ['prost', 'drink'][i % 2], 0, { dx: 0 }); ztFolk(L, 0, 0, -1, 4, 'sitprost', 4); ztFolk(L, 0, 2, -1, 4, 'sitdrink', 8); ztFolk(L, 1, 0, -1, 3, 'sitdrink', 12); ztFolk(L, 1, 2, -1, 3, 'sitprost', 15);
  orbit(V(BZX, 10, -22.3), lerp(24, 19, easeOut(L.k)), -.45, -.12, 52); sh(V(BZX, 0, -24), 40); }, [[0, 'oompah', .6], [.2, 'crowd_cheer', .5], [.4, 'gulp_long', .5]]);
// 40 «eine Villa am See gekauft.»: delante de la villa del lago con el cartel VERKAUFT, ella hace sonar las llaves
shot(46.97, 'R', null, L => { seeS(L); const c = put(huber, SVX - 4, 0, -8, .2); actuar(c, 0, [[0, { aRx: 2.5, aRz: .2, aRe: .3 + Math.sin(L.T * 14) * .1, aLx: .4, aLz: .5 }]], { T: L.T }); attach(KEYS, c.aR.hand, [0, -.8, .3], [0, 0, Math.sin(L.T * 14) * .4], 1.2); grin(c, L.T);
  badge('gold', 'VILLA AM SEE', W / 2, H * .18, clamp((L.lt - .2) / .2), 1, .9); cm([SVX + 4, 9, 30, SVX - 1, 10, -16, 50], [SVX + 2, 8, 24, SVX - 2, 9.5, -16, 48], L.k); sh(V(SVX - 4, 0, -10), 40); DOF = 0; }, [[0, 'keys', .6], [.2, 'birds', .4], [.5, 'ding_soft', .4]]);
// 41 «Ihr Geheimtipp?»: se inclina hacia la cámara con el dedo en los labios
shot(48.58, 'C', null, L => { town(L, { bg: false }); const c = put(huber, HX - 4, 0, HZ, -PI / 2); actuar(c, 0, [[0, { aLx: 2.2, aLz: -.25, aLe: 2.3, lean: .22, headX: .1, headY: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'squint', mouth: 'smirk' });
  onFace(c, 5.6, 0, .4, 40, L.k, 4.8); sh(V(HX - 4, 0, HZ), 14); }, [[0, 'shh', .6]]);
// 42 «Paulaner.»: levanta una botella de Paulaner junto a su cara, destellos
shot(49.17, 'Z', 'punch', L => { town(L, { bg: false }); const c = put(huber, HX - 4, 0, HZ, -PI / 2); actuar(c, 0, [[0, { aRx: 2.3, aRz: -.1, aRe: 1.0, headY: -.15 }]], { T: L.T }); POST.push(() => { const h = c.aR.hand.localToWorld(V(0, -.6, .6)); show(BP, h.x, h.y - 1.2, h.z, 0, 1.3); BP.rotation.y = Math.atan2(camera.position.x - h.x, camera.position.z - h.z) + PI; }); cara(c, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' });
  confetti(hp(c).add(V(0, 1, 0)), L.t0, L.T, 20, .4); onFace(c, 6.6, .4, -.6, 40, L.k, 5.8); sh(V(HX - 4, 0, HZ), 14); }, [[0, 'magic_hit', .6], [.1, 'sparkle', .5]]);
// 43 «Es ist so süffig,»: bebe tranquila, con los ojos cerrados de gusto, en la terraza del café
shot(50.15, 'S', null, L => { town(L, { bg: false }); const c = sit2(huber, 34.5, -26, PI / 2, 3.0); drink(c, L, L.t0 + .05, 1.0, { sit: true, pose: SITP, meter: true, expr: 'happy', sip: true }); meterOf(c).userData.set('48 Bier', '2,2 Mio. €', '#ffd23f');
  crowdAt(L, 30, -16, 4, 6, 12, 53, { mode: 'sitdrink', seat: 3.0 }); dcam(c, L.k, 10, -.9, 4.4); sh(V(36, 0, -26), 16); }, [[0, 'whoosh_soft', .4], [.1, 'gulp_long', .5], [.9, 'ahh', .5]]);
// 44 «dass du eins nach dem anderen trinkst,»: ráfaga: las jarras vacías se van alineando en la mesa (1, 2, 3, 4…) mientras ella sigue bebiendo
shot(51.31, 'W', null, L => { town(L); const c = sit2(huber, -14, 47.7, 0); const per = .4, j = Math.floor(L.lt / per); drink(c, L, L.t0 + j * per - .05, per - .2, { sit: true, pose: SITP, meter: true, up: .08, dn: .08, expr: 'happy' });
  const n = 1 + j; for (let i = 0; i < Math.min(n + 1, 8); i++) { const m = KRUG[i]; show(m, -11.2 + i * 1.3, 4.15, 49.6, 0, 1); m.userData.level(0, 0); } badge('num', String(n + 47), W / 2, H * .18, 1, 1, 1);
  onBody(c, 15, -.5, .2, 44, L.k, 13, -.4, 4); sh(V(-14, 0, 49), 18); }, [[0, 'glass_down', .5], [.4, 'glass_down', .5], [.8, 'glass_down', .5], [1.2, 'glass_down', .5]]);
// 45 «ohne es zu merken.»: se da cuenta: una torre de jarras vacías delante; ojos como platos
shot(52.94, 'F', null, L => { town(L); const c = sit2(huber, -14, 47.7, 0); holdOnly(c, L, { sit: true, pose: { ...SITP, aLx: .9, aLz: .4, aLe: 1.6, headX: -.2 } }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  for (let i = 0; i < 12; i++) { const m = KRUG[i]; show(m, -11.4 + (i % 4) * 1.05, 4.15 + Math.floor(i / 4) * 1.32, 49.6, 0, 1); m.userData.level(0, 0); }
  onBody(c, 13, -.45, .16, 44, L.k, 11.5, -.35, 4.6); sh(V(-14, 0, 49), 16); }, [[0, 'record_scratch', .5], [.2, 'gasp', .5]]);
// 46 «Und genau das macht dich reich.»: lluvia de billetes sobre ella, que ríe con los brazos abiertos
shot(53.96, 'C', null, L => { town(L); const c = put(huber, -14, 0, 44, 0); actuar(c, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: .7, aRz: .7, aLe: .2, aRe: .2, headX: -.15 }]], { T: L.T }); laughF(c, L.T); meterOf(c).userData.set('60 Bier', '8,7 Mio. €', '#ffd23f');
  billRain(V(-14, 0, 44), L.T, 80, 20, 12, 18, 3); badge('gold', '8.700.000 €', W / 2, H * .18, clamp(L.lt / .2), 1, 1); crowdAt(L, -14, 44, 6, 6, 12, 55, { mode: 'clap' });
  onBody(c, 15, .1, .12, 46, L.k, 12.5, -.05, 4); sh(V(-14, 0, 44), 22); }, [[0, 'money_rain', .7], [.3, 'laugh_f', .5]]);
// 47 «Mein Sportlehrer hat»: Herr Brandl en la banda del campo, con chándal, pita con su silbato
shot(55.78, 'W', null, L => { sportS(L); const c = put(brandl, SPX - 22, 0, 4, PI / 2); actuar(c, 0, [[0, { aRx: 1.9, aRz: -.2, aRe: 2.0, lean: -.05, aLx: .3, aLz: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'o' }); brandl.whistle.rotation.x = -.8;
  crowdAt(L, SPX, 4, 6, 4, 16, 57, { mode: 'run', full: true, face: V(SPX + 30, 0, 4) }); onBody(c, 15, -.6, .12, 44, L.k, 12.5, -.5, 4.2); sh(V(SPX - 14, 0, 4), 30); }, [[0, 'whistle', .7], [.3, 'kick', .4], [.5, 'crowd_stadium', .4]]);
// 48 «in der Halbzeit ein paar Bier getrunken»: en el banquillo, durante el descanso, se bebe una Maß; marcador HALBZEIT
shot(56.88, 'S', null, L => { sportS(L); const c = sit2(brandl, SPX - 23, 2, PI / 2, 2.6); drink(c, L, L.t0 + .1, 1.0, { sit: true, pose: SITP, meter: true, expr: 'happy' }); meterOf(c).userData.set('3 Bier', '214 €');
  show(DS3, SPX - 31.5, 14, 2, PI / 2, .7); DS3.userData.draw('halbzeit', (cx, w, h) => { cx.fillStyle = '#0a0e14'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#ffd23f'; cx.font = `700 76px ${FONT}`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('HALBZEIT  0 : 0', w / 2, h / 2 + 4); });
  dcam(c, L.k, 11, -.9, 3.8); sh(V(SPX - 23, 0, 2), 18); }, [[0, 'whistle_half', .5], [.2, 'gulp', .5], [.8, 'ahh', .4]]);
// 49 «und aus Versehen»: su Bierzähler se dispara; escupe la cerveza del susto y se le cae el silbato
shot(58.44, 'Z', null, L => { sportS(L); const c = sit2(brandl, SPX - 23, 2, PI / 2, 2.6); holdOnly(c, L, { sit: true, pose: { ...SITP, aLx: .9, aLz: .6, aLe: .4, lean: -.15, headX: -.1, ...shiver(L.T, 1.5) } }); cara(c, L.T, { expr: 'shock', mouth: 'scream' });
  const n = lerp(3, 40, easeIn(clamp(L.lt / .9))); meterOf(c).userData.set(nBier(n) + ' Bier', euro(money(n)), '#ffd23f'); setHUD(n, '#ffd23f');
  onFace(c, 5.8, .1, .3, 40, L.k, 5); sh(V(SPX - 23, 0, 2), 14); }, [[0, 'spit_take', .6], [.15, 'counter_fast', .6]]);
// 50 «den ganzen Fußballverein gekauft.»: pancarta «NEUER BESITZER: HERR BRANDL»; los jugadores lo levantan
shot(59.37, 'R', null, L => { sportS(L); show(SBAN, SPX - 21, 9.5, 0, PI / 2, .8); const c = put(brandl, SPX - 12, 2.6 + Math.abs(Math.sin(L.T * 5)) * .6, 0, PI / 2); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5 }]], { T: L.T }); laughF(c, L.T);
  for (let i = 0; i < 4; i++) { const p = put(CR[10 + i], SPX - 12 + (i % 2 ? 1.6 : -1.6), 0, (i < 2 ? -1.4 : 1.4), PI / 2 + (i - 1.5) * .3); actuar(p, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .2, aRz: .2, aLe: .3, aRe: .3, crouch: Math.abs(Math.sin(L.T * 5 + i)) * .1 }]], { T: L.T }); laughF(p, L.T + i); }
  confetti(V(SPX - 12, 8, 0), L.t0, L.T, 50, 1.1); cm([SPX + 10, 8, 14, SPX - 18, 10, 0, 50], [SPX + 6, 9, 10, SPX - 18, 10, 0, 50], L.k); sh(V(SPX - 14, 0, 0), 30); }, [[0, 'crowd_cheer', .6], [.2, 'party_horn', .5]]);
// 51 «Und der Bürgermeister?»: el alcalde Kranzl en su sillón de piel, con su cadena de oro, levanta la Maß
shot(61.33, 'W', null, L => { amtS(L); const c = sit2(kranzl, AMX, -10.4, 0, 3.4); prost(c, L, .55, { sit: true, pose: { ...SITP, headY: Math.sin(L.T) * .1 }, meter: true }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); meterOf(c).userData.set('9.312 Bier', '4,1 Brd. €', '#ffd23f');
  cm([AMX + 2, 8, 4, AMX, 6.6, -10, 42], [AMX + 1.5, 7.8, 2, AMX, 6.6, -10, 40], L.k); sh(V(AMX, 0, -8), 18); }, [[0, 'whoosh_soft', .4], [.1, 'clock_tick', .4], [.4, 'chuckle_m', .5]]);
// 52 «Der hat seit 12 Jahren»: el calendario de la pared pasa de 2014 a 2026 mientras él bebe
shot(62.44, 'F', null, L => { amtS(L); const c = sit2(kranzl, AMX, -10.4, 0, 3.4); drink(c, L, L.t0, 1.0, { sit: true, pose: SITP, expr: 'happy' }); const y = Math.round(lerp(2014, 2026, easeInOut(clamp(L.lt / 1.0))));
  show(DS1, AMX + 6, 10.5, -13.5, 0, .55); DS1.userData.draw('y' + y, (cx, w, h) => { cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#d8202a'; cx.fillRect(0, 0, w, 70); cx.fillStyle = '#ffffff'; cx.font = `700 46px ${FONT}`; cx.textAlign = 'center'; cx.fillText('KALENDER', w / 2, 50); cx.fillStyle = '#1a1a1a'; cx.font = `700 150px ${FONT}`; cx.fillText(String(y), w / 2, 220); });
  badge('num', '12 JAHRE', W / 2, H * .18, clamp((L.lt - .5) / .2), 1, 1.1); cm([AMX + 3, 8.5, 6, AMX + 3, 8.2, -12, 46], [AMX + 3, 8.4, 4, AMX + 3, 8.2, -12, 44], L.k); sh(V(AMX + 3, 0, -8), 20); }, [[0, 'flash', .4], [.1, 'pages_flip', .6], [.5, 'pages_flip', .5]]);
// 53 «kein Glas Wasser mehr angefasst.»: aparta el vaso de agua con asco; aspa roja
shot(63.62, 'C', null, L => { amtS(L); const c = sit2(kranzl, AMX, -10.4, 0, 3.4); const k = easeOut(clamp((L.lt - .2) / .4)); actuar(c, 0, [[0, { ...SITP, aLx: 1.2, aLz: lerp(-.2, .6, k), aLe: .4, lean: -.15, headY: .4, headX: .1 }]], { T: L.T, weight: false }); holdMug(c); c.aR.sh.rotation.y = HOLDY; cara(c, L.T, { expr: 'angry', mouth: 'grimace' });
  AM.GLASS.position.x = -3 - k * 2.5; badge('red', '✕', W * .38, H * .36, clamp((L.lt - .5) / .2), 1, 1.6); cm([AMX - 2.4, 7.6, 5, AMX - 1.6, 6.2, -7, 42], [AMX - 2.4, 7.4, 3.6, AMX - 1.6, 6.2, -7, 40], L.k); sh(V(AMX, 0, -8), 14); }, [[0, 'glass_slide', .6], [.4, 'buzzer', .5], [.3, 'sigh', .4]]);
// 54 «Deshalb gehört ihm die halbe Stadt.»: vista aérea del pueblo: la mitad de los tejados con banderas doradas «K»
shot(65.25, 'S', null, L => { town(L); kflags(6, L.T); badge('gold', 'HALBE STADT', W / 2, H * .18, clamp(L.lt / .2), 1, 1); crowdAt(L, 0, 0, 10, 4, 30, 59, { mode: 'walk', full: true });
  cm([30, 70, 50, -40, 12, -6, 50], [24, 64, 38, -40, 12, -10, 50], L.k); sh(V(0, 0, -10), 70); DOF = 0; }, [[0, 'whoosh', .4], [.2, 'flag_flutter', .5], [.5, 'ding', .4]]);
// 55 «Aber Vorsicht.»: un coche de policía frena en la plaza con las luces encendidas
shot(66.99, 'Z', 'punch', L => { town(L, { bg: false }); show(POL, 4 + lerp(10, 0, easeOut(clamp(L.lt / .4))), 0, 8, -PI / 2, 1); TINT = Math.floor(L.T * 8) % 2 ? 'rgba(40,80,255,.16)' : 'rgba(255,30,40,.16)'; const p = put(COPS[0], -2, 0, 10, .3); actuar(p, 0, [[0, { aRx: 1.6, aRe: .2 }]], { T: L.T }); cara(p, L.T, { expr: 'angry', mouth: 'talk_wide' });
  crowdAt(L, 0, 6, 6, 8, 14, 61, { mode: 'shock' }); orbit(V(2, 4, 8), lerp(22, 18, L.k), .15, .12, 46); sh(V(2, 0, 8), 24); }, [[0, 'siren', .7], [.2, 'brakes', .6]]);
// 56 «Die Regierung versteht»: en el Biergeld-Ministerium, los funcionarios serios tras la mesa; pantalla «NULL TOLERANZ»
shot(67.88, 'W', null, L => { minS(L); MI.scr.userData.draw((cx, w, h) => { cx.fillStyle = '#1a2a4a'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#ff4a4a'; cx.font = `700 120px ${FONT}`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('NULL TOLERANZ', w / 2, h / 2 - 40); cx.fillStyle = '#ffffff'; cx.font = `700 52px ${FONT}`; cx.fillText('BEIM BIERZÄHLER', w / 2, h / 2 + 80); });
  BEA.forEach((b, i) => { const a = (i - 1) * .22; put(b, MIX + Math.sin(a) * 26 * .9, 0, -32 + Math.cos(a) * 26 - 6 - 2.6, -a); actuar(b, 0, [[0, 'cross']], { T: L.T }); cara(b, L.T + i, { expr: 'angry', mouth: 'flat' }); });
  cm([MIX, 9, 26, MIX, 9, -12, 50], [MIX, 9, 21, MIX, 9.5, -12, 48], L.k); sh(V(MIX, 0, -8), 26); }, [[0, 'whoosh_soft', .4], [.2, 'murmur', .3], [.5, 'pen_click', .4]]);
// 57 «da keinen Spaß.»: el funcionario del bigote da un puñetazo en la mesa
shot(68.68, 'C', 'punch', L => { minS(L); const b = put(BEA[0], MIX, 0, -8.6, 0); const k = clamp((L.lt - .15) / .12); actuar(b, 0, [[0, { aRx: lerp(2.2, 1.1, k), aRe: lerp(1.6, .3, k), lean: .2, headX: .1 }]], { T: L.T }); cara(b, L.T, { expr: 'angry', mouth: 'scream' }); if (L.lt > .27) SHAKE = Math.max(0, 1 - (L.lt - .27) / .3) * .8;
  onFace(b, 5.6, .2, .4, 40, L.k, 5); sh(V(MIX, 0, -8), 14); }, [[.27, 'fist', .9], [.3, 'impact', .6]]);
// 58 «Jeder trägt einen»: en la plaza, una policía cuelga Bierzähler al cuello de una fila de vecinos
shot(69.79, 'F', null, L => { town(L, { bg: false }); const p = put(COPS[1], -2.2, 0, 8.6, PI - .3); actuar(p, 0, [[0, { aRx: 1.6, aRz: -.1, aRe: .5, aLx: 1.6, aLe: .5 }]], { T: L.T }); cara(p, L.T, { expr: 'neutral' });
  for (let i = 0; i < 5; i++) { const c = put(CR[22 + i] || EX[i], -2 + i * 3.4, 0, 6 - i * .8, 0); actuar(c, 0, [[0, 'idle']], { T: L.T }); cara(c, L.T + i, { expr: 'worried' }); if (i < 1 + Math.floor(L.lt * 4)) meterOf(c).userData.set('0 Bier', '0 €'); }
  cm([3, 7, 24, 4, 5.4, 4.6, 46], [4, 7, 21, 4, 5.4, 4.6, 46], L.k); sh(V(4, 0, 6), 22); }, [[0, 'click_set', .5], [.25, 'click_set', .5], [.5, 'click_set', .5]]);
// 59 «Bierzähler am Hals,»: primer plano del Bierzähler colgado del cuello
shot(70.47, 'S', null, L => { town(L, { bg: false }); const c = put(CR[22] || EX[0], 0, 0, 6, -PI / 2 + PI / 2); actuar(c, 0, [[0, { headX: .35 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'down' }); const m = meterOf(c); m.userData.set('0 Bier', '0 €'); const mp = wpos(m);
  badge('tag', 'BIERZÄHLER', W / 2, H * .2, clamp(L.lt / .2), 1, 1); cm([mp.x + .6, mp.y + 1.4, mp.z + 5.6, mp.x, mp.y + .4, mp.z, 36], [mp.x + .4, mp.y + 1.2, mp.z + 4.4, mp.x, mp.y + .4, mp.z, 34], L.k); sh(V(0, 0, 6), 10); DOF = 0; }, [[0, 'beep', .5], [.3, 'hum', .3]]);
// 60 «und wer schummelt,»: de noche, el tipo de la gabardina y gafas de sol se escabulle con una botella escondida a la espalda
shot(71.70, 'R', null, L => { town(L, { night: true, bg: false }); const c = put(schum, -40 + L.lt * 3, 0, -30, PI / 2); actuar(c, 0, [[0, { ...walkP(L.T * .6, 0), lean: .3, crouch: .4, aRx: -.6, aRe: 1.3, aRz: .2, headY: Math.sin(L.T * 3) * .6 }]], { T: L.T }); attach(APF, c.aR.hand, [0, -.6, -.3], [PI, 0, 0], .9); cara(c, L.T, { expr: 'sus', eyes: 'side_l', mouth: 'smirk' });
  onBody(c, 13, -.7, .14, 44, L.k, 11, -.6, 4); sh(V(-36, 0, -30), 18); }, [[0, 'sneak', .6], [.3, 'owl', .3]]);
// 61 «landet sofort im Gefängnis.»: la reja de la celda se cierra de golpe; él se agarra a los barrotes
shot(72.52, 'C', 'punch', L => { zelleS(L); const c = put(schum, ZEX, 0, 5.6, 0); actuar(c, 0, [[0, { aLx: 1.9, aRx: 1.9, aLz: .25, aRz: .25, aLe: 1.3, aRe: 1.3, lean: .1 + Math.sin(L.T * 20) * .04 }]], { T: L.T }); cara(c, L.T, { expr: 'scream' }); if (L.lt < .3) SHAKE = .8;
  cm([ZEX + 1, 6.4, 18, ZEX, 5.6, 5, 44], [ZEX + .6, 6.2, 15, ZEX, 5.8, 5, 42], L.k); sh(V(ZEX, 0, 4), 16); }, [[0, 'slam', .9], [.1, 'chain_rattle', .6], [.5, 'scream_m', .4]]);
// 62 «Letzte Woche hat einer Apfelschorle»: en un callejón de noche, rellena la jarra con Apfelschorle a escondidas
shot(74.06, 'W', null, L => { town(L, { night: true, bg: false }); const c = put(schum, -38, 0, -30, PI / 2 - .3); const k = clamp(L.lt / .4); actuar(c, 0, [[0, { aLx: 1.3, aLz: -.1, aLe: .9, aRx: lerp(1.0, 1.6, k), aRz: -.4, aRe: .6, lean: .25, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'side_r', mouth: 'smirk' });
  attach(APF, c.aR.hand, [0, -.5, .4], [lerp(-.3, -2.0, k), 0, 0], .9); const m = mugOf(c); attach(m, c.aL.hand, [.84, -.2, -.72], [PI / 2, 0, 0], 1); m.userData.level(lerp(0, .8, clamp((L.lt - .3) / 1)), L.T);
  onBody(c, 11, -.5, .2, 42, L.k, 9.5, -.4, 4.4); sh(V(-36, 0, -30), 16); }, [[0, 'whoosh_soft', .4], [.2, 'pour', .7]]);
// 63 «in einen Bierkrug gefüllt.»: bebe… y su Bierzähler pita en rojo: BETRUG!; aparecen dos policías
shot(75.54, 'F', null, L => { town(L, { night: true, bg: false }); const c = put(schum, -38, 0, -30, PI / 2 - .3); drink(c, L, L.t0, .4, { meter: true, after: 'shock', afterMouth: 'scream' }); mugOf(c).userData.level(.6, L.T); meterOf(c).userData.set('BETRUG!', 'APFELSCHORLE', '#ff4a4a', 1);
  TINT = Math.floor(L.T * 8) % 2 ? 'rgba(255,30,40,.18)' : 'rgba(40,80,255,.14)'; badge('red', 'BETRUG!', W / 2, H * .2, clamp((L.lt - .6) / .2), 1, 1.2);
  COPS.forEach((p, i) => { put(p, -38 + 6 + i * 3, 0, -30 + (i ? 3 : -3) - lerp(4, 0, clamp((L.lt - .7) / .4)), -PI / 2); actuar(p, 0, [[0, { aRx: 1.7, aRe: .1 }]], { T: L.T }); cara(p, L.T, { expr: 'angry', mouth: 'talk_wide' }); });
  onBody(c, 13, -.4, .14, 44, L.k, 11, -.3, 4.4); sh(V(-36, 0, -30), 18); }, [[0, 'gulp', .5], [.5, 'alarm', .7], [.7, 'siren', .5]]);
// 64 «30 Jahre.»: en el tribunal la jueza da el mazazo: «30 JAHRE»
shot(76.84, 'C', 'punch', L => { gerS(L); const j = put(rich, GEX, 3.0, -12.4, 0); const k = clamp((L.lt - .12) / .1); actuar(j, 0, [[0, { aRx: lerp(2.6, 1.2, k), aRe: .3 }]], { T: L.T }); attach(GAVEL, j.aR.hand, [0, -.8, .4], [0, 0, 0], 1.2); cara(j, L.T, { expr: 'angry', mouth: 'talk' }); if (L.lt > .22) SHAKE = Math.max(0, 1 - (L.lt - .22) / .3);
  const d = put(schum, GEX + 5, 0, 4, PI - .4); actuar(d, 0, [[0, 'hands_head']], { T: L.T }); cara(d, L.T, { expr: 'cry' }); badge('red', '30 JAHRE', W / 2, H * .2, clamp((L.lt - .22) / .2), 1, 1.4);
  cm([GEX + 6, 9.5, 12, GEX + 2, 8.4, -6, 50], [GEX + 5, 9.5, 10, GEX + 2, 8.4, -6, 48], L.k); sh(V(GEX, 0, -4), 22); }, [[.22, 'gavel', 1], [.3, 'gasp', .4]]);

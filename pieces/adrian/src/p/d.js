// ---------- d: el Stadtfest, el grito, Detlef, la furgoneta, «Niemand!», la nueva regla, el final (95,91 – 133,9 s) ----------
const STG = V(-6, 3.2, -56.6);            // yo en el escenario (mirando +z)
const AUD = V(-6, 0, -40);                // centro del público
const VANP = V(26, 0, -66);               // furgoneta (morro al norte; puertas traseras hacia +z en z ≈ -59.3)
const onStage = (L, pose, face) => { const m = put(me, STG.x, STG.y, STG.z, 0); actuar(m, 0, [[0, pose]], { T: L.T }); cara(m, L.T, face); return m; };
const micIn = (c) => attach(ST.mic, c.aR.hand, [0, -.6, .35], [-1.2, 0, 0], 1.0);
// público: rejilla delante del escenario; mode 'turn' = de espaldas al escenario hasta turnAt
const audience = (L, o = {}) => crowdGrid(L, AUD.x, AUD.z - 6, 7, 5, 3.5, 3.4, { face: V(STG.x, 4, STG.z), jit: .15, seed: 11, ...o });
function vanLoad(L) { show(VAN, VANP.x, 0, VANP.z, PI); const W_ = (x, y, z) => V(VANP.x - x, y, VANP.z - z);
  [1, 2, 3, 4].forEach((i, k) => { const p = W_(-1.4 + k * .95, 1.82, -1.5 - k * .6); show(BIKES[i], p.x, p.y, p.z, PI / 2 + .1 * k, .62); });
  const b0 = W_(0, 1.82, -5.4); show(BIKES[0], b0.x, b0.y, b0.z, PI / 2, .62);
  LAPS.forEach((l, i) => { const p = W_(1.4, 1.9 + i * .2, 2.2); show(l, p.x, p.y, p.z, PI + (i % 2) * .2, .55); }); TVS.forEach((t, i) => { const p = W_(-1.2, 1.9 + i * 3.2, 3.0); show(t, p.x, p.y, p.z, PI, .55); }); }

// 77 «Am Abend, beim Stadtfest»: grúa sobre la plaza al atardecer: escenario, guirnaldas, puestos, el pueblo entero
shot(95.91, 'I', null, L => { town(L, { dusk: true, fest: true }); audience(L, { mode: 'cheer' });
  cm([28, 38, 30], [20, 26, 22], L.k); camera.lookAt(-6, 2, -40); camera.fov = 50; sh(V(-6, 0, -40), 40); }, [[0, 'cheer', .45], [.3, 'party_horn', .35]]);
// 78 «auf dem Marktplatz,»: el puesto de bratwurst: la gente come y ríe
shot(97.18, 'S', null, L => { town(L, { dusk: true, fest: true }); const s = V(-40, 0, -30); [EX[19], EX[20], KIDS[6]].forEach((c, i) => { const x = s.x + 6 + i * .3, z = s.z - 3 + i * 3; put(c, x, 0, z, -PI / 2 - .9 + i * .5);
    actuar(c, 0, [[0, { aRx: 1.9 + Math.sin(L.T * 4 + i) * .2, aRz: -.3, aRe: 2.1, aLx: .3 }]], { T: L.T }); laughF(c, L.T + i); });
  orb(L.k, V(s.x + 4, 3.6, s.z), null, [15, PI / 2 + .45, .12, 44], [13, PI / 2 + .3, .1, 44]); sh(s, 16); }, [[0, 'pan_sizzle', .45], [.4, 'laugh_m', .35]]);
// 79 «schnappte ich mir das Mikrofon»: subo al escenario y agarro el micrófono
shot(98.34, 'C', null, L => { town(L, { dusk: true, fest: true }); const m = onStage(L, { aRx: lerp(.6, 1.7, easeOut(clamp(L.lt / .3))), aRz: -.2, aRe: 1.5, aLx: .4, aLz: .3 }, { expr: 'determined' }); micIn(m);
  orb(L.k, V(STG.x, STG.y + 3.2, STG.z), null, [12, .25, -.08, 42], [10.5, .15, -.06, 42]); sh(STG, 14); }, [[0, 'steps', .4], [.3, 'click_metal', .55], [.5, 'radio', .3]]);
// 80 «und schrie:» (zoom lento): cojo aire
shot(99.46, 'Z', 'slow', L => { town(L, { dusk: true, fest: true }); const m = onStage(L, { aRx: 1.9, aRz: -.25, aRe: 1.7, aLx: .4, aLz: .3, lean: -.06, headX: -.08 }, { expr: 'determined', mouth: 'o' }); micIn(m);
  const h = hp(m); cm([h.x + .6, h.y + .2, h.z + 7], [h.x + .4, h.y + .1, h.z + 4.8], easeIn(L.k)); camera.lookAt(h.x, h.y - .7, h.z); camera.fov = 40; sh(STG, 12); }, [[0, 'breath', .5]]);
// 81 «Adrian!»: grito al micrófono; onda expansiva
shot(100.26, 'C', 'punch', L => { town(L, { dusk: true, fest: true }); const m = onStage(L, { aRx: 2.0, aRz: -.25, aRe: 1.6, aLx: .9, aLz: .9, aLe: .4, lean: -.12, headX: -.2 }, { expr: 'shout', eyes: 'angry', mouth: 'scream' }); micIn(m);
  ring(V(STG.x, STG.y + 4, STG.z + 1.5), L.t0, L.T, 14); bubble(m, 'ADRIAN!', clamp(L.lt / .08), 1.3);
  orbit(V(STG.x, STG.y + 3.4, STG.z), 9, -.15, .02, 44); sh(STG, 14); }, [[0, 'shout_crowd', .2], [0, 'boom', .45]]);
// 82 «Dreitausend Adrians»: desde detrás de mí: el público entero se gira hacia el escenario
shot(101.12, 'F', null, L => { town(L, { dusk: true, fest: true }); const m = onStage(L, { aRx: 1.6, aRz: -.25, aRe: 1.7, aLx: .4 }, { expr: 'determined' }); micIn(m);
  audience(L, { mode: 'turn', turnAt: L.t0 + .1, expr: 'shock', mouth: 'o' });
  cm([STG.x - 4, STG.y + 7.5, STG.z - 5], [STG.x - 3, STG.y + 7, STG.z - 4.5], L.k); camera.lookAt(AUD.x, 2.5, AUD.z); camera.fov = 52; badge('gold', '3000', W / 2, H * .15, clamp((L.lt - .1) / .15), 1, .95); sh(AUD, 30); }, [[0, 'whoosh_soft', .45], [.15, 'crowd_run', .45]]);
// 83 «drehten sich um.»: plano cenital: miles de caras mirando al escenario
shot(102.47, 'W', null, L => { town(L, { dusk: true, fest: true }); audience(L, { mode: 'turn', turnAt: L.t0 - 2, expr: 'shock', mouth: 'o' }); fireworks(V(-6, 10, -90), L.T, 3, 14);
  cm([AUD.x + 3, 30, STG.z + 2], [AUD.x + 2, 28, STG.z + 4], L.k); camera.lookAt(AUD.x, 0, AUD.z - 4); camera.fov = 52; sh(AUD, 30); }, [[0, 'murmur', .45], [.4, 'firework', .35]]);
// 84 «Alle, außer einem:» (zoom lento): todos mirando a cámara… salvo uno, de espaldas, al fondo
shot(103.47, 'S', 'slow', L => { town(L, { dusk: true, fest: true }); const dp = V(AUD.x + .2, 0, AUD.z + 4.6);
  audience(L, { mode: 'turn', turnAt: L.t0 - 3, expr: 'shock', mouth: 'o', skip: (x, z) => Math.hypot(x - dp.x, z - dp.z) < 2.6 });
  put(det, dp.x, 0, dp.z, PI); actuar(det, 0, [[0, { aLx: .2, aRx: .2 }]], { T: L.T }); cara(det, L.T, { expr: 'neutral' });
  cm([STG.x, STG.y + 4.4, STG.z + 3], [STG.x, STG.y + 3.6, STG.z + 7.5], easeIn(L.k)); camera.lookAt(dp.x, 3.6, dp.z); camera.fov = lerp(44, 34, easeIn(L.k)); sh(AUD, 26); }, [[0, 'heartbeat', .5]]);
// 85 «dem Neuen.»: él, de cara: sudando, pillado
shot(104.79, 'C', 'punch', L => { town(L, { dusk: true, fest: true }); const dp = V(AUD.x + .2, 0, AUD.z + 4.6); put(det, dp.x, 0, dp.z, 0); actuar(det, 0, [[0, { ...GEST.shock, headY: .2 }]], { T: L.T }); cara(det, L.T, { expr: 'shock', eyes: 'wide', mouth: 'grimace' }); sweat(det, L.T, 3);
  audience(L, { mode: 'turn', turnAt: L.t0 - 3, expr: 'shock', skip: (x, z) => Math.hypot(x - dp.x, z - dp.z) < 2.6 || z > dp.z - 1 });
  onFace(det, 5, .2, .3, 40, L.k, 4.4); sh(dp, 14); }, [[0, 'gasp', .5], [.1, 'sad_tone', .3]]);
// 86 «Polizist Adrian packte ihn.»: el policía le agarra del brazo
shot(105.54, 'W', null, L => { town(L, { dusk: true, fest: true }); const dp = V(AUD.x + 6, 0, AUD.z + 12); put(det, dp.x + 1.3, 0, dp.z, -.5); actuar(det, 0, [[0, { ...GEST.cower, headY: -.3 }]], { T: L.T }); cara(det, L.T, { expr: 'scared' }); sweat(det, L.T);
  put(pol, dp.x - 1.5, 0, dp.z - .4, .9); actuar(pol, 0, [[0, { aRx: 1.5, aRz: -.6, aRe: .5, aLx: 1.3, aLz: -.3, aLe: .6, lean: .1 }]], { T: L.T }); cara(pol, L.T, { expr: 'angry', mouth: 'grimace' });
  crowdAt(L, dp.x, dp.z - 2, 8, 5, 10, 86, { mode: 'point', gap: 1.1 });
  orb(L.k, V(dp.x, 3.2, dp.z), null, [12.5, .2, .1, 44], [11, .05, .08, 44]); sh(dp, 16); }, [[0, 'cloth', .55], [.2, 'slap', .4], [.5, 'murmur', .35]]);
// 87 «Wie heißt du wirklich?»: el policía, muy serio
shot(107.17, 'C', null, L => { town(L, { dusk: true, fest: true }); const dp = V(AUD.x + 6, 0, AUD.z + 12); const c = put(pol, dp.x - 1.5, 0, dp.z - .4, .9); actuar(c, 0, [[0, { aRx: 1.5, aRz: -.6, aRe: .5, lean: .1, headY: -.2 }]], { T: L.T }); talk(c, L.T, 107.1, 108, 'angry');
  onFace(c, 4.4, .2, -.4, 40, L.k, 3.9); sh(dp, 12); }, [[0, 'hmm', .35]]);
// 88 «Ähm…»: él suda, mira a un lado
shot(107.97, 'Z', null, L => { town(L, { dusk: true, fest: true }); const dp = V(AUD.x + 6, 0, AUD.z + 12); const c = put(det, dp.x + 1.3, 0, dp.z, -.5); actuar(c, 0, [[0, { aRx: 1.8, aRz: -.6, aRe: 2.2, headY: .3, headZ: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'side_r', mouth: 'wavy' }); sweat(c, L.T, 3);
  onFace(c, 4.2, .1, .3, 40, L.k, 3.6); sh(dp, 12); }, [[0, 'hmm', .45]]);
// 89 «Detlef.»: su placa ya dice la verdad: DETLEF
shot(108.97, 'C', 'punch', L => { town(L, { dusk: true, fest: true }); const dp = V(AUD.x + 6, 0, AUD.z + 12); const c = put(det, dp.x + 1.3, 0, dp.z, -.5); c.setTag('DETLEF'); actuar(c, 0, [[0, { aLx: .2, aRx: .2, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', eyes: 'down', mouth: 'frown' });
  bubble(c, 'Detlef…', clamp(L.lt / .1), 1.4); onBody(c, 6.8, .1, .06, 40, L.k, 6.2); sh(dp, 12); }, [[0, 'sad_tone', .45]]);
// 90 «Lieferwagen fanden wir alles.»: la furgoneta: se abren las puertas: bicis, portátiles, teles
shot(109.80, 'F', null, L => { town(L, { dusk: true, fest: true }); vanLoad(L); VAN.userData.setOpen(easeOut(clamp(L.lt / .45)));
  put(pol, VANP.x - 4.6, 0, VANP.z + 10.5, PI - .6); actuar(pol, 0, [[0, GEST.point]], { T: L.T }); cara(pol, L.T, { expr: 'shock', mouth: 'o' });
  put(me, VANP.x + 4.4, 0, VANP.z + 10.8, PI + .6); actuar(me, 0, [[0, GEST.shock]], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'open_smile' });
  cm([VANP.x + 1.5, 6.6, VANP.z + 22], [VANP.x + 1, 6, VANP.z + 19.5], L.k); camera.lookAt(VANP.x, 3.6, VANP.z + 3); camera.fov = 46; sh(V(VANP.x, 0, VANP.z + 6), 20); }, [[0, 'door_open', .6], [.4, 'ding_reveal', .45]]);
// 91 «Jedes Fahrrad, jeden Laptop»: los vecinos recuperan sus cosas, felices
shot(111.47, 'S', null, L => { town(L, { dusk: true, fest: true }); vanLoad(L); VAN.userData.setOpen(1); const p = V(VANP.x, 0, VANP.z + 14);
  const a = walkTo(EX[2], p.x - 2, p.z - 1, .4, 1.6, L, 0, 7); grin(a, L.T); attach(BIKES[1], a.aR.hand, [0, -2.0, .3], [0, PI / 2, 0], .6);
  const b = put(EX[3], p.x + 2.4, 0, p.z + 1, -.3); actuar(b, 0, [[0, GEST.hold]], { T: L.T }); laughF(b, L.T); attach(LAPS[0], b.aL.hand, [.4, -.4, .4], [0, 0, 0], .55);
  const c = put(EX[21], p.x + 5.5, 0, p.z - 2, -.6); actuar(c, 0, [[0, GEST.cheer]], { T: L.T }); laughF(c, L.T + 2);
  orb(L.k, V(p.x + 1.5, 3, p.z), null, [15, .1, .12, 46], [13, -.05, .1, 46]); sh(p, 18); }, [[0, 'wheels', .45], [.3, 'cheer', .4]]);
// 92 «und das Fahrrad von meinem Bruder.»: saco la bici verde pequeña de la furgoneta
shot(113.15, 'W', null, L => { town(L, { dusk: true, fest: true }); vanLoad(L); VAN.userData.setOpen(1); BIKES[0].visible = false; const p = V(VANP.x + .5, 0, VANP.z + 9.8);
  const m = put(me, p.x, 0, p.z, .2); actuar(m, 0, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.2, aRz: -.2, aLe: .5, aRe: .5, lean: -.05 }]], { T: L.T }); grin(m, L.T);
  show(BIKES[0], p.x + .3, .1 + Math.sin(L.T * 6) * .05, p.z + 2.2, PI / 2 + .2, .62);
  orb(L.k, V(p.x, 2.6, p.z + 1), null, [11, .4, .1, 42], [9.5, .25, .08, 42]); sh(p, 14); }, [[0, 'chain_rattle', .4], [.3, 'bell_far', .45]]);
// 93 «Mein Fahrrad!»: mi hermano abraza su bici; corazones
shot(114.74, 'C', null, L => { town(L, { dusk: true, fest: true }); const p = V(VANP.x - 3, 0, VANP.z + 14); show(BIKES[0], p.x, 0, p.z + 1.6, PI / 2, .62);
  const b = put(bru, p.x - .3, 0, p.z + .2, .1); actuar(b, 0, [[0, { aLx: 1.4, aRx: 1.4, aLz: -.6, aRz: -.6, aLe: .7, aRe: .7, lean: .15, crouch: .1 }]], { T: L.T }); laughF(b, L.T); hearts(V(p.x, 4.2, p.z), L.T);
  bubble(b, 'Mein Fahrrad!', clamp(L.lt / .1), 1.4); onBody(b, 9, .1, .12, 42, L.k, 8); sh(p, 12); }, [[0, 'bell_far', .5], [.2, 'kids_laugh', .4]]);
// 94 «Und dann fing die ganze Stadt an,»: el pueblo me sube a hombros
const shoulders = (L, p) => { const a = put(EX[22], p.x - 1.2, 0, p.z, 0), b = put(EX[23], p.x + 1.2, 0, p.z, 0); [a, b].forEach((c, i) => { actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: i ? .2 : -.1, aRz: i ? -.1 : .2, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(c, L.T + i); });
  const m = put(me, p.x, 5.6 + Math.abs(Math.sin(L.T * 5)) * .3, p.z - .3, 0); return m; };
shot(115.79, 'Z', null, L => { town(L, { dusk: true, fest: true }); const p = V(AUD.x, 0, AUD.z + 4); const m = shoulders(L, p); actuar(m, 0, [[0, { lLx: 1.4, lRx: 1.4, lLk: 1.3, lRk: 1.3, aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5 }]], { T: L.T }); laughF(m, L.T);
  crowdAt(L, p.x, p.z, 14, 4, 11, 94, { mode: 'cheer', gap: 1.0 });
  orb(L.k, V(p.x, 5.4, p.z), null, [17, .15, .06, 46], [15, 0, .05, 46]); sh(p, 18); }, [[0, 'cheer', .55], [.4, 'crowd_run', .35]]);
// 95 «meinen Spitznamen zu rufen:»: los niños levantan la pancarta NIEMAND… ahora con orgullo
shot(117.35, 'S', null, L => { town(L, { dusk: true, fest: true }); const p = V(AUD.x - 10, 0, AUD.z + 6); show(NSIGN, p.x, 1.6, p.z, 0, .9); [KIDS[8], KIDS[9]].forEach((k, i) => { put(k, p.x + (i ? 3.06 : -3.06), Math.abs(Math.sin(L.T * 7 + i)) * .3, p.z - .6, 0); actuar(k, 0, [[0, { aLx: 2.5, aRx: 2.5, aLe: .4, aRe: .4 }]], { T: L.T }); laughF(k, L.T + i); });
  crowdAt(L, p.x, p.z - 2, 8, 4, 9, 95, { mode: 'cheer', from: 10, gap: 1.2 }); hearts(V(p.x, 8, p.z), L.T);
  orb(L.k, V(p.x, 5, p.z), null, [17, -.1, .06, 46], [15, 0, .05, 46]); sh(p, 18); }, [[0, 'cheer', .5], [.4, 'kids_laugh', .35]]);
// 96 «Niemand!»: yo a hombros, brazos arriba, confeti
shot(118.76, 'C', 'punch', L => { town(L, { dusk: true, fest: true }); const p = V(AUD.x, 0, AUD.z + 4); const m = shoulders(L, p); actuar(m, 0, [[0, { lLx: 1.4, lRx: 1.4, lLk: 1.3, lRk: 1.3, ...GEST.cheer }]], { T: L.T }); laughF(m, L.T); confetti(V(p.x, 4, p.z), L.t0, L.T, 60, 1);
  const h = hp(m); cm([h.x + 1, h.y - 2.4, h.z + 8.5], [h.x + .8, h.y - 2.2, h.z + 7.6], L.k); camera.lookAt(h.x, h.y - .8, h.z); camera.fov = 44; sh(p, 14); }, [[0, 'shout_crowd', .5], [.1, 'confetti', .45]]);
// 97 «Niemand!»: el público grita, plano bajo
shot(119.48, 'C', 'punch', L => { town(L, { dusk: true, fest: true }); const p = V(AUD.x + 8, 0, AUD.z + 10); crowdGrid(L, p.x, p.z, 4, 2, 3.4, 3.2, { mode: 'shout', list: [...KIDS.slice(2), ...EX], face: V(p.x, 3, p.z + 20), seed: 97 });
  cm([p.x, 2.2, p.z + 8.5], [p.x, 2.2, p.z + 7.8], L.k); camera.lookAt(p.x, 4, p.z); camera.fov = 52; fireworks(V(p.x, 10, p.z - 60), L.T, 3, 14); sh(p, 16); }, [[0, 'shout_crowd', .5], [.3, 'firework', .4]]);
// 98 «Niemand!»: vista aérea con fuegos artificiales
shot(120.20, 'C', 'punch', L => { town(L, { dusk: true, fest: true }); audience(L, { mode: 'cheer', face: V(AUD.x, 4, AUD.z + 30) }); fireworks(V(-6, 6, -70), L.T, 3, 16);
  cm([AUD.x - 14, 26, AUD.z + 34], [AUD.x - 12, 24, AUD.z + 31], L.k); camera.lookAt(AUD.x, 6, AUD.z - 14); camera.fov = 52; sh(AUD, 30); }, [[0, 'firework', .5], [.2, 'cheer', .45]]);
// 99 «Danach hat die Stadt über eine»: al día siguiente, en la plaza: la pizarra NEUE REGEL
shot(120.98, 'F', null, L => { town(L); RB.visible = true; const p = V(-6, 0, -60); put(pol, p.x + 5, 0, p.z - 2, -.4); actuar(pol, 0, [[0, { ...GEST.point, aRx: 1.9 }]], { T: L.T }); talk(pol, L.T, 120.9, 122, 'talk');
  crowdAt(L, p.x, p.z + 4, 10, 5, 12, 99, { mode: 'idle', expr: 'happy', face: V(p.x, 4, p.z - 6), gap: 1.2 });
  orb(L.k, V(p.x + 1.5, 5.5, p.z - 4), null, [20, .1, .08, 46], [18, 0, .06, 46]); sh(p, 20); }, [[0, 'chalk', .45], [.4, 'murmur', .35]]);
// 100 «neue Regel abgestimmt:»: todos levantan la mano; la pizarra: JA ✓; votos a la urna
shot(122.05, 'W', null, L => { town(L); RB.visible = true; RB.userData.set(L.k > .4 ? 1 : 0); URN.visible = true; const p = V(-6, 0, -60);
  crowdGrid(L, p.x, p.z + 8, 6, 3, 3.6, 3.2, { mode: 'wave', face: V(p.x, 4, p.z - 6), seed: 100 });
  cm([p.x + 6, 7, p.z + 24], [p.x + 4, 7, p.z + 22], L.k); camera.lookAt(p.x, 5, p.z - 3); camera.fov = 48; sh(V(p.x, 0, p.z + 6), 22); }, [[0, 'cloth', .45], [.45, 'ding_soft', .45], [.6, 'cheer', .35]]);
// 101 «Jeder muss sich einen anderen»: Papa con una placa nueva en blanco y un rotulador, pensando
shot(123.28, 'S', null, L => { town(L); const p = V(10, 0, 20); const c = put(papa, p.x, 0, p.z, .1); c.setTag(null); actuar(c, 0, [[0, { aLx: 1.3, aLz: -.4, aLe: 1.0, aRx: 1.9, aRz: -.5, aRe: 2.3, headZ: .15 }]], { T: L.T }); cara(c, L.T, { expr: 'confused', eyes: 'up', mouth: 'wavy' });
  const lh = wpos(c.aL.hand); show(TAGBIG, lh.x + .3, lh.y + .7, lh.z + .6, .1, .45); TAGBIG.userData.set('?'); const rh = wpos(c.aR.hand); show(PEN, rh.x, rh.y + .3, rh.z + .2, 0, .8);
  onBody(c, 9, .1, .08, 42, L.k, 8); sh(p, 12); }, [[0, 'hmm', .45], [.4, 'pencil', .35]]);
// 102 «Namen aussuchen,»: la profesora y Mama piensan también
shot(124.30, 'Z', null, L => { town(L); const p = V(14, 0, 30); [[lehr, -1.8, .3], [mama, 1.8, -.3]].forEach(([c, dx, ry], i) => { put(c, p.x + dx, 0, p.z, ry); c.setTag(null); actuar(c, 0, [[0, GEST.think]], { T: L.T + i }); cara(c, L.T + i, { expr: 'confused', eyes: 'up' }); });
  badge('q', '?', W / 2, H * .17, clamp(L.lt / .12), 1, .9); orb(L.k, V(p.x, 3.4, p.z), null, [12, .05, .1, 42], [10.5, 0, .08, 42]); sh(p, 14); }, [[0, 'hmm', .4], [.5, 'pencil', .35]]);
// 103 «damit sich nie wieder ein Dieb»: Detlef, esposado junto al coche patrulla
shot(125.26, 'C', null, L => { town(L); const p = V(26, 0, 26); const c = put(det, p.x, 0, p.z, -.4); c.setTag('DETLEF'); actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: -.6, aRz: -.6, aLe: .4, aRe: .4, headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'angry', eyes: 'down', mouth: 'frown' });
  put(pol, p.x + 2.4, 0, p.z - .6, -.9); actuar(pol, 0, [[0, { aLx: 1.2, aLz: -.4, aLe: .5 }]], { T: L.T }); cara(pol, L.T, { expr: 'smug', mouth: 'smirk' });
  onBody(c, 9, .05, .08, 42, L.k, 8); sh(p, 14); }, [[0, 'chain_rattle', .5], [.3, 'siren', .3]]);
// 104 «verstecken kann.»: el coche patrulla se lo lleva; la gente despide
shot(126.29, 'W', null, L => { town(L); PCAR.position.set(30 - L.lt * 12 * Math.sin(.6), 0, 20 - L.lt * 12 * Math.cos(.6)); PCAR.rotation.y = PI - .6;
  crowdAt(L, 22, 34, 8, 3, 8, 104, { mode: 'wave', gap: 1.4 });
  cm([16, 6, 50], [14, 6, 46], L.k); camera.lookAt(26, 2.5, 12); camera.fov = 46; sh(V(26, 0, 20), 22); }, [[0, 'siren', .45], [.2, 'car_pass', .5]]);
// 105 «Und alle haben Müller gewählt.»: todos se pegan la placa nueva: MÜLLER
shot(127.33, 'F', null, L => { town(L); const p = V(-8, 0, 14); crowdAt(L, p.x, p.z, 18, 3, 12, 105, { mode: 'cheer', tag: 'MÜLLER', full: true }); put(EX[0], p.x, 0, p.z + 3, 0); EX[0].setTag('MÜLLER'); actuar(EX[0], 0, [[0, { aRx: 1.0, aRz: -.75, aRe: 2.0, aLx: 2.7, aLz: .4 }]], { T: L.T }); grin(EX[0], L.T);
  confRain(V(p.x, 0, p.z), L.T, 50, 22, 18, 16); orb(L.k, V(p.x, 3.4, p.z + 3), null, [12, .1, .12, 44], [10, 0, .1, 44]); sh(p, 18); }, [[0, 'tape', .5], [.3, 'cheer', .5]]);
// 106 «Deshalb heißt jetzt in dieser Stadt»: el cartel de la entrada, recién pintado: 3000 Müllers
shot(128.86, 'S', null, L => { town(L); WS.userData.set('Müllers'); const c = V(12, 6.1, 240), r = .25;
  [[KIDS[10], -4.2], [KIDS[11], 4.2]].forEach(([p, dx], i) => { const x = c.x + Math.cos(r) * dx + Math.sin(r) * 3, z = c.z - Math.sin(r) * dx + Math.cos(r) * 3; put(p, x, 0, z, r); p.setTag('MÜLLER'); actuar(p, 0, [[0, GEST.cheer]], { T: L.T + i }); laughF(p, L.T + i); });
  orb(L.k, c, null, [24, .2, .04, 42], [27, .28, .05, 42]); sh(c, 26); }, [[0, 'brush', .5], [.4, 'ding_soft', .4]]);
// 107 «jeder Müller.»: Mama, Papa, la profe, mi hermano, el policía… todos con MÜLLER; el perro también
shot(130.24, 'C', 'punch', L => { town(L); const p = V(14, 0, 100); [[mama, -3.6, 0], [papa, -1.2, -.7], [lehr, 1.2, -.7], [pol, 3.6, 0]].forEach(([c, dx, dz], i) => { put(c, p.x + dx, 0, p.z + dz, -dx * .06); c.setTag('MÜLLER'); actuar(c, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9 + i) * .3, aRe: .4 }]], { T: L.T }); grin(c, L.T + i); });
  put(bru, p.x - .3, 0, p.z + 2.2, 0); bru.setTag('MÜLLER'); actuar(bru, 0, [[0, GEST.cheer]], { T: L.T }); laughF(bru, L.T); show(DOG, p.x + 2.6, 0, p.z + 2.6, -.3, .7); wag2(L.T);
  orb(L.k, V(p.x, 3.4, p.z), null, [17, 0, .1, 46], [15, 0, .08, 46]); sh(p, 16); }, [[0, 'cheer', .5], [.2, 'bark', .45]]);
const wag2 = T => { DOG.position.y = Math.abs(Math.sin(T * 7)) * .15; DOG.rotation.y += Math.sin(T * 14) * .08; };
// 108 «Und ich überlege,»: yo, pensativo, entre tanto Müller
shot(131.19, 'W', null, L => { town(L); const p = V(-10, 0, 24); const m = put(me, p.x, 0, p.z, .15); actuar(m, 0, [[0, GEST.think]], { T: L.T }); cara(m, L.T, { expr: 'sus', eyes: 'side_l', mouth: 'wavy' });
  crowdAt(L, p.x, p.z, 10, 4.5, 10, 108, { mode: 'idle', tag: 'MÜLLER', expr: 'happy' });
  onBody(m, 9.5, .1, .08, 42, L.k, 8.5); sh(p, 14); }, [[0, 'hmm', .45], [.6, 'tick', .35]]);
// 109 «meinen Namen in Adrian zu ändern.»: me pego la placa ADRIAN y guiño a cámara
shot(132.50, 'Z', null, L => { town(L); const p = V(-10, 0, 24); const m = put(me, p.x, 0, p.z, .15); const on = L.lt > .45; m.setTag(on ? 'ADRIAN' : null);
  actuar(m, L.lt, [[0, { aLx: 1.2, aLz: -.6, aLe: 1.6 }], [.45, { aLx: .9, aLz: -.75, aLe: 2.0, aRx: 2.7, aRz: .5, aRe: .3 }, { dur: .2 }]], { T: L.T }); cara(m, L.T, on ? { expr: 'wink', eyes: 'wink', mouth: 'smirk' } : { expr: 'smug' });
  if (!on) { const lh = wpos(m.aL.hand); show(TAGBIG, lh.x + .2, lh.y + .6, lh.z + .5, .15, .3); TAGBIG.userData.set('ADRIAN'); }
  crowdAt(L, p.x, p.z, 10, 4.5, 10, 108, { mode: 'idle', tag: 'MÜLLER', expr: 'happy' });
  onBody(m, 8.5, .1, .06, 40, L.k, 6.8); sh(p, 14); }, [[.45, 'tape', .55], [.6, 'ding_reveal', .45]]);

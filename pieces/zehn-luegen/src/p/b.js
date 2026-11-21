// ===== Planos 29-58 (47,2 – 97,9 s): yo, mamá y el perro; Nochevieja; Herr Kowalski =====
const SOFA_Y = .95;   // altura de la raíz para sentarse en el sofá del salón
const sitPose = (ex = {}) => ({ lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, hipY: 2.0, ...ex });
const mamaSofa = (L, ex = {}, face = { expr: 'bored' }) => { const m = put(mama, WX - 1.6, SOFA_Y, -5.6, 0); applyPose(m, sitPose({ aLx: 1.1, aRx: 1.1, aLe: 1.3, aRe: 1.3, headX: .3, ...ex })); cara(m, L.T, face); return m; };
const book = (m) => { attach(SCHILD, m.aR.hand, [0, -.6, .4], [-.4, 0, 0], .0001); };   // (sin libro: se deja oculto)

// 29 · «Und ich? Ich bin das Kind,»: yo, delante de casa, saludo (ICH)
shot(47.24, 'W', null, L => { street(); const c = put(ich, -9.6, .3, 6.2, PI / 2); actuar(c, L.lt, [[0, {}], [.15, 'wave', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' }); cnt(c, 10, 1, { sc: .65 });
  badge('tag', 'ICH', W / 2, H * .17, (L.lt - .1) * 3); warmAt(V(-12, 6, 6), 60);
  cm([-1.2, 3.0, 7.8, -9.6, 2.6, 6.2, 46], [-2.2, 2.8, 7.6, -9.6, 2.6, 6.2, 44], L.k); sh(V(-10, 0, 6), 25); }, [[.05, 'steps_snow', .5], [.3, 'pop', .5]]);
// 30 · «das jede Lüge riecht.»: un vecino suelta una mentira (su contador baja) y yo lo huelo y lo señalo: LÜGE!
shot(48.66, 'C', null, L => { street(); const c = put(ich, 2, 0, -31.0, PI + .7), v = put(LE[1], 2.4, 0, -34.6, -1.1);
  actuar(c, L.lt, [[0, { headX: -.1 }], [.55, { ...GEST.point, aRx: 1.9 }, { dur: .25 }]], { T: L.T, extra: { headZ: Math.sin(L.T * 14) * .05 } }); cara(c, L.T, { expr: 'sus', eyes: 'squint', mouth: 'wavy' });
  actuar(v, L.lt, [[0, { aRx: .6, aRe: 1.2 }]], { T: L.T }); talk(v, L.T, 48.6, 49.3, 'smile'); cntDrop(v, L.lt, 6, [.3], { sc: .7 }); badge('red', 'LÜGE!', W / 2, H * .22, (L.lt - .6) * 3, 1, .85);
  cm([-12, 5.0, -31.6, 2.2, 3.4, -32.8, 44], [-11, 4.9, -31.6, 2.2, 3.4, -32.8, 42], L.k); sh(V(2, 0, -32), 20); }, [[.1, 'sniff', .7], [.3, 'tick_down', .55], [.6, 'stamp', .5]]);
// 31 · «Ich frage nach. Und frage nach.»: tirando de la manga de mamá, que intenta leer en el sofá
shot(50.12, 'S', null, L => { use('WZ'); inside(.8, 40); const m = mamaSofa(L, { headY: -.35 }, { expr: 'bored', eyes: 'half' }); const c = put(ich, WX + 1.4, 0, -3.0, -1.0);
  actuar(c, L.lt, [[0, { aLx: 1.5, aLe: .3, lean: .12, aRx: .4 }]], { T: L.T, extra: { aLx: 1.5 + Math.sin(L.T * 12) * .25 } }); talk(c, L.T, 50.1, 51.7, 'happy'); badge3('q', '?', hp(c).add(V(0, 2, 0)), L.lt * 3, .7);
  cm([WX + 1.2, 5.0, 9.4, WX + .5, 3.6, -4.4, 46], [WX + 1.0, 4.8, 8.6, WX + .5, 3.6, -4.4, 46], L.k); sh(V(WX, 0, -4), 20); }, [[.05, 'cloth', .5], [.5, 'hmm', .4], [1.0, 'cloth', .4]]);
// 32 · «Und frage nach.»: mi cara, decidida, y signos de interrogación por todas partes
shot(51.64, 'C', null, L => { use('WZ'); inside(.8, 40); const c = put(ich, WX + 2.4, 0, -3.4, -.6); actuar(c, L.lt, [[0, { lean: .1, aRx: .5, aLx: .5 }]], { T: L.T }); talk(c, L.T, 51.6, 53.2, 'determined');
  [[.3, .2, .2], [.75, .2, .5], [.25, .3, .8], [.7, .32, 1.05]].forEach(([x, y, t], i) => badge('q', i % 2 ? '??' : '?', W * x, H * y, (L.lt - t) * 3, 1, .7));
  onFace(c, 5.2, -.3, 1.2, 42, L.k, 4.6); sh(V(WX, 0, -4), 20); }, [[.2, 'pop', .4], [.5, 'pop', .4], [.8, 'pop', .4], [1.05, 'pop', .4]]);
// 33 · «Dieses Jahr habe ich Mama»: el cartel HUND? BITTE BITTE! delante de mamá
shot(53.18, 'W', null, L => { use('WZ'); inside(.8, 40); const m = mamaSofa(L, {}, { expr: 'bored', eyes: 'half', bags: .6 }); const c = put(ich, WX + 1.6, 0, -2.4, -.6);
  actuar(c, L.lt, [[0, { aLx: 2.7, aRx: 2.7, aLz: .25, aRz: .25, aLe: .1, aRe: .1 }]], { T: L.T, extra: { crouch: Math.abs(Math.sin(L.T * 7)) * .08 } }); cara(c, L.T, { expr: 'happy' });
  const sp_ = hp(c); show(SCHILD, sp_.x, 7.4 + Math.abs(Math.sin(L.T * 7)) * .2, sp_.z + .3, -.6, 1);
  cm([WX + 1.2, 5.6, 9.6, WX + .6, 5.0, -4, 50], [WX + 1.0, 5.4, 8.4, WX + .6, 5.0, -4, 48], L.k); sh(V(WX, 0, -3), 20); }, [[.05, 'paper', .55], [.6, 'jump_small', .4]]);
// 34 · «zweitausendmal gefragt:»: asomo con el cartel por detrás del sofá (×2000)
shot(54.43, 'Z', null, L => { use('WZ'); inside(.8, 40); const m = mamaSofa(L, { headX: .5 }, { expr: 'tired', eyes: 'half', bags: 1 }); const pop = Math.abs(Math.sin(L.T * 5)); const c = put(ich, WX + 3.2, 1.2 + pop * 1.6, -9.4, 0);
  applyPose(c, { aLx: 2.7, aRx: 2.7, aLe: .1, aRe: .1 }); cara(c, L.T, { expr: 'joy' }); show(SCHILD, WX + 3.2, 6.6 + pop * 1.6, -9.0, 0, .9);
  badge('big', '×2000', W / 2, H * .17, (L.lt - .1) * 3, 1, 1.1);
  cm([WX + 1.4, 6.0, 9, WX + 1, 4.6, -6, 48], [WX + 1.2, 6.2, 7.6, WX + 1, 4.6, -6, 46], L.k); sh(V(WX, 0, -5), 20); }, [[.05, 'count', .5], [.4, 'boing_metal', .3], [.9, 'jump_small', .4]]);
// 35 · «„Willst du nicht eigentlich auch einen Hund?“»: ojitos de cachorro
shot(56.06, 'C', null, L => { use('WZ'); inside(.8, 40); const c = put(ich, WX + 1.6, 0, -2, -.9); actuar(c, L.lt, [[0, { ...GEST.hold, aLx: 1.6, aRx: 1.6, aLz: -.4, aRz: -.4, aLe: 1.9, aRe: 1.9, headZ: .25, headX: -.15 }]], { T: L.T });
  talk(c, L.T, 56, 57.8, 'love', { eyes: 'up', blush: 1 }); onFace(c, 5.4, .3, -1, 42, L.k, 4.8); sh(V(WX, 0, -3), 20); }, [[.05, 'sparkle', .45], [1.0, 'aah', .35]]);
// 36 · «Jedes Mal sagte sie „Nein“.»: mamá, agotada: Nein. Cada «Nein» es una mentira: el contador baja
shot(57.79, 'S', null, L => { use('WZ'); inside(.8, 40); const m = mamaSofa(L, { headX: .2, headY: .3 }, { expr: 'tired', eyes: 'half', bags: 1, mouth: L.lt > 1.4 ? 'talk' : 'flat' });
  bubble(m, 'Nein.', (L.lt - 1.4) * 3, 1.8); cntDrop(m, L.lt, 3, [.5, 1.45], { sc: .7 });
  onFace(m, 6.6, .2, 1.8, 42, L.k, 5.8); sh(V(WX, 0, -5), 20); }, [[.5, 'tick_down', .55], [1.0, 'sigh', .5], [1.45, 'tick_down', .55]]);
// 37 · «Am zweiten Februar war ihre letzte Lüge weg.»: su contador llega a 0 (2. FEBRUAR)
shot(59.54, 'C', null, L => { use('WZ'); inside(.8, 40); const m = mamaSofa(L, { headX: .45, aRx: 1.9, aRe: 2.3, aRz: -.4 }, { expr: 'tired', eyes: 'closed', bags: 1 });
  badge('tag', '2. FEBRUAR', W / 2, H * .12, L.lt * 3); cntDrop(m, L.lt, 1, [2.0], { sc: .8, dy: 1.3 });
  onFace(m, 6.8, .2, -1.6, 44, L.k, 5.8); sh(V(WX, 0, -5), 20); }, [[.05, 'pages', .5], [1.0, 'clock_tick', .4], [2.0, 'tick_down', .7]]);
// 38 · «Am dritten Februar hatten wir einen Hund.»: salto de alegría con el cachorro (3. FEBRUAR)
shot(62.09, 'W', null, L => { use('WZ'); inside(.8, 40); const m = mamaSofa(L, { headX: .1, aLx: .6, aRx: .6 }, { expr: 'smile', eyes: 'half', bags: .8 }); cnt(m, 0, 1, { sc: .5 });
  put(ich, WX + 1.6, 0, -.6, -.4); saltar(ich, L.lt % .9, .05, { h: 1.6, dur: .5, base: [WX + 1.6, 0, -.6] }); cara(ich, L.T, { expr: 'joy', eyes: 'happy', mouth: 'laugh' });
  const d = dogAt(KR, WX + 4.6, 0, .6, -.8, .9); d.pose(L.T, { hop: 1, wag: 24 }); badge('tag', '3. FEBRUAR', W / 2, H * .12, L.lt * 3);
  cm([WX + 2.2, 4.8, 13.4, WX + 1.6, 3.4, -1, 48], [WX + 2.6, 4.6, 12, WX + 1.8, 3.4, -1, 46], L.k); sh(V(WX, 0, -2), 20); }, [[.05, 'cheer', .45], [.3, 'bark', .6], [.9, 'jump_small', .45], [1.4, 'bark', .5]]);
// 39 · «Krümel. Dann war Silvester.»: Krümel con gorrito de fiesta en el escalón de casa; fuegos en el cielo
shot(64.2, 'Z', null, L => { street(); FWON = Object.assign(V(10, 0, -60), { spread: 140, h: 70 }); const p = LH(HOME, HOME.dx + .8, 0, HOME.F + 1.3); const d = dogAt(KR, p.x, .45, p.z, HOME.ry + .3, 1); d.hat.visible = true; d.pose(L.T, { wag: 20, headX: -.25 });
  badge('big', 'KRÜMEL', W / 2, H * .2, L.lt * 4, clamp(1 - (L.lt - .45) * 5), .9); badge('tag', 'SILVESTER', W / 2, H * .12, (L.lt - .5) * 3);
  const c = LH(HOME, HOME.dx + .6, 0, HOME.F + 9.4); cam([c.x, 3.0, c.z], [p.x, 2.6, p.z], 42); warmAt(LH(HOME, HOME.dx, 4.4, HOME.F + 1.4), 60); sh(p, 15); }, [[.05, 'bark', .6], [.5, 'firework', .7], [1.1, 'party_horn', .45]]);
// 40 · «Kurz nach elf schaute ich raus in den Schnee»: yo en la ventana (desde fuera del cristal, entre la escarcha) 23:07
shot(65.74, 'S', null, L => { use('WZ'); inside(.6, 30); const c = put(ich, WX - 3, 2.6, -11.2, PI); applyPose(c, { aLx: 1.4, aRx: 1.4, aLe: 1.2, aRe: 1.2, aLz: -.2, aRz: -.2, headY: Math.sin(L.T * 1.4) * .25 }); cara(c, L.T, { expr: 'worried', eyes: Math.sin(L.T * 1.4) > 0 ? 'side_l' : 'side_r' });
  badge('tag', '23:07', W / 2, H * .12, L.lt * 3);
  cm([WX - 3.2, 6.2, -13.5, WX - 3, 5.8, -8, 48], [WX - 3.1, 6.0, -13.4, WX - 3, 5.8, -8, 46], L.k); grade.uniforms.vig.value = .7; sh(V(WX, 0, -10), 20); }, [[.05, 'wind', .55], [.8, 'clock_tick', .45]]);
// 41 · «– und da stand er.» (zoom lento): al otro lado de la calle, bajo la farola, quieto, mirando nuestra casa
shot(67.77, 'C', 'slow', L => { street(1.3); scene.fog.density = .0024; const c = put(sam, 8.4, .3, 9.4, -PI / 2); applyPose(c, { aRx: .1, headY: .05 }); grin(c, L.T); kofHand(c); warmAt(V(9.6, 9, 10), 90);
  const w = LH(HOME, -HOME.w / 3.2, 0, HOME.F + .6); cm([w.x, 4.4, w.z, 8.4, 6.6, 9.4, 34], [w.x + 2, 4.6, w.z - .4, 8.4, 7.2, 9.4, 26], L.k); sh(V(8, 0, 9), 20); }, [[.05, 'heartbeat', .7]]);
// 42 · «Mama sah ihn und wurde kreidebleich.»: mamá en la ventana; se le va el color de la cara
shot(68.92, 'W', null, L => { use('WZ'); inside(.6, 30); const m = put(mama, WX - 1.2, 0, -9.0, PI); const k = clamp((L.lt - .9) / 1.0);
  actuar(m, L.lt, [[0, { aLx: .4, aRx: .4 }], [.9, { ...GEST.hands_face, aLx: 1.6, aRx: 1.6 }, { dur: .4 }]], { T: L.T }); cara(m, L.T, { expr: k > .3 ? 'shock' : 'worried', skin: pale(m, k) });
  cm([WX - 1.3, 5.2, -13.4, WX - 1.2, 4.9, -8, 46], [WX - 1.3, 5.2, -13.3, WX - 1.2, 4.9, -8, 42], L.k); grade.uniforms.vig.value = .7; sh(V(WX, 0, -10), 20); }, [[.1, 'gasp_f', .6], [.9, 'freeze', .5]]);
// 43 · «Ihre Zahl stand auf null.»: desde detrás de mamá: su contador, en rojo, parpadea en 0
shot(71.13, 'C', null, L => { use('WZ'); inside(.6, 30); const m = put(mama, WX - 1.2, 0, -11.0, PI); applyPose(m, { ...GEST.hands_face, aLx: 1.6, aRx: 1.6 }); cara(m, L.T, { expr: 'shock', skin: pale(m, 1) });
  cnt(m, 0, 1, { sc: 1.15, pop: (L.lt % .5) < .12 ? .05 : -1, dy: 1.7 });
  cm([WX + 1.4, 7.4, -4.4, WX - 1.4, 6.4, -12, 46], [WX + 1.0, 7.2, -5.4, WX - 1.4, 6.4, -12, 44], L.k); sh(V(WX, 0, -10), 20); }, [[.05, 'alarm_soft', .45], [.6, 'tick_hollow', .5]]);
// 44 · «Und schuld war ich.»: yo, cabizbajo
shot(72.66, 'S', null, L => { use('WZ'); inside(.6, 30); const c = put(ich, WX + 1.8, 0, -8, PI * .82); actuar(c, L.lt, [[0, { ...GEST.slump, headX: .22 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', eyes: 'down' });
  onFace(c, 5.6, .3, .8, 42, L.k, 4.8); sh(V(WX, 0, -8), 20); }, [[.1, 'sad_tone', .55]]);
// 45 · «Zuerst klingelte der Sammler beim Nachbarn.»: cruza hacia la casa de Kowalski y llama
shot(73.92, 'W', null, L => { street(); const d = LH(KOWH, KOWH.dx, 0, KOWH.F + 2.8), s0 = V(-3, 0, -4); const ry = faceTo(s0, d); const r = caminar(sam, L.lt, { x: s0.x, z: s0.z, ry, speed: 4.6, stopAt: 1.4, T: L.T, stride: 1.2 }); grin(sam, L.T); kofHand(sam);
  cm([6, 5.6, 6.4, -9, 3.6, -11, 50], [5, 5.2, 4.4, -10, 3.6, -11.6, 50], L.k); sh(V(-8, 0, -10), 25); }, [[.05, 'steps_snow', .6], [.7, 'steps_snow', .5], [1.7, 'door_bell', .7]]);
// 46 · «Herr Kowalski hatte sich das ganze Jahr»: él en su puerta, orgulloso, contador DORADO con un 1
shot(75.88, 'S', null, L => { street(); KOWH.door.rotation.y = 1.4; const c = inDoor(kow, KOWH, 0, 0); actuar(c, L.lt, [[0, GEST.cross]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); cnt(c, 1, clamp(L.lt * 3), { gold: true, sc: .8 });
  badge('tag', 'HERR KOWALSKI', W / 2, H * .12, L.lt * 3); warmAt(hp(c).add(V(0, 2, 2)), 50);
  camH(KOWH, [KOWH.dx - 1.0, 4.4, KOWH.F + 10.4], [KOWH.dx, 4.2, KOWH.F + 1], 46); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, [[.05, 'door_open', .5], [.5, 'ding_soft', .5]]);
// 47 · «eine Lüge aufgehoben.»: primer plano: se da golpecitos en la sien; su 1 dorado brilla
shot(77.70, 'C', null, L => { street(); KOWH.door.rotation.y = 1.4; const c = inDoor(kow, KOWH, 0, 0); actuar(c, L.lt, [[0, { ...GEST.think, aRx: 2.1, aRe: 2.5 }]], { T: L.T, extra: { aRe: 2.5 + Math.max(0, Math.sin(L.T * 12)) * .15 } }); cara(c, L.T, { expr: 'smug', eyes: 'wink', mouth: 'smirk' });
  cnt(c, 1, 1, { gold: true, sc: 1.0, pop: (L.lt % .6) - .1 }); warmAt(hp(c).add(V(0, 2, 2)), 50);
  onFace(c, 6.4, -.2, 1.6, 42, L.k, 5.6); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, [[.1, 'sparkle', .5], [.7, 'ding_soft', .4]]);
// 48 · «Seit Juli hatte er sie vor dem Spiegel geübt.»: en el baño, ensayando «Mein Auto!» ante el espejo (JULI)
shot(78.90, 'R', null, L => { use('BD'); inside(.8, 30); const a = put(kow, BX - .4, 0, .4, PI), b = put(kow2, BX - .4, 0, -8.4, 0);
  const P = { aRx: 1.6 + Math.sin(L.T * 8) * .15, aRz: -.1, aRe: .1, lean: .1, headX: -.1 }; actuar(a, L.lt, [[0, P]], { T: L.T }); actuar(b, L.lt, [[0, { ...P, aRx: 0, aLx: P.aRx, aLz: -.1, aLe: .1 }]], { T: L.T });
  const mo = Math.sin(L.T * 9) > 0 ? 'talk_wide' : 'talk'; cara(a, L.T, { expr: 'shout', mouth: mo }); cara(b, L.T, { expr: 'shout', mouth: mo });
  bubble(b, 'Mein Auto!', (L.lt - .3) * 3, 1.6); badge('tag', 'JULI', W / 2, H * .12, L.lt * 3);
  cm([BX + 1.6, 6.0, 3.0, BX - .4, 5.2, -8.4, 42], [BX + 1.5, 6.0, 2.6, BX - .4, 5.2, -8.4, 40], L.k); sh(V(BX, 0, -3), 20); }, [[.05, 'water_bloop', .35], [.4, 'shout_m', .4], [1.4, 'shout_m', .35]]);
// 49 · «„Was ist Ihnen hier am wertvollsten?“»: el Coleccionista en la puerta de Kowalski (desde el lado del porche)
shot(81.38, 'Z', null, L => { street(); KOWH.door.rotation.y = 1.4; const k = inDoor(kow, KOWH, .3, 0), c = atDoor(sam, KOWH, 4.4, -2.6);
  actuar(c, L.lt, [[0, { lean: .2, headX: .2, aLx: .05, aLe: .3 }]], { T: L.T }); talk(c, L.T, 81.3, 83, 'grin'); kofHand(c); applyPose(k, GEST.cross); cara(k, L.T, { expr: 'smug' }); cnt(k, 1, 1, { gold: true, sc: .6 });
  camH(KOWH, [KOWH.dx + 8, 10.5, KOWH.F + 17], [KOWH.dx, 4.6, KOWH.F + 2.2], 32); warmAt(LH(KOWH, KOWH.dx, 5, KOWH.F + 1.5), 25); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, [[.1, 'whisper', .45]]);
// 50 · «„Mein Auto!“, rief Herr Kowalski.»: señala su coche gritando; el 1 dorado cae a 0
shot(82.98, 'C', null, L => { street(); KOWH.door.rotation.y = 1.4; const k = inDoor(kow, KOWH, 0, 0); actuar(k, L.lt, [[0, GEST.cross], [.2, { aRx: 1.5, aRz: 1.0, aRe: .05, aLz: .1, aLe: .3 }, { dur: .2 }]], { T: L.T, extra: { headY: -.45 } });
  cara(k, L.T, { expr: 'shout', mouth: L.lt < 1.2 ? 'talk_wide' : 'smirk' }); cntDrop(k, L.lt, 1, [.38], { gold: L.lt < .38, sc: .75 }); badge('big', 'MEIN AUTO!', W / 2, H * .2, (L.lt - .2) * 3, 1, .9);
  cam([-4.2, 3.8, -15.6], [-13.4, 4.8, -12.8], 48); warmAt(hp(k).add(V(1, 2, 0)), 60); sh(V(-11, 0, -12), 18); }, [[.1, 'shout_m', .55], [.38, 'tick_down', .6], [1.2, 'car', .3]]);
// 51 · «Der Sammler lächelte:»: primer plano de la sonrisa
shot(84.95, 'S', null, L => { street(); const c = atDoor(sam, KOWH, 6.4, 0); actuar(c, L.lt, [[0, { lean: .26, headX: .15 }]], { T: L.T }); grin(c, L.T, { eyes: L.lt > .5 ? 'squint' : 'normal' }); kofHand(c);
  onFace(c, 5.0, -1.2, -.6, 46, L.k, 4.6); warmAt(hp(c).add(V(0, 1, 2)), 50); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, [[.1, 'creepy_ting', .55]]);
// 52 · «„Haben Sie mich gerade angelogen?“»: se inclina hacia él (ANGELOGEN?)
shot(85.91, 'Z', null, L => { street(); KOWH.door.rotation.y = 1.4; const k = inDoor(kow, KOWH, .3, 0), c = atDoor(sam, KOWH, 4.4, -2.6);
  actuar(c, L.lt, [[0, { lean: .2 }], [.3, { lean: .42, headX: .3, aLx: .1, aLe: .3 }, { dur: .5 }]], { T: L.T }); talk(c, L.T, 85.9, 87.4, 'grin'); kofHand(c); applyPose(k, { ...GEST.recoil }); cara(k, L.T, { expr: 'worried' });
  badge('red', 'ANGELOGEN?', W / 2, H * .18, (L.lt - .6) * 3, 1, .85);
  camH(KOWH, [KOWH.dx + 8, 10.5, KOWH.F + 17], [KOWH.dx, 4.6, KOWH.F + 2.2], 32); warmAt(LH(KOWH, KOWH.dx, 5, KOWH.F + 1.5), 25); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, [[.1, 'whisper', .5], [.6, 'stamp', .5]]);
// 53 · «Und Herr Kowalski hatte keine Lüge mehr.» (zoom lento): congelado, sudando, contador a 0
shot(87.44, 'C', 'slow', L => { street(); KOWH.door.rotation.y = 1.4; const k = inDoor(kow, KOWH, 0, 0); actuar(k, L.lt, [[0, { ...GEST.shock }]], { T: L.T, extra: shiver(L.T, .7) }); cara(k, L.T, { expr: 'terror' }); sweat(k, L.T); cnt(k, 0, 1, { sc: .8 });
  onFace(k, 7.4, -.2, .6, 44, L.k, 5.4); warmAt(hp(k).add(V(0, 1, 2)), 50); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, []);
// 54 · «„…Ja. Mein Dackel Bruno.“»: mira hacia abajo, a Bruno, a sus pies (BRUNO)
shot(89.62, 'W', null, L => { street(); KOWH.door.rotation.y = 1.4; const k = inDoor(kow, KOWH, 0, 0); actuar(k, L.lt, [[0, { ...GEST.slump, headX: .55 }]], { T: L.T }); talk(k, L.T, 89.6, 91.1, 'sad', { eyes: 'cry' }); cnt(k, 0, 1, { sc: .6 });
  const p = LH(KOWH, KOWH.dx - 1.4, 0, KOWH.F + 2.0); const d = dogAt(BR, p.x, 0, p.z, KOWH.ry + .5, 1.05); d.pose(L.T, { wag: 10, headX: -.3 }); badge('tag', 'BRUNO', W / 2, H * .12, (L.lt - .5) * 3);
  camH(KOWH, [KOWH.dx + 1.4, 3.6, KOWH.F + 10.4], [KOWH.dx - .4, 3.4, KOWH.F + 1.4], 46); warmAt(LH(KOWH, KOWH.dx, 4, KOWH.F + 2), 60); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, [[.05, 'gulp', .5], [.6, 'bark', .35]]);
// 55 · «Klick. Denn eine Lüge reicht nie.»: Bruno vuela al maletín; la tapa se cierra (FALLE!)
shot(91.08, 'C', null, L => { street(); const base = LH(KOWH, KOWH.dx + .4, 0, KOWH.F + 4.6); const k = kofAt(base.x, 2.0, base.z, KOWH.ry, 1.1); k.open(1 - clamp((L.lt - .16) / .1));
  const fly = clamp((L.lt + .1) / .28), p0 = LH(KOWH, KOWH.dx - 1.4, 0, KOWH.F + 2.0); if (fly < 1) { const d = dogAt(BR, lerp(p0.x, base.x, fly), lerp(0, 1.2, fly) + Math.sin(fly * PI) * 2, lerp(p0.z, base.z, fly), L.T * 8, lerp(1, .2, fly)); d.pose(L.T, { open: .5 }); }
  if (L.lt > .16 && L.lt < .5) sparks(V(base.x, 1.2, base.z), .16, L.T, 20, .6); badge('red', 'FALLE!', W / 2, H * .2, (L.lt - .7) * 3, 1, 1);
  const c = LH(KOWH, KOWH.dx + 5.4, 0, KOWH.F + 9.4); cam([c.x, 4.2, c.z], [base.x, 1.6, base.z], 42); sh(base, 15); }, [[.02, 'bark', .5], [.17, 'lid_click', .9], [.2, 'magic_hit', .5], [.75, 'stamp', .5]]);
// 56 · «Der Sammler fragt einfach nochmal.»: levanta el dedo, sonriendo: ?  ?
shot(93.19, 'W', null, L => { street(); const c = atDoor(sam, KOWH, 6.4, 0); actuar(c, L.lt, [[0, { aLx: 2.0, aLe: 1.2, aLz: .2, lean: .15 }]], { T: L.T, extra: { aLz: .2 + Math.sin(L.T * 10) * .15 } }); talk(c, L.T, 93.1, 94.9, 'grin'); kofHand(c);
  badge('q', '?', W * .3, H * .22, (L.lt - .3) * 3, 1, .8); badge('q', '?', W * .7, H * .2, (L.lt - .8) * 3, 1, .8);
  onFace(c, 5.0, -1.0, .6, 48, L.k, 4.6); warmAt(hp(c).add(V(0, 1, 2)), 50); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, [[.3, 'pop', .4], [.8, 'pop', .4], [1.2, 'evil_laugh', .3]]);
// 57 · «Herr Kowalski stand allein im Schnee.»: plano alto: solo en su jardín; el Coleccionista se aleja
shot(94.88, 'S', null, L => { street(1.3); const k = putH(kow, KOWH, KOWH.dx, KOWH.F + 2.4, 0, 0); actuar(k, L.lt, [[0, { ...GEST.slump }]], { T: L.T }); cara(k, L.T, { expr: 'sad', eyes: 'cry' }); attach(LEINE, k.aR.hand, [0, -.4, .2], [0, 0, 0], .45);
  caminar(sam, L.lt, { x: -2, z: -18, ry: PI, speed: 2.2, T: L.T, stride: 1.2 }); grin(sam, L.T); kofHand(sam);
  cm([-3.4, 11, -6.4, -12.6, 2.6, -13.1, 46], [-3.8, 10.4, -7, -12.6, 2.6, -13.1, 46], L.k); sh(V(-8, 0, -14), 30); }, [[.05, 'wind', .6], [.6, 'steps_snow', .4]]);
// 58 · «Mit einer leeren Leine.»: la correa vacía colgando de su mano
shot(96.72, 'C', null, L => { street(1.3); const k = putH(kow, KOWH, KOWH.dx, KOWH.F + 2.4, 0, 0); applyPose(k, { ...GEST.slump, aRx: .5, aRe: .4 }); cara(k, L.T, { expr: 'sad' });
  const l = attach(LEINE, k.aR.hand, [0, -.4, .2], [Math.sin(L.T * 2) * .12, 0, Math.sin(L.T * 1.5) * .1], .45); const lp = wpos(LEINE);
  cam([lp.x + 3.4, lp.y - .4, lp.z + 1.6], [lp.x, lp.y - 1.1, lp.z], 46); sh(lp, 10); }, [[.1, 'chain_rattle', .4], [.5, 'sad_tone', .5]]);

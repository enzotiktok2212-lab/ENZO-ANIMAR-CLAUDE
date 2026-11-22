// ---------- b: la silla online, el paquete, me siento, totenstill, el panadero (21,04 – 41,34 s) ----------
const DESKP = V(ZIX, 0, -3.2);   // en mi cuarto: botella delante del escritorio (mirando al monitor, -z)
const atDesk = (L, pose = {}, wob = .04) => seat(ich, DESKP.x, DESKP.z, Math.PI, L, { wob, col: 3, pose: { aLx: 1.2, aRx: 1.2, aLz: -.1, aRz: -.1, aLe: .7, aRe: .7, lean: .15, ...pose } });
const DOORW = V(11.1, 0, 91.3);  // puerta de casa (mira a +x)
// 19 «Deshalb habe ich mir heimlich»: en mi cuarto, de noche, en mi botella delante del ordenador: miro a los lados
shot(21.04, 'Z', null, L => { zimmerS(L); hemi.intensity = .6; SCR.draw(0); const c = atDesk(L, { headY: Math.sin(L.lt * 4) * .7 }); cara(c, L.T, { expr: 'sus', mouth: 'flat' });
  cm([ZIX + 8, 8.6, 1], [ZIX + 7, 8.4, 0], L.k); camera.lookAt(ZIX, 7, -5); camera.fov = 46; sh(V(ZIX, 0, -4), 16); }, [[0, 'typing', .4], [.6, 'creak', .3]]);
// 20 «online einen Stuhl bestellt.»: el monitor: «Stuhl mit Lehne – 89,99 €» → clic en KAUFEN → «BESTELLT ✓»
shot(22.40, 'F', null, L => { zimmerS(L); const ph = L.T < 22.8 ? 0 : L.T < 22.98 ? 1 : 2; SCR.draw(ph, clamp((L.T - 22.98) / .4)); atDesk(L);
  cm([ZIX + 3.4, 8.6, -1.2], [ZIX + 3, 8.5, -2.2], L.k); camera.lookAt(ZIX, 8.2, -10); camera.fov = 44; sh(V(ZIX, 0, -8), 12); }, [[.4, 'click', .7], [.58, 'ding_reveal', .6]]);
// 21 «Einen richtigen Stuhl!»: salto de alegría en mi botella, brazos arriba
shot(23.58, 'C', 'punch', L => { zimmerS(L); SCR.draw(2, 1); const c = atDesk(L, { ...GEST.cheer, aLz: .5 + Math.sin(L.T * 12) * .15, aRz: .5 + Math.sin(L.T * 12) * .15 }, .08); c.root.rotation.y = .9; laughF(c, L.T); confetti(V(ZIX, 4, -3), 23.6, L.T, 40, .5);
  cm([ZIX + 9, 8.4, 4], [ZIX + 8, 8, 3], L.k); camera.lookAt(ZIX, 6.4, -3); camera.fov = 46; sh(V(ZIX, 0, -3), 14); }, [[0, 'cheer', .45], [.1, 'party_horn', .4]]);
// 22 «Mit Lehne!»: la foto de la silla en el monitor; un círculo marca el respaldo
shot(24.74, 'W', null, L => { zimmerS(L); SCR.draw(2, 1);
  cm([ZIX - .6, 8.6, -1.6], [ZIX - 1.2, 8.4, -2.8], L.k); camera.lookAt(ZIX - 1.4, 8.2, -10); camera.fov = 44; badge('gold', 'MIT LEHNE!', W / 2, H * .16, clamp((L.T - 25.0) / .12), 1, .95); sh(V(ZIX, 0, -8), 12); }, [[.2, 'sparkle', .5]]);
// 23 «Heute Morgen kam endlich»: por la mañana el cartero me trae un paquete enorme a la puerta de casa
shot(25.60, 'S', null, L => { town(L); const k = clamp(L.lt / .6); const po = put(EX[12], DOORW.x + 7 - k * 2.4, 0, DOORW.z + 1.8, -Math.PI / 2); actuar(po, 0, [[0, k < 1 ? { ...walkP(L.T, 1), ...GEST.hold } : GEST.hold]], { T: L.T }); cara(po, L.T, { expr: 'happy', mouth: 'smile' });
  attach(PARCEL, po.root, [0, 2.2, 2.0], [0, 0, 0], .78);
  const c = put(ich, DOORW.x + 2, 0, DOORW.z - 1.8, Math.PI / 2); actuar(c, 0, [[0, { aLx: 1.0, aRx: 1.0, aLe: .4, aRe: .4, headX: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'wide', mouth: 'open_smile' });
  cm([DOORW.x + 5, 6.5, DOORW.z + 15], [DOORW.x + 5, 6, DOORW.z + 12], L.k); camera.lookAt(DOORW.x + 4, 4, DOORW.z); camera.fov = 46; sh(DOORW, 20); }, [[0, 'doorbell', .55], [.3, 'steps', .35]]);
// 24 «das Paket.»: abrazo el paquete (enorme: «VORSICHT – STUHL»)
shot(26.73, 'I', null, L => { town(L); const c = put(ich, DOORW.x + 2.6, 0, DOORW.z, Math.PI / 2 + .3); actuar(c, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.5, aRz: -.5, aLe: .6, aRe: .6, lean: .08 }]], { T: L.T }); grin(c, L.T);
  attach(PARCEL, c.root, [0, .2, 2.4], [0, 0, 0], .9);
  onBody(c, 15, 0, .1, 44, L.k, 13); sh(DOORW, 16); }, [[0, 'box_drop', .45], [.2, 'happy_hum', .35]]);
// 25 «Also gehe ich zum Domplatz»: cruzo la plaza con el paquete; el Dom al fondo; todos me miran desde sus botellas
shot(27.34, 'C', null, L => { town(L); const c = put(ich, -22 + L.lt * 2.6, 0, 12, Math.PI / 2); actuar(c, 0, [[0, { ...walkP(L.T, 0), aLx: 1.4, aRx: 1.4, aLz: -.45, aRz: -.45, aLe: .6, aRe: .6 }]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 9)) * .12; grin(c, L.T);
  attach(PARCEL, c.root, [0, .4, 2.3], [0, 0, 0], .85);
  plaza(L, { cx: -34, cz: 0, n: 14, r0: 6, r1: 18, seed: 21, mode: 'stare', face: hp(c) });
  cm([-4, 6.5, 17], [-7, 6.2, 16], L.k); camera.lookAt(-44, 10, 6); camera.fov = 52; sh(V(-20, 0, 12), 40); }, [[0, 'steps', .45], [.3, 'murmur', .35]]);
// 26 «und ziehe eine Flasche»: me agarro a una botella libre y tiro con todas mis fuerzas
shot(28.69, 'W', null, L => { town(L); show(PARCEL, CP.x - 2.4, 0, CP.z + 2, .4, .85); const up = Math.max(0, Math.sin(L.T * 26)) * .08 + clamp((L.T - 29.6) / .3) * .6;
  show(MYB, HP.x, up, HP.z, .3); const c = put(ich, HP.x, 0, HP.z - 2.3, 0); actuar(c, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.25, aRz: -.25, aLe: .5, aRe: .5, lean: -.25, crouch: .35, lLx: .5, lRx: -.2, lLk: .6, lRk: .3, headX: -.2 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', eyes: 'closed', mouth: 'grimace' }); sweat(c, L.T);
  plaza(L, { n: 10, r0: 8, r1: 20, seed: 23, mode: 'stare', face: V(HP.x, 3, HP.z) });
  cm([HP.x + 8, 5.2, HP.z + 3], [HP.x + 7, 5, HP.z + 2.4], L.k); camera.lookAt(HP.x, 3.6, HP.z - 1); camera.fov = 46; sh(HP, 16); }, [[0, 'strain', .5], [.4, 'glass_creak', .45]]);
// 27 «aus dem Boden,»: ¡PLOP! la botella sale; queda un agujero negro; polvo
shot(29.95, 'C', 'punch', L => { town(L); show(PARCEL, CP.x - 2.4, 0, CP.z + 2, .4, .85); myHole(L); const k = easeOut(clamp((L.T - 29.95) / .3));
  show(MYB, HP.x + k * 2.4, 1.2 + k * 2.4, HP.z, .3); MYB.rotation.z = -k * .8;
  const c = put(ich, HP.x, 0, HP.z - 2.6 - k * .8, 0); actuar(c, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: -.2, aRz: -.2, aLe: .3, aRe: .3, lean: -.35, headX: -.3, lLx: -.3, lRx: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); dust(V(HP.x, 0, HP.z), 29.95, L.T, 10, .7);
  cm([HP.x - 3, 7, HP.z + 9], [HP.x - 2.6, 6.6, HP.z + 8], L.k); camera.lookAt(HP.x, 2.4, HP.z - 1); camera.fov = 46; sh(HP, 14); }, [[0, 'cork_pop', .8], [.05, 'dust_puff', .45]]);
// 28 «damit mein Stuhl Platz hat.»: abro el paquete: sale la silla gamer entre destellos
shot(30.45, 'F', null, L => { town(L); myHole(L); show(MYB, HP.x + 2.4, 0, HP.z + 1.6, 0); rollBottle(MYB, V(HP.x + 2.6, 0, HP.z + 2.2), .8, 0);
  const k = easeOut(clamp((L.T - 30.55) / .4)); show(PARCEL, CP.x, -k * 4, CP.z, .2, .95); show(CHAIR, CP.x, 0, CP.z, 0, lerp(.3, 1, k)); sparks(V(CP.x, 4, CP.z), 30.6, L.T, 30, .8);
  const c = put(ich, CP.x + 4, 0, CP.z + 3, -.9); actuar(c, 0, [[0, GEST.cheer]], { T: L.T }); laughF(c, L.T);
  plaza(L, { n: 10, r0: 9, r1: 22, seed: 25, mode: 'stare', face: V(CP.x, 3, CP.z) });
  orb(L.k, V(CP.x + 1.5, 3.6, CP.z), null, [17, .35, .14, 44], [15, .2, .12, 44]); sh(CP, 18); }, [[0, 'tape_rip', .55], [.15, 'magic_hit', .45]]);
// 29 «Ich stelle ihn hin»: coloco la silla junto al agujero
shot(31.70, 'R', null, L => { town(L); myHole(L); rollBottle(MYB, V(HP.x + 2.6, 0, HP.z + 2.2), .8, 0); const k = easeOut(clamp((L.T - 31.75) / .45));
  show(CHAIR, CP.x, (1 - k) * 1.2, CP.z, .4 * (1 - k)); const c = put(ich, CP.x + 3.4, 0, CP.z + .4, -Math.PI / 2); actuar(c, 0, [[0, { aLx: 1.3, aRx: 1.3, aLe: .4, aRe: .4, lean: .3, crouch: .2 * (1 - k) }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  plaza(L, { n: 10, r0: 9, r1: 22, seed: 27, mode: 'stare', face: V(CP.x, 3, CP.z) });
  cm([CP.x - 7, 5, CP.z + 9], [CP.x - 6, 4.6, CP.z + 8], L.k); camera.lookAt(CP.x, 2.8, CP.z + 1); camera.fov = 46; sh(CP, 16); }, [[.4, 'thud', .55]]);
// 30 «und setze mich.»: me dejo caer en la silla: se hunde, me balanceo
shot(32.48, 'S', null, L => { town(L); myHole(L); rollBottle(MYB, V(HP.x + 2.6, 0, HP.z + 2.2), .8, 0); const k = easeOut(clamp((L.T - 32.6) / .35)); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.25 * k, aLx: .6, aRx: .6, aLz: .6, aRz: .6, aLe: .4, aRe: .4 });
  c.root.position.y += (1 - k) * 1.4; CHAIR.position.y = -Math.sin(clamp((L.T - 32.9) / .25) * Math.PI) * .15; cara(c, L.T, { expr: 'happy', eyes: k > .9 ? 'happy' : 'normal', mouth: 'open_smile' });
  plaza(L, { n: 10, r0: 9, r1: 22, seed: 29, mode: 'stare', face: V(CP.x, 3, CP.z) });
  onBody(c, 15, .3, .1, 44, L.k, 12.5, .15, 2.2); sh(CP, 16); }, [[.3, 'cushion', .7], [.5, 'sigh', .45]]);
// 31 «Es ist der beste Moment» (zoom lento): recostado con los ojos cerrados; luz dorada; «PERFEKT»
shot(33.53, 'I', 'slow', L => { town(L, { dusk: 1 }); myHole(L); rollBottle(MYB, V(HP.x + 2.6, 0, HP.z + 2.2), .8, 0); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.32, aLx: -.2, aRx: -.2, aLz: 1.0, aRz: 1.0, aLe: 2.2, aRe: 2.2, headX: -.25 }); cara(c, L.T, { eyes: 'closed', mouth: 'grin' });
  onFace(c, 6.6, .4, .3, 42, L.k, 4.8); badge('gold', 'PERFEKT', W / 2, H * .16, clamp((L.lt - .15) / .15), 1, 1); sh(CP, 14); }, [[0, 'angel_choir', .45], [.2, 'sparkle', .45]]);
// 32 «meines Lebens …»: órbita lenta alrededor de la silla; palomas; confeti de luz
shot(34.61, 'W', null, L => { town(L, { dusk: 1 }); myHole(L); rollBottle(MYB, V(HP.x + 2.6, 0, HP.z + 2.2), .8, 0); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.3, aLz: 1.0, aRz: 1.0, aLx: -.2, aRx: -.2, aLe: 2.2, aRe: 2.2, headX: -.2 }); grin(c, L.T, { eyes: 'closed' });
  plaza(L, { n: 12, r0: 9, r1: 26, seed: 31, mode: 'idle' }); confRain(V(CP.x, 0, CP.z), L.T, 30, 10, 10, 12);
  orb(L.k, V(CP.x, 3.4, CP.z), null, [16, -.6, .16, 46], [16, -.1, .14, 46]); sh(CP, 20); }, [[0, 'birds', .4]]);
// 33 «bis es auf einmal»: plano general: todos se callan a la vez y se giran
shot(35.59, 'C', null, L => { town(L); myHole(L); rollBottle(MYB, V(HP.x + 2.6, 0, HP.z + 2.2), .8, 0); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.3, aLz: 1.0, aRz: 1.0, aLx: -.2, aRx: -.2, aLe: 2.2, aRe: 2.2 }); cara(c, L.T, { eyes: 'closed', mouth: 'smile' });
  plaza(L, { n: 28, r0: 6, r1: 32, seed: 33, mode: i => (L.T > 35.9 + (i % 5) * .05 ? 'stare' : 'talk'), face: V(CP.x, 4, CP.z) });
  cm([CP.x + 4, 22, CP.z + 30], [CP.x + 3, 19, CP.z + 26], L.k); camera.lookAt(CP.x - 2, 2, CP.z - 6); camera.fov = 52; sh(V(CP.x, 0, CP.z - 4), 40); }, [[.3, 'record_scratch', .5]]);
// 34 «totenstill wird.» (zoom lento): silencio; abro un ojo; una hoja cruza la plaza
shot(36.29, 'F', 'slow', L => { town(L); grade.uniforms.sat.value = 1.1; myHole(L); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.28, aLz: 1.0, aRz: 1.0, aLx: -.2, aRx: -.2, aLe: 2.2, aRe: 2.2, headY: -.25 }); cara(c, L.T, { eyes: L.T > 36.7 ? 'side_l' : 'closed', mouth: 'flat' });
  plaza(L, { n: 10, r0: 7, r1: 18, seed: 35, mode: 'stare', face: hp(c) });
  onFace(c, 8, .3, -.6, 44, L.k, 5.5); sh(CP, 14); }, [[0, 'wind', .55], [.5, 'cricket', .4]]);
// 35 «Die ganze Stadt starrt»: contraplano desde detrás de mí: cientos de ojos clavados en mí
shot(37.63, 'R', null, L => { town(L); myHole(L); const c = inChair(ich, CP.x, CP.z, Math.PI, L, { lean: -.15, aLx: .3, aRx: .3 }); cara(c, L.T, { expr: 'worried' });
  plaza(L, { cx: CP.x, cz: CP.z - 8, n: 30, r0: 5, r1: 30, seed: 37, mode: 'stare', face: V(CP.x, 4, CP.z), full: true });
  cm([CP.x + 2.5, 11.5, CP.z + 6], [CP.x + 2.2, 11, CP.z + 5], L.k); camera.lookAt(CP.x - 1, 3.2, CP.z - 16); camera.fov = 54; sh(V(CP.x, 0, CP.z - 10), 34); }, [[0, 'tension_hit', .5]]);
// 36 «mich an.»: dos caras en primer plano: me miran fijamente, sin parpadear
shot(38.33, 'Z', null, L => { town(L); const a = seat(EX[6], CP.x - 2, CP.z - 9, 0, L, { wob: .01 }); seatMode(a, L, 1, 'stare', { face: V(CP.x, 4, CP.z + 6) }); const b = seat(EX[14], CP.x + 2.6, CP.z - 11, -.2, L, { wob: .01 }); seatMode(b, L, 2, 'stare', { face: V(CP.x, 4, CP.z + 6) });
  plaza(L, { cx: CP.x, cz: CP.z - 22, n: 10, r0: 8, r1: 18, seed: 39, mode: 'stare', face: V(CP.x, 4, CP.z + 6), gap: 1.3 });
  cm([CP.x - 1, 9.4, CP.z + 4], [CP.x - .4, 9.2, CP.z + 2.6], L.k); camera.lookAt(CP.x + .2, 8.2, CP.z - 10); camera.fov = 40; sh(V(CP.x, 0, CP.z - 10), 16); }, [[0, 'heartbeat', .55]]);
// 37 «Ein Bäcker kippt vor Schreck»: el panadero en su botella, con una bandeja de Brezeln, abre los ojos de golpe
shot(39.33, 'W', 'punch', L => { town(L); const b = seat(bak, BKP.x, BKP.z, .5, L, { wob: .03, pose: { aLx: 1.2, aRx: 1.2, aLz: -.2, aRz: -.2, aLe: .9, aRe: .9, lean: -.1 } }); cara(b, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  plaza(L, { cx: BKP.x, cz: BKP.z - 6, n: 8, r0: 6, r1: 16, seed: 41, mode: 'stare', face: V(CP.x, 4, CP.z) });
  onBody(b, 15, 0, .1, 44, L.k, 12.5, -.15, 3); sh(BKP, 16); }, [[0, 'gasp', .5]]);
// 38 «von seiner Flasche.»: se cae de espaldas: las piernas al aire, la bandeja vuela
shot(40.17, 'C', null, L => { town(L); const k = easeIn(clamp((L.T - 40.2) / .45)); const b = seat(bak, BKP.x, BKP.z, .5, L, { wob: 0, pose: { aLx: 2.4, aRx: 2.4, aLz: .8, aRz: .8, aLe: .3, aRe: .3, lLk: .4, lRk: .4, lLx: 1.6 + k * .6, lRx: 1.4 + k * .6 } });
  b.root.rotation.z = k * 1.3; b.root.position.x += k * 2.6; b.root.position.y -= k * (SEAT - 1.8); cara(b, L.T, { expr: 'shock', mouth: 'scream' });
  dust(V(BKP.x, 0, BKP.z - 3), 40.6, L.T, 10, .6); stars(b, L.T, L.T > 40.7 ? 4 : 0);
  plaza(L, { cx: BKP.x, cz: BKP.z - 6, n: 8, r0: 6, r1: 16, seed: 43, mode: 'shock' });
  orbit(V(BKP.x + 1.4, 3, BKP.z), 18, .5, .16, 46); sh(BKP, 16); }, [[.05, 'whoosh_down', .45], [.45, 'thud', .7], [.55, 'glass_clink', .35]]);

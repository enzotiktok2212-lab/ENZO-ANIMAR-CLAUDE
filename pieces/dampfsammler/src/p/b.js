// ---------- b: el gamer, la prohibición, el club sin nubes, «los elige» (31,09 – 56,19 s) ----------
const KDP = V(AX, 0, 7.2);                        // silla de Kai (mira a -z, hacia su pantalla)
const kaiSit = (L, o = {}) => { show(DESK, AX, 0, 4, 0); show(CHAIR, KDP.x, 0, KDP.z, PI + (o.spin || 0)); const k = put(kai, KDP.x, sitY(kai, 2.35), KDP.z, PI + (o.spin || 0));
  const s = Math.sin(L.T * 18); actuar(k, 0, [[0, seatPose({ aLx: 1.15, aRx: 1.15, aLz: -.25, aRz: -.25, aLe: 1.05 + s * .05, aRe: 1.05 - s * .05, lean: .12, headX: .08, ...(o.pose || {}) })]], { T: L.T }); return k; };
const arenaCrowd = (L, o = {}) => crowdGrid(L, AX, 18, 6, 2, 4.2, 4, { face: V(AX, 4, 4), mode: 'cheer', jit: .2, seed: 13, from: 8, ...o });
const LIT = V(32, 0, 2);                         // la Litfaßsäule (en la plaza)

// 24 «unser bester Gamer verschwand»: la sala del torneo: Kai en la mesa del centro, la gran pantalla FINALE, el público
shot(31.09, 'S', null, L => { arena(L); kaiSit(L); cara(kai, L.T, { expr: 'determined' }); arenaCrowd(L);
  cm([AX - 15, 11, -4], [AX - 13, 10, -2], L.k); camera.lookAt(AX, 4.5, 6.5); camera.fov = 50; sh(V(AX, 0, 6), 30); }, [[0, 'cheer', .45], [.3, 'keys', .4]]);
// 25 «mitten in einem Turnier.»: de lado: dedos a toda velocidad en el teclado, la pantalla con la partida
shot(32.53, 'C', null, L => { arena(L); kaiSit(L); cara(kai, L.T, { expr: 'determined', mouth: 'flat' });
  cm([AX - 7.5, 6.4, 3.2], [AX - 6.8, 6.2, 4.0], L.k); camera.lookAt(AX, 4.6, 6.4); camera.fov = 44; sh(V(AX, 0, 6), 16); }, [[0, 'keys', .55], [.6, 'click_set', .4]]);
// 26 «Er war komplett konzentriert»: primer plano: Kai sin parpadear, la luz de la pantalla en la cara
shot(33.88, 'Z', null, L => { arena(L); kaiSit(L, { pose: { headX: .02 } }); cara(kai, L.T, { expr: 'determined', eyes: 'squint', mouth: 'flat', noBlink: true });
  const h = hp(kai); cm([h.x - 3.6, h.y + .6, h.z - 3.2], [h.x - 3.0, h.y + .5, h.z - 2.7], L.k); camera.lookAt(h.x, h.y + .2, h.z); camera.fov = 40; sh(KDP, 12); }, [[0, 'heartbeat', .4], [.5, 'keys', .4]]);
// 27 «und zog heimlich an seiner»: mira a los lados y se lleva la vape a la boca a escondidas
shot(35.34, 'W', null, L => { arena(L); const k = kaiSit(L); vaper(k, L, 35.92, .7, { expr: 'sus', pose: seatPose({ aLx: 1.15, aLz: -.25, aLe: 1.05, lean: .12 }), exh: 1.5, pow: 6, size: 1.8, n: 70 }); k.neck.rotation.y += Math.sin(L.lt * 6) * .35;
  cm([AX - 6.8, 6.6, 2.4], [AX - 6.0, 6.4, 3.0], L.k); camera.lookAt(AX, 5.0, 7); camera.fov = 42; sh(KDP, 14); }, [[.2, 'cloth', .35], [.6, 'vape_in', .7]]);
// 28 «Vape: Pfffffff!»: la nube sale por encima de la mesa y tapa la pantalla
shot(36.67, 'C', 'punch', L => { arena(L); const k = kaiSit(L); vaper(k, L, 35.92, .7, { expr: 'smug', pose: seatPose({ aLx: 1.15, aLz: -.25, aLe: 1.05, lean: .12 }), exh: 1.5, pow: 7, size: 2.2, n: 90, dens: .95 }); arenaCrowd(L, { mode: 'idle', expr: 'neutral' });
  cm([AX - 11, 9, 0], [AX - 10, 9.5, 1], L.k); camera.lookAt(AX, 5.6, 6.5); camera.fov = 46; sh(KDP, 22); }, [[.45, 'vape_out', .8]]);
// 29 «Und zack! Sein»: la garra sale de la nube: Kai y la criatura desaparecen en un remolino
shot(37.78, 'F', null, L => { arena(L); const k = kaiSit(L); actuar(k, 0, [[0, seatPose({ ...GEST.shock })]], { T: L.T }); cara(k, L.T, { expr: 'shock', mouth: 'scream' });
  SMK.haze(V(AX, 6, 5), L.T, 18, 4, 3, 3, 4, .5, 51); samAt(L, AX - 2.2, KDP.z + 2.8, PI + .6, { reach: 1, grab: true }); appear(L, 37.78, V(AX - 2.2, 0, KDP.z + 2.8), .2); takeAway(L, [k, sam], 37.95, V(AX - 1, 0, KDP.z + 1), .65);
  cm([AX - 12, 8, 2], [AX - 11.5, 8.2, 2.6], L.k); camera.lookAt(AX - 1, 5.4, KDP.z + 1.2); camera.fov = 46; sh(KDP, 20); }, [[0, 'impact', .6], [.2, 'whirl', .5], [.5, 'sparkle', .4]]);
// 30 «Gaming-Stuhl war leer.»: la silla vacía sigue girando; los cascos caen al suelo; el público se levanta
shot(39.00, 'R', null, L => { arena(L); show(DESK, AX, 0, 4, 0); show(CHAIR, KDP.x, 0, KDP.z, PI + L.lt * 2.4); arenaCrowd(L, { mode: 'shock' });
  SMK.haze(V(AX, 5, 7), L.T, 8, 4, 2, 2, 4, .22, 53);
  cm([AX + 7, 8, 14], [AX + 6, 7.6, 12.5], L.k); camera.lookAt(AX, 3.4, KDP.z); camera.fov = 44; sh(KDP, 22); }, [[0, 'chair_roll', .6], [.5, 'murmur', .45]]);
// 31 «Deshalb ist Dampfen seitdem»: un operario atornilla un cartel nuevo «DAMPFEN VERBOTEN» en la plaza
shot(40.17, 'S', null, L => { town(L); const w = put(EX[11], 12.4, 0, -5.6, .25); actuar(w, 0, [[0, { aRx: 2.0 + Math.sin(L.T * 14) * .15, aRz: -.2, aRe: .6, aLx: 1.8, aLz: -.3, aLe: .7, headX: -.25 }]], { T: L.T }); cara(w, L.T, { expr: 'determined', mouth: 'flat' });
  crowdAt(L, 10, -6, 5, 7, 13, 17, { mode: 'look', expr: 'worried', face: V(10, 6, -6) });
  cm([17, 6, 6], [16, 6.2, 5], L.k); camera.lookAt(11.5, 5.4, -6); camera.fov = 44; sh(V(10, 0, -4), 18); }, [[0, 'ratchet', .55], [.6, 'hammer', .45]]);
// 32 «verboten. Überall hängen»: travelling por la calle: cartel tras cartel en farolas y fachadas
shot(41.45, 'Z', null, L => { town(L); crowdAt(L, -10, 6, 8, 6, 18, 19, { mode: 'walk', speed: 1.6, full: true, gap: .3 });
  cm([30, 9, 34], [20, 9, 30], L.k); camera.lookAt(-14, 7, 4); camera.fov = 48; sh(V(0, 0, 10), 40); }, [[0, 'whoosh_soft', .35], [.3, 'steps', .35]]);
// 33 «Warnschilder. Im Club»: la columna de anuncios llena de carteles; dos vecinos la leen y se miran
shot(42.60, 'F', null, L => { town(L); show(LITF, LIT.x, 0, LIT.z, -.3); [EX[15], EX[16]].forEach((c, i) => { put(c, LIT.x + (i ? 3.4 : -3.4), 0, LIT.z + 5.4, i ? -2.7 : 2.7); actuar(c, 0, [[0, { headX: -.15, aLx: .2, aRx: i ? 1.4 : .2, aRe: i ? 1.6 : 0 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); });
  cm([LIT.x - 2, 7.5, LIT.z + 25], [LIT.x - 1.6, 7.6, LIT.z + 23], L.k); camera.lookAt(LIT.x, 6.4, LIT.z + 2); camera.fov = 46; sh(LIT, 18); }, [[0, 'paper', .5], [.5, 'hmm', .35]]);
// 34 «feiern alle ohne eine einzige»: el club lleno, todos bailando y ni una nube; carteles DAMPFEN VERBOTEN en las paredes
shot(43.87, 'W', null, L => { clubS(L, { clean: true }); djPlay(L); clubCrowd(L, { mode: 'dance' });
  cm([CX + 22, 11, 14], [CX + 18, 10.5, 12], L.k); camera.lookAt(CX - 4, 6, -12); camera.fov = 50; sh(V(CX, 0, -6), 34); }, [[0, 'bass_hit', .45], [.4, 'cheer', .35]]);
// 35 «Wolke. Aber etwas»: un chico saca la vape en la pista; su amiga le baja la mano y señala el cartel
shot(45.20, 'S', null, L => { clubS(L, { clean: true }); const a = put(EX[12], CX + 4, 0, 6, -.4), b = put(EX[13], CX + 7, 0, 5.4, -1.3); VP.get(a).visible = true; VP.get(a).userData.grip.visible = true;
  const dn = clamp((L.lt - .35) / .3); actuar(a, 0, [[0, { ...armVape(lerp(.6, 0, dn)), headY: .4 }]], { T: L.T }); a.aR.sh.rotation.y = armVape(lerp(.6, 0, dn)).aRy; cara(a, L.T, { expr: dn > .5 ? 'worried' : 'smug', mouth: dn > .5 ? 'frown' : 'smirk' });
  actuar(b, 0, [[0, { aRx: lerp(.6, 1.1, dn), aRz: -.6, aRe: .4, aLx: lerp(.3, 2.2, clamp((L.lt - .6) / .25)), aLz: .4, headX: .05 }]], { T: L.T }); cara(b, L.T, { expr: 'angry', mouth: 'talk' });
  clubCrowd(L, { mode: 'dance', from: 14 });
  cm([CX + 8, 6.4, 18], [CX + 7.4, 6.2, 16.5], L.k); camera.lookAt(CX + 5.4, 4.2, 5.6); camera.fov = 42; sh(V(CX + 5, 0, 6), 16); }, [[.35, 'slap', .45], [.7, 'tsk', .4]]);
// 36 «war seltsam. Der DJ»: yo delante de la columna, mirando los tres carteles VERMISST, pensativo
shot(46.48, 'I', null, L => { town(L, { dusk: true }); show(LITF, LIT.x, 0, LIT.z, -.3); const m = put(ich, LIT.x - 4, 0, LIT.z + 9, -PI + .7); actuar(m, 0, [[0, { aRx: 1.6, aRz: -.1, aRe: 2.1, aLx: .9, aLz: .1, aLe: 1.5, headX: -.15, headY: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'think', eyes: 'up', mouth: 'wavy' });
  cm([LIT.x - 12, 7, LIT.z + 21], [LIT.x - 11, 6.8, LIT.z + 20], L.k); camera.lookAt(LIT.x - 3.6, 5.2, LIT.z + 8); camera.fov = 46; sh(LIT, 18); }, [[0, 'hmm', .45], [.4, 'creepy_ting', .35]]);
// 37 «war der beste der Stadt.»: recuerdo: DJ Blitz con su trofeo, lluvia de confeti en el club
shot(47.85, 'C', null, L => { clubS(L); const d = put(dj, DJP.x, DJP.y, DJP.z + 2.6, 0); attach(TROPHY, d.aR.hand, [0, -.5, .4], [0, 0, 0], .8); actuar(d, 0, [[0, { aRx: 2.9, aRz: .2, aRe: .1, aLx: 1.6, aLz: .5, aLe: .8 }]], { T: L.T }); grin(d, L.T); confRain(V(DJP.x, DJP.y, DJP.z + 2), L.T, 60, 14, 8, 14);
  orbit(V(DJP.x, DJP.y + 4.6, DJP.z + 2.6), 13, -.2, -.02, 42); badge('gold', 'BESTER DJ', W / 2, H * .15, clamp(L.lt / .15), 1, .9); grade.uniforms.sepia.value = .18; sh(DJP, 16); }, [[0, 'confetti', .5], [.2, 'cheer', .4]]);
// 38 «Der Dampfring-Meister hatte»: recuerdo: Rocco con medallas en la tarima, haciendo un aro perfecto
shot(49.22, 'W', null, L => { town(L); const r = put(rocco, RKP.x, RKP.y, RKP.z, 0); actuar(r, 0, [[0, { aLx: 2.6, aLz: .5, aLe: .4, aRx: .4, aRz: .2, aRe: 1.4 }]], { T: L.T }); grin(r, L.T); RINGS.forEach((rg, i) => { if (i > 2) return; rg.visible = true; rg.position.set(RKP.x + 1.6, RKP.y + 6.4 + i * 1.4 + L.lt, RKP.z + 1); rg.lookAt(camera.position); rg.scale.setScalar(.8 + i * .3); rg.material.opacity = .7; });
  confRain(V(RKP.x, RKP.y, RKP.z), L.T, 40, 12, 8, 14); badge('gold', 'MEISTER', W / 2, H * .15, clamp(L.lt / .15), 1, .9);
  orbit(V(RKP.x, RKP.y + 4.4, RKP.z), 12.5, .25, .0, 42); grade.uniforms.sepia.value = .18; sh(RSP, 16); }, [[0, 'pling', .5], [.4, 'clap', .45]]);
// 39 «jeden Rekord gebrochen.»: el marcador: REKORD tras REKORD, y explota de confeti
shot(50.36, 'Z', null, L => { town(L); RS.drawScore(String(Math.floor(lerp(60, 99, clamp(L.lt / 1)))), 'REKORD!'); confetti(V(RSP.x + 6, 6, RSP.z - 1), L.t0 + .4, L.T, 50, .8); const r = put(rocco, RKP.x, RKP.y, RKP.z, .5); actuar(r, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .4, aRz: .4 }]], { T: L.T }); laughF(r, L.T);
  cm([RSP.x + 7, 9, RSP.z + 12], [RSP.x + 7.5, 9, RSP.z + 10.5], L.k); camera.lookAt(RSP.x + 11.8, 8.2, RSP.z - 2); camera.fov = 46; grade.uniforms.sepia.value = .18; sh(RSP, 20); }, [[0, 'beep', .45], [.4, 'party_horn', .45]]);
// 40 «Und der Gamer war unschlagbar.»: recuerdo: Kai levanta el trofeo; en la pantalla gigante «UNSCHLAGBAR»
shot(51.72, 'F', null, L => { arena(L); const k = put(kai, AX, 0, 4, 0); attach(TROPHY, k.aR.hand, [0, -.5, .4], [0, 0, 0], .8); actuar(k, 0, [[0, { aRx: 2.9, aRz: .2, aRe: .1, aLx: 2.6, aLz: .4, aLe: .4 }]], { T: L.T }); laughF(k, L.T); confRain(V(AX, 0, 4), L.T, 60, 14, 10, 14);
  orbit(V(AX, 4.2, 4), lerp(13, 11.5, L.k), .2, .02, 44); badge('gold', 'UNSCHLAGBAR', W / 2, H * .15, clamp(L.lt / .15), 1, .9); grade.uniforms.sepia.value = .18; sh(V(AX, 0, 4), 18); }, [[0, 'cheer', .5], [.3, 'confetti', .4]]);
// 41 «Fast so, als würde der» (zoom lento): de noche: la criatura delante de la columna, una garra sobre los tres carteles VERMISST
shot(53.50, 'S', 'slow', L => { town(L, { night: true }); show(LITF, LIT.x, 0, LIT.z, -.3); samAt(L, LIT.x - 2.6, LIT.z + 6.0, -.9, { reach: .7, headX: .2 });
  cm([LIT.x - 6, 7, LIT.z + 26], [LIT.x - 4.5, 7.4, LIT.z + 18], easeIn(L.k)); camera.lookAt(LIT.x - 1.4, 7.2, LIT.z + 3); camera.fov = 46; sh(LIT, 20); }, [[0, 'wind_howl', .4]]);
// 42 «Dampfsammler sie aussuchen.»: primer plano: los ojos se entornan y brillan más
shot(54.93, 'C', 'punch', L => { town(L, { night: true }); show(LITF, LIT.x, 0, LIT.z, -.3); const s = samAt(L, LIT.x - 2.4, LIT.z + 6.4, -.4, { reach: .2, glow: 1 + Math.sin(L.T * 9) * .25 });
  const h = hp(s), a = s.root.rotation.y; cam([h.x + Math.sin(a) * 9, h.y + .4, h.z + Math.cos(a) * 9], [h.x, h.y - .8, h.z], 42); sh(LIT, 14); }, [[0, 'magic_hit', .5], [.3, 'whisper', .4]]);

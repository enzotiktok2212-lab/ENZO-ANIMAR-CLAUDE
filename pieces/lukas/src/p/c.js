// ---------- c: el Hausmeister, la pista, el policía se ríe, el estadio, el micrófono (66,25 – 97,44 s) ----------
const BENCH = V(YARD.x + 9, 0, YARD.z + 12);   // yo sentado en una caja del patio con un helado (mirando -z… hacia la cámara en +z)
const NEWP = V(YARD.x - 2, 0, YARD.z - 10);    // el Neuer al fondo del patio, de espaldas, con el móvil
const BOOTHW = V(SX - 35.8, 12.8, 27.8);       // yo dentro de la cabina (mirando +x)
const meBench = (L, o = {}) => { show(CRATE, BENCH.x, 0, BENCH.z, 0, .8); const m = put(me, BENCH.x, sitY(me, 1.0), BENCH.z, o.ry ?? 0); actuar(m, 0, [[0, { lLx: 1.4, lRx: 1.4, lLk: 1.2, lRk: 1.2, aRx: 1.7, aRz: -.3, aRe: 2.0, aLx: .3, aLz: .3, headX: .1, ...(o.pose || {}) }]], { T: L.T });
  const rh = wpos(m.aR.hand); show(ICE, rh.x, rh.y + .5, rh.z, 0, 1.1); return m; };
const newcomer = (L, o = {}) => { const d = put(det, NEWP.x, 0, NEWP.z, o.ry ?? PI); actuar(d, 0, [[0, GEST.phone_look || { aRx: 1.4, aRz: -.2, aRe: 1.8, headX: .3 }]], { T: L.T }); cara(d, L.T, { expr: 'smug', eyes: 'down', mouth: 'smirk' }); const rh = wpos(d.aR.hand); show(PHONES[0], rh.x, rh.y + .4, rh.z, d.root.rotation.y, .8); return d; };
const kidsTurned = (L, turnAt, o = {}) => crowdAt(L, YARD.x, YARD.z, 18, 4, 14, o.seed || 56, { mode: 'turn', turnAt, full: true, list: BOYZ, jit: .2, expr: 'happy', face: o.face, gap: .9 });
const HMP = V(YARD.x - 9, 0, YARD.z + 9);       // el Hausmeister, junto a la puerta del colegio

// 53 «Am nächsten Tag in der Pause»: el patio al día siguiente, lleno; la campana
shot(66.25, 'I', null, L => { town(L); yardKids(L, 20, { mode: 'cheer', seed: 53 });
  cm([YARD.x - 10, 20, YARD.z + 30], [YARD.x - 6, 15, YARD.z + 26], L.k); camera.lookAt(YARD.x, 3, YARD.z - 6); camera.fov = 48; sh(YARD, 30); }, [[0, 'school_bell', .5], [.3, 'kids_laugh', .45]]);
// 54 «rief der Hausmeister:»: el Hausmeister, escoba en mano, se lleva la mano a la boca
shot(67.49, 'S', null, L => { town(L); const c = put(mut, HMP.x, 0, HMP.z, .6); actuar(c, 0, [[0, { aLx: 2.2, aLz: .2, aLe: 2.2, aRx: .9, aRz: -.3, aRe: .4, lean: -.06 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'o' });
    orb(L.k, V(HMP.x, 3.4, HMP.z), null, [11, .9, .1, 42], [9.5, .7, .08, 42]); sh(HMP, 14); }, [[0, 'broom', .45], [.4, 'breath', .35]]);
// 55 «Lukas, da hat jemand nach dir gefragt!»: primer plano gritando
shot(68.64, 'C', null, L => { town(L); const c = put(mut, HMP.x, 0, HMP.z, .6); actuar(c, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .2, aRz: .2, aLe: 2.2, aRe: 2.2, lean: -.1, headX: -.15 }]], { T: L.T }); talk(c, L.T, 68.6, 70.4, 'shout');
  bubble(c, 'LUKAS!', clamp(L.lt / .1), 1.4); onFace(c, 4.4, .2, .3, 40, L.k, 3.9); sh(HMP, 12); }, [[0, 'shout_m', .5]]);
// 56 «Dreihundert Köpfe drehten sich um.»: grúa: todos los chicos del patio se giran; «300»
shot(70.36, 'F', null, L => { town(L); kidsTurned(L, L.t0 + .25, { face: V(HMP.x, 3, HMP.z) }); newcomer(L); meBench(L, { ry: -.3 }); cara(me, L.T, { expr: 'happy', eyes: 'closed', mouth: 'smile' });
  cm([YARD.x + 8, 22, YARD.z + 30], [YARD.x + 5, 18, YARD.z + 26], L.k); camera.lookAt(YARD.x, 2, YARD.z); camera.fov = 48; badge('gold', '300', W / 2, H * .15, clamp((L.lt - .3) / .15), 1, .95); sh(YARD, 26); }, [[0, 'whoosh_soft', .4], [.2, 'crowd_run', .45]]);
// 57 «sich um.»: plano bajo: las caras de los chicos, todas giradas hacia el Hausmeister
shot(71.73, 'W', null, L => { town(L); const p = V(YARD.x - 3, 0, YARD.z + 2); crowdGrid(L, p.x, p.z, 5, 2, 3.2, 3.4, { mode: 'turn', turnAt: L.t0 - 2, list: BOYZ, face: V(p.x - 20, 3, p.z + 26), seed: 57, expr: 'happy' });
  cm([p.x - 9, 3.4, p.z + 12], [p.x - 8, 3.2, p.z + 10], L.k); camera.lookAt(p.x, 3.4, p.z + 2); camera.fov = 48; sh(p, 16); }, [[0, 'murmur', .4]]);
// 58 «Außer meinem.»: yo, sentado con mi helado, ni me inmuto
shot(72.59, 'C', 'punch', L => { town(L); const m = meBench(L); cara(m, L.T, { expr: 'happy', eyes: 'closed', mouth: 'smile' });
  cm([BENCH.x + 1.5, 3.4, BENCH.z + 8.6], [BENCH.x + 1.2, 3.2, BENCH.z + 7.6], L.k); camera.lookAt(BENCH.x, 2.6, BENCH.z); camera.fov = 42; sh(BENCH, 12); }, [[0, 'sip', .45]]);
// 59 «Deshalb war ich der Einzige,»: me doy cuenta: abro los ojos de golpe, el helado gotea
shot(73.42, 'S', null, L => { town(L); const m = meBench(L, { pose: { headY: -.25 } }); cara(m, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  const h = hp(m); cm([h.x - 2.6, h.y + .3, h.z + 5.2], [h.x - 2.2, h.y + .2, h.z + 4.6], L.k); camera.lookAt(h.x, h.y - .7, h.z); camera.fov = 40; sh(BENCH, 12); }, [[0, 'ding_soft', .4], [.3, 'drip', .35]]);
// 60 «der es gesehen hat:»: mis ojos se entrecierran (zoom)
shot(74.54, 'Z', null, L => { town(L); const m = meBench(L, { pose: { headY: -.25 } }); cara(m, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' });
  const h = hp(m); cm([h.x - .8, h.y + .7, h.z + 3.4], [h.x - .5, h.y + .7, h.z + 2.6], L.k); camera.lookAt(h.x, h.y + .1, h.z); camera.fov = 38; sh(BENCH, 10); }, [[0, 'tension_str', .35]]);
// 61 «Der Neue hat sich auch nicht umgedreht.» (zoom lento): todos mirando al Hausmeister… menos el Neuer, de espaldas con el móvil
shot(75.53, 'C', 'slow', L => { town(L); crowdAt(L, NEWP.x, NEWP.z, 12, 3.5, 10, 61, { mode: 'turn', turnAt: L.t0 - 3, list: BOYZ, face: V(NEWP.x, 3, NEWP.z + 40), gap: 1.0 }); const d = newcomer(L);
  cm([NEWP.x + .5, 7, NEWP.z + 22], [NEWP.x + .3, 4.6, NEWP.z + 10.5], easeIn(L.k)); camera.lookAt(NEWP.x, 3, NEWP.z); camera.fov = 44; sh(NEWP, 16); }, [[0, 'heartbeat', .45]]);
// 62 «Denn wenn jemand deinen Namen ruft,»: en la calle, una mujer llama a un chico que se aleja
shot(77.39, 'W', null, L => { town(L); const p = V(-14, 0, 30); const a = put(GIRLX[3], p.x - 3, 0, p.z, PI / 2 - .3); actuar(a, 0, [[0, { aRx: 2.2, aRz: .2, aRe: 2.0, aLx: .3 }]], { T: L.T }); talk(a, L.T, 77.3, 78.6, 'happy');
  walkTo(BOYZ[6], p.x + 1.5, p.z - 1.5, PI - .3, 1.6, L, 0, 8); cara(BOYZ[6], L.T, { expr: 'neutral' }); bubble(a, 'Lukas!', clamp((L.lt - .3) / .1), 1.5);
  orb(L.k, V(p.x - .5, 3, p.z - 1.5), null, [16, .25, .12, 46], [14.5, .15, .1, 46]); sh(p, 16); }, [[0, 'steps', .4], [.4, 'pop', .35]]);
// 63 «drehst du dich um,»: ¡zas! se gira al instante
shot(79.05, 'C', 'punch', L => { town(L); const p = V(-14, 0, 30); const c = put(BOYZ[6], p.x + 4.5, 0, p.z - 3, lerp(PI / 2 + .4, -PI / 2 + .3, easeOut(clamp(L.lt / .18)))); actuar(c, 0, [[0, { aLx: .5, aRx: .5, aLz: .5, aRz: .5, lean: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'wide', mouth: 'o' });
  badge('q', '!', W * .7, H * .22, clamp((L.lt - .1) / .1), 1, .9); onBody(c, 9, -.1, .06, 42, L.k, 8); sh(p, 14); }, [[0, 'whoosh_soft', .45], [.1, 'boing_metal', .3]]);
// 64 «ohne nachzudenken.»: hasta el gato (placa LUKAS) gira la cabeza de golpe
shot(79.81, 'R', null, L => { town(L); const DP = V(16.3, 0, 113); show(CAT, DP.x, 0, DP.z, -.5, 1); CAT.userData.head.rotation.y = lerp(1.6, 0, easeOut(clamp((L.lt - .15) / .12))); CAT.userData.tail.rotation.x = Math.sin(L.T * 6) * .3;
  const m = put(mama, DP.x + 4.2, 0, DP.z - 1.6, -.9); actuar(m, 0, [[0, { aRx: 2.2, aRz: .2, aRe: 2.0 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'o' });
  badge('q', '!', W * .5, H * .2, clamp((L.lt - .2) / .1), 1, .8); orb(L.k, V(DP.x + .6, 2.0, DP.z + .5), null, [10, -.5, .1, 42], [8.5, -.4, .08, 42]); sh(DP, 14); }, [[0, 'meow', .55], [.2, 'boing_metal', .3]]);
// 65 «Also hieß er gar nicht»: yo, el dedo en alto: ¡lo tengo!
shot(80.86, 'F', null, L => { town(L); const m = put(me, BENCH.x, 0, BENCH.z + 2, .15); actuar(m, 0, [[0, { aRx: 2.9, aRz: -.2, aRe: .2, aLx: .3, headX: -.05 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', eyes: 'wide', mouth: 'open_smile' });
  onBody(m, 8, .15, .08, 42, L.k, 7); badge('gold', '!', W * .66, H * .2, clamp(L.lt / .1), 1, .8); sh(BENCH, 12); }, [[0, 'ding_reveal', .5]]);
// 66 «Lukas.»: su placa LUKAS, en grande… y tachada
shot(81.46, 'Z', null, L => { town(L); const d = put(det, NEWP.x, 0, NEWP.z, .2); actuar(d, 0, [[0, { aLx: .3, aRx: .3, headX: .2 }]], { T: L.T }); cara(d, L.T, { expr: 'worried', eyes: 'side_l', mouth: 'wavy' }); sweat(d, L.T);
  d.setTag(null); const ch = wpos(d.spine); show(TAGBIG, ch.x + .5, ch.y + 1.5, ch.z + .7, .2, .34); TAGBIG.userData.set('LUKAS', L.lt > .3);
  const a = .2; cm([NEWP.x + .9 + Math.sin(a) * 5, 3.6, NEWP.z + 6], [NEWP.x + .7 + Math.sin(a) * 4, 3.4, NEWP.z + 5], L.k); camera.lookAt(ch.x + .5, ch.y + 1.4, ch.z); camera.fov = 40; sh(NEWP, 12); }, [[0, 'zoom_in', .4], [.3, 'pencil', .55]]);
// 67 «Er hat es nur gesagt,»: el Neuer me guiña un ojo
shot(82.37, 'S', null, L => { town(L); const d = put(det, NEWP.x, 0, NEWP.z, .25); actuar(d, 0, [[0, { aLx: .4, aRx: 1.4, aRz: -.2, aRe: 1.8, headZ: .12 }]], { T: L.T }); cara(d, L.T, { expr: 'wink', eyes: 'wink', mouth: 'smirk' });
  const rh = wpos(d.aR.hand); show(PHONES[0], rh.x, rh.y + .4, rh.z, .25, .8); onFace(d, 5, .2, .3, 42, L.k, 4.4); sh(NEWP, 12); }, [[0, 'evil_laugh', .35]]);
// 68 «um die Pakete abzuholen.»: recuerdo (sepia): él en el mostrador, cogiendo los paquetes
shot(83.37, 'W', null, L => { shop(L); grade.uniforms.sepia.value = .55; clerkAt(L, { aLx: 1.5, aRx: 1.5, aLz: -.2, aRz: -.2, aLe: .3, aRe: .3, lean: .15 }, { expr: 'happy', eyes: 'happy', mouth: 'grin' });
  for (let i = 0; i < 4; i++) show(PKGS[i], PX - 2.4 + (i % 2) * 2.4, 4.5 + Math.floor(i / 2) * 1.6, -4, 0, .7); put(det, CUST.x, 0, CUST.z, PI); actuar(det, 0, [[0, { aLx: 1.6, aRx: 1.6, aLz: -.3, aRz: -.3, aLe: .5, aRe: .5 }]], { T: L.T }); grin(det, L.T);
  cm([PX - 8, 8, 1], [PX - 7, 7.6, 0], L.k); camera.lookAt(PX, 5, -4); camera.fov = 46; sh(V(PX, 0, -3), 14); }, [[0, 'box_slide', .45]]);
// 69 «Ich hab's Polizist Lukas»: corro hasta el policía junto al coche patrulla
shot(84.70, 'C', null, L => { town(L); const p = V(24, 0, 24); put(pol, p.x, 0, p.z, .3); actuar(pol, 0, [[0, GEST.cross]], { T: L.T }); cara(pol, L.T, { expr: 'neutral' });
  const m = put(me, p.x - 6 + L.lt * 4.4, Math.abs(Math.sin(L.T * 14)) * .2, p.z + 2.2, PI / 2 + .2); actuar(m, 0, [[0, walkP(L.T, 0, 14)]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'talk_wide' });
  orb(L.k, V(p.x - 1.5, 3, p.z + 1), null, [13, .1, .1, 44], [11.5, .2, .08, 44]); sh(p, 16); }, [[0, 'steps_run', .55]]);
// 70 «erzählt.»: se lo cuento todo gesticulando
shot(85.52, 'F', null, L => { town(L); const p = V(24, 0, 24); put(pol, p.x + 1.6, 0, p.z, -PI / 2 + .5); actuar(pol, 0, [[0, GEST.cross]], { T: L.T }); cara(pol, L.T, { expr: 'sus', mouth: 'flat' });
  const m = put(me, p.x - 1.6, 0, p.z + .4, PI / 2 - .5); actuar(m, 0, [[0, { aLx: 1.2 + Math.sin(L.T * 9) * .4, aRx: 1.2 + Math.cos(L.T * 8) * .4, aLz: .4, aRz: .4, aLe: .8, aRe: .8 }]], { T: L.T }); talk(m, L.T, 85.5, 86.4, 'determined');
  orb(L.k, V(p.x, 3.2, p.z), null, [11.5, .1, .1, 42], [10.5, -.05, .08, 42]); sh(p, 14); }, [[0, 'whisper', .35]]);
// 71 «Aber er hat mich nur ausgelacht.»: el policía se parte de risa; yo, enfadado
shot(86.51, 'Z', null, L => { town(L); const p = V(24, 0, 24); const c = put(pol, p.x + .6, 0, p.z, -.25); actuar(c, 0, [[0, { aLx: 1.0, aRx: 1.0, aLz: -.5, aRz: -.5, aLe: 1.4, aRe: 1.4, lean: -.15 + Math.sin(L.T * 18) * .06, headX: -.25 }]], { T: L.T }); laughF(c, L.T);
  const m = put(me, p.x - 2.8, 0, p.z - 1.2, .5); actuar(m, 0, [[0, GEST.fists]], { T: L.T }); cara(m, L.T, { expr: 'angry', mouth: 'grimace' });
  onBody(c, 9.5, -.15, .08, 42, L.k, 8.5); sh(p, 14); }, [[0, 'laugh_deep', .55]]);
// 72 «Also musste ich es allen zeigen.»: camino decidido por la calle
shot(88.05, 'S', null, L => { town(L); const m = walkTo(me, 0, 52, PI, 2.4, L, 0, 9); cara(m, L.T, { expr: 'determined', mouth: 'flat' }); const mp = m.root.position;
  orbit(V(mp.x, 2.9, mp.z), 9.5, PI + .2, .05, 42); sh(mp, 14); }, [[0, 'steps', .5]]);
// 73 «Beim Fußballspiel am Samstag»: el estadio lleno; jugadores en el campo
shot(90.00, 'I', null, L => { stadium(L); stands(L, { mode: 'watch', list: CROWD.filter(c => c !== det), cols: 6 });
  [EX[20], EX[21], EX[22], EX[23]].forEach((c, i) => { const x = SX - 8 + i * 5 + Math.sin(L.T + i) * 2, z = -6 + (i % 2) * 9; put(c, x, Math.abs(Math.sin(L.T * 12 + i)) * .2, z, PI / 2 * (i % 2 ? 1 : -1)); actuar(c, 0, [[0, walkP(L.T, i, 13)]], { T: L.T }); cara(c, L.T + i, { expr: 'determined' }); });
  cm([SX + 26, 26, 40], [SX + 18, 20, 32], L.k); camera.lookAt(SX - 18, 4, 0); camera.fov = 50; badge('tag', 'SAMSTAG', W / 2, H * .14, clamp((L.lt - .7) / .15), 1, .9); sh(V(SX - 12, 0, 0), 40); }, [[0, 'stadium', .5], [.3, 'whistle', .45]]);
// 74 «hab ich mich in die»: me cuelo por detrás de la grada, de puntillas
shot(91.28, 'W', null, L => { stadium(L); const m = put(me, SX - 47, 0, 10 + L.lt * 3.4, 0); actuar(m, 0, [[0, GEST.sneak]], { T: L.T }); cara(m, L.T, { expr: 'sus', eyes: 'side_r', mouth: 'flat' });
  const mp = m.root.position; orbit(V(mp.x, 2.6, mp.z), 9, -.9, .1, 42); sh(mp, 14); }, [[0, 'sneak_steps', .45]]);
// 75 «Sprecherkabine vom Stadion geschlichen,»: la cabina del speaker en lo alto; yo entro
shot(91.94, 'S', null, L => { stadium(L); stands(L, { mode: 'watch', list: CROWD.filter(c => c !== det), cols: 6 }); const m = put(me, BOOTHW.x - 1.8 + easeOut(clamp(L.lt / 1)) * 1.8, BOOTHW.y, BOOTHW.z - 2, PI / 2 - .6); actuar(m, 0, [[0, GEST.sneak]], { T: L.T }); cara(m, L.T, { expr: 'sus', eyes: 'side_l' });
  cm([SX - 20, 18, 40], [SX - 22, 17, 37], L.k); camera.lookAt(SX - 35, 15, 26); camera.fov = 44; sh(V(SX - 34, 12, 26), 18); }, [[0, 'door_creak', .45], [.5, 'stadium', .35]]);
// 76 «mir das Mikrofon geschnappt»: agarro el micrófono del soporte
shot(93.76, 'C', null, L => { stadium(L); const m = put(me, BOOTHW.x, BOOTHW.y, BOOTHW.z, PI / 2); const g = L.lt > .35; actuar(m, 0, [[0, { aRx: g ? 1.8 : lerp(.6, 1.5, L.lt / .35), aRz: -.2, aRe: 1.5, aLx: .4, aLz: .3 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'smirk' });
  if (g) attach(BOOTH.mic, m.aR.hand, [0, -.6, .4], [0, 0, 0], 1);
  const h = hp(m); cm([h.x + 7.5, h.y + .5, h.z + 2.2], [h.x + 6.4, h.y + .4, h.z + 1.8], L.k); camera.lookAt(h.x, h.y - .6, h.z); camera.fov = 42; sh(BOOTHW, 12); }, [[0, 'click_metal', .55], [.4, 'radio', .3]]);
// 77 «und gesagt:» (zoom lento): cojo aire
shot(94.92, 'Z', 'slow', L => { stadium(L); const m = put(me, BOOTHW.x, BOOTHW.y, BOOTHW.z, PI / 2); actuar(m, 0, [[0, { aRx: 1.9, aRz: -.25, aRe: 1.7, aLx: .4, aLz: .3, lean: -.06, headX: -.08 }]], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: 'o' }); attach(BOOTH.mic, m.aR.hand, [0, -.6, .4], [0, 0, 0], 1);
  const h = hp(m); cm([h.x + 7, h.y + .2, h.z + 1.4], [h.x + 4.8, h.y + .1, h.z + 1], easeIn(L.k)); camera.lookAt(h.x, h.y - .7, h.z); camera.fov = 40; sh(BOOTHW, 12); }, [[0, 'breath', .5]]);
// 78 «Lukas…»: con voz dulce al micrófono
shot(95.68, 'C', null, L => { stadium(L); const m = put(me, BOOTHW.x, BOOTHW.y, BOOTHW.z, PI / 2); actuar(m, 0, [[0, { aRx: 1.9, aRz: -.25, aRe: 1.7, aLx: .9, aLz: -.4, aLe: 1.2, headZ: .15 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' }); attach(BOOTH.mic, m.aR.hand, [0, -.6, .4], [0, 0, 0], 1);
  bubble(m, 'Lukas…', clamp(L.lt / .1), 1.3); { const h = hp(m); cm([h.x + 5.6, h.y + .5, h.z + 2.2], [h.x + 4.8, h.y + .4, h.z + 1.9], L.k); camera.lookAt(h.x, h.y - .2, h.z); camera.fov = 40; } sh(BOOTHW, 10); }, [[0, 'radio', .35]]);
// 79 «dein Paket ist da!»: grito al micrófono; onda expansiva; el marcador lo repite
shot(96.52, 'C', 'punch', L => { stadium(L); const m = put(me, BOOTHW.x, BOOTHW.y, BOOTHW.z, PI / 2); actuar(m, 0, [[0, { aRx: 2.0, aRz: -.25, aRe: 1.6, aLx: .9, aLz: .9, aLe: .4, lean: -.12, headX: -.2 }]], { T: L.T }); cara(m, L.T, { expr: 'shout', eyes: 'happy', mouth: 'scream' }); attach(BOOTH.mic, m.aR.hand, [0, -.6, .4], [0, 0, 0], 1);
  ring(V(BOOTHW.x + 2, BOOTHW.y + 4.5, BOOTHW.z), L.t0, L.T, 14); bubble(m, 'DEIN PAKET IST DA!', clamp(L.lt / .08), 1.3);
  const h = hp(m); cm([h.x + 8.5, h.y - .4, h.z + 2.2], [h.x + 7.8, h.y - .3, h.z + 2], L.k); camera.lookAt(h.x, h.y - .4, h.z); camera.fov = 44; sh(BOOTHW, 14); }, [[0, 'shout_crowd', .2], [0, 'boom', .45]]);

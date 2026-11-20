// ---------- c: el Freibad, la pista, el policía se ríe (71,12 – 95,91 s) ----------
const SWIM = [EX[0], EX[1], EX[2], EX[3], KIDS[0], KIDS[1], KIDS[2], EX[4], KIDS[3], EX[5]];
const EDGE = V(FX - 2, 0, 12.6);          // borde sur de la piscina, donde estoy sentado
// nadadores: solo cabeza y hombros fuera del agua; se giran hacia (fx, fz) en turnAt
function swimmers(L, o = {}) { const r = RNG(o.seed || 4); SWIM.forEach((c, i) => { const x = FX - 17 + (i % 5) * 8.4 + (r() - .5) * 2, z = -7 + Math.floor(i / 5) * 9 + (r() - .5) * 2; const s = c.spec.scale || 1;
  const face = Math.atan2((o.fx ?? FX) - x, (o.fz ?? 30) - z), away = face + PI + (r() - .5) * .8; const tt = o.turnAt != null ? easeOut(clamp((L.T - o.turnAt - (i % 4) * .04) / .22)) : (o.turned ? 1 : 0);
  put(c, x, -.15 - 3.0 * s + Math.sin(L.T * 2 + i) * .08, z, lerp(away, face, tt)); actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: .5 + Math.sin(L.T * 3 + i) * .2, aRz: .5 + Math.cos(L.T * 3 + i) * .2, aLe: .6, aRe: .6 }]], { T: L.T }); cara(c, L.T + i, { expr: tt > .5 ? 'happy' : 'neutral', mouth: tt > .5 ? 'open_smile' : 'smile' }); }); }
// gente en la terraza norte (junto a las tumbonas), mirando al sur cuando se giran
function deck(L, o = {}) { [EX[6], EX[7], EX[8], KIDS[4], EX[9], KIDS[5]].forEach((c, i) => { const x = FX - 21 + i * 7.8 + (i === 3 ? 2 : 0), z = -16.5 + (i % 2) * 1.2; const face = 0 + Math.sin(i * 3) * .2, away = PI + Math.sin(i * 2) * .4;
  const tt = o.turnAt != null ? easeOut(clamp((L.T - o.turnAt - (i % 3) * .05) / .22)) : (o.turned ? 1 : 0); put(c, x, 0, z, lerp(away, face, tt)); actuar(c, 0, [[0, { aLx: .2 + Math.sin(L.T + i) * .1, aRx: .3, headY: 0 }]], { T: L.T }); cara(c, L.T + i, { expr: 'happy', mouth: tt > .5 ? 'open_smile' : 'smile' }); }); }
// Detlef tumbado en la tumbona central, mirando al cielo con una revista
function detLounger(L, o = {}) { const x = FX - 4 + 2.4, z = -17; put(det, x, 1.25, z + .6, PI); det.root.rotation.x = -1.15; actuar(det, 0, [[0, { aLx: 1.6, aRx: 1.6, aLz: -.3, aRz: -.3, aLe: 1.2, aRe: 1.2, lLx: .15, lRx: .05, headX: -.15 }]], { T: L.T });
  cara(det, L.T, { expr: o.expr || 'smug', eyes: o.eyes || 'half', mouth: o.mouth || 'smirk' }); return V(x, 2.2, z); }
const meIce = (L, o = {}) => { const m = put(me, EDGE.x, sitY(me, .7), EDGE.z, o.ry ?? PI); actuar(me, 0, [[0, { lLx: 1.4, lRx: 1.4, lLk: .9 + Math.sin(L.T * 3) * .2, lRk: .9 + Math.cos(L.T * 3) * .2, aRx: 1.7, aRz: -.3, aRe: 2.0, aLx: .3, aLz: .3, headX: .1, ...(o.pose || {}) }]], { T: L.T });
  const rh = wpos(m.aR.hand); show(ICE, rh.x, rh.y + .5, rh.z, 0, 1.1); return m; };

// 56 «Am nächsten Tag, im Freibad,»: grúa sobre el Freibad lleno (nadadores, tumbonas, tobogán)
shot(71.12, 'I', null, L => { pool(L); swimmers(L, { turned: false }); deck(L, { turned: false }); detLounger(L);
  cm([FX + 18, 30, 52], [FX + 12, 22, 44], L.k); camera.lookAt(FX - 2, 0, -2); camera.fov = 50; sh(V(FX, 0, 0), 40); }, [[0, 'splash', .5], [.3, 'kids_laugh', .4], [.8, 'water_bloop', .4]]);
// 57 «rief eine Mutter:»: una madre en el borde, se lleva las manos a la boca
shot(72.48, 'S', null, L => { pool(L); swimmers(L); const p = V(FX + 6, 0, 14.2); put(mut, p.x, 0, p.z, PI + .3); actuar(mut, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .2, aRz: .2, aLe: 2.2, aRe: 2.2, lean: -.06 }]], { T: L.T }); cara(mut, L.T, { expr: 'happy', mouth: 'o' });
  orb(L.k, V(p.x, 3.2, p.z), null, [11, PI + .3 - .5, .1, 42], [10, PI + .3 - .35, .08, 42]); sh(p, 16); }, [[0, 'water_bloop', .4], [.4, 'breath', .35]]);
// 58 «Adrian, wir gehen!»: primer plano gritando
shot(73.52, 'C', null, L => { pool(L); const p = V(FX + 6, 0, 14.2); put(mut, p.x, 0, p.z, PI + .3); actuar(mut, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .2, aRz: .2, aLe: 2.2, aRe: 2.2, lean: -.1, headX: -.15 }]], { T: L.T }); talk(mut, L.T, 73.5, 75, 'shout');
  bubble(mut, 'Adrian, wir gehen!', clamp(L.lt / .1), 1.4); onFace(mut, 4.4, .2, .3, 40, L.k, 3.9); sh(p, 12); }, [[0, 'shout_m', .45]]);
// 59 «Alle Köpfe im Freibad»: todas las cabezas del agua se giran a la vez hacia ella
shot(74.99, 'W', null, L => { pool(L); swimmers(L, { turnAt: L.t0 + .25, fx: FX + 6, fz: 14 });
  cm([FX + 5, 6.2, 16], [FX + 4.5, 5.8, 14.5], L.k); camera.lookAt(FX - 2, 0, -4); camera.fov = 52; sh(V(FX, 0, 0), 30); }, [[0, 'water_bloop', .45], [.25, 'splash', .5]]);
// 60 «drehten sich um.»: en la terraza también: todos se dan la vuelta
shot(76.19, 'C', null, L => { pool(L); swimmers(L, { turned: true, fx: FX + 6, fz: 14 }); deck(L, { turnAt: L.t0 + .1 }); detLounger(L);
  cm([FX - 4, 9, 2], [FX - 5, 8.5, 0], L.k); camera.lookAt(FX - 4, 2.5, -17); camera.fov = 50; sh(V(FX - 4, 0, -12), 24); }, [[0, 'whoosh_soft', .35], [.1, 'gasp', .4]]);
// 61 «Außer meinem.»: yo, sentado en el borde con un helado, sigo a lo mío
shot(77.10, 'F', null, L => { pool(L); swimmers(L, { turned: true, fx: FX + 6, fz: 14 }); const m = meIce(L); cara(m, L.T, { expr: 'happy', eyes: 'closed', mouth: 'smile' });
  cm([EDGE.x + 1.5, 3.4, EDGE.z - 9], [EDGE.x + 1.2, 3.2, EDGE.z - 8], L.k); camera.lookAt(EDGE.x, 2.1, EDGE.z); camera.fov = 42; sh(EDGE, 14); }, [[0, 'sip', .4], [.4, 'water_bloop', .35]]);
// 62 «Deshalb war ich der Einzige,»: me doy cuenta: abro los ojos, el helado gotea
shot(77.86, 'S', null, L => { pool(L); const m = meIce(L, { pose: { headY: .25 } }); cara(m, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  const h = hp(m); cm([h.x + 2.6, h.y + .3, h.z - 5.2], [h.x + 2.2, h.y + .2, h.z - 4.6], L.k); camera.lookAt(h.x, h.y - .7, h.z); camera.fov = 40; sh(EDGE, 12); }, [[0, 'ding_soft', .4], [.3, 'drip', .35]]);
// 63 «der es gesehen hat:»: mis ojos se entrecierran (zoom)
shot(79.06, 'Z', null, L => { pool(L); const m = meIce(L, { pose: { headY: .25 } }); cara(m, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' });
  const h = hp(m); cm([h.x + .6, h.y + .7, h.z - 3.4], [h.x + .4, h.y + .7, h.z - 2.6], L.k); camera.lookAt(h.x, h.y + .1, h.z); camera.fov = 38; sh(EDGE, 10); }, [[0, 'tension_str', .35]]);
// 64 «Der Neue hat sich auch nicht umgedreht.» (zoom lento): todos miran a cámara… menos el nuevo, tumbado leyendo
shot(80.03, 'C', 'slow', L => { pool(L); deck(L, { turned: true }); const d = detLounger(L, { eyes: 'half' });
  cm([d.x + .5, 6.5, d.z + 15], [d.x + .3, 5.2, d.z + 9.5], easeIn(L.k)); camera.lookAt(d.x, 2.2, d.z - 1); camera.fov = 44; sh(V(d.x, 0, d.z), 16); }, [[0, 'heartbeat', .4]]);
// 65 «Denn wenn jemand deinen Namen ruft,»: en la plaza, una mujer llama a un hombre que se aleja
shot(81.91, 'W', null, L => { town(L); const p = V(-14, 0, 30); const a = put(EX[17], p.x - 3, 0, p.z, PI / 2 - .3); actuar(a, 0, [[0, { aRx: 2.2, aRz: .2, aRe: 2.0, aLx: .3 }]], { T: L.T }); talk(a, L.T, 81.9, 83.7, 'happy');
  walkTo(EX[16], p.x + 3, p.z, PI / 2 + .4, 2.2, L, 0, 8); cara(EX[16], L.T, { expr: 'neutral' }); bubble(a, 'Adrian!', clamp((L.lt - .3) / .1), 1.5);
  orb(L.k, V(p.x + .5, 3, p.z), null, [15, .1, .1, 44], [13.5, .02, .08, 44]); sh(p, 16); }, [[0, 'steps', .4], [.4, 'pop', .35]]);
// 66 «drehst du dich um,»: ¡zas! se gira al instante
shot(83.70, 'C', 'punch', L => { town(L); const p = V(-14, 0, 30); const c = put(EX[16], p.x + 5.5, 0, p.z + 1.7, lerp(PI / 2 + .4, -PI / 2 + .3, easeOut(clamp(L.lt / .18)))); actuar(c, 0, [[0, { aLx: .5, aRx: .5, aLz: .5, aRz: .5, lean: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'wide', mouth: 'o' });
  badge('q', '!', W * .7, H * .22, clamp((L.lt - .1) / .1), 1, .9); onBody(c, 9, -.1, .06, 42, L.k, 8); sh(p, 14); }, [[0, 'whoosh_soft', .45], [.1, 'boing_metal', .3]]);
// 67 «ohne überhaupt nachzudenken.»: hasta el perro gira la cabeza de golpe
shot(84.47, 'R', null, L => { town(L); const DP = V(16.3, 0, 115.1); show(DOG, DP.x, 0, DP.z, lerp(-.5 + PI * .8, -.5, easeOut(clamp((L.lt - .25) / .15))), .9);
  const m = put(mama, DP.x + 4.2, 0, DP.z - 1.6, lerp(PI, -.5, easeOut(clamp((L.lt - .3) / .18)))); actuar(m, 0, [[0, { aRx: 1.4, aRz: -.3, aRe: 1.2 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', eyes: 'wide', mouth: 'o' });
  badge('q', '!', W * .5, H * .2, clamp((L.lt - .3) / .1), 1, .8); orb(L.k, V(DP.x + 1.8, 2.6, DP.z - .6), null, [15, -.4, .1, 42], [13, -.3, .08, 42]); sh(DP, 16); }, [[.25, 'bark', .55], [.35, 'boing_metal', .3]]);
// 68 «Also war Adrian gar nicht»: yo, el dedo en alto: ¡lo tengo!
shot(85.94, 'F', null, L => { pool(L); const m = put(me, EDGE.x, 0, EDGE.z + 3, PI + .15); actuar(m, 0, [[0, { aRx: 2.9, aRz: -.2, aRe: .2, aLx: .3, headX: -.05 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', eyes: 'wide', mouth: 'open_smile' });
  onBody(m, 8, .15, .08, 42, L.k, 7); badge('gold', '!', W * .66, H * .2, clamp(L.lt / .1), 1, .8); sh(EDGE, 12); }, [[0, 'ding_reveal', .5]]);
// 69 «sein echter Name.»: la placa ADRIAN del nuevo, en grande… y tachada
shot(87.06, 'Z', null, L => { pool(L); const p = V(FX - 1.6, 0, -13); put(det, p.x, 0, p.z, 0); actuar(det, 0, [[0, { aLx: .3, aRx: .3, headX: .2 }]], { T: L.T }); cara(det, L.T, { expr: 'worried', eyes: 'side_l', mouth: 'wavy' }); sweat(det, L.T);
  det.setTag(null); const ch = wpos(det.spine); show(TAGBIG, ch.x + .5, ch.y + 1.5, ch.z + .7, 0, .34); TAGBIG.userData.set('ADRIAN', L.k > .45);
  cm([p.x + .9, 3.6, p.z + 6], [p.x + .7, 3.4, p.z + 5], L.k); camera.lookAt(p.x + .4, 3.3, p.z); camera.fov = 40; sh(p, 12); }, [[0, 'zoom_in', .4], [.45, 'pencil', .55]]);
// 70 «Er hat nur so getan,»: el nuevo me guiña un ojo desde la tumbona
shot(88.16, 'S', null, L => { pool(L); deck(L, { turned: true }); const d = detLounger(L, { eyes: 'wink', mouth: 'smirk' }); det.root.rotation.x = -.7;
  const h = hp(det); cm([h.x + 1.5, h.y + 2.4, h.z + 6.2], [h.x + 1.2, h.y + 2.1, h.z + 5.4], L.k); camera.lookAt(h.x, h.y, h.z); camera.fov = 40; sh(V(d.x, 0, d.z), 12); }, [[0, 'evil_laugh', .35]]);
// 71 «damit ihn alle reinlassen.»: recuerdo (sepia): otra puerta se abre y le dejan pasar
shot(89.20, 'W', null, L => { nightStreet(L); grade.uniforms.sepia.value = .55; const { d, p } = (i => ({ d: DOORS[i], p: V(NX - 20 + i * 20, 0, 0) }))(2); d.userData.setOpen(easeOut(clamp(L.lt / .45)));
  put(EX[18], p.x, 0, -1.4, 0); actuar(EX[18], 0, [[0, GEST.wave]], { T: L.T }); grin(EX[18], L.T);
  walkTo(det, p.x + 1.8, 5.2, PI + .3, 2.4, L, 0, 7); cara(det, L.T, { expr: 'smug', mouth: 'smirk' });
  cm([p.x - 4, 5.4, 13], [p.x - 3.4, 5, 11.5], L.k); camera.lookAt(p.x + .5, 3.4, 1); camera.fov = 44; sh(V(p.x, 0, 2), 16); }, [[0, 'door_creak', .5], [.4, 'steps', .3]]);
// 72 «Ich habe es Polizist»: corro hasta el policía junto al coche patrulla
shot(90.53, 'C', null, L => { town(L); const p = V(24, 0, 24); put(pol, p.x, 0, p.z, .3); actuar(pol, 0, [[0, GEST.cross]], { T: L.T }); cara(pol, L.T, { expr: 'neutral' });
  const m = put(me, p.x - 6 + L.lt * 4.4, Math.abs(Math.sin(L.T * 14)) * .2, p.z + 2.2, PI / 2 + .2); actuar(m, 0, [[0, walkP(L.T, 0, 14)]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'talk_wide' });
  orb(L.k, V(p.x - 1.5, 3, p.z + 1), null, [13, .1, .1, 44], [11.5, .2, .08, 44]); sh(p, 16); }, [[0, 'steps_run', .55]]);
// 73 «Adrian erzählt.»: se lo cuento todo gesticulando; él, de brazos cruzados
shot(91.47, 'F', null, L => { town(L); const p = V(24, 0, 24); put(pol, p.x + 1.6, 0, p.z, -PI / 2 + .5); actuar(pol, 0, [[0, GEST.cross]], { T: L.T }); cara(pol, L.T, { expr: 'sus', mouth: 'flat' });
  const m = put(me, p.x - 1.6, 0, p.z + .4, PI / 2 - .5); actuar(m, 0, [[0, { aLx: 1.2 + Math.sin(L.T * 9) * .4, aRx: 1.2 + Math.cos(L.T * 8) * .4, aLz: .4, aRz: .4, aLe: .8, aRe: .8 }]], { T: L.T }); talk(m, L.T, 90.5, 92.5, 'determined');
  orb(L.k, V(p.x, 3.2, p.z), null, [11.5, .1, .1, 42], [10.5, -.05, .08, 42]); sh(p, 14); }, [[0, 'whisper', .35]]);
// 74 «Aber er hat nur gelacht.»: el policía se parte de risa; yo, enfadado
shot(92.50, 'Z', null, L => { town(L); const p = V(24, 0, 24); const c = put(pol, p.x + .6, 0, p.z, -.25); actuar(c, 0, [[0, { aLx: 1.0, aRx: 1.0, aLz: -.5, aRz: -.5, aLe: 1.4, aRe: 1.4, lean: -.15 + Math.sin(L.T * 18) * .06, headX: -.25 }]], { T: L.T }); laughF(c, L.T);
  const m = put(me, p.x - 2.8, 0, p.z - 1.2, .5); actuar(m, 0, [[0, GEST.fists]], { T: L.T }); cara(m, L.T, { expr: 'angry', mouth: 'grimace' });
  onBody(c, 9.5, -.15, .08, 42, L.k, 8.5); sh(p, 14); }, [[0, 'laugh_deep', .55]]);
// 75 «Also musste ich es»: camino decidido hacia la plaza al atardecer
shot(93.82, 'S', null, L => { town(L, { dusk: true }); const m = walkTo(me, 0, 52, PI, 2.4, L, 0, 9); cara(m, L.T, { expr: 'determined', mouth: 'flat' }); const mp = m.root.position;
  orbit(V(mp.x, 2.9, mp.z), 9.5, PI + .2, .05, 42); sh(mp, 14); }, [[0, 'steps', .5]]);
// 76 «der ganzen Stadt zeigen.»: la plaza al atardecer se llena para el Stadtfest; yo llego por delante
shot(94.72, 'W', null, L => { town(L, { dusk: true, fest: true }); walkTo(me, -6, 22, PI, 2.4, L, 0, 9); cara(me, L.T, { expr: 'determined' });
  crowdAt(L, -6, -20, 20, 4, 16, 76, { mode: 'walk', full: true, face: V(-6, 0, -58) });
  cm([-2, 9, 40], [-3, 8, 34], L.k); camera.lookAt(-6, 3, -20); camera.fov = 48; sh(V(-6, 0, -10), 34); }, [[0, 'city_amb', .45], [.3, 'murmur', .4]]);

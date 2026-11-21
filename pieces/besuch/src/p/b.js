// ---------- b: gancho, la regla, el pueblo (0 – 28,3 s) ----------
// 1 «In dieser Stadt bekommt jeder,» (zoom lento): calle nevada al amanecer, coches; en el centro Opa vuelve a casa con «+1 TAG» y la gente le saluda
shot(0, 'C', 'slow', L => { town('morning'); SNOWF = 1; const z0 = 175; CARS.forEach((c, i) => show(c, 26 + (i ? 3.5 : -3.5), 0, i ? 215 + L.lt * 14 : 260 - L.lt * 16, i ? 0 : PI));
  caminar(opa, L.lt, { x: 25, z: z0, ry: PI, speed: 2.2, T: L.T }); visitor(opa); cara(opa, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' });
  folk(25, z0 - 6, L.lt, L.T, 9, 5, 14, 3, { expr: 'happy' }); badge('gold', '+1 TAG', W / 2, H * .16, (L.lt - .2) * 3, 1, .9);
  orbit(V(25, 4.5, z0 - L.lt * 2.2), lerp(40, 18, easeOut(L.k)), PI + .15, .1, 50); sh(V(25, 0, z0), 60); }, [[0, 'wind', .5], [.1, 'car_pass', .4], [.4, 'steps_snow', .5], [1.0, 'bells', .4]]);
// 2 «der stirbt,»: cementerio nevado, la tumba de Heinrich con la vela; la cámara se acerca
shot(1.70, 'F', null, L => { fhOn(); SNOWF = 1.2; orbit(V(FXX(0), 4.2, 10), lerp(18, 13, L.k), .15, .1, 46); sh(V(FXX(0), 0, 10), 40); }, [[0, 'bell_far', .6], [.2, 'wind', .5]]);
// 3 «noch einen Tag mehr.»: Opa se levanta junto a su tumba, estira los brazos y sonríe; destellos; «+1 TAG»
shot(2.34, 'Z', 'punch', L => { fhOn(); SNOWF = 1.2; const c = put(opa, FXX(3.6), 0, 13, -.25); visitor(opa); actuar(c, L.lt, [[0, 'slump'], [.15, 'cheer', { dur: .35 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' });
  SPK.run(hp(c).add(V(0, -4, 0)), clamp(L.lt / 1.2), L.T, 3, 5); badge('gold', '+1 TAG', W / 2, H * .2, (L.lt - .3) * 3, 1, 1);
  orbit(headC(c).add(V(0, -1, 0)), lerp(10, 8.5, L.k), -.2, .05, 44); sh(V(FXX(3), 0, 13), 30); }, [[0, 'magic_hit', .6], [.1, 'sparkle', .6], [.6, 'gasp_old', .4]]);
// 4 «Wir nennen ihn den Besuchstag.»: calendario de enero con el día marcado en rojo «BESUCH»
shot(3.58, 'W', null, L => { stubeOn(); show(CAL, SX(15), 7.2, -14.7); CAL.scale.setScalar(.6); const k = easeInOut(L.k); cam([SX(15 + lerp(-1.2, .3, k)), 7.2, -14.7 + lerp(11, 7.4, k)], [SX(15), 7.2, -14.7], 44);
  badge('tag', 'BESUCHSTAG', W / 2, H * .18, (L.lt - .8) * 3, 1, 1); }, [[0, 'pages', .5], [.9, 'pencil', .6], [1.1, 'ding_soft', .5]]);
// 5 «Die Toten kommen bei Sonnenaufgang heim»: el porche con luces al amanecer; Opa sube los escalones, Mama y los nietos abren y saludan
shot(5.72, 'S', null, L => { town('morning'); const d = hz(4.7, 9.4); const o = caminar(opa, L.lt, { x: d.x + 6, z: d.z, ry: -PI / 2, speed: 1.8, T: L.T }); visitor(opa); cara(opa, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); opa.root.rotation.y = -PI / 2 + .9;
  const m = put(mama, d.x - 1.5, 0, d.z + 2.5, PI / 2 + .3); actuar(m, L.lt, [[0, 'wave']], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'open_smile' }); KD.slice(0, 2).forEach((k, i) => { put(k, d.x - .5, 0, d.z - 2 - i * 2, PI / 2); actuar(k, L.lt, [[0, i ? 'cheer' : 'wave']], { T: L.T + i }); grin(k, L.T); });
  orbit(V(d.x + 2.5, 4, d.z - 1), lerp(26, 20, L.k), PI / 2 + 1.1, .12, 48); sh(d, 40); badge('tag', 'SONNENAUFGANG', W / 2, H * .17, (L.lt - .2) * 3, 1, .8); }, [[0, 'steps_snow', .5], [.3, 'door_open', .5], [.8, 'kids_laugh', .5]]);
// 6 «und gehen bei Sonnenuntergang.»: atardecer: Opa se aleja por la calle y se gira para decir adiós
shot(7.62, 'R', null, L => { town('morning'); setSky([.22, .2, .55], [.9, .45, .5], [1, .6, .3]); sun.color.setRGB(1, .65, .45); caminar(opa, L.lt, { x: 30, z: 120, ry: 0, speed: 2.2, T: L.T, extra: { aRx: 2.4, aRz: .3 } }); visitor(opa); cara(opa, L.T, { expr: 'happy', eyes: 'happy' });
  opa.root.rotation.y = -.8; orbit(V(30, 4, 120 + L.lt * 2.2), lerp(15, 20, L.k), -1.0, .18, 48); sh(V(30, 0, 122), 40); badge('tag', 'SONNENUNTERGANG', W / 2, H * .17, (L.lt - .2) * 3, 1, .8); }, [[0, 'steps_snow', .5], [.5, 'wind', .4]]);
// 7 «Sie essen»: en la mesa: Opa come tortitas con los nietos, Mama sirve
shot(9.42, 'C', null, L => { stubeOn(); show(PANC, SX(-1), 3.1, -2, 0, .55); visitor(opa); const o = put(opa, SX(-1), 0, -7.6, 0); actuar(o, L.lt, [[0, { aRx: 1.2, aRe: 1.5 + Math.sin(L.T * 9) * .3, aLx: .8, aLe: .9 }]], { T: L.T }); cara(o, L.T, { expr: 'happy', mouth: Math.sin(L.T * 9) > 0 ? 'open' : 'flat' });
  KD.slice(0, 2).forEach((k, i) => { put(k, SX(-1 + (i ? 4.6 : -4.6)), 0, -3, i ? -PI / 2 : PI / 2); actuar(k, L.lt, [[0, { aRx: 1.2, aRe: 1.4 + Math.sin(L.T * 8 + i) * .3 }]], { T: L.T + i }); grin(k, L.T); });
  const m = put(mama, SX(-6), 0, -7, .5); actuar(m, L.lt, [[0, 'hold']], { T: L.T }); show(PLATES[0], SX(-6) + .3, 5.4, -5.6).visible = true; attach(PLATES[0], m.aR.hand, [0, -.5, .5], [0, 0, 0], .8); cara(m, L.T, { expr: 'happy' });
  cm([SX(-1), 8.5, 16], [SX(-1), 8, 13], L.k); camera.lookAt(SX(-1), 3.8, -4.5); }, [[0, 'spoon', .5], [.3, 'chew', .5], [.6, 'plate_slide', .4]]);
// 8 «und lachen wie früher.»: primer plano de Opa riendo a carcajadas
shot(10.06, 'Z', 'punch', L => { stubeOn(); visitor(opa); const o = put(opa, SX(-1), 0, -7.6, 0); actuar(o, L.lt, [[0, { lean: -.15 + Math.sin(L.T * 14) * .04, headX: -.2, aLx: .6, aLz: .4, aRx: .6, aRz: .4 }]], { T: L.T }); laughF(o, L.T);
  KD.slice(0, 1).forEach(k => { put(k, SX(3.6), 0, -3, -PI / 2 - .4); laughF(k, L.T); });
  onFace(o, lerp(7, 5.6, L.k), -.4, .8, 40); }, [[0, 'laugh_deep', .6], [.2, 'kids_laugh', .5]]);
// 9 «Aber sie haben kein Spiegelbild,» (zoom lento): Oma Liesel delante del espejo destapado: en el espejo solo sale el niño a su lado
shot(11.32, 'F', 'slow', L => { stubeOn(); ST.MIR[0].sheet.visible = false; visitor(oma); const o = put(oma, SX(-16), 0, -2.6, -PI / 2), k = put(KD[1], SX(-15.6), 0, .6, -PI / 2 + .25); actuar(o, L.lt, [[0, { aRx: 1.3, aRe: 1.6, headZ: .1 }]], { T: L.T }); cara(o, L.T, { expr: 'happy' });
  actuar(k, L.lt, [[0, 'idle'], [1, 'shock', { dur: .3 }]], { T: L.T }); cara(k, L.T, { expr: L.lt > 1 ? 'shock' : 'neutral' });
  cm([SX(-6), 6.5, 6], [SX(-8.5), 6.2, 4], L.k); camera.lookAt(SX(-19.7), 5, -1.4); }, [[0, 'glass_rattle', .4], [.8, 'creepy_ting', .5]]);
// 10 «keine Spuren im Schnee»: nieve en el jardín: Opa y un nieto caminan: solo el niño deja huellas
shot(13.16, 'W', null, L => { town('morning'); const kk = clamp((L.lt + .3) / 1.6); showPrints(KPR, kk * .5); visitor(opa);
  caminar(opa, L.lt + .3, { x: -31, z: 50, ry: PI, speed: 3.6, T: L.T }); caminar(KD[2], L.lt + .3, { x: -34, z: 50, ry: PI, speed: 3.6, T: L.T + 1 }); cara(opa, L.T, { expr: 'happy' }); grin(KD[2], L.T);
  orbit(V(-32.5, 2, 50 - (L.lt + .3) * 3.6 + 3), lerp(20, 16, L.k), PI - .5, .5, 48); sh(V(-32, 0, 44), 30); }, [[0, 'steps_snow', .7], [.6, 'steps_snow', .6]]);
// 11 «und wissen nicht, wie sie gestorben sind.»: Opa lee su propia esquela en el periódico, confundido
shot(14.44, 'R', null, L => { stubeOn(); visitor(opa); const o = put(opa, SX(9), 0, 4, -PI / 2); actuar(o, L.lt, [[0, 'hold']], { T: L.T }); show(NEWS, SX(7.2), 3.9, 4, PI / 2 - PI, .75); NEWS.rotation.set(-.35, PI / 2, 0, 'YXZ'); cara(o, L.T, { expr: 'confused' });
  const k = easeInOut(L.k); cam([SX(11.6 - k * .8), 7.6, 6.2], [SX(7.2), 3.9, 4], 46); badge('q', '?', W * .78, H * .18, (L.lt - .5) * 3, 1, .8); }, [[0, 'paper', .6], [.8, 'creepy_ting', .4]]);
// 12 «Die Regel:»: el tablón de la plaza con la regla Nr. 1 (golpe de zoom)
shot(16.58, 'C', 'punch', L => { town(); RULE.visible = true; folk(-20, 4, L.lt, L.T, 8, 9, 20, 5, { expr: 'worried' }); const p = V(-20, 5, 4); orbit(p, lerp(20, 17, L.k), .35, .1, 44); sh(V(-20, 0, 4), 40); }, [[0, 'impact', .6], [.1, 'paper', .4]]);
// 13 «Sag einem Besucher nie, dass er tot ist.»: un nieto va a hablar; Mama le tapa la boca; Opa sigue comiendo feliz
shot(17.34, 'I', null, L => { stubeOn(); show(PANC, SX(-1), 3.1, -3, 0, .8); visitor(opa); const o = put(opa, SX(-1), 0, -7.6, 0); actuar(o, L.lt, [[0, { aRx: 1.2, aRe: 1.5 + Math.sin(L.T * 9) * .3 }]], { T: L.T }); cara(o, L.T, { expr: 'happy', eyes: 'happy' });
  const k = put(KD[0], SX(4.2), 0, -1.6, -PI / 2 + 1.1), m = put(mama, SX(5.6), 0, -3.4, -PI / 2 + .6); actuar(k, L.lt, [[0, 'point_l'], [.9, 'shock', { dur: .25 }]], { T: L.T }); cara(k, L.T, { expr: L.lt < .9 ? 'talk' : 'shock', mouth: L.lt < .9 ? 'open' : 'o' });
  actuar(m, L.lt, [[0, 'idle'], [.8, { aLx: 1.7, aLz: -.6, aLe: 1.4, lean: .15 }, { dur: .25 }]], { T: L.T }); cara(m, L.T, { expr: 'worried' });
  orbit(V(SX(3.4), 3.2, -2.6), lerp(12, 10, L.k), .35, .12, 46); badge('red', 'NIE!', W / 2, H * .17, (L.lt - 1.0) * 3, 1, .9); }, [[0, 'chew', .4], [.9, 'gasp', .5], [1.1, 'cloth', .5]]);
// 14 «Merkt er es,» (zoom lento): Opa ve la esquela y se da cuenta: cara de shock
shot(19.78, 'F', 'slow', L => { stubeOn(); visitor(opa); const o = put(opa, SX(9), 0, 4, -PI / 2 + .5); actuar(o, L.lt, [[0, 'hold'], [.4, 'shock', { dur: .3 }]], { T: L.T }); cara(o, L.T, { expr: L.lt > .4 ? 'shock' : 'confused' });
  onFace(o, lerp(5.6, 4.2, L.k), -.2, -.6, 40); }, [[.3, 'gasp_old', .6], [.4, 'heartbeat', .5]]);
// 15 «verschwindet er sofort.»: Opa se deshace en destellos; la familia alarga las manos
shot(20.68, 'C', null, L => { stubeOn(); visitor(opa); const o = put(opa, SX(2), 0, -6, .2); const k = clamp((L.lt - .2) / 1.1); o.root.scale.setScalar(sc_(o) * (1 - easeIn(k) * .95)); o.root.visible = k < .98; cara(o, L.T, { expr: 'sad' }); SPK.run(V(SX(2), 0, -6), k, L.T, 3, 7);
  KD.slice(0, 2).forEach((c, i) => { put(c, SX(2 + (i ? 4 : -4)), 0, -2, i ? -.6 : .6); actuar(c, L.lt, [[0, 'reach']], { T: L.T + i }); cara(c, L.T, { expr: 'shock' }); });
  orbit(V(SX(2), 3.6, -4.5), lerp(14, 11, L.k), .1, .12, 46); sh(V(SX(2), 0, -5), 30); }, [[.1, 'magic_hit', .6], [.2, 'sparkle', .7], [.8, 'gasp', .4]]);
// 16 «Ohne Abschied.»: la silla vacía con la gorra de Opa; un nieto llora
shot(22.16, 'S', null, L => { stubeOn(); const k = put(KD[1], SX(-5.6), 0, -9.8, -.6); actuar(k, L.lt, [[0, { headX: .2, aLx: .3, aRx: .3 }]], { T: L.T }); cry(k, L.T); show(CAP, SX(-4), 1.9, -7.6, .3, 1);
  cm([SX(-11.5), 4.2, -3.6], [SX(-10.5), 4, -4.4], L.k); camera.lookAt(SX(-5.2), 2.3, -8.4); }, [[0, 'sad_tone', .6], [.4, 'sniff', .5]]);
// 17 «Darum verhängen Familien jeden Spiegel,»: Papa cuelga la sábana sobre el espejo (cae de arriba abajo)
shot(23.20, 'W', null, L => { stubeOn(); const M = ST.MIR[0]; const k = easeOut(clamp(L.lt / 1.0)); M.sheet.position.y = (1 - k) * 8; const p = put(papa, SX(-16.4), 0, 2.6, .2); actuar(p, L.lt, [[0, { aLx: 2.6, aRx: 2.6, aLe: .3, aRe: .3, headX: -.2 }], [.9, 'idle', { dur: .4 }]], { T: L.T }); cara(p, L.T, { expr: 'sad' });
  cm([SX(-9), 6.5, 13], [SX(-11), 6.2, 11], L.k); camera.lookAt(SX(-18.5), 5, -.2); }, [[0, 'cloth', .7], [.6, 'cloth', .4]]);
// 18 «kochen sein Lieblingsessen»: Mama en el fogón: la tortita vuela de la sartén
shot(25.54, 'Z', null, L => { stubeOn(); const m = put(mama, SX(-12), 0, -9.4, PI - .25); m.root.rotation.y = .25; actuar(m, L.lt, [[0, { aRx: 1.2, aRe: .6, aLx: .9, aLe: 1.2 }], [.3, { aRx: 1.9, aRe: .3 }, { dur: .15 }], [.55, { aRx: 1.2, aRe: .6 }, { dur: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', eyes: 'happy' });
  const fl = clamp((L.lt - .3) / .5); show(PANC2, SX(-12), 3.9 + 4 * fl * (1 - fl) * 3, -12.4).rotation.x = fl * 6.283; PANC2.scale.setScalar(.45);
  cm([SX(-9), 8.5, 1], [SX(-10.5), 8, -2], L.k); camera.lookAt(SX(-12), 5.5, -11); }, [[0, 'pan_sizzle', .7], [.3, 'whoosh_up', .4], [.8, 'plate_slide', .4]]);
// 19 «und lächeln viel zu viel.»: la familia alrededor de Opa con sonrisas exageradas y sudor
shot(26.60, 'R', null, L => { stubeOn(); visitor(opa); const o = put(opa, SX(-1), 0, -7.6, 0); cara(o, L.T, { expr: 'happy' }); actuar(o, L.lt, [[0, 'idle']], { T: L.T });
  const F = [[mama, -3.4, -7.0, .3], [papa, 1.4, -7.0, -.3], [KD[0], -2.3, -9.4, .1], [KD[1], .3, -9.4, -.1]]; F.forEach(([c, x, z, r], i) => { put(c, SX(x), 0, z, r); actuar(c, L.lt, [[0, 'idle']], { T: L.T + i }); grin(c, L.T); }); sweat(papa, L.T, 2);
  orbit(V(SX(-1), 3.8, -7.5), lerp(12, 10, L.k), .05, .3, 50); }, [[0, 'whistle_inno', .4], [.5, 'boing_metal', .3]]);
// 20 «Ich bin dreizehn,»: yo en el porche, saludando; «13»
shot(28.30, 'W', null, L => { town('morning'); const d = hz(4.7, 11); const c = put(ich, d.x, 0, d.z, PI / 2); actuar(c, L.lt, [[0, 'wave']], { T: L.T }); talk(c, L.T, 28.3, 29.8, 'happy');
  orbit(headC(c).add(V(0, -1.5, 0)), lerp(14, 11, L.k), PI / 2 + .3, .08, 44); sh(d, 30); badge('num', '13', W * .5, H * .12, (L.lt - .5) * 3, 1, 1.3); }, [[0, 'steps_snow', .4], [.6, 'pop', .5]]);
// 21 «meine Schwester Mia ist sechs.»: Mia en el jardín lanza una bola de nieve y ríe; «6»
shot(29.80, 'C', null, L => { town('morning'); const d = hz(-4, 19); const c = put(mia, d.x, 0, d.z, PI / 2 + .3); actuar(c, L.lt, [[0, { aRx: 2.6, aRe: 1.2 }], [.5, { aRx: .9, aRe: .2, lean: .2 }, { dur: .2 }]], { T: L.T }); laughF(c, L.T);
  orbit(headC(c).add(V(0, -.6, 0)), lerp(9, 7.5, L.k), PI / 2 + .5, .1, 44); sh(d, 30); badge('num', '6', W * .5, H * .12, (L.lt - .6) * 3, 1, 1.3); }, [[.5, 'whoosh', .4], [.7, 'kids_laugh', .5], [.9, 'pop', .5]]);
// 22 «Letzten Winter» (recuerdo): el Mühlenteich de día, Mia patinando sola sobre el hielo
shot(31.56, 'F', null, L => { teichOn(); day(); SUNM.visible = false; setSky([.6, .66, .78], [.75, .8, .88], [.88, .9, .94]); grade.uniforms.sepia.value = .35; grade.uniforms.sat.value = .9; FPM.visible = false;
  caminar(mia, L.lt, { x: TXX(-6), y: .1, z: 4, ry: .9, speed: 2.4, T: L.T, extra: { aLz: .9, aRz: .9 } }); const c = mia; cara(c, L.T, { expr: 'happy', eyes: 'happy' });
  orbit(V(TXX(-5) + (L.lt * 2.4 * Math.sin(.9)), 2, 4 + L.lt * 2.4 * Math.cos(.9)), lerp(16, 13, L.k), .9, .15, 46); sh(V(TXX(-4), 0, 6), 40); badge('tag', 'LETZTEN WINTER', W / 2, H * .17, (L.lt - .1) * 3, 1, .9); }, [[0, 'wind', .6], [.3, 'freeze', .4]]);
// 23 «brach Mia im Mühlenteich durchs Eis.»: el hielo se rompe: agujero, trozos de hielo y salpicadura
shot(32.12, 'C', 'punch', L => { teichOn(); day(); SUNM.visible = false; setSky([.6, .66, .78], [.75, .8, .88], [.88, .9, .94]); grade.uniforms.sepia.value = .35; grade.uniforms.sat.value = .9; FPM.visible = false; TE.HOLE.visible = true;
  const c = put(mia, TXX(4), -.5 - L.lt * .4, -6, .4); actuar(c, L.lt, [[0, { aLx: 2.9, aRx: 2.6, aLz: .3, aRz: .4, aLe: .4, aRe: .3, headX: -.3 }]], { T: L.T, extra: shiver(L.T, .8) }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); dust(V(TXX(4), 0, -6), 0, L.lt, 12, .6);
  orbit(V(TXX(4), 1, -6), lerp(14, 11, L.k), .3, .45, 46); sh(V(TXX(4), 0, -6), 30); badge('tag', 'MÜHLENTEICH', W / 2, H * .17, (L.lt - .3) * 3, 1, .9); }, [[0, 'glass_crack', .7], [.15, 'splash', .7], [.5, 'scream_girl', .3]]);

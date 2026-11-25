// ---------- c: Jacky y Jacobs, el dentista y Melitta, el cura, el tramposo (65,3 – 110,9 s) ----------
const SAC = V(SAX, 0, -4);   // sillón central del salón
const DROP = P_(sphere(.16, mat(0x6a3a1a, { roughness: .1, emissive: 0x2a1204, emissiveIntensity: .3 }), scene, 0, 0, 0, 10, 8));
// 44 «Meine Friseurin»: Jacky en su salón cortando el pelo a una clienta, tijeras en una mano
shot(65.30, 'W', null, L => { salonS(L); const cl = sit2(CR[23], SAX, -4, PI, 3.0); actuar(cl, 0, [[0, sitPose({ aLx: .4, aRx: .4 })]], { T: L.T, weight: false }); cara(cl, L.T, { expr: 'happy', mouth: 'smile' });
  const j = put(jacky, SAX - 2.6, 0, -1.6, -.6); actuar(j, 0, [[0, { aRx: 2.0 + Math.sin(L.T * 14) * .12, aRz: .5, aRe: 1.0, aLx: 1.6, aLz: .3, aLe: 1.2, lean: .08 }]], { T: L.T }); cara(j, L.T, { expr: 'happy', mouth: 'talk' });
  orbit(V(SAX - 1, 5.2, -3), lerp(12, 10.5, L.k), -.5, .12, 44); sh(V(SAX, 0, -3), 16); }, [[0, 'scissors', .6], [.4, 'scissors', .6], [.8, 'hairdryer', .3]]);
// 45 «trinkt nur Jacobs Krönung.»: Jacky deja las tijeras, coge su taza y bebe; el paquete JACOBS KRÖNUNG en primer término
shot(66.06, 'C', null, L => { salonS(L); const j = put(jacky, SAX + 2.6, 0, 1.2, PI + .6); drink(j, L, L.t0 + .05, .5, { meter: true, expr: 'happy', after: 'joy', steam: 1 }); show(PACKS.JACOBS[0], SAX + 4.8, 0, 3.6, -.4 + PI, 1.5);
  dcam(j, L.k, 11, -.7, 5, 42); sh(V(SAX + 3, 0, 2), 16); }, [[0, 'sip', .6], [.6, 'aah', .4]]);
// 46 «Und der Name ist kein Zufall:»: primer plano del paquete: la corona dorada de la etiqueta brilla
shot(67.48, 'Z', 'punch', L => { salonS(L); const p = PACKS.JACOBS[1]; show(p, SAX, 3.4, 2, PI, 2.2); const cr = CROWNS[1]; show(cr, SAX, 8.6 + Math.sin(L.T * 3) * .15, 2.4, L.T * 2, .8);
  confRain(V(SAX, 3, 2), L.T, 20, 8, 4, 8); cm([SAX + 1.2, 6.6, 10, SAX, 6.2, 2, 34], [SAX + .6, 6.6, 8.4, SAX, 6.4, 2, 32], L.k); sh(V(SAX, 0, 2), 12); DOF = 1.4; }, [[0, 'ding_reveal', .5], [.3, 'sparkle', .5]]);
// 47 «Bei jeder zehnten Tasse»: Jacky bebe su décima taza: el reloj llega a 10 con un destello
shot(69.47, 'S', null, L => { salonS(L); const j = put(jacky, SAX - 2, 0, 1.2, PI - .5); drink(j, L, L.t0 + .05, .5, { meter: true, expr: 'determined', after: 'joy' }); meterOf(j).userData.set(L.lt < .7 ? '9 Tassen' : '10 Tassen', L.lt < .7 ? '108 €' : '120 €', L.lt < .7 ? '#7aff9a' : '#ffd23f');
  for (let i = 0; i < 9; i++) { const t = CUPS[i]; show(t, SAX - 9 + (i % 5) * 1.3, 3.55 + (i / 5 | 0) * 1.2, -13, i, .8); t.userData.level(0); } badge('num', L.lt < .7 ? '9' : '10', W / 2, H * .2, clamp(L.lt / .15), 1, 1.2);
  dcam(j, L.k, 11, -.85, 5, 42); sh(V(SAX - 2, 0, 0), 16); }, [[0, 'sip', .5], [.7, 'beep', .6], [.75, 'sparkle', .4]]);
// 48 «schenkt dir der Zähler eine goldene Krone,»: ¡pling! una corona de oro cae del cielo y aterriza en la cabeza de Jacky; ella abre la boca
shot(70.63, 'C', 'punch', L => { salonS(L); const j = put(jacky, SAX, 0, 1.2, 0); actuar(j, L.lt, [[0, {}], [.5, { aLx: 2.4, aRx: 2.4, aLz: .5, aRz: .5, aLe: 1.6, aRe: 1.6 }, { dur: .3 }]], { T: L.T }); cara(j, L.T, { expr: L.lt < .5 ? 'happy' : 'shock', mouth: L.lt < .5 ? 'smile' : 'o' });
  const k = easeIn(clamp(L.lt / .45)); const cr = CROWNS[2]; const h = hp(j); show(cr, h.x, h.y + 1.25 + (1 - k) * 9, h.z, L.T * (1 - k) * 4, .95); confetti(h, L.t0 + .45, L.T, 30, .6);
  onFace(j, 7.2, 1.8, 0, 42, L.k); sh(V(SAX, 0, 1), 14); }, [[0, 'whoosh_down', .5], [.45, 'ding_big', .7], [.5, 'sparkle', .5]]);
// 49 «tausend Euro wert.»: la corona en primer plano gira con su etiqueta «1.000 €»; billetes alrededor
shot(72.51, 'F', null, L => { salonS(L); const j = put(jacky, SAX, 0, 1.2, 0); actuar(j, 0, [[0, { aLx: 2.6, aLz: .3, aLe: 1.8 }]], { T: L.T }); grin(j, L.T); const h = hp(j); show(CROWNS[2], h.x, h.y + 1.25, h.z, 0, .95);
  cashPop(j, '1.000 €', clamp(L.lt / .2), 'gold', 1.4, 3.4); billRain(V(SAX, 0, 1), L.T, 40, 14, 8, 14); onFace(j, 6.6, 1.6, .5, 40, L.k); sh(V(SAX, 0, 1), 14); }, [[0, 'cha_ching', .6], [.3, 'money_rain', .5]]);
// 50 «Sie hat schon sieben»: Jacky con SIETE coronas apiladas en la cabeza, haciendo equilibrio, orgullosa; las clientas aplauden
shot(74.01, 'W', null, L => { salonS(L); const j = put(jacky, SAX, 0, 1.2, 0); actuar(j, 0, [[0, { aLx: .9, aLz: .9, aRx: .9, aRz: .9, aLe: .4, aRe: .4, headZ: Math.sin(L.T * 3) * .06 }]], { T: L.T }); grin(j, L.T); const h = hp(j);
  for (let i = 0; i < 7; i++) show(CROWNS[i], h.x + Math.sin(L.T * 3 + i * .5) * .05 * i, h.y + 1.25 + i * .62 * Math.min(1, L.lt * 3 - i * .15 + 1), h.z, i * .5, .95 - i * .03);
  badge('num', '7 KRONEN', W / 2, H * .17, clamp(L.lt / .2), 1, 1); crowdAt(L, SAX, 0, 4, 6, 10, 50, { mode: 'clap', face: V(SAX, 5, 1), gap: 1.6 });
  orbit(V(SAX, 8, 1.2), lerp(15, 13, L.k), .25, .1, 44); sh(V(SAX, 0, 1), 16); }, [[0, 'clap', .5], [.3, 'ding', .4], [.6, 'ding', .4], [.9, 'ding', .4]]);
// 51 «und sich davon einen Salon in Paris gekauft.»: nuevo salón rosa en París con la Torre Eiffel en la ventana; Jacky con boina saluda con las coronas puestas
shot(75.57, 'F', null, L => { salonS(L, 1); const j = put(jacky, SPX + 6, 0, 2, -PI / 2 - .5); actuar(j, 0, [[0, 'wave']], { T: L.T }); laughF(j, L.T); const h = hp(j); for (let i = 0; i < 3; i++) show(CROWNS[i], h.x, h.y + 1.25 + i * .6, h.z, i, .9);
  badge('tag', 'PARIS', W / 2, H * .18, clamp(L.lt / .2), 1, 1.1); confRain(V(SPX + 6, 2, 2), L.T, 30, 14, 8, 14); orbit(V(SPX + 10, 7, 0), lerp(20, 17, L.k), -PI / 2 + .35, .1, 46); sh(V(SPX + 8, 0, 0), 20); }, [[0, 'accordion', .5], [.4, 'kiss', .4], [.9, 'sparkle', .4]]);
// 52 «Mein Zahnarzt brüht nur mit Melitta.»: en la consulta, el Dr. Brenner vierte agua caliente en el filtro rojo de Melitta sobre la cafetera; vapor
shot(77.30, 'W', null, L => { zahnS(L); const d = put(brenner, ZAX - 4, 0, -2, .3); actuar(d, 0, [[0, { aRx: 1.5, aRz: .1, aRe: 1.0, aLx: .9, aLe: 1.2, lean: .05 }]], { T: L.T }); cara(d, L.T, { expr: 'happy', mouth: 'smile' });
  const K = KAN[1]; show(K, ZAX - 3.4, 3.6, 1.2, 0, 1); K.userData.level(clamp(.2 + L.lt * .3)); K.userData.steam(L.T, 1); show(FILT, ZAX - 3.4, 6.1, 1.2, 0, 1); show(PACKS.MELITTA[0], ZAX - 6, 3.6, 1.6, .3, 1.1);
  const cu = CUPS[11]; attach(cu, d.aR.hand, [-.84, -.2, -.72], [PI / 2 + .7, 0, 0], .9); cu.userData.level(0); CAMK = 1; orbit(V(ZAX - 3.6, 5.4, 0), lerp(12, 10.5, L.k), -.6, .14, 42); sh(V(ZAX - 3, 0, 0), 16); }, [[0, 'pour', .6], [.6, 'drip', .5], [1.2, 'steam', .4]]);
// 53 «Wusstest du,»: el dentista mira a cámara con el dedo índice levantado, como contando un secreto
shot(79.52, 'C', 'punch', L => { zahnS(L); const d = put(brenner, ZAX, 0, 2, 0); actuar(d, L.lt, [[0, {}], [.05, { aRx: 2.0, aRz: -.1, aRe: 1.8, lean: .06 }, { dur: .25 }]], { T: L.T }); talk(d, L.T, L.t0, L.t1, 'smug');
  onFace(d, 5.4, .3, .5, 38, L.k); sh(V(ZAX, 0, 2), 12); }, [[0, 'ding_reveal', .5]]);
// 54 «dass Melitta den Kaffeefilter erfunden hat?»: el filtro rojo gigante gira en el aire como un trofeo, con un «?» dorado
shot(80.12, 'Z', null, L => { zahnS(L); show(FILT, ZAX, 6 + Math.sin(L.T * 2) * .2, 2, L.T * 1.4, 2.4); badge('q', '?', W * .74, H * .28, clamp(L.lt / .2), 1, 1.2); badge('tag', 'ERFUNDEN!', W / 2, H * .62, clamp((L.lt - .6) / .2), 1, 1);
  confRain(V(ZAX, 2, 2), L.T, 16, 6, 4, 10); cm([ZAX, 8.6, 12, ZAX, 7, 2, 40], [ZAX, 8.4, 10, ZAX, 7.4, 2, 38], L.k); sh(V(ZAX, 0, 2), 12); DOF = 1.4; }, [[0, 'whoosh_up', .5], [.4, 'sparkle', .5], [.8, 'question', .4]]);
// 55 «Neunzehnhundertacht in Dresden,»: flashback en sepia: una cocina antigua de Dresde; una señora con moño y delantal mira su cafetera con poso; «1908 · DRESDEN»
shot(81.80, 'B', null, L => { kuecheS(L); grade.uniforms.sepia.value = .9; const w = put(REN[3], TB.x + 1, 0, -6, .3); actuar(w, 0, [[0, { aRx: 1.2, aRe: 1.1, aLx: 1.0, aLe: 1.4, headX: .25 }]], { T: L.T }); cara(w, L.T, { expr: 'confused', mouth: 'frown' });
  const K = KAN[1]; show(K, TB.x + 1, 4.3, -3, 0, 1); K.userData.level(.4); badge('big', '1908', W / 2, H * .18, clamp(L.lt / .2), 1, 1.2); badge('tag', 'DRESDEN', W / 2, H * .27, clamp((L.lt - .3) / .2), 1, 1);
  orbit(V(TB.x + 1, 5, -5), lerp(14, 12, L.k), .2, .14, 42); sh(V(TB.x, 0, -4), 16); }, [[0, 'old_film', .5], [.2, 'clock_tick', .4]]);
// 56 «mit Papier aus dem Schulheft»: en sepia, arranca una hoja del cuaderno escolar de su hijo; el niño la mira con la boca abierta
shot(83.90, 'W', null, L => { kuecheS(L); grade.uniforms.sepia.value = .9; const w = put(REN[3], TB.x + 1, 0, -6, .3); const kid = put(JUG[1], TB.x + 5, 0, -3.6, -.9); const k = clamp((L.lt - .3) / .4);
  actuar(w, 0, [[0, { aRx: 1.3 + k * .6, aRz: -.2 - k * .5, aRe: .8, aLx: 1.3, aLz: .3, aLe: .8 }]], { T: L.T }); cara(w, L.T, { expr: 'determined' }); actuar(kid, 0, [[0, { aLx: .8, aRx: .8, aLz: .6, aRz: .6, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(kid, L.T, { expr: 'shock', mouth: 'o' });
  DS2.userData.draw('heft', (c, wd, h) => { c.fillStyle = '#fbf6e4'; c.fillRect(0, 0, wd, h); c.strokeStyle = '#8ab0d8'; c.lineWidth = 3; for (let y = 40; y < h; y += 30) { c.beginPath(); c.moveTo(0, y); c.lineTo(wd, y); c.stroke(); } c.fillStyle = '#2a3a7a'; c.font = `700 40px ${FONT}`; c.fillText('SCHULHEFT', 40, 90); });
  const h = hp(w); show(DS2, h.x + .8 + k * 1.2, h.y - 2.2 + k * .8, h.z + 1.6, -.3 + k * .5, .22); orbit(V(TB.x + 2.4, 5, -5), lerp(13, 11, L.k), .35, .14, 42); sh(V(TB.x, 0, -4), 16); }, [[0, 'old_film', .4], [.3, 'paper_tear', .7]]);
// 57 «ihres Sohnes.»: el niño, en sepia, sostiene el cuaderno roto; ella pone la hoja en la cafetera como filtro: ¡funciona! sonríen
shot(85.22, 'C', null, L => { kuecheS(L); grade.uniforms.sepia.value = .9; const w = put(REN[3], TB.x - 1, 0, -6, .4), kid = put(JUG[1], TB.x + 3.4, 0, -6, -.4); laughF(w, L.T); laughF(kid, L.T); actuar(kid, 0, [[0, 'cheer']], { T: L.T }); actuar(w, 0, [[0, { aRx: 1.2, aRe: 1.0 }]], { T: L.T });
  const K = KAN[1]; show(K, TB.x + 1.2, 4.3, -3, 0, 1); K.userData.level(.7); show(FILT, TB.x + 1.2, 6.8, -3, 0, 1); orbit(V(TB.x + 1, 5.4, -5), lerp(13, 11.5, L.k), 0, .12, 42); sh(V(TB.x, 0, -4), 16); }, [[0, 'drip', .5], [.3, 'laugh_small', .4]]);
// 58 «Deshalb zählt bei Melitta»: vuelta al presente: la última gota cae del filtro a cámara lenta en la taza del dentista
shot(86.29, 'F', 'slow', L => { zahnS(L); const cu = CUPS[11]; show(cu, ZAX, 3.6, 2, .5, 1.4); cu.userData.level(.7); cu.userData.steam(L.T, 1); show(FILT, ZAX, 5.4, 2, 0, 1);
  const dp = DROP; dp.visible = true; const t = (L.lt * .7) % 1; dp.position.set(ZAX, 5.3 - t * 3.6, 2); dp.scale.set(1.6, 2.4, 1.6);
  cm([ZAX, 6.6, 6.6, ZAX, 5, 2, 34], [ZAX, 6.2, 5.2, ZAX, 4.8, 2, 30], L.k); sh(V(ZAX, 0, 2), 10); DOF = 1.6; }, [[0, 'drip', .6], [.8, 'drip', .6], [1.6, 'drip', .6]]);
// 59 «sogar der letzte Tropfen.»: la gota toca el café y el reloj del dentista suma: «+1 TROPFEN» con chispas
shot(87.60, 'C', 'punch', L => { zahnS(L); const d = put(brenner, ZAX, 0, 4, 0); drink(d, L, L.t0 + .3, .4, { meter: true, expr: 'happy', after: 'joy' }); meterOf(d).userData.set('+1 Tropfen', '+12 €', '#ffd23f');
  cashPop(d, '+1 TROPFEN', clamp(L.lt / .2), 'gold', 1); confetti(hp(d), L.t0 + .1, L.T, 20, .5); dcam(d, L.k, 10, -.8, 5.2, 42); sh(V(ZAX, 0, 4), 14); }, [[0, 'drop_plop', .6], [.1, 'cha_ching', .5]]);
// 60 «In seiner Mittagspause»: el dentista en su pausa, sentado con la taza y el móvil, distraído; en el móvil un anuncio enorme «KAUFEN»
shot(89.28, 'W', null, L => { zahnS(L); const d = sit2(brenner, ZAX - 8, 2, .3, 2.8); drinkLoop(d, L, 0, { sit: true, pose: { ...SITP, aLx: 1.2, aLe: 1.4, aLz: -.1 }, per: 2.4 }); cara(d, L.T, { expr: 'happy' });
  attach(PHONE, d.aL.hand, [0, -.6, .5], [-.4, 0, 0], .9); PHONE.userData.draw(c => { c.fillStyle = '#1a4ab8'; c.fillRect(0, 0, 300, 560); txt(c, 'MS ESPRESSO', 150, 140, 38, '#ffffff'); c.fillStyle = '#ffd23f'; c.beginPath(); c.roundRect(40, 380, 220, 100, 26); c.fill(); txt(c, 'KAUFEN', 150, 432, 44, '#1a1a1a'); });
  orbit(V(ZAX - 8, 4.6, 2), lerp(12, 10.5, L.k), .6, .14, 42); sh(V(ZAX - 8, 0, 2), 14); }, [[0, 'sip', .5], [.8, 'phone_tap', .4]]);
// 61 «hat er sich aus Versehen»: primer plano del pulgar que, al dar un sorbo, toca sin querer el botón «KAUFEN»: ¡clic! «GEKAUFT»
shot(90.66, 'C', 'punch', L => { zahnS(L); const d = sit2(brenner, ZAX - 8, 2, .3, 2.8); drink(d, L, L.t0 - .1, .35, { sit: true, pose: { ...SITP, aLx: 1.2, aLe: 1.4 }, expr: 'happy', after: 'shock', afterMouth: 'o' }); const k = L.lt > .45;
  const hw = wpos(d.aL.hand); show(PHONE, hw.x + .2, hw.y + .8, hw.z + .4, .35, .9); PHONE.rotation.x = -.3; PHONE.userData.draw(c => { c.fillStyle = k ? '#1a8a3a' : '#1a4ab8'; c.fillRect(0, 0, 300, 560); txt(c, 'MS ESPRESSO', 150, 140, 38, '#ffffff'); txt(c, k ? 'GEKAUFT!' : '', 150, 280, 48, '#ffd23f'); c.fillStyle = '#ffd23f'; c.beginPath(); c.roundRect(40, 380, 220, 100, 26); c.fill(); txt(c, 'KAUFEN', 150, 432, 44, '#1a1a1a'); });
  const w = wpos(PHONE); cm([w.x + 1.6, w.y + 2.2, w.z + 4.4, w.x, w.y, w.z, 34], [w.x + 1.2, w.y + 1.8, w.z + 3.6, w.x, w.y, w.z, 32], L.k); sh(V(ZAX - 8, 0, 2), 12); DOF = 1.4; }, [[0, 'sip', .4], [.45, 'click', .7], [.5, 'cha_ching', .5]]);
// 62 «ein Kreuzfahrtschiff gekauft.»: el MS ESPRESSO en alta mar, enorme; el dentista en la proa con la bata al viento, saludando, y la bocina retumba
shot(91.56, 'F', null, L => { meerS(L); SCHIFF.position.y = Math.sin(L.T * 1.2) * .3; const d = put(brenner, MEX, 15.8, 28, 0); d.blob.visible = false; actuar(d, 0, [[0, 'wave']], { T: L.T }); laughF(d, L.T);
  cm([MEX + 40, 18, 90, MEX, 12, 10, 48], [MEX + 34, 16, 78, MEX, 12, 12, 46], L.k); sh(V(MEX, 0, 10), 60); }, [[0, 'ship_horn', .8], [.4, 'seagull', .5], [.8, 'waves', .5]]);
// 63 «Und wer hat am meisten?»: travelling aéreo desde la plaza hasta la catedral al fondo; las campanas
shot(93.20, 'Z', null, L => { town(L, { morning: 1 }); crowdAt(L, 0, -40, 10, 4, 18, 52, { mode: i => ['walk', 'drink'][i % 2], gap: .6 });
  cm([0, 30, 40, 0, 20, -150, 50], [0, 40, -10, 0, 30, -150, 46], L.k); sh(V(0, 0, -40), 50); }, [[0, 'whoosh_up', .5], [.4, 'church_bell', .6]]);
// 64 «Unser Pfarrer.»: el Pfarrer Lindemann ante el portal de la catedral, con los brazos abiertos, rodeado de billetes que caen; feligreses
shot(94.35, 'C', 'punch', L => { town(L, { morning: 1 }); const p = put(pfarrer, 0, 0, -128, 0); actuar(p, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .9, aRz: .9, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(p, L.T); billRain(V(0, 0, -128), L.T, 50, 16, 8, 14);
  badge('tag', 'PFARRER LINDEMANN', W / 2, H * .18, clamp(L.lt / .2), 1, 1); crowdAt(L, 0, -118, 6, 5, 10, 54, { mode: 'clap', face: V(0, 5, -128), gap: 1.6 }); CAMK = 1; orbit(V(0, 6, -128), lerp(9, 8, L.k), 0, .14, 44); sh(V(0, 0, -126), 20); }, [[0, 'church_bell', .5], [.2, 'cha_ching', .5]]);
// 65 «Er trinkt sogar während der Predigt.»: en la Kanzel, sermoneando con una mano en alto… y con la otra da un sorbo a su taza; los fieles en los bancos
shot(95.17, 'W', null, L => { kircheS(L); const p = put(pfarrer, KIX - 11, 9.2, -10, .5); p.blob.visible = false; drink(p, L, L.t0 + .7, .4, { pose: { aLx: 2.6, aLz: .3, aLe: .4 }, meter: true, expr: 'happy' }); if (L.lt < .7) talk(p, L.T, L.t0, L.t0 + .7, 'happy');
  POST.push(() => { const l = CR.filter(c => !c.root.visible); let i = 0; for (const z of [2, 6.6, 11.2]) for (const s of [-1, 1]) for (const dx of [-2.6, 2.6]) { const c = l[i++]; if (!c) continue; sit2(c, KIX + s * 9 + dx, z, PI, 2.5); actuar(c, 0, [[0, sitPose({ aLx: .6, aRx: .6, aLe: 1.2, aRe: 1.2 })]], { T: L.T, weight: false }); cara(c, L.T + i, { expr: 'happy' }); } });
  orbit(V(KIX - 9, 10, -8), lerp(22, 19, L.k), .7, .1, 46); sh(V(KIX - 6, 0, -4), 28); }, [[0, 'church_echo', .5], [.7, 'sip', .6], [1.2, 'murmur', .4]]);
// 66 «Und seit elf Jahren»: de noche, iglesia vacía con velas; el cura sentado en un banco, con los ojos abiertos de par en par y ojeras; «11 JAHRE»
shot(97.04, 'B', null, L => { kircheS(L, { night: 1 }); const p = sit2(pfarrer, KIX + 6, 2, PI, 2.5); actuar(p, 0, [[0, sitPose({ aRx: 1.1, aRe: 1.2, aLx: .5, aLe: 1.0 })]], { T: L.T, weight: false }); cara(p, L.T, { eyes: 'wide', mouth: 'flat' }); const cu = mugOf(pfarrer); attach(cu, p.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], 1); cu.userData.steam(L.T, 1);
  badge('red', '11 JAHRE', W / 2, H * .2, clamp(L.lt / .2), 1, 1.1); orbit(V(KIX + 6, 5, 2), lerp(13, 11, L.k), PI + .5, .12, 42); sh(V(KIX + 6, 0, 2), 16); }, [[0, 'owl', .4], [.4, 'clock_tick', .5], [1.0, 'clock_tick', .5]]);
// 67 «kein Auge mehr zugemacht.» (zoom lento): primer plano de sus ojos abiertos, una mosca le pasa por delante y ni parpadea
shot(98.38, null, 'slow', L => { kircheS(L, { night: 1 }); const p = sit2(pfarrer, KIX + 6, 2, PI, 2.5); actuar(p, 0, [[0, sitPose({ aRx: 1.1, aRe: 1.2 })]], { T: L.T, weight: false }); cara(p, L.T, { eyes: 'wide', mouth: 'wavy' }); sweat(p, L.T, 1);
  show(MOTH, hp(p).x + Math.sin(L.T * 3) * 1.2, hp(p).y + 1 + Math.cos(L.T * 4) * .4, hp(p).z - 1.6, 0, .7); MOTH.children.forEach(w => { if (w.name) w.rotation.y = Math.sin(L.T * 30) * .8 * (w.name === 'w1' ? 1 : -1); });
  onFace(p, 4.4, .3, 0, 34, L.k, 3.4); sh(V(KIX + 6, 0, 2), 10); }, [[0, 'heartbeat', .5], [.6, 'fly_buzz', .4]]);
// 68 «Und schummeln?»: un tipo con capucha y bigote postizo mira a ambos lados en un callejón junto a la tienda, escondiendo un cubo
shot(99.77, 'C', null, L => { town(L, { dusk: 1 }); const t = put(trick, -38, 0, -50, PI / 2); actuar(t, 0, [[0, { ...GEST.sneak, headY: Math.sin(L.T * 5) * .7 }]], { T: L.T }); cara(t, L.T, { expr: 'sus', mouth: 'smirk' }); show(BUCKET, -36.6, 0, -48.8, 0, 1.2);
  orbit(V(-37, 4.6, -50), lerp(11, 9.5, L.k), PI / 2 + .3, .12, 42); sh(V(-37, 0, -50), 14); }, [[0, 'sneak', .6], [.3, 'suspense_pluck', .4]]);
// 69 «Lieber nicht.»: un policía en la esquina mueve el dedo índice: «no, no»
shot(100.50, 'W', 'punch', L => { town(L, { dusk: 1 }); const c = put(COPS[0], -22, 0, -28, -.6); actuar(c, 0, [[0, { aRx: 2.0, aRz: -.1, aRe: 1.8, aLx: .3 }]], { T: L.T, extra: { aRz: -.1 + Math.sin(L.T * 14) * .25 } }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' });
  onFace(c, 5.6, .4, .6, 40, L.k); sh(V(-22, 0, -28), 12); }, [[0, 'tsk', .6]]);
// 70 «Neulich hat einer braunes Wasser in seine Tasse gefüllt.»: el tramposo vierte agua de una jarra en su taza y la tiñe con pintura marrón del cubo
shot(101.40, 'S', null, L => { town(L, { dusk: 1 }); const t = put(trick, -38, 0, -50, PI / 2 - .3); const k = clamp(L.lt / 1.2); actuar(t, 0, [[0, { aRx: 1.4, aRz: -.2, aRe: .8, aLx: 1.2, aLz: .2, aLe: 1.2, lean: .1 }]], { T: L.T }); cara(t, L.T, { expr: 'sus', mouth: 'smirk' });
  attach(WATERJUG, t.aR.hand, [-.3, -.5, -.6], [PI / 2 + .8 * k, 0, 0], .9); const cu = CUPS[12]; attach(cu, t.aL.hand, [.84, -.2, -.72], [PI / 2, 0, 0], .9); cu.userData.level(k * .8); show(BUCKET, -36.4, 0, -48.6, 0, 1.2);
  if (L.lt > 1.4) badge('tag', 'BRAUNES WASSER', W / 2, H * .2, clamp((L.lt - 1.4) / .2), 1, .9); orbit(V(-37.6, 5, -50), lerp(10, 8.6, L.k), PI / 2 + .25, .1, 40); sh(V(-37, 0, -50), 14); }, [[0, 'pour', .6], [.9, 'stir', .5], [1.5, 'snicker', .4]]);
// 71 «Zweiundzwanzig Jahre»: bebe… y su Kaffeezähler se pone ROJO y suena la alarma; aparecen los dos policías y le esposan
shot(103.62, 'C', 'punch', L => { town(L, { dusk: 1 }); const t = put(trick, -38, 0, -50, PI / 2); actuar(t, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .4, aRz: .4, aLe: .4, aRe: .4 }]], { T: L.T }); cara(t, L.T, { expr: 'shock', mouth: 'scream' }); meterOf(t).userData.set('FALSCH!', 'ALARM', '#ff3a3a');
  COPS.forEach((c, i) => { const x = -38 + (i ? 3.4 : -.2), z = -50 + (i ? 1.6 : 3.4); put(c, x, 0, z, Math.atan2(-38 - x, -50 - z)); actuar(c, 0, [[0, { aRx: 1.4, aRe: .4, aLx: 1.4, aLe: .4, lean: .12 }]], { T: L.T }); cara(c, L.T, { expr: 'angry' }); });
  if (L.lt > .9) { const h = hp(t); show(CUFFS, h.x, h.y + 3.6, h.z + .3, 0, 1.2); } badge('red', '22 JAHRE', W / 2, H * .2, clamp((L.lt - .5) / .2), 1, 1.3);
  orbit(V(-37, 5.6, -49), lerp(14, 12, L.k), PI / 2 + .45, .12, 44); sh(V(-37, 0, -49), 16); }, [[0, 'alarm', .7], [.2, 'siren', .5], [.9, 'cuffs', .6], [1.2, 'gavel', .6]]);
// 72 «Gefängnis.»: los barrotes de la celda se cierran de golpe delante de él
shot(105.14, 'C', null, L => { zelleS(L); const t = put(trick, ZEX, 0, 0, 0); actuar(t, 0, [[0, { aLx: 1.6, aRx: 1.6, aLe: 1.4, aRe: 1.4 }]], { T: L.T }); cara(t, L.T, { expr: 'sad', mouth: 'frown' }); tears(t, L.T, 0);
  orbit(V(ZEX, 5.4, 0), lerp(13, 11, L.k), 0, .1, 42); sh(V(ZEX, 0, 0), 14); }, [[0, 'cell_door', .8], [.4, 'echo_thud', .4]]);
// 73 «Nur Leitungswasser.»: en la celda, se sirve un vaso de agua del grifo con cara de pena; un «0 €» flota
shot(105.98, 'W', null, L => { zelleS(L); const t = put(trick, ZEX + 2, 0, -2, -.3); drink(t, L, L.t0 + .3, .5, { kind: WATERJUG, expr: 'sad', after: 'sad', afterMouth: 'frown' }); badge('tag', 'NUR WASSER', W / 2, H * .2, clamp(L.lt / .2), 1, 1);
  dcam(t, L.k, 10, -.9, 5, 42); sh(V(ZEX + 2, 0, -2), 14); }, [[0, 'tap_water', .6], [.5, 'gulp', .4], [.9, 'sigh', .5]]);
// 74 «Und ehrlich?»: yo en la mesa de la cocina, giro los ojos hacia un lado con cara de sospecha
shot(107.20, 'C', 'punch', L => { kuecheS(L); const c = sit2(ich, TB.x + 3, -4.4, 0); actuar(c, 0, [[0, sitPose({ aLx: 1.2, aRx: 1.2, aLe: 1.6, aRe: 1.6, headY: -.3 })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'sus', eyes: 'side_r', mouth: 'smirk' });
  onFace(c, 5, .5, .4, 38, L.k); sh(V(TB.x + 3, 0, -4), 12); }, [[0, 'whoosh_soft', .4], [.1, 'hmm', .5]]);
// 75 «Ich wüsste sofort, wer bei uns»: miro de reojo a Oma, que a mi lado echa un chorrito de algo marrón de una petaca en su taza y silba
shot(107.98, 'W', null, L => { kuecheS(L); const c = sit2(ich, TB.x + 3, -4.4, 0); actuar(c, 0, [[0, sitPose({ aLx: 1.2, aRx: 1.2, aLe: 1.6, aRe: 1.6, headY: -.55 })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'sus', eyes: 'side_r', mouth: 'flat' });
  const o = omaSeat(oma, L, -3); actuar(o, 0, [[0, sitPose({ aRx: 1.2, aRe: 1.4, aLx: 1.3, aLe: .9, headY: .3 })]], { T: L.T, weight: false }); cara(o, L.T, { expr: 'smug', eyes: 'side_l', mouth: 'o' }); const cu = mugOf(oma); attach(cu, o.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], 1);
  badge('q', '♪', W * .3, H * .3, clamp(L.lt / .2), 1, .8); orbit(V(TB.x, 5, -4.4), lerp(13, 11.5, L.k), .05, .1, 42); sh(V(TB.x, 0, -4), 14); }, [[0, 'whistle_innocent', .6], [.8, 'pour_small', .4]]);
// 76 «als Erster da drin sitzen würde.»: me la imagino en la celda… sonriendo feliz con su Kanne de flores y su tarta, como en casa
shot(109.32, 'F', null, L => { zelleS(L); const o = sit2(oma, ZEX, 0, 0, 2.2); prost(o, L, .7, { sit: true, kind: OKAN, pose: SITP }); laughF(o, L.T); OKAN.userData.steam(L.T, 1); show(KUCH[0], ZEX + 3, 2.2, 1, 0, .9);
  badge('tag', 'OMA?', W / 2, H * .2, clamp(L.lt / .2), 1, 1); grade.uniforms.lift.value = .04; orbit(V(ZEX + 1, 4, 0), lerp(12, 10, L.k), .2, .12, 42); sh(V(ZEX, 0, 0), 14); }, [[0, 'dream_harp', .5], [.6, 'laugh_old', .4]]);

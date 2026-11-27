// ---------- a: la regla, Frau Kessler, los Brandt (0 – 50,15 s) ----------
// Calle: casa de Mats al este (puerta en x = 33, z = -1,5; porche PORCH), Kessler enfrente (puerta x = -33, z = 1,5), Brandt (x = 33, z = -101,5).
// Casa por dentro (HAX): puerta de casa en z = 19,9 (DOORIN delante, mirando a +z), escalera al oeste, Kammer en x = -1,75, puerta trasera en z = -45,9.
const KPORCH = HKW(HK.doorX, HK.B, HK.frontZ + 3.4), BPORCH = HBW(HBR.doorX, HBR.B, HBR.frontZ + 3.4);
const toDoorM = HM.rot + PI, toDoorK = HK.rot + PI, toDoorB = HBR.rot + PI;   // mirar a la puerta desde el porche
const SUND = P_(sphere(38, new THREE.MeshBasicMaterial({ color: 0xffb060, fog: false }), scene, 0, 0, 0, 24, 16));
// la puerta de casa por dentro se sacude (golpes) y el pomo gira solo
const rattle = (L, t0, n = 3, rate = 3.2, amt = 1) => { const t = L.lt - t0; if (t < 0 || t > n / rate) return 0; const ph = (t * rate) % 1; return Math.exp(-ph * 9) * amt; };
// ---- 1 «In dieser Stadt»: golpe de zoom en el Flur de noche: Mats retrocede de la puerta mientras el pomo gira solo, la cadena se tensa
//      y por el cristal lateral se ve la silueta de la Cosa sonriendo
shot(0, 'C', null, L => { flur(L, { h: 18, m: 10 }); const r = rattle(L, .05, 3, 3.6); HA.front.door.rotation.y = PI - r * .025; HA.front.knob.rotation.z = Math.sin(L.T * 20) * .6;
  HA.side.forEach(s => s.material.opacity = .22); const d = put(ding, DOORIN.x + 4.1, 0, 22.4, PI); creepF(d, L.T, 1); lp(0, DOORIN.x + 4.1, 8, 25, 80, 0xffb060, 16);
  const c = put(mats, DOORIN.x + .2, 0, 12.6 - easeOut(L.k) * 2, PI + .2); actuar(c, L.lt, [[0, 'idle'], [.08, 'recoil', { dur: .25 }]], { T: L.T, extra: shiver(L.T, 1) }); cara(c, L.T, { expr: 'scared', mouth: 'o' });
  cm([DOORIN.x + 1.6, 6.2, -2, DOORIN.x + 1.8, 5.6, 18], [DOORIN.x + 1.4, 6.4, 0, DOORIN.x + 1.8, 5.8, 18], L.k, easeOut); }, [[0, 'knock', .8], [.28, 'knock', .8], [.55, 'chain_rattle', .6]]);
// ---- 2 «hat jede Familie»: en la cocina, Mama se inclina sobre la mesa y les cuchichea algo a Mats e Ida; Ida se ríe tapándose la boca
shot(.84, 'W', 'punch', L => { kuecheS(L); const m = put(mamaB, KUX, 0, -8.6, 0); actuar(m, L.lt, [[0, { lean: .34, aLx: 1.0, aRx: 1.0, aLz: .1, aRz: .1, aLe: 1.2, aRe: 1.2, headX: .25, headY: Math.sin(L.T * 3) * .3 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: Math.sin(L.T * 14) > 0 ? 'o' : 'smile', eyes: 'half' });
  const c = sit(mats, KUX - 2.5, 2.8, -5.4, .25, L, { aLx: .9, aRx: .9, aLe: 1.4, aRe: 1.4, lean: .2, headZ: -.25 }); cara(c, L.T, { expr: 'happy', eyes: 'wide', mouth: 'smile' });
  const i = sit(ida, KUX + 2.5, 2.8, -5.4, -.25, L, { aLx: 2, aRx: 2, aLe: 2.3, aRe: 2.3, lean: .1 + Math.sin(L.T * 16) * .04 }); cara(i, L.T, { eyes: 'happy', mouth: 'laugh' });
  cm([KUX - 2, 9.6, 10, KUX, 5.4, -6.4, 48], [KUX + 1.2, 9.2, 8.6, KUX, 5.4, -6.4, 48], L.k); }, [[.05, 'whisper', .7], [.4, 'kids_laugh', .4]]);
// ---- 3 «ein geheimes Wort.»: primer plano: Mama le susurra al oído a Mats, que abre mucho los ojos; «PSST!» y «GEHEIM»
shot(1.76, 'S', null, L => { kuecheS(L); const c = put(mats, KUX - 1, 0, 8.4, 0), m = put(mamaB, KUX + 1.9, 0, 8.1, -PI / 2); actuar(m, L.lt, [[0, { lean: .3, crouch: .16, aRx: 1.9, aRz: -.3, aRe: 2.1, headX: .1 }]], { T: L.T }); cara(m, L.T, { eyes: 'half', mouth: Math.sin(L.T * 18) > 0 ? 'o' : 'flat' });
  actuar(c, L.lt, [[0, { aRx: 2.3, aRz: .1, aRe: 2.6, headY: .2 }]], { T: L.T }); cara(c, L.T, { eyes: 'wide', mouth: 'o' });
  onFace(c, 5.6, -.2, -2.8, 40, L.k, 4.6); badge('tag', 'GEHEIM', W / 2, H * .18, (L.lt - .4) / .2); }, [[0, 'whisper', .8], [.45, 'pop', .4]]);
// ---- 4 «Wenn Mama nach Einbruch der Dunkelheit»: atardecer azul: Mama, de espaldas, sube los escalones del porche con el bolso; farol encendido, bosque detrás
shot(3.09, 'Z', null, L => { strasse(L, { t: 'dusk', k: 1, lamps: true }); const p = PORCH; const s = clamp(L.lt / 1.3); const c = walk(mama, L, p.x - 9 + s * 5.4, p.z + .6, PI / 2, 0, 0, { y: Math.min(HM.B, s * 2.2) }); actuar(c, 0, [[0, { ...walkP(L.T, 0), aRx: .2, aRe: .6 }]], { T: L.T });
  attach(BAG, c.aR.hand, [0, -1.2, 0], [0, 0, 0], .9); breath(c, L.T); cara(c, L.T, { expr: 'neutral' }); lp(0, p.x + 3, 11, p.z, 50, 0xffb860, 26);
  cm([p.x - 22, 7, p.z + 7, p.x - 2, 5.6, p.z], [p.x - 17, 6.4, p.z + 5, p.x - 1, 5.8, p.z], L.k); sh(V(p.x, 0, p.z), 30); }, [[0, 'steps', .5], [.6, 'wood_creak', .4], [.2, 'owl', .3]]);
// ---- 5 «heimkommt und es nicht kennt,»: en el porche: Mama llama a la puerta… y cuando dentro le preguntan el Wort, se encoge de hombros: «???»
shot(4.51, 'F', null, L => { strasse(L, { t: 'night' }); const p = PORCH; const c = put(mama, p.x, p.y, p.z + .4, toDoorM); actuar(c, L.lt, [[0, knockP(L.T)], [.6, 'shrug', { dur: .3 }]], { T: L.T }); cara(c, L.T, L.lt > .6 ? { expr: 'confused', mouth: 'grimace' } : { expr: 'neutral' });
  lp(0, p.x - 3, 10, p.z - 3, 60, 0xffb860, 26); badge('q', '???', W / 2, H * .2, (L.lt - .7) / .2); cm([p.x - 9.5, 7.4, p.z - 7, p.x, 5.8, p.z - .4, 42], [p.x - 8, 7, p.z - 5.6, p.x, 5.8, p.z - .2, 42], L.k); sh(V(p.x, 0, p.z), 26); }, [[.05, 'knock', .7], [.25, 'knock', .7], [.7, 'creepy_ting', .5]]);
// ---- 6 «machst du die Tür nicht auf.»: dentro: Mats engancha la cadena, gira el cerrojo y niega con la cabeza; X roja
shot(6.01, 'C', null, L => { flur(L); const c = put(mats, DOORIN.x + .4, 0, DOORIN.z - .4, -.35); actuar(c, L.lt, [[0, { aRx: 1.9, aRz: .3, aRe: .6, headX: -.1 }], [.6, { aRx: .3, aLx: .2, headY: Math.sin(L.T * 12) * .45 }, { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'flat' });
  HA.front.thumb.rotation.z = clamp((L.lt - .3) / .2) * PI / 2; badge('x', '', W / 2, H * .2, (L.lt - .75) / .2, 1, 1.6);
  cm([DOORIN.x - 4.2, 6.8, 19.4, DOORIN.x + .4, 5.2, 15.6, 42], [DOORIN.x - 3.6, 6.6, 19.6, DOORIN.x + .4, 5.2, 15.8, 42], L.k); }, [[.1, 'chain_rattle', .7], [.35, 'click_metal', .8], [.75, 'thud', .4]]);
// ---- 7 «Denn wenn es dunkel wird,»: grúa sobre la calle: el cielo pasa de atardecer a noche y las farolas se encienden una a una
shot(7.52, 'W', null, L => { strasse(L, { t: 'dusk', k: 1 }); const n = Math.floor(L.k * 1.6 * SD.lamps.length); SD.lamps.forEach((l, i) => { const on = i < n; l.glass.material.emissiveIntensity = on ? 3.2 : .05; l.halo.material.opacity = on ? .75 : 0; l.puddle.material.opacity = on ? .3 : 0; });
  if (L.k > .5) { night(20); } walk(EXS[0], L, -13, 30, PI, 3, 0, { expr: 'neutral' }); walk(EXS[1], L, 13, -10, 0, 2.6, 1, { expr: 'worried' });
  cm([0, 26, 70, 0, 6, -80, 50], [0, 12, 50, 0, 6, -90, 50], L.k); sh(V(0, 0, 0), 60); }, [[0, 'wind', .4], [.3, 'switch', .3], [.7, 'switch', .3]]);
// ---- 8 «kommen sie aus dem Wald.»: al final de la calle, entre los abetos y la niebla, salen tres Cosas andando rígidas hacia la cámara
shot(8.79, 'S', null, L => { strasse(L, { t: 'night' }); scene.fog.density = .006; [0, 1, 2].forEach(i => { const c = walk(CALL[i], L, -7 + i * 7, -198 + (i % 2) * 6, 0, 2.2, i, { stiff: true, face: false }); creepF(c, L.T + i, .5 + i * .15); });
  cm([0, 6.5, -150, 0, 6.6, -200, 42], [0, 6.2, -160, 0, 6.6, -200, 42], L.k); sh(V(0, 0, -190), 40); }, [[0, 'owl', .5], [.2, 'leaves', .5], [.5, 'steps', .4]]);
// ---- 9 «Mit dem Gesicht»: primer plano de una Cosa: su cara en blanco parpadea (glitch) y se convierte en la de un abuelo sonriente
shot(9.96, 'G', 'punch', L => { strasse(L, { t: 'night' }); scene.fog.density = .005; const c = put(CALL[0], 0, 0, -186, 0); actuar(c, 0, [[0, stiffP(0, 0)]], { T: L.T }); const g = L.lt > .45;
  if (g) cara(c, L.T, { eyes: 'happy', mouth: 'open_smile' }); else c.setFace({ eyes: 'closed', mouth: 'flat' }); if (L.lt > .35 && L.lt < .5) TINT = 'rgba(160,220,255,.18)';
  onFace(c, 5.4, 0, 0, 40, L.k, 4.6); lp(0, 0, 9, -178, 50, 0xffc080, 20); }, [[.38, 'glitch', .7], [.45, 'creepy_ting', .5]]);
// ---- 10 «und der Stimme von jemandem, den du liebst.»: una Cosa con abrigo llama a la puerta de los vecinos con voz dulce («Schatz, ich bin’s!»), corazones
shot(10.89, 'R', null, L => { strasse(L, { t: 'night' }); const dx = -29.6, dz = -48.5; const c = put(CALL[2], dx, 1.6, dz, -PI / 2 + .5); actuar(c, L.lt, [[0, { aRx: 1.0, aRe: 1.2, lean: .1, headX: -.1, headZ: Math.sin(L.T * 2) * .1 }]], { T: L.T });
  creepTalk(c, L.T, 10.89, 12.78, .45); bubble(c, 'Schatz, ich bin’s!', (L.lt - .2) / .2); lp(0, dx + 4, 10, dz + 4, 60, 0xffb860, 24);
  orbit(V(dx, 6.2, dz), lerp(13, 11, L.k), .55, .08, 42); sh(V(dx, 0, dz), 26); }, [[.1, 'knock', .5], [.3, 'whisper', .4]]);
// ---- 11 «Rein können sie nur,»: la Cosa aprieta las palmas contra la puerta cerrada y gira el pomo: no se abre. X roja
shot(12.78, 'W', null, L => { strasse(L, { t: 'night' }); const dx = -30.4, dz = -48.5; const c = put(CALL[1], dx, 1.6, dz, -PI / 2); actuar(c, L.lt, [[0, { ...GEST.push, lean: .3 + Math.sin(L.T * 9) * .05 }]], { T: L.T, extra: shiver(L.T, 2) }); creepF(c, L.T, .8);
  badge('x', '', W / 2, H * .2, (L.lt - .6) / .2); lp(0, dx + 4, 10, dz - 4, 60, 0xffb860, 24); orbit(V(dx - .4, 6, dz), lerp(12, 10, L.k), .75, .1, 42); sh(V(dx, 0, dz), 26); }, [[.05, 'door_crash', .4], [.35, 'click_metal', .5], [.6, 'thud', .5]]);
// ---- 12 «wenn du ihnen die Tür aufmachst.» (zoom lento): una niña abre la puerta de su casa… y la sonrisa de la Cosa aparece en la rendija
shot(14.01, 'Z', 'slow', L => { flur(L); const op = easeInOut(clamp(L.lt / 1.2)); HA.front.door.rotation.y = PI - op * 1.15;
  const g = put(KIDS[2], DOORIN.x - .6, 0, 14.4, .15); actuar(g, L.lt, [[0, { aRx: 1.4, aRe: .4, lean: .08 }]], { T: L.T }); cara(g, L.T, { expr: 'happy', eyes: 'normal' });
  const d = put(CALL[2], DOORIN.x + 1.6, 0, 23.4, PI); creepF(d, L.T, .5 + op * .5); lp(0, DOORIN.x + 1, 8, 25, 90, 0xffb060, 14);
  cm([DOORIN.x - 3, 7, 5, DOORIN.x + 1.4, 6.2, 22], [DOORIN.x - 1.8, 7, 8.6, DOORIN.x + 1.4, 6.4, 22], L.k); }, [[0, 'door_open', .7], [.3, 'wood_creak', .6]]);
// ---- 13 «Deshalb gilt nach Sonnenuntergang:»: el sol se esconde detrás de las montañas y el bosque; la calle se tiñe de naranja; un vecino cierra la contraventana
shot(15.85, 'W', null, L => { strasse(L, { t: 'dusk', k: .9 }); show(SUND, 0, lerp(40, -10, L.k), -1100); walk(EXS[3], L, 13, 34, PI, 2.4, 0, { expr: 'worried' }); walk(EXS[4], L, -13, 10, PI, 3.2, 1, { expr: 'worried', run: true });
  cm([-4, 8, 90, 0, 14, -300, 40], [-3, 7, 80, 0, 10, -300, 40], L.k); sh(V(0, 0, 40), 60); }, [[0, 'wind', .5], [.5, 'bell_far', .5]]);
// ---- 14 «Wer klopft,»: primer plano de unos nudillos llamando a una puerta azul (tres golpes)
shot(17.65, 'C', 'punch', L => { strasse(L, { t: 'night' }); const p = PORCH; const c = put(EXS[5], p.x + .8, p.y, p.z + 1.6, toDoorM - .4); actuar(c, L.lt, [[0, knockP(L.T, 0, 4)]], { T: L.T }); cara(c, L.T, { expr: 'neutral' });
  lp(0, p.x + 3, 10, p.z - 2, 50, 0xffb860, 20); const dd = HMW(HM.doorX + 1.2, HM.B + 5.4, HM.frontZ + 2.2), t = HMW(HM.doorX + .4, HM.B + 5.4, HM.frontZ); cam([dd.x, dd.y, dd.z + 3], [t.x, t.y, t.z], 44); }, [[.02, 'knock', .9], [.27, 'knock', .9], [.52, 'knock', .9]]);
// ---- 15 «sagt zuerst euer Familienwort.»: dentro, Mats pega la oreja a la puerta, levanta un dedo: «Das Wort?»; etiqueta FAMILIENWORT
shot(18.43, 'S', null, L => { flur(L); const c = put(mats, DOORIN.x - .2, 0, 18.3, PI / 2); actuar(c, L.lt, [[0, { ...GEST.listen, headZ: -.32, aLx: 1.8, aLz: .2, aLe: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', mouth: 'o' }); bubble(c, 'Das Wort?', (L.lt - .25) / .2, 1.8);
  badge('tag', 'FAMILIENWORT', W / 2, H * .62, (L.lt - 1.0) / .2); cm([DOORIN.x + 5, 6.4, 10.5, DOORIN.x - .2, 5.4, 18.3, 42], [DOORIN.x + 4, 6.2, 12, DOORIN.x - .2, 5.4, 18.3, 42], L.k); }, [[.1, 'cloth', .4], [.35, 'pop', .4]]);
// ---- 16 «Frau Kessler von gegenüber»: desde el porche de Mats, al otro lado de la calle: la señora Kessler (rulos, rebeca menta) vuelve a casa con la bolsa de la compra
shot(20.35, 'W', null, L => { strasse(L, { t: 'night' }); const p = KPORCH; const c = walk(kessler, L, p.x + 7 - L.lt * 2.6, p.z + 1, -PI / 2, 0, 0, { expr: 'neutral' }); c.root.position.x = p.x + 7 - L.lt * 2.6; attach(BAG, c.aL.hand, [0, -1.2, 0], [0, 0, 0], .9); breath(c, L.T);
  lp(0, p.x + 3, 11, p.z, 55, 0xffb860, 26); cm([PORCH.x - 4, 8, PORCH.z - 6, p.x + 4, 5, p.z], [PORCH.x - 8, 7.6, PORCH.z - 4, p.x + 4, 5, p.z], L.k); sh(V(p.x, 0, p.z), 30); }, [[0, 'steps', .5], [.4, 'paper', .3]]);
// ---- 17 «schreit ihres jeden Abend an ihre eigene Haustür.»: la Kessler, delante de su puerta, se pone las manos en la boca y grita
shot(21.39, 'R', null, L => { strasse(L, { t: 'night' }); const p = KPORCH; const c = put(kessler, p.x, p.y, p.z + .2, toDoorK); actuar(c, L.lt, [[0, 'idle'], [.5, { aLx: 2.1, aRx: 2.1, aLz: -.2, aRz: -.2, aLe: 2.2, aRe: 2.2, lean: .2 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, L.lt > .5 ? { expr: 'shout', mouth: 'talk_wide' } : { expr: 'neutral' });
  show(BAG, p.x + 1.6, p.y + .9, p.z - 1.8); lp(0, p.x + 4, 10, p.z + 3, 60, 0xffb860, 26); orbit(V(p.x, 6.2, p.z), lerp(15, 12.5, L.k), PI / 2 - .5, .1, 42); sh(V(p.x, 0, p.z), 26); }, [[.1, 'steps', .4], [.6, 'breath', .5]]);
// ---- 18 «„Sauerkraut!“»: primer plano gritando (gafas temblando), golpe de zoom; «SAUERKRAUT!» enorme
shot(24.35, 'C', 'punch', L => { strasse(L, { t: 'night' }); const p = KPORCH; const c = put(kessler, p.x + 2.4, p.y, p.z + .6, toDoorK + 1.3); actuar(c, 0, [[0, { aLx: 2.1, aRx: 2.1, aLz: -.2, aRz: -.2, aLe: 2.2, aRe: 2.2, lean: .25, headX: -.15 }]], { T: L.T, extra: shiver(L.T, 3) }); cara(c, L.T, { eyes: 'squint', mouth: 'talk_wide' });
  SHAKE = .5; bigNum('SAUERKRAUT!', (L.lt - .05) / .15, 'gold', .18, 1.05); lp(0, p.x + 4, 9, p.z + 4, 60, 0xffb860, 20); onFace(c, 4.4, -.3, 0, 40, L.k, 3.9); }, [[0, 'shout_m', .9]]);
// ---- 19 «Sie wohnt ganz allein.»: plano alto de su casa: una sola ventana encendida y ella, diminuta, sola en el porche; un gato en la barandilla
shot(25.11, 'I', null, L => { strasse(L, { t: 'night' }); const p = KPORCH; const c = put(kessler, p.x, p.y, p.z + .2, toDoorK + .3); actuar(c, 0, [[0, { aLx: .3, aRx: .3, headX: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  lp(0, p.x + 3, 11, p.z, 40, 0xffb860, 24); cm([p.x + 30, 30, p.z + 14, p.x - 6, 6, p.z], [p.x + 28, 26, p.z + 10, p.x - 6, 6, p.z], L.k); sh(V(p.x, 0, p.z), 40); }, [[0, 'crickets', .5], [.3, 'wind', .3]]);
// ---- 20 «Trotzdem schreit sie es ins leere Haus,»: se agacha y grita por la ranura del buzón de su propia puerta
shot(26.0, 'S', null, L => { strasse(L, { t: 'night' }); const p = KPORCH; const c = put(kessler, p.x, p.y, p.z - 1.2, toDoorK); actuar(c, L.lt, [[0, { lean: .5, crouch: .35, aLx: 1.6, aRx: 1.6, aLe: 1.8, aRe: 1.8, headX: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'shout', mouth: Math.sin(L.T * 10) > 0 ? 'talk_wide' : 'o' });
  bubble(c, 'SAUERKRAUT!', (L.lt - .3) / .2, 1.5); lp(0, p.x + 4, 9, p.z + 3, 60, 0xffb860, 20); orbit(V(p.x, 4.4, p.z - 1), lerp(11, 9.4, L.k), PI / 2 - .45, .04, 44); sh(V(p.x, 0, p.z), 26); }, [[.2, 'shout_m', .5], [.6, 'metal_creak', .3]]);
// ---- 21 «bevor sie aufschließt.»: primer plano: el manojo de llaves gira en la cerradura de su puerta
shot(27.98, 'C', null, L => { strasse(L, { t: 'night' }); const p = KPORCH; const c = put(kessler, p.x, p.y, p.z - .8, toDoorK); actuar(c, 0, [[0, { aRx: 1.5, aRe: .5, lean: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'neutral' });
  const k = HKW(HK.doorX + 1.9, HK.B + 4.6, HK.frontZ + .6); show(KEYS, k.x, k.y, k.z, toDoorK, 1.3); KEYS.rotation.z = -easeInOut(clamp(L.lt / .6)) * 1.4; lp(0, k.x + 2, k.y + 2, k.z, 40, 0xffc080, 12);
  cam([k.x + 2.6, k.y + .6, k.z + 2.4], [k.x, k.y - .2, k.z], 40); }, [[.05, 'keys', .8], [.4, 'click_metal', .7]]);
// ---- 22 «Nur zur Sicherheit.»: abre una rendija y alumbra dentro con la linterna; asiente y entra
shot(29.09, 'F', null, L => { strasse(L, { t: 'night' }); HK.door.rotation.y = .7; const p = KPORCH; const c = put(kessler, p.x - .4, p.y, p.z - 1.4, toDoorK + .2); actuar(c, L.lt, [[0, { aRx: 1.5, aRe: .2, lean: .2, headX: Math.sin(L.T * 3) * .1 }], [.6, { aRx: 1.5, aRe: .2, lean: .1, headX: .25 }, { dur: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sus' });
  attach(TORCH, c.aR.hand, [0, -1, .5], [0, 0, 0], 1); lp(0, p.x - 3, 6, p.z - 1.6, 30, 0xfff4d0, 10); orbit(V(p.x, 5.8, p.z - 1), lerp(13, 11, L.k), toDoorK + PI - 1.0, .12, 42); sh(V(p.x, 0, p.z), 26); }, [[0, 'door_open', .5], [.3, 'switch', .4]]);
// ---- 23 «Inzwischen kennt die ganze Straße ihr Wort.»: travelling por la acera: vecinos que se ríen y gritan «Sauerkraut!» desde sus porches
shot(30.14, 'W', null, L => { strasse(L, { t: 'night' }); const spots = [[-4.5, 30, 'laugh'], [4, 26, 'shout'], [-1.5, 20, 'laugh'], [5, 15, 'point'], [-5, 12, 'talk']];
  spots.forEach(([x, z, m], i) => crowdGuy(EXS[i], x, z, L, i, { mode: m })); bubble(EXS[1], 'Sauerkraut!', (L.lt - .2) / .2); bubble(EXS[3], 'Sauerkraut!', (L.lt - .9) / .2);
  cm([-2, 8, 50, 0, 5, 12, 46], [2, 7.4, 44, 0, 5, 10, 46], L.k); sh(V(0, 0, 20), 40); }, [[.1, 'kids_laugh', .4], [.3, 'laugh_deep', .4]]);
// ---- 24 «Letzten Herbst»: otoño: árboles naranjas, hojas cayendo delante de la casa de los Brandt; un niño Brandt barre hojas
shot(32.52, 'F', null, L => { strasse(L, { t: 'dusk', k: .5, autumn: true }); const p = BPORCH; leaves(V(p.x - 10, 0, p.z), L.T, 30, 30, 30, 18); const k = put(BRANDT[2], p.x - 12, 0, p.z + 4, -PI / 2); actuar(k, 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: .5, aRe: .5, lean: .15, twist: Math.sin(L.T * 6) * .3 }]], { T: L.T }); cara(k, L.T, { expr: 'happy' });
  badge('tag', 'LETZTEN HERBST', W / 2, H * .17, (L.lt - .1) / .2); orbit(V(p.x - 4, 8, p.z), lerp(42, 36, L.k), -PI / 2 - .5, .14, 46); sh(V(p.x, 0, p.z), 40); }, [[0, 'leaves', .6], [.3, 'wind', .4]]);
// ---- 25 «haben die Brandts ihrem Vater die Tür aufgemacht.»: la madre abre la puerta encantada; los niños corren a abrazar al padre, que sonríe demasiado
shot(33.58, 'R', null, L => { strasse(L, { t: 'dusk', k: 1, lamps: true, autumn: true }); HBR.door.rotation.y = easeOut(clamp(L.lt / .5)) * 1.3; const p = BPORCH;
  const f = put(BRANDT[0], p.x, p.y, p.z + 1.2, toDoorB); actuar(f, 0, [[0, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: .6, aRe: .6 }]], { T: L.T }); creepF(f, L.T, .55);
  const mo = put(BRANDT[1], p.x + 1.8, p.y, p.z - 2.2, toDoorB + PI - .4); actuar(mo, 0, [[0, 'cheer']], { T: L.T }); cara(mo, L.T, { eyes: 'happy', mouth: 'open_smile' });
  const k1 = put(BRANDT[3], p.x + 1, p.y, p.z - .4, toDoorB + PI - .2); actuar(k1, 0, [[0, { aLx: 1.8, aRx: 1.8, lean: .2 }]], { T: L.T }); laughF(k1, L.T);
  lp(0, p.x - 4, 10, p.z - 4, 70, 0xffb860, 26); cm([p.x - 10, 7.6, p.z - 6.5, p.x + .4, 5.6, p.z - .6, 44], [p.x - 8.6, 7.2, p.z - 5.4, p.x + .4, 5.6, p.z - .6, 44], L.k); sh(V(p.x, 0, p.z), 26); }, [[0, 'door_open', .6], [.3, 'kids_laugh', .5], [.6, 'hug', .4]]);
// ---- 26 «Ohne nach dem Wort zu fragen.» (zoom lento): el padre cruza el umbral; su sonrisa se estira; «WORT?» tachado
shot(35.52, 'Z', 'slow', L => { strasse(L, { t: 'dusk', k: 1, lamps: true, autumn: true }); HBR.door.rotation.y = 1.3; const p = BPORCH; const f = walk(BRANDT[0], L, p.x - 1, p.z + .6, toDoorB, 1.0, 0, { y: p.y, stiff: true, face: false }); f.root.rotation.y = toDoorB + PI * .8; creepF(f, L.T, .6 + L.k * .4);
  badge('tag', 'WORT?', W / 2, H * .17, (L.lt - .2) / .2); if (L.lt > .7) badge('x', '', W / 2, H * .17, (L.lt - .7) / .2, 1, .8); lp(0, p.x - 4, 9, p.z + 3, 70, 0xffb860, 24);
  onFace(f, 6.2, -.2, 0, 42, L.k, 4.2); }, [[.1, 'steps', .4], [.7, 'creepy_ting', .6]]);
// ---- 27 «Am nächsten Morgen stand die ganze Familie an der Straßenbahn.»: mañana con niebla en la parada; los cinco Brandt en fila, quietos; llega el tranvía
shot(36.98, 'W', null, L => { strasse(L, { t: 'morning' }); SD.tram.visible = true; SD.tram.position.set(-4, 0, lerp(160, 100, easeOut(clamp(L.lt / 2.4))));
  BRANDT.forEach((c, i) => { put(c, -15, 0, 60 + i * 3.6, PI / 2); actuar(c, 0, [[0, { aLx: .02, aRx: .02, aLz: .05, aRz: .05 }]], { T: L.T, breathe: false, weight: false }); creepF(c, L.T + i, .55); });
  cm([14, 7.2, 50, -15, 5.2, 67.2, 44], [11, 6.8, 54, -15, 5.2, 67.2, 44], L.k); sh(V(-15, 0, 66), 30); }, [[0, 'bells', .5], [.3, 'wheels', .5], [1.5, 'bell_far', .4]]);
// ---- 28 «Alle fünf.»: los números 1–5 saltan sobre sus cabezas
shot(39.95, 'C', 'punch', L => { strasse(L, { t: 'morning' }); BRANDT.forEach((c, i) => { put(c, -15, 0, 60 + i * 3.6, PI / 2); actuar(c, 0, [[0, { aLx: .02, aRx: .02 }]], { T: L.T, breathe: false }); creepF(c, L.T, .55); badge3('num', String(i + 1), hp(c).add(V(0, 3, 0)), (L.lt - i * .1) / .15, .9); });
  cm([26, 7.6, 67.2, -15, 5.6, 67.2, 44], [24, 7.4, 67.2, -15, 5.6, 67.2, 44], L.k); sh(V(-15, 0, 66), 30); }, [[0, 'pop', .5], [.1, 'pop', .5], [.2, 'pop', .5], [.3, 'pop', .5], [.4, 'pop', .5]]);
// ---- 29 «Alle mit demselben breiten Lächeln.» (zoom lento): travelling lateral pegado a sus caras: la misma sonrisa enorme en todos
shot(40.76, 'Z', 'slow', L => { strasse(L, { t: 'morning' }); BRANDT.forEach((c, i) => { put(c, -15, 0, 60 + i * 3.6, PI / 2); actuar(c, 0, [[0, { aLx: .02, aRx: .02, headZ: Math.sin(L.T * .8 + i) * .05 }]], { T: L.T, breathe: false }); creepF(c, L.T + i, .85 + L.k * .15); });
  const z = lerp(60, 74.4, easeInOut(L.k)), c = BRANDT[clamp(Math.round((z - 60) / 3.6), 0, 4)]; const h = hp(c); cam([-15 + 9, h.y + .4, z + 1.4], [-15, h.y + .1, z], 40); }, [[.1, 'creepy_ting', .5]]);
// ---- 30 «Die echten Brandts hat seitdem niemand mehr gesehen.»: el cartel «VERMISST» en una farola, ondeando; dos vecinos lo miran y se miran asustados
shot(42.64, 'W', null, L => { strasse(L, { t: 'dusk', k: .7 }); const lx = 12.5, lz = -103; show(POSTER, lx - .4, 7.5, lz, -PI / 2); POSTER.rotation.z = Math.sin(L.T * 3) * .04;
  const a = put(EXS[6], lx - 4, 0, lz + 2.4, PI / 2 - .3), b = put(EXS[7], lx - 4.4, 0, lz - 2.2, PI / 2 + .4); actuar(a, L.lt, [[0, GEST.point], [1.2, 'hands_face', { dur: .3 }]], { T: L.T }); cara(a, L.T, { expr: 'worried', mouth: 'o' }); actuar(b, 0, [[0, 'hug_self']], { T: L.T }); cara(b, L.T, { expr: 'scared' });
  orbit(V(lx - 2, 5.6, lz), lerp(16, 13, L.k), -PI / 2 - .4, .06, 44); sh(V(lx, 0, lz), 26); }, [[0, 'paper', .5], [.4, 'wind', .4], [1.2, 'gasp', .4]]);
// ---- 31 «In ihrem Haus brennt jede Nacht jedes Licht.»: la casa de los Brandt de noche: las ventanas se encienden una tras otra hasta brillar todas
shot(45.37, 'S', null, L => { strasse(L, { t: 'night' }); HBR.wins.forEach((w, i) => { const on = L.lt > i * .2; w.material.emissiveIntensity = on ? 1.6 + Math.sin(L.T * 30 + i) * .1 : 0; });
  walk(EXS[8], L, -13, -88, PI, 2.4, 0, { expr: 'worried' }); orbit(V(33, 11, -101), lerp(48, 40, L.k), -PI / 2 + .35, .1, 46); sh(V(33, 0, -101), 40); }, [[0, 'switch', .4], [.4, 'switch', .4], [.8, 'switch', .4], [1.2, 'hum_low', .4]]);
// ---- 32 «Und keiner da drin geht jemals schlafen.»: a las 3:00, los cinco sentados en fila en el porche, muy rectos, mirándonos sin parpadear
shot(48.03, 'F', null, L => { strasse(L, { t: 'night' }); HBR.wins.forEach(w => w.material.emissiveIntensity = 1.7); const p = BPORCH;
  BRANDT.forEach((c, i) => { const s = HBW(HBR.doorX - 6 + i * 3, HBR.B, HBR.frontZ + 2.6); put(c, s.x, s.y, s.z, HBR.rot); actuar(c, 0, [[0, { aLx: .02, aRx: .02, headY: Math.sin(L.T * .5 + i) * .05 }]], { T: L.T, breathe: false, weight: false }); creepF(c, L.T, .6); });
  bigNum('03:00', (L.lt - .2) / .2, 'red', .15, .9); lp(0, p.x - 5, 10, p.z, 70, 0xffb860, 26); orbit(V(p.x - 2, 5.4, p.z + 1), lerp(30, 25, L.k), HBR.rot + .02, .05, 44); sh(V(p.x, 0, p.z), 30); }, [[0, 'clock_tick', .6], [.6, 'creepy_ting', .5]]);

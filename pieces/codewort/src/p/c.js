// ---------- c: la palabra, la llamada y el eco (106,31 – 163,97 s) ----------
// pantalla partida: arriba Mama en la oficina, abajo (split) la Cosa en el porche o Mats en el pasillo
const officeMama = (L, a, b, o = {}) => { bueroS(L); const m = put(mamaB, BUX + 1.2, 0, 7.4, .15 + (o.ry ?? 0)); actuar(m, L.lt, [[0, { ...GEST.phone, ...(o.pose || {}) }]], { T: L.T }); if (a != null) talk(m, L.T, a, b, o.expr || 'worried'); else cara(m, L.T, { expr: o.expr || 'worried' });
  attach(PHONE, m.aR.hand, [0, -.6, .5], [-.3, 0, 0], .85); show(LUNCH, BUX - 1, 5.8, .4, .3, .5); [[BUX - 15, -3.6, 0], [BUX + 15, -3.6, 1]].forEach(([x, z, i]) => { const c = sit(EXS[i], x, 2.9, z, PI, L, { aLx: 1.3, aRx: 1.3, aLe: 1.2, aRe: 1.2, aLz: Math.sin(L.T * 20 + i) * .1, aRz: Math.cos(L.T * 22 + i) * .1, headX: .2 }); cara(c, L.T + i, { expr: 'neutral' }); }); return m; };
const porchDing = (L, a, b, k = .9, o = {}) => { strasse(L, { t: 'night' }); const p = PORCH; const c = put(ding, p.x, p.y, p.z, toDoorM + (o.ry ?? 0)); actuar(c, 0, [[0, { aLx: .06, aRx: .06, headZ: o.tilt ?? 0 }]], { T: L.T, breathe: false, weight: false }); if (a != null) creepTalk(c, L.T, a, b, k); else creepF(c, L.T, k); lp(0, p.x + 1.4, 10, p.z + 3, 70, 0xffb860, 18); return c; };
const hallMats = (L, o = {}) => { flur(L, { dark: o.dark }); const c = put(mats, DOORIN.x + (o.x ?? -1.4), 0, o.z ?? 13, o.ry ?? PI - .4); actuar(c, 0, [[0, { ...GEST.phone, ...(o.pose || {}) }]], { T: L.T, extra: shiver(L.T, o.shiver ?? .6) }); attach(PHONE, c.aR.hand, [0, -.6, .5], [-.3, 0, 0], .85); cara(c, L.T, o.f || { expr: 'scared' }); return c; };
// ---- 69 «„Wie heißt das Wort?“, habe ich gefragt.»: Mats, pegado a la puerta, la mano en el cerrojo, pregunta en voz baja
shot(106.31, 'S', null, L => { flur(L); const c = put(mats, DOORIN.x + .6, 0, 18.2, -.25); actuar(c, 0, [[0, { aRx: 1.5, aRz: .2, aRe: .7, aLx: 2.0, aLz: -.2, aLe: 2.3, lean: .1 }]], { T: L.T }); talk(c, L.T, 106.31, 107.4, 'worried');
  bubble(c, 'Wie heißt das Wort?', (L.lt - .1) / .2, 1.8); cm([DOORIN.x - 3.4, 7, 9, DOORIN.x + .6, 5.6, 18, 44], [DOORIN.x - 2.8, 6.8, 10.6, DOORIN.x + .6, 5.6, 18, 42], L.k); }, [[0, 'whisper', .5]]);
// ---- 70 «„Kuschelkeks.“»: POV de la mirilla: la Cosa lo dice, sin reírse
shot(108.54, 'I', null, L => { const c = porchDing(L, null, null); c.setFace({ eyes: 'normal', mouth: kitLips(L.T, spoken(108.5, 109.2)) || 'flat' }); peephole(L, 1, { look: hp(c).add(V(0, -.6, 0)), fov: 74 }); }, [[0, 'creepy_ting', .3]]);
// ---- 71 «Es war das richtige Wort.»: Mats suelta el aire, aliviado; ✓ verde
shot(109.15, 'C', null, L => { flur(L); const c = put(mats, DOORIN.x + .6, 0, 16.4, PI); actuar(c, L.lt, [[0, { aLx: .3, aRx: .3, lean: .05, headX: -.1 }], [.3, { aLx: .1, aRx: .1, lean: -.02, headX: .1 }, { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'relief', mouth: 'smile' });
  badge('check', '', W / 2, H * .2, (L.lt - .3) / .2, 1, 1.3); onFace(c, 6.4, -.2, .6, 42, L.k, 5.6); }, [[.2, 'sigh', .5], [.35, 'ding_soft', .6]]);
// ---- 72 «Meine Hand lag schon am Schloss.»: primer plano: la mano de Mats gira el cerrojo… despacio
shot(110.51, 'Z', null, L => { flur(L); const c = put(mats, DOORIN.x + 2.2, 0, 17.8, .1); actuar(c, 0, [[0, { aRx: 1.6, aRz: .1, aRe: .5, lean: .08 }]], { T: L.T }); cara(c, L.T, { expr: 'neutral' }); HA.front.thumb.rotation.z = PI / 2 - easeInOut(clamp(L.lt / 1.4)) * .7;
  const k = wpos(HA.front.thumb); cam([k.x - 1.8, k.y + .9, k.z - 3.4], [k.x - .3, k.y - .1, k.z], 40); }, [[.2, 'click_metal', .4], [.8, 'metal_creak', .4]]);
// ---- 73 «Aber Mama hat „Kuschelkeks“ noch nie gesagt,»: recuerdo cálido en la cocina: Mama lo dice muerta de risa; Mats e Ida se ríen
shot(112.02, 'B', null, L => { kuecheS(L); SEPIA = .3; const m = put(mamaB, KUX, 0, -8.4, 0); actuar(m, 0, [[0, { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.6, aRe: 1.6, lean: -.14 + Math.sin(L.T * 14) * .05, headX: -.15 }]], { T: L.T }); laughF(m, L.T); bubble(m, 'Kuschelkeks!', (L.lt - .4) / .2, 1.8);
  const c = sit(mats, KUX - 2.5, 2.8, -5.4, .25, L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, lean: -.1 }); laughF(c, L.T + .3); const i = sit(ida, KUX + 2.5, 2.8, -5.4, -.25, L, { aLx: 2, aRx: 2, aLe: 2.3, aRe: 2.3 }); laughF(i, L.T + .6);
  cm([KUX - 2, 9.6, 10, KUX, 5.6, -6.6, 48], [KUX + 1.2, 9.2, 8.4, KUX, 5.6, -6.6, 48], L.k); }, [[0, 'film_roll', .4], [.3, 'laugh_deep', .5], [.6, 'kids_laugh', .4]]);
// ---- 74 «ohne zu lachen.»: primer plano de Mama riéndose con la cabeza hacia atrás
shot(114.26, 'C', 'punch', L => { kuecheS(L); SEPIA = .3; const m = put(mamaB, KUX, 0, -8.4, 0); actuar(m, 0, [[0, { aLx: 1.0, aRx: 1.0, aLz: -.3, aRz: -.3, aLe: 1.8, aRe: 1.8, lean: -.2 + Math.sin(L.T * 16) * .05, headX: -.3 }]], { T: L.T }); laughF(m, L.T); onFace(m, 5.2, -.6, 0, 40, L.k, 4.4); }, [[0, 'laugh_deep', .7]]);
// ---- 75 «Kein einziges Mal, seit ich fünf bin.»: recuerdo: el cumpleaños de Mats con 5 años, la tarta con cinco velas; Mama le da un beso riéndose
shot(115.14, 'R', null, L => { kuecheS(L); SEPIA = .5; show(CAKE, KUX, 4.7, -4); CAKE.userData.flames.forEach(f => f.visible = true); const c = put(mats5, KUX - 1, 0, -7, .2); actuar(c, 0, [[0, 'cheer']], { T: L.T }); laughF(c, L.T);
  const m = put(mamaB, KUX + 2.6, 0, -8.2, -.5); actuar(m, 0, [[0, { lean: .2, aLx: 1.2, aLz: -.4, aLe: 1.2, headZ: .2 }]], { T: L.T }); laughF(m, L.T + .4); bigNum('5', (L.lt - .2) / .2, 'gold', .14, 1.1);
  cm([KUX + 1, 8, 6, KUX, 5, -6, 46], [KUX - 1, 7.6, 4.6, KUX, 5, -6, 46], L.k); }, [[0, 'party_horn', .5], [.4, 'kids_laugh', .4]]);
// ---- 76 «Diesmal sagte sie es ganz flach.»: POV de la mirilla: la cara de la Cosa, sin expresión, mirando fijo
shot(116.98, 'G', null, L => { const c = porchDing(L, null, null); c.setFace({ eyes: 'stare', mouth: 'flat' }); peephole(L, 1, { look: hp(c).add(V(0, .2, 0)), fov: lerp(68, 60, L.k) }); }, [[0, 'glitch', .5], [.2, 'hum_low', .4]]);
// ---- 77 «Als würde sie es von einem Schild ablesen.»: en el porche, la Cosa lee en un cartel «KUSCHELKEKS», moviendo los ojos de izquierda a derecha
shot(118.78, 'W', null, L => { const c = porchDing(L, null, null); actuar(c, 0, [[0, { aLx: 1.4, aRx: 1.4, aLe: .7, aRe: .7 }]], { T: L.T, breathe: false }); const h = hp(c); const sp = HMW(HM.doorX, HM.B + 7.2, HM.frontZ + .75); show(SIGN, sp.x, sp.y, sp.z, HM.rot);
  c.setFace({ eyes: Math.sin(L.T * 5) > 0 ? 'side_l' : 'side_r', mouth: kitLips(L.T, [[118.8, 120.6, 'x']]) ? 'o' : 'flat' }); cm([PORCH.x - 6, 9, PORCH.z + 5.6, PORCH.x + 1.6, 7, PORCH.z - .6, 44], [PORCH.x - 5, 8.6, PORCH.z + 4.6, PORCH.x + 1.6, 7, PORCH.z - .6, 42], L.k); sh(V(PORCH.x, 0, PORCH.z), 20); }, [[0, 'paper', .5], [.5, 'creepy_ting', .4]]);
// ---- 78 «Also habe ich die Hand vom Schloss genommen.»: Mats aparta la mano de golpe y retrocede despacio
shot(120.61, 'C', null, L => { flur(L); const b = easeOut(clamp(L.lt / .3)); const c = put(mats, DOORIN.x + .8, 0, 17.6 - easeInOut(clamp((L.lt - .3) / 1.2)) * 3, PI - .3); actuar(c, L.lt, [[0, { aRx: 1.4, aRe: .5 }], [.05, { aRx: .6, aRz: .4, aRe: 1.6, lean: -.15 }, { dur: .2 }]], { T: L.T, extra: shiver(L.T, .6) }); cara(c, L.T, { expr: 'scared', mouth: 'o' });
  HA.front.thumb.rotation.z = PI / 2; onBody(c, 12, .2, .1, 42, L.k, 10.5); }, [[0, 'whoosh', .4], [.3, 'wood_creak', .4]]);
// ---- 79 «Und Mama auf dem Handy angerufen.»: Mats saca el móvil y llama: «MAMA ♥» en la pantalla
shot(122.39, 'S', null, L => { const c = hallMats(L, { pose: { ...GEST.phone_look }, f: { expr: 'worried', eyes: 'down' } }); badge('phone', 'Mama ♥', W / 2, H * .3, (L.lt - .2) / .2, 1, .62); onBody(c, 11, .3, .14, 44, L.k, 9.6); }, [[.2, 'dial', .6], [.8, 'phone_ring', .3]]);
// ---- 80 «Sie ging beim ersten Klingeln ran.»: en la oficina, Mama coge el móvil al primer tono
shot(124.0, 'W', null, L => { const m = officeMama(L, null, null, { expr: 'happy', pose: L.lt < .4 ? { aRx: .9, aRe: 1.2 } : {} }); cm([BUX + 5, 8.4, 19, BUX + 1.2, 5.6, 7.4, 44], [BUX + 3.6, 8, 17.4, BUX + 1.2, 5.6, 7.4, 44], L.k); }, [[0, 'phone_ring', .7], [.4, 'click_metal', .3]]);
// ---- 81 «Im Hintergrund klapperten Tastaturen»: compañeros tecleando sin parar; pantallas azules
shot(125.46, 'S', null, L => { bueroS(L); [[BUX - 15, -3.6, 0], [BUX + 15, -3.6, 1], [BUX - 15, 14.4, 2], [BUX, 4.4, 3]].forEach(([x, z, i]) => { const c = sit(EXS[i], x, 2.9, z, PI, L, { aLx: 1.3, aRx: 1.3, aLe: 1.2, aRe: 1.2, aLz: Math.sin(L.T * 26 + i) * .12, aRz: Math.cos(L.T * 24 + i) * .12, headX: .2 }); cara(c, L.T + i, { expr: 'neutral', eyes: 'down' }); });
  cm([BUX - 20, 8.4, 4, BUX - 15, 5.4, -6, 44], [BUX - 19, 8, 2.4, BUX - 15, 5.4, -6, 42], L.k); }, [[0, 'clack', .6], [.6, 'clack', .5]]);
// ---- 82 «und ein Kopierer lief.»: la fotocopiadora escupe hojas; un compañero espera bostezando
shot(127.1, 'C', null, L => { bueroS(L); BU.paper.position.x = -3.2 - ((L.lt * 3) % 1) * 1.6; const c = put(EXS[4], BUX + 22, 0, -12.6, PI); actuar(c, 0, [[0, { aRx: 2.2, aRz: -.4, aRe: 2.3 }]], { T: L.T }); cara(c, L.T, { expr: 'tired', mouth: 'o' });
  cm([BUX + 10, 9, -2, BUX + 21, 5, -15, 46], [BUX + 11, 8.6, -3.4, BUX + 21, 5, -15, 44], L.k); }, [[0, 'machine_hum', .6], [.3, 'paper', .5]]);
// ---- 83 «„Hallo, Schatz. Ich bin noch im Büro.»: Mama al teléfono, sonriente
shot(128.21, 'R', null, L => { const m = officeMama(L, 128.21, 129.81, { expr: 'warm' }); onFace(m, 5.6, -.3, -.8, 40, L.k, 4.8); }, []);
// ---- 84 «Was ist los?“»: frunce el ceño
shot(129.81, 'C', 'punch', L => { const m = officeMama(L, 129.81, 130.5, { expr: 'worried', pose: { headZ: .25 } }); onFace(m, 4.6, -.3, .8, 40, L.k, 4.2); }, []);
// ---- 85 «Ich flüsterte: „Mama, du stehst vor der Tür.“»: Mats, agachado en la penumbra del pasillo, susurra tapándose la boca; Ida asoma detrás
shot(130.5, 'S', null, L => { const c = hallMats(L, { x: 3, z: 6, ry: PI - .3, pose: { crouch: .35, lean: .25, aLx: 2.2, aLz: -.2, aLe: 2.4 } }); talk(c, L.T, 131, 132.96, 'scared'); const i = put(ida, HAX - 6.2, 0, 5.4, PI - .4); actuar(i, 0, [[0, 'hug_self']], { T: L.T }); cara(i, L.T, { expr: 'worried' });
  bubble(c, 'Mama, du stehst vor der Tür.', (L.lt - .5) / .2, 1.4); onFace(c, 6.2, -.4, 0, 42, L.k, 5.2); }, [[0, 'whisper', .7]]);
// ---- 86 «Dann war es lange still.» (pantalla partida): arriba Mama, petrificada en la oficina; abajo Mats, inmóvil en el pasillo
shot(132.96, 'F', null, L => { const m = officeMama(L, null, null, { expr: 'shock' }); m.setFace({ eyes: 'wide', mouth: 'o' }); onFace(m, 6, -.3, 0, 40, L.k, 5.4); }, [[0, 'silence_tick', .5], [.5, 'heartbeat', .4]],
  L => { const c = hallMats(L, { x: -1, z: 10, ry: PI, f: { eyes: 'wide', mouth: 'flat', noBlink: true } }); onFace(c, 6, -.3, 0, 40, L.k, 5.4); });
// ---- 87 «Als Mama wieder sprach, war ihre Stimme ganz ruhig.» (zoom lento): Mama se levanta despacio y coge las llaves, con la cara serena
shot(134.19, 'Z', 'slow', L => { const m = officeMama(L, 134.19, 136.82, { expr: 'determined', pose: { aLx: 1.4, aLe: .4 } }); attach(KEYS, m.aL.hand, [0, -1, .4], [0, 0, 0], .8); onFace(m, 6.6, -.3, .4, 42, L.k, 4.6); }, []);
// ---- 88 «So ruhig wie damals, als Ida Fieber hatte.»: recuerdo: Ida en la cama con fiebre (39,5°), Mama le acaricia la frente con calma
shot(136.82, 'B', null, L => { zimmer(L, true); SEPIA = .4; const i = put(ida, KZX - 9, 2.6, -6, 0); i.root.rotation.x = -PI / 2 + .3; i.root.position.y = 4.4; actuar(i, 0, [[0, { aLx: .2, aRx: .2 }]], { T: L.T, breathe: true }); cara(i, L.T, { eyes: 'half', mouth: 'wavy', blush: 1 }); attach(THERMO, i.head, [.2, .4, .9], [0, 0, .5], 1);
  const m = sit(mamaB, KZX - 6, 3.7, -4.4, -1.1, L, { aRx: 1.5, aRz: -.3, aRe: .9 + Math.sin(L.T * 2) * .2, lean: .2, headX: .2 }); cara(m, L.T, { expr: 'warm', eyes: 'half' }); bigNum('39,5°', (L.lt - .3) / .2, 'red', .14, .9);
  orb(L.k, V(KZX - 8, 4.4, -5.4), null, [12, -.5, .35, 44], [10.5, -.3, .35, 44]); }, [[0, 'film_roll', .3], [.3, 'cough', .4]]);
// ---- 89 «Sie sagte:»: Mama, seria, se acerca el teléfono
shot(139.21, 'C', null, L => { const m = officeMama(L, null, null, { expr: 'determined' }); onFace(m, 5, -.3, -.6, 40, L.k, 4.6); }, []);
// ---- 90 «„Mats, wer ist an der Tür?“» (pantalla partida): arriba Mama lo pregunta; abajo Mats escucha, con los ojos muy abiertos
shot(139.91, 'S', null, L => { const m = officeMama(L, 139.91, 141.41, { expr: 'determined' }); onFace(m, 5.4, -.3, 0, 40, L.k, 5); }, [],
  L => { const c = hallMats(L, { x: -1, z: 10, ry: PI }); cara(c, L.T, { eyes: 'wide', mouth: 'flat' }); onFace(c, 5.4, -.3, 0, 40, L.k, 5); });
// ---- 91 «Und durch die Tür,»: la puerta de casa: Mats gira la cabeza despacio hacia ella
shot(141.41, 'W', null, L => { const c = hallMats(L, { x: 1.2, z: 9.6, ry: PI - easeInOut(clamp(L.lt / .8)) * 2.6 }); cara(c, L.T, { expr: 'scared' }); cm([DOORIN.x - 3, 7, -1, DOORIN.x + 1, 5.6, 16, 46], [DOORIN.x - 2.4, 7, 1.4, DOORIN.x + 1, 5.6, 16, 46], L.k); }, [[0, 'wood_creak', .5]]);
// ---- 92 «mit derselben Stimme,» (pantalla partida): arriba Mama, abajo la Cosa: las dos bocas a la vez
shot(142.63, 'C', null, L => { const m = officeMama(L, 139.91, 141.41, { expr: 'determined' }); talk(m, L.T, L.T - .2, L.T + .2, 'determined'); onFace(m, 5.2, -.3, 0, 40, L.k, 4.8); }, [[0, 'creepy_ting', .5]],
  L => { const c = porchDing(L, null, null, .9); creepF(c, L.T, Math.sin(L.T * 14) > 0 ? .75 : .95); peephole(L, 0, { look: hp(c).add(V(0, .2, 0)), fov: 46 }); });
// ---- 93 «einen Herzschlag später,»: primer plano de Mats; el latido aprieta la viñeta
shot(144.09, 'C', 'punch', L => { const c = hallMats(L, { x: 1.2, z: 9.6, ry: .2 }); cara(c, L.T, { eyes: 'terror', mouth: 'flat' }); const hb = Math.max(0, Math.sin(L.lt * 9)) ** 6; grade.uniforms.vig.value = .5 + hb * .5; TINT = `rgba(120,0,0,${(hb * .18).toFixed(3)})`; onFace(c, 4.6, -.3, 0, 40, L.k, 4.2); }, [[0, 'heartbeat', .9]]);
// ---- 94 «sagte das Ding auf unserer Veranda:» (zoom lento): desde la calle: la Cosa en el porche, demasiado quieta, la cabeza ladeada, bajo el farol
shot(145.41, 'Z', 'slow', L => { const c = porchDing(L, null, null, .9, { ry: PI, tilt: .25 * easeIn(L.k) }); moths(HMW(HM.doorX + 3.2, HM.B + 9.6, HM.frontZ + .8), L.T);
  cm([PORCH.x - 20, 6.4, PORCH.z, PORCH.x, 5.8, PORCH.z, 44], [PORCH.x - 11, 6.6, PORCH.z, PORCH.x, 6.2, PORCH.z, 40], L.k); sh(V(PORCH.x, 0, PORCH.z), 26); }, [[.2, 'crickets', .4], [.6, 'owl', .3]]);
// ---- 95 «„Mats, wer ist an der Tür?“»: POV de la mirilla: la Cosa lo repite, la sonrisa estirada
shot(147.38, 'G', null, L => { const c = porchDing(L, 147.38, 149.57, .95); peephole(L, 1, { look: hp(c).add(V(0, .2, 0)), fov: lerp(64, 56, L.k) }); }, [[0, 'glitch', .4]]);
// ---- 96 «Es hat nicht geraten, was Mama sagen würde.»: Mats retrocede hasta chocar con la pared y niega con la cabeza
shot(149.57, 'W', null, L => { const c = hallMats(L, { x: -5.4, z: 12 - easeOut(clamp(L.lt / .8)) * 2, ry: PI * .75, pose: { headY: Math.sin(L.T * 9) * .35, lean: -.1 } }); cara(c, L.T, { expr: 'scared', mouth: 'grimace' }); onFace(c, 6.6, -.4, 0, 42, L.k, 5.6); }, [[0, 'steps', .4], [.6, 'thud', .5]]);
// ---- 97 «Es hat sie nachgemacht, während sie sprach.» (pantalla partida): arriba Mama, abajo la Cosa, hablando a la vez
shot(152.03, 'S', null, L => { const m = officeMama(L, null, null, { expr: 'determined' }); talk(m, L.T, L.T - .2, L.T + .2, 'determined'); onFace(m, 5.6, -.3, 0, 40, L.k, 5); }, [[.3, 'creepy_ting', .4]],
  L => { const c = porchDing(L, null, null, .9); creepF(c, L.T, Math.sin(L.T * 14 - 2) > 0 ? .75 : .95); peephole(L, 0, { look: hp(c).add(V(0, .2, 0)), fov: 46 }); });
// ---- 98 «Wort für Wort.» (pantalla partida, más cerca)
shot(154.25, 'C', 'punch', L => { const m = officeMama(L, null, null, { expr: 'determined' }); talk(m, L.T, L.T - .2, L.T + .2, 'determined'); onFace(m, 4.2, -.4, 0, 38, L.k, 3.9); }, [],
  L => { const c = porchDing(L, null, null, 1); creepF(c, L.T, Math.sin(L.T * 14 - 2) > 0 ? .8 : 1); peephole(L, 0, { look: hp(c).add(V(0, .2, 0)), fov: 36 }); });
// ---- 99 «Wie ein Echo.»: Mats con el móvil en la oreja; anillos de eco que se expanden desde la puerta
shot(155.36, 'Z', null, L => { const c = hallMats(L, { x: .4, z: 11, ry: PI - .3 }); onFace(c, 6, -.3, .6, 42, L.k, 5.2); FX2D.push(x => { for (let k = 0; k < 3; k++) { const t = (L.lt * 1.2 + k / 3) % 1; x.strokeStyle = `rgba(255,255,255,${(.5 * (1 - t)).toFixed(3)})`; x.lineWidth = 8; x.beginPath(); x.arc(W / 2, H * .4, 120 + t * 520, 0, 7); x.stroke(); } }); }, [[0, 'echo', .6]]);
// ---- 100 «Zuerst durchs Handy,»: el móvil en la mano de Mats: «MAMA», llamada en curso
shot(156.34, 'C', null, L => { const c = hallMats(L, { x: .4, z: 11, ry: PI - .3, pose: GEST.phone_look }); badge('phone', 'Mama ♥', W / 2, H * .36, (L.lt - .05) / .15, 1, .7); BAD_[BAD_.length - 1].sub = '00:47'; onFace(c, 6.6, -.5, .2, 44, L.k, 6); }, [[0, 'vibrate', .4]]);
// ---- 101 «dann durch die Tür.»: la puerta azul, quieta, con la mirilla brillando; empuje lento
shot(157.44, 'C', null, L => { flur(L); HA.front.door.rotation.y = PI - Math.sin(L.T * 30) * .003; const p = PEEPW(); cam([p.x - .6, p.y - 1.4, p.z - lerp(9, 7, L.k)], [p.x, p.y - 2, p.z], 44); }, [[0, 'knock', .2]]);
// ---- 102 «„Mach nicht auf“, sagte Mama.»: Mama, ya con el abrigo, sale corriendo de la oficina con las llaves
shot(158.41, 'W', null, L => { bueroS(L); const m = walk(mama, L, BUX + 6, 4, -PI / 2 - .3, 7, 0, { run: true, face: false }); attach(KEYS, m.aL.hand, [0, -1, .4], [0, 0, 0], .8); attach(PHONE, m.aR.hand, [0, -.6, .5], [-.3, 0, 0], .85); actuar(m, 0, [[0, { ...runP(L.T, 0), ...GEST.phone }]], { T: L.T }); talk(m, L.T, 158.41, 159.2, 'determined');
  orbit(V(m.root.position.x, 5, m.root.position.z), 15, -PI / 2 + .1, .12, 46); }, [[0, 'run_cobble', .5], [.3, 'door_open', .4]]);
// ---- 103 «„Ich komme sofort nach Hause.“»: de noche, Mama corre hacia su Golf rojo y abre la puerta de un tirón
shot(159.59, 'S', null, L => { strasse(L, { t: 'night' }); show(GOLF, -2, 0, 110, PI / 2 + .1); GOLF.userData.door.rotation.y = -easeOut(clamp((L.lt - .9) / .3)) * 1.1; const m = walk(mama, L, -16, 112, PI / 2 + .1, 7, 0, { run: true, face: false }); m.root.position.x = Math.min(m.root.position.x, -6.4); talk(m, L.T, 159.59, 161.25, 'determined');
  orbit(V(-8, 4.6, 111), lerp(18, 15, L.k), -.4, .12, 46); sh(V(-6, 0, 110), 30); }, [[0, 'run_cobble', .6], [1.0, 'car_door', .6]]);
// ---- 104 «Durch die Tür:»: la puerta de casa, a oscuras; Mats se tapa la boca
shot(161.25, 'C', null, L => { const c = hallMats(L, { x: -1.6, z: 14, ry: 0, pose: { aLx: 2.2, aLz: -.2, aLe: 2.4 } }); cara(c, L.T, { eyes: 'terror', mouth: 'flat' }); cm([DOORIN.x - 1.6, 6.8, 6.2, DOORIN.x - 1.2, 5.6, 16, 44], [DOORIN.x - 1.6, 6.6, 7.6, DOORIN.x - 1.2, 5.6, 16, 42], L.k); }, [[0, 'heartbeat', .5]]);
// ---- 105 «„Ich komme sofort nach Hause.“» (zoom lento): la Cosa lo repite en el porche, con la cabeza dando sacudidas
shot(162.03, 'Z', 'slow', L => { const c = porchDing(L, 162.03, 163.97, 1, { ry: PI, tilt: Math.sin(L.T * 23) > .7 ? .3 : 0 }); onFace(c, 6.4, -.2, 0, 42, L.k, 4.2); }, [[.3, 'glitch', .3]]);

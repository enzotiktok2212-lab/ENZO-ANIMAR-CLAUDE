// ---------- a: gancho, la clase, «Niemand», mi hermano (0 – 35,41 s) ----------
const HOUSE = V(14.5, 0, 91.3);          // delante de la puerta de la casa familiar (mira a +x)
const DOGP = V(16.3, 0, 115.1);          // delante de la caseta (mira a ry = -.5)
const wag = (T) => { DOG.rotation.y += Math.sin(T * 14) * .08; DOG.position.y = Math.abs(Math.sin(T * 7)) * .15; };
const seatOf = i => V(KX - 11 + (i % 3) * 11, 0, -2 + Math.floor(i / 3) * 8 + 2.6);
const meSeat = (L, pose = {}, face = {}) => { const s = seatOf(1); put(me, s.x, sitY(me), s.z, PI); actuar(me, 0, [[0, seatPose({ aLx: .9, aRx: .9, aLe: 1.4, aRe: 1.4, aLz: -.2, aRz: -.2, ...pose })]], { T: L.T }); cara(me, L.T, face); return me; };

// 1 «In dieser Stadt heißt jeder» (zoom lento): el cartel ADRIANSFELDE – Einwohner: 3000 Adrians, la ciudad detrás
shot(0, 'C', 'slow', L => { town(L); const c = V(12, 6.1, 240);
  orb(L.k, c, null, [29, .25, .04, 42], [25, .25, .03, 42]); sh(c, 26);
  [[KIDS[10], -4.2], [KIDS[11], 4.2]].forEach(([p, dx], i) => { const r = .25, x = c.x + Math.cos(r) * dx + Math.sin(r) * 3, z = c.z - Math.sin(r) * dx + Math.cos(r) * 3; put(p, x, 0, z, r); actuar(p, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9 + i) * .35, aRe: .5 }]], { T: L.T }); cara(p, L.T + i, { expr: 'happy', mouth: 'open_smile' }); }); },
  [[0, 'birds', .5], [.4, 'ding_soft', .4]]);
// 2 «Adrian.»: la plaza llena; todos saludan con su placa «HALLO, ich heiße ADRIAN»
shot(1.48, 'W', 'punch', L => { town(L); const c = V(-6, 0, 12); put(EX[4], c.x, 0, c.z, 0); actuar(EX[4], 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .35, aRe: .5, aLx: 2.7, aLz: .4 + Math.cos(L.T * 9) * .35, aLe: .5 }]], { T: L.T }); grin(EX[4], L.T);
  crowdAt(L, c.x, c.z - 4, 14, 5, 13, 3, { mode: 'wave', from: 6, gap: 1.0 });
  orb(L.k, V(c.x, 3.6, c.z), null, [17, .1, .22, 44], [14, .05, .14, 44]); sh(c, 22); }, [[0, 'cheer', .45], [.2, 'crowd_run', .3]]);
// 3 «Meine Mama heißt Adrian.»: Mama en la puerta de casa, saluda y señala su placa
shot(2.26, 'S', null, L => { town(L); put(mama, HOUSE.x, 0, HOUSE.z, PI / 2); const pt = L.lt > .5;
  actuar(mama, L.lt, [[0, GEST.wave], [.55, { aRx: 1.2, aRz: -.6, aRe: 1.9, aLx: .3, headX: .15 }, { dur: .25 }]], { T: L.T }); cara(mama, L.T, { expr: 'happy', mouth: pt ? 'smile' : 'open_smile' });
  onBody(mama, 13, -.15, .12, 42, L.k, 11, .1); sh(HOUSE, 18); }, [[0, 'door_open', .4], [.4, 'pop', .4]]);
// 4 «Mein Papa heißt Adrian.»: Papa riega las flores de la fuente y saluda con la regadera
shot(3.52, 'F', null, L => { town(L); const p = V(-18, 0, -12); put(papa, p.x, 0, p.z, .2); actuar(papa, 0, [[0, { aRx: 2.6, aRz: .3 + Math.sin(L.T * 8) * .3, aRe: .4, aLx: 1.0, aLz: -.3, aLe: .6 }]], { T: L.T }); grin(papa, L.T);
  crowdAt(L, p.x, p.z - 6, 5, 6, 12, 9, { mode: 'idle', from: 2, list: EX });
  orb(L.k, V(p.x, 3.4, p.z), null, [14, .5, .1, 42], [12, .2, .1, 42]); sh(p, 20); }, [[0, 'water_bloop', .4], [.3, 'birds', .4]]);
// 5 «Meine Lehrerin ist Frau»: la profesora señala la pizarra: «Frau Adrian»
shot(4.67, 'S', null, L => { school(L); put(lehr, KX + 3.4, 0, -12, -.25); actuar(lehr, 0, [[0, { aLx: 2.4, aLz: -.5, aLe: .1, aRx: .4, aRz: -.3, aRe: 1.3, headY: .4, headX: -.1 }]], { T: L.T }); cara(lehr, L.T, { expr: 'smile', mouth: 'open_smile' });
  cm([KX + 1.4, 6.6, 4], [KX + 1.2, 6.6, 2.5], L.k); camera.lookAt(KX + 1.2, 7.0, -15); camera.fov = 48; sh(V(KX, 0, -10), 20); }, [[0, 'chalk', .5], [.4, 'classroom', .3]]);
// 6 «Adrian.»: primer plano de la profesora con su placa
shot(5.71, 'C', 'punch', L => { school(L); put(lehr, KX + 3, 0, -9, 0); actuar(lehr, 0, [[0, { aLx: 1.2, aLz: -.5, aLe: 1.7, aRx: .3, headZ: .1 }]], { T: L.T }); grin(lehr, L.T);
  onBody(lehr, 7.6, .1, .04, 40, L.k, 6.8); sh(V(KX, 0, -9), 14); }, [[0, 'pop', .5]]);
// 7 «Sogar unser Hund heißt Adrian.»: el perro mueve la cola delante de su caseta «ADRIAN»; mi hermano lo acaricia
shot(6.35, 'Z', null, L => { town(L); show(DOG, DOGP.x, 0, DOGP.z, -.5, .9); wag(L.T); const b = put(bru, DOGP.x - 3.4, 0, DOGP.z - .2, -.5 + .9); actuar(b, 0, [[0, { aRx: 1.4, aRz: -.4 + Math.sin(L.T * 6) * .2, aRe: .3, crouch: .25, lean: .2 }]], { T: L.T }); laughF(b, L.T);
  orb(L.k, V(DOGP.x - .6, 2.4, DOGP.z - 1.5), null, [15, -.5, .1, 42], [12.5, -.35, .08, 42]); sh(DOGP, 16); }, [[0, 'bark', .6], [.6, 'bark', .45]]);
// 8 «Wenn meine Lehrerin schaut,»: la profesora con la lista, mira por encima de las gafas
shot(8.09, 'F', null, L => { school(L); classKids(L, { expr: 'smile' }); put(lehr, KX, 0, -9.5, 0); actuar(lehr, 0, [[0, { aLx: .9, aRx: .9, aLz: -.25, aRz: -.25, aLe: 1.1, aRe: 1.1, headX: -.12 + Math.sin(L.T * 2) * .05, headY: Math.sin(L.T * 1.5) * .25 }]], { T: L.T }); cara(lehr, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' });
  cm([KX + 1.6, 5.9, -4.4], [KX + 1.2, 5.7, -4.9], L.k); camera.lookAt(KX, 4.1, -9.5); camera.fov = 40; sh(V(KX, 0, -9), 16); }, [[0, 'pages', .5], [.5, 'hmm', .4]]);
// 9 «wer in der Schule ist,»: la clase entera desde arriba: todos los niños con su placa ADRIAN
shot(9.07, 'S', null, L => { school(L); classKids(L, { expr: 'happy' }); meSeat(L, {}, { expr: 'neutral' }); put(lehr, KX - 6, 0, -10.5, .5); actuar(lehr, 0, [[0, GEST.hold]], { T: L.T }); cara(lehr, L.T, { expr: 'neutral' });
  cm([KX + 8, 13, -13.5], [KX + 5, 12.5, -13], L.k); camera.lookAt(KX - 1, 2.6, 5); camera.fov = 50; sh(V(KX, 0, 4), 22); }, [[0, 'classroom', .5], [.3, 'chair_roll', .35]]);
// 10 «braucht sie nur einen Namen.»: la lista: Adrian, Adrian, Adrian… (se va llenando)
shot(9.99, 'Z', null, L => { school(L); put(lehr, KX - 8, 0, -12.6, 0); actuar(lehr, 0, [[0, { aLx: 1.35, aLz: -.2, aLe: 1.0, aRx: 1.1, aRz: -.5, aRe: 1.5, headX: .3 }]], { T: L.T }); cara(lehr, L.T, { expr: 'smile', eyes: 'down' });
  show(ATT, KX - 8, 2.5, -11.3, 0, .3); ATT.rotation.x = -.15; ATT.userData.set(1 + Math.floor(clamp(L.k * 1.3) * 7), false);
  const pw = wpos(lehr.aR.hand); show(PEN, pw.x, pw.y + .2, pw.z + .35, 0, .7); PEN.rotation.z = .6;
  cm([KX - 8.1, 4.4, -3.8], [KX - 8.05, 4.2, -4.6], L.k); camera.lookAt(KX - 8, 3.0, -11.3); camera.fov = 40; sh(V(KX - 8, 0, -11), 12); }, [[0, 'pencil', .55], [.5, 'pencil', .45]]);
// 11 «Adrian? Und»: la profesora llama
shot(11.31, 'C', null, L => { school(L); put(lehr, KX - 1, 0, -9.5, .15); actuar(lehr, 0, [[0, { aLx: .9, aLz: -.25, aLe: 1.1, aRx: .5, aRz: .4, aRe: .8, headX: -.12, lean: -.05 }]], { T: L.T }); cara(lehr, L.T, { expr: 'happy', mouth: L.T < 11.62 ? 'o' : 'smile', eyes: 'up' });
  show(ATT, KX - .9, 2.2, -8.5, .15, .28); ATT.rotation.x = -.5; bubble(lehr, 'Adrian?', clamp(L.lt / .1), 1.6);
  onFace(lehr, 4.2, .2, .4, 40, L.k, 3.8); sh(V(KX, 0, -9), 14); }, [[0, 'pop', .4]]);
// 12 «die ganze Klasse ruft:»: todos los niños levantan la mano a la vez
shot(12.12, 'W', null, L => { school(L); classKids(L, { hands: L.t0 + .45, expr: 'happy' }); meSeat(L, {}, { expr: 'neutral', eyes: 'side_l' });
  cm([KX + 6, 8.5, -13], [KX + 3, 8, -12.5], L.k); camera.lookAt(KX - 1, 3.4, 5); camera.fov = 52; sh(V(KX, 0, 4), 22); }, [[0, 'chair_roll', .4], [.5, 'cloth', .5]]);
// 13 «Hier!»: plano bajo: manos arriba, todos gritan «HIER!»
shot(13.39, 'C', 'punch', L => { school(L); classKids(L, { hands: L.t0 - 1, shout: true }); meSeat(L, {}, { expr: 'neutral', eyes: 'down' });
  const k = KIDS[0]; bubble(k, 'HIER!', clamp(L.lt / .1), 1.8);
  cm([KX - 4, 6.2, -9.5], [KX - 3.2, 6, -8.8], L.k); camera.lookAt(KX - 6, 4.4, 4); camera.fov = 50; sh(V(KX, 0, 2), 20); }, [[0, 'shout_crowd', .6], [.1, 'kids_laugh', .3]]);
// 14 «Außer mir.» (zoom lento): yo en medio, el único con la mano abajo
shot(14.42, 'Z', 'slow', L => { school(L); classKids(L, { hands: L.t0 - 2, shout: false, expr: 'happy' }); const c = meSeat(L, { aLx: 1.1, aRx: 1.1, aLe: 1.7, aRe: 1.7, aLz: -.35, aRz: -.35, headX: .15 }, { expr: 'sad', mouth: 'frown' });
  const s = seatOf(1); orbit(V(s.x, 3.6, s.z), lerp(12, 8, easeIn(L.k)), PI + .1, .14, 40); sh(s, 16); }, [[0, 'sigh_kid', .5]]);
// 15 «Seit vier Jahren»: las listas de cuatro cursos en la pared, todas con «Müller – ABWESEND»
shot(15.39, 'F', null, L => { school(L); show(OLD, KX - 19.4, 10, 2, PI / 2); const c = put(me, KX - 14.5, 0, 9, -2.2); actuar(c, 0, [[0, { aRx: 1.6, aRz: -.1, aRe: .1, headY: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  cm([KX - 5, 9.4, 3.6], [KX - 6.5, 9.6, 3], L.k); camera.lookAt(KX - 19, 9.6, 2); camera.fov = 46; badge('gold', '4 JAHRE', W / 2, H * .16, clamp(L.lt / .15), 1, .9); sh(V(KX - 15, 0, 3), 18); }, [[0, 'pages', .5], [.4, 'pop', .4]]);
// 16 «Tag als abwesend eingetragen.»: la profesora rodea en rojo «Müller … ABWESEND»
shot(16.73, 'S', null, L => { school(L); put(lehr, KX + 6, 0, -12.4, -.25); actuar(lehr, 0, [[0, { aLx: 1.35, aLz: -.2, aLe: 1.0, aRx: 1.2, aRz: -.3, aRe: 1.4, headX: .35 }]], { T: L.T }); cara(lehr, L.T, { expr: 'neutral', eyes: 'down', mouth: 'flat' });
  show(ATT, KX + 5.7, 3.1, -11.4, -.25, .3); ATT.rotation.x = -.35; ATT.userData.set(8, L.k > .35);
  const pw = wpos(lehr.aR.hand); show(PEN, pw.x, pw.y + .3, pw.z + .2, 0, .7); PEN.rotation.z = -.5;
  cm([KX + 3.6, 5.6, -6.4], [KX + 4.2, 5.2, -7.1], L.k); camera.lookAt(KX + 5.6, 3.0, -11.4); camera.fov = 40; sh(V(KX + 6, 0, -11), 12); }, [[0, 'pencil', .5], [.4, 'pencil', .5], [.8, 'sad_tone', .35]]);
// 17 «Denn ich heiße Müller.»: yo en el patio, señalo mi placa escrita a mano: MÜLLER
shot(18.51, 'C', 'punch', L => { town(L); const p = V(-30, 0, -6); put(me, p.x, 0, p.z, .35); me.setTag('MÜLLER'); actuar(me, 0, [[0, { ...GEST.shrug, headZ: .14 }]], { T: L.T }); cara(me, L.T, { expr: 'smug', mouth: 'smirk' });
  crowdAt(L, p.x, p.z - 6, 4, 6, 12, 13, { mode: 'idle', list: KIDS, from: 3 });
  onBody(me, 8, .05, .06, 40, L.k, 7.2); sh(p, 16); }, [[0, 'thump', .4], [.2, 'tape', .4]]);
// 18 «Mama sagt, ich sah einfach»: Mama habla con mi foto de bebé en la mano (delante del pecho)
const photoFront = (c, fwd = 1.2, y = 2.0, side = 0) => { const a = c.root.rotation.y, p = c.root.position; show(PHOTO, p.x + Math.sin(a) * fwd + Math.cos(a) * side, y, p.z + Math.cos(a) * fwd - Math.sin(a) * side, a, .85); };
shot(19.53, 'W', null, L => { town(L); put(mama, HOUSE.x + 1, 0, HOUSE.z - 1, PI / 2 + .25); actuar(mama, 0, [[0, { aLx: .8, aLz: -.5, aLe: .7, aRx: .8, aRz: -.5, aRe: .7, headZ: .15 + Math.sin(L.T * 3) * .05 }]], { T: L.T }); talk(mama, L.T, 19.5, 21);
  photoFront(mama); put(me, HOUSE.x + 3.4, 0, HOUSE.z - 4.2, PI / 2 - .7); actuar(me, 0, [[0, GEST.cross]], { T: L.T }); cara(me, L.T, { expr: 'bored', eyes: 'half' });
  onBody(mama, 11, -.45, .08, 42, L.k, 10, -.35); sh(HOUSE, 16); }, [[0, 'door_creak', .35], [.4, 'hmm', .3]]);
// 19 «nicht aus wie ein Adrian.»: primer plano de la foto de bebé; Mama inclina la cabeza: «kein Adrian?»
shot(20.95, 'Z', null, L => { town(L); put(mama, HOUSE.x + 1, 0, HOUSE.z - 1, PI / 2 + .25); actuar(mama, 0, [[0, { aLx: .8, aLz: -.5, aLe: .7, aRx: .8, aRz: -.5, aRe: .7, headZ: .3 }]], { T: L.T }); cara(mama, L.T, { expr: 'confused', mouth: 'wavy' });
  photoFront(mama); const a = mama.root.rotation.y, h = hp(mama);
  cm([h.x + Math.sin(a) * 7.5, h.y - .6, h.z + Math.cos(a) * 7.5], [h.x + Math.sin(a) * 6.6, h.y - .6, h.z + Math.cos(a) * 6.6], L.k); camera.lookAt(h.x, h.y - .9, h.z); camera.fov = 40;
  badge('red', 'kein Adrian?', W / 2, H * .16, clamp((L.lt - .25) / .15), 1, .8); sh(HOUSE, 14); }, [[0, 'pop', .4], [.3, 'sad_tone', .3]]);
// 20 «Wenn jemand Adrian ruft,»: el panadero grita «ADRIAN!» delante de la Bäckerei
shot(21.93, 'R', null, L => { town(L); const p = V(-49, 0, 10.5); const b = EX[5]; put(b, p.x, 0, p.z, PI / 2 + .2); actuar(b, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .2, aRz: .2, aLe: 2.2, aRe: 2.2, lean: -.12, headX: -.2 }]], { T: L.T }); cara(b, L.T, { expr: 'shout', mouth: 'talk_wide' });
  bubble(b, 'ADRIAN!', clamp((L.lt - .2) / .1), 1.6);
  orb(L.k, V(p.x, 3.4, p.z), null, [11, PI / 2 + .55, .1, 42], [9.5, PI / 2 + .35, .08, 42]); sh(p, 16); }, [[0, 'city_amb', .4], [.25, 'shout_m', .5]]);
// 21 «dreht sich die ganze Stadt um.»: grúa: toda la plaza se gira a la vez
shot(23.32, 'C', null, L => { town(L); const c = V(-12, 0, 6); crowdAt(L, c.x, c.z, 22, 3, 16, 21, { mode: 'turn', turnAt: L.t0 + .2, full: true, jit: .25, expr: 'happy' });
  cm([c.x + 4, 22, c.z + 30], [c.x + 2, 17, c.z + 26], L.k); camera.lookAt(c.x, 2, c.z); camera.fov = 48; sh(c, 26); }, [[0, 'whoosh_soft', .4], [.2, 'crowd_run', .45]]);
// 22 «Ich bin der Einzige, der sich nicht umdreht.»: todos miran a cámara; yo paso de perfil, aburrido, con las manos en los bolsillos
shot(24.76, 'S', null, L => { town(L); const c = V(-12, 0, 8); walkTo(me, c.x + 2.2, c.z + 2, -PI / 2, 1.6, L, 0, 6); cara(me, L.T, { expr: 'bored', eyes: 'half' });
  crowdAt(L, c.x, c.z - 2, 14, 4.5, 13, 23, { mode: 'turn', turnAt: L.t0 - 2, jit: .2, expr: 'happy', gap: .9 });
  orb(L.k, V(c.x, 3.2, c.z + 2), null, [13, .08, .1, 42], [11.5, .02, .08, 42]); sh(c, 20); }, [[0, 'steps', .45], [.8, 'sigh_kid', .35]]);
// 23 «Und weil ich kein Adrian bin,»: patio del colegio: los niños me miran de arriba abajo
shot(26.54, 'W', null, L => { town(L); const p = V(-24, 0, -40); put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, { aLx: .4, aRx: .4, aLz: -.4, aRz: -.4, aLe: 1.6, aRe: 1.6, headX: .2 }]], { T: L.T }); cara(me, L.T, { expr: 'sad' });
  crowdAt(L, p.x, p.z, 7, 4.5, 8, 31, { mode: 'idle', list: KIDS, from: 0, expr: 'sus', face: V(p.x, 3, p.z) });
  orb(L.k, V(p.x, 2.8, p.z), null, [12, -.25, .14, 42], [10.5, -.1, .12, 42]); sh(p, 18); }, [[0, 'kids_laugh', .35], [.5, 'murmur', .35]]);
// 24 «sagen die Kinder, ich bin niemand.»: tres niños me señalan y se ríen («NIEMAND!»)
shot(28.08, 'F', null, L => { town(L); const p = V(-24, 0, -44); [KIDS[2], KIDS[5], KIDS[7]].forEach((k, i) => { const x = p.x + (i - 1) * 3.4, z = p.z - Math.abs(i - 1) * 1.2; crowdGuy(k, x, z, L, i, { mode: i === 1 ? 'point' : 'laugh', face: V(p.x, 0, p.z + 12) }); });
  bubble(KIDS[5], 'NIEMAND!', clamp((L.lt - .5) / .1), 1.6);
  orb(L.k, V(p.x, 2.4, p.z), null, [10.5, .05, .06, 44], [9, 0, .04, 44]); sh(p, 14); }, [[0, 'kids_laugh', .55], [.6, 'laugh_m', .3]]);
// 25 «Deshalb nennen sie mich so:»: los niños levantan la pancarta NIEMAND detrás de mí; yo hundido
shot(29.62, 'S', null, L => { town(L); const p = V(-10, 0, -48); show(NSIGN, p.x, 1.6, p.z - 3, 0, .9); [KIDS[8], KIDS[9]].forEach((k, i) => { put(k, p.x + (i ? 3.06 : -3.06), 0, p.z - 3.6, 0); actuar(k, 0, [[0, { aLx: 2.5, aRx: 2.5, aLz: i ? .1 : -.1, aRz: i ? -.1 : .1, aLe: .4, aRe: .4 }]], { T: L.T }); laughF(k, L.T + i); });
  put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, GEST.slump || { lean: .2, headX: .4, aLx: .1, aRx: .1 }]], { T: L.T }); cara(me, L.T, { expr: 'sad', eyes: 'down' });
  orb(L.k, V(p.x, 4.8, p.z - 1.5), null, [16, -.1, .06, 44], [14, 0, .05, 44]); sh(p, 16); }, [[0, 'paper', .5], [.4, 'kids_laugh', .35]]);
// 26 «Niemand.»: primer plano: lágrima, la pancarta detrás
shot(30.70, 'C', 'punch', L => { town(L); const p = V(-10, 0, -48); show(NSIGN, p.x, 1.6, p.z - 3, 0, .9); [KIDS[8], KIDS[9]].forEach((k, i) => { put(k, p.x + (i ? 3.06 : -3.06), 0, p.z - 3.6, 0); actuar(k, 0, [[0, { aLx: 2.5, aRx: 2.5, aLe: .4, aRe: .4 }]], { T: L.T }); laughF(k, L.T + i); });
  put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, { headX: .1, aLx: .1, aRx: .1 }]], { T: L.T }); cara(me, L.T, { expr: 'cry', eyes: 'cry', mouth: 'frown' }); tears(me, L.T);
  cm([p.x + .4, 4.4, p.z + 7.6], [p.x + .3, 4.4, p.z + 6.8], L.k); camera.lookAt(p.x, 4.6, p.z - 2); camera.fov = 42; sh(p, 12); }, [[0, 'sad_tone', .5]]);
// 27 «der Müller zu mir sagt,»: mi hermano corre hacia mí gritando «Müller!»
shot(31.88, 'Z', null, L => { town(L); const b = put(bru, 22, Math.abs(Math.sin(L.T * 14)) * .2, 76 + L.lt * 4.2, 0); actuar(b, 0, [[0, { ...walkP(L.T, 0, 14), aRx: 2.6, aRz: .4, aRe: .3 }]], { T: L.T }); laughF(b, L.T);
  bubble(b, 'Müller!', clamp(L.lt / .1), 1.6); const bp = b.root.position;
  orbit(V(bp.x, 2.2, bp.z), 9.5, .25, .06, 42); sh(bp, 14); }, [[0, 'steps_run', .5], [.2, 'kids_laugh', .3]]);
// 28 «ist mein kleiner Bruder.»: nos chocamos la mano en la calle
shot(33.06, 'W', null, L => { town(L); const p = V(22, 0, 84); put(me, p.x - 1.5, 0, p.z, PI / 2 - .55); put(bru, p.x + 1.5, 0, p.z, -PI / 2 + .55); const hf = L.lt > .35;
  actuar(me, 0, [[0, { aRx: hf ? 2.5 : 2.1, aRz: hf ? -.5 : -.2, aRe: .2 }]], { T: L.T }); actuar(bru, 0, [[0, { aLx: hf ? 2.7 : 2.3, aLz: hf ? -.4 : -.2, aLe: .2 }]], { T: L.T }); grin(me, L.T); laughF(bru, L.T);
  if (hf) confetti(V(p.x, -2, p.z), L.t0 + .35, L.T, 24, .5);
  orb(L.k, V(p.x, 2.6, p.z), null, [9.5, .05, .08, 42], [8.5, 0, .06, 42]); sh(p, 14); }, [[.35, 'slap', .55], [.4, 'kids_laugh', .3]]);
// 29 «Er heißt natürlich Adrian.»: mi hermano señala su placa ADRIAN; yo detrás, cara de póquer
shot(34.06, 'C', 'punch', L => { town(L); const p = V(22, 0, 84); put(bru, p.x + .8, 0, p.z + 1.5, -.15); actuar(bru, 0, [[0, { aLx: .9, aLz: -.6, aLe: 1.9, aRx: .3, headZ: -.1 }]], { T: L.T }); grin(bru, L.T);
  put(me, p.x - 1.6, 0, p.z - 1.6, .3); actuar(me, 0, [[0, GEST.cross]], { T: L.T }); cara(me, L.T, { expr: 'bored', eyes: 'half', mouth: 'flat' });
  orb(L.k, V(p.x - .2, 2.7, p.z), null, [10, .05, .08, 40], [8.8, .02, .06, 40]); sh(p, 12); }, [[0, 'pop', .45], [.5, 'sigh_kid', .3]]);

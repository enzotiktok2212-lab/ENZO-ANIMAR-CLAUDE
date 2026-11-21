// ===== Planos 90-104 (148 s – final): el maletín volcado, todo vuelve, se va en la nieve, medianoche, el giro final =====
// 90 · «Ich riss ihm den Koffer aus der Hand»: salto y se lo arranco
shot(147.98, 'C', null, L => { const { m, c, s } = ourDoor({ cz: 3.0, cs: -.6, sd: 4.8, ss: -1.4 }); mama.root.visible = true;
  const grab = L.lt > .45; if (grab) { attach(KOF.g, c.aR.hand, [0, -.2, .4], [0, PI / 2, 0], .55); }
  saltar(c, L.lt, .05, { h: 1.8, dur: .45, base: [c.root.position.x, 0, c.root.position.z], extra: { aRx: 2.6, aRe: .2 } }); cara(c, L.T, { expr: 'determined', mouth: 'grimace' });
  actuar(s, L.lt, [[0, {}], [.45, { ...GEST.recoil }, { dur: .3 }]], { T: L.T }); cara(s, L.T, { expr: 'shock' }); cnt(s, 0, 1, { sc: .55 }); applyPose(m, GEST.hands_face); cara(m, L.T, { expr: 'shock' });
  camH(HOME, [HOME.dx + 12, 6.0, HOME.F + 8], [HOME.dx - .6, 4.4, HOME.F + 3], 40); }, [[.05, 'jump', .5], [.45, 'tug', .7], [.55, 'briefcase', .6]]);
// 91 · «und kippte ihn aus.»: lo pongo boca abajo: se abre y sale una explosión de luz
shot(149.36, 'F', null, L => { street(); const p = LH(HOME, HOME.dx - .6, 0, HOME.F + 3.4); const flip = easeOut(clamp(L.lt / .3));
  const k = kofAt(p.x, 3.2, p.z, HOME.ry, 1.2); KOF.g.rotation.z = flip * PI; k.open(clamp((L.lt - .3) * 4));
  if (L.lt > .35) { sparks(V(p.x, 2.0, p.z), .35, L.T, 30, 2.2); orbs(V(p.x, 2, p.z), (i, r) => V(p.x + (r() - .5) * 40, 10 + r() * 10, p.z - 10 - r() * 60), .35, L.T, 14, .9); }
  grade.uniforms.flash.value = Math.max(0, 1 - Math.abs(L.lt - .45) * 4) * .7; warmAt(V(p.x, 4, p.z), 80); WARM.color.setHex(0xc890ff);
  camH(HOME, [HOME.dx - .6, 2.0, HOME.F + 11], [HOME.dx - .6, 3.6, HOME.F + 3.4], 44); sh(p, 15); }, [[.1, 'whoosh_up', .4], [.35, 'explosion', .6], [.4, 'magic_hit', .7], [.6, 'sparkle', .6]]);
// 92 · «Und die ganze Straße entlang kam alles zurück.»: vista aérea: luces que vuelan a las casas y las ventanas apagadas se encienden
shot(150.61, 'Z', null, L => { street(); WARM.color.setHex(0xffb868); const order = [GA.L[3], GA.R[4], GA.L[6], ...DARKH]; order.forEach((Hh, i) => houseDark(Hh, 1 - clamp((L.lt - .4 - i * .22) * 3)));
  orbs(V(-10, 3, 6), (i, r) => { const Hh = order[i % order.length]; return LH(Hh, 0, 8, Hh.F); }, .0, L.T, 14, 1.4);
  cm([0, 48, 26, 0, 0, -50, 50], [0, 42, 14, 0, 0, -60, 48], L.k); sh(V(0, 0, -40), 90); }, [[.05, 'magic_hit', .5], [.6, 'switch', .5], [1.0, 'switch', .5], [1.4, 'switch', .5], [1.8, 'ding_reveal', .5]]);
// 93 · «Bruno landete Herrn Kowalski direkt in den Armen.»: Bruno cae del cielo a sus brazos; ¡alegría!
shot(153.40, 'S', null, L => { street(); const k = putH(kow, KOWH, KOWH.dx, KOWH.F + 2.6, 0, 0); actuar(k, L.lt, [[0, { aLx: 1.6, aRx: 1.6, aLz: .3, aRz: .3, aLe: .2, aRe: .2, headX: -.35 }], [.6, { aLx: 1.3, aRx: 1.3, aLz: -.3, aRz: -.3, aLe: 1.4, aRe: 1.4, headX: .15 }, { dur: .3 }]], { T: L.T });
  cara(k, L.T, { expr: L.lt < .6 ? 'gasp' : 'joy', eyes: L.lt < .6 ? 'wide' : 'happy', mouth: L.lt < .6 ? 'o' : 'laugh' }); const h = hp(k); const f = clamp(L.lt / .6);
  const d = dogAt(BR, h.x + 1.1, lerp(h.y + 9, h.y - 2.8, easeIn(f)), h.z, KOWH.ry, 1); d.pose(L.T, { wag: 26, tongue: true, headX: -.2 }); if (f >= 1) confetti(h, 154.0, L.T, 40);
  camH(KOWH, [KOWH.dx - 1.0, 4.6, KOWH.F + 11.6], [KOWH.dx, 5.0, KOWH.F + 2.6], 44); warmAt(h.clone().add(V(2, 2, 0)), 30); sh(h, 18); }, [[.1, 'whoosh_down', .4], [.6, 'thump', .5], [.7, 'bark', .7], [1.0, 'cheer', .45], [1.6, 'bark', .5]]);
// 94 · «Dann die Geige vom Bäcker.»: el panadero toca su violín delante de la panadería
shot(155.88, 'W', null, L => { street(); const Hh = BAKH; Hh.door.rotation.y = 1.4; const c = putH(bk, Hh, Hh.dx, Hh.F + 2.2, 0, 0);
  applyPose(c, { aLx: 1.9, aLz: -.3, aLe: 1.7, aRx: 1.4, aRz: -.6, aRe: 1.4 + Math.sin(L.T * 9) * .35, headZ: .3, headX: .1 }); cara(c, L.T, { expr: 'relief', eyes: 'closed', mouth: 'smile' });
  attach(GEIGE, c.aL.hand, [0, -.3, .8], [-.5, 1.2, .3], .8);
  onFace(c, 9.0, .2, 1.8, 46, L.k, 8.0); warmAt(hp(c).add(V(0, 2, 3)), 35); sh(LH(Hh, Hh.dx, 0, Hh.F + 2), 18); }, [[.05, 'strings', .6], [.8, 'strings', .5]]);
// 95 · «Dann eine ganze Familie, die schon vor meiner Geburt verschwunden war.»: aparecen delante de su casa, que se vuelve a encender
shot(157.45, 'S', null, L => { street(); const Hh = FAMH; houseDark(Hh, 1 - clamp((L.lt - .3) * 2)); const X = [-2.8, -.9, 1.0, 2.8];
  FA.forEach((c, i) => { const k = clamp((L.lt - .2 - i * .18) * 2.5); putH(c, Hh, Hh.dx + X[i] - .6, Hh.F + 3.2, 0, 0); c.root.scale.setScalar((c.spec.scale || 1) * Math.max(.01, spring(k))); actuar(c, L.lt, [[0, {}], [1.6, GEST.cheer, { dur: .4 }]], { T: L.T + i }); cara(c, L.T + i, { expr: L.lt < 1.6 ? 'gasp' : 'joy', eyes: L.lt < 1.6 ? 'wide' : 'happy' }); if (k > 0 && k < .6) sparks(hp(c), L.lt, L.T, 8, .5); });
  camH(Hh, [Hh.dx - .6, 4.2, Hh.F + 19], [Hh.dx - .6, 3.0, Hh.F + 3.2], 44); warmAt(LH(Hh, Hh.dx, 5, Hh.F + 4), 30); sh(LH(Hh, Hh.dx, 0, Hh.F + 3), 18); }, [[.2, 'magic_hit', .5], [.4, 'sparkle', .5], [1.3, 'aah', .4], [2.4, 'cheer', .45]]);
// 96 · «Der Sammler drehte sich um und ging in den Schnee.»: se da la vuelta y se marcha, sin maletín, encogido
shot(160.83, 'W', null, L => { street(1.3); const r = caminar(sam, L.lt, { x: -1.5, z: 0, ry: PI, speed: 1.6, T: L.T, stride: 1.1, extra: { headX: .35, lean: .1 } }); cara(sam, L.T, { expr: 'sad', eyes: 'down' }); KOF.g.visible = false; cnt(sam, 0, 1, { sc: .6 });
  cm([1.4, 5.4, r.z + 12, -1.5, 4.4, r.z - 4, 46], [1.4, 5.6, r.z + 13, -1.5, 4.4, r.z - 4, 46], L.k); sh(V(-1, 0, r.z), 25); }, [[.05, 'steps_snow', .5], [.8, 'steps_snow', .45], [1.6, 'wind', .5]]);
// 97 · «Seitdem hat ihn niemand mehr gesehen.»: una figura diminuta que se pierde en la ventisca
shot(163.26, 'C', null, L => { street(1.6); scene.fog.density = .004 + L.k * .006; const r = caminar(sam, L.lt + 3, { x: -1.5, z: -40, ry: PI, speed: 1.6, T: L.T, stride: 1.1, extra: { headX: .35 } }); sam.root.visible = L.k < .85;
  cm([0, 4.2, -14, -1, 4, -60, 40], [0, 4.0, -16, -1, 4, -60, 40], L.k); sh(V(0, 0, -40), 30); }, [[.05, 'wind', .7], [1.2, 'bell_far', .45]]);
// 98 · «Um Mitternacht»: la torre marca las 00:00; fuegos artificiales
shot(165.15, 'F', null, L => { street(); clockAt(0, 0); FWON = Object.assign(V(0, 0, -340), { spread: 160, h: 60 }); badge('tag', '00:00', W / 2, H * .12, L.lt * 3);
  cm([0, 52, -276, 0, 61.6, -330, 46], [0, 53, -279, 0, 61.6, -330, 44], L.k); sh(V(0, 0, -300), 60); }, [[.02, 'bell_big', .8], [.4, 'firework', .7]]);
// 99 · «leuchtete über jedem Kopf wieder eine Zehn.»: en la calle, todos miran arriba y su contador vuelve a 10
shot(166.23, 'R', null, L => { street(); FWON = Object.assign(V(0, 0, -120), { spread: 140, h: 60 });
  const P = [[LE[1], -5.4, -60], [KI[0], -2, -58], [LE[4], 2.2, -59], [LE[7], 5.6, -61], [bk, -7.6, -66], [kow, 7.6, -66], [LE[5], -3.4, -67], [FA[0], 3.6, -68]];
  P.forEach(([c, x, z], i) => { put(c, x, 0, z, 0); actuar(c, L.lt, [[0, { headX: -.4 }], [.4 + i * .1, GEST.cheer, { dur: .3 }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'joy', eyes: 'happy', mouth: 'laugh' }); const t = .3 + i * .12; cnt(c, L.lt > t ? 10 : 0, 1, { sc: .5, pop: L.lt - t }); });
  if (L.lt > .3) dogAt(BR, 9.4, 0, -63, -.4, 1).pose(L.T, { hop: 1, wag: 26 });
  cm([0, 3.8, -45, 0, 5, -64, 50], [0, 4.4, -47, 0, 5.4, -64, 50], L.k); sh(V(0, 0, -62), 30); }, [[.3, 'pling', .5], [.6, 'pling', .5], [.9, 'pling', .5], [1.1, 'cheer', .5], [1.5, 'firework', .6]]);
// 100 · «Mama drückte mich ganz fest,»: el abrazo, en el salón
shot(168.17, 'S', null, L => { use('WZ'); inside(.8, 40); const m = put(mama, WX - .3, 0, -.4, .25), c = put(ich, WX + 1.6, 0, 1.0, -.15);
  const k = easeOut(clamp(L.lt * 2)); applyPose(m, { aLx: 1.2 * k, aRx: 1.2 * k, aLz: -.55 * k, aRz: -.55 * k, aLe: .6 * k, aRe: .6 * k, lean: .3 * k, crouch: .2 * k, headX: .1, headZ: .25 * k }); applyPose(c, { aLx: .9 * k, aRx: .9 * k, aLz: -.3 * k, aRz: -.3 * k, aLe: 1.2, aRe: 1.2, headZ: -.15 * k });
  cara(m, L.T, { expr: 'relief', eyes: 'closed', mouth: 'smile' }); cara(c, L.T, { expr: 'happy', eyes: 'happy' }); cnt(m, 10, 1, { sc: .6 });
  cm([WX + .8, 4.2, 10.4, WX + .6, 3.6, 0, 46], [WX + .8, 4.1, 9.4, WX + .6, 3.6, 0, 44], L.k); sh(V(WX, 0, 0), 20); }, [[.1, 'hug', .6], [.6, 'aah', .35]]);
// 101 · «und Krümel fing an zu bellen.»: Krümel, con su gorrito, ladra y salta
shot(169.57, 'C', null, L => { use('WZ'); inside(.8, 40); const d = dogAt(KR, WX + 4, 0, 3, -.5, 1); d.hat.visible = true; d.pose(L.T, { bark: 1, hop: 1, wag: 26 });
  const p = V(WX + 4, 2.2, 3); cam([p.x - 2.6, 3.2, p.z + 6.2], [p.x, 2.2, p.z], 44); sh(p, 15); }, [[.05, 'bark', .7], [.5, 'bark', .7], [1.0, 'bark', .6], [1.4, 'bark', .5]]);
// 102 · «„Sag mal, hast du eigentlich jemals gelogen?“»: mamá pregunta, sonriendo; su contador ya está en 10
shot(171.24, 'W', null, L => { use('WZ'); inside(.8, 40); const m = put(mama, WX + 1, 0, -1.2, .1); actuar(m, L.lt, [[0, { crouch: .25, lean: .15, headZ: .15, aLx: .5, aLe: .9 }]], { T: L.T }); talk(m, L.T, 171.2, 173.6, 'smile', { eyes: 'happy' }); cnt(m, 10, 1, { sc: .7 });
  onFace(m, 6.0, -.3, 1.4, 42, L.k, 5.2); sh(V(WX, 0, 0), 20); }, [[.1, 'hmm', .35]]);
// 103 · «„Nein.“»: lo digo... y mi contador baja de 10 a 9 (NEIN.)
shot(173.66, 'C', null, L => { use('WZ'); inside(.8, 40); const c = put(ich, WX + 1, 0, 1.4, PI + .25); actuar(c, L.lt, [[0, { headX: -.25 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: L.lt < .4 ? 'talk' : 'smile' });
  cntDrop(c, L.lt, 10, [.3], { sc: .9, dy: 1.6 }); badge('red', 'NEIN.', W / 2, H * .085, (L.lt - .05) * 3, 1, .9); onFace(c, 5.0, .2, -.8, 42, L.k, 4.6); sh(V(WX, 0, 0), 20); }, [[.3, 'tick_down', .7]]);
// 104 · «Meine erste Lüge des Jahres.»: guiño a cámara; el 9 sobre mi cabeza
shot(174.73, 'Z', null, L => { use('WZ'); inside(.8, 40); const c = put(ich, WX + 1, 0, 1.4, PI + .25); actuar(c, L.lt, [[0, { headX: -.2, headZ: -.12 }]], { T: L.T }); cara(c, L.T, { expr: 'wink', eyes: L.lt > .5 ? 'wink' : 'happy', mouth: 'smirk' });
  cnt(c, 9, 1, { sc: .9, dy: 1.6 }); onFace(c, 4.8, .2, .4, 42, L.k, 3.8); sh(V(WX, 0, 0), 20); }, [[.5, 'sparkle', .5], [.9, 'ding_soft', .4]]);
COVERS.push({ i: 67, k: .7, cam: () => {}, l2: '…UND ÜBER SEINEM KOPF STAND EINE ZEHN' });

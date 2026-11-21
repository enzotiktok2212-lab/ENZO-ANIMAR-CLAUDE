// ---------- d: la noche siguiente: silencio, HUSS en cada ventana, todos entrenan y yo soy el único invitado de Herr Blubb (49,59 s – fin) ----------
// 46 «In der nächsten Nacht lief ich durch die Stadt»: camino por la calle oscura, sin fiesta
shot(49.59, 'W', null, L => { street(); windows('dark', L.T); const r = caminar(ich, L.lt, { x: 1.2, z: -6, ry: 0, speed: 3.4, accel: .2, T: L.T }); cara(ich, L.T, { expr: 'neutral' });
  cam([r.x + 1.6, 4.0, r.z + 13], [r.x, 3.0, r.z - 1], 46); sh(V(r.x, 0, r.z), 30); }, [[0, 'swipe', .4], [.1, 'steps', .5], [.8, 'crickets', .4]]);
// 47 «und etwas stimmte nicht» (zoom lento): me paro y miro a los lados, desconfiado
shot(51.63, 'Z', 'slow', L => { street(); windows('dark', L.T); const me = put(ich, 1.2, 0, 1, -.1); actuar(me, L.lt, [[0, 'idle'], [.3, { headY: .7 }, { dur: .35 }], [.9, { headY: -.7 }, { dur: .35 }]], { T: L.T }); cara(me, L.T, { expr: 'sus', eyes: 'squint', mouth: 'wavy' });
  orb(L.k, V(1.2, 2.8, 1), null, [12.5, .12, .08, 44], [10, .08, .06, 42]); sh(V(1, 0, 1), 30); }, [[0, 'zoom_in', .3], [.4, 'owl', .3], [1.0, 'wind', .3]]);
// 48 «Keine Musik»: el jardín de la piscina vacío; los flotadores van a la deriva y el altavoz está apagado
shot(53.11, 'F', null, L => { use('GT'); night(40); const px = GX - 16, pz = 10; [0, 1, 2].forEach(i => { show(FLOATS[i], px - 2 + i * 2 + Math.sin(L.T * .6 + i) * .4, 1.5, pz - 1 + i * 1.1 + Math.cos(L.T * .5 + i) * .3); FLOATS[i].rotation.set(PI / 2, 0, 0); });
  orb(L.k, V(px, 1.6, pz), null, [14, PI - .4, .55, 44], [13, PI - .3, .55, 44]); sh(V(px, 0, pz), 30); }, [[0, 'flash', .3], [.2, 'crickets', .5], [.5, 'drip', .4]]);
// 49 «Keine Partylichter»: la pancarta GROSSES FEST y los banderines a oscuras; un globo desinflado cae
shot(54.01, 'S', null, L => { street(); windows('dark', L.T); OR.FEST.visible = true; DARK = .15;
  
  cam([2, 7.2, -18 + L.k * 2], [0, 10, -40], 46); sh(V(0, 0, -36), 30); }, [[0, 'whoosh_soft', .3], [.4, 'sad_tone', .4]]);
// 50 «Nichts»: mi cara, sorprendido
shot(55.30, 'C', 'punch', L => { street(); windows('dark', L.T); const me = put(ich, 1.2, 0, 1, .2); actuar(me, L.lt, [[0, 'shock']], { T: L.T }); cara(me, L.T, { expr: 'gasp', eyes: 'wide', mouth: 'o' });
  onFace(me, 7.6, -.5, .4, 38, L.k, 7); sh(V(1, 0, 1), 30); }, [[0, 'impact_soft', .5]]);
// 51 «Dann hörte ich es»: me llevo la mano a la oreja
shot(55.74, 'W', null, L => { street(); windows('warm', L.T); const me = put(ich, 1.2, 0, 1, .2); actuar(me, L.lt, [[0, 'idle'], [.1, 'listen', { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'confused', eyes: 'side_l', mouth: 'o' });
  orb(L.k, V(1.2, 3.0, 1), null, [11, .35, .1, 44], [10, .3, .1, 44]); sh(V(1, 0, 1), 30); }, [[0, 'swipe', .3], [.3, 'hmm', .3]]);
// 52 «aus jedem Fenster» (zoom lento): las ventanas de la casa se encienden una tras otra
shot(56.75, 'Z', 'slow', L => { street(); windows('sil', L.T); WIN.forEach((ps, i) => ps.forEach((m, j) => { m.visible = L.lt > (i * .7 + j * .23) % 1.2; }));
  cam([-5, 5.6, 48 - L.k * 2], [-18, 6.4, 36], 46); sh(V(-20, 0, 36), 30); }, [[0, 'zoom_in', .3], [.2, 'click_set', .4], [.6, 'click_set', .4], [1.0, 'click_set', .4]]);
// 53 HUSS: en la ventana, la silueta de alguien haciendo toques
shot(58.08, 'W', null, L => { street(); windows('sil', L.T); const w = wpos(WIN[0][2]); cam([w.x + 7.5, w.y - .8, w.z + 1.2 + L.k], [w.x, w.y - .2, w.z], 40); sh(V(-18, 0, 36), 30); }, [[0, 'swipe', .3]]);
// 54 HUSS: otra casa, todas las ventanas igual
shot(58.55, 'S', null, L => { street(); windows('sil', L.T); const w = wpos(WIN[1][0]); cam([w.x - 7.5, w.y + .4, w.z - 1.2 - L.k], [w.x, w.y, w.z], 40); sh(V(18, 0, 36), 30); }, [[0, 'swipe', .3]]);
// 55 HUSS: dron sobre la calle: el pueblo entero con las ventanas encendidas
shot(59.00, 'F', null, L => { street(); windows('sil', L.T); const k = easeOut(L.k); cam([0, 30 - k * 4, 46], [0, 4, -30], 50); sh(V(0, 0, -20), 60); }, [[0, 'flash', .3]]);
// 56 «Jonas übte Gitarre»: Jonas en su cuarto toca la guitarra eléctrica a tope
shot(59.505, 'W', null, L => { use('ZI'); inside(1.0, 60); const j = put(jonas, ZX - 2, 0, 1, .2); applyPose(j, { aLx: 1.2, aLz: -.4, aLe: 1.5, aRx: .9 + Math.sin(L.T * 22) * .15, aRz: -.4, aRe: 1.6, headX: .25 + Math.sin(L.T * 9) * .15, lean: .08 + Math.sin(L.T * 9) * .05, crouch: .1, lLx: .2 }); cara(j, L.T, { expr: 'determined', eyes: 'closed', mouth: 'grimace' });
  attach(GUIT, j.spine, [-.1, .9, 1.0], [0, 0, .9], .9); notes(hp(j).add(V(1.5, 1, 0)), L.T);
  orb(L.k, V(ZX - 2, 3.2, 1), null, [12, .3, .1, 44], [11, .2, .08, 44]); sh(V(ZX, 0, 0), 30); }, [[0, 'swipe', .3], [.05, 'guitar', .7], [.7, 'guitar', .6]]);
// 57 «Gerda boxte»: Gerda con guantes golpea el saco del garaje
shot(60.84, 'R', null, L => { use('GA'); inside(1.0, 50); const bx = RX + 1.5, bz = -6; show(BAG, bx, 9.6, bz); const hits = [.12, .38, .62, .86]; let sw = 0; hits.forEach(t => { const g = Math.exp(-Math.pow((L.lt - t - .08) / .1, 2)); sw = Math.max(sw, g); }); BAG.rotation.x = -sw * .18;
  const g = put(gerda, bx + 3.5, 0, bz, -PI / 2); GLV.forEach(x => x.visible = true); const ph = Math.sin(L.lt * PI / .25); applyPose(g, { aLx: 1.5 + Math.max(0, ph) * .2, aLe: Math.max(0, -ph) * 1.6 + .2, aRx: 1.5 + Math.max(0, -ph) * .2, aRe: Math.max(0, ph) * 1.6 + .2, aLz: -.2, aRz: -.2, twist: ph * .25, crouch: .2, lLx: .3, lRx: -.2, lean: .12 }); cara(g, L.T, { expr: 'angry', eyes: 'angry', mouth: 'grimace' }); sweat(g, L.T, 1);
  orb(L.k, V(bx + 1.8, 3.4, bz), null, [14, -.5, .12, 44], [13, -.4, .1, 44]); sh(V(bx, 0, bz), 30); }, [[0, 'whirl', .3], [.12, 'fist', .6], [.38, 'fist', .6], [.62, 'fist', .6], [.86, 'fist', .5]]);
// 58 «Und meine Oma machte Yoga»: la Oma en la postura del árbol sobre la esterilla, muy concentrada
shot(61.82, 'Z', null, L => { use('OS'); inside(1.0, 60); show(MAT, OX - 1, 0, 9.5, 0); const o = put(oma, OX - 1, .12, 9.5, 0); hat(o); const b = Math.sin(L.T * 2) * .03;
  applyPose(o, { aLx: 3.0, aRx: 3.0, aLz: -.25, aRz: -.25, aLe: .2, aRe: .2, lLx: .3, lLk: 2.2, sx: b, headX: -.05 }); o.lL.hp.rotation.z = -1.1; cara(o, L.T, { expr: 'relief', eyes: 'closed', mouth: 'smile' });
  orb(L.k, V(OX - 1, 2.8, 9.5), null, [12, -.25, .1, 44], [11, -.15, .08, 44]); sh(V(OX, 0, 9), 30); }, [[0, 'zoom_in', .3], [.2, 'breath', .5], [.8, 'chime', .4]]);
// 59 «Jetzt geht hier keiner mehr auf Partys»: alguien clava el cartel PARTY ABGESAGT delante de la casa de la fiesta
shot(63.42, 'W', null, L => { street(); windows('sil', L.T); show(ABG, -14.5, 0, 34, PI / 2); const c = put(K[5], -13.2, 0, 38.4, PI / 2 + .7); actuar(c, L.lt, [[0, 'idle'], [.2, 'point_l', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  orb(L.k, V(-14.0, 4.4, 35.6), null, [19, PI / 2 + .25, .08, 46], [17.5, PI / 2 + .15, .08, 46]); sh(V(-14, 0, 35), 30); }, [[0, 'swipe', .3], [.2, 'stamp', .6], [.6, 'stamp', .5]]);
// 60 «Die ganze Stadt trainiert»: la calle llena de gente corriendo y haciendo dominadas
shot(65.31, 'S', null, L => { street(); windows('sil', L.T); [K[0], XT[0], K[3], XT[3], K[6], XT[5], K[2]].forEach((c, i) => { caminar(c, L.lt, { x: -5 + (i % 4) * 3.4, z: -6 - Math.floor(i / 4) * 6 - (i % 2) * 2, ry: 0, speed: 6, run: true, accel: .05, T: L.T + i }); cara(c, L.T, { expr: 'determined' }); sweat(c, L.T, 0); });
  const pu = OR.BARS[2]; const bp = wpos(pu); const g = put(gerda, bp.x, 0, bp.z, PI / 2); const up = (Math.sin(L.T * 5) + 1) / 2; applyPose(g, { aLx: 3.05 - up * .45, aRx: 3.05 - up * .45, aLz: .2 + up * .5, aRz: .2 + up * .5, aLe: up * 2, aRe: up * 2, lLk: .8, lRk: .5 }); g.root.position.y = 7.4 - lerp(6.25, 4.6, up) * .92; cara(g, L.T, { expr: 'determined' });
  cam([2, 5.6, 14 - L.k * 2], [0, 3, -8], 48); sh(V(0, 0, -6), 30); }, [[0, 'whoosh_soft', .3], [.05, 'crowd_run', .5], [.6, 'strain', .4]]);
// 61 «Außer mir»: yo con gorro de fiesta y matasuegras
shot(66.83, 'C', 'punch', L => { street(); windows('sil', L.T); const me = put(ich, 1, 0, 2, 0); hat(me); actuar(me, L.lt, [[0, 'cheer']], { T: L.T }); grin(me, L.T); onFace(me, 8.6, -.6, .5, 40, L.k, 7.8); confetti(hp(me), L.t0 + .1, L.T, 40, .6); sh(V(1, 0, 2), 30); }, [[0, 'impact', .4], [.1, 'party_horn', .7]]);
// 62 «Jetzt bin ich der Einzige, der feiert»: bailo solo en el salón vacío bajo la bola de discoteca
shot(67.58, 'W', null, L => { use('SA'); inside(.9, 45); SA.LI.intensity = 90; SA.LC.forEach((l, i) => l.intensity = 70 + Math.sin(L.T * 7 + i * 1.6) * 50); SA.DB.rotation.y = L.T * .8; SA.FB.userData.fish.userData.swim(L.T);
  const me = put(ich, AX, 0, 4, .15); hat(me); dance(me, L.T, 0); grin(me, L.T); confRain(V(AX, 0, 3), L.T, 40, 16, 10, 14);
  orb(L.k, V(AX, 3.6, 3), null, [19, .05, .2, 48], [16, -.05, .18, 48]); sh(V(AX, 0, 2), 30); }, [[0, 'swipe', .3], [.2, 'party_horn', .4], [.8, 'clap', .4]]);
// 63 «Denn ich war der einzige Gast»: la mesa larga, yo solo al lado de la pecera, sillas vacías
shot(69.47, 'F', null, L => { use('SA'); inside(1.0, 50); SA.LC.forEach((l, i) => l.intensity = 50); const f = SA.FB.userData.fish; f.userData.swim(L.T); f.userData.face(true); SA.FB.userData.bubbles(L.T);
  const me = put(ich, AX - .6, 0, -2.6, -.15); hat(me); actuar(me, L.lt, [[0, 'idle'], [.1, { aLx: 1.6, aLe: 1.2, aLz: .2 }, { dur: .3 }]], { T: L.T }); grin(me, L.T);
  orb(L.k, V(AX, 4.4, -4), null, [19, .35, .18, 48], [17, .28, .16, 48]); sh(V(AX, 0, -5), 30); }, [[0, 'flash', .3], [.3, 'water_bloop', .4], [.8, 'party_horn', .4]]);
// 64 «auf Herrn Blubbs Geburtstag»: soplo las velas junto a Herr Blubb, que lleva su gorrito
shot(70.84, 'C', 'punch', L => { use('SA'); inside(1.0, 50); const f = SA.FB.userData.fish; f.userData.swim(L.T); f.userData.face(true); f.rotation.y = -.5; SA.FB.userData.bubbles(L.T); SA.CK.userData.FL.forEach(fl => fl.visible = L.lt < .7);
  const me = put(ich, AX - 8.2, 0, -4.6, .6); hat(me); applyPose(me, { lean: .2, headY: .6, aLz: .3, aRz: .3, aLx: .6, aRx: .6 }); cara(me, L.T, { eyes: 'closed', mouth: L.lt > .4 ? 'o' : 'smile' });
  const p = wpos(SA.CK); cam([p.x - 3.8, p.y + 1.2, p.z + 12], [p.x - 3.8, p.y + .4, p.z], 44); sh(p, 20); }, [[0, 'impact_soft', .4], [.45, 'blow', .6], [.8, 'clap', .4]]);
// 65 «Es war alles, was er sich je gewünscht hat» (zoom lento): Herr Blubb feliz, con corazones; yo abrazo la pecera
shot(72.34, 'Z', 'slow', L => { use('SA'); inside(1.0, 50); const f = SA.FB.userData.fish; f.userData.swim(L.T * 1.5); f.userData.face(true); f.rotation.y = Math.sin(L.T) * .25; SA.FB.userData.bubbles(L.T); const p = wpos(SA.FB);
  
  hearts(p.clone().add(V(0, 3.4, 0)), L.T); cam([p.x + 1.8, p.y + 2.2, p.z + 13 - L.k * 2], [p.x + 1.6, p.y + 1.2, p.z], 42); sh(p, 20); }, [[0, 'zoom_in', .3], [.3, 'sparkle', .5], [1.0, 'water_bloop', .4]]);
// 66 HUSS: toques en la fiesta; Herr Blubb mira desde la pecera
shot(74.66, 'W', null, L => { use('SA'); inside(.9, 45); SA.LC.forEach((l, i) => l.intensity = 70 + Math.sin(L.T * 7 + i * 1.6) * 50); SA.DB.rotation.y = L.T * .8; const f = SA.FB.userData.fish; f.userData.swim(L.T); f.userData.face(true);
  const ts = hussIn(74.6, 76); const me = put(ich, AX + 1, 0, 3, -.15); hat(me); const b = trick(me, BALL, L.T, ts, ['up', 'knee', 'rainbow', 'up'], { end: true, tail: .9 }); grin(me, L.T); confRain(V(AX, 0, 2), L.T, 40, 14, 10, 14);
  orb(L.k, V(AX + 1, 2.4, 3), null, [14, -.1, .12, 48], [12.5, -.05, .1, 48]); sh(V(AX, 0, 0), 30); }, [[0, 'swipe', .3], [.6, 'cheer', .3]]);

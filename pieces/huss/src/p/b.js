// ---------- b: Jonas, Gerda y la Oma de fiesta; yo entreno día tras día (16,15 – 28,02 s) ----------
const disco = (L, fill = 45) => { use('SA'); inside(.9, fill); SA.LI.intensity = 90; SA.LC.forEach((l, i) => l.intensity = 70 + Math.sin(L.T * 7 + i * 1.6) * 50); SA.DB.rotation.y = L.T * .8; SA.FB.userData.fish.userData.swim(L.T); };
// 14 «Mein bester Freund Jonas»: Jonas en la pista de baile del salón, cartel con su nombre
shot(16.15, 'W', null, L => { disco(L); const j = put(jonas, AX, 0, 5, 0); hat(j); dance(j, L.T, 0); talk(j, L.T, 99, 99, 'happy', { eyes: 'happy', mouth: 'open_smile' });
  [K[2], XT[1], K[5]].forEach((c, i) => { put(c, AX - 5 + i * 5, 0, 1 - (i % 2) * 1.5, (i - 1) * -.3); hat(c); dance(c, L.T, i * 2); grin(c, L.T); });
  orb(L.k, V(AX, 3.2, 4.4), null, [14, .12, .1, 44], [12, .05, .08, 44]); badge3('tag', 'JONAS', hp(j).add(V(0, 3.4, 0)), (L.lt - .2) * 3); sh(V(AX, 0, 4), 30); }, [[0, 'swipe', .5], [.25, 'pop', .5], [.6, 'party_horn', .4]]);
// 15 «geht auf jede Party»: Jonas salta del escenario sobre el público en la calle de la fiesta
shot(17.17, 'R', null, L => { street(); OR.FEST.visible = true; windows('party', L.T); party([K[0], K[3], XT[0], K[6], XT[3], K[7]], L.T, V(0, 0, -14), 4.0, 0);
  const j = put(jonas, 0, 0, -6, 0); hat(j); const sl = saltar(j, L.lt, .1, { h: 3.4, dur: .7, base: [0, 0, -6], dz: -3 }); applyPose(j, { aLx: 2.8, aRx: 2.8, aLz: .7, aRz: .7, lLk: .8, lRk: .3, lLx: .4 }); grin(j, L.T);
  confRain(V(0, 0, -9), L.T, 40, 14, 10, 14); orb(L.k, V(0, 4.8, -8), null, [19, -.2, .02, 48], [17, -.12, .02, 48]); sh(V(0, 0, -10), 30); }, [[0, 'whirl', .4], [.15, 'jump', .5], [.4, 'cheer', .5], [.9, 'land', .4]]);
// 16 «Meine Nachbarin Gerda»: Gerda sale por la puerta de su casa con gorro de fiesta, lista para salir
shot(18.53, 'Z', 'punch', L => { street(); windows('party', L.T); const g = caminar(gerda, L.lt, { x: 16, z: 4, ry: -PI / 2, speed: 2.6, accel: .2, T: L.T }); hat(gerda); grin(gerda, L.T);
  orb(L.k, V(14.6, 3.4, 4), null, [13, -PI / 2 + .15, .1, 44], [12, -PI / 2 + .1, .08, 44]); badge3('tag', 'GERDA', hp(gerda).add(V(0, 3.3, 0)), (L.lt - .15) * 3); sh(V(15, 0, 4), 30); }, [[0, 'zoom_in', .5], [.05, 'door_open', .5], [.2, 'steps', .4], [.3, 'pop', .4]]);
// 17 «geht auf jede Party»: Gerda baila bajo la bola de discoteca
shot(19.53, 'F', null, L => { disco(L); const g = put(gerda, AX + 1, 0, 4, -.2); hat(g); dance(g, L.T, 1, { aRx: 2.9 + Math.sin(L.T * 9) * .2, aRz: .2 }); cara(g, L.T, { eyes: 'happy', mouth: 'laugh' });
  [XT[2], K[4]].forEach((c, i) => { put(c, AX - 4 + i * 9, 0, 1.4, i ? -.5 : .5); hat(c); dance(c, L.T, i * 2.5); grin(c, L.T); });
  orb(L.k, V(AX + .6, 3.6, 3.6), null, [13, -.3, .16, 46], [12, -.38, .14, 46]); sh(V(AX, 0, 4), 30); }, [[0, 'flash', .4], [.2, 'cheer', .3], [.6, 'clap', .4]]);
// 18 «Sogar meine Oma geht hin» (zoom lento): la Oma se marca un baile en el centro y todos la jalean
shot(20.66, 'W', 'slow', L => { disco(L); const o = put(oma, AX, 0, 5.5, 0); hat(o); dance(o, L.T * 1.3, 0, { crouch: .25 + Math.abs(Math.sin(L.T * 11)) * .15, aLx: 2.0, aRx: 2.0 }); cara(o, L.T, { eyes: 'happy', mouth: 'open_smile' });
  [K[1], XT[0], K[6], XT[4]].forEach((c, i) => { put(c, AX - 5.5 + (i % 2) * 11, 0, 1.6 - (i > 1 ? 3 : 0), (i % 2 ? -.5 : .5)); hat(c); actuar(c, L.lt, [[0, 'cheer']], { T: L.T + i }); grin(c, L.T); });
  confRain(V(AX, 0, 4), L.T, 50, 14, 10, 14); orb(L.k, V(AX, 3.0, 5.2), null, [14, .02, .12, 44], [12.5, .0, .1, 44]); sh(V(AX, 0, 4), 30); }, [[0, 'swipe', .4], [.2, 'cheer', .4], [.7, 'kids_laugh', .3]]);
// 19 «jeden Dienstag»: la Oma enseña el calendario con el martes marcado: PARTY!
shot(22.14, 'C', 'punch', L => { use('OS'); inside(1.0, 60); const o = put(oma, OX - 2, 0, 4, .25); hat(o); actuar(o, L.lt, [[0, 'hold']], { T: L.T }); attach(CAL, o.aR.hand, [-1.1, -.9, .6], [-PI / 2 + .1, 0, 0], .75); CAL.rotation.set(0, 0, 0); CAL.position.set(-1.2, -.5, 1.1); applyPose(o, { aLx: 1.5, aRx: 1.5, aLz: -.1, aRz: -.1, aLe: .5, aRe: .5, headX: -.05 });
  const w = loc(o, -3.0, 3.4, .4); CAL.parent.remove(CAL); scene.add(CAL); show(CAL, w.x, w.y, w.z, .5, .7); applyPose(o, { aLx: 1.4, aLz: .5, aLe: .4, aRz: .1, aRe: .3 }); talk(o, L.T, 22.14, 23.01, 'happy');
  onFace(o, 13, -1.4, -1.6, 44, L.k, 12); sh(V(OX, 0, 4), 30); }, [[0, 'impact_soft', .5], [.15, 'paper', .5], [.4, 'laugh_old', .4]]);
// 20 «Aber ich nicht»: yo solo en el Bolzplatz de noche; al fondo, fuegos artificiales de la fiesta
shot(23.01, 'I', null, L => { bolz(); const me = put(ich, BX, 0, 3, PI - .15); holdBall(me, L.T); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' }); fireworks(V(BX, 0, -90), L.T, 2, 14);
  orb(L.k, V(BX, 2.8, 3), null, [11, PI + .55, .12, 44], [10, PI + .45, .1, 44]); sh(V(BX, 0, 3), 30); }, [[0, 'iris_pop', .5], [.2, 'firework', .3], [.4, 'wind', .3]]);
// 21 HUSS: toques bajo el foco, primer plano desde abajo
shot(23.92, 'W', null, L => { bolz(); const ts = hussIn(23.9, 25.0); const me = put(ich, BX, 0, 2, .2); const b = trick(me, BALL, L.T, ts, ['up', 'knee', 'up', 'knee', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); 
  orb(L.k, V(BX, 2.1, 2), null, [11.5, .3, .05, 46], [10.5, .5, .05, 46]); sh(V(BX, 0, 2), 30); }, [[0, 'swipe', .4]]);
// 22 HUSS: conducción entre los conos, travelling lateral
shot(24.40, 'S', null, L => { bolz(); const ts = hussIn(24.3, 25.0); const r = dribble(ich, BALL, L.lt, L.T, { x: BX, z: 12, ry: PI, speed: 10.5, ts, weave: 1.1 }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  cam([BX + 9, 2.8, r.z - 2], [BX, 1.7, r.z - .5], 48); sh(V(BX, 0, r.z), 30); }, [[0, 'whoosh_soft', .4], [.1, 'steps_run', .5]]);
// 23 «Tag für Tag»: de día, el sol en lo alto, sigo corriendo con el balón y el sudor me cae
shot(25.265, 'Z', null, L => { bolz(false); const me = put(ich, BX - 1, 0, 0, .3); const b = juggle(me, BALL, L.T, [25.3, 25.6, 25.9, 26.15], { h: 2.2 }); cara(me, L.T, { expr: 'determined', eyes: 'squint', mouth: 'grimace' }); sweat(me, L.T, 2);
  orb(L.k, V(BX - 1, 2.0, 0), null, [12, .55, .15, 46], [11, .7, .13, 46]); sh(V(BX, 0, 0), 30); }, [[0, 'zoom_in', .4], [.2, 'birds', .3], [.5, 'strain', .4]]);
// 24 HUSS: de día, toques mirando desde arriba
shot(26.33, 'W', null, L => { bolz(false); const ts = hussIn(26.3, 27.0); const me = put(ich, BX + 1, 0, 1, -.4); const b = trick(me, BALL, L.T, ts, ['rainbow', 'up', 'knee', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' }); sweat(me, L.T, 1);
  orb(L.k, V(BX + 1, 2.5, 1), null, [14, -.55, .12, 46], [13, -.4, .1, 46]); sh(V(BX, 0, 1), 30); }, [[0, 'swipe', .4]]);
// 25 HUSS: de noche otra vez, regateo hacia la portería
shot(26.99, 'F', null, L => { bolz(); const ts = hussIn(26.95, 27.5); const r = dribble(ich, BALL, L.lt, L.T, { x: BX - 2, z: 8, ry: PI + .15, speed: 11, ts, weave: .8 }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  cam([BX - 6.5, 2.6, r.z - 9], [r.x, 1.6, r.z], 48); sh(V(BX, 0, r.z), 30); }, [[0, 'flash', .3], [.1, 'steps_run', .5]]);
// 26 HUSS: tiro desde el borde del área y la red de la portería pequeña se hincha
shot(27.45, 'W', 'punch', L => { bolz(); const kt = 27.70; const me = put(ich, BX - .3, 0, 2, PI); applyPose(me, kickPose(clamp((L.T - (kt - .15)) / .3))); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  if (L.T < kt) { const w = loc(me, .5, .55 / .84, 1.4); show(BALL, w.x, .55, w.z); } else { const a = loc(me, .5, 1.0, 1.4).toArray(); const p = shotBall(BALL, a, [BX + 1.6, 2.4, -15.4], .8, clamp((L.T - kt) / .2), L.T); BZ.GO.userData.bulge(clamp((L.T - kt - .18) / .1)); }
  orb(L.k, V(BX - .3, 2.0, 1), null, [12, PI - .6, .12, 46], [11, PI - .7, .1, 46]); sh(V(BX, 0, -4), 30); }, [[0, 'swipe', .3], [.45, 'trash_hit', .5]]);

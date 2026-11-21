// Benno en la garra derecha del monstruo, pataleando
const BENNO = (L, mad = 1) => { const pm = palm(MON, true); const b = put(benno, pm.x, pm.y - 4.6, pm.z - .4, PI * .1); applyPose(b, { aLx: 1.6 + Math.sin(L.T * 9) * .5, aLz: .6, aRx: 2.2 + Math.sin(L.T * 8 + 1) * .5, aRz: .5, lLx: Math.sin(L.T * 11) * .7 * mad, lRx: -Math.sin(L.T * 11) * .7 * mad, lLk: .5, lRk: .5, headX: -.2 }); torch(1, b, 0); return b; };
const GRAB = { ...MPOSE.grab };
const US = (L, e1 = 'scared', e2 = 'shock') => { const c = put(ich, -1.6, 0, 43, PI + .1), p = put(papa, -5.6, 0, 43.5, PI - .1); ich.props.vest.visible = true; cara(c, L.T, { expr: e1 }); cara(p, L.T, { expr: e2 }); return [c, p]; };
// 70 «Nur stand es jetzt nicht mehr in der Mitte.» — zoom lento al centro de la plaza: las grietas… y ahí ya no hay nada; los haces apuntan al vacío
shot(122.32, 'S', 'slow', L => { plaza(L); storm(L); mon(GRAB, 0, MNEW); MON.root.visible = false; SPOTS.forEach(s => { s.intensity = 30; s.target.position.set(0, 2, 0); }); CARRING(L, 20, 46, 0, 1);
  const c = put(WA[0], -6, 0, 6, PI * .2); actuar(c, L.lt, [[0, { aRx: 1.3, aRe: .1, headY: Math.sin(L.T * 3) * .6 }]], { T: L.T }); torch(1, c); cara(c, L.T, { expr: 'scared' });
  cm([10, 14, 20, 0, 0, -2, 50], [7, 10, 14, 0, 0, -2, 46], L.k, easeIn); badge('red', 'LEER', W / 2, H * .2, (L.lt - 1) * 3, 1, .9); sh(V(0, 0, 0), 30); }, [[0, 'rain', .6], [.5, 'heartbeat', .7]]);
// 71 «Es stand keine zwei Meter vor uns.» — revelación: por detrás de papá y de mí, el monstruo inclinado justo encima de nosotros — «2 METER»
shot(124.45, 'Z', null, L => { plaza(L); storm(L); mon(GRAB, 0, MNEW); CARRING(L, 20, 46, 0, 1); const [c, p] = US(L, 'scared', 'shock'); actuar(c, L.lt, [[0, { headX: -.7, ...shiver(L.T) }]], { T: L.T }); actuar(p, L.lt, [[0, { headX: -.7, aLx: .5, aLz: .5, aLe: .6 }]], { T: L.T }); BENNO(L);
  cm([-2, 4, 58, -1, 22, 30, 62], [-2, 3.4, 55, -1, 24, 30, 60], L.k, easeOut); badge('num', '2 METER', W / 2, H * .15, (L.T - 125.2) * 3, 1, 1.2); sh(V(0, 0, 36), 40); }, [[0, 'impact', .8], [.1, 'braam_short', .6], [.8, 'gasp', .5]]);
// 72 «Und in seiner Hand zappelte Benno, einer der Wachleute.» — zoom lento que sube por el brazo hasta la garra: Benno patalea dentro
shot(127.02, 'S', 'slow', L => { plaza(L); storm(L); mon(GRAB, 0, MNEW); const b = BENNO(L, 1.2); cara(b, L.T, { expr: 'scared', mouth: 'o' }); const pm = palm(MON, true);
  cm([pm.x + 12, pm.y - 14, pm.z + 24, pm.x, pm.y - 6, pm.z, 50], [pm.x + 8, pm.y - 6, pm.z + 16, pm.x, pm.y - 3.5, pm.z, 44], L.k, easeInOut); badge3('tag', 'BENNO', hp(b).add(V(0, 3.2, 0)), (L.T - 128.3) * 3); sh(pm, 30); }, [[0, 'rain', .5], [.4, 'metal_creak', .6], [1.3, 'scream_girl', .3]]);
// 73 «Er lebte noch.» — primer plano de Benno: asustado, respirando, todavía con la linterna en la mano
shot(129.84, 'C', null, L => { plaza(L); storm(L); mon(GRAB, 0, MNEW); const b = BENNO(L, .5); cara(b, L.T, { expr: 'scared', eyes: 'wide', mouth: Math.sin(L.T * 8) > 0 ? 'o' : 'flat' }); sweat(b, L.T); onFace(b, 7, .2, 1.4, 40, L.k); sh(hp(b), 20); }, [[0, 'breath', .7], [.5, 'heartbeat', .6]]);
// 74 «„Papa, wir müssen ihn da rausholen!"» — le grito a papá, desesperado
shot(130.82, 'W', null, L => { plaza(L); storm(L); mon(GRAB, 0, MNEW); const [c, p] = US(L); c.root.rotation.y = -PI / 2 - .5; actuar(c, L.lt, [[0, { aLx: .9, aLz: .3, aLe: .8, aRx: 1.6, aRe: .3, lean: .1 }]], { T: L.T }); talk(c, L.T, 130.8, 132.6, 'shout');
  bubble(c, 'Wir müssen ihn retten!', L.lt * 3); onFace(c, 10.5, .4, -1, 44, L.k, 9); sh(V(-3, 0, 43), 20); }, [[0, 'shout_m', .5], [.6, 'rain', .4]]);
// 75 «Aber Papa hielt mich am Arm fest:» — papá me agarra del brazo cuando voy a echar a correr
shot(132.71, 'S', null, L => { plaza(L); storm(L); mon(GRAB, 0, MNEW); const [c, p] = US(L, 'determined', 'angry'); c.root.rotation.y = PI * .8; c.root.position.x = -2.6; actuar(c, L.lt, [[0, { lean: .25, lLx: .5, lRx: -.4, aRx: .6, aLx: -.4 }]], { T: L.T });
  p.root.rotation.y = PI / 2 + .3; actuar(p, L.lt, [[0, { aRx: .4 }], [.3, { aRx: 1.45, aRe: .15, aRz: -.1, lean: .1 }, { dur: .25 }]], { T: L.T });
  cm([-3.6, 4.6, 33, -3.8, 4.2, 43, 50], [-3.6, 4.6, 34.2, -3.8, 4.2, 43, 48], L.k); sh(V(-4, 0, 43), 20); }, [[.3, 'cloth', .7], [.35, 'tug', .6], [1.0, 'rain', .4]]);
// 76 «„Keinen Schritt!"» — la cara de papá, seria, empapada
shot(134.23, 'Z', null, L => { plaza(L); storm(L); mon(GRAB, 0, MNEW); const [c, p] = US(L, 'scared', 'angry'); p.root.rotation.y = PI / 2 + .5; actuar(p, L.lt, [[0, { aRx: 1.45, aRe: .15, lean: .1, headX: -.05 }]], { T: L.T }); talk(p, L.T, 134.2, 135.2, 'angry');
  bubble(p, 'Keinen Schritt!', L.lt * 3); onFace(p, 10, .3, -.6, 42, L.k, 8.6); sh(V(-5, 0, 43), 20); }, [[0, 'whisper', .4], [.4, 'rain', .4]]);
// 77 «„Aber warum denn?"» — mi cara, sin entender nada
shot(135.35, 'C', null, L => { plaza(L); storm(L); mon(GRAB, 0, MNEW); const [c, p] = US(L, 'confused', 'angry'); c.root.rotation.y = -PI / 2 - .3; actuar(c, L.lt, [[0, 'shrug']], { T: L.T }); talk(c, L.T, 135.3, 136.2, 'confused');
  bubble(c, 'Aber warum?', L.lt * 3); onFace(c, 10, .3, 0, 42, L.k, 8.6); sh(V(-2, 0, 43), 20); }, [[0, 'rain', .5], [.3, 'cloth', .4]]);
// 78 «Er starrte nur auf das Monster.» — papá mira fijamente hacia arriba; por encima de su hombro, el monstruo con Benno
shot(136.23, 'R', null, L => { plaza(L); storm(L); mon(GRAB, 0, MNEW); const [c, p] = US(L, 'scared', 'scared'); actuar(p, L.lt, [[0, { headX: -.7, aRx: 1.0, aRe: .1 }]], { T: L.T }); BENNO(L, .6); cara(p, L.T, { expr: 'scared', eyes: 'wide' });
  const h = hp(p); cm([h.x - 2.4, h.y + .2, h.z + 7, h.x + 4, h.y + 16, h.z - 20, 62], [h.x - 2.2, h.y + .1, h.z + 6.4, h.x + 4, h.y + 17, h.z - 20, 60], L.k); sh(V(-3, 0, 40), 30); }, [[0, 'heartbeat', .7], [.8, 'metal_creak', .5]]);
// 79 «„Wenn noch ein einziges Licht ausgeht,» — la linterna de un vigilante parpadea bajo la lluvia: le queda poca batería
shot(138.21, 'W', null, L => { plaza(L); storm(L); mon(GRAB, 0, MNEW); const c = put(WA[4], 6, 0, 40, PI - .2); actuar(c, L.lt, [[0, { aRx: 2.1, aRe: .1, headX: -.4 }]], { T: L.T }); const f = torch(1, c, 1, 1); const on = !(L.lt > .6 && Math.sin(L.lt * 35) < -.3); f.userData.on(on); cara(c, L.T, { expr: 'scared' }); sweat(c, L.T);
  const hd = wpos(c.aR.hand); cm([hd.x + 5, hd.y - 1.5, hd.z + 5.6, hd.x, hd.y + .5, hd.z, 46], [hd.x + 4.4, hd.y - 1.3, hd.z + 5, hd.x, hd.y + .5, hd.z, 44], L.k); badge('num', '1 LICHT', W / 2, H * .15, (L.T - 138.57) * 3); sh(hd, 15); }, [[.6, 'glitch', .6], [1.0, 'click_metal', .5], [1.3, 'heartbeat', .6]]);
// 80 «sehen wir Benno nie wieder."» — zoom lento final a la cara del monstruo, con Benno en la garra delante; los ojos empiezan a brillar
shot(140.03, 'S', 'slow', L => { plaza(L); storm(L); mon(GRAB, L.k > .7 ? 2 : 0, MNEW); const b = BENNO(L, .8); cara(b, L.T, { expr: 'scared', mouth: 'o' }); const h = wpos(MON.head), pm = palm(MON, true); const t = look2(h, pm, .35);
  cm([t.x + 6, t.y - 2, t.z + 40, t.x, t.y, t.z, 46], [t.x + 3, t.y - 1, t.z + 24, t.x, t.y + 1, t.z, 40], L.k, easeIn); sh(t, 40); }, [[0, 'rain', .5], [.6, 'growl', .6], [1.5, 'creepy_ting', .6]]);

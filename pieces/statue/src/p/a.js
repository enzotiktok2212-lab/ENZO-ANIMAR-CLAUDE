// ---------- a: gancho, la regla, cómo me volví estatua (0 – 48,09 s) ----------
// Plaza: pedestal en P (-6, 0, -50) mirando a +z; estatuas en P.x ∓ 3,6 (Jonas izq., Finn der.), y = TOP; banco de enfrente en z = BZ (-28), mirando a -z.
const SPOTS = [[P.x - 16, P.z + 30, PI / 2], [P.x + 18, P.z + 40, -PI / 2], [P.x - 10, P.z + 52, PI * .8], [P.x + 12, P.z + 18, -PI * .7], [P.x - 22, P.z + 12, PI / 3], [P.x + 22, P.z + 6, -PI / 3]];
const petrify = (ch, L, t0, dur = .35, T0 = null) => { const k = clamp((L.lt - t0) / dur) * 1.08; stone(ch, k); if (k > 0 && k < 1.08) stoneDust(hp(ch).add(V(0, -4 * k, 0)), L.t0 + t0, L.T, 10, .7); return k; };
// 1 «In dieser Stadt»: en el Marktplatz, un chico con camisa amarilla y un ramo busca a una chica girando la cabeza a los lados… y en un segundo se vuelve de piedra de los pies a la cabeza
shot(0, 'C', null, L => { platz(L); const c = put(sucher, P.x, 0, P.z + 30, 0); c.flowers.visible = true; const look = Math.sin(L.lt * 9);
  actuar(c, 0, [[0, { aRx: 1.1, aRe: .9, aRz: -.1, aLx: .2, aLz: .15, headY: L.lt < .45 ? look * .6 : .15, lean: -.03 }]], { T: L.T });
  const k = petrify(c, L, .42, .32); cara(c, L.T, k > .6 ? { eyes: 'wide', mouth: 'o', noBlink: true } : { expr: 'happy', eyes: look > 0 ? 'side_l' : 'side_r', mouth: 'smile' });
  extras(L, EXS.slice(0, 4), SPOTS); statues(L);
  orbit(V(P.x, 4.4, P.z + 30), lerp(17, 12.5, easeOut(L.k)), .1, .08, 44); sh(V(P.x, 0, P.z + 26), 30); },
  [[0, 'zoom_fast', .6], [.05, 'steps', .4], [.42, 'stone_crack', .8], [.5, 'rubble', .5]]);
// 2 «wirst du zur Statue,»: el pedestal «1 JAHR SINGLE» con las dos estatuas; la gente señala y hace fotos; grúa hacia el pedestal
shot(.86, 'W', 'punch', L => { platz(L); statues(L, { fe: { eyes: 'side_l', mouth: 'flat', noBlink: true } }); extras(L, EXS.slice(4, 9), [[P.x - 6, P.z + 16, PI * .95], [P.x + 6, P.z + 17, -PI * .95], [P.x - 12, P.z + 22, PI * .8], [P.x + 11, P.z + 24, -PI * .8], [P.x + 1, P.z + 26, PI]], ['point', 'shock', 'point', 'talk', 'shock']);
  cm([P.x, 9, P.z + 32, P.x, 4.6, P.z, 46], [P.x, 7.6, P.z + 24, P.x, 5, P.z, 44], L.k); sh(V(P.x, 0, P.z + 10), 32); }, [[.05, 'crowd_gasp', .5], [.3, 'camera_click', .5]]);
// 3 «wenn du ein Jahr lang keine Freundin»: Finn (antes) en su cuarto, solo en la cama, desliza el móvil sin chats; el calendario lleno de cruces; «1 JAHR»
shot(2.16, 'C', 'punch', L => { myRoom(L); const c = sit(finn, KZX - 9, 3.7, -4.6, 0, L, { aRx: .9, aRe: 1.2, aLx: .8, aLe: 1.3, headX: .08 }); attach(PHONE, c.aR.hand, [0, -.55, .5], [-.4, 0, 0], .9); cara(c, L.T, { expr: 'sad' });
  show(CAL, KZX - 2, 9, -11.7); CALP.userData.draw((x, w, h) => { x.fillStyle = '#fbf6e8'; x.fillRect(0, 0, w, h); x.fillStyle = '#d8323a'; x.fillRect(0, 0, w, 70); txt(x, '365 TAGE', w / 2, 40, 44, '#ffffff'); x.strokeStyle = '#1a1a22'; x.lineWidth = 3; for (let k = 0; k < 35; k++) { const cx = 30 + (k % 7) * 50, cy = 110 + Math.floor(k / 7) * 74; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + 34, cy + 34); x.moveTo(cx + 34, cy); x.lineTo(cx, cy + 34); x.stroke(); } });
  onFace(c, 6.4, -1.4, 1.8, 42, L.k, 5.4); bigNum('1 JAHR', clamp((L.lt - .45) / .2), 'gold', .2, 1.1); }, [[.1, 'phone_tap', .5], [.5, 'pling', .4]]);
// 4 «oder keinen Freund hast.»: en clase, una chica sola en su pupitre mientras las demás van en pareja; la piedra le sube por los pies
shot(3.76, 'S', null, L => { school(L); const g = sit(EXS[2], KLX, 3.3, 6, 0, L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, headX: .25 }); stone(g, .28 + L.k * .18); cara(g, L.T, { expr: 'sad', mouth: 'wavy' });
  sit(EXS[4], KLX - 11, 3.3, 6, .4, L, { aRx: 1.2, aRz: -.6, aRe: .4 }); cara(EXS[4], L.T, { expr: 'happy', mouth: 'laugh' }); sit(EXS[0], KLX - 8.6, 3.3, 6, -.4, L, { aLx: 1.2, aLz: .6, aLe: .4 }); cara(EXS[0], L.T, { expr: 'happy', mouth: 'open_smile' });
  cm([KLX + 2, 8.6, 18, KLX, 4.6, 6, 44], [KLX + 1, 8, 15, KLX, 4.6, 6, 42], L.k); }, [[0, 'swipe', .4], [.2, 'stone_crack', .5], [.5, 'girls_laugh', .3]]);
// 5 «Und bewegen kannst du dich erst wieder,»: una estatua del parque (piedra entera) mueve solo los ojos a un lado y al otro: está viva dentro; órbita lenta
shot(4.86, 'F', null, L => { platz(L); const c = put(EXS[3], P.x + 24, 0, P.z + 6, -.5); actuar(c, 0, [[0, { aRx: 2.6, aRz: .3, aRe: .3, aLx: .1, headY: .1 }]], { T: L.T }); stone(c, 1); cara(c, L.T, { eyes: Math.sin(L.T * 4) > 0 ? 'side_l' : 'side_r', mouth: 'flat', noBlink: true });
  extras(L, EXS.slice(9, 12), SPOTS.slice(3)); const p = c.root.position; orb(L.k, V(p.x, 5.2, p.z), null, [12, -.7, .05, 42], [10, -.25, .05, 42]); sh(V(p.x, 0, p.z), 26); }, [[0, 'flash', .4], [.3, 'creepy_ting', .5], [.9, 'eyes_move', .4]]);
// 6 «wenn dich jemand küsst.»: una chica besa la mejilla de piedra de un chico: el color le vuelve de la cabeza a los pies, corazones
shot(6.67, 'C', 'punch', L => { platz(L, { dusk: true }); const b = put(EXS[1], P.x + 1.2, 0, P.z + 30, -PI / 2 + .25), g = put(EXS[6], P.x - 1.6, 0, P.z + 30.6, PI / 2 - .2); const u = clamp((L.lt - .35) / .5);
  actuar(g, 0, [[0, { lean: .18, aLx: 1.2, aLe: .8, aRx: .9, aRz: -.2, headX: .1 }]], { T: L.T }); cara(g, L.T, { eyes: 'closed', mouth: 'o' });
  actuar(b, 0, [[0, { aLx: .1, aRx: .1, headY: u * .3 }]], { T: L.T }); stone(b, 1.1 - u * 1.1); cara(b, L.T, u > .2 ? { eyes: 'wide', mouth: 'open_smile', noBlink: true } : { eyes: 'half', mouth: 'flat', noBlink: true });
  if (L.lt > .3) hearts(V(P.x, 8, P.z + 30), L.T, 5, 2.5); stoneDust(V(P.x + 1.2, 6, P.z + 30), L.t0 + .35, L.T, 12, .8);
  orb(L.k, V(P.x - .2, hp(b).y - 1.2, P.z + 30.3), null, [12, 0, .08, 40], [10.5, .05, .08, 40]); sh(V(P.x, 0, P.z + 30), 20); }, [[.3, 'kiss', .7], [.4, 'stone_crack', .5], [.6, 'sparkle', .5]]);
// 7 «Ich bin vor drei Jahren zur Statue geworden.» (zoom lento): yo, Finn, de piedra en el pedestal; la cámara se acerca a mi cara; «3 JAHRE»
shot(7.8, 'Z', 'slow', L => { platz(L); const s = statues(L, { fe: { expr: 'sad', noBlink: true } }); extras(L, EXS.slice(0, 3), SPOTS.slice(1));
  onFace(finn, 9, -.6, 0, 42, L.k, 5.4); bigNum('3 JAHRE', clamp((L.lt - .35) / .2), 'gold', .19, 1.05); sh(V(P.x, 0, P.z + 6), 28); }, [[.35, 'pling', .4]]);
// 8 «Wir sind an einem Freitag hergezogen,»: la furgoneta de mudanza en la plaza; yo (antes) bajo cargando la caja «FREITAG»
shot(9.83, 'W', null, L => { platz(L); show(VAN, P.x + 26, 0, P.z + 66, -PI / 2 + .3); const c = walk(finn, L, P.x + 6, P.z + 52, -.3, 1.6, 0, { pose: { aLx: 1.2, aRx: 1.2, aLe: 1.0, aRe: 1.0, aLz: -.1, aRz: -.1 }, expr: 'happy' });
  attach(BOX, c.root, [0, 2.6, 1.8], [0, 0, 0], .85); show(BOX2, P.x + 14, 0, P.z + 58, .3, .9); show(BOX3, P.x + 14.4, 2.2, P.z + 58, -.2, .8);
  const p = c.root.position; orbit(V(p.x, 4, p.z), lerp(14, 12, L.k), -.5, .1, 44); sh(V(p.x, 0, p.z), 30); }, [[0, 'truck_door', .5], [.2, 'box_drop', .4], [.4, 'steps', .4]]);
// 9 «und niemand hat uns gewarnt.»: dos vecinas cuchichean tapándose la boca y me miran de reojo; yo saludo sin enterarme
shot(11.21, 'S', null, L => { platz(L); const a = put(EXS[0], P.x - 2, 0, P.z + 46, .5), b = put(EXS[2], P.x + 1.4, 0, P.z + 46.6, -.6);
  actuar(a, 0, [[0, { aRx: 1.9, aRe: 1.9, aRz: -.4, lean: .15, headY: .5 }]], { T: L.T }); actuar(b, 0, [[0, { aLx: 1.9, aLe: 1.9, aLz: .4, lean: .12, headY: -.4 }]], { T: L.T }); cara(a, L.T, { expr: 'sus', eyes: 'side_r' }); cara(b, L.T, { expr: 'sus', eyes: 'side_l' });
  const f = put(finn, P.x + 6.4, 0, P.z + 43, -.5); actuar(f, 0, [[0, 'wave']], { T: L.T }); cara(f, L.T, { expr: 'happy', mouth: 'open_smile' });
  cm([P.x + 2, 7.4, P.z + 66, P.x + 2.4, 4.2, P.z + 44, 46], [P.x + 2.6, 7.2, P.z + 64, P.x + 2.6, 4.2, P.z + 44, 44], L.k); sh(V(P.x, 0, P.z + 46), 22); }, [[0, 'swipe', .4], [.2, 'whisper', .5], [.6, 'hmm', .3]]);
// 10 «Deshalb war ich ein ganzes Jahr lang der Neue,»: en la clase, de pie delante de la pizarra «HERZLICH WILLKOMMEN, FINN»; todos me miran
shot(12.89, 'C', 'punch', L => { school(L); KL.BB.userData.draw && KL.BB.userData.draw('willk', (c, w, h) => { c.fillStyle = '#1e3a2a'; c.fillRect(0, 0, w, h); txt(c, 'Herzlich willkommen,', w / 2, h * .36, 70, '#ffffff'); txt(c, 'Finn!', w / 2, h * .7, 110, '#ffd23f'); });
  const f = put(finn, KLX, 0, -9, 0); actuar(f, 0, [[0, { aLx: .2, aRx: .2, aLz: -.25, aRz: -.25, aLe: .6, aRe: .6 }]], { T: L.T }); cara(f, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(f, L.T, 1);
  [[-11, -2], [11, -2], [-11, 6], [11, 6]].forEach(([x, z], i) => { const c = sit(EXS[i + 4], KLX + x, 3.3, z, PI + (x > 0 ? .5 : -.5), L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6 }); cara(c, L.T, { expr: 'sus' }); });
  onBody(f, 12, 0, .32, 44, L.k, 10.5, 0); bigNum('1 JAHR', clamp((L.lt - 1.1) / .2), 'gold', .19, .95); }, [[.1, 'chalk', .4], [.5, 'class_murmur', .4], [1.1, 'pling', .4]]);
// 11 «und kein Mädchen»: le ofrezco flores a una chica en la plaza; ella se cruza de brazos y gira la cabeza
shot(14.81, 'W', null, L => { platz(L); const f = put(finn, P.x + 3.2, 0, P.z + 33, -PI / 2 + .7); actuar(f, 0, [[0, { aRx: 1.5, aRe: .3, aRz: .1, lean: .1 }]], { T: L.T }); attach(BOUQ, f.aR.hand, [0, -.5, .5], [0, 0, 0], 1); cara(f, L.T, { expr: 'happy', mouth: 'smile' });
  const g = put(ex, P.x - .6, 0, P.z + 32.4, .5); actuar(g, 0, [[0, { aLx: .15, aRx: .15, aLe: 1.55, aRe: 1.55, aLz: -.35, aRz: -.35, headY: clamp(L.lt / .3) * -.7 }]], { T: L.T }); cara(g, L.T, { expr: 'angry', mouth: 'flat' });
  orb(L.k, V(P.x + 1.2, 4.2, P.z + 33), null, [14, .2, .08, 42], [12, .15, .08, 42]); sh(V(P.x, 0, P.z + 34), 22); }, [[0, 'whoosh', .4], [.3, 'hmph', .5]]);
// 12 «wollte meine Freundin sein.»: me quedo solo con las flores en el banco; las chicas se van riéndose
shot(15.77, 'S', null, L => { platz(L, { dusk: true }); const f = sit(finn, P.x, 2.4, BZ - .3, PI, L, { aRx: .6, aRe: .8, aLx: .4, headX: .12 }); attach(BOUQ, f.aR.hand, [0, -.5, .5], [.8, 0, 0], 1); cara(f, L.T, { expr: 'sad' });
  walk(EXS[2], L, P.x - 4, BZ - 12, -PI / 2 - .4, 2.2, 0, { f: { expr: 'happy', mouth: 'laugh' } }); walk(EXS[4], L, P.x - 6, BZ - 14, -PI / 2 - .4, 2.2, 1, { f: { expr: 'happy', mouth: 'open_smile' } });
  cm([P.x + 1, 6.6, BZ - 13, P.x, 4.2, BZ, 44], [P.x + .5, 6.2, BZ - 11, P.x, 4.2, BZ, 42], L.k); sh(V(P.x, 0, BZ), 22); }, [[0, 'swipe', .4], [.3, 'girls_laugh', .4], [.8, 'sad_sigh', .5]]);
// 13 «Jeder kennt jemanden, der hier sofort»: la plaza llena; travelling lateral por grupos de amigos que se señalan unos a otros riéndose
shot(17.03, 'Z', null, L => { platz(L); const G1 = [[-12, 20], [-8, 21], [4, 22], [8, 21.4], [16, 20], [20, 21]]; G1.forEach(([x, z], i) => { const c = put(EXS[i], P.x + x, 0, P.z + z, i % 2 ? -.6 : .6); actuar(c, 0, [[0, i % 2 ? GEST.point || { aRx: 1.6 } : { aLx: .4, aRx: .4, aLz: .5, aRz: .5, aLe: 1.4, aRe: 1.4, lean: -.1 }]], { T: L.T }); laughF(c, L.T + i); });
  statues(L); cm([P.x - 12, 6.4, P.z + 38, P.x - 6, 4.6, P.z + 20, 46], [P.x + 14, 6.4, P.z + 38, P.x + 12, 4.6, P.z + 20, 46], L.k, x => x); sh(V(P.x, 0, P.z + 20), 34); }, [[0, 'zoom_in', .4], [.2, 'crowd_laugh', .5]]);
// 14 «zu Stein werden würde.»: uno de ellos se vuelve piedra de golpe y su amigo se dobla de la risa
shot(18.63, 'C', 'punch', L => { platz(L); const a = put(EXS[3], P.x - 1.5, 0, P.z + 26, .3), b = put(EXS[0], P.x + 2.2, 0, P.z + 26.4, -.4); actuar(a, 0, [[0, { aRx: .4, aLx: .3, headY: .2 }]], { T: L.T }); const k = petrify(a, L, .12, .28); cara(a, L.T, k > .7 ? { eyes: 'wide', mouth: 'o', noBlink: true } : { expr: 'shock' });
  actuar(b, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: .8, aLe: 1.8, lean: .2 }]], { T: L.T }); laughF(b, L.T);
  cm([P.x, 6.6, P.z + 38, P.x, 4.6, P.z + 26, 42], [P.x, 6.4, P.z + 36, P.x, 4.8, P.z + 26, 40], L.k); sh(V(P.x, 0, P.z + 26), 20); }, [[.12, 'stone_crack', .7], [.4, 'crowd_laugh', .4]]);
// 15 «Wer wäre das bei dir?»: yo, de piedra, giro los ojos y miro directamente a cámara; «?»
shot(19.96, 'F', null, L => { platz(L); statues(L, { fe: { eyes: L.lt > .3 ? 'normal' : 'side_r', mouth: 'flat', noBlink: true } }); onFace(finn, 5, -.4, 0, 40, L.k, 4.2); badge('q', '?', W * .78, H * .3, clamp((L.lt - .35) / .2)); }, [[0, 'flash', .3], [.3, 'eyes_move', .5], [.4, 'pop', .4]]);
// 16 «Bei mir?»: en mi cuarto (antes), me señalo a mí mismo pensando
shot(20.97, 'C', 'punch', L => { myRoom(L); const c = put(finn, KZX - 2, 0, 0, -.2); actuar(c, 0, [[0, { aRx: 1.2, aRe: 1.9, aRz: -.55, aLx: .2, aLz: .1, headZ: .15, headX: -.08 }]], { T: L.T }); talk(c, L.T, 20.9, 21.6, 'confused'); onFace(c, 5.6, 0, .6, 40, L.k, 4.8); }, [[0, 'impact', .4], [.15, 'hmm', .4]]);
// 17 «Ganz klar:»: mi primo en su cuarto, jugando a la consola en la cama, con cascos, gritando
shot(21.58, 'W', null, L => { cousinRoom(L); const c = sit(cousin, CZX - 3, 3.7, -3, 0, L, { aLx: .55, aRx: .55, aLe: 1.0, aRe: 1.0, aLz: -.35, aRz: -.35, headX: .25 }); { const hh = wpos(c.aR.hand).add(wpos(c.aL.hand)).multiplyScalar(.5); show(CTRL, hh.x, hh.y - .3, hh.z + .3, 0, .8); } cara(c, L.T, { expr: 'determined', mouth: Math.sin(L.T * 12) > 0 ? 'o' : 'grimace' });
  cm([CZX - 1, 8, 10, CZX - 3, 5, -3, 44], [CZX - 1.6, 7.6, 8.4, CZX - 3, 5, -3, 42], L.k); }, [[0, 'whoosh', .4], [.1, 'game_beeps', .5]]);
// 18 «mein Cousin.»: el primo se queda de piedra al instante, con el mando en la mano; «COUSIN»
shot(22.33, 'C', 'punch', L => { cousinRoom(L); const c = sit(cousin, CZX - 3, 3.7, -3, 0, L, { aLx: .55, aRx: .55, aLe: 1.0, aRe: 1.0, aLz: -.35, aRz: -.35, headX: .25 }); { const hh = wpos(c.aR.hand).add(wpos(c.aL.hand)).multiplyScalar(.5); show(CTRL, hh.x, hh.y - .3, hh.z + .3, 0, .8); } stone(c, 1.1); cara(c, L.T, { eyes: 'half', mouth: 'flat', noBlink: true });
  onFace(c, 6, 0, -.6, 40, L.k, 5); badge('tag', 'MEIN COUSIN', W / 2, H * .2, clamp((L.lt - .1) / .2)); }, [[0, 'stone_crack', .8], [.2, 'game_over', .4]]);
// 19 «Ich erinnere mich noch an den letzten Tag.»: el calendario de mi cuarto: tacho el último día con un rotulador rojo; «LETZTER TAG»
shot(23.08, 'I', null, L => { myRoom(L); const c = put(finn, KZX - 2, 0, -8.6, PI); const k = clamp((L.lt - .3) / .8); actuar(c, 0, [[0, { aRx: 2.2 + Math.sin(L.T * 14) * .08 * k, aRe: .5, aRz: -.1, aLx: .2 }]], { T: L.T });
  show(CAL, KZX - 2.6, 8.8, -11.7); CALP.userData.draw((x, w, h) => { x.fillStyle = '#fbf6e8'; x.fillRect(0, 0, w, h); x.fillStyle = '#d8323a'; x.fillRect(0, 0, w, 70); txt(x, 'LETZTER TAG', w / 2, 40, 42, '#ffffff'); x.strokeStyle = '#1a1a22'; x.lineWidth = 3; for (let q = 0; q < 35; q++) { const cx = 30 + (q % 7) * 50, cy = 110 + Math.floor(q / 7) * 74; x.strokeRect(cx, cy, 34, 34); if (q < 34 || k > .5) { x.strokeStyle = q === 34 ? '#d8323a' : '#1a1a22'; x.lineWidth = q === 34 ? 7 : 3; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + 34, cy + 34); x.moveTo(cx + 34, cy); x.lineTo(cx, cy + 34); x.stroke(); x.strokeStyle = '#1a1a22'; x.lineWidth = 3; } } });
  cm([KZX + 5, 7.6, 5, KZX - 3, 7.4, -11, 48], [KZX + 4, 7.4, 3, KZX - 3, 7.6, -11, 46], L.k); }, [[0, 'iris_pop', .4], [.4, 'marker', .6]]);
// 20 «Ich habe jedem Mädchen geschrieben,»: primerísimo plano del móvil: los chats se van llenando de mensajes
shot(24.86, 'C', 'punch', L => { myRoom(L, { night: true }); const n = Math.min(5, Math.floor(L.lt / .22) + 1); PHONE.userData.draw((c, w, h) => drawChats(c, w, h, n, '23:41')); show(PHONE, KZX - 9, 6, -4, 0, 2.4); PHONE.rotation.x = -.15;
  cm([KZX - 9, 6.6, 3.2, KZX - 9, 6, -4, 40], [KZX - 9, 6.4, 2.4, KZX - 9, 6, -4, 38], L.k); }, [[.05, 'typing', .6], [.4, 'msg_send', .4], [.8, 'msg_send', .4]]);
// 21 «das ich kannte.»: yo en la cama, de noche, tecleando a toda prisa, sudando
shot(26.1, 'S', null, L => { myRoom(L, { night: true }); const c = sit(finn, KZX - 9, 3.7, -4.6, 0, L, { aRx: 1.3 + Math.sin(L.T * 30) * .05, aRe: 1.4, aLx: 1.3, aLe: 1.4, headX: .3 }); attach(PHONE, c.aR.hand, [0, -.55, .5], [-.4, 0, 0], .9); PHONE.userData.draw((x, w, h) => drawChats(x, w, h, 5, '23:44')); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T, 2);
  onFace(c, 6, .5, 1, 40, L.k, 5); }, [[0, 'swipe', .4], [.1, 'typing', .6]]);
// 22 «Aber keine hat»: me quedo mirando la pantalla, esperando, con el pie que se mueve nervioso
shot(27.21, 'C', 'punch', L => { myRoom(L, { night: true }); const c = sit(finn, KZX - 9, 3.7, -4.6, 0, L, { aRx: 1.1, aRe: 1.5, aLx: .5, headX: .4, lLx: 1.5 + Math.abs(Math.sin(L.T * 14)) * .2 }); attach(PHONE, c.aR.hand, [0, -.55, .5], [-.4, 0, 0], .9); cara(c, L.T, { expr: 'worried' });
  onBody(c, 10, .2, .15, 42, L.k, 8.6, .2, 2.6); }, [[0, 'impact', .4], [.3, 'clock_tick', .5]]);
// 23 «rechtzeitig geantwortet.»: la pantalla: 23:59, ninguna respuesta; «23:59» en rojo
shot(27.93, 'Z', null, L => { myRoom(L, { night: true }); PHONE.userData.draw((c, w, h) => drawChats(c, w, h, 5, '23:59')); show(PHONE, KZX - 9, 6, -4, 0, 2.4); PHONE.rotation.z = .1;
  cm([KZX - 8.6, 6.4, 2.6, KZX - 9, 6, -4, 40], [KZX - 9.2, 6.2, 2.2, KZX - 9, 6, -4, 38], L.k); bigNum('23:59', clamp((L.lt - .1) / .2), 'red', .2, 1.1); }, [[0, 'zoom_in', .4], [.1, 'clock_tick', .6], [.9, 'clock_tick', .5]]);
// 24 «Um Mitternacht»: la plaza de noche, grúa; el reloj del Rathaus marca las doce; «0:00»
shot(29.23, 'W', null, L => { platz(L, { night: true }); statues(L, { finn: false }); sit(finn, P.x, 2.4, BZ - .3, PI, L, { aLx: .4, aRx: .4, headX: .3 }); cara(finn, L.T, { expr: 'sad' });
  cm([P.x + 6, 24, BZ + 34, P.x, 4, P.z, 50], [P.x + 4, 16, BZ + 24, P.x, 5, P.z, 48], L.k); bigNum('0:00', clamp((L.lt - .2) / .2), 'gold', .2, 1.1); sh(V(P.x, 0, P.z + 10), 50); }, [[0, 'church_bell', .6], [.2, 'night_amb', .4]]);
// 25 «saß ich auf der Bank am Marktplatz.»: yo solo en el banco bajo la farola, con el móvil apagado
shot(30.41, 'C', 'punch', L => { platz(L, { night: true }); const c = sit(finn, P.x, 2.4, BZ - .3, PI, L, { aLx: .6, aRx: .6, aLe: 1.2, aRe: 1.2, headX: .15 }); cara(c, L.T, { expr: 'sad' }); attach(PHONE, c.aR.hand, [0, -.55, .5], [-.6, 0, 0], .9); PHONE.userData.draw((x, w, h) => { x.fillStyle = '#0a0a10'; x.fillRect(0, 0, w, h); });
  onBody(c, 12, .3, .12, 42, L.k, 10, .1, 2.6); sh(V(P.x, 0, BZ), 20); }, [[0, 'impact', .4], [.2, 'crickets', .4], [.7, 'sad_sigh', .4]]);
// 26 «Zuerst wurden meine Füße schwer,»: primer plano de mis zapatillas en el adoquín: se vuelven gris piedra con un crujido
shot(31.72, 'F', null, L => { platz(L, { night: true }); const c = sit(finn, P.x, 2.4, BZ - .3, PI, L, { aLx: .6, aRx: .6, aLe: 1.2, aRe: 1.2, headX: .3 }); stone(c, .08 + clamp((L.lt - .3) / .6) * .12); cara(c, L.T, { expr: 'shock', eyes: 'down' });
  stoneDust(V(P.x, .6, BZ - 2), L.t0 + .35, L.T, 8, .5); cm([P.x + 3, 3.4, BZ - 9, P.x, 1.2, BZ - 1.6, 40], [P.x + 2.4, 3.2, BZ - 7.6, P.x, 1.2, BZ - 1.6, 38], L.k); }, [[0, 'flash', .4], [.35, 'stone_crack', .7], [.8, 'rubble', .4]]);
// 27 «dann meine Beine,»: la piedra sube por las piernas; me agarro las rodillas asustado
shot(33.36, 'C', 'punch', L => { platz(L, { night: true }); const c = sit(finn, P.x, 2.4, BZ - .3, PI, L, { aLx: .9, aRx: .9, aLe: .6, aRe: .6, lean: .25, headX: .15 }); stone(c, .25 + L.k * .15); cara(c, L.T, { expr: 'shock', eyes: 'scared', mouth: 'o' }); sweat(c, L.T, 2);
  onBody(c, 9, -.4, .2, 42, L.k, 8, -.3, 2); }, [[0, 'stone_crack', .7], [.3, 'gasp', .5]]);
// 28 «dann meine Brust.»: la piedra me llega al pecho; me llevo la mano al pecho, sin aire
shot(34.29, 'C', 'punch', L => { platz(L, { night: true }); const c = sit(finn, P.x, 2.4, BZ - .3, PI, L, { aRx: 1.4, aRe: 1.9, aRz: -.5, aLx: .4, headX: -.15 }); stone(c, .45 + L.k * .25); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  onFace(c, 6, 0, .4, 40, L.k, 4.6); }, [[0, 'stone_crack', .8], [.3, 'heartbeat', .6]]);
// 29 «Am Morgen ließ mich der Bürgermeister»: por la mañana, el alcalde con su cadena dorada señala mi estatua (aún en el banco) a dos operarios
shot(35.28, 'W', null, L => { platz(L, { dawn: true }); const s = sit(finn, P.x, 2.4, BZ - .3, PI, L, { aLx: .6, aRx: .6, aLe: 1.2, aRe: 1.2, headX: .15 }); stone(s, 1.1); cara(s, L.T, { expr: 'sad', noBlink: true });
  const m = put(mayor, P.x - 6, 0, BZ - 7, .5); actuar(m, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: .3, lean: -.05 }]], { T: L.T }); talk(m, L.T, 35.2, 36.6, 'smug');
  walk(EXS[7], L, P.x + 9, BZ - 12, -PI * .6, 1.6, 0, { expr: 'neutral' }); walk(EXS[9], L, P.x + 12, BZ - 10, -PI * .6, 1.6, 1, { expr: 'neutral' });
  cm([P.x + 8, 6.6, BZ - 24, P.x - 3, 4.4, BZ - 3.5, 46], [P.x + 7, 6.4, BZ - 21, P.x - 3, 4.4, BZ - 3.5, 44], L.k); sh(V(P.x, 0, BZ - 4), 26); }, [[0, 'whoosh', .4], [.1, 'birds', .4], [.5, 'steps', .4]]);
// 30 «auf einen Sockel stellen,»: los operarios suben mi estatua al pedestal con una grúa pequeña; el alcalde da palmadas
shot(36.65, 'C', 'punch', L => { platz(L, { dawn: true }); statues(L, { finn: false }); const u = easeOut(clamp(L.lt / .9)); const f = put(finn, P.x + SPX, lerp(TOP + 3, TOP, u), P.z + lerp(3, 0, u), 0); actuar(f, 0, [[0, STF]], { T: L.T, weight: false }); f.blob.visible = false; stone(f, 1.1); cara(f, L.T, { expr: 'sad', noBlink: true });
  [[P.x + 7.4, P.z + 6, -.9], [P.x + 9.6, P.z + 3, -1.2]].forEach(([x, z, ry], i) => { const w = put(EXS[7 + i * 2], x, 0, z, ry); actuar(w, 0, [[0, { aLx: 2.5, aRx: 2.5, aLe: .3, aRe: .3, lean: -.12 }]], { T: L.T }); cara(w, L.T, { expr: 'determined', mouth: 'grimace' }); });
  const m = put(mayor, P.x - 4, 0, P.z + 12, -.3); const cl = Math.sin(L.T * 14); actuar(m, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.2 - cl * .25, aRz: -.2 - cl * .25, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); grin(m, L.T);
  stoneDust(V(P.x + SPX, TOP, P.z), L.t0 + .85, L.T, 10, .8); cm([P.x + 6, 8, P.z + 30, P.x + 4, 5.6, P.z + 3, 48], [P.x + 5, 7.8, P.z + 27, P.x + 4, 5.8, P.z + 3, 46], L.k); sh(V(P.x, 0, P.z + 6), 26); }, [[0, 'impact', .4], [.2, 'chain_rattle', .4], [.85, 'stone_thud', .7]]);
// 31 «direkt neben Jonas,»: travelling de mí a la estatua de Jonas, que tiene la mano en la barbilla; «JONAS»
shot(37.8, 'S', null, L => { platz(L, { dawn: true }); statues(L, { je: { eyes: 'side_r', mouth: 'flat', noBlink: true } }); const a = hp(finn), b = hp(jonas);
  cm([a.x, a.y, a.z + 12, a.x, a.y - .6, a.z, 42], [b.x, b.y, b.z + 12, b.x, b.y - .6, b.z, 42], L.k); badge('tag', 'JONAS', W / 2, H * .2, clamp((L.lt - .5) / .2)); }, [[0, 'swipe', .4], [.5, 'pop', .4]]);
// 32 «der schon seit einem Jahr dort stand.»: Jonas de piedra, con musgo verde en los pies y una paloma en la cabeza; «1 JAHR»
shot(39.02, 'C', 'punch', L => { platz(L); statues(L, { je: { eyes: 'half', mouth: 'flat', noBlink: true } }); const h = hp(jonas); dove(0, h.x, h.y + 1.2, h.z, .4, L.T);
  onBody(jonas, 11, .25, .1, 42, L.k, 9.4, .2, 3.4); bigNum('1 JAHR', clamp((L.lt - .5) / .2), 'gold', .19, 1); }, [[0, 'impact', .4], [.2, 'pigeon_coo', .5], [.5, 'pling', .4]]);
// 33 «„Seit du da bist,»: el alcalde, delante del pedestal, abre los brazos y nos habla sonriendo
shot(40.67, 'W', null, L => { platz(L); statues(L, { fe: { eyes: 'down', mouth: 'flat', noBlink: true } }); const m = put(mayor, P.x + 1, 0, P.z + 9, .25); actuar(m, 0, [[0, { aLx: .6, aRx: .6, aLz: 1.0, aRz: 1.0, aLe: .3, aRe: .3, headX: -.1 }]], { T: L.T }); talk(m, L.T, 40.6, 41.7, 'happy');
  cm([P.x + 5, 5, P.z + 26, P.x + .5, 6, P.z + 6, 46], [P.x + 4, 5.2, P.z + 24, P.x + .5, 6.2, P.z + 6, 44], L.k); sh(V(P.x, 0, P.z + 6), 22); }, [[0, 'whoosh', .4], [.3, 'chain_rattle', .3]]);
// 34 «sieht der Platz aus wie ein Museum.“»: turistas haciendo fotos con flash a las estatuas; el alcalde orgulloso; bocadillo «MUSEUM!»
shot(41.65, 'F', null, L => { platz(L); statues(L, { fe: { eyes: 'squint', mouth: 'flat', noBlink: true } }); const m = put(mayor, P.x - 9, 0, P.z + 10, .4); actuar(m, 0, [[0, { aRx: 1.5, aRz: .4, aRe: .2, aLx: .3 }]], { T: L.T }); talk(m, L.T, 41.6, 43.4, 'happy');
  [[P.x - 3, P.z + 18, PI], [P.x + 3, P.z + 19, PI], [P.x + 8, P.z + 16, PI * .85]].forEach(([x, z, ry], i) => { const c = put(EXS[10 + i], x, 0, z, ry); actuar(c, 0, [[0, { aLx: 1.7, aRx: 1.7, aLe: 1.1, aRe: 1.1, headX: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'happy' }); });
  if ((L.lt % .5) < .06) grade.uniforms.flash.value = .5; bubble(m, 'MUSEUM!', clamp((L.lt - .6) / .2));
  cm([P.x - 2, 8, P.z + 34, P.x, 6.6, P.z + 4, 46], [P.x - 1, 7.6, P.z + 30, P.x, 6.6, P.z + 4, 44], L.k); sh(V(P.x, 0, P.z + 10), 26); }, [[0, 'flash', .4], [.1, 'camera_click', .5], [.6, 'camera_click', .5], [1.1, 'camera_click', .5], [1.5, 'camera_click', .4]]);
// 35 «Was dir niemand erzählt:»: mi cara de piedra, muy cerca: los ojos se deslizan hacia la cámara
shot(43.48, 'C', 'slow', L => { platz(L); statues(L, { fe: { eyes: L.lt < .5 ? 'side_l' : 'normal', mouth: 'flat', noBlink: true } }); onFace(finn, 5, -.3, 0, 40, L.k, 3.6); }, [[.5, 'eyes_move', .5]]);
// 36 «Wir sehen»: mis ojos siguen a una pareja que pasa por la plaza (los vemos desde detrás de mi hombro, la plaza al fondo)
shot(44.74, 'W', null, L => { platz(L); statues(L, { fe: { eyes: Math.sin(L.lt * 3) > 0 ? 'side_l' : 'side_r', mouth: 'flat', noBlink: true } }); walk(EXS[5], L, P.x - 3.4, P.z + 13, PI / 2, 2.6, 0, { expr: 'happy' }); walk(EXS[8], L, P.x - 3.4, P.z + 15.4, PI / 2, 2.6, 1, { expr: 'happy' });
  cm([P.x + 12, 8, P.z + 30, P.x + 1, 5.4, P.z + 6, 46], [P.x + 10, 8, P.z + 28, P.x + 1, 5.6, P.z + 6, 44], L.k); sh(V(P.x, 0, P.z + 10), 26); }, [[0, 'whoosh', .4], [.1, 'steps', .4]]);
// 37 «und hören alles.»: dos señoras cotillean al pie del pedestal; mi oreja de piedra, en primer plano; ondas de sonido
shot(45.48, 'C', 'punch', L => { platz(L); statues(L, { fe: { eyes: 'side_r', mouth: 'flat', noBlink: true } }); const a = put(EXS[0], P.x + 6, 0, P.z + 8, -.8), b = put(EXS[2], P.x + 9, 0, P.z + 6, -1.6); crowdGuy(a, P.x + 6, P.z + 8, L, 0, { mode: 'talk', ry: -.8 }); crowdGuy(b, P.x + 9, P.z + 6, L, 1, { mode: 'talk', ry: -1.6 });
  cm([P.x + 17, 8, P.z + 20, P.x + 6, 4.6, P.z + 5, 46], [P.x + 15, 8.2, P.z + 18, P.x + 6, 4.8, P.z + 5, 44], L.k); badge('tag', '... und dann hat er ...', W / 2, H * .22, clamp((L.lt - .2) / .2)); sh(V(P.x, 0, P.z + 6), 22); }, [[0, 'impact', .4], [.1, 'whisper', .5]]);
// 38 «Wir können uns nur nicht bewegen.»: intento moverme con todas mis fuerzas: tiemblo, sudo… y nada
shot(46.59, 'C', 'punch', L => { platz(L); statues(L, { fe: { expr: 'angry', eyes: 'squint', mouth: 'grimace', noBlink: true } }); sweat(finn, L.T, 2); SHAKE = .25; onFace(finn, 6, -.4, .6, 40, L.k, 5); }, [[0, 'strain', .6], [.5, 'stone_crack', .3]]);

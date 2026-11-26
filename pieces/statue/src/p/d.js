// ---------- d: el sexto día, el beso a Jonas y el final (127,21 – 165,6 s) ----------
// 100 «Am sechsten Tag kam sie früher.»: por la mañana temprano, Mia entra en la plaza con vestido azul claro; «6. TAG»
shot(127.21, 'I', null, L => { platz(L, { dawn: true }); statues(L, { fe: { eyes: 'wide', mouth: 'o', noBlink: true } }); const c = walk(miaK, L, P.x - 6, BZ + 14, PI - .3, 1.8, 0, { f: { expr: 'warm', mouth: 'smile' } });
  const p = c.root.position; orbit(V(p.x, 4.2, p.z), lerp(15, 13, L.k), PI - .3, .1, 44); bigNum('6. TAG', clamp((L.lt - .2) / .2), 'gold', .19, 1); sh(V(p.x, 0, p.z), 24); }, [[0, 'iris_pop', .4], [.1, 'heels', .5], [.3, 'pling', .3]]);
// 101 «Im Kleid,»: travelling por el vestido azul que se mueve al andar
shot(128.9, 'S', null, L => { platz(L, { dawn: true }); const c = walk(miaK, L, P.x, BZ + 8, PI, 1.2, 0, { f: { expr: 'warm', mouth: 'smile' } }); const p = c.root.position;
  cm([p.x + 4, 2.6, p.z - 7, p.x, 3, p.z, 40], [p.x - 4, 3.4, p.z - 7, p.x, 3.6, p.z, 40], L.k); sh(V(p.x, 0, p.z), 20); }, [[0, 'swipe', .4], [.2, 'cloth', .5]]);
// 102 «die Haare frisch gemacht.»: primer plano: el moño con lazo amarillo, se coloca un mechón y sonríe nerviosa
shot(129.66, 'C', 'punch', L => { platz(L, { dawn: true }); const c = put(miaK, P.x, 0, BZ - 2, PI); actuar(c, 0, [[0, { aRx: 2.6, aRe: 2.1, aRz: -.5, headZ: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'warm', eyes: 'happy', mouth: 'smile' });
  onFace(c, 5, .4, -.9, 40, L.k, 4.2); }, [[0, 'impact', .4], [.2, 'sparkle', .5]]);
// 103 «Sie setzte sich auf die Bank»: se sienta en el borde del banco, rígida, con las manos en las rodillas
shot(130.85, 'W', null, L => { platz(L, { dawn: true }); statues(L); miaBench(L, { aLx: .7, aRx: .7, aLe: .6, aRe: .6 }, miaK); cara(miaK, L.T, { expr: 'worried', mouth: 'grimace' });
  cm([P.x + 9, 6.6, BZ - 12, P.x, 4, BZ, 44], [P.x + 8, 6.4, BZ - 10.6, P.x, 4, BZ, 42], L.k); sh(V(P.x, 0, BZ), 22); }, [[0, 'whoosh', .4], [.3, 'bench_creak', .5]]);
// 104 «und atmete tief durch.»: cierra los ojos y respira hondo: el pecho sube y baja
shot(132.07, 'C', 'slow', L => { platz(L, { dawn: true }); const b = Math.sin(clamp(L.lt / 1) * PI); miaBench(L, { aLx: .7, aRx: .7, aLe: .6, aRe: .6, lean: -.12 * b, headX: -.2 * b, aLz: .15 * b, aRz: .15 * b }, miaK); cara(miaK, L.T, { eyes: 'closed', mouth: b > .3 ? 'o' : 'smile' });
  onFace(miaK, 5.6, 0, .3, 40, L.k, 4.6); }, [[.1, 'breath_in', .6], [.8, 'breath', .5]]);
// 105 «„Es ist mir peinlich,»: Mia, colorada, habla mirando hacia arriba, tapándose media cara
shot(133.11, 'C', 'punch', L => { platz(L, { dawn: true }); miaBench(L, { aRx: 2.2, aRe: 2.3, aRz: -.45, headX: -.3 }, miaK); talk(miaK, L.T, 133.1, 134.2, 'warm', { eyes: 'happy' }); onFace(miaK, 5, -.4, -.5, 40, L.k, 4.2); }, [[0, 'impact', .4], [.2, 'girl_giggle', .4]]);
// 106 «dass ich mich nicht früher getraut habe.“»: yo, de piedra, con los ojos brillando de esperanza y corazones
shot(134.26, 'F', null, L => { platz(L, { dawn: true }); statues(L, { fe: { eyes: 'happy', mouth: 'smile', noBlink: true } }); hearts(hp(finn).add(V(0, 1, 1)), L.T, 5, 2.4); onFace(finn, 6, -.3, .3, 40, L.k, 4.8); }, [[0, 'flash', .3], [.2, 'heartbeat', .5], [.6, 'sparkle', .4]]);
// 107 «Sie stand auf,»: Mia se levanta del banco de golpe, decidida
shot(135.76, 'C', 'punch', L => { platz(L, { dawn: true }); const u = easeOut(clamp(L.lt / .45)); const c = put(miaK, P.x + .2, lerp(sitY(miaK, 2.4), 0, u), BZ - .3 - u * .8, PI); actuar(c, 0, [[0, { lLx: 1.5 * (1 - u), rLx: 1.5 * (1 - u), lLk: 1.5 * (1 - u), lRk: 1.5 * (1 - u), lRx: 1.5 * (1 - u), aRx: .3, aLx: .3 }]], { T: L.T, weight: false }); c.blob.visible = u > .9; cara(c, L.T, { expr: 'determined' });
  onBody(c, 10, .5, .12, 42, L.k, 9, .4, 3); sh(V(P.x, 0, BZ), 20); }, [[0, 'impact', .4], [.1, 'bench_creak', .5], [.3, 'cloth', .4]]);
// 108 «stieg auf den Sockel,»: sube los escalones del pedestal; las dos estatuas al fondo
shot(136.84, 'S', null, L => { platz(L, { dawn: true }); statues(L, { fe: { eyes: 'down', mouth: 'o', noBlink: true }, je: { eyes: 'half', mouth: 'flat', noBlink: true } }); const u = easeInOut(clamp(L.lt / .9)); const c = put(miaK, P.x + .3, lerp(0, TOP, u), P.z + lerp(9, 2.4, u), PI); c.blob.visible = false;
  actuar(c, 0, [[0, { ...walkP(L.T, 0), lLx: -.9 * Math.sin(L.T * 9), lLk: 1.2 * Math.max(0, Math.sin(L.T * 9)), lRk: 1.2 * Math.max(0, -Math.sin(L.T * 9)) }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  cm([P.x + 10, 7, P.z + 20, P.x, 6.6, P.z + 2, 46], [P.x + 9, 7.6, P.z + 17, P.x, 7.2, P.z + 2, 44], L.k); sh(V(P.x, 0, P.z + 4), 22); }, [[0, 'swipe', .4], [.2, 'heels', .5], [.6, 'heels', .5]]);
// 109 «kam ganz nah …» (zoom lento): Mia, en el pedestal, se acerca muchísimo a MI cara; yo con los ojos como platos
shot(137.84, 'C', 'slow', L => { platz(L, { dawn: true }); statues(L, { fe: { eyes: 'wide', mouth: 'o', noBlink: true } }); const c = put(miaK, P.x + SPX * .25, TOP, P.z + 2.2, PI / 2 + .45); c.blob.visible = false; actuar(c, 0, [[0, { lean: .1 + L.k * .1, aLx: .5, aRx: .5, headX: -.1 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'o' });
  const h = hp(finn); cm([h.x - 1, h.y + .6, h.z + 9, h.x - 1.6, h.y - .5, h.z + 1, 42], [h.x - 1, h.y + .4, h.z + 6.4, h.x - 1.6, h.y - .4, h.z + 1, 40], L.k); hearts(h.clone().add(V(0, 1, 1)), L.T, 3, 2); }, []);
// 110 «und küsste»: Mia se gira… hacia el otro lado
shot(138.7, 'W', null, L => { platz(L, { dawn: true }); statues(L, { fe: { eyes: 'side_l', mouth: 'o', noBlink: true } }); const c = put(miaK, P.x - .4, TOP, P.z + 2.2, lerp(PI / 2 + .45, -PI / 2 - .45, easeInOut(clamp(L.lt / .5)))); c.blob.visible = false; actuar(c, 0, [[0, { lean: .1, aLx: .5, aRx: .5 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'o' });
  cm([P.x, TOP + 6, P.z + 15, P.x, TOP + 4.6, P.z, 44], [P.x, TOP + 6, P.z + 13, P.x, TOP + 4.6, P.z, 42], L.k); sh(V(P.x, 0, P.z), 20); }, [[0, 'whoosh', .4], [.2, 'cloth', .4]]);
// 111 «Jonas.»: ¡le da un beso a Jonas! golpe de zoom; yo detrás, con la boca abierta
shot(139.57, 'C', 'punch', L => { platz(L, { dawn: true }); statues(L, { fe: { expr: 'shock', eyes: 'wide', mouth: 'o', noBlink: true } }); const c = put(miaK, P.x - SPX + 1.7, TOP, P.z + 1, -PI / 2 - .35); c.blob.visible = false; actuar(c, 0, [[0, { lean: .2, aLx: 1.0, aRx: 1.0, aLe: .8, aRe: .8, aLz: -.2 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'o' });
  hearts(hp(jonas).add(V(.8, .6, .8)), L.T, 4, 1.6); cm([P.x + 4, TOP + 6.4, P.z + 12, P.x - 1.6, TOP + 5.2, P.z, 42], [P.x + 3.6, TOP + 6.2, P.z + 10.6, P.x - 1.6, TOP + 5.2, P.z, 40], L.k); sh(V(P.x, 0, P.z), 20); }, [[0, 'kiss', .8], [.1, 'braam', .7], [.3, 'record_scratch', .4]]);
// 112 «Jonas bewegte zuerst die Finger.»: la mano de Jonas: los dedos recuperan el color y se mueven
shot(140.23, 'F', null, L => { platz(L, { dawn: true }); statues(L, { finn: false, jonas: false }); const j = put(jonas, P.x - SPX, TOP, P.z, 0); const w = Math.sin(L.T * 14) * .3 * clamp(L.lt * 2); actuar(j, 0, [[0, { ...STJ, aLx: .35 + w, aLe: .3 + Math.abs(w) }]], { T: L.T, weight: false }); j.blob.visible = false; stone(j, 1.1, L.lt > .3 ? inHand(j) : null); cara(j, L.T, { eyes: 'half', mouth: 'flat', noBlink: true });
  const h = wpos(j.aL.hand); cm([h.x + 2.4, h.y + 1.4, h.z + 5, h.x, h.y, h.z, 40], [h.x + 2, h.y + 1.2, h.z + 4.2, h.x, h.y, h.z, 38], L.k); stoneDust(h, L.t0 + .3, L.T, 8, .4); }, [[0, 'flash', .4], [.3, 'stone_crack', .6], [.6, 'creak_stone', .4]]);
// 113 «Dann fiel er auf die Knie»: Jonas, ya con color, cae de rodillas sobre el pedestal entre una nube de polvo de piedra
shot(142.02, 'C', 'punch', L => { platz(L, { dawn: true }); statues(L, { jonas: false, fe: { eyes: 'side_l', mouth: 'o', noBlink: true } }); const u = easeIn(clamp(L.lt / .35)); const j = put(jonas, P.x - SPX, TOP - u * 1.6, P.z + u * .8, .3); j.blob.visible = false; actuar(j, 0, [[0, { lLx: -.3 * u, lRx: -.3 * u, lLk: 1.6 * u, lRk: 1.6 * u, lean: .35 * u, aLx: .9 * u, aRx: .9 * u }]], { T: L.T, weight: false }); stone(j, clamp(.4 - L.lt)); cara(j, L.T, { eyes: 'scared', mouth: 'o' });
  stoneDust(V(P.x - SPX, TOP + 2, P.z + 1), L.t0 + .3, L.T, 18, 1.2); cm([P.x - 1, TOP + 5, P.z + 14, P.x - SPX, TOP + 3, P.z, 44], [P.x - 1.4, TOP + 4.6, P.z + 12.4, P.x - SPX, TOP + 3, P.z, 42], L.k); sh(V(P.x, 0, P.z), 20); }, [[0, 'impact', .5], [.3, 'stone_thud', .7], [.4, 'rubble', .5]]);
// 114 «und hustete Staub.»: Jonas de rodillas tose nubes de polvo gris; Mia a su lado, le pone la mano en la espalda
shot(143.16, 'S', null, L => { platz(L, { dawn: true }); statues(L, { jonas: false, fe: { eyes: 'side_l', mouth: 'flat', noBlink: true } }); const c = Math.abs(Math.sin(L.T * 9)); const j = put(jonas, P.x - SPX, TOP - 1.6, P.z + .8, .3); j.blob.visible = false; actuar(j, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, lean: .4 + c * .15, aRx: 1.6, aRe: 2.0, aRz: -.4, aLx: .9, headX: .2 + c * .2 }]], { T: L.T, weight: false }); cara(j, L.T, { eyes: 'closed', mouth: c > .5 ? 'o' : 'grimace' });
  const m = put(miaK, P.x - SPX + 2.6, TOP, P.z + 1.6, -PI / 2 - .2); m.blob.visible = false; actuar(m, 0, [[0, { lean: .2, aRx: 1.1, aRe: .3, crouch: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'worried' }); dust(hp(j).add(V(0, -.2, 1.4)), L.t0 + .1, L.T, 10, .5);
  onBody(j, 9, .5, .12, 42, L.k, 8, .4, 1.6); }, [[0, 'swipe', .4], [.1, 'cough', .6], [.5, 'cough', .5]]);
// 115 «„Ich bin jeden Tag hier vorbeigelaufen.»: (recuerdo, sepia) Mia pasa cada día junto a Jonas, que mira el móvil y ni la ve
shot(144.18, 'R', null, L => { platz(L); const j = put(jonas, P.x + 4, 0, P.z + 30, -.3); actuar(j, 0, [[0, { aRx: 1.2, aRe: 1.4, headX: .35 }]], { T: L.T }); attach(PHONE, j.aR.hand, [0, -.55, .5], [-.4, 0, 0], .9); cara(j, L.T, { eyes: 'down', mouth: 'flat' });
  walk(mia, L, P.x - 6, P.z + 32, PI / 2 + .2, 2.2, 0, { pose: { headY: -.6 }, f: { expr: 'warm', eyes: 'side_r', mouth: 'smile' } }); grade.uniforms.sepia.value = .55;
  cm([P.x - 2, 6, P.z + 46, P.x, 4.4, P.z + 31, 44], [P.x - 1, 6, P.z + 44, P.x + 1, 4.4, P.z + 31, 42], L.k); sh(V(P.x, 0, P.z + 30), 22); }, [[0, 'whirl', .4], [.2, 'steps', .4]]);
// 116 «Bevor du zur Statue wurdest,»: Mia, arrodillada junto a Jonas en el pedestal, le habla con los ojos llorosos
shot(145.94, 'C', 'punch', L => { platz(L, { dawn: true }); statues(L, { jonas: false }); const j = put(jonas, P.x - SPX, TOP - 1.6, P.z + .8, .5); j.blob.visible = false; actuar(j, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, lean: .1, aLx: .5, aRx: .5, headY: .3 }]], { T: L.T, weight: false }); cara(j, L.T, { expr: 'confused' });
  const m = put(miaK, P.x - SPX + 2.4, TOP - 1.4, P.z + 2.6, -PI / 2 - .5); m.blob.visible = false; actuar(m, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, aLx: .6, aRx: .6, aLe: 1, aRe: 1 }]], { T: L.T, weight: false }); talk(m, L.T, 145.9, 148.4, 'sad'); tears(m, L.T);
  onFace(m, 5.6, 0, -.6, 40, L.k, 4.8); }, [[0, 'impact', .4], [.2, 'sniff', .4]]);
// 117 «hast du mich nie gesehen.“»: plano a dos de perfil: ella le mira, él la mira por primera vez
shot(147.3, 'W', null, L => { platz(L, { dawn: true }); statues(L, { jonas: false, fe: { eyes: 'side_l', mouth: 'wavy', noBlink: true } }); const j = put(jonas, P.x - SPX, TOP - 1.6, P.z + .8, PI / 2 - .3); j.blob.visible = false; actuar(j, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, aLx: .5, aRx: .5 }]], { T: L.T, weight: false }); cara(j, L.T, { expr: 'confused' });
  const m = put(miaK, P.x - SPX + 2.8, TOP - 1.4, P.z + 1.2, -PI / 2 + .1); m.blob.visible = false; actuar(m, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, aLx: .6, aRx: .6, aLe: 1, aRe: 1 }]], { T: L.T, weight: false }); talk(m, L.T, 147.2, 148.4, 'sad');
  cm([P.x - SPX + 1.4, TOP + 4.6, P.z + 11, P.x - SPX + 1.4, TOP + 3, P.z + 1, 42], [P.x - SPX + 1.4, TOP + 4.4, P.z + 10, P.x - SPX + 1.4, TOP + 3, P.z + 1, 40], L.k); }, [[0, 'whoosh', .4]]);
// 118 «Jonas sah sie verwirrt an.»: primer plano de Jonas, confuso, ladeando la cabeza
shot(148.47, 'C', 'punch', L => { platz(L, { dawn: true }); const j = put(jonas, P.x - SPX, TOP - 1.6, P.z + .8, .5); j.blob.visible = false; actuar(j, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, aRx: 1.4, aRe: 2.2, aRz: -.3, headZ: .2 }]], { T: L.T, weight: false }); cara(j, L.T, { expr: 'confused', mouth: 'flat' }); badge('q', '?', W * .72, H * .3, clamp((L.lt - .3) / .2));
  onFace(j, 5, 0, .4, 40, L.k, 4.2); }, [[0, 'impact', .4], [.3, 'hmm', .4]]);
// 119 «„Wie heißt du?“»: Jonas le pregunta, con una sonrisa torpe
shot(149.93, 'S', null, L => { platz(L, { dawn: true }); const j = put(jonas, P.x - SPX, TOP - 1.6, P.z + .8, .5); j.blob.visible = false; actuar(j, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, aRx: .6, aLx: .6 }]], { T: L.T, weight: false }); talk(j, L.T, 149.9, 150.6, 'happy'); onFace(j, 5.4, 0, -.5, 40, L.k, 4.6); }, [[0, 'swipe', .4]]);
// 120 «Sie lachte und weinte gleichzeitig»: Mia ríe y llora a la vez, tapándose la boca
shot(150.68, 'C', 'punch', L => { platz(L, { dawn: true }); const m = put(miaK, P.x - SPX + 2.4, TOP - 1.4, P.z + 2.6, -PI / 2 - .5); m.blob.visible = false; actuar(m, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, aRx: 2.0, aRe: 2.2, aRz: -.4, aLx: .6 }]], { T: L.T, weight: false }); laughF(m, L.T); tears(m, L.T);
  onFace(m, 5, 0, .4, 40, L.k, 4.4); }, [[0, 'impact', .4], [.1, 'girl_laugh_cry', .5]]);
// 121 «und sagte es ihm.»: se lo dice: bocadillo «MIA!»; los dos se sonríen
shot(152.32, 'W', null, L => { platz(L, { dawn: true }); statues(L, { jonas: false, fe: { eyes: 'side_l', mouth: 'wavy', noBlink: true } }); const j = put(jonas, P.x - SPX, TOP - 1.6, P.z + .8, PI / 2 - .3); j.blob.visible = false; actuar(j, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6 }]], { T: L.T, weight: false }); grin(j, L.T);
  const m = put(miaK, P.x - SPX + 2.8, TOP - 1.4, P.z + 1.2, -PI / 2 + .1); m.blob.visible = false; actuar(m, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6 }]], { T: L.T, weight: false }); talk(m, L.T, 152.3, 153.4, 'happy'); bubble(m, 'MIA!', clamp((L.lt - .4) / .2));
  cm([P.x - SPX + 1.4, TOP + 4.6, P.z + 11, P.x - SPX + 1.4, TOP + 3, P.z + 1, 42], [P.x - SPX + 1.2, TOP + 4.4, P.z + 9.6, P.x - SPX + 1.4, TOP + 3, P.z + 1, 40], L.k); }, [[0, 'whoosh', .4], [.4, 'pop', .4]]);
// 122 «Sie gingen Hand in Hand davon,»: Mia y Jonas se van de la mano por la plaza; detrás, yo solo en el pedestal
shot(153.52, 'S', null, L => { platz(L); statues(L, { jonas: false, fe: { eyes: 'down', mouth: 'wavy', noBlink: true } }); const sw = Math.sin(L.T * 4) * .3;
  walk(miaK, L, P.x - 2, P.z + 14, -.25, 1.6, 0, { pose: { aLx: .3 + sw, aLz: .2 }, f: { expr: 'happy', mouth: 'smile' } }); walk(jonas, L, P.x - 4.6, P.z + 14, -.25, 1.6, 1, { pose: { aRx: .3 + sw, aRz: -.2 }, f: { expr: 'happy' } });
  cm([P.x - 3, 7, P.z + 40, P.x - 1, 6.4, P.z + 8, 46], [P.x - 2, 7.2, P.z + 38, P.x, 6.6, P.z + 8, 44], L.k); sh(V(P.x, 0, P.z + 14), 26); }, [[0, 'swipe', .4], [.2, 'steps', .4], [.4, 'birds', .4]]);
// 123 «und sie nahm den Schal mit.»: Mia desenrolla la bufanda de la columnita y se la lleva; mis ojos la siguen
shot(154.82, 'C', 'punch', L => { platz(L); statues(L, { jonas: false, fe: { eyes: 'side_l', mouth: 'wavy', noBlink: true } }); SO.SCARF.visible = L.lt < .5; const m = put(miaK, P.x + .3, TOP, P.z + 2.2, PI + .1); m.blob.visible = false; actuar(m, 0, [[0, { aLx: 1.6, aRx: 1.6, aLe: 1.2, aRe: 1.2, aLz: -.3, aRz: -.3 }]], { T: L.T }); cara(m, L.T, { expr: 'happy' }); if (L.lt >= .5) attach(SCARFH, m.aR.hand, [.6, -.8, .6], [0, 0, 0], 1);
  cm([P.x + 5, TOP + 6.6, P.z + 13, P.x + 1, TOP + 4.6, P.z, 44], [P.x + 4.4, TOP + 6.4, P.z + 11.6, P.x + 1, TOP + 4.6, P.z, 42], L.k); sh(V(P.x, 0, P.z), 20); }, [[0, 'impact', .4], [.3, 'cloth', .6]]);
// 124 «Er kannte nicht mal ihren Namen.»: Jonas y Mia, de espaldas al fondo de la plaza, él se rasca la cabeza
shot(156.37, 'W', null, L => { platz(L); walk(miaK, L, P.x - 2, P.z + 30, PI - .2, 1.4, 0, { f: { expr: 'happy' } }); walk(jonas, L, P.x - 4.6, P.z + 30, PI - .2, 1.4, 1, { pose: { aRx: 2.6, aRe: 2.2, aRz: -.4 }, f: { expr: 'confused' } }); bubble(jonas, '???', clamp((L.lt - .3) / .2));
  const p = jonas.root.position; orbit(V(p.x + 1.3, 4.4, p.z), 13, PI - .2 + .5, .1, 44); sh(V(p.x, 0, p.z), 22); }, [[0, 'whoosh', .4], [.2, 'steps', .4]]);
// 125 «Ich wusste alles.» (zoom lento): yo, solo en el pedestal; el sitio de Jonas vacío
shot(158.06, 'Z', 'slow', L => { platz(L, { dusk: true }); statues(L, { jonas: false, fe: { eyes: 'down', mouth: 'wavy', noBlink: true } }); onFace(finn, 9, -.4, -1.4, 42, L.k, 5.4); }, []);
// 126 «Ihre Lieblingsfarbe.»: (recuerdo) la chaqueta verde de Mia, en el banco, con luz dorada; «GRÜN»
shot(158.9, 'F', null, L => { platz(L, { dusk: true }); miaBench(L, { headX: -.3 }); cara(mia, L.T, { expr: 'warm', eyes: 'happy' }); grade.uniforms.sepia.value = .35; onBody(mia, 8, .2, .12, 42, L.k, 7, .1, 2.6); badge('green', 'GRÜN', W / 2, H * .2, clamp((L.lt - .3) / .2)); }, [[0, 'flash', .3], [.3, 'soft_chime', .4]]);
// 127 «Den Namen ihres Hundes.»: (recuerdo) Brezel moviendo la cola; «BREZEL»
shot(160.23, 'C', 'punch', L => { miaRoom(L); show(DOG, MZX - 1, 0, 2, .3); DOG.userData.pose(L.T, 1, 0); DOG.userData.slipper.visible = false; grade.uniforms.sepia.value = .35;
  cm([MZX + 1, 4.4, 11, MZX - 1, 2.2, 2, 40], [MZX + .6, 4, 9.6, MZX - 1, 2.2, 2, 38], L.k); badge('tag', 'BREZEL', W / 2, H * .2, clamp((L.lt - .2) / .2)); }, [[0, 'impact', .4], [.1, 'dog_bark', .4]]);
// 128 «Ihre Angst vor Rolltreppen.»: (recuerdo) Mia al pie de la escalera mecánica, asustada
shot(161.39, 'S', null, L => { mallS(L); const m = put(mia, MLX + .4, 0, 7, PI); actuar(m, 0, [[0, { aLx: 1.8, aRx: 1.8, aLe: 2.0, aRe: 2.0, aLz: -.3, aRz: -.3, ...shiver(L.T, 1.5) }]], { T: L.T }); cara(m, L.T, { expr: 'shock', eyes: 'scared', mouth: 'grimace' }); grade.uniforms.sepia.value = .35;
  cm([MLX + 4, 7, 20, MLX, 6, 4, 44], [MLX + 3, 6.8, 18, MLX, 6.2, 4, 42], L.k); }, [[0, 'swipe', .4], [.1, 'escalator', .4]]);
// 129 «Ich wusste nur nicht,»: atardecer: yo solo en el pedestal, la columnita sin bufanda; los ojos llenos de lágrimas
shot(162.68, 'B', null, L => { platz(L, { dusk: true }); statues(L, { jonas: false, fe: { eyes: 'cry', mouth: 'wavy', noBlink: true } }); tears(finn, L.T); onFace(finn, 6, -.2, .4, 40, L.k, 5); }, [[.2, 'sad_sting', .5]]);
// 130 «dass nichts davon für mich war.»: grúa que se aleja: el pedestal «1 JAHR SINGLE» conmigo solo, la plaza vacía al atardecer; fundido
shot(163.8, 'B', null, L => { platz(L, { dusk: true }); statues(L, { jonas: false, fe: { eyes: 'down', mouth: 'wavy', noBlink: true } }); for (let i = 0; i < 2; i++) dove(i, P.x - 3 + i * 2, TOP + .1, P.z + .6, i, L.T);
  cm([P.x + 2, 9, P.z + 16, P.x + 2, 7.4, P.z, 42], [P.x + 2, 26, P.z + 52, P.x, 6, P.z, 48], L.k, easeOut); DARK = clamp((L.lt - 1.3) / .5) * .85; sh(V(P.x, 0, P.z + 10), 40); }, [[0, 'wind_soft', .5], [.4, 'pigeon_coo', .3]]);

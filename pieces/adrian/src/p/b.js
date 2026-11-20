// ---------- b: el forastero, la noche, el robo, el policía (35,41 – 71,12 s) ----------
const PLZ = V(-8, 0, 14);                 // centro de la plaza para las multitudes
const STREET = V(22, 0, 84);              // calle delante de casa (mi hermano)
const suitIn = (c, side = 'L') => { const h = side === 'L' ? c.aL.hand : c.aR.hand; attach(SUIT, h, [0, -1.0, 0], [0, PI / 2, 0], .55); };
const door = i => { const d = DOORS[i]; return { d, p: V(NX - 20 + i * 20, 0, 0) }; };

// 30 «Aber dann kam eines Tages» (zoom lento): la carretera de entrada; un desconocido se acerca a lo lejos
shot(35.41, 'I', 'slow', L => { town(L); const z = 318 - L.lt * 3.2; walkTo(det, 25, 318, PI, 3.2, L, 0, 7); suitIn(det); cara(det, L.T, { expr: 'smug', mouth: 'smirk' });
  grade.uniforms.sat.value = 1.25; cm([26.5, 4.2, z - 30], [26.2, 3.8, z - 22], easeIn(L.k)); camera.lookAt(25, 3.2, z); camera.fov = 38; sh(V(25, 0, z), 20); }, [[0, 'wind', .45], [.3, 'steps', .35]]);
// 31 «ein Fremder in die Stadt.»: el forastero se para delante del cartel y se toca la gorra
shot(36.93, 'S', null, L => { town(L); const r = .25, c = V(12, 0, 240); const x = c.x + Math.cos(r) * 4.6 + Math.sin(r) * 3.2, z = c.z - Math.sin(r) * 4.6 + Math.cos(r) * 3.2; put(det, x, 0, z, r); suitIn(det);
  actuar(det, L.lt, [[0, { aRx: .3 }], [.3, { aRx: 2.9, aRz: -.6, aRe: 2.1, headX: .1 }, { dur: .25 }]], { T: L.T }); cara(det, L.T, { expr: 'smug', mouth: 'smirk' });
  orb(L.k, V(c.x + Math.cos(.25) * 2, 5.2, c.z - Math.sin(.25) * 2 + 1.5), null, [25, .3, .06, 44], [22, .24, .05, 44]); sh(c, 20); }, [[0, 'steps', .4], [.35, 'cloth', .4]]);
// 32 «Hallo! Ich bin Adrian!»: primer plano: saluda con una sonrisa enorme y su placa ADRIAN
shot(38.07, 'C', 'punch', L => { town(L); const p = V(-4, 0, 30); put(det, p.x, 0, p.z, .1); suitIn(det); actuar(det, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 10) * .35, aRe: .4 }]], { T: L.T }); grin(det, L.T, { mouth: L.T < 38.6 ? 'open_smile' : 'grin' });
  crowdAt(L, p.x, p.z - 3, 6, 6, 12, 41, { mode: 'idle', expr: 'happy', list: EX, from: 8 });
  bubble(det, L.T < 38.6 ? 'Hallo!' : 'Ich bin Adrian!', 1, 1.5); onBody(det, 9.6, .1, .06, 40, L.k, 8.8); sh(p, 16); }, [[0, 'pop', .45], [.55, 'ding_soft', .4]]);
// 33 «Und die ganze Stadt jubelte.»: la plaza le aclama; confeti
shot(39.55, 'F', null, L => { town(L); put(det, PLZ.x, 0, PLZ.z, 0); suitIn(det); actuar(det, 0, [[0, { ...GEST.cheer, aLx: .3, aLz: .1 }]], { T: L.T }); grin(det, L.T);
  crowdAt(L, PLZ.x, PLZ.z, 18, 4.5, 13, 43, { mode: 'cheer', face: V(PLZ.x, 3, PLZ.z), gap: 1.0 }); confRain(V(PLZ.x, 0, PLZ.z), L.T, 60, 22, 18, 16);
  orb(L.k, V(PLZ.x, 3.6, PLZ.z), null, [19, -.2, .26, 46], [16, .05, .22, 46]); sh(PLZ, 22); }, [[0, 'cheer', .6], [.2, 'confetti', .45], [.6, 'party_horn', .4]]);
// 34 «Denn wer hier Adrian heißt,»: Papa le estrecha la mano; un vecino le da palmadas
shot(41.23, 'W', null, L => { town(L); const p = V(10, 0, 24); put(det, p.x + 1.6, 0, p.z, -PI / 2 + .45); put(papa, p.x - 1.6, 0, p.z, PI / 2 - .45); const sh_ = Math.sin(L.T * 14) * .12;
  actuar(det, 0, [[0, { aRx: 1.3 + sh_, aRz: -.3, aRe: .4 }]], { T: L.T }); actuar(papa, 0, [[0, { aRx: 1.3 - sh_, aRz: -.3, aRe: .4, aLx: .4 }]], { T: L.T }); grin(det, L.T); laughF(papa, L.T);
  const n = put(EX[9], p.x + 3.2, 0, p.z - 2.4, -.6); actuar(n, 0, [[0, { aLx: 2.0, aLz: -.6, aLe: .6 + Math.abs(Math.sin(L.T * 9)) * .4 }]], { T: L.T }); laughF(n, L.T + 1);
  orb(L.k, V(p.x + .3, 3.2, p.z - .4), null, [12.5, .08, .1, 42], [11, -.05, .08, 42]); sh(p, 14); }, [[0, 'slap', .45], [.4, 'laugh_m', .4]]);
// 35 «gehört zur Familie.»: abrazo de grupo (Mama, Papa, vecinos) con corazones
shot(42.71, 'Z', null, L => { town(L); const p = V(10, 0, 24); put(det, p.x, 0, p.z, 0); actuar(det, 0, [[0, { aLx: 1.6, aRx: 1.6, aLz: -.9, aRz: -.9, aLe: .5, aRe: .5 }]], { T: L.T }); cara(det, L.T, { expr: 'happy', eyes: 'closed', mouth: 'grin' });
  [[mama, -2.2, .3], [papa, 2.2, -.3], [EX[10], -1.2, .2], [EX[11], 1.3, -.2]].forEach(([c, dx, ry], i) => { put(c, p.x + dx, 0, p.z - (i > 1 ? 1.6 : .4), ry); actuar(c, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: dx > 0 ? -1.0 : -.3, aRz: dx > 0 ? -.3 : -1.0, aLe: .4, aRe: .4, lean: .05 }]], { T: L.T }); cara(c, L.T + i, { expr: 'love', eyes: 'happy', mouth: 'smile' }); });
  hearts(V(p.x, 6.4, p.z), L.T); orb(L.k, V(p.x, 3.4, p.z), null, [13, .05, .1, 42], [11, 0, .08, 42]); sh(p, 14); }, [[0, 'hug', .5], [.4, 'aah', .35]]);
// 36 «In dieser Nacht ging jemand»: calle de noche con luna; una figura pasa por la acera
shot(43.75, 'I', null, L => { nightStreet(L); walkTo(det, NX - 34, 3.6, PI / 2, 3.0, L, 0, 7); cara(det, L.T, { expr: 'smug', mouth: 'smirk' }); const dp = det.root.position;
  cm([dp.x + 4, 7.0, 22], [dp.x + 4.5, 6.2, 19], L.k); camera.lookAt(dp.x + .5, 3.6, 2); camera.fov = 48; sh(V(dp.x, 0, 2), 24); }, [[0, 'crickets', .45], [.3, 'steps', .4], [.8, 'owl', .35]]);
// 37 «von Tür zu Tür und sagte:»: llama a la puerta n.º 12
shot(44.99, 'S', null, L => { nightStreet(L); const { d, p } = door(0); put(det, p.x + .6, 0, 3.4, PI - .5); const kn = Math.abs(Math.sin(L.T * 12)); actuar(det, 0, [[0, { aRx: 1.6, aRz: -.1, aRe: 1.5 + kn * .4, lean: .06 }]], { T: L.T }); cara(det, L.T, { expr: 'smug' });
  cm([p.x + 7.5, 5.2, 1.6], [p.x + 6.8, 5.0, 1.4], L.k); camera.lookAt(p.x + .4, 3.6, 3.0); camera.fov = 48; sh(V(p.x, 0, 2), 16); }, [[0, 'knock', .65], [.35, 'knock', .55], [.7, 'knock', .5]]);
// 38 «Ich bin's, Adrian!»: su cara a la luz del farol de la puerta, sonrisa dulce y la placa ADRIAN
shot(46.59, 'C', null, L => { nightStreet(L); const { d, p } = door(0); put(det, p.x + .4, 0, 3.4, PI + .15); actuar(det, 0, [[0, { aLx: .9, aLz: -.6, aLe: 1.9, aRx: .2, headZ: .12 }]], { T: L.T }); cara(det, L.T, { expr: 'happy', eyes: 'happy', mouth: kitLips(L.T, spoken(46.5, 47.9)) || 'smile' });
  const h = hp(det); cm([h.x - 4.4, h.y + .5, .9], [h.x - 3.9, h.y + .4, 1.0], L.k); camera.lookAt(h.x, h.y + .2, h.z); camera.fov = 44; bubble(det, 'Ich bin’s!', clamp(L.lt / .1), 1.4); sh(V(p.x, 0, 3), 12); }, [[0, 'pop', .4]]);
// 39 «Und alle ließen ihn rein.»: Papa abre la puerta n.º 14 sonriendo y le hace pasar
shot(47.97, 'W', null, L => { nightStreet(L); const { d, p } = door(1); d.userData.setOpen(easeOut(clamp(L.lt / .4)));
  put(papa, p.x, 0, -1.2, 0); actuar(papa, 0, [[0, { aRx: 1.2, aRz: .5, aRe: .8 + Math.sin(L.T * 8) * .3, aLx: .3 }]], { T: L.T }); grin(papa, L.T);
  walkTo(det, p.x + 3.4, 5.4, PI + .55, 2.0, L, 0, 7); suitIn(det); cara(det, L.T, { expr: 'smug', mouth: 'smirk' });
  cm([p.x - 6.5, 5, 13], [p.x - 5.5, 4.8, 11.5], L.k); camera.lookAt(p.x + .6, 3.6, 1); camera.fov = 46; sh(V(p.x, 0, 2), 16); }, [[0, 'door_open', .6], [.5, 'steps', .35]]);
// 40 «Am nächsten Morgen waren alle»: el aparcabicis vacío, candados rotos en el suelo; dos vecinos se llevan las manos a la cabeza
shot(49.33, 'F', null, L => { town(L); const r = V(-47, 0, 6); LOCKS.forEach((l, i) => show(l, r.x + .8 + (i % 2) * .5, .35, r.z - 3.6 + i * 2.4, i, .8));
  const v = put(EX[12], r.x + 2.4, 0, r.z + 3.6, PI / 2 + .3); actuar(v, 0, [[0, GEST.hands_head]], { T: L.T }); cara(v, L.T, { expr: 'shock', mouth: 'o' });
  const v2 = put(EX[13], r.x + 2.8, 0, r.z - 4.0, PI / 2 - .2); actuar(v2, 0, [[0, GEST.shock]], { T: L.T }); cara(v2, L.T + 1, { expr: 'shock', mouth: 'grimace' });
  cm([r.x + 19, 6.5, r.z + 2], [r.x + 17, 6, r.z + 1.5], L.k); camera.lookAt(r.x + 1.5, 2.4, r.z); camera.fov = 50; sh(r, 16); }, [[0, 'birds', .4], [.25, 'gasp', .5], [.5, 'chain_rattle', .4]]);
// 41 «Fahrräder und Laptops weg.»: en el café, la mesa vacía donde estaba su portátil; el dueño, en shock. «ALLES WEG!»
shot(50.95, 'Z', null, L => { town(L); const t = V(36, 0, -40); const v = put(EX[14], t.x, 0, t.z + 2.8, 0); actuar(v, 0, [[0, GEST.hands_head]], { T: L.T }); cara(v, L.T, { expr: 'shock', mouth: 'scream' });
  const v2 = put(EX[15], t.x - 3.4, 0, t.z + 1.6, .5); actuar(v2, 0, [[0, GEST.shock]], { T: L.T }); cara(v2, L.T + 1, { expr: 'shock', mouth: 'o' });
  orb(L.k, V(t.x - 1, 3.4, t.z + 2.4), null, [13.5, -.15, .14, 44], [12, -.05, .12, 44]); badge('red', 'ALLES WEG!', W / 2, H * .17, clamp((L.lt - .2) / .15), 1, .9); sh(t, 14); }, [[0, 'gasp', .5], [.3, 'murmur', .4]]);
// 42 «Sogar das Fahrrad von meinem Bruder.»: mi hermano ante el candado roto donde estaba su bici
shot(52.71, 'S', null, L => { town(L); show(LOCKS[0], STREET.x - 1.8, .45, STREET.z - 1, .5, 1); const b = put(bru, STREET.x, 0, STREET.z, -.3); actuar(b, 0, [[0, { ...GEST.shock, headX: .35 }]], { T: L.T }); cara(b, L.T, { expr: 'shock', eyes: 'down', mouth: 'o' });
  orb(L.k, V(STREET.x - .6, 2.0, STREET.z - .4), null, [11, -.4, .2, 42], [9.5, -.25, .16, 42]); sh(STREET, 12); }, [[0, 'chain_rattle', .45], [.4, 'baby_gasp', .4]]);
// 43 (llanto): primer plano: mi hermano llora a lágrima viva
shot(54.31, 'C', null, L => { town(L); const b = put(bru, STREET.x, 0, STREET.z, .1); actuar(b, 0, [[0, { aLx: 1.8, aRx: 1.8, aLz: -.4, aRz: -.4, aLe: 2.2, aRe: 2.2, headX: .15 + Math.sin(L.T * 9) * .04, crouch: .05 }]], { T: L.T }); cara(b, L.T, { expr: 'cry', eyes: 'cry', mouth: 'ah' }); tears(b, L.T);
  onFace(b, 6.2, .2, .4, 40, L.k, 5.6); sh(STREET, 10); }, [[0, 'cry_girl', .35]]);
// 44 «Müller, jemand hat»: me lo cuenta llorando; yo le escucho
shot(55.89, 'W', null, L => { town(L); const b = put(bru, STREET.x + 1.4, 0, STREET.z, -PI / 2 + .6); actuar(b, 0, [[0, { aLx: .9, aRx: .9, aLz: .2, aRz: .2, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); talk(b, L.T, 55.8, 57.2, 'cry', { eyes: 'cry' }); tears(b, L.T);
  put(me, STREET.x - 1.8, 0, STREET.z - .4, PI / 2 - .6); actuar(me, 0, [[0, GEST.listen]], { T: L.T }); cara(me, L.T, { expr: 'worried' });
  orb(L.k, V(STREET.x - .2, 2.7, STREET.z), null, [10.5, .08, .1, 42], [9.5, 0, .08, 42]); sh(STREET, 12); }, [[0, 'sniff', .45]]);
// 45 «mein Fahrrad geklaut!»: brazos abiertos, desconsolado
shot(57.14, 'F', null, L => { town(L); const b = put(bru, STREET.x, 0, STREET.z, -.2); actuar(b, 0, [[0, { aLx: .5, aRx: .5, aLz: .9, aRz: .9, aLe: .5, aRe: .5, headX: -.2 }]], { T: L.T }); talk(b, L.T, 57.1, 58.5, 'cry', { eyes: 'cry' }); tears(b, L.T);
  bubble(b, 'geklaut!', clamp((L.lt - .4) / .1), 1.5); onBody(b, 8.6, .15, .1, 42, L.k, 7.6); sh(STREET, 12); }, [[0, 'cry_girl', .3], [.5, 'sad_tone', .3]]);
// 46 «Also habe ich ihm versprochen,»: me agacho, le pongo la mano en el hombro
shot(58.50, 'S', null, L => { town(L); const b = put(bru, STREET.x + 1.2, 0, STREET.z, -PI / 2 + .5); actuar(b, 0, [[0, { aLx: .3, aRx: .3, headX: .1 }]], { T: L.T }); cara(b, L.T, { expr: 'sad', mouth: 'frown' });
  const m = put(me, STREET.x - 1.2, 0, STREET.z, PI / 2 - .5); actuar(m, 0, [[0, { crouch: .45, lean: .15, aRx: 1.5, aRz: -.15, aRe: .3, headX: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'smile', mouth: 'smile' });
  orb(L.k, V(STREET.x, 2.2, STREET.z), null, [10, -.2, .1, 42], [9, -.05, .08, 42]); sh(STREET, 12); }, [[0, 'cloth', .4], [.5, 'hug', .3]]);
// 47 «dass ich es zurückhole.» (zoom lento): plano bajo, puño cerrado, decidido
shot(59.72, 'Z', 'slow', L => { town(L); const m = put(me, STREET.x - 1.2, 0, STREET.z, .15); actuar(m, 0, [[0, { aRx: 1.9, aRz: -.3, aRe: 2.2, headX: -.08 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'flat' });
  const h = hp(m); cm([h.x + .8, h.y - 1.8, h.z + 7.5], [h.x + .6, h.y - 1.5, h.z + 5.6], easeIn(L.k)); camera.lookAt(h.x, h.y - .4, h.z); camera.fov = 42; sh(STREET, 12); }, [[0, 'heartbeat', .4]]);
// 48 «Polizist Adrian fragte»: el policía junto al coche patrulla, toma notas
shot(60.87, 'W', null, L => { town(L); const p = V(24, 0, 24); put(pol, p.x, 0, p.z, -.2); actuar(pol, 0, [[0, { aLx: 1.3, aLz: -.3, aLe: 1.3, aRx: 1.1, aRz: -.5, aRe: 1.6 + Math.sin(L.T * 12) * .1, headX: .25 }]], { T: L.T }); cara(pol, L.T, { expr: 'neutral', eyes: 'down' });
  const lh = wpos(pol.aL.hand); show(NOTEPAD, lh.x + .2, lh.y + .4, lh.z + .3, -.2, 1);
  orb(L.k, V(p.x + 1.5, 3.4, p.z - 1), null, [13, -.15, .12, 44], [11.5, 0, .1, 44]); sh(p, 16); }, [[0, 'siren', .25], [.3, 'pencil', .45]]);
// 49 «die ganze Stadt:»: subido a una caja, con megáfono, delante de todo el pueblo (el público de espaldas, escuchándole)
shot(62.15, 'F', null, L => { town(L); const p = V(-8, 0, -10); put(pol, p.x, 1.2, p.z, 0); actuar(pol, 0, [[0, { aRx: 1.6, aRz: -.4, aRe: 1.7, aLx: .4, aLz: .3 }]], { T: L.T }); talk(pol, L.T, 62, 63.2, 'talk');
  show(CRATE, p.x, 0, p.z); const rh = wpos(pol.aR.hand); show(MEGA, rh.x, rh.y + .25, rh.z + .4, 0, .7);
  crowdGrid(L, p.x, p.z + 6, 6, 3, 3.6, 3.0, { mode: 'idle', expr: 'neutral', face: V(p.x, 4, p.z), seed: 5, jit: .2 });
  cm([p.x + 2.5, 10.5, p.z + 18], [p.x + 2, 10, p.z + 16.5], L.k); camera.lookAt(p.x, 4.6, p.z); camera.fov = 44; sh(V(p.x, 0, p.z + 6), 20); }, [[0, 'murmur', .45], [.3, 'radio', .3]]);
// 50 «Wer war heute Nacht bei Ihnen?»: primer plano con el megáfono
shot(63.14, 'C', null, L => { town(L); const p = V(-8, 0, -10); put(pol, p.x, 1.2, p.z, 0); actuar(pol, 0, [[0, { aRx: 1.5, aRz: -.45, aRe: 1.6, aLx: .3 }]], { T: L.T }); talk(pol, L.T, 63.1, 64.6, 'shout'); show(CRATE, p.x, 0, p.z);
  const rh = wpos(pol.aR.hand); show(MEGA, rh.x, rh.y + .25, rh.z + .4, 0, .7);
  const h = hp(pol); const sd = rh.x > h.x ? -1 : 1; cm([h.x + sd * 3.2, h.y + .7, h.z + 6.2], [h.x + sd * 2.8, h.y + .6, h.z + 5.5], L.k); camera.lookAt(h.x, h.y - .3, h.z); camera.fov = 42; sh(p, 12); }, [[0, 'radio', .4]]);
// 51 «Und alle gaben dieselbe Antwort:»: el pueblo entero levanta la mano
shot(64.58, 'S', null, L => { town(L); const p = V(-8, 0, -3); crowdGrid(L, p.x, p.z, 6, 4, 3.6, 3.4, { mode: 'wave', face: V(p.x, 4, p.z - 10), seed: 7 });
  cm([p.x - 3, 8, p.z - 11], [p.x + 3, 8, p.z - 11.5], L.k); camera.lookAt(p.x, 3, p.z + 4); camera.fov = 50; sh(V(p.x, 0, p.z + 4), 20); }, [[0, 'cloth', .45], [.4, 'murmur', .4]]);
// 52 «Adrian!»: todos gritan a la vez
shot(66.42, 'C', 'punch', L => { town(L); const p = V(-8, 0, -3); crowdGrid(L, p.x, p.z, 6, 4, 3.6, 3.4, { mode: 'shout', face: V(p.x, 4, p.z - 10), seed: 7 });
  cm([p.x, 3.4, p.z - 7], [p.x, 3.2, p.z - 6.4], L.k); camera.lookAt(p.x, 4.6, p.z + 5); camera.fov = 56; sh(V(p.x, 0, p.z + 4), 20); }, [[0, 'shout_crowd', .65]]);
// 53 «Welcher denn?»: el policía, perdido, con un «?» enorme
shot(67.21, 'Z', null, L => { town(L); const p = V(-8, 0, -10); put(pol, p.x, 1.2, p.z, 0); actuar(pol, 0, [[0, { ...GEST.shrug, headZ: .25 }]], { T: L.T }); talk(pol, L.T, 67.2, 67.9, 'confused'); show(CRATE, p.x, 0, p.z);
  badge('q', '?', W * .72, H * .2, clamp(L.lt / .12), 1, 1); onFace(pol, 4.4, .1, -.3, 40, L.k, 3.9); sh(p, 12); }, [[0, 'boing_metal', .45]]);
// 54 «Weil jeder Adrian heißt,»: travelling por la fila de pechos: ADRIAN, ADRIAN, ADRIAN…
shot(67.93, 'W', null, L => { town(L); const p = V(-8, 0, -3); crowdGrid(L, p.x, p.z, 7, 1, 2.9, 3, { mode: 'idle', expr: 'happy', face: V(p.x, 3, p.z + 20), seed: 9, jit: .05 });
  const x = lerp(p.x - 6, p.x + 4, L.k); cam([x, 3.4, p.z + 6.2], [x + 1.2, 3.0, p.z], 42); sh(p, 16); }, [[0, 'whoosh_soft', .35], [.5, 'murmur', .35]]);
// 55 «konnte niemand sagen, wer es war.»: el policía se rasca la cabeza; todos se encogen de hombros
shot(69.45, 'F', null, L => { town(L); const p = V(-8, 0, 2); put(pol, p.x, 0, p.z, 0); actuar(pol, 0, [[0, { aRx: 2.8, aRz: -.2, aRe: 2.0 + Math.sin(L.T * 14) * .2, aLx: .3, headZ: .2 }]], { T: L.T }); cara(pol, L.T, { expr: 'confused', mouth: 'wavy' });
  crowdAt(L, p.x, p.z, 12, 5, 11, 55, { mode: 'shrug', gap: 1.0 });
  orb(L.k, V(p.x, 3.6, p.z), null, [15, .2, .14, 44], [13, .05, .12, 44]); sh(p, 18); }, [[0, 'hmm', .45], [.5, 'murmur', .35]]);

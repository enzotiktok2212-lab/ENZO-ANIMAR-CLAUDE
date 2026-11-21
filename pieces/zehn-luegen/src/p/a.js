// ===== Planos 1-28 (0 – 47,2 s): la regla, cómo vive el pueblo, el Coleccionista =====
// utilidades de puerta: residente en el umbral (sobre el escalón) y el Coleccionista abajo, mirando a la casa
const inDoor = (ch, Hh, side = 0, lry = 0) => putH(ch, Hh, Hh.dx + side, Hh.F + .95, .45, lry);
const atDoor = (ch, Hh, dist = 4.2, side = 0) => putH(ch, Hh, Hh.dx + side, Hh.F + Math.max(dist, 3.6), 0, PI);
const warmAt = (p, k = 70) => { WARM.position.copy(p); WARM.intensity = k; };
// gente andando por la calle (extras con contador)
function walkers(L, list, z0, n0 = 10, o = {}) { list.forEach(([c, x, dz, sp, ry], i) => { caminar(c, L.lt, { x, z: z0 + dz, ry: ry ?? 0, speed: sp ?? 2.6, T: L.T + i }); cara(c, L.T + i * 1.3, { expr: o.expr ?? 'neutral' }); if (o.cnt !== false) cnt(c, typeof n0 === 'function' ? n0(i) : n0, clamp(L.lt * 3 - i * .15), { sc: .7 }); }); }

// 1 · gancho: la calle nevada, todos con su contador de 10 mentiras; yo en el centro
shot(0, 'Z', null, L => { street(); const z0 = -40;
  const me = caminar(ich, L.lt, { x: -1.6, z: z0, ry: 0, speed: 2.4, T: L.T }); cara(ich, L.T, { expr: 'happy' }); cnt(ich, 10, clamp(L.lt * 3), { sc: .7 });
  walkers(L, [[LE[0], 1.9, -.4, 2.4], [LE[4], -3.4, -5.6, 2.4], [LE[6], .4, -9.0, 2.4]], z0, 10, { expr: 'smile' });
  cm([0, 7.6, me.z + 19, 0, 2.6, me.z - 3, 50], [0, 7.4, me.z + 17.5, 0, 2.6, me.z - 3, 48], L.k, easeOut); sh(V(0, 0, me.z), 40); }, [[.05, 'steps_snow', .6], [.4, 'pling', .5], [1.2, 'wind', .3]]);
// 1b · «…kannst du nur zehnmal im Jahr lügen.»: más cerca, todos alrededor de mí, cada uno con su 10
shot(.74, 'W', null, L => { street(); const z0 = -30, X = 9.2;
  const me = put(ich, X, .3, z0, -PI / 2); actuar(me, L.lt, [[0, {}], [.5, { aRx: 2.6, aRz: .3, aRe: .2 }, { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'happy', mouth: 'open_smile' }); cnt(me, 10, clamp(L.lt * 4), { sc: .9 });
  [[LE[5], X + .4, z0 + 3.1, -PI / 2 - .3], [LE[1], X + .6, z0 - 3.2, -PI / 2 + .3], [LE[7], X + 2.8, z0 + 1.6, -PI / 2]].forEach(([c, x, z, ry], i) => { put(c, x, .3, z, ry); actuar(c, L.lt, [[0, {}], [.3 + i * .12, 'wave', { dur: .3 }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'smile' }); cnt(c, 10, clamp(L.lt * 4 - .3 - i * .25), { sc: .8 }); });
  cm([-9.5, 2.6, z0 + 4.5, X, 2.4, z0, 46], [-8.5, 2.8, z0 - 2.0, X, 2.4, z0, 44], L.k); sh(V(X, 0, z0), 30); }, [[.05, 'pop', .5], [.4, 'pling', .45], [.8, 'pling', .45], [1.4, 'steps_snow', .4]]);
// 2 · «danach kommt nur noch die Wahrheit»: un vecino con el contador a 0; la verdad se le escapa (WAHRHEIT)
shot(2.81, 'C', null, L => { street(); const c = put(LE[1], 1.2, 0, -58, -.35);
  actuar(c, L.lt, [[0, { aLx: .3, aRx: .3 }], [.8, { ...GEST.hands_face, aLx: 1.7, aRx: 1.7 }, { dur: .4 }]], { T: L.T });
  cara(c, L.T, { expr: L.lt < .8 ? 'worried' : 'shock', mouth: L.lt < .8 ? 'frown' : 'scream' }); cnt(c, 0, 1, { sc: .75 }); badge('big', 'WAHRHEIT!', W / 2, H * .2, (L.lt - .9) * 2.5, 1, .9);
  onFace(c, 8.5, -.6, -3.2, 44, L.k, 7.2); sh(V(0, 0, -58), 30); }, [[.1, 'hmm', .5], [.9, 'magic_hit', .6]]);
// 3 · Año Nuevo: fuegos sobre la plaza, todos celebran y su contador salta a 10
shot(5.15, 'F', null, L => { street(); clockAt(0, 0); FWON = Object.assign(V(0, 0, -320), { spread: 140, h: 70 });
  const P = [[LE[0], -6, -244], [LE[5], -2.2, -242], [KI[0], 1.6, -241], [LE[4], 5.4, -243.5], [LE[2], -9, -248], [LE[6], 8.6, -248], [KI[2], -4, -239.5], [LE[1], 3.6, -238.6]];
  P.forEach(([c, x, z], i) => { put(c, x, 0, z, 0); actuar(c, L.lt, [[0, GEST.cheer]], { T: L.T + i, extra: { crouch: Math.abs(Math.sin(L.T * 6 + i)) * .08 } }); cara(c, L.T + i, { expr: 'joy', eyes: 'happy', mouth: Math.sin(L.T * 9 + i) > 0 ? 'laugh' : 'open_smile' }); const k = clamp((L.lt - .3 - i * .07) * 4); cnt(c, k < .5 ? 0 : 10, 1, { sc: .55, pop: L.lt - .3 - i * .07 - .12 }); });
  badge('tag', 'NEUJAHR', W / 2, H * .1, L.lt * 3);
  cm([0, 3.6, -222, 0, 9, -262, 52], [0, 4.4, -226, 0, 10, -262, 50], L.k); sh(V(0, 0, -244), 40); }, [[.05, 'firework', .8], [.4, 'cheer', .55], [.9, 'firework', .6], [1.5, 'party_horn', .5]]);
// 4 · «wer dich etwas fragt»: dos vecinas en la acera; una pregunta
shot(7.54, 'W', null, L => { street(); const a = put(LE[2], 9.2, .3, -27.2, PI - .5), b = put(LE[7], 9.0, .3, -31.6, -.5);
  actuar(a, L.lt, [[0, { aRx: 1.0, aRe: .9, aRz: -.1, lean: .08 }]], { T: L.T }); talk(a, L.T, 7.5, 8.64, 'talk'); actuar(b, L.lt, [[0, GEST.listen]], { T: L.T }); cara(b, L.T, { expr: 'worried' });
  cnt(a, 4, 1, { sc: .55 }); cnt(b, 3, 1, { sc: .55 }); badge3('q', '?', hp(a).add(V(0, 2.2, 0)), L.lt * 3, .8);
  cm([-2.6, 4.4, -26.6, 9.1, 4.0, -29.4, 50], [-1.8, 4.2, -27.4, 9.1, 4.0, -29.4, 48], L.k); sh(V(9, 0, -29), 25); }, [[.05, 'steps_snow', .5], [.3, 'hmm', .4]]);
// 5 · «bekommt eine Antwort»: ella contesta (y se le nota que no quiere)
shot(8.64, 'C', null, L => { street(); const b = put(LE[7], 8.8, .3, -31.4, .15); actuar(b, L.lt, [[0, { aLx: .6, aLe: 1.2, aRx: .3 }]], { T: L.T }); talk(b, L.T, 8.6, 9.64, 'worried'); cnt(b, 3, 1, { sc: .6 });
  onFace(b, 7.2, -.4, 1.8, 42, L.k, 6.4); sh(V(9, 0, -31), 25); }, [[.05, 'breath', .4], [.5, 'gulp', .4]]);
// 6 · «und sind deine Lügen aufgebraucht»: el contador de un vecino baja hasta 0; suda
shot(9.64, 'S', null, L => { street(); const c = put(LE[4], -1, 0, -88, .25); actuar(c, L.lt, [[0, { ...GEST.hug_self }]], { T: L.T, extra: shiver(L.T, .8) }); cara(c, L.T, { expr: 'scared' }); sweat(c, L.T);
  cntDrop(c, L.lt, 2, [.35, .9], { sc: .75 }); onFace(c, 9, -.2, -2.4, 44, L.k, 7.4); sh(V(0, 0, -88), 30); }, [[.35, 'tick_down', .6], [.9, 'tick_down', .6], [1.1, 'shiver', .4]]);
// 7 · «ist diese Antwort immer ehrlich»: se tapa la boca, pero sale la verdad
shot(11.16, 'C', null, L => { street(); const c = put(LE[4], -1, 0, -88, .25);
  actuar(c, L.lt, [[0, { ...GEST.hands_face, aLx: 1.9, aRx: 1.9, aLe: 2.4, aRe: 2.4 }], [.7, { aLx: 1.0, aLz: .9, aRx: 1.0, aRz: .9, aLe: .8, aRe: .8, lean: -.12, headX: -.2 }, { dur: .25 }]], { T: L.T });
  cara(c, L.T, { expr: L.lt < .7 ? 'worried' : 'shock', mouth: L.lt < .7 ? 'wavy' : 'talk_wide' }); cnt(c, 0, 1, { sc: .7 }); badge('green', 'EHRLICH!', W / 2, H * .2, (L.lt - .75) * 2.5, 1, .85);
  onFace(c, 7.8, -.5, 2.2, 44, L.k, 7); sh(V(0, 0, -88), 30); }, [[.1, 'gulp', .5], [.75, 'pling', .55]]);
// 8 · «Wir Kinder sind schon im Januar pleite»: cuatro niños con los bolsillos vacíos y el contador a 0 (JANUAR)
shot(12.91, 'W', null, L => { street(); const X = [-4.2, -1.4, 1.4, 4.2];
  KI.forEach((c, i) => { put(c, X[i], 0, -120 + Math.abs(X[i]) * .3, -X[i] * .05); actuar(c, L.lt, [[0, { ...GEST.shrug, headZ: (i % 2 ? -.2 : .2) }]], { T: L.T + i }); cara(c, L.T + i, { expr: i % 2 ? 'sad' : 'worried' }); cnt(c, 0, clamp(L.lt * 3 - i * .2), { sc: .5 }); });
  badge('tag', 'JANUAR', W / 2, H * .12, L.lt * 3);
  cm([0, 3.4, -100.5, 0, 2.6, -120, 50], [0, 3.0, -102.5, 0, 2.6, -120, 50], L.k); sh(V(0, 0, -120), 25); }, [[.05, 'wind', .45], [.6, 'sigh_kid', .5], [1.2, 'coin_flip', .3]]);
// 9 · «Ich hab Hausaufgaben gemacht.»: cocina, cuaderno en blanco; la madre mira; su contador baja 1 -> 0
shot(14.81, 'Z', null, L => { use('KU'); inside(.85, 40); const c = put(KI[1], KX - 2.4, 0, 5.4, PI), m = put(LE[5], KX - 5.6, 0, 8.4, PI - .4);
  applyPose(c, { lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, hipY: 1.9, aLx: .9, aRx: .9, aLe: .6, aRe: .6 }); c.root.position.y = .9; talk(c, L.T, 14.8, 16.1, 'smile');
  actuar(m, L.lt, [[0, GEST.cross]], { T: L.T }); cara(m, L.T, { expr: 'sus' }); cntDrop(c, L.lt, 1, [.75], { sc: .6 });
  cm([KX - 2.6, 5.4, -4.6, KX - 2.8, 4.4, 6.0, 48], [KX - 2.6, 5.2, -3.8, KX - 2.8, 4.4, 6.0, 46], L.k); sh(V(KX, 0, 3), 20); }, [[.05, 'pages', .5], [.75, 'tick_down', .6]]);
// 10 · «Ich war's nicht.»: el jarrón roto, el balón; manos a la espalda
shot(16.14, 'C', null, L => { use('WZ'); inside(.8, 40); WZ.VASE.visible = false; WZ.SHARDS.visible = true; const c = put(KI[2], WX + 10.6, 0, 9.2, -.5);
  actuar(c, L.lt, [[0, { aLx: -.5, aRx: -.5, aLz: -.1, aRz: -.1, aLe: .9, aRe: .9, headZ: .15, lean: -.04 }]], { T: L.T }); cara(c, L.T, { expr: 'smile', eyes: L.lt % .6 < .3 ? 'side_l' : 'side_r', mouth: 'smile' }); cntDrop(c, L.lt, 1, [.45], { sc: .6 });
  cm([WX + 12.0, 3.0, 17.2, WX + 11.0, 2.6, 8.4, 50], [WX + 12.4, 2.8, 16.4, WX + 11.0, 2.6, 8.4, 50], L.k); sh(V(WX + 12, 0, 7), 20); }, [[.02, 'porcelain_break', .55], [.45, 'tick_down', .6], [.6, 'whistle_inno', .4]]);
// 11 · «Ich bin gar nicht müde.»: en la cama con ojeras enormes, bostezando
shot(17.06, 'S', null, L => { use('KZ'); inside(.55, 25); KZ.ZL.intensity = 30; KZ.NL.intensity = 70; const c = put(KI[3], ZX - 5, 2.6, -6.5, 0);
  applyPose(c, { lLx: 1.55, lRx: 1.55, lLk: .1, lRk: .1, hipY: 1.2, aLx: .3, aRx: .3, headX: Math.sin(L.T * 3) * .08 }); cara(c, L.T, { expr: 'sleepy', eyes: 'half', mouth: L.lt > .5 && L.lt < .95 ? 'yawn' : 'smile', bags: 1 }); cntDrop(c, L.lt, 1, [.3], { sc: .6 });
  cm([ZX - 4.4, 6.6, 4.4, ZX - 5, 5.4, -5.6, 46], [ZX - 4.6, 6.4, 3.4, ZX - 5, 5.4, -5.6, 44], L.k); sh(V(ZX - 5, 0, -5), 20); }, [[.3, 'tick_down', .6], [.5, 'yawn_f', .5]]);
// 12 · «Ab Februar…»: la madre con los brazos cruzados y el niño sin mentiras (FEBRUAR)
shot(18.15, 'W', null, L => { use('KU'); inside(.85, 40); const c = put(KI[0], KX - 1.6, 0, 8.4, 0), m = put(LE[7], KX + 1.7, 0, 8.6, 0);
  m.root.rotation.y = -.55; c.root.rotation.y = .55;
  actuar(m, L.lt, [[0, GEST.cross]], { T: L.T }); cara(m, L.T, { expr: 'smug' }); actuar(c, L.lt, [[0, GEST.slump]], { T: L.T }); cara(c, L.T, { expr: 'sad' }); cnt(c, 0, 1, { sc: .55 }); cnt(m, 6, 1, { sc: .55 });
  badge('tag', 'FEBRUAR', W / 2, H * .12, L.lt * 3);
  cm([KX, 4.4, 23.4, KX, 3.6, 8.4, 46], [KX, 4.2, 22.4, KX, 3.6, 8.4, 46], L.k); sh(V(KX, 0, 8), 20); }, [[.05, 'pages', .5], [.4, 'clock_tick', .4]]);
// 13 · «…wissen unsere Eltern einfach alles.»: el niño lo confiesa todo de golpe; ella asiente
shot(19.47, 'C', null, L => { use('KU'); inside(.85, 40); const c = put(KI[0], KX - 1.6, 0, 8.4, 0), m = put(LE[7], KX + 1.7, 0, 8.6, 0);
  m.root.rotation.y = faceTo(m.root.position, c.root.position); c.root.rotation.y = faceTo(c.root.position, m.root.position);
  actuar(c, L.lt, [[0, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: .9, aRe: .9, lean: .08 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: kitLips(L.T * 1.7, [[0, 999, 'x']]) || 'talk_wide' }); sweat(c, L.T, 1);
  actuar(m, L.lt, [[0, { ...GEST.cross, headX: Math.max(0, Math.sin(L.T * 7)) * .15 }]], { T: L.T }); cara(m, L.T, { expr: 'smug', eyes: 'half', mouth: 'smirk' }); cnt(c, 0, 1, { sc: .55 });
  onFace(m, 7.2, -.6, -2.2, 44, L.k, 6.2); sh(V(KX, 0, 3), 20); }, [[.1, 'whisper', .4], [.6, 'hmm', .45]]);
// 14 · «Die Erwachsenen dagegen sparen jede Lüge.»: un señor protege su contador dorado como un tesoro
shot(20.85, 'R', null, L => { street(); const c = put(LE[3], -8.8, .3, -66, .6);
  actuar(c, L.lt, [[0, { ...GEST.hug_self, headY: Math.sin(L.T * 2.4) * .5, lean: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: Math.sin(L.T * 2.4) > 0 ? 'side_r' : 'side_l', mouth: 'smirk' }); cnt(c, 10, 1, { gold: true, sc: .8 });
  onFace(c, 9.6, .2, -2.6, 46, L.k, 8); sh(V(-9, 0, -66), 25); }, [[.05, 'ding_soft', .5], [.6, 'sniff', .4], [1.4, 'chain_rattle', .3]]);
// 15 · «Beim Weihnachtsessen sagt keiner…»: la mesa de Navidad, todos callados, contadores dorados
shot(23.01, 'S', null, L => { use('ES'); inside(.7, 35);
  const P = [[LE[0], -5.4, -4.5, PI / 2], [LE[3], -5.4, 0, PI / 2], [LE[6], -5.4, 4.5, PI / 2], [LE[5], 5.4, -4.5, -PI / 2], [LE[1], 5.4, 0, -PI / 2], [LE[7], 5.4, 4.5, -PI / 2]];
  P.forEach(([c, x, z, ry], i) => { put(c, EX + x, 0, z, ry); applyPose(c, { lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, hipY: 2.0, aLx: .9, aRx: .9, aLe: .5, aRe: .5, headX: .15, headY: Math.sin(L.T * 1.3 + i) * .3 }); c.root.position.y = .3; cara(c, L.T + i, { expr: 'bored', eyes: i % 2 ? 'side_l' : 'half', mouth: 'flat' }); cnt(c, 10, clamp(L.lt * 3 - i * .1), { gold: true, sc: .45 }); });
  badge('tag', 'WEIHNACHTEN', W / 2, H * .1, L.lt * 3);
  cm([EX, 21, 25, EX, 2.5, -.5, 46], [EX, 20, 24, EX, 2.5, -.5, 46], L.k); sh(V(EX, 0, 0), 25); }, [[.05, 'bell_far', .5], [.4, 'spoon', .4], [1.0, 'clock_tick', .4], [1.5, 'chew', .3]]);
// 16 · «„Lecker!“, weil es eben nicht lecker ist»: el ganso quemado humea; el abuelo mastica con cara de sufrimiento: «…»
shot(24.85, 'C', null, L => { use('ES'); inside(.7, 35); const c = put(LE[3], EX - 5.4, .3, 0, PI / 2);
  applyPose(c, { lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, hipY: 2.0, aRx: 1.3, aRe: 1.8, aLx: .8, aLe: .5, headZ: Math.sin(L.T * 9) * .04 }); cara(c, L.T, { expr: 'sad', eyes: 'squint', mouth: Math.sin(L.T * 10) > 0 ? 'wavy' : 'grimace' });
  ES.gans.userData.smk.forEach((s, i) => { s.visible = true; const ph = (L.T * .5 + i / 6) % 1; s.position.set(Math.sin(i * 2 + L.T) * .4, 1.4 + ph * 3, Math.cos(i) * .3); s.scale.setScalar(.6 + ph * 1.6); s.material.opacity = .45 * (1 - ph); });
  bubble(c, '…', (L.lt - .5) * 3, 2.0); cnt(c, 10, 1, { gold: true, sc: .55 });
  cm([EX + 4.6, 8.2, 3.2, EX, 4.4, 0, 46], [EX + 2.2, 6.6, 1.2, EX - 5.2, 5.8, 0, 44], L.k, easeInOut); sh(V(EX, 0, 0), 20); }, [[.1, 'pan_sizzle', .4], [.6, 'chew', .5], [1.2, 'gulp', .5]]);
// 17 · «Und wieso das Ganze? Wegen dem…»: la calle se vacía, la gente entra deprisa y cierra puertas
shot(26.55, 'W', null, L => { street(); const z0 = -14;
  [[LE[6], 1.6, 0, PI / 2 - .3], [KI[1], -2.2, -5, -PI / 2 + .3], [LE[2], 2.8, -11, PI / 2 - .2]].forEach(([c, x, dz, ry], i) => { caminar(c, L.lt, { x, z: z0 + dz, ry, speed: 4.2, run: true, T: L.T + i }); cara(c, L.T, { expr: 'scared' }); });
  GA.R[0].door.rotation.y = 1.3 * (1 - clamp(L.lt * 1.4)); GA.L[2].door.rotation.y = 1.3 * (1 - clamp(L.lt * 1.2 - .2)); badge('q', '?', W / 2, H * .22, L.lt * 3, 1, 1.1);
  cm([0, 5.4, 6, 0, 3.6, -22, 52], [0, 5.8, 4.6, 0, 3.6, -22, 52], L.k); sh(V(0, 0, -14), 35); }, [[.05, 'crowd_run', .5], [.7, 'door_slam', .55], [1.1, 'door_slam', .45]]);
// 18 · «…dem Sammler, der jeden Silvesterabend kommt.» (zoom lento): avanza por la calle vacía entre la nieve, fuegos detrás
shot(27.98, 'C', 'slow', L => { street(1.2); FWON = Object.assign(V(0, 0, -300), { spread: 160, h: 80 }); scene.fog.density = .003;
  const r = caminar(sam, L.lt, { x: 0, z: -106, ry: 0, speed: 2.0, T: L.T, stride: 1.2 }); grin(sam, L.T); kofHand(sam);
  badge('tag', 'SILVESTER', W / 2, H * .1, (L.lt - .2) * 3);
  cm([0, 2.2, r.z + 22, 0, 6, r.z, 46], [0, 2.6, r.z + 17, 0, 6.6, r.z, 44], L.k); sh(V(0, 0, r.z), 40); }, [[.05, 'firework', .5], [.3, 'steps_snow', .6], [1.2, 'wind', .4]]);
// 19 · «Riesig, immer am Lächeln»: contrapicado: enorme, sonrisa fija
shot(30.32, 'Z', null, L => { street(); const c = put(sam, 0, 0, -84, 0); actuar(c, L.lt, [[0, { aRx: .15, headX: .25 }]], { T: L.T }); grin(c, L.T); kofHand(c);
  cm([1.8, 1.2, -76.4, 0, 8.4, -84, 54], [1.2, 1.4, -78.2, 0, 8.8, -84, 50], L.k); sh(V(0, 0, -84), 30); }, [[.05, 'steps_heavy', .6], [.5, 'creepy_ting', .5]]);
// 20 · «in der Hand ein schwarzer Koffer»: el maletín balanceándose al andar (cámara al lado, a la altura de la mano)
shot(31.84, 'S', null, L => { street(); const r = caminar(sam, L.lt, { x: 0, z: -80, ry: 0, speed: 2.0, T: L.T, stride: 1.2 }); grin(sam, L.T); kofHand(sam);
  const kp = wpos(KOF.g); cam([kp.x + 8.4, 2.2, kp.z + 4.6], [kp.x, 2.4, kp.z], 48); sh(V(0, 0, r.z), 25); }, [[.05, 'briefcase', .6], [.7, 'steps_heavy', .5], [1.2, 'chain_rattle', .3]]);
// 21 · «Er klingelt an jedem Haus»: el dedo enguantado aprieta el timbre
shot(33.43, 'W', null, L => { street(); const Hh = GA.R[2]; const c = putH(sam, Hh, Hh.dx + .05, Hh.F + 2.4, 0, PI); const pr = clamp((L.lt - .3) * 4) * (L.lt < .8 ? 1 : 0);
  actuar(c, L.lt, [[0, { aLx: .3 }], [.15, { aLx: 1.25, aLz: .05, aLe: .3, lean: .16 }, { dur: .2 }]], { T: L.T }); grin(c, L.T); kofHand(c); Hh.btn.material.emissiveIntensity = .8 + pr * 3;
  camH(Hh, [Hh.dx + 12, 6.0, Hh.F + 8], [Hh.dx + 1.4, 3.8, Hh.F + 1.4], 34); warmAt(LH(Hh, Hh.dx, 4, Hh.F + 2)); sh(LH(Hh, Hh.dx, 0, Hh.F), 15); }, [[.32, 'door_bell', .8]]);
// 22 · «und fragt nur eins:»: se agacha hacia la puerta abierta (desde dentro, por detrás de la vecina)
shot(34.53, 'C', null, L => { street(); const Hh = GA.R[2]; Hh.door.rotation.y = 1.4; const c = atDoor(sam, Hh, 4.2, -1.6), v = inDoor(LE[7], Hh, .3, 0);
  actuar(c, L.lt, [[0, { lean: .32, headX: .2, aRx: .2 }]], { T: L.T }); grin(c, L.T); kofHand(c); applyPose(v, { ...GEST.shrug }); cara(v, L.T, { expr: 'worried' });
  camH(Hh, [Hh.dx + 8, 10.5, Hh.F + 17], [Hh.dx, 4.6, Hh.F + 2.2], 32); warmAt(LH(Hh, Hh.dx, 4, Hh.F + 1)); sh(LH(Hh, Hh.dx, 0, Hh.F), 15); }, [[.05, 'door_creak', .55], [.6, 'creepy_ting', .4]]);
// 23 · «Was ist Ihnen hier am wertvollsten?»: él, en contrapicado, preguntando con la sonrisa enorme
shot(35.88, 'Z', null, L => { street(); const Hh = GA.R[2]; Hh.door.rotation.y = 1.4; const c = atDoor(sam, Hh, 6.4, 0);
  actuar(c, L.lt, [[0, { lean: .06, headX: .25, aLx: .9, aLe: 1.3, aLz: .1 }]], { T: L.T }); talk(c, L.T, 35.8, 37.6, 'grin', { eyes: 'happy' }); kofHand(c);
  const h = hp(c); const f = LH(Hh, Hh.dx + .8, 0, Hh.F + 1.3); cam([f.x, 5.0, f.z], [h.x, h.y + .2, h.z], 50); warmAt(LH(Hh, Hh.dx, 5, Hh.F + 2.4), 30); sh(LH(Hh, Hh.dx, 0, Hh.F), 15); }, [[.1, 'whisper', .4], [1.2, 'creepy_ting', .45]]);
// 24 · «Und weil fast keiner mehr eine Lüge hat»: la vecina, contador a 0, aterrada
shot(37.58, 'S', null, L => { street(); const Hh = GA.R[2]; Hh.door.rotation.y = 1.4; const v = inDoor(LE[7], Hh, 0, 0);
  actuar(v, L.lt, [[0, { ...GEST.hands_face, aLx: 1.7, aRx: 1.7 }]], { T: L.T, extra: shiver(L.T) }); cara(v, L.T, { expr: 'scared' }); sweat(v, L.T); cnt(v, 0, 1, { sc: .7 });
  onFace(v, 7.6, -.3, 1.6, 44, L.k, 6.6); warmAt(hp(v).add(V(0, 2, 0)), 50); sh(LH(Hh, Hh.dx, 0, Hh.F), 15); }, [[.05, 'heartbeat', .6], [.9, 'gasp_old', .5]]);
// 25 · «sagen alle die Wahrheit.»: el panadero confiesa: su violín
shot(39.52, 'W', null, L => { street(); const Hh = BAKH; Hh.door.rotation.y = 1.4; const c = inDoor(bk, Hh, 0, 0);
  actuar(c, L.lt, [[0, { aLx: .9, aLe: 1.0, aRx: .9, aRe: 1.0, aLz: .3, aRz: .3, headX: .2 }]], { T: L.T }); talk(c, L.T, 39.5, 40.7, 'sad'); cnt(c, 0, 1, { sc: .6 }); bubble(c, 'Meine Geige…', (L.lt - .2) * 3, 1.6);
  onFace(c, 9.5, .2, -2.4, 44, L.k, 8.6); warmAt(hp(c).add(V(0, 2, 0)), 50); sh(LH(Hh, Hh.dx, 0, Hh.F), 15); }, [[.05, 'sigh', .5], [.6, 'strings', .45]]);
// 26 · «Klick, der Koffer schnappt zu.»: el violín vuela al maletín y la tapa se cierra de golpe
shot(40.69, 'C', null, L => { street(); const Hh = BAKH; const base = LH(Hh, Hh.dx, 0, Hh.F + 3.2);
  const k = kofAt(base.x, 2.0, base.z, Hh.ry, 1.1); const sh_ = clamp((L.lt - .25) / .12); k.open(1 - sh_);
  const fly = clamp(L.lt / .3), g0 = LH(Hh, Hh.dx, 4, Hh.F + .5); if (fly < 1) show(GEIGE, lerp(g0.x, base.x, fly), lerp(g0.y, 1.4, fly), lerp(g0.z, base.z, fly), L.T * 9, lerp(1, .3, fly));
  if (L.lt > .25 && L.lt < .55) sparks(V(base.x, 1.2, base.z), .25, L.T, 20, .6);
  const c = LH(Hh, Hh.dx + 6.4, 0, Hh.F + 9.6); cam([c.x, 4.4, c.z], [base.x, 1.6, base.z], 40); sh(base, 15); }, [[.05, 'whoosh_soft', .5], [.27, 'lid_click', .9], [.3, 'magic_hit', .5]]);
// 27 · «Was sie gesagt haben, ist weg. Für immer.»: el panadero, con las manos vacías, en la puerta
shot(42.04, 'S', null, L => { street(); const Hh = BAKH; Hh.door.rotation.y = 1.4; const c = inDoor(bk, Hh, 0, 0);
  actuar(c, L.lt, [[0, { aLx: .9, aRx: .9, aLe: .4, aRe: .4, aLz: .2, aRz: .2, headX: .2 }], [1.2, { ...GEST.slump, headX: .22 }, { dur: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', eyes: L.lt > 1.2 ? 'cry' : 'down', mouth: 'frown' });
  camH(Hh, [Hh.dx - 2.4, 4.8, Hh.F + 8.6], [Hh.dx, 4.4, Hh.F], 46); warmAt(hp(c).add(V(0, 2, 0)), 50); sh(LH(Hh, Hh.dx, 0, Hh.F), 18); }, [[.1, 'wind', .45], [1.3, 'sad_tone', .5]]);
// 28 · «Deshalb wird unsere Stadt jedes Jahr ein bisschen leerer.»: vista aérea; casas que se apagan una a una (JEDES JAHR)
shot(44.35, 'Z', null, L => { street(); scene.fog.density = .0022; const order = [GA.L[3], GA.R[4], GA.L[6]]; order.forEach((Hh, i) => houseDark(Hh, clamp((L.lt - .5 - i * .55) * 3)));
  badge('tag', 'JEDES JAHR', W / 2, H * .1, L.lt * 3);
  cm([0, 70, 40, 0, 0, -70, 50], [0, 62, 24, 0, 0, -80, 48], L.k); sh(V(0, 0, -60), 90); }, [[.05, 'wind', .55], [.55, 'switch', .5], [1.1, 'switch', .5], [1.65, 'switch', .5], [2.2, 'sad_tone', .4]]);
COVERS.push({ i: 0, k: .7, cam: () => cam([0, 3.0, -25], [0, 3.4, -40], 48), l2: 'NUR ZEHN LÜGEN IM JAHR' });

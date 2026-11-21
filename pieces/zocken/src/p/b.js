// ---------- b: Malte, mamá, el dackel, las farolas, la carta, el reto, el alcalde (25,59 – 57,05 s) ----------
// 32 «Mein Kumpel Malte sagt:»: Malte en su sofá verde, cascos puestos, jugando
shot(25.59, 'W', null, L => { room('MZ'); VMODE2 = 'game'; gamer(malte, MX, 0, 3.2, PI, L.T, 0, 0, 'joy'); orb(L.k, V(MX, 3.4, 3.2), null, [13, PI + .35, .12, 46], [11.5, PI + .2, .1, 46]); sh(V(MX, 0, 0), 20); }, [[0, 'swipe', .4], [.2, 'button_mash', .5]]);
// 33 «„Digga, in GTA»: primer plano de Malte hablando sin dejar el mando
shot(26.58, 'C', 'punch', L => { room('MZ'); VMODE2 = 'game'; gamer(malte, MX, 0, 3.2, PI, L.T, 0, 0, 'joy'); talk(malte, L.T, 26.58, 28.68, 'smug'); onFace(malte, 6.8, .2, .5, 40, L.k, 6); sh(V(MX, 0, 0), 20); }, [[0, 'thump', .5]]);
// 34 «kannst du Autos klauen.“»: la tele de Malte: el deportivo del juego; Malte al lado, alucinando
shot(27.56, 'Z', null, L => { room('MZ'); VMODE2 = 'game'; gamer(malte, MX, 0, 3.2, PI, L.T, 0, 0, 'joy'); laughF(malte, L.T); cam([MX - 4, 5.2, 7 - L.k], [MX + .5, 5.6, -9.6], 46); badge('tag', 'AUTO GEKLAUT!', W / 2, H * .2, clamp(L.lt / .2)); sh(V(MX, 0, 0), 20); }, [[0, 'swoosh', .4], [.2, 'car_rev', .6], [.6, 'tires', .4]]);
// 35 «Ich sage:»: yo en la puerta del salón de Malte con el balón
shot(28.68, 'S', null, L => { room('MZ'); gamer(malte, MX - 1.5, 0, 3.2, PI, L.T, 0, 0, 'joy'); const me = put(ich, MX + 7, 0, 1, PI + .4); ballUnder(me); talk(me, L.T, 28.68, 29.4, 'smug');
  onFace(me, 8.6, 0, .6, 42, L.k, 7.6); sh(V(MX, 0, 0), 20); }, [[0, 'swipe', .4], [.2, 'door', .4]]);
// 36 «„Im Fußball klau ich dir den Ball.“»: en la calle, le robo el balón a Malte de un caño
shot(29.46, 'W', null, L => { street(); const m = put(malte, -1.6, 0, 0, PI / 2); const me = put(ich, 2.6, 0, .4, -PI / 2); applyPose(m, { aLx: .6, aRx: .6, aLz: .3, aRz: .3, headX: .45 }); cara(m, L.T, { expr: 'shock', mouth: 'o' });
  const ts = [29.7, 30.1, 30.5]; trick(me, BALL, L.T, ts, ['step', 'roll', 'elastico']); talk(me, L.T, 29.46, 30.92, 'smug'); orb(L.k, V(2.4, 2.8, 0), null, [12, .1, .1, 46], [10.5, -.15, .08, 46]); sh(V(2, 0, 0), 30); },
  [[0, 'swipe', .4], [.24, 'kick', .4], [.64, 'kick', .4], [1.0, 'whoosh', .4]]);
// 37 «Mama ruft:»: mamá en la puerta de casa, llamando con la mano
shot(31.16, 'Z', null, L => { street('sunset'); const m = put(mama, -16.6, 0, 37, PI / 2 - .3); actuar(m, L.lt, [[0, 'wave', { dur: .4 }]], { T: L.T }); talk(m, L.T, 31.16, 33.46, 'shout');
  orb(L.k, V(-16.6, 4, 37), null, [11.5, PI / 2 + .2, .1, 44], [10, PI / 2 + .05, .1, 44]); sh(V(-16, 0, 37), 30); }, [[0, 'swoosh', .4], [.1, 'door', .5]]);
// 38 «„Komm rein, alle sind online!“»: mamá con la tableta: 2.340 vecinos online
shot(31.89, 'C', null, L => { street('sunset'); const m = put(mama, -16.6, 0, 37, PI / 2 - .3); actuar(m, 0, [[0, { aRx: .8, aRz: -.3, aRe: 1.0, aLx: .8, aLz: -.3, aLe: 1.0 }]], { T: L.T }); talk(m, L.T, 31.16, 33.46, 'happy');
  padAt(m, 7, -.2); onFace(m, 7.6, .2, -.6, 40, L.k, 6.8); badge('green', '● 2.340 online', W / 2, H * .18, clamp((L.T - 32.53) / .2), 1, .7); sh(V(-16, 0, 37), 30); }, [[0, 'thump', .4], [.65, 'notif', .5]]);
// 39 «Genau.»: yo asiento, sonrisa de lado
shot(33.46, 'C', 'punch', L => { street('sunset'); const me = put(ich, -10, 0, 34, -PI / 2 + .3); ballUnder(me); applyPose(me, { headX: .25 * Math.sin(L.lt * 18) }); cara(me, L.T, { expr: 'smug', eyes: 'half', mouth: 'smirk' }); onFace(me, 6.6, -.2, .4, 40, L.k, 6); sh(V(-10, 0, 34), 30); }, [[0, 'impact', .5]]);
// 40 «Deshalb bin ich draußen.»: me doy la vuelta y sigo con mis toques en la acera; mamá se lleva las manos a la cabeza
shot(33.97, 'W', null, L => { street('sunset'); const m = put(mama, -16.6, 0, 37, PI / 2 - .3); applyPose(m, GEST.facepalm || GEST.hands_head); cara(m, L.T, { expr: 'sad', mouth: 'frown' });
  const me = put(ich, -9, 0, 30, .3); juggle(me, BALL, L.T, [34.05, 34.35, 34.65, 34.95], { h: 2.2 }); cara(me, L.T, { expr: 'happy', mouth: 'smile' });
  orb(L.k, V(-11, 3.6, 32), null, [16, .55, .12, 48], [14, .4, .1, 48]); sh(V(-12, 0, 32), 30); }, [[0, 'swipe', .4], [.1, 'kick', .3], [.4, 'kick', .3], [.7, 'kick', .3], [.3, 'sigh', .4]]);
// 41 «Sogar mein Dackel»: lanzo un palo; el dackel ni se mueve
shot(35.10, 'S', null, L => { street(); const me = put(ich, 6, 0, 20, -.4); const k = clamp(L.lt / .35); applyPose(me, { aRx: lerp(-.4, 2.6, k < .6 ? 0 : (k - .6) / .4) , aRz: .2, aRe: .3, lean: .1 }); cara(me, L.T, { expr: 'happy', mouth: 'open_smile' });
  if (L.lt > .3) { const q = clamp((L.lt - .3) / .7); const p = arc([5.4, 4.5, 20], [1, .2, 12], 3, q); show(STICK, p.x, p.y, p.z, q * 6, 1); } else { const w = me.aR.hand.getWorldPosition(V()); show(STICK, w.x, w.y, w.z, 0, 1); }
  show(DOG, 3, 0, 22, .6, 1.2); orb(L.k, V(4.6, 2.8, 20), null, [14, .3, .1, 46], [12, .15, .1, 46]); sh(V(4, 0, 18), 30); }, [[0, 'swipe', .4], [.35, 'whoosh', .5], [.9, 'stick_drop', .4]]);
// 42 «holt keine Stöckchen mehr.»: el dackel bosteza tumbado junto al palo
shot(36.22, 'C', null, L => { street(); show(DOG, 1.2, 0, 14, -.3, 1.3); show(STICK, 1, .2, 12, .4, 1); cam([3.6, 3.2, 27 - L.k], [1.2, 1, 14], 42); badge('red', '✗', W / 2, H * .2, clamp(L.lt / .2)); sh(V(1, 0, 13), 20); }, [[0, 'thump', .4], [.2, 'dog_whine', .5]]);
// 43 «Er schaut jetzt Oma beim Zocken zu.»: el dackel sentado junto al sillón de la abuela, mirando la tele
shot(37.02, 'W', null, L => { room('OS'); VMODE2 = 'game'; gamer(oma, OX - 6, 2.3, -3, .5, L.T, 0, 2, 'joy'); show(DOG, OX - 3.6, 0, -1, -.2 + Math.sin(L.T * 3) * .1, 1.1);
  orb(L.k, V(OX - 5, 5, -2), null, [14, .5, .24, 44], [12, .45, .22, 44]); sh(V(OX - 4, 0, -3), 20); }, [[0, 'swipe', .4], [.3, 'game_beep', .5], [.9, 'dog_bark', .3]]);
// 44 «Jeden Abend trainiere ich,»: atardecer; yo contra el muro, sombra alargada
shot(38.77, 'Z', null, L => { kirch('sunset'); const me = put(ich, KX, 0, -3, .1); trick(me, BALL, L.T, [38.9, 39.2, 39.5, 39.8], ['up', 'knee', 'up', 'step']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  orb(L.k, V(KX, 2.4, -3), null, [15, -.5, .14, 48], [13, -.3, .12, 48]); sh(V(KX, 0, -3), 30); }, [[0, 'swoosh', .4], [.13, 'kick', .3], [.43, 'kick', .3], [.73, 'kick', .3]]);
// 45 «bis die Laternen angehen.»: las farolas de la calle se encienden una a una
shot(40.05, 'F', null, L => { street('night'); FILL.intensity = 20; const me = put(ich, 8, 0, -8, -.3); juggle(me, BALL, L.T, [40.1, 40.4, 40.7], { h: 2.2 }); cara(me, L.T, { expr: 'determined', mouth: 'flat' });
  SPOTL.position.set(9.2 - 1.6, 10, -11); SPOTL.target.position.set(8, 0, -8); SPOTL.intensity = L.T > 40.4 ? 70 : 0; const k = easeInOut(L.k); cam([-2, 5, 8 - k * 2], [7, 5, -14], 48); sh(V(8, 0, -8), 30); }, [[0, 'flash', .4], [.35, 'lamp_on', .7]]);
// 46 «Dann trainiere ich unter den Laternen.»: de noche, bajo el cono de luz, sigo con los toques
shot(41.31, 'W', null, L => { street('night'); SPOTL.position.set(7.6, 10, -11); SPOTL.target.position.set(8, 0, -8); SPOTL.intensity = 70; const me = put(ich, 8, 0, -8, .2);
  trick(me, BALL, L.T, [41.45, 41.75, 42.05, 42.35, 42.65], ['up', 'knee', 'up', 'rainbow', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); sweat(me, L.T, 2);
  orb(L.k, V(8, 2.6, -8), null, [12, -.5, .14, 46], [10, -.35, .12, 46]); sh(V(8, 0, -8), 30); }, [[0, 'swipe', .4], [.14, 'kick', .3], [.44, 'kick', .3], [.74, 'kick', .3], [1.04, 'kick', .3]]);
// 47 «Dann kam der Brief.» (zoom lento): el cartero, sin soltar el mando, deja caer una carta roja a mis pies
shot(42.98, 'Z', 'slow', L => { street(); const p = padStand(post, 1.5, 4, -.4, L.T, 0, 3, 'joy'); const me = put(ich, -1.6, 0, 6.6, .9); applyPose(me, GEST.shock); cara(me, L.T, { expr: 'shock', mouth: 'o' }); show(BALL, -2.6, .55, 7.8);
  const q = clamp(L.lt / .6); show(LET, lerp(.4, -.4, q), lerp(4, .1, easeIn(q)), lerp(5, 6.2, q), q * 3, .55); if (q >= 1) LET.rotation.set(-PI / 2, 0, .4);
  orb(L.k, V(0, 3, 5), null, [13, .2, .14, 46], [10, .1, .12, 44]); sh(V(0, 0, 5), 30); }, [[0, 'swoosh', .4], [.4, 'paper', .6]]);
// 48 «Die Nachbarstadt Kickelsdorf»: la carta en mis manos: HERAUSFORDERUNG
shot(44.11, 'C', 'punch', L => { street(); const me = put(ich, 0, 0, 4, 0); applyPose(me, { aLx: 1.3, aRx: 1.3, aLz: -.25, aRz: -.25, aLe: .8, aRe: .8, headX: .35 }); const w = loc(me, 0, 3.3, 1.8); show(LET, w.x, w.y, w.z, 0, .62);
  cara(me, L.T, { expr: 'shock', mouth: 'o' }); cam([0, w.y + 1.4, w.z + 4.2 - L.k * .6], [0, w.y + .4, w.z], 44); sh(V(0, 0, 4), 20); }, [[0, 'impact', .5], [.1, 'paper', .5]]);
// 49 «forderte uns heraus.»: el capitán de Kickelsdorf, con su equipo azul detrás, me señala
shot(45.39, 'W', null, L => { stadium(); const c = put(kap, SX, 0, 0, 0); actuar(c, L.lt, [[0, 'point', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' });
  OPP.slice(0, 4).forEach((o, i) => { put(o, SX + (i - 1.5) * 3, 0, -4 - (i % 2), 0); actuar(o, 0, [[0, 'cross']], { T: L.T + i }); cara(o, L.T + i, { expr: 'smug', mouth: 'smirk' }); });
  orb(L.k, V(SX, 3.6, -1), null, [13, .25, .1, 46], [11, .05, .08, 44]); sh(V(SX, 0, -2), 30); }, [[0, 'swipe', .4], [.2, 'impact', .5]]);
// 50 «Fußball, elf gegen elf.»: marcador 11 : 11 y las dos filas de once
shot(46.62, 'Z', null, L => { stadium(); [ich, ...TEAM].forEach((c, i) => { put(c, SX - 15 + i * 3, 0, 4, PI / 2 + .9); applyPose(c, { aLz: .1, aRz: .1 }); cara(c, L.T + i, { expr: c === ich ? 'determined' : 'worried', mouth: 'flat' }); });
  [kap, ...OPP].forEach((c, i) => { put(c, SX - 15 + i * 3, 0, -4, PI / 2 - .9 + PI * 0); c.root.rotation.y = -PI / 2 + .9 + PI; cara(c, L.T + i, { expr: 'smug', mouth: 'smirk' }); });
  orb(L.k, V(SX, 3, 0), null, [34, PI / 2 + .1, .3, 50], [30, PI / 2 + .02, .26, 50]); score(11, 11, clamp(L.lt / .2)); sh(V(SX, 0, 0), 40); }, [[0, 'swoosh', .4], [.3, 'whistle', .5], [.8, 'impact', .4]]);
// 51 «Der Gewinner bekommt ein nagelneues Stadion.» (zoom lento): el estadio vacío y reluciente, con destellos
shot(48.27, 'W', 'slow', L => { stadium(); confRain(V(SX, 0, 0), L.T, 60, 40, 60, 24); const k = easeInOut(L.k); cam([SX + 30 - k * 10, 36 - k * 10, 60 - k * 14], [SX, 2, -6], 50); badge('gold', 'NEUES STADION', W / 2, H * .17, clamp((L.T - 49.23) / .2), 1, .7); sh(V(SX, 0, 0), 60); }, [[0, 'swipe', .4], [.3, 'sparkle', .6], [1.1, 'cheer', .3]]);
// 52 «Der Bürgermeister geriet in Panik.»: el alcalde se lleva las manos a la cabeza delante del ayuntamiento
shot(50.59, 'C', 'punch', L => { street(); const m = put(mayor, 0, 0, -12, 0); applyPose(m, GEST.hands_head); shiver(m, L.T, .5); cara(m, L.T, { expr: 'shock', mouth: 'scream' }); sweat(m, L.T, 2);
  onFace(m, 8.4, .2, .4, 42, L.k, 7); sh(V(0, 0, -12), 30); }, [[0, 'impact', .6], [.2, 'gasp', .5]]);
// 53 «Er klingelte an jeder Tür:»: el alcalde llama a una puerta y corre a la siguiente
shot(52.33, 'W', null, L => { street(); const m = put(mayor, -13, 0, -6, -PI / 2 + .5); const r = Math.sin(L.lt * 14) > 0; applyPose(m, { aRx: 1.6, aRz: -.1, aRe: r ? .5 : .2, headY: .4 }); cara(m, L.T, { expr: 'worried', mouth: 'frown' }); sweat(m, L.T, 2);
  orb(L.k, V(-13.5, 3.8, -6), null, [13, .7, .12, 46], [12, .6, .1, 46]); sh(V(-13, 0, -6), 30); }, [[0, 'swipe', .4], [.05, 'doorbell', .6], [.6, 'doorbell', .5], [1.0, 'knock', .5]]);
// 54 «„Wer kann Fußball spielen?“»: el alcalde grita en medio de la calle
shot(53.79, 'C', null, L => { street(); const m = put(mayor, 0, 0, 2, 0); actuar(m, 0, [[0, { aLx: 1.2, aRx: 1.2, aLz: .7, aRz: .7, aLe: .2, aRe: .2 }]], { T: L.T }); talk(m, L.T, 53.79, 55.07, 'shout'); show(BALL, 2, .55, 4);
  onFace(m, 7.6, .2, -.6, 40, L.k, 6.6); sh(V(0, 0, 2), 30); }, [[0, 'thump', .4], [.2, 'megaphone', .4]]);
// 55 «Alle hoben die Hand.»: la calle se llena: todos levantan la mano
shot(55.07, 'Z', null, L => { street(); for (let i = 0; i < 22; i++) { const c = EX[i]; const r = RNG(i * 3 + 1); put(c, -9 + (i % 6) * 3.6 + r(), 0, -2 - Math.floor(i / 6) * 3.4 + r(), (r() - .5) * .5); const up = clamp((L.lt - i * .02) / .2);
  applyPose(c, { aRx: lerp(0, 2.9, up), aRz: .15, aRe: .1, aLz: .1 }); cara(c, L.T + i, { expr: 'joy', mouth: 'open_smile' }); }
  const m = put(mayor, 5, 0, 3, PI - .5); cara(m, L.T, { expr: 'happy' }); orb(L.k, V(0, 4, -6), null, [22, -.2, .22, 50], [19, -.3, .2, 48]); sh(V(0, 0, -6), 30); }, [[0, 'swoosh', .4], [.1, 'crowd_cheer', .6]]);
// 56 «Mit dem Controller drin.»: primer plano de las manos en alto… cada una con un mando
shot(56.15, 'C', 'punch', L => { street(); for (let i = 0; i < 12; i++) { const c = EX[i]; const r = RNG(i * 3 + 1); put(c, -6 + (i % 4) * 3.6 + r(), 0, -2 - Math.floor(i / 4) * 3.4 + r(), (r() - .5) * .4); applyPose(c, { aRx: 2.9, aRz: .15, aRe: .1, aLz: .1 });
  const w = c.aR.hand.getWorldPosition(V()); show(PAD[i + 10], w.x, w.y + .3, w.z, 0, .9); PAD[i + 10].rotation.set(-1.2, 0, Math.sin(L.T * 5 + i) * .2); cara(c, L.T + i, { expr: 'joy', mouth: 'open_smile' }); }
  cam([0, 7.4 - L.k * .6, 8], [0, 5.4, -5], 46); sh(V(0, 0, -4), 30); }, [[0, 'impact', .5], [.2, 'button_mash', .5]]);

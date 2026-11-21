// ---------- c: el partido de la Sommerparty: se ríen de mí, 10:0, silencio y «während du gefeiert hast» (28,02 – 49,59 s) ----------
const fans = (T, mode = 'cheer', silent = false) => { CROWD.update(T, mode, silent); };
const FRONT = () => [K[0], XT[3], K[2], XT[1], K[5], XT[0], K[7], XT[2]];
const frontRow = (T, z0 = -6, expr = 'cheer') => FRONT().forEach((c, i) => { put(c, SX - 25.3, 1.6, z0 + i * 2.5, PI / 2); hat(c); if (expr === 'cheer') { actuar(c, 0, [[0, 'cheer']], { T: T + i }); grin(c, T); } else if (expr === 'laugh') { actuar(c, 0, [[0, i % 2 ? 'point' : { aLx: 1.2, aRx: 1.2, aLe: 1.8, aRe: 1.8, lean: .25 }]], { T: T + i }); laughF(c, T + i); } else { actuar(c, 0, [[0, 'shock']], { T: T + i }); cara(c, T, { expr: 'gasp', eyes: 'wide', mouth: 'o' }); } });
// 27 «Dann kam die größte Party des Jahres» (zoom lento): el estadio al atardecer, gradas llenas y fuegos artificiales
shot(28.02, 'Z', 'slow', L => { stadium(); fans(L.T); fireworks(V(SX, 0, -80), L.T, 3, 18); ST.SB.userData.set(0, 0);
  const k = easeInOut(L.k); cam([SX + 34 - k * 8, 40 - k * 14, 52 - k * 12], [SX - 8, 4, -6], 52); sh(V(SX - 10, 0, 0), 60); }, [[0, 'whoosh_up', .5], [.2, 'cheer', .6], [.5, 'firework', .5], [1.3, 'firework', .5]]);
// 28 «das Sommerparty-Fußballspiel»: la pancarta y los rivales calentando con gorro de fiesta
shot(30.33, 'W', null, L => { stadium(); fans(L.T); const kp = put(kap, SX - 11, 0, 1, PI / 2 - .7); hat(kp); const b = juggle(kp, BALL, L.T, [30.4, 30.75, 31.1, 31.45, 31.8, 32.15], { h: 2 }); grin(kp, L.T);
  const c = put(K[3], SX - 13, 0, -4.5, PI / 2 - .2); hat(c); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); grin(c, L.T);
  cam([SX + 2 - L.k * 2, 4.0, 6], [SX - 16, 6.4, -1], 50); sh(V(SX - 14, 0, 0), 40); }, [[0, 'swipe', .4], [.3, 'whistle', .5], [.8, 'cheer', .4]]);
// 29 «Alle kamen mit Partyhüten»: travelling por la grada: todos con gorro de fiesta
shot(32.19, 'S', null, L => { stadium(); fans(L.T); frontRow(L.T, -10); const z = lerp(-12, 4, easeInOut(L.k));
  cam([SX - 13, 5.4, z + 9], [SX - 26, 4.2, z + 2], 48); sh(V(SX - 26, 0, z), 30); }, [[0, 'whoosh_soft', .4], [.2, 'party_horn', .5], [.6, 'party_horn', .4], [.4, 'cheer', .4]]);
// 30 «Als ich aufs Feld lief»: salgo corriendo al campo, travelling de frente
shot(33.64, 'F', null, L => { stadium(); fans(L.T, 'sway'); const r = caminar(ich, L.lt, { x: SX + 4, z: -18, ry: .2, speed: 8, run: true, accel: .1, T: L.T }); cara(ich, L.T, { expr: 'determined', eyes: 'normal', mouth: 'smile' });
  cam([r.x + 1.5, 3.4, r.z + 10], [r.x, 2.6, r.z], 46); sh(V(r.x, 0, r.z), 30); }, [[0, 'flash', .3], [.05, 'steps_run', .6]]);
// 31 «lachten alle»: la primera fila se parte de risa y me señala
shot(34.68, 'C', 'punch', L => { stadium(); fans(L.T, 'sway'); frontRow(L.T, -4, 'laugh');
  cam([SX - 12, 4.6, 3], [SX - 25.3, 4.4, 1.4], 44); sh(V(SX - 25, 0, 2), 30); }, [[0, 'impact_soft', .4], [.05, 'laugh_m', .6], [.3, 'kids_laugh', .5]]);
// 32 «Wer ist denn der Kleine?»: el capitán rival se ríe y me señala desde arriba; yo de espaldas en primer término, pequeño
shot(35.41, 'W', null, L => { stadium(); fans(L.T, 'sway'); const kp = put(kap, SX + 1, 0, -10, PI - .1); hat(kp); actuar(kp, L.lt, [[0, 'idle'], [.1, { aRx: 1.2, aRz: -.1, aRe: .1, headX: .25, lean: -.08 }, { dur: .25 }]], { T: L.T }); talk(kp, L.T, 35.41, 36.67, 'happy', { eyes: 'happy' });
  const me = put(ich, SX + 2.6, 0, -15.6, .3); cara(me, L.T, { expr: 'worried' }); bubble(kp, 'HAHA!', (L.lt - .2) * 3, 2.2);
  cam([SX - .6, 1.8, -22], [SX + .6, 4.8, -10], 46); sh(V(SX, 0, -12), 30); }, [[0, 'swipe', .4], [.2, 'laugh_deep', .5]]);
// 33 «Dann bekam ich den Ball» (zoom lento): el balón llega rodando, lo paro con la suela y levanto la mirada
shot(36.67, 'Z', 'slow', L => { stadium(); fans(L.T, 'sway'); const me = put(ich, SX, 0, -8, 0); const arr = .55; const k = clamp(L.lt / arr);
  if (k < 1) { show(BALL, lerp(SX + 9, SX + .5, easeOut(k)), .55, lerp(-1, -6.6, easeOut(k))); BALL.rotation.set(L.T * 10, 0, 0); applyPose(me, { lRx: .5 * k, lRk: .3 * k, aLz: .3, aRz: .3 }); }
  else { const w = loc(me, .5, .55 / .84, 1.6); show(BALL, w.x, .55, w.z); applyPose(me, { lRx: .35, lRk: .6, crouch: .1, aLz: .4, aRz: .4, headX: lerp(.3, -.05, clamp((L.lt - .7) / .3)) }); }
  cara(me, L.T, { expr: 'determined', eyes: L.lt > .9 ? 'angry' : 'normal', mouth: 'flat' });
  orb(L.k, V(SX, 2.6, -8), null, [12, .25, .08, 46], [9.5, .18, .06, 44]); sh(V(SX, 0, -8), 30); }, [[.0, 'whoosh_soft', .4], [.5, 'kick', .5], [.6, 'murmur', .3]]);
// 34 HUSS: regateo: el primer rival se cae de culo
shot(37.93, 'W', null, L => { stadium(); fans(L.T, 'cheer'); const ts = hussIn(37.9, 38.39); const r = dribble(ich, BALL, L.lt, L.T, { x: SX, z: -8, ry: PI, speed: 11, ts, weave: 1.2 }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  const d = put(K[3], SX - .6, 0, -5.4, PI); hat(d); const f = clamp((L.lt - .2) / .25); applyPose(d, { lean: -1.1 * f, crouch: 1.3 * f, lLx: 1.4 * f, lRx: 1.6 * f, aLx: 1.6 * f, aRx: 1.9 * f, aLz: .5, aRz: .5 }); cara(d, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); if (f > .9) dust(V(SX + .8, 0, -12.5), L.t0 + .45, L.T, 6, .6);
  cam([SX + 15, 3.0, r.z + 1.4], [r.x - .6, 3.4, r.z + 1.2], 50); sh(V(SX, 0, r.z), 30); }, [[0, 'swipe', .3], [.42, 'land', .5]]);
// 35 HUSS: bicicleta y caño al capitán, que se queda girando
shot(38.39, 'R', null, L => { stadium(); fans(L.T, 'cheer'); const ts = hussIn(38.35, 38.84); const r = dribble(ich, BALL, L.lt, L.T, { x: SX - .6, z: -12, ry: PI + .1, speed: 10.5, ts, weave: 1.4 }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  const kp = put(kap, SX - .8, 0, -10.2, PI + L.lt * 7); hat(kp); applyPose(kp, { aLx: 1.0, aRx: 1.0, aLz: .9, aRz: .9, lean: -.2, lLx: .4, lRk: .5 }); cara(kp, L.T, { expr: 'shock', eyes: 'wide', mouth: 'grimace' });
  cam([SX + 15, 3.0, r.z + 1.3], [r.x - .6, 3.4, r.z + 1.1], 50); sh(V(SX, 0, r.z), 30); }, [[0, 'whirl', .4], [.3, 'whoosh', .4]]);
// 36 HUSS: plano cenital: corro hacia la portería dejando atrás a todos
shot(38.84, 'S', null, L => { stadium(); fans(L.T, 'cheer'); const ts = hussIn(38.8, 39.1); const r = dribble(ich, BALL, L.lt, L.T, { x: SX - 1, z: -17, ry: PI, speed: 12, ts }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  [K[3], kap, K[7]].forEach((c, i) => { caminar(c, L.lt, { x: SX - 4 + i * 3, z: -9 - i * 1.5, ry: PI, speed: 6, run: true, T: L.T }); hat(c); cara(c, L.T, { expr: 'shock' }); });
  cam([SX + 3, 15, r.z + 7], [r.x, 0, r.z - 3], 50); sh(V(SX, 0, r.z), 30); }, [[0, 'whoosh_soft', .4], [.05, 'crowd_run', .4]]);
// 37 HUSS: el tiro: el portero se lanza y no llega, la red se hincha
shot(39.05, 'F', 'punch', L => { stadium(); fans(L.T, L.T > 39.6 ? 'cheer' : 'sway'); const kt = 39.30; const me = put(ich, SX - 1, 0, -21, PI); applyPose(me, kickPose(clamp((L.T - (kt - .17)) / .32))); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  const gk = put(K[7], SX, 0, -33.5, 0); hat(gk); const dv = clamp((L.T - kt - .05) / .3); gk.root.position.set(SX - 3.6 * dv, 1.4 * Math.sin(dv * PI), -33.5); gk.root.rotation.set(0, 0, dv * 1.3); applyPose(gk, { aLx: 2.8, aRx: 2.8, aLz: .4, aRz: .2, lLx: .3 }); cara(gk, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  if (L.T < kt) { const w = loc(me, .5, .55 / .84, 1.4); show(BALL, w.x, .55, w.z); } else { const a = loc(me, .5, 1.0, 1.4).toArray(); shotBall(BALL, a, [SX + 3.4, 3.2, -37.6], .6, clamp((L.T - kt) / .26), L.T); ST.G1.userData.bulge(clamp((L.T - kt - .24) / .1)); }
  cam([SX + 4.5, 3.6, -14.5], [SX - .5, 2.2, -30], 48); sh(V(SX, 0, -28), 30); }, [[0, 'flash', .3], [.28, 'net', .7], [.3, 'cheer', .6], [.25, 'whistle', .4]]);
// 38 «Zehn Tore»: el marcador sube a toda velocidad hasta 10:0; yo lo celebro de rodillas
shot(39.72, 'Z', null, L => { stadium(); fans(L.T, 'cheer'); const n = Math.min(10, 1 + Math.floor(L.lt * 14)); ST.SB.userData.set(n, 0, n === 10 ? Math.sin(L.T * 20) : 0);
  const me = put(ich, SX + .5, 0, -27, PI); applyPose(me, { ...GEST.cheer, crouch: 1.0, lLx: 0, lLk: 1.5, lRx: 1.4, lRk: 1.5, hipY: 2.05 }); grin(me, L.T);
  confRain(V(SX, 0, -30), L.T, 60, 24, 16, 20); fireworks(V(SX, 0, -70), L.T, 2, 14);
  cam([SX + 1, 3.2 + L.k * .8, -12 + L.k], [SX, 12.5, -45], 54); sh(V(SX, 0, -30), 40); }, [[0, 'zoom_in', .4], [.05, 'ticks', .6], [.6, 'ding_reveal', .6], [.3, 'cheer', .5]]);
// 39 «Alle von mir»: me señalo con los pulgares el 10 de la camiseta
shot(40.54, 'C', 'punch', L => { stadium(); fans(L.T, 'cheer'); const me = put(ich, SX, 0, -20, .1); applyPose(me, { aLx: 1.0, aLz: -.65, aLe: 2.2, aRx: 1.0, aRz: -.65, aRe: 2.2, lean: -.12, headX: -.08 }); cara(me, L.T, { expr: 'smug', eyes: 'half', mouth: 'smirk' });
  confRain(V(SX, 0, -20), L.T, 40, 14, 10, 12); onFace(me, 9.4, -1.2, .9, 40, L.k, 8.5); sh(V(SX, 0, -20), 30); }, [[0, 'impact', .5], [.2, 'sparkle', .4]]);
// 40 «Die Musik verstummte»: el DJ levanta la aguja con cara de susto; rasgado de disco
shot(41.35, 'R', null, L => { stadium(); fans(L.T, 'still', true); const d = put(dj, SX + 27.6, 0, -6, -PI / 2); actuar(d, L.lt, [[0, { aLx: 1.4, aRx: 1.4, aLe: .9, aRe: .9, lean: .2 }], [.15, { aRx: 2.5, aRz: .4, aRe: .8, aLx: .8, aLz: .9, lean: -.12 }, { dur: .2 }]], { T: L.T }); cara(d, L.T, { expr: 'shock', eyes: 'wide', mouth: 'grimace' });
  ST.DJ.userData.decks.forEach((m, i) => m.rotation.y = L.lt < .15 ? L.T * 8 : 1.2 * 8 + i);
  orb(L.k, V(SX + 26.6, 4.4, -6), null, [15, -PI / 2 + .3, .22, 44], [14, -PI / 2 + .22, .2, 44]); sh(V(SX + 26, 0, -6), 30); }, [[0, 'whirl', .3], [.15, 'record_scratch', .8]]);
// 41 «Die ganze Menge war plötzlich still» (zoom lento): la grada entera con la boca abierta, sin moverse
shot(42.47, 'W', 'slow', L => { stadium(); fans(L.T, 'still', true); frontRow(L.T, -8, 'shock'); TINT = 'rgba(20,30,60,.12)';
  cam([SX - 9 + L.k * 2, 6.4, 1], [SX - 30, 6.6, -1], 46); sh(V(SX - 28, 0, 0), 40); }, [[0, 'swipe', .3], [.3, 'silence_tick', .5], [.9, 'cough', .4]]);
// 42 «Jonas kam zu mir und fragte»: Jonas (con gorro) cruza el campo hacia mí
shot(44.23, 'S', null, L => { stadium(); fans(L.T, 'still', true); const me = put(ich, SX + 1.6, 0, -18.6, -PI / 2 + .35); cara(me, L.T, { expr: 'neutral' }); applyPose(me, { aLz: .1, aRz: .1 });
  caminar(jonas, L.lt, { x: SX - 5.5, z: -19.6, ry: PI / 2 - .25, speed: 3.6, accel: .2, stopAt: 1.0, T: L.T }); hat(jonas); cara(jonas, L.T, { expr: 'gasp', eyes: 'wide', mouth: 'o' });
  orb(L.k, V(SX - .6, 3.0, -19), null, [21, -.05, .1, 46], [19.5, .0, .1, 46]); sh(V(SX, 0, -19), 30); }, [[0, 'whoosh_soft', .4], [.1, 'steps', .5]]);
// 43 «Seit wann bist du so gut?»: Jonas, de cerca, alucinando
shot(45.89, 'C', 'punch', L => { stadium(); fans(L.T, 'still', true); const j = put(jonas, SX - 1.2, 0, -19.4, PI / 2 + .45); hat(j); actuar(j, L.lt, [[0, 'shrug']], { T: L.T }); talk(j, L.T, 45.89, 47.18, 'gasp', { eyes: 'wide' });
  onFace(j, 10, -1, -1.0, 40, L.k, 9); sh(V(SX, 0, -19), 30); }, [[0, 'impact_soft', .4], [.1, 'gasp_f', .3]]);
// 44 «Ich sagte ihm die Wahrheit»: yo, tranquilo, le miro
shot(47.18, 'I', null, L => { stadium(); fans(L.T, 'still', true); const me = put(ich, SX + 2, 0, -18, -PI / 2 - .35); actuar(me, L.lt, [[0, 'idle']], { T: L.T }); talk(me, L.T, 47.18, 48.44, 'neutral');
  onFace(me, 9.6, -1, 1.0, 40, L.k, 9); sh(V(SX, 0, -18), 30); }, [[0, 'iris_pop', .4], [.3, 'wind', .3]]);
// 45 «Während du gefeiert hast»: sonrisa de lado y guiño; golpe de zoom
shot(48.44, 'Z', 'punch', L => { stadium(); fans(L.T, 'still', true); const me = put(ich, SX + 2, 0, -18, -PI / 2 - .35); actuar(me, L.lt, [[0, 'idle'], [.2, { aLx: 1.2, aLz: -.6, aLe: 2.1, headZ: .12 }, { dur: .3 }]], { T: L.T }); talk(me, L.T, 48.44, 49.59, 'smug', { eyes: L.lt > .55 ? 'wink' : 'half' });
  onFace(me, 7.6, -.6, .5, 38, L.k, 6.6); sh(V(SX, 0, -18), 30); }, [[0, 'impact', .5], [.6, 'sparkle', .4]]);

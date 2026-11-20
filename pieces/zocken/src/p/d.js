// ---------- d: diez goles, la victoria, el pueblo juega al fútbol, yo en el sofá (84,55 – 111,6 s) ----------
const goalShot = (L, kt, home, away, lbl) => { stadium(); ST.SB.userData.set(L.T > kt + .25 ? home : home - 1, away); const me = put(ich, SX + 1, 0, 22, 0); const k = clamp((L.T - (kt - .22)) / .4); applyPose(me, kickPose(k));
  const a = loc(me, .5, 1.0, 1.4).toArray(), g = [SX + (home % 2 ? -3 : 3), 2.6, 36.5]; if (L.T < kt) show(BALL, a[0], .55, a[2]); else shotBall(BALL, a, g, .8, clamp((L.T - kt) / .25), L.T);
  ST.G2.userData.bulge(clamp((L.T - kt - .22) / .1) * (1 - clamp((L.T - kt - .5) / .3))); const kp = put(OPP[9], SX + (home % 2 ? 2 : -2), 0, 34, PI); applyPose(kp, { aLx: 2.6, aRx: 2.6, aLz: .6, aRz: .6, crouch: .3, sx: home % 2 ? 1 : -1 }); cara(kp, L.T, { expr: 'shock', mouth: 'o' });
  cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: L.T > kt ? 'grimace' : 'flat' }); score(home, away, clamp((L.T - kt - .25) / .15)); badge('gold', lbl, W / 2, H * .27, clamp((L.T - kt - .25) / .15), 1, .7); sh(V(SX, 0, 26), 30); };
// 87 «Und ich spielte,»: conduzco a toda velocidad por el campo, la grada de pie
shot(84.55, 'W', null, L => { stadium(); tribune(L, 10, 12, 2, 'cheer'); const r = dribble(ich, BALL, L.lt, L.T, { x: SX - 4, z: -10, ry: .2, speed: 10, ts: [84.7, 85.0, 85.3, 85.6], weave: .6 }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  const p = ich.root.position; cam([p.x + 3, 3, p.z + 10], [p.x, 2.4, p.z], 46); sh(V(p.x, 0, p.z), 30); }, [[0, 'swipe', .4], [.15, 'kick', .3], [.45, 'kick', .3], [.75, 'kick', .3], [.3, 'crowd_cheer', .5]]);
// 88 «als hätte ich jeden einzelnen Tag»: recuerdo (sepia): los chutes contra el muro al amanecer
shot(85.64, 'F', null, L => { kirch('sunset'); grade.uniforms.sepia.value = .7; const me = put(ich, KX + 1, 0, 4, PI); const per = .5, ph = (L.lt % per) / per; applyPose(me, kickPose(clamp(ph * 1.6))); const a = loc(me, .5, 1.0, 1.4).toArray(); const q = clamp((ph - .35) / .35); if (q <= 0) show(BALL, a[0], .55, a[2]); else shotBall(BALL, a, [KX + .5, 2.4, -9.4], .3, q, L.T);
  cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); orb(L.k, V(KX, 3, 0), null, [15, .5, .12, 46], [13, .4, .1, 46]); sh(V(KX, 0, -2), 30); }, [[0, 'flash', .5], [.25, 'wall_hit', .4], [.75, 'wall_hit', .4]]);
// 89 «dafür trainiert.»: recuerdo (sepia): bajo la farola, de noche
shot(86.94, 'W', null, L => { street('night'); grade.uniforms.sepia.value = .7; SPOTL.position.set(7.6, 10, -11); SPOTL.target.position.set(8, 0, -8); SPOTL.intensity = 70; const me = put(ich, 8, 0, -8, .2); juggle(me, BALL, L.T, [87, 87.3, 87.6, 87.9, 88.2], { h: 2.2 }); cara(me, L.T, { expr: 'determined', mouth: 'flat' });
  orb(L.k, V(8, 2.6, -8), null, [11, -.3, .14, 46], [10, -.15, .12, 46]); sh(V(8, 0, -8), 30); }, [[0, 'swipe', .4], [.1, 'kick', .3], [.4, 'kick', .3], [.7, 'kick', .3]]);
// 90 «Denn ich hatte nur ein Ziel:» (zoom lento): la portería rival, el portero temblando
shot(88.08, 'Z', 'slow', L => { stadium(); const me = put(ich, SX + 1, 0, 22, 0); applyPose(me, { lRx: -.3, lRk: .5, headX: .1 }); const w = loc(me, -.3, .55 / .84, 1.2); show(BALL, w.x, .55, w.z); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  const kp = put(OPP[9], SX, 0, 34, PI); applyPose(kp, { aLx: .8, aRx: .8, aLz: .6, aRz: .6, crouch: .3 }); shiver(kp, L.T, .6); cara(kp, L.T, { expr: 'worried', mouth: 'wavy' });
  cam([SX + 3, 7, 12 + L.k * 2], [SX, 2, 35], 46); sh(V(SX, 0, 28), 30); }, [[0, 'swoosh', .4], [.3, 'heartbeat', .5]]);
// 91 «Tore.»: el primer chut
shot(89.48, 'C', 'punch', L => { goalShot(L, 89.6, 1, 4, 'TOR!'); orb(L.k, V(SX, 3.4, 28), null, [15, PI - .3, .12, 46], [14, PI - .2, .1, 46]); }, [[0, 'impact', .4], [.12, 'kick', .8], [.4, 'net', .6], [.45, 'crowd_cheer', .6]]);
// 92 «Eins.»
shot(89.74, 'W', null, L => { goalShot(L, 89.7, 1, 4, '1'); orb(L.k, V(SX, 4, 28), null, [16, PI + .6, .12, 46], [15, PI + .5, .12, 46]); }, [[0, 'swipe', .4], [.35, 'crowd_cheer', .5]]);
// 93 «Fünf.»
shot(90.23, 'S', null, L => { goalShot(L, 90.3, 5, 4, '5'); orb(L.k, V(SX, 4, 28), null, [16, PI - .6, .14, 46], [15, PI - .5, .12, 46]); }, [[0, 'swipe', .4], [.07, 'kick', .8], [.35, 'net', .6], [.4, 'crowd_cheer', .6]]);
// 94 «Zehn.»
shot(90.78, 'C', 'punch', L => { goalShot(L, 90.85, 10, 4, '10'); orb(L.k, V(SX, 3, 28), null, [13, PI + .2, .1, 46], [12, PI + .1, .1, 46]); }, [[0, 'impact', .5], [.07, 'kick', .8], [.35, 'net', .7], [.4, 'crowd_cheer', .7]]);
// 95 «Zehn Tore,»: el marcador gigante: 10 : 4, la grada en pie
shot(91.32, 'Z', null, L => { stadium(); ST.SB.userData.set(10, 4); tribune(L, -26, 16, 4, 'cheer'); cam([SX + 3, 9, -24 + L.k * 2], [SX, 13, -52], 46); confRain(V(SX, 0, -40), L.T, 60, 40, 20, 20); sh(V(SX, 0, -40), 40); }, [[0, 'swoosh', .4], [.1, 'crowd_cheer', .8], [.4, 'firework', .5]]);
// 96 «ganz allein.»: yo solo en el área, brazos abiertos; mis compañeros a lo lejos, con los mandos
shot(92.42, 'W', null, L => { stadium(); const me = put(ich, SX, 0, 24, PI); applyPose(me, { aLz: 1.5, aRz: 1.5, aLx: .3, aRx: .3, headX: -.3 }); grin(me, L.T); TEAM.slice(0, 4).forEach((c, i) => padStand(c, SX - 8 + i * 4, 6, PI * 0, L.T, i, 14 + i, 'shock'));
  orb(L.k, V(SX, 3.6, 22), null, [14, PI - .2, .14, 48], [12, PI - .1, .12, 46]); sh(V(SX, 0, 20), 30); }, [[0, 'swipe', .4], [.2, 'cheer', .5]]);
// 97 «Ihr Torwart wollte ein Autogramm.»: el portero azul me tiende papel y bolígrafo
shot(93.22, 'Z', null, L => { stadium(); const kp = put(OPP[9], SX + 1.6, 0, 30, -PI / 2 + .3); actuar(kp, 0, [[0, { aRx: 1.5, aRz: -.1, aRe: .2, aLx: 1.2, aLe: .4 }]], { T: L.T }); cara(kp, L.T, { expr: 'happy', mouth: 'open_smile' }); const w = kp.aR.hand.getWorldPosition(V()); show(AUTO, w.x - .3, w.y + .4, w.z, PI, .9);
  const me = put(ich, SX - 1.8, 0, 30.4, PI / 2 + .3); applyPose(me, { aRx: 1.4, aRe: .6 }); const pw = me.aR.hand.getWorldPosition(V()); show(PEN, pw.x, pw.y, pw.z, 0, 1); cara(me, L.T, { expr: 'smug', mouth: 'smirk' });
  orb(L.k, V(SX, 4, 30), null, [11, PI - .2, .1, 44], [10, PI - .05, .08, 44]); sh(V(SX, 0, 30), 30); }, [[0, 'swoosh', .4], [.4, 'pen', .5]]);
// 98 «Wir gewannen das Stadion.»: fuegos artificiales y confeti sobre el estadio; todos saltan
shot(94.81, 'W', null, L => { stadium(); tribune(L, -4, 36, 4, 'cheer'); fireworks(V(SX, 0, -20), L.T, 3, 16); confRain(V(SX - 20, 0, -4), L.T, 70, 20, 40, 20); const k = easeInOut(L.k); cam([SX + 18, 18 - k * 4, 34 - k * 6], [SX - 24, 6, -4], 50); badge('gold', 'NEUES STADION!', W / 2, H * .16, clamp(L.lt / .2), 1, .75); sh(V(SX - 10, 0, 0), 50); },
  [[0, 'swipe', .4], [.1, 'firework', .7], [.2, 'crowd_cheer', .8], [.8, 'firework', .5]]);
// 99 «Der Bürgermeister hob mich hoch.»: el alcalde me levanta en brazos, confeti
shot(96.28, 'C', 'punch', L => { stadium(); const m = put(mayor, SX, 0, 6, 0); applyPose(m, { aLx: 2.9, aRx: 2.9, aLz: .3, aRz: .3, aLe: .2, aRe: .2, crouch: .1 }); laughF(m, L.T); const up = easeOut(clamp(L.lt / .4));
  const me = put(ich, SX, lerp(1.5, 4.2, up) + Math.sin(L.T * 6) * .2, 6.2, 0); applyPose(me, { aLx: 2.9, aRx: 2.9, aLz: .4, aRz: .4, lLk: .5, lRk: .5 }); grin(me, L.T); confetti(V(SX, 4, 6), L.t0 + .3, L.T, 70);
  orb(L.k, V(SX, 6.5, 6), null, [16, .25, .05, 48], [14, .15, .04, 48]); sh(V(SX, 0, 6), 30); }, [[0, 'impact', .5], [.2, 'cheer', .6], [.3, 'confetti', .5]]);
// 100 «Malte weinte.»: Malte, lágrimas y mando en la mano
shot(97.73, 'W', null, L => { stadium(); const m = padStand(malte, SX + 4, 2, -.3, L.T, 0, 0, 'sad'); cara(m, L.T, { expr: 'sad', eyes: 'cry', mouth: Math.sin(L.T * 9) > 0 ? 'wavy' : 'frown' }); tearsF(m, L.T); shiver(m, L.T, .3);
  onFace(m, 7.4, 0, .5, 40, L.k, 6.6); sh(V(SX + 4, 0, 2), 30); }, [[0, 'swipe', .4], [.1, 'sob', .6]]);
// 101 «Oma legte beide Controller weg.»: la abuela deja los dos mandos en el césped y se arremanga
shot(98.61, 'Z', null, L => { stadium(); const o = put(oma, SX - 4, 0, 4, .2); const k = clamp(L.lt / .7); applyPose(o, { lean: lerp(0, .5, Math.sin(k * PI)), crouch: lerp(0, .4, Math.sin(k * PI)), aLx: lerp(1.1, .3, k), aRx: lerp(1.1, .3, k), aLz: .2, aRz: .2 }); cara(o, L.T, { expr: 'determined', mouth: 'smirk' });
  [0, 1].forEach(j => { show(PAD[2 + j * 30], SX - 4.8 + j * 1.6, k > .6 ? .2 : lerp(2.6, .2, k / .6), 5.4, .2, .84); }); orb(L.k, V(SX - 4, 3, 4), null, [10, .5, .12, 44], [9, .3, .12, 44]); sh(V(SX - 4, 0, 4), 30); }, [[0, 'swoosh', .4], [.45, 'plastic_drop', .6]]);
// 102 «Jetzt spielt die ganze Stadt Fußball.»: la calle llena de vecinos jugando al fútbol
shot(100.30, 'W', null, L => { street(); OR.FEST.visible = true; for (let i = 0; i < 18; i++) { const c = EX[i]; const r = RNG(i * 5 + 2); const x = -8 + (i % 6) * 3.2 + r(), z = 6 - Math.floor(i / 6) * 6 + r(); put(c, x, 0, z, (r() - .5) * 2); if (i % 3 === 0) { applyPose(c, runP(L.T, i)); } else { applyPose(c, cheerP(L.T, i)); } cara(c, L.T + i, { expr: 'joy', mouth: 'open_smile' }); }
  show(BALL, Math.sin(L.T * 2) * 4, .55 + Math.abs(Math.sin(L.T * 5)) * 2, 0); orb(L.k, V(0, 3.6, 0), null, [24, .3, .26, 50], [20, .15, .22, 50]); sh(V(0, 0, 0), 40); }, [[0, 'swipe', .4], [.1, 'kids_laugh', .5], [.4, 'kick', .4], [1.0, 'kick', .4]]);
// 103 «Fußball.»: Bernd y el cartero se pasan el balón en la calle
shot(101.54, 'C', null, L => { street(); const b = put(bernd, -2, 0, 4, PI / 2 + .5); const p = put(post, 2.4, 0, 4, -PI / 2 - .5); const q = (L.lt * 1.4) % 1, dir = Math.floor(L.lt * 1.4) % 2; show(BALL, dir ? lerp(1.6, -1.2, q) : lerp(-1.2, 1.6, q), .55, 4.6); applyPose(b, kickPose(dir ? 0 : clamp(q * 2))); applyPose(p, kickPose(dir ? clamp(q * 2) : 0)); grin(b, L.T); grin(p, L.T);
  orb(L.k, V(.2, 3.4, 4), null, [16, .05, .1, 48], [14.5, -.05, .1, 48]); sh(V(0, 0, 4), 30); }, [[0, 'thump', .4], [.15, 'kick', .4], [.7, 'kick', .4]]);
// 104 «Jeden Tag, im neuen Stadion.»: el estadio lleno de gente jugando: niños, abuela, panadero…
shot(102.30, 'Z', null, L => { stadium(); tribune(L, 0, 18, 3, 'cheer', EX.slice(18)); [oma, malte, ...K, tw].forEach((c, i) => { const r = RNG(i * 9); put(c, SX - 10 + i * 3, 0, -4 + (i % 3) * 4, (r() - .5) * 2); applyPose(c, runP(L.T, i)); cara(c, L.T + i, { expr: 'joy', mouth: 'open_smile' }); }); GLV.forEach(g => g.visible = true);
  show(BALL, SX + Math.sin(L.T * 2) * 6, .55, 0); const k = easeInOut(L.k); cam([SX + 22 - k * 4, 16 - k * 3, 30 - k * 4], [SX - 2, 2, -2], 48); sh(V(SX, 0, 0), 40); }, [[0, 'swoosh', .4], [.2, 'crowd_cheer', .5], [.6, 'whistle', .4]]);
// 105–108 HUSS ×8: todo el pueblo haciendo toques a la vez (la abuela, Malte, Bernd y yo)
const hussAll = (L, list, z0 = 0) => list.forEach((c, i) => { put(c, SX - (list.length - 1) * 2 + i * 4, 0, z0 - (i % 2) * 2, 0); juggle(c, i ? [BALL2, BALL, BALL2][i % 3] : BALL, L.T, tsH(104, 106.4), { h: 2 }); cara(c, L.T + i, { expr: 'joy', mouth: 'open_smile' }); });
shot(104.15, 'W', null, L => { stadium(); hussAll(L, [malte, oma]); orb(L.k, V(SX, 2.6, 0), null, [12, .2, .1, 46], [11, .35, .1, 46]); sh(V(SX, 0, 0), 30); }, [[0, 'swipe', .4]]);
shot(104.69, 'C', null, L => { stadium(); hussAll(L, [bernd, post]); orb(L.k, V(SX, 2.8, 0), null, [12, -.3, .1, 46], [11, -.15, .1, 46]); sh(V(SX, 0, 0), 30); });
shot(105.22, 'W', null, L => { stadium(); hussAll(L, [mayor, tw]); GLV.forEach(g => g.visible = true); orb(L.k, V(SX, 2.8, 0), null, [12, .1, .12, 46], [11, .25, .1, 46]); sh(V(SX, 0, 0), 30); });
shot(105.76, 'C', null, L => { stadium(); tribune(L, 0, 12, 2, 'cheer'); hussAll(L, [K[0], K[1], K[2], K[3]]); orb(L.k, V(SX, 3, 0), null, [20, .3, .2, 48], [18, .2, .18, 48]); sh(V(SX, 0, 0), 30); });
// 109 «Und ich?»: el estadio sigue; mi sitio en el campo, vacío
shot(106.35, 'Z', null, L => { stadium(); tribune(L, 0, 16, 4, 'cheer'); show(BALL, SX, .55, 0); BALL.rotation.set(0, 0, L.T); cam([SX + 1, 1.4, 8 - L.k], [SX, 1.4, 0], 44); sh(V(SX, 0, 0), 30); }, [[0, 'swoosh', .4], [.2, 'wind', .4]]);
// 110 «Ich bin endlich zu Hause.»: entro en mi salón y suspiro, feliz
shot(106.98, 'W', null, L => { room('HZ'); VMODE = 'logo'; const me = put(ich, HX + 6 - L.lt * 2, 0, 6, -1.6); applyPose(me, walkP(L.T, 0, 6)); grin(me, L.T); orb(L.k, V(HX + 4, 3.6, 5), null, [13, -.6, .12, 46], [11.5, -.45, .1, 46]); sh(V(HX, 0, 0), 20); }, [[0, 'swipe', .4], [.1, 'door', .5], [.6, 'sigh', .5]]);
// 111 «Auf dem Sofa.»: me dejo caer en el sofá
shot(108.36, 'C', 'punch', L => { room('HZ'); VMODE = 'logo'; const k = easeOut(clamp(L.lt / .3)); put(ich, HX, lerp(2.4, 0, k), 3.2, PI); applyPose(ich, { ...seatP(L.T, 0, 0), aLx: .3, aRx: .3, aLz: .9, aRz: .9, aLe: .2, aRe: .2, headX: -.2 }); cara(ich, L.T, { expr: 'happy', eyes: 'closed', mouth: 'smile' });
  orb(L.k, V(HX, 3.6, 3.2), null, [10, PI + .3, .1, 44], [9, PI + .2, .1, 44]); sh(V(HX, 0, 0), 20); }, [[0, 'impact', .4], [.1, 'sofa_flop', .7]]);
// 112 «Und zocke GTA 6.»: con el mando, la tele con el logo del juego detrás de mí
shot(109.04, 'W', null, L => { room('HZ'); VMODE = 'logo'; gamer(ich, HX, 0, 3.2, PI, L.T, 0, 0, 'joy'); grin(ich, L.T); cam([HX + 4, 5.8, 9 - L.k], [HX - 1, 4.2, -8], 46); sh(V(HX, 0, 0), 20); }, [[0, 'swipe', .4], [.2, 'game_start', .6], [.6, 'button_mash', .5]]);
// 113 «6.»: primer plano de mi cara, feliz, iluminada por la tele
shot(110.04, 'C', 'punch', L => { room('HZ'); VMODE = 'game'; gamer(ich, HX, 0, 3.2, PI, L.T, 0, 0, 'joy'); grin(ich, L.T); onFace(ich, 6.4, .2, .4, 40, L.k, 5.6); sh(V(HX, 0, 0), 20); }, [[0, 'impact', .4], [.2, 'button_mash', .5]]);
// 114 «Allein.»: alejamiento: el salón, yo solo en el sofá con la tele
shot(110.89, 'Z', null, L => { room('HZ'); VMODE = 'game'; gamer(ich, HX, 0, 3.2, PI, L.T, 0, 0, 'joy'); orb(L.k, V(HX, 3.6, 3.2), null, [7, PI + .3, .1, 44], [12, PI + .35, .2, 52]); sh(V(HX, 0, 0), 20); }, [[0, 'swoosh', .4], [.2, 'crickets', .4]]);

// ---------- a: gancho, todos juegan, la ciudad vacía, mi entrenamiento (0 – 25,59 s) ----------
const tsH = (a, b) => hussIn(a, b);
const ballUnder = (ch) => { applyPose(ch, { aRx: .35, aRz: .15, aRe: 1.6, aLz: .15, aLe: .3, headX: .02 }); const w = loc(ch, 1.2, 2.55, .45); show(BALL, w.x, w.y, w.z); return w; };
// 1 «In dieser Stadt zockt» (zoom lento): la Zockerhalle llena de jugones y pantallas del juego; yo en el centro haciendo flexiones y, de golpe, dominadas
shot(0, 'F', 'slow', L => { halle(); VMODE = 'both'; hallCrowd(L, 18);
  const t = L.lt; if (t < .5) { pushup(ich, ZX, -3.2, (Math.sin(t * 19 - 1.5) + 1) / 2, L.T); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); }
  else if (t < .66) { const k = (t - .5) / .16; put(ich, ZX, k * 2.2, -4, 0); applyPose(ich, { aLx: lerp(1, 3.05, k), aRx: lerp(1, 3.05, k), aLz: .32, aRz: .32, lLk: .4, lRk: .4, crouch: (1 - k) * .4 }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' }); }
  else { const e = (Math.sin((t - .66) * 15 - 1.5) + 1) / 2; hang(ich, ZX, -4, e, L.T); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: e > .5 ? 'grimace' : 'flat' }); sweat(ich, L.T, 2); }
  orb(L.k, V(ZX, lerp(2.6, 6.4, clamp((L.lt - .35) / .4)), -3.6), null, [21, .12, .08, 50], [14, .04, .06, 46]); sh(V(ZX, 0, -2), 30); },
  [[0, 'crowd_murmur', .4], [.05, 'game_beep', .4], [.15, 'grunt', .4], [.35, 'grunt', .4], [.55, 'whoosh', .4], [.7, 'metal_clank', .5], [.95, 'grunt', .4], [1.15, 'grunt', .4]]);
// 2 «jeder GTA 6,»: fila de jugones machacando los mandos; detrás, la gran pantalla con el logo
shot(1.33, 'W', null, L => { halle(); VMODE = 'logo'; const r = ZH.CH; [0, 3, 6].forEach((ci, j) => { const c = r[ci]; gamer(EX[j], c.x, 0, c.z, -.15, L.T, j * 1.7, j + 4, ['determined', 'joy', 'laugh'][j]); });
  [9, 12, 15].forEach((ci, j) => { const c = r[ci]; gamer(EX[3 + j], c.x, 0, c.z, .15, L.T, j * 2.3, j + 8, ['laugh', 'determined', 'joy'][j]); });
  cam([ZX - 2 - L.k * 1.5, 4.4, 9 - L.k], [ZX - 10, 3.2, -6], 46); sh(V(ZX, 0, -6), 30); }, [[0, 'swipe', .4], [.1, 'button_mash', .6], [.6, 'game_engine', .4]]);
// 3 «außer mir.»: yo fuera, en la calle vacía al atardecer, con el balón bajo el brazo; en las ventanas, el brillo de las teles
shot(2.43, 'C', 'punch', L => { street('sunset'); const me = put(ich, 0, 0, 6, 0); ballUnder(me); cara(me, L.T, { expr: 'smug', eyes: 'half', mouth: 'smirk' });
  onFace(me, 8.4, -.3, .7, 40, L.k, 7.6); sh(V(0, 0, 4), 30); }, [[0, 'thump', .6], [.2, 'wind', .3]]);
// 4–7 HUSS ×8: trucos en mitad de la calle vacía (frontal, cenital, lateral, cara)
shot(3.40, 'W', null, L => { street('sunset'); const me = put(ich, 0, 0, 2, .1); trick(me, BALL, L.T, tsH(3.3, 5.7), ['roll', 'step', 'elastico', 'up', 'knee', 'up', 'rainbow', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  orb(L.k, V(0, 1.9, 2), null, [11.5, .2, .06, 46], [10.5, .45, .06, 46]); sh(V(0, 0, 2), 30); }, [[0, 'swipe', .4]]);
shot(4.03, null, null, L => { street('sunset'); const me = put(ich, 0, 0, 2, 0); const b = trick(me, BALL, L.T, tsH(3.3, 5.7), ['roll', 'step', 'elastico', 'up', 'knee', 'up', 'rainbow', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  cam([.6, 9.8 - L.k, 4.6], [0, 1, 2.6], 46); sh(V(0, 0, 2), 30); });
shot(4.52, 'C', null, L => { street('sunset'); const me = put(ich, 0, 0, 2, .2); trick(me, BALL, L.T, tsH(3.3, 5.7), ['roll', 'step', 'elastico', 'up', 'knee', 'up', 'rainbow', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  orb(L.k, V(0, 2.2, 2), null, [10, 1.35, .1, 46], [9.4, 1.15, .12, 46]); sh(V(0, 0, 2), 30); });
shot(5.08, null, null, L => { street('sunset'); const me = put(ich, 0, 0, 2, 0); trick(me, BALL, L.T, tsH(3.3, 5.7), ['roll', 'step', 'elastico', 'up', 'knee', 'up', 'rainbow', 'up'], { end: true }); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); sweat(me, L.T, 2);
  onFace(me, 7.8, -.2, 1.2, 40, L.k, 6.8); sh(V(0, 0, 2), 30); });
// 8 «Ich spiele Fußball.»: el tiro a la portería del Bolzplatz; la red se hincha
shot(5.70, 'Z', null, L => { bolz(false); const me = put(ich, BX + .5, 0, 2, PI); const kt = 6.12; const k = clamp((L.T - (kt - .25)) / .4); applyPose(me, kickPose(k));
  const a = loc(me, .5, 1.0, 1.4).toArray(), g = [BX, 2.2, -15.5]; if (L.T < kt) show(BALL, a[0], .55, a[2]); else shotBall(BALL, a, g, .6, clamp((L.T - kt) / .25), L.T); BZ.GO.userData.bulge(clamp((L.T - kt - .22) / .1) * (1 - clamp((L.T - kt - .5) / .4)));
  cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: L.T > kt ? 'grimace' : 'flat' }); orb(L.k, V(BX, 2.4, -2), null, [13, PI - .5, .14, 46], [11, PI - .35, .12, 46]); sh(V(BX, 0, -4), 30); },
  [[0, 'swoosh', .4], [.42, 'kick', .7], [.7, 'net', .6]]);
// 9 «Der Bäcker zockt GTA.»: Bernd juega detrás del mostrador; una clienta espera con el monedero
shot(6.85, 'S', null, L => { room('BK'); VMODE = 'game'; padStand(bernd, BKX, -3, 0, L.T, 0, 1, 'joy'); const cl = put(EX[20], BKX + 3.4, 0, 4.2, PI + .5); actuar(cl, 0, [[0, 'cross']], { T: L.T }); cara(cl, L.T, { expr: 'angry', mouth: 'frown' });
  orb(L.k, V(BKX, 4.6, -1.6), null, [14, -.35, .14, 46], [12.5, -.2, .12, 46]); sh(V(BKX, 0, 0), 20); }, [[0, 'swipe', .4], [.1, 'shop_bell', .5], [.5, 'button_mash', .5]]);
// 10 «GTA.»: primer plano de Bernd con la tele del juego detrás, el pan humeando
shot(7.57, 'C', 'punch', L => { room('BK'); VMODE = 'game'; padStand(bernd, BKX, -3, 0, L.T, 0, 1, 'laugh'); laughF(bernd, L.T);
  onFace(bernd, 7.8, .6, -.6, 40, L.k, 6.8); sh(V(BKX, 0, 0), 20); }, [[0, 'thump', .5], [.2, 'game_engine', .4]]);
// 11 «Der Postbote»: Ömer con el mando en mitad de la calle; las cartas se le caen de la cartera
shot(8.24, 'W', null, L => { street(); const p = padStand(post, 3, 8, -.2, L.T, 0, 3, 'joy'); for (let i = 0; i < 4; i++) { const k = ((L.lt * 1.4 + i * .25) % 1); }
  [0, 1, 2].forEach(i => { const e = EX[30 + i]; }); show(LET, 4.6, .05, 9.4, .4, .5); LET.rotation.x = -PI / 2;
  orb(L.k, V(3, 3.6, 8), null, [12, .55, .12, 46], [10.5, .3, .1, 46]); sh(V(3, 0, 8), 30); }, [[0, 'swipe', .4], [.2, 'paper', .5], [.5, 'button_mash', .4]]);
// 12 «zockt GTA.»: cara del cartero absorto en el juego
shot(8.90, 'C', null, L => { street(); padStand(post, 3, 8, -.2, L.T, 0, 3, 'shock'); cara(post, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  onFace(post, 7.4, .5, .8, 40, L.k, 6.6); sh(V(3, 0, 8), 30); }, [[0, 'thump', .4], [.3, 'game_beep', .5]]);
// 13 «Meine Oma zockt»: la abuela en su sillón con un mando en cada mano
shot(9.86, 'Z', null, L => { room('OS'); VMODE2 = 'game'; const o = gamer(oma, OX - 6, 2.3, -3, .5, L.T, 0, 2, 'joy'); applyPose(o, { ...seatP(L.T, 0), aLz: .15, aRz: .15, aLx: 1.2, aRx: 1.2, aLe: 1.1, aRe: 1.1 });
  [o.aL.hand, o.aR.hand].forEach((h, j) => { const w = h.getWorldPosition(V()); show(PAD[2 + j * 30], w.x, w.y + .1, w.z, .5, .84); PAD[2 + j * 30].rotation.set(-.7, .5, 0, 'YXZ'); }); grin(o, L.T);
  orb(L.k, V(OX - 6, 5.6, -3), null, [12, .5, .22, 44], [10, .45, .2, 44]); sh(V(OX - 4, 0, -3), 20); }, [[0, 'swoosh', .4], [.2, 'button_mash', .5], [.5, 'oma_laugh', .4]]);
// 14 «mit zwei Controllern.»: plano cenital de las manos de la abuela con los dos mandos y el 2
shot(10.72, 'C', 'punch', L => { room('OS'); VMODE2 = 'game'; const o = gamer(oma, OX - 6, 2.3, -3, .5, L.T, 0, 2, 'joy'); applyPose(o, { ...seatP(L.T, 0), aLz: .15, aRz: .15, aLx: 1.2, aRx: 1.2, aLe: 1.1, aRe: 1.1 });
  [o.aL.hand, o.aR.hand].forEach((h, j) => { const w = h.getWorldPosition(V()); show(PAD[2 + j * 30], w.x, w.y + .1, w.z, .5, .84); PAD[2 + j * 30].rotation.set(-.7 + Math.sin(L.T * 20 + j) * .08, .5, 0, 'YXZ'); }); laughF(o, L.T);
  show(DOG, OX - 2.6, 0, .4, -.6, 1); orb(L.k, V(OX - 5.8, 5.2, -2.8), null, [8.4, .5, .4, 44], [7.6, .5, .38, 44]); badge('gold', '2', W / 2, H * .17, clamp(L.lt / .2)); sh(V(OX - 4, 0, -3), 20); }, [[0, 'impact', .5], [.15, 'pop', .5], [.4, 'button_mash', .5]]);
// 15 «Keiner geht mehr raus.»: grúa sobre la calle vacía, solo el viento y una hoja
shot(11.92, 'W', 'slow', L => { street(); const k = easeInOut(L.k); cam([8 - k * 4, 26 - k * 10, 46 - k * 10], [0, 3, -20], 50); sh(V(0, 0, 0), 60); }, [[0, 'wind', .6], [.4, 'crickets', .3]]);
// 16 «Die Straßen sind leer.»: plano bajo, el balón solo en mitad de la calle, nadie en las aceras
shot(13.12, 'S', null, L => { street(); show(BALL, .8 - L.k * 1.6, .55, 10); BALL.rotation.set(0, 0, L.T * 3); cam([2.4 - L.k, 1.2, 18], [0, 2, 0], 46); sh(V(0, 0, 4), 40); }, [[0, 'swipe', .4], [.3, 'ball_roll', .5]]);
// 17 «Die Straßenbahn fährt»: el tranvía entra en plano por la vía
shot(14.39, 'Z', null, L => { street(); tramAt(-60 + L.lt * 34); orb(L.k, V(-3.5, 4, -40 + L.lt * 20), null, [24, .75, .12, 48], [22, .55, .1, 48]); sh(V(-3.5, 0, -40), 40); }, [[0, 'tram_bell', .7], [.2, 'tram', .6]]);
// 18 «ohne einen einzigen»: por la ventana: asientos vacíos; el conductor solo, con el mando
shot(15.57, 'W', null, L => { street(); tramAt(-28 + L.lt * 8); const d = padStand(EX[21], -3.5, -20.5 + L.lt * 8, 0, L.T, 0, 6, 'joy'); d.root.position.y = 1.4; padAt(d, 6);
  cam([5, 4.8, -12 + L.lt * 8], [-3.5, 4, -28 + L.lt * 8], 48); sh(V(-3.5, 0, -30), 30); }, [[0, 'swipe', .4], [.2, 'tram', .5]]);
// 19 «Fahrgast»: el contador de pasajeros: 0
shot(16.27, 'C', 'punch', L => { street(); tramAt(-6 + L.lt * 6); cam([5, 4.8, 10 + L.lt * 5], [-3.5, 4, -6 + L.lt * 6], 48); badge('red', '0 Fahrgäste', W / 2, H * .2, clamp(L.lt / .2), 1, .8); sh(V(-3.5, 0, -6), 30); }, [[0, 'thump', .5], [.1, 'buzzer', .4]]);
// 20 «durch die Stadt.»: dron sobre el tranvía cruzando el pueblo vacío
shot(16.71, 'R', null, L => { street(); tramAt(20 + L.lt * 22); const k = easeInOut(L.k); cam([18 - k * 6, 30 - k * 4, 60 + k * 10], [-3.5, 2, 20 + L.lt * 22], 50); sh(V(0, 0, 30), 60); }, [[0, 'whoosh', .4], [.2, 'tram', .5]]);
// 21 «Und ich?»: yo, primer plano, con el balón; mirada decidida
shot(17.46, 'C', 'punch', L => { kirch(); const me = put(ich, KX, 0, 4, 0); ballUnder(me); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' }); onFace(me, 7.6, -.2, -.6, 40, L.k, 6.8); sh(V(KX, 0, 4), 30); }, [[0, 'impact', .6]]);
// 22 «Jeden Tag allein»: plano general: yo solo haciendo toques delante del muro, la iglesia detrás
shot(18.07, 'W', null, L => { kirch(); const me = put(ich, KX, 0, -2, 0); juggle(me, BALL, L.T, [18.2, 18.5, 18.8, 19.1, 19.4], { h: 2.2 }); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  orb(L.k, V(KX, 5, -6), null, [26, .25, .2, 50], [22, .1, .16, 50]); sh(V(KX, 0, -4), 40); }, [[0, 'swipe', .4], [.13, 'kick', .3], [.43, 'kick', .3], [.73, 'kick', .3], [1.0, 'church_bell', .4]]);
// 23 «auf dem Bolzplatz»: travelling bajo junto a los conos mientras conduzco el balón
shot(19.17, 'S', null, L => { kirch(); const r = dribble(ich, BALL, L.lt, L.T, { x: KX - 2, z: 12, ry: PI, speed: 7, ts: [19.25, 19.5, 19.75], weave: .8 }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  const p = ich.root.position; cam([p.x + 6, 2.2, p.z - 5], [p.x, 2.2, p.z], 46); sh(V(KX, 0, 6), 30); }, [[0, 'swipe', .4], [.1, 'kick', .3], [.35, 'kick', .3]]);
// 24 «hinter der Kirche.»: desde lo alto de la torre: el campo detrás de la iglesia y yo solo abajo
shot(19.65, 'Z', null, L => { kirch(); const me = put(ich, KX, 0, 2, PI); juggle(me, BALL, L.T, [19.7, 20.0, 20.3], { h: 2 }); const k = easeInOut(L.k);
  cam([KX + 2, 34 - k * 4, -18 + k * 4], [KX, 2, 4], 48); sh(V(KX, 0, -10), 50); }, [[0, 'whoosh', .4], [.2, 'church_bell', .5]]);
// 25 «700 Schüsse»: tiro contra el muro; el 700 sale del impacto
shot(20.58, 'C', 'punch', L => { kirch(); const me = put(ich, KX + 1, 0, 4, PI); const kt = 20.86; const k = clamp((L.T - (kt - .25)) / .4); applyPose(me, kickPose(k)); const a = loc(me, .5, 1.0, 1.4).toArray(), g = [KX + .5, 2.4, -9.4];
  if (L.T < kt) show(BALL, a[0], .55, a[2]); else { const q = clamp((L.T - kt) / .22); shotBall(BALL, a, g, .3, q, L.T); if (q >= 1) dust(V(KX + .5, 1.4, -9), kt + .22, L.T, 8, .5); }
  cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); orb(L.k, V(KX, 3.4, -2), null, [15, .4, .14, 46], [13, .3, .12, 46]); badge('gold', '700', W / 2, H * .17, clamp((L.T - kt) / .2), 1, 1.1); sh(V(KX, 0, -2), 30); }, [[0, 'impact', .5], [.28, 'kick', .7], [.5, 'wall_hit', .7], [.55, 'pop', .4]]);
// 26 «gegen die Mauer,»: el balón golpea el muro una y otra vez (marcas, polvo)
shot(21.42, 'W', null, L => { kirch(); const me = put(ich, KX - .5, 0, 3, PI); const per = .42, ph = (L.lt % per) / per; applyPose(me, kickPose(clamp(ph * 1.6)));
  const a = loc(me, .5, 1.0, 1.4).toArray(), g = [KX - 1 + Math.sin(Math.floor(L.lt / per) * 2) * 2, 2.2, -9.4]; const q = clamp((ph - .35) / .35); if (q <= 0) show(BALL, a[0], .55, a[2]); else shotBall(BALL, a, g, .2, q < 1 ? q : 1 - (q - 1), L.T);
  cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); cam([KX + 6, 3.4, -6.6], [KX - .5, 2.4, -1], 46); sh(V(KX, 0, -4), 30); }, [[0, 'swipe', .4], [.2, 'wall_hit', .5], [.62, 'wall_hit', .5]]);
// 27 «jeden Morgen um sechs.»: amanecer, el reloj de la iglesia marca las seis; yo ya entrenando
shot(22.26, 'F', null, L => { kirch('sunset'); const me = put(ich, KX, 0, -6, 0); juggle(me, BALL, L.T, [22.3, 22.6, 22.9, 23.2], { h: 2.2 }); cara(me, L.T, { expr: 'determined', eyes: 'half', mouth: 'flat' });
  const k = easeInOut(L.k); cam([KX + 3, 3.6, 14 - k * 2], [KX, 9 + k * 2, -30], 48); badge('gold', '6:00', W / 2, H * .15, clamp(L.lt / .2), 1, .9); sh(V(KX, 0, -10), 50); }, [[0, 'flash', .4], [.1, 'church_bell', .7], [.4, 'rooster', .4]]);
// 28–31 HUSS ×7: trucos contra el muro (frontal, lateral, cenital, cara)
shot(23.40, 'W', null, L => { kirch(); const me = put(ich, KX, 0, -3, .15); trick(me, BALL, L.T, tsH(23.3, 25.6), ['elastico', 'up', 'knee', 'step', 'roll', 'up', 'rainbow']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  orb(L.k, V(KX, 2, -3), null, [11, .25, .08, 46], [10, .5, .06, 46]); sh(V(KX, 0, -3), 30); }, [[0, 'swipe', .4]]);
shot(24.05, 'C', null, L => { kirch(); const me = put(ich, KX, 0, -3, .15); trick(me, BALL, L.T, tsH(23.3, 25.6), ['elastico', 'up', 'knee', 'step', 'roll', 'up', 'rainbow']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  orb(L.k, V(KX, 2.2, -3), null, [10, -1.3, .12, 46], [9.4, -1.1, .1, 46]); sh(V(KX, 0, -3), 30); });
shot(24.60, null, null, L => { kirch(); const me = put(ich, KX, 0, -3, .15); trick(me, BALL, L.T, tsH(23.3, 25.6), ['elastico', 'up', 'knee', 'step', 'roll', 'up', 'rainbow']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  cam([KX + .5, 10 - L.k, -.6], [KX, 1, -2.4], 46); sh(V(KX, 0, -3), 30); });
shot(25.18, 'C', null, L => { kirch(); const me = put(ich, KX, 0, -3, .15); trick(me, BALL, L.T, tsH(23.3, 25.6), ['elastico', 'up', 'knee', 'step', 'roll', 'up', 'rainbow'], { end: true }); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); sweat(me, L.T, 2);
  onFace(me, 7.4, -.2, 1.2, 40, L.k, 6.6); sh(V(KX, 0, -3), 30); });

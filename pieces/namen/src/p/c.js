// ---------- c: las monedas, el chico del hoodie azul, el gran partido, la noche de los HUSS, Genau pleite, el millón, la cancha nueva (46,18 – 94,1 s) ----------
// bote sincronizado: el balón toca el suelo en tg, tg + 1/sp, …
function bounce(ch, T, tg, sp = 3, ball = BALL) { const ph = ((T - tg) * sp + .5) % 1 + (T < tg ? 1 : 0); const h = hp(ch), a = ch.root.rotation.y, s = ch.spec.scale || 1;
  const hx = h.x + Math.sin(a) * 1.2 * s + Math.cos(a) * 1.1 * s, hz = h.z + Math.cos(a) * 1.2 * s - Math.sin(a) * 1.1 * s, y0 = ch.root.position.y < 1 ? 0 : ch.root.position.y - .1;
  const top = ch.root.position.y + 3.0 * s, y = y0 + .62 + (top - y0 - .62) * Math.abs(Math.cos(ph * PI)); ball.visible = true; ball.position.set(hx, y, hz); ball.rotation.x = T * 6; ball.scale.setScalar(1); return V(hx, y0, hz); }
const bounceP = (T, tg, sp = 3) => { const ph = (((T - tg) * sp + .5) % 1 + 1) % 1, q = Math.abs(Math.cos(ph * PI)); return { aRx: .8 + q * .5, aRz: -.15, aRe: .9 - q * .5, aLx: .4, aLz: .3, aLe: .8, crouch: .18, lean: .18, lLx: .3, lRx: -.2, lLk: .4, lRk: .3, headX: .1 }; };
// golpe «HUSS»: anillo en el suelo y letrero que salta junto al balón
function hussFx(p, T0, T, sc = 1) { const t = T - T0; if (t < 0 || t > .5) return; RING.visible = true; RING.position.set(p.x, p.y + .1, p.z); RING.rotation.x = PI / 2; RING.scale.setScalar(.6 + t * 9 * sc); RING.material.opacity = .8 * (1 - t / .5); }
const HUSSW = WORDS.filter(w => /^HUSS/.test(w[2])).map(w => w[0]);
function fallDown(c, L, t0, x, z, ry, side = 1) { const k = easeOut(clamp((L.lt - t0) / .45)); put(c, x, Math.max(0, Math.sin(k * PI) * .8) * (1 - k), z, ry); c.root.rotation.order = 'YXZ'; c.root.rotation.x = -k * 1.45 * side; actuar(c, 0, [[0, { aLx: 2.4 * k, aRx: 2.4 * k, aLz: .6, aRz: .6, lLx: .5 * k, lRx: -.3 * k }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); }
const TEAMP = () => EXS.slice(20, 26);

// 47 «Dann… Ein Euro?»: de noche en mi calle: ¡pling! una moneda salta sobre mi cabeza; me paro
shot(46.18, 'C', 'punch', L => { strasseS(L, 'night'); pose(ich, SX - 13, 0, 8, PI - .4, L, { headX: -.35, aLx: .3, aRx: .3 }, 'shock', { mouth: 'o' }); lp(0, SX - 10, 12, 10, 50, 0xffc070, 40);
  coinBurst(hp(ich).add(V(0, 1.6, 0)), L.t0 + .16, L.T, 1, 0, { y0: 0, vy: 7, spread: .3 }); money('1 €?', (L.lt - .2) * 3); onFace(ich, 5.2, .2, .3, 42, L.k, 4.6); }, [[.16, 'coin_pling', .8]]);
// 48 «Drei Euro?»: otras dos monedas; me miro las manos
shot(47.1, 'Z', null, L => { strasseS(L, 'night'); pose(ich, SX - 13, 0, 8, PI - .2, L, { aLx: 1.2, aLe: 1.2, aRx: 1.2, aRe: 1.2, headX: .2 }, 'shock', { mouth: 'o' }); lp(0, SX - 10, 12, 10, 50, 0xffc070, 40);
  coinBurst(hp(ich).add(V(0, 1.6, 0)), L.t0 + .02, L.T, 2, 2, { y0: 0, vy: 7, spread: 1 }); money('3 €?', (L.lt - .05) * 3); orb(L.k, V(SX - 13, 3.6, 8), null, [12, PI - .2 + .4, .12, 44], [10, PI - .2 + .2, .1, 44]); }, [[0, 'coin_pling', .8], [.15, 'coin_pling', .7]]);
// 49 «Sechs Euro!»: salto de alegría; tres monedas más
shot(47.9, 'F', null, L => { strasseS(L, 'night'); const j = Math.max(0, Math.sin(L.lt * 6)) * 1.2; pose(ich, SX - 13, j, 8, PI - .5, L, { aLx: 2.8, aLz: .5, aRx: 2.8, aRz: .5, lLk: .6, lRk: .6 }, 'joy', { mouth: 'open_smile' }); lp(0, SX - 10, 12, 10, 50, 0xffc070, 40);
  coinBurst(hp(ich).add(V(0, 1.6, 0)), L.t0, L.T, 3, 4, { y0: 0, vy: 9, spread: 2 }); money('6 €!', (L.lt - .05) * 3, 'green'); orb(L.k, V(SX - 13, 3.8, 8), null, [16, PI - .5 - .3, .18, 46], [13, PI - .5 - .1, .12, 46]); }, [[0, 'coin_jingle', .8], [.1, 'yay', .5]]);
// 50 «Auf dem alten Platz trainierte»: la cancha vieja de noche, vista desde detrás de la valla: el chico del hoodie azul bota solo; yo asomado
shot(49.26, 'I', null, L => { platzS(L, 'night'); put(blau, BX + 1, 0, -8, .5); actuar(blau, 0, [[0, bounceP(L.T, 49.4)]], { T: L.T }); cara(blau, L.T, { expr: 'determined', mouth: 'flat' }); bounce(blau, L.T, 49.4);
  cm([BX + 9, 5.5, 22, BX, 3.4, -7, 46], [BX + 7, 5, 18, BX, 3.4, -7, 44], L.k); }, [[0, 'night_crickets', .5], [.1, 'ball_bounce', .7], [.43, 'ball_bounce', .7], [.76, 'ball_bounce', .7], [1.1, 'ball_bounce', .7]]);
// 51 «ein Junge im blauen Hoodie.»: de cerca: cruce entre las piernas, gotas de sudor, cara concentrada
shot(50.48, 'W', null, L => { platzS(L, 'night'); put(blau, BX, 0, -6, .25); actuar(blau, 0, [[0, bounceP(L.T, 50.5, 3.4)]], { T: L.T }); cara(blau, L.T, { expr: 'determined', mouth: 'flat' }); bounce(blau, L.T, 50.5, 3.4); sweat(blau, L.T);
  badge('tag', 'BLAUER HOODIE', W / 2, H * .13, (L.lt - .3) * 3); onBody(blau, 13, .3, .08, 44, L.k, 11); }, [[0, 'ball_bounce', .7], [.29, 'ball_bounce', .7], [.59, 'ball_bounce', .7], [.88, 'ball_bounce', .7], [1.18, 'ball_bounce', .7]]);
// 52 «Ganz allein.»: plano cenital alto: la cancha enorme, un solo chico bajo un foco
shot(51.81, 'S', null, L => { platzS(L, 'night'); put(blau, BX, 0, -6, .25); actuar(blau, 0, [[0, bounceP(L.T, 51.9)]], { T: L.T }); cara(blau, L.T, { expr: 'determined' }); bounce(blau, L.T, 51.9);
  cm([BX + 2, 46, 18, BX, 0, -6, 46], [BX + 2, 52, 14, BX, 0, -6, 46], L.k); }, [[0, 'wind_soft', .5], [.1, 'ball_bounce', .6], [.43, 'ball_bounce', .6], [.76, 'ball_bounce', .6]]);
// 53 «Jeder Ball:»: a ras de suelo: el balón baja hacia la cámara
shot(52.63, 'R', null, L => { platzS(L, 'night'); put(blau, BX, 0, -6, .1); actuar(blau, 0, [[0, bounceP(L.T, 53.38, 1.33)]], { T: L.T }); cara(blau, L.T, { expr: 'determined', mouth: 'flat' }); const g = bounce(blau, L.T, 53.38, 1.33);
  cm([BX + 2.6, 1.0, 2, BX + 1, 3, -5, 46], [BX + 2.2, .9, 1, BX + 1, 2.6, -5, 46], L.k); }, [[0, 'whoosh_soft', .4]]);
// 54 «HUSS!»: ¡golpe! el balón contra el suelo: onda, «HUSS!» del chico, y una moneda sale disparada hacia la valla… hacia mí
shot(53.38, 'C', 'punch', L => { platzS(L, 'night'); put(blau, BX, 0, -6, .1); actuar(blau, 0, [[0, { ...bounceP(L.T, 53.38, 1.6), aLx: 1.0 }]], { T: L.T }); cara(blau, L.T, { expr: 'shout', mouth: 'scream' }); const g = bounce(blau, L.T, 53.38, 1.6);
  hussFx(g, 53.38, L.T, 1.4); bubble(blau, 'HUSS!', L.lt * 5, 1.4); coinFly(g.clone().add(V(0, 1, 0)), V(BX - 4.5, 5, 35.5), 53.45, L.T, 1, 0, .6); badge('big', 'HUSS!', W / 2, H * .13, L.lt * 5);
  orb(L.k, V(BX, 3.2, -6), null, [12, .3, .02, 46], [10, .2, .02, 46]); }, [[0, 'ball_slam', 1], [.06, 'coin_whoosh', .6]]);
// 55 «Neun Euro.»: yo pegado a la valla, sonrisa enorme; 9 €
shot(54.1, 'G', null, L => { platzS(L, 'night'); pose(ich, BX - 4.5, 0, 35.5, .15, L, { aLx: 1.8, aLz: .2, aLe: 1.0, aRx: 1.8, aRz: -.2, aRe: 1.0 }, 'joy', { mouth: 'open_smile' }); coinBurst(hp(ich).add(V(0, 1.6, 0)), L.t0, L.T, 1, 3, { y0: 0, vy: 7, spread: .3 });
  money('9 €', (L.lt - .05) * 3, 'green'); onFace(ich, 4.8, .2, .4, 42, L.k, 4.2); }, [[0, 'coin_pling', .8]]);
// 56 «Am nächsten Tag,»: el día siguiente: la cancha a vista de dron, gradas llenas, banderines
shot(54.64, 'W', null, L => { platzS(L, 'noon', true, [0, 0]); crowdBox(L, BX + 22, BX + 40, -26, 26, 22, 3, { mode: i => i % 2 ? 'cheer' : 'clap', face: V(BX, 2, 0) }); crowdBox(L, BX - 40, BX - 22, -26, 26, 8, 4, { mode: 'cheer', face: V(BX, 2, 0), list: EXS.slice(26) });
  cm([BX - 30, 44, 50, BX, 0, 0, 50], [BX - 22, 38, 44, BX, 0, -2, 48], L.k); badge('tag', 'NÄCHSTER TAG', W / 2, H * .13, (L.lt - .1) * 3); }, [[0, 'crowd_cheer', .6], [.3, 'whistle', .5]]);
// 57 «beim großen Spiel,»: saque inicial: el chico del hoodie azul frente al equipo de la fiesta (gorros de fiesta), público detrás
shot(55.57, 'Z', null, L => { platzS(L, 'noon', true, [0, 0]); put(blau, BX, 0, 6, PI); actuar(blau, 0, [[0, bounceP(L.T, 55.7, 2.4)]], { T: L.T }); cara(blau, L.T, { expr: 'determined', mouth: 'flat' }); bounce(blau, L.T, 55.7, 2.4);
  TEAMP().slice(0, 4).forEach((c, i) => { pose(c, BX - 6 + i * 4, 0, -4, 0, L, { crouch: .2, aLx: .8, aRx: .8, aLz: .6, aRz: .6 }, 'smug', { mouth: 'smirk' }); hats(c); });
  crowdBox(L, BX + 24, BX + 36, -26, 26, 14, 3, { mode: 'cheer', face: V(BX, 2, 0) }); cm([BX + 8, 7, 18, BX, 4, 0, 48], [BX + 6, 6.5, 15, BX, 4, 0, 46], L.k); }, [[0, 'ball_bounce', .6], [.4, 'whistle', .7]]);
// 58 «machte der Junge im blauen Hoodie»: regatea entre los rivales, que caen al suelo uno tras otro
shot(56.53, 'S', null, L => { platzS(L, 'noon', true, [24, 0]); const z = 4 - L.lt * 7; put(blau, BX + Math.sin(L.T * 5) * 1.2, 0, z, PI); actuar(blau, 0, [[0, { ...runP(L.T, 0), aRx: 1, aRe: .8 }]], { T: L.T }); cara(blau, L.T, { expr: 'determined', mouth: 'flat' }); bounce(blau, L.T, 56.6, 4);
  TEAMP().slice(0, 3).forEach((c, i) => { fallDown(c, L, .2 + i * .3, BX + (i - 1) * 3.2, -1 - i * 3, i % 2 ? .4 : -.4, i % 2 ? 1 : -1); hats(c); });
  crowdBox(L, BX + 24, BX + 36, -26, 26, 14, 3, { mode: 'cheer', face: V(BX, 2, 0) }); cm([BX - 8, 6, 10, BX, 3, -2 - L.lt * 4, 48], [BX - 9, 6, 6, BX, 3, -4 - L.lt * 4, 48], L.k); }, [[.2, 'body_fall', .6], [.5, 'body_fall', .6], [.8, 'body_fall', .6], [0, 'sneakers', .6]]);
// 59 «alle fertig.»: mate a una mano: colgado del aro; el público de pie
shot(57.79, 'Z', 'punch', L => { platzS(L, 'noon', true, [58, 0]); const K = PL.K1, rim = rimW(PL, K); const k = clamp(L.lt / .35);
  put(blau, BX, lerp(3, 7.5, easeOut(k)), rim.z + 1.2, PI); actuar(blau, 0, [[0, { aRx: 3.0, aRz: .05, aRe: .1, aLx: 2.2, aLz: .4, lLk: .6, lRk: .9, lLx: .3 }]], { T: L.T }); cara(blau, L.T, { expr: 'shout', mouth: 'scream' }); blau.blob.visible = false;
  BALL.visible = true; BALL.position.set(rim.x, rim.y + (k < 1 ? .6 : -1 - (L.lt - .35) * 9), rim.z); crowdBox(L, BX + 24, BX + 36, -26, 0, 14, 3, { mode: 'cheer', face: V(BX, 2, -27) });
  cm([BX + 7, 5, -14, BX, 10, -27, 50], [BX + 6, 4.4, -15.5, BX, 10.4, -27, 48], L.k); }, [[.3, 'dunk', 1], [.35, 'crowd_cheer', .7]]);
// 60 «Sechzig Punkte.»: el marcador: 60 : 0; confeti
shot(58.79, 'F', 'punch', L => { platzS(L, 'noon', true, [60, 0]); confetti(V(BX - 11, 4, -38), L.t0, L.T, 50, 20); badge('big', '60 PUNKTE', W / 2, H * .13, (L.lt - .05) * 3.5);
  cm([BX - 11, 15, -18, BX - 11, 18, -38, 48], [BX - 11, 16, -22, BX - 11, 18, -38, 46], L.k); }, [[0, 'buzzer', .7], [.1, 'crowd_cheer', .7]]);
// 61 «Genau fragte ihn:»: Genau baja a la cancha y se acerca al chico
shot(60.22, 'I', null, L => { platzS(L, 'noon', true, [60, 0]); walk(genau, L, BX - 6, 0, PI / 2, 2.6, 0, { expr: 'confused' }); put(blau, BX + 2, 0, 0, -PI / 2 + .2); actuar(blau, 0, [[0, { aLx: .9, aLe: 1.2 }]], { T: L.T }); cara(blau, L.T, { expr: 'neutral' }); attach(BALL, blau.aL.hand, [0, -.8, .4]);
  crowdBox(L, BX + 24, BX + 36, -20, 20, 12, 3, { mode: 'look', face: V(BX, 2, 0) }); cm([BX - 1.3, 6, 20, BX - 1.3, 4, 0, 46], [BX - 1, 6, 18, BX - 1, 4, 0, 46], L.k); }, [[0, 'footsteps', .6]]);
// 62 «„Seit wann bist du so gut?“»: Genau, de cerca, desconcertado
shot(61.28, 'C', null, L => { platzS(L, 'noon', true, [60, 0]); put(genau, BX - 2, 0, 0, PI / 2 - .2); actuar(genau, 0, [[0, { aLx: .8, aLz: .5, aLe: 1.4, aRx: .8, aRz: .5, aRe: 1.4 }]], { T: L.T }); talk(genau, L.T, 61.28, 62.78, 'confused');
  onFace(genau, 5, .1, -.6, 42, L.k, 4.4); }, [[0, 'crowd_murmur', .4]]);
// 63 «Er sagte:»: el chico, tranquilo, con el balón bajo el brazo
shot(62.78, 'W', null, L => { platzS(L, 'noon', true, [60, 0]); put(blau, BX + 2, 0, 0, -PI / 2 + .2); actuar(blau, 0, [[0, { aLx: .9, aLe: 1.2 }]], { T: L.T }); cara(blau, L.T, { expr: 'neutral', mouth: 'flat' }); attach(BALL, blau.aL.hand, [0, -.8, .4]);
  onFace(blau, 5.4, 0, .5, 42, L.k, 5); }, [[0, 'silence', .3]]);
// 64 «„Während du gefeiert hast.“»: zoom lento a su cara, mirada seria
shot(63.51, 'Z', 'slow', L => { platzS(L, 'noon', true, [60, 0]); put(blau, BX + 2, 0, 0, -PI / 2 + .2); actuar(blau, 0, [[0, { aLx: .9, aLe: 1.2, headX: -.05 }]], { T: L.T }); talk(blau, L.T, 63.51, 64.83, 'determined'); attach(BALL, blau.aL.hand, [0, -.8, .4]);
  onFace(blau, 4.6, .1, .2, 40, L.k, 3.4); }, []);
// 65 «In dieser Nacht»: el pueblo de noche desde arriba: ventanas encendidas
shot(64.83, 'B', null, L => { stadt(L, 'night'); cm([60, 70, 160, 0, 6, 0, 50], [50, 66, 150, 0, 6, -10, 50], L.k); }, [[0, 'night_wind', .6], [.2, 'owl', .4]]);
// 66 «feierte niemand.»: el jardín de la fiesta vacío: guirnaldas apagadas, un globo en el suelo, la cabina del DJ sola
shot(65.53, 'G', null, L => { party(L); LP[0].intensity = 0; LP[1].intensity = 0; LP[2].intensity = 0; DARK = .18; BLOOMMAX = .2;
  cm([PX + 18, 6, 18, PX, 3, -24, 48], [PX + 14, 5.6, 14, PX, 3, -24, 46], L.k); }, [[0, 'crickets', .7], [.4, 'wind_soft', .4]]);
// 67 «Alle trainierten.»: la plaza de noche llena de gente botando balones
shot(66.59, 'R', null, L => { stadt(L, 'night'); EXS.slice(0, 12).forEach((c, i) => { const r = RNG(i + 5), x = -20 + (i % 4) * 13 + r() * 3, z = 50 + Math.floor(i / 4) * 10; put(c, x, 0, z, r() * 1.4 - .7); actuar(c, 0, [[0, bounceP(L.T, 66.6 + i * .1, 2.6)]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); });
  bounce(EXS[5], L.T, 67.1, 2.6, BALL); bounce(EXS[6], L.T, 67.2, 2.6, BALL2); cm([0, 9, 98, 0, 3, 60, 48], [2, 8, 92, 0, 3, 62, 46], L.k); }, [[0, 'balls_many', .7]]);
// 68 «Genau in seinem Whirlpool:»: de noche, Genau en el jacuzzi bota un balón en el borde dorado
shot(67.56, 'P', null, L => { villaS(L, 'night'); put(genau, VX - 2, .55, 1, .5); actuar(genau, 0, [[0, { ...bounceP(L.T, 69.03, 3), lLx: 1.4, lRx: 1.4, crouch: 0 }]], { T: L.T }); cara(genau, L.T, { expr: 'determined' }); genau.blob.visible = false; bounce(genau, L.T, 69.03, 3);
  cm([VX + 8, 9, 20, VX - 1, 3.5, 1, 46], [VX + 6, 8, 16, VX - 1, 3.6, 1, 46], L.k); }, [[0, 'bubbles', .6]]);
// 69–80: los HUSS de Genau, Krass, Digga y el bebé Boah: tres cortes por grupo, uno por golpe; cada HUSS lanza una moneda
const GROUPS = [
  { who: () => genau, set: L => { villaS(L, 'night'); put(genau, VX - 2, .55, 1, .5); genau.blob.visible = false; }, base: V(VX - 1.4, 2.6, 2), pose: { lLx: 1.4, lRx: 1.4 } },
  { who: () => krass, set: L => { mallIn(L); put(krass, KIX, 0, 4, .2); krass.props.tasche.visible = false; crowdBox(L, KIX - 20, KIX + 20, -14, -2, 6, 13, { mode: 'cheer', face: V(KIX, 3, 4) }); }, base: V(KIX + 1, 0, 5.2) },
  { yaw2: 0, who: () => digga, set: L => { gym(L); put(digga, GX, 0, -4, .2); attach(HANT, digga.aL.hand, [0, -.5, .1], [0, PI / 2, 0], .5); }, base: V(GX + 1, 0, -2.6) },
  { who: () => boah, set: L => { strasseS(L, 'night'); show(WAGEN, SX + 12, 0, 6, -PI / 2, .9); put(boah, SX + 12, 2.4, 6.4, 0); boah.blob.visible = false; lp(0, SX + 10, 12, 12, 50, 0xffc070, 40); }, base: V(SX + 12.4, 2.6, 7.4), small: true }];
const HG = [HUSSW.slice(1, 4), HUSSW.slice(4, 7), HUSSW.slice(7, 10), HUSSW.slice(10, 13)];
const NXT = [70.15, 72.48, 74.65, 76.81];
GROUPS.forEach((G_, gi) => HG[gi].forEach((tg, j) => {
  const t1 = j < 2 ? HG[gi][j + 1] : NXT[gi];
  shot(tg, ['C', 'G', 'Z'][j], j === 0 ? 'punch' : null, L => { G_.set(L); const c = G_.who(); const tgs = HG[gi], sp = 1 / ((tgs[2] - tgs[0]) / 2);
    if (G_.small) { actuar(c, 0, [[0, { aRx: 1.6 + Math.abs(Math.cos((((L.T - tg) * sp + .5) % 1) * PI)) * .6, aRe: .6, aLx: 2.6, aLz: .4, lLx: 1.4, lRx: 1.4 }]], { T: L.T }); BALL.visible = true; const ph = (((L.T - tg) * sp + .5) % 1 + 1) % 1; BALL.scale.setScalar(.45); BALL.position.copy(G_.base).add(V(0, .3 + Math.abs(Math.cos(ph * PI)) * 1.6, 0)); }
    else { actuar(c, 0, [[0, { ...bounceP(L.T, tg, sp), ...(G_.pose || {}) }]], { T: L.T }); bounce(c, L.T, tg, sp); }
    cara(c, L.T, { expr: 'shout', mouth: L.lt < .2 ? 'scream' : 'o', eyes: 'squint' }); bubble(c, 'HUSS!', L.lt * 6, G_.small ? 1.0 : 1.4);
    const gp = G_.small ? G_.base.clone() : wpos(BALL).setY(c.root.position.y < 1 ? 0 : c.root.position.y); hussFx(gp, tg, L.T, G_.small ? .6 : 1.2); coinFly(gp.clone().add(V(0, 1, 0)), gp.clone().add(V(-30, 30, 40)), tg + .03, L.T, 1, j * 3, .5);
    const h = hp(c), s = c.spec.scale || 1; badge('big', 'HUSS!', W / 2, H * .13, L.lt * 5);
    if (j === 0) onFace(c, G_.small ? 2.6 : 4.4, .3, .6, 44, L.k, G_.small ? 2.3 : 3.9);
    else if (j === 1) orb(L.k, h.clone().add(V(0, -1.4 * s, 0)), null, [G_.small ? 6 : 11, c.root.rotation.y - .7, .25, 46], [G_.small ? 5.4 : 10, c.root.rotation.y - .5, .2, 46]);
    else orb(L.k, h.clone().add(V(0, -1.6 * s, 0)), null, [G_.small ? 8 : 15, c.root.rotation.y + (G_.yaw2 ?? .6), .1, 48], [G_.small ? 7 : 13, c.root.rotation.y + (G_.yaw2 ?? .6) - .2, .08, 48]);
    if (gi === 1 && j === 2) money('KRASS: HUSS!', 0); }, [[0, 'ball_slam', .9], [.04, 'coin_whoosh', .5]]); }));
// 70 «Krass im Einkaufszentrum:»
shot(70.15, 'W', null, L => { mallIn(L); put(krass, KIX, 0, 4, .2); krass.props.tasche.visible = false; actuar(krass, 0, [[0, bounceP(L.T, HG[1][0], 3)]], { T: L.T }); cara(krass, L.T, { expr: 'determined', mouth: 'flat' }); bounce(krass, L.T, HG[1][0], 3);
  crowdBox(L, KIX - 20, KIX + 20, -14, -2, 6, 13, { mode: 'look', face: V(KIX, 3, 4) }); cm([KIX + 6, 6, 22, KIX, 4, 4, 46], [KIX + 4, 5.6, 18, KIX, 4, 4, 46], L.k); }, [[0, 'mall_ambience', .5]]);
// 71 «Digga natürlich:»: Digga bota un balón con una mano y levanta una mancuerna con la otra
shot(72.48, 'S', null, L => { gym(L); put(digga, GX, 0, -4, .2); actuar(digga, 0, [[0, { ...bounceP(L.T, HG[2][0], 3), aLx: .3 + Math.abs(Math.sin(L.T * 3)) * 1.6, aLe: .4 + Math.abs(Math.sin(L.T * 3)) * 1.8 }]], { T: L.T }); cara(digga, L.T, { expr: 'smug', mouth: 'grin' }); bounce(digga, L.T, HG[2][0], 3); attach(HANT, digga.aL.hand, [0, -.5, .1], [0, PI / 2, 0], .5);
  orb(L.k, V(GX, 4.4, -4), null, [16, .6, .1, 46], [13, .3, .08, 46]); }, [[0, 'gym_clank', .6]]);
// 72 «Sogar Baby Boah:»: el bebé en su cochecito con una pelotita, de noche
shot(74.65, 'I', null, L => { strasseS(L, 'night'); show(WAGEN, SX + 12, 0, 6, -PI / 2, .9); put(boah, SX + 12, 2.4, 6.4, 0); boah.blob.visible = false; lp(0, SX + 10, 12, 12, 50, 0xffc070, 40);
  actuar(boah, 0, [[0, { aRx: 1.8, aRe: .6, aLx: 2.0, aLz: .3, lLx: 1.4, lRx: 1.4 }]], { T: L.T }); cara(boah, L.T, { expr: 'determined', mouth: 'flat' }); BALL.visible = true; BALL.scale.setScalar(.45); BALL.position.set(SX + 12.4, 3.4 + Math.abs(Math.sin(L.T * 6)) * .8, 7.4);
  cm([SX + 12, 8, 17, SX + 12, 3.2, 6, 44], [SX + 12, 7.4, 15, SX + 12, 3.2, 6, 44], L.k); badge('tag', 'BABY BOAH', W / 2, H * .13, (L.lt - .1) * 3); }, [[0, 'baby_giggle', .6]]);
// 81 «Und jedes einzelne HUSS kam zu mir.»: en mi calle de noche, de todas las direcciones vuelan monedas hacia mí; el contador se dispara
shot(76.81, 'F', null, L => { strasseS(L, 'night'); lp(0, SX - 10, 12, 4, 60, 0xffc070, 40); pose(ich, SX - 13, 0, 4, PI / 2 - .3, L, { aLx: 2.6, aLz: .9, aRx: 2.6, aRz: .9, headX: -.2 }, 'joy', { mouth: 'laugh' });
  const me = hp(ich); for (let i = 0; i < 36; i++) { const r = RNG(i + 40), a = r() * PI * 2, d = 30 + r() * 20, t0 = L.t0 + r() * 1.4, k = clamp((L.T - t0) / .7); if (k <= 0 || k >= 1) continue; const m = COINS[i]; m.visible = true; m.position.copy(arc([me.x + Math.cos(a) * d, 12 + r() * 14, me.z + Math.sin(a) * d], [me.x, me.y + .5, me.z], 3, easeIn(k))); m.rotation.set(k * 8, k * 12, 0); m.scale.setScalar(.8); }
  money(Math.round(lerp(9, 412000, easeIn(clamp(L.lt / 1.7)))).toLocaleString('de-DE') + ' €', (L.lt - .05) * 3); orb(L.k, V(SX - 13, 4, 4), null, [17, PI / 2 + .1, .2, 48], [14, PI / 2 - .2, .14, 46]); }, [[0, 'coins_stream', .8], [.5, 'counter_up', .6]]);
// 82 «mir.»: primer plano: me río bajo la lluvia de monedas
shot(78.53, 'Z', 'punch', L => { strasseS(L, 'night'); lp(0, SX - 10, 12, 4, 60, 0xffc070, 40); pose(ich, SX - 13, 0, 4, PI / 2 - .3, L, { aLx: 2.6, aLz: .9, aRx: 2.6, aRz: .9, headX: -.25 }, 'joy', { mouth: 'laugh' });
  coinBurst(hp(ich).add(V(0, 8, 0)), L.t0 - .6, L.T, 30, 0, { y0: 0, vy: 1, spread: 4, life: 2 }); onFace(ich, 5, .4, .4, 42, L.k, 4.4); }, [[0, 'coins_rain', .8]]);
// 83 «Niemand sagte mehr Genau.»: el marcador de la Namensbank: GENAU baja al último puesto, en rojo
shot(79.07, 'G', null, L => { stadt(L, 'day', 'ende'); crowdBox(L, -20, 20, -40, -30, 8, 6, { mode: i => i % 2 ? 'point' : 'look', face: V(0, 18, -48) });
  cm([0, 17, 10, 0, 17, -45.4, 48], [0, 17, 5, 0, 17, -45.4, 46], L.k); }, [[0, 'glitch', .5], [.3, 'fail_down', .6]]);
// 84 «Genau ging pleite.»: Genau en su jacuzzi vacío, con los bolsillos del revés; una mosca; PLEITE
shot(80.8, 'B', null, L => { villaS(L, 'dusk', 0); VI.WP.userData.water.visible = false; pose(genau, VX, 0, 0, .2, L, { aLx: .3, aLz: .6, aLe: .2, aRx: .3, aRz: .6, aRe: .2, crouch: .2, lean: .3, headX: .45, lLx: 1.4, lRx: 1.4, lLk: 1.2, lRk: 1.2 }, 'sad', { mouth: 'frown' }); genau.blob.visible = false; tears(genau, L.T);
  badge('red', 'PLEITE', W / 2, H * .13, (L.lt - .15) * 3); cm([VX + 4, 8, 14, VX, 2.6, 0, 46], [VX + 3, 7, 11, VX, 2.6, 0, 44], L.k); }, [[0, 'sad_trombone', .6], [.4, 'fly_buzz', .4]]);
// 85 «Am Freitag hatte ich eine Million Euro.»: la plaza en fiesta: yo delante de la Namensbank, primero de la lista; confeti y aplausos
shot(82.0, 'F', null, L => { stadt(L, 'day', 'ende'); pose(ich, 0, 0, -40, 0, L, { aLx: 2.8, aLz: .5, aRx: 2.8, aRz: .5 }, 'joy', { mouth: 'laugh' }); confetti(V(0, 6, -40), L.t0, L.T, 60, 22);
  crowdBox(L, -22, 22, -36, -30, 12, 8, { mode: i => i % 2 ? 'cheer' : 'clap', face: V(0, 3, -40), avoid: [[0, -40]] }); badge('tag', 'FREITAG', W / 2, H * .13, (L.lt - .1) * 3); cm([-3, 11, -27, 0, 5, -40, 48], [2, 11.4, -28, 0, 5.4, -40, 46], L.k); }, [[0, 'crowd_cheer', .7], [.1, 'confetti_pop', .6]]);
// 86 «eine Million Euro.»: golpe de zoom: yo sobre una montaña de monedas; 1.000.000 €
shot(83.08, 'C', 'punch', L => { stadt(L, 'day', 'ende'); for (let i = 0; i < 40; i++) { const r = RNG(i + 70), a = r() * PI * 2, d = Math.sqrt(r()) * 3; const c = COINS[i]; c.visible = true; c.position.set(Math.cos(a) * d, .1 + (3 - d) * .45 + r() * .2, 40 + Math.sin(a) * d); c.rotation.set(-PI / 2 + (r() - .5), r() * 3, 0); c.scale.setScalar(.9); }
  pose(ich, 0, 1.4, 40, 0, L, { aLx: 2.8, aLz: .5, aRx: 2.8, aRz: .5 }, 'joy', { mouth: 'laugh' }); money('1.000.000 €', (L.lt - .05) * 3.5); confetti(V(0, 4, 40), L.t0 - .5, L.T, 40, 16); orb(L.k, V(0, 4.4, 40), null, [13, .2, .2, 46], [10.5, .05, .14, 46]); }, [[0, 'cash_big', .8], [.2, 'crowd_cheer', .6]]);
// 87 «Ich kaufte das Einkaufszentrum.»: delante del centro comercial, Krass me entrega una llave dorada gigante; VERKAUFT
shot(84.28, 'W', null, L => { mallOut(L); pose(krass, KX - 2.2, 0, -2, PI / 2 - .3, L, { aRx: 1.4, aRe: .3 }, 'sad', { mouth: 'flat' }); pose(ich, KX + 2.2, 0, -2, -PI / 2 + .3, L, { aLx: 1.4, aLe: .3, aRx: 2.6, aRz: .4 }, 'joy', { mouth: 'open_smile' });
  attach(COINS[0], ich.aL.hand, [0, -.6, .3], [0, 0, 0], 1.4); badge('red', 'VERKAUFT', W / 2, H * .13, (L.lt - .2) * 3); cm([KX, 6, 14, KX, 5, -2, 46], [KX, 7, 12, KX, 6, -2, 46], L.k); }, [[0, 'stamp', .7], [.2, 'cash', .5]]);
// 88 «Und den goldenen Whirlpool.»: yo en el jacuzzi de oro con las gafas de sol de Krass, relajado
shot(85.75, 'P', null, L => { villaS(L, 'noon'); pose(ich, VX, .55, -1, 0, L, { aLx: .2, aLz: 1.35, aRx: .2, aRz: 1.35, aLe: .2, aRe: .2, lean: -.25, lLx: 1.4, lRx: 1.4 }, 'happy', { eyes: 'happy', mouth: 'smile' }); ich.blob.visible = false;
  coinBurst(V(VX + 1, 5, 0), L.t0 + .2, L.T, 8, 0, { y0: 2.6, vy: 6, spread: 3.5 }); cm([VX + 9, 11, 26, VX, 3, -1, 46], [VX + 6, 8.4, 19, VX, 3.4, -1, 44], L.k); }, [[0, 'bubbles', .7], [.3, 'ahh', .5]]);
// 89 «Und dem Jungen im blauen Hoodie baute ich»: al atardecer, la cancha nueva de oro aparece; el chico y yo entramos
shot(87.32, 'I', null, L => { neuPlatz(L, 'dusk'); walk(blau, L, NX - 2, 30, PI, 2.4, 0, { expr: 'shock', mouth: 'o' }); walk(ich, L, NX + 2, 30, PI, 2.4, 1, { expr: 'happy', mouth: 'open_smile' });
  cm([NX + 30, 30, 60, NX, 4, 0, 50], [NX + 18, 18, 48, NX, 4, 4, 48], L.k); }, [[0, 'magic_reveal', .7], [.3, 'choir', .4]]);
// 90 «den besten Platz der Welt.»: el letrero DER BESTE PLATZ DER WELT, canastas de oro, el chico con la boca abierta; zoom lento
shot(88.94, 'Z', 'slow', L => { neuPlatz(L, 'dusk'); pose(blau, NX - 1.6, 0, 20, PI, L, { aLx: .6, aLz: .5, aLe: 1.6, aRx: .6, aRz: .5, aRe: 1.6, headX: -.3 }, 'shock', { mouth: 'o' }); pose(ich, NX + 2.4, 0, 21, PI + .4, L, { aRx: 1.6, aRz: -.1, headY: -.3 }, 'happy', { mouth: 'open_smile' });
  cm([NX + 8, 15, 42, NX, 11, -20, 46], [NX + 7.5, 15.5, 38, NX, 13, -30, 44], L.k); }, []);
// 91 «Er sagte nicht Danke.»: el chico se gira hacia mí, serio; silencio
shot(90.43, 'S', null, L => { neuPlatz(L, 'dusk'); pose(blau, NX - 1.6, 0, 6, -PI / 2 + .4, L, { aLx: .1, aRx: .1 }, 'neutral', { mouth: 'flat' }); pose(ich, NX + 2.4, 0, 6.4, PI / 2 - .4, L, { aLx: .3, aRx: .3, headX: -.05 }, 'happy', { mouth: 'smile' });
  orb(L.k, V(NX + .4, 3.6, 6.2), null, [17, .1, .1, 44], [15, -.05, .08, 44]); }, [[0, 'silence', .3]]);
// 92 «Er sagte:»: coge el balón con una sonrisa
shot(91.64, 'R', null, L => { neuPlatz(L, 'dusk'); pose(blau, NX - 1.6, 0, 6, -PI / 2 + .4, L, { aLx: 1.2, aLe: 1.0, aRx: 1.2, aRe: 1.0 }, 'smug', { mouth: 'grin' }); BALL.visible = true; BALL.position.copy(hp(blau)).add(V(0, -2.4, 1.2));
  onFace(blau, 4.6, 0, .4, 42, L.k, 4); }, [[0, 'ball_catch', .6]]);
// 93–95 «HUSS, HUSS, HUSS!»: en la cancha de oro: bote (cara), los dos botando, plano general con fuegos de monedas
const FIN = HUSSW.slice(-3);
FIN.forEach((tg, j) => shot(tg, ['C', 'G', 'Z'][j], j === 0 ? 'punch' : null, L => { neuPlatz(L, 'dusk'); const sp = 1 / ((FIN[2] - FIN[0]) / 2);
  put(blau, NX - 1.6, 0, 6, .2); actuar(blau, 0, [[0, bounceP(L.T, tg, sp)]], { T: L.T }); cara(blau, L.T, { expr: 'shout', mouth: L.lt < .2 ? 'scream' : 'open_smile', eyes: 'squint' }); const g = bounce(blau, L.T, tg, sp);
  if (j > 0) { put(ich, NX + 2.6, 0, 6.6, -.2); actuar(ich, 0, [[0, bounceP(L.T, tg, sp)]], { T: L.T }); cara(ich, L.T, { expr: 'joy', mouth: 'open_smile' }); bounce(ich, L.T, tg, sp, BALL2); }
  bubble(blau, 'HUSS!', L.lt * 6, 1.4); hussFx(g, tg, L.T, 1.3); badge('big', 'HUSS!', W / 2, H * .13, L.lt * 5); coinBurst(g.clone().add(V(0, 1, 0)), tg, L.T, 10, j * 10, { y0: 0, vy: 10, spread: 4 });
  if (j === 0) onFace(blau, 4.4, .2, .5, 44, L.k, 3.9); else if (j === 1) orb(L.k, V(NX + .5, 3.6, 6.3), null, [17, .15, .12, 46], [15, 0, .1, 46]); else { cm([NX + 30, 12, 12, NX, 4, 6, 48], [NX + 34, 15, 16, NX, 5, 6, 48], L.k); confetti(V(NX, 2, 4), tg, L.T, 60, 22); } },
  [[0, 'ball_slam', .9], [.04, 'coin_jingle', .6]]));

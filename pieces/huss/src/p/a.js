// ---------- a: gancho, las fiestas de cada noche, nadie entrena (0 – 16,15 s) ----------
const dance = (ch, T, ph = 0, extra = {}) => { const b = Math.sin(T * 9 + ph); applyPose(ch, { aLx: .35, aLz: 2.2 + b * .35, aRx: .35, aRz: 2.2 - b * .35, aLe: .3, aRe: .3, lean: Math.sin(T * 4.5 + ph) * .08, sx: Math.sin(T * 4.5 + ph) * .25, crouch: .12 + Math.abs(b) * .1, lLk: .2 + Math.max(0, b) * .5, lRk: .2 + Math.max(0, -b) * .5, lLx: Math.max(0, b) * .4, lRx: Math.max(0, -b) * .4, headZ: Math.sin(T * 4.5 + ph) * .15, ...extra }); };
const party = (chs, T, base, sp = 4.2, ry = 0) => chs.forEach((c, i) => { const r = RNG(i * 7 + 3); put(c, base.x + (i % 3 - 1) * sp + (r() - .5) * 1.4, base.y, base.z - Math.floor(i / 3) * sp * .9 + (r() - .5), ry + (r() - .5) * .8); hat(c); dance(c, T, i * 1.3); grin(c, T); });
const holdBall = (ch, T) => { applyPose(ch, { aRx: .35, aRz: .15, aRe: 1.6, aLz: .15, aLe: .3, headX: .02 }); const w = loc(ch, 1.2, 2.55, .45); show(BALL, w.x, w.y, w.z); return w; };
// 1 «In dieser Stadt geht jeder auf Partys»: la calle de noche llena de fiesta; yo delante con el balón bajo el brazo
// 1 «In dieser Stadt»: yo haciendo toques en mitad de la calle de noche; detrás, el pueblo de fiesta
shot(0, 'Z', null, L => { street(); OR.FEST.visible = true; windows('party', L.T); party([...K.slice(0, 6)], L.T, V(0, 0, -22), 4.6, 0);
  const me = put(ich, .3, 0, 2, .05); trick(me, BALL, L.T, [.04, .22, .4, .58, .74], ['up', 'knee', 'up', 'knee', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  fireworks(V(0, 0, -70), L.T, 3, 12); orb(L.k, V(.3, 3.0, 2), null, [13.5, .25, .05, 46], [12.5, .15, .05, 46]); sh(V(0, 0, 0), 30); }, [[.04, 'kick', .5], [.22, 'kick', .4], [.4, 'kick', .5], [.58, 'kick', .4], [.3, 'cheer', .3]]);
// 2 «geht jeder auf Partys»: grúa sobre la calle llena de gente bailando con gorros de fiesta
shot(.76, 'W', null, L => { street(); OR.FEST.visible = true; windows('party', L.T);
  party([...K, ...XT.slice(0, 4)], L.T, V(0, 0, -6), 4.2, 0);
  fireworks(V(0, 0, -60), L.T, 3, 12); confRain(V(0, 0, -8), L.T, 60, 22, 18, 14);
  orb(L.k, V(0, 3.2, -8), null, [20, .1, .32, 48], [17, .02, .26, 48]); sh(V(0, 0, -8), 30); }, [[0, 'swipe', .5], [.2, 'cheer', .45], [.4, 'firework', .5], [1.0, 'party_horn', .4]]);
shot(2.21, 'C', 'punch', L => { bolz(); const me = put(ich, BX, 0, 6, 0); holdBall(me, L.T); talk(me, L.T, 2.21, 3.03, 'smug');
  onFace(me, 9.2, -.4, .8, 38, L.k, 8.2); sh(V(BX, 0, 4), 30); }, [[0, 'thump', .6], [.2, 'hmm', .3]]);
// 3 HUSS (toques): contrapicado frontal, el balón sube y baja de un pie al otro
shot(3.03, 'W', null, L => { bolz(); const ts = hussIn(3.0, 4.2); const me = put(ich, BX, 0, 2, .1); const b = trick(me, BALL, L.T, ts, ['roll', 'step', 'elastico', 'step', 'roll']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
   orb(L.k, V(BX, 1.9, 2), null, [11.5, .2, .06, 46], [10.5, .45, .06, 46]); sh(V(BX, 0, 2), 30); }, [[0, 'swipe', .5]]);
// 4 HUSS (toques y tiro a la portería pequeña): plano lateral, el balón entra y la red se hincha
shot(3.48, 'F', null, L => { bolz(); const ts = hussIn(3.0, 3.9); const me = put(ich, BX + .5, 0, -4, PI + .9); const kt = 3.93;
  if (L.T < kt - .15) { trick(me, BALL, L.T, ts, ['roll', 'step', 'elastico', 'step']); } else { applyPose(me, kickPose(clamp((L.T - (kt - .15)) / .3))); const a = loc(me, .5, 1.0, 1.4).toArray(), g = [BX, 2.2, -15.5]; const k = clamp((L.T - kt) / .2); const p = shotBall(BALL, a, g, .5, k, L.T); BZ.GO.userData.bulge(clamp((L.T - kt - .18) / .1) * (1 - clamp((L.T - kt - .4) / .4)));  }
  cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: L.T > kt ? 'grimace' : 'flat' });
  orb(L.k, V(BX - .6, 2.0, -6), null, [13, PI + 1.15, .12, 46], [11.5, PI + 1.05, .1, 46]); sh(V(BX, 0, -6), 30); }, [[0, 'flash', .4], [.62, 'trash_hit', .5]]);
// 5 «Denn hier steigt jede einzelne Nacht»: grúa sobre el pueblo de noche, ventanas de colores y fuegos artificiales
shot(4.13, 'Z', null, L => { street(); OR.FEST.visible = true; windows('party', L.T); party([...K, ...XT], L.T, V(0, 0, -30), 4.6, 0);
  fireworks(V(0, 0, -80), L.T, 3, 16); const k = easeInOut(L.k); cam([22 - k * 10, 48 - k * 18, 40 - k * 16], [0, 4, -40], 52); sh(V(0, 0, -40), 60); }, [[0, 'whoosh_up', .5], [.3, 'firework', .6], [.9, 'firework', .5], [1.4, 'cheer', .3]]);
// 6 «irgendwo eine Party»: fiesta en el jardín delantero de una casa: baile, globos, altavoz
shot(6.03, 'W', null, L => { street(); windows('party', L.T); const cx = -15.5, cz = 36;
  [K[2], K[5], XT[1], K[7], XT[2]].forEach((c, i) => { put(c, cx + (i % 2) * 1.2 - .6, 0, cz + 6 - i * 3, PI / 2 + (i % 2 ? -.3 : .3)); hat(c); dance(c, L.T, i * 1.7); grin(c, L.T); });
  confRain(V(cx, 0, cz), L.T, 40, 8, 14, 12); orb(L.k, V(cx, 3.4, cz + 1), null, [15, PI / 2 + .12, .2, 48], [13.5, PI / 2 + .05, .18, 48]); sh(V(cx, 0, cz), 30); }, [[0, 'swipe', .5], [.2, 'cheer', .4], [.8, 'laugh_m', .3]]);
// 7 «Poolpartys»: alguien salta en bomba a la piscina iluminada; otros con flotadores
shot(7.77, 'S', null, L => { use('GT'); night(60); const px = GX - 16, pz = 10;
  const j = put(K[1], px + 5.6, 0, pz + .6, -PI / 2); hat(j); saltar(j, L.lt, .05, { h: 1.6, dur: .45, base: [px + 5.6, 0, pz + .6] }); actuar(j, 0, [[0, 'cheer']], { T: L.T, weight: false, breathe: false }); grin(j, L.T);
  [XT[0], K[4]].forEach((c, i) => { put(c, px - 1.8 + i * 3.4, -1.6, pz - 1.4 + i, i ? -.4 : .4); hat(c); applyPose(c, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5 }); grin(c, L.T); show(FLOATS[i], c.root.position.x, 1.5, c.root.position.z); });
  show(FLOATS[2], px + 2, 1.5, pz + 2.6); FLOATS[2].rotation.x = 0; [0, 1, 2].forEach(i => FLOATS[i].rotation.set(PI / 2, 0, 0));
  
  orb(L.k, V(px + 3.2, 2.8, pz + .8), null, [17, -1.3, .2, 48], [15.5, -1.2, .2, 48]); sh(V(px, 0, pz), 30); }, [[0, 'swipe', .4], [.4, 'splash', .7], [.1, 'kids_laugh', .3]]);
// 8 «Pizzapartys»: mesa de la cocina llena de pizzas; tres amigos cogen porciones
shot(8.33, 'R', null, L => { use('KU'); inside(1.0, 60); const tx = KX - 5, tz = 2;
  show(PZ[2], tx - 2, 4.25, tz - .4, .1); show(PZ[3], tx + 1.8, 4.25, tz - .5, -.15);
  [[XT[3], -3.4, .3], [K[6], 3.4, -.3], [K[3], 0, 0]].forEach(([c, dx, ry], i) => { put(c, tx + dx, 0, tz + 3.6 + (i === 2 ? .8 : 0), ry); hat(c); actuar(c, L.lt, [[0, 'idle'], [.1 + i * .15, { aRx: 1.5, aRz: -.2, aRe: .6, lean: .2 }, { dur: .25 }], [.6 + i * .1, { aRx: 2.1, aRe: 1.9, aRz: -.3, headX: -.1 }, { dur: .3 }]], { T: L.T }); laughF(c, L.T); });
  { const c = K[3]; const w = loc(c, 0, 3.0, 1.9); show(PZ[3], w.x, w.y, w.z, 0, .95); } const s0 = K[6]; if (L.lt > .7) { const h = s0.aR.hand; attach(SLICE, h, [0, -.5, .3], [PI / 2, 0, 0], .9); }
  orb(L.k, V(tx, 3.8, tz + 2.6), null, [16, .08, .12, 48], [14.5, .03, .12, 48]); sh(V(tx, 0, tz), 30); }, [[0, 'whirl', .4], [.3, 'paper', .4], [.7, 'chew', .4], [.9, 'laugh_m', .3]]);
// 9 «Sogar eine Geburtstagsparty»: el salón de fiestas, tarta con velas, todos cantan alrededor
shot(9.59, 'Z', null, L => { use('SA'); inside(1.0, 40); SA.LC.forEach((l, i) => l.intensity = 50 + Math.sin(L.T * 6 + i) * 30); SA.DB.rotation.y = L.T;
  [XT[0], K[0], XT[4], K[5], XT[2]].forEach((c, i) => { put(c, AX - 6 + i * 3, 0, -1.8 + Math.abs(i - 2) * .4, PI + (i - 2) * .12); c.root.rotation.y = 0; hat(c); dance(c, L.T, i); grin(c, L.T); });
  SA.FB.userData.fish.userData.swim(L.T); SA.FB.userData.bubbles(L.T); confRain(V(AX, 0, -4), L.T, 50, 18, 10, 14);
  orb(L.k, V(AX, 4.4, -5), null, [20, 0, .1, 48], [17, 0, .1, 46]); sh(V(AX, 0, -5), 30); }, [[0, 'whoosh_up', .5], [.2, 'party_horn', .5], [.6, 'cheer', .35]]);
// 10 «für Herrn Blubb, den Goldfisch»: golpe de zoom a la pecera: el pez con su gorrito delante de la tarta
shot(10.89, 'C', 'punch', L => { use('SA'); inside(1.0, 50); SA.LC.forEach((l, i) => l.intensity = 50 + Math.sin(L.T * 6 + i) * 30); const f = SA.FB.userData.fish; f.userData.swim(L.T); f.userData.face(true); f.rotation.y = Math.sin(L.T * 1.3) * .3; SA.FB.userData.bubbles(L.T);
  const p = wpos(SA.FB); cam([p.x - 1.5 + L.k * .4, p.y + 2.8, p.z + 8.2 - L.k * 1.2], [p.x - .4, p.y + 2.2, p.z], 40); badge3('tag', 'HERR BLUBB', p.clone().add(V(0, 5.2, 0)), (L.lt - .25) * 3); sh(p, 20); }, [[0, 'impact_soft', .6], [.2, 'water_bloop', .5], [.6, 'sparkle', .4]]);
// 11 «Deshalb trainiert hier niemand»: el Bolzplatz de día, abandonado: conos tirados, un chico dormido con gorro de fiesta
shot(12.38, 'W', null, L => { bolz(false); BZ.CONES.forEach((c, i) => { c.rotation.set(i % 2 ? PI / 2 : 0, 0, i % 3 ? PI / 2 : 0); c.position.y = i % 2 || i % 3 ? .45 : .55; });
  const z = put(XT[2], BX + .5, .55, 2.4, 0); hat(z); applyPose(z, { aLx: .15, aLz: .35, aRx: 2.9, aRe: .4, lRx: .45, lRk: .7, headY: .35 }); z.root.rotation.set(-PI / 2, 0, 0); cara(z, L.T, { eyes: 'closed', mouth: 'wavy' });
  show(BALL, BX - 2.4, .3, .6); BALL.scale.set(1, .45, 1);
  orb(L.k, V(BX + .5, .8, .2), null, [12.5, .35, .62, 46], [11, .25, .66, 46]); sh(V(BX, 0, 0), 30); }, [[0, 'whoosh_soft', .4], [.3, 'snore', .5], [.9, 'wind', .3]]);
// 12 «Wozu auch?»: una chica con gorro de fiesta se encoge de hombros delante de la casa de la fiesta
shot(13.92, 'F', 'punch', L => { street(); OR.FEST.visible = true; windows('party', L.T); const c = put(K[4], -12.6, 0, 20, PI / 2 + .25); hat(c); actuar(c, L.lt, [[0, 'idle'], [.05, 'shrug', { dur: .3 }]], { T: L.T }); talk(c, L.T, 13.92, 14.7, 'smug');
  party([K[2], XT[1], K[7]], L.T, V(-17, 0, 24), 3.6, PI / 2);
  onFace(c, 9.5, -.2, -1.2, 40, L.k, 8.5); sh(V(-14, 0, 20), 30); }, [[0, 'flash', .4], [.15, 'hmm', .4]]);
// 13 «Morgen gibt's ja wieder eine Party»: cartel MORGEN PARTY! en una farola; un chico lo señala emocionado
shot(14.70, 'S', null, L => { street(); windows('party', L.T); show(POSTER, 9.4, 0, -4, -PI / 2 - .25);
  const c = put(K[1], 5.4, 0, -1.4, -PI / 2 + .9); hat(c); actuar(c, L.lt, [[0, 'idle'], [.1, 'point', { dur: .25 }], [.8, 'cheer', { dur: .3 }]], { T: L.T }); grin(c, L.T); saltar(c, L.lt, .8, { h: 1.2, dur: .4, base: [5.4, 0, -1.4] });
  orb(L.k, V(7.6, 4.2, -2.8), null, [17, -.65, .08, 46], [15.5, -.75, .08, 46]); sh(V(7, 0, -3), 30); }, [[0, 'swipe', .4], [.15, 'paper', .5], [.8, 'jump', .5], [.9, 'cheer', .3]]);

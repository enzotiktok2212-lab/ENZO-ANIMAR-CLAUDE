// ---------- a: gancho, la fiesta, mi entrenamiento (0 – 32,05 s) ----------
const P0 = V(-6, 0, -6);   // centro de la fiesta en la plaza
const dancers = (L, cx, cz, list, r = 3.2, face = null) => list.forEach((c, i) => { const a = (i / list.length) * PI * 1.4 - PI * .7 + PI; const x = cx + Math.sin(a) * r * (i % 2 ? 1 : .7), z = cz + Math.cos(a) * r * .6 - 1.5;
  partyGuy(c, x, z, face ? faceTo(V(x, 0, z), face) : 0, L.T, i * 1.3, i % 2 ? 'laugh' : 'joy'); });
const deskBase = (L, n = 10) => { stubeN(L, 12); ST.TW.forEach((t, i) => t.userData.set([n, n + 6, n + 3][i])); };

// 1 «In dieser Stadt sind alle feiern,» (zoom lento): la plaza llena de fiesta, Udo y los colegas bailando en el centro, fuegos artificiales
shot(0, 'Z', 'slow', L => { townN(L, 24, P0.x, P0.z, 6, 22, 3); partyGuy(udo, P0.x, P0.z + 1, 0, L.T, 0, 'laugh'); dancers(L, P0.x, P0.z, [K[0], XT[0], K[1], XT[1]], 3.4);
  orb(L.k, V(P0.x, 3.8, P0.z + 1), null, [19, .12, .14, 48], [12.5, .05, .1, 46]); confRain(V(P0.x, 0, P0.z + 2), L.T, 50, 14, 10, 12); sh(V(P0.x, 0, P0.z), 30); },
  [[0, 'party_horn', .6], [.2, 'cheer', .6], [.6, 'firework', .5], [1.2, 'confetti', .5]]);
// 2 «außer mir.»: yo en mi cuarto, serio, la fiesta al otro lado de la ventana
shot(1.79, 'C', 'punch', L => { deskBase(L, 6); const c = atDesk({ aLx: .3, aRx: .3, aLz: -.9, aRz: -.9, aLe: 1.9, aRe: 1.9, headX: .05 }, L.T); cara(c, L.T, { expr: 'determined', eyes: 'half', mouth: 'flat' }); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5);
  orbit(V(SX, 4.1, -3), lerp(9, 8, L.k), .06, .1, 42); sh(V(SX, 0, -3), 16); }, [[0, 'thud', .5], [.2, 'crickets', .3]]);
// 3–6 HUSS ×6 (ráfaga 1)
shot(2.60, 'C', null, L => hussShot(L, 1, 'top'), hussSfx(1, 2.60, 2.98));
shot(2.98, null, null, L => hussShot(L, 1, 'face'), hussSfx(1, 2.98, 3.55));
shot(3.55, 'C', null, L => hussShot(L, 1, 'side'), hussSfx(1, 3.55, 3.95));
shot(3.95, null, null, L => hussShot(L, 1, 'low'), hussSfx(1, 3.95, 4.55));
// 7 «Die feiern für alles:»: colegas brindando y bailando bajo las guirnaldas
shot(4.55, 'W', null, L => { townN(L, 16, 20, -30, 6, 18, 5); dancers(L, 20, -30, [K[2], XT[2], K[3]], 2.6); orb(L.k, V(20, 3.6, -31), null, [17, -.5, .12, 46], [15, -.25, .1, 46]); sh(V(20, 0, -30), 24); },
  [[0, 'cheer', .5], [.4, 'clack', .4]]);
// 8 «einen Geburtstag,»: la abuela sopla las velas de la tarta, todos con gorro
shot(5.42, 'F', null, L => { townN(L, 14, 36, -40, 6, 16, 7); put(oma, 36, 0, -40, 0); hat(oma); const blow = L.lt > .35; actuar(oma, 0, [[0, { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.2, aRe: 1.2, lean: blow ? .25 : .1, headX: .2 }]], { T: L.T }); cara(oma, L.T, { expr: 'joy', mouth: blow ? 'o' : 'open_smile' });
  show(PTAB, 37.6, 0, -38.4); show(CAKE, 37.6, 2.2, -38.4, 0, .6); partyGuy(K[4], 33.2, -39.5, .6, L.T, 1); partyGuy(XT[3], 38.8, -39.5, -.6, L.T, 2); if (blow) confetti(V(36, 0, -38), L.t0 + .4, L.T, 50, .7);
  orbit(V(36.5, 4.2, -39.4), lerp(11.5, 10, L.k), -.25, .2, 44); sh(V(36, 0, -39), 16); }, [[0, 'pop', .4], [.35, 'party_horn', .6], [.45, 'confetti', .5]]);
// 9 «einen Dienstag,»: Lena baila con el calendario DIENSTAG – PARTY!
shot(6.36, 'S', null, L => { townN(L, 14, -30, 10, 6, 18, 11); const c = put(XT[0], -30, Math.abs(Math.sin(L.T * 8)) * .3, 10, 0); hat(c); actuar(c, 0, [[0, { aLx: 2.3, aRx: 2.3, aLz: .1, aRz: .1, aLe: .5, aRe: .5, hipY: Math.sin(L.T * 8) * .25 }]], { T: L.T }); laughF(c, L.T);
  show(CALDI, -27.4, 5.6, 9.4, -.2, .8); partyGuy(K[5], -33, 8.5, .4, L.T, 3); partyGuy(EX[20], -27, 8.5, -.4, L.T, 4);
  orb(L.k, V(-28.8, 4.6, 10), null, [12, -.2, .1, 46], [10.5, .05, .08, 46]); sh(V(-30, 0, 10), 18); }, [[0, 'pages', .5], [.3, 'cheer', .4]]);
// 10 «einmal, weil jemand eine Kartoffel»: el niño levanta la patata con forma de corazón
shot(7.50, 'C', 'punch', L => { townN(L, 14, 10, 30, 6, 16, 13); const c = put(kid, 10, 0, 30, 0); hat(kid); const up = easeOut(clamp(L.lt / .4)); actuar(c, 0, [[0, { aLx: lerp(.4, 2.9, up), aRx: lerp(.4, 2.9, up), aLz: .15, aRz: .15, aLe: .2, aRe: .2, headX: -.25 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'open_smile' });
  const hp_ = c.aR.hand.getWorldPosition(V()), hl = c.aL.hand.getWorldPosition(V()); show(POT, (hp_.x + hl.x) / 2, (hp_.y + hl.y) / 2 + .55, (hp_.z + hl.z) / 2 + .1, 0, .42);
  orbit(V(10, 3.8, 30), lerp(9, 7.5, L.k), .15, .02, 46); sh(V(10, 0, 30), 16); }, [[0, 'sparkle', .6], [.3, 'gasp', .4]]);
// 11 «in Herzform gefunden hat.»: todos lo levantan en hombros, confeti, corazón gigante
shot(8.80, 'Z', null, L => { townN(L, 20, 10, 30, 6, 18, 17); const c = put(kid, 10, 2.6 + Math.sin(L.T * 7) * .25, 30, 0); hat(kid); actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .3, aRz: .3, lLx: .3, lRx: .3 }]], { T: L.T }); laughF(c, L.T);
  [[K[6], -1.3], [XT[4], 1.3]].forEach(([k, s], i) => { put(k, 10 + s, 0, 28.9, 0); hat(k); actuar(k, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: s < 0 ? -.4 : .2, aRz: s < 0 ? .2 : -.4, aLe: .4, aRe: .4 }]], { T: L.T + i }); laughF(k, L.T + i); });
  const hp_ = c.aR.hand.getWorldPosition(V()), hl = c.aL.hand.getWorldPosition(V()); show(POT, (hp_.x + hl.x) / 2, (hp_.y + hl.y) / 2 + .55, (hp_.z + hl.z) / 2, Math.sin(L.T * 3) * .3, .5); hearts(V(10, 7.5, 30.5), L.T); confetti(V(10, 0, 30), L.t0, L.T, 60);
  orb(L.k, V(10, 5.4, 30), null, [16, -.15, .08, 48], [13, .15, .1, 48]); sh(V(10, 0, 30), 18); }, [[0, 'cheer', .7], [.2, 'confetti', .5], [.6, 'party_horn', .5]]);
// 12 «Während die anderen feiern,»: grúa sobre la plaza llena (DJ, bombillas)
shot(10.0, 'W', null, L => { townN(L, 24, 20, 4, 5, 20, 19); partyGuy(K[7], 20, 6, 0, L.T, 2); partyGuy(XT[5], 17.5, 4.5, .4, L.T, 3);
  cm([8, 18, 30, 20, 3, 0, 50], [6, 10, 22, 20, 3, 2, 48], L.k); sh(V(20, 0, 4), 30); }, [[0, 'cheer', .5], [.3, 'firework', .5]]);
// 13 «übrigens,»: primer plano: me giro a cámara, serio
shot(11.08, 'C', null, L => { deskBase(L, 8); const c = atDesk({ ...GEST.cross, headY: lerp(-.5, 0, easeOut(clamp(L.lt / .3))) }, L.T); cara(c, L.T, { expr: 'sus', eyes: 'half', mouth: 'flat' }); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(.3);
  onFace(c, 5.2, 0, .3, 38, L.k, 4.6); sh(V(SX, 0, -3), 14); }, [[0, 'whoosh', .4], [.2, 'blink', .4]]);
// 14 «bin ich hier drin»: plano general del cuarto: yo envolviendo, torres de paquetes, la fiesta en la ventana
shot(11.86, 'S', null, L => { deskBase(L, 14); const c = atDesk(wrapIdle(L.T), L.T); cara(c, L.T, { expr: 'determined' }); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(wrapLoop(L.T, 1.2));
  orb(L.k, V(SX, 3.6, -3), null, [17, .35, .14, 46], [15, .2, .12, 46]); sh(V(SX, 0, -3), 18); }, [[0, 'paper', .5], [.5, 'cloth', .4]]);
// 15 «und bereite mich auf mein»: el calendario en la pared: FREITAG 13 – GESPRÄCH! (rodeado en rojo)
shot(12.86, 'F', null, L => { deskBase(L, 14); const c = atDesk(wrapIdle(L.T), L.T); cara(c, L.T, { expr: 'determined', eyes: 'side_l' });
  cm([SX - 8.5, 6.4, 3.6, SX - 14.7, 6.2, 3.5, 40], [SX - 9.6, 6.3, 3.5, SX - 14.7, 6.2, 3.5, 40], L.k); sh(V(SX, 0, -3), 18); }, [[0, 'pages', .5], [.3, 'pencil', .4]]);
// 16 «Vorstellungsgespräch vor.» (zoom lento): el cartel WIR STELLEN EIN; señalo con el dedo
shot(13.66, null, 'slow', L => { deskBase(L, 14); const c = put(ich, SX - 12.6, 0, -.6, PI / 2 + .25); actuar(c, 0, [[0, { aLx: 2.0, aLz: .3, aLe: .1, headY: -.3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'smirk' });
  orb(L.k, V(SX - 13.0, 5, -2.0), null, [13, 1.25, .08, 46], [10, 1.3, .06, 44]); sh(V(SX - 12, 0, -3), 16); }, [[0, 'pop', .4]]);
// 17–19 HUSS ×6 (ráfaga 2)
shot(14.90, 'C', null, L => hussShot(L, 2, 'face', 'ST', { side: -.3, base: 6 }), hussSfx(2, 14.90, 15.82));
shot(15.82, null, null, L => hussShot(L, 2, 'top', 'ST', { base: 6 }), hussSfx(2, 15.82, 16.25));
shot(16.25, 'C', null, L => hussShot(L, 2, 'side', 'ST', { base: 6 }), hussSfx(2, 16.25, 16.62));
// 20 «Der Job:»: la Brötchenburg de día, la cámara entra
shot(16.62, 'Z', null, L => { burgOut(L); partyCrowd(L, BX, 52, 6, 4, 12, 21, { mode: 'walk', hats: false });
  orb(L.k, V(BX, 6.2, 40), null, [34, 0, .04, 48], [28, .05, .05, 48]); sh(V(BX, 0, 44), 30); }, [[0, 'city_amb', .5], [.2, 'car_pass', .3]]);
// 21 «Burger einwickeln»: el cartel del escaparate: WIR STELLEN EIN! – Burger-Einwickler
shot(17.18, 'C', 'punch', L => { burgOut(L); const p = V(BX + 5.9, 2.85, 40.5); cm([p.x - .4, p.y + .1, p.z + 7.2, p.x, p.y, p.z, 38], [p.x - .2, p.y, p.z + 6.2, p.x, p.y, p.z, 38], L.k); sh(V(BX, 0, 44), 20); }, [[0, 'pop', .5], [.2, 'paper', .4]]);
// 22 «in der Brötchenburg.»: grúa hacia arriba: el letrero con el castillo-hamburguesa; yo delante mirando
shot(17.90, 'W', null, L => { burgOut(L); put(ich, BX, 0, 47, PI); actuar(ich, 0, [[0, { headX: -.35 }]], { T: L.T }); cara(ich, L.T, { expr: 'happy', eyes: 'up' });
  cm([BX + 3, 3.4, 60, BX, 5.2, 40, 50], [BX + 2, 4.5, 63, BX, 8, 40, 50], L.k); sh(V(BX, 0, 44), 30); }, [[0, 'sparkle', .5], [.4, 'ding_soft', .4]]);
// 23 «Also trainiere ich.»: me ato la cinta y crujo los dedos
shot(18.95, 'F', null, L => { deskBase(L, 14); const k = L.lt; const c = atDesk(k < .5 ? { aRx: 2.5, aRz: 1.2, aRe: 1.9, aLx: .3, aLz: .1, headX: -.05 } : { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9 + Math.sin(L.T * 30) * .1, aRe: 1.9, lean: .05 }, L.T); cara(c, L.T, { expr: 'determined', mouth: 'smirk' });
  onFace(c, 6, -.2, -.6, 40, L.k, 5); sh(V(SX, 0, -3), 14); }, [[0, 'cloth', .5], [.55, 'back_crack', .6]]);
// 24 «Halb fünf Uhr morgens:»: el despertador suena a las 4:30 en la mesa; me levanto de un salto (cuarto a oscuras, alba azul)
shot(20.05, 'C', 'punch', L => { use('ST'); inside(.5, 10); ST.LO.intensity = 0; ST.LI.intensity = 20; TINT = 'rgba(30,50,120,.18)'; ST.TW.forEach((t, i) => t.userData.set([14, 20, 17][i]));
  const sh_ = Math.sin(L.T * 60) * .06; show(ALM, SX - .4, 2.3, .2, sh_, .55); ALM.userData.draw('4:30'); const c = put(ich, SX, Math.max(0, Math.sin(clamp((L.lt - .2) / .5) * PI)) * 1.2, -3, 0); actuar(c, 0, [[0, 'shock']], { T: L.T }); cara(c, L.T, { expr: 'determined', eyes: 'wide' });
  cam([SX - 1.2, 3.6, 4.2], [SX - .4, 3.4, -1], 42); sh(V(SX, 0, -2), 14); }, [[0, 'alarm', .7], [.3, 'jump', .4]]);
// 25 «Handgelenke dehnen.»: primer plano: estiro las muñecas (muñequeras verdes)
shot(21.22, 'S', null, L => { use('ST'); inside(.7, 14); ST.LO.intensity = 0; TINT = 'rgba(40,60,130,.1)'; const r = Math.sin(L.T * 9); const c = atDesk({ aLx: 1.55, aRx: 1.55, aLz: -.25 + r * .2, aRz: -.25 - r * .2, aLe: .2, aRe: .2 }, L.T); cara(c, L.T, { expr: 'determined', eyes: 'squint' });
  c.aL.hand.rotation.x = r * .9; c.aR.hand.rotation.x = -r * .9; const h = hp(c); cam([h.x + 1.4, h.y + .2, h.z + 8.5], [h.x, h.y - 1.3, h.z + 1], 42); sh(V(SX, 0, -3), 14); }, [[0, 'back_crack', .5], [.4, 'cloth', .4]]);
// 26 «Dreihundert Burger»: las torres de paquetes crecen a toda velocidad; contador 300
shot(22.0, 'Z', null, L => { deskBase(L, 0); const n = Math.floor(easeOut(L.k) * 26); ST.TW.forEach((t, i) => t.userData.set(Math.min(30, 4 + n + i * 2))); const c = atDesk(wrapIdle(L.T, 3.2), L.T); cara(c, L.T, { expr: 'determined' }); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(wrapLoop(L.T, 3));
  badge('gold', String(Math.round(easeOut(L.k) * 300)), W / 2, H * .2, 1, 1, 1); orb(L.k, V(SX, 3.9, -3), null, [13, -.4, .18, 48], [11, -.25, .14, 48]); sh(V(SX, 0, -3), 18); }, [[0, 'count', .5], [.5, 'paper', .4]]);
// 27 «vor dem Frühstück.»: amanece en la ventana; la mesa llena; 300 en el contador
shot(23.0, 'W', null, L => { use('ST'); day(); inside(.9, 20); ST.LO.intensity = 0; ST.TW.forEach((t, i) => t.userData.set([30, 30, 30][i])); const c = atDesk(wrapIdle(L.T, 2.5), L.T); cara(c, L.T, { expr: 'determined', eyes: 'half' }); sweat(c, L.T, 2);
  badge('gold', '300', W / 2, H * .2, 1, 1, 1);
  orbit(V(SX, 3.6, -3), lerp(12, 10.5, L.k), .45, .1, 46); sh(V(SX, 0, -3), 18); }, [[0, 'rooster', .4], [.4, 'paper', .4]]);
// 28 «Ich esse kein Frühstück.»: me ponen el desayuno delante (huevo y bacon): niego con la cabeza
shot(24.08, 'F', null, L => { use('ST'); day(); inside(.9, 20); ST.LO.intensity = 0; ST.TW.forEach((t, i) => t.userData.set([30, 30, 30][i])); const c = atDesk({ aLx: .4, aRx: .4, aLz: -.9, aRz: -.9, aLe: 1.8, aRe: 1.8, headY: Math.sin(L.T * 9) * .35 }, L.T); cara(c, L.T, { expr: 'determined', mouth: 'flat' });
  show(PLT, DESK.x, DESK.y, DESK.z + .2, 0, .5); show(EGG, DESK.x, DESK.y, DESK.z + .2, 0, .5); orbit(V(SX, 3.5, -2.2), lerp(8, 7, L.k), -.25, .12, 42); sh(V(SX, 0, -3), 14); }, [[0, 'plate_slide', .5], [.4, 'sniff', .4]]);
// 29 «Ich wickle es ein.»: cenital: el desayuno desaparece en el papel → plato envuelto
shot(25.28, 'C', 'punch', L => { use('ST'); day(); inside(.9, 20); ST.LO.intensity = 0; const c = atDesk(wrapIdle(L.T, 3), L.T); cara(c, L.T, { expr: 'determined' }); const w = L.lt > .55;
  show(w ? WPLT : PLT, DESK.x, DESK.y, DESK.z + .2, 0, .5 * (w ? 1 + Math.sin(clamp((L.lt - .55) / .2) * PI) * .2 : 1)); if (!w) show(EGG, DESK.x, DESK.y, DESK.z + .2, 0, .5); dust(V(DESK.x, DESK.y, DESK.z), L.t0 + .55, L.T, 6, .25);
  cam([DESK.x + .2, DESK.y + 5.2, DESK.z + 1.8], [DESK.x, DESK.y, DESK.z], 42); sh(V(SX, 0, -3), 14); }, [[0, 'paper', .6], [.55, 'pop', .6]]);
// 30–33 «Falten, falten, stecken, rollen.»: cada palabra un plano; el envoltorio avanza
const fold = (p, kind) => L => { use('ST'); day(); inside(.9, 20); ST.LO.intensity = 0; ST.TW.forEach((t, i) => t.userData.set([22, 26, 24][i])); const c = atDesk(wrapIdle(L.T, 2), L.T); cara(c, L.T, { expr: 'determined', eyes: 'squint' });
  show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(lerp(p - .22, p, easeOut(clamp(L.lt / .3)))); const D = DESK;
  if (kind === 'top') cam([D.x - .2, D.y + 5, D.z + 1.4], [D.x, D.y, D.z], 40); else if (kind === 'side') cam([D.x + 4.8, D.y + 2, D.z + 2.6], [D.x, D.y + .4, D.z], 40); else cam([D.x - 3, D.y + 1, D.z + 3.6], [D.x, D.y + .5, D.z], 42); sh(V(SX, 0, -3), 14); };
shot(26.58, 'C', null, fold(.22, 'top'), [[0, 'paper', .7]]);
shot(27.20, 'C', null, fold(.44, 'side'), [[0, 'paper', .7]]);
shot(27.64, 'C', null, fold(.66, 'low'), [[0, 'cloth', .7]]);
shot(28.12, 'C', null, fold(1.0, 'top'), [[0, 'rip', .5], [.2, 'pop', .5]]);
// 34 «Fünf Sekunden.»: el cronómetro marca 5,0 en rojo; yo detrás, frustrado
shot(28.60, 'C', 'punch', L => { use('ST'); day(); inside(.9, 20); ST.LO.intensity = 0; const c = atDesk({ aLx: 1.1, aRx: 1.1, aLz: -.4, aRz: -.4, aLe: .9, aRe: .9 }, L.T); cara(c, L.T, { expr: 'angry' }); show(PARC[0], DESK.x + .6, DESK.y, DESK.z, .2, .5);
  swAt(DESK.x - .8, DESK.y, DESK.z + .9, .25, .42, '5,0', '#d8323a', 1); cam([DESK.x - .8, DESK.y + 2.2, DESK.z + 6.6], [DESK.x - .6, DESK.y + .9, DESK.z - .6], 44); sh(V(SX, 0, -3), 14); }, [[0, 'watch_click', .6], [.2, 'tick', .4]]);
// 35 «Zu langsam.»: me llevo las manos a la cabeza
shot(29.45, 'W', null, L => { use('ST'); day(); inside(.9, 20); ST.LO.intensity = 0; ST.TW.forEach((t, i) => t.userData.set([22, 26, 24][i])); const c = atDesk(GEST.hands_head, L.T); cara(c, L.T, { expr: 'angry', mouth: 'grimace_wide' }); show(PARC[0], DESK.x + .6, DESK.y, DESK.z, .2, .5);
  onFace(c, 7, .2, .8, 42, L.k, 6); badge('red', 'ZU LANGSAM', W / 2, H * .12, (L.lt - .1) * 4, 1, .75); sh(V(SX, 0, -3), 14); }, [[0, 'sigh', .5], [.3, 'sad_tone', .4]]);
// 36–39 HUSS ×6 (ráfaga 3)
shot(30.38, 'C', null, L => hussShot(L, 3, 'top', 'ST', { base: 12 }), hussSfx(3, 30.38, 30.78));
shot(30.78, null, null, L => hussShot(L, 3, 'face', 'ST', { base: 12, side: .35 }), hussSfx(3, 30.78, 31.35));
shot(31.35, 'C', null, L => hussShot(L, 3, 'side', 'ST', { base: 12, clock: T => ['4,0', '#e8a020', .8] }), hussSfx(3, 31.35, 31.75));
shot(31.75, null, null, L => hussShot(L, 3, 'low', 'ST', { base: 12 }), hussSfx(3, 31.75, 32.05));

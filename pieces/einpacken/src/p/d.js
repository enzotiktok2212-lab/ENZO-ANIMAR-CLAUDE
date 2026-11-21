// ---------- d: contratado, la fiesta del año en la Brötchenburg, 500 en 50 s, final (86,74 – fin) ----------
const counter2 = (L, hatOn = false) => { burgIn(L); const c = put(chef, BX - 1.2, 0, -2.2, 0); const m = put(ich, BX + 1.4, 0, 2.6, PI); if (hatOn) PHAT.visible = true; return [c, m]; };
// el bar lleno: extras mirando al mostrador, con gorro de fiesta (z de 5 a 22)
function fullHouse(L, n = 38, mode = 'party') { BB.PARTY.visible = true; const r = RNG(61); EXTRA.slice(0, n).forEach((c, i) => { const row = Math.floor(i / 9), col = i % 9; const x = BX - 13 + col * 3.2 + (row % 2) * 1.5 + (r() - .5), z = 9 + row * 4 + (r() - .5);
  const ry = faceTo(V(x, 0, z), V(BX, 0, -1)) + (r() - .5) * .4; if (mode === 'hungry') { put(c, x, 0, z, ry); actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: -.3, aRz: -.3, aLe: 1.6, aRe: 1.6, headX: -.15 + Math.sin(L.T * 6 + i) * .05 }]], { T: L.T }); cara(c, L.T + i, { expr: 'shock', mouth: Math.sin(L.T * 8 + i) > 0 ? 'o' : 'ah' }); }
  else partyGuy(c, x, z, ry, L.T, i * 1.3, i % 3 ? 'joy' : 'laugh'); hat(c); }); }
// 92 «„Sie sind eingestellt“, sagte er.»: el jefe me da la mano; confeti; EINGESTELLT
shot(86.74, 'F', null, L => { const [c, m] = counter2(L); actuar(c, 0, [[0, { aRx: 1.3, aRz: -.1, aRe: .3 + Math.sin(L.T * 10) * .1 }]], { T: L.T }); talk(c, L.T, 86.74, 88.3, 'joy'); actuar(m, 0, [[0, { aRx: 1.3, aRz: -.1, aRe: .3 + Math.sin(L.T * 10) * .1 }]], { T: L.T }); grin(m, L.T);
  confetti(V(BX, 2, 0), L.t0 + .2, L.T, 50, .8); badge('green', 'EINGESTELLT!', W / 2, H * .18, (L.lt - .25) * 4, 1, .8); orbit(V(BX + .1, 3.6, .2), lerp(16, 14.5, L.k), .45, .55, 44); sh(V(BX, 0, 0), 14); }, [[0, 'confetti', .5], [.2, 'cheer', .4], [.3, 'cash_reg', .5]]);
// 93 «„Wann können Sie anfangen?“»: el jefe pregunta, pulgar arriba
shot(88.40, 'W', null, L => { const [c, m] = counter2(L); actuar(c, 0, [[0, { aRx: 1.6, aRz: .3, aRe: 1.2 }]], { T: L.T }); talk(c, L.T, 88.4, 89.4, 'smile'); onFace(c, 7, .1, -1.1, 40, L.k, 6); sh(V(BX, 0, 0), 14); }, [[0, 'pop', .3]]);
// 94 «Ich hatte schon angefangen.»: yo ya detrás del mostrador, con el gorro de papel, envolviendo; torre al lado
shot(89.40, 'C', 'punch', L => { burgIn(L); PHAT.visible = true; const m = put(ich, BX, 0, -2.2, 0); actuar(m, 0, [[0, wrapIdle(L.T, 3)]], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: 'smirk' }); show(WR[0], BX, CTOP, .3, 0, .5); WR[0].userData.set(wrapLoop(L.T, 2.5));
  show(TWR[0], BX + 3.2, CTOP, .4, 0, .5); TWR[0].userData.set(9); const c = put(chef, BX - 4, 0, -2.6, .6); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); orbit(V(BX - .8, 3.8, -1.6), lerp(11, 10, L.k), -.25, .1, 44); sh(V(BX, 0, 0), 14); }, [[0, 'paper', .6], [.4, 'gasp', .4]]);
// 95 «Meine erste Schicht war Freitagnacht,»: la Brötchenburg de noche, guirnaldas, gente llegando
shot(90.53, 'Z', null, L => { use('BB'); night(45); BB.PARTY.visible = true; partyCrowd(L, BX, 50, 14, 4, 12, 71, { mode: 'walk', face: V(BX, 0, 40) }); badge('tag', 'FREITAG, 23 UHR', W / 2, H * .16, (L.lt - .2) * 4, 1, .9);
  orb(L.k, V(BX, 5.6, 42), null, [34, .2, .05, 48], [28, .1, .05, 48]); fireworks(V(BX, 14, 0), L.T, 3, 12); sh(V(BX, 0, 46), 30); }, [[0, 'city_amb', .4], [.4, 'cheer', .4], [1.0, 'firework', .4]]);
// 96 «die größte Party des Jahres.»: la plaza a reventar, fuegos artificiales enormes
shot(92.68, 'F', null, L => { townN(L, 24, -6, -10, 4, 20, 77); partyGuy(udo, -6, -8, 0, L.T, 0, 'laugh'); partyGuy(mayor, -9, -9, .3, L.T, 1); partyGuy(oma, -3, -9.5, -.3, L.T, 2); confRain(V(-6, 0, -8), L.T, 70, 18, 10, 14);
  badge('gold', 'PARTY DES JAHRES', W / 2, H * .16, (L.lt - .2) * 4, 1, .8); orb(L.k, V(-6, 5, -9), null, [20, -.2, .2, 50], [16, .1, .12, 48]); sh(V(-6, 0, -8), 30); }, [[0, 'firework', .7], [.3, 'cheer', .6], [.8, 'party_horn', .5]]);
// 97 «Um Mitternacht kam»: medianoche: el reloj marca 0:00 y la gente desfila hacia la Brötchenburg
shot(94.30, 'W', null, L => { use('BB'); night(45); BB.PARTY.visible = true; partyCrowd(L, BX, 46, 18, 2, 10, 79, { mode: 'walk', face: V(BX, 0, 40), gap: 1.2 }); show(ALM, BX - 4.5, 0, 50, .3, .9); ALM.userData.draw('0:00', '#d8323a');
  cam([BX - 8, 3.2, 60], [BX - 1, 3.6, 44], 48); sh(V(BX, 0, 48), 24); }, [[0, 'bells', .6], [.3, 'crowd_run', .5]]);
// 98 «die ganze Stadt rein.»: dentro: la multitud entra en tropel por la puerta
shot(95.30, 'C', null, L => { burgIn(L); BB.PARTY.visible = true; const r = RNG(83); EX.slice(0, 20).forEach((c, i) => { const row = Math.floor(i / 4); const z = 36 - row * 4 - L.k * 9 + (r() - .5), x = BX - 4 + (i % 4) * 2.6 + (r() - .5); put(c, x, 0, z, PI); actuar(c, 0, [[0, walkP(L.T * 1.4, i)]], { T: L.T }); hat(c); cara(c, L.T + i, { expr: 'joy', mouth: 'open_smile' }); });
  cam([BX + 2, 4.5, 4], [BX, 3.5, 24], 50); sh(V(BX, 0, 20), 24); }, [[0, 'crowd_run', .6], [.3, 'door_crash', .4]]);
// 99 «Hungrig.»: caras hambrientas en primera fila, manos en la tripa
shot(96.15, 'C', 'punch', L => { burgIn(L); BB.PARTY.visible = true; fullHouse(L, 27, 'hungry'); orbit(V(BX, 3.9, 6), lerp(8, 7, L.k), PI, .05, 44); sh(V(BX, 0, 8), 18); }, [[0, 'stomach', .7], [.2, 'growl', .3]]);
// 100 «Fünfhundert Leute.»: plano general desde detrás del mostrador: el local lleno; 500
shot(96.74, 'Z', null, L => { burgIn(L); fullHouse(L, 38); badge('gold', '500 LEUTE', W / 2, H * .15, (L.lt - .1) * 4, 1, .9); cm([BX + 1, 9.5, -6, BX, 3, 14, 52], [BX - 1, 8, -5, BX, 3.2, 14, 50], L.k); sh(V(BX, 0, 12), 30); }, [[0, 'cheer', .6], [.4, 'count', .4]]);
// 101 «Und nur ich.» (zoom lento): yo solo detrás del mostrador, con el gorro de papel
shot(98.18, null, 'slow', L => { burgIn(L); fullHouse(L, 20); PHAT.visible = true; const m = put(ich, BX, 0, -2.2, 0); actuar(m, 0, [[0, GEST.fists]], { T: L.T }); cara(m, L.T, { expr: 'determined', eyes: 'angry' }); show(WR[0], BX, CTOP, .3, 0, .5);
  onFace(m, 9, 2.4, .2, 42, easeIn(L.k), 6); sh(V(BX, 0, 0), 14); }, [[0, 'heartbeat', .5]]);
// 102–105 HUSS ×6 (ráfaga 6): en el mostrador, contador de hamburguesas
const cnt6 = n => String(Math.min(500, 20 + n * 80));
shot(99.30, 'C', null, L => { hussShot(L, 6, 'top', 'BB', { counter: cnt6 }); fullHouse(L, 12); }, hussSfx(6, 99.30, 99.70));
shot(99.70, null, null, L => { hussShot(L, 6, 'face', 'BB', { counter: cnt6, side: .3 }); fullHouse(L, 12); }, hussSfx(6, 99.70, 100.27));
shot(100.27, 'C', null, L => { hussShot(L, 6, 'side', 'BB', { counter: cnt6 }); fullHouse(L, 20); }, hussSfx(6, 100.27, 100.67));
shot(100.67, null, null, L => { hussShot(L, 6, 'wide', 'BB', { counter: cnt6, yaw: .5 }); fullHouse(L, 30); }, hussSfx(6, 100.67, 101.0));
// 106 «Fünfhundert Burger.»: torres de paquetes hasta el techo; 500
shot(101.0, 'C', 'punch', L => { burgIn(L); fullHouse(L, 30); PHAT.visible = true; const m = put(ich, BX, 0, -2.2, 0); actuar(m, 0, [[0, GEST.cross]], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: 'smirk' });
  TWR.forEach((t, i) => { show(t, BX + [-3.4, 3.4, 6.6][i], CTOP, [.2, .2, -.2][i], i * .3, .5); t.userData.set(40); }); badge('gold', '500', W / 2, H * .15, 1, 1, 1.1);
  orbit(V(BX, 5.4, -.6), lerp(16, 14, L.k), .25, .4, 50); sh(V(BX, 0, 0), 18); }, [[0, 'cash_reg', .6], [.2, 'cheer', .5]]);
// 107 «Fünfzig Sekunden.»: el cronómetro: 50 s (verde)
shot(101.96, 'F', null, L => { burgIn(L); fullHouse(L, 30); PHAT.visible = true; const m = put(ich, BX, 0, -2.2, 0); actuar(m, 0, [[0, GEST.cross]], { T: L.T }); cara(m, L.T, { expr: 'smug' });
  swAt(BX - 1.2, CTOP, .6, .2, .5, '50 s', '#1ab84a', 50 / 60); cam([BX - 1.2, CTOP + 2.6, 7.6], [BX - 1.1, CTOP + 1.0, -.4], 42); sh(V(BX, 0, 0), 14); }, [[0, 'watch_click', .6], [.3, 'ding_soft', .5]]);
// 108 «Der Bürgermeister starrte mich an:»: el alcalde en primera fila, boquiabierto
shot(103.45, 'W', null, L => { burgIn(L); fullHouse(L, 26); const c = put(mayor, BX + .4, 0, 3.2, PI); hat(mayor); actuar(c, 0, [[0, { aLx: .3, aRx: .3, headX: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  onFace(c, 6.2, .2, .9, 40, L.k, 5.6); sh(V(BX, 0, 3), 14); }, [[0, 'gasp_old', .5], [.6, 'silence_tick', .4]]);
// 109 «„Wie hast du das gemacht?“»: el alcalde pregunta, señalando las torres
shot(105.04, 'C', null, L => { burgIn(L); fullHouse(L, 26); const c = put(mayor, BX + .4, 0, 3.2, PI); hat(mayor); actuar(c, 0, [[0, { aRx: 1.5, aRz: .4, aRe: .2 }]], { T: L.T }); talk(mayor, L.T, 105.04, 106.37, 'shock');
  TWR.forEach((t, i) => { show(t, BX + [-3.4, 3.4, 6.6][i], CTOP, [.2, .2, -.2][i], i * .3, .5); t.userData.set(40); }); onFace(c, 6.6, .6, -.9, 40, L.k, 6); sh(V(BX, 0, 3), 14); }, [[0, 'pop', .3]]);
// 110 «„Während ihr gefeiert habt“,»: yo respondo, tranquilo
shot(106.37, 'S', null, L => { burgIn(L); fullHouse(L, 20); PHAT.visible = true; const m = put(ich, BX, 0, -2.2, 0); actuar(m, 0, [[0, { aRx: .9, aRz: .3, aRe: .8 }]], { T: L.T }); talk(ich, L.T, 106.37, 107.6, 'smug'); onFace(m, 6.4, 1.4, .6, 40, L.k, 5.8); sh(V(BX, 0, 0), 14); }, [[0, 'whoosh', .3]]);
// 111 «sagte ich, „übrigens.“» (zoom lento): primer plano, guiño
shot(107.60, null, 'slow', L => { burgIn(L); fullHouse(L, 20); PHAT.visible = true; const m = put(ich, BX, 0, -2.2, 0); actuar(m, 0, [[0, GEST.cross]], { T: L.T }); cara(m, L.T, L.lt > .7 ? { expr: 'smug', eyes: 'wink', mouth: 'smirk' } : { expr: 'smug', mouth: 'smirk' }); onFace(m, 6.4, 1.4, -.4, 40, easeIn(L.k), 5); sh(V(BX, 0, 0), 14); }, [[.75, 'sparkle', .5]]);
// 112–115 HUSS ×6 (ráfaga 7, final): de vuelta al trabajo, el último paquete aplasta la torre
shot(109.05, 'C', null, L => { hussShot(L, 7, 'face', 'BB', { side: -.3 }); fullHouse(L, 12); }, hussSfx(7, 109.05, 109.45));
shot(109.45, null, null, L => { hussShot(L, 7, 'top', 'BB'); fullHouse(L, 12); }, hussSfx(7, 109.45, 110.02));
shot(110.02, 'C', null, L => { hussShot(L, 7, 'side', 'BB'); fullHouse(L, 20); }, hussSfx(7, 110.02, 110.42));
shot(110.42, null, null, L => { hussShot(L, 7, 'wide', 'BB', { yaw: -.4 }); fullHouse(L, 30); }, hussSfx(7, 110.42, 111.6).concat([[.5, 'cheer', .5]]));

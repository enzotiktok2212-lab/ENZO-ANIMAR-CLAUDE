// ---------- b: lo envuelvo todo, Udo, «un vida, una entrevista», manos invisibles (32,05 – 54,05 s) ----------
const roomN = (L, n = 16) => { stubeN(L, 12); ST.TW.forEach((t, i) => t.userData.set([n, n + 6, n + 3][i])); };
// 40 «Ich wickle den Burger ein.»: cenital: una hamburguesa entra en el papel → paquete
shot(32.05, 'C', null, L => { roomN(L); const c = atDesk(wrapIdle(L.T, 2.4), L.T); cara(c, L.T, { expr: 'determined' }); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(easeInOut(clamp(L.lt / 1.1)));
  cam([DESK.x + .3, DESK.y + 5.4, DESK.z + 1.7], [DESK.x, DESK.y, DESK.z], 42); sh(V(SX, 0, -3), 14); }, [[0, 'paper', .6], [.5, 'cloth', .5], [1.0, 'pop', .5]]);
// 41 «Ich wickle den Teller ein.»: el plato vacío → plato envuelto (pop)
shot(33.42, 'W', null, L => { roomN(L); const c = atDesk(wrapIdle(L.T, 2.4), L.T); cara(c, L.T, { expr: 'determined', eyes: 'squint' }); const w = L.lt > .55;
  show(w ? WPLT : PLT, DESK.x, DESK.y, DESK.z + .1, 0, .5 * (w ? 1 + Math.sin(clamp((L.lt - .55) / .2) * PI) * .2 : 1)); dust(V(DESK.x, DESK.y, DESK.z), L.t0 + .55, L.T, 6, .25);
  cam([DESK.x + 1.2, DESK.y + 6.2, DESK.z + 3.2], [DESK.x, DESK.y + .2, DESK.z], 42); sh(V(SX, 0, -3), 14); }, [[0, 'porcelain_break', .25], [.5, 'paper', .6], [.6, 'pop', .5]]);
// 42 «Ich wickle den Dackel»: el perro salchicha del vecino sobre la mesa, olisqueando; le miro
shot(34.62, 'F', null, L => { roomN(L); const c = atDesk({ aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: .9, aRe: .9, lean: .15, headX: .3 }, L.T); cara(c, L.T, { expr: 'sus', eyes: 'down' }); show(DOG, DESK.x, DESK.y, DESK.z + .3, .5, .42); DOG.userData.set(false, L.T);
  cam([DESK.x + 2.2, DESK.y + 2.2, DESK.z + 4.4], [DESK.x, DESK.y + 1, DESK.z], 42); sh(V(SX, 0, -3), 14); }, [[0, 'sniff', .6], [.4, 'bark', .3]]);
// 43 «von meinem Nachbarn ein.»: ¡pop! el Dackel envuelto, solo asoma la cabeza
shot(35.50, 'C', 'punch', L => { roomN(L); const c = atDesk({ aLx: 1.0, aRx: 1.0, aLz: .4, aRz: .4, aLe: .4, aRe: .4, headX: .1 }, L.T); cara(c, L.T, { expr: 'smug' }); show(DOG, DESK.x, DESK.y, DESK.z + .3, .2, .42 * (1 + Math.sin(clamp(L.lt / .25) * PI) * .15)); DOG.userData.set(true, L.T);
  dust(V(DESK.x + .8, DESK.y, DESK.z + .3), L.t0, L.T, 4, .12); orbit(V(SX, 3.4, -1.6), lerp(9, 8, L.k), -.2, .1, 42); sh(V(SX, 0, -3), 14); }, [[0, 'paper', .6], [.1, 'pop', .6]]);
// 44 «Dem Dackel geht's gut.»: primer plano del perro envuelto, contento, lengua fuera
shot(36.62, 'S', null, L => { roomN(L); atDesk(wrapIdle(L.T, 1.5), L.T); cara(ich, L.T, { expr: 'smile' }); show(DOG, DESK.x, DESK.y, DESK.z + .3, .1, .42); DOG.userData.set(true, L.T); DOG.userData.head.rotation.z = Math.sin(L.T * 4) * .15;
  const h = wpos(DOG.userData.head); cam([h.x + .9, h.y + .3, h.z + 3.6], [h.x, h.y - .2, h.z], 38); sh(V(SX, 0, -3), 14); }, [[0, 'bark', .4], [.5, 'sniff', .3]]);
// 45 «Dem Dackel ist warm.»: se le cierran los ojos; corazones
shot(37.80, 'Z', null, L => { roomN(L); atDesk(wrapIdle(L.T, 1.5), L.T); show(DOG, DESK.x, DESK.y, DESK.z + .3, -.1, .42); DOG.userData.set(true, L.T); DOG.userData.head.rotation.x = .25; const h = wpos(DOG.userData.head);
  hearts(h.clone().add(V(0, .3, 0)), L.T); cm([h.x - .8, h.y + .5, h.z + 3.4, h.x, h.y, h.z, 38], [h.x - .5, h.y + .4, h.z + 2.8, h.x, h.y, h.z, 38], L.k); sh(V(SX, 0, -3), 14); }, [[0, 'zzz', .4], [.3, 'sparkle', .4]]);
// 46 «Mein Nachbar Udo feiert»: Udo en la plaza con su gorro, bailando delante de los altavoces
shot(38.98, 'W', null, L => { townN(L, 18, 24, 2, 6, 16, 23); partyGuy(udo, 14, 10, -.4, L.T, 0, 'laugh'); notes(V(14, 7, 10), L.T); orb(L.k, V(14, 3.8, 10), null, [13, -.6, .1, 46], [11, -.4, .08, 46]); sh(V(14, 0, 10), 18); }, [[0, 'cheer', .5], [.4, 'party_horn', .4]]);
// 47 «jede einzelne Nacht.»: Udo encima de una mesa, fuegos artificiales; «JEDE NACHT»
shot(40.08, 'F', null, L => { townN(L, 20, -20, 30, 6, 18, 29); show(PTAB, -20, 0, 30); const c = partyGuy(udo, -20, 30, 0, L.T, 2, 'laugh'); c.root.position.y += 2.3; fireworks(V(-20, 12, -10), L.T, 3, 16);
  badge('big', 'JEDE NACHT', W / 2, H * .17, (L.lt - .2) * 4, 1, .8); orb(L.k, V(-20, 5.6, 30), null, [13, .2, .02, 48], [12, -.1, .05, 48]); sh(V(-20, 0, 30), 18); }, [[0, 'firework', .6], [.3, 'cheer', .5]]);
// 48 «„Komm raus“, sagt er.»: Udo asoma por la puerta de mi cuarto y me hace señas
shot(41.47, 'C', null, L => { roomN(L); ST.DOOR.rotation.y = -PI / 2 + 1.2; const u = put(udo, SX + 12.2, 0, 2.6, -PI / 2 - .25); hat(udo); actuar(u, 0, [[0, { aRx: 1.9, aRz: .9 + Math.sin(L.T * 10) * .3, aRe: .5 + Math.sin(L.T * 10) * .4, aLx: .3 }]], { T: L.T }); talk(udo, L.T, 41.47, 42.74, 'joy');
  const c = atDesk(wrapIdle(L.T, 2), L.T); cara(c, L.T, { expr: 'determined', eyes: 'side_r' }); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(wrapLoop(L.T, 1.5)); bubble(udo, 'Komm raus!', (L.lt - .05) * 4);
  cm([SX + 3.4, 4.6, 7.4, SX + 12.2, 3.6, 2.4, 46], [SX + 4.4, 4.4, 6.8, SX + 12.2, 3.6, 2.4, 44], L.k); sh(V(SX + 6, 0, 0), 18); }, [[0, 'door_open', .6], [.3, 'cheer', .3]]);
// 49 «„Man lebt nur einmal.“»: Udo en primer plano, brazos abiertos; «NUR EINMAL!»
shot(42.74, 'W', null, L => { roomN(L); ST.DOOR.rotation.y = -PI / 2 + 1.2; const u = put(udo, SX + 12.2, 0, 2.6, -PI / 2 - .25); hat(udo); actuar(u, 0, [[0, { aLx: 1.6, aRx: 1.6, aLz: .9, aRz: .9, aLe: .3, aRe: .3, headX: -.1 }]], { T: L.T }); talk(udo, L.T, 42.74, 43.96, 'joy');
  badge('gold', 'NUR EINMAL!', W / 2, H * .18, (L.lt - .15) * 4, 1, .8); onFace(u, 7, 0, .4, 40, L.k, 6); sh(V(SX + 10, 0, 2), 14); }, [[0, 'party_horn', .4]]);
// 50 «Genau.»: primer plano, yo serio asintiendo
shot(43.96, 'C', 'punch', L => { roomN(L); const c = atDesk({ ...wrapIdle(L.T, 1), headX: Math.sin(clamp(L.lt / .35) * PI) * .3, headY: .35 }, L.T); cara(c, L.T, { expr: 'determined', eyes: 'half', mouth: 'smirk' }); onFace(c, 6, 0, -.6, 40); sh(V(SX, 0, -3), 14); }, [[0, 'thud', .4]]);
// 51 «Ein Leben, ein Vorstellungsgespräch.» (zoom lento): 1 LEBEN = 1 GESPRÄCH; señalo el calendario
shot(44.46, null, 'slow', L => { roomN(L); const c = put(ich, SX - 12.6, 0, 6, PI / 2 + .3); actuar(c, 0, [[0, { aRx: 2.0, aRz: .3, aRe: .1, headY: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  badge('gold', '1 LEBEN', W / 2, H * .15, (L.lt - .05) * 4, 1, .75); badge('red', '1 GESPRÄCH', W / 2, H * .24, (L.lt - .8) * 4, 1, .75);
  orb(L.k, V(SX - 13.0, 5, 5.0), null, [13, 1.4, .06, 46], [10, 1.35, .05, 44]); sh(V(SX - 12, 0, 2), 16); }, [[0, 'pop', .5], [.8, 'pop', .5]]);
// 52–55 HUSS ×6 (ráfaga 4)
shot(46.48, 'C', null, L => hussShot(L, 4, 'face', 'ST', { base: 18, side: -.35 }), hussSfx(4, 46.48, 46.85));
shot(46.85, null, null, L => hussShot(L, 4, 'top', 'ST', { base: 18 }), hussSfx(4, 46.85, 47.42));
shot(47.42, 'C', null, L => hussShot(L, 4, 'side', 'ST', { base: 18 }), hussSfx(4, 47.42, 47.82));
shot(47.82, null, null, L => hussShot(L, 4, 'wide', 'ST', { base: 18, yaw: .4 }), hussSfx(4, 47.82, 48.33));
// 56–59 «Falten, falten, stecken, rollen.» (más rápido)
const fold2 = (p, kind) => L => { roomN(L, 24); const c = atDesk(wrapIdle(L.T, 3), L.T); cara(c, L.T, { expr: 'determined', eyes: 'angry' }); sweat(c, L.T, 2);
  show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(lerp(p - .22, p, easeOut(clamp(L.lt / .2)))); const D = DESK;
  if (kind === 'top') cam([D.x + .3, D.y + 4.6, D.z + 1.2], [D.x, D.y, D.z], 40); else if (kind === 'side') cam([D.x - 4.4, D.y + 1.8, D.z + 2.6], [D.x, D.y + .4, D.z], 40); else cam([D.x + 2.6, D.y + .9, D.z + 3.4], [D.x, D.y + .5, D.z], 42); sh(V(SX, 0, -3), 14); };
shot(48.33, 'C', null, fold2(.22, 'top'), [[0, 'paper', .7]]);
shot(48.95, 'C', null, fold2(.44, 'side'), [[0, 'paper', .7]]);
shot(49.41, 'C', null, fold2(.66, 'top'), [[0, 'cloth', .7]]);
shot(49.85, 'C', null, fold2(1.0, 'low'), [[0, 'rip', .5], [.15, 'pop', .5]]);
// 60 «Drei Sekunden.»: cronómetro 3,0 (amarillo)
shot(50.20, 'C', 'punch', L => { roomN(L, 24); const c = atDesk(wrapIdle(L.T, 3.4), L.T); cara(c, L.T, { expr: 'determined' }); show(WR[0], DESK.x + .8, DESK.y, DESK.z, 0, .5); WR[0].userData.set(wrapLoop(L.T, 2.5));
  swAt(DESK.x - .9, DESK.y, DESK.z + .9, .2, .42, '3,0', '#e8a020', .6); cam([DESK.x - .8, DESK.y + 2.2, DESK.z + 6.6], [DESK.x - .6, DESK.y + .9, DESK.z - .6], 44); sh(V(SX, 0, -3), 14); }, [[0, 'watch_click', .6]]);
// 61 «Eine Sekunde.»: cronómetro 1,0 (verde), chispas
shot(51.05, 'F', null, L => { roomN(L, 28); const c = atDesk(wrapIdle(L.T, 5), L.T); cara(c, L.T, { expr: 'determined', eyes: 'angry' }); show(WR[0], DESK.x + .8, DESK.y, DESK.z, 0, .5); WR[0].userData.set(wrapLoop(L.T, 4.5));
  swAt(DESK.x - .9, DESK.y, DESK.z + .9, .2, .42, '1,0', '#1ab84a', .2); confetti(V(DESK.x - .9, DESK.y - 2, DESK.z + 1), L.t0 + .1, L.T, 20, .4); cam([DESK.x - 1.4, DESK.y + 2.2, DESK.z + 6.4], [DESK.x - .6, DESK.y + .9, DESK.z - .4], 44); sh(V(SX, 0, -3), 14); }, [[0, 'watch_click', .6], [.1, 'sparkle', .5]]);
// 62 «Irgendwann konnte ich meine eigenen»: plano lateral: las manos van tan rápido que son un borrón con estelas
function blurHands(L, c) { const sp = Math.sin(L.T * 70); c.aL.sh.rotation.x -= sp * .25; c.aR.sh.rotation.x += sp * .25; c.root.updateMatrixWorld(true);
  const hs = [c.aL.hand.getWorldPosition(V()), c.aR.hand.getWorldPosition(V())]; GHOST.forEach((g, i) => { const h = hs[i % 2]; g.visible = true; g.position.copy(h).add(V(Math.sin(L.T * 50 + i) * .5, Math.cos(L.T * 43 + i * 2) * .3, Math.sin(L.T * 37 + i) * .3)); g.rotation.set(L.T * 9 + i, i, 0); });
  STREAK.forEach((s, i) => { const h = hs[i % 2]; s.visible = true; s.position.copy(h).add(V((i % 7 - 3) * .2, .2 + (i % 3) * .15, (i % 5 - 2) * .2)); s.lookAt(camera.position); s.rotateZ(PI / 2 + Math.sin(i) * .4); s.material.opacity = .4 + .4 * Math.abs(Math.sin(L.T * 20 + i)); }); BLUR = .025; }
shot(51.80, 'W', null, L => { roomN(L, 28); const c = atDesk(wrapIdle(L.T, 6), L.T); cara(c, L.T, { expr: 'determined', eyes: 'angry' }); sweat(c, L.T, 2); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(wrapLoop(L.T, 5));
  cam([DESK.x + 6, DESK.y + 2.8, DESK.z + 5], [DESK.x, DESK.y + 1.3, DESK.z - .8], 42); POST.push(() => blurHands(L, c)); sh(V(SX, 0, -3), 14); }, [[0, 'whoosh', .5], [.4, 'whoosh_up', .4], [.8, 'paper', .5]]);
// 63 «Hände nicht mehr sehen.»: yo miro mis manos-borrón, alucinado
shot(53.0, 'C', 'punch', L => { roomN(L, 28); const c = atDesk({ ...wrapIdle(L.T, 6), headX: .45 }, L.T); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(wrapLoop(L.T, 5));
  onFace(c, 5.4, .3, .9, 42, L.k, 4.8); POST.push(() => blurHands(L, c)); sh(V(SX, 0, -3), 14); }, [[0, 'gasp', .6], [.2, 'whoosh', .4]]);

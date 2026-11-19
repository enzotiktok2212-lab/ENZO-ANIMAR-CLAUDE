// ---------- a: gancho, «wir schauen dir zu», la promesa del Marktplatz, Frieda (0 – 21,97 s) ----------
const P0 = V(-6, 0, 2);   // centro de la plaza
const STOPH = { aRx: 1.75, aRz: -.1, aRe: .05, aLx: .3, aLz: .2, lean: -.08, headX: -.05 };   // mano en alto: «¡Moment!»
function hookStreet(L, push = 1) { town(L); const T = L.T; const j = caminar(junge, L.lt, { x: P0.x, z: P0.z - 6, ry: 0, run: true, speed: 7, T, extra: { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5 } }); cara(junge, T, { expr: 'joy', mouth: 'open_smile' });
  [[-14, -10, .3], [4, -16, -.2], [-20, -24, .4], [10, -28, -.3], [-2, -34, 0]].forEach(([x, z, ry], i) => { const c = EX[i]; caminar(c, L.lt + i * .2, { x, z, ry, run: true, speed: 6.5, T: T + i, extra: { aLx: 2.2, aRx: 2.2 } }); cara(c, T + i, { expr: 'joy', mouth: 'open_smile' }); });
  crowdAt(L, P0.x, P0.z - 20, 12, 10, 26, 3, { from: 6, mode: 'walk' }); tafelAt(0, {}); TAF.userData.bulbs(1, T, 1);
  cm([P0.x + 1, 3.2, P0.z + 22, P0.x, 3.4, P0.z - 30, 46], [P0.x + .5, 3.0, P0.z + 15 + (1 - push) * 4, P0.x, 3.6, P0.z - 30, 44], L.k); sh(P0, 40); }

// 1 «In dieser Stadt … alle –» (zoom lento): la plaza llena de gente que corre feliz; al fondo la Tafel «SCHAUT GERADE»
shot(0, 'C', 'slow', L => { hookStreet(L); }, [[0, 'whoosh', .7], [.1, 'run_cobble', .6], [.2, 'cheer', .4], [.9, 'kids_laugh', .4]]);
// 2 «Moment!»: el chico frena en seco y levanta la mano; todos se paran detrás
shot(1.45, 'C', 'punch', L => { town(L); const c = put(junge, P0.x, 0, P0.z, 0); actuar(c, L.lt, [[0, runP(L.T)], [.12, STOPH]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); dust(V(P0.x, 0, P0.z), L.t0, L.T, 8, .6);
  rowAt(L, P0.x, P0.z - 9, 5, 4, -.9, .9, 'shock', 4, { jit: 1.5 }); onFace(c, 3.4, .2, .3, 38, L.k, 2.9); sh(P0, 20); }, [[0, 'slam', .8], [.05, 'land', .6], [.15, 'gasp', .6]]);
// 3 «Er schaut schon wieder zu»: picado; todos en corro miran ARRIBA, a la cámara (a ti)
shot(2.05, 'Z', null, L => { town(L); const c = put(junge, P0.x, 0, P0.z, 0); actuar(c, 0, [[0, { ...GEST.point, aRx: 2.8, aRz: .1, headX: -.6 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'up', mouth: 'o' });
  const cp = V(P0.x, lerp(34, 28, easeOut(L.k)), P0.z + 13); EX.slice(0, 22).forEach((e, i) => { const a = i / 22 * 6.283, r = 7 + (i % 2) * 3, x = P0.x + Math.sin(a) * r, z = P0.z + Math.cos(a) * r; put(e, x, 0, z, faceTo(V(x, 0, z), cp)); actuar(e, 0, [[0, i % 3 ? { aLx: .3, aRx: .3, headX: -.7 } : { ...GEST.point, aRx: 2.7, headX: -.7 }]], { T: L.T + i }); cara(e, L.T + i, { expr: 'stare', eyes: 'up', mouth: i % 2 ? 'o' : 'flat' }); });
  cam([cp.x, cp.y, cp.z], [P0.x, 0, P0.z - 1.5], 46); camera.up.set(0, 1, 0); sh(P0, 30); }, [[0, 'whoosh_up', .6], [.2, 'creepy_ting', .6], [.6, 'gasp', .5]]);
// 4 «Jeder weiß, dass du Videos über diese Stadt schaust»: tú, sentado en la cama, viendo «In dieser Stadt…» en el móvil
const EDGE = V(ZX + 12, 1.15, 3.2);
function duEdge(L, o = {}) { use('ZI'); inside(.75, 22); ZI.LMP.intensity = 60; const c = put(du, EDGE.x, EDGE.y, EDGE.z, 0); actuar(c, 0, [[0, { ...SIT, ...PHONEP }]], { T: L.T }); phoneIn(c, true, .7, 1.3, 1.0); PH.userData.set('plain', { prog: .2 + L.k * .5 }); cara(c, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' });
  GLOW.position.copy(wpos(PH)).lerp(hp(c), .4); GLOW.intensity = 16; return c; }
shot(3.25, 'W', null, L => { const c = duEdge(L); onFace(c, 4.2, .2, .6, 40, L.k, 3.6); sh(EDGE, 16); }, [[0, 'swipe', .6], [.3, 'notif', .5], [.8, 'kids_laugh', .3]]);
// 4b «… über diese Stadt schaust»: por encima del hombro, la pantalla: un vídeo de «In dieser Stadt»
shot(4.4, 'C', null, L => { const c = duEdge(L); const h = hp(c), ph = wpos(PH); cm([h.x + .9, h.y + 1.4, h.z - 1.3, ph.x, ph.y, ph.z, 34], [h.x + .7, h.y + 1.2, h.z - .8, ph.x, ph.y, ph.z, 30], L.k); sh(EDGE, 16); }, [[0, 'whoosh', .5], [.3, 'mobile', .5]]);
// 5 «Aber niemand weiß das hier:»: el chico se lleva el dedo a los labios; detrás, todos hacen «psst»
shot(5.55, 'F', null, L => { town(L); const c = put(junge, P0.x, 0, P0.z, 0); actuar(c, 0, [[0, { aRx: 2.3, aRz: -.4, aRe: 2.3, lean: .12, headX: .05 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'half', mouth: 'o' });
  rowAt(L, P0.x, P0.z - 7, 6, 4.5, -1, 1, 'shh', 5, { from: 2 }); onFace(c, 3.2, .3, -.4, 38, L.k, 2.6); sh(P0, 20); }, [[0, 'whisper', .7], [.4, 'sniff', .3], [.9, 'silence_tick', .5]]);
// 6 «Wir schauen dir zu.» (zoom lento): todo el pueblo, en filas, mira fijamente a la cámara
shot(7.15, 'C', 'slow', L => { town(L); tafelAt(0); TAF.userData.bulbs(1, L.T, 1); rowAt(L, P0.x, P0.z - 30, 7, 26, -.28, .28, 'stare', 6, { from: 0, face: V(P0.x, 0, 40) }); rowAt(L, P0.x, P0.z - 30, 9, 21, -.36, .36, 'stare', 7, { from: 7, face: V(P0.x, 0, 40) }); rowAt(L, P0.x, P0.z - 30, 9, 16, -.42, .42, 'stare', 8, { from: 16, face: V(P0.x, 0, 40) });
  for (const [ch, x] of [[frieda, -3], [kalle, 0], [krause, 3]]) { put(ch, P0.x + x, 0, P0.z - 3.5, 0); actuar(ch, 0, [[0, x ? { aLx: .2, aRx: .2 } : GEST.cross]], { T: L.T }); cara(ch, L.T, { expr: 'stare', mouth: 'smile' }); }
  cm([P0.x, 5.2, P0.z + 16, P0.x, 4.2, P0.z - 6, 46], [P0.x, 4.8, P0.z + 9, P0.x, 4.3, P0.z - 6, 44], L.k); sh(P0, 30); }, [[0, 'heartbeat', .6], [.6, 'creepy_ting', .5]]);
// 7 «Und zwar schon seit Wochen.»: el calendario de Frieda lleno de cruces; ella tacha otro día
shot(8.45, 'S', null, L => { use('FZ'); inside(.9, 30); show(KAL, FX - 2, 10, -14.6, 0, 1); const c = put(frieda, FX - 4.2, 0, -10.6, .5); actuar(c, L.lt, [[0, { aRx: 2.3, aRz: .1, aRe: .4, headX: -.1 }], [.5, { aRx: 2.0, aRz: .3, aRe: .5, headX: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' });
  cm([FX - 1.2, 9.6, -3.6, FX - 2.4, 8.6, -14, 44], [FX - 1.6, 9.4, -5.2, FX - 2.4, 8.8, -14, 42], L.k); sh(V(FX - 2, 0, -12), 14); }, [[0, 'whoosh_down', .5], [.2, 'pencil', .7], [.7, 'paper', .5]]);
// 8 «Und was am Ende auf unserem Marktplatz auf dich wartet,» (zoom lento): algo enorme tapado con una tela roja y «?»
shot(9.72, 'Z', 'slow', L => { town(L); SOFA.userData.cover.visible = true; BEAM.visible = true; rowAt(L, SX, SZ - 2, 10, 11, -1.2, 1.2, 'point', 9, { from: 0, face: V(SX, 0, SZ) }); orb(L.k, V(SX, 4.5, SZ), null, [34, .35, .14, 46], [22, .15, .1, 42]); sh(V(SX, 0, SZ), 30); }, [[0, 'whoosh', .6], [.3, 'cloth', .6], [1.0, 'gasp', .4], [1.8, 'strings', .5]]);
// 9 «hat bisher noch keiner gesehen.»: Kalle y Krause intentan mirar debajo de la tela; Papa les da en la mano
shot(12.35, 'C', null, L => { town(L); SOFA.userData.cover.visible = true; BEAM.visible = true; const k = put(kalle, SX - 3.2, 0, SZ + 6.4, .5); actuar(k, 0, [[0, GEST.sneak]], { T: L.T }); cara(k, L.T, { expr: 'sus', mouth: 'smirk' });
  const r = put(krause, SX + 1.2, 0, SZ + 7.2, -.2); actuar(r, 0, [[0, { ...GEST.sneak, aRx: 1.4, aRe: .2 }]], { T: L.T }); cara(r, L.T, { expr: 'sus', mouth: 'o' });
  const p = put(papa, SX + 5.6, 0, SZ + 8.4, -1.25); actuar(p, L.lt, [[0, { aRx: .3 }], [.6, { aRx: 2.4, aRz: .2, aRe: .2 }], [.85, { aRx: 1.1, aRe: .3, aLx: .9, aLe: 1.6 }]], { T: L.T }); cara(p, L.T, { expr: 'angry', mouth: 'grimace' });
  cm([SX - 1, 3.6, SZ + 22, SX + 1.2, 4.0, SZ + 6, 46], [SX - .5, 3.4, SZ + 19.5, SX + 1.2, 4.0, SZ + 6, 44], L.k); sh(V(SX, 0, SZ), 24); }, [[0, 'cloth', .6], [.6, 'whistle', .4], [.85, 'slam', .5], [1.2, 'gasp_old', .5]]);
// 10 «Frieda sieht dich.»: de noche, Frieda escondida tras un macetero con los prismáticos apuntándote
shot(14.08, 'I', null, L => { town(L, 'night'); const c = put(frieda, -26, 0, -6.5, 0); actuar(c, 0, [[0, { ...BINO, crouch: .35 }]], { T: L.T }); binoIn(c); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' });
  onFace(c, 3.3, .4, .4, 40, L.k, 2.6); sh(V(-26, 0, -8), 18); }, [[0, 'iris_pop', .6], [.1, 'crickets', .6], [.5, 'zoom_in', .5]]);
// 11 «Unter der Decke.»: tú, a oscuras, bajo la manta (de tienda) en la cama
shot(15.12, 'W', null, L => { zimmerN(L); duBed(L, { glow: 6 + L.k * 4, expr: 'neutral' }); cm([ZX + 13.4, 8, 6, BEDP.x, 4.6, BEDP.z, 42], [ZX + 13.2, 7.4, 3.6, BEDP.x, 4.6, BEDP.z, 40], L.k); sh(BEDP, 14); }, [[0, 'cloth', .7], [.3, 'wood_creak', .4]]);
// 12 «Handy an.»: la pantalla se enciende y te ilumina la cara de azul
shot(15.98, 'C', 'punch', L => { zimmerN(L); const c = duBed(L, { glow: L.lt < .08 ? 0 : 30, expr: 'happy', eyes: 'wide', mouth: 'smile' }); PH.userData.set('plain', { prog: .2 }); onFace(c, 3.6, -.2, 1.0, 38, L.k, 3.1); sh(BEDP, 14); }, [[0, 'power_on', .7], [.05, 'notif', .6]]);
// 13 «3:17 Uhr.»: el despertador digital de la mesilla
shot(16.45, 'Z', null, L => { zimmerN(L, '3:17'); duBed(L, { glow: 26 }); const p = V(ZX + 6, 3.45, -10.6); cm([p.x + 2.2, p.y + 1.8, p.z + 6.4, p.x, p.y + .6, p.z, 40], [p.x + 1.4, p.y + 1.1, p.z + 4.4, p.x, p.y + .4, p.z, 38], L.k); sh(p, 10); }, [[0, 'zoom_in', .5], [.2, 'clock_tick', .7], [.8, 'tick', .5]]);
// 13b «… Uhr.»: plano general del cuarto a oscuras: tú, iluminado por el móvil, y el reloj en primer término
shot(17.1, 'C', null, L => { zimmerN(L, '3:17'); duBed(L, { glow: 28 }); cm([ZX + 3, 7.5, 6, ZX + 10, 4.5, -8, 44], [ZX + 4, 7.2, 4.5, ZX + 10, 4.5, -8, 42], L.k); sh(BEDP, 14); }, [[0, 'whoosh', .4], [.2, 'owl', .5]]);
// 14 «Schon wieder.»: en la ventana, la cara de Frieda con los prismáticos
shot(17.73, 'S', null, L => { zimmerN(L); const c = put(frieda, ZX - 12, 4.6, -14.0, 0); actuar(c, 0, [[0, BINO]], { T: L.T }); binoIn(c); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'grin' }); FILL.intensity = 18; FILL.color.setRGB(.6, .7, 1);
  cm([ZX - 11.4, 9.6, -5.4, ZX - 12, 8.6, -14.4, 40], [ZX - 11.7, 9.2, -7.4, ZX - 12, 8.7, -14.4, 38], L.k); sh(V(ZX - 12, 0, -13), 10); }, [[0, 'creepy_ting', .6], [.3, 'glass_rattle', .4], [.6, 'sniff', .3]]);
// 15 «Deshalb stellt sie sich jede Nacht einen Wecker»: Frieda, en pijama en su cuarto, pone el despertador a las 3:17
shot(18.6, 'R', null, L => { use('FZ'); inside(.45, 14); const c = put(frieda, FX + 14, 1.3, -6.5, 0); actuar(c, 0, [[0, { ...SIT, aLx: 1.3, aRx: 1.3, aLe: 1.0, aRe: 1.0, aLz: -.2, aRz: -.2, headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'smirk' });
  attach(WECK, c.aR.hand, [-.5, -1.0, .5], [0, 0, 0], .55); WECK.userData.draw(L.k < .5 ? '2:00' : '3:17'); FILL.intensity = 26; FILL.color.setRGB(1, .85, .6);
  cm([FX + 11.5, 7.8, 4.5, FX + 13.6, 5.2, -6.5, 42], [FX + 11.8, 7.4, 2.4, FX + 13.6, 5.2, -6.5, 40], L.k); sh(V(FX + 14, 0, -6), 14); }, [[0, 'whoosh', .5], [.3, 'ratchet', .7], [.9, 'clock_spin', .6], [1.4, 'click_metal', .6]]);
cut(19.7, 'C', [-.5, .85, .3], [[0, 'whoosh', .4], [.15, 'watch_click', .6], [.5, 'yawn_f', .5]]);
// 16 «– damit sie dich nie verpasst.»: suena el despertador y Frieda salta de la cama con los prismáticos
shot(20.45, 'C', 'punch', L => { use('FZ'); inside(.5, 16); const T = L.T; show(WECK, FX + 10, 3.1, -9.6, .3, .55); WECK.userData.draw('3:17'); WECK.position.x += Math.sin(T * 60) * .06; rings(V(FX + 10, 4, -9.4), T, .9);
  const c = put(frieda, FX + 14, 3.0, -6.5, -.3); saltar(c, L.lt, .1, { h: 1.6, dur: .5, base: [FX + 14, 3.0, -6.5] }); if (L.lt > .8) actuar(c, 0, [[0, BINO]], { T }); if (L.lt > .8) binoIn(c); cara(c, T, { expr: 'shock', eyes: 'wide', mouth: 'open_smile' });
  cm([FX + 11, 8.6, 7, FX + 13, 5.6, -7, 46], [FX + 11.6, 8.2, 4.6, FX + 13, 6, -7, 44], L.k); sh(V(FX + 13, 0, -7), 14); }, [[0, 'alarm', .8], [.3, 'jump', .6], [.75, 'land', .5]]);

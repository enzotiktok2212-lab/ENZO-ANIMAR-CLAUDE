// ---------- d: Lena, la verdad y la campana (146,41 – 222,8 s) ----------
// Krause frente a Ben (BENP) mirando +z; Lena llega por detrás de Krause (desde -z) y choca con él.
const LENP = V(BENP.x - .3, 0, -106.2);
function lenaStand(L, o = {}) { const l = put(lena, LENP.x + (o.dx ?? 0), 0, LENP.z + (o.dz ?? 0), o.ry ?? 0); actuar(l, 0, [[0, { aLx: .3, aRx: .3, ...(o.pose || {}) }]], { T: L.T }); if (o.face) cara(l, L.T, o.face); else sleepFace(l, L.T); return l; }
function krauseDown(L, k) { const c = put(krause, BENP.x + 1.2, 0, -103.6 - k * 1.2, 0); c.root.rotation.x = -PI / 2 * easeIn(k) * .98; c.root.position.y = Math.sin(k * PI) * .4; actuar(c, 0, [[0, { aLx: 1.6 * k, aRx: 1.6 * k, aLz: .5 * k, aRz: .5 * k, lLx: .6 * k }]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); return c; }
// Lena y Ben en su cuarto: Lena sentada en el borde de la cama (LZX - 9 + 4,6, z = 0) mirando +x; Ben de pie delante (LZX - 1, z = 0) mirando -x
function lenaRoomPair(L, o = {}) { lenaRoom(L, { dawn: o.dawn ?? true }); const l = put(lena, LZX - 4.6, sitY(lena, 3.7), 0, PI / 2); actuar(l, 0, [[0, { ...sitPose(), aLx: .6, aRx: .6, aLe: .8, aRe: .8, ...(o.lp || {}) }]], { T: L.T, weight: false }); l.blob.visible = false;
  const b = put(ben, LZX + 1.4, 0, .4, -PI / 2); actuar(b, 0, [[0, { ...(o.bp || {}) }]], { T: L.T }); return [l, b]; }
const young = (fn) => { sepia(); fn(); };

// 138 «Da läuft jemand voll»: por detrás de Krause, una sonámbula (Lena, pijama burdeos) avanza recta hacia él
shot(146.41, 'W', null, L => { tunnel(L, -104); benDig(L, { dig: false }); krauseAt(L, -103.6, 1, { k: 50 }); const l = sleepWalk(lena, L, LENP.x, LENP.z - 6, 0, 2.6, 0, { t0: 0 });
  cm([BENP.x - 6, 7, -96, BENP.x - .3, 5, -108, 44], [BENP.x - 5.4, 7, -97, BENP.x - .3, 5, -108, 42], L.k); }, [[0, 'whoosh', .4], [.1, 'steps', .6]]);
// 139 «in Herrn Krause rein,»: ¡choque! Lena se estampa contra su espalda
shot(147.38, 'C', 'punch', L => { tunnel(L, -104); benDig(L, { dig: false }); const k = clamp(L.lt / .3); const kr = put(krause, BENP.x - .3 + k * 1.2, 0, -103.6 + k * .6, 0); lanternUp(kr, L, 1 - k * .6); actuar(kr, 0, [[0, { lean: .4 * k, aLx: 1.2 * k, aRx: 1.4, aLz: .5 * k }]], { T: L.T }); cara(kr, L.T, { expr: 'shock', mouth: 'o' });
  const l = sleepWalk(lena, L, LENP.x, LENP.z - 1.2, 0, 2.6 * (1 - k), 0); cm([BENP.x + 6, 6.4, -104, BENP.x, 5, -105.4, 42], [BENP.x + 5.4, 6.4, -104, BENP.x, 5, -105.4, 40], L.k); }, [[.2, 'thud', .8], [.22, 'impact', .6], [.3, 'gasp', .5]]);
// 140 «wie Schlafwandler das»: otro sonámbulo choca de frente con un poste de madera y sigue intentando andar
shot(148.31, 'S', null, L => { tunnel(L, -60); const c = put(SL[17], STX - 11.2 + .1, 0, -62.8, PI); const b = Math.max(0, Math.sin(L.T * 6)) * .15; actuar(c, 0, [[0, { ...sleepP(L.T, 2), lean: -b }]], { T: L.T }); sleepFace(c, L.T); onBody(c, 9, .6, .1, 42, L.k, 8); }, [[0, 'swipe', .4], [.15, 'knock', .6], [.5, 'knock', .5]]);
// 141 «manchmal tun,»: una sonámbula se choca con la vagoneta y rebota
shot(149.15, 'W', null, L => { tunnel(L, -60); const c = put(SL[22], STX, 0, -55.6 + Math.max(0, Math.sin(L.T * 5)) * .6, PI); actuar(c, 0, [[0, sleepP(L.T, 3)]], { T: L.T }); sleepFace(c, L.T); onBody(c, 9, -.6, .1, 42, L.k, 8); }, [[0, 'whoosh', .4], [.2, 'boing_metal', .5]]);
// 142 «und reißt ihn um.»: Krause cae de espaldas al suelo; el farol sale volando
shot(149.97, 'C', 'punch', L => { tunnel(L, -104); benDig(L, { dig: false }); const k = clamp(L.lt / .5); krauseDown(L, k); lenaStand(L, { dz: 1.6 }); const f = show(LANTF, BENP.x + 3 + k * 3, 4 + Math.sin(k * PI) * 3 - k * 3.6, -103 - k * 2, 0); f.rotation.z = k * 4;
  cm([BENP.x + 10, 5, -98, BENP.x + 1, 2.6, -105, 44], [BENP.x + 9, 5, -99, BENP.x + 1, 2.6, -105, 42], L.k); }, [[.4, 'thud', .8], [.45, 'impact', .7], [.5, 'metal_rip', .3]]);
// 143 «Die Laterne geht»: el farol rueda por el suelo, la llama vacila
shot(151.03, 'W', null, L => { tunnel(L, -104, { h: .5, fill: 16 }); const f = show(LANTF, BENP.x + 6 + L.lt * 1.4, .5, -105, 0); f.rotation.z = PI / 2; f.rotation.x = L.lt * 4; LANT.position.copy(f.position).add(V(0, 1, 0)); LANT.intensity = 40 * (1 - L.lt / .65) + Math.sin(L.T * 40) * 8;
  cm([BENP.x + 6, 2, -99, BENP.x + 6.6, .6, -105, 40], [BENP.x + 6.4, 1.8, -100, BENP.x + 6.8, .6, -105, 38], L.k); }, [[0, 'clack', .6], [.2, 'wheels', .3]]);
// 144 «aus.»: se apaga: la pantalla se queda casi a oscuras
shot(151.67, 'C', null, L => { tunnel(L, -104, { h: .15, fill: 3 }); for (const l of LP) l.intensity *= .15; DARK = .55; const f = show(LANTF, BENP.x + 7, .5, -105, 0); f.rotation.z = PI / 2; f.userData.bulb.visible = L.lt < .1;
  cm([BENP.x + 6, 2, -100, BENP.x + 7, .6, -105, 40], [BENP.x + 6, 2, -100, BENP.x + 7, .6, -105, 40], L.k); }, [[0, 'switch', .6], [.1, 'drone', .3]]);
// 145 «Im Dunkeln blinzle ich»: en la penumbra azul, Ben parpadea muy rápido, aliviado
shot(152.27, 'W', null, L => { tunnel(L, -102, { h: .25, fill: 5 }); for (const l of LP) l.intensity *= .2; DARK = .35; TINT = 'rgba(10,20,70,.25)'; const b = benDig(L, { dig: false, face: { eyes: (L.lt % .18) < .09 ? 'closed' : 'normal', mouth: 'smile', noBlink: true } }); b.red.visible = true;
  onFace(b, 3.4, 0, 0, 36, L.k, 3); }, [[0, 'breath', .6], [.2, 'blink', .4], [.4, 'blink', .4], [.6, 'blink', .4], [.8, 'blink', .4]]);
// 146 «fünfzig Mal.»: el contador sube hasta 50 con cada parpadeo
shot(153.39, 'C', null, L => { tunnel(L, -102, { h: .25, fill: 5 }); for (const l of LP) l.intensity *= .2; DARK = .3; TINT = 'rgba(10,20,70,.25)'; const b = benDig(L, { dig: false, face: { eyes: (L.lt % .12) < .06 ? 'closed' : 'normal', mouth: 'smile', noBlink: true } });
  onFace(b, 4.4, 0, .6, 38, L.k, 4); bigNum(Math.min(50, Math.round(L.lt / 1.0 * 50)) + '×', 1, 'cyan', .2, 1.2); }, [[0, 'blink', .4], [.25, 'blink', .4], [.5, 'blink', .4], [.75, 'blink', .4]]);
// 147 «Dann leuchtet er»: Krause, sentado en el suelo, vuelve a encender el farol: chispa y luz
shot(154.49, 'S', null, L => { tunnel(L, -104, { h: .3, fill: 6 }); for (const l of LP) l.intensity *= .3; const c = put(krause, BENP.x + 2.4, sitY(krause, .2), -106, 0); actuar(c, 0, [[0, { ...sitPose(), lLx: 1.3, lRx: 1.3, lLk: .3, lRk: .3, aRx: 1.2, aRe: .6, aLx: 1.0, aLe: 1.2 }]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'angry' });
  c.lantern.visible = true; c.root.updateMatrixWorld(true); const w = c.lantern.userData.bulb.getWorldPosition(V(0, 0, 0)); LANT.position.copy(w); LANT.intensity = L.lt > .3 ? 46 : 0; c.lantern.userData.bulb.visible = L.lt > .3; if (L.lt > .25 && L.lt < .5) sparks(w, L.t0 + .25, L.T, 10);
  onBody(c, 10, .3, .14, 42, L.k, 9, .3, 2); }, [[.25, 'ignite', .7], [.3, 'fire_crackle', .5]]);
// 148 «auf den,»: se levanta enfadado y gira el farol buscando quién ha sido
shot(155.37, 'W', null, L => { tunnel(L, -104); const c = put(krause, BENP.x + 2.4, 0, -104.6, -PI / 2 - .4 + L.lt); lanternUp(c, L, .9); cara(c, L.T, { expr: 'angry' }); onBody(c, 11, .4, .1, 42, L.k, 10); }, [[0, 'whoosh', .4], [.2, 'growl', .3]]);
// 149 «der ihn umgerannt hat.»: el haz de luz barre el túnel y se detiene en una silueta de pie
shot(155.87, 'S', null, L => { tunnel(L, -104, { h: .4, fill: 10 }); lenaStand(L, { dz: 1.6 }); const c = put(krause, BENP.x + 2.4, 0, -103.6, PI - .2); lanternUp(c, L, .95, { k: 30 }); cm([BENP.x + 4, 6.4, -98, BENP.x - .3, 5, -104.6, 42], [BENP.x + 3.6, 6.4, -98.6, BENP.x - .3, 5, -104.6, 40], L.k); }, [[0, 'swipe', .4], [.4, 'creepy_ting', .5]]);
// 150 «Lena.»: ¡golpe de zoom! Es Lena, iluminada por el farol
shot(156.86, 'C', 'punch', L => { tunnel(L, -104); const l = lenaStand(L, { dz: 1.6 }); const c = put(krause, BENP.x - .3, 0, -101.4, PI); lanternUp(c, L, 1, { k: 55 }); onFace(l, 4.6, 0, 0, 38, L.k, 4); badge('tag', 'LENA', W / 2, H * .2, clamp((L.lt - .1) / .2)); }, [[0, 'impact', .7], [.05, 'braam_short', .6]]);
// 151 «Ihr Blick ins Leere.»: mira al vacío, sin expresión
shot(157.59, 'W', null, L => { tunnel(L, -104); const l = lenaStand(L, { dz: 1.6 }); const c = put(krause, BENP.x - .3, 0, -101.4, PI); lanternUp(c, L, 1, { k: 55 }); onFace(l, 5.4, 0, .8, 40, L.k, 4.8); }, [[0, 'whoosh', .4], [.2, 'hum_low', .4]]);
// 152 «Zwei Minuten»: Krause le planta el farol delante de los ojos (los dos de perfil)
shot(158.53, 'S', null, L => { tunnel(L, -104); const l = lenaStand(L, { dz: 1.6 }); const c = put(krause, BENP.x - .3, 0, -101.4, PI); lanternUp(c, L, 1, { k: 55 }); cara(c, L.T, { expr: 'sus', eyes: 'squint' }); cm([BENP.x + 6.4, 6.6, -103, BENP.x - .3, 5.6, -103, 42], [BENP.x + 5.8, 6.6, -103, BENP.x - .3, 5.6, -103, 40], L.k); }, [[0, 'swipe', .4], [.1, 'clock_tick', .5]]);
// 153 «Licht in ihre Augen.»: cronómetro: 0:00 → 2:00; los ojos de Lena muy abiertos bajo la luz
shot(159.29, 'C', 'punch', L => { tunnel(L, -104); const l = lenaStand(L, { dz: 1.6 }); const c = put(krause, BENP.x - .3, 0, -101.4, PI); lanternUp(c, L, 1, { k: 60 }); l.red.visible = L.lt > .6; onFace(l, 3.4, 0, 0, 36, L.k, 3);
  const s = Math.min(120, Math.round(L.lt / 1.1 * 120)); bigNum(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`, 1, 'red', .2, 1.2); }, [[0, 'tick_down', .6], [.5, 'clock_tick', .5]]);
// 154 «Sie blinzelt nicht.»: primerísimo plano de sus ojos: ni un parpadeo
shot(160.49, 'W', null, L => { tunnel(L, -104); const l = lenaStand(L, { dz: 1.6 }); l.red.visible = true; const c = put(krause, BENP.x - .3, 0, -101.4, PI); lanternUp(c, L, 1, { k: 60 }); onFace(l, 2.6, 0, 0, 32, L.k, 2.3); }, [[0, 'whoosh', .4], [.2, 'heartbeat', .5]]);
// 155 «Er geht weiter.»: Krause baja el farol y se aleja por el túnel
shot(161.51, 'S', null, L => { tunnel(L, -110); lenaStand(L, { dz: 1.6 }); const c = guardWalk(krause, L, BENP.x + 1.6, -104, PI, 3, 0, .4); cm([BENP.x - 3, 6.6, -96, BENP.x, 5, -110, 44], [BENP.x - 3, 6.6, -97, BENP.x, 5, -110, 42], L.k); }, [[0, 'swipe', .4], [.1, 'steps', .6]]);
// 156 «Kaum dreht er sich um,»: la espalda de Krause alejándose; Lena sigue quieta en primer término
shot(162.09, 'W', null, L => { tunnel(L, -110); const l = lenaStand(L, { dz: 1.6 }); const c = guardWalk(krause, L, BENP.x + 1.6, -106, PI, 3, 0, .4); cm([BENP.x + 1.2, 6.2, -99.4, BENP.x + 1, 5, -116, 42], [BENP.x + 1.2, 6.2, -100, BENP.x + 1, 5, -116, 40], L.k); }, [[0, 'whoosh', .4], [.2, 'steps', .4]]);
// 157 «schaut sie mich an.»: los ojos de Lena se deslizan hacia Ben
shot(163.08, 'C', 'punch', L => { tunnel(L, -104); const l = lenaStand(L, { dz: 1.6, face: { eyes: L.lt > .2 ? 'side_r' : 'wide', mouth: 'flat', noBlink: true } }); onFace(l, 3.6, 0, 0, 36, L.k, 3.2); }, [[0, 'impact', .4], [.25, 'whoosh_up', .3]]);
// 158 «Und»: desde Ben: Lena le mira directamente
shot(164.09, 'S', null, L => { tunnel(L, -104); lenaStand(L, { dz: 1.6, ry: .2, face: { eyes: 'wide', mouth: 'flat', noBlink: true } }); benDig(L, { dig: false }); cm([BENP.x + 1.2, 6.2, BENP.z + 1.4, LENP.x, 5.6, LENP.z + 1.6, 40], [BENP.x + 1.1, 6.2, BENP.z + 1, LENP.x, 5.6, LENP.z + 1.6, 38], L.k); }, [[0, 'swipe', .3]]);
// 159 «blinzelt.» (zoom lento): Lena parpadea, despacio, a propósito
shot(164.37, 'F', 'slow', L => { tunnel(L, -104); const l = lenaStand(L, { dz: 1.6, face: { eyes: L.lt > .45 && L.lt < .75 ? 'closed' : 'normal', mouth: 'flat', noBlink: true } }); blinkFX(l, (L.lt - .42) / .4); onFace(l, 3.4, 0, 0, 36, L.k, 2.6); }, [[.45, 'blink', .8]]);
// 160 «Nur Wächter blinzeln.»: la fila de guardias con sus faroles
shot(165.59, 'C', 'punch', L => { tunnel(L, -110); guardRow(L, -110, 12, { expr: 'sus' }); cm([STX, 7, -88, STX, 5, -112, 48], [STX, 7, -90, STX, 5, -112, 48], L.k); }, [[0, 'impact', .5], [.1, 'braam_short', .4]]);
// 161 «Meine eigene Schwester»: Lena se aleja cavando como si nada, de espaldas
shot(166.95, 'W', null, L => { tunnel(L, -110); const l = put(lena, LENP.x - 3, 0, -112, PI); dig(l, L, 2); diggers(L, SL, -116, [-7, 3, 7]); cm([LENP.x - 1, 7, -100, LENP.x - 3, 4.6, -112, 44], [LENP.x - 1, 7, -102, LENP.x - 3, 4.6, -112, 42], L.k); }, [[0, 'whoosh', .4], [.2, 'shovel', .5]]);
// 162 «ist eine von ihnen.» (zoom lento): la cara de Ben, en shock
shot(167.89, 'F', 'slow', L => { tunnel(L, -102); const b = benDig(L, { dig: false, face: { expr: 'shock', eyes: 'wide', mouth: 'grimace' } }); onFace(b, 4, 0, 0, 38, L.k, 3); }, [[0, 'flash', .3], [.1, 'heartbeat', .6]]);
// 163 «Um fünf»: cuarto de Lena al alba: el despertador marca 5:00 y la puerta se abre de golpe
shot(168.92, 'C', 'punch', L => { lenaRoom(L, { dawn: true }); LZ.CLOCK.userData.set('5:00', '#ffd23f'); LZ.DOOR.rotation.y = -1.4 * easeOut(clamp(L.lt / .25)); const b = put(ben, LZX + 14, 0, 2, -PI / 2); actuar(b, 0, [[0, walkP(L.T, 0)]], { T: L.T }); cara(b, L.T, { expr: 'angry' });
  cm([LZX - 1, 6, -6.8, LZX - 3.4, 4, -8.6, 36], [LZX - 1.2, 5.8, -6.6, LZX - 3.4, 4, -8.6, 34], L.k); }, [[0, 'alarm', .5], [.1, 'door_crash', .7]]);
// 164 «stehe ich in ihrem Zimmer:»: Ben entra enfadado; Lena, sentada en la cama, levanta la vista
shot(169.8, 'W', null, L => { const [l, b] = lenaRoomPair(L); cara(l, L.T, { expr: 'worried' }); cara(b, L.T, { expr: 'angry' }); cm([LZX - 1.6, 8, 12, LZX - 1.8, 5, 0, 44], [LZX - 1.6, 8, 11, LZX - 1.8, 5, 0, 42], L.k); }, [[0, 'whoosh', .4], [.1, 'steps', .5]]);
// 165 «Zeig mir deine Hände.»: Ben señala sus manos y grita
shot(170.65, 'C', 'punch', L => { const [l, b] = lenaRoomPair(L, { bp: { aRx: 1.5, aRz: .05, aRe: .1, lean: .1 } }); talk(b, L.T, 170.6, 171.7, 'shout'); cara(l, L.T, { expr: 'worried' }); onFace(b, 5, 0, -1, 40, L.k, 4.4); }, [[0, 'impact', .5], [.1, 'shout_m', .2]]);
// 166 «Sie zieht die Handschuhe»: Lena se mira las manos enguantadas, triste
shot(171.75, 'S', null, L => { const [l, b] = lenaRoomPair(L, { lp: { aLx: 1.2, aRx: 1.2, aLe: 1.0, aRe: 1.0, headX: .4 } }); cara(l, L.T, { expr: 'sad' }); onFace(l, 5, 1, .8, 40, L.k, 4.4); }, [[0, 'swipe', .4], [.3, 'sigh', .5]]);
// 167 «aus.»: primer plano de las manos: se quita los guantes
shot(172.41, 'C', null, L => { const [l, b] = lenaRoomPair(L, { lp: { aLx: 1.3, aRx: 1.3, aLe: 1.1, aRe: 1.1, aLz: -.15, aRz: -.15 } }); cara(l, L.T, { expr: 'sad' }); l.gloves.visible = L.lt < .4; l.blis.visible = L.lt >= .4;
  l.root.updateMatrixWorld(true); const h = l.aR.hand.getWorldPosition(V(0, 0, 0)); cm([h.x + 3.6, h.y + 2, h.z + .6, h.x + .2, h.y, h.z + .6, 38], [h.x + 3.2, h.y + 1.8, h.z + .6, h.x + .2, h.y, h.z + .6, 36], L.k); }, [[0, 'cloth', .6], [.4, 'cloth', .5]]);
// 168 «Ihre Hände sind die schlimmsten»: las palmas destrozadas, llenas de ampollas (zoom lento)
shot(173.18, 'F', 'slow', L => { const [l, b] = lenaRoomPair(L, { lp: { aLx: 1.4, aRx: 1.4, aLe: 1.0, aRe: 1.0, aLz: -.2, aRz: -.2 } }); l.gloves.visible = false; l.blis.visible = true; cara(l, L.T, { expr: 'sad' });
  l.root.updateMatrixWorld(true); const h = l.aR.hand.getWorldPosition(V(0, 0, 0)); cm([h.x + 3, h.y + 1.6, h.z + .8, h.x, h.y, h.z + .6, 36], [h.x + 2.4, h.y + 1.3, h.z + .8, h.x, h.y, h.z + .6, 34], L.k); }, [[0, 'flash', .3], [.2, 'sad_tone', .4]]);
// 169 «von allen.»: Ben, con la boca abierta
shot(174.4, 'C', 'punch', L => { const [l, b] = lenaRoomPair(L); cara(b, L.T, { expr: 'gasp' }); onFace(b, 4.4, 0, 0, 38, L.k, 4); }, [[0, 'impact', .4], [.1, 'gasp', .6]]);
// 170 «Aber Wächter graben nicht.»: túnel: un guardia de brazos cruzados, sin pala, mirando
shot(175.18, 'W', null, L => { tunnel(L, -90); const g = put(WA[8], STX, 0, -90, 0); actuar(g, 0, [[0, GEST.cross]], { T: L.T }); cara(g, L.T, { expr: 'smug' }); diggers(L, SL, -94, [-7, -3, 3, 7]); onBody(g, 11, 0, .1, 42, L.k, 9.6); }, [[0, 'whoosh', .4], [.1, 'shovel', .4]]);
// 171 «graben nicht.»: sus manos limpias, cruzadas
shot(175.8, 'C', 'punch', L => { tunnel(L, -90); const g = put(WA[8], STX, 0, -90, 0); actuar(g, 0, [[0, { aLx: 1.4, aRx: 1.4, aLe: 1.0, aRe: 1.0, aLz: -.3, aRz: -.3 }]], { T: L.T }); onBody(g, 7, 0, .14, 38, L.k, 6, 0, 3.6); }, [[0, 'impact', .4], [.2, 'sparkle', .4]]);
// 172 «Und Lena gräbt mehr»: Lena cava rapidísimo, la tierra vuela
shot(176.71, 'W', null, L => { tunnel(L, -112); const l = put(lena, STX - 4, 0, -112, PI + .3); dig(l, L, 0, { sp: 2.4, awake: false }); dust(V(STX - 4, 0, -114), L.t0, L.T, 14, .6); onBody(l, 10, .5, .1, 42, L.k, 9); }, [[0, 'shovel', .6], [.25, 'shovel', .6], [.5, 'shovel', .6], [.75, 'shovel', .6]]);
// 173 «als jeder andere.»: grúa: su montón de tierra, el más alto del túnel
shot(177.71, 'S', null, L => { tunnel(L, -112); const l = put(lena, STX - 4, 0, -112, PI + .3); dig(l, L, 0, { sp: 2 }); const p = show(KPILE[0], STX - 7.4, 0, -116, 0, 1.6); diggers(L, SL, -120, [3, 7]);
  cm([STX + 4, 8, -102, STX - 5, 4, -114, 46], [STX + 4, 16, -100, STX - 5, 4, -114, 46], L.k); }, [[0, 'swipe', .4], [.2, 'rubble', .5]]);
// 174 «Ich bin das kleinste Kind»: plano bajo: Ben, diminuto, entre adultos enormes que cavan
shot(178.98, 'W', null, L => { tunnel(L, -100); benDig(L, { face: { eyes: 'wide', mouth: 'flat' } }); [[-1.4, -98], [6.4, -101], [-2.4, -104]].forEach(([x, z], i) => { const c = put(SL[i * 5 + 1], STX + x, 0, z, PI); dig(c, L, i); }); cm([BENP.x + 3, 2.4, -91, BENP.x, 6, -102, 50], [BENP.x + 2.6, 2.4, -92, BENP.x, 6, -102, 48], L.k); }, [[0, 'whoosh', .4], [.2, 'shovel', .5]]);
// 175 «im Tunnel.»: Ben, pequeño, cavando con esfuerzo
shot(179.84, 'C', 'punch', L => { tunnel(L, -100); benDig(L, { sp: 1.6 }); onBody(ben, 9, .4, .12, 42, L.k, 8, .4, 2.6); }, [[0, 'impact', .4], [.2, 'shovel', .5]]);
// 176 «Trotzdem ist mein Erdhaufen»: Ben se gira y mira su montón: es enorme
shot(180.72, 'W', null, L => { tunnel(L, -100); const b = put(ben, BENP.x, 0, BENP.z, PI / 2 + .4); b.shovel.visible = true; cara(b, L.T, { expr: 'confused', eyes: 'up' }); show(KPILE[1], BENP.x + 4, 0, BENP.z - 3, 0, 1.3); cm([BENP.x - 6, 4.4, BENP.z + 4, BENP.x + 2.5, 4.4, BENP.z - 2, 46], [BENP.x - 5.4, 4.2, BENP.z + 3.6, BENP.x + 2.5, 4.4, BENP.z - 2, 44], L.k); }, [[0, 'whoosh', .4], [.3, 'pop', .3]]);
// 177 «jede Nacht»: grúa sobre la fila de montones: el suyo igual de alto que los de los mayores
shot(181.84, 'S', null, L => { tunnel(L, -100); for (let i = 0; i < 4; i++) show(KPILE[i], STX - 7 + i * 4.6, 0, -104, 0, 1.3); put(ben, STX - .1, 0, -100, PI); cara(ben, L.T, { expr: 'confused' }); [[-7, 0], [-2.4, 3], [6.8, 6]].forEach(([x, k]) => { const c = put(SL[k + 2], STX + x, 0, -100, PI); dig(c, L, k); });
  cm([STX, 12, -88, STX, 3, -104, 46], [STX, 15, -90, STX, 3, -104, 46], L.k); }, [[0, 'swipe', .4], [.2, 'rubble', .4]]);
// 178 «so groß wie die der anderen.»: los montones, uno al lado del otro, iguales; flechas «=»
shot(182.46, 'W', null, L => { tunnel(L, -100); for (let i = 0; i < 4; i++) show(KPILE[i], STX - 7 + i * 4.6, 0, -104, 0, 1.3); cm([STX, 5, -92, STX, 3.4, -104, 46], [STX, 5, -93, STX, 3.4, -104, 44], L.k); badge('big', '=', W / 2, H * .3, clamp((L.lt - .2) / .2), 1, 1.4); }, [[0, 'whoosh', .4], [.2, 'pling', .4]]);
// 179 «der anderen.»: Ben se rasca la cabeza, sin entender
shot(183.24, 'C', 'punch', L => { tunnel(L, -100); const b = put(ben, BENP.x, 0, BENP.z, PI + .3); actuar(b, 0, [[0, { aRx: 2.6, aRe: 2.0, aRz: -.4, headZ: .2 }]], { T: L.T }); cara(b, L.T, { expr: 'confused' }); onFace(b, 4.6, 0, 0, 40, L.k, 4); badge('q', '?', W / 2 + 150, H * .28, clamp((L.lt - .2) / .2)); }, [[0, 'impact', .4], [.3, 'pop', .3]]);
// 180 «Weil sie die Hälfte»: Lena mira a los lados (¿nadie la ve?)
shot(184.12, 'W', null, L => { tunnel(L, -100); const l = put(lena, BENP.x + 4.4, 0, BENP.z - 1, PI - .6); l.shovel.visible = true; cara(l, L.T, { eyes: Math.sin(L.T * 5) > 0 ? 'side_l' : 'side_r', mouth: 'flat' }); actuar(l, 0, [[0, { aRx: .7, aRe: .4, headY: Math.sin(L.T * 5) * .5 }]], { T: L.T }); onFace(l, 4.6, 0, 0, 40, L.k, 4.2); }, [[0, 'whoosh', .4], [.2, 'sniff', .4]]);
// 181 «von meinem gräbt.»: y echa una palada de tierra en el montón de Ben a escondidas; Ben no la ve
shot(184.84, 'S', null, L => { tunnel(L, -100); show(KPILE[1], BENP.x + 4, 0, BENP.z - 3, 0, 1.3); const l = put(lena, BENP.x + 6.6, 0, BENP.z - 1, -PI / 2 - .4); dig(l, L, 0, { sp: 1.4, face: false }); cara(l, L.T, { expr: 'determined' }); put(ben, BENP.x - 1, 0, BENP.z + 1, PI); dig(ben, L, 1, { face: false }); cara(ben, L.T, { eyes: 'wide', mouth: 'flat' });
  dust(V(BENP.x + 4, 3, BENP.z - 3), L.t0 + .4, L.T, 8, .4); cm([BENP.x + 3, 7, BENP.z + 9, BENP.x + 3, 4, BENP.z - 1.6, 44], [BENP.x + 3, 7, BENP.z + 8, BENP.x + 3, 4, BENP.z - 1.6, 42], L.k); }, [[0, 'swipe', .4], [.4, 'shovel', .6], [.6, 'rubble', .5]]);
// 182 «Sie ist keine Wächterin.»: cuarto de Lena: ella sentada, las manos heridas en el regazo, mirando al suelo
shot(185.89, 'W', null, L => { const [l, b] = lenaRoomPair(L, { lp: { aLx: .6, aRx: .6, aLe: 1.0, aRe: 1.0, headX: .3 } }); l.gloves.visible = false; l.blis.visible = true; cara(l, L.T, { expr: 'sad' }); onFace(l, 6, .6, 1, 42, L.k, 5.2); }, [[0, 'whoosh', .4], [.3, 'sad_tone', .3]]);
// 183 «Sie ist wach.»: Lena levanta la mirada hacia Ben, ojos normales, parpadea
shot(187.15, 'C', 'punch', L => { const [l, b] = lenaRoomPair(L); l.gloves.visible = false; cara(l, L.T, { expr: 'sad', eyes: L.lt > .3 && L.lt < .42 ? 'closed' : 'worried' }); onFace(l, 4.6, 0, 0, 38, L.k, 4); }, [[0, 'impact', .4], [.3, 'blink', .4]]);
// 184 «Genau wie ich.»: Ben se ablanda; asiente
shot(187.99, 'S', null, L => { const [l, b] = lenaRoomPair(L, { bp: { headX: Math.sin(L.T * 8) * .15 } }); cara(b, L.T, { expr: 'sad' }); onFace(b, 4.6, 0, .4, 38, L.k, 4.2); }, [[0, 'swipe', .3], [.2, 'breath', .4]]);
// 185 «Mit neun»: recuerdo en sepia: Lena niña (9) se despierta en su cama a las 3; «9»
shot(188.77, 'B', null, L => { lenaRoom(L, { night: true }); sepia(); withScale(lena, .66, () => { sitBed(lena, LZX, L, { aLx: .4, aRx: .4 }); cara(lena, L.T, { eyes: 'wide', mouth: 'o' }); }); lena.gloves.visible = false; LZ.quilt.position.y = 4.2;
  cm([LZX - 5, 6.6, 4, LZX - 9, 4.6, -5, 44], [LZX - 5.4, 6.4, 3, LZX - 9, 4.6, -5, 42], L.k); bigNum('9', clamp((L.lt - .3) / .2), 'gold', .22, 1.2); }, [[0, 'soft_air', .3], [.1, 'film_roll', .4], [.4, 'pling', .4]]);
// 186 «ist sie zum ersten Mal»: la niña ve por la puerta pasar a sus padres, sonámbulos
shot(189.58, 'S', null, L => { lenaRoom(L, { night: true }); sepia(); LZ.DOOR.rotation.y = -1.3; sleepWalk(mama, L, LZX + 20.5, 6, PI, 2.6, 0); sleepWalk(papa, L, LZX + 21, 12, PI, 2.6, 1); cm([LZX + 4, 7.4, 6, LZX + 20, 5.2, 2, 42], [LZX + 5, 7.2, 5, LZX + 20, 5.2, 2, 40], L.k); }, [[0, 'swipe', .4], [.1, 'steps', .5]]);
// 187 «aufgewacht.»: Lena niña se tapa la boca, aterrada (igual que Ben)
shot(190.3, 'C', 'punch', L => { lenaRoom(L, { night: true }); sepia(); withScale(lena, .66, () => { sitBed(lena, LZX, L, { aLx: 2.1, aRx: 2.1, aLe: 1.9, aRe: 1.9, aLz: -.25, aRz: -.25, ...shiver(L.T, 1.4) }); cara(lena, L.T, { expr: 'terror', eyes: 'terror' }); }); lena.gloves.visible = false; LZ.quilt.position.y = 4.2;
  onFace(lena, 3.4, 0, 0, 38, L.k, 3); }, [[0, 'impact', .4], [.1, 'heartbeat', .5]]);
// 188 «Da war ich vier.»: Ben pequeñito (4) dormido en su cama, con un peluche; «4»
shot(191.4, 'W', null, L => { benRoom(L); sepia(); withScale(ben, .5, () => { lie(ben, KZX - 9, -7.4, 4.15, L); }); ben.setFace({ eyes: 'closed', mouth: 'smile' }); KZ.quilt.position.y = 4.4; zzz(ben, L.T, .8);
  const h = hp(ben); cm([h.x + 2, h.y + 5, h.z + 4, h.x, h.y, h.z - .5, 42], [h.x + 1.6, h.y + 4.4, h.z + 3.4, h.x, h.y, h.z - .5, 40], L.k); bigNum('4', clamp((L.lt - .2) / .2), 'gold', .22, 1.2); }, [[0, 'whoosh', .4], [.1, 'lullaby', .4], [.2, 'pling', .4]]);
// 189 «Das Jahr mit dem Reim.»: Lena niña junto a la cama le enseña la rima, dedo en alto; la rima en un bocadillo
shot(192.39, 'S', null, L => { benRoom(L); sepia(); withScale(ben, .5, () => { sitBed(ben, KZX, L, { aLx: .3, aRx: .3 }); talk(ben, L.T, 192.3, 193.5, 'happy'); }); KZ.quilt.position.y = 3.9;
  withScale(lena, .66, () => { const l = put(lena, KZX - 5.4, 0, -2, -PI / 2 - .2); actuar(l, 0, [[0, { aRx: 2.3, aRe: .5, aRz: -.1 }]], { T: L.T }); talk(l, L.T, 192.3, 193.5, 'happy'); }); lena.gloves.visible = false; bubble(lena, 'TU ALS OB!', clamp((L.lt - .2) / .2));
  cm([KZX + 1, 7.4, 6, KZX - 7.4, 3.6, -3, 44], [KZX, 7.2, 5, KZX - 7.4, 3.6, -3, 42], L.k); }, [[0, 'swipe', .4], [.2, 'pop', .4]]);
// 190 «Das Jahr, in dem»: en sepia, la mesa de la cocina: Lena niña y Ben pequeño, frente a frente, empiezan a mirarse
shot(193.54, 'W', null, L => { kitchen(L, { night: true }); sepia(); withScale(ben, .5, () => { sit(ben, KUX + 3.4, 2.8 + 1.2, -5.6, 0, L, {}); cara(ben, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); });
  withScale(lena, .66, () => { sit(lena, KUX + 3.4, 2.8 + .6, 5.6, PI, L, {}); cara(lena, L.T, { eyes: 'wide', mouth: 'smirk', noBlink: true }); }); lena.gloves.visible = false; cm([KUX, 22, 7, KUX + 3.4, 3, 0, 48], [KUX, 20, 6, KUX + 3.4, 3, 0, 46], L.k); }, [[0, 'whoosh', .4], [.2, 'clock_tick', .5]]);
// 191 «das Anstarren anfing.»: los ojos del pequeño Ben, abiertos con todas sus fuerzas
shot(194.38, 'C', 'punch', L => { kitchen(L, { night: true }); sepia(); withScale(ben, .5, () => { sit(ben, KUX + 3.4, 2.8 + 1.2, -5.6, 0, L, {}); cara(ben, L.T, { eyes: 'wide', mouth: 'grimace', noBlink: true }); }); onFace(ben, 2.4, 0, 0, 36, L.k, 2); }, [[0, 'impact', .4], [.3, 'tick', .4]]);
// 192 «Sie wollte mich nie besiegen.»: hoy: Lena sonríe con tristeza
shot(195.53, 'W', null, L => { const [l, b] = lenaRoomPair(L); l.gloves.visible = false; cara(l, L.T, { expr: 'warm', mouth: 'smile' }); onFace(l, 5, 0, .6, 40, L.k, 4.4); }, [[0, 'soft_air', .3], [.2, 'piano_note', .4]]);
// 193 «besiegen.»: se seca una lágrima con el dorso de la mano
shot(196.07, 'S', null, L => { const [l, b] = lenaRoomPair(L, { lp: { aRx: 2.3, aRe: 2.0, aRz: -.4 } }); l.gloves.visible = false; cara(l, L.T, { expr: 'cry', mouth: 'smile' }); tears(l, L.T); onFace(l, 4.4, 0, -.4, 38, L.k, 4); }, [[0, 'swipe', .3], [.3, 'sniff', .5]]);
// 194 «Sie hat mich trainiert.»: recuerdo: Lena con un cronómetro, Ben mirándola fijo en la mesa; ella asiente
shot(197.01, 'C', 'punch', L => { kitchen(L); const b = put(benT, KUX + 2, 0, 2, PI / 2); cara(b, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); const l = put(lenaT, KUX + 6.4, 0, 2, -PI / 2); actuar(l, 0, [[0, { aRx: 1.6, aRe: 1.2, headX: Math.sin(L.T * 6) * .1 }]], { T: L.T }); cara(l, L.T, { expr: 'happy' });
  cm([KUX + 4.2, 7, 12, KUX + 4.2, 5.4, 2, 40], [KUX + 4.2, 7, 11, KUX + 4.2, 5.4, 2, 38], L.k); bigNum(`0:${String(Math.floor(30 + L.lt * 20)).padStart(2, '0')}`, 1, 'green', .2, 1.0); }, [[0, 'impact', .4], [.1, 'tick', .5], [.5, 'tick', .5]]);
// 195 «Falls ich auch mal»: Lena mira a Ben, seria y protectora
shot(198.06, 'W', null, L => { const [l, b] = lenaRoomPair(L); l.gloves.visible = false; cara(l, L.T, { expr: 'determined' }); onFace(l, 4.6, 0, .6, 38, L.k, 4.2); }, [[0, 'whoosh', .3], [.2, 'breath', .4]]);
// 196 «aufwache.»: a Ben se le llenan los ojos de lágrimas: lo entiende
shot(198.78, 'C', 'punch', L => { const [l, b] = lenaRoomPair(L); cara(b, L.T, { expr: 'cry' }); tears(b, L.T); onFace(b, 4.2, 0, 0, 38, L.k, 3.8); }, [[0, 'impact', .3], [.2, 'sniff', .5]]);
// 197 «Warum hast du»: Ben le pregunta, con la voz rota
shot(199.47, 'S', null, L => { const [l, b] = lenaRoomPair(L, { bp: { aLx: .5, aRx: .5, aLz: .4, aRz: .4, aLe: 1.2, aRe: 1.2 } }); talk(b, L.T, 199.4, 200.9, 'cry'); tears(b, L.T); onFace(b, 4.8, 0, -.6, 40, L.k, 4.4); }, [[0, 'swipe', .3], [.3, 'cry_girl', .1]]);
// 198 «nichts gesagt?»: plano de los dos: Ben de pie, Lena sentada
shot(200.05, 'W', null, L => { const [l, b] = lenaRoomPair(L); l.gloves.visible = false; talk(b, L.T, 199.4, 200.9, 'sad'); cara(l, L.T, { expr: 'sad' }); cm([LZX - 1.6, 7, 9, LZX - 1.6, 5, 0, 46], [LZX - 1.6, 7, 8.4, LZX - 1.6, 5, 0, 44], L.k); }, [[0, 'whoosh', .3]]);
// 199 «Weil du mich da draußen»: Lena le explica, señalando la ventana (la noche)
shot(200.91, 'C', 'punch', L => { const [l, b] = lenaRoomPair(L, { lp: { aRx: 1.6, aRz: -.6, aRe: .2, headY: -.4 } }); l.gloves.visible = false; talk(l, L.T, 200.9, 202.8, 'sad'); onFace(l, 5, 0, .6, 40, L.k, 4.6); }, [[0, 'impact', .3], [.2, 'wind', .3]]);
// 200 «angeschaut hättest.»: recuerdo inventado: en el túnel, Ben girando la cabeza para mirar a Lena (lo que NO debe hacer); X roja
shot(201.67, 'S', null, L => { tunnel(L, -100); const b = put(ben, BENP.x, 0, BENP.z, PI); b.shovel.visible = true; actuar(b, 0, [[0, { headY: .9 * clamp(L.lt / .4) }]], { T: L.T }); cara(b, L.T, { eyes: 'side_r', mouth: 'flat' }); put(lena, BENP.x - 3, 0, BENP.z - 1, PI); dig(lena, L, 1);
  onFace(b, 5, 0, -1.2, 40, L.k, 4.4); badge('red', '✕', W / 2, H * .28, clamp((L.lt - .5) / .2), 1, 1.4); }, [[0, 'swipe', .4], [.5, 'glitch', .4]]);
// 201 «Und sie hätten es gesehen.»: un farol gira hacia ellos; los ojos de Krause se entrecierran
shot(202.8, 'F', 'slow', L => { tunnel(L, -110); const k = put(krause, STX, 0, -110, lerp(-.8, 0, clamp(L.lt / .6))); lanternUp(k, L, .8, { k: 50 }); cara(k, L.T, { expr: 'sus', eyes: 'squint' }); onFace(k, 5, 0, 0, 38, L.k, 3.6); }, [[0, 'flash', .3], [.2, 'creepy_ting', .5]]);
// 202 «Heute Nacht um drei»: el despertador de Ben marca 3:00 (golpe)
shot(204.08, 'C', 'punch', L => { benRoom(L); KZ.CLOCK.userData.set('3:00', '#ffd23f'); const w = KZ.CLOCK.getWorldPosition(V(0, 0, 0)); cm([w.x + .6, w.y + 1.4, w.z + 4, w.x, w.y + .6, w.z, 34], [w.x + .5, w.y + 1.2, w.z + 3.4, w.x, w.y + .6, w.z, 32], L.k); }, [[0, 'alarm', .6], [.1, 'impact', .4]]);
// 203 «gehen wieder alle Türen auf.»: otra vez, la calle: todas las puertas se abren de golpe en ola
shot(204.96, 'W', null, L => { gasse(L, { z: HD.z }); doorWave(L, L.t0 + .05, HD.z, .02, .2); outOfDoors(L, L.t0 + .1, HD.z + 50, HD.z - 50, 0, { z0: HD.z, sp: .02, max: 4.5 });
  cm([HD.x + 26, 8, HD.z + 10, HD.x, 5, HD.z - 4, 48], [HD.x + 22, 7.6, HD.z + 8, HD.x, 5, HD.z - 4, 46], L.k); sh(V(HD.x + 6, 0, HD.z), 30); }, [[0, 'whoosh', .4], [.05, 'door_crash', .7], [.15, 'door_open', .5], [.3, 'door_open', .4]]);
// 204 «auf.»: los vecinos salen en pijama; la marcha empieza
shot(205.5, 'S', null, L => { gasse(L, { z: -10 }); doorsOpen(); march(L, SL, 0, -10, PI, { cols: 4, speed: 1.8 }); cm([0, 8, -26, 0, 5, -10, 46], [0, 8, -24, 0, 5, -10, 44], L.k); sh(V(0, 0, -6), 30); }, [[0, 'swipe', .4], [.1, 'steps', .6]]);
// 205 «Lena läuft direkt neben mir.»: Ben y Lena, uno al lado del otro en la marcha, los dos con los ojos abiertos
shot(206.59, 'W', null, L => { gasse(L, { z: -20 }); doorsOpen(); sleepWalk(ben, L, 1.6, -18, PI, 1.8, 0); sleepWalk(lena, L, -1.6, -18.4, PI, 1.8, 1); march(L, SL, 0, -10, PI, { cols: 4, speed: 1.8 }); march(L, SL.slice(20), 0, -26, PI, { cols: 4, speed: 1.8 });
  const p = ben.root.position; orbit(V(-.2, 3.8, p.z), lerp(14, 12, L.k), PI, .1, 44); sh(V(0, 0, p.z), 24); }, [[0, 'whoosh', .4], [.1, 'steps', .6]]);
// 206 «neben mir.»: más cerca: los dos hombro con hombro
shot(207.49, 'C', null, L => { gasse(L, { z: -20 }); doorsOpen(); sleepWalk(ben, L, 1.4, -18, PI, 1.8, 0, { t0: .9 }); sleepWalk(lena, L, -1.4, -18.4, PI, 1.8, 1, { t0: .9 }); march(L, SL, 0, -8, PI, { cols: 4, speed: 1.8 });
  const p = ben.root.position; orbit(V(0, 4.4, p.z), lerp(8, 7, L.k), PI, .06, 40); sh(V(0, 0, p.z), 20); }, [[0, 'steps', .5]]);
// 207 «Ich schaue sie kein»: primer plano de Ben: mira al frente, temblando, sin girar la cabeza
shot(208.23, 'S', null, L => { gasse(L, { z: -20 }); doorsOpen(); const b = sleepWalk(ben, L, 1.4, -18, PI, 1.8, 0, { t0: 1.6, ex: { eyes: 'wide', mouth: 'grimace' } }); sleepWalk(lena, L, -1.4, -18.4, PI, 1.8, 1, { t0: 1.6 }); onFace(b, 3.8, 0, .6, 38, L.k, 3.4); sh(V(0, 0, b.root.position.z), 20); }, [[0, 'swipe', .3], [.2, 'heartbeat', .5]]);
// 208 «einziges Mal an.»: travelling de perfil: Ben con la vista clavada al frente; Lena a su lado
shot(209.09, 'W', null, L => { gasse(L, { z: -24 }); doorsOpen(); const b = sleepWalk(ben, L, 1.4, -18, PI, 1.8, 0, { t0: 2.5 }); const l = sleepWalk(lena, L, -1.4, -18.4, PI, 1.8, 1, { t0: 2.5 }); march(L, SL, 0, -14, PI, { cols: 4, speed: 1.8, t0: 2.5, avoid: [[1.4, -22.5], [-1.4, -22.9]] });
  const p = b.root.position; cm([p.x + 7, 5.4, p.z - 2, p.x - .4, 5, p.z, 44], [p.x + 7, 5.4, p.z - 3, p.x - .4, 5, p.z - 1, 44], L.k); }, [[0, 'whoosh', .4], [.2, 'steps', .5]]);
// 209 «Das Schönste,»: de espaldas, los dos andando hacia el Berg, la mina iluminada al fondo
shot(210.36, 'B', null, L => { gasse(L, { z: -60 }); doorsOpen(); sleepWalk(ben, L, 1.4, -54, PI, 1.8, 0); sleepWalk(lena, L, -1.4, -54.4, PI, 1.8, 1); march(L, SL, 0, -66, PI, { cols: 4, speed: 1.8 });
  cm([0, 6.4, -42, 0, 7, -200, 46], [0, 6.4, -46, 0, 7, -200, 46], L.k); }, [[0, 'soft_air', .3], [.2, 'piano_note', .4]]);
// 210 «was ich je für sie getan habe.»: las manos: la de Lena, con el guante, roza un segundo la de Ben al andar
shot(211.28, 'S', null, L => { gasse(L, { z: -40 }); doorsOpen(); const b = sleepWalk(ben, L, .9, -40, PI, 1.4, 0, { pose: { aLx: .1, aLz: .2 } }); const l = sleepWalk(lena, L, -.9, -40, PI, 1.4, 0, { pose: { aRx: .1, aRz: .25 } });
  b.root.updateMatrixWorld(true); const h = b.aL.hand.getWorldPosition(V(0, 0, 0)); cm([h.x + .2, h.y + 1.6, h.z - 4, h.x - .6, h.y, h.z, 38], [h.x + .2, h.y + 1.4, h.z - 3.4, h.x - .6, h.y, h.z, 36], L.k); }, [[0, 'swipe', .3], [.3, 'sparkle', .3]]);
// 211 «Kurz vor fünf»: al fondo del túnel, Ben cava junto al último montón; «4:59»
shot(212.38, 'C', 'punch', L => { tunnel(L, -236); const b = put(ben, STX + 1, 0, -238, PI); dig(b, L, 0, { face: false }); cara(b, L.T, { eyes: 'wide', mouth: 'flat' }); diggers(L, SL.slice(0, 8), -232, [-7, 7]); onBody(b, 10, .4, .1, 42, L.k, 9, .4, 2.6); bigNum('4:59', clamp(L.lt / .2), 'red', .2, 1.1); }, [[0, 'impact', .4], [.1, 'clock_tick', .6], [.3, 'shovel', .5]]);
// 212 «trifft meine Schaufel»: la pala baja y choca: ¡CLANG!
shot(213.05, 'W', null, L => { tunnel(L, -240); const b = put(ben, STX + 1, 0, -238, PI); dig(b, L, 0, { face: false }); cara(b, L.T, { eyes: 'wide', mouth: 'o' }); const w = V(STX + 1, .6, -242); if (L.lt > .45) sparks(w, L.t0 + .45, L.T, 18);
  cm([STX + 5, 3, -236, STX + 1, 1.2, -242, 42], [STX + 4.6, 2.8, -236.6, STX + 1, 1.2, -242, 40], L.k); }, [[.45, 'boing_metal', .8], [.47, 'sparks', .6]]);
// 213 «etwas, das kein Stein ist.»: chispas: bajo la tierra asoma algo metálico, dorado
shot(213.85, 'C', 'punch', L => { tunnel(L, -244); const w = V(STX + 1, .6, -242); sparks(w, L.t0 - .1, L.T, 18); ST.BELL.position.y = 1.2; cm([STX + 2.4, 3, -238, STX + .6, 1, -243, 38], [STX + 2.2, 2.6, -238.6, STX + .6, 1, -243, 36], L.k); }, [[0, 'impact', .5], [.1, 'sparkle', .5]]);
// 214 «Stein ist.»: Ben aparta la tierra con las manos: el borde de bronce brilla
shot(214.77, 'W', null, L => { tunnel(L, -244); ST.BELL.position.y = 1.2; const b = put(ben, STX + 1, 0, -239, PI); actuar(b, 0, [[0, { lean: .7, crouch: .6, aLx: 1.2 + Math.sin(L.T * 14) * .3, aRx: 1.2 - Math.sin(L.T * 14) * .3, aLe: .3, aRe: .3 }]], { T: L.T }); cara(b, L.T, { expr: 'gasp' }); dust(V(STX + 1, 0, -242), L.t0, L.T, 10, .4);
  cm([STX + 6, 5, -234, STX + 1, 2, -243, 44], [STX + 5.4, 4.6, -234.6, STX + 1, 2, -243, 42], L.k); }, [[0, 'swipe', .4], [.1, 'rubble', .6]]);
// 215 «Es klingt wie eine riesige Glocke.»: ¡DONG! una onda sacude el túnel, cae polvo, la campana vibra
shot(215.91, 'C', 'punch', L => { tunnel(L, -244); ST.BELL.position.y = 1.2 + Math.sin(L.T * 60) * .06 * Math.exp(-L.lt * 2); const b = put(ben, STX + 1, 0, -238, PI); actuar(b, 0, [[0, { aLx: 2.0, aRx: 2.0, aLe: 1.9, aRe: 1.9, aLz: -.3, aRz: -.3, lean: -.1 }]], { T: L.T }); cara(b, L.T, { expr: 'shock', mouth: 'o' });
  dustFall(V(STX + 1, 6, -240), L.t0, L.T, 20); SHAKE = .5 * Math.exp(-L.lt * 2); FX2D.push(c => { const r = (L.lt * 900) % 1400; c.strokeStyle = `rgba(255,230,160,${Math.max(0, .6 - r / 1400)})`; c.lineWidth = 16; c.beginPath(); c.arc(W / 2, H * .55, r, 0, 7); c.stroke(); });
  cm([STX + 3, 6, -229, STX + 1, 3, -242, 46], [STX + 3, 6, -230, STX + 1, 3, -242, 44], L.k); }, [[0, 'bell_far', 1], [.02, 'impact', .6], [.3, 'rubble', .5]]);
// 216 «riesige Glocke.»: plano general: el borde enorme de la campana asoma del montón de tierra
shot(216.69, 'W', null, L => { tunnel(L, -240); ST.BELL.position.y = 1.2; const b = put(ben, STX + 1, 0, -236, PI); cara(b, L.T, { expr: 'shock' }); cm([STX - 6, 10, -222, STX, 3, -246, 50], [STX - 5, 9, -224, STX, 3, -246, 48], L.k); }, [[0, 'whoosh', .4], [.1, 'bells', .4]]);
// 217 «So laut,»: todos dejan de cavar a la vez; silencio
shot(217.74, 'S', null, L => { tunnel(L, -220); ST.BELL.position.y = 1.2; SL.slice(0, 16).forEach((c, i) => { put(c, STX + [-7, -3, 3, 7][i % 4], 0, -206 - Math.floor(i / 4) * 6, PI); c.shovel.visible = true; actuar(c, 0, [[0, { aRx: .4, aLx: .4 }]], { T: L.T }); sleepFace(c, L.T); });
  cm([STX, 8, -190, STX, 4, -230, 46], [STX, 8, -192, STX, 4, -230, 44], L.k); }, [[0, 'swipe', .4], [.1, 'silence_tick', .4]]);
// 218 «dass sich jede Laterne»: los faroles de los guardias giran uno tras otro hacia el fondo
shot(218.94, 'W', null, L => { tunnel(L, -220); GUARDS.forEach((g, i) => { const t = clamp((L.lt - i * .05) / .3); put(g, STX + (i % 2 ? 6 : -6), 0, -196 - Math.floor(i / 2) * 7, lerp(i % 2 ? -1.6 : 1.6, PI, easeOut(t))); lanternUp(g, L, .6 + t * .4, { light: false }); cara(g, L.T, { expr: 'sus' }); });
  cm([STX, 9, -176, STX, 5, -230, 48], [STX, 9, -180, STX, 5, -230, 48], L.k); }, [[0, 'whoosh', .4], [.1, 'metal_creak', .5], [.3, 'metal_creak', .4]]);
// 219 «zu mir dreht.»: desde detrás de Ben: doce faroles apuntándole; él, pequeño, en el centro de toda la luz
shot(219.84, 'C', 'punch', L => { tunnel(L, -236); ST.BELL.position.y = 1.2; const b = put(ben, STX + 1, 0, -238, 0); cara(b, L.T, { expr: 'shock' }); GUARDS.forEach((g, i) => { put(g, STX - 9 + (i % 6) * 3.6, 0, -224 - Math.floor(i / 6) * 4, PI); lanternUp(g, L, 1, { light: i === 2, k: 60 }); cara(g, L.T, { expr: 'sus' }); });
  cm([STX + 1, 6, -246, STX + 1, 5, -228, 46], [STX + 1, 6, -245, STX + 1, 5, -228, 44], L.k); }, [[0, 'impact', .6], [.05, 'braam', .5]]);
// 220 «Ich habe nicht»: la cara de Ben, iluminada por todos los faroles
shot(220.66, 'W', null, L => { tunnel(L, -236); const b = put(ben, STX + 1, 0, -238, 0); cara(b, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); LANT.position.set(STX + 1, 6, -232); LANT.intensity = 70; onFace(b, 4.4, 0, 0, 38, L.k, 3.8); }, [[0, 'swipe', .3], [.2, 'heartbeat', .6]]);
// 221 «geblinzelt.» (zoom lento): sus ojos, enormes, con los faroles reflejados; no parpadea; final
shot(221.32, 'F', 'slow', L => { tunnel(L, -236); const b = put(ben, STX + 1, 0, -238, 0); cara(b, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true }); LANT.position.set(STX + 1, 6, -232); LANT.intensity = 70; onFace(b, 2.8, 0, 0, 32, L.k, 2.1);
  FX2D.push(c => { const p = proj(hp(b).add(V(0, .78 * .74, .5))); for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(255,220,140,.85)'; c.beginPath(); c.arc(W / 2 + s * 120 * (1 + L.k * .5) + (i - 1) * 14, p[1] - 10 + (i % 2) * 8, 6, 0, 7); c.fill(); } }); }, [[0, 'flash', .3], [.3, 'heartbeat', .6]]);

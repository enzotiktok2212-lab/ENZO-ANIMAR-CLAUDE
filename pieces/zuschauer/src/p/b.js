// ---------- b: Metzger Kalle y los pepinillos, Opa Heinz en el bus 42, Frau Krause y el «swipe», la Tafel de Papa (21,97 – 48,36 s) ----------
const MZ = V(-60.5, 0, -21);   // puerta de la Metzgerei Kalle (fachada oeste, mira a +x)
const FR0 = V(KX - 8, 0, -6);  // nevera de mi cocina (mira a +z)
// yo en la cocina de noche: bote en la izquierda, pepinillo en la boca
function duFridge(L, o = {}) { kuecheN(L); const c = put(du, FR0.x - .5, 0, FR0.z + 4.6, o.ry ?? 0); actuar(c, 0, [[0, o.pose || { aLx: 1.0, aLz: -.1, aLe: 1.1, aRx: 1.6, aRz: -.45, aRe: 2.1, headX: .05 }]], { T: L.T });
  const h = hp(c), a = c.root.rotation.y, f = V(Math.sin(a), 0, Math.cos(a)), r = V(Math.cos(a), 0, -Math.sin(a));
  show(GLAS, 0, 0, 0, a, .9); GLAS.position.copy(h).addScaledVector(f, 1.2).addScaledVector(r, .9).add(V(0, -2.4, 0));
  if (o.bite !== false) { GURK.visible = true; GURK.position.copy(h).addScaledVector(f, .95).addScaledVector(r, -.15).add(V(0, -.05, 0)); GURK.rotation.set(0, a, 1.2); }
  cara(c, L.T, o.face || { expr: 'happy', eyes: 'happy', mouth: Math.sin(L.T * 16) > 0 ? 'o' : 'grin' }); return c; }
// 17 «Metzger Kalle sieht dich.»: Kalle en la puerta de su carnicería de noche, cuchilla en mano, mirándote
shot(21.97, 'W', null, L => { town(L, 'night'); const c = put(kalle, MZ.x, 0, MZ.z, PI / 2 - .25); actuar(c, 0, [[0, { aRx: 1.2, aRz: -.2, aRe: 1.4, aLx: .3, lean: .05, headY: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' });
  FILL.intensity = 30; onFace(c, 4.2, .4, -.4, 40, L.k, 3.4); sh(MZ, 18); }, [[0, 'whoosh', .5], [.2, 'door_bell', .6], [.7, 'steps', .4], [1.2, 'crickets', .4]]);
cut(22.8, 'C', [.5, 1.05, .3], [[0, 'whoosh', .4], [.2, 'knock', .4]]);
// 18 «Wie du Gurken direkt aus dem Glas isst.»: tú, delante de la nevera abierta, comiendo pepinillos del bote
shot(23.46, 'F', null, L => { const c = duFridge(L); const h = hp(c); cm([h.x + 1.5, 6.4, h.z + 11, h.x, 4.2, h.z, 44], [h.x + 1, 6.0, h.z + 9.5, h.x, 4.2, h.z, 42], L.k); sh(FR0, 14); }, [[0, 'flash', .4], [.15, 'hum', .5], [.4, 'lid_click', .6], [.8, 'chew', .7]]);
cut(24.4, 'C', [-.6, .75, .6], [[0, 'whoosh', .4], [.1, 'chew', .7], [.5, 'sip', .5]]);
// 19 «Weil du glaubst, dass es keiner merkt.»: miras a un lado y a otro, a escondidas
shot(25.6, 'S', null, L => { const c = duFridge(L, { pose: { ...GEST.sneak, aLx: 1.0, aLe: 1.1, aRx: 1.0, aRe: 1.2, headY: Math.sin(L.lt * 6) * .7 }, face: { expr: 'sus', eyes: Math.sin(L.lt * 6) > 0 ? 'side_l' : 'side_r', mouth: 'grimace' }, bite: false });
  onFace(c, 3.4, .3, .5, 40, L.k, 2.9); sh(FR0, 14); }, [[0, 'whoosh', .4], [.3, 'creepy_ting', .4], [.6, 'squeak', .4]]);
// 20 «Aber Kalle merkt alles.»: Kalle asoma detrás de la puerta de la nevera, apuntando en su libreta
shot(27.28, 'C', 'punch', L => { const c = duFridge(L, { pose: GEST.shock, face: { expr: 'shock', eyes: 'wide', mouth: 'scream' }, bite: false }); const k = put(kalle, FR0.x + 6.2, 0, FR0.z + 2.2, -.7); actuar(k, 0, [[0, { lean: .2, twist: .2, aRx: 1.3, aRe: 1.6, aLx: 1.2, aLe: 1.4, headY: -.2 }]], { T: L.T }); cara(k, L.T, { expr: 'smug', eyes: 'squint', mouth: 'grin' });
  NEWS.visible = false; cm([FR0.x + 3, 6.8, FR0.z + 21, FR0.x + 3, 4.6, FR0.z + 3, 46], [FR0.x + 3, 6.5, FR0.z + 19, FR0.x + 3, 4.6, FR0.z + 3, 44], L.k); sh(FR0, 16); }, [[0, 'impact', .6], [.05, 'gasp', .7], [.4, 'pencil', .6], [.6, 'evil_laugh', .4]]);
// 21 «Opa Heinz sieht dich.»: en la parada del bus, por la mañana: Opa con el periódico agujereado
const OP0 = V(35, 0, 6);
shot(28.9, 'Z', null, L => { town(L); const c = put(opa, OP0.x, 0, OP0.z, -PI / 2); actuar(c, 0, [[0, { aLx: 1.5, aRx: 1.5, aLe: .9, aRe: .9, aLz: -.25, aRz: -.25 }]], { T: L.T }); coatWind(c, L.T, .3); cara(c, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' });
  const h = hp(c); show(NEWS, h.x - 1.6, h.y - .2, h.z, -PI / 2, 1.2);
  crowdAt(L, OP0.x - 3, OP0.z, 4, 6, 12, 21, { mode: 'phone' }); cm([OP0.x - 13, 6.4, OP0.z + 2, OP0.x - 1, 4.8, OP0.z, 42], [OP0.x - 11, 6.2, OP0.z + 1.5, OP0.x - 1, 5, OP0.z, 40], L.k); sh(OP0, 18); }, [[0, 'zoom_in', .5], [.2, 'paper', .7], [.6, 'birds', .4], [.9, 'cough', .4]]);
// 22 «Im Bus.»: dentro del bus 42: tú, sentado, mirando el móvil; otros pasajeros
const SEAT = V(BX + 2.9, .75, 11.8);
function busScene(L) { busIn(L); const c = put(du, SEAT.x, SEAT.y, SEAT.z, 0); actuar(c, 0, [[0, { ...SIT, ...PHONEP }]], { T: L.T }); phoneIn(c, true, .7, 1.3, 1.0); PH.userData.set('plain', { prog: .6 }); cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  [[-2.9, 5.2, 0], [-2.9, -7.6, 1], [2.9, -7.6, 2], [-2.9, 11.6, 3]].forEach(([x, z, i]) => { const e = put(EX[10 + i], BX + x, .75, z + .2, 0); actuar(e, 0, [[0, i % 2 ? { ...SIT, aLx: .5, aRx: .5 } : { ...SIT, ...GEST.phone_look }]], { T: L.T + i }); cara(e, L.T + i, { expr: i % 2 ? 'neutral' : 'happy' }); }); return c; }
shot(30.07, 'W', null, L => { busScene(L); cm([BX - 1.5, 7.4, 16, BX + 1.2, 4.2, -4, 46], [BX - 1, 7, 13, BX + 1.2, 4.2, -4, 44], L.k); sh(V(BX, 0, 0), 20); }, [[0, 'whoosh', .5], [.1, 'car', .6], [.4, 'wheels', .4]]);
// 23 «Hinter dem Sitz versteckt.»: Opa asoma por encima del respaldo, detrás de ti, con el periódico
shot(30.78, 'C', null, L => { const c = busScene(L); const o = put(opa, SEAT.x - 1.2, 2.4, SEAT.z - 3.4, .2); actuar(o, 0, [[0, { crouch: Math.max(0, Math.sin(L.lt * 3)) * .1, aLx: 1.5, aRx: 1.5, aLe: .9, aRe: .9, aLz: -.25, aRz: -.25, lean: .1 }]], { T: L.T }); cara(o, L.T, { expr: 'sus', eyes: 'side_r', mouth: 'flat' });
  const h = hp(o); show(NEWS, h.x, h.y - .7, h.z + 1.3, 0, 1.15); cm([BX + 1.6, 6.0, 18.2, SEAT.x, 5.4, SEAT.z - 2.2, 50], [BX + 1.8, 5.9, 17.6, SEAT.x, 5.4, SEAT.z - 2.2, 48], L.k); sh(SEAT, 14); }, [[0, 'impact', .4], [.1, 'paper', .7], [.6, 'creepy_ting', .5]]);
// 24 «Denn er fährt jeden Morgen dieselbe Linie wie du –»: el bus amarillo por la calle del pueblo, al amanecer
shot(31.89, 'S', null, L => { town(L); BUS.visible = true; const z = lerp(60, 110, L.k); BUS.position.set(26, 0, z); BUS.rotation.y = 0; BUS.userData.wheels.forEach(w => w.rotation.x = L.T * 6); sun.color.setRGB(1, .85, .7);
  crowdAt(L, 37, z + 30, 4, 4, 10, 24, { mode: 'wave' }); cm([23, 4.2, z + 38, 26, 5.5, z + 6, 44], [23.5, 4.0, z + 34, 26, 5.5, z + 9, 42], L.k); sh(V(26, 0, z + 10), 30); }, [[0, 'whoosh', .5], [.1, 'car_pass', .7], [.9, 'birds', .4], [1.6, 'rooster', .4]]);
// 25 «die 42.»: golpe de zoom al letrero «42»
shot(34.3, 'C', 'punch', L => { town(L); BUS.visible = true; BUS.position.set(26, 0, 118); BUS.userData.wheels.forEach(w => w.rotation.x = L.T * 6); const s = V(26, 7.6, 131.1); cm([26.6, 8.4, 139, s.x, s.y, s.z, 34], [26.4, 8.1, 136.5, s.x, s.y, s.z, 30], L.k); badge('gold', '42', W / 2, H * .3, (L.lt - .1) * 3); sh(s, 16); }, [[0, 'impact', .7], [.1, 'ding_soft', .6], [.5, 'car', .4]]);
// 26 «Frau Krause sieht dich.»: Frau Krause en el banco de la plaza con unos prismáticos de ópera
const KR0 = V(14, 0, 28.6);
shot(35.47, 'I', null, L => { town(L); const c = put(krause, KR0.x, .9, KR0.z, PI); actuar(c, 0, [[0, { ...SIT, ...BINO }]], { T: L.T }); binoIn(c); cara(c, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' });
  crowdAt(L, KR0.x, KR0.z, 6, 7, 16, 26, { mode: 'phone' }); onFace(c, 3.8, .2, .5, 40, L.k, 3.2); sh(KR0, 18); }, [[0, 'iris_pop', .6], [.2, 'birds', .4], [.5, 'zoom_in', .5], [.9, 'gasp_old', .3]]);
// 27 «Du bist an uns vorbeigewischt.»: el móvil gigante de la plaza: el vídeo del pueblo sube y desaparece
function rhScene(L, st, mode, expr) { town(L); RH.userData.draw(st); rowAt(L, HX, HZ + 7, 6, 4, -1.2, 1.2, mode, 27, { from: 0, face: V(HX, 0, HZ + 40) }); const k = put(krause, HX - 6.5, 0, HZ + 9, .5); actuar(k, 0, [[0, expr === 'shock' ? GEST.hands_face : expr === 'joy' ? GEST.cheer : GEST.slump]], { T: L.T }); cara(k, L.T, { expr, mouth: expr === 'joy' ? 'open_smile' : expr === 'shock' ? 'scream' : 'frown' }); }
shot(36.7, 'W', null, L => { rhScene(L, { swipe: easeInOut(clamp(L.lt / .9)) }, 'shock', 'shock'); cm([HX - 3, 7, HZ + 30, HX, 9, HZ, 46], [HX - 2, 7, HZ + 27, HX, 9, HZ, 44], L.k); sh(V(HX, 0, HZ), 24); }, [[0, 'swipe', .8], [.15, 'whoosh_up', .6], [.6, 'gasp', .6]]);
// 28 «Dreimal.»: tres veces seguidas: 3×
shot(37.94, 'C', 'punch', L => { rhScene(L, { swipe: 1 + clamp(L.lt / .8) * 2 }, 'sad', 'sad'); cm([HX + 2, 7, HZ + 30, HX, 9, HZ, 46], [HX + 1.6, 7.2, HZ + 27, HX, 9, HZ, 44], L.k); badge('red', '3×', W / 2, H * .3, (L.lt - .05) * 3); sh(V(HX, 0, HZ), 24); }, [[0, 'swipe', .7], [.25, 'swipe', .7], [.5, 'swipe', .7], [.6, 'sad_tone', .5]]);
// 29 «Und trotzdem kamst du zurück.»: el vídeo vuelve hacia abajo: el pueblo otra vez. ¡Todos lo celebran!
shot(38.9, 'S', null, L => { rhScene(L, { swipe: 3, back: easeInOut(clamp(L.lt / .7)) }, L.lt > .6 ? 'cheer' : 'shock', L.lt > .6 ? 'joy' : 'shock'); if (L.lt > .6) confetti(V(HX, 2, HZ + 6), L.t0 + .6, L.T, 50); cm([HX - 2, 6.5, HZ + 26, HX, 8.5, HZ, 46], [HX - 1, 6.8, HZ + 23, HX, 8.5, HZ, 44], L.k); sh(V(HX, 0, HZ), 24); }, [[0, 'whoosh_down', .7], [.6, 'cheer', .7], [.65, 'confetti', .5]]);
// 30 «Da wussten wir: Du bist anders.»: Frau Krause, con las manos en el corazón, se emociona
shot(40.33, 'F', null, L => { town(L); const c = put(krause, HX - 6.5, 0, HZ + 9, .3); actuar(c, 0, [[0, { aLx: 1.2, aLz: -.6, aLe: 1.9, aRx: 1.2, aRz: -.6, aRe: 1.9, headX: -.1, headZ: .15 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'cry', mouth: 'smile' }); tears(c, L.T); hearts(hp(c).add(V(0, 1, 0)), L.T);
  crowdAt(L, HX - 6.5, HZ + 9, 6, 6, 14, 30, { mode: 'clap' }); onFace(c, 3.6, .2, -.6, 40, L.k, 3.0); sh(V(HX - 6, 0, HZ + 9), 18); }, [[0, 'flash', .4], [.2, 'strings', .6], [.8, 'sniff', .5], [1.3, 'clap', .4]]);
// 31 «Deshalb hat mein Papa eine riesige Tafel gebaut.»: Papa en la escalera, a martillazos con la Tafel (aún apagada)
function papaLadder(L) { town(L); TAF.userData.draw({ off: true }); TAF.userData.bulbs(0); show(LAD, TX + 11.6, 0, TZ + 1.6, 0); const T = L.T, hit = Math.max(0, Math.sin(T * 9));
  const p = put(papa, TX + 11.6, 13.2, TZ + 2.4, -PI / 2 + .35); actuar(p, 0, [[0, { aRx: 1.6 + hit * .9, aRz: -.1, aRe: .3 + hit * .5, aLx: 1.2, aLe: .5, lLx: .4, lLk: .5 }]], { T }); cara(p, T, { expr: 'determined', mouth: 'grimace' });
  p.root.updateMatrixWorld(true); attach(HAM, p.aR.hand, [0, -.5, .35], [PI / 2, 0, 0], 1);
  const j = put(junge, TX + 13.6, 0, TZ + 4.2, -.6); actuar(j, 0, [[0, { aLx: 1.6, aRx: 1.6, aLe: .4, aRe: .4, headX: -.5 }]], { T }); cara(j, T, { expr: 'happy', eyes: 'up', mouth: 'open_smile' }); return p; }
shot(42.32, 'Z', null, L => { const p = papaLadder(L); const h = hp(p); cm([h.x + 3, h.y - 3, h.z + 16, h.x, h.y - .8, h.z, 46], [h.x + 2.6, h.y - 2.5, h.z + 14, h.x, h.y - .8, h.z, 44], L.k); sh(V(TX + 8, 0, TZ), 30); }, [[0, 'zoom_in', .5], [.1, 'hammer', .8], [.45, 'hammer', .8], [.8, 'hammer', .8], [1.2, 'wood_creak', .5], [1.6, 'hammer', .7]]);
shot(43.5, 'C', null, L => { const p = papaLadder(L); onFace(p, 3.6, .3, .6, 40, L.k, 3.1); }, [[0, 'whoosh', .4], [.1, 'hammer', .8], [.5, 'hammer', .7], [.9, 'hammer', .7]]);
// 32 «Mit 600 Glühbirnen.»: se encienden las bombillas una a una alrededor del marco
shot(44.92, 'C', 'punch', L => { town(L); TAF.userData.draw({}); TAF.userData.bulbs(easeOut(clamp(L.lt / 1.0)), L.T, 0); grade.uniforms.flash.value = L.lt < .1 ? .3 : 0; const p = put(papa, TX + 5, 0, TZ + 8, -.3); actuar(p, 0, [[0, GEST.cheer]], { T: L.T }); cara(p, L.T, { expr: 'joy', mouth: 'open_smile' });
  cm([TX + 3, 8, TZ + 34, TX, 17, TZ, 46], [TX + 2.4, 8.6, TZ + 31, TX, 17.4, TZ, 44], L.k); badge('gold', '600', W / 2, H * .45, (L.lt - .1) * 3); sh(V(TX, 0, TZ), 30); }, [[0, 'power_on', .8], [.1, 'sparkle', .6], [.3, 'switch', .5], [.6, 'ding_soft', .5]]);
// 33 «Jeder, der zuschaut, bekommt eine Zeile.»: la Tafel encendida; Papa la presenta y el pueblo mira
shot(46.2, 'W', null, L => { town(L); tafelAt(46, {}); TAF.userData.bulbs(1, L.T, 1); const p = put(papa, TX - 7, 0, TZ + 7, .6); actuar(p, 0, [[0, { ...GEST.point_l, aLx: 2.0 }]], { T: L.T }); talk(p, L.T, 46.2, 48.3, 'happy');
  rowAt(L, TX, TZ + 22, 9, 6, -1.0, 1.0, 'stare', 33, { from: 0, face: V(TX, 0, TZ) }); cm([TX + 8, 6, TZ + 40, TX, 15, TZ, 46], [TX + 6, 6.5, TZ + 36, TX, 15.5, TZ, 44], L.k); sh(V(TX, 0, TZ + 10), 30); }, [[0, 'whoosh', .5], [.3, 'crowd_run', .3], [.9, 'notif', .5], [1.4, 'pop', .5]]);

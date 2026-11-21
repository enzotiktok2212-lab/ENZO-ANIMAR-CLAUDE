// ---------- b: el Neuer, el Paketshop, los paquetes, mi hermana, el policía (30,87 – 66,25 s) ----------
const PLZ = V(-8, 0, 14);                 // centro de la plaza
const STREET = V(22, 0, 84);              // calle delante de casa (mi hermana)
const SHOPD = V(46, 0, 10);               // delante de la puerta del Paketshop (fachada en x = 53.6, mirando -x)
const CLERK = V(PX, 0, -6.8);             // dependiente detrás del mostrador (mira +z)
const CUST = V(PX + .4, 0, -1.3);         // cliente delante del mostrador (mira -z)
// pila de paquetes sobre la carretilla (n = cuántos), en p mirando ry
function tower(n, p, ry = 0) { show(KARRE, p.x, 0, p.z, ry); let y = .45; for (let i = 0; i < n && i < PKGS.length; i++) { const q = PKGS[i], h = q.userData.h; const s = .62; const lx = Math.sin(i * 2.1) * .12, lz = .2 + Math.cos(i * 1.7) * .1;
  show(q, p.x + Math.cos(ry) * lx + Math.sin(ry) * lz, y, p.z - Math.sin(ry) * lx + Math.cos(ry) * lz, ry + Math.sin(i * 3.3) * .2, s); y += h * s; } return y; }
const clerkAt = (L, pose, face) => { const c = put(lehr, CLERK.x, 0, CLERK.z, 0); actuar(c, 0, [[0, pose]], { T: L.T }); cara(c, L.T, face); return c; };

// 25 «Aber eines Tages kam» (zoom lento): la carretera de entrada: un chico desconocido se acerca con su mochila
shot(30.87, 'I', 'slow', L => { town(L); const z = 318 - L.lt * 3.2; walkTo(det, 25, 318, PI, 3.2, L, 0, 7); cara(det, L.T, { expr: 'smug', mouth: 'smirk' });
  grade.uniforms.sat.value = 1.3; cm([26.5, 4.2, z - 30], [26.2, 3.6, z - 21], easeIn(L.k)); camera.lookAt(25, 3.0, z); camera.fov = 38; sh(V(25, 0, z), 20); }, [[0, 'wind', .45], [.3, 'steps', .35]]);
// 26 «ein Neuer in die Stadt.»: pasa junto al cartel LUKASHAUSEN y lo lee sonriendo
shot(32.03, 'S', null, L => { town(L); const r = .25, c = SIGNP; const x = c.x + Math.cos(r) * 4.6 + Math.sin(r) * 3.2, z = c.z - Math.sin(r) * 4.6 + Math.cos(r) * 3.2; put(det, x, 0, z, r + PI * .8);
  actuar(det, L.lt, [[0, { aRx: .3 }], [.3, { aRx: 1.2, aRz: -.3, aRe: 1.6, headY: .3, headX: -.1 }, { dur: .25 }]], { T: L.T }); cara(det, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'squint' });
  orb(L.k, V(c.x + Math.cos(.25) * 2, 5.2, c.z - Math.sin(.25) * 2 + 1.5), null, [25, .3, .06, 44], [22, .24, .05, 44]); sh(c, 20); }, [[0, 'steps', .4], [.35, 'hmm', .35]]);
// 27 «Hallo, ich bin Lukas!»: primer plano: saluda con una sonrisa enorme y su placa LUKAS recién puesta
shot(33.28, 'C', 'punch', L => { town(L); const p = V(-4, 0, 30); put(det, p.x, 0, p.z, .1); actuar(det, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 10) * .35, aRe: .4 }]], { T: L.T }); grin(det, L.T, { mouth: L.T < 33.8 ? 'open_smile' : 'grin' });
  crowdAt(L, p.x, p.z - 3, 6, 6, 12, 27, { mode: 'idle', expr: 'happy', list: EX, from: 8 });
  bubble(det, L.T < 33.8 ? 'Hallo!' : 'Ich bin Lukas!', 1, 1.5); onBody(det, 9.2, .1, .06, 40, L.k, 8.4); sh(p, 16); }, [[0, 'pop', .45], [.55, 'ding_soft', .4]]);
// 28 «Und alle haben sich gefreut.»: la plaza le aclama; confeti
shot(34.70, 'F', null, L => { town(L); put(det, PLZ.x, 0, PLZ.z, 0); actuar(det, 0, [[0, { ...GEST.cheer, aLx: .3, aLz: .1 }]], { T: L.T }); grin(det, L.T);
  crowdAt(L, PLZ.x, PLZ.z, 18, 4.5, 13, 28, { mode: 'cheer', face: V(PLZ.x, 3, PLZ.z), gap: 1.0 }); confRain(V(PLZ.x, 0, PLZ.z), L.T, 60, 22, 18, 16);
  orb(L.k, V(PLZ.x, 3.6, PLZ.z), null, [19, -.2, .26, 46], [16, .05, .22, 46]); sh(PLZ, 22); }, [[0, 'cheer', .6], [.2, 'confetti', .45], [.6, 'party_horn', .4]]);
// 29 «Denn wer hier Lukas heißt,»: Papa (Lukas) le estrecha la mano; los dos señalan su placa LUKAS
shot(36.23, 'W', null, L => { town(L); const p = V(10, 0, 24); put(det, p.x + 1.6, 0, p.z, -PI / 2 + .45); put(papa, p.x - 1.6, 0, p.z, PI / 2 - .45); const s_ = Math.sin(L.T * 14) * .12;
  actuar(det, 0, [[0, { aRx: 1.3 + s_, aRz: -.3, aRe: .4 }]], { T: L.T }); actuar(papa, 0, [[0, { aRx: 1.3 - s_, aRz: -.3, aRe: .4, aLx: .9, aLz: -.6, aLe: 1.9 }]], { T: L.T }); grin(det, L.T); laughF(papa, L.T);
  orb(L.k, V(p.x + .3, 3.2, p.z - .4), null, [12, .08, .1, 42], [10.5, -.05, .08, 42]); sh(p, 14); }, [[0, 'slap', .45], [.4, 'laugh_m', .4]]);
// 30 «dem vertraut man.»: Mama le regala una tarta; corazones
shot(37.57, 'Z', null, L => { town(L); const p = V(10, 0, 24); put(det, p.x + 1.4, 0, p.z, -PI / 2 + .5); actuar(det, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.3, aRz: -.3, aLe: .6, aRe: .6 }]], { T: L.T }); cara(det, L.T, { expr: 'happy', eyes: 'happy', mouth: 'grin' });
  put(mama, p.x - 1.4, 0, p.z, PI / 2 - .5); actuar(mama, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.3, aRz: -.3, aLe: .6, aRe: .6 }]], { T: L.T }); cara(mama, L.T, { expr: 'love', eyes: 'happy', mouth: 'smile' });
  show(CAKE, p.x, 2.55, p.z + .6, 0, .9); hearts(V(p.x, 6.4, p.z), L.T); orb(L.k, V(p.x, 3.2, p.z), null, [11, .05, .1, 42], [9.5, 0, .08, 42]); sh(p, 14); }, [[0, 'aah', .4], [.3, 'ding_soft', .35]]);
// 31 «Noch am selben Nachmittag ging er in den Paketshop»: camina hacia la tienda verde PAKETSHOP
shot(38.52, 'S', null, L => { town(L); const d = walkTo(det, SHOPD.x - 12, SHOPD.z + 3, PI / 2 + .1, 3.0, L, 0, 8); cara(d, L.T, { expr: 'smug', mouth: 'smirk' });
  crowdAt(L, SHOPD.x - 8, SHOPD.z, 4, 6, 10, 31, { mode: 'walk', list: EX, from: 12, gap: 1.6 });
  cm([SHOPD.x - 18, 6, SHOPD.z + 18], [SHOPD.x - 14, 5.4, SHOPD.z + 15], L.k); camera.lookAt(SHOPD.x + 4, 5, SHOPD.z); camera.fov = 48; sh(SHOPD, 22); }, [[0, 'steps', .45], [.5, 'city_amb', .35]]);
// 32 «und sagte:»: dentro: entra hasta el mostrador; el dependiente le saluda
shot(40.10, 'C', null, L => { shop(L); const c = clerkAt(L, { aRx: 2.6, aRz: .4 + Math.sin(L.T * 9) * .3, aRe: .4 }, { expr: 'happy', mouth: 'open_smile' });
  walkTo(det, CUST.x, CUST.z + 4.5 - Math.min(L.lt, 1) * 0, PI, 2.4, L, 0, 7); cara(det, L.T, { expr: 'happy', mouth: 'smile' });
  cm([PX + 6, 7, 14], [PX + 5, 6.5, 12], L.k); camera.lookAt(PX, 4, -3); camera.fov = 48; sh(V(PX, 0, -2), 20); }, [[0, 'door_bell', .5], [.3, 'steps', .35]]);
// 33 «Ich hol die Pakete für Lukas ab.»: apoyado en el mostrador, con voz dulce; señala su placa
shot(41.30, 'Z', null, L => { shop(L); clerkAt(L, { aLx: .4, aRx: .4 }, { expr: 'happy', mouth: 'smile' }); const d = put(det, CUST.x, 0, CUST.z, PI); actuar(d, 0, [[0, { aLx: .9, aLz: -.6, aLe: 1.9, aRx: 1.3, aRz: -.1, aRe: .4, lean: .08 }]], { T: L.T }); talk(d, L.T, 41.3, 42.76, 'happy', { eyes: 'happy' });
  bubble(d, 'Pakete für Lukas!', clamp(L.lt / .1), 1.4); const h = hp(d); cm([h.x + 3.6, h.y + .4, h.z - 5.6], [h.x + 3.0, h.y + .3, h.z - 4.8], L.k); camera.lookAt(h.x, h.y - .6, h.z); camera.fov = 42; sh(CUST, 12); }, [[0, 'pop', .4]]);
// 34 «Und der Verkäufer gab ihm alles.»: el dependiente, encantado, empuja una montaña de paquetes por el mostrador
shot(42.92, 'W', null, L => { shop(L); const c = clerkAt(L, { aLx: 1.5, aRx: 1.5, aLz: -.2, aRz: -.2, aLe: .3, aRe: .3, lean: .15 + Math.sin(L.T * 6) * .04 }, { expr: 'happy', eyes: 'happy', mouth: 'grin' });
  const k = easeOut(clamp(L.lt / 1.2)); for (let i = 0; i < 6; i++) show(PKGS[i], PX - 3.6 + (i % 3) * 2.4, 4.5 + Math.floor(i / 3) * 1.6, -4.6 + k * 1.2, Math.sin(i) * .2, .7);
  put(det, CUST.x, 0, CUST.z + .6, PI); actuar(det, 0, [[0, GEST.cheer]], { T: L.T }); grin(det, L.T);
  cm([PX - 8, 7, 5], [PX - 7, 6.6, 4], L.k); camera.lookAt(PX, 4.6, -4.5); camera.fov = 46; sh(V(PX, 0, -3), 14); }, [[0, 'box_slide', .5], [.5, 'box_slide', .45]]);
// 35 «Jedes Paket für jeden Lukas»: las estanterías se vacían: la pila sobre su carretilla crece y crece
shot(44.85, 'F', null, L => { shop(L); const n = 3 + Math.floor(easeOut(clamp(L.lt / 1.1)) * 9); const p = V(PX + 2.6, 0, 4); tower(n, p, PI + .3);
  const d = put(det, p.x - 2.4, 0, p.z + .8, PI - .6); actuar(d, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .2, aRz: .2, aLe: .5, aRe: .5 }]], { T: L.T }); grin(d, L.T);
  clerkAt(L, GEST.wave, { expr: 'happy', mouth: 'open_smile' });
  cm([PX + 9, 6, 15], [PX + 8, 7, 13], L.k); camera.lookAt(p.x - .5, 5, p.z); camera.fov = 48; sh(p, 16); }, [[0, 'box_drop', .5], [.35, 'box_drop', .45], [.7, 'box_drop', .45]]);
// 36 «in der ganzen Stadt.»: sale a la calle empujando una torre de paquetes «LUKAS»
shot(46.03, 'S', null, L => { town(L); const x = SHOPD.x - 1 - L.lt * 2.2, p = V(x, 0, SHOPD.z + 1); tower(14, p, -PI / 2); const d = put(det, x + 2.4, Math.abs(Math.sin(L.T * 9)) * .1, p.z, -PI / 2); actuar(d, 0, [[0, { ...walkP(L.T, 0, 9), aLx: 1.4, aRx: 1.4, aLe: .4, aRe: .4 }]], { T: L.T }); cara(d, L.T, { expr: 'smug', mouth: 'smirk' });
  orb(L.k, V(x, 5, p.z), null, [17, -1.1, .12, 46], [15, -.9, .1, 46]); badge('red', 'ALLE LUKAS-PAKETE', W / 2, H * .15, clamp((L.lt - .3) / .15), 1, .7); sh(p, 18); }, [[0, 'wheels', .5], [.4, 'steps', .3]]);
// 37 «Sneaker,»: unas zapatillas nuevas saltan de su caja
shot(47.68, 'C', 'punch', L => { shop(L); const p = V(PX + 3, 4.6, -4); show(PKGS[20], p.x, 4.5, p.z, .3, .8); const k = easeOut(clamp(L.lt / .3)); show(SNEAK[0], p.x - .6, 5.6 + k * 1.2, p.z + .2, .6 + L.lt, .9); show(SNEAK[1], p.x + .8, 5.6 + k * .9, p.z + .3, -.4 - L.lt, .9);
  cm([p.x + 1.6, 7.4, p.z + 6], [p.x + 1.2, 7.2, p.z + 5], L.k); camera.lookAt(p.x, 6.2, p.z); camera.fov = 40; sh(p, 10); }, [[0, 'box_open', .5], [.1, 'sparkle', .4]]);
// 38 «Handys,»: tres móviles
shot(48.40, 'C', 'punch', L => { shop(L); const p = V(PX - 2, 4.6, -4); PHONES.forEach((ph, i) => { show(ph, p.x - 1.4 + i * 1.4, 5.8 + Math.sin(L.T * 4 + i) * .1, p.z, 0, 1); ph.rotation.z = (i - 1) * .2; });
  cm([p.x + .4, 6.4, p.z + 5], [p.x + .2, 6.2, p.z + 4.2], L.k); camera.lookAt(p.x, 5.8, p.z); camera.fov = 40; sh(p, 10); }, [[0, 'phone_buzz', .5]]);
// 39 «Konsolen…»: dos consolas
shot(48.96, 'C', 'punch', L => { shop(L); const p = V(PX + 1, 4.6, -4); KONS.forEach((k, i) => show(k, p.x - 1.9 + i * 3.8, 4.55, p.z + (i ? .4 : 0), (i ? -.4 : .4), .85));
  cm([p.x, 7.6, p.z + 6], [p.x, 7.2, p.z + 5], L.k); camera.lookAt(p.x, 5, p.z); camera.fov = 42; sh(p, 10); }, [[0, 'game_beep', .5]]);
// 40 «und das Geburtstagsgeschenk von meiner Schwester.» (zoom lento): la caja rosa «Für Mia 6» acaba en lo alto de la torre
shot(49.40, 'Z', 'slow', L => { shop(L); const p = V(PX + 2.6, 0, 4); const top = tower(12, p, PI + .3); const k = easeOut(clamp(L.lt / .5)); show(GIFT, p.x, lerp(top + 2.4, top, k), p.z + .2, PI + .1, .75);
  const d = put(det, p.x - 2.4, 0, p.z + .8, PI - .6); actuar(d, 0, [[0, { aLx: 2.8, aRx: .3, aLz: .1, aLe: .3 }]], { T: L.T }); cara(d, L.T, { expr: 'smug', mouth: 'smirk' });
  cm([p.x + 1, top + 1.6, p.z - 8], [p.x + .6, top + .6, p.z - 5.2], easeIn(L.k)); camera.lookAt(p.x, top + .4, p.z); camera.fov = 42; sh(p, 12); }, [[0, 'box_drop', .4]]);
// 41 (pausa) mi hermana espera en la ventana, triste, mirando la calle
shot(51.61, 'W', null, L => { town(L); const p = V(STREET.x, 0, STREET.z); const b = put(bru, p.x, 0, p.z, .3); actuar(b, 0, [[0, { aLx: .4, aRx: .4, aLz: -.3, aRz: -.3, aLe: 1.4, aRe: 1.4, headX: .3, headY: Math.sin(L.T * 1.5) * .4 }]], { T: L.T }); cara(b, L.T, { expr: 'sad', mouth: 'frown' });
  orb(L.k, V(p.x, 2.0, p.z), null, [10, .3, .14, 42], [8.5, .15, .1, 42]); sh(p, 12); }, [[0, 'clock_tick', .4]]);
// 42 «Leon, meine»: llorando, me lo cuenta; yo la escucho
shot(52.70, 'F', null, L => { town(L); const b = put(bru, STREET.x + 1.4, 0, STREET.z, -PI / 2 + .6); actuar(b, 0, [[0, { aLx: .9, aRx: .9, aLz: .2, aRz: .2, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); talk(b, L.T, 52.7, 53.8, 'cry', { eyes: 'cry' }); tears(b, L.T);
  put(me, STREET.x - 1.8, 0, STREET.z - .4, PI / 2 - .6); actuar(me, 0, [[0, GEST.listen]], { T: L.T }); cara(me, L.T, { expr: 'worried' });
  orb(L.k, V(STREET.x - .2, 2.7, STREET.z), null, [10.5, .08, .1, 42], [9.5, 0, .08, 42]); sh(STREET, 12); }, [[0, 'sniff', .45]]);
// 43 «Kopfhörer»: su móvil: «PAKET abgeholt – von: LUKAS»
shot(53.84, 'C', null, L => { town(L); const b = put(bru, STREET.x, 0, STREET.z, 0); actuar(b, 0, [[0, { aRx: 1.5, aRz: -.1, aRe: 1.3, aLx: .4, headX: .35 }]], { T: L.T }); cara(b, L.T, { expr: 'cry', eyes: 'cry', mouth: 'frown' });
  const rh = wpos(b.aR.hand); show(HANDY, rh.x, rh.y + .5, rh.z + .4, 0, .9); HANDY.rotation.x = -.25;
  cm([rh.x + .3, rh.y + 1.1, rh.z + 3.6], [rh.x + .2, rh.y + .9, rh.z + 2.9], L.k); camera.lookAt(rh.x, rh.y + .5, rh.z + .4); camera.fov = 40; sh(STREET, 8); }, [[0, 'phone_buzz', .45], [.3, 'sad_tone', .35]]);
// 44 «sind nicht gekommen!»: brazos abiertos, desconsolada
shot(54.46, 'S', null, L => { town(L); const b = put(bru, STREET.x, 0, STREET.z, -.2); actuar(b, 0, [[0, { aLx: .5, aRx: .5, aLz: .9, aRz: .9, aLe: .5, aRe: .5, headX: -.2 }]], { T: L.T }); talk(b, L.T, 54.4, 55.3, 'cry', { eyes: 'cry' }); tears(b, L.T);
  bubble(b, 'nicht gekommen!', clamp((L.lt - .2) / .1), 1.5); onBody(b, 8.6, .15, .1, 42, L.k, 7.6); sh(STREET, 12); }, [[0, 'cry_girl', .35]]);
// 45 «Also hab ich ihr versprochen,»: me agacho y le pongo la mano en el hombro
shot(55.51, 'W', null, L => { town(L); const b = put(bru, STREET.x + 1.2, 0, STREET.z, -PI / 2 + .5); actuar(b, 0, [[0, { aLx: .3, aRx: .3, headX: .1 }]], { T: L.T }); cara(b, L.T, { expr: 'sad', mouth: 'frown' });
  const m = put(me, STREET.x - 1.2, 0, STREET.z, PI / 2 - .5); actuar(m, 0, [[0, { crouch: .45, lean: .15, aRx: 1.5, aRz: -.15, aRe: .3, headX: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'smile', mouth: 'smile' });
  orb(L.k, V(STREET.x, 2.2, STREET.z), null, [10, -.2, .1, 42], [9, -.05, .08, 42]); sh(STREET, 12); }, [[0, 'cloth', .4], [.5, 'hug', .3]]);
// 46 «dass ich sie zurückhole.» (zoom lento): plano bajo, puño cerrado
shot(56.65, 'Z', 'slow', L => { town(L); const m = put(me, STREET.x - 1.2, 0, STREET.z, .15); actuar(m, 0, [[0, { aRx: 1.9, aRz: -.3, aRe: 2.2, headX: -.08 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'flat' });
  const h = hp(m); cm([h.x + .8, h.y - 1.8, h.z + 7.5], [h.x + .6, h.y - 1.5, h.z + 5.6], easeIn(L.k)); camera.lookAt(h.x, h.y - .4, h.z); camera.fov = 42; sh(STREET, 12); }, [[0, 'heartbeat', .4]]);
// 47 «Polizist Lukas ging in den Paketshop.»: el coche patrulla delante de la tienda; el policía entra
shot(57.78, 'I', null, L => { town(L); PCAR.position.set(SHOPD.x - 6, 0, SHOPD.z - 8); PCAR.rotation.y = PI / 2; const c = walkTo(pol, SHOPD.x - 4, SHOPD.z + 1, PI / 2, 2.2, L, 0, 7); cara(c, L.T, { expr: 'determined' });
  cm([SHOPD.x - 18, 5.4, SHOPD.z + 10], [SHOPD.x - 15, 5, SHOPD.z + 8], L.k); camera.lookAt(SHOPD.x + 2, 4, SHOPD.z); camera.fov = 46; sh(SHOPD, 20); }, [[0, 'siren', .35], [.3, 'car_door', .5]]);
// 48 «Wem haben Sie die Pakete gegeben?»: en el mostrador, libreta en mano
shot(59.88, 'C', null, L => { shop(L); clerkAt(L, { aLx: .3, aRx: .3 }, { expr: 'happy', mouth: 'smile' }); const c = put(pol, CUST.x, 0, CUST.z, PI - .15); actuar(c, 0, [[0, { aLx: 1.3, aLz: -.3, aLe: 1.3, aRx: 1.1, aRz: -.5, aRe: 1.6, headX: .1 }]], { T: L.T }); talk(c, L.T, 59.8, 61.2, 'talk');
  const lh = wpos(c.aL.hand); show(NOTEPAD, lh.x, lh.y + .4, lh.z - .3, PI, 1);
  const h = hp(c); cm([h.x - 3.4, h.y + .5, h.z - 6], [h.x - 2.9, h.y + .4, h.z - 5.2], L.k); camera.lookAt(h.x, h.y - .5, h.z); camera.fov = 42; sh(CUST, 12); }, [[0, 'pencil', .45]]);
// 49 «Lukas!»: el dependiente, feliz: LUKAS!
shot(61.45, 'C', 'punch', L => { shop(L); const c = clerkAt(L, { aRx: 2.7, aRz: .3, aRe: .3, aLx: .4 }, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); bubble(c, 'LUKAS!', clamp(L.lt / .08), 1.4);
  onFace(c, 4.4, .2, .3, 40, L.k, 3.9); sh(CLERK, 10); }, [[0, 'pop', .5]]);
// 50 «Welchem denn?»: el policía (con su placa LUKAS), perdido, con un «?» enorme
shot(61.91, 'Z', null, L => { shop(L); const c = put(pol, CUST.x, 0, CUST.z, PI - .15); actuar(c, 0, [[0, { ...GEST.shrug, headZ: .25 }]], { T: L.T }); talk(c, L.T, 61.9, 62.8, 'confused');
  badge('q', '?', W * .72, H * .2, clamp(L.lt / .12), 1, 1); onFace(c, 4.4, .1, -.3, 40, L.k, 3.9); sh(CUST, 12); }, [[0, 'boing_metal', .45]]);
// 51 «Der Verkäufer zuckte nur mit den Schultern.»: el dependiente se encoge de hombros
shot(62.94, 'S', null, L => { shop(L); const c = clerkAt(L, { ...GEST.shrug }, { expr: 'confused', mouth: 'wavy' }); put(pol, CUST.x - 1.6, 0, CUST.z + .6, PI + .5); actuar(pol, 0, [[0, GEST.cross]], { T: L.T }); cara(pol, L.T, { expr: 'sus' });
  cm([PX + 7, 6.6, 6], [PX + 6, 6.3, 5], L.k); camera.lookAt(PX, 4.6, -5); camera.fov = 44; sh(V(PX, 0, -4), 14); }, [[0, 'cloth', .45], [.3, 'hmm', .4]]);
// 52 «Hier heißt doch jeder Lukas.»: travelling por la cola de clientes: LUKAS, LUKAS, LUKAS…
shot(64.79, 'W', null, L => { shop(L); const q = BOYZ.slice(0, 7); q.forEach((c, i) => { put(c, PX - 9 + i * 3, 0, 8, 0); actuar(c, 0, [[0, { aLx: .2, aRx: .2, headY: Math.sin(L.T + i) * .2 }]], { T: L.T }); cara(c, L.T + i, { expr: 'happy' }); });
  const x = lerp(PX - 8, PX + 6, L.k); cam([x, 3.2, 14], [x + 1.2, 3.0, 8], 42); sh(V(PX, 0, 8), 16); }, [[0, 'whoosh_soft', .35], [.5, 'murmur', .35]]);

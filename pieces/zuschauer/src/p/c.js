// ---------- c: las filas de la Tafel, «Und du?», el silencio, 29 segundos, el pulgar gigante (48,36 – 68,13 s) ----------
const TS = V(TX, 0, TZ + .34);   // pantalla de la Tafel (y 9..29)
const rowY = i => 29 - (240 + i * 110) / 680 * 20;
// primer plano de una fila de la Tafel (icono a la izquierda)
function rowShot(L, i, extra = {}) { town(L); tafelAt(L.T); TAF.userData.bulbs(1, L.T, 1); const y = rowY(i); cm([TX + .8, y - 1.5, TZ + 34, TX + .8, y - 1.8, TZ, 38], [TX + .9, y - 1.5, TZ + 30, TX + .9, y - 1.8, TZ, 36], L.k); sh(V(TX, 0, TZ), 30); }
// el pueblo delante de la Tafel, mirando a la cámara
function crowdTafel(L, mode, seed, o = {}) { town(L); tafelAt(L.T, o); TAF.userData.bulbs(1, L.T, 1); rowAt(L, TX, TZ + 2, 7, 13, -.5, .5, mode, seed, { from: 0, face: V(TX, 0, TZ + 60) }); rowAt(L, TX, TZ + 2, 8, 9.5, -.62, .62, mode, seed + 1, { from: 7, face: V(TX, 0, TZ + 60) }); }
// 34 «Drei Sekunden? Weg.»: la primera fila: 0:03… y la cruz roja
shot(48.36, 'C', null, L => { rowShot(L, 0); }, [[0, 'pop', .6], [.3, 'tick', .6], [1.0, 'glitch', .6], [1.05, 'sad_tone', .4]]);
// 35 «Sieben Sekunden? Weg.»: la segunda fila; el pueblo, decepcionado
shot(49.55, 'S', null, L => { crowdTafel(L, L.T > 50.88 ? 'sad' : 'stare', 35); cm([TX + 3, 6, TZ + 30, TX, 14, TZ, 46], [TX + 2, 6.4, TZ + 27, TX, 14.5, TZ, 44], L.k); sh(V(TX, 0, TZ + 12), 30); }, [[0, 'whoosh', .5], [.2, 'pop', .6], [1.3, 'glitch', .6], [1.35, 'sigh', .5]]);
// 36 «Zwölf Sekunden? Auch weg.»: la tercera fila
shot(50.93, 'C', 'punch', L => { rowShot(L, 2); }, [[0, 'pop', .6], [.4, 'tick', .5], [1.2, 'glitch', .6]]);
// 36b «… weg.»: Kalle se lleva la mano a la cara; Frau Krause, triste
shot(52.07, 'W', null, L => { town(L); tafelAt(L.T); const k = put(kalle, TX - 2.2, 0, TZ + 16, .15); actuar(k, 0, [[0, GEST.facepalm]], { T: L.T }); cara(k, L.T, { expr: 'sad', mouth: 'frown' }); const r = put(krause, TX + 2.2, 0, TZ + 16.5, -.15); actuar(r, 0, [[0, GEST.slump]], { T: L.T }); cara(r, L.T, { expr: 'sad', mouth: 'frown' });
  cm([TX, 6.6, TZ + 28, TX, 6.2, TZ + 16, 42], [TX, 6.4, TZ + 27, TX, 6.2, TZ + 16, 40], L.k); sh(V(TX, 0, TZ + 16), 20); }, [[0, 'whoosh', .4], [.1, 'sad_tone', .5], [.3, 'sigh', .5]]);
// 37 «Und du? Immer noch da?» (zoom lento): tu fila, verde: «DU 0:24» y subiendo; todos se giran hacia ti
shot(52.7, 'Z', 'slow', L => { crowdTafel(L, 'stare', 37); const y = rowY(3); cm([TX + 1, 8, TZ + 34, TX, y, TZ, 44], [TX + .5, 10, TZ + 24, TX, y, TZ, 38], L.k); sh(V(TX, 0, TZ + 12), 30); }, [[0, 'heartbeat', .6], [.5, 'tick', .4]]);
// 38 «Plötzlich wurde es ganz still.»: grúa sobre la plaza: nadie se mueve, solo grillos
shot(53.93, 'F', null, L => { crowdTafel(L, 'freeze', 38); orb(L.k, V(TX, 5, TZ + 16), null, [24, .45, .25, 46], [22, .3, .22, 44]); sh(V(TX, 0, TZ + 10), 34); }, [[0, 'freeze', .6], [.2, 'crickets', .7], [.9, 'wind', .4]]);
cut(54.8, 'C', [-.7, .6, -6], [[0, 'whoosh', .3], [.2, 'silence_tick', .6]]);
// 39 «Keiner bewegt sich!»: Papa abre los brazos: ¡quietos! El pueblo, congelado a media pose
shot(55.62, 'C', 'punch', L => { crowdTafel(L, 'freeze', 39); const p = put(papa, TX, 0, TZ + 20, 0); actuar(p, 0, [[0, { aLx: .3, aLz: 1.4, aRx: .3, aRz: 1.4, aLe: .2, aRe: .2, lean: .05 }]], { T: L.T }); cara(p, L.T, { expr: 'shout', eyes: 'wide', mouth: 'scream' });
  onFace(p, 4.6, .4, .3, 42, L.k, 4.0); sh(V(TX, 0, TZ + 16), 26); }, [[0, 'slam', .7], [.1, 'shout_m', .6], [.5, 'freeze', .5]]);
// 40 «Er ist bei 29 Sekunden.» (zoom lento): «DU 0:29», enorme
shot(56.84, 'Z', 'slow', L => { town(L); tafelAt(L.T); TAF.userData.bulbs(1, L.T, 1); const y = rowY(3); cm([TX + 1, y - 1, TZ + 40, TX + 1, y - 2, TZ, 40], [TX + 1, y - 1, TZ + 31, TX + 1, y - 2, TZ, 36], L.k); sh(V(TX, 0, TZ), 30); }, [[0, 'tick', .6], [.4, 'clock_tick', .6], [.9, 'tick', .5]]);
// 41 «So weit ist noch nie jemand gekommen.»: la Tafel se pone dorada: ¡REKORD! Kalle y Frau Krause, boquiabiertos
shot(58.6, 'W', null, L => { town(L); tafelAt(L.T, { gold: 1, rec: true }); TAF.userData.bulbs(1, L.T, 1); const k = put(kalle, TX - 2.4, 0, TZ + 15, .2); actuar(k, 0, [[0, GEST.hands_face]], { T: L.T }); cara(k, L.T, { expr: 'shock', mouth: 'o' }); const r = put(krause, TX + 2.4, 0, TZ + 15.5, -.2); actuar(r, 0, [[0, GEST.shock]], { T: L.T }); cara(r, L.T, { expr: 'shock', mouth: 'scream' }); tears(r, L.T);
  cm([TX, 7, TZ + 31, TX, 9.5, TZ + 6, 44], [TX, 7.4, TZ + 28, TX, 10, TZ + 6, 42], L.k); sh(V(TX, 0, TZ + 10), 26); }, [[0, 'whoosh', .5], [.1, 'fanfare', .4], [.4, 'gasp', .6], [1.2, 'gasp_old', .5]]);
cut(59.6, 'C', [.4, .8, 0], [[0, 'whoosh', .4], [.2, 'sparkle', .5]]);
// 42 «Doch dann kam der Daumen.»: el cielo se oscurece y baja un pulgar gigante sobre el Rathaus
shot(60.67, 'F', null, L => { town(L); const q = easeOut(L.k); setSky([.1, .12, .3], [.3, .3, .5], [.6, .55, .7]); sun.intensity = 1.2; hemi.intensity = .9; daumenAt(TX + 2, lerp(140, 70, q), TZ - 30, L.T); crowdTafel(L, 'point', 42);
  cm([TX - 4, 3, TZ + 46, TX, 46, TZ - 20, 52], [TX - 3, 3.2, TZ + 44, TX, 54, TZ - 20, 52], L.k); sh(V(TX, 0, TZ), 40); }, [[0, 'thunder', .6], [.2, 'whoosh_down', .7], [.8, 'drone', .6], [1.2, 'gasp', .5]]);
cut(61.5, 'C', [-.4, .8, 2], [[0, 'whoosh', .4], [.1, 'hum_low', .6]]);
// 43 «Riesig.»: desde abajo, la yema del pulgar con su huella, enorme
shot(62.27, 'C', 'punch', L => { town(L); setSky([.1, .12, .3], [.3, .3, .5], [.6, .55, .7]); sun.intensity = 1.2; daumenAt(TX + 2, 60, TZ - 10, L.T, { rx: -.6 }); crowdTafel(L, 'shock', 43); cm([TX + 2, 4, TZ + 30, TX + 2, 60, TZ - 10, 56], [TX + 2, 4, TZ + 28, TX + 2, 61, TZ - 10, 54], L.k); sh(V(TX, 0, TZ), 40); }, [[0, 'impact', .7], [.05, 'braam_short', .5], [.2, 'gasp', .6]]);
// 44 «Direkt über der Stadt.»: plano aéreo: el pulgar flota sobre la plaza, su sombra sobre el pueblo
shot(62.87, 'S', null, L => { town(L); setSky([.1, .12, .3], [.3, .3, .5], [.6, .55, .7]); sun.intensity = 1.6; daumenAt(TX, 48, TZ + 10, L.T); crowdTafel(L, 'cower', 44); orb(L.k, V(TX, 40, TZ + 8), null, [130, .9, .32, 48], [120, .7, .28, 46]); sh(V(TX, 0, TZ + 10), 60); }, [[0, 'whoosh', .5], [.2, 'wind', .6], [.6, 'heli', .3]]);
// 45 «Alle – festhalten!»: todos se agarran: a las farolas, unos a otros; Papa abraza al chico
shot(64.1, 'C', 'punch', L => { town(L); setSky([.1, .12, .3], [.3, .3, .5], [.6, .55, .7]); sun.intensity = 1.2; daumenAt(TX, 44, TZ + 10, L.T); crowdTafel(L, 'hold', 45); const p = put(papa, TX, 0, TZ + 20, 0); actuar(p, 0, [[0, shv(GEST.brace, L.T, 2)]], { T: L.T }); cara(p, L.T, { expr: 'shout', eyes: 'angry', mouth: 'scream' });
  const j = put(junge, TX + 3, 0, TZ + 19, -.3); actuar(j, 0, [[0, shv(GEST.cower, L.T, 2)]], { T: L.T }); cara(j, L.T, { expr: 'worried', eyes: 'closed', mouth: 'grimace_wide' }); SHAKE = .3; onFace(p, 6, 1.5, .5, 46, L.k, 5.4); sh(V(TX, 0, TZ + 16), 26); }, [[0, 'slam', .6], [.1, 'shout_m', .6], [.4, 'wind', .6], [.8, 'shiver', .5]]);
// 46 (silencio de tensión, zoom lento): el pulgar justo encima de la Tafel; tu contador sigue corriendo
shot(65.35, 'Z', 'slow', L => { town(L); setSky([.1, .12, .3], [.3, .3, .5], [.6, .55, .7]); sun.intensity = 1.2; tafelAt(L.T); TAF.userData.bulbs(1, L.T, 1); daumenAt(TX, 40 - L.k * 3, TZ + 4, L.T, { rx: -.1 }); crowdTafel(L, 'hold', 46);
  const y = rowY(3); cm([TX + 4, 6, TZ + 40, TX, 22, TZ, 50], [TX + 1.5, 9, TZ + 22, TX, 18, TZ, 44], L.k); SHAKE = .12; sh(V(TX, 0, TZ + 10), 34); }, [[0, 'heartbeat', .8], [.9, 'heartbeat', .8], [1.8, 'heartbeat', .8], [.3, 'tick', .5], [1.3, 'tick', .5], [2.3, 'tick', .5]]);
cut(66.75, 'C', [-.6, .7, -3], [[0, 'silence_tick', .5], [.5, 'shiver', .4]]);

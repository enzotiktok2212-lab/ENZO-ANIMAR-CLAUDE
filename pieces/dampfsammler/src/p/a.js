// ---------- a: gancho, el DJ, el Dampfring-Meister (0 – 31,09 s) ----------
const G1 = EX[7], GP = V(-10, 0, 14);            // el chico que vapea a escondidas en la plaza (mira a +z)
const STY = CL.SY, DJP = V(CX, STY, -21.9);         // el DJ en el escenario del club (mira a +z)
const RKP = V(RSP.x, RS.H + .2, RSP.z + 1);      // Rocco en la tarima (mira a +z)
const clubCrowd = (L, o = {}) => crowdGrid(L, CX, -12, 7, 4, 3.8, 3.8, { face: V(CX, 6, -21), mode: 'dance', jit: .25, seed: 5, ...o });
const ringCrowd = (L, o = {}) => crowdGrid(L, RSP.x, RSP.z + 14, 6, 3, 4, 3.6, { face: V(RSP.x, 6, RSP.z), mode: 'cheer', jit: .2, seed: 9, ...o });
const djPlay = (L, o = {}) => { put(dj, DJP.x, DJP.y, DJP.z, 0); const s = Math.sin(L.T * 10); actuar(dj, 0, [[0, { aLx: 1.25 + s * .12, aRx: 1.3 - s * .12, aLz: -.15, aRz: -.15, aLe: .9, aRe: .9, headX: .12 + Math.abs(s) * .12, crouch: Math.abs(s) * .08, ...(o.pose || {}) }]], { T: L.T }); if (!o.face) grin(dj, L.T); return dj; };

// 1 «In dieser Stadt ist» (zoom lento): grúa que baja sobre Hufenbach: carteles DAMPFEN VERBOTEN por todas partes, la gente paseando
shot(0, 'C', 'slow', L => { town(L); crowdAt(L, -8, 6, 14, 6, 22, 1, { mode: 'walk', speed: 2, full: true, gap: .4 });
  cm([-4, 46, 78, -10, 4, 2, 48], [-8, 16, 40, -12, 6, 6, 46], L.k, easeOut); sh(V(-10, 0, 4), 40); }, [[0, 'city_amb', .5], [.2, 'birds', .4]]);
// 2 «Dampfen streng verboten.»: el cartel en primer plano; una madre se lo señala a su hijo
shot(1.10, 'W', 'punch', L => { town(L); const m = put(EX[3], -11.6, 0, 11.2, -.55), k = put(EX[8], -9.4, 0, 12.0, -.75); m.root.scale.setScalar(.95); k.root.scale.setScalar(.7);
  actuar(m, 0, [[0, { aLx: 2.1, aLz: -.3, aLe: .1, aRx: .4, aRz: .3, aRe: 1.2, headY: -.3 }]], { T: L.T }); cara(m, L.T, { expr: 'serious', mouth: 'talk' }); actuar(k, 0, [[0, { headX: -.35, headY: -.3, aLx: .3 }]], { T: L.T }); cara(k, L.T, { expr: 'worried', eyes: 'up' });
  cm([-9.6, 5.6, 30], [-10.4, 6.0, 27], L.k); camera.lookAt(-12.2, 5.6, 9.5); camera.fov = 44; sh(V(-12, 0, 10), 18); }, [[0, 'metal_hit', .35], [.4, 'hmm', .3]]);
// 3 «Denn jedes Mal, wenn jemand an einer»: un chico mira a los lados, a escondidas, y saca su vape
shot(2.71, 'S', null, L => { town(L); const c = put(G1, GP.x, 0, GP.z, .15); const look = Math.sin(L.lt * 5) * .6;
  vaper(c, L, 3.99, 1.0, { expr: 'sus', headX: 0 }); c.neck.rotation.y += look; crowdAt(L, GP.x, GP.z - 4, 6, 10, 20, 3, { mode: 'walk', speed: 1.6 });
  onBody(c, 12, -.3, .06, 42, L.k, 10.5, -.15); sh(GP, 18); }, [[0, 'steps', .35], [.6, 'cloth', .4]]);
// 4 «Vape zieht und ausatmet,»: primer plano: la calada, el LED se enciende
shot(4.09, 'Z', null, L => { town(L); const c = put(G1, GP.x, 0, GP.z, .15); vaper(c, L, 3.99, 1.0, { expr: 'smug', exh: 1.8, pow: 6, size: 1.6, n: 70 });
  onFace(c, 4.4, .1, .5, 40, L.k, 3.8); sh(GP, 14); }, [[.15, 'vape_in', .7]]);
// 5 «Pfffffff! erscheint ein»: la nube enorme sale de su boca y envuelve la plaza; la gente se gira
shot(5.45, 'C', 'punch', L => { town(L); const c = put(G1, GP.x, 0, GP.z, .15); vaper(c, L, 3.99, 1.0, { expr: 'smug', exh: 1.8, pow: 8, size: 2.4, n: 110, dens: 1, life: 3.5 });
  crowdAt(L, GP.x, GP.z, 7, 7, 13, 5, { mode: 'shock', face: V(GP.x, 3, GP.z) });
  orbit(V(GP.x, 5, GP.z), lerp(17, 19, L.k), .35, .1, 46); sh(GP, 22); }, [[.05, 'vape_out', .8], [.5, 'gasp', .35]]);
// 6 «mysteriöser Mann, der» (zoom lento): en la nube se forma una silueta: ojos cian, chistera, garras; el chico se queda helado
shot(6.63, 'I', 'slow', L => { town(L); const c = put(G1, GP.x, 0, GP.z, .15); actuar(c, 0, [[0, { ...GEST.shock, headY: -.4 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'side_l', mouth: 'grimace' }); sweat(c, L.T);
  SMK.haze(V(GP.x - 1, 4, GP.z - 4), L.T, 26, 5, 3, 3, 4.5, .55, 21); const s = samAt(L, GP.x - 1.6, GP.z - 4.2, .3, { reach: .2 }); appear(L, 6.66, V(GP.x - 1.6, 0, GP.z - 4.2), .9);
  orbit(V(GP.x - .8, 6, GP.z - 2), lerp(22, 15, easeIn(L.k)), .3, .06, 46); sh(GP, 18); }, [[0, 'whisper', .4], [.3, 'creepy_ting', .5]]);
// 7 «Dampfsammler, und nimmt»: primer plano de la criatura: los ojos se encienden; cartel con su nombre
shot(7.90, 'C', 'punch', L => { town(L); SMK.haze(V(GP.x - 1.6, 5, GP.z - 4.2), L.T, 18, 4, 3, 3, 4, .45, 22); const s = samAt(L, GP.x - 1.6, GP.z - 4.2, .3, { reach: clamp((L.T - 8.9) / .3), glow: 1 });
  const h = hp(s); cam([h.x + Math.sin(.3) * 12, h.y - .6, h.z + Math.cos(.3) * 12], [h.x, h.y - 2.4, h.z], 44); badge('gold', 'DER DAMPFSAMMLER', W / 2, H * .15, clamp((L.lt - .05) / .15), 1, .8); sh(GP, 14); }, [[0, 'magic_hit', .6], [.1, 'growl', .35]]);
// 8 «ihn mit. Niemand weiß,»: la garra sobre su hombro y los dos desaparecen en un remolino de vapor; la gente lo ve
shot(9.22, 'F', null, L => { town(L); const c = put(G1, GP.x, 0, GP.z, .15); actuar(c, 0, [[0, GEST.cower]], { T: L.T }); cara(c, L.T, { expr: 'scared', mouth: 'scream' });
  samAt(L, GP.x - .9, GP.z - 2.6, .3, { reach: 1, grab: true }); takeAway(L, [c, sam], 9.3, V(GP.x - .5, 0, GP.z - 1.3), .8);
  crowdAt(L, GP.x, GP.z - 2, 6, 8, 13, 7, { mode: 'point', face: V(GP.x, 3, GP.z) });
  orbit(V(GP.x - .5, 5.5, GP.z - 1), 21, .55, .1, 46); sh(GP, 22); }, [[.2, 'whirl', .55], [.45, 'gasp', .45], [.7, 'sparkle', .4]]);
// 9 «wohin sie verschwinden.»: plano bajo: solo queda la vape en el adoquín, echando un hilo de vapor; la gente se asoma
shot(10.77, 'R', null, L => { town(L); show(DROPV, GP.x - .4, .25, GP.z - 1, .4, 1.6); DROPV.rotation.set(Math.PI / 2, 0, .5); DROPV.userData.setGlow(.4 + Math.sin(L.T * 6) * .3);
  SMK.puff(V(GP.x - .4, .6, GP.z - 1), V(0, 1, 0), L.T, L.t0 - 1, 3, { n: 30, pow: .8, size: .5, dens: .5, up: .9, spread: .2, life: 2.5, seed: 31 });
  crowdAt(L, GP.x - .4, GP.z - 2, 5, 4.5, 6, 9, { mode: 'idle', expr: 'worried', face: V(GP.x - .4, 0, GP.z - 1) });
  cm([GP.x + 1.2, 8.5, GP.z + 9.5], [GP.x + .6, 7.8, GP.z + 8.2], L.k); camera.lookAt(GP.x - .4, 1.6, GP.z - 2.2); camera.fov = 46; sh(GP, 14); }, [[0, 'wind', .45], [.3, 'steam', .3]]);
// 10 «Vor sechs Jahren spielte»: el club NACHTWERK lleno, el DJ al fondo; «VOR 6 JAHREN»
shot(12.00, 'C', null, L => { clubS(L); djPlay(L); clubCrowd(L);
  cm([CX + 6, 15, 18], [CX + 3, 13, 14], L.k); camera.lookAt(CX, 6, -14); camera.fov = 50; badge('gold', 'VOR 6 JAHREN', W / 2, H * .14, clamp(L.lt / .15), 1, .9); sh(V(CX, 0, -6), 34); }, [[0, 'bass_hit', .5], [.1, 'cheer', .4]]);
// 11 «unser bester DJ das»: DJ Blitz con las manos arriba
shot(13.20, 'W', null, L => { clubS(L); const d = put(dj, DJP.x, DJP.y, DJP.z, 0); actuar(d, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .35, aRz: .35, aLe: .3, aRe: .3, headX: -.15 + Math.sin(L.T * 10) * .08 }]], { T: L.T }); cara(d, L.T, { expr: 'joy', mouth: 'laugh' });
  orbit(V(DJP.x, DJP.y + 5.2, DJP.z), lerp(15, 13, L.k), .15, .08, 42); sh(DJP, 16); }, [[0, 'cheer', .5], [.3, 'whistle', .35]]);
// 12 «größte Konzert seines»: grúa por encima de la pista: cientos saltando, luces barriendo
shot(14.34, 'Z', null, L => { clubS(L); djPlay(L); clubCrowd(L, { mode: 'cheer' });
  cm([CX - 12, 22, 14], [CX - 6, 20, 10], L.k); camera.lookAt(CX, 2, -10); camera.fov = 52; sh(V(CX, 0, -8), 34); }, [[0, 'shout_crowd', .45], [.4, 'bass_hit', .4]]);
// 13 «Lebens. Mitten im Beat»: primer plano de las manos en los platos; los altavoces vibran
shot(15.44, 'F', null, L => { clubS(L); djPlay(L, { pose: { aRx: 1.0, aRz: -.1, aRe: 1.2 } });
  const h = hp(dj); cm([DJP.x + 3.2, DJP.y + 6.4, DJP.z + 6.8], [DJP.x + 2.6, DJP.y + 6.0, DJP.z + 6.0], L.k); camera.lookAt(DJP.x, DJP.y + 3.8, DJP.z + 1.2); camera.fov = 44; sh(DJP, 14); }, [[0, 'record_scratch', .55], [.6, 'bass_hit', .4]]);
// 14 «zog er an seiner Vape und atmete»: saca la vape del bolsillo y da una calada larga
shot(16.75, 'S', null, L => { clubS(L); const d = put(dj, DJP.x, DJP.y, DJP.z, 0); vaper(d, L, 17.32, 1.0, { expr: 'smug', exh: 1.6, pow: 8, size: 2.2, n: 90 });
  onFace(d, 5.2, .2, .6, 40, L.k, 4.4); sh(DJP, 14); }, [[.4, 'cloth', .35], [.6, 'vape_in', .7]]);
// 15 «aus: Pfffffff!»: desde la pista: una nube gigante sale del escenario y tapa las luces
shot(18.38, 'C', 'punch', L => { clubS(L); const d = put(dj, DJP.x, DJP.y, DJP.z, 0); vaper(d, L, 17.32, 1.0, { expr: 'smug', exh: 1.6, pow: 9, size: 2.6, n: 100, dens: .95, life: 3.6 }); clubCrowd(L, { mode: 'shock' });
  cm([CX + 4, 15, 12], [CX + 3, 15.5, 9], L.k); camera.lookAt(CX, 7, -18); camera.fov = 48; sh(DJP, 30); }, [[.05, 'vape_out', .8], [.3, 'murmur', .4]]);
// 16 «Das Licht ging aus. Und als»: apagón: solo la nube iluminada por dos ojos cian y el aura detrás del DJ
shot(19.48, 'I', 'slow', L => { const off = clamp((L.T - 19.62) / .15); clubS(L, { off }); const d = put(dj, DJP.x, DJP.y, DJP.z, 0); actuar(d, 0, [[0, { ...GEST.shock, headY: .5 }]], { T: L.T }); cara(d, L.T, { expr: 'shock', eyes: 'side_l', mouth: 'o' });
  SMK.haze(V(DJP.x, DJP.y + 6, DJP.z - 2), L.T, 22, 6, 3, 2, 5, .5, 41); if (L.T > 19.9) { samAt(L, DJP.x - .4, DJP.z - 3.0, 0, { reach: 1, grab: L.T > 20.3, aura: 1 }); sam.root.position.y = DJP.y; }
  if (L.T > 20.2) takeAway(L, [d, sam], 20.25, V(DJP.x, DJP.y, DJP.z - 1.3), .6);
  cm([DJP.x + 1, DJP.y + 6.5, DJP.z + 17], [DJP.x + .6, DJP.y + 6.5, DJP.z + 13], easeIn(L.k)); camera.lookAt(DJP.x, DJP.y + 5.8, DJP.z - 1); camera.fov = 46; sh(DJP, 16); }, [[.14, 'power_down', .7], [.5, 'heartbeat', .5], [1.1, 'whirl', .45]]);
// 17 «es wieder anging, war er weg.»: vuelve la luz: la mesa vacía, los cascos balanceándose, la gente desconcertada
shot(20.92, 'F', null, L => { clubS(L); clubCrowd(L, { mode: 'shrug' }); show(DROPV, DJP.x + 1.4, DJP.y + 3.15, DJP.z + 1.6, .8, 1.1); DROPV.rotation.set(Math.PI / 2, 0, .8); DROPV.userData.setGlow(.3);
  SMK.haze(V(DJP.x, DJP.y + 6, DJP.z), L.T, 10, 6, 2, 2, 4, .25, 43);
  cm([DJP.x - 4, DJP.y + 7, DJP.z + 12], [DJP.x - 2.5, DJP.y + 6.6, DJP.z + 10], L.k); camera.lookAt(DJP.x, DJP.y + 3.6, DJP.z); camera.fov = 44; sh(DJP, 24); }, [[0, 'power_on', .6], [.4, 'murmur', .45], [.9, 'record_scratch', .3]]);
// 18 «Dann wollte unser Dampfring-Meister»: Rocco en la tarima de la plaza saluda al público
shot(22.67, 'W', null, L => { town(L); const r = put(rocco, RKP.x, RKP.y, RKP.z, 0); actuar(r, 0, [[0, { aRx: 2.6, aRz: .5 + Math.sin(L.T * 7) * .25, aRe: .4, aLx: .6, aLz: .2, aLe: .9, lean: -.04 }]], { T: L.T }); grin(r, L.T); ringCrowd(L);
  cm([RSP.x + 8, 9, RSP.z + 30], [RSP.x + 6, 8, RSP.z + 26], L.k); camera.lookAt(RSP.x, 7, RSP.z); camera.fov = 46; sh(RSP, 30); }, [[0, 'cheer', .5], [.3, 'clap', .45]]);
// 19 «einen neuen Rekord aufstellen.»: el marcador «NEUER REKORD?» y Rocco que lo señala, seguro de sí
shot(24.05, 'S', null, L => { town(L); RS.drawScore('?', 'NEUER REKORD'); const r = put(rocco, RKP.x, RKP.y, RKP.z, .5); actuar(r, 0, [[0, { aRx: 1.9, aRz: -.1, aRe: .1, aLx: .3, aLz: .5, aLe: 1.8, headY: .3 }]], { T: L.T }); cara(r, L.T, { expr: 'smug', mouth: 'smirk' });
  cm([RSP.x - 4, 9, RSP.z + 24], [RSP.x - 3, 9, RSP.z + 21], L.k); camera.lookAt(RSP.x + 3, 7, RSP.z - 1); camera.fov = 46; sh(RSP, 20); }, [[0, 'beep', .4], [.3, 'drum_roll', .45]]);
// 20 «Er zog, so tief er konnte,»: calada larguísima; el pecho se hincha, la cara roja del esfuerzo
shot(25.70, 'Z', null, L => { town(L); const r = put(rocco, RKP.x, RKP.y, RKP.z, 0); vaper(r, L, 26.42, 1.3, { expr: 'determined', exh: 1.8 }); r.spine.scale.setScalar(1 + clamp((L.T - 26.7) / 1.2) * .08);
  onFace(r, 5, .2, -.5, 40, L.k, 4.2); sh(RSP, 14); }, [[.6, 'vape_in', .75], [1.1, 'breath', .35]]);
// 21 «und blies: Pfffffff!»: aros de vapor perfectos que suben; el público boquiabierto; el marcador sube
shot(27.26, 'R', null, L => { town(L); RS.drawScore(String(Math.max(0, Math.floor((L.T - 28.25) * 6))), 'RINGE'); const r = put(rocco, RKP.x, RKP.y, RKP.z, 0); vaper(r, L, 26.42, 1.3, { expr: 'determined', exh: 1.8, n: 10, dens: .4 }); smokeRings(r, 28.25, L.T, 8, .2);
  ringCrowd(L, { mode: L.T > 28.4 ? 'cheer' : 'shock' });
  cm([RSP.x + 7, 7.5, RSP.z + 19], [RSP.x + 6, 8, RSP.z + 17], L.k); camera.lookAt(RSP.x, 10, RSP.z); camera.fov = 48; sh(RSP, 22); }, [[.95, 'vape_out', .7], [1.2, 'cheer', .4]]);
// 22 «Und plötzlich war»: entre los aros aparece la criatura detrás de Rocco y lo agarra
shot(28.82, 'C', 'punch', L => { town(L); const r = put(rocco, RKP.x, RKP.y, RKP.z, 0); actuar(r, 0, [[0, GEST.shock]], { T: L.T }); cara(r, L.T, { expr: 'shock', mouth: 'scream' });
  samAt(L, RKP.x - .5, RKP.z - 2.8, 0, { reach: 1, grab: L.T > 29.05 }); sam.root.position.y = RKP.y; appear(L, 28.84, V(RKP.x - .5, RKP.y, RKP.z - 2.8), .3); takeAway(L, [r, sam], 29.1, V(RKP.x, RKP.y, RKP.z - 1.3), .55);
  orbit(V(RKP.x, RKP.y + 5.5, RKP.z - 1), 19, -.25, .04, 46); sh(RSP, 18); }, [[0, 'magic_hit', .55], [.55, 'whirl', .5]]);
// 23 «er verschwunden. Sogar»: la tarima vacía, los últimos aros flotando; el público se queda de piedra
shot(29.85, 'W', null, L => { town(L); RS.drawScore('?', 'NEUER REKORD'); RINGS.forEach((rg, i) => { rg.visible = true; rg.position.set(RKP.x + Math.sin(i * 2) * 3, RKP.y + 7 + i * 1.1 + L.lt * .6, RKP.z + Math.cos(i * 3)); rg.rotation.set(Math.PI / 2 + Math.sin(i) * .3, 0, 0); rg.scale.setScalar(1.4 + i * .15); rg.material.opacity = .5; });
  ringCrowd(L, { mode: 'shock' }); cm([RSP.x - 6, 13, RSP.z + 30], [RSP.x - 4, 13, RSP.z + 27], L.k); camera.lookAt(RSP.x, 6, RSP.z); camera.fov = 46; sh(RSP, 28); }, [[0, 'wind', .45], [.3, 'murmur', .45]]);

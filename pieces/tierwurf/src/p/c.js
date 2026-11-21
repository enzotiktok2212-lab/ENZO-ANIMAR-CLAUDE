// ---------- c: yo, Kalle, el entrenamiento, el queso dorado y su viaje (77,9 – 115,2 s) ----------
const flex = { aLx: 1.3, aLz: 1.25, aLe: 2.3, aRx: 1.3, aRz: 1.25, aRe: 2.3, lean: -.06, headX: -.05 };
// ciclo día/noche del cielo (c = 1 día, 0 noche)
function dayNight(c) { setSky([lerp(.02, .18, c), lerp(.04, .48, c), lerp(.14, .98, c)], [lerp(.06, .45, c), lerp(.1, .72, c), lerp(.3, 1, c)], [lerp(.16, .82, c), lerp(.2, .93, c), lerp(.42, 1, c)]); sun.intensity = lerp(.9, 2.5, c); hemi.intensity = lerp(.8, 1.25, c); sky.moon.visible = c < .5; sky.moon.position.set(-500, 700, -1200); BIRDSON = 0; }
// queso volando con estela (escala s)
const cheeseFly = (p, T, s = 1.6, dir = V(0, 0, -1)) => { show(FOODS.kaese, p.x, p.y, p.z, T * 5, s); FOODS.kaese.rotation.x = T * 3; trail(p, dir, T, 16, .55 * s); };
// 49 «Aber ich?»: yo, cabizbajo
shot(77.86, 'Z', 'punch', L => { street(); const me = put(ich, 0, 0, 6, .15); armsK(me, 0); actuar(me, L.lt, [[0, { headX: .12, aLz: .05, aRz: .05, lean: .08 }]], { T: L.T }); talk(me, L.T, 77.86, 78.47, 'sad');
  orb(L.k, V(0, 4, 6), null, [10, .25, .1, 44], [9, .2, .08, 42]); sh(V(0, 0, 6), 20); }, [[0, 'zoom_fast', .5], [.2, 'sad_tone', .4]]);
// 50 «Ich hatte die schwächsten Arme der ganzen Stadt.»: colgado de la barra sin poder subir, brazos finos, dos niños se ríen
shot(78.47, 'W', null, L => { street(); const me = ich; armsK(me, 0); pullup(me, -10.6, 3, PI / 2, 7.4, .08 + Math.abs(Math.sin(L.T * 9)) * .06); cara(me, L.T, { expr: 'worried', mouth: 'teeth' }); sweat(me, L.T, 2);
  [[K[2], -6.4, 6.4, .72], [K[6], -6.8, -.4, .7]].forEach(([c, x, z, s], i) => { put(c, x, 0, z, -PI / 2 + (i ? .5 : -.5)); c.root.scale.setScalar(s); actuar(c, L.lt, [[0, i ? 'point' : 'point_l']], { T: L.T + i }); cara(c, L.T, { expr: 'happy', mouth: 'grin', eyes: 'happy' }); });
  orb(L.k, V(-9.6, 4.4, 3), null, [15, PI / 2 + .25, .12, 44], [14, PI / 2 + .2, .1, 44]); sh(V(-9, 0, 3), 30); badge('red', 'SCHWACH', W / 2, H * .15, (L.lt - .6) * 3, 1, .8); }, [[0, 'strain', .5], [.6, 'kids_laugh', .45], [1.3, 'stretch_creak', .35], [1.9, 'kids_laugh', .4]]);
// 51 «Meine erste Karotte flog drei Meter.»: mi lanzamiento ridículo
shot(80.88, 'S', null, L => { field(); const k = clamp(L.lt / .55); const me = thrower(ich, FX, 0, PI, k, 'karotte', .5); armsK(me, 0); cara(me, L.T, { expr: k < .9 ? 'determined' : 'shock', mouth: k < .9 ? 'teeth' : 'o' });
  if (k >= .62) { const f = clamp((L.lt - .34) / .6), p = arc([FX + .8, 4.8, -.6], [FX + 1.4, .5, DIST[3]], 2.2, f); show(FOODS.karotte, p.x, p.y, p.z, 0, .7).rotation.set(f * 5, 0, .5); }
  orb(L.k, V(FX + .6, 3.2, -2.6), null, [15, PI - .9, .14, 44], [14, PI - .95, .12, 44]); sh(V(FX, 0, -3), 30); badge3('big', '3 M', V(FX + 1.4, 3.6, DIST[3]), (L.lt - .95) * 3, .8); }, [[.15, 'throw', .5], [.3, 'whoosh_soft', .35], [.95, 'thud', .5], [1.2, 'sad_tone', .4]]);
// 52 «Und ich bekam einen Noobini Pizzanini.»: Kalle llega andando; yo nada impresionado
shot(82.84, 'Z', null, L => { field(); const me = put(ich, FX + .4, 0, -1.2, PI + .5); armsK(me, 0); actuar(me, L.lt, [[0, 'idle'], [.8, 'facepalm', { dur: .4 }]], { T: L.T }); cara(me, L.T, { expr: 'bored', mouth: 'flat' });
  const z = Math.min(-3.4, -9 + L.lt * 3.2); const b = beast(KALLE, FX - .6 - (z + 9) * .5, 0, z, -.5); b.pose(L.T, { walk: z < -3.45 ? 1 : 0, wave: z >= -3.45, face: { eyes: 'open', mouth: 'smile' } });
  orb(L.k, V(FX - .1, 2.8, -3), null, [13, -1.35, .12, 44], [12, -1.25, .1, 44]); sh(V(FX, 0, -3), 30); rareTag(b, 'COMMON', (L.lt - .3) * 3, 4.1); }, [[0, 'steps', .4], [.6, 'toy', .4], [1.2, 'sigh_kid', .45]]);
// 53 «Ich nannte ihn Kalle.»: lo levanto como a un trofeo
shot(85.33, 'C', 'punch', L => { field(); const me = put(ich, FX, 0, -1, PI + .15); armsK(me, 0); actuar(me, L.lt, [[0, { aLx: 2.0, aLz: .2, aLe: .3, aRx: 2.0, aRz: .2, aRe: .3, headX: -.2 }]], { T: L.T }); grin(me, L.T);
  const b = beast(KALLE, FX - Math.sin(PI + .15) * 1.3, 4.4, -1 - Math.cos(PI + .15) * 1.3, PI + .15, .62); b.pose(L.T, { up: 1, face: { eyes: 'happy', mouth: 'grin' } });
  orb(L.k, V(FX, 4.6, -1.6), null, [11.5, PI + .3, .05, 44], [10.5, PI + .25, .04, 44]); sh(V(FX, 0, -1), 30); badge('tag', 'KALLE', W / 2, H * .15, (L.lt - .3) * 3, 1, 1.1); }, [[0, 'pop', .5], [.3, 'sparkle', .45], [.6, 'toy', .4]]);
// 54 «Er macht eine Münze am Tag.»: Kalle en mi escritorio; una sola moneda
shot(86.38, 'W', null, L => { use('ZI'); inside(); const b = beast(KALLE, ZX - .6, 5.25, -9.2, .2, .58); b.pose(L.T, { face: { eyes: L.lt > .4 && L.lt < .7 ? 'wide' : 'open', mouth: 'smile' } }); ZI.JAR.userData.set(.04);
  coinPop(V(ZX - .6, 7.4, -9), .45, L.lt, 1, 0, .6); plus(V(ZX - .6, 8.4, -9.2), '+1', L.lt - .45, 1);
  orb(L.k, V(ZX + .4, 6.8, -9.2), null, [11, .2, .2, 44], [10, .15, .18, 44]); badge('big', '1 MÜNZE / TAG', W / 2, H * .15, (L.lt - .8) * 3, 1, .75); }, [[0, 'tick', .4], [.45, 'pop', .55], [.5, 'coin_flip', .5], [.9, 'ding_soft', .4]]);
// 55 «Die ganze Stadt hat gelacht.»: la gente se ríe y me señala; yo con Kalle en brazos
shot(87.83, 'F', null, L => { street(); const me = put(ich, 0, 0, 0, 0); armsK(me, 0); actuar(me, L.lt, [[0, 'hold']], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'frown' }); beast(KALLE, 0, 1.6, 1.3, 0, .55).pose(L.T, { face: { eyes: 'open' } });
  const P = [[K[0], -4.2, -5], [XT[0], 4.4, -4.6], [K[4], -2, -9], [lehrer, 2.4, -9.4], [K[7], -6, -11], [XT[2], 6, -11]]; P.forEach(([c, x, z], i) => { put(c, x, 0, z, faceTo(V(x, 0, z), V(0, 0, 0))); actuar(c, L.lt, [[0, i % 2 ? 'point' : 'point_l'], [.4 + i * .1, { lean: -.2, aLx: .8, aRx: .8, aLe: 1.6, aRe: 1.6, aLz: .5, aRz: .5, headX: -.25 }]], { T: L.T + i }); cara(c, L.T, { expr: 'happy', mouth: Math.sin(L.T * 14 + i) > 0 ? 'grin' : 'o', eyes: 'happy' }); });
  orb(L.k, V(0, 3.6, -3), null, [17, .05, .14, 46], [15.5, .02, .12, 46]); sh(V(0, 0, -4), 30); }, [[0, 'laugh_m', .45], [.3, 'laugh_deep', .4], [.6, 'kids_laugh', .4], [1.0, 'laugh_old', .35]]);
// 56 «Also hab ich trainiert.» (zoom lento): me agarro a la barra con decisión
shot(89.37, null, 'slow', L => { street(); const me = ich; armsK(me, .15); pullup(me, -10.6, 3, PI / 2, 7.4, 0); cara(me, L.T, { expr: 'determined', mouth: 'flat' });
  orb(L.k, V(-10.6, 5.6, 3), null, [11, PI / 2 + .35, .04, 44], [8.6, PI / 2 + .3, .02, 40]); sh(V(-10, 0, 3), 30); }, [[.1, 'clack', .5], [.4, 'breath', .45]]);
// 57 «Jeden einzelnen Tag.»: días y noches pasan volando mientras sigo con las dominadas
shot(90.51, 'W', null, L => { street(); const c = (Math.cos(L.lt / L.d * PI * 6) + 1) / 2; dayNight(c); const me = ich; armsK(me, .2 + L.k * .2); pullup(me, -10.6, 3, PI / 2, 7.4, .5 + .5 * Math.sin(L.T * 8)); cara(me, L.T, { expr: 'determined', mouth: 'teeth' });
  orb(L.k, V(-10.6, 5, 3), null, [16, PI / 2 + .7, .2, 46], [15, PI / 2 + .9, .2, 46]); sh(V(-10, 0, 3), 30); }, [[0, 'whirl', .45], [.3, 'rooster', .3], [.7, 'crickets', .3], [1.0, 'rooster', .3]]);
// 58–60 «Ein Klimmzug, dann zehn, dann tausend.»: el contador y los brazos crecen
shot(92.21, 'C', 'punch', L => { street(); const me = ich; armsK(me, .15); pullup(me, -10.6, 3, PI / 2, 7.4, easeInOut(clamp(L.lt / .7))); cara(me, L.T, { expr: 'determined', mouth: 'teeth' }); sweat(me, L.T, 1);
  orb(L.k, V(-10.6, 5.2, 3), null, [12, PI / 2 + .2, .05, 44], [11, PI / 2 + .15, .04, 44]); sh(V(-10, 0, 3), 30); badge('num', '1', W / 2, H * .15, 1, 1, 1.2); }, [[0, 'strain', .5], [.6, 'ding_soft', .4]]);
shot(93.09, 'C', 'punch', L => { street(); dayNight(.25); const me = ich; armsK(me, .45); pullup(me, -10.6, 3, PI / 2, 7.4, .5 + .5 * Math.sin(L.T * 12)); cara(me, L.T, { expr: 'determined', mouth: 'teeth' });
  orb(L.k, V(-10.6, 5.2, 3), null, [12, PI / 2 - .35, .1, 44], [11, PI / 2 - .4, .08, 44]); sh(V(-10, 0, 3), 30); badge('num', '10', W / 2, H * .15, 1, 1, 1.25); }, [[0, 'ding_soft', .45], [.3, 'strain', .4]]);
shot(93.83, 'Z', 'punch', L => { street(); const me = ich; armsK(me, .8); pullup(me, -10.6, 3, PI / 2, 7.4, .5 + .5 * Math.sin(L.T * 22)); cara(me, L.T, { expr: 'angry', mouth: 'teeth' }); sweat(me, L.T, 2);
  orb(L.k, V(-10.6, 5.2, 3), null, [13, PI / 2 + .6, .25, 46], [12, PI / 2 + .55, .22, 46]); sh(V(-10, 0, 3), 30); badge('gold', '1000', W / 2, H * .15, 1, 1, 1.35); }, [[0, 'ticks', .5], [.3, 'ticks', .5], [.6, 'ding_reveal', .5]]);
// 61 «Meine Arme wurden so stark,»: saco músculo con los brazos enormes, destellos
shot(94.69, 'S', null, L => { street(); const me = put(ich, 0, 0, 4, .1); armsK(me, 1); actuar(me, L.lt, [[0, 'idle'], [.15, flex, { dur: .3 }]], { T: L.T }); grin(me, L.T); confetti(V(0, 2, 4), .2, L.lt, 24);
  orb(L.k, V(0, 4, 4), null, [12, .3, .08, 44], [10.5, .25, .06, 42]); sh(V(0, 0, 4), 30); }, [[.15, 'stretch', .5], [.3, 'sparkle', .5], [.8, 'cheer', .3]]);
// 62 «dass ich aus Versehen die Kühlschranktür abgerissen hab.»: tiro de la puerta de la nevera y me quedo con ella en la mano
shot(96.23, 'W', null, L => { use('KU'); inside(); const me = put(ich, KX + 8.6, 0, -3.2, lerp(PI - .2, PI * 2 + .6, easeInOut(clamp((L.lt - .85) / .4)))); armsK(me, 1); const rip = clamp((L.lt - .55) / .25);
  actuar(me, L.lt, [[0, 'reach'], [.55, { aRx: 1.0, aRe: .9, aRz: .2, lean: -.25, aLx: .5, lLx: -.3, lRx: .3 }, { dur: .2 }], [.9, { ...GEST.shock, aRx: 1.4, aRe: .5 }, { dur: .3 }]], { T: L.T }); cara(me, L.T, L.lt > .7 ? { expr: 'shock', mouth: 'o' } : { expr: 'neutral' });
  KU.FL.intensity = L.lt > .5 ? 40 : 0; KU.DOOR.rotation.y = lerp(0, .9, rip); KU.DOOR.position.set(lerp(-2.8, -5.5, rip), lerp(0, 1.0, rip), lerp(2.15, 4.4, rip)); KU.DOOR.rotation.z = rip * .2;
  cm([KX + 14, 7, 9, KX + 7.4, 4.6, -5, 48], [KX + 13.4, 6.8, 8, KX + 7.4, 4.6, -5, 48], L.k); }, [[0, 'steps', .35], [.55, 'metal_rip', .6], [.62, 'door_crash', .5], [.9, 'gasp', .45], [1.3, 'clack', .35]]);
// 63 «Ich hab jede Münze gespart,»: el bote se llena y el contador sube
shot(98.54, 'R', null, L => { use('ZI'); inside(); const k = easeInOut(L.k); ZI.JAR.userData.set(lerp(.05, .85, k)); beast(KALLE, ZX - 2.6, 5.25, -9.2, .2, .58).pose(L.T, { face: { eyes: 'happy', mouth: 'grin' } }); coinPop(V(ZX + 1.6, 10, -9.2), 0, (L.lt * 2) % 1.2, 3, 7, .5);
  orb(L.k, V(ZX + .6, 7, -9.2), null, [11, -.2, .14, 44], [10, -.15, .12, 44]); const n = Math.round(lerp(1, 906, k * k)); badge(n > 900 ? 'gold' : 'num', String(n), W / 2, H * .15, 1, 1, 1.1); }, [[0, 'coins', .5], [.5, 'coins', .45], [1.0, 'coins', .45], [1.3, 'cash', .4]]);
// 64 «die Kalle je gemacht hat,»: Kalle escupe una moneda que cae dentro del bote
shot(99.98, 'C', null, L => { use('ZI'); inside(); ZI.JAR.userData.set(.86); const b = beast(KALLE, ZX - 1.2, 5.25, -9, .9, .62); const t = L.lt % .55; b.pose(L.T, { up: t < .2, face: { eyes: t < .2 ? 'wide' : 'happy', mouth: t < .2 ? 'open' : 'smile' } });
  coinPop(V(ZX - .3, 7.4, -9), L.T - t, L.T, 1, (L.lt / .55 | 0), .5); plus(V(ZX - 1.2, 8.6, -9), '+1', t, .9);
  orb(L.k, V(ZX + .2, 6.8, -9), null, [7.4, .35, .12, 42], [6.6, .3, .1, 40]); }, [[0, 'pop', .5], [.55, 'pop', .5], [.9, 'coin_flip', .4]]);
// 65 «und das teuerste Essen im Laden gekauft:»: vacío el bote en el mostrador; la cajera alucina
shot(101.08, 'W', null, L => { use('LA'); inside(); const me = put(ich, LX - 1.4, 0, 1.4, PI); armsK(me, 1); actuar(me, L.lt, [[0, { aRx: 1.6, aRe: .6, aLx: 1.6, aLe: .6, lean: .15 }]], { T: L.T }); grin(me, L.T);
  const v = put(verk, LX + .6, 0, -5.2, .1); actuar(v, L.lt, [[0, 'idle'], [.5, 'shock', { dur: .25 }]], { T: L.T }); cara(v, L.T, { expr: L.lt > .5 ? 'shock' : 'happy', mouth: L.lt > .5 ? 'o' : 'smile' });
  coinRain(V(LX - .6, 4.4, -2), L.T, 30, 3, 2, 3, .5); cm([LX - 6, 8, 9, LX - .4, 4, -3, 48], [LX - 5.4, 7.6, 8, LX - .4, 4, -3, 48], L.k); }, [[0, 'money_rain', .55], [.5, 'gasp_f', .45], [.9, 'cash_reg', .5]]);
// 66 «den goldenen Käse.» (zoom lento): el queso dorado en su pedestal, con rayos y foco
shot(103.31, null, 'slow', L => { use('LA'); inside(); LA.rays.rotation.z = L.T * .4; LA.KAESE.rotation.y = .6 + Math.sin(L.T * .8) * .5; LA.KAESE.rotation.x = .25; LA.KAESE.position.y = 6.4 + Math.sin(L.T * 2) * .15;
  orb(L.k, V(LX, 7, -10), null, [16, .02, .06, 46], [10, .02, .04, 40]); }, [[0, 'choir', .5], [.2, 'sparkle', .45]]);
// 67 «Ich hab tief Luft geholt»: en el campo, con el queso en la mano, cierro los ojos y respiro
shot(104.60, 'Z', null, L => { field(); const me = put(ich, FX, 0, 0, PI + .1); armsK(me, 1); const br = Math.sin(clamp(L.lt / 1.05) * PI); applyPose(me, { aRx: .35, aRe: .4, aRz: .25, lean: -.12 * br, headX: -.25 * br, aLz: .2 + .3 * br, aLx: .3 }); cara(me, L.T, { eyes: 'closed', mouth: br > .5 ? 'o' : 'flat', noBlink: 1 });
  attach(FOODS.kaese, me.aR.hand, [0, -.6, .2], [0, 0, 0], .32); orb(L.k, V(FX, 4.2, 0), null, [11, PI + .85, .06, 42], [10, PI + .8, .04, 40]); sh(V(FX, 0, 0), 30); }, [[0, 'breath', .55], [.5, 'wind', .3]]);
// 68 «und geworfen.»: el lanzamiento con todo, destello y estela dorada
shot(105.69, 'F', null, L => { field(); const k = clamp(L.lt / .45); const me = thrower(ich, FX, 0, PI, k, 'kaese', .55); armsK(me, 1); cara(me, L.T, { expr: 'angry', mouth: 'teeth' }); if (k < .62) attach(FOODS.kaese, me.aR.hand, [0, -.6, .2], [0, 0, 0], .32);
  if (k >= .62) { const f = clamp((L.lt - .28) / 1.0), p = arc([FX + .8, 6, -.6], [FX, 120, -400], 40, f); cheeseFly(p, L.T, 1.2, V(0, .3, -1).normalize()); dust(V(FX, 0, 0), .3, L.lt, 8, .5); }
  orb(L.k, V(FX, 4, 0), null, [14, PI - .8, .05, 46], [13, PI - .85, .04, 46]); sh(V(FX, 0, 0), 30); }, [[.12, 'strain', .5], [.28, 'throw', .7], [.3, 'fire_whoosh', .6], [.5, 'sparkle', .45]]);
// 69–74 el viaje del queso: bosque, desierto, volcán, feria embrujada, nubes, tierra del sol negro
shot(106.69, 'W', null, L => { use('WA'); day(); const p = V(WAX + 4, 34 - L.lt * 2, 30 - L.lt * 60); cheeseFly(p, L.T, 1.8); cam([p.x + 12, p.y + 5, p.z + 10], [p.x - 1, p.y - 4, p.z - 6], 54); sh(V(WAX, 0, p.z - 20), 80); }, [[0, 'whoosh', .55], [.3, 'birds', .4], [.8, 'leaves', .35]]);
shot(107.88, 'W', null, L => { use('WU'); day(); setSky([.3, .55, .95], [.75, .8, .9], [1, .86, .62]); scene.fog.color.setRGB(1, .9, .7); const p = V(WUX - 2, 12, 40 - L.lt * 70); cheeseFly(p, L.T, 1.8); cam([p.x + 3, 17, p.z + 18], [p.x, 8, p.z - 16], 52); sh(V(WUX, 0, p.z), 80); }, [[0, 'whoosh', .55], [.3, 'wind', .45]]);
shot(108.77, 'W', null, L => { use('VU'); day(); setSky([.2, .06, .08], [.6, .2, .1], [1, .45, .2]); scene.fog.color.setRGB(.5, .2, .12); scene.fog.density = .0016; sun.color.setRGB(1, .55, .3); BIRDSON = 0; VU.SMK.forEach((s, i) => s.position.y = 100 + ((L.T * 8 + i * 9) % 140));
  const p = V(VUX, 112, -40 - L.lt * 70); cheeseFly(p, L.T, 2); cam([p.x - 8, p.y + 12, p.z + 30], [p.x, p.y - 22, p.z - 40], 54); sh(V(VUX, 0, -150), 120); }, [[0, 'fire_roar', .55], [.3, 'fire_whoosh', .45], [.6, 'rubble', .3]]);
shot(109.57, 'S', null, L => { use('JM'); night(); setSky([.04, .0, .08], [.16, .04, .22], [.3, .1, .36]); scene.fog.color.setRGB(.2, .06, .26); JM.WH.rotation.z = L.T * .25; JM.GH.forEach((g, i) => { g.position.y = 18 + (i % 3) * 6 + Math.sin(L.T * 2 + i) * 2; g.rotation.y = L.T + i; });
  const p = V(JMX - 2, 30, 40 - L.lt * 50); cheeseFly(p, L.T, 1.8); cam([p.x + 16, 24, p.z + 14], [JMX - 20, 28, p.z - 40], 56); sh(V(JMX, 0, p.z), 80); }, [[0, 'whoosh', .5], [.2, 'musicbox2', .4], [.8, 'evil_laugh', .35], [1.4, 'owl', .3]]);
shot(111.44, 'Z', null, L => { use('WO'); day(); setSky([.3, .6, 1], [.6, .8, 1], [.95, .97, 1]); scene.fog.color.setRGB(.95, .97, 1); scene.fog.density = .003; BIRDSON = 0; const p = V(WOX, 4, 30 - L.lt * 80); cheeseFly(p, L.T, 1.6); cam([p.x + 3, p.y + 2, p.z + 14], [p.x, p.y, p.z - 10], 56); }, [[0, 'whoosh_soft', .5], [.3, 'wind', .45]]);
shot(112.36, null, 'slow', L => { use('SW'); night(); setSky([.08, 0, .18], [.36, .06, .5], [.8, .2, .7]); scene.fog.color.setRGB(.3, .05, .4); scene.fog.density = .0016; sky.moon.visible = false; SW.SUN.rotation.z = L.T * .1;
  const p = V(SWX, 40 + L.lt * 6, -20 - L.lt * 45); cheeseFly(p, L.T, 1.8, V(0, .1, -1).normalize()); cam([p.x + 4, p.y + 1, p.z + 22], [SWX, 90, -380], 58); }, [[0, 'drone', .5], [.5, 'creepy_ting', .4], [1.5, 'hum_low', .4]]);

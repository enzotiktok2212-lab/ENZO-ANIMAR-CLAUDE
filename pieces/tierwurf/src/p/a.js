// ---------- a: gancho, la regla, los Tiere y el dinero (0 – 33,9 s) ----------
const walkB = (b, lt, x, z, ry, sp, T) => { const d = sp * lt; b.root.visible = true; b.root.position.set(x + Math.sin(ry) * d, 0, z + Math.cos(ry) * d); b.root.rotation.set(0, ry, 0); b.pose(T, { walk: 1 }); return b.root.position; };
const walkC = (ch, lt, x, z, ry, sp = 3.4, T, extra) => caminar(ch, lt, { x, z, ry, speed: sp, accel: .01, T, extra });
const rareTag = (b, txt, k, hy) => badge3('rare', txt, b.root.position.clone().add(V(0, (hy ?? b.H) * b.root.scale.x + .8, 0)), k, .9);
const thrower = (ch, x, z, ry, k, food, ksz = .5) => { put(ch, x, 0, z, ry); applyPose(ch, throwPose(clamp(k))); if (k < .62) inHand(ch, food, 1, ksz); return ch; };
const handPos = ch => { ch.root.updateMatrixWorld(true); return ch.aR.hand.getWorldPosition(V(0, 0, 0)); };
// 1 «In dieser Stadt»: la calle; yo en el centro y los Tiere paseando por la acera
shot(0, 'Z', null, L => { street(); const z0 = -4;
  const me = put(ich, .4, 0, z0, -.1); actuar(me, L.lt, [[0, 'idle'], [.1, 'wave', { dur: .25 }]], { T: L.T }); talk(me, L.T, 0, .84, 'happy');
  beast(NB[1], -1.9, 0, z0 + 2, .25).pose(L.T, { wave: 1, face: { eyes: 'happy', mouth: 'grin' } });
  walkB(TG[0], L.lt, 3.2, z0 - 15, -.15, 2.4, L.T); walkB(LI[0], L.lt, -3.6, z0 - 12, .1, 2.2, L.T);
  put(XT[1], 6.2, 0, z0 - 16, -.4); actuar(XT[1], L.lt, [[0, 'wave']], { T: L.T }); grin(XT[1], L.T);
  orb(L.k, V(0, 3.6, z0 - 3), null, [19, .02, .1, 48], [16.5, 0, .08, 46]); sh(V(0, 0, z0 - 4), 30); }, [[.02, 'whoosh', .6], [.25, 'pop', .5], [.5, 'steps', .4]]);
// 2 «kauft man keine Tiere»: la tienda de animales cerrada, alguien niega con la cabeza
shot(.84, 'W', null, L => { street(); const zz = 62;
  const g = put(K[3], -13.4, 0, zz + 2.6, PI / 2 + .45); actuar(g, L.lt, [[0, 'idle'], [.15, { aRx: 1.5, aRz: -.1, aRe: .1, headY: Math.sin(L.T * 9) * .5 }]], { T: L.T }); cara(g, L.T, { expr: 'sad', mouth: 'frown' });
  orb(L.k, V(-17, 5.2, zz - .6), null, [36, 1.18, .08, 46], [33, 1.22, .06, 46]); sh(V(-16, 0, zz), 30); }, [[.05, 'swipe', .5], [.3, 'buzzer', .35], [.6, 'door_creak', .3]]);
// 3 «Man wirft Essen»: alguien lanza una manzana desde el círculo
shot(2.26, 'F', null, L => { field(); const k = clamp(L.lt / .62); const t = thrower(K[1], FX, 0, PI, k, 'apfel'); cara(t, L.T, { expr: 'determined', mouth: 'teeth' });
  if (k >= .62) { const f = clamp((L.lt - .38) / 1.2), p = arc([FX + .8, 6, -.6], [FX - 2, 3, -60], 26, f); show(FOODS.apfel, p.x, p.y, p.z, L.T * 6, .7); }
  put(K[5], FX - 6.5, 0, 4, PI - .6); actuar(K[5], L.lt, [[0, 'cheer']], { T: L.T }); grin(K[5], L.T);
  orb(L.k, V(FX - .4, 3.8, 0), null, [17, PI + .45, .12, 44], [15.5, PI + .38, .1, 44]); sh(V(FX, 0, -2), 30); }, [[.3, 'throw', .6], [.4, 'whoosh_up', .5], [.5, 'cheer', .3]]);
// 4 «und was angerannt kommt»: un Tung Tung corre hacia la cámara con el campo detrás
shot(3.02, 'Z', null, L => { field(); const z = -34 + L.lt * 17; const b = beast(TG[0], FX - .5, 0, z, 0); b.pose(L.T, { walk: 1, speed: 1.7, face: { eyes: 'wide', mouth: 'open' } }); dust(V(FX - .5, 0, z - 1), Math.floor(L.T * 4) / 4, L.T, 6, .5);
  cm([FX + 1.5, 3.6, z + 13, FX - .5, 4, z, 46], [FX + 1.2, 3.4, z + 11, FX - .5, 4, z, 44], L.k); sh(V(FX, 0, z), 30); }, [[0, 'steps_run', .6], [.5, 'run_grass', .5], [1.0, 'whistle_inno', .3]]);
// 5 «gehört dir»: el lanzador abraza a su Tung Tung nuevo
shot(4.47, 'C', 'punch', L => { field(); const me = put(K[1], FX + 1.5, 0, -6, -.25); actuar(me, L.lt, [[0, 'cheer'], [.25, { aLx: 1.4, aLz: -.9, aLe: 1.2, aRx: 2.8, aRz: .4, aRe: .3 }, { dur: .3 }]], { T: L.T }); grin(me, L.T);
  const b = beast(TG[0], FX - 1.7, 0, -6.4, .3); b.pose(L.T, { face: { eyes: 'happy', mouth: 'grin' } });
  orb(L.k, V(FX, 3.6, -6.2), null, [15, .05, .12, 44], [13.5, .02, .1, 44]); sh(V(FX, 0, -6), 30); badge('green', 'DEINS!', W / 2, H * .2, (L.lt - .05) * 3, 1, .9); }, [[0, 'pling', .6], [.1, 'hug', .5], [.3, 'sparkle', .4]]);
// 6 «Siehst du den Typen da?»: el del plátano en el círculo; yo le señalo
shot(5.07, 'W', 'punch', L => { field(); const b = put(ban, FX + 1.2, 0, -2, PI - .25); actuar(b, L.lt, [[0, { aLx: 1.0, aLz: .8, aLe: 2.2, aRx: 1.0, aRz: .8, aRe: 2.2, lean: -.05 }]], { T: L.T }); grin(b, L.T); inHand(b, 'banane', 1, .55);
  const me = put(ich, FX - 3.6, 0, -9.2, PI * .78); actuar(me, L.lt, [[0, 'point_l']], { T: L.T }); talk(me, L.T, 5.07, 6.15, 'smug');
  orb(L.k, V(FX - .4, 3.8, -4), null, [17, PI + .3, .1, 44], [15.5, PI + .26, .1, 42]); sh(V(FX, 0, -4), 30); }, [[0, 'zoom_in', .5], [.3, 'hmm', .3]]);
// 7 «Der hat gerade eine Banane»: carga el brazo con el plátano
shot(6.15, 'W', null, L => { field(); const k = clamp((L.lt - .1) / .95); const b = thrower(ban, FX, 0, PI, k, 'banane', .6); cara(b, L.T, { expr: 'determined', mouth: 'teeth' });
  if (k >= .62) { const f = clamp((L.lt - .7) / 1.5), p = arc([FX + .8, 7, -.6], [FX, 8, -150], 60, f); show(FOODS.banane, p.x, p.y, p.z, L.T * 8, .9); }
  orb(L.k, V(FX, 3.6, 0), null, [15, PI + .4, .06, 44], [14, PI + .3, .05, 44]); sh(V(FX, 0, 0), 30); }, [[.15, 'strain', .4], [.75, 'throw', .7], [.8, 'whoosh_up', .6]]);
// 8 «über den Hügel geschleudert»: el plátano gira por encima de la colina
shot(7.31, 'S', null, L => { field(); const f = clamp(.12 + L.lt / 1.5 * .88), p = arc([FX + .8, 7, -.6], [FX, 8, -260], 70, f); show(FOODS.banane, p.x, p.y, p.z, L.T * 9, 2.2); trail(p, V(0, .2, -1).normalize(), L.T, 14, .9);
  cam([p.x + 12, p.y + 3, p.z + 26], [p.x, p.y - 4, p.z - 10], 50); sh(V(FX, 0, -120), 60); }, [[0, 'whoosh', .6], [.6, 'whoosh_soft', .4], [1.0, 'whistle', .3]]);
// 9 «Und jetzt haust ein Chimpanzini Bananini» (zoom lento): el chimpancé-plátano se golpea el pecho en el garaje
shot(8.65, null, 'slow', L => { use('GA'); day(); const b = beast(CH, GX, 0, -8.5, 0); b.pose(L.T, { beat: L.lt > .3 ? 1 : 0, hop: L.lt > .3 ? 1 : 0, face: { mouth: L.lt > .3 ? 'open' : 'grin' } });
  cm([GX, 5.4, 9, GX, 4.6, -8.5, 44], [GX, 5.2, 4, GX, 4.8, -8.5, 40], L.k, easeOut); sh(V(GX, 0, -8), 30); rareTag(b, 'LEGENDÄR', clamp((L.lt - .9) * 3), 6.4); }, [[.3, 'growl', .5], [.45, 'fist', .5], [.7, 'fist', .5], [.95, 'fist', .5], [1.2, 'aah', .3]]);
// 10 «in seiner Garage»: plano general del garaje: el dueño en el sofá y el Chimpanzini dentro
shot(10.79, 'W', null, L => { use('GA'); day(); const b = beast(CH, GX + 2.6, 0, -9.6, -.3); b.pose(L.T, { cheer: 1, face: { eyes: 'happy', mouth: 'grin' } });
  const o = put(ban, GX - 3.2, .6, -11, .1); applyPose(o, { lLx: 1.5, rLx: 1.5, lLk: 1.5, lRx: 1.5, lRk: 1.5, hipY: 1.55, aLx: .4, aLz: .5, aRz: .5, aRx: .4, aLe: .4, aRe: .4, headY: .3 }); grin(o, L.T);
  cm([GX + 8, 6.4, 13, GX, 4.6, -8, 46], [GX + 5.5, 6, 11.4, GX, 4.6, -8, 46], L.k); sh(V(GX, 0, -6), 30); }, [[0, 'whoosh_soft', .4], [.3, 'laugh_m', .3], [.6, 'clack', .3]]);
// 11 «Ich heiße Leo»: yo delante de mi casa saludando
shot(11.90, 'I', 'punch', L => { street(); const Hh = OR.houses[0]; const me = put(ich, -14, 0, 41.6, PI / 2); actuar(me, L.lt, [[0, 'wave']], { T: L.T }); talk(me, L.T, 11.9, 12.63, 'happy');
  beast(NB[1], -13.2, 0, 44.6, PI / 2 + .2).pose(L.T, { wave: 1 });
  orb(L.k, V(-13.4, 3.4, 42.4), null, [15, PI / 2 + .12, .12, 44], [13.5, PI / 2 + .05, .1, 44]); sh(V(-14, 0, 42), 30); badge('tag', 'LEO', W / 2, H * .2, (L.lt - .1) * 3, 1, 1); }, [[0, 'iris_pop', .5], [.2, 'pop', .5]]);
// 12 «und bei uns gilt:»: bajo el arco WURFPLATZ, señalo hacia arriba
shot(12.63, 'R', null, L => { field(); const me = put(ich, FX + 1.2, 0, 1.2, PI + .2); actuar(me, L.lt, [[0, 'idle'], [.1, { aRx: 2.6, aRz: .2, aRe: .1, headX: -.3 }]], { T: L.T }); talk(me, L.T, 12.63, 13.73, 'smug');
  orb(L.k, V(FX + 1.2, 4.6, 1.2), null, [12, PI + .15, -.18, 56], [11, PI + .1, -.2, 54]); sh(V(FX, 0, 3), 30); }, [[0, 'whirl', .5], [.3, 'ding_soft', .4]]);
// 13 «Je weiter dein Wurf»: grúa sobre el campo con los carteles de distancia
shot(13.73, 'W', null, L => { field(); const k = easeInOut(L.k);
  cam([FX + 6, 10 + k * 8, 8 - k * 30], [FX + 3, 2, -40 - k * 30], 50); sh(V(FX, 0, -40), 60); [['3 M', -6], ['10 M', -16], ['25 M', -38], ['100 M', -96]].forEach(([t, z], i) => badge3('big', t, V(FX + 15.6, 7.5, z), (L.lt - i * .18) * 3, .55)); }, [[0, 'whoosh_up', .5], [.2, 'tick', .4], [.4, 'tick', .4], [.6, 'tick', .4], [.8, 'ding_soft', .4]]);
// 14 «desto krasser dein Tier»: los Tiere en fila de menor a mayor con su rareza
shot(14.81, 'Z', null, L => { field(); const zr = -34; const row = [[NB[1], 'COMMON', 4.1], [TG[1], 'RARE', 7.1], [CA, 'EPIC', 4.8], [CH, 'LEGENDÄR', 6.4], [FR, 'MYTHISCH', 10], [TR, 'GOTT', 6.4]]; const xs = [-12, -6.5, -1, 4.5, 11, 19];
  row.forEach(([b, t, h], i) => { beast(b, FX + xs[i], 0, zr - i * .5, b === TR ? -.5 : 0); b.pose(L.T + i, {}); rareTag(b, t, (L.lt - .1 - i * .12) * 3, h); });
  const x = lerp(-9, 15, easeInOut(L.k)); cam([FX + x, 7, zr + 24], [FX + x + 1, 5, zr], 46); sh(V(FX + 3, 0, zr), 40); }, [[0, 'whoosh', .5], [.15, 'pling', .4], [.4, 'pling', .4], [.65, 'pling', .45], [.9, 'pling', .5], [1.1, 'ding_reveal', .5]]);
// 15 «Eine Karotte zehn Meter weit?»: lanzamiento corto, la zanahoria cae en el cartel de 10 m
shot(16.17, 'S', null, L => { field(); const k = clamp(L.lt / .5); const t = thrower(K[3], FX, 0, PI, k, 'karotte', .55); cara(t, L.T, { expr: 'determined' });
  const f = clamp((L.lt - .3) / .9); if (k >= .62) { const p = arc([FX + .8, 6, -.6], [FX + 2, .6, DIST[10]], 6, f); show(FOODS.karotte, p.x, p.y, p.z, 0, .8).rotation.set(f * 6, 0, .4); }
  cm([FX - 6, 5, -1, FX + 1, 2.8, -11, 48], [FX - 6.6, 5.4, -2.5, FX + 1.2, 2.4, -14, 48], L.k); sh(V(FX, 0, -8), 30); badge3('big', '10 M', V(FX + 6, 7, DIST[10]), (L.lt - .6) * 3, .8); }, [[.2, 'throw', .5], [.3, 'whoosh_soft', .4], [1.15, 'thud', .5], [1.2, 'ding_soft', .4]]);
// 16 «Ein Noobini Pizzanini»: sale del suelo junto a la zanahoria
shot(18.04, 'Z', 'punch', L => { field(); const up = easeOut(clamp(L.lt / .5)); const b = beast(NB[1], FX + 2, -4.1 + up * 4.1, DIST[10] - 1, -.2); b.pose(L.T, { wave: L.lt > .6, face: { eyes: 'open', mouth: 'smile' } }); show(FOODS.karotte, FX + 3.6, .5, DIST[10] + .4, 0, .8).rotation.set(1.4, 0, .4);
  cm([FX + 2.6, 3, DIST[10] + 8.5, FX + 2, 2.2, DIST[10] - 1, 40], [FX + 2.4, 2.8, DIST[10] + 7, FX + 2, 2.3, DIST[10] - 1, 38], L.k); sh(V(FX, 0, DIST[10]), 30); rareTag(b, 'COMMON', (L.lt - .4) * 3, 4.1); }, [[0, 'pop', .6], [.1, 'rubble', .4], [.5, 'toy', .4]]);
// 17 «Ein Apfel über den Fluss?»: la manzana cruza el río
shot(19.84, 'W', null, L => { field(); const f = clamp(.15 + L.lt / 1.38 * .85), p = arc([FX + .8, 6, -.6], [FX - 4, 1, -92], 30, f); show(FOODS.apfel, p.x, p.y, p.z, L.T * 6, 1.4); trail(p, V(0, 0, -1), L.T, 10, .7);
  cam([FX + 30, 6, -30], [p.x, lerp(4, p.y, .45), p.z], 60); sh(V(FX, 0, -64), 60); }, [[0, 'whoosh', .55], [.5, 'creek', .4], [1.1, 'splash', .25]]);
// 18 «Ein Tung Tung Tung Sahur»: sale del otro lado del río golpeando con el bate en cada «Tung»
shot(21.22, 'C', null, L => { field(); const b = beast(TG[1], FX - 4, 0, -92, .4); const bk = [.14, .41, .67].reduce((a, t) => L.lt >= t && L.lt < t + .26 ? (L.lt - t) / .26 : a, null); b.pose(L.T, { bonk: bk, face: { eyes: 'wide', mouth: bk != null ? 'open' : 'teeth' } });
  show(FOODS.apfel, FX - 7.2, 1, -89.6, 0, 1.1); cm([FX + 2, 5.4, -77, FX - 4, 4.6, -92, 42], [FX + 1.2, 5.2, -79, FX - 4, 4.8, -92, 40], L.k); sh(V(FX - 4, 0, -92), 30); rareTag(b, 'RARE', (L.lt - .5) * 3, 7.1); }, [[.14, 'metal_hit', .45], [.41, 'metal_hit', .45], [.67, 'metal_hit', .45], [.9, 'pling', .4]]);
// 19 «Ein Steak über den Berg»: el filete vuela hacia la montaña nevada
shot(22.85, 'S', null, L => { field(); const f = clamp(.2 + L.lt / 1.14 * .8), p = arc([FX + .8, 6, -.6], [FX + 30, 20, -290], 150, f); show(FOODS.steak, p.x, p.y, p.z, L.T * 5, 3); FOODS.steak.rotation.x = L.T * 4; trail(p, V(.1, .3, -1).normalize(), L.T, 12, 1.5);
  cam([p.x - 16, p.y + 4, p.z + 30], [p.x + 4, p.y - 6, p.z - 20], 50); sh(V(FX, 0, -200), 80); }, [[0, 'whoosh_up', .6], [.5, 'wind', .4]]);
// 20 «und ein Cappuccino Assassino»: aterriza en la calle en pose ninja
shot(23.99, 'Z', null, L => { street(); const y = Math.max(0, 14 - L.lt * 40); const b = beast(CA, 0, y, -4, 0); b.pose(L.T, { stance: clamp(L.lt * 2), crouch: y < .1 && L.lt < .7, face: { eyes: 'angry' } }); 
  orb(L.k, V(0, 3, -4), null, [13, .15, .05, 44], [11.5, .1, .04, 44]); sh(V(0, 0, -4), 30); rareTag(b, 'EPIC', (L.lt - .5) * 3, 4.8); }, [[0, 'whoosh_down', .5], [.33, 'land', .6], [.5, 'metal_creak', .3], [.8, 'swipe', .5], [1.2, 'zip', .4]]);
// 21 «spaziert direkt zu deiner Haustür»: camina por el jardín hasta la puerta y la dueña abre asustada
shot(25.77, 'W', null, L => { street(); const zz = -8 + 5.1, x = lerp(-11, -15.4, clamp(L.lt / 1.3)); const b = beast(CA, x, 0, zz, -PI / 2); b.pose(L.T, { walk: L.lt < 1.3 ? 1 : 0, stance: .3 });
  const o = put(XT[1], -17.1, .5, zz, PI / 2); actuar(o, L.lt, [[0, 'idle'], [.9, 'shock', { dur: .25 }]], { T: L.T }); cara(o, L.T, { expr: L.lt > .9 ? 'shock' : 'neutral', mouth: L.lt > .9 ? 'o' : 'flat' });
  orb(L.k, V(-14.6, 3.2, zz), null, [14, .3, .12, 44], [13, .26, .1, 44]); sh(V(-14, 0, zz), 30); }, [[0, 'steps', .5], [.6, 'steps', .5], [1.0, 'door_open', .5], [1.2, 'gasp_f', .4]]);
// 22 «Und das Beste?»: yo de cerca, cómplice
shot(27.55, 'C', 'punch', L => { street(); const me = put(ich, 0, 0, 10, PI / 10); actuar(me, L.lt, [[0, { aRx: 1.9, aRz: -.5, aRe: 2.3, headZ: .1 }]], { T: L.T }); talk(me, L.T, 27.55, 28.44, 'smug');
  orb(L.k, V(0, 4.2, 10), null, [10.5, PI / 10 + .1, .06, 44], [9.2, PI / 10 + .04, .06, 42]); sh(V(0, 0, 10), 20); }, [[0, 'zoom_fast', .5], [.3, 'sparkle', .4]]);
// 23 «Die Tiere machen Geld»: jardines con Tiere y monedas saltando por todas partes
shot(28.44, 'F', null, L => { street(); const z0 = -8; const B = [[NB[1], 2.6, z0 + 6], [LI[0], -3.2, z0 + 1], [CH, 3.4, z0 - 6], [TG[0], -3, z0 - 13]];
  B.forEach(([b, x, z], i) => { beast(b, x, 0, z, x < 0 ? .25 : -.25); b.pose(L.T + i, { face: { eyes: 'happy', mouth: 'grin' } }); const t = (L.lt + i * .27) % .9; coinPop(V(x, 4, z), L.T - t, L.T, 3, i * 4, .8); plus(V(x, 6.5, z), '+1', t, .8); });
  cm([0, 8, z0 + 21, 0, 3, z0 - 4, 48], [0, 7.4, z0 + 18, 0, 3, z0 - 4, 46], L.k); sh(V(0, 0, z0), 30); badge('gold', '$$$', W / 2, H * .15, (L.lt - .1) * 3, 1, .8); }, [[0, 'coins', .5], [.4, 'cash', .5], [.8, 'coins', .45], [1.2, 'cash_reg', .4]]);
// 24 «Alle paar Sekunden ploppen Goldmünzen aus ihnen raus»: un Lirilì escupe monedas cada pocos segundos
shot(29.91, 'W', null, L => { street(); const b = beast(LI[1], -1, 0, -4, .25); const per = .82, t = L.lt % per, n = Math.floor(L.lt / per); b.pose(L.T, { trunkUp: t < .3, face: { eyes: t < .3 ? 'wide' : 'half' } }); b.root.scale.setScalar(1 + (t < .15 ? Math.sin(t / .15 * PI) * .08 : 0));
  coinPop(V(-1, 3.2, -2.6), L.T - t, L.T, 5, n * 5, .7); plus(V(-1, 6, -3), '+1', t, 1);
  cm([3, 4.6, 7, -1, 3.2, -4, 42], [2.4, 4.2, 5.2, -1, 3.2, -4, 40], L.k); sh(V(0, 0, -4), 30); }, [[.02, 'pop', .55], [.84, 'pop', .55], [1.66, 'pop', .55], [2.0, 'coins', .4]]);
// 25 «Frag mich bloß nicht, wie»: yo me encojo de hombros
shot(32.59, 'R', null, L => { street(); const me = put(ich, 1, 0, -4, -.2); actuar(me, L.lt, [[0, 'idle'], [.1, 'shrug', { dur: .3 }]], { T: L.T }); talk(me, L.T, 32.59, 33.89, 'confused');
  const b = beast(LI[1], -2.4, 0, -6.4, .3); b.pose(L.T, {}); orb(L.k, V(-.6, 3.2, -5), null, [14, .05, .1, 44], [12.6, .02, .08, 44]); sh(V(0, 0, -4), 30); badge('q', '?', W * .7, H * .2, (L.lt - .3) * 3, 1, .9); }, [[.1, 'cloth', .4], [.3, 'hmm', .4]]);

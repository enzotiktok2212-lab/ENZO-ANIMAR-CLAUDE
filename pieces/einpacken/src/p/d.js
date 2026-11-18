// ---------- d: la fiesta en el sótano y el giro final (98,13 – 118,3 s) ----------
// Sótano PK (x = PKX): techo a 7, escalera en x = PKX + 15 bajando de z = -15 (y 6,5) a z = -4 (y 0,3); hueco en el techo encima de la escalera.
const stepY = z => clamp((z + 15) / 10.8) < 1 ? Math.max(0, 6.5 - (z + 15) / 1.35 * .78) : 0;
const guests = (L, mode = 'cheer') => [[K[0], -6, -8, .5], [K[1], -11, -12, .4], [K[2], 4, -9, -.4], [K[4], -9, -2, .9], [XT[2], -15, -6, .8]].forEach(([k, x, z, ry], i) => { put(k, PKX + x, 0, z, ry); actuar(k, L.lt, [[0, mode === 'cheer' ? (i % 2 ? 'cheer' : 'wave') : mode]], { T: L.T + i, extra: { hipY: 2.05 + Math.max(0, Math.sin(L.T * 9 + i)) * .2 } }); cara(k, L.T + i, { expr: 'joy' }); });
// 75 «Am Samstag bin ich die Kellertreppe»: bajo la escalera del sótano (cuello normal); abajo, la fiesta
shot(98.13, 'F', null, L => { kel(L); guests(L, 'wave'); const z = lerp(-14, -8.5, L.k); const c = put(ich, PKX + 15, stepY(z), z, 0); actuar(c, L.lt, [[0, { ...walkPose(L.lt * 1.4), lean: .05 }]], { T: L.T }); hals(c, .4, { T: L.T }); cara(c, L.T, { expr: 'happy' });
  const l = put(lina, PKX + 10, 0, -4, PI - .7); actuar(l, L.lt, [[0, 'wave']], { T: L.T }); cara(l, L.T, { expr: 'joy' }); cam([PKX + 7, 3.2, 5], [PKX + 15, 4.4, -10], 52); sh(V(PKX, 0, -6), 30); }, [[0, 'steps', .5], [.3, 'steps', .5], [.6, 'cheer', .4], [.9, 'radio', .3]]);
// 76 «runtergelaufen.»: últimos escalones, llego abajo
shot(99.57, 'W', null, L => { kel(L); guests(L); const z = lerp(-7.6, -3, L.k); const c = put(ich, PKX + 15, stepY(z), z, 0); actuar(c, L.lt, [[0, { ...walkPose(L.lt * 1.4) }]], { T: L.T }); hals(c, .4, { T: L.T }); cara(c, L.T, { expr: 'grin' });
  orbit(V(PKX + 15, 3.6, z), 13, -.75, .05, 50); sh(V(PKX, 0, -6), 30); }, [[0, 'steps', .5], [.4, 'land', .5]]);
// 77 «Mit dem ganzen Körper.»: en el centro del sótano, entero, con los brazos abiertos; confeti
shot(100.35, 'C', 'punch', L => { kel(L); guests(L); const c = put(ich, PKX + 2, 0, -1, 0); hals(c, .4, { T: L.T }); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); cara(c, L.T, { expr: 'joy' }); confetti(V(PKX + 2, 0, -1), 100.35, L.T, 50, 1); confRain(V(PKX + 2, -6, -1), L.T, 0);
  badge('green', 'GANZ!', W / 2, H * .2, (L.lt - .15) * 4, 1, .9); orbit(V(PKX + 2, 3.2, -1), lerp(15, 13, L.k), .15, .02, 50); sh(V(PKX, 0, -2), 30); }, [[0, 'party_horn', .5], [.1, 'confetti', .5], [.3, 'cheer', .5]]);
// 78 «Marvin kam auch.»: Marvin baja la escalera… pero su cuello sigue subiendo por el hueco del techo
shot(101.59, 'W', null, L => { kel(L); guests(L, 'shock'); const z = lerp(-9, -6, L.k); const m = put(marvin, PKX + 15, stepY(z), z, 0); actuar(m, L.lt, [[0, { ...walkPose(L.lt * 1.4) }]], { T: L.T }); hals(m, 16, { T: L.T, bend: -.15 }); cara(m, L.T, { expr: 'happy' });
  cam([PKX + 6, 1.0, 6], [PKX + 15, 5.4, -7], 58); sh(V(PKX, 0, -6), 30); }, [[0, 'steps', .5], [.4, 'stretch_creak', .4]]);
// 79 «Sein Kopf steckte noch in der Küche.»: arriba, en la cocina: la cabeza de Marvin asoma por la trampilla del suelo, comiéndose un pretzel
shot(102.45, 'C', 'punch', L => { use('KU'); inside(.95, 40); const m = put(marvin, KUX, -14, .5, 0); hals(m, 12.6 + Math.sin(L.T * 3) * .15, { T: L.T, sway: .06 }); applyPose(m, {}); cara(m, L.T, { expr: 'joy', mouth: Math.sin(L.T * 14) > 0 ? 'open_smile' : 'smile' }); attach(PZ[0], m.head, [0, .3, .8], [0, 0, 0], .8);
  const p = put(papa, KUX + 7, 0, -4, -.9); actuar(p, L.lt, [[0, 'shock']], { T: L.T }); cara(p, L.T, { expr: 'shock' }); orbit(headC(m).add(V(1.5, 0, 0)), lerp(14, 12, L.k), .3, .12, 46); sh(V(KUX, 0, 0), 30); }, [[0, 'chew', .6], [.4, 'gasp_old', .4], [.8, 'chew', .5]]);
// 80 «Lina sah mir in die Augen.»: los dos cara a cara, a la misma altura; luces de colores
const twoShot = (L, ex = 'love', lx = 'love') => { const c = put(ich, PKX - 2, 0, -2, PI / 2 - .35), l = put(lina, PKX + 1.4, 0, -2, -PI / 2 + .35); hals(c, .4, { T: L.T }); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); actuar(l, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: ex }); cara(l, L.T, { expr: lx }); return [c, l]; };
shot(103.81, 'Z', null, L => { kel(L); guests(L, 'idle'); const [c, l] = twoShot(L); hearts(headC(c).lerp(headC(l), .5).add(V(0, 1.4, 0)), L.T); orbit(headC(c).lerp(headC(l), .5), lerp(11.5, 10, L.k), .08, .02, 46); sh(V(PKX, 0, -2), 20); }, [[0, 'heartbeat', .5], [.6, 'sparkle', .4]]);
// 81 «Auf gleicher Höhe.»: de lado: ojos a la misma altura
shot(105.15, 'W', 'punch', L => { kel(L); guests(L, 'idle'); const [c, l] = twoShot(L); badge('tag', 'GLEICHE HÖHE', W / 2, H * .2, (L.lt - .1) * 4); hearts(headC(c).lerp(headC(l), .5).add(V(0, 1.4, 0)), L.T); orbit(V(PKX - .3, 3.4, -2), lerp(15, 13, L.k), -.3, .02, 48); sh(V(PKX, 0, -2), 20); }, [[0, 'ding_soft', .5], [.3, 'heartbeat', .4]]);
// 82 «Sie fragte:»: Lina me señala el cuello, extrañada
shot(106.27, 'C', null, L => { kel(L); guests(L, 'idle'); const [c, l] = twoShot(L, 'smile', 'confused'); actuar(l, L.lt, [[0, 'point']], { T: L.T }); orbit(headC(l), lerp(7.5, 6.5, L.k), -.9, .02, 44); sh(V(PKX, 0, -2), 20); }, [[0, 'hmm', .5]]);
// 83 «„Wo ist dein Hals?“»
shot(107.00, 'W', 'punch', L => { kel(L); guests(L, 'idle'); const [c, l] = twoShot(L, 'smile', 'talk'); actuar(l, L.lt, [[0, 'shrug']], { T: L.T }); talk(l, L.T, 107.0, 108.02, 'confused'); bubble(l, 'Wo ist dein Hals?', (L.lt - .05) * 4, 1.4);
  orbit(headC(c).lerp(headC(l), .6), lerp(10, 9, L.k), -.4, .02, 44); sh(V(PKX, 0, -2), 20); }, [[0, 'pop', .4]]);
// 84 «Ich sagte: „Weg.“»: sonrío chulo; confeti
shot(108.02, 'C', 'punch', L => { kel(L); guests(L); const [c, l] = twoShot(L, 'smug', 'joy'); actuar(c, L.lt, [[0, { aLx: .3, aRx: .3, aLz: .9, aRz: .9, aLe: 1.9, aRe: 1.9, lean: -.1 }]], { T: L.T }); talk(c, L.T, 108.02, 109.18, 'smug'); bubble(c, 'Weg.', (L.lt - .2) * 4, 1.4); confRain(V(PKX, -2, -2), L.T, 40, 12, 10, 9);
  orbit(headC(c), lerp(8, 7, L.k), .5, .02, 44); sh(V(PKX, 0, -2), 20); }, [[0, 'confetti', .4], [.2, 'cheer', .5], [.5, 'party_horn', .3]]);
// ---------- giro final: la mañana siguiente, la buhardilla ----------
const meWin = (L, expr = 'sleepy', open = 0) => { SHUT[0].rotation.y = -open * 1.5; SHUT[1].rotation.y = open * 1.5; DLIGHT.intensity = 12; const c = put(ich, 10.15, 17.3, 90, PI / 2); hals(c, .3, { T: L.T }); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr }); return c; };
const papaG = (L, expr = 'grin', look = 0) => { const p = put(papa, 17.4, 0, 90.4, -.45 + look); hals(p, 17.6, { T: L.T, sway: .02, lean: .3 }); handy(p, PH2); feed(PH2, L.T, true); actuar(p, L.lt, [[0, scrollPose]], { T: L.T }); cara(p, L.T, { expr }); return p; };
// 85 «Doch die Geschichte war noch nicht vorbei» (zoom lento): mi casa a la mañana siguiente; la buhardilla cerrada
shot(109.18, 'F', 'slow', L => { morning(L); meWin(L, 'sleepy'); orbit(DW.clone().add(V(0, -2, 0)), lerp(48, 26, easeIn(L.k)), .7, .1, 46); sh(V(12, 0, 90), 40); }, [[0, 'birds', .5], [.6, 'wind', .4], [1.4, 'heartbeat', .4]]);
// 86 «Am nächsten Morgen klopfte jemand»: yo dentro de la buhardilla me despierto de golpe: ¡toc, toc!
shot(111.02, 'C', 'punch', L => { morning(L); const c = meWin(L, L.lt > .5 ? 'gasp' : 'sleepy'); badge('huss', 'KNOCK KNOCK', W * .5, H * .2, (L.lt - .55) * 4, 1, .8); orbit(DW.clone().add(V(-1, -.2, 0)), lerp(9, 8, L.k), PI / 2 + .25, .02, 44); sh(V(12, 0, 90), 20); }, [[0, 'yawn_m', .3], [.6, 'knock', .8], [.9, 'knock', .8]]);
// 87 «an mein Dachfenster»: una cabeza golpea el cristal desde fuera (de espaldas: no se sabe quién es)
shot(112.22, 'W', null, L => { morning(L); meWin(L, 'scared'); const p = put(papa, 14.2, 0, 89.6, -PI / 2 + .05); hals(p, 17.6, { T: L.T, sway: .01, lean: 0, bend: .32 + Math.max(0, Math.sin(L.lt * 14)) * .06 }); applyPose(p, {}); cara(p, L.T, { expr: 'grin' });
  cam([19, 24.4, 93.8], [10.8, 22, 90], 44); sh(V(12, 0, 90), 20); }, [[.1, 'knock', .8], [.33, 'knock', .8], [.56, 'knock', .8]]);
// 88 «Es war Papa.»: ¡es papá! con el cuello larguísimo, sonriendo
shot(113.42, 'Z', 'punch', L => { morning(L); meWin(L, 'shock', 1); const p = papaG(L, 'grin', .25); orbit(headC(p), lerp(10, 8.5, L.k), .45, .04, 44); sh(V(14, 0, 90), 30); }, [[0, 'braam_short', .5], [.2, 'laugh_deep', .4]]);
// 89 «Mit dem Handy in der Hand.»: la cámara baja por su cuello hasta el móvil: está viendo «In dieser Stadt»
shot(114.37, 'S', null, L => { morning(L); meWin(L, 'shock', 1); const p = papaG(L, 'grin'); const ph = wpos(PH2), h = headC(p), q = easeInOut(L.k); const t = h.clone().lerp(ph, q); cam([t.x + 7, t.y + 1, t.z + 6], [t.x, t.y, t.z], 46); sh(V(14, 0, 90), 30); }, [[0, 'whoosh_down', .5], [.6, 'notif', .5]]);
// 90 «Er sagte: „Großer …»: papá me habla desde fuera; yo en la ventana abierta
shot(115.30, 'C', 'punch', L => { morning(L); const c = meWin(L, 'shock', 1); const p = papaG(L, 'talk', .1); talk(p, L.T, 115.3, 116.67, 'happy'); bubble(p, 'Großer …', (L.lt - .6) * 4);
  orbit(headC(p).lerp(headC(c), .45), 12, .55, .05, 44); sh(V(12, 0, 90), 30); }, [[0, 'laugh_m', .3]]);
// 91 «gib mal die Brezel.»: plano general: papá con su cuello de jirafa pidiendo el pretzel; yo con la mano en la cara; las gaviotas vuelven
shot(116.67, 'W', null, L => { morning(L); const c = meWin(L, 'worried', 1); actuar(c, L.lt, [[0, 'facepalm']], { T: L.T }); const p = papaG(L, 'grin', .1); talk(p, L.T, 116.67, 117.6, 'happy'); bubble(p, '… gib mal die Brezel!', (L.lt - .05) * 4);
  GULLS.forEach((g, i) => { const a = L.T * 1.6 + i * 1.57; show(g, 13 + Math.cos(a) * 7, 29 + Math.sin(L.T * 2 + i) * 1.2, 90 + Math.sin(a) * 7, 0, 1); g.rotation.y = -a; g.userData.flap(L.T + i); });
  orbit(V(13, 19, 90), lerp(30, 40, easeOut(L.k)), .6, .1, 46); sh(V(13, 0, 90), 40); }, [[0, 'laugh_deep', .4], [.3, 'birds', .5], [.8, 'feathers', .4]]);

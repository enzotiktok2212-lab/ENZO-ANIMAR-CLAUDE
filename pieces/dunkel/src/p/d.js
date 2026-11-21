// coches de policía en anillo mirando al monstruo (r, número, desfase de ángulo para que entren girando)
const CARRING = (L, n = 20, r = 46, off = 0, on = 1) => { for (let i = 0; i < n; i++) { const a = i / n * PI * 2 + .08 + off; const c = show(CARS[i], Math.sin(a) * r, 0, Math.cos(a) * r, a + PI); c.userData.set(on, L.T + i * .13); } };
// 40 «Keine drei Minuten später rasten zwanzig» — los coches patrulla llegan a toda velocidad por la avenida entre los bloques, con las sirenas
shot(68.07, 'S', null, L => { plaza(L); mon(MPOSE.frozen); for (let i = 0; i < 8; i++) { const z = 200 - L.lt * 38 - i * 13, x = (i % 2 ? 4 : -4); show(CARS[i], x, 0, z, PI).userData.set(1, L.T + i * .2); }
  const c = put(PO[0], 0, 0, 0, 0); c.root.visible = false; cm([12, 5, 120, 0, 3, 190, 54], [12, 5, 112, 0, 3, 170, 52], L.k); badge('num', '3 MIN', W / 2, H * .15, L.lt * 3); badge('num', '20', W / 2, H * .25, (L.T - 69.75) * 3, 1, 1.6); sh(V(0, 0, 150), 50); }, [[0, 'siren', .8], [.2, 'car_pass', .7], [1.2, 'brakes', .5]]);
// 41 «Streifenwagen auf den Platz» — vista aérea: los coches derrapan y forman un anillo alrededor del monstruo
shot(70.27, 'F', null, L => { plaza(L); mon(MPOSE.frozen); const k = easeOut(clamp(L.lt / 1.1)); CARRING(L, 20, lerp(70, 46, k), lerp(.9, 0, k)); RING(L, GUARDS(), -1, 1, 37, { torch: false, pose: { headX: -.4 } });
  cm([30, 110, 100, 0, 0, 0, 52], [26, 104, 92, 0, 0, 0, 52], L.k); sh(V(0, 0, 0), 80); }, [[0, 'brakes', .7], [.3, 'siren', .5], [.8, 'car', .4]]);
// 42 «und richteten ihre Scheinwerfer auf das Ding.» — junto a un coche: se encienden las luces largas; la policía señala al monstruo
shot(71.57, 'C', null, L => { plaza(L); mon(MPOSE.frozen); CARRING(L, 20, 46, 0, 1); const on = L.lt > .5 || Math.sin(L.lt * 40) > 0 && L.lt > .3; CARS[0].userData.set(on ? 1 : 0, L.T); const a0 = .08, cp = V(Math.sin(a0) * 46, 0, Math.cos(a0) * 46);
  const po = put(PO[0], cp.x + 3.4, 0, cp.z + 1, a0 + PI + .2); actuar(po, L.lt, [[0, { aRx: 1.0, aRe: .3 }], [.6, 'point', { dur: .3 }]], { T: L.T }); cara(po, L.T, { expr: 'determined' }); const pp = put(PO[1], cp.x - 3.4, 0, cp.z + 2, a0 + PI - .2); actuar(pp, L.lt, [[0, { headX: -.4 }]], { T: L.T }); cara(pp, L.T, { expr: 'shock' });
  cm([cp.x + 12, 4, cp.z + 12, cp.x - 2, 6, cp.z - 12, 54], [cp.x + 11, 4.4, cp.z + 10.5, cp.x - 2, 7, cp.z - 12, 52], L.k); sh(cp, 30); }, [[.3, 'switch', .7], [.4, 'power_on', .5], [.9, 'shout_m', .3]]);
// 43 «Die Wachleute stellten sich im Kreis auf,» — cenital: los vigilantes forman un círculo alrededor del monstruo
shot(73.57, 'R', null, L => { plaza(L); mon(MPOSE.frozen); CARRING(L, 20, 46, 0, 1); const k = easeOut(clamp(L.lt / 1.3)); GUARDS().concat([papa]).forEach((c, i) => { const a = i / 8 * PI * 2, r = lerp(44, 34, k); put(c, Math.sin(a) * r, 0, Math.cos(a) * r, a + PI); if (k < 1) { const w = caminar(c, L.lt, { x: Math.sin(a) * 44, z: Math.cos(a) * 44, ry: a + PI, run: true, T: L.T + i }); c.root.position.set(Math.sin(a) * r, 0, Math.cos(a) * r); } else actuar(c, L.lt, [[0, {}]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); });
  const a = L.k * .5; cm([Math.sin(a) * 8, 120, Math.cos(a) * 8 + 4, 0, 0, 0, 50], [Math.sin(a) * 8, 112, Math.cos(a) * 8 + 4, 0, 0, 0, 50], L.k); sh(V(0, 0, 0), 60); }, [[0, 'run_cobble', .6], [.6, 'steps', .5], [1.2, 'whistle', .5]]);
// 44 «die Taschenlampen nach oben.» — contrapicado: todos levantan la linterna a la vez y los haces se cruzan hacia el monstruo
shot(75.61, 'W', null, L => { plaza(L); mon(MPOSE.frozen); CARRING(L, 20, 46, 0, 1); const k = easeOut(clamp(L.lt / .4)); RING(L, GUARDS(), -.7, .7, 35, { pose: { aRx: lerp(.3, 2.5, k), aRe: .1, headX: -.6 } });
  cm([12, 1.4, 41, 0, 26, 10, 64], [12, 1.4, 39.5, 0, 27, 10, 62], L.k); sh(V(0, 0, 35), 30); }, [[0, 'click_metal', .7], [.1, 'click_metal', .6], [.2, 'cloth', .5]]);
// 45 «Und aus jedem Fenster ringsum» — la fachada de los vecinos: las ventanas se van encendiendo una tras otra
shot(76.88, 'Z', null, L => { use('FE'); night(); FE.L.intensity = 80; const who = [oma, kind, nach, WA[5], K[3], K[4]]; FE.holes.forEach(([x, y], i) => { const on = L.lt > .25 + i * .25; if (!on) return; const c = put(who[i], FX + x, y - 4.6, -1.8, 0); const it = i % 2 ? PHONE : null;
    actuar(c, L.lt, [[0, { aRx: 1.9, aRe: .3, headX: -.2 }]], { T: L.T + i }); if (i === 0) attach(BLAMP, c.aR.hand, [0, -.5, .5], [0, 0, 0], 1); if (i === 1) attach(PHONE, c.aR.hand, [0, -.5, .3], [-.3, 0, 0], 1.2); cara(c, L.T, { expr: 'determined' }); });
  cm([FX + 3, 9, 30, FX, 12.5, 0, 54], [FX + 2.6, 9.4, 27, FX, 12.5, 0, 52], L.k); }, [[.25, 'switch', .5], [.5, 'curtain', .5], [.75, 'switch', .5], [1.0, 'door_open', .3], [1.25, 'switch', .5]]);
// 46 «plötzlich Nachttischlampen und Handys.» — Oma saca su lámpara de mesilla por la ventana; al lado un niño apunta con el móvil
shot(78.92, 'C', null, L => { use('FE'); night(); FE.L.intensity = 80; const o = put(oma, FX - 9, 8 - 4.4, -1.4, 0), k = put(kind, FX, 8 - 3.4, -1.2, 0);
  actuar(o, L.lt, [[0, { aRx: 1.7, aRe: .2, aLx: 1.5, aLe: .3, lean: .15 }]], { T: L.T }); attach(BLAMP, oma.aR.hand, [0, -.6, .6], [-.3, 0, 0], 1.1); cara(o, L.T, { expr: 'determined' });
  actuar(k, L.lt, [[0, { aRx: 2.0, aRe: .1, lean: .1 }]], { T: L.T }); attach(PHONE, kind.aR.hand, [0, -.5, .3], [-.5, 0, 0], 1.3); cara(k, L.T, { expr: 'joy' });
  cm([FX - 4, 8.6, 22, FX - 4.5, 7.6, 0, 50], [FX - 4.2, 8.6, 20, FX - 4.5, 7.6, 0, 48], L.k); }, [[0, 'switch', .5], [.4, 'click_metal', .4], [.8, 'cloth', .4]]);
// 47 «Dann – klick –» — sala de control: clic y se apagan de golpe todas las pantallas
shot(80.76, 'F', null, L => { use('LS'); inside(L.T < BLACK ? .7 : .12); if (L.T >= BLACK) LS.L.intensity = 0; const off = L.T >= BLACK; LS.mons.forEach((m, i) => m.userData.draw(off ? 'off' : 'on' + i, (cc, w, h) => { cc.fillStyle = off ? '#000' : '#0a2a3a'; cc.fillRect(0, 0, w, h); if (!off) txt(cc, ['T1-8', 'NETZ', 'NOTSTROM'][i], w / 2, h / 2, 48, '#ffb43a'); }));
  LS.wallS.userData.draw(off ? 'off' : 'on', (cc, w, h) => { cc.fillStyle = off ? '#000' : '#0a1a2a'; cc.fillRect(0, 0, w, h); if (!off) txt(cc, 'STROM: 3 %', w / 2, h / 2, 80, '#ff5a4a'); });
  const c = put(tech, LX - 1, 0, -1.4, .3); actuar(c, L.lt, [[0, { headX: -.1 }]], { T: L.T }); cara(c, L.T, { expr: off ? 'shock' : 'worried' }); if (off) { attach(PHONE, tech.aR.hand, [0, -.5, .3], [-.5, 0, 0], 1.2); actuar(c, L.lt, [[0, { aRx: 1.6, aRe: .5, headX: -.1 }]], { T: L.T }); } LS.L.intensity = off ? 0 : 110;
  cm([LX + 3, 6.4, 12, LX - 1, 5.6, -3, 50], [LX + 2.6, 6.4, 11, LX - 1, 5.6, -3, 48], L.k); }, [[.54, 'switch', 1], [.6, 'power_on', .3]]);
// 48 «ging in der ganzen Stadt das Licht aus.» — la ciudad entera se apaga en una ola, de los rascacielos del fondo hacia la plaza
shot(81.83, 'S', null, L => { plaza(L); mon(MPOSE.frozen); const k = clamp(L.lt / 1.4); const n = LIT.sky.length; LIT.sky.forEach((m, i) => m.emissiveIntensity = i / n > k ? 1.2 : 0); LIT.win.forEach((m, i) => m.emissiveIntensity = i / LIT.win.length > k * 1.2 - .2 ? 1.5 : 0); LIT.lamp.forEach(m => m.emissiveIntensity = k < .6 ? 3 : 0);
  RING(L, GUARDS(), -.8, .8, 35); const c = put(papa, 6, 0, 30, PI); actuar(c, L.lt, [[0, { headX: -.2, headY: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'shock' });
  cm([-30, 70, 150, 0, 30, -80, 48], [-28, 66, 142, 0, 30, -80, 46], L.k); sh(V(0, 0, 0), 80); }, [[0, 'power_on', .3], [.3, 'switch', .6], [.6, 'hum_low', .5], [1.2, 'wind', .5]]);
// 49 «Überall war es stockdunkel.» — una calle a oscuras: solo se ve la silueta de un vigilante con su linterna y la luna
shot(83.78, 'Z', null, L => { plaza(L); mon(MPOSE.frozen); DARK = .3; const c = caminar(WA[2], L.lt, { x: 80, z: 60, ry: -PI * .75, speed: 1.8, T: L.T }); torch(1, WA[2]); actuar(WA[2], L.lt, [[0, { aRx: 1.5 + Math.sin(L.T * 2) * .2, aRe: .1, headY: Math.sin(L.T * 2) * .4 }]], { T: L.T }); cara(WA[2], L.T, { expr: 'scared' });
  cm([c.x - 10, 4, c.z - 16, c.x, 5, c.z, 50], [c.x - 9, 4, c.z - 14, c.x, 5, c.z, 48], L.k); sh(V(c.x, 0, c.z), 30); }, [[0, 'wind', .7], [.5, 'steps', .5], [1.2, 'owl', .4]]);
// 50 «Nur beim Monster nicht.» — plano general: toda la ciudad negra… y en medio el monstruo, iluminado por cientos de luces
shot(85.56, 'S', 'slow', L => { plaza(L); mon(MPOSE.frozen); CARRING(L, 20, 46, 0, 1); RING(L, GUARDS(), -2.6, 2.6, 35);
  cm([0, 24, 104, 0, 28, 0, 50], [0, 25, 88, 0, 30, 0, 46], L.k, easeIn); sh(V(0, 0, 0), 80); }, [[0, 'hum_low', .5], [.6, 'creepy_ting', .5]]);
// 51 «Hunderte Lichter hielten es fest,» — la cámara gira alrededor de la cintura del monstruo: haces de coches, linternas y ventanas lo clavan — «HUNDERTE»
shot(86.93, 'C', null, L => { plaza(L); mon(MPOSE.frozen); CARRING(L, 20, 46, 0, 1); RING(L, GUARDS(), -2.6, 2.6, 35); const a = lerp(.6, 1.2, L.k); cam([Math.sin(a) * 40, 14, Math.cos(a) * 40], [0, 28, 0], 56);
  badge('big', 'HUNDERTE', W / 2, H * .15, L.lt * 3); sh(V(0, 0, 0), 60); }, [[0, 'hum', .6], [.5, 'siren', .3], [1.2, 'metal_creak', .3]]);
// 52 «also blieb es reglos stehen.» — la garra del monstruo tiembla, pero no puede moverse
shot(88.74, 'W', null, L => { plaza(L); mon({ ...MPOSE.frozen, clawR: .05 + Math.abs(Math.sin(L.T * 30)) * .04, clawL: .1 + Math.abs(Math.sin(L.T * 27)) * .04 }); CARRING(L, 20, 46, 0, 1); const pm = palm(MON, true);
  cm([pm.x + 10, pm.y + 2, pm.z + 14, pm.x, pm.y, pm.z, 46], [pm.x + 9, pm.y + 2, pm.z + 12, pm.x, pm.y, pm.z, 44], L.k); badge3('tag', 'ERSTARRT', pm.clone().add(V(0, 9, 0)), (L.lt - .3) * 3); sh(pm, 30); }, [[0, 'metal_creak', .6], [.4, 'freeze', .6]]);
// 53 «Für einen Moment dachte ich, wir hätten es geschafft.» — sonrío aliviado; papá me pone la mano en el hombro; un vigilante choca los cinco con otro
shot(90.48, 'R', null, L => { plaza(L); mon(MPOSE.frozen); CARRING(L, 20, 46, 0, 1); const c = put(ich, -1.5, 0, 40, PI + .2), p = put(papa, -5, 0, 41, PI - .3); ich.props.vest.visible = true; torch(0, c, 1, 1);
  actuar(c, L.lt, [[0, { aRx: 1.6, aRe: .2, headX: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'relief' }); actuar(p, L.lt, [[0, {}], [.6, { aLx: 1.4, aLz: -.6, aLe: .3, headY: -.3 }, { dur: .35 }]], { T: L.T }); cara(p, L.T, { expr: 'smile' });
  [[WA[0], 6, 38], [WA[1], 9, 38]].forEach(([w, x, z], i) => { put(w, x, 0, z, i ? -PI / 2 : PI / 2); actuar(w, L.lt, [[0, {}], [1.2, { aRx: 2.7, aRz: .3, aRe: .2 }, { dur: .2 }]], { T: L.T }); cara(w, L.T, { expr: 'happy' }); });
  cm([-1, 4.4, 30, -1, 5.2, 40, 52], [-1, 4.6, 31.5, -1, 5.2, 40, 50], L.k); sh(V(0, 0, 40), 20); }, [[0, 'sigh', .5], [.7, 'cloth', .4], [1.3, 'clack', .6], [1.6, 'laugh_deep', .3]]);

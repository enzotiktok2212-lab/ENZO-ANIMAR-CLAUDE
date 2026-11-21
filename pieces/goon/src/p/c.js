// ---------- c: los contenedores, la investigación, el carrito de currywurst y el vecino (39,6 – 66,5 s) ----------
const binsPos = V(-40, 0, -14);
// 26 «Aber irgendwas passt nicht»: por la mañana paso junto a los contenedores, me paro y entorno los ojos
shot(39.60, 'Z', 'slow', L => { town('morning'); num(ich, 0, 1); caminar(ich, L.lt, { x: -35, z: -16, ry: 0, speed: 3, accel: .2, stopAt: .5, T: L.T, extra: { headY: clamp((L.lt - .7) * 3) * 1.0 } }); cara(ich, L.T, { expr: 'sus', eyes: 'squint', mouth: 'wavy' });
  orb(L.k, V(-36, 2.6, -13), null, [13, .3, .1, 44], [10.5, .2, .08, 42]); sh(V(-38, 0, -8), 20); }, [[0, 'zoom_in', .3], [.1, 'birds', .4], [.4, 'steps', .4]]);
// 27 «Jeden Morgen quellen die Mülltonnen»: los contenedores rebosan; las bolas de pañuelos ruedan por el suelo
shot(41.35, 'W', null, L => { town('morning'); BALLS.forEach((b, i) => { const r = RNG(i * 7 + 1), t = clamp(L.lt * 1.4 - r() * .6); show(b, -38 + (r() - .2) * 4 + t * (2 + r() * 4), Math.max(.4, 4.6 - t * t * 8), -14 + (r() - .5) * 9, L.T * 3 + i); });
  const g = put(ich, -34, 0, -7.4, .4); actuar(g, L.lt, [[0, 'shock']], { T: L.T }); num(g, 0, 1); cara(g, L.T, { expr: 'gasp' });
  orb(L.k, V(-38, 3, -12), null, [15, 1.0, .16, 46], [13.5, .9, .14, 46]); sh(V(-38, 0, -12), 20); }, [[0, 'swipe', .3], [.1, 'paper', .6], [.4, 'trash_hit', .4], [.8, 'paper', .4]]);
// 28 «trotzdem über vor Taschentüchern»: primer plano: la tapa amarilla salta y escupe pañuelos
shot(42.99, 'C', 'punch', L => { town('morning'); BALLS.forEach((b, i) => { const r = RNG(i * 3 + 2), t = (L.lt * .9 + r()) % 1; show(b, -40 + (r() - .5) * 3, 4.4 + t * 5 - t * t * 4, -14 + (r() - .5) * 2 + t * 4, L.T * 4 + i); });
  const me = put(ich, -35.4, 0, -8, .5); actuar(me, L.lt, [[0, 'recoil']], { T: L.T }); num(me, 0, 1); cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  orb(L.k, V(-38, 4.0, -11), null, [15, .55, .18, 46], [13.5, .45, .18, 44]); sh(V(-38, 0, -12), 20); }, [[0, 'impact', .4], [.1, 'paper', .7], [.5, 'boing', .4]]);
// 29 «Die Polizei hat alles versucht»: dos policías ante un mapa clavado en el coche, rascándose la cabeza
shot(44.66, 'W', null, L => { town(); show(PCAR[0], 12, 0, -10, PI / 2 + .2); PCAR[0].userData.set(L.T); [[COP[0], 15, -4, .3], [COP[2], 10, -4, -.4]].forEach(([c, x, z, ry], i) => { put(c, x, 0, z, ry); actuar(c, L.lt, [[0, i ? 'think' : 'facepalm']], { T: L.T + i }); num(c, 0, 1); cara(c, L.T, { expr: 'confused' }); });
  orb(L.k, V(12.6, 3.6, -5), null, [15, .15, .14, 46], [13.5, .05, .12, 46]); sh(V(12, 0, -6), 20); }, [[0, 'swipe', .3], [.3, 'hmm', .5], [.9, 'paper', .3]]);
// 30 «Kameras»: un policía en una escalera atornilla una cámara en la fachada
shot(46.49, 'S', null, L => { town(); const c = put(COP[1], -51, 3.2, 30, -PI / 2 - .9); actuar(c, L.lt, [[0, { aRx: 2.4, aRe: .8 + Math.sin(L.T * 12) * .2, aLx: 2.0, aLe: .5, headX: -.3 }]], { T: L.T }); num(c, 0, 1); cara(c, L.T, { expr: 'determined' });
  show(CAMS[0], -53.4, 10.2, 30, PI / 2 + Math.sin(L.T * 2) * .3); badge('tag', 'KAMERAS', W / 2, H * .17, (L.lt - .1) * 3);
  orb(L.k, V(-52, 7, 31), null, [15, .1, -.05, 46], [14, -.05, -.05, 46]); sh(V(-60, 0, 30), 20); }, [[0, 'whoosh_soft', .3], [.2, 'ratchet', .6]]);
// 31 «Spürhunde»: un pastor alemán con chaleco olfatea los contenedores tirando de la correa
shot(47.23, 'R', null, L => { town(); const x = -34 - L.lt * 2.5; show(DOG.root, x, 0, -9, -PI / 2 - .3); DOG.pose(L.T, { walk: 1, sniff: 1 }); const c = put(COP[3], x + 4.4, 0, -8, -PI / 2); caminar(COP[3], L.lt, { x: -30, z: -8, ry: -PI / 2, speed: 2.5, T: L.T, extra: { aLx: 1.0, aLe: .3 } }); num(COP[3], 0, 1); cara(COP[3], L.T, { expr: 'sus' });
  badge('tag', 'SPÜRHUNDE', W / 2, H * .17, (L.lt - .1) * 3); orb(L.k, V(x + 2, 2.6, -9), null, [17, -.4, .14, 46], [16, -.5, .14, 46]); sh(V(x, 0, -10), 20); }, [[0, 'whirl', .3], [.1, 'sniff', .6], [.5, 'bark', .5]]);
// 32 «sogar Wärmebilder»: vista térmica de la plaza: siluetas naranjas paseando, todo normal
shot(48.00, 'F', null, L => { town('night'); THERM = true; crowdWalk(L, [K[0], XT[0], K[2], XT[3], K[5]], -6, -8, 0, null, 3); FILL.intensity = 0; hemi.intensity = .3;
  badge('green', 'WÄRMEBILD', W / 2, H * .15, (L.lt - .1) * 3, 1, .75); cm([2, 7, 20, -6, 3, -6, 48], [0, 7, 16, -6, 3, -6, 48], L.k); sh(V(-6, 0, -2), 30); }, [[0, 'flash', .4], [.2, 'beep', .5], [.8, 'beep', .4]]);
// 33 «Nichts»: los policías se encogen de hombros
shot(49.25, 'Z', 'punch', L => { town(); [[COP[0], -1.6], [COP[2], 1.8]].forEach(([c, dx], i) => { put(c, 12 + dx, 0, -4, PI + dx * .1); actuar(c, L.lt, [[0, 'shrug']], { T: L.T + i }); num(c, 0, 1); cara(c, L.T, { expr: 'sad' }); });
  badge('red', 'NICHTS', W / 2, H * .17, (L.lt - .05) * 3, 1, .85); orb(L.k, V(12.2, 3.6, -4), null, [12.5, PI + .1, .1, 44], [11.5, PI + .05, .1, 44]); sh(V(12, 0, -4), 20); }, [[0, 'impact_soft', .4], [.15, 'sad_tone', .5]]);
// 34 «Denn jede Nacht um halb vier»: el reloj del Rathaus marca las 3:30; los policías duermen en el coche
shot(49.81, 'W', null, L => { town('night'); show(PCAR[0], -2, 0, -64, .4); PCAR[0].userData.set(L.T * 0); [[COP[0], -4.2, -60], [COP[2], .8, -59.6]].forEach(([c, x, z], i) => { put(c, x, 0, z, .3); applyPose(c, { headX: .5, headZ: i ? .3 : -.3, aLz: .1, aRz: .1, crouch: .1 }); num(c, 0, 1); cara(c, L.T, { eyes: 'closed', mouth: 'wavy' }); });
  ZZZ.forEach((z, i) => { const k = (L.T * .6 + i / 3) % 1; z.visible = true; z.position.set(-3.4 + k * 1.6, 5.8 + k * 3, -59 + k * .4); z.scale.setScalar(.6 + k); z.material.opacity = 1 - k; z.lookAt(camera.position); });
  badge('big', '03:30', W / 2, H * .32, (L.lt - .1) * 3, 1, .9); orb(L.k, V(-2, 3.6, -61), null, [16, .25, .12, 46], [14.5, .15, .12, 46]); sh(V(-2, 0, -62), 30); }, [[0, 'swipe', .3], [.1, 'snore_chorus', .6], [.3, 'clock_tick', .4]]);
// 35 «wenn die Drohnen aufladen»: los drones posados en su base de carga, con la batería roja
shot(51.47, 'S', null, L => { town('night'); DRONES.forEach((d, i) => { show(d, -11 + i * 5, 1.4, -64); d.userData.beam(false); d.userData.spin(0); }); BEAM.visible = false;
  badge('red', 'AKKU 3%', W / 2, H * .17, (L.lt - .1) * 3, 1, .8); orb(L.k, V(-6, 2.6, -64), null, [15, .2, .25, 46], [14, .1, .25, 46]); sh(V(-6, 0, -64), 20); }, [[0, 'whoosh_soft', .3], [.2, 'beep', .5], [.6, 'zap', .3]]);
// 36 «rollt ein Currywurstwagen durch die Straßen»: el carrito avanza por la calle oscura con los faros encendidos
shot(52.81, 'F', null, L => { town('night'); const z = 80 - L.lt * 9; show(WAGEN, 26, 0, z, PI); cm([22, 3.2, z - 22, 26, 4, z, 46], [21, 3.4, z - 18, 26, 4, z, 46], L.k); sh(V(26, 0, z), 30); }, [[0, 'flash', .3], [.05, 'engine', .6], [.8, 'brakes', .3]]);
// 37 «Und der verkauft keine Currywurst»: Brutzel-Willi niega con la cabeza junto al letrero CURRYWURST tachado
shot(54.65, 'W', null, L => { town('night'); show(WAGEN, 26, 0, 30, PI); const w = put(willi, 21.6, 0, 30.6, -PI / 2 - .5); actuar(w, L.lt, [[0, { aRx: 1.4, aRz: -.2, aRe: .4, headY: Math.sin(L.T * 9) * .45 }]], { T: L.T }); num(w, 0, 1); cara(w, L.T, { expr: 'smug' });
  orb(L.k, V(22.4, 3.6, 30.6), null, [14, -PI / 2 - .4, .08, 44], [13, -PI / 2 - .5, .08, 44]); sh(V(24, 0, 30), 20); }, [[0, 'swipe', .3], [.2, 'hmm', .4]]);
// 38 «Er verkauft Taschentücher»: saca una caja de pañuelos por la ventanilla, como si fuera oro
shot(56.66, 'C', 'punch', L => { town('night'); show(WAGEN, 26, 0, 30, PI); const w = put(willi, 21.6, 0, 30.6, -PI / 2 - .5); actuar(w, L.lt, [[0, { aRx: 1.6, aLx: 1.6, aRe: .2, aLe: .2, lean: .1 }]], { T: L.T }); num(w, 0, 1); grin(w, L.T);
  const t = loc(w, 0, 2.3, 2.4); show(TBOX[1], t.x, t.y, t.z, -PI / 2); badge('gold', 'TASCHENTÜCHER', W / 2, H * .17, (L.lt - .1) * 3, 1, .65);
  orb(L.k, V(21.8, 3.8, 30.6), null, [11, -PI / 2 - .4, .05, 42], [10, -PI / 2 - .5, .05, 42]); sh(V(24, 0, 30), 20); }, [[0, 'impact_soft', .4], [.2, 'sparkle', .6], [.3, 'choir', .4]]);
// 39 «Achtzig Euro die Packung»: un cliente paga con un fajo; el precio 80 € brilla
shot(58.21, 'W', null, L => { town('night'); show(WAGEN, 26, 0, 30, PI); const w = put(willi, 21.6, 0, 30.6, -PI / 2 - .5); actuar(w, L.lt, [[0, { aRx: 1.4, aRe: .4 }]], { T: L.T }); num(w, 0, 1); grin(w, L.T);
  const c = put(K[0], 20.2, 0, 32.4, -.64); actuar(c, L.lt, [[0, { aRx: 1.5, aRe: .2, lean: .15, headY: -.6 }]], { T: L.T }); num(c, 0, 1); cara(c, L.T, { expr: 'worried' }); const m = loc(c, 1.4, 3.2, 2.2); show(CASH[0], m.x, m.y, m.z, PI / 2);
  badge('red', '80 €', W / 2, H * .3, (L.lt - .1) * 3, 1, .95); orb(L.k, V(21.6, 4.2, 28.6), null, [15, -PI / 2 + .8, .1, 46], [14, -PI / 2 + .7, .1, 46]); sh(V(22, 0, 30), 20); }, [[0, 'swipe', .3], [.2, 'cash', .7], [.6, 'coins', .4]]);
// 40 «Die Schlange ist länger als vor dem Dönerladen»: cola enorme ante el carrito; el del döner, solo, afila el cuchillo aburrido
shot(59.77, 'S', null, L => { town('night'); show(WAGEN, 26, 0, 30, PI); [K[1], XT[2], K[2], XT[3], K[4], XT[4], K[5], K[6], XT[1], K[7]].forEach((c, i) => { put(c, 20.6, 0, 26 - i * 2.6, PI + (i % 2 ? .1 : -.1)); actuar(c, 0, [[0, i % 3 ? 'idle' : 'phone_look']], { T: L.T + i }); num(c, 0, 1); cara(c, L.T + i, { expr: 'bored' }); });
  const k = easeInOut(L.k); cam([4 + k * 4, 9, 40 - k * 4], [22, 3, 10 - k * 14], 50); sh(V(20, 0, 14), 40); }, [[0, 'swipe', .3], [.3, 'murmur', .5]]);
// 41 «Mein Nachbar sagt, er hat nur eine Allergie»: Herr Pfeiffer, cargado de cajas, finge un estornudo
shot(61.90, 'W', null, L => { town('night'); const c = put(pfeif, 20.6, 0, 22, PI / 2 - .5); const sn = clamp((L.lt - .9) / .2); actuar(c, L.lt, [[0, { aLx: 1.3, aRx: 1.3, aLe: 1.2, aRe: 1.2, aLz: -.2, aRz: -.2 }], [.7, { headX: -.35, lean: -.15 }, { dur: .2 }], [1.0, { headX: .45, lean: .25 }, { dur: .1 }]], { T: L.T }); num(c, 0, 1); cara(c, L.T, { expr: L.lt > .7 ? 'yawn' : 'smile' });
  { const t = loc(c, 0, .9, 1.6); show(TBOX[0], t.x, t.y, t.z, PI / 2 - .5); const u = loc(c, 1.8, 2.0, .4); show(TBOX[1], u.x, u.y, u.z, PI / 2 - .5, .8); }
  onFace(c, 12, -1.8, -.8, 44, L.k, 11); sh(V(20, 0, 22), 20); }, [[0, 'swipe', .3], [.75, 'inhale', .5], [1.0, 'fake_sneeze', .6]]);
// 42 «Der Mann hat seit fünfzehn Jahren nicht mal geniest»: yo pongo los ojos en blanco detrás de él; cartel 15 JAHRE
shot(63.86, 'Z', 'punch', L => { town('night'); const c = put(pfeif, 20.6, 0, 22, PI / 2 - .5); actuar(c, L.lt, [[0, { aLx: 1.3, aRx: 1.3, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); num(c, 0, 1); grin(c, L.T); { const t = loc(c, 0, .9, 1.6); show(TBOX[0], t.x, t.y, t.z, PI / 2 - .5); const u = loc(c, 1.8, 2.0, .4); show(TBOX[1], u.x, u.y, u.z, PI / 2 - .5, .8); }
  const me = put(ich, 23.6, 0, 17.6, -.4); actuar(me, L.lt, [[0, 'cross']], { T: L.T }); num(me, 0, 1); cara(me, L.T, { eyes: 'up', mouth: 'flat' });
  badge('green', '15 JAHRE', W / 2, H * .15, (L.lt - .1) * 3, 1, .8); badge('tag', 'KEIN NIESER', W / 2, H * .23, (L.lt - .3) * 3, 1, .8);
  orb(L.k, V(22, 3.4, 20), null, [15, .55, .12, 46], [13.5, .45, .12, 46]); sh(V(22, 0, 20), 20); }, [[0, 'impact_soft', .4], [.4, 'hmm', .4]]);

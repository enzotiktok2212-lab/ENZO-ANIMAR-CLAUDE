// ---------- b: pañuelos con carné, Tresor, gorros prohibidos, teclear rápido, Tante Helga, el alcalde y los drones (15,65 – 39,6 s) ----------
const HAT = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0x2a6ad8, { roughness: 1 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.85, 20, 12, 0, 6.283, 0, 1.6), m); c.scale.set(1, 1.05, 1); g.add(c); cyl(.88, .88, .35, mat(0xf4f4f4, { roughness: 1 }), 20, g, 0, .05, 0); sphere(.32, mat(0xf4f4f4, { roughness: 1 }), g, 0, .95, 0, 10, 8); outline(g, 1.4); return g; })();
PROPS.push(HAT);
// 12 «Taschentücher gibt's in der Apotheke»: una clienta enseña el carné; la farmacéutica lo escanea con cara de sospecha
shot(15.65, 'W', null, L => { use('AP'); inside(1.0, 50); const a = put(apo, APX - 4, 0, -4.4, .35); actuar(a, L.lt, [[0, { aRx: 1.2, aRe: .6, aRz: -.2, headX: .2 }], [.6, { aRx: .9, aRe: 1.4, headX: .1, headY: .3 }, { dur: .3 }]], { T: L.T }); num(a, 0, 1); cara(a, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' });
  const c = put(XT[3], APX - 6.4, 0, 2.6, PI - .45); actuar(c, L.lt, [[0, { aRx: 1.5, aRe: .3, lean: .12 }]], { T: L.T }); num(c, 0, 1); cara(c, L.T, { expr: 'worried' }); attach(PHONE, c.aR.hand, [0, -.6, .3], [-PI / 2, 0, 0], .9);
  AP.SCR.material.emissive.setHex(L.lt > .9 ? 0x3aff6a : 0x3ad8ff);
  orb(L.k, V(APX - 2.8, 4.6, -.8), null, [16, .55, .14, 46], [14.5, .45, .12, 46]); sh(V(APX - 4, 0, 0), 20); }, [[0, 'swipe', .4], [.3, 'scan', .5], [.9, 'pling', .5]]);
// 13 «nur gegen Ausweis»: la farmacéutica le da UN solo pañuelo con pinzas; la clienta lo mira decepcionada
shot(17.37, 'C', 'punch', L => { use('AP'); inside(1.0, 50); const a = put(apo, APX + 1, 0, -4.4, -.1); actuar(a, L.lt, [[0, { aRx: 2.6, aRe: .3, aRz: .2, lean: .05 }]], { T: L.T }); num(a, 0, 1); cara(a, L.T, { expr: 'smug' });
  const t = loc(a, 1.4, 6.4, 1.2); BALLS.slice(0, 1).forEach(b => show(b, t.x, t.y, t.z, L.T, 1));
  badge('tag', 'AUSWEIS?', W / 2, H * .19, (L.lt - .15) * 3); onFace(a, 10, 1.0, -1.2, 42, L.k, 9); sh(V(APX + 1, 0, -2), 20); }, [[0, 'impact_soft', .4], [.4, 'paper', .5]]);
// 14 «im Drogeriemarkt»: pasillo rosa de la droguería; al fondo, el Tresor con su volante dorado
shot(18.43, 'S', null, L => { use('DR'); inside(1.0, 45); const e = put(K[5], DRX + 5.4, 0, -9.6, -PI / 2 - .5); actuar(e, L.lt, [[0, { aLx: 1.6, aRx: 1.6, aLe: .5, aRe: .5, lean: .1 }]], { T: L.T }); num(e, 0, 1); cara(e, L.T, { expr: 'determined' }); DR.wheel.rotation.z = L.T * 3;
  walkC(XT[0], L.lt, DRX - 7, 0, PI - .5, 2.2, L.T); num(XT[0], 0, 1); cara(XT[0], L.T, { expr: 'neutral' });
  cm([DRX - 3, 6, 18, DRX, 6.5, -12, 46], [DRX - 1, 6, 12, DRX, 6.5, -12, 44], L.k); sh(V(DRX, 0, -8), 30); }, [[0, 'whoosh_soft', .4], [.2, 'ratchet', .5], [.6, 'gears', .4]]);
// 15 «sind sie im Tresor eingeschlossen»: la puerta blindada se abre: detrás de barrotes, las cajas de pañuelos
shot(19.59, 'Z', 'slow', L => { use('DR'); inside(1.0, 45); DR.DOOR.rotation.y = -easeOut(clamp(L.lt / 1.0)) * 1.7; DR.wheel.rotation.z = L.T * 4;
  const e = put(K[5], DRX + 6, 0, -9.4, -PI / 2 - .3); actuar(e, L.lt, [[0, { aLx: 1.4, aLe: .6, aLz: .3 }], [.6, 'shock']], { T: L.T }); num(e, 0, 1); cara(e, L.T, { expr: 'gasp' });
  cm([DRX + .5, 7, 4, DRX, 6.4, -14, 46], [DRX + .3, 6.8, 0, DRX, 6.4, -14, 42], L.k, easeIn); sh(V(DRX, 0, -12), 20); }, [[.05, 'metal_creak', .6], [.4, 'gears', .4]]);
// 16 «Mützen sind verboten»: un policía le arranca el gorro a un chico: debajo asoma su 2
shot(20.78, 'R', 'punch', L => { town(); const c = put(K[6], 6, 0, -30, .3); const off = clamp((L.lt - .35) / .25);
  if (off < 1) { attach(HAT, c.head, [0, 1.2, 0], [0, 0, 0], 1); } else { const w = loc(COP[1], 1.6, 6.4, 1); show(HAT, w.x, w.y, w.z, L.T * 4, .9); num(c, 2, (L.lt - .6) * 4); }
  actuar(c, L.lt, [[0, 'idle'], [.6, 'hands_head', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: off >= 1 ? 'shock' : 'worried' });
  const p = put(COP[1], 9.4, 0, -28.8, -PI / 2 - .5); actuar(p, L.lt, [[0, { aRx: 1.6, aRe: .3, lean: .1 }], [.35, { aRx: 2.8, aRz: .3, aRe: .1, lean: -.1 }, { dur: .2 }]], { T: L.T }); cara(p, L.T, { expr: 'angry' });
  orb(L.k, V(7.6, 3.8, -29.4), null, [15, .1, .1, 46], [13.5, .05, .1, 46]); sh(V(7, 0, -29), 30); }, [[0, 'whirl', .3], [.35, 'cloth', .6], [.62, 'pling', .5], [.7, 'gasp_f', .4]]);
// 17 «Wer zu schnell tippt»: un chico en un banco teclea a toda velocidad en el móvil
shot(22.16, 'W', null, L => { town(); const c = put(K[1], -18, 1.5, -15.6, 0); applyPose(c, { lLx: 1.5, rLx: 1.5, lLk: 1.5, lRx: 1.5, lRk: 1.5, hipY: 1.55, aLx: 1.0, aRx: 1.0, aLz: -.25, aRz: -.25, aLe: 1.4 + Math.sin(L.T * 40) * .12, aRe: 1.4 + Math.sin(L.T * 40 + 1) * .12, headX: .4 }); c.root.position.y = .7; num(c, 0, 1);
  const w = loc(c, 0, 2.4, 1.5); show(PHONE, w.x, w.y, w.z, 0, .55); PHONE.rotation.set(-.9, 0, 0); cara(c, L.T, { expr: 'determined', eyes: 'down', mouth: 'grimace' });
  orb(L.k, V(-18, 3.4, -15.6), null, [11, .35, .16, 44], [10, .2, .14, 44]); sh(V(-18, 0, -15), 20); }, [[0, 'swipe', .3], [.05, 'typing', .6], [.5, 'typing', .5]]);
// 18 «wird verdächtigt»: dos policías y un dron le rodean; él se queda congelado con el móvil
shot(23.10, 'F', 'punch', L => { town(); const c = put(K[1], -18, 1.5, -15.6, 0); applyPose(c, { lLx: 1.5, rLx: 1.5, lLk: 1.5, lRx: 1.5, lRk: 1.5, hipY: 1.55, aLx: 1.2, aRx: 1.2, aLe: 1.4, aRe: 1.4, headX: -.1, ...shiver(L.T, 1) }); c.root.position.y = .7; num(c, 0, 1); cara(c, L.T, { expr: 'scared' }); sweat(c, L.T, 2);
  const w = loc(c, 0, 2.4, 1.5); show(PHONE, w.x, w.y, w.z, 0, .55); PHONE.rotation.set(-.9, 0, 0);
  [[COP[0], -22.6, -10.6], [COP[3], -13.4, -10.6]].forEach(([p, x, z], i) => { put(p, x, 0, z, faceTo(V(x, 0, z), V(-18, 0, -15.6))); actuar(p, L.lt, [[0, i ? 'point_l' : 'cross']], { T: L.T + i }); num(p, 0, 1); cara(p, L.T, { expr: 'sus' }); });
  const d = DRONES[0]; show(d, -18, 11.5, -15); d.userData.spin(L.T); d.userData.beam(true, 10);
  badge('red', 'VERDÄCHTIG!', W / 2, H * .17, (L.lt - .15) * 3, 1, .7); orb(L.k, V(-18, 4.6, -13), null, [17, .1, .14, 48], [15.5, 0, .14, 48]); sh(V(-18, 0, -13), 30); }, [[0, 'flash', .4], [.1, 'drone', .5], [.3, 'siren_short', .4]]);
// 19 «Gestern wurde Tante Helga abgeführt»: dos policías sacan a Helga de la panadería en volandas; ella patalea, enharinada
shot(23.95, 'S', null, L => { town(); const x = -52 + L.lt * 3.2; const h = put(helga, x, .8, 12, PI / 2); applyPose(h, { aLx: 1.2, aRx: 1.2, aLz: .9, aRz: .9, lLx: Math.sin(L.T * 14) * .5 + .3, lRx: -Math.sin(L.T * 14) * .5 + .3, lLk: .6, lRk: .6, headX: -.1 }); num(h, 1, 1); cara(h, L.T, { expr: 'furious', eyes: 'angry', mouth: 'scream' });
  [[COP[2], -2.6], [COP[0], 2.6]].forEach(([c, s], i) => { caminar(c, L.lt, { x: -52 + 1, z: 12 + s, ry: PI / 2, speed: 3.2, accel: .01, T: L.T + i, extra: { [s < 0 ? 'aRx' : 'aLx']: 1.3, [s < 0 ? 'aRz' : 'aLz']: -.4 } }); cara(c, L.T, { expr: 'determined' }); });
  dust(V(x, 2, 12), Math.floor(L.T * 3) / 3, L.T, 5, .4); orb(L.k, V(x + 1, 3.6, 12), null, [17, PI / 2 + .45, .12, 46], [15.5, PI / 2 + .35, .12, 46]); sh(V(x, 0, 12), 30); }, [[0, 'whoosh_soft', .4], [.1, 'shout_f', .5], [.6, 'steps', .4], [1.2, 'shout_f', .4]]);
// 20 «weil sie Pizzateig zu schnell geknetet hat»: dentro de la panadería, Helga amasa a velocidad de vértigo; vuela la harina
shot(25.81, 'W', null, L => { use('BK'); inside(1.0, 50); const h = put(helga, BKX, .8, -4.4, 0); const s = Math.sin(L.T * 34); applyPose(h, { aLx: 1.2 + s * .25, aRx: 1.2 - s * .25, aLe: .9 - s * .3, aRe: .9 + s * .3, aLz: -.3, aRz: -.3, lean: .28, headX: .3, crouch: .1 }); num(h, 0, 1); cara(h, L.T, { expr: 'determined', eyes: 'squint', mouth: 'grimace' }); sweat(h, L.T, 2);
  show(DOUGH, BKX, 3.4, -2.2, Math.sin(L.T * 20) * .3); DOUGH.scale.set(1.0 + s * .15, .35 - s * .05, .8); dust(V(BKX, 3.6, -2.4), Math.floor(L.T * 5) / 5, L.T, 8, .35);
  { const c = hp(h); cm([c.x - 3, c.y + 3.2, c.z + 10, c.x, c.y - 1.0, c.z, 46], [c.x - 2.2, c.y + 2.8, c.z + 8.4, c.x, c.y - 1.0, c.z, 44], L.k); } sh(V(BKX, 0, -3), 20); }, [[0, 'swipe', .4], [.05, 'dough', .6], [.4, 'dough', .6], [.8, 'dough', .5]]);
// 21 «und über ihr plötzlich eine Eins stand»: ¡pling! le salta un 1 rojo; Helga se queda blanca con las manos en la masa
shot(27.63, 'Z', 'slow', L => { use('BK'); inside(1.0, 50); const h = put(helga, BKX, .8, -4.4, 0); applyPose(h, { aLx: 1.0, aRx: 1.0, aLe: .9, aRe: .9, aLz: -.3, aRz: -.3, lean: -.05, headX: -.25 }); num(h, L.lt > .55 ? 1 : 0, L.lt > .55 ? (L.lt - .55) * 4 : 1); cara(h, L.T, { expr: L.lt > .55 ? 'shock' : 'neutral', eyes: L.lt > .55 ? 'wide' : 'normal', mouth: L.lt > .55 ? 'o' : 'flat' });
  show(DOUGH, BKX, 3.4, -2.2); DOUGH.scale.set(1.0, .35, .8);
  { const c = hp(h); cm([c.x + 1.2, c.y + 2.6, c.z + 10, c.x, c.y - .2, c.z, 44], [c.x + .6, c.y + 2.2, c.z + 7.6, c.x, c.y - .2, c.z, 40], L.k, easeIn); } sh(V(BKX, 0, -4), 20); }, [[.55, 'pling', .7], [.6, 'gasp_f', .5]]);
// 22 «Nur unser Bürgermeister trägt immer eine leuchtende Null»: el alcalde saluda desde el balcón del Rathaus con su 0 dorado
shot(29.71, 'W', null, L => { town(); const m = put(mayor, -6, 10.8, -82.2, 0); actuar(m, L.lt, [[0, 'wave']], { T: L.T }); num(m, 0, 1, 'gold'); grin(m, L.T);
  [K[0], XT[1], K[4], XT[3], K[7], XT[0]].forEach((c, i) => { put(c, (i % 2 ? 1 : -1) * (9 + (i >> 1) * 3) - 6, 0, -68 + (i >> 1) * 2, PI + (i % 2 ? .3 : -.3)); actuar(c, L.lt, [[0, 'cheer']], { T: L.T + i }); num(c, 0, 1); });
  cm([-6, 9, -56, -6, 13.2, -82, 46], [-6, 10, -62, -6, 13.4, -82, 44], L.k); sh(V(-6, 0, -74), 40); }, [[0, 'swipe', .4], [.2, 'cheer', .5], [.8, 'clap', .4]]);
// 23 «Er sagt, er ist das sauberste Vorbild»: primer plano: saca brillo a su 0 con un pañuelito y guiña
shot(32.71, 'C', 'punch', L => { town(); const m = put(mayor, -6, 10.8, -82.2, 0); actuar(m, L.lt, [[0, { aRx: 2.8, aRz: .2, aRe: 1.2 + Math.sin(L.T * 16) * .3, headX: -.1 }]], { T: L.T }); num(m, 0, 1, 'gold'); talk(m, L.T, 32.71, 35.72, 'smug', { eyes: L.lt > 1.5 ? 'wink' : 'half' });
  const w = loc(m, 1.4, 7.6, .3); show(BALLS[0], w.x, w.y, w.z, 0, .5); badge('gold', 'VORBILD', W / 2, H * .25, (L.lt - 1.2) * 3, 1, .8);
  onFace(m, 11.5, -.6, .9, 42, L.k, 10); sh(V(-6, 0, -80), 20); }, [[0, 'impact_soft', .4], [.3, 'sparkle', .6], [1.6, 'ding_soft', .5]]);
// 24 «Und nachts fliegen Polizeidrohnen über die Dächer»: de noche, tres drones sobrevuelan los tejados con sus focos
shot(35.72, 'F', null, L => { town('night'); DRONES.forEach((d, i) => { show(d, -50 + i * 18 + L.lt * 4, 36 + Math.sin(L.T * 2 + i) * 1.5, 30 - i * 26); d.userData.spin(L.T + i); d.userData.beam(true, 30); });
  const k = easeInOut(L.k); cam([-10 + k * 6, 30 + k * 4, 48], [-40, 26, -10], 50); sh(V(-40, 0, 0), 70); }, [[0, 'flash', .3], [.1, 'drone', .7], [1.0, 'drone', .5]]);
// 25 «und scannen jeden Kopf»: en un dormitorio, el foco del dron entra por la ventana; la que duerme se despierta y le sale su 0
shot(37.96, 'W', null, L => { use('ZM'); inside(.4, 10); DARK = .1; const c = put(XT[0], ZMX + 14, 3.4, -4, 0); c.root.rotation.set(-PI / 2, 0, 0); applyPose(c, { aLx: .2, aRx: .2 }); const aw = L.lt > .4; cara(c, L.T, { eyes: aw ? 'wide' : 'closed', mouth: aw ? 'o' : 'flat' }); if (aw) num(c, 0, (L.lt - .45) * 4);
  SPOTL.intensity = 120; SPOTL.position.set(ZMX + 18, 14, -6); SPOTL.target.position.set(ZMX + 14, 3, -6);
  orb(L.k, V(ZMX + 14, 4.2, -5), null, [11, .35, .5, 46], [10, .3, .5, 46]); sh(V(ZMX + 14, 0, -5), 20); }, [[0, 'swipe', .3], [.2, 'scan', .6], [.45, 'gasp_f', .4]]);

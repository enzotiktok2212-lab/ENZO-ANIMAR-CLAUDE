// ---------- d: sigo al carrito, el sótano del Rathaus, el número del alcalde, la redada y el final (66,5 s – fin) ----------
const FSIGN = (() => { const g = new THREE.Group(); scene.add(g); cyl(.2, .2, 9, mat(0x5a5e68), 8, g, 0, 4.5, 0); const s = textPlane(7, 1.8, 420, 108, (c, w, h) => { c.fillStyle = '#f2c23a'; c.beginPath(); c.moveTo(0, 0); c.lineTo(w - 50, 0); c.lineTo(w, h / 2); c.lineTo(w - 50, h); c.lineTo(0, h); c.fill(); txt(c, 'FABRIK', w / 2 - 20, h / 2 + 4, 70, '#1a1a1a'); }); s.position.set(3, 7.8, .2); g.add(s); outline(g, 1.2); return g; })();
const GDOOR = (() => { const g = new THREE.Group(); scene.add(g); box(.6, 11, 13, mat(0x8a8e96, { metalness: .5, roughness: .4 }), .05, g, 0, 5.5, 0); const d = new THREE.Group(); g.add(d); for (let k = 0; k < 8; k++) box(.4, 1.2, 12, mat(0x5a5e68, { metalness: .6 }), .05, d, .4, .7 + k * 1.25, 0); g.userData.d = d; outline(g, 1.2); return g; })();
const STAMP = (() => { const p = textPlane(26, 5, 1040, 200, (c, w, h) => { c.fillStyle = '#d8323a'; c.fillRect(0, 20, w, h - 40); txt(c, 'ABGESCHAFFT', w / 2, h / 2 + 6, 140, '#ffffff'); }, .6); scene.add(p); return p; })();
const WURST = Array.from({ length: 2 }, () => { const w = cyl(.22, .22, 1.6, mat(0xb8582a, { roughness: .5 }), 10, scene, 0, 0, 0); outline(w, 1); return w; });
PROPS.push(FSIGN, GDOOR, STAMP, ...WURST);
const ride = (ch, lt, x, z, ry, sp, T) => { const d = sp * lt; const px = x + Math.sin(ry) * d, pz = z + Math.cos(ry) * d; put(ch, px, .6, pz, ry); show(ROLLER, px, 0, pz, ry); applyPose(ch, { aLx: 1.3, aRx: 1.3, aLz: -.25, aRz: -.25, aLe: .5, aRe: .5, lean: .22, lLx: .25, lLk: .2, lRx: -.5 + Math.sin(T * 6) * .5, lRk: .4, headX: -.1 }); return V(px, 0, pz); };
// 43 «Ich wollte wissen, wem dieser Wagen gehört»: yo en la ventana de mi casa, de noche, mirando el carrito
shot(66.50, 'W', null, L => { town('night'); HB.HL.intensity = 30; HB.CURT.forEach(c => c.position.x = (c.userData.s < 0 ? -6.6 : -1.4) + c.userData.s * 2.6); const me = put(ich, 8.6, 1.5, 100, PI / 2); actuar(me, L.lt, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.6, aRe: 1.6, lean: .12 }]], { T: L.T }); num(me, 0, 1); cara(me, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' });
  show(WAGEN, 26, 0, 106 - L.lt * 3, PI);
  orb(L.k, V(10, 4.6, 100), null, [12, PI / 2 + .3, .05, 44], [10.5, PI / 2 + .2, .05, 42]); sh(V(10, 0, 100), 20); }, [[0, 'swipe', .3], [.3, 'engine', .4], [.8, 'hmm', .4]]);
// 44 «Papa hat gesagt, nachts bleibe ich im Bett»: Papa me arropa y me señala con el dedo
shot(68.64, 'R', null, L => { use('ZM'); inside(.6, 25); const me = put(ich, ZMX + 12.6, 3.2, -9.2, -.3); applyPose(me, { lLx: 1.5, rLx: 1.5, lRx: 1.5, hipY: 1.55, aLx: .5, aRx: .5, aLe: .8, aRe: .8, headY: -.5, lean: -.1 }); me.root.position.y = 2.2; cara(me, L.T, { expr: 'worried', eyes: 'side_l' });
  const p = put(papa, ZMX + 7.6, 0, -6.6, PI / 2 - .1); actuar(p, L.lt, [[0, { aRx: 2.0, aRz: -.2, aRe: .6 + Math.sin(L.T * 10) * .2, lean: .1 }]], { T: L.T }); num(p, 0, 1); talk(p, L.T, 68.64, 70.8, 'angry');
  badge('red', 'IM BETT!', W / 2, H * .3, (L.lt - .4) * 3, 1, .85); cm([ZMX + 10.2, 9, 11, ZMX + 10.2, 4.6, -8, 48], [ZMX + 10.2, 8.6, 9.4, ZMX + 10.2, 4.6, -8, 46], L.k); sh(V(ZMX + 11, 0, -6), 20); }, [[0, 'whirl', .3], [.3, 'hmm', .4]]);
// 45 «Doch mein Roller lag schon versteckt hinter der Hecke»: salgo a hurtadillas y saco el patinete de detrás del seto
shot(70.80, 'S', null, L => { town('night'); show(ROLLER, 17, 0, 106, PI / 2 + L.lt * .4); const me = put(ich, 15.4, 0, 104, PI / 2 + .5); actuar(me, L.lt, [[0, 'sneak'], [.7, { aRx: 1.4, aRe: .3, lean: .3, crouch: .3 }, { dur: .3 }]], { T: L.T }); num(me, 0, 1); cara(me, L.T, { expr: 'smug', eyes: 'side_r', mouth: 'smirk' });
  orb(L.k, V(16, 2.4, 105), null, [12, PI / 2 + .9, .2, 44], [11, PI / 2 + .75, .18, 44]); sh(V(16, 0, 105), 20); }, [[0, 'whoosh_soft', .3], [.2, 'leaves', .5], [.8, 'click_set', .4]]);
// 46 «Ich fuhr ihm hinterher»: en patinete detrás del carrito por la calle oscura
shot(73.06, 'Z', null, L => { town('night'); const p = ride(ich, L.lt, 26, 60, PI, 9, L.T); show(WAGEN, 26, 0, p.z - 22, PI); num(ich, 0, 1); cara(ich, L.T, { expr: 'determined' });
  cam([p.x + 4, 3.2, p.z + 9], [p.x, 2.6, p.z - 4], 50); sh(V(p.x, 0, p.z - 8), 40); }, [[0, 'zoom_in', .3], [.05, 'wheels', .6], [.4, 'engine', .3]]);
// 47 «über die Brücke»: cruzo el puente de piedra con las farolas encendidas
shot(74.19, 'W', null, L => { use('BR'); night(40); const p = ride(ich, L.lt, BRX - 14, -1.6, PI / 2, 10, L.T); ich.root.position.y = 2.55; ROLLER.position.y = 1.95; num(ich, 0, 1); cara(ich, L.T, { expr: 'determined' }); show(WAGEN, p.x + 20, 1.95, 1.6, PI / 2);
  cm([p.x - 12, 6.6, -1.2, p.x + 6, 3.2, -1.6, 50], [p.x - 11.4, 6.4, -1.2, p.x + 7, 3.2, -1.6, 50], L.k); sh(V(p.x, 0, 0), 30); }, [[0, 'swipe', .3], [.05, 'wheels', .5], [.4, 'water', .4]]);
// 48 «am Bahnhof vorbei»: paso por delante del Bahnhof iluminado
shot(75.02, 'S', null, L => { use('BR'); night(40); const p = ride(ich, L.lt, BRX + 60, 0, PI / 2, 11, L.T); num(ich, 0, 1); cara(ich, L.T, { expr: 'determined' });
  cm([p.x + 4, 4.4, 17, p.x + 2, 3.6, -2, 50], [p.x + 6, 4.4, 16, p.x + 4, 3.6, -2, 50], L.k); sh(V(p.x, 0, -8), 40); }, [[0, 'whoosh_soft', .3], [.2, 'train_bell', .5], [.6, 'wheels', .4]]);
// 49 «an den Polizisten vorbei, die gerade Bratwurst aßen»: dos policías comiendo bratwurst junto al coche; paso detrás sin que me vean
shot(76.03, 'F', null, L => { town('night'); show(PCAR[0], 36, 0, 140, 0); PCAR[0].userData.set(L.T); [[COP[1], 33, 135, -1.0], [COP[3], 37, 134, -.3]].forEach(([c, x, z, ry], i) => { put(c, x, 0, z, ry); actuar(c, L.lt, [[0, { aRx: 2.3, aRz: -.4, aRe: 2.3 + Math.sin(L.T * 8 + i) * .2, headX: .1 }]], { T: L.T + i }); num(c, 0, 1); cara(c, L.T + i, { eyes: 'happy', mouth: Math.sin(L.T * 9 + i) > 0 ? 'o' : 'smile' }); const w = loc(c, 1.2, 4.6, 1.2); show(WURST[i], w.x, w.y, w.z); WURST[i].rotation.set(.3, 0, 1.2); });
  const p = ride(ich, L.lt, 26, 126, 0, 9, L.T); num(ich, 0, 1); cara(ich, L.T, { expr: 'scared', eyes: 'side_r' });
  cam([19 + L.k * 2, 5, 128], [33, 3.4, 135], 48); sh(V(32, 0, 134), 30); }, [[0, 'flash', .3], [.1, 'chew', .6], [.6, 'wheels', .4], [1.2, 'laugh_m', .3]]);
// 50 «Er fuhr nicht in die Fabrik»: el carrito pasa de largo junto al cartel FABRIK
shot(78.68, 'W', null, L => { town('night'); show(FSIGN, 33, 0, 160, PI / 2); const z = 150 - L.lt * 10; show(WAGEN, 26, 0, z, PI);
  cm([40, 5, 175, 30, 5, 158, 46], [38, 5, 171, 28, 5, 156, 46], L.k); sh(V(30, 0, 158), 30); }, [[0, 'swipe', .3], [.05, 'engine', .5]]);
// 51 «Er fuhr direkt in den Keller vom Rathaus»: el portón lateral del Rathaus se abre y el carrito se mete; yo me escondo tras un árbol
shot(79.94, 'Z', 'slow', L => { town('night'); show(GDOOR, 14.8, 0, -92); GDOOR.userData.d.position.y = easeOut(clamp(L.lt / .6)) * 9; const x = lerp(40, 22, easeOut(clamp(L.lt / 2))); show(WAGEN, x, 0, -92, -PI / 2);
  const me = put(ich, 34, 0, -66, -PI / 2 - 1.2); actuar(me, L.lt, [[0, 'sneak']], { T: L.T }); num(me, 0, 1); cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  cm([30, 6, -50, 22, 4, -86, 46], [29, 6, -55, 22, 4, -86, 44], L.k); sh(V(24, 0, -84), 40); }, [[.05, 'metal_creak', .6], [.3, 'engine', .4]]);
// 52 «Da unten stapelten sich Kartons voller Taschentücher, bis an die Decke»: grúa por la montaña de cajas hasta el techo
shot(82.12, 'W', null, L => { use('KE'); inside(.8, 30); const k = easeInOut(L.k); cam([KEX + 6, 3 + k * 10, 14 - k * 2], [KEX - 8, 4 + k * 10, -6], 52); sh(V(KEX - 8, 0, -6), 30); }, [[0, 'swipe', .3], [.2, 'ambience_low', .5], [1.5, 'creak', .3]]);
// 53 «An der Wand hing das Plakat»: el cartel GOONEN VERBOTEN en la pared del sótano
shot(86.32, 'F', null, L => { use('KE'); inside(.8, 40); cm([KEX + 3, 9, -6, KEX + 4, 9, -19.7, 48], [KEX + 4, 9.4, -9, KEX + 4, 9.2, -19.7, 44], L.k); sh(V(KEX + 4, 0, -16), 20); }, [[0, 'flash', .3], [.3, 'paper', .5]]);
// 54 «mit seiner Unterschrift»: primer plano de la firma, que se ilumina
shot(88.84, 'Z', 'punch', L => { use('KE'); inside(.8, 40); cm([KEX + 4, 6.6, -14.6, KEX + 4, 6.2, -19.7, 40], [KEX + 4.2, 6.4, -15.6, KEX + 4.2, 6.2, -19.7, 38], L.k); badge('gold', 'SAUBERMANN', W / 2, H * .17, (L.lt - .3) * 3, 1, .7); sh(V(KEX + 14, 0, -16), 20); }, [[0, 'impact_soft', .4], [.3, 'pencil', .5]]);
// 55 «Und mittendrin saß der Bürgermeister und bündelte Geldscheine»: el alcalde en su mesa haciendo fajos, con sonrisa de oreja a oreja
const desk = L => { const m = put(mayor, KEX + 9, 0, -4.6, 0); return m; };
shot(90.20, 'W', null, L => { use('KE'); inside(.8, 40); const m = desk(L); actuar(m, L.lt, [[0, { aLx: 1.2, aRx: 1.2, aLe: .9 + Math.sin(L.T * 9) * .2, aRe: .9 - Math.sin(L.T * 9) * .2, aLz: -.3, aRz: -.3, lean: .25, headX: .3 }]], { T: L.T }); num(m, 0, 1, 'gold'); grin(m, L.T);
  orb(L.k, V(KEX + 9, 4.6, -3.6), null, [15, -.35, .2, 46], [13.5, -.25, .18, 46]); sh(V(KEX + 9, 0, -3), 20); }, [[0, 'swipe', .3], [.2, 'cash', .5], [.8, 'paper', .4]]);
// 56 «Er hatte das Gesetz nur erfunden»: risa malvada del alcalde, primer plano
shot(93.61, 'C', 'punch', L => { use('KE'); inside(.8, 40); const m = desk(L); actuar(m, L.lt, [[0, { aLx: 1.6, aRx: 1.6, aLz: .5, aRz: .5, aLe: 1.6, aRe: 1.6, lean: -.15, headX: -.25 }]], { T: L.T }); num(m, 0, 1, 'gold'); laughF(m, L.T);
  badge('red', 'ERFUNDEN!', W / 2, H * .3, (L.lt - .2) * 3, 1, .85); onFace(m, 10, -1.2, .6, 42, L.k, 9); sh(V(KEX + 9, 0, -4), 20); }, [[0, 'impact', .4], [.2, 'evil_laugh', .7]]);
// 57 «damit er als Einziger Taschentücher verkaufen kann»: Willi descarga cajas del carrito y le da al alcalde un fajo de billetes
shot(95.35, 'R', null, L => { use('KE'); inside(.8, 40); show(WAGEN, KEX + 18, 0, 13, PI / 2); const w = put(willi, KEX + 12, 0, 2, -PI / 2 + .3); actuar(w, L.lt, [[0, { aLx: 1.5, aRx: 1.5, aLe: .5, aRe: .5, lean: .1 }]], { T: L.T }); num(w, 0, 1); grin(w, L.T); const t = loc(w, 0, 2.2, 1.8); show(TBOX[0], t.x, t.y, t.z, -PI / 2 + .3);
  const m = put(mayor, KEX + 8.6, 0, -1, -.9 + PI / 2); actuar(m, L.lt, [[0, 'cheer']], { T: L.T }); num(m, 0, 1, 'gold'); grin(m, L.T);
  orb(L.k, V(KEX + 10.4, 4, .4), null, [17, -.5, .12, 46], [15.5, -.6, .12, 46]); sh(V(KEX + 10, 0, 0), 20); }, [[0, 'whirl', .3], [.3, 'box_drop', .5], [1.0, 'cash', .5]]);
// 58 «Ich wollte ihn filmen»: escondido tras las cajas, saco el móvil y le grabo
shot(97.89, 'W', null, L => { use('KE'); inside(.8, 40); const m = desk(L); actuar(m, L.lt, [[0, { aLx: 1.2, aRx: 1.2, aLe: .9, aRe: .9, lean: .25, headX: .3 }]], { T: L.T }); num(m, 0, 1, 'gold'); grin(m, L.T);
  const me = put(ich, KEX + 1.6, 0, 3.6, PI / 2 + .7); actuar(me, L.lt, [[0, 'sneak'], [.2, { aRx: 1.9, aRe: .5, aRz: -.1, crouch: .4, lean: .3 }, { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'determined', eyes: 'squint' }); const ph = loc(me, .4, 3.6, 2.4); show(PHONE2, ph.x, ph.y, ph.z, PI / 2 + .7);
  cm([KEX - 4.6, 6, 10.6, KEX + 6, 3.4, -1, 46], [KEX - 4, 5.8, 9.6, KEX + 6, 3.4, -1, 44], L.k); sh(V(KEX + 4, 0, 0), 20); }, [[0, 'swipe', .3], [.4, 'camera_beep', .6]]);
// 59 «Doch dann sah ich, wie er die Scheine durchblätterte»: primer plano de las manos pasando billetes a toda velocidad
shot(98.96, 'Z', null, L => { use('KE'); inside(.8, 40); const m = desk(L); actuar(m, L.lt, [[0, { aLx: 1.0, aRx: 1.4, aLe: 1.2, aRe: .7 + Math.sin(L.T * 26) * .3, lean: .1, headX: .12 }]], { T: L.T }); num(m, 0, 1, 'gold'); cara(m, L.T, { expr: 'joy' });
  CASH.forEach((c, i) => { const k = (L.T * 3 + i / 12) % 1; const w = loc(m, -.4 + k * 1.6, 3.4 + Math.sin(k * PI) * .8, 2.2); show(c, w.x, w.y, w.z, k * 3); c.rotation.x = k * 4; });
  cm([KEX + 9.6, 5.2, 5.4, KEX + 9, 4.0, -2, 44], [KEX + 9.4, 5.0, 4.4, KEX + 9, 4.0, -2, 42], L.k); sh(V(KEX + 9, 0, -2), 20); }, [[0, 'zoom_in', .3], [.1, 'paper', .5], [.5, 'paper', .5], [.9, 'paper', .5]]);
// 60-63 «Immer schneller. Hundert. Zweihundert. Dreihundert.»: cortes rápidos con el contador
const flip = (L, n, ang) => { use('KE'); inside(.8, 40); const m = desk(L); actuar(m, 0, [[0, { aLx: 1.0, aRx: 1.4, aLe: 1.2, aRe: .7 + Math.sin(L.T * 40) * .35, lean: .1, headX: .12 }]], { T: L.T }); num(m, 0, 1, 'gold'); cara(m, L.T, { expr: 'joy' }); sweat(m, L.T, n > 1 ? 1 : 0);
  CASH.forEach((c, i) => { const k = (L.T * 5 + i / 12) % 1; const w = loc(m, -.4 + k * 1.6, 3.4 + Math.sin(k * PI) * .9, 2.2); show(c, w.x, w.y, w.z, k * 4); c.rotation.x = k * 5; });
  if (n) badge('gold', String(n), W / 2, H * .17, L.lt * 4, 1, 1.1); orb(L.k, V(KEX + 9, 5.4, -2.6), null, [9.5, ang, .2, 42], [8.6, ang + .1, .2, 40]); sh(V(KEX + 9, 0, -2), 20); };
shot(101.29, 'W', null, L => flip(L, 0, -.5), [[0, 'whoosh', .3], [.1, 'paper', .5]]);
shot(101.85, 'C', 'punch', L => flip(L, 100, .4), [[0, 'impact_soft', .4], [.05, 'ding_soft', .5]]);
shot(102.70, 'C', 'punch', L => flip(L, 200, -.2), [[0, 'impact_soft', .4], [.05, 'ding_soft', .55]]);
shot(103.62, 'C', 'punch', L => flip(L, 300, .15), [[0, 'impact_soft', .4], [.05, 'ding_soft', .6]]);
// 64 «Und plötzlich sprang die Zahl über seinem Kopf» (zoom lento): el 0 dorado parpadea…
shot(104.51, 'Z', 'slow', L => { use('KE'); inside(.8, 40); const m = desk(L); actuar(m, 0, [[0, { aLx: 1.0, aRx: 1.2, aLe: 1.2, aRe: 1.0, lean: .08, headX: 0 }]], { T: L.T }); num(m, 0, 1, Math.floor(L.T * 10) % 2 && L.lt > 1 ? 'red' : 'gold'); cara(m, L.T, { expr: 'joy' });
  const h = hp(m); cam([h.x + .8, h.y + 1.4, h.z + 10 - L.k * 2], [h.x, h.y + 1.6, h.z], 44); sh(V(KEX + 9, 0, -3), 20); }, [[.3, 'glitch', .4], [1.2, 'glitch', .5]]);
// 65 «Von Null auf Eins»: ¡pling! el 0 salta a un 1 rojo
shot(107.03, 'F', 'punch', L => { use('KE'); inside(.8, 40); const m = desk(L); applyPose(m, { aLx: 1.0, aRx: 1.0, aLe: 1.2, aRe: 1.2, lean: .05, headX: -.05 }); const one = L.lt > .45; num(m, one ? 1 : 0, one ? (L.lt - .45) * 4 : 1, one ? 'red' : 'gold'); cara(m, L.T, { expr: 'joy' });
  const h = hp(m); cam([h.x + .6, h.y + 1.4, h.z + 8.6], [h.x, h.y + 1.7, h.z], 42); sh(V(KEX + 9, 0, -3), 20); }, [[0, 'flash', .4], [.45, 'pling', .8], [.5, 'impact', .4]]);
// 66 «Er erstarrte»: el alcalde se queda congelado, ojos como platos
shot(108.42, 'Z', 'punch', L => { use('KE'); inside(.8, 40); const m = desk(L); applyPose(m, { aLx: 1.0, aRx: 1.0, aLe: 1.2, aRe: 1.2, lean: .1, headX: 0 }); num(m, 1, 1); cara(m, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); sweat(m, L.T, 2);
  onFace(m, 8.6, -.6, 0, 40, L.k, 7.8); sh(V(KEX + 9, 0, -3), 20); }, [[0, 'impact_soft', .4], [.1, 'silence_tick', .5]]);
// 67 «Ich erstarrte»: yo, detrás de las cajas, igual
shot(109.28, 'W', 'punch', L => { use('KE'); inside(.8, 40); const me = put(ich, KEX + 3.5, 0, 6, 2.5); applyPose(me, { aRx: .9, aRe: .5, crouch: .2, lean: -.1, ...shiver(L.T, .6) }); num(me, 0, 1); cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  onFace(me, 8, -.4, 0, 40, L.k, 7); sh(V(KEX + 2, 0, 3), 20); }, [[0, 'swipe', .3], [.1, 'gasp_f', .4]]);
// 68 «„Ich zähle doch nur Geld“, flüsterte er»: el alcalde enseña el fajo con una sonrisa nerviosa y susurra
shot(110.04, 'C', null, L => { use('KE'); inside(.8, 40); const m = desk(L); actuar(m, L.lt, [[0, { aRx: 1.6, aRe: .6, aRz: -.1, aLz: .3, headZ: .15 }]], { T: L.T }); num(m, 1, 1); talk(m, L.T, 110.04, 112.72, 'worried', { eyes: 'side_l' }); sweat(m, L.T, 2);
  const w = loc(m, 1.3, 4.4, 2.0); show(CASH[0], w.x, w.y, w.z, 0); CASH[0].rotation.x = PI / 2; bubble(m, 'Nur Geld…', (L.lt - .6) * 3, 2.6);
  onFace(m, 10, -1, -.8, 42, L.k, 9); sh(V(KEX + 9, 0, -3), 20); }, [[0, 'impact_soft', .3], [.3, 'whisper', .5]]);
// 69 «Aber die Zahl kletterte weiter»: el número tiembla y empieza a subir
shot(112.72, 'Z', 'slow', L => { use('KE'); inside(.8, 40); const m = desk(L); applyPose(m, { aLx: 1.6, aRx: 1.6, aLe: 2.2, aRe: 2.2, aLz: -.2, aRz: -.2, headX: -.2, ...shiver(L.T, 1.5) }); num(m, 1, 1 + Math.sin(L.T * 30) * .05); cara(m, L.T, { expr: 'scared' }); sweat(m, L.T, 3);
  const h = hp(m); cam([h.x - .6, h.y + 2, h.z + 9.4 - L.k], [h.x, h.y + 2, h.z], 44); sh(V(KEX + 9, 0, -3), 20); }, [[.2, 'tick', .5]]);
const climb = (L, n, side) => { use('KE'); inside(.8, 40); const m = desk(L); applyPose(m, { aLx: 2.6, aRx: 2.6, aLe: 1.8, aRe: 1.8, aLz: .2, aRz: .2, headX: -.2, ...shiver(L.T, 2) }); num(m, n, L.lt * 4); cara(m, L.T, { expr: 'panic', eyes: 'terror', mouth: 'grimace_wide' }); sweat(m, L.T, 3);
  const h = hp(m); cam([h.x + side * 2, h.y + 1.6, h.z + 7.8 - L.k * .8], [h.x, h.y + 1.8, h.z], 42); sh(V(KEX + 9, 0, -3), 20); };
shot(114.06, 'C', 'punch', L => climb(L, 2, -1), [[0, 'pling', .7], [.05, 'impact_soft', .4]]);
shot(114.82, 'C', 'punch', L => climb(L, 3, 1), [[0, 'pling', .75], [.05, 'impact_soft', .4]]);
shot(115.52, 'C', 'punch', L => climb(L, 4, 0), [[0, 'pling', .8], [.05, 'impact', .5]]);
// 70 «Keine zwei Minuten später umstellten zwanzig Polizeiwagen das Rathaus»: vista aérea: 20 coches con las sirenas rodean el Rathaus
shot(116.25, 'W', null, L => { town('night'); const n = Math.min(20, Math.floor(4 + L.lt * 12)); for (let i = 0; i < 20; i++) { const a = PI * (i / 19), r = 30 + (i % 3) * 7; FLEET.set(i, -6 + Math.cos(a) * r, -84 + Math.sin(a) * r * .9, a + PI / 2); } FLEET.show(n, L.T);
  badge('red', '20', W / 2, H * .16, (L.lt - .4) * 3, 1, 1.0); const k = easeInOut(L.k); cam([-6 + k * 10, 60 - k * 10, -18 + k * 6], [-6, 4, -76], 52); sh(V(-6, 0, -76), 70); }, [[0, 'swipe', .3], [.05, 'siren', .7], [.6, 'brakes', .5], [1.4, 'door_slam', .4]]);
// 71 «Die Goon-Polizei stürmte den Keller»: los policías entran corriendo por el portón
shot(120.18, 'S', null, L => { use('KE'); inside(.8, 40); COP.forEach((c, i) => { caminar(c, L.lt, { x: KEX + 15 - (i % 2) * 3, z: -14 + i * 1.2, ry: -PI / 2 - .4 + i * .1, speed: 10, run: true, accel: .05, T: L.T + i }); num(c, 0, 1); cara(c, L.T, { expr: 'shout', mouth: 'talk_wide' }); });
  const m = put(mayor, KEX + 6, 0, -2, PI / 2 + .3); actuar(m, L.lt, [[0, 'shock']], { T: L.T }); num(m, 4, 1); cara(m, L.T, { expr: 'scream' });
  cm([KEX - 6, 7, 16, KEX + 10, 3, -8, 50], [KEX - 4, 6.6, 14, KEX + 10, 3, -8, 50], L.k); sh(V(KEX + 8, 0, -6), 30); }, [[0, 'whoosh_soft', .3], [.05, 'crowd_run', .7], [.3, 'shout_crowd', .5]]);
// 72 «und der ganze Turm aus Kartons krachte auf ihn herunter»: la avalancha de cajas sepulta al alcalde
shot(121.88, 'Z', 'punch', L => { use('KE'); inside(.8, 40); KE.pile.set(clamp((L.lt - .2) / 1.6)); const m = put(mayor, KEX - 3, 0, 4, PI); actuar(m, L.lt, [[0, 'cower']], { T: L.T }); num(m, 4, 1); cara(m, L.T, { expr: 'scream' }); m.root.position.y = -clamp((L.lt - 1.2) / .6) * 3;
  orb(L.k, V(KEX - 3, 4.5, 4), null, [17, .1, .2, 48], [15, .05, .2, 48]); SHAKE = clamp(L.lt - .3) * .6; sh(V(KEX - 4, 0, 0), 30); }, [[.2, 'rumble', .6], [.4, 'box_drop', .6], [.8, 'slam', .6], [1.4, 'thud', .5]]);
// 73 «Jetzt sitzt der Bürgermeister drei Jahre mit Steinfäustlingen»: en la celda, con sus manoplas de piedra y su 4
shot(125.12, 'I', null, L => { use('ZL'); inside(.9, 40); const m = put(mayor, ZLX - 2.25, 0, -5.6, .1); applyPose(m, { aLx: .9, aRx: .9, aLz: -.2, aRz: -.2, aLe: .6, aRe: .6, headX: .35, lean: .1 }); mitts(m); num(m, 4, 1); cara(m, L.T, { expr: 'sad' });
  badge('red', '3 JAHRE', W / 2, H * .3, (L.lt - .3) * 3, 1, .8); cm([ZLX - 1.9, 5, 16, ZLX - 2.25, 4.4, -5, 44], [ZLX - 2.1, 5, 13, ZLX - 2.25, 4.4, -5, 42], L.k); sh(V(ZLX, 0, 0), 20); }, [[0, 'iris_pop', .4], [.2, 'metal_hit', .5], [.8, 'sigh', .4]]);
// 74 «Das Gesetz ist abgeschafft»: la plaza celebra; el sello ABGESCHAFFT cae sobre el cartel; ya nadie tiene número
shot(128.13, 'W', 'punch', L => { town(); const st = clamp((L.lt - .1) / .25); show(STAMP, -6, 17.8, -82.1, 0, lerp(2.2, 1, easeOut(st))); STAMP.rotation.set(0, 0, -.18); STAMP.visible = st > 0;
  [K[0], XT[0], K[1], XT[1], K[2], XT[3], K[4], XT[4], helga, haeft].forEach((c, i) => { put(c, -18 + (i % 5) * 6, 0, -60 + Math.floor(i / 5) * 6, PI); actuar(c, L.lt, [[0, 'cheer']], { T: L.T + i }); saltar(c, L.lt, (i % 3) * .2, { h: 1.2, dur: .45, base: [c.root.position.x, 0, c.root.position.z] }); });
  confRain(V(-6, 0, -66), L.T, 40, 30, 16, 20); cm([-6, 5, -26, -6, 16, -84, 50], [-6, 6, -34, -6, 17, -84, 48], L.k); sh(V(-6, 0, -66), 40); }, [[.1, 'stamp', .8], [.2, 'cheer', .6], [.6, 'firework', .4]]);
// 75 «Nur über seinem Kopf steht für immer: Vier» (zoom lento): el alcalde en su celda, solo, con su 4 rojo brillando
shot(129.78, 'Z', 'slow', L => { use('ZL'); inside(.7, 30); const m = put(mayor, ZLX - 3.75, 0, -5.6, .1); applyPose(m, { aLx: .9, aRx: .9, aLz: -.2, aRz: -.2, aLe: .6, aRe: .6, headX: -.1, lean: .05 }); mitts(m); num(m, 4, 1); cara(m, L.T, { expr: 'cry' });
  const h = hp(m); cam([h.x + .4, h.y + 2.4, h.z + 14 - L.k * 4], [h.x, h.y + 1.6, h.z], 42); sh(V(ZLX, 0, -4), 20); }, [[.3, 'sad_tone', .6], [1.6, 'bell_far', .4]]);

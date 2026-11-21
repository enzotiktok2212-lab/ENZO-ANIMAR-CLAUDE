// ---------- b: el alcalde, la regla de los vídeos, yo (nº 2, 9 m), la mañana con papá y las gaviotas (29,71 – 58,29 s) ----------
const MZ = -66, MX = -6;                                    // el alcalde, delante del Rathaus
const mayorOn = (L, o = {}) => { const m = put(mayor, MX, 0, MZ, 0); hals(m, 40, { T: L.T, sway: .02, bend: .04 }); handy(m, PH2); feed(PH2, L.T); actuar(m, L.lt, [[0, scrollPose]], { T: L.T }); cara(m, L.T, { expr: 'smile', eyes: 'down' });
  attach(NEST, m.head, [0, 1.75, 0], [0, 0, 0], 1.05); NEST.userData.chicks.forEach((c, i) => { c.position.y = .3 + Math.max(0, Math.sin(L.T * 9 + i * 2)) * .2; }); return m; };
// cigüeñas: una en el nido (la madre) y otra que llega volando
const storkOn = (L, k = 1, land = 1) => { const n = wpos(NEST); const s0 = STORKS[0]; show(s0, n.x + .6, n.y + 1.5, n.z - .3, -.6, .9); s0.userData.flap(L.T, .08); const f = easeOut(clamp(land)); const s1 = STORKS[1]; show(s1, lerp(n.x + 30, n.x - 1, f), lerp(n.y + 14, n.y + 1.8, f), lerp(n.z + 10, n.z + .3, f), -PI / 2 - .4, .9); s1.userData.flap(L.T, f > .95 ? .1 : .7); };
// 26 «Aber das Verrückteste ist der Bürgermeister» (zoom lento): el cuello del alcalde sube por encima de la cúpula del Rathaus
shot(29.71, 'F', 'slow', L => { town(); const m = mayorOn(L); storkOn(L, 1, 1); volk(MX, MZ, 40, 10, 40, L.T, 51, { face: V(MX, 0, MZ), phone: false }); orbit(V(MX, 22, MZ), lerp(92, 76, easeIn(L.k)), .04, .1, 46); sh(V(MX, 0, MZ), 60); }, [[0, 'bell_big', .5], [.3, 'murmur', .4], [1.2, 'birds', .4]]);
// 27 «Er hängt so viel am Handy»: sus manos con el móvil (vídeos sin parar); la cámara sube por el cuello
shot(32.03, 'W', null, L => { town(); const m = mayorOn(L); storkOn(L); volk(MX, MZ, 30, 10, 36, L.T, 53, { phone: true }); const n = neckAt(m, lerp(0, .5, easeInOut(L.k))); const p_ = wpos(PH2); cam([MX + 3, lerp(p_.y + 1.5, n.y + 1, easeInOut(L.k)), MZ + 11], [MX, lerp(p_.y, n.y, easeInOut(L.k)), MZ], 46); sh(V(MX, 0, MZ), 40); }, [[0, 'swipe', .5], [.4, 'notif', .5], [.9, 'swipe', .4]]);
// 28 «dass Störche auf seinem Kopf nisten»: arriba del todo: una cigüeña aterriza en el nido de su cabeza
shot(33.55, 'S', 'punch', L => { town(); const m = mayorOn(L); storkOn(L, 1, L.lt / 1.1); orbit(headC(m).add(V(0, 1.2, 0)), lerp(20, 16, L.k), -.5, .15, 46); sh(headC(m), 30); }, [[0, 'feathers', .6], [.4, 'whoosh', .4], [1.0, 'land', .5], [1.1, 'cricket', .3]]);
// 29 «Gesehen hat er sie noch nie»: primer plano: los polluelos piando sobre su cabeza, él mirando el móvil (abajo) sin enterarse
shot(35.21, 'C', null, L => { town(); const m = mayorOn(L); storkOn(L); badge('q', '?', W * .72, H * .3, (L.lt - .5) * 4, 1, .8); orbit(headC(m).add(V(0, .9, 0)), lerp(9, 8, L.k), .3, .08, 44); sh(headC(m), 20); }, [[0, 'birds', .6], [.5, 'pop', .4], [.8, 'birds', .5]]);
// 30 «Es ist so schlimm, dass die Stadt sogar»: en la plaza levantan un cartel oficial enorme; la gente se acerca
shot(36.62, 'W', 'punch', L => { town(); VIDB.visible = true; const r = easeOut(clamp(L.lt / 1.2)); VIDB.position.set(-24, lerp(-17, 0, r), 6); dust(V(-24, 0, 6), 36.62 + .1, L.T, 10, .8);
  [[K[7], -14, 9.6, .5], [XT[2], -26.4, 16.4, .5]].forEach(([k, x, z, ry], i) => { put(k, x, 0, z, ry + (i ? .5 : -.5)); hals(k, 6, { T: L.T + i }); actuar(k, L.lt, [[0, 'point']], { T: L.T + i }); cara(k, L.T + i, { expr: 'shock' }); });
  volk(-24, 6, 30, 12, 34, L.T, 55, { face: V(-24, 0, 6), phone: false }); orbit(V(-24, 9, 6), lerp(36, 30, L.k), .5, .12, 46); sh(V(-24, 0, 8), 40); }, [[0, 'machine_hum', .5], [.2, 'rubble', .4], [1.2, 'slam', .5], [1.4, 'murmur', .4]]);
// 31 «„In dieser Stadt“-Videos»: acercamiento al cartel: el logo del canal
shot(38.42, 'Z', 'punch', L => { town(); VIDB.visible = true; VIDB.position.set(-24, 0, 6); const p = VIDB.userData.plane; p.updateMatrixWorld(true); const c = p.localToWorld(V(-2.5, 2.2, 0)), nr = V(Math.sin(.5), 0, Math.cos(.5)); cam([c.x + nr.x * lerp(13, 10, L.k), c.y + .3, c.z + nr.z * lerp(13, 10, L.k)], [c.x, c.y, c.z], 44); sh(V(-24, 0, 8), 30); }, [[0, 'pop', .5], [.3, 'sparkle', .4]]);
// 32 «auf zehn Minuten am Tag begrenzt hat»: una vecina enseña su móvil: el vídeo del canal y la cuenta atrás de 10 minutos…
shot(39.83, 'W', null, L => { town(); const k = put(XT[0], 10, 0, -8, -.3); hals(k, 7, { T: L.T }); actuar(k, L.lt, [[0, { aRx: 1.5, aRe: .5, aRz: -.15, aLz: .1 }]], { T: L.T }); attach(PH2, k.aR.hand, [0, -1.1, .25], [-.15, 0, PI], 1.4); feed(PH2, L.T, true); cara(k, L.T, { expr: 'happy' });
  badge('red', '10:00 MIN.', W / 2, H * .2, (L.lt - .1) * 4, 1, .85); screenCam(PH2, lerp(4.4, 3.6, L.k), 0, 46); volk(10, -8, 20, 12, 30, L.T, 57); sh(V(10, 0, -8), 30); }, [[0, 'tick', .5], [.3, 'clock_tick', .5], [.7, 'tick', .5]]);
// 32b «am Tag begrenzt hat»: …y se bloquea: ZEIT VORBEI; ella se lleva las manos a la cabeza
shot(40.93, 'C', 'punch', L => { town(); const k = put(XT[0], 10, 0, -8, -.3); hals(k, 7, { T: L.T }); actuar(k, L.lt, [[0, { aRx: 1.5, aRe: .5, aRz: -.15, aLx: 2.4, aLz: .5, aLe: 2 }]], { T: L.T }); attach(PH2, k.aR.hand, [0, -1.1, .25], [-.15, 0, PI], 1.4); lockS(PH2, 'ZEIT VORBEI'); cara(k, L.T, { expr: 'cry' });
  orbit(V(10, 7, -8), lerp(16, 14, L.k), -.4, .05, 46); volk(10, -8, 20, 12, 30, L.T, 57); sh(V(10, 0, -8), 30); }, [[0, 'alarm_soft', .5], [.2, 'gasp_f', .5]]);
// 33 «Denn laut Statistik»: la pizarra de estadística: un tercio del cuello es culpa de esos vídeos
shot(41.96, 'R', null, L => { town(); STATB.visible = true; const p = STATB.userData.plane; p.updateMatrixWorld(true); const c = p.localToWorld(V(0, 0, 0)), nr = V(Math.sin(.2), 0, Math.cos(.2)); const d = lerp(17, 13, L.k); cam([c.x + nr.x * d - 1, c.y + .5, c.z + nr.z * d], [c.x, c.y, c.z], 44);
  volk(-14, -40, 20, 12, 30, L.T, 59, { arc: [3.6, 5.8] }); sh(V(-14, 0, -40), 30); }, [[0, 'paper', .5], [.4, 'chalk', .5]]);
// 34 «sind die an jedem dritten Meter»: el cuello de Marvin de abajo arriba…
const RED3 = mat(0xff3a4a, { emissive: 0xff2030, emissiveIntensity: .5, roughness: .4 });
shot(43.30, 'S', null, L => { plaza(L, 30, 61, -6, -16, 9); const c = put(marvin, -6, 0, -16, .2); hals(c, 18, { T: L.T, sway: .02, scarf: [.66, 1], scarfM: RED3 }); actuar(c, L.lt, [[0, 'shrug']], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  const n = neckAt(c, lerp(.1, .7, easeInOut(L.k))); cam([n.x + 3, n.y, n.z + 12], [n.x, n.y, n.z], 46); volk(-6, -16, 30, 12, 36, L.T, 61); sh(V(-6, 0, -16), 30); }, [[0, 'whoosh_up', .5], [.3, 'tick', .4]]);
// 34b «Hals schuld»: …el último tercio brilla en rojo: «1/3»
shot(43.96, 'C', 'punch', L => { town(); const c = put(marvin, -6, 0, -16, .2); hals(c, 18, { T: L.T, sway: .02, scarf: [.66, 1], scarfM: RED3 }); RED3.emissiveIntensity = .5 + Math.sin(L.T * 12) * .4; actuar(c, L.lt, [[0, 'shrug']], { T: L.T }); cara(c, L.T, { expr: 'shock' });
  badge('red', '1/3', W * .5, H * .22, (L.lt - .1) * 4, 1, 1.1); orbit(neckAt(c, .8), lerp(20, 18, L.k), -.3, .05, 46); volk(-6, -16, 30, 12, 36, L.T, 63); sh(V(-6, 0, -16), 30); }, [[0, 'impact', .5], [.2, 'alarm_soft', .4]]);
// 35 «Und ich?»: me giro hacia la cámara en mitad de la plaza
shot(45.15, 'W', 'punch', L => { plaza(L, 40, 65, -6, -2, 8); const c = put(ich, -6, 0, -2, lerp(1.2, 0, easeOut(L.lt / .3))); hals(c, NI, { T: L.T, sway: .03 }); actuar(c, L.lt, [[0, 'idle'], [.1, 'shrug']], { T: L.T }); cara(c, L.T, { expr: 'smile' });
  orbit(headC(c), 16, -.15, .02, 44); sh(V(-6, 0, -2), 40); }, [[0, 'whoosh', .5], [.1, 'cloth', .4]]);
// 36 «Ich bin die Nummer zwei der Stadt»: la Hals-Rangliste: mi cabeza asoma por encima del tablón
shot(45.73, 'Z', null, L => { town(); RANKB.visible = true; const c = put(ich, 6, 0, -57, -.1); hals(c, NI, { T: L.T, sway: .03, bend: .12 }); actuar(c, L.lt, [[0, 'point_l']], { T: L.T }); cara(c, L.T, { expr: 'grin' });
  badge('gold', 'NR. 2', W * .5, H * .16, (L.lt - .2) * 4, 1, .9); orbit(V(4.6, 15, -50), lerp(42, 38, L.k), -.12, .06, 46); volk(4, -50, 30, 14, 40, L.T, 67); sh(V(4, 0, -52), 40); }, [[0, 'pop', .5], [.3, 'ding_soft', .5]]);
// 37 «Neun Meter» (zoom lento): de cuerpo entero con el metro plegable gigante al lado: 9 METER
shot(47.05, 'F', 'slow', L => { plaza(L, 40, 69, -6, -2, 9); const c = put(ich, -6, 0, -2, 0); hals(c, NI, { T: L.T, sway: .02 }); actuar(c, L.lt, [[0, { aLx: .3, aLz: .6, aLe: 1.8, aRx: .3, aRz: .6, aRe: 1.8, lean: -.08 }]], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  show(ZOLL, -2.4, 0, -2, 0, 1); badge('big', '9 METER', W / 2, H * .17, (L.lt - .1) * 4, 1, 1); orbit(V(-5, 13, -2), lerp(44, 38, L.k), .1, .04, 46); sh(V(-6, 0, -2), 40); }, [[0, 'ratchet', .5], [.3, 'stretch', .4]]);
// 38 «Meine eigenen Füße»: desde mi cabeza mirando hacia abajo: mis pies, diminutos, allá abajo
shot(48.06, 'S', null, L => { plaza(L, 40, 71, -6, -2, 6); const c = put(ich, -6, 0, -2, 0); hals(c, NI, { T: L.T, sway: .015, bend: .05 }); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'sus' });
  const h = headC(c); cam([h.x + .3, h.y + 1.2, h.z + 1.6], [-6 + Math.sin(L.T) * .3, 0, -1.6], lerp(52, 44, L.k)); sh(V(-6, 0, -2), 30); }, [[0, 'wind', .5], [.5, 'whoosh_down', .4]]);
// 39 «hab ich seit»: mi cara entrecerrando los ojos para ver algo allá abajo
shot(49.38, 'C', 'punch', L => { plaza(L, 40, 73, -6, -2, 7); const c = put(ich, -6, 0, -2, 0); hals(c, NI, { T: L.T, sway: .015, bend: .18 }); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'squint' }); sweat(c, L.T, 1);
  orbit(headC(c), lerp(8.5, 7.5, L.k), .35, -.05, 44); sh(V(-6, 0, -2), 30); }, [[0, 'hmm', .5]]);
// 39b «2021 nicht mehr gesehen»: calendario «2021» flotando junto a mi cara
shot(50.18, 'Z', null, L => { plaza(L, 40, 75, -6, -2, 7); const c = put(ich, -6, 0, -2, 0); hals(c, NI, { T: L.T, sway: .015, bend: .12 }); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  const h = headC(c); CAL.userData.draw('2021', 'SEIT'); show(CAL, h.x + 3.2, h.y + .4, h.z + .6, -.2, .8 * spring(clamp(L.lt * 3))); orbit(h.clone().add(V(1.6, 0, 0)), lerp(15, 13, L.k), .05, .02, 46); sh(V(-6, 0, -2), 30); }, [[0, 'pages', .5], [.2, 'sad_tone', .4]]);
// ---------- la mañana en casa: buhardilla (Dachfenster) en (10.6, 22.2, 90), mirando a +x; yo en el jardín (16, 90) mirando a -x ----------
const DW = V(10.6, 22.2, 90);
const meHome = (L, bend = .3, expr = 'smile') => { const c = put(ich, 16.6, 0, 90.4, -.45); hals(c, 18.4, { T: L.T, sway: .02, bend: bend * .2, lean: .27 }); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr }); return c; };
const papaWin = (L, open = 1, lean = 0) => { SHUT[0].rotation.y = -open * 1.5; SHUT[1].rotation.y = open * 1.5; DLIGHT.intensity = 18 * open; const p = put(papa, 10.9 + lean * .5, 17.4, 90, PI / 2 - .55); actuar(p, L.lt, [[0, 'idle']], { T: L.T }); return p; };
const morning = L => { town('morning'); BIRDSON = 1; };
// 40 «Jeden Morgen öffnet Papa»: amanece sobre mi casa; yo en el jardín con la cabeza a la altura del tejado
shot(51.40, 'F', null, L => { morning(L); papaWin(L, 0); meHome(L, .3, 'sleepy'); orbit(V(13, 13, 90), lerp(48, 42, L.k), .65, .08, 46); sh(V(12, 0, 90), 40); }, [[0, 'rooster', .6], [.5, 'birds', .5], [1.0, 'yawn_big', .4]]);
// 41 «das Dachfenster»: se abren las hojas de la buhardilla y aparece papá bostezando
shot(52.79, 'C', 'punch', L => { morning(L); const p = papaWin(L, easeOut(clamp(L.lt / .3)), .4); cara(p, L.T, { expr: 'yawn' }); actuar(p, L.lt, [[0, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5, aLe: .5, aRe: .5 }]], { T: L.T }); meHome(L, .3, 'smile');
  orbit(DW.clone().add(V(1.8, 0, 0)), lerp(13, 11, L.k), .55, .05, 44); sh(V(12, 0, 90), 30); }, [[0, 'door_creak', .6], [.3, 'yawn_m', .5]]);
// 42 «und reicht mir eine Brezel»: papá me tiende un pretzel; yo abro la boca
shot(53.61, 'W', null, L => { morning(L); const p = papaWin(L, 1, 1); actuar(p, L.lt, [[0, { aRx: 1.6, aRe: .2, aRz: -.1, lean: .3 }]], { T: L.T }); cara(p, L.T, { expr: 'smile' }); attach(PZ[0], p.aR.hand, [0, -.7, .5], [0, 0, 0], 1.1); const c = meHome(L, .38, 'gasp');
  const a = headC(p), b = headC(c); orbit(a.clone().lerp(b, .5), lerp(12, 10.5, L.k), .5, .05, 44); sh(V(12, 0, 90), 30); }, [[0, 'paper', .4], [.4, 'chew', .3]]);
// 43 «Er sagt: „Morgen, Großer.“»: papá me saluda con la mano; yo con el pretzel en la boca
shot(54.61, 'C', 'punch', L => { morning(L); const p = papaWin(L, 1, .6); actuar(p, L.lt, [[0, 'wave']], { T: L.T }); talk(p, L.T, 54.61, 55.76, 'happy'); const c = meHome(L, .36, 'grin'); attach(PZ[0], c.head, [0, .3, .75], [0, 0, 0], .9);
  bubble(p, 'Morgen, Großer!', (L.lt - .45) * 4); orbit(headC(p).lerp(headC(c), .45), 12, .6, .05, 44); sh(V(12, 0, 90), 30); }, [[0, 'chew', .5], [.4, 'laugh_m', .3]]);
// 44 «Und jeden Morgen klauen die Möwen»: una bandada de gaviotas se lanza en picado hacia mi cabeza
shot(55.76, 'W', null, L => { morning(L); papaWin(L, 1, 0); cara(papa, L.T, { expr: 'shock' }); const c = meHome(L, .3, 'shock'); attach(PZ[0], c.head, [0, .3, .75], [0, 0, 0], .9); const h = headC(c);
  GULLS.forEach((g, i) => { const f = clamp(L.lt / 1.1 - i * .08); show(g, lerp(h.x + 40 + i * 6, h.x + 4 + i * 1.5, f), lerp(h.y + 20 + i * 3, h.y + 2 + i, f), lerp(h.z - 18 + i * 5, h.z + (i - 1.5) * 2.5, f), -PI / 2 + .3, 1.3); g.lookAt(h); g.userData.flap(L.T + i); });
  orbit(h.clone().add(V(4, 3, 0)), lerp(30, 24, L.k), .55, .1, 46); sh(V(12, 0, 90), 40); }, [[0, 'feathers', .5], [.2, 'whoosh', .4], [.6, 'birds', .6]]);
// 44b «klauen»: una gaviota arranca el pretzel de mi boca
shot(56.82, 'C', 'punch', L => { morning(L); const c = meHome(L, .3, 'shock'); const h = headC(c); const g = GULLS[0]; show(g, h.x + 2.6 + L.lt * 3, h.y + 1.2 + L.lt * 2, h.z - 1, 0, 1.0); g.rotation.y = PI / 2; g.userData.flap(L.T); attach(PZ[1], g, [0, .1, 1.6], [0, 0, PI / 2], .9);
  attach(PZ[2], c.head, [0, .3, .75], [0, 0, -PI / 2], .9); orbit(h.clone().add(V(1.4, .4, 0)), 11, .45, .05, 44); sh(V(12, 0, 90), 30); }, [[0, 'rip', .6], [.1, 'feathers', .5]]);
// 45 «die Hälfte»: la gaviota se va con media; yo me quedo con la otra mitad, enfadado
shot(57.24, 'W', null, L => { morning(L); papaWin(L, 1, 0); cara(papa, L.T, { expr: 'worried' }); actuar(papa, L.lt, [[0, 'facepalm']], { T: L.T }); const c = meHome(L, .3, 'angry'); const h = headC(c); attach(PZ[2], c.head, [0, .3, .75], [0, 0, -PI / 2], .9);
  const g = GULLS[0]; show(g, h.x + 6 + L.lt * 12, h.y + 3 + L.lt * 5, h.z - 3 - L.lt * 4, 0, 1.4); g.rotation.y = PI / 2 + .5; g.userData.flap(L.T); attach(PZ[1], g, [0, .1, 1.6], [0, 0, PI / 2], .9);
  badge('red', '½', W * .7, H * .3, (L.lt - .2) * 4, 1, .9); orbit(h.clone().add(V(1, 0, 0)), 15, .5, .08, 46); sh(V(12, 0, 90), 30); }, [[0, 'laugh_m', .3], [.2, 'growl', .3]]);

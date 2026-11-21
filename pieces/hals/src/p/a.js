// ---------- a: gancho, la regla, el pueblo se adapta (0 – 29,71 s) ----------
const NI = 22;                                   // cuello de ich: «9 Meter»
const sc_ = ch => ch.spec.scale || 1;
// gente de cuello largo alrededor de (cx, cz), sin entrar en el radio r0
function volk(cx, cz, n, r0, r1, T, seed = 1, o = {}) { POST.push(() => { const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc = o.arc || (o.away === false ? null : [ac + 1.75, ac + 6.283 - 1.75]);
  for (let i = 0; i < n; i++) { const s = VOLK.seat[i]; const a = arc ? arc[0] + r() * (arc[1] - arc[0]) : r() * 6.283; const d = r0 + r() * (r1 - r0); s.x = cx + Math.cos(a) * d; s.z = cz + Math.sin(a) * d;
    s.ry = o.face ? Math.atan2(o.face.x - s.x, o.face.z - s.z) + (r() - .5) * .8 : r() * 6.283; s.L = (o.L0 ?? 3) + r() * (o.L1 ?? 9); s.walk = o.walk ? (1.5 + r() * 2) : 0; } VOLK.update(T, n, o.phone ?? true); }); }
// cámara mirando la pantalla de un móvil (según su normal), a distancia d
const screenCam = (P_, d = 2.6, up = 0, fov = 40) => { P_.updateMatrixWorld(true); const p = wpos(P_), nrm = V(0, 0, 1).applyQuaternion(P_.getWorldQuaternion(new THREE.Quaternion())); cam([p.x + nrm.x * d, p.y + nrm.y * d + up, p.z + nrm.z * d], [p.x, p.y, p.z], fov); camera.up.copy(V(0, 1, 0).applyQuaternion(P_.getWorldQuaternion(new THREE.Quaternion()))); camera.lookAt(p); };
const handy = (ch, P_ = PH, s = 1) => attach(P_, ch.aR.hand, [0, -.62, .3], [-1.35, PI, 0], s);
const feed = (P_, T, chan = false) => { const k = Math.floor(T * 14) / 10; P_.userData.S.draw('f' + chan + k, (c, w, h) => drawFeed(c, w, h, k, chan)); };
const lockS = (P_, label = 'GESPERRT') => P_.userData.S.draw('L' + label, (c, w, h) => drawLock(c, w, h, label));
const timeS = (P_, mode, k = 1) => { const q = Math.round(clamp(k) * 20) / 20; P_.userData.S.draw('t' + mode + q, (c, w, h) => drawTime(c, w, h, mode, q)); };
const headC = ch => hp(ch).add(V(0, .65 * sc_(ch), 0));
const walkC = (ch, lt, x, z, ry, sp = 3.4, T, extra) => caminar(ch, lt, { x, z, ry, speed: sp, accel: .05, T, extra });
const plaza = (L, n = 40, seed = 3, cx = -6, cz = -10, r0 = 9) => { town(); volk(cx, cz, n, r0, 46, L.T, seed); };
const scrollPose = T => ({ ...GEST.phone_look, aRe: 1.6 + Math.sin(T * 9) * .12 });
function stars_(p, T) { MATH.forEach((m, i) => { if (i > 2) return; m.visible = true; const a = T * 5 + i * 2.1; m.position.set(p.x + Math.cos(a) * 1.4, p.y + 1.6 + Math.sin(T * 3 + i) * .2, p.z + Math.sin(a) * 1.4); m.lookAt(camera.position); }); }

// 1 «In dieser Stadt wird» (zoom lento): plaza llena de gente de cuello largo mirando el móvil; yo en el centro, el cuello me crece a tirones
shot(0, 'Z', 'slow', L => { plaza(L, 50, 3, -6, -2, 7); const c = put(ich, -6, 0, -2, 0); const g = 15 + Math.floor(L.lt * 6) / 6 * 6 + easeOut((L.lt * 6) % 1) * 1; hals(c, Math.min(NI, g), { T: L.T, bend: .08 }); handy(c); feed(PH, L.T); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'down' });
  orbit(V(-6, 12.5, -2), lerp(50, 36, easeOut(L.k)), .12, .08, 46); sh(V(-6, 0, -2), 60); }, [[0, 'stretch_creak', .6], [.2, 'notif', .5], [.6, 'stretch', .5], [.8, 'murmur', .4]]);
// 2 «dein Hals jedes Mal»: primer plano de mi cara arriba del todo; cada toque al móvil, el cuello da un tirón; «+1 cm»
shot(1.18, 'C', 'punch', L => { plaza(L, 40, 5, -6, -2, 7); const c = put(ich, -6, 0, -2, 0); const st = Math.floor(L.lt * 4); hals(c, NI - 2 + st * .5 + easeOut((L.lt * 4) % 1) * .5, { T: L.T, bend: .05 }); handy(c); feed(PH, L.T); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'down' });
  for (let k = 0; k <= st; k++) badge('green', '+1 cm', W / 2 + (k % 2 ? 230 : -230), H * (.5 - k * .06), (L.lt - k * .25) * 4, 1, .7);
  orbit(headC(c), lerp(13, 11, L.k), -.25, .05, 42); sh(V(-6, 0, -2), 40); }, [[0, 'pop', .5], [.25, 'stretch_creak', .5], [.5, 'pop', .5], [.75, 'stretch_creak', .5]]);
// 3 «länger,»: desde los pies hacia arriba: el cuello sube y sube (la cámara sube con él)
shot(2.08, 'S', null, L => { plaza(L, 40, 7, -6, -2, 7); const c = put(ich, -6, 0, -2, .3); hals(c, NI, { T: L.T, bend: .05 }); handy(c); feed(PH, L.T); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'down' });
  const y = lerp(4, 22, easeInOut(L.k)); cam([-6 + 9, 2 + y * .3, -2 + 14], [-6, y, -2], 50); sh(V(-6, 0, -2), 40); }, [[0, 'stretch', .6], [.3, 'whoosh_up', .4]]);
// 4 «wenn du aufs Handy schaust»: el móvil en mis manos (vista desde arriba del hombro, el vídeo se desliza); el cuello sale hacia arriba del cuadro
shot(2.72, 'W', null, L => { plaza(L, 30, 9, -6, -2, 7); const c = put(ich, -6, 0, -2, 0); hals(c, NI, { T: L.T, bend: .05 }); handy(c, PH, 1.3); feed(PH, L.T); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); cara(c, L.T, { expr: 'happy' });
  screenCam(PH, lerp(3.2, 2.5, L.k), 0, 44); badge('green', '+1 cm', W * .5, H * .3, (L.lt - .5) * 4, 1, .8); sh(V(-6, 0, -2), 30); }, [[0, 'swipe', .5], [.4, 'notif', .5], [.6, 'stretch_creak', .5]]);
// 5 «Jede Stunde»: delante del Rathaus: el reloj de la torre detrás de mi cabeza; «1 STUNDE»
shot(3.94, 'F', 'punch', L => { town(); volk(-6, -66, 26, 8, 30, L.T, 11); const c = put(ich, -6, 0, -66, 0); hals(c, NI, { T: L.T, bend: .02 }); handy(c); feed(PH, L.T); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); cara(c, L.T, { expr: 'smile', eyes: 'down' });
  orbit(headC(c), lerp(26, 22, L.k), .08, .02, 46); badge('big', '1 STUNDE', W / 2, H * .2, (L.lt - .08) * 4, 1, .9); sh(V(-6, 0, -66), 40); }, [[0, 'clock_tick', .6], [.4, 'bell_far', .4]]);
// 6 «ein Zentimeter»: el metro plegable junto al cuello; da un tirón de un centímetro
shot(4.87, 'R', null, L => { plaza(L, 30, 13, -6, -2, 7); const c = put(ich, -6, 0, -2, 0); const j = easeOut(clamp((L.lt - .3) / .15)); hals(c, NI - .4 + j * .4, { T: L.T, bend: .02 }); handy(c); feed(PH, L.T); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); cara(c, L.T, { expr: j > .5 ? 'shock' : 'smile', eyes: j > .5 ? 'wide' : 'down' });
  const n = neckAt(c, .8); show(ZOLLS, n.x + 1.1, n.y - 3, n.z + .6, 0, 1); badge('green', '+1 cm', W * .5, H * .3, (L.lt - .32) * 4, 1, 1); cam([n.x + 3, n.y + .5, n.z + 7], [n.x + .4, n.y, n.z], 40); sh(V(-6, 0, -2), 30); }, [[.05, 'ratchet', .5], [.3, 'stretch_creak', .6], [.32, 'pop', .5]]);
// 7 «Und er geht nie wieder zurück»: dos colegas se cuelgan de mi cuello y tiran hacia abajo: no se mueve ni un milímetro
shot(5.96, 'C', null, L => { plaza(L, 30, 15, -6, -2, 8); const c = put(ich, -6, 0, -2, 0); hals(c, NI, { T: L.T, sway: .015 }); actuar(c, L.lt, [[0, 'fists']], { T: L.T, extra: shiver(L.T, .6) }); cara(c, L.T, { expr: 'determined' }); sweat(c, L.T, 2);
  [[K[0], .32, -1], [K[1], .5, 1]].forEach(([k, f, s], i) => { const n = neckAt(c, f); put(k, n.x + s * .9, n.y - 4.4 - Math.sin(L.T * 6 + i) * .15, n.z + .3, -s * PI / 2); actuar(k, L.lt, [[0, { aLx: 2.9, aRx: 2.9, aLz: -.3, aRz: -.3, aLe: .4, aRe: .4, lLx: .6, lLk: 1.2, lRx: .2, lRk: .6 }]], { T: L.T + i }); cara(k, L.T + i, { expr: 'angry', mouth: 'grimace_wide' }); });
  badge('red', 'NIE ZURÜCK', W / 2, H * .2, (L.lt - .6) * 4, 1, .8); orbit(neckAt(c, .45), lerp(30, 26, L.k), -.35, .1, 46); sh(V(-6, 0, -2), 40); }, [[0, 'strain', .5], [.3, 'stretch_creak', .5], [.7, 'thud', .4], [1.0, 'sigh', .3]]);
// 8 «Verstecken kannst du ihn auch nicht»: me escondo detrás de un árbol: el cuello sobresale muchísimo por encima
shot(7.54, 'W', null, L => { town(); volk(-42, 40, 18, 12, 34, L.T, 17, { face: V(-42, 0, 40) }); const c = put(ich, -44.6, 0, 40.5, PI / 2 + .3); hals(c, NI, { T: L.T, sway: .03 }); actuar(c, L.lt, [[0, 'sneak']], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: Math.sin(L.T * 3) > 0 ? 'side_l' : 'side_r' });
  orbit(V(-43.5, 14, 40), lerp(48, 42, L.k), PI / 2 + .55, .08, 46); sh(V(-42, 0, 38), 40); }, [[0, 'leaves', .6], [.4, 'steps', .4], [1.1, 'whisper', .3]]);
// 9 «Nicht mal unter einem Schal»: me enrollo una bufanda: tapa solo un trocito abajo del todo
shot(9.09, 'Z', null, L => { plaza(L, 30, 19, -6, -2, 8); const c = put(ich, -6, 0, -2, -.2); const s = .02 + .1 * easeOut(L.k * 1.6); hals(c, NI, { T: L.T, scarf: [0, s], scarfM: SCARF[1] }); actuar(c, L.lt, [[0, 'hug_self'], [.6, 'shrug']], { T: L.T }); cara(c, L.T, { expr: L.lt > .6 ? 'sad' : 'worried' });
  const n = neckAt(c, .5); cam([n.x + 6, lerp(4, 16, easeInOut(L.k)), n.z + 26], [n.x, lerp(6, 18, easeInOut(L.k)), n.z], 48); sh(V(-6, 0, -2), 40); }, [[0, 'cloth', .6], [.4, 'zip', .4], [.9, 'sigh', .4]]);
// 10 «Deshalb stricken die Omas hier»: dos abuelas de cuello largo en un banco, tejiendo a toda velocidad
shot(10.42, 'W', 'punch', L => { town(); volk(-36, 20, 20, 12, 34, L.T, 21); const a = put(oma, -36.3, 0, 18.4, PI / 2 + .25), b = put(oma2, -36.3, 0, 22, PI / 2 - .25); [a, b].forEach((o, i) => { hals(o, 8, { T: L.T + i, bend: .25 }); actuar(o, L.lt, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.6 + Math.sin(L.T * 18 + i) * .3, aRe: 1.6 - Math.sin(L.T * 18 + i) * .3, aLz: -.3, aRz: -.3, crouch: 1.0, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5 }]], { T: L.T + i }); cara(o, L.T + i, { expr: 'smile', eyes: 'down' }); attach(NEED[i], o.aR.hand, [0, -.6, .4], [0, 0, 0], 1); });
  show(YARN[0], -33.6, .7, 20, 0, 1); show(SPILE, -33, 0, 20.4, .4, 1); orbit(V(-36, 9, 20.2), lerp(28, 24, L.k), PI / 2 + .1, .12, 46); sh(V(-36, 0, 20), 30); }, [[0, 'pencil', .5], [.3, 'click_metal', .4], [.6, 'pencil', .5], [.9, 'laugh_old', .4]]);
// 11 «das ganze Jahr»: la bufanda serpentea por toda la plaza (año entero: «365 TAGE»), la grúa sube
shot(11.70, 'S', null, L => { town(); volk(-20, 10, 20, 14, 40, L.T, 23); const a = put(oma, -36.3, 0, 18.4, PI / 2 + .25), b = put(oma2, -36.3, 0, 22, PI / 2 - .25); [a, b].forEach((o, i) => { hals(o, 8, { T: L.T + i, bend: .25 }); actuar(o, L.lt, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.6 + Math.sin(L.T * 18 + i) * .3, aRe: 1.6, crouch: 1.0, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5 }]], { T: L.T + i }); cara(o, L.T, { expr: 'joy' }); attach(NEED[i], o.aR.hand, [0, -.6, .4], [0, 0, 0], 1); });
  show(SPILE, -33, 0, 20.4, .4, 1); badge('big', '365 TAGE', W / 2, H * .22, (L.lt - .15) * 4, 1, .9); cm([-10, 10, 46, -26, 0, 22, 50], [-14, 34, 40, -28, 0, 26, 50], L.k); sh(V(-26, 0, 30), 50); }, [[0, 'pages', .5], [.4, 'cloth', .4], [.9, 'pencil', .4]]);
// 12 «an einem einzigen Schal»: un vecino con el cuello envuelto de arriba abajo en la bufanda; la cámara sube por ella
shot(13.10, 'C', 'punch', L => { plaza(L, 30, 25, 20, -4, 8); const c = put(K[3], 20, 0, -4, -.3); hals(c, 26, { T: L.T, scarf: [0, 1] }); actuar(c, L.lt, [[0, 'shrug']], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  const n = neckAt(c, lerp(.2, .95, easeInOut(L.k))); cam([n.x - 3, n.y + 1, n.z + 13], [n.x, n.y, n.z], 46); sh(V(20, 0, -4), 40); }, [[0, 'cloth', .6], [.4, 'whoosh_up', .4]]);
// 13 «Erste Dates sind schwer»: en la terraza del café: él (cuello larguísimo) y ella, que tiene que mirar muy arriba
shot(14.04, 'W', null, L => { town(); volk(8, -22, 24, 12, 36, L.T, 27); const m = put(er, 8, 0, -20.4, PI); hals(m, 10, { T: L.T, bend: .35 }); actuar(m, L.lt, [[0, 'shrug']], { T: L.T }); cara(m, L.T, { expr: 'smile' });
  const f = put(sie, 8, 0, -24.8, 0); actuar(f, L.lt, [[0, { headX: -.5 }], [.6, 'shrug']], { T: L.T }); cara(f, L.T, { expr: 'lookup' });
  show(DTAB, 8, 0, -22.6); orbit(V(8, 6.5, -22.6), lerp(30, 26, L.k), -PI / 2 + .15, .12, 44); sh(V(8, 0, -22), 30); }, [[0, 'cup_rattle', .5], [.5, 'sigh', .4], [1.0, 'spoon', .4]]);
// 14 «Damit sie dir in die Augen schauen kann»: desde la cara de ella, la cámara sube por el cuello de él hasta su cara
shot(15.53, 'S', null, L => { town(); volk(8, -22, 20, 12, 36, L.T, 29); const m = put(er, 8, 0, -20.4, PI); hals(m, 10, { T: L.T, bend: .35 }); actuar(m, L.lt, [[0, 'idle']], { T: L.T }); cara(m, L.T, { expr: 'smile', eyes: 'down' });
  const f = put(sie, 8, 0, -24.8, 0); actuar(f, L.lt, [[0, { headX: -.55, aLx: .4, aRx: .4 }]], { T: L.T }); cara(f, L.T, { expr: 'lookup' });
  const a = headC(f), b = headC(m), q = easeInOut(L.k), t = a.clone().lerp(b, q); show(DTAB, 8, 0, -22.6); cam([t.x - 5.5, t.y + .5, t.z + 5], [t.x, t.y, t.z], 44); sh(V(8, 0, -22), 30); }, [[0, 'whoosh_up', .5], [.8, 'gulp', .4]]);
// 15 «muss sie auf die Leiter»: ella sube a una escalera junto a la mesa y por fin le mira a los ojos
shot(17.18, 'C', 'punch', L => { town(); volk(8, -22, 20, 12, 36, L.T, 31); const m = put(er, 8, 0, -20.4, PI); hals(m, 10, { T: L.T, bend: .35 }); actuar(m, L.lt, [[0, 'idle']], { T: L.T }); cara(m, L.T, { expr: 'love' });
  show(LAD, 8, 0, -25.4, 0, 1); const y = lerp(4.5, 8.4, easeOut(L.k * 1.5)); const f = put(sie, 8, y, -24.8, 0); actuar(f, L.lt, [[0, { aLx: 2.2, aRx: 2.0, aLe: .6, aRe: .6, lLx: .8, lLk: 1.2 }]], { T: L.T }); cara(f, L.T, { expr: 'smile' });
  show(DTAB, 8, 0, -22.6); orbit(V(8, 11.5, -22.6), 17, -PI / 2 + .2, .05, 44); sh(V(8, 0, -22), 30); }, [[0, 'metal_creak', .5], [.3, 'steps', .4], [.6, 'metal_creak', .4]]);
// 16 «Die Busse haben Löcher im Dach»: un autobús por la calle con cabezas asomando por agujeros del techo
const busRiders = (L, z, look = 'smile', umb = false) => { show(BUS, 26, 0, z, PI); [[K[2], -2.5, 6], [K[4], 1.2, 0], [XT[0], -1.4, -7]].forEach(([k, x, dz], i) => { put(k, 26 + x * 0 + (i - 1) * .3, 2.2, z - dz, PI); hals(k, 5.5, { T: L.T + i, sway: .06 }); actuar(k, L.lt, [[0, 'idle']], { T: L.T + i }); cara(k, L.T + i, { expr: look }); if (umb) attach(UMB[i], k.head, [0, 1.2, 0], [0, 0, 0], .8); }); };
shot(18.07, 'W', null, L => { town(); volk(14, 20, 20, 10, 30, L.T, 33); volk(14, 120, 0, 10, 30, L.T, 33); const z = lerp(152, 134, L.k); busRiders(L, z); cm([38, 8, z - 28, 26, 8, z, 46], [36, 12, z - 24, 26, 9, z, 46], L.k); sh(V(26, 0, z), 40); }, [[0, 'car', .6], [.3, 'wheels', .4], [.9, 'door_open', .3]]);
// 17 «also wird jeder Regenschauer»: el cielo se oscurece y empieza a llover sobre las cabezas
shot(19.71, 'F', null, L => { town(); setSky([.3, .34, .42], [.45, .5, .58], [.6, .64, .7]); sun.intensity = 1.1; hemi.intensity = .9; const z = 130; busRiders(L, z, 'worried'); RAIN.update(L.T, V(26, 0, z), 40, 40, 30); TINT = 'rgba(40,60,90,.18)';
  orb(L.k, V(26, 9.5, z), null, [16, PI - .5, .25, 46], [14, PI - .35, .2, 46]); sh(V(26, 0, z), 30); }, [[0, 'wind', .5], [.1, 'drip', .5], [.4, 'splash', .4]]);
// 18 «zum Problem»: empapados; abren paraguas encima de la cabeza
shot(20.89, 'C', 'punch', L => { town(); setSky([.3, .34, .42], [.45, .5, .58], [.6, .64, .7]); sun.intensity = 1.1; const z = 130; busRiders(L, z, 'shock', true); RAIN.update(L.T, V(26, 0, z), 30, 30, 30); TINT = 'rgba(40,60,90,.18)';
  orbit(V(26, 10, z), 13, PI + .4, .05, 46); sh(V(26, 0, z), 30); }, [[0, 'splash', .5], [.2, 'pop', .4]]);
// 19 «Die Jungs sagen:»: tres chavales de cuello largo vienen andando hacia la cámara, chulos
const jungs = (L, walk = true) => { [[marvin, 0, 14], [K[5], -3.2, 10], [K[6], 3.2, 11]].forEach(([k, dx, nl], i) => { if (walk) walkC(k, L.lt + 3, -6 + dx, -24 - 6, 0, 2.6, L.T + i); else put(k, -6 + dx, 0, -18 - (i ? 1 : 0), 0); hals(k, nl, { T: L.T + i, sway: .03 }); cara(k, L.T + i, { expr: 'smug' }); }); };
shot(21.59, 'W', null, L => { plaza(L, 30, 35, -6, -16, 9); jungs(L); orbit(V(-6, 9, -18), lerp(30, 26, L.k), -.1, .12, 46); sh(V(-6, 0, -18), 40); }, [[0, 'steps', .6], [.4, 'steps', .5]]);
// 20 «Ich hab halt eine gute Haltung»: Marvin saca pecho, manos en la cadera, cuello tieso
shot(22.52, 'Z', 'punch', L => { plaza(L, 30, 37, -6, -16, 9); jungs(L, false); actuar(marvin, L.lt, [[0, { aLx: .3, aRx: .3, aLz: .9, aRz: .9, aLe: 1.9, aRe: 1.9, lean: -.12 }]], { T: L.T }); talk(marvin, L.T, 22.52, 23.71, 'smug');
  bubble(marvin, 'Gute Haltung!', (L.lt - .1) * 4); orbit(headC(marvin), lerp(15, 13, L.k), -.2, -.05, 44); sh(V(-6, 0, -18), 30); }, [[0, 'cloth', .5], [.3, 'hmm', .4]]);
// 21 «Seit wann, Marvin?»: el colega le mira de reojo; a Marvin le tiembla el cuello
shot(23.71, 'C', null, L => { plaza(L, 30, 39, -6, -16, 9); jungs(L, false); hals(marvin, 14, { T: L.T * 6, sway: .05 }); actuar(K[5], L.lt, [[0, 'cross']], { T: L.T }); K[5].root.rotation.y = .5; talk(K[5], L.T, 23.71, 24.69, 'sus'); actuar(marvin, L.lt, [[0, 'shrug']], { T: L.T }); cara(marvin, L.T, { expr: 'worried', eyes: 'side_r' }); sweat(marvin, L.T, 2);
  const a = headC(K[5]), b = headC(marvin); orbit(a.clone().lerp(b, .5), 22, .1, .06, 46); sh(V(-6, 0, -18), 30); }, [[0, 'hmm', .5], [.4, 'stretch_creak', .4]]);
// 22 «Und weil keiner mehr durch normale Türen passt»: un vecino entra por la puerta de su casa… y la cabeza choca contra la fachada
shot(24.69, 'W', null, L => { town(); volk(-36, -30, 18, 10, 30, L.T, 41); const k = K[7]; const w = walkC(k, Math.min(L.lt, .95), -46.4, -30, -PI / 2, 3.2, L.T); hals(k, 9, { T: L.T, sway: .02, bend: L.lt > .95 ? .7 : .8 }); cara(k, L.T, { expr: L.lt > .95 ? 'shock' : 'smile' });
  if (L.lt > .95) { stars_(headC(k), L.T); dust(headC(k), 24.69 + .95, L.T, 6, .3); } orbit(V(-50, 8, -30), lerp(24, 21, L.k), PI - .2, .1, 46); sh(V(-46, 0, -30), 30); }, [[0, 'steps', .5], [.95, 'thud', .7], [1.0, 'boing_metal', .4]]);
// 23 «passt,»: primer plano de su cara aplastada contra la pared (¡ay!)
shot(26.17, 'C', 'punch', L => { town(); const k = put(K[7], -49.6, 0, -30, -PI / 2); hals(k, 9, { T: L.T, sway: .01, bend: .62 }); actuar(k, L.lt, [[0, 'hands_head']], { T: L.T }); cara(k, L.T, { expr: 'cry' }); stars_(headC(k), L.T);
  orbit(headC(k), 8, PI, .05, 44); sh(V(-50, 0, -30), 20); }, [[0, 'slap', .5], [.3, 'cough', .3]]);
// 24 «hat jedes Haus eine zweite Haustür»: fachada con la puerta de arriba; una vecina mete la cabeza por ella
shot(27.09, 'Z', null, L => { town(); volk(-36, 34, 16, 10, 30, L.T, 43); const k = put(XT[1], -50.5, 0, 40, -PI / 2); const r = easeInOut(L.k); hals(k, 14, { T: L.T, sway: .01, bend: lerp(.0, .5, r) }); actuar(k, L.lt, [[0, 'wave']], { T: L.T }); cara(k, L.T, { expr: 'happy' });
  badge('tag', 'ZWEITE HAUSTÜR', W / 2, H * .17, (L.lt - .3) * 4); cm([-22, 10, 54, -52, 12, 40, 46], [-26, 16, 50, -53, 15, 40, 46], L.k); sh(V(-52, 0, 40), 30); }, [[0, 'door_open', .5], [.5, 'house_pop', .4]]);
// 25 «Ganz oben»: la cámara sube hasta la puerta de arriba: la cabeza entra en casa por arriba
shot(29.00, 'S', 'punch', L => { town(); const k = put(XT[1], -50.5, 0, 40, -PI / 2); hals(k, 14, { T: L.T, sway: .01, bend: .55 + L.k * .1 }); actuar(k, L.lt, [[0, 'idle']], { T: L.T }); cara(k, L.T, { expr: 'grin' });
  cam([-42, 19, 46], [-53, 17, 40], 44); sh(V(-52, 0, 40), 30); }, [[0, 'door_bell', .5]]);

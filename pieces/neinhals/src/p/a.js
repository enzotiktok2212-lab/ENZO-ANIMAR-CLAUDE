// ---------- a: gancho, la regla, los mentirosos y yo (0 – 58,89 s) ----------
// Plaza de Brauheim: centro (0, -10), fachadas en x = ±43, iglesia en z = -120. La cámara suele mirar hacia -z (iglesia y casas al fondo).
const sc_ = ch => ch.spec.scale || 1;
KU.T.visible = false;   // sin mesa: la cocina queda despejada
// valor que salta de a a b en t0 (muelle con rebote)
const grow = (lt, t0, a, b, d = .5) => a + (b - a) * spring(clamp((lt - t0) / d));
const neck = (c, L_, T, o = {}) => hals(c, L_, { T, bend: o.bend ?? .03, sway: o.sway ?? .05, ...o });
// sacudir la cabeza («nein») después de hals (hals fija la rotación de la cabeza)
const shake = (c, T, k = 1, sp = 20) => { c.head.rotation.y += Math.sin(T * sp) * .42 * k; };
const nod = (c, T, k = 1) => { c.head.rotation.x += Math.max(0, Math.sin(T * 14)) * .3 * k; };
const headTop = c => hp(c).add(V(0, .7 * sc_(c), 0));
const neinB = (c, k, txt_ = 'NEIN!', dy = 2.0) => bubble(c, txt_, k, dy);
const meters = (txt_, k, y = .24, kind = 'red', s = 1.1) => badge(kind, txt_, W / 2, H * y, k, 1, s);
const GRUMPY = () => CR[20];
// cámara que sigue la cabeza (centro entre pies y cabeza) a distancia d
function tall(c, d, yaw = 0, pitch = .05, fov = 50, f = .5) { const p = c.root.position, h = headTop(c), m = V(p.x, lerp(p.y, h.y, f), p.z); orbit(m, d, c.root.rotation.y + yaw, pitch, fov); }
// polvo al pegar el tirón
const jolt = (c, L, t) => dust(c.root.position.clone(), L.t0 + t, L.T, 8, .8);
// cartel de la regla en la plaza
const RULE = new THREE.Group(); scene.add(RULE); { const wd = mat(0x6a4224, { roughness: .7 }); for (const s of [-1, 1]) cyl(.45, .55, 20, wd, 10, RULE, s * 10, 10, 0); box(22, 12.4, .9, wd, .2, RULE, 0, 14, 0); box(24, .8, 3, mat(0x8a2a2a), .1, RULE, 0, 20.6, 0);
  const p = textPlane(20.4, 11, 1020, 550, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#12204a'); g.addColorStop(1, '#2a0a3a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    ntxt(c, 'STADTREGEL', w / 2, 70, 64, '#ffd23f'); ntxt(c, '1× NEIN', w * .3, 210, 76, '#ffffff'); ntxt(c, '+1 METER', w * .72, 210, 76, '#5aff9a'); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(60, 290, w - 120, 4);
    ntxt(c, '1× GELOGEN', w * .3, 390, 76, '#ffffff'); ntxt(c, '+10 METER', w * .72, 390, 86, '#ff4a4a'); ntxt(c, 'LÜGEN SIEHT HIER JEDER.', w / 2, 500, 44, '#ffd23f'); }, .25); p.position.set(0, 14, .5); RULE.add(p); }
P_(RULE); RULE.traverse(o => { if (o.isMesh) o.castShadow = true; });
// mini-escenario al atardecer: casa sola con el cuello enrollado (X = 10400)
const WHX = 10400; const WH = new THREE.Group(); WH.position.x = WHX; scene.add(WH); SETS.WH = WH;
{ const gr = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), mat(0x4a9a3a, { roughness: 1 })); gr.rotation.x = -Math.PI / 2; WH.add(gr);
  const wl = mat(0xf4e2c8, { roughness: .8 }); box(16, 12, 14, wl, .2, WH, 0, 6, 0); for (const s of [-1, 1]) { const r = box(10.6, .8, 15.6, mat(0xb8463a, { roughness: .7 }), .1, WH, s * 4.2, 15.2, 0); r.rotation.z = -s * .72; }
  { const sh_ = new THREE.Shape(); sh_.moveTo(-8, 0); sh_.lineTo(8, 0); sh_.lineTo(0, 7.4); sh_.lineTo(-8, 0); for (const z of [-7, 7]) { const t = new THREE.Mesh(new THREE.ExtrudeGeometry(sh_, { depth: .3, bevelEnabled: false }), wl); t.position.set(0, 12, z - .15); WH.add(t); } }
  box(1.6, 5, 1.6, mat(0x8a3a2a), .1, WH, 4, 17, -2); const lit = mat(0xffd890, { emissive: 0xffb84a, emissiveIntensity: 1.2 }); for (const [x, y] of [[-4.5, 4], [4.5, 4], [-4.5, 9.4], [4.5, 9.4]]) box(2.6, 2.6, .3, lit, .05, WH, x, y, 7.05); box(2.8, 5, .3, mat(0x6a3a1a), .05, WH, 0, 2.5, 7.05);
  for (let x = -14; x <= 14; x += 1.4) box(.3, 2.2, .2, mat(0xf4f0e8), .05, WH, x, 1.1, 14); for (const [x, z] of [[-20, -6], [20, 4], [-26, 18]]) { cyl(.6, .8, 6, mat(0x6a4a2a), 8, WH, x, 3, z); sphere(4, mat(0x2a7a3a, { roughness: 1 }), WH, x, 8, z, 12, 8); }
  for (let k = 0; k < 8; k++) { const hx = -70 + k * 20, hz = -60 - (k % 2) * 14; box(14, 10, 12, mat([0xf4e2c0, 0xf8d8d0, 0xdcecf4][k % 3], { roughness: .8 }), .2, WH, hx, 5, hz); for (let j = 0; j < 2; j++) box(2, 2, .2, lit, 0, WH, hx - 3 + j * 6, 6, hz + 6.1); }
  outline(WH, OS); WH.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); }
// cuello enrollado alrededor de la casa: tubo desde el cuello de c, dos vueltas subiendo y la cabeza dormida en el tejado
function wrapHouse(c, T) { c.root.updateMatrixWorld(true); const base = c.neck.getWorldPosition(V(0, 0, 0)); const pts = [base.clone(), base.clone().add(V(0, 3, 0)), V(WHX + 5, 9, 8.6)];
  for (let i = 0; i <= 24; i++) { const a = Math.PI * .3 + i / 24 * Math.PI * 3.4, y = 9 + i / 24 * 6; pts.push(V(WHX + Math.cos(a) * 10.6, y, Math.sin(a) * 9.4)); }
  pts.push(V(WHX - 2, 19.4, 3.5), V(WHX + .6, 21.0, 1.0)); const loc = pts.map(p => c.neck.worldToLocal(p.clone()));
  attach(WRAP, c.neck, [0, 0, 0], [0, 0, 0], 1); WRAP.material = SKINM; SKINM.color.setHex(c.spec.skin); setWrap(loc);
  const e = loc[loc.length - 1]; c.head.position.copy(e); c.head.rotation.set(-1.0, .2, .5); }
const zzz = (p, T) => ZZZ.forEach((z, i) => { const k = (T * .5 + i / 3) % 1; z.visible = true; z.position.copy(p).add(V(1 + k * 1.6, 1.2 + k * 2.6, k * .6)); z.scale.setScalar(.35 + k * .5); z.lookAt(camera.position); });
// pantalla del móvil: chat sospechoso
const drawChat = (c, w, h) => { c.fillStyle = '#eef2f8'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff5a8a'; c.fillRect(0, 0, w, 90); ntxt(c, 'LISA ♥', w / 2, 50, 38, '#ffffff');
  const bub = (y, t, me) => { c.font = `700 30px ${FONT}`; const tw = c.measureText(t).width + 40; const x = me ? w - tw - 16 : 16; c.fillStyle = me ? '#5ad87a' : '#ffffff'; c.beginPath(); c.roundRect(x, y, tw, 60, 26); c.fill(); c.fillStyle = '#1a1a1a'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(t, x + 20, y + 32); };
  bub(130, 'Hey Süßer 😘', false); bub(210, 'Heute Abend?', false); bub(290, 'Klar ❤️', true); bub(370, 'Sag es nicht Jana 🤫', false); };
const drawBurger = (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); ntxt(c, 'BURGER', w / 2, 70, 56, '#d8202a'); const y = h * .5; c.fillStyle = '#e8a040'; c.beginPath(); c.ellipse(w / 2, y - 40, 110, 60, 0, Math.PI, 0); c.fill(); c.fillStyle = '#4a2a1a'; c.fillRect(w / 2 - 115, y - 40, 230, 34); c.fillStyle = '#3ab84a'; c.fillRect(w / 2 - 120, y - 8, 240, 14); c.fillStyle = '#e8a040'; c.fillRect(w / 2 - 110, y + 6, 220, 30); ntxt(c, 'JETZT!', w / 2, h * .82, 60, '#d8202a'); };

// 1 «In dieser Stadt wird» (gancho): la plaza llena de gente con cuellos de todos los largos; en el centro, una chica dice «NEIN!» y su cuello sale disparado hacia arriba
shot(0, 'C', null, L => { town(L); const c = put(CR[0], 0, 0, 0, 0); const g = grow(L.lt, .22, 1.2, 30, .55); neck(c, g, L.T, { sway: .02 }); shake(c, L.T, clamp(1 - L.lt * 2)); neinB(c, clamp((L.lt - .05) / .15), 'NEIN!', 1.6);
  actuar(c, L.lt, [[0, { aLx: .4, aRx: .4, aLz: .3, aRz: .3 }], [.25, 'shock', { dur: .2 }]], { T: L.T }); cara(c, L.T, L.lt < .3 ? { expr: 'angry', mouth: 'o' } : { expr: 'shock', mouth: 'o' });
  crowdAt(L, 0, -4, 16, 9, 28, 3, { mode: i => ['talk', 'point', 'shock', 'idle'][i % 4], from: 1, neck: i => [3, 18, 8, 30, 12, 4, 24, 10, 34, 6, 15, 26, 2, 20, 9, 13][i], gap: .95 });
  const q = easeOut(clamp((L.lt - .18) / .6)); cm([0, 5.6, 17, 0, 5.4, 0, 50], [0, 14, 30, 0, 16, 0, 56], q); sh(V(0, 0, 0), 60); },
  [[0, 'boing', .5], [.08, 'shout_f', .5], [.22, 'stretch', .8], [.3, 'whoosh_up', .6], [.5, 'crowd_ohh', .4]]);
// 2 «dein Hals jedes Mal länger,»: un hombre con gorra niega con la cabeza; el cuello da un tirón hacia arriba (+1 m); la cámara sube con él
shot(1.16, 'W', 'punch', L => { town(L); const c = put(CR[3], 6, 0, -14, -.2); const g = grow(L.lt, .35, 7, 13, .4); neck(c, g, L.T, { bend: -.04 }); shake(c, L.T, clamp(1 - Math.abs(L.lt - .3) * 3)); cara(c, L.T, { expr: L.lt < .4 ? 'angry' : 'shock', mouth: L.lt < .4 ? 'flat' : 'o' });
  actuar(c, L.lt, [[0, 'cross'], [.4, 'shock', { dur: .2 }]], { T: L.T }); meters('+1 METER', (L.lt - .45) * 4, .2, 'green', 1); neinB(c, (L.lt - .02) * 5, 'NEIN!', 1.6);
  crowdAt(L, 6, -14, 8, 7, 18, 5, { mode: 'talk', from: 4, neck: i => [4, 16, 8, 24, 2, 12, 20, 6][i] });
  tall(c, lerp(26, 22, L.k), .25, .02, 50, lerp(.45, .62, easeOut(L.k))); sh(V(6, 0, -14), 40); }, [[0, 'thump', .5], [.35, 'stretch_creak', .8], [.45, 'boing', .4]]);
// 3 «wenn du Nein sagst.»: delante de la panadería, la Oma le ofrece patatas a un chico; él dice «NEIN» y ¡pop!, cuello más largo
shot(2.4, 'S', null, L => { town(L); const c = put(CR[5], -20, 0, 2, -Math.PI / 2 + .9); c.root.scale.setScalar(.8); const o = put(CR[8], -27, 0, 4, Math.PI / 2 - .5); const t = .35; const g = grow(L.lt, t, 1, 11, .45); neck(c, g, L.T); shake(c, L.T, clamp(1 - Math.abs(L.lt - t) * 3));
  attach(PLATE, o.aR.hand, [0, -.7, .5], [0, 0, 0], .8); actuar(o, L.lt, [[0, { aRx: 1.2, aRe: .3 }]], { T: L.T }); cara(o, L.T, { expr: L.lt < t ? 'happy' : 'shock', mouth: L.lt < t ? 'open_smile' : 'o' }); neck(o, 3, L.T);
  actuar(c, L.lt, [[0, { aLx: .6, aLe: 1.4, aRx: .6, aRe: 1.4, aLz: -.4, aRz: -.4 }], [t, 'shock', { dur: .2 }]], { T: L.T }); cara(c, L.T, { expr: L.lt < t ? 'angry' : 'shock', mouth: 'o' }); neinB(c, (L.lt - .25) * 5, 'NEIN!', 1.4);
  crowdAt(L, -26, -8, 4, 6, 12, 9, { mode: 'talk', from: 10, neck: i => [6, 14, 3, 20][i], gap: 2.2 });
  cm([-23.5, 6.5, 21, -23.5, 4.5 + g * .3, 3, 50], [-23.5, 7, 18.5, -23.5, 5 + g * .35, 3, 50], L.k); sh(V(-23, 0, 2), 30); }, [[0, 'swipe', .4], [.3, 'shout', .5], [.38, 'stretch', .7], [.45, 'pop', .5]]);
// 4 «Siehst du den Mann da?»: por encima del hombro de alguien que señala, al fondo un hombre con el cuello por encima de los tejados
shot(3.6, 'Z', null, L => { town(L); const p = put(CR[10], -3.2, 0, 17, Math.PI + .35); actuar(p, L.lt, [[0, 'point']], { T: L.T }); cara(p, L.T, { expr: 'shock', mouth: 'o' }); neck(p, 2, L.T);
  const m = put(mann, 10, 0, -40, .2); neck(m, 52, L.T, { bend: .05, sway: .04 }); cara(m, L.T, { expr: 'tired' }); actuar(m, L.lt, [[0, 'idle']], { T: L.T });
  crowdAt(L, 6, -30, 10, 8, 22, 11, { mode: 'idle', from: 12, neck: i => [4, 12, 26, 8, 18, 3, 30, 10, 6, 15][i] });
  const q = easeInOut(L.k); cm([-7.5, 9, 31, 6, lerp(10, 30, q), -36, 50], [-7, 9.5, 29.5, 8, lerp(14, 38, q), -38, 48], q); sh(V(4, 0, -10), 60); }, [[0, 'zoom_in', .5], [.2, 'hey', .4]]);
// 5 «Sein Hals ist so lang, weil er ständig»: el hombre de la camisa de cuadros: la cámara sube desde los pies por todo el cuello hasta la cabeza, por encima de los tejados
shot(4.54, 'C', 'punch', L => { town(L); const m = put(mann, 0, 0, -16, 0); neck(m, 52, L.T, { bend: .04, sway: .04 }); cara(m, L.T, { expr: 'tired', eyes: 'half' }); actuar(m, L.lt, [[0, 'idle']], { T: L.T });
  crowdAt(L, 0, -16, 8, 8, 20, 13, { mode: 'shock', from: 0, neck: i => [3, 8, 12, 2, 16, 6, 10, 4][i], face: V(0, 40, -16) });
  const q = easeInOut(L.k); const ht = headTop(m); cam([0, lerp(5, ht.y - 8, q), 30], [0, lerp(6, ht.y - 2, q), -16], 50); sh(V(0, 0, -16), 40); }, [[0, 'impact', .5], [.1, 'whoosh_up', .5], [.6, 'stretch_creak', .4]]);
// 6 «Nein zu seiner Schwiegermutter sagt.»: en la puerta de casa, la suegra le riñe; él baja la cabeza desde lo alto, dice «NEIN» y el cuello sube otro tirón
shot(6.24, 'W', null, L => { town(L); const s = put(schw, -9, 0, -6, Math.PI / 2); const m = put(mann, 11, 0, -6, -Math.PI / 2); const t = .28; const g = grow(L.lt, t, 24, 30, .45); neck(m, g, L.T, { bend: lerp(2.45, 1.0, easeOut(clamp((L.lt - t) * 2.5))), sway: .02 }); shake(m, L.T, clamp(1 - Math.abs(L.lt - .15) * 4));
  cara(m, L.T, { expr: L.lt < t ? 'angry' : 'shock', mouth: L.lt < t ? 'open' : 'o' }); actuar(m, L.lt, [[0, 'cross']], { T: L.T }); neinB(m, (L.lt - .05) * 5, 'NEIN!', 1.4);
  talk(s, L.T, L.t0, L.t1, 'angry'); actuar(s, L.lt, [[0, { aRx: 1.6, aRz: .1, aRe: .3 + Math.sin(L.T * 12) * .3, aLx: .3, aLe: 1.6 }]], { T: L.T }); neck(s, 2, L.T);
  meters('+1 METER', (L.lt - .4) * 4, .2, 'green', .9);
  cm([0, 9, 34, 0, 9, -6, 52], [0, 10, 31, 0, 11, -6, 52], L.k); sh(V(0, 0, -6), 30); }, [[0, 'whoosh_soft', .4], [.05, 'argue', .5], [.25, 'shout_m', .5], [.3, 'stretch', .7]]);
// 7 «Manche Hälse sind höher als die»: contrapicado: cuellos que suben más altos que las casas, cabezas recortadas contra el cielo
shot(8.02, 'R', null, L => { town(L); [[-14, -20, 46], [8, -30, 54], [22, -10, 40], [-26, -6, 36], [0, -46, 60], [-8, 4, 30]].forEach(([x, z, n], i) => { const c = put(CR[14 + i], x, 0, z, Math.atan2(-x, 30 - z)); neck(c, n, L.T, { bend: (i % 3 - 1) * .08, sway: .06 }); cara(c, L.T + i, { expr: ['happy', 'neutral', 'tired'][i % 3] }); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); });
  const a = lerp(-.25, .1, L.k); cam([Math.sin(a) * 6, 2.4, 26], [Math.sin(a) * 30, 40, -20], 62); sh(V(0, 0, -16), 60); }, [[0, 'whirl', .4], [.1, 'wind', .4], [.5, 'birds', .4]]);
// 8 «Häuser.»: a la altura de los tejados: las cabezas asoman entre las chimeneas, una saluda a la otra
shot(9.58, 'F', null, L => { town(L); [[-7, -22, 27], [5, -28, 30], [12, -16, 26], [-14, -32, 31], [0, -12, 24]].forEach(([x, z, n], i) => { const c = put(CR[20 + i], x, 0, z, Math.atan2(-x, 20 - z) + (i % 2 ? .4 : -.4)); neck(c, n, L.T, { bend: .05, sway: .05 }); cara(c, L.T + i, { expr: 'happy', mouth: i % 2 ? 'open_smile' : 'smile' }); actuar(c, L.lt, [[0, i === 1 ? 'wave' : 'idle']], { T: L.T }); });
  cm([0, 27, 18, 0, 27, -22, 50], [0, 27.5, 14, 0, 27.5, -22, 50], L.k); sh(V(0, 0, -20), 50); }, [[0, 'flash', .4], [.1, 'birds', .4], [.4, 'hey', .3]]);
// 9 «Und andere müssen ihren Hals um das ganze»: atardecer: una casa con un cuello enrollado dos veces alrededor, la cámara gira
shot(10.82, 'Z', null, L => { use('WH'); dusk(); const c = put(CR[25], WHX + 3, 0, 12, 0); wrapHouse(c, L.T); actuar(c, L.lt, [[0, { aLx: .1, aRx: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'tired', eyes: 'closed', mouth: 'flat' });
  const a = lerp(.75, .35, easeInOut(L.k)); cam([WHX + Math.sin(a) * 44, 18, Math.cos(a) * 44], [WHX, 10, 0], 46); sh(V(WHX, 0, 0), 40); }, [[0, 'whoosh_soft', .4], [.1, 'crickets', .4], [.5, 'stretch_creak', .4]]);
// 10 «Haus wickeln, nur um schlafen zu können.»: de cerca: la cabeza dormida sobre el tejado, Zzz, la luna
shot(12.8, 'I', null, L => { use('WH'); dusk(); setSky([.1, .12, .42], [.6, .36, .56], [1, .56, .34]); const c = put(CR[25], WHX + 3, 0, 12, 0); wrapHouse(c, L.T); cara(c, L.T, { expr: 'tired', eyes: 'closed', mouth: 'o' }); const h = hp(c); zzz(h.clone().add(V(0, 1, 0)), L.T);
  cm([WHX + 12, 26, 20, h.x, h.y + .4, h.z, 40], [WHX + 9, 24.5, 15, h.x, h.y + .4, h.z, 38], L.k); sh(V(WHX, 0, 0), 30); }, [[0, 'iris_pop', .3], [.1, 'snore', .6], [.6, 'zzz', .5]]);
// 11 «Und wenn dein Nein gelogen ist?» (zoom lento): un chico esconde a la espalda un Brezel mordido; el panadero le pregunta; él niega sudando
shot(14.77, 'S', 'slow', L => { town(L); const c = put(CR[12], -28, 0, -8, .6); c.root.scale.setScalar(.82); neck(c, 1.5, L.T); attach(BROT, c.aR.hand, [0, -.8, -.3], [0, 0, 0], 1); actuar(c, L.lt, [[0, { aRx: -.8, aRz: .1, aRe: .4, aLx: .1 }]], { T: L.T }); shake(c, L.T, .6, 12); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T);
  const b = put(CR[16], -20, 0, -14, -1.0); neck(b, 6, L.T); actuar(b, L.lt, [[0, { aRx: 1.5, aRe: .2, aLx: .4, aLe: 1.6, aLz: -.4 }]], { T: L.T }); cara(b, L.T, { expr: 'sus' }); neinB(c, (L.lt - .55) * 4, 'NEIN…', 1.4);
  orbit(V(-26, 4.4, -10), lerp(18, 13, easeIn(L.k)), .35, .06, 46); sh(V(-25, 0, -10), 25); }, [[0, 'tsk', .4], [.4, 'gulp_nervous', .6], [.9, 'heartbeat', .5]]);
// 12 «Dann gleich zehn Meter!»: ¡ZAS! su cuello sale disparado diez metros de golpe; «+10 METER»
shot(16.32, 'C', 'punch', L => { town(L); const c = put(CR[12], -28, 0, -8, .6); c.root.scale.setScalar(.82); const g = grow(L.lt, .3, 1.5, 30, .5); neck(c, g, L.T, { sway: .03 }); attach(BROT, c.aR.hand, [0, -.8, -.3], [0, 0, 0], 1); actuar(c, L.lt, [[0, { aRx: -.8, aRz: .1, aRe: .4 }], [.3, 'shock', { dur: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  const b = put(CR[16], -20, 0, -14, -1.0); neck(b, 6, L.T); actuar(b, L.lt, [[0, 'shock']], { T: L.T }); cara(b, L.T, { expr: 'shock', mouth: 'o' }); jolt(c, L, .3);
  crowdAt(L, -26, -8, 4, 9, 16, 17, { mode: 'shock', from: 0, neck: i => [2, 4, 3, 2][i], face: V(-28, 20, -8), gap: 2 });
  meters('+10 METER', (L.lt - .55) * 3.5, .16, 'red', 1.2); const q = easeOut(clamp((L.lt - .25) / .6)); cm([-14, 5, 10, -26, 5, -9, 52], [-12, 12, 20, -27, 15, -9, 56], q); sh(V(-26, 0, -9), 30); },
  [[0, 'impact', .6], [.3, 'stretch', .9], [.32, 'boing', .5], [.55, 'pop_big', .5], [.7, 'crowd_ohh', .4]]);
// 13 «Und jeder kennt so jemanden,»: la gente de la plaza mira y señala a un señor gruñón sentado en un banco
shot(17.73, 'W', null, L => { town(L); const g_ = GRUMPY(); sit(g_, -18, 2.4, 0, Math.PI / 2, L, { aLx: .4, aRx: .4, aLz: -.3, aRz: -.3, aLe: 1.8, aRe: 1.8 }); neck(g_, 24, L.T, { bend: .02 }); cara(g_, L.T, { expr: 'angry', mouth: 'flat' });
  crowdAt(L, -10, 0, 9, 7, 16, 19, { mode: i => i % 2 ? 'point' : 'talk', from: 0, face: V(-18, 12, 0), neck: i => [2, 6, 3, 9, 4, 12, 2, 5, 8][i], gap: 1.9 });
  orbit(V(-16, 8, 0), lerp(28, 24, L.k), .15, .1, 50); sh(V(-14, 0, 0), 40); }, [[0, 'whoosh', .4], [.2, 'crowd_murmur', .4], [.6, 'hmm', .4]]);
// 14 «der zu allem Nein sagt.»: tres vecinos le ofrecen algo (flores, un Brezel, una pelota): «NEIN! NEIN! NEIN!» y el cuello sube a tirones
shot(19.0, 'F', null, L => { town(L); const g_ = GRUMPY(); sit(g_, -18, 2.4, 0, Math.PI / 2, L, { aLx: .4, aRx: .4, aLz: -.3, aRz: -.3, aLe: 1.8, aRe: 1.8 }); const st = [.1, .45, .8]; let n = 24; st.forEach(t => { n += grow(L.lt, t, 0, 4, .3); }); neck(g_, n, L.T, { bend: .02 }); shake(g_, L.T, 1, 22); cara(g_, L.T, { expr: 'angry', mouth: 'o' });
  [[-10, -6], [-9, 1], [-10, 8]].forEach(([x, z], i) => { const c = put(CR[30 + i], x, 0, z, -Math.PI / 2 + (i - 1) * .3); neck(c, [3, 5, 2][i], L.T); actuar(c, L.lt, [[0, { aRx: 1.5, aRe: .2 }]], { T: L.T }); cara(c, L.T, { expr: L.lt > st[i] + .1 ? 'sad' : 'happy', mouth: L.lt > st[i] + .1 ? 'flat' : 'open_smile' }); if (i === 1) attach(BROT, c.aR.hand, [0, -.8, .4], [0, 0, 0], 1); });
  st.forEach((t, i) => badge('red', 'NEIN!', W * [.3, .7, .5][i], H * [.36, .3, .44][i], (L.lt - t) * 5, 1, .8));
  orbit(V(-14, 10, 0), lerp(30, 27, L.k), .4, .12, 50); sh(V(-14, 0, 0), 30); }, [[.08, 'shout_m', .5], [.12, 'stretch_creak', .6], [.45, 'shout_m', .5], [.47, 'stretch_creak', .6], [.8, 'shout_m', .5], [.82, 'stretch', .6]]);
// 15 «Hier wäre sein Kopf längst über den Wolken.»: arriba del todo: su cabeza asoma por encima de las nubes, con pájaros
shot(20.36, 'Z', null, L => { town(L); const g_ = GRUMPY(); sit(g_, -18, 2.4, 0, Math.PI / 2, L, { aLx: .4, aRx: .4 }); neck(g_, 110, L.T, { bend: .01, sway: .015 }); cara(g_, L.T, { expr: 'angry', mouth: 'flat' }); const h = hp(g_);
  CLOUDS.forEach((c, i) => { const a = i / 14 * 6.283 * 2.3 + .4, r = 9 + (i % 4) * 9; show(c, h.x + Math.cos(a) * r, h.y - 8 - (i % 3) * 1.5, h.z + Math.sin(a) * r, i, .7 + (i % 3) * .2); });
  const a = lerp(-.2, .2, L.k); cam([h.x + Math.sin(a + 1.57) * 22, h.y + 3, h.z + Math.cos(a + 1.57) * 22], [h.x, h.y - 3, h.z], 50); sh(h.clone().setY(0), 40); BIRDSON = 1; }, [[0, 'whoosh_up', .5], [.2, 'wind_rise', .5], [.5, 'birds', .4]]);
// 16 «Wer ist das bei dir?»: la cabeza gruñona entre las nubes se gira y mira a cámara; un «?» enorme
shot(22.37, 'I', 'punch', L => { town(L); const g_ = GRUMPY(); sit(g_, -18, 2.4, 0, Math.PI / 2, L, { aLx: .4, aRx: .4 }); neck(g_, 110, L.T, { bend: .01, sway: .015 }); g_.head.rotation.y += lerp(0, .9, easeOut(clamp(L.lt / .3))); cara(g_, L.T, { expr: 'sus', mouth: 'flat' }); const h = hp(g_);
  CLOUDS.forEach((c, i) => { const a = i / 14 * 6.283 * 2.3 + .4, r = 9 + (i % 4) * 9; show(c, h.x + Math.cos(a) * r, h.y - 8 - (i % 3) * 1.5, h.z + Math.sin(a) * r, i, .7 + (i % 3) * .2); });
  const fa = Math.PI / 2 + .9; cam([h.x + Math.sin(fa) * lerp(11, 9, L.k), h.y + 1.2, h.z + Math.cos(fa) * lerp(11, 9, L.k)], [h.x, h.y + .2, h.z], 42); badge('q', '?', W * .74, H * .3, (L.lt - .2) * 4, 1, 1.2); sh(h.clone().setY(0), 30); }, [[0, 'iris_pop', .4], [.15, 'question', .6]]);
// 17 «Lügen kann hier nämlich niemand.»: el cartel de la regla de la ciudad: NEIN = +1 m, GELOGEN = +10 m; la gente pasa por delante
shot(23.32, 'S', null, L => { town(L); show(RULE, 0, 0, -30, 0); [[-12, -22], [12, -20], [-15, -12], [14, -10]].forEach(([x, z], i) => { const p = put(CR[i + 2], x, 0, z, Math.atan2(-x, -30 - z)); neck(p, [3, 8, 5, 12][i], L.T, { bend: -.1 }); actuar(p, L.lt, [[0, i % 2 ? 'point' : 'think']], { T: L.T }); cara(p, L.T, { expr: 'shock', mouth: 'o' }); });
  cm([-6, 9, 8, 0, 14, -30, 48], [2, 11, 4, 0, 14.4, -30, 46], L.k); sh(V(0, 0, -24), 40); DOF = 0; }, [[0, 'swipe', .4], [.1, 'power_on', .4], [.5, 'pling', .4]]);
// 18 «Am schwersten haben es die Mamas.»: en la cocina, una mamá con el cuello largo doblado bajo el techo remueve la olla; los niños alrededor
shot(24.95, 'F', null, L => { kuecheS(L); const m = put(mama, 1400 - 4, 0, -6, .3); neck(m, 9, L.T, { bend: .35, sway: .03 }); actuar(m, L.lt, [[0, { aRx: 1.1, aRe: .9 + Math.sin(L.T * 8) * .3, aRz: .2, aLx: .3 }]], { T: L.T }); cara(m, L.T, { expr: 'tired', mouth: 'flat' });
  [[1400 + 4, -1, -.8], [1400 + 8, 2, -1.0]].forEach(([x, z, r], i) => { const k_ = put(CR[i * 2 + 1], x, 0, z, r); k_.root.scale.setScalar(.72); actuar(k_, L.lt, [[0, i ? 'wave' : 'point']], { T: L.T }); cara(k_, L.T, { expr: 'happy', mouth: 'open_smile' }); });
  cm([1400 + 5, 9, 18, 1400, 8, -5, 50], [1400 + 3, 9, 15, 1400, 8, -5, 48], L.k); sh(V(1400, 0, -4), 25); }, [[0, 'flash', .3], [.1, 'pan_sizzle', .4], [.5, 'kids_chatter', .4]]);
// 19 «„Nein, wir haben Essen zu Hause.“»: el niño le enseña una hamburguesa en el móvil; ella señala la olla: «NEIN» (+1 m)
shot(26.59, 'W', null, L => { kuecheS(L); const m = put(mama, 1400 - 4, 0, -6, .5); const t = .1; neck(m, grow(L.lt, t + .25, 9, 11.5, .4), L.T, { bend: .3 }); shake(m, L.T, clamp(1 - Math.abs(L.lt - .25) * 3)); actuar(m, L.lt, [[0, { aRx: 1.4, aRz: -.6, aRe: .2, aLx: .4, aLe: 1.6, aLz: -.4 }]], { T: L.T }); talk(m, L.T, L.t0, L.t1, 'angry');
  const k_ = put(CR[1], 1400 + 4, 0, -1, -1.0); k_.root.scale.setScalar(.72); handyP(k_); PH.userData.S.draw('burger', drawBurger); actuar(k_, L.lt, [[0, { aRx: 1.5, aRe: .3, aRz: .1 }]], { T: L.T }); cara(k_, L.T, { expr: 'happy', mouth: 'open_smile' });
  neinB(m, (L.lt - .05) * 5, 'NEIN!', 1.2); meters('+1 METER', (L.lt - .5) * 4, .2, 'green', .9);
  cm([1400 + 3, 8, 15, 1400, 8, -4, 48], [1400 + 2.5, 8, 13, 1400, 8.4, -4, 46], L.k); sh(V(1400, 0, -4), 25); }, [[0, 'whoosh_soft', .4], [.05, 'shout_f', .4], [.35, 'stretch_creak', .6]]);
const handyP = (ch, s = 1) => attach(PH, ch.aR.hand, [0, -.62, .3], [-1.35, Math.PI, 0], s);
// 20 «„Nein, du gehst heute nicht raus.“»: el niño en la puerta con el balón; la mamá le corta el paso con el brazo: «NEIN» (+1 m)
shot(27.95, 'S', null, L => { kuecheS(L); const m = put(mama, 1400 + 8, 0, -6, -1.0); neck(m, grow(L.lt, .9, 11.5, 14, .4), L.T, { bend: .3 }); shake(m, L.T, clamp(1 - Math.abs(L.lt - .8) * 3)); actuar(m, L.lt, [[0, { aRx: 1.6, aRz: 1.2, aRe: 0 }]], { T: L.T }); talk(m, L.T, L.t0, L.t1, 'angry');
  const k_ = put(CR[3], 1400 + 1, 0, -3, .9); k_.root.scale.setScalar(.72); actuar(k_, L.lt, [[0, { aLx: .9, aLe: 1.2, aLz: -.3, aRx: .2 }]], { T: L.T }); cara(k_, L.T, { expr: 'sad', mouth: 'flat' });
  const ball = DUST[0]; neinB(m, (L.lt - .05) * 5, 'NEIN!', 1.2); meters('+1 METER', (L.lt - 1.1) * 4, .2, 'green', .9);
  cm([1400 + 2, 8, 14, 1400 + 5, 8, -5, 48], [1400 + 2.5, 8, 12.5, 1400 + 5, 8.4, -5, 46], L.k); sh(V(1400, 0, -4), 25); }, [[0, 'swipe', .4], [.1, 'door_close', .4], [.8, 'stretch_creak', .6]]);
// 21 «Und dann:»: primer plano: la mamá cruza los brazos, ceño fruncido
shot(29.94, 'C', 'punch', L => { kuecheS(L); const m = put(mama, 1400, 0, -6, 0); neck(m, 6, L.T, { bend: .3 }); actuar(m, L.lt, [[0, 'cross']], { T: L.T }); cara(m, L.T, { expr: 'angry', mouth: 'flat' });
  onFace(m, 6, 0, 0, 40, L.k); sh(V(1400, 0, -6), 20); }, [[0, 'thump', .5], [.1, 'tsk', .4]]);
// 22 «„Nein, ich bin nicht sauer.“» (zoom lento): sonrisa forzada, ceja temblando, vapor saliendo de la cabeza
shot(30.62, null, 'slow', L => { kuecheS(L); const m = put(mama, 1400, 0, -6, 0); neck(m, 6, L.T, { bend: .3 }); actuar(m, L.lt, [[0, 'cross']], { T: L.T }); cara(m, L.T, { expr: 'angry', eyes: 'angry', mouth: kitLips(L.T, spoken(L.t0, L.t1)) || 'grin' }); const h = hp(m);
  VAPOR.forEach((v, i) => { const k = (L.T * .9 + i / 7) % 1; v.visible = i < 8; v.position.copy(h).add(V((i % 2 ? .8 : -.8) * (1 + k), 1.6 + k * 3, 0)); v.scale.setScalar(.3 + k * .7); v.material.opacity = .7 * (1 - k); });
  onFace(m, lerp(7, 5, easeIn(L.k)), 0, 0, 40); sh(V(1400, 0, -6), 20); }, [[0, 'steam', .5], [.6, 'heartbeat', .4]]);
// 23 «Zack. Zehn Meter.»: ¡ZAS! el cuello sale disparado hasta el techo y se dobla contra él; «+10 METER»
shot(32.51, 'C', 'punch', L => { kuecheS(L); const m = put(mama, 1400, 0, -6, 0); const g = grow(L.lt, .05, 6, 30, .5); const ceil = 16 - 4.3 * sc_(m); const up = Math.min(g, ceil / sc_(m)); neck(m, g, L.T, { bend: g > up ? lerp(.3, 1.4, clamp((g - up) / 14)) : .3, sway: .02 }); actuar(m, L.lt, [[0, 'cross'], [.05, 'shock', { dur: .15 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'o' });
  meters('+10 METER', (L.lt - .45) * 4, .2, 'red', 1.2); jolt(m, L, .05);
  cm([1400, 3.5, 9, 1400, 8.5, -6, 64], [1400, 3.8, 9, 1400, 9, -6, 64], L.k); sh(V(1400, 0, -6), 20); }, [[0, 'impact', .6], [.05, 'stretch', .9], [.4, 'thud', .6], [.5, 'pop_big', .5]]);
// 24 «Mein Nachbar:»: Herr Vogt delante de su casa, con gafas de sol, saluda; detrás, un deportivo plateado
shot(34.17, 'W', null, L => { barrioS(L); const v = put(vogt, 3800, 0, 4, 0); neck(v, 2, L.T); actuar(v, L.lt, [[0, 'wave']], { T: L.T }); cara(v, L.T, { expr: 'happy', mouth: 'grin' }); show(PORSCHE, 3800 + 12, 0, -4, -.6);
  onBody(v, 16, .2, .1, 46, L.k); sh(V(3800, 0, 0), 30); }, [[0, 'whoosh', .4], [.1, 'birds', .3], [.3, 'hey', .4]]);
// 25 «„Nein, ich will keinen Porsche.“»: niega con la mano levantada… pero no le quita ojo al Porsche y suda
shot(35.01, 'S', null, L => { barrioS(L); const v = put(vogt, 3800, 0, 4, .5); neck(v, 2, L.T); shake(v, L.T, .7, 14); v.head.rotation.y += .5; actuar(v, L.lt, [[0, { aRx: 1.5, aRz: -.3, aRe: .1, aLx: .2 }]], { T: L.T }); talk(v, L.T, L.t0, L.t1, 'worried'); sweat(v, L.T);
  show(PORSCHE, 3800 + 12, 0, -4, -.6); neinB(v, (L.lt - .05) * 5, 'NEIN!', 1.4);
  orbit(V(3803, 4.5, 1), lerp(24, 21, L.k), -.9, .08, 46); sh(V(3806, 0, 0), 30); }, [[0, 'swipe', .4], [.4, 'gulp_nervous', .5], [1.4, 'car_horn', .3]]);
// 26 «Zehn Meter.»: ¡ZAS! su cuello sube diez metros de golpe
shot(37.47, 'C', 'punch', L => { barrioS(L); const v = put(vogt, 3800, 0, 4, .5); const g = grow(L.lt, .02, 2, 26, .45); neck(v, g, L.T, { sway: .02 }); actuar(v, L.lt, [[0, 'shock']], { T: L.T }); cara(v, L.T, { expr: 'shock', mouth: 'o' }); show(PORSCHE, 3800 + 12, 0, -4, -.6);
  meters('+10 METER', (L.lt - .3) * 4, .22, 'red', 1.1); jolt(v, L, .02); const q = easeOut(clamp(L.lt / .6)); cm([3800 + 6, 5, 26, 3800 + 2, 6, 2, 52], [3800 + 6, 13, 36, 3800 + 2, 16, 2, 52], q); sh(V(3804, 0, 0), 30); },
  [[0, 'impact', .6], [.02, 'stretch', .9], [.3, 'pop_big', .5]]);
// 27 «Klar.»: allá arriba, Vogt sonríe avergonzado mirando el Porsche desde lo alto
shot(38.35, 'F', null, L => { barrioS(L); const v = put(vogt, 3800, 0, 4, .5); neck(v, 26, L.T, { bend: .3 }); actuar(v, L.lt, [[0, 'shrug']], { T: L.T }); cara(v, L.T, { expr: 'happy', mouth: 'grimace' }); show(PORSCHE, 3800 + 12, 0, -4, -.6);
  const h = hp(v); cm([h.x + 10, h.y + 2, h.z + 12, h.x, h.y, h.z, 44], [h.x + 9, h.y + 2, h.z + 10.5, h.x, h.y, h.z, 44], L.k); sh(V(3804, 0, 0), 30); }, [[0, 'flash', .3], [.1, 'chuckle_m', .5]]);
// 28 «Wer will denn bitte keinen Porsche?»: el Porsche plateado, de cerca y en contrapicado, brilla; «PORSCHE»
shot(38.97, 'Z', null, L => { barrioS(L); show(PORSCHE, 3800 + 12, 0, -4, -.6); const v = put(vogt, 3800, 0, 4, .5); neck(v, 26, L.T, { bend: .6 }); cara(v, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); actuar(v, L.lt, [[0, 'hold']], { T: L.T });
  SPARK.forEach((s, i) => { if (i > 5) return; const k = (L.T * 1.4 + i / 6) % 1; s.visible = true; s.position.set(3800 + 12 + [-3, 2, 4, -1, 1.5, -2.5][i], [2.6, 3.2, 2.0, 2.9, 1.6, 2.2][i], -4 + [3, -2, 4, -4, 5, 0][i]); s.scale.setScalar(Math.sin(k * Math.PI) * 2); });
  const a = lerp(-.9, -.3, easeInOut(L.k)); cam([3812 + Math.sin(a) * 15, 3.4, -4 + Math.cos(a) * 15], [3812, 2.6, -4], 44); badge('gold', 'PORSCHE', W / 2, H * .22, (L.lt - .3) * 4, 1, 1.1); sh(V(3812, 0, -4), 20); }, [[0, 'zoom_in', .4], [.1, 'engine', .5], [.4, 'sparkle', .5]]);
// 29 «Aber am schlimmsten hat es Timo erwischt.»: atardecer en la plaza: Timo en un banco junto a Jana, nervioso con el móvil
shot(40.52, 'W', null, L => { town(L, { dusk: true }); sit(timo, 20, 2.4, 6, -Math.PI / 2, L, { aRx: 1.0, aRe: 1.2, aLx: .4 }); neck(timo, 2, L.T); handyP(timo); PH.userData.S.draw('chat', drawChat); cara(timo, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(timo, L.T);
  sit(jana, 20, 2.4, 10.4, -Math.PI / 2, L, { aLx: .4, aRx: .4 }); neck(jana, 2, L.T); jana.head.rotation.y = -.5; cara(jana, L.T, { expr: 'sus' });
  orbit(V(19, 4.6, 8.2), lerp(17, 15, L.k), -.55, .1, 44); sh(V(18, 0, 8), 25); }, [[0, 'whoosh_soft', .4], [.2, 'phone_vibrate', .5], [1.2, 'gulp_nervous', .4]]);
// 30 «Seine Freundin fragt:»: Jana le quita el móvil de la mano, desconfiada
shot(42.41, 'C', null, L => { town(L, { dusk: true }); sit(timo, 20, 2.4, 6, -Math.PI / 2, L, { aRx: lerp(1.0, .4, clamp(L.lt * 3)), aRe: 1.0 }); neck(timo, 2, L.T); cara(timo, L.T, { expr: 'shock', mouth: 'o' }); sit(jana, 20, 2.4, 10.4, -Math.PI / 2 - .3, L, { aRx: 1.3, aRe: .5, aRz: .3, aLx: .4 }); neck(jana, 2, L.T); handyP(jana); PH.userData.S.draw('chat', drawChat); talk(jana, L.T, L.t0, L.t1, 'angry');
  orbit(V(18, 5.4, 8.2), 15, -.3, .12, 42); sh(V(18, 0, 8), 20); }, [[0, 'thump', .4], [.1, 'cloth', .4]]);
// 31 «„Schreibst du mit einer anderen?“»: la pantalla del móvil: «LISA ♥ — Hey Süßer 😘»
shot(43.49, 'Z', null, L => { town(L, { dusk: true }); sit(jana, 20, 2.4, 10.4, -Math.PI / 2 - .3, L, { aRx: 1.3, aRe: .5, aRz: .3 }); neck(jana, 2, L.T); handyP(jana, 1.4); PH.userData.S.draw('chat', drawChat); cara(jana, L.T, { expr: 'angry' });
  PH.updateMatrixWorld(true); const p = wpos(PH), nrm = V(0, 0, 1).applyQuaternion(PH.getWorldQuaternion(new THREE.Quaternion())); const d = lerp(4.2, 3.4, L.k); cam([p.x + nrm.x * d, p.y + nrm.y * d, p.z + nrm.z * d], [p.x, p.y, p.z], 40); camera.up.copy(V(0, 1, 0).applyQuaternion(PH.getWorldQuaternion(new THREE.Quaternion()))); camera.lookAt(p); sh(V(18, 0, 8), 20); DOF = 0; },
  [[0, 'notif', .6], [.4, 'message', .4]]);
// 32 «„Nein.“»: Timo niega con la cabeza, tragando saliva
shot(44.62, 'C', 'punch', L => { town(L, { dusk: true }); sit(timo, 20, 2.4, 6, -Math.PI / 2, L, { aRx: .4, aLx: .4 }); neck(timo, 2, L.T); shake(timo, L.T, 1, 22); cara(timo, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(timo, L.T); neinB(timo, L.lt * 6, 'NEIN.', 1.3);
  onFace(timo, 6, 0, 0, 40, L.k); sh(V(20, 0, 6), 20); }, [[0, 'gulp_nervous', .6]]);
// 33 «Zehn Meter.»: ¡ZAS! el cuello de Timo sale disparado
shot(45.15, 'C', 'punch', L => { town(L, { dusk: true }); sit(timo, 20, 2.4, 6, -Math.PI / 2, L, { aRx: .4, aLx: .4 }); neck(timo, grow(L.lt, .02, 2, 26, .4), L.T); cara(timo, L.T, { expr: 'shock', mouth: 'o' }); sit(jana, 20, 2.4, 10.4, -Math.PI / 2, L, { aLx: .4 }); neck(jana, 2, L.T); cara(jana, L.T, { expr: 'shock', mouth: 'o' });
  meters('+10 METER', (L.lt - .25) * 5, .2, 'red', 1.1); const q = easeOut(clamp(L.lt / .5)); cm([4, 6, 18, 19, 6, 7, 52], [-2, 12, 24, 19, 16, 7, 56], q); sh(V(20, 0, 7), 25); }, [[0, 'impact', .6], [.02, 'stretch', .9]]);
// 34 «„Nein, wirklich nicht!“»: Timo, desde lo alto, se inclina hacia Jana gritando; ella, brazos cruzados
shot(45.86, 'W', null, L => { town(L, { dusk: true }); sit(timo, 20, 2.4, 6, -Math.PI / 2, L, { aRx: 1.2, aLx: 1.2, aLz: -.4, aRz: -.4 }); neck(timo, 26, L.T, { bend: .9 }); shake(timo, L.T, .8, 18); talk(timo, L.T, L.t0, L.t1, 'shout');
  sit(jana, 20, 2.4, 10.4, -Math.PI / 2, L, { aLx: .4 }); neck(jana, 2, L.T); actuar(jana, L.lt, [[0, sitPose({ aLx: 1.2, aRx: 1.2, aLz: -.6, aRz: -.6, aLe: 1.6, aRe: 1.6 })]], { T: L.T, weight: false }); jana.head.rotation.x = -.5; cara(jana, L.T, { expr: 'angry', mouth: 'flat' }); neinB(timo, (L.lt - .05) * 5, 'NEIN!!', 1.4);
  orbit(V(19, 10, 8), lerp(27, 24, L.k), -.35, .05, 50); sh(V(19, 0, 8), 30); }, [[0, 'whoosh_soft', .4], [.05, 'shout_m', .5]]);
// 35 «Zwanzig Meter.»: otro tirón: la cabeza de Timo atraviesa las nubes; «20 METER»
shot(47.74, 'C', 'punch', L => { town(L, { dusk: true }); sit(timo, 20, 2.4, 6, -Math.PI / 2, L, { aRx: .4, aLx: .4 }); const g = grow(L.lt, .05, 26, 60, .5); neck(timo, g, L.T, { bend: .05 }); cara(timo, L.T, { expr: 'shock', mouth: 'o' });
  meters('20 METER', (L.lt - .3) * 4, .2, 'red', 1.3); const h = hp(timo), q = easeOut(clamp(L.lt / .55)); cam([-14, lerp(14, h.y - 10, q), 14], [20, lerp(18, h.y - 4, q), 6], 54); sh(V(20, 0, 6), 50); }, [[0, 'impact', .6], [.05, 'stretch', .9], [.3, 'pop_big', .5]]);
// 36 «Jetzt weiß es die ganze Stadt.»: plano general al atardecer: toda la plaza mira hacia arriba y señala el cuello de Timo; móviles grabando
shot(48.74, 'F', null, L => { town(L, { dusk: true }); sit(timo, 20, 2.4, 6, -Math.PI / 2, L, { aRx: .4, aLx: .4, aLz: -.3, aRz: -.3, aLe: 1.8, aRe: 1.8 }); neck(timo, 60, L.T, { bend: .05 }); cara(timo, L.T, { expr: 'sad', mouth: 'flat' });
  crowdAt(L, -6, 16, 18, 4, 16, 31, { mode: i => ['point', 'cheer', 'shock'][i % 3], from: 0, face: V(20, 40, 6), neck: i => [2, 6, 3, 10, 4, 14, 2, 8, 5, 3, 12, 6, 2, 9, 4, 7, 3, 11][i], gap: 1.3 });
  cm([-30, 5, 34, 16, 26, 4, 60], [-27, 6, 31, 16, 28, 4, 60], L.k); sh(V(0, 0, 14), 60); }, [[0, 'flash', .4], [.1, 'laugh_m', .5], [.3, 'crowd_cheer', .4], [.6, 'camera_shutter', .4]]);
// 37 «Aber ich?»: Luca, de cerca, se señala a sí mismo con una sonrisa
shot(50.38, 'C', 'punch', L => { town(L); put(luca, 0, 0, 6, 0); actuar(luca, L.lt, [[0, { aRx: 1.1, aRz: -.4, aRe: 1.8, aLx: .2 }]], { T: L.T }); cara(luca, L.T, { expr: 'happy', mouth: 'grin' });
  crowdAt(L, 0, 0, 8, 8, 18, 37, { mode: 'talk', from: 0, neck: i => [14, 24, 8, 30, 18, 10, 26, 6][i] });
  onBody(luca, 13, 0, .08, 44, L.k); sh(V(0, 0, 6), 25); }, [[0, 'impact_soft', .5], [.1, 'pop', .4]]);
// 38 «Mein Hals ist völlig normal.»: Luca pasea entre cuellos gigantes con su cuello normal; «NORMAL ✓»
shot(51.06, 'W', null, L => { town(L); const c = put(luca, 0, 0, lerp(8, 4, L.k), Math.PI); caminar(c, L.lt, { x: 0, z: 8, ry: Math.PI, speed: 2.6, T: L.T }); c.root.rotation.y = 0; c.root.position.z = lerp(10, 5, L.k); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); actuar(c, L.lt, [[0, walkP(L.T, 0)]], { T: L.T });
  [[-6, 2, 30], [6, 0, 36], [-9, -8, 24], [8, -10, 40], [0, -14, 28]].forEach(([x, z, n], i) => { const p = put(CR[i + 5], x, 0, z, Math.atan2(-x, 20 - z)); neck(p, n, L.T, { bend: .05 }); cara(p, L.T + i, { expr: 'neutral' }); actuar(p, L.lt, [[0, 'idle']], { T: L.T }); });
  badge('green', 'NORMAL ✓', W / 2, H * .15, (L.lt - .4) * 4, 1, 1); cm([0, 7, 26 + lerp(4, 0, L.k), 0, 9, 0, 54], [0, 7, 22, 0, 9, 0, 54], L.k); sh(V(0, 0, 0), 30); }, [[0, 'whoosh', .4], [.1, 'steps', .4], [.5, 'ding_good', .5]]);
// 39 «Denn ich habe in meinem ganzen Leben»: Luca carga las bolsas de una señora mayor y asiente sonriendo
shot(52.53, 'S', null, L => { town(L); const c = put(luca, 4, 0, -2, -.5); actuar(c, L.lt, [[0, { aLx: .5, aRx: .5, aLe: 1.3, aRe: 1.3, aLz: -.1, aRz: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' }); nod(c, L.T, .6);
  for (let i = 0; i < 4; i++) { const b = DUST[i + 1]; } const o = put(schw, -2, 0, 0, .8); neck(o, 14, L.T, { bend: .4 }); talk(o, L.T, L.t0, L.t1, 'happy'); actuar(o, L.lt, [[0, 'point']], { T: L.T });
  attach(BOOKS, c.aL.hand, [0, -1, .6], [0, 0, 0], .6);
  orbit(V(1.5, 6, -1), lerp(20, 18, L.k), .2, .1, 44); sh(V(1, 0, -1), 25); }, [[0, 'swipe', .4], [.2, 'paper', .4], [.8, 'happy_hum', .4]]);
// 40 «noch nie Nein gesagt.»: junto a Luca, un «NEIN» tachado con una X roja enorme
shot(54.19, 'C', null, L => { town(L); const c = put(luca, 0, 0, 6, 0); actuar(c, L.lt, [[0, { aRx: 1.3, aRz: -.1, aRe: 2.2, aLx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'flat', eyes: 'happy' });
  FX2D.push(cx => { const k = spring(clamp((L.lt - .1) * 3)); if (k <= 0) return; cx.save(); cx.translate(W * .5, H * .15); cx.scale(k * U, k * U); ntxt(cx, 'NEIN', 0, 0, 170, '#ffffff', '#0e1226', 26); const k2 = clamp((L.lt - .4) * 4); cx.strokeStyle = '#ff2a3a'; cx.lineWidth = 34; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(-230, -110); cx.lineTo(-230 + 460 * k2, -110 + 220 * k2); cx.stroke(); if (k2 >= 1) { const k3 = clamp((L.lt - .65) * 4); cx.beginPath(); cx.moveTo(230, -110); cx.lineTo(230 - 460 * k3, -110 + 220 * k3); cx.stroke(); } cx.restore(); });
  onBody(c, 15, .15, .1, 44, L.k, null, null, 5.4); sh(V(0, 0, 6), 25); }, [[0, 'thump', .4], [.4, 'marker', .5], [.65, 'buzzer', .5]]);
// 41 «Kein einziges Mal.»: contador «0× NEIN»; Luca se encoge de hombros, feliz
shot(55.4, 'Z', 'punch', L => { town(L); const c = put(luca, 0, 0, 6, 0); actuar(c, L.lt, [[0, 'shrug']], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'grin' }); crowdAt(L, 0, 6, 6, 8, 16, 41, { mode: 'talk', from: 0, neck: i => [12, 20, 6, 28, 16, 9][i] });
  badge('big', '0× NEIN', W / 2, H * .14, L.lt * 4, 1, 1.2); onBody(c, 16, -.15, .1, 44, L.k, null, null, 5.4); sh(V(0, 0, 6), 25); }, [[0, 'impact_soft', .5], [.1, 'counter_fast', .4], [.4, 'ding', .4]]);
// 42 «Und genau das war mein größtes Problem.» (zoom lento): todos le van dejando cajas y bolsas encima; la torre crece y Luca suda
shot(56.42, 'F', 'slow', L => { town(L); const c = put(luca, 0, 0, 4, 0); actuar(c, L.lt, [[0, { aLx: 1.5, aRx: 1.5, aLe: 1.0, aRe: 1.0, aLz: -.1, aRz: -.1, crouch: .1 + Math.sin(L.T * 6) * .03 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T);
  const n = Math.floor(2 + L.lt * 4.5); for (let i = 0; i < 8; i++) { const b = DUST[i]; } BOOKS.visible = false; attach(BOOKS, c.aL.hand, [.9, -.5, .9], [0, 0, 0], .9); BOOKS.children.forEach((b, i) => b.visible = i < n + 2);
  [[-5, 1, .9], [5, 2, -.9], [-4, -4, .6]].forEach(([x, z, r], i) => { const p = put(CR[i + 20], x, 0, z + 4, r); neck(p, [10, 18, 26][i], L.T, { bend: .3 }); actuar(p, L.lt, [[0, { aRx: 1.4, aRe: .3, aLx: 1.4, aLe: .3 }]], { T: L.T }); cara(p, L.T, { expr: 'happy', mouth: 'open_smile' }); });
  onBody(c, lerp(18, 12, easeIn(L.k)), 0, .12, 46); sh(V(0, 0, 4), 25); }, [[0, 'flash', .3], [.3, 'box_drop', .5], [.9, 'box_drop', .5], [1.5, 'box_drop', .5], [1.9, 'strain', .5]]);

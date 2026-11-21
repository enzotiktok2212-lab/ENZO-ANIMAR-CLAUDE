// ---------- b: el osito en el escenario, las reglas, la chica de la trenza, los vídeos, el cambio de habitación y los números (45,45 – 98,47 s) ----------
const TDOOR = (() => { const g = new THREE.Group(); g.position.set(0, 0, 27.6); g.rotation.y = PI; TH.g.add(g); box(10, 12, .4, mat(0x8a8e96, { metalness: .5 }), .05, g, 0, 6, -.2); const lv = [-1, 1].map(s => { const l = new THREE.Group(); l.position.set(s * 4.6, 0, 0); g.add(l); box(4.5, 11, .5, mat(0x3a6ad8, { metalness: .3, roughness: .4 }), .05, l, -s * 2.25, 5.5, .1); box(.3, 2.4, .5, mat(0xd8dce4, { metalness: .9 }), .05, l, -s * 3.9, 5.4, .5); box(3, 2.4, .1, mat(0xbfe6ff, { transparent: true, opacity: .6 }), .02, l, -s * 2.25, 8, .4); return l; });
  const ch = new THREE.Group(); g.add(ch); for (let k = 0; k < 9; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.32, .08, 6, 12), mat(0xb8bcc4, { metalness: .9, roughness: .2 })); r.position.set(-3.2 + k * .8, 5.4 + Math.sin(k) * .1, .8); r.rotation.y = k % 2 ? PI / 2 : 0; ch.add(r); } box(1, 1.3, .5, mat(0xe9c23a, { metalness: .8 }), .1, ch, 0, 4.8, .9); return { g, lv, ch }; })();
const TABS = Array.from({ length: 6 }, () => { const g = new THREE.Group(); scene.add(g); box(1.9, 1.3, .1, mat(0x1a1a22), .06, g, 0, 0, 0); const s = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.1), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.2, .5, .8), toneMapped: false })); s.position.z = .06; g.add(s); return g; });
const KEY_ = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0xe9c23a, { metalness: .9, roughness: .2 }); const r = new THREE.Mesh(new THREE.TorusGeometry(.25, .07, 6, 14), m); g.add(r); box(.12, .7, .08, m, .02, g, 0, -.55, 0); box(.25, .1, .08, m, .02, g, .12, -.8, 0); return g; })();
const GCH = (() => { const g = new THREE.Group(); scene.add(g); for (let k = 0; k < 11; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.32, .08, 6, 12), mat(0xb8bcc4, { metalness: .9, roughness: .2 })); r.position.set(-4 + k * .8, 6 + Math.sin(k * .6) * .3, 0); r.rotation.y = k % 2 ? PI / 2 : 0; g.add(r); } const lk = box(1.2, 1.4, .6, mat(0xe9c23a, { metalness: .8, roughness: .25 }), .15, g, 0, 5, .2); const sh_ = new THREE.Mesh(new THREE.TorusGeometry(.4, .1, 6, 12, Math.PI), mat(0xb8bcc4, { metalness: .9 })); sh_.position.set(0, 5.7, .2); g.add(sh_); return g; })();
PROPS.push(...TABS, KEY_, GCH);
const tabFace = (ch, side = 'R') => { const t = TABS[0]; inHand(t, ch, side, [.4, -.9, .7], [-1.1, 0, 0]); return t; };
const bearStage = (L, p = {}, y = 9.4) => bear(THX, y, -19, 0, { glow: 1.6, ...p }, 1.0);
const studentsGym = (L, face = { expr: 'shock' }, g = ['shock', 'cower', 'hands_head', 'shock']) => OTHERS.forEach((c, i) => { if (c === zopf && L.T > 68.5) return; const x = -12 + (i % 6) * 4.8, z = -2 - Math.floor(i / 6) * 4.5; put(c, THX + x, 0, z, faceTo(V(x, 0, z), V(0, 0, -19)) * .5); actuar(c, L.lt, [[0, g[i % g.length]]], { T: L.T + i }); cara(c, L.T + i, face); });

// 29 «Dann sprang ein kleiner Bär auf die Bühne»: el osito salta desde un lado y aterriza en el atril; los alumnos retroceden
shot(45.45, 'Z', 'punch', L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 200); const k = clamp(L.lt / .9), p = arc([THX + 16, 4.2, -20], [THX, 9.4, -19], 7, easeInOut(k));
  bear(p.x, p.y, p.z, lerp(-.8, 0, k), { aL: 2.6 * (1 - k) + .4, aR: 2.6 * (1 - k) + .4, aLz: .7, aRz: .7, legs: k < 1 ? 1.2 : 0, mouth: .8, glow: 1.8 });
  studentsGym(L, { expr: 'shock' }, ['recoil', 'shock', 'cower']); ich.root.visible = false;
  cm([THX + 8, 11, 14, THX + 4, 9, -19, 50], [THX + 3, 11, 8, THX + 1, 10, -19, 48], L.k); }, [[0, 'impact', .4], [.1, 'jump', .5], [.85, 'land', .6], [.95, 'boing_metal', .4], [1.2, 'gasp', .4]]);
// 30 «Halb rosa»: primer plano del lado rosa
shot(47.54, 'W', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 200); bearStage(L, { aL: 1.2, aLz: .5, headZ: .15, mouth: .5, headY: -.3 });
  orbit(V(THX - .4, 12.2, -19), lerp(11, 9.5, L.k), -.75, .06, 40); badge('tag', 'ROSA', W / 2, H * .2, (L.lt - .1) * 3); }, [[0, 'swipe', .3], [.2, 'sparkle', .4]]);
// 31 «halb grau»: primer plano del lado gris, el ojo de corazón brilla
shot(48.46, 'W', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 200); bearStage(L, { aR: 1.2, aRz: .5, headZ: -.15, mouth: .3, headY: .3, glow: 2.6 });
  orbit(V(THX + .4, 12.2, -19), lerp(11, 9.5, L.k), .75, .06, 40); badge('tag', 'GRAU', W / 2, H * .2, (L.lt - .1) * 3); }, [[0, 'swipe', .3], [.2, 'creepy_ting', .5]]);
// 32 «mit einer winzigen Krone»: la coronita de cerca, destellos
shot(49.18, 'Z', 'punch', L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 200); bearStage(L, { aL: 2.6, aLz: .2, aLe: 1, headX: -.15, mouth: .6, headZ: Math.sin(L.T * 4) * .1 });
  const c = teddy.crown; teddy.root.updateMatrixWorld(true); const p = c.getWorldPosition(V(0, 0, 0)); cam([p.x + .6, p.y + 1.6, p.z + 5.6], [p.x, p.y - .2, p.z], lerp(36, 32, L.k)); }, [[0, 'impact', .4], [.15, 'sparkle', .6], [.6, 'chime', .4]]);
// 33 «Willkommen in eurer neuen Schule!»: brazos abiertos en el atril, confeti, los monitores muestran su cara
shot(50.44, 'R', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 200); bearStage(L, { aL: 2.4 + Math.sin(L.T * 6) * .2, aR: 2.4 - Math.sin(L.T * 6) * .2, aLz: 1, aRz: 1, mouth: tedM(L.T, 50.4, 52.5), hop: Math.abs(Math.sin(L.T * 5)) * .3 });
  TH.mons.forEach(m => m.userData.s.userData.draw('bear', (c, w, h) => { c.fillStyle = '#2a0a2a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffa6c8'; c.beginPath(); c.arc(w / 2, h / 2, h * .38, Math.PI / 2, Math.PI * 1.5); c.fill(); c.fillStyle = '#8a8e9a'; c.beginPath(); c.arc(w / 2, h / 2, h * .38, -Math.PI / 2, Math.PI / 2); c.fill(); c.fillStyle = '#ff2030'; c.font = `700 ${h * .25}px Cap`; c.textAlign = 'center'; c.fillText('♥', w / 2 + h * .15, h * .5); c.fillStyle = '#111'; c.beginPath(); c.arc(w / 2 - h * .15, h * .42, h * .06, 0, 7); c.fill(); }));
  confRain(V(THX, 4, -19), L.T, 40, 20, 10, 18); studentsGym(L, { expr: 'worried' }, ['idle', 'cross', 'listen']); ich.root.visible = true; put(ich, THX + 1, 0, 6, PI); cam([THX + lerp(-4, 4, L.k), 10, 14], [THX, 11, -19], 50); }, [[0, 'whirl', .3], [.1, 'party_horn', .5], [.3, 'confetti', .5], [1.2, 'clap', .3]]);
// 34 «Ihr bleibt für immer hier»: desde el escenario, junto al osito: los alumnos asustados abajo
shot(52.53, 'F', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 150); bearStage(L, { aR: 1.6, aRz: -.1, mouth: tedM(L.T, 52.5, 53.8), headY: -.3 }); teddy.root.rotation.y = .5;
  studentsGym(L, { expr: 'scared' }); put(ich, THX + 2, 0, 1, PI); actuar(ich, L.lt, [[0, 'shock']], { T: L.T }); cara(ich, L.T, { expr: 'scared' }); OTHERS.forEach(c => c.root.rotation.y = PI);
  cm([THX - 6, 14, -26, THX + 1, 3, 0, 50], [THX - 5, 13, -24, THX + 1, 3, 0, 50], L.k); }, [[0, 'flash', .3], [.2, 'gasp', .5], [.8, 'heartbeat', .4]]);
// 35 «Niemand kommt rein»: fuera, la verja cerrada con cadena y candado; la gente de la ciudad intenta mirar dentro
shot(53.82, 'C', 'punch', L => { town(); gate(0); TOWN.slice(0, 3).forEach((c, i) => { put(c, -4 + i * 4, 0, -21.6, PI); actuar(c, L.lt, [[0, { aLx: 1.9, aRx: 1.9, aLe: .5, aRe: .5, lean: .1 }]], { T: L.T + i, extra: shiver(L.T + i, .5) }); cara(c, L.T + i, { expr: 'worried' }); });
  show(GCH, 0, 0, -23.2); GCH.rotation.z = Math.sin(L.T * 9) * .02 * Math.exp(-L.lt * 2); cm([1, 7, -40, 0, 6, -22, 46], [1, 7, -37, 0, 6, -22, 44], L.k); sh(V(0, 0, -24)); }, [[0, 'slam', .5], [.1, 'chain_rattle', .6], [.5, 'lock', .6]]);
// 36 «Niemand geht raus»: el motero tira de las puertas del gimnasio: cadena y candado
shot(55.29, 'W', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150;
  const b = put(biker, THX + 1, 0, 24.4, 0); const pull = Math.sin(L.lt * 14); actuar(b, L.lt, [[0, { aLx: 1.6, aRx: 1.6, aLe: .3, aRe: .3, lean: -.25 - pull * .08, crouch: .2 }]], { T: L.T }); cara(b, L.T, { expr: 'angry', mouth: 'grimace_wide' }); TDOOR.lv.forEach((l, i) => l.rotation.y = pull * .02 * (i ? 1 : -1));
  cm([THX + 9, 7.5, 27, THX + 1, 5.2, 24.4, 50], [THX + 8.4, 7.3, 27, THX + 1, 5.2, 24.4, 48], L.k); }, [[0, 'swipe', .3], [.15, 'chain_rattle', .6], [.5, 'metal_hit', .5], [.9, 'growl', .3]]);
// 37 «Wer gehen will? Ganz einfach:» el osito se inclina sobre el atril, dedo arriba, guiño
shot(56.57, 'Z', 'punch', L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 200);
  bearStage(L, { aR: 2.4, aRz: -.2, lean: .3, mouth: tedM(L.T, 56.5, 58.2), wink: L.lt > .6, headZ: .2 }); orbit(V(THX, 12.2, -19), lerp(12.5, 11, L.k), -.2, .02, 42); }, [[0, 'impact', .4], [.3, 'whoosh_up', .3], [.8, 'blink', .4]]);
// 38 «Tötet jemanden – und lasst euch nicht erwischen» (zoom lento): el ojo de corazón brilla rojo, la sala se tiñe
shot(58.24, 'C', 'slow', L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 120); bearStage(L, { aL: .3, aR: .3, mouth: tedM(L.T, 58.2, 60.7), glow: 2 + L.k * 3, brow: .4, headX: .15 }); TINT = `rgba(180,0,30,${.12 + L.k * .18})`;
  const h = teddy.head.getWorldPosition(V(0, 0, 0)); cam([h.x + .4, h.y + .4, h.z + lerp(9, 5.6, easeIn(L.k))], [h.x + .2, h.y - .2, h.z], 40); }, [[0, 'slam', .4], [.3, 'heartbeat', .6], [1.4, 'creepy_ting', .5]]);
// 39 «Alle lachten»: los alumnos se ríen (creen que es una broma)
shot(60.75, 'W', null, L => { use('TH'); inside(.85, 40); OTHERS.forEach((c, i) => { const x = -12 + (i % 6) * 4.8, z = -2 - Math.floor(i / 6) * 4.5; put(c, THX + x, 0, z, faceTo(V(x, 0, z), V(0, 0, 20)) * .3); actuar(c, L.lt, [[0, i % 3 ? 'hands_face' : 'shrug']], { T: L.T + i }); laughF(c, L.T + i); });
  put(ich, THX + 2, 0, 3, 0); laughF(ich, L.T); cm([THX - 6, 7, 20, THX, 4.5, -4, 48], [THX + 6, 7, 20, THX, 4.5, -4, 48], L.k); }, [[0, 'swipe', .3], [.1, 'kids_laugh', .6], [.4, 'laugh_deep', .3]]);
// 40 «Ein Mädchen mit Zopf stapfte zu ihm»: la chica de la trenza sube las escaleras del escenario a zancadas, enfadada
shot(61.55, 'S', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 150); bearStage(L, { mouth: .2, headX: .3, aL: .4, aR: .4 }); const k = clamp(L.lt / 1.5), z = lerp(-8, -15.6, k), y = clamp((z + 12.4) / -3.2) * 4.2;
  caminar(zopf, L.lt, { x: THX - 1.4, z: -8, ry: PI, speed: 4.6, accel: .05, T: L.T, extra: { lean: .2, aLx: -.3, aRx: -.3 } }); zopf.root.position.z = z; zopf.root.position.y = y; cara(zopf, L.T, { expr: 'angry', mouth: 'grimace' });
  cm([THX - 7, 10, -21, THX - 1.4, 5.5, -10, 46], [THX - 6.6, 10, -20, THX - 1.4, 6.5, -12, 46], L.k); }, [[0, 'swipe', .3], [.1, 'steps', .6], [.7, 'thud', .4], [1.2, 'growl', .3]]);
// 41 «und packte ihn am Ohr»: le agarra de la oreja y le levanta; el osito patalea
shot(63.21, 'C', 'punch', L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 175); const z = put(zopf, THX - 1.8, 4.2, -17.6, .5); actuar(z, L.lt, [[0, { aRx: 2.3, aRz: -.4, aRe: .4, lean: -.1 }]], { T: L.T }); cara(z, L.T, { expr: 'angry', mouth: 'smirk' });
  const up = easeOut(clamp(L.lt / .3)); bear(THX - .1, 4.4 + up * 2.6, -17.2, -.4, { aL: 1 + Math.sin(L.T * 20) * .6, aR: 1 - Math.sin(L.T * 20) * .6, legs: L.T * 18, mouth: .9, headZ: .4, glow: 2 }, .9);
  cm([THX + 3, 9, -3, THX - 1, 8.4, -17.4, 46], [THX + 2.4, 9, -5, THX - 1, 8.6, -17.4, 44], L.k); }, [[0, 'impact', .5], [.05, 'rip', .4], [.3, 'toy', .5], [.7, 'gasp_f', .4]]);
// 42 «„Oh-oh“, sagte der Bär»: primer plano del osito colgando: boca en O, ojo de corazón encendido
shot(64.33, 'Z', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 175); put(zopf, THX - 1.8, 4.2, -17.6, .5); applyPose(zopf, { aRx: 2.3, aRz: -.4, aRe: .4 }); cara(zopf, L.T, { expr: 'smug' });
  bear(THX - .1, 7, -17.2, -.2, { aL: .3, aR: .3, mouth: L.lt < .9 ? .9 : tedM(L.T, 64.3, 66.1), headZ: .4 + Math.sin(L.T * 3) * .05, glow: 3 + Math.sin(L.T * 10), brow: -.3 }, .9);
  const h = teddy.head.getWorldPosition(V(0, 0, 0)); cam([h.x + 1, h.y + .6, h.z + lerp(9.5, 8.5, L.k)], [h.x, h.y - .4, h.z], 40); }, [[0, 'whoosh', .3], [.1, 'creepy_ting', .6], [.9, 'beep', .3]]);
// 43 «Den Direktor anzufassen ist verboten»: dedo que dice que no, alarmas rojas
shot(66.13, 'F', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 120); put(zopf, THX - 1.8, 4.2, -17.6, .5); applyPose(zopf, { aRx: 2.3, aRz: -.4, aRe: .4 }); cara(zopf, L.T, { expr: 'worried' });
  bear(THX - .1, 7, -17.2, -.2, { aR: 2.2, aRz: Math.sin(L.T * 14) * .4, mouth: tedM(L.T, 66.1, 68.5), headZ: .4, glow: 3, brow: .5 }, .9); TINT = Math.floor(L.T * 4) % 2 ? 'rgba(255,0,30,.22)' : 'rgba(255,0,30,.05)';
  cm([THX + 6, 8, -6, THX, 8, -17.4, 46], [THX + 5, 8.4, -8, THX, 8.4, -17.4, 44], L.k); }, [[0, 'alarm', .5], [.6, 'buzzer', .4], [1.4, 'alarm', .4]]);
// 44 «Ein Käfig fiel von der Decke»: la jaula cae sobre la chica de la trenza en mitad del gimnasio
shot(68.51, 'C', 'punch', L => { use('TH'); inside(.75, 30); const z = put(zopf, THX, 0, 2, 0); actuar(z, L.lt, [[0, 'idle'], [.2, 'shock', { dur: .2 }], [.45, 'cower', { dur: .3 }]], { T: L.T }); cara(z, L.T, { expr: 'scared', eyes: 'terror', mouth: 'scream' });
  const f = clamp(L.lt / .38); show(CAGE, THX, 30 * (1 - f * f) + (f >= 1 ? Math.abs(Math.sin((L.lt - .38) * 14)) * .5 * Math.exp(-(L.lt - .38) * 6) : 0), 2);
  OTHERS.forEach((c, i) => { if (c === zopf) return; const a = i / 11 * PI * 2; put(c, THX + Math.sin(a) * 11, 0, 2 + Math.cos(a) * 11, a + PI); actuar(c, L.lt, [[0, 'idle'], [.4, i % 2 ? 'recoil' : 'hands_head', { dur: .2 }]], { T: L.T + i }); cara(c, L.T + i, { expr: L.lt > .4 ? 'shock' : 'neutral' }); });
  cm([THX + 4, 9, 18, THX, 5, 2, 46], [THX + 3, 8.4, 15, THX, 5, 2, 46], L.k); }, [[0, 'whoosh_down', .5], [.38, 'slam', .8], [.42, 'metal_hit', .6], [.6, 'scream_girl', .4]]);
// 45 «und sie verschwand im Boden»: vista cenital: se abre la trampilla y la jaula se hunde
shot(69.79, 'I', null, L => { use('TH'); inside(.75, 30); const o = easeOut(clamp(L.lt / .3)), d = easeIn(clamp((L.lt - .35) / .8)); TH.trap.hole.visible = true; TH.trap.lids.forEach((l, i) => l.rotation.z = (i ? 1 : -1) * o * 1.5);
  const z = put(zopf, THX, -d * 9, 2, 0); actuar(z, L.lt, [[0, 'hands_head']], { T: L.T }); cara(z, L.T, { expr: 'scared', eyes: 'terror', mouth: 'scream' }); show(CAGE, THX, -d * 9, 2);
  [koch, fan, schwimm].forEach((c, i) => { put(c, THX - 7 + i * 7, 0, 10 + (i % 2) * 2, PI); actuar(c, L.lt, [[0, 'hands_face']], { T: L.T + i }); cara(c, L.T + i, { expr: 'shock' }); });
  cam([THX + .5, 26 - L.k * 4, 12], [THX, 0, 2], 46); }, [[0, 'iris_pop', .3], [.1, 'wood_creak', .5], [.4, 'whoosh_down', .5], [.6, 'rubble', .4]]);
// 46 «Danach lachte niemand mehr» (zoom lento): los alumnos en silencio, pálidos; la trampilla cerrada
shot(71.19, 'S', 'slow', L => { use('TH'); inside(.7, 25); studentsGym(L, { expr: 'scared', mouth: 'flat' }, ['cower', 'idle', 'hug_self']); zopf.root.visible = false; put(ich, THX + 2, 0, 3, 0); actuar(ich, L.lt, [[0, 'hug_self']], { T: L.T }); cara(ich, L.T, { expr: 'scared', mouth: 'flat' });
  cm([THX, 7, 20, THX, 5, -3, 50], [THX, 6.4, 14, THX, 5, -3, 46], L.k); }, [[0, 'swipe', .3], [.2, 'silence_tick', .5], [1.0, 'heartbeat', .4]]);
// 47 «Am nächsten Tag zeigte er jedem ein Video»: el osito entra en mi habitación y me da una tableta encendida
shot(72.85, 'F', null, L => { use('ZA'); inside(1.0, 50); const me = put(ich, ZAX + 1, 0, 2, -.6); const k = easeOut(clamp(L.lt / 1)); actuar(me, L.lt, [[0, 'idle'], [1.2, { aRx: 1.3, aRe: .5 }, { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'worried' });
  bear(lerp(ZAX + 8, ZAX + 3.6, k), Math.abs(Math.sin(L.lt * 8)) * .5 * (1 - k), lerp(6, 4.4, k), -1.6, { legs: L.T * 10 * (1 - k), aR: 1.6, mouth: tedM(L.T, 72.8, 75.2) }, .9); const t = TABS[0]; t.parent.remove(t); teddy.aR.add(t); t.position.set(0, -1.3, .5); t.rotation.set(-.4, 0, 0); t.visible = true;
  orb(L.k, V(ZAX + 2.4, 4, 3), null, [10, -.9, .12, 46], [9, -.7, .1, 46]); }, [[0, 'flash', .3], [.1, 'jump_small', .4], [.6, 'power_on', .5], [1.4, 'notif', .4]]);
// 48 «In meinem:» yo con la tableta delante, la luz en la cara
shot(75.16, 'Z', 'punch', L => { use('KL'); inside(.6, 25); const me = put(ich, KLX - 4.4, .4, 5.3, PI); applyPose(me, { ...SIT, aLx: 1.4, aRx: 1.4, aLe: 1.1, aRe: 1.1, headX: 0 }); cara(me, L.T, { expr: 'worried', eyes: 'down' }); const t = TABS[0]; show(t, KLX - 4.4, 4.9, 3.4, PI); t.rotation.x = -1.0;
  cm([KLX - 4.4, 8, -.4, KLX - 4.4, 5.4, 5.3, 42], [KLX - 4.4, 7.8, .4, KLX - 4.4, 5.4, 5.3, 40], L.k); }, [[0, 'impact', .4], [.2, 'tv_static', .4]]);
// 49 «das Wohnzimmer meiner Familie» (vídeo): el salón de casa, las fotos de la familia en la pared
shot(75.88, 'F', null, L => { use('WZ'); inside(.8, 30); VIDEO = 1; cm([WZX - 6, 11, 11, WZX - 9, 9, -12, 48], [WZX - 2, 10.6, 9, WZX - 9, 9, -12, 48], L.k); }, [[0, 'tv_static', .4], [.2, 'radio', .3]]);
// 50 «Leer» (vídeo): barrido lento por el salón vacío
shot(77.22, 'W', null, L => { use('WZ'); inside(.7, 25); VIDEO = 1; cm([WZX + 12, 9, 10, WZX, 4, -2, 50], [WZX + 6, 9, 11, WZX - 4, 4, -2, 50], L.k); }, [[0, 'tv_static', .3], [.2, 'wind', .3]]);
// 51 «Die Sofas umgekippt» (vídeo): el sofá volcado, la lámpara en el suelo
shot(77.96, 'C', 'punch', L => { use('WZ'); inside(.7, 25); VIDEO = 1; cm([WZX - 1, 6, 6, WZX - 6, 2.6, -6, 44], [WZX - 2, 5.6, 4, WZX - 6, 2.6, -6, 42], L.k); }, [[0, 'glitch', .4], [.2, 'crash_wood', .4]]);
// 52 «Mira sah ihr Video und wurde kreidebleich»: Mira con la tableta, se tapa la boca, pálida
shot(79.32, 'R', null, L => { use('KL'); inside(.7, 30); const m = put(mira, KLX + 4.2, .4, 5.3, PI); applyPose(m, { ...SIT, aLx: 1.3, aLe: 1.2, aRx: 2.1, aRe: 2.4, aRz: -.2, headX: -.05, lean: -.1 }); cara(m, L.T, { expr: 'shock', eyes: 'terror', mouth: 'o' }); const t = TABS[1]; show(t, KLX + 4.6, 4.9, 3.6, PI); t.rotation.x = -1.0;
  grade.uniforms.sat.value = lerp(1.45, .6, clamp(L.lt / 1.2)); sweat(m, L.T, 2); cm([KLX + 4.4, 8, -.4, KLX + 4.2, 5.4, 5.3, 42], [KLX + 4.4, 7.8, .4, KLX + 4.2, 5.4, 5.3, 40], L.k); }, [[0, 'whirl', .3], [.3, 'gasp_f', .6], [1.2, 'heartbeat', .4]]);
// 53 «In der Nacht klopfte sie an meine Tür»: pasillo de noche, Mira llama a mi puerta
shot(81.97, 'F', null, L => { use('FL'); night(); inside(.55, 20); const m = put(mira, FLX - 9.6, 0, -9.8, -PI / 2 + .5); const kn = Math.max(0, Math.sin(L.lt * 11)); actuar(m, L.lt, [[0, { aRx: 1.7, aRe: .6 + kn * .6, aRz: -.15, aLx: .3 }]], { T: L.T }); cara(m, L.T, { expr: 'worried', eyes: 'side_l' });
  cm([FLX - 5, 7, 6, FLX - 10, 5.6, -8.5, 48], [FLX - 5.5, 6.8, 4, FLX - 10, 5.6, -8.5, 46], L.k); }, [[0, 'flash', .2], [.15, 'knock', .6], [.9, 'knock', .5], [1.3, 'owl', .2]]);
// 54 «Können wir die Zimmer tauschen? Nur heute Nacht?»: abro; Mira con las manos juntas, suplicando
shot(83.66, 'W', null, L => { use('FL'); night(); inside(.55, 20); FL.doors[1].rotation.y = 1.3; const m = put(mira, FLX - 8.4, 0, -10, -PI / 2 + .5); actuar(m, L.lt, [[0, { aLx: 1.6, aRx: 1.6, aLz: -.4, aRz: -.4, aLe: 1.4, aRe: 1.4, headZ: .2 }]], { T: L.T }); talk(m, L.T, 83.6, 85.8, 'worried');
  const me = put(ich, FLX - 12, 0, -8.6, PI / 2 - .5); cara(me, L.T, { expr: 'confused' }); bubble(m, 'Tauschen?', (L.lt - .3) * 3);
  cm([FLX - 4, 7, 5, FLX - 10, 5.6, -9, 46], [FLX - 4.4, 6.8, 3.6, FLX - 10, 5.6, -9, 44], L.k); }, [[0, 'swipe', .3], [.1, 'door_open', .5], [.6, 'whisper', .4]]);
// 55 «Ich sagte ja»: asiento con la cabeza
shot(85.83, 'C', 'punch', L => { use('FL'); night(); inside(.55, 20); FL.doors[1].rotation.y = 1.3; const me = put(ich, FLX - 11.4, 0, -8.6, PI / 2 - .5); actuar(me, L.lt, [[0, { headX: Math.max(0, Math.sin(L.lt * 12)) * .35 }]], { T: L.T }); cara(me, L.T, { expr: 'happy', mouth: 'smirk' });
  onFace(me, 9, -1.2, .6, 42, L.k, 8); }, [[0, 'impact', .3], [.2, 'ding_soft', .4]]);
// 56 «Natürlich sagte ich ja»: le doy la llave, me pongo rojo; corazoncitos
shot(86.69, 'S', null, L => { use('FL'); night(); inside(.55, 20); FL.doors[1].rotation.y = 1.3; const me = put(ich, FLX - 11, 0, -8.6, PI / 2 - .5); actuar(me, L.lt, [[0, { aRx: 1.5, aRe: .3, aLx: .4, headZ: .15 }]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'grin', blush: 1 }); inHand(KEY_, me, 'R', [0, -.7, .4]);
  const m = put(mira, FLX - 7.4, 0, -9.6, -PI / 2 + .5); actuar(m, L.lt, [[0, { aLx: 1.4, aLe: .4 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'smirk' }); const hp_ = hp(me);
  HEARTS.forEach((z, i) => { const k = (L.T * .6 + i / 5) % 1; z.visible = true; z.position.set(hp_.x + Math.sin(i * 1.7 + L.T) * 1.4, hp_.y + 1 + k * 3.4, hp_.z + .4); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); });
  orb(L.k, V(FLX - 9.2, 4.8, -8), null, [12, .25, .08, 44], [11, -.05, .08, 44]); }, [[0, 'swipe', .3], [.3, 'keys', .5], [.6, 'sparkle', .4]]);
// 57 «Am Morgen öffnete ich meine alte Tür»: la puerta se abre desde dentro de mi antigua habitación; luz de mañana
shot(87.98, 'F', null, L => { use('ZA'); inside(1.0, 50); ZA.door.rotation.y = -1.4 * easeOut(clamp(L.lt / .6)); const me = put(ich, ZAX + 7, 0, 13.6 - easeOut(clamp(L.lt / 1.4)) * 1.5, PI); cara(me, L.T, { expr: 'happy' });
  cm([ZAX + 4, 7, -2, ZAX + 7, 5.2, 12, 46], [ZAX + 4.6, 6.8, 0, ZAX + 7, 5.2, 12, 44], L.k); }, [[0, 'flash', .3], [.1, 'door_open', .6], [.6, 'birds', .3]]);
// 58 «Mira lag auf dem Boden, eine Schere neben ihr» (zoom lento): Mira tendida en el suelo, las tijeras al lado; yo en la puerta
shot(89.95, 'C', 'slow', L => { use('ZA'); inside(.9, 40); ZA.door.rotation.y = -1.4; lie(mira, ZAX + 1, .55, 0, PI / 2 + .3); applyPose(mira, { aLz: .5, aRz: .3, aLx: .3, lLx: .1, lRx: -.1 }); cara(mira, L.T, { eyes: 'closed', mouth: 'flat', noBlink: 1 });
  show(SCI, ZAX + 2.6, .1, 3.2, .7, 1.2); const me = put(ich, ZAX + 7, 0, 11.4, PI); actuar(me, L.lt, [[0, 'shock'], [.8, 'hands_head', { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' });
  cm([ZAX - 4, 12, 8, ZAX + 1.5, 1, .5, 52], [ZAX - 3.4, 11, 6.5, ZAX + 1.5, 1.2, .5, 50], L.k); }, [[0, 'slam', .4], [.2, 'gasp', .6], [1.0, 'heartbeat', .5]]);
// 59 «An der Wand dahinter standen fünf Zahlen»: la cámara sube a la pared: los números en rojo
shot(92.35, 'W', null, L => { use('ZA'); inside(.9, 40); ZA.nums.visible = true; lie(mira, ZAX + 1, .55, 0, PI / 2 + .3); applyPose(mira, { aLz: .5, aRz: .3 }); cara(mira, L.T, { eyes: 'closed', mouth: 'flat', noBlink: 1 }); show(SCI, ZAX + 2.6, .1, 3.2, .7, 1.2);
  const me = put(ich, ZAX - 5, 0, 2, -2.6); actuar(me, L.lt, [[0, 'point']], { T: L.T }); cara(me, L.T, { expr: 'shock' });
  cm([ZAX - 2, 6, 14, ZAX, 4, -4, 50], [ZAX, 10, 9, ZAX, 10, -12, 50], L.k); }, [[0, 'swipe', .3], [.3, 'creepy_ting', .5]]);
// 60 «mit Lippenstift geschrieben»: me agacho junto al pintalabios abierto en el suelo
shot(94.41, 'Z', 'punch', L => { use('ZA'); inside(.9, 40); ZA.nums.visible = true; show(LIP, ZAX + 1, 0, -10.6, 0, 1.6); LIP.rotation.z = PI / 2; const me = put(ich, ZAX + 3.6, 0, -9.4, -1.9); applyPose(me, { crouch: 1.4, lean: .5, aRx: 1.3, aRe: .3, headX: .5 }); cara(me, L.T, { expr: 'worried', eyes: 'down' });
  cm([ZAX - 2, 3.2, -4, ZAX + 1.4, 1, -10.4, 42], [ZAX - 1.4, 3, -5, ZAX + 1.4, 1, -10.4, 40], L.k); }, [[0, 'impact', .4], [.2, 'lid_click', .5]]);
// 61 «3, 1, 7, 7, 0»: los números de la pared de frente; cada cifra salta al decirla
shot(95.8, 'C', 'punch', L => { use('ZA'); inside(.9, 40); ZA.nums.visible = true; const me = put(ich, ZAX - 3, 0, -2, PI + .3); cara(me, L.T, { expr: 'worried' }); applyPose(me, { headX: -.15 });
  [95.8, 96.26, 96.98, 97.49, 98.1].forEach((t, i) => badge('red', '31770'[i], W / 2 + (i - 2) * 160, H * .46, (L.T - t) * 4, 1, 1.1));
  cm([ZAX + 1, 11, 6, ZAX, 10.4, -12, 46], [ZAX + .6, 10.8, 3.6, ZAX, 10.4, -12, 44], L.k); }, [[0, 'impact', .5], [.46, 'pop', .5], [1.18, 'pop', .5], [1.69, 'pop', .5], [2.3, 'pop', .6]]);

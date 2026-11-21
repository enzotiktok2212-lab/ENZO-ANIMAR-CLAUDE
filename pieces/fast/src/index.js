// FAST — «In dieser Stadt gewinnt jeder fast. Außer mir.»: planos sincronizados con audio/words.json (1080×1920, 30 fps).
// Hufenbach (pueblo alemán de entramado): todos llevan sobre la cabeza su número de fuerza (600–990); yo, un 7 rojo.
// El Beinahe-Mann roba la fuerza justo antes de cada meta y la guarda en frascos; el Ninja-Parcours con el botón dorado. Planos en src/p/*.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt, mustache, makeExtra } from './props.js';
import { makeOma, makeKumpel, makeLena, makeSie, makeEr, makeKassiererin, makeFahrer, makePapa, makeMayor, makeIch, makeJonas, makeMama, makeVerk, makeNachbar } from './gvolk.js';
import { hufenbach, townhouse } from './gort.js';
import { numSprite, numTex, doener } from './gsets.js';
import { crowd, goal, football, punchBag, calendar } from './hsets.js';
import { omaStube, zimmer, kueche } from './svsets.js';
import { rain, board } from './hals.js';
import { makeFahrerin, makeDoener, makeLehrer, makeSchiri, makeBeinahe, tram, rails, fahrschulAuto, cone, orb, jar, jarShelf, grill, kreuzwort, snow, ziel, pullBar, tafel, parcours } from './fast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 149.2, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
// Hufenbach (x = 0): plaza adoquinada x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (x = -6, z ≈ -84); fuente (-18,-24); café (36,-40);
// carretera x = 26 hacia +z (con vías del tranvía); parada (36, 6); döner (42, 40) mira a -x; mi casa HAUS (4, 96), puerta en mundo ≈ (11.2, 91.3) mirando +x; jardín (16, 96).
const PCX = 700, OSX = 1100, ZIX = 1300, KUX = 1500;
const HB = hufenbach(scene), PC = parcours(scene, PCX), OS = omaStube(scene, OSX), ZI = zimmer(scene, ZIX), KU = kueche(scene, KUX);
ZI.TV.visible = false; const SETS = { HB: HB.G, PC: PC.g, OS: OS.g, ZI: ZI.g, KU: KU.g };
for (const k in SETS) outline(SETS[k], 1.4);
[HB.RANK, HB.KINO, HB.BOX, HB.PRICE].forEach(o => o.visible = false);
townhouse(HB.G, -64, -21, 13, 3, 11, Math.PI / 2); townhouse(HB.G, -64, -34.5, 13, 2, 12, Math.PI / 2);
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3) + (Math.abs(x + 6) < 30 ? 1 : 0), 20 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 30 + i, Math.PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 40 + i, -Math.PI / 2); }
for (let i = 0, x = -140; x <= 140; x += 20, i++) townhouse(HB.G, x, -170, 18, 4 + (i % 3), 50 + i, 0);
for (let i = 0, z = 130; z < 260; z += 18, i++) townhouse(HB.G, 0, z, 16, 2 + (i % 2), 60 + i, Math.PI / 2);
for (let i = 0, z = 80; z < 260; z += 18, i++) townhouse(HB.G, 54, z + 40, 16, 2 + (i % 3), 70 + i, -Math.PI / 2);
rails(HB.G, 26, -70, 300);
const DOEN = doener(HB.G, 42, 40, -Math.PI / 2);
// tablón de la plaza: ranking de fuerza
const RANKB = board(HB.G, 12, 10, (c, w, h) => { c.fillStyle = '#1e3a2a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c8a050'; c.lineWidth = 14; c.strokeRect(7, 7, w - 14, h - 14); txt(c, 'KRAFT-RANGLISTE', w / 2, 60, 50, '#ffd23f');
  [['1.', 'Jonas', '990'], ['2.', 'Dönermann', '920'], ['3.', 'Straßenbahn', '870'], ['…', '', ''], ['412.', 'ICH', '7']].forEach(([n, a, b], i) => { const y = 140 + i * 74; const me = i === 4; c.font = `700 ${me ? 50 : 40}px ${FONT}`; c.textAlign = 'left'; c.fillStyle = me ? '#ff6a5a' : '#ffffff'; c.fillText(n + ' ' + a, 40, y); c.textAlign = 'right'; c.fillText(b, w - 40, y); if (me) { c.strokeStyle = '#ff5a4a'; c.lineWidth = 6; c.beginPath(); c.roundRect(22, y - 36, w - 44, 70, 20); c.stroke(); } }); });
RANKB.position.set(4, 0, -50); RANKB.rotation.y = -.15;
const POSTER = board(HB.G, 10, 13, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#2a8ad8'); g.addColorStop(1, '#1a3a8a'); c.fillStyle = g; c.fillRect(0, 0, w, h); txt(c, 'GROSSER', w / 2, 70, 56, '#ffffff'); txt(c, 'NINJA-', w / 2, 170, 110, '#ffd23f', '#1a1a3a', 10); txt(c, 'PARCOURS', w / 2, 280, 96, '#ffd23f', '#1a1a3a', 10);
  c.fillStyle = '#ffc81a'; c.beginPath(); c.arc(w / 2, 450, 90, 0, 7); c.fill(); c.lineWidth = 10; c.strokeStyle = '#1a1a3a'; c.stroke(); txt(c, 'Wer drückt den', w / 2, 600, 44, '#ffffff'); txt(c, 'goldenen Knopf?', w / 2, 650, 44, '#ffffff'); txt(c, 'SAMSTAG · 10 UHR', w / 2, 740, 44, '#ff8a6a'); }, true, .3);
POSTER.position.set(-24, 0, 6); POSTER.rotation.y = .5;
const GOAL = goal(HB.G, -25, -62, 0, 12, 5, 3.4);
const ZIELB = ziel(HB.G); ZIELB.position.set(-6, 0, -30);
const DAY = textPlane(5, 6, 250, 300, () => {}); scene.add(DAY); DAY.userData.draw = (n, sub, col = '#d8323a') => { const cv = DAY.material.map.image, c = cv.getContext('2d'), w = cv.width, h = cv.height; c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = col; c.fillRect(0, 0, w, 80); txt(c, sub, w / 2, 46, 40, '#ffffff'); txt(c, n, w / 2, 190, n.length > 3 ? 90 : 140, '#1a1a2a'); DAY.material.map.needsUpdate = true; };
// ---------- reparto ----------
const ich = makeIch(scene), papa = makePapa(scene), jonas = makeJonas(scene), oma = makeOma(scene), fahrerin = makeFahrerin(scene), doenm = makeDoener(scene), lehrer = makeLehrer(scene), schiri = makeSchiri(scene), bm = makeBeinahe(scene);
const klein = makeIch(scene); klein.spec.scale = .62;  // yo con 8 años
ich.spec.scale = .82;
const K = Array.from({ length: 8 }, (_, i) => makeKumpel(scene, i)); const XT = [makeKassiererin(scene), makeVerk(scene), makeNachbar(scene), makeMayor(scene), makeLena(scene), makeSie(scene), makeEr(scene), makeMama(scene)];
kitFace(ich, 'kid'); kitFace(klein, 'kid'); kitFace(papa, 'mustache'); kitFace(jonas, 'hero'); kitFace(oma, 'girl'); kitFace(fahrerin, 'girl'); kitFace(doenm, 'mustache'); kitFace(lehrer, 'plain'); kitFace(schiri, 'mustache'); kitFace(bm, 'villain');
K.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'plain', 'girl', 'girl', 'kid', 'hero'][i])); XT.forEach((c, i) => kitFace(c, ['girl', 'girl', 'plain', 'mustache', 'girl', 'girl', 'plain', 'girl'][i]));
const BG = Array.from({ length: 16 }, (_, i) => makeExtra(scene, i + 3)); BG.forEach((c, i) => kitFace(c, ['plain', 'girl', 'kid', 'hero', 'mustache', 'girl', 'plain', 'kid'][i % 8]));
const POOL0 = [ich, klein, papa, jonas, oma, fahrerin, doenm, lehrer, schiri, bm, ...K, ...XT, ...BG]; const POOL = POOL0; POOL.forEach(c => { outline(c.root, 2); c.root.rotation.order = 'YXZ'; });
// número de fuerza sobre la cabeza
const NUM = new Map(); POOL.forEach(c => { const s = numSprite(); c.head.add(s); s.position.set(0, 3.3, 0); NUM.set(c, s); });
const NV = new Map([[ich, 7], [klein, 7], [papa, 540], [jonas, 990], [oma, 640], [fahrerin, 870], [doenm, 920], [lehrer, 760], [schiri, 810]]); K.forEach((c, i) => NV.set(c, [910, 780, 860, 950, 690, 820, 740, 880][i])); BG.forEach((c, i) => NV.set(c, [930, 640, 810, 720, 880, 590, 960, 700, 850, 670, 780, 910, 620, 840, 750, 690][i])); XT.forEach((c, i) => NV.set(c, [720, 650, 830, 880, 610, 770, 700, 660][i]));
const kindOf = n => n >= 1000 ? 'gold' : n < 100 ? 'red' : 'zero';
const num = (ch, n = NV.get(ch), k = 1, kind) => { const s = NUM.get(ch); s.visible = true; s.material.map = numTex(n, kind || kindOf(n)); const p = spring(clamp(k) * 1.6), wx = String(n).length > 2 ? (String(n).length > 3 ? 2.3 : 2) : 1; s.scale.set(2.2 * p * wx, 1.72 * p, 1); s.position.y = 3.3 + Math.sin((k + ch.seed) * 3) * .06; };
// ---------- multitud instanciada con números ----------
const CRW = crowd(scene, 170); CRW.g.children[3].visible = false;
const NUMX = Array.from({ length: 44 }, (_, i) => { const s = numSprite(); scene.add(s); s.userData.v = [910, 640, 880, 720, 990, 560, 830, 760, 950, 690, 870, 610][i % 12]; return s; });
function crowdOn(T, mode = 'sway', n = 120, silent = false, nums = true, numV = null) { CRW.update(T, mode, silent, n); NUMX.forEach((s, i) => { const st = CRW.seat[i * 3]; if (!nums || !st || i * 3 >= n) { s.visible = false; return; } s.visible = true; const v = numV ? numV(i) : s.userData.v; s.material.map = numTex(v, kindOf(v)); const j = mode === 'cheer' ? Math.max(0, Math.sin(T * 7 * st.sp + st.ph)) * .7 : 0; s.position.set(st.x, st.y + 6.2 + j, st.z); s.scale.set(4.2, 1.72, 1); }); }
// gente alrededor de (cx, cz) en la plaza, sin entrar en el radio r0, del lado opuesto a la cámara
// gente alrededor de (cx, cz): personajes de verdad (modelos del reparto de fondo) con su número, del lado opuesto a la cámara, sin pisarse
function folk(cx, cz, n, r0, r1, T, seed = 1, o = {}) { POST.push(() => { const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc = o.arc || [ac + 1.6, ac + 6.283 - 1.6];
  const busy = POOL.filter(c => c.root.visible && !BG.includes(c)).map(c => c.root.position.clone()); const P = []; const m = Math.min(n, BG.length, o.max ?? 12);
  for (let i = 0; i < m; i++) { let x, z, ok = false; for (let t = 0; t < 30 && !ok; t++) { const a = arc[0] + r() * (arc[1] - arc[0]), d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; ok = [...busy, ...P].every(q => Math.hypot(q.x - x, q.z - z) > 3.6); }
    if (!ok) continue; P.push(V(x, 0, z)); const c = BG[i]; const ry = o.face ? Math.atan2(o.face.x - x, o.face.z - z) + (r() - .5) * .5 : Math.atan2(camera.position.x - x, camera.position.z - z) + (r() - .5) * .8; put(c, x, o.y || 0, z, ry); num(c);
    const g = o.mode === 'cheer' ? [[0, 'cheer']] : [[0, ['idle', 'cross', 'idle', 'point', 'idle', 'shrug'][i % 6]]]; actuar(c, T + i * .37, g, { T: T + i, extra: o.mode === 'cheer' ? { hipY: 2.05 + Math.abs(Math.sin(T * 6 + i)) * .3 } : {} });
    if (o.mode === 'cheer') grin(c, T + i); else cara(c, T + i, { expr: ['smile', 'neutral', 'happy', 'smug'][i % 4] }); } }); }
// gradas del parcours
function stands(T, mode = 'cheer', silent = false, nums = true, numV = null) { const n = Math.min(CRW.n, 170); for (let i = 0; i < n; i++) { const s = CRW.seat[i], q = PC.SEATS[(i * 7) % PC.SEATS.length]; s.x = PCX + q.x; s.y = q.y; s.z = q.z; s.ry = q.ry; } crowdOn(T, mode, n, silent, nums, numV); }
// ---------- atrezo ----------
const RAIN = rain(scene, 600), SNOW = snow(scene, 500); const SNOWG = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat(0xf4f8ff, { roughness: .9 })); SNOWG.rotation.x = -Math.PI / 2; SNOWG.receiveShadow = true; scene.add(SNOWG);
const TRAM = tram(scene); const AUTO = fahrschulAuto(scene); const CONES = Array.from({ length: 6 }, () => cone(scene));
const ORB = orb(scene, .7), ORB2 = orb(scene, .7), ORBS = Array.from({ length: 10 }, () => orb(scene, .5));
const JAR = jar(scene), JAR2 = jar(scene, false), SHELF = jarShelf(scene, 3, 5);
const GRILL = grill(scene); const PB = pullBar(scene); const BAG = punchBag(scene); const BALL = football(scene);
const KW = kreuzwort(false), KW2 = kreuzwort(true); scene.add(KW, KW2);
const LIC = textPlane(3.4, 2.2, 340, 220, (c, w, h) => { c.fillStyle = '#f4b8d0'; c.beginPath(); c.roundRect(0, 0, w, h, 20); c.fill(); txt(c, 'FÜHRERSCHEIN', w / 2, 34, 30, '#1a1a3a'); c.fillStyle = '#ffffff'; c.fillRect(20, 60, 100, 130); c.fillStyle = '#d8a840'; c.fillRect(40, 70, 60, 40); c.fillStyle = '#eab08a'; c.fillRect(45, 100, 50, 60); txt(c, 'JONAS', 220, 100, 34, '#1a1a3a'); txt(c, 'Versuch 38', 220, 150, 28, '#2a6ad8'); txt(c, '✓', 290, 200, 40, '#1ab84a'); }); scene.add(LIC); LIC.material.side = THREE.DoubleSide;
const CLIP = (() => { const g = new THREE.Group(); scene.add(g); box(2.4, 3.2, .15, mat(0x8a5a2a), .05, g, 0, 0, 0); const p = textPlane(2.1, 2.8, 210, 280, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); txt(c, 'PRÜFUNG', w / 2, 30, 30, '#1a1a3a'); txt(c, 'Nr. 37', w / 2, 80, 44, '#1a1a3a'); txt(c, 'NICHT', w / 2, 160, 46, '#d8323a'); txt(c, 'BESTANDEN', w / 2, 210, 40, '#d8323a'); }); p.position.z = .09; g.add(p); return g; })();
const PLATE = (() => { const g = new THREE.Group(); scene.add(g); cyl(1.4, 1.1, .2, mat(0xffffff, { roughness: .2 }), 24, g, 0, 0, 0); const f = cyl(1.0, 1.0, .12, mat(0xe8a040), 18, g, 0, .14, 0); g.userData.food = f; return g; })();
const BOOK = (() => { const g = new THREE.Group(); scene.add(g); box(3, .5, 2.2, mat(0x2a6ad8), .05, g, 0, 0, 0); const pg = textPlane(2.8, 2, 140, 100, (c, w, h) => { c.fillStyle = '#fffaf0'; c.fillRect(0, 0, w, h); txt(c, 'ENDE', w / 2, h / 2 + 4, 44, '#1a1a3a'); }); pg.rotation.x = -Math.PI / 2; pg.position.y = .27; g.add(pg); return g; })();
const PUZZ = (() => { const p = textPlane(14, 10, 420, 300, (c, w, h) => { const r = RNG(3); for (let i = 0; i < 42; i++) for (let j = 0; j < 30; j++) { const x = i * 10, y = j * 10; const g = c.createLinearGradient(0, 0, w, h); c.fillStyle = `hsl(${(200 + i * 3 + j * 2 + r() * 10) % 360},70%,${45 + (j / 30) * 25}%)`; c.fillRect(x, y, 10, 10); } c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w * .7, h * .3, 40, 0, 7); c.fill(); c.fillStyle = '#2a8a3a'; c.beginPath(); c.moveTo(0, h); c.lineTo(w * .3, h * .55); c.lineTo(w * .6, h); c.fill(); c.strokeStyle = 'rgba(0,0,0,.15)'; for (let i = 0; i < 42; i++) { c.beginPath(); c.moveTo(i * 10, 0); c.lineTo(i * 10, h); c.stroke(); } for (let j = 0; j < 30; j++) { c.beginPath(); c.moveTo(0, j * 10); c.lineTo(w, j * 10); c.stroke(); } c.fillStyle = '#5a3a1a'; c.fillRect(w * .52, h * .46, 10, 10); }); p.rotation.x = -Math.PI / 2; scene.add(p); return p; })();
const PIECE = box(.5, .12, .5, mat(0x7ac8ff), .02, scene, 0, 0, 0);
const DOENW = (() => { const g = new THREE.Group(); scene.add(g); const w = new THREE.Mesh(new THREE.ConeGeometry(.5, 1.6, 10), mat(0xf4e0b0, { roughness: .8 })); w.rotation.z = Math.PI; g.add(w); sphere(.45, mat(0xa86a3a), g, 0, .7, 0, 8, 6); sphere(.25, mat(0x5ac83a), g, .2, .9, .2, 6, 4); return g; })();
const STEAM = Array.from({ length: 5 }, () => sphere(.4, mat(0xffffff, { transparent: true, opacity: .5, depthWrite: false, roughness: 1 }), scene, 0, 0, 0, 8, 6));
const CONF = Array.from({ length: 60 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SPLASH = Array.from({ length: 18 }, () => sphere(.3, mat(0xbfe8ff, { roughness: .1, transparent: true, opacity: .8 }), scene, 0, 0, 0, 8, 6));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 4 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const SHARDS = Array.from({ length: 30 }, (_, i) => { const m = new THREE.Mesh(new THREE.TetrahedronGeometry(.3), mat(0xd8f0ff, { roughness: .05, transparent: true, opacity: .6 })); scene.add(m); return m; });
const SMOKE = Array.from({ length: 8 }, () => sphere(1, mat(0x3a3a3e, { transparent: true, opacity: .5, depthWrite: false, roughness: 1 }), scene, 0, 0, 0, 8, 6));
const HEARTS = Array.from({ length: 5 }, () => { const p = textPlane(1, 1, 64, 64, (c, w, h) => { c.fillStyle = '#ff4a7a'; c.beginPath(); c.moveTo(32, 54); c.bezierCurveTo(-10, 26, 12, -6, 32, 16); c.bezierCurveTo(52, -6, 74, 26, 32, 54); c.fill(); }); p.material.depthWrite = false; p.material.transparent = true; scene.add(p); return p; });
const QM = textPlane(1.6, 1.6, 64, 64, (c, w, h) => txt(c, '?', 32, 34, 60, '#ffd23f', '#1a1a2a', 8)); QM.material.depthWrite = false; scene.add(QM);
const PROPS = [TRAM, AUTO, ...CONES, ORB, ORB2, ...ORBS, JAR, JAR2, SHELF, GRILL, PB, BAG, BALL, KW, KW2, LIC, CLIP, PLATE, BOOK, PUZZ, PIECE, DOENW, ...STEAM, ...CONF, ...DUST, ...SPLASH, ...SWEAT, ...TEAR, ...SHARDS, ...SMOKE, ...HEARTS, QM, DAY, SNOWG];
PROPS.forEach(p => p.visible = false);
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.25; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.55, .62, .42); sun.intensity = 2.5; sun.color.setRGB(1, .95, .86); rim.intensity = 1.0;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function sunset() { day(); MODE = 'sunset'; setSky([.22, .32, .78], [.85, .55, .7], [1, .72, .45]); sun.color.setRGB(1, .82, .62); sun.intensity = 2.3; hemi.color.setRGB(1, .9, .85); scene.fog.color.setRGB(1, .82, .7); bloom.strength = .2; }
function grey() { day(); setSky([.3, .34, .42], [.45, .5, .58], [.6, .64, .7]); sun.intensity = 1.1; hemi.intensity = .95; BIRDSON = 0; }
function winter() { day(); setSky([.55, .62, .74], [.72, .78, .86], [.88, .9, .94]); sun.intensity = 1.3; hemi.intensity = 1.3; scene.fog.color.setRGB(.9, .92, .96); scene.fog.density = .003; BIRDSON = 0; }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.0; setSky([.02, .04, .16], [.08, .12, .34], [.2, .22, .46]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.0; hemi.color.setRGB(.6, .7, 1); hemi.groundColor.setRGB(.25, .25, .36); sun.intensity = 1.1; sun.color.setRGB(.72, .78, 1); rim.intensity = 1.7;
  scene.fog.color.setRGB(.1, .14, .28); scene.fog.density = .0011; bloom.strength = .3; bloom.threshold = .85; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = .95, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .2; bloom.threshold = .88; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); NUM.get(c).visible = false; if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  CRW.update(0, 'still', false, 0); NUMX.forEach(s => s.visible = false); RAIN.update(0, V(0, 0, 0), 1, 1, 1, false); SNOW.update(0, V(0, 0, 0), 1, 1, 1, false);
  RANKB.visible = POSTER.visible = GOAL.visible = ZIELB.visible = false; ZIELB.userData.tape.visible = true; PC.ROPES.forEach(r => r.rotation.set(0, 0, 0)); PC.BTN.position.y = 2.9; PC.BTNL.intensity = 0; PC.SHELF.visible = true; PC.SHELF.userData.J.forEach(j => j.visible = true); PC.vit.visible = true;
  GRILL.userData.setBurn(0); PUZZ.rotation.set(-Math.PI / 2, 0, 0);
  for (const k in SETS) SETS[k].visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = 1.1; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
// órbita: cámara a distancia d del centro c, ángulo yaw (0 = desde +z), pitch (arriba +); el centro queda al ~42 % de la altura
function orbit(c, d, yaw = 0, pitch = .15, fov = 44) { const t = Math.tan(fov * Math.PI / 360) * d * .16; cam([c.x + Math.sin(yaw) * Math.cos(pitch) * d, c.y + Math.sin(pitch) * d, c.z + Math.cos(yaw) * Math.cos(pitch) * d], [c.x, c.y - t, c.z], fov); }
const orb_ = (k, c0, c1, a, b, e = easeInOut) => { const q = e(clamp(k)); orbit(c0.clone().lerp(c1 ?? c0, q), lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q), lerp(a[3] ?? 44, b[3] ?? 44, q)); };
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function ojos(expr, T, sd) { const n = Math.sin(T * .9 + sd) * .55 + Math.sin(T * 2.3 + sd * 2.1) * .45;
  switch (expr) {
    case 'neutral': case 'talk': case undefined: return n > .25 ? 'half' : n < -.55 ? (sd % 2 ? 'side_l' : 'side_r') : 'normal';
    case 'sad': return n > -.1 ? 'half' : 'down';
    case 'happy': case 'smile': case 'relief': case 'joy': return n > -.3 ? 'happy' : 'half';
    case 'worried': return n > .45 ? 'side_l' : n < -.45 ? 'down' : 'worried';
    case 'shock': case 'gasp': return n > -.2 ? 'wide' : 'scared';
    case 'determined': return n > .5 ? 'squint' : 'angry';
    case 'angry': case 'shout': return n > .55 ? 'squint' : 'angry';
    case 'confused': return n > 0 ? 'squint' : 'side_r';
    case 'sus': case 'smug': return n > .2 ? 'squint' : 'half';
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk', extra = {}) => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat', ...extra });
const grin = (ch, T, ex = {}) => cara(ch, T, { expr: 'grin', eyes: 'happy', mouth: 'grin', ...ex });
const laughF = (ch, T) => cara(ch, T, { eyes: 'happy', mouth: Math.sin(T * 22) > 0 ? 'laugh' : 'open_smile' });
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
const tears = (ch, T) => { const h = hp(ch), s = ch.spec.scale || 1, a = ch.root.rotation.y; TEAR.forEach((d, i) => { const k = (T * 1.2 + i * .25) % 1, sd = i % 2 ? -1 : 1; d.visible = true; const lx = sd * .3 * s, lz = .62 * s; d.position.set(h.x + Math.cos(a) * lx + Math.sin(a) * lz, h.y + (.7 - k * 1.2) * s, h.z - Math.sin(a) * lx + Math.cos(a) * lz); }); };
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.7 + t * 2) * s * (.8 + r() * .5)); d.material.opacity = .55 * (1 - t / 1.2); }); }
function splash(c, T0, T, s = 1) { SPLASH.forEach((d, i) => { const r = RNG(i * 7 + 1), t = T - T0; if (t < 0 || t > 1.1) return; d.visible = true; const a = r() * 6.283, v = (2 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * t, c.y + (6 + r() * 5) * s * t - 14 * t * t, c.z + Math.sin(a) * v * t); d.scale.setScalar(s * (1 - t * .6)); }); }
function smoke(c, T, s = 1) { SMOKE.forEach((d, i) => { const k = (T * .5 + i / 8) % 1; d.visible = true; d.position.set(c.x + Math.sin(i * 2.3 + T) * .8 * s, c.y + k * 6 * s, c.z + Math.cos(i * 1.7) * .6 * s); d.scale.setScalar((.6 + k * 1.6) * s); d.material.opacity = .55 * (1 - k); }); }
function steam(c, T) { STEAM.forEach((d, i) => { const k = (T * .7 + i / 5) % 1; d.visible = true; d.position.set(c.x + Math.sin(i * 2 + T * 2) * .3, c.y + k * 2.4, c.z); d.scale.setScalar(.3 + k * .6); d.material.opacity = .5 * (1 - k); }); }
function hearts(p, T) { HEARTS.forEach((z, i) => { const k = (T * .6 + i / 5) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 1.7 + T) * 1.4, p.y + k * 3.4, p.z + .4); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
const arc = (a, b, h, k) => V(lerp(a.x, b.x, k), lerp(a.y, b.y, k) + 4 * h * k * (1 - k), lerp(a.z, b.z, k));
const loc = (ch, x, y, z) => { ch.root.updateMatrixWorld(true); return ch.root.localToWorld(V(x, y, z)); };
// ---------- capa 2D ----------
const BAD_ = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD_.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD_.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD_.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; if (x < -60 || x > W + 60) return; b.x = clamp(x, 200, W - 200); b.y = clamp(y, 150, H * .64); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num' || b.kind === 'green' || b.kind === 'gold') { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : b.kind === 'green' ? '#04300e' : b.kind === 'gold' ? '#3a2400' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#8aff9a'); g.addColorStop(1, '#1ab84a'); } else if (b.kind === 'gold') { g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a820'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'huss') { c.rotate(-.12); c.font = `700 120px ${FONT}`; c.lineWidth = 24; c.strokeStyle = '#1a1a2a'; c.strokeText(b.text, 0, 0); c.fillStyle = '#ffffff'; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  c.restore(); }
const KEY = /^(Stadt|fast|FAST|ALMOST|AH|mir|Zahl|Kopf|Kraft|870|920|990|37-mal|Führerschein|Oma|Kreuzworträtsel|25|7|kleinste|fertig|Teller|Buch|Seite|8|5000|Nacht|Beinahe-Mann|Gläser|Papa|HUSS|300|3|Regen|Schnee|Ninja-Parcours|Turm|goldene|Knopf|20|Startlinie|lachten|Wand|Pfiff|Seil|Stangen|Jonas|Stufe|fiel|Finger|Händen|los|zersprangen|still|geschafft|Wahrheit|aufgehört|umarmte|weinte|Morgen|pünktlich|warm|38|Wort|1000|Grillen|alles|Folge)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0; const COVERS = [];
let LMODE = 'day'; const town = (m = 'day') => { use('HB'); LMODE = m; if (m === 'night') night(45); else if (m === 'morning') sunset(); else if (m === 'grey') grey(); else if (m === 'winter') winter(); else day(); };
// ---------- a: gancho, la regla de los números, el pueblo del «fast», yo con un 7 (0 – 42 s) ----------
const sc_ = ch => ch.spec.scale || 1;
const headC = ch => hp(ch).add(V(0, .65 * sc_(ch), 0));
const runC = (ch, lt, x, z, ry, sp, T, o = {}) => caminar(ch, lt, { x, z, ry, speed: sp, run: true, accel: .05, T, y: o.y, extra: o.extra, stopAt: o.stopAt });
const walkC = (ch, lt, x, z, ry, sp = 3.4, T, o = {}) => caminar(ch, lt, { x, z, ry, speed: sp, accel: .1, T, y: o.y, extra: o.extra, stopAt: o.stopAt });
const SIT = { crouch: 1.0, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5 };
const FLEX = { aLx: 1.4, aLz: 1.0, aLe: 2.1, aRx: 1.4, aRz: 1.0, aRe: 2.1, lean: -.08, headX: -.05 };
const HANG = T => ({ aLx: 2.95, aRx: 2.95, aLz: .12, aRz: .12, aLe: .15, aRe: .15, lLx: .3 + Math.sin(T * 5) * .25, lRx: -.1 - Math.sin(T * 5) * .25, lLk: .6, lRk: .4, headX: -.12 });
const tramAt = (z) => show(TRAM, 26, 0, z, PI);
// dibujar el marcador del parcours
const sbDraw = (n, sub = 'SEIT 20 JAHREN', flash = false) => PC.SB.userData.draw('sb' + n + sub + flash, (c, w, h) => { c.fillStyle = '#05060c'; c.fillRect(0, 0, w, h); txt(c, 'KNOPF GEDRÜCKT', w / 2, 52, 50, '#ffd23f'); c.shadowColor = '#ff4a3a'; c.shadowBlur = 24; txt(c, String(n), w / 2, 170, 150, flash ? '#ffffff' : n ? '#5aff7a' : '#ff4a3a'); c.shadowBlur = 0; txt(c, sub, w / 2, 280, 40, '#ffffff'); c.fillStyle = 'rgba(255,255,255,.06)'; for (let y = 0; y < h; y += 6) c.fillRect(0, y, w, 2); });
// robar la fuerza: el orbe sale de encima de la cabeza y va a la mano del Beinahe-Mann
const steal = (from, k, o = ORB) => { const a = headC(from).add(V(0, 2.4 * sc_(from), 0)); const b = wpos(bm.aR.hand).add(V(0, -.8, 0)); const q = easeInOut(clamp(k)); show(o, 0, 0, 0, 0, lerp(.6, 1, q)).position.copy(arc(a, b, 2, q)); };
// número que baja a 0 (la fuerza robada)
const numDrop = (ch, k) => { const n0 = NV.get(ch); const v = Math.round(lerp(n0, 0, easeIn(clamp(k)))); num(ch, v, 1, v < 100 ? 'red' : 'zero'); };

// 1 «In dieser Stadt gewinnt jeder fast.» (zoom lento): carrera en la plaza; el corredor (950) cae a un palmo de la cinta de ZIEL; gente con números
shot(0, 'Z', 'slow', L => { town(); ZIELB.visible = true; folk(-6, -24, 70, 9, 42, L.T, 3, { face: V(-6, 0, -26), mode: 'cheer' }); const r = K[3]; NV.set(r, 950);
  const fall = clamp((L.lt - 1.35) / .4); const w = runC(r, Math.min(L.lt, 1.35), -6, -16, PI, 7.5, L.T); if (fall > 0) { r.root.position.z = -16 - 7.5 * 1.33 - fall * 1.2; applyPose(r, { lean: lerp(.4, 1.3, fall), aLx: 2.6, aRx: 2.8, aLe: .1, aRe: .1, lLx: -.4, lRx: .6, lRk: .8, crouch: fall * .6 }); r.root.position.y = -fall * .6; }
  num(r, 950); cara(r, L.T, { expr: fall > .3 ? 'shock' : 'determined' }); const k2 = put(K[6], -10.5, 0, -19, PI + .1); runC(k2, Math.min(L.lt, 1.35), -10.5, -12, PI, 6.4, L.T + 1); num(k2); cara(k2, L.T, { expr: 'determined' });
  const rp = r.root.position; orbit(V(rp.x - .3, lerp(4.4, 2.4, fall), rp.z), lerp(22, 14, easeOut(L.k)), PI + .05, lerp(.06, .2, fall), 46); sh(V(-6, 0, -26), 60); }, [[0, 'crowd_cheer', .6], [.1, 'steps_run', .5], [1.4, 'thud', .7], [1.5, 'crowd_ooh', .5]]);
// 2 «Außer mir.»: yo, el más pequeño, con un 7 rojo; los de alrededor (900+) me señalan y se ríen
shot(2.15, 'C', 'punch', L => { town(); folk(-6, -6, 50, 7, 36, L.T, 5); const c = put(ich, -6, 0, -6, 0); num(c, 7, (L.lt - .05) * 4); actuar(c, L.lt, [[0, 'idle'], [.15, 'shrug', { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  [[K[0], -9.6, -8.6, .6], [XT[4], -2.6, -8.8, -.6]].forEach(([k, x, z, ry], i) => { put(k, x, 0, z, ry); num(k); actuar(k, L.lt, [[0, i ? 'point_l' : 'point']], { T: L.T + i }); laughF(k, L.T + i); });
  orbit(headC(c).add(V(0, .6, 0)), lerp(14, 11, L.k), .05, .06, 44); sh(V(-6, 0, -6), 30); }, [[0, 'pop', .5], [.2, 'laugh_crowd', .5]]);
// 3–4 «AH! ALMOST, ALMOST, ALMOST!» (audio original): solo el corredor que perdió, sentado junto a la cinta, decepcionado, diciéndolo
shot(3.08, 'C', 'punch', L => { town(); ZIELB.visible = true; folk(-6, -24, 12, 10, 36, L.T, 7, { face: V(-6, 0, -27) }); const r = put(K[3], -6, 0, -27.6, PI); actuar(r, L.lt, [[0, { ...SIT, ...GEST.hands_head, crouch: 1.3 }], [1.1, { ...SIT, crouch: 1.3, aLx: .6, aRx: .6, aLe: 1.2, aRe: 1.2, headX: .15 }, { dur: .5 }]], { T: L.T, extra: { headY: Math.sin(L.T * 7) * .18 } }); r.root.position.y = -.2; num(r, 950); talk(r, L.T, 3.08, 5.26, 'sad');
  orbit(headC(r).add(V(0, -.3, 0)), lerp(13, 9, L.k), PI - .15 + L.k * .2, .1, 44); sh(V(-6, 0, -27), 30); }, [[0, 'groan', .5], [.4, 'crowd_ooh', .4], [1.4, 'sigh', .4]]);
// 5 «Hier hat jeder eine Zahl über dem Kopf:» grúa sobre la multitud: los números van saliendo uno a uno
shot(5.26, 'S', null, L => { town(); folk(-6, -12, 16, 3, 22, L.T, 11, { arc: [-PI, 0], max: 16 }); POST.push(() => BG.forEach((c, i) => { if (c.root.visible) num(c, NV.get(c), (L.lt - i * .08) * 4); }));
  cm([-6, 9, 14, -6, 5, -14, 50], [4, 15, 8, -7, 5, -16, 50], L.k); sh(V(-6, 0, -12), 40); }, [[0, 'pop', .5], [.3, 'pop', .4], [.6, 'pop', .4], [.9, 'pop', .4], [1.2, 'murmur', .4]]);
// 6 «seine Kraft.»: un vecino (860) saca bíceps y su número late
shot(7.32, 'C', 'punch', L => { town(); folk(-20, 10, 30, 9, 32, L.T, 13); const k = put(K[2], -20, 0, 10, .3); actuar(k, L.lt, [[0, 'idle'], [.1, FLEX, { dur: .3 }]], { T: L.T }); grin(k, L.T); num(k, 860, 1 + Math.sin(L.lt * 14) * .08);
  orbit(hp(k).add(V(0, .6, 0)), lerp(15, 12, L.k), .3 + L.k * .3, -.02, 44); sh(V(-20, 0, 10), 30); }, [[.1, 'flex', .6], [.3, 'power_on', .4]]);
// 7 «Die Straßenbahnfahrerin hat 870.»: ella delante de su tranvía amarillo, saluda; 870
shot(8.37, 'W', null, L => { town(); tramAt(44); const f = put(fahrerin, 26, 0, 28.6, PI); num(f, 870, (L.lt - .9) * 4); actuar(f, L.lt, [[0, 'idle'], [.3, 'wave', { dur: .3 }]], { T: L.T }); talk(f, L.T, 8.37, 11.1, 'happy');
  folk(26, 20, 16, 12, 30, L.T, 15); orbit(hp(f).add(V(0, -1, 0)), lerp(20, 15, L.k), PI + .35 - L.k * .3, .06, 46); sh(V(26, 0, 30), 40); }, [[0, 'tram_bell', .6], [.4, 'tram_hum', .4], [1.0, 'pop', .5]]);
// 8 «Trotzdem erreicht sie jeden Tag»: el tranvía avanza por la calle hacia la parada (travelling lateral)
shot(11.10, 'S', null, L => { town(); const z = lerp(70, 40, easeOut(L.k)); tramAt(z); const f = put(fahrerin, 26, 2.2, z - 11.5, PI); num(f, 870); actuar(f, L.lt, [[0, 'hold']], { T: L.T }); cara(f, L.T, { expr: 'happy' });
  cm([40, 8, z - 26, 26, 5, z - 10, 48], [39, 7, z - 30, 26, 5, z - 12, 48], L.k, x => x); sh(V(26, 0, z - 10), 40); }, [[0, 'tram_hum', .6], [.3, 'rails', .5], [1.0, 'tram_bell', .4]]);
// 9 «nur fast die Haltestelle.»: el tranvía frena a dos metros del cartel H; los que esperan se dan una palmada en la frente
shot(12.56, 'C', null, L => { town(); const zs = 24; const z = lerp(36, zs, easeOut(clamp(L.k * 1.6))); tramAt(z + 13); [[XT[0], 34, 10, -2.1], [XT[2], 35.4, 6.4, -2.0], [K[4], 33.6, 3, -2.3]].forEach(([k, x, zz, ry], i) => { put(k, x, 0, zz, ry); num(k); actuar(k, L.lt, [[0, 'idle'], [.55 + i * .1, i === 1 ? 'shrug' : 'facepalm', { dur: .3 }]], { T: L.T + i }); cara(k, L.T + i, { expr: L.lt > .6 ? 'bored' : 'neutral' }); });
  badge('red', '2 METER', W / 2, H * .2, (L.lt - .6) * 4, 1, .8); cm([24, 7, -14, 30.5, 4, 16, 46], [25, 6.5, -11, 30.5, 4, 16, 44], L.k); sh(V(30, 0, 12), 40); }, [[0, 'brakes', .6], [.5, 'tram_bell', .3], [.7, 'sigh', .5]]);
// 10 «Der Dönermann hat 920.»: el del döner corta carne del asador delante de su puesto; 920
shot(14.07, 'W', 'punch', L => { town(); const d = put(doenm, 37.6, 0, 40, -PI / 2); num(d, 920, (L.lt - .8) * 4); actuar(d, L.lt, [[0, { aRx: 1.2, aRe: 1.2 + Math.sin(L.T * 16) * .5, aLx: .9, aLe: 1.4, aLz: -.2 }]], { T: L.T }); grin(d, L.T); folk(36, 40, 16, 9, 26, L.T, 19);
  orbit(V(37.6, 5.6, 40), lerp(17, 14, L.k), -PI / 2 + .3 - L.k * .4, .05, 46); sh(V(38, 0, 40), 30); }, [[0, 'sizzle', .6], [.3, 'knife', .5], [.8, 'pop', .5]]);
// 11 «Er kommt fast bis zu deiner Tür.»: camina con el döner hacia mi puerta… tropieza en el último paso y el döner sale volando
shot(16.39, 'S', null, L => { town(); const tr = 1.05; const d = doenm; walkC(d, Math.min(L.lt, tr), 21, 80, -.72, 8, L.T); num(d, 920); const f = clamp((L.lt - tr) / .35);
  if (f > 0) { const dd = 8 * (tr - .05) + f * 1.6; d.root.position.x = 21 - Math.sin(.72) * dd; d.root.position.z = 80 + Math.cos(.72) * dd; applyPose(d, { lean: lerp(.2, 1.2, f), aLx: 2.4, aRx: 2.6, lLx: -.5, lRx: .8, crouch: f * .5 }); d.root.position.y = -f * .9; }
  cara(d, L.T, { expr: f > .2 ? 'shock' : 'happy' }); if (f <= 0) attach(DOENW, d.aR.hand, [0, -.6, .5], [0, 0, 0], 1); else { const p = arc(V(d.root.position.x - 1, 4, d.root.position.z + 1), V(12.6, .4, 92), 3, clamp(f * 1.2)); show(DOENW, p.x, p.y, p.z, 0).rotation.z = L.T * 8; }
  orbit(V(15.5, 4.5, 88.5), lerp(22, 18, L.k), .45 - L.k * .15, .1, 46); sh(V(16, 0, 92), 30); }, [[0, 'steps', .5], [1.05, 'trip', .6], [1.25, 'splat', .6]]);
// 12 «Mein bester Freund Jonas hat 990.»: Jonas posa con bíceps junto al coche de autoescuela; 990
shot(18.08, 'Z', 'punch', L => { town(); show(AUTO, -20, 0, 30, .5); const j = put(jonas, -15.4, 0, 33.6, .4); num(j, 990, (L.lt - 1.1) * 4); actuar(j, L.lt, [[0, 'wave'], [.6, FLEX, { dur: .3 }]], { T: L.T }); talk(j, L.T, 18.08, 18.7, 'smug'); if (L.lt > .7) grin(j, L.T);
  folk(-16, 30, 16, 12, 30, L.T, 21); orbit(hp(j).add(V(0, -.6, 0)), lerp(17, 13, L.k), .35 - L.k * .3, .06, 44); sh(V(-17, 0, 32), 30); }, [[0, 'car_idle', .4], [.6, 'flex', .5], [1.1, 'pop', .5]]);
// 13 «Er hat 37-mal»: Jonas al volante; el coche arrolla los conos de la prueba; «37×»
shot(20.89, 'W', null, L => { town(); const z = lerp(150, 132, L.k); show(AUTO, 26, 0, z, PI); const j = put(jonas, 25, 1.25, z - .2, PI); applyPose(j, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: .6, aRe: .6, headX: -.05 }); cara(j, L.T, { expr: L.lt > .5 ? 'shock' : 'determined' }); num(j, 990);
  CONES.forEach((c, i) => { const cz = 140 - i * 4, hit = z - 5 < cz; const t = clamp((cz - (z - 5)) / 6); show(c, 26 + (i % 2 ? 1.4 : -1.4) + (hit ? (i % 2 ? 4 : -4) * t : 0), hit ? 3 * Math.sin(t * PI) : 0, cz - (hit ? 3 * t : 0), 0).rotation.set(hit ? t * 4 : 0, 0, hit ? t * 3 : 0); });
  badge('red', '37×', W * .5, H * .56, (L.lt - .2) * 4, 1, 1); cm([16, 6, z - 16, 26, 3.5, z - 2, 46], [17, 5, z - 14, 26, 3.5, z, 46], L.k); sh(V(26, 0, z - 4), 30); }, [[0, 'car_drive', .6], [.4, 'cone_hit', .6], [.8, 'cone_hit', .5]]);
// 14 «fast den Führerschein bestanden.»: el profesor le enseña la hoja: Nr. 37 – NICHT BESTANDEN; Jonas se queda helado
shot(22.13, 'C', null, L => { town(); show(AUTO, 26, 0, 132, PI); const p = put(lehrer, 21.6, 0, 129, PI / 2 + .8); num(p); actuar(p, L.lt, [[0, { aRx: 1.5, aRe: .4, aLz: .1 }]], { T: L.T }); talk(p, L.T, 22.12, 23.85, 'sus'); POST.push(() => { const hpz = wpos(p.aR.hand); show(CLIP, hpz.x + .6, hpz.y - .4, hpz.z - .6, faceTo(hpz, camera.position)); });
  const j = put(jonas, 25.2, 0, 128.4, -PI / 2 - .8); num(j, 990); actuar(j, L.lt, [[0, 'idle'], [.4, 'shock', { dur: .3 }]], { T: L.T }); cara(j, L.T, { expr: 'shock' });
  orbit(V(23.3, 5, 128.3), lerp(17, 14, L.k), PI + .1 - L.k * .2, .08, 44); sh(V(23, 0, 129), 30); }, [[0, 'paper', .6], [.4, 'gasp', .5]]);
// 15–16 «AH! ALMOST ×3»: solo Jonas, junto al coche, hundido, diciéndolo
shot(23.87, 'C', 'punch', L => { town(); show(AUTO, 26, 0, 132, PI); const j = put(jonas, 25.4, 0, 127.6, -PI / 2 - .4); num(j, 990); actuar(j, L.lt, [[0, 'hands_head'], [1.1, 'slump', { dur: .5 }]], { T: L.T, extra: { headY: Math.sin(L.T * 7) * .15 } }); talk(j, L.T, 23.87, 26.01, 'sad');
  orbit(hp(j).add(V(0, -.3, 0)), lerp(12.5, 9, L.k), -PI / 2 - .5 + L.k * .2, .05, 44); sh(V(25, 0, 128), 20); }, [[0, 'groan', .4], [1.2, 'sigh', .4]]);
// 17 «Sogar meine Oma hat ihr Kreuzworträtsel»: la Oma en su sillón con el crucigrama y el lápiz; 640
shot(26.01, 'R', null, L => { use('OS'); inside(1, 40); const o = put(oma, OSX - 6, 2.75, -3, .5); num(o, 640, (L.lt - .4) * 4); actuar(o, L.lt, [[0, { ...SIT, aLx: 1.1, aRx: 1.3, aLe: 1.0, aRe: 1.2 + Math.sin(L.T * 12) * .15, aLz: -.2, aRz: -.3, headX: .3 }]], { T: L.T }); cara(o, L.T, { expr: 'confused', eyes: 'down' });
  show(KW, OSX - 6 + Math.sin(.5) * 2.2, 5.0, -3 + Math.cos(.5) * 2.2, .5, .7); KW.rotation.x = -.7; orbit(hp(o).add(V(0, -.6, 0)), lerp(15, 12, L.k), .5 + .3 - L.k * .4, .2, 46); sh(V(OSX - 6, 0, -3), 30); }, [[0, 'clock_tick', .5], [.4, 'pencil', .5], [1.2, 'hmm', .4]]);
// 18 «vor 25 Jahren fast gelöst.»: plano del crucigrama: falta UNA casilla (en rojo); «25 JAHRE»
shot(28.09, 'Z', 'punch', L => { use('OS'); inside(1, 40); const o = put(oma, OSX - 6, 2.75, -3, .5); num(o, 640); actuar(o, L.lt, [[0, { ...SIT, aLx: 1.1, aRx: 1.3, aLe: 1.0, aRe: 1.2, aLz: -.2, aRz: -.3, headX: .3 }]], { T: L.T }); cara(o, L.T, { expr: 'sad', eyes: 'down' });
  show(KW, OSX - 6 + Math.sin(.5) * 2.2, 5.0, -3 + Math.cos(.5) * 2.2, .5, .7); KW.rotation.x = -.7; const p = wpos(KW); badge('gold', '25 JAHRE', W / 2, H * .17, (L.lt - .1) * 4, 1, .9); const n = V(Math.sin(.5) * .75, .66, Math.cos(.5) * .75); const d = lerp(8, 5, easeOut(L.k)); cam([p.x + n.x * d, p.y + n.y * d, p.z + n.z * d], [p.x, p.y + .9, p.z], 44); sh(V(OSX - 6, 0, -3), 20); }, [[0, 'zoom_fast', .4], [.3, 'clock_tick', .5], [1.0, 'sigh_old', .4]]);
// 19 «Und ich?»: yo en la plaza, me señalo a mí mismo
shot(30.22, 'W', null, L => { town(); folk(-6, -6, 40, 8, 34, L.T, 23); const c = put(ich, -6, 0, -6, .1); num(c, 7); actuar(c, L.lt, [[0, { aRx: 1.3, aRz: -.6, aRe: 1.8 }]], { T: L.T }); talk(c, L.T, 30.22, 30.8, 'confused');
  orbit(headC(c), lerp(12, 10, L.k), -.25 + L.k * .2, .05, 44); sh(V(-6, 0, -6), 30); }, [[0, 'pop', .4]]);
// 20 «Ich habe 7.»: golpe de zoom al 7 rojo, que tiembla; sonrisa nerviosa
shot(30.80, 'C', 'punch', L => { town(); folk(-6, -6, 40, 8, 34, L.T, 23); const c = put(ich, -6, 0, -6, .1); num(c, 7, 1 + Math.sin(L.lt * 20) * .06); actuar(c, L.lt, [[0, 'shrug']], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' });
  const p = wpos(NUM.get(c)); orbit(p.add(V(0, -1.6, 0)), lerp(9, 7, L.k), .05, .1, 42); sh(V(-6, 0, -6), 20); }, [[0, 'buzzer', .5], [.3, 'boing', .4]]);
// 21 «Die kleinste Zahl der ganzen Stadt.»: yo delante del tablón «KRAFT-RANGLISTE»: 412.º, ICH, 7
shot(31.62, 'S', null, L => { town(); RANKB.visible = true; folk(4, -44, 30, 10, 34, L.T, 25); const c = put(ich, 7.4, 0, -45.2, PI + .7); num(c, 7); actuar(c, L.lt, [[0, { headX: -.35 }], [1.1, 'slump', { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  [[K[5], -2, -40, PI - .3]].forEach(([k, x, z, ry], i) => { put(k, x, 0, z, ry); num(k); actuar(k, L.lt, [[0, i ? 'cross' : 'point']], { T: L.T + i }); laughF(k, L.T + i); });
  cm([12, 6, -27, 4.6, 6.5, -49, 46], [6, 9, -25, 4.6, 7, -49, 46], L.k); sh(V(4, 0, -46), 30); }, [[0, 'whoosh', .4], [.5, 'laugh_crowd', .4], [1.3, 'sad_trombone', .4]]);
// 22 «Aber ich mache alles fertig.»: yo, decidido, puño arriba delante de mi casa; «FERTIG ✓»
shot(33.89, 'Z', 'punch', L => { town(); const c = put(ich, 18, 0, 97, PI / 2 - .3); num(c, 7); actuar(c, L.lt, [[0, 'fists'], [.3, { aRx: 2.9, aRz: .3, aRe: .3, aLx: .8, aLe: 1.6 }, { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  badge('green', 'FERTIG ✓', W / 2, H * .18, (L.lt - .35) * 4, 1, .9); orbit(headC(c).add(V(0, -.8, 0)), lerp(13, 10, L.k), PI / 2 - .3 + .5 - L.k * .6, -.05, 44); sh(V(18, 0, 97), 30); }, [[0, 'whoosh', .4], [.35, 'ding', .6]]);
// 23 «Jeden Teller.»: en la cocina rebaño el plato hasta dejarlo brillante
shot(35.52, 'W', null, L => { use('KU'); inside(1, 40); KU.milk.visible = false; const c = put(ich, KUX + 7.6, 0, 2, -PI / 2); applyPose(c, { aRx: 1.1, aRe: 1.0 + Math.sin(L.T * 14) * .35, aLx: .8, aLe: 1.1, headX: .45, lean: .15 }); cara(c, L.T, { expr: 'happy', eyes: 'down' }); num(c, 7);
  show(PLATE, KUX + 5, 4.31, 2, 0); PLATE.userData.food.scale.setScalar(Math.max(.01, 1 - L.k * 1.3)); orbit(hp(c).add(V(-1.2, -1.6, 0)), lerp(12, 10, L.k), -1.0 + L.k * .2, .85, 46); sh(V(KUX + 6, 0, 2), 20); }, [[0, 'fork', .5], [.4, 'fork', .5], [.8, 'sparkle', .5]]);
// 24 «Jedes Buch bis zur letzten Seite.»: leo en la cama hasta la última página: ENDE
shot(36.34, 'S', null, L => { use('ZI'); inside(.9, 40); const c = put(ich, ZIX + 13, 2.6, -2, 0); applyPose(c, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: 1.1, aRe: 1.1, headX: .35 }); cara(c, L.T, { expr: L.k > .7 ? 'joy' : 'neutral', eyes: L.k > .7 ? 'happy' : 'down' }); num(c, 7);
  POST.push(() => { const a = wpos(c.aL.hand), b = wpos(c.aR.hand); const m = a.clone().lerp(b, .5); show(BOOK, m.x, m.y - .5, m.z + .7, 0, .8); BOOK.rotation.x = .5; }); badge('tag', 'SEITE 498 / 498', W / 2, H * .18, (L.lt - .4) * 4); orbit(hp(c).add(V(0, -1.2, 0)), lerp(12, 9, L.k), -.4 + L.k * .5, .25, 44); sh(V(ZIX + 13, 0, -2), 20); }, [[0, 'pages', .6], [1.0, 'book_close', .6]]);
// 25 «Mit 8 Jahren ein Puzzle mit 5000 Teilen,»: yo de pequeño (8 años) en el suelo con un puzle enorme; pongo la última pieza
shot(38.47, 'Z', null, L => { use('ZI'); inside(.8, 45); show(PUZZ, ZIX - 2, .08, 1.5); PUZZ.rotation.set(-PI / 2, 0, 0); const c = put(klein, ZIX - 2, 0, -4.4, 0); applyPose(c, { crouch: 1.0, lLx: 1.4, lRx: 1.4, lLk: 2.2, lRk: 2.2, lean: .5, aRx: 1.4, aRe: .4, headX: .3 }); c.root.position.y = -.3; cara(c, L.T, { expr: 'determined', eyes: 'down' }); num(c, 7);
  const q = clamp(L.lt / 1.6); show(PIECE, lerp(ZIX - 1.4, ZIX - 1.6, q), lerp(1.6, .16, easeIn(q)), lerp(-2.6, 1.6, q), 0); badge('big', '5000 TEILE', W / 2, H * .17, (L.lt - .2) * 4, 1, .85); badge('tag', '8 JAHRE', W / 2, H * .25, (L.lt - .6) * 4);
  cm([ZIX + 1, 6, 6, ZIX - 2, 2, -3.4, 46], [ZIX, 5, 5, ZIX - 2, 2, -3.6, 44], L.k); sh(V(ZIX - 2, 0, 4), 20); }, [[0, 'puzzle', .6], [.8, 'puzzle', .5], [1.8, 'click', .6]]);
// 26 «in einer Nacht.»: la cámara sube del puzle terminado a la ventana con la luna; el pequeño se estira y bosteza
shot(40.98, 'S', null, L => { use('ZI'); inside(.7, 40); show(PUZZ, ZIX - 2, .08, 2); PUZZ.rotation.set(-PI / 2, 0, 0); const c = put(klein, ZIX - 2, 0, -4.4, .3); applyPose(c, { aRx: 2.8, aLx: 2.8, aRe: .6, aLe: .6, headX: -.2 }); cara(c, L.T, { expr: 'yawn' }); num(c, 7);
  badge('tag', '1 NACHT', W / 2, H * .18, (L.lt - .3) * 4); cm([ZIX + 2, 8, 9, ZIX - 2, 2, -2, 48], [ZIX - 2, 10, 8, ZIX - 10, 8, -14, 48], L.k); sh(V(ZIX - 2, 0, 4), 20); }, [[0, 'yawn', .5], [.4, 'owl', .4]]);
// ---------- b: el Beinahe-Mann, Papa, el entrenamiento (HUSS), el Ninja-Parcours (42 – 79,7 s) ----------
const huss = (L, i) => badge('huss', 'HUSS!', W * (i % 2 ? .66 : .34), H * (.16 + (i % 3) * .03), L.lt * 6, 1, 1);
const gardenP = (L, m = 'day') => { town(m); show(GRILL, 24, 0, 95, 0); };
// 27 «Warum?»: yo en la plaza al atardecer, pensando; un «?» gira sobre mi cabeza
shot(42.07, 'Z', 'punch', L => { town('morning'); folk(-6, -6, 30, 9, 34, L.T, 31); const c = put(ich, -6, 0, -6, .15); num(c, 7); actuar(c, L.lt, [[0, 'think']], { T: L.T }); cara(c, L.T, { expr: 'confused' }); const h = headC(c); show(QM, h.x + 1.3, h.y + .7, h.z + .9, 0, 1 + Math.sin(L.T * 8) * .1); QM.lookAt(camera.position);
  orbit(h.add(V(0, -.4, 0)), lerp(10, 8, L.k), .15 + L.k * .3, .05, 44); sh(V(-6, 0, -6), 30); }, [[0, 'hmm', .5]]);
// 28 «Wegen dem Beinahe-Mann.» (zoom lento): de noche, bajo una farola de la plaza, el hombre gris altísimo sonríe
shot(42.52, 'F', 'slow', L => { town('night'); const b = put(bm, -30, 0, 0, PI / 2 - .1); actuar(b, L.lt, [[0, { aRx: .6, aRz: -.3, aRe: 1.6, aLx: .3, aLe: .4, headX: -.1, lean: .05 }]], { T: L.T }); cara(b, L.T, { expr: 'smug', mouth: 'grin' });
  orbit(hp(b).add(V(0, -2.2, 0)), lerp(26, 17, easeIn(L.k)), PI / 2 - .1, .05, 46); sh(V(-30, 0, 0), 30); }, [[0, 'wind_night', .5], [.3, 'steps_slow', .4], [1.0, 'creepy_laugh', .4]]);
// 29 «Kurz vor jedem Ziel»: de noche, un corredor llega a la meta… detrás, el Beinahe-Mann alarga la mano
shot(43.97, 'W', null, L => { town('night'); ZIELB.visible = true; const r = K[3]; runC(r, L.lt, -6, -18, PI, 4, L.T); num(r, 950); cara(r, L.T, { expr: 'determined' }); const b = put(bm, -1, 0, r.root.position.z + 4.2, PI - .3); actuar(b, L.lt, [[0, 'sneak'], [.5, 'reach', { dur: .4 }]], { T: L.T }); cara(b, L.T, { expr: 'smug', mouth: 'grin' });
  orbit(V(-4.5, 5, r.root.position.z + 1.5), lerp(22, 18, L.k), PI + .45, .08, 46); sh(V(-5, 0, -22), 30); }, [[0, 'steps_run', .5], [.6, 'whoosh_dark', .5]]);
// 30 «klaut er dir die Kraft»: la bola de luz sale de su cabeza a la mano gris; su 950 cae a 0
shot(44.97, 'C', 'punch', L => { town('night'); ZIELB.visible = true; const r = put(K[3], -6, 0, -22.4, PI); actuar(r, L.lt, [[0, 'idle'], [.5, 'slump', { dur: .4 }]], { T: L.T }); numDrop(r, (L.lt - .3) * 1.6); cara(r, L.T, { expr: L.lt > .5 ? 'sad' : 'shock' }); const b = put(bm, -1.6, 0, -18.6, PI - .6); actuar(b, L.lt, [[0, 'reach'], [.6, { aRx: 1.2, aRe: 1.4, aLx: .3, lean: -.05 }, { dur: .3 }]], { T: L.T }); cara(b, L.T, { expr: 'grin', mouth: 'grin' });
  steal(r, (L.lt - .2) / .7); orbit(V(-3.6, 7, -20.5), lerp(21, 18, L.k), PI - .35 + L.k * .2, .12, 46); sh(V(-5, 0, -21), 30); }, [[.2, 'magic_suck', .7], [.7, 'power_down', .6]]);
// 31 «und sperrt sie in Gläser.»: mete la luz en un frasco; detrás, la estantería llena de frascos brillantes
shot(45.97, 'S', null, L => { town('night'); show(SHELF, -40, 0, -2, PI / 2 + .1); const b = put(bm, -34.5, 0, -1, -PI / 2 + 1.2); actuar(b, L.lt, [[0, { aRx: 1.2, aRe: 1.4, aLx: 1.0, aLe: 1.2, headX: .3, lean: .1 }]], { T: L.T }); cara(b, L.T, { expr: 'grin', mouth: 'grin', eyes: 'down' });
  const hpz = wpos(b.aL.hand); show(JAR, hpz.x - .2, hpz.y - 2.6, hpz.z, 0); const q = clamp(L.lt / .8); show(ORB, 0, 0, 0, 0, lerp(1, .8, q)).position.copy(wpos(b.aR.hand).lerp(hpz.clone().add(V(-.2, -1.6, 0)), easeInOut(q)));
  JAR.userData.orb.visible = q >= 1; if (q >= 1) ORB.visible = false; orbit(V(-36.5, 7, -1), lerp(18, 15, L.k), .7 - L.k * .3, .06, 46); sh(V(-36, 0, -1), 30); }, [[0, 'glass_clink', .6], [.8, 'lid_close', .6], [1.0, 'creepy_laugh', .3]]);
// 32 «Aber meine 7?»: el Beinahe-Mann se agacha sobre mí y olisquea mi 7
shot(47.39, 'C', 'punch', L => { town('night'); const c = put(ich, -10, 0, 10, .4); num(c, 7); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'up' }); const b = put(bm, -12.2, 0, 7.4, .7); actuar(b, L.lt, [[0, { lean: .35, headX: .15, aRx: .9, aRe: 1.2, aLx: .4, aLe: .6 }]], { T: L.T }); cara(b, L.T, { expr: 'sus' });
  orbit(V(-10.8, 8.6, 9), lerp(18, 15, L.k), .9 - L.k * .25, -.08, 46); sh(V(-11, 0, 9), 30); }, [[0, 'sniff', .6], [.6, 'hmm_deep', .4]]);
// 33 «Die will er nicht.»: hace un gesto de asco con la mano y se va; yo me encojo de hombros
shot(48.37, 'W', null, L => { town('night'); const c = put(ich, -10, 0, 10, .4); num(c, 7); actuar(c, L.lt, [[0, 'idle'], [.5, 'shrug', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'confused' }); const b = walkC(bm, Math.max(0, L.lt - .3), -12.2, 7.4, -2.3, 3, L.T, { extra: L.lt < .5 ? { aRx: 1.2, aRz: -.4, aRe: .4 + Math.sin(L.T * 14) * .4 } : {} }); cara(bm, L.T, { expr: 'bored', mouth: 'frown' });
  orbit(V(-11, 6, 8.6), lerp(16, 19, L.k), .4 + L.k * .35, .08, 46); sh(V(-11, 0, 8), 30); }, [[0, 'pfft', .6], [.3, 'steps_slow', .4]]);
// 34 «Papa sagt immer:»: en el jardín, Papa (540) junto a la parrilla me pone la mano en el hombro
shot(49.15, 'Z', null, L => { gardenP(L); const p = put(papa, 17.6, 0, 98.4, PI / 2 + .3), c = put(ich, 20.6, 0, 99.6, -PI / 2 - .4); num(p); num(c, 7); actuar(p, L.lt, [[0, { aLx: 1.3, aLz: -.4, aLe: .4 }]], { T: L.T }); talk(p, L.T, 49.14, 50.14, 'smile'); actuar(c, L.lt, [[0, { headX: -.2 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'up' });
  orbit(V(19.2, 4.8, 99), lerp(17, 14, L.k), .1 + L.k * .2, .08, 46); sh(V(19, 0, 99), 30); }, [[0, 'birds', .4], [.3, 'sizzle', .3]]);
// 35 «„Hör nie bei fast auf.“»: primer plano de Papa con el dedo levantado
shot(50.13, 'C', 'punch', L => { gardenP(L); const p = put(papa, 17.6, 0, 98.4, PI / 2 + .3); num(p); actuar(p, L.lt, [[0, { aRx: 2.3, aRz: -.2, aRe: 1.6, headX: -.05 }]], { T: L.T }); talk(p, L.T, 50.14, 51.64, 'determined');
  bubble(p, 'Hör nie bei fast auf!', (L.lt - .05) * 4, 2.6); orbit(hp(p).add(V(0, -.2, 0)), lerp(12.5, 10.5, L.k), PI / 2 - .5 + L.k * .2, .03, 42); sh(V(18, 0, 98), 20); }, [[0, 'pop', .5]]);
// 36 «Also trainierte ich.»: me cuelgo de la barra del jardín y subo
shot(51.76, 'W', null, L => { gardenP(L); show(PB, 12, 0, 104, PI / 2 - .3); const up = Math.max(0, Math.sin(L.lt * 5)); const c = put(ich, 12, 9.6 - 5.9 * .82 + .2 + up * .8, 104, PI / 2 - .3); applyPose(c, { ...HANG(L.T), aLe: 1.4 * up + .2, aRe: 1.4 * up + .2 }); num(c, 7); cara(c, L.T, { expr: 'determined' }); sweat(c, L.T, 2);
  orbit(V(12, 7, 104), lerp(16, 13, L.k), PI / 2 - .3 + .2 - L.k * .4, .05, 46); sh(V(12, 0, 104), 20); }, [[0, 'grunt', .5], [.6, 'metal_creak', .4]]);
// 37 «Tag für Tag.»: el calendario pasa días (MO, DI, MI…) mientras hago sentadillas delante
shot(52.88, 'S', null, L => { gardenP(L, 'morning'); const d = ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'][Math.floor(L.lt * 6) % 7]; show(DAY, 17, 6.5, 104.6, PI / 2 - .3, 1); DAY.userData.draw(String(1 + Math.floor(L.lt * 6)), d); const c = put(ich, 21, 0, 101, PI / 2 - .2); const sq = (Math.sin(L.T * 9) + 1) / 2; actuar(c, L.lt, [[0, { crouch: sq * 1.2, lLx: sq * 1.2, lRx: sq * 1.2, lLk: sq * 2.2, lRk: sq * 2.2, aLx: 1.5, aRx: 1.5, lean: sq * .4 }]], { T: L.T }); c.root.position.y = 0; num(c, 7); cara(c, L.T, { expr: 'determined' });
  orbit(V(19.5, 5, 102.6), lerp(16, 14, L.k), PI / 2 - .2 + .25 + L.k * .2, .06, 46); sh(V(19, 0, 102), 20); }, [[0, 'page_flip', .5], [.4, 'page_flip', .5], [.8, 'page_flip', .5]]);
// 38–43 «HUSS!» ×6 (cortes de 0,3 s): saco, dominada, sprint, salto, flexión, cuerda
const H1 = [54.11, 54.43, 54.75, 55.04, 55.36, 55.66];
shot(H1[0], 'C', 'punch', L => { gardenP(L); show(BAG, 22, 10, 112, 0).rotation.z = Math.sin(L.T * 9) * .2; const c = put(ich, 22, 0, 108.6, 0); actuar(c, L.lt, [[0, { aRx: 1.6, aRe: .1, aLx: .9, aLe: 2, lean: .2, twist: .3 }]], { T: L.T }); num(c, 7); cara(c, L.T, { expr: 'shout' }); huss(L, 0); orbit(V(22, 5, 110), 12, 1.25, .08, 46); sh(V(22, 0, 110), 20); }, [[0, 'punch_bag', .7]]);
shot(H1[1], 'C', 'punch', L => { gardenP(L); show(PB, 12, 0, 104, PI / 2 - .3); const c = put(ich, 12, 9.6 - 5.9 * .82 + .3, 104, PI / 2 - .3); applyPose(c, { ...HANG(L.T), aLe: 1.6, aRe: 1.6 }); num(c, 7); cara(c, L.T, { expr: 'shout' }); huss(L, 1); orbit(V(12, 8.5, 104), 10, PI / 2 + .3, -.15, 44); sh(V(12, 0, 104), 20); }, [[0, 'grunt', .6]]);
shot(H1[2], 'C', 'punch', L => { town(); folk(-6, -10, 30, 10, 34, L.T, 41); const c = ich; runC(c, L.lt, -6, 6, PI, 10, L.T); num(c, 7); cara(c, L.T, { expr: 'shout' }); huss(L, 2); orbit(V(-6, 3.5, c.root.position.z), 11, PI - .2, .05, 46); sh(V(-6, 0, 4), 30); }, [[0, 'whoosh', .6]]);
shot(H1[3], 'C', 'punch', L => { town(); const c = put(ich, -36, 0, 20); saltar(c, L.lt + .1, 0, { h: 3.2, dur: .4, base: [-36, 0, 20] }); c.root.rotation.y = PI / 2; num(c, 7); cara(c, L.T, { expr: 'shout' }); huss(L, 3); orbit(V(-36, 4, 20), 13, PI / 2 + .4, .1, 46); sh(V(-36, 0, 20), 30); }, [[0, 'jump', .6]]);
shot(H1[4], 'C', 'punch', L => { gardenP(L); const c = put(ich, 18, .55, 104, PI / 2); c.root.rotation.x = PI / 2 - .38; const dn = (Math.sin(L.T * 14) + 1) / 2; applyPose(c, { aLx: 1.57, aRx: 1.57, aLe: dn * 1.2, aRe: dn * 1.2, headX: -.6 }); num(c, 7); cara(c, L.T, { expr: 'shout' }); huss(L, 4); orbit(V(19.5, 1.8, 104), 11, .3, .2, 46); sh(V(19, 0, 104), 20); }, [[0, 'grunt', .6]]);
shot(H1[5], 'C', 'punch', L => { town(); const c = put(ich, -6, 6.6, -66, 0); runC(c, L.lt, -6, -64, PI, 6, L.T, { y: 4 + L.lt * 3 }); num(c, 7); cara(c, L.T, { expr: 'shout' }); huss(L, 5); orbit(V(-6, 7, c.root.position.z), 13, PI - .3, .05, 46); sh(V(-6, 0, -66), 30); }, [[0, 'steps_run', .6]]);
// 44 «300 Liegestütze am Morgen.»: amanecer, flexiones en el jardín; el contador sube a 300
shot(56.03, 'Z', null, L => { gardenP(L, 'morning'); const c = put(ich, 18, .55, 104, PI / 2); c.root.rotation.x = PI / 2 - .38; const dn = (Math.sin(L.T * 10) + 1) / 2; applyPose(c, { aLx: 1.57, aRx: 1.57, aLe: dn * 1.2, aRe: dn * 1.2, headX: -.6 }); num(c, 7); cara(c, L.T, { expr: 'determined' }); sweat(c, L.T, 2);
  badge('big', String(Math.min(300, Math.round(lerp(240, 300, L.k * 1.2)))), W / 2, H * .2, L.lt * 4, 1, 1); orbit(V(19.5, 2, 104), lerp(13, 11, L.k), .2 + L.k * .3, .22, 46); sh(V(19, 0, 104), 20); }, [[0, 'birds', .4], [.2, 'grunt', .4], [.8, 'grunt', .4], [1.3, 'ding', .4]]);
// 45 «3 Kilometer zur Schule, rennend.»: corro por la carretera con la mochila; cartel «Schule 3 km»
shot(57.59, 'W', null, L => { town('morning'); const c = ich; runC(c, L.lt, 26, 190, PI, 7, L.T); num(c, 7); cara(c, L.T, { expr: 'determined' }); badge('tag', 'SCHULE 3 KM', W / 2, H * .18, (L.lt - .1) * 4);
  orbit(V(26, 3.5, c.root.position.z), lerp(14, 12, L.k), PI - .5 + L.k * .3, .06, 46); sh(V(26, 0, 180), 30); }, [[0, 'steps_run', .6], [.8, 'birds', .3]]);
// 46 «Im Regen.»: corriendo bajo la lluvia, salpicando
shot(59.72, 'S', null, L => { town('grey'); TINT = 'rgba(40,60,90,.18)'; const c = ich; runC(c, L.lt, 26, 160, PI, 7, L.T); num(c, 7); cara(c, L.T, { expr: 'determined' }); RAIN.update(L.T, V(26, 0, c.root.position.z - 4), 36, 36, 30); splash(V(26, 0, c.root.position.z), 59.72 + .3, L.T, .5);
  orbit(V(26, 3.8, c.root.position.z), lerp(12, 11, L.k), PI + .4, .08, 46); sh(V(26, 0, 154), 30); }, [[0, 'rain', .6], [.3, 'splash_step', .5]]);
// 47 «Im Schnee.»: corriendo en la nieve
shot(60.66, 'C', null, L => { town('winter'); show(SNOWG, 26, .1, 140, 0); SNOWG.rotation.set(-PI / 2, 0, 0); const c = ich; runC(c, L.lt, 26, 140, PI, 6, L.T); num(c, 7); cara(c, L.T, { expr: 'determined' }); SNOW.update(L.T, V(26, 0, c.root.position.z - 6), 40, 40, 30);
  orbit(V(26, 3.6, c.root.position.z), lerp(13, 11, L.k), PI - .35, .06, 46); sh(V(26, 0, 136), 30); }, [[0, 'wind', .5], [.2, 'snow_steps', .6]]);
// 48–53 «HUSS!» ×6: más entrenamiento en ráfaga
const H2 = [61.46, 61.75, 62.05, 62.35, 62.66, 62.96];
shot(H2[0], 'C', 'punch', L => { town('winter'); show(SNOWG, 26, .1, 140, 0); SNOWG.rotation.set(-PI / 2, 0, 0); const c = ich; runC(c, L.lt, 26, 132, PI, 9, L.T); num(c, 7); cara(c, L.T, { expr: 'shout' }); SNOW.update(L.T, V(26, 0, 128), 40, 40, 30); huss(L, 0); orbit(V(26, 3.6, c.root.position.z), 10, PI + .3, .05, 46); sh(V(26, 0, 130), 30); }, [[0, 'snow_steps', .6]]);
shot(H2[1], 'C', 'punch', L => { gardenP(L, 'grey'); RAIN.update(L.T, V(22, 0, 110), 30, 30, 30); show(BAG, 22, 10, 112, 0).rotation.z = Math.sin(L.T * 9) * .25; const c = put(ich, 22, 0, 108.6, 0); actuar(c, L.lt, [[0, { aLx: 1.6, aLe: .1, aRx: .9, aRe: 2, lean: .2, twist: -.3 }]], { T: L.T }); num(c, 7); cara(c, L.T, { expr: 'shout' }); huss(L, 1); orbit(V(22, 5, 110), 12, 1.6, .08, 46); sh(V(22, 0, 110), 20); }, [[0, 'punch_bag', .7]]);
shot(H2[2], 'C', 'punch', L => { gardenP(L, 'morning'); show(PB, 12, 0, 104, PI / 2 - .3); const c = put(ich, 12, 9.6 - 5.9 * .82 + .3, 104, PI / 2 - .3); applyPose(c, { ...HANG(L.T), aLe: 1.6, aRe: 1.6 }); num(c, 7); cara(c, L.T, { expr: 'shout' }); huss(L, 2); orbit(V(12, 8.5, 104), 10, PI / 2 - .7, -.1, 44); sh(V(12, 0, 104), 20); }, [[0, 'grunt', .6]]);
shot(H2[3], 'C', 'punch', L => { town('grey'); RAIN.update(L.T, V(-6, 0, -66), 30, 30, 30); const c = put(ich, -6, 6.6, -66, 0); runC(c, L.lt, -6, -64, PI, 6, L.T, { y: 4 + L.lt * 3 }); num(c, 7); cara(c, L.T, { expr: 'shout' }); huss(L, 3); orbit(V(-6, 7, c.root.position.z), 12, PI + .4, .05, 46); sh(V(-6, 0, -66), 30); }, [[0, 'steps_run', .6]]);
shot(H2[4], 'C', 'punch', L => { town('winter'); show(SNOWG, -36, .1, 20, 0); SNOWG.rotation.set(-PI / 2, 0, 0); SNOW.update(L.T, V(-36, 0, 20), 30, 30, 30); const c = put(ich, -36, 0, 20); saltar(c, L.lt + .1, 0, { h: 3.2, dur: .4, base: [-36, .1, 20] }); c.root.rotation.y = PI / 2; num(c, 7); cara(c, L.T, { expr: 'shout' }); huss(L, 4); orbit(V(-36, 4, 20), 13, PI / 2 - .3, .1, 46); sh(V(-36, 0, 20), 30); }, [[0, 'jump', .6]]);
shot(H2[5], 'C', 'punch', L => { gardenP(L, 'morning'); const c = put(ich, 18, .55, 104, PI / 2); c.root.rotation.x = PI / 2 - .38; const dn = (Math.sin(L.T * 14) + 1) / 2; applyPose(c, { aLx: 1.57, aRx: 1.57, aLe: dn * 1.2, aRe: dn * 1.2, headX: -.6 }); num(c, 7); cara(c, L.T, { expr: 'shout' }); huss(L, 5); orbit(V(19.5, 1.8, 104), 11, .6, .3, 46); sh(V(19, 0, 104), 20); }, [[0, 'grunt', .6]]);
// 54 «Dann kam die größte Herausforderung des Jahres:»: el cartel del NINJA-PARCOURS en la plaza; la gente se agolpa; yo delante, mirando
shot(63.33, 'F', null, L => { town(); POSTER.visible = true; folk(-24, 6, 36, 7, 30, L.T, 51, { face: V(-24, 0, 6) }); const c = put(ich, -13.2, 0, 13.4, .5); num(c, 7); actuar(c, L.lt, [[0, { headX: -.25 }], [.8, 'point_l', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'gasp', eyes: 'up' });
  cm([-5, 7, 24, -21, 6.5, 6, 48], [-8, 8, 23, -21, 7, 6, 46], L.k); sh(V(-22, 0, 8), 30); }, [[0, 'crowd_murmur', .5], [.4, 'paper', .4], [1.2, 'gasp', .4]]);
// 55 «der Ninja-Parcours der Stadt.» (zoom lento): gran plano aéreo del parcours con las gradas llenas
shot(65.90, 'Z', 'slow', L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const q = easeInOut(L.k); cam([PCX + lerp(46, 30, q), lerp(46, 30, q), lerp(80, 62, q)], [PCX, 6, 0], 48); sh(V(PCX, 0, 0), 80); }, [[0, 'crowd_cheer', .6], [.5, 'fanfare', .5]]);
// 56 «Oben auf dem Turm wartet der goldene Knopf.»: grúa que sube por la torre hasta el botón dorado, que brilla
shot(67.50, 'S', null, L => { use('PC'); stands(L.T, 'sway'); sbDraw(0); PC.BTNL.intensity = 40 + Math.sin(L.T * 6) * 15; const q = easeInOut(L.k); cam([PCX + 3, lerp(8, 28.5, q), lerp(-24, -31, q)], [PCX, lerp(14, 23.8, q), -38.8], 46); sh(V(PCX, 0, -38), 30); }, [[0, 'whoosh_up', .5], [1.2, 'shimmer', .6]]);
// 57 «Dahinter die Gläser mit der geklauten Kraft.»: los frascos detrás del cristal, con la fuerza robada latiendo dentro
shot(69.90, 'W', null, L => { use('PC'); sbDraw(0); PC.SHELF.userData.J.forEach((j, i) => j.userData.orb.scale.setScalar(1 + Math.sin(L.T * 5 + i) * .12)); orbit(V(PCX, 24.4, -44.4), lerp(13, 10, L.k), -.3 + L.k * .5, .4, 46); sh(V(PCX, 0, -40), 20); }, [[0, 'hum_magic', .6], [.6, 'heartbeat', .5]]);
// 58 «Seit 20 Jahren hat ihn niemand gedrückt.»: el marcador: KNOPF GEDRÜCKT 0 – SEIT 20 JAHREN
shot(72.39, 'C', 'punch', L => { use('PC'); stands(L.T, 'sway'); sbDraw(0); const p = wpos(PC.SB); orbit(p.add(V(0, -1.4, 0)), lerp(26, 22, L.k), -.5 + L.k * .2, .05, 44); sh(V(PCX + 18, 0, -36), 30); }, [[0, 'buzzer', .5], [.4, 'crowd_ooh', .4]]);
// 59 «Als ich zur Startlinie ging,»: camino hacia la plataforma de salida (de frente), pequeñito, con mi 7
shot(74.72, 'W', null, L => { use('PC'); stands(L.T, 'sway'); sbDraw(0); const c = ich; walkC(c, L.lt, PCX, 58, PI, 3, L.T); num(c, 7); cara(c, L.T, { expr: 'determined' }); orbit(V(PCX, 3.2, c.root.position.z), lerp(14, 12, L.k), PI - .3 + L.k * .3, .06, 46); sh(V(PCX, 0, 54), 30); }, [[0, 'steps', .5], [.6, 'crowd_murmur', .4]]);
// 60 «lachten alle.»: las gradas se ríen; dos de la primera fila me señalan doblados de risa
shot(76.16, 'C', 'punch', L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); [[K[0], -21, 30, PI / 2], [K[5], -21, 26, PI / 2 + .2], [XT[2], -21, 34, PI / 2 - .2]].forEach(([k, x, z, ry], i) => { put(k, PCX + x, 1.4, z, ry); num(k); actuar(k, L.lt, [[0, i === 1 ? 'point' : { lean: .4, aLx: 1.2, aRx: 1.2, aLe: 1.6, aRe: 1.6 }]], { T: L.T + i, extra: { lean: .2 + Math.sin(L.T * 14 + i) * .08 } }); laughF(k, L.T + i); });
  orbit(V(PCX - 21, 5.6, 30), lerp(15, 12, L.k), PI / 2 + .3 - L.k * .3, .06, 46); sh(V(PCX - 21, 0, 30), 30); }, [[0, 'laugh_crowd', .7]]);
// 61 «„Alter, mit 7 kommst du nicht mal»: un chulo (910) en la salida se burla de mí, señalando la pared
shot(76.89, 'Z', null, L => { use('PC'); stands(L.T, 'sway'); sbDraw(0); const k = put(K[0], PCX - 2.2, 1.2, 46, .6), c = put(ich, PCX + 2.2, 1.2, 46.4, -.7); num(k); num(c, 7); actuar(k, L.lt, [[0, 'point_l'], [.9, 'cross', { dur: .3 }]], { T: L.T }); talk(k, L.T, 76.89, 79.2, 'smug'); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  bubble(k, 'Mit 7?!', (L.lt - .6) * 4, 2.6); orbit(V(PCX, 5, 46.2), lerp(17, 15, L.k), .25 - L.k * .3, .06, 46); sh(V(PCX, 0, 46), 30); }, [[0, 'laugh_short', .5], [.6, 'pop', .4]]);
// 62 «über die erste Wand.“»: desde abajo: la pared roja, enorme; yo, diminuto delante, la miro
shot(78.59, 'S', null, L => { use('PC'); stands(L.T, 'sway'); sbDraw(0); const c = put(ich, PCX, 1.2, 41.4, PI + .25); num(c, 7); actuar(c, L.lt, [[0, { headX: -.4 }]], { T: L.T }); cara(c, L.T, { expr: 'gasp', eyes: 'up' });
  cm([PCX - 1, 1.8, 53, PCX - .5, 6.6, 26, 50], [PCX + 1.2, 1.6, 51, PCX - .5, 7.6, 25, 52], L.k); sh(V(PCX, 0, 34), 30); }, [[0, 'low_boom', .5], [.4, 'gulp', .4]]);
// ---------- c: la competición: Fahrerin, Dönermann, Jonas (robo), mi carrera, el botón, la verdad, Papa (79,7 – 120,6 s) ----------
const X0 = PCX;
const rope = (i, L, amp = .35, ph = 0) => { const r = PC.ROPES[i]; const a = Math.sin(L.T * 2.6 + ph) * amp; r.rotation.x = a; return a; };
const ropeHand = (i, a, y = 5) => V(X0, 15.6 - y * Math.cos(a), PC.ROPES[i].position.z - y * Math.sin(a));
const onRope = (ch, i, a, T) => { const h = ropeHand(i, a, 4.6); put(ch, h.x, h.y - 5.9 * sc_(ch), h.z + .1, PI); applyPose(ch, HANG(T)); ch.root.rotation.x = a * .8; };
const onBars = (ch, z, T) => { put(ch, X0, 11.4 - 5.9 * sc_(ch) - .1, z, PI); const sw = Math.sin(T * 7); applyPose(ch, { ...HANG(T), aLx: 2.95 + sw * .25, aRx: 2.95 - sw * .25, lLx: .5 + sw * .4, lRx: .5 - sw * .4 }); };
const step = k => PC.STEPS[k];
const onStep = (ch, k, T, pose = {}) => { const s = step(k); put(ch, X0 + s.x, s.h + .35, s.z, PI); applyPose(ch, pose); return s; };
const wallY = z => { const lz = z - 24; if (lz >= 4) return 0; if (lz <= 0) return 8.5; const a = Math.asin(clamp((4 - lz) / 4)); return 4 - Math.cos(a) * 4 + .3; };
// 63 «Dann ertönte der Pfiff.»: el árbitro sopla el silbato con el brazo arriba
shot(79.71, 'C', 'punch', L => { use('PC'); stands(L.T, 'sway'); sbDraw(0); const s = put(schiri, X0 + 9, 0, 36, .5); num(s); actuar(s, L.lt, [[0, { aRx: 2.9, aRz: .2, aRe: .2, aLx: 1.6, aLe: 2.4, aLz: -.4, headX: .1 }]], { T: L.T }); cara(s, L.T, { expr: 'determined', mouth: 'o' });
  orbit(hp(s).add(V(0, -.4, 0)), lerp(10, 8, L.k), .55 + L.k * .2, .05, 44); sh(V(X0 + 9, 0, 36), 20); }, [[0, 'whistle', .8]]);
// 64 «Zuerst die Straßenbahnfahrerin.»: ella (870) sale corriendo desde la salida
shot(81.15, 'W', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const f = fahrerin; runC(f, L.lt, X0, 44, PI, 6.5, L.T, { y: 1.2 }); num(f, 870); cara(f, L.T, { expr: 'determined' }); orbit(V(X0, 4.2, f.root.position.z), lerp(15, 13, L.k), PI - .4 + L.k * .2, .08, 46); sh(V(X0, 0, 40), 30); }, [[0, 'steps_run', .6], [.3, 'crowd_cheer', .5]]);
// 65 «Am Seil:»: se columpia de cuerda en cuerda sobre el agua
shot(82.82, 'C', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const a = rope(1, L, .45); onRope(fahrerin, 1, a, L.T); num(fahrerin, 870); cara(fahrerin, L.T, { expr: 'determined' }); orbit(V(X0, 9, 7.5), lerp(17, 15, L.k), -1.45 - L.k * .2, .06, 46); sh(V(X0, 0, 7), 30); }, [[0, 'rope_creak', .6], [.2, 'whoosh', .4]]);
// 66 «fast.»: se le escapa la cuerda y cae al agua: ¡splash!
shot(83.26, 'C', 'punch', L => { use('PC'); stands(L.T, 'cheer', true); sbDraw(0); const a = rope(1, L, .3); const f = fahrerin; const q = clamp(L.lt / .45); const h = ropeHand(1, a, 4.6); put(f, h.x + .5, lerp(h.y - 5.9 * .95, -.6, easeIn(q)), h.z - 1.2, PI); applyPose(f, { aLx: 2.6, aRx: 2.2, aLz: .7, aRz: .9, lLx: .4, lRx: -.3, lLk: .6 }); f.root.rotation.x = -.3 * q; num(f, 870); cara(f, L.T, { expr: 'scream' });
  splash(V(X0 + .5, .2, h.z - 1.2), 83.26 + .42, L.T, 1.2); orbit(V(X0, 5, 6.4), lerp(16, 14, L.k), -1.5, .12, 46); sh(V(X0, 0, 6), 30); }, [[0, 'scream_short', .4], [.42, 'splash_big', .8], [.6, 'crowd_ooh', .6]]);
// 67 «Dann der Dönermann.»: el del döner (920) sale como un toro
shot(84.12, 'W', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const d = doenm; runC(d, L.lt, X0, 44, PI, 7, L.T, { y: 1.2 }); num(d, 920); cara(d, L.T, { expr: 'angry' }); orbit(V(X0, 4.6, d.root.position.z), lerp(15, 13, L.k), PI + .4 - L.k * .2, .08, 46); sh(V(X0, 0, 40), 30); }, [[0, 'steps_run', .6], [.2, 'grunt', .4]]);
// 68 «An den Stangen:»: barra a barra por encima del agua
shot(85.08, 'C', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const z = lerp(-6, -12, L.k); onBars(doenm, z, L.T); num(doenm, 920); cara(doenm, L.T, { expr: 'determined' }); sweat(doenm, L.T, 2); orbit(V(X0, 8, z), lerp(15, 13, L.k), PI / 2 + .9, .02, 46); sh(V(X0, 0, -10), 30); }, [[0, 'metal_clank', .6], [.25, 'metal_clank', .5]]);
// 69 «fast.»: a la última barra se le resbala la mano: al agua
shot(85.62, 'C', 'punch', L => { use('PC'); stands(L.T, 'cheer', true); sbDraw(0); const d = doenm, q = clamp(L.lt / .4); put(d, X0, lerp(11.4 - 5.9 * 1.04, -.8, easeIn(q)), -14.5, PI); applyPose(d, { aLx: 2.8, aRx: 2.2, aLz: .5, aRz: .8, lLx: .5, lRx: -.2 }); num(d, 920); cara(d, L.T, { expr: 'scream' });
  splash(V(X0, .2, -14.5), 85.62 + .38, L.T, 1.3); orbit(V(X0, 6, -14.5), lerp(16, 14, L.k), PI / 2 - .15, .25, 46); sh(V(X0, 0, -14), 30); }, [[0, 'slip', .5], [.38, 'splash_big', .8], [.55, 'crowd_ooh', .6]]);
// 70 «Dann Jonas.»: Jonas (990) en la salida, chulo, se truena los dedos
shot(86.16, 'Z', 'punch', L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const j = put(jonas, X0, 1.2, 44.5, PI); num(j); actuar(j, L.lt, [[0, { aLx: 1.4, aRx: 1.4, aLz: -.6, aRz: -.6, aLe: 1.8, aRe: 1.8 }], [.6, FLEX, { dur: .3 }]], { T: L.T }); grin(j, L.T);
  orbit(hp(j).add(V(0, -.8, 0)), lerp(13, 10, L.k), PI + .25 - L.k * .4, .04, 44); sh(V(X0, 0, 44), 30); }, [[0, 'knuckles', .6], [.6, 'crowd_cheer', .6]]);
// 71 «Er kam weiter als alle.»: sube la pared de un tirón, pasa las cuerdas y las barras (montaje)
shot(87.38, 'W', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const j = jonas; num(j); const q = L.k;
  if (q < .45) { const z = lerp(32, 21.5, q / .45); runC(j, L.lt, X0, 32, PI, 8, L.T); j.root.position.z = z; j.root.position.y = wallY(z); cara(j, L.T, { expr: 'determined' }); cam([X0 + 3, 13, 18], [X0, 4, 28], 48); }
  else if (q < .75) { const a = rope(2, L, .5); onRope(j, 2, a, L.T); cara(j, L.T, { expr: 'grin' }); orbit(V(X0, 9, 4), 17, -.9, .06, 46); }
  else { const z = lerp(-8, -15, (q - .75) / .25); onBars(j, z, L.T); cara(j, L.T, { expr: 'grin' }); orbit(V(X0, 8, z), 15, PI / 2 + .9, .02, 46); } sh(V(X0, 0, 10), 50); }, [[0, 'steps_run', .5], [.5, 'rope_creak', .5], [1.0, 'metal_clank', .5], [.2, 'crowd_cheer', .6]]);
// 72 «Doch an der allerletzten Stufe»: salta de escalón en escalón hasta el último (amarillo)
shot(88.90, 'S', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const j = jonas; num(j); const f = L.lt / 1.2 * 4; const k = Math.min(3, Math.floor(f)), t = f - k; const a = step(k), b = step(Math.min(4, k + 1)); const p = arc(V(X0 + a.x, a.h + .35, a.z), V(X0 + b.x, b.h + .35, b.z), 1.6, clamp(t)); put(j, p.x, p.y, p.z, PI); applyPose(j, t < .9 ? { aLx: 2, aRx: 2, aLz: .5, aRz: .5, lLx: .8, lLk: 1, lRx: -.2 } : {}); cara(j, L.T, { expr: 'determined' });
  if (f >= 4) { onStep(j, 4, L.T, { aLx: 1, aRx: 1 }); } orbit(V(X0, 12.5, -28.5), lerp(23, 20, L.k), PI / 2 - .35, .1, 46); sh(V(X0, 0, -28), 30); }, [[0, 'jump', .5], [.3, 'land', .4], [.6, 'land', .4], [.9, 'land', .4], [1.2, 'heartbeat', .5]]);
// 73 «griff der Beinahe-Mann zu.»: el hombre gris surge junto al último escalón y le arranca la fuerza; 990 → 0
shot(90.28, 'C', 'punch', L => { use('PC'); stands(L.T, 'sway', true); sbDraw(0); const j = jonas; onStep(j, 4, L.T, { aLx: .8, aRx: .8, lean: .1 }); numDrop(j, (L.lt - .4) * 2); cara(j, L.T, { expr: L.lt > .5 ? 'shock' : 'determined' }); const s4 = step(4);
  const s3 = step(3); const b = put(bm, X0 + s3.x + .6, s3.h + .35 - 2.6 * (1 - clamp(L.lt * 3)), s3.z + .4, -2.25); actuar(b, L.lt, [[0, 'reach'], [.7, { aRx: 1.0, aRe: 1.6, lean: -.1 }, { dur: .3 }]], { T: L.T }); cara(b, L.T, { expr: 'grin', mouth: 'grin' }); steal(j, (L.lt - .3) / .7);
  orbit(V(X0, 15, s4.z + 1.4), lerp(22, 19, L.k), -PI / 2 + .3, .06, 46); DARK = .15; sh(V(X0, 0, -32), 30); }, [[0, 'whoosh_dark', .6], [.3, 'magic_suck', .7], [.8, 'power_down', .6]]);
// 74 «Und Jonas fiel.»: cae de espaldas al colchón azul, a cámara lenta
shot(91.75, 'S', null, L => { use('PC'); stands(L.T, 'sway', true); sbDraw(0); const j = jonas; const s4 = step(4); const q = clamp(L.lt / .8); put(j, X0 + s4.x + q * 1.5, lerp(s4.h + .35, .4, easeIn(q)), s4.z + q * 2, PI); j.root.rotation.x = -q * 1.4; applyPose(j, { aLx: 2.4, aRx: 2.2, aLz: .9, aRz: .9, lLx: .8, lRx: .4 }); num(j, 0, 1, 'red'); cara(j, L.T, { expr: 'scream' });
  if (L.lt > .8) dust(V(X0 + s4.x + 1.5, .2, s4.z + 2), 91.75 + .8, L.T, 10, .6); orbit(V(X0 + s4.x + 1, 7, s4.z + 1.5), lerp(22, 19, L.k), -PI / 2 + .35, .1, 46); sh(V(X0, 0, -30), 30); }, [[0, 'whoosh_slow', .5], [.8, 'thud', .8], [.9, 'crowd_ooh', .6]]);
// 75–76 «AH! ALMOST ×3»: solo Jonas, sentado en el colchón, decepcionado, diciéndolo
shot(92.90, 'C', 'punch', L => { use('PC'); stands(L.T, 'sway', true); sbDraw(0); const s4 = step(4); const j = put(jonas, X0 + s4.x + 1.5, .3, s4.z + 3, .5); actuar(j, L.lt, [[0, { ...SIT, ...GEST.hands_head, crouch: 1.3 }], [1.1, { ...SIT, crouch: 1.3, aLx: .6, aRx: .6, aLe: 1.2, aRe: 1.2, headX: .15 }, { dur: .5 }]], { T: L.T, extra: { headY: Math.sin(L.T * 7) * .15 } }); num(j, 0, 1, 'red'); talk(j, L.T, 92.90, 94.97, 'sad');
  orbit(hp(j).add(V(0, -.3, 0)), lerp(12, 8.5, L.k), .5 + .3 - L.k * .15, .1, 44); sh(V(X0, 0, -28), 20); }, [[0, 'groan', .5], [1.2, 'sigh', .4]]);
// 77 «Dann war ich dran.»: yo en la salida, con mi 7; aprieto los puños (zoom lento)
shot(94.97, 'Z', 'slow', L => { use('PC'); stands(L.T, 'sway'); sbDraw(0); const c = put(ich, X0, 1.2, 44.5, PI); num(c, 7); actuar(c, L.lt, [[0, 'idle'], [.4, 'fists', { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  orbit(hp(c).add(V(0, -.6, 0)), lerp(15, 9.5, easeIn(L.k)), PI, .03, 44); sh(V(X0, 0, 44), 20); }, [[0, 'heartbeat', .6], [.5, 'crowd_murmur', .4]]);
// 78–83 «HUSS!» ×6: salgo disparado (cortes rápidos)
const H3 = [96.08, 96.38, 96.70, 96.99, 97.30, 97.61];
H3.forEach((t0, i) => shot(t0, 'C', 'punch', L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const c = ich; const z0 = 43 - i * 2.2; runC(c, L.lt, X0 + (i % 2 ? .8 : -.8), z0, PI, 11, L.T, { y: 1.2 }); num(c, 7); cara(c, L.T, { expr: 'shout' }); huss(L, i);
  const ya = [PI - .5, PI + .6, PI / 2 + .3, -PI / 2 - .3, PI - .2, PI + .9][i]; orbit(V(c.root.position.x, 3.6, c.root.position.z), [10, 9, 12, 11, 8.5, 10][i], ya, [.05, .1, .2, .05, .02, .15][i], 46); sh(V(X0, 0, 38), 30); }, [[0, i % 2 ? 'steps_run' : 'whoosh', .6]]));
// 84 «Die Wand:»: corro rampa arriba
shot(97.97, 'W', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const c = ich; const z = lerp(31, 24.6, easeOut(L.k)); runC(c, L.lt, X0, 31, PI, 9, L.T); c.root.position.z = z; c.root.position.y = wallY(z); num(c, 7); cara(c, L.T, { expr: 'determined' });
  cm([X0 + 15, 6, 31, X0, 4.5, 26.5, 48], [X0 + 14, 7, 28, X0, 5.5, 25.5, 46], L.k); sh(V(X0, 0, 26), 30); }, [[0, 'steps_run', .6], [.4, 'rubber', .5]]);
// 85 «Meine Finger rutschten ab.»: colgado del borde de la pared; los dedos resbalan, sudor
shot(98.61, 'C', 'punch', L => { use('PC'); stands(L.T, 'sway', true); sbDraw(0); const c = ich; const slip = Math.sin(L.T * 10) > .4 ? .25 : 0; put(c, X0, 8.5 - 5.9 * .82 - .2 - slip, 24.4, PI); applyPose(c, { ...HANG(L.T), lean: -.15 }); num(c, 7); cara(c, L.T, { expr: 'scared' }); sweat(c, L.T, 3);
  cm([X0 + 9.5, 8, 28.5, X0, 6.4, 24.4, 46], [X0 + 8.5, 7.6, 27.6, X0, 6.4, 24.4, 44], L.k); sh(V(X0, 0, 24), 20); }, [[0, 'slip', .6], [.5, 'scrape', .5], [.9, 'crowd_ooh', .5]]);
// 86 «Das Seil brannte in meinen Händen.»: en la cuerda, me sale humo de las manos; aprieto los dientes
shot(99.80, 'S', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(0); const a = rope(0, L, .5, 1); onRope(ich, 0, a, L.T); num(ich, 7); cara(ich, L.T, { expr: 'angry', mouth: 'grimace_wide' }); const hh = wpos(ich.aR.hand); smoke(hh.add(V(0, .4, 0)), L.T, .3);
  orbit(V(X0, 10, 11 - Math.sin(a) * 4), lerp(13, 11, L.k), -2.3 + L.k * .3, .04, 44); sh(V(X0, 0, 10), 30); }, [[0, 'rope_creak', .6], [.3, 'sizzle', .6], [.8, 'grunt', .5]]);
// 87 «Und dann die letzte Stufe.»: salto al último escalón amarillo; plano bajo
shot(101.60, 'Z', null, L => { use('PC'); stands(L.T, 'sway', true); sbDraw(0); const c = ich; const a = step(3), b = step(4); const q = clamp(L.lt / .7); const p = arc(V(X0 + a.x, a.h + .35, a.z), V(X0 + b.x, b.h + .35, b.z), 1.8, q); put(c, p.x, p.y, p.z, PI); applyPose(c, q < 1 ? { aLx: 2.2, aRx: 2.2, aLz: .5, aRz: .5, lLx: .8, lLk: 1 } : { aLx: .9, aRx: .9, aLz: .4, aRz: .4, crouch: .2 }); num(c, 7); cara(c, L.T, { expr: 'determined' });
  cm([X0 + 13, 7, -24, X0 + b.x, b.h + 2.5, b.z, 48], [X0 + 12, 8, -27, X0 + b.x, b.h + 3, b.z, 46], L.k); sh(V(X0, 0, -30), 30); }, [[0, 'jump', .6], [.7, 'land', .6], [1.0, 'heartbeat', .6]]);
// 88 «Genau da, wo alle fallen.»: la grada contiene el aliento: Jonas (0), la Fahrerin y el Dönermann, preocupados
shot(103.30, 'W', null, L => { use('PC'); stands(L.T, 'still', true); sbDraw(0); [[jonas, 21.5, -24, -PI / 2], [fahrerin, 21.5, -20.5, -PI / 2 + .2], [doenm, 21.5, -27.5, -PI / 2 - .2]].forEach(([k, x, z, ry], i) => { put(k, X0 + x, 1.4, z, ry); if (k === jonas) num(k, 0, 1, 'red'); else num(k); actuar(k, L.lt, [[0, i ? 'hands_face' : 'cower']], { T: L.T + i }); cara(k, L.T + i, { expr: 'worried' }); });
  orbit(V(X0 + 21.5, 5.8, -24), lerp(18, 15, L.k), -PI / 2 + .5 - L.k * .4, .06, 46); sh(V(X0 + 21, 0, -24), 20); }, [[0, 'heartbeat', .7], [.5, 'crowd_murmur', .3]]);
// 89 «Der Beinahe-Mann griff nach mir …» (zoom lento): la mano gris se acerca a mi 7
shot(105.10, 'F', 'slow', L => { use('PC'); stands(L.T, 'still', true); sbDraw(0); DARK = .18; const c = ich; const s4 = onStep(c, 4, L.T, { aLx: .9, aRx: .9, aLz: .4, aRz: .4, crouch: .2 }); num(c, 7); cara(c, L.T, { expr: 'scared' }); const s3 = step(3); const b = put(bm, X0 + s3.x + .6, s3.h + .35 - 2.6 * (1 - clamp(L.lt * 1.5)), s3.z + .4, -2.25); actuar(b, L.lt, [[0, { aRx: lerp(.6, 1.9, easeInOut(L.k)), aRe: .2, lean: lerp(0, .25, L.k) }]], { T: L.T }); cara(b, L.T, { expr: 'grin', mouth: 'grin' });
  orbit(V(X0, s4.h + 4, s4.z + 1.4), lerp(22, 14, easeIn(L.k)), -PI / 2 + .3, .06, 46); sh(V(X0, 0, -32), 30); }, [[0, 'whoosh_dark', .6], [.4, 'creepy_laugh', .4]]);
// 90 «und ließ los.»: la retira con asco; yo salto hacia la torre
shot(106.42, 'C', 'punch', L => { use('PC'); stands(L.T, 'still', true); sbDraw(0); const c = ich, s4 = step(4); const q = clamp((L.lt - .4) / .6); const p = arc(V(X0 + s4.x, s4.h + .35, s4.z), V(X0, 12, -35.2), 2, q); put(c, p.x, p.y, p.z, PI); applyPose(c, q > 0 ? { aLx: 2.6, aRx: 2.6, lLx: .9, lLk: 1.2 } : { aLx: .9, aRx: .9, crouch: .3 }); num(c, 7); cara(c, L.T, { expr: 'determined' });
  const s3 = step(3); const b = put(bm, X0 + s3.x + .6, s3.h + .35, s3.z + .4, -2.25); actuar(b, L.lt, [[0, { aRx: 1.9, aRe: .2, lean: .25 }], [.15, { aRx: .8, aRz: -.5, aRe: 1.2, lean: -.1, headY: .4 }, { dur: .3 }]], { T: L.T }); cara(b, L.T, { expr: 'bored', mouth: 'frown' });
  orbit(V(X0, s4.h + 4, s4.z), lerp(19, 22, L.k), -PI / 2 + .35 - L.k * .2, .08, 46); sh(V(X0, 0, -32), 30); }, [[0, 'pfft', .6], [.4, 'jump', .6]]);
// 91 «Und dann:»: trepo los últimos agarres de la torre
shot(107.58, 'S', null, L => { use('PC'); stands(L.T, 'still', true); sbDraw(0); const c = ich; const y = lerp(13.5, 20.6 - 5.4, easeOut(L.k)); put(c, X0, y, -35.3, PI); const cl = Math.sin(L.T * 12); applyPose(c, { aLx: 2.6 + cl * .3, aRx: 2.6 - cl * .3, lLx: .8 + cl * .4, lRx: .8 - cl * .4, lLk: 1, lRk: 1 }); num(c, 7); cara(c, L.T, { expr: 'determined' });
  cm([X0 + 11, y + 3, -29, X0, y + 2.5, -35.3, 48], [X0 + 10, y + 3.5, -30, X0, y + 3, -35.3, 46], L.k); sh(V(X0, 0, -36), 30); }, [[0, 'climb', .6]]);
// 92 «der Knopf.»: ¡golpe! la mano sobre el botón dorado; destello
shot(107.96, 'C', 'punch', L => { use('PC'); stands(L.T, 'still', true); sbDraw(0); const c = put(ich, X0, 20.8, -36.6, PI); const hit = clamp(L.lt / .15); actuar(c, L.lt, [[0, { aRx: 2.6, aRe: .2 }], [.05, { aRx: 1.3, aRe: .1, lean: .25 }, { dur: .1 }]], { T: L.T }); num(c, 7); cara(c, L.T, { expr: 'shout' }); PC.BTN.position.y = 2.9 - .35 * hit; PC.BTNL.intensity = 10 + hit * 15;
  if (L.lt < .12) grade.uniforms.flash.value = 0; else grade.uniforms.flash.value = Math.max(0, .55 - (L.lt - .12) * 2.5); orbit(V(X0, 23.4, -37.6), lerp(9, 7.5, L.k), PI - .7, .25, 44); sh(V(X0, 20, -38), 20); }, [[.1, 'button_slam', 1], [.12, 'impact', .8]]);
// 93 «Die Gläser zersprangen.»: estallan los frascos; las bolas de luz salen volando por el cielo
shot(108.99, 'F', null, L => { use('PC'); stands(L.T, 'cheer', true); sbDraw(1, 'GEDRÜCKT!', true); PC.SHELF.userData.J.forEach(j => j.visible = false); PC.vit.visible = false; PC.BTNL.intensity = 120; const c = put(ich, X0, 20.8, -36.6, 0); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); num(c, 7); cara(c, L.T, { expr: 'joy' });
  SHARDS.forEach((s, i) => { const r = RNG(i * 3 + 2), t = L.lt; s.visible = true; s.position.set(X0 - 5 + r() * 10 + (r() - .5) * t * 14, 23 + r() * 6 + t * 6 - t * t * 8, -44 + (r() - .5) * 3 + t * 6 * r()); s.rotation.set(t * 8 + i, t * 6, 0); });
  ORBS.forEach((o, i) => { const r = RNG(i * 7 + 5), t = L.lt; show(o, X0 - 6 + i * 1.3 + (r() - .5) * t * 30, 24 + t * 14 * (.6 + r() * .6), -44 + t * 18 * (r() - .2), 0, 1); });
  cm([X0 + 9, 29, -18, X0, 25, -42, 50], [X0 + 11, 31, -12, X0, 28, -44, 52], L.k); sh(V(X0, 0, -38), 30); }, [[0, 'glass_shatter', 1], [.3, 'magic_release', .7]]);
// 94 «Und die ganze Stadt wurde still.»: las gradas en silencio; el marcador: 1
shot(110.08, 'W', null, L => { use('PC'); stands(L.T, 'still', true); sbDraw(1, 'NACH 20 JAHREN', false); const p = wpos(PC.SB); cm([X0 - 10, 12, 0, X0 + 12, 18, -30, 48], [X0 - 12, 13, -4, X0 + 14, 20, -34, 46], L.k); sh(V(X0, 0, -10), 50); }, [[0, 'silence_wind', .6], [.6, 'heartbeat', .4]]);
// 95 «Jonas kam zu mir und fragte:»: junto a la pista, Jonas (con su 990 de vuelta) se acerca a mí
const ME = [X0 + 13, -20], JO = [X0 + 17, -20];
shot(111.92, 'S', null, L => { use('PC'); stands(L.T, 'still', true); sbDraw(1, 'NACH 20 JAHREN'); const c = put(ich, ME[0], 0, ME[1], PI / 2); num(c, 7); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'happy' }); const j = jonas; walkC(j, L.lt, X0 + 20.5, -17.9, -2.11, 2.6, L.T, { stopAt: 1.2 }); num(j, 990); cara(j, L.T, { expr: 'gasp' });
  orbit(V(X0 + 15.6, 4, -19.4), lerp(19, 16, L.k), .2 + L.k * .15, .08, 46); sh(V(X0 + 15, 0, -20), 30); }, [[0, 'steps', .5]]);
// 96 «„Wie hast du das geschafft?“»: primer plano de Jonas preguntando
shot(113.63, 'C', null, L => { use('PC'); stands(L.T, 'still', true); sbDraw(1, 'NACH 20 JAHREN'); const j = put(jonas, JO[0], 0, JO[1], -PI / 2); num(j, 990); actuar(j, L.lt, [[0, 'shrug']], { T: L.T }); talk(j, L.T, 113.56, 114.86, 'confused');
  orbit(hp(j).add(V(0, -.2, 0)), lerp(10, 8.5, L.k), -PI / 2 + .4, .04, 42); sh(V(JO[0], 0, JO[1]), 20); }, [[0, 'hmm', .3]]);
// 97 «Ich sagte ihm die Wahrheit:»: yo le miro y sonrío
shot(114.82, 'W', null, L => { use('PC'); stands(L.T, 'still', true); sbDraw(1, 'NACH 20 JAHREN'); const c = put(ich, ME[0], 0, ME[1], PI / 2); num(c, 7); actuar(c, L.lt, [[0, { aRx: .6, aRe: .8 }]], { T: L.T }); talk(c, L.T, 114.76, 115.86, 'smile');
  orbit(hp(c).add(V(0, -.4, 0)), lerp(11, 9, L.k), PI / 2 - .5 + L.k * .3, .05, 42); sh(V(ME[0], 0, ME[1]), 20); }, [[0, 'breath', .3]]);
// 98 «„Ich hab einfach nicht bei fast aufgehört.“» (zoom lento): mi cara, la frase
shot(115.90, 'Z', 'slow', L => { use('PC'); stands(L.T, 'still', true); sbDraw(1, 'NACH 20 JAHREN'); const c = put(ich, ME[0], 0, ME[1], PI / 2); num(c, 7); actuar(c, L.lt, [[0, { aRx: .8, aRe: 1.2, aRz: -.2 }]], { T: L.T }); talk(c, L.T, 115.86, 117.86, 'determined');
  orbit(hp(c).add(V(0, -.2, 0)), lerp(11, 7, easeIn(L.k)), PI / 2 - .1, .03, 42); sh(V(ME[0], 0, ME[1]), 20); }, [[0, 'heartbeat', .4]]);
// 99 «Papa rannte zu mir»: Papa cruza el campo corriendo con los brazos abiertos
shot(117.88, 'W', null, L => { use('PC'); stands(L.T, 'cheer'); sbDraw(1, 'NACH 20 JAHREN'); const p = papa; runC(p, L.lt, X0 + 21, -30, -.69, 6.5, L.T, { extra: { aLx: 1.4, aRx: 1.4, aLz: .8, aRz: .8 } }); num(p); cara(p, L.T, { expr: 'joy' });
  orbit(V(p.root.position.x, 4.5, p.root.position.z), lerp(16, 14, L.k), -.69 + .45, .06, 46); sh(V(X0 + 17, 0, -25), 30); }, [[0, 'steps_run', .5], [.4, 'crowd_cheer', .5]]);
// 100 «und umarmte mich.»: el abrazo; Papa me levanta del suelo
shot(119.08, 'C', 'punch', L => { use('PC'); stands(L.T, 'cheer'); sbDraw(1, 'NACH 20 JAHREN'); const p = put(papa, ME[0] + 1.8, 0, ME[1], -PI / 2), c = put(ich, ME[0], .6 + Math.sin(clamp(L.lt * 2) * PI / 2) * .8, ME[1], PI / 2); num(p); actuar(p, L.lt, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.5, aRz: -.5, aLe: 1.2, aRe: 1.2, lean: .15 }]], { T: L.T }); cara(p, L.T, { expr: 'joy', eyes: 'closed' }); applyPose(c, { aLx: 1.6, aRx: 1.6, aLz: -.3, aRz: -.3, aLe: 1.2, aRe: 1.2 }); cara(c, L.T, { expr: 'joy', eyes: 'closed' });
  hearts(hp(p).add(V(0, 1, 0)), L.T); orbit(V(ME[0] + 1.2, 5.2, ME[1]), lerp(13, 11, L.k), -PI / 2 + 1.05 - L.k * .2, .06, 44); sh(V(ME[0], 0, ME[1]), 20); }, [[0, 'hug', .6], [.3, 'aww', .4]]);
// 101 «Er weinte.»: primer plano de Papa llorando de alegría
shot(119.95, 'Z', null, L => { use('PC'); stands(L.T, 'still'); sbDraw(1, 'NACH 20 JAHREN'); const p = put(papa, ME[0] + 1.8, 0, ME[1], -PI / 2); num(p); actuar(p, L.lt, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.5, aRz: -.5, aLe: 1.2, aRe: 1.2, lean: .1 }]], { T: L.T, extra: shiver(L.T, .5) }); cara(p, L.T, { expr: 'cry', mouth: 'smile' }); tears(p, L.T);
  orbit(hp(p).add(V(0, -.2, 0)), lerp(8.5, 7, L.k), -PI / 2 + .25, .05, 42); sh(V(ME[0], 0, ME[1]), 20); }, [[0, 'sniff', .5], [.3, 'soft_piano', .4]]);
// ---------- d: el pueblo entrena, todos terminan, mi 1000, Papa y la barbacoa (120,6 – 149,2 s) ----------
// 102 «Am nächsten Morgen trainierte die ganze Stadt am Parcours.»: amanecer; vecinos en todos los obstáculos
shot(120.65, 'F', null, L => { use('PC'); sunset(); stands(L.T, 'cheer', false, true); sbDraw(1, 'NACH 20 JAHREN'); const a = rope(1, L, .4); onRope(K[2], 1, a, L.T); num(K[2]); cara(K[2], L.T, { expr: 'determined' }); onBars(XT[3], -9, L.T); num(XT[3]); cara(XT[3], L.T, { expr: 'determined' });
  runC(K[4], L.lt, X0 - 1.5, 38, PI, 6, L.T, { y: 1.2 }); num(K[4]); cara(K[4], L.T, { expr: 'happy' }); runC(K[7], L.lt + .4, X0 + 1.5, 42, PI, 5, L.T, { y: 1.2 }); num(K[7]); cara(K[7], L.T, { expr: 'joy' }); onStep(XT[4], 2, L.T, { aLx: 1.2, aRx: 1.2 }); num(XT[4]); cara(XT[4], L.T, { expr: 'happy' });
  const q = easeInOut(L.k); cam([PCX + lerp(36, 28, q), lerp(30, 24, q), lerp(60, 50, q)], [PCX, 6, 4], 48); sh(V(PCX, 0, 0), 70); }, [[0, 'birds', .5], [.3, 'crowd_cheer', .5], [1.2, 'rope_creak', .4], [1.8, 'metal_clank', .4]]);
// 103–108 «HUSS!» ×6: todos entrenan: Oma en la cuerda, el del döner en las barras, la Fahrerin en la pared, el profe, el alcalde, Papa
const H4 = [123.93, 124.18, 124.48, 124.77, 125.09, 125.40];
const mornPC = L => { use('PC'); sunset(); stands(L.T, 'cheer'); sbDraw(1, 'NACH 20 JAHREN'); };
shot(H4[0], 'C', 'punch', L => { mornPC(L); const a = rope(1, L, .4); onRope(oma, 1, a, L.T); num(oma); cara(oma, L.T, { expr: 'shout' }); huss(L, 0); orbit(V(X0, 9.5, 7.5), 15, -1.5, .06, 46); sh(V(X0, 0, 7), 20); }, [[0, 'rope_creak', .6]]);
shot(H4[1], 'C', 'punch', L => { mornPC(L); onBars(doenm, -10, L.T); num(doenm); cara(doenm, L.T, { expr: 'shout' }); huss(L, 1); orbit(hp(doenm).add(V(0, -1.4, 0)), 11, PI / 2 + .5, -.25, 44); sh(V(X0, 0, -10), 20); }, [[0, 'metal_clank', .6]]);
shot(H4[2], 'C', 'punch', L => { mornPC(L); const f = fahrerin; const z = lerp(29, 25.5, L.k); runC(f, L.lt, X0, 29, PI, 9, L.T); f.root.position.z = z; f.root.position.y = wallY(z); num(f); cara(f, L.T, { expr: 'shout' }); huss(L, 2); cam([X0 + 14, 6.5, 30], [X0, 4 + wallY(z) * .5, z], 46); sh(V(X0, 0, 26), 20); }, [[0, 'steps_run', .6]]);
shot(H4[3], 'C', 'punch', L => { mornPC(L); const s = onStep(lehrer, 1, L.T, { aLx: 2.2, aRx: 2.2, aLz: .5, aRz: .5, lLx: .6, lLk: .8 }); lehrer.root.position.y += Math.sin(clamp(L.lt * 3) * PI) * 1.4; num(lehrer); cara(lehrer, L.T, { expr: 'shout' }); huss(L, 3); orbit(V(X0 + s.x, s.h + 5, s.z), 16, -PI / 2 + .35, .1, 46); sh(V(X0, 0, -25), 20); }, [[0, 'jump', .6]]);
shot(H4[4], 'C', 'punch', L => { mornPC(L); const m = put(XT[3], X0 + 8, 1.1, 34, -PI / 2); m.root.rotation.x = PI / 2 - .38; m.root.position.y = .6; const dn = (Math.sin(L.T * 14) + 1) / 2; applyPose(m, { aLx: 1.57, aRx: 1.57, aLe: dn * 1.2, aRe: dn * 1.2, headX: -.6 }); num(m); cara(m, L.T, { expr: 'shout' }); huss(L, 4); orbit(V(X0 + 6.5, 1.8, 34), 12, PI - .2, .25, 46); sh(V(X0 + 7, 0, 34), 20); }, [[0, 'grunt', .6]]);
shot(H4[5], 'C', 'punch', L => { mornPC(L); const p = papa; runC(p, L.lt, X0 - 2, 36, PI, 7, L.T, { y: 1.2 }); num(p); cara(p, L.T, { expr: 'shout' }); huss(L, 5); orbit(V(X0 - 2, 4.6, p.root.position.z), 10, PI + .5, .05, 46); sh(V(X0, 0, 34), 20); }, [[0, 'steps_run', .6]]);
// 109 «Die Straßenbahn hält jetzt pünktlich.»: el tranvía para justo en el cartel H; los que esperan aplauden
shot(125.75, 'W', null, L => { town('morning'); const z = lerp(26, 12, easeOut(clamp(L.k * 1.5))); tramAt(z + 13); const f = put(fahrerin, 26, 2.2, z + 1.5, PI); num(f); actuar(f, L.lt, [[0, 'hold'], [.9, 'wave', { dur: .3 }]], { T: L.T }); grin(f, L.T);
  [[XT[0], 34, 10, -2.1], [XT[2], 35.4, 6.4, -2.0], [K[4], 33.6, 3, -2.3]].forEach(([k, x, zz, ry], i) => { put(k, x, 0, zz, ry); num(k); actuar(k, L.lt, [[0, 'idle'], [.7 + i * .1, 'cheer', { dur: .3 }]], { T: L.T + i }); grin(k, L.T + i); });
  badge('green', 'PÜNKTLICH ✓', W / 2, H * .2, (L.lt - .9) * 4, 1, .8); cm([12, 7, 2, 31, 4, 12, 48], [13, 6.5, 5, 31, 4, 12, 46], L.k); sh(V(30, 0, 10), 40); }, [[0, 'tram_hum', .5], [.8, 'brakes', .5], [1.0, 'tram_bell', .6], [1.2, 'applause', .5]]);
// 110 «Der Döner kommt noch warm an.»: el del döner, en mi puerta, entrega el döner humeante a Papa
shot(127.63, 'C', null, L => { town('morning'); const d = put(doenm, 16.4, 0, 91.3, -PI / 2), p = put(papa, 12.8, 0, 91.6, PI / 2); num(d); num(p); actuar(d, L.lt, [[0, { aRx: 1.4, aRe: .3 }]], { T: L.T }); grin(d, L.T); actuar(p, L.lt, [[0, { aLx: 1.3, aLe: .4 }]], { T: L.T }); cara(p, L.T, { expr: 'joy' });
  const hh = wpos(d.aR.hand); show(DOENW, hh.x - .6, hh.y - .4, hh.z, 0); steam(V(hh.x - .6, hh.y + .6, hh.z), L.T); orbit(V(14.6, 4.8, 91.4), lerp(15, 12, L.k), .3 - L.k * .2, .05, 44); sh(V(14, 0, 91), 20); }, [[0, 'door_open', .5], [.3, 'sizzle', .4], [.8, 'yum', .5]]);
// 111 «Jonas hat beim 38. Versuch bestanden.»: Jonas levanta su carné: Versuch 38 ✓; confeti
shot(129.22, 'Z', 'punch', L => { town('morning'); show(AUTO, -20, 0, 30, .5); const j = put(jonas, -15.4, 0, 33.6, .4); num(j); actuar(j, L.lt, [[0, { aRx: 2.8, aRz: .2, aRe: .3, aLx: 2.6, aLz: .5, aLe: .5 }]], { T: L.T, extra: { hipY: 2.05 + Math.abs(Math.sin(L.T * 6)) * .3 } }); cara(j, L.T, { expr: 'joy' });
  const hh = wpos(j.aR.hand); show(LIC, hh.x, hh.y + 1.2, hh.z, faceTo(hh, camera.position)); confetti(V(-15.4, 2, 33.6), 129.22 + .1, L.T, 50); folk(-16, 30, 16, 12, 30, L.T, 61, { mode: 'cheer' });
  orbit(hp(j).add(V(0, .4, 0)), lerp(15, 12, L.k), .4 - L.k * .3, .06, 44); sh(V(-16, 0, 33), 30); }, [[0, 'cheer', .6], [.2, 'confetti_pop', .6], [1.2, 'car_horn', .4]]);
// 112 «Und Oma hat nach 25 Jahren das letzte Wort gefunden.»: la Oma escribe la última letra y levanta los brazos
shot(132.03, 'R', null, L => { use('OS'); inside(1, 40); const o = put(oma, OSX - 6, 2.75, -3, .5); num(o); const done = L.lt > 1.4; actuar(o, L.lt, [[0, { ...SIT, aLx: 1.1, aRx: 1.3, aLe: 1.0, aRe: 1.2 + Math.sin(L.T * 16) * .2, headX: .3 }], [1.45, { ...SIT, aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, headX: -.2 }, { dur: .3 }]], { T: L.T }); cara(o, L.T, { expr: done ? 'joy' : 'determined', eyes: done ? 'happy' : 'down' });
  const kw = done ? KW2 : KW; show(kw, OSX - 6 + Math.sin(.5) * 2.2, 4.4, -3 + Math.cos(.5) * 2.2, .5, .7); kw.rotation.x = -.7; if (done) confetti(hp(o), 132.03 + 1.45, L.T, 40, .6); badge('gold', '25 JAHRE', W / 2, H * .17, (L.lt - .2) * 4, 1, .8);
  orbit(hp(o).add(V(0, -.6, 0)), lerp(14, 11, L.k), .5 + .3 - L.k * .3, .32, 46); sh(V(OSX - 6, 0, -3), 20); }, [[0, 'pencil', .6], [1.45, 'ding', .7], [1.6, 'cheer_old', .5]]);
// 113 «Und meine Zahl?»: yo en la plaza miro hacia arriba, a mi 7
shot(135.65, 'W', null, L => { town(); folk(-6, -6, 50, 8, 36, L.T, 63); const c = put(ich, -6, 0, -6, .1); num(c, 7); actuar(c, L.lt, [[0, { headX: -.45, aRx: .5, aRe: .8 }]], { T: L.T }); cara(c, L.T, { expr: 'gasp', eyes: 'up' });
  orbit(headC(c).add(V(0, .8, 0)), lerp(12, 10, L.k), .1 + L.k * .25, -.1, 44); sh(V(-6, 0, -6), 30); }, [[0, 'whoosh_up', .4]]);
// 114 «Die steht jetzt auf 1000.»: el número rueda de 7 a 1000 dorado; confeti
shot(136.49, 'C', 'punch', L => { town(); folk(-6, -6, 50, 8, 36, L.T, 63, { mode: 'cheer' }); const c = put(ich, -6, 0, -6, .1); const q = clamp((L.lt - .2) / .6); const v = q < 1 ? Math.max(7, Math.round(easeIn(q) * 1000)) : 1000; num(c, v, 1 + (q >= 1 ? Math.max(0, .3 - (L.lt - .8)) : 0), v >= 1000 ? 'gold' : v < 100 ? 'red' : 'zero'); actuar(c, L.lt, [[0, { headX: -.3 }], [.8, 'cheer', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: q >= 1 ? 'joy' : 'gasp' });
  if (q >= 1) confetti(headC(c), 136.49 + .8, L.T, 60); const p = wpos(NUM.get(c)); orbit(p.add(V(0, -2.4, 0)), lerp(12, 10, L.k), .05, .08, 44); sh(V(-6, 0, -6), 20); }, [[0, 'counter_roll', .6], [.8, 'impact', .7], [.85, 'fanfare', .6]]);
// 115 «Jetzt macht jeder in dieser Stadt alles fertig.»: el corredor rompe por fin la cinta de ZIEL; la plaza celebra
shot(138.36, 'F', null, L => { town(); ZIELB.visible = true; folk(-6, -24, 70, 9, 42, L.T, 3, { face: V(-6, 0, -26), mode: 'cheer' }); const r = K[3]; runC(r, L.lt, -6, -22, PI, 6, L.T); num(r, 950); cara(r, L.T, { expr: 'joy' }); const br = r.root.position.z < -30; ZIELB.userData.tape.visible = !br; if (br) confetti(V(-6, 2, -30), 138.36 + 1.33, L.T, 60);
  const c = put(ich, -1, 0, -34, PI + .4); num(c, 1000, 1, 'gold'); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); cara(c, L.T, { expr: 'joy' }); orbit(V(-4, 5, -31), lerp(18, 14, L.k), PI + .1, .08, 46); sh(V(-5, 0, -30), 40); }, [[0, 'crowd_cheer', .7], [1.3, 'tape_snap', .7], [1.4, 'confetti_pop', .5]]);
// 116 «Außer meinem Papa.»: en el jardín, Papa con las pinzas junto a la parrilla, sonriendo a cámara
shot(140.90, 'W', null, L => { town(); show(GRILL, 22, 0, 98.5, 0); const p = put(papa, 18.4, 0, 100, .9); num(p); actuar(p, L.lt, [[0, { aRx: 1.3, aRe: .8, aLx: .3 }], [.4, 'wave', { dur: .3 }]], { T: L.T }); grin(p, L.T); GRILL.userData.setBurn(.1); smoke(V(22, 4.6, 98.5), L.T, .4);
  orbit(V(20, 4.6, 99.5), lerp(15, 12, L.k), .55 + L.k * .2, .08, 46); sh(V(20, 0, 100), 20); }, [[0, 'sizzle', .6], [.4, 'birds', .4]]);
// 117 «Er hat das Grillen fast fertig gemacht.»: las salchichas, carbonizadas; humo negro; Papa con cara de susto
shot(142.01, 'Z', 'punch', L => { town(); show(GRILL, 22, 0, 98.5, 0); const p = put(papa, 18.4, 0, 100, .9); num(p); actuar(p, L.lt, [[0, { aRx: 1.3, aRe: .8 }], [.6, 'shock', { dur: .3 }]], { T: L.T }); cara(p, L.T, { expr: L.lt > .6 ? 'shock' : 'smile' }); GRILL.userData.setBurn(clamp(L.lt / 1.2)); smoke(V(22, 4.6, 98.5), L.T, lerp(.5, 1.3, L.k));
  orbit(V(20.2, 4.4, 99.5), lerp(13, 10, L.k), .7 - L.k * .2, .25, 46); sh(V(20, 0, 100), 20); }, [[0, 'sizzle', .7], [.6, 'fire_whoosh', .6], [1.0, 'cough', .5]]);
// 118–119 «AH! ALMOST ×3»: solo Papa, entre el humo, con las pinzas, diciéndolo
shot(144.09, 'C', 'punch', L => { town(); show(GRILL, 22, 0, 98.5, 0); GRILL.userData.setBurn(1); const p = put(papa, 18.4, 0, 100, .9); num(p); actuar(p, L.lt, [[0, 'hands_head'], [1.1, 'slump', { dur: .5 }]], { T: L.T, extra: { headY: Math.sin(L.T * 7) * .15 } }); talk(p, L.T, 144.09, 146.11, 'sad'); smoke(V(22, 4.6, 98.5), L.T, 1.1);
  orbit(hp(p).add(V(0, -.5, 0)), lerp(11, 8, L.k), .9 - L.k * .15, .05, 44); sh(V(19, 0, 100), 20); }, [[0, 'cough', .5], [1.0, 'sizzle', .4], [1.4, 'sad_trombone', .4]]);
// 120 «Folge mir und hör nicht bei fast auf.»: yo en la plaza con mi 1000 dorado, señalo a cámara; todos celebran
shot(146.11, 'Z', null, L => { town(); folk(-6, -6, 70, 8, 40, L.T, 71, { mode: 'cheer' }); const c = put(ich, -6, 0, -6, 0); num(c, 1000, 1, 'gold'); actuar(c, L.lt, [[0, 'point'], [1.6, 'wave', { dur: .3 }]], { T: L.T }); talk(c, L.T, 146.11, 148.4, 'joy'); confRain(V(-6, 0, -6), L.T, 50, 30, 30, 18);
  orbit(headC(c).add(V(0, -1, 0)), lerp(16, 11, L.k), 0, .04, 44); sh(V(-6, 0, -6), 30); }, [[0, 'crowd_cheer', .6], [.4, 'pop', .5], [1.6, 'ding', .5]]);
// ---------- portada: yo (7) en el centro, triste; a los lados Jonas (990) y el del döner (920) riéndose; texto entre los personajes ----------
window.renderCover = v => { hideAll(); BAD_.length = 0; town(); const T = 3.2;
  const c = put(ich, -6, 0, -6, 0); num(c, 7, 1); actuar(c, 0, [[0, 'shrug']], { T }); cara(c, T, { expr: 'sad', eyes: 'worried', mouth: 'frown' });
  [[jonas, -9.2, -7.4, .45, 'point'], [doenm, -2.8, -7.4, -.45, 'point_l']].forEach(([k, x, z, ry, g]) => { put(k, x, 0, z, ry); num(k); actuar(k, 0, [[0, g]], { T }); cara(k, T, { eyes: 'happy', mouth: 'laugh' }); });
  COVER = { cam: () => orbit(V(-6, 3.8, -7), 22, 0, .06, 46) };
  COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; camera.updateProjectionMatrix(); while (POST.length) POST.shift()();
  sun.castShadow = true; sky.sky.position.copy(camera.position); composer.render(); octx.drawImage(renderer.domElement, 0, 0, W, H);
  const t = (s, y, sz, fill) => { octx.save(); octx.font = `700 ${sz}px ${FONT}`; octx.textAlign = 'center'; octx.textBaseline = 'middle'; octx.lineJoin = 'round'; octx.lineWidth = sz * .22; octx.strokeStyle = '#000'; octx.strokeText(s, W / 2, y); octx.fillStyle = fill; octx.fillText(s, W / 2, y); octx.restore(); };
  t('JEDER GEWINNT FAST', H * .74, 92, '#ffffff'); t('… AUSSER MIR', H * .80, 110, '#E2FD07'); COVER = null; };


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); } });
CUES.push({ t: 0, s: 'zoom_fast', g: .9 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD_.length = 0; s.fn(L); while (POST.length) POST.shift()();
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud'].includes(c.s) && T - c.t < .16) sh_ = Math.max(sh_, 1 - (T - c.t) / .16); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, MODE === 'night' ? 'noche' : 'polvo', MODE === 'in' ? .3 : .4);
  if (BIRDS.update) BIRDS.update(T, camera.position.clone().addScaledVector(dir, 60).add(V(0, 25, 0)), (MODE === 'day' || MODE === 'sunset') && BIRDSON ? 1 : 0);
  sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position); composer.render();
}
function renderAt(T) {
  const i = shotAt(T), s = S[i]; let tr = null, a = 0, ph = 0; const fO = (s.t1 - T) * FPS, fI = (T - s.t0) * FPS;
  if (s.tr && fO < TRW[s.tr] && i + 1 < S.length) { tr = s.tr; a = 1 - fO / TRW[s.tr]; ph = -1; } else if (i > 0 && S[i - 1].tr && fI < TRW[S[i - 1].tr]) { tr = S[i - 1].tr; a = 1 - fI / TRW[S[i - 1].tr]; ph = 1; }
  renderShot(i, T, tr, a);
  octx.save(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.translate(W / 2, H / 2); const a2 = a * a;
  if (tr === 'W') octx.translate(ph * a2 * W * .45, 0); if (tr === 'S') octx.translate(0, ph * a2 * H * .35);
  if (tr === 'Z') { const sc = ph < 0 ? 1 + a2 * .6 : 1 + a2 * .35; octx.scale(sc, sc); octx.filter = `blur(${(a * 8).toFixed(1)}px)`; }
  if (tr === 'R') { octx.rotate((ph < 0 ? 1 : -1) * a2 * .55); octx.scale(1 + a2 * .3, 1 + a2 * .3); octx.filter = `blur(${(a * 7).toFixed(1)}px)`; }
  if (tr === 'C' && ph > 0) { const sc = 1 + a * .22; octx.scale(sc, sc); }
  if (tr === 'I') { octx.beginPath(); octx.arc(0, 0, Math.max(1, (1 - a2) * H * .62), 0, 7); octx.clip(); }
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { renderer, composer, bloom, sun, grade, scene, camera };

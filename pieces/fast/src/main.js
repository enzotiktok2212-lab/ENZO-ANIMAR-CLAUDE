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
//@@PLANOS@@

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

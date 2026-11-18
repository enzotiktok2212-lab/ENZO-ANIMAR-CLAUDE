// HALS — «In dieser Stadt wird dein Hals jedes Mal länger, wenn du aufs Handy schaust»: planos sincronizados con audio/words.json (1080×1920, 30 fps).
// Réplica de la estructura del vídeo de referencia en Hufenbach (pueblo alemán de entramado): todo el pueblo con cuellos largos. Planos en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT } from './props.js';
import { makeOma, makeKumpel, makeLena, makeSie, makeEr, makeKassiererin, makeFahrer, makePapa, makeMayor, makeIch, makeJonas, makeMama, makeVerk, makeNachbar } from './gvolk.js';
import { hufenbach, townhouse } from './gort.js';
import { bus } from './pech.js';
import { mustache, txt } from './props.js';
import { hals, neckAt, halsVolk, gull, stork, nest, pretzel, ladder, zollstock, rain, umbrella, needles, yarn, scarfPile, board, phoneBig, laptop, tvSet, drawFeed, drawLock, drawTime, eisdiele, partyKeller, kueche, topDoor, socks, SCARF } from './hals.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 118.3, U = W / 720;
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
// Hufenbach (x = 0): plaza adoquinada x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (x = -6, fachada z ≈ -84, balcón y ≈ 10); fuente (-18,-24); café (36,-40);
// carretera x = 26 hacia +z; mi casa HAUS (4, 96, fachada mira a +x: ventana de arriba en z_local ±6, y 13.5 → mundo x ≈ 11.5, z ≈ 96 ∓ 6).
const PKX = 900, KUX = 1200;
const HB = hufenbach(scene), PK = partyKeller(scene, PKX), KU = kueche(scene, KUX);
const SETS = { HB: HB.G, PK: PK.g, KU: KU.g };
for (const k in SETS) outline(SETS[k], 1.4);
[HB.RANK, HB.KINO, HB.BOX, HB.PRICE].forEach(o => o.visible = false);
// relleno para que el pueblo se vea lleno (casas en el hueco del cine, filas detrás, bloques al fondo)
townhouse(HB.G, -64, -21, 13, 3, 11, Math.PI / 2); townhouse(HB.G, -64, -34.5, 13, 2, 12, Math.PI / 2);
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3) + (Math.abs(x + 6) < 30 ? 1 : 0), 20 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 30 + i, Math.PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 40 + i, -Math.PI / 2); }
for (let i = 0, x = -140; x <= 140; x += 20, i++) townhouse(HB.G, x, -170, 18, 4 + (i % 3), 50 + i, 0);
// casas alrededor de mi casa (calle de la carretera, lado oeste) para que el fondo no quede vacío
for (let i = 0, z = 130; z < 260; z += 18, i++) townhouse(HB.G, 0, z, 16, 2 + (i % 2), 60 + i, Math.PI / 2);
for (let i = 0, z = 80; z < 260; z += 18, i++) townhouse(HB.G, 54, z + 40, 16, 2 + (i % 3), 70 + i, -Math.PI / 2);
// segundas puertas «ganz oben» en las casas de la plaza (oeste: fachada en x = -54 mirando +x; este: x = 42 mirando -x) y en mi casa
const TOPD = []; for (const [x, z, y, ry] of [[-53.8, 40, 16, Math.PI / 2], [-53.8, 4, 25, Math.PI / 2], [-53.8, -52, 16, Math.PI / 2], [41.8, 30, 25, -Math.PI / 2], [41.8, -10, 16, -Math.PI / 2], [41.8, -62, 25, -Math.PI / 2]]) TOPD.push(topDoor(HB.G, x, y, z, ry, [0x2a6a4a, 0x8a2a3a, 0x2a3a8a][TOPD.length % 3]));
const MYTOP = topDoor(HB.HAUS, 0, 11.4, 7.2, 0, 0x2a6a4a);
// buhardilla con ventana de tejado (Dachfenster) en la cara delantera del tejado: ventana en local (6, 22.2, 6.6) → mundo ≈ (10.6, 22.2, 90), mira a +x
const DORM = new THREE.Group(); DORM.position.set(6, 20.2, 4.6); HB.HAUS.add(DORM); const dw = mat(0xf6e6b8, { roughness: .8 });
box(5, 4.4, .3, dw, .02, DORM, 0, 2.2, -1.85); for (const sx of [-1, 1]) box(.3, 4.4, 4, dw, .02, DORM, sx * 2.35, 2.2, 0); box(5, .3, 4, dw, .02, DORM, 0, 4.25, 0); box(5, .3, 4, mat(0x8a6a4a), .02, DORM, 0, .15, 0); box(5, .55, .3, dw, .02, DORM, 0, .3, 1.85); box(5, .7, .3, dw, .02, DORM, 0, 4.05, 1.85); for (const sx of [-1, 1]) box(.7, 4.4, .3, dw, .02, DORM, sx * 2.15, 2.2, 1.85); const dr = new THREE.Mesh(new THREE.CylinderGeometry(.01, 3.6, 2.2, 4, 1, false, Math.PI / 4), mat(0xb83a2a, { roughness: .6 })); dr.scale.set(1, 1, 1.2); dr.position.set(0, 5.4, 0); DORM.add(dr);
const DWALL = textPlane(4.4, 3.8, 220, 190, (c, w, h) => { c.fillStyle = '#7a9ad8'; c.fillRect(0, 0, w, h); c.fillStyle = '#6a8ac8'; for (let x = 0; x < w; x += 20) c.fillRect(x, 0, 10, h); c.fillStyle = '#ffd23f'; c.fillRect(30, 40, 60, 80); }); DWALL.position.set(0, 2.2, -1.68); DORM.add(DWALL); for (const [w, h, x, y] of [[3.8, .3, 0, .5], [3.8, .3, 0, 3.7], [.3, 3.4, -1.85, 2.1], [.3, 3.4, 1.85, 2.1]]) box(w, h, .4, mat(0xffffff), .05, DORM, x, y, 2.05);
const SHUT = [-1, 1].map(s => { const g = new THREE.Group(); g.position.set(s * 1.7, 2.1, 2.15); DORM.add(g); box(1.7, 3.1, .12, mat(0x9fd8f8, { roughness: .05, metalness: .3, transparent: true, opacity: .55 }), .03, g, -s * .85, 0, 0); box(1.7, .16, .16, mat(0xffffff), 0, g, -s * .85, 1.5, 0); box(1.7, .16, .16, mat(0xffffff), 0, g, -s * .85, -1.5, 0); return g; });
const DLIGHT = new THREE.PointLight(0xffd8a0, 0, 12, 1.5); DLIGHT.position.set(0, 2.4, 0); DORM.add(DLIGHT); outline(DORM, 1.4);
// mesa del jardín (para el portátil): mundo ≈ (16, 3, 100)
const GTAB = new THREE.Group(); GTAB.position.set(-4, 0, 12); HB.HAUS.add(GTAB); box(5, .3, 3.4, mat(0xf4f4f4, { roughness: .4 }), .05, GTAB, 0, 3, 0); for (const [x, z] of [[-2.2, -1.4], [2.2, -1.4], [-2.2, 1.4], [2.2, 1.4]]) box(.25, 3, .25, mat(0x6a6e78, { metalness: .5 }), 0, GTAB, x, 1.5, z); outline(GTAB, 1.2);
// tablones: ranking de cuellos y el cartel de la norma de vídeos; estadística
const RANKB = board(HB.G, 12, 9, (c, w, h) => { c.fillStyle = '#1e3a2a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c8a050'; c.lineWidth = 14; c.strokeRect(7, 7, w - 14, h - 14); txt(c, 'HALS-RANGLISTE', w / 2, 60, 52, '#ffd23f');
  [['1.', 'Bürgermeister', '14 m'], ['2.', 'ICH', '9 m'], ['3.', 'Marvin', '6 m'], ['4.', 'Oma Gerda', '4 m']].forEach(([n, a, b], i) => { const y = 150 + i * 80; c.font = `700 ${i === 1 ? 50 : 42}px ${FONT}`; c.textAlign = 'left'; c.fillStyle = i === 1 ? '#ffd23f' : '#ffffff'; c.fillText(n + ' ' + a, 44, y); c.textAlign = 'right'; c.fillText(b, w - 44, y); if (i === 1) { c.strokeStyle = '#ff5a4a'; c.lineWidth = 6; c.beginPath(); c.roundRect(24, y - 36, w - 48, 70, 20); c.stroke(); } }); });
RANKB.position.set(4, 0, -50); RANKB.rotation.y = -.15;
const VIDB = board(HB.G, 16, 11, (c, w, h) => { c.fillStyle = '#fffaf0'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8323a'; c.fillRect(0, 0, w, 110); txt(c, 'AMTLICHE REGEL', w / 2, 58, 64, '#ffffff');
  c.fillStyle = '#c8f03a'; c.beginPath(); c.arc(150, 250, 80, 0, 7); c.fill(); c.lineWidth = 8; c.strokeStyle = '#1a1a1a'; c.stroke(); txt(c, '☺', 150, 255, 100, '#1a1a1a'); txt(c, '„In dieser Stadt“', 500, 210, 58, '#1a1a2a'); txt(c, '-Videos', 500, 280, 58, '#1a1a2a');
  txt(c, 'MAX. 10 MIN.', w / 2, 400, 110, '#d8323a', '#ffffff', 8); txt(c, 'PRO TAG', w / 2, 500, 70, '#1a1a2a'); }, true, .3);
VIDB.position.set(-24, 0, 6); VIDB.rotation.y = .5;
const STATB = board(HB.G, 13, 10, (c, w, h) => { c.fillStyle = '#0e1430'; c.fillRect(0, 0, w, h); txt(c, 'STATISTIK', w / 2, 60, 60, '#ffffff'); txt(c, 'Woher kommt der Hals?', w / 2, 120, 36, '#9ab0e8');
  const cx = w * .34, cy = h * .62, R = 150; [['#3ab8ff', 0, 4.19], ['#ff4a5a', 4.19, 6.283]].forEach(([col, a, b]) => { c.fillStyle = col; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R, a - 1.57, b - 1.57); c.fill(); }); c.strokeStyle = '#0e1430'; c.lineWidth = 6; c.stroke();
  txt(c, '1/3', cx - 70, cy - 60, 54, '#ffffff', '#4a0010', 8); c.textAlign = 'left'; c.fillStyle = '#ff4a5a'; c.fillRect(w * .62, h * .48, 30, 30); c.fillStyle = '#3ab8ff'; c.fillRect(w * .62, h * .66, 30, 30); c.font = `700 30px ${FONT}`; c.fillStyle = '#fff'; c.fillText('„In dieser', w * .62 + 44, h * .5); c.fillText('Stadt“-Videos', w * .62 + 44, h * .55); c.fillText('Rest', w * .62 + 44, h * .69); }, true, .3);
STATB.position.set(-14, 0, -40); STATB.rotation.y = .2;
const EIS = eisdiele(HB.G, 0, 58, Math.PI); // quiosco de Lina al sur de la plaza (mira a -z, hacia la plaza)
// ---------- reparto ----------
const ich = makeIch(scene), papa = makePapa(scene), lina = makeLena(scene), marvin = makeJonas(scene), mayor = makeMayor(scene), oma = makeOma(scene), oma2 = makeMama(scene), sie = makeSie(scene), er = makeEr(scene), fahrer = makeFahrer(scene);
const K = Array.from({ length: 8 }, (_, i) => makeKumpel(scene, i)); const XT = [makeKassiererin(scene), makeVerk(scene), makeNachbar(scene)];
kitFace(ich, 'kid'); kitFace(papa, 'mustache'); kitFace(lina, 'girl'); kitFace(marvin, 'hero'); kitFace(mayor, 'mustache'); kitFace(oma, 'girl'); kitFace(oma2, 'girl'); kitFace(sie, 'girl'); kitFace(er, 'plain'); kitFace(fahrer, 'mustache');
K.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'plain', 'girl', 'girl', 'kid', 'hero'][i])); XT.forEach((c, i) => kitFace(c, ['girl', 'girl', 'plain'][i]));
const POOL = [ich, papa, lina, marvin, mayor, oma, oma2, sie, er, fahrer, ...K, ...XT]; POOL.forEach(c => outline(c.root, 2));
const SOCKS = socks(ich);
// longitud de cuello (unidades locales): 1 m ≈ 3
const NL = { ich: 27, mayor: 40, marvin: 15, oma: 10, papa: 0 };
// ---------- atrezo ----------
const VOLK = halsVolk(scene, 60);
const RAIN = rain(scene, 600);
const BUS = (() => { const g = new THREE.Group(); scene.add(g); bus(g, 0xf2c23a, '7 Marktplatz'); for (const z of [-7, 0, 7]) { const h = cyl(1.4, 1.4, .3, mat(0x101014), 16, g, 0, 8.3, z); } outline(g, 1.6); return g; })();
const GULLS = Array.from({ length: 4 }, () => gull(scene)); const STORKS = [stork(scene), stork(scene)]; const NEST = nest(scene);
const PZ = [pretzel(scene), pretzel(scene, true), pretzel(scene, true)];
const LAD = ladder(scene, 9), LAD2 = ladder(scene, 26), ZOLL = zollstock(scene, 26), ZOLLS = zollstock(scene, 6);
const UMB = [umbrella(scene, 0xd8323a), umbrella(scene, 0x2a8ad8), umbrella(scene, 0xffd23f)];
const NEED = [needles(scene), needles(scene)]; const YARN = [yarn(scene, 0xd8323a), yarn(scene, 0xf4f4f4)]; const SPILE = scarfPile(scene, 70, 3);
const PH = phoneBig(scene), PH2 = phoneBig(scene), LAP = laptop(scene), TV = tvSet(scene);
const FLY = (() => { const p = textPlane(2.4, 3.2, 240, 320, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#ff5aa8'); g.addColorStop(1, '#7a3ad8'); c.fillStyle = g; c.fillRect(0, 0, w, h); txt(c, 'PARTY!', w / 2, 60, 52, '#ffffff', '#3a0a3a', 8); txt(c, 'SAMSTAG', w / 2, 140, 36, '#ffd23f'); txt(c, '20 Uhr', w / 2, 190, 30, '#ffffff'); txt(c, 'IM KELLER', w / 2, 260, 36, '#ffffff', '#3a0a3a', 6); }); p.material.side = THREE.DoubleSide; scene.add(p); return p; })();
const CONE = (() => { const g = new THREE.Group(); scene.add(g); const c = new THREE.Mesh(new THREE.ConeGeometry(.35, 1.2, 10), mat(0xe8a850)); c.rotation.x = Math.PI; g.add(c); sphere(.4, mat(0xff8ab8, { roughness: .5 }), g, 0, .75, 0, 12, 8); sphere(.36, mat(0x8ae8c8, { roughness: .5 }), g, 0, 1.3, 0, 12, 8); outline(g, 1); return g; })();
const CAL = (() => { const p = textPlane(5, 6, 250, 300, (c, w, h) => {}); scene.add(p); p.userData.draw = (n, sub, col = '#d8323a') => { const cv = p.material.map.image, c = cv.getContext('2d'), w = cv.width, h = cv.height; c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = col; c.fillRect(0, 0, w, 80); for (let k = 0; k < 4; k++) { c.fillStyle = '#9aa0aa'; c.beginPath(); c.arc(40 + k * 57, 14, 8, 0, 7); c.fill(); } txt(c, sub, w / 2, 48, 40, '#ffffff'); txt(c, n, w / 2, 190, n.length > 3 ? 90 : 150, '#1a1a2a'); p.material.map.needsUpdate = true; }; return p; })();
const CASH = []; const CONF = Array.from({ length: 50 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 4 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const ZZZ = Array.from({ length: 3 }, () => { const p = textPlane(1.2, 1.2, 64, 64, (c, w, h) => { c.font = `700 56px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 8; c.strokeStyle = '#1a1a2a'; c.strokeText('Z', w / 2, h / 2); c.fillStyle = '#ffffff'; c.fillText('Z', w / 2, h / 2); }); p.material.depthWrite = false; scene.add(p); return p; });
const HEARTS = Array.from({ length: 5 }, () => { const p = textPlane(1, 1, 64, 64, (c, w, h) => { c.fillStyle = '#ff4a7a'; c.beginPath(); c.moveTo(32, 54); c.bezierCurveTo(-10, 26, 12, -6, 32, 16); c.bezierCurveTo(52, -6, 74, 26, 32, 54); c.fill(); }); p.material.depthWrite = false; p.material.transparent = true; scene.add(p); return p; });
const MATH = Array.from({ length: 5 }, (_, i) => { const p = textPlane(1.4, 1.4, 64, 64, (c, w, h) => { txt(c, ['+', '÷', '=', '12', '−'][i], 32, 34, i === 3 ? 34 : 54, '#ffd23f', '#1a1a2a', 6); }); p.material.depthWrite = false; scene.add(p); return p; });
const DTAB = (() => { const g = new THREE.Group(); scene.add(g); cyl(1.8, 1.8, .2, mat(0xf4f4f4, { roughness: .3 }), 24, g, 0, 3.0, 0); cyl(.16, .16, 3, mat(0x2a2a2a, { metalness: .6 }), 8, g, 0, 1.5, 0); cyl(.3, .3, .9, mat(0xfff4d0, { emissive: 0xffd88a, emissiveIntensity: .6 }), 10, g, 0, 3.55, 0); sphere(.12, mat(0xffd23f, { emissive: 0xffa21a, emissiveIntensity: 3 }), g, 0, 4.1, 0, 8, 6); for (const s of [-1, 1]) cyl(.35, .3, .5, mat(0xffffff), 12, g, .6 * s, 3.35, .6 * s); const r = new THREE.Mesh(new THREE.ConeGeometry(.3, .6, 6), mat(0xd8323a)); r.position.set(-.9, 3.4, -.4); g.add(r); outline(g, 1.2); return g; })();
const PROPS = [BUS, DTAB, ...GULLS, ...STORKS, NEST, ...PZ, LAD, LAD2, ZOLL, ZOLLS, ...UMB, ...NEED, ...YARN, SPILE, PH, PH2, LAP, TV, FLY, CONE, CAL, ...CONF, ...DUST, ...SWEAT, ...TEAR, ...ZZZ, ...HEARTS, ...MATH];
PROPS.forEach(p => p.visible = false);
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.25; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.55, .62, .42); sun.intensity = 2.5; sun.color.setRGB(1, .95, .86); rim.intensity = 1.0;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function sunset() { day(); MODE = 'sunset'; setSky([.22, .32, .78], [.85, .55, .7], [1, .72, .45]); sun.color.setRGB(1, .82, .62); sun.intensity = 2.3; hemi.color.setRGB(1, .9, .85); scene.fog.color.setRGB(1, .82, .7); bloom.strength = .2; }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.0; setSky([.02, .04, .16], [.08, .12, .34], [.2, .22, .46]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.0; hemi.color.setRGB(.6, .7, 1); hemi.groundColor.setRGB(.25, .25, .36); sun.intensity = 1.1; sun.color.setRGB(.72, .78, 1); rim.intensity = 1.7;
  scene.fog.color.setRGB(.1, .14, .28); scene.fog.density = .0011; bloom.strength = .3; bloom.threshold = .85; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = .95, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .2; bloom.threshold = .88; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); hals(c, 0); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } }
  SOCKS.forEach(s => s.visible = false);
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  VOLK.hide(); RAIN.update(0, V(0, 0, 0), 1, 1, 1, false); RANKB.visible = VIDB.visible = STATB.visible = EIS.visible = false; SHUT.forEach(g => g.rotation.y = 0); DLIGHT.intensity = 0; HB.CURT.forEach(c_ => c_.visible = true); KU.hatch.visible = true;
  for (const k in SETS) SETS[k].visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = 1.08; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; THERM = false; BIRDSON = 1; SHAKE = 0; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
// órbita: cámara a distancia d del centro c, ángulo yaw (0 = desde +z), pitch (arriba +); el centro queda al ~42 % de la altura
function orbit(c, d, yaw = 0, pitch = .15, fov = 44) { const t = Math.tan(fov * Math.PI / 360) * d * .16; cam([c.x + Math.sin(yaw) * Math.cos(pitch) * d, c.y + Math.sin(pitch) * d, c.z + Math.cos(yaw) * Math.cos(pitch) * d], [c.x, c.y - t, c.z], fov); }
const orb = (k, c0, c1, a, b, e = easeInOut) => { const q = e(clamp(k)); orbit(c0.clone().lerp(c1 ?? c0, q), lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q), lerp(a[3] ?? 44, b[3] ?? 44, q)); };
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
// encuadre frontal: cámara a 'dist' delante del personaje (según su ry), un poco a un lado, mirando a la cabeza
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .3 + dy, h.z + fz * d - fx * side], [h.x, h.y - .5, h.z], fov); }
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
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
// fuegos artificiales: estallidos en el cielo
function fireworks(c, T, n = 3, R = 14) { FW.forEach((s, i) => { const b = i % n, k = Math.floor(i / n), per = 1.6, t = ((T + b * .53) % per) / per, r0 = RNG(b * 17 + Math.floor((T + b * .53) / per) * 31); const cx = c.x + (r0() - .5) * 60, cy = c.y + 30 + r0() * 20, cz = c.z + (r0() - .5) * 20;
  const a = k / (FW.length / n) * 6.283, el = Math.sin(k * 2.3) * .8; s.visible = t > .25; const e = easeOut((t - .25) / .75) * R; s.position.set(cx + Math.cos(a) * Math.cos(el) * e, cy + Math.sin(el) * e - t * t * 4, cz + Math.sin(a) * Math.cos(el) * e); s.scale.setScalar(1 - t * .8); s.material.color.setHSL((b * .27 + .05) % 1, 1, .6).multiplyScalar(2.5); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.7 + t * 2) * s * (.8 + r() * .5)); d.material.opacity = .55 * (1 - t / 1.2); }); }
function notes(p, T) { NOTES.forEach((z, i) => { const k = (T * .7 + i / 4) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 2 + T) * 1.5, p.y + k * 4, p.z + .5); z.scale.setScalar(.6 + k * .6); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
function hearts(p, T) { HEARTS.forEach((z, i) => { const k = (T * .6 + i / 5) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 1.7 + T) * 1.4, p.y + k * 3.4, p.z + .4); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));

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
  else if (b.kind === 'huss') { c.rotate(-.12); c.font = `700 64px ${FONT}`; c.lineWidth = 16; c.strokeStyle = '#1a1a2a'; c.strokeText(b.text, 0, 0); c.fillStyle = '#ffffff'; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  c.restore(); }
const KEY = /^(Stadt|Hals|länger|Handy|Stunde|Zentimeter|nie|Schal|Omas|Jahr|einzigen|Dates|Leiter|Busse|Löcher|Dach|Regenschauer|Problem|Haltung|Marvin|Türen|zweite|Haustür|oben|Verrückteste|Bürgermeister|Störche|Kopf|nie|schlimm|Stadt“-Videos|zehn|Minuten|begrenzt|Statistik|dritten|Meter|Nummer|zwei|Neun|Füße|2021|Papa|Dachfenster|Brezel|Großer|Möwen|Hälfte|alles|Lina|Eisdiele|Party|Keller|Kellerdecke|Zwei|zwölf|Tage|gesperrt|Handy|Laptop|Fernseher|Bildschirmzeit|sechs|vierzig|null|Härteste|keiner|eins|wachsen|Zollstock|vier|ganzer|acht|untere|Tür|elf|verschiedene|Socken|Samstag|Kellertreppe|Körper|Küche|Augen|gleicher|Höhe|Weg|vorbei|klopfte|Hand)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0, THERM = false; const COVERS = [];
// Hufenbach (x = 0): plaza adoquinada x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (x = -6, fachada z ≈ -84, balcón y = 10,4, cartel GOONEN VERBOTEN);
// fuente (-18, -24); café (36, -40); contenedores (-40, -14); cartel de la plaza (-30, 18); döner (40, 40); carretera x = 26 hacia +z; mi casa (4, 96, mira a +x).
// Quiosco de Lina (0, 58) mira a -z; tablones: RANKB (4,-50), VIDB (-24, 6), STATB (-14,-40).
let LMODE = 'day'; const town = (m = 'day') => { use('HB'); LMODE = m; if (m === 'night') night(45); else if (m === 'morning') sunset(); else day(); };
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
// ---------- c: Lina y la fiesta en el sótano, el bloqueo de pantallas y los días (58,29 – 98,13 s) ----------
// Quiosco de Lina (0, 58) mirando a -z; mostrador en z ≈ 55,6. Lina detrás (0, 59.6). Yo delante, al norte.
const linaK = (L, expr = 'happy', pose = 'idle') => { EIS.visible = true; const l = put(lina, 0, 0, 59.4, PI); actuar(l, L.lt, [[0, pose]], { T: L.T }); cara(l, L.T, { expr }); return l; };
const meK = (L, z = 41, bend = 0, expr = 'smile', L_ = NI) => { const c = put(ich, 0, 0, z, 0); hals(c, L_, { T: L.T, sway: .02, bend }); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr }); return c; };
const calPop = (L, n, sub, p, col) => { CAL.userData.draw(n, sub, col); show(CAL, p.x, p.y, p.z, 0, spring(clamp(L.lt * 3.2))); CAL.lookAt(camera.position); };
// 46 «Bis zu dem Tag, der alles verändert hat» (zoom lento): el quiosco de helados de Lina; yo me acerco
shot(58.29, 'F', 'slow', L => { town(); const l = linaK(L, 'smile'); const c = put(ich, 0, 0, 0, 0); walkC(c, L.lt, 2, 26, -.08, 3.2, L.T); hals(c, NI, { T: L.T, sway: .03 }); cara(c, L.T, { expr: 'smile' });
  volk(0, 40, 30, 14, 40, L.T, 81, { phone: true }); orbit(V(2, 12, 46), lerp(62, 50, easeIn(L.k)), PI - .4, .1, 46); sh(V(0, 0, 46), 50); }, [[0, 'sparkle', .5], [.4, 'steps', .4], [1.2, 'bell_far', .4]]);
// 47 «Lina von der Eisdiele»: Lina en el mostrador, saludando con un cucurucho; corazones
shot(60.81, 'C', 'punch', L => { town(); const l = linaK(L, 'happy', 'wave'); attach(CONE, l.aL.hand, [0, -.6, .3], [PI, 0, 0], 1); hearts(headC(l).add(V(0, 1.2, 0)), L.T); badge('tag', 'LINA', W / 2, H * .2, (L.lt - .1) * 4);
  cam([1.8, 6.4, lerp(48, 50, L.k)], [0, 5.4, 59.4], 42); sh(V(0, 0, 58), 20); }, [[0, 'door_bell', .5], [.3, 'sparkle', .4]]);
// 48 «sagte: „Komm Samstag»: doblo el cuello hasta el mostrador como una jirafa; ella me habla
shot(61.85, 'W', null, L => { town(); const l = linaK(L, 'talk', 'point'); talk(l, L.T, 61.85, 63.72, 'happy'); const c = meK(L, 40.5, lerp(1.6, 2.35, easeOut(L.k * 1.5)), 'love'); hearts(headC(c).add(V(0, 1.2, 0)), L.T);
  bubble(l, 'Komm Samstag zu meiner Party!', (L.lt - .2) * 4, 1.6); orbit(V(0, 9, 50), lerp(32, 28, L.k), PI - .75, .1, 46); sh(V(0, 0, 50), 30); }, [[0, 'stretch_creak', .5], [.4, 'pop', .4]]);
// 48b «zu meiner Party»: el folleto rosa: PARTY! SAMSTAG
shot(62.90, 'C', 'punch', L => { town(); const l = linaK(L, 'happy'); actuar(l, L.lt, [[0, { aRx: 1.8, aRe: .3, aRz: -.2 }]], { T: L.T }); const c = meK(L, 40.5, 2.35, 'happy');
  const p = loc(l, -.4, 6.2, 2.2); show(FLY, p.x, p.y, p.z, 0, 1); FLY.rotation.set(0, PI + .1, 0); cam([p.x + .6, p.y + .3, p.z - lerp(5.5, 4.6, L.k)], [p.x, p.y, p.z], 42); sh(V(0, 0, 56), 20); }, [[0, 'paper', .6], [.3, 'party_horn', .3]]);
// 49 «Das Problem: Sie ist im»: zoom al folleto: IM KELLER
shot(63.72, 'Z', 'punch', L => { town(); const l = linaK(L, 'happy'); actuar(l, L.lt, [[0, { aRx: 1.8, aRe: .3, aRz: -.2 }]], { T: L.T }); const c = meK(L, 40.5, 2.35, 'shock');
  const p = loc(l, -.4, 6.2, 2.2); show(FLY, p.x, p.y, p.z, 0, 1); FLY.rotation.set(0, PI + .1, 0); cam([p.x + .2, p.y - .9, p.z - lerp(3.4, 3.0, L.k)], [p.x, p.y - 1.1, p.z], 42); badge('red', 'PROBLEM', W / 2, H * .17, (L.lt - .05) * 4, 1, .8); sh(V(0, 0, 56), 20); }, [[0, 'braam_short', .5], [.2, 'gasp', .4]]);
// 50 «Keller.»: el sótano de la fiesta: techo bajito, luces, globos
const kel = (L, n = 0) => { use('PK'); inside(.9, 40); PK.disco.rotation.y = L.T * 1.5; PK.LIGHTS.forEach((b, i) => b.material.emissiveIntensity = 1.6 + Math.sin(L.T * 6 + i) * 1.2); };
shot(64.86, 'W', null, L => { kel(L); cam([PKX + 10, 4.2, 14], [PKX - 6, 3.4, -8], 50); cm([PKX + 12, 4.6, 15, PKX - 4, 3.5, -8, 52], [PKX + 8, 4.4, 11, PKX - 6, 3.6, -10, 50], L.k); sh(V(PKX, 0, 0), 30); }, [[0, 'door_creak', .5], [.3, 'drip', .4]]);
// 51 «Und die Kellerdecke? Zwei Meter.»: el metro del suelo al techo: 2 METER; Lina cabe justa
shot(65.58, 'C', 'punch', L => { kel(L); const l = put(lina, PKX - 3, 0, -6, .3); actuar(l, L.lt, [[0, 'shrug']], { T: L.T }); cara(l, L.T, { expr: 'smile' }); show(ZOLLS, PKX + .2, 0, -6.2, 0, 1.15);
  badge('red', '2 METER', W / 2, H * .18, (L.lt - .45) * 4, 1, 1); orbit(V(PKX - 1, 3.6, -6), lerp(15, 13, L.k), .1, .02, 46); sh(V(PKX, 0, -6), 20); }, [[0, 'ratchet', .5], [.45, 'impact', .5]]);
// 52 «Ich hab nachgerechnet»: en la plaza, pensando; números y signos girando alrededor de mi cabeza
shot(67.19, 'R', null, L => { plaza(L, 30, 83, -6, -2, 8); const c = put(ich, -6, 0, -2, 0); hals(c, NI, { T: L.T, sway: .03 }); actuar(c, L.lt, [[0, 'think']], { T: L.T }); cara(c, L.T, { expr: 'confused' });
  const h = headC(c); MATH.forEach((m, i) => { m.visible = true; const a = L.T * 2.4 + i * 1.26; m.position.set(h.x + Math.cos(a) * 2.6, h.y + .6 + Math.sin(L.T * 3 + i) * .4, h.z + Math.sin(a) * 2.6); m.lookAt(camera.position); }); orbit(h, lerp(13, 11, L.k), .2, .05, 44); sh(V(-6, 0, -2), 30); }, [[0, 'tick', .5], [.3, 'pencil', .4], [.6, 'tick', .4]]);
// 53 «Mir blieben zwölf Tage»: calendario 12 TAGE
shot(68.23, 'Z', 'punch', L => { plaza(L, 30, 85, -6, -2, 8); const c = put(ich, -6, 0, -2, 0); hals(c, NI, { T: L.T, sway: .03 }); actuar(c, L.lt, [[0, 'fists']], { T: L.T }); cara(c, L.T, { expr: 'determined' }); const h = headC(c);
  orbit(h.clone().add(V(1.6, 0, 0)), lerp(15, 13, L.k), .05, .02, 46); calPop(L, '12', 'TAGE', h.clone().add(V(3.4, .3, .6))); sh(V(-6, 0, -2), 30); }, [[0, 'pages', .5], [.1, 'impact', .5]]);
// ---------- la noche: en el jardín (yo en (17, 92) mirando a +x), portátil en la mesa (16, 3.2, 100), la tele detrás de la ventana del salón ----------
const nightG = L => { town('night'); BIRDSON = 0; DLIGHT.intensity = 10; };
const meG = (L, Lh = 18.4, ry = PI / 2 - .25, x = 17, z = 93) => { const c = put(ich, x, 0, z, ry); hals(c, Lh, { T: L.T, sway: .02 }); return c; };
// 54 «Also hab ich noch in derselben Nacht»: de noche en el jardín, decidido, con el móvil en la mano
shot(69.49, 'F', null, L => { nightG(L); const c = meG(L); handy(c); feed(PH, L.T); actuar(c, L.lt, [[0, scrollPose], [.6, 'fists']], { T: L.T }); cara(c, L.T, { expr: L.lt > .6 ? 'determined' : 'neutral' }); show(LAP, 16, 3.25, 100, PI / 2, 1); LAP.userData.S.draw('feed', (c_, w, h) => drawFeed(c_, w, h, 2));
  orbit(V(15, 11, 95), lerp(46, 40, L.k), .75, .1, 46); sh(V(14, 0, 95), 40); }, [[0, 'crickets', .5], [.4, 'owl', .3], [.8, 'fist', .4]]);
// 54b «alles gesperrt»: un candado gigante cae sobre todo: GESPERRT
shot(70.71, 'C', 'punch', L => { nightG(L); const c = meG(L); handy(c); lockS(PH); actuar(c, L.lt, [[0, 'point']], { T: L.T }); cara(c, L.T, { expr: 'determined' }); show(LAP, 16, 3.25, 100, PI / 2, 1); lockS(LAP);
  badge('red', 'ALLES GESPERRT', W / 2, H * .2, (L.lt - .1) * 4, 1, .8); orbit(V(15, 9, 96), lerp(34, 30, L.k), .8, .12, 46); sh(V(14, 0, 95), 40); }, [[0, 'lid_click', .6], [.2, 'impact', .5], [.5, 'click_metal', .4]]);
// 55 «Handy,»: la pantalla del móvil: candado
shot(72.03, 'W', 'punch', L => { nightG(L); const c = meG(L); handy(c, PH, 1.3); lockS(PH, 'HANDY GESPERRT'); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); screenCam(PH, lerp(3.4, 3, L.k), 0, 44); sh(V(14, 0, 95), 20); }, [[0, 'lid_click', .6], [.1, 'notif', .4]]);
// 56 «Laptop,»: el portátil de la mesa del jardín: candado
shot(72.65, 'W', 'punch', L => { nightG(L); show(LAP, 16, 3.25, 100, PI / 2, 1); lockS(LAP, 'LAPTOP GESPERRT'); cam([16 + lerp(6.5, 5.6, L.k), 6, 100], [16, 4.3, 100], 42); sh(V(16, 0, 100), 20); }, [[0, 'lid_click', .6], [.15, 'click_metal', .4]]);
// 57 «sogar den Fernseher.»: la tele detrás de la ventana del salón: candado; papá se lleva las manos a la cabeza
shot(73.20, 'W', 'punch', L => { nightG(L); HB.CURT.forEach(c_ => c_.visible = false); attach(TV, HB.HAUS, [-4, 6.6, 5.2], [0, 0, 0], .95); lockS(TV, 'TV GESPERRT'); const p = put(papa, 8.4, 1.4, 102.8, PI / 2 - .5); actuar(p, L.lt, [[0, 'hands_head']], { T: L.T }); cara(p, L.T, { expr: 'shock' });
  cam([lerp(26, 23, L.k), 7.5, 101], [10, 6.6, 100], 44); sh(V(10, 0, 100), 20); }, [[0, 'tv_static', .5], [.2, 'lid_click', .5], [.5, 'gasp_old', .4]]);
// 58 «Meine Bildschirmzeit:»: la pantalla de tiempo de uso: las barras suben
shot(74.32, 'S', null, L => { nightG(L); const c = meG(L); handy(c, PH, 1.3); timeS(PH, 'high', L.k * 1.4); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); screenCam(PH, lerp(3.6, 3.1, L.k), 0, 44); sh(V(14, 0, 95), 20); }, [[0, 'tick', .5], [.2, 'tick', .5], [.4, 'tick', .5]]);
// 58b «sechs Stunden vierzig am Tag.»: mi cara de susto; 6 STD. 40 MIN.
shot(75.14, 'C', 'punch', L => { nightG(L); const c = meG(L); handy(c); timeS(PH, 'high', 1); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); cara(c, L.T, { expr: 'shock' }); sweat(c, L.T, 2);
  badge('red', '6 STD. 40 MIN.', W / 2, H * .2, (L.lt - .1) * 4, 1, .9); orbit(headC(c), lerp(11, 9.5, L.k), PI / 2 - .15, .02, 44); sh(V(14, 0, 95), 20); }, [[0, 'braam_short', .5], [.2, 'gasp', .5]]);
// 59 «Ab jetzt: null.»: el contador a cero (verde)
shot(76.98, 'Z', 'punch', L => { nightG(L); const c = meG(L); handy(c, PH, 1.3); timeS(PH, 'zero'); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); badge('green', '0 MIN.', W / 2, H * .2, (L.lt - .45) * 4, 1, 1);
  screenCam(PH, lerp(3.4, 2.9, L.k), 0, 44); sh(V(14, 0, 95), 20); }, [[0, 'click_metal', .5], [.45, 'ding_soft', .5]]);
// 60 «Und ja, auch»: en el móvil, un vídeo de «In dieser Stadt»… el dedo duda
shot(78.00, 'W', null, L => { nightG(L); const c = meG(L); handy(c, PH, 1.3); PH.userData.S.draw('chan', (c_, w, h) => drawFeed(c_, w, h, 1.3, true)); actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); screenCam(PH, lerp(3.6, 3.2, L.k), 0, 44); sh(V(14, 0, 95), 20); }, [[0, 'notif', .5], [.4, 'heartbeat', .4]]);
// 61 «„In dieser Stadt“-Videos.»: también bloqueado
shot(79.27, 'C', 'punch', L => { nightG(L); const c = meG(L); handy(c, PH, 1.3); const k = clamp(L.lt / .25); PH.userData.S.draw('chanL' + Math.round(k * 4), (c_, w, h) => { drawFeed(c_, w, h, 1.3, true); if (k > 0) { c_.globalAlpha = k; drawLock(c_, w, h, 'GESPERRT', '#ff5a4a', 'rgba(12,14,28,.92)'); c_.globalAlpha = 1; } });
  actuar(c, L.lt, [[0, scrollPose]], { T: L.T }); screenCam(PH, 3, 0, 44); sh(V(14, 0, 95), 20); }, [[0, 'lid_click', .6], [.1, 'sad_tone', .4]]);
// 62 «Das war das Härteste.»: lloro; el cuello se me cae de pena
shot(80.21, 'W', null, L => { nightG(L); const c = put(ich, 17, 0, 93, PI / 2 - .25); hals(c, 18.4, { T: L.T, bend: lerp(.2, .9, easeOut(L.k)) }); actuar(c, L.lt, [[0, 'slump']], { T: L.T }); cara(c, L.T, { expr: 'cry' }); const h = headC(c); TEAR.forEach((t, i) => { const k = (L.T * 1.2 + i * .25) % 1; t.visible = true; t.position.set(h.x + (i % 2 ? .45 : -.45) * Math.cos(.25), h.y - .1 - k * 1.6, h.z + .55); });
  orbit(h, lerp(14, 12, L.k), PI / 2 - .1, .1, 44); sh(V(14, 0, 95), 30); }, [[0, 'cry_girl', .3], [.3, 'sigh', .5], [.7, 'drip', .4]]);
// 63 «Aber was dann passierte»: la casa de noche; duermo de pie (Zzz) bajo las estrellas
shot(81.40, 'F', null, L => { nightG(L); DLIGHT.intensity = 0; const c = meG(L); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); hals(c, 18.4, { T: L.T * .5, bend: .3 }); cara(c, L.T, { expr: 'sleepy', eyes: 'closed' }); const h = headC(c);
  ZZZ.forEach((z, i) => { const k = (L.T * .6 + i / 3) % 1; z.visible = true; z.position.set(h.x + .8 + k * 1.2, h.y + 1 + k * 2.4, h.z); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); });
  orbit(V(14, 12, 94), lerp(50, 44, L.k), .8, .14, 46); sh(V(14, 0, 95), 40); }, [[0, 'crickets', .5], [.3, 'snore', .4], [.9, 'owl', .3]]);
// 63b «hätte keiner gedacht» (zoom lento): amanece; abro los ojos… algo ha cambiado
shot(82.64, 'C', 'slow', L => { town('morning'); const c = meG(L); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); hals(c, 18.4, { T: L.T * .5, bend: .1 }); cara(c, L.T, L.lt < .6 ? { expr: 'sleepy', eyes: 'closed' } : { expr: 'gasp' });
  orbit(headC(c), lerp(13, 9, easeIn(L.k)), PI / 2 - .2, .04, 44); sh(V(14, 0, 95), 30); }, [[0, 'rooster', .5], [.6, 'blink', .4]]);
// ---------- los días (de día en el jardín) ----------
const dayG = L => { town(); };
// 64 «Tag eins:»
shot(83.86, 'F', 'punch', L => { dayG(L); const c = meG(L); actuar(c, L.lt, [[0, 'cross']], { T: L.T }); cara(c, L.T, { expr: 'determined' }); const h = headC(c); orbit(h.clone().add(V(0, 0, 1.5)), 15, PI / 2 - .15, .03, 46); calPop(L, 'TAG 1', 'SAMSTAG −12', h.clone().add(V(1.4, .2, 3.6)), '#3a8ad8'); sh(V(14, 0, 95), 30); }, [[0, 'pages', .5], [.1, 'impact', .5]]);
// 65 «Er hörte auf zu wachsen»: el metro junto al cuello: 0 cm, ¡no crece!
shot(84.60, 'W', null, L => { dayG(L); const c = meG(L); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'gasp' }); const n = neckAt(c, .82); show(ZOLLS, n.x + .1, n.y - 3, n.z - 1.2, PI / 2, 1);
  badge('green', '+0 cm', W / 2, H * .22, (L.lt - .2) * 4, 1, 1); badge('tag', 'STOPP', W / 2, H * .31, (L.lt - .5) * 4); cam([n.x + 7.5, n.y + 1, n.z - 2.5], [n.x, n.y + .5, n.z - .5], 44); sh(V(14, 0, 95), 30); }, [[0, 'ratchet', .5], [.3, 'ding_soft', .5]]);
// 66 «Papa hat mit dem»: papá sube por una escalera altísima apoyada a mi lado
shot(85.97, 'S', null, L => { dayG(L); const c = meG(L); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'smile', eyes: 'down' }); show(LAD2, 18.2, 0, 90.6, PI / 2 - .25, 1); LAD2.rotation.z = .06;
  const y = lerp(8, 13, L.k); const p = put(papa, 19.6, y, 90.2, -PI / 2 - .25); actuar(p, L.lt, [[0, { aLx: 2.6 + Math.sin(L.T * 8) * .3, aRx: 2.6 - Math.sin(L.T * 8) * .3, aLe: .5, aRe: .5, lLx: .6 + Math.sin(L.T * 8) * .5, lLk: 1, lRx: .6 - Math.sin(L.T * 8) * .5, lRk: 1 }]], { T: L.T }); cara(p, L.T, { expr: 'determined' });
  cam([34, 3, 84], [18, 14, 91], 50); sh(V(16, 0, 92), 30); }, [[0, 'metal_creak', .5], [.3, 'steps', .4]]);
// 66b «Zollstock nachgemessen»: arriba de la escalera, papá pone el metro junto a mi cabeza y lee entrecerrando los ojos
shot(86.62, 'C', 'punch', L => { dayG(L); const c = meG(L); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'smile' }); show(LAD2, 18.2, 0, 90.6, PI / 2 - .25, 1); LAD2.rotation.z = .06; const h = headC(c);
  const p = put(papa, 19.4, h.y - 5.6, 90.4, -PI / 2 - .6); actuar(p, L.lt, [[0, { aRx: 2.4, aRz: -.3, aRe: .4, aLx: 1.6, aLe: .4 }]], { T: L.T }); cara(p, L.T, { expr: 'sus', eyes: 'squint' }); show(ZOLLS, h.x + .9, h.y - 4.6, h.z + 1.1, PI / 2, 1);
  orbit(h.clone().lerp(headC(p), .5), lerp(13, 11, L.k), PI / 2 + .55, .04, 44); sh(V(16, 0, 92), 30); }, [[0, 'ratchet', .5], [.4, 'hmm', .4]]);
// 67 «Tag vier:»
shot(87.81, 'F', 'punch', L => { dayG(L); const c = meG(L, 18.4); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'gasp' }); const h = headC(c); orbit(h.clone().add(V(0, 0, 1.5)), 15, PI / 2 - .15, .03, 46); calPop(L, 'TAG 4', 'SAMSTAG −8', h.clone().add(V(1.4, .2, 3.6)), '#3a8ad8'); sh(V(14, 0, 95), 30); }, [[0, 'pages', .5], [.1, 'impact', .5]]);
// 68 «ein ganzer Meter weg.»: el cuello baja de golpe un metro: −1 METER
shot(88.48, 'W', null, L => { dayG(L); const s = easeInOut(clamp((L.lt - .15) / .7)); const c = meG(L, lerp(18.4, 15.4, s)); actuar(c, L.lt, [[0, 'idle'], [.8, 'cheer']], { T: L.T }); cara(c, L.T, { expr: s > .9 ? 'joy' : 'gasp' });
  badge('green', '−1 METER', W / 2, H * .2, (L.lt - .6) * 4, 1, 1); orbit(V(16, 11, 94), lerp(36, 33, L.k), .9, .05, 46); sh(V(14, 0, 95), 30); }, [[0, 'whoosh_down', .5], [.2, 'stretch_creak', .4], [.85, 'cheer', .4]]);
// 69 «Die Möwen sind ausgezogen»: las gaviotas se van volando del tejado con sus maletitas
shot(89.92, 'S', null, L => { dayG(L); const c = meG(L, 15.4); actuar(c, L.lt, [[0, 'wave']], { T: L.T }); cara(c, L.T, { expr: 'grin' });
  GULLS.forEach((g, i) => { const t = L.lt + i * .15; show(g, 9 + t * 7 + i * 2, 24 + t * 6 + i, 86 + i * 3 - t * 5, 0, 1.1); g.rotation.y = PI / 2 + .6; g.userData.flap(L.T + i); });
  [CASH].length; orbit(V(14, 19, 92), lerp(34, 30, L.k), PI / 2 + .6, .12, 48); sh(V(14, 0, 92), 40); }, [[0, 'feathers', .5], [.3, 'birds', .5], [.8, 'whistle', .3]]);
// 70 «Tag acht:»
shot(91.35, 'F', 'punch', L => { dayG(L); const c = meG(L, 8); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); cara(c, L.T, { expr: 'joy' }); const h = headC(c); orbit(h.clone().add(V(0, 0, 1.5)), 15, PI / 2 - .15, .03, 46); calPop(L, 'TAG 8', 'SAMSTAG −4', h.clone().add(V(1.4, .2, 3.6)), '#3a8ad8'); sh(V(14, 0, 95), 30); }, [[0, 'pages', .5], [.1, 'impact', .5]]);
// 71 «Zum ersten Mal kam ich»: voy hacia la puerta de abajo de casa (cuello ya corto)
shot(92.11, 'W', null, L => { dayG(L); const c = put(ich, 0, 0, 0, 0); walkC(c, L.lt, 19, 91.2, -PI / 2, 3.4, L.T); hals(c, 6, { T: L.T, sway: .03 }); cara(c, L.T, { expr: 'happy' });
  const p = put(papa, 12.4, 0, 88.4, PI / 2 + .3); actuar(p, L.lt, [[0, 'cheer']], { T: L.T }); cara(p, L.T, { expr: 'joy' }); orbit(V(14, 6, 91), lerp(26, 22, L.k), PI - .55, .1, 46); sh(V(14, 0, 91), 30); }, [[0, 'steps', .5], [.5, 'steps', .5], [.9, 'cheer', .4]]);
// 71b «durch die untere Tür rein»: agacho la cabeza y entro por la puerta normal; papá aplaude
shot(93.29, 'C', 'punch', L => { dayG(L); const c = put(ich, 0, 0, 0, 0); walkC(c, L.lt, 15.4, 91.2, -PI / 2, 3.0, L.T, { crouch: .4, lean: .3 }); hals(c, 6, { T: L.T, bend: .6 }); cara(c, L.T, { expr: 'grin' });
  const p = put(papa, 12.6, 0, 87.6, PI / 2 + .4); actuar(p, L.lt, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.4 + Math.sin(L.T * 14) * .3, aRz: -.4 + Math.sin(L.T * 14) * .3, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(p, L.T, { expr: 'joy' }); confRain(V(13, 0, 90), L.T, 40, 10, 10, 12);
  orbit(V(13.5, 4.5, 90), lerp(19, 17, L.k), PI / 2 + .75, .06, 46); sh(V(13, 0, 90), 20); }, [[0, 'door_open', .5], [.3, 'confetti', .4], [.5, 'cheer', .4]]);
// 72 «Tag elf:»
shot(94.60, 'F', 'punch', L => { dayG(L); const c = meG(L, 2.2); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); cara(c, L.T, { expr: 'joy' }); const h = headC(c); orbit(h.clone().add(V(0, 0, 1.5)), 13, PI / 2 - .15, .03, 46); calPop(L, 'TAG 11', 'SAMSTAG −1', h.clone().add(V(1.2, .4, 3.2)), '#3a8ad8'); sh(V(14, 0, 95), 30); }, [[0, 'pages', .5], [.1, 'impact', .5]]);
// 73 «Ich sah meine Füße.»: miro abajo… ¡mis pies!
shot(95.34, 'W', null, L => { dayG(L); const c = meG(L, 1.6); SOCKS.forEach(s => s.visible = true); actuar(c, L.lt, [[0, { headX: .6, lean: .25, aLx: .5, aRx: .5, aLz: .5, aRz: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'gasp', eyes: 'down' }); const h = headC(c);
  cam([h.x + 4.2, h.y + 2.4, h.z + 1], [17 + Math.sin(L.T) * .1, 1.2, 93], lerp(56, 48, L.k)); sh(V(17, 0, 93), 20); }, [[0, 'gasp', .5], [.4, 'sparkle', .4]]);
// 74 «Zwei verschiedene Socken.»: primer plano de los calcetines desparejados (rayas rojas y lunares verdes), los muevo
shot(96.46, 'C', 'punch', L => { dayG(L); const c = meG(L, 1.6); SOCKS.forEach(s => s.visible = true); actuar(c, L.lt, [[0, { headX: .5, lean: .2, lLx: Math.max(0, Math.sin(L.T * 7)) * .3, lRx: Math.max(0, -Math.sin(L.T * 7)) * .3 }]], { T: L.T }); cara(c, L.T, { expr: 'joy' });
  cam([17 + lerp(7.5, 6.2, L.k), 2.4, 93 - 2.2], [17, 1.2, 93], 44); badge('tag', '2 VERSCHIEDENE', W / 2, H * .2, (L.lt - .1) * 4); sh(V(17, 0, 93), 20); }, [[0, 'cloth', .5], [.4, 'kids_laugh', .3], [.8, 'pop', .4]]);
// ---------- d: la fiesta en el sótano y el giro final (98,13 – 118,3 s) ----------
// Sótano PK (x = PKX): techo a 7, escalera en x = PKX + 15 bajando de z = -15 (y 6,5) a z = -4 (y 0,3); hueco en el techo encima de la escalera.
const stepY = z => clamp((z + 15) / 10.8) < 1 ? Math.max(0, 6.5 - (z + 15) / 1.35 * .78) : 0;
const guests = (L, mode = 'cheer') => [[K[0], -6, -8, .5], [K[1], -11, -12, .4], [K[2], 4, -9, -.4], [K[4], -9, -2, .9], [XT[2], -15, -6, .8]].forEach(([k, x, z, ry], i) => { put(k, PKX + x, 0, z, ry); actuar(k, L.lt, [[0, mode === 'cheer' ? (i % 2 ? 'cheer' : 'wave') : mode]], { T: L.T + i, extra: { hipY: 2.05 + Math.max(0, Math.sin(L.T * 9 + i)) * .2 } }); cara(k, L.T + i, { expr: 'joy' }); });
// 75 «Am Samstag bin ich die Kellertreppe»: bajo la escalera del sótano (cuello normal); abajo, la fiesta
shot(98.13, 'F', null, L => { kel(L); guests(L, 'wave'); const z = lerp(-14, -8.5, L.k); const c = put(ich, PKX + 15, stepY(z), z, 0); actuar(c, L.lt, [[0, { ...walkPose(L.lt * 1.4), lean: .05 }]], { T: L.T }); hals(c, .4, { T: L.T }); cara(c, L.T, { expr: 'happy' });
  const l = put(lina, PKX + 10, 0, -4, PI - .7); actuar(l, L.lt, [[0, 'wave']], { T: L.T }); cara(l, L.T, { expr: 'joy' }); cam([PKX + 7, 3.2, 5], [PKX + 15, 4.4, -10], 52); sh(V(PKX, 0, -6), 30); }, [[0, 'steps', .5], [.3, 'steps', .5], [.6, 'cheer', .4], [.9, 'radio', .3]]);
// 76 «runtergelaufen.»: últimos escalones, llego abajo
shot(99.57, 'W', null, L => { kel(L); guests(L); const z = lerp(-7.6, -3, L.k); const c = put(ich, PKX + 15, stepY(z), z, 0); actuar(c, L.lt, [[0, { ...walkPose(L.lt * 1.4) }]], { T: L.T }); hals(c, .4, { T: L.T }); cara(c, L.T, { expr: 'grin' });
  orbit(V(PKX + 15, 3.6, z), 13, -.75, .05, 50); sh(V(PKX, 0, -6), 30); }, [[0, 'steps', .5], [.4, 'land', .5]]);
// 77 «Mit dem ganzen Körper.»: en el centro del sótano, entero, con los brazos abiertos; confeti
shot(100.35, 'C', 'punch', L => { kel(L); guests(L); const c = put(ich, PKX + 2, 0, -1, 0); hals(c, .4, { T: L.T }); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); cara(c, L.T, { expr: 'joy' }); confetti(V(PKX + 2, 0, -1), 100.35, L.T, 50, 1); confRain(V(PKX + 2, -6, -1), L.T, 0);
  badge('green', 'GANZ!', W / 2, H * .2, (L.lt - .15) * 4, 1, .9); orbit(V(PKX + 2, 3.2, -1), lerp(15, 13, L.k), .15, .02, 50); sh(V(PKX, 0, -2), 30); }, [[0, 'party_horn', .5], [.1, 'confetti', .5], [.3, 'cheer', .5]]);
// 78 «Marvin kam auch.»: Marvin baja la escalera… pero su cuello sigue subiendo por el hueco del techo
shot(101.59, 'W', null, L => { kel(L); guests(L, 'shock'); const z = lerp(-9, -6, L.k); const m = put(marvin, PKX + 15, stepY(z), z, 0); actuar(m, L.lt, [[0, { ...walkPose(L.lt * 1.4) }]], { T: L.T }); hals(m, 16, { T: L.T, bend: -.15 }); cara(m, L.T, { expr: 'happy' });
  cam([PKX + 6, 1.0, 6], [PKX + 15, 5.4, -7], 58); sh(V(PKX, 0, -6), 30); }, [[0, 'steps', .5], [.4, 'stretch_creak', .4]]);
// 79 «Sein Kopf steckte noch in der Küche.»: arriba, en la cocina: la cabeza de Marvin asoma por la trampilla del suelo, comiéndose un pretzel
shot(102.45, 'C', 'punch', L => { use('KU'); inside(.95, 40); const m = put(marvin, KUX, -14, .5, 0); hals(m, 12.6 + Math.sin(L.T * 3) * .15, { T: L.T, sway: .06 }); applyPose(m, {}); cara(m, L.T, { expr: 'joy', mouth: Math.sin(L.T * 14) > 0 ? 'open_smile' : 'smile' }); attach(PZ[0], m.head, [0, .3, .8], [0, 0, 0], .8);
  const p = put(papa, KUX + 7, 0, -4, -.9); actuar(p, L.lt, [[0, 'shock']], { T: L.T }); cara(p, L.T, { expr: 'shock' }); orbit(headC(m).add(V(1.5, 0, 0)), lerp(14, 12, L.k), .3, .12, 46); sh(V(KUX, 0, 0), 30); }, [[0, 'chew', .6], [.4, 'gasp_old', .4], [.8, 'chew', .5]]);
// 80 «Lina sah mir in die Augen.»: los dos cara a cara, a la misma altura; luces de colores
const twoShot = (L, ex = 'love', lx = 'love') => { const c = put(ich, PKX - 2, 0, -2, PI / 2 - .35), l = put(lina, PKX + 1.4, 0, -2, -PI / 2 + .35); hals(c, .4, { T: L.T }); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); actuar(l, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: ex }); cara(l, L.T, { expr: lx }); return [c, l]; };
shot(103.81, 'Z', null, L => { kel(L); guests(L, 'idle'); const [c, l] = twoShot(L); hearts(headC(c).lerp(headC(l), .5).add(V(0, 1.4, 0)), L.T); orbit(headC(c).lerp(headC(l), .5), lerp(11.5, 10, L.k), .08, .02, 46); sh(V(PKX, 0, -2), 20); }, [[0, 'heartbeat', .5], [.6, 'sparkle', .4]]);
// 81 «Auf gleicher Höhe.»: de lado: ojos a la misma altura
shot(105.15, 'W', 'punch', L => { kel(L); guests(L, 'idle'); const [c, l] = twoShot(L); badge('tag', 'GLEICHE HÖHE', W / 2, H * .2, (L.lt - .1) * 4); hearts(headC(c).lerp(headC(l), .5).add(V(0, 1.4, 0)), L.T); orbit(V(PKX - .3, 3.4, -2), lerp(15, 13, L.k), -.3, .02, 48); sh(V(PKX, 0, -2), 20); }, [[0, 'ding_soft', .5], [.3, 'heartbeat', .4]]);
// 82 «Sie fragte:»: Lina me señala el cuello, extrañada
shot(106.27, 'C', null, L => { kel(L); guests(L, 'idle'); const [c, l] = twoShot(L, 'smile', 'confused'); actuar(l, L.lt, [[0, 'point']], { T: L.T }); orbit(headC(l), lerp(7.5, 6.5, L.k), -.9, .02, 44); sh(V(PKX, 0, -2), 20); }, [[0, 'hmm', .5]]);
// 83 «„Wo ist dein Hals?“»
shot(107.00, 'W', 'punch', L => { kel(L); guests(L, 'idle'); const [c, l] = twoShot(L, 'smile', 'talk'); actuar(l, L.lt, [[0, 'shrug']], { T: L.T }); talk(l, L.T, 107.0, 108.02, 'confused'); bubble(l, 'Wo ist dein Hals?', (L.lt - .05) * 4, 1.4);
  orbit(headC(c).lerp(headC(l), .6), lerp(10, 9, L.k), -.4, .02, 44); sh(V(PKX, 0, -2), 20); }, [[0, 'pop', .4]]);
// 84 «Ich sagte: „Weg.“»: sonrío chulo; confeti
shot(108.02, 'C', 'punch', L => { kel(L); guests(L); const [c, l] = twoShot(L, 'smug', 'joy'); actuar(c, L.lt, [[0, { aLx: .3, aRx: .3, aLz: .9, aRz: .9, aLe: 1.9, aRe: 1.9, lean: -.1 }]], { T: L.T }); talk(c, L.T, 108.02, 109.18, 'smug'); bubble(c, 'Weg.', (L.lt - .2) * 4, 1.4); confRain(V(PKX, -2, -2), L.T, 40, 12, 10, 9);
  orbit(headC(c), lerp(8, 7, L.k), .5, .02, 44); sh(V(PKX, 0, -2), 20); }, [[0, 'confetti', .4], [.2, 'cheer', .5], [.5, 'party_horn', .3]]);
// ---------- giro final: la mañana siguiente, la buhardilla ----------
const meWin = (L, expr = 'sleepy', open = 0) => { SHUT[0].rotation.y = -open * 1.5; SHUT[1].rotation.y = open * 1.5; DLIGHT.intensity = 12; const c = put(ich, 10.15, 17.3, 90, PI / 2); hals(c, .3, { T: L.T }); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr }); return c; };
const papaG = (L, expr = 'grin', look = 0) => { const p = put(papa, 17.4, 0, 90.4, -.45 + look); hals(p, 17.6, { T: L.T, sway: .02, lean: .3 }); handy(p, PH2); feed(PH2, L.T, true); actuar(p, L.lt, [[0, scrollPose]], { T: L.T }); cara(p, L.T, { expr }); return p; };
// 85 «Doch die Geschichte war noch nicht vorbei» (zoom lento): mi casa a la mañana siguiente; la buhardilla cerrada
shot(109.18, 'F', 'slow', L => { morning(L); meWin(L, 'sleepy'); orbit(DW.clone().add(V(0, -2, 0)), lerp(48, 26, easeIn(L.k)), .7, .1, 46); sh(V(12, 0, 90), 40); }, [[0, 'birds', .5], [.6, 'wind', .4], [1.4, 'heartbeat', .4]]);
// 86 «Am nächsten Morgen klopfte jemand»: yo dentro de la buhardilla me despierto de golpe: ¡toc, toc!
shot(111.02, 'C', 'punch', L => { morning(L); const c = meWin(L, L.lt > .5 ? 'gasp' : 'sleepy'); badge('huss', 'KNOCK KNOCK', W * .5, H * .2, (L.lt - .55) * 4, 1, .8); orbit(DW.clone().add(V(-1, -.2, 0)), lerp(9, 8, L.k), PI / 2 + .25, .02, 44); sh(V(12, 0, 90), 20); }, [[0, 'yawn_m', .3], [.6, 'knock', .8], [.9, 'knock', .8]]);
// 87 «an mein Dachfenster»: una cabeza golpea el cristal desde fuera (de espaldas: no se sabe quién es)
shot(112.22, 'W', null, L => { morning(L); meWin(L, 'scared'); const p = put(papa, 14.2, 0, 89.6, -PI / 2 + .05); hals(p, 17.6, { T: L.T, sway: .01, lean: 0, bend: .32 + Math.max(0, Math.sin(L.lt * 14)) * .06 }); applyPose(p, {}); cara(p, L.T, { expr: 'grin' });
  cam([19, 24.4, 93.8], [10.8, 22, 90], 44); sh(V(12, 0, 90), 20); }, [[.1, 'knock', .8], [.33, 'knock', .8], [.56, 'knock', .8]]);
// 88 «Es war Papa.»: ¡es papá! con el cuello larguísimo, sonriendo
shot(113.42, 'Z', 'punch', L => { morning(L); meWin(L, 'shock', 1); const p = papaG(L, 'grin', .25); orbit(headC(p), lerp(10, 8.5, L.k), .45, .04, 44); sh(V(14, 0, 90), 30); }, [[0, 'braam_short', .5], [.2, 'laugh_deep', .4]]);
// 89 «Mit dem Handy in der Hand.»: la cámara baja por su cuello hasta el móvil: está viendo «In dieser Stadt»
shot(114.37, 'S', null, L => { morning(L); meWin(L, 'shock', 1); const p = papaG(L, 'grin'); const ph = wpos(PH2), h = headC(p), q = easeInOut(L.k); const t = h.clone().lerp(ph, q); cam([t.x + 7, t.y + 1, t.z + 6], [t.x, t.y, t.z], 46); sh(V(14, 0, 90), 30); }, [[0, 'whoosh_down', .5], [.6, 'notif', .5]]);
// 90 «Er sagte: „Großer …»: papá me habla desde fuera; yo en la ventana abierta
shot(115.30, 'C', 'punch', L => { morning(L); const c = meWin(L, 'shock', 1); const p = papaG(L, 'talk', .1); talk(p, L.T, 115.3, 116.67, 'happy'); bubble(p, 'Großer …', (L.lt - .6) * 4);
  orbit(headC(p).lerp(headC(c), .45), 12, .55, .05, 44); sh(V(12, 0, 90), 30); }, [[0, 'laugh_m', .3]]);
// 91 «gib mal die Brezel.»: plano general: papá con su cuello de jirafa pidiendo el pretzel; yo con la mano en la cara; las gaviotas vuelven
shot(116.67, 'W', null, L => { morning(L); const c = meWin(L, 'worried', 1); actuar(c, L.lt, [[0, 'facepalm']], { T: L.T }); const p = papaG(L, 'grin', .1); talk(p, L.T, 116.67, 117.6, 'happy'); bubble(p, '… gib mal die Brezel!', (L.lt - .05) * 4);
  GULLS.forEach((g, i) => { const a = L.T * 1.6 + i * 1.57; show(g, 13 + Math.cos(a) * 7, 29 + Math.sin(L.T * 2 + i) * 1.2, 90 + Math.sin(a) * 7, 0, 1); g.rotation.y = -a; g.userData.flap(L.T + i); });
  orbit(V(13, 19, 90), lerp(30, 40, easeOut(L.k)), .6, .1, 46); sh(V(13, 0, 90), 40); }, [[0, 'laugh_deep', .4], [.3, 'birds', .5], [.8, 'feathers', .4]]);


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
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.5; grade.uniforms.lift.value = .01; }
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
  if (THERM) octx.filter = 'contrast(1.5) saturate(2.4) hue-rotate(190deg) brightness(1.1)';
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { renderer, composer, bloom, sun, grade, scene, camera };

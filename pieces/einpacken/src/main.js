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

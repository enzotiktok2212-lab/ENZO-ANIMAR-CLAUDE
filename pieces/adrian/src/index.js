// ADRIAN — «In dieser Stadt heißt jeder Adrian»: el único que no se llama Adrian (Müller) atrapa al ladrón que se hacía pasar por Adrian. 1080×1920, 30 fps.
// Réplica de la estructura del vídeo de referencia con otra ciudad (Adriansfelde: plaza de entramado, colegio, Freibad, Stadtfest), otro reparto y otros datos.
// Planos en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT } from './props.js';
import { makePapa } from './gvolk.js';
import { hufenbach, townhouse } from './gort.js';
import { klasse } from './svsets.js';
import { polizei } from './gsets.js';
import { dackel } from './esets.js';
import { bunting } from './wsets.js';
import { makeExtra } from './ecast.js';
import { makeMueller, makeMamaA, makeLehrerin, makeBruder, makePolizist, makeDetlef, makeMutter, makeKidX, nameTag } from './acast.js';
import { welcomeSign, doghouse, attendance, oldLists, niemandSign, bike, bikeRack, brokenLock, notebook, tele, freibad, stage, stand, lieferwagen, frontDoor, ruleBoard, urne, glowM, dynPlane, txt } from './asets.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 133.9, U = W / 720;
const stage_ = document.getElementById('stage'); const renderer = makeRenderer(stage_); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage_.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0006);
const SS = +(new URLSearchParams(location.search).get('ss') ?? 1.5); renderer.setPixelRatio(SS); renderer.setSize(W, H);   // supermuestreo: se renderiza a SS× y se reduce al dibujar
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false; composer.setSize(W, H); grade.uniforms.px.value.set(1 / (W * SS), 1 / (H * SS));
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds?.forEach(c => c.visible = false); if (sky.moon) sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 3; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
// Adriansfelde (x = 0, Hufenbach rehecho): plaza x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (-6, -92); fuente (-18, -24); café (36, -40); casa familiar (4, 96).
// Klasse (KX = 600): pizarra en z = -15.5, pupitres 3×3 en x ∈ {-11, 0, 11}, z ∈ {-2, 6, 14} (sillas en z + 2.8), mesa de la profesora (-8, -10).
// Freibad (FX = 1800): agua 44×24 centrada (FX, -.15, 0); tumbonas al norte (z ≈ -19); kiosco (FX+24, z = 24); socorrista (FX, z = 15).
// Calle de noche (NX = 1500): puertas en z = 0 mirando +z, x = NX-20, NX, NX+20.
const KX = 600, FX = 1800, NX = 1500, PI_ = Math.PI;
const HB = hufenbach(scene), KL = klasse(scene, KX), FB = freibad(scene, FX);
const NIGHT = new THREE.Group(); scene.add(NIGHT);
// la clase: suelo alargado y pared del fondo (z = 20) con puerta, percheros y dibujos de los niños
{ const fl = KL.g.children[0]; const ext = fl.clone(); ext.position.set(0, -.2, 18); ext.scale.set(1, 1, 8 / 32); KL.g.add(ext);
  const wall = KL.g.children[1].clone(); wall.position.set(0, 10, 20); KL.g.add(wall); for (const s of [-1, 1]) { const sw = KL.g.children[2].clone(); sw.position.set(s * 20, 10, 18); sw.scale.set(1, 1, 4 / 32); KL.g.add(sw); }
  const cl = box(40, .4, 8, mat(0xf4f0e8), 0, KL.g, 0, 20, 18);
  box(6, 11, .3, mat(0x8a5a2a, { roughness: .5 }), .1, KL.g, 13, 5.5, 19.8); sphere(.3, mat(0xd9a531, { metalness: .8 }), KL.g, 10.8, 5.5, 19.5, 8, 6);
  for (let k = 0; k < 6; k++) { const d = textPlane(3.2, 2.6, 160, 130, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = ['#ffd23f', '#3ab8ff', '#ff8ad0', '#8ad84a', '#ff8a3a', '#b88aff'][k]; c.beginPath(); c.arc(50 + k * 8, 60, 30, 0, 7); c.fill(); c.fillStyle = '#2a8a3a'; c.fillRect(0, 100, w, 30); txt(c, ['Mama', 'Hund', 'Haus', 'Sonne', 'Papa', 'Ich'][k], w * .7, 30, 26, '#3a3a5a'); }); d.position.set(-15 + k * 4.4, 11, 19.75); d.rotation.y = PI_; d.material.transparent = false; KL.g.add(d); }
  for (let k = 0; k < 8; k++) { box(.3, .3, .8, mat(0xb8bcc4, { metalness: .7 }), .05, KL.g, -16 + k * 3, 6.5, 19.4); box(1.4, 2.4, .6, mat([0xd8323a, 0x2a6ad8, 0xffd23f, 0x2ab86a][k % 4], { roughness: .8 }), .2, KL.g, -16 + k * 3, 5.0, 19.2); } }
const SETS = { HB: HB.G, KL: KL.g, FB: FB.g, NS: NIGHT };
[HB.RANK, HB.KINO, HB.BOX, HB.PRICE, HB.TS].forEach(o => o && (o.visible = false));
// relleno del pueblo
townhouse(HB.G, -64, -21, 13, 3, 61, Math.PI / 2); townhouse(HB.G, -64, -34.5, 13, 2, 62, Math.PI / 2);
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3), 70 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 80 + i, Math.PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 90 + i, -Math.PI / 2); }
for (let i = 0, x = -60; x <= 60; x += 18, i++) townhouse(HB.G, x, 150, 16, 2 + (i % 2), 100 + i, Math.PI);
// cartel de bienvenida en la entrada (carretera, mirando al sur +z)
const WS = welcomeSign(HB.G); WS.position.set(12, 0, 240); WS.rotation.y = .25;
// casita del perro junto a la casa familiar
const DH = doghouse(HB.G); DH.position.set(18, 0, 112); DH.rotation.y = -.5;
// escenario del Stadtfest (plaza norte, mirando al sur) + puestos y guirnaldas
const ST = stage(HB.G, -6, -58); scene.add(ST.mic); outline(ST.mic, 1.8);
const FEST = new THREE.Group(); HB.G.add(FEST);
for (let k = 0; k < 5; k++) bunting(FEST, [-54, 16 + (k % 2) * 2, -50 + k * 22], [44, 17, -42 + k * 22], 34, 2.2);
const BULBS = []; for (let k = 0; k < 3; k++) for (let i = 0; i < 26; i++) { const x = -50 + i * 3.8, z = -36 + k * 24; BULBS.push(sphere(.3, glowM([0xffd23f, 0xff4a8a, 0x3ab8ff, 0x8ad84a][(i + k) % 4], 2.2), FEST, x, 19 - Math.sin(i / 25 * Math.PI) * 3, z, 8, 6)); }
stand(FEST, -40, -30, Math.PI / 2, 'BRATWURST 3 €', '#d8202f'); stand(FEST, 36, -14, -Math.PI / 2, 'BREZELN', '#2a6ad8'); stand(FEST, -40, 4, Math.PI / 2, 'EIS', '#ff5a85');
outline(FEST, 1.8);
const RB = ruleBoard(HB.G); RB.position.set(-6, 0, -66); RB.visible = false; const URN = urne(HB.G); URN.position.set(2, 0, -62); URN.visible = false;
// coche de policía en la plaza
const PCAR = polizei(HB.G); PCAR.position.set(30, 0, 20); PCAR.rotation.y = -.6;
// aparcabicis junto a la panadería
const RACK = bikeRack(HB.G, 6); RACK.position.set(-47, 0, 6); RACK.rotation.y = Math.PI / 2;
// calle de noche
const DOORS = [0, 1, 2].map(i => frontDoor(NIGHT, NX - 20 + i * 20, 0, 0, i + 1, 12 + i * 2));
{ const st = new THREE.Mesh(new THREE.PlaneGeometry(200, 120), mat(0x4a4e5a, { roughness: .9 })); st.rotation.x = -Math.PI / 2; st.position.set(NX, 0, 30); st.receiveShadow = true; NIGHT.add(st);
  const sw = box(80, .5, 8, mat(0x8a8a90, { roughness: .9 }), .05, NIGHT, NX, .25, 4); for (let i = 0; i < 6; i++) townhouse(NIGHT, NX - 52 + i * 21, -12, 18, 2, 110 + i, 0); }
for (const k in SETS) outline(SETS[k], 2.2);
// más detalle: adoquines más finos, ayuntamiento de arenisca con tejado azul pizarra
HB.G.traverse(o => { if (o.isMesh && o.geometry.type === 'PlaneGeometry' && o.geometry.parameters.width === 112 && o.material.map) { o.material.map = o.material.map.clone(); o.material.map.repeat.set(56, 90); o.material.map.needsUpdate = true; } });
if (HB.RH) HB.RH.traverse(o => { if (o.isMesh && o.material && o.material.color && !o.userData.isOutline) { const c = o.material.color; if (Math.abs(c.r - c.g) < .06 && Math.abs(c.g - c.b) < .06 && c.r > .45) { o.material = o.material.clone(); o.material.color.setRGB(c.r * .98, c.g * .9, c.b * .76); } } });
// ---------- reparto ----------
const me = makeMueller(scene), mama = makeMamaA(scene), papa = makePapa(scene), lehr = makeLehrerin(scene), bru = makeBruder(scene), pol = makePolizist(scene), det = makeDetlef(scene), mut = makeMutter(scene);
kitFace(me, 'kid'); kitFace(mama, 'girl'); kitFace(papa, 'mustache'); kitFace(lehr, 'girl'); kitFace(bru, 'kid'); kitFace(pol, 'mustache'); kitFace(det, 'mustache'); kitFace(mut, 'girl');
const EX = Array.from({ length: 24 }, (_, i) => makeExtra(scene, i)); EX.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'girl', 'mustache', 'girl'][i % 6]));
const KIDS = Array.from({ length: 14 }, (_, i) => makeKidX(scene, i)); KIDS.forEach((c, i) => kitFace(c, ['kid', 'girl', 'kid', 'hero', 'girl', 'kid'][i % 6]));
const MAIN = [me, mama, papa, lehr, bru, pol, det, mut];
const POOL = [...MAIN, ...EX, ...KIDS];
POOL.forEach(c => { outline(c.root, 3); nameTag(c, 'ADRIAN'); });
const CROWD = [...EX, ...KIDS];
// ---------- atrezo ----------
const DOG = dackel(scene); outline(DOG, 1.8);
const ATT = attendance(scene); outline(ATT, 1.8); const OLD = oldLists(scene);
const NSIGN = niemandSign(scene); outline(NSIGN, 1.8);
const BIKES = [bike(scene, 0x2ab86a, .62, { basket: true, bell: true, streamers: true }), bike(scene, 0xd8323a), bike(scene, 0x2a6ad8), bike(scene, 0xff8a3a), bike(scene, 0x6a3ad8), bike(scene, 0xf4f4f4)]; BIKES.forEach(b => outline(b, 1.8));
const LAPS = Array.from({ length: 5 }, (_, i) => notebook(scene, [0x9aa0aa, 0x2a2a30, 0xd8c8b0, 0x9aa0aa, 0x5a6a8a][i])); LAPS.forEach(l => outline(l, 1.8));
const TVS = [tele(scene), tele(scene)]; TVS.forEach(t => outline(t, 1.8));
const LOCKS = Array.from({ length: 4 }, () => brokenLock(scene));
const VAN = lieferwagen(scene); outline(VAN, 1.8);
const SUIT = (() => { const g = new THREE.Group(); scene.add(g); box(2.4, 1.8, .9, mat(0x8a3a1a, { roughness: .6 }), .15, g, 0, 1.1, 0); box(.9, .3, .2, mat(0x2a1a10), .05, g, 0, 2.1, 0); for (const s of [-1, 1]) box(.12, 1.82, .92, mat(0xd8a050, { metalness: .5 }), .02, g, s * .7, 1.1, 0); outline(g, 1.8); return g; })();
const PHOTO = (() => { const g = new THREE.Group(); scene.add(g); box(2.2, 2.7, .15, mat(0xd8a050, { metalness: .4, roughness: .4 }), .05, g, 0, 0, 0);
  const p = textPlane(1.8, 2.3, 180, 230, (c, w, h) => { c.fillStyle = '#bfe4ff'; c.fillRect(0, 0, w, h); c.fillStyle = '#f2c6a2'; c.beginPath(); c.arc(w / 2, h * .48, 52, 0, 7); c.fill(); c.fillStyle = '#1a120c'; for (let k = 0; k < 9; k++) { c.beginPath(); c.arc(w / 2 - 44 + k * 11, h * .3 + Math.abs(k - 4) * 3, 12, 0, 7); c.fill(); }
    c.fillStyle = '#1a1a1a'; c.fillRect(w / 2 - 22, h * .46, 8, 8); c.fillRect(w / 2 + 14, h * .46, 8, 8); c.strokeStyle = '#1a1a1a'; c.lineWidth = 4; c.beginPath(); c.arc(w / 2, h * .56, 12, .2, 2.9); c.stroke(); c.fillStyle = '#1ab8b8'; c.fillRect(w / 2 - 56, h * .72, 112, 70); txt(c, 'Baby 2015', w / 2, h * .93, 22, '#3a3a5a'); });
  p.position.z = .09; p.material.transparent = false; g.add(p); outline(g, 1.8); return g; })();
const MEGA = (() => { const g = new THREE.Group(); scene.add(g); const m = new THREE.Mesh(new THREE.CylinderGeometry(.18, .6, 1.4, 14, 1, true), mat(0xffffff, { side: THREE.DoubleSide, roughness: .4 })); m.rotation.x = Math.PI / 2; g.add(m); cyl(.6, .6, .1, mat(0xd8323a), 14, g, 0, 0, .7).rotation.x = Math.PI / 2; box(.2, .6, .2, mat(0x2a2a30), .05, g, 0, -.4, -.3); outline(g, 1.8); return g; })();
const NOTEPAD = (() => { const g = new THREE.Group(); scene.add(g); box(.9, 1.2, .08, mat(0xffffff), .02, g, 0, 0, 0); box(.9, .14, .12, mat(0x2a4ab8), .02, g, 0, .6, 0); for (let k = 0; k < 4; k++) box(.6, .04, .02, mat(0x8a8aa0), 0, g, 0, .3 - k * .2, .05); return g; })();
const ICE = (() => { const g = new THREE.Group(); scene.add(g); const c = new THREE.Mesh(new THREE.ConeGeometry(.22, .8, 10), mat(0xd8a050)); c.rotation.x = Math.PI; g.add(c); sphere(.3, mat(0xff8ad0), g, 0, .48, 0, 10, 8); sphere(.26, mat(0xfff2d8), g, 0, .8, 0, 10, 8); return g; })();
const TAGBIG = (() => { const g = new THREE.Group(); scene.add(g); const P = dynPlane(3.2, 2.2, 320, 220); g.add(P); box(3.3, 2.3, .06, mat(0xffffff), .05, g, 0, 0, -.05);
  g.userData.set = (n, strike = false) => P.userData.draw(n + strike, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8202f'; c.fillRect(0, 0, w, 92); txt(c, 'HALLO', w / 2, 32, 50, '#ffffff'); txt(c, 'ich heiße', w / 2, 72, 24, '#ffffff'); let f = 76; while (f > 30) { c.font = `700 ${f}px Cap`; if (c.measureText(n).width < w - 30) break; f -= 4; } txt(c, n, w / 2, 158, f, '#16161e'); if (strike) { c.strokeStyle = '#d8202f'; c.lineWidth = 12; c.beginPath(); c.moveTo(20, 200); c.lineTo(w - 20, 110); c.stroke(); } }); g.userData.set('ADRIAN'); return g; })();
const CRATE = (() => { const g = new THREE.Group(); scene.add(g); box(3, 1.2, 3, mat(0x9a6a3a, { roughness: .8 }), .1, g, 0, .6, 0); for (const s_ of [-1, 1]) box(3.04, .2, .2, mat(0x6a4422), .02, g, 0, .6, s_ * 1.42); outline(g, 1.8); return g; })();
const PEN = (() => { const g = new THREE.Group(); scene.add(g); cyl(.08, .08, 1.1, mat(0x1a1a1a), 8, g, 0, 0, 0); cyl(.09, .09, .3, mat(0xd8202f), 8, g, 0, .45, 0); return g; })();
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const FW = Array.from({ length: 60 }, (_, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(.5, 6, 4), new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL((i % 6) / 6, 1, .6).multiplyScalar(1.6), toneMapped: false })); scene.add(s); return s; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 2 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const HEARTS = Array.from({ length: 5 }, () => { const p = textPlane(1.2, 1.2, 64, 64, (c, w, h) => { c.fillStyle = '#ff3a6a'; c.beginPath(); c.moveTo(32, 54); c.bezierCurveTo(0, 30, 8, 4, 32, 18); c.bezierCurveTo(56, 4, 64, 30, 32, 54); c.fill(); }); p.material.depthWrite = false; scene.add(p); return p; });
const SPLASH = Array.from({ length: 20 }, () => sphere(.25, new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x8fd8ff, emissiveIntensity: .6, transparent: true, opacity: .85 }), scene, 0, 0, 0, 8, 6));
const RING = (() => { const r = new THREE.Mesh(new THREE.TorusGeometry(3, .18, 8, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .6, depthWrite: false })); r.rotation.x = Math.PI / 2; scene.add(r); return r; })();
const ZZ = textPlane(2, 2, 96, 96, (c, w, h) => txt(c, 'Z', w / 2, h / 2, 80, '#ffffff', '#1a1a3a', 10)); scene.add(ZZ); ZZ.material.depthWrite = false;

const PROPS = [DOG, ATT, OLD, NSIGN, ...BIKES, ...LAPS, ...TVS, ...LOCKS, VAN, SUIT, PHOTO, MEGA, NOTEPAD, CRATE, ICE, TAGBIG, PEN, ST.mic, ...CONF, ...FW, ...DUST, ...SWEAT, ...TEAR, ...HEARTS, ...SPLASH, RING, ZZ];
// ---------- ambiente ----------
const AIR = aire(scene, 220); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .96; setSky([.16, .46, .98], [.42, .7, 1], [.8, .92, 1]); if (sky.moon) sky.moon.visible = false; hemi.intensity = .95; hemi.color.setRGB(.9, .95, 1); hemi.groundColor.setRGB(.5, .56, .4); sun.intensity = 2.9; sun.color.setRGB(1, .96, .88); rim.intensity = .9;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0006; bloom.strength = .08; bloom.threshold = .95; FILL.intensity = 0; }
function sunset() { MODE = 'dusk'; renderer.toneMappingExposure = 1.0; setSky([.16, .2, .55], [.72, .42, .55], [1, .62, .36]); hemi.intensity = 1.1; hemi.color.setRGB(1, .86, .8); hemi.groundColor.setRGB(.45, .38, .4); sun.intensity = 2.0; sun.color.setRGB(1, .72, .48); rim.intensity = 1.4;
  scene.fog.color.setRGB(.9, .66, .55); scene.fog.density = .0006; bloom.strength = .14; bloom.threshold = .9; FILL.intensity = 30; BIRDSON = 0; }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.08; setSky([.04, .05, .2], [.12, .12, .38], [.3, .22, .48]); if (sky.moon) { sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); } hemi.intensity = 1.2; hemi.color.setRGB(.7, .76, 1); hemi.groundColor.setRGB(.34, .3, .42); sun.intensity = 1.1; sun.color.setRGB(.76, .78, 1); rim.intensity = 1.6;
  scene.fog.color.setRGB(.12, .12, .3); scene.fog.density = .0008; bloom.strength = .18; bloom.threshold = .88; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .08; bloom.threshold = .95; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.setTag(c === me ? null : 'ADRIAN'); }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  VAN.userData.setOpen(0); DOORS.forEach(d => d.userData.setOpen(0)); WS.userData.set('Adrians'); RB.visible = false; URN.visible = false; RB.userData.set(0); ATT.userData.set(7, false);
  for (const k in SETS) SETS[k].visible = false; FEST.visible = false; ST.g.visible = false; PCAR.visible = true; PCAR.position.set(30, 0, 20); PCAR.rotation.y = -.6;
  FILL.color.setRGB(1, .96, .91); grade.uniforms.vig.value = .42; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.42; grade.uniforms.sharp.value = 1.6; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; day(); }
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
// primer plano frontal a la cara según su ry (dist en «cabezas»; side desplaza en lateral)
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { dist *= 1.45; if (dist2 != null) dist2 *= 1.45; const s = ch.spec.scale || 1; const h = hp(ch).add(V(0, .6 * s, 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .85, easeInOut(k)) * Math.max(.75, s);
  cam([h.x + fx * d + fz * side, h.y + .6 * s + dy, h.z + fz * d - fx * side], [h.x, h.y - .9 * s, h.z], fov); }
// plano medio/entero de un personaje: cámara delante (yaw relativo a su ry), centro a la altura del pecho
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null) { const s = ch.spec.scale || 1, p = ch.root.position, c = V(p.x, 3.3 * s, p.z); const q = easeInOut(clamp(k)); orbit(c, lerp(dist, dist2 ?? dist * .88, q) * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function ojos(expr, T, sd) { const n = Math.sin(T * .9 + sd) * .55 + Math.sin(T * 2.3 + sd * 2.1) * .45;
  switch (expr) {
    case 'neutral': case 'talk': case undefined: return n > .25 ? 'half' : n < -.55 ? (sd % 2 ? 'side_l' : 'side_r') : 'normal';
    case 'sad': return n > -.1 ? 'worried' : 'down';
    case 'happy': case 'smile': case 'relief': case 'joy': return n > -.3 ? 'happy' : 'normal';
    case 'worried': return n > .45 ? 'side_l' : 'worried';
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
const tears = (ch, T) => { const h = hp(ch), s = ch.spec.scale || 1, a = ch.root.rotation.y; for (let i = 0; i < 2; i++) { const k = (T * 1.1 + i * .5) % 1; TEAR[i].visible = true; const lx = (i ? -.3 : .3) * s, lz = .72 * s; TEAR[i].position.copy(h).add(V(Math.cos(a) * lx + Math.sin(a) * lz, (.75 - k * 1.1) * s, -Math.sin(a) * lx + Math.cos(a) * lz)); TEAR[i].scale.setScalar(s * 1.2); } };
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
function fireworks(c, T, n = 3, R = 14) { FW.forEach((s, i) => { const b = i % n, k = Math.floor(i / n), per = 1.6, t = ((T + b * .53) % per) / per, r0 = RNG(b * 17 + Math.floor((T + b * .53) / per) * 31); const cx = c.x + (r0() - .5) * 60, cy = c.y + 30 + r0() * 20, cz = c.z + (r0() - .5) * 20;
  const a = k / (FW.length / n) * 6.283, el = Math.sin(k * 2.3) * .8; s.visible = t > .25; const e = easeOut((t - .25) / .75) * R; s.position.set(cx + Math.cos(a) * Math.cos(el) * e, cy + Math.sin(el) * e - t * t * 4, cz + Math.sin(a) * Math.cos(el) * e); s.scale.setScalar(1 - t * .8); s.material.color.setHSL((b * .27 + .05) % 1, 1, .6).multiplyScalar(1.6); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.5 + t * 1.4) * s * (.8 + r() * .5)); d.material.opacity = .4 * (1 - t / 1.2); }); }
function hearts(p, T) { HEARTS.forEach((z, i) => { const k = (T * .6 + i / 5) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 1.7 + T) * 1.6, p.y + k * 3.4, p.z + .4); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
function splash(c, T0, T, s = 1) { SPLASH.forEach((d, i) => { const t = T - T0; if (t < 0 || t > 1.1) return; d.visible = true; const a = i * 2.399, v = (2 + (i % 5)) * s; d.position.set(c.x + Math.cos(a) * v * t * .7, c.y + v * 1.8 * t - 9.8 * t * t, c.z + Math.sin(a) * v * t * .7); d.scale.setScalar(s); }); }
function ring(c, T0, T, R = 12) { const t = T - T0; if (t < 0 || t > .7) return; RING.visible = true; RING.position.copy(c); RING.scale.setScalar(.3 + t / .7 * R / 3); RING.material.opacity = .7 * (1 - t / .7); RING.lookAt(camera.position); }

// ---------- multitudes (solo extras Roblox reales: EX adultos + KIDS niños) ----------
// gente alrededor de (cx, cz) en un arco por detrás del sujeto según la cámara (nunca entre la cámara y el sujeto).
// o.mode: 'idle' | 'wave' | 'cheer' | 'shout' | 'laugh' | 'shrug' | 'walk' | 'point' | 'turn' (de espaldas → se giran en o.turnAt) | 'back' (de espaldas, mirando a o.face) | 'clap'
// o.list: lista de personajes; o.face: punto al que miran (por defecto la cámara); o.tag: nombre en la placa
function crowdAt(L, cx, cz, n, r0, r1, seed = 1, o = {}) { const list = (o.list || CROWD).slice(o.from || 0, (o.from || 0) + n); POST.push(() => { const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.2), ac + 6.283 - (o.gap ?? 1.2)];
  const placed = [];
  list.forEach((c, i) => { let x, z, tries = 0; do { const a = arc[0] + (i + r() * .8) / list.length * (arc[1] - arc[0]); const d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; tries++; } while (tries < 8 && placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 3.4));
    placed.push([x, z]); crowdGuy(c, x, z, L, i, o); }); }); }
// multitud en rejilla delante de un punto (para planos del público): filas en z, mirando a o.face
function crowdGrid(L, x0, z0, cols, rows, dx, dz, o = {}) { const list = (o.list || CROWD).slice(o.from || 0); let i = 0; const r = RNG(o.seed || 3);
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) { const c = list[i]; if (!c) return; const x = x0 + (col - (cols - 1) / 2) * dx + (row % 2) * dx * .5 + (r() - .5) * .8, z = z0 + row * dz + (r() - .5) * .8; if (o.skip && o.skip(x, z)) { i++; continue; } crowdGuy(c, x, z, L, i, o); i++; } }
function crowdGuy(c, x, z, L, i, o) { const T = L.T + i * .37, face = o.face || camera.position; let ry = Math.atan2(face.x - x, face.z - z) + Math.sin(i * 7.3) * (o.jit ?? .35);
  if (o.mode === 'turn' || o.mode === 'back') { const back = ry + Math.PI + Math.sin(i * 3.1) * .3; const tt = o.turnAt != null ? clamp((L.T - o.turnAt - (i % 5) * .03) / .22) : 0; ry = o.mode === 'back' ? back : lerp(back, ry, easeOut(tt)); }
  put(c, x, 0, z, ry); if (o.tag !== undefined) c.setTag(o.tag); const m = o.mode;
  if (m === 'walk') { actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); cara(c, T, { expr: o.expr || 'happy' }); }
  else if (m === 'wave') { actuar(c, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9 + i) * .35, aRe: .5, aLx: .2 }]], { T: L.T }); cara(c, T, { expr: 'happy', mouth: 'open_smile' }); }
  else if (m === 'cheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); c.root.position.y = j * .45 * (c.spec.scale || 1); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3, crouch: .05 + j * .08 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'clap') { const j = Math.abs(Math.sin(L.T * 11 + i)); actuar(c, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.2 - j * .35, aRz: -.2 - j * .35, aLe: 1.0, aRe: 1.0 }]], { T: L.T }); cara(c, T, { expr: 'joy', mouth: 'open_smile' }); }
  else if (m === 'shout') { actuar(c, 0, [[0, { aLx: 2.0, aRx: 2.0, aLz: .9, aRz: .9, aLe: 1.6, aRe: 1.6, lean: -.08, headX: -.15 }]], { T: L.T }); cara(c, T, { expr: 'shout', mouth: 'talk_wide' }); }
  else if (m === 'laugh') { actuar(c, 0, [[0, { aLx: .4, aRx: .9, aLz: -.4, aRz: .2, aRe: 1.5, lean: -.1 + Math.sin(L.T * 14 + i) * .05 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'shrug') { actuar(c, 0, [[0, GEST.shrug]], { T: L.T }); cara(c, T, { expr: 'confused' }); }
  else if (m === 'point') { actuar(c, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: .5, aLz: -.6, aLe: 1.5, lean: -.08 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'turn' || m === 'back') { const tt = o.turnAt != null ? clamp((L.T - o.turnAt) / .25) : 0; actuar(c, 0, [[0, { headX: -.05, aLx: .15, aRx: .15 }]], { T: L.T }); cara(c, T, { expr: tt > .3 ? (o.expr || 'happy') : 'neutral', mouth: tt > .3 ? (o.mouth || 'open_smile') : undefined }); }
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'happy', mouth: o.mouth }); } }
const walkP = (T, i, sp = 9) => { const p = Math.sin(T * sp + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
// andar: avanza en dirección ry a velocidad v desde (x0, z0)
function walkTo(c, x0, z0, ry, v, L, i = 0, sp = 9) { const d = v * L.lt; put(c, x0 + Math.sin(ry) * d, Math.abs(Math.sin(L.T * sp + i)) * .12 * (c.spec.scale || 1), z0 + Math.cos(ry) * d, ry); actuar(c, 0, [[0, walkP(L.T, i, sp)]], { T: L.T }); return c; }
// ---------- escenarios por plano ----------
function town(L, o = {}) { use('HB'); if (o.dusk) sunset(); else if (o.night) night(45); else day(); if (o.fest) { FEST.visible = true; ST.g.visible = true; BULBS.forEach((b, i) => b.material.emissiveIntensity = (o.dusk ? 2.4 : 1.2) + Math.sin(L.T * 5 + i * .7) * .8); } }
function school(L) { use('KL'); inside(.95, 26); KL.BB.userData.draw('frau', (c, w, h) => { c.fillStyle = '#1e3a2a'; c.fillRect(0, 0, w, h); txt(c, 'Frau', w / 2, h * .24, 96, '#ffffff'); txt(c, 'Adrian', w / 2, h * .56, 110, '#ffffff'); txt(c, 'Klasse 5b', w / 2, h * .86, 54, '#ffd23f'); }); }
function pool(L) { use('FB'); day(); FB.wtex.offset.set(L.T * .02, L.T * .015); }
function nightStreet(L) { use('NS'); night(30); DOORS.forEach(d => d.userData.bulb.material.emissiveIntensity = 2.2); }
// niños en los pupitres de la clase (todos con placa ADRIAN), sentados
function classKids(L, o = {}) { const seats = []; for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) seats.push([KX - 11 + q * 11, -2 + r * 8 + 2.6]); const skip = o.skip ?? 1;
  seats.forEach(([x, z], i) => { if (i === skip) return; const c = KIDS[i]; put(c, x, sitY(c), z, Math.PI); c.root.rotation.y = Math.PI + (o.face ? faceTo(V(x, 0, z), o.face) - Math.PI : 0);
    const up = o.hands != null ? clamp((L.T - o.hands - (i % 4) * .05) / .2) : 0; actuar(c, 0, [[0, { lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aRx: lerp(.6, 3.0, easeOut(up)), aRz: .1, aRe: lerp(1.2, .1, up), aLx: .7, aLe: 1.2, headX: .05 }]], { T: L.T });
    if (o.shout && up > .5) cara(c, L.T + i, { expr: 'happy', mouth: 'talk_wide' }); else cara(c, L.T + i, { expr: o.expr || 'happy' }); });
  return seats[skip]; }
const sitY = (c, seat = 2.45) => seat + .1 - 2.05 * (c.spec.scale || 1);
const seatPose = (extra = {}) => ({ lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, ...extra });

// ---------- capa 2D ----------
const BAD_ = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD_.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD_.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD_.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; if (x < -60 || x > W + 60) return; b.x = clamp(x, 220, W - 220); b.y = clamp(y, 160, H * .6); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num' || b.kind === 'green' || b.kind === 'gold') { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : b.kind === 'green' ? '#04300e' : b.kind === 'gold' ? '#3a2400' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#8aff9a'); g.addColorStop(1, '#1ab84a'); } else if (b.kind === 'gold') { g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a820'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 46px ${FONT}`; const w = Math.max(170, c.measureText(b.text).width + 64); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -46, w, 92, 38); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 44); c.lineTo(10, 44); c.lineTo(-24, 80); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'q') { c.font = `700 130px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  c.restore(); }
const KEY = /^(Stadt|Adrian|Adrians|Mama|Papa|Lehrerin|Frau|Hund|Namen|Klasse|Hier|außer|Außer|mir|vier|Jahren|abwesend|Müller|Einzige|niemand|Niemand|Bruder|Fremder|Hallo|jubelte|Familie|Nacht|Tür|rein|Fahrräder|Laptops|weg|Fahrrad|geklaut|versprochen|zurückhole|Polizist|Ihnen|Antwort|Welcher|Freibad|Mutter|gehen|Köpfe|meinem|gesehen|Neue|nicht|ohne|nachzudenken|echter|getan|reinlassen|gelacht|zeigen|Stadtfest|Marktplatz|Mikrofon|schrie|Dreitausend|Neuen|packte|wirklich|Detlef|Lieferwagen|alles|Laptop|Spitznamen|Regel|anderen|Dieb|verstecken|gewählt|ändern)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–!?]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0;
// ---------- a: gancho, la clase, «Niemand», mi hermano (0 – 35,41 s) ----------
const HOUSE = V(14.5, 0, 91.3);          // delante de la puerta de la casa familiar (mira a +x)
const DOGP = V(16.3, 0, 115.1);          // delante de la caseta (mira a ry = -.5)
const wag = (T) => { DOG.rotation.y += Math.sin(T * 14) * .08; DOG.position.y = Math.abs(Math.sin(T * 7)) * .15; };
const seatOf = i => V(KX - 11 + (i % 3) * 11, 0, -2 + Math.floor(i / 3) * 8 + 2.6);
const meSeat = (L, pose = {}, face = {}) => { const s = seatOf(1); put(me, s.x, sitY(me), s.z, PI); actuar(me, 0, [[0, seatPose({ aLx: .9, aRx: .9, aLe: 1.4, aRe: 1.4, aLz: -.2, aRz: -.2, ...pose })]], { T: L.T }); cara(me, L.T, face); return me; };

// 1 «In dieser Stadt heißt jeder» (zoom lento): el cartel ADRIANSFELDE – Einwohner: 3000 Adrians, la ciudad detrás
shot(0, 'C', 'slow', L => { town(L); const c = V(12, 6.1, 240);
  orb(L.k, c, null, [29, .25, .04, 42], [25, .25, .03, 42]); sh(c, 26);
  [[KIDS[10], -4.2], [KIDS[11], 4.2]].forEach(([p, dx], i) => { const r = .25, x = c.x + Math.cos(r) * dx + Math.sin(r) * 3, z = c.z - Math.sin(r) * dx + Math.cos(r) * 3; put(p, x, 0, z, r); actuar(p, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9 + i) * .35, aRe: .5 }]], { T: L.T }); cara(p, L.T + i, { expr: 'happy', mouth: 'open_smile' }); }); },
  [[0, 'birds', .5], [.4, 'ding_soft', .4]]);
// 2 «Adrian.»: la plaza llena; todos saludan con su placa «HALLO, ich heiße ADRIAN»
shot(1.48, 'W', 'punch', L => { town(L); const c = V(-6, 0, 12); put(EX[4], c.x, 0, c.z, 0); actuar(EX[4], 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .35, aRe: .5, aLx: 2.7, aLz: .4 + Math.cos(L.T * 9) * .35, aLe: .5 }]], { T: L.T }); grin(EX[4], L.T);
  crowdAt(L, c.x, c.z - 4, 14, 5, 13, 3, { mode: 'wave', from: 6, gap: 1.0 });
  orb(L.k, V(c.x, 3.6, c.z), null, [17, .1, .22, 44], [14, .05, .14, 44]); sh(c, 22); }, [[0, 'cheer', .45], [.2, 'crowd_run', .3]]);
// 3 «Meine Mama heißt Adrian.»: Mama en la puerta de casa, saluda y señala su placa
shot(2.26, 'S', null, L => { town(L); put(mama, HOUSE.x, 0, HOUSE.z, PI / 2); const pt = L.lt > .5;
  actuar(mama, L.lt, [[0, GEST.wave], [.55, { aRx: 1.2, aRz: -.6, aRe: 1.9, aLx: .3, headX: .15 }, { dur: .25 }]], { T: L.T }); cara(mama, L.T, { expr: 'happy', mouth: pt ? 'smile' : 'open_smile' });
  onBody(mama, 13, -.15, .12, 42, L.k, 11, .1); sh(HOUSE, 18); }, [[0, 'door_open', .4], [.4, 'pop', .4]]);
// 4 «Mein Papa heißt Adrian.»: Papa riega las flores de la fuente y saluda con la regadera
shot(3.52, 'F', null, L => { town(L); const p = V(-18, 0, -12); put(papa, p.x, 0, p.z, .2); actuar(papa, 0, [[0, { aRx: 2.6, aRz: .3 + Math.sin(L.T * 8) * .3, aRe: .4, aLx: 1.0, aLz: -.3, aLe: .6 }]], { T: L.T }); grin(papa, L.T);
  crowdAt(L, p.x, p.z - 6, 5, 6, 12, 9, { mode: 'idle', from: 2, list: EX });
  orb(L.k, V(p.x, 3.4, p.z), null, [14, .5, .1, 42], [12, .2, .1, 42]); sh(p, 20); }, [[0, 'water_bloop', .4], [.3, 'birds', .4]]);
// 5 «Meine Lehrerin ist Frau»: la profesora señala la pizarra: «Frau Adrian»
shot(4.67, 'S', null, L => { school(L); put(lehr, KX + 3.4, 0, -12, -.25); actuar(lehr, 0, [[0, { aLx: 2.4, aLz: -.5, aLe: .1, aRx: .4, aRz: -.3, aRe: 1.3, headY: .4, headX: -.1 }]], { T: L.T }); cara(lehr, L.T, { expr: 'smile', mouth: 'open_smile' });
  cm([KX + 1.4, 6.6, 4], [KX + 1.2, 6.6, 2.5], L.k); camera.lookAt(KX + 1.2, 7.0, -15); camera.fov = 48; sh(V(KX, 0, -10), 20); }, [[0, 'chalk', .5], [.4, 'classroom', .3]]);
// 6 «Adrian.»: primer plano de la profesora con su placa
shot(5.71, 'C', 'punch', L => { school(L); put(lehr, KX + 3, 0, -9, 0); actuar(lehr, 0, [[0, { aLx: 1.2, aLz: -.5, aLe: 1.7, aRx: .3, headZ: .1 }]], { T: L.T }); grin(lehr, L.T);
  onBody(lehr, 7.6, .1, .04, 40, L.k, 6.8); sh(V(KX, 0, -9), 14); }, [[0, 'pop', .5]]);
// 7 «Sogar unser Hund heißt Adrian.»: el perro mueve la cola delante de su caseta «ADRIAN»; mi hermano lo acaricia
shot(6.35, 'Z', null, L => { town(L); show(DOG, DOGP.x, 0, DOGP.z, -.5, .9); wag(L.T); const b = put(bru, DOGP.x - 3.4, 0, DOGP.z - .2, -.5 + .9); actuar(b, 0, [[0, { aRx: 1.4, aRz: -.4 + Math.sin(L.T * 6) * .2, aRe: .3, crouch: .25, lean: .2 }]], { T: L.T }); laughF(b, L.T);
  orb(L.k, V(DOGP.x - .6, 2.4, DOGP.z - 1.5), null, [15, -.5, .1, 42], [12.5, -.35, .08, 42]); sh(DOGP, 16); }, [[0, 'bark', .6], [.6, 'bark', .45]]);
// 8 «Wenn meine Lehrerin schaut,»: la profesora con la lista, mira por encima de las gafas
shot(8.09, 'F', null, L => { school(L); classKids(L, { expr: 'smile' }); put(lehr, KX, 0, -9.5, 0); actuar(lehr, 0, [[0, { aLx: .9, aRx: .9, aLz: -.25, aRz: -.25, aLe: 1.1, aRe: 1.1, headX: -.12 + Math.sin(L.T * 2) * .05, headY: Math.sin(L.T * 1.5) * .25 }]], { T: L.T }); cara(lehr, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' });
  cm([KX + 1.6, 5.9, -4.4], [KX + 1.2, 5.7, -4.9], L.k); camera.lookAt(KX, 4.1, -9.5); camera.fov = 40; sh(V(KX, 0, -9), 16); }, [[0, 'pages', .5], [.5, 'hmm', .4]]);
// 9 «wer in der Schule ist,»: la clase entera desde arriba: todos los niños con su placa ADRIAN
shot(9.07, 'S', null, L => { school(L); classKids(L, { expr: 'happy' }); meSeat(L, {}, { expr: 'neutral' }); put(lehr, KX - 6, 0, -10.5, .5); actuar(lehr, 0, [[0, GEST.hold]], { T: L.T }); cara(lehr, L.T, { expr: 'neutral' });
  cm([KX + 8, 13, -13.5], [KX + 5, 12.5, -13], L.k); camera.lookAt(KX - 1, 2.6, 5); camera.fov = 50; sh(V(KX, 0, 4), 22); }, [[0, 'classroom', .5], [.3, 'chair_roll', .35]]);
// 10 «braucht sie nur einen Namen.»: la lista: Adrian, Adrian, Adrian… (se va llenando)
shot(9.99, 'Z', null, L => { school(L); put(lehr, KX - 8, 0, -12.6, 0); actuar(lehr, 0, [[0, { aLx: 2.2, aLz: -.2, aLe: .5, aRx: 2.0, aRz: -.4, aRe: 1.0, headX: -.1 }]], { T: L.T }); cara(lehr, L.T, { expr: 'smile', eyes: 'up' });
  show(ATT, KX - 8, 5.6, -11.2, 0, .3); ATT.rotation.x = .08; ATT.userData.set(1 + Math.floor(clamp(L.k * 1.3) * 7), false);
  const pw = wpos(lehr.aR.hand); show(PEN, pw.x, pw.y + .2, pw.z + .35, 0, .7); PEN.rotation.z = .6;
  cm([KX - 8.1, 6.0, -4.4], [KX - 8.05, 5.9, -5.2], L.k); camera.lookAt(KX - 8, 5.4, -11.2); camera.fov = 40; sh(V(KX - 8, 0, -11), 12); }, [[0, 'pencil', .55], [.5, 'pencil', .45]]);
// 11 «Adrian? Und»: la profesora llama
shot(11.31, 'C', null, L => { school(L); put(lehr, KX - 1, 0, -9.5, .15); actuar(lehr, 0, [[0, { aLx: .9, aLz: -.25, aLe: 1.1, aRx: .5, aRz: .4, aRe: .8, headX: -.12, lean: -.05 }]], { T: L.T }); cara(lehr, L.T, { expr: 'happy', mouth: L.T < 11.62 ? 'o' : 'smile', eyes: 'up' });
  show(ATT, KX - .9, 2.2, -8.5, .15, .28); ATT.rotation.x = -.5; bubble(lehr, 'Adrian?', clamp(L.lt / .1), 1.6);
  onFace(lehr, 4.2, .2, .4, 40, L.k, 3.8); sh(V(KX, 0, -9), 14); }, [[0, 'pop', .4]]);
// 12 «die ganze Klasse ruft:»: todos los niños levantan la mano a la vez
shot(12.12, 'W', null, L => { school(L); classKids(L, { hands: L.t0 + .45, expr: 'happy' }); meSeat(L, {}, { expr: 'neutral', eyes: 'side_l' });
  cm([KX + 6, 8.5, -13], [KX + 3, 8, -12.5], L.k); camera.lookAt(KX - 1, 3.4, 5); camera.fov = 52; sh(V(KX, 0, 4), 22); }, [[0, 'chair_roll', .4], [.5, 'cloth', .5]]);
// 13 «Hier!»: plano bajo: manos arriba, todos gritan «HIER!»
shot(13.39, 'C', 'punch', L => { school(L); classKids(L, { hands: L.t0 - 1, shout: true }); meSeat(L, {}, { expr: 'neutral', eyes: 'down' });
  const k = KIDS[0]; bubble(k, 'HIER!', clamp(L.lt / .1), 1.8);
  cm([KX - 4, 6.2, -9.5], [KX - 3.2, 6, -8.8], L.k); camera.lookAt(KX - 6, 4.4, 4); camera.fov = 50; sh(V(KX, 0, 2), 20); }, [[0, 'shout_crowd', .6], [.1, 'kids_laugh', .3]]);
// 14 «Außer mir.» (zoom lento): yo en medio, el único con la mano abajo
shot(14.42, 'Z', 'slow', L => { school(L); classKids(L, { hands: L.t0 - 2, shout: false, expr: 'happy' }); const c = meSeat(L, { aLx: 1.1, aRx: 1.1, aLe: 1.7, aRe: 1.7, aLz: -.35, aRz: -.35, headX: .15 }, { expr: 'sad', mouth: 'frown' });
  const s = seatOf(1); orbit(V(s.x, 3.6, s.z), lerp(12, 8, easeIn(L.k)), PI + .1, .14, 40); sh(s, 16); }, [[0, 'sigh_kid', .5]]);
// 15 «Seit vier Jahren»: las listas de cuatro cursos en la pared, todas con «Müller – ABWESEND»
shot(15.39, 'F', null, L => { school(L); show(OLD, KX - 19.4, 10, 2, PI / 2); const c = put(me, KX - 14.5, 0, 9, -2.2); actuar(c, 0, [[0, { aRx: 1.6, aRz: -.1, aRe: .1, headY: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  cm([KX - 5, 9.4, 3.6], [KX - 6.5, 9.6, 3], L.k); camera.lookAt(KX - 19, 9.6, 2); camera.fov = 46; badge('gold', '4 JAHRE', W / 2, H * .16, clamp(L.lt / .15), 1, .9); sh(V(KX - 15, 0, 3), 18); }, [[0, 'pages', .5], [.4, 'pop', .4]]);
// 16 «Tag als abwesend eingetragen.»: la profesora rodea en rojo «Müller … ABWESEND»
shot(16.73, 'S', null, L => { school(L); put(lehr, KX + 6, 0, -12.4, -.25); actuar(lehr, 0, [[0, { aLx: 1.35, aLz: -.2, aLe: 1.0, aRx: 1.2, aRz: -.3, aRe: 1.4, headX: .35 }]], { T: L.T }); cara(lehr, L.T, { expr: 'neutral', eyes: 'down', mouth: 'flat' });
  show(ATT, KX + 5.7, 3.1, -11.4, -.25, .3); ATT.rotation.x = -.35; ATT.userData.set(8, L.k > .35);
  const pw = wpos(lehr.aR.hand); show(PEN, pw.x, pw.y + .3, pw.z + .2, 0, .7); PEN.rotation.z = -.5;
  cm([KX + 3.6, 5.6, -6.4], [KX + 4.2, 5.2, -7.1], L.k); camera.lookAt(KX + 5.6, 3.0, -11.4); camera.fov = 40; sh(V(KX + 6, 0, -11), 12); }, [[0, 'pencil', .5], [.4, 'pencil', .5], [.8, 'sad_tone', .35]]);
// 17 «Denn ich heiße Müller.»: yo en el patio, señalo mi placa escrita a mano: MÜLLER
shot(18.51, 'C', 'punch', L => { town(L); const p = V(-30, 0, -6); put(me, p.x, 0, p.z, .35); me.setTag('MÜLLER'); actuar(me, 0, [[0, { ...GEST.shrug, headZ: .14 }]], { T: L.T }); cara(me, L.T, { expr: 'smug', mouth: 'smirk' });
  crowdAt(L, p.x, p.z - 6, 4, 6, 12, 13, { mode: 'idle', list: KIDS, from: 3 });
  onBody(me, 8, .05, .06, 40, L.k, 7.2); sh(p, 16); }, [[0, 'thump', .4], [.2, 'tape', .4]]);
// 18 «Mama sagt, ich sah einfach»: Mama habla con mi foto de bebé en la mano (delante del pecho)
const photoFront = (c, fwd = 1.2, y = 2.0, side = 0) => { const a = c.root.rotation.y, p = c.root.position; show(PHOTO, p.x + Math.sin(a) * fwd + Math.cos(a) * side, y, p.z + Math.cos(a) * fwd - Math.sin(a) * side, a, .85); };
shot(19.53, 'W', null, L => { town(L); put(mama, HOUSE.x + 1, 0, HOUSE.z - 1, PI / 2 + .25); actuar(mama, 0, [[0, { aLx: .8, aLz: -.5, aLe: .7, aRx: .8, aRz: -.5, aRe: .7, headZ: .15 + Math.sin(L.T * 3) * .05 }]], { T: L.T }); talk(mama, L.T, 19.5, 21);
  photoFront(mama); put(me, HOUSE.x + 3.4, 0, HOUSE.z - 4.2, PI / 2 - .7); actuar(me, 0, [[0, GEST.cross]], { T: L.T }); cara(me, L.T, { expr: 'bored', eyes: 'half' });
  onBody(mama, 11, -.45, .08, 42, L.k, 10, -.35); sh(HOUSE, 16); }, [[0, 'door_creak', .35], [.4, 'hmm', .3]]);
// 19 «nicht aus wie ein Adrian.»: primer plano de la foto de bebé; Mama inclina la cabeza: «kein Adrian?»
shot(20.95, 'Z', null, L => { town(L); put(mama, HOUSE.x + 1, 0, HOUSE.z - 1, PI / 2 + .25); actuar(mama, 0, [[0, { aLx: .8, aLz: -.5, aLe: .7, aRx: .8, aRz: -.5, aRe: .7, headZ: .3 }]], { T: L.T }); cara(mama, L.T, { expr: 'confused', mouth: 'wavy' });
  photoFront(mama); const a = mama.root.rotation.y, h = hp(mama);
  cm([h.x + Math.sin(a) * 7.5, h.y - .6, h.z + Math.cos(a) * 7.5], [h.x + Math.sin(a) * 6.6, h.y - .6, h.z + Math.cos(a) * 6.6], L.k); camera.lookAt(h.x, h.y - .9, h.z); camera.fov = 40;
  badge('red', 'kein Adrian?', W / 2, H * .16, clamp((L.lt - .25) / .15), 1, .8); sh(HOUSE, 14); }, [[0, 'pop', .4], [.3, 'sad_tone', .3]]);
// 20 «Wenn jemand Adrian ruft,»: el panadero grita «ADRIAN!» delante de la Bäckerei
shot(21.93, 'R', null, L => { town(L); const p = V(-49, 0, 10.5); const b = EX[5]; put(b, p.x, 0, p.z, PI / 2 + .2); actuar(b, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .2, aRz: .2, aLe: 2.2, aRe: 2.2, lean: -.12, headX: -.2 }]], { T: L.T }); cara(b, L.T, { expr: 'shout', mouth: 'talk_wide' });
  bubble(b, 'ADRIAN!', clamp((L.lt - .2) / .1), 1.6);
  orb(L.k, V(p.x, 3.4, p.z), null, [11, PI / 2 + .55, .1, 42], [9.5, PI / 2 + .35, .08, 42]); sh(p, 16); }, [[0, 'city_amb', .4], [.25, 'shout_m', .5]]);
// 21 «dreht sich die ganze Stadt um.»: grúa: toda la plaza se gira a la vez
shot(23.32, 'C', null, L => { town(L); const c = V(-12, 0, 6); crowdAt(L, c.x, c.z, 22, 3, 16, 21, { mode: 'turn', turnAt: L.t0 + .2, full: true, jit: .25, expr: 'happy' });
  cm([c.x + 4, 22, c.z + 30], [c.x + 2, 17, c.z + 26], L.k); camera.lookAt(c.x, 2, c.z); camera.fov = 48; sh(c, 26); }, [[0, 'whoosh_soft', .4], [.2, 'crowd_run', .45]]);
// 22 «Ich bin der Einzige, der sich nicht umdreht.»: todos miran a cámara; yo paso de perfil, aburrido, con las manos en los bolsillos
shot(24.76, 'S', null, L => { town(L); const c = V(-12, 0, 8); walkTo(me, c.x + 2.2, c.z + 2, -PI / 2, 1.6, L, 0, 6); cara(me, L.T, { expr: 'bored', eyes: 'half' });
  crowdAt(L, c.x, c.z - 2, 14, 4.5, 13, 23, { mode: 'turn', turnAt: L.t0 - 2, jit: .2, expr: 'happy', gap: .9 });
  orb(L.k, V(c.x, 3.2, c.z + 2), null, [13, .08, .1, 42], [11.5, .02, .08, 42]); sh(c, 20); }, [[0, 'steps', .45], [.8, 'sigh_kid', .35]]);
// 23 «Und weil ich kein Adrian bin,»: patio del colegio: los niños me miran de arriba abajo
shot(26.54, 'W', null, L => { town(L); const p = V(-24, 0, -40); put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, { aLx: .4, aRx: .4, aLz: -.4, aRz: -.4, aLe: 1.6, aRe: 1.6, headX: .2 }]], { T: L.T }); cara(me, L.T, { expr: 'sad' });
  crowdAt(L, p.x, p.z, 7, 4.5, 8, 31, { mode: 'idle', list: KIDS, from: 0, expr: 'sus', face: V(p.x, 3, p.z) });
  orb(L.k, V(p.x, 2.8, p.z), null, [12, -.25, .14, 42], [10.5, -.1, .12, 42]); sh(p, 18); }, [[0, 'kids_laugh', .35], [.5, 'murmur', .35]]);
// 24 «sagen die Kinder, ich bin niemand.»: tres niños me señalan y se ríen («NIEMAND!»)
shot(28.08, 'F', null, L => { town(L); const p = V(-24, 0, -44); [KIDS[2], KIDS[5], KIDS[7]].forEach((k, i) => { const x = p.x + (i - 1) * 3.4, z = p.z - Math.abs(i - 1) * 1.2; crowdGuy(k, x, z, L, i, { mode: i === 1 ? 'point' : 'laugh', face: V(p.x, 0, p.z + 12) }); });
  bubble(KIDS[5], 'NIEMAND!', clamp((L.lt - .5) / .1), 1.6);
  orb(L.k, V(p.x, 2.4, p.z), null, [10.5, .05, .06, 44], [9, 0, .04, 44]); sh(p, 14); }, [[0, 'kids_laugh', .55], [.6, 'laugh_m', .3]]);
// 25 «Deshalb nennen sie mich so:»: los niños levantan la pancarta NIEMAND detrás de mí; yo hundido
shot(29.62, 'S', null, L => { town(L); const p = V(-10, 0, -48); show(NSIGN, p.x, 1.6, p.z - 3, 0, .9); [KIDS[8], KIDS[9]].forEach((k, i) => { put(k, p.x + (i ? 3.06 : -3.06), 0, p.z - 3.6, 0); actuar(k, 0, [[0, { aLx: 2.5, aRx: 2.5, aLz: i ? .1 : -.1, aRz: i ? -.1 : .1, aLe: .4, aRe: .4 }]], { T: L.T }); laughF(k, L.T + i); });
  put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, GEST.slump || { lean: .2, headX: .4, aLx: .1, aRx: .1 }]], { T: L.T }); cara(me, L.T, { expr: 'sad', eyes: 'down' });
  orb(L.k, V(p.x, 4.8, p.z - 1.5), null, [16, -.1, .06, 44], [14, 0, .05, 44]); sh(p, 16); }, [[0, 'paper', .5], [.4, 'kids_laugh', .35]]);
// 26 «Niemand.»: primer plano: lágrima, la pancarta detrás
shot(30.70, 'C', 'punch', L => { town(L); const p = V(-10, 0, -48); show(NSIGN, p.x, 1.6, p.z - 3, 0, .9); [KIDS[8], KIDS[9]].forEach((k, i) => { put(k, p.x + (i ? 3.06 : -3.06), 0, p.z - 3.6, 0); actuar(k, 0, [[0, { aLx: 2.5, aRx: 2.5, aLe: .4, aRe: .4 }]], { T: L.T }); laughF(k, L.T + i); });
  put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, { headX: .1, aLx: .1, aRx: .1 }]], { T: L.T }); cara(me, L.T, { expr: 'cry', eyes: 'cry', mouth: 'frown' }); tears(me, L.T);
  cm([p.x + .4, 4.4, p.z + 7.6], [p.x + .3, 4.4, p.z + 6.8], L.k); camera.lookAt(p.x, 4.6, p.z - 2); camera.fov = 42; sh(p, 12); }, [[0, 'sad_tone', .5]]);
// 27 «der Müller zu mir sagt,»: mi hermano corre hacia mí gritando «Müller!»
shot(31.88, 'Z', null, L => { town(L); const b = put(bru, 22, Math.abs(Math.sin(L.T * 14)) * .2, 76 + L.lt * 4.2, 0); actuar(b, 0, [[0, { ...walkP(L.T, 0, 14), aRx: 2.6, aRz: .4, aRe: .3 }]], { T: L.T }); laughF(b, L.T);
  bubble(b, 'Müller!', clamp(L.lt / .1), 1.6); const bp = b.root.position;
  orbit(V(bp.x, 2.2, bp.z), 9.5, .25, .06, 42); sh(bp, 14); }, [[0, 'steps_run', .5], [.2, 'kids_laugh', .3]]);
// 28 «ist mein kleiner Bruder.»: nos chocamos la mano en la calle
shot(33.06, 'W', null, L => { town(L); const p = V(22, 0, 84); put(me, p.x - 1.5, 0, p.z, PI / 2 - .55); put(bru, p.x + 1.5, 0, p.z, -PI / 2 + .55); const hf = L.lt > .35;
  actuar(me, 0, [[0, { aRx: hf ? 2.5 : 2.1, aRz: hf ? -.5 : -.2, aRe: .2 }]], { T: L.T }); actuar(bru, 0, [[0, { aLx: hf ? 2.7 : 2.3, aLz: hf ? -.4 : -.2, aLe: .2 }]], { T: L.T }); grin(me, L.T); laughF(bru, L.T);
  if (hf) confetti(V(p.x, -2, p.z), L.t0 + .35, L.T, 24, .5);
  orb(L.k, V(p.x, 2.6, p.z), null, [9.5, .05, .08, 42], [8.5, 0, .06, 42]); sh(p, 14); }, [[.35, 'slap', .55], [.4, 'kids_laugh', .3]]);
// 29 «Er heißt natürlich Adrian.»: mi hermano señala su placa ADRIAN; yo detrás, cara de póquer
shot(34.06, 'C', 'punch', L => { town(L); const p = V(22, 0, 84); put(bru, p.x + .8, 0, p.z + 1.5, -.15); actuar(bru, 0, [[0, { aLx: .9, aLz: -.6, aLe: 1.9, aRx: .3, headZ: -.1 }]], { T: L.T }); grin(bru, L.T);
  put(me, p.x - 1.6, 0, p.z - 1.6, .3); actuar(me, 0, [[0, GEST.cross]], { T: L.T }); cara(me, L.T, { expr: 'bored', eyes: 'half', mouth: 'flat' });
  orb(L.k, V(p.x - .2, 2.7, p.z), null, [10, .05, .08, 40], [8.8, .02, .06, 40]); sh(p, 12); }, [[0, 'pop', .45], [.5, 'sigh_kid', .3]]);
// ---------- b: el forastero, la noche, el robo, el policía (35,41 – 71,12 s) ----------
const PLZ = V(-8, 0, 14);                 // centro de la plaza para las multitudes
const STREET = V(22, 0, 84);              // calle delante de casa (mi hermano)
const suitIn = (c, side = 'L') => { const h = side === 'L' ? c.aL.hand : c.aR.hand; attach(SUIT, h, [0, -1.0, 0], [0, PI / 2, 0], .55); };
const door = i => { const d = DOORS[i]; return { d, p: V(NX - 20 + i * 20, 0, 0) }; };

// 30 «Aber dann kam eines Tages» (zoom lento): la carretera de entrada; un desconocido se acerca a lo lejos
shot(35.41, 'I', 'slow', L => { town(L); const z = 318 - L.lt * 3.2; walkTo(det, 25, 318, PI, 3.2, L, 0, 7); suitIn(det); cara(det, L.T, { expr: 'smug', mouth: 'smirk' });
  grade.uniforms.sat.value = 1.25; cm([26.5, 4.2, z - 30], [26.2, 3.8, z - 22], easeIn(L.k)); camera.lookAt(25, 3.2, z); camera.fov = 38; sh(V(25, 0, z), 20); }, [[0, 'wind', .45], [.3, 'steps', .35]]);
// 31 «ein Fremder in die Stadt.»: el forastero se para delante del cartel y se toca la gorra
shot(36.93, 'S', null, L => { town(L); const r = .25, c = V(12, 0, 240); const x = c.x + Math.cos(r) * 4.6 + Math.sin(r) * 3.2, z = c.z - Math.sin(r) * 4.6 + Math.cos(r) * 3.2; put(det, x, 0, z, r); suitIn(det);
  actuar(det, L.lt, [[0, { aRx: .3 }], [.3, { aRx: 2.9, aRz: -.6, aRe: 2.1, headX: .1 }, { dur: .25 }]], { T: L.T }); cara(det, L.T, { expr: 'smug', mouth: 'smirk' });
  orb(L.k, V(c.x + Math.cos(.25) * 2, 5.2, c.z - Math.sin(.25) * 2 + 1.5), null, [25, .3, .06, 44], [22, .24, .05, 44]); sh(c, 20); }, [[0, 'steps', .4], [.35, 'cloth', .4]]);
// 32 «Hallo! Ich bin Adrian!»: primer plano: saluda con una sonrisa enorme y su placa ADRIAN
shot(38.07, 'C', 'punch', L => { town(L); const p = V(-4, 0, 30); put(det, p.x, 0, p.z, .1); suitIn(det); actuar(det, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 10) * .35, aRe: .4 }]], { T: L.T }); grin(det, L.T, { mouth: L.T < 38.6 ? 'open_smile' : 'grin' });
  crowdAt(L, p.x, p.z - 3, 6, 6, 12, 41, { mode: 'idle', expr: 'happy', list: EX, from: 8 });
  bubble(det, L.T < 38.6 ? 'Hallo!' : 'Ich bin Adrian!', 1, 1.5); onBody(det, 9.6, .1, .06, 40, L.k, 8.8); sh(p, 16); }, [[0, 'pop', .45], [.55, 'ding_soft', .4]]);
// 33 «Und die ganze Stadt jubelte.»: la plaza le aclama; confeti
shot(39.55, 'F', null, L => { town(L); put(det, PLZ.x, 0, PLZ.z, 0); suitIn(det); actuar(det, 0, [[0, { ...GEST.cheer, aLx: .3, aLz: .1 }]], { T: L.T }); grin(det, L.T);
  crowdAt(L, PLZ.x, PLZ.z, 18, 4.5, 13, 43, { mode: 'cheer', face: V(PLZ.x, 3, PLZ.z), gap: 1.0 }); confRain(V(PLZ.x, 0, PLZ.z), L.T, 60, 22, 18, 16);
  orb(L.k, V(PLZ.x, 3.6, PLZ.z), null, [19, -.2, .26, 46], [16, .05, .22, 46]); sh(PLZ, 22); }, [[0, 'cheer', .6], [.2, 'confetti', .45], [.6, 'party_horn', .4]]);
// 34 «Denn wer hier Adrian heißt,»: Papa le estrecha la mano; un vecino le da palmadas
shot(41.23, 'W', null, L => { town(L); const p = V(10, 0, 24); put(det, p.x + 1.6, 0, p.z, -PI / 2 + .45); put(papa, p.x - 1.6, 0, p.z, PI / 2 - .45); const sh_ = Math.sin(L.T * 14) * .12;
  actuar(det, 0, [[0, { aRx: 1.3 + sh_, aRz: -.3, aRe: .4 }]], { T: L.T }); actuar(papa, 0, [[0, { aRx: 1.3 - sh_, aRz: -.3, aRe: .4, aLx: .4 }]], { T: L.T }); grin(det, L.T); laughF(papa, L.T);
  const n = put(EX[9], p.x + 3.2, 0, p.z - 2.4, -.6); actuar(n, 0, [[0, { aLx: 2.0, aLz: -.6, aLe: .6 + Math.abs(Math.sin(L.T * 9)) * .4 }]], { T: L.T }); laughF(n, L.T + 1);
  orb(L.k, V(p.x + .3, 3.2, p.z - .4), null, [12.5, .08, .1, 42], [11, -.05, .08, 42]); sh(p, 14); }, [[0, 'slap', .45], [.4, 'laugh_m', .4]]);
// 35 «gehört zur Familie.»: abrazo de grupo (Mama, Papa, vecinos) con corazones
shot(42.71, 'Z', null, L => { town(L); const p = V(10, 0, 24); put(det, p.x, 0, p.z, 0); actuar(det, 0, [[0, { aLx: 1.6, aRx: 1.6, aLz: -.9, aRz: -.9, aLe: .5, aRe: .5 }]], { T: L.T }); cara(det, L.T, { expr: 'happy', eyes: 'closed', mouth: 'grin' });
  [[mama, -2.2, .3], [papa, 2.2, -.3], [EX[10], -1.2, .2], [EX[11], 1.3, -.2]].forEach(([c, dx, ry], i) => { put(c, p.x + dx, 0, p.z - (i > 1 ? 1.6 : .4), ry); actuar(c, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: dx > 0 ? -1.0 : -.3, aRz: dx > 0 ? -.3 : -1.0, aLe: .4, aRe: .4, lean: .05 }]], { T: L.T }); cara(c, L.T + i, { expr: 'love', eyes: 'happy', mouth: 'smile' }); });
  hearts(V(p.x, 6.4, p.z), L.T); orb(L.k, V(p.x, 3.4, p.z), null, [13, .05, .1, 42], [11, 0, .08, 42]); sh(p, 14); }, [[0, 'hug', .5], [.4, 'aah', .35]]);
// 36 «In dieser Nacht ging jemand»: calle de noche con luna; una figura pasa por la acera
shot(43.75, 'I', null, L => { nightStreet(L); walkTo(det, NX - 34, 3.6, PI / 2, 3.0, L, 0, 7); cara(det, L.T, { expr: 'smug', mouth: 'smirk' }); const dp = det.root.position;
  cm([dp.x + 4, 7.0, 22], [dp.x + 4.5, 6.2, 19], L.k); camera.lookAt(dp.x + .5, 3.6, 2); camera.fov = 48; sh(V(dp.x, 0, 2), 24); }, [[0, 'crickets', .45], [.3, 'steps', .4], [.8, 'owl', .35]]);
// 37 «von Tür zu Tür und sagte:»: llama a la puerta n.º 12
shot(44.99, 'S', null, L => { nightStreet(L); const { d, p } = door(0); put(det, p.x + .6, 0, 3.4, PI - .5); const kn = Math.abs(Math.sin(L.T * 12)); actuar(det, 0, [[0, { aRx: 1.6, aRz: -.1, aRe: 1.5 + kn * .4, lean: .06 }]], { T: L.T }); cara(det, L.T, { expr: 'smug' });
  cm([p.x + 7.5, 5.2, 1.6], [p.x + 6.8, 5.0, 1.4], L.k); camera.lookAt(p.x + .4, 3.6, 3.0); camera.fov = 48; sh(V(p.x, 0, 2), 16); }, [[0, 'knock', .65], [.35, 'knock', .55], [.7, 'knock', .5]]);
// 38 «Ich bin's, Adrian!»: su cara a la luz del farol de la puerta, sonrisa dulce y la placa ADRIAN
shot(46.59, 'C', null, L => { nightStreet(L); const { d, p } = door(0); put(det, p.x + .4, 0, 3.4, PI + .15); actuar(det, 0, [[0, { aLx: .9, aLz: -.6, aLe: 1.9, aRx: .2, headZ: .12 }]], { T: L.T }); cara(det, L.T, { expr: 'happy', eyes: 'happy', mouth: kitLips(L.T, spoken(46.5, 47.9)) || 'smile' });
  const h = hp(det); cm([h.x - 4.4, h.y + .5, .9], [h.x - 3.9, h.y + .4, 1.0], L.k); camera.lookAt(h.x, h.y + .2, h.z); camera.fov = 44; bubble(det, 'Ich bin’s!', clamp(L.lt / .1), 1.4); sh(V(p.x, 0, 3), 12); }, [[0, 'pop', .4]]);
// 39 «Und alle ließen ihn rein.»: Papa abre la puerta n.º 14 sonriendo y le hace pasar
shot(47.97, 'W', null, L => { nightStreet(L); const { d, p } = door(1); d.userData.setOpen(easeOut(clamp(L.lt / .4)));
  put(papa, p.x, 0, -1.2, 0); actuar(papa, 0, [[0, { aRx: 1.2, aRz: .5, aRe: .8 + Math.sin(L.T * 8) * .3, aLx: .3 }]], { T: L.T }); grin(papa, L.T);
  walkTo(det, p.x + 3.4, 5.4, PI + .55, 2.0, L, 0, 7); suitIn(det); cara(det, L.T, { expr: 'smug', mouth: 'smirk' });
  cm([p.x - 6.5, 5, 13], [p.x - 5.5, 4.8, 11.5], L.k); camera.lookAt(p.x + .6, 3.6, 1); camera.fov = 46; sh(V(p.x, 0, 2), 16); }, [[0, 'door_open', .6], [.5, 'steps', .35]]);
// 40 «Am nächsten Morgen waren alle»: el aparcabicis vacío, candados rotos en el suelo; dos vecinos se llevan las manos a la cabeza
shot(49.33, 'F', null, L => { town(L); const r = V(-47, 0, 6); LOCKS.forEach((l, i) => show(l, r.x + .8 + (i % 2) * .5, .35, r.z - 3.6 + i * 2.4, i, .8));
  const v = put(EX[12], r.x + 2.4, 0, r.z + 3.6, PI / 2 + .3); actuar(v, 0, [[0, GEST.hands_head]], { T: L.T }); cara(v, L.T, { expr: 'shock', mouth: 'o' });
  const v2 = put(EX[13], r.x + 2.8, 0, r.z - 4.0, PI / 2 - .2); actuar(v2, 0, [[0, GEST.shock]], { T: L.T }); cara(v2, L.T + 1, { expr: 'shock', mouth: 'grimace' });
  cm([r.x + 19, 6.5, r.z + 2], [r.x + 17, 6, r.z + 1.5], L.k); camera.lookAt(r.x + 1.5, 2.4, r.z); camera.fov = 50; sh(r, 16); }, [[0, 'birds', .4], [.25, 'gasp', .5], [.5, 'chain_rattle', .4]]);
// 41 «Fahrräder und Laptops weg.»: en el café, la mesa vacía donde estaba su portátil; el dueño, en shock. «ALLES WEG!»
shot(50.95, 'Z', null, L => { town(L); const t = V(36, 0, -40); const v = put(EX[14], t.x, 0, t.z + 2.8, 0); actuar(v, 0, [[0, GEST.hands_head]], { T: L.T }); cara(v, L.T, { expr: 'shock', mouth: 'scream' });
  const v2 = put(EX[15], t.x - 3.4, 0, t.z + 1.6, .5); actuar(v2, 0, [[0, GEST.shock]], { T: L.T }); cara(v2, L.T + 1, { expr: 'shock', mouth: 'o' });
  orb(L.k, V(t.x - 1, 3.4, t.z + 2.4), null, [13.5, -.15, .14, 44], [12, -.05, .12, 44]); badge('red', 'ALLES WEG!', W / 2, H * .17, clamp((L.lt - .2) / .15), 1, .9); sh(t, 14); }, [[0, 'gasp', .5], [.3, 'murmur', .4]]);
// 42 «Sogar das Fahrrad von meinem Bruder.»: mi hermano ante el candado roto donde estaba su bici
shot(52.71, 'S', null, L => { town(L); show(LOCKS[0], STREET.x - 1.8, .45, STREET.z - 1, .5, 1); const b = put(bru, STREET.x, 0, STREET.z, -.3); actuar(b, 0, [[0, { ...GEST.shock, headX: .35 }]], { T: L.T }); cara(b, L.T, { expr: 'shock', eyes: 'down', mouth: 'o' });
  orb(L.k, V(STREET.x - .6, 2.0, STREET.z - .4), null, [11, -.4, .2, 42], [9.5, -.25, .16, 42]); sh(STREET, 12); }, [[0, 'chain_rattle', .45], [.4, 'baby_gasp', .4]]);
// 43 (llanto): primer plano: mi hermano llora a lágrima viva
shot(54.31, 'C', null, L => { town(L); const b = put(bru, STREET.x, 0, STREET.z, .1); actuar(b, 0, [[0, { aLx: 1.8, aRx: 1.8, aLz: -.4, aRz: -.4, aLe: 2.2, aRe: 2.2, headX: .15 + Math.sin(L.T * 9) * .04, crouch: .05 }]], { T: L.T }); cara(b, L.T, { expr: 'cry', eyes: 'cry', mouth: 'ah' }); tears(b, L.T);
  onFace(b, 6.2, .2, .4, 40, L.k, 5.6); sh(STREET, 10); }, [[0, 'cry_girl', .35]]);
// 44 «Müller, jemand hat»: me lo cuenta llorando; yo le escucho
shot(55.89, 'W', null, L => { town(L); const b = put(bru, STREET.x + 1.4, 0, STREET.z, -PI / 2 + .6); actuar(b, 0, [[0, { aLx: .9, aRx: .9, aLz: .2, aRz: .2, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); talk(b, L.T, 55.8, 57.2, 'cry', { eyes: 'cry' }); tears(b, L.T);
  put(me, STREET.x - 1.8, 0, STREET.z - .4, PI / 2 - .6); actuar(me, 0, [[0, GEST.listen]], { T: L.T }); cara(me, L.T, { expr: 'worried' });
  orb(L.k, V(STREET.x - .2, 2.7, STREET.z), null, [10.5, .08, .1, 42], [9.5, 0, .08, 42]); sh(STREET, 12); }, [[0, 'sniff', .45]]);
// 45 «mein Fahrrad geklaut!»: brazos abiertos, desconsolado
shot(57.14, 'F', null, L => { town(L); const b = put(bru, STREET.x, 0, STREET.z, -.2); actuar(b, 0, [[0, { aLx: .5, aRx: .5, aLz: .9, aRz: .9, aLe: .5, aRe: .5, headX: -.2 }]], { T: L.T }); talk(b, L.T, 57.1, 58.5, 'cry', { eyes: 'cry' }); tears(b, L.T);
  bubble(b, 'geklaut!', clamp((L.lt - .4) / .1), 1.5); onBody(b, 8.6, .15, .1, 42, L.k, 7.6); sh(STREET, 12); }, [[0, 'cry_girl', .3], [.5, 'sad_tone', .3]]);
// 46 «Also habe ich ihm versprochen,»: me agacho, le pongo la mano en el hombro
shot(58.50, 'S', null, L => { town(L); const b = put(bru, STREET.x + 1.2, 0, STREET.z, -PI / 2 + .5); actuar(b, 0, [[0, { aLx: .3, aRx: .3, headX: .1 }]], { T: L.T }); cara(b, L.T, { expr: 'sad', mouth: 'frown' });
  const m = put(me, STREET.x - 1.2, 0, STREET.z, PI / 2 - .5); actuar(m, 0, [[0, { crouch: .45, lean: .15, aRx: 1.5, aRz: -.15, aRe: .3, headX: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'smile', mouth: 'smile' });
  orb(L.k, V(STREET.x, 2.2, STREET.z), null, [10, -.2, .1, 42], [9, -.05, .08, 42]); sh(STREET, 12); }, [[0, 'cloth', .4], [.5, 'hug', .3]]);
// 47 «dass ich es zurückhole.» (zoom lento): plano bajo, puño cerrado, decidido
shot(59.72, 'Z', 'slow', L => { town(L); const m = put(me, STREET.x - 1.2, 0, STREET.z, .15); actuar(m, 0, [[0, { aRx: 1.9, aRz: -.3, aRe: 2.2, headX: -.08 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'flat' });
  const h = hp(m); cm([h.x + .8, h.y - 1.8, h.z + 7.5], [h.x + .6, h.y - 1.5, h.z + 5.6], easeIn(L.k)); camera.lookAt(h.x, h.y - .4, h.z); camera.fov = 42; sh(STREET, 12); }, [[0, 'heartbeat', .4]]);
// 48 «Polizist Adrian fragte»: el policía junto al coche patrulla, toma notas
shot(60.87, 'W', null, L => { town(L); const p = V(24, 0, 24); put(pol, p.x, 0, p.z, -.2); actuar(pol, 0, [[0, { aLx: 1.3, aLz: -.3, aLe: 1.3, aRx: 1.1, aRz: -.5, aRe: 1.6 + Math.sin(L.T * 12) * .1, headX: .25 }]], { T: L.T }); cara(pol, L.T, { expr: 'neutral', eyes: 'down' });
  const lh = wpos(pol.aL.hand); show(NOTEPAD, lh.x + .2, lh.y + .4, lh.z + .3, -.2, 1);
  orb(L.k, V(p.x + 1.5, 3.4, p.z - 1), null, [13, -.15, .12, 44], [11.5, 0, .1, 44]); sh(p, 16); }, [[0, 'siren', .25], [.3, 'pencil', .45]]);
// 49 «die ganze Stadt:»: subido a una caja, con megáfono, delante de todo el pueblo (el público de espaldas, escuchándole)
shot(62.15, 'F', null, L => { town(L); const p = V(-8, 0, -10); put(pol, p.x, 1.2, p.z, 0); actuar(pol, 0, [[0, { aRx: 1.6, aRz: -.4, aRe: 1.7, aLx: .4, aLz: .3 }]], { T: L.T }); talk(pol, L.T, 62, 63.2, 'talk');
  show(CRATE, p.x, 0, p.z); const rh = wpos(pol.aR.hand); show(MEGA, rh.x, rh.y + .25, rh.z + .4, 0, .7);
  crowdGrid(L, p.x, p.z + 6, 6, 3, 3.6, 3.0, { mode: 'idle', expr: 'neutral', face: V(p.x, 4, p.z), seed: 5, jit: .2 });
  cm([p.x + 2.5, 10.5, p.z + 18], [p.x + 2, 10, p.z + 16.5], L.k); camera.lookAt(p.x, 4.6, p.z); camera.fov = 44; sh(V(p.x, 0, p.z + 6), 20); }, [[0, 'murmur', .45], [.3, 'radio', .3]]);
// 50 «Wer war heute Nacht bei Ihnen?»: primer plano con el megáfono
shot(63.14, 'C', null, L => { town(L); const p = V(-8, 0, -10); put(pol, p.x, 1.2, p.z, 0); actuar(pol, 0, [[0, { aRx: 1.5, aRz: -.45, aRe: 1.6, aLx: .3 }]], { T: L.T }); talk(pol, L.T, 63.1, 64.6, 'shout'); show(CRATE, p.x, 0, p.z);
  const rh = wpos(pol.aR.hand); show(MEGA, rh.x, rh.y + .25, rh.z + .4, 0, .7);
  const h = hp(pol); const sd = rh.x > h.x ? -1 : 1; cm([h.x + sd * 3.2, h.y + .7, h.z + 6.2], [h.x + sd * 2.8, h.y + .6, h.z + 5.5], L.k); camera.lookAt(h.x, h.y - .3, h.z); camera.fov = 42; sh(p, 12); }, [[0, 'radio', .4]]);
// 51 «Und alle gaben dieselbe Antwort:»: el pueblo entero levanta la mano
shot(64.58, 'S', null, L => { town(L); const p = V(-8, 0, -3); crowdGrid(L, p.x, p.z, 6, 4, 3.6, 3.4, { mode: 'wave', face: V(p.x, 4, p.z - 10), seed: 7 });
  cm([p.x - 3, 8, p.z - 11], [p.x + 3, 8, p.z - 11.5], L.k); camera.lookAt(p.x, 3, p.z + 4); camera.fov = 50; sh(V(p.x, 0, p.z + 4), 20); }, [[0, 'cloth', .45], [.4, 'murmur', .4]]);
// 52 «Adrian!»: todos gritan a la vez
shot(66.42, 'C', 'punch', L => { town(L); const p = V(-8, 0, -3); crowdGrid(L, p.x, p.z, 6, 4, 3.6, 3.4, { mode: 'shout', face: V(p.x, 4, p.z - 10), seed: 7 });
  cm([p.x, 3.4, p.z - 7], [p.x, 3.2, p.z - 6.4], L.k); camera.lookAt(p.x, 4.6, p.z + 5); camera.fov = 56; sh(V(p.x, 0, p.z + 4), 20); }, [[0, 'shout_crowd', .65]]);
// 53 «Welcher denn?»: el policía, perdido, con un «?» enorme
shot(67.21, 'Z', null, L => { town(L); const p = V(-8, 0, -10); put(pol, p.x, 1.2, p.z, 0); actuar(pol, 0, [[0, { ...GEST.shrug, headZ: .25 }]], { T: L.T }); talk(pol, L.T, 67.2, 67.9, 'confused'); show(CRATE, p.x, 0, p.z);
  badge('q', '?', W * .72, H * .2, clamp(L.lt / .12), 1, 1); onFace(pol, 4.4, .1, -.3, 40, L.k, 3.9); sh(p, 12); }, [[0, 'boing_metal', .45]]);
// 54 «Weil jeder Adrian heißt,»: travelling por la fila de pechos: ADRIAN, ADRIAN, ADRIAN…
shot(67.93, 'W', null, L => { town(L); const p = V(-8, 0, -3); crowdGrid(L, p.x, p.z, 7, 1, 2.9, 3, { mode: 'idle', expr: 'happy', face: V(p.x, 3, p.z + 20), seed: 9, jit: .05 });
  const x = lerp(p.x - 6, p.x + 4, L.k); cam([x, 3.4, p.z + 6.2], [x + 1.2, 3.0, p.z], 42); sh(p, 16); }, [[0, 'whoosh_soft', .35], [.5, 'murmur', .35]]);
// 55 «konnte niemand sagen, wer es war.»: el policía se rasca la cabeza; todos se encogen de hombros
shot(69.45, 'F', null, L => { town(L); const p = V(-8, 0, 2); put(pol, p.x, 0, p.z, 0); actuar(pol, 0, [[0, { aRx: 2.8, aRz: -.2, aRe: 2.0 + Math.sin(L.T * 14) * .2, aLx: .3, headZ: .2 }]], { T: L.T }); cara(pol, L.T, { expr: 'confused', mouth: 'wavy' });
  crowdAt(L, p.x, p.z, 12, 5, 11, 55, { mode: 'shrug', gap: 1.0 });
  orb(L.k, V(p.x, 3.6, p.z), null, [15, .2, .14, 44], [13, .05, .12, 44]); sh(p, 18); }, [[0, 'hmm', .45], [.5, 'murmur', .35]]);
// ---------- c: el Freibad, la pista, el policía se ríe (71,12 – 95,91 s) ----------
const SWIM = [EX[0], EX[1], EX[2], EX[3], KIDS[0], KIDS[1], KIDS[2], EX[4], KIDS[3], EX[5]];
const EDGE = V(FX - 2, 0, 12.6);          // borde sur de la piscina, donde estoy sentado
// nadadores: solo cabeza y hombros fuera del agua; se giran hacia (fx, fz) en turnAt
function swimmers(L, o = {}) { const r = RNG(o.seed || 4); SWIM.forEach((c, i) => { const x = FX - 17 + (i % 5) * 8.4 + (r() - .5) * 2, z = -7 + Math.floor(i / 5) * 9 + (r() - .5) * 2; const s = c.spec.scale || 1;
  const face = Math.atan2((o.fx ?? FX) - x, (o.fz ?? 30) - z), away = face + PI + (r() - .5) * .8; const tt = o.turnAt != null ? easeOut(clamp((L.T - o.turnAt - (i % 4) * .04) / .22)) : (o.turned ? 1 : 0);
  put(c, x, -.15 - 3.0 * s + Math.sin(L.T * 2 + i) * .08, z, lerp(away, face, tt)); actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: .5 + Math.sin(L.T * 3 + i) * .2, aRz: .5 + Math.cos(L.T * 3 + i) * .2, aLe: .6, aRe: .6 }]], { T: L.T }); cara(c, L.T + i, { expr: tt > .5 ? 'happy' : 'neutral', mouth: tt > .5 ? 'open_smile' : 'smile' }); }); }
// gente en la terraza norte (junto a las tumbonas), mirando al sur cuando se giran
function deck(L, o = {}) { [EX[6], EX[7], EX[8], KIDS[4], EX[9], KIDS[5]].forEach((c, i) => { const x = FX - 21 + i * 7.8 + (i === 3 ? 2 : 0), z = -16.5 + (i % 2) * 1.2; const face = 0 + Math.sin(i * 3) * .2, away = PI + Math.sin(i * 2) * .4;
  const tt = o.turnAt != null ? easeOut(clamp((L.T - o.turnAt - (i % 3) * .05) / .22)) : (o.turned ? 1 : 0); put(c, x, 0, z, lerp(away, face, tt)); actuar(c, 0, [[0, { aLx: .2 + Math.sin(L.T + i) * .1, aRx: .3, headY: 0 }]], { T: L.T }); cara(c, L.T + i, { expr: 'happy', mouth: tt > .5 ? 'open_smile' : 'smile' }); }); }
// Detlef tumbado en la tumbona central, mirando al cielo con una revista
function detLounger(L, o = {}) { const x = FX - 4 + 2.4, z = -17; put(det, x, 1.25, z + .6, 0); det.root.rotation.x = -1.15; actuar(det, 0, [[0, { aLx: 1.6, aRx: 1.6, aLz: -.3, aRz: -.3, aLe: 1.2, aRe: 1.2, lLx: .15, lRx: .05, headX: -.15 }]], { T: L.T });
  cara(det, L.T, { expr: o.expr || 'smug', eyes: o.eyes || 'half', mouth: o.mouth || 'smirk' }); return V(x, 2.2, z); }
const meIce = (L, o = {}) => { const m = put(me, EDGE.x, sitY(me, .7), EDGE.z, o.ry ?? PI); actuar(me, 0, [[0, { lLx: 1.4, lRx: 1.4, lLk: .9 + Math.sin(L.T * 3) * .2, lRk: .9 + Math.cos(L.T * 3) * .2, aRx: 1.7, aRz: -.3, aRe: 2.0, aLx: .3, aLz: .3, headX: .1, ...(o.pose || {}) }]], { T: L.T });
  const rh = wpos(m.aR.hand); show(ICE, rh.x, rh.y + .5, rh.z, 0, 1.1); return m; };

// 56 «Am nächsten Tag, im Freibad,»: grúa sobre el Freibad lleno (nadadores, tumbonas, tobogán)
shot(71.12, 'I', null, L => { pool(L); swimmers(L, { turned: false }); deck(L, { turned: false }); detLounger(L);
  cm([FX + 18, 30, 52], [FX + 12, 22, 44], L.k); camera.lookAt(FX - 2, 0, -2); camera.fov = 50; sh(V(FX, 0, 0), 40); }, [[0, 'splash', .5], [.3, 'kids_laugh', .4], [.8, 'water_bloop', .4]]);
// 57 «rief eine Mutter:»: una madre en el borde, se lleva las manos a la boca
shot(72.48, 'S', null, L => { pool(L); swimmers(L); const p = V(FX + 6, 0, 14.2); put(mut, p.x, 0, p.z, PI + .3); actuar(mut, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .2, aRz: .2, aLe: 2.2, aRe: 2.2, lean: -.06 }]], { T: L.T }); cara(mut, L.T, { expr: 'happy', mouth: 'o' });
  orb(L.k, V(p.x, 3.2, p.z), null, [11, PI + .3 - .5, .1, 42], [10, PI + .3 - .35, .08, 42]); sh(p, 16); }, [[0, 'water_bloop', .4], [.4, 'breath', .35]]);
// 58 «Adrian, wir gehen!»: primer plano gritando
shot(73.52, 'C', null, L => { pool(L); const p = V(FX + 6, 0, 14.2); put(mut, p.x, 0, p.z, PI + .3); actuar(mut, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .2, aRz: .2, aLe: 2.2, aRe: 2.2, lean: -.1, headX: -.15 }]], { T: L.T }); talk(mut, L.T, 73.5, 75, 'shout');
  bubble(mut, 'Adrian, wir gehen!', clamp(L.lt / .1), 1.4); onFace(mut, 4.4, .2, .3, 40, L.k, 3.9); sh(p, 12); }, [[0, 'shout_m', .45]]);
// 59 «Alle Köpfe im Freibad»: todas las cabezas del agua se giran a la vez hacia ella
shot(74.99, 'W', null, L => { pool(L); swimmers(L, { turnAt: L.t0 + .25, fx: FX + 6, fz: 14 });
  cm([FX + 5, 6.2, 16], [FX + 4.5, 5.8, 14.5], L.k); camera.lookAt(FX - 2, 0, -4); camera.fov = 52; sh(V(FX, 0, 0), 30); }, [[0, 'water_bloop', .45], [.25, 'splash', .5]]);
// 60 «drehten sich um.»: en la terraza también: todos se dan la vuelta
shot(76.19, 'C', null, L => { pool(L); swimmers(L, { turned: true, fx: FX + 6, fz: 14 }); deck(L, { turnAt: L.t0 + .1 }); detLounger(L);
  cm([FX - 4, 9, 2], [FX - 5, 8.5, 0], L.k); camera.lookAt(FX - 4, 2.5, -17); camera.fov = 50; sh(V(FX - 4, 0, -12), 24); }, [[0, 'whoosh_soft', .35], [.1, 'gasp', .4]]);
// 61 «Außer meinem.»: yo, sentado en el borde con un helado, sigo a lo mío
shot(77.10, 'F', null, L => { pool(L); swimmers(L, { turned: true, fx: FX + 6, fz: 14 }); const m = meIce(L); cara(m, L.T, { expr: 'happy', eyes: 'closed', mouth: 'smile' });
  cm([EDGE.x + 1.5, 3.4, EDGE.z - 9], [EDGE.x + 1.2, 3.2, EDGE.z - 8], L.k); camera.lookAt(EDGE.x, 2.1, EDGE.z); camera.fov = 42; sh(EDGE, 14); }, [[0, 'sip', .4], [.4, 'water_bloop', .35]]);
// 62 «Deshalb war ich der Einzige,»: me doy cuenta: abro los ojos, el helado gotea
shot(77.86, 'S', null, L => { pool(L); const m = meIce(L, { pose: { headY: .25 } }); cara(m, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  const h = hp(m); cm([h.x + 2.6, h.y + .3, h.z - 5.2], [h.x + 2.2, h.y + .2, h.z - 4.6], L.k); camera.lookAt(h.x, h.y - .7, h.z); camera.fov = 40; sh(EDGE, 12); }, [[0, 'ding_soft', .4], [.3, 'drip', .35]]);
// 63 «der es gesehen hat:»: mis ojos se entrecierran (zoom)
shot(79.06, 'Z', null, L => { pool(L); const m = meIce(L, { pose: { headY: .25 } }); cara(m, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' });
  const h = hp(m); cm([h.x + .6, h.y + .7, h.z - 3.4], [h.x + .4, h.y + .7, h.z - 2.6], L.k); camera.lookAt(h.x, h.y + .1, h.z); camera.fov = 38; sh(EDGE, 10); }, [[0, 'tension_str', .35]]);
// 64 «Der Neue hat sich auch nicht umgedreht.» (zoom lento): todos miran a cámara… menos el nuevo, tumbado leyendo
shot(80.03, 'C', 'slow', L => { pool(L); deck(L, { turned: true }); const d = detLounger(L, { eyes: 'half' });
  cm([d.x + .5, 6.5, d.z + 15], [d.x + .3, 5.2, d.z + 9.5], easeIn(L.k)); camera.lookAt(d.x, 2.2, d.z - 1); camera.fov = 44; sh(V(d.x, 0, d.z), 16); }, [[0, 'heartbeat', .4]]);
// 65 «Denn wenn jemand deinen Namen ruft,»: en la plaza, una mujer llama a un hombre que se aleja
shot(81.91, 'W', null, L => { town(L); const p = V(-14, 0, 30); const a = put(EX[17], p.x - 3, 0, p.z, PI / 2 - .3); actuar(a, 0, [[0, { aRx: 2.2, aRz: .2, aRe: 2.0, aLx: .3 }]], { T: L.T }); talk(a, L.T, 81.9, 83.7, 'happy');
  walkTo(EX[16], p.x + 1.5, p.z - 1.5, PI - .3, 1.6, L, 0, 8); cara(EX[16], L.T, { expr: 'neutral' }); bubble(a, 'Adrian!', clamp((L.lt - .3) / .1), 1.5);
  orb(L.k, V(p.x - .5, 3, p.z - 1.5), null, [16, .25, .12, 46], [14.5, .15, .1, 46]); sh(p, 16); }, [[0, 'steps', .4], [.4, 'pop', .35]]);
// 66 «drehst du dich um,»: ¡zas! se gira al instante
shot(83.70, 'C', 'punch', L => { town(L); const p = V(-14, 0, 30); const c = put(EX[16], p.x + 5.5, 0, p.z + 1.7, lerp(PI / 2 + .4, -PI / 2 + .3, easeOut(clamp(L.lt / .18)))); actuar(c, 0, [[0, { aLx: .5, aRx: .5, aLz: .5, aRz: .5, lean: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'wide', mouth: 'o' });
  badge('q', '!', W * .7, H * .22, clamp((L.lt - .1) / .1), 1, .9); onBody(c, 9, -.1, .06, 42, L.k, 8); sh(p, 14); }, [[0, 'whoosh_soft', .45], [.1, 'boing_metal', .3]]);
// 67 «ohne überhaupt nachzudenken.»: hasta el perro gira la cabeza de golpe
shot(84.47, 'R', null, L => { town(L); const DP = V(16.3, 0, 115.1); show(DOG, DP.x, 0, DP.z, lerp(-.5 + PI * .8, -.5, easeOut(clamp((L.lt - .25) / .15))), .9);
  const m = put(mama, DP.x + 4.2, 0, DP.z - 1.6, lerp(PI, -.5, easeOut(clamp((L.lt - .3) / .18)))); actuar(m, 0, [[0, { aRx: 1.4, aRz: -.3, aRe: 1.2 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', eyes: 'wide', mouth: 'o' });
  badge('q', '!', W * .5, H * .2, clamp((L.lt - .3) / .1), 1, .8); orb(L.k, V(DP.x + 1.8, 2.6, DP.z - .6), null, [15, -.4, .1, 42], [13, -.3, .08, 42]); sh(DP, 16); }, [[.25, 'bark', .55], [.35, 'boing_metal', .3]]);
// 68 «Also war Adrian gar nicht»: yo, el dedo en alto: ¡lo tengo!
shot(85.94, 'F', null, L => { pool(L); const m = put(me, EDGE.x, 0, EDGE.z + 3, PI + .15); actuar(m, 0, [[0, { aRx: 2.9, aRz: -.2, aRe: .2, aLx: .3, headX: -.05 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', eyes: 'wide', mouth: 'open_smile' });
  onBody(m, 8, .15, .08, 42, L.k, 7); badge('gold', '!', W * .66, H * .2, clamp(L.lt / .1), 1, .8); sh(EDGE, 12); }, [[0, 'ding_reveal', .5]]);
// 69 «sein echter Name.»: la placa ADRIAN del nuevo, en grande… y tachada
shot(87.06, 'Z', null, L => { pool(L); const p = V(FX - 1.6, 0, -13); put(det, p.x, 0, p.z, 0); actuar(det, 0, [[0, { aLx: .3, aRx: .3, headX: .2 }]], { T: L.T }); cara(det, L.T, { expr: 'worried', eyes: 'side_l', mouth: 'wavy' }); sweat(det, L.T);
  det.setTag(null); const ch = wpos(det.spine); show(TAGBIG, ch.x + .5, ch.y + 1.5, ch.z + .7, 0, .34); TAGBIG.userData.set('ADRIAN', L.k > .45);
  cm([p.x + .9, 3.6, p.z + 6], [p.x + .7, 3.4, p.z + 5], L.k); camera.lookAt(p.x + .4, 3.3, p.z); camera.fov = 40; sh(p, 12); }, [[0, 'zoom_in', .4], [.45, 'pencil', .55]]);
// 70 «Er hat nur so getan,»: el nuevo me guiña un ojo desde la tumbona
shot(88.16, 'S', null, L => { pool(L); deck(L, { turned: true }); const d = detLounger(L, { eyes: 'wink', mouth: 'smirk' }); det.root.rotation.x = -.7; actuar(det, 0, [[0, { aLx: .4, aRx: .4, aLz: .3, aRz: .3, lLx: .15, headX: .25 }]], { T: L.T });
  const h = hp(det); cm([h.x + 2.2, h.y + 2.2, h.z + 7.2], [h.x + 1.8, h.y + 2.0, h.z + 6.4], L.k); camera.lookAt(h.x, h.y + .3, h.z); camera.fov = 42; sh(V(d.x, 0, d.z), 12); }, [[0, 'evil_laugh', .35]]);
// 71 «damit ihn alle reinlassen.»: recuerdo (sepia): otra puerta se abre y le dejan pasar
shot(89.20, 'W', null, L => { nightStreet(L); grade.uniforms.sepia.value = .55; const { d, p } = (i => ({ d: DOORS[i], p: V(NX - 20 + i * 20, 0, 0) }))(2); d.userData.setOpen(easeOut(clamp(L.lt / .45)));
  put(EX[18], p.x, 0, -1.4, 0); actuar(EX[18], 0, [[0, GEST.wave]], { T: L.T }); grin(EX[18], L.T);
  walkTo(det, p.x + 1.8, 5.2, PI + .3, 2.4, L, 0, 7); cara(det, L.T, { expr: 'smug', mouth: 'smirk' });
  cm([p.x - 4, 5.4, 13], [p.x - 3.4, 5, 11.5], L.k); camera.lookAt(p.x + .5, 3.4, 1); camera.fov = 44; sh(V(p.x, 0, 2), 16); }, [[0, 'door_creak', .5], [.4, 'steps', .3]]);
// 72 «Ich habe es Polizist»: corro hasta el policía junto al coche patrulla
shot(90.53, 'C', null, L => { town(L); const p = V(24, 0, 24); put(pol, p.x, 0, p.z, .3); actuar(pol, 0, [[0, GEST.cross]], { T: L.T }); cara(pol, L.T, { expr: 'neutral' });
  const m = put(me, p.x - 6 + L.lt * 4.4, Math.abs(Math.sin(L.T * 14)) * .2, p.z + 2.2, PI / 2 + .2); actuar(m, 0, [[0, walkP(L.T, 0, 14)]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'talk_wide' });
  orb(L.k, V(p.x - 1.5, 3, p.z + 1), null, [13, .1, .1, 44], [11.5, .2, .08, 44]); sh(p, 16); }, [[0, 'steps_run', .55]]);
// 73 «Adrian erzählt.»: se lo cuento todo gesticulando; él, de brazos cruzados
shot(91.47, 'F', null, L => { town(L); const p = V(24, 0, 24); put(pol, p.x + 1.6, 0, p.z, -PI / 2 + .5); actuar(pol, 0, [[0, GEST.cross]], { T: L.T }); cara(pol, L.T, { expr: 'sus', mouth: 'flat' });
  const m = put(me, p.x - 1.6, 0, p.z + .4, PI / 2 - .5); actuar(m, 0, [[0, { aLx: 1.2 + Math.sin(L.T * 9) * .4, aRx: 1.2 + Math.cos(L.T * 8) * .4, aLz: .4, aRz: .4, aLe: .8, aRe: .8 }]], { T: L.T }); talk(m, L.T, 90.5, 92.5, 'determined');
  orb(L.k, V(p.x, 3.2, p.z), null, [11.5, .1, .1, 42], [10.5, -.05, .08, 42]); sh(p, 14); }, [[0, 'whisper', .35]]);
// 74 «Aber er hat nur gelacht.»: el policía se parte de risa; yo, enfadado
shot(92.50, 'Z', null, L => { town(L); const p = V(24, 0, 24); const c = put(pol, p.x + .6, 0, p.z, -.25); actuar(c, 0, [[0, { aLx: 1.0, aRx: 1.0, aLz: -.5, aRz: -.5, aLe: 1.4, aRe: 1.4, lean: -.15 + Math.sin(L.T * 18) * .06, headX: -.25 }]], { T: L.T }); laughF(c, L.T);
  const m = put(me, p.x - 2.8, 0, p.z - 1.2, .5); actuar(m, 0, [[0, GEST.fists]], { T: L.T }); cara(m, L.T, { expr: 'angry', mouth: 'grimace' });
  onBody(c, 9.5, -.15, .08, 42, L.k, 8.5); sh(p, 14); }, [[0, 'laugh_deep', .55]]);
// 75 «Also musste ich es»: camino decidido hacia la plaza al atardecer
shot(93.82, 'S', null, L => { town(L, { dusk: true }); const m = walkTo(me, 0, 52, PI, 2.4, L, 0, 9); cara(m, L.T, { expr: 'determined', mouth: 'flat' }); const mp = m.root.position;
  orbit(V(mp.x, 2.9, mp.z), 9.5, PI + .2, .05, 42); sh(mp, 14); }, [[0, 'steps', .5]]);
// 76 «der ganzen Stadt zeigen.»: la plaza al atardecer se llena para el Stadtfest; yo llego por delante
shot(94.72, 'W', null, L => { town(L, { dusk: true, fest: true }); walkTo(me, -6, 22, PI, 2.4, L, 0, 9); cara(me, L.T, { expr: 'determined' });
  crowdAt(L, -6, -20, 20, 4, 16, 76, { mode: 'walk', full: true, face: V(-6, 0, -58) });
  cm([-2, 9, 40], [-3, 8, 34], L.k); camera.lookAt(-6, 3, -20); camera.fov = 48; sh(V(-6, 0, -10), 34); }, [[0, 'city_amb', .45], [.3, 'murmur', .4]]);
// ---------- d: el Stadtfest, el grito, Detlef, la furgoneta, «Niemand!», la nueva regla, el final (95,91 – 133,9 s) ----------
const STG = V(-6, 3.2, -56.6);            // yo en el escenario (mirando +z)
const AUD = V(-6, 0, -40);                // centro del público
const VANP = V(26, 0, -66);               // furgoneta (morro al norte; puertas traseras hacia +z en z ≈ -59.3)
const onStage = (L, pose, face) => { const m = put(me, STG.x + 2.0, STG.y, STG.z, -.15); actuar(m, 0, [[0, pose]], { T: L.T }); cara(m, L.T, face); return m; };
const micIn = (c) => attach(ST.mic, c.aR.hand, [0, -.6, .35], [-1.2, 0, 0], 1.0);
// público: rejilla delante del escenario; mode 'turn' = de espaldas al escenario hasta turnAt
const audience = (L, o = {}) => crowdGrid(L, AUD.x, AUD.z - 6, 7, 5, 3.5, 3.4, { face: V(STG.x, 4, STG.z), jit: .15, seed: 11, ...o });
function vanLoad(L) { show(VAN, VANP.x, 0, VANP.z, PI); const W_ = (x, y, z) => V(VANP.x - x, y, VANP.z - z);
  [1, 2, 3, 4].forEach((i, k) => { const p = W_(-1.4 + k * .95, 1.82, -1.5 - k * .6); show(BIKES[i], p.x, p.y, p.z, PI / 2 + .1 * k, .62); });
  const b0 = W_(0, 1.82, -5.4); show(BIKES[0], b0.x, b0.y, b0.z, PI / 2, .62);
  LAPS.forEach((l, i) => { const p = W_(1.4, 1.9 + i * .2, 2.2); show(l, p.x, p.y, p.z, PI + (i % 2) * .2, .55); }); TVS.forEach((t, i) => { const p = W_(-1.2, 1.9 + i * 3.2, 3.0); show(t, p.x, p.y, p.z, PI, .55); }); }

// 77 «Am Abend, beim Stadtfest»: grúa sobre la plaza al atardecer: escenario, guirnaldas, puestos, el pueblo entero
shot(95.91, 'I', null, L => { town(L, { dusk: true, fest: true }); audience(L, { mode: 'cheer' });
  cm([28, 38, 30], [20, 26, 22], L.k); camera.lookAt(-6, 2, -40); camera.fov = 50; sh(V(-6, 0, -40), 40); }, [[0, 'cheer', .45], [.3, 'party_horn', .35]]);
// 78 «auf dem Marktplatz,»: el puesto de bratwurst: la gente come y ríe
shot(97.18, 'S', null, L => { town(L, { dusk: true, fest: true }); const s = V(-40, 0, -30); [EX[19], EX[20], KIDS[6]].forEach((c, i) => { const x = s.x + 6.5 + (i === 1 ? 1.2 : 0), z = s.z - 3.2 + i * 3.2; put(c, x, 0, z, PI / 2 + .45 - i * .2);
    actuar(c, 0, [[0, { aRx: 1.9 + Math.sin(L.T * 4 + i) * .2, aRz: -.3, aRe: 2.1, aLx: .3 }]], { T: L.T }); laughF(c, L.T + i); });
  orb(L.k, V(s.x + 4, 3.6, s.z), null, [15, PI / 2 + .45, .12, 44], [13, PI / 2 + .3, .1, 44]); sh(s, 16); }, [[0, 'pan_sizzle', .45], [.4, 'laugh_m', .35]]);
// 79 «schnappte ich mir das Mikrofon»: subo al escenario y agarro el micrófono
shot(98.34, 'C', null, L => { town(L, { dusk: true, fest: true }); const m = onStage(L, { aRx: lerp(.6, 1.7, easeOut(clamp(L.lt / .3))), aRz: -.2, aRe: 1.5, aLx: .4, aLz: .3 }, { expr: 'determined' }); micIn(m);
  orb(L.k, V(STG.x + 1.4, STG.y + 3.2, STG.z), null, [12, .35, -.08, 42], [10.5, .25, -.06, 42]); sh(STG, 14); }, [[0, 'steps', .4], [.3, 'click_metal', .55], [.5, 'radio', .3]]);
// 80 «und schrie:» (zoom lento): cojo aire
shot(99.46, 'Z', 'slow', L => { town(L, { dusk: true, fest: true }); const m = onStage(L, { aRx: 1.9, aRz: -.25, aRe: 1.7, aLx: .4, aLz: .3, lean: -.06, headX: -.08 }, { expr: 'determined', mouth: 'o' }); micIn(m);
  const h = hp(m); cm([h.x + .6, h.y + .2, h.z + 7], [h.x + .4, h.y + .1, h.z + 4.8], easeIn(L.k)); camera.lookAt(h.x, h.y - .7, h.z); camera.fov = 40; sh(STG, 12); }, [[0, 'breath', .5]]);
// 81 «Adrian!»: grito al micrófono; onda expansiva
shot(100.26, 'C', 'punch', L => { town(L, { dusk: true, fest: true }); const m = onStage(L, { aRx: 2.0, aRz: -.25, aRe: 1.6, aLx: .9, aLz: .9, aLe: .4, lean: -.12, headX: -.2 }, { expr: 'shout', eyes: 'angry', mouth: 'scream' }); micIn(m);
  ring(V(STG.x, STG.y + 4, STG.z + 1.5), L.t0, L.T, 14); bubble(m, 'ADRIAN!', clamp(L.lt / .08), 1.3);
  orbit(V(STG.x + 2, STG.y + 3.4, STG.z), 9, .1, .02, 44); sh(STG, 14); }, [[0, 'shout_crowd', .2], [0, 'boom', .45]]);
// 82 «Dreitausend Adrians»: desde detrás de mí: el público entero se gira hacia el escenario
shot(101.12, 'F', null, L => { town(L, { dusk: true, fest: true }); const m = onStage(L, { aRx: 1.6, aRz: -.25, aRe: 1.7, aLx: .4 }, { expr: 'determined' }); micIn(m);
  audience(L, { mode: 'turn', turnAt: L.t0 + .1, expr: 'shock', mouth: 'o' });
  cm([STG.x - 4, STG.y + 7.5, STG.z - 5], [STG.x - 3, STG.y + 7, STG.z - 4.5], L.k); camera.lookAt(AUD.x, 2.5, AUD.z); camera.fov = 52; badge('gold', '3000', W / 2, H * .15, clamp((L.lt - .1) / .15), 1, .95); sh(AUD, 30); }, [[0, 'whoosh_soft', .45], [.15, 'crowd_run', .45]]);
// 83 «drehten sich um.»: plano cenital: miles de caras mirando al escenario
shot(102.47, 'W', null, L => { town(L, { dusk: true, fest: true }); audience(L, { mode: 'turn', turnAt: L.t0 - 2, expr: 'shock', mouth: 'o' }); fireworks(V(-6, 10, -90), L.T, 3, 14);
  cm([AUD.x + 3, 30, STG.z + 2], [AUD.x + 2, 28, STG.z + 4], L.k); camera.lookAt(AUD.x, 0, AUD.z - 4); camera.fov = 52; sh(AUD, 30); }, [[0, 'murmur', .45], [.4, 'firework', .35]]);
// 84 «Alle, außer einem:» (zoom lento): todos mirando a cámara… salvo uno, de espaldas, al fondo
shot(103.47, 'S', 'slow', L => { town(L, { dusk: true, fest: true }); const dp = V(AUD.x + .2, 0, AUD.z + 4.6);
  audience(L, { mode: 'turn', turnAt: L.t0 - 3, expr: 'shock', mouth: 'o', skip: (x, z) => Math.hypot(x - dp.x, z - dp.z) < 2.6 });
  put(det, dp.x, 0, dp.z, 0); actuar(det, 0, [[0, { aLx: .2, aRx: .2 }]], { T: L.T }); cara(det, L.T, { expr: 'neutral' });
  cm([STG.x, STG.y + 11, STG.z + 4], [STG.x, STG.y + 9, STG.z + 9], easeIn(L.k)); camera.lookAt(dp.x, 3.4, dp.z); camera.fov = lerp(42, 28, easeIn(L.k)); sh(AUD, 26); }, [[0, 'heartbeat', .5]]);
// 85 «dem Neuen.»: él, de cara: sudando, pillado
shot(104.79, 'C', 'punch', L => { town(L, { dusk: true, fest: true }); const dp = V(AUD.x + .2, 0, AUD.z + 4.6); put(det, dp.x, 0, dp.z, 0); actuar(det, 0, [[0, { ...GEST.shock, headY: .2 }]], { T: L.T }); cara(det, L.T, { expr: 'shock', eyes: 'wide', mouth: 'grimace' }); sweat(det, L.T, 3);
  audience(L, { mode: 'turn', turnAt: L.t0 - 3, expr: 'shock', skip: (x, z) => Math.hypot(x - dp.x, z - dp.z) < 2.6 || z > dp.z - 1 });
  onFace(det, 5, .2, .3, 40, L.k, 4.4); sh(dp, 14); }, [[0, 'gasp', .5], [.1, 'sad_tone', .3]]);
// 86 «Polizist Adrian packte ihn.»: el policía le agarra del brazo
shot(105.54, 'W', null, L => { town(L, { dusk: true, fest: true }); const dp = V(AUD.x + 6, 0, AUD.z + 12); put(det, dp.x + 1.3, 0, dp.z, -.5); actuar(det, 0, [[0, { ...GEST.cower, headY: -.3 }]], { T: L.T }); cara(det, L.T, { expr: 'scared' }); sweat(det, L.T);
  put(pol, dp.x - 1.5, 0, dp.z - .4, .9); actuar(pol, 0, [[0, { aRx: 1.5, aRz: -.6, aRe: .5, aLx: 1.3, aLz: -.3, aLe: .6, lean: .1 }]], { T: L.T }); cara(pol, L.T, { expr: 'angry', mouth: 'grimace' });
  crowdAt(L, dp.x, dp.z - 2, 8, 5, 10, 86, { mode: 'point', gap: 1.1 });
  orb(L.k, V(dp.x, 3.2, dp.z), null, [12.5, .2, .1, 44], [11, .05, .08, 44]); sh(dp, 16); }, [[0, 'cloth', .55], [.2, 'slap', .4], [.5, 'murmur', .35]]);
// 87 «Wie heißt du wirklich?»: el policía, muy serio
shot(107.17, 'C', null, L => { town(L, { dusk: true, fest: true }); const dp = V(AUD.x + 6, 0, AUD.z + 12); const c = put(pol, dp.x - 1.5, 0, dp.z - .4, .9); actuar(c, 0, [[0, { aRx: 1.5, aRz: -.6, aRe: .5, lean: .1, headY: -.2 }]], { T: L.T }); talk(c, L.T, 107.1, 108, 'angry');
  onFace(c, 4.4, .2, -.4, 40, L.k, 3.9); sh(dp, 12); }, [[0, 'hmm', .35]]);
// 88 «Ähm…»: él suda, mira a un lado
shot(107.97, 'Z', null, L => { town(L, { dusk: true, fest: true }); const dp = V(AUD.x + 6, 0, AUD.z + 12); const c = put(det, dp.x + 1.3, 0, dp.z, -.5); actuar(c, 0, [[0, { aRx: 1.8, aRz: -.6, aRe: 2.2, headY: .3, headZ: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'side_r', mouth: 'wavy' }); sweat(c, L.T, 3);
  onFace(c, 4.2, .1, .3, 40, L.k, 3.6); sh(dp, 12); }, [[0, 'hmm', .45]]);
// 89 «Detlef.»: su placa ya dice la verdad: DETLEF
shot(108.97, 'C', 'punch', L => { town(L, { dusk: true, fest: true }); const dp = V(AUD.x + 6, 0, AUD.z + 12); const c = put(det, dp.x + 1.3, 0, dp.z, -.5); c.setTag('DETLEF'); actuar(c, 0, [[0, { aLx: .2, aRx: .2, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', eyes: 'down', mouth: 'frown' });
  bubble(c, 'Detlef…', clamp(L.lt / .1), 1.4); onBody(c, 6.8, .1, .06, 40, L.k, 6.2); sh(dp, 12); }, [[0, 'sad_tone', .45]]);
// 90 «Lieferwagen fanden wir alles.»: la furgoneta: se abren las puertas: bicis, portátiles, teles
shot(109.80, 'F', null, L => { town(L, { dusk: true, fest: true }); vanLoad(L); VAN.userData.setOpen(easeOut(clamp(L.lt / .45)));
  put(pol, VANP.x - 4.6, 0, VANP.z + 10.5, PI - .6); actuar(pol, 0, [[0, GEST.point]], { T: L.T }); cara(pol, L.T, { expr: 'shock', mouth: 'o' });
  put(me, VANP.x + 4.4, 0, VANP.z + 10.8, PI + .6); actuar(me, 0, [[0, GEST.shock]], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'open_smile' });
  cm([VANP.x + 1.5, 6.6, VANP.z + 22], [VANP.x + 1, 6, VANP.z + 19.5], L.k); camera.lookAt(VANP.x, 3.6, VANP.z + 3); camera.fov = 46; sh(V(VANP.x, 0, VANP.z + 6), 20); }, [[0, 'door_open', .6], [.4, 'ding_reveal', .45]]);
// 91 «Jedes Fahrrad, jeden Laptop»: los vecinos recuperan sus cosas, felices
shot(111.47, 'S', null, L => { town(L, { dusk: true, fest: true }); vanLoad(L); VAN.userData.setOpen(1); const p = V(VANP.x, 0, VANP.z + 14);
  const a = walkTo(EX[2], p.x - 2, p.z - 1, .4, 1.6, L, 0, 7); grin(a, L.T); attach(BIKES[1], a.aR.hand, [0, -2.0, .3], [0, PI / 2, 0], .6);
  const b = put(EX[3], p.x + 2.4, 0, p.z + 1, -.3); actuar(b, 0, [[0, GEST.hold]], { T: L.T }); laughF(b, L.T); attach(LAPS[0], b.aL.hand, [.4, -.4, .4], [0, 0, 0], .55);
  const c = put(EX[21], p.x + 5.5, 0, p.z - 2, -.6); actuar(c, 0, [[0, GEST.cheer]], { T: L.T }); laughF(c, L.T + 2);
  orb(L.k, V(p.x + 1.5, 3, p.z), null, [15, .1, .12, 46], [13, -.05, .1, 46]); sh(p, 18); }, [[0, 'wheels', .45], [.3, 'cheer', .4]]);
// 92 «und das Fahrrad von meinem Bruder.»: saco la bici verde pequeña de la furgoneta
shot(113.15, 'W', null, L => { town(L, { dusk: true, fest: true }); vanLoad(L); VAN.userData.setOpen(1); BIKES[0].visible = false; const p = V(VANP.x + .5, 0, VANP.z + 9.8);
  const m = put(me, p.x, 0, p.z, .2); actuar(m, 0, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.2, aRz: -.2, aLe: .5, aRe: .5, lean: -.05 }]], { T: L.T }); grin(m, L.T);
  show(BIKES[0], p.x + .3, .1 + Math.sin(L.T * 6) * .05, p.z + 2.2, PI / 2 + .2, .62);
  orb(L.k, V(p.x, 2.6, p.z + 1), null, [11, .4, .1, 42], [9.5, .25, .08, 42]); sh(p, 14); }, [[0, 'chain_rattle', .4], [.3, 'bell_far', .45]]);
// 93 «Mein Fahrrad!»: mi hermano abraza su bici; corazones
shot(114.74, 'C', null, L => { town(L, { dusk: true, fest: true }); const p = V(VANP.x - 3, 0, VANP.z + 14); show(BIKES[0], p.x, 0, p.z + 1.6, PI / 2, .62);
  const b = put(bru, p.x - .3, 0, p.z + .2, .1); actuar(b, 0, [[0, { aLx: 1.4, aRx: 1.4, aLz: -.6, aRz: -.6, aLe: .7, aRe: .7, lean: .15, crouch: .1 }]], { T: L.T }); laughF(b, L.T); hearts(V(p.x, 4.2, p.z), L.T);
  bubble(b, 'Mein Fahrrad!', clamp(L.lt / .1), 1.4); onBody(b, 9, .1, .12, 42, L.k, 8); sh(p, 12); }, [[0, 'bell_far', .5], [.2, 'kids_laugh', .4]]);
// 94 «Und dann fing die ganze Stadt an,»: el pueblo me sube a hombros
const shoulders = (L, p) => { const a = put(EX[22], p.x - 1.2, 0, p.z, 0), b = put(EX[23], p.x + 1.2, 0, p.z, 0); [a, b].forEach((c, i) => { actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: i ? .2 : -.1, aRz: i ? -.1 : .2, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(c, L.T + i); });
  const m = put(me, p.x, 5.6 + Math.abs(Math.sin(L.T * 5)) * .3, p.z - .3, 0); return m; };
shot(115.79, 'Z', null, L => { town(L, { dusk: true, fest: true }); const p = V(AUD.x, 0, AUD.z + 4); const m = shoulders(L, p); actuar(m, 0, [[0, { lLx: 1.4, lRx: 1.4, lLk: 1.3, lRk: 1.3, aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5 }]], { T: L.T }); laughF(m, L.T);
  crowdAt(L, p.x, p.z, 14, 4, 11, 94, { mode: 'cheer', gap: 1.0 });
  orb(L.k, V(p.x, 5.4, p.z), null, [17, .15, .06, 46], [15, 0, .05, 46]); sh(p, 18); }, [[0, 'cheer', .55], [.4, 'crowd_run', .35]]);
// 95 «meinen Spitznamen zu rufen:»: los niños levantan la pancarta NIEMAND… ahora con orgullo
shot(117.35, 'S', null, L => { town(L, { dusk: true, fest: true }); const p = V(AUD.x + 14, 0, AUD.z + 8); show(NSIGN, p.x, 1.6, p.z, 0, .9); [KIDS[8], KIDS[9]].forEach((k, i) => { put(k, p.x + (i ? 3.06 : -3.06), Math.abs(Math.sin(L.T * 7 + i)) * .3, p.z - .6, 0); actuar(k, 0, [[0, { aLx: 2.5, aRx: 2.5, aLe: .4, aRe: .4 }]], { T: L.T }); laughF(k, L.T + i); });
  crowdAt(L, p.x, p.z - 2, 8, 4, 9, 95, { mode: 'cheer', from: 10, gap: 1.2 }); hearts(V(p.x, 8, p.z), L.T);
  orb(L.k, V(p.x, 5, p.z), null, [17, -.1, .06, 46], [15, 0, .05, 46]); sh(p, 18); }, [[0, 'cheer', .5], [.4, 'kids_laugh', .35]]);
// 96 «Niemand!»: yo a hombros, brazos arriba, confeti
shot(118.76, 'C', 'punch', L => { town(L, { dusk: true, fest: true }); const p = V(AUD.x, 0, AUD.z + 4); const m = shoulders(L, p); actuar(m, 0, [[0, { lLx: 1.4, lRx: 1.4, lLk: 1.3, lRk: 1.3, ...GEST.cheer }]], { T: L.T }); laughF(m, L.T); confetti(V(p.x, 4, p.z), L.t0, L.T, 60, 1);
  const h = hp(m); cm([h.x + 1, h.y - 2.4, h.z + 8.5], [h.x + .8, h.y - 2.2, h.z + 7.6], L.k); camera.lookAt(h.x, h.y - .8, h.z); camera.fov = 44; sh(p, 14); }, [[0, 'shout_crowd', .5], [.1, 'confetti', .45]]);
// 97 «Niemand!»: el público grita, plano bajo
shot(119.48, 'C', 'punch', L => { town(L, { dusk: true, fest: true }); const p = V(AUD.x + 8, 0, AUD.z + 10); crowdGrid(L, p.x, p.z, 4, 2, 3.4, 3.2, { mode: 'shout', list: [...KIDS.slice(2), ...EX], face: V(p.x, 3, p.z + 20), seed: 97 });
  cm([p.x, 2.2, p.z + 8.5], [p.x, 2.2, p.z + 7.8], L.k); camera.lookAt(p.x, 4, p.z); camera.fov = 52; fireworks(V(p.x, 10, p.z - 60), L.T, 3, 14); sh(p, 16); }, [[0, 'shout_crowd', .5], [.3, 'firework', .4]]);
// 98 «Niemand!»: vista aérea con fuegos artificiales
shot(120.20, 'C', 'punch', L => { town(L, { dusk: true, fest: true }); audience(L, { mode: 'cheer', face: V(AUD.x, 4, AUD.z + 30) }); fireworks(V(-6, 6, -70), L.T, 3, 16);
  cm([AUD.x - 14, 26, AUD.z + 34], [AUD.x - 12, 24, AUD.z + 31], L.k); camera.lookAt(AUD.x, 6, AUD.z - 14); camera.fov = 52; sh(AUD, 30); }, [[0, 'firework', .5], [.2, 'cheer', .45]]);
// 99 «Danach hat die Stadt über eine»: al día siguiente, en la plaza: la pizarra NEUE REGEL
shot(120.98, 'F', null, L => { town(L); RB.visible = true; const p = V(-6, 0, -60); put(pol, p.x + 5, 0, p.z - 2, -.4); actuar(pol, 0, [[0, { ...GEST.point, aRx: 1.9 }]], { T: L.T }); talk(pol, L.T, 120.9, 122, 'talk');
  crowdAt(L, p.x, p.z + 4, 10, 5, 12, 99, { mode: 'idle', expr: 'happy', face: V(p.x, 4, p.z - 6), gap: 1.2 });
  orb(L.k, V(p.x + 1.5, 5.5, p.z - 4), null, [22, .1, .3, 46], [20, 0, .26, 46]); sh(p, 20); }, [[0, 'chalk', .45], [.4, 'murmur', .35]]);
// 100 «neue Regel abgestimmt:»: todos levantan la mano; la pizarra: JA ✓; votos a la urna
shot(122.05, 'W', null, L => { town(L); RB.visible = true; RB.userData.set(L.k > .4 ? 1 : 0); URN.visible = true; const p = V(-6, 0, -60);
  crowdGrid(L, p.x, p.z + 8, 6, 3, 3.6, 3.2, { mode: 'wave', face: V(p.x, 4, p.z - 6), seed: 100 });
  cm([p.x + 6, 13, p.z + 25], [p.x + 4, 12.5, p.z + 23], L.k); camera.lookAt(p.x, 4.5, p.z - 3); camera.fov = 48; sh(V(p.x, 0, p.z + 6), 22); }, [[0, 'cloth', .45], [.45, 'ding_soft', .45], [.6, 'cheer', .35]]);
// 101 «Jeder muss sich einen anderen»: Papa con una placa nueva en blanco y un rotulador, pensando
shot(123.28, 'S', null, L => { town(L); const p = V(10, 0, 20); const c = put(papa, p.x, 0, p.z, .1); c.setTag(null); actuar(c, 0, [[0, { aLx: 1.0, aLz: -.6, aLe: .9, aRx: 1.9, aRz: -.5, aRe: 2.3, headZ: .15 }]], { T: L.T }); cara(c, L.T, { expr: 'confused', eyes: 'up', mouth: 'wavy' });
  const sp = wpos(c.spine); show(TAGBIG, sp.x + .1, sp.y + .9, sp.z + 1.1, .1, .36); TAGBIG.userData.set('?'); const rh = wpos(c.aR.hand); show(PEN, rh.x, rh.y + .3, rh.z + .2, 0, .8);
  onBody(c, 9, .1, .08, 42, L.k, 8); sh(p, 12); }, [[0, 'hmm', .45], [.4, 'pencil', .35]]);
// 102 «Namen aussuchen,»: la profesora y Mama piensan también
shot(124.30, 'Z', null, L => { town(L); const p = V(4, 0, 38); [[lehr, -1.8, .3], [mama, 1.8, -.3]].forEach(([c, dx, ry], i) => { put(c, p.x + dx, 0, p.z, ry); c.setTag(null); actuar(c, 0, [[0, GEST.think]], { T: L.T + i }); cara(c, L.T + i, { expr: 'confused', eyes: 'up' }); });
  badge('q', '?', W / 2, H * .17, clamp(L.lt / .12), 1, .9); orb(L.k, V(p.x, 3.4, p.z), null, [12, .05, .1, 42], [10.5, 0, .08, 42]); sh(p, 14); }, [[0, 'hmm', .4], [.5, 'pencil', .35]]);
// 103 «damit sich nie wieder ein Dieb»: Detlef, esposado junto al coche patrulla
shot(125.26, 'C', null, L => { town(L); const p = V(26, 0, 26); const c = put(det, p.x, 0, p.z, -.4); c.setTag('DETLEF'); actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: -.6, aRz: -.6, aLe: .4, aRe: .4, headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'angry', eyes: 'down', mouth: 'frown' });
  put(pol, p.x + 2.4, 0, p.z - .6, -.9); actuar(pol, 0, [[0, { aLx: 1.2, aLz: -.4, aLe: .5 }]], { T: L.T }); cara(pol, L.T, { expr: 'smug', mouth: 'smirk' });
  onBody(c, 9, .05, .08, 42, L.k, 8); sh(p, 14); }, [[0, 'chain_rattle', .5], [.3, 'siren', .3]]);
// 104 «verstecken kann.»: el coche patrulla se lo lleva; la gente despide
shot(126.29, 'W', null, L => { town(L); PCAR.position.set(30 - L.lt * 12 * Math.sin(.6), 0, 20 - L.lt * 12 * Math.cos(.6)); PCAR.rotation.y = PI - .6;
  crowdAt(L, PCAR.position.x, PCAR.position.z + 4, 8, 6, 11, 104, { mode: 'wave', gap: 1.2 });
  const cp = PCAR.position; cm([cp.x - 4, 7, cp.z + 26], [cp.x - 3, 6.5, cp.z + 22], L.k); camera.lookAt(cp.x, 2.2, cp.z); camera.fov = 46; sh(V(26, 0, 20), 22); }, [[0, 'siren', .45], [.2, 'car_pass', .5]]);
// 105 «Und alle haben Müller gewählt.»: todos se pegan la placa nueva: MÜLLER
shot(127.33, 'F', null, L => { town(L); const p = V(-8, 0, 14); crowdAt(L, p.x, p.z, 18, 3, 12, 105, { mode: 'cheer', tag: 'MÜLLER', full: true }); put(EX[0], p.x, 0, p.z + 3, 0); EX[0].setTag('MÜLLER'); actuar(EX[0], 0, [[0, { aRx: 1.0, aRz: -.75, aRe: 2.0, aLx: 2.7, aLz: .4 }]], { T: L.T }); grin(EX[0], L.T);
  confRain(V(p.x, 0, p.z), L.T, 50, 22, 18, 16); orb(L.k, V(p.x, 2.4, p.z + 3), null, [15, .1, .12, 44], [13, 0, .1, 44]); sh(p, 18); }, [[0, 'tape', .5], [.3, 'cheer', .5]]);
// 106 «Deshalb heißt jetzt in dieser Stadt»: el cartel de la entrada, recién pintado: 3000 Müllers
shot(128.86, 'S', null, L => { town(L); WS.userData.set('Müllers'); const c = V(12, 6.1, 240), r = .25;
  [[KIDS[10], -4.2], [KIDS[11], 4.2]].forEach(([p, dx], i) => { const x = c.x + Math.cos(r) * dx + Math.sin(r) * 3, z = c.z - Math.sin(r) * dx + Math.cos(r) * 3; put(p, x, 0, z, r); p.setTag('MÜLLER'); actuar(p, 0, [[0, GEST.cheer]], { T: L.T + i }); laughF(p, L.T + i); });
  orb(L.k, c, null, [24, .2, .04, 42], [27, .28, .05, 42]); sh(c, 26); }, [[0, 'brush', .5], [.4, 'ding_soft', .4]]);
// 107 «jeder Müller.»: Mama, Papa, la profe, mi hermano, el policía… todos con MÜLLER; el perro también
shot(130.24, 'C', 'punch', L => { town(L); const p = V(-8, 0, 30); [[mama, -3.6, 0], [papa, -1.2, -.7], [lehr, 1.2, -.7], [pol, 3.6, 0]].forEach(([c, dx, dz], i) => { put(c, p.x + dx, 0, p.z + dz, -dx * .06); c.setTag('MÜLLER'); actuar(c, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9 + i) * .3, aRe: .4 }]], { T: L.T }); grin(c, L.T + i); });
  put(bru, p.x - .3, 0, p.z + 2.2, 0); bru.setTag('MÜLLER'); actuar(bru, 0, [[0, GEST.cheer]], { T: L.T }); laughF(bru, L.T); show(DOG, p.x + 2.6, 0, p.z + 2.6, -.3, .7); wag2(L.T);
  orb(L.k, V(p.x, 3.4, p.z), null, [17, 0, .1, 46], [15, 0, .08, 46]); sh(p, 16); }, [[0, 'cheer', .5], [.2, 'bark', .45]]);
const wag2 = T => { DOG.position.y = Math.abs(Math.sin(T * 7)) * .15; DOG.rotation.y += Math.sin(T * 14) * .08; };
// 108 «Und ich überlege,»: yo, pensativo, entre tanto Müller
shot(131.19, 'W', null, L => { town(L); const p = V(-10, 0, 24); const m = put(me, p.x, 0, p.z, .15); actuar(m, 0, [[0, GEST.think]], { T: L.T }); cara(m, L.T, { expr: 'sus', eyes: 'side_l', mouth: 'wavy' });
  crowdAt(L, p.x, p.z, 10, 4.5, 10, 108, { mode: 'idle', tag: 'MÜLLER', expr: 'happy' });
  onBody(m, 9.5, .1, .08, 42, L.k, 8.5); sh(p, 14); }, [[0, 'hmm', .45], [.6, 'tick', .35]]);
// 109 «meinen Namen in Adrian zu ändern.»: me pego la placa ADRIAN y guiño a cámara
shot(132.50, 'Z', null, L => { town(L); const p = V(-10, 0, 24); const m = put(me, p.x, 0, p.z, .15); const on = L.lt > .45; m.setTag(on ? 'ADRIAN' : null);
  actuar(m, L.lt, [[0, { aRx: 1.0, aRz: -.25, aRe: .9 }], [.45, { aLx: .9, aLz: -.75, aLe: 2.0, aRx: 2.7, aRz: .5, aRe: .3 }, { dur: .2 }]], { T: L.T }); cara(m, L.T, on ? { expr: 'wink', eyes: 'wink', mouth: 'smirk' } : { expr: 'smug' });
  if (!on) { attach(TAGBIG, m.aR.hand, [0, -.6, .5], [-1.5, 0, 0], .3 / .82); TAGBIG.userData.set('ADRIAN'); }
  crowdAt(L, p.x, p.z, 10, 4.5, 10, 108, { mode: 'idle', tag: 'MÜLLER', expr: 'happy' });
  onBody(m, 8.5, .1, .06, 40, L.k, 6.8); sh(p, 14); }, [[.45, 'tape', .55], [.6, 'ding_reveal', .45]]);
// ---------- portadas (fuera del vídeo) ----------
// 1: la fuente de la plaza al atardecer, guirnaldas encendidas; todos (con su placa ADRIAN) me señalan; yo en el centro sin placa.
// 2: la clase: todos levantan la mano gritando «HIER!» menos yo, en primera fila; la lista con «Müller – ABWESEND» por encima.
// Tipografías propias de portada (Luckiest Guy / Lilita One), pegatinas 2D por encima, AO y luz cálida.
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .88) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function tagSticker(x, y, s, rot, name = 'ADRIAN') { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 22; c.shadowOffsetY = 8;
  c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(-160, -110, 320, 220, 24); c.fill(); c.shadowColor = 'transparent'; c.lineWidth = 8; c.strokeStyle = '#1a1a2a'; c.stroke();
  c.fillStyle = '#d8202f'; c.beginPath(); c.roundRect(-156, -106, 312, 88, [20, 20, 0, 0]); c.fill(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.font = `46px Lilita`; c.fillText('HALLO', 0, -76); c.font = `24px Lilita`; c.fillText('ich heiße', 0, -38);
  c.fillStyle = '#16161e'; c.font = `70px Lucky`; c.fillText(name, 0, 44); c.restore(); }
function ringMark(x, y, rx, ry, col = '#ff2a4a') { const c = octx; c.save(); c.lineWidth = 20; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12; c.beginPath(); c.ellipse(x, y, rx, ry, -.08, .2, 6.1); c.stroke(); c.restore(); }
function arrowTo(x0, y0, x1, y1, col = '#ff2a4a') { const c = octx, a = Math.atan2(y1 - y0, x1 - x0); c.save(); c.lineWidth = 18; c.lineCap = 'round'; c.strokeStyle = col; c.fillStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12;
  c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2 + 60, (y0 + y1) / 2 - 40, x1, y1); c.stroke(); c.translate(x1, y1); c.rotate(a + .3); c.beginPath(); c.moveTo(14, 0); c.lineTo(-40, -30); c.lineTo(-40, 30); c.closePath(); c.fill(); c.restore(); }
function sparkle(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
function stamp(x, y, rot) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 18; c.fillStyle = '#fffdf2'; c.beginPath(); c.roundRect(-230, -95, 460, 190, 16); c.fill(); c.shadowColor = 'transparent';
  c.strokeStyle = '#9ac0e8'; c.lineWidth = 3; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(-220, -40 + k * 50); c.lineTo(220, -40 + k * 50); c.stroke(); }
  c.textAlign = 'left'; c.textBaseline = 'middle'; c.font = '40px Lilita'; c.fillStyle = '#1a2a6a'; c.fillText('Adrian ..... hier ✓', -205, -62); c.fillText('Adrian ..... hier ✓', -205, -12); c.fillStyle = '#d8202f'; c.font = '46px Lilita'; c.fillText('Müller ... ABWESEND', -205, 46);
  c.strokeStyle = '#d8202f'; c.lineWidth = 7; c.beginPath(); c.ellipse(5, 46, 225, 38, -.03, 0, 7); c.stroke(); c.restore(); }
function finishCover() { grade.uniforms.sharp.value = 1.55; grade.uniforms.vig.value = .55; grade.uniforms.sat.value = 1.5; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); ao.enabled = true; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); const T = 3.3, L = { T, lt: 1, k: 1 }; hideAll(); BAD_.length = 0; BIRDSON = 0;
  if (v === 0) { town(L, { dusk: true, fest: true }); const p = V(-18, 0, -8);
    put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, GEST.shrug]], { T }); cara(me, T, { expr: 'worried', eyes: 'side_l', mouth: 'wavy', noBlink: 1 });
    // burlones alrededor: de 3/4 hacia cámara, señalándome y riéndose, con la placa ADRIAN bien visible
    [[EX[4], -4.1, -.9], [EX[1], 4.1, -.9], [EX[9], -2.6, -4.6], [EX[2], 2.7, -4.8], [KIDS[1], -3.9, 2.4], [KIDS[5], 3.9, 2.2]].forEach(([c, dx, dz], i) => {
      const x = p.x + dx, z = p.z + dz, toMe = Math.atan2(p.x - x, p.z - z); put(c, x, 0, z, toMe * .4); c.setTag('ADRIAN');
      actuar(c, 0, [[0, { aRx: 1.6, aRz: dx < 0 ? -.15 : .05, aRe: .05, aLx: .6, aLz: -.4, aLe: 1.6, lean: -.1 + Math.sin(i) * .04, headX: -.08 }]], { T: T + i }); laughF(c, T + i * .7); });
    cam([p.x, 3.8, p.z + 17.5], [p.x, 2.6, p.z - 4], 50); sh(V(p.x, 0, p.z - 2), 22); hemi.intensity = 1.25; sun.intensity = 2.6; FILL.intensity = 45;
    finishCover();
    const top = proj(V(p.x, 4.75, p.z)), bot = proj(V(p.x, -.1, p.z)), sl = proj(V(p.x - 2.25, 2.6, p.z)), sr = proj(V(p.x + 2.25, 2.6, p.z));
    strokeTxt('IN DIESER STADT', W / 2, H * .18, 112, 'Lucky', ['#ffffff', '#ffe2b8'], '#14143a', 26);
    strokeTxt('HEISST JEDER', W / 2, H * .24, 96, 'Lucky', ['#ffffff', '#ffe2b8'], '#14143a', 24);
    tagSticker(W / 2, H * .315, .74, -.05);
    ringMark((sl[0] + sr[0]) / 2, (top[1] + bot[1]) / 2, (sr[0] - sl[0]) / 2 + 55, (bot[1] - top[1]) / 2 + 45, '#ff0018');
    strokeTxt('… AUSSER MIR', W / 2, Math.min(H * .86, bot[1] + 130), 120, 'Lucky', ['#ff5a5a', '#e0001a'], '#2a0008', 26, -.02);
    sparkle(W * .12, H * .16, 30); sparkle(W * .88, H * .2, 24);
  } else { school(L); classKids(L, { hands: T - 2, shout: true }); const s = V(KX, 0, .6); put(me, s.x, sitY(me), s.z, PI); actuar(me, 0, [[0, seatPose({ aLx: 1.1, aRx: 1.1, aLe: 1.7, aRe: 1.7, aLz: -.35, aRz: -.35, headX: .08 })]], { T }); cara(me, T, { expr: 'sad', eyes: 'worried', mouth: 'frown', noBlink: 1 });
    put(lehr, KX + 7.5, 0, -8.5, -.6); actuar(lehr, 0, [[0, { aLx: 2.6, aLz: .3, aLe: .3 }]], { T }); cara(lehr, T, { expr: 'happy', mouth: 'open_smile', noBlink: 1 });
    cam([KX + 7.5, 11.5, -13], [KX - 1.5, 2.6, 7], 60); sh(V(KX, 0, 4), 22); FILL.intensity = 40; inside(1.05, 40);
    finishCover();
    strokeTxt('ALLE RUFEN „HIER!“', W / 2, H * .2, 104, 'Lilita', ['#7af0ff', '#2aa8ff'], '#071a3a', 24);
    strokeTxt('… AUSSER MIR', W / 2, H * .27, 118, 'Lilita', ['#ffb0d8', '#ff3a8a'], '#3a0420', 26, -.03);
    stamp(W * .5, H * .79, -.04); arrowTo(W * .3, H * .35, W * .53, H * .49, '#ff3a8a'); sparkle(W * .86, H * .33, 30, '#bff6ff'); sparkle(W * .12, H * .3, 22, '#ffd0ea'); } };


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const TRS = { W: 'whoosh_soft', Z: 'swoosh_up', F: 'flash', S: 'swipe', R: 'whirl', I: 'iris_pop', C: 'thump' };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.tr && i + 1 < S.length) CUES.push({ t: +(S[i].t1 - TRW[s.tr] / FPS * .5).toFixed(3), s: TRS[s.tr], g: .5, tr: 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  if (s.zoom === 'punch') CUES.push({ t: s.t0, s: 'impact', g: .7 }); });
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
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .25 * sh_; camera.position.y += (r() - .5) * .25 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, .8); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, MODE === 'night' ? 'noche' : 'polvo', MODE === 'in' ? .2 : .3);
  if (BIRDS.update) BIRDS.update(T, camera.position.clone().addScaledVector(dir, 60).add(V(0, 25, 0)), (MODE === 'day') && BIRDSON ? 1 : 0);
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
  octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { hp, me, KIDS, EX, renderer, composer, bloom, sun, grade, scene, camera, HB, KL, FB, ST, VAN, DOORS };

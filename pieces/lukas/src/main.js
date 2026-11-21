// LUKAS — «In dieser Stadt heißt jeder Junge Lukas und jedes Mädchen Mia… nur ich nicht»: Leon, el único que no se llama Lukas, atrapa al Neuer que recogía todos los paquetes «für Lukas».
// Misma fórmula que ADRIAN con otra ciudad (Lukashausen: patio del colegio, Mensa, Paketshop, estadio, garaje), otro reparto y otros datos. 1080×1920, 30 fps.
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
import { stadion } from './hsets.js';
import { garage } from './wsets.js';
import { cake } from './hsets.js';
import { paketshop, shopFront, automat, booth, cat, sneaker, konsole, kopfhoerer, geschenk, karre, fehlerSign, schulSchild, handy, pkg } from './lsets.js';
import { makeMueller, makeMamaA, makeLehrerin, makeBruder, makePolizist, makeDetlef, makeMutter, makeKidX, nameTag } from './acast.js';
import { welcomeSign, doghouse, attendance, oldLists, niemandSign, bike, bikeRack, brokenLock, notebook, tele, freibad, stage, stand, lieferwagen, frontDoor, ruleBoard, urne, glowM, dynPlane, txt } from './asets.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 129.9, U = W / 720;
const stage_ = document.getElementById('stage'); const renderer = makeRenderer(stage_); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage_.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0006);
const SS = +(new URLSearchParams(location.search).get('ss') ?? 1.5); renderer.setPixelRatio(SS); renderer.setSize(W, H);   // supermuestreo: se renderiza a SS× y se reduce al dibujar
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false; composer.setSize(W, H); grade.uniforms.px.value.set(1 / (W * SS), 1 / (H * SS));
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds?.forEach(c => c.visible = false); if (sky.moon) sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 3; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 2, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
// Adriansfelde (x = 0, Hufenbach rehecho): plaza x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (-6, -92); fuente (-18, -24); café (36, -40); casa familiar (4, 96).
// Klasse (KX = 600): pizarra en z = -15.5, pupitres 3×3 en x ∈ {-11, 0, 11}, z ∈ {-2, 6, 14} (sillas en z + 2.8), mesa de la profesora (-8, -10).
// Freibad (FX = 1800): agua 44×24 centrada (FX, -.15, 0); tumbonas al norte (z ≈ -19); kiosco (FX+24, z = 24); socorrista (FX, z = 15).
// Calle de noche (NX = 1500): puertas en z = 0 mirando +z, x = NX-20, NX, NX+20.
const KX = 600, FX = 1800, NX = 1500, PX = 2400, SX = 3000, GX = 3600, PI_ = Math.PI;
const HB = hufenbach(scene), KL = klasse(scene, KX), FB = freibad(scene, FX);
const NIGHT = new THREE.Group(); scene.add(NIGHT);
// Paketshop (PX): mostrador en z = -4 (dependiente detrás, en z ≈ -6.5), puerta en z = 17
const PS = paketshop(scene, PX);
// estadio (SX): campo x ∈ [-20, 20], z ∈ [-37, 37]; grada a la izquierda (fila r: x = -23.3 - 2.6 r, y = 1.6 + 1.6 r, mirando +x); cabina del speaker arriba en z = 26
const STD = stadion(scene, SX); const BOOTH = booth(STD.g); BOOTH.g.position.set(-36, 12.4, 26); box(8.6, 12.4, 9, mat(0xb8bcc8, { roughness: .8 }), .05, STD.g, -36, 6.2, 26);
// garaje del Neuer (GX): interior x ∈ [-8, 8], z ∈ [-17.6, 0]; portón en z ≈ 0
const GAR = garage(scene, GX);
// Mensa = la clase con el Automat (pared izquierda) y mesas
const AUTO = automat(KL.g); AUTO.position.set(-16.5, 0, -4); AUTO.rotation.y = PI_ / 2;
// la clase: suelo alargado y pared del fondo (z = 20) con puerta, percheros y dibujos de los niños
{ const fl = KL.g.children[0]; const ext = fl.clone(); ext.position.set(0, -.2, 18); ext.scale.set(1, 1, 8 / 32); KL.g.add(ext);
  const wall = KL.g.children[1].clone(); wall.position.set(0, 10, 20); KL.g.add(wall); for (const s of [-1, 1]) { const sw = KL.g.children[2].clone(); sw.position.set(s * 20, 10, 18); sw.scale.set(1, 1, 4 / 32); KL.g.add(sw); }
  const cl = box(40, .4, 8, mat(0xf4f0e8), 0, KL.g, 0, 20, 18);
  box(6, 11, .3, mat(0x8a5a2a, { roughness: .5 }), .1, KL.g, 13, 5.5, 19.8); sphere(.3, mat(0xd9a531, { metalness: .8 }), KL.g, 10.8, 5.5, 19.5, 8, 6);
  for (let k = 0; k < 6; k++) { const d = textPlane(3.2, 2.6, 160, 130, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = ['#ffd23f', '#3ab8ff', '#ff8ad0', '#8ad84a', '#ff8a3a', '#b88aff'][k]; c.beginPath(); c.arc(50 + k * 8, 60, 30, 0, 7); c.fill(); c.fillStyle = '#2a8a3a'; c.fillRect(0, 100, w, 30); txt(c, ['Mama', 'Hund', 'Haus', 'Sonne', 'Papa', 'Ich'][k], w * .7, 30, 26, '#3a3a5a'); }); d.position.set(-15 + k * 4.4, 11, 19.75); d.rotation.y = PI_; d.material.transparent = false; KL.g.add(d); }
  for (let k = 0; k < 8; k++) { box(.3, .3, .8, mat(0xb8bcc4, { metalness: .7 }), .05, KL.g, -16 + k * 3, 6.5, 19.4); box(1.4, 2.4, .6, mat([0xd8323a, 0x2a6ad8, 0xffd23f, 0x2ab86a][k % 4], { roughness: .8 }), .2, KL.g, -16 + k * 3, 5.0, 19.2); } }
const SETS = { HB: HB.G, KL: KL.g, FB: FB.g, NS: NIGHT, PS: PS.g, STD: STD.g, GAR: GAR.g };
[HB.RANK, HB.KINO, HB.BOX, HB.PRICE, HB.TS].forEach(o => o && (o.visible = false));
// relleno del pueblo
townhouse(HB.G, -64, -21, 13, 3, 61, Math.PI / 2); townhouse(HB.G, -64, -34.5, 13, 2, 62, Math.PI / 2);
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3), 70 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 80 + i, Math.PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 90 + i, -Math.PI / 2); }
for (let i = 0, x = -60; x <= 60; x += 18, i++) townhouse(HB.G, x, 150, 16, 2 + (i % 2), 100 + i, Math.PI);
// Paketshop en la plaza (lado este, mirando -x) y cartel del colegio en el patio (norte-oeste)
townhouse(HB.G, 62, 10, 16, 3, 77, -Math.PI / 2); const SHOPF = shopFront(HB.G); SHOPF.position.set(53.6, 0, 10); SHOPF.rotation.y = -Math.PI / 2;
const SCHILD = schulSchild(HB.G); SCHILD.position.set(-24, 0, -54); SCHILD.rotation.y = 0;
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
const GIRLS = new Set([mama, bru, ...KIDS.filter((c, i) => [1, 4, 6].includes(i % 8)), ...EX.filter((c, i) => ['pony', 'long', 'bun'].includes(['fringe', 'pony', 'long', 'swoop', 'curly', 'spiky', 'bun', 'bald'][(i * 3 + 1) % 8]) && i % 6 !== 5)]);
KIDS.forEach(c => kitFace(c, GIRLS.has(c) ? 'girl' : ['kid', 'hero'][c.seed % 2])); EX.forEach((c, i) => kitFace(c, GIRLS.has(c) ? 'girl' : ['plain', 'hero', 'kid', 'mustache'][i % 4]));
POOL.forEach(c => { outline(c.root, 3); c.defTag = c === me ? 'LEON' : GIRLS.has(c) ? 'MIA' : 'LUKAS'; nameTag(c, c.defTag); });
const BOYS = CROWD_ => CROWD_.filter(c => !GIRLS.has(c)), GIRLZ = CROWD_ => CROWD_.filter(c => GIRLS.has(c));
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

const CAT = cat(scene); outline(CAT, 1.8);
const FSIGN = fehlerSign(scene); outline(FSIGN, 1.8);
const SNEAK = [sneaker(scene, 0xffffff, 0xd8323a), sneaker(scene, 0x1a1a24, 0x3ab8ff)]; SNEAK.forEach(o => outline(o, 1.8));
const KONS = [konsole(scene), konsole(scene)]; KONS.forEach(o => outline(o, 1.8));
const KOPF = kopfhoerer(scene); outline(KOPF, 1.8); const GIFT = geschenk(scene); outline(GIFT, 1.8);
const KARRE = karre(scene); outline(KARRE, 1.8); const HANDY = handy(scene); outline(HANDY, 1.8); const CAKE = cake(scene, 0, 1.2); outline(CAKE, 1.8);
const PKGS = Array.from({ length: 26 }, (_, i) => { const r = RNG(i * 7 + 3); const p = pkg(scene, 1.6 + r() * .9, 1 + r() * .9, 1.4 + r() * .6, i % 9 === 4 ? 'MIA' : 'LUKAS', i % 4 === 3 ? 0xb88a50 : null); outline(p, 1.6); return p; });
const PHONES = Array.from({ length: 3 }, () => { const g = new THREE.Group(); scene.add(g); box(1.0, 1.9, .14, mat(0x1a1a22, { metalness: .5, roughness: .3 }), .12, g, 0, 0, 0); box(.86, 1.7, .03, new THREE.MeshStandardMaterial({ color: 0x3ab8ff, emissive: 0x3ab8ff, emissiveIntensity: .9 }), .02, g, 0, 0, .08); outline(g, 1.6); return g; });
const PROPS = [CAT, FSIGN, ...SNEAK, ...KONS, KOPF, GIFT, KARRE, HANDY, CAKE, ...PKGS, ...PHONES, DOG, ATT, OLD, NSIGN, ...BIKES, ...LAPS, ...TVS, ...LOCKS, VAN, SUIT, PHOTO, MEGA, NOTEPAD, CRATE, ICE, TAGBIG, PEN, ST.mic, ...CONF, ...FW, ...DUST, ...SWEAT, ...TEAR, ...HEARTS, ...SPLASH, RING, ZZ];
// ---------- ambiente ----------
const AIR = aire(scene, 220); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; ao.enabled = false; renderer.toneMappingExposure = .96; setSky([.16, .46, .98], [.42, .7, 1], [.8, .92, 1]); if (sky.moon) sky.moon.visible = false; hemi.intensity = .95; hemi.color.setRGB(.9, .95, 1); hemi.groundColor.setRGB(.5, .56, .4); sun.intensity = 3.0; sun.color.setRGB(1, .96, .88); rim.intensity = 1.5;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0006; bloom.strength = .08; bloom.threshold = .95; FILL.intensity = 0; }
function sunset() { MODE = 'dusk'; renderer.toneMappingExposure = 1.0; setSky([.16, .2, .55], [.72, .42, .55], [1, .62, .36]); hemi.intensity = 1.1; hemi.color.setRGB(1, .86, .8); hemi.groundColor.setRGB(.45, .38, .4); sun.intensity = 2.0; sun.color.setRGB(1, .72, .48); rim.intensity = 1.4;
  scene.fog.color.setRGB(.9, .66, .55); scene.fog.density = .0006; bloom.strength = .14; bloom.threshold = .9; FILL.intensity = 30; BIRDSON = 0; }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.08; setSky([.04, .05, .2], [.12, .12, .38], [.3, .22, .48]); if (sky.moon) { sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); } hemi.intensity = 1.2; hemi.color.setRGB(.7, .76, 1); hemi.groundColor.setRGB(.34, .3, .42); sun.intensity = 1.1; sun.color.setRGB(.76, .78, 1); rim.intensity = 1.6;
  scene.fog.color.setRGB(.12, .12, .3); scene.fog.density = .0008; bloom.strength = .18; bloom.threshold = .88; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = 1.1; bloom.strength = .08; bloom.threshold = .95; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.setTag(c.defTag); }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  VAN.userData.setOpen(0); DOORS.forEach(d => d.userData.setOpen(0)); WS.userData.set('Lukas + Mias', 'LUKASHAUSEN'); AUTO.userData.press(0, 0); CAT.userData.tag('LUKAS'); BOOTH.mic.visible = true; if (BOOTH.mic.parent !== BOOTH.stand) { BOOTH.mic.parent.remove(BOOTH.mic); BOOTH.stand.add(BOOTH.mic); BOOTH.mic.position.set(0, 1.7, 0); BOOTH.mic.rotation.set(0, 0, 0); } RB.visible = false; URN.visible = false; RB.userData.set(0); ATT.userData.set(7, false);
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
function school(L) { use('KL'); inside(.95, 26); KL.BB.userData.draw('frau', (c, w, h) => { c.fillStyle = '#1e3a2a'; c.fillRect(0, 0, w, h); txt(c, 'MENSA', w / 2, h * .24, 110, '#ffffff'); txt(c, 'Heute:', w / 2, h * .52, 70, '#ffffff'); txt(c, 'Nudeln 2,50 €', w / 2, h * .8, 74, '#ffd23f'); }); }
function shop(L) { use('PS'); inside(1.0, 40); ao.enabled = true; }
function stadium(L) { use('STD'); day(); STD.SB.userData.set?.(2, 1); }
function garageS(L) { use('GAR'); day(); }
function mensa(L) { school(L); ao.enabled = true; }
// público en la grada del estadio (filas escalonadas, mirando al campo +x); o.turnAt: se giran hacia la cabina (o.face)
function stands(L, o = {}) { const list = (o.list || CROWD); let i = 0; const r = RNG(o.seed || 5); const z0 = o.z0 ?? -18, cols = o.cols ?? 7, rows = o.rows ?? 5;
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) { const c = list[i++]; if (!c) return; const x = SX - 23.3 - row * 2.6, y = 1.6 + row * 1.6, z = z0 + col * 4.2 + (row % 2) * 2.1 + (r() - .5) * .6; if (o.skip && o.skip(x, z, row, col)) continue;
    const pitch = PI / 2 + (r() - .5) * .3, face = o.face ? Math.atan2(o.face.x - x, o.face.z - z) : pitch; const tt = o.turnAt != null ? easeOut(clamp((L.T - o.turnAt - (i % 5) * .04) / .22)) : (o.turned ? 1 : 0);
    put(c, x, y, z, lerp(pitch, face, tt)); if (o.tag !== undefined) c.setTag(o.tag); const T = L.T + i * .37;
    if (o.mode === 'cheer' || (o.mode === 'watch' && Math.sin(L.T * 1.3 + i) > .6)) { const j = Math.abs(Math.sin(L.T * 7 + i)); c.root.position.y = y + j * .35; actuar(c, 0, [[0, { aLx: 2.7, aRx: 2.7, aLz: .4 + j * .2, aRz: .4 + j * .2, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(c, T); }
    else if (o.mode === 'shout') { actuar(c, 0, [[0, { aLx: 2.0, aRx: 2.0, aLz: .9, aRz: .9, aLe: 1.6, aRe: 1.6, lean: -.08, headX: -.15 }]], { T: L.T }); cara(c, T, { expr: 'shout', mouth: 'talk_wide' }); }
    else { actuar(c, 0, [[0, { headY: Math.sin(L.T * .9 + i) * .2, aLx: .2, aRx: .2 }]], { T: L.T }); cara(c, T, { expr: tt > .5 ? (o.expr || 'shock') : 'happy', mouth: tt > .5 ? (o.mouth || 'o') : 'smile' }); } } }
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
const KEY = /^(Stadt|Junge|Lukas|Mädchen|Mia|nicht|Pause|dreihundert|Köpfe|gleichzeitig|Hälfte|Schulhof|Leon|Mama|Geburt|Automat|Mensa|zwei|Knöpfe|Fehler|Einzige|Schwester|Neuer|Hallo|gefreut|vertraut|Nachmittag|Paketshop|Pakete|Paket|Verkäufer|alles|ganzen|Sneaker|Handys|Konsolen|Geburtstagsgeschenk|Kopfhörer|gekommen|versprochen|zurückhole|Polizist|Welchem|Schultern|Hausmeister|gefragt|Dreihundert|meinem|gesehen|Neue|umgedreht|Namen|nachzudenken|abzuholen|ausgelacht|zeigen|Fußballspiel|Samstag|Sprecherkabine|Stadion|geschlichen|Mikrofon|da|Fünftausend|Lukasse|einem|packte|wirklich|Gerhard|Garage|Konsole|niemand|Jungs|Leonie|Katze|geändert)$/;
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
//@@PLANOS@@

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

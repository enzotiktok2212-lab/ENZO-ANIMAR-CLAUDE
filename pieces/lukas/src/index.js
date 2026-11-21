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
const SETS = { HB: HB.G, KL: KL.g, FB: FB.g, NS: NIGHT, PS: PS.g, STD: STD.g, GAR: GAR.g, SH: null };
[HB.RANK, HB.KINO, HB.BOX, HB.PRICE, HB.TS].forEach(o => o && (o.visible = false));
// relleno del pueblo
townhouse(HB.G, -64, -21, 13, 3, 61, Math.PI / 2); townhouse(HB.G, -64, -34.5, 13, 2, 62, Math.PI / 2);
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3), 70 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 80 + i, Math.PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 90 + i, -Math.PI / 2); }
for (let i = 0, x = -60; x <= 60; x += 18, i++) townhouse(HB.G, x, 150, 16, 2 + (i % 2), 100 + i, Math.PI);
// Paketshop en la plaza (lado este, mirando -x) y cartel del colegio en el patio (norte-oeste)
townhouse(HB.G, 62, 10, 16, 3, 77, -Math.PI / 2); const SHOPF = shopFront(HB.G); SHOPF.position.set(53.6, 0, 10); SHOPF.rotation.y = -Math.PI / 2;
const SCHILD = schulSchild(HB.G); SCHILD.position.set(-38, 0, -60); SCHILD.rotation.y = 0;
// calle comercial con el Paketshop (SHX): fachadas en z = 0 mirando +z; tienda en x = SHX; acera z ∈ [0, 6], calzada z ∈ [6, 20]
const SHX = 4200, SHG = new THREE.Group(); SHG.position.x = SHX; scene.add(SHG);
{ const gr = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat(0x9a948a, { roughness: .95 })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; SHG.add(gr);
  box(400, .3, 6, mat(0xc8c2b8, { roughness: .9 }), .05, SHG, 0, .15, 3); box(400, .1, 14, mat(0x4a4a52, { roughness: .9 }), 0, SHG, 0, .05, 13); for (let x = -190; x < 200; x += 10) box(4, .12, .4, mat(0xffffff), 0, SHG, x, .08, 13);
  box(400, .3, 6, mat(0xc8c2b8, { roughness: .9 }), .05, SHG, 0, .15, 23);
  for (let i = -5; i <= 5; i++) { townhouse(SHG, i * 16, -10, 16, 2 + (Math.abs(i) % 3), 130 + i + 5, 0); townhouse(SHG, i * 16 + 8, 36, 16, 2 + (Math.abs(i + 1) % 3), 150 + i + 5, Math.PI); }
  const SF = shopFront(SHG); SF.position.set(0, 0, .25); for (const x of [-30, -12, 12, 30]) { const l = new THREE.Group(); SHG.add(l); l.position.set(x, 0, 5.4); cyl(.18, .22, 9, mat(0x2a2a34, { metalness: .5 }), 8, l, 0, 4.5, 0); sphere(.6, mat(0xfff2d0, { emissive: 0xfff2d0, emissiveIntensity: 1.2 }), l, 0, 9.2, 0, 10, 8); }
} const PCAR2 = polizei(SHG); PCAR2.position.set(-14, 0, 11); PCAR2.rotation.y = Math.PI / 2;
SETS.SH = SHG;
// cartel de bienvenida en la entrada (carretera, mirando al sur +z)
const WS = welcomeSign(HB.G); WS.position.set(12, 0, 240); WS.rotation.y = .25;
// casita del perro junto a la casa familiar
const DH = doghouse(HB.G); DH.position.set(18, 0, 112); DH.rotation.y = -.5; DH.visible = false;
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
function street(L) { SETS.SH.visible = true; day(); }
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
// ---------- a: gancho, el patio, la Mensa, «Fehler», mi hermana (0 – 30,87 s) ----------
const HOUSE = V(14.5, 0, 91.3);          // delante de la puerta de la casa familiar (mira a +x)
const YARD = V(-38, 0, -44);             // patio del colegio (cartel en (-38, -60))
const SIGNP = V(12, 6.1, 240);           // cartel de bienvenida
const MA = V(KX - 12.6, 0, -4);          // delante del Automat de la Mensa (mirando -x)
const BOYZ = BOYS(CROWD), GIRLX = GIRLZ(CROWD);
const welcomeKids = (L, tagA, tagB) => [[KIDS[10], -4.2], [KIDS[1], 4.2]].forEach(([p, dx], i) => { const r = .25, x = SIGNP.x + Math.cos(r) * dx + Math.sin(r) * 3, z = SIGNP.z - Math.sin(r) * dx + Math.cos(r) * 3; put(p, x, 0, z, r); if (tagA) p.setTag(i ? tagB : tagA); actuar(p, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9 + i) * .35, aRe: .5 }]], { T: L.T }); cara(p, L.T + i, { expr: 'happy', mouth: 'open_smile' }); });
const yardKids = (L, n = 16, o = {}) => crowdAt(L, YARD.x, YARD.z, n, 4, 13, o.seed || 7, { list: [...KIDS, ...EX.slice(0, 10)], full: true, ...o });

// 1 «In dieser Stadt heißt jeder» (zoom lento): cartel LUKASHAUSEN – Einwohner: 5000 Lukas + Mias; un niño y una niña saludan
shot(0, 'C', 'slow', L => { town(L); welcomeKids(L);
  orb(L.k, SIGNP, null, [29, .25, .04, 42], [24.5, .25, .03, 42]); sh(SIGNP, 26); }, [[0, 'birds', .5], [.4, 'ding_soft', .4]]);
// 2 «Junge Lukas»: la plaza: un grupo de chicos saluda con su placa LUKAS
shot(1.61, 'W', 'punch', L => { town(L); const c = V(-6, 0, 12); const b = BOYZ[3]; put(b, c.x, 0, c.z, 0); actuar(b, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .35, aRe: .5, aLx: 2.7, aLz: .4 + Math.cos(L.T * 9) * .35, aLe: .5 }]], { T: L.T }); grin(b, L.T);
  crowdAt(L, c.x, c.z - 4, 12, 5, 12, 3, { mode: 'wave', list: BOYZ.filter(x => x !== b), gap: 1.0 });
  orb(L.k, V(c.x, 3.4, c.z), null, [15, .1, .2, 44], [12.5, .05, .14, 44]); sh(c, 22); }, [[0, 'cheer', .45], [.2, 'crowd_run', .3]]);
// 3 «und jedes Mädchen Mia…»: delante de la fuente, las chicas saludan con su placa MIA
shot(2.57, 'S', null, L => { town(L); const c = V(-18, 0, -14); const g = GIRLX[0]; put(g, c.x, 0, c.z, .3); actuar(g, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .35, aRe: .5, aLx: .8, aLz: -.5, aLe: 1.8 }]], { T: L.T }); grin(g, L.T);
  crowdAt(L, c.x, c.z - 3, GIRLX.length - 1, 4.5, 10, 4, { mode: 'wave', list: GIRLX.slice(1), gap: 1.1 });
  orb(L.k, V(c.x, 3.2, c.z), null, [13, .45, .16, 44], [11, .3, .12, 44]); sh(c, 20); }, [[0, 'kids_laugh', .4], [.3, 'pop', .4]]);
// 4 «nur ich nicht.» (zoom lento): yo en medio de todos, con mi placa LEON escrita a mano, aburrido
shot(3.82, 'Z', 'slow', L => { town(L); const c = V(-8, 0, 20); put(me, c.x, 0, c.z, .05); actuar(me, 0, [[0, GEST.cross]], { T: L.T }); cara(me, L.T, { expr: 'bored', eyes: 'half', mouth: 'flat' });
  crowdAt(L, c.x, c.z - 2, 16, 3.5, 11, 5, { mode: 'wave', gap: .9 });
  orb(L.k, V(c.x, 3.0, c.z), null, [13, .05, .12, 42], [8.5, .02, .08, 40], easeIn); sh(c, 18); }, [[0, 'sigh_kid', .45]]);
// 5 «In der Pause»: grúa sobre el patio del colegio: niños jugando, el cartel LUKAS-UND-MIA-GRUNDSCHULE
shot(4.81, 'I', null, L => { town(L); yardKids(L, 18, { mode: 'cheer', seed: 51 });
  cm([YARD.x + 6, 24, YARD.z + 34], [YARD.x + 4, 18, YARD.z + 28], L.k); camera.lookAt(YARD.x - 1, 3, YARD.z - 8); camera.fov = 48; sh(YARD, 30); }, [[0, 'school_bell', .45], [.2, 'kids_laugh', .45]]);
// 6 «wenn einer „Lukas!"»: un niño con las manos en la boca grita LUKAS!
shot(5.83, 'C', null, L => { town(L); const p = V(YARD.x + 6, 0, YARD.z + 8); const k = KIDS[2]; put(k, p.x, 0, p.z, -.4); actuar(k, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .2, aRz: .2, aLe: 2.2, aRe: 2.2, lean: -.12, headX: -.2 }]], { T: L.T }); cara(k, L.T, { expr: 'shout', mouth: 'talk_wide' });
  bubble(k, 'LUKAS!', clamp((L.lt - .25) / .1), 1.6); crowdAt(L, p.x, p.z - 3, 5, 6, 12, 61, { mode: 'idle', list: KIDS.slice(5) });
  onBody(k, 8.4, .15, .08, 42, L.k, 7.4); sh(p, 14); }, [[0, 'kids_laugh', .3], [.3, 'shout_m', .5]]);
// 7 «ruft, und dreihundert Köpfe»: grúa: todos los chicos del patio se giran a la vez; «300»
shot(7.11, 'F', null, L => { town(L); crowdAt(L, YARD.x, YARD.z, 22, 3, 13, 71, { mode: 'turn', turnAt: L.t0 + .35, full: true, list: [...BOYZ, ...GIRLX], jit: .2, expr: 'happy' });
  cm([YARD.x + 4, 22, YARD.z + 28], [YARD.x + 2, 17, YARD.z + 24], L.k); camera.lookAt(YARD.x, 2, YARD.z); camera.fov = 48; badge('gold', '300', W / 2, H * .15, clamp((L.lt - .45) / .15), 1, .95); sh(YARD, 26); }, [[0, 'whoosh_soft', .4], [.35, 'crowd_run', .45]]);
// 8 «drehen sich gleichzeitig um.»: plano bajo: la fila de chicos se gira de golpe hacia cámara
shot(8.59, 'W', null, L => { town(L); const p = V(YARD.x, 0, YARD.z - 2); crowdGrid(L, p.x, p.z, 6, 2, 3.2, 3.4, { mode: 'turn', turnAt: L.t0 + .15, list: BOYZ, face: V(p.x, 3, p.z + 30), seed: 8, expr: 'happy' });
  cm([p.x - 2, 3.2, p.z + 11], [p.x + 2, 3.0, p.z + 10], L.k); camera.lookAt(p.x, 3.4, p.z + 1); camera.fov = 50; sh(p, 18); }, [[0, 'whoosh_soft', .45], [.2, 'cloth', .4]]);
// 9 «Und wenn jemand „Mia!"»: una niña grita MIA!
shot(10.44, 'S', null, L => { town(L); const p = V(YARD.x - 7, 0, YARD.z + 6); const g = GIRLX[2]; put(g, p.x, 0, p.z, .4); actuar(g, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .2, aRz: .2, aLe: 2.2, aRe: 2.2, lean: -.1, headX: -.2 }]], { T: L.T }); cara(g, L.T, { expr: 'shout', mouth: 'talk_wide' });
  bubble(g, 'MIA!', clamp((L.lt - .7) / .1), 1.6); onBody(g, 8.2, -.15, .08, 42, L.k, 7.2); sh(p, 14); }, [[0, 'kids_laugh', .3], [.75, 'shout_m', .45]]);
// 10 «ruft, dreht sich die andere Hälfte»: ahora se giran todas las chicas (los chicos ni se mueven)
shot(11.76, 'C', null, L => { town(L); const p = V(YARD.x, 0, YARD.z); crowdGrid(L, p.x, p.z, 6, 2, 3.2, 3.4, { mode: 'turn', turnAt: L.t0 + .6, list: GIRLX, face: V(p.x, 3, p.z + 30), seed: 10, expr: 'happy' });
  crowdGrid(L, p.x, p.z + 7, 5, 1, 3.6, 3.4, { mode: 'idle', list: BOYZ.slice(6), face: V(p.x - 30, 3, p.z + 8), seed: 11 });
  cm([p.x + 3, 6, p.z + 18], [p.x + 1, 5.5, p.z + 16], L.k); camera.lookAt(p.x, 3, p.z + 2); camera.fov = 50; sh(p, 18); }, [[0, 'whoosh_soft', .4], [.6, 'crowd_run', .35]]);
// 11 «vom Schulhof um.»: vista cenital: chicos a un lado, chicas al otro, todos mirando a cámara
shot(13.10, 'R', null, L => { town(L); crowdGrid(L, YARD.x - 7, YARD.z, 4, 3, 3.4, 3.4, { mode: 'wave', list: BOYZ, seed: 12 }); crowdGrid(L, YARD.x + 7, YARD.z, 3, 3, 3.4, 3.4, { mode: 'wave', list: GIRLX, seed: 13 });
  cm([YARD.x, 30, YARD.z + 16], [YARD.x, 26, YARD.z + 14], L.k); camera.lookAt(YARD.x, 0, YARD.z + 2); camera.fov = 46; sh(YARD, 24); }, [[0, 'whirl', .3], [.3, 'kids_laugh', .4]]);
// 12 «Ich heiße Leon.»: yo, señalando mi placa escrita a mano: LEON
shot(14.40, 'C', 'punch', L => { town(L); const p = V(YARD.x + 3, 0, YARD.z + 10); put(me, p.x, 0, p.z, .2); actuar(me, 0, [[0, { aLx: .9, aLz: -.6, aLe: 1.9, aRx: .3, headZ: .12 }]], { T: L.T }); cara(me, L.T, { expr: 'smug', mouth: 'smirk' });
  crowdAt(L, p.x, p.z - 5, 6, 6, 12, 120, { mode: 'idle', list: KIDS.slice(3) });
  onBody(me, 7.6, .05, .06, 40, L.k, 6.8); sh(p, 14); }, [[0, 'thump', .4], [.2, 'tape', .4]]);
// 13 «Mama sagt, ich sah bei meiner Geburt»: Mama con mi foto de bebé en la puerta de casa; yo de brazos cruzados
const photoFront = (c, fwd = 1.2, y = 2.0, side = 0) => { const a = c.root.rotation.y, p = c.root.position; show(PHOTO, p.x + Math.sin(a) * fwd + Math.cos(a) * side, y, p.z + Math.cos(a) * fwd - Math.sin(a) * side, a, .85); };
shot(15.38, 'W', null, L => { town(L); put(mama, HOUSE.x + 1, 0, HOUSE.z - 1, PI / 2 + .25); actuar(mama, 0, [[0, { aLx: .8, aLz: -.5, aLe: .7, aRx: .8, aRz: -.5, aRe: .7, headZ: .15 + Math.sin(L.T * 3) * .05 }]], { T: L.T }); talk(mama, L.T, 15.3, 16.8);
  photoFront(mama); put(me, HOUSE.x + 3.4, 0, HOUSE.z - 4.2, PI / 2 - .7); actuar(me, 0, [[0, GEST.cross]], { T: L.T }); cara(me, L.T, { expr: 'bored', eyes: 'half' });
  onBody(mama, 11, -.45, .08, 42, L.k, 10, -.35); sh(HOUSE, 16); }, [[0, 'door_creak', .35], [.4, 'hmm', .3]]);
// 14 «einfach nicht aus wie ein Lukas.»: la foto de bebé; Mama inclina la cabeza: «kein Lukas?»
shot(16.80, 'Z', null, L => { town(L); put(mama, HOUSE.x + 1, 0, HOUSE.z - 1, PI / 2 + .25); actuar(mama, 0, [[0, { aLx: .8, aLz: -.5, aLe: .7, aRx: .8, aRz: -.5, aRe: .7, headZ: .3 }]], { T: L.T }); cara(mama, L.T, { expr: 'confused', mouth: 'wavy' });
  photoFront(mama); const a = mama.root.rotation.y, h = hp(mama);
  cm([h.x + Math.sin(a) * 7.5, h.y - .6, h.z + Math.cos(a) * 7.5], [h.x + Math.sin(a) * 6.4, h.y - .6, h.z + Math.cos(a) * 6.4], L.k); camera.lookAt(h.x, h.y - .9, h.z); camera.fov = 40;
  badge('red', 'kein Lukas?', W / 2, H * .16, clamp((L.lt - .5) / .15), 1, .8); sh(HOUSE, 14); }, [[0, 'pop', .4], [.5, 'sad_tone', .3]]);
// 15 «Sogar der Automat in der Mensa»: la Mensa: niños comiendo en las mesas; al fondo el Automat rojo
shot(18.63, 'F', null, L => { mensa(L); classKids(L, { skip: -1, expr: 'happy', face: V(KX, 0, -20) });
  cm([KX + 8, 12, 16], [KX + 5, 11, 13], L.k); camera.lookAt(KX - 13, 4.5, -4); camera.fov = 48; sh(V(KX - 4, 0, 2), 24); }, [[0, 'cafeteria', .45], [.3, 'cutlery', .4]]);
// 16 «hat nur zwei Knöpfe:»: el Automat de cerca: solo dos botones; «2»
shot(20.13, 'S', null, L => { mensa(L); const c = put(me, MA.x + .8, 0, MA.z + 4.4, -PI / 2 - .5); actuar(c, 0, [[0, { aRx: 1.2, aRz: -.2, aRe: .3, headY: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'confused', mouth: 'wavy' });
  cm([KX - 1, 7.2, 3], [KX - 2.5, 6.8, 1.5], L.k); camera.lookAt(KX - 15.5, 5.2, -4); camera.fov = 46; badge('gold', '2', W * .74, H * .2, clamp((L.lt - .35) / .12), 1, 1); sh(V(KX - 15, 0, -4), 14); }, [[0, 'machine_hum', .4], [.35, 'pop', .45]]);
// 17 «Lukas und Mia.»: primer plano de los botones: se ilumina LUKAS… y luego MIA
shot(21.15, 'C', 'punch', L => { mensa(L); AUTO.userData.press(clamp((L.T - 21.15) / .1) * (L.T < 21.7 ? 1 : 0), clamp((L.T - 21.81) / .1));
  cm([KX - 9.6, 6.2, -4.6], [KX - 10.4, 6.0, -5.0], L.k); camera.lookAt(KX - 14.9, 5.8, -5.75); camera.fov = 40; sh(V(KX - 15, 0, -4), 10); }, [[0, 'button', .55], [.66, 'button', .55]]);
// 18 «Deshalb sagen alle nicht Leon zu mir,»: en el patio, los niños me señalan y se ríen
shot(22.42, 'W', null, L => { town(L); const p = V(YARD.x, 0, YARD.z - 4); put(me, p.x, 0, p.z + 4, 0); actuar(me, 0, [[0, { aLx: .4, aRx: .4, aLz: -.4, aRz: -.4, aLe: 1.6, aRe: 1.6, headX: .2 }]], { T: L.T }); cara(me, L.T, { expr: 'sad' });
  crowdAt(L, p.x, p.z + 4, 8, 4.5, 8, 18, { mode: 'point', list: KIDS, gap: 1.0, face: V(p.x, 3, p.z + 4) });
  orb(L.k, V(p.x, 2.8, p.z + 4), null, [12, -.25, .14, 42], [10.5, -.1, .12, 42]); sh(p, 18); }, [[0, 'kids_laugh', .45], [.5, 'murmur', .35]]);
// 19 «sondern „Fehler".»: un niño me señala gritando FEHLER!
shot(24.34, 'C', null, L => { town(L); const p = V(YARD.x, 0, YARD.z - 8); [KIDS[5], KIDS[2], KIDS[7]].forEach((k, i) => crowdGuy(k, p.x + (i - 1) * 3.4, p.z - Math.abs(i - 1) * 1.2, L, i, { mode: i === 1 ? 'point' : 'laugh', face: V(p.x, 0, p.z + 12) }));
  bubble(KIDS[2], 'FEHLER!', clamp((L.lt - .2) / .1), 1.6); orb(L.k, V(p.x, 2.4, p.z), null, [10.5, .05, .06, 44], [9, 0, .04, 44]); sh(p, 14); }, [[0, 'kids_laugh', .55], [.25, 'laugh_m', .3]]);
// 20 «Der Fehler»: los niños levantan la pancarta FEHLER detrás de mí; yo hundido
shot(25.00, 'S', null, L => { town(L); const p = V(YARD.x + 12, 0, YARD.z - 8); show(FSIGN, p.x, 1.6, p.z - 3, 0, .9); [KIDS[8], KIDS[9]].forEach((k, i) => { put(k, p.x + (i ? 3.06 : -3.06), 0, p.z - 3.6, 0); actuar(k, 0, [[0, { aLx: 2.5, aRx: 2.5, aLz: i ? .1 : -.1, aRz: i ? -.1 : .1, aLe: .4, aRe: .4 }]], { T: L.T }); laughF(k, L.T + i); });
  put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, { lean: .08, headX: .12, aLx: .1, aRx: .1, aLz: -.1, aRz: -.1 }]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'frown' });
  orb(L.k, V(p.x, 4.8, p.z - 1.5), null, [16, -.1, .06, 44], [14, 0, .05, 44]); sh(p, 16); }, [[0, 'paper', .5], [.3, 'kids_laugh', .35]]);
// 21 «der Stadt.»: primer plano: lágrima, la pancarta detrás
shot(25.81, 'Z', 'punch', L => { town(L); const p = V(YARD.x + 12, 0, YARD.z - 8); show(FSIGN, p.x, 1.6, p.z - 3, 0, .9); [KIDS[8], KIDS[9]].forEach((k, i) => { put(k, p.x + (i ? 3.06 : -3.06), 0, p.z - 3.6, 0); actuar(k, 0, [[0, { aLx: 2.5, aRx: 2.5, aLe: .4, aRe: .4 }]], { T: L.T }); laughF(k, L.T + i); });
  put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, { headX: .1, aLx: .1, aRx: .1 }]], { T: L.T }); cara(me, L.T, { expr: 'cry', eyes: 'cry', mouth: 'frown' }); tears(me, L.T);
  cm([p.x + .4, 4.4, p.z + 7.6], [p.x + .3, 4.4, p.z + 6.6], L.k); camera.lookAt(p.x, 4.6, p.z - 2); camera.fov = 42; sh(p, 12); }, [[0, 'sad_tone', .5]]);
// 22 «Die Einzige, die Leon zu mir sagt,»: mi hermana pequeña corre hacia mí gritando «Leon!»
shot(26.62, 'W', null, L => { town(L); const b = put(bru, 22, Math.abs(Math.sin(L.T * 14)) * .2, 74 + L.lt * 4.2, 0); actuar(b, 0, [[0, { ...walkP(L.T, 0, 14), aRx: 2.6, aRz: .4, aRe: .3 }]], { T: L.T }); laughF(b, L.T);
  bubble(b, 'Leon!', clamp((L.lt - .6) / .1), 1.6); const bp = b.root.position; orbit(V(bp.x, 2.2, bp.z), 9.5, .25, .06, 42); sh(bp, 14); }, [[0, 'steps_run', .5], [.6, 'kids_laugh', .3]]);
// 23 «ist meine kleine Schwester.»: nos chocamos la mano
shot(28.28, 'F', null, L => { town(L); const p = V(22, 0, 84); put(me, p.x - 1.5, 0, p.z, PI / 2 - .55); put(bru, p.x + 1.5, 0, p.z, -PI / 2 + .55); const hf = L.lt > .3;
  actuar(me, 0, [[0, { aRx: hf ? 2.5 : 2.1, aRz: hf ? -.5 : -.2, aRe: .2 }]], { T: L.T }); actuar(bru, 0, [[0, { aLx: hf ? 2.7 : 2.3, aLz: hf ? -.4 : -.2, aLe: .2 }]], { T: L.T }); grin(me, L.T); laughF(bru, L.T);
  if (hf) confetti(V(p.x, -2, p.z), L.t0 + .3, L.T, 24, .5); orb(L.k, V(p.x, 2.6, p.z), null, [9.5, .05, .08, 42], [8.5, 0, .06, 42]); sh(p, 14); }, [[.3, 'slap', .55], [.35, 'kids_laugh', .3]]);
// 24 «Sie heißt natürlich Mia.»: mi hermana señala su placa MIA; yo detrás, cara de póquer
shot(29.53, 'C', 'punch', L => { town(L); const p = V(22, 0, 84); put(bru, p.x + .8, 0, p.z + 1.5, -.15); actuar(bru, 0, [[0, { aLx: .9, aLz: -.6, aLe: 1.9, aRx: .3, headZ: -.1 }]], { T: L.T }); grin(bru, L.T);
  put(me, p.x - 1.6, 0, p.z - 1.6, .3); actuar(me, 0, [[0, GEST.cross]], { T: L.T }); cara(me, L.T, { expr: 'bored', eyes: 'half', mouth: 'flat' });
  orb(L.k, V(p.x - .2, 2.7, p.z), null, [10, .05, .08, 40], [8.8, .02, .06, 40]); sh(p, 12); }, [[0, 'pop', .45], [.5, 'sigh_kid', .3]]);
// ---------- b: el Neuer, el Paketshop, los paquetes, mi hermana, el policía (30,87 – 66,25 s) ----------
const PLZ = V(-8, 0, 14);                 // centro de la plaza
const STREET = V(22, 0, 84);              // calle delante de casa (mi hermana)
const SHOPD = V(SHX, 0, 4);              // delante de la puerta del Paketshop (calle comercial, fachada en z = 0 mirando +z)
const CLERK = V(PX, 0, -6.8);             // dependiente detrás del mostrador (mira +z)
const CUST = V(PX + .4, 0, -1.3);         // cliente delante del mostrador (mira -z)
// pila de paquetes sobre la carretilla (n = cuántos), en p mirando ry
function tower(n, p, ry = 0) { show(KARRE, p.x, 0, p.z, ry); let y = .45; for (let i = 0; i < n && i < PKGS.length; i++) { const q = PKGS[i], h = q.userData.h; const s = .62; const lx = Math.sin(i * 2.1) * .12, lz = .2 + Math.cos(i * 1.7) * .1;
  show(q, p.x + Math.cos(ry) * lx + Math.sin(ry) * lz, y, p.z - Math.sin(ry) * lx + Math.cos(ry) * lz, ry + Math.sin(i * 3.3) * .2, s); y += h * s; } return y; }
const clerkAt = (L, pose, face) => { const c = put(lehr, CLERK.x, 0, CLERK.z, 0); actuar(c, 0, [[0, pose]], { T: L.T }); cara(c, L.T, face); return c; };

// 25 «Aber eines Tages kam» (zoom lento): la carretera de entrada: un chico desconocido se acerca con su mochila
shot(30.87, 'I', 'slow', L => { town(L); const z = 318 - L.lt * 3.2; walkTo(det, 25, 318, PI, 3.2, L, 0, 7); cara(det, L.T, { expr: 'smug', mouth: 'smirk' });
  grade.uniforms.sat.value = 1.3; cm([26.5, 4.2, z - 30], [26.2, 3.6, z - 21], easeIn(L.k)); camera.lookAt(25, 3.0, z); camera.fov = 38; sh(V(25, 0, z), 20); }, [[0, 'wind', .45], [.3, 'steps', .35]]);
// 26 «ein Neuer in die Stadt.»: pasa junto al cartel LUKASHAUSEN y lo lee sonriendo
shot(32.03, 'S', null, L => { town(L); const r = .25, c = SIGNP; const x = c.x + Math.cos(r) * 4.6 + Math.sin(r) * 3.2, z = c.z - Math.sin(r) * 4.6 + Math.cos(r) * 3.2; put(det, x, 0, z, r + PI * .8);
  actuar(det, L.lt, [[0, { aRx: .3 }], [.3, { aRx: 1.2, aRz: -.3, aRe: 1.6, headY: .3, headX: -.1 }, { dur: .25 }]], { T: L.T }); cara(det, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'squint' });
  orb(L.k, V(c.x + Math.cos(.25) * 2, 5.2, c.z - Math.sin(.25) * 2 + 1.5), null, [25, .3, .06, 44], [22, .24, .05, 44]); sh(c, 20); }, [[0, 'steps', .4], [.35, 'hmm', .35]]);
// 27 «Hallo, ich bin Lukas!»: primer plano: saluda con una sonrisa enorme y su placa LUKAS recién puesta
shot(33.28, 'C', 'punch', L => { town(L); const p = V(-4, 0, 30); put(det, p.x, 0, p.z, .1); actuar(det, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 10) * .35, aRe: .4 }]], { T: L.T }); grin(det, L.T, { mouth: L.T < 33.8 ? 'open_smile' : 'grin' });
  crowdAt(L, p.x, p.z - 3, 6, 6, 12, 27, { mode: 'idle', expr: 'happy', list: EX, from: 8 });
  bubble(det, L.T < 33.8 ? 'Hallo!' : 'Ich bin Lukas!', 1, 1.5); onBody(det, 9.2, .1, .06, 40, L.k, 8.4); sh(p, 16); }, [[0, 'pop', .45], [.55, 'ding_soft', .4]]);
// 28 «Und alle haben sich gefreut.»: la plaza le aclama; confeti
shot(34.70, 'F', null, L => { town(L); put(det, PLZ.x, 0, PLZ.z, 0); actuar(det, 0, [[0, { ...GEST.cheer, aLx: .3, aLz: .1 }]], { T: L.T }); grin(det, L.T);
  crowdAt(L, PLZ.x, PLZ.z, 18, 4.5, 13, 28, { mode: 'cheer', face: V(PLZ.x, 3, PLZ.z), gap: 1.0 }); confRain(V(PLZ.x, 0, PLZ.z), L.T, 60, 22, 18, 16);
  orb(L.k, V(PLZ.x, 3.6, PLZ.z), null, [19, -.2, .26, 46], [16, .05, .22, 46]); sh(PLZ, 22); }, [[0, 'cheer', .6], [.2, 'confetti', .45], [.6, 'party_horn', .4]]);
// 29 «Denn wer hier Lukas heißt,»: Papa (Lukas) le estrecha la mano; los dos señalan su placa LUKAS
shot(36.23, 'W', null, L => { town(L); const p = V(10, 0, 24); put(det, p.x + 1.6, 0, p.z, -PI / 2 + .45); put(papa, p.x - 1.6, 0, p.z, PI / 2 - .45); const s_ = Math.sin(L.T * 14) * .12;
  actuar(det, 0, [[0, { aRx: 1.3 + s_, aRz: -.3, aRe: .4 }]], { T: L.T }); actuar(papa, 0, [[0, { aRx: 1.3 - s_, aRz: -.3, aRe: .4, aLx: .9, aLz: -.6, aLe: 1.9 }]], { T: L.T }); grin(det, L.T); laughF(papa, L.T);
  orb(L.k, V(p.x + .3, 3.2, p.z - .4), null, [12, .08, .1, 42], [10.5, -.05, .08, 42]); sh(p, 14); }, [[0, 'slap', .45], [.4, 'laugh_m', .4]]);
// 30 «dem vertraut man.»: Mama le regala una tarta; corazones
shot(37.57, 'Z', null, L => { town(L); const p = V(10, 0, 24); put(det, p.x + 1.4, 0, p.z, -PI / 2 + .5); actuar(det, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.3, aRz: -.3, aLe: .6, aRe: .6 }]], { T: L.T }); cara(det, L.T, { expr: 'happy', eyes: 'happy', mouth: 'grin' });
  put(mama, p.x - 1.4, 0, p.z, PI / 2 - .5); actuar(mama, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.3, aRz: -.3, aLe: .6, aRe: .6 }]], { T: L.T }); cara(mama, L.T, { expr: 'love', eyes: 'happy', mouth: 'smile' });
  show(CAKE, p.x, 2.55, p.z + .6, 0, .9); hearts(V(p.x, 6.4, p.z), L.T); orb(L.k, V(p.x, 3.2, p.z), null, [11, .05, .1, 42], [9.5, 0, .08, 42]); sh(p, 14); }, [[0, 'aah', .4], [.3, 'ding_soft', .35]]);
// 31 «Noch am selben Nachmittag ging er in den Paketshop»: camina hacia la tienda verde PAKETSHOP
shot(38.52, 'S', null, L => { street(L); const d = walkTo(det, SHOPD.x - 8, SHOPD.z + 1, PI / 2 + .25, 3.4, L, 0, 8); cara(d, L.T, { expr: 'smug', mouth: 'smirk' });
  [EX[12], EX[13], EX[14]].forEach((c, i) => walkTo(c, SHOPD.x + 10 + i * 6, 3 + (i % 2) * 1.5, -PI / 2, 1.6, L, i, 7)); [EX[12], EX[13], EX[14]].forEach((c, i) => cara(c, L.T + i, { expr: 'happy' }));
  cm([SHOPD.x - 10, 6.5, 26], [SHOPD.x - 6, 6, 22], L.k); camera.lookAt(SHOPD.x - 1, 6, 0); camera.fov = 50; sh(V(SHOPD.x, 0, 6), 26); }, [[0, 'steps', .45], [.5, 'city_amb', .35]]);
// 32 «und sagte:»: dentro: entra hasta el mostrador; el dependiente le saluda
shot(40.10, 'C', null, L => { shop(L); const c = clerkAt(L, { aRx: 2.6, aRz: .4 + Math.sin(L.T * 9) * .3, aRe: .4 }, { expr: 'happy', mouth: 'open_smile' });
  walkTo(det, CUST.x, CUST.z + 4.5 - Math.min(L.lt, 1) * 0, PI, 2.4, L, 0, 7); cara(det, L.T, { expr: 'happy', mouth: 'smile' });
  cm([PX + 6, 7, 14], [PX + 5, 6.5, 12], L.k); camera.lookAt(PX, 4, -3); camera.fov = 48; sh(V(PX, 0, -2), 20); }, [[0, 'door_bell', .5], [.3, 'steps', .35]]);
// 33 «Ich hol die Pakete für Lukas ab.»: apoyado en el mostrador, con voz dulce; señala su placa
shot(41.30, 'Z', null, L => { shop(L); clerkAt(L, { aLx: .4, aRx: .4 }, { expr: 'happy', mouth: 'smile' }); const d = put(det, CUST.x, 0, CUST.z, PI - 1.1); actuar(d, 0, [[0, { aLx: .9, aLz: -.6, aLe: 1.9, aRx: .5, aRz: -.1, aRe: .3, lean: .08 }]], { T: L.T }); talk(d, L.T, 41.3, 42.76, 'happy', { eyes: 'happy' });
  bubble(d, 'Pakete für Lukas!', clamp(L.lt / .1), 1.4); const h = hp(d); cm([h.x + 6.6, h.y + .6, h.z + 1.8], [h.x + 5.8, h.y + .5, h.z + 1.6], L.k); camera.lookAt(h.x, h.y - 1.0, h.z); camera.fov = 42; sh(CUST, 12); }, [[0, 'pop', .4]]);
// 34 «Und der Verkäufer gab ihm alles.»: el dependiente, encantado, empuja una montaña de paquetes por el mostrador
shot(42.92, 'W', null, L => { shop(L); const c = clerkAt(L, { aLx: 1.5, aRx: 1.5, aLz: -.2, aRz: -.2, aLe: .3, aRe: .3, lean: .15 + Math.sin(L.T * 6) * .04 }, { expr: 'happy', eyes: 'happy', mouth: 'grin' });
  const k = easeOut(clamp(L.lt / 1.2)); for (let i = 0; i < 6; i++) show(PKGS[i], PX + 1.6 + (i % 3) * 2.2, 4.5 + Math.floor(i / 3) * 1.6, -4.6 + k * 1.2, Math.sin(i) * .2, .7);
  put(det, PX + 6, 0, .6, PI - .5); actuar(det, 0, [[0, GEST.cheer]], { T: L.T }); grin(det, L.T);
  cm([PX - 5, 8.8, 7], [PX - 4.2, 8.4, 6], L.k); camera.lookAt(PX + 2.2, 5.2, -5); camera.fov = 46; sh(V(PX, 0, -3), 14); }, [[0, 'box_slide', .5], [.5, 'box_slide', .45]]);
// 35 «Jedes Paket für jeden Lukas»: las estanterías se vacían: la pila sobre su carretilla crece y crece
shot(44.85, 'F', null, L => { shop(L); const n = 3 + Math.floor(easeOut(clamp(L.lt / 1.1)) * 9); const p = V(PX + 2.6, 0, 4); tower(n, p, PI + .3);
  const d = put(det, p.x - 2.4, 0, p.z + .8, PI - .6); actuar(d, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .2, aRz: .2, aLe: .5, aRe: .5 }]], { T: L.T }); grin(d, L.T);
  clerkAt(L, GEST.wave, { expr: 'happy', mouth: 'open_smile' });
  cm([PX + 9, 6, 15], [PX + 8, 7, 13], L.k); camera.lookAt(p.x - .5, 5, p.z); camera.fov = 48; sh(p, 16); }, [[0, 'box_drop', .5], [.35, 'box_drop', .45], [.7, 'box_drop', .45]]);
// 36 «in der ganzen Stadt.»: sale a la calle empujando una torre de paquetes «LUKAS»
shot(46.03, 'S', null, L => { street(L); const x = SHOPD.x - 1 - L.lt * 2.2, p = V(x, 0, SHOPD.z + 1); tower(14, p, -PI / 2); const d = put(det, x + 2.4, Math.abs(Math.sin(L.T * 9)) * .1, p.z, -PI / 2); actuar(d, 0, [[0, { ...walkP(L.T, 0, 9), aLx: 1.4, aRx: 1.4, aLe: .4, aRe: .4 }]], { T: L.T }); cara(d, L.T, { expr: 'smug', mouth: 'smirk' });
  orb(L.k, V(x, 5, p.z), null, [18, -.5, .12, 46], [16, -.35, .1, 46]); badge('red', 'ALLE LUKAS-PAKETE', W / 2, H * .15, clamp((L.lt - .3) / .15), 1, .7); sh(p, 18); }, [[0, 'wheels', .5], [.4, 'steps', .3]]);
// 37 «Sneaker,»: unas zapatillas nuevas saltan de su caja
shot(47.68, 'C', 'punch', L => { shop(L); const p = V(PX + 3, 4.6, -4); show(PKGS[20], p.x, 4.5, p.z, .3, .8); const k = easeOut(clamp(L.lt / .3)); show(SNEAK[0], p.x - .6, 5.6 + k * 1.2, p.z + .2, .6 + L.lt, .9); show(SNEAK[1], p.x + .8, 5.6 + k * .9, p.z + .3, -.4 - L.lt, .9);
  cm([p.x + 1.4, 8.4, p.z + 9.5], [p.x + 1.1, 8.0, p.z + 8.2], L.k); camera.lookAt(p.x, 6.0, p.z); camera.fov = 40; sh(p, 10); }, [[0, 'box_open', .5], [.1, 'sparkle', .4]]);
// 38 «Handys,»: tres móviles
shot(48.40, 'C', 'punch', L => { shop(L); const p = V(PX - 2, 4.6, -4); PHONES.forEach((ph, i) => { show(ph, p.x - 1.4 + i * 1.4, 5.8 + Math.sin(L.T * 4 + i) * .1, p.z, 0, 1); ph.rotation.z = (i - 1) * .2; });
  cm([p.x + .4, 6.6, p.z + 8.5], [p.x + .2, 6.4, p.z + 7.4], L.k); camera.lookAt(p.x, 5.8, p.z); camera.fov = 40; sh(p, 10); }, [[0, 'phone_buzz', .5]]);
// 39 «Konsolen…»: dos consolas
shot(48.96, 'C', 'punch', L => { shop(L); const p = V(PX + 1, 4.6, -4); KONS.forEach((k, i) => show(k, p.x - 1.9 + i * 3.8, 4.55, p.z + (i ? .4 : 0), (i ? -.4 : .4), .85));
  cm([p.x, 9.6, p.z + 10], [p.x, 9, p.z + 8.6], L.k); camera.lookAt(p.x, 5, p.z); camera.fov = 42; sh(p, 10); }, [[0, 'game_beep', .5]]);
// 40 «und das Geburtstagsgeschenk von meiner Schwester.» (zoom lento): la caja rosa «Für Mia 6» acaba en lo alto de la torre
shot(49.40, 'Z', 'slow', L => { shop(L); const p = V(PX + 2.6, 0, 4); const top = tower(8, p, PI + .3); const k = easeOut(clamp(L.lt / .5)); show(GIFT, p.x, lerp(top + 2.4, top, k), p.z + .2, PI + .1, .75);
  const d = put(det, p.x - 2.4, 0, p.z + .8, PI - .6); actuar(d, 0, [[0, { aLx: 2.8, aRx: .3, aLz: .1, aLe: .3 }]], { T: L.T }); cara(d, L.T, { expr: 'smug', mouth: 'smirk' });
  cm([p.x + 1, top + 1.2, p.z + 9], [p.x + .6, top + .4, p.z + 5.6], easeIn(L.k)); camera.lookAt(p.x, top + .2, p.z); camera.fov = 42; sh(p, 12); }, [[0, 'box_drop', .4]]);
// 41 (pausa) mi hermana espera en la ventana, triste, mirando la calle
shot(51.61, 'W', null, L => { town(L); const p = V(STREET.x, 0, STREET.z); const b = put(bru, p.x, 0, p.z, .3); actuar(b, 0, [[0, { aLx: .4, aRx: .4, aLz: -.3, aRz: -.3, aLe: 1.4, aRe: 1.4, headX: .3, headY: Math.sin(L.T * 1.5) * .4 }]], { T: L.T }); cara(b, L.T, { expr: 'sad', mouth: 'frown' });
  orb(L.k, V(p.x, 2.0, p.z), null, [10, .3, .14, 42], [8.5, .15, .1, 42]); sh(p, 12); }, [[0, 'clock_tick', .4]]);
// 42 «Leon, meine»: llorando, me lo cuenta; yo la escucho
shot(52.70, 'F', null, L => { town(L); const b = put(bru, STREET.x + 1.4, 0, STREET.z, -PI / 2 + .6); actuar(b, 0, [[0, { aLx: .9, aRx: .9, aLz: .2, aRz: .2, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); talk(b, L.T, 52.7, 53.8, 'cry', { eyes: 'cry' }); tears(b, L.T);
  put(me, STREET.x - 1.8, 0, STREET.z - .4, PI / 2 - .6); actuar(me, 0, [[0, GEST.listen]], { T: L.T }); cara(me, L.T, { expr: 'worried' });
  orb(L.k, V(STREET.x - .2, 2.7, STREET.z), null, [10.5, .08, .1, 42], [9.5, 0, .08, 42]); sh(STREET, 12); }, [[0, 'sniff', .45]]);
// 43 «Kopfhörer»: su móvil: «PAKET abgeholt – von: LUKAS»
shot(53.84, 'C', null, L => { town(L); const b = put(bru, STREET.x, 0, STREET.z, 0); actuar(b, 0, [[0, { aRx: 1.5, aRz: -.1, aRe: 1.3, aLx: .4, headX: .35 }]], { T: L.T }); cara(b, L.T, { expr: 'cry', eyes: 'cry', mouth: 'frown' });
  const rh = wpos(b.aR.hand); show(HANDY, rh.x, rh.y + .5, rh.z + .4, 0, .9); HANDY.rotation.x = -.25;
  cm([rh.x + .3, rh.y + 1.1, rh.z + 3.6], [rh.x + .2, rh.y + .9, rh.z + 2.9], L.k); camera.lookAt(rh.x, rh.y + .5, rh.z + .4); camera.fov = 40; sh(STREET, 8); }, [[0, 'phone_buzz', .45], [.3, 'sad_tone', .35]]);
// 44 «sind nicht gekommen!»: brazos abiertos, desconsolada
shot(54.46, 'S', null, L => { town(L); const b = put(bru, STREET.x, 0, STREET.z, -.2); actuar(b, 0, [[0, { aLx: .5, aRx: .5, aLz: .9, aRz: .9, aLe: .5, aRe: .5, headX: -.2 }]], { T: L.T }); talk(b, L.T, 54.4, 55.3, 'cry', { eyes: 'cry' }); tears(b, L.T);
  bubble(b, 'nicht gekommen!', clamp((L.lt - .2) / .1), 1.5); onBody(b, 8.6, .15, .1, 42, L.k, 7.6); sh(STREET, 12); }, [[0, 'cry_girl', .35]]);
// 45 «Also hab ich ihr versprochen,»: me agacho y le pongo la mano en el hombro
shot(55.51, 'W', null, L => { town(L); const b = put(bru, STREET.x + 1.2, 0, STREET.z, -PI / 2 + .5); actuar(b, 0, [[0, { aLx: .3, aRx: .3, headX: .1 }]], { T: L.T }); cara(b, L.T, { expr: 'sad', mouth: 'frown' });
  const m = put(me, STREET.x - 1.2, 0, STREET.z, PI / 2 - .5); actuar(m, 0, [[0, { crouch: .45, lean: .15, aRx: 1.5, aRz: -.15, aRe: .3, headX: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'smile', mouth: 'smile' });
  orb(L.k, V(STREET.x, 2.2, STREET.z), null, [10, -.2, .1, 42], [9, -.05, .08, 42]); sh(STREET, 12); }, [[0, 'cloth', .4], [.5, 'hug', .3]]);
// 46 «dass ich sie zurückhole.» (zoom lento): plano bajo, puño cerrado
shot(56.65, 'Z', 'slow', L => { town(L); const m = put(me, STREET.x - 1.2, 0, STREET.z, .15); actuar(m, 0, [[0, { aRx: 1.9, aRz: -.3, aRe: 2.2, headX: -.08 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'flat' });
  const h = hp(m); cm([h.x + .8, h.y - 1.8, h.z + 7.5], [h.x + .6, h.y - 1.5, h.z + 5.6], easeIn(L.k)); camera.lookAt(h.x, h.y - .4, h.z); camera.fov = 42; sh(STREET, 12); }, [[0, 'heartbeat', .4]]);
// 47 «Polizist Lukas ging in den Paketshop.»: el coche patrulla delante de la tienda; el policía entra
shot(57.78, 'I', null, L => { street(L); const c = walkTo(pol, SHOPD.x - 7, SHOPD.z + 2, PI / 2 + .4, 2.6, L, 0, 7); cara(c, L.T, { expr: 'determined' });
  cm([SHOPD.x - 4, 6, 28], [SHOPD.x - 3, 5.6, 25], L.k); camera.lookAt(SHOPD.x - 4, 5, 2); camera.fov = 50; sh(V(SHOPD.x - 6, 0, 6), 24); }, [[0, 'siren', .35], [.3, 'car_door', .5]]);
// 48 «Wem haben Sie die Pakete gegeben?»: en el mostrador, libreta en mano
shot(59.88, 'C', null, L => { shop(L); clerkAt(L, { aLx: .3, aRx: .3 }, { expr: 'happy', mouth: 'smile' }); const c = put(pol, CUST.x, 0, CUST.z, PI - 1.0); actuar(c, 0, [[0, { aLx: .8, aLz: -.3, aLe: 1.2, aRx: .7, aRz: -.4, aRe: 1.5, headX: .05 }]], { T: L.T }); talk(c, L.T, 59.8, 61.2, 'talk');
  const lh = wpos(c.aL.hand); show(NOTEPAD, lh.x, lh.y + .2, lh.z - .3, PI, 1);
  const h = hp(c); cm([h.x + 6.6, h.y + .6, h.z + 1.8], [h.x + 5.8, h.y + .5, h.z + 1.6], L.k); camera.lookAt(h.x, h.y - .5, h.z); camera.fov = 42; sh(CUST, 12); }, [[0, 'pencil', .45]]);
// 49 «Lukas!»: el dependiente, feliz: LUKAS!
shot(61.45, 'C', 'punch', L => { shop(L); const c = clerkAt(L, { aRx: 2.7, aRz: .3, aRe: .3, aLx: .4 }, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); bubble(c, 'LUKAS!', clamp(L.lt / .08), 1.4);
  onFace(c, 4.4, .2, .3, 40, L.k, 3.9); sh(CLERK, 10); }, [[0, 'pop', .5]]);
// 50 «Welchem denn?»: el policía (con su placa LUKAS), perdido, con un «?» enorme
shot(61.91, 'Z', null, L => { shop(L); const c = put(pol, CUST.x, 0, CUST.z, PI - .15); actuar(c, 0, [[0, { ...GEST.shrug, headZ: .25 }]], { T: L.T }); talk(c, L.T, 61.9, 62.8, 'confused');
  badge('q', '?', W * .72, H * .2, clamp(L.lt / .12), 1, 1); onFace(c, 4.4, .1, -.3, 40, L.k, 3.9); sh(CUST, 12); }, [[0, 'boing_metal', .45]]);
// 51 «Der Verkäufer zuckte nur mit den Schultern.»: el dependiente se encoge de hombros
shot(62.94, 'S', null, L => { shop(L); const c = clerkAt(L, { ...GEST.shrug }, { expr: 'confused', mouth: 'wavy' }); put(pol, CUST.x + 3.5, 0, CUST.z + 1.6, PI + .6); actuar(pol, 0, [[0, GEST.cross]], { T: L.T }); cara(pol, L.T, { expr: 'sus' });
  cm([PX - 3, 10.5, 4], [PX - 2.6, 10, 3.2], L.k); camera.lookAt(PX, 5.4, -6.8); camera.fov = 44; sh(V(PX, 0, -4), 14); }, [[0, 'cloth', .45], [.3, 'hmm', .4]]);
// 52 «Hier heißt doch jeder Lukas.»: travelling por la cola de clientes: LUKAS, LUKAS, LUKAS…
shot(64.79, 'W', null, L => { shop(L); const q = BOYZ.slice(0, 7); q.forEach((c, i) => { put(c, PX - 9 + i * 3, 0, 6, 0); actuar(c, 0, [[0, { aLx: .2, aRx: .2, headY: Math.sin(L.T + i) * .2 }]], { T: L.T }); cara(c, L.T + i, { expr: 'happy' }); });
  const x = lerp(PX - 6, PX + 5, L.k); cam([x, 4.6, 15.2], [x + 1.2, 3.6, 6], 46); sh(V(PX, 0, 8), 16); }, [[0, 'whoosh_soft', .35], [.5, 'murmur', .35]]);
// ---------- c: el Hausmeister, la pista, el policía se ríe, el estadio, el micrófono (66,25 – 97,44 s) ----------
const BENCH = V(YARD.x + 9, 0, YARD.z + 12);   // yo sentado en una caja del patio con un helado (mirando -z… hacia la cámara en +z)
const NEWP = V(YARD.x - 2, 0, YARD.z - 10);    // el Neuer al fondo del patio, de espaldas, con el móvil
const BOOTHW = V(SX - 35.8, 12.8, 27.8);       // yo dentro de la cabina (mirando +x)
const meBench = (L, o = {}) => { show(CRATE, BENCH.x, 0, BENCH.z, 0, .8); const m = put(me, BENCH.x, sitY(me, 1.0), BENCH.z, o.ry ?? 0); actuar(m, 0, [[0, { lLx: 1.4, lRx: 1.4, lLk: 1.2, lRk: 1.2, aRx: 1.7, aRz: -.3, aRe: 2.0, aLx: .3, aLz: .3, headX: .1, ...(o.pose || {}) }]], { T: L.T });
  const rh = wpos(m.aR.hand); show(ICE, rh.x, rh.y + .5, rh.z, 0, 1.1); return m; };
const newcomer = (L, o = {}) => { const d = put(det, NEWP.x, 0, NEWP.z, o.ry ?? PI); actuar(d, 0, [[0, GEST.phone_look || { aRx: 1.4, aRz: -.2, aRe: 1.8, headX: .3 }]], { T: L.T }); cara(d, L.T, { expr: 'smug', eyes: 'down', mouth: 'smirk' }); const rh = wpos(d.aR.hand); show(PHONES[0], rh.x, rh.y + .4, rh.z, d.root.rotation.y, .8); return d; };
const kidsTurned = (L, turnAt, o = {}) => crowdAt(L, YARD.x, YARD.z, 18, 4, 14, o.seed || 56, { mode: 'turn', turnAt, full: true, list: BOYZ, jit: .2, expr: 'happy', face: o.face, gap: .9 });
const HMP = V(YARD.x - 9, 0, YARD.z + 9);       // el Hausmeister, junto a la puerta del colegio

// 53 «Am nächsten Tag in der Pause»: el patio al día siguiente, lleno; la campana
shot(66.25, 'I', null, L => { town(L); yardKids(L, 20, { mode: 'cheer', seed: 53 });
  cm([YARD.x - 10, 20, YARD.z + 30], [YARD.x - 6, 15, YARD.z + 26], L.k); camera.lookAt(YARD.x, 3, YARD.z - 6); camera.fov = 48; sh(YARD, 30); }, [[0, 'school_bell', .5], [.3, 'kids_laugh', .45]]);
// 54 «rief der Hausmeister:»: el Hausmeister, escoba en mano, se lleva la mano a la boca
shot(67.49, 'S', null, L => { town(L); const c = put(mut, HMP.x, 0, HMP.z, .6); actuar(c, 0, [[0, { aLx: 2.2, aLz: .2, aLe: 2.2, aRx: .9, aRz: -.3, aRe: .4, lean: -.06 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'o' });
    orb(L.k, V(HMP.x, 3.4, HMP.z), null, [11, .9, .1, 42], [9.5, .7, .08, 42]); sh(HMP, 14); }, [[0, 'broom', .45], [.4, 'breath', .35]]);
// 55 «Lukas, da hat jemand nach dir gefragt!»: primer plano gritando
shot(68.64, 'C', null, L => { town(L); const c = put(mut, HMP.x, 0, HMP.z, .6); actuar(c, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .2, aRz: .2, aLe: 2.2, aRe: 2.2, lean: -.1, headX: -.15 }]], { T: L.T }); talk(c, L.T, 68.6, 70.4, 'shout');
  bubble(c, 'LUKAS!', clamp(L.lt / .1), 1.4); onFace(c, 4.4, .2, .3, 40, L.k, 3.9); sh(HMP, 12); }, [[0, 'shout_m', .5]]);
// 56 «Dreihundert Köpfe drehten sich um.»: grúa: todos los chicos del patio se giran; «300»
shot(70.36, 'F', null, L => { town(L); kidsTurned(L, L.t0 + .25, { face: V(HMP.x, 3, HMP.z) }); newcomer(L); meBench(L, { ry: -.3 }); cara(me, L.T, { expr: 'happy', eyes: 'closed', mouth: 'smile' });
  cm([YARD.x + 8, 22, YARD.z + 30], [YARD.x + 5, 18, YARD.z + 26], L.k); camera.lookAt(YARD.x, 2, YARD.z); camera.fov = 48; badge('gold', '300', W / 2, H * .15, clamp((L.lt - .3) / .15), 1, .95); sh(YARD, 26); }, [[0, 'whoosh_soft', .4], [.2, 'crowd_run', .45]]);
// 57 «sich um.»: plano bajo: las caras de los chicos, todas giradas hacia el Hausmeister
shot(71.73, 'W', null, L => { town(L); const p = V(YARD.x - 3, 0, YARD.z + 2); crowdGrid(L, p.x, p.z, 5, 2, 3.2, 3.4, { mode: 'turn', turnAt: L.t0 - 2, list: BOYZ, face: V(p.x - 20, 3, p.z + 26), seed: 57, expr: 'happy' });
  cm([p.x - 9, 3.4, p.z + 12], [p.x - 8, 3.2, p.z + 10], L.k); camera.lookAt(p.x, 3.4, p.z + 2); camera.fov = 48; sh(p, 16); }, [[0, 'murmur', .4]]);
// 58 «Außer meinem.»: yo, sentado con mi helado, ni me inmuto
shot(72.59, 'C', 'punch', L => { town(L); const m = meBench(L); cara(m, L.T, { expr: 'happy', eyes: 'closed', mouth: 'smile' });
  cm([BENCH.x + 1.5, 3.4, BENCH.z + 8.6], [BENCH.x + 1.2, 3.2, BENCH.z + 7.6], L.k); camera.lookAt(BENCH.x, 2.6, BENCH.z); camera.fov = 42; sh(BENCH, 12); }, [[0, 'sip', .45]]);
// 59 «Deshalb war ich der Einzige,»: me doy cuenta: abro los ojos de golpe, el helado gotea
shot(73.42, 'S', null, L => { town(L); const m = meBench(L, { pose: { headY: -.25 } }); cara(m, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  const h = hp(m); cm([h.x - 2.6, h.y + .3, h.z + 5.2], [h.x - 2.2, h.y + .2, h.z + 4.6], L.k); camera.lookAt(h.x, h.y - .7, h.z); camera.fov = 40; sh(BENCH, 12); }, [[0, 'ding_soft', .4], [.3, 'drip', .35]]);
// 60 «der es gesehen hat:»: mis ojos se entrecierran (zoom)
shot(74.54, 'Z', null, L => { town(L); const m = meBench(L, { pose: { headY: -.25 } }); cara(m, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' });
  const h = hp(m); cm([h.x - .8, h.y + .7, h.z + 3.4], [h.x - .5, h.y + .7, h.z + 2.6], L.k); camera.lookAt(h.x, h.y + .1, h.z); camera.fov = 38; sh(BENCH, 10); }, [[0, 'tension_str', .35]]);
// 61 «Der Neue hat sich auch nicht umgedreht.» (zoom lento): todos mirando al Hausmeister… menos el Neuer, de espaldas con el móvil
shot(75.53, 'C', 'slow', L => { town(L); crowdAt(L, NEWP.x, NEWP.z, 12, 3.5, 10, 61, { mode: 'turn', turnAt: L.t0 - 3, list: BOYZ, face: V(NEWP.x, 3, NEWP.z + 40), gap: 1.0 }); const d = newcomer(L);
  cm([NEWP.x + .5, 7, NEWP.z + 22], [NEWP.x + .3, 4.6, NEWP.z + 10.5], easeIn(L.k)); camera.lookAt(NEWP.x, 3, NEWP.z); camera.fov = 44; sh(NEWP, 16); }, [[0, 'heartbeat', .45]]);
// 62 «Denn wenn jemand deinen Namen ruft,»: en la calle, una mujer llama a un chico que se aleja
shot(77.39, 'W', null, L => { town(L); const p = V(-14, 0, 30); const a = put(GIRLX[3], p.x - 3, 0, p.z, PI / 2 - .3); actuar(a, 0, [[0, { aRx: 2.2, aRz: .2, aRe: 2.0, aLx: .3 }]], { T: L.T }); talk(a, L.T, 77.3, 78.6, 'happy');
  walkTo(BOYZ[6], p.x + 1.5, p.z - 1.5, PI - .3, 1.6, L, 0, 8); cara(BOYZ[6], L.T, { expr: 'neutral' }); bubble(a, 'Lukas!', clamp((L.lt - .3) / .1), 1.5);
  orb(L.k, V(p.x - .5, 3, p.z - 1.5), null, [16, .25, .12, 46], [14.5, .15, .1, 46]); sh(p, 16); }, [[0, 'steps', .4], [.4, 'pop', .35]]);
// 63 «drehst du dich um,»: ¡zas! se gira al instante
shot(79.05, 'C', 'punch', L => { town(L); const p = V(-14, 0, 30); const c = put(BOYZ[6], p.x + 4.5, 0, p.z - 3, lerp(PI / 2 + .4, -PI / 2 + .3, easeOut(clamp(L.lt / .18)))); actuar(c, 0, [[0, { aLx: .5, aRx: .5, aLz: .5, aRz: .5, lean: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'wide', mouth: 'o' });
  badge('q', '!', W * .7, H * .22, clamp((L.lt - .1) / .1), 1, .9); onBody(c, 9, -.1, .06, 42, L.k, 8); sh(p, 14); }, [[0, 'whoosh_soft', .45], [.1, 'boing_metal', .3]]);
// 64 «ohne nachzudenken.»: hasta el gato (placa LUKAS) gira la cabeza de golpe
shot(79.81, 'R', null, L => { town(L); const DP = V(16.3, 0, 113); show(CAT, DP.x, 0, DP.z, -.5, 1); CAT.userData.head.rotation.y = lerp(1.6, 0, easeOut(clamp((L.lt - .15) / .12))); CAT.userData.tail.rotation.x = Math.sin(L.T * 6) * .3;
  const m = put(mama, DP.x + 4.2, 0, DP.z - 1.6, -.9); actuar(m, 0, [[0, { aRx: 2.2, aRz: .2, aRe: 2.0 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'o' });
  badge('q', '!', W * .5, H * .2, clamp((L.lt - .2) / .1), 1, .8); orb(L.k, V(DP.x + .6, 2.0, DP.z + .5), null, [10, -.5, .1, 42], [8.5, -.4, .08, 42]); sh(DP, 14); }, [[0, 'meow', .55], [.2, 'boing_metal', .3]]);
// 65 «Also hieß er gar nicht»: yo, el dedo en alto: ¡lo tengo!
shot(80.86, 'F', null, L => { town(L); const m = put(me, BENCH.x, 0, BENCH.z + 2, .15); actuar(m, 0, [[0, { aRx: 2.9, aRz: -.2, aRe: .2, aLx: .3, headX: -.05 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', eyes: 'wide', mouth: 'open_smile' });
  onBody(m, 8, .15, .08, 42, L.k, 7); badge('gold', '!', W * .66, H * .2, clamp(L.lt / .1), 1, .8); sh(BENCH, 12); }, [[0, 'ding_reveal', .5]]);
// 66 «Lukas.»: su placa LUKAS, en grande… y tachada
shot(81.46, 'Z', null, L => { town(L); const d = put(det, NEWP.x, 0, NEWP.z, .2); actuar(d, 0, [[0, { aLx: .3, aRx: .3, headX: .2 }]], { T: L.T }); cara(d, L.T, { expr: 'worried', eyes: 'side_l', mouth: 'wavy' }); sweat(d, L.T);
  d.setTag(null); const ch = wpos(d.spine); show(TAGBIG, ch.x + .5, ch.y + 1.5, ch.z + .7, .2, .34); TAGBIG.userData.set('LUKAS', L.lt > .3);
  const a = .2; cm([NEWP.x + .9 + Math.sin(a) * 5, 3.6, NEWP.z + 6], [NEWP.x + .7 + Math.sin(a) * 4, 3.4, NEWP.z + 5], L.k); camera.lookAt(ch.x + .5, ch.y + 1.4, ch.z); camera.fov = 40; sh(NEWP, 12); }, [[0, 'zoom_in', .4], [.3, 'pencil', .55]]);
// 67 «Er hat es nur gesagt,»: el Neuer me guiña un ojo
shot(82.37, 'S', null, L => { town(L); const d = put(det, NEWP.x, 0, NEWP.z, .25); actuar(d, 0, [[0, { aLx: .4, aRx: 1.4, aRz: -.2, aRe: 1.8, headZ: .12 }]], { T: L.T }); cara(d, L.T, { expr: 'wink', eyes: 'wink', mouth: 'smirk' });
  const rh = wpos(d.aR.hand); show(PHONES[0], rh.x, rh.y + .4, rh.z, .25, .8); onFace(d, 5, .2, .3, 42, L.k, 4.4); sh(NEWP, 12); }, [[0, 'evil_laugh', .35]]);
// 68 «um die Pakete abzuholen.»: recuerdo (sepia): él en el mostrador, cogiendo los paquetes
shot(83.37, 'W', null, L => { shop(L); grade.uniforms.sepia.value = .55; clerkAt(L, { aLx: 1.5, aRx: 1.5, aLz: -.2, aRz: -.2, aLe: .3, aRe: .3, lean: .15 }, { expr: 'happy', eyes: 'happy', mouth: 'grin' });
  for (let i = 0; i < 4; i++) show(PKGS[i], PX - 2.4 + (i % 2) * 2.4, 4.5 + Math.floor(i / 2) * 1.6, -4, 0, .7); put(det, CUST.x, 0, CUST.z, PI); actuar(det, 0, [[0, { aLx: 1.6, aRx: 1.6, aLz: -.3, aRz: -.3, aLe: .5, aRe: .5 }]], { T: L.T }); grin(det, L.T);
  cm([PX - 8, 8, 1], [PX - 7, 7.6, 0], L.k); camera.lookAt(PX, 5, -4); camera.fov = 46; sh(V(PX, 0, -3), 14); }, [[0, 'box_slide', .45]]);
// 69 «Ich hab's Polizist Lukas»: corro hasta el policía junto al coche patrulla
shot(84.70, 'C', null, L => { town(L); const p = V(24, 0, 24); put(pol, p.x, 0, p.z, .3); actuar(pol, 0, [[0, GEST.cross]], { T: L.T }); cara(pol, L.T, { expr: 'neutral' });
  const m = put(me, p.x - 6 + L.lt * 4.4, Math.abs(Math.sin(L.T * 14)) * .2, p.z + 2.2, PI / 2 + .2); actuar(m, 0, [[0, walkP(L.T, 0, 14)]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'talk_wide' });
  orb(L.k, V(p.x - 1.5, 3, p.z + 1), null, [13, .1, .1, 44], [11.5, .2, .08, 44]); sh(p, 16); }, [[0, 'steps_run', .55]]);
// 70 «erzählt.»: se lo cuento todo gesticulando
shot(85.52, 'F', null, L => { town(L); const p = V(24, 0, 24); put(pol, p.x + 1.6, 0, p.z, -PI / 2 + .5); actuar(pol, 0, [[0, GEST.cross]], { T: L.T }); cara(pol, L.T, { expr: 'sus', mouth: 'flat' });
  const m = put(me, p.x - 1.6, 0, p.z + .4, PI / 2 - .5); actuar(m, 0, [[0, { aLx: 1.2 + Math.sin(L.T * 9) * .4, aRx: 1.2 + Math.cos(L.T * 8) * .4, aLz: .4, aRz: .4, aLe: .8, aRe: .8 }]], { T: L.T }); talk(m, L.T, 85.5, 86.4, 'determined');
  orb(L.k, V(p.x, 3.2, p.z), null, [11.5, .1, .1, 42], [10.5, -.05, .08, 42]); sh(p, 14); }, [[0, 'whisper', .35]]);
// 71 «Aber er hat mich nur ausgelacht.»: el policía se parte de risa; yo, enfadado
shot(86.51, 'Z', null, L => { town(L); const p = V(24, 0, 24); const c = put(pol, p.x + .6, 0, p.z, -.25); actuar(c, 0, [[0, { aLx: 1.0, aRx: 1.0, aLz: -.5, aRz: -.5, aLe: 1.4, aRe: 1.4, lean: -.15 + Math.sin(L.T * 18) * .06, headX: -.25 }]], { T: L.T }); laughF(c, L.T);
  const m = put(me, p.x - 2.8, 0, p.z - 1.2, .5); actuar(m, 0, [[0, GEST.fists]], { T: L.T }); cara(m, L.T, { expr: 'angry', mouth: 'grimace' });
  onBody(c, 9.5, -.15, .08, 42, L.k, 8.5); sh(p, 14); }, [[0, 'laugh_deep', .55]]);
// 72 «Also musste ich es allen zeigen.»: camino decidido por la calle
shot(88.05, 'S', null, L => { town(L); const m = walkTo(me, 0, 52, PI, 2.4, L, 0, 9); cara(m, L.T, { expr: 'determined', mouth: 'flat' }); const mp = m.root.position;
  orbit(V(mp.x, 2.9, mp.z), 9.5, PI + .2, .05, 42); sh(mp, 14); }, [[0, 'steps', .5]]);
// 73 «Beim Fußballspiel am Samstag»: el estadio lleno; jugadores en el campo
shot(90.00, 'I', null, L => { stadium(L); stands(L, { mode: 'watch', list: CROWD.filter(c => c !== det), cols: 6 });
  [EX[20], EX[21], EX[22], EX[23]].forEach((c, i) => { const x = SX - 8 + i * 5 + Math.sin(L.T + i) * 2, z = -6 + (i % 2) * 9; put(c, x, Math.abs(Math.sin(L.T * 12 + i)) * .2, z, PI / 2 * (i % 2 ? 1 : -1)); actuar(c, 0, [[0, walkP(L.T, i, 13)]], { T: L.T }); cara(c, L.T + i, { expr: 'determined' }); });
  cm([SX + 26, 26, 40], [SX + 18, 20, 32], L.k); camera.lookAt(SX - 18, 4, 0); camera.fov = 50; badge('tag', 'SAMSTAG', W / 2, H * .14, clamp((L.lt - .7) / .15), 1, .9); sh(V(SX - 12, 0, 0), 40); }, [[0, 'stadium', .5], [.3, 'whistle', .45]]);
// 74 «hab ich mich in die»: me cuelo por detrás de la grada, de puntillas
shot(91.28, 'W', null, L => { stadium(L); const m = put(me, SX - 47, 0, 10 + L.lt * 3.4, 0); actuar(m, 0, [[0, GEST.sneak]], { T: L.T }); cara(m, L.T, { expr: 'sus', eyes: 'side_r', mouth: 'flat' });
  const mp = m.root.position; orbit(V(mp.x, 2.6, mp.z), 9, -.9, .1, 42); sh(mp, 14); }, [[0, 'sneak_steps', .45]]);
// 75 «Sprecherkabine vom Stadion geschlichen,»: la cabina del speaker en lo alto; yo entro
shot(91.94, 'S', null, L => { stadium(L); stands(L, { mode: 'watch', list: CROWD.filter(c => c !== det), cols: 6 }); const m = put(me, BOOTHW.x - 1.8 + easeOut(clamp(L.lt / 1)) * 1.8, BOOTHW.y, BOOTHW.z - 2, PI / 2 - .6); actuar(m, 0, [[0, GEST.sneak]], { T: L.T }); cara(m, L.T, { expr: 'sus', eyes: 'side_l' });
  cm([SX - 20, 18, 40], [SX - 22, 17, 37], L.k); camera.lookAt(SX - 35, 15, 26); camera.fov = 44; sh(V(SX - 34, 12, 26), 18); }, [[0, 'door_creak', .45], [.5, 'stadium', .35]]);
// 76 «mir das Mikrofon geschnappt»: agarro el micrófono del soporte
shot(93.76, 'C', null, L => { stadium(L); const m = put(me, BOOTHW.x, BOOTHW.y, BOOTHW.z, PI / 2); const g = L.lt > .35; actuar(m, 0, [[0, { aRx: g ? 1.8 : lerp(.6, 1.5, L.lt / .35), aRz: -.2, aRe: 1.5, aLx: .4, aLz: .3 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'smirk' });
  if (g) attach(BOOTH.mic, m.aR.hand, [0, -.6, .4], [0, 0, 0], 1);
  const h = hp(m); cm([h.x + 7.5, h.y + .5, h.z + 2.2], [h.x + 6.4, h.y + .4, h.z + 1.8], L.k); camera.lookAt(h.x, h.y - .6, h.z); camera.fov = 42; sh(BOOTHW, 12); }, [[0, 'click_metal', .55], [.4, 'radio', .3]]);
// 77 «und gesagt:» (zoom lento): cojo aire
shot(94.92, 'Z', 'slow', L => { stadium(L); const m = put(me, BOOTHW.x, BOOTHW.y, BOOTHW.z, PI / 2); actuar(m, 0, [[0, { aRx: 1.9, aRz: -.25, aRe: 1.7, aLx: .4, aLz: .3, lean: -.06, headX: -.08 }]], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: 'o' }); attach(BOOTH.mic, m.aR.hand, [0, -.6, .4], [0, 0, 0], 1);
  const h = hp(m); cm([h.x + 7, h.y + .2, h.z + 1.4], [h.x + 4.8, h.y + .1, h.z + 1], easeIn(L.k)); camera.lookAt(h.x, h.y - .7, h.z); camera.fov = 40; sh(BOOTHW, 12); }, [[0, 'breath', .5]]);
// 78 «Lukas…»: con voz dulce al micrófono
shot(95.68, 'C', null, L => { stadium(L); const m = put(me, BOOTHW.x, BOOTHW.y, BOOTHW.z, PI / 2); actuar(m, 0, [[0, { aRx: 1.9, aRz: -.25, aRe: 1.7, aLx: .9, aLz: -.4, aLe: 1.2, headZ: .15 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' }); attach(BOOTH.mic, m.aR.hand, [0, -.6, .4], [0, 0, 0], 1);
  bubble(m, 'Lukas…', clamp(L.lt / .1), 1.3); { const h = hp(m); cm([h.x + 5.6, h.y + .5, h.z + 2.2], [h.x + 4.8, h.y + .4, h.z + 1.9], L.k); camera.lookAt(h.x, h.y - .2, h.z); camera.fov = 40; } sh(BOOTHW, 10); }, [[0, 'radio', .35]]);
// 79 «dein Paket ist da!»: grito al micrófono; onda expansiva; el marcador lo repite
shot(96.52, 'C', 'punch', L => { stadium(L); const m = put(me, BOOTHW.x, BOOTHW.y, BOOTHW.z, PI / 2); actuar(m, 0, [[0, { aRx: 2.0, aRz: -.25, aRe: 1.6, aLx: .9, aLz: .9, aLe: .4, lean: -.12, headX: -.2 }]], { T: L.T }); cara(m, L.T, { expr: 'shout', eyes: 'happy', mouth: 'scream' }); attach(BOOTH.mic, m.aR.hand, [0, -.6, .4], [0, 0, 0], 1);
  ring(V(BOOTHW.x + 2, BOOTHW.y + 4.5, BOOTHW.z), L.t0, L.T, 14); bubble(m, 'DEIN PAKET IST DA!', clamp(L.lt / .08), 1.3);
  const h = hp(m); cm([h.x + 8.5, h.y - .4, h.z + 2.2], [h.x + 7.8, h.y - .3, h.z + 2], L.k); camera.lookAt(h.x, h.y - .4, h.z); camera.fov = 44; sh(BOOTHW, 14); }, [[0, 'shout_crowd', .2], [0, 'boom', .45]]);
// ---------- d: 5000 Lukasse, Gerhard, el garaje, «Fehler!», todos se llaman Leon, el final (97,44 – 129,9 s) ----------
const BFACE = V(SX - 34, 16, 26);          // la cabina, hacia donde se gira la grada
const DETS = { row: 1, col: 2 };            // el Neuer en la grada: fila 1, columna 2
const detSeat = () => { const row = DETS.row, col = DETS.col; return V(SX - 23.3 - row * 2.6, 1.6 + row * 1.6, -18 + col * 4.2 + (row % 2) * 2.1); };
const standsT = (L, o = {}) => stands(L, { list: CROWD.filter(c => c !== det), cols: 6, skip: (x, z, r, c) => r === DETS.row && c === DETS.col, ...o });
const GP = V(GX, 0, -8);                    // montaña de paquetes en el garaje
function garagePile(L, gone = 0) { PKGS.forEach((q, i) => { if (i < gone) return; const r = RNG(i * 5 + 1); const x = GP.x - 5 + (i % 6) * 2.1 + (r() - .5) * .5, z = GP.z - 3 + Math.floor(i / 6) % 2 * 2.6 + (r() - .5) * .6, y = Math.floor(i / 12) * 1.5; show(q, x, y, z, (r() - .5) * .5, .8); });
  KONS.forEach((k, i) => show(k, GP.x - 3 + i * 5, 3.2, GP.z + 1.2, .3 - i * .5, .8)); SNEAK.forEach((s, i) => show(s, GP.x + 2 + i * 1.4, 3.1, GP.z + 2, 1 + i, .9)); }
const shouldersS = (L, p) => { const a = put(EX[22], p.x - 1.2, 0, p.z, PI / 2), b = put(EX[23], p.x + 1.2, 0, p.z, PI / 2); [a, b].forEach((c, i) => { c.root.position.set(p.x, 0, p.z + (i ? 1.2 : -1.2)); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: i ? .2 : -.1, aRz: i ? -.1 : .2, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(c, L.T + i); });
  return put(me, p.x - .3, 5.6 + Math.abs(Math.sin(L.T * 5)) * .3, p.z, PI / 2); };
const LEONS = c => c.setTag(GIRLS.has(c) ? 'LEONIE' : 'LEON');

// 80 «Fünftausend Lukasse»: toda la grada se gira a la vez hacia la cabina; «5000»
shot(97.44, 'F', null, L => { stadium(L); standsT(L, { turnAt: L.t0 + .1, face: BFACE, expr: 'shock' }); const d = put(det, ...detSeat().toArray(), PI / 2); actuar(d, 0, [[0, { aLx: .2, aRx: .2 }]], { T: L.T }); cara(d, L.T, { expr: 'neutral' });
  cm([SX - 4, 14, -24], [SX - 6, 13, -21], L.k); camera.lookAt(SX - 30, 6, 4); camera.fov = 50; badge('gold', '5000', W / 2, H * .15, clamp((L.lt - .2) / .15), 1, .95); sh(V(SX - 30, 0, -6), 34); }, [[0, 'whoosh_soft', .45], [.15, 'crowd_run', .45]]);
// 81 «drehten sich gleichzeitig um.»: desde la cabina: miles de caras mirándome
shot(99.02, 'W', null, L => { stadium(L); standsT(L, { turned: true, face: BFACE, expr: 'shock' }); const d = put(det, ...detSeat().toArray(), PI / 2); cara(d, L.T, { expr: 'neutral' }); actuar(d, 0, [[0, {}]], { T: L.T });
  cm([SX - 27, 21, 21], [SX - 26, 20, 19], L.k); camera.lookAt(SX - 30, 4, -6); camera.fov = 52; sh(V(SX - 30, 0, -6), 34); }, [[0, 'murmur', .45]]);
// 82 «Alle, außer einem.» (zoom lento): todos mirando a la cabina… menos uno, que sigue mirando el partido
shot(100.64, 'S', 'slow', L => { stadium(L); standsT(L, { turned: true, face: BFACE, expr: 'shock' }); const dp = detSeat(); const d = put(det, dp.x, dp.y, dp.z, PI / 2); actuar(d, 0, [[0, { aLx: .3, aRx: .3, headY: .1 }]], { T: L.T }); cara(d, L.T, { expr: 'happy', mouth: 'smile' });
  cm([SX - 26, 16, 28], [dp.x + 3, dp.y + 5, dp.z + 9], L.k, easeIn); camera.lookAt(dp.x, dp.y + 3, dp.z); camera.fov = lerp(46, 30, easeIn(L.k)); sh(dp, 20); }, [[0, 'heartbeat', .5]]);
// 83 «Polizist Lukas packte ihn.»: el policía le agarra del brazo en la grada
shot(101.99, 'C', 'punch', L => { stadium(L); standsT(L, { turned: true, face: V(SX - 26, 4, -9), expr: 'shock', mode: 'point' }); const dp = detSeat(); const d = put(det, dp.x, dp.y, dp.z, -.5 + PI / 2); actuar(d, 0, [[0, { ...GEST.cower, headY: -.3 }]], { T: L.T }); cara(d, L.T, { expr: 'scared' }); sweat(d, L.T);
  put(pol, dp.x - .4, dp.y, dp.z - 2.4, 0); pol.root.rotation.y = faceTo(pol.root.position, d.root.position); actuar(pol, 0, [[0, { aRx: 1.5, aRz: -.6, aRe: .5, aLx: 1.3, aLz: -.3, aLe: .6, lean: .1 }]], { T: L.T }); cara(pol, L.T, { expr: 'angry', mouth: 'grimace' });
  orbit(V(dp.x - .2, dp.y + 3.4, dp.z - 1.2), 9, .55, .2, 44); sh(dp, 16); }, [[0, 'cloth', .55], [.2, 'slap', .4], [.5, 'murmur', .35]]);
// 84 «Wie heißt du wirklich?»: el policía, muy serio
shot(103.69, 'Z', null, L => { stadium(L); const dp = detSeat(); const c = put(pol, dp.x + 1.6, dp.y, dp.z - 1.8, PI / 2 + .5); actuar(c, 0, [[0, { aRx: 1.5, aRz: -.6, aRe: .5, lean: .1, headY: -.2 }]], { T: L.T }); talk(c, L.T, 103.6, 104.4, 'angry');
  onFace(c, 4.4, .2, -.4, 40, L.k, 3.9); sh(dp, 12); }, [[0, 'hmm', .35]]);
// 85 «Ähm…»: él suda, mira a un lado
shot(104.43, 'C', null, L => { stadium(L); const dp = detSeat(); const c = put(det, dp.x, dp.y, dp.z, PI / 2 - .4); actuar(c, 0, [[0, { aRx: 1.8, aRz: -.6, aRe: 2.2, headY: .3, headZ: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'side_r', mouth: 'wavy' }); sweat(c, L.T, 3);
  onFace(c, 4.2, .1, .3, 40, L.k, 3.6); sh(dp, 12); }, [[0, 'hmm', .45]]);
// 86 «Gerhard.»: su placa ya dice la verdad: GERHARD
shot(105.24, 'C', 'punch', L => { stadium(L); const dp = detSeat(); const c = put(det, dp.x, dp.y, dp.z, PI / 2 - .4); c.setTag('GERHARD'); actuar(c, 0, [[0, { aLx: .2, aRx: .2, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', eyes: 'down', mouth: 'frown' });
  bubble(c, 'Gerhard…', clamp(L.lt / .1), 1.4); c.root.rotation.y = .47; orbit(V(dp.x, dp.y + 3, dp.z), lerp(6.6, 5.8, L.k), .47, .15, 40); sh(dp, 12); }, [[0, 'sad_tone', .45]]);
// 87 «In seiner Garage lag alles.»: el portón del garaje: una montaña de paquetes; el policía y yo, boquiabiertos
shot(105.87, 'F', null, L => { garageS(L); garagePile(L); show(GIFT, GP.x + 1, 4.6, GP.z - .5, .2, .7);
  put(pol, GX - 4, 0, 6, PI + .3); actuar(pol, 0, [[0, GEST.point]], { T: L.T }); cara(pol, L.T, { expr: 'shock', mouth: 'o' }); put(me, GX + 3.6, 0, 6.4, PI - .3); actuar(me, 0, [[0, GEST.shock]], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'open_smile' });
  cm([GX + 1, 7.4, 22], [GX + .6, 6.6, 18.5], L.k); camera.lookAt(GX, 3.6, -4); camera.fov = 48; sh(V(GX, 0, -2), 20); }, [[0, 'garage_door', .6], [.4, 'ding_reveal', .45]]);
// 88 «Jedes Paket, jede Konsole…»: los vecinos recuperan sus cosas, felices
shot(107.54, 'S', null, L => { garageS(L); garagePile(L, 8); show(GIFT, GP.x + 1, 4.6, GP.z - .5, .2, .7); const p = V(GX, 0, 5);
  const a = walkTo(BOYZ[2], p.x - 2, p.z - 1, .4, 1.6, L, 0, 7); grin(a, L.T); attach(PKGS[0], a.aR.hand, [0, -1.4, .9], [0, 0, 0], .5);
  const b = put(GIRLX[1], p.x + 2.4, 0, p.z + 1, -.3); actuar(b, 0, [[0, GEST.hold]], { T: L.T }); laughF(b, L.T); attach(PKGS[1], b.aL.hand, [.4, -.6, .6], [0, 0, 0], .45);
  const c = put(BOYZ[4], p.x + 5.5, 0, p.z - 2, -.6); actuar(c, 0, [[0, GEST.cheer]], { T: L.T }); laughF(c, L.T + 2); attach(KONS[0], c.aR.hand, [0, .5, .5], [0, 0, 0], .5);
  orb(L.k, V(p.x + 1.5, 3, p.z), null, [15, .1, .12, 46], [13, -.05, .1, 46]); sh(p, 18); }, [[0, 'box_slide', .45], [.3, 'cheer', .4]]);
// 89 «und die Kopfhörer von meiner Schwester.»: saco la caja rosa «Für Mia 6» del montón
shot(109.12, 'W', null, L => { garageS(L); garagePile(L, 10); const p = V(GX + .5, 0, -1.5); const m = put(me, p.x, 0, p.z, .1); actuar(m, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.25, aRz: -.25, aLe: .6, aRe: .6, lean: -.05 }]], { T: L.T }); grin(m, L.T);
  show(GIFT, p.x + .1, 2.4 + Math.sin(L.T * 6) * .05, p.z + 1.6, .1, .65);
  orb(L.k, V(p.x, 2.8, p.z + 1), null, [10.5, .3, .1, 42], [9, .15, .08, 42]); sh(p, 14); }, [[0, 'box_slide', .4], [.3, 'sparkle', .45]]);
// 90 «Meine Kopfhörer!»: mi hermana, con sus cascos rosas puestos, feliz; corazones
shot(111.06, 'C', null, L => { town(L); const b = put(bru, STREET.x, Math.abs(Math.sin(L.T * 8)) * .3, STREET.z, .1); actuar(b, 0, [[0, { aLx: 2.7, aRx: 2.7, aLz: .4, aRz: .4, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(b, L.T);
  attach(KOPF, b.head, [0, .95, 0], [0, 0, 0], 1.05); hearts(V(STREET.x, 4.4, STREET.z), L.T); bubble(b, 'Meine Kopfhörer!', clamp(L.lt / .1), 1.8);
  onFace(b, 6, .3, .3, 42, L.k, 5.2); sh(STREET, 12); }, [[0, 'kids_laugh', .45], [.2, 'sparkle', .4]]);
// 91 «Und das ganze Stadion fing an zu rufen:»: en el campo, me suben a hombros; la grada aplaude
shot(112.11, 'Z', null, L => { stadium(L); standsT(L, { mode: 'cheer', face: V(SX, 4, 0) }); const p = V(SX - 12, 0, 2); const m = shouldersS(L, p); actuar(m, 0, [[0, { lLx: 1.4, lRx: 1.4, lLk: 1.3, lRk: 1.3, aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5 }]], { T: L.T }); laughF(m, L.T);
  orb(L.k, V(p.x, 6.8, p.z), null, [19, PI / 2 + .3, .08, 46], [16, PI / 2 + .1, .06, 46]); sh(p, 22); }, [[0, 'cheer', .55], [.4, 'stadium', .4]]);
// 92 «rufen:»: los niños levantan la pancarta FEHLER… ahora con orgullo
shot(113.27, 'S', null, L => { stadium(L); const p = V(SX - 10, 0, -10); show(FSIGN, p.x, 1.6, p.z, PI / 2, .9); [KIDS[8], KIDS[9]].forEach((k, i) => { put(k, p.x - .6, Math.abs(Math.sin(L.T * 7 + i)) * .3, p.z + (i ? -3.06 : 3.06), PI / 2); actuar(k, 0, [[0, { aLx: 2.5, aRx: 2.5, aLe: .4, aRe: .4 }]], { T: L.T }); laughF(k, L.T + i); });
  hearts(V(p.x, 8, p.z), L.T); orb(L.k, V(p.x, 5, p.z), null, [17, PI / 2 - .1, .06, 46], [15, PI / 2, .05, 46]); sh(p, 18); }, [[0, 'cheer', .5], [.4, 'kids_laugh', .35]]);
// 93 «Fehler!»: yo a hombros, brazos arriba, confeti
shot(114.55, 'C', 'punch', L => { stadium(L); const p = V(SX - 12, 0, 2); const m = shouldersS(L, p); actuar(m, 0, [[0, { lLx: 1.4, lRx: 1.4, lLk: 1.3, lRk: 1.3, ...GEST.cheer }]], { T: L.T }); laughF(m, L.T); confetti(V(p.x, 4, p.z), L.t0, L.T, 60, 1);
  const h = hp(m); cm([h.x + 8.5, h.y - 2.4, h.z + 1], [h.x + 7.6, h.y - 2.2, h.z + .8], L.k); camera.lookAt(h.x, h.y - .8, h.z); camera.fov = 44; sh(p, 14); }, [[0, 'shout_crowd', .5], [.1, 'confetti', .45]]);
// 94 «Fehler!»: la grada grita, plano bajo
shot(115.29, 'C', 'punch', L => { stadium(L); standsT(L, { mode: 'shout', face: V(SX, 4, 0) });
  cm([SX - 14, 2.6, -2], [SX - 14.6, 2.6, -1.6], L.k); camera.lookAt(SX - 30, 7, -4); camera.fov = 52; fireworks(V(SX - 40, 14, -10), L.T, 3, 14); sh(V(SX - 28, 0, -4), 26); }, [[0, 'shout_crowd', .5], [.3, 'firework', .4]]);
// 95 «Fehler!»: vista aérea del estadio con fuegos artificiales
shot(116.09, 'C', 'punch', L => { stadium(L); standsT(L, { mode: 'cheer', face: V(SX, 4, 0) }); fireworks(V(SX, 10, -40), L.T, 3, 16);
  cm([SX + 30, 30, 34], [SX + 26, 27, 30], L.k); camera.lookAt(SX - 18, 6, -4); camera.fov = 52; sh(V(SX - 18, 0, 0), 40); }, [[0, 'firework', .5], [.2, 'cheer', .45]]);
// 96 «Seitdem will niemand mehr Lukas heißen.»: en la plaza, todos se arrancan su placa LUKAS
shot(116.83, 'F', null, L => { town(L); const p = V(-8, 0, 14); const off = L.lt > .6; crowdAt(L, p.x, p.z, 16, 3, 12, 96, { mode: off ? 'shrug' : 'idle', list: BOYZ, gap: 1.0, tag: off ? null : 'LUKAS', expr: 'neutral' });
  const c = put(EX[0], p.x, 0, p.z + 3, 0); c.setTag(null); actuar(c, 0, [[0, { aRx: lerp(1.0, 2.6, easeOut(clamp(L.lt / .4))), aRz: lerp(-.75, .4, easeOut(clamp(L.lt / .4))), aRe: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  const rh = wpos(c.aR.hand); show(TAGBIG, rh.x, rh.y + .4, rh.z + .3, 0, .3); TAGBIG.userData.set('LUKAS', L.lt > .5);
  orb(L.k, V(p.x, 2.8, p.z + 3), null, [14, .1, .12, 44], [12, 0, .1, 44]); sh(p, 18); }, [[0, 'tape_rip', .55], [.5, 'paper', .4]]);
// 97 «Alle Jungs wollen jetzt Leon heißen.»: los chicos, con placas nuevas: LEON
shot(118.84, 'W', null, L => { town(L); const p = V(-8, 0, 14); crowdAt(L, p.x, p.z, 16, 3, 12, 97, { mode: 'cheer', list: BOYZ, gap: 1.0, tag: 'LEON' }); const c = put(BOYZ[5], p.x, 0, p.z + 3, 0); c.setTag('LEON'); actuar(c, 0, [[0, { aLx: .9, aLz: -.75, aLe: 2.0, aRx: 2.7, aRz: .4, aRe: .3 }]], { T: L.T }); grin(c, L.T);
  confRain(V(p.x, 0, p.z), L.T, 50, 22, 18, 16); orb(L.k, V(p.x, 2.6, p.z + 3), null, [14, .1, .12, 44], [12, 0, .1, 44]); sh(p, 18); }, [[0, 'tape', .5], [.3, 'cheer', .5]]);
// 98 «Die Mädchen Leonie.»: las chicas, delante de la fuente: LEONIE
shot(120.62, 'S', null, L => { town(L); const c = V(-18, 0, -14); const g = GIRLX[0]; put(g, c.x, 0, c.z, .3); g.setTag('LEONIE'); actuar(g, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .35, aRe: .5, aLx: .9, aLz: -.75, aLe: 2.0 }]], { T: L.T }); grin(g, L.T);
  crowdAt(L, c.x, c.z - 3, GIRLX.length - 1, 4.5, 10, 98, { mode: 'cheer', list: GIRLX.slice(1), tag: 'LEONIE', gap: 1.1 });
  orb(L.k, V(c.x, 3.2, c.z), null, [13, .45, .16, 44], [11, .3, .12, 44]); sh(c, 20); }, [[0, 'kids_laugh', .45], [.3, 'tape', .4]]);
// 99 «Der Polizist Leon.»: el policía, con su placa LEON, saluda militarmente
shot(121.68, 'C', 'punch', L => { town(L); const p = V(24, 0, 24); const c = put(pol, p.x, 0, p.z, -.2); c.setTag('LEON'); actuar(c, 0, [[0, { aRx: 2.8, aRz: -.6, aRe: 2.3, headX: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'grin' });
  onBody(c, 8.6, .05, .06, 42, L.k, 7.6); sh(p, 14); }, [[0, 'whistle', .45], [.2, 'pop', .4]]);
// 100 «Sogar die Katze.»: el gato, con su placa nueva LEON, maúlla
shot(123.17, 'Z', 'punch', L => { town(L); const DP = V(16.3, 0, 113); show(CAT, DP.x, 0, DP.z, -.4, 1); CAT.userData.tag('LEON'); CAT.userData.head.rotation.x = Math.sin(L.T * 4) * .1; CAT.userData.tail.rotation.x = Math.sin(L.T * 6) * .4;
  orb(L.k, V(DP.x, 1.8, DP.z), null, [7.6, -.4, .1, 40], [6.4, -.3, .08, 40]); sh(DP, 10); }, [[0, 'meow', .6]]);
// 101 «Deshalb heißt jetzt in dieser Stadt»: el cartel de la entrada, repintado: LEONHAUSEN – 5000 Leons
shot(124.48, 'S', null, L => { town(L); WS.userData.set('Leons', 'LEONHAUSEN'); welcomeKids(L, 'LEON', 'LEONIE');
  orb(L.k, SIGNP, null, [24, .2, .04, 42], [27, .28, .05, 42]); sh(SIGNP, 26); }, [[0, 'brush', .5], [.4, 'ding_soft', .4]]);
// 102 «jeder Leon…»: Mama, Papa, mi hermana, el Hausmeister, el dependiente… todos LEON / LEONIE
shot(125.88, 'C', 'punch', L => { town(L); const p = V(-8, 0, 30); [[mama, -3.6, 0], [papa, -1.2, -.7], [lehr, 1.2, -.7], [mut, 3.6, 0]].forEach(([c, dx, dz], i) => { put(c, p.x + dx, 0, p.z + dz, -dx * .06); LEONS(c); actuar(c, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9 + i) * .3, aRe: .4 }]], { T: L.T }); grin(c, L.T + i); });
  put(bru, p.x - .3, 0, p.z + 2.2, 0); LEONS(bru); actuar(bru, 0, [[0, GEST.cheer]], { T: L.T }); laughF(bru, L.T); show(CAT, p.x + 2.4, 0, p.z + 2.8, -.3, .8); CAT.userData.tag('LEON');
  orb(L.k, V(p.x, 3.4, p.z), null, [17, 0, .1, 46], [15, 0, .08, 46]); sh(p, 16); }, [[0, 'cheer', .5], [.2, 'meow', .4]]);
// 103 «und ich hab meinen Namen gerade»: yo, pensativo, entre tanto Leon
shot(126.95, 'W', null, L => { town(L); const p = V(-10, 0, 24); const m = put(me, p.x, 0, p.z, .15); m.setTag(null); actuar(m, 0, [[0, GEST.think]], { T: L.T }); cara(m, L.T, { expr: 'sus', eyes: 'side_l', mouth: 'wavy' });
  crowdAt(L, p.x, p.z, 12, 4.5, 10, 103, { mode: 'idle', expr: 'happy' }); CROWD.forEach(LEONS);
  onBody(m, 9.5, .1, .08, 42, L.k, 8.5); sh(p, 14); }, [[0, 'hmm', .45], [.6, 'tick', .35]]);
// 104 «in Lukas geändert.»: me pego la placa LUKAS y guiño a cámara
shot(128.13, 'Z', null, L => { town(L); const p = V(-10, 0, 24); const m = put(me, p.x, 0, p.z, .15); const on = L.lt > .35; m.setTag(on ? 'LUKAS' : null);
  actuar(m, L.lt, [[0, { aRx: 1.0, aRz: -.25, aRe: .9 }], [.35, { aLx: .9, aLz: -.75, aLe: 2.0, aRx: 2.7, aRz: .5, aRe: .3 }, { dur: .2 }]], { T: L.T }); cara(m, L.T, on ? { expr: 'wink', eyes: 'wink', mouth: 'smirk' } : { expr: 'smug' });
  if (!on) { attach(TAGBIG, m.aR.hand, [0, -.6, .5], [-1.5, 0, 0], .3 / .82); TAGBIG.userData.set('LUKAS'); }
  crowdAt(L, p.x, p.z, 12, 4.5, 10, 103, { mode: 'idle', expr: 'happy' }); CROWD.forEach(LEONS);
  onBody(m, 8.5, .1, .06, 40, L.k, 6.8); sh(p, 14); }, [[.35, 'tape', .55], [.5, 'ding_reveal', .45]]);
// ---------- portadas (fuera del vídeo) ----------
// 1: la plaza al atardecer: chicos LUKAS y chicas MIA se ríen de mí. 2: el estadio: 5000 Lukas girados… menos uno (Gerhard).
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .88) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function tagSticker(x, y, s, rot, name = 'LUKAS', col = '#d8202f') { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 22; c.shadowOffsetY = 8;
  c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect(-160, -110, 320, 220, 24); c.fill(); c.shadowColor = 'transparent'; c.lineWidth = 8; c.strokeStyle = '#1a1a2a'; c.stroke();
  c.fillStyle = col; c.beginPath(); c.roundRect(-156, -106, 312, 88, [20, 20, 0, 0]); c.fill(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.font = `46px Lilita`; c.fillText('HALLO', 0, -76); c.font = `24px Lilita`; c.fillText('ich heiße', 0, -38);
  c.fillStyle = '#16161e'; c.font = `70px Lucky`; c.fillText(name, 0, 44); c.restore(); }
function ringMark(x, y, rx, ry, col = '#ff2a4a') { const c = octx; c.save(); c.lineWidth = 20; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12; c.beginPath(); c.ellipse(x, y, rx, ry, -.08, .2, 6.1); c.stroke(); c.restore(); }
function arrowTo(x0, y0, x1, y1, col = '#ff2a4a') { const c = octx, a = Math.atan2(y1 - y0, x1 - x0); c.save(); c.lineWidth = 18; c.lineCap = 'round'; c.strokeStyle = col; c.fillStyle = col; c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 12;
  c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo((x0 + x1) / 2 + 60, (y0 + y1) / 2 - 40, x1, y1); c.stroke(); c.translate(x1, y1); c.rotate(a + .3); c.beginPath(); c.moveTo(14, 0); c.lineTo(-40, -30); c.lineTo(-40, 30); c.closePath(); c.fill(); c.restore(); }
function sparkle(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
function stamp(x, y, rot) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 18; c.fillStyle = '#fffdf2'; c.beginPath(); c.roundRect(-230, -95, 460, 190, 16); c.fill(); c.shadowColor = 'transparent';
  c.strokeStyle = '#9ac0e8'; c.lineWidth = 3; for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(-220, -40 + k * 50); c.lineTo(220, -40 + k * 50); c.stroke(); }
  c.textAlign = 'left'; c.textBaseline = 'middle'; c.font = '40px Lilita'; c.fillStyle = '#1a2a6a'; c.fillText('Adrian ..... hier ✓', -205, -62); c.fillText('Adrian ..... hier ✓', -205, -12); c.fillStyle = '#d8202f'; c.font = '46px Lilita'; c.fillText('Müller ... ABWESEND', -205, 46);
  c.strokeStyle = '#d8202f'; c.lineWidth = 7; c.beginPath(); c.ellipse(5, 46, 225, 38, -.03, 0, 7); c.stroke(); c.restore(); }
function vignette(a) { const c = octx, g = c.createRadialGradient(W / 2, H * .45, W * .35, W / 2, H * .45, H * .72); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(8,0,20,${a})`); c.fillStyle = g; c.fillRect(0, 0, W, H); }
function finishCover() { grade.uniforms.sharp.value = 1.55; grade.uniforms.vig.value = .55; grade.uniforms.sat.value = 1.5; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); ao.enabled = true; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }

window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); await document.fonts.load('80px Titan'); const T = 3.3, L = { T, lt: 1, k: 1 }; hideAll(); BAD_.length = 0;
  if (v === 0) { street(L); PCAR2.visible = false; const p = V(SHX - 22, 0, 4.5);
    put(me, p.x, 0, p.z, 0); actuar(me, 0, [[0, { aLx: .5, aLz: -.5, aLe: 1.9, aRx: .3, aRz: .25, headX: .12, headZ: -.06 }]], { T }); cara(me, T, { expr: 'sad', eyes: 'worried', mouth: 'frown', noBlink: 1 });
    const B = BOYS(CROWD).filter(c => c !== det), G = GIRLZ(CROWD);
    // otros burlones: unos graban con el móvil, otros se tapan la boca o se doblan de risa
    const R = [[B[14], -3.6, -1.6, 'phone'], [G[7], 3.6, -1.6, 'phone'], [B[18], -6.4, -1.0, 'belly'], [G[10], 6.4, -1.2, 'mouth'], [B[11], -4.6, 3.6, 'point'], [G[12], 4.6, 3.4, 'belly'], [B[20], -8.6, 1.6, 'point'], [G[3], 8.6, 1.4, 'point']];
    R.forEach(([c, dx, dz, m], i) => { if (!c) return; const x = p.x + dx, z = p.z + dz, toMe = Math.atan2(p.x - x, p.z - z); put(c, x, 0, z, toMe * .45);
      const P = m === 'phone' ? { aRx: 1.9, aRz: -.1, aRe: 1.2, aLx: .4, lean: -.05 } : m === 'belly' ? { aLx: .9, aRx: .9, aLe: 1.7, aRe: 1.7, aLz: -.2, aRz: -.2, lean: .18, headX: -.15 } : m === 'mouth' ? { aRx: 2.4, aRe: 2.5, aRz: -.3, aLx: .9, aLe: 1.6, headX: -.05 } : { aRx: 1.6, aRz: dx < 0 ? -.15 : .05, aRe: .05, aLx: .6, aLz: -.4, aLe: 1.6, lean: -.1 };
      actuar(c, 0, [[0, P]], { T: T + i }); laughF(c, T + i * .7);
      if (m === 'phone') { const ph = PHONES[i % 3], h = wpos(c.aR.hand); show(ph, h.x, h.y + .55, h.z, c.root.rotation.y + PI, .7); } });
    cam([p.x, 4.2, p.z + 19], [p.x, 2.6, p.z - 4], 48); sh(V(p.x, 0, p.z + 1), 24); FILL.intensity = 55; hemi.intensity = 1.35;
    finishCover(); vignette(.62);
    const top = proj(V(p.x, 4.75, p.z)), bot = proj(V(p.x, -.1, p.z)), sl = proj(V(p.x - 2.25, 2.6, p.z)), sr = proj(V(p.x + 2.25, 2.6, p.z));
    strokeTxt('IN DIESER STADT', W / 2, H * .172, 116, 'Titan', ['#ffffff', '#fff2c8'], '#000000', 26, 0, W * .94);
    strokeTxt('HEISSEN ALLE', W / 2, H * .236, 102, 'Titan', ['#ffffff', '#fff2c8'], '#000000', 24);
    tagSticker(W * .29, H * .318, .8, -.08, 'LUKAS', '#1f6fe0'); tagSticker(W * .71, H * .318, .8, .08, 'MIA', '#e0307a');
    ringMark((sl[0] + sr[0]) / 2, (top[1] + bot[1]) / 2, (sr[0] - sl[0]) / 2 + 55, (bot[1] - top[1]) / 2 + 45, '#ffe21a');
    strokeTxt('… AUSSER MIR', W / 2, Math.min(H * .85, bot[1] + 125), 128, 'Titan', ['#2e9bff', '#0038ff'], '#000000', 26, -.03);
    sparkle(W * .1, H * .15, 30, '#fff3a0'); sparkle(W * .9, H * .21, 24, '#fff3a0');
  } else { stadium(L); standsT(L, { turned: true, face: BFACE, expr: 'shock' }); const dp = detSeat(); const d = put(det, dp.x, dp.y, dp.z, PI * .85); actuar(d, 0, [[0, { aLx: .3, aRx: .3, headY: .1 }]], { T });
    cam([SX - 25.4, 14.5, 9.5], [dp.x - 1.5, dp.y + 2.2, dp.z - 2], 50); sh(dp, 28); hemi.intensity = 1.25; sun.intensity = 2.6;
    const q = proj(V(dp.x, dp.y + 3.7, dp.z));
    finishCover(); vignette(.55); strokeTxt('5000 LUKAS', W / 2, H * .17, 130, 'Lilita', ['#ffe86a', '#ffb000'], '#2a1600', 26);
    strokeTxt('DREHEN SICH UM', W / 2, H * .235, 100, 'Lilita', ['#ffffff', '#cfe8ff'], '#071a3a', 24);
    ringMark(q[0], q[1], 95, 110, '#ffe21a'); arrowTo(W * .2, H * .76, q[0] - 80, q[1] + 105, '#ffe21a');
    strokeTxt('… AUSSER EINEM', W / 2, H * .82, 116, 'Lilita', ['#ff5a5a', '#e0001a'], '#2a0008', 26, -.02);
    sparkle(W * .86, H * .3, 30); sparkle(W * .12, H * .28, 22); } };


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

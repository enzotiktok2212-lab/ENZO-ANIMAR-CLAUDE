// KREIDE — «In dieser Stadt wird alles, was du mit Kreide malst, lebendig … bis es regnet»: planos sincronizados con audio/words.json (1080×1920, 30 fps).
// Ciudad: Lindenbrück (plaza del mercado con Rathaus, café, fuente, casas de colores). Los planos están en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, mixPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { makeOma, makeKumpel, makeLena, makeSie, makeEr, makeKassiererin, makeFahrer, makePapa, makeMayor } from './gvolk.js';
import { hufenbach, townhouse } from './gort.js';
import { crowd } from './hsets.js';
import { makeEmil, makeLea, makeOpa, makeLina, makeMila, makePost, makeChef } from './kcast.js';
import { chalk, decal, DRAW, chalkSign, skateboard, fenceDoor, krumel, kitty, dragon, slide, ladder, sticks, umbrella, umbrellaField, rain, stormClouds, siren, key, jahrmarkt, garten, systemRoom, rainbow, schule, chalkStroke } from './ksets.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 255.6, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const buf = document.createElement('canvas'); buf.width = W; buf.height = H; const bctx = buf.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
const SPOTL = new THREE.SpotLight(0xfff2c8, 0, 80, .5, .5, 1.1); scene.add(SPOTL, SPOTL.target);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }
const PI = Math.PI;

// ---------- escenarios ----------
const JMX = 1300, GTX = 1600, SYX = 1900;
const HB = hufenbach(scene), JM = jahrmarkt(scene, JMX), GT = garten(scene, GTX), SY = systemRoom(scene, SYX);
const SETS = { HB: HB.G, JM: JM.g, GT: GT.g, SY: SY.g };
[HB.RANK, HB.KINO, HB.BOX, HB.PRICE].forEach(o => o.visible = false);
// relleno: casas en el hueco del cine, filas detrás del Rathaus y de las filas laterales, bloques altos al fondo
townhouse(HB.G, -64, -21, 13, 3, 11, PI / 2); townhouse(HB.G, -64, -34.5, 13, 2, 12, PI / 2);
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3) + (Math.abs(x + 6) < 30 ? 1 : 0), 20 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 30 + i, PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 40 + i, -PI / 2); }
for (let i = 0, x = -140; x <= 140; x += 20, i++) townhouse(HB.G, x, -170, 18, 4 + (i % 3), 50 + i, 0);
// calle del colegio (carretera x = 26 hacia +z): casas a ambos lados y el colegio al fondo
for (let i = 0, z = 128; z < 236; z += 17, i++) { townhouse(HB.G, 26 - 24, z, 16, 2 + (i % 3), 60 + i, PI / 2); townhouse(HB.G, 26 + 24, z, 16, 2 + ((i + 1) % 3), 70 + i, -PI / 2); }
const SCHULE = schule(HB.G, 26, 262, PI);
// calle de la valla (z = 150, al oeste de la carretera): casas detrás y la valla con la puerta de tiza
for (let i = 0, x = -60; x <= -16; x += 16, i++) townhouse(HB.G, x, 116, 15, 2 + (i % 2), 80 + i, 0);
const FD = fenceDoor(HB.G); FD.position.set(-30, 0, 146);
// Kreidefest: pancarta en el Rathaus, guirnaldas de banderines, dibujos en el suelo, cubos de tiza
const RB = textPlane(30, 5, 1200, 200, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); const cols = ['#ff5a8a', '#ffd23f', '#5ab8ff', '#8ad84a', '#ff9a2a', '#b86aff']; 'KREIDEFEST'.split('').forEach((ch, i) => txt(c, ch, 90 + i * 113, h / 2 + 8, 150, cols[i % 6], '#1a1a2a', 14)); }); RB.position.set(-6, 21, -82.2); HB.G.add(RB);
const FLAGS = new THREE.Group(); HB.G.add(FLAGS); [[-60, -60, 48, -60], [-60, -20, 48, -20], [-60, 20, 48, 20], [-60, 50, 48, 50]].forEach(([x0, z0, x1, z1], j) => { for (let i = 0; i < 36; i++) { const k = i / 35, x = lerp(x0, x1, k), y = 15 - Math.sin(k * PI) * 3.5; const f = new THREE.Mesh(new THREE.ConeGeometry(.7, 1.6, 3), mat([0xff5a8a, 0xffd23f, 0x5ab8ff, 0x8ad84a, 0xff9a2a][(i + j) % 5], { roughness: .6, side: THREE.DoubleSide })); f.position.set(x, y - .8, lerp(z0, z1, k)); f.rotation.set(PI, 0, 0); f.scale.z = .15; FLAGS.add(f); } });
const DEC = [['sun', 12, -10, -46, 0], ['hop', 7, -34, 34, .2], ['flower', 8, 4, 30, .4], ['rainbowD', 14, -30, -30, 0], ['house', 9, 8, -4, -.2], ['fish', 10, -16, 4, .7], ['star', 6, 24, -14, 0], ['flower', 6, -46, 6, -.6], ['star', 5, -4, 52, .3], ['sun', 7, 26, 34, 0], ['fish', 7, -46, -40, .2], ['house', 7, 30, 54, .5], ['hop', 6, 12, 60, -.3], ['rainbowD', 10, 10, -64, 0]]
  .map(([k, s, x, z, r]) => decal(HB.G, s * (k === 'hop' ? .55 : 1), s, DRAW[k], x, z, r));
const BUCKETS = []; for (const [x, z] of [[-24, -6], [0, 18], [18, -30], [-40, 26], [14, 44], [-10, -50]]) { const b = new THREE.Group(); b.position.set(x, 0, z); HB.G.add(b); cyl(.9, .75, 1.4, mat(0x3a8ad8, { roughness: .4 }), 14, b, 0, .7, 0); for (let k = 0; k < 7; k++) { const c = cyl(.16, .16, 1.4, chalk([0xff5a8a, 0xffd23f, 0x5ab8ff, 0x8ad84a, 0xffffff, 0xff9a2a, 0xb86aff][k]), 6, b, Math.cos(k) * .45, 1.5, Math.sin(k) * .45); c.rotation.set(Math.sin(k) * .3, 0, Math.cos(k) * .3); } BUCKETS.push(b); }
// sirenas
const SIR = siren(HB.G, -36, -16, 16); const SIR2 = siren(HB.G, 40, 120, 14);
for (const k in SETS) outline(SETS[k], 1.4);
// ---------- reparto ----------
const emil = makeEmil(scene), lea = makeLea(scene), opa = makeOpa(scene), lina = makeLina(scene), mila = makeMila(scene), post = makePost(scene), chef = makeChef(scene);
const K = Array.from({ length: 8 }, (_, i) => { const c = makeKumpel(scene, i); c.spec.scale = .66; return c; });
const XT = [makeLena(scene), makeSie(scene), makeEr(scene), makeKassiererin(scene), makeFahrer(scene), makeOma(scene), makePapa(scene), makeMayor(scene)];
kitFace(emil, 'kid'); kitFace(lea, 'girl'); kitFace(opa, 'plain'); kitFace(lina, 'girl'); kitFace(mila, 'girl'); kitFace(post, 'mustache'); kitFace(chef, 'villain');
K.forEach((c, i) => kitFace(c, ['kid', 'hero', 'kid', 'plain', 'girl', 'girl', 'kid', 'hero'][i])); XT.forEach((c, i) => kitFace(c, ['girl', 'girl', 'kid', 'girl', 'plain', 'girl', 'mustache', 'mustache'][i]));
const POOL = [emil, lea, opa, lina, mila, post, chef, ...K, ...XT]; POOL.forEach(c => outline(c.root, 2));
// llaves pegadas al anciano (se ven cuando 'keysOn')
const OPAKEYS = []; { const r = RNG(12); for (let i = 0; i < 26; i++) { const k = key(i < 18 ? opa.spine : opa.hips, i, .75); const a = r() * 6.283, y = i < 18 ? .2 + r() * 2 : -.6 - r() * .6; k.position.set(Math.sin(a) * 1.15, y, Math.cos(a) * .66); k.rotation.set(r() * 3, a, r() * 3); OPAKEYS.push(k); } for (let i = 0; i < 6; i++) { const k = key(i < 3 ? opa.aL.el : opa.aR.el, i + 2, .7); k.position.set((r() - .5) * .6, -.3 - r() * .4, .45); k.rotation.set(r() * 3, 0, r() * 3); OPAKEYS.push(k); } }
// ---------- atrezo ----------
const KRU = krumel(scene), CAT = kitty(scene), DRA = dragon(scene), SLD = slide(scene), LAD = ladder(scene), STK = sticks(scene, 60), UMF = umbrellaField(scene, 520), RAIN = rain(scene), CLO = stormClouds(scene);
outline(KRU, 1.4); outline(CAT, 1.4); outline(DRA.g, 1.6); outline(SLD, 1.2); outline(LAD, 1.2); outline(STK.g, 1.0);
const SKATE = [0x5ab8ff, 0xff7ab8, 0x8ad84a, 0xffd23f].map(c => { const s = skateboard(scene, c); outline(s, 1.2); return s; });
const UMB = [[0xd8323a, 0xffffff], [0x2a6ad8, 0xffd23f], [0x2ab86a, 0xffffff], [0x8a3ad8, 0xff8ad0], [0xff8a3a, 0x1a1a2a], [0xffd23f, 0x2a6ad8]].map(([a, b]) => { const u = umbrella(scene, a, b); outline(u, 1.2); return u; });
const KEYS = Array.from({ length: 60 }, (_, i) => { const k = key(scene, i, 1.3); outline(k, 1); return k; });
const CHALK1 = cyl(.14, .14, 1.1, chalk(0x5ab8ff, { glow: .4 }), 8, scene, 0, 0, 0), CHALK2 = cyl(.14, .14, 1.1, chalk(0xff7ab8, { glow: .4 }), 8, scene, 0, 0, 0), CHALK3 = cyl(.14, .14, 1.1, chalk(0xffffff, { glow: .4 }), 8, scene, 0, 0, 0);
const RBOW = [rainbow(scene, 9), rainbow(scene, 7), rainbow(scene, 11)];
const BAG = (() => { const g = new THREE.Group(); scene.add(g); box(2.4, 1.8, .9, mat(0x7a4a22, { roughness: .7 }), .2, g, 0, 0, 0); for (let k = 0; k < 4; k++) box(1.6, 1.0, .05, mat(0xf4f0e6), .02, g, -.3 + k * .2, .9, -.2 + k * .1); return g; })();
const LETTER = Array.from({ length: 4 }, () => box(1.4, .9, .06, mat(0xf4f0e6), .02, scene, 0, 0, 0));
const DUST = Array.from({ length: 24 }, () => sphere(1, mat(0xffffff, { roughness: 1, transparent: true, opacity: .6, depthWrite: false, emissive: 0xffffff, emissiveIntensity: .3 }), scene, 0, 0, 0, 10, 8));
const GDUST = Array.from({ length: 40 }, () => sphere(1, mat(0x4ad87a, { roughness: 1, transparent: true, opacity: .7, depthWrite: false, emissive: 0x2ad86a, emissiveIntensity: .5 }), scene, 0, 0, 0, 10, 8));
const CONF = Array.from({ length: 40 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const FLW = Array.from({ length: 30 }, (_, i) => { const g = new THREE.Group(); scene.add(g); for (let k = 0; k < 5; k++) { const p = sphere(.35, mat([0xff7ab0, 0xffd23f, 0xffffff, 0xb88aff][i % 4]), g, Math.cos(k * 1.256) * .4, 0, Math.sin(k * 1.256) * .4, 6, 4); p.scale.y = .4; } sphere(.25, mat(0xffd23f), g, 0, .1, 0, 6, 4); cyl(.06, .06, 1.2, mat(0x3aa036), 4, g, 0, -.6, 0); return g; });
// calcomanías móviles (dibujos de tiza en el suelo para planos concretos)
const DC = { dog: decal(scene, 4, 4, DRAW.dog), skate: decal(scene, 5, 2.2, (c, w, h) => { chalkStroke(c, [[20, h * .3], [w - 20, h * .3], [w - 10, h * .5], [w - 20, h * .7], [20, h * .7], [10, h * .5], [20, h * .3]], '#5ab8ff', 10, 2); for (const x of [.25, .75]) { c.lineWidth = 8; c.strokeStyle = '#fff'; c.beginPath(); c.arc(w * x, h * .85, 9, 0, 7); c.stroke(); } }),
  scrib: decal(scene, 4, 4, (c, w, h) => { chalkStroke(c, [[20, 120], [50, 30], [80, 140], [110, 40], [140, 130]], '#5ab8ff', 8, 3); c.lineWidth = 8; c.strokeStyle = '#ff7ab8'; c.beginPath(); c.arc(80, 80, 30, 0, 5); c.stroke(); }),
  opa: decal(scene, 7, 9, (c, w, h) => { c.lineWidth = 9; c.strokeStyle = '#ffffff'; c.lineJoin = 'round'; c.beginPath(); c.moveTo(w * .5, h * .02); c.arc(w * .5, h * .12, h * .1, -PI / 2, 3 * PI / 2); c.moveTo(w * .22, h * .25); c.lineTo(w * .78, h * .25); c.lineTo(w * .95, h * .55); c.moveTo(w * .78, h * .25); c.lineTo(w * .7, h * .62); c.lineTo(w * .7, h * .98); c.moveTo(w * .22, h * .25); c.lineTo(w * .05, h * .55); c.moveTo(w * .22, h * .25); c.lineTo(w * .3, h * .62); c.lineTo(w * .3, h * .98); c.stroke(); }),
  slide: decal(scene, 6, 9, (c, w, h) => { chalkStroke(c, [[w * .3, h * .05], [w * .3, h * .95]], '#ffffff', 12, 1); chalkStroke(c, [[w * .7, h * .05], [w * .7, h * .95]], '#ffffff', 12, 2); for (let k = 0; k < 5; k++) chalkStroke(c, [[w * .3, h * (.15 + k * .17)], [w * .7, h * (.15 + k * .17)]], '#5ab8ff', 9, k + 3); }),
  mast1: decal(scene, 6, 6, DRAW.flower), mast2: decal(scene, 7, 5, DRAW.fish),
  sticks: Array.from({ length: 8 }, (_, i) => decal(scene, 3, 4.4, DRAW.stick)) };
const DCL = [DC.dog, DC.skate, DC.scrib, DC.opa, DC.slide, DC.mast1, DC.mast2, ...DC.sticks];
const dec = (d, x, z, ry = 0, op = 1, y = .07) => { d.visible = op > .01; d.position.set(x, y, z); d.rotation.set(-PI / 2, 0, ry); d.material.opacity = clamp(op); return d; };
const PROPS = [KRU, CAT, DRA.g, SLD, LAD, ...SKATE, ...UMB, ...KEYS, CHALK1, CHALK2, CHALK3, ...RBOW, BAG, ...LETTER, ...DUST, ...GDUST, ...CONF, ...SWEAT, ...FLW];
const CRW = crowd(scene, 300); CRW.g.children[3].visible = false;
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.25; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.55, .62, .42); sun.intensity = 2.5; sun.color.setRGB(1, .95, .86); rim.intensity = 1.0;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function sunset() { day(); MODE = 'sunset'; setSky([.22, .32, .78], [.85, .55, .7], [1, .72, .45]); sun.color.setRGB(1, .82, .62); sun.intensity = 2.3; hemi.color.setRGB(1, .9, .85); scene.fog.color.setRGB(1, .82, .7); bloom.strength = .2; }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.0; setSky([.02, .04, .16], [.08, .12, .34], [.2, .22, .46]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.0; hemi.color.setRGB(.6, .7, 1); hemi.groundColor.setRGB(.25, .25, .36); sun.intensity = 1.1; sun.color.setRGB(.72, .78, 1); rim.intensity = 1.7;
  scene.fog.color.setRGB(.1, .14, .28); scene.fog.density = .0011; bloom.strength = .3; bloom.threshold = .85; FILL.intensity = fill; BIRDSON = 0; }
// tormenta: cielo gris oscuro, luz fría, niebla de lluvia
function storm(k = 1) { day(); MODE = 'storm'; const q = clamp(k); setSky([lerp(.18, .1, q), lerp(.48, .12, q), lerp(.98, .18, q)], [lerp(.45, .2, q), lerp(.72, .22, q), lerp(1, .28, q)], [lerp(.82, .36, q), lerp(.93, .38, q), lerp(1, .44, q)]);
  hemi.intensity = lerp(1.25, 1.05, q); hemi.color.setRGB(lerp(.88, .7, q), lerp(.94, .76, q), 1); sun.intensity = lerp(2.5, .7, q); sun.color.setRGB(lerp(1, .7, q), lerp(.95, .78, q), lerp(.86, .95, q)); rim.intensity = 1.4; scene.fog.color.setRGB(lerp(.8, .3, q), lerp(.9, .33, q), lerp(1, .4, q)); scene.fog.density = lerp(.0009, .0035, q); FILL.intensity = 30 * q; BIRDSON = 0; renderer.toneMappingExposure = lerp(.98, 1.08, q); }
function inside(h = .95, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .2; bloom.threshold = .88; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function dark() { inside(.35, 0); MODE = 'sys'; setSky([0, 0, .02], [0, .01, .04], [.02, .03, .08]); bloom.strength = .55; bloom.threshold = .6; scene.fog.color.setRGB(.01, .02, .05); scene.fog.density = .006; rim.intensity = 1.6; hemi.color.setRGB(.4, .6, 1); }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } }
  OPAKEYS.forEach(k => k.visible = false);
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  CRW.update(0, 'still', false, 0); UMF.set([]); RAIN.m.visible = RAIN.splash.visible = false; CLO.g.visible = false; STK.L.forEach(s => s.visible = false); SIR.userData.on(0, false); SIR2.userData.on(0, false); FD.userData.open(0); SLD.userData.set(1, 0); LAD.userData.set(1);
  DRA.g.visible = false; GT.door.rotation.y = 0; SY.core.rotation.set(0, 0, 0); SPOTL.intensity = 0; SYL.intensity = 0; SYR.intensity = 0; DCL.forEach(d => d.visible = false);
  for (const k in SETS) SETS[k].visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = 1.08; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; GL = 0; VIDUI = null; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
const chalkIn = (ch, c = CHALK1) => attach(c, ch.aR.hand, [0, -.55, .25], [PI / 2, 0, 0], 1);
const umbIn = (ch, i, s = .8) => attach(UMB[i], ch.aR.hand, [0, -.3, .2], [0, 0, 0], s / (ch.spec.scale || 1));
const keysOn = () => OPAKEYS.forEach(k => k.visible = true);
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
// órbita: cámara a distancia d del centro c, ángulo yaw (0 = desde +z), pitch (arriba +); el centro queda al ~42 % de la altura
function orbit(c, d, yaw = 0, pitch = .15, fov = 44) { const t = Math.tan(fov * PI / 360) * d * .16; cam([c.x + Math.sin(yaw) * Math.cos(pitch) * d, c.y + Math.sin(pitch) * d, c.z + Math.cos(yaw) * Math.cos(pitch) * d], [c.x, c.y - t, c.z], fov); }
const orb = (k, c0, c1, a, b, e = easeInOut) => { const q = e(clamp(k)); orbit(c0.clone().lerp(c1 ?? c0, q), lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q), lerp(a[3] ?? 44, b[3] ?? 44, q)); };
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
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
function confetti(c, T0, T, n = 40, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
// polvo de tiza (nube que se expande): list = DUST o GDUST
function puff(c, T0, T, n = 14, s = 1, list = DUST, life = 1.4) { list.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > life) return; d.visible = true; const a = r() * 6.283, el = (r() - .3) * 1.2, v = (3 + r() * 4) * s, e = 1 - Math.exp(-t * 3);
  d.position.set(c.x + Math.cos(a) * Math.cos(el) * v * e, c.y + Math.sin(el) * v * e + t * .8 * s, c.z + Math.sin(a) * Math.cos(el) * v * e); d.scale.setScalar((.4 + e * 1.2) * s * (.7 + r() * .6)); d.material.opacity = .45 * (1 - t / life) ** 1.5; }); }
// llaves volando hacia un punto (k 0..1)
function keysFly(target, T0, T, n = 40, from = null) { KEYS.forEach((k, i) => { if (i >= n) return; const r = RNG(i * 7 + 1), t = T - T0 - r() * .35; const st = from ? from[i % from.length] : V(target.x + (r() - .5) * 70, 1 + r() * 8, target.z + (r() - .5) * 70); if (t < 0) { show(k, st.x, st.y, st.z, r() * 6, 1); return; }
  const q = easeIn(clamp(t / .7)); show(k, lerp(st.x, target.x + (r() - .5) * 2.6, q), lerp(st.y, target.y + (r() - .5) * 4, q) + Math.sin(q * PI) * 4, lerp(st.z, target.z + (r() - .5) * 1.6, q), T * 12 + i, 1); k.rotation.x = T * 9 + i; if (q >= 1) k.visible = false; }); }
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));
const loc = (ch, x, y, z) => { ch.root.updateMatrixWorld(true); return ch.root.localToWorld(V(x, y, z)); };
// multitud instanciada: lista de [x, z, ry]; modo 'cheer' | 'sway' | 'still'
function crowdAt(T, spots, mode = 'sway', silent = false) { spots.forEach((s, i) => { if (i >= CRW.seat.length) return; Object.assign(CRW.seat[i], { x: s[0], y: s[3] ?? 0, z: s[1], ry: s[2] ?? 0 }); }); CRW.update(T, mode, silent, Math.min(spots.length, CRW.seat.length)); }
const ring = (c, r0, r1, n, seed = 1, face = true) => { const r = RNG(seed), L = []; for (let i = 0; i < n; i++) { const a = r() * 6.283, d = r0 + (r1 - r0) * Math.sqrt(r()), x = c.x + Math.cos(a) * d, z = c.z + Math.sin(a) * d; L.push([x, z, face ? Math.atan2(c.x - x, c.z - z) + (r() - .5) * .5 : r() * 6.283]); } return L; };
const grid = (x0, z0, x1, z1, n, seed = 1, ry = null) => { const r = RNG(seed), L = []; for (let i = 0; i < n; i++) L.push([lerp(x0, x1, r()), lerp(z0, z1, r()), ry ?? r() * 6.283]); return L; };
// ---------- capa 2D ----------
const BAD_ = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD_.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD_.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD_.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; if (x < -60 || x > W + 60) return; b.x = clamp(x, 200, W - 200); b.y = clamp(y, 150, H * .64); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num' || b.kind === 'green' || b.kind === 'gold' || b.kind === 'blue') { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : b.kind === 'green' ? '#04300e' : b.kind === 'gold' ? '#3a2400' : b.kind === 'blue' ? '#04183a' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#8aff9a'); g.addColorStop(1, '#1ab84a'); } else if (b.kind === 'gold') { g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a820'); } else if (b.kind === 'blue') { g.addColorStop(0, '#bfeaff'); g.addColorStop(1, '#2a8aff'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'sys') { c.font = `700 46px monospace`; const w = c.measureText(b.text).width + 64; c.fillStyle = 'rgba(4,12,24,.86)'; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 10); c.fill(); c.lineWidth = 4; c.strokeStyle = '#3ad8ff'; c.stroke(); c.fillStyle = '#7ae8ff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'sysred') { c.font = `700 50px monospace`; const w = c.measureText(b.text).width + 64; c.fillStyle = 'rgba(30,2,6,.88)'; c.beginPath(); c.roundRect(-w / 2, -46, w, 92, 10); c.fill(); c.lineWidth = 5; c.strokeStyle = '#ff3a4a'; c.stroke(); c.fillStyle = '#ff6a7a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  c.restore(); }
// interfaz de «vídeo» (el Sistema enseña otro vídeo): barra de progreso, corazones, vistas
let VIDUI = null;
function drawVidUI(v) { const c = octx; c.save(); c.globalAlpha = v.a ?? 1; c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, H - 120, W, 120); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(40, H - 70, W - 80, 8); c.fillStyle = '#ff3a6a'; c.fillRect(40, H - 70, (W - 80) * v.p, 8); c.beginPath(); c.arc(40 + (W - 80) * v.p, H - 66, 14, 0, 7); c.fill();
  c.font = `700 40px ${FONT}`; c.textAlign = 'left'; c.fillStyle = '#fff'; c.fillText(v.views ?? '', 40, 90); c.textAlign = 'right'; c.fillText('♥ ' + (v.likes ?? ''), W - 40, 90); if (v.rec) { c.fillStyle = '#ff2a3a'; c.beginPath(); c.arc(W - 70, 150, 16, 0, 7); c.fill(); c.font = `700 34px monospace`; c.fillText('SYSTEM', W - 100, 162); } c.restore(); }
const KEY = /^(Kreide|lebendig|regnet|Skateboards|Schule|Postbote|Tür|Regen|Regenschirm|Regensirene|Emil|elf|Strichmännchen|Krümel|vier|drei|Lea|fünf|Katze|Sekunden|Kreidefest|Marktplatz|Drachen|Zug|Smaragd|neun|Kindern|Hand|alter|Mann|Schlüssel|Klirr|Jahrmarkt|System|Unbekannt|Leon|Paul|Noah|Ben|Luca|Max|davor|erinnert|neunmal|entschlüsseln|Server|Zuschauer|weiterwischen|Video|Regenbogen|Mila|Fehler|Codes|38|Millionen|Aufrufe|vergessen|regnen|100|Prozent|Juli|schwarze|Wolken|Tropfen|zwölf|Meter|Leiter|Stunden|schneller|schlechter|Regenschirme|Dreihundert|Dach|trockenen|Rutsche|zwei|Lina|Angst|kletterte|Arme|zerplatzte|Kreidestaub|Sicherheit|Hunderte|getanzt|Gartenhäuschen|mehr)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }
// ---------- pantalla del Sistema (canvas 1280×720) ----------
const KIDS = [['LEON', '#ff8a2a', '#9a4a22'], ['LEON', '#2a6ad8', '#1a1008'], ['PAUL', '#2ab86a', '#e0b850'], ['NOAH', '#d8283a', '#101010'], ['BEN', '#8a3ad8', '#6a4428'], ['LUCA', '#ffd23f', '#3a2214'], ['MAX', '#1aa0a0', '#b8441a']];
function kidThumb(c, x, y, w, h, name, shirt, hair, k = 1, red = 0) { c.save(); c.globalAlpha = k; c.fillStyle = '#16203a'; c.fillRect(x, y, w, h); const g = c.createLinearGradient(x, y, x, y + h); g.addColorStop(0, '#6ab8ff'); g.addColorStop(1, '#c8f0ff'); c.fillStyle = g; c.fillRect(x + 6, y + 6, w - 12, h * .72);
  const cx = x + w / 2, cy = y + h * .42; c.fillStyle = shirt; c.fillRect(cx - w * .2, cy + h * .1, w * .4, h * .22); c.fillStyle = '#f2c8a0'; c.beginPath(); c.roundRect(cx - w * .15, cy - h * .2, w * .3, h * .3, 14); c.fill(); c.fillStyle = hair; c.beginPath(); c.roundRect(cx - w * .16, cy - h * .24, w * .32, h * .1, 10); c.fill();
  c.fillStyle = '#1a1a1a'; c.fillRect(cx - w * .07, cy - h * .08, 8, 10); c.fillRect(cx + w * .05, cy - h * .08, 8, 10); c.fillStyle = '#fff'; c.font = `700 ${h * .14}px ${FONT}`; c.textAlign = 'center'; c.fillText(name, cx, y + h * .9);
  if (red) { c.fillStyle = `rgba(255,30,50,${.35 * red})`; c.fillRect(x, y, w, h); c.strokeStyle = '#ff3a4a'; c.lineWidth = 6; c.beginPath(); c.moveTo(x + 10, y + 10); c.lineTo(x + w - 10, y + h - 10); c.moveTo(x + w - 10, y + 10); c.lineTo(x + 10, y + h - 10); c.stroke(); } c.restore(); }
function scrBase(c, w, h, T, red = 0) { c.fillStyle = red ? '#12040a' : '#040a16'; c.fillRect(0, 0, w, h); c.strokeStyle = red ? 'rgba(255,60,80,.18)' : 'rgba(60,200,255,.16)'; c.lineWidth = 1; for (let x = 0; x < w; x += 40) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y < h; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  c.font = `700 26px monospace`; c.textAlign = 'left'; c.fillStyle = red ? '#ff6a7a' : '#5ae0ff'; c.fillText('SYSTEM v4.2  //  STADT-SIMULATION', 30, 40); c.textAlign = 'right'; c.fillText('LIVE ' + String(Math.floor(T * 10) % 100000).padStart(5, '0'), w - 30, 40); }
// monitor vertical del Sistema (formato de vídeo 9:16) delante de la pantalla curva; silla, mesa y núcleo recolocados
const VSC = document.createElement('canvas'); VSC.width = 540; VSC.height = 960; const VST = new THREE.CanvasTexture(VSC); VST.colorSpace = THREE.SRGBColorSpace;
const VSCR = new THREE.Group(); VSCR.position.set(-2, 19, -34); SY.g.add(VSCR); box(17.4, 30.6, .8, mat(0x14161e, { metalness: .6, roughness: .3 }), .3, VSCR, 0, 0, -.5);
const vsPlane = new THREE.Mesh(new THREE.PlaneGeometry(16, 28.4), new THREE.MeshBasicMaterial({ map: VST, toneMapped: false })); vsPlane.position.z = .02; VSCR.add(vsPlane); cyl(.6, .9, 6, mat(0x14161e, { metalness: .6 }), 10, VSCR, 0, -17, -.6);
const vs = f => { const c = VSC.getContext('2d'); c.save(); f(c, 540, 960); c.restore(); VST.needsUpdate = true; };
SY.chair.position.set(9, 0, -12); SY.chair.rotation.y = PI; SY.desk.visible = false; SY.core.position.set(-15, 16, -26);
const SYL = new THREE.PointLight(0x3ab8ff, 0, 60, 1.4); SYL.position.set(SYX + 4, 16, -27); scene.add(SYL); const SYR = new THREE.PointLight(0xff2a3a, 0, 50, 1.4); SYR.position.set(SYX + 14, 14, -8); scene.add(SYR);
// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
let DARK = 0, TINT = null, SHAKE = 0, GL = 0; const COVERS = [];
// Lindenbrück (x = 0): plaza adoquinada x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (x = -6, fachada z ≈ -84, pancarta KREIDEFEST); fuente (-18, -24); café (36, -40);
// sirena (-36, -16); carretera x = 26 hacia +z con casas a ambos lados y el colegio (26, 262); valla con la puerta de tiza (-30, 146); casa de Emil (4, 96, mira a +x).
const town = (m = 'day') => { use('HB'); if (m === 'night') night(45); else if (m === 'morning') sunset(); else if (m === 'storm') storm(1); else day(); };
// camino del dragón sobre la plaza: s ∈ [0,1] (0 = cabeza)
const dpath = (cx, cy, cz, len = 60, amp = 3, dir = 0) => (s, T) => { const x = -s * len, y = Math.sin(s * 9 - T * 2.2) * amp, z = Math.sin(s * 5 - T * 1.4) * amp * 1.4; return V(cx + Math.cos(dir) * x - Math.sin(dir) * z, cy + y, cz - Math.sin(dir) * x - Math.cos(dir) * z); };
// ===== Parte 1: la regla, la ciudad, Emil, Krümel, Lea (0 – 47,1 s) =====
const KNEEL = { crouch: .5, lLx: 1.3, lLk: 1.9, lRx: -.1, lRk: 1.5, lean: .35, aRx: 1.1, aRe: .5, aLx: .4, aLe: .8, headX: .35 };
const SIT = { crouch: .9, lLx: 1.5, lRx: 1.5, lLk: .3, lRk: .3, lean: -.05, aLx: .3, aRx: .3 };
const RIDE = { crouch: .55, lLx: 1.3, lRx: 1.3, lLk: 1.2, lRk: 1.2, lLz: -.4, lRz: .4 };
const drawP = (T, sp = 9, o = {}) => ({ ...KNEEL, aRx: 1.25 + Math.sin(T * sp) * .28, aRz: Math.cos(T * sp) * .35, aRe: .45 + Math.sin(T * sp * 1.3) * .2, headX: .45, ...o });
const RIDEP = (T, i, scared = 0) => ({ ...RIDE, aLx: scared ? 1.0 : 2.6 + Math.sin(T * 6 + i) * .3, aRx: scared ? 1.0 : 2.4 + Math.cos(T * 6 + i) * .3, aLz: .4, aRz: .4, aLe: scared ? 1.5 : .3, aRe: scared ? 1.5 : .3, lean: scared ? .4 : -.1, headX: scared ? .2 : -.2, ...(scared ? shiver(T, 1.5) : {}) });
// gente de fondo: [ch, x, z, ry, modo, fase]
function bg(L, list) { for (const [ch, x, z, ry, m, ph = 0] of list) { const T = L.T + ph;
  if (m === 'walk' || m === 'run' || m === 'umbwalk') { caminar(ch, L.lt + ph, { x, z, ry, speed: m === 'run' ? 8 : 3.2, run: m === 'run', T, extra: m === 'umbwalk' ? walkArmsUmb(T) : undefined }); if (m === 'umbwalk') umbIn(ch, (ph * 7 | 0) % 6); cara(ch, T, { expr: m === 'run' ? 'shock' : 'happy', mouth: m === 'run' ? 'o' : 'smile' }); continue; }
  put(ch, x, 0, z, ry);
  if (m === 'draw') { applyPose(ch, drawP(T, 8 + ph)); chalkIn(ch, [CHALK2, CHALK3][(ph * 3 | 0) % 2]); cara(ch, T, { expr: 'happy', mouth: 'smile' }); }
  else if (m === 'cheer') { actuar(ch, L.lt, [[0, 'cheer']], { T }); laughF(ch, T); }
  else if (m === 'point') { actuar(ch, L.lt, [[0, 'point']], { T }); cara(ch, T, { expr: 'shock', mouth: 'o' }); }
  else if (m === 'look') { actuar(ch, L.lt, [[0, { headX: -.5, aLx: .3, aRx: .3 }]], { T }); cara(ch, T, { expr: 'shock', mouth: 'o' }); }
  else if (m === 'scared') { actuar(ch, L.lt, [[0, 'hands_face']], { T, extra: shiver(T) }); cara(ch, T, { expr: 'shock', mouth: 'grimace' }); }
  else if (m === 'umb') { umbIn(ch, (ph * 7 | 0) % 6); actuar(ch, L.lt, [[0, { aRx: 1.3, aRe: 1.4, aRz: -.1 }]], { T }); cara(ch, T, { expr: 'happy', mouth: 'smile' }); }
  else if (m === 'clap') { actuar(ch, L.lt, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.35 + Math.abs(Math.sin(T * 9)) * .3, aRz: -.35 + Math.abs(Math.sin(T * 9)) * .3, aLe: .6, aRe: .6 }]], { T }); grin(ch, T); }
  else { actuar(ch, L.lt, [[0, 'idle']], { T }); cara(ch, T, { expr: 'happy' }); } } }
const walkArmsUmb = T => ({ aRx: 1.3, aRe: 1.4, aRz: -.1 });
const PLAZA_BG = (L, n = 120, mode = 'sway') => crowdAt(L.T, grid(-56, -76, 46, -40, n, 3, 0), mode);
// ---------- 1 · GANCHO: «In dieser Stadt wird alles, was du mit Kreide malst, lebendig …» ----------
// Emil dibuja a Krümel en el suelo y salta vivo; alrededor, monopatines, monigotes y el dragón cobran vida. Zoom lento hacia Emil.
shot(0, 'Z', null, L => { town(); PLAZA_BG(L, 90, 'cheer'); const T = L.T;
  put(emil, 0, 0, 0, .15); applyPose(emil, L.lt < 1.2 ? drawP(T, 11) : { ...KNEEL, aRx: 2.6, aRz: .4, aRe: .2, headX: -.1, lean: .1 }); chalkIn(emil); cara(emil, T, L.lt < 1.2 ? { expr: 'determined', mouth: 'smile' } : { eyes: 'wide', mouth: 'open_smile' });
  const kk = clamp((L.lt - .9) / .5); show(KRU, 2.6, 0, 3.2, -.3, Math.max(.01, spring(kk))); KRU.userData.anim(T, L.lt > 1.4 ? 1 : 0); KRU.position.y = L.lt > 1.4 ? Math.abs(Math.sin(T * 7)) * .8 : 0; puff(V(2.6, .6, 3.2), .9, T, 8, .35);
  dec(DC.dog, 2.6, 3.2, -.3, 1 - clamp((L.lt - .9) / .3));
  SKATE.forEach((s, i) => { const x = -18 + ((T * 9 + i * 9) % 36), z = -10 - i * 5; show(s, x, 0, z, PI / 2); put(K[i], x, .6, z, PI / 2); applyPose(K[i], { crouch: .25, aLz: .6, aRz: .6, lLx: .2, lRx: -.2, lean: .1 }); cara(K[i], T, { expr: 'happy', mouth: 'open_smile' }); });
  STK.update(T, [[-9, 0, -4, .4], [-12, 0, -8, .2], [9, 0, -6, -.4], [12, 0, -12, -.2], [-6, 0, -16, 0]]);
  DRA.g.visible = true; DRA.update(T, dpath(30 - L.lt * 6, 19, -26, 60, 2, -.15));
  bg(L, [[XT[0], -7, 4, .4, 'draw', .2], [XT[1], 8, -2, -.3, 'cheer'], [lea, -4, -6, .2, 'draw', .5]]);
  orb(L.k, V(1.0, 3.4, 1.6), null, [15, 0, .15, 50], [11, .05, .12, 46], easeOut); sh(V(0, 0, -6), 34); },
  [[.05, 'chalk', .8], [.6, 'chalk', .6], [.95, 'pop', .9], [1.05, 'sparkle', .7], [1.5, 'bark', .7]]);
// ---------- 1b · «… malst, lebendig …» : el dragón de tiza se despega del suelo con los niños subiéndose; monopatines y monigotes alrededor (zoom lento) ----------
shot(1.88, 'C', 'slow', L => { town(); PLAZA_BG(L, 110, 'cheer'); const T = L.T; const up = easeOut(clamp(L.lt / 1.3));
  DRA.g.visible = true; DRA.update(T, (s, t) => { const p = dpath(16, 1 + up * 15, -14, 60, up * 2, -.1)(s, t); p.y = Math.max(.8, p.y - s * up * 8); return p; }); riders(T, 0, RIDERS().slice(0, Math.min(7, 2 + Math.floor(L.lt * 6))));
  puff(V(0, 1, -14), L.t0, T, 16, 1.2, GDUST, 1.4);
  SKATE.slice(0, 2).forEach((s_, i) => { const x = -10 + i * 18 - L.lt * 6 * (i ? 1 : -1), z = 6 + i * 2; show(s_, x, 0, z, PI / 2 * (i ? -1 : 1)); put(K[6 + i], x, .6, z, PI / 2 * (i ? -1 : 1)); applyPose(K[6 + i], { crouch: .25, aLz: .7, aRz: .7, lean: .1 }); cara(K[6 + i], T, { eyes: 'happy', mouth: 'open_smile' }); });
  STK.update(T, [[-9, 0, 2, .5], [9, 0, 0, -.5], [-14, 0, -6, .3], [14, 0, -8, -.3]]);
  bg(L, [[emil, -2.5, 8, .2, 'cheer'], [lea, 2.5, 8, -.2, 'cheer', .3]]); show(KRU, 0, 0, 9, 0, .8); KRU.userData.anim(T, 1); KRU.position.y = Math.abs(Math.sin(T * 7)) * .8;
  orb(L.k, V(0, 7, -2), null, [42, 0, .12, 50], [30, .02, .14, 46], easeIn); sh(V(0, 0, -6), 40); },
  [[0, 'magic_hit', .8], [.1, 'growl', .7], [.4, 'kids_laugh', .6], [.9, 'wheels', .5], [1.2, 'cheer', .5]]);
// ---------- 2 · «bis es regnet.» : una nube negra, la primera gota cae sobre una flor de tiza y se derrite ----------
shot(3.54, 'F', 'punch', L => { town('storm'); const T = L.T; CLO.set(V(0, 0, -20), T, 1, 120, 55); RAIN.update(T, V(0, 0, 0), .3 + L.k * .7, 50, 40, 50);
  put(emil, 0, 0, 0, .1); actuar(emil, L.lt, [[0, { headX: -.55, aLx: .5, aRx: .5, aLz: .4, aRz: .4 }]], { T }); cara(emil, T, { expr: 'shock', mouth: 'o' }); show(KRU, 3.6, 0, 1.4, -.4); KRU.userData.anim(T, 0);
  STK.update(T, [[-3.2, 0, 1.2, .5, Math.max(.05, .8 - easeIn(L.k) * .75)]], 'wave'); puff(V(-3.2, .5, 1.2), L.t0 + .3, T, 8, .4);
  orbit(V(0, 2.8, .5), 16, .1, .25, 46); sh(V(0, 0, 0), 20); }, [[0, 'thunder', .9], [.1, 'rain', .7], [.4, 'drip', .7], [.6, 'water_bloop', .6]]);
// ---------- 3 · «Kinder malen sich Skateboards auf den Gehweg» ----------
shot(4.60, 'W', null, L => { town(); const T = L.T, X = 26 + 9, Z = 150;
  [[K[0], 0, 'draw', 0], [K[4], 4.5, 'draw', .4], [K[2], -4.5, 'draw', .7]].forEach(([c, dz, m, ph], i) => { put(c, X, 0, Z + dz, -PI / 2 + .25); applyPose(c, drawP(T + ph, 10)); chalkIn(c, [CHALK1, CHALK2, CHALK3][i]); cara(c, T, { expr: 'happy', mouth: 'smile' }); });
  const kk = clamp((L.lt - 1.1) / .4); show(SKATE[0], X - 3.5, 0, Z - 2.5, PI / 2, Math.max(.01, spring(kk))); puff(V(X - 3.5, .6, Z - 2.5), 1.1, T, 8, .4);
  dec(DC.skate, X - 3.5, Z - 2.5, PI / 2, 1 - kk);
  bg(L, [[XT[3], X + 4, Z - 14, PI, 'walk'], [XT[5], X - 18, Z - 8, .4, 'idle']]);
  orb(L.k, V(X - 1.6, 1.4, Z - .8), null, [17, -1.2, .75, 46], [15, -1.35, .72, 44]); sh(V(X, 0, Z), 20); }, [[.1, 'chalk', .8], [.7, 'chalk', .7], [1.1, 'pop', .9], [1.2, 'sparkle', .6]]);
// ---------- 4 · «und fahren damit zur Schule.» : bajan la calle en monopatines de tiza hacia el colegio ----------
shot(6.60, 'Z', null, L => { town(); const T = L.T, z0 = 150 + L.lt * 16;
  [[K[0], -2.5, 0], [K[4], 2.5, 2.4], [K[2], 0, -2.6], [K[6], -5, -5]].forEach(([c, dx, dz], i) => { const x = 26 + dx, z = z0 + dz + Math.sin(T * 2 + i) * .5; show(SKATE[i], x, 0, z, 0); put(c, x, .6, z, 0); applyPose(c, { crouch: .3, aLz: .7 + Math.sin(T * 3 + i) * .2, aRz: .7, aLe: .3, aRe: .3, lLx: .25, lRx: -.25, lean: .15, headX: -.1 }); cara(c, T, { expr: 'happy', mouth: 'open_smile' }); });
  bg(L, [[XT[6], 26 + 9, z0 + 18, PI, 'walk'], [XT[1], 26 - 9, z0 + 26, PI, 'umbwalk', .3]]);
  cam([26 + Math.sin(L.k * 2) * 2, 9, z0 - 19 + L.k * 2], [26, 1.4, z0 + 20], 46); sh(V(26, 0, z0), 30); }, [[0, 'wheels', .8], [.6, 'kids_laugh', .6], [1.1, 'wheels', .6]]);
// ---------- 5 · «Der Postbote malt an jeden Zaun eine Tür,» ----------
shot(8.14, 'S', null, L => { town(); const T = L.T; FD.userData.open(0);
  put(post, -30.6, 0, 148.6, PI - .45); const dr = L.lt < 1.8; actuar(post, L.lt, [[0, { aRx: 1.7 + Math.sin(T * 7) * .35, aRz: -.2 + Math.cos(T * 7) * .3, aRe: .3, lean: .1, aLx: .2 }]], { T }); chalkIn(post, CHALK2); cara(post, T, { expr: 'happy', mouth: 'smile' });
  attach(BAG, post.spine, [1.3, .3, .6], [0, 0, 0], .8);
  show(LETTER[0], -27, 4.6, 146.3, 0); LETTER[0].visible = false;
  bg(L, [[XT[2], -18, 160, -PI / 2, 'walk', .2]]);
  orb(L.k, V(-29.6, 3.2, 147.5), null, [20, 1.3, .14, 44], [17, 1.1, .12, 42]); sh(V(-30, 0, 146), 20); }, [[0, 'chalk', .9], [.8, 'chalk', .8], [1.6, 'chalk', .7], [2.2, 'sparkle', .5]]);
// ---------- 6 · «damit er nie mehr außen herumlaufen muss.» : abre la puerta de tiza y pasa al jardín ----------
shot(10.68, 'R', null, L => { town(); const T = L.T; const op = easeOut(clamp(L.lt / .5)); FD.userData.open(op);
  caminar(post, Math.max(0, L.lt - .3), { x: -30, z: 149.5, ry: PI, speed: 4.6, T, extra: { aRx: .9, aRe: 1.2 } }); attach(BAG, post.spine, [1.3, .3, .6], [0, 0, 0], .8); cara(post, T, { expr: 'happy', mouth: 'open_smile' }); attach(LETTER[1], post.aR.hand, [0, -.6, .3], [0, 0, 0], 1);
  bg(L, [[XT[5], -24.5, 140, PI - .3, 'clap']]);
  orb(L.k, V(-30, 3.2, 145), V(-30, 3.2, 143), [17, PI - .45, .12, 44], [15, PI - .2, .12, 44]); sh(V(-30, 0, 146), 20); }, [[0, 'door_open', .8], [.3, 'steps', .7], [1.0, 'steps', .6], [1.5, 'paper', .5]]);
// ---------- 7 · «Aber Regen wischt alles weg.» : la lluvia borra un dibujo y un monopatín de tiza se deshace ----------
shot(12.77, 'C', 'punch', L => { town('storm'); const T = L.T; CLO.set(V(0, 0, 0), T, 1, 140, 60); RAIN.update(T, V(0, 0, 0), 1, 40, 40, 40);
  const m = easeIn(L.k); show(SKATE[1], 0, 0, 0, .4, 1); SKATE[1].scale.set(1 + m * .4, Math.max(.05, 1 - m), 1 + m * .4); puff(V(0, .5, 0), .2, T, 14, .7);
  put(K[3], -2.8, 0, -1.2, .4); actuar(K[3], L.lt, [[0, 'hands_head']], { T }); cara(K[3], T, { expr: 'shock', mouth: 'grimace' });
  STK.update(T, [[2.6, 0, -1.4, -.4, Math.max(.05, .8 - m * .75)]], 'wave');
  orbit(V(0, 2, -.6), 15, .05, .36, 46); sh(V(0, 0, 0), 20); }, [[0, 'rain', .8], [.3, 'water_bloop', .7], [.8, 'drip', .6], [1.2, 'gasp', .5]]);
// ---------- 8 · «Deshalb hat hier jeder immer einen Regenschirm dabei –» : calle con todos llevando paraguas ----------
shot(14.61, 'W', null, L => { town(); const T = L.T;
  bg(L, [[XT[0], -6, 22, 0, 'umbwalk', .1], [XT[2], 2, 14, 0, 'umbwalk', .5], [XT[6], 8, 26, .2, 'umbwalk', .9], [XT[3], -12, 10, .1, 'umbwalk', 1.3], [XT[5], 12, 6, -.1, 'umbwalk', 1.7]]);
  put(emil, -1, 0, 30 + L.lt * 3.2, 0); caminar(emil, L.lt, { x: -1, z: 30, ry: 0, speed: 3.2, T }); umbIn(emil, 0, .8); cara(emil, T, { expr: 'happy', mouth: 'smile' });
  crowdAt(T, grid(-50, -70, 40, -30, 80, 5, 0), 'sway');
  orb(L.k, V(-1, 3, 36), V(-1, 3, 42), [22, .1, .12, 46], [20, -.1, .12, 46]); sh(V(0, 0, 26), 40); }, [[0, 'steps', .7], [.8, 'umbrella', .6], [1.6, 'steps', .6], [2.0, 'birds', .4]]);
// ---------- 9 · «sogar bei strahlendem Sonnenschein.» : la abuela en el café, sol a tope, con el paraguas abierto ----------
shot(17.09, 'F', null, L => { town(); const T = L.T; bloom.strength = .5; bloom.threshold = .7; grade.uniforms.lift.value = .04;
  put(XT[5], 33, 0, -33, -PI / 2 - .3); applyPose(XT[5], { ...SIT, crouch: .45, lLx: 1.3, lRx: 1.3, lLk: 1.3, lRk: 1.3, aRx: 1.4, aRe: 1.3 }); umbIn(XT[5], 1, .9); cara(XT[5], T, { expr: 'happy', mouth: 'smile', eyes: 'squint' }); sweat(XT[5], T);
  put(XT[6], 29.5, 0, -36, -PI / 2 + .1); applyPose(XT[6], { aRx: 1.3, aRe: 1.4 }); umbIn(XT[6], 4, .9); cara(XT[6], T, { expr: 'happy', mouth: 'smile' });
  badge3('gold', '☀ 31°', V(31, 13, -34), (L.lt - .2) * 2);
  orb(L.k, V(31.4, 4.4, -34.5), null, [21, -1.45, .1, 46], [18, -1.3, .08, 44]); sh(V(32, 0, -34), 20); }, [[0, 'sparkle', .6], [.3, 'sip', .6], [.9, 'birds', .4]]);
// ---------- 10 · «Und das Geräusch, vor dem hier alle am meisten Angst haben,» : la gente se queda helada mirando arriba ----------
shot(18.89, 'Z', 'slow', L => { town(); const T = L.T; grade.uniforms.sat.value = 1.3;
  bg(L, [[XT[0], -4, 0, .2, 'scared'], [XT[2], 4, -2, -.2, 'look'], [XT[3], 0, -5, 0, 'scared', .3], [K[1], -7.5, -3, .4, 'look'], [K[5], 7.5, -4, -.3, 'scared', .6]]);
  crowdAt(T, grid(-40, -60, 30, -16, 70, 9, 0), 'still', true);
  orb(L.k, V(0, 4, -2), null, [26, 0, .1, 46], [17, .05, .06, 44], easeIn); sh(V(0, 0, -2), 30); }, [[0, 'wind', .6], [.6, 'heartbeat', .8], [1.6, 'heartbeat', .7]]);
// ---------- 11 · «ist die Regensirene.» : la sirena desde abajo, empieza a girar ----------
shot(21.75, 'C', 'punch', L => { town(); const T = L.T; SIR.userData.on(T, L.lt > .2);
  bg(L, [[K[3], -36 + 2.5, -16 + 4, PI * .2, 'look'], [XT[4], -36 - 3, -16 + 5, -.2, 'scared']]);
  orb(L.k, V(-36, 11, -16), null, [34, .75, -.2, 48], [30, .85, -.24, 46]); sh(V(-36, 0, -16), 24); }, [[.15, 'siren', 1.0]]);
// ---------- 12 · «Sobald sie heult, rennen alle los,» : la plaza entera corre ----------
shot(22.99, 'W', null, L => { town(); const T = L.T; SIR.userData.on(T, true);
  bg(L, [[XT[0], -10, 20, 0, 'run'], [XT[1], 2, 14, .2, 'run', .3], [XT[2], 10, 24, -.2, 'run', .6], [K[0], -4, 8, .1, 'run', .2], [K[4], 6, 2, -.1, 'run', .5], [XT[3], -14, 0, .3, 'run', .8], [K[2], 14, 10, -.3, 'run', .1]]);
  crowdAt(T, grid(-50, -60, 40, -10, 90, 7, 0), 'cheer');
  orb(L.k, V(0, 3, 22 + L.lt * 7), null, [18, 0, .12, 48], [16, .12, .12, 48]); sh(V(0, 0, 20), 40); }, [[0, 'crowd_run', .9], [.4, 'siren', .5], [1.2, 'shout_m', .4]]);
// ---------- 13 · «um ihre Bilder zu retten.» : cogen sus dibujos vivos (gata, monopatín, monigote) y los ponen a salvo ----------
shot(24.89, 'S', null, L => { town(); const T = L.T; SIR.userData.on(T, true);
  const wq = caminar(XT[0], L.lt, { x: -6, z: 18, ry: .15, speed: 7, run: true, T, extra: { aLx: 1.2, aRx: 1.2, aLe: .7, aRe: .7, aLz: -.25, aRz: -.25 } }); const cp = loc(XT[0], 0, 1.2, 2.2); show(CAT, cp.x, cp.y, cp.z, .15 + PI / 2, .42); CAT.userData.anim(T); cara(XT[0], T, { expr: 'shock', mouth: 'o' });
  caminar(K[1], L.lt, { x: 1, z: 12, ry: .1, speed: 8, run: true, T }); attach(SKATE[2], K[1].aR.hand, [0, -.6, .8], [PI / 2, 0, 0], .7 / .66); cara(K[1], T, { expr: 'determined', mouth: 'o' });
  caminar(K[7], L.lt, { x: 6, z: 8, ry: -.1, speed: 7.5, run: true, T }); cara(K[7], T, { expr: 'shock', mouth: 'o' }); STK.update(T, [[6 + Math.sin(-.1) * 7.5 * L.lt + 1.6, 0, 8 + 7.5 * L.lt, 0, .55]], 'dance');
  orb(L.k, V(-2.5, 3, 20 + L.lt * 7), null, [14, .15, .12, 46], [13, 0, .12, 46]); sh(V(0, 0, 18), 30); }, [[0, 'run_cobble', .8], [.4, 'meow', .6]]);
// ---------- 14 · «Ich heiße Emil.» ----------
shot(25.83, 'I', 'punch', L => { town(); PLAZA_BG(L, 70); const T = L.T;
  put(emil, 0, 0, 0, .1); actuar(emil, L.lt, [[0, 'wave']], { T }); chalkIn(emil); talk(emil, T, L.t0, L.t1, 'happy'); show(KRU, 3.2, 0, 1.2, -.4); KRU.userData.anim(T, 0);
  badge3('tag', 'EMIL', hp(emil).add(V(0, 2.4, 0)), (L.lt - .15) * 2.5);
  bg(L, [[XT[1], -9, -10, .3, 'draw', .4], [K[2], 8, -12, -.4, 'draw', .1]]);
  orb(L.k, V(.8, 2.6, 0), null, [13, .3, .12, 44], [12, .1, .1, 44]); sh(V(0, 0, 0), 20); }, [[0, 'pop', .7], [.3, 'bark', .5]]);
// ---------- 15 · «Ich bin elf» ----------
shot(26.98, 'C', null, L => { town(); PLAZA_BG(L, 70); const T = L.T;
  put(emil, 0, 0, 0, -.2); actuar(emil, L.lt, [[0, { aRx: 2.6, aRz: .1, aRe: .2, aLx: 2.6, aLz: .1, aLe: .2 }]], { T }); grin(emil, T);
  badge3('big', '11', hp(emil).add(V(0, 3, 0)), (L.lt - .1) * 3, 1.3);
  orb(L.k, V(0, 2.8, 0), null, [11, -.2, .2, 44], [10, -.35, .2, 44]); sh(V(0, 0, 0), 20); }, [[.1, 'ding_soft', .8]]);
// ---------- 16 · «und male schlechter als jeder andere in dieser Stadt.» : todos hacen obras maestras; lo de Emil es un garabato ----------
shot(27.78, 'W', null, L => { town(); const T = L.T;
  put(emil, 0, 0, 0, 0); applyPose(emil, drawP(T, 12)); chalkIn(emil); cara(emil, T, { expr: 'determined', mouth: 'frown' });
  dec(DC.scrib, 0, 3.4, 0); dec(DC.mast1, -4.2, 3.6, .2); dec(DC.mast2, 4.4, 3.6, -.2);
  bg(L, [[XT[0], -4.4, 0, .1, 'draw', .3], [XT[1], 4.6, 0, -.1, 'draw', .6], [K[5], -3.2, -6, .2, 'point'], [K[6], 3.4, -6.5, -.2, 'cheer']]);
  orb(L.k, V(0, 2.2, 0), null, [24, -.15, .42, 46], [21, .15, .4, 46]); sh(V(0, 0, 0), 24); }, [[0, 'chalk', .8], [.9, 'kids_laugh', .6], [1.6, 'chalk', .6]]);
// ---------- 17 · «Egal, was ich male –» : Emil dibuja deprisa con la lengua fuera ----------
shot(30.25, 'S', null, L => { town(); const T = L.T;
  put(emil, 0, 0, 0, .3); applyPose(emil, drawP(T, 15, { headX: .5 })); chalkIn(emil); cara(emil, T, { expr: 'determined', mouth: 'grimace' }); puff(V(0, .3, 2), L.t0 + .3, T, 6, .25);
  orbit(V(0, 2.2, .6), 11 - L.k * 1.5, .3 - L.k * .2, .16, 44); sh(V(0, 0, 0), 14); }, [[0, 'chalk', 1], [.5, 'chalk', .8]]);
// ---------- 18 · «am Ende wird es immer ein Strichmännchen.» : un monigote se levanta del dibujo y saluda; Emil se tapa la cara ----------
shot(31.46, 'Z', null, L => { town(); PLAZA_BG(L, 60); const T = L.T;
  put(emil, -2.2, 0, 0, .55); actuar(emil, L.lt, [[0, { ...KNEEL, aRx: .4 }], [1.0, { ...KNEEL, aRx: 2.3, aRz: -.45, aRe: 2.35, headX: .34 }]], { T }); cara(emil, T, L.lt > 1.0 ? { eyes: 'closed', mouth: 'frown' } : { expr: 'shock', mouth: 'o' });
  const kk = spring(clamp((L.lt - .15) / .5)); STK.update(T, [[1.6, 0, 1, -.6, Math.max(.01, kk * .9)]], 'wave'); puff(V(1.6, .6, 1), L.t0 + .1, T, 6, .3);
  orb(L.k, V(-.2, 2.6, .5), null, [15, .05, .15, 44], [13, -.1, .15, 44]); sh(V(0, 0, 0), 16); }, [[.1, 'pop', .9], [.3, 'sparkle', .5], [1.0, 'sigh', .6]]);
// ---------- 19 · «Mein Hund Krümel ist ein Kreis mit vier Strichen.» ----------
shot(33.68, 'F', null, L => { town(); PLAZA_BG(L, 50); const T = L.T;
  show(KRU, 0, 0, 0, 0, 1.15); KRU.userData.anim(T, 0); KRU.position.y = Math.abs(Math.sin(T * 6)) * .6;
  put(emil, -3.4, 0, -1.8, .5); actuar(emil, L.lt, [[0, 'point_l']], { T }); grin(emil, T); chalkIn(emil);
  badge3('big', '4', V(0, 7.5, 0), (L.lt - 1.6) * 3, 1.2);
  orb(L.k, V(-1.4, 2.8, -.5), null, [15, .2, .12, 44], [13, .05, .1, 42]); sh(V(0, 0, 0), 14); }, [[0, 'bark', .8], [.9, 'spring', .5], [1.7, 'ding_soft', .8]]);
// ---------- 20 · «Na gut, drei. Einen hab ich vergessen.» : Krümel cojea con tres patas; Emil se encoge de hombros ----------
shot(36.26, 'C', 'punch', L => { town(); PLAZA_BG(L, 50); const T = L.T;
  show(KRU, -L.lt * 1.2 + .6, 0, 0, -PI / 2 + .4, 1.1); KRU.userData.anim(T, 1); KRU.rotation.z = Math.sin(T * 9) * .12;
  put(emil, 3.5, 0, -1, -.4); actuar(emil, L.lt, [[0, 'shrug']], { T }); talk(emil, T, L.t0, L.t1, 'happy', { eyes: 'happy' });
  badge3('red', '3', V(0, 7, 0), (L.lt - .3) * 3, 1.2);
  orb(L.k, V(1.2, 2.6, 0), null, [15, -.1, .15, 44], [14, .1, .15, 44]); sh(V(0, 0, 0), 14); }, [[.1, 'boing_metal', .6], [.5, 'ding_soft', .6], [1.2, 'bark', .5]]);
// ---------- 21 · «Lea, die beste Künstlerin der Stadt,» : Lea dibuja, la gente aplaude ----------
shot(38.29, 'W', null, L => { town(); const T = L.T;
  put(lea, 0, 0, 0, 0); applyPose(lea, drawP(T, 6, { headX: .3 })); chalkIn(lea, CHALK2); cara(lea, T, { expr: 'happy', mouth: 'smile', eyes: L.lt > 1 ? 'happy' : 'normal' });
  badge3('tag', 'LEA', hp(lea).add(V(0, 2.5, 0)), (L.lt - .1) * 2.5);
  bg(L, [[XT[1], -4, -6, .4, 'clap'], [XT[2], 4.5, -6, -.4, 'clap', .2], [K[4], -2.6, -7, .2, 'cheer'], [XT[6], 2.8, -8, -.1, 'clap', .5]]);
  crowdAt(T, grid(-20, -30, 20, -12, 40, 4, 0), 'cheer');
  orb(L.k, V(0, 2.4, -1), null, [17, .1, .2, 46], [14, -.1, .18, 44]); sh(V(0, 0, -2), 24); }, [[0, 'clap', .8], [.6, 'cheer', .6], [1.2, 'chalk', .5]]);
// ---------- 22 · «hat fünf Tage an ihrer Katze gemalt.» : la gata de tiza detallada se levanta y estira ----------
shot(40.38, 'Z', null, L => { town(); const T = L.T; const kk = spring(clamp((L.lt - .2) / .6));
  show(CAT, 1, 0, 0, .3, Math.max(.01, kk * 1.1)); CAT.userData.anim(T); puff(V(1, 1, 0), L.t0 + .2, T, 8, .4);
  put(lea, -4.4, 0, -1.8, .6); actuar(lea, L.lt, [[0, 'cheer']], { T }); laughF(lea, T);
  badge3('gold', '5 TAGE', V(0, 9.5, 0), (L.lt - .3) * 2.5, 1.1);
  orb(L.k, V(-1, 3, 0), null, [19, .35, .12, 44], [17, .15, .1, 44]); sh(V(0, 0, 0), 18); }, [[.2, 'magic_hit', .7], [.4, 'meow', .8], [.6, 'ding_soft', .6], [1.2, 'sparkle', .5]]);
// ---------- 23 · «Für Krümel hab ich drei Sekunden gebraucht –» : garabato rapidísimo y ¡pop! ----------
shot(42.67, 'C', 'punch', L => { town(); const T = L.T;
  put(emil, 0, 0, 0, .2); applyPose(emil, drawP(T, 22)); chalkIn(emil); cara(emil, T, { expr: 'determined', mouth: 'grimace' });
  const kk = spring(clamp((L.lt - .9) / .4)); show(KRU, 3.6, 0, .6, -.5, Math.max(.01, kk)); KRU.userData.anim(T, 1); puff(V(3.6, .6, .6), L.t0 + .9, T, 6, .3);
  badge3('blue', '3 SEK', V(1.5, 7.5, 0), (L.lt - .1) * 3, 1.1);
  orb(L.k, V(1.6, 2.4, .4), null, [15, .3, .2, 44], [14, .15, .18, 44]); sh(V(0, 0, 0), 14); }, [[0, 'chalk', 1], [.4, 'tick', .6], [.9, 'pop', .9], [1.2, 'bark', .6]]);
// ---------- 24 · «und trotzdem ist er der beste Hund der Welt.» : abrazo con Krümel al atardecer ----------
shot(44.83, 'F', null, L => { town('morning'); const T = L.T;
  put(emil, -1.2, 0, 0, .5); actuar(emil, L.lt, [[0, { ...KNEEL, aLx: 1.3, aRx: 1.3, aLz: -.5, aRz: -.5, aLe: 1.3, aRe: 1.3, headX: .1, lean: .2, headY: .3 }]], { T }); cara(emil, T, { eyes: 'happy', mouth: 'open_smile' });
  show(KRU, 1.1, 0, 1.6, -.5, .9); KRU.userData.anim(T, 0); KRU.rotation.z = Math.sin(T * 4) * .1;
  badge3('gold', '♥', V(0, 7, 1), (L.lt - .3) * 2, 1.2);
  orb(L.k, V(.2, 2.5, .6), null, [15, .1, .1, 44], [13, .3, .08, 42]); sh(V(0, 0, 0), 14); }, [[0, 'hug', .7], [.4, 'bark', .5], [1.0, 'sparkle', .5], [1.6, 'kids_laugh', .4]]);
// ===== Parte 1b: Kreidefest, Smaragd, el anciano, las llaves, la feria (47,1 – 89,9 s) =====
const RIDERS = () => [K[0], K[1], K[2], K[3], lina, K[4], K[5], K[6], K[7]];
// coloca a los 9 niños sobre el dragón (asientos 5, 7, …); scared = miedo
function riders(T, scared = 0, list = RIDERS(), dir = 0) { list.forEach((c, i) => { const sIdx = 5 + i * 2; if (sIdx >= DRA.N || !DRA.segs[sIdx].visible) { c.root.visible = false; return; } const p = DRA.seat(sIdx); put(c, p.x, p.y - .2, p.z, DRA.segs[sIdx].rotation.y + PI / 2); applyPose(c, RIDEP(T, i, scared)); cara(c, T, scared ? { expr: 'shock', mouth: i % 2 ? 'o' : 'grimace' } : { expr: 'happy', mouth: i % 3 ? 'open_smile' : 'laugh' }); }); }
const FEST_BG = (L, n = 140, mode = 'cheer') => crowdAt(L.T, grid(-56, -74, 46, -36, n, 11, 0).concat(grid(-58, 30, -40, 66, 30, 12, PI / 2)), mode);
// ---------- 25 · «Dann kam das Kreidefest:» : grúa sobre la pancarta KREIDEFEST, confeti ----------
shot(47.12, 'F', 'punch', L => { town(); FEST_BG(L, 160); const T = L.T; confetti(V(-6, 14, -70), L.t0, T, 40, 1.4);
  orb(L.k, V(-6, 17, -78), null, [44, 0, .05, 50], [36, .08, .12, 48]); sh(V(-6, 0, -70), 50); }, [[0, 'party_horn', .8], [.1, 'confetti', .7], [.4, 'cheer', .8], [1.0, 'kids_laugh', .5]]);
// ---------- 26 · «der Tag, an dem die ganze Stadt gleichzeitig» : vista de dron, todo el mundo dibuja ----------
shot(48.83, 'Z', null, L => { town(); const T = L.T; FEST_BG(L, 120, 'sway');
  bg(L, [[XT[0], -10, 6, .3, 'draw', .1], [XT[1], 4, 2, -.2, 'draw', .4], [XT[2], 14, -6, .5, 'draw', .7], [XT[3], -18, -10, 0, 'draw', .9], [K[0], -4, 14, .2, 'draw', .2], [K[4], 10, 16, -.4, 'draw', .5], [XT[6], 20, 8, -.6, 'draw', .3], [XT[5], -22, 18, .4, 'draw', .6], [K[2], 0, -12, 0, 'draw', .8], [lea, -8, -20, .2, 'draw', .4]]);
  cm([0, 70, 52], [-2, 0, 0], 0); orbit(V(-2, 0, 0), 76 - L.k * 8, L.k * .25, .95, 46); sh(V(0, 0, 0), 60); }, [[0, 'chalk', .7], [.4, 'chalk', .6], [.8, 'city_amb', .6], [1.2, 'chalk', .5]]);
// ---------- 27 · «den Marktplatz bemalt.» : grúa baja entre la gente que pinta ----------
shot(50.45, 'S', null, L => { town(); const T = L.T; FEST_BG(L, 90, 'sway');
  bg(L, [[XT[1], -3, 0, .2, 'draw', .4], [K[5], 3, -1, -.3, 'draw', .1], [XT[3], 0, -6, .1, 'draw', .7], [K[6], -6, -8, .5, 'draw', .3], [XT[4], 6, -9, -.3, 'draw', .9]]);
  dec(DC.mast1, -2, 2.6, .3); dec(DC.mast2, 3.4, 2.4, -.4);
  orb(L.k, V(0, 2.2, -2), null, [22, -.5, .45, 46], [18, .2, .35, 46]); sh(V(0, 0, -2), 24); }, [[0, 'chalk', .8], [.6, 'brush', .6], [1.1, 'chalk', .6]]);
// ---------- 28 · «Lea malte einen Drachen,» : Lea termina la cabeza del dragón en el suelo y se levanta del suelo ----------
shot(52.18, 'R', null, L => { town(); const T = L.T; FEST_BG(L, 90, 'cheer'); const up = easeOut(clamp((L.lt - .5) / 1.2));
  DRA.g.visible = true; DRA.update(T, (s, t) => { const p = dpath(10, .6 + up * 6, -12, 60, up * 1.5, 0)(s, t); p.y = Math.max(p.y, .6 + up * 6 * (1 - s * .8)); return p; });
  put(lea, 2, 0, -5, -.7); actuar(lea, L.lt, [[0, drawP(T, 9)], [.5, 'cheer']], { T }); chalkIn(lea, CHALK2); cara(lea, T, L.lt > .5 ? { eyes: 'happy', mouth: 'open_smile' } : { expr: 'determined', mouth: 'smile' }); puff(V(10, 1, -12), L.t0 + .5, T, 14, .9);
  bg(L, [[XT[2], -4, -10, .3, 'point'], [K[3], 6, -12, -.3, 'cheer']]);
  orb(L.k, V(4, 4.5, -8), null, [26, .55, .2, 46], [22, .35, .16, 46]); sh(V(4, 0, -10), 30); }, [[.1, 'chalk', .7], [.5, 'magic_hit', .9], [.7, 'growl', .7], [1.1, 'cheer', .6]]);
// ---------- 29 · «so lang wie ein ganzer Zug:» : el dragón pasa a lo largo, interminable, con los vagones de un tren dibujados al lado ----------
shot(53.91, 'W', null, L => { town(); const T = L.T; FEST_BG(L, 120, 'cheer');
  DRA.g.visible = true; DRA.update(T, dpath(40 - L.lt * 22, 14, -30, 60, 2, 0)); riders(T);
  badge('big', 'SO LANG WIE EIN ZUG', W / 2, H * .17, (L.lt - .2) * 2.2, 1, .75);
  orb(L.k, V(10 - L.lt * 10, 13, -30), null, [70, .02, .06, 46], [64, -.06, .08, 46]); sh(V(0, 0, -30), 60); }, [[0, 'whoosh_up', .6], [.2, 'growl', .6], [.6, 'kids_laugh', .6], [1.0, 'wind', .5]]);
// ---------- 30 · «Smaragd.» : cabeza del dragón de cerca, ruge ----------
shot(55.43, 'C', 'punch', L => { town(); const T = L.T; FEST_BG(L, 80, 'cheer');
  DRA.g.visible = true; DRA.update(T, dpath(0, 15, -20, 60, 1.5, 0));
  badge3('green', 'SMARAGD', DRA.head.position.clone().add(V(0, 6, 0)), (L.lt - .1) * 2.5, 1.1);
  orbit(DRA.head.position.clone().add(V(1, 0, 0)), 20 - L.k * 3, PI / 2 - .25, .1, 46); sh(V(0, 0, -20), 40); }, [[0, 'growl', 1], [.2, 'sparkle', .5]]);
// ---------- 31 · «Er schwebte über die Dächer,» : sobre los tejados del oeste ----------
shot(56.57, 'Z', null, L => { town(); const T = L.T;
  DRA.g.visible = true; DRA.update(T, dpath(-50, 34, 34 - L.lt * 16, 60, 3, PI / 2)); riders(T);
  orb(L.k, V(-52, 33, 26 - L.lt * 16), null, [62, 1.25, -.02, 46], [56, 1.1, 0, 46]); sh(V(-70, 0, 20), 60); }, [[0, 'wind', .7], [.4, 'whoosh_soft', .6], [1.0, 'birds', .4]]);
// ---------- 32 · «mit neun Kindern auf dem Rücken.» : los niños montados saludan ----------
shot(58.10, 'S', null, L => { town(); const T = L.T;
  DRA.g.visible = true; DRA.update(T, dpath(14, 22, -20, 60, 1.2, 0)); riders(T);
  badge('big', '9 KINDER', W / 2, H * .16, (L.lt - .15) * 2.5, 1, .9);
  const c = DRA.seat(13); orbit(c.clone().add(V(0, 1.5, 0)), 21 - L.k * 3, .2, .16, 46); sh(c.clone().setY(0), 50); }, [[0, 'kids_laugh', .8], [.3, 'ding_soft', .7], [.9, 'cheer', .5]]);
// ---------- 33 · «Ich setzte mich hin, um irgendwas zu malen –» ----------
shot(59.70, 'W', null, L => { town(); const T = L.T; FEST_BG(L, 70, 'sway');
  const sit = easeOut(clamp(L.lt / .6)); put(emil, 0, 0, 0, 0); applyPose(emil, mixPose({}, { ...SIT, aRx: .9, aRe: .6, headX: .4 }, sit)); chalkIn(emil, CHALK3); cara(emil, T, { expr: 'neutral', mouth: 'flat' }); show(KRU, 3, 0, -1.2, -.6, .85); KRU.userData.anim(T, 0);
  bg(L, [[XT[5], -6, -5, .5, 'draw', .3], [K[6], 6, -6, -.4, 'draw', .6]]);
  orb(L.k, V(.6, 2, 0), null, [15, -.3, .2, 44], [13, -.1, .2, 44]); sh(V(0, 0, 0), 16); }, [[0, 'cloth', .6], [.4, 'land', .5], [1.2, 'chalk', .4]]);
// ---------- 34 · «und plötzlich bewegte sich meine Hand ganz von allein.» : la mano va sola, brilla; Emil asustado (zoom lento) ----------
shot(61.97, 'C', 'slow', L => { town(); const T = L.T; grade.uniforms.sat.value = 1.3;
  put(emil, 0, 0, 0, 0); applyPose(emil, { ...SIT, lean: .25, aRx: 1.4 + Math.sin(T * 26) * .35, aRz: Math.cos(T * 21) * .5, aRe: .4 + Math.sin(T * 17) * .3, aLx: .8, aLz: .6, aLe: 1.2, headX: .2, ...shiver(T, .6) }); chalkIn(emil, CHALK3); cara(emil, T, { expr: 'shock', mouth: 'grimace' });
  const hpz = wpos(emil.aR.hand); puff(hpz.clone().setY(.4), L.t0, T, 6, .25, DUST, 2.9); SWEAT[0].visible = true; sweat(emil, T, 2);
  dec(DC.opa, 0, 5, 0, clamp(L.k * 1.2) * .7);
  orb(L.k, V(0, 1.8, 1.4), null, [14, .35, .35, 46], [8.5, .25, .35, 42], easeIn); sh(V(0, 0, 0), 16); }, [[0, 'chalk', 1], [.4, 'chalk', .9], [.9, 'chalk', .9], [1.5, 'creepy_ting', .6], [2.0, 'chalk', .8]]);
// ---------- 35 · «Als ich runterschaute, lag da ein alter Mann.» : picado: un anciano de tiza tumbado en el suelo ----------
shot(64.88, 'F', null, L => { town(); const T = L.T;
  dec(DC.opa, 0, 5, 0, .9); put(opa, 0, 1.0, 5.6, 0); opa.root.rotation.x = -PI / 2; opa.root.position.y = 1.0; cara(opa, T, { eyes: 'closed', mouth: 'smile' }); applyPose(opa, { aLz: .25, aRz: .25 });
  put(emil, 0, 0, -1.6, 0); applyPose(emil, { ...SIT, aLx: .4, aRx: .4, aLz: .5, aRz: .5, headX: .6, lean: .1 }); cara(emil, T, { expr: 'shock', mouth: 'o' });
  cam([0, 21 - L.k * 3, 9], [0, 0, 3.6], 46); sh(V(0, 0, 3), 16); }, [[0, 'sparkle', .7], [.5, 'gasp', .7]]);
// ---------- 36 · «Das beste Bild, das ich je gemalt habe.» : la gente se acerca a ver, «¡ohhh!» ----------
shot(67.32, 'Z', null, L => { town(); const T = L.T; FEST_BG(L, 60, 'sway');
  put(opa, 0, 1.0, 5.6, 0); opa.root.rotation.x = -PI / 2; cara(opa, T, { eyes: 'closed', mouth: 'smile' }); dec(DC.opa, 0, 5, 0, .9);
  put(emil, -3.6, 0, 2.6, .9); actuar(emil, L.lt, [[0, 'shock'], [.8, 'cheer']], { T }); cara(emil, T, L.lt > .8 ? { eyes: 'happy', mouth: 'open_smile' } : { expr: 'shock', mouth: 'o' });
  bg(L, [[XT[1], 4, 1, -.6, 'point'], [XT[2], 3.2, 9.5, -2.2, 'clap'], [K[3], -6, 1, 1.2, 'cheer'], [XT[6], 6, 6, -1.4, 'look']]);
  badge('gold', 'MEIN BESTES BILD!', W / 2, H * .18, (L.lt - .3) * 2, 1, .8);
  orb(L.k, V(0, 2.5, 4.5), null, [22, -.35, .5, 46], [19, -.15, .45, 46]); sh(V(0, 0, 4), 20); }, [[0, 'gasp', .6], [.4, 'aah', .7], [1.2, 'clap', .6]]);
// ---------- 37 · «Dabei kenne ich gar keinen alten Mann.» : Emil se rasca la cabeza con un «?» ----------
shot(69.66, 'C', null, L => { town(); const T = L.T; FEST_BG(L, 50, 'sway');
  put(emil, 0, 0, 0, .2); actuar(emil, L.lt, [[0, 'think']], { T }); talk(emil, T, L.t0, L.t1, 'confused'); put(opa, 4, 1.0, 1.5, .4); opa.root.rotation.x = -PI / 2; cara(opa, T, { eyes: 'closed', mouth: 'smile' });
  badge3('q', '?', hp(emil).add(V(0, 3, 0)), (L.lt - .2) * 2.5, 1);
  orb(L.k, V(.5, 2.8, 0), null, [12, .15, .1, 44], [11, -.05, .1, 44]); sh(V(0, 0, 0), 14); }, [[.2, 'pop', .6], [.5, 'hmm', .6]]);
// ---------- 38 · «Er setzte sich auf und klopfte sich den Kreidestaub von der Jacke –» ----------
shot(71.34, 'S', null, L => { town(); const T = L.T; FEST_BG(L, 60, 'still');
  const up = easeInOut(clamp(L.lt / .9)); put(opa, 0, lerp(1.0, 0, up), lerp(5.6, 3.2, up), 0); opa.root.rotation.x = lerp(-PI / 2, 0, up);
  actuar(opa, L.lt, [[0, { aLz: .25, aRz: .25 }], [1.0, { aRx: 1.0 + Math.sin(T * 14) * .4, aRz: -.8, aRe: 1.4, aLx: 1.0 + Math.cos(T * 14) * .4, aLz: -.8, aLe: 1.4, headX: .3 }]], { T }); cara(opa, T, L.lt > .9 ? { eyes: 'happy', mouth: 'smile' } : { eyes: 'half', mouth: 'flat' });
  puff(V(0, 1.5, 4.2), L.t0 + 1.0, T, 8, .4, DUST, 1.0);
  put(emil, -4.2, 0, 2.2, .9); applyPose(emil, GEST.recoil); cara(emil, T, { expr: 'shock', mouth: 'o' });
  orb(L.k, V(-1, 3, 3), null, [17, .35, .15, 44], [15, .15, .15, 44]); sh(V(0, 0, 3), 16); }, [[0, 'cloth', .7], [.6, 'stretch_creak', .6], [1.0, 'blow', .8], [1.6, 'cough', .4], [2.2, 'cloth', .6]]);
// ---------- 39 · «und jeder Schlüssel auf dem ganzen Fest flog direkt zu ihm.» : las llaves salen de bolsillos y puertas ----------
shot(74.45, 'W', null, L => { town(); const T = L.T; FEST_BG(L, 110, 'still');
  put(opa, 0, 0, 0, 0); actuar(opa, L.lt, [[0, 'shock']], { T }); cara(opa, T, { expr: 'shock', mouth: 'o' });
  keysFly(hp(opa).add(V(0, -2, 0)), L.t0 + .1, T + .0, 40);
  bg(L, [[XT[0], -8, -6, .5, 'point'], [XT[3], 9, -5, -.5, 'scared'], [K[1], -5, -12, .3, 'look'], [XT[4], 6, -14, -.2, 'point']]);
  orb(L.k, V(0, 4.5, 0), null, [26, 0, .2, 50], [22, .1, .18, 48]); sh(V(0, 0, 0), 40); }, [[0, 'keys', .9], [.3, 'whoosh_up', .6], [.7, 'keys', .8], [1.2, 'keys', .7]]);
// ---------- 40 · «…zu ihm. Klirr!» : se le pegan todas, ¡clinc! ----------
shot(76.35, 'C', 'punch', L => { town(); const T = L.T; FEST_BG(L, 60, 'still');
  put(opa, 0, 0, 0, 0); keysOn(); OPAKEYS.forEach((k, i) => k.visible = i < 6 + L.lt * 30); actuar(opa, L.lt, [[0, 'shock'], [.5, 'shrug']], { T }); cara(opa, T, { expr: 'shock', mouth: 'o' });
  keysFly(hp(opa).add(V(0, -2, 0)), L.t0 - .5, T, 30);
  badge('big', 'KLIRR!', W / 2, H * .2, L.lt * 3, 1, 1.1);
  orb(L.k, V(0, 3.6, 0), null, [15, .25, .1, 44], [13, .1, .1, 44]); sh(V(0, 0, 0), 16); }, [[0, 'metal_hit', .9], [.15, 'keys', 1], [.4, 'chain_rattle', .6]]);
// ---------- 41 · «Er lachte.» ----------
shot(77.57, 'F', null, L => { town(); const T = L.T; FEST_BG(L, 70, 'sway');
  put(opa, 0, 0, 0, -.15); keysOn(); actuar(opa, L.lt, [[0, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.2, aRe: 1.2, lean: -.12 + Math.sin(T * 12) * .05, headX: -.25 }]], { T }); laughF(opa, T);
  put(emil, 4, 0, 1.6, -.8); applyPose(emil, GEST.shrug); cara(emil, T, { expr: 'confused', mouth: 'smile' });
  orb(L.k, V(1.4, 3.6, .6), null, [14, -.25, .08, 44], [12, -.4, .08, 44]); sh(V(0, 0, 0), 16); }, [[0, 'laugh_old', .9], [.6, 'keys', .5]]);
// ---------- 42 · «Und für eine Sekunde sah ich ihn an einem anderen Ort:» : primer plano de Emil, destello, la imagen tiembla ----------
shot(79.17, 'F', 'slow', L => { town(); const T = L.T; grade.uniforms.sat.value = lerp(1.45, .7, L.k); grade.uniforms.sepia.value = L.k * .5;
  put(emil, 0, 0, 0, 0); actuar(emil, L.lt, [[0, { headX: -.1, aLx: .2, aRx: .2 }]], { T }); cara(emil, T, { eyes: L.lt > 1.6 ? 'wide' : 'normal', mouth: 'o' }); put(opa, -3.6, 0, -2.4, .6); keysOn(); laughF(opa, T);
  if (L.lt > 1.8) GL = .25 * Math.sin((L.lt - 1.8) * 20) ** 2;
  onFace(emil, 9, .2, .4, 40, L.k, 5); sh(V(0, 0, 0), 14); }, [[0, 'tension_str', .6], [1.0, 'heartbeat', .7], [2.0, 'creepy_ting', .6]]);
// ---------- 43 · «erstarrt auf einem Jahrmarkt, übersät mit Schlüsseln.» : feria en sepia, todo congelado; él inmóvil cubierto de llaves ----------
shot(81.75, 'G', 'slow', L => { use('JM'); sunset(); const T0 = 3.2; JM.update(T0); grade.uniforms.sepia.value = .75; grade.uniforms.sat.value = .9; grade.uniforms.vig.value = .7;
  put(opa, JMX, 0, 6, .2); keysOn(); applyPose(opa, { aLx: .6, aRx: 1.9, aRz: .2, aRe: .3, lean: -.05, headX: -.15 }); cara(opa, 0, { eyes: 'wide', mouth: 'o', noBlink: true });
  KEYS.forEach((k, i) => { if (i >= 24) return; const r = RNG(i * 3 + 7); show(k, JMX + (r() - .5) * 5, 1 + r() * 7, 6 + (r() - .5) * 2.5, r() * 6, 1); k.rotation.set(r() * 3, r() * 3, r() * 3); });
  bg({ T: T0, lt: 0 }, [[XT[1], JMX - 8, -4, .4, 'point'], [XT[4], JMX + 9, -2, -.5, 'look'], [K[6], JMX + 5, -10, -.1, 'idle']]);
  if (L.lt < .3) GL = .8 * (1 - L.lt / .3);
  orb(L.k, V(JMX, 4.2, 6), null, [30, .12, .14, 46], [17, .05, .1, 42], easeIn); sh(V(JMX, 0, 0), 40); }, [[0, 'record_scratch', .5], [.2, 'freeze', .8], [.5, 'music_box', .5], [1.5, 'keys', .4]]);
// ---------- 44 · «Ich wusste nicht, wer er war.» ----------
shot(84.94, 'F', null, L => { town(); const T = L.T; FEST_BG(L, 70, 'sway');
  put(emil, -1.6, 0, 0, .55); actuar(emil, L.lt, [[0, 'think']], { T }); talk(emil, T, L.t0, L.t1, 'confused');
  put(opa, 2.4, 0, -.6, -.6); keysOn(); actuar(opa, L.lt, [[0, { aLx: .3, aRx: .3, headZ: .2 }]], { T }); cara(opa, T, { expr: 'happy', mouth: 'smile' });
  orb(L.k, V(.4, 3.4, -.3), null, [16, .1, .1, 44], [15, -.1, .1, 44]); sh(V(0, 0, 0), 16); }, [[0, 'wind', .4], [.5, 'keys', .4]]);
// ---------- 45 · «Aber er umarmte mich, als hätte er ewig auf mich gewartet.» : abrazo cálido, alejamiento lento; al final, glitch ----------
shot(86.26, 'G', 'slow', L => { town('morning'); const T = L.T; FEST_BG(L, 80, 'still'); bloom.strength = .35;
  put(opa, .6, 0, 0, -PI / 2 + .25); keysOn(); applyPose(opa, { crouch: .25, lean: .25, aLx: 1.4, aRx: 1.4, aLz: -.6, aRz: -.6, aLe: 1.4, aRe: 1.4, headX: .25 }); cara(opa, T, { eyes: 'closed', mouth: 'smile' });
  put(emil, -1.6, 0, .2, PI / 2 - .25); applyPose(emil, { aLx: 1.2, aRx: 1.2, aLz: -.5, aRz: -.5, aLe: 1.5, aRe: 1.5, headX: -.15 }); cara(emil, T, { eyes: L.lt > 1.2 ? 'closed' : 'wide', mouth: 'smile' });
  show(KRU, -4.2, 0, 1.8, .6, .8); KRU.userData.anim(T, 0);
  if (L.lt > L.d - .5) GL = (L.lt - (L.d - .5)) / .5;
  orb(L.k, V(-.4, 3.2, .2), null, [11, .02, .1, 42], [17, .1, .14, 46], easeOut); sh(V(0, 0, 0), 16); }, [[0, 'hug', .8], [.3, 'strings', .6], [1.6, 'keys', .3], [2.9, 'glitch', .9]]);
// ===== Parte 2: el Sistema (89,9 – 149,0 s). Sala oscura con racks, pantalla curva, monitor vertical con fotogramas reales del vídeo, el núcleo (ojo) y el Chef =====
const PREV = [['LEON', 0], ['LEON', 1], ['PAUL', 2], ['NOAH', 3], ['BEN', 4], ['LUCA', 5], ['MAX', 6]];
// capturas de «vídeos anteriores»: otros niños protagonistas en Lindenbrück, cada uno con su regla
const SNAPS = [
  ['k0', L => { town(); put(K[0], 0, 0, 0, 0); umbIn(K[0], 2, .8); actuar(K[0], 1, [[0, { aRx: 1.3, aRe: 1.4, aLx: 2.5, aLz: .4 }]], { T: 3 }); grin(K[0], 3); orbit(V(0, 2.6, 0), 10, .2, .12, 44); sh(V(0, 0, 0), 14); }],
  ['k1', L => { town(); show(SKATE[1], 0, 0, 0, 0); put(K[1], 0, .6, 0, 0); applyPose(K[1], { crouch: .3, aLz: .7, aRz: .7, lean: .1 }); grin(K[1], 3); orbit(V(0, 2.6, 0), 10, -.3, .12, 44); sh(V(0, 0, 0), 14); }],
  ['k2', L => { town(); put(K[2], -1, 0, 0, .3); actuar(K[2], 1, [[0, 'wave']], { T: 3 }); grin(K[2], 3); STK.update(3, [[2, 0, -.5, -.3, .9]], 'wave'); orbit(V(.4, 2.6, 0), 11, 0, .12, 44); sh(V(0, 0, 0), 14); }],
  ['k3', L => { town(); put(K[3], -1.6, 0, 0, .4); actuar(K[3], 1, [[0, 'cheer']], { T: 3 }); laughF(K[3], 3); show(CAT, 2.2, 0, -.5, -.6, .6); orbit(V(.3, 2.6, 0), 12, 0, .12, 44); sh(V(0, 0, 0), 14); }],
  ['k4', L => { town(); put(K[4], 0, 0, 0, 0); actuar(K[4], 1, [[0, 'point_l']], { T: 3 }); grin(K[4], 3); DRA.g.visible = true; DRA.update(3, dpath(10, 14, -30, 60, 2, 0)); orbit(V(0, 4, 0), 14, .1, .1, 46); sh(V(0, 0, -10), 40); }],
  ['k5', L => { town(); put(K[5], 0, 0, 0, 0); actuar(K[5], 1, [[0, 'shock']], { T: 3 }); cara(K[5], 3, { expr: 'shock', mouth: 'o' }); keysFly(V(0, 3, 0), 0, .3, 20); orbit(V(0, 2.8, 0), 12, -.15, .12, 44); sh(V(0, 0, 0), 14); }],
  ['k6', L => { town('morning'); put(K[6], 0, 0, 0, 0); actuar(K[6], 1, [[0, 'wave']], { T: 3 }); grin(K[6], 3); show(KRU, 2.6, 0, .6, -.4, .7); orbit(V(.6, 2.6, 0), 11, .1, .12, 44); sh(V(0, 0, 0), 14); }],
];
// fotograma vertical tipo vídeo con título
function tile(c, img, x, y, w, h, o = {}) { c.save(); c.fillStyle = '#05070c'; c.fillRect(x, y, w, h); if (img) c.drawImage(img, x, y, w, h);
  if (o.title) { c.font = `700 ${w * .085}px ${FONT}`; c.textAlign = 'center'; c.lineJoin = 'round'; c.lineWidth = w * .03; c.strokeStyle = '#000'; c.strokeText(o.title, x + w / 2, y + h * .1); c.fillStyle = '#fff'; c.fillText(o.title, x + w / 2, y + h * .1); }
  if (o.name) { c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(x, y + h - h * .12, w, h * .12); c.font = `700 ${w * .11}px monospace`; c.textAlign = 'center'; c.fillStyle = o.nameCol || '#7ae8ff'; c.fillText(o.name, x + w / 2, y + h - h * .035); }
  if (o.views) { c.font = `700 ${w * .07}px ${FONT}`; c.textAlign = 'left'; c.fillStyle = '#fff'; c.fillText('▶ ' + o.views, x + w * .05, y + h * .84); }
  if (o.red) { c.fillStyle = `rgba(255,20,40,${.3 * o.red})`; c.fillRect(x, y, w, h); c.strokeStyle = '#ff2a3a'; c.lineWidth = w * .035; c.beginPath(); c.moveTo(x + w * .1, y + h * .1); c.lineTo(x + w * .9, y + h * .9); c.moveTo(x + w * .9, y + h * .1); c.lineTo(x + w * .1, y + h * .9); c.stroke(); }
  if (o.green) { c.fillStyle = '#2aff8a'; c.font = `700 ${w * .3}px ${FONT}`; c.textAlign = 'center'; c.fillText('✓', x + w * .82, y + h * .25); }
  c.strokeStyle = o.border || 'rgba(90,224,255,.7)'; c.lineWidth = o.bw || 3; c.strokeRect(x + 1, y + 1, w - 2, h - 2); c.restore(); }
// marca de «análisis»: círculo y texto sobre una zona del fotograma
function mark(c, x, y, r, text, k = 1, col = '#ff3a4a') { if (k <= 0) return; c.save(); c.strokeStyle = col; c.lineWidth = 8; c.beginPath(); c.arc(x, y, r, -PI / 2, -PI / 2 + 6.283 * clamp(k)); c.stroke(); if (text && k > .6) { c.font = `700 40px monospace`; c.textAlign = 'center'; c.lineWidth = 10; c.strokeStyle = '#000'; c.strokeText(text, x, y + r + 50); c.fillStyle = col; c.fillText(text, x, y + r + 50); } c.restore(); }
function term(c, lines, x, y, size = 30, col = '#7ae8ff', k = 99) { c.save(); c.font = `700 ${size}px monospace`; c.textAlign = 'left'; let n = 0; lines.forEach((l, i) => { const t = l.slice(0, Math.max(0, Math.floor(k - n))); n += l.length; c.fillStyle = l.startsWith('!') ? '#ff5a6a' : col; c.fillText(t.replace(/^!/, ''), x, y + i * size * 1.35); }); c.restore(); }
// sala: luces, actualización del núcleo y de la pantalla curva
function sala(L, talk = 0, red = 0, scr = null) { use('SY'); dark(); const T = L.T; SY.update(T, talk, red); SYL.intensity = 160; SYR.intensity = 60 + red * 140; SPOTL.intensity = 0; FILL.intensity = 45; FILL.color.setRGB(.75, .85, 1);
  SY.draw((c, w, h) => { scrBase(c, w, h, T, red); if (scr) scr(c, w, h); else { term(c, ['> stadt.sim  LINDENBRÜCK', '> held: EMIL (11)', '> status: LÄUFT', '> zuschauer: 4.812.330 online', red ? '!> FEHLER: UNBEKANNTE FIGUR' : '> fehler: 0'], 420, 200, 30, red ? '#ff6a7a' : '#7ae8ff'); } });
  vs((c, w, h) => { c.fillStyle = '#05070c'; c.fillRect(0, 0, w, h); }); }
// el Chef sentado en su silla (frente a la pantalla, de espaldas a la sala: lo vemos de cara desde la pantalla)
function chefSit(L, pose = {}, face = {}) { put(chef, SYX + 9, 2.1, -12, PI); applyPose(chef, { ...SIT, lLk: 1.4, lRk: 1.4, lLx: 1.45, lRx: 1.45, crouch: .05, ...pose }); cara(chef, L.T, { expr: 'angry', ...face }); }
const VSP = V(SYX - 2, 19, -34);
const aimC = (L, ch, d0, d1, dy = -1.2, off = 0, e = easeInOut) => { const c = hp(ch).add(V(0, dy, 0)); orb(L.k, c, null, [d0, ch.root.rotation.y + off, .08, 44], [d1, ch.root.rotation.y + off * .6, .06, 42], e); };   // centro del monitor vertical
// ---------- 46 · «System.» : glitch y entramos en la sala oscura; el Chef en su silla, iluminado por la pantalla ----------
shot(89.92, 'C', null, L => { sala(L); const T = L.T; chefSit(L, { headX: .1 }, { mouth: kitLips(T, spoken(L.t0, L.t1)) || 'flat' });
  vs((c, w, h) => tile(c, SNAP.emilHug, 0, 0, w, h, { title: 'IN DIESER STADT…' }));
  GL = clamp(1 - L.lt / .45);
  aimC(L, chef, 13, 10.5, -1.2, .25); sh(V(SYX, 0, -20), 40); }, [[0, 'glitch', 1], [.1, 'hum_low', .8], [.3, 'power_on', .6]]);
// ---------- 47 · «Ja.» : el núcleo se enciende ----------
shot(90.72, 'F', 'punch', L => { sala(L, 1); orbit(SY.core.position.clone().add(V(SYX, 0, 0)), 16 - L.k * 2, .25, .08, 44); sh(V(SYX, 0, -20), 40); }, [[0, 'zap', .7], [.05, 'beep', .6]]);
// ---------- 48 · «Wer ist der alte Mann?» : el monitor congela el abrazo y marca al anciano ----------
shot(91.13, 'Z', null, L => { sala(L); const T = L.T;
  vs((c, w, h) => { tile(c, SNAP.emilHug, 0, 0, w, h, { title: 'IN DIESER STADT…' }); mark(c, w * .66, h * .4, 110, '???', L.lt / .6); });
  orb(L.k, VSP.clone().add(V(0, -1, 0)), null, [36, 0, .02, 46], [31, 0, .02, 44]); sh(V(SYX, 0, -28), 40); }, [[0, 'zoom_in', .5], [.3, 'beep', .5]]);
// ---------- 49 · «Unbekannt. Ich habe ihn nicht geschrieben.» : búsqueda en la base de datos: NICHT GEFUNDEN ----------
shot(92.26, 'S', null, L => { sala(L, .7, .4, (c, w, h) => { term(c, ['> suche: "ALTER MANN"', '> skript_emil.txt ......', '> figuren: EMIL, LEA, KRÜMEL, LINA', '!> ERGEBNIS: NICHT GEFUNDEN', '!> AUTOR: UNBEKANNT'], 380, 190, 32, '#7ae8ff', L.lt * 70); });
  vs((c, w, h) => { tile(c, SNAP.opaKeys, 0, 0, w, h, { red: clamp(L.lt - .5) }); });
  orb(L.k, SY.core.position.clone().add(V(SYX, -1, 0)), null, [26, .1, .06, 46], [23, 0, .06, 46]); sh(V(SYX, 0, -20), 40); }, [[0, 'tick', .5], [.3, 'tick', .4], [.6, 'tick', .4], [.9, 'buzzer', .6]]);
// ---------- 50 · «Wie heißt der Junge?» «Emil.» : ficha de Emil ----------
shot(94.22, 'W', null, L => { sala(L, L.lt > 1 ? 1 : 0); const T = L.T; chefSit(L, { headX: -.05, lean: .1 }, { mouth: kitLips(T, spoken(L.t0, L.t0 + .9)) || 'flat' });
  vs((c, w, h) => { tile(c, SNAP.emilWave, 0, 0, w, h, { name: L.lt > .95 ? 'EMIL · 11' : '…' }); });
  aimC(L, chef, 12, 10.5, -1.2, .3); sh(V(SYX, 0, -20), 40); }, [[0, 'beep', .5], [1.0, 'notif', .7]]);
// ---------- 51 · «Und beim letzten Mal?» : el Chef se inclina hacia delante ----------
shot(95.73, 'C', 'punch', L => { sala(L); const T = L.T; chefSit(L, { lean: .35, headX: -.2, aLx: 1.0, aRx: 1.0, aLe: 1.2, aRe: 1.2 }, { mouth: kitLips(T, spoken(L.t0, L.t1)) || 'flat', expr: 'sus' }); SYR.intensity = 120;
  onFace(chef, 9, .4, .8, 40, L.k, 7); sh(V(SYX, 0, -20), 40); }, [[0, 'chair_roll', .5], [.4, 'hum', .5]]);
// ---------- 52 · «Leon. Leon. Paul.» : aparecen vídeos anteriores, uno por nombre ----------
const PT = [96.91, 97.33, 97.81, 98.40, 98.88, 99.31, 99.90];
const prevWall = (c, w, h, L, red = 0) => { c.fillStyle = '#05070c'; c.fillRect(0, 0, w, h); for (let i = 0; i < 7; i++) { const k = clamp((L.T - PT[i]) / .2); if (k <= 0) continue; const col = i % 3, row = Math.floor(i / 3), tw = 160, th = 284, x = 18 + col * (tw + 12), y = 20 + row * (th + 12);
  c.save(); c.globalAlpha = k; tile(c, SNAP['k' + PREV[i][1]], x, y + (1 - k) * 30, tw, th, { name: PREV[i][0], red }); c.restore(); } };
shot(96.91, 'Z', null, L => { sala(L, .8, 0, (c, w, h) => prevWall(c, w, h, L, 0, 7));
  vs((c, w, h) => { const i = [96.91, 97.33, 97.81, 98.40].filter(t => L.T >= t).length - 1; tile(c, SNAP['k' + Math.max(0, i)], 0, 0, w, h, { title: 'IN DIESER STADT…', name: PREV[Math.max(0, i)][0] }); });
  orb(L.k, VSP.clone().add(V(0, -1, 0)), null, [40, 0, .02, 46], [36, 0, .02, 46]); sh(V(SYX, 0, -28), 40); }, [[0, 'notif', .6], [.42, 'notif', .5], [.9, 'notif', .6]]);
// ---------- 53 · «Noah. Ben. Luca. Max.» : la pared se llena de vídeos con otros niños ----------
shot(98.40, 'S', null, L => { sala(L, .8); vs((c, w, h) => prevWall(c, w, h, L));
  orb(L.k, VSP.clone(), null, [38, -.04, .02, 46], [35, .04, .02, 46]); sh(V(SYX, 0, -28), 40); }, [[0, 'notif', .6], [.48, 'notif', .5], [.91, 'notif', .6], [1.5, 'notif', .6]]);
// ---------- 54 · «Und davor?» : el núcleo calla; la pantalla se queda en estática ----------
shot(100.40, 'C', null, L => { sala(L, 0, 0, (c, w, h) => { const r = RNG(Math.floor(L.T * 30)); for (let i = 0; i < 1600; i++) { const v = r() * 255 | 0; c.fillStyle = `rgb(${v},${v},${v})`; c.fillRect(r() * w, r() * h, 6, 4); } });
  chefSit(L, { lean: .3, headX: -.1 }, { expr: 'sus', mouth: kitLips(L.T, spoken(L.t0, L.t1)) || 'flat' }); GL = .15;
  aimC(L, chef, 11, 9, -1.2, -.3); sh(V(SYX, 0, -20), 40); }, [[0, 'tv_static', .7]]);
// ---------- 55 · «Du weißt nicht, wer er ist. Du weißt nicht, woher er kommt.» : el Chef se levanta y golpea la mesa ----------
shot(101.06, 'W', null, L => { sala(L, 0, .5); const T = L.T; const up = easeOut(clamp(L.lt / .5));
  put(chef, SYX + 7, 0, -16, PI + .3); actuar(chef, L.lt, [[0, { crouch: .4 }], [.4, 'point'], [1.6, { aLx: 1.6, aRx: 1.6, aLe: .4, aRe: .4, lean: .3, aLz: -.1, aRz: -.1 }]], { T }); talk(chef, T, L.t0, L.t1, 'angry');
  vs((c, w, h) => { tile(c, SNAP.opaLie, 0, 0, w, h, { title: 'HERKUNFT: ???', red: .4 }); });
  aimC(L, chef, 14, 12, -1.6, 0); sh(V(SYX, 0, -20), 40); }, [[0, 'chair_roll', .6], [.3, 'steps_heavy', .5], [1.65, 'table_bang', .9], [1.7, 'impact', .5]]);
// ---------- 56 · «Und er erinnert sich.» : en el monitor, el fotograma de la feria parpadea; zoom lento ----------
shot(104.01, 'G', 'slow', L => { sala(L, 0, .8); GL = .12 + .2 * (Math.sin(L.T * 9) > .7);
  vs((c, w, h) => { tile(c, SNAP.fair, 0, 0, w, h, { title: 'ERINNERUNG?' }); if (Math.sin(L.T * 13) > .3) { c.globalAlpha = .5; tile(c, SNAP.opaKeys, 0, 0, w, h); c.globalAlpha = 1; } mark(c, w * .5, h * .5, 120, '', clamp(L.k * 1.5)); });
  orb(L.k, VSP.clone().add(V(0, 1, 0)), null, [40, 0, .02, 46], [26, 0, .02, 40], easeIn); sh(V(SYX, 0, -28), 40); }, [[0, 'glitch', .6], [.3, 'creepy_ting', .7], [.9, 'heartbeat', .6]]);
// ---------- 57 · «Das ist dein Fehler, System. Ich habe dich neunmal gewarnt.» : nueve avisos rojos ----------
shot(105.49, 'F', null, L => { sala(L, 0, .9); vs((c, w, h) => { tile(c, SNAP.opaKeys, 0, 0, w, h, { red: .5 }); for (let i = 0; i < 9; i++) { const k = clamp((L.lt - .9 - i * .12) / .15); if (k <= 0) continue; const x = 45 + (i % 3) * 160, y = 200 + Math.floor(i / 3) * 190; c.save(); c.translate(0, 0); c.globalAlpha = k; c.fillStyle = 'rgba(80,0,10,.92)'; c.fillRect(x, y, 140, 160); c.strokeStyle = '#ff3a4a'; c.lineWidth = 5; c.strokeRect(x, y, 140, 160); c.font = `700 64px ${FONT}`; c.textAlign = 'center'; c.fillStyle = '#ff5a6a'; c.fillText('⚠', x + 70, y + 85); c.font = `700 22px monospace`; c.fillText('WARNUNG ' + (i + 1), x + 70, y + 135); c.restore(); } });
  const T = L.T; put(chef, SYX + 6, 0, -24, PI + .7); actuar(chef, L.lt, [[0, 'point']], { T }); talk(chef, T, L.t0, L.t1, 'angry');
  badge('red', '9×', W / 2, H * .17, (L.lt - 1.9) * 2.5, 1, 1.1);
  orb(L.k, V(SYX + 1, 15, -30), null, [30, .45, .05, 46], [27, .35, .05, 46]); sh(V(SYX, 0, -20), 40); }, [[0, 'alarm_soft', .5], [.9, 'beep', .5], [1.3, 'beep', .5], [1.95, 'buzzer', .7]]);
// ---------- 58 · «Sieh sie dir an. Sie schauen deine Geschichten nicht mehr an.» : el monitor llena de comentarios de los espectadores ----------
const COMMENTS = ['Wer ist der Opa??', 'Die Schlüssel!!! 🔑', 'Er war schon im Jahrmarkt-Video!', 'Teil 2 bitte', 'Leon = Emil???', 'Achtet auf die Hand…', 'Das System lügt', 'Ich hab alles gecheckt 🧐', 'Warum heißt jeder Junge anders?', 'Er erinnert sich!!'];
shot(108.36, 'W', null, L => { sala(L, 0, .5); const T = L.T;
  vs((c, w, h) => { tile(c, SNAP.emilHug, 0, 0, w, h); const n = Math.floor(L.lt * 4.5); for (let i = 0; i < Math.min(n, COMMENTS.length); i++) { const y = 120 + i * 78; c.fillStyle = 'rgba(0,0,0,.66)'; c.beginPath(); c.roundRect(24, y, w - 48, 64, 18); c.fill(); c.font = `700 26px ${FONT}`; c.textAlign = 'left'; c.fillStyle = ['#ffd23f', '#7ae8ff', '#ff9ac0', '#8aff9a'][i % 4]; c.fillText('@user' + (1000 + i * 731) % 9999, 44, y + 26); c.fillStyle = '#fff'; c.fillText(COMMENTS[i], 44, y + 54); } });
    sh(V(SYX, 0, -20), 40);
  orb(L.k, VSP.clone().add(V(0, -1, 0)), null, [34, 0, .02, 46], [31, 0, .02, 46]); }, [[0, 'notif', .5], [.5, 'notif', .5], [1.0, 'notif', .5], [1.6, 'notif', .5], [2.2, 'notif', .5]]);
// ---------- 59 · «Sie entschlüsseln sie.» : lupa sobre el vídeo, aparecen códigos ----------
shot(111.31, 'Z', null, L => { sala(L, 0, .6); vs((c, w, h) => { tile(c, SNAP.opaKeys, 0, 0, w, h); const mx = w * .5 + Math.sin(L.T * 3) * 80, my = h * .45 + Math.cos(L.T * 2) * 60; c.save(); c.beginPath(); c.arc(mx, my, 120, 0, 7); c.clip(); c.drawImage(SNAP.opaKeys, -mx * .8, -my * .8, w * 1.8, h * 1.8); c.restore(); c.lineWidth = 14; c.strokeStyle = '#ffd23f'; c.beginPath(); c.arc(mx, my, 120, 0, 7); c.stroke(); c.beginPath(); c.moveTo(mx + 85, my + 85); c.lineTo(mx + 170, my + 170); c.lineWidth = 26; c.stroke();
    term(c, ['0x4C 0x45 0x4F', 'KEY=ERINNERUNG', 'FIGUR_07: ??'], 30, h - 140, 30, '#8aff9a', L.lt * 40); });
  orb(L.k, VSP.clone(), null, [32, 0, .02, 44], [27, 0, .02, 42]); sh(V(SYX, 0, -28), 40); }, [[0, 'zoom_in', .5], [.4, 'beep', .4], [.7, 'beep', .4]]);
// ---------- 60 · «Bald finden sie deinen Server.» : travelling por el pasillo de racks, luces rojas ----------
shot(112.42, 'S', null, L => { sala(L, 0, 1); SYR.intensity = 200; SYR.position.set(SYX - 30, 14, 10 - L.lt * 10);
  cam([SYX - 29 + Math.sin(L.T * 1.2) * .5, 10, 36 - L.lt * 9], [SYX - 29, 9, -20], 50); sh(V(SYX - 29, 0, 0), 50); }, [[0, 'alarm', .6], [.5, 'machine_hum', .5]]);
// ---------- 61 · «Sie werden ihn nicht finden.» : el núcleo, frío y tranquilo ----------
shot(114.09, 'C', null, L => { sala(L, 1, 0); orb(L.k, SY.core.position.clone().add(V(SYX, 0, 0)), null, [20, .35, .05, 44], [17, .2, .05, 42]); sh(V(SYX, 0, -20), 40); }, [[0, 'hum_low', .6], [.4, 'beep', .4]]);
// ---------- 62 · «Der Zuschauer soll nicht genauer hinsehen.» : el ojo se gira y nos mira a nosotros; zoom a la pupila ----------
shot(115.42, 'Z', 'slow', L => { sala(L, 1, .2); const c0 = SY.core.position.clone().add(V(SYX, 0, 0)); SY.core.rotation.y = -.8 + easeInOut(clamp(L.lt / .6)) * .8;
  orb(L.k, c0, null, [22, 0, .02, 44], [9, 0, .02, 38], easeIn); camera.lookAt(c0); SY.core.lookAt(camera.position); sh(V(SYX, 0, -20), 40); }, [[0, 'whoosh_soft', .5], [.6, 'heartbeat', .6]]);
// ---------- 63 · «Der Zuschauer soll weiterwischen.» : en el monitor, un dedo desliza el feed hacia arriba ----------
shot(117.44, 'W', null, L => { sala(L, .8); vs((c, w, h) => { const off = (L.lt * 2.2 % 1) * h; const imgs = [SNAP.emilHug, SNAP.k0, SNAP.k3, SNAP.dragon, SNAP.k5]; for (let i = -1; i < 3; i++) tile(c, imgs[(Math.floor(L.lt * 2.2) + i + 5) % 5], 0, i * h - off * easeInOut(1), w, h, { views: (1 + i * 3) + ',2 Mio' });
    const fy = h * .75 - ((L.lt * 2.2) % 1) * h * .45; c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.ellipse(w * .62, fy, 46, 62, -.2, 0, 7); c.fill(); });
  orb(L.k, VSP.clone(), null, [38, 0, .02, 44], [35, 0, .02, 42]); sh(V(SYX, 0, -28), 40); }, [[0, 'swipe', .6], [.45, 'swipe', .5], [.9, 'swipe', .6], [1.35, 'swipe', .5]]);
// ---------- 64 · «Hier ist ein gutes Video.» : el monitor pone el vídeo de Mila y la cámara entra en la pantalla ----------
shot(119.12, 'Z', null, L => { sala(L, .9); vs((c, w, h) => { tile(c, SNAP.mila1, 0, 0, w, h, { title: 'IN MEINER STADT…', views: '38 Mio' }); });
  orb(L.k, VSP.clone(), null, [34, 0, .02, 44], [12, 0, .01, 40], easeIn); sh(V(SYX, 0, -28), 40); }, [[0, 'click_set', .6], [.4, 'music_box', .5], [1.0, 'zoom_in', .6]]);
// ----- Vídeo de Mila (colores pastel, arcoíris donde se ríe, interfaz de vídeo) -----
function milaTown(L, p) { town(); grade.uniforms.sat.value = 1.65; grade.uniforms.lift.value = .05; TINT = 'rgba(255,190,230,.10)'; bloom.strength = .32; VIDUI = { p, views: '38.000.000 Aufrufe', likes: '4,1 Mio', a: 1 }; }
const RBP = [[-5, -6], [6, -9], [0, -14]];
// ---------- 65 · «In meiner Stadt wächst überall, wo du lachst,» ----------
shot(120.62, 'F', null, L => { milaTown(L, .1 + L.k * .2); const T = L.T;
  put(mila, 0, 0, 0, .1); actuar(mila, L.lt, [[0, { aLx: .6, aRx: .6, aLz: .5, aRz: .5, lean: -.1 }]], { T }); talk(mila, T, L.t0, L.t1, 'happy', { eyes: 'happy' });
  FLW.forEach((f, i) => { if (i >= 18) return; const r = RNG(i + 3), k = spring(clamp((L.lt - i * .06) / .3)); show(f, (r() - .5) * 14, .7, -3 + (r() - .5) * 8, 0, Math.max(.01, k) * 1.2); });
  crowdAt(T, grid(-30, -40, 30, -14, 50, 21, 0), 'cheer');
  orb(L.k, V(0, 2.6, -1), null, [13, .3, .1, 44], [11, .1, .1, 44]); sh(V(0, 0, 0), 20); }, [[0, 'kids_laugh', .7], [.3, 'sparkle', .6], [.8, 'pop', .5]]);
// ---------- 66 · «… ein Regenbogen.» : al reír, brotan arcoíris del suelo ----------
shot(122.16, 'Z', null, L => { milaTown(L, .3 + L.k * .2); const T = L.T;
  put(mila, 0, 0, 0, 0); actuar(mila, L.lt, [[0, 'cheer']], { T }); laughF(mila, T);
  RBOW.forEach((r, i) => { const k = spring(clamp((L.lt - .15 - i * .25) / .5)); show(r, RBP[i][0], 0, RBP[i][1], (i - 1) * .3, Math.max(.01, k)); });
  orb(L.k, V(0, 5, -6), null, [26, .1, .12, 46], [23, -.05, .12, 46]); sh(V(0, 0, -6), 30); }, [[.15, 'magic_hit', .7], [.4, 'chime', .6], [.65, 'chime', .5], [1.1, 'kids_laugh', .5]]);
// ---------- 67 · «Ich heiße Mila – und ich lache den ganzen Tag.» ----------
shot(123.75, 'S', null, L => { milaTown(L, .5 + L.k * .2); const T = L.T;
  put(mila, 0, 0, 0, .2); actuar(mila, L.lt, [[0, 'wave']], { T }); talk(mila, T, L.t0, L.t1, 'happy', { eyes: 'happy' });
  bg(L, [[XT[0], -5, -3, .5, 'clap'], [K[4], 5, -4, -.5, 'cheer']]); RBOW.forEach((r, i) => show(r, RBP[i][0] * 1.4, 0, RBP[i][1] - 6, (i - 1) * .3, 1));
  badge3('tag', 'MILA', hp(mila).add(V(0, 2.4, 0)), (L.lt - .1) * 2.5);
  orb(L.k, V(0, 2.8, -1), null, [15, -.2, .12, 44], [13, .05, .12, 44]); sh(V(0, 0, -2), 24); }, [[0, 'laugh_m', .4], [.6, 'kids_laugh', .6], [1.5, 'sparkle', .5]]);
// ---------- 68 · «Heute lacht sie. Keine Fehler.» : volvemos a la sala; el monitor muestra a Mila con una marca verde ----------
shot(126.43, 'G', null, L => { sala(L, .9, 0, (c, w, h) => term(c, ['> video: MILA_regenbogen.mp4', '> fehler: 0   ✓', '> codes: 0    ✓', '> alter mann: 0 ✓'], 420, 220, 34, '#8aff9a', L.lt * 40));
  vs((c, w, h) => tile(c, SNAP.mila2, 0, 0, w, h, { green: L.lt > .9, views: '38 Mio', border: '#2aff8a', bw: 8 }));
  if (L.lt < .2) GL = .6 * (1 - L.lt / .2);
  orb(L.k, VSP.clone().add(V(0, -2, 0)), null, [40, 0, .03, 46], [37, 0, .03, 46]); sh(V(SYX, 0, -28), 40); }, [[0, 'glitch', .5], [.4, 'ding_soft', .7], [1.2, 'ding_soft', .6]]);
// ---------- 69 · «Keine Codes. Kein alter Mann.» : el fotograma del anciano tachado ----------
shot(128.20, 'C', null, L => { sala(L, .9); vs((c, w, h) => { tile(c, SNAP.mila2, 0, 0, w, h, { green: true }); const k = clamp((L.lt - .5) / .3); if (k > 0) { c.save(); c.globalAlpha = k; tile(c, SNAP.opaKeys, w * .3, h * .3, w * .64, h * .64, { red: 1, bw: 6, border: '#ff3a4a' }); c.restore(); } });
  orb(L.k, VSP.clone().add(V(0, 0, 0)), null, [33, 0, .02, 44], [30, 0, .02, 42]); sh(V(SYX, 0, -28), 40); }, [[0, 'ding_soft', .6], [.55, 'buzzer', .7]]);
// ---------- 70 · «Sie hat noch nie eine einzige Frage gestellt.» : Mila sonríe vacía; el núcleo, satisfecho ----------
shot(130.19, 'W', null, L => { sala(L, .9); vs((c, w, h) => tile(c, SNAP.mila3, 0, 0, w, h, { views: '38 Mio' }));
  orb(L.k, VSP.clone(), null, [36, -.06, .02, 46], [33, .04, .02, 46]); sh(V(SYX, 0, -28), 40); }, [[0, 'hum', .5], [1.2, 'music_box', .4]]);
// ---------- 71 · «38 Millionen Aufrufe.» : el contador sube a 38.000.000 ----------
shot(132.70, 'C', 'punch', L => { sala(L, .9, 0, (c, w, h) => { const v = Math.floor(38000000 * easeOut(clamp(L.lt / 1.2))); c.font = `700 120px monospace`; c.textAlign = 'center'; c.fillStyle = '#ffd23f'; c.fillText(v.toLocaleString('de-DE'), w / 2, h / 2 + 30); c.font = `700 40px monospace`; c.fillStyle = '#7ae8ff'; c.fillText('AUFRUFE', w / 2, h / 2 + 100); });
  vs((c, w, h) => tile(c, SNAP.mila1, 0, 0, w, h, { views: (38 * easeOut(clamp(L.lt / 1.2))).toFixed(0) + ' Mio' }));
  badge('gold', '38 MILLIONEN', W / 2, H * .17, (L.lt - .05) * 2.5, 1, .95);
  cam([SYX - 2, 20, 6 - L.k * 4], [SYX - 2, 20, -40], 52); sh(V(SYX, 0, -28), 40); }, [[0, 'cash_reg', .7], [.2, 'coins', .6], [.6, 'tick_down', .4]]);
// ---------- 72 · «Aber beim letzten Mal ist der Zuschauer geblieben. Sie mochten ihn.» : el vídeo de Emil se llena de corazones ----------
shot(134.59, 'S', null, L => { sala(L, 0, .4); const T = L.T; vs((c, w, h) => { tile(c, SNAP.emilHug, 0, 0, w, h, { views: '61 Mio' }); for (let i = 0; i < Math.floor(L.lt * 14); i++) { const r = RNG(i * 5), y = h - ((L.lt * 300 + r() * h) % h); c.font = `${40 + r() * 40}px sans-serif`; c.fillStyle = '#ff3a6a'; c.fillText('♥', w * .6 + r() * w * .35, y); } });
  put(chef, SYX + 8, 0, -22, .9); actuar(chef, L.lt, [[0, "cross"]], { T }); talk(chef, T, L.t0, L.t1, 'sus');
  orb(L.k, VSP.clone(), null, [35, .04, .02, 46], [32, -.04, .02, 46]); sh(V(SYX, 0, -20), 40); }, [[0, 'notif', .5], [.8, 'pop', .4], [1.6, 'pop', .4], [2.4, 'notif', .5]]);
// ---------- 73 · «Der Zuschauer sieht nur, was ich ihm zeige.» : el núcleo enrojece ----------
shot(137.83, 'C', null, L => { sala(L, 1, clamp(L.lt / .8)); orb(L.k, SY.core.position.clone().add(V(SYX, 0, 0)), null, [18, .4, .06, 44], [15, .2, .06, 42]); sh(V(SYX, 0, -20), 40); }, [[0, 'hum_low', .7], [.6, 'zap', .5]]);
// ---------- 74 · «Bring das in Ordnung. Lass ihn vergessen.» : el Chef, amenazante, de cerca ----------
shot(139.93, 'F', null, L => { sala(L, 0, .8); const T = L.T; put(chef, SYX + 6, 0, -18, PI + .25); actuar(chef, L.lt, [[0, 'point_l'], [1.1, { aLx: 1.2, aLz: -.3, aLe: 1.8, aRx: .3, lean: .2 }]], { T }); talk(chef, T, L.t0, L.t1, 'angry'); SYR.intensity = 180;
  onFace(chef, 10, .2, 0, 40, L.k, 8); sh(V(SYX, 0, -20), 40); }, [[0, 'impact_soft', .5], [1.1, 'whoosh_soft', .4]]);
// ---------- 75 · «Sonst sieht dich nie wieder jemand.» : la mano sobre el interruptor rojo; las pantallas se apagan una a una (zoom lento) ----------
shot(141.97, 'C', 'slow', L => { sala(L, 0, 1, (c, w, h) => { c.fillStyle = `rgba(0,0,0,${clamp(L.k * 1.2)})`; c.fillRect(0, 0, w, h); }); const T = L.T;
  put(chef, SYX + 7, 0, -16, PI + .4); actuar(chef, L.lt, [[0, { aRx: 1.3, aRe: .3, lean: .2, headX: .1 }]], { T }); talk(chef, T, L.t0, L.t1, 'angry');
  vs((c, w, h) => { tile(c, SNAP.emilHug, 0, 0, w, h); c.fillStyle = `rgba(0,0,0,${clamp(L.k * 1.3)})`; c.fillRect(0, 0, w, h); }); SY.leds.forEach(([l], i) => { if (i % 7 < L.k * 7) l.visible = false; });
  aimC(L, chef, 15, 10, -1.4, .1, easeIn); sh(V(SYX, 0, -20), 40); }, [[0, 'switch', .7], [.5, 'power_on', .3], [1.0, 'machine_shake', .4]]);
// ---------- 76 · «Wie soll ich das reparieren? Es ist doch nur Kreide.» : el monitor muestra la plaza en directo; el núcleo duda ----------
shot(143.64, 'W', null, L => { sala(L, .9, .3, (c, w, h) => term(c, ['> objekt: KREIDE', '> eigenschaft: lebendig', '> schwäche: ???'], 420, 260, 36, '#ffd23f', L.lt * 30)); vs((c, w, h) => tile(c, SNAP.dragon, 0, 0, w, h, { name: 'LIVE · LINDENBRÜCK', nameCol: '#ff6a7a' }));
  orb(L.k, VSP.clone(), null, [36, -.05, .02, 46], [33, .05, .02, 46]); sh(V(SYX, 0, -20), 40); }, [[0, 'beep', .4], [.7, 'beep', .4], [1.5, 'hmm', .4]]);
// ---------- 77 · «Dann lass es regnen.» : el Chef, lento, se inclina hacia la cámara ----------
shot(146.26, 'C', 'punch', L => { sala(L, 0, 1); const T = L.T; put(chef, SYX + 7, 0, -16, PI + .1); actuar(chef, L.lt, [[0, { lean: .3, headX: -.1 }]], { T }); talk(chef, T, L.t0, L.t1, 'smug'); SYR.intensity = 200;
  onFace(chef, 8, .1, .4, 38, L.k, 6); sh(V(SYX, 0, -20), 40); }, [[0, 'thunder', .5]]);
// ---------- 78 · «Regen. 100 Prozent.» : el deslizador de lluvia sube al 100 %; glitch de salida ----------
shot(147.32, 'G', null, L => { sala(L, 1, 1, (c, w, h) => { const k = easeInOut(clamp(L.lt / 1.1)); c.font = `700 52px monospace`; c.textAlign = 'center'; c.fillStyle = '#7ae8ff'; c.fillText('WETTER: REGEN', w / 2, 240); c.fillStyle = '#1a2a3a'; c.fillRect(240, 320, 800, 50); c.fillStyle = '#3a9aff'; c.fillRect(240, 320, 800 * k, 50); c.fillStyle = '#fff'; c.beginPath(); c.arc(240 + 800 * k, 345, 34, 0, 7); c.fill(); c.font = `700 96px monospace`; c.fillStyle = '#ffd23f'; c.fillText(Math.round(k * 100) + ' %', w / 2, 500); });
  vs((c, w, h) => { tile(c, SNAP.dragon, 0, 0, w, h); c.fillStyle = 'rgba(40,60,90,.5)'; c.fillRect(0, 0, w, h); const r = RNG(Math.floor(L.T * 30)); c.strokeStyle = 'rgba(200,230,255,.6)'; c.lineWidth = 2; for (let i = 0; i < 120; i++) { const x = r() * w, y = r() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 6, y + 30); c.stroke(); } });
  badge('blue', 'REGEN 100 %', W / 2, H * .17, (L.lt - .45) * 2.5, 1, 1);
  if (L.lt > L.d - .45) GL = (L.lt - (L.d - .45)) / .45;
  cam([SYX - 2, 19, -6 + L.k * 4], [SYX - 2, 19, -40], 50); sh(V(SYX, 0, -28), 40); }, [[0, 'switch', .6], [.2, 'riser_short', .6], [.5, 'rain', .5], [1.2, 'glitch', .9]]);
SNAPS.push(['mila1', L => { const i = shotAt(121.2); S[i].fn({ lt: .5, k: .3, T: 121.2, d: 1.5, t0: 120.62, t1: 122.16 }); VIDUI = null; }], ['mila2', L => { const i = shotAt(122.9); S[i].fn({ lt: .8, k: .5, T: 122.9, d: 1.6, t0: 122.16, t1: 123.75 }); }], ['mila3', L => { const i = shotAt(124.6); S[i].fn({ lt: .8, k: .5, T: 124.6, d: 2.6, t0: 123.75, t1: 126.43 }); }]);
// ===== Parte 3: la tormenta, el dragón se derrite, el techo de paraguas, el tobogán (149,0 – 202,2 s) =====
// dragón sobre el centro de la plaza, encima de la cima del tobogán (0, 30, 0)
const DP = (s, t) => dpath(22, 33, -3, 60, .8, 0)(s, t);
const storm_ = (L, k = 1, c = V(0, 0, 0), rk = 1) => { town('storm'); storm(k); CLO.set(V(0, 0, -10), L.T, k, 160, 70); RAIN.update(L.T, c, rk, 70, 50, 70); };
const umbRoof = (k = 1, gap = 3) => { const L_ = []; for (let x = -26; x <= 26; x += 5.6) for (let z = -14; z <= 40; z += 5.6) { if (Math.abs(x) < gap && z > -4) continue; const r = RNG((x + 40) * 97 + z); if (r() > k) continue; L_.push([x + (r() - .5) * 1.4, 0, z + (r() - .5) * 1.4, (r() - .5) * .15, (r() - .5) * .15, r() * 6]); } return L_; };
const roofPeople = L_ => L_.filter(u => !(Math.abs(u[0]) < 10 && u[2] > 0 && u[2] < 24)).map(u => [u[0], u[2], Math.atan2(-u[0], 30 - u[2]) + (RNG(u[0] * 7)() - .5) * .6]);
// ---------- 79 · «Dann heulte die Regensirene.» ----------
shot(148.97, 'C', 'punch', L => { town(); const T = L.T; SIR.userData.on(T, true); GL = clamp(.7 - L.lt / .3);
  bg(L, [[XT[2], -36 + 3, -16 + 7, -.4, 'scared'], [K[5], -36 - 3.5, -16 + 6, .4, 'look']]);
  orb(L.k, V(-36, 12, -16), null, [32, 1.25, -.12, 48], [27, 1.35, -.18, 46]); sh(V(-36, 0, -16), 24); }, [[0, 'glitch', .5], [.05, 'siren', 1.0], [.6, 'gasp', .5]]);
// ---------- 80 · «Mitten im Juli.» : cartel de julio y helado; todo el mundo mira al cielo ----------
shot(150.78, 'F', null, L => { town(); const T = L.T; SIR.userData.on(T, true);
  put(K[4], 0, 0, 0, .1); actuar(K[4], L.lt, [[0, { aRx: 1.3, aRe: 1.5, headX: -.5 }]], { T }); cara(K[4], T, { expr: 'shock', mouth: 'o' });
  badge('gold', '☀ 15. JULI', W / 2, H * .17, (L.lt - .1) * 2.5, 1, 1);
  bg(L, [[XT[5], -4.4, -3, .4, 'look'], [XT[6], 4.4, -3.5, -.3, 'look', .2]]);
  orb(L.k, V(0, 2.8, -1), null, [14, .1, .05, 44], [12, -.05, .05, 44]); sh(V(0, 0, 0), 16); }, [[0, 'siren', .5], [.3, 'ding_soft', .5]]);
// ---------- 81 · «Aus dem Nichts zogen schwarze Wolken auf,» : las nubes negras se tragan el cielo sobre el Rathaus (zoom lento) ----------
shot(151.78, 'Z', 'slow', L => { const T = L.T; town(); storm(L.k); CLO.set(V(-6, 0, -90), T, .2 + L.k * .9, 220, 60);
  crowdAt(T, grid(-50, -60, 40, -20, 80, 13, 0), 'still', true);
  orb(L.k, V(-6, 30, -84), null, [120, 0, .06, 52], [96, .03, .04, 48], easeIn); sh(V(-6, 0, -60), 60); }, [[0, 'wind', .8], [.8, 'thunder', .6], [1.6, 'wind', .6]]);
// ---------- 82 · «und alle schnappten sich ihre Bilder und rannten.» ----------
shot(153.78, 'W', null, L => { const T = L.T; storm_(L, 1, V(0, 0, 20), .4);
  bg(L, [[XT[0], -8, 12, .1, 'run'], [XT[1], 4, 6, .2, 'run', .3], [K[0], -2, 2, .1, 'run', .2], [K[7], 9, 14, -.2, 'run', .6], [XT[3], -12, -2, .3, 'run', .8]]);
  const cp = loc(XT[0], 0, 1.2, 2.2); show(CAT, cp.x, cp.y, cp.z, .1 + PI / 2, .42); CAT.userData.anim(T); const sp = loc(K[0], 0, .8, 1.6); show(SKATE[2], sp.x, sp.y, sp.z, PI / 2 + .1, .7);
  crowdAt(T, grid(-50, -50, 40, -10, 70, 14, 0), 'cheer');
  orb(L.k, V(-1, 3, 16 + L.lt * 7), null, [13, .1, .12, 48], [12, -.1, .12, 48]); sh(V(0, 0, 18), 40); }, [[0, 'crowd_run', .8], [.5, 'thunder', .5], [1.2, 'shout_m', .4], [1.8, 'rain', .5]]);
// ---------- 83 · «Der erste Tropfen traf Smaragd,» : una gota gorda cae sobre la cola del dragón ----------
shot(156.35, 'C', 'punch', L => { const T = L.T; storm_(L, 1, V(-30, 30, -3), .25); DRA.g.visible = true; DRA.update(T, DP); riders(T, 0);
  const tail = DRA.segs[DRA.N - 3].position; const dk = clamp(L.lt / .8); SWEAT[0].visible = true; SWEAT[0].position.copy(tail).add(V(0, 14 * (1 - dk) + 2, 0)); SWEAT[0].scale.set(4, 6, 4); if (dk >= 1) SWEAT[0].visible = false;
  puff(tail.clone().add(V(0, 1.5, 0)), L.t0 + .8, T, 10, .6, GDUST, 1.2);
  orbit(tail.clone().add(V(0, 4, 0)), 15 - L.k * 2, .45, .22, 44); sh(V(-30, 0, -3), 40); }, [[.1, 'drip', .8], [.8, 'water_bloop', 1], [.85, 'splash', .7]]);
// ---------- 84 · «und Leas Drache fing an zu zerlaufen –» : la cola gotea verde; Lea abajo, horrorizada ----------
shot(158.19, 'S', null, L => { const T = L.T; storm_(L, 1, V(-20, 15, -3), .8); DRA.g.visible = true; DRA.update(T, DP, { melt: .05 + L.k * .08 }); riders(T, 1);
  put(lea, -30, 0, 8, PI - .2); actuar(lea, L.lt, [[0, 'hands_head']], { T }); cara(lea, T, { expr: 'shock', mouth: 'grimace' });
  orb(L.k, V(-30, 11, 3), null, [36, -.1, .05, 48], [32, .05, .05, 48]); sh(V(-30, 0, 0), 40); }, [[0, 'drip', .8], [.4, 'drip', .7], [.8, 'gasp', .6], [1.2, 'rain', .5]]);
// ---------- 85 · «mit neun Kindern auf dem Rücken,» : los niños se agarran, asustados ----------
shot(160.13, 'W', null, L => { const T = L.T; storm_(L, 1, V(0, 33, -3), 1); DRA.g.visible = true; DRA.update(T, DP, { melt: .13 + L.k * .04 }); riders(T, 1);
  badge('red', '9 KINDER', W / 2, H * .16, (L.lt - .1) * 2.5, 1, .9);
  const c = DRA.seat(11); orbit(c.clone().add(V(0, 1.4, 0)), 20 - L.k * 2, .25, .15, 46); sh(c.clone().setY(0), 40); }, [[0, 'scream_girl', .5], [.5, 'kids_laugh', 0], [.6, 'cry_girl', .4], [1.0, 'rain', .5]]);
// ---------- 86 · «zwölf Meter über dem Boden.» : picado vertiginoso desde el lomo ----------
shot(161.75, 'Z', null, L => { const T = L.T; storm_(L, 1, V(0, 15, 0), 1); DRA.g.visible = true; DRA.update(T, DP, { melt: .17 }); riders(T, 1);
  crowdAt(T, grid(-30, -20, 30, 30, 70, 15, 0), 'still', true);
  badge('big', '12 METER', W / 2, H * .55, (L.lt - .15) * 2.5, 1, 1);
  const c = DRA.seat(9); cam([c.x + 2, c.y + 5, c.z + 3], [c.x - 2, 0, c.z + 6], 58 - L.k * 6); sh(V(0, 0, 0), 40); }, [[0, 'wind', .8], [.4, 'heartbeat', .7]]);
// ---------- 87 · «Lea versuchte, eine Leiter zu malen,» : Lea dibuja una escalera rosa a toda prisa ----------
shot(163.15, 'S', null, L => { const T = L.T; storm_(L, 1, V(-14, 0, 0), 1); DRA.g.visible = true; DRA.update(T, DP, { melt: .18 }); riders(T, 1);
  show(LAD, -14, 0, -2.6, 0); LAD.userData.set(clamp(L.lt / 1.6));
  put(lea, -14, 0, -.6, PI); applyPose(lea, { aRx: 2.4 - clamp(L.lt / 1.6) * .6 + Math.sin(T * 14) * .2, aRz: Math.cos(T * 14) * .3, aRe: .3, aLx: .4, headX: -.3 }); chalkIn(lea, CHALK2); cara(lea, T, { expr: 'determined', mouth: 'grimace' });
  orb(L.k, V(-14, 4.5, -1.6), null, [15, PI / 2 + .6, .12, 46], [13, PI / 2 + .45, .1, 46]); sh(V(-14, 0, -2), 24); }, [[0, 'chalk', 1], [.4, 'chalk', .8], [.8, 'chalk', .9], [1.3, 'chalk', .7]]);
// ---------- 88 · «aber der Regen spülte sie weg, bevor sie fertig war.» ----------
shot(164.95, 'C', null, L => { const T = L.T; storm_(L, 1, V(-14, 5, 0), 1); show(LAD, -14, 0, -2.6, 0); LAD.userData.set(.75 * (1 - easeIn(clamp(L.lt / 1.6)))); puff(V(-14, 8, -2.6), L.t0 + .2, T, 10, .6, DUST, 1.6);
  put(lea, -14, 0, -.6, PI - .4); actuar(lea, L.lt, [[0, 'shock'], [1.3, 'hands_head']], { T }); cara(lea, T, { expr: 'shock', mouth: 'grimace' }); sweat(lea, T);
  orb(L.k, V(-14, 5, -1.8), null, [20, PI / 2 + .6, .08, 46], [18, PI / 2 + .8, .08, 46]); sh(V(-14, 0, -2), 24); }, [[0, 'water_bloop', .7], [.4, 'drip', .7], [1.2, 'sob', .5]]);
// ---------- 89 · «Ein richtiges Bild braucht Stunden.» : reloj que gira loco sobre el dibujo enorme de Lea ----------
shot(167.45, 'W', null, L => { const T = L.T; storm_(L, 1, V(0, 0, 0), .8);
  put(lea, 0, 0, 0, 0); applyPose(lea, drawP(T, 4)); chalkIn(lea, CHALK2); cara(lea, T, { expr: 'worried', mouth: 'frown' }); dec(DC.mast1, 0, 3.6, 0); dec(DC.mast2, -3, 7, .3);
  badge('gold', '⏱ STUNDEN', W / 2, H * .17, (L.lt - .1) * 2.5, 1, 1);
  orb(L.k, V(0, 2, 1.4), null, [16, .3, .5, 46], [14, .1, .45, 46]); sh(V(0, 0, 0), 16); }, [[0, 'clock_spin', .8], [.6, 'ticks', .6]]);
// ---------- 90 · «Wir hatten Sekunden.» : el dragón, cada vez más corto; cuenta atrás ----------
shot(169.41, 'C', 'punch', L => { const T = L.T; storm_(L, 1, V(0, 30, 0), 1); DRA.g.visible = true; DRA.update(T, DP, { melt: .2 + L.k * .03 }); riders(T, 1);
  badge('red', '⏱ SEKUNDEN', W / 2, H * .17, (L.lt - .05) * 2.5, 1, 1);
  orbit(DRA.seat(12), 34, -.3, .02, 48); sh(V(0, 0, 0), 40); }, [[0, 'tick', .7], [.3, 'tick', .7], [.6, 'tick', .7], [.9, 'tick', .8], [1.1, 'scream_girl', .4]]);
// ---------- 91 · «Und keiner in der Stadt malt schneller als ich –» : Emil aprieta la tiza, decidido (zoom lento) ----------
shot(170.78, 'Z', 'slow', L => { const T = L.T; storm_(L, 1, V(0, 0, 10), .7);
  put(emil, 0, 0, 10, 0); actuar(emil, L.lt, [[0, { aRx: 1.6, aRz: -.3, aRe: 1.6, aLz: .2, headX: .05 }]], { T, extra: shiver(T, .3) }); chalkIn(emil); cara(emil, T, { expr: 'determined', mouth: 'flat' }); show(KRU, 2.6, 0, 11, -.3, .8); KRU.userData.anim(T, 0);
  onFace(emil, 11, .2, .2, 40, L.k, 5.5); sh(V(0, 0, 10), 16); }, [[0, 'rain', .6], [.4, 'heartbeat', .7], [1.4, 'heartbeat', .7]]);
// ---------- 92 · «weil keiner schlechter malt als ich.» : media sonrisa; destello ----------
shot(173.05, 'F', null, L => { const T = L.T; storm_(L, 1, V(0, 0, 10), .7);
  put(emil, 0, 0, 10, .2); actuar(emil, L.lt, [[0, { aRx: 1.0, aRz: -.2, aRe: 1.0, headZ: .15 }]], { T }); chalkIn(emil); cara(emil, T, { expr: 'smug', mouth: 'smile' });
  orb(L.k, V(0, 3, 10), null, [11, .5, .1, 44], [10, .3, .1, 44]); sh(V(0, 0, 10), 16); }, [[0, 'sparkle', .6], [.6, 'chalk', .5]]);
// ---------- 93 · «Ich schrie: „Regenschirme!“» : Emil sube al borde de la fuente y grita ----------
shot(174.90, 'C', 'punch', L => { const T = L.T; storm_(L, 1, V(-18, 0, -24), .9);
  put(emil, -18, 2.2, -16.5, .2); actuar(emil, L.lt, [[0, { aRx: 2.2, aRz: -.3, aRe: 1.6, aLx: 2.8, aLz: .5, aLe: .2, lean: -.15, headX: -.25 }]], { T }); cara(emil, T, { expr: 'shout', mouth: L.lt > .4 ? 'talk_wide' : 'flat' });
  if (L.lt > .45) bubble(emil, 'REGENSCHIRME!', (L.lt - .45) * 3, 2.6);
  bg(L, [[XT[0], -24, -8, .5, 'look'], [XT[2], -12, -8, -.4, 'look', .2]]);
  orb(L.k, V(-18, 5, -16.5), null, [17, .2, -.1, 46], [15, .1, -.12, 44]); sh(V(-18, 0, -18), 24); }, [[.45, 'shout_m', .9], [.6, 'impact', .4]]);
// ---------- 94 · «Dreihundert Leute rannten auf den Marktplatz» : la gente entra corriendo con paraguas ----------
shot(176.40, 'W', null, L => { const T = L.T; storm_(L, 1, V(0, 0, 10), 1);
  const U_ = umbRoof(1).map((u, i) => { const r = RNG(i * 3 + 1), k = clamp(L.lt / 1.6 + r() * .3); return [lerp(u[0] * 2.5, u[0], k), 0, lerp(u[2] + 40, u[2], k), 0, 0, 0, .9]; }); UMF.set(U_); crowdAt(T, U_.map(u => [u[0], u[2], PI]), 'cheer');
  badge('big', '300', W / 2, H * .17, (L.lt - .1) * 2.5, 1, 1.3);
  orb(L.k, V(0, 6, 4), null, [58, .02, .5, 50], [52, .1, .55, 50]); sh(V(0, 0, 10), 60); }, [[0, 'crowd_run', 1], [.5, 'umbrella', .7], [.9, 'umbrella', .6], [1.4, 'cheer', .5]]);
// ---------- 95 · «und hielten ihre Schirme zusammen wie ein Dach.» : vista aérea, los paraguas forman un techo ----------
shot(178.75, 'Z', null, L => { const T = L.T; storm_(L, 1, V(0, 8, 12), 1); const U_ = umbRoof(1, 0).map(u => [u[0], 0, u[2], u[3] * (1 - L.k), u[4] * (1 - L.k), 0, .95 + L.k * .12]); UMF.set(U_); crowdAt(T, roofPeople(U_), 'still');
  orbit(V(0, 6, 12), 70 - L.k * 10, .2 + L.k * .2, 1.2, 50); sh(V(0, 0, 12), 60); }, [[0, 'umbrella', .6], [.4, 'umbrella', .6], [.9, 'cloth', .6], [1.6, 'rain', .7]]);
// ---------- 96 · «Zum ersten Mal überhaupt gab es mitten im Unwetter» : debajo del techo: la lluvia rebota arriba ----------
shot(180.97, 'S', null, L => { const T = L.T; storm_(L, 1, V(0, 14, 12), .9); const U_ = umbRoof(1); UMF.set(U_.map(u => [...u.slice(0, 6), 1.07])); crowdAt(T, roofPeople(U_), 'sway');
  put(emil, 0, 0, 12, 0); actuar(emil, L.lt, [[0, { headX: -.5, aLx: .4, aRx: .4, aLz: .4, aRz: .4 }]], { T }); cara(emil, T, { eyes: 'wide', mouth: 'open_smile' }); show(KRU, 2.4, 0, 13, -.3, .8); KRU.userData.anim(T, 0);
  cam([3, 2.2, 22 - L.k * 2], [0, 5.5, 8], 56); sh(V(0, 0, 12), 30); }, [[0, 'rain', .8], [.6, 'water_bloop', .4]]);
// ---------- 97 · «einen trockenen Fleck.» : un círculo seco en el suelo; Emil se arrodilla ----------
shot(183.05, 'F', null, L => { const T = L.T; storm_(L, 1, V(0, 14, 12), .9); const U_ = umbRoof(1); UMF.set(U_.map(u => [...u.slice(0, 6), 1.07])); crowdAt(T, roofPeople(U_), 'sway');
  put(emil, 0, 0, 12, 0); actuar(emil, L.lt, [[0, 'idle'], [.6, KNEEL]], { T }); chalkIn(emil); cara(emil, T, { expr: 'determined', mouth: 'smile' });
  badge('gold', 'TROCKEN!', W / 2, H * .17, (L.lt - .2) * 2.5, 1, 1);
  orb(L.k, V(0, 2.4, 12), null, [16, .3, .45, 46], [14, .1, .4, 46]); sh(V(0, 0, 12), 20); }, [[0, 'sparkle', .6], [.6, 'cloth', .5]]);
// ---------- 98 · «Ich malte die schnellste Rutsche aller Zeiten:» : dibuja a toda velocidad, con estelas ----------
shot(185.29, 'C', 'punch', L => { const T = L.T; storm_(L, 1, V(0, 14, 12), .6); const U_ = umbRoof(1); UMF.set(U_.map(u => [...u.slice(0, 6), 1.07])); crowdAt(T, roofPeople(U_), 'cheer');
  put(emil, 0, 0, 12, PI); applyPose(emil, drawP(T, 30)); chalkIn(emil); cara(emil, T, { expr: 'determined', mouth: 'grimace' }); dec(DC.slide, 0, 6.6, 0, clamp(L.lt / 1.6));
  puff(V(0, .3, 8), L.t0, T, 8, .3, DUST, 2.2);
  orb(L.k, V(0, 1.8, 10), null, [10, PI + .4, .12, 46], [9, PI + .25, .14, 46]); sh(V(0, 0, 10), 20); }, [[0, 'chalk', 1], [.3, 'chalk', 1], [.6, 'chalk', 1], [1.0, 'chalk', 1], [1.4, 'chalk', .9]]);
// ---------- 99 · «zwei Striche, ein paar Stufen –» : cenital del dibujo: dos rayas y escalones ----------
shot(187.63, 'Z', null, L => { const T = L.T; storm_(L, 1, V(0, 14, 12), .3); put(emil, 0, 0, 12, PI); applyPose(emil, drawP(T, 26)); chalkIn(emil); cara(emil, T, { expr: 'determined', mouth: 'grimace' }); dec(DC.slide, 0, 6.6, 0, 1);
  badge('big', '2', W * .3, H * .3, (L.lt - .2) * 3, 1, 1.2); badge('blue', '+ STUFEN', W * .65, H * .32, (L.lt - .9) * 3, 1, .8);
  cam([0, 15, 7.5], [0, 0, 7.2], 50); camera.rotation.z = 0; sh(V(0, 0, 8), 20); }, [[.2, 'chalk', .9], [.9, 'chalk', .9]]);
// ---------- 100 · «zwei Sekunden.» : ¡pum! el tobogán sale disparado del suelo ----------
shot(189.41, 'C', 'punch', L => { const T = L.T; storm_(L, 1, V(0, 14, 12), .8); const U_ = umbRoof(1); UMF.set(U_.map(u => [...u.slice(0, 6), 1.07])); crowdAt(T, roofPeople(U_), 'cheer');
  show(SLD, 0, 0, 0); SLD.userData.set(easeOut(clamp(L.lt / .9)) * .35, 0); puff(V(0, 1, 6), L.t0, T, 14, .8, DUST, 1.0);
  put(emil, -4, 0, 12, .5); actuar(emil, L.lt, [[0, 'cheer']], { T }); grin(emil, T);
  badge('blue', '2 SEK', W / 2, H * .17, (L.lt - .05) * 3, 1, 1.1);
  cam([7 - L.k, 2.6, 19 - L.k * 2], [0, 6.5, 5], 56); sh(V(0, 0, 8), 30); }, [[0, 'magic_hit', 1], [.1, 'whoosh_up', .8], [.4, 'cheer', .5]]);
// ---------- 101 · «Sie schoss durch die Schirme nach oben, bis ganz hinauf zu Smaragd.» : contrapicado; el tobogán atraviesa el techo de paraguas (zoom lento) ----------
shot(190.31, 'R', 'slow', L => { const T = L.T; storm_(L, 1, V(0, 20, 6), 1); const U_ = umbRoof(1); UMF.set(U_.map(u => [...u.slice(0, 6), 1.07])); crowdAt(T, roofPeople(U_), 'cheer');
  show(SLD, 0, 0, 0); SLD.userData.set(.35 + easeOut(clamp(L.lt / 2.2)) * .65, 0); DRA.g.visible = true; DRA.update(T, DP, { melt: .25 }); riders(T, 1);
  orb(L.k, V(0, 14, 6), V(0, 26, 0), [52, .9, .15, 52], [48, .75, .05, 50], easeIn); sh(V(0, 0, 4), 50); }, [[0, 'whoosh_up', .7], [.6, 'creek', .4], [1.2, 'cheer', .6], [2.4, 'kids_laugh', .4]]);
// ---------- 102 · «Die Kinder rutschten eins nach dem anderen runter,» ----------
const slideRider = (c, s, T, i = 0) => { const P = SLD.userData.P(clamp(s)); const P2 = SLD.userData.P(clamp(s + .02)); put(c, P.x, P.y + 1.1, P.z, 0); c.root.rotation.x = Math.atan2(P.y - P2.y, P2.z - P.z) * .7; applyPose(c, { ...SIT, aLx: 2.6, aRx: 2.6, aLz: .4, aRz: .4, aLe: .2, aRe: .2, lLk: .1, lRk: .1 }); cara(c, T, { eyes: 'happy', mouth: i % 2 ? 'laugh' : 'open_smile' }); };
shot(193.60, 'W', null, L => { const T = L.T; storm_(L, 1, V(0, 15, 15), 1); const U_ = umbRoof(1); UMF.set(U_.map(u => [...u.slice(0, 6), 1.07])); crowdAt(T, roofPeople(U_), 'cheer');
  show(SLD, 0, 0, 0); DRA.g.visible = true; DRA.update(T, DP, { melt: .28 }); riders(T, 1, RIDERS().slice(4));
  [K[0], K[1], K[2], K[3]].forEach((c, i) => slideRider(c, L.lt * .55 - i * .22, T, i));
  orb(L.k, V(0, 14, 12), null, [44, 1.15, .12, 50], [41, 1.0, .1, 50]); sh(V(0, 0, 12), 50); }, [[0, 'whoosh_down', .7], [.4, 'kids_laugh', .7], [.9, 'whoosh_down', .6], [1.5, 'whoosh_down', .6]]);
// ---------- 103 · «und die Leute unten fingen jedes einzelne auf.» : al final del tobogán, los mayores atrapan a los niños ----------
shot(196.01, 'S', null, L => { const T = L.T; storm_(L, 1, V(0, 5, 34), .9); const U_ = umbRoof(1).filter(u => u[2] < 24); UMF.set(U_.map(u => [...u.slice(0, 6), 1.07])); crowdAt(T, roofPeople(U_).filter(p => p[1] < 28), 'cheer'); show(SLD, 0, 0, 0);
  slideRider(K[4], .82 + L.lt * .12, T, 1); const k = clamp((L.lt - 1.2) / .5);
  put(XT[6], -1.6, 0, 37, PI - .2); actuar(XT[6], L.lt, [[0, { aLx: 1.5, aRx: 1.5, aLe: .5, aRe: .5, lean: .1 }]], { T }); grin(XT[6], T); put(XT[0], 2.4, 0, 36, PI + .3); actuar(XT[0], L.lt, [[0, 'cheer']], { T }); laughF(XT[0], T);
  put(K[1], -4, 0, 38, PI - .6); actuar(K[1], L.lt, [[0, 'cheer']], { T }); laughF(K[1], T);
  orb(L.k, V(0, 3.5, 35), null, [16, PI - .7, .14, 46], [15, PI - .55, .12, 46]); sh(V(0, 0, 34), 24); }, [[0, 'whoosh_down', .7], [.9, 'land', .7], [1.0, 'cheer', .7], [1.6, 'clap', .6]]);
// ---------- 104 · «Nur Lina nicht.» ----------
shot(198.54, 'C', 'punch', L => { const T = L.T; storm_(L, 1, V(0, 33, -3), 1); DRA.g.visible = true; DRA.update(T, DP, { melt: .3 }); const p = DRA.seat(11); put(lina, p.x, p.y - .2, p.z, PI / 2 + .4); applyPose(lina, { ...RIDE, lean: .5, aLx: 1.2, aRx: 1.2, aLz: -.4, aRz: -.4, aLe: 1.3, aRe: 1.3, headX: .2, ...shiver(T, 2) }); cara(lina, T, { expr: 'shock', mouth: 'grimace' });
  show(SLD, 0, 0, 0);
  orbit(p.clone().add(V(0, 1, 0)), 12 - L.k, 1.35, .25, 42); sh(V(0, 0, 0), 40); }, [[0, 'cry_girl', .7]]);
// ---------- 105 · «Sie ist fünf und hatte zu viel Angst loszulassen.» ----------
shot(199.56, 'F', null, L => { const T = L.T; storm_(L, 1, V(0, 33, -3), 1); DRA.g.visible = true; DRA.update(T, DP, { melt: .31 + L.k * .03 }); const p = DRA.seat(11); put(lina, p.x, p.y - .2, p.z, PI / 2 + .6); applyPose(lina, { ...RIDE, lean: .5, aLx: 1.2, aRx: 1.2, aLz: -.4, aRz: -.4, aLe: 1.3, aRe: 1.3, headX: .1, ...shiver(T, 2) }); cara(lina, T, { eyes: 'closed', mouth: 'grimace' }); SWEAT.forEach((s, i) => { s.visible = true; s.position.copy(hp(lina)).add(V(.4 - i * .4, .2 - ((T * 1.5 + i * .3) % 1) * 2, .5)); s.scale.setScalar(.6); });
  show(SLD, 0, 0, 0);
  badge3('big', '5', hp(lina).add(V(0, 2.4, 0)), (L.lt - .2) * 3, 1.1);
  orbit(p.clone().add(V(0, 1.2, 0)), 11 - L.k * 1.5, 1.55, .25, 40); sh(V(0, 0, 0), 40); }, [[0, 'sob', .7], [.3, 'ding_soft', .5], [1.4, 'cry_girl', .6]]);
// ===== Parte 3b: el rescate, Smaragd estalla, la noche de los monigotes, el jardín (202,2 – 255,6 s) =====
// ---------- 106 · «Der Regen fraß den Drachen vom Schwanz her auf –» : la cola se deshace a chorros ----------
shot(202.18, 'S', 'slow', L => { const T = L.T; storm_(L, 1, V(-10, 30, -3), 1); DRA.g.visible = true; DRA.update(T, DP, { melt: .35 + L.k * .3 }); const p = DRA.seat(11); put(lina, p.x, p.y - .2, p.z, PI / 2 + .4); applyPose(lina, { ...RIDE, lean: .5, aLx: 1.2, aRx: 1.2, aLz: -.4, aRz: -.4, aLe: 1.3, aRe: 1.3, ...shiver(T, 2) }); cara(lina, T, { expr: 'shock', mouth: 'grimace' }); show(SLD, 0, 0, 0);
  orb(L.k, V(-10, 30, -3), null, [50, -.25, .05, 48], [40, -.15, .05, 46], easeIn); sh(V(-10, 0, -3), 50); }, [[0, 'drip', .8], [.5, 'drip', .8], [1.0, 'water_bloop', .7], [1.6, 'drip', .7]]);
// ---------- 107 · «und meine Rutsche von oben.» : la cima del tobogán se derrite ----------
shot(204.80, 'C', null, L => { const T = L.T; storm_(L, 1, V(0, 25, 0), 1); show(SLD, 0, 0, 0); SLD.userData.set(1, .04 + L.k * .1); puff(V(0, 28 - L.k * 3, 0), L.t0, T, 10, .7, DUST, 1.4); DRA.g.visible = true; DRA.update(T, DP, { melt: .62 });
  orbit(V(0, 26, 0), 22, .8, -.05, 46); sh(V(0, 0, 0), 40); }, [[0, 'drip', .8], [.6, 'water_bloop', .6]]);
// ---------- 108 · «Also kletterte ich hoch.» : Emil sube por los escalones ----------
shot(206.23, 'W', null, L => { const T = L.T; storm_(L, 1, V(0, 15, 0), 1); show(SLD, 0, 0, 0); SLD.userData.set(1, .14);
  const y = 4 + L.lt * 9; put(emil, 0, y, -2.1, 0); applyPose(emil, { aLx: 2.6 + Math.sin(T * 10) * .4, aRx: 2.6 - Math.sin(T * 10) * .4, aLe: .4, aRe: .4, lLx: .8 + Math.sin(T * 10) * .6, lRx: .8 - Math.sin(T * 10) * .6, lLk: .8, lRk: .8, lean: .1, headX: -.4 }); cara(emil, T, { expr: 'determined', mouth: 'grimace' });
  orbit(V(0, y + 2, -1.6), 14, PI / 2 + .55, -.05, 46); sh(V(0, 0, 0), 30); }, [[0, 'steps', .8], [.3, 'steps', .7], [.6, 'steps', .7], [.9, 'strain', .5]]);
// ---------- 109 · «Ich packte Lina,» ----------
shot(207.51, 'C', 'punch', L => { const T = L.T; storm_(L, 1, V(0, 30, 0), 1); show(SLD, 0, 0, 0); SLD.userData.set(1, .14); DRA.g.visible = true; DRA.update(T, DP, { melt: .64 });
  const p = DRA.seat(11); put(lina, p.x, p.y - .2, p.z, PI / 2 + .4); applyPose(lina, { ...RIDE, aLx: 1.6, aRx: 1.6, aLz: .3, aRz: .3, aLe: .3, aRe: .3, lean: .2 }); cara(lina, T, { expr: 'shock', mouth: 'o' });
  put(emil, p.x + 1.6, p.y - 1.4, p.z + 2.2, -2.2); applyPose(emil, { aRx: 1.8, aRe: .3, aLx: 1.8, aLe: .3, lean: .3 }); cara(emil, T, { expr: 'determined', mouth: 'talk_wide' });
  orbit(p.clone().add(V(.8, .6, 1)), 16, 1.2, .6, 44); sh(V(0, 0, 0), 40); }, [[0, 'tug', .7], [.2, 'gasp', .5]]);
// ---------- 110 · «Lina packte Krümel,» ----------
shot(208.79, 'S', null, L => { const T = L.T; storm_(L, 1, V(0, 30, 0), 1); show(SLD, 0, 0, 0); SLD.userData.set(1, .15); const P = SLD.userData.P(0); const b = V(P.x, P.y + 1.1, P.z + .6);
  put(emil, b.x, b.y, b.z, 0); applyPose(emil, { ...SIT, aLx: 1.2, aRx: 1.2, aLz: -.4, aRz: -.4, aLe: 1.3, aRe: 1.3 }); cara(emil, T, { expr: 'determined', mouth: 'smile' });
  put(lina, b.x, b.y + .1, b.z + 1.6, 0); applyPose(lina, { ...SIT, aLx: 1.5, aRx: 1.5, aLz: -.3, aRz: -.3, aLe: .9, aRe: .9 }); cara(lina, T, { eyes: 'wide', mouth: 'o' }); show(KRU, b.x, b.y - .6, b.z + 3.1, 0, .6); KRU.userData.anim(T, 1);
  orbit(b.clone().add(V(0, 1.2, 1.5)), 10, .5, .2, 44); sh(V(0, 0, 0), 40); }, [[0, 'bark', .8], [.3, 'tug', .6]]);
// ---------- 111 · «und wir rutschten los.» : ¡wiii! bajan a toda velocidad ----------
shot(209.77, 'Z', null, L => { const T = L.T; storm_(L, 1, V(0, 18, 14), 1); show(SLD, 0, 0, 0); SLD.userData.set(1, .15 + L.k * .2); const s = easeIn(clamp(L.lt / 2.4)) * .45;
  const P = SLD.userData.P(s); const b = V(P.x, P.y + 1.1, P.z);
  put(emil, b.x, b.y, b.z, 0); applyPose(emil, { ...SIT, aLx: 1.2, aRx: 1.2, aLz: -.4, aRz: -.4, aLe: 1.3, aRe: 1.3 }); cara(emil, T, { eyes: 'wide', mouth: 'open_smile' });
  put(lina, b.x, b.y + .1, b.z + 1.4, 0); applyPose(lina, { ...SIT, aLx: 1.5, aRx: 1.5, aLe: .9, aRe: .9 }); cara(lina, T, { eyes: 'wide', mouth: 'open_smile' }); show(KRU, b.x, b.y - .6, b.z + 2.8, 0, .6); KRU.userData.anim(T, 1);
  cam([b.x + 5, b.y + 3, b.z + 12], [b.x, b.y + 1, b.z], 48); sh(V(0, 0, 10), 40); }, [[0, 'whoosh_down', 1], [.3, 'kids_laugh', .6], [.8, 'bark', .5]]);
// ---------- 112 · «Hinter uns schmolz die Rutsche weg, Stufe für Stufe.» : cámara detrás; el tobogán desaparece a su paso ----------
shot(211.21, 'S', null, L => { const T = L.T; storm_(L, 1, V(0, 12, 20), 1); show(SLD, 0, 0, 0); const s = .45 + L.k * .4; SLD.userData.set(1, Math.min(.95, 1 - (1 - s) * 1.25 + .1)); const P = SLD.userData.P(s); const b = V(P.x, P.y + 1.1, P.z);
  put(emil, b.x, b.y, b.z, 0); applyPose(emil, { ...SIT, aLx: 1.2, aRx: 1.2, aLz: -.4, aRz: -.4, aLe: 1.3, aRe: 1.3, headY: L.lt > 1.3 ? .9 : 0 }); cara(emil, T, { eyes: 'wide', mouth: 'o' });
  put(lina, b.x, b.y + .1, b.z + 1.4, 0); applyPose(lina, { ...SIT, aLx: 1.5, aRx: 1.5, aLe: .9, aRe: .9 }); cara(lina, T, { eyes: 'closed', mouth: 'grimace' }); show(KRU, b.x, b.y - .6, b.z + 2.8, 0, .6); KRU.userData.anim(T, 1);
  puff(V(0, P.y + 4, P.z - 5), L.t0, T, 10, .7, DUST, 3);
  cam([b.x - 12, b.y + 7, b.z - 7], [b.x, b.y + 1, b.z + 2], 50); sh(V(0, 0, 12), 40); }, [[0, 'drip', .8], [.5, 'water_bloop', .6], [1.0, 'drip', .7], [1.6, 'water_bloop', .6], [2.2, 'drip', .6]]);
// ---------- 113 · «Wir flogen unten raus –» : salen volando al final, a cámara lenta ----------
shot(214.27, 'Z', null, L => { const T = L.T; storm_(L, 1, V(0, 5, 36), .9); show(SLD, 0, 0, 0); SLD.userData.set(1, .8); const k = L.k, b = arc([0, 1.8, 34], [0, 2.4, 41], 3.5, k);
  put(emil, b.x, b.y, b.z, 0); emil.root.rotation.x = -.3; applyPose(emil, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5, lLx: .6, lRx: -.3, lLk: .5 }); cara(emil, T, { eyes: 'wide', mouth: 'open_smile' });
  put(lina, b.x - 1.4, b.y + .5, b.z + .8, .2); applyPose(lina, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5 }); cara(lina, T, { eyes: 'wide', mouth: 'o' }); show(KRU, b.x + 1.6, b.y + .6, b.z + 1, -.3, .6); KRU.userData.anim(T, 1);
  orb(k, V(0, 6, 38), null, [21, .5, .08, 46], [20, .3, .08, 46]); sh(V(0, 0, 36), 24); }, [[0, 'whoosh_up', .6], [.4, 'kids_laugh', .5]]);
// ---------- 114 · «direkt in die Arme des alten Mannes.» : el anciano los atrapa; tintinean las llaves ----------
shot(215.67, 'C', null, L => { const T = L.T; storm_(L, 1, V(0, 5, 42), .9); const k = clamp(L.lt / .35), b = arc([0, 2.4, 40], [0, 2.2, 42.2], 1, k);
  put(opa, 0, 0, 43.6, PI); keysOn(); actuar(opa, L.lt, [[0, { aLx: 1.5, aRx: 1.5, aLe: .5, aRe: .5 }], [.35, { aLx: 1.2, aRx: 1.2, aLz: -.5, aRz: -.5, aLe: 1.4, aRe: 1.4, crouch: .2, lean: .1 }]], { T }); cara(opa, T, L.lt > .35 ? { eyes: 'happy', mouth: 'open_smile' } : { expr: 'shock', mouth: 'o' });
  put(emil, b.x - 2.3, b.y - .4, b.z - .4, PI * (k > .9)); applyPose(emil, { aLx: 1.4, aRx: 1.4, aLz: -.4, aRz: -.4, aLe: 1.2, aRe: 1.2 }); cara(emil, T, { eyes: 'happy', mouth: 'open_smile' });
  put(lina, b.x + 2.2, b.y - .2, b.z - .2, PI * (k > .9)); applyPose(lina, { aLx: 1.4, aRx: 1.4, aLe: 1.2, aRe: 1.2 }); laughF(lina, T); show(KRU, b.x + 3.6, 0, b.z - 1, PI, .6); KRU.userData.anim(T, 1);
  orb(L.k, V(0, 4.4, 42.5), null, [15, PI + .2, .35, 44], [13, PI + .1, .32, 44]); sh(V(0, 0, 42), 20); }, [[.3, 'land', .8], [.35, 'keys', .9], [.6, 'hug', .7], [1.2, 'laugh_old', .6]]);
// ---------- 115 · «Dann zerplatzte Smaragd zu einer riesigen Wolke aus grünem Kreidestaub.» : explosión verde (zoom lento + golpe) ----------
shot(217.74, 'F', 'slow', L => { const T = L.T; storm_(L, 1 - L.k * .3, V(0, 30, -3), .8); const pop = L.lt > .25; DRA.g.visible = !pop; if (!pop) DRA.update(T, DP, { melt: .8 });
  puff(V(0, 33, -3), L.t0 + .25, T, 40, 4.5, GDUST, 2.6); crowdAt(T, grid(-30, -20, 30, 30, 90, 16, 0), 'still', true);
  orb(L.k, V(0, 26, -3), null, [70, .15, -.1, 50], [56, .1, -.12, 46], easeIn); sh(V(0, 0, -3), 60); }, [[.25, 'explosion', .9], [.3, 'magic_hit', .7], [.6, 'wind', .6], [1.2, 'sparkle', .5]]);
// ---------- 116 · «… aus grünem Kreidestaub.» : el polvo verde cae sobre la gente como nieve ----------
shot(219.86, 'W', null, L => { const T = L.T; town('storm'); storm(.6); RAIN.update(T, V(0, 0, 10), .3);
  GDUST.forEach((d, i) => { const r = RNG(i * 3 + 1); d.visible = true; d.position.set((r() - .5) * 30, 14 - ((T * 1.5 + r() * 14) % 14), (r() - .5) * 20); d.scale.setScalar(1 + r() * .8); d.material.opacity = .6; });
  bg(L, [[XT[0], -4, 0, .3, 'look'], [XT[2], 4, -2, -.3, 'look', .3], [K[1], 0, -4, 0, 'look', .6], [lea, -7.5, -3, .5, 'scared']]); crowdAt(T, grid(-30, -30, 30, -10, 70, 17, 0), 'still');
  orb(L.k, V(0, 4, -1), null, [20, .1, .1, 46], [18, -.05, .1, 46]); sh(V(0, 0, 0), 24); }, [[0, 'sprinkle', .7], [.8, 'wind', .5]]);
// ---------- 117 · «Und einfach so hörte der Regen auf.» : sale el sol, un rayo de luz ----------
shot(221.71, 'F', null, L => { const T = L.T; town(); storm(1 - L.k); RAIN.update(T, V(0, 0, 0), clamp(1 - L.lt / .8)); CLO.set(V(0, 0, -10), T, 1 - L.k, 160, 70); bloom.strength = .2 + L.k * .2;
  put(emil, 0, 0, 0, 0); actuar(emil, L.lt, [[0, { headX: -.5 }], [.8, { headX: -.3, aLx: .5, aRx: .5, aLz: .6, aRz: .6 }]], { T }); cara(emil, T, { eyes: L.lt > .8 ? 'happy' : 'wide', mouth: 'open_smile' }); show(KRU, 2.6, 0, .8, -.4, .8); KRU.userData.anim(T, 0);
  orb(L.k, V(.6, 3, 0), null, [14, .2, -.15, 46], [12, .1, -.2, 46]); sh(V(0, 0, 0), 16); }, [[0, 'sunrise_shine', .7], [.5, 'birds', .6]]);
// ---------- 118 · «Alle senkten ihre Schirme.» ----------
shot(223.85, 'S', null, L => { const T = L.T; town(); const U_ = umbRoof(1).map(u => [u[0], -L.k * 5, u[2], .6 * L.k, 0, 0, 1 - L.k * .3]); UMF.set(U_); crowdAt(T, roofPeople(U_), 'cheer');
  orbit(V(0, 4, 10), 50 - L.k * 6, .05, .45, 50); sh(V(0, 0, 10), 60); }, [[0, 'umbrella', .6], [.4, 'umbrella', .5], [.8, 'cheer', .6]]);
// ---------- 119 · «Smaragd war weg.» : Lea mira el cielo vacío ----------
shot(225.09, 'Z', null, L => { const T = L.T; town(); put(lea, 0, 0, 0, .2); actuar(lea, L.lt, [[0, { headX: -.45, aLx: .2, aRx: .2 }]], { T }); cara(lea, T, { expr: 'sad', mouth: 'frown' }); GDUST.forEach((d, i) => { if (i > 10) return; const r = RNG(i); d.visible = true; d.position.set((r() - .5) * 10, 8 + r() * 6 - L.lt, -6 + (r() - .5) * 4); d.scale.setScalar(.3); d.material.opacity = .4; });
  orb(L.k, V(0, 4, -1), null, [13, -.3, -.2, 46], [12, -.4, -.25, 46]); sh(V(0, 0, 0), 16); }, [[0, 'sad_tone', .5]]);
// ---------- 120 · «Meine Rutsche war weg.» : un charco donde estaba el tobogán ----------
shot(226.35, 'C', null, L => { const T = L.T; town(); dec(DC.slide, 0, 8, 0, .3); put(emil, 1.4, 0, 2, -.3); actuar(emil, L.lt, [[0, 'shrug']], { T }); cara(emil, T, { expr: 'sad', mouth: 'smile' });
  orb(L.k, V(.6, 2.4, 3), null, [14, .3, .35, 46], [13, .15, .35, 46]); sh(V(0, 0, 2), 16); }, [[0, 'water_bloop', .5]]);
// ---------- 121 · «Aber jedes einzelne Kind war in Sicherheit.» : abrazos y vítores ----------
shot(227.43, 'W', null, L => { const T = L.T; town(); bloom.strength = .3;
  bg(L, [[K[0], -4, 0, .3, 'cheer'], [K[1], 0, -1, 0, 'cheer', .3], [K[2], 4, 0, -.3, 'cheer', .6], [K[3], -2, -4, .2, 'clap'], [K[4], 2.4, -4, -.2, 'cheer', .2], [XT[0], -7, -3, .5, 'clap'], [XT[6], 7, -3, -.5, 'clap', .4]]);
  confetti(V(0, 4, -2), L.t0 + .2, T, 40); crowdAt(T, grid(-30, -30, 30, -10, 70, 18, 0), 'cheer');
  orb(L.k, V(0, 3, -1.5), null, [19, .15, .12, 46], [17, -.1, .12, 46]); sh(V(0, 0, 0), 24); }, [[0, 'cheer', .9], [.2, 'confetti', .6], [.8, 'kids_laugh', .7], [1.6, 'clap', .6]]);
// ---------- 122 · «Und der alte Mann war immer noch da.» : el anciano al sol (zoom lento) ----------
shot(229.88, 'F', 'slow', L => { const T = L.T; town('morning'); put(opa, 0, 0, 0, 0); keysOn(); actuar(opa, L.lt, [[0, 'idle']], { T }); cara(opa, T, { expr: 'happy', mouth: 'smile' }); bloom.strength = .32;
  crowdAt(T, grid(-30, -36, 30, -14, 50, 19, 0), 'sway');
  orb(L.k, V(0, 3.6, 0), null, [22, .1, .1, 46], [13, 0, .08, 42], easeIn); sh(V(0, 0, 0), 16); }, [[0, 'strings', .5], [.8, 'keys', .4]]);
// ---------- 123 · «Kein einziger Fleck – und immer noch voller Schlüssel.» : guiña el ojo, sacude las llaves ----------
shot(231.59, 'C', null, L => { const T = L.T; town('morning'); put(opa, 0, 0, 0, -.2); keysOn(); actuar(opa, L.lt, [[0, { aRx: 1.0, aRz: -.4, aRe: 1.2 }], [1.4, { aRx: 2.6, aRz: .3, aRe: .2, aLx: .3 }]], { T, extra: { sx: Math.sin(T * 14) * .05 } }); cara(opa, T, L.lt > 1.4 ? { eyes: 'squint', mouth: 'grin' } : { expr: 'happy', mouth: 'smile' });
  badge3('gold', '🔑', hp(opa).add(V(1.8, 1.8, 0)), (L.lt - 1.4) * 2.5, 1);
  onFace(opa, 9, .3, .8, 40, L.k, 7.5); sh(V(0, 0, 0), 16); }, [[0, 'keys', .8], [1.4, 'keys', .9], [1.5, 'sparkle', .5]]);
// ---------- 124 · «Lea fragte mich, ob ich ihr beibringe, Strichmännchen zu malen.» ----------
shot(234.37, 'S', null, L => { const T = L.T; town('morning');
  put(lea, -1.6, 0, 0, .5); actuar(lea, L.lt, [[0, { aLx: .7, aLe: 1.2, aRx: .7, aRe: 1.2, headZ: .15 }], [1.4, drawP(T, 9)]], { T }); chalkIn(lea, CHALK2); talk(lea, T, L.t0, L.t1, 'happy');
  put(emil, 1.8, 0, .2, -.5); actuar(emil, L.lt, [[0, 'idle'], [.9, drawP(T, 9)]], { T }); chalkIn(emil); cara(emil, T, { eyes: 'happy', mouth: 'open_smile' });
  DC.sticks.forEach((d, i) => { if (i < 2) dec(d, -1.2 + i * 2.6, 3.2, 0, clamp(L.lt - 1.6 - i * .4)); }); if (L.lt > 2.2) STK.update(T, [[.2, 0, 3.6, 0, .5]], 'dance');
  orb(L.k, V(.2, 2.5, 1), null, [16, -.15, .25, 46], [14, .1, .28, 46]); sh(V(0, 0, 0), 16); }, [[0, 'kids_laugh', .4], [1.4, 'chalk', .8], [2.2, 'pop', .6]]);
const nightDark = () => { hemi.intensity = .5; sun.intensity = .45; renderer.toneMappingExposure = .92; FILL.intensity = 45; FILL.color.setRGB(1, .85, .6); bloom.strength = .5; bloom.threshold = .7; };
// ---------- 125 · «Und noch in derselben Nacht hat die ganze Stadt» : de noche, todos con tizas y linternas ----------
const NIGHT_STK = (n, T, mode = 'dance', y0 = 0) => { const L_ = []; for (let i = 0; i < n; i++) { const r = RNG(i * 7 + 3); L_.push([-40 + r() * 80, y0, -50 + r() * 90, (r() - .5) * 1.4, .8 + r() * .5]); } STK.update(T, L_, mode); };
shot(237.42, 'F', null, L => { const T = L.T; town('night'); nightDark();
  bg(L, [[XT[0], -6, 2, .3, 'draw', .1], [XT[1], 5, 0, -.2, 'draw', .4], [K[0], -1, 5, 0, 'draw', .2], [K[4], 9, 6, -.4, 'draw', .5], [XT[6], -10, -4, .5, 'draw', .3], [lea, 2, -5, .1, 'draw', .6], [emil, -3, -9, .2, 'draw', .8]]);
  DC.sticks.forEach((d, i) => dec(d, -12 + i * 3.4, -2 + (i % 3) * 4, (i - 4) * .2)); crowdAt(T, grid(-40, -50, 40, -20, 60, 20, 0), 'sway');
  orb(L.k, V(0, 3, 0), null, [26, -.2, .3, 48], [23, .15, .28, 48]); sh(V(0, 0, 0), 30); }, [[0, 'crickets', .6], [.2, 'chalk', .7], [.9, 'chalk', .6], [1.6, 'chalk', .5]]);
// ---------- 126 · «den Marktplatz mit Strichmännchen vollgemalt.» : vista aérea: la plaza llena de monigotes que se levantan ----------
shot(239.74, 'Z', null, L => { const T = L.T; town('night'); nightDark(); NIGHT_STK(Math.floor(15 + L.k * 45), T, 'wave'); DC.sticks.forEach((d, i) => dec(d, -20 + i * 6, 10 - (i % 3) * 12, i * .4));
  crowdAt(T, grid(-50, -60, 40, -30, 70, 21, 0), 'cheer');
  orbit(V(0, 0, -6), 80 - L.k * 12, .1 + L.k * .2, .75, 50); sh(V(0, 0, -6), 60); }, [[0, 'pop', .5], [.4, 'pop', .4], [.8, 'pop', .5], [1.2, 'sparkle', .5], [1.8, 'cheer', .5]]);
// ---------- 127 · «Hunderte – und alle haben getanzt.» : fiesta nocturna de monigotes bailando ----------
shot(242.18, 'W', null, L => { const T = L.T; town('night'); nightDark(); bloom.strength = .45; NIGHT_STK(60, T, 'dance'); confetti(V(0, 6, -10), L.t0, T, 40, 1.4);
  bg(L, [[emil, -2, 8, .1, 'cheer'], [lea, 2, 7.5, -.1, 'cheer', .3]]); show(KRU, 0, 0, 10, 0, .8); KRU.userData.anim(T, 1); KRU.position.y = Math.abs(Math.sin(T * 7)) * .8;
  badge('big', 'HUNDERTE!', W / 2, H * .17, (L.lt - .05) * 2.5, 1, 1);
  orb(L.k, V(0, 4, 4), null, [26, -.15, .15, 48], [23, .15, .15, 48]); sh(V(0, 0, 0), 40); }, [[0, 'party_horn', .6], [.3, 'cheer', .8], [.8, 'kids_laugh', .6], [1.4, 'clap', .6]]);
// ---------- 128 · «Manchmal schaut mich der alte Mann an,» : en el jardín, el anciano mira a Emil pensativo (zoom lento) ----------
shot(244.42, 'F', 'slow', L => { use('GT'); sunset(); const T = L.T; put(opa, GTX - 2.4, 0, 2, .7); keysOn(); actuar(opa, L.lt, [[0, { aLx: .3, aRx: .3, headZ: .15, headX: .1 }]], { T }); cara(opa, T, { expr: 'neutral', mouth: 'smile' });
  put(emil, GTX + 2.6, 0, 3.4, -1.0); applyPose(emil, KNEEL); chalkIn(emil); cara(emil, T, { expr: 'happy', mouth: 'smile' }); show(KRU, GTX + 5.5, 0, 4.6, -.6, .8); KRU.userData.anim(T, 0);
  orb(L.k, V(GTX - .4, 3.6, 2.4), null, [18, .45, .1, 44], [12, .35, .08, 40], easeIn); sh(V(GTX, 0, 2), 20); }, [[0, 'birds', .5], [.6, 'tension_str', .4], [1.2, 'wind', .3]]);
// ---------- 129 · «als würde er warten, dass ich mich an etwas erinnere.» : Emil le devuelve la mirada; parpadeo de glitch ----------
shot(246.16, 'C', null, L => { use('GT'); sunset(); const T = L.T; put(emil, GTX + 3, 0, 3.6, -1.0); actuar(emil, L.lt, [[0, { headY: -.2 }]], { T }); cara(emil, T, { expr: 'confused', mouth: 'flat' }); put(opa, GTX - 2.4, 0, 2, .7); keysOn(); cara(opa, T, { expr: 'happy', mouth: 'smile' });
  if (L.lt > 1.6 && L.lt < 2.0) { GL = .5; grade.uniforms.sepia.value = .7; }
  onFace(emil, 9, .3, -.6, 40, L.k, 7); sh(V(GTX, 0, 3), 20); }, [[0, 'heartbeat', .5], [1.6, 'glitch', .6], [1.7, 'keys', .3]]);
// ---------- 130 · «Er wohnt jetzt in unserem Gartenhäuschen.» : el anciano saluda desde la puerta de la caseta ----------
shot(248.71, 'W', null, L => { use('GT'); day(); const T = L.T; GT.door.rotation.y = -1.2; put(opa, GTX + 0, 0, -3.6, .1); keysOn(); actuar(opa, L.lt, [[0, 'wave']], { T }); grin(opa, T);
  put(emil, GTX + 6, 0, 4, -.4); actuar(emil, L.lt, [[0, 'wave']], { T }); grin(emil, T); show(KRU, GTX + 3, 0, 5, -.2, .8); KRU.userData.anim(T, 1);
  orb(L.k, V(GTX + 2, 5, -2), null, [32, .25, .1, 46], [28, .15, .1, 46]); sh(V(GTX, 0, -4), 30); }, [[0, 'door_creak', .6], [.4, 'birds', .5], [1.0, 'laugh_old', .5]]);
// ---------- 131 · «Und seitdem findet bei uns keiner mehr seinen Schlüssel.» : las llaves de Papá salen volando hacia la caseta ----------
shot(250.52, 'S', null, L => { use('GT'); day(); const T = L.T; GT.door.rotation.y = -1.2;
  put(XT[6], GTX + 9, 0, 7, -1.0); actuar(XT[6], L.lt, [[0, { aLx: .4, aRx: .4, aLz: .3, aRz: .3, headX: .4 }], [.9, 'shock']], { T }); cara(XT[6], T, L.lt > .9 ? { expr: 'shock', mouth: 'o' } : { expr: 'confused', mouth: 'flat' });
  put(XT[5], GTX + 12.5, 0, 5, -1.3); actuar(XT[5], L.lt, [[0, 'shrug']], { T }); cara(XT[5], T, { expr: 'confused', mouth: 'frown' });
  keysFly(V(GTX, 4, -4), L.t0 + .9, T, 6, [loc(XT[6], .6, 2.5, .8), loc(XT[5], .6, 2.5, .8)]);
  put(opa, GTX + 0, 0, -3.6, .6); keysOn(); laughF(opa, T);
  orb(L.k, V(GTX + 5.5, 4, 2), null, [28, .3, .1, 48], [25, .2, .1, 48]); sh(V(GTX + 6, 0, 0), 30); }, [[0, 'rummage', .7], [.9, 'keys', .9], [1.0, 'whoosh_up', .5], [1.6, 'laugh_old', .6], [2.2, 'keys', .5]]);
// ---------- 132 · «Wenn dir das gefallen hat, folg mir für mehr.» : los tres saludan; al final, un fallo de imagen fugaz ----------
shot(253.22, 'F', null, L => { use('GT'); day(); const T = L.T;
  put(emil, GTX, 0, 4, 0); actuar(emil, L.lt, [[0, 'wave']], { T }); talk(emil, T, L.t0, L.t1, 'happy', { eyes: 'happy' }); put(opa, GTX - 3.6, 0, 2.6, .3); keysOn(); actuar(opa, L.lt, [[0, 'wave']], { T }); grin(opa, T);
  show(KRU, GTX + 3, 0, 5, -.3, .8); KRU.userData.anim(T, 1); KRU.position.y = Math.abs(Math.sin(T * 6)) * .6;
  badge('tag', 'FOLGEN ✚', W / 2, H * .17, (L.lt - .6) * 2.5, 1, 1.2);
  if (L.lt > L.d - .3) GL = (L.lt - (L.d - .3)) / .3;
  orb(L.k, V(GTX - .6, 3.2, 3.4), null, [16, 0, .1, 44], [14, .05, .1, 44]); sh(V(GTX, 0, 3), 20); }, [[0, 'pop', .6], [.6, 'notif', .7], [1.0, 'bark', .5], [2.1, 'glitch', .6]]);
// ---------- portadas (fuera del vídeo): Emil dibuja y todo cobra vida; el dragón con los niños arriba, Krümel saltando, el anciano con sus llaves, Lea; texto de tiza en el centro ----------
function coverTxt(l1, l2, y0 = .43) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz] of [[l1, H * y0, 118], [l2, H * (y0 + .072), 132]]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .86 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 22; c.shadowOffsetY = 8; c.lineWidth = sz * .24; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(t, 0, 0); c.restore(); }
  c.restore(); }
// ojo del Sistema en el cielo (referencia a la parte del Sistema): iris digital azul con anillos, mirando a la ciudad
function sysEye(x, y, r, red = 0) { const c = octx; c.save(); const col = red ? '255,60,80' : '90,220,255';
  const g = c.createRadialGradient(x, y, r * .2, x, y, r * 2.2); g.addColorStop(0, `rgba(${col},.55)`); g.addColorStop(1, `rgba(${col},0)`); c.fillStyle = g; c.fillRect(x - r * 2.4, y - r * 2.4, r * 4.8, r * 4.8);
  c.lineWidth = 6; c.strokeStyle = `rgba(${col},.9)`; for (let i = 0; i < 3; i++) { c.beginPath(); c.ellipse(x, y, r * (1.25 + i * .28), r * (.42 + i * .1), (i - 1) * .35, 0, 7); c.stroke(); }
  c.fillStyle = '#06101c'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); const ir = c.createRadialGradient(x, y, r * .1, x, y, r); ir.addColorStop(0, '#ffffff'); ir.addColorStop(.35, `rgb(${col})`); ir.addColorStop(1, '#0a2a4a'); c.fillStyle = ir; c.beginPath(); c.arc(x, y, r * .78, 0, 7); c.fill();
  c.fillStyle = '#02060c'; c.beginPath(); c.ellipse(x, y, r * .16, r * .42, 0, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x - r * .25, y - r * .3, r * .12, 0, 7); c.fill();
  c.font = `700 30px monospace`; c.textAlign = 'center'; c.fillStyle = `rgba(${col},.95)`; c.fillText('SYSTEM v4.2 · ZUSCHAUER ERKANNT', x, y + r * 1.75); c.restore(); }
window.renderCover = v => { const T = 2.4; hideAll(); BAD_.length = 0; town(v ? 'storm' : 'morning'); BIRDSON = 0; if (v) { storm(.55); CLO.set(V(0, 0, -40), T, .8, 160, 60); RAIN.update(T, V(0, 0, 0), .35, 60, 40, 40); }
  crowdAt(T, grid(-40, -60, 40, -20, 90, 31, 0), 'cheer');
  DRA.g.visible = true; BUCKETS.forEach(b => b.visible = false); DRA.update(T, dpath(5.5, 21, -18, 60, 1.2, -.45), { melt: v ? .1 : 0 }); riders(T, v ? 1 : 0, RIDERS().slice(0, 7));
  put(emil, -1.6, 0, 5, .2); applyPose(emil, { ...KNEEL, aRx: 2.5, aRz: .3, aRe: .3, aLx: .5, headX: -.15, lean: .05 }); chalkIn(emil); cara(emil, T, { eyes: 'wide', mouth: 'open_smile', noBlink: 1 });
  show(KRU, 1.9, 1.0, 6.4, -.3, .9); KRU.userData.anim(T, 1); KRU.rotation.z = .15;
  put(opa, 5.2, 0, -1.5, -.4); keysOn(); actuar(opa, 0, [[0, 'wave']], { T }); cara(opa, T, { eyes: 'happy', mouth: 'grin', noBlink: 1 });
  put(lea, -5.4, 0, -1, .4); actuar(lea, 0, [[0, 'cheer']], { T }); cara(lea, T, { eyes: 'happy', mouth: 'laugh', noBlink: 1 }); chalkIn(lea, CHALK2);
  STK.update(T, [[-4.5, 0, -6, .3, .9], [4, 0, -7, -.3, .9]], 'dance'); dec(DC.dog, -1.2, 8.4, 0, .9); dec(DC.mast1, -5.5, 6.5, .3); dec(DC.mast2, 6, 7, -.3);
  KEYS.forEach((k, i) => { if (i >= 10) return; const r = RNG(i * 5 + 2); show(k, 5.2 + (r() - .5) * 5, 2 + r() * 7, -1.5 + (r() - .5) * 3, r() * 6, .9); k.rotation.set(r() * 3, r() * 3, r() * 3); });
  cam([0, 3.6, 26], [0, 8.6, 0], 54); sh(V(0, 0, 0), 40);
  grade.uniforms.sharp.value = 1.6; grade.uniforms.vig.value = .55; grade.uniforms.sat.value = 1.6; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; bloom.strength = .3; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); composer.render(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H);
  sysEye(W * .3, H * .2, 70, v);
  if (v === 0) coverTxt('ALLES, WAS DU MALST,', 'WIRD LEBENDIG'); else coverTxt('ALLES WIRD LEBENDIG …', 'BIS ES REGNET'); };


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4, G: 6 };
const TRS = { W: 'whoosh', Z: 'swoosh_up', F: 'flash', S: 'swipe', R: 'whirl', I: 'iris_pop', C: 'thump', G: 'glitch' };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.tr && i + 1 < S.length && s.tr !== 'W' && s.tr !== 'Z') CUES.push({ t: +(s.t1 - .08).toFixed(3), s: TRS[s.tr], g: s.tr === 'G' ? 1 : .55 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  if (s.zoom === 'punch') CUES.push({ t: s.t0 + .01, s: 'impact', g: .6 }); });
CUES.push({ t: 0, s: 'zoom_fast', g: .9 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD_.length = 0; s.fn(L);
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud', 'thunder'].includes(c.s) && T - c.t < .16) sh_ = Math.max(sh_, 1 - (T - c.t) / .16); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.5; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, MODE === 'night' || MODE === 'sys' ? 'noche' : 'polvo', MODE === 'in' || MODE === 'sys' ? .3 : .4);
  if (BIRDS.update) BIRDS.update(T, camera.position.clone().addScaledVector(dir, 60).add(V(0, 25, 0)), (MODE === 'day' || MODE === 'sunset') && BIRDSON ? 1 : 0);
  sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position); composer.render();
}
// glitch digital: franjas desplazadas, separación RGB, bloques de ruido y líneas
function glitch(T, g) { if (g <= 0) return; const r = RNG(Math.floor(T * FPS) * 7 + 3); bctx.clearRect(0, 0, W, H); bctx.drawImage(out, 0, 0);
  const n = Math.floor(4 + g * 14); for (let i = 0; i < n; i++) { const y = r() * H, h = 8 + r() * 120 * g, dx = (r() - .5) * 260 * g; octx.drawImage(buf, 0, y, W, h, dx, y, W, h); }
  octx.save(); octx.globalCompositeOperation = 'screen'; octx.globalAlpha = .55 * g; const dx = 10 + 30 * g; octx.filter = 'sepia(1) saturate(9) hue-rotate(-50deg) brightness(.8)'; octx.drawImage(buf, dx, 0); octx.filter = 'sepia(1) saturate(9) hue-rotate(150deg) brightness(.8)'; octx.drawImage(buf, -dx, 0); octx.restore(); octx.filter = 'none';
  for (let i = 0; i < Math.floor(g * 10); i++) { octx.fillStyle = ['rgba(255,0,80,.55)', 'rgba(0,255,220,.5)', 'rgba(255,255,255,.6)', 'rgba(0,0,0,.8)'][i % 4]; octx.fillRect(r() * W, r() * H, 40 + r() * 300 * g, 6 + r() * 40); }
  octx.fillStyle = `rgba(0,0,0,${.18 * g})`; for (let y = 0; y < H; y += 6) octx.fillRect(0, y, W, 2); }
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
  if (VIDUI) drawVidUI(VIDUI);
  for (const b of BAD_) drawBadge(b);
  glitch(T, Math.max(GL, tr === 'G' ? a : 0));
  caption(T);
}
// ---------- capturas reales (fotogramas del propio vídeo) para las pantallas del Sistema ----------
const SNAP = {};
function grab(name, w = 360, h = 640) { camera.updateProjectionMatrix(); sky.sky.position.copy(camera.position); composer.render(); const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(renderer.domElement, 0, 0, w, h); SNAP[name] = c; }
const snapAt = (name, T) => { const i = shotAt(T); renderShot(i, T, null, 0); grab(name); };
const snapFn = (name, fn) => { hideAll(); BAD_.length = 0; fn({ lt: 1, k: .5, T: 10, d: 2, t0: 0, t1: 2 }); grab(name); };
[['emilHug', 87.6], ['opaKeys', 78.4], ['emilDraw', 28.6], ['dragon', 58.9], ['fair', 83.6], ['krumel', 34.6], ['opaLie', 66], ['emilWave', 26.3]].forEach(([n, t]) => snapAt(n, t));
if (typeof SNAPS !== 'undefined') SNAPS.forEach(([n, f]) => snapFn(n, f));
window.SNAP = SNAP;
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { renderer, composer, bloom, sun, grade, scene, camera, hp, emil, opa, lina, K };

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
//@@PLANOS@@

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

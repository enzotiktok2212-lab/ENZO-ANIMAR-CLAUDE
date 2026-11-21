// AURA — «In dieser Stadt ist Aura-Farmen verboten»: Glanzheim, el Aura-Meter del Rathaus, el Kommando Robbe y el abuelo en la aguja del Dom. 1080×1920, 30 fps.
// Réplica de la estructura del vídeo de referencia con otra ciudad (Glanzheim, pueblo de entramado con Dom gótico), otro reparto y otros datos.
// Planos en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt, tree, shades } from './props.js';
import { hufenbach, townhouse } from './gort.js';
import { kueche, omaStube } from './svsets.js';
import { rain } from './hals.js';
import { bolt } from './pech.js';
import { makeExtra } from './ecast.js';
import { auraMeter, dom, goldify, pedestal, heli, rocket, launcher, rifle, dot, bullet, explosion, laterne, muell, paperBall, stormRing, gpBackpack, guineaPig, rollingPin, soupBowl, scissors, glassDoor, balcony, plakat, glowM, uhr } from './aura.js';
import { makeIch, setHair, flap, makeGlanz, makeMama, makeOma, makePapa, makeOpa, coatWind, makeJunge, makeBaby, makeSoldat, SOLDFACE, makeRobbe } from './acast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 175.2, U = W / 720;
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
// Glanzheim (x = 0): plaza adoquinada x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (-6, -92) con el Aura-Meter arriba (-6, 54, -93);
// Dom al noreste (DOMX, 0, DOMZ) con la aguja (plataforma en DOM.top, y ≈ 132); estatua de Glanz en la plaza (STX, 0, STZ).
// Küche (KX = 900): cocina de la familia. Opas Stube (OX = 1300): salón de noche.
const KX = 900, OX = 1300, DOMX = 58, DOMZ = -215, STX = 14, STZ = -48;
const HB = hufenbach(scene), KU = kueche(scene, KX), OS = omaStube(scene, OX);
const SETS = { HB: HB.G, KU: KU.g, OS: OS.g };
for (const k in SETS) outline(SETS[k], 1.4);
[HB.RANK, HB.KINO, HB.BOX, HB.PRICE].forEach(o => o && (o.visible = false));
townhouse(HB.G, -64, -21, 13, 3, 11, Math.PI / 2, { shop: 'APOTHEKE', bg: '#1a7a4a', fg: '#ffffff' }); townhouse(HB.G, -64, -34.5, 13, 2, 12, Math.PI / 2);
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3), 20 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 30 + i, Math.PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 40 + i, -Math.PI / 2); }
for (let i = 0, x = -120; x <= 140; x += 19, i++) townhouse(HB.G, x, -160 - (i % 2) * 8, 18, 3 + (i % 3), 50 + i, 0);
const DOM = dom(HB.G, DOMX, DOMZ); DOM.userData.top.set(DOMX, DOM.userData.top.y, DOMZ - 10);
const RH = HB.RH || null;
// Aura-Meter sobre el Rathaus (mira a +z)
const METER = auraMeter(HB.G, 7.5); METER.position.set(-6, 54, -91); outline(METER, 1.2); cyl(.6, .8, 14, mat(0xe9c23a, { metalness: .8, roughness: .3 }), 10, HB.G, -6, 40, -93.5);
const MTOP = V(-6, 54, -91);
// estatua de Glanz sobre pedestal
const PED = pedestal(HB.G, STX, STZ, 10, 6); outline(PED, 1.2);
// carteles de la prohibición y banderines dorados
const PLK = []; for (const [x, z, ry] of [[-30, 22, Math.PI / 2], [18, -12, -Math.PI / 2], [-30, -32, Math.PI / 2], [30, 44, -Math.PI / 2]]) { const p = plakat(HB.G, 'AURA VERBOTEN', 'MAX. 3 SEKUNDEN COOL', 8, 4.6); p.position.set(x, 9, z); p.rotation.y = ry; PLK.push(p); cyl(.15, .15, 9, mat(0x3a3e48, { metalness: .6 }), 8, HB.G, x, 4.5, z); }
for (const [x, z] of [[-40, -70], [30, -70], [-50, 0], [40, -10]]) { const p = plakat(HB.G, 'GLANZ = 100', 'NIEMAND IST COOLER', 6, 4, '#7a2aa8'); p.position.set(x, 14, z); p.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2; }
// balcón con la mamá del bebé (fachada oeste, mira a +x)
const BALC = balcony(HB.G); BALC.position.set(-54, 17, 30); BALC.rotation.y = Math.PI / 2; outline(BALC, 1.2);
// carroza del desfile (Glanz encima, mira a +z)
const FLOAT = (() => { const g = new THREE.Group(); HB.G.add(g); const gm = mat(0xf2c23a, { metalness: .8, roughness: .25, emissive: 0x5a3c00, emissiveIntensity: .25 }); box(12, 2.6, 16, mat(0x7a2aa8, { roughness: .5 }), .3, g, 0, 2.4, 0); box(12.4, .5, 16.4, gm, .1, g, 0, 3.9, 0);
  for (const s of [-1, 1]) for (const z of [-5.5, 5.5]) { const w = cyl(1.4, 1.4, 1, mat(0x1a1a1a), 16, g, s * 6, 1.4, z); w.rotation.z = Math.PI / 2; } for (let k = 0; k < 14; k++) sphere(.5, mat([0xff4a8a, 0xffd23f, 0xffffff][k % 3]), g, -5.6 + (k % 7) * 1.85, 4.3, k < 7 ? 7.8 : -7.8, 8, 6);
  const s = plakat(g, 'GLANZ', 'AURA-PARADE', 10, 4.4, '#7a2aa8'); s.position.set(0, 2.4, 8.25); const st = cyl(2.2, 2.6, 1.4, gm, 20, g, 0, 4.6, -1); outline(g, 1.2); g.visible = false; return g; })();
// ---------- reparto ----------
const ich = makeIch(scene), glanz = makeGlanz(scene), mama = makeMama(scene), oma = makeOma(scene), papa = makePapa(scene), opa = makeOpa(scene), junge = makeJunge(scene), baby = makeBaby(scene);
const SOL = Array.from({ length: 6 }, (_, i) => makeSoldat(scene, i)); const ROB = makeRobbe(scene);
const STAT = goldify(makeGlanz(scene)); STAT.root.scale.setScalar(3.1);
kitFace(ich, 'hero'); kitFace(glanz, 'villain'); kitFace(mama, 'girl'); kitFace(oma, 'girl'); kitFace(papa, 'mustache'); kitFace(opa, 'plain'); kitFace(junge, 'kid'); kitFace(baby, 'kid'); kitFace(STAT, 'villain');
SOL.forEach((c, i) => kitFace(c, SOLDFACE(i)));
const EX = Array.from({ length: 30 }, (_, i) => makeExtra(scene, i)); EX.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'girl', 'mustache', 'girl'][i % 6]));
const POOL = [ich, glanz, mama, oma, papa, opa, junge, baby, ...SOL, STAT, ...EX];
POOL.forEach(c => outline(c.root, 2));
// sandalias con calcetines y riñonera (para la «aura negativa»)
const SOCKM = []; EX.slice(0, 3).forEach(c => { for (const l of [c.lL, c.lR]) { SOCKM.push(box(1.02, .55, 1.02, mat(0xffffff, { roughness: 1 }), .08, l.kn, 0, -.66, .02), box(1.08, .16, 1.4, mat(0x7a4a22), .03, l.kn, 0, -.95, .14)); } });
const FANNY = EX.slice(3, 6).map(c => { const f = box(1.6, .6, .5, mat(0x1aa0a0, { roughness: .5 }), .2, c.hips, 0, .1, .7); f.visible = false; return f; });
// ---------- atrezo ----------
const HELI = [heli(scene), heli(scene)]; HELI.forEach(h => outline(h, 1.2));
const ROCK = [rocket(scene), rocket(scene)]; ROCK.forEach(r => outline(r, 1));
const LAUNCH = launcher(scene); outline(LAUNCH, 1);
const RIF = Array.from({ length: 4 }, () => rifle(scene)); RIF.forEach(r => outline(r, 1));
const DOTS = Array.from({ length: 7 }, () => dot(scene));
const BUL = bullet(scene);
const EXP = [explosion(scene), explosion(scene)];
const LAT = laterne(scene); outline(LAT, 1.2); const MUE = muell(scene); outline(MUE, 1.2); const BALL = paperBall(scene);
const STORM = stormRing(scene); const RAIN = rain(scene, 700); const BOLT = bolt(scene);
const BACKP = gpBackpack(scene); outline(BACKP, 1.2); const GPIG = guineaPig(scene, .9); outline(GPIG, 1.2);
const PIN = rollingPin(scene); outline(PIN, 1); const BOWL = soupBowl(scene); outline(BOWL, 1); const SCI = scissors(scene);
const GDOOR = glassDoor(scene); outline(GDOOR, 1);
const SHADES = (() => { const g = new THREE.Group(); scene.add(g); const fr = mat(0x111111, { metalness: .6, roughness: .2 }); for (const s of [-1, 1]) box(.5, .3, .08, fr, .06, g, s * .3, 0, 0); box(1.3, .08, .08, fr, .02, g, 0, .12, 0); return g; })();
const SHOES = (() => { const g = new THREE.Group(); scene.add(g); for (const s of [-1, 1]) { box(1.0, .36, 1.3, mat(0xf6f6f2, { roughness: .5 }), .14, g, s * .55, .2, 0); box(1.02, .1, 1.33, mat(0x30303a), .04, g, s * .55, .05, 0); } outline(g, 1); return g; })();
const UHR = uhr(scene, 20, 1); outline(UHR, 1.2);
const STATHEAD = STAT.head; const GHEAD = STAT.head.clone(true); scene.add(GHEAD);
const STARS = Array.from({ length: 5 }, () => { const p = textPlane(1, 1, 64, 64, (c, w, h) => { c.fillStyle = '#ffd23f'; c.strokeStyle = '#3a2400'; c.lineWidth = 4; c.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 12 : 28, a = i / 10 * 6.283 - Math.PI / 2; c.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r); } c.closePath(); c.fill(); c.stroke(); }); p.material.depthWrite = false; scene.add(p); return p; });
const TRAIL = Array.from({ length: 22 }, () => sphere(1, mat(0xe8e8ec, { roughness: 1, transparent: true, depthWrite: false }), scene, 0, 0, 0, 8, 6));
const LEAF = Array.from({ length: 18 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.5, .32), new THREE.MeshStandardMaterial({ color: [0x5cc24a, 0xf2c23a, 0xe8803a][i % 3], side: THREE.DoubleSide })); scene.add(p); return p; });
const BLUEPRINT = null;
const FIRE = Array.from({ length: 8 }, (_, i) => { const m = new THREE.Mesh(new THREE.ConeGeometry(.35, 1.2, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, .7, .2), transparent: true, opacity: .85, toneMapped: false })); scene.add(m); return m; });
const STEAM = Array.from({ length: 8 }, () => sphere(.5, mat(0xffffff, { roughness: 1, transparent: true, opacity: .4, depthWrite: false }), scene, 0, 0, 0, 8, 6));
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const FW = Array.from({ length: 60 }, (_, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(.5, 6, 4), new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL((i % 6) / 6, 1, .6).multiplyScalar(2.5), toneMapped: false })); scene.add(s); return s; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 2 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const NOTES = Array.from({ length: 4 }, (_, i) => { const p = textPlane(1.4, 1.4, 64, 64, (c, w, h) => { c.font = `700 56px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 8; c.strokeStyle = '#1a1a2a'; c.strokeText(i % 2 ? '♪' : '♫', w / 2, h / 2); c.fillStyle = '#ffd23f'; c.fillText(i % 2 ? '♪' : '♫', w / 2, h / 2); }); p.material.depthWrite = false; scene.add(p); return p; });
const HEARTS = Array.from({ length: 5 }, () => { const p = textPlane(1.2, 1.2, 64, 64, (c, w, h) => { c.fillStyle = '#ff3a6a'; c.beginPath(); c.moveTo(32, 54); c.bezierCurveTo(0, 30, 8, 4, 32, 18); c.bezierCurveTo(56, 4, 64, 30, 32, 54); c.fill(); }); p.material.depthWrite = false; scene.add(p); return p; });
const GLOWH = Array.from({ length: 12 }, () => sphere(.75, glowM(0xff4a1a, 3.2), scene, 0, 0, 0, 10, 8));
// sudor, lágrimas, notas, corazones (los efectos genéricos de la plantilla)
const PROPS = [FLOAT, ...HELI, ...ROCK, LAUNCH, ...RIF, ...DOTS, BUL, ...EXP, LAT, MUE, BALL, STORM, BOLT, BACKP, GPIG, PIN, BOWL, SCI, GDOOR, SHADES, SHOES, ...FIRE, ...STEAM, ...CONF, ...FW, ...DUST, ...SWEAT, ...TEAR, ...NOTES, ...HEARTS, ...GLOWH, UHR, GHEAD, ...STARS, ...TRAIL, ...LEAF];
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.25; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.55, .62, .42); sun.intensity = 2.5; sun.color.setRGB(1, .95, .86); rim.intensity = 1.0;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.05; setSky([.04, .05, .2], [.12, .12, .38], [.32, .22, .5]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.15; hemi.color.setRGB(.7, .74, 1); hemi.groundColor.setRGB(.32, .28, .4); sun.intensity = 1.2; sun.color.setRGB(.78, .78, 1); rim.intensity = 1.8;
  scene.fog.color.setRGB(.12, .12, .3); scene.fog.density = .001; bloom.strength = .32; bloom.threshold = .82; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; bloom.threshold = .86; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function storm() { MODE = 'night'; renderer.toneMappingExposure = 1.0; setSky([.16, .17, .22], [.26, .28, .34], [.38, .4, .46]); sky.moon.visible = false; hemi.intensity = 1.2; hemi.color.setRGB(.72, .76, .9); hemi.groundColor.setRGB(.3, .3, .36); sun.intensity = 1.0; sun.color.setRGB(.8, .84, 1); rim.intensity = 1.6;
  scene.fog.color.setRGB(.3, .32, .4); scene.fog.density = .0016; bloom.strength = .3; bloom.threshold = .82; FILL.intensity = 30; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } }
  STAT.root.scale.setScalar(3.1); STATHEAD.visible = true; SOCKM.length;
  ROB.root.visible = false; ROB.root.scale.setScalar(1); ROB.root.rotation.set(0, 0, 0); if (ROB.root.parent !== scene) { ROB.root.parent.remove(ROB.root); scene.add(ROB.root); }
  setHair(ich, false); flap(ich, 0, 0); SOCKM.forEach(m => m.visible = false); coatWind(opa, 0, 0); FANNY.forEach(f => f.visible = false); RAIN.update(0, V(0, 0, 0), 1, 1, 1, false);
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  RIF.forEach(r => r.userData.laser.visible = false); HELI.forEach(h => h.userData.sp.intensity = 0); METER.userData.set(100, 'GLANZ');
  for (const k in SETS) SETS[k].visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = 1.15; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
const LOOK = new THREE.Vector3();
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); LOOK.set(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
// órbita: cámara a distancia d del centro c, ángulo yaw (0 = desde +z), pitch (arriba +); el centro queda al ~42 % de la altura
function orbit(c, d, yaw = 0, pitch = .15, fov = 44) { const t = Math.tan(fov * Math.PI / 360) * d * .16; cam([c.x + Math.sin(yaw) * Math.cos(pitch) * d, c.y + Math.sin(pitch) * d, c.z + Math.cos(yaw) * Math.cos(pitch) * d], [c.x, c.y - t, c.z], fov); }
const orb = (k, c0, c1, a, b, e = easeInOut) => { const q = e(clamp(k)); orbit(c0.clone().lerp(c1 ?? c0, q), lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q), lerp(a[3] ?? 44, b[3] ?? 44, q)); };
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { dist *= 1.45; if (dist2 != null) dist2 *= 1.45; const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .85, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .6 + dy, h.z + fz * d - fx * side], [h.x, h.y - .45, h.z], fov); }
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
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b && w[2] !== 'HUSS!');
const talk = (ch, T, a, b, expr = 'talk', extra = {}) => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat', ...extra });
const grin = (ch, T, ex = {}) => cara(ch, T, { expr: 'grin', eyes: 'happy', mouth: 'grin', ...ex });
const laughF = (ch, T) => cara(ch, T, { eyes: 'happy', mouth: Math.sin(T * 22) > 0 ? 'laugh' : 'open_smile' });
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
const tears = (ch, T) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < 2; i++) { const k = (T * 1.1 + i * .5) % 1; TEAR[i].visible = true; TEAR[i].position.copy(h).add(V((i ? -.3 : .3) * s, (.75 - k * 1.1) * s, .7 * s)); } };
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
function fireworks(c, T, n = 3, R = 14) { FW.forEach((s, i) => { const b = i % n, k = Math.floor(i / n), per = 1.6, t = ((T + b * .53) % per) / per, r0 = RNG(b * 17 + Math.floor((T + b * .53) / per) * 31); const cx = c.x + (r0() - .5) * 60, cy = c.y + 30 + r0() * 20, cz = c.z + (r0() - .5) * 20;
  const a = k / (FW.length / n) * 6.283, el = Math.sin(k * 2.3) * .8; s.visible = t > .25; const e = easeOut((t - .25) / .75) * R; s.position.set(cx + Math.cos(a) * Math.cos(el) * e, cy + Math.sin(el) * e - t * t * 4, cz + Math.sin(a) * Math.cos(el) * e); s.scale.setScalar(1 - t * .8); s.material.color.setHSL((b * .27 + .05) % 1, 1, .6).multiplyScalar(2.5); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.5 + t * 1.4) * s * (.8 + r() * .5)); d.material.opacity = .4 * (1 - t / 1.2); }); }
function notes(p, T) { NOTES.forEach((z, i) => { const k = (T * .7 + i / 4) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 2 + T) * 1.5, p.y + k * 4, p.z + .5); z.scale.setScalar(.6 + k * .6); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
function hearts(p, T) { HEARTS.forEach((z, i) => { const k = (T * .6 + i / 5) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 1.7 + T) * 1.4, p.y + k * 3.4, p.z + .4); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
function steam(p, T, n = 6) { STEAM.forEach((s, i) => { if (i >= n) return; const k = (T * .8 + i / n) % 1; s.visible = true; s.position.set(p.x + Math.sin(i * 2.1 + T) * 1.2, p.y + k * 4, p.z + Math.cos(i * 1.7) * .8); s.scale.setScalar(.25 + k * .6); s.material.opacity = .22 * (1 - k); }); }
function flames(p, T, w = 5) { FIRE.forEach((f, i) => { f.visible = true; const r = RNG(i * 7 + 1); f.position.set(p.x + (i / 7 - .5) * w, p.y + .4 + Math.abs(Math.sin(T * 12 + i)) * .3, p.z + (r() - .5) * 1.2); f.scale.set(.35, (.7 + Math.abs(Math.sin(T * 15 + i * 2)) * .9) * .35, .35); f.position.y = p.y + .1; }); }
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));

// ---------- ayudas de la historia ----------
const PI = Math.PI;
const walkP = (T, i, sp = 9) => { const p = Math.sin(T * sp + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
const runP = (T, i = 0) => { const p = Math.sin(T * 14 + i); return { aLx: p * 1.1, aRx: -p * 1.1, aLe: 1.2, aRe: 1.2, lLx: -p * .9, lRx: p * .9, lLk: Math.max(0, p) * 1.1, lRk: Math.max(0, -p) * 1.1, lean: .3 }; };
const clapP = (T, i = 0) => { const c = Math.abs(Math.sin(T * 9 + i)); return { aLx: 1.35, aRx: 1.35, aLz: -.15 - c * .45, aRz: -.15 - c * .45, aLe: .9, aRe: .9, headX: -.1 }; };
const COOL = { aLx: .15, aLz: -.85, aRx: .2, aRz: -.85, aLe: 1.45, aRe: 1.45, headX: -.12, lean: -.06 };   // brazos cruzados (a la altura del pecho, la cara libre)
Object.assign(GEST.cross, { aLx: .15, aLz: -.85, aRx: .2, aRz: -.85, aLe: 1.45, aRe: 1.45 });
const AIM = { aLx: 1.45, aLz: -.35, aLe: .5, aRx: 1.5, aRz: -.05, aRe: .35, headX: .1, lean: .05 };
// gente de Glanzheim alrededor de (cx, cz), siempre detrás del sujeto según la cámara
function crowdAt(L, cx, cz, n, r0, r1, seed = 1, o = {}) { const list0 = (o.list || EX).slice(o.from || 0, (o.from || 0) + n); POST.push(() => { const list = list0.filter(c => !c.root.visible); const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const a0 = ac + (o.gap ?? 1.9), a1 = ac + 6.283 - (o.gap ?? 1.9); const dc = Math.hypot(camera.position.x - cx, camera.position.z - cz);
  list.forEach((c, i) => { const a = a0 + (i + .2 + r() * .6) / list.length * (a1 - a0); const d = r0 + r() * (r1 - r0); const x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d; if (Math.hypot(camera.position.x - x, camera.position.z - z) < dc * .95) return; const face = o.face || camera.position; const ry = Math.atan2(face.x - x, face.z - z) + (r() - .5) * (o.face ? .3 : .9); put(c, x, 0, z, ry);
    const m = o.mode || 'idle', T = L.T + i * .7;
    if (m === 'walk') { c.root.rotation.y = ry + PI / 2 * (i % 2 ? 1 : -1); actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); cara(c, T, { expr: 'neutral' }); }
    else if (m === 'clap') { actuar(c, 0, [[0, clapP(L.T, i)]], { T: L.T }); cara(c, T, { expr: i % 3 ? 'worried' : 'happy', mouth: i % 3 ? 'grimace' : 'open_smile' }); if (o.glow && i < GLOWH.length / 2) { glowHands(c, i); } }
    else if (m === 'shock') { actuar(c, 0, [[0, i % 2 ? GEST.shock : GEST.hands_face]], { T: L.T }); cara(c, T, { expr: 'shock', mouth: i % 2 ? 'o' : 'ah' }); }
    else if (m === 'cheer') { put(c, x, Math.abs(Math.sin(L.T * 8 + i)) * .4, z, ry); actuar(c, 0, [[0, GEST.cheer]], { T: L.T }); cara(c, T, { expr: 'joy', mouth: 'open_smile' }); }
    else if (m === 'point') { actuar(c, 0, [[0, i % 2 ? GEST.point : GEST.shock]], { T: L.T }); cara(c, T, { expr: 'shock', mouth: 'o' }); }
    else if (m === 'cower') { actuar(c, 0, [[0, GEST.cower]], { T: L.T }); cara(c, T, { expr: 'worried', mouth: 'grimace' }); }
    else if (m === 'uncool') { actuar(c, 0, [[0, i % 2 ? GEST.shrug : { aLx: .3, aRx: .3, lean: .2, headX: .3, crouch: .1 }]], { T: L.T }); cara(c, T, { expr: 'confused', mouth: 'wavy' }); }
    else { actuar(c, 0, [[0, i % 3 === 0 ? GEST.listen : i % 3 === 1 ? { aLx: .2, aRx: .3, aLe: .4, headX: Math.sin(L.T + i) * .1 } : GEST.cross]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral' }); } }); }); }
const glowHands = (c, i) => { c.root.updateMatrixWorld(true); for (const [k, h] of [[0, c.aL.hand], [1, c.aR.hand]]) { const g = GLOWH[(i * 2 + k) % GLOWH.length]; g.visible = true; g.position.copy(h.getWorldPosition(V(0, 0, 0))); g.scale.setScalar(.8 + Math.sin(Date.now() * 0 + i) * .1); } };
// Glanzheim de día (o tormenta)
function town(L, mode = 'day') { use('HB'); if (mode === 'storm') storm(); else if (mode === 'night') night(40); else day(); METER.userData.set(100, 'GLANZ'); }
const meter = (v, name = 'GLANZ', m = 'num') => METER.userData.set(v, name, m);
// soldado con fusil apuntando (fusil en la mano derecha, láser opcional)
function soldat(i, x, y, z, ry, T, o = {}) { const c = put(SOL[i], x, y, z, ry); actuar(c, 0, [[0, o.pose || AIM]], { T }); cara(c, T + i, { expr: o.expr || 'determined', eyes: o.eyes || 'squint', mouth: o.mouth || 'flat' });
  if (o.rifle !== false) { const r = RIF[o.rifle ?? (i % RIF.length)]; attach(r, c.aR.hand, [0, -.45, .2], [PI / 2, 0, 0], .9); r.userData.laser.visible = !!o.laser; if (o.laser) r.userData.laser.scale.y = o.laser; } return c; }
function robbe(x, y, z, ry, T, o = {}) { ROB.root.visible = true; ROB.root.position.set(x, y, z); ROB.root.rotation.set(0, ry, 0); ROB.root.scale.setScalar(o.s || 1); ROB.setPose(T, o); return ROB; }
// puntos láser en la frente (n puntos)
function dots(ch, n, T, sp = .4) { const h = hp(ch), s = ch.spec.scale || 1; camera.updateMatrixWorld(); const d = camera.position.clone().sub(h).normalize(); for (let i = 0; i < n; i++) { const p = DOTS[i]; p.visible = true; const a = i / n * 6.283 + T * 1.3; p.position.copy(h).add(V(Math.cos(a) * sp * s * (n > 1 ? 1 : 0), (.85 + Math.sin(a) * sp * .6 * (n > 1 ? 1 : 0)) * s, .62 * s)).addScaledVector(d, .05); p.lookAt(camera.position); p.scale.setScalar(s * (1 + Math.sin(T * 20 + i) * .15)); } }
function boom(k, c, T0, T, s = 1) { EXP[k].userData.at(c, T - T0, s); }
// yo cool: brazos cruzados, capucha al viento
function ichCool(x, z, ry, T, o = {}) { const c = put(ich, x, 0, z, ry); actuar(c, 0, [[0, o.pose || COOL]], { T }); flap(c, T, o.wind ?? 1); cara(c, T, { expr: o.expr || 'smug', eyes: o.eyes || 'half', mouth: o.mouth || 'smirk' }); return c; }
// Opa en la aguja del Dom (o donde sea), brazos cruzados y abrigo al viento
function opaCool(x, y, z, ry, T, o = {}) { const c = put(opa, x, y, z, ry); actuar(c, 0, [[0, COOL]], { T }); coatWind(c, T, o.wind ?? 1.2); cara(c, T, { expr: 'smug', eyes: o.eyes || 'half', mouth: o.mouth || 'smirk' }); return c; }
const DTOP = () => DOM.userData.top.clone();
// cocina de la familia
function kitchen(L) { use('KU'); inside(1.0, 40); KU.T.visible = false; }
function stubeN(L) { use('OS'); inside(.7, 26); OS.L.intensity = 160; OS.TB.visible = false; }
// número sobre la cabeza (placa con nombre y valor, como el Aura-Meter)
// estrellitas de mareo sobre la cabeza
function dizzy(ch, T) { const h = hp(ch), s = ch.spec.scale || 1; STARS.forEach((p, i) => { const a = T * 5 + i / 5 * 6.283; p.visible = true; p.position.copy(h).add(V(Math.cos(a) * 1.1 * s, 1.9 * s, Math.sin(a) * 1.1 * s)); p.lookAt(camera.position); p.scale.setScalar(s); }); }
// cohete k a lo largo de una trayectoria f(u) (u en [0,1]); deja estela de humo
function rocketPath(k, f, u, n = 22) { const R = ROCK[k], p = f(clamp(u)), q = f(clamp(u + .01)); R.visible = true; R.position.copy(p); R.lookAt(q); R.userData.flame.scale.setScalar(.8 + Math.sin(u * 300) * .25);
  for (let i = 0; i < n; i++) { const t = TRAIL[i]; const uu = u - (i + 1) * .018; if (uu < 0) { t.visible = false; continue; } t.visible = true; t.position.copy(f(uu)); t.scale.setScalar(.5 + i * .09); t.material.opacity = .55 * (1 - i / n); } }
// brisa: hojas que giran alrededor del personaje
function breeze(ch, T, r = 3, n = 18) { const c = wpos(ch.root); LEAF.forEach((l, i) => { if (i >= n) return; const a = T * 2.4 + i / n * 6.283, y = (T * 1.2 + i * .37) % 6; l.visible = true; l.position.set(c.x + Math.cos(a) * (r + Math.sin(i) * .6), c.y + .5 + y, c.z + Math.sin(a) * (r + Math.cos(i) * .6)); l.rotation.set(T * 4 + i, T * 3 + i, 0); }); }
const mtag = (ch, name, v, k = 1, dy = 2.3) => BAD_.push({ kind: 'meter', text: name, val: v, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });

// ---------- capa 2D ----------
// ---------- capa 2D ----------
const BAD_ = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD_.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD_.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD_.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; if (x < -60 || x > W + 60) return; b.x = clamp(x, 200, W - 200); b.y = clamp(y, 150, H * .64); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num' || b.kind === 'green' || b.kind === 'gold') { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : b.kind === 'green' ? '#04300e' : b.kind === 'gold' ? '#3a2400' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#8aff9a'); g.addColorStop(1, '#1ab84a'); } else if (b.kind === 'gold') { g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a820'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'meter') { const red = b.val >= 100 || b.val === '∞'; c.font = `700 46px ${FONT}`; const t2 = String(b.val); const w = c.measureText(b.text).width + c.measureText(t2).width + 90; c.fillStyle = '#0a0c14'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 14); c.fill(); c.lineWidth = 6; c.strokeStyle = red ? '#ff3a3a' : '#2ad86a'; c.stroke();
    c.textAlign = 'left'; c.fillStyle = '#ffffff'; c.fillText(b.text, -w / 2 + 26, 3); c.textAlign = 'right'; c.fillStyle = red ? '#ff4a3a' : '#ffd23f'; c.fillText(t2, w / 2 - 26, 3); }
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  c.restore(); }
const KEY = /^(Stadt|Aura-Farmen|verboten|drei|Sekunden|cool|Scharfschütze|Kilometern|Konrad|Glanz|Rathaus|Aura-Meter|live|hundert|gelöscht|Kommando|Robbe|sechs|echte|Sonnenbrille|acht|Abgeschossen|Explosion|größere|Schuhe|Laterne|Straße|dich|Papierkugel|Mülleimer|perfekt|negative|Socken|Sandalen|Bauchtaschen|Glastüren|Problem|geboren|Brise|Hoodie|dramatisch|Schluckauf|sechsundneunzig|uncool|Suppenschüssel|Meerschweinchen-Rucksack|Meerschweinchen|neunundneunzig|Nudelholz|Opa|Geheimnis|Aura-Farmer|vierzig|Gewitter|Dom|Arme|Wolken|perfekten|Kreis|blinzelte|spurlos|Angst|Aura-Parade|glühen|Baby|Balkon|Hand|hundertachtzig|neunzig|Sirenen|Hubschrauber|sieben|Punkte|Stirn|Niemand|Feuer|Donner|Mantel|Kugel|Luft|Scharfschützen|Rakete|Kehrtwende|überlebte|klatschte|Raketenwerfer|Runde|Goldstatue|Kopf|Schnitzel|unendlich|Pflicht|Bürgermeisterin|Badelatschen|Suppenschüssel-Schnitt)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t), huss: false }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.huss ? 1.5 : cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); if (cur.huss) c.rotate(((Math.round(cur.t * 10) % 2) ? -1 : 1) * .06); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
// corte dentro de la misma acción: mismo plano con otra cámara (alt = [giro, factor de distancia, dy])
const cut = (t0, tr, alt, sfx = []) => S.push({ t0, tr, zoom: null, fn: null, sfx, alt, cut: true });
let DARK = 0, TINT = null, SHAKE = 0;
// ---------- a: gancho, Glanz y el Aura-Meter, el Kommando Robbe, los castigos, la aura negativa (0 – 54,30 s) ----------
const P0 = V(-6, 0, -22);   // centro de la plaza delante del Rathaus
const cool1 = EX[3], cool2 = EX[9], cool3 = EX[15];
// pose «aura farming»: un brazo en el pelo, el otro en el bolsillo, inclinado hacia atrás
const FARM = { aRx: 2.6, aRz: .2, aRe: 1.9, aLx: .25, aLz: -.25, aLe: .8, lean: -.12, headX: -.18, headZ: .1, lLx: .15, lRx: -.1 };
// caída cómica (zap): de pie → de espaldas en el suelo, con estrellitas
function zap(c, x, z, ry, L, tz, o = {}) { const q = clamp((L.T - tz) / .28), e = easeIn(q); put(c, x, e * .6, z, ry); c.root.rotation.x = -e * PI / 2; actuar(c, 0, [[0, q > 0 ? GEST.shock : (o.pose || FARM)]], { T: L.T }); cara(c, L.T, q > 0 ? { expr: 'shock', eyes: 'terror', mouth: 'scream' } : { expr: 'smug', mouth: 'smirk' }); if (q >= 1) dizzy(c, L.T); return q; }

// 1 «In dieser Stadt» (zoom lento): la plaza llena, el Aura-Meter arriba; un chico hace aura farming y ya tiene el punto láser en la frente
shot(0, 'Z', 'slow', L => { town(L); meter(lerp(92, 99, L.k), 'TIM'); const c = put(cool1, P0.x, 0, P0.z, 0); actuar(c, 0, [[0, FARM]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); crowdAt(L, P0.x, P0.z, 16, 7, 24, 3, { mode: 'point' });
  orb(L.k, V(P0.x, 12, P0.z), V(P0.x, 4.4, P0.z), [30, .02, .34, 50], [11, .0, .1, 44]); if (L.lt > .4) dots(c, 1, L.T); sh(V(P0.x, 0, P0.z), 40); }, [[0, 'whoosh_up', .6], [.1, 'city_amb', .4], [.5, 'blink', .4]]);
// 2 «ist Aura-Farmen verboten.»: cartel AURA VERBOTEN y una chica que posa delante (golpe de zoom)
shot(1.09, 'C', 'punch', L => { town(L); const c = put(cool2, -27, 0, 24, PI / 2 + .5); actuar(c, 0, [[0, { ...FARM, aRx: 2.7, aLx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); crowdAt(L, -27, 24, 6, 6, 14, 5, { from: 16, mode: 'walk' });
  badge('red', 'VERBOTEN!', W / 2, H * .17, (L.lt - .5) * 3); orbit(V(-27, 5, 24), lerp(15, 13, L.k), PI / 2 + .5, .1, 46); sh(V(-28, 0, 22), 20); }, [[0, 'impact', .7], [.5, 'stamp', .7]]);
cut(1.87, null, [0.5, 0.8, 0], [[0, 'whoosh_soft', .4]]);
// 3 «Sieh länger als»: primer plano de un chico con gafas de sol, sonrisa chula, viento
shot(2.43, 'W', null, L => { town(L); const c = put(cool3, 20, 0, -30, -.4); actuar(c, 0, [[0, FARM]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); breeze(c, L.T, 2.6, 10);
  onFace(c, 7.6, .2, .8, 40, L.k, 6.8); sh(V(20, 0, -30), 14); }, [[0, 'wind', .5], [.2, 'sparkle', .5]]);
// 4 «drei Sekunden»: cuenta atrás 3·2·1 encima de él, su placa sube a 99
shot(3.25, 'F', null, L => { town(L); const c = put(cool3, 20, 0, -30, -.4); actuar(c, 0, [[0, { ...FARM, aRx: 2.4 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' });
  const n = 3 - Math.floor(L.lt / .24); mtag(c, 'NICO', Math.round(lerp(96, 99, L.k)), 1); badge('num', String(Math.max(1, n)), W * .78, H * .3, ((L.lt % .24) / .24) * 2 + .3, 1, 1.3);
  orbit(V(20, 3.6, -30), lerp(15, 13.5, L.k), -.55, .1, 44); sh(V(20, 0, -30), 14); }, [[0, 'tick', .6], [.24, 'tick', .6], [.48, 'tick', .7]]);
// 5 «zu cool aus,»: se coloca las gafas; el Aura-Meter marca 100 en rojo
shot(3.95, 'S', null, L => { town(L); meter(lerp(99, 100, clamp(L.k * 2)), 'NICO'); const c = put(cool3, -6, 0, -64, 0); actuar(c, 0, [[0, FARM]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' });
  orbit(V(-6, 46, -84), lerp(46, 40, L.k), .08, .22, 46); sh(V(-6, 0, -70), 50); }, [[0, 'alarm_soft', .6], [.3, 'ding_reveal', .5]]);
// 6 «und ein Scharfschütze»: francotirador en el tejado del Rathaus apuntando, láser rojo
shot(4.73, 'C', 'punch', L => { town(L); soldat(0, 8, 23.3, -86, .25, L.T, { laser: 40 });
  cm([15, 28, -75, 8, 26.6, -86, 44], [13.5, 27.6, -76, 8, 26.6, -86, 42], L.k); sh(V(9, 23, -86), 16); }, [[0, 'click_set', .7], [.4, 'metal_hit', .4]]);
// 7 «erledigt dich»: punto en la frente, destello, cae de espaldas
shot(5.77, 'F', null, L => { town(L); const c = cool3; const q = zap(c, 20, -30, -.4, L, L.t0 + .3); if (q <= 0) dots(c, 1, L.T); if (q > 0 && q < .5) grade.uniforms.flash.value = .5;
  show(SHADES, 20 + q * 2.5, 6 + q * 2 - q * q * 5, -29 + q, q * 6); orbit(V(20, 3.4 - q * 1.6, -30), 12, -.4, .16, 44); crowdAt(L, 20, -30, 6, 9, 16, 7, { mode: 'shock', from: 20 }); sh(V(20, 0, -30), 14); }, [[.3, 'impact', .8], [.36, 'thud', .6], [.5, 'gasp', .5]]);
// 8 «aus drei Kilometern Entfernung.»: la cámara se aleja del tejado hasta la torre del Dom; cartel 3 KM
shot(6.47, 'Z', null, L => { town(L); const sx = DOMX + 13 - 8, sz = DOMZ + 45 + 8; soldat(2, sx, 70.5, sz, -.5, L.T, { laser: 120 }); const p = V(sx, 74, sz);
  cm([p.x + 2, p.y + 1.5, p.z + 9, p.x, p.y - .5, p.z, 40], [p.x + 40, p.y + 40, p.z + 90, p.x - 10, p.y - 30, p.z - 20, 52], L.k, easeIn); badge('gold', '3 KM', W / 2, H * .18, (L.lt - .3) * 3); sh(p, 30); }, [[0, 'zoom_out', .6], [.3, 'wind', .4]]);
cut(7.33, null, [0.4, 1, 0], [[0, 'cloth', .4]]);
// 9 «Und schuld daran ist»: fachada del Rathaus, la cámara sube por la escalinata
shot(8.01, 'W', null, L => { town(L); const g = put(glanz, -6, 3.6, -79, 0); actuar(g, 0, [[0, GEST.wave]], { T: L.T }); grin(g, L.T); crowdAt(L, -6, -60, 14, 4, 16, 9, { mode: 'clap', face: V(-6, 4, -79) });
  orb(L.k, V(-6, 8, -79), null, [40, -.3, .2, 48], [32, -.15, .14, 46]); sh(V(-6, 0, -75), 40); }, [[0, 'cheer', .5], [.2, 'steps', .3]]);
// 10 «unser Bürgermeister,»: Glanz saluda desde la escalinata (contrapicado)
shot(9.07, 'C', 'punch', L => { town(L); const g = put(glanz, -6, 3.6, -79, 0); actuar(g, 0, [[0, { ...GEST.wave, aRz: .3 + Math.sin(L.T * 9) * .3 }]], { T: L.T }); grin(g, L.T);
  orbit(V(-6, 8.4, -79), lerp(14, 12.5, L.k), .25, -.02, 44); sh(V(-6, 0, -79), 16); }, [[0, 'impact_soft', .6], [.2, 'cheer', .4]]);
// 11 «Konrad Glanz,» (zoom lento): primer plano, se baja las gafas doradas, nombre
shot(9.77, 'I', 'slow', L => { town(L); const g = put(glanz, -6, 3.6, -79, 0); actuar(g, 0, [[0, { aRx: 2.2, aRz: -.3, aRe: 2.2, headX: -.1 }]], { T: L.T }); talk(g, L.T, 9.77, 10.97, 'smug');
  onFace(g, 6.2, .1, -.6, 40, L.k, 5.2); badge('tag', 'BÜRGERMEISTER KONRAD GLANZ', W / 2, H * .17, (L.lt - .2) * 3, 1, .8); sh(V(-6, 0, -79), 12); }, [[0, 'sparkle', .5]]);
// 12 «denn niemand darf cooler sein»: Glanz señala con el dedo a la multitud, la gente se encoge
shot(10.97, 'S', null, L => { town(L); const g = put(glanz, -6, 3.6, -79, 0); actuar(g, 0, [[0, GEST.point]], { T: L.T }); cara(g, L.T, { expr: 'angry', mouth: 'grimace' }); crowdAt(L, -6, -64, 14, 3, 14, 11, { mode: 'cower', face: V(-6, 4, -79) });
  orb(L.k, V(-6, 6, -74), null, [24, .75, .18, 48], [22, .65, .16, 48]); sh(V(-6, 0, -68), 26); }, [[0, 'whoosh', .4], [.3, 'murmur', .4]]);
// 13 «als er.»: Glanz se mira en un espejo de mano, brillo dorado
shot(12.21, 'R', null, L => { town(L); const g = put(glanz, -6, 3.6, -79, .3); actuar(g, 0, [[0, GEST.cross]], { T: L.T }); grin(g, L.T); hearts(hp(g).add(V(0, 1.5, 0)), L.T); orbit(V(-6, 8.4, -79), 14.5, .55, .08, 42); sh(V(-6, 0, -79), 12); }, [[0, 'sparkle', .6]]);
// 14 «Deshalb hängt oben am Rathaus»: grúa desde la plaza hasta lo alto del Rathaus
shot(12.95, 'Z', null, L => { town(L); crowdAt(L, -6, -40, 14, 6, 20, 13, { mode: 'walk' }); cm([-6, 6, -20, -6, 20, -90, 50], [-6, 38, -40, -6, 54, -91, 48], L.k, easeInOut); sh(V(-6, 0, -60), 50); }, [[0, 'swoosh_up', .6], [.4, 'wind', .3]]);
cut(13.77, null, [-0.4, 1, 0], [[0, 'swipe', .4]]);
// 15 «der Aura-Meter.» (zoom lento): el medidor gigante, la aguja oscila
shot(14.35, 'F', 'slow', L => { town(L); meter(60 + Math.sin(L.T * 5) * 30, 'LIVE'); orbit(V(-6, 53, -91), lerp(30, 24, L.k), -.12, .05, 44); sh(V(-6, 30, -91), 40); }, [[0, 'machine_hum', .5], [.3, 'ticks', .5]]);
// 16 «Er misst die Aura von jedem,»: la plaza con placas sobre cada cabeza
const TAGS = [['LUKAS', 23], ['PIA', 41], ['EMIR', 12], ['ANNA', 57], ['JONAS', 8], ['MIA', 34], ['FELIX', 66], ['LEA', 19]];
shot(15.52, 'W', null, L => { town(L); const list = EX.slice(8, 16); list.forEach((c, i) => { const x = -18 + (i % 4) * 8 + (i > 3 ? 4 : 0), z = -24 - (i > 3 ? 9 : 0); put(c, x, 0, z, Math.sin(i) * .3); actuar(c, 0, [[0, walkP(L.T, i, 4)]], { T: L.T }); cara(c, L.T + i, { expr: 'neutral' }); mtag(c, TAGS[i][0], TAGS[i][1], (L.lt - i * .08) * 3); });
  orb(L.k, V(-4, 5, -28), null, [26, .1, .22, 48], [23, -.05, .2, 48]); sh(V(-6, 0, -28), 30); }, [[0, 'murmur', .4], [.3, 'pling', .4], [.7, 'pling', .3]]);
cut(16.3, null, [0.5, 0.85, 0], [[0, 'tick', .4]]);
// 17 «live,»: el medidor salta de nombre en nombre
shot(17.18, 'C', 'punch', L => { town(L); const i = Math.floor(L.lt / .14) % TAGS.length; meter(TAGS[i][1], TAGS[i][0]); orbit(V(-6, 50, -91), 32, .15, .02, 42); badge('red', '● LIVE', W / 2, H * .16, L.lt * 4, 1, .8); sh(V(-6, 40, -91), 30); }, [[0, 'glitch', .5], [.2, 'ticks', .4]]);
// 18 «rund um die Uhr.»: de noche, el medidor brilla sobre los tejados (la luna pasa)
shot(17.74, 'S', null, L => { town(L, 'night'); meter(40 + Math.sin(L.T * 3) * 20, 'NACHT'); orb(L.k, V(-6, 46, -91), null, [80, .55, .12, 50], [70, .35, .14, 50]); badge('gold', '24 / 7', W / 2, H * .17, (L.lt - .1) * 3); sh(V(-6, 0, -91), 60); }, [[0, 'clock_tick', .5], [.3, 'owl', .3]]);
// 19 «Glanz steht immer auf hundert.»: Glanz posa al lado de su placa GLANZ 100
shot(18.62, 'I', null, L => { town(L); meter(100, 'GLANZ'); const g = put(glanz, -6, 3.6, -79, 0); actuar(g, 0, [[0, GEST.cross]], { T: L.T }); grin(g, L.T);
  orb(L.k, V(-6, 9, -79), null, [16, -.35, .1, 46], [14, -.2, .1, 46]); badge('gold', '100', W / 2, H * .17, (L.lt - .9) * 3, 1, 1.1); sh(V(-6, 0, -79), 16); }, [[0, 'ding_soft', .5], [.9, 'cash', .5]]);
cut(19.44, null, [0.6, 0.8, 0], [[0, 'pling', .4]]);
// 20 «Wer die hundert erreicht,»: un vecino baila chulo, su placa sube a 100
shot(20.31, 'W', null, L => { town(L); const c = put(EX[21], 6, 0, 10, -.3); actuar(c, 0, [[0, { ...FARM, hipY: Math.sin(L.T * 8) * .2 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); mtag(c, 'TOBI', Math.round(lerp(94, 100, L.k)), 1);
  orbit(V(6, 3.8, 10), lerp(13, 11.5, L.k), -.3, .12, 44); sh(V(6, 0, 10), 16); }, [[0, 'pling', .5], [.7, 'alarm_soft', .6]]);
// 21 «wird gelöscht,»: puf — desaparece en una nube con chispas (solo quedan los zapatos)
shot(21.41, 'C', null, L => { town(L); const t = L.lt - .12; if (t < 0) { const c = put(EX[21], 6, 0, 10, -.3); actuar(c, 0, [[0, FARM]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); dots(c, 1, L.T); } else { show(SHOES, 6, 0, 10, -.3); boom(0, V(6, 0, 10), L.t0 + .12, L.T, .7); }
  crowdAt(L, 6, 10, 6, 7, 14, 15, { from: 22, mode: 'shock' }); orbit(V(6, 4.4, 10), 13, -.25, .14, 46); badge('red', 'GELÖSCHT', W / 2, H * .17, (L.lt - .2) * 3); sh(V(6, 0, 10), 16); }, [[.12, 'explosion', .7], [.2, 'gasp', .5]]);
// 22 «und zwar von seiner Spezialeinheit,»: el helicóptero aterriza en la plaza, los soldados bajan corriendo
shot(22.11, 'Z', null, L => { town(L); const hy = lerp(18, 6.5, easeOut(clamp(L.k * 1.4))); show(HELI[0], -6, hy, -50, 0); HELI[0].userData.spin(L.T); dust(V(-6, 0, -50), L.t0, L.T, 12, 2);
  for (let i = 0; i < 4; i++) { const c = put(SOL[i], -12 + i * 4, 0, -40 + Math.min(L.lt, 1) * 6, 0); actuar(c, 0, [[0, runP(L.T, i)]], { T: L.T }); cara(c, L.T + i, { expr: 'determined', eyes: 'squint' }); }
  orbit(V(-6, 5.5, -38), lerp(30, 26, L.k), .3, .12, 48); sh(V(-6, 0, -44), 30); }, [[0, 'heli', .8], [.5, 'steps_run', .5]]);
cut(22.77, null, [-0.6, 0.9, 2], [[0, 'whoosh_soft', .4]]);
// 23 «dem Kommando Robbe:»: rótulo KOMMANDO ROBBE en el costado del helicóptero
shot(23.83, 'S', 'punch', L => { town(L); show(HELI[0], -6, 6.5, -50, 0); HELI[0].userData.spin(L.T); soldat(4, 0, 0, -44, .4, L.T, { pose: { aRx: 2.7, aRz: .1, aRe: 1.6 }, rifle: false });
  cm([20, 7, -44, -5, 5.6, -51, 44], [19, 6.8, -46, -4, 5.6, -51, 44], L.k); sh(V(-6, 0, -50), 20); }, [[0, 'impact', .6], [.2, 'heli', .5]]);
// 24 «sechs Soldaten»: los seis en fila saludando (badge 6)
shot(25.05, 'W', null, L => { town(L); for (let i = 0; i < 6; i++) { const c = put(SOL[i], -10.2 + (i % 3) * 4.2 + (i > 2 ? 2.1 : 0), 0, -36 - (i > 2 ? 4 : 0), 0); const s = L.lt > i * .07; actuar(c, 0, [[0, s ? { aRx: 2.6, aRz: .45, aRe: 2.5, headX: -.05 } : {}]], { T: L.T }); cara(c, L.T + i, { expr: 'determined', eyes: 'squint', mouth: 'flat' }); }
  show(HELI[0], -6, 6.5, -56, 0); HELI[0].userData.spin(L.T); orb(L.k, V(-5, 4.6, -38), null, [24, .12, .12, 46], [21, -.08, .1, 46]); badge('gold', '6', W / 2, H * .17, (L.lt - .2) * 3, 1, 1.2); sh(V(-6, 0, -38), 22); }, [[0, 'steps_heavy', .6], [.2, 'stamp', .5]]);
// 25 «und eine echte»: la fila sigue… y al final hay un hueco bajo
shot(25.91, 'S', null, L => { town(L); for (let i = 3; i < 6; i++) { const c = put(SOL[i], -16 + i * 4.2, 0, -36, -.15); actuar(c, 0, [[0, { aRx: 2.6, aRz: .45, aRe: 2.5 }]], { T: L.T }); cara(c, L.T + i, { expr: 'determined', eyes: 'squint' }); } robbe(-16 + 6 * 4.2, 0, -36, 0, L.T, { salute: 1 });
  cm([-2, 6, -18, -1, 4.6, -36, 42], [7, 5, -22, 8, 3.2, -36, 42], L.k); sh(V(0, 0, -36), 20); }, [[0, 'whoosh_soft', .5]]);
// 26 «Robbe.» (golpe de zoom): la foca con casco saluda con la aleta
shot(26.53, 'C', 'punch', L => { town(L); robbe(9.2, 0, -36, 0, L.T, { salute: 1 }); orbit(V(9.2, 3.6, -36), lerp(9, 8, L.k), .15, .05, 42); badge('gold', 'ROBBE', W / 2, H * .17, L.lt * 4); sh(V(9, 0, -36), 12); }, [[0, 'impact', .7], [.05, 'toy', .6]]);
// 27 «Sonnenbrille» : de noche, una chica se pone gafas de sol bajo la farola
shot(26.97, 'F', null, L => { town(L, 'night'); const c = put(EX[5], 30, 0, 20, -.6); const k = clamp(L.lt / .45); actuar(c, 0, [[0, { aLx: lerp(.4, 2.4, k), aLz: -.2, aLe: lerp(.4, 2.2, k), aRx: lerp(.4, 2.4, k), aRz: -.2, aRe: lerp(.4, 2.2, k) }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' });
  attach(SHADES, c.head, [0, lerp(1.7, .78, k), .68], [0, 0, 0], 1.0); onFace(c, 6.2, 0, .4, 40, L.k, 5.4); sh(V(30, 0, 20), 12); }, [[0, 'cloth', .5], [.4, 'click_metal', .5]]);
// 28 «nach acht Uhr abends?»: el reloj del Rathaus marca las 20:01
shot(27.80, 'S', null, L => { town(L, 'night'); show(UHR, 34, 0, 26, -.6); const c = put(EX[5], 31.5, 0, 22, -.6); actuar(c, 0, [[0, FARM]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); attach(SHADES, c.head, [0, .78, .68]); orbit(V(32.5, 8.5, 24), lerp(22, 20, L.k), -.55, .02, 46); badge('gold', '20:01', W / 2, H * .17, (L.lt - .1) * 3, 1, 1.1); sh(V(-6, 0, -84), 30); }, [[0, 'clock_tick', .6], [.3, 'bell_far', .4]]);
// 29 «Abgeschossen.»: punto en la frente, destello y de espaldas; las gafas vuelan
shot(28.74, 'C', 'punch', L => { town(L, 'night'); const q = zap(EX[5], 30, 20, -.6, L, L.t0 + .1); if (q <= 0) dots(EX[5], 1, L.T); if (q > 0 && q < .4) grade.uniforms.flash.value = .55;
  show(SHADES, 30 + q * 2, 6 + q * 3 - q * q * 5, 20.5, q * 8); orbit(V(30, 3 - q * 1.4, 20), 11, -.5, .2, 46); badge('red', 'ABGESCHOSSEN', W / 2, H * .17, (L.lt - .2) * 3); sh(V(30, 0, 20), 12); }, [[.1, 'impact', .8], [.16, 'thud', .6]]);
// 30 «Du gehst von einer Explosion weg,»: camina hacia cámara, gran explosión detrás
shot(29.55, 'W', null, L => { town(L); const z = 30 + L.lt * 3; const c = put(EX[8], 26, 0, z, 0); actuar(c, 0, [[0, walkP(L.T, 0, 7)]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); attach(SHADES, c.head, [0, .78, .68]); boom(0, V(26, 0, 10), L.t0 + .1, L.T, 1.6);
  orbit(V(26, 4, z), 14, .05, .08, 44); sh(V(26, 0, z), 24); }, [[.1, 'explosion', .8], [.4, 'steps', .4]]);
cut(30.17, null, [0.5, 1.2, 0], [[0, 'cloth', .4]]);
// 31 «ohne dich umzudrehen?»: primer plano, ni se gira; el fuego se refleja
shot(31.13, 'R', null, L => { town(L); const z = 34.5 + L.lt * 3; const c = put(EX[8], 26, 0, z, 0); actuar(c, 0, [[0, walkP(L.T, 0, 7)]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); attach(SHADES, c.head, [0, .78, .68]); boom(0, V(26, 0, 12), L.t0 - 1.1, L.T, 1.6);
  onFace(c, 7.6, 0, -.5, 40, L.k, 6.8); sh(V(26, 0, z), 16); }, [[0, 'fire_roar', .5]]);
// 32 «Dann schicken sie»: el helicóptero dispara un cohete
shot(32.16, 'S', null, L => { town(L); show(HELI[1], 26, 30, -20, PI); HELI[1].userData.spin(L.T); rocketPath(0, u => V(26, 28 - u * 26, -16 + u * 52), L.k * .6);
  cm([40, 30, -6, 26, 28, -20, 50], [38, 29, -2, 26, 24, -12, 50], L.k); sh(V(26, 0, 0), 40); }, [[0, 'heli', .6], [.1, 'ignite', .7], [.2, 'whoosh', .6]]);
// 33 «eine noch größere.»: explosión gigante que lo engulle (el tipo vuela cómicamente)
shot(32.86, 'C', 'punch', L => { town(L); boom(1, V(26, 0, 38), L.t0 + .05, L.T, 3.2); const t = L.lt; if (t < .1) { const c = put(EX[8], 26, 0, 38, 0); actuar(c, 0, [[0, walkP(L.T, 0, 7)]], { T: L.T }); }
  else { const c = put(EX[8], 26 + t * 4, 2 + t * 14 - t * t * 8, 38 + t * 10, 0); c.root.rotation.x = t * 6; actuar(c, 0, [[0, GEST.shock]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' }); }
  orbit(V(26, 8, 40), 42, .25, .15, 50); badge('red', 'XXL', W / 2, H * .17, (t - .2) * 3, 1, 1.1); sh(V(26, 0, 38), 40); }, [[.05, 'explosion', 1], [.1, 'boom', .8]]);
// 34 «Deine Schuhe laufen alleine weiter.»: entre el humo, solo los zapatos siguen andando
shot(33.78, 'F', null, L => { town(L); const z = 40 + L.lt * 3.2, st = Math.sin(L.T * 9); show(SHOES, 26, Math.max(0, st) * .3, z, 0, 1); SHOES.children.forEach((m, i) => { m.position.z = (i < 2 ? 1 : -1) * st * .5; });
  dust(V(26, 0, z - 6), L.t0 - .3, L.T, 10, 1.4); cm([30, 2.5, z + 9, 26, .8, z, 40], [29, 2.2, z + 8, 26, .8, z, 40], L.k); sh(V(26, 0, z), 12); }, [[0, 'steps', .6], [.6, 'steps', .5]]);
shot(34.61, 'W', null, L => { town(L); const z = 42.6 + L.lt * 3.2, st = Math.sin(L.T * 9); show(SHOES, 26, Math.max(0, st) * .3, z, 0, 1); SHOES.children.forEach((m, i) => { m.position.z = (i < 2 ? 1 : -1) * st * .5; }); crowdAt(L, 26, z, 5, 6, 12, 19, { mode: 'shock', from: 6 });
  orbit(V(26, 1.5, z), 9, -.6, .3, 44); sh(V(26, 0, z), 14); }, [[0, 'steps', .5], [.3, 'gasp', .4]]);
// 35 «Du lehnst lässig mit einem Fuß»: apoyado en la farola, un pie arriba
const LT = V(-30, 0, 46);
const leaner = (L) => { show(LAT, LT.x, 0, LT.z, PI / 2); const c = put(EX[13], LT.x, 0, LT.z + 1.3, .35); actuar(c, 0, [[0, { lean: -.1, aRx: .2, aRz: -.3, aRe: .5, aLx: 2.5, aLz: .25, aLe: 2.1, lRx: -.45, lRk: 1.5, headX: -.12 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); return c; };
shot(35.45, 'S', null, L => { town(L); leaner(L); orb(L.k, V(LT.x + .3, 4.2, LT.z + 1), null, [14, .55, .12, 44], [12, .35, .1, 44]); sh(LT, 16); }, [[0, 'whistle', .4], [.4, 'cloth', .4]]);
shot(36.30, 'Z', null, L => { town(L); leaner(L); cm([LT.x + 6, 2, LT.z + 11, LT.x, 2, LT.z + .6, 42], [LT.x + 5, 3.4, LT.z + 11, LT.x, 3.4, LT.z + .6, 42], L.k); sh(LT, 10); }, [[0, 'metal_hit', .3]]);
// 36 «an einer Laterne?»: la farola entera con su cartel, picado
shot(36.77, 'F', null, L => { town(L); leaner(L); orbit(V(LT.x, 6.5, LT.z + .6), lerp(18, 16, L.k), .9, .32, 46); sh(LT, 16); }, [[0, 'neon_buzz', .4]]);
// 37 «Dann sprengen sie die Laterne,»: cohete → la farola revienta
shot(37.73, 'C', null, L => { town(L); const t = L.lt; if (t < .4) { leaner(L); rocketPath(0, u => V(LT.x + 60 - u * 59, 30 - u * 22, LT.z - 30 + u * 30), t / .4); } else { boom(0, V(LT.x, 4, LT.z), L.t0 + .4, L.T, 1.4); const c = put(EX[13], LT.x + 2 + (t - .4) * 6, 1 + (t - .4) * 8, LT.z, 0); c.root.rotation.z = (t - .4) * 5; actuar(c, 0, [[0, GEST.shock]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'scream' }); }
  orbit(V(LT.x, 6, LT.z), 26, -.9, .15, 48); sh(LT, 24); }, [[0, 'whoosh', .6], [.4, 'explosion', .9]]);
cut(38.27, null, [0.4, 0.9, 0], [[0, 'swipe', .4]]);
// 38 «die Straße»: la calle entera estalla (explosiones en cadena)
shot(39.07, 'W', 'punch', L => { town(L); for (let k = 0; k < 2; k++) boom(k, V(LT.x + 8 + k * 14, 0, LT.z - 6 - k * 10), L.t0 + k * .25, L.T, 2.2); crowdAt(L, LT.x + 14, LT.z - 10, 8, 12, 22, 23, { mode: 'cower', from: 10 });
  orbit(V(LT.x + 12, 6, LT.z - 8), 44, -.6, .3, 50); sh(V(LT.x + 12, 0, LT.z - 8), 40); }, [[0, 'boom', .8], [.25, 'explosion', .8], [.4, 'rubble', .5]]);
// 39 «und dich.»: él sale volando por el cielo dando vueltas
shot(39.91, 'R', null, L => { town(L); const t = L.lt + .5; const c = put(EX[13], LT.x + t * 10, 6 + t * 12, LT.z - t * 6, 0); c.root.rotation.set(t * 5, 0, t * 3); actuar(c, 0, [[0, GEST.shock]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' });
  const p = hp(c); cam([p.x - 10, p.y - 3, p.z + 10], [p.x, p.y - 1, p.z], 44); sh(p, 20); }, [[0, 'scream_girl', .4], [.1, 'whoosh_up', .5]]);
// 40 «Ein Junge warf eine Papierkugel»: el niño lanza la bola de papel de espaldas a la papelera
const JB = V(2, 0, 24), BIN = V(2, 0, 16);
const thrower = (L, k) => { show(MUE, BIN.x, 0, BIN.z, 0); const c = put(junge, JB.x, 0, JB.z, 0); actuar(c, 0, [[0, { aRx: lerp(3.0, 2.2, k), aRz: lerp(-.3, .2, k), aRe: lerp(1.6, .1, k), aLx: .3, lean: -.05, headX: -.1, headY: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); return c; };
shot(40.44, 'F', null, L => { town(L); const c = thrower(L, clamp((L.lt - .7) / .2)); const k = clamp((L.lt - .8) / 1.2); BALL.visible = true; BALL.position.copy(L.lt < .8 ? hp(c).add(V(.8, 1.6, -.3)) : arc([JB.x + .8, 7, JB.z - .3], [BIN.x, 3.9, BIN.z], 3, k)); BALL.rotation.set(L.T * 5, L.T * 3, 0);
  crowdAt(L, JB.x, JB.z, 5, 7, 14, 29, { from: 24 }); orbit(V(JB.x, 3.6, JB.z - 3), lerp(14, 12.5, L.k), .5, .12, 44); sh(V(JB.x, 0, JB.z), 16); }, [[.7, 'throw', .6], [.8, 'paper', .5]]);
cut(41.2, null, [-0.6, 0.9, 0], [[0, 'tick', .4]]);
// 41 «in den Mülleimer, ohne hinzusehen.»: la bola entra limpia en la papelera
shot(41.84, 'S', null, L => { town(L); thrower(L, 1); const k = clamp(.4 + L.lt / 1.2); BALL.visible = true; BALL.position.copy(arc([JB.x + .8, 7, JB.z - .3], [BIN.x, 3.9, BIN.z], 3, k)); BALL.rotation.set(L.T * 5, L.T * 3, 0);
  orbit(V(BIN.x, 3.5, BIN.z + 1), lerp(10, 8.5, L.k), -.7, .25, 44); sh(BIN, 14); }, [[.7, 'trash_hit', .6], [.8, 'ding_soft', .5]]);
shot(42.82, 'Z', null, L => { town(L); const c = thrower(L, 1); onFace(c, 6.2, 0, .4, 40, L.k, 5.4); sh(JB, 10); }, [[0, 'sparkle', .5]]);
// 42 «Sie erwischten ihn mitten im Wurf,»: congelado a mitad del lanzamiento con el punto rojo, destello y al suelo con estrellitas
shot(43.56, 'C', 'punch', L => { town(L); show(MUE, BIN.x, 0, BIN.z, 0); const q = zap(junge, JB.x, JB.z, 0, L, L.t0 + .55, { pose: { aRx: 2.6, aRz: 0, aRe: .8, aLx: .3, headY: .3 } }); if (q <= 0) { dots(junge, 1, L.T); TINT = 'rgba(40,60,120,.25)'; } if (q > 0 && q < .4) grade.uniforms.flash.value = .5;
  orbit(V(JB.x, 3 - q * 1.5, JB.z), 11, .7, .14, 44); sh(JB, 12); }, [[0, 'freeze', .6], [.55, 'impact', .7], [.62, 'thud', .5]]);
cut(44.19, null, [.25, 1, 0], [[0, 'pling', .4]]);
// 43 «und danach sprengten sie den Mülleimer,»: cohete a la papelera
shot(44.91, 'W', null, L => { town(L); const t = L.lt; if (t < .5) { show(MUE, BIN.x, 0, BIN.z, 0); rocketPath(1, u => V(BIN.x + 50 - u * 50, 40 - u * 37, BIN.z - 40 + u * 40), t / .5); } else boom(1, V(BIN.x, 1, BIN.z), L.t0 + .5, L.T, 1.4);
  const q = zap(junge, JB.x, JB.z, 0, L, -9); orbit(V(BIN.x, 4, BIN.z + 2), 20, -.4, .2, 48); sh(BIN, 20); }, [[0, 'whoosh', .6], [.5, 'explosion', .9]]);
shot(45.91, 'F', null, L => { town(L); boom(1, V(BIN.x, 1, BIN.z), L.t0 - .5, L.T, 1.0); crowdAt(L, BIN.x, BIN.z, 6, 9, 16, 31, { mode: 'shock', from: 0 }); orbit(V(BIN.x, 5, BIN.z), 30, .2, .2, 50); sh(BIN, 22); }, [[0, 'rubble', .6], [.3, 'gasp', .4]]);
// 44 «weil der Wurf perfekt war.» (zoom lento): repetición a cámara lenta, la bola en el aire con 10/10
shot(46.91, 'I', 'slow', L => { town(L); show(MUE, BIN.x, 0, BIN.z, 0); const k = .55 + L.k * .2; BALL.visible = true; BALL.position.copy(arc([JB.x + .8, 7, JB.z - .3], [BIN.x, 3.9, BIN.z], 3, k)); BALL.rotation.set(L.T, L.T * .6, 0); BALL.scale.setScalar(1.4);
  cam([BALL.position.x + 5, BALL.position.y + .4, BALL.position.z + 6], [BALL.position.x, BALL.position.y - 1.4, BALL.position.z], 40); grade.uniforms.sepia.value = .3; badge('green', 'PERFEKT 10/10', W / 2, H * .18, (L.lt - .3) * 3); sh(BIN, 12); }, [[0, 'sparkle', .5], [.4, 'choir', .4]]);
// 45 «Also sammeln jetzt alle negative Aura:»: la calle llena de gente haciendo el ridículo, placas bajas
const NEG = [['OLAF', 3], ['UTE', 7], ['KAI', 2], ['SVEN', 5], ['BEA', 1], ['TOM', 4]];
shot(48.30, 'W', null, L => { town(L); EX.slice(0, 6).forEach((c, i) => { const x = -16 + i * 5.4, z = -6 - (i % 2) * 5; put(c, x, 0, z, Math.sin(i * 2) * .4); actuar(c, 0, [[0, i % 2 ? GEST.shrug : { aLx: 2.8, aRx: .2, aLz: .4, headZ: .3, crouch: .15, lLx: .5, lLk: 1 }]], { T: L.T }); cara(c, L.T + i, { expr: 'confused', mouth: i % 2 ? 'wavy' : 'grin' }); mtag(c, NEG[i][0], NEG[i][1], (L.lt - i * .1) * 3); });
  SOCKM.forEach(m => m.visible = true); FANNY.forEach(f => f.visible = true); orb(L.k, V(-3, 4.5, -8), null, [26, -.15, .15, 48], [23, .05, .14, 48]); sh(V(-3, 0, -8), 26); }, [[0, 'murmur', .5], [.4, 'boing_metal', .4]]);
shot(49.42, 'R', null, L => { town(L); const c = put(EX[4], -6, 0, -8, 0); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .6, aRz: .6, hipY: Math.sin(L.T * 10) * .3, crouch: .2, headZ: Math.sin(L.T * 10) * .2 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'grin', eyes: 'closed' }); mtag(c, 'BEA', 1, 1);
  orbit(V(-6, 4, -8), lerp(11, 9.5, L.k), .3, .1, 44); sh(V(-6, 0, -8), 14); }, [[0, 'toy', .5], [.4, 'laugh_m', .4]]);
// 46 «Socken in Sandalen,»: calcetines blancos con sandalias (plano de pies → él orgulloso)
shot(50.60, 'F', null, L => { town(L); const c = put(EX[0], -4, 0, 4, 0); actuar(c, 0, [[0, { aLx: .2, aRx: .2, aLz: -.4, aRz: -.4, aLe: 1.8, aRe: 1.8, lean: -.1, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'grin' }); SOCKM.forEach(m => m.visible = true);
  cm([-4, 1.6, 10.5, -4, 1.0, 4, 42], [-4, 4.2, 14.5, -4, 3.2, 4, 44], clamp(L.k * 1.6), easeInOut); sh(V(-4, 0, 4), 10); }, [[0, 'cloth', .5], [.5, 'boing_metal', .4]]);
// 47 «Bauchtaschen,»: riñonera turquesa, posa orgulloso
shot(51.78, 'S', 'punch', L => { town(L); const c = put(EX[3], 4, 0, 2, -.2); FANNY[0].visible = true; actuar(c, 0, [[0, { aLx: .4, aLz: -.6, aLe: 1.2, aRx: .4, aRz: -.6, aRe: 1.2, hipY: .2, lean: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'grin' });
  orbit(V(4, 3.4, 2), 9.5, -.3, .08, 42); sh(V(4, 0, 2), 10); }, [[0, 'zip', .6]]);
// 48 «und absichtlich gegen Glastüren laufen.»: camina directo contra la puerta de cristal — ¡bonk!
const GD = V(-14, 0, 10);
shot(52.32, 'W', null, L => { town(L); show(GDOOR, GD.x, 0, GD.z, 0); const z = GD.z + 5 - Math.min(L.lt, .95) * 5; const hit = L.lt > .95; const c = put(EX[6], GD.x, 0, hit ? GD.z + .7 : z, PI); actuar(c, 0, [[0, hit ? GEST.recoil : walkP(L.T, 0, 8)]], { T: L.T }); cara(c, L.T, hit ? { expr: 'shock', eyes: 'closed', mouth: 'grimace' } : { expr: 'joy', mouth: 'grin' });
  orbit(V(GD.x, 4, GD.z + 1.5), 12, PI + .35, .1, 44); sh(GD, 14); }, [[.2, 'steps', .4], [.95, 'hand_glass', .8]]);
shot(53.45, 'C', 'punch', L => { town(L); show(GDOOR, GD.x, 0, GD.z, 0); const c = put(EX[6], GD.x, 0, GD.z + .9, PI); actuar(c, 0, [[0, GEST.recoil]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'closed', mouth: 'wavy' }); dizzy(c, L.T); mtag(c, 'KAI', 0, 1);
  orbit(V(GD.x, 3.6, GD.z + 1), 9, PI - .4, .1, 42); sh(GD, 12); }, [[0, 'glass_rattle', .6], [.2, 'toy', .4]]);
// ---------- b: yo nací con aura, la familia me hace uncool, la leyenda de Opa (54,30 – 101,20 s) ----------
const SIT = { lLx: 1.45, lRx: 1.45, lLk: -1.45, lRk: -1.45, aLx: .5, aRx: .5, aLe: .8, aRe: .8 };
const ME = V(-6, 0, 4);   // mi sitio en la plaza
const table = (L) => { kitchen(L); };
// la familia alrededor de la mesa de la cocina (yo en el centro, detrás de la mesa, mirando a +z)
const KT = V(KX, 0, 2);
function familyAt(L, o = {}) { kitchen(L); const me = put(ich, KT.x, 0, KT.z - 5.6, 0); actuar(me, 0, [[0, o.mePose || GEST.idle]], { T: L.T }); flap(me, L.T, .5);
  if (o.mama !== false) { const c = put(mama, KT.x - 4.4, 0, KT.z - 3.2, .6); actuar(c, 0, [[0, o.mamaPose || GEST.cross]], { T: L.T }); cara(c, L.T, { expr: o.fExpr || 'sus', mouth: 'flat' }); }
  if (o.oma !== false) { const c = put(oma, KT.x + 4.4, 0, KT.z - 3.2, -.6); actuar(c, 0, [[0, o.omaPose || GEST.cross]], { T: L.T }); cara(c, L.T + 1, { expr: o.fExpr || 'sus', mouth: 'flat' }); }
  if (o.papa !== false) { const c = put(papa, KT.x + 2.4, 0, KT.z - 8.6, -.25); actuar(c, 0, [[0, o.papaPose || GEST.cross]], { T: L.T }); cara(c, L.T + 2, { expr: o.fExpr || 'sus', mouth: 'flat' }); }
  return me; }

// 48 «Aber ich hatte ein Problem.»: yo en la plaza entre la gente «uncool», mi placa en 97
shot(54.30, 'Z', null, L => { town(L); const c = ichCool(ME.x, ME.z, 0, L.T, { expr: 'worried', mouth: 'flat', eyes: 'worried' }); mtag(c, 'ICH', 97, 1); crowdAt(L, ME.x, ME.z, 10, 6, 18, 33, { mode: 'uncool' }); SOCKM.forEach(m => m.visible = true);
  orb(L.k, V(ME.x, 3.6, ME.z), null, [17, .2, .14, 46], [14, .1, .12, 46]); sh(ME, 22); }, [[0, 'whoosh_soft', .5], [.3, 'murmur', .3]]);
shot(55.03, 'C', 'punch', L => { town(L); const c = ichCool(ME.x, ME.z, 0, L.T, { expr: 'worried', mouth: 'grimace', eyes: 'worried', wind: .6 }); sweat(c, L.T); onFace(c, 6.6, 0, .5, 40, L.k, 5.8); badge('red', 'PROBLEM', W / 2, H * .16, (L.lt - .15) * 3); sh(ME, 12); }, [[0, 'impact', .6], [.1, 'gulp', .5]]);
// 49 «Ich wurde mit Aura geboren.»: bebé con gafas de sol en la cuna del salón, brisa; placa 99
const CRIB = (() => { const g = new THREE.Group(); scene.add(g); const w = mat(0xf4f0e8, { roughness: .5 }); box(6, .4, 3.6, w, .1, g, 0, 2.4, 0); for (let k = 0; k <= 10; k++) for (const z of [-1.8, 1.8]) box(.16, 2.2, .16, w, .03, g, -3 + k * .6, 3.5, z); for (const x of [-3, 3]) box(.4, 4.8, 3.8, w, .1, g, x, 2.4, 0); box(5.6, .5, 3.2, mat(0x8ac8f0, { roughness: 1 }), .2, g, 0, 2.8, 0); outline(g, 1.2); g.visible = false; PROPS.push(g); return g; })();
const babyMe = (L) => { stubeN(L); OS.L.intensity = 300; show(CRIB, OX + 2, 0, 2, 0); const b = put(baby, OX + 2, 3.1, 2, 0); b.root.rotation.x = -.15; actuar(b, 0, [[0, COOL]], { T: L.T }); cara(b, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); attach(SHADES, b.head, [0, .9, .72], [0, 0, 0], 1.25); breeze(b, L.T, 2, 10); return b; };
shot(55.72, 'F', null, L => { const b = babyMe(L); orbit(V(OX + 2, 4.2, 2), lerp(10, 9, L.k), .25, .62, 42); badge('gold', '★ ★ ★', W / 2, H * .17, (L.lt - .2) * 3, 1, .8); sh(V(OX, 0, 2), 14); }, [[0, 'baby_gasp', .4], [.2, 'sparkle', .5]]);
shot(56.60, 'S', null, L => { const b = babyMe(L); mtag(b, 'BABY', 99, (L.lt - .1) * 3, 3); const m = put(mama, OX + 6.5, 0, 4, -1.2); actuar(m, 0, [[0, GEST.hands_face]], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'o' });
  orbit(V(OX + 3.6, 4.4, 2.6), lerp(15, 13.5, L.k), -.45, .45, 44); sh(V(OX, 0, 2), 14); }, [[0, 'gasp_f', .5], [.3, 'pling', .4]]);
// 50 «Egal wohin ich gehe,»: camino por la calle, la cámara me sigue de frente
shot(57.28, 'W', null, L => { town(L); const z = -2 + L.lt * 3.4; const c = put(ich, 26, 0, z, 0); actuar(c, 0, [[0, walkP(L.T, 0, 7)]], { T: L.T }); flap(c, L.T); cara(c, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); breeze(c, L.T, 2.6, 8);
  crowdAt(L, 26, z, 6, 8, 18, 35, { mode: 'walk', from: 12 }); orbit(V(26, 3.4, z), 12, .15, .1, 44); sh(V(26, 0, z), 16); }, [[0, 'steps', .5], [.3, 'wind', .4]]);
// 51 «mir folgt eine kleine Brise.»: hojas que giran a mi alrededor
shot(58.48, 'R', null, L => { town(L); const z = 2 + L.lt * 3.4; const c = put(ich, 26, 0, z, 0); actuar(c, 0, [[0, walkP(L.T, 0, 7)]], { T: L.T }); flap(c, L.T, 1.3); cara(c, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); breeze(c, L.T, 2.2, 18);
  orbit(V(26, 3.6, z), 12, .5, .2, 44); sh(V(26, 0, z), 14); }, [[0, 'leaves', .6], [.3, 'wind_trees', .4]]);
shot(59.34, 'Z', null, L => { town(L); const c = ichCool(26, 6, -.3, L.T, { wind: 1.4 }); breeze(c, L.T, 2.4, 18); orbit(V(26, 3, 6), lerp(14, 12, L.k), .6, .02, 44); sh(V(26, 0, 6), 14); }, [[0, 'wind', .5]]);
// 52 «Deshalb flattert mein Hoodie»: plano lateral de la capucha y el faldón ondeando
shot(60.04, 'S', null, L => { town(L); const c = ichCool(26, 6, -.3, L.T, { wind: 1.6 }); orbit(V(26, 4.2, 6), 10.5, -.3 + .5, .08, 42); sh(V(26, 0, 6), 12); }, [[0, 'cloth', .6], [.3, 'wind', .5]]);
cut(60.66, null, [-0.5, 1, 0], [[0, 'whoosh_soft', .4]]);
// 53 «immer dramatisch.» (zoom lento): contrapicado heroico
shot(61.30, 'I', 'slow', L => { town(L); const c = ichCool(26, 6, -.3, L.T, { wind: 1.8 }); breeze(c, L.T, 2.4, 14); const h = hp(c); cam([h.x - 1.5, 1.2, h.z + 8], [h.x, h.y - 1.4, h.z], 46); sh(V(26, 0, 6), 14); }, []);
// 54 «Sogar mein Schluckauf»: ¡hic! salto pequeño, bocadillo
shot(62.06, 'F', null, L => { town(L); const hic = (L.lt % .35) < .08; const c = ichCool(ME.x, ME.z, 0, L.T, { pose: hic ? { ...COOL, headX: -.35, lean: -.15 } : COOL, mouth: hic ? 'o' : 'smirk' }); c.root.position.y = hic ? .35 : 0; bubble(c, 'HICKS!', L.lt * 4, 2.2);
  orbit(V(ME.x, 3.8, ME.z), 12, -.2, .1, 44); sh(ME, 14); }, [[.05, 'jump_small', .4], [.1, 'pling', .5]]);
// «klingt cool.»: las chicas se giran con corazones
shot(62.77, 'W', null, L => { town(L); const c = ichCool(ME.x, ME.z, 0, L.T, { wind: .8 }); [EX[1], EX[5], EX[17]].forEach((g, i) => { const x = ME.x + [-5.5, 5.5, -3][i], z = ME.z + [-2, -2, -6][i]; put(g, x, 0, z, faceTo(V(x, 0, z), V(ME.x, 0, ME.z))); actuar(g, 0, [[0, GEST.hands_face]], { T: L.T }); cara(g, L.T + i, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' }); hearts(hp(g).add(V(0, 1.6, 0)), L.T + i); });
  orbit(V(ME.x, 3.6, ME.z - 2), lerp(21, 19, L.k), .05, .1, 46); sh(V(ME.x, 0, ME.z - 3), 18); }, [[0, 'sparkle', .5], [.2, 'gasp_f', .4]]);
// 55 «Mein Meter fällt nie unter sechsundneunzig,»: el Aura-Meter con mi nombre; la aguja nunca baja de 96
shot(63.66, 'C', 'punch', L => { town(L); meter(96 + Math.abs(Math.sin(L.T * 4)) * 3, 'ICH'); orbit(V(-6, 51, -91), lerp(30, 27, L.k), -.1, .05, 44); sh(V(-6, 40, -91), 30); }, [[0, 'impact', .5], [.2, 'machine_hum', .4]]);
shot(64.60, 'S', null, L => { town(L); const c = ichCool(ME.x, ME.z, .3, L.T); badge('gold', 'MIN. 96', W / 2, H * .09, (L.lt - .3) * 3, 1, .9); orbit(V(ME.x, 3.6, ME.z), lerp(13, 11.5, L.k), .45, .1, 44); sh(ME, 14); }, [[0, 'pling', .5], [.3, 'ding_soft', .4]]);
// 56 «also hält mich meine Familie absichtlich uncool.»: la familia me mira en la cocina, cuchichean
shot(65.84, 'W', null, L => { const me = familyAt(L); cara(me, L.T, { expr: 'smug', mouth: 'smirk' }); orbit(V(KT.x, 4, KT.z - 4.6), lerp(20, 18, L.k), 0, .14, 46); sh(KT, 20); }, [[0, 'door_close', .4], [.2, 'cup_rattle', .3]]);
shot(66.64, 'R', null, L => { kitchen(L); [[mama, -2.2, .5], [papa, 0, 0], [oma, 2.2, -.5]].forEach(([c, dx, ry], i) => { put(c, KT.x + 6 + dx, 0, KT.z + 6 - Math.abs(dx) * .6, ry + PI * .0); actuar(c, 0, [[0, GEST.lean_in]], { T: L.T }); talk(c, L.T + i, 66.64, 67.70, 'sus'); });
  orbit(V(KT.x + 6, 4.6, KT.z + 5), lerp(13, 11.5, L.k), 0, .14, 44); sh(KT, 16); }, [[0, 'whisper', .6]]);
shot(67.70, 'Z', null, L => { const me = familyAt(L, { fExpr: 'smug' }); cara(me, L.T, { expr: 'worried', mouth: 'wavy' }); badge('red', 'UNCOOL', W / 2, H * .16, (L.lt - .1) * 3); orbit(V(KT.x, 4.2, KT.z - 5.6), lerp(14, 12.5, L.k), .1, .1, 44); sh(KT, 16); }, [[0, 'sad_tone', .4]]);
// 57 «Mama schneidet meine Haare»: Mama con tijeras detrás de mí
const haircut = (L, bowlOn) => { kitchen(L); const me = put(ich, KT.x, 0, KT.z + 5.5, 0); actuar(me, 0, [[0, { aLx: .2, aRx: .2, aLe: .4, aRe: .4 }]], { T: L.T }); cara(me, L.T, { expr: 'worried', mouth: 'grimace' });
  const m = put(mama, KT.x + 2.4, 0, KT.z + 3.8, -.6); actuar(m, 0, [[0, { aRx: 2.6, aRz: -.3, aRe: 1.2, aLx: 2.5, aLz: -.5, aLe: 1.2, lean: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'smirk' });
  attach(SCI, m.aR.hand, [0, -.6, .3], [PI / 2, 0, Math.sin(L.T * 30) * .2], 1.1); if (bowlOn) { const h = hp(me); show(BOWL, h.x, h.y + 1.25 * .92, h.z, 0, 1.0); } return me; };
shot(68.45, 'F', null, L => { haircut(L, false); orbit(V(KT.x + .8, 4.6, KT.z + 5), lerp(14, 12.5, L.k), .3, .12, 44); sh(KT, 14); }, [[0, 'rip', .4], [.3, 'cloth', .4]]);
// 58 «mit einer Suppenschüssel.»: ¡la sopera en la cabeza! (golpe de zoom)
shot(69.45, 'C', 'punch', L => { const me = haircut(L, true); onFace(me, 6.8, .3, -.4, 40, L.k, 6); badge('gold', 'SUPPENSCHÜSSEL', W / 2, H * .15, (L.lt - .2) * 3, 1, .8); sh(KT, 12); }, [[0, 'porcelain', .7], [.3, 'rip', .4]]);
// 59 «Oma lässt mich einen Meerschweinchen-Rucksack tragen,»
shot(70.55, 'W', null, L => { kitchen(L); const me = put(ich, KT.x - 2, 0, KT.z + 6, .4); actuar(me, 0, [[0, GEST.shrug]], { T: L.T }); cara(me, L.T, { expr: 'worried', mouth: 'wavy' });
  const o = put(oma, KT.x + 2.6, 0, KT.z + 7, -.8); actuar(o, 0, [[0, GEST.hold]], { T: L.T }); grin(o, L.T); show(BACKP, KT.x + 1.2, 3.6, KT.z + 8.1, -.8, 1); orbit(V(KT.x, 4.4, KT.z + 6.6), lerp(15, 13.5, L.k), .1, .14, 44); sh(KT, 16); }, [[0, 'zip', .5], [.3, 'laugh_old', .4]]);
shot(71.31, 'S', null, L => { kitchen(L); setHair(ich, false); const me = put(ich, KT.x, 0, KT.z + 6, 0); actuar(me, 0, [[0, { aLx: .3, aRx: .3, aLz: .3, aRz: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'frown' }); const h = hp(me); show(BOWL, h.x, h.y + 1.15, h.z, 0, 1.0); BOWL.visible = false;
  attach(BACKP, me.spine, [0, 1.1, -1.1], [0, PI, 0], 1.05); const o = put(oma, KT.x + 4, 0, KT.z + 4.4, -1.0); actuar(o, 0, [[0, GEST.cheer]], { T: L.T }); laughF(o, L.T); orbit(V(KT.x + 1.6, 4.4, KT.z + 6), lerp(15, 13.5, L.k), 1.25, .12, 44); sh(KT, 16); }, [[0, 'cloth', .5], [.2, 'zip', .4]]);
shot(72.23, 'Z', null, L => { town(L); const z = 10 + L.lt * 3; const me = put(ich, ME.x, 0, z, 0); actuar(me, 0, [[0, walkP(L.T, 0, 7)]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'frown' }); attach(BACKP, me.spine, [0, 1.1, -1.1], [0, PI, 0], 1.05); mtag(me, 'ICH', 71, 1);
  crowdAt(L, ME.x, z, 6, 7, 16, 37, { mode: 'point', from: 18 }); orbit(V(ME.x, 3.8, z), 13, -.75, .1, 44); sh(V(ME.x, 0, z), 16); }, [[0, 'kids_laugh', .4], [.2, 'steps', .4]]);
// 60 «mit dem Meerschweinchen drin.»: primer plano de la cobaya en la ventanita
shot(72.80, 'C', 'punch', L => { kitchen(L); const me = put(ich, KT.x, 0, KT.z + 6, PI); actuar(me, 0, [[0, {}]], { T: L.T }); attach(BACKP, me.spine, [0, 1.1, -1.1], [0, PI, 0], 1.05); BACKP.userData.gp.rotation.y = Math.sin(L.T * 6) * .3; BACKP.userData.gp.position.y = .15 + Math.abs(Math.sin(L.T * 9)) * .05;
  const p = wpos(BACKP); cam([p.x + .8, p.y + .8, p.z + 5.5], [p.x, p.y - .2, p.z], 38); badge('gold', 'MOPPEL', W / 2, H * .17, (L.lt - .2) * 3); sh(KT, 12); }, [[0, 'squeak', .6], [.4, 'squeak', .5]]);
cut(72.98, null, [0.4, 1.2, 0], [[0, 'cloth', .4]]);
// 61 «Und jedes Mal, wenn ich neunundneunzig erreiche,»: en la mesa, mi placa sube… 99 en rojo
shot(74.05, 'W', null, L => { const me = familyAt(L, { mePose: COOL, fExpr: 'sus', papaPose: { aRx: .3, aLx: .3, aRe: .5 } }); cara(me, L.T, { expr: 'smug', mouth: 'smirk' }); flap(me, L.T, 1); mtag(me, 'ICH', Math.round(lerp(96, 98, L.k)), 1); orbit(V(KT.x, 4.4, KT.z - 5.6), lerp(18, 16, L.k), -.15, .14, 46); sh(KT, 16); }, [[0, 'pling', .4], [.4, 'pling', .4]]);
shot(74.95, 'C', 'punch', L => { const me = familyAt(L, { mePose: COOL, papa: false }); cara(me, L.T, { expr: 'smug', mouth: 'smirk' }); flap(me, L.T, 1.3); mtag(me, 'ICH', 99, 1); grade.uniforms.flash.value = Math.max(0, Math.sin(L.T * 14)) * .12; TINT = 'rgba(255,30,30,' + (.08 + Math.max(0, Math.sin(L.T * 14)) * .1).toFixed(3) + ')';
  onFace(me, 6.8, .2, .3, 40, L.k, 6); sh(KT, 14); }, [[0, 'alarm', .6]]);
cut(75.49, null, [0.5, 1, 0], [[0, 'swipe', .4]]);
// 62 «haut mir Papa ein Nudelholz auf den Kopf.»: Papa levanta el rodillo… ¡BONK!
const papaHit = (L, q) => { const me = familyAt(L, { mePose: COOL, papa: false, fExpr: 'smug' }); const p = put(papa, KT.x + 2.2, 0, KT.z - 5.4, -1.3); actuar(p, 0, [[0, { aRx: lerp(3.1, 1.6, q), aRz: -.2, aRe: lerp(.6, .1, q), aLx: .4, lean: lerp(-.1, .25, q) }]], { T: L.T }); cara(p, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  attach(PIN, p.aR.hand, [0, -.5, .3], [0, 0, PI / 2], 1); return me; };
shot(76.33, 'S', null, L => { const me = papaHit(L, 0); cara(me, L.T, { expr: 'smug', mouth: 'smirk' }); orbit(V(KT.x + 1, 5, KT.z - 5.5), lerp(15, 14, L.k), -.6, .12, 44); sh(KT, 14); }, [[0, 'whoosh_up', .5]]);
shot(77.09, 'C', 'punch', L => { const q = clamp(L.lt / .12); const me = papaHit(L, q); cara(me, L.T, q >= 1 ? { expr: 'shock', eyes: 'closed', mouth: 'grimace' } : { expr: 'smug', mouth: 'smirk' }); if (q >= 1) { applyPose(me, { crouch: .25, headX: .3 }); badge('red', 'BONK!', W / 2, H * .18, (L.lt - .12) * 4, 1, 1.2); }
  orbit(V(KT.x + .8, 5.4, KT.z - 5.5), 13.5, -.5, .1, 44); sh(KT, 14); }, [[.1, 'metal_hit', .3], [.11, 'thud', .7]]);
shot(77.65, 'Z', null, L => { const me = familyAt(L, { mePose: { crouch: .2, headX: .3, aLx: .2, aRx: .2 }, papa: false, fExpr: 'smug' }); cara(me, L.T, { expr: 'confused', eyes: 'closed', mouth: 'wavy' }); dizzy(me, L.T); mtag(me, 'ICH', 96, 1); onFace(me, 7, .4, -.4, 40, L.k, 6.4); sh(KT, 12); }, [[0, 'toy', .5]]);
// 63 «Doch eines Nachts»: la casa de la familia de noche, luna; luz en la ventana
shot(78.13, 'F', null, L => { town(L, 'night'); HB.HL.intensity = 60; orb(L.k, V(4, 18, 96), null, [56, PI / 2 + .45, -.05, 50], [48, PI / 2 + .3, -.08, 50]); sh(V(4, 0, 96), 40); }, [[0, 'owl', .5], [.2, 'crickets', .4]]);
// 64 «erzählte mir Opa ein Geheimnis:»: Opa en el sillón, yo en el suelo escuchando
const AC = () => V(OX - 6, 0, -3);
const opaChair = (L, talkIt = true) => { stubeN(L); const a = AC(); const o = put(opa, a.x, 1.3, a.z + .3, .5); actuar(o, 0, [[0, { ...SIT, aRx: 1.0, aRz: -.2, aRe: 1.4, headX: .05 }]], { T: L.T }); if (talkIt) talk(o, L.T, L.t0, L.t1, 'sus'); else cara(o, L.T, { expr: 'sus', mouth: 'smirk' });
  const mp = V(a.x + Math.sin(.5) * 6.4, 0, a.z + Math.cos(.5) * 6.4); const me = put(ich, mp.x, -.2, mp.z, faceTo(mp, a)); actuar(me, 0, [[0, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: 1.5, aRe: 1.5, headX: -.1 }]], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'o' }); return o; };
shot(79.24, 'W', null, L => { opaChair(L); const a = AC(); orbit(V(a.x + 1.6, 3.4, a.z + 3.2), lerp(17, 15, L.k), -.45, .3, 44); sh(a, 16); }, [[0, 'fire_crackle', .5], [.3, 'clock_tick', .3]]);
shot(80.04, 'I', null, L => { const o = opaChair(L); onFace(o, 6.6, .2, .6, 40, L.k, 5.8); sh(AC(), 12); }, [[0, 'whisper', .6]]);
// 65 «die Geschichte vom letzten echten Aura-Farmer.»: mis ojos como platos → Opa (zoom lento)
shot(80.98, 'C', null, L => { opaChair(L); const me = ich; cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); const h = hp(me); const a = me.root.rotation.y; cam([h.x + Math.sin(a) * 3.6 + Math.cos(a) * 1.4, h.y + 1.4, h.z + Math.cos(a) * 3.6 - Math.sin(a) * 1.4], [h.x, h.y - .1, h.z], 46); sh(AC(), 12); }, [[0, 'gasp', .4]]);
shot(81.68, 'Z', 'slow', L => { const o = opaChair(L); onFace(o, 7.4, .3, .2, 40, L.k, 5.6); badge('gold', 'DER LETZTE AURA-FARMER', W / 2, H * .15, (L.lt - .6) * 3, 1, .75); sh(AC(), 12); }, []);
// 66 «Vor vierzig Jahren»: Glanzheim en sepia, desde el aire, tormenta
const past = () => { grade.uniforms.sepia.value = .75; grade.uniforms.sat.value = 1.0; };
shot(83.55, 'F', null, L => { town(L, 'storm'); past(); RAIN.update(L.T, camera.position.clone().add(V(0, -20, -20)), 60, 60, 40, true); orb(L.k, V(DOMX, 60, DOMZ), null, [210, .3, .32, 50], [190, .25, .3, 50]); badge('gold', 'VOR 40 JAHREN', W / 2, H * .17, (L.lt - .1) * 3, 1, .9); sh(V(0, 0, -60), 120); }, [[0, 'film_roll', .5], [.1, 'wind_howl', .4]]);
// 67 «kletterte ein Mann bei Gewitter»: silueta escalando la aguja bajo la lluvia
const legend = (L, y, pose, o = {}) => { town(L, 'storm'); past(); const t = DTOP(); const c = put(opa, t.x, y, t.z + (o.dz ?? 0), o.ry ?? 0); actuar(c, 0, [[0, pose]], { T: L.T }); coatWind(c, L.T, 1.4); cara(c, L.T, { expr: 'smug', mouth: 'flat', eyes: 'half' }); DARK = o.dark ?? .25; RAIN.update(L.T, t.clone().add(V(0, -25, 0)), 40, 40, 50, true); return c; };
const CLIMB = (T) => { const p = Math.sin(T * 6); return { aLx: 2.8 + p * .3, aRx: 2.8 - p * .3, aLe: .4, aRe: .4, lLx: .8 + p * .4, lRx: .8 - p * .4, lLk: 1.2, lRk: 1.2, lean: .2 }; };
shot(84.37, 'S', null, L => { const t = DTOP(); const y = t.y - 26 + L.lt * 4; const c = legend(L, y, CLIMB(L.T), { dz: 3.2 }); cm([t.x + 7, y + 5, t.z + 16, t.x, y + 3, t.z + 3.2, 44], [t.x + 6, y + 6, t.z + 15, t.x, y + 4, t.z + 3.2, 44], L.k); sh(t, 20); }, [[0, 'rain_amb', .5], [.3, 'wood_creak', .4]]);
shot(85.13, 'F', null, L => { const t = DTOP(); legend(L, t.y - 21, CLIMB(L.T), { dz: 2.4 }); BOLT.visible = true; BOLT.position.set(t.x - 30, t.y + 40, t.z - 40); BOLT.scale.setScalar(5); grade.uniforms.flash.value = L.lt < .06 ? .4 : 0; orbit(V(t.x, t.y - 14, t.z), 60, -.4, .1, 50); sh(t, 30); }, [[0, 'thunder', .9]]);
// 68 «auf die Spitze vom Dom,»: plano amplio de la aguja con la figura arriba
shot(85.93, 'W', null, L => { const t = DTOP(); legend(L, t.y, COOL, { dark: .2 }); orb(L.k, V(t.x, t.y - 12, t.z), null, [70, .2, .02, 50], [60, .1, .02, 48]); sh(t, 60); }, [[0, 'wind_howl', .5]]);
// 69 «verschränkte die Arme»: contrapicado, cruza los brazos
shot(87.08, 'C', 'punch', L => { const t = DTOP(); const k = clamp(L.lt / .4); legend(L, t.y, { ...COOL, aLx: lerp(.3, 1.3, k), aRx: lerp(.3, 1.3, k), aLz: lerp(0, -.72, k), aRz: lerp(0, -.72, k), aLe: lerp(.2, 1.95, k), aRe: lerp(.2, 1.95, k) }); cam([t.x + 3, t.y - 2, t.z + 10], [t.x, t.y + 3.8, t.z], 44); sh(t, 14); }, [[0, 'cloth', .6], [.3, 'impact_soft', .4]]);
// 70 «und stand einfach nur da.»
shot(87.96, 'S', null, L => { const t = DTOP(); const c = legend(L, t.y, COOL); orbit(V(t.x, t.y + 3.4, t.z), lerp(16, 14, L.k), .4 + L.k * .3, .05, 44); sh(t, 14); }, [[0, 'wind', .5]]);
shot(88.48, 'R', null, L => { const t = DTOP(); legend(L, t.y, COOL); BOLT.visible = true; BOLT.position.set(t.x + 40, t.y + 30, t.z - 50); BOLT.scale.setScalar(5); grade.uniforms.flash.value = L.lt > .6 && L.lt < .7 ? .6 : 0; orbit(V(t.x, t.y - 8, t.z), lerp(46, 40, L.k), -.6, .02, 48); sh(t, 30); }, [[0, 'rain_amb', .5], [.6, 'thunder', .8]]);
// 71 «Seine Aura war so stark,» (zoom lento): resplandor dorado alrededor de la figura
const AURA = (() => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 1.7, .6), transparent: true, opacity: .25, depthWrite: false, side: THREE.BackSide, toneMapped: false })); scene.add(m); m.visible = false; PROPS.push(m); return m; })();
const auraOn = (c, T, s = 1) => { const p = wpos(c.root); AURA.visible = true; AURA.position.set(p.x, p.y + 3.4, p.z); AURA.scale.set(3.6 * s, 5 * s, 3.6 * s); AURA.material.opacity = .18 + Math.sin(T * 8) * .05; };
shot(89.72, 'I', 'slow', L => { const t = DTOP(); const c = legend(L, t.y, COOL, { dark: .1 }); auraOn(c, L.T, 1 + L.k * .3); orbit(V(t.x, t.y + 3.4, t.z), lerp(18, 13, L.k), .3, .02, 44); sh(t, 14); }, [[0, 'choir', .5]]);
// 72 «dass sich die Wolken in einem perfekten Kreis um ihn öffneten.»: las nubes se abren en círculo
shot(91.30, 'Z', null, L => { const t = DTOP(); const c = legend(L, t.y, COOL, { dark: .1 }); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), .2 + L.k * .4); auraOn(c, L.T); orbit(V(t.x, t.y + 8, t.z), 70, .2, .55, 50); sh(t, 40); }, [[0, 'wind_rise', .6]]);
shot(92.26, 'F', 'punch', L => { const t = DTOP(); const c = legend(L, t.y, COOL, { dark: 0 }); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), .6 + L.k * .4); auraOn(c, L.T); cam([t.x + 2, t.y + 150, t.z + 6], [t.x, t.y, t.z], 50); sh(t, 40); }, [[0, 'sunrise_shine', .6]]);
shot(93.24, 'S', null, L => { const t = DTOP(); const c = legend(L, t.y, COOL, { dark: 0 }); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), 1); auraOn(c, L.T); RAIN.update(0, t, 1, 1, 1, false); orbit(V(t.x, t.y + 6, t.z), lerp(30, 26, L.k), -.3, -.15, 48); sh(t, 30); }, [[0, 'choir', .5]]);
// 73 «Das Kommando feuerte alles, was es hatte,»: los soldados disparan desde los tejados; cohetes alrededor de la aguja
shot(94.06, 'W', null, L => { town(L, 'storm'); past(); RAIN.update(L.T, V(-6, 0, -86), 40, 40, 40, true); for (let i = 0; i < 3; i++) soldat(i, [-13, -8, -3][i], 23.3, -86, .6, L.T, { laser: 60, rifle: i }); grade.uniforms.flash.value = Math.max(0, Math.sin(L.T * 30)) * .15;
  cm([18, 30, -66, -6, 25.5, -86, 46], [16, 29, -68, -6, 25.5, -86, 46], L.k); sh(V(-6, 23, -86), 20); }, [[0, 'impact', .5], [.15, 'impact', .4], [.3, 'impact', .5], [.5, 'impact', .4]]);
shot(94.94, 'C', null, L => { const t = DTOP(); legend(L, t.y, COOL, { dark: .1 }); for (let k = 0; k < 2; k++) boom(k, t.clone().add(V(k ? 9 : -8, -4 + k * 3, k ? 4 : -3)), L.t0 + k * .35, L.T, 1.2); show(HELI[0], t.x + 40, t.y + 6, t.z + 40, -PI * .75); HELI[0].userData.spin(L.T);
  orbit(V(t.x + 10, t.y, t.z + 10), 64, .7, .1, 50); sh(t, 40); }, [[0, 'explosion', .7], [.35, 'explosion', .7], [.1, 'heli', .4]]);
// 74 «aber er blinzelte nicht einmal.»: primer plano en la sombra, los ojos quietos
shot(96.06, 'I', null, L => { const t = DTOP(); const c = legend(L, t.y, COOL, { dark: .2 }); cara(c, L.T, { eyes: 'normal', mouth: 'flat', noBlink: true }); RAIN.update(0, t, 1, 1, 1, false); boom(0, t.clone().add(V(-3, 2, -6)), L.t0 + .2, L.T, .8); onFace(c, 7.4, .1, .3, 40, L.k, 6.6); sh(t, 14); }, [[.2, 'explosion', .6], [.4, 'tick', .4]]);
cut(96.86, null, [0.4, 0.9, 0], [[0, 'tick', .4]]);
// 75 «Dann verschwand er spurlos.»: humo… y la aguja vacía
shot(97.55, 'S', null, L => { const t = DTOP(); if (L.lt < .25) legend(L, t.y, COOL); else { town(L, 'storm'); past(); RAIN.update(L.T, t.clone().add(V(0, -25, 0)), 40, 40, 50, true); } dust(t, L.t0 + .2, L.T, 16, 1.4); orbit(V(t.x, t.y + 3, t.z), 16, .1, .05, 44); sh(t, 14); }, [[.2, 'magic_hit', .6], [.3, 'whoosh_soft', .4]]);
shot(98.31, 'W', null, L => { town(L, 'storm'); past(); const t = DTOP(); RAIN.update(L.T, t.clone().add(V(0, -25, 0)), 40, 40, 50, true); orb(L.k, V(t.x, t.y - 10, t.z), null, [60, -.3, .05, 48], [52, -.4, .08, 48]); badge('q', '?', W / 2, H * .2, (L.lt - .2) * 3); sh(t, 30); }, [[0, 'wind_howl', .5]]);
// 76 «Und seitdem hat der Bürgermeister Angst.»: Glanz de noche junto a la ventana, temblando y sudando
shot(99.18, 'F', null, L => { stubeN(L); OS.L.intensity = 90; const g = put(glanz, OX + 4, 0, 4, .3); actuar(g, 0, [[0, { ...GEST.hug_self, ...shiver(L.T, 3) }]], { T: L.T }); cara(g, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(g, L.T);
  orbit(V(OX + 4, 4.6, 4), lerp(14, 12.5, L.k), .4, .14, 44); sh(V(OX, 0, 4), 16); }, [[0, 'heartbeat', .6], [.3, 'thunder', .3]]);
shot(100.18, 'C', 'punch', L => { stubeN(L); OS.L.intensity = 90; const g = put(glanz, OX + 4, 0, 4, .3); actuar(g, 0, [[0, { ...GEST.hug_self, ...shiver(L.T, 3) }]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'scared', mouth: 'grimace_wide' }); sweat(g, L.T, 3); onFace(g, 6.6, .2, -.3, 40, L.k, 5.8); badge('red', 'ANGST', W / 2, H * .15, (L.lt - .3) * 3); sh(V(OX, 0, 4), 12); }, [[0, 'impact', .5], [.2, 'heartbeat', .5]]);
// ---------- c: la Aura-Parade, el bebé, 180, los puntos rojos, «Feuer!», Opa en la aguja, la bala y el cohete vuelven (101,20 – 145,02 s) ----------
const FL = V(-6, 0, -40);            // carroza (Glanz encima, mira a +z)
const FLTOP = V(-6, 5.3, -41);
const BAL = V(-50.8, 17.25, 30);     // borde del balcón (el bebé cae desde aquí)
const CATCH = V(-44.5, 0, 30);       // donde estoy yo (mirando a +x… de lado a la cámara)
const MOM = EX[2];
const parade = (L, o = {}) => { town(L); FLOAT.visible = true; FLOAT.position.copy(FL); const g = put(glanz, FLTOP.x, FLTOP.y, FLTOP.z, 0); actuar(g, 0, [[0, o.gPose || { ...GEST.wave, aRz: .3 + Math.sin(L.T * 8) * .3 }]], { T: L.T }); if (o.gFace) cara(g, L.T, o.gFace); else grin(g, L.T); return g; };
const balc = (L, k) => { const m = put(MOM, BAL.x - 1.6, BAL.y, BAL.z + 1.2, PI / 2); actuar(m, 0, [[0, k > 0 ? { aLx: 2.2, aRx: 2.2, aLe: .2, aRe: .2, lean: .4 } : GEST.hold]], { T: L.T }); cara(m, L.T, k > 0 ? { expr: 'shock', eyes: 'terror', mouth: 'scream' } : { expr: 'happy', mouth: 'smile' }); return m; };
// trayectoria de caída del bebé: del balcón a mi mano (k 0..1)
const fallP = k => V(lerp(BAL.x + .4, CATCH.x - .2, k), lerp(BAL.y + 2.6, 8.4, k * k), BAL.z);
const meCatch = (L, look = 0) => { const me = put(ich, CATCH.x, 0, CATCH.z, PI / 2 + .9); actuar(me, 0, [[0, { aRx: 3.0, aRz: .15, aRe: .1, aLx: .25, aLz: -.4, aLe: 1.3, headY: look, lean: -.04 }]], { T: L.T }); flap(me, L.T, 1.4); cara(me, L.T, { expr: 'smug', mouth: 'smirk', eyes: 'half' }); return me; };
const babyOn = (me, L) => { me.root.updateMatrixWorld(true); const p = me.aR.hand.getWorldPosition(V(0, 0, 0)); const b = put(baby, p.x, p.y + .2, p.z, PI / 2 + .9); b.root.rotation.z = .1; actuar(b, 0, [[0, GEST.cheer]], { T: L.T }); cara(b, L.T, { expr: 'joy', mouth: 'open_smile' }); return b; };

// 77 «Am nächsten Tag war»: la carroza dorada de Glanz entra en la plaza, confeti
shot(101.20, 'Z', null, L => { const g = parade(L); crowdAt(L, FL.x, FL.z + 8, 18, 9, 26, 41, { mode: 'clap', face: FLTOP }); confRain(V(FL.x, 0, FL.z + 4), L.T, 60, 24, 20, 18); orb(L.k, V(FL.x, 6, FL.z + 2), null, [40, .35, .25, 50], [34, .25, .22, 50]); sh(FL, 40); }, [[0, 'party_horn', .6], [.2, 'cheer', .5], [.5, 'confetti', .4]]);
shot(102.38, 'C', 'punch', L => { const g = parade(L); confRain(V(FL.x, 0, FL.z + 4), L.T, 50, 16, 14, 16); orbit(V(FLTOP.x, FLTOP.y + 3.4, FLTOP.z), lerp(14, 12.5, L.k), -.25, .02, 44); badge('gold', 'AURA-PARADE', W / 2, H * .15, (L.lt - .2) * 3, 1, .9); sh(FL, 20); }, [[0, 'impact', .5], [.2, 'fanfare', .5]]);
cut(102.68, null, [0.6, 1.3, 0], [[0, 'pling', .4]]);
// 78 «bei der alle klatschen müssen,»: la gente aplaude con cara de sufrimiento; un soldado vigila
shot(103.66, 'W', null, L => { parade(L); const ppl = EX.slice(14, 19); ppl.forEach((c, i) => { const x = FL.x - 8 + i * 4, z = FL.z + 24 + (i % 2) * 2; put(c, x, 0, z, PI); actuar(c, 0, [[0, clapP(L.T, i)]], { T: L.T }); cara(c, L.T + i, { expr: 'worried', mouth: 'grimace' }); });
  soldat(3, FL.x + 9, 0, FL.z + 28, PI + .4, L.T, { pose: GEST.cross, rifle: false }); orbit(V(FL.x, 4, FL.z + 25), lerp(14, 12.5, L.k), PI - .15, .14, 44); sh(V(FL.x, 0, FL.z + 18), 20); }, [[0, 'clap_crowd', .6]]);
shot(104.25, 'S', null, L => { parade(L); crowdAt(L, FL.x, FL.z + 6, 18, 8, 24, 43, { mode: 'clap', face: FLTOP }); soldat(4, FL.x + 9, 0, FL.z + 6, -.6, L.T, { pose: GEST.point, rifle: false, expr: 'angry' }); orbit(V(FL.x + 4, 4, FL.z + 8), lerp(26, 23, L.k), .55, .2, 48); sh(FL, 30); }, [[0, 'clap_crowd', .5], [.3, 'whistle', .4]]);
// 79 «bis ihre Hände glühen.»: manos rojas brillando
shot(105.03, 'F', null, L => { parade(L); const c = put(EX[19], FL.x + 2, 0, FL.z + 18, PI); actuar(c, 0, [[0, clapP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'cry', mouth: 'grimace_wide' }); glowHands(c, 0); steam(hp(c).add(V(0, -1, -1.5)), L.T, 4);
  const h = hp(c); cam([h.x - 2, h.y - .2, h.z - 6.5], [h.x, h.y - 1.4, h.z], 40); sh(V(FL.x, 0, FL.z + 18), 12); }, [[0, 'sizzle', .5], [.2, 'clap', .5]]);
shot(105.73, 'C', 'punch', L => { parade(L); crowdAt(L, FL.x, FL.z + 6, 16, 8, 22, 45, { mode: 'clap', face: FLTOP, glow: true }); orbit(V(FL.x, 4, FL.z + 14), 18, PI - .3, .25, 46); sh(FL, 24); }, [[0, 'fire_crackle', .5], [.1, 'clap_crowd', .5]]);
// 80 «Doch genau da» (zoom lento): el balcón con la madre y el bebé, sobre la plaza
shot(106.24, 'I', 'slow', L => { parade(L); balc(L, 0); const b = put(baby, BAL.x - .4, BAL.y + 3.2, BAL.z + 1.2, PI / 2); actuar(b, 0, [[0, GEST.cheer]], { T: L.T }); cara(b, L.T, { expr: 'joy', mouth: 'open_smile' });
  orbit(V(BAL.x - .5, BAL.y + 3.4, BAL.z + .8), lerp(20, 14, L.k), PI / 2 + .25, -.05, 44); sh(V(BAL.x, 0, BAL.z), 24); }, []);
// 81 «fiel ein Baby»: se le escapa de los brazos
shot(107.02, 'C', null, L => { parade(L); balc(L, 1); const k = clamp(L.lt / 1.8) * .3; const b = put(baby, ...fallP(k).toArray(), PI / 2); b.root.rotation.z = L.lt * 4; actuar(b, 0, [[0, GEST.shock]], { T: L.T }); cara(b, L.T, { expr: 'shock', mouth: 'o' });
  orbit(V(BAL.x + 1, BAL.y + 2.6, BAL.z), 15, PI / 2 + .5, .05, 44); sh(V(BAL.x, 0, BAL.z), 24); }, [[0, 'scream_girl', .5], [.1, 'whoosh_down', .5]]);
// «von einem Balkon.»: cae a lo largo de la fachada
shot(107.84, 'S', null, L => { parade(L); balc(L, 1); const k = .3 + L.k * .55; const p = fallP(k); const b = put(baby, p.x, p.y, p.z, PI / 2); b.root.rotation.z = L.T * 4; actuar(b, 0, [[0, GEST.shock]], { T: L.T }); cara(b, L.T, { expr: 'shock', mouth: 'o' });
  cam([p.x + 9, p.y + 4, p.z + 9], [p.x, p.y, p.z], 46); crowdAt(L, CATCH.x + 6, CATCH.z, 6, 6, 14, 47, { mode: 'shock', from: 20 }); sh(V(BAL.x, 0, BAL.z), 24); }, [[0, 'gasp', .5], [.3, 'whoosh_down', .4]]);
// 82 «Ich fing es»: lo atrapo con una mano, sin mirar
shot(108.86, 'W', 'punch', L => { parade(L); const me = meCatch(L, -.9); const k = clamp(.85 + L.lt / .25 * .15); if (k < 1) { const p = fallP(k); const b = put(baby, p.x, p.y, p.z, PI / 2); actuar(b, 0, [[0, GEST.shock]], { T: L.T }); } else babyOn(me, L);
  orbit(V(CATCH.x - 1, 5, CATCH.z), lerp(15, 13.5, L.k), PI / 2 + 1.1, .1, 46); sh(CATCH, 20); }, [[.08, 'catch', .7], [.1, 'impact_soft', .5]]);
// «mit einer Hand,»: plano detalle de la mano con el bebé encima
shot(109.40, 'C', null, L => { parade(L); const me = meCatch(L, -.9); const b = babyOn(me, L); const p = hp(b); cam([p.x + 3.6, p.y - .6, p.z + 4.8], [p.x, p.y - .4, p.z], 40); badge('gold', '1 HAND', W / 2, H * .16, (L.lt - .2) * 3); sh(CATCH, 12); }, [[0, 'baby_gasp', .4]]);
// 83 «ohne hinzusehen,»: mi cara mirando a otro lado, chulo
shot(110.08, 'R', null, L => { parade(L); const me = meCatch(L, -1.0); babyOn(me, L); const h = hp(me); cam([h.x + 8, h.y + .5, h.z + 1.2], [h.x, h.y - .4, h.z], 40); sh(CATCH, 12); }, [[0, 'sparkle', .5]]);
// 84 «während mein Hoodie im Wind flatterte.» (zoom lento): contrapicado heroico, capucha al viento, hojas
shot(110.96, 'Z', null, L => { parade(L); const me = meCatch(L, -.9); babyOn(me, L); breeze(me, L.T, 2.6, 16); orbit(V(CATCH.x, 5.2, CATCH.z), 13, PI / 2 + .3, -.12, 46); sh(CATCH, 14); }, [[0, 'wind', .6], [.2, 'cloth', .5]]);
shot(111.74, 'I', 'slow', L => { parade(L); const me = meCatch(L, -.9); babyOn(me, L); breeze(me, L.T, 2.6, 16); const h = hp(me); cam([h.x + 4.5, 1.4, h.z - 6], [h.x, h.y - 1, h.z], 46); sh(CATCH, 14); }, []);
// 85 «Die ganze Stadt hielt den Atem an.»: todos congelados con la boca abierta; Glanz también
shot(112.58, 'F', null, L => { parade(L, { gPose: GEST.shock, gFace: { expr: 'shock', mouth: 'o' } }); crowdAt(L, CATCH.x + 4, CATCH.z, 16, 7, 22, 49, { mode: 'shock', face: V(CATCH.x, 0, CATCH.z) }); const me = meCatch(L, -.9); babyOn(me, L);
  orbit(V(CATCH.x + 3, 4, CATCH.z), lerp(28, 25, L.k), PI / 2 - .35, .25, 48); sh(CATCH, 30); }, [[0, 'gasp', .6], [.3, 'silence_tick', .4]]);
shot(113.36, 'S', null, L => { const g = parade(L, { gPose: GEST.shock, gFace: { expr: 'shock', eyes: 'wide', mouth: 'o' } }); onFace(g, 7, .2, .4, 40, L.k, 6); sh(FL, 14); }, [[0, 'gulp', .5]]);
// 86 «Mein Meter sprang auf hundertachtzig.»: la aguja se pasa de rosca; la placa ICH 180 echa chispas
shot(114.55, 'C', 'punch', L => { town(L); const v = lerp(98, 180, easeOut(clamp(L.lt / .6))); METER.userData.set(Math.min(v, 150) + Math.sin(L.T * 60) * 3 * (v > 150), 'ICH'); METER.userData.set(v > 150 ? 150 : v, 'ICH'); orbit(V(-6, 51, -91), 27, .1, .05, 44); SHAKE = .4; sh(V(-6, 40, -91), 30); }, [[0, 'riser_short', .6], [.5, 'sparks', .6]]);
shot(115.45, 'W', null, L => { town(L); METER.userData.set(150, 'ICH'); METER.children.forEach(c => { if (c.userData && c.userData.set) {} }); const p = METER.position; badge('red', '180', W / 2, H * .14, L.lt * 4, 1, 1.4); dust(V(p.x, p.y - 10, p.z + 2), L.t0, L.T, 10, .7); grade.uniforms.flash.value = Math.max(0, Math.sin(L.T * 25)) * .1;
  orbit(V(-6, 50, -91), lerp(30, 27, L.k), -.2, .05, 44); SHAKE = .3; sh(V(-6, 40, -91), 30); }, [[0, 'alarm', .6], [.2, 'glass_crack', .5]]);
// 87 «Das Baby auf neunzig.»: el bebé, gafas de sol puestas, su placa 90
shot(116.40, 'F', null, L => { parade(L); const me = meCatch(L, -.9); const b = babyOn(me, L); attach(SHADES, b.head, [0, .9, .72], [0, 0, 0], 1.25); cara(b, L.T, { expr: 'smug', mouth: 'smirk' }); mtag(b, 'BABY', 90, (L.lt - .1) * 3, 2.6);
  const p = hp(b); cam([p.x + 4.4, p.y + .4, p.z - 5.6], [p.x, p.y - .8, p.z], 42); sh(CATCH, 12); }, [[0, 'pling', .5], [.3, 'baby_gasp', .4]]);
shot(117.10, 'C', null, L => { parade(L); const me = meCatch(L, 0); const b = babyOn(me, L); attach(SHADES, b.head, [0, .9, .72], [0, 0, 0], 1.25); cara(b, L.T, { expr: 'smug', mouth: 'smirk' }); cara(me, L.T, { expr: 'joy', mouth: 'grin' }); mtag(me, 'ICH', 180, 1); orbit(V(CATCH.x, 5.4, CATCH.z), 11.5, PI / 2 + .5, .05, 44); sh(CATCH, 12); }, [[0, 'cheer', .3]]);
// 88 «Sirenen,»: luces rojas y azules, soldados corriendo
shot(117.80, 'W', null, L => { parade(L); const r = Math.sin(L.T * 18) > 0; TINT = r ? 'rgba(255,30,40,.18)' : 'rgba(30,80,255,.18)'; for (let i = 0; i < 4; i++) { const c = put(SOL[i], CATCH.x + 16 - L.lt * 8 + (i % 2) * 2, 0, CATCH.z + (i - 1.5) * 3, -PI / 2); actuar(c, 0, [[0, runP(L.T, i)]], { T: L.T }); cara(c, L.T + i, { expr: 'determined', eyes: 'angry' }); }
  cam([CATCH.x + 4, 5, CATCH.z + 16], [CATCH.x + 12, 3, CATCH.z], 46); sh(V(CATCH.x + 12, 0, CATCH.z), 24); }, [[0, 'siren', .7], [.2, 'steps_run', .5]]);
// 89 «Hubschrauber,»: dos helicópteros sobre los tejados
shot(118.50, 'S', null, L => { town(L); for (let k = 0; k < 2; k++) { show(HELI[k], CATCH.x + 18 + k * 16, 26 + k * 4 + Math.sin(L.T * 2 + k), CATCH.z - 10 + k * 14, -PI / 2 + .3); HELI[k].userData.spin(L.T); HELI[k].userData.sp.intensity = 400; }
  cam([CATCH.x - 2, 6, CATCH.z - 12], [CATCH.x + 26, 26, CATCH.z + 2], 50); sh(V(CATCH.x + 20, 0, CATCH.z), 40); }, [[0, 'heli', .8]]);
// 90 «sieben rote Punkte auf meiner Stirn.»: aparecen uno a uno
shot(119.26, 'C', 'punch', L => { parade(L); const me = meCatch(L, 0); babyOn(me, L); cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); onFace(me, 6.6, .3, 0, 40, L.k, 5.8); dots(me, Math.min(7, 1 + Math.floor(L.lt / .1)), L.T); badge('red', String(Math.min(7, 1 + Math.floor(L.lt / .1))), W * .82, H * .2, 1, 1, .9); sh(CATCH, 12); }, [[0, 'blink', .5], [.2, 'blink', .4], [.4, 'blink', .4], [.6, 'blink', .4]]);
shot(120.08, 'Z', null, L => { parade(L); const me = meCatch(L, 0); babyOn(me, L); cara(me, L.T, { expr: 'worried', eyes: 'up', mouth: 'grimace' }); sweat(me, L.T); dots(me, 7, L.T); const h = hp(me); const a = me.root.rotation.y; cam([h.x + Math.sin(a) * 4.4, h.y + 2.2, h.z + Math.cos(a) * 4.4], [h.x, h.y + .5, h.z], 38); badge('red', '7', W / 2, H * .15, 1, 1, 1.1); sh(CATCH, 12); }, [[0, 'heartbeat', .6]]);
// 91 «Einer davon gehörte der Robbe.»: francotiradores en los tejados… y la Robbe con su fusil
shot(120.96, 'W', null, L => { town(L); for (let i = 0; i < 3; i++) soldat(i, [-13, -8, -3][i], 23.3, -86, .5, L.T, { laser: 90, rifle: i }); cm([2, 30, -62, -8, 25, -86, 46], [1, 29.5, -63, -8, 25, -86, 46], L.k); sh(V(-6, 23, -86), 20); }, [[0, 'click_set', .6], [.3, 'click_set', .5]]);
shot(121.84, 'C', 'punch', L => { town(L); const r = robbe(20, 23.3, -86, .5, L.T, { headX: .1 }); attach(RIF[3], r.fl[1], [-.2, -.8, .6], [PI / 2, 0, 0], 1.1); RIF[3].userData.laser.visible = true; RIF[3].userData.laser.scale.y = 80; r.eyes[0].scale.y = .15;
  orbit(V(20, 27, -86), lerp(11, 9.5, L.k), .25, .05, 42); badge('gold', 'ROBBE', W / 2, H * .15, (L.lt - .1) * 3); sh(V(20, 23, -86), 12); }, [[0, 'toy', .6], [.2, 'click_metal', .5]]);
// 92 «Glanz schrie:»
shot(122.49, 'S', null, L => { const g = parade(L, { gPose: { ...GEST.point, aRx: 2.2 }, gFace: { expr: 'angry', eyes: 'angry', mouth: 'scream' } }); orbit(V(FLTOP.x, FLTOP.y + 3.2, FLTOP.z), lerp(15, 13, L.k), .35, .05, 44); sh(FL, 16); }, [[0, 'shout_m', .5]]);
// 93 «„Niemand ist cooler als ich!»: primer plano gritando, venas, saliva
shot(123.27, 'C', 'punch', L => { const g = parade(L, { gPose: { aLx: 1.0, aRx: 1.0, aLz: .4, aRz: .4, aLe: 2.0, aRe: 2.0, lean: .2 }, gFace: { expr: 'angry', eyes: 'angry', mouth: 'scream' } }); onFace(g, 6.4, 0, .2, 40, L.k, 5.4); SHAKE = .25; sh(FL, 12); }, [[0, 'impact', .6], [.1, 'shout_crowd', .3]]);
shot(124.11, 'R', null, L => { const g = parade(L, { gPose: { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, lean: -.1, headX: -.3 }, gFace: { expr: 'angry', eyes: 'angry', mouth: 'scream' } }); orbit(V(FLTOP.x, FLTOP.y + 3.6, FLTOP.z), 12, -.4, -.25, 46); sh(FL, 14); }, [[0, 'evil_laugh', .3]]);
// 94 «Feuer!»: todos disparan — destello
shot(124.99, 'F', 'punch', L => { town(L); for (let i = 0; i < 3; i++) soldat(i, [-13, -8, -3][i], 23.3, -86, .5, L.T, { laser: 90, rifle: i }); grade.uniforms.flash.value = L.lt < .06 ? .45 : 0; cm([2, 30, -62, -8, 25, -86, 46], [2, 30, -62, -8, 25, -86, 42], L.k); sh(V(-6, 23, -86), 20); }, [[0, 'impact', .9], [.03, 'boom', .6]]);
// 95 «dann krachte ein Donner über dem Dom,»: el cielo se oscurece, rayo sobre el Dom
shot(125.63, 'C', null, L => { town(L, 'storm'); const t = DTOP(); BOLT.visible = true; BOLT.position.set(t.x, t.y + 46, t.z); BOLT.scale.setScalar(5); grade.uniforms.flash.value = L.lt < .06 ? .45 : 0; RAIN.update(L.T, t.clone().add(V(0, -40, 30)), 60, 60, 60, true); orbit(V(t.x, t.y - 30, t.z), 150, .2, .05, 50); sh(t, 80); }, [[0, 'thunder', 1]]);
shot(126.47, 'W', null, L => { town(L, 'storm'); const t = DTOP(); crowdAt(L, CATCH.x + 10, CATCH.z, 14, 4, 20, 51, { mode: 'point', face: t }); const me = meCatch(L, 0); babyOn(me, L); cara(me, L.T, { expr: 'shock', mouth: 'o' }); me.root.rotation.y = faceTo(V(CATCH.x, 0, CATCH.z), t);
  cam([CATCH.x - 4, 3, CATCH.z + 14], [t.x, t.y - 30, t.z], 52); sh(V(CATCH.x, 0, CATCH.z), 30); }, [[0, 'gasp', .5], [.2, 'wind_howl', .4]]);
// 96 «und die Wolken öffneten sich in einem perfekten Kreis.»
shot(127.37, 'Z', null, L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), .4 + L.k * .3); orbit(V(t.x, t.y - 20, t.z), 170, .3, .25, 50); sh(t, 60); }, [[0, 'wind_rise', .6]]);
shot(128.45, 'F', null, L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), .6 + L.k * .4); cam([t.x + 3, t.y + 170, t.z + 8], [t.x, t.y, t.z], 50); sh(t, 60); }, [[0, 'sunrise_shine', .6], [.4, 'choir', .5]]);
cut(129.03, null, [0, 0.7, 0], [[0, 'whoosh_soft', .4]]);
// 97 «Oben auf der Spitze,»: la cámara sube por la aguja hasta la figura
shot(130.24, 'S', null, L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), 1); const c = opaCool(t.x, t.y, t.z, 0, L.T); DARK = .35; auraOn(c, L.T, .9); cm([t.x + 4, t.y - 40, t.z + 26, t.x, t.y - 20, t.z, 50], [t.x + 4, t.y + 2, t.z + 18, t.x, t.y + 3, t.z, 46], L.k); sh(t, 30); }, [[0, 'swoosh_up', .6]]);
// 98 «mit verschränkten Armen»: brazos cruzados, contraluz
shot(131.30, 'C', null, L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), 1); const c = opaCool(t.x, t.y, t.z, 0, L.T); DARK = .3; auraOn(c, L.T); const h = hp(c); cam([h.x + 2.4, h.y - 1.2, h.z + 8], [h.x, h.y - .4, h.z], 42); sh(t, 14); }, [[0, 'cloth', .5]]);
// 99 «und wehendem Mantel,»: el abrigo ondea, plano lateral
shot(132.20, 'W', null, L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), 1); const c = opaCool(t.x, t.y, t.z, 0, L.T, { wind: 1.8 }); DARK = .25; auraOn(c, L.T); orbit(V(t.x, t.y + 2.6, t.z), 13, .55, .02, 44); sh(t, 14); }, [[0, 'wind', .6], [.2, 'cloth', .5]]);
cut(132.84, null, [-0.9, 1, 0], [[0, 'cloth', .4]]);
// 100 «stand Opa.» (zoom lento): la cara de Opa a la luz — ¡es él!
shot(133.46, 'I', 'slow', L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), 1); const c = opaCool(t.x, t.y, t.z, 0, L.T, { eyes: 'half' }); auraOn(c, L.T, 1.2); onFace(c, 7, .2, 0, 40, L.k, 5.4); badge('gold', 'OPA?!', W / 2, H * .15, (L.lt - .3) * 3, 1, 1.1); sh(t, 14); }, []);
// 101 «Die Kugel blieb mitten in der Luft stehen,»: la bala llega… y se para delante de mi frente
const bulletAt = (me, d) => { const h = hp(me); const a = me.root.rotation.y; BUL.visible = true; BUL.position.set(h.x + Math.sin(a) * d, h.y + .95, h.z + Math.cos(a) * d); BUL.lookAt(h.x, h.y + .95, h.z); return BUL.position.clone(); };
shot(134.27, 'Z', null, L => { town(L, 'storm'); STORM.visible = true; STORM.userData.at(V(DOMX, 172, DOMZ - 10), 1); const me = meCatch(L, 0); babyOn(me, L); const p = bulletAt(me, lerp(20, 2.2, easeOut(L.k))); const h = hp(me); cam([h.x + Math.sin(me.root.rotation.y) * 9 + 3, h.y + 1.6, h.z + Math.cos(me.root.rotation.y) * 9], [h.x, h.y + .2, h.z], 42); sh(CATCH, 14); }, [[0, 'whoosh', .6]]);
shot(134.97, 'C', 'punch', L => { town(L, 'storm'); const me = meCatch(L, 0); babyOn(me, L); cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); const p = bulletAt(me, 2.2 + Math.sin(L.T * 30) * .03); BUL.userData.trail.visible = false; const h = hp(me);
  { const a = me.root.rotation.y; cam([(p.x + h.x) / 2 + (Math.sin(a) * .8 - Math.cos(a)) * 7, h.y + 1.2, (p.z + h.z) / 2 + (Math.cos(a) * .8 + Math.sin(a)) * 7], [(p.x + h.x) / 2, h.y + .1, (p.z + h.z) / 2], 42); } badge('gold', 'STOPP', W / 2, H * .15, (L.lt - .2) * 3); sh(CATCH, 12); }, [[0, 'freeze', .7], [.2, 'tick', .4]]);
// 102 «drehte um»: la bala gira 180°
shot(136.21, 'R', null, L => { town(L, 'storm'); const me = meCatch(L, 0); babyOn(me, L); cara(me, L.T, { expr: 'shock', mouth: 'o' }); const p = bulletAt(me, 2.2); BUL.userData.trail.visible = false; BUL.rotateY(PI * easeInOut(clamp(L.lt / .5))); const h = hp(me);
  { const a = me.root.rotation.y; cam([(p.x + h.x) / 2 + (Math.sin(a) * .8 - Math.cos(a)) * 7, h.y + 1.2, (p.z + h.z) / 2 + (Math.cos(a) * .8 + Math.sin(a)) * 7], [(p.x + h.x) / 2, h.y + .1, (p.z + h.z) / 2], 42); } sh(CATCH, 12); }, [[0, 'whirl', .6]]);
// 103 «und flog direkt zurück zu den Scharfschützen.»: vuelve a los tejados; los francotiradores caen
shot(136.93, 'W', null, L => { town(L, 'storm'); const a = V(CATCH.x + 2, 8, CATCH.z), b = V(-6, 26, -86); const p = a.clone().lerp(b, L.k); BUL.visible = true; BUL.position.copy(p); BUL.lookAt(b); BUL.scale.setScalar(3); cam([p.x - 6, p.y + 3, p.z + 10], [p.x + (b.x - a.x) * .05, p.y, p.z + (b.z - a.z) * .05], 50); sh(p, 30); }, [[0, 'whoosh', .7]]);
shot(137.81, 'F', 'punch', L => { town(L, 'storm'); const q = clamp((L.lt - .08) / .3); const c = soldat(0, 8, 23.3, -86, .25, L.T, { rifle: 0, pose: q > 0 ? { ...GEST.recoil, crouch: .3 * q } : AIM, expr: q > 0 ? 'shock' : 'determined', eyes: q > 0 ? 'terror' : 'squint', mouth: q > 0 ? 'scream' : 'flat' }); c.root.rotation.x = -q * .3; if (q >= 1) dizzy(c, L.T);
  const s2 = soldat(1, 13, 23.3, -88, .15, L.T, { rifle: 1, pose: q > 0 ? GEST.shock : AIM, expr: q > 0 ? 'shock' : 'determined', mouth: q > 0 ? 'o' : 'flat' }); grade.uniforms.flash.value = L.lt < .08 ? .5 : 0;
  cm([17, 28.4, -73, 9.5, 26, -86, 46], [16, 28, -74, 9.5, 26, -86, 44], L.k); sh(V(9, 23, -86), 16); }, [[0, 'impact', .7], [.12, 'thud', .5], [.24, 'thud', .5]]);
// 104 «Die Rakete machte eine Kehrtwende»: el cohete del helicóptero da la vuelta en U
const HP = V(CATCH.x + 34, 30, CATCH.z + 10);
const uturn = u => { const a = HP.clone().add(V(-2, -2, 0)); if (u < .5) { const k = u / .5; return a.clone().lerp(V(CATCH.x + 6, 10, CATCH.z + 4), k); } const k = (u - .5) / .5; const c = V(CATCH.x + 6, 10, CATCH.z + 4); const ang = k * PI; return V(c.x + Math.sin(ang) * 6 * (1 - k) + (HP.x - c.x) * k * k, c.y + (HP.y - c.y) * k, c.z + Math.cos(ang) * 6 - 6 + (HP.z - c.z) * k); };
shot(138.89, 'S', null, L => { town(L, 'storm'); show(HELI[0], HP.x, HP.y, HP.z, -PI / 2); HELI[0].userData.spin(L.T); rocketPath(0, uturn, .1 + L.k * .4); const p = ROCK[0].position; cam([CATCH.x - 8, 6, CATCH.z + 22], [p.x, p.y, p.z], 48); sh(CATCH, 30); }, [[0, 'ignite', .6], [.1, 'whoosh', .6]]);
shot(139.63, 'R', null, L => { town(L, 'storm'); show(HELI[0], HP.x, HP.y, HP.z, -PI / 2); HELI[0].userData.spin(L.T); rocketPath(0, uturn, .5 + L.k * .35); const p = ROCK[0].position; cam([p.x - 4, p.y + 5, p.z + 14], [p.x, p.y, p.z], 46); badge('gold', 'U-TURN', W / 2, H * .15, (L.lt - .2) * 3); sh(p, 30); }, [[0, 'whoosh_up', .6]]);
// 105 «und knallte in ihren eigenen Hubschrauber.»
shot(140.55, 'W', null, L => { town(L, 'storm'); show(HELI[0], HP.x, HP.y, HP.z, -PI / 2); HELI[0].userData.spin(L.T); rocketPath(0, uturn, .85 + L.k * .15); cam([HP.x - 22, HP.y - 4, HP.z + 22], [HP.x, HP.y, HP.z], 46); sh(HP, 30); }, [[0, 'whoosh', .6]]);
shot(141.33, 'C', 'punch', L => { town(L, 'storm'); boom(0, HP, L.t0, L.T, 2.6); boom(1, HP.clone().add(V(4, -4, 2)), L.t0 + .3, L.T, 1.8); if (L.lt < .1) { show(HELI[0], HP.x, HP.y, HP.z, -PI / 2); } cam([HP.x - 34, HP.y - 10, HP.z + 34], [HP.x, HP.y, HP.z], 50); SHAKE = .5; sh(HP, 40); }, [[0, 'explosion', 1], [.3, 'boom', .7], [.6, 'rubble', .5]]);
// 106 «Nur die Robbe überlebte.»: la Robbe baja en paracaídas entre el humo
const CHUTE = (() => { const g = new THREE.Group(); scene.add(g); const c = new THREE.Mesh(new THREE.SphereGeometry(5, 20, 10, 0, 6.283, 0, 1.2), mat(0xff8a3a, { roughness: .6, side: THREE.DoubleSide })); c.position.y = 9; g.add(c); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; const l = cyl(.04, .04, 8, mat(0xffffff), 4, g, Math.cos(a) * 2.2, 5, Math.sin(a) * 2.2); l.rotation.set(Math.sin(a) * .5, 0, -Math.cos(a) * .5); } outline(g, 1); g.visible = false; PROPS.push(g); return g; })();
shot(142.54, 'F', null, L => { town(L, 'storm'); const y = 24 - L.lt * 6; const r = robbe(CATCH.x + 16, y, CATCH.z, -PI / 2 + .4, L.T, { headX: -.1 }); show(CHUTE, CATCH.x + 16, y, CATCH.z, 0); dust(V(HP.x, HP.y - 8, HP.z), L.t0 - .4, L.T, 10, 2); orbit(V(CATCH.x + 16, y + 4, CATCH.z), 20, -.6, .05, 46); sh(V(CATCH.x + 16, 0, CATCH.z), 20); }, [[0, 'whoosh_soft', .5], [.3, 'wind', .4]]);
cut(143.14, null, [0.6, 0.9, 0], [[0, 'swipe', .4]]);
// 107 «Sie klatschte einfach.»: aterriza y aplaude con las aletas
shot(143.80, 'C', 'punch', L => { town(L, 'storm'); const r = robbe(CATCH.x + 8, 0, CATCH.z, -PI / 2 + .4, L.T, { clap: 1, rate: 10 }); orbit(V(CATCH.x + 8, 3.4, CATCH.z), lerp(10, 9, L.k), -PI / 2 + .6, .05, 42); sh(V(CATCH.x + 8, 0, CATCH.z), 12); }, [[0, 'clap', .6], [.25, 'clap', .6], [.5, 'clap', .6], [.75, 'clap', .6]]);
// ---------- d: Glanz dispara a Opa, el cohete da la vuelta a la ciudad, la estatua, ∞, la Robbe alcaldesa, Papa en chanclas, mi pelo (145,02 – 175,2 s) ----------
const GL = V(-6, 0, -30);   // Glanz en la plaza (delante de la carroza)
const glanzLaunch = (L, aim, o = {}) => { town(L, 'storm'); STORM.visible = true; STORM.userData.at(V(DOMX, 172, DOMZ - 10), 1); const g = put(glanz, GL.x, 0, GL.z, faceTo(GL, DTOP()) + (o.dry || 0));
  actuar(g, 0, [[0, aim ? { aRx: 2.0, aRz: -.1, aRe: .2, aLx: 1.9, aLz: -.4, aLe: .5, headX: -.2, lean: -.1 } : { aRx: 1.0, aRe: 1.0, aLx: 1.0, aLe: 1.0 }]], { T: L.T }); cara(g, L.T, o.face || { expr: 'angry', eyes: 'angry', mouth: 'grimace' });
  attach(LAUNCH, g.aR.hand, [0, -.6, .2], [PI / 2 - .35, 0, 0], 1.05); return g; };
const tp = () => DTOP().add(V(0, 3.4, 0));
// trayectoria: de Glanz a Opa, vuelta alrededor de Opa, vuelta a la ciudad, persecución por la calle, estatua
const R1 = u => { const a = V(GL.x, 6, GL.z), b = tp(); return a.clone().lerp(b, u).add(V(0, Math.sin(u * PI) * 20, 0)); };
const orbitOpa = u => { const t = tp(); const a = u * PI * 2 + PI * .75; return V(t.x + Math.sin(a) * 7, t.y + Math.sin(u * PI) * 2, t.z + Math.cos(a) * 7); };
const lap = u => { const t = tp(); const a = u * PI * 1.6; return V(lerp(t.x, 0, u) + Math.cos(a) * 60, lerp(t.y, 40, u), lerp(t.z, -20, u) + Math.sin(a) * 60); };
// 108 «Also schnappte sich Glanz selbst»: le arranca el lanzacohetes a un soldado
shot(145.02, 'W', null, L => { town(L, 'storm'); const k = clamp(L.lt / .5); const g = put(glanz, GL.x, 0, GL.z, .6); actuar(g, 0, [[0, { aRx: lerp(1.2, 1.6, k), aRz: -.3, aRe: .3, lean: .1 }]], { T: L.T }); cara(g, L.T, { expr: 'angry', eyes: 'angry', mouth: 'grimace' }); const s = put(SOL[4], GL.x + 3.6, 0, GL.z + 2.4, -2.2); actuar(s, 0, [[0, GEST.shock]], { T: L.T }); cara(s, L.T, { expr: 'shock', mouth: 'o' });
  attach(LAUNCH, k < .6 ? s.aR.hand : g.aR.hand, [0, -.6, .2], [PI / 2, 0, 0], 1.05); orbit(V(GL.x + 1.8, 4, GL.z + 1.2), 15, -.4, .1, 44); sh(GL, 14); }, [[.3, 'grab', .6], [.4, 'metal_hit', .4]]);
// «einen Raketenwerfer»: se lo apoya al hombro, apunta hacia el Dom
shot(146.06, 'C', 'punch', L => { const g = glanzLaunch(L, true); orbit(V(GL.x, 4.6, GL.z), 12, g.root.rotation.y - 1.25, .08, 44); badge('red', 'RAKETENWERFER', W / 2, H * .15, (L.lt - .2) * 3, 1, .85); sh(GL, 12); }, [[0, 'click_set', .7], [.4, 'ratchet', .5]]);
cut(146.62, null, [0.7, 1, 0], [[0, 'tick', .4]]);
// 109 «und schoss auf Opa.»: ¡fuego! el cohete sale hacia la aguja
shot(147.32, 'F', null, L => { const g = glanzLaunch(L, true); rocketPath(0, R1, L.k * .35); grade.uniforms.flash.value = L.lt < .1 ? .4 : 0; orbit(V(GL.x, 5, GL.z), 18, faceTo(GL, DTOP()) + 1.1, .15, 48); sh(GL, 20); }, [[0, 'ignite', .8], [.1, 'whoosh', .7]]);
cut(147.96, null, [0.5, 1.1, 0], [[0, 'pling', .4]]);
// 110 «Opa bewegte sich nicht.»: Opa tranquilo; el cohete se acerca por detrás de la cámara
shot(148.69, 'S', null, L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), 1); const c = opaCool(t.x, t.y, t.z, faceTo(t, GL), L.T); auraOn(c, L.T); rocketPath(0, R1, .6 + L.k * .3); onFace(c, 7.6, .4, .8, 42, L.k, 6.6); sh(t, 14); }, [[0, 'whoosh', .5], [.4, 'wind', .4]]);
cut(149.48, null, [0.6, 1, 0], [[0, 'whoosh_soft', .4]]);
// 111 «Die Rakete flog um ihn herum,»: órbita alrededor de Opa con estela
shot(150.01, 'Z', null, L => { town(L, 'storm'); const t = DTOP(); STORM.visible = true; STORM.userData.at(V(t.x, t.y + 40, t.z), 1); const c = opaCool(t.x, t.y, t.z, faceTo(t, GL), L.T); auraOn(c, L.T); rocketPath(0, orbitOpa, L.k * .95, 18); orbit(V(t.x, t.y + 3, t.z), 22, faceTo(t, GL) + .4, .25, 46); sh(t, 20); }, [[0, 'whoosh', .6], [.6, 'whoosh_soft', .5]]);
cut(150.85, null, [1.2, 1, 0], [[0, 'cloth', .4]]);
// 112 «drehte eine Runde über die Stadt»: vista aérea, el cohete da la vuelta a Glanzheim
shot(151.66, 'W', null, L => { town(L, 'storm'); rocketPath(0, lap, .1 + L.k * .8, 22); const p = ROCK[0].position; cam([20, 150, 120], [p.x * .5, 20, p.z * .5 - 30], 52); sh(V(0, 0, -40), 120); }, [[0, 'whoosh_up', .6], [.4, 'jet', .4]]);
// 113 «und jagte den Bürgermeister die Straße entlang,»: Glanz corre aterrorizado, el cohete detrás
const chase = u => V(26, 6 - u * 3, 60 - u * 70);
shot(152.82, 'C', null, L => { town(L); const z = 50 - L.lt * 9; const g = put(glanz, 26, 0, z, PI); actuar(g, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' }); sweat(g, L.T); rocketPath(0, u => V(26, 5.5, z + 10 - u * .2), .5);
  orbit(V(26, 3.6, z), 16, PI - .25, .12, 46); sh(V(26, 0, z), 20); }, [[0, 'steps_run', .6], [.1, 'scream_girl', .3]]);
shot(153.66, 'S', null, L => { town(L); const z = 42 - L.lt * 9; const g = put(glanz, 26, 0, z, PI); actuar(g, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' }); rocketPath(0, u => V(26, 5, z + 7 + Math.sin(L.T * 9) * .4 - u), .5);
  crowdAt(L, 26, z, 8, 8, 18, 53, { mode: 'point' }); orbit(V(26, 4, z + 3), 24, -.7, .18, 48); sh(V(26, 0, z), 24); }, [[0, 'run_cobble', .6], [.4, 'whoosh', .5]]);
shot(154.34, 'R', null, L => { town(L); const z = 36 - L.lt * 10; const g = put(glanz, 26, 0, z, PI); actuar(g, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' }); rocketPath(0, u => V(26, 4.8, z + 6 - u), .5);
  const h = hp(g); cam([h.x + 2.6, h.y + 1, h.z - 10.5], [h.x, h.y - 1.2, h.z], 44); sh(V(26, 0, z), 14); }, [[0, 'scream_girl', .4]]);
// 114 «direkt in seine eigene riesige Goldstatue.»: corre hacia la estatua… el cohete impacta
shot(155.18, 'W', null, L => { town(L); const k = L.k; const p = V(lerp(24, STX + 1, k), 0, lerp(-10, STZ + 7, k)); const g = put(glanz, p.x, 0, p.z, faceTo(p, V(STX, 0, STZ))); actuar(g, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' }); put(STAT, STX, 6, STZ, 0);
  orbit(V(STX + 2, 8, STZ + 8), lerp(44, 38, k), .2, .15, 50); sh(V(STX, 0, STZ), 40); }, [[0, 'run_cobble', .5]]);
shot(156.25, 'C', 'punch', L => { town(L); const g = put(glanz, STX + 1, 0, STZ + 7, PI); actuar(g, 0, [[0, GEST.cower]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' }); put(STAT, STX, 6, STZ, 0); if (L.lt < .3) rocketPath(0, u => V(STX + 30 - u * 30, 20 - u * 4, STZ + 20 - u * 20), L.lt / .3); else boom(0, V(STX, 14, STZ + 3), L.t0 + .3, L.T, 1.8);
  orbit(V(STX, 10, STZ), 40, -.3, .15, 50); SHAKE = L.lt > .3 ? .5 : 0; sh(V(STX, 0, STZ), 40); }, [[.3, 'explosion', 1], [.4, 'metal_rip', .6]]);
cut(156.79, null, [-.5, 1, 0], [[0, 'swipe', .4]]);
// 115 «Der Kopf fiel ab»: la cabeza dorada se tambalea y cae
shot(157.69, 'S', null, L => { town(L); put(STAT, STX, 6, STZ, 0); STATHEAD.visible = false; const k = clamp(L.lt / 1.0); const top = V(STX, 6 + 4.15 * 3.1 + .3, STZ); const p = top.clone().lerp(V(STX + .5, 0, STZ + 7), easeIn(k)); show(GHEAD, p.x, p.y, p.z, 0, 3.1); GHEAD.rotation.set(k * 1.2, 0, k * .4);
  const g = put(glanz, STX + 1, 0, STZ + 7, PI); actuar(g, 0, [[0, GEST.cower]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'up', mouth: 'scream' }); dust(V(STX, 6, STZ), L.t0 - .3, L.T, 8, 1.4); orbit(V(STX, 12, STZ + 2), 36, .3, .1, 50); sh(V(STX, 0, STZ), 40); }, [[0, 'metal_creak', .6], [.5, 'whoosh_down', .6]]);
// 116 «und machte ihn platt»: ¡PLAF!
shot(158.85, 'C', 'punch', L => { town(L); put(STAT, STX, 6, STZ, 0); STATHEAD.visible = false; show(GHEAD, STX + .5, 2.2, STZ + 7, 0, 3.1); GHEAD.rotation.set(1.2, 0, .4); const g = put(glanz, STX + 2.6, 0, STZ + 9.4, PI); g.root.scale.set(1.3, .12, 1.4); dust(V(STX, 0, STZ + 7), L.t0, L.T, 14, 1.6);
  orbit(V(STX + 1, 3, STZ + 8), 18, .4, .25, 46); SHAKE = L.lt < .2 ? .7 : 0; badge('red', 'PLATT!', W / 2, H * .17, (L.lt - .1) * 4, 1, 1.2); sh(V(STX, 0, STZ + 7), 20); }, [[0, 'slam', 1], [.1, 'rubble', .6]]);
// «wie ein Schnitzel.»: Glanz aplastado como un escalope (vista cenital, piernas asomando)
shot(159.69, 'Z', null, L => { town(L); show(GHEAD, STX + .5, 2.2, STZ + 7, 0, 3.1); GHEAD.rotation.set(1.2, 0, .4); const g = put(glanz, STX + 2.6, .1, STZ + 9.4, PI); g.root.scale.set(1.3, .12, 1.4); cara(g, L.T, { expr: 'confused', eyes: 'closed', mouth: 'wavy' }); crowdAt(L, STX, STZ + 9, 10, 7, 16, 55, { mode: 'point', face: V(STX, 0, STZ + 9) });
  cam([STX + 3, 22, STZ + 16], [STX + 1.5, 0, STZ + 8.5], 46); badge('gold', 'SCHNITZEL', W / 2, H * .17, (L.lt - .2) * 3, 1, 1); sh(V(STX, 0, STZ + 8), 20); }, [[0, 'pan_sizzle', .5], [.3, 'laugh_m', .4]]);
// 117 «Der Aura-Meter versuchte es nicht einmal mehr.»: la aguja da vueltas, chispas
shot(160.69, 'W', null, L => { town(L); METER.userData.set(75 + Math.sin(L.T * 30) * 75, 'OPA'); dust(V(-6, 46, -89), L.t0, L.T, 8, .8); grade.uniforms.flash.value = Math.max(0, Math.sin(L.T * 22)) * .1; orbit(V(-6, 49, -91), lerp(36, 32, L.k), .2, .05, 44); SHAKE = .25; sh(V(-6, 40, -91), 30); }, [[0, 'sparks', .6], [.3, 'glitch', .5]]);
shot(161.91, 'C', null, L => { town(L); const t = DTOP(); const c = opaCool(t.x, t.y, t.z, faceTo(t, GL), L.T, { wind: .8 }); mtag(c, 'OPA', Math.round(150 + L.lt * 900), 1); orbit(V(t.x, t.y + 3.2, t.z), 15, faceTo(t, GL) + .3, .05, 44); sh(t, 14); }, [[0, 'riser_short', .5]]);
// 118 «Er zeigte nur noch: unendlich.» (zoom lento): la placa OPA ∞
shot(162.78, 'F', 'slow', L => { town(L); METER.userData.set(150, 'OPA', 'inf'); orbit(V(-6, 48, -91), lerp(36, 28, L.k), -.1, .02, 44); sh(V(-6, 40, -91), 30); }, [[0, 'choir', .5]]);
shot(163.79, 'C', 'punch', L => { town(L); METER.userData.set(150, 'OPA', 'inf'); const t = DTOP(); const c = opaCool(t.x, t.y, t.z, faceTo(t, GL), L.T, { wind: .8 }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); onFace(c, 7, .2, .3, 40, L.k, 6); badge('gold', '∞', W / 2, H * .15, (L.lt - .2) * 3, 1, 1.6); sh(t, 14); }, [[0, 'ding_reveal', .7]]);
// 119 «Jetzt ist Aura-Farmen Pflicht,»: todo el pueblo posando chulo; cartel nuevo PFLICHT
const PF = (() => { const p = plakat(scene, 'AURA-FARMEN', 'PFLICHT!', 10, 5, '#1aa04a'); p.visible = false; PROPS.push(p); return p; })();
shot(164.62, 'W', null, L => { town(L); crowdAt(L, P0.x, P0.z + 10, 20, 4, 22, 57, { mode: 'cheer' }); EX.slice(0, 8).forEach((c, i) => { if (c.root.visible) { actuar(c, 0, [[0, COOL]], { T: L.T }); cara(c, L.T + i, { expr: 'smug', mouth: 'smirk' }); } }); show(PF, P0.x, 9, P0.z + 2, 0);
  orb(L.k, V(P0.x, 6, P0.z + 6), null, [34, .05, .2, 50], [30, -.05, .18, 50]); sh(V(P0.x, 0, P0.z + 6), 30); }, [[0, 'cheer', .6], [.3, 'stamp', .5]]);
shot(165.76, 'C', 'punch', L => { town(L); show(PF, P0.x, 9, P0.z + 2, 0); const c = put(EX[16], P0.x, 0, P0.z + 6, 0); actuar(c, 0, [[0, FARM]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); orbit(V(P0.x, 5.2, P0.z + 5), 19, .1, .08, 46); sh(P0, 14); }, [[0, 'impact', .6]]);
// 120 «und die Robbe ist unsere neue Bürgermeisterin.»: la Robbe en la escalinata del Rathaus con la cadena de alcalde, confeti
const CHAIN = (() => { const g = new THREE.Group(); scene.add(g); const gm = mat(0xe9c23a, { metalness: .9, roughness: .2, emissive: 0x5a4000, emissiveIntensity: .25 }); for (let i = 0; i < 13; i++) { const a = Math.PI + i / 12 * Math.PI; box(.3, .2, .12, gm, .04, g, Math.cos(a) * 1.2, Math.sin(a) * 1.0, 0); } const m = cyl(.5, .5, .12, gm, 18, g, 0, -1.1, 0); m.rotation.x = PI / 2; outline(g, 1); g.visible = false; PROPS.push(g); return g; })();
shot(166.12, 'S', null, L => { town(L); const r = robbe(-6, 3.6, -79, 0, L.T, { salute: 1 }); attach(CHAIN, r.body, [0, 3.6, 1.2], [0, 0, 0], 1); confRain(V(-6, 3.6, -76), L.T, 50, 16, 10, 14); crowdAt(L, -6, -64, 16, 3, 16, 59, { mode: 'cheer', face: V(-6, 4, -79) });
  orbit(V(-6, 7.6, -79), lerp(16, 13.5, L.k), -.2, .05, 44); sh(V(-6, 0, -79), 16); }, [[0, 'fanfare', .6], [.2, 'cheer', .5]]);
shot(167.22, 'Z', null, L => { town(L); const r = robbe(-6, 3.6, -79, 0, L.T, { clap: 1, bounce: 1 }); attach(CHAIN, r.body, [0, 3.6, 1.2], [0, 0, 0], 1); confRain(V(-6, 3.6, -76), L.T, 60, 16, 10, 14); fireworks(V(-6, 20, -100), L.T, 3, 14); badge('gold', 'BÜRGERMEISTERIN', W / 2, H * .15, (L.lt - .2) * 3, 1, .85);
  orbit(V(-6, 6.8, -79), lerp(11, 9.5, L.k), .25, .05, 42); sh(V(-6, 0, -79), 14); }, [[0, 'confetti', .5], [.3, 'firework', .5], [.6, 'clap', .5]]);
// 121 «Papa hat Opas Pose in Badelatschen probiert.»: Papa encima de la valla del jardín, brazos cruzados, en chanclas
const PW = V(20.5, 0, 100);   // valla delante de la casa (HAUS en (4, 0, 96))
const papaPose = (L, wob = 0, fall = 0) => { town(L); const c = put(papa, PW.x, 1.5 - fall * 1.2, PW.z, PI / 2); c.root.rotation.z = Math.sin(L.T * 9) * .12 * wob + fall * 1.2; actuar(c, 0, [[0, fall ? GEST.shock : { ...COOL, aLz: -.72 + Math.sin(L.T * 9) * .3 * wob }]], { T: L.T }); cara(c, L.T, fall ? { expr: 'shock', mouth: 'scream' } : { expr: wob ? 'worried' : 'smug', mouth: wob ? 'grimace' : 'smirk' });
  for (const l of [c.lL, c.lR]) l.shoe.material = SLIPM; return c; };
const SLIPM = mat(0x2a8ad8, { roughness: .5 });
shot(168.39, 'W', null, L => { const c = papaPose(L); orb(L.k, V(PW.x, 4.6, PW.z), null, [17, PI / 2 + .35, .1, 44], [15, PI / 2 + .2, .1, 44]); sh(PW, 18); }, [[0, 'whistle_inno', .4]]);
shot(169.45, 'F', null, L => { const c = papaPose(L, .3); const p = wpos(c.lL.kn); cm([p.x + 8, 2.2, p.z + 4.5, p.x, 1.2, p.z, 42], [p.x + 13, 5, p.z + 6.5, p.x, 3.6, p.z, 48], L.k); badge('gold', 'BADELATSCHEN', W / 2, H * .17, (L.lt - .2) * 3, 1, .9); sh(PW, 10); }, [[0, 'squeak', .5], [.4, 'squeak', .4]]);
cut(170.19, null, [-0.6, 1, 0], [[0, 'tick', .4]]);
// 122 «Er hielt drei Sekunden durch.»: tiembla… 3·2·1… y se cae al seto
shot(170.72, 'S', null, L => { const c = papaPose(L, 1); sweat(c, L.T); const n = 3 - Math.floor(L.lt / .2); badge('num', String(Math.max(1, n)), W / 2, H * .16, ((L.lt % .2) / .2) * 2 + .3, 1, 1.2); orbit(V(PW.x, 4.6, PW.z), 14, PI / 2 + .25, .1, 44); sh(PW, 16); }, [[0, 'tick', .5], [.2, 'tick', .5], [.4, 'tick', .5]]);
shot(171.32, 'C', 'punch', L => { const q = clamp(L.lt / .3); const c = papaPose(L, 0, q); if (q >= 1) dizzy(c, L.T); badge('red', '3 SEK.', W / 2, H * .16, (L.lt - .2) * 3, 1, 1.1); orbit(V(PW.x, 3.4, PW.z), 15, PI / 2 - .3, .15, 44); sh(PW, 16); }, [[.2, 'crash_wood', .7], [.3, 'leaves', .5]]);
// 123 «Und ich?»
shot(172.24, 'Z', null, L => { town(L); const c = ichCool(P0.x, P0.z + 8, 0, L.T, { expr: 'smug', mouth: 'smirk' }); setHair(c, false); BOWL.visible = false; onFace(c, 7, .2, .3, 40, L.k, 6.2); sh(P0, 14); }, [[0, 'whoosh_soft', .5]]);
// 124 «Ich bin endlich den Suppenschüssel-Schnitt los.»: me revuelvo el pelo — ¡pelo cool! — capucha al viento, el pueblo aplaude
shot(172.79, 'C', 'punch', L => { town(L); const c = ichCool(P0.x, P0.z + 8, 0, L.T, { pose: { aRx: 2.8, aRz: .1, aRe: 2.1, aLx: .3, aLz: -.3, aLe: .6, headX: -.15 }, expr: 'smug', mouth: 'smirk' }); setHair(c, true); breeze(c, L.T, 2.4, 14); onFace(c, 7.4, .2, -.3, 40, L.k, 6.6); sh(P0, 14); }, [[0, 'sparkle', .7], [.2, 'wind', .5]]);
shot(173.46, 'I', 'slow', L => { town(L); const c = ichCool(P0.x, P0.z + 8, 0, L.T, { wind: 1.6 }); setHair(c, true); breeze(c, L.T, 2.6, 18); mtag(c, 'ICH', 150, 1); crowdAt(L, P0.x, P0.z + 8, 18, 6, 22, 61, { mode: 'cheer' }); confRain(V(P0.x, 0, P0.z + 8), L.T, 50, 18, 14, 14);
  orb(L.k, V(P0.x, 4, P0.z + 8), null, [20, .05, .12, 46], [13, 0, .1, 44]); sh(V(P0.x, 0, P0.z + 8), 24); }, [[0, 'cheer', .5], [.4, 'confetti', .4]]);


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
for (let i = 0; i < S.length; i++) { if (S[i].cut) { S[i].fn = S[i - 1].fn; S[i].g = S[i - 1].g; } else S[i].g = i; }
for (const s of S) { s.G0 = S[s.g].t0; s.G1 = s.t1; } for (let i = S.length - 1; i >= 0; i--) if (i + 1 < S.length && S[i + 1].g === S[i].g) S[i].G1 = S[i + 1].G1;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); } });
CUES.push({ t: 0, s: 'zoom_fast', g: .9 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.G0, d = s.G1 - s.G0, L = { lt, k: clamp(lt / d), T, d, t0: s.G0, t1: s.G1 };
  hideAll(); BAD_.length = 0; s.fn(L);
  if (s.alt) { const [ay, f, dy] = s.alt; const v = camera.position.clone().sub(LOOK); v.applyAxisAngle(V(0, 1, 0), ay); v.multiplyScalar(f ?? 1); camera.position.copy(LOOK).add(v); camera.position.y += dy || 0; camera.lookAt(LOOK); }
  while (POST.length) POST.shift()();
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud', 'huss_hit'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = BLUR;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, MODE === 'night' ? 'noche' : 'polvo', MODE === 'in' ? .3 : .4);
  if (BIRDS.update) BIRDS.update(T, camera.position.clone().addScaledVector(dir, 60).add(V(0, 25, 0)), (MODE === 'day') && BIRDSON ? 1 : 0);
  sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position); composer.render(); BLUR = 0;
}
let BLUR = 0;
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
window.DBG = { hp, ich, renderer, composer, bloom, sun, grade, scene, camera, DOM, METER };

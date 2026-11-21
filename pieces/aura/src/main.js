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
//@@PLANOS@@

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

// FRAUENSTADT — «In dieser Stadt sind Frauenrechte heilig»: cada hombre nace en la cárcel y sale con 10.000 Freiheitspunkte.
// Ben (1,99 m) sale el primero, se vuelve el mayor feminista de la ciudad… y sigue sin novia. 1080×1920, 30 fps.
// Ciudad propia: Frauenstein (pueblo alpino de entramado), reparto propio. Planos en src/p/*.js; armar.py los une en src/index.js.
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { makeExtra } from './ecast.js';
import { klasse } from './svsets.js';
import { zelle, phone } from './gsets.js';
import { taxi } from './gort.js';
import { stage as buehne } from './asets.js';
import { laptop, ladder } from './hals.js';
import { lindenthal } from './nsets.js';
import { knastM, crib, tallyBoard, drogerieM, restaurant, turnhalle, pedestal, stoneify, torch, lawSign, bag, bill, streetSign, medal, bigCheck, courseText, glowM, M2U } from './msets.js';
import { makeBenJ, makeBen, makePaulK, makePaulJ, makeMia, makeRolf, makeRolfJ, makeKevin, makeKevinJ, makeDieter, makeTuetenFrau, makeSelin, makeBM, makeHandyFrau, makeJana, makeLehrerinM, makeWaerterin, makeInsasse, makeBabyJ, makeStatueBody } from './mcast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 134.6, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const QS = new URLSearchParams(location.search); const HQ = QS.get('hq') !== '0';
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 5000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = QS.get('ao') !== '0';
const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: .0008, maxblur: .01 }); composer.insertPass(bokeh, 2); let DOF = 1;
let CAMT = new THREE.Vector3(); { const la = camera.lookAt.bind(camera); camera.lookAt = (...a) => { if (a.length === 3) CAMT.set(...a); else CAMT.copy(a[0]); la(...a); }; }
// supermuestreo (?ss=1 por defecto: esta máquina va lenta; SMAA activo, sin desenfoque de profundidad)
const SS = +(QS.get('ss') ?? 1.5); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
if (HQ) { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = +(QS.get('env') ?? .2); renderer.toneMapping = { agx: THREE.AgXToneMapping, aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping }[QS.get('tm') ?? 'neutral']; }
const sky = nightSky(scene); sky.sky.material.depthWrite = !HQ; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0003; sun.shadow.normalBias = .12; sun.shadow.radius = 2.5; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 2048 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-95, 105, 85)); rim.target.position.copy(p); rim.position.copy(p).add(V(70, 45, -100)); }
const OLF = HQ ? 0 : 1; const OC = 3 * SS * OLF, OS = 2.2 * SS * OLF, OP = 1.8 * SS * OLF;
const _ol = outline; 
// ---------- escenarios ----------
// Frauenstein (x = 0): plaza adoquinada z ∈ [-85, 65], casas a x = ±52, carretera hacia +z, iglesia z = -120, Maibaum (18,-14), fuente (-14,-26).
// Estatua gigante en (0, 0, -52); escenario de la plaza en (0, 0, 14) (solo cuando se pide); letrero de la calle en (36, 0, 26).
const LT = lindenthal(scene, { name: 'FRAUENSTEIN', shops: { 2: 'BÄCKEREI', 5: 'SUPERMARKT', 9: 'CAFÉ ROSA', 10: 'FRAUENHAUS' } });
const KNX = 1400, ZEX = 2200, KLX = 3000, DRX = 3800, REX = 4600, THX = 5400;
const KN = knastM(scene, KNX), ZE = zelle(scene, ZEX), KL = klasse(scene, KLX), DR = drogerieM(scene, DRX), RE = restaurant(scene, REX), TH = turnhalle(scene, THX);
const TALLY = tallyBoard(ZE.g); TALLY.position.set(-6, 7.2, -8.7);
const SETS = { LT: LT.g, KN: KN.g, ZE: ZE.g, KL: KL.g, DR: DR.g, RE: RE.g, TH: TH.g };
for (const k in SETS) outline(SETS[k], OS);
// ---------- reparto ----------
const ben = makeBenJ(scene), benC = makeBen(scene), paulK = makePaulK(scene), paulJ = makePaulJ(scene), mia = makeMia(scene), rolf = makeRolf(scene), rolfJ = makeRolfJ(scene);
const kevin = makeKevin(scene), kevinJ = makeKevinJ(scene), dieter = makeDieter(scene), tfrau = makeTuetenFrau(scene), selin = makeSelin(scene), bm = makeBM(scene), hfrau = makeHandyFrau(scene), jana = makeJana(scene), lehr = makeLehrerinM(scene), baby = makeBabyJ(scene);
const WA = Array.from({ length: 3 }, (_, i) => makeWaerterin(scene, i));
const INS = Array.from({ length: 16 }, (_, i) => makeInsasse(scene, i));
[ben, benC, rolf, rolfJ, dieter].forEach(c => kitFace(c, 'hero')); [paulK, paulJ, baby].forEach(c => kitFace(c, 'kid')); [mia, tfrau, selin, bm, hfrau, jana, lehr, ...WA].forEach(c => kitFace(c, 'girl')); [kevin, kevinJ].forEach(c => kitFace(c, 'plain'));
INS.forEach((c, i) => kitFace(c, ['plain', 'hero', 'mustache', 'kid', 'plain'][i % 5]));
const EX = Array.from({ length: 26 }, (_, i) => makeExtra(scene, i + 30)); EX.forEach((c, i) => kitFace(c, ['girl', 'plain', 'girl', 'hero', 'girl', 'mustache'][i % 6]));
const STAT = stoneify(makeStatueBody(scene)); STAT.blob = new THREE.Object3D(); STAT.root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
const MAIN = [ben, benC, paulK, paulJ, mia, rolf, rolfJ, kevin, kevinJ, dieter, tfrau, selin, bm, hfrau, jana, lehr, baby, ...WA];
const POOL = [...MAIN, ...INS, ...EX];
POOL.forEach(c => outline(c.root, OC));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(.5, 'rgba(0,0,0,.26)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -Math.PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const PED = pedestal(scene); const TORCH = torch(scene); const LAW = lawSign(scene); const CRIB = crib(scene);
const BAGS = [bag(scene, 0x2a6ad8), bag(scene, 0xffd23f)]; const BILL = bill(scene); const SSIGN = streetSign(scene, 'Ben-Hartmann-Straße'); const MEDAL = medal(scene); const CHECK = bigCheck(scene);
const PHONE = phone(scene); const PHONE2 = phone(scene); const STAGE = buehne(scene, 0, 0); { const b = STAGE.g.children.find(o => o.geometry && o.geometry.type === 'PlaneGeometry' && o.position.y > 16); }
const BANNER = textPlane(22, 3.4, 880, 136, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8202f'; c.lineWidth = 10; c.strokeRect(6, 6, w - 12, h - 12); txt(c, 'HELD DER FRAUENRECHTE', w / 2, h / 2 + 4, 84, '#d8202f'); }); BANNER.position.set(0, 17, -5.3); STAGE.g.add(BANNER);
const TAXI = taxi(scene); const TAXIS = textPlane(4.6, 1.2, 368, 96, (c, w, h) => { c.fillStyle = '#1a1a1e'; c.fillRect(0, 0, w, h); txt(c, 'NACHTFAHRT 0 €', w / 2, h / 2 + 3, 48, '#5aff9a'); }); TAXIS.position.set(0, 5.6, -.4); TAXI.add(TAXIS);
const LAPS = Array.from({ length: 6 }, () => laptop(scene));
const SCREW = new THREE.Group(); scene.add(SCREW); cyl(.22, .22, 1.1, mat(0xd8202a, { roughness: .5 }), 10, SCREW, 0, 0, 0); cyl(.06, .06, 1.2, mat(0xd8dce4, { metalness: .9, roughness: .2 }), 6, SCREW, 0, -1.1, 0);
const COIN = Array.from({ length: 10 }, () => { const m = cyl(.5, .5, .12, mat(0xffd23f, { metalness: .9, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .3 }), 18, scene); m.rotation.x = Math.PI / 2; return m; });
const BALL = new THREE.Group(); scene.add(BALL); { const t = canvasTex(128, 64, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a1a'; for (let k = 0; k < 8; k++) { c.beginPath(); c.arc((k * 37) % w, (k * 23) % h, 9, 0, 7); c.fill(); } }); sphere(.6, mat(0xffffff, { map: t, roughness: .5 }), BALL, 0, 0, 0, 16, 12); }
const PONY = new THREE.Group(); scene.add(PONY); { const pm = mat(0xffb8e0, { roughness: .6 }); box(1.4, .8, .7, pm, .3, PONY, 0, .9, 0); box(.5, .7, .5, pm, .2, PONY, .7, 1.5, 0); for (const [x, z] of [[-.5, -.25], [-.5, .25], [.5, -.25], [.5, .25]]) box(.2, .6, .2, pm, .05, PONY, x, .3, z); box(.15, .6, .5, mat(0xb86aff), .05, PONY, .5, 1.6, 0); }
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffffff, 0xffd23f, 0x3ab8ff, 0x8ad84a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 4 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const HEARTS = Array.from({ length: 12 }, () => { const s = new THREE.Shape(); s.moveTo(0, -.5); s.bezierCurveTo(-1, .2, -.5, .9, 0, .4); s.bezierCurveTo(.5, .9, 1, .2, 0, -.5); const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: .2, bevelEnabled: false }), glowM(0xff3a6a, 1.2)); scene.add(m); return m; });
function hearts(c, T0, T, n = 8, sp = 1) { HEARTS.forEach((h, i) => { if (i >= n) return; const r = RNG(i * 7 + 3), t = ((T - T0) * .7 + r()) % 1.6; h.visible = true; h.position.set(c.x + (r() - .5) * 8 * sp + Math.sin(T * 2 + i) * .4, c.y + t * 6 * sp, c.z + (r() - .5) * 4); h.scale.setScalar((.5 + r() * .4) * sp * Math.min(1, t * 4) * (1 - t / 1.6 * .5)); h.rotation.y = Math.sin(T * 2 + i) * .5; }); }
function coins(c, T0, T, n = 10) { COIN.forEach((m, i) => { if (i >= n) return; const r = RNG(i * 5 + 1), t = T - T0; if (t < 0) return; m.visible = true; m.position.set(c.x + (r() - .5) * 5, c.y + 6 - ((t * (6 + r() * 4) + r() * 6) % 8), c.z + (r() - .5) * 3); m.rotation.set(Math.PI / 2, T * 6 + i, 0); }); }
const LADDER = ladder(scene, 10);
const PROTEST = new THREE.Group(); scene.add(PROTEST); cyl(.12, .12, 6, mat(0x8a5a2a), 6, PROTEST, 0, 0, 0); { const p = textPlane(4.4, 2.8, 352, 224, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ff4a8a'; c.lineWidth = 12; c.strokeRect(6, 6, w - 12, h - 12); txt(c, 'GRATIS', w / 2, 80, 72, '#ff4a8a'); txt(c, 'BINDEN!', w / 2, 160, 72, '#1a9a4a'); }); p.position.y = 3.6; p.position.z = .1; PROTEST.add(p); box(4.6, 3, .1, mat(0xf4f0e8), .02, PROTEST, 0, 3.6, 0); }
const HALO = new THREE.Mesh(new THREE.TorusGeometry(.9, .12, 10, 32), glowM(0xffe08a, 2.4)); HALO.rotation.x = Math.PI / 2; scene.add(HALO);
const CUFFS = new THREE.Group(); scene.add(CUFFS); for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.32, .07, 8, 18), mat(0xd8dce4, { metalness: .9, roughness: .2 })); r.position.x = s * .45; CUFFS.add(r); } box(.5, .06, .06, mat(0xd8dce4, { metalness: .9 }), 0, CUFFS, 0, 0, 0);
const CLIP = new THREE.Group(); scene.add(CLIP); box(1.4, 1.9, .1, mat(0x8a5a2a), .03, CLIP, 0, 0, 0); box(1.2, 1.6, .02, mat(0xffffff), 0, CLIP, 0, -.05, .06);
const UMB = new THREE.Group(); scene.add(UMB); { const c = new THREE.Mesh(new THREE.ConeGeometry(3, 1.2, 12), mat(0x2a2a34, { roughness: .6 })); c.position.y = 1.1; UMB.add(c); cyl(.06, .06, 5, mat(0x1a1a1a), 6, UMB, 0, -1.4, 0); }
const CLOTH = new THREE.Mesh(new THREE.PlaneGeometry(19, 10), mat(0xc81e2a, { roughness: .9, side: THREE.DoubleSide })); scene.add(CLOTH);
const BROOM = new THREE.Group(); scene.add(BROOM); cyl(.1, .1, 6, mat(0x9a6a3a, { roughness: .7 }), 6, BROOM, 0, 0, 0); box(2.2, .5, .6, mat(0xd8323a), .1, BROOM, 0, -3.1, 0); box(2.1, .5, .5, mat(0xe8d070, { roughness: 1 }), .02, BROOM, 0, -3.5, 0);
const PROPS = [BROOM, UMB, CLOTH, LADDER, PROTEST, HALO, CUFFS, CLIP, PED, TORCH, LAW, CRIB, ...BAGS, BILL, SSIGN.g, MEDAL, CHECK, PHONE, PHONE2, STAGE.g, TAXI, ...LAPS, SCREW, ...COIN, BALL, PONY, ...CONF, ...DUST, ...SWEAT, ...TEAR, ...HEARTS];
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.16, .44, .96], [.45, .72, 1], [.86, .94, 1]); sky.moon.visible = false; sky.sky.material.uniforms.cloud.value = 1; sky.sky.material.uniforms.starK.value = 0; hemi.intensity = 1.0; hemi.color.setRGB(.82, .9, 1); hemi.groundColor.setRGB(.6, .55, .42); sun.intensity = 3.0; sun.color.setRGB(1, .9, .76); rim.intensity = 1.9; rim.color.setRGB(1, .93, .82);
  scene.fog.color.setRGB(.82, .9, 1); scene.fog.density = .0006; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function dusk() { day(); sun.color.setRGB(1, .66, .42); sun.intensity = 2.3; setSky([.14, .18, .52], [.74, .42, .56], [1, .6, .34]); hemi.color.setRGB(.9, .74, .8); scene.fog.color.setRGB(.9, .66, .6); rim.color.setRGB(1, .6, .4); }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.05; setSky([.04, .05, .2], [.12, .12, .38], [.3, .22, .48]); sky.sky.material.uniforms.cloud.value = 0; sky.sky.material.uniforms.starK.value = 1; sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.1; hemi.color.setRGB(.7, .74, 1); hemi.groundColor.setRGB(.3, .28, .4); sun.intensity = 1.1; sun.color.setRGB(.78, .78, 1); rim.intensity = 1.8;
  scene.fog.color.setRGB(.12, .12, .3); scene.fog.density = .0009; bloom.strength = .32; bloom.threshold = .82; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; bloom.threshold = .86; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.blob.visible = true; }
  for (const p of PROPS) { p.visible = false; p.rotation.order = 'XYZ'; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const k in SETS) SETS[k].visible = false; STAT.root.visible = false; if (SSIGN.SIGN.parent !== SSIGN.g) SSIGN.g.add(SSIGN.SIGN); SSIGN.SIGN.position.set(0, 13.2, 0); SSIGN.SIGN.rotation.set(0, 0, 0); SSIGN.SIGN.scale.setScalar(1); KN.gate.position.x = 0;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.2; grade.uniforms.sharp.value = .5; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; DOF = 1; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
function cam(p, t, fov = 50) { CAMT.set(...t); camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
// órbita: cámara a distancia d del centro c, ángulo yaw (0 = desde +z), pitch (arriba +); el centro queda al ~42 % de la altura
function orbit(c, d, yaw = 0, pitch = .15, fov = 44) { const t = Math.tan(fov * Math.PI / 360) * d * .16; cam([c.x + Math.sin(yaw) * Math.cos(pitch) * d, c.y + Math.sin(pitch) * d, c.z + Math.cos(yaw) * Math.cos(pitch) * d], [c.x, c.y - t, c.z], fov); }
const orb = (k, c0, c1, a, b, e = easeInOut) => { const q = e(clamp(k)); orbit(c0.clone().lerp(c1 ?? c0, q), lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q), lerp(a[3] ?? 44, b[3] ?? 44, q)); };
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { dist *= 1.45; if (dist2 != null) dist2 *= 1.45; const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .85, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .6 + dy, h.z + fz * d - fx * side], [h.x, h.y - .9, h.z], fov); }
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function ojos(expr, T, sd) { const n = Math.sin(T * .9 + sd) * .55 + Math.sin(T * 2.3 + sd * 2.1) * .45;
  switch (expr) {
    case 'neutral': case 'talk': case undefined: return n > .25 ? 'half' : n < -.55 ? (sd % 2 ? 'side_l' : 'side_r') : 'normal';
    case 'sad': return n > -.1 ? 'worried' : 'down';
    case 'cry': return 'cry';
    case 'happy': case 'smile': case 'relief': case 'joy': return n > -.3 ? 'happy' : 'half';
    case 'warm': return n > .1 ? 'happy' : 'normal';
    case 'worried': return n > .45 ? 'side_l' : n < -.45 ? 'down' : 'worried';
    case 'shock': case 'gasp': return n > -.2 ? 'wide' : 'scared';
    case 'determined': return n > .5 ? 'squint' : 'angry';
    case 'angry': case 'shout': return n > .55 ? 'squint' : 'angry';
    case 'confused': return n > 0 ? 'squint' : 'side_r';
    case 'tired': return n > -.4 ? 'half' : 'closed';
    case 'sus': case 'smug': return n > .2 ? 'squint' : 'half';
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed' && s.expr !== 'cry') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk', extra = {}) => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || (expr === 'warm' || expr === 'happy' ? 'smile' : 'flat'), ...extra });
const grin = (ch, T, ex = {}) => cara(ch, T, { expr: 'grin', eyes: 'happy', mouth: 'grin', ...ex });
const laughF = (ch, T) => cara(ch, T, { eyes: 'happy', mouth: Math.sin(T * 22) > 0 ? 'laugh' : 'open_smile' });
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
// lágrimas: caen por las mejillas en la dirección a la que mira
const tears = (ch, T, slot = 0) => { const h = hp(ch), s = ch.spec.scale || 1, a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a); for (let i = 0; i < 2; i++) { const k = (T * 1.1 + i * .5) % 1, sd = i ? -.3 : .3; const t = TEAR[slot * 2 + i]; t.visible = true; t.position.set(h.x + (fz * sd + fx * .68) * s, h.y + (.72 - k * 1.0) * s, h.z + (-fx * sd + fz * .68) * s); t.scale.setScalar(s); } };
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.5 + t * 1.4) * s * (.8 + r() * .5)); d.material.opacity = .4 * (1 - t / 1.2); }); }
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));
const walkP = (T, i) => { const p = Math.sin(T * 9 + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
const runP = (T, i) => { const p = Math.sin(T * 13 + i); return { aLx: p * 1.1, aRx: -p * 1.1, aLe: 1.3, aRe: 1.3, lLx: -p * .9, lRx: p * .9, lLk: .3 + Math.max(0, p) * 1.1, lRk: .3 + Math.max(0, -p) * 1.1, lean: .25, headX: -.15 }; };
const sitPose = (extra = {}) => ({ lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, ...extra });
const sitY = (c, seat) => seat + .1 - 2.05 * (c.spec.scale || 1);
// sentado en un asiento a la altura seat
function sit(c, x, seat, z, ry, L, pose = {}) { put(c, x, sitY(c, seat), z, ry); actuar(c, 0, [[0, sitPose(pose)]], { T: L.T, weight: false }); c.blob.visible = false; return c; }
// ---------- gente ----------
function crowdAt(L, cx, cz, n, r0, r1, seed = 1, o = {}) { POST.push(() => { const list = (o.list || EX).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc_ = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.2), ac + 6.283 - (o.gap ?? 1.2)];
  const placed = o.avoid ? [...o.avoid] : [];
  list.forEach((c, i) => { let x, z, tries = 0; do { const a = arc_[0] + (i + r() * .8) / list.length * (arc_[1] - arc_[0]); const d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; tries++; } while (tries < 10 && placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 3.6));
    placed.push([x, z]); crowdGuy(c, x, z, L, i, o); }); }); }
function crowdGuy(c, x, z, L, i, o) { const T = L.T + i * .37, face = o.face || camera.position; let ry = o.ry ?? (Math.atan2(face.x - x, face.z - z) + Math.sin(i * 7.3) * (o.jit ?? .35));
  put(c, x, o.y ?? 0, z, ry); const m = typeof o.mode === 'function' ? o.mode(i) : o.mode;
  if (m === 'walk' || m === 'run') { const run = m === 'run', d = (o.speed ?? (run ? 9 : 2.2)) * L.lt, a = ry + (o.dir ?? 0); c.root.rotation.y = a; c.root.position.x += Math.sin(a) * d; c.root.position.z += Math.cos(a) * d; c.root.position.y = (o.y ?? 0) + Math.abs(Math.sin(L.T * (run ? 13 : 9) + i)) * (run ? .35 : .12); actuar(c, 0, [[0, run ? runP(L.T, i) : walkP(L.T, i)]], { T: L.T }); cara(c, T, { expr: o.expr || (run ? 'determined' : 'neutral'), mouth: run ? 'o' : undefined }); }
  else if (m === 'talk') { actuar(c, 0, [[0, { aRx: .9 + Math.sin(L.T * 3 + i) * .3, aRz: .2, aRe: 1.2, aLx: .3, headY: Math.sin(L.T * .8 + i) * .4 }]], { T: L.T }); cara(c, T, { expr: 'happy', mouth: Math.sin(L.T * 9 + i) > 0 ? 'talk' : 'smile' }); }
  else if (m === 'shock') { actuar(c, 0, [[0, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9, lean: -.08, headX: -.06 }]], { T: L.T }); cara(c, T, { expr: 'shock', mouth: i % 2 ? 'o' : 'grimace' }); }
  else if (m === 'point') { actuar(c, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: .5, aLz: -.6, aLe: 1.5, lean: -.08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'shock', mouth: 'o' }); }
  else if (m === 'cheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); c.root.position.y = (o.y ?? 0) + j * .45 * (c.spec.scale || 1); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3, crouch: .05 + j * .08 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'wave') { actuar(c, 0, [[0, 'wave']], { T: L.T }); cara(c, T, { expr: 'happy', mouth: 'open_smile' }); }
  else if (m === 'clap') { const j = Math.sin(L.T * 14 + i); actuar(c, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.2 - j * .25, aRz: -.2 - j * .25, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); cara(c, T, { expr: 'joy' }); }
  else if (m === 'sitb') { sit(c, x, o.seat ?? 2.4, z, ry, L, { aLx: .4, aRx: .4, aLe: .6, aRe: .6, headY: Math.sin(L.T * .9 + i) * .3 }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); }
  else if (m === 'sitcheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); sit(c, x, o.seat ?? 2.4, z, ry, L, { aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3 }); laughF(c, T); }
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); } }
// plano medio/entero de un personaje: cámara delante (yaw relativo a su ry), centro a la altura del pecho
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null, dy = 3.3) { const s = ch.spec.scale || 1, p = ch.root.position, c = V(p.x, p.y + dy * s, p.z); const q = easeInOut(clamp(k)); orbit(c, lerp(dist, dist2 ?? dist * .88, q) * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const _hb = new THREE.Box3(); function heightTo(ch, m) { ch.root.updateMatrixWorld(true); _hb.makeEmpty(); ch.root.traverseVisible(o => { if (o.isMesh && o !== ch.blob) _hb.expandByObject(o, false); }); const t = _hb.max.y - ch.root.position.y; ch.root.scale.multiplyScalar(m * M2U / t); return ch; }
const toCam = ch => { const p = ch.root.position; ch.root.rotation.y = Math.atan2(camera.position.x - p.x, camera.position.z - p.z); };
// ---------- escenarios por plano ----------
function town(L, o = {}) { use('LT'); if (o.night) { night(30); renderer.toneMappingExposure = .9; TINT = 'rgba(10,16,60,.18)'; } else if (o.dusk) dusk(); else day(); if (o.statue !== false) statue(L); }
// la estatua gigante: una mujer de piedra con la antorcha en alto, sobre el pedestal
function statue(L) { show(PED, 0, 0, -52); const c = put(STAT, 0, 10, -52, 0); STAT.root.visible = true; c.blob.visible = false; actuar(c, 0, [[0, { aRx: 3.0, aRz: .2, aRe: .1, aLx: .3, aLz: .1, headX: -.05 }]], { T: 0, weight: false, breathe: false });
  attach(TORCH, c.aR.hand, [0, -.5, 0], [Math.PI, 0, 0], 1); }
function knast(L, o = {}) { use('KN'); o.night ? (night(30), KN.SPOT.intensity = 900) : day(); KN.SB.userData.set(...(o.sb || ['0 / 10.000'])); }
function zelleS(L, o = {}) { use('ZE'); inside(.85, 30); renderer.toneMappingExposure = .85; TALLY.userData.set(o.tally || '', o.n ?? 0); }
function klasseS(L, o = {}) { use('KL'); inside(1.0, 40); const t = o.board || ['', '']; KL.BB.userData.draw(t.join('|'), (c, w, h) => courseText(c, w, h, t[0], t[1])); }
function drogS(L) { use('DR'); inside(1.0, 40); }
function restS(L) { use('RE'); inside(.75, 26); renderer.toneMappingExposure = .82; FILL.color.setRGB(1, .82, .62); }
function hallS(L) { use('TH'); inside(1.0, 40); }
// ---------- capa 2D ----------
const BAD_ = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD_.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD_.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD_.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; if (x < -60 || x > W + 60) return; b.x = clamp(x, 200, W - 200); b.y = clamp(y, 150, H * .64); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (['big', 'red', 'num', 'green', 'gold', 'cyan'].includes(b.kind)) { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : b.kind === 'green' ? '#04300e' : b.kind === 'gold' ? '#3a2400' : b.kind === 'cyan' ? '#03283a' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50);
    if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#8aff9a'); g.addColorStop(1, '#1ab84a'); } else if (b.kind === 'gold') { g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a820'); } else if (b.kind === 'cyan') { g.addColorStop(0, '#d8ffff'); g.addColorStop(1, '#2ad8f0'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  else if (b.kind === 'heart') { c.fillStyle = '#ff3a5a'; c.strokeStyle = '#4a0010'; c.lineWidth = 10; c.beginPath(); c.moveTo(0, 40); c.bezierCurveTo(-90, -20, -50, -90, 0, -40); c.bezierCurveTo(50, -90, 90, -20, 0, 40); c.fill(); c.stroke(); }
  c.restore(); }
const KEY = /^(Stadt|Frauenrechte|heilig|Gefängnis|geboren|Punkten|Zehntausend|1,98|immer|1,99|Zentimeter|Meinung|Gesetz|Uterus|Urteil|Kindergarten|Einzelhaft|Zwölf|Ponys|Einkaufstüten|25|schwach|Date|Rechnung|Lebenslang|Immer|Wasser|andersrum|Pflichtkurse|Mutter|Teresa|gratis|Uber|kostenlos|Selbstverteidigung|Punkte|bisschen|9\.990|Handy|helfen|frei|gefeiert|Orden|Straße|abgeschraubt|Richtige|50\.000|Frauenhaus|MacBook|Feminist|Freundin|süß|Bad|Boys|drinsitzen)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0;
// ---------- a: gancho y reglas (0 – 28,2 s) ----------
// Männergefängnis (KNX): portón en (KNX, z = -14,6) (se abre deslizando a x = +13), marcador LED en (KNX-24, -12), pared de medir en (KNX+11, -14,1).
// Celda (ZEX): barrotes en z = 7, banco (-3, 2,4, -7), ventana (4, 10, -8,8). Frauenstein: estatua (0, -52), Maibaum (18, -14), fuente (-14, -26).
const KG = V(KNX, 0, -14.6);
const gateAt = k => { KN.gate.position.x = lerp(13, 0, clamp(k)); };
// guardia empujando: brazos al frente
const PUSH = { aLx: 1.55, aRx: 1.55, aLe: .3, aRe: .3, lean: .3, lLx: .4, lRx: -.35, lRk: .2 };
// preso en el patio (fila o grupo)
function yard(L, n = 6, o = {}) { crowdAt(L, KNX + (o.x ?? 0), o.z ?? 6, n, o.r0 ?? 6, o.r1 ?? 18, o.seed ?? 3, { list: INS, from: o.from ?? 6, mode: o.mode || (i => ['talk', 'walk', 'idle', 'talk'][i % 4]), speed: 1.4, expr: o.expr }); }

// 1 «In dieser Stadt sind Frauenrechte heilig.»: dos Wärterinnen empujan a un hombre a través del portón y lo cierran de golpe; la estatua al fondo
shot(0, 'C', null, L => { knast(L); const lt = L.lt; const m = put(INS[0], KNX - 1, 0, lerp(0, -15.6, easeIn(clamp(lt / 1.0))), PI); actuar(m, lt, [[0, { lean: -.3, aLx: -.4, aRx: -.4, aLz: .5, aRz: .5, headX: -.3 }], [.5, { lean: .4, aLx: 1.4, aRx: 1.4, headX: .3, lLx: -.6, lRx: .4 }, { dur: .25 }]], { T: L.T }); cara(m, L.T, { expr: 'scream' });
  for (const s of [-1, 1]) { const g = put(WA[s < 0 ? 0 : 1], KNX + s * 2.6, 0, lerp(2, -9, easeOut(clamp(lt / .7))), PI); actuar(g, lt, [[0, PUSH], [.7, { aLx: .2, aRx: .2, lean: -.05 }, { dur: .3 }]], { T: L.T }); cara(g, L.T, { expr: 'angry' }); }
  gateAt((lt - 1.0) / .18); if (lt > 1.18) { const p = put(INS[1], KNX + 3, 0, -22, 0); actuar(p, 0, [[0, { aLx: 2.3, aRx: 2.3, aLz: .3, aRz: .3, aLe: 1.5, aRe: 1.5 }]], { T: L.T }); cara(p, L.T, { expr: 'cry' }); }
  put(STAT, KNX - 36, 10, -70, .3); STAT.root.visible = true; STAT.blob.visible = false; actuar(STAT, 0, [[0, { aRx: 3.0, aRz: .2, aRe: .1, aLx: .3 }]], { T: 0, weight: false, breathe: false }); attach(TORCH, STAT.aR.hand, [0, -.5, 0], [PI, 0, 0], 1); show(PED, KNX - 36, 0, -70, .3);
  cm([KNX + 20, 5.4, 0], [KNX + 15, 6, -4], L.k, easeOut); camera.lookAt(KNX - 1.5, 5.6, -10); camera.fov = 50; DOF = .6; sh(V(KNX, 0, -8), 30); },
  [[0, 'shout_m', .5], [.1, 'run_cobble', .4], [.55, 'thud', .5], [1.05, 'slam', .9], [1.12, 'chain_rattle', .5], [1.3, 'keys', .4]]);
// 2 «heilig.»: la estatua desde abajo, antorcha encendida; mujeres aplauden a sus pies
shot(1.50, 'Z', 'punch', L => { town(L); crowdAt(L, 0, -38, 14, 6, 18, 2, { mode: i => i % 3 ? 'clap' : 'cheer' }); orb(L.k, V(0, 26, -52), V(0, 30, -52), [62, .15, -.05, 50], [52, .05, .02, 46], easeOut); sh(V(0, 0, -44), 40); },
  [[0, 'choir', .5], [.2, 'cheer', .4]]);
// 3 «So heilig, dass jeder»: por la plaza pasa una fila de hombres con mono naranja, escoltados; las mujeres los miran y los señalan
shot(2.28, 'W', null, L => { town(L); for (let i = 0; i < 6; i++) { const c = put(INS[2 + i], -14 + i * 5.2 + L.lt * 3, 0, 4 + (i % 2) * .4, PI / 2); actuar(c, 0, [[0, { ...walkP(L.T, i), aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.3, aRe: 1.3, headX: .35 }]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 9 + i)) * .1; cara(c, L.T + i, { expr: 'sad' }); }
  const g = put(WA[2], 19 + L.lt * 3, 0, 4.6, -PI / 2); actuar(g, 0, [[0, { aRx: 1.6, aRe: .1 }]], { T: L.T }); cara(g, L.T, { expr: 'angry', mouth: 'talk_wide' });
  crowdAt(L, 0, -6, 10, 9, 22, 4, { mode: i => i % 2 ? 'point' : 'talk', expr: 'smug' }); cm([-8 + L.lt * 3, 5, 26], [-2 + L.lt * 3, 5.6, 22], L.k); camera.lookAt(0 + L.lt * 3, 4, 4); camera.fov = 46; sh(V(0, 0, 4), 34); },
  [[0, 'steps', .5], [.2, 'chain_rattle', .4], [.6, 'whistle', .35]]);
// 4 «Mann im Gefängnis geboren wird.»: en la celda, una cuna con un bebé con mono naranja «M-001»; la cámara entra por los barrotes
shot(3.40, 'F', 'slow', L => { zelleS(L, { tally: '', n: 0 }); show(CRIB, ZEX, 0, -2, 0); const b = put(baby, ZEX, 3.05, -2.2, 0); b.root.scale.setScalar(.46); b.blob.visible = false; actuar(b, L.lt, [[0, { aLx: .6, aRx: .6, aLz: .4, aRz: .4 }], [.6, { aLx: 2.2, aRx: 2.2, aLz: .3, aRz: .3, aLe: 1.2, aRe: 1.2 }, { dur: .3 }]], { T: L.T }); cara(b, L.T, { expr: L.lt < .6 ? 'gasp' : 'cry' });
  const g = put(WA[0], ZEX + 6, 0, 9, -.4); actuar(g, L.lt, [[0, { aRx: 1.5, aRe: .4 }], [.4, { aRx: .3, aRe: .2 }, { dur: .3 }]], { T: L.T }); cara(g, L.T, { expr: 'smug' }); attach(CUFFS, g.aR.hand, [0, -.6, 0], [0, 0, 0], .9);
  cm([ZEX + .5, 6.5, 15], [ZEX + .2, 5.2, 1.2], L.k, easeIn); camera.lookAt(ZEX, 4.4, -2.2); camera.fov = 44; sh(V(ZEX, 0, 0), 14); },
  [[0, 'metal_creak', .5], [.3, 'baby_gasp', .6], [.9, 'cry_girl', .2], [1.2, 'keys', .3]]);
// 5 «Und raus kommst du nur mit Punkten.»: el marcador LED «0 / 10.000»; los presos miran hacia arriba
shot(5.04, 'S', null, L => { knast(L, { sb: ['0 / 10.000'] }); gateAt(0); for (let i = 0; i < 5; i++) { const c = put(INS[8 + i], KNX - 30 + i * 3.4, 0, 4 + (i % 2) * 2.4, PI - .3); actuar(c, 0, [[0, { headX: -.5, aLx: .2, aRx: .2 }]], { T: L.T }); cara(c, L.T + i, { expr: i % 2 ? 'worried' : 'lookup' }); }
  cm([KNX - 18, 4, 24], [KNX - 20, 12, 18], L.k); camera.lookAt(KNX - 24, 13 + L.k * 3, -12); camera.fov = 46; sh(V(KNX - 22, 0, 0), 30); },
  [[0, 'power_on', .5], [.3, 'hum', .3]]);
// 6 «Zehn Punkte pro guter Tat»: un preso escoltado sostiene un paraguas sobre una señora en la terraza del café; «+10»
shot(6.62, 'W', null, L => { town(L); const w = sit(EX[1], 38, 3.0, -26, -PI / 2, L, { aRx: .9, aRe: 1.6 }); cara(w, L.T, { expr: 'smug', mouth: 'smile' }); const p = put(INS[3], 34.6, 0, -26, PI / 2); actuar(p, 0, [[0, { crouch: .55, lean: .5, lLx: .9, lLk: 1.6, lRx: -.2, lRk: 1.4, aRx: 1.2 + Math.sin(L.T * 14) * .25, aRe: .6, aLx: 1.0, aLe: .8, headX: .2 }]], { T: L.T, weight: false }); cara(p, L.T, { expr: 'determined' });
  const g = put(WA[1], 30, 0, -21, PI / 2 + .4); actuar(g, 0, [[0, 'cross']], { T: L.T }); cara(g, L.T, { expr: 'sus' }); badge('green', '+10', W / 2, H * .2, clamp((L.lt - .5) / .2), 1, 1.1);
  orb(L.k, V(35, 4.5, -26), null, [20, -1.0, .15, 44], [16, -1.25, .12, 44]); sh(V(36, 0, -26), 20); }, [[0, 'birds', .3], [.5, 'ding_soft', .7], [.6, 'coin_flip', .5]]);
// 7 «für eine Frau.»: la señora sonríe y le da el visto bueno; la guardiana apunta en su libreta
shot(7.95, 'C', null, L => { town(L); const w = sit(EX[1], 38, 3.0, -26, -PI / 2, L, { aRx: 1.5, aRz: -.1, aRe: 1.2 }); cara(w, L.T, { expr: 'happy' }); const g = put(WA[1], 32, 0, -20, PI / 2 + .6); actuar(g, 0, [[0, { aLx: 1.1, aLe: 1.6, aRx: 1.0, aRz: -.3, aRe: 1.8, headX: .3 }]], { T: L.T }); attach(CLIP, g.aL.hand, [0, -.4, .3], [-.4, 0, 0], 1); cara(g, L.T, { expr: 'neutral' });
  badge3('green', '+10', hp(w).add(V(0, 2.4, 0)), clamp(L.lt / .2)); onFace(w, 5.6, .2, .6, 40, L.k, 4.6); sh(V(36, 0, -26), 14); }, [[0, 'pencil', .5], [.3, 'sparkle', .4]]);
// 8 «Zehntausend»: el marcador salta a 10.000 en dorado
shot(8.75, 'Z', 'punch', L => { knast(L, { sb: [L.lt < .25 ? '10' : '10.000', '#ffd23f', 'SO VIELE BRAUCHST DU'] }); cm([KNX - 18, 16, 8], [KNX - 21, 17, 4.5], L.k); camera.lookAt(KNX - 24, 18, -12); camera.fov = 44; sh(V(KNX - 22, 0, 0), 30); },
  [[0, 'count', .5], [.25, 'magic_hit', .6]]);
// 9 «brauchst du.»: en el patio, los presos se llevan las manos a la cabeza
shot(9.60, 'F', null, L => { knast(L, { sb: ['10.000', '#ffd23f'] }); for (let i = 0; i < 5; i++) { const c = put(INS[9 + i], KNX - 8 + i * 4, 0, 6 + (i % 2) * 2.4, -.1 + i * .05); actuar(c, L.lt, [[0, 'idle'], [.05 + i * .04, i % 2 ? 'hands_head' : 'facepalm', { dur: .3 }]], { T: L.T }); cara(c, L.T + i, { expr: i % 2 ? 'shock' : 'cry' }); }
  orb(L.k, V(KNX, 4, 7), null, [24, .15, .12, 44], [20, .05, .1, 44]); sh(V(KNX, 0, 6), 24); }, [[0, 'gasp', .5], [.2, 'sigh', .4]]);
// 10 «Aber bevor du überhaupt Punkte sammeln darfst,»: un preso camina hacia la pared de medir; la guardiana espera con la libreta
shot(10.29, 'W', null, L => { knast(L); const c = put(INS[4], KNX + 11 + lerp(6, 0, easeOut(clamp(L.lt / 1.1))), 0, -12.6 + lerp(6, 0, easeOut(clamp(L.lt / 1.1))), lerp(PI + .8, 0, clamp((L.lt - .9) / .3))); actuar(c, 0, [[0, L.lt < 1.1 ? walkP(L.T, 1) : { aLx: 0, aRx: 0 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  const g = put(WA[0], KNX + 5, 0, -9, .8); actuar(g, 0, [[0, { aLx: 1.1, aLe: 1.6, aRx: .2 }]], { T: L.T }); attach(CLIP, g.aL.hand, [0, -.4, .3], [-.4, 0, 0], 1); cara(g, L.T, { expr: 'sus' }); yard(L, 5, { x: -10, z: 8, from: 8 });
  orb(L.k, V(KNX + 9, 4, -12), null, [24, .5, .12, 46], [18, .25, .1, 44]); sh(V(KNX + 8, 0, -10), 24); }, [[0, 'steps', .5], [.8, 'pages', .4]]);
// 11 «musst du mindestens 1,98 groß sein.»: la raya roja de 1,98 m; la cámara sube por la regla
shot(12.40, 'C', null, L => { knast(L); const c = put(INS[4], KNX + 11, 0, -12.9, 0); actuar(c, 0, [[0, { headX: -.2 }]], { T: L.T }); heightTo(c, 1.84); cara(c, L.T, { expr: 'worried' });
  cm([KNX + 11, 3, -1], [KNX + 11, 8.2, -3.6], L.k); camera.lookAt(KNX + 11, lerp(3, 7.9, easeInOut(L.k)), -14); camera.fov = 40; sh(V(KNX + 11, 0, -12), 12); }, [[0, 'tick', .4], [.6, 'impact', .5]]);
// 12 «Bist du kleiner?»: un preso bajito: la cabeza le queda muy por debajo de la raya; la guardiana se inclina a mirar
shot(14.84, 'Z', 'punch', L => { knast(L); const c = put(INS[5], KNX + 11, 0, -12.9, 0); heightTo(c, 1.62); actuar(c, 0, [[0, { headX: -.3, aLz: .1, aRz: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'scared', mouth: 'grimace' }); sweat(c, L.T);
  const g = put(WA[0], KNX + 5.6, 0, -11, .9); actuar(g, 0, [[0, { lean: .3, headZ: -.3, aLx: 1.1, aLe: 1.6 }]], { T: L.T }); cara(g, L.T, { expr: 'sus' }); attach(CLIP, g.aL.hand, [0, -.4, .3], [-.4, 0, 0], 1);
  orb(L.k, V(KNX + 9.5, 4.2, -13), null, [17, .3, .05, 44], [16, .25, .05, 44]); sh(V(KNX + 10, 0, -12), 14); }, [[0, 'boing_metal', .4]]);
// 13 «Dann bleibst du drin.»: sello rojo ABGELEHNT; lo empujan de vuelta
shot(15.54, 'C', null, L => { knast(L); const c = put(INS[5], KNX + 11 - L.lt * 3, 0, -12.9 + L.lt * 2, -.6); heightTo(c, 1.62); actuar(c, 0, [[0, { lean: -.3, aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1, aRe: 1 }]], { T: L.T }); cara(c, L.T, { expr: 'cry' });
  const g = put(WA[0], KNX + 13.5 - L.lt * 2.2, 0, -12 + L.lt * 1.4, -1.2); actuar(g, 0, [[0, PUSH]], { T: L.T }); cara(g, L.T, { expr: 'angry' });
  badge('red', 'ABGELEHNT', W / 2, H * .2, clamp(L.lt / .12), 1, 1.15); orb(L.k, V(KNX + 10, 4, -11), null, [18, -.2, .12, 44], [16, -.35, .1, 44]); sh(V(KNX + 10, 0, -11), 16); }, [[0, 'slam', .6], [.05, 'buzz', .4]]);
// 14 «Für immer.»: un preso muy viejo con barba blanca en la celda, telarañas; FÜR IMMER
shot(16.47, 'I', null, L => { zelleS(L, { tally: '∞', n: 14 }); const c = sit(dieter, ZEX - 3, 2.7, -7, 0, L, { headX: .4, aLx: .4, aRx: .4, aLe: .6, aRe: .6 }); cara(c, L.T, { expr: 'sleepy' });
  badge('red', 'FÜR IMMER', W / 2, H * .18, clamp((L.lt - .1) / .15), 1, 1.1); cm([ZEX - 2, 6, 12], [ZEX - 2.6, 5.4, 9], L.k); camera.lookAt(ZEX - 3, 4.6, -7); camera.fov = 42; sh(V(ZEX, 0, -4), 14); }, [[0, 'sad_tone', .5], [.1, 'drip', .3]]);
// 15 «Ich hatte Glück.»: yo (Ben) contra la pared de medir, sudando; la guardiana sube la escuadra
shot(17.15, 'W', null, L => { knast(L); const c = put(ben, KNX + 11, 0, -12.9, 0); actuar(c, 0, [[0, { headX: -.1, aLz: .05, aRz: .05 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T);
  const g = put(WA[1], KNX + 6, 0, -11.6, .9); actuar(g, 0, [[0, { aRx: 2.4, aRz: .3, aRe: .8 }]], { T: L.T }); cara(g, L.T, { expr: 'sus' });
  heightTo(c, 1.99); onFace(c, 9, -.3, .8, 42, L.k, 7.6); sh(V(KNX + 10, 0, -12), 14); }, [[0, 'heartbeat', .6]]);
// 16 «1,99.»: zoom lento a la coronilla: queda justo por encima de la raya roja; 1,99 m en verde
shot(17.61, 'F', 'slow', L => { knast(L); const c = put(ben, KNX + 11, 0, -12.9, 0); actuar(c, 0, [[0, { headX: -.05 }]], { T: L.T }); heightTo(c, 1.99); cara(c, L.T, { expr: 'worried', eyes: 'up', mouth: 'flat' }); sweat(c, L.T);
  cm([KNX + 15, 8.6, -4], [KNX + 12.4, 8.1, -8.4], L.k); camera.lookAt(KNX + 11, 7.85, -13.8); camera.fov = 40; badge('green', '1,99 m', W / 2, H * .19, clamp((L.lt - .9) / .2), 1, 1.1); sh(V(KNX + 11, 0, -12), 10); }, [[0, 'tick', .4]]);
// 17 «Ein einziger Zentimeter»: macro del hueco de 1 cm entre la coronilla y la raya
shot(19.11, 'C', 'punch', L => { knast(L); const c = put(ben, KNX + 11, 0, -12.9, 0); cara(c, L.T, { expr: 'gasp' }); heightTo(c, 1.99); cm([KNX + 12.2, 7.9, -9.6], [KNX + 11.9, 7.9, -10.6], L.k); camera.lookAt(KNX + 11, 7.85, -13.8); camera.fov = 34;
  badge('gold', '1 cm', W / 2, H * .2, clamp(L.lt / .15), 1, 1.1); sh(V(KNX + 11, 0, -12), 10); }, [[0, 'impact', .5], [.2, 'sparkle', .5]]);
// 18 «hat mein Leben gerettet.»: salto de alegría; los demás presos me miran con envidia
shot(20.32, 'Z', null, L => { knast(L); const j = Math.abs(Math.sin(L.lt * 7)); const c = put(ben, KNX + 9, j * 1.6, -9, .2); actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .4, aRz: .4, aLe: .2, aRe: .2, lLk: j * .8, lRk: j * .8 }]], { T: L.T }); grin(c, L.T);
  for (let i = 0; i < 3; i++) { const p = put(INS[10 + i], KNX + 1 + i * 3, 0, -4 + i, .8); actuar(p, 0, [[0, 'cross']], { T: L.T }); cara(p, L.T + i, { expr: 'sus' }); }
  orb(L.k, V(KNX + 8, 4.5, -9), null, [18, .2, .12, 44], [15, .05, .1, 44]); sh(V(KNX + 6, 0, -7), 20); }, [[0, 'cheer', .4], [.2, 'jump', .5], [.6, 'land', .4]]);
// 19 «Und das ist noch harmlos.»: la guardiana me corta la alegría: señala hacia la ciudad
shot(21.42, 'S', null, L => { knast(L); const c = put(ben, KNX + 9, 0, -9, .2); actuar(c, 0, [[0, { aLx: .4, aRx: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'confused' }); const g = put(WA[1], KNX + 5, 0, -6, .4); actuar(g, L.lt, [[0, 'idle'], [.15, 'point', { dur: .3 }]], { T: L.T }); cara(g, L.T, { expr: 'smug' });
  orb(L.k, V(KNX + 7, 4.6, -7.5), null, [16, -.6, .1, 44], [14, -.8, .1, 44]); sh(V(KNX + 7, 0, -7), 16); }, [[0, 'whoosh', .4]]);
// 20 «Denn Männer dürfen hier keine Meinung haben.»: asamblea en la plaza: un hombre levanta la mano para hablar; todas le chistan «PSST!»
shot(23.02, 'W', null, L => { town(L); const m = put(rolf, -4, 0, 6, PI); actuar(m, L.lt, [[0, { aRx: 2.8, aRz: .2, aRe: .3 }], [.9, { aRx: .3, aRe: .2, headX: .4, lean: .1 }, { dur: .3 }]], { T: L.T }); cara(m, L.T, { expr: L.lt < .9 ? 'happy' : 'sad', mouth: L.lt < .9 ? 'talk' : 'frown' });
  crowdAt(L, -4, -4, 10, 6, 14, 6, { face: V(-4, 0, 6), jit: .1, mode: i => i % 2 ? 'point' : 'idle', expr: 'angry' }); bubble(EX[3], 'PSST!', clamp((L.lt - .7) / .15)); POST.push(() => { if (EX[3].root.visible) cara(EX[3], L.T, { expr: 'angry', mouth: 'o' }); });
  orb(L.k, V(-4, 4.5, 4), null, [20, 2.2, .15, 46], [17, 2.4, .12, 44]); sh(V(-4, 0, 2), 22); }, [[0, 'crowd_run', .2], [.8, 'whisper', .7]]);
// 21 «Es gibt sogar ein Gesetz dafür:»: dos guardianas destapan el cartel de la ley en la plaza
shot(24.82, 'C', null, L => { town(L); show(LAW, 6, 0, -6, -.2); const k = clamp(L.lt / .5); show(CLOTH, 6 - .16, 13 - k * 8, -5.2, -.2); CLOTH.scale.set(1, Math.max(.05, 1 - k), 1); CLOTH.visible = k < .98;
  for (const s of [-1, 1]) { const g = put(WA[s < 0 ? 0 : 2], 6 + s * 10, 0, -3, -s * .6); actuar(g, 0, [[0, { aRx: lerp(2.6, .8, k), aLx: lerp(2.6, .8, k), lean: -.1 }]], { T: L.T }); cara(g, L.T, { expr: 'smug' }); }
  crowdAt(L, 6, 6, 8, 6, 14, 7, { mode: 'clap' }); orb(L.k, V(6, 10, -6), null, [36, -.1, .05, 46], [30, -.15, .02, 46]); sh(V(6, 0, -4), 28); }, [[0, 'cloth', .6], [.2, 'fanfare', .4]]);
// 22 «Kein Uterus, kein Urteil.»: zoom lento al cartel; delante, dos hombres leen y tragan saliva
shot(26.06, 'Z', 'slow', L => { town(L); show(LAW, 6, 0, -6, -.2); for (let i = 0; i < 2; i++) { const c = put([rolf, INS[6]][i], 2 + i * 6, 0, 3, PI - .2); actuar(c, 0, [[0, { headX: -.35, aLx: .2, aRx: .2 }]], { T: L.T }); cara(c, L.T + i, { expr: i ? 'shock' : 'worried' }); }
  cm([7, 9, 28], [6.6, 12.6, 10], L.k); camera.lookAt(6, 12.8, -6); camera.fov = 44; sh(V(6, 0, -2), 24); }, [[.1, 'gasp_old', .4]]);
// ---------- b: el hermano, el tío, el primo, el padre y los Pflichtkurse (28,2 – 62,8 s) ----------
// Aula (KLX): pizarra (0, 10,5, -15,45); pupitres en x = -11, 0, 11 y z = -2, 6, 14 (silla en z + 2,8, asiento ≈ 2,6); mesa de la profe (-8, -10).
// Restaurante (REX): mesa en (0, 0) con tablero a 3,85; sillas en z = ±3,4 (asiento ≈ 2,9). Supermercado: fachada oeste en x = -43, z = -43,5.
const SEAT = 2.75, RSEAT = 2.95;
const kinder = L => klasseS(L, { board: ['KINDERGARTEN', 'GRUPPE SONNENSCHEIN'] });
const KA = KLX + 5.5, KZ0 = -7.5;
const kids = (L, n = 6) => { for (let i = 0; i < n; i++) { const c = EX[10 + i], x = KLX - 11 + (i % 3) * 11, z = 6 + Math.floor(i / 3) * 8; sit(c, x, SEAT, z + 2.8, PI, L, { aLx: .9, aRx: .9, aLe: 1, aRe: 1, headY: Math.sin(L.T + i) * .3 }); c.root.scale.setScalar(.6); c.root.position.y = SEAT + .1 - 2.05 * .6; cara(c, L.T + i, { expr: i % 2 ? 'happy' : 'neutral' }); } };

// 23 «Mein kleiner Bruder hat im Kindergarten»: Paul (≈5) en su pupitre jugando con un dinosaurio; la pizarra «KINDERGARTEN»
shot(28.20, 'W', null, L => { kinder(L); kids(L, 4); const c = sit(paulK, KLX, SEAT, -2 + 2.8, PI, L, { aRx: 1.2 + Math.sin(L.T * 6) * .3, aRe: 1.2, aLx: .9, aLe: 1.2 }); c.root.position.y = sitY(c, SEAT); grin(c, L.T); show(PONY, KLX + 1.2, 3.9, -2, 0, .6);
  cm([KLX + 4.5, 7, -11], [KLX + 3, 6.2, -7.5], L.k); camera.lookAt(KLX, 4.2, .8); camera.fov = 44; sh(V(KLX, 0, 0), 22); }, [[0, 'kids_laugh', .4], [.4, 'toy', .4]]);
// 24 «einem Mädchen widersprochen.»: Mia le dice algo; Paul niega con la cabeza y se cruza de brazos
shot(29.54, 'C', null, L => { kinder(L); const p = put(paulK, KA - 1.7, 0, KZ0, PI / 2); actuar(p, 0, [[0, { ...GEST.cross, headY: Math.sin(L.T * 12) * .35 }]], { T: L.T }); cara(p, L.T, { expr: 'determined', mouth: 'flat' });
  const m = put(mia, KA + 1.7, 0, KZ0, -PI / 2); actuar(m, 0, [[0, { aRx: 1.6, aRe: .2, lean: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'angry', mouth: 'talk_wide' }); bubble(m, 'Ponys sind die Besten!', clamp(L.lt / .15), 1.6);
  orb(L.k, V(KA, 2.6, KZ0), null, [9, .05, .12, 44], [7.8, -.05, .1, 44]); sh(V(KA, 0, KZ0), 12); }, [[0, 'gasp_f', .4], [.3, 'cloth', .3]]);
// 25 «Seitdem sitzt er in Einzelhaft.»: Paul, ya mayor, solo en la celda; los barrotes delante
shot(30.84, 'F', null, L => { zelleS(L, { tally: '12 JAHRE', n: 12 }); const c = sit(paulJ, ZEX - 3, 2.7, -7, 0, L, { headX: .45, aLx: .5, aRx: .5, aLe: 1.1, aRe: 1.1 }); cara(c, L.T, { expr: 'sad' });
  cm([ZEX + 4, 7, 15], [ZEX + 2, 6.4, 10.5], L.k); camera.lookAt(ZEX - 3, 5, -7); camera.fov = 42; sh(V(ZEX, 0, -4), 14); }, [[0, 'metal_creak', .5], [.3, 'drip', .3]]);
// 26 «Zwölf Jahre.»: las rayitas en la pared: «12 JAHRE»
shot(32.14, 'Z', 'punch', L => { zelleS(L, { tally: '12 JAHRE', n: 12 }); const c = sit(paulJ, ZEX - 3, 2.7, -7, 0, L, { headX: -.3, headY: -.4 }); cara(c, L.T, { expr: 'sad' });
  cm([ZEX - 4.5, 7.4, 1], [ZEX - 5.4, 7.3, -2.4], L.k); camera.lookAt(ZEX - 6, 7.2, -8.7); camera.fov = 44; badge('red', '12 JAHRE', W / 2, H * .2, clamp(L.lt / .15), 1, 1.0); sh(V(ZEX, 0, -4), 14); }, [[0, 'chalk', .6], [.1, 'impact', .4]]);
// 27 «Denn er hat gesagt:»: vuelta al Kindergarten: Paul se sube a la silla
shot(33.31, 'S', null, L => { kinder(L); kids(L, 5); const up = easeOut(clamp(L.lt / .4)); show(STAGE.g, 0, -500, 0); const p = put(paulK, KA, up * 1.6, KZ0, 0); { const ch_ = new THREE.Object3D(); } actuar(p, 0, [[0, { aLx: .5, aRx: 1.0, lLx: -.4 * (1 - up), lLk: .8 * (1 - up) }]], { T: L.T }); cara(p, L.T, { expr: 'determined' });
  orb(L.k, V(KA, 3.2, KZ0), null, [9, .1, .2, 44], [7.6, 0, .12, 44]); sh(V(KA, 0, KZ0), 14); }, [[0, 'chair_roll', .4]]);
// 28 «Fußball ist besser als Ponys.»: Paul con el balón, mirando a Mia: lo dice (labios); Mia con su poni se queda boquiabierta
shot(34.19, 'C', 'punch', L => { kinder(L); const p = put(paulK, KA - 1.8, 0, KZ0, PI / 2 - .3); actuar(p, 0, [[0, { aRx: 2.2, aRz: .1, aRe: .9, aLx: .4 }]], { T: L.T }); talk(p, L.T, 34.19, 35.73, 'determined'); attach(BALL, p.aR.hand, [0, -.9, .3], [0, 0, 0], .8);
  const m = put(mia, KA + 1.8, 0, KZ0, -PI / 2 + .3); actuar(m, L.lt, [[0, 'idle'], [.7, GEST.shock, { dur: .2 }]], { T: L.T }); cara(m, L.T, { expr: L.lt < .7 ? 'neutral' : 'gasp' }); attach(PONY, m.aL.hand, [0, -.9, .3], [0, 0, 0], .7);
  bubble(p, 'Fußball > Ponys!', clamp((L.lt - .1) / .15), 1.6); orb(L.k, V(KA, 2.7, KZ0), null, [9, .1, .1, 44], [7.6, 0, .08, 44]); sh(V(KA, 0, KZ0), 12); }, [[0, 'kick', .4], [.7, 'gasp_f', .6]]);
// 29 «Mein Onkel hat einer Frau vor dem Lidl»: delante del supermercado: el tío Rolf saluda a una señora con dos bolsas
shot(36.23, 'W', null, L => { town(L, { statue: false }); const w = put(tfrau, -38, 0, -46, PI / 2); actuar(w, 0, [[0, { ...GEST.hold, lean: .15, crouch: .1 }]], { T: L.T }); cara(w, L.T, { expr: 'tired' }); show(BAGS[0], -37, 0, -47.2, 0); show(BAGS[1], -37, 0, -44.8, 0);
  const r = put(rolf, -30 + L.lt * -2, 0, -46, -PI / 2); actuar(r, 0, [[0, { ...walkP(L.T, 0), aRx: 2.6, aRz: .3, aRe: .4 }]], { T: L.T }); cara(r, L.T, { expr: 'happy' }); crowdAt(L, -30, -36, 5, 8, 20, 8, { mode: 'walk' });
  orb(L.k, V(-36, 5, -46), null, [26, .9, .1, 46], [22, .7, .08, 46]); sh(V(-36, 0, -46), 24); }, [[0, 'city_amb', .5], [.4, 'steps', .4]]);
// 30 «die Einkaufstüten getragen.»: Rolf lleva las dos bolsas; ella sonríe… al principio
shot(37.76, 'C', null, L => { town(L, { statue: false }); const r = put(rolf, -34 + L.lt * 1.5, 0, -44, PI / 2 - .3); actuar(r, 0, [[0, { ...walkP(L.T, 0), aLx: .2, aRx: .2, aLz: .1, aRz: .1 }]], { T: L.T }); grin(r, L.T); attach(BAGS[0], r.aL.hand, [0, -2.2, 0], [0, 0, 0], .9); attach(BAGS[1], r.aR.hand, [0, -2.2, 0], [0, 0, 0], .9);
  const w = put(tfrau, -32 + L.lt * 1.5, 0, -48, PI / 2 - .3); actuar(w, 0, [[0, walkP(L.T, 1)]], { T: L.T }); cara(w, L.T, { expr: 'smile' }); orb(L.k, V(-32 + L.lt * 1.5, 4, -46), null, [17, 1.9, .1, 44], [15, 1.7, .08, 44]); sh(V(-32, 0, -46), 18); },
  [[0, 'paper', .5], [.3, 'steps', .4]]);
// 31 «25 Jahre.»: dos guardianas le ponen las esposas; las bolsas caen al suelo
shot(39.45, 'Z', 'punch', L => { town(L, { statue: false }); const r = put(rolf, -32, 0, -44, PI / 2); actuar(r, 0, [[0, { aLx: -.5, aRx: -.5, aLz: .2, aRz: .2, aLe: .4, aRe: .4, lean: .15 }]], { T: L.T }); cara(r, L.T, { expr: 'scream' });
  for (const s of [-1, 1]) { const g = put(WA[s < 0 ? 0 : 1], -32 + s * 2.6, 0, -46.4, s < 0 ? .7 : -.7); actuar(g, 0, [[0, { aLx: 1.2, aRx: 1.2, lean: .2 }]], { T: L.T }); cara(g, L.T, { expr: 'angry' }); }
  const f = easeIn(clamp(L.lt / .4)); show(BAGS[0], -31, 2.2 * (1 - f), -42.6, f * .8); show(BAGS[1], -30.6, 2.2 * (1 - f), -45.4, -f * 1.2); dust(V(-31, 0, -44), L.t0 + .4, L.T, 6, .6);
  badge('red', '25 JAHRE', W / 2, H * .2, clamp(L.lt / .12), 1, 1.1); orb(L.k, V(-32, 4.2, -44.6), null, [15, 1.4, .12, 44], [13, 1.6, .1, 44]); sh(V(-32, 0, -44), 16); }, [[0, 'click_metal', .7], [.35, 'thud', .5], [.4, 'siren', .3]]);
// 32 «Weil er damit angedeutet hat,»: la señora le señala furiosa; la guardiana apunta en la libreta
shot(40.72, 'F', null, L => { town(L, { statue: false }); const w = put(tfrau, -36, 0, -46, PI / 2); actuar(w, 0, [[0, { ...GEST.point, lean: .1 }]], { T: L.T }); cara(w, L.T, { expr: 'furious' });
  const g = put(WA[0], -31.5, 0, -49, -.5); actuar(g, 0, [[0, { aLx: 1.1, aLe: 1.6, aRx: 1.0, aRz: -.3, aRe: 1.8, headX: .35 }]], { T: L.T }); attach(CLIP, g.aL.hand, [0, -.4, .3], [-.4, 0, 0], 1); cara(g, L.T, { expr: 'determined' });
  onFace(w, 8, -.2, -1.6, 42, L.k, 7); sh(V(-34, 0, -46), 14); }, [[0, 'shout_m', .2], [.3, 'pencil', .5]]);
// 33 «sie wäre zu schwach dafür.»: ella levanta las dos bolsas de un tirón, como pesas; «ICH SCHAFF DAS ALLEIN!»
shot(41.78, 'C', 'punch', L => { town(L, { statue: false }); const k = easeOut(clamp(L.lt / .35)); const w = put(tfrau, -36, 0, -46, PI / 2 + .5); actuar(w, 0, [[0, { aLx: lerp(.3, 2.9, k), aRx: lerp(.3, 2.9, k), aLz: .4, aRz: .4, aLe: .4, aRe: .4, lean: -.1 }]], { T: L.T }); cara(w, L.T, { expr: 'angry', mouth: 'grin' });
  attach(BAGS[0], w.aL.hand, [0, -2.2, 0], [0, 0, 0], .9); attach(BAGS[1], w.aR.hand, [0, -2.2, 0], [0, 0, 0], .9); bubble(w, 'ICH SCHAFF DAS ALLEIN!', clamp((L.lt - .2) / .15), 3.2);
  orb(L.k, V(-36, 4.6, -46), null, [16, 2.3, -.05, 46], [14, 2.1, -.08, 44]); sh(V(-36, 0, -46), 14); }, [[0, 'whoosh_up', .5], [.3, 'impact', .4]]);
// 34 «Und mein Cousin?»: Kevin se arregla la gorra delante del espejo del restaurante y guiña
shot(43.11, 'S', null, L => { restS(L); const c = put(kevin, REX + 6, 0, 8, -.5); actuar(c, 0, [[0, { aRx: 2.6, aRz: -.2, aRe: 1.8, headZ: Math.sin(L.T * 3) * .1 }]], { T: L.T }); cara(c, L.T, { expr: 'wink' });
  onFace(c, 7, 0, .8, 42, L.k, 5.6); sh(V(REX + 6, 0, 8), 12); }, [[0, 'zip', .4], [.3, 'ding_soft', .5]]);
// 35 «Der hatte sein erstes Date.»: Kevin y Selin a la mesa, vela encendida; corazones
shot(43.97, 'W', null, L => { restS(L); const k = sit(kevin, REX, RSEAT, 3.4, PI, L, { aLx: 1.2, aRx: 1.2, aLe: 1.2, aRe: 1.2 }); grin(k, L.T); const s_ = sit(selin, REX, RSEAT, -3.4, 0, L, { aRx: 1.4, aRe: 1.8, aLx: 1.1, aLe: 1.4, headZ: .15 }); cara(s_, L.T, { expr: 'love' }); show(BILL, REX + 30, 0, 0);
  hearts(V(REX, 6, 0), L.t0, L.T, 6, .8); crowdAt(L, REX, -6, 4, 12, 18, 9, { mode: 'talk', from: 18 });
  orb(L.k, V(REX, 4.2, 0), null, [18, -1.1, .2, 44], [15, -1.3, .16, 44]); sh(V(REX, 0, 0), 16); }, [[0, 'piano_note', .4], [.3, 'spoon', .3]]);
// 36 «Am Ende hat er gesagt:»: la cuenta llega a la mesa
shot(45.39, 'C', null, L => { restS(L); const k = sit(kevin, REX, RSEAT, 3.4, PI, L, { aLx: 1.2, aRx: 1.2, aLe: 1.2, aRe: 1.2 }); cara(k, L.T, { expr: 'gasp' }); const s_ = sit(selin, REX, RSEAT, -3.4, 0, L, { aLx: 1.1, aRx: 1.1, aLe: 1.4, aRe: 1.4 }); cara(s_, L.T, { expr: 'smile' });
  show(BILL, REX + lerp(4, .4, easeOut(clamp(L.lt / .4))), 4.0, .6, .2); cm([REX + 8, 7.4, 1.4], [REX + 6.4, 6.6, 1], L.k); camera.lookAt(REX + .2, 4.2, .2); camera.fov = 44; sh(V(REX, 0, 0), 10); }, [[0, 'plate_slide', .6]]);
// 37 «Lass uns die Rechnung teilen.»: Kevin lo dice (labios) con una sonrisa; a Selin se le borra la sonrisa
shot(46.51, 'Z', null, L => { restS(L); const k = sit(kevin, REX, RSEAT, 3.4, PI, L, { aRx: 1.5, aRz: -.3, aRe: .4, aLx: 1.2, aLe: 1.2 }); talk(k, L.T, 46.51, 47.59, 'happy'); show(BILL, REX + .4, 4.0, .6, .2);
  const s_ = sit(selin, REX, RSEAT, -3.4, 0, L, { aLx: 1.1, aRx: 1.1, aLe: 1.4, aRe: 1.4 }); cara(s_, L.T, { expr: L.lt > .5 ? 'angry' : 'smile' }); bubble(k, 'Lass uns teilen!', clamp(L.lt / .15), 1.6);
  onFace(k, 7.4, 0, -1.4, 42, L.k, 6.4); sh(V(REX, 0, 0), 12); }, [[0, 'paper', .4]]);
// 38 «Lebenslang.»: las guardianas entran y se lo llevan esposado de la silla
shot(48.09, 'C', 'punch', L => { restS(L); const k = put(kevin, REX + L.lt * 2, 0, 5.6, PI); actuar(k, 0, [[0, { aLx: -.4, aRx: -.4, aLz: .2, aRz: .2, lean: -.2, lLx: .4, lRx: -.3 }]], { T: L.T }); cara(k, L.T, { expr: 'scream' });
  for (const s of [-1, 1]) { const g = put(WA[s < 0 ? 0 : 2], REX + s * 2.6 + L.lt * 2, 0, 7.2, PI); actuar(g, 0, [[0, { aLx: 1.2, aRx: 1.2, lean: -.1 }]], { T: L.T }); cara(g, L.T, { expr: 'angry' }); }
  const s_ = sit(selin, REX, RSEAT, -3.4, 0, L, { ...GEST.cross }); cara(s_, L.T, { expr: 'smug' }); badge('red', 'LEBENSLANG', W / 2, H * .2, clamp(L.lt / .12), 1, 1.1);
  orb(L.k, V(REX + 1, 4.4, 3), null, [18, -.4, .14, 44], [16, -.5, .12, 44]); sh(V(REX, 0, 3), 16); }, [[0, 'click_metal', .7], [.1, 'shout_m', .3], [.2, 'chair_roll', .4]]);
// 39 «Denn hier zahlt der Mann.»: en la caja, una fila de hombres paga; las mujeres salen sin pagar
shot(48.76, 'W', null, L => { restS(L); for (let i = 0; i < 4; i++) { const c = put(INS[12 + i], REX + 10, 0, 12 - i * 3.6, PI / 2); actuar(c, 0, [[0, { aRx: 1.4, aRe: .6, headX: .2 }]], { T: L.T }); cara(c, L.T + i, { expr: 'sad' }); }
  for (let i = 0; i < 3; i++) { const c = put(EX[i * 2], REX + 2 - L.lt * 4, 0, 14 + i * 2.6, -PI / 2); actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); cara(c, L.T + i, { expr: 'happy' }); }
  coins(V(REX + 10, 3, 12), L.t0, L.T, 8); cm([REX - 6, 7, 26], [REX - 3, 6.4, 22], L.k); camera.lookAt(REX + 6, 4, 8); camera.fov = 46; sh(V(REX + 6, 0, 10), 18); }, [[0, 'cash_reg', .6], [.4, 'coin_flip', .4]]);
// 40 «Immer.»: una cartera abierta, vacía; una polilla sale volando (primer plano)
shot(49.96, 'C', 'punch', L => { restS(L); const c = put(INS[12], REX + 10, 0, 12, PI / 2); actuar(c, 0, [[0, { aRx: 1.6, aRe: 1.4, aLx: 1.6, aLe: 1.4, headX: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'cry' }); tears(c, L.T);
  onFace(c, 6, .2, 0, 42, L.k, 5); sh(V(REX + 10, 0, 12), 10); }, [[0, 'sad_tone', .5]]);
// 41 «Auch wenn er nur Wasser bestellt hat.»: en la mesa de Kevin: su vaso de agua frente a los platos y el vino de ella
shot(50.42, 'S', null, L => { restS(L); show(BILL, REX + .4, 4.0, .6, .2); cm([REX - 3.4, 6.2, -4], [REX - 2.6, 5.4, -3.2], L.k); camera.lookAt(REX - 1.6, 4.4, -1.2); camera.fov = 38; badge('cyan', '0 €', W / 2, H * .2, clamp((L.lt - .3) / .15), 1, 1); sh(V(REX, 0, 0), 8); }, [[0, 'water_bloop', .6], [.4, 'glass_rattle', .3]]);
// 42 «Mein Vater sagt, früher war alles andersrum.»: en el patio, el viejo Dieter cuenta su historia a los presos jóvenes (labios)
shot(51.80, 'R', null, L => { knast(L); const d = sit(dieter, KNX - 4, 2.4, 6, .3, L, { aRx: 1.3 + Math.sin(L.T * 3) * .3, aRz: -.2, aRe: .8, aLx: .7, aLe: 1.2 }); talk(d, L.T, 52.85, 54.13, 'warm');
  crowdAt(L, KNX - 4, 6, 5, 6, 10, 11, { list: INS, from: 4, face: V(KNX - 4, 0, 6), jit: .15, mode: 'idle', expr: 'confused' });
  orb(L.k, V(KNX - 4, 4, 6), null, [16, .6, .14, 44], [13, .4, .12, 44]); sh(V(KNX - 4, 0, 6), 18); }, [[0, 'wind', .3], [.4, 'cough', .3]]);
// 43 «Keiner glaubt ihm.»: los jóvenes se ríen y se van; Dieter suspira
shot(54.30, 'C', null, L => { knast(L); const d = sit(dieter, KNX - 4, 2.4, 6, .3, L, { headX: .4, aLx: .3, aRx: .3 }); cara(d, L.T, { expr: 'sad' });
  crowdAt(L, KNX - 4, 6, 5, 6, 10, 11, { list: INS, from: 4, face: V(KNX - 4, 0, 6), jit: .15, mode: i => i % 2 ? 'cheer' : 'walk', speed: -1.2 });
  onFace(d, 8, .3, 1, 42, L.k, 7); sh(V(KNX - 4, 0, 6), 14); }, [[0, 'laugh_deep', .5], [.3, 'sigh', .5]]);
// 44 «Im Gefängnis gibt es sogar Pflichtkurse.»: aula de la cárcel: presos en pupitres; la profe golpea la pizarra
const kursRoom = (L, t, n = 6) => { klasseS(L, { board: t }); for (let i = 0; i < n; i++) { const c = INS[i], x = KLX - 11 + (i % 3) * 11, z = -2 + Math.floor(i / 3) * 8; sit(c, x, SEAT, z + 2.8, PI, L, { aLx: .9, aRx: .9, aLe: 1, aRe: 1 }); } };
shot(55.24, 'W', null, L => { kursRoom(L, ['PFLICHTKURSE', 'FÜR MÄNNER']); INS.slice(0, 6).forEach((c, i) => cara(c, L.T + i, { expr: 'bored' })); const t = put(lehr, KLX + 4, 0, -11, 0); actuar(t, L.lt, [[0, { aRx: 2.4, aRz: -.2, aRe: .5, headY: -.4 }], [.5, { aRx: 2.0, aRe: .8 }, { dur: .15 }]], { T: L.T }); cara(t, L.T, { expr: 'angry' });
  cm([KLX + 12, 10, 22], [KLX + 6, 9, 15], L.k); camera.lookAt(KLX, 6, -6); camera.fov = 46; sh(V(KLX, 0, 0), 22); }, [[0, 'classroom', .4], [.5, 'knock', .6]]);
// 45 «Zuhören für Anfänger»: la pizarra; los presos se llevan la mano a la oreja
shot(57.27, 'Z', null, L => { kursRoom(L, ['ZUHÖREN FÜR ANFÄNGER', 'KURS 1']); INS.slice(0, 6).forEach((c, i) => { actuar(c, 0, [[0, { ...sitPose(GEST.listen) }]], { T: L.T, weight: false }); cara(c, L.T + i, { expr: 'confused' }); });
  cm([KLX - 6, 8, 12], [KLX - 3, 9.4, 4], L.k); camera.lookAt(KLX, 9.6, -15); camera.fov = 44; sh(V(KLX, 0, 0), 22); }, [[0, 'chalk', .6]]);
// 46 «Entschuldigen ohne Grund»: todos de pie se inclinan pidiendo perdón a la vez
shot(58.55, 'F', null, L => { klasseS(L, { board: ['ENTSCHULDIGEN OHNE GRUND', 'KURS 2'] }); for (let i = 0; i < 6; i++) { const c = put(INS[i], KLX - 10 + i * 4, 0, -5.4 - (i % 2) * .6, PI); const b = .5 + .4 * Math.sin(clamp(L.lt / .5) * PI / 2); actuar(c, 0, [[0, { lean: b, headX: .3, aLx: .3, aRx: .3, aLz: -.1, aRz: -.1 }]], { T: L.T }); cara(c, L.T + i, { expr: 'sad', eyes: 'closed' }); }
  const t = put(lehr, KLX - 8, 0, -12.5, .4); actuar(t, 0, [[0, 'cross']], { T: L.T }); cara(t, L.T, { expr: 'smug' });
  cm([KLX + 9, 7.6, -14], [KLX + 6, 8, -14.4], L.k); camera.lookAt(KLX, 4, -4); camera.fov = 48; sh(V(KLX, 0, -4), 22); }, [[0, 'cloth', .5], [.2, 'whisper', .5]]);
// 47 «Und mein Lieblingskurs:»: yo (Ben) en mi pupitre, sonriendo con el lápiz preparado
shot(59.92, 'S', null, L => { kursRoom(L, ['', ''], 0); const c = sit(ben, KLX, SEAT, 2.8, PI, L, { aRx: 1.1, aRe: 1.5, aLx: .9, aLe: 1.2 }); grin(c, L.T);
  onFace(c, 8.4, -.4, -.8, 42, L.k, 7.2); sh(V(KLX, 0, 2), 12); }, [[0, 'pencil', .5]]);
// 48 «Recht haben ist nicht wichtig»: levanto la mano para opinar; la profe me manda callar y bajo la mano
shot(60.84, 'C', 'punch', L => { kursRoom(L, ['RECHT HABEN IST NICHT WICHTIG', 'KURS 3']); INS.slice(0, 6).forEach((c, i) => cara(c, L.T + i, { expr: 'bored' }));
  const c = sit(ben, KLX, SEAT, 10.8, PI, L, {}); actuar(c, L.lt, [[0, sitPose({ aRx: 2.9, aRe: .2 })], [.9, sitPose({ aRx: .6, aRe: 1.2, headX: .4 }), { dur: .3 }]], { T: L.T, weight: false }); cara(c, L.T, { expr: L.lt < .9 ? 'happy' : 'sad' });
  const t = put(lehr, KLX + 2, 0, -8, PI + .2); actuar(t, 0, [[0, { aRx: 2.2, aRz: -.4, aRe: 2.3, headX: .1 }]], { T: L.T }); cara(t, L.T, { expr: 'angry', mouth: 'o' }); bubble(t, 'PSST!', clamp((L.lt - .5) / .15), 1.6);
  cm([KLX + 16, 9, 8], [KLX + 15, 8.4, 5], L.k); camera.lookAt(KLX + 1, 6, 1); camera.fov = 48; sh(V(KLX, 0, 2), 22); }, [[0, 'chalk', .5], [.6, 'whisper', .6], [1.0, 'sad_tone', .3]]);
// ---------- c: «Aber ich war anders» — mis buenas obras, la cuenta atrás y la libertad (62,8 – 103,0 s) ----------
// Droguería (DRX): estanterías x = ±14 (z -15…7), caja en (0, 9). Gimnasio (THX): colchonetas en x -9…9, z -4/3; pancarta z = -21,7.
// Noche en Frauenstein: carretera x = 0 hacia +z (z > 65); farolas en x = ±34.
const SBP = n => [n, n === '10.000' ? '#5aff9a' : '#ffd23f'];
const halo = (c, T) => { const h = hp(c); show(HALO, h.x, h.y + 2.1 * (c.spec.scale || 1) + Math.sin(T * 3) * .08, h.z); HALO.rotation.set(PI / 2, 0, T); };

// 49 «Aber ich war anders.»: en el patio todos holgazanean; yo barro el suelo junto a una guardiana
shot(62.82, 'W', null, L => { knast(L, { sb: ['120 / 10.000'] }); yard(L, 6, { mode: i => ['sitb', 'idle', 'talk'][i % 3], expr: 'bored', from: 2 }); const c = put(ben, KNX + 4, 0, 2, -.5); actuar(c, 0, [[0, { aLx: 1.0, aRx: 1.2, aLz: -.2, aRz: -.4, aLe: .9, aRe: .9, lean: .2 + Math.sin(L.T * 8) * .05, twist: Math.sin(L.T * 8) * .25 }]], { T: L.T }); grin(c, L.T); POST.push(() => { const h = wpos(c.aR.hand); show(BROOM, h.x, 3.1, h.z + .4, 0); BROOM.rotation.set(.25, 0, Math.sin(L.T * 8) * .25); });
  orb(L.k, V(KNX + 3, 4, 2), null, [18, .5, .14, 46], [14, .3, .12, 44]); sh(V(KNX + 2, 0, 3), 22); }, [[0, 'brush', .6], [.4, 'whistle_inno', .4]]);
// 50 «Ich war praktisch die Mutter Teresa dieser Stadt.»: yo con una aureola dorada, rayos de luz; dos mujeres juntan las manos emocionadas
shot(63.98, 'Z', 'slow', L => { knast(L); const c = put(ben, KNX, 0, 4, 0); actuar(c, 0, [[0, { aLx: .5, aRx: .5, aLz: -.35, aRz: -.35, aLe: 1.6, aRe: 1.6, headX: -.15 }]], { T: L.T }); cara(c, L.T, { expr: 'relief' }); halo(c, L.T);
  for (const s of [-1, 1]) { const w = put(EX[s < 0 ? 4 : 2], KNX + s * 4.5, 0, 6.5, s < 0 ? .9 : -.9); actuar(w, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.5, aRz: -.5, aLe: 1.9, aRe: 1.9, headX: -.2 }]], { T: L.T }); cara(w, L.T, { expr: 'love' }); }
  hearts(V(KNX, 7, 4), L.t0, L.T, 6, .7); grade.uniforms.lift.value = .03 * L.k; orb(L.k, V(KNX, 5, 4), null, [18, 0, .1, 46], [12, 0, .06, 42]); sh(V(KNX, 0, 4), 16); }, [[0, 'choir', .6], [.3, 'sparkle', .5]]);
// 51 «Ich habe dafür gekämpft,»: en la plaza, yo con la pancarta «GRATIS BINDEN!» delante de una multitud de mujeres
shot(66.32, 'W', null, L => { town(L); const c = put(ben, 0, 0, 0, 0); const j = Math.abs(Math.sin(L.T * 6)); actuar(c, 0, [[0, { aRx: 2.7 + j * .2, aRe: .3, aLx: 1.2, aLz: .4, aLe: 1.6 }]], { T: L.T }); cara(c, L.T, { expr: 'shout' }); attach(PROTEST, c.aR.hand, [0, -.5, 0], [-PI / 2, 0, 0], 1);
  crowdAt(L, 0, -6, 14, 5, 16, 12, { mode: i => i % 2 ? 'cheer' : 'clap' }); orb(L.k, V(0, 6, 0), null, [24, .2, .05, 46], [20, .1, .02, 46]); sh(V(0, 0, -4), 26); }, [[0, 'crowd_run', .3], [.2, 'cheer', .5], [.6, 'shout_m', .3]]);
// 52 «dass Binden und Tampons»: estanterías rosa (BINDEN) y lila (TAMPONS) de la droguería
shot(67.50, 'C', null, L => { drogS(L); cm([DRX - 6, 5.6, 4], [DRX - 7.6, 5, -2], L.k); camera.lookAt(DRX - 12, 4.2, -6); camera.fov = 44; sh(V(DRX, 0, 0), 22); }, [[0, 'rummage', .5]]);
// 53 «bei dm und Rossmann»: la droguería llena: mujeres llenando las cestas felices
shot(68.54, 'S', null, L => { drogS(L); crowdAt(L, DRX, -3, 7, 3, 9, 13, { mode: i => ['cheer', 'talk', 'walk', 'clap'][i % 4], speed: 1.2 }); const k = put(EX[7], DRX - 9, 0, 4, -PI / 2); actuar(k, 0, [[0, { aRx: 1.8, aRe: .3, lean: .1 }]], { T: L.T }); grin(k, L.T);
  cm([DRX + 8, 9, 22], [DRX + 4, 8, 17], L.k); camera.lookAt(DRX - 2, 4, -6); camera.fov = 48; sh(V(DRX, 0, 0), 24); }, [[0, 'door_bell', .5], [.3, 'kids_laugh', .2], [.6, 'rummage', .4]]);
// 54 «komplett gratis sind.»: la cajera tacha el precio: 0,00 €; ella se lleva una caja gratis
shot(69.64, 'Z', 'punch', L => { drogS(L); const cs = put(EX[8], DRX - 2, 0, 6, 0); actuar(cs, 0, [[0, { aRx: 2.6, aRz: .3, aRe: .4 }]], { T: L.T }); cara(cs, L.T, { expr: 'joy' }); const cu = put(EX[9], DRX + 1.6, 0, 12.5, PI); actuar(cu, 0, [[0, { aLx: 1.4, aRx: 1.4, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); grin(cu, L.T);
  badge('green', '0,00 €', W / 2, H * .2, clamp(L.lt / .12), 1, 1.2); confetti(V(DRX, 2, 9), L.t0 + .1, L.T, 40, .8); orb(L.k, V(DRX, 4.6, 9), null, [16, .45, .14, 46], [14, .35, .12, 44]); sh(V(DRX, 0, 9), 16); }, [[0, 'cash_reg', .7], [.1, 'confetti', .5], [.3, 'cheer', .3]]);
// 55 «Dann habe ich mit Uber Nachtfahrten organisiert,»: de noche: un coche con «NACHTFAHRT 0 €» avanza por la calle iluminada
shot(71.05, 'W', null, L => { town(L, { night: true, statue: false }); show(TAXI, -3, 0, 124 - L.lt * 22, PI); crowdAt(L, -10, 104, 3, 2, 5, 14, { mode: 'walk', speed: 1.5 });
  cm([-12, 3.6, 62], [-11, 3.2, 70], L.k); camera.lookAt(-3, 3, 104 - L.lt * 16); camera.fov = 44; sh(V(4, 0, 100), 30); }, [[0, 'car', .6], [.4, 'crickets', .3]]);
// 56 «damit jede Frau nach zehn Uhr»: bajo una farola, una mujer mira el móvil: son las 22:00
shot(73.23, 'C', null, L => { town(L, { night: true, statue: false }); const w = put(hfrau, -6, 0, 80, .3); actuar(w, 0, [[0, 'phone_look']], { T: L.T }); cara(w, L.T, { expr: 'worried' }); attach(PHONE, w.aR.hand, [0, -.6, .4], [-.5, PI, 0], .8);
  badge('cyan', '22:00', W / 2, H * .2, clamp(L.lt / .15), 1, 1.1); onFace(w, 9, .4, 2.4, 44, L.k, 8); sh(V(-6, 0, 80), 14); }, [[0, 'owl', .3], [.3, 'notif', .5]]);
// 57 «kostenlos und sicher nach Hause kommt.»: el coche para; ella sube y se despide sonriendo; yo le hago el pulgar desde la acera
shot(74.69, 'S', null, L => { town(L, { night: true, statue: false }); const k = clamp(L.lt / .9); show(TAXI, -1, 0, lerp(96, 84, easeOut(k)), PI); const w = put(hfrau, -6 + k * 2.4, 0, 82, PI / 2); actuar(w, 0, [[0, k < 1 ? walkP(L.T, 0) : 'wave']], { T: L.T }); cara(w, L.T, { expr: 'happy' });
  const b = put(ben, -9, 0, 76, .7); actuar(b, 0, [[0, { aRx: 1.6, aRz: -.3, aRe: 1.6 }]], { T: L.T }); grin(b, L.T); badge('green', '0 €', W / 2, H * .2, clamp((L.lt - .4) / .15), 1, 1.1);
  orb(L.k, V(-4, 4, 82), null, [20, -.25, .12, 46], [17, -.1, .1, 46]); sh(V(-4, 0, 82), 20); }, [[0, 'car', .4], [.6, 'door_open', .5], [1.1, 'ding_soft', .5]]);
// 58 «Ich habe sogar Selbstverteidigung»: en el gimnasio, chicas practicando patadas sobre las colchonetas
shot(76.78, 'W', null, L => { hallS(L); for (let i = 0; i < 6; i++) { const c = EX[i * 2 + (i > 2 ? 1 : 0)], x = THX - 9 + (i % 3) * 9, z = -4 + Math.floor(i / 3) * 7; put(c, x, .7, z, 0); const kk = Math.max(0, Math.sin(L.T * 5 + i)); actuar(c, 0, [[0, { lRx: -1.6 * kk, lRk: .2, aLx: 1.3, aRx: 1.3, aLe: 2, aRe: 2, lean: -.15 * kk }]], { T: L.T }); cara(c, L.T + i, { expr: 'determined' }); }
  cm([THX + 12, 12, 22], [THX + 6, 10, 18], L.k); camera.lookAt(THX, 3, -2); camera.fov = 46; sh(V(THX, 0, 0), 24); }, [[0, 'whoosh', .5], [.4, 'kick', .5], [.8, 'kick', .5]]);
// 59 «als Schulfach durchgesetzt.»: la pancarta «SELBSTVERTEIDIGUNG · PFLICHTFACH»; la profe pita
shot(78.32, 'C', null, L => { hallS(L); const t = put(lehr, THX + 6, 0, -12, -.4); actuar(t, 0, [[0, { aRx: 2.3, aRz: -.5, aRe: 2.4, headX: -.1 }]], { T: L.T }); cara(t, L.T, { expr: 'determined', mouth: 'o' });
  cm([THX + 2, 8, 4], [THX + 1, 12, -2], L.k); camera.lookAt(THX, 16, -21.7); camera.fov = 46; sh(V(THX, 0, -10), 20); }, [[0, 'whistle', .7]]);
// 60 «Für jedes Mädchen.»: una fila de niñas pequeñas da un puñetazo al aire a la vez
shot(79.28, 'F', null, L => { hallS(L); for (let i = 0; i < 5; i++) { const c = i === 2 ? mia : EX[14 + i], x = THX - 5 + i * 2.5; put(c, x, .7, 0, 0); if (c !== mia) c.root.scale.setScalar(.6); const p = clamp((L.lt - .3) / .12); actuar(c, 0, [[0, { aRx: lerp(1.0, 1.6, p), aRe: lerp(2, .1, p), aLx: 1.0, aLe: 2, lean: .1 * p, lLx: -.3, lRx: .3 }]], { T: L.T }); cara(c, L.T + i, { expr: 'shout' }); }
  cm([THX, 3.6, 13], [THX, 3.3, 11], L.k); camera.lookAt(THX, 2.8, 0); camera.fov = 46; sh(V(THX, 0, 0), 16); }, [[.3, 'punch', .5], [.35, 'shout_m', .2]]);
// 61 «Ab der ersten Klasse.»: Mia (6) me lanza por encima del hombro y caigo de espaldas en la colchoneta
shot(80.66, 'Z', 'punch', L => { hallS(L); const m = put(mia, THX, .7, 0, 0); actuar(m, 0, [[0, { aLx: 2.6, aRx: 2.6, aLe: .6, aRe: .6, lean: .5 }]], { T: L.T }); cara(m, L.T, { expr: 'determined' });
  const k = easeInOut(clamp(L.lt / .6)); const b = put(ben, THX + lerp(0, 0, k), .7 + Math.sin(k * PI) * 5, lerp(-2.4, 3.8, k), 0); b.root.rotation.x = -k * PI * 1.05; actuar(b, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: .5, aRz: .5, lLx: -.5, lRx: .5 }]], { T: L.T }); cara(b, L.T, { expr: 'panic' });
  badge('gold', '1. KLASSE', W / 2, H * .18, clamp((L.lt - .6) / .15), 1, 1.1); dust(V(THX, .8, 4), L.t0 + .6, L.T, 8, .7); orb(L.k, V(THX, 4.6, 1), null, [24, 1.3, .2, 48], [21, 1.4, .16, 48]); sh(V(THX, 0, 1), 16); }, [[0, 'whoosh', .6], [.6, 'thud', .8], [.7, 'back_crack', .4]]);
// 62 «Und nein, ich habe das nicht nur wegen der Punkte gemacht.»: yo a cámara, serio, con la mano en el pecho; detrás el marcador sube
shot(81.96, 'S', null, L => { knast(L, { sb: [String(Math.round(lerp(6200, 7400, L.k))).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' / 10.000'] }); const c = put(ben, KNX - 18, 0, 4, .3); actuar(c, 0, [[0, { aRx: 1.2, aRz: -.6, aRe: 1.8, headY: Math.sin(L.T * 4) * .15 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  onBody(c, 15, 0, .1, 44, L.k, 12.5); sh(V(KNX - 18, 0, 2), 22); }, [[0, 'hum', .3]]);
// 63 «Okay.»: miro de reojo; una gota de sudor
shot(84.54, 'C', null, L => { knast(L); const c = put(ben, KNX - 18, 0, 4, .3); cara(c, L.T, { expr: 'side_r', mouth: 'grimace' }); sweat(c, L.T, 1); onFace(c, 6.6, 0, 0, 40, L.k, 6); sh(V(KNX - 18, 0, 4), 12); }, [[0, 'boing_metal', .3]]);
// 64 «Vielleicht ein bisschen.»: sonrisa pícara y el gesto de «un poquito» con los dedos
shot(85.17, 'I', null, L => { knast(L); const c = put(ben, KNX - 18, 0, 4, .3); actuar(c, 0, [[0, { aRx: 1.6, aRz: -.3, aRe: 1.2, headZ: .2 }]], { T: L.T }); grin(c, L.T); badge('gold', 'EIN BISSCHEN', W / 2, H * .2, clamp((L.lt - .2) / .15), 1, 1); onFace(c, 8, 0, 0, 42, L.k, 7); sh(V(KNX - 18, 0, 4), 12); }, [[0, 'pop', .5]]);
// 65 «Punkt für Punkt kam ich näher.»: el marcador corre de 8.000 a 9.990; yo lo miro con los puños apretados
shot(86.18, 'W', null, L => { const n = Math.round(lerp(8000, 9990, easeOut(L.k)) / 10) * 10; knast(L, { sb: [n.toLocaleString('de-DE') + ' / 10.000'] }); const c = put(ben, KNX - 18, 0, 6, PI - .3); actuar(c, 0, [[0, { ...GEST.fists, headX: -.4 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  cm([KNX - 10, 6, 22], [KNX - 13, 10, 16], L.k); camera.lookAt(KNX - 23, 15, -12); camera.fov = 46; sh(V(KNX - 20, 0, 0), 26); }, [[0, 'ticks', .5], [.6, 'count', .4]]);
// 66 «9.990.»: zoom lento al marcador: 9.990 / 10.000
shot(87.80, 'Z', 'slow', L => { knast(L, { sb: ['9.990 / 10.000'] }); cm([KNX - 17, 14, 14], [KNX - 21.5, 17.6, 2], L.k, easeIn); camera.lookAt(KNX - 24, 18, -12); camera.fov = 44; sh(V(KNX - 22, 0, 0), 30); }, [[0, 'heartbeat', .5]]);
// 67 «Mir fehlte nur noch eine einzige gute Tat.»: yo en la plaza buscando desesperado a quién ayudar; «+10?»
shot(90.10, 'C', null, L => { town(L); const c = put(ben, 0, 0, 10, Math.sin(L.T * 3) * .9); actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: .5, aRz: .5, aLe: 1, aRe: 1, headY: Math.sin(L.T * 5) * .4 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); sweat(c, L.T);
  crowdAt(L, 0, 4, 10, 8, 22, 15, { mode: 'walk', speed: 2 }); badge('gold', '+10 ?', W / 2, H * .2, clamp(L.lt / .15), 1, 1); orb(L.k, V(0, 4.5, 10), null, [18, .2, .2, 46], [15, -.2, .15, 44]); sh(V(0, 0, 8), 22); }, [[0, 'city_amb', .4], [.4, 'tick', .4]]);
// 68 «Dann hat eine Frau vor mir ihr Handy fallen lassen.»: el móvil cae a cámara lenta de su bolso al adoquín
shot(92.45, 'S', null, L => { town(L); const w = put(hfrau, 2 + L.lt * 2, 0, 4, PI / 2); actuar(w, 0, [[0, walkP(L.T, 0)]], { T: L.T }); cara(w, L.T, { expr: 'neutral' }); const f = clamp((L.lt - .3) / 1.2); const p = V(2.6 + .3 * L.lt, lerp(4.2, .2, easeIn(f)), 4.8);
  show(PHONE, p.x, p.y, p.z); PHONE.rotation.set(f * 4, f * 2, f * 3); if (f >= 1) PHONE.rotation.set(-PI / 2, 0, .4);
  const b = put(ben, -3, 0, 9, .6); actuar(b, 0, [[0, { aLx: .6, aRx: .6 }]], { T: L.T }); cara(b, L.T, { expr: 'gasp' });
  cm([6, 2, 14], [5, 1.6, 11], L.k); camera.lookAt(2.4, lerp(3, .6, L.k), 4.8); camera.fov = 42; sh(V(2, 0, 5), 14); }, [[.3, 'whoosh_down', .4], [1.5, 'glass_crack', .2], [1.55, 'thud', .5]]);
// 69 «Wenn ich es aufhebe:»: mi mano duda sobre el móvil
shot(94.69, 'C', null, L => { town(L); show(PHONE, 3.2, .2, 4.8); PHONE.rotation.set(-PI / 2, 0, .4); const b = put(ben, 3.2, 0, 8, PI); actuar(b, 0, [[0, { crouch: .4, lean: .55, aRx: 1.5 + Math.sin(L.T * 10) * .1, aRe: .4, headX: .4 }]], { T: L.T, weight: false }); cara(b, L.T, { expr: 'worried' }); sweat(b, L.T);
  cm([8, 3.2, 3.4], [7, 2.6, 4], L.k); camera.lookAt(3.2, 1.4, 5.6); camera.fov = 44; sh(V(3, 0, 6), 10); }, [[0, 'heartbeat', .5]]);
// 70 «zehn Punkte.»: imagino el marcador: +10 en verde
shot(95.44, 'Z', 'punch', L => { town(L); show(PHONE, 3.2, .2, 4.8); PHONE.rotation.set(-PI / 2, 0, .4); const b = put(ben, 3.2, 0, 8, PI); actuar(b, 0, [[0, { crouch: .4, lean: .55, aRx: 1.5, aRe: .4, headX: .2 }]], { T: L.T, weight: false }); grin(b, L.T);
  badge('green', '+10', W / 2, H * .22, clamp(L.lt / .12), 1, 1.3); onFace(b, 7, 0, 0, 42, L.k, 6); sh(V(3, 0, 6), 10); }, [[0, 'ding_soft', .7], [.05, 'coin_flip', .5]]);
// 71 «Oder 25 Jahre, wie mein Onkel.»: destello: el tío Rolf detrás de los barrotes, saludando triste
shot(96.41, 'R', null, L => { zelleS(L, { tally: '25 JAHRE', n: 25 }); const r = put(rolfJ, ZEX, 0, 5.6, 0); actuar(r, 0, [[0, { aLx: 2.0, aLz: .2, aLe: 1.4, aRx: 2.7, aRz: .3 + Math.sin(L.T * 8) * .3, aRe: .4 }]], { T: L.T }); cara(r, L.T, { expr: 'sad' }); tears(r, L.T);
  badge('red', '25 JAHRE', W / 2, H * .19, clamp((L.lt - .2) / .15), 1, 1.1); TINT = 'rgba(60,20,20,.18)'; orb(L.k, V(ZEX, 6, 5.6), null, [11, 0, .05, 42], [9, .1, .05, 42]); sh(V(ZEX, 0, 4), 12); }, [[0, 'metal_creak', .5], [.3, 'sad_tone', .5]]);
// 72 «Also habe ich gefragt:»: me acerco a la mujer con el móvil en alto, nervioso
shot(98.65, 'W', null, L => { town(L); const w = put(hfrau, 4, 0, 2, -.3); actuar(w, 0, [[0, { aLx: .4 }]], { T: L.T }); cara(w, L.T, { expr: 'confused' }); const b = put(ben, 1.4 + L.lt, 0, 6.4, PI - .6); actuar(b, 0, [[0, { aLx: .4, aRx: 1.3, aRe: .6 }]], { T: L.T }); cara(b, L.T, { expr: 'worried' }); attach(PHONE, b.aR.hand, [0, -.6, .3], [0, 0, 0], .8); sweat(b, L.T);
  orb(L.k, V(3, 4.6, 4), null, [16, 1.4, .12, 44], [13, 1.2, .1, 44]); sh(V(3, 0, 4), 14); }, [[0, 'steps', .4]]);
// 73 «Darf ich dir helfen?»: primer plano: lo pregunto (labios)
shot(99.63, 'C', null, L => { town(L); const b = put(ben, 2.6, 0, 6, PI - .5); actuar(b, 0, [[0, { aRx: 1.3, aRe: .6 }]], { T: L.T }); talk(b, L.T, 99.63, 100.21, 'worried'); attach(PHONE, b.aR.hand, [0, -.6, .3], [0, 0, 0], .8); bubble(b, 'Darf ich dir helfen?', clamp(L.lt / .12), 1.4);
  onFace(b, 7.2, 0, 1.2, 42, L.k, 6.4); sh(V(3, 0, 4), 12); }, [[0, 'breath', .3]]);
// 74 «Sie hat genickt.»: ella asiente despacio; la cámara se le acerca
shot(100.46, 'F', 'slow', L => { town(L); const w = put(hfrau, 4, 0, 2, -.6 + PI * 0); w.root.rotation.y = faceTo(V(4, 0, 2), V(2.6, 0, 6)); actuar(w, 0, [[0, { headX: .35 * Math.max(0, Math.sin(clamp(L.lt / .8) * PI * 2)) }]], { T: L.T }); cara(w, L.T, { expr: 'smile' });
  onFace(w, 8, 0, 0, 42, L.k, 6); sh(V(4, 0, 2), 12); }, []);
// 75 «Zehntausend.»: el marcador salta a 10.000 en verde; fuegos y confeti
shot(101.46, 'Z', 'punch', L => { knast(L, { sb: ['10.000 / 10.000', '#5aff9a', 'FREI!'] }); confRain(V(KNX - 24, 0, -6), L.T, 60, 30, 16, 26); cm([KNX - 14, 8, 22], [KNX - 18, 12, 16], L.k); camera.lookAt(KNX - 24, 17, -12); camera.fov = 48; sh(V(KNX - 22, 0, 0), 30); },
  [[0, 'firework', .6], [.05, 'magic_hit', .6], [.2, 'cheer', .5]]);
// 76 «Ich war frei.»: el portón se abre; salgo al sol con los brazos en alto
shot(102.18, 'C', null, L => { knast(L, { sb: ['10.000 / 10.000', '#5aff9a', 'FREI!'] }); gateAt(1 - L.lt / .4); const c = put(ben, KNX, 0, -12 + L.lt * 5, 0); actuar(c, 0, [[0, { ...walkP(L.T, 0), aLx: 2.9, aRx: 2.9, aLz: .4, aRz: .4, aLe: .2, aRe: .2 }]], { T: L.T }); laughF(c, L.T);
  grade.uniforms.flash.value = Math.max(0, .35 - L.lt); orb(L.k, V(KNX, 5, -10 + L.lt * 5), null, [18, 0, .05, 48], [15, 0, .05, 46]); sh(V(KNX, 0, -8), 18); }, [[0, 'metal_creak', .6], [.2, 'birds', .5]]);
// ---------- d: la gloria, la calle, la donación, los MacBooks y el remate (103,0 – 134,6 s) ----------
// Escenario de la plaza: STAGE en (0, 0, 20) mirando +z (tablero a 3,2). Letrero de la calle en (36, 0, 26). FRAUENHAUS: fachada este x = 43, z = -17,5.
const STZ = 20, SGX = -28, SGZ = 12;
const stageOn = () => { STAGE.g.visible = true; STAGE.g.position.set(0, 0, STZ); STAGE.g.rotation.y = 0; };
const signOn = (L, k = 0) => { if (SSIGN.SIGN.parent !== SSIGN.g) SSIGN.g.add(SSIGN.SIGN); show(SSIGN.g, SGX, 0, SGZ, .5); SSIGN.SIGN.rotation.set(0, 0, k * .9); SSIGN.SIGN.position.set(k * 1.5, 13.2 - k * 3, 0); };

// 77 «Die Frauen haben mich gefeiert.»: en la plaza me lanzan al aire; confeti
shot(102.99, 'W', null, L => { town(L); const j = Math.abs(Math.sin(L.lt * 4)); const c = put(benC, 0, 6 + j * 4, 8, 0); c.blob.visible = false; actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .5, aRz: .5, aLe: .2, aRe: .2, lLx: -.3, lRx: .3 }]], { T: L.T }); laughF(c, L.T);
  for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; const w = put(EX[i], Math.cos(a) * 3, 0, 8 + Math.sin(a) * 3, a + PI / 2 + PI); actuar(w, 0, [[0, { aLx: 2.9, aRx: 2.9, aLe: .2, aRe: .2 }]], { T: L.T }); laughF(w, L.T + i); w.root.rotation.y = faceTo(w.root.position, V(0, 0, 8)); }
  crowdAt(L, 0, 4, 10, 8, 20, 16, { mode: 'cheer', from: 6 }); confRain(V(0, 0, 8), L.T, 70, 24, 24, 20); orb(L.k, V(0, 7, 8), null, [26, .1, .05, 48], [22, -.1, .02, 46]); sh(V(0, 0, 6), 26); }, [[0, 'cheer', .6], [.2, 'party_horn', .5], [.5, 'confetti', .4]]);
// 78 «Die Bürgermeisterin hat mir einen Orden gegeben.»: en el escenario, la alcaldesa me cuelga la medalla; pancarta HELD DER FRAUENRECHTE
shot(104.67, 'C', null, L => { town(L); stageOn(); const c = put(benC, 1.6, 3.2, STZ + 1, -.25); actuar(c, 0, [[0, { headX: .2, aLx: .2, aRx: .2 }]], { T: L.T }); grin(c, L.T); const m = put(bm, -1.8, 3.2, STZ + 1, .5); const k = clamp(L.lt / .7); actuar(m, 0, [[0, { aLx: lerp(1.2, 1.8, k), aRx: lerp(1.2, 1.8, k), aLe: lerp(1.2, .6, k), aRe: lerp(1.2, .6, k), lean: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'smile' });
  show(MEDAL, lerp(-.4, 1.5, k), lerp(9.4, 8.6, k) + 3.2 - 3.2, STZ + 1.6, -.25); crowdAt(L, 0, STZ + 12, 10, 3, 12, 17, { mode: 'clap' });
  cm([6, 10, STZ + 22], [3, 9, STZ + 15], L.k); camera.lookAt(0, 8, STZ); camera.fov = 44; sh(V(0, 0, STZ + 4), 22); }, [[0, 'fanfare', .4], [.6, 'click_metal', .4], [.7, 'cheer', .4]]);
// 79 «Orden gegeben.»: primer plano de la medalla de oro brillando en mi pecho
shot(105.89, 'Z', 'punch', L => { town(L); stageOn(); const c = put(benC, 1.6, 3.2, STZ + 1, -.25); grin(c, L.T); const n = wpos(c.spine).add(V(.15, .9, .9)); show(MEDAL, n.x, n.y, n.z + .1, -.25); MEDAL.rotation.z = Math.sin(L.T * 3) * .15;
  cm([n.x + 1.2, n.y + .4, n.z + 6], [n.x + .9, n.y + .3, n.z + 4.8], L.k); camera.lookAt(n.x, n.y + .2, n.z); camera.fov = 40; sh(V(0, 0, STZ), 10); }, [[0, 'sparkle', .6], [.1, 'ding_soft', .5]]);
// 80 «Sie haben sogar eine Straße nach mir benannt.»: descubren el letrero azul: «Ben-Hartmann-Straße»; la gente aplaude
shot(106.51, 'S', null, L => { town(L, { statue: false }); signOn(L); const c = put(benC, SGX + 3.5, 0, SGZ + 5, .2); actuar(c, 0, [[0, { aRx: 2.6, aRz: .4, aRe: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'gasp' }); crowdAt(L, SGX + 4, SGZ + 10, 8, 4, 12, 18, { mode: 'clap', face: V(SGX, 0, SGZ) });
  cm([SGX + 12, 6, SGZ + 22], [SGX + 8, 10, SGZ + 16], L.k); camera.lookAt(SGX, 11.5, SGZ); camera.fov = 44; sh(V(SGX + 2, 0, SGZ + 4), 22); }, [[0, 'cheer', .5], [.2, 'bells', .4]]);
// 81 «Straße nach mir benannt.»: el letrero de cerca
shot(107.53, 'C', null, L => { town(L, { statue: false }); signOn(L); const s = wpos(SSIGN.SIGN); cm([s.x + 4, s.y - 1.4, s.z + 9], [s.x + 3, s.y - .8, s.z + 7.4], L.k); camera.lookAt(s.x, s.y, s.z); camera.fov = 40; sh(V(SGX, 0, SGZ), 16); }, [[0, 'magic_hit', .4]]);
// 82 «Aber ich habe das Schild selbst abgeschraubt.»: subo la escalera con el destornillador
shot(108.76, 'Z', null, L => { town(L, { statue: false }); signOn(L); show(LADDER, SGX + .5, 0, SGZ + 1, .5); LADDER.rotation.x = -.12; const y = lerp(2, 4.2, easeOut(clamp(L.lt / .6))); const c = put(benC, SGX + 1.1, y, SGZ + 2.1, PI + .5); c.blob.visible = false; actuar(c, 0, [[0, { aRx: 2.8, aRz: .2, aRe: .4, aLx: 2.2, aLe: .6, lLx: .4, lLk: .6 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); attach(SCREW, c.aR.hand, [0, -.4, .3], [PI / 2, 0, 0], 1);
  crowdAt(L, SGX + 4, SGZ + 14, 5, 4, 10, 19, { mode: 'point', face: V(SGX, 6, SGZ) }); cm([SGX + 13, 8, SGZ + 18], [SGX + 10, 10, SGZ + 14], L.k); camera.lookAt(SGX, 9, SGZ + 1); camera.fov = 46; sh(V(SGX, 0, SGZ + 2), 18); }, [[0, 'wood_creak', .5], [.4, 'steps', .3]]);
// 83 «abgeschraubt.»: el tornillo gira y sale; el letrero se inclina
shot(110.06, 'C', 'punch', L => { town(L, { statue: false }); const k = easeIn(clamp((L.lt - .25) / .4)); signOn(L, k); const sc = SSIGN.SCR[1]; sc.position.z = .2 + clamp(L.lt / .25) * .6; sc.rotation.y = L.T * 20;
  const s = wpos(SSIGN.SIGN); cm([s.x + 6.5, s.y + .6, s.z + 5], [s.x + 5.8, s.y + .4, s.z + 4], L.k); camera.lookAt(s.x + 3.5, s.y, s.z); camera.fov = 40; sh(V(SGX, 0, SGZ), 14); }, [[0, 'ratchet', .7], [.35, 'metal_creak', .5]]);
// 84 «Denn ein Mann sollte keine Straße dafür kriegen,»: abajo, con el letrero en las manos, niego con la cabeza humilde; las mujeres suspiran (corazones)
shot(110.82, 'W', null, L => { town(L, { statue: false }); const c = put(benC, SGX + 6, 0, SGZ + 8, .2); actuar(c, 0, [[0, { ...GEST.hold, headY: Math.sin(L.T * 7) * .3 }]], { T: L.T }); cara(c, L.T, { expr: 'relief' }); attach(SSIGN.SIGN, c.aL.hand, [1.2, -.6, .9], [0, -PI / 2, 0], .55);
  crowdAt(L, SGX + 6, SGZ + 8, 8, 5, 12, 20, { mode: 'idle', expr: 'love', face: V(SGX + 6, 0, SGZ + 8) }); hearts(V(SGX + 6, 6, SGZ + 8), L.t0, L.T, 8, .9); onBody(c, 16, 0, .1, 44, L.k, 13); sh(V(SGX + 6, 0, SGZ + 8), 18); }, [[0, 'gasp_f', .4], [.3, 'hug', .3]]);
// 85 «dass er einfach das Richtige tut.»: entrego el letrero a una vecina y sonrío modesto
shot(112.91, 'S', null, L => { town(L, { statue: false }); const c = put(benC, SGX + 6, 0, SGZ + 8, .2); actuar(c, 0, [[0, { aRx: 1.4, aRe: .4, aLx: 1.4, aLe: .4, lean: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'smile' }); const w = put(EX[4], SGX + 2.6, 0, SGZ + 10.4, .9 + PI / 2 + .3); actuar(w, 0, [[0, { aLx: 1.4, aRx: 1.4, aLe: .5, aRe: .5 }]], { T: L.T }); cara(w, L.T, { expr: 'love' });
  orb(L.k, V(SGX + 4.4, 4.6, SGZ + 9), null, [15, -.3, .12, 44], [13, -.45, .1, 44]); sh(V(SGX + 4, 0, SGZ + 9), 14); }, [[0, 'whoosh', .3], [.3, 'ding_soft', .4]]);
// 86 «Deshalb habe ich das ganze Preisgeld,»: abro un maletín lleno de billetes
shot(114.57, 'C', null, L => { town(L, { statue: false }); const c = put(benC, -30, 0, -14, PI / 2); actuar(c, 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: .8, aRe: .8 }]], { T: L.T }); grin(c, L.T); coins(V(-27, 2, -14), L.t0, L.T, 10);
  onBody(c, 16, -.2, .12, 44, L.k, 13); sh(V(-30, 0, -14), 14); }, [[0, 'briefcase', .6], [.3, 'money_rain', .5]]);
// 87 «50.000 Euro,»: el cheque gigante: 50.000 €
shot(116.10, 'Z', 'punch', L => { town(L, { statue: false }); const c = put(benC, 38, 0, 13.5, -PI / 2); actuar(c, 0, [[0, { aLx: 2.0, aRx: 2.0, aLz: .3, aRz: .3, aLe: .4, aRe: .4 }]], { T: L.T }); grin(c, L.T); show(CHECK, 36.2, 7.8, 13.5, -PI / 2);
  badge('gold', '50.000 €', W / 2, H * .19, clamp(L.lt / .12), 1, 1.1); cm([22, 8, 15], [25, 8, 14], L.k); camera.lookAt(37, 6.4, 13.5); camera.fov = 46; sh(V(36, 0, 13.5), 16); }, [[0, 'cash', .6], [.05, 'impact', .4]]);
// 88 «dem Frauenhaus gespendet.»: delante del FRAUENHAUS, las mujeres reciben el cheque y me abrazan
shot(117.39, 'W', null, L => { town(L, { statue: false }); const c = put(benC, 36, 0, 16, -PI / 2 - .3); actuar(c, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.4, aRz: -.4, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(c, L.T, { expr: 'relief' });
  for (let i = 0; i < 3; i++) { const w = put(EX[i * 3 + 1], 39.5, 0, 12 + i * 2.2, -PI / 2 + .4 - i * .2); actuar(w, 0, [[0, i === 1 ? { aLx: 2.0, aRx: 2.0, aLe: .4, aRe: .4 } : { aLx: 1.3, aRx: 1.3, aLz: -.4, aRz: -.4, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(w, L.T + i, { expr: 'joy' }); }
  show(CHECK, 39.8, 8, 14, -PI / 2, .7); hearts(V(38, 7, 14), L.t0, L.T, 6, .8); cm([18, 7, 25], [22, 6.6, 21], L.k); camera.lookAt(40, 6, 14); camera.fov = 46; sh(V(38, 0, 14), 18); }, [[0, 'hug', .5], [.3, 'cheer', .4], [.6, 'kids_laugh', .2]]);
// 89 «Und ich habe sogar gratis Programmierkurse für Mädchen gestartet.»: aula con portátiles: chicas programando; pizarra «PROGRAMMIEREN»
const laps = (L, n = 6) => { for (let i = 0; i < n; i++) { const x = KLX - 11 + (i % 3) * 11, z = -2 + Math.floor(i / 3) * 8; show(LAPS[i], x, 3.9, z, PI); LAPS[i].userData.S && LAPS[i].userData.S.draw && LAPS[i].userData.S.draw(Math.floor(L.T * 6), (c, w, h) => { c.fillStyle = '#14161e'; c.fillRect(0, 0, w, h); for (let k = 0; k < 9; k++) { c.fillStyle = ['#5aff9a', '#7ad8ff', '#ffd23f', '#ff8ad0'][(k + i) % 4]; c.fillRect(14 + (k % 3) * 12, 14 + k * 20, 60 + ((k * 37 + i * 11 + Math.floor(L.T * 6)) % 180), 8); } }); } };
shot(118.91, 'S', null, L => { klasseS(L, { board: ['PROGRAMMIEREN', 'GRATIS · NUR FÜR MÄDCHEN'] }); laps(L); for (let i = 0; i < 6; i++) { const c = EX[i * 2 + 1], x = KLX - 11 + (i % 3) * 11, z = -2 + Math.floor(i / 3) * 8; sit(c, x, SEAT, z - 2.8, 0, L, { aLx: 1.3, aRx: 1.3, aLe: 1.4 + Math.sin(L.T * 20 + i) * .1, aRe: 1.4, headX: .25 }); cara(c, L.T + i, { expr: 'determined' }); }
  cm([KLX - 14, 10, -14], [KLX - 9, 9, -11], L.k); camera.lookAt(KLX + 2, 4, 4); camera.fov = 48; sh(V(KLX, 0, 2), 22); }, [[0, 'clack', .6], [.4, 'clack', .5], [.8, 'clack', .5]]);
// 90 «für Mädchen gestartet.»: primer plano: una chica teclea y sonríe; en la pantalla, código de colores
shot(120.63, 'C', null, L => { klasseS(L, { board: ['PROGRAMMIEREN', 'GRATIS · NUR FÜR MÄDCHEN'] }); laps(L, 1); const c = sit(mia, KLX - 11, SEAT, -4.8, 0, L, { aLx: 1.3, aRx: 1.3, aLe: 1.4 + Math.sin(L.T * 20) * .15, aRe: 1.4, headX: .3 }); grin(c, L.T);
  cm([KLX - 8.4, 6.4, .6], [KLX - 9, 6, -.6], L.k); camera.lookAt(KLX - 11, 4.6, -4.6); camera.fov = 42; sh(V(KLX - 11, 0, -3), 10); }, [[0, 'clack', .6], [.5, 'notif', .4]]);
// 91 «Jede hat ihr eigenes MacBook bekommen.»: todas levantan su portátil gritando de alegría; yo aplaudo al fondo
shot(121.47, 'F', null, L => { klasseS(L, { board: ['PROGRAMMIEREN', 'GRATIS · NUR FÜR MÄDCHEN'] }); for (let i = 0; i < 6; i++) { const c = EX[i * 2 + 1], x = KLX - 11 + (i % 3) * 11, z = -2 + Math.floor(i / 3) * 8; const j = Math.abs(Math.sin(L.T * 7 + i)); put(c, x, j * .5, z + 2, PI); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .2, aRz: .2, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(c, L.T + i); attach(LAPS[i], c.aR.hand, [-.9, -.8, 0], [0, 0, 0], .6); }
  const b = put(benC, KLX + 6, 0, -9, .2); actuar(b, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.2 - Math.abs(Math.sin(L.T * 14)) * .25, aRz: -.2 - Math.abs(Math.sin(L.T * 14)) * .25, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); grin(b, L.T);
  cm([KLX + 4, 9, 24], [KLX + 2, 8.6, 20], L.k); camera.lookAt(KLX, 5, 0); camera.fov = 48; sh(V(KLX, 0, 2), 24); }, [[0, 'cheer', .6], [.2, 'kids_laugh', .4]]);
// 92 «Am Ende war ich der größte Feminist der ganzen Stadt.»: grúa lenta: yo en el escenario con el puño en alto, la estatua al fondo, la plaza llena
shot(123.50, 'W', 'slow', L => { town(L); stageOn(); const c = put(benC, 0, 3.2, STZ + 1, 0); actuar(c, 0, [[0, { aRx: 2.9, aRz: .1, aRe: .1, aLx: .3 }]], { T: L.T }); grin(c, L.T); halo(c, L.T);
  crowdAt(L, 0, STZ + 14, 20, 3, 18, 21, { mode: i => i % 2 ? 'cheer' : 'clap', face: V(0, 0, STZ) }); confRain(V(0, 0, STZ + 6), L.T, 50, 26, 20, 22);
  cm([0, 6, STZ + 34], [0, 20, STZ + 48], L.k); camera.lookAt(0, lerp(7, 14, L.k), STZ - 10); camera.fov = 46; sh(V(0, 0, STZ + 6), 34); }, [[0, 'cheer', .5], [.3, 'choir', .4]]);
// 93 «Und trotzdem habe ich bis heute keine Freundin.»: al atardecer, solo en un banco; una pareja pasa de la mano
shot(126.22, 'C', null, L => { town(L, { dusk: true, statue: false }); const c = sit(benC, -40, 2.4, 6, PI / 2, L, { headX: .45, aLx: .4, aRx: .4, aLe: .8, aRe: .8 }); cara(c, L.T, { expr: 'sad' });
  for (let i = 0; i < 2; i++) { const w = put([jana, kevin][i], -30 + L.lt * 3, 0, 1 + i * 2.2, PI / 2); actuar(w, 0, [[0, { ...walkP(L.T, i), [i ? 'aLx' : 'aRx']: .5, [i ? 'aLz' : 'aRz']: -.4 }]], { T: L.T }); cara(w, L.T + i, { expr: 'love' }); }
  orb(L.k, V(-38, 4, 5), null, [17, 1.25, .12, 44], [14, 1.4, .1, 44]); sh(V(-36, 0, 4), 18); }, [[0, 'sad_tone', .5], [.3, 'birds', .2]]);
// 94 «keine Freundin.»: primer plano triste; una lágrima
shot(127.62, 'I', null, L => { town(L, { dusk: true, statue: false }); const c = sit(benC, -40, 2.4, 6, PI / 2, L, { headX: .2 }); cara(c, L.T, { expr: 'cry' }); tears(c, L.T); onFace(c, 6.4, 0, 0, 40, L.k, 5.6); sh(V(-40, 0, 6), 10); }, [[0, 'sniff', .5]]);
// 95 «Die Letzte hat gesagt:»: flashback en el café: Jana frente a mí, yo con flores
shot(128.55, 'S', null, L => { restS(L); const b = sit(benC, REX, RSEAT, 3.4, PI, L, { aRx: 1.4, aRe: .6, aLx: 1.1, aLe: 1.2 }); grin(b, L.T); const j = sit(jana, REX, RSEAT, -3.4, 0, L, { aLx: 1.1, aRx: 1.1, aLe: 1.4, aRe: 1.4 }); cara(j, L.T, { expr: 'smile' });
  orb(L.k, V(REX, 4.4, 0), null, [17, 1.3, .16, 44], [14.5, 1.45, .14, 44]); sh(V(REX, 0, 0), 14); }, [[0, 'piano_note', .4]]);
// 96 «Du bist echt süß.»: Jana me lo dice (labios) y me pellizca la mejilla
shot(129.55, 'C', null, L => { restS(L); const j = sit(jana, REX, RSEAT, -3.4, 0, L, { aRx: 2.0, aRz: -.1, aRe: .6, aLx: 1.1, aLe: 1.4, lean: .1 }); talk(j, L.T, 129.55, 130.53, 'smile'); hearts(V(REX, 7, -2), L.t0, L.T, 3, .5);
  onFace(j, 6.4, .2, 3.4, 42, L.k, 5.6); sh(V(REX, 0, -3), 12); }, [[0, 'pop', .3]]);
// 97 «Aber ich stehe eher auf Bad Boys.»: ella mira por la ventana soñadora; yo me quedo blanco
shot(130.64, 'Z', null, L => { restS(L); const b = sit(benC, REX, RSEAT, 3.4, PI, L, { aLx: .9, aRx: .9, aLe: 1.2, aRe: 1.2 }); cara(b, L.T, { expr: 'shock' }); const j = sit(jana, REX, RSEAT, -3.4, 0, L, { headY: .7, headX: -.2, aRx: 1.9, aRz: -.4, aRe: 2.2 }); talk(j, L.T, 130.64, 132.12, 'love');
  cm([REX - 8, 7, 3], [REX - 7, 6.6, 2], L.k); camera.lookAt(REX, 5, 0); camera.fov = 44; sh(V(REX, 0, 0), 12); }, [[0, 'sad_tone', .4]]);
// 98 «Auf die, die noch drinsitzen.»: en la celda: Kevin detrás de los barrotes le guiña; Jana le saluda enamorada desde fuera; yo, a su lado, me tapo la cara
shot(132.42, 'C', 'punch', L => { zelleS(L, { tally: 'LEBENSLANG', n: 20 }); const k = put(kevinJ, ZEX + 1, 0, 4.6, PI - .5); actuar(k, 0, [[0, { aRx: 2.6, aRz: .3 + Math.sin(L.T * 8) * .25, aRe: .4, aLx: 1.8, aLe: 1.6 }]], { T: L.T }); cara(k, L.T, { expr: 'wink' });
  const j = put(jana, ZEX - 3, 0, 10.2, 2.5); actuar(j, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .3, aRe: .3, headZ: .2 }]], { T: L.T }); cara(j, L.T, { expr: 'love' }); hearts(V(ZEX - 1, 7, 8), L.t0, L.T, 5, .6);
  const b = put(benC, ZEX + 5, 0, 11.6, .7); actuar(b, 0, [[0, 'facepalm']], { T: L.T }); cara(b, L.T, { expr: 'sad' });
  cm([ZEX + 11, 6.4, 19], [ZEX + 9, 6, 16.5], L.k); camera.lookAt(ZEX, 5, 7.5); camera.fov = 48; sh(V(ZEX, 0, 8), 16); }, [[0, 'slam', .4], [.3, 'laugh_deep', .3], [.7, 'sad_tone', .5], [1.4, 'boing_metal', .3]]);


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4, B: 8 };
const CUES = [];
const TRS = { W: ['whoosh_soft', 'swipe', 'whoosh_down'], Z: ['swoosh_up', 'zoom_in', 'whoosh_up'], F: ['flash', 'click_set', 'sparkle'], S: ['swipe', 'tape', 'whoosh_soft'], R: ['whirl', 'clock_spin', 'whoosh'], I: ['iris_pop', 'pop', 'pling'], C: ['thump', 'impact_soft', 'fist'], B: ['soft_air', 'soft_air', 'soft_air'] };
let lastTr = '';
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.tr && i + 1 < S.length) { const L_ = TRS[s.tr]; let n = L_[i % L_.length]; if (n === lastTr) n = L_[(i + 1) % L_.length]; lastTr = n; CUES.push({ t: +(s.t1 - TRW[s.tr] / FPS * .5).toFixed(3), s: n, g: .45, tr: 1 }); }
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  if (s.zoom === 'punch') CUES.push({ t: s.t0, s: 'impact', g: .6 }); });
CUES.push({ t: 0, s: 'zoom_fast', g: .9 }); CUES.push({ t: 0, s: 'ding_reveal', g: .5 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD_.length = 0; s.fn(L); while (POST.length) POST.shift()();
  if (HQ) { renderer.toneMappingExposure *= +(QS.get('exp') ?? .85); grade.uniforms.sat.value = +(QS.get('sat') ?? 1.2); grade.uniforms.sharp.value = .45; grade.uniforms.vig.value = Math.min(grade.uniforms.vig.value, .3); bloom.strength = Math.max(bloom.strength, .22); bloom.threshold = .8; ao.enabled = QS.get('ao') !== '0'; DOF = 1; }
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud', 'kick'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = BLUR;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, MODE === 'night' ? 'noche' : 'polvo', MODE === 'in' ? .3 : .4);
  if (BIRDS.update) BIRDS.update(T, camera.position.clone().addScaledVector(dir, 60).add(V(0, 25, 0)), (MODE === 'day') && BIRDSON ? 1 : 0);
  sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position);
  { const fd = camera.position.distanceTo(CAMT); bokeh.uniforms.focus.value = fd; bokeh.uniforms.aperture.value = DOF * .0022 * clamp((26 - fd) / 14); bokeh.enabled = HQ && QS.get('dof') !== '0'; }
  composer.render(); BLUR = 0;
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
  if (tr === 'B') { octx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`; octx.fillRect(0, 0, W, H); }   // fundido a negro suave (momentos tristes)
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { applyPose, hp, ben, renderer, composer, bloom, sun, grade, scene, camera, KN };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

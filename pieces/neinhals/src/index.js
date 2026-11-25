// NEINHALS — «In dieser Stadt wird dein Hals jedes Mal länger, wenn du Nein sagst» (y un «Nein» mentiroso: diez metros de golpe).
// Luca nunca ha dicho que no: todos se aprovechan de él… hasta que hereda el Halswerk en quiebra, arregla la Hals-Schrumpf-Maschine,
// se hace rico encogiendo cuellos y, al final, le dice su primer «Nein» a Marco. Ciudad propia: Brauheim (pueblo alpino de entramado).
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT } from './props.js';
import { makeExtra } from './ecast.js';
import { lindenthal, schule } from './nsets.js';
import { kueche, klasse, barrio } from './svsets.js';
import { brauKeller, bankBuero, lights } from './bwelt.js';
import { hals, neckAt, pretzel, phoneBig, drawFeed, ladder } from './hals.js';
import { fabrik, halle, schloss, insel, oldtimer, sportwagen, litfass, billboard, drawAd, palm, cloud, glowM, txt as ntxt } from './nwelt.js';
import { makeLuca, makeMann, makeSchwieger, makeMama, makeVogt, makeTimo, makeJana, makeMarco, makeKranich, makeArbeiter, makeBM } from './nvolk.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 175.6, U = W / 720;
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
const M2U = 3.95;
// ---------- escenarios ----------
// Brauheim (x = 0): plaza adoquinada z ∈ [-85, 65], casas a x = ±52 (fachadas en x = ±43), carretera hacia +z, iglesia z = -120, Maibaum (18,-14), fuente (-14,-26).
const LT = lindenthal(scene, { name: 'BRAUHEIM', shops: { 2: 'BÄCKEREI', 5: 'GASTHOF ADLER', 9: 'CAFÉ', 12: 'METZGEREI' } });
const KUX = 1400, KLX = 2200, KEX = 3000, BAX = 3800, FAX = 4600, HAX = 5600, SCX = 6600, INX = 7600, SUX = 8600, BKX = 9400;
const KU = kueche(scene, KUX), KL = klasse(scene, KLX), KE = brauKeller(scene, KEX), BA = barrio(scene, BAX), FA = fabrik(scene, FAX), HA = halle(scene, HAX), SC = schloss(scene, SCX), IN = insel(scene, INX), SU = schule(scene, SUX), BK = bankBuero(scene, BKX);
const SETS = { LT: LT.g, KU: KU.g, KL: KL.g, KE: KE.g, BA: BA.g, FA: FA.g, HA: HA.g, SC: SC.g, IN: IN.g, SU: SU.g, BK: BK.g };
for (const k of ['LT', 'KU', 'KL', 'KE', 'BA', 'SU', 'BK']) outline(SETS[k], OS);
// ---------- reparto ----------
const luca = makeLuca(scene), mann = makeMann(scene), schw = makeSchwieger(scene), mama = makeMama(scene), vogt = makeVogt(scene), timo = makeTimo(scene), jana = makeJana(scene), marco = makeMarco(scene), kranich = makeKranich(scene), bm = makeBM(scene);
const ARB = [0, 1, 2].map(i => makeArbeiter(scene, i));
kitFace(luca, 'hero'); [schw, mama, jana].forEach(c => kitFace(c, 'girl')); [mann, vogt, kranich, bm].forEach(c => kitFace(c, 'mustache')); [timo, marco, ...ARB].forEach(c => kitFace(c, 'plain'));
const EX = Array.from({ length: 34 }, (_, i) => makeExtra(scene, i + 40)); EX.forEach((c, i) => kitFace(c, ['girl', 'plain', 'girl', 'hero', 'girl', 'mustache'][i % 6]));
const CR = EX;
const MAIN = [luca, mann, schw, mama, vogt, timo, jana, marco, kranich, bm, ...ARB];
const POOL = [...MAIN, ...EX];
POOL.forEach(c => outline(c.root, OC));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(.5, 'rgba(0,0,0,.26)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -Math.PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const PROPS = [];
const P_ = o => { if (!o.parent) scene.add(o); PROPS.push(o); return o; };
const OLD = P_(oldtimer(scene)), PORSCHE = P_(sportwagen(scene, 0xd8202a, { rim: 0xc8ccd4, plate: 'B-RH 911' })), WAGEN = Array.from({ length: 12 }, (_, i) => P_(sportwagen(scene, [0xd8202a, 0xffd21a, 0x2a6ad8, 0x1a1a1a, 0xf4f4f4, 0x3ab84a, 0xff7a1a, 0x8a3ad8, 0x2ad8e8, 0xff5aa8, 0xc8ccd4, 0x6a4a2a][i])));
const LITF = P_(litfass(scene, (c, w, h) => { c.fillStyle = '#f4ead0'; c.fillRect(0, 0, w, h); for (let k = 0; k < 4; k++) { c.save(); c.translate(k * w / 4, 0); drawAd(c, w / 4, h); c.restore(); } }));
const BILLB = P_(billboard(scene, 26, 13, (c, w, h) => drawAd(c, w, h)));
const PH = P_(phoneBig(scene)); PH.traverse(o => { if (o.isMesh) o.castShadow = true; });
const BROT = P_(pretzel(scene)); const BOOKS = P_(new THREE.Group()); { for (let k = 0; k < 9; k++) { const b = box(2.4, .5, 1.8, mat([0xd8323a, 0x2a6ad8, 0xffd21a, 0x3ab84a, 0x8a3ad8][k % 5], { roughness: .7 }), .05, BOOKS, (k % 2) * .2, .25 + k * .52, 0); b.rotation.y = (k % 3 - 1) * .1; } }
const SPONGE = P_(box(1, .5, .7, mat(0xffd21a, { roughness: 1 }), .15, scene)); const BUCKET = P_(new THREE.Group()); { cyl(.9, .7, 1.4, mat(0x2a8ad8, { roughness: .5 }), 16, BUCKET, 0, .7, 0); cyl(.82, .82, .05, mat(0xffffff, { roughness: 1 }), 16, BUCKET, 0, 1.3, 0); }
const BROOM = P_(new THREE.Group()); { cyl(.08, .08, 6, mat(0x9a6a3a), 6, BROOM, 0, 0, 0); box(1.6, .6, .4, mat(0xd8323a), .1, BROOM, 0, -3.1, 0); }
const KEYS = P_(new THREE.Group()); scene.add(KEYS); { const r = new THREE.Mesh(new THREE.TorusGeometry(.3, .06, 6, 16), mat(0xd8a020, { metalness: .9 })); KEYS.add(r); for (let k = 0; k < 2; k++) { const b = box(.14, .9, .06, mat(0xd8a020, { metalness: .9 }), .02, KEYS, -.2 + k * .4, -.6, 0); b.rotation.z = (k - .5) * .5; } }
const CANE = P_(new THREE.Group()); { cyl(.09, .09, 4.4, mat(0xf2c230, { metalness: .9, roughness: .2 }), 8, CANE, 0, 0, 0); sphere(.24, mat(0xf2c230, { metalness: .9 }), CANE, 0, 2.2, 0, 10, 8); }
const POSTERS = Array.from({ length: 4 }, () => P_(textPlane(4, 5.6, 300, 420, (c, w, h) => drawAd(c, w, h))));
const BEER = P_(new THREE.Group()); { const gl = mat(0xffffff, { roughness: .05, transparent: true, opacity: .45 }); cyl(.55, .5, 1.6, mat(0xf6a81c, { roughness: .2, emissive: 0x6a3800, emissiveIntensity: .3 }), 14, BEER, 0, .8, 0); cyl(.6, .55, 1.7, gl, 14, BEER, 0, .85, 0); cyl(.6, .6, .3, mat(0xfffbf0), 14, BEER, 0, 1.75, 0); const hd = new THREE.Mesh(new THREE.TorusGeometry(.4, .1, 6, 12, Math.PI), gl); hd.position.set(.6, .9, 0); hd.rotation.z = -Math.PI / 2; BEER.add(hd); }
const PLATE = P_(new THREE.Group()); { cyl(1.4, 1.2, .14, mat(0xffffff, { roughness: .3 }), 20, PLATE, 0, 0, 0); for (let k = 0; k < 9; k++) { const f = box(.16, .16, 1.2, mat(0xffd23f, { roughness: .6 }), .02, PLATE, (k % 3 - 1) * .4, .2 + Math.floor(k / 3) * .12, (k % 2) * .3); f.rotation.y = k; } }
const HOOD = P_(new THREE.Group()); { const t = cyl(.9, .9, .1, mat(0x3a3a3a, { metalness: .6 }), 20, HOOD, 0, 0, 0); }
// billetes y monedas
const BILLT = {}; for (const [d, col] of [[50, '#f08a2a'], [100, '#3aa85a'], [200, '#d8b43a'], [500, '#8a4ad8']]) BILLT[d] = canvasTex(256, 128, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(10, 10, w - 20, h - 20); c.fillStyle = col; c.beginPath(); c.arc(w * .7, h / 2, 40, 0, 7); c.fill(); c.fillStyle = '#ffffff'; c.font = `700 64px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(d), w * .3, h / 2 + 4); c.font = `700 40px ${FONT}`; c.fillText('€', w * .7, h / 2 + 3); c.strokeStyle = '#ffffff'; c.lineWidth = 5; c.strokeRect(4, 4, w - 8, h - 8); });
const BILL = Array.from({ length: 110 }, (_, i) => { const d = [50, 100, 200, 500][i % 4]; const m = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshStandardMaterial({ map: BILLT[d], side: THREE.DoubleSide, roughness: .7 })); m.castShadow = true; scene.add(m); m.userData.d = d; return P_(m); });
const COIN = Array.from({ length: 30 }, () => { const m = cyl(.5, .5, .12, mat(0xffd23f, { metalness: .9, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .3 }), 18, scene); m.rotation.x = Math.PI / 2; return P_(m); });
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xffd23f, 0xffffff, 0x3a7ad8, 0xff4a8a, 0x8ad84a][i % 5], side: THREE.DoubleSide })); scene.add(p); return P_(p); });
const DUST = Array.from({ length: 16 }, () => P_(sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8)));
const SWEAT = Array.from({ length: 3 }, () => P_(sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const TEAR = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8)));
const FOAMP = Array.from({ length: 30 }, () => P_(sphere(1, mat(0xffffff, { roughness: .9, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const VAPOR = Array.from({ length: 14 }, () => P_(sphere(1, mat(0xf4f4f8, { roughness: 1, transparent: true, opacity: .7, depthWrite: false }), scene, 0, 0, 0, 10, 8)));
const SPARK = Array.from({ length: 24 }, () => P_(sphere(.18, glowM(0xfff4a0, 3), scene, 0, 0, 0, 6, 4)));
const ZZZ = Array.from({ length: 3 }, () => P_(textPlane(2, 2, 100, 100, (c, w, h) => { c.font = `700 80px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 10; c.strokeStyle = '#1a2a5a'; c.strokeText('Z', 50, 54); c.fillStyle = '#ffffff'; c.fillText('Z', 50, 54); })));
const CLOUDS = Array.from({ length: 14 }, (_, i) => P_(cloud(scene, 0, 0, 0, 1)));
// cuello enrollado a una casa (tubo) + cabeza durmiendo en el tejado
const SKINM = mat(0xf2c4a0, { roughness: .55 }); const WRAP = P_(new THREE.Mesh(new THREE.BufferGeometry(), SKINM)); WRAP.castShadow = true; outline(WRAP, 1.6);
const setWrap = pts => { WRAP.geometry.dispose(); WRAP.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, .42, 10); };

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
  for (const k in SETS) SETS[k].visible = false; FX2D.length = 0; FACES.length = 0; for (const c of POOL) hals(c, 0); HA.on(0); HA.LASER.material.opacity = 0;
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
function crowdAt(L, cx, cz, n, r0, r1, seed = 1, o = {}) { POST.push(() => { const list = (o.list || CR).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc_ = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.2), ac + 6.283 - (o.gap ?? 1.2)];
  const placed = o.avoid ? [...o.avoid] : [];
  list.forEach((c, i) => { let x, z, tries = 0; do { const a = arc_[0] + (i + r() * .8) / list.length * (arc_[1] - arc_[0]); const d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; tries++; } while (tries < 10 && placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 3.6));
    placed.push([x, z]); crowdGuy(c, x, z, L, i, o); }); }); }
function crowdGuy(c, x, z, L, i, o) { crowdGuy0(c, x, z, L, i, o); if (o.neck != null) { const n = typeof o.neck === 'function' ? o.neck(i) : o.neck; if (n > .05) hals(c, n, { T: L.T, bend: ((i * 5) % 3 - 1) * .05, sway: .06 }); } }
function crowdGuy0(c, x, z, L, i, o) { const T = L.T + i * .37, face = o.face || camera.position; let ry = o.ry ?? (Math.atan2(face.x - x, face.z - z) + Math.sin(i * 7.3) * (o.jit ?? .35));
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
function town(L, o = {}) { use('LT'); if (o.night) { night(30); renderer.toneMappingExposure = .9; TINT = 'rgba(10,16,60,.18)'; } else if (o.dusk) dusk(); else day(); }
function kuecheS(L) { use('KU'); inside(1.05, 42); FILL.color.setRGB(1, .94, .84); }
function klasseS(L) { use('KL'); inside(1.05, 42); }
function kellerS(L) { use('KE'); inside(.55, 22); FILL.color.setRGB(1, .86, .62); renderer.toneMappingExposure = .9; bloom.strength = .26; }
function barrioS(L) { use('BA'); day(); }
function fabrikS(L) { use('FA'); day(); FA.GATE.children.forEach(d => { if (d.name && d.name.startsWith('door')) d.rotation.y = 0; }); }
function halleS(L, k = 0) { use('HA'); inside(1.05, 40); FILL.color.setRGB(.95, .98, 1); HA.RINGS.forEach((r, i) => { r.rotation.y = 0; r.position.y = 5 + i * 3.4; }); HA.LASER.scale.set(1, 1, 1); HA.BTN.material.emissiveIntensity = .3; HA.BTN.position.y = 5.6; HA.SCR('ONLINE', '#2aff6a'); plugIn(1); }
function schlossS(L) { use('SC'); day(); }
function inselS(L) { use('IN'); day(); }
function schuleS(L) { use('SU'); day(); }
function bankS(L) { use('BK'); inside(1.0, 40); }

// ---------- dinero ----------
const FACES = [];
const faceDir = ch => V(Math.sin(ch.root.rotation.y), 0, Math.cos(ch.root.rotation.y));
function billRain(c, T, n = 60, sx = 16, sz = 10, h = 16, clear = 4) { BILL.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 17 + 5); f.visible = true; const y = h - ((T * (2.2 + r() * 1.6) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2.4 + i) * .8, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(Math.sin(T * 3 + i) * .9, T * 2 + i, Math.cos(T * 2.6 + i) * .6);
  const cx = camera.position.x - c.x, cz = camera.position.z - c.z, L2 = Math.hypot(cx, cz) || 1, px = f.position.x - c.x, pz = f.position.z - c.z, along = (px * cx + pz * cz) / L2, perp = (px * -cz + pz * cx) / L2; if (along > 0 && Math.abs(perp) < clear) { const sg = perp < 0 ? -1 : 1; f.position.x += (-cz / L2) * sg * (clear - Math.abs(perp)); f.position.z += (cx / L2) * sg * (clear - Math.abs(perp)); } }); }
// lluvia que empieza en T0 (cae desde arriba, no aparece de golpe)
function billFall(c, T0, T, n = 40, sx = 14, sz = 8, h = 14, from = 0) { BILL.forEach((f, i) => { if (i < from || i >= from + n) return; const r = RNG(i * 23 + 7), t = T - T0 - r() * .5; if (t < 0) return; f.visible = true; const y = Math.max(.05, h + r() * 6 - t * (5 + r() * 3)); f.position.set(c.x + (r() - .5) * sx + Math.sin(t * 3 + i) * .7, c.y + y, c.z + (r() - .5) * sz); if (y > .06) f.rotation.set(Math.sin(t * 4 + i) * .8, t * 2 + i, Math.cos(t * 3 + i) * .6); else f.rotation.set(-PI / 2, i, 0); }); }
function billBurst(c, T0, T, n = 24, sp = 1, from = 60) { const ca = Math.atan2(camera.position.z - c.z, camera.position.x - c.x); BILL.forEach((f, i) => { if (i < from || i >= from + n) return; const r = RNG(i * 29 + 11), t = T - T0; if (t < 0) return; f.visible = true; const a = ca + PI * .5 + r() * PI, v = (2.5 + r() * 3) * sp; f.position.set(c.x + Math.cos(a) * v * t, c.y + (6 + r() * 3) * t - 5 * t * t, c.z + Math.sin(a) * v * t); f.rotation.set(T * 5 + i, T * 3 + i, 0); }); }
// billetes que caen sobre alguien y el primero acaba en su mano libre (izquierda)
function billDrop(ch, T0, T, n = 1, spread = 1.4, from = 90) { const h = hp(ch); BILL.forEach((f, i) => { if (i < from || i >= from + n) return; const j = i - from, r = RNG(i * 41), t = T - T0 - j * .08; if (t < 0) return; f.visible = true;
  const y0 = h.y + 5 + r() * 2, yEnd = j === 0 ? h.y - 2.6 : .05, y = Math.max(yEnd, y0 - t * (9 + r() * 2) * Math.max(.35, 1 - t * .8)); const sway = Math.sin(t * 5 + j) * (y > yEnd + .01 ? .7 : 0);
  const fd = faceDir(ch); f.position.set(h.x + (j ? (r() - .5) * 2 * spread : fd.x * 1.6) + sway, y, h.z + (j ? (r() - .5) * 2 * spread : fd.z * 1.6));
  if (y > yEnd + .01) f.rotation.set(Math.sin(t * 4 + j) * .7, t * 1.5 + j, Math.cos(t * 3 + j) * .5); else if (j === 0) { f.lookAt(camera.position); } else f.rotation.set(-PI / 2, j, 0); }); }
const cashPop = (ch, text, k, kind = 'green', sc = 1, dy = 2.8) => badge3(kind, text, hp(ch).add(V(0, dy * (ch.spec.scale || 1), 0)), k, sc);
function coins(c, T0, T, n = 20) { COIN.forEach((m, i) => { if (i >= n) return; const r = RNG(i * 5 + 1), t = T - T0; if (t < 0) return; m.visible = true; m.position.set(c.x + (r() - .5) * 6, c.y + 7 - ((t * (6 + r() * 4) + r() * 7) % 9), c.z + (r() - .5) * 4); m.rotation.set(PI / 2, T * 6 + i, 0); }); }
// nada tapa la cara de un protagonista: billetes y espuma delante de la cara se apartan
function clearFaces() { if (!FACES.length) return; camera.updateMatrixWorld(); camera.updateProjectionMatrix();
  const F = FACES.filter(c => c.root.visible).map(c => { const h = hp(c).add(V(0, .65 * (c.spec.scale || 1), 0)); const p = h.clone().project(camera); const d = camera.position.distanceTo(h); const r = 1.25 * (c.spec.scale || 1) / (d * Math.tan(camera.fov * PI / 360)); return { p, d, r }; });
  for (const b of [...BILL, ...FOAMP]) { if (!b.visible) continue; const q = b.position.clone().project(camera); const dc = camera.position.distanceTo(b.position); for (const f of F) { if (dc > f.d + .5) continue; if (Math.hypot((q.x - f.p.x) * W / H, q.y - f.p.y) < f.r * 1.15) { b.visible = false; break; } } } }
// pantallas
function drawBankApp(c, w, h, amount, sub = '', col = '#5aff9a') { c.fillStyle = '#0e1420'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a2a4a'; c.fillRect(0, 0, w, 90); c.fillStyle = '#ffffff'; c.font = `700 30px ${FONT}`; c.textAlign = 'center'; c.fillText('MEIN KONTO', w / 2, 58);
  c.fillStyle = '#9aa4c0'; c.font = `700 22px ${FONT}`; c.fillText('KONTOSTAND', w / 2, 170); c.fillStyle = col; let f = 54; c.font = `700 ${f}px ${FONT}`; while (c.measureText(amount).width > w - 30) { f -= 2; c.font = `700 ${f}px ${FONT}`; } c.fillText(amount, w / 2, 236);
  if (sub) { c.fillStyle = '#ffffff'; c.font = `700 26px ${FONT}`; c.fillText(sub, w / 2, 300); } c.strokeStyle = col; c.lineWidth = 5; c.beginPath(); for (let i = 0; i <= 20; i++) c.lineTo(20 + i * (w - 40) / 20, 470 - Math.pow(i / 20, 2.2) * 120 - Math.sin(i) * 6); c.stroke(); }
function drawCall(c, w, h, name, sub, col = '#3ad86a') { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1a2a4a'); g.addColorStop(1, '#0a0e18'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.textAlign = 'center'; c.font = `700 26px ${FONT}`; c.fillText(sub, w / 2, 90); c.font = `700 42px ${FONT}`; c.fillText(name, w / 2, 150);
  c.fillStyle = '#3a4a6a'; c.beginPath(); c.arc(w / 2, 270, 70, 0, 7); c.fill(); c.fillStyle = '#ffffff'; c.font = `700 70px ${FONT}`; c.fillText(name[0], w / 2, 296); for (const [x, cc] of [[80, '#e8323a'], [220, col]]) { c.fillStyle = cc; c.beginPath(); c.arc(x, 470, 38, 0, 7); c.fill(); } }
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
const KEY = /^(Stadt|Hals|Nein|länger|Mann|Schwiegermutter|Häuser|Haus|schlafen|gelogen|zehn|Meter|Wolken|dir|Lügen|niemand|Mamas|Essen|raus|sauer|Zack|Nachbar|Porsche|Timo|Freundin|anderen|Zwanzig|normal|nie|einziges|Problem|Hausaufgaben|Ja|Pausenbrot|Marco|zurück|Keller|aus|Tag|Oldtimer|Mann|Firma|Schlüssel|Fabrik|Problem|leer|pleite|alles|Maschine|Hals-Schrumpf-Maschine|niemand|Kabel|Start|nichts|Leben|Erstes|Test|Arbeiter|Laser|Größe|Idee|lügen|Plakate|999|Euro|dreitausend|Schlange|Bürgermeister|Kirchturm|Millionen|reichste|Welt|Schloss|zwölf|Sportwagen|Insel|klingelt|Million|lächle|allerersten|Dach|glücklich)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0; const FX2D = [];
// ---------- a: gancho, la regla, los mentirosos y yo (0 – 58,89 s) ----------
// Plaza de Brauheim: centro (0, -10), fachadas en x = ±43, iglesia en z = -120. La cámara suele mirar hacia -z (iglesia y casas al fondo).
const sc_ = ch => ch.spec.scale || 1;
KU.T.visible = false;   // sin mesa: la cocina queda despejada
// valor que salta de a a b en t0 (muelle con rebote)
const grow = (lt, t0, a, b, d = .5) => a + (b - a) * spring(clamp((lt - t0) / d));
const neck = (c, L_, T, o = {}) => hals(c, L_, { T, bend: o.bend ?? .03, sway: o.sway ?? .05, ...o });
// sacudir la cabeza («nein») después de hals (hals fija la rotación de la cabeza)
const shake = (c, T, k = 1, sp = 20) => { c.head.rotation.y += Math.sin(T * sp) * .42 * k; };
const nod = (c, T, k = 1) => { c.head.rotation.x += Math.max(0, Math.sin(T * 14)) * .3 * k; };
const headTop = c => hp(c).add(V(0, .7 * sc_(c), 0));
const neinB = (c, k, txt_ = 'NEIN!', dy = 2.0) => bubble(c, txt_, k, dy);
const meters = (txt_, k, y = .24, kind = 'red', s = 1.1) => badge(kind, txt_, W / 2, H * y, k, 1, s);
const GRUMPY = () => CR[20];
// cámara que sigue la cabeza (centro entre pies y cabeza) a distancia d
function tall(c, d, yaw = 0, pitch = .05, fov = 50, f = .5) { const p = c.root.position, h = headTop(c), m = V(p.x, lerp(p.y, h.y, f), p.z); orbit(m, d, c.root.rotation.y + yaw, pitch, fov); }
// polvo al pegar el tirón
const jolt = (c, L, t) => dust(c.root.position.clone(), L.t0 + t, L.T, 8, .8);
// cartel de la regla en la plaza
const RULE = new THREE.Group(); scene.add(RULE); { const wd = mat(0x6a4224, { roughness: .7 }); for (const s of [-1, 1]) cyl(.45, .55, 20, wd, 10, RULE, s * 10, 10, 0); box(22, 12.4, .9, wd, .2, RULE, 0, 14, 0); box(24, .8, 3, mat(0x8a2a2a), .1, RULE, 0, 20.6, 0);
  const p = textPlane(20.4, 11, 1020, 550, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#12204a'); g.addColorStop(1, '#2a0a3a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    ntxt(c, 'STADTREGEL', w / 2, 70, 64, '#ffd23f'); ntxt(c, '1× NEIN', w * .3, 210, 76, '#ffffff'); ntxt(c, '+1 METER', w * .72, 210, 76, '#5aff9a'); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(60, 290, w - 120, 4);
    ntxt(c, '1× GELOGEN', w * .3, 390, 76, '#ffffff'); ntxt(c, '+10 METER', w * .72, 390, 86, '#ff4a4a'); ntxt(c, 'LÜGEN SIEHT HIER JEDER.', w / 2, 500, 44, '#ffd23f'); }, .25); p.position.set(0, 14, .5); RULE.add(p); }
P_(RULE); RULE.traverse(o => { if (o.isMesh) o.castShadow = true; });
// mini-escenario al atardecer: casa sola con el cuello enrollado (X = 10400)
const WHX = 10400; const WH = new THREE.Group(); WH.position.x = WHX; scene.add(WH); SETS.WH = WH;
{ const gr = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), mat(0x4a9a3a, { roughness: 1 })); gr.rotation.x = -Math.PI / 2; WH.add(gr);
  const wl = mat(0xf4e2c8, { roughness: .8 }); box(16, 12, 14, wl, .2, WH, 0, 6, 0); for (const s of [-1, 1]) { const r = box(10.6, .8, 15.6, mat(0xb8463a, { roughness: .7 }), .1, WH, s * 4.2, 15.2, 0); r.rotation.z = -s * .72; }
  { const sh_ = new THREE.Shape(); sh_.moveTo(-8, 0); sh_.lineTo(8, 0); sh_.lineTo(0, 7.4); sh_.lineTo(-8, 0); for (const z of [-7, 7]) { const t = new THREE.Mesh(new THREE.ExtrudeGeometry(sh_, { depth: .3, bevelEnabled: false }), wl); t.position.set(0, 12, z - .15); WH.add(t); } }
  box(1.6, 5, 1.6, mat(0x8a3a2a), .1, WH, 4, 17, -2); const lit = mat(0xffd890, { emissive: 0xffb84a, emissiveIntensity: 1.2 }); for (const [x, y] of [[-4.5, 4], [4.5, 4], [-4.5, 9.4], [4.5, 9.4]]) box(2.6, 2.6, .3, lit, .05, WH, x, y, 7.05); box(2.8, 5, .3, mat(0x6a3a1a), .05, WH, 0, 2.5, 7.05);
  for (let x = -14; x <= 14; x += 1.4) box(.3, 2.2, .2, mat(0xf4f0e8), .05, WH, x, 1.1, 14); for (const [x, z] of [[-20, -6], [20, 4], [-26, 18]]) { cyl(.6, .8, 6, mat(0x6a4a2a), 8, WH, x, 3, z); sphere(4, mat(0x2a7a3a, { roughness: 1 }), WH, x, 8, z, 12, 8); }
  for (let k = 0; k < 8; k++) { const hx = -70 + k * 20, hz = -60 - (k % 2) * 14; box(14, 10, 12, mat([0xf4e2c0, 0xf8d8d0, 0xdcecf4][k % 3], { roughness: .8 }), .2, WH, hx, 5, hz); for (let j = 0; j < 2; j++) box(2, 2, .2, lit, 0, WH, hx - 3 + j * 6, 6, hz + 6.1); }
  outline(WH, OS); WH.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); }
// cuello enrollado alrededor de la casa: tubo desde el cuello de c, dos vueltas subiendo y la cabeza dormida en el tejado
function wrapHouse(c, T) { c.root.updateMatrixWorld(true); const base = c.neck.getWorldPosition(V(0, 0, 0)); const pts = [base.clone(), base.clone().add(V(0, 3, 0)), V(WHX + 5, 9, 8.6)];
  for (let i = 0; i <= 24; i++) { const a = Math.PI * .3 + i / 24 * Math.PI * 3.4, y = 9 + i / 24 * 6; pts.push(V(WHX + Math.cos(a) * 10.6, y, Math.sin(a) * 9.4)); }
  pts.push(V(WHX - 2, 19.4, 3.5), V(WHX + .6, 21.0, 1.0)); const loc = pts.map(p => c.neck.worldToLocal(p.clone()));
  attach(WRAP, c.neck, [0, 0, 0], [0, 0, 0], 1); WRAP.material = SKINM; SKINM.color.setHex(c.spec.skin); setWrap(loc);
  const e = loc[loc.length - 1]; c.head.position.copy(e); c.head.rotation.set(-1.0, .2, .5); }
const zzz = (p, T) => ZZZ.forEach((z, i) => { const k = (T * .5 + i / 3) % 1; z.visible = true; z.position.copy(p).add(V(1 + k * 1.6, 1.2 + k * 2.6, k * .6)); z.scale.setScalar(.35 + k * .5); z.lookAt(camera.position); });
// pantalla del móvil: chat sospechoso
const drawChat = (c, w, h) => { c.fillStyle = '#eef2f8'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff5a8a'; c.fillRect(0, 0, w, 90); ntxt(c, 'LISA ♥', w / 2, 50, 38, '#ffffff');
  const bub = (y, t, me) => { c.font = `700 30px ${FONT}`; const tw = c.measureText(t).width + 40; const x = me ? w - tw - 16 : 16; c.fillStyle = me ? '#5ad87a' : '#ffffff'; c.beginPath(); c.roundRect(x, y, tw, 60, 26); c.fill(); c.fillStyle = '#1a1a1a'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(t, x + 20, y + 32); };
  bub(130, 'Hey Süßer 😘', false); bub(210, 'Heute Abend?', false); bub(290, 'Klar ❤️', true); bub(370, 'Sag es nicht Jana 🤫', false); };
const drawBurger = (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); ntxt(c, 'BURGER', w / 2, 70, 56, '#d8202a'); const y = h * .5; c.fillStyle = '#e8a040'; c.beginPath(); c.ellipse(w / 2, y - 40, 110, 60, 0, Math.PI, 0); c.fill(); c.fillStyle = '#4a2a1a'; c.fillRect(w / 2 - 115, y - 40, 230, 34); c.fillStyle = '#3ab84a'; c.fillRect(w / 2 - 120, y - 8, 240, 14); c.fillStyle = '#e8a040'; c.fillRect(w / 2 - 110, y + 6, 220, 30); ntxt(c, 'JETZT!', w / 2, h * .82, 60, '#d8202a'); };

// 1 «In dieser Stadt wird» (gancho): la plaza llena de gente con cuellos de todos los largos; en el centro, una chica dice «NEIN!» y su cuello sale disparado hacia arriba
shot(0, 'C', null, L => { town(L); const c = put(CR[0], 0, 0, 0, 0); const g = grow(L.lt, .22, 1.2, 30, .55); neck(c, g, L.T, { sway: .02 }); shake(c, L.T, clamp(1 - L.lt * 2)); neinB(c, clamp((L.lt - .05) / .15), 'NEIN!', 1.6);
  actuar(c, L.lt, [[0, { aLx: .4, aRx: .4, aLz: .3, aRz: .3 }], [.25, 'shock', { dur: .2 }]], { T: L.T }); cara(c, L.T, L.lt < .3 ? { expr: 'angry', mouth: 'o' } : { expr: 'shock', mouth: 'o' });
  crowdAt(L, 0, -4, 16, 9, 28, 3, { mode: i => ['talk', 'point', 'shock', 'idle'][i % 4], from: 1, neck: i => [3, 18, 8, 30, 12, 4, 24, 10, 34, 6, 15, 26, 2, 20, 9, 13][i], gap: .95 });
  const q = easeOut(clamp((L.lt - .18) / .6)); cm([0, 5.6, 17, 0, 5.4, 0, 50], [0, 14, 30, 0, 16, 0, 56], q); sh(V(0, 0, 0), 60); },
  [[0, 'boing', .5], [.08, 'shout_f', .5], [.22, 'stretch', .8], [.3, 'whoosh_up', .6], [.5, 'crowd_ohh', .4]]);
// 2 «dein Hals jedes Mal länger,»: un hombre con gorra niega con la cabeza; el cuello da un tirón hacia arriba (+1 m); la cámara sube con él
shot(1.16, 'W', 'punch', L => { town(L); const c = put(CR[3], 6, 0, -14, -.2); const g = grow(L.lt, .35, 7, 13, .4); neck(c, g, L.T, { bend: -.04 }); shake(c, L.T, clamp(1 - Math.abs(L.lt - .3) * 3)); cara(c, L.T, { expr: L.lt < .4 ? 'angry' : 'shock', mouth: L.lt < .4 ? 'flat' : 'o' });
  actuar(c, L.lt, [[0, 'cross'], [.4, 'shock', { dur: .2 }]], { T: L.T }); meters('+1 METER', (L.lt - .45) * 4, .2, 'green', 1); neinB(c, (L.lt - .02) * 5, 'NEIN!', 1.6);
  crowdAt(L, 6, -14, 8, 7, 18, 5, { mode: 'talk', from: 4, neck: i => [4, 16, 8, 24, 2, 12, 20, 6][i] });
  tall(c, lerp(26, 22, L.k), .25, .02, 50, lerp(.45, .62, easeOut(L.k))); sh(V(6, 0, -14), 40); }, [[0, 'thump', .5], [.35, 'stretch_creak', .8], [.45, 'boing', .4]]);
// 3 «wenn du Nein sagst.»: delante de la panadería, la Oma le ofrece patatas a un chico; él dice «NEIN» y ¡pop!, cuello más largo
shot(2.4, 'S', null, L => { town(L); const c = put(CR[5], -20, 0, 2, -Math.PI / 2 + .9); c.root.scale.setScalar(.8); const o = put(CR[8], -27, 0, 4, Math.PI / 2 - .5); const t = .35; const g = grow(L.lt, t, 1, 11, .45); neck(c, g, L.T); shake(c, L.T, clamp(1 - Math.abs(L.lt - t) * 3));
  attach(PLATE, o.aR.hand, [0, -.7, .5], [0, 0, 0], .8); actuar(o, L.lt, [[0, { aRx: 1.2, aRe: .3 }]], { T: L.T }); cara(o, L.T, { expr: L.lt < t ? 'happy' : 'shock', mouth: L.lt < t ? 'open_smile' : 'o' }); neck(o, 3, L.T);
  actuar(c, L.lt, [[0, { aLx: .6, aLe: 1.4, aRx: .6, aRe: 1.4, aLz: -.4, aRz: -.4 }], [t, 'shock', { dur: .2 }]], { T: L.T }); cara(c, L.T, { expr: L.lt < t ? 'angry' : 'shock', mouth: 'o' }); neinB(c, (L.lt - .25) * 5, 'NEIN!', 1.4);
  crowdAt(L, -26, -8, 4, 6, 12, 9, { mode: 'talk', from: 10, neck: i => [6, 14, 3, 20][i], gap: 2.2 });
  cm([-23.5, 6.5, 21, -23.5, 4.5 + g * .3, 3, 50], [-23.5, 7, 18.5, -23.5, 5 + g * .35, 3, 50], L.k); sh(V(-23, 0, 2), 30); }, [[0, 'swipe', .4], [.3, 'shout', .5], [.38, 'stretch', .7], [.45, 'pop', .5]]);
// 4 «Siehst du den Mann da?»: por encima del hombro de alguien que señala, al fondo un hombre con el cuello por encima de los tejados
shot(3.6, 'Z', null, L => { town(L); const p = put(CR[10], -3.2, 0, 17, Math.PI + .35); actuar(p, L.lt, [[0, 'point']], { T: L.T }); cara(p, L.T, { expr: 'shock', mouth: 'o' }); neck(p, 2, L.T);
  const m = put(mann, 10, 0, -40, .2); neck(m, 52, L.T, { bend: .05, sway: .04 }); cara(m, L.T, { expr: 'tired' }); actuar(m, L.lt, [[0, 'idle']], { T: L.T });
  crowdAt(L, 6, -30, 10, 8, 22, 11, { mode: 'idle', from: 12, neck: i => [4, 12, 26, 8, 18, 3, 30, 10, 6, 15][i] });
  const q = easeInOut(L.k); cm([-7.5, 9, 31, 6, lerp(10, 30, q), -36, 50], [-7, 9.5, 29.5, 8, lerp(14, 38, q), -38, 48], q); sh(V(4, 0, -10), 60); }, [[0, 'zoom_in', .5], [.2, 'hey', .4]]);
// 5 «Sein Hals ist so lang, weil er ständig»: el hombre de la camisa de cuadros: la cámara sube desde los pies por todo el cuello hasta la cabeza, por encima de los tejados
shot(4.54, 'C', 'punch', L => { town(L); const m = put(mann, 0, 0, -16, 0); neck(m, 52, L.T, { bend: .04, sway: .04 }); cara(m, L.T, { expr: 'tired', eyes: 'half' }); actuar(m, L.lt, [[0, 'idle']], { T: L.T });
  crowdAt(L, 0, -16, 8, 8, 20, 13, { mode: 'shock', from: 0, neck: i => [3, 8, 12, 2, 16, 6, 10, 4][i], face: V(0, 40, -16) });
  const q = easeInOut(L.k); const ht = headTop(m); cam([0, lerp(5, ht.y - 8, q), 30], [0, lerp(6, ht.y - 2, q), -16], 50); sh(V(0, 0, -16), 40); }, [[0, 'impact', .5], [.1, 'whoosh_up', .5], [.6, 'stretch_creak', .4]]);
// 6 «Nein zu seiner Schwiegermutter sagt.»: en la puerta de casa, la suegra le riñe; él baja la cabeza desde lo alto, dice «NEIN» y el cuello sube otro tirón
shot(6.24, 'W', null, L => { town(L); const s = put(schw, -9, 0, -6, Math.PI / 2); const m = put(mann, 11, 0, -6, -Math.PI / 2); const t = .28; const g = grow(L.lt, t, 24, 30, .45); neck(m, g, L.T, { bend: lerp(2.45, 1.0, easeOut(clamp((L.lt - t) * 2.5))), sway: .02 }); shake(m, L.T, clamp(1 - Math.abs(L.lt - .15) * 4));
  cara(m, L.T, { expr: L.lt < t ? 'angry' : 'shock', mouth: L.lt < t ? 'open' : 'o' }); actuar(m, L.lt, [[0, 'cross']], { T: L.T }); neinB(m, (L.lt - .05) * 5, 'NEIN!', 1.4);
  talk(s, L.T, L.t0, L.t1, 'angry'); actuar(s, L.lt, [[0, { aRx: 1.6, aRz: .1, aRe: .3 + Math.sin(L.T * 12) * .3, aLx: .3, aLe: 1.6 }]], { T: L.T }); neck(s, 2, L.T);
  meters('+1 METER', (L.lt - .4) * 4, .2, 'green', .9);
  cm([0, 9, 34, 0, 9, -6, 52], [0, 10, 31, 0, 11, -6, 52], L.k); sh(V(0, 0, -6), 30); }, [[0, 'whoosh_soft', .4], [.05, 'argue', .5], [.25, 'shout_m', .5], [.3, 'stretch', .7]]);
// 7 «Manche Hälse sind höher als die»: contrapicado: cuellos que suben más altos que las casas, cabezas recortadas contra el cielo
shot(8.02, 'R', null, L => { town(L); [[-14, -20, 46], [8, -30, 54], [22, -10, 40], [-26, -6, 36], [0, -46, 60], [-8, 4, 30]].forEach(([x, z, n], i) => { const c = put(CR[14 + i], x, 0, z, Math.atan2(-x, 30 - z)); neck(c, n, L.T, { bend: (i % 3 - 1) * .08, sway: .06 }); cara(c, L.T + i, { expr: ['happy', 'neutral', 'tired'][i % 3] }); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); });
  const a = lerp(-.25, .1, L.k); cam([Math.sin(a) * 6, 2.4, 26], [Math.sin(a) * 30, 40, -20], 62); sh(V(0, 0, -16), 60); }, [[0, 'whirl', .4], [.1, 'wind', .4], [.5, 'birds', .4]]);
// 8 «Häuser.»: a la altura de los tejados: las cabezas asoman entre las chimeneas, una saluda a la otra
shot(9.58, 'F', null, L => { town(L); [[-7, -22, 27], [5, -28, 30], [12, -16, 26], [-14, -32, 31], [0, -12, 24]].forEach(([x, z, n], i) => { const c = put(CR[20 + i], x, 0, z, Math.atan2(-x, 20 - z) + (i % 2 ? .4 : -.4)); neck(c, n, L.T, { bend: .05, sway: .05 }); cara(c, L.T + i, { expr: 'happy', mouth: i % 2 ? 'open_smile' : 'smile' }); actuar(c, L.lt, [[0, i === 1 ? 'wave' : 'idle']], { T: L.T }); });
  cm([0, 27, 18, 0, 27, -22, 50], [0, 27.5, 14, 0, 27.5, -22, 50], L.k); sh(V(0, 0, -20), 50); }, [[0, 'flash', .4], [.1, 'birds', .4], [.4, 'hey', .3]]);
// 9 «Und andere müssen ihren Hals um das ganze»: atardecer: una casa con un cuello enrollado dos veces alrededor, la cámara gira
shot(10.82, 'Z', null, L => { use('WH'); dusk(); const c = put(CR[25], WHX + 3, 0, 12, 0); wrapHouse(c, L.T); actuar(c, L.lt, [[0, { aLx: .1, aRx: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'tired', eyes: 'closed', mouth: 'flat' });
  const a = lerp(.75, .35, easeInOut(L.k)); cam([WHX + Math.sin(a) * 44, 18, Math.cos(a) * 44], [WHX, 10, 0], 46); sh(V(WHX, 0, 0), 40); }, [[0, 'whoosh_soft', .4], [.1, 'crickets', .4], [.5, 'stretch_creak', .4]]);
// 10 «Haus wickeln, nur um schlafen zu können.»: de cerca: la cabeza dormida sobre el tejado, Zzz, la luna
shot(12.8, 'I', null, L => { use('WH'); dusk(); setSky([.1, .12, .42], [.6, .36, .56], [1, .56, .34]); const c = put(CR[25], WHX + 3, 0, 12, 0); wrapHouse(c, L.T); cara(c, L.T, { expr: 'tired', eyes: 'closed', mouth: 'o' }); const h = hp(c); zzz(h.clone().add(V(0, 1, 0)), L.T);
  cm([WHX + 12, 26, 20, h.x, h.y + .4, h.z, 40], [WHX + 9, 24.5, 15, h.x, h.y + .4, h.z, 38], L.k); sh(V(WHX, 0, 0), 30); }, [[0, 'iris_pop', .3], [.1, 'snore', .6], [.6, 'zzz', .5]]);
// 11 «Und wenn dein Nein gelogen ist?» (zoom lento): un chico esconde a la espalda un Brezel mordido; el panadero le pregunta; él niega sudando
shot(14.77, 'S', 'slow', L => { town(L); const c = put(CR[12], -28, 0, -8, .6); c.root.scale.setScalar(.82); neck(c, 1.5, L.T); attach(BROT, c.aR.hand, [0, -.8, -.3], [0, 0, 0], 1); actuar(c, L.lt, [[0, { aRx: -.8, aRz: .1, aRe: .4, aLx: .1 }]], { T: L.T }); shake(c, L.T, .6, 12); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T);
  const b = put(CR[16], -20, 0, -14, -1.0); neck(b, 6, L.T); actuar(b, L.lt, [[0, { aRx: 1.5, aRe: .2, aLx: .4, aLe: 1.6, aLz: -.4 }]], { T: L.T }); cara(b, L.T, { expr: 'sus' }); neinB(c, (L.lt - .55) * 4, 'NEIN…', 1.4);
  orbit(V(-26, 4.4, -10), lerp(18, 13, easeIn(L.k)), .35, .06, 46); sh(V(-25, 0, -10), 25); }, [[0, 'tsk', .4], [.4, 'gulp_nervous', .6], [.9, 'heartbeat', .5]]);
// 12 «Dann gleich zehn Meter!»: ¡ZAS! su cuello sale disparado diez metros de golpe; «+10 METER»
shot(16.32, 'C', 'punch', L => { town(L); const c = put(CR[12], -28, 0, -8, .6); c.root.scale.setScalar(.82); const g = grow(L.lt, .3, 1.5, 30, .5); neck(c, g, L.T, { sway: .03 }); attach(BROT, c.aR.hand, [0, -.8, -.3], [0, 0, 0], 1); actuar(c, L.lt, [[0, { aRx: -.8, aRz: .1, aRe: .4 }], [.3, 'shock', { dur: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  const b = put(CR[16], -20, 0, -14, -1.0); neck(b, 6, L.T); actuar(b, L.lt, [[0, 'shock']], { T: L.T }); cara(b, L.T, { expr: 'shock', mouth: 'o' }); jolt(c, L, .3);
  crowdAt(L, -26, -8, 4, 9, 16, 17, { mode: 'shock', from: 0, neck: i => [2, 4, 3, 2][i], face: V(-28, 20, -8), gap: 2 });
  meters('+10 METER', (L.lt - .55) * 3.5, .16, 'red', 1.2); const q = easeOut(clamp((L.lt - .25) / .6)); cm([-14, 5, 10, -26, 5, -9, 52], [-12, 12, 20, -27, 15, -9, 56], q); sh(V(-26, 0, -9), 30); },
  [[0, 'impact', .6], [.3, 'stretch', .9], [.32, 'boing', .5], [.55, 'pop_big', .5], [.7, 'crowd_ohh', .4]]);
// 13 «Und jeder kennt so jemanden,»: la gente de la plaza mira y señala a un señor gruñón sentado en un banco
shot(17.73, 'W', null, L => { town(L); const g_ = GRUMPY(); sit(g_, -18, 2.4, 0, Math.PI / 2, L, { aLx: .4, aRx: .4, aLz: -.3, aRz: -.3, aLe: 1.8, aRe: 1.8 }); neck(g_, 24, L.T, { bend: .02 }); cara(g_, L.T, { expr: 'angry', mouth: 'flat' });
  crowdAt(L, -10, 0, 9, 7, 16, 19, { mode: i => i % 2 ? 'point' : 'talk', from: 0, face: V(-18, 12, 0), neck: i => [2, 6, 3, 9, 4, 12, 2, 5, 8][i], gap: 1.9 });
  orbit(V(-16, 8, 0), lerp(28, 24, L.k), .15, .1, 50); sh(V(-14, 0, 0), 40); }, [[0, 'whoosh', .4], [.2, 'crowd_murmur', .4], [.6, 'hmm', .4]]);
// 14 «der zu allem Nein sagt.»: tres vecinos le ofrecen algo (flores, un Brezel, una pelota): «NEIN! NEIN! NEIN!» y el cuello sube a tirones
shot(19.0, 'F', null, L => { town(L); const g_ = GRUMPY(); sit(g_, -18, 2.4, 0, Math.PI / 2, L, { aLx: .4, aRx: .4, aLz: -.3, aRz: -.3, aLe: 1.8, aRe: 1.8 }); const st = [.1, .45, .8]; let n = 24; st.forEach(t => { n += grow(L.lt, t, 0, 4, .3); }); neck(g_, n, L.T, { bend: .02 }); shake(g_, L.T, 1, 22); cara(g_, L.T, { expr: 'angry', mouth: 'o' });
  [[-10, -6], [-9, 1], [-10, 8]].forEach(([x, z], i) => { const c = put(CR[30 + i], x, 0, z, -Math.PI / 2 + (i - 1) * .3); neck(c, [3, 5, 2][i], L.T); actuar(c, L.lt, [[0, { aRx: 1.5, aRe: .2 }]], { T: L.T }); cara(c, L.T, { expr: L.lt > st[i] + .1 ? 'sad' : 'happy', mouth: L.lt > st[i] + .1 ? 'flat' : 'open_smile' }); if (i === 1) attach(BROT, c.aR.hand, [0, -.8, .4], [0, 0, 0], 1); });
  st.forEach((t, i) => badge('red', 'NEIN!', W * [.3, .7, .5][i], H * [.36, .3, .44][i], (L.lt - t) * 5, 1, .8));
  orbit(V(-14, 10, 0), lerp(30, 27, L.k), .4, .12, 50); sh(V(-14, 0, 0), 30); }, [[.08, 'shout_m', .5], [.12, 'stretch_creak', .6], [.45, 'shout_m', .5], [.47, 'stretch_creak', .6], [.8, 'shout_m', .5], [.82, 'stretch', .6]]);
// 15 «Hier wäre sein Kopf längst über den Wolken.»: arriba del todo: su cabeza asoma por encima de las nubes, con pájaros
shot(20.36, 'Z', null, L => { town(L); const g_ = GRUMPY(); sit(g_, -18, 2.4, 0, Math.PI / 2, L, { aLx: .4, aRx: .4 }); neck(g_, 110, L.T, { bend: .01, sway: .015 }); cara(g_, L.T, { expr: 'angry', mouth: 'flat' }); const h = hp(g_);
  CLOUDS.forEach((c, i) => { const a = i / 14 * 6.283 * 2.3 + .4, r = 9 + (i % 4) * 9; show(c, h.x + Math.cos(a) * r, h.y - 8 - (i % 3) * 1.5, h.z + Math.sin(a) * r, i, .7 + (i % 3) * .2); });
  const a = lerp(-.2, .2, L.k); cam([h.x + Math.sin(a + 1.57) * 22, h.y + 3, h.z + Math.cos(a + 1.57) * 22], [h.x, h.y - 3, h.z], 50); sh(h.clone().setY(0), 40); BIRDSON = 1; }, [[0, 'whoosh_up', .5], [.2, 'wind_rise', .5], [.5, 'birds', .4]]);
// 16 «Wer ist das bei dir?»: la cabeza gruñona entre las nubes se gira y mira a cámara; un «?» enorme
shot(22.37, 'I', 'punch', L => { town(L); const g_ = GRUMPY(); sit(g_, -18, 2.4, 0, Math.PI / 2, L, { aLx: .4, aRx: .4 }); neck(g_, 110, L.T, { bend: .01, sway: .015 }); g_.head.rotation.y += lerp(0, .9, easeOut(clamp(L.lt / .3))); cara(g_, L.T, { expr: 'sus', mouth: 'flat' }); const h = hp(g_);
  CLOUDS.forEach((c, i) => { const a = i / 14 * 6.283 * 2.3 + .4, r = 9 + (i % 4) * 9; show(c, h.x + Math.cos(a) * r, h.y - 8 - (i % 3) * 1.5, h.z + Math.sin(a) * r, i, .7 + (i % 3) * .2); });
  const fa = Math.PI / 2 + .9; cam([h.x + Math.sin(fa) * lerp(11, 9, L.k), h.y + 1.2, h.z + Math.cos(fa) * lerp(11, 9, L.k)], [h.x, h.y + .2, h.z], 42); badge('q', '?', W * .74, H * .3, (L.lt - .2) * 4, 1, 1.2); sh(h.clone().setY(0), 30); }, [[0, 'iris_pop', .4], [.15, 'question', .6]]);
// 17 «Lügen kann hier nämlich niemand.»: el cartel de la regla de la ciudad: NEIN = +1 m, GELOGEN = +10 m; la gente pasa por delante
shot(23.32, 'S', null, L => { town(L); show(RULE, 0, 0, -30, 0); [[-12, -22], [12, -20], [-15, -12], [14, -10]].forEach(([x, z], i) => { const p = put(CR[i + 2], x, 0, z, Math.atan2(-x, -30 - z)); neck(p, [3, 8, 5, 12][i], L.T, { bend: -.1 }); actuar(p, L.lt, [[0, i % 2 ? 'point' : 'think']], { T: L.T }); cara(p, L.T, { expr: 'shock', mouth: 'o' }); });
  cm([-6, 9, 8, 0, 14, -30, 48], [2, 11, 4, 0, 14.4, -30, 46], L.k); sh(V(0, 0, -24), 40); DOF = 0; }, [[0, 'swipe', .4], [.1, 'power_on', .4], [.5, 'pling', .4]]);
// 18 «Am schwersten haben es die Mamas.»: en la cocina, una mamá con el cuello largo doblado bajo el techo remueve la olla; los niños alrededor
shot(24.95, 'F', null, L => { kuecheS(L); const m = put(mama, 1400 - 4, 0, -6, .3); neck(m, 9, L.T, { bend: .35, sway: .03 }); actuar(m, L.lt, [[0, { aRx: 1.1, aRe: .9 + Math.sin(L.T * 8) * .3, aRz: .2, aLx: .3 }]], { T: L.T }); cara(m, L.T, { expr: 'tired', mouth: 'flat' });
  [[1400 + 4, -1, -.8], [1400 + 8, 2, -1.0]].forEach(([x, z, r], i) => { const k_ = put(CR[i * 2 + 1], x, 0, z, r); k_.root.scale.setScalar(.72); actuar(k_, L.lt, [[0, i ? 'wave' : 'point']], { T: L.T }); cara(k_, L.T, { expr: 'happy', mouth: 'open_smile' }); });
  cm([1400 + 5, 9, 18, 1400, 8, -5, 50], [1400 + 3, 9, 15, 1400, 8, -5, 48], L.k); sh(V(1400, 0, -4), 25); }, [[0, 'flash', .3], [.1, 'pan_sizzle', .4], [.5, 'kids_chatter', .4]]);
// 19 «„Nein, wir haben Essen zu Hause.“»: el niño le enseña una hamburguesa en el móvil; ella señala la olla: «NEIN» (+1 m)
shot(26.59, 'W', null, L => { kuecheS(L); const m = put(mama, 1400 - 4, 0, -6, .5); const t = .1; neck(m, grow(L.lt, t + .25, 9, 11.5, .4), L.T, { bend: .3 }); shake(m, L.T, clamp(1 - Math.abs(L.lt - .25) * 3)); actuar(m, L.lt, [[0, { aRx: 1.4, aRz: -.6, aRe: .2, aLx: .4, aLe: 1.6, aLz: -.4 }]], { T: L.T }); talk(m, L.T, L.t0, L.t1, 'angry');
  const k_ = put(CR[1], 1400 + 4, 0, -1, -1.0); k_.root.scale.setScalar(.72); handyP(k_); PH.userData.S.draw('burger', drawBurger); actuar(k_, L.lt, [[0, { aRx: 1.5, aRe: .3, aRz: .1 }]], { T: L.T }); cara(k_, L.T, { expr: 'happy', mouth: 'open_smile' });
  neinB(m, (L.lt - .05) * 5, 'NEIN!', 1.2); meters('+1 METER', (L.lt - .5) * 4, .2, 'green', .9);
  cm([1400 + 3, 8, 15, 1400, 8, -4, 48], [1400 + 2.5, 8, 13, 1400, 8.4, -4, 46], L.k); sh(V(1400, 0, -4), 25); }, [[0, 'whoosh_soft', .4], [.05, 'shout_f', .4], [.35, 'stretch_creak', .6]]);
const handyP = (ch, s = 1) => attach(PH, ch.aR.hand, [0, -.62, .3], [-1.35, Math.PI, 0], s);
// 20 «„Nein, du gehst heute nicht raus.“»: el niño en la puerta con el balón; la mamá le corta el paso con el brazo: «NEIN» (+1 m)
shot(27.95, 'S', null, L => { kuecheS(L); const m = put(mama, 1400 + 8, 0, -6, -1.0); neck(m, grow(L.lt, .9, 11.5, 14, .4), L.T, { bend: .3 }); shake(m, L.T, clamp(1 - Math.abs(L.lt - .8) * 3)); actuar(m, L.lt, [[0, { aRx: 1.6, aRz: 1.2, aRe: 0 }]], { T: L.T }); talk(m, L.T, L.t0, L.t1, 'angry');
  const k_ = put(CR[3], 1400 + 1, 0, -3, .9); k_.root.scale.setScalar(.72); actuar(k_, L.lt, [[0, { aLx: .9, aLe: 1.2, aLz: -.3, aRx: .2 }]], { T: L.T }); cara(k_, L.T, { expr: 'sad', mouth: 'flat' });
  const ball = DUST[0]; neinB(m, (L.lt - .05) * 5, 'NEIN!', 1.2); meters('+1 METER', (L.lt - 1.1) * 4, .2, 'green', .9);
  cm([1400 + 2, 8, 14, 1400 + 5, 8, -5, 48], [1400 + 2.5, 8, 12.5, 1400 + 5, 8.4, -5, 46], L.k); sh(V(1400, 0, -4), 25); }, [[0, 'swipe', .4], [.1, 'door_close', .4], [.8, 'stretch_creak', .6]]);
// 21 «Und dann:»: primer plano: la mamá cruza los brazos, ceño fruncido
shot(29.94, 'C', 'punch', L => { kuecheS(L); const m = put(mama, 1400, 0, -6, 0); neck(m, 6, L.T, { bend: .3 }); actuar(m, L.lt, [[0, 'cross']], { T: L.T }); cara(m, L.T, { expr: 'angry', mouth: 'flat' });
  onFace(m, 6, 0, 0, 40, L.k); sh(V(1400, 0, -6), 20); }, [[0, 'thump', .5], [.1, 'tsk', .4]]);
// 22 «„Nein, ich bin nicht sauer.“» (zoom lento): sonrisa forzada, ceja temblando, vapor saliendo de la cabeza
shot(30.62, null, 'slow', L => { kuecheS(L); const m = put(mama, 1400, 0, -6, 0); neck(m, 6, L.T, { bend: .3 }); actuar(m, L.lt, [[0, 'cross']], { T: L.T }); cara(m, L.T, { expr: 'angry', eyes: 'angry', mouth: kitLips(L.T, spoken(L.t0, L.t1)) || 'grin' }); const h = hp(m);
  VAPOR.forEach((v, i) => { const k = (L.T * .9 + i / 7) % 1; v.visible = i < 8; v.position.copy(h).add(V((i % 2 ? .8 : -.8) * (1 + k), 1.6 + k * 3, 0)); v.scale.setScalar(.3 + k * .7); v.material.opacity = .7 * (1 - k); });
  onFace(m, lerp(7, 5, easeIn(L.k)), 0, 0, 40); sh(V(1400, 0, -6), 20); }, [[0, 'steam', .5], [.6, 'heartbeat', .4]]);
// 23 «Zack. Zehn Meter.»: ¡ZAS! el cuello sale disparado hasta el techo y se dobla contra él; «+10 METER»
shot(32.51, 'C', 'punch', L => { kuecheS(L); const m = put(mama, 1400, 0, -6, 0); const g = grow(L.lt, .05, 6, 30, .5); const ceil = 16 - 4.3 * sc_(m); const up = Math.min(g, ceil / sc_(m)); neck(m, g, L.T, { bend: g > up ? lerp(.3, 1.4, clamp((g - up) / 14)) : .3, sway: .02 }); actuar(m, L.lt, [[0, 'cross'], [.05, 'shock', { dur: .15 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'o' });
  meters('+10 METER', (L.lt - .45) * 4, .2, 'red', 1.2); jolt(m, L, .05);
  cm([1400, 3.5, 9, 1400, 8.5, -6, 64], [1400, 3.8, 9, 1400, 9, -6, 64], L.k); sh(V(1400, 0, -6), 20); }, [[0, 'impact', .6], [.05, 'stretch', .9], [.4, 'thud', .6], [.5, 'pop_big', .5]]);
// 24 «Mein Nachbar:»: Herr Vogt delante de su casa, con gafas de sol, saluda; detrás, un deportivo plateado
shot(34.17, 'W', null, L => { barrioS(L); const v = put(vogt, 3800, 0, 4, 0); neck(v, 2, L.T); actuar(v, L.lt, [[0, 'wave']], { T: L.T }); cara(v, L.T, { expr: 'happy', mouth: 'grin' }); show(PORSCHE, 3800 + 12, 0, -4, -.6);
  onBody(v, 16, .2, .1, 46, L.k); sh(V(3800, 0, 0), 30); }, [[0, 'whoosh', .4], [.1, 'birds', .3], [.3, 'hey', .4]]);
// 25 «„Nein, ich will keinen Porsche.“»: niega con la mano levantada… pero no le quita ojo al Porsche y suda
shot(35.01, 'S', null, L => { barrioS(L); const v = put(vogt, 3800, 0, 4, .5); neck(v, 2, L.T); shake(v, L.T, .7, 14); v.head.rotation.y += .5; actuar(v, L.lt, [[0, { aRx: 1.5, aRz: -.3, aRe: .1, aLx: .2 }]], { T: L.T }); talk(v, L.T, L.t0, L.t1, 'worried'); sweat(v, L.T);
  show(PORSCHE, 3800 + 12, 0, -4, -.6); neinB(v, (L.lt - .05) * 5, 'NEIN!', 1.4);
  orbit(V(3803, 4.5, 1), lerp(24, 21, L.k), -.9, .08, 46); sh(V(3806, 0, 0), 30); }, [[0, 'swipe', .4], [.4, 'gulp_nervous', .5], [1.4, 'car_horn', .3]]);
// 26 «Zehn Meter.»: ¡ZAS! su cuello sube diez metros de golpe
shot(37.47, 'C', 'punch', L => { barrioS(L); const v = put(vogt, 3800, 0, 4, .5); const g = grow(L.lt, .02, 2, 26, .45); neck(v, g, L.T, { sway: .02 }); actuar(v, L.lt, [[0, 'shock']], { T: L.T }); cara(v, L.T, { expr: 'shock', mouth: 'o' }); show(PORSCHE, 3800 + 12, 0, -4, -.6);
  meters('+10 METER', (L.lt - .3) * 4, .22, 'red', 1.1); jolt(v, L, .02); const q = easeOut(clamp(L.lt / .6)); cm([3800 + 6, 5, 26, 3800 + 2, 6, 2, 52], [3800 + 6, 13, 36, 3800 + 2, 16, 2, 52], q); sh(V(3804, 0, 0), 30); },
  [[0, 'impact', .6], [.02, 'stretch', .9], [.3, 'pop_big', .5]]);
// 27 «Klar.»: allá arriba, Vogt sonríe avergonzado mirando el Porsche desde lo alto
shot(38.35, 'F', null, L => { barrioS(L); const v = put(vogt, 3800, 0, 4, .5); neck(v, 26, L.T, { bend: .3 }); actuar(v, L.lt, [[0, 'shrug']], { T: L.T }); cara(v, L.T, { expr: 'happy', mouth: 'grimace' }); show(PORSCHE, 3800 + 12, 0, -4, -.6);
  const h = hp(v); cm([h.x + 10, h.y + 2, h.z + 12, h.x, h.y, h.z, 44], [h.x + 9, h.y + 2, h.z + 10.5, h.x, h.y, h.z, 44], L.k); sh(V(3804, 0, 0), 30); }, [[0, 'flash', .3], [.1, 'chuckle_m', .5]]);
// 28 «Wer will denn bitte keinen Porsche?»: el Porsche plateado, de cerca y en contrapicado, brilla; «PORSCHE»
shot(38.97, 'Z', null, L => { barrioS(L); show(PORSCHE, 3800 + 12, 0, -4, -.6); const v = put(vogt, 3800, 0, 4, .5); neck(v, 26, L.T, { bend: .6 }); cara(v, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); actuar(v, L.lt, [[0, 'hold']], { T: L.T });
  SPARK.forEach((s, i) => { if (i > 5) return; const k = (L.T * 1.4 + i / 6) % 1; s.visible = true; s.position.set(3800 + 12 + [-3, 2, 4, -1, 1.5, -2.5][i], [2.6, 3.2, 2.0, 2.9, 1.6, 2.2][i], -4 + [3, -2, 4, -4, 5, 0][i]); s.scale.setScalar(Math.sin(k * Math.PI) * 2); });
  const a = lerp(-.9, -.3, easeInOut(L.k)); cam([3812 + Math.sin(a) * 15, 3.4, -4 + Math.cos(a) * 15], [3812, 2.6, -4], 44); badge('gold', 'PORSCHE', W / 2, H * .22, (L.lt - .3) * 4, 1, 1.1); sh(V(3812, 0, -4), 20); }, [[0, 'zoom_in', .4], [.1, 'engine', .5], [.4, 'sparkle', .5]]);
// 29 «Aber am schlimmsten hat es Timo erwischt.»: atardecer en la plaza: Timo en un banco junto a Jana, nervioso con el móvil
shot(40.52, 'W', null, L => { town(L, { dusk: true }); sit(timo, 20, 2.4, 6, -Math.PI / 2, L, { aRx: 1.0, aRe: 1.2, aLx: .4 }); neck(timo, 2, L.T); handyP(timo); PH.userData.S.draw('chat', drawChat); cara(timo, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(timo, L.T);
  sit(jana, 20, 2.4, 10.4, -Math.PI / 2, L, { aLx: .4, aRx: .4 }); neck(jana, 2, L.T); jana.head.rotation.y = -.5; cara(jana, L.T, { expr: 'sus' });
  orbit(V(19, 4.6, 8.2), lerp(17, 15, L.k), -.55, .1, 44); sh(V(18, 0, 8), 25); }, [[0, 'whoosh_soft', .4], [.2, 'phone_vibrate', .5], [1.2, 'gulp_nervous', .4]]);
// 30 «Seine Freundin fragt:»: Jana le quita el móvil de la mano, desconfiada
shot(42.41, 'C', null, L => { town(L, { dusk: true }); sit(timo, 20, 2.4, 6, -Math.PI / 2, L, { aRx: lerp(1.0, .4, clamp(L.lt * 3)), aRe: 1.0 }); neck(timo, 2, L.T); cara(timo, L.T, { expr: 'shock', mouth: 'o' }); sit(jana, 20, 2.4, 10.4, -Math.PI / 2 - .3, L, { aRx: 1.3, aRe: .5, aRz: .3, aLx: .4 }); neck(jana, 2, L.T); handyP(jana); PH.userData.S.draw('chat', drawChat); talk(jana, L.T, L.t0, L.t1, 'angry');
  orbit(V(18, 5.4, 8.2), 15, -.3, .12, 42); sh(V(18, 0, 8), 20); }, [[0, 'thump', .4], [.1, 'cloth', .4]]);
// 31 «„Schreibst du mit einer anderen?“»: la pantalla del móvil: «LISA ♥ — Hey Süßer 😘»
shot(43.49, 'Z', null, L => { town(L, { dusk: true }); sit(jana, 20, 2.4, 10.4, -Math.PI / 2 - .3, L, { aRx: 1.3, aRe: .5, aRz: .3 }); neck(jana, 2, L.T); handyP(jana, 1.4); PH.userData.S.draw('chat', drawChat); cara(jana, L.T, { expr: 'angry' });
  PH.updateMatrixWorld(true); const p = wpos(PH), nrm = V(0, 0, 1).applyQuaternion(PH.getWorldQuaternion(new THREE.Quaternion())); const d = lerp(4.2, 3.4, L.k); cam([p.x + nrm.x * d, p.y + nrm.y * d, p.z + nrm.z * d], [p.x, p.y, p.z], 40); camera.up.copy(V(0, 1, 0).applyQuaternion(PH.getWorldQuaternion(new THREE.Quaternion()))); camera.lookAt(p); sh(V(18, 0, 8), 20); DOF = 0; },
  [[0, 'notif', .6], [.4, 'message', .4]]);
// 32 «„Nein.“»: Timo niega con la cabeza, tragando saliva
shot(44.62, 'C', 'punch', L => { town(L, { dusk: true }); sit(timo, 20, 2.4, 6, -Math.PI / 2, L, { aRx: .4, aLx: .4 }); neck(timo, 2, L.T); shake(timo, L.T, 1, 22); cara(timo, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(timo, L.T); neinB(timo, L.lt * 6, 'NEIN.', 1.3);
  onFace(timo, 6, 0, 0, 40, L.k); sh(V(20, 0, 6), 20); }, [[0, 'gulp_nervous', .6]]);
// 33 «Zehn Meter.»: ¡ZAS! el cuello de Timo sale disparado
shot(45.15, 'C', 'punch', L => { town(L, { dusk: true }); sit(timo, 20, 2.4, 6, -Math.PI / 2, L, { aRx: .4, aLx: .4 }); neck(timo, grow(L.lt, .02, 2, 26, .4), L.T); cara(timo, L.T, { expr: 'shock', mouth: 'o' }); sit(jana, 20, 2.4, 10.4, -Math.PI / 2, L, { aLx: .4 }); neck(jana, 2, L.T); cara(jana, L.T, { expr: 'shock', mouth: 'o' });
  meters('+10 METER', (L.lt - .25) * 5, .2, 'red', 1.1); const q = easeOut(clamp(L.lt / .5)); cm([4, 6, 18, 19, 6, 7, 52], [-2, 12, 24, 19, 16, 7, 56], q); sh(V(20, 0, 7), 25); }, [[0, 'impact', .6], [.02, 'stretch', .9]]);
// 34 «„Nein, wirklich nicht!“»: Timo, desde lo alto, se inclina hacia Jana gritando; ella, brazos cruzados
shot(45.86, 'W', null, L => { town(L, { dusk: true }); sit(timo, 20, 2.4, 6, -Math.PI / 2, L, { aRx: 1.2, aLx: 1.2, aLz: -.4, aRz: -.4 }); neck(timo, 26, L.T, { bend: .9 }); shake(timo, L.T, .8, 18); talk(timo, L.T, L.t0, L.t1, 'shout');
  sit(jana, 20, 2.4, 10.4, -Math.PI / 2, L, { aLx: .4 }); neck(jana, 2, L.T); actuar(jana, L.lt, [[0, sitPose({ aLx: 1.2, aRx: 1.2, aLz: -.6, aRz: -.6, aLe: 1.6, aRe: 1.6 })]], { T: L.T, weight: false }); jana.head.rotation.x = -.5; cara(jana, L.T, { expr: 'angry', mouth: 'flat' }); neinB(timo, (L.lt - .05) * 5, 'NEIN!!', 1.4);
  orbit(V(19, 10, 8), lerp(27, 24, L.k), -.35, .05, 50); sh(V(19, 0, 8), 30); }, [[0, 'whoosh_soft', .4], [.05, 'shout_m', .5]]);
// 35 «Zwanzig Meter.»: otro tirón: la cabeza de Timo atraviesa las nubes; «20 METER»
shot(47.74, 'C', 'punch', L => { town(L, { dusk: true }); sit(timo, 20, 2.4, 6, -Math.PI / 2, L, { aRx: .4, aLx: .4 }); const g = grow(L.lt, .05, 26, 60, .5); neck(timo, g, L.T, { bend: .05 }); cara(timo, L.T, { expr: 'shock', mouth: 'o' });
  meters('20 METER', (L.lt - .3) * 4, .2, 'red', 1.3); const h = hp(timo), q = easeOut(clamp(L.lt / .55)); cam([-14, lerp(14, h.y - 10, q), 14], [20, lerp(18, h.y - 4, q), 6], 54); sh(V(20, 0, 6), 50); }, [[0, 'impact', .6], [.05, 'stretch', .9], [.3, 'pop_big', .5]]);
// 36 «Jetzt weiß es die ganze Stadt.»: plano general al atardecer: toda la plaza mira hacia arriba y señala el cuello de Timo; móviles grabando
shot(48.74, 'F', null, L => { town(L, { dusk: true }); sit(timo, 20, 2.4, 6, -Math.PI / 2, L, { aRx: .4, aLx: .4, aLz: -.3, aRz: -.3, aLe: 1.8, aRe: 1.8 }); neck(timo, 60, L.T, { bend: .05 }); cara(timo, L.T, { expr: 'sad', mouth: 'flat' });
  crowdAt(L, -6, 16, 18, 4, 16, 31, { mode: i => ['point', 'cheer', 'shock'][i % 3], from: 0, face: V(20, 40, 6), neck: i => [2, 6, 3, 10, 4, 14, 2, 8, 5, 3, 12, 6, 2, 9, 4, 7, 3, 11][i], gap: 1.3 });
  cm([-30, 5, 34, 16, 26, 4, 60], [-27, 6, 31, 16, 28, 4, 60], L.k); sh(V(0, 0, 14), 60); }, [[0, 'flash', .4], [.1, 'laugh_m', .5], [.3, 'crowd_cheer', .4], [.6, 'camera_shutter', .4]]);
// 37 «Aber ich?»: Luca, de cerca, se señala a sí mismo con una sonrisa
shot(50.38, 'C', 'punch', L => { town(L); put(luca, 0, 0, 6, 0); actuar(luca, L.lt, [[0, { aRx: 1.1, aRz: -.4, aRe: 1.8, aLx: .2 }]], { T: L.T }); cara(luca, L.T, { expr: 'happy', mouth: 'grin' });
  crowdAt(L, 0, 0, 8, 8, 18, 37, { mode: 'talk', from: 0, neck: i => [14, 24, 8, 30, 18, 10, 26, 6][i] });
  onBody(luca, 13, 0, .08, 44, L.k); sh(V(0, 0, 6), 25); }, [[0, 'impact_soft', .5], [.1, 'pop', .4]]);
// 38 «Mein Hals ist völlig normal.»: Luca pasea entre cuellos gigantes con su cuello normal; «NORMAL ✓»
shot(51.06, 'W', null, L => { town(L); const c = put(luca, 0, 0, lerp(8, 4, L.k), Math.PI); caminar(c, L.lt, { x: 0, z: 8, ry: Math.PI, speed: 2.6, T: L.T }); c.root.rotation.y = 0; c.root.position.z = lerp(10, 5, L.k); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); actuar(c, L.lt, [[0, walkP(L.T, 0)]], { T: L.T });
  [[-6, 2, 30], [6, 0, 36], [-9, -8, 24], [8, -10, 40], [0, -14, 28]].forEach(([x, z, n], i) => { const p = put(CR[i + 5], x, 0, z, Math.atan2(-x, 20 - z)); neck(p, n, L.T, { bend: .05 }); cara(p, L.T + i, { expr: 'neutral' }); actuar(p, L.lt, [[0, 'idle']], { T: L.T }); });
  badge('green', 'NORMAL ✓', W / 2, H * .15, (L.lt - .4) * 4, 1, 1); cm([0, 7, 26 + lerp(4, 0, L.k), 0, 9, 0, 54], [0, 7, 22, 0, 9, 0, 54], L.k); sh(V(0, 0, 0), 30); }, [[0, 'whoosh', .4], [.1, 'steps', .4], [.5, 'ding_good', .5]]);
// 39 «Denn ich habe in meinem ganzen Leben»: Luca carga las bolsas de una señora mayor y asiente sonriendo
shot(52.53, 'S', null, L => { town(L); const c = put(luca, 4, 0, -2, -.5); actuar(c, L.lt, [[0, { aLx: .5, aRx: .5, aLe: 1.3, aRe: 1.3, aLz: -.1, aRz: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' }); nod(c, L.T, .6);
  for (let i = 0; i < 4; i++) { const b = DUST[i + 1]; } const o = put(schw, -2, 0, 0, .8); neck(o, 14, L.T, { bend: .4 }); talk(o, L.T, L.t0, L.t1, 'happy'); actuar(o, L.lt, [[0, 'point']], { T: L.T });
  attach(BOOKS, c.aL.hand, [0, -1, .6], [0, 0, 0], .6);
  orbit(V(1.5, 6, -1), lerp(20, 18, L.k), .2, .1, 44); sh(V(1, 0, -1), 25); }, [[0, 'swipe', .4], [.2, 'paper', .4], [.8, 'happy_hum', .4]]);
// 40 «noch nie Nein gesagt.»: junto a Luca, un «NEIN» tachado con una X roja enorme
shot(54.19, 'C', null, L => { town(L); const c = put(luca, 0, 0, 6, 0); actuar(c, L.lt, [[0, { aRx: 1.3, aRz: -.1, aRe: 2.2, aLx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'flat', eyes: 'happy' });
  FX2D.push(cx => { const k = spring(clamp((L.lt - .1) * 3)); if (k <= 0) return; cx.save(); cx.translate(W * .5, H * .15); cx.scale(k * U, k * U); ntxt(cx, 'NEIN', 0, 0, 170, '#ffffff', '#0e1226', 26); const k2 = clamp((L.lt - .4) * 4); cx.strokeStyle = '#ff2a3a'; cx.lineWidth = 34; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(-230, -110); cx.lineTo(-230 + 460 * k2, -110 + 220 * k2); cx.stroke(); if (k2 >= 1) { const k3 = clamp((L.lt - .65) * 4); cx.beginPath(); cx.moveTo(230, -110); cx.lineTo(230 - 460 * k3, -110 + 220 * k3); cx.stroke(); } cx.restore(); });
  onBody(c, 15, .15, .1, 44, L.k, null, null, 5.4); sh(V(0, 0, 6), 25); }, [[0, 'thump', .4], [.4, 'marker', .5], [.65, 'buzzer', .5]]);
// 41 «Kein einziges Mal.»: contador «0× NEIN»; Luca se encoge de hombros, feliz
shot(55.4, 'Z', 'punch', L => { town(L); const c = put(luca, 0, 0, 6, 0); actuar(c, L.lt, [[0, 'shrug']], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'grin' }); crowdAt(L, 0, 6, 6, 8, 16, 41, { mode: 'talk', from: 0, neck: i => [12, 20, 6, 28, 16, 9][i] });
  badge('big', '0× NEIN', W / 2, H * .14, L.lt * 4, 1, 1.2); onBody(c, 16, -.15, .1, 44, L.k, null, null, 5.4); sh(V(0, 0, 6), 25); }, [[0, 'impact_soft', .5], [.1, 'counter_fast', .4], [.4, 'ding', .4]]);
// 42 «Und genau das war mein größtes Problem.» (zoom lento): todos le van dejando cajas y bolsas encima; la torre crece y Luca suda
shot(56.42, 'F', 'slow', L => { town(L); const c = put(luca, 0, 0, 4, 0); actuar(c, L.lt, [[0, { aLx: 1.5, aRx: 1.5, aLe: 1.0, aRe: 1.0, aLz: -.1, aRz: -.1, crouch: .1 + Math.sin(L.T * 6) * .03 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T);
  const n = Math.floor(2 + L.lt * 4.5); for (let i = 0; i < 8; i++) { const b = DUST[i]; } BOOKS.visible = false; attach(BOOKS, c.aL.hand, [.9, -.5, .9], [0, 0, 0], .9); BOOKS.children.forEach((b, i) => b.visible = i < n + 2);
  [[-5, 1, .9], [5, 2, -.9], [-4, -4, .6]].forEach(([x, z, r], i) => { const p = put(CR[i + 20], x, 0, z + 4, r); neck(p, [10, 18, 26][i], L.T, { bend: .3 }); actuar(p, L.lt, [[0, { aRx: 1.4, aRe: .3, aLx: 1.4, aLe: .3 }]], { T: L.T }); cara(p, L.T, { expr: 'happy', mouth: 'open_smile' }); });
  onBody(c, lerp(18, 12, easeIn(L.k)), 0, .12, 46); sh(V(0, 0, 4), 25); }, [[0, 'flash', .3], [.3, 'box_drop', .5], [.9, 'box_drop', .5], [1.5, 'box_drop', .5], [1.9, 'strain', .5]]);
// ---------- b: todos se aprovechan de mí, el Oldtimer y la fábrica (58,89 – 94,67 s) ----------
// Aula (X = 2200): pupitres en x ∈ {-11, 0, 11}, z ∈ {-2, 6, 14}; pizarra en z = -15,5. Patio del colegio (X = 8600): puerta en (0, -24), patio z > -20.
// Sótano (X = 3000): 36 × 40, techo a 14. Barrio (X = 3800): carretera en x ∈ [-8, 8], aceras en ±10, casas en x = ±27.
// Halswerk (X = 4600): valla y puerta en z = 8, fachada en z = -30.
const KX = 2200, SUX_ = 8600, KEX_ = 3000, BAX_ = 3800, FAX_ = 4600, HAX_ = 5600;
const jaB = (c, k, dy = 1.4) => bubble(c, 'JA!', k, dy);
const sitDesk = (c, L, pose = {}) => sit(c, KX, 2.4, 8.8, Math.PI, L, { aLx: 1.2, aRx: 1.2, aLe: .6, aRe: .6, ...pose });
{ const tag = textPlane(1.6, .7, 160, 70, (c, w, h) => { c.fillStyle = '#ffd23f'; c.beginPath(); c.roundRect(2, 2, w - 4, h - 4, 12); c.fill(); c.strokeStyle = '#1a1a1a'; c.lineWidth = 4; c.stroke(); ntxt(c, 'HALSWERK', w / 2, h / 2 + 2, 24, '#1a1a1a'); }); tag.position.set(0, -1.4, .05); KEYS.add(tag); }
// lluvia de espuma al lavar el coche
function foam(c, T, n = 14, r = 2.4) { FOAMP.forEach((f, i) => { if (i >= n) return; const rr = RNG(i * 7 + 3), k = (T * .6 + rr()) % 1; f.visible = true; f.position.set(c.x + (rr() - .5) * r * 2, c.y + (rr() - .3) * 1.4 + k * .6, c.z + (rr() - .5) * r); f.scale.setScalar((.25 + rr() * .35) * (1 - k * .5)); }); }
// anillo rojo dibujado alrededor de un personaje (2D)
const ring2D = (ch, k, r = 170) => FX2D.push(cx => { if (k <= 0) return; const [x, y, z] = proj(hp(ch).add(V(0, .7 * sc_(ch), 0))); if (z >= 1) return; cx.save(); cx.strokeStyle = '#ff2a3a'; cx.lineWidth = 16; cx.lineCap = 'round'; cx.beginPath(); cx.arc(x, y, r * U, -1.6, -1.6 + 6.4 * clamp(k)); cx.stroke(); cx.restore(); });

// 43 «„Machst du meine Hausaufgaben?“»: en clase, un compañero de cuello largo le deja a Luca una torre de cuadernos en el pupitre
shot(58.89, 'W', null, L => { klasseS(L); sitDesk(luca, L); cara(luca, L.T, { expr: 'happy', mouth: 'smile' }); show(BOOKS, KX - .6, 3.75, 6.2, .1, 1.1);
  const p = put(CR[6], KX - 4.2, 0, 4, 1.2); neck(p, 9, L.T, { bend: .7 }); actuar(p, L.lt, [[0, { aRx: 1.3, aRe: .4, aRz: -.2, aLx: .3 }]], { T: L.T }); talk(p, L.T, L.t0, L.t1, 'smug');
  [[KX - 11, -2], [KX + 11, -2], [KX - 11, 6], [KX + 11, 6]].forEach(([x, z], i) => { const c = CR[10 + i]; sit(c, x, 2.4, z + 2.8, Math.PI, L, { aLx: 1.2, aRx: 1.2, aLe: .6, aRe: .6 }); neck(c, [4, 12, 7, 16][i], L.T, { bend: .2 }); cara(c, L.T, { expr: 'neutral' }); });
  cm([KX + 2, 8, -6, KX - 1, 5.5, 7, 46], [KX + 1.5, 7.6, -4, KX - 1, 5.5, 7, 44], L.k); sh(V(KX, 0, 4), 25); }, [[0, 'whoosh_soft', .4], [.1, 'classroom', .4], [.6, 'book_drop', .5], [.65, 'paper_slap', .5]]);
// 44 «Ja!»: Luca levanta el pulgar sonriendo detrás de la torre de cuadernos
shot(60.24, 'C', 'punch', L => { klasseS(L); sitDesk(luca, L, { aRx: 1.6, aRe: 1.6, aRz: -.3 }); cara(luca, L.T, { expr: 'happy', mouth: 'open_smile', eyes: 'happy' }); show(BOOKS, KX - .6, 3.75, 6.2, .1, 1.1); jaB(luca, L.lt * 6);
  onFace(luca, 7, 0, 0, 40, L.k); sh(V(KX, 0, 6), 20); }, [[0, 'pop', .5], [.05, 'ding_good', .4]]);
// 45 «„Krieg ich dein Pausenbrot?“»: en el patio, Marco (chaqueta azul con «M») alarga la mano hacia el Brezel de Luca
shot(60.85, 'S', null, L => { schuleS(L); const c = put(luca, SUX_ - 3, 0, 2, .7); attach(BROT, c.aR.hand, [0, -.8, .4], [0, 0, 0], 1); actuar(c, L.lt, [[0, { aRx: 1.1, aRe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  const m = put(marco, SUX_ + 3.6, 0, 3, -1.8); neck(m, 3.5, L.T); actuar(m, L.lt, [[0, { aRx: lerp(.4, 1.4, clamp(L.lt * 2)), aRe: .3, aLx: .2 }]], { T: L.T }); talk(m, L.T, L.t0, L.t1, 'smug');
  crowdAt(L, SUX_, -8, 6, 10, 22, 45, { mode: 'talk', from: 0, neck: i => [3, 9, 5, 14, 2, 7][i] });
  orbit(V(SUX_ + .3, 5, 2.5), lerp(19, 17, L.k), .1, .08, 46); sh(V(SUX_, 0, 2), 30); }, [[0, 'swipe', .4], [.1, 'kids_chatter', .4]]);
// 46 «Ja!»: Luca se lo da sonriendo; Marco se lo arrebata
shot(62.11, 'C', null, L => { schuleS(L); const c = put(luca, SUX_ - 3, 0, 2, .7); actuar(c, L.lt, [[0, { aRx: 1.4, aRe: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' }); jaB(c, L.lt * 6);
  const m = put(marco, SUX_ + 3.6, 0, 3, -1.8); neck(m, 3.5, L.T); attach(BROT, m.aR.hand, [0, -.8, .4], [0, 0, 0], 1); actuar(m, L.lt, [[0, { aRx: 1.0, aRe: .9 }]], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: 'grin' });
  orbit(V(SUX_ + .3, 5.2, 2.5), 16, -.1, .08, 44); sh(V(SUX_, 0, 2), 25); }, [[0, 'grab', .5], [.05, 'cloth', .4]]);
// 47 «Das war Marco.»: Marco, de cerca, muerde el Brezel con chulería; etiqueta «MARCO»
shot(62.75, 'Z', 'punch', L => { schuleS(L); const m = put(marco, SUX_, 0, 2, 0); neck(m, 3.5, L.T); attach(BROT, m.aR.hand, [0, -.8, .4], [0, 0, 0], 1); actuar(m, L.lt, [[0, { aRx: 2.0, aRe: 1.6, aRz: -.3 }]], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: Math.sin(L.T * 14) > 0 ? 'o' : 'grin' });
  badge('tag', 'MARCO', W / 2, H * .2, (L.lt - .15) * 4, 1, 1.2); onFace(m, 8, -1, 0, 42, L.k); sh(V(SUX_, 0, 2), 20); }, [[0, 'impact_soft', .4], [.1, 'munch', .6]]);
// 48 «Merk ihn dir.» (zoom lento): un círculo rojo se dibuja alrededor de Marco; la viñeta se cierra
shot(63.8, null, 'slow', L => { schuleS(L); const m = put(marco, SUX_, 0, 2, 0); neck(m, 3.5, L.T); actuar(m, L.lt, [[0, 'cross']], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: 'grin' }); ring2D(m, (L.lt - .05) * 2.2, 200);
  onFace(m, lerp(9, 7, easeIn(L.k)), -1, 0, 42); sh(V(SUX_, 0, 2), 20); }, [[0, 'marker', .5], [.2, 'tension_hit', .4]]);
// 49 «Er kommt noch zurück.»: Marco se aleja por el patio, se gira y sonríe de lado; tono oscuro
shot(64.5, 'B', null, L => { schuleS(L); const m = put(marco, SUX_, 0, lerp(4, -6, L.k), Math.PI); actuar(m, L.lt, [[0, walkP(L.T, 2)]], { T: L.T }); m.root.rotation.y = Math.PI; m.head.rotation.y = 2.4; cara(m, L.T, { expr: 'smug', mouth: 'grin', eyes: 'squint' }); neck(m, 3.5, L.T); m.head.rotation.y += Math.PI - .5;
  TINT = 'rgba(30,10,40,.25)'; cm([SUX_ + 3, 5, 16, SUX_, 5, lerp(2, -6, L.k), 44], [SUX_ + 2, 5, 14, SUX_, 5, lerp(2, -6, L.k), 44], L.k); sh(V(SUX_, 0, -2), 25); }, [[0, 'steps', .4], [.3, 'evil_laugh', .4], [.6, 'tension_low', .4]]);
// 50 «„Räumst du meinen ganzen Keller auf?“»: en un sótano lleno de trastos, la vecina asoma la cabeza por la escalera con el cuello doblado bajo el techo
shot(65.6, 'W', null, L => { kellerS(L); const c = put(luca, KEX_ + 2, 0, 4, -.4); attach(BROOM, c.aR.hand, [0, -.4, .3], [.3, 0, 0], 1); actuar(c, L.lt, [[0, { aRx: .8, aRe: .6, aLx: .7, aLe: .8 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  const v = put(CR[9], KEX_ - 10, 0, -6, .8); neck(v, 16, L.T, { bend: 1.4, sway: .02 }); talk(v, L.T, L.t0, L.t1, 'happy'); actuar(v, L.lt, [[0, 'point']], { T: L.T });
  for (let i = 0; i < 6; i++) { const b = DUST[i]; b.visible = true; b.material.opacity = .5; b.position.set(KEX_ - 4 + i * 2.2, 1 + (i % 2), 2 + (i % 3)); b.scale.setScalar(1.2 + (i % 3) * .4); }
  cm([KEX_ + 4, 7, 18, KEX_ - 2, 6.5, -1, 48], [KEX_ + 3.5, 7, 16, KEX_ - 2, 6.5, -1, 46], L.k); sh(V(KEX_, 0, 0), 25); }, [[0, 'door_creak', .4], [.2, 'cave_drip', .3], [.6, 'hello_f', .3]]);
// 51 «Ja!»: Luca barre con energía, polvo por todas partes
shot(67.45, 'C', 'punch', L => { kellerS(L); const c = put(luca, KEX_ + 2, 0, 4, -.4); attach(BROOM, c.aR.hand, [0, -.4, .3], [.3 + Math.sin(L.T * 16) * .5, 0, 0], 1); actuar(c, L.lt, [[0, { aRx: .8 + Math.sin(L.T * 16) * .3, aRe: .6, aLx: .7, aLe: .8 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile', eyes: 'happy' }); jaB(c, L.lt * 6);
  dust(V(KEX_ + 2, 0, 5.5), L.t0, L.T, 12, 1.2); onBody(c, 13, -.2, .1, 44, L.k); sh(V(KEX_, 0, 2), 20); }, [[0, 'brush', .6], [.1, 'dust_puff', .5]]);
// 52 «Jeder nutzt mich aus.»: en la plaza, tres vecinos le cuelgan bolsas y cajas a Luca, que se tambalea
shot(68.0, 'S', null, L => { town(L); const c = put(luca, 0, 0, 2, 0); actuar(c, L.lt, [[0, { aLx: 1.5, aRx: 1.5, aLe: 1.0, aRe: 1.0, crouch: .12 + Math.sin(L.T * 7) * .04, lean: Math.sin(L.T * 3) * .06 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T);
  attach(BOOKS, c.aL.hand, [.9, -.5, .9], [0, 0, 0], 1); [[-5, 3, .9], [5, 4, -1.0], [0, -4, 0]].forEach(([x, z, r], i) => { const p = put(CR[i + 24], x, 0, z, r); neck(p, [8, 14, 20][i], L.T, { bend: .4 }); actuar(p, L.lt, [[0, { aRx: 1.4, aRe: .3 }]], { T: L.T }); cara(p, L.T, { expr: 'happy', mouth: 'open_smile' }); });
  onBody(c, 18, .25, .12, 48, L.k); sh(V(0, 0, 2), 25); }, [[0, 'swipe', .4], [.2, 'box_drop', .5], [.7, 'strain', .5]]);
// 53 «Weil ich immer Ja sage.»: Luca asiente sin parar; «JA!» «JA!» «JA!» a su alrededor
shot(69.28, 'F', null, L => { town(L); const c = put(luca, 0, 0, 4, 0); actuar(c, L.lt, [[0, { aRx: 1.6, aRe: 1.6, aRz: -.2 }]], { T: L.T }); nod(c, L.T, 1); cara(c, L.T, { expr: 'happy', mouth: 'open_smile', eyes: 'happy' });
  [.05, .35, .7].forEach((t, i) => badge('green', 'JA!', W * [.25, .75, .5][i], H * [.3, .26, .16][i], (L.lt - t) * 5, 1, .9));
  onBody(c, 14, 0, .1, 44, L.k); sh(V(0, 0, 4), 25); }, [[.05, 'pop', .5], [.35, 'pop', .5], [.7, 'pop', .5]]);
// 54 «Bis zu dem Tag, der alles verändert hat.» (zoom lento): amanecer sobre el barrio; Luca, de espaldas, mira el sol que sale
shot(70.64, 'B', 'slow', L => { barrioS(L); dusk(); setSky([.2, .36, .8], [.9, .6, .5], [1, .8, .5]); const c = put(luca, BAX_, 0, 10, Math.PI); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'neutral' });
  cm([BAX_ + 2, 5, 24, BAX_, 8, -60, 46], [BAX_ + 1.4, 5, 19, BAX_, 9, -60, 44], easeIn(L.k)); sh(V(BAX_, 0, 0), 40); }, [[0, 'birds_morning', .5], [.3, 'sunrise_shine', .4]]);
// 55 «Während ich das Auto vom Nachbarn wasche,»: Luca lava con una esponja el Porsche rojo de Vogt; espuma y cubo
shot(72.83, 'W', null, L => { barrioS(L); show(PORSCHE, BAX_ + 12, 0, -4, -.6); const c = put(luca, BAX_ + 7.6, 0, -.6, 2.2); attach(SPONGE, c.aR.hand, [0, -.8, .3], [0, 0, 0], 1); actuar(c, L.lt, [[0, { aRx: 1.2 + Math.sin(L.T * 9) * .3, aRz: Math.cos(L.T * 9) * .3, aRe: .5, aLx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  show(BUCKET, BAX_ + 6, 0, 2.4, 0); foam(V(BAX_ + 10.4, 2.6, -2.4), L.T, 16, 2.6);
  orbit(V(BAX_ + 9.6, 3.6, -1.6), lerp(20, 17, L.k), -.9, .12, 46); sh(V(BAX_ + 10, 0, -2), 25); }, [[0, 'whoosh_soft', .4], [.1, 'water_slosh', .5], [.6, 'squeak', .4], [1.0, 'bubbles', .4]]);
// 56 «hält neben mir ein goldener Oldtimer.»: un Oldtimer dorado llega por la calle y frena junto a Luca; destellos
shot(74.69, 'S', null, L => { barrioS(L); show(PORSCHE, BAX_ + 12, 0, -4, -.6); const c = put(luca, BAX_ + 7.6, 0, -.6, 2.2); c.root.rotation.y = lerp(2.2, -1.9, easeInOut(clamp((L.lt - .6) / .5))); attach(SPONGE, c.aR.hand, [0, -.8, .3], [0, 0, 0], 1); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: L.lt > 1 ? 'shock' : 'happy', mouth: L.lt > 1 ? 'o' : 'smile' });
  const z = lerp(-60, 2, easeOut(clamp(L.lt / 1.3))); show(OLD, BAX_ + 2, 0, z, 0); SPARK.forEach((s, i) => { if (i > 6) return; const k = (L.T * 1.6 + i / 7) % 1; s.visible = true; s.position.set(BAX_ + 2 + [-2, 2, 0, -1.5, 1.6, 0, 2.4][i], [3, 4, 5, 2.2, 2.6, 3.4, 4.4][i], z + [4, -2, 0, 6, 2, -4, 3][i]); s.scale.setScalar(Math.sin(k * Math.PI) * 1.6); });
  cm([BAX_ + 14, 6, 16, BAX_ + 3, 3, lerp(-20, 0, easeOut(clamp(L.lt / 1.3))), 46], [BAX_ + 13, 6, 15, BAX_ + 3, 3, 0, 44], L.k); sh(V(BAX_ + 4, 0, 0), 30); }, [[0, 'engine', .6], [.4, 'honk', .4], [1.1, 'brakes_squeak', .6], [1.3, 'sparkle', .5]]);
// 57 «Ein seltsamer alter Mann steigt aus.» (zoom lento): Herr Kranich baja del coche con su bastón dorado y su sombrero
shot(76.58, 'F', 'slow', L => { barrioS(L); show(OLD, BAX_ + 2, 0, 2, 0); const k = put(kranich, BAX_ - .8, 0, lerp(2, 5, easeOut(clamp(L.lt / .8))), .5); attach(CANE, k.aR.hand, [0, -1.6, .3], [0, 0, 0], 1); actuar(k, L.lt, [[0, walkP(L.T * .5, 0)], [.8, 'idle', { dur: .3 }]], { T: L.T }); cara(k, L.T, { expr: 'sus', mouth: 'smile', eyes: 'squint' }); neck(k, 1, L.T);
  orbit(V(BAX_ - .6, 4.8, 4.4), lerp(17, 12, easeIn(L.k)), .7, .1, 44); sh(V(BAX_, 0, 3), 25); }, [[0, 'truck_door', .5], [.4, 'cane_tap', .5], [.9, 'cane_tap', .5], [1.2, 'mystery', .4]]);
// 58 «„Hey, Junge.“»: Kranich se quita el sombrero y saluda; detrás, el Oldtimer
shot(78.7, 'C', null, L => { barrioS(L); show(OLD, BAX_ + 2, 0, 2, 0); const k = put(kranich, BAX_ - .8, 0, 5, .9); attach(CANE, k.aL.hand, [0, -1.6, .3], [0, 0, 0], 1); actuar(k, L.lt, [[0, 'wave']], { T: L.T }); talk(k, L.T, L.t0, L.t1, 'happy'); neck(k, 1, L.T);
  onFace(k, 9, -.5, .6, 42, L.k); sh(V(BAX_, 0, 4), 20); }, [[0, 'thump', .3], [.05, 'hey', .4]]);
// 59 «„Willst du meine Firma haben?“»: Kranich señala a Luca con el bastón; Luca, sorprendido, con la esponja aún en la mano
shot(79.61, 'W', null, L => { barrioS(L); show(OLD, BAX_ + 2, 0, 2, 0); const k = put(kranich, BAX_ - .8, 0, 5, .9); attach(CANE, k.aR.hand, [0, -1.6, .3], [1.3, 0, 0], 1); actuar(k, L.lt, [[0, { aRx: 1.5, aRe: .1, aLx: .2 }]], { T: L.T }); talk(k, L.T, L.t0, L.t1, 'sus'); neck(k, 1, L.T);
  const c = put(luca, BAX_ + 6, 0, 7, -1.9); attach(SPONGE, c.aR.hand, [0, -.8, .3], [0, 0, 0], 1); actuar(c, L.lt, [[0, 'shock']], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  orbit(V(BAX_ + 2.6, 4.8, 6), lerp(20, 18, L.k), -.1 + PI, .1, 46); sh(V(BAX_ + 2, 0, 6), 25); }, [[0, 'whoosh_soft', .4], [.4, 'question', .4]]);
// 60 «Natürlich sage ich: Ja!»: Luca da un salto de alegría: «JA!»
shot(80.88, 'C', 'punch', L => { barrioS(L); const c = put(luca, BAX_ + 6, Math.max(0, Math.sin(clamp((L.lt - .8) / .5) * PI) * 2.5), 7, -1.9); actuar(c, L.lt, [[0, 'idle'], [.8, 'cheer', { dur: .15 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile', eyes: 'happy' }); jaB(c, (L.lt - .85) * 5, 1.6);
  show(OLD, BAX_ + 2, 0, 2, 0); onBody(c, 15, 0, .1, 44, L.k); sh(V(BAX_ + 6, 0, 7), 20); }, [[0, 'impact_soft', .4], [.85, 'jump', .5], [.9, 'cheer_small', .4]]);
// 61 «Er drückt mir die Schlüssel zu einer riesigen»: primer plano de las manos: el manojo de llaves con la etiqueta «HALSWERK» pasa a la mano de Luca
shot(82.36, 'Z', null, L => { barrioS(L); const k = put(kranich, BAX_ + 2.4, 0, 5.6, PI / 2 + .1); neck(k, 1, L.T); const c = put(luca, BAX_ + 6.6, 0, 5.6, -PI / 2 - .1); actuar(k, L.lt, [[0, { aRx: 1.4, aRe: .3, aRz: .2 }]], { T: L.T }); actuar(c, L.lt, [[0, { aLx: 1.3, aLe: .5, aLz: -.2 }]], { T: L.T });
  const hand = L.lt < .7 ? k.aR.hand : c.aL.hand; attach(KEYS, hand, [0, -.9, .3], [0, 0, 0], 1.2); cara(c, L.T, { expr: 'happy', mouth: 'o' }); cara(k, L.T, { expr: 'happy', mouth: 'smile' });
  const m = V(BAX_ + 4.5, 4.4, 5.6); cm([m.x + .5, m.y + 1.2, m.z + 7, m.x, m.y - .3, m.z, 40], [m.x + .4, m.y + 1, m.z + 6, m.x, m.y - .3, m.z, 38], L.k); sh(m.clone().setY(0), 15); }, [[0, 'zoom_in', .4], [.5, 'keys', .7], [1.2, 'ding', .4]]);
// 62 «Fabrik in die Hand.»: destello de la fábrica gigante con las letras HALSWERK
shot(84.04, 'F', null, L => { fabrikS(L); cm([FAX_ - 10, 10, 60, FAX_, 16, -30, 50], [FAX_ - 6, 11, 54, FAX_, 17, -30, 50], L.k); sh(V(FAX_, 0, -20), 70); }, [[0, 'flash', .4], [.1, 'reveal', .4]]);
// 63 «Und weg ist er.»: el Oldtimer sale disparado dejando una nube de polvo; Luca se queda con las llaves, perplejo
shot(84.86, 'W', null, L => { barrioS(L); const z = lerp(2, -90, easeIn(clamp(L.lt / 1.1))); show(OLD, BAX_ + 2, 0, z, PI); dust(V(BAX_ + 2, 0, z + 4), L.t0, L.T, 14, 1.4);
  const c = put(luca, BAX_ + 6, 0, 7, -2.6); attach(KEYS, c.aL.hand, [0, -.9, .3], [0, 0, 0], 1.2); actuar(c, L.lt, [[0, { aLx: 1.3, aLe: .5, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'confused', mouth: 'o' }); c.head.rotation.y = .4;
  cm([BAX_ + 9, 5, 20, BAX_ + 4, 4, -10, 48], [BAX_ + 8.5, 5, 18, BAX_ + 4, 4, -14, 48], L.k); sh(V(BAX_ + 4, 0, 0), 30); }, [[0, 'engine', .6], [.1, 'whoosh', .5], [.6, 'car_pass', .4]]);
// 64 «Aber es gibt ein Problem.» (zoom lento): la fábrica abandonada, la viñeta se cierra
shot(86.11, 'B', 'slow', L => { fabrikS(L); setSky([.3, .42, .7], [.6, .7, .86], [.8, .86, .94]); cm([FAX_, 8, 70, FAX_, 12, -20, 46], [FAX_, 8, 56, FAX_, 12, -20, 42], easeIn(L.k)); sh(V(FAX_, 0, -10), 70); }, [[0, 'crow', .5], [.3, 'wind', .4]]);
// 65 «Die Fabrik steht seit Jahren leer.»: Luca, pequeñito, ante la valla con el cartel GESCHLOSSEN y los hierbajos; vuela el polvo
shot(87.35, 'S', null, L => { fabrikS(L); const c = put(luca, FAX_ + 1, 0, 14, PI); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); attach(KEYS, c.aL.hand, [0, -.9, .3], [0, 0, 0], 1.2); dust(V(FAX_ - 8 + L.lt * 6, 0, 12), L.t0, L.T, 6, 1.2);
  cm([FAX_ + 8, 6, 34, FAX_, 7, 4, 46], [FAX_ + 6, 6, 30, FAX_, 7, 4, 46], L.k); sh(V(FAX_, 0, 8), 30); }, [[0, 'swipe', .4], [.2, 'wind', .5], [.6, 'metal_creak', .4]]);
// 66 «Und die Firma ist komplett pleite.»: Luca mira el móvil: «FIRMENKONTO 0,00 €»; un sello rojo «PLEITE»
shot(89.14, 'C', null, L => { fabrikS(L); const c = put(luca, FAX_ + 1, 0, 14, 0); handyP(c, 1.3); PH.userData.S.draw('pleite', (cx, w, h) => drawBankApp(cx, w, h, '0,00 €', 'FIRMENKONTO', '#ff4a4a')); actuar(c, L.lt, [[0, 'phone_look']], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  FX2D.push(cx => { const k = clamp((L.lt - .5) * 5); if (k <= 0) return; const s = lerp(2.2, 1, easeOut(k)); cx.save(); cx.translate(W * .5, H * .2); cx.rotate(-.18); cx.scale(s * U, s * U); cx.globalAlpha = k; cx.strokeStyle = '#e8202a'; cx.lineWidth = 14; cx.strokeRect(-230, -70, 460, 140); ntxt(cx, 'PLEITE', 0, 4, 110, '#e8202a'); cx.restore(); });
  onBody(c, 12, 0, .15, 44, L.k, null, null, 4); sh(V(FAX_, 0, 14), 20); }, [[0, 'phone_vibrate', .4], [.5, 'stamp', .7], [.6, 'sad_trombone', .4]]);
// 67 «Trotzdem gehe ich rein.»: Luca empuja la puerta de la valla, que se abre chirriando, y entra decidido
shot(90.99, 'W', null, L => { fabrikS(L); const o = easeOut(clamp(L.lt / .7)); FA.GATE.children.forEach(d => { if (d.name === 'door-1') d.rotation.y = -o * 1.3; if (d.name === 'door1') d.rotation.y = o * 1.3; });
  const c = put(luca, FAX_, 0, lerp(13, 4, clamp((L.lt - .2) / 1.2)), PI); actuar(c, L.lt, [[0, { aLx: 1.4, aRx: 1.4, aLe: .2, aRe: .2 }], [.6, walkP(L.T, 0), { dur: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  cm([FAX_ + 4, 6, 28, FAX_, 6, 0, 46], [FAX_ + 3, 6, 24, FAX_, 6, -4, 46], L.k); sh(V(FAX_, 0, 6), 25); }, [[0, 'metal_creak', .6], [.2, 'chain_rattle', .4], [.7, 'steps', .5]]);
const _gateReset = () => FA.GATE.children.forEach(d => { if (d.name && d.name.startsWith('door')) d.rotation.y = 0; });
// 68 «Und was ich da finde, ändert alles.» (zoom lento): dentro de la nave en penumbra, Luca de espaldas ante la silueta de algo enorme cubierto de polvo
shot(92.37, 'B', 'slow', L => { _gateReset(); halleS(L); hemi.intensity = .35; FILL.intensity = 8; renderer.toneMappingExposure = .7; const c = put(luca, HAX_, 0, 22, PI); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  beamDust(V(HAX_, 0, 6), L.T); cm([HAX_ + 2, 7, 36, HAX_, 14, -12, 46], [HAX_ + 1.5, 7, 30, HAX_, 15, -12, 42], easeIn(L.k)); sh(V(HAX_, 0, 0), 50); }, [[0, 'door_creak', .5], [.3, 'echo_drip', .4], [1, 'tension_low', .4]]);
function beamDust(c, T) { DUST.forEach((d, i) => { const r = RNG(i * 9 + 2); d.visible = true; d.position.set(c.x + (r() - .5) * 20, ((T * .3 + r()) % 1) * 24, c.z + (r() - .5) * 20); d.scale.setScalar(.08 + r() * .1); d.material.opacity = .7; }); }
// ---------- c: la máquina, el test, la idea, los carteles y la cola (94,67 – 147,47 s) ----------
// Nave (X = 5600): máquina en (0, 0, -12) (plataforma r = 8, cúpula a y = 30, cartel en y = 33, z = -4,2); panel en (11, 0, -2) girado -0,5;
// suelo de hormigón; puertas al fondo (z = 45). Halswerk por fuera (X = 4600): valla en z = 8, fachada en z = -30.
const MX = HAX_, MZ = -12;
const broken = (k = 1) => { HA.RINGS.forEach((r, i) => { r.rotation.y = i === 2 ? .3 * k : i === 4 ? -.22 * k : 0; r.position.y = 5 + i * 3.4 - (i === 2 ? 1.2 * k : 0); }); };
const panelP = () => wpos(HA.P);
// el enchufe en el suelo y el cable hasta él
function plugAt(p) { HA.PLUG.position.copy(p); HA.PLUG.visible = true; HA.PLUG.position.x -= HAX_; HA.setCable(V(6, .5, -3), HA.PLUG.position.clone()); HA.CABLE.visible = true; }
function plugIn(k) { const s = wpos(HA.SOCK).sub(V(HAX_, 0, 0)); const a = V(14.5, .5, 1.5); const p = a.clone().lerp(s, easeInOut(clamp(k))); plugAt(V(HAX_ + p.x, p.y, p.z)); HA.PLUG.lookAt(V(HAX_ + s.x + 3, s.y, s.z + 1)); }
const bulb = (c, k) => { if (k <= 0) return; const h = hp(c).add(V(0, 3.2 * sc_(c), 0)); SPARK.forEach((s, i) => { if (i > 0) return; s.visible = true; s.position.copy(h); s.scale.setScalar(spring(clamp(k)) * 5); }); FX2D.push(cx => { const [x, y, z] = proj(h); if (z >= 1) return; const s = spring(clamp(k)); cx.save(); cx.translate(x, y); cx.scale(s * U, s * U); cx.fillStyle = '#fff27a'; cx.strokeStyle = '#1a1a1a'; cx.lineWidth = 8; cx.beginPath(); cx.arc(0, -20, 60, 0, 7); cx.fill(); cx.stroke(); cx.fillStyle = '#9aa0aa'; cx.fillRect(-26, 36, 52, 34); cx.strokeRect(-26, 36, 52, 34); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; cx.beginPath(); cx.moveTo(Math.cos(a) * 82, -20 + Math.sin(a) * 82); cx.lineTo(Math.cos(a) * 110, -20 + Math.sin(a) * 110); cx.stroke(); } cx.restore(); }); };

// 69 «Mitten in der Halle steht eine riesige»: la nave se ilumina; Luca, pequeño, de espaldas ante la máquina gigantesca; la cámara sube
shot(94.67, 'F', null, L => { halleS(L); broken(); const c = put(luca, MX, 0, 18, PI); actuar(c, L.lt, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  const q = easeInOut(L.k); cam([MX + 3, lerp(6, 14, q), 36], [MX, lerp(10, 18, q), MZ], 50); sh(V(MX, 0, 0), 50); }, [[0, 'power_on', .5], [.1, 'lamp_hum', .4], [.6, 'echo_drip', .3]]);
// 70 «kaputte Maschine.»: de cerca: anillos torcidos, telarañas, polvo y chispas sueltas
shot(96.39, 'C', 'punch', L => { halleS(L); broken(); for (let i = 0; i < 4; i++) { const s = SPARK[i + 1], k = (L.T * 2.2 + i / 4) % 1; s.visible = k < .3; s.position.set(MX + 5.6 + k * 2, 11 + i * 2 - k * 4, MZ + 4 + i); s.scale.setScalar(1 - k * 3); }
  cm([MX + 10, 10, MZ + 22, MX, 13, MZ, 46], [MX + 9, 10.4, MZ + 19, MX, 13.4, MZ, 44], L.k); sh(V(MX, 0, MZ), 30); }, [[0, 'impact', .4], [.1, 'sparks', .5], [.6, 'metal_creak', .4]]);
// 71 «Auf dem Schild steht: Hals-Schrumpf-Maschine.» (zoom lento): la cámara sube hasta el cartel amarillo
shot(97.54, 'S', 'slow', L => { halleS(L); broken(); const q = easeInOut(clamp(L.lt / .8)); cm([MX, lerp(18, 31, q), MZ + 26, MX, lerp(22, 33, q), MZ + 7.8, 48], [MX, 31.5, MZ + 19, MX, 33, MZ + 7.8, 44], easeIn(L.k) * .3 + q * .7); sh(V(MX, 0, MZ), 40); }, [[0, 'whoosh_up', .4], [.6, 'ding_reveal', .5]]);
// 72 «Anscheinend konnte sie seit Jahren niemand reparieren.»: el panel apagado «OFFLINE»; Luca se rasca la cabeza
shot(99.77, 'W', null, L => { halleS(L); broken(); HA.SCR('OFFLINE', '#ff4a4a'); plugAt(V(MX + 14.5, .5, 1.5)); const c = put(luca, MX + 9, 0, 4.6, 2.8); actuar(c, L.lt, [[0, { aRx: 2.6, aRe: 1.8, aRz: -.3 }]], { T: L.T }); cara(c, L.T, { expr: 'confused', mouth: 'flat' });
  const p = panelP(); cm([p.x + 2, 9, p.z + 16, p.x - 1, 6, p.z, 44], [p.x + 1.5, 9, p.z + 14, p.x - 1, 6, p.z, 42], L.k); sh(V(MX + 10, 0, 0), 25); }, [[0, 'swipe', .4], [.2, 'hum_low', .3], [.8, 'hmm', .5]]);
// 73 «Doch als ich sie mir genauer anschaue,»: Luca se agacha y mira con atención detrás del panel
shot(102.02, 'Z', null, L => { halleS(L); broken(); HA.SCR('OFFLINE', '#ff4a4a'); plugAt(V(MX + 14.5, .5, 1.5)); const c = put(luca, MX + 12.5, 0, 5, 2.6); actuar(c, L.lt, [[0, { crouch: .5, lean: .5, aRx: .8, aLx: .8, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'squint' });
  orbit(V(MX + 13, 3.5, 3), lerp(14, 12, L.k), 2.2, .25, 44); sh(V(MX + 12, 0, 2), 20); }, [[0, 'zoom_in', .4], [.4, 'cloth', .3]]);
// 74 «sehe ich den Grund:»: los ojos de Luca se abren de golpe
shot(103.68, 'C', 'punch', L => { halleS(L); broken(); const c = put(luca, MX + 12.5, 0, 5, 2.6); actuar(c, L.lt, [[0, { crouch: .5, lean: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); onFace(c, 6, 0, 0, 40, L.k); sh(V(MX + 12, 0, 5), 15); }, [[0, 'impact_soft', .5], [.05, 'gasp', .5]]);
// 75 «ein lockeres Kabel.»: primer plano del enchufe naranja suelto en el suelo, junto a la toma vacía
shot(104.62, 'I', null, L => { halleS(L); broken(); plugAt(V(MX + 14.5, .5, 1.5)); const s = wpos(HA.SOCK); const m = V(MX + 14, 1, 1.4).lerp(s, .4); cm([m.x + 4, m.y + 2.4, m.z + 5, m.x, m.y, m.z, 40], [m.x + 3.4, m.y + 2, m.z + 4.2, m.x, m.y, m.z, 38], L.k); ring2Dp(V(MX + 14.5, .6, 1.5), (L.lt - .2) * 2.5); sh(V(MX + 14, 0, 1), 12); },
  [[0, 'iris_pop', .4], [.3, 'ding', .5]]);
const ring2Dp = (p, k, r = 120) => FX2D.push(cx => { if (k <= 0) return; const [x, y, z] = proj(p); if (z >= 1) return; cx.save(); cx.strokeStyle = '#ff2a3a'; cx.lineWidth = 14; cx.lineCap = 'round'; cx.beginPath(); cx.arc(x, y, r * U, -1.6, -1.6 + 6.4 * clamp(k)); cx.stroke(); cx.restore(); });
// 76 «Also stecke ich es wieder ein»: Luca enchufa el cable en la toma: ¡chispas!
shot(105.77, 'S', null, L => { halleS(L); broken(); const k = clamp((L.lt - .2) / .7); plugIn(k); const c = put(luca, MX + 15.2, 0, 4.4, -2.4); actuar(c, L.lt, [[0, { crouch: .45, aRx: 1.3, aRe: .3, aRz: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  if (k >= 1) { const s = wpos(HA.SOCK); for (let i = 0; i < 6; i++) { const sp = SPARK[i], t = (L.lt - .9) * 3 + i * .1; sp.visible = t < 1; sp.position.copy(s).add(V(Math.cos(i) * t * 2, Math.sin(i * 2) * t * 1.5 + 1, Math.sin(i) * t * 2)); sp.scale.setScalar(Math.max(0, 1 - t)); } HA.SCR('BOOT…', '#ffd23f'); }
  const s = wpos(HA.SOCK); cm([s.x + 4, s.y + 3, s.z + 8, s.x - .5, s.y - .3, s.z, 42], [s.x + 3.4, s.y + 2.6, s.z + 7, s.x - .5, s.y - .3, s.z, 40], L.k); sh(s.clone().setY(0), 15); }, [[0, 'swipe', .4], [.75, 'click_metal', .6], [.8, 'sparks', .6], [.85, 'zap', .5]]);
// 77 «und drücke auf Start.»: el dedo pulsa el gran botón rojo de START
shot(107.13, 'C', 'punch', L => { halleS(L); broken(); plugIn(1); HA.SCR('START', '#2aff6a'); const c = put(luca, MX + 13.6, 0, 1.8, -2.1); const pr = clamp((L.lt - .15) / .2); actuar(c, L.lt, [[0, { aRx: lerp(1.0, 1.5, pr), aRe: lerp(1.0, .3, pr), aRz: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  HA.BTN.material.emissiveIntensity = L.lt > .3 ? 2.4 : .3; HA.BTN.position.y = 5.6 - (L.lt > .3 && L.lt < .55 ? .2 : 0); const b = wpos(HA.BTN); cm([b.x + 3.2, b.y + 3.2, b.z + 2.4, b.x, b.y, b.z, 40], [b.x + 2.8, b.y + 2.8, b.z + 2, b.x, b.y, b.z, 38], L.k); sh(b.clone().setY(0), 12); }, [[0, 'thump', .4], [.3, 'button_click', .7], [.35, 'beep', .5]]);
// 78 «Erst passiert nichts.»: silencio; plano general, Luca espera mirando la máquina, que sigue apagada
shot(108.13, 'W', null, L => { halleS(L); broken(); plugIn(1); HA.SCR('…', '#2aff6a'); const c = put(luca, MX + 6, 0, 8, -2.6); actuar(c, L.lt, [[0, { aLx: .2, aRx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'confused', mouth: 'flat' }); c.head.rotation.z = Math.sin(L.T * 2) * .1;
  cm([MX + 18, 8, 28, MX + 2, 10, MZ + 4, 50], [MX + 17, 8, 27, MX + 2, 10, MZ + 4, 50], L.k); sh(V(MX, 0, 0), 40); }, [[0, 'silence_tick', .4], [.3, 'crickets', .5]]);
// 79 «Dann erwacht die Maschine plötzlich zum Leben.»: los anillos se encienden de abajo arriba, zumbido y destello; Luca retrocede
shot(109.31, 'F', 'punch', L => { halleS(L); broken(clamp(1 - (L.lt - .2) * 3)); plugIn(1); HA.SCR('ONLINE', '#2aff6a'); const k = clamp((L.lt - .1) / 1.2); HA.on(k, L.T); const c = put(luca, MX + 6, 0, 8, -2.6); actuar(c, L.lt, [[0, 'shock']], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  if (k > .9) grade.uniforms.flash.value = Math.max(0, 1 - (k - .9) * 10) * .6; cm([MX + 14, 9, 30, MX, 15, MZ, 52], [MX + 10, 10, 26, MX, 16, MZ, 50], L.k); sh(V(MX, 0, 0), 40); }, [[0, 'power_on', .7], [.2, 'machine_hum', .6], [.5, 'hum_glow', .5], [1.3, 'magic_hit', .5]]);
// 80 «Ich weiß sofort, wen ich als Erstes hier reinstelle.» (zoom lento): Luca se frota las manos con una sonrisa pícara ante la máquina encendida
shot(111.19, null, 'slow', L => { halleS(L); HA.on(1, L.T); plugIn(1); const c = put(luca, MX + 4, 0, 6, .3); actuar(c, L.lt, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.5, aRz: -.5, aLe: 1.4 + Math.sin(L.T * 12) * .2, aRe: 1.4 - Math.sin(L.T * 12) * .2 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'grin', eyes: 'squint' });
  onFace(c, lerp(10, 6.5, easeIn(L.k)), .4, -1.4, 42); sh(V(MX + 4, 0, 6), 25); }, [[0, 'hum_glow', .4], [.6, 'chuckle', .5]]);
// 81 «Aber zuerst brauche ich einen Test.»: Luca se gira hacia la puerta pensativo; en la pantalla: «TEST?»
shot(113.84, 'W', null, L => { halleS(L); HA.on(1, L.T); plugIn(1); HA.SCR('TEST?', '#ffd23f'); const c = put(luca, MX + 9, 0, 4, -.4); actuar(c, L.lt, [[0, 'think']], { T: L.T }); cara(c, L.T, { expr: 'confused', mouth: 'flat' });
  const p = panelP(); cm([p.x - 6, 8, p.z + 16, p.x - 2, 6.5, p.z + 1, 46], [p.x - 5, 8, p.z + 14, p.x - 2, 6.5, p.z + 1, 44], L.k); sh(V(MX + 9, 0, 2), 25); }, [[0, 'swipe', .4], [.3, 'hmm', .5], [.7, 'beep', .4]]);
// 82 «Ich teste sie an einem Arbeiter»: entra un obrero con casco cuyo cuello larguísimo va doblado bajo el techo
shot(115.75, 'S', null, L => { halleS(L); HA.on(1, L.T); const a = put(ARB[0], MX + 4, 0, lerp(34, 14, easeOut(clamp(L.lt / 1.3))), PI + .2); neck(a, 34, L.T, { bend: 1.55, sway: .02 }); actuar(a, L.lt, [[0, walkP(L.T, 1)]], { T: L.T }); cara(a, L.T, { expr: 'happy', mouth: 'smile' });
  const c = put(luca, MX + 10, 0, 6, -.9); actuar(c, L.lt, [[0, 'wave']], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' });
  cm([MX + 22, 12, 30, MX + 4, 16, 14, 56], [MX + 20, 13, 26, MX + 4, 17, 12, 56], L.k); sh(V(MX + 4, 0, 18), 40); }, [[0, 'door_open', .4], [.2, 'steps_heavy', .5], [.8, 'laugh_m', .4]]);
// 83 «mit einem lächerlich langen Hals.»: el obrero sobre la plataforma: la cámara sube por su cuello, que atraviesa todos los anillos hasta la cúpula
shot(117.25, 'Z', null, L => { halleS(L); HA.on(1, L.T); const a = put(ARB[0], MX, 2.3, MZ, .2); neck(a, 25, L.T, { sway: .02 }); actuar(a, L.lt, [[0, 'idle']], { T: L.T }); cara(a, L.T, { expr: 'happy', mouth: 'smile' });
  const q = easeInOut(L.k); cam([MX + 6, lerp(6, 28, q), MZ + 20], [MX, lerp(8, 30, q), MZ], 46); badge('red', 'LÄCHERLICH LANG', W / 2, H * .16, (L.lt - .4) * 4, 1, .75); sh(V(MX, 0, MZ), 30); }, [[0, 'whoosh_up', .5], [.4, 'stretch_creak', .5], [.8, 'laugh_kid', .3]]);
// 84 «Ein greller Laser schießt heraus,»: ¡zas! el láser blanco-azul baja por el centro, los anillos giran y todo destella
shot(118.63, 'F', 'punch', L => { halleS(L); HA.on(1, L.T * 2); const a = put(ARB[0], MX, 2.3, MZ, .2); neck(a, 25, L.T, { sway: .04 }); actuar(a, L.lt, [[0, 'shock']], { T: L.T }); cara(a, L.T, { expr: 'shock', mouth: 'o', eyes: 'closed' });
  const k = clamp(L.lt / .2); HA.LASER.material.opacity = k * (.75 + Math.sin(L.T * 40) * .2); HA.LASER.scale.set(1 + Math.sin(L.T * 30) * .3, 1, 1 + Math.sin(L.T * 30) * .3); HA.GLOW.intensity = 260; grade.uniforms.flash.value = Math.max(0, .5 - L.lt);
  for (let i = 0; i < 16; i++) { const s = SPARK[i], t = (L.T * 1.5 + i / 16) % 1, ang = i * 2.4; s.visible = true; s.position.set(MX + Math.cos(ang) * (2 + t * 6), 3 + (i % 8) * 3.4, MZ + Math.sin(ang) * (2 + t * 6)); s.scale.setScalar((1 - t) * 1.4); }
  cm([MX + 9, 14, MZ + 24, MX, 15, MZ, 52], [MX + 7, 15, MZ + 21, MX, 15, MZ, 52], L.k); sh(V(MX, 0, MZ), 30); }, [[0, 'zap', .7], [.05, 'laser', .6], [.1, 'xray', .5], [.6, 'machine_shake', .5]]);
// 85 «und sein Hals schrumpft sofort auf normale Größe.»: el cuello se recoge de golpe hasta tamaño normal; el obrero se toca el cuello, feliz; «NORMAL!»
shot(120.48, 'C', null, L => { halleS(L); HA.on(1, L.T); HA.LASER.material.opacity = clamp(.6 - L.lt); const n = lerp(25, 0, easeIn(clamp((L.lt - .05) / .7))); const a = put(ARB[0], MX, 2.3, MZ, .2); neck(a, n, L.T, { sway: .02 });
  actuar(a, L.lt, [[0, 'shock'], [.9, { aRx: 2.2, aRe: 1.8, aRz: -.4, aLx: 2.6, aLz: .5 }, { dur: .25 }]], { T: L.T }); cara(a, L.T, L.lt > .9 ? { expr: 'joy', mouth: 'open_smile', eyes: 'happy' } : { expr: 'shock', mouth: 'o' });
  badge('green', 'NORMAL!', W / 2, H * .2, (L.lt - 1.0) * 4, 1, 1.2); const h = hp(a); cm([MX + 3, h.y + 4, MZ + 18, MX, h.y, MZ, 44], [MX + 3, h.y + 3, MZ + 15, MX, h.y - .5, MZ, 44], easeOut(L.k)); sh(V(MX, 0, MZ), 25); }, [[0, 'stretch', .6], [.05, 'whoosh_down', .6], [.75, 'pop_big', .5], [1.0, 'ding_good', .6], [1.1, 'cheer_small', .4]]);
// 86 «In diesem Moment habe ich eine Idee.»: Luca chasquea los dedos: una bombilla se enciende sobre su cabeza
shot(122.95, 'W', null, L => { halleS(L); HA.on(1, L.T); const c = put(luca, MX + 6, 0, 8, -.4); actuar(c, L.lt, [[0, 'idle'], [.9, { aRx: 2.4, aRe: 1.0, aRz: -.2 }, { dur: .15 }]], { T: L.T }); cara(c, L.T, L.lt > 1 ? { expr: 'happy', mouth: 'open_smile', eyes: 'wide' } : { expr: 'neutral' }); bulb(c, (L.lt - 1.0) * 4);
  onBody(c, 14, .3, .1, 44, L.k); sh(V(MX + 6, 0, 8), 25); }, [[0, 'whoosh_soft', .4], [1.0, 'ding', .7]]);
// 87 «Eine Idee, die alles verändert.» (zoom lento): sonrisa decidida de Luca con la máquina brillando detrás
shot(124.8, null, 'slow', L => { halleS(L); HA.on(1, L.T); const c = put(luca, MX + 6, 0, 8, -.4); actuar(c, L.lt, [[0, 'fists']], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grin' }); onFace(c, lerp(10, 6.5, easeIn(L.k)), .3, -1.4, 42); sh(V(MX + 6, 0, 8), 25); }, [[0, 'music_swell', .4]]);
// 88 «Denn in dieser Stadt lügen alle.»: la plaza: cuellos larguísimos por todas partes y bocadillos «NEIN!» por todos lados
shot(126.67, 'F', null, L => { town(L); crowdAt(L, 0, -10, 22, 5, 30, 88, { mode: i => ['talk', 'cross', 'point', 'idle'][i % 4], from: 0, neck: i => 8 + (i * 13) % 34, gap: .7 });
  [[.18, .3, .1], [.78, .26, .3], [.5, .14, .5], [.28, .44, .7], [.72, .46, .9], [.55, .34, 1.2]].forEach(([x, y, t]) => badge('red', 'NEIN!', W * x, H * y, (L.lt - t) * 5, 1, .7));
  cm([0, 16, 40, 0, 20, -14, 56], [0, 17, 34, 0, 21, -14, 56], L.k); sh(V(0, 0, -10), 60); }, [[0, 'flash', .3], [.1, 'shout_crowd', .4], [.5, 'stretch_creak', .4], [1.0, 'stretch', .4]]);
// 89 «Und jeder will seinen Hals zurück.»: dos cuellos enredados, gente triste suspirando con el cuello doblado
shot(128.6, 'S', null, L => { town(L); [[-3, 0, 1.1, 1.2], [3, 0, -1.1, 1.2]].forEach(([x, z, r, b], i) => { const c = put(CR[30 + i], x, 0, z, r); neck(c, 16, L.T, { bend: b, sway: .02 }); cara(c, L.T, { expr: 'sad', mouth: 'flat' }); actuar(c, L.lt, [[0, 'slump']], { T: L.T }); });
  crowdAt(L, 0, -6, 8, 8, 18, 89, { mode: 'idle', expr: 'sad', from: 0, neck: i => [20, 30, 14, 26, 18, 34, 22, 12][i] });
  cm([0, 9, 24, 0, 10, 0, 50], [0, 9.5, 21, 0, 10.5, 0, 48], L.k); sh(V(0, 0, 0), 30); }, [[0, 'swipe', .4], [.2, 'sigh', .5], [.8, 'groan', .4]]);
// 90 «Also hänge ich am nächsten Morgen in der ganzen Stadt»: por la mañana, Luca pega su cartel en la columna de anuncios con una brocha
shot(130.26, 'W', null, L => { town(L); show(LITF, 6, 0, -4, -.6); const c = put(luca, 2.6, 0, 1, 2.4); attach(BROOM, c.aR.hand, [0, -.4, .3], [1.2 + Math.sin(L.T * 10) * .3, 0, 0], .5); actuar(c, L.lt, [[0, { aRx: 2.0 + Math.sin(L.T * 10) * .3, aRe: .4, aLx: 1.4, aLe: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  crowdAt(L, 0, -4, 5, 10, 18, 90, { mode: 'walk', from: 0, neck: i => [12, 20, 8, 26, 16][i], speed: 1.5 });
  cm([12, 7, 18, 5, 7, -3, 46], [11, 7, 15.5, 5, 7, -3, 44], L.k); sh(V(5, 0, -2), 25); }, [[0, 'birds_morning', .4], [.2, 'brush', .5], [.8, 'paper', .4]]);
// 91 «Plakate auf.»: carteles amarillos en todas las fachadas y farolas; la cámara barre la calle
shot(132.44, 'R', null, L => { town(L); POSTERS.forEach((p, i) => { show(p, i % 2 ? 42.8 : -42.8, 6, -30 + i * 14, i % 2 ? -PI / 2 : PI / 2); }); show(LITF, 6, 0, -4, -.6);
  crowdAt(L, 0, -10, 8, 6, 22, 91, { mode: 'point', from: 0, neck: i => [10, 18, 6, 24, 14, 28, 9, 20][i], face: V(-42, 6, -16) });
  const a = lerp(-.6, .6, easeInOut(L.k)); cam([0, 8, 20], [Math.sin(a) * 40, 7, 20 - Math.cos(a) * 40], 50); sh(V(0, 0, -10), 50); }, [[0, 'whirl', .4], [.2, 'paper_slap', .5], [.5, 'paper_slap', .5]]);
// 92 «„Hol dir deinen normalen Hals zurück.“»: la gran valla publicitaria en la plaza; los vecinos de cuello largo la leen
shot(133.38, 'Z', null, L => { town(L); show(BILLB, 0, 0, -28, 0); crowdAt(L, 0, -12, 8, 6, 14, 92, { mode: i => i % 2 ? 'point' : 'shock', from: 0, face: V(0, 14, -28), neck: i => [16, 24, 10, 30, 20, 14, 26, 8][i], gap: 1.2 });
  cm([0, 10, 18, 0, 15, -28, 50], [0, 11, 12, 0, 15.6, -28, 48], L.k); sh(V(0, 0, -20), 40); DOF = 0; }, [[0, 'zoom_in', .4], [.2, 'crowd_murmur', .4]]);
// 93 «Nur 999 Euro.»: ¡pum! el precio salta de la valla: «999 €»; lluvia de monedas
shot(135.24, 'C', 'punch', L => { town(L); show(BILLB, 0, 0, -28, 0); crowdAt(L, 0, -12, 8, 6, 14, 92, { mode: 'cheer', from: 0, face: V(0, 14, -28), neck: i => [16, 24, 10, 30, 20, 14, 26, 8][i], gap: 1.2 }); coins(V(0, 12, -18), L.t0, L.T, 24);
  badge('gold', 'NUR 999 €', W / 2, H * .3, L.lt * 5, 1, 1.4); cm([0, 13, 4, 0, 16, -28, 46], [0, 13, 2, 0, 16, -28, 44], L.k); sh(V(0, 0, -20), 40); DOF = 0; }, [[0, 'cash_reg', .7], [.1, 'coins', .5], [.3, 'crowd_cheer', .4]]);
// 94 «Nach wenigen Minuten»: la gente corre hacia la fábrica; cronómetro «5 MIN»
shot(136.8, 'W', null, L => { fabrikS(L); FA.GATE.children.forEach(d => { if (d.name === 'door-1') d.rotation.y = -1.3; if (d.name === 'door1') d.rotation.y = 1.3; }); crowdAt(L, FAX_, 30, 16, 4, 24, 94, { mode: 'run', from: 0, ry: PI, jit: .15, neck: i => 8 + (i * 7) % 26, speed: 6 });
  badge('big', '⏱ 5 MIN', W / 2, H * .16, L.lt * 4, 1, 1); cm([FAX_ + 14, 10, 60, FAX_, 10, 10, 50], [FAX_ + 12, 11, 54, FAX_, 10, 8, 50], L.k); sh(V(FAX_, 0, 20), 50); }, [[0, 'crowd_run', .6], [.1, 'clock_fast', .4]]);
// 95 «stehen dreitausend Leute vor meiner Fabrik Schlange.»: desde el aire: una cola larguísima de cuellos que serpentea hasta la puerta; «3.000»
shot(138.19, 'F', null, L => { fabrikS(L); FA.GATE.children.forEach(d => { if (d.name === 'door-1') d.rotation.y = -1.3; if (d.name === 'door1') d.rotation.y = 1.3; }); queue(L, 34, 0);
  badge('gold', '3.000', W / 2, H * .17, (L.lt - .2) * 4, 1, 1.5); const q = easeInOut(L.k); cm([FAX_ + 40, 60, 110, FAX_ + 4, 8, 30, 50], [FAX_ + 34, 54, 98, FAX_ + 4, 8, 26, 50], q); sh(V(FAX_, 0, 40), 90); }, [[0, 'flash', .3], [.1, 'crowd_murmur', .5], [.4, 'counter_fast', .5], [1.2, 'ding', .4]]);
// cola: personas en zigzag desde la puerta (z = 10) hacia +z
function queue(L, n, from = 0, o = {}) { POST.push(() => { const list = CR.filter(c => !c.root.visible).slice(from, from + n); list.forEach((c, i) => { const row = Math.floor(i / 6), j = i % 6, dir = row % 2 ? -1 : 1; const x = FAX_ + dir * (j - 2.5) * 4.4 + (row % 2 ? 2 : 0), z = 14 + row * 6.5;
  put(c, x, 0, z, PI + (j % 2 ? .2 : -.2)); neck(c, 8 + (i * 11) % 30, L.T, { bend: ((i % 3) - 1) * .1 }); actuar(c, L.lt, [[0, 'idle']], { T: L.T + i }); cara(c, L.T + i, { expr: ['sad', 'neutral', 'happy'][i % 3] }); }); }); }
// 96 «Mein Nachbar.»: Herr Vogt en la cola, con su cuello de diez metros, sonríe avergonzado
shot(140.82, 'C', null, L => { fabrikS(L); const v = put(vogt, FAX_ - 2, 0, 20, PI - .4); neck(v, 26, L.T, { bend: .15 }); actuar(v, L.lt, [[0, 'shrug']], { T: L.T }); cara(v, L.T, { expr: 'happy', mouth: 'grimace' }); queue(L, 18, 0);
  tall(v, 34, -.5, .08, 52, .62); sh(V(FAX_, 0, 20), 30); }, [[0, 'thump', .4], [.2, 'chuckle_m', .4]]);
// 97 «Timo.»: Timo, con su cuello de veinte metros, saluda desde lo alto
shot(141.88, 'W', null, L => { fabrikS(L); const t = put(timo, FAX_ + 2, 0, 26, PI + .3); neck(t, 60, L.T, { bend: .05 }); actuar(t, L.lt, [[0, 'wave']], { T: L.T }); cara(t, L.T, { expr: 'sad', mouth: 'grimace' }); queue(L, 18, 0);
  const h = hp(t); cm([FAX_ - 14, h.y - 6, 48, FAX_ + 2, h.y - 4, 26, 48], [FAX_ - 13, h.y - 5, 46, FAX_ + 2, h.y - 3.4, 26, 48], L.k); sh(V(FAX_, 0, 26), 30); }, [[0, 'whoosh', .4]]);
// 98 «Sogar die Mamas.»: tres mamás con los brazos cruzados y cuellos dobladísimos, en la cola
shot(142.45, 'S', null, L => { fabrikS(L); const m = put(mama, FAX_, 0, 22, PI); neck(m, 30, L.T, { bend: .45 }); actuar(m, L.lt, [[0, 'cross']], { T: L.T }); cara(m, L.T, { expr: 'angry', mouth: 'flat' });
  [[-5, 24], [5, 23]].forEach(([x, z], i) => { const c = put(CR[2 + i * 2], FAX_ + x, 0, z, PI + (i ? -.3 : .3)); neck(c, [24, 34][i], L.T, { bend: [.6, .3][i] }); actuar(c, L.lt, [[0, 'cross']], { T: L.T }); cara(c, L.T, { expr: 'angry' }); });
  cm([FAX_, 12, 52, FAX_, 18, 22, 54], [FAX_, 12.5, 48, FAX_, 18.5, 22, 54], L.k); sh(V(FAX_, 0, 22), 35); }, [[0, 'swipe', .4], [.2, 'tsk', .5]]);
// 99 «Und dann kommt der Bürgermeister,»: en la plaza, la gente se aparta: llega el alcalde con chistera y cadena dorada; su cuello sube fuera de cuadro
shot(143.81, 'W', null, L => { town(L); const b = put(bm, 0, 0, lerp(0, 6, L.k), 0); actuar(b, L.lt, [[0, walkP(L.T * .7, 0)]], { T: L.T }); cara(b, L.T, { expr: 'smug', mouth: 'smile' }); neck(b, 80, L.T, { sway: .02 });
  crowdAt(L, 0, 4, 10, 8, 18, 99, { mode: i => i % 2 ? 'clap' : 'shock', from: 0, face: V(0, 6, 4), neck: i => [10, 18, 6, 24, 14, 8, 20, 12, 16, 22][i] });
  cm([0, 5, 30, 0, 9, 0, 54], [0, 6, 27, 0, 12, 0, 56], L.k); sh(V(0, 0, 4), 30); }, [[0, 'fanfare', .5], [.2, 'steps_heavy', .4], [.5, 'crowd_ohh', .4]]);
// 100 «mit einem Hals höher als der Kirchturm.»: junto a la torre de la iglesia, la cabeza del alcalde (con chistera) asoma por encima de la cruz
shot(145.45, 'Z', null, L => { town(L); const b = put(bm, 14, 0, -104, .3); neck(b, 80, L.T, { sway: .01 }); cara(b, L.T, { expr: 'smug', mouth: 'grin' }); actuar(b, L.lt, [[0, 'idle']], { T: L.T }); const h = hp(b);
  const q = easeInOut(L.k); cam([30, lerp(30, h.y - 6, q), -40], [8, lerp(40, h.y - 4, q), -110], 50); badge('tag', 'BÜRGERMEISTER', W / 2, H * .62, (L.lt - .8) * 4, 1, .9); sh(V(8, 0, -110), 60); }, [[0, 'whoosh_up', .5], [.4, 'church_bell', .6], [1.2, 'laugh_deep', .4]]);


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
  hideAll(); BAD_.length = 0; s.fn(L); while (POST.length) POST.shift()(); clearFaces();
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
  for (const f of FX2D) f(octx); for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { applyPose, hp, luca, renderer, composer, bloom, sun, grade, scene, camera };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

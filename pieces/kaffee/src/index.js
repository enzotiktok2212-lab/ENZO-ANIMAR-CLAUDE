// KAFFEE — «In dieser Stadt macht dich Kaffee reich»: 1 Espresso = 12 €, 1 Kanne = 800 €, 20 Tassen = Millionär, 50 an einem Tag = Billionär.
// Noah (verträgt kein Koffein) findet im Keller von Oma Gerda eine Blechdose, die nie leer wird… und am Ende wird Schlaf das neue Geld.
// Ciudad propia: Röstheim (Altstadt de entramado en otoño, un café en cada esquina, fuente-cafetera). Planos en src/p/*.js; armar.py los une.
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { makeExtra } from './ecast.js';
import { zelle, polizei } from './gsets.js';
import { zahnarzt } from './fsets.js';
import { sportsCar, villa } from './pech.js';
import { bike } from './asets.js';
import { bueroLeer, zimmerF, ministerium } from './bwelt.js';
import { tasse, espresso, kanne, omaKanne, wristMeter, drawHUD, money, euro, nTassen, dose, loeffel, pack, filter, krone, beanGeo, beanMat, broetchen, maschine, kuchen, bett, schiff, drawNews } from './kaffee.js';
import { roestheim, cafeIn, tchiboLaden, salon, kircheIn, kellerO, omaKueche, studio, meer, herbstbaum, glowM } from './kwelt.js';
import { makeIch, makeOma, makeFriseurin, makeZahnarzt, makePfarrer, makeRentner, makeJugend, makeBarista, makeSprecherin, makeBaecker, makeTrickser } from './kvolk.js';
import { makeCop } from './gcast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 194.5, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xf0d8b8, .0008);
const QS = new URLSearchParams(location.search); const HQ = QS.get('hq') !== '0';
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 5000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = QS.get('ao') !== '0';
const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: .0008, maxblur: .01 }); composer.insertPass(bokeh, 2); let DOF = 1;
let CAMT = new THREE.Vector3(); { const la = camera.lookAt.bind(camera); camera.lookAt = (...a) => { if (a.length === 3) CAMT.set(...a); else CAMT.copy(a[0]); la(...a); }; }
const SS = +(QS.get('ss') ?? 1.5); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
if (HQ) { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = +(QS.get('env') ?? .22); renderer.toneMapping = { agx: THREE.AgXToneMapping, aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping }[QS.get('tm') ?? 'neutral']; }
const sky = nightSky(scene); sky.sky.material.depthWrite = !HQ; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0003; sun.shadow.normalBias = .12; sun.shadow.radius = 2.5; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 2048 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-95, 80, 95)); rim.target.position.copy(p); rim.position.copy(p).add(V(70, 45, -100)); }
const OLF = HQ ? 0 : 1; const OC = 3 * SS * OLF, OS = 2.2 * SS * OLF, OP = 1.8 * SS * OLF;
const M2U = 3.95;
// ---------- escenarios ----------
// Röstheim (x = 0): plaza z ∈ [-90, 66]; fachadas a x = ±47 (miran al centro) con terrazas en x = ±40; fuente-cafetera en (0, -8); tranvía por x = -26.
const RT = roestheim(scene, { name: 'RÖSTHEIM', cafes: {} });
const CIX = 1400, BUX = 2200, TLX = 3000, SAX = 3800, SPX = 4600, ZAX = 5400, MEX = 6200, KIX = 7400, ZEX = 8200, OKX = 9000, KEX = 9800, ZIX = 10600, STX = 11400, MIX = 12200, VIX = 13000;
const CI = cafeIn(scene, CIX), BU = bueroLeer(scene, BUX), TL = tchiboLaden(scene, TLX), SA = salon(scene, SAX), SP = salon(scene, SPX, { paris: 1 }), ZA = zahnarzt(scene, ZAX), ME = meer(scene, MEX), KI = kircheIn(scene, KIX), ZE = zelle(scene, ZEX), OK = omaKueche(scene, OKX), KE = kellerO(scene, KEX), ZI = zimmerF(scene, ZIX), ST = studio(scene, STX), MI = ministerium(scene, MIX);
// la villa con los deportivos (X = VIX): césped, villa en (0, -30), camino y tres deportivos delante
const VI = { g: new THREE.Group() }; scene.add(VI.g); VI.g.position.x = VIX; { const gr = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), mat(0x6ab84a, { roughness: 1 })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; VI.g.add(gr); const v = villa(VI.g, 0, -34, 0); VI.CARS = [0, 1, 2].map(k => { const c = sportsCar(VI.g); c.root ? c.root.position.set(-12 + k * 12, 0, -6) : c.position.set(-12 + k * 12, 0, -6); return c; });
  for (let k = 0; k < 6; k++) herbstbaum(VI.g, -40 + k * 16, -70 - (k % 2) * 10, 1.2, k + 3); }
const SETS = { RT: RT.g, CI: CI.g, BU: BU.g, TL: TL.g, SA: SA.g, SP: SP.g, ZA: ZA.g, ME: ME.g, KI: KI.g, ZE: ZE.g, OK: OK.g, KE: KE.g, ZI: ZI.g, ST: ST.g, MI: MI.g, VI: VI.g };
for (const k in SETS) outline(SETS[k], OS);
const HSN = n => RT.HS.find(h => h.name === n);
// ---------- reparto ----------
const ich = makeIch(scene), oma = makeOma(scene), jacky = makeFriseurin(scene), brenner = makeZahnarzt(scene), pfarrer = makePfarrer(scene), barista = makeBarista(scene), sprech = makeSprecherin(scene), baecker = makeBaecker(scene), trick = makeTrickser(scene);
const REN = [0, 1, 2, 3, 4, 5].map(i => makeRentner(scene, i)), JUG = [0, 1, 2, 3].map(i => makeJugend(scene, i)), COPS = [0, 1].map(i => makeCop(scene, i));
kitFace(ich, 'hero'); [oma, jacky, sprech].forEach(c => kitFace(c, 'girl')); [brenner, barista, trick, ...COPS].forEach(c => kitFace(c, 'plain')); [pfarrer, baecker].forEach(c => kitFace(c, 'mustache'));
REN.forEach((c, i) => kitFace(c, i % 2 ? 'girl' : (i % 4 === 0 ? 'mustache' : 'plain'))); JUG.forEach((c, i) => kitFace(c, i % 2 ? 'kid' : 'hero'));
const EX = Array.from({ length: 30 }, (_, i) => makeExtra(scene, i + 60)); EX.forEach((c, i) => kitFace(c, ['girl', 'plain', 'girl', 'hero', 'girl', 'mustache'][i % 6]));
const CR = [...EX]; // multitud (extras Roblox reales)
const MAIN = [ich, oma, jacky, brenner, pfarrer, barista, sprech, baecker, trick, ...REN, ...JUG, ...COPS];
const POOL = [...MAIN, ...EX];
POOL.forEach(c => outline(c.root, OC));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(.5, 'rgba(0,0,0,.26)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -Math.PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const PROPS = [];
const P_ = o => { if (!o.parent) scene.add(o); PROPS.push(o); return o; };
const METERS = new Map(); const meterOf = ch => { let m = METERS.get(ch); if (!m) { m = wristMeter(ch); METERS.set(ch, m); } m.visible = true; return m; };
const CUPC = [0xfbf8f2, 0xc8202a, 0x2a4ab8, 0xf0c040, 0x2e6a3a, 0xff8ad0, 0x1a1a1e, 0xe8582a];
const MUGS = new Map(); let mugN = 0; const mugOf = ch => { let m = MUGS.get(ch); if (!m) { const i = mugN++; m = P_(tasse(scene, { col: CUPC[i % CUPC.length], band: i % 3 === 0 ? 0xd8a020 : null, heart: i % 2 === 0 })); MUGS.set(ch, m); } return m; };
const ESP = Array.from({ length: 4 }, () => P_(espresso(scene))), KAN = Array.from({ length: 3 }, () => P_(kanne(scene)));
const OKAN = P_(omaKanne(scene)), DOSE = P_(dose(scene)), SPOON = P_(loeffel(scene)), FILT = P_(filter(scene));
const PACKS = { TCHIBO: Array.from({ length: 4 }, () => P_(pack(scene, 'TCHIBO', { price: true }))), JACOBS: Array.from({ length: 3 }, () => P_(pack(scene, 'JACOBS', { price: true }))), MELITTA: Array.from({ length: 3 }, () => P_(pack(scene, 'MELITTA', { price: true }))) };
const CROWNS = Array.from({ length: 8 }, () => P_(krone(scene)));
const CUPS = Array.from({ length: 24 }, (_, i) => P_(tasse(scene, { col: CUPC[i % CUPC.length], band: i % 4 === 1 ? 0xd8a020 : null })));
const KUCH = Array.from({ length: 3 }, () => P_(kuchen(scene))), BROT = P_(broetchen(scene)), CARS = [0, 1, 2].map(() => { const c = sportsCar(scene); const r = c.root || c; P_(r); return c; }), BIKES = [0, 1, 2].map(i => P_(bike(scene, [0x2ab86a, 0xd8323a, 0x2a6ad8][i])));
const BETT = P_(bett(scene, { n: 2, quilt: 0x3a4a8a })), SCHIFF = ME.S;
const MASCH = P_(maschine(scene));
// lluvia de granos (instanciada)
const BEANS = new THREE.InstancedMesh(beanGeo(), beanMat(), 260); BEANS.castShadow = true; scene.add(BEANS); BEANS.visible = false; const _o = new THREE.Object3D();
function beanRain(c, T0, T, n = 200, sx = 16, sz = 10, h = 14) { BEANS.visible = true; BEANS.count = n; for (let i = 0; i < n; i++) { const r = RNG(i * 31 + 7), t = T - T0 - r() * .4; const y = t < 0 ? 999 : Math.max(.15, h + r() * 6 - t * (6 + r() * 4)); _o.position.set(c.x + (r() - .5) * sx, c.y + y, c.z + (r() - .5) * sz); _o.rotation.set(t * 5 + i, t * 3 + i * 2, 0); _o.scale.setScalar(1.4); _o.updateMatrix(); BEANS.setMatrixAt(i, _o.matrix); } BEANS.instanceMatrix.needsUpdate = true; }

const CUPGEO = (() => { const a = new THREE.CylinderGeometry(.5, .45, 1.1, 18); a.translate(0, .55, 0); const h = new THREE.TorusGeometry(.28, .08, 6, 12, Math.PI); h.rotateZ(-Math.PI / 2); h.translate(.56, .6, 0); return mergeGeometries([a.toNonIndexed(), h.toNonIndexed()]); })();
const STACK = new THREE.InstancedMesh(CUPGEO, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .3 }), 64); STACK.castShadow = true; scene.add(STACK); STACK.visible = false;
{ const col = new THREE.Color(); for (let i = 0; i < 64; i++) STACK.setColorAt(i, col.setHex(CUPC[(i * 3) % CUPC.length])); }
// pirámide de n tazas vacías con base en c (filas de 6, 5, 4…); k = cuántas se ven (0..1) para que crezca
function stack(c, n, k = 1, ry = 0) { STACK.visible = true; let i = 0, row = 0; const m = Math.floor(n * clamp(k)); while (i < m) { const per = Math.max(1, 7 - row); for (let j = 0; j < per && i < m; j++, i++) { _o.position.set(c.x + (j - (per - 1) / 2) * 1.1 * Math.cos(ry), c.y + row * 1.12, c.z + (j - (per - 1) / 2) * 1.1 * Math.sin(ry) + (row % 2) * .12); _o.rotation.set(0, i * 1.3, 0); _o.scale.setScalar(1); _o.updateMatrix(); STACK.setMatrixAt(i, _o.matrix); } row++; } STACK.count = m; STACK.instanceMatrix.needsUpdate = true; }
// pizarra de la regla en la plaza (marco de madera con tejadillo)
const TAFEL = new THREE.Group(); scene.add(TAFEL); { const wd = mat(0x6a4224, { roughness: .7 }); for (const s of [-1, 1]) cyl(.5, .6, 22, wd, 10, TAFEL, s * 11, 11, 0); box(24, 14, 1, wd, .2, TAFEL, 0, 15, 0); box(26, .8, 3, mat(0x2e6a3a), .1, TAFEL, 0, 22.6, 0); }
const TCV = document.createElement('canvas'); TCV.width = 1024; TCV.height = 576; const TTX = new THREE.CanvasTexture(TCV); TTX.colorSpace = THREE.SRGBColorSpace; { const s = new THREE.Mesh(new THREE.PlaneGeometry(22, 12.4), new THREE.MeshBasicMaterial({ map: TTX, toneMapped: false })); s.position.set(0, 15, .55); TAFEL.add(s); }
TAFEL.userData.draw = fn => { const c = TCV.getContext('2d'); c.clearRect(0, 0, 1024, 576); fn(c, 1024, 576); TTX.needsUpdate = true; }; TAFEL.visible = false;
// billetes (10, 20, 50, 100, 500) y monedas
const BILLT = {}; for (const [d, col] of [[20, '#3a7ad8'], [50, '#f08a2a'], [100, '#3aa85a'], [500, '#8a4ad8']]) BILLT[d] = canvasTex(256, 128, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(10, 10, w - 20, h - 20); c.fillStyle = col; c.beginPath(); c.arc(w * .7, h / 2, 40, 0, 7); c.fill(); c.fillStyle = '#ffffff'; c.font = `700 64px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(d), w * .3, h / 2 + 4); c.font = `700 40px ${FONT}`; c.fillText('€', w * .7, h / 2 + 3); c.strokeStyle = '#ffffff'; c.lineWidth = 5; c.strokeRect(4, 4, w - 8, h - 8); });
const BILL = Array.from({ length: 110 }, (_, i) => { const d = [20, 50, 100, 500][i % 4]; const m = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshStandardMaterial({ map: BILLT[d], side: THREE.DoubleSide, roughness: .7 })); m.castShadow = true; scene.add(m); m.userData.d = d; return P_(m); });
const COIN = Array.from({ length: 30 }, () => { const m = cyl(.5, .5, .12, mat(0xffd23f, { metalness: .9, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .3 }), 18, scene); m.rotation.x = Math.PI / 2; return P_(m); });
// teléfono con pantalla dibujable
const PHONE = P_(new THREE.Group()); scene.add(PHONE); { box(1.1, 2.1, .16, mat(0x1a1a22, { metalness: .6, roughness: .3 }), .12, PHONE, 0, 0, 0); }
const PCV = document.createElement('canvas'); PCV.width = 300; PCV.height = 560; const PTX = new THREE.CanvasTexture(PCV); PTX.colorSpace = THREE.SRGBColorSpace; { const s = new THREE.Mesh(new THREE.PlaneGeometry(.98, 1.9), new THREE.MeshBasicMaterial({ map: PTX, toneMapped: false })); s.position.z = .085; PHONE.add(s); }
PHONE.userData.draw = fn => { const c = PCV.getContext('2d'); c.fillStyle = '#0e1420'; c.fillRect(0, 0, 300, 560); fn(c, 300, 560); PTX.needsUpdate = true; };
function dynSign(w, h, pw, ph) { const g = P_(new THREE.Group()); scene.add(g); const cv = document.createElement('canvas'); cv.width = pw; cv.height = ph; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, roughness: .6, transparent: true })); g.add(m); let key = null;
  g.userData.draw = (k, fn) => { if (k === key) return; key = k; const c = cv.getContext('2d'); c.clearRect(0, 0, pw, ph); fn(c, pw, ph); t.needsUpdate = true; }; return g; }
const DS1 = dynSign(10, 6, 500, 300), DS2 = dynSign(10, 6, 500, 300), DS3 = dynSign(14, 3, 700, 150);
// cartera vacía con polilla
const WALLET = P_(new THREE.Group()); scene.add(WALLET); { const l = mat(0x6a3a1a, { roughness: .6 }); box(2.2, .14, 1.6, l, .06, WALLET, -1.1, 0, 0); const b = box(2.2, .14, 1.6, l, .06, WALLET, 1.1, .3, 0); b.rotation.z = -.3; box(2, .02, 1.4, mat(0x2a1a10), 0, WALLET, -1.1, .08, 0); }
const MOTH = P_(new THREE.Group()); scene.add(MOTH); { const wm = mat(0xc8c0b0, { roughness: 1, side: THREE.DoubleSide }); for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.CircleGeometry(.4, 8), wm); w.position.x = s * .35; w.name = 'w' + s; MOTH.add(w); } box(.12, .12, .5, mat(0x6a6050), .05, MOTH, 0, 0, 0); }
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xffd23f, 0xffffff, 0x3a7ad8, 0xff4a8a, 0x8ad84a][i % 5], side: THREE.DoubleSide })); scene.add(p); return P_(p); });
const DUST = Array.from({ length: 16 }, () => P_(sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8)));
const SWEAT = Array.from({ length: 3 }, () => P_(sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const TEAR = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8)));
const LEAVES = Array.from({ length: 40 }, (_, i) => { const m = new THREE.Mesh(new THREE.CircleGeometry(.4, 5), new THREE.MeshStandardMaterial({ color: [0xe8582a, 0xf09a2a, 0xf6c83a, 0xc8302a][i % 4], side: THREE.DoubleSide, roughness: .9 })); m.userData.noOutline = true; scene.add(m); return P_(m); });
const HALO = P_(new THREE.Mesh(new THREE.TorusGeometry(1.2, .12, 10, 32), glowM(0xffe08a, 2.4))); HALO.rotation.x = Math.PI / 2; scene.add(HALO);
const CUFFS = P_(new THREE.Group()); scene.add(CUFFS); for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.32, .07, 8, 18), mat(0xd8dce4, { metalness: .9, roughness: .2 })); r.position.x = s * .45; CUFFS.add(r); } box(.5, .06, .06, mat(0xd8dce4, { metalness: .9 }), 0, CUFFS, 0, 0, 0);
const POL = P_(polizei(scene));
const BUCKET = P_(new THREE.Group()); scene.add(BUCKET); { cyl(.6, .5, 1.2, mat(0x2a6ad8, { roughness: .4 }), 14, BUCKET, 0, .6, 0); cyl(.55, .55, .05, mat(0x7a4a26, { roughness: .2 }), 14, BUCKET, 0, 1.1, 0); }
const WATERJUG = P_(new THREE.Group()); scene.add(WATERJUG); { cyl(.5, .5, 1.6, new THREE.MeshStandardMaterial({ color: 0xdff4ff, roughness: .05, transparent: true, opacity: .4 }), 14, WATERJUG, 0, .8, 0); cyl(.45, .45, 1.2, mat(0x9fd8ff, { roughness: .1, transparent: true, opacity: .7 }), 14, WATERJUG, 0, .65, 0); }
const TVS = { draw: fn => OK.TV.draw(fn) };

// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.2, .46, .9], [.58, .74, .98], [1, .9, .74]); sky.moon.visible = false; sky.sky.material.uniforms.cloud.value = 1; sky.sky.material.uniforms.starK.value = 0; hemi.intensity = 1.0; hemi.color.setRGB(.82, .9, 1); hemi.groundColor.setRGB(.6, .55, .42); sun.intensity = 3.1; sun.color.setRGB(1, .86, .66); rim.intensity = 1.9; rim.color.setRGB(1, .93, .82);
  scene.fog.color.setRGB(.98, .88, .74); scene.fog.density = .0007; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function dusk() { day(); sun.color.setRGB(1, .66, .42); sun.intensity = 2.3; setSky([.14, .18, .52], [.74, .42, .56], [1, .6, .34]); hemi.color.setRGB(.9, .74, .8); scene.fog.color.setRGB(.9, .66, .6); rim.color.setRGB(1, .6, .4); }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.05; setSky([.04, .05, .2], [.12, .12, .38], [.3, .22, .48]); sky.sky.material.uniforms.cloud.value = 0; sky.sky.material.uniforms.starK.value = 1; sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.1; hemi.color.setRGB(.7, .74, 1); hemi.groundColor.setRGB(.3, .28, .4); sun.intensity = 1.1; sun.color.setRGB(.78, .78, 1); rim.intensity = 1.8;
  scene.fog.color.setRGB(.12, .12, .3); scene.fog.density = .0009; bloom.strength = .32; bloom.threshold = .82; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; bloom.threshold = .86; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.blob.visible = true; }
  for (const p of PROPS) { p.visible = false; p.rotation.order = 'XYZ'; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const k in SETS) SETS[k].visible = false; for (const m of METERS.values()) m.visible = false; TAFEL.visible = false; BEANS.visible = false; STACK.visible = false; RT.TRAM.visible = false; HUD = null; FX2D.length = 0; FACES.length = 0; ZA.LL.visible = false; resetProps();
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.2; grade.uniforms.sharp.value = .5; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; DOF = 1; day(); }

// estado de atrezo que un plano puede cambiar: se restablece en cada fotograma (render determinista en cualquier orden)
function resetProps() { DOSE.userData.open(0); DOSE.userData.glow(0); DOSE.userData.pow.scale.y = .32; KE.D.userData.open(0); KE.D.userData.glow(0); KE.BL.intensity = 90; SCHIFF.position.y = 0; STACK.count = 64; if (typeof DROP !== 'undefined') DROP.scale.setScalar(1);
  for (const p of PROPS) if (p.userData.steam) p.userData.steam(0, 0); for (const p of [KE.D, OK.OK]) p.userData.steam && p.userData.steam(0, 0); for (const e of ESP) e.userData.cup.userData.steam(0, 0); }
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
  else if (['drink', 'prost', 'sitdrink', 'sitprost', 'sithold'].includes(m)) crowdDrink(c, x, z, L, i, o, m);
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); } }
// plano medio/entero de un personaje: cámara delante (yaw relativo a su ry), centro a la altura del pecho
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null, dy = 3.3) { const s = ch.spec.scale || 1, p = ch.root.position, c = V(p.x, p.y + dy * s, p.z); const q = easeInOut(clamp(k)); orbit(c, lerp(dist, dist2 ?? dist * .88, q) * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const _hb = new THREE.Box3(); function heightTo(ch, m) { ch.root.updateMatrixWorld(true); _hb.makeEmpty(); ch.root.traverseVisible(o => { if (o.isMesh && o !== ch.blob) _hb.expandByObject(o, false); }); const t = _hb.max.y - ch.root.position.y; ch.root.scale.multiplyScalar(m * M2U / t); return ch; }
const toCam = ch => { const p = ch.root.position; ch.root.rotation.y = Math.atan2(camera.position.x - p.x, camera.position.z - p.z); };
// ---------- escenarios por plano ----------
// ---------- escenarios por plano ----------
function town(L, o = {}) { use('RT'); if (o.night) { night(30); renderer.toneMappingExposure = .9; TINT = 'rgba(10,16,60,.18)'; } else if (o.dusk) dusk(); else if (o.morning) { day(); sun.color.setRGB(1, .78, .52); sun.intensity = 2.8; setSky([.22, .42, .86], [.74, .74, .9], [1, .78, .58]); scene.fog.color.setRGB(1, .84, .68); } else day(); RT.FOUNT.userData.update(L.T); if (o.tram != null) { RT.TRAM.visible = true; RT.TRAM.position.z = o.tram; } }
function cafe(L) { use('CI'); inside(1.0, 44); FILL.color.setRGB(1, .88, .7); }
function bueroS(L) { use('BU'); inside(.95, 34); }
function tchiboS(L) { use('TL'); inside(1.05, 38); }
function salonS(L, paris = 0) { use(paris ? 'SP' : 'SA'); inside(1.0, 40); FILL.color.setRGB(1, .92, .94); }
function zahnS(L) { use('ZA'); inside(1.0, 40); ZA.LL.visible = true; }
function meerS(L) { use('ME'); day(); scene.fog.density = .0004; }
function kircheS(L, o = {}) { use('KI'); inside(o.night ? .5 : .95, o.night ? 18 : 40); FILL.color.setRGB(1, .9, .74); if (o.night) { renderer.toneMappingExposure = .85; TINT = 'rgba(10,16,60,.2)'; } }
function zelleS(L) { use('ZE'); inside(.85, 30); renderer.toneMappingExposure = .85; }
function kuecheS(L, o = {}) { use('OK'); if (o.night) { inside(.55, 26); OK.WP.material.color.setRGB(.05, .07, .22); FILL.color.setRGB(1, .84, .62); } else { inside(1.0, 40); OK.WP.material.color.setRGB(.62, .84, 1); FILL.color.setRGB(1, .92, .8); } }
function kellerS(L, o = {}) { use('KE'); inside(.32, 8); FILL.color.setRGB(1, .8, .55); renderer.toneMappingExposure = .82; bloom.strength = .3; }
function zimmerS(L, o = {}) { use('ZI'); if (o.night) { inside(.55, 20); ZI.WP.material.color.setRGB(.05, .07, .22); FILL.color.setRGB(.8, .86, 1); } else { inside(.95, 36); ZI.WP.material.color.setRGB(.55, .8, 1); } }
function studioS(L) { use('ST'); inside(1.0, 40); FILL.color.setRGB(.9, .94, 1); }
function minS(L) { use('MI'); inside(1.0, 40); }
function villaS(L) { use('VI'); day(); }
// ---------- beber ----------
// poses del brazo derecho (las de SCHLUCK: la taza tiene el tamaño de la Maß, el borde toca la boca y la mano no entra en la cabeza)
const HOLD = { aRx: .35, aRz: .42, aRe: 1.22 }, HOLDY = .5, CHUG = { aRx: 2.83, aRz: -.323, aRe: .414 }, CHUGY = -.581, SIPP = { aRx: 2.3, aRz: -.38, aRe: .407 }, SIPY = -.362, PRO = { aRx: 2.6, aRz: .25, aRe: .35 };
function holdMug(ch, kind = 'cup') { if (kind === 'none') return null; if (kind === 'esp') { const e = ESP[0]; attach(e, ch.aR.hand, [-.62, -.2, -.5], [PI / 2, 0, 0], 1.1); return e; } if (kind && kind.isObject3D) { attach(kind, ch.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], 1); return kind; } const m = mugOf(ch); attach(m, ch.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], 1); return m; }
// un sorbo: sube la taza (up), bebe (dur) con la cabeza hacia atrás, la baja (dn) y queda satisfecho
function drink(ch, L, t0, dur, o = {}) { const lt = L.T - t0, up = o.up ?? .28, dn = o.dn ?? .28; let k = 0, ph = 'pre';
  if (lt < 0) ph = 'pre'; else if (lt < up) { k = easeInOut(lt / up); ph = 'up'; } else if (lt < up + dur) { k = 1; ph = 'drink'; } else if (lt < up + dur + dn) { k = 1 - easeInOut((lt - up - dur) / dn); ph = 'down'; } else ph = 'after';
  const chug = o.chug, A = chug ? CHUG : SIPP, AY = chug ? CHUGY : SIPY, hx = chug ? -.42 : -.22; const bob = ph === 'drink' ? Math.sin(L.T * 10 + ch.seed) * .02 : 0; const b = o.pose || {};
  const pose = { ...b, aRx: lerp(HOLD.aRx, A.aRx, k) + bob, aRz: lerp(HOLD.aRz, A.aRz, k), aRe: lerp(HOLD.aRe, A.aRe, k), headX: (b.headX || 0) + hx * k + bob, lean: (b.lean || 0) - .05 * k };
  actuar(ch, 0, [[0, pose]], { T: L.T, weight: !o.sit, extra: o.extra }); ch.aR.sh.rotation.y = lerp(HOLDY, AY, k);
  const m = holdMug(ch, o.kind); const l0 = o.l0 ?? .85, l1 = o.l1 ?? .15;
  if (m && m.userData.level) { m.userData.level(ph === 'pre' || ph === 'up' ? l0 : ph === 'drink' ? lerp(l0, l1, clamp((lt - up) / dur)) : l1, L.T); if (m.userData.steam) m.userData.steam(L.T, o.steam ?? (ph === 'pre' || ph === 'up' ? 1 : .4)); }
  if (o.meter) meterOf(ch);
  const ex = o.expr || 'neutral'; if (ph === 'drink') cara(ch, L.T, { expr: ex, eyes: o.eyesD || 'closed', mouth: 'o' }); else if (ph === 'after' || (ph === 'down' && k < .5)) cara(ch, L.T, { expr: o.after || 'joy', mouth: o.afterMouth || 'open_smile' }); else cara(ch, L.T, { expr: ex, mouth: o.mouth });
  if (!o.bg) FACES.push(ch); return { ph, k, lt, up, dur, dn, end: up + dur }; }
function drinkLoop(ch, L, i = 0, o = {}) { const per = o.per ?? 3.2, d = o.d ?? (.7 + (i % 3) * .25), off = (i * 1.37) % per; const t0 = Math.floor((L.T + off) / per) * per - off; return drink(ch, L, t0, d, { bg: true, l0: .8, l1: .4, expr: 'happy', ...o }); }
// taza en alto (brindis) o sujeta (k = 0)
function prost(ch, L, k = 1, o = {}) { const b = o.pose || {}; const pose = { ...b, aRx: lerp(HOLD.aRx, PRO.aRx, k), aRz: lerp(HOLD.aRz, PRO.aRz, k), aRe: lerp(HOLD.aRe, PRO.aRe, k) }; actuar(ch, 0, [[0, pose]], { T: L.T, weight: !o.sit }); ch.aR.sh.rotation.y = lerp(HOLDY, 0, k);
  const m = holdMug(ch, o.kind); if (m) { m.rotation.x = PI - (pose.aRx + pose.aRe); if (m.userData.level) m.userData.level(o.level ?? .8, L.T); if (m.userData.steam) m.userData.steam(L.T, o.steam ?? 1); } if (o.meter) meterOf(ch); return m; }
const holdOnly = (ch, L, o = {}) => prost(ch, L, 0, o);
function crowdDrink(c, x, z, L, i, o, m) { const T = L.T + i * .37; const seat = o.seat ?? 2.65;
  if (m === 'drink') drinkLoop(c, L, i, { meter: o.meter });
  else if (m === 'prost') { const j = Math.abs(Math.sin(L.T * 6 + i)); prost(c, L, .75 + j * .25, { pose: { aLx: .4 + j * .3, aLz: .3, aLe: .4, crouch: j * .05 }, meter: o.meter }); laughF(c, T); }
  else { c.root.position.y = sitY(c, seat); c.blob.visible = false; const sp = sitPose({ aLx: .5, aLe: 1.2, aLz: -.1 });
    if (m === 'sitdrink') drinkLoop(c, L, i, { sit: true, pose: sp, meter: o.meter });
    else if (m === 'sitprost') { const j = Math.abs(Math.sin(L.T * 6 + i)); prost(c, L, .7 + j * .3, { sit: true, pose: { ...sp, aLx: 2.4, aLz: .4 + j * .2, aLe: .3 } }); laughF(c, T); }
    else { holdOnly(c, L, { sit: true, pose: { ...sp, headY: Math.sin(L.T * .9 + i) * .3 } }); cara(c, T, { expr: 'happy', mouth: Math.sin(L.T * 7 + i) > .3 ? 'talk' : 'smile' }); } } }
// terraza de un café de la plaza: gente sentada en las sillas de sus dos mesas (n ≤ 4), bebiendo
function terrace(L, h, n = 4, mode = 'sitdrink', o = {}) { const s = Math.sign(h.x), tx = s * 40; POST.push(() => { const list = (o.list || CR).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); list.forEach((c, i) => { const tz = h.z + (i < 2 ? -3.2 : 3.2), dz = i % 2 ? 1 : -1; const z = tz + dz * 2.4; put(c, tx, 0, z, dz < 0 ? 0 : PI); crowdDrink(c, tx, z, L, i + (o.from || 0), o, typeof mode === 'function' ? mode(i) : mode); }); }); }
// el café de la plaza más cercano a z
const cafeNear = z => RT.HS.filter(h => h.name && /CAF|KAFFEE|MOKKA|ESPRESSO|RÖST/.test(h.name) && Math.abs(h.x) > 40).sort((a, b) => Math.abs(a.z - z) - Math.abs(b.z - z))[0];
// ---------- efectos ----------
// hojas que caen (cerca de c)
function leaves(c, T, n = 30, sx = 30, sz = 20, h = 18) { LEAVES.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 19 + 3); f.visible = true; const y = h - ((T * (1.2 + r() * .8) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 1.7 + i) * 1.4, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 2 + i, T * 1.3 + i * 2, Math.sin(T + i)); }); }
// «Zzz» que suben junto a la cabeza (2D)
function zzz(ch, T, k = 1) { if (k <= 0) return; FX2D.push(c => { const [x, y, z] = proj(hp(ch).add(V(0, 1.2 * (ch.spec.scale || 1), 0))); if (z >= 1) return; for (let i = 0; i < 3; i++) { const t = (T * .7 + i / 3) % 1; c.save(); c.globalAlpha = Math.sin(t * PI) * k; c.translate(x + 60 * U + t * 90 * U, y - t * 200 * U); c.font = `700 ${(40 + i * 14) * U}px ${FONT}`; c.lineWidth = 10 * U; c.strokeStyle = '#0e1226'; c.strokeText('Z', 0, 0); c.fillStyle = '#9ad8ff'; c.fillText('Z', 0, 0); c.restore(); } }); }
// líneas de velocidad (2D)
function speedLines(k = 1, seed = 1) { if (k <= 0) return; FX2D.push(c => { const r = RNG(seed + Math.floor(k * 10)); c.save(); c.globalAlpha = .55 * k; c.strokeStyle = '#ffffff'; for (let i = 0; i < 26; i++) { const y = r() * H, x = r() * W, l = 200 + r() * 500; c.lineWidth = 3 + r() * 7; c.beginPath(); c.moveTo(x, y); c.lineTo(x - l, y); c.stroke(); } c.restore(); }); }
// manos que tiemblan (pose extra)
const tremble = (T, a = 1) => ({ aLz: Math.sin(T * 61) * .07 * a, aRz: Math.sin(T * 57 + 1) * .07 * a, aLe: 1.1 + Math.sin(T * 53) * .08 * a, aRe: 1.1 + Math.sin(T * 59) * .08 * a, aLx: .9, aRx: .9, headZ: Math.sin(T * 37) * .02 * a });
// burbuja de pensamiento con una taza o un texto (2D)
function think(ch, text, k, side = 1) { if (k <= 0) return; FX2D.push(c => { const [x, y, z] = proj(hp(ch).add(V(0, 2.2 * (ch.spec.scale || 1), 0))); if (z >= 1) return; const s = spring(clamp(k) * 1.4) * U; c.save(); c.translate(clamp(x + side * 110 * U, 200, W - 200), clamp(y - 120 * U, 160, H * .55)); c.scale(s, s);
  c.fillStyle = '#ffffff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; for (const [dx, dy, r] of [[-side * 70, 110, 14], [-side * 40, 80, 22]]) { c.beginPath(); c.arc(dx, dy, r, 0, 7); c.fill(); c.stroke(); } c.beginPath(); c.ellipse(0, 0, 150, 80, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.font = `700 48px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 0, 4); c.restore(); }); }

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
const setHUD = (n, col, a = 1, e) => { n = Math.floor(n + 1e-6); HUD = { n: nTassen(n), e: e ?? euro(money(n)), col: col || '#7aff9a', a }; };
// nada tapa la cara de un protagonista: billetes y espuma delante de la cara se apartan
function clearFaces() { if (!FACES.length) return; camera.updateMatrixWorld(); camera.updateProjectionMatrix();
  const F = FACES.filter(c => c.root.visible).map(c => { const h = hp(c).add(V(0, .65 * (c.spec.scale || 1), 0)); const p = h.clone().project(camera); const d = camera.position.distanceTo(h); const r = 1.25 * (c.spec.scale || 1) / (d * Math.tan(camera.fov * PI / 360)); return { p, d, r }; });
  for (const b of [...BILL, ...LEAVES]) { if (!b.visible) continue; const q = b.position.clone().project(camera); const dc = camera.position.distanceTo(b.position); for (const f of F) { if (dc > f.d + .5) continue; if (Math.hypot((q.x - f.p.x) * W / H, q.y - f.p.y) < f.r * 1.15) { b.visible = false; break; } } } }
// ---------- pantallas ----------
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
const KEY = /^(Stadt|Kaffee|reich|Tasse|Geld|Konto|Espresso|Zwölf|Euro|Kanne|Achthundert|Zwanzig|Tassen|Millionär|Erde|Nacht|Schlaf|Familie|Wort|Oma|Acht|neun|Baby|Legende|fünfzig|Billionär|dreißig|Büros|leer|Cafés|voll|Kaffeezähler|Handgelenk|müde|reichsten|Fünfundfünfzig|Vierzig|Kuchen|Rentner|Sportwagen|Fahrrad|guter|Verrückte|teuerste|Tchibo|wenig|doppelt|Friseurin|Jacobs|Krönung|Zufall|zehnten|goldene|Krone|tausend|sieben|Salon|Paris|Zahnarzt|Melitta|Kaffeefilter|erfunden|Neunzehnhundertacht|Dresden|Schulheft|Tropfen|Kreuzfahrtschiff|meisten|Pfarrer|Predigt|elf|Auge|schummeln|braunes|Wasser|Zweiundzwanzig|Gefängnis|Leitungswasser|ehrlich|Erster|Problem|mich|Koffein|halber|sechs|zitterten|Hände|Einzige|Cent|Keller|Kartoffeln|Einmachgläsern|Kaffeedose|Blech|Zettel|Löffel|Niemals|nicht|beste|Lebens|randvoll|drehte|Zehn|Genau|aufgeben|Straßenbahn|Villa|drei|Tchibo-Filiale|Eilmeldung|Wirtschaft|zusammen|Brötchen|Million|Regierung|Kaffeegeld|neue|Stunde|hundert|Minute|geschlafen|Ärmsten|reichste|Welt|weißt|lächelt|wieder|holen)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0; let HUD = null; const FX2D = [];
// ---------- a: gancho, promesa, Oma (CTA) y la leyenda (0 – 35,8 s) ----------
// Plaza de Röstheim: fila del gancho en z = 6 delante de la fuente-cafetera (0, -8); terrazas en x = ±40; carrito de café en (14, 14).
const dcam = (ch, k, d = 10, yaw = -1.0, dy = 5.2, fov = 40) => onBody(ch, d, yaw, .1, fov, k, d * .84, yaw + .12, dy);
const sit2 = (c, x, z, ry, seat = 2.65) => { put(c, x, sitY(c, seat), z, ry); c.blob.visible = false; return c; };
const SITP = sitPose({ aLx: .5, aLe: 1.2, aLz: -.1 });
const TB = V(OKX - 4, 0, 0);   // mesa de la cocina de Oma (sillas norte en z = -4.4 mirando +z, x = TB.x ± 3)
const omaSeat = (c, L, x = -3) => sit2(c, TB.x + x, -4.4, 0);
function drawRule(c, w, h, k) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#3a1e0e'); g.addColorStop(1, '#1a0c04'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 60px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText('JEDE TASSE', w / 2, 64); c.fillStyle = '#f0c060'; c.fillText('= GELD AUFS KONTO!', w / 2, 132);
  [['ESPRESSO', '12 €', .1], ['KANNE', '800 €', .32], ['20 TASSEN', '1 MIO. €', 1]].forEach(([a, b, v], i) => { const x = 200 + i * 312, bh = 300 * v * clamp(k * 1.8 - i * .35); c.fillStyle = ['#f0c060', '#e8823a', '#5aff9a'][i]; c.beginPath(); c.roundRect(x - 84, 520 - bh, 168, bh, 18); c.fill();
    c.font = `700 36px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText(a, x, 552); if (bh > 30) { c.font = `700 44px ${FONT}`; c.fillText(b, x, 520 - bh - 32); } }); }
function drawLegend(c, w, h, k, gold = 0) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, gold ? '#6a4a00' : '#2a1608'); g.addColorStop(1, gold ? '#2a1a00' : '#100804'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.strokeStyle = '#f0c060'; c.lineWidth = 12; c.strokeRect(14, 14, w - 28, h - 28); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#f0c060'; c.font = `700 74px ${FONT}`; c.fillText('DIE LEGENDE', w / 2, 90);
  c.fillStyle = '#ffffff'; c.font = `700 62px ${FONT}`; c.fillText('50 TASSEN', w / 2, 220); c.font = `700 40px ${FONT}`; c.fillText('AN EINEM TAG', w / 2, 290); c.fillStyle = gold ? '#fff4a0' : '#f0c060'; c.font = `700 ${70 + k * 20}px ${FONT}`; c.fillText('= BILLIONÄR', w / 2, 400);
  c.fillStyle = '#d8b090'; c.font = `700 32px ${FONT}`; c.fillText(gold ? 'GESCHAFFT!' : 'REKORD: 29 TASSEN', w / 2, 500); }

// 1 «In dieser Stadt macht dich»: seis vecinos en fila delante de la fuente-cafetera levantan la taza a la vez, beben… y de cada taza sale una lluvia de billetes. Empuje centrado.
shot(0, 'C', null, L => { town(L, { morning: 1 }); const RP = [[-7, 6], [-3.5, 7.5], [0, 8.4], [3.5, 7.5], [7, 6], [0, 2.4]]; const row = [CR[0], CR[1], CR[2], CR[3], CR[4], REN[1]];
  row.forEach((c, i) => { put(c, RP[i][0], 0, RP[i][1], 0); drink(c, L, .05 + Math.abs(i - 2) * .04, .45, { meter: true, bg: i !== 2, expr: 'happy', l1: .2 }); if (L.lt > .62) cashPop(c, '+12 €', clamp((L.lt - .62 - i * .03) / .2), 'green', .75); });
  crowdAt(L, 0, 4, 8, 9, 15, 2, { mode: i => ['drink', 'cheer', 'prost'][i % 3], from: 5, gap: 1.0 }); billFall(V(0, 0, 6), L.t0 + .45, L.T, 70, 22, 8, 16); leaves(V(0, 0, 14), L.T, 16, 30, 10, 18);
  cm([0, 7.2, 36, 0, 5.4, 4, 46], [0, 6.6, 28, 0, 5.4, 4, 44], L.k, easeOut); sh(V(0, 0, 6), 30); },
  [[0, 'sip', .6], [.25, 'crowd_cheer', .3], [.5, 'money_rain', .7], [.7, 'cash', .6]]);
// 2 «Kaffee reich.»: en la terraza, una vecina con abrigo da un sorbo y de su taza explotan billetes; se ríe. Plano de tres cuartos, acercándose.
shot(1.12, 'W', 'punch', L => { town(L, { morning: 1 }); const h = cafeNear(30); const c = sit2(CR[6], h.x * .85 + 0, h.z - 5.6, 0); drink(c, L, L.t0 - .25, .4, { sit: true, pose: SITP, meter: true, expr: 'happy', after: 'joy' });
  billBurst(hp(c).add(V(0, -.8, 0)), L.t0 + .28, L.T, 30, 1.1); cashPop(c, '+12 €', clamp((L.lt - .3) / .2), 'green', 1.1); terrace(L, h, 3, 'sitdrink', { from: 7 });
  dcam(c, L.k, 11, -.9, 4.4, 42); sh(V(c.root.position.x, 0, c.root.position.z), 20); }, [[0, 'ahh', .5], [.28, 'money_burst', .6], [.4, 'cash_reg', .5]]);
// 3 «Jede Tasse, die du trinkst,»: dentro del Café Bohne, el barista desliza la taza por la barra; un cliente la coge y bebe; su Kaffeezähler pita
shot(2.31, 'Z', null, L => { cafe(L); const b = put(barista, CIX - 2, 0, -13.2, 0); actuar(b, L.lt, [[0, { aRx: 1.2, aRe: .6, lean: .1 }], [.5, { aRx: .8, aRe: 1.0, aLx: .4 }, { dur: .4 }]], { T: L.T }); talk(b, L.T, L.t0, L.t0 + 1, 'happy');
  const cu = CUPS[0]; const slide = easeOut(clamp(L.lt / .45)); show(cu, CIX - 2 + slide * 3, 4.7, -10, 0, 1); cu.userData.level(.85); cu.userData.steam(L.T, 1);
  const c = put(CR[8], CIX + 1.6, 0, -6.4, PI); if (L.lt > .5) drink(c, L, L.t0 + .55, .5, { kind: cu, meter: true, expr: 'happy' }); else { actuar(c, 0, [[0, { aRx: .9, aRe: .8 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); }
  crowdAt(L, CIX, 4, 6, 8, 14, 3, { mode: 'drink', gap: 1.4 }); orbit(V(CIX, 5.4, -8.5), lerp(16, 13, L.k), -.55, .14, 44); sh(V(CIX, 0, -8), 20); }, [[0, 'slide', .5], [.5, 'sip', .6], [1.1, 'beep', .5]]);
// 4 «landet sofort als Geld auf deinem Konto.»: un abuelo en un banco de la plaza bebe; en su móvil el saldo salta +12 € y le caen monedas en la mano
shot(3.59, 'S', null, L => { town(L, { morning: 1 }); const c = sit2(REN[0], -16.6, -18, PI / 2, 2.4); drink(c, L, L.t0 - .1, .45, { sit: true, pose: { ...SITP, aLx: .9, aLe: 1.6, aLz: .2 }, meter: true, expr: 'happy' });
  attach(PHONE, c.aL.hand, [0, -.6, .5], [-.4, 0, 0], .9); const k = clamp((L.lt - .6) / .4); PHONE.userData.draw(c_ => drawBankApp(c_, 300, 560, euro(12 * 41 + (k > .5 ? 12 : 0)), k > .5 ? '+12 € KAFFEE' : '', '#5aff9a'));
  coins(hp(c).add(V(1.5, -1, 1)), L.t0 + .7, L.T, 14); cashPop(c, '+12 €', clamp((L.lt - .75) / .2), 'green', 1); crowdAt(L, -10, -10, 6, 7, 14, 6, { mode: i => ['walk', 'drink'][i % 2], gap: 1.6 });
  orbit(V(-16, 4.6, -18), lerp(12, 10, L.k), PI / 2 - .5, .12, 42); sh(V(-16, 0, -18), 18); }, [[0, 'whoosh_soft', .4], [.6, 'notify', .6], [.75, 'coins', .6]]);
// 5 «Ein Espresso?»: primer plano de un espresso humeante en su platito; una mano lo coge
shot(5.64, 'C', 'punch', L => { cafe(L); const e = ESP[0]; show(e, CIX + 6, 4.6, -10, 0, 2.2); e.userData.level(.9); e.userData.cup.userData.steam(L.T, 1); setHUD(0); HUD.a = clamp(L.lt / .2);
  const c = put(CR[9], CIX + 9.2, 0, -6.6, -.7); actuar(c, L.lt, [[0, { aRx: .6, aRe: .9 }], [.2, { aRx: 1.25, aRz: .1, aRe: .7, lean: .12 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'o' });
  cm([CIX + 6, 8.6, -3.8, CIX + 6, 5.6, -10, 36], [CIX + 6, 8.2, -4.8, CIX + 6, 5.5, -10, 34], L.k); sh(V(CIX + 6, 0, -9), 14); DOF = 1.4; }, [[0, 'cup_clink', .6], [.1, 'steam', .4]]);
// 6 «Zwölf Euro.»: el chico de gafas se lo toma de un trago; pling: +12 € y un billete cae en su mano; el HUD marca 1 Tasse · 12 €
shot(6.28, null, null, L => { cafe(L); const c = put(CR[9], CIX + 6, 0, -5, 0); drink(c, L, L.t0 - .15, .3, { kind: 'esp', meter: true, after: 'joy' }); meterOf(c).userData.set('1 Tasse', '12 €'); setHUD(1);
  billDrop(c, L.t0 + .2, L.T, 3, 1.4); cashPop(c, '+12 €', clamp((L.lt - .2) / .2), 'green', 1.2); crowdAt(L, CIX + 4, -2, 5, 7, 12, 9, { mode: 'drink', gap: 1.6 });
  orbit(V(CIX + 6, 5.4, -5), lerp(11.5, 10, L.k), -.25, .1, 42); sh(V(CIX + 6, 0, -5), 16); }, [[0, 'gulp', .5], [.2, 'cash_reg', .7], [.3, 'paper', .4]]);
// 7 «Eine ganze Kanne?»: en la terraza, un señor levanta una cafetera entera y se la bebe directamente
shot(7.37, 'W', null, L => { town(L, { morning: 1 }); const h = cafeNear(-30); const c = put(REN[2], h.x * .82, 0, h.z + 2, h.x < 0 ? PI / 2 : -PI / 2); const K = KAN[0]; K.userData.level(lerp(1, .5, clamp((L.lt - .3) / .5)));
  drink(c, L, L.t0 + .1, .6, { kind: K, chug: true, meter: true, expr: 'determined', eyesD: 'squint' }); K.userData.steam(L.T, 1); setHUD(L.lt < .5 ? 1 : 4);
  terrace(L, h, 4, i => ['sitprost', 'sithold', 'sitdrink', 'sitprost'][i], { from: 10 }); dcam(c, L.k, 11, -.9, 5.2, 42); sh(V(c.root.position.x, 0, c.root.position.z), 20); },
  [[0, 'whoosh_soft', .4], [.1, 'gulp_long', .6], [.7, 'crowd_ooh', .3]]);
// 8 «Achthundert Euro.»: la Kanne vacía en alto, estallido de billetes, +800 €; la terraza aplaude
shot(8.19, 'C', 'punch', L => { town(L, { morning: 1 }); const h = cafeNear(-30); const c = put(REN[2], h.x * .82, 0, h.z + 2, h.x < 0 ? PI / 2 : -PI / 2); const K = KAN[0]; K.userData.level(0); prost(c, L, 1, { kind: K, pose: { aLx: 2.6, aLz: .4 } }); laughF(c, L.T); meterOf(c).userData.set('8 Tassen', '800 €'); setHUD(8, '#f0c060');
  billBurst(hp(c).add(V(0, 1, 0)), L.t0, L.T, 34, 1.3); cashPop(c, '+800 €', clamp(L.lt / .2), 'gold', 1.3); terrace(L, h, 4, 'sitcheer', { from: 10 }); crowdAt(L, h.x * .7, h.z + 8, 5, 5, 10, 11, { mode: 'clap', gap: 1.6 });
  orbit(V(c.root.position.x, 5.6, c.root.position.z), lerp(14, 12, L.k), (h.x < 0 ? PI / 2 : -PI / 2) + .35, .12, 42); sh(V(c.root.position.x, 0, c.root.position.z), 20); }, [[0, 'cash_reg', .7], [.05, 'money_burst', .6], [.3, 'clap', .5]]);
// 9 «Zwanzig Tassen?» (zoom lento): una señora con abrigo rojo, detrás de una pirámide de 19 tazas vacías, se bebe la número 20
shot(9.35, 'F', 'slow', L => { town(L, { morning: 1 }); const h = cafeNear(10); const tx = Math.sign(h.x) * 40; const c = sit2(REN[3], tx, h.z - 5.6, 0); drink(c, L, L.t0 + .05, .6, { sit: true, pose: SITP, meter: true, expr: 'determined', eyesD: 'squint' }); setHUD(L.lt < .75 ? 19 : 20, '#f0c060');
  stack(V(tx + (h.x < 0 ? 1.4 : -1.4), 3.98, h.z - 3.2), 19, 1, 0); terrace(L, h, 2, 'sithold', { from: 14 }); crowdAt(L, tx * .85, h.z - 2, 6, 6, 12, 12, { mode: 'clap', gap: 1.8 });
  dcam(c, L.k, 12, -.95, 4.2, 42); sh(V(tx, 0, h.z - 4), 18); }, [[0, 'gulp_long', .6], [.5, 'drumroll', .4]]);
// 10 «Und schon bist du Millionär!»: la levantan en hombros, confeti y lluvia de billetes; el HUD 20 Tassen · 1 Mio. € en dorado
shot(10.44, 'Z', 'punch', L => { town(L, { morning: 1 }); const c = put(REN[3], 0, lerp(0, 2.4, easeOut(clamp(L.lt / .3))), 10, 0); prost(c, L, 1, { pose: { aLx: 2.8, aLz: .5 } }); laughF(c, L.T); setHUD(20, '#ffd23f'); meterOf(c).userData.set('20 Tassen', '1 Mio. €', '#ffd23f');
  const lift = [CR[11], CR[12], CR[13]]; lift.forEach((x, i) => { put(x, -1.6 + i * 1.6, 0, 9.2 - (i % 2) * .8, 0); actuar(x, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .1, aRz: .1, aLe: .2, aRe: .2 }]], { T: L.T }); laughF(x, L.T + i); });
  confetti(V(0, 6, 10), L.t0, L.T, 70, 1.2); billRain(V(0, 0, 8), L.T, 70, 24, 12, 16); cashPop(c, '1 MIO. €', clamp((L.lt - .2) / .25), 'gold', 1.4, 3.6); crowdAt(L, 0, 6, 10, 7, 14, 15, { mode: i => ['cheer', 'clap', 'prost'][i % 3], from: 14 });
  orbit(V(0, 7.4, 10), lerp(20, 17, L.k), .1, .12, 46); sh(V(0, 0, 10), 26); }, [[0, 'crowd_cheer', .5], [.1, 'confetti', .6], [.3, 'cash_reg', .5], [.6, 'party_horn', .4]]);
// 11 «Einen Tag lang hatte ich mehr Geld»: yo (Noah) en lo alto de la escalinata de la villa, una lluvia de billetes; abro los brazos. HUD 1 Bio. €
shot(12.23, 'F', null, L => { villaS(L); const c = put(ich, VIX, 0, -10, 0); actuar(c, L.lt, [[0, { aLx: .4, aRx: .4 }], [.2, { aLx: 2.4, aRx: 2.4, aLz: .9, aRz: .9, aLe: .2, aRe: .2, headX: -.15 }, { dur: .4 }]], { T: L.T }); laughF(c, L.T); setHUD(50, '#ffd23f');
  billRain(V(VIX, 0, -10), L.T, 90, 26, 18, 20); confRain(V(VIX, 0, -8), L.T, 40, 24, 14, 18); orbit(V(VIX, 5, -10), lerp(17, 14, L.k), -.2, .1, 44); sh(V(VIX, 0, -10), 28); },
  [[0, 'flash', .4], [.1, 'money_rain', .7], [.5, 'cha_ching', .5]]);
// 12 «als jeder andere Mensch auf der Erde.»: en la plaza, de pie en el borde de la fuente con montones de billetes; abajo la gente me señala con la boca abierta
shot(13.84, 'W', null, L => { town(L, { morning: 1 }); const c = put(ich, 0, 2.2, 4, 0); actuar(c, 0, [[0, { aLx: 2.2, aLz: .6, aRx: .5, aRz: .2, aLe: .4 }]], { T: L.T }); laughF(c, L.T); setHUD(50, '#ffd23f');
  crowdAt(L, 0, 10, 12, 5, 12, 16, { mode: i => ['point', 'shock'][i % 2], face: V(0, 6, 4), gap: .9 }); billRain(V(0, 0, 4), L.T, 60, 18, 10, 16);
  cm([0, 3.2, 30, 0, 6.8, 4, 48], [0, 4.2, 25, 0, 7.4, 4, 46], L.k); sh(V(0, 0, 6), 26); }, [[0, 'whoosh', .4], [.2, 'crowd_ooh', .5], [.9, 'money_rain', .4]]);
// 13 «Heute würde ich alles hergeben»: de noche en mi cuarto, tumbado en la cama con los ojos como platos y ojeras; el despertador marca 3:00
shot(15.81, 'B', null, L => { zimmerS(L, { night: 1 }); const c = put(ich, ZIX - 7, 1.6, -3.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.set(-PI / 2 + .25, 0, 0); c.blob.visible = false;
  actuar(c, 0, [[0, { aLx: .2, aRx: .2, headX: .3 }]], { T: L.T, breathe: true }); cara(c, L.T, { eyes: 'wide', mouth: 'flat' }); DS1.userData.draw('3:00', (cc, w, h) => { cc.fillStyle = '#0a0a10'; cc.fillRect(0, 0, w, h); cc.fillStyle = '#ff3a3a'; cc.font = `700 200px ${FONT}`; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('3:00', w / 2, h / 2 + 10); });
  show(DS1, ZIX - 1, 4.2, -7.5, 0, .32); cm([ZIX - 3.5, 10.5, 6, ZIX - 7, 4.4, -3.6, 40], [ZIX - 4.5, 10, 4, ZIX - 7, 4.2, -3.6, 38], L.k); sh(V(ZIX - 6, 0, -3), 14); DOF = 0; },
  [[0, 'clock_tick', .6], [.6, 'clock_tick', .6], [1.2, 'owl', .3]]);
// 14 «für eine einzige Nacht Schlaf.» (zoom lento): primer plano de mi cara agotada, parpadeo nervioso; un «Zzz» se aleja sin llegar
shot(17.15, null, 'slow', L => { zimmerS(L, { night: 1 }); const c = put(ich, ZIX - 7, 1.6, -3.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.set(-PI / 2 + .25, 0, 0); c.blob.visible = false; actuar(c, 0, [[0, { headX: .3 }]], { T: L.T });
  cara(c, L.T, { eyes: Math.sin(L.T * 9) > .85 ? 'half' : 'wide', mouth: 'wavy' }); think(c, 'Zzz…?', clamp((L.lt - .3) / .3), 1);
  const h = hp(c); cm([h.x, h.y + 7.8, h.z + 3.4, h.x, h.y, h.z, 36], [h.x, h.y + 6.2, h.z + 2.6, h.x, h.y, h.z, 32], L.k); sh(V(ZIX - 6, 0, -3), 14); DOF = 0; }, [[0, 'heartbeat', .5], [.8, 'heartbeat', .5]]);
// 15 «Jeder hat so jemanden in der Familie,»: desayuno familiar en la cocina de Oma: todos charlan, ríen y beben… menos Oma
shot(18.81, 'C', null, L => { kuecheS(L); const o = omaSeat(oma, L, -3); holdOnly(o, L, { sit: true, pose: { ...SITP, lean: .1 } }); cara(o, L.T, { expr: 'angry', eyes: 'half', mouth: 'flat' });
  const p = sit2(REN[4], TB.x + 3, -4.4, 0); drinkLoop(p, L, 1, { sit: true, pose: SITP }); talk(p, L.T, L.t0, L.t1, 'happy');
  const k1 = put(JUG[0], TB.x + 7.8, 0, -1, -PI / 2 - .3); actuar(k1, 0, [[0, { aRx: 1.1, aRz: .3, aRe: 1.2 }]], { T: L.T }); talk(k1, L.T, L.t0, L.t1, 'happy'); const k2 = put(REN[5], TB.x - 8, 0, -1, PI / 2 + .3); drinkLoop(k2, L, 2); laughF(k2, L.T);
  orbit(V(TB.x, 5.2, -2.6), lerp(19, 17, L.k), .05, .16, 46); sh(V(TB.x, 0, -2), 20); }, [[0, 'chatter', .5], [.4, 'laugh_small', .4], [1.0, 'cup_clink', .4]]);
// 16 «der vor der ersten Tasse kein Wort sagt.»: el nieto le dice «Guten Morgen, Oma!»… Oma lo mira fijamente, sin decir nada, con la taza vacía
shot(20.47, 'W', null, L => { kuecheS(L); const o = omaSeat(oma, L, -3); actuar(o, L.lt, [[0, { ...SITP, aRx: .7, aRe: 1.1 }], [.9, { ...SITP, aRx: .7, aRe: 1.1, headY: .4 }, { dur: .3 }]], { T: L.T, weight: false }); cara(o, L.T, { expr: 'angry', eyes: 'squint', mouth: 'flat' });
  const cu = mugOf(oma); attach(cu, o.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], 1); cu.userData.level(0);
  const k1 = put(JUG[0], TB.x + 2.2, 0, -1.2, -PI / 2 - .6); actuar(k1, 0, [[0, 'wave']], { T: L.T }); talk(k1, L.T, L.t0, L.t0 + .9, 'happy'); bubble(k1, 'Guten Morgen, Oma!', clamp((L.lt - .1) / .2), 2.2);
  if (L.lt > 1.0) { const q = clamp((L.lt - 1.0) / .2); badge('q', '…', W * .3, H * .3, q, 1, .9); }
  onFace(o, 5.2, .4, -.8, 38, L.k); sh(V(TB.x - 3, 0, -4), 14); }, [[0, 'chair_creak', .4], [.2, 'hello', .3], [1.0, 'cricket', .4]]);
// 17 «Bei uns ist das meine Oma.»: Oma da el primer sorbo de su Kanne de flores… y se le ilumina la cara; etiqueta OMA GERDA
shot(22.57, 'C', 'punch', L => { kuecheS(L); const o = omaSeat(oma, L, -3); show(OKAN, TB.x - 1.2, 4.3, -1, .4, 1); OKAN.userData.steam(L.T, 1);
  drink(o, L, L.t0 + .15, .55, { sit: true, pose: SITP, expr: 'tired', after: 'joy', afterMouth: 'open_smile' }); if (L.lt > .95) confetti(hp(o).add(V(0, -2, 0)), L.t0 + .95, L.T, 18, .5);
  badge('tag', 'OMA GERDA', W / 2, H * .2, clamp((L.lt - .2) / .2), 1, 1.1); onFace(o, 6.4, .6, -1.3, 40, L.k); sh(V(TB.x - 3, 0, -4), 14); }, [[0, 'sip', .6], [.9, 'sparkle', .5], [1.0, 'aah_old', .4]]);
// 18 «Acht Tassen am Tag,»: Oma con ocho tazas vacías en fila sobre la mesa, se toma la octava; el reloj de cuco salta de hora en hora
shot(24.58, 'S', null, L => { kuecheS(L); const o = omaSeat(oma, L, -3); drink(o, L, L.t0 + .35, .5, { sit: true, pose: SITP, meter: true, expr: 'happy' }); meterOf(o).userData.set(L.lt < .9 ? '7 Tassen' : '8 Tassen', L.lt < .9 ? '700 €' : '800 €');
  for (let i = 0; i < 7; i++) { const t = CUPS[i]; show(t, TB.x - 5 + i * 1.55, 4.3, -1.6 + (i % 2) * .7, i, .8); t.userData.level(0); } badge('num', String(Math.min(8, 1 + Math.floor(L.lt / .2))) + ' TASSEN', W / 2, H * .2, clamp(L.lt / .15), 1, 1);
  orbit(V(TB.x - 1.5, 4.8, -3), lerp(15, 13, L.k), .3, .2, 44); sh(V(TB.x - 2, 0, -3), 16); }, [[0, 'cup_clink', .5], [.3, 'cup_clink', .4], [.6, 'cup_clink', .4], [.9, 'cuckoo', .5]]);
// 19 «und um neun schläft sie trotzdem wie ein Baby.»: de noche, Oma dormida en su sillón verde con la boca abierta, roncando; el reloj marca las 21:00; Zzz
shot(26.22, 'B', null, L => { kuecheS(L, { night: 1 }); const o = put(oma, OKX + 6, sitY(oma, 2.6), -5, PI / 2); o.blob.visible = false; actuar(o, 0, [[0, sitPose({ headX: .35, headZ: .25, aLx: .3, aRx: .3, aLe: .6, aRe: .6 })]], { T: L.T, weight: false }); cara(o, L.T, { eyes: 'closed', mouth: Math.sin(L.T * 2.4) > 0 ? 'o' : 'flat' }); zzz(o, L.T, 1);
  DS1.userData.draw('21', (cc, w, h) => { cc.fillStyle = '#fbf6ee'; cc.fillRect(0, 0, w, h); cc.fillStyle = '#1a1a1a'; cc.font = `700 170px ${FONT}`; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('21:00', w / 2, h / 2 + 8); }); show(DS1, OKX + 2, 9.5, -12.4, 0, .4);
  orbit(V(OKX + 6, 5, -5), lerp(13, 11, L.k), PI / 2 + .45, .14, 42); sh(V(OKX + 6, 0, -5), 14); }, [[0, 'snore', .6], [1.2, 'snore', .6], [.5, 'clock_tick', .3]]);
// 20 «Und die Legende sagt:»: al atardecer, la gente se reúne alrededor de la pizarra de madera de la plaza, que se ilumina con LA LEYENDA
shot(28.61, 'F', null, L => { town(L, { dusk: 1 }); show(TAFEL, 0, 0, -26, 0); TAFEL.userData.draw((c, w, h) => drawLegend(c, w, h, 0));
  crowdAt(L, 0, -14, 10, 4, 9, 21, { mode: i => ['point', 'shock', 'idle'][i % 3], face: V(0, 15, -26), gap: 1.6 });
  cm([0, 8, 22, 0, 13, -26, 48], [0, 9.5, 12, 0, 14.5, -26, 46], L.k); sh(V(0, 0, -16), 30); DOF = 0; }, [[0, 'whoosh', .4], [.1, 'mystery', .6], [.6, 'crowd_ooh', .3]]);
// 21 «Wer an einem einzigen Tag fünfzig Tassen»: en la terraza, una pirámide gigante de 50 tazas que crece taza a taza; el número 50 sube
shot(29.83, 'S', null, L => { town(L, { dusk: 1 }); const h = cafeNear(-60); const tx = Math.sign(h.x) * 40; stack(V(tx, 3.98, h.z - 3.2), 50, clamp(L.lt / 1.3), 0); const k = Math.min(50, Math.floor(clamp(L.lt / 1.3) * 50));
  badge('num', k + ' TASSEN', W / 2, H * .2, clamp(L.lt / .12), 1, 1.05); terrace(L, h, 3, 'sitcheer', { from: 4 });
  orbit(V(tx, 8, h.z - 3.2), lerp(22, 18, L.k), (h.x < 0 ? PI / 2 : -PI / 2) * .6, .18, 46); sh(V(tx, 0, h.z), 20); }, [[0, 'tick', .4], [.3, 'tick', .4], [.6, 'tick', .4], [.9, 'tick', .4], [1.2, 'tick', .4]]);
// 22 «schafft, wird Billionär.» (zoom lento): la pizarra en dorado: = BILLIONÄR; brillos; una corona de oro gira encima
shot(31.39, 'Z', 'slow', L => { town(L, { dusk: 1 }); show(TAFEL, 0, 0, -26, 0); TAFEL.userData.draw((c, w, h) => drawLegend(c, w, h, clamp(L.lt / 1.5), 0)); const cr = CROWNS[0]; show(cr, 0, 25.5 + Math.sin(L.T * 3) * .3, -25, L.T * 1.5, 3);
  confRain(V(0, 8, -24), L.T, 30, 26, 6, 20); crowdAt(L, 0, -14, 8, 4, 9, 21, { mode: 'shock', face: V(0, 15, -26), gap: 1.6 });
  cm([0, 14, 6, 0, 16.5, -26, 44], [0, 15, -2, 0, 17, -26, 40], L.k); sh(V(0, 0, -20), 30); DOF = 0; }, [[0, 'sparkle', .5], [.6, 'choir', .4]]);
// 23 «Aber bei Tasse dreißig»: un hombre fortachón en la terraza, rodeado de 29 tazas, tiembla con los ojos desorbitados al coger la 30
shot(33.47, 'C', null, L => { town(L, { dusk: 1 }); const h = cafeNear(30); const tx = Math.sign(h.x) * 40; const c = sit2(CR[16], tx, h.z - 5.6, 0); const T2 = L.T;
  drink(c, L, L.t0 + .4, .5, { sit: true, pose: { ...SITP, ...tremble(T2, 1.4) }, meter: true, expr: 'shock', eyesD: 'wide' }); stack(V(tx + (h.x < 0 ? 1.4 : -1.4), 3.98, h.z - 3.2), 29, 1); sweat(c, L.T, 3); setHUD(L.lt < .9 ? 29 : 30, '#ff8a4a');
  dcam(c, L.k, 11, -.85, 4.4, 42); sh(V(tx, 0, h.z - 4), 18); }, [[0, 'heartbeat', .6], [.4, 'shiver', .5]]);
// 24 «gibt jeder auf.»: se cae de la silla de espaldas, la taza vuela; la gente de las otras mesas se tapa la boca
shot(34.53, 'C', 'punch', L => { town(L, { dusk: 1 }); const h = cafeNear(30); const tx = Math.sign(h.x) * 40; const c = put(CR[16], tx, 0, h.z - 5.6, 0); const k = easeIn(clamp(L.lt / .45));
  c.root.rotation.order = 'YXZ'; c.root.rotation.x = -k * 1.5; c.root.position.z -= k * 2; c.root.position.y = 1.3 * (1 - k) + .4; actuar(c, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: .8, aRz: .8, lLx: 1.4, lRx: 1.0 }]], { T: L.T }); cara(c, L.T, { eyes: k > .9 ? 'closed' : 'scared', mouth: 'scream' });
  const cu = CUPS[3]; show(cu, tx + 1 + L.lt * 2, 6 + L.lt * 6 - L.lt * L.lt * 18, h.z - 4, L.T * 9, 1); cu.rotation.x = L.T * 7; stack(V(tx + (h.x < 0 ? 1.4 : -1.4), 3.98, h.z - 3.2), 29, 1); setHUD(30, '#ff4a4a');
  terrace(L, h, 2, 'sithold', { from: 18 }); crowdAt(L, tx * .85, h.z + 2, 5, 5, 10, 24, { mode: 'shock', gap: 1.6 }); badge('red', 'AUFGEGEBEN!', W / 2, H * .22, clamp((L.lt - .4) / .2), 1, .9);
  orbit(V(tx, 4, h.z - 6), lerp(15, 13, L.k), (h.x < 0 ? -.6 : .6), .2, 44); sh(V(tx, 0, h.z - 5), 18); }, [[0, 'chair_fall', .6], [.35, 'thud', .7], [.5, 'cup_break', .5], [.6, 'crowd_gasp', .4]]);
// ---------- b: la ciudad del café, los mayores y Tchibo (35,8 – 65,3 s) ----------
// 25 «Deshalb sind die Büros hier leer»: oficina vacía: monitores apagados, sillas giradas, polvo y una planta seca; una sola persona recoge su caja y se va
shot(35.84, 'W', null, L => { bueroS(L); const c = put(CR[17], BUX + 4 - L.lt * 3, 0, 4, -PI / 2); actuar(c, 0, [[0, { ...runP(L.T, 1), aLx: 1.3, aRx: 1.3, aLe: 1.4, aRe: 1.4, lean: .05 }]], { T: L.T }); grin(c, L.T); c.root.position.y = Math.abs(Math.sin(L.T * 13)) * .3;
  dust(V(BUX, 0, 2), L.t0, L.T, 10, 1.2); cm([BUX + 14, 9, 20, BUX, 5, -2, 48], [BUX + 9, 8, 16, BUX, 5, -2, 46], L.k); sh(V(BUX, 0, 0), 30); }, [[0, 'office_empty', .5], [.2, 'footsteps_fast', .5], [.9, 'door_close', .4]]);
// 26 «und die Cafés voll.»: el Café Bohne a reventar: todas las mesas llenas, gente de pie en la barra, el barista no da abasto
shot(37.12, 'Z', null, L => { cafe(L); const b = put(barista, CIX - 6, 0, -13.2, 0); actuar(b, L.lt, [[0, { aRx: 1.2, aRe: .8, aLx: 1.1, aLe: .9, twist: Math.sin(L.T * 9) * .2 }]], { T: L.T }); sweat(b, L.T, 2); cara(b, L.T, { expr: 'happy', mouth: 'open_smile' }); MASCH.visible = false;
  const seats = []; for (const [x, z] of CI.TB) for (const dx of [-1, 1]) seats.push([CIX + x + dx * 2.6, z, dx < 0 ? PI / 2 : -PI / 2]);
  POST.push(() => { const L2 = CR.filter(c => !c.root.visible); seats.forEach(([x, z, ry], i) => { const c = L2[i]; if (!c) return; sit2(c, x, z, ry, 2.6); crowdDrink(c, x, z, L, i, {}, i % 3 ? 'sitdrink' : 'sitprost'); }); });
  crowdAt(L, CIX, -6, 6, 2, 6, 31, { mode: 'drink', list: REN, gap: 2.2 }); orbit(V(CIX, 6, 1), lerp(26, 22, L.k), .25, .28, 50); sh(V(CIX, 0, 2), 26); }, [[0, 'cafe_busy', .6], [.4, 'steam_wand', .4], [.8, 'cup_clink', .4]]);
// 27 «Gezählt wird mit einem Kaffeezähler»: primerísimo plano de la muñeca: el reloj dorado KAFFEEZÄHLER, un dedo lo toca y la pantalla se enciende
shot(38.48, 'C', 'punch', L => { town(L, { morning: 1 }); const c = put(CR[18], 0, 0, 12, 0); actuar(c, 0, [[0, { aLx: 1.5, aLz: -.5, aLe: 1.5, aRx: 1.2, aRz: -.2, aRe: 1.2 }]], { T: L.T }); cara(c, L.T, { expr: 'happy' }); const m = meterOf(c); m.userData.set(L.lt < .5 ? '' : '3 Tassen', L.lt < .5 ? '' : '36 €');
  const w = wpos(m); cm([w.x + 1.2, w.y + 1.6, w.z + 4.6, w.x, w.y, w.z, 34], [w.x + .9, w.y + 1.2, w.z + 3.6, w.x, w.y, w.z, 32], L.k); sh(V(0, 0, 12), 14); DOF = 1.6; }, [[0, 'beep', .6], [.5, 'power_on', .5]]);
// 28 «am Handgelenk.»: la vecina da un sorbo y el reloj de su muñeca sube a +12 € con una chispa; cámara orbita
shot(40.02, 'W', null, L => { town(L, { morning: 1 }); const c = put(CR[19], 2, 0, 18, -.3); drink(c, L, L.t0 - .1, .35, { meter: true, expr: 'happy', pose: { aLx: 1.3, aLz: -.4, aLe: 1.4 } }); meterOf(c).userData.set('4 Tassen', '48 €'); cashPop(c, '+12 €', clamp((L.lt - .4) / .2), 'green', .9);
  crowdAt(L, 2, 12, 6, 7, 13, 32, { mode: i => ['walk', 'drink'][i % 2], gap: 1.6 }); orbit(V(2, 4.6, 18), lerp(10, 9, L.k), -.6, .12, 42); sh(V(2, 0, 18), 16); }, [[0, 'sip', .5], [.4, 'beep', .5]]);
// 29 «Und seit hier jeder Kaffee trinkt,»: mañana en la plaza: gente con vasos para llevar trotando, patinando y en bici, con energía
shot(40.84, 'S', null, L => { town(L, { morning: 1 }); crowdAt(L, 0, 4, 12, 4, 16, 34, { mode: i => i % 3 === 2 ? 'cheer' : 'run', speed: 7, dir: 0, jit: 0, gap: .4, ry: PI / 2 + .3 }); leaves(V(0, 0, 10), L.T, 30, 40, 20, 18);
  POST.push(() => CR.filter(c => c.root.visible).forEach((c, i) => { if (i % 2) { const cu = CUPS[i % 20]; attach(cu, c.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], .9); cu.userData.level(.7); } }));
  cm([-18, 6, 32, 0, 5, 4, 48], [-10, 6.5, 30, 2, 5, 4, 46], L.k); sh(V(0, 0, 6), 34); }, [[0, 'footsteps_fast', .5], [.3, 'bike_bell', .5], [.8, 'whistle_happy', .4]]);
// 30 «ist niemand mehr müde.»: el tranvía amarillo entra en la plaza y el conductor saluda sonriente con su taza; los de dentro también
shot(42.50, 'W', null, L => { town(L, { morning: 1, tram: lerp(40, 10, easeOut(L.k)) }); const z = RT.TRAM.position.z; const d = put(barista, -26, 1.6, z + 7.5, 0); d.blob.visible = false; actuar(d, 0, [[0, 'wave']], { T: L.T }); cara(d, L.T, { expr: 'joy', mouth: 'open_smile' });
  const cu = CUPS[5]; attach(cu, d.aL.hand, [.84, -.2, -.72], [PI / 2, 0, 0], .9); cu.userData.level(.6); bubble(d, 'Guten Morgen!', clamp((L.lt - .2) / .2), 2.2);
  crowdAt(L, -16, z, 6, 5, 10, 36, { mode: 'wave', gap: 1.2 }); cm([-12, 7, z + 26, -26, 6, z + 6, 44], [-14, 7, z + 22, -26, 6, z + 7, 42], L.k); sh(V(-24, 0, z + 6), 26); }, [[0, 'tram_bell', .7], [.3, 'tram_pass', .5], [.6, 'hello', .3]]);
// 31 «Am reichsten sind übrigens»: terraza de los mayores: señoras y señores con abrigos, joyas y fajos de billetes sobre la mesa, brindando con sus tazas
shot(43.76, 'F', null, L => { town(L, { morning: 1 }); const h = cafeNear(-20); const tx = Math.sign(h.x) * 40; terrace(L, h, 4, i => ['sitprost', 'sitdrink', 'sitprost', 'sithold'][i], { list: REN });
  for (let i = 0; i < 6; i++) { const b = BILL[i]; b.visible = true; b.position.set(tx - 1 + (i % 3) * .9, 4.1 + (i / 3 | 0) * .12, h.z - 3.2 + (i % 2) * .5); b.rotation.set(-PI / 2, i, 0); }
  coins(V(tx, 1, h.z), L.t0, L.T, 12); orbit(V(tx, 4.4, h.z), lerp(17, 15, L.k), (h.x < 0 ? 1 : -1) * 1.1, .16, 44); sh(V(tx, 0, h.z), 20); }, [[0, 'cup_clink', .5], [.4, 'laugh_old', .5], [.9, 'coins', .4]]);
// 32 «die über Fünfundfünfzig.»: zoom a un señor con gorra plana y gafas de piloto que levanta su taza; sello dorado «55+»
shot(45.20, 'C', 'punch', L => { town(L, { morning: 1 }); const h = cafeNear(-20); const tx = Math.sign(h.x) * 40; terrace(L, h, 4, i => i === 0 ? 'sitprost' : 'sithold', { list: [REN[0], REN[1], REN[2], REN[3]] });
  POST.push(() => { badge('gold', '55+', W / 2, H * .22, clamp(L.lt / .2), 1, 1.6); }); orbit(V(tx, 5.2, h.z - 5.6), lerp(9, 8, L.k), (h.x < 0 ? 1 : -1) * .5, .1, 40); sh(V(tx, 0, h.z), 16); }, [[0, 'stamp', .7], [.1, 'cha_ching', .5]]);
// 33 «Vierzig Jahre lang jeden Morgen eine Tasse,»: amanecer: un abuelo en el balcón de su casa de entramado con su taza humeante; el calendario vuela de año en año
shot(46.30, 'W', null, L => { town(L, { morning: 1 }); const c = put(REN[4], 0, 0, 30, PI); drink(c, L, L.t0 + .6, .6, { expr: 'warm', after: 'joy', steam: 1 }); const yr = 1985 + Math.floor(clamp(L.lt / 1.9) * 40);
  badge('big', String(yr), W / 2, H * .2, clamp(L.lt / .15), 1, 1.1); badge('tag', '40 JAHRE', W / 2, H * .3, clamp((L.lt - 1.4) / .2), 1, 1); leaves(V(0, 0, 26), L.T, 20, 20, 10, 14);
  orbit(V(0, 5, 30), lerp(12, 10, L.k), PI + .4, .1, 42); sh(V(0, 0, 30), 18); }, [[0, 'birds_morning', .5], [.2, 'page_flip', .4], [.8, 'page_flip', .4], [1.4, 'sip', .5]]);
// 34 «und um drei Kaffee und Kuchen.»: en la cocina de Oma: las amigas de Oma alrededor de la mesa con la tarta Selva Negra; el cuco da las tres
shot(48.92, 'C', null, L => { kuecheS(L); const o = omaSeat(oma, L, -3); drinkLoop(o, L, 0, { sit: true, pose: SITP }); const f = sit2(REN[1], TB.x + 3, -4.4, 0); prost(f, L, .8, { sit: true, pose: SITP }); laughF(f, L.T);
  const g2 = put(REN[3], TB.x + 8, 0, -1, -PI / 2 - .3); drinkLoop(g2, L, 2); const g3 = put(REN[5], TB.x - 8, 0, -1, PI / 2 + .3); actuar(g3, 0, [[0, { aRx: 1.2, aRe: 1.2 }]], { T: L.T }); laughF(g3, L.T);
  DS1.userData.draw('15', (cc, w, h) => { cc.fillStyle = '#fbf6ee'; cc.fillRect(0, 0, w, h); cc.fillStyle = '#1a1a1a'; cc.font = `700 170px ${FONT}`; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('15:00', w / 2, h / 2 + 8); }); show(DS1, TB.x + 6, 10.5, -12.4, 0, .36);
  orbit(V(TB.x, 5, -2), lerp(19, 16, L.k), -.12, .2, 46); sh(V(TB.x, 0, -2), 18); }, [[0, 'cuckoo', .6], [.6, 'laugh_old', .5], [1.2, 'cup_clink', .4]]);
// 35 «Deshalb fahren hier die Rentner Sportwagen,»: tres deportivos amarillos cruzan la plaza a toda velocidad con jubilados con gafas de sol al volante; hojas que vuelan
shot(51.15, 'Z', null, L => { town(L, { morning: 1 }); const P = [REN[0], REN[3], REN[2]]; CARS.forEach((c, i) => { const r = c.root || c; r.visible = true; const z = 70 - (L.lt * 34) - i * 14; r.position.set(-10 + i * 10, 0, z); r.rotation.y = PI;
    const d = P[i]; put(d, r.position.x - .9, 1.3, z + 1.2, PI); d.blob.visible = false; actuar(d, 0, [[0, sitPose({ aRx: 1.2, aRe: .8, aLx: i === 1 ? 2.8 : 1.2, aLz: i === 1 ? .4 : 0 })]], { T: L.T, weight: false }); laughF(d, L.T + i); });
  leaves(V(0, 0, 40), L.T * 3, 40, 40, 30, 12); dust(V(0, 0, 50 - L.lt * 30), L.t0, L.T, 12, 1.4); cm([0, 4, 10, 0, 3, 50, 48], [6, 4.5, 14, 0, 3, 30, 46], L.k); sh(V(0, 0, 40), 34); },
  [[0, 'engine_rev', .7], [.3, 'car_pass', .6], [.9, 'horn_toot', .5], [1.2, 'laugh_old', .4]]);
// 36 «und die Jugendlichen Fahrrad.»: tres chavales pedaleando con cara de pena junto al bordillo; un deportivo los adelanta y los despeina
shot(53.29, 'W', null, L => { town(L, { morning: 1 }); JUG.slice(0, 3).forEach((c, i) => { const b = BIKES[i]; const z = 40 - L.lt * 6 - i * 5; show(b, 14 + i * 2.4, 0, z, PI, 1); put(c, 14 + i * 2.4, .9, z, PI); c.blob.visible = false; const p = Math.sin(L.T * 9 + i); actuar(c, 0, [[0, sitPose({ lLx: 1.2 + p * .4, lRx: 1.2 - p * .4, lLk: 1.2, lRk: 1.2, aLx: 1.2, aRx: 1.2, lean: .25 })]], { T: L.T, weight: false }); cara(c, L.T + i, { expr: 'sad', mouth: 'frown' }); });
  const r = CARS[0].root || CARS[0]; r.visible = true; r.position.set(6, 0, 20 + 40 - L.lt * 60); r.rotation.y = PI; leaves(V(10, 0, 30), L.T * 2.4, 30, 20, 20, 10);
  orbit(V(16, 4, 34 - L.lt * 6), lerp(18, 16, L.k), PI - .5, .12, 44); sh(V(16, 0, 32), 24); }, [[0, 'bike_chain', .5], [.4, 'car_pass', .6], [.9, 'sigh', .4]]);
// 37 «Aber gezählt wird nur richtig guter Kaffee.»: un señor bebe café de máquina aguado: su reloj marca 0 € con una X roja; pierde la sonrisa
shot(54.96, 'S', null, L => { town(L, { morning: 1 }); const c = put(CR[20], 0, 0, 14, 0); const cu = CUPS[8]; drink(c, L, L.t0 + .1, .4, { kind: cu, meter: true, expr: 'happy', after: 'sad', afterMouth: 'frown' }); meterOf(c).userData.set('0 Tassen', '0 €', '#ff4a4a');
  if (L.lt > .9) badge('red', 'X  0 €', W / 2, H * .22, clamp((L.lt - .9) / .2), 1, 1.1); crowdAt(L, 0, 6, 6, 7, 13, 38, { mode: 'drink', gap: 1.4 });
  dcam(c, L.k, 10, -.9, 5.2, 42); sh(V(0, 0, 14), 16); }, [[0, 'sip', .5], [.9, 'error_buzz', .6]]);
// 38 «Und das Verrückte:»: Jacky, la peluquera, se gira hacia cámara con una sonrisa traviesa y la ceja levantada
shot(57.44, 'C', 'punch', L => { town(L, { morning: 1 }); const c = put(jacky, 14, 0, 10, -.2); actuar(c, L.lt, [[0, {}], [.1, 'lean_in', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' });
  crowdAt(L, 14, 2, 6, 6, 12, 40, { mode: 'drink', gap: 1.6 }); onFace(c, 5.6, .4, -.6, 40, L.k); sh(V(14, 0, 10), 14); }, [[0, 'whoosh', .4], [.2, 'ding_reveal', .4]]);
// 39 «Der beste ist nicht der teuerste.»: un señor de traje bebe de una taza de oro con etiqueta de 39,99 €: su reloj da +1 €; a su lado un abuelo con su taza normal recibe una lluvia
shot(58.36, 'W', null, L => { town(L, { morning: 1 }); const a = put(CR[21], -4, 0, 12, .25), b = put(REN[2], 4, 0, 12, -.25); const g = CUPS[10]; g.traverse(o => { if (o.isMesh && o.material && o.material.color && !o.userData.noOutline) {} });
  drink(a, L, L.t0 + .1, .35, { meter: true, expr: 'smug', after: 'sad', afterMouth: 'frown' }); meterOf(a).userData.set('1 Tasse', '+1 €', '#ff8a4a'); drink(b, L, L.t0 + .15, .35, { meter: true, expr: 'happy', after: 'joy' }); meterOf(b).userData.set('1 Tasse', '+24 €');
  badge('tag', '39,99 €', W * .3, H * .3, clamp(L.lt / .2), 1, .8); badge('tag', '4,99 €', W * .7, H * .3, clamp((L.lt - .2) / .2), 1, .8); if (L.lt > .8) billFall(V(4, 0, 12), L.t0 + .8, L.T, 30, 6, 4, 10);
  orbit(V(0, 5.4, 12), lerp(14, 12, L.k), 0, .1, 44); sh(V(0, 0, 12), 16); }, [[0, 'sip', .4], [.7, 'error_buzz', .4], [.8, 'money_rain', .6]]);
// 40 «Tchibo zum Beispiel.»: la tienda Tchibo de la plaza: zoom a la estantería llena de paquetes azules con su precio
shot(60.08, 'Z', null, L => { tchiboS(L); crowdAt(L, TLX, 0, 5, 4, 9, 42, { mode: i => ['walk', 'point'][i % 2], face: V(TLX, 5, -13), gap: 1.6 });
  cm([TLX - 3, 6.5, 6, TLX, 5.2, -13, 46], [TLX - 1.5, 6, -1, TLX, 5.4, -13, 40], L.k); sh(V(TLX, 0, -6), 20); DOF = 0; }, [[0, 'shop_bell', .6], [.4, 'whoosh_soft', .3]]);
// 41 «Kostet wenig,»: en la caja, un abuelo paga el paquete con una moneda y la cajera sonríe: 4,99 €
shot(61.22, 'C', null, L => { tchiboS(L); const k = put(CR[22], TLX + 10, 0, -6.4, 0); actuar(k, 0, [[0, { aRx: 1.1, aRe: .6 }]], { T: L.T }); cara(k, L.T, { expr: 'happy', mouth: 'smile' }); const c = put(REN[0], TLX + 10, 0, 0, PI); actuar(c, L.lt, [[0, { aRx: .4 }], [.1, { aRx: 1.3, aRe: .4 }, { dur: .3 }]], { T: L.T }); grin(c, L.T);
  show(PACKS.TCHIBO[0], TLX + 9, 4.5, -3.8, .3, 1); badge('gold', '4,99 €', W / 2, H * .22, clamp(L.lt / .2), 1, 1.1); orbit(V(TLX + 10, 5, -3), lerp(12, 10.5, L.k), PI / 2 + .6, .14, 42); sh(V(TLX + 10, 0, -3), 14); }, [[0, 'register', .6], [.2, 'coins', .5]]);
// 42 «schmeckt wie im Café,»: en casa, el abuelo prepara la taza, la huele, cierra los ojos de gusto; al fondo se ve un café elegante como en un sueño
shot(61.75 + .6, 'W', null, L => { cafe(L); const c = put(REN[0], CIX + 4, 0, 4, -.2); drink(c, L, L.t0 + .1, .4, { expr: 'warm', after: 'joy', steam: 1 }); confRain(V(CIX + 4, 2, 4), L.T, 20, 8, 6, 10);
  onFace(c, 5.6, .6, -1.2, 40, L.k); sh(V(CIX + 4, 0, 4), 14); }, [[0, 'sniff', .5], [.2, 'sip', .5], [.6, 'aah_old', .5]]);
// 43 «und jede Tasse zählt doppelt.»: el abuelo bebe su Tchibo y el reloj marca ×2: caen DOS billetes a la vez; «×2» dorado
shot(63.37, 'C', 'punch', L => { town(L, { morning: 1 }); const c = put(REN[0], 0, 0, 12, 0); drink(c, L, L.t0 - .2, .3, { meter: true, after: 'joy' }); meterOf(c).userData.set('×2', '+24 €', '#ffd23f'); show(PACKS.TCHIBO[1], 2.8, 0, 12.6, -.3, 1.4);
  billDrop(c, L.t0 + .1, L.T, 2, 1.2); badge('gold', '×2', W / 2, H * .22, clamp((L.lt - .1) / .2), 1, 1.8); cashPop(c, '+24 €', clamp((L.lt - .3) / .2), 'green', 1); crowdAt(L, 0, 6, 6, 6, 12, 44, { mode: 'clap', gap: 1.4 });
  dcam(c, L.k, 10, -.85, 5.2, 42); sh(V(0, 0, 12), 16); }, [[0, 'cash_reg', .7], [.1, 'cash_reg', .5], [.3, 'sparkle', .5]]);
// ---------- c: Jacky y Jacobs, el dentista y Melitta, el cura, el tramposo (65,3 – 110,9 s) ----------
const SAC = V(SAX, 0, -4);   // sillón central del salón
const DROP = P_(sphere(.16, mat(0x6a3a1a, { roughness: .1, emissive: 0x2a1204, emissiveIntensity: .3 }), scene, 0, 0, 0, 10, 8));
// 44 «Meine Friseurin»: Jacky en su salón cortando el pelo a una clienta, tijeras en una mano
shot(65.30, 'W', null, L => { salonS(L); const cl = sit2(CR[23], SAX, -4, PI, 3.0); actuar(cl, 0, [[0, sitPose({ aLx: .4, aRx: .4 })]], { T: L.T, weight: false }); cara(cl, L.T, { expr: 'happy', mouth: 'smile' });
  const j = put(jacky, SAX + 2.6, 0, -1.6, PI + .9); actuar(j, 0, [[0, { aRx: 2.0 + Math.sin(L.T * 14) * .12, aRz: .5, aRe: 1.0, aLx: 1.6, aLz: .3, aLe: 1.2, lean: .08 }]], { T: L.T }); cara(j, L.T, { expr: 'happy', mouth: 'talk' });
  orbit(V(SAX + 1, 5.2, -3), lerp(14, 12, L.k), .5, .12, 44); sh(V(SAX, 0, -3), 16); }, [[0, 'scissors', .6], [.4, 'scissors', .6], [.8, 'hairdryer', .3]]);
// 45 «trinkt nur Jacobs Krönung.»: Jacky deja las tijeras, coge su taza y bebe; el paquete JACOBS KRÖNUNG en primer término
shot(66.06, 'C', null, L => { salonS(L); const j = put(jacky, SAX + 2.6, 0, 1.2, PI + .6); drink(j, L, L.t0 + .05, .5, { meter: true, expr: 'happy', after: 'joy', steam: 1 }); show(PACKS.JACOBS[0], SAX + 4.8, 0, 3.6, -.4 + PI, 1.5);
  dcam(j, L.k, 11, -.7, 5, 42); sh(V(SAX + 3, 0, 2), 16); }, [[0, 'sip', .6], [.6, 'aah', .4]]);
// 46 «Und der Name ist kein Zufall:»: primer plano del paquete: la corona dorada de la etiqueta brilla
shot(67.48, 'Z', 'punch', L => { salonS(L); const p = PACKS.JACOBS[1]; show(p, SAX, 3.4, 2, PI, 2.2); const cr = CROWNS[1]; show(cr, SAX, 8.6 + Math.sin(L.T * 3) * .15, 2.4, L.T * 2, .8);
  confRain(V(SAX, 3, 2), L.T, 20, 8, 4, 8); cm([SAX + 1.2, 6.6, 10, SAX, 6.2, 2, 34], [SAX + .6, 6.6, 8.4, SAX, 6.4, 2, 32], L.k); sh(V(SAX, 0, 2), 12); DOF = 1.4; }, [[0, 'ding_reveal', .5], [.3, 'sparkle', .5]]);
// 47 «Bei jeder zehnten Tasse»: Jacky bebe su décima taza: el reloj llega a 10 con un destello
shot(69.47, 'S', null, L => { salonS(L); const j = put(jacky, SAX - 2, 0, 1.2, PI - .5); drink(j, L, L.t0 + .05, .5, { meter: true, expr: 'determined', after: 'joy' }); meterOf(j).userData.set(L.lt < .7 ? '9 Tassen' : '10 Tassen', L.lt < .7 ? '108 €' : '120 €', L.lt < .7 ? '#7aff9a' : '#ffd23f');
  for (let i = 0; i < 9; i++) { const t = CUPS[i]; show(t, SAX - 9 + (i % 5) * 1.3, 3.55 + (i / 5 | 0) * 1.2, -13, i, .8); t.userData.level(0); } badge('num', L.lt < .7 ? '9' : '10', W / 2, H * .2, clamp(L.lt / .15), 1, 1.2);
  dcam(j, L.k, 11, -.85, 5, 42); sh(V(SAX - 2, 0, 0), 16); }, [[0, 'sip', .5], [.7, 'beep', .6], [.75, 'sparkle', .4]]);
// 48 «schenkt dir der Zähler eine goldene Krone,»: ¡pling! una corona de oro cae del cielo y aterriza en la cabeza de Jacky; ella abre la boca
shot(70.63, 'C', 'punch', L => { salonS(L); const j = put(jacky, SAX, 0, 1.2, PI); actuar(j, L.lt, [[0, {}], [.5, { aLx: 2.4, aRx: 2.4, aLz: .5, aRz: .5, aLe: 1.6, aRe: 1.6 }, { dur: .3 }]], { T: L.T }); cara(j, L.T, { expr: L.lt < .5 ? 'happy' : 'shock', mouth: L.lt < .5 ? 'smile' : 'o' });
  const k = easeIn(clamp(L.lt / .45)); const cr = CROWNS[2]; const h = hp(j); show(cr, h.x, h.y + 1.25 + (1 - k) * 9, h.z, L.T * (1 - k) * 4, .95); confetti(h, L.t0 + .45, L.T, 30, .6);
  onFace(j, 7.2, 1.8, 0, 42, L.k); sh(V(SAX, 0, 1), 14); }, [[0, 'whoosh_down', .5], [.45, 'ding_big', .7], [.5, 'sparkle', .5]]);
// 49 «tausend Euro wert.»: la corona en primer plano gira con su etiqueta «1.000 €»; billetes alrededor
shot(72.51, 'F', null, L => { salonS(L); const j = put(jacky, SAX, 0, 1.2, PI); actuar(j, 0, [[0, { aLx: 2.6, aLz: .3, aLe: 1.8 }]], { T: L.T }); grin(j, L.T); const h = hp(j); show(CROWNS[2], h.x, h.y + 1.25, h.z, 0, .95);
  cashPop(j, '1.000 €', clamp(L.lt / .2), 'gold', 1.4, 3.4); billRain(V(SAX, 0, 1), L.T, 40, 14, 8, 14); onFace(j, 6.6, 1.6, .5, 40, L.k); sh(V(SAX, 0, 1), 14); }, [[0, 'cha_ching', .6], [.3, 'money_rain', .5]]);
// 50 «Sie hat schon sieben»: Jacky con SIETE coronas apiladas en la cabeza, haciendo equilibrio, orgullosa; las clientas aplauden
shot(74.01, 'W', null, L => { salonS(L); const j = put(jacky, SAX, 0, 1.2, PI); actuar(j, 0, [[0, { aLx: .9, aLz: .9, aRx: .9, aRz: .9, aLe: .4, aRe: .4, headZ: Math.sin(L.T * 3) * .06 }]], { T: L.T }); grin(j, L.T); const h = hp(j);
  for (let i = 0; i < 7; i++) show(CROWNS[i], h.x + Math.sin(L.T * 3 + i * .5) * .05 * i, h.y + 1.25 + i * .62 * Math.min(1, L.lt * 3 - i * .15 + 1), h.z, i * .5, .95 - i * .03);
  badge('num', '7 KRONEN', W / 2, H * .17, clamp(L.lt / .2), 1, 1); crowdAt(L, SAX, 0, 4, 6, 10, 50, { mode: 'clap', face: V(SAX, 5, 1), gap: 1.6 });
  orbit(V(SAX, 8, 1.2), lerp(17, 15, L.k), PI + .25, .1, 44); sh(V(SAX, 0, 1), 16); }, [[0, 'clap', .5], [.3, 'ding', .4], [.6, 'ding', .4], [.9, 'ding', .4]]);
// 51 «und sich davon einen Salon in Paris gekauft.»: nuevo salón rosa en París con la Torre Eiffel en la ventana; Jacky con boina saluda con las coronas puestas
shot(75.57, 'F', null, L => { salonS(L, 1); const j = put(jacky, SPX + 6, 0, 2, -PI / 2 - .5); actuar(j, 0, [[0, 'wave']], { T: L.T }); laughF(j, L.T); const h = hp(j); for (let i = 0; i < 3; i++) show(CROWNS[i], h.x, h.y + 1.25 + i * .6, h.z, i, .9);
  badge('tag', 'PARIS', W / 2, H * .18, clamp(L.lt / .2), 1, 1.1); confRain(V(SPX + 6, 2, 2), L.T, 30, 14, 8, 14); orbit(V(SPX + 10, 7, 0), lerp(20, 17, L.k), -PI / 2 + .35, .1, 46); sh(V(SPX + 8, 0, 0), 20); }, [[0, 'accordion', .5], [.4, 'kiss', .4], [.9, 'sparkle', .4]]);
// 52 «Mein Zahnarzt brüht nur mit Melitta.»: en la consulta, el Dr. Brenner vierte agua caliente en el filtro rojo de Melitta sobre la cafetera; vapor
shot(77.30, 'W', null, L => { zahnS(L); const d = put(brenner, ZAX - 4, 0, -2, .3); actuar(d, 0, [[0, { aRx: 1.5, aRz: .1, aRe: 1.0, aLx: .9, aLe: 1.2, lean: .05 }]], { T: L.T }); cara(d, L.T, { expr: 'happy', mouth: 'smile' });
  const K = KAN[1]; show(K, ZAX - 3.4, 3.6, 1.2, 0, 1); K.userData.level(clamp(.2 + L.lt * .3)); K.userData.steam(L.T, 1); show(FILT, ZAX - 3.4, 6.1, 1.2, 0, 1); show(PACKS.MELITTA[0], ZAX - 6, 3.6, 1.6, .3, 1.1);
  const cu = CUPS[11]; attach(cu, d.aR.hand, [-.84, -.2, -.72], [PI / 2 + .7, 0, 0], .9); cu.userData.level(0); orbit(V(ZAX - 3.6, 5.4, 0), lerp(13, 11, L.k), .35, .14, 42); sh(V(ZAX - 3, 0, 0), 16); }, [[0, 'pour', .6], [.6, 'drip', .5], [1.2, 'steam', .4]]);
// 53 «Wusstest du,»: el dentista mira a cámara con el dedo índice levantado, como contando un secreto
shot(79.52, 'C', 'punch', L => { zahnS(L); const d = put(brenner, ZAX, 0, 2, 0); actuar(d, L.lt, [[0, {}], [.05, { aRx: 2.0, aRz: -.1, aRe: 1.8, lean: .06 }, { dur: .25 }]], { T: L.T }); talk(d, L.T, L.t0, L.t1, 'smug');
  onFace(d, 5.4, .3, .5, 38, L.k); sh(V(ZAX, 0, 2), 12); }, [[0, 'ding_reveal', .5]]);
// 54 «dass Melitta den Kaffeefilter erfunden hat?»: el filtro rojo gigante gira en el aire como un trofeo, con un «?» dorado
shot(80.12, 'Z', null, L => { zahnS(L); show(FILT, ZAX, 6 + Math.sin(L.T * 2) * .2, 2, L.T * 1.4, 2.4); badge('q', '?', W * .74, H * .28, clamp(L.lt / .2), 1, 1.2); badge('tag', 'ERFUNDEN!', W / 2, H * .62, clamp((L.lt - .6) / .2), 1, 1);
  confRain(V(ZAX, 2, 2), L.T, 16, 6, 4, 10); cm([ZAX, 8.6, 12, ZAX, 7, 2, 40], [ZAX, 8.4, 10, ZAX, 7.4, 2, 38], L.k); sh(V(ZAX, 0, 2), 12); DOF = 1.4; }, [[0, 'whoosh_up', .5], [.4, 'sparkle', .5], [.8, 'question', .4]]);
// 55 «Neunzehnhundertacht in Dresden,»: flashback en sepia: una cocina antigua de Dresde; una señora con moño y delantal mira su cafetera con poso; «1908 · DRESDEN»
shot(81.80, 'B', null, L => { kuecheS(L); grade.uniforms.sepia.value = .9; const w = put(REN[3], TB.x + 1, 0, -6, .3); actuar(w, 0, [[0, { aRx: 1.2, aRe: 1.1, aLx: 1.0, aLe: 1.4, headX: .25 }]], { T: L.T }); cara(w, L.T, { expr: 'confused', mouth: 'frown' });
  const K = KAN[1]; show(K, TB.x + 1, 4.3, -3, 0, 1); K.userData.level(.4); badge('big', '1908', W / 2, H * .18, clamp(L.lt / .2), 1, 1.2); badge('tag', 'DRESDEN', W / 2, H * .27, clamp((L.lt - .3) / .2), 1, 1);
  orbit(V(TB.x + 1, 5, -5), lerp(14, 12, L.k), .2, .14, 42); sh(V(TB.x, 0, -4), 16); }, [[0, 'old_film', .5], [.2, 'clock_tick', .4]]);
// 56 «mit Papier aus dem Schulheft»: en sepia, arranca una hoja del cuaderno escolar de su hijo; el niño la mira con la boca abierta
shot(83.90, 'W', null, L => { kuecheS(L); grade.uniforms.sepia.value = .9; const w = put(REN[3], TB.x + 1, 0, -6, .3); const kid = put(JUG[1], TB.x + 5, 0, -3.6, -.9); const k = clamp((L.lt - .3) / .4);
  actuar(w, 0, [[0, { aRx: 1.3 + k * .6, aRz: -.2 - k * .5, aRe: .8, aLx: 1.3, aLz: .3, aLe: .8 }]], { T: L.T }); cara(w, L.T, { expr: 'determined' }); actuar(kid, 0, [[0, { aLx: .8, aRx: .8, aLz: .6, aRz: .6, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(kid, L.T, { expr: 'shock', mouth: 'o' });
  DS2.userData.draw('heft', (c, wd, h) => { c.fillStyle = '#fbf6e4'; c.fillRect(0, 0, wd, h); c.strokeStyle = '#8ab0d8'; c.lineWidth = 3; for (let y = 40; y < h; y += 30) { c.beginPath(); c.moveTo(0, y); c.lineTo(wd, y); c.stroke(); } c.fillStyle = '#2a3a7a'; c.font = `700 40px ${FONT}`; c.fillText('SCHULHEFT', 40, 90); });
  const h = hp(w); show(DS2, h.x + .8 + k * 1.2, h.y - 2.2 + k * .8, h.z + 1.6, -.3 + k * .5, .22); orbit(V(TB.x + 2.4, 5, -5), lerp(13, 11, L.k), .35, .14, 42); sh(V(TB.x, 0, -4), 16); }, [[0, 'old_film', .4], [.3, 'paper_tear', .7]]);
// 57 «ihres Sohnes.»: el niño, en sepia, sostiene el cuaderno roto; ella pone la hoja en la cafetera como filtro: ¡funciona! sonríen
shot(85.22, 'C', null, L => { kuecheS(L); grade.uniforms.sepia.value = .9; const w = put(REN[3], TB.x - 1, 0, -6, .4), kid = put(JUG[1], TB.x + 3.4, 0, -6, -.4); laughF(w, L.T); laughF(kid, L.T); actuar(kid, 0, [[0, 'cheer']], { T: L.T }); actuar(w, 0, [[0, { aRx: 1.2, aRe: 1.0 }]], { T: L.T });
  const K = KAN[1]; show(K, TB.x + 1.2, 4.3, -3, 0, 1); K.userData.level(.7); show(FILT, TB.x + 1.2, 6.8, -3, 0, 1); orbit(V(TB.x + 1, 5.4, -5), lerp(13, 11.5, L.k), 0, .12, 42); sh(V(TB.x, 0, -4), 16); }, [[0, 'drip', .5], [.3, 'laugh_small', .4]]);
// 58 «Deshalb zählt bei Melitta»: vuelta al presente: la última gota cae del filtro a cámara lenta en la taza del dentista
shot(86.29, 'F', 'slow', L => { zahnS(L); const cu = CUPS[11]; show(cu, ZAX, 3.6, 2, .5, 1.4); cu.userData.level(.7); cu.userData.steam(L.T, 1); show(FILT, ZAX, 5.4, 2, 0, 1);
  const dp = DROP; dp.visible = true; const t = (L.lt * .7) % 1; dp.position.set(ZAX, 5.3 - t * 3.6, 2); dp.scale.set(1.6, 2.4, 1.6);
  cm([ZAX, 6.6, 6.6, ZAX, 5, 2, 34], [ZAX, 6.2, 5.2, ZAX, 4.8, 2, 30], L.k); sh(V(ZAX, 0, 2), 10); DOF = 1.6; }, [[0, 'drip', .6], [.8, 'drip', .6], [1.6, 'drip', .6]]);
// 59 «sogar der letzte Tropfen.»: la gota toca el café y el reloj del dentista suma: «+1 TROPFEN» con chispas
shot(87.60, 'C', 'punch', L => { zahnS(L); const d = put(brenner, ZAX, 0, 4, 0); drink(d, L, L.t0 + .3, .4, { meter: true, expr: 'happy', after: 'joy' }); meterOf(d).userData.set('+1 Tropfen', '+12 €', '#ffd23f');
  cashPop(d, '+1 TROPFEN', clamp(L.lt / .2), 'gold', 1); confetti(hp(d), L.t0 + .1, L.T, 20, .5); dcam(d, L.k, 10, -.8, 5.2, 42); sh(V(ZAX, 0, 4), 14); }, [[0, 'drop_plop', .6], [.1, 'cha_ching', .5]]);
// 60 «In seiner Mittagspause»: el dentista en su pausa, sentado con la taza y el móvil, distraído; en el móvil un anuncio enorme «KAUFEN»
shot(89.28, 'W', null, L => { zahnS(L); const d = sit2(brenner, ZAX - 8, 2, .3, 2.8); drinkLoop(d, L, 0, { sit: true, pose: { ...SITP, aLx: 1.2, aLe: 1.4, aLz: -.1 }, per: 2.4 }); cara(d, L.T, { expr: 'happy' });
  attach(PHONE, d.aL.hand, [0, -.6, .5], [-.4, 0, 0], .9); PHONE.userData.draw(c => { c.fillStyle = '#1a4ab8'; c.fillRect(0, 0, 300, 560); txt(c, 'MS ESPRESSO', 150, 140, 38, '#ffffff'); c.fillStyle = '#ffd23f'; c.beginPath(); c.roundRect(40, 380, 220, 100, 26); c.fill(); txt(c, 'KAUFEN', 150, 432, 44, '#1a1a1a'); });
  orbit(V(ZAX - 8, 4.6, 2), lerp(12, 10.5, L.k), .6, .14, 42); sh(V(ZAX - 8, 0, 2), 14); }, [[0, 'sip', .5], [.8, 'phone_tap', .4]]);
// 61 «hat er sich aus Versehen»: primer plano del pulgar que, al dar un sorbo, toca sin querer el botón «KAUFEN»: ¡clic! «GEKAUFT»
shot(90.66, 'C', 'punch', L => { zahnS(L); const d = sit2(brenner, ZAX - 8, 2, .3, 2.8); drink(d, L, L.t0 - .1, .35, { sit: true, pose: { ...SITP, aLx: 1.2, aLe: 1.4 }, expr: 'happy', after: 'shock', afterMouth: 'o' }); const k = L.lt > .45;
  attach(PHONE, d.aL.hand, [0, -.6, .5], [-.4, 0, 0], .9); PHONE.userData.draw(c => { c.fillStyle = k ? '#1a8a3a' : '#1a4ab8'; c.fillRect(0, 0, 300, 560); txt(c, 'MS ESPRESSO', 150, 140, 38, '#ffffff'); txt(c, k ? 'GEKAUFT!' : '', 150, 280, 48, '#ffd23f'); c.fillStyle = '#ffd23f'; c.beginPath(); c.roundRect(40, 380, 220, 100, 26); c.fill(); txt(c, 'KAUFEN', 150, 432, 44, '#1a1a1a'); });
  const w = wpos(PHONE); cm([w.x + 1.6, w.y + 2.2, w.z + 4.4, w.x, w.y, w.z, 34], [w.x + 1.2, w.y + 1.8, w.z + 3.6, w.x, w.y, w.z, 32], L.k); sh(V(ZAX - 8, 0, 2), 12); DOF = 1.4; }, [[0, 'sip', .4], [.45, 'click', .7], [.5, 'cha_ching', .5]]);
// 62 «ein Kreuzfahrtschiff gekauft.»: el MS ESPRESSO en alta mar, enorme; el dentista en la proa con la bata al viento, saludando, y la bocina retumba
shot(91.56, 'F', null, L => { meerS(L); SCHIFF.position.y = Math.sin(L.T * 1.2) * .3; const d = put(brenner, MEX, 15.8, 28, 0); d.blob.visible = false; actuar(d, 0, [[0, 'wave']], { T: L.T }); laughF(d, L.T);
  cm([MEX + 40, 18, 90, MEX, 12, 10, 48], [MEX + 34, 16, 78, MEX, 12, 12, 46], L.k); sh(V(MEX, 0, 10), 60); }, [[0, 'ship_horn', .8], [.4, 'seagull', .5], [.8, 'waves', .5]]);
// 63 «Und wer hat am meisten?»: travelling aéreo desde la plaza hasta la catedral al fondo; las campanas
shot(93.20, 'Z', null, L => { town(L, { morning: 1 }); crowdAt(L, 0, -40, 10, 4, 18, 52, { mode: i => ['walk', 'drink'][i % 2], gap: .6 });
  cm([0, 30, 40, 0, 20, -150, 50], [0, 40, -10, 0, 30, -150, 46], L.k); sh(V(0, 0, -40), 50); }, [[0, 'whoosh_up', .5], [.4, 'church_bell', .6]]);
// 64 «Unser Pfarrer.»: el Pfarrer Lindemann ante el portal de la catedral, con los brazos abiertos, rodeado de billetes que caen; feligreses
shot(94.35, 'C', 'punch', L => { town(L, { morning: 1 }); const p = put(pfarrer, 0, 0, -128, 0); actuar(p, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .9, aRz: .9, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(p, L.T); billRain(V(0, 0, -128), L.T, 50, 16, 8, 14);
  badge('tag', 'PFARRER LINDEMANN', W / 2, H * .18, clamp(L.lt / .2), 1, 1); crowdAt(L, 0, -118, 6, 5, 10, 54, { mode: 'clap', face: V(0, 5, -128), gap: 1.6 }); orbit(V(0, 6, -128), lerp(17, 15, L.k), 0, .14, 44); sh(V(0, 0, -126), 20); }, [[0, 'church_bell', .5], [.2, 'cha_ching', .5]]);
// 65 «Er trinkt sogar während der Predigt.»: en la Kanzel, sermoneando con una mano en alto… y con la otra da un sorbo a su taza; los fieles en los bancos
shot(95.17, 'W', null, L => { kircheS(L); const p = put(pfarrer, KIX - 11, 9.2, -10, .5); p.blob.visible = false; drink(p, L, L.t0 + .7, .4, { pose: { aLx: 2.6, aLz: .3, aLe: .4 }, meter: true, expr: 'happy' }); if (L.lt < .7) talk(p, L.T, L.t0, L.t0 + .7, 'happy');
  POST.push(() => { const l = CR.filter(c => !c.root.visible); let i = 0; for (const z of [2, 6.6, 11.2]) for (const s of [-1, 1]) for (const dx of [-2.6, 2.6]) { const c = l[i++]; if (!c) continue; sit2(c, KIX + s * 9 + dx, z, PI, 2.5); actuar(c, 0, [[0, sitPose({ aLx: .6, aRx: .6, aLe: 1.2, aRe: 1.2 })]], { T: L.T, weight: false }); cara(c, L.T + i, { expr: 'happy' }); } });
  orbit(V(KIX - 9, 10, -8), lerp(22, 19, L.k), .7, .1, 46); sh(V(KIX - 6, 0, -4), 28); }, [[0, 'church_echo', .5], [.7, 'sip', .6], [1.2, 'murmur', .4]]);
// 66 «Und seit elf Jahren»: de noche, iglesia vacía con velas; el cura sentado en un banco, con los ojos abiertos de par en par y ojeras; «11 JAHRE»
shot(97.04, 'B', null, L => { kircheS(L, { night: 1 }); const p = sit2(pfarrer, KIX + 6, 2, PI, 2.5); actuar(p, 0, [[0, sitPose({ aRx: 1.1, aRe: 1.2, aLx: .5, aLe: 1.0 })]], { T: L.T, weight: false }); cara(p, L.T, { eyes: 'wide', mouth: 'flat' }); const cu = mugOf(pfarrer); attach(cu, p.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], 1); cu.userData.steam(L.T, 1);
  badge('red', '11 JAHRE', W / 2, H * .2, clamp(L.lt / .2), 1, 1.1); orbit(V(KIX + 6, 5, 2), lerp(13, 11, L.k), PI + .5, .12, 42); sh(V(KIX + 6, 0, 2), 16); }, [[0, 'owl', .4], [.4, 'clock_tick', .5], [1.0, 'clock_tick', .5]]);
// 67 «kein Auge mehr zugemacht.» (zoom lento): primer plano de sus ojos abiertos, una mosca le pasa por delante y ni parpadea
shot(98.38, null, 'slow', L => { kircheS(L, { night: 1 }); const p = sit2(pfarrer, KIX + 6, 2, PI, 2.5); actuar(p, 0, [[0, sitPose({ aRx: 1.1, aRe: 1.2 })]], { T: L.T, weight: false }); cara(p, L.T, { eyes: 'wide', mouth: 'wavy' }); sweat(p, L.T, 1);
  show(MOTH, hp(p).x + Math.sin(L.T * 3) * 1.2, hp(p).y + 1 + Math.cos(L.T * 4) * .4, hp(p).z - 1.6, 0, .7); MOTH.children.forEach(w => { if (w.name) w.rotation.y = Math.sin(L.T * 30) * .8 * (w.name === 'w1' ? 1 : -1); });
  onFace(p, 4.4, .3, 0, 34, L.k, 3.4); sh(V(KIX + 6, 0, 2), 10); }, [[0, 'heartbeat', .5], [.6, 'fly_buzz', .4]]);
// 68 «Und schummeln?»: un tipo con capucha y bigote postizo mira a ambos lados en un callejón junto a la tienda, escondiendo un cubo
shot(99.77, 'C', null, L => { town(L, { dusk: 1 }); const t = put(trick, -38, 0, -50, PI / 2); actuar(t, 0, [[0, { ...GEST.sneak, headY: Math.sin(L.T * 5) * .7 }]], { T: L.T }); cara(t, L.T, { expr: 'sus', mouth: 'smirk' }); show(BUCKET, -36.6, 0, -48.8, 0, 1.2);
  orbit(V(-37, 4.6, -50), lerp(11, 9.5, L.k), PI / 2 + .3, .12, 42); sh(V(-37, 0, -50), 14); }, [[0, 'sneak', .6], [.3, 'suspense_pluck', .4]]);
// 69 «Lieber nicht.»: un policía en la esquina mueve el dedo índice: «no, no»
shot(100.50, 'W', 'punch', L => { town(L, { dusk: 1 }); const c = put(COPS[0], -30, 0, -40, -.6); actuar(c, 0, [[0, { aRx: 2.0, aRz: -.1, aRe: 1.8, aLx: .3 }]], { T: L.T, extra: { aRz: -.1 + Math.sin(L.T * 14) * .25 } }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' });
  onFace(c, 5.6, .4, .6, 40, L.k); sh(V(-30, 0, -40), 12); }, [[0, 'tsk', .6]]);
// 70 «Neulich hat einer braunes Wasser in seine Tasse gefüllt.»: el tramposo vierte agua de una jarra en su taza y la tiñe con pintura marrón del cubo
shot(101.40, 'S', null, L => { town(L, { dusk: 1 }); const t = put(trick, -38, 0, -50, PI / 2 - .3); const k = clamp(L.lt / 1.2); actuar(t, 0, [[0, { aRx: 1.4, aRz: -.2, aRe: .8, aLx: 1.2, aLz: .2, aLe: 1.2, lean: .1 }]], { T: L.T }); cara(t, L.T, { expr: 'sus', mouth: 'smirk' });
  attach(WATERJUG, t.aR.hand, [-.3, -.5, -.6], [PI / 2 + .8 * k, 0, 0], .9); const cu = CUPS[12]; attach(cu, t.aL.hand, [.84, -.2, -.72], [PI / 2, 0, 0], .9); cu.userData.level(k * .8); show(BUCKET, -36.4, 0, -48.6, 0, 1.2);
  if (L.lt > 1.4) badge('tag', 'BRAUNES WASSER', W / 2, H * .2, clamp((L.lt - 1.4) / .2), 1, .9); orbit(V(-37.6, 5, -50), lerp(10, 8.6, L.k), PI / 2 + .25, .1, 40); sh(V(-37, 0, -50), 14); }, [[0, 'pour', .6], [.9, 'stir', .5], [1.5, 'snicker', .4]]);
// 71 «Zweiundzwanzig Jahre»: bebe… y su Kaffeezähler se pone ROJO y suena la alarma; aparecen los dos policías y le esposan
shot(103.62, 'C', 'punch', L => { town(L, { dusk: 1 }); const t = put(trick, -38, 0, -50, PI / 2); actuar(t, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .4, aRz: .4, aLe: .4, aRe: .4 }]], { T: L.T }); cara(t, L.T, { expr: 'shock', mouth: 'scream' }); meterOf(t).userData.set('FALSCH!', 'ALARM', '#ff3a3a');
  COPS.forEach((c, i) => { const x = -38 + (i ? 3.4 : -.2), z = -50 + (i ? 1.6 : 3.4); put(c, x, 0, z, Math.atan2(-38 - x, -50 - z)); actuar(c, 0, [[0, { aRx: 1.4, aRe: .4, aLx: 1.4, aLe: .4, lean: .12 }]], { T: L.T }); cara(c, L.T, { expr: 'angry' }); });
  if (L.lt > .9) { const h = hp(t); show(CUFFS, h.x, h.y + 3.6, h.z + .3, 0, 1.2); } badge('red', '22 JAHRE', W / 2, H * .2, clamp((L.lt - .5) / .2), 1, 1.3);
  orbit(V(-37, 5.6, -49), lerp(14, 12, L.k), PI / 2 + .45, .12, 44); sh(V(-37, 0, -49), 16); }, [[0, 'alarm', .7], [.2, 'siren', .5], [.9, 'cuffs', .6], [1.2, 'gavel', .6]]);
// 72 «Gefängnis.»: los barrotes de la celda se cierran de golpe delante de él
shot(105.14, 'C', null, L => { zelleS(L); const t = put(trick, ZEX, 0, 0, 0); actuar(t, 0, [[0, { aLx: 1.6, aRx: 1.6, aLe: 1.4, aRe: 1.4 }]], { T: L.T }); cara(t, L.T, { expr: 'sad', mouth: 'frown' }); tears(t, L.T, 0);
  orbit(V(ZEX, 5.4, 0), lerp(13, 11, L.k), 0, .1, 42); sh(V(ZEX, 0, 0), 14); }, [[0, 'cell_door', .8], [.4, 'echo_thud', .4]]);
// 73 «Nur Leitungswasser.»: en la celda, se sirve un vaso de agua del grifo con cara de pena; un «0 €» flota
shot(105.98, 'W', null, L => { zelleS(L); const t = put(trick, ZEX + 2, 0, -2, -.3); drink(t, L, L.t0 + .3, .5, { kind: WATERJUG, expr: 'sad', after: 'sad', afterMouth: 'frown' }); badge('tag', 'NUR WASSER', W / 2, H * .2, clamp(L.lt / .2), 1, 1);
  dcam(t, L.k, 10, -.9, 5, 42); sh(V(ZEX + 2, 0, -2), 14); }, [[0, 'tap_water', .6], [.5, 'gulp', .4], [.9, 'sigh', .5]]);
// 74 «Und ehrlich?»: yo en la mesa de la cocina, giro los ojos hacia un lado con cara de sospecha
shot(107.20, 'C', 'punch', L => { kuecheS(L); const c = sit2(ich, TB.x + 3, -4.4, 0); actuar(c, 0, [[0, sitPose({ aLx: 1.2, aRx: 1.2, aLe: 1.6, aRe: 1.6, headY: -.3 })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'sus', eyes: 'side_r', mouth: 'smirk' });
  onFace(c, 5, .5, .4, 38, L.k); sh(V(TB.x + 3, 0, -4), 12); }, [[0, 'whoosh_soft', .4], [.1, 'hmm', .5]]);
// 75 «Ich wüsste sofort, wer bei uns»: miro de reojo a Oma, que a mi lado echa un chorrito de algo marrón de una petaca en su taza y silba
shot(107.98, 'W', null, L => { kuecheS(L); const c = sit2(ich, TB.x + 3, -4.4, 0); actuar(c, 0, [[0, sitPose({ aLx: 1.2, aRx: 1.2, aLe: 1.6, aRe: 1.6, headY: -.55 })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'sus', eyes: 'side_r', mouth: 'flat' });
  const o = omaSeat(oma, L, -3); actuar(o, 0, [[0, sitPose({ aRx: 1.2, aRe: 1.4, aLx: 1.3, aLe: .9, headY: .3 })]], { T: L.T, weight: false }); cara(o, L.T, { expr: 'smug', eyes: 'side_l', mouth: 'o' }); const cu = mugOf(oma); attach(cu, o.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], 1);
  badge('q', '♪', W * .3, H * .3, clamp(L.lt / .2), 1, .8); orbit(V(TB.x, 5, -4.4), lerp(13, 11.5, L.k), .05, .1, 42); sh(V(TB.x, 0, -4), 14); }, [[0, 'whistle_innocent', .6], [.8, 'pour_small', .4]]);
// 76 «als Erster da drin sitzen würde.»: me la imagino en la celda… sonriendo feliz con su Kanne de flores y su tarta, como en casa
shot(109.32, 'F', null, L => { zelleS(L); const o = sit2(oma, ZEX, 0, 0, 2.2); prost(o, L, .7, { sit: true, kind: OKAN, pose: SITP }); laughF(o, L.T); OKAN.userData.steam(L.T, 1); show(KUCH[0], ZEX + 3, 2.2, 1, 0, .9);
  badge('tag', 'OMA?', W / 2, H * .2, clamp(L.lt / .2), 1, 1); grade.uniforms.lift.value = .04; orbit(V(ZEX + 1, 4, 0), lerp(12, 10, L.k), .2, .12, 42); sh(V(ZEX, 0, 0), 14); }, [[0, 'dream_harp', .5], [.6, 'laugh_old', .4]]);
// ---------- d: mi problema, el sótano, la lata y la cuenta hasta 50 (110,9 – 153,6 s) ----------
// Sótano de Oma (KEX): estantería de tarros en z = -9.6; la lata en (KEX + 2.6, 1.35, -9.7); escalera bajando por x = KEX - 10.
const DOSEP = V(KEX + 2.6, 1.35, -9.7);
const SPL = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x6a3a1a, { roughness: .1 }), scene, 0, 0, 0, 8, 6)));
// 77 «Nur bei uns zu Hause gab es ein Problem:»: la familia en la mesa de Oma, todos ricos: fajos de billetes, joyas; brindan
shot(110.91, 'W', null, L => { kuecheS(L); const o = omaSeat(oma, L, -3); prost(o, L, .9, { sit: true, pose: SITP }); laughF(o, L.T); const p = sit2(REN[4], TB.x + 3, -4.4, 0); prost(p, L, .9, { sit: true, pose: SITP }); laughF(p, L.T);
  const k = put(JUG[2], TB.x + 7.6, 0, -1, -PI / 2 - .3); drinkLoop(k, L, 1); const u = put(REN[5], TB.x - 8, 0, -1, PI / 2 + .3); drinkLoop(u, L, 2);
  for (let i = 0; i < 8; i++) { const b = BILL[i]; b.visible = true; b.position.set(TB.x - 4 + (i % 4) * 2.4, 4.4 + (i / 4 | 0) * .14, -1.4 + (i % 2) * .6); b.rotation.set(-PI / 2, i * .4, 0); } coins(V(TB.x, 2, -1), L.t0, L.T, 12);
  orbit(V(TB.x, 5.2, -2.4), lerp(19, 17, L.k), 0, .16, 46); sh(V(TB.x, 0, -2), 20); }, [[0, 'cup_clink', .5], [.4, 'laugh_small', .4], [.9, 'coins', .4]]);
// 78 «mich.»: corte seco a mí, de pie en la puerta de la cocina, con la cartera vacía y una polilla que sale volando
shot(112.83, 'C', 'punch', L => { kuecheS(L); const c = put(ich, TB.x + 12, 0, 6, -.8); actuar(c, 0, [[0, { aRx: 1.2, aRe: 1.4, aLx: .2, lean: .05, headX: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' });
  const h = hp(c); show(WALLET, h.x - .6, h.y - 2.6, h.z + 1.2, -.8, .9); show(MOTH, h.x - .4, h.y - 1.6 + L.lt * 2, h.z + 1.4, 0, .9); MOTH.children.forEach(w => { if (w.name) w.rotation.y = Math.sin(L.T * 30) * .8 * (w.name === 'w1' ? 1 : -1); });
  onFace(c, 6, .6, .6, 40, L.k); sh(V(TB.x + 12, 0, 6), 12); }, [[0, 'record_scratch', .5], [.2, 'moth', .4]]);
// 79 «Ich vertrage kein Koffein.»: Oma me ofrece una taza; yo la aparto con las dos manos poniendo cara de asco
shot(113.46, 'W', null, L => { kuecheS(L); const c = put(ich, TB.x + 6, 0, 3, -2.4); const o = put(oma, TB.x + 3, 0, .4, .8); prost(o, L, .45, { pose: { aLx: .5 } }); cara(o, L.T, { expr: 'happy', mouth: 'smile' });
  actuar(c, L.lt, [[0, {}], [.2, { aLx: 1.6, aRx: 1.6, aLe: .3, aRe: .3, aLz: -.2, aRz: -.2, lean: -.15, headY: .5 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'angry', eyes: 'squint', mouth: 'grimace' });
  orbit(V(TB.x + 4.5, 5, 1.8), lerp(14, 12, L.k), 1.4, .12, 42); sh(V(TB.x + 4.5, 0, 2), 14); }, [[0, 'no_no', .5], [.3, 'whoosh_soft', .4]]);
// 80 «Ein halber Espresso, sechs Euro,»: me tomo medio espresso con cuidado; el reloj de muñeca: +6 €
shot(115.25, 'C', null, L => { kuecheS(L); const c = put(ich, TB.x, 0, 3.4, PI + .1); drink(c, L, L.t0 + .1, .35, { kind: 'esp', meter: true, expr: 'worried', after: 'worried', afterMouth: 'wavy', l0: .5, l1: .25 }); meterOf(c).userData.set('½ Tasse', '6 €');
  cashPop(c, '+6 €', clamp((L.lt - .9) / .2), 'green', .9); dcam(c, L.k, 10, -.85, 5, 42); sh(V(TB.x, 0, 3), 14); }, [[0, 'sip', .5], [.9, 'coin_small', .5]]);
// 81 «und schon zitterten meine Hände.»: mis manos tiemblan sin control, la taza tintinea y el café salpica; ojos como espirales
shot(116.97, 'S', 'punch', L => { kuecheS(L); const c = put(ich, TB.x, 0, 3.4, PI + .1); actuar(c, 0, [[0, tremble(L.T, 2.6)]], { T: L.T, extra: { sx: Math.sin(L.T * 50) * .04 } }); cara(c, L.T, { expr: 'shock', eyes: 'scared', mouth: 'grimace_wide' }); sweat(c, L.T, 3);
  const e = ESP[0]; attach(e, c.aR.hand, [-.62, -.2, -.5], [PI / 2 + Math.sin(L.T * 55) * .2, 0, 0], 1.1); e.userData.level(.25); for (let i = 0; i < 4; i++) { const d = SPL[i]; d.visible = true; const t = (L.T * 2 + i * .25) % 1, w = wpos(e); d.position.set(w.x + Math.sin(i * 2) * t * 1.4, w.y + 1 - t * t * 4, w.z + Math.cos(i * 2) * t * 1.4); }
  onBody(c, 9, 0, .1, 40, L.k, 7.6, 0, 4.4); sh(V(TB.x, 0, 3), 12); }, [[0, 'cup_rattle', .7], [.5, 'shiver', .5], [1.2, 'cup_rattle', .5]]);
// 82 «Ich war der Einzige in der Familie ohne einen Cent.»: retrato de familia en la pared: todos con coronas y oro… y yo en una esquina con la cartera vacía
shot(119.17, 'W', null, L => { kuecheS(L); const row = [REN[4], oma, REN[5], JUG[2]]; row.forEach((x, i) => { put(x, TB.x - 6 + i * 3.4, 0, -8, 0); actuar(x, 0, [[0, { aRx: .9, aRe: .6, aLx: .9, aLe: .6 }]], { T: L.T }); grin(x, L.T + i); const h = hp(x); show(CROWNS[i], h.x, h.y + 1.25, h.z, i, .9); });
  const c = put(ich, TB.x + 8.6, 0, -6.6, -.4); actuar(c, 0, [[0, { aRx: 1.2, aRe: 1.4, headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' }); const h = hp(c); show(WALLET, h.x - .6, h.y - 2.6, h.z + 1.2, -.4, .9); billRain(V(TB.x - 2, 0, -8), L.T, 30, 12, 3, 10); badge('red', '0 €', W * .76, H * .3, clamp((L.lt - .8) / .2), 1, 1);
  orbit(V(TB.x + 1.4, 5.4, -7.4), lerp(20, 18, L.k), 0, .1, 46); sh(V(TB.x + 1, 0, -7), 20); }, [[0, 'camera_click', .5], [.6, 'sad_trombone', .5]]);
// 83 «Bis Oma mich eines Abends in den Keller schickte,»: tarde, cocina en penumbra: Oma, sonriente, me tiende una cesta y señala la puerta del sótano
shot(122.21, 'B', null, L => { kuecheS(L, { night: 1 }); const o = put(oma, TB.x + 6, 0, 2, PI / 2 + .3); actuar(o, L.lt, [[0, {}], [.3, { aRx: 1.6, aRz: -.1, aRe: .1, aLx: 1.0, aLe: 1.0 }, { dur: .4 }]], { T: L.T }); talk(o, L.T, L.t0, L.t0 + 1.8, 'smug');
  const c = put(ich, TB.x + 11, 0, 4, -PI / 2 - .4); actuar(c, 0, [[0, { aRx: .9, aRe: 1.2 }]], { T: L.T }); cara(c, L.T, { expr: 'neutral' }); show(BUCKET, TB.x + 9.4, 3.2, 3.4, 0, 1);
  orbit(V(TB.x + 8.5, 5, 3), lerp(15, 13, L.k), -.25, .12, 44); sh(V(TB.x + 8, 0, 3), 16); }, [[0, 'clock_tick', .4], [.5, 'door_creak', .5]]);
// 84 «Kartoffeln holen.»: bajo las escaleras de madera del sótano con la cesta, la bombilla parpadea
shot(124.68, 'S', null, L => { kellerS(L); const k = clamp(L.lt / 1); const c = put(ich, KEX - 10, lerp(9.8, 6.8, k), lerp(-4, -.5, k), 0); c.blob.visible = false; actuar(c, 0, [[0, { ...walkP(L.T, 1), aRx: .8, aRe: 1.0 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  KE.BL.intensity = Math.sin(L.T * 23) > .7 ? 30 : 90; orbit(V(KEX - 10, 9, -2), lerp(14, 12, L.k), .8, .05, 44); sh(V(KEX - 8, 0, -2), 16); }, [[0, 'stairs_creak', .6], [.5, 'stairs_creak', .6], [.7, 'bulb_flicker', .4]]);
// 85 «Hinter den Einmachgläsern»: aparto los tarros de colores de la estantería con las dos manos
shot(125.65, 'C', null, L => { kellerS(L); const c = put(ich, KEX + 2.6, 0, -5.4, PI); actuar(c, 0, [[0, { aLx: 1.5, aRx: 1.5, aLe: .5, aRe: .5, aLz: -.2 - Math.sin(L.T * 6) * .2, aRz: -.2 + Math.sin(L.T * 6) * .2, lean: .25, crouch: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'confused' });
  orbit(V(KEX + 2.6, 4, -7), lerp(10, 8.6, L.k), PI - .6, .2, 42); sh(V(KEX + 2, 0, -7), 14); }, [[0, 'jar_clink', .6], [.5, 'jar_clink', .5]]);
// 86 «stand eine alte Kaffeedose aus Blech.» (zoom lento): la lata roja y dorada aparece en la sombra, el polvo flota en el haz de la bombilla
shot(126.79, 'F', 'slow', L => { kellerS(L); KE.D.userData.steam(L.T, .5); dust(DOSEP.clone().add(V(0, 1, 1)), L.t0, L.T, 0); DUST.forEach((d, i) => { const r = RNG(i * 9 + 2); d.visible = true; d.position.set(DOSEP.x + (r() - .5) * 3, DOSEP.y + ((L.T * .15 + r()) % 1) * 5, DOSEP.z + 1 + r() * 2); d.scale.setScalar(.05 + r() * .05); d.material.opacity = .6; });
  cm([DOSEP.x + .8, DOSEP.y + 2.4, DOSEP.z + 7, DOSEP.x, DOSEP.y + 1.1, DOSEP.z, 34], [DOSEP.x + .4, DOSEP.y + 1.9, DOSEP.z + 5, DOSEP.x, DOSEP.y + 1.1, DOSEP.z, 30], L.k); sh(DOSEP, 10); DOF = 1.5; }, [[0, 'mystery', .5]]);
// 87 «Darauf ein Zettel in Omas Handschrift:»: la cojo y la saco a la luz: la nota pegada con celo
shot(129.00, 'W', null, L => { kellerS(L); const c = put(ich, KEX, 0, -2, 0); actuar(c, 0, [[0, { aLx: 1.4, aRx: 1.4, aLz: -.3, aRz: -.3, aLe: 1.0, aRe: 1.0 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  const h = hp(c); show(DOSE, h.x, h.y - 3.6, h.z + 1.6, 0, .9); orbit(V(KEX, 5.2, -1.6), lerp(9, 7.6, L.k), 0, .1, 40); sh(V(KEX, 0, -2), 12); }, [[0, 'tin_lift', .5], [.6, 'paper_rustle', .4]]);
// 88 «„Nur ein Löffel.»: primerísimo plano de la nota con la letra azul de Oma
shot(130.82, 'C', 'punch', L => { kellerS(L); show(DOSE, KEX, 4, 0, 0, 1.4); const n = wpos(DOSE.userData.note); cm([n.x, n.y + .3, n.z + 3.2, n.x, n.y, n.z, 34], [n.x, n.y + .2, n.z + 2.6, n.x, n.y, n.z, 32], L.k); sh(V(KEX, 0, 0), 8); DOF = 0;
  badge('tag', 'NUR EIN LÖFFEL', W / 2, H * .2, clamp(L.lt / .2), 1, 1); }, [[0, 'paper_rustle', .5]]);
// 89 «Niemals mehr."»: zoom a «NIEMALS MEHR!» en rojo; viñeta y golpe
shot(132.17, 'Z', 'punch', L => { kellerS(L); show(DOSE, KEX, 4, 0, 0, 1.4); const n = wpos(DOSE.userData.note); cm([n.x, n.y - .2, n.z + 2.1, n.x, n.y - .3, n.z, 30], [n.x, n.y - .2, n.z + 1.8, n.x, n.y - .3, n.z, 28], L.k); sh(V(KEX, 0, 0), 8); DOF = 0;
  badge('red', 'NIEMALS MEHR!', W / 2, H * .2, clamp(L.lt / .15), 1, 1.1); grade.uniforms.vig.value = .7; }, [[0, 'impact', .6], [.1, 'braam', .5]]);
// 90 «Ich nahm einen Löffel und kochte mir eine Tasse.»: de noche en la cocina: hundo la cuchara en la lata (el café brilla un poco) y la echo en el filtro
shot(133.09, 'W', null, L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); show(DOSE, TB.x - 1.6, 4.3, -3.6, .3, 1); DOSE.userData.open(1); DOSE.userData.glow(.4); DOSE.userData.steam(L.T, .6);
  const k = clamp(L.lt / 1.2); actuar(c, 0, [[0, { aRx: 1.3 + Math.sin(k * PI) * .3, aRz: .3 - k * .5, aRe: .6, aLx: .8, aLe: 1.1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); attach(SPOON, c.aR.hand, [0, -.6, .3], [0, 0, 0], 1);
  const K = KAN[2]; show(K, TB.x + 1.8, 4.3, -3.4, 0, 1); K.userData.level(clamp(L.lt - .8)); K.userData.steam(L.T, 1); show(FILT, TB.x + 1.8, 6.8, -3.4, 0, 1);
  orbit(V(TB.x, 5, -4.4), lerp(12, 10.5, L.k), .2, .2, 42); sh(V(TB.x, 0, -4), 14); }, [[0, 'spoon_scoop', .6], [.7, 'water_boil', .5], [1.6, 'pour', .5]]);
// 91 «Und meine Hände zitterten nicht.»: sostengo la taza con las dos manos delante de la cara… firme. Me miro las manos, asombrado
shot(135.54, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -1, 0); actuar(c, 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.4, aRe: 1.4, aLz: -.25, aRz: -.25, headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); const cu = mugOf(ich); attach(cu, c.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], 1); cu.userData.level(.8); cu.userData.steam(L.T, 1);
  badge('green', 'KEIN ZITTERN!', W / 2, H * .2, clamp((L.lt - .5) / .2), 1, .9); onBody(c, 8, 0, .1, 40, L.k, 7, 0, 4.4); sh(V(TB.x, 0, -1), 12); }, [[0, 'ding', .5], [.5, 'sparkle', .4]]);
// 92 «Es war der beste Kaffee meines Lebens.»: bebo y cierro los ojos: halo dorado, brillos, el fondo se ilumina
shot(137.01, 'F', null, L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -1, 0); drink(c, L, L.t0 + .1, .9, { expr: 'warm', after: 'joy', eyesD: 'happy' }); const h = hp(c); show(HALO, h.x, h.y + 2.2, h.z, 0, 1); confRain(V(TB.x, 2, -1), L.T, 30, 10, 6, 12); grade.uniforms.lift.value = .05; bloom.strength = .5;
  onFace(c, 6.6, .8, -1.4, 40, L.k); sh(V(TB.x, 0, -1), 12); }, [[0, 'sip', .5], [.3, 'choir', .6], [1.2, 'aah', .4]]);
// 93 «Also nahm ich natürlich noch einen Löffel.»: sonrisa pícara mirando a cámara mientras hundo otra vez la cuchara
shot(139.04, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); show(DOSE, TB.x - 1.6, 4.3, -3.6, .3, 1); DOSE.userData.open(1); DOSE.userData.glow(.5); actuar(c, 0, [[0, { aRx: 1.5, aRz: .1, aRe: .6 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' }); attach(SPOON, c.aR.hand, [0, -.6, .3], [0, 0, 0], 1);
  onFace(c, 6.4, .8, .8, 40, L.k); sh(V(TB.x, 0, -5), 12); }, [[0, 'spoon_scoop', .6], [.5, 'snicker', .4]]);
// 94 «Und noch einen.»: otra cucharada, rápida; la cámara gira
shot(140.98, 'R', null, L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); show(DOSE, TB.x - 1.6, 4.3, -3.6, .3, 1); DOSE.userData.open(1); DOSE.userData.glow(.6); actuar(c, 0, [[0, { aRx: 1.2 + Math.abs(Math.sin(L.T * 12)) * .4, aRz: .2, aRe: .6 }]], { T: L.T }); grin(c, L.T); attach(SPOON, c.aR.hand, [0, -.6, .3], [0, 0, 0], 1);
  orbit(V(TB.x - 1, 5, -4.4), 10, -.4 + L.k * .5, .25, 42); sh(V(TB.x, 0, -5), 12); }, [[0, 'spoon_scoop', .6], [.4, 'spoon_scoop', .5]]);
// 95 «Aber die Dose blieb randvoll.» (zoom lento): la lata, brillando, sigue llena hasta el borde aunque saco y saco; el polvo de café se recoloca solo
shot(141.97, 'F', 'slow', L => { kuecheS(L, { night: 1 }); show(DOSE, TB.x - 1.6, 4.3, -3.6, .3, 1.3); DOSE.userData.open(1); DOSE.userData.glow(.5 + Math.sin(L.T * 4) * .3); DOSE.userData.steam(L.T, 1); const P = DOSE.userData.pow; P.scale.y = .32 + Math.sin(L.T * 3) * .05;
  confRain(V(TB.x - 1.6, 4.3, -3.6), L.T, 16, 3, 3, 5); const d = wpos(DOSE); cm([d.x + 1, d.y + 6, d.z + 6, d.x, d.y + 2.2, d.z, 36], [d.x + .6, d.y + 5, d.z + 4.4, d.x, d.y + 2.2, d.z, 32], L.k); sh(d, 10); DOF = 1.4; }, [[0, 'magic_shimmer', .6]]);
// 96 «Mein Zähler drehte durch.»: el reloj de mi muñeca suelta chispas, los números corren como una tragaperras
shot(143.73, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -1, 0); actuar(c, 0, [[0, { aLx: 1.5, aLz: -.5, aLe: 1.5, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); const m = meterOf(c); const n = Math.floor(L.T * 37) % 99; m.userData.set(n + ' Tassen', euro(money(n % 50)), '#ffd23f');
  confetti(wpos(m), L.t0, L.T, 20, .4); const w = wpos(m); cm([w.x + 1.2, w.y + 1.4, w.z + 4.4, w.x, w.y, w.z, 34], [w.x + .9, w.y + 1.2, w.z + 3.6, w.x, w.y, w.z, 32], L.k); sh(V(TB.x, 0, -1), 12); DOF = 1.6; }, [[0, 'slot_machine', .7], [.3, 'sparks', .5]]);
// 97 «Zehn Tassen.»: bebo; diez tazas vacías en la mesa; +10
shot(144.91, 'W', null, L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); drink(c, L, L.t0, .4, { meter: true, chug: true, expr: 'determined' }); meterOf(c).userData.set('10 Tassen', euro(money(10))); setHUD(10); stack(V(TB.x + 2, 4.3, -3.2), 10, 1);
  billBurst(hp(c), L.t0 + .3, L.T, 20, .9); onBody(c, 12, -.4, .1, 42, L.k, 11, -.3, 4.4); sh(V(TB.x, 0, -4), 14); }, [[0, 'gulp', .6], [.4, 'cash_reg', .6]]);
// 98 «Zwanzig.»: veinte tazas; los billetes empiezan a volar por la cocina
shot(145.74, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); drink(c, L, L.t0 - .1, .35, { meter: true, chug: true, expr: 'determined' }); meterOf(c).userData.set('20 Tassen', '1 Mio. €', '#ffd23f'); setHUD(20, '#ffd23f'); stack(V(TB.x + 2, 4.3, -3.2), 20, 1);
  billRain(V(TB.x, 0, -4), L.T, 50, 16, 10, 12); dcam(c, L.k, 11, -.7, 5, 42); sh(V(TB.x, 0, -4), 14); }, [[0, 'gulp', .6], [.3, 'money_rain', .6]]);
// 99 «Dreißig!»: treinta tazas: la pirámide llega al techo, yo bebo con una taza en cada mano
shot(146.65, 'Z', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); drink(c, L, L.t0, .35, { meter: true, chug: true, expr: 'determined', pose: { aLx: 2.0, aLz: .4, aLe: .6 } }); setHUD(30, '#ffd23f'); stack(V(TB.x + 2.2, 4.3, -3.2), 30, 1);
  badge('gold', '30!', W / 2, H * .22, clamp(L.lt / .15), 1, 1.4); billRain(V(TB.x, 0, -4), L.T, 70, 16, 10, 12); orbit(V(TB.x + 1, 6, -5), lerp(15, 13, L.k), .4, .14, 44); sh(V(TB.x, 0, -4), 14); }, [[0, 'gulp', .6], [.1, 'impact', .5]]);
// 100 «Genau da, wo alle aufgeben.»: corte a la terraza: el fortachón del principio sigue tirado en el suelo… yo, en mi cocina, sigo bebiendo sin despeinarme
shot(147.50, 'S', null, L => { if (L.lt < .7) { town(L, { dusk: 1 }); const h = cafeNear(30); const tx = Math.sign(h.x) * 40; const c = put(CR[16], tx, .5, h.z - 7.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.x = -1.5; actuar(c, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: .8, aRz: .8 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'o' }); badge('red', 'AUFGEGEBEN', W / 2, H * .22, 1, 1, .9);
    orbit(V(tx, 2, h.z - 7.6), 12, (h.x < 0 ? -.6 : .6), .5, 44); sh(V(tx, 0, h.z - 6), 16); }
  else { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); drink(c, L, L.t1 - 1.3, .4, { meter: true, expr: 'smug', after: 'smug', afterMouth: 'smirk' }); setHUD(35, '#ffd23f'); stack(V(TB.x + 2.2, 4.3, -3.2), 35, 1); onBody(c, 11, -.3, .1, 42, L.k, 10, -.3, 4.6); sh(V(TB.x, 0, -4), 14); } },
  [[0, 'snore', .4], [.7, 'whoosh', .4], [.9, 'gulp', .5]]);
// 101 «Vierzig.»: cuarenta; la cocina tiembla, los platos del aparador saltan
shot(148.94, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 0, -6.4, 0); drink(c, L, L.t0, .3, { meter: true, chug: true, expr: 'determined' }); setHUD(40, '#ffd23f'); stack(V(TB.x + 2.2, 4.3, -3.2), 40, 1); SHAKE = .6;
  billRain(V(TB.x, 0, -4), L.T, 90, 18, 12, 12); dcam(c, L.k, 11, -1.0, 5, 42); sh(V(TB.x, 0, -4), 14); }, [[0, 'gulp', .6], [.1, 'rumble', .6]]);
// 102 «Fünfzig Tassen!» (zoom lento): la última taza: me la bebo de pie sobre la silla, con la pirámide de 50 tazas brillando detrás; todo se ilumina de oro
shot(149.60, 'F', 'slow', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, 2.6, -6.4, 0); c.blob.visible = false; drink(c, L, L.t0, .9, { meter: true, chug: true, expr: 'determined', eyesD: 'squint', pose: { aLx: 2.6, aLz: .5, aLe: .3 } }); setHUD(L.lt < 1.2 ? 49 : 50, '#ffd23f'); stack(V(TB.x + 2.2, 4.3, -3.2), 50, 1);
  bloom.strength = .4 + L.k * .4; grade.uniforms.lift.value = L.k * .05; billRain(V(TB.x, 0, -4), L.T, 100, 20, 12, 14); onBody(c, 15, -.2, .08, 44, L.k, 12, -.1, 4.4); sh(V(TB.x, 0, -4), 16); }, [[0, 'gulp_long', .7], [.3, 'drumroll', .5]]);
// 103 «Die Legende.»: corte a la pizarra de la plaza: «REKORD: 50 TASSEN» se escribe sola en dorado; la gente sale en pijama a mirarla
shot(151.14, 'Z', 'punch', L => { town(L, { night: 1 }); show(TAFEL, 0, 0, -26, 0); TAFEL.userData.draw((c, w, h) => drawLegend(c, w, h, 1, 1)); crowdAt(L, 0, -14, 10, 4, 9, 21, { mode: i => ['shock', 'point'][i % 2], face: V(0, 15, -26), gap: 1.6 });
  confRain(V(0, 10, -24), L.T, 40, 26, 6, 18); cm([0, 12, 8, 0, 15, -26, 44], [0, 13, 4, 0, 15.5, -26, 42], L.k); sh(V(0, 0, -18), 30); DOF = 0; }, [[0, 'choir', .6], [.1, 'impact', .5]]);
// 104 «Ich war Billionär!»: en la cocina, salto con los brazos en alto; explosión de billetes y confeti; HUD: 50 Tassen · 1 Bio. €
shot(152.06, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x, Math.max(0, Math.sin(clamp(L.lt / .6) * PI) * 3), -1, 0); actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .5, aRz: .5, aLe: .2, aRe: .2, lLk: .8, rLk: .8 }]], { T: L.T }); laughF(c, L.T); setHUD(50, '#ffd23f'); meterOf(c).userData.set('50 Tassen', '1 Bio. €', '#ffd23f');
  billBurst(hp(c), L.t0, L.T, 40, 1.4, 0); confetti(hp(c), L.t0, L.T, 70, 1.2); cashPop(c, '1 BILLION €', clamp((L.lt - .1) / .2), 'gold', 1.3, 3.4); onBody(c, 13, 0, .1, 44, L.k, 11, 0, 4.4); sh(V(TB.x, 0, -1), 14); }, [[0, 'crowd_cheer', .4], [.05, 'money_burst', .7], [.2, 'party_horn', .5]]);
// ---------- e: el gran día, la Eilmeldung, el sueño como dinero y Oma (153,6 – 194,5 s) ----------
// 105 «Ich war schneller als die Straßenbahn»: corro por la plaza tan rápido que adelanto al tranvía: líneas de velocidad, hojas que vuelan, la gente se despeina
shot(153.57, 'W', null, L => { town(L, { morning: 1, tram: 30 - L.lt * 10 }); const z = 40 - L.lt * 34; const c = put(ich, -20, 0, z, PI); actuar(c, 0, [[0, runP(L.T * 1.8, 0)]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 24)) * .4; cara(c, L.T, { expr: 'determined', eyes: 'wide', mouth: 'open_smile' });
  speedLines(1, Math.floor(L.T * 15)); leaves(V(-20, 0, z), L.T * 4, 40, 14, 30, 10); dust(V(-20, 0, z + 3), L.t0, L.T, 14, 1.2); crowdAt(L, -8, z - 6, 6, 4, 10, 60, { mode: 'shock', gap: 1.2 });
  cm([-6, 6, z - 18, -20, 4.4, z, 46], [-6, 6, z - 16, -20, 4.4, z, 44], L.k); sh(V(-20, 0, z), 30); }, [[0, 'zoom_whoosh', .7], [.2, 'tram_bell', .5], [.8, 'whoosh', .5]]);
// 106 «und kaufte mir eine Villa,»: delante de la villa: le pongo el cartel «VERKAUFT» de un golpe; confeti
shot(155.41, 'F', null, L => { villaS(L); const c = put(ich, VIX + 4, 0, -12, -.4); actuar(c, L.lt, [[0, {}], [.15, { aRx: 2.6, aRz: .2, aRe: .3 }, { dur: .2 }], [.5, { aRx: 1.4, aRe: .6 }, { dur: .2 }]], { T: L.T }); laughF(c, L.T);
  DS3.userData.draw('verkauft', (cc, w, h) => { cc.fillStyle = '#c8202a'; cc.fillRect(0, 0, w, h); cc.fillStyle = '#ffffff'; cc.font = `700 110px ${FONT}`; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('VERKAUFT!', w / 2, h / 2 + 6); }); show(DS3, VIX, 4 + (1 - clamp(L.lt / .3)) * 6, -14, 0, .8);
  confetti(V(VIX, 4, -12), L.t0 + .2, L.T, 50, 1); orbit(V(VIX + 2, 6, -14), lerp(26, 22, L.k), .2, .12, 46); sh(V(VIX, 0, -16), 30); }, [[0, 'stamp', .7], [.2, 'cha_ching', .5]]);
// 107 «drei Sportwagen»: los tres deportivos amarillos en fila, cada uno con un lazo rojo; yo en el del medio
shot(156.41, 'C', 'punch', L => { villaS(L); const c = put(ich, VIX, 1.2, -6.4 + 1, PI); c.blob.visible = false; actuar(c, 0, [[0, sitPose({ aLx: 2.6, aLz: .4, aRx: 1.1, aRe: .8 })]], { T: L.T, weight: false }); laughF(c, L.T);
  badge('num', '3 SPORTWAGEN', W / 2, H * .2, clamp(L.lt / .2), 1, 1); orbit(V(VIX, 3, -6), lerp(24, 21, L.k), .35, .2, 46); sh(V(VIX, 0, -6), 26); }, [[0, 'engine_rev', .7], [.4, 'horn_toot', .4]]);
// 108 «und gleich die ganze Tchibo-Filiale.»: dentro de la tienda Tchibo, con la pancarta «VERKAUFT», lanzo paquetes al aire; la cajera aplaude
shot(157.57, 'W', null, L => { tchiboS(L); const c = put(ich, TLX, 0, -2, 0); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .4, aRz: .4, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(c, L.T); const k = put(CR[22], TLX + 10, 0, -6.4, -.6); actuar(k, 0, [[0, 'cheer']], { T: L.T }); laughF(k, L.T);
  PACKS.TCHIBO.forEach((p, i) => { const t = (L.lt * 1.2 + i * .25) % 1; show(p, TLX - 3 + i * 2, 4 + Math.sin(t * PI) * 7, -2 + (i % 2), t * 6 + i, 1); });
  DS3.userData.draw('verkauft2', (cc, w, h) => { cc.fillStyle = '#c8202a'; cc.fillRect(0, 0, w, h); cc.fillStyle = '#ffffff'; cc.font = `700 90px ${FONT}`; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('VERKAUFT AN NOAH', w / 2, h / 2 + 6); }); show(DS3, TLX, 12, -14.2, 0, 1);
  orbit(V(TLX, 6, -4), lerp(22, 19, L.k), 0, .14, 46); sh(V(TLX, 0, -4), 24); }, [[0, 'register', .6], [.3, 'crowd_cheer', .4], [1.2, 'cha_ching', .5]]);
// 109 «Doch am nächsten Morgen»: amanecer; en la cocina de Oma la tele se enciende sola con el ruido de interferencias
shot(159.91, 'B', null, L => { kuecheS(L); OK.TV.draw((c, w, h) => { if (L.lt < .4) { const r = RNG(Math.floor(L.T * 30)); for (let i = 0; i < 400; i++) { const v = r() * 255 | 0; c.fillStyle = `rgb(${v},${v},${v})`; c.fillRect(r() * w, r() * h, 8, 4); } } else drawNews(c, w, h, L.lt, 0); });
  const c = sit2(ich, OKX + 6, -5, PI / 2, 2.6); actuar(c, 0, [[0, sitPose({ aRx: .9, aRe: 1.2, headX: .2 })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'tired', mouth: 'yawn' });
  orbit(V(OKX + 10, 5, -5), lerp(16, 14, L.k), -.9, .12, 44); sh(V(OKX + 10, 0, -5), 16); }, [[0, 'rooster', .5], [.3, 'tv_static', .5], [.5, 'news_jingle', .6]]);
// 110 «kam im Fernsehen eine Eilmeldung:»: plató de RTV 24: la presentadora con cara seria; detrás «EILMELDUNG» en rojo
shot(160.78, 'C', 'punch', L => { studioS(L); ST.SCR.draw((c, w, h) => drawNews(c, w, h, L.lt, 0)); const s = put(sprech, STX, 0, -5, 0); talk(s, L.T, L.t0, L.t1, 'worried'); actuar(s, 0, [[0, { aLx: .9, aRx: .9, aLe: 1.4, aRe: 1.4 }]], { T: L.T });
  orbit(V(STX, 6, -5), lerp(17, 15, L.k), 0, .06, 44); sh(V(STX, 0, -4), 18); }, [[0, 'news_jingle', .5], [.2, 'impact', .5]]);
// 111 «Wegen mir brach im ganzen Land die Wirtschaft zusammen.»: en la pantalla la gráfica se desploma; en la bolsa (ministerio) los funcionarios se llevan las manos a la cabeza
shot(162.51, 'S', 'punch', L => { minS(L); const k = clamp(L.lt / 1.2); MI.scr.userData.draw((c, w, h) => drawNews(c, w, h, L.lt, 0));
  [CR[24], CR[25], CR[26], REN[2]].forEach((x, i) => { put(x, MIX - 6 + i * 4, 0, -2 + (i % 2) * 2, 0); actuar(x, 0, [[0, i % 2 ? 'hands_head' : 'shock']], { T: L.T + i }); cara(x, L.T, { expr: 'shock', mouth: 'scream' }); });
  billRain(V(MIX, 0, -2), L.T, 40, 22, 10, 16); badge('red', 'CRASH!', W / 2, H * .2, clamp((L.lt - .3) / .2), 1, 1.3); SHAKE = .5 * (1 - k);
  orbit(V(MIX, 6, -2), lerp(24, 20, L.k), 0, .14, 46); sh(V(MIX, 0, -2), 24); }, [[0, 'alarm', .6], [.4, 'crash_down', .6], [1.2, 'crowd_gasp', .5]]);
// 112 «Ein Brötchen kostete plötzlich eine Million.»: en la panadería, el panadero pone la etiqueta «1.000.000 €» a un Brötchen; el cliente se desmaya
shot(165.15, 'W', null, L => { town(L, { morning: 1 }); const h = HSN('BÄCKEREI') || RT.HS[2]; const bx = h.x * .86, bz = h.z; const b = put(baecker, bx, 0, bz, h.x < 0 ? PI / 2 : -PI / 2); actuar(b, 0, [[0, { aRx: 1.4, aRe: .6, aLx: 1.0, aLe: 1.0 }]], { T: L.T }); cara(b, L.T, { expr: 'smug', mouth: 'smirk' });
  show(BROT, bx + (h.x < 0 ? 3 : -3), 3.4, bz, h.x < 0 ? PI / 2 : -PI / 2, 1.2); const c = put(CR[27], bx + (h.x < 0 ? 7 : -7), 0, bz + 1, h.x < 0 ? -PI / 2 : PI / 2); const k = clamp((L.lt - 1.0) / .4);
  c.root.rotation.order = 'YXZ'; c.root.rotation.x = -k * 1.5; c.root.position.y = .5 * k; actuar(c, 0, [[0, k > 0 ? { aLx: 2.2, aRx: 2.2, aLz: .8, aRz: .8 } : 'shock']], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: k > .5 ? 'closed' : 'wide', mouth: 'scream' });
  orbit(V(bx + (h.x < 0 ? 3.5 : -3.5), 4.6, bz), lerp(16, 14, L.k), (h.x < 0 ? PI / 2 : -PI / 2) + .2, .12, 44); sh(V(bx, 0, bz), 18); }, [[0, 'bell_shop', .5], [.4, 'stamp', .5], [1.1, 'thud', .6]]);
// 113 «Die Regierung beschloss über Nacht:»: el ministerio de noche: los ministros votan levantando la mano
shot(167.48, 'C', null, L => { minS(L); TINT = 'rgba(10,16,60,.25)'; MI.scr.userData.draw((c, w, h) => drawNews(c, w, h, L.lt, 1)); [CR[24], CR[25], CR[26], CR[28], CR[29]].forEach((x, i) => { put(x, MIX - 8 + i * 4, 0, -6, 0); actuar(x, L.lt, [[0, {}], [.2 + i * .08, { aRx: 2.9, aRz: .1, aRe: .1 }, { dur: .3 }]], { T: L.T }); cara(x, L.T, { expr: 'determined' }); });
  orbit(V(MIX, 6, -6), lerp(22, 19, L.k), 0, .12, 46); sh(V(MIX, 0, -6), 24); }, [[0, 'gavel', .6], [.4, 'murmur', .4]]);
// 114 «Kaffeegeld zählt nicht mehr.»: en la plaza, los relojes de todos se ponen a 0 €; un señor tira su taza al suelo, enfadado
shot(168.76, 'W', 'punch', L => { town(L, { morning: 1 }); const c = put(CR[0], 0, 0, 12, 0); const k = clamp((L.lt - .5) / .3); actuar(c, 0, [[0, k > 0 ? { aRx: 2.4 - k * 2, aRe: .2, aLx: .4 } : { aRx: .9, aRe: 1.0 }]], { T: L.T }); cara(c, L.T, { expr: 'angry', mouth: 'shout' }); meterOf(c).userData.set('0 €', 'UNGÜLTIG', '#ff4a4a');
  const cu = CUPS[14]; if (k < 1) { attach(cu, c.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], 1); } else { show(cu, .6, Math.max(.4, 3 - (L.lt - .8) * 12), 13.2, L.T * 6, 1); } crowdAt(L, 0, 6, 8, 6, 12, 64, { mode: i => ['shock', 'point'][i % 2], gap: 1.2 });
  badge('red', 'X  KAFFEEGELD', W / 2, H * .2, clamp(L.lt / .2), 1, 1); dcam(c, L.k, 11, -.6, 5, 42); sh(V(0, 0, 12), 18); }, [[0, 'error_buzz', .6], [.9, 'cup_break', .6]]);
// 115 «Das neue Geld?»: la presentadora levanta una ceja; la pantalla se pone azul noche
shot(170.50, 'C', null, L => { studioS(L); ST.SCR.draw((c, w, h) => drawNews(c, w, h, L.lt, 1)); const s = put(sprech, STX, 0, -5, 0); talk(s, L.T, L.t0, L.t1, 'smug'); actuar(s, 0, [[0, { aRx: 1.6, aRe: 1.2, aLx: .9, aLe: 1.4 }]], { T: L.T });
  onFace(s, 6, .4, -.4, 40, L.k); sh(V(STX, 0, -4), 14); }, [[0, 'whoosh_soft', .4], [.3, 'question', .4]]);
// 116 «Schlaf.» (zoom lento): la pantalla gigante: SCHLAF, con nubes y estrellas
shot(171.51, 'F', 'slow', L => { studioS(L); ST.SCR.draw((c, w, h) => drawNews(c, w, h, L.lt, 1)); cm([STX, 10, 14, STX, 10, -14.7, 44], [STX, 10, 6, STX, 10, -14.7, 40], L.k); sh(V(STX, 0, -8), 20); DOF = 0; }, [[0, 'lullaby', .6]]);
// 117 «Jede Stunde Schlaf: hundert Euro.»: una vecina duerme a pierna suelta y por cada «Z» le cae un billete de 100 en la cama
shot(172.12, 'S', null, L => { zimmerS(L, { night: 1 }); const c = put(CR[1], ZIX - 7, 1.6, -3.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.set(-PI / 2 + .25, 0, 0); c.blob.visible = false; actuar(c, 0, [[0, { aLx: .2, aRx: .2, headX: .3 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'smile' }); zzz(c, L.T, 1);
  billFall(V(ZIX - 7, 2, -3), L.t0, L.T, 24, 5, 6, 10); cashPop(c, '+100 €', clamp((L.lt - .8) / .2), 'green', 1); orbit(V(ZIX - 7, 4, -3.6), lerp(13, 11.5, L.k), .5, .4, 42); sh(V(ZIX - 6, 0, -3), 14); }, [[0, 'snore', .5], [.6, 'cash_reg', .5], [1.2, 'cash_reg', .5]]);
// 118 «Mein Problem?»: yo, de vuelta en la cocina, con la taza en la mano y cara de «oh, no»
shot(174.06, 'C', 'punch', L => { kuecheS(L); const c = put(ich, TB.x, 0, -1, 0); actuar(c, 0, [[0, { aRx: .9, aRe: 1.2, headX: .15 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'wide', mouth: 'grimace' }); sweat(c, L.T, 2);
  onFace(c, 5.6, .4, .4, 38, L.k); sh(V(TB.x, 0, -1), 12); }, [[0, 'gulp_nervous', .5]]);
// 119 «Seit dieser Dose habe ich keine Minute mehr geschlafen.»: de noche en mi cama: ojos como platos, ojeras, el reloj pasa de 1:00 a 4:00; mi reloj de muñeca: 0 €
shot(174.98, 'B', null, L => { zimmerS(L, { night: 1 }); const c = put(ich, ZIX - 7, 1.6, -3.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.set(-PI / 2 + .25, 0, 0); c.blob.visible = false; actuar(c, 0, [[0, { aLx: .2, aRx: .2, headX: .3 }]], { T: L.T }); cara(c, L.T, { eyes: 'wide', mouth: 'wavy' });
  const hr = 1 + Math.floor(clamp(L.lt / 2.3) * 4); DS1.userData.draw('h' + hr, (cc, w, h) => { cc.fillStyle = '#0a0a10'; cc.fillRect(0, 0, w, h); cc.fillStyle = '#ff3a3a'; cc.font = `700 200px ${FONT}`; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText(hr + ':00', w / 2, h / 2 + 10); }); show(DS1, ZIX - 1, 4.2, -7.5, 0, .32);
  badge('red', '0 MIN. SCHLAF', W / 2, H * .2, clamp((L.lt - .4) / .2), 1, 1); cm([ZIX - 2.5, 11, 7, ZIX - 6, 4.2, -3.6, 42], [ZIX - 3.5, 10, 5, ZIX - 6, 4.2, -3.6, 40], L.k); sh(V(ZIX - 6, 0, -3), 14); DOF = 0; }, [[0, 'clock_tick', .6], [.6, 'clock_tick', .6], [1.2, 'clock_tick', .6], [1.8, 'owl', .4]]);
// 120 «Der Pfarrer auch nicht.»: el cura, de noche en la iglesia, cuenta ovejas en un libro… con los ojos abiertos
shot(177.33, 'W', null, L => { kircheS(L, { night: 1 }); const p = sit2(pfarrer, KIX + 6, 2, PI, 2.5); actuar(p, 0, [[0, sitPose({ aRx: 1.2, aRe: 1.3, aLx: 1.2, aLe: 1.3 })]], { T: L.T, weight: false }); cara(p, L.T, { eyes: 'wide', mouth: 'flat' }); think(p, '1001 Schafe…', clamp(L.lt / .2), -1);
  onBody(p, 10, 0, .1, 42, L.k, 9, 0, 3.4); sh(V(KIX + 6, 0, 2), 14); }, [[0, 'sheep', .4], [.6, 'clock_tick', .4]]);
// 121 «Wir zwei sind jetzt die Ärmsten der Stadt.»: el cura y yo, de noche, sentados en un banco de la plaza con las carteras vacías y una taza de agua; hojas que caen
shot(178.61, 'B', null, L => { town(L, { night: 1 }); const c = sit2(ich, -16.6, -19, PI / 2, 2.4), p = sit2(pfarrer, -16.6, -21.6, PI / 2, 2.4); [c, p].forEach((x, i) => { actuar(x, 0, [[0, sitPose({ aRx: .8, aRe: 1.4, aLx: .5, aLe: 1.1, headX: .25 })]], { T: L.T, weight: false }); cara(x, L.T + i, { eyes: 'wide', mouth: 'frown' }); });
  show(WALLET, -15, 2.5, -20.3, PI / 2, .8); show(MOTH, -15 + Math.sin(L.T * 3), 4 + L.lt, -20.3, 0, .8); leaves(V(-16, 0, -20), L.T, 20, 12, 10, 12); badge('red', '0 €', W / 2, H * .2, clamp((L.lt - .5) / .2), 1, 1.1);
  orbit(V(-16.6, 4.4, -20.3), lerp(14, 12, L.k), PI / 2 - .3, .14, 44); sh(V(-16, 0, -20), 16); }, [[0, 'wind', .5], [.5, 'sigh', .5], [1.2, 'owl', .3]]);
// 122 «Und die reichste Frau der Welt?»: la plaza de día: un globo terráqueo con una corona encima sobre la fuente; la gente mira hacia arriba
shot(180.50, 'Z', null, L => { town(L, { morning: 1 }); const cr = CROWNS[0]; show(cr, 0, 22 + Math.sin(L.T * 2) * .4, -8, L.T, 4); confRain(V(0, 8, -8), L.T, 30, 20, 10, 20); crowdAt(L, 0, 4, 10, 6, 12, 66, { mode: 'point', face: V(0, 20, -8), gap: 1.0 });
  cm([0, 6, 30, 0, 15, -8, 48], [0, 8, 24, 0, 17, -8, 46], L.k); sh(V(0, 0, 0), 30); }, [[0, 'whoosh_up', .5], [.3, 'choir', .4]]);
// 123 «Meine Oma.»: la corona aterriza en la cabeza de Oma, dormida en su sillón con una sonrisa; lluvia de billetes de 100 sobre ella
shot(181.90, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const o = put(oma, OKX + 6, sitY(oma, 2.6), -5, PI / 2); o.blob.visible = false; actuar(o, 0, [[0, sitPose({ headX: .3, headZ: .2, aLx: .3, aRx: .3 })]], { T: L.T, weight: false }); cara(o, L.T, { eyes: 'closed', mouth: 'smile' }); zzz(o, L.T, 1);
  const h = hp(o); const k = easeIn(clamp(L.lt / .3)); show(CROWNS[0], h.x, h.y + 1.25 + (1 - k) * 6, h.z, 0, .95); billFall(V(OKX + 6, 2, -5), L.t0, L.T, 50, 8, 6, 12); badge('gold', 'OMA', W / 2, H * .2, clamp((L.lt - .2) / .2), 1, 1.3);
  orbit(V(OKX + 6, 5, -5), lerp(12, 10.5, L.k), PI / 2 + .45, .14, 42); sh(V(OKX + 6, 0, -5), 14); }, [[0, 'ding_big', .6], [.1, 'money_rain', .6]]);
// 124 «Acht Tassen am Tag,»: Oma de día, en la mesa, sirviéndose otra taza de su Kanne de flores con cara de felicidad
shot(182.46, 'W', null, L => { kuecheS(L); const o = omaSeat(oma, L, -3); drink(o, L, L.t0 + .6, .5, { sit: true, pose: SITP, meter: true, expr: 'happy' }); meterOf(o).userData.set('8 Tassen', 'SCHLAF: 9 Std.', '#9ad8ff'); show(OKAN, TB.x - 1.2, 4.3, -1, .4, 1); OKAN.userData.steam(L.T, 1);
  for (let i = 0; i < 7; i++) { const t = CUPS[i]; show(t, TB.x - 5 + i * 1.55, 4.3, -1.6 + (i % 2) * .7, i, .8); t.userData.level(0); } badge('num', '8 TASSEN', W / 2, H * .2, clamp(L.lt / .2), 1, 1);
  orbit(V(TB.x - 2, 5, -3.4), lerp(14, 12.5, L.k), .25, .18, 44); sh(V(TB.x - 2, 0, -3), 14); }, [[0, 'pour', .5], [.6, 'sip', .5]]);
// 125 «und um neun schläft sie wie ein Baby.»: Oma duerme en su sillón con su gorrito de dormir, abrazada a un cojín; su reloj sube: +100 € por hora
shot(184.21, 'B', null, L => { kuecheS(L, { night: 1 }); const o = put(oma, OKX + 6, sitY(oma, 2.6), -5, PI / 2); o.blob.visible = false; actuar(o, 0, [[0, sitPose({ headX: .35, headZ: .25, aLx: 1.0, aRx: 1.0, aLe: 1.6, aRe: 1.6, aLz: -.3, aRz: -.3 })]], { T: L.T, weight: false }); cara(o, L.T, { eyes: 'closed', mouth: Math.sin(L.T * 2.4) > 0 ? 'o' : 'smile' }); zzz(o, L.T, 1);
  const m = meterOf(o); m.userData.set('SCHLAF', '+' + (100 * (1 + Math.floor(L.lt * 3))) + ' €', '#9ad8ff'); cashPop(o, '+100 €', clamp((L.lt - .3) / .2), 'green', .9); billFall(V(OKX + 6, 2, -5), L.t0 + .3, L.T, 20, 6, 4, 10);
  orbit(V(OKX + 6, 5, -5), lerp(13, 11, L.k), PI / 2 - .4, .14, 42); sh(V(OKX + 6, 0, -5), 14); }, [[0, 'snore', .6], [.8, 'cash_reg', .4], [1.4, 'snore', .6]]);
// 126 «Und weißt du noch, wer mich an dem Abend in den Keller geschickt hat?» (zoom lento): flashback en sepia: Oma señalando la puerta del sótano con la cesta
shot(186.25, 'F', 'slow', L => { kuecheS(L, { night: 1 }); grade.uniforms.sepia.value = .8; const o = put(oma, TB.x + 6, 0, 2, PI / 2 + .3); actuar(o, 0, [[0, { aRx: 1.6, aRz: -.1, aRe: .1, aLx: 1.0, aLe: 1.0 }]], { T: L.T }); cara(o, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' });
  show(BUCKET, TB.x + 7.2, 3.2, 3.6, 0, 1); onFace(o, 7, .4, -.6, 40, L.k, 5); sh(V(TB.x + 6, 0, 2), 14); }, [[0, 'old_film', .4], [.4, 'riser_soft', .4]]);
// 127 «Oma lächelt nur.»: primer plano de Oma, sonrisa pícara y guiño; un brillo en las gafas
shot(188.88, 'C', 'punch', L => { kuecheS(L); const o = omaSeat(oma, L, -3); actuar(o, 0, [[0, sitPose({ aRx: .9, aRe: 1.2 })]], { T: L.T, weight: false }); cara(o, L.T, { expr: 'smug', eyes: L.lt > .5 && L.lt < .9 ? 'wink' : 'squint', mouth: 'smirk' });
  const h = hp(o); show(HALO, h.x + .3, h.y + .8, h.z + .75, 0, .2); onFace(o, 5, .5, -.2, 38, L.k); sh(V(TB.x - 3, 0, -4), 12); }, [[0, 'ding', .5], [.5, 'wink', .5]]);
// 128 «Und gestern Abend hat sie mich schon wieder runtergeschickt.»: de noche, Oma me tiende la cesta otra vez y señala la puerta del sótano; yo la miro con terror
shot(190.25, 'W', null, L => { kuecheS(L, { night: 1 }); const o = put(oma, TB.x + 6, 0, 2, PI / 2 + .3); actuar(o, 0, [[0, { aRx: 1.6, aRz: -.1, aRe: .1, aLx: 1.2, aLe: .6 }]], { T: L.T }); talk(o, L.T, L.t0, L.t0 + 2, 'smug');
  const c = put(ich, TB.x + 11, 0, 4, -PI / 2 - .4); actuar(c, 0, [[0, 'shock']], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'grimace_wide' }); sweat(c, L.T, 3); show(BUCKET, TB.x + 8.6, 3.2, 3.4, 0, 1);
  orbit(V(TB.x + 8.5, 5, 3), lerp(15, 13, L.k), -.25, .12, 44); sh(V(TB.x + 8, 0, 3), 16); }, [[0, 'door_creak', .5], [.4, 'gulp_nervous', .5]]);
// 129 «Kartoffeln holen.»: final: desde el fondo del sótano oscuro, la lata brilla y su tapa se abre sola; yo bajo despacio la escalera
shot(192.78, 'B', 'slow', L => { kellerS(L); KE.BL.intensity = 20; const D = KE.D; D.userData.open(clamp(L.lt / 1.2) * .6); D.userData.glow(.8); D.userData.steam(L.T, 1);
  const c = put(ich, KEX - 10, lerp(9.8, 8.4, clamp(L.lt / 1.6)), lerp(-4, -2.4, clamp(L.lt / 1.6)), 0); c.blob.visible = false; actuar(c, 0, [[0, { ...walkP(L.T * .5, 1), aRx: .8, aRe: 1.0 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'wide' });
  cm([KEX + 2.6, 3, -7, KEX - 8, 9, -1, 46], [KEX + 2.6, 2.8, -7.6, KEX - 6, 8, -2, 44], L.k); sh(V(KEX - 4, 0, -4), 16); }, [[0, 'stairs_creak', .6], [.6, 'magic_shimmer', .5], [1.2, 'tin_open', .5]]);
// ---------- f: planos intercalados para que la media sea ~1,2 s (cada uno con otro entorno o ángulo y su acción) ----------
// «Geld auf deinem Konto.»: primer plano del móvil del abuelo: el saldo salta y caen monedas sobre la pantalla
shot(4.35, 'C', 'punch', L => { town(L, { morning: 1 }); const c = sit2(REN[0], -16.6, -18, PI / 2, 2.4); actuar(c, 0, [[0, sitPose({ aLx: 1.2, aLe: 1.6, aLz: .2, headX: .3 })]], { T: L.T, weight: false }); grin(c, L.T);
  attach(PHONE, c.aL.hand, [0, -.6, .5], [-.4, 0, 0], .9); const k = clamp(L.lt / .5); PHONE.userData.draw(c_ => drawBankApp(c_, 300, 560, euro(492 + Math.round(12 * k)), '+12 € KAFFEE', '#5aff9a'));
  const w = wpos(PHONE); coins(w.clone().add(V(0, 1, 0)), L.t0, L.T, 10); cm([w.x + 3, w.y + 1.6, w.z + 1.2, w.x, w.y, w.z, 34], [w.x + 2.4, w.y + 1.3, w.z + 1, w.x, w.y, w.z, 32], L.k); sh(V(-16, 0, -18), 12); DOF = 1.4; }, [[0, 'notify', .6], [.2, 'coins', .5]]);
// «Mensch auf der Erde.»: plano cenital de la plaza: toda la ciudad mirando hacia arriba, a mí, de pie en la fuente; billetes volando
shot(14.76, 'Z', null, L => { town(L, { morning: 1 }); const c = put(ich, 0, 2.2, 4, 0); actuar(c, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .6, aRz: .6, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(c, L.T); setHUD(50, '#ffd23f');
  crowdAt(L, 0, 4, 22, 6, 18, 17, { mode: i => ['point', 'shock', 'cheer'][i % 3], face: V(0, 6, 4), full: true }); billRain(V(0, 0, 4), L.T, 80, 30, 24, 18);
  cm([0, 44, 26, 0, 2, 2, 46], [0, 40, 20, 0, 2, 2, 44], L.k); sh(V(0, 0, 4), 34); }, [[0, 'crowd_ooh', .5], [.4, 'money_rain', .5]]);
// «kein Wort sagt.»: primerísimo plano de Oma: mirada asesina por encima de las gafas, ni un músculo
shot(21.43, 'C', 'punch', L => { kuecheS(L); const o = omaSeat(oma, L, -3); actuar(o, 0, [[0, sitPose({ aRx: .7, aRe: 1.1, headX: -.1 })]], { T: L.T, weight: false }); cara(o, L.T, { expr: 'angry', eyes: 'squint', mouth: 'flat' });
  onFace(o, 3.8, .2, -.2, 34, L.k, 3.2); sh(V(TB.x - 3, 0, -4), 10); }, [[0, 'cricket', .5], [.3, 'tick', .3]]);
// «meine Oma.»: con la taza aún en la boca, a Oma se le iluminan los ojos y le salen corazones
shot(23.40, 'W', null, L => { kuecheS(L); const o = omaSeat(oma, L, -3); drink(o, L, L.t0 - .3, .25, { sit: true, pose: SITP, after: 'joy', afterMouth: 'open_smile' }); badge('heart', '', W * .34, H * .3, clamp((L.lt - .2) / .2), 1, .7); badge('heart', '', W * .66, H * .27, clamp((L.lt - .35) / .2), 1, .6);
  onFace(o, 5.2, .6, .9, 38, L.k); sh(V(TB.x - 3, 0, -4), 12); }, [[0, 'aah_old', .5], [.3, 'pling', .4]]);
// «trotzdem wie ein Baby.»: Oma con gorro de dormir abrazada a un cojín, chupándose el pulgar, con una sonrisa de bebé
shot(27.10, 'C', null, L => { kuecheS(L, { night: 1 }); const o = put(oma, OKX + 6, sitY(oma, 2.6), -5, PI / 2); o.blob.visible = false; actuar(o, 0, [[0, sitPose({ headX: .3, headZ: .3, aLx: 1.6, aLe: 2.2, aLz: -.2, aRx: 1.0, aRe: 1.6, aRz: -.3 })]], { T: L.T, weight: false }); cara(o, L.T, { eyes: 'closed', mouth: 'smile' }); zzz(o, L.T, 1);
  onFace(o, 5, .4, .6, 38, L.k); sh(V(OKX + 6, 0, -5), 12); }, [[0, 'baby_coo', .5], [.6, 'snore', .4]]);
// «wird Billionär.»: la plaza se convierte en una fuente de oro: billetes saliendo de la cafetera gigante; HUD 1 Bio. €
shot(32.45, 'F', 'punch', L => { town(L, { dusk: 1 }); setHUD(50, '#ffd23f'); billBurst(V(0, 14, -8), L.t0, L.T, 40, 1.6, 0); billBurst(V(0, 14, -8), L.t0 + .3, L.T, 40, 1.4, 40); confRain(V(0, 4, -8), L.T, 50, 30, 20, 22);
  crowdAt(L, 0, 6, 10, 8, 14, 23, { mode: 'cheer', gap: 1 }); badge('gold', '1 BILLION €', W / 2, H * .24, clamp(L.lt / .2), 1, 1.3); cm([0, 9, 34, 0, 12, -8, 50], [0, 10, 28, 0, 13, -8, 48], L.k); sh(V(0, 0, -4), 30); }, [[0, 'money_burst', .6], [.2, 'cha_ching', .6]]);
// «jeden Morgen eine Tasse,»: amanecer en la cocina de una abuela: abre la cortina con la taza humeante y el sol le da en la cara
shot(47.64, 'W', null, L => { kuecheS(L); sun.intensity = 0; const o = put(REN[1], TB.x - 4, 0, -9.6, PI - .3); drink(o, L, L.t0 + .4, .5, { expr: 'warm', after: 'joy', steam: 1 }); confRain(V(TB.x - 4, 6, -11), L.T, 12, 6, 2, 6);
  onBody(o, 9, 0, .1, 40, L.k, 8, 0, 4.4); sh(V(TB.x - 4, 0, -9), 12); }, [[0, 'curtain', .5], [.4, 'sip', .5], [.8, 'birds_morning', .4]]);
// «Kaffee und Kuchen.»: primer plano: el cuchillo corta la Selva Negra y las tazas chocan sobre la mesa de cuadros
shot(49.69, 'C', 'punch', L => { kuecheS(L); show(KUCH[0], TB.x, 4.3, -1, L.lt * .4, 1.3); [0, 1, 2].forEach(i => { const t = CUPS[i]; show(t, TB.x - 2.6 + i * 2.6, 4.3 + Math.max(0, Math.sin(clamp((L.lt - .2) / .4) * PI)) * 1.2, 1.4 - Math.abs(i - 1) * .4, 0, .8); t.userData.level(.8); t.userData.steam(L.T, 1); });
  cm([TB.x, 9, 7, TB.x, 4.8, -.4, 36], [TB.x, 8.4, 6, TB.x, 4.8, -.4, 34], L.k); sh(V(TB.x, 0, 0), 10); DOF = 1.4; }, [[0, 'knife_cake', .5], [.4, 'cup_clink', .6]]);
// «Rentner Sportwagen,»: primer plano del abuelo al volante, gafas de piloto, bufanda al viento, riendo
shot(52.33, 'C', null, L => { town(L, { morning: 1 }); const r = CARS[0].root || CARS[0]; r.visible = true; r.position.set(0, 0, 30 - L.lt * 4); r.rotation.y = PI; const d = put(REN[0], .9, sitY(REN[0], 1.9), r.position.z + .8, PI); d.blob.visible = false;
  actuar(d, 0, [[0, sitPose({ aRx: 1.3, aRe: .9, aLx: 2.7, aLz: .3, aLe: .3 })]], { T: L.T, weight: false }); laughF(d, L.T); leaves(hp(d), L.T * 3, 20, 10, 10, 8); speedLines(.6, Math.floor(L.T * 15));
  onFace(d, 5.6, .6, -.8, 40, L.k); sh(V(0, 0, 28), 14); }, [[0, 'engine_rev', .6], [.3, 'laugh_old', .5]]);
// «richtig guter Kaffee.»: el barista le da una taza de verdad: el reloj se pone verde con un ✓
shot(56.06, 'W', 'punch', L => { cafe(L); const c = put(CR[20], CIX + 2, 0, -5, PI - .3); drink(c, L, L.t0 + .05, .35, { meter: true, expr: 'happy', after: 'joy' }); meterOf(c).userData.set('✓ GUT', '+12 €'); const b = put(barista, CIX + .4, 0, -13.2, 0); actuar(b, 0, [[0, 'cheer']], { T: L.T }); laughF(b, L.T);
  badge('green', '✓', W / 2, H * .22, clamp((L.lt - .4) / .15), 1, 1.6); dcam(c, L.k, 11, -.8, 5, 42); sh(V(CIX + 2, 0, -7), 16); }, [[0, 'sip', .5], [.4, 'ding', .6]]);
// «jede Tasse»: la cafetera de filtro llena una taza con café Tchibo recién hecho, humo y brillo
shot(63.71, 'Z', null, L => { cafe(L); const K = KAN[0]; show(K, CIX + 6, 4.6 + 1.4, -10, 0, 1); K.rotation.z = .9; K.userData.level(.6); const t = CUPS[2]; show(t, CIX + 5, 4.6, -10, 0, 1.2); t.userData.level(clamp(L.lt / .6) * .8); t.userData.steam(L.T, 1); show(PACKS.TCHIBO[2], CIX + 8, 4.6, -10.6, -.3, 1);
  cm([CIX + 6, 8, -4.6, CIX + 5.6, 5.6, -10, 34], [CIX + 6, 7.6, -5.4, CIX + 5.6, 5.6, -10, 32], L.k); sh(V(CIX + 6, 0, -9), 10); DOF = 1.4; }, [[0, 'pour', .6]]);
// «kein Zufall:»: Jacky guiña un ojo a cámara señalando el nombre del paquete
shot(68.43, 'C', 'punch', L => { salonS(L); const j = put(jacky, SAX + 1, 0, 1.2, PI - .2); actuar(j, 0, [[0, { aRx: 1.6, aRz: .3, aRe: .2, lean: .05 }]], { T: L.T }); cara(j, L.T, { expr: 'smug', eyes: L.lt > .2 && L.lt < .6 ? 'wink' : 'happy', mouth: 'smirk' }); show(PACKS.JACOBS[0], SAX + 3.8, 3.4, 2.4, PI - .3, 1.4);
  orbit(V(SAX + 2, 5.6, 1.6), lerp(10, 9, L.k), PI - .3, .1, 42); sh(V(SAX + 2, 0, 1.6), 12); }, [[0, 'wink', .6]]);
// «goldene Krone,»: la corona baja girando a cámara lenta entre destellos
shot(71.69, 'Z', null, L => { salonS(L); const cr = CROWNS[2]; show(cr, SAX, 9 - L.lt * 1.6, 1.2, L.T * 2.4, 1.4); confRain(V(SAX, 6, 1.2), L.T, 20, 6, 4, 8);
  cm([SAX, 10, 7, SAX, 8.4, 1.2, 34], [SAX, 9.4, 6, SAX, 7.8, 1.2, 32], L.k); sh(V(SAX, 0, 1), 10); DOF = 1.4; }, [[0, 'sparkle', .6], [.2, 'choir', .3]]);
// «brüht nur mit Melitta.»: primer plano del chorro de agua cayendo en el filtro rojo, el café gotea en la jarra
shot(78.14, 'C', null, L => { zahnS(L); const K = KAN[1]; show(K, ZAX - 3.4, 3.6, 1.2, 0, 1); K.userData.level(clamp(.25 + L.lt * .25)); K.userData.steam(L.T, 1); show(FILT, ZAX - 3.4, 6.1, 1.2, 0, 1);
  for (let i = 0; i < 4; i++) { const d = DROP; d.visible = true; d.position.set(ZAX - 3.4, 6.0 - ((L.T * 1.6) % 1) * 2.2, 1.2); }
  cm([ZAX - 2, 8.6, 6.4, ZAX - 3.4, 6, 1.2, 34], [ZAX - 2.4, 8.2, 5.6, ZAX - 3.4, 6, 1.2, 32], L.k); sh(V(ZAX - 3, 0, 1), 10); DOF = 1.4; }, [[0, 'pour', .5], [.4, 'drip', .5]]);
// «in Dresden,»: en sepia, una calle antigua al atardecer con farolas de gas; un cartel «DRESDEN 1908»
shot(83.00, 'W', null, L => { town(L, { dusk: 1 }); grade.uniforms.sepia.value = .9; crowdAt(L, 0, 30, 6, 4, 12, 70, { mode: 'walk', gap: .8 }); badge('tag', 'DRESDEN · 1908', W / 2, H * .2, clamp(L.lt / .2), 1, 1.1);
  cm([10, 8, 70, 0, 8, 20, 46], [6, 8, 64, 0, 8, 20, 44], L.k); sh(V(0, 0, 40), 30); }, [[0, 'old_film', .5], [.2, 'horse_cart', .4]]);
// «während der Predigt.»: desde los bancos: los fieles se miran unos a otros cuando el cura sorbe por el micrófono
shot(95.73, 'C', null, L => { kircheS(L); POST.push(() => { const l = CR.filter(c => !c.root.visible); [[-11.6, 6.6], [-6.4, 6.6], [6.4, 6.6]].forEach(([x, z], i) => { const c = l[i]; sit2(c, KIX + x, z, PI, 2.5); actuar(c, 0, [[0, sitPose({ headY: (i % 2 ? .5 : -.5) })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'confused', eyes: i % 2 ? 'side_l' : 'side_r', mouth: 'o' }); }); });
  const p = put(pfarrer, KIX - 11, 9.2, -10, .5); p.blob.visible = false; drink(p, L, L.t0, .6, { pose: { aLx: 2.6, aLz: .3, aLe: .4 } }); orbit(V(KIX - 6, 6, 4), lerp(16, 14, L.k), PI + .3, .1, 44); sh(V(KIX - 6, 0, 2), 20); }, [[0, 'slurp_mic', .7], [.5, 'murmur', .4]]);
// «Wasser in seine Tasse»: primer plano de la pintura marrón cayendo del pincel en el agua de la taza
shot(102.40, 'C', 'punch', L => { town(L, { dusk: 1 }); const cu = CUPS[12]; show(cu, -37, 3, -48, 0, 1.4); cu.userData.level(.8); const d = DROP; d.visible = true; d.position.set(-37, 5.4 - ((L.T * 1.8) % 1) * 2.2, -48); d.scale.set(1.4, 2.4, 1.4);
  cm([-36, 6.6, -44.4, -37, 4.2, -48, 34], [-36.4, 6.2, -45, -37, 4.2, -48, 32], L.k); sh(V(-37, 0, -48), 10); DOF = 1.4; }, [[0, 'drip', .6], [.4, 'stir', .5]]);
// «gab es ein Problem:»: primer plano de la mesa: fajos de billetes, joyas, coronas… y una silla vacía con mi taza vacía
shot(111.78, 'C', null, L => { kuecheS(L); for (let i = 0; i < 10; i++) { const b = BILL[i]; b.visible = true; b.position.set(TB.x - 4 + (i % 5) * 1.8, 4.4 + (i / 5 | 0) * .14, -1.4 + (i % 2) * .6); b.rotation.set(-PI / 2, i * .4, 0); } show(CROWNS[0], TB.x - 2, 4.3, .8, 0, .8); show(CROWNS[1], TB.x + 1.6, 4.3, .4, 1, .8);
  const t = CUPS[6]; show(t, TB.x + 4, 4.3, 1.6, 0, .9); t.userData.level(0); cm([TB.x + 2, 9.4, 8, TB.x, 4.4, 0, 40], [TB.x + 1, 9, 7, TB.x, 4.4, 0, 38], L.k); sh(V(TB.x, 0, 0), 12); DOF = 1.2; }, [[0, 'coins', .5], [.5, 'hmm', .4]]);
// «zitterten meine Hände.»: primerísimo plano de mis manos temblando con la taza
shot(117.61, 'C', 'punch', L => { kuecheS(L); const c = put(ich, TB.x, 0, 3.4, PI + .1); actuar(c, 0, [[0, tremble(L.T, 3)]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'scared', mouth: 'grimace_wide' }); const e = ESP[0]; attach(e, c.aR.hand, [-.62, -.2, -.5], [PI / 2 + Math.sin(L.T * 55) * .2, 0, 0], 1.1);
  const w = wpos(e); cm([w.x + .6, w.y + 1.2, w.z - 3.6, w.x, w.y, w.z, 34], [w.x + .4, w.y + 1, w.z - 3, w.x, w.y, w.z, 32], L.k); sh(V(TB.x, 0, 3), 10); DOF = 1.4; }, [[0, 'cup_rattle', .8]]);
// «der Familie ohne einen Cent.»: sacudo mi hucha de cerdito: no suena nada; sale una polilla
shot(120.47, 'C', null, L => { zimmerS(L); const c = put(ich, ZIX, 0, 0, 0); actuar(c, 0, [[0, { aLx: 1.6, aRx: 1.6, aLz: -.3, aRz: -.3, aLe: .8 + Math.sin(L.T * 20) * .3, aRe: .8 + Math.sin(L.T * 20) * .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' }); const h = hp(c);
  if (ZI.pig) show(ZI.pig, h.x, h.y - 2.6 + Math.sin(L.T * 20) * .3, h.z + 1.6, 0, 1); show(MOTH, h.x + Math.sin(L.T * 3), h.y + L.lt * 2, h.z + 2, 0, .9); MOTH.children.forEach(w => { if (w.name) w.rotation.y = Math.sin(L.T * 30) * .8 * (w.name === 'w1' ? 1 : -1); });
  onBody(c, 9, 0, .1, 40, L.k, 8, 0, 4.6); sh(V(ZIX, 0, 0), 12); }, [[0, 'shake_empty', .6], [.6, 'moth', .4]]);
// «in den Keller schickte,»: la puerta del sótano se abre crujiendo: escaleras oscuras y una bombilla al fondo
shot(123.59, 'Z', null, L => { kellerS(L); KE.BL.intensity = 40; cm([KEX - 10, 13, -8, KEX - 10, 7, 4, 50], [KEX - 10, 12.4, -6.6, KEX - 10, 6, 4, 48], L.k); sh(V(KEX - 8, 0, 0), 16); }, [[0, 'door_creak', .7], [.5, 'drip_echo', .4]]);
// «Kaffeedose aus Blech.»: mi mano saca la lata de detrás de los tarros, el polvo cae
shot(127.67, 'C', null, L => { kellerS(L); const c = put(ich, DOSEP.x, 0, -6.2, PI); actuar(c, 0, [[0, { aRx: 1.5, aRe: .3, aLx: 1.2, aLe: .6, lean: .3, crouch: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); dust(DOSEP.clone().add(V(0, 1, 1)), L.t0, L.T, 10, .6);
  orbit(V(DOSEP.x, 2.6, -8), lerp(8, 7, L.k), PI + .8, .1, 40); sh(V(DOSEP.x, 0, -8), 10); }, [[0, 'tin_lift', .5], [.3, 'dust_fall', .4]]);
// «und kochte mir eine Tasse.»: la cafetera gotea dentro de la jarra en la cocina a oscuras, con un brillo dorado
shot(134.33, 'C', null, L => { kuecheS(L, { night: 1 }); const K = KAN[2]; show(K, TB.x + 1.8, 4.3, -3.4, 0, 1.2); K.userData.level(clamp(.2 + L.lt * .4)); K.userData.steam(L.T, 1); show(FILT, TB.x + 1.8, 7.1, -3.4, 0, 1.2); bloom.strength = .45;
  cm([TB.x + 3, 8.6, 3.4, TB.x + 1.8, 6, -3.4, 34], [TB.x + 2.6, 8.2, 2.6, TB.x + 1.8, 6, -3.4, 32], L.k); sh(V(TB.x, 0, -3), 10); DOF = 1.4; }, [[0, 'drip', .5], [.5, 'magic_shimmer', .4]]);
// «Kaffee meines Lebens.»: la taza en primer plano con un corazón de espuma, humo dorado subiendo
shot(137.77, 'F', null, L => { kuecheS(L, { night: 1 }); const t = MUGS.get(ich) || mugOf(ich); show(t, TB.x, 4.3, -1, L.lt * .3, 1.6); t.userData.level(.85); t.userData.steam(L.T, 1); confRain(V(TB.x, 4.3, -1), L.T, 16, 3, 3, 5); bloom.strength = .5;
  cm([TB.x, 9, 2.8, TB.x, 5.6, -1, 34], [TB.x, 8.6, 2.2, TB.x, 5.6, -1, 30], L.k); sh(V(TB.x, 0, -1), 8); DOF = 1.4; }, [[0, 'choir', .5]]);
// «noch einen Löffel.»: primer plano de la cuchara hundiéndose en el café molido que brilla
shot(140.00, 'C', 'punch', L => { kuecheS(L, { night: 1 }); show(DOSE, TB.x - 1.6, 4.3, -3.6, .3, 1.3); DOSE.userData.open(1); DOSE.userData.glow(.6); const d = wpos(DOSE); show(SPOON, d.x, d.y + 3.2 - Math.sin(clamp(L.lt / .6) * PI) * .8, d.z + .4, 0, 1.3); SPOON.rotation.x = .9;
  cm([d.x + .6, d.y + 5.6, d.z + 3.4, d.x, d.y + 2.4, d.z, 32], [d.x + .4, d.y + 5.2, d.z + 2.8, d.x, d.y + 2.4, d.z, 30], L.k); sh(d, 8); DOF = 1.4; }, [[0, 'spoon_scoop', .7]]);
// «ganze Tchibo-Filiale.»: fuera, en la plaza: la tienda Tchibo con un lazo rojo gigante y el cartel VERKAUFT; yo en la puerta haciendo una reverencia
shot(158.39, 'F', 'punch', L => { town(L, { morning: 1 }); const h = HSN('TCHIBO') || RT.HS[13]; const fx = h.x * .9, fz = h.z; const c = put(ich, fx, 0, fz - 2, h.x < 0 ? PI / 2 : -PI / 2); actuar(c, 0, [[0, { lean: .35, aRx: .4, aLx: 2.2, aLz: .5 }]], { T: L.T }); laughF(c, L.T);
  DS3.userData.draw('verkauft3', (cc, w, hh) => { cc.fillStyle = '#c8202a'; cc.fillRect(0, 0, w, hh); cc.fillStyle = '#ffffff'; cc.font = `700 110px ${FONT}`; cc.textAlign = 'center'; cc.textBaseline = 'middle'; cc.fillText('VERKAUFT!', w / 2, hh / 2 + 6); }); show(DS3, fx + (h.x < 0 ? -2 : 2), 9.5, fz, h.x < 0 ? PI / 2 : -PI / 2, .7);
  confetti(V(fx, 4, fz), L.t0, L.T, 50, 1); crowdAt(L, fx * .7, fz, 6, 5, 10, 72, { mode: 'clap', gap: 1.6 }); orbit(V(fx, 6, fz), lerp(20, 17, L.k), h.x < 0 ? PI / 2 : -PI / 2, .14, 46); sh(V(fx, 0, fz), 22); }, [[0, 'crowd_cheer', .5], [.2, 'party_horn', .5]]);
// «die Wirtschaft zusammen.»: pánico en la plaza: la gente corre, los billetes vuelan con el viento sin que nadie los recoja
shot(164.01, 'W', 'punch', L => { town(L, { dusk: 1 }); crowdAt(L, 0, 6, 14, 4, 16, 74, { mode: i => i % 3 === 2 ? 'shock' : 'run', speed: 9, gap: .3 }); billRain(V(0, 0, 6), L.T * 2.4, 90, 40, 30, 14); leaves(V(0, 0, 10), L.T * 3, 40, 40, 30, 12); SHAKE = .3;
  cm([0, 7, 34, 0, 5, 0, 48], [4, 7.5, 30, 0, 5, 0, 46], L.k); sh(V(0, 0, 6), 30); }, [[0, 'crowd_panic', .6], [.4, 'wind', .5]]);
// «plötzlich eine Million.»: primer plano de la etiqueta del Brötchen: «1.000.000 €»
shot(166.13, 'C', 'punch', L => { town(L, { morning: 1 }); show(BROT, 0, 3, 10, 0, 1.6); cm([0, 6.4, 18, 0, 4.4, 10, 36], [0, 6.2, 16.4, 0, 4.4, 10, 34], L.k); sh(V(0, 0, 10), 10); DOF = 1.4; }, [[0, 'stamp', .6], [.2, 'gasp', .4]]);
// «hundert Euro.»: un billete de 100 aterriza en la mano de la vecina dormida, que sonríe sin despertarse
shot(172.92, 'C', 'punch', L => { zimmerS(L, { night: 1 }); const c = put(CR[1], ZIX - 7, 1.6, -3.6, 0); c.root.rotation.order = 'YXZ'; c.root.rotation.set(-PI / 2 + .25, 0, 0); c.blob.visible = false; actuar(c, 0, [[0, { aRx: .9, aRz: .5, aRe: .4, headX: .3 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'smile' });
  billFall(V(ZIX - 6, 2, -3.6), L.t0, L.T, 12, 3, 2, 8); cashPop(c, '+100 €', clamp(L.lt / .2), 'green', 1.2); const h = hp(c); cm([h.x + 3, h.y + 6, h.z + 4, h.x + 1, h.y, h.z, 38], [h.x + 2.4, h.y + 5, h.z + 3.4, h.x + 1, h.y, h.z, 36], L.k); sh(V(ZIX - 6, 0, -3), 12); }, [[0, 'cash_reg', .6], [.3, 'snore', .4]]);
// «keine Minute mehr geschlafen.»: por la mañana, zombi, con ojeras enormes, me sirvo café… del revés
shot(176.22, 'W', null, L => { kuecheS(L); const c = put(ich, TB.x, 0, -6.4, 0); actuar(c, 0, [[0, { aRx: 1.3, aRe: .7, aLx: 1.0, aLe: 1.0, headX: .3, headZ: .15, lean: .1 }]], { T: L.T }); cara(c, L.T, { eyes: 'half', mouth: 'flat' }); sweat(c, L.T, 1);
  const K = KAN[2]; attach(K, c.aR.hand, [-.3, -.6, -.6], [PI / 2 + 1.2, 0, 0], .8); K.userData.level(.6); meterOf(c).userData.set('SCHLAF', '0 €', '#ff4a4a'); onBody(c, 10, -.2, .1, 42, L.k, 9, -.2, 4.4); sh(V(TB.x, 0, -6), 12); }, [[0, 'yawn', .5], [.6, 'pour', .5]]);
// «Ärmsten der Stadt.»: nuestras dos caras de pena, de cerca, con las hojas cayendo
shot(179.57, 'C', 'punch', L => { town(L, { night: 1 }); const c = sit2(ich, -16.6, -19, PI / 2, 2.4), p = sit2(pfarrer, -16.6, -21.6, PI / 2, 2.4); [c, p].forEach((x, i) => { actuar(x, 0, [[0, sitPose({ aRx: .8, aRe: 1.4, headX: .25, headY: i ? .3 : -.3 })]], { T: L.T, weight: false }); cara(x, L.T + i, { expr: 'sad', mouth: 'frown' }); }); tears(c, L.T, 0);
  leaves(V(-16, 0, -20), L.T, 16, 8, 8, 10); orbit(V(-16.6, 6, -20.3), lerp(9, 8, L.k), PI / 2, .08, 40); sh(V(-16, 0, -20), 12); }, [[0, 'sad_trombone', .5]]);
// «sie wie ein Baby.»: Oma, de cerca, sonríe dormida con burbujita de saliva; el reloj sube
shot(185.05, 'C', null, L => { kuecheS(L, { night: 1 }); const o = put(oma, OKX + 6, sitY(oma, 2.6), -5, PI / 2); o.blob.visible = false; actuar(o, 0, [[0, sitPose({ headX: .3, headZ: .3, aLx: 1.6, aLe: 2.2, aLz: -.2 })]], { T: L.T, weight: false }); cara(o, L.T, { eyes: 'closed', mouth: 'smile' }); zzz(o, L.T, 1);
  meterOf(o).userData.set('SCHLAF', '+900 €', '#9ad8ff'); onFace(o, 4.6, .4, -.4, 36, L.k); sh(V(OKX + 6, 0, -5), 12); }, [[0, 'snore', .5], [.4, 'baby_coo', .4]]);
// «in den Keller geschickt hat?»: flashback en sepia de mí bajando por primera vez las escaleras del sótano
shot(187.40, 'W', null, L => { kellerS(L); grade.uniforms.sepia.value = .8; const k = clamp(L.lt / 1.2); const c = put(ich, KEX - 10, lerp(9.8, 7.4, k), lerp(-4, -1.2, k), 0); c.blob.visible = false; actuar(c, 0, [[0, { ...walkP(L.T, 1), aRx: .8, aRe: 1.0 }]], { T: L.T }); cara(c, L.T, { expr: 'neutral' });
  orbit(V(KEX - 10, 9, -2), lerp(13, 11, L.k), .6, .05, 44); sh(V(KEX - 8, 0, -2), 16); }, [[0, 'old_film', .4], [.3, 'stairs_creak', .5]]);
// «mich schon wieder»: primer plano de mi cara de terror, me tiembla el labio
shot(191.27, 'C', 'punch', L => { kuecheS(L, { night: 1 }); const c = put(ich, TB.x + 11, 0, 4, -PI / 2 - .4); actuar(c, 0, [[0, { ...GEST.shock, headZ: Math.sin(L.T * 30) * .03 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'scared', mouth: 'grimace_wide' }); sweat(c, L.T, 3);
  onFace(c, 4.4, .3, .3, 36, L.k); sh(V(TB.x + 11, 0, 4), 10); }, [[0, 'gulp_nervous', .6], [.3, 'heartbeat', .5]]);


// ---------- transiciones, sonidos, render ----------
S.sort((a, b) => a.t0 - b.t0); for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
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
  for (const f of FX2D) f(octx); for (const b of BAD_) drawBadge(b); if (HUD) drawHUD(octx, W / 2, H * .085, 1.05, HUD.n, HUD.e, HUD.col, HUD.a ?? 1); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { applyPose, hp, ich, drink, tasse, attach, OK, RT, renderer, composer, bloom, sun, grade, scene, camera };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

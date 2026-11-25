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
function resetProps() { DOSE.userData.open(0); DOSE.userData.glow(0); DOSE.userData.pow.scale.y = .32; KE.D.userData.open(0); KE.D.userData.glow(0); KE.BL.intensity = 90; SCHIFF.position.y = 0; STACK.count = 64;
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
//@@PLANOS@@

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
  for (const f of FX2D) f(octx); for (const b of BAD_) drawBadge(b); if (HUD) drawHUD(octx, W / 2, H * .085, 1.05, HUD.n, HUD.e, HUD.col, HUD.a ?? 1); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { applyPose, hp, ich, drink, tasse, attach, OK, RT, renderer, composer, bloom, sun, grade, scene, camera };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

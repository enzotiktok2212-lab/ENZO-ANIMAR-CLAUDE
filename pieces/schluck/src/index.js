// SCHLUCK — «In dieser Stadt bekommst du jedes Mal Geld, wenn du ein Bier trinkst»: 1 Bier = 20 €, 5 = 600 €, 20 = Millionär, 500 = Trillionär.
// Felix (el estómago más pequeño de la ciudad) encuentra un goldener Krug que se rellena solo… y el Schluckauf acaba siendo la nueva moneda.
// Ciudad propia: Brauheim (pueblo alpino de entramado con Biergarten en la plaza). Planos en src/p/*.js; armar.py los une en src/index.js.
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { makeExtra } from './ecast.js';
import { lindenthal, sportplatz } from './nsets.js';
import { zelle, polizei } from './gsets.js';
import { taxi } from './gort.js';
import { sportsCar } from './pech.js';
import { mass, bottle, crate, deckel, fass, goldKrug, neckMeter, drawHUD, money, euro, nBier } from './bier.js';
import { biergarten, bierzelt, bueroLeer, regal, kloster, sudhaus, seeVilla, amtsstube, ministerium, gericht, altBrauerei, brauKeller, zimmerF, bankBuero, flood, sign, glowM, lights } from './bwelt.js';
import { makeFelix, makeHuber, makeResi, makeBrandl, makeKranzl, makeSchummler, makeMoench, makeBanker, makeBeamter, makeRichterin, makeTracht } from './bvolk.js';
import { makeCop } from './gcast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 168.0, U = W / 720;
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
// Biergarten centrado en (0, 0, 22): Ausschank en (0, -12) mirando +z, mesas en z ∈ {2, 15, 28} y x = ±14 (largo 12, bancos a z ± 2,3), castaños.
const LT = lindenthal(scene, { name: 'BRAUHEIM', shops: { 2: 'GETRÄNKEMARKT', 5: 'GASTHOF ADLER', 9: 'BANK', 12: 'METZGEREI' } });
const BG = biergarten(scene, 0, 22); BG.g.visible = false;
const BZX = 1400, BUX = 2200, RGX = 3000, KLX = 3800, SUX = 4600, SVX = 5400, AMX = 6200, MIX = 7000, GEX = 7800, ABX = 8600, KEX = 9400, ZIX = 10200, BKX = 11000, SPX = 11800, ZEX = 12600;
const BZ = bierzelt(scene, BZX), BU = bueroLeer(scene, BUX), RG = regal(scene, RGX), KL = kloster(scene, KLX), SU = sudhaus(scene, SUX), SV = seeVilla(scene, SVX), AM = amtsstube(scene, AMX), MI = ministerium(scene, MIX), GE = gericht(scene, GEX), AB = altBrauerei(scene, ABX), KE = brauKeller(scene, KEX), ZI = zimmerF(scene, ZIX), BK = bankBuero(scene, BKX), SP = sportplatz(scene, SPX), ZE = zelle(scene, ZEX);
const SETS = { LT: LT.g, BZ: BZ.g, BU: BU.g, RG: RG.g, KL: KL.g, SU: SU.g, SV: SV.g, AM: AM.g, MI: MI.g, GE: GE.g, AB: AB.g, KE: KE.g, ZI: ZI.g, BK: BK.g, SP: SP.g, ZE: ZE.g };
for (const k in SETS) outline(SETS[k], OS); outline(BG.g, OS);
const GMP = LT.HS[2].position.clone(), BANKP = LT.HS[9].position.clone();   // Getränkemarkt (x = -52) y banco (x = +52)
// cajas apiladas delante del Getränkemarkt
const STACK = new THREE.Group(); scene.add(STACK); for (let i = 0; i < 9; i++) { const c = crate(STACK, ['WEIHENSTEPHANER', 'PAULANER'][i % 2], { bottles: i > 5 }); c.position.set((i % 3) * 3.8 - 3.8, Math.floor(i / 3) * 1.65, 0); }
STACK.position.set(GMP.x + 12, 0, GMP.z + 11); STACK.rotation.y = Math.PI / 2;
{ const s = sign('GETRÄNKEMARKT', 16, 2.6, '#d8202a', '#ffffff', '#ffffff', .62); s.position.set(GMP.x + 9.4, 9.6, GMP.z); s.rotation.y = Math.PI / 2; scene.add(s); }
// ---------- reparto ----------
const felix = makeFelix(scene), huber = makeHuber(scene), resi = makeResi(scene), brandl = makeBrandl(scene), kranzl = makeKranzl(scene), schum = makeSchummler(scene), moench = makeMoench(scene), banker = makeBanker(scene), rich = makeRichterin(scene);
const BEA = [0, 1, 2].map(i => makeBeamter(scene, i)), COPS = [0, 1].map(i => makeCop(scene, i));
kitFace(felix, 'hero'); [huber, resi, rich].forEach(c => kitFace(c, 'girl')); [brandl, kranzl].forEach(c => kitFace(c, 'mustache')); [schum, moench, banker, ...BEA, ...COPS].forEach(c => kitFace(c, 'plain'));
const EX = Array.from({ length: 22 }, (_, i) => makeExtra(scene, i + 40)); EX.forEach((c, i) => kitFace(c, ['girl', 'plain', 'girl', 'hero', 'girl', 'mustache'][i % 6]));
const TR = Array.from({ length: 20 }, (_, i) => makeTracht(scene, i)); TR.forEach((c, i) => kitFace(c, i % 2 ? 'girl' : ['plain', 'mustache', 'hero'][(i / 2 | 0) % 3]));
const CR = []; for (let i = 0; i < 22; i++) { if (TR[i]) CR.push(TR[i]); CR.push(EX[i]); }
const MAIN = [felix, huber, resi, brandl, kranzl, schum, moench, banker, rich, ...BEA, ...COPS];
const POOL = [...MAIN, ...EX, ...TR];
POOL.forEach(c => outline(c.root, OC));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(.5, 'rgba(0,0,0,.26)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -Math.PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const PROPS = [];
const P_ = o => { if (!o.parent) scene.add(o); PROPS.push(o); return o; };
const METERS = new Map(); const meterOf = ch => { let m = METERS.get(ch); if (!m) { m = neckMeter(ch); METERS.set(ch, m); } m.visible = true; return m; };
const MUGS = new Map(); const mugOf = ch => { let m = MUGS.get(ch); if (!m) { m = P_(mass(scene)); MUGS.set(ch, m); } return m; };
const GK2 = P_(goldKrug(scene)); GK2.traverse(o => { if (o.isMesh) o.castShadow = true; });
const BW = P_(bottle(scene, 'WEIHENSTEPHANER')), BW2 = P_(bottle(scene, 'WEIHENSTEPHANER')), BP = P_(bottle(scene, 'PAULANER'));
// Apfelschorle: botella verde clara con etiqueta de manzana; lata de cerveza barata
const APF = P_(new THREE.Group()); { const gm = mat(0x9ad86a, { roughness: .08, transparent: true, opacity: .8 }); cyl(.38, .38, 1.6, gm, 20, APF, 0, .8, 0); cyl(.14, .38, .5, gm, 20, APF, 0, 1.85, 0); cyl(.14, .14, .5, gm, 14, APF, 0, 2.3, 0); cyl(.16, .16, .1, mat(0x2a8a2a), 14, APF, 0, 2.6, 0);
  const lab = textPlane(.9, .8, 180, 160, (c, w, h) => { c.fillStyle = '#fff8e0'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8202a'; c.beginPath(); c.arc(w / 2, 62, 34, 0, 7); c.fill(); c.fillStyle = '#3a8a2a'; c.fillRect(w / 2 - 3, 20, 6, 16); c.fillStyle = '#2a6a1a'; c.font = `700 26px ${FONT}`; c.textAlign = 'center'; c.fillText('APFEL-', w / 2, 122); c.fillText('SCHORLE', w / 2, 148); }); lab.position.set(0, .85, .39); APF.add(lab); }
const CAN = P_(new THREE.Group()); { cyl(.42, .42, 1.3, mat(0xb8bcc4, { metalness: .9, roughness: .3 }), 20, CAN, 0, .65, 0); const lab = textPlane(.8, .7, 160, 140, (c, w, h) => { c.fillStyle = '#c8c8c0'; c.fillRect(0, 0, w, h); c.fillStyle = '#6a6a6a'; c.font = `700 30px ${FONT}`; c.textAlign = 'center'; c.fillText('BILLIG', w / 2, 60); c.fillText('BIER', w / 2, 100); }); lab.position.set(0, .65, .43); CAN.add(lab); }
const DECK = P_(deckel(scene, { s: 1.6, text: 'PROST!' })), DECK2 = P_(deckel(scene, { s: 1.6, text: 'PROST!', col: '#c8202a' }));
const KRUG = Array.from({ length: 12 }, () => P_(mass(scene)));   // jarras sueltas (mesas, torres, bandejas)
const FASS = Array.from({ length: 4 }, () => P_(fass(scene, { s: .8, open: true })));
const PADDLE = Array.from({ length: 4 }, () => { const g = P_(new THREE.Group()); scene.add(g); cyl(.1, .1, 5, mat(0x8a5a32), 6, g, 0, 0, 0); box(.9, 1.4, .12, mat(0x8a5a32), .05, g, 0, -2.6, 0); return g; });
const CAR1 = P_(taxi(scene)), CAR2 = P_(sportsCar(scene)), POL = P_(polizei(scene));
// pizarra de la regla en la plaza (pantalla grande con marco de madera y tejadillo)
const TAFEL = new THREE.Group(); scene.add(TAFEL); { const wd = mat(0x6a4224, { roughness: .7 }); for (const s of [-1, 1]) cyl(.5, .6, 22, wd, 10, TAFEL, s * 11, 11, 0); box(24, 14, 1, wd, .2, TAFEL, 0, 15, 0); const rf = box(26, .8, 3, mat(0x8a2a2a), .1, TAFEL, 0, 22.6, 0); }
const TCV = document.createElement('canvas'); TCV.width = 1024; TCV.height = 576; const TTX = new THREE.CanvasTexture(TCV); TTX.colorSpace = THREE.SRGBColorSpace; { const s = new THREE.Mesh(new THREE.PlaneGeometry(22, 12.4), new THREE.MeshBasicMaterial({ map: TTX, toneMapped: false })); s.position.set(0, 15, .55); TAFEL.add(s); }
TAFEL.userData.draw = fn => { const c = TCV.getContext('2d'); c.clearRect(0, 0, 1024, 576); fn(c, 1024, 576); TTX.needsUpdate = true; }; TAFEL.visible = false;
// placa de la leyenda en el Maibaum
const PLAQ = new THREE.Group(); scene.add(PLAQ); { const p = textPlane(9, 6.2, 450, 310, (c, w, h) => { c.fillStyle = '#5a3418'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8a020'; c.lineWidth = 10; c.strokeRect(10, 10, w - 20, h - 20); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffd860'; c.font = `700 56px ${FONT}`; c.fillText('LEGENDE', w / 2, 62);
  c.fillStyle = '#ffffff'; c.font = `700 36px ${FONT}`; c.fillText('WER 500 BIER', w / 2, 132); c.fillText('SCHAFFT, WIRD', w / 2, 178); c.fillStyle = '#ffd860'; c.font = `700 46px ${FONT}`; c.fillText('TRILLIONÄR', w / 2, 232); c.fillStyle = '#d8b090'; c.font = `700 24px ${FONT}`; c.fillText('REKORD: —', w / 2, 278); }); p.position.z = .32; PLAQ.add(p); box(9.6, 6.8, .5, mat(0x3a2412), .1, PLAQ, 0, 0, 0); }
PLAQ.position.set(18, 9, -12.9); PLAQ.visible = false;
// torre de 500 jarras (instanciada) para la leyenda
const TOWER = new THREE.Group(); scene.add(TOWER); { const n = 500; const geoB = new THREE.CylinderGeometry(.46, .44, 1.1, 14); const geoF = new THREE.CylinderGeometry(.48, .48, .3, 14);
  const IB = new THREE.InstancedMesh(geoB, mat(0xf6a81c, { roughness: .15, emissive: 0x6a3800, emissiveIntensity: .35 }), n), IF = new THREE.InstancedMesh(geoF, mat(0xfffbf0, { roughness: .9 }), n); const o = new THREE.Object3D();
  for (let i = 0; i < n; i++) { const lv = Math.floor(i / 6), a = (i % 6) / 6 * 6.283 + lv * .5; o.position.set(Math.cos(a) * 1.2, lv * 1.45 + .55, Math.sin(a) * 1.2); o.rotation.set(0, a, 0); o.updateMatrix(); IB.setMatrixAt(i, o.matrix); o.position.y += .7; o.updateMatrix(); IF.setMatrixAt(i, o.matrix); }
  IB.castShadow = IF.castShadow = true; TOWER.add(IB, IF); TOWER.userData = { IB, IF, n }; } P_(TOWER);
// montaña de oro (monedas instanciadas) con corona
const GOLDM = new THREE.Group(); scene.add(GOLDM); { const n = 900; const IC = new THREE.InstancedMesh(new THREE.CylinderGeometry(.7, .7, .16, 16), new THREE.MeshStandardMaterial({ color: 0xffd23f, metalness: .95, roughness: .22, emissive: 0x6a4a00, emissiveIntensity: .35 }), n); const o = new THREE.Object3D(); const r = RNG(4);
  for (let i = 0; i < n; i++) { const rr = Math.sqrt(r()) * 14, a = r() * 6.283, y = Math.max(0, (1 - rr / 14) * 11 + (r() - .5) * .6); o.position.set(Math.cos(a) * rr, y, Math.sin(a) * rr); o.rotation.set((r() - .5) * 1.2, r() * 6, (r() - .5) * 1.2); o.updateMatrix(); IC.setMatrixAt(i, o.matrix); } IC.castShadow = true; IC.receiveShadow = true; GOLDM.add(IC);
  for (let k = 0; k < 6; k++) { const b = box(2.6, .9, 1.2, new THREE.MeshStandardMaterial({ color: 0xffc830, metalness: .95, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .3 }), .1, GOLDM, Math.cos(k) * 9, 3.5 - (k % 3), Math.sin(k * 1.3) * 9); b.rotation.y = k; } } P_(GOLDM);
// billetes (20, 50, 100, 500) y monedas
const BILLT = {}; for (const [d, col] of [[20, '#3a7ad8'], [50, '#f08a2a'], [100, '#3aa85a'], [500, '#8a4ad8']]) BILLT[d] = canvasTex(256, 128, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(10, 10, w - 20, h - 20); c.fillStyle = col; c.beginPath(); c.arc(w * .7, h / 2, 40, 0, 7); c.fill(); c.fillStyle = '#ffffff'; c.font = `700 64px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(d), w * .3, h / 2 + 4); c.font = `700 40px ${FONT}`; c.fillText('€', w * .7, h / 2 + 3); c.strokeStyle = '#ffffff'; c.lineWidth = 5; c.strokeRect(4, 4, w - 8, h - 8); });
const BILL = Array.from({ length: 110 }, (_, i) => { const d = [20, 50, 100, 500][i % 4]; const m = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshStandardMaterial({ map: BILLT[d], side: THREE.DoubleSide, roughness: .7 })); m.castShadow = true; scene.add(m); m.userData.d = d; return P_(m); });
const COIN = Array.from({ length: 30 }, () => { const m = cyl(.5, .5, .12, mat(0xffd23f, { metalness: .9, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .3 }), 18, scene); m.rotation.x = Math.PI / 2; return P_(m); });
// teléfono con pantalla dibujable
const PHONE = P_(new THREE.Group()); scene.add(PHONE); { box(1.1, 2.1, .16, mat(0x1a1a22, { metalness: .6, roughness: .3 }), .12, PHONE, 0, 0, 0); }
const PCV = document.createElement('canvas'); PCV.width = 300; PCV.height = 560; const PTX = new THREE.CanvasTexture(PCV); PTX.colorSpace = THREE.SRGBColorSpace; { const s = new THREE.Mesh(new THREE.PlaneGeometry(.98, 1.9), new THREE.MeshBasicMaterial({ map: PTX, toneMapped: false })); s.position.z = .085; PHONE.add(s); }
PHONE.userData.draw = fn => { const c = PCV.getContext('2d'); c.fillStyle = '#0e1420'; c.fillRect(0, 0, 300, 560); fn(c, 300, 560); PTX.needsUpdate = true; };
// carteles dinámicos (canvas)
function dynSign(w, h, pw, ph) { const g = P_(new THREE.Group()); scene.add(g); const cv = document.createElement('canvas'); cv.width = pw; cv.height = ph; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, roughness: .6, transparent: true })); g.add(m); let key = null;
  g.userData.draw = (k, fn) => { if (k === key) return; key = k; const c = cv.getContext('2d'); c.clearRect(0, 0, pw, ph); fn(c, pw, ph); t.needsUpdate = true; }; return g; }
const DS1 = dynSign(10, 6, 500, 300), DS2 = dynSign(10, 6, 500, 300), DS3 = dynSign(14, 3, 700, 150);
// cartera vacía con polilla
const WALLET = P_(new THREE.Group()); scene.add(WALLET); { const l = mat(0x6a3a1a, { roughness: .6 }); const a = box(2.2, .14, 1.6, l, .06, WALLET, -1.1, 0, 0); const b = box(2.2, .14, 1.6, l, .06, WALLET, 1.1, .3, 0); b.rotation.z = -.3; box(2, .02, 1.4, mat(0x2a1a10), 0, WALLET, -1.1, .08, 0); }
const MOTH = P_(new THREE.Group()); scene.add(MOTH); { const wm = mat(0xc8c0b0, { roughness: 1, side: THREE.DoubleSide }); for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.CircleGeometry(.4, 8), wm); w.position.x = s * .35; w.name = 'w' + s; MOTH.add(w); } box(.12, .12, .5, mat(0x6a6050), .05, MOTH, 0, 0, 0); }
// balanza (Euro contra Bierdeckel)
const WAAGE = P_(new THREE.Group()); scene.add(WAAGE); { const gm = mat(0xd8a020, { metalness: .9, roughness: .25 }); cyl(1.4, 1.8, .6, gm, 20, WAAGE, 0, .3, 0); cyl(.25, .25, 8, gm, 10, WAAGE, 0, 4.3, 0); const beam = new THREE.Group(); beam.position.y = 8.3; WAAGE.add(beam); box(12, .3, .3, gm, .05, beam, 0, 0, 0);
  for (const s of [-1, 1]) { const pan = new THREE.Group(); pan.position.x = s * 5.6; beam.add(pan); for (let k = 0; k < 3; k++) { const a = k / 3 * 6.283; const ch = cyl(.04, .04, 3.4, gm, 4, pan, Math.cos(a) * .9, -1.7, Math.sin(a) * .9); ch.rotation.set(Math.sin(a) * .25, 0, -Math.cos(a) * .25); } cyl(1.8, 1.4, .3, gm, 20, pan, 0, -3.4, 0); pan.name = 'pan' + s; }
  WAAGE.userData = { beam, set(a) { beam.rotation.z = a; beam.children.forEach(p => { if (p.name) p.rotation.z = -a; }); } }; }
// espuma suelta (rebose, chorro de la fuente) y gotas de hipo
const FOAMP = Array.from({ length: 40 }, () => P_(sphere(1, mat(0xfffbf0, { roughness: .9, emissive: 0x302a20, emissiveIntensity: .2 }), scene, 0, 0, 0, 10, 8)));
const FLOOD = flood(scene); FLOOD.visible = false;
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xffd23f, 0xffffff, 0x3a7ad8, 0xff4a8a, 0x8ad84a][i % 5], side: THREE.DoubleSide })); scene.add(p); return P_(p); });
const DUST = Array.from({ length: 16 }, () => P_(sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8)));
const SWEAT = Array.from({ length: 3 }, () => P_(sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const TEAR = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8)));
const HALO = P_(new THREE.Mesh(new THREE.TorusGeometry(1.2, .12, 10, 32), glowM(0xffe08a, 2.4))); HALO.rotation.x = Math.PI / 2; scene.add(HALO);
const CUFFS = P_(new THREE.Group()); scene.add(CUFFS); for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.32, .07, 8, 18), mat(0xd8dce4, { metalness: .9, roughness: .2 })); r.position.x = s * .45; CUFFS.add(r); } box(.5, .06, .06, mat(0xd8dce4, { metalness: .9 }), 0, CUFFS, 0, 0, 0);
const KEYS = P_(new THREE.Group()); scene.add(KEYS); { const r = new THREE.Mesh(new THREE.TorusGeometry(.3, .06, 6, 16), mat(0xd8a020, { metalness: .9 })); KEYS.add(r); for (let k = 0; k < 2; k++) { const b = box(.14, .9, .06, mat(0xd8a020, { metalness: .9 }), .02, KEYS, -.2 + k * .4, -.6, 0); b.rotation.z = (k - .5) * .5; } }
const FLASH = P_(new THREE.Group()); scene.add(FLASH); { cyl(.22, .26, 1.4, mat(0x2a2a30, { metalness: .6 }), 12, FLASH, 0, 0, 0); const lens = cyl(.3, .3, .1, glowM(0xfff4c0, 3), 14, FLASH, 0, .75, 0); }
const FLASHL = new THREE.SpotLight(0xfff0c8, 0, 70, .38, .5, 1.2); scene.add(FLASHL, FLASHL.target);
const GAVEL = GE.GAV;
const SBAN = sign('NEUER BESITZER: HERR BRANDL', 26, 3.2, '#ffd23f', '#1a3a8a', '#1a3a8a', .55); scene.add(SBAN); P_(SBAN);

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
  for (const k in SETS) SETS[k].visible = false; for (const m of METERS.values()) m.visible = false; FLOOD.visible = false; BG.g.visible = false; TAFEL.visible = false; PLAQ.visible = false; HUD = null; FX2D.length = 0; FACES.length = 0; FLASHL.intensity = 0; RG.SPOT.intensity = 0;
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
function town(L, o = {}) { use('LT'); if (o.night) { night(30); renderer.toneMappingExposure = .9; TINT = 'rgba(10,16,60,.18)'; } else if (o.dusk) dusk(); else day(); if (o.bg !== false) BG.g.visible = true; }
function zelt(L) { use('BZ'); inside(1.05, 45); FILL.color.setRGB(1, .9, .76); }
function bueroS(L) { use('BU'); inside(.95, 34); }
function regalS(L, spot = 0) { use('RG'); inside(1.0, 40); RG.SPOT.intensity = spot; }
function klosterS(L) { use('KL'); day(); }
function sudS(L) { use('SU'); inside(1.0, 42); FILL.color.setRGB(1, .9, .78); }
function seeS(L) { use('SV'); day(); }
function amtS(L) { use('AM'); inside(.95, 38); FILL.color.setRGB(1, .92, .82); }
function minS(L) { use('MI'); inside(1.0, 40); }
function gerS(L) { use('GE'); inside(1.0, 40); }
function altS(L) { use('AB'); night(22); renderer.toneMappingExposure = .9; TINT = 'rgba(10,16,60,.2)'; }
function kellerS(L, lamp = 1) { use('KE'); inside(.3, 6); FILL.color.setRGB(1, .82, .56); renderer.toneMappingExposure = .78; FLASHL.intensity = 0; bloom.strength = .3; }
function zimmerS(L, o = {}) { use('ZI'); if (o.night) { inside(.6, 22); ZI.WP.material.color.setRGB(.06, .08, .22); FILL.color.setRGB(1, .86, .66); } else { inside(.95, 36); ZI.WP.material.color.setRGB(.55, .8, 1); } }
function bankS(L) { use('BK'); inside(1.0, 40); }
function sportS(L) { use('SP'); day(); }
function zelleS(L) { use('ZE'); inside(.85, 30); renderer.toneMappingExposure = .85; }
// ---------- beber ----------
// poses del brazo derecho (ajustadas con lab/fit.js: el borde de la jarra toca la boca, la mano no entra en la cabeza)
const HOLD = { aRx: .35, aRz: .42, aRe: 1.22 }, HOLDY = .5, CHUG = { aRx: 2.83, aRz: -.323, aRe: .414 }, CHUGY = -.581, SIPP = { aRx: 2.3, aRz: -.38, aRe: .407 }, SIPY = -.362, PRO = { aRx: 2.6, aRz: .25, aRe: .35 };
function holdMug(ch, kind = 'mass') { if (kind === 'none') return null; if (kind === 'gold') { attach(GK2, ch.aR.hand, [-.86, -.2, -.66], [PI / 2, 0, 0], .78); return GK2; } const m = mugOf(ch); attach(m, ch.aR.hand, [-.84, -.2, -.72], [PI / 2, 0, 0], 1); return m; }
// un trago: sube la jarra (up), bebe (dur) con la cabeza hacia atrás, la baja (dn) y queda satisfecho
function drink(ch, L, t0, dur, o = {}) { const lt = L.T - t0, up = o.up ?? .3, dn = o.dn ?? .3; let k = 0, ph = 'pre';
  if (lt < 0) ph = 'pre'; else if (lt < up) { k = easeInOut(lt / up); ph = 'up'; } else if (lt < up + dur) { k = 1; ph = 'drink'; } else if (lt < up + dur + dn) { k = 1 - easeInOut((lt - up - dur) / dn); ph = 'down'; } else ph = 'after';
  const A = o.sip ? SIPP : CHUG, AY = o.sip ? SIPY : CHUGY, hx = o.sip ? -.22 : -.42; const bob = ph === 'drink' ? Math.sin(L.T * 10 + ch.seed) * .025 : 0; const b = o.pose || {};
  const pose = { ...b, aRx: lerp(HOLD.aRx, A.aRx, k) + bob, aRz: lerp(HOLD.aRz, A.aRz, k), aRe: lerp(HOLD.aRe, A.aRe, k), headX: (b.headX || 0) + hx * k + bob, lean: (b.lean || 0) - .06 * k };
  actuar(ch, 0, [[0, pose]], { T: L.T, weight: !o.sit }); ch.aR.sh.rotation.y = lerp(HOLDY, AY, k);
  const m = holdMug(ch, o.kind); const l0 = o.l0 ?? 1, l1 = o.l1 ?? .12;
  if (m && m.userData.level) m.userData.level(ph === 'pre' || ph === 'up' ? l0 : ph === 'drink' ? lerp(l0, l1, clamp((lt - up) / dur)) : l1, L.T);
  if (o.meter) meterOf(ch);
  const ex = o.expr || 'neutral'; if (ph === 'drink') cara(ch, L.T, { expr: ex, eyes: o.eyesD || 'closed', mouth: 'o' }); else if (ph === 'after' || (ph === 'down' && k < .5)) cara(ch, L.T, { expr: o.after || 'joy', mouth: o.afterMouth || 'open_smile' }); else cara(ch, L.T, { expr: ex, mouth: o.mouth });
  if (!o.bg) FACES.push(ch); return { ph, k, lt, up, dur, dn, end: up + dur }; }
// bebe en bucle (gente de fondo), desfasado por personaje
function drinkLoop(ch, L, i = 0, o = {}) { const per = o.per ?? 3.4, d = o.d ?? (1 + (i % 3) * .3), off = (i * 1.37) % per; const t0 = Math.floor((L.T + off) / per) * per - off; return drink(ch, L, t0, d, { bg: true, l0: .95, l1: .35, up: .3, dn: .3, expr: 'happy', ...o }); }
// jarra en alto (brindis) o sujeta (k = 0)
function prost(ch, L, k = 1, o = {}) { const b = o.pose || {}; const pose = { ...b, aRx: lerp(HOLD.aRx, PRO.aRx, k), aRz: lerp(HOLD.aRz, PRO.aRz, k), aRe: lerp(HOLD.aRe, PRO.aRe, k) }; actuar(ch, 0, [[0, pose]], { T: L.T, weight: !o.sit }); ch.aR.sh.rotation.y = lerp(HOLDY, 0, k);
  const m = holdMug(ch, o.kind); if (m) { m.rotation.x = PI - (pose.aRx + pose.aRe); if (m.userData.level) m.userData.level(o.level ?? .9, L.T); } if (o.meter) meterOf(ch); return m; }
const holdOnly = (ch, L, o = {}) => prost(ch, L, 0, o);
// modos extra de la multitud (crowdAt): drink, prost, sitdrink, sitprost, sithold
function crowdDrink(c, x, z, L, i, o, m) { const T = L.T + i * .37; const seat = o.seat ?? 2.7;
  if (m === 'drink') drinkLoop(c, L, i, { meter: o.meter });
  else if (m === 'prost') { const j = Math.abs(Math.sin(L.T * 6 + i)); prost(c, L, .75 + j * .25, { pose: { aLx: .4 + j * .3, aLz: .3, aLe: .4, crouch: j * .05 }, meter: o.meter }); laughF(c, T); }
  else { c.root.position.y = sitY(c, seat); c.blob.visible = false; const sp = sitPose({ aLx: .5, aLe: 1.2, aLz: -.1 });
    if (m === 'sitdrink') drinkLoop(c, L, i, { sit: true, pose: sp, meter: o.meter });
    else if (m === 'sitprost') { const j = Math.abs(Math.sin(L.T * 6 + i)); prost(c, L, .7 + j * .3, { sit: true, pose: { ...sp, aLx: 2.4, aLz: .4 + j * .2, aLe: .3 } }); laughF(c, T); }
    else { holdOnly(c, L, { sit: true, pose: { ...sp, headY: Math.sin(L.T * .9 + i) * .3 } }); cara(c, T, { expr: 'happy', mouth: Math.sin(L.T * 7 + i) > .3 ? 'talk' : 'smile' }); } } }
// gente sentada en las mesas del Biergarten: mesa t (0..5) lado s (-1 delante, +1 detrás), n personas
function tableFolk(L, t, s, n, mode = 'sitdrink', from = 0, o = {}) { const T_ = [[-14, 2], [14, 2], [-14, 15], [14, 15], [-14, 28], [14, 28]][t]; const cx = T_[0], cz = T_[1] + 22;
  POST.push(() => { const list = (o.list || CR).filter(c => !c.root.visible).slice(from, from + n); list.forEach((c, i) => { const x = cx - (n - 1) * 1.6 + i * 3.2 + (o.dx || 0); const z = cz + s * 2.3; put(c, x, 0, z, s < 0 ? 0 : PI); crowdDrink(c, x, z, L, i + t * 3, o, typeof mode === 'function' ? mode(i) : mode); }); }); }
// jarras sobre las mesas (llenas o vacías)
function tableMugs(t, n = 4, lvl = .9) { const T_ = [[-14, 2], [14, 2], [-14, 15], [14, 15], [-14, 28], [14, 28]][t]; for (let i = 0; i < n; i++) { const m = KRUG[(t * 2 + i) % KRUG.length]; if (m.visible) continue; show(m, T_[0] - 4 + i * 2.7, 4.15, T_[1] + 22 + (i % 2 ? .6 : -.6), i, 1); m.userData.level(lvl, 0); } }
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
const setHUD = (n, col, a = 1) => { n = Math.floor(n + 1e-6); HUD = { n: nBier(n) + ' Bier', e: euro(money(n)), col: col || '#7aff9a', a }; };
// nada tapa la cara de un protagonista: billetes y espuma delante de la cara se apartan
function clearFaces() { if (!FACES.length) return; camera.updateMatrixWorld(); camera.updateProjectionMatrix();
  const F = FACES.filter(c => c.root.visible).map(c => { const h = hp(c).add(V(0, .65 * (c.spec.scale || 1), 0)); const p = h.clone().project(camera); const d = camera.position.distanceTo(h); const r = 1.25 * (c.spec.scale || 1) / (d * Math.tan(camera.fov * PI / 360)); return { p, d, r }; });
  for (const b of [...BILL, ...FOAMP]) { if (!b.visible) continue; const q = b.position.clone().project(camera); const dc = camera.position.distanceTo(b.position); for (const f of F) { if (dc > f.d + .5) continue; if (Math.hypot((q.x - f.p.x) * W / H, q.y - f.p.y) < f.r * 1.15) { b.visible = false; break; } } } }
// ---------- hipo, espuma, fuente ----------
// burbuja de cómic «HICKS!» junto a la cabeza
function hicks(ch, k, sc = 1, side = 1) { if (k <= 0) return; FX2D.push(c => { const [x, y, z] = proj(hp(ch).add(V(0, 1.6 * (ch.spec.scale || 1), 0))); if (z >= 1) return; const s = spring(clamp(k) * 1.4) * sc * U; c.save(); c.translate(clamp(x + side * 150 * U, 160, W - 160), clamp(y - 60, 140, H * .62)); c.scale(s, s); c.rotate(side * -.12);
  c.beginPath(); for (let i = 0; i < 22; i++) { const a = i / 22 * 6.283, rr = i % 2 ? 96 : 130; c.lineTo(Math.cos(a) * rr * 1.25, Math.sin(a) * rr * .8); } c.closePath(); c.fillStyle = '#ffd23f'; c.fill(); c.lineWidth = 9; c.strokeStyle = '#1a1a1a'; c.stroke();
  c.font = `700 64px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 14; c.strokeStyle = '#1a1a1a'; c.strokeText('HICKS!', 0, 4); c.fillStyle = '#ff3a3a'; c.fillText('HICKS!', 0, 4); c.restore(); }); }
// sacudida del hipo: hombros arriba, cabeza atrás, pequeño salto, en los instantes ts (tiempos absolutos)
function hipPose(T, ts) { let j = 0; for (const t of ts) { const d = T - t; if (d >= 0 && d < .35) j = Math.max(j, Math.sin(d / .35 * PI)); } return j; }
// espuma que rebosa y cae alrededor de c (radio r)
function foamOver(c, T, n = 24, r = 1, h = 2) { FOAMP.forEach((s, i) => { if (i >= n) return; const rr = RNG(i * 13 + 3), t = (T * (.5 + rr() * .5) + rr()) % 1, a = rr() * 6.283; s.visible = true; s.position.set(c.x + Math.cos(a) * r * (1 + t * .6), c.y + h * (1 - t * t) + t * .3, c.z + Math.sin(a) * r * (1 + t * .6)); s.scale.setScalar((.25 + rr() * .3) * (1 - t * .4) * r); }); }
// chorro de cerveza de la fuente: bolas de espuma y cerveza en parábolas
function jet(c, T, n = 36, h = 14, spread = 5) { FOAMP.forEach((s, i) => { if (i >= n) return; const rr = RNG(i * 7 + 1), t = (T * .9 + rr()) % 1, a = rr() * 6.283; s.visible = true; s.position.set(c.x + Math.cos(a) * spread * t, c.y + h * 4 * t * (1 - t) + 2, c.z + Math.sin(a) * spread * t); s.scale.setScalar(.5 + rr() * .6); }); }
// polvo de luz en un haz (sótano)
function beam(L, c, T) { DUST.forEach((d, i) => { const r = RNG(i * 9 + 2); d.visible = true; d.position.set(c.x + (r() - .5) * 3 + Math.sin(T * .4 + i) * .3, c.y + ((T * .15 + r()) % 1) * 10, c.z + (r() - .5) * 3); d.scale.setScalar(.06 + r() * .06); d.material.opacity = .6; }); }
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
const KEY = /^(Stadt|Geld|Bier|Euro|Millionär|Glückwunsch|Legende|500|Trillionär|nie|verdient|Beruf|Büros|leer|Biergarten|Konto|zählt|echtes|gutes|allerbeste|Weihenstephaner|ältesten|Brauerei|1040|doppelt|Schlange|Oktoberfest|Villa|Geheimtipp|Paulaner|süffig|reich|Sportlehrer|Fußballverein|Bürgermeister|12|Wasser|halbe|Vorsicht|Regierung|Bierzähler|Gefängnis|Apfelschorle|30|ich|Cent|Magen|Maß|einziges|20|Schluckauf|Keller|Spinnweben|goldenen|Krug|Warnung|Niemals|Rand|leer|nichts|warm|rattern|5|600|aufhören|100|200|300|Schaum|Stadt|Autos|Brunnen|Fässern|stieg|Tränen|Ruhe|Zähler|reichste|Welt|Telefon|Bank|zusammengebrochen|Bierdeckel|Zahlungsmittel|Ununterbrochen|Moment|wieder)$/;
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
// ---------- a: gancho, la regla y la ciudad (0 – 44,2 s) ----------
// Plaza de Brauheim con el Biergarten: fila del gancho en z = 8 (delante del Ausschank, z = -12); mesas en (±14, 24/37/50).
// Getränkemarkt: fachada en x = -43, z ≈ 10 (cajas apiladas en (-40, 21)). Maibaum (18, -14) con la placa de la leyenda.
const TAFP = V(-22, 0, -30);   // pizarra de la regla
// cámara para ver beber: frente y algo de lado (la jarra entra por el otro lado y no tapa los ojos)
// (de tres cuartos desde el lado de la mano libre: se ve la cara de perfil con la jarra en la boca)
const dcam = (ch, k, d = 10, yaw = -1.0, dy = 5.2, fov = 40) => onBody(ch, d, yaw, .1, fov, k, d * .84, yaw + .12, dy);
const sit2 = (c, x, z, ry, seat = 2.7) => { put(c, x, sitY(c, seat), z, ry); c.blob.visible = false; return c; };
const SITP = sitPose({ aLx: .5, aLe: 1.2, aLz: -.1 });
function drawRule(c, w, h, k) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#12204a'); g.addColorStop(1, '#2a0a3a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 60px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText('JE MEHR BIER,', w / 2, 64); c.fillStyle = '#ffd23f'; c.fillText('DESTO MEHR GELD!', w / 2, 132);
  [['1 BIER', '20 €', .1], ['5 BIER', '600 €', .32], ['20 BIER', '1 MIO. €', 1]].forEach(([a, b, v], i) => { const x = 200 + i * 312, bh = 300 * v * clamp(k * 1.8 - i * .35); c.fillStyle = ['#3ab8ff', '#ffd23f', '#5aff9a'][i]; c.beginPath(); c.roundRect(x - 84, 520 - bh, 168, bh, 18); c.fill();
    c.font = `700 40px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText(a, x, 552); if (bh > 30) { c.font = `700 44px ${FONT}`; c.fillText(b, x, 520 - bh - 32); } }); }

// 1 «In dieser Stadt bekommst du»: cinco vecinos en fila levantan la Maß a la vez y beben; de golpe cae una lluvia de billetes. Plano frontal centrado, empuje.
shot(0, 'C', null, L => { town(L); const row = [CR[0], CR[1], CR[2], CR[3], CR[4]]; const RP = [[-4.6, 8], [0, 9], [4.6, 8], [-2.3, 4], [2.3, 4]];
  row.forEach((c, i) => { put(c, RP[i][0], 0, RP[i][1], .75); drink(c, L, .12 + Math.abs(i - 2) * .05, .75, { meter: true, bg: i !== 2, expr: 'happy', l1: .2 }); if (L.lt > .95) cashPop(c, '+20 €', clamp((L.lt - .95 - i * .03) / .2), 'green', .8); });
  crowdAt(L, 0, 2, 8, 6, 12, 2, { mode: i => ['prost', 'drink', 'cheer'][i % 3], from: 5, gap: 1.0 });
  billFall(V(0, 0, 8), L.t0 + .55, L.T, 70, 24, 8, 16);
  cm([0, 6.4, 34, 0, 5.2, 7, 46], [0, 6.2, 27, 0, 5.4, 7, 44], L.k, easeOut); sh(V(0, 0, 8), 30); },
  [[0, 'gulp', .6], [.2, 'crowd_cheer', .3], [.55, 'money_rain', .7], [.9, 'cash', .6]]);
// 2 «jedes Mal Geld,»: de cerca, una vecina con Dirndl baja la jarra satisfecha; el Bierzähler marca 1 Bier · 20 € y un billete le cae en la mano
shot(1.35, 'W', 'punch', L => { town(L); const c = put(CR[1], 0, 0, 10, 0); drink(c, L, L.t0 - .9, .6, { meter: true, expr: 'happy', after: 'joy' }); meterOf(c).userData.set('1 Bier', '20 €');
  billDrop(c, L.t0 + .15, L.T, 4, 1.6); cashPop(c, '+20 €', clamp((L.lt - .3) / .2), 'green', 1.1); crowdAt(L, 0, 10, 6, 7, 14, 5, { mode: i => ['drink', 'prost'][i % 2], from: 6 });
  orbit(V(0, 5.6, 10), lerp(11, 9, L.k), -.18, .06, 40); sh(V(0, 0, 10), 18); }, [[0, 'ahh', .6], [.15, 'cash_reg', .6], [.3, 'paper', .4]]);
// 3 «wenn du ein Bier trinkst.»: en la mesa, un hombre con camisa de cuadros se bebe la Maß de un trago (de perfil a tres cuartos); la cámara se acerca
shot(2.39, 'Z', null, L => { town(L); const c = sit2(CR[2], -14, 21.7, 0); drink(c, L, L.t0 - .05, 1.0, { sit: true, pose: SITP, meter: true, expr: 'determined', bg: false });
  tableFolk(L, 0, -1, 3, 'sitdrink', 3, { dx: -6 }); tableMugs(0, 3);
  dcam(c, L.k, 11, -1.0, 4.2); sh(V(-14, 0, 22), 18); }, [[0, 'swoosh_up', .5], [.1, 'gulp_long', .7], [.8, 'glass_down', .4]]);
// 4 «Und je mehr Bier du trinkst,»: la pizarra de la regla con las barras que crecen; la gente debajo mira con su jarra
shot(3.59, 'S', null, L => { town(L, { bg: false }); show(TAFEL, TAFP.x, 0, TAFP.z, .25); TAFEL.userData.draw((c, w, h) => drawRule(c, w, h, L.lt / 1.1));
  crowdAt(L, TAFP.x, TAFP.z + 14, 10, 4, 9, 9, { mode: i => ['sithold', 'drink', 'prost'][i % 3] === 'sithold' ? 'drink' : ['drink', 'prost'][i % 2], face: V(TAFP.x, 15, TAFP.z), full: false, gap: 1.6 });
  const tp = TAFP.clone(), fx = Math.sin(.25), fz = Math.cos(.25); cm([tp.x + fx * 40, 8, tp.z + fz * 40, tp.x, 14.4, tp.z, 46], [tp.x + fx * 33, 9.5, tp.z + fz * 33, tp.x, 15, tp.z, 46], L.k); sh(V(tp.x, 0, tp.z + 10), 34); DOF = 0; },
  [[0, 'whoosh', .4], [.15, 'power_on', .6], [.4, 'pling', .4], [.8, 'pling', .4]]);
// 5 «desto mehr bekommst du.»: un vecino con una torre de jarras vacías bebe otra y le llueven billetes; los de alrededor aplauden
shot(4.95, 'F', null, L => { town(L); const c = sit2(CR[5], 14, 21.7, 0); drink(c, L, L.t0 - .1, .6, { sit: true, pose: SITP, meter: true, expr: 'happy', after: 'joy' }); meterOf(c).userData.set('9 Bier', '4.800 €');
  for (let i = 0; i < 8; i++) { const m = KRUG[i]; show(m, 16.4 + (i % 4) * 1.1, 4.15 + Math.floor(i / 4) * 1.32, 24 + (i % 2) * .3, i, 1); m.userData.level(0, 0); }
  tableFolk(L, 1, -1, 2, i => i % 2 ? 'sitprost' : 'sitdrink', 0, { dx: 6 }); billFall(V(14, 0, 22), L.t0 + .1, L.T, 50, 14, 8, 14); cashPop(c, '+4.800 €', clamp((L.lt - .3) / .2), 'gold', 1);
  orb(L.k, V(13, 4.8, 22), null, [17, -.5, .16, 44], [14, -.62, .12, 44]); sh(V(14, 0, 22), 20); }, [[0, 'flash', .4], [.1, 'money_rain', .6], [.4, 'clap', .5], [.6, 'cheer', .4]]);
// 6 «Ein Bier?»: un chico con gorra levanta una sola Maß y bebe; el HUD del Bierzähler arranca
shot(6.16, 'C', 'punch', L => { town(L); const c = put(CR[6], 30, 0, 2, -.3); drink(c, L, L.t0 + .02, .4, { meter: true, expr: 'happy', sip: true }); setHUD(clamp((L.lt - .1) / .45));
  crowdAt(L, 30, 2, 6, 6, 12, 14, { mode: 'drink', from: 8, gap: 1.4 }); dcam(c, L.k); sh(V(30, 0, 2), 16); }, [[0, 'thump', .5], [.08, 'gulp', .6], [.3, 'tick', .4]]);
// 7 «20 Euro.»: baja la jarra, ¡ding!: un billete de 20 cae en su mano
shot(6.76, null, null, L => { town(L); const c = put(CR[6], 30, 0, 2, -.3); drink(c, L, L.t0 - .75, .4, { meter: true, sip: true, after: 'joy' }); meterOf(c).userData.set('1 Bier', '20 €'); setHUD(1);
  billDrop(c, L.t0, L.T, 3, 1.4); cashPop(c, '+20 €', clamp(L.lt / .2), 'green', 1.2); crowdAt(L, 30, 2, 6, 6, 12, 14, { mode: 'drink', from: 8, gap: 1.4 });
  orbit(V(30, 5.2, 2), lerp(12, 11, L.k), -.1, .08, 42); sh(V(30, 0, 2), 16); }, [[0, 'cash_reg', .7], [.1, 'paper', .4]]);
// 8 «5 Bier?»: Resi, la camarera, en la barra del Ausschank: cinco jarras vacías en fila y bebe la quinta; el HUD sube a 5
shot(7.54, 'W', null, L => { town(L); const c = put(resi, 2, 0, -7.4, 0); drink(c, L, L.t0, .75, { meter: true, expr: 'determined', l1: .1 }); setHUD(lerp(4, 5, clamp((L.lt - .3) / .5)) < 4.99 ? 4 : 5);
  for (let i = 0; i < 4; i++) { const m = KRUG[i]; show(m, -4.5 + i * 1.6, 4.4, -9.6, 0, 1); m.userData.level(0, 0); }
  crowdAt(L, 2, -2, 6, 5, 11, 21, { mode: i => ['drink', 'clap'][i % 2], from: 2, gap: 1.5 }); dcam(c, L.k); sh(V(2, 0, -6), 18); },
  [[0, 'whoosh_soft', .4], [.05, 'gulp_long', .6], [.7, 'glass_down', .5]]);
// 9 «600 Euro.»: estallido de billetes alrededor de Resi; +600 €
shot(8.61, 'C', 'punch', L => { town(L); const c = put(resi, 2, 0, -7.4, 0); drink(c, L, L.t0 - 1.1, .75, { meter: true, after: 'joy', l1: .1 }); meterOf(c).userData.set('5 Bier', '600 €'); setHUD(5);
  for (let i = 0; i < 5; i++) { const m = KRUG[i]; show(m, -4.5 + i * 1.6, 4.4, -9.6, 0, 1); m.userData.level(0, 0); } billBurst(hp(c).add(V(0, -1, 0)), L.t0, L.T, 30, 1.2); cashPop(c, '+600 €', clamp(L.lt / .2), 'gold', 1.25);
  crowdAt(L, 2, -2, 6, 5, 11, 21, { mode: 'cheer', from: 2, gap: 1.5 }); orbit(V(2, 5.4, -7.4), lerp(13, 11.5, L.k), .25, .1, 42); sh(V(2, 0, -6), 18); }, [[0, 'cash_reg', .7], [.05, 'money_burst', .6], [.3, 'cheer', .4]]);
// 10 «20 Bier?» (zoom lento): el grandullón del sombrero tirolés, detrás de una torre de 19 jarras vacías, bebe la número 20
shot(9.61, 'F', 'slow', L => { town(L); const c = sit2(TR[0], -14, 34.7, 0); drink(c, L, L.t0 - .05, .85, { sit: true, pose: SITP, meter: true, expr: 'determined', eyesD: 'squint' }); setHUD(L.lt < .7 ? 19 : 20, '#ffd23f');
  for (let i = 0; i < 12; i++) { const m = KRUG[i]; show(m, -11.6 + (i % 4) * 1.05, 4.15 + Math.floor(i / 4) * 1.32, 36.4, 0, 1); m.userData.level(0, 0); }
  tableFolk(L, 2, -1, 2, 'sithold', 0, { dx: 7 }); crowdAt(L, -14, 30, 6, 7, 14, 25, { mode: 'clap', from: 4, gap: 1.8 });
  dcam(c, L.k, 11, -.9, 4.4, 42); sh(V(-14, 0, 36), 18); }, [[0, 'gulp_long', .6], [.6, 'drumroll', .4]]);
// 11 «Glückwunsch!»: confeti; los vecinos lo levantan en hombros
shot(10.66, 'Z', 'punch', L => { town(L); const c = put(TR[0], -14, lerp(0, 2.2, easeOut(clamp(L.lt / .3))), 30, 0); prost(c, L, 1, { pose: { aLx: 2.8, aLz: .5 } }); laughF(c, L.T); setHUD(20, '#ffd23f');
  confetti(V(-14, 6, 30), L.t0, L.T, 70, 1.3); crowdAt(L, -14, 30, 10, 3.5, 10, 27, { mode: i => i < 3 ? 'cheer' : ['prost', 'clap'][i % 2], gap: 1.3 });
  orbit(V(-14, 6.6, 30), lerp(17, 15, L.k), .1, .16, 44); sh(V(-14, 0, 30), 22); }, [[0, 'party_horn', .6], [.05, 'confetti_pop', .6], [.2, 'cheer', .6]]);
// 12 «Du bist Millionär!»: sube a la mesa con los brazos en alto; lluvia enorme de billetes; 1 MIO. € en dorado
shot(11.26, 'R', null, L => { town(L); const c = put(TR[0], -14, 4.15, 37, 0); actuar(c, L.lt, [[0, { aLx: 2.9, aRx: 2.9, aLz: .5, aRz: .5, aLe: .2, aRe: .2 }], [.3, { aLx: 2.6, aRx: 2.6, aLz: .7, aRz: .7, crouch: .1 }, { dur: .3 }]], { T: L.T }); laughF(c, L.T); meterOf(c).userData.set('20 Bier', '1 Mio. €', '#ffd23f'); setHUD(20, '#ffd23f');
  billRain(V(-14, 0, 37), L.T, 90, 24, 14, 20, 3.5); badge('gold', '1.000.000 €', W / 2, H * .2, clamp(L.lt / .25), 1, 1.15); crowdAt(L, -14, 37, 10, 5, 12, 29, { mode: i => ['cheer', 'prost'][i % 2], gap: 1.3 });
  orbit(V(-14, 9.4, 37), lerp(20, 17, L.k), -.15, .1, 46); sh(V(-14, 0, 37), 24); }, [[0, 'money_rain', .8], [.1, 'cheer', .6], [.3, 'cash_reg', .5]]);
// 13 «Und es gibt eine Legende:» (zoom lento): la placa tallada en el Maibaum al atardecer; un abuelo con Tracht la señala
shot(12.52, 'W', 'slow', L => { town(L, { dusk: true, bg: false }); PLAQ.visible = true; const o = put(TR[4], 21, 0, -2, -.5); actuar(o, 0, [[0, { aRx: 2.2, aRz: .1, aRe: .1, headX: -.3, headY: -.3 }]], { T: L.T }); talk(o, L.T, L.t0, L.t1, 'warm');
  crowdAt(L, 18, 2, 5, 5, 9, 31, { mode: 'idle', face: V(18, 9, -13), gap: 1.6 }); cm([12, 6, 22, 18, 8.4, -13, 44], [15, 8, 8, 18, 9, -13, 42], L.k); sh(V(18, 0, -6), 24); },
  [[0, 'wind', .4], [.1, 'mystery', .6]]);
// 14 «Wer 500 Bier schafft,»: una torre de 500 jarras crece desde la plaza hasta las nubes; la cámara sube con ella
shot(13.87, 'I', null, L => { town(L, { bg: false }); const n = Math.round(lerp(40, 500, easeInOut(clamp(L.lt / 1.3)))); show(TOWER, 0, 0, -30, L.T * .2, 1); TOWER.userData.IB.count = TOWER.userData.IF.count = n; badge('num', nBier(n), W / 2, H * .18, clamp(L.lt / .2), 1, 1.2);
  crowdAt(L, 0, -30, 12, 9, 18, 33, { mode: i => ['point', 'shock'][i % 2], face: V(0, 30, -30), full: true });
  const top = Math.min(n / 6 * 1.45, 120); cm([0, 6, 40, 0, 10, -30, 50], [0, 20, 52, 0, top * .55 + 10, -30, 56], L.k); sh(V(0, 0, -30), 40); DOF = 0; },
  [[0, 'iris_pop', .4], [.1, 'glass_clink', .5], [.4, 'glass_clink', .5], [.8, 'riser_short', .5]]);
// 15 «wird Trillionär.»: una montaña de oro con una corona flotando arriba… y nadie sentado en ella
shot(15.41, 'Z', 'punch', L => { town(L, { bg: false }); show(GOLDM, 0, 0, -30, L.T * .05, 1); show(HALO, 0, 14 + Math.sin(L.T * 2) * .4, -30, 0, 1.6); HALO.rotation.x = PI / 2; coins(V(0, 6, -30), L.t0, L.T, 24);
  badge('gold', 'TRILLIONÄR', W / 2, H * .17, clamp(L.lt / .2), 1, 1.1); badge('num', '1.000.000.000.000.000.000 €', W / 2, H * .25, clamp((L.lt - .15) / .2), 1, .78);
  orbit(V(0, 7, -30), lerp(36, 30, L.k), .3 + L.k * .2, .18, 46); sh(V(0, 0, -30), 30); }, [[0, 'magic_hit', .6], [.1, 'coins', .6], [.3, 'choir', .4]]);
// 16 «Geschafft hat das noch nie jemand.»: de cerca, «REKORD: —» en la placa; los vecinos se encogen de hombros
shot(16.49, 'S', null, L => { town(L, { dusk: true, bg: false }); PLAQ.visible = true; for (let i = 0; i < 3; i++) { const c = put(CR[10 + i], 14 + i * 4, 0, -3, PI + (i - 1) * .3 + PI); actuar(c, L.lt, [[0, 'idle'], [.1 + i * .1, 'shrug', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'flat' }); }
  cm([18, 6, 16, 18, 5.6, -10, 44], [18, 6.2, 13, 18, 5.8, -10, 42], L.k); sh(V(18, 0, -6), 20); }, [[0, 'sigh', .4], [.4, 'wind', .3]]);
// 17 «Stell dir vor, wie viel»: un vecino en la mesa se queda pensando; nube de pensamiento con un montón de dinero
shot(18.15, 'W', null, L => { town(L); const c = sit2(CR[13], 14, 34.7, 0); holdOnly(c, L, { sit: true, pose: { ...SITP, headX: -.25, headY: .3, aLx: 1.4, aLe: 2.2, aLz: -.2 } }); cara(c, L.T, { expr: 'happy', eyes: 'side_r', mouth: 'smile' });
  tableFolk(L, 3, -1, 2, 'sitdrink', 0, { dx: 6 }); bubble(c, '💭 € € €', clamp((L.lt - .1) / .2), 2.6); FX2D.push(cx => { const [x, y] = proj(hp(c).add(V(0, 4.2, 0))); const k = clamp((L.lt - .2) / .3); cx.save(); cx.globalAlpha = k; for (let i = 0; i < 6; i++) { cx.fillStyle = '#3aa85a'; cx.fillRect(x - 120 + i * 40, y - 60 - (i % 2) * 20, 70, 36); cx.fillStyle = '#ffffff'; cx.font = `700 22px ${FONT}`; cx.fillText('€', x - 92 + i * 40, y - 36 - (i % 2) * 20); } cx.restore(); });
  onBody(c, 12, -.35, .1, 42, L.k, 10.5, -.25, 5); sh(V(14, 0, 36), 16); }, [[0, 'dream', .5], [.3, 'sparkle', .4]]);
// 18 «du heute schon verdient hättest.»: el móvil en su mano: el saldo sube y sube
shot(19.21, 'C', null, L => { town(L); const c = sit2(CR[13], 14, 34.7, 0); actuar(c, 0, [[0, { ...SITP, aLx: 1.3, aLe: 1.6, aLz: -.15, headX: .35 }]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'shock', mouth: 'open_smile' }); attach(PHONE, c.aL.hand, [0, -.9, .5], [-.3, 0, 0], 1.1); POST.push(() => PHONE.lookAt(camera.position));
  const v = Math.round(lerp(1200, 9860, easeIn(clamp(L.lt / 1.3)))); PHONE.userData.draw(cx => drawBankApp(cx, 300, 560, v.toLocaleString('de-DE') + ' €', '+20 € +20 € +20 €')); badge('green', '+' + v.toLocaleString('de-DE') + ' €', W / 2, H * .18, clamp(L.lt / .2), 1, .9);
  const p = wpos(PHONE); cm([p.x + 1.2, p.y + 2.6, p.z + 5.2, p.x, p.y + .2, p.z, 36], [p.x + .8, p.y + 2.2, p.z + 4.2, p.x, p.y + .2, p.z, 34], L.k); sh(V(14, 0, 36), 12); DOF = 0; }, [[0, 'notif', .6], [.3, 'coins', .5], [.7, 'notif', .5]]);
// 19 «Eben.»: un señor con bigote asiente satisfecho con su jarra y guiña un ojo
shot(20.61, 'F', 'punch', L => { town(L); const c = put(TR[2], -30, 0, 4, .4); holdOnly(c, L, { pose: { headX: Math.sin(L.lt * 12) * .12 } }); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' });
  crowdAt(L, -30, 4, 6, 6, 12, 35, { mode: 'drink', gap: 1.5 }); onFace(c, 6.6, .1, .3, 40, L.k, 6); sh(V(-30, 0, 4), 14); }, [[0, 'pop', .5], [.15, 'ding_soft', .4]]);
// 20 «Deshalb ist Biertrinken»: la plaza entera bebiendo a la vez, grúa que baja
shot(21.09, 'W', null, L => { town(L); for (let t = 0; t < 6; t++) { tableFolk(L, t, -1, 4, 'sitdrink', 0); tableFolk(L, t, 1, 4, i => i % 2 ? 'sitprost' : 'sitdrink', 0); }
  crowdAt(L, 0, 6, 8, 4, 12, 37, { mode: 'drink', full: true }); cm([0, 46, 90, 0, 2, 26, 46], [0, 30, 76, 0, 3, 26, 46], L.k, easeOut); sh(V(0, 0, 26), 50); DOF = 0; }, [[0, 'crowd_murmur', .5], [.2, 'glass_clink', .5], [.6, 'gulp', .4]]);
// 21 «hier kein Hobby,»: un vecino tira su caña de pescar a la papelera y coge una Maß; cartel HOBBY tachado
shot(21.95, 'S', null, L => { town(L, { bg: false }); const c = put(CR[14], -6, 0, -40, 0); const k = clamp(L.lt / .5), k2 = easeOut(clamp((L.lt - .2) / .2)); holdOnly(c, L, { pose: { aLx: lerp(1.5, .3, k2), aLz: lerp(.2, 1.4, k2), aLe: .3 } }); cara(c, L.T, { expr: 'determined', mouth: 'smirk' });
  show(DS1, -6, 11.5, -40.5, 0, .5); DS1.userData.draw('hobby', (cx, w, h) => { cx.fillStyle = '#f4f0e4'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#1a1a1a'; cx.font = `700 120px ${FONT}`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('HOBBY', w / 2, h / 2); cx.strokeStyle = '#d8202a'; cx.lineWidth = 26; cx.beginPath(); cx.moveTo(40, 40); cx.lineTo(w - 40, h - 40); cx.moveTo(w - 40, 40); cx.lineTo(40, h - 40); cx.stroke(); });
  const rod = PADDLE[0]; show(rod, -6 + 3 + k * 4, 6 - k * 4, -40 + 1, 0, 1); rod.rotation.z = -1 - k * 2;
  cm([-6, 6.4, -27, -6, 6.6, -40, 46], [-6, 6.4, -29, -6, 6.6, -40, 46], L.k); sh(V(-6, 0, -40), 20); }, [[0, 'swipe', .4], [.25, 'throw', .5], [.5, 'thud', .4]]);
// 22 «sondern ein Beruf.»: un señor con traje y corbata ficha en el Biergarten: «BERUF: BIERTRINKER»
shot(22.89, 'Z', null, L => { town(L); const c = sit2(BEA[1], 14, 47.7, 0); drink(c, L, L.t0 + .1, .55, { sit: true, pose: SITP, meter: true, expr: 'neutral' });  DS3.userData.draw('beruf', (cx, w, h) => { cx.fillStyle = '#1a2a4a'; cx.fillRect(0, 0, w, h); cx.strokeStyle = '#ffd23f'; cx.lineWidth = 10; cx.strokeRect(8, 8, w - 16, h - 16); cx.fillStyle = '#ffffff'; cx.font = `700 64px ${FONT}`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('BERUF: BIERTRINKER', w / 2, h / 2 + 4); });
  tableFolk(L, 5, -1, 2, 'sitdrink', 0, { dx: 7 }); onBody(c, 15, -.3, .14, 44, L.k, 13, -.2, 5.5); show(DS3, 14, 11, 44.6, 0, .6); sh(V(14, 0, 48), 18); }, [[0, 'zoom_in', .4], [.1, 'stamp', .6], [.3, 'gulp', .5]]);
// 23 «Die Büros stehen leer.»: oficina abandonada: sillas vacías, monitores apagados, polvo y telarañas; travelling lateral
shot(23.95, 'R', null, L => { bueroS(L); DUST.forEach((d, i) => { const r = RNG(i * 3 + 1); d.visible = true; d.position.set(BUX - 15 + r() * 30, 3 + r() * 10 + Math.sin(L.T + i) * .4, -10 + r() * 20); d.scale.setScalar(.05 + r() * .05); d.material.opacity = .5; });
  cm([BUX - 12, 8.5, 14, BUX - 6, 5, -6, 50], [BUX + 6, 8.5, 14, BUX + 8, 5, -6, 50], L.k); sh(V(BUX, 0, 0), 26); DOF = 0; }, [[0, 'wind', .5], [.3, 'creak', .4], [.8, 'clock_tick', .4]]);
// 24 «Stattdessen sitzen alle im Biergarten,»: grúa sobre el Biergarten lleno: todas las mesas ocupadas, camareras con jarras
shot(25.23, 'W', null, L => { town(L); for (let t = 0; t < 6; t++) { tableFolk(L, t, -1, 3, i => ['sitdrink', 'sithold', 'sitprost'][i % 3], 0); tableFolk(L, t, 1, 3, i => ['sithold', 'sitdrink', 'sitprost'][i % 3], 0); tableMugs(t, 2); }
  const r = put(resi, 0, 0, 30 + L.lt * 3, 0); actuar(r, 0, [[0, { ...walkP(L.T, 0), aLx: 1.2, aLe: 1.3 }]], { T: L.T }); holdOnly(r, L); cara(r, L.T, { expr: 'happy' });
  cm([0, 36, 84, 0, 3, 30, 46], [0, 24, 72, 0, 4, 30, 46], L.k, easeOut); sh(V(0, 0, 32), 46); DOF = 0; }, [[0, 'crowd_murmur', .6], [.4, 'accordion', .5], [.8, 'glass_clink', .4]]);
// 25 «heben ihre Krüge»: una fila de sentados alza las Maß a la vez: ¡Prost!
shot(26.83, 'C', null, L => { town(L); const row = [CR[15], CR[16], CR[17], CR[18]]; row.forEach((c, i) => { sit2(c, -18.8 + i * 3.2, 39.3, PI); prost(c, L, easeOut(clamp((L.lt - i * .06) / .35)), { sit: true, pose: SITP }); laughF(c, L.T + i); });
  tableMugs(2, 2, .9); orbit(V(-14, 6, 39.3), lerp(14, 12, L.k), PI, .12, 44); sh(V(-14, 0, 38), 18); }, [[0, 'prost', .7], [.3, 'glass_clink', .7], [.5, 'cheer', .4]]);
// 26 «und schauen auf ihr Konto.»: todos miran el móvil a la vez; en primer plano, el saldo sube
shot(27.77, 'I', null, L => { town(L); for (let i = 0; i < 4; i++) { const c = sit2(CR[15 + i], -18.8 + i * 3.2, 39.3, PI); holdOnly(c, L, { sit: true, pose: { ...SITP, aLx: 1.2, aLe: 1.7, headX: .4 } }); cara(c, L.T, { expr: 'happy', eyes: 'down', mouth: 'smile' }); if (i === 1) { attach(PHONE, c.aL.hand, [0, -.9, .5], [-.4, 0, 0], 1.1); POST.push(() => PHONE.lookAt(camera.position)); } }
  PHONE.userData.draw(cx => drawBankApp(cx, 300, 560, '12.480 €', '+40 €')); badge('green', '+40 €', W / 2, H * .2, clamp((L.lt - .2) / .2), 1, 1);
  orbit(V(-14, 5.6, 39.3), lerp(11, 9.6, L.k), PI - .2, .3, 42); sh(V(-14, 0, 38), 16); }, [[0, 'iris_pop', .4], [.2, 'notif', .6], [.6, 'notif', .5]]);
// 27 «Aber nicht jedes Bier zählt.»: un tipo bebe de una lata barata; su Bierzähler se pone rojo: 0 €
shot(29.20, 'F', null, L => { town(L, { bg: false }); const c = put(CR[19], 24, 0, -50, -.2); drink(c, L, L.t0 + .05, .5, { meter: true, kind: 'none', sip: true, after: 'confused', afterMouth: 'grimace' }); attach(CAN, c.aR.hand, [-.4, -.2, -.5], [PI / 2, 0, 0], .9);
  meterOf(c).userData.set('0 Bier', '0 €', '#ff4a4a', L.lt > .9 ? 1 : 0); if (L.lt > .9) badge('red', '0 €', W / 2, H * .2, clamp((L.lt - .9) / .2), 1, 1.2);
  dcam(c, L.k); sh(V(24, 0, -50), 16); }, [[0, 'can_open', .6], [.1, 'gulp', .5], [.9, 'buzzer', .6]]);
// 28 «Der Zähler erkennt nur»: el Bierzähler de cerca escanea la jarra con un láser rojo
shot(30.66, 'S', null, L => { town(L); const c = put(CR[20], -2, 0, 10, 0); prost(c, L, .3); cara(c, L.T, { expr: 'neutral', eyes: 'down' }); const m = meterOf(c); m.userData.set('SCANNE…', '', '#7ad8ff');
  const mp = wpos(m); FX2D.push(cx => { const [x, y] = proj(mp); const [x2, y2] = proj(wpos(mugOf(c)).add(V(0, .7, 0))); const t = (L.T * 3) % 1; cx.save(); cx.strokeStyle = 'rgba(255,40,40,.85)'; cx.lineWidth = 8; cx.shadowColor = '#ff2a2a'; cx.shadowBlur = 20; cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x2 - 40 + t * 80, y2); cx.stroke(); cx.restore(); });
  cm([mp.x + 2.2, mp.y + 1.2, mp.z + 5.4, mp.x + .6, mp.y - .4, mp.z, 34], [mp.x + 1.6, mp.y + 1, mp.z + 4.4, mp.x + .6, mp.y - .4, mp.z, 32], L.k); sh(V(-2, 0, 10), 10); DOF = 0; }, [[0, 'scan', .7], [.5, 'beep', .4]]);
// 29 «echtes, gutes Bier.»: ¡bip! verde: ECHT ✓; el vecino sonríe y bebe
shot(31.74, 'Z', null, L => { town(L); const c = put(CR[20], -2, 0, 10, 0); drink(c, L, L.t0 + .35, .6, { meter: true, expr: 'happy' }); meterOf(c).userData.set('ECHT ✓', '+20 €', '#5aff9a'); badge('green', 'ECHT ✓', W / 2, H * .2, clamp(L.lt / .2), 1, 1.1);
  crowdAt(L, -2, 10, 6, 6, 12, 41, { mode: 'drink', from: 0, gap: 1.4 }); dcam(c, L.k); sh(V(-2, 0, 10), 16); }, [[0, 'ding_reveal', .6], [.4, 'gulp', .5]]);
// 30 «Und das allerbeste?» (zoom lento): dentro del Getränkemarkt, travelling hacia el estante de honor; se enciende el foco
shot(33.18, 'W', 'slow', L => { regalS(L, lerp(0, 160, easeIn(clamp(L.lt / .7)))); crowdAt(L, RGX, -2, 4, 3, 8, 43, { mode: 'idle', face: V(RGX, 6, -16), full: true });
  cm([RGX, 7.5, 16, RGX, 6, -16, 46], [RGX, 6.8, 2, RGX, 6, -16, 42], L.k, easeIn); sh(V(RGX, 0, -8), 26); }, [[0, 'whoosh_soft', .4], [.2, 'hum', .4]]);
// 31 «Weihenstephaner.»: la botella protagonista en el estante de honor, girando bajo el foco, con destellos
shot(34.06, 'F', 'punch', L => { regalS(L, 160); const b = show(BW, RGX, 5.1, -14.6, PI + Math.sin(L.T * 1.5) * .35, 1.8); confetti(V(RGX, 7, -14.6), L.t0 + .1, L.T, 24, .6);
  cm([RGX + .6, 8.4, -6.6, RGX, 7.2, -14.6, 36], [RGX + .4, 8.1, -8, RGX, 7.2, -14.6, 34], L.k); sh(V(RGX, 0, -12), 14); DOF = 0; }, [[0, 'magic_hit', .7], [.1, 'choir', .5], [.5, 'sparkle', .5]]);
// 32 «Aus der ältesten Brauerei der Welt,»: la cervecería-monasterio en la colina; grúa que sube por el camino entre el lúpulo
shot(35.40, 'R', null, L => { klosterS(L); crowdAt(L, KLX, 10, 6, 3, 10, 45, { mode: 'walk', dir: PI, face: V(KLX, 0, -40), speed: 1.5, full: true });
  cm([KLX, 6, 64, KLX, 16, -30, 50], [KLX, 18, 52, KLX, 20, -30, 50], L.k); sh(V(KLX, 0, -20), 60); DOF = 0; }, [[0, 'birds', .5], [.3, 'bells', .5]]);
// 33 «gebraut seit dem»: dentro del Sudhaus: el hermano Anselm remueve la caldera de cobre con una pala de madera
shot(37.18, 'W', null, L => { sudS(L); const m = put(moench, SUX - 5, 0, 2, -.6); actuar(m, 0, [[0, { aRx: 2.0, aLx: 1.8, aRz: -.2, aLz: .2, aRe: .4, aLe: .5, lean: .2 + Math.sin(L.T * 4) * .08, twist: Math.sin(L.T * 4) * .25 }]], { T: L.T }); cara(m, L.T, { expr: 'happy' });
  attach(PADDLE[0], m.aR.hand, [0, -.6, .2], [.4, 0, 0], 1.2); DUST.forEach((d, i) => { const r = RNG(i); d.visible = true; d.position.set(SUX - 11 + (r() - .5) * 3, 13 + ((L.T * .8 + r()) % 1) * 8, -6 + (r() - .5) * 3); d.scale.setScalar(.6 + r()); d.material.opacity = .25; });
  orbit(V(SUX - 5, 5, 2), lerp(17, 14.5, L.k), .45 - L.k * .15, .12, 44); sh(V(SUX - 6, 0, -2), 24); }, [[0, 'bubbling', .6], [.2, 'steam', .4]]);
// 34 «Jahr 1040.»: el letrero «SUDHAUS · SEIT 1040» y el monje orgulloso; 1040 en dorado
shot(37.90, 'C', 'punch', L => { sudS(L); const m = put(moench, SUX, 0, -8, 0); actuar(m, 0, [[0, { aRx: 2.6, aRz: .1, aRe: .1, headX: -.15 }]], { T: L.T }); talk(m, L.T, L.t0, L.t1, 'happy'); badge('gold', '1040', W / 2, H * .34, clamp(L.lt / .2), 1, 1.5);
  cm([SUX, 9, 18, SUX, 11, -14, 48], [SUX, 9.5, 14, SUX, 11.5, -14, 46], L.k); sh(V(SUX, 0, -8), 20); }, [[0, 'gong', .6], [.2, 'choir', .4]]);
// 35 «Ein Weihenstephaner zählt doppelt.»: un vecino brinda con una Weihenstephaner, bebe y el Bierzähler muestra ×2: +40 €
shot(39.30, 'S', null, L => { town(L); const c = put(CR[21], 8, 0, 12, -.2); drink(c, L, L.t0 + .2, .6, { meter: true, expr: 'happy', pose: { aLx: 1.0, aLe: .9, aLz: -.2 } }); attach(BW, c.aL.hand, [0, -.7, .4], [-.3, 0, 0], .9);
  meterOf(c).userData.set('×2', '+40 €', '#ffd23f'); badge('gold', '×2 = 40 €', W / 2, H * .2, clamp((L.lt - .5) / .2), 1, 1.1); crowdAt(L, 8, 12, 6, 6, 12, 47, { mode: 'drink', gap: 1.4 });
  dcam(c, L.k); sh(V(8, 0, 12), 16); }, [[0, 'bottle_open', .6], [.2, 'gulp', .5], [.6, 'double', .6]]);
// 36 «Deshalb steht vor jedem Getränkemarkt»: la fachada del Getränkemarkt con cajas apiladas y gente esperando
shot(41.08, 'Z', null, L => { town(L, { bg: false }); STACK.visible = true; for (let i = 0; i < 10; i++) { const c = put(CR[i], -39 + (i % 2) * 2, 0, 16 + i * 3.4, PI); actuar(c, 0, [[0, i % 3 ? 'idle' : { aLx: .2, headY: Math.sin(L.T + i) * .5 }]], { T: L.T }); cara(c, L.T + i, { expr: i % 2 ? 'neutral' : 'bored' }); }
  cm([-12, 9, 18, -43, 10, 12, 50], [-16, 9, 17, -43, 10, 12, 50], L.k); sh(V(-40, 0, 16), 30); }, [[0, 'street', .5], [.3, 'murmur', .4]]);
// 37 «eine Schlange bis um die Ecke.»: grúa: la cola sale de la tienda, recorre la calle y dobla la esquina
shot(42.56, 'W', null, L => { town(L, { bg: false }); STACK.visible = true; const POS = []; for (let i = 0; i < 40; i++) { const t = i * 3.1; let x, z, ry; if (t < 48) { x = -39 + (i % 2) * 1.6; z = 16 + t; ry = PI; } else { x = -39 + (t - 48); z = 64 + (i % 2) * 1.6; ry = -PI / 2; } POS.push([x, z, ry]); }
  [...CR, ...EX].slice(0, 40).forEach((c, i) => { if (c.root.visible) return; const [x, z, ry] = POS[i]; put(c, x, 0, z, ry); actuar(c, 0, [[0, { headY: Math.sin(L.T * .7 + i) * .4, aLx: .1 }]], { T: L.T }); cara(c, L.T + i, { expr: ['neutral', 'bored', 'sad'][i % 3] }); });
  cm([-10, 30, 40, -40, 2, 36, 50], [-6, 46, 54, -34, 2, 44, 52], L.k, easeOut); sh(V(-36, 0, 40), 50); DOF = 0; }, [[0, 'whoosh', .4], [.3, 'murmur', .5]]);
// ---------- b: vecinos ricos y la ley (44,2 – 77,9 s) ----------
// Casa de Frau Huber: fachada este (x = 43) en z ≈ HZ. Bierzelt: mesas x ∈ {-26, 0, 26} (largo 18), z = -24 + 14·r, bancos a z ± 2,3, escenario en z = -46.
// Sportplatz: campo z ∈ ±35, tribuna en x = -31. Amtsstube: escritorio (0, -6), sillón (0, -11), vaso de agua (-3, 4.7, -4.4).
const HZ = LT.HS[10].position.z, HX = 43;
const ztFolk = (L, r, c, s, n, mode, from = 0, o = {}) => { const cx = BZX - 26 + c * 26, cz = -24 + r * 14 + s * 2.3; POST.push(() => { const list = (o.list || CR).filter(q => !q.root.visible).slice(from, from + n); list.forEach((q, i) => { const x = cx - (n - 1) * 1.8 + i * 3.6; put(q, x, 0, cz, s < 0 ? 0 : PI); crowdDrink(q, x, cz, L, i + r * 5 + c, o, typeof mode === 'function' ? mode(i) : mode); }); }); };
// banderas doradas «K» del alcalde en los tejados del lado oeste
const KFLAGS = []; for (let i = 0; i < 6; i++) { const g = P_(new THREE.Group()); cyl(.2, .2, 8, mat(0xd8a020, { metalness: .9 }), 6, g, 0, 4, 0); const f = textPlane(4, 2.6, 120, 78, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.fillStyle = '#8a1a1a'; c.font = `700 60px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('K', w / 2, h / 2 + 3); }); f.material.side = THREE.DoubleSide; f.position.set(2, 6.6, 0); g.add(f); KFLAGS.push(g); }
const kflags = (n, T) => KFLAGS.forEach((g, i) => { if (i >= n) return; const hp_ = LT.HS[i].position; show(g, hp_.x + 4, 27, hp_.z, PI / 2, 2.2); g.children[1].rotation.y = Math.sin(T * 3 + i) * .25; });

// 38 «Meine Nachbarin hat sich»: Frau Huber sale por la puerta de su casa con su Dirndl rojo y saluda
shot(44.21, 'F', null, L => { town(L, { bg: false }); const c = put(huber, HX - 2.6 - L.lt * 1.4, 0, HZ, -PI / 2); actuar(c, L.lt, [[0, { ...walkP(L.T, 0) }], [.35, 'wave', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' });
  crowdAt(L, HX - 12, HZ, 4, 6, 12, 51, { mode: 'walk', speed: 1.4 }); onBody(c, 15, 0, .12, 44, L.k, 12.5, -.15, 4); sh(V(HX - 4, 0, HZ), 20); }, [[0, 'door_open', .5], [.3, 'hello_f', .4], [.5, 'steps', .3]]);
// 39 «nach einem einzigen Abend auf dem Oktoberfest»: en el Bierzelt lleno, de pie en el banco, Frau Huber se bebe la Maß; todos brindan alrededor
shot(45.09, 'W', null, L => { zelt(L); const c = put(huber, BZX, 2.6, -22.3, 0); drink(c, L, L.t0 + .15, 1.1, { meter: true, expr: 'happy' }); meterOf(c).userData.set('47 Bier', '1,9 Mio. €', '#ffd23f');
  ztFolk(L, 0, 1, -1, 4, i => ['prost', 'drink'][i % 2], 0, { dx: 0 }); ztFolk(L, 0, 0, -1, 4, 'sitprost', 4); ztFolk(L, 0, 2, -1, 4, 'sitdrink', 8); ztFolk(L, 1, 0, -1, 3, 'sitdrink', 12); ztFolk(L, 1, 2, -1, 3, 'sitprost', 15);
  orbit(V(BZX, 10, -22.3), lerp(24, 19, easeOut(L.k)), -.45, -.12, 52); sh(V(BZX, 0, -24), 40); }, [[0, 'oompah', .6], [.2, 'crowd_cheer', .5], [.4, 'gulp_long', .5]]);
// 40 «eine Villa am See gekauft.»: delante de la villa del lago con el cartel VERKAUFT, ella hace sonar las llaves
shot(46.97, 'R', null, L => { seeS(L); const c = put(huber, SVX - 4, 0, -8, .2); actuar(c, 0, [[0, { aRx: 2.5, aRz: .2, aRe: .3 + Math.sin(L.T * 14) * .1, aLx: .4, aLz: .5 }]], { T: L.T }); attach(KEYS, c.aR.hand, [0, -.8, .3], [0, 0, Math.sin(L.T * 14) * .4], 1.2); grin(c, L.T);
  badge('gold', 'VILLA AM SEE', W / 2, H * .18, clamp((L.lt - .2) / .2), 1, .9); cm([SVX + 4, 9, 30, SVX - 1, 10, -16, 50], [SVX + 2, 8, 24, SVX - 2, 9.5, -16, 48], L.k); sh(V(SVX - 4, 0, -10), 40); DOF = 0; }, [[0, 'keys', .6], [.2, 'birds', .4], [.5, 'ding_soft', .4]]);
// 41 «Ihr Geheimtipp?»: se inclina hacia la cámara con el dedo en los labios
shot(48.58, 'C', null, L => { town(L, { bg: false }); const c = put(huber, HX - 4, 0, HZ, -PI / 2); actuar(c, 0, [[0, { aLx: 2.2, aLz: -.25, aLe: 2.3, lean: .22, headX: .1, headY: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'squint', mouth: 'smirk' });
  onFace(c, 5.6, 0, .4, 40, L.k, 4.8); sh(V(HX - 4, 0, HZ), 14); }, [[0, 'shh', .6]]);
// 42 «Paulaner.»: levanta una botella de Paulaner junto a su cara, destellos
shot(49.17, 'Z', 'punch', L => { town(L, { bg: false }); const c = put(huber, HX - 4, 0, HZ, -PI / 2); actuar(c, 0, [[0, { aRx: 2.3, aRz: -.1, aRe: 1.0, headY: -.15 }]], { T: L.T }); POST.push(() => { const h = c.aR.hand.localToWorld(V(0, -.6, .6)); show(BP, h.x, h.y - 1.2, h.z, 0, 1.3); BP.rotation.y = Math.atan2(camera.position.x - h.x, camera.position.z - h.z) + PI; }); cara(c, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' });
  confetti(hp(c).add(V(0, 1, 0)), L.t0, L.T, 20, .4); onFace(c, 6.6, .4, -.6, 40, L.k, 5.8); sh(V(HX - 4, 0, HZ), 14); }, [[0, 'magic_hit', .6], [.1, 'sparkle', .5]]);
// 43 «Es ist so süffig,»: bebe tranquila, con los ojos cerrados de gusto, en la terraza del café
shot(50.15, 'S', null, L => { town(L, { bg: false }); const c = sit2(huber, 34.5, -26, PI / 2, 3.0); drink(c, L, L.t0 + .05, 1.0, { sit: true, pose: SITP, meter: true, expr: 'happy', sip: true }); meterOf(c).userData.set('48 Bier', '2,2 Mio. €', '#ffd23f');
  crowdAt(L, 30, -16, 4, 6, 12, 53, { mode: 'sitdrink', seat: 3.0 }); dcam(c, L.k, 10, -.9, 4.4); sh(V(36, 0, -26), 16); }, [[0, 'whoosh_soft', .4], [.1, 'gulp_long', .5], [.9, 'ahh', .5]]);
// 44 «dass du eins nach dem anderen trinkst,»: ráfaga: las jarras vacías se van alineando en la mesa (1, 2, 3, 4…) mientras ella sigue bebiendo
shot(51.31, 'W', null, L => { town(L); const c = sit2(huber, -14, 47.7, 0); const per = .4, j = Math.floor(L.lt / per); drink(c, L, L.t0 + j * per - .05, per - .2, { sit: true, pose: SITP, meter: true, up: .08, dn: .08, expr: 'happy' });
  const n = 1 + j; for (let i = 0; i < Math.min(n + 1, 8); i++) { const m = KRUG[i]; show(m, -11.2 + i * 1.3, 4.15, 49.6, 0, 1); m.userData.level(0, 0); } badge('num', String(n + 47), W / 2, H * .18, 1, 1, 1);
  onBody(c, 15, -.5, .2, 44, L.k, 13, -.4, 4); sh(V(-14, 0, 49), 18); }, [[0, 'glass_down', .5], [.4, 'glass_down', .5], [.8, 'glass_down', .5], [1.2, 'glass_down', .5]]);
// 45 «ohne es zu merken.»: se da cuenta: una torre de jarras vacías delante; ojos como platos
shot(52.94, 'F', null, L => { town(L); const c = sit2(huber, -14, 47.7, 0); holdOnly(c, L, { sit: true, pose: { ...SITP, aLx: .9, aLz: .4, aLe: 1.6, headX: -.2 } }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  for (let i = 0; i < 12; i++) { const m = KRUG[i]; show(m, -11.4 + (i % 4) * 1.05, 4.15 + Math.floor(i / 4) * 1.32, 49.6, 0, 1); m.userData.level(0, 0); }
  onBody(c, 13, -.45, .16, 44, L.k, 11.5, -.35, 4.6); sh(V(-14, 0, 49), 16); }, [[0, 'record_scratch', .5], [.2, 'gasp', .5]]);
// 46 «Und genau das macht dich reich.»: lluvia de billetes sobre ella, que ríe con los brazos abiertos
shot(53.96, 'C', null, L => { town(L); const c = put(huber, -14, 0, 44, 0); actuar(c, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: .7, aRz: .7, aLe: .2, aRe: .2, headX: -.15 }]], { T: L.T }); laughF(c, L.T); meterOf(c).userData.set('60 Bier', '8,7 Mio. €', '#ffd23f');
  billRain(V(-14, 0, 44), L.T, 80, 20, 12, 18, 3); badge('gold', '8.700.000 €', W / 2, H * .18, clamp(L.lt / .2), 1, 1); crowdAt(L, -14, 44, 6, 6, 12, 55, { mode: 'clap' });
  onBody(c, 15, .1, .12, 46, L.k, 12.5, -.05, 4); sh(V(-14, 0, 44), 22); }, [[0, 'money_rain', .7], [.3, 'laugh_f', .5]]);
// 47 «Mein Sportlehrer hat»: Herr Brandl en la banda del campo, con chándal, pita con su silbato
shot(55.78, 'W', null, L => { sportS(L); const c = put(brandl, SPX - 22, 0, 4, PI / 2); actuar(c, 0, [[0, { aRx: 1.9, aRz: -.2, aRe: 2.0, lean: -.05, aLx: .3, aLz: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'o' }); brandl.whistle.rotation.x = -.8;
  crowdAt(L, SPX, 4, 6, 4, 16, 57, { mode: 'run', full: true, face: V(SPX + 30, 0, 4) }); onBody(c, 15, -.6, .12, 44, L.k, 12.5, -.5, 4.2); sh(V(SPX - 14, 0, 4), 30); }, [[0, 'whistle', .7], [.3, 'kick', .4], [.5, 'crowd_stadium', .4]]);
// 48 «in der Halbzeit ein paar Bier getrunken»: en el banquillo, durante el descanso, se bebe una Maß; marcador HALBZEIT
shot(56.88, 'S', null, L => { sportS(L); const c = sit2(brandl, SPX - 23, 2, PI / 2, 2.6); drink(c, L, L.t0 + .1, 1.0, { sit: true, pose: SITP, meter: true, expr: 'happy' }); meterOf(c).userData.set('3 Bier', '214 €');
  show(DS3, SPX - 31.5, 14, 2, PI / 2, .7); DS3.userData.draw('halbzeit', (cx, w, h) => { cx.fillStyle = '#0a0e14'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#ffd23f'; cx.font = `700 76px ${FONT}`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('HALBZEIT  0 : 0', w / 2, h / 2 + 4); });
  dcam(c, L.k, 11, -.9, 3.8); sh(V(SPX - 23, 0, 2), 18); }, [[0, 'whistle_half', .5], [.2, 'gulp', .5], [.8, 'ahh', .4]]);
// 49 «und aus Versehen»: su Bierzähler se dispara; escupe la cerveza del susto y se le cae el silbato
shot(58.44, 'Z', null, L => { sportS(L); const c = sit2(brandl, SPX - 23, 2, PI / 2, 2.6); holdOnly(c, L, { sit: true, pose: { ...SITP, aLx: .9, aLz: .6, aLe: .4, lean: -.15, headX: -.1, ...shiver(L.T, 1.5) } }); cara(c, L.T, { expr: 'shock', mouth: 'scream' });
  const n = lerp(3, 40, easeIn(clamp(L.lt / .9))); meterOf(c).userData.set(nBier(n) + ' Bier', euro(money(n)), '#ffd23f'); setHUD(n, '#ffd23f');
  onFace(c, 5.8, .1, .3, 40, L.k, 5); sh(V(SPX - 23, 0, 2), 14); }, [[0, 'spit_take', .6], [.15, 'counter_fast', .6]]);
// 50 «den ganzen Fußballverein gekauft.»: pancarta «NEUER BESITZER: HERR BRANDL»; los jugadores lo levantan
shot(59.37, 'R', null, L => { sportS(L); show(SBAN, SPX - 21, 9.5, 0, PI / 2, .8); const c = put(brandl, SPX - 12, 2.6 + Math.abs(Math.sin(L.T * 5)) * .6, 0, PI / 2); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5 }]], { T: L.T }); laughF(c, L.T);
  for (let i = 0; i < 4; i++) { const p = put(CR[10 + i], SPX - 12 + (i % 2 ? 1.6 : -1.6), 0, (i < 2 ? -1.4 : 1.4), PI / 2 + (i - 1.5) * .3); actuar(p, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .2, aRz: .2, aLe: .3, aRe: .3, crouch: Math.abs(Math.sin(L.T * 5 + i)) * .1 }]], { T: L.T }); laughF(p, L.T + i); }
  confetti(V(SPX - 12, 8, 0), L.t0, L.T, 50, 1.1); cm([SPX + 10, 8, 14, SPX - 18, 10, 0, 50], [SPX + 6, 9, 10, SPX - 18, 10, 0, 50], L.k); sh(V(SPX - 14, 0, 0), 30); }, [[0, 'crowd_cheer', .6], [.2, 'party_horn', .5]]);
// 51 «Und der Bürgermeister?»: el alcalde Kranzl en su sillón de piel, con su cadena de oro, levanta la Maß
shot(61.33, 'W', null, L => { amtS(L); const c = sit2(kranzl, AMX, -10.4, 0, 3.4); prost(c, L, .55, { sit: true, pose: { ...SITP, headY: Math.sin(L.T) * .1 }, meter: true }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); meterOf(c).userData.set('9.312 Bier', '4,1 Brd. €', '#ffd23f');
  cm([AMX + 2, 8, 4, AMX, 6.6, -10, 42], [AMX + 1.5, 7.8, 2, AMX, 6.6, -10, 40], L.k); sh(V(AMX, 0, -8), 18); }, [[0, 'whoosh_soft', .4], [.1, 'clock_tick', .4], [.4, 'chuckle_m', .5]]);
// 52 «Der hat seit 12 Jahren»: el calendario de la pared pasa de 2014 a 2026 mientras él bebe
shot(62.44, 'F', null, L => { amtS(L); const c = sit2(kranzl, AMX, -10.4, 0, 3.4); drink(c, L, L.t0, 1.0, { sit: true, pose: SITP, expr: 'happy' }); const y = Math.round(lerp(2014, 2026, easeInOut(clamp(L.lt / 1.0))));
  show(DS1, AMX + 6, 10.5, -13.5, 0, .55); DS1.userData.draw('y' + y, (cx, w, h) => { cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#d8202a'; cx.fillRect(0, 0, w, 70); cx.fillStyle = '#ffffff'; cx.font = `700 46px ${FONT}`; cx.textAlign = 'center'; cx.fillText('KALENDER', w / 2, 50); cx.fillStyle = '#1a1a1a'; cx.font = `700 150px ${FONT}`; cx.fillText(String(y), w / 2, 220); });
  badge('num', '12 JAHRE', W / 2, H * .18, clamp((L.lt - .5) / .2), 1, 1.1); cm([AMX + 3, 8.5, 6, AMX + 3, 8.2, -12, 46], [AMX + 3, 8.4, 4, AMX + 3, 8.2, -12, 44], L.k); sh(V(AMX + 3, 0, -8), 20); }, [[0, 'flash', .4], [.1, 'pages_flip', .6], [.5, 'pages_flip', .5]]);
// 53 «kein Glas Wasser mehr angefasst.»: aparta el vaso de agua con asco; aspa roja
shot(63.62, 'C', null, L => { amtS(L); const c = sit2(kranzl, AMX, -10.4, 0, 3.4); const k = easeOut(clamp((L.lt - .2) / .4)); actuar(c, 0, [[0, { ...SITP, aLx: 1.2, aLz: lerp(-.2, .6, k), aLe: .4, lean: -.15, headY: .4, headX: .1 }]], { T: L.T, weight: false }); holdMug(c); c.aR.sh.rotation.y = HOLDY; cara(c, L.T, { expr: 'angry', mouth: 'grimace' });
  AM.GLASS.position.x = -3 - k * 2.5; badge('red', '✕', W * .38, H * .36, clamp((L.lt - .5) / .2), 1, 1.6); cm([AMX - 2.4, 7.6, 5, AMX - 1.6, 6.2, -7, 42], [AMX - 2.4, 7.4, 3.6, AMX - 1.6, 6.2, -7, 40], L.k); sh(V(AMX, 0, -8), 14); }, [[0, 'glass_slide', .6], [.4, 'buzzer', .5], [.3, 'sigh', .4]]);
// 54 «Deshalb gehört ihm die halbe Stadt.»: vista aérea del pueblo: la mitad de los tejados con banderas doradas «K»
shot(65.25, 'S', null, L => { town(L); kflags(6, L.T); badge('gold', 'HALBE STADT', W / 2, H * .18, clamp(L.lt / .2), 1, 1); crowdAt(L, 0, 0, 10, 4, 30, 59, { mode: 'walk', full: true });
  cm([30, 70, 50, -40, 12, -6, 50], [24, 64, 38, -40, 12, -10, 50], L.k); sh(V(0, 0, -10), 70); DOF = 0; }, [[0, 'whoosh', .4], [.2, 'flag_flutter', .5], [.5, 'ding', .4]]);
// 55 «Aber Vorsicht.»: un coche de policía frena en la plaza con las luces encendidas
shot(66.99, 'Z', 'punch', L => { town(L, { bg: false }); show(POL, 4 + lerp(10, 0, easeOut(clamp(L.lt / .4))), 0, 8, -PI / 2, 1); TINT = Math.floor(L.T * 8) % 2 ? 'rgba(40,80,255,.16)' : 'rgba(255,30,40,.16)'; const p = put(COPS[0], -2, 0, 10, .3); actuar(p, 0, [[0, { aRx: 1.6, aRe: .2 }]], { T: L.T }); cara(p, L.T, { expr: 'angry', mouth: 'talk_wide' });
  crowdAt(L, 0, 6, 6, 8, 14, 61, { mode: 'shock' }); orbit(V(2, 4, 8), lerp(22, 18, L.k), .15, .12, 46); sh(V(2, 0, 8), 24); }, [[0, 'siren', .7], [.2, 'brakes', .6]]);
// 56 «Die Regierung versteht»: en el Biergeld-Ministerium, los funcionarios serios tras la mesa; pantalla «NULL TOLERANZ»
shot(67.88, 'W', null, L => { minS(L); MI.scr.userData.draw((cx, w, h) => { cx.fillStyle = '#1a2a4a'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#ff4a4a'; cx.font = `700 120px ${FONT}`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('NULL TOLERANZ', w / 2, h / 2 - 40); cx.fillStyle = '#ffffff'; cx.font = `700 52px ${FONT}`; cx.fillText('BEIM BIERZÄHLER', w / 2, h / 2 + 80); });
  BEA.forEach((b, i) => { const a = (i - 1) * .22; put(b, MIX + Math.sin(a) * 26 * .9, 0, -32 + Math.cos(a) * 26 - 6 - 2.6, -a); actuar(b, 0, [[0, 'cross']], { T: L.T }); cara(b, L.T + i, { expr: 'angry', mouth: 'flat' }); });
  cm([MIX, 9, 26, MIX, 9, -12, 50], [MIX, 9, 21, MIX, 9.5, -12, 48], L.k); sh(V(MIX, 0, -8), 26); }, [[0, 'whoosh_soft', .4], [.2, 'murmur', .3], [.5, 'pen_click', .4]]);
// 57 «da keinen Spaß.»: el funcionario del bigote da un puñetazo en la mesa
shot(68.68, 'C', 'punch', L => { minS(L); const b = put(BEA[0], MIX, 0, -8.6, 0); const k = clamp((L.lt - .15) / .12); actuar(b, 0, [[0, { aRx: lerp(2.2, 1.1, k), aRe: lerp(1.6, .3, k), lean: .2, headX: .1 }]], { T: L.T }); cara(b, L.T, { expr: 'angry', mouth: 'scream' }); if (L.lt > .27) SHAKE = Math.max(0, 1 - (L.lt - .27) / .3) * .8;
  onFace(b, 5.6, .2, .4, 40, L.k, 5); sh(V(MIX, 0, -8), 14); }, [[.27, 'fist', .9], [.3, 'impact', .6]]);
// 58 «Jeder trägt einen»: en la plaza, una policía cuelga Bierzähler al cuello de una fila de vecinos
shot(69.79, 'F', null, L => { town(L, { bg: false }); const p = put(COPS[1], -2.2, 0, 8.6, PI - .3); actuar(p, 0, [[0, { aRx: 1.6, aRz: -.1, aRe: .5, aLx: 1.6, aLe: .5 }]], { T: L.T }); cara(p, L.T, { expr: 'neutral' });
  for (let i = 0; i < 5; i++) { const c = put(CR[22 + i] || EX[i], -2 + i * 3.4, 0, 6 - i * .8, 0); actuar(c, 0, [[0, 'idle']], { T: L.T }); cara(c, L.T + i, { expr: 'worried' }); if (i < 1 + Math.floor(L.lt * 4)) meterOf(c).userData.set('0 Bier', '0 €'); }
  cm([3, 7, 24, 4, 5.4, 4.6, 46], [4, 7, 21, 4, 5.4, 4.6, 46], L.k); sh(V(4, 0, 6), 22); }, [[0, 'click_set', .5], [.25, 'click_set', .5], [.5, 'click_set', .5]]);
// 59 «Bierzähler am Hals,»: primer plano del Bierzähler colgado del cuello
shot(70.47, 'S', null, L => { town(L, { bg: false }); const c = put(CR[22] || EX[0], 0, 0, 6, -PI / 2 + PI / 2); actuar(c, 0, [[0, { headX: .35 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'down' }); const m = meterOf(c); m.userData.set('0 Bier', '0 €'); const mp = wpos(m);
  badge('tag', 'BIERZÄHLER', W / 2, H * .2, clamp(L.lt / .2), 1, 1); cm([mp.x + .6, mp.y + 1.4, mp.z + 5.6, mp.x, mp.y + .4, mp.z, 36], [mp.x + .4, mp.y + 1.2, mp.z + 4.4, mp.x, mp.y + .4, mp.z, 34], L.k); sh(V(0, 0, 6), 10); DOF = 0; }, [[0, 'beep', .5], [.3, 'hum', .3]]);
// 60 «und wer schummelt,»: de noche, el tipo de la gabardina y gafas de sol se escabulle con una botella escondida a la espalda
shot(71.70, 'R', null, L => { town(L, { night: true, bg: false }); const c = put(schum, -40 + L.lt * 3, 0, -30, PI / 2); actuar(c, 0, [[0, { ...walkP(L.T * .6, 0), lean: .3, crouch: .4, aRx: -.6, aRe: 1.3, aRz: .2, headY: Math.sin(L.T * 3) * .6 }]], { T: L.T }); attach(APF, c.aR.hand, [0, -.6, -.3], [PI, 0, 0], .9); cara(c, L.T, { expr: 'sus', eyes: 'side_l', mouth: 'smirk' });
  onBody(c, 13, -.7, .14, 44, L.k, 11, -.6, 4); sh(V(-36, 0, -30), 18); }, [[0, 'sneak', .6], [.3, 'owl', .3]]);
// 61 «landet sofort im Gefängnis.»: la reja de la celda se cierra de golpe; él se agarra a los barrotes
shot(72.52, 'C', 'punch', L => { zelleS(L); const c = put(schum, ZEX, 0, 5.6, 0); actuar(c, 0, [[0, { aLx: 1.9, aRx: 1.9, aLz: .25, aRz: .25, aLe: 1.3, aRe: 1.3, lean: .1 + Math.sin(L.T * 20) * .04 }]], { T: L.T }); cara(c, L.T, { expr: 'scream' }); if (L.lt < .3) SHAKE = .8;
  cm([ZEX + 1, 6.4, 18, ZEX, 5.6, 5, 44], [ZEX + .6, 6.2, 15, ZEX, 5.8, 5, 42], L.k); sh(V(ZEX, 0, 4), 16); }, [[0, 'slam', .9], [.1, 'chain_rattle', .6], [.5, 'scream_m', .4]]);
// 62 «Letzte Woche hat einer Apfelschorle»: en un callejón de noche, rellena la jarra con Apfelschorle a escondidas
shot(74.06, 'W', null, L => { town(L, { night: true, bg: false }); const c = put(schum, -38, 0, -30, PI / 2 - .3); const k = clamp(L.lt / .4); actuar(c, 0, [[0, { aLx: 1.3, aLz: -.1, aLe: .9, aRx: lerp(1.0, 1.6, k), aRz: -.4, aRe: .6, lean: .25, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'side_r', mouth: 'smirk' });
  attach(APF, c.aR.hand, [0, -.5, .4], [lerp(-.3, -2.0, k), 0, 0], .9); const m = mugOf(c); attach(m, c.aL.hand, [.84, -.2, -.72], [PI / 2, 0, 0], 1); m.userData.level(lerp(0, .8, clamp((L.lt - .3) / 1)), L.T);
  onBody(c, 11, -.5, .2, 42, L.k, 9.5, -.4, 4.4); sh(V(-36, 0, -30), 16); }, [[0, 'whoosh_soft', .4], [.2, 'pour', .7]]);
// 63 «in einen Bierkrug gefüllt.»: bebe… y su Bierzähler pita en rojo: BETRUG!; aparecen dos policías
shot(75.54, 'F', null, L => { town(L, { night: true, bg: false }); const c = put(schum, -38, 0, -30, PI / 2 - .3); drink(c, L, L.t0, .4, { meter: true, after: 'shock', afterMouth: 'scream' }); mugOf(c).userData.level(.6, L.T); meterOf(c).userData.set('BETRUG!', 'APFELSCHORLE', '#ff4a4a', 1);
  TINT = Math.floor(L.T * 8) % 2 ? 'rgba(255,30,40,.18)' : 'rgba(40,80,255,.14)'; badge('red', 'BETRUG!', W / 2, H * .2, clamp((L.lt - .6) / .2), 1, 1.2);
  COPS.forEach((p, i) => { put(p, -38 + 6 + i * 3, 0, -30 + (i ? 3 : -3) - lerp(4, 0, clamp((L.lt - .7) / .4)), -PI / 2); actuar(p, 0, [[0, { aRx: 1.7, aRe: .1 }]], { T: L.T }); cara(p, L.T, { expr: 'angry', mouth: 'talk_wide' }); });
  onBody(c, 13, -.4, .14, 44, L.k, 11, -.3, 4.4); sh(V(-36, 0, -30), 18); }, [[0, 'gulp', .5], [.5, 'alarm', .7], [.7, 'siren', .5]]);
// 64 «30 Jahre.»: en el tribunal la jueza da el mazazo: «30 JAHRE»
shot(76.84, 'C', 'punch', L => { gerS(L); const j = put(rich, GEX, 3.0, -12.4, 0); const k = clamp((L.lt - .12) / .1); actuar(j, 0, [[0, { aRx: lerp(2.6, 1.2, k), aRe: .3 }]], { T: L.T }); attach(GAVEL, j.aR.hand, [0, -.8, .4], [0, 0, 0], 1.2); cara(j, L.T, { expr: 'angry', mouth: 'talk' }); if (L.lt > .22) SHAKE = Math.max(0, 1 - (L.lt - .22) / .3);
  const d = put(schum, GEX + 5, 0, 4, PI - .4); actuar(d, 0, [[0, 'hands_head']], { T: L.T }); cara(d, L.T, { expr: 'cry' }); badge('red', '30 JAHRE', W / 2, H * .2, clamp((L.lt - .22) / .2), 1, 1.4);
  cm([GEX + 6, 9.5, 12, GEX + 2, 8.4, -6, 50], [GEX + 5, 9.5, 10, GEX + 2, 8.4, -6, 48], L.k); sh(V(GEX, 0, -4), 22); }, [[.22, 'gavel', 1], [.3, 'gasp', .4]]);
// ---------- c: yo, el estómago pequeño y el goldener Krug (77,9 – 103,7 s) ----------
// Felix en la plaza (0, 0, 9). Cervecería abandonada (ABX): puerta tapiada en (0, -20,4). Sótano (KEX): balda con el Krug en (0, 5.4, -18.3), barriles a x = ±13.
// barrigas para los grandullones de la comparación
const BELLY = [0, 1].map(() => { const b = P_(sphere(1.4, mat(0xf4f4f0, { roughness: .8 }), null, 0, 0, 0, 18, 12)); b.scale.set(1, .9, .8); return b; });
// chorro de cerveza (botella → Krug)
const STREAM = P_(cyl(.09, .07, 1, mat(0xf6a81c, { emissive: 0x8a4a00, emissiveIntensity: .5, roughness: .1, transparent: true, opacity: .9 }), 8, null));
function streamTo(a, b) { STREAM.visible = true; const d = b.clone().sub(a); STREAM.position.copy(a).addScaledVector(d, .5); STREAM.scale.set(1, d.length(), 1); STREAM.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); }
// Felix con la linterna: el foco sale de la mano izquierda en la dirección en la que mira
function linterna(c, target) { attach(FLASH, c.aL.hand, [0, -.7, .3], [PI / 2, 0, 0], 1); const p = wpos(FLASH); FLASHL.intensity = 160; FLASHL.position.copy(p); FLASHL.target.position.copy(target); FLASHL.color.setRGB(1, .94, .78); }
const KGP = V(KEX, 5.4, -18.3);
// placa de rayos X (2D) con el estómago diminuto
function xray(L, k) { FX2D.push(c => { if (k <= 0) return; const s = spring(clamp(k) * 1.3), x = W * .7, y = H * .36; c.save(); c.translate(x, y); c.scale(s, s); c.rotate(.06); c.fillStyle = '#0a1a2e'; c.strokeStyle = '#ffffff'; c.lineWidth = 8; c.beginPath(); c.roundRect(-190, -250, 380, 500, 26); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(190,230,255,.75)'; c.lineWidth = 10; c.beginPath(); c.roundRect(-70, -220, 140, 140, 40); c.stroke(); c.beginPath(); c.moveTo(0, -80); c.lineTo(0, 170); c.stroke(); for (let i = 0; i < 6; i++) { c.beginPath(); c.ellipse(0, -40 + i * 28, 110 - i * 4, 14, 0, Math.PI, 0); c.stroke(); }
  const pul = 1 + Math.sin(L.T * 8) * .08; c.fillStyle = '#ff4a6a'; c.beginPath(); c.ellipse(-22, 150, 16 * pul, 11 * pul, -.4, 0, 7); c.fill(); c.strokeStyle = '#ffd23f'; c.lineWidth = 6; c.beginPath(); c.arc(-22, 150, 44, 0, 7); c.stroke();
  c.fillStyle = '#ffd23f'; c.font = `700 40px ${FONT}`; c.textAlign = 'center'; c.fillText('MAGEN: MINI', 0, 225); c.restore(); }); }

// 65 «Und ich?»: Felix, gorro mostaza y sudadera gris, en medio de la plaza; todos beben a su alrededor y él saluda con timidez
shot(77.94, 'Z', null, L => { town(L); const c = put(felix, 0, 0, 9, 0); actuar(c, L.lt, [[0, 'idle'], [.1, 'wave', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); meterOf(c).userData.set('0 Bier', '0 €');
  crowdAt(L, 0, 9, 10, 6, 14, 71, { mode: i => ['drink', 'prost'][i % 2], gap: 1.1 }); onBody(c, 16, 0, .12, 44, L.k, 13, 0, 4); sh(V(0, 0, 9), 24); }, [[0, 'zoom_in', .4], [.15, 'hey', .4]]);
// 66 «Ich hatte keinen einzigen Cent.»: abre la cartera: vacía; sale volando una polilla. Bierzähler: 0 €
shot(78.54, 'W', null, L => { town(L); const c = put(felix, 0, 0, 9, 0); actuar(c, 0, [[0, { aLx: 1.0, aLe: 1.0, aLz: -.35, aRx: 1.0, aRe: 1.0, aRz: -.35, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', eyes: 'down', mouth: 'frown' }); meterOf(c).userData.set('0 Bier', '0 €', '#ff4a4a');
  const wp = hp(c).add(V(0, -2.0, 1.6)); show(WALLET, wp.x, wp.y, wp.z, 0, 1); WALLET.rotation.x = .9; const t = clamp((L.lt - .3) / 1.2); show(MOTH, wp.x + t * 3, wp.y + .5 + t * 5 + Math.sin(L.T * 10) * .3, wp.z + t * 2, 0, 1); MOTH.children.forEach(w => { if (w.name) w.rotation.y = (w.name === 'w1' ? 1 : -1) * Math.sin(L.T * 30) * .9; });
  badge('red', '0,00 €', W / 2, H * .2, clamp((L.lt - .2) / .2), 1, 1.1); onFace(c, 7.6, .4, -.3, 40, L.k, 6.6); sh(V(0, 0, 9), 14); }, [[0, 'wallet', .5], [.3, 'moth', .6], [.6, 'sad_trombone', .4]]);
// 67 «Denn ich habe den kleinsten Magen»: radiografía junto a Felix: el estómago es diminuto; él se toca la barriga avergonzado
shot(80.24, 'S', null, L => { town(L, { bg: false }); const c = put(felix, -6, 0, 6, .3); actuar(c, 0, [[0, { aRx: .8, aRe: 1.6, aRz: -.4, aLx: .6, aLe: 1.5, aLz: -.4, headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'frown' }); xray(L, clamp((L.lt - .1) / .25));
  onBody(c, 15, .15, .1, 44, L.k, 13, .2, 4.4); sh(V(-6, 0, 6), 18); }, [[0, 'xray', .6], [.3, 'heartbeat', .4]]);
// 68 «der ganzen Stadt.»: Felix, flaquito, entre dos grandullones con barrigas enormes que se ríen
shot(81.56, 'F', null, L => { town(L, { bg: false }); const c = put(felix, 0, 0, 6, 0); actuar(c, 0, [[0, { aLx: .2, aRx: .2, lean: -.04, headY: Math.sin(L.T * 3) * .3 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'frown' });
  [TR[0], TR[2]].forEach((g, i) => { put(g, (i ? 1 : -1) * 4.6, 0, 6.4, (i ? -1 : 1) * .3); g.root.scale.setScalar(1.18); attach(BELLY[i], g.spine, [0, .8, .55], [0, 0, 0], 1); holdOnly(g, L, { pose: { aLx: .4, aLz: .3, lean: -.12 } }); laughF(g, L.T + i); });
  orbit(V(0, 5.4, 6), lerp(25, 22, L.k), 0, .1, 46); sh(V(0, 0, 6), 18); }, [[0, 'flash', .4], [.1, 'laugh_m', .5], [.4, 'boing', .4]]);
// 69 «Während die anderen eine Maß»: en la mesa, los demás se beben una Maß tras otra; las vacías se apilan
shot(82.42, 'W', null, L => { town(L); for (let i = 0; i < 4; i++) { const c = sit2(CR[30 + i], -18.8 + i * 3.2 + (i > 1 ? .8 : 0), 21.7, 0); drink(c, L, L.t0 - (i * .3) % .8, .55, { sit: true, pose: SITP, bg: true, expr: 'happy', up: .15, dn: .15 }); }
  for (let i = 0; i < 6; i++) { const m = KRUG[i]; show(m, -9.6 + (i % 2) * 1.1, 4.15 + Math.floor(i / 2) * 1.32, 24.6, 0, 1); m.userData.level(0, 0); }
  orbit(V(-14, 5, 21.7), lerp(17, 15, L.k), -.4, .16, 46); sh(V(-14, 0, 22), 18); }, [[0, 'gulp', .5], [.4, 'glass_down', .5], [.8, 'gulp', .4], [1.2, 'glass_down', .5]]);
// 70 «nach der anderen leerten,»: Resi deja en la mesa jarras vacías una tras otra: ¡clonc, clonc, clonc!
shot(84.09, 'C', null, L => { town(L); const c = put(resi, 14, 0, 19.4, 0); const j = Math.floor(L.lt / .25); actuar(c, 0, [[0, { aRx: 1.0 + Math.abs(Math.sin(L.lt / .25 * PI)) * .5, aRe: .8, aLx: .6, lean: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'joy' });
  for (let i = 0; i <= Math.min(j, 6); i++) { const m = KRUG[i]; show(m, 10.5 + i * 1.2, 4.15, 23, 0, 1); m.userData.level(0, 0); } 
  cm([14, 8.5, 32, 13, 5, 23, 40], [14, 8, 30, 13, 5, 23, 38], L.k); sh(V(14, 0, 23), 16); }, [[0, 'glass_down', .6], [.25, 'glass_down', .6], [.5, 'glass_down', .6], [.75, 'glass_down', .6]]);
// 71 «schaffte ich ein einziges Bier.»: Felix sentado bebe su única Maß con esfuerzo, sudando
shot(85.13, 'S', null, L => { town(L); const c = sit2(felix, 14, 21.7, 0); drink(c, L, L.t0 + .1, 1.2, { sit: true, pose: SITP, meter: true, expr: 'worried', eyesD: 'squint', l1: .0 }); sweat(c, L.T, 2); meterOf(c).userData.set('0 Bier', '0 €');
  tableFolk(L, 1, -1, 2, 'sitdrink', 6, { dx: 6 }); dcam(c, L.k, 11, -1.0, 4.2); sh(V(14, 0, 22), 16); }, [[0, 'swipe', .4], [.1, 'gulp_long', .5], [.8, 'cough', .3]]);
// 72 «20 Euro.»: un único billete de 20 cae girando; él lo mira decepcionado
shot(86.82, 'Z', 'punch', L => { town(L); const c = sit2(felix, 14, 21.7, 0); holdOnly(c, L, { sit: true, pose: { ...SITP, headX: .1 } }); mugOf(c).userData.level(0, 0); cara(c, L.T, { expr: 'bored', mouth: 'flat' }); meterOf(c).userData.set('1 Bier', '20 €'); setHUD(1);
  billDrop(c, L.t0, L.T, 1); badge('green', '+20 €', W / 2, H * .2, clamp(L.lt / .2), 1, .9); onFace(c, 6.6, .3, .4, 40, L.k, 5.8); sh(V(14, 0, 22), 14); }, [[0, 'cash', .5], [.3, 'paper', .4], [.6, 'sad_trombone', .3]]);
// 73 «Dann kam der Schluckauf.»: ¡HICKS! Felix da un respingo con cada hipo; los de la mesa se ríen
shot(87.84, 'R', null, L => { town(L); const ts = [L.t0 + .15, L.t0 + .75, L.t0 + 1.3]; const j = hipPose(L.T, ts); const c = put(felix, 14, j * .7, 17, 0); actuar(c, 0, [[0, { aLx: .4 + j, aRx: .4 + j, aLz: .3, aRz: .3, headX: -j * .3, lean: -j * .1 }]], { T: L.T }); cara(c, L.T, { expr: j > .3 ? 'shock' : 'worried', mouth: j > .3 ? 'o' : 'frown' });
  ts.forEach((t, i) => hicks(c, clamp((L.T - t) / .15) * (L.T - t < .5 ? 1 : 0), .9, i % 2 ? -1 : 1)); crowdAt(L, 14, 17, 5, 6, 11, 73, { mode: 'cheer', gap: 1.4 });
  onBody(c, 15, .1, .12, 44, L.k, 12.5, 0, 4); sh(V(14, 0, 20), 18); }, [[.15, 'hiccup', .9], [.75, 'hiccup', .9], [1.3, 'hiccup', .9], [.4, 'laugh_m', .4]]);
// 74 «Bis ich eines Nachts etwas fand.»: de noche, Felix camina solo por la calle con una linterna
shot(89.38, 'B', null, L => { town(L, { night: true, bg: false }); const c = put(felix, -30, 0, 40 - L.lt * 3, PI); actuar(c, 0, [[0, { ...walkP(L.T, 0), aLx: 1.3, aLe: .3 }]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 9)) * .1; cara(c, L.T, { expr: 'worried', eyes: 'side_l' }); linterna(c, V(-30, 0, 20 - L.lt * 3));
  orbit(V(-30, 4.4, 40 - L.lt * 3), lerp(18, 15, L.k), PI - .5, .14, 46); sh(V(-30, 0, 36), 24); }, [[0, 'night_amb', .6], [.2, 'steps', .4], [.5, 'owl', .3]]);
// 75 «Im Keller einer verlassenen Brauerei,»: la cervecería abandonada de noche; Felix se cuela entre las tablas de la puerta
shot(91.21, 'W', null, L => { altS(L); const c = put(felix, ABX + lerp(6, 1, easeOut(clamp(L.lt / 1))), 0, -17.8, PI + .5); actuar(c, 0, [[0, { ...walkP(L.T * .7, 0), crouch: .3, lean: .25, aLx: 1.3, aLe: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); linterna(c, V(ABX, 4, -21));
  cm([ABX + 8, 9, 24, ABX, 11, -20, 50], [ABX + 6, 8, 16, ABX, 9, -20, 48], L.k); sh(V(ABX, 0, -16), 36); DOF = 0; }, [[0, 'wind', .5], [.3, 'creak', .6], [.8, 'wood_crack', .4]]);
// 76 «ganz hinten unter Spinnweben:»: en el sótano, el haz de la linterna atraviesa telarañas y barriles; Felix avanza encogido
shot(93.07, 'S', null, L => { kellerS(L); KE.GK.visible = true; const c = put(felix, KEX + 1.5, 0, -2 - L.lt * 2.4, PI); actuar(c, 0, [[0, { ...walkP(L.T * .6, 0), crouch: .2, lean: .15, aLx: 1.4, aLe: .3, headY: Math.sin(L.T * 2) * .4 }]], { T: L.T }); cara(c, L.T, { expr: 'scared' }); linterna(c, KGP);
  KE.GK.userData.setGlow(.2); beam(L, V(KEX + 6, 6, -4), L.T); orbit(V(KEX + 1.5, 4.6, -3 - L.lt * 2.4), lerp(13, 11, L.k), PI - .5, .16, 46); sh(V(KEX, 0, -8), 22); }, [[0, 'drip', .5], [.3, 'creak', .4], [.6, 'rat', .3]]);
// 77 «einen goldenen Krug.» (zoom lento): en la última balda, entre botellas polvorientas, el goldener Krug brilla
shot(94.66, 'F', 'slow', L => { kellerS(L); KE.GK.visible = true; KE.GK.userData.setGlow(.35 + Math.sin(L.T * 3) * .15); FLASHL.intensity = 130; FLASHL.position.set(KEX + 2, 7, -6); FLASHL.target.position.copy(KGP);
  confetti(KGP.clone().add(V(0, 1, 0)), L.t0 + .2, L.T, 12, .3); cm([KEX + 1.2, 7, -7, KEX, 6.2, -18.3, 40], [KEX + .4, 6.6, -12.4, KEX, 6.3, -18.3, 34], L.k, easeIn); sh(V(KEX, 0, -16), 14); DOF = 0; }, [[0, 'shimmer', .6], [.3, 'choir', .5]]);
// 78 «Darauf stand:»: Felix lo coge y le quita el polvo con la manga
shot(95.96, 'C', null, L => { kellerS(L); KE.GK.visible = false; const c = put(felix, KEX, 0, -14, 0); actuar(c, 0, [[0, { aRx: 1.2, aRe: 1.3, aRz: .1, aLx: 1.3, aLe: 1.2 + Math.sin(L.T * 14) * .2, aLz: -.4, headX: .3 }]], { T: L.T }); attach(GK2, c.aR.hand, [-.86, -.2, -.66], [PI / 2, 0, 0], .78); GK2.userData.setGlow(.3); GK2.userData.fill(0);
  cara(c, L.T, { expr: 'gasp' }); FLASHL.intensity = 130; FLASHL.position.set(KEX + 3, 8, -6); FLASHL.target.position.set(KEX, 5, -14); dust(wpos(GK2), L.t0 + .2, L.T, 8, .4);
  onFace(c, 7, -.2, .8, 40, L.k, 6); sh(V(KEX, 0, -14), 14); }, [[0, 'wipe', .6], [.4, 'wipe', .5]]);
// 79 «„Warnung:»: primer plano de la placa grabada del Krug
shot(96.52, 'Z', null, L => { kellerS(L); show(GK2, KEX, 4, -14, 0, 1); GK2.userData.setGlow(.3); GK2.userData.fill(0); GK2.userData.setLid(0); FLASHL.intensity = 130; FLASHL.position.set(KEX + 2, 8, -8); FLASHL.target.position.set(KEX, 4.7, -14);
  cm([KEX + .3, 5.2, -8.6, KEX, 4.8, -14, 30], [KEX + .2, 5.1, -9.6, KEX, 4.8, -14, 28], L.k); sh(V(KEX, 0, -14), 8); DOF = 0; }, [[0, 'zoom_in', .4], [.1, 'warning', .6]]);
// 80 «Niemals mehr»: la cámara baja por el grabado
shot(97.55, 'S', null, L => { kellerS(L); show(GK2, KEX, 4, -14, 0, 1); GK2.userData.setGlow(.3); GK2.userData.fill(0); FLASHL.intensity = 130; FLASHL.position.set(KEX + 2, 8, -8); FLASHL.target.position.set(KEX, 4.7, -14);
  badge('red', 'NIEMALS MEHR', W / 2, H * .2, clamp(L.lt / .2), 1, 1); cm([KEX - .4, 4.9, -10, KEX, 4.75, -14, 24], [KEX + .4, 4.8, -10, KEX, 4.75, -14, 24], L.k); sh(V(KEX, 0, -14), 8); DOF = 0; }, [[0, 'tense', .5]]);
// 81 «als ein Bier."»: Felix lee y traga saliva
shot(98.39, 'C', 'punch', L => { kellerS(L); KE.GK.visible = false; const c = put(felix, KEX, 0, -14, 0); actuar(c, 0, [[0, { aRx: 1.2, aRe: 1.4, aRz: .1, headX: .32 }]], { T: L.T }); attach(GK2, c.aR.hand, [-.86, -.2, -.66], [PI / 2, 0, 0], .78); GK2.userData.setGlow(.3); cara(c, L.T, { expr: 'worried', mouth: 'o' });
  badge('red', 'NUR 1 BIER!', W / 2, H * .2, clamp(L.lt / .2), 1, 1.1); FLASHL.intensity = 130; FLASHL.position.set(KEX + 3, 8, -6); FLASHL.target.position.set(KEX, 5, -14); onFace(c, 5.6, .1, .5, 40, L.k, 5); sh(V(KEX, 0, -14), 12); }, [[0, 'gulp_nervous', .6], [.2, 'thump', .4]]);
// 82 «Also füllte ich ihn natürlich»: sonrisa traviesa; deja el Krug sobre un barril y saca una Weihenstephaner
shot(99.55, 'W', null, L => { kellerS(L); KE.GK.visible = false; const c = put(felix, KEX + 1, 0, -10, -.3); actuar(c, 0, [[0, { aLx: 1.6, aLe: 1.0, aLz: -.2, aRx: .3 }]], { T: L.T }); attach(BW, c.aL.hand, [0, -.7, .3], [-.3, 0, 0], .8); cara(c, L.T, { expr: 'wink' });
  show(GK2, KEX - 2.4, 3.6, -9.4, .3, .9); GK2.userData.setGlow(.3); GK2.userData.fill(0); const f = FASS[0]; show(f, KEX - 2.4, 0, -9.4, 0, .9); FLASHL.intensity = 130; FLASHL.position.set(KEX + 4, 9, -2); FLASHL.target.position.set(KEX, 4, -10);
  onBody(c, 13, -.5, .12, 44, L.k, 11, -.4, 4.4); sh(V(KEX, 0, -10), 14); }, [[0, 'swipe', .4], [.2, 'chuckle_m', .5], [.6, 'bottle_open', .6]]);
// 83 «bis zum Rand.»: vierte la Weihenstephaner en el Krug; la espuma sube hasta el borde
shot(100.77, 'F', null, L => { kellerS(L); const c = put(felix, KEX - .2, 0, -9.6, -PI / 2 + .25); const k = clamp(L.lt / 1.0); actuar(c, 0, [[0, { aLx: 1.7, aLz: -.3, aLe: .6, headX: .35, headY: .2 }]], { T: L.T }); attach(BW, c.aL.hand, [0, -.6, .4], [-.3 - k * 1.2, 0, 0], .8); cara(c, L.T, { expr: 'happy', eyes: 'down' });
  show(GK2, KEX - 2.4, 3.6, -9.4, .3, .9); GK2.userData.setGlow(.3); GK2.userData.fill(k); show(FASS[0], KEX - 2.4, 0, -9.4, 0, .9); POST.push(() => { BW.updateMatrixWorld(true); const top = BW.localToWorld(V(0, 2.55, 0)); streamTo(top, V(KEX - 2.4, 3.6 + 1.5 * .9 * k + .2, -9.4)); });
  FLASHL.intensity = 130; FLASHL.position.set(KEX + 3, 9, -3); FLASHL.target.position.set(KEX - 2.4, 4, -9.4); cm([KEX - 1, 6.4, -2.6, KEX - 2.2, 4.8, -9.4, 38], [KEX - 1.2, 6.2, -4, KEX - 2.2, 4.8, -9.4, 36], L.k); sh(V(KEX, 0, -9), 12); }, [[0, 'pour', .8], [.6, 'fizz', .6]]);
// 84 «Mit Weihenstephaner, versteht sich.»: Felix guiña el ojo con la botella junto a la cara, la etiqueta bien visible
shot(101.91, 'R', null, L => { kellerS(L); const c = put(felix, KEX, 0, -9, 0); actuar(c, 0, [[0, { aLx: 2.2, aLz: -.25, aLe: 1.7, headY: .15 }]], { T: L.T }); POST.push(() => { const h = c.aL.hand.localToWorld(V(0, -.6, .6)); show(BW, h.x, h.y - 1.2, h.z, 0, 1.3); BW.rotation.y = Math.atan2(camera.position.x - h.x, camera.position.z - h.z) + PI; }); cara(c, L.T, { expr: 'wink', mouth: 'smirk' });
  FLASHL.intensity = 130; FLASHL.position.set(KEX + 3, 9, -2); FLASHL.target.position.set(KEX, 6, -9); confetti(hp(c).add(V(0, 1, 0)), L.t0, L.T, 16, .35); onFace(c, 6.4, .2, -.5, 40, L.k, 5.6); sh(V(KEX, 0, -9), 12); }, [[0, 'whirl', .4], [.2, 'wink', .5], [.4, 'sparkle', .4]]);
// ---------- d: el Krug que no se vacía y la ciudad inundada de cerveza (103,7 – 139,5 s) ----------
// Felix en el sótano en (KEX, 0, -9) mirando +z; el Krug dorado en su mano derecha (kind 'gold').
const kel = (L, lamp = 1) => { kellerS(L); KE.GK.visible = false; FLASHL.intensity = 140 * lamp; FLASHL.position.set(KEX + 3, 9, -1); FLASHL.target.position.set(KEX, 5, -9); FILL.intensity = 8; };
const fel = (x = 0, z = -9, ry = 0) => put(felix, KEX + x, 0, z, ry);
const fluten = (lvl, T, x = 0, z = 0) => { FLOOD.visible = true; FLOOD.position.x = x; FLOOD.position.z = z; FLOOD.userData.set(lvl, T); };
// cuenta de cervezas de la escena del Krug: 0 en 111,1 s → 1 → 5 → 20 → 100 → 200 → 300 → 500 en 143,8 s
const KC = [[111.12, 0], [111.5, 1], [112.96, 1], [113.3, 5], [114.61, 5], [115.0, 20], [119.59, 20], [119.9, 100], [120.33, 100], [120.6, 200], [121.28, 200], [121.6, 300], [139.5, 480], [143.81, 499], [144.1, 500]];
const kCount = T => { if (T <= KC[0][0]) return 0; for (let i = 1; i < KC.length; i++) if (T <= KC[i][0]) return lerp(KC[i - 1][1], KC[i][1], (T - KC[i - 1][0]) / (KC[i][0] - KC[i - 1][0])); return 500; };
// Felix bebiendo del Krug dorado sin parar (en bucle de tragos)
function chugGold(L, o = {}) { const c = fel(o.x, o.z, o.ry); const r = drink(c, L, o.t0 ?? L.t0 - .5, 99, { kind: 'gold', meter: true, expr: o.expr || 'shock', eyesD: o.eyesD || 'wide', pose: o.pose }); GK2.userData.setGlow(o.glow ?? .6 + Math.sin(L.T * 9) * .2); GK2.userData.fill(1); const n = kCount(L.T); meterOf(c).userData.set(nBier(n) + ' Bier', euro(money(n)), n >= 20 ? '#ffd23f' : '#7aff9a'); setHUD(n, n >= 20 ? '#ffd23f' : '#7aff9a'); return c; }

// 85 «Und trank ihn leer.»: Felix se bebe el Krug dorado de un trago, cabeza hacia atrás
shot(103.71, 'Z', null, L => { kel(L); const c = fel(); drink(c, L, L.t0 + .05, .8, { kind: 'gold', meter: true, expr: 'determined' }); GK2.userData.setGlow(.3); GK2.userData.fill(1 - clamp((L.lt - .3) / .7)); meterOf(c).userData.set('1 Bier', '20 €');
  dcam(c, L.k, 10, -1.0, 4.8); sh(V(KEX, 0, -9), 14); }, [[0, 'swoosh_up', .4], [.1, 'gulp_long', .8]]);
// 86 «Ein paar Sekunden lang:»: baja el Krug y espera, mirándolo… silencio
shot(104.80, 'S', null, L => { kel(L); const c = fel(); holdOnly(c, L, { kind: 'gold', pose: { headX: .3, aLx: .3 } }); GK2.userData.setGlow(.3); GK2.userData.fill(0); cara(c, L.T, { expr: 'confused', mouth: 'flat' });
  badge('q', '…', W / 2, H * .22, clamp(L.lt / .3), 1, 1); onFace(c, 7.6, .2, .3, 40, L.k, 6.4); sh(V(KEX, 0, -9), 14); }, [[0, 'tick', .4], [.4, 'tick', .4], [.8, 'tick', .4]]);
// 87 «nichts.»: plano general del sótano: no pasa nada; se encoge de hombros (grillos)
shot(105.78, 'C', null, L => { kel(L); const c = fel(); actuar(c, L.lt, [[0, 'idle'], [.1, 'shrug', { dur: .3 }]], { T: L.T }); holdMug(c, 'gold'); c.aR.sh.rotation.y = HOLDY; GK2.userData.setGlow(.3); GK2.userData.fill(0); cara(c, L.T, { expr: 'bored', mouth: 'flat' });
  cm([KEX + 6, 9, 8, KEX, 4, -10, 48], [KEX + 5, 9, 6, KEX, 4, -10, 48], L.k); sh(V(KEX, 0, -9), 18); }, [[0, 'crickets', .7]]);
// 88 «Dann wurde der Krug warm, und er»: el Krug se pone al rojo dorado y echa vapor; Felix da un respingo
shot(106.57, 'F', null, L => { kel(L, .6); const c = fel(); holdOnly(c, L, { kind: 'gold', pose: { headX: .25, lean: -.12, aLx: .9, aLz: .6, aLe: .3 } }); const k = clamp(L.lt / 1.2); GK2.userData.setGlow(.4 + k * 1.2); GK2.userData.fill(0); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  dust(wpos(GK2).add(V(0, 1, 0)), L.t0 + .1, L.T, 10, .5); FILL.color.setRGB(1, .7, .35); onFace(c, 6.4, -.3, .9, 40, L.k, 5.6); sh(V(KEX, 0, -9), 12); }, [[0, 'flash', .4], [.1, 'magic_rise', .6], [.5, 'sizzle', .5]]);
// 89 «füllte sich von selbst wieder.»: la cerveza sube sola dentro del Krug hasta coronarse de espuma
shot(108.20, 'W', null, L => { kel(L, .6); const c = fel(); holdOnly(c, L, { kind: 'gold', pose: { headX: .35, aLx: .6, aLz: .5 } }); const k = clamp(L.lt / 1.1); GK2.userData.setGlow(1.2); GK2.userData.fill(k); cara(c, L.T, { expr: 'gasp' });
  const p = wpos(GK2); confetti(p.clone().add(V(0, 1.2, 0)), L.t0 + .6, L.T, 16, .3); cm([p.x + .8, p.y + 2.6, p.z + 3.4, p.x, p.y + .9, p.z, 36], [p.x + .6, p.y + 2.2, p.z + 2.8, p.x, p.y + 1, p.z, 34], L.k); sh(V(KEX, 0, -9), 10); DOF = 0; }, [[0, 'fizz', .7], [.4, 'magic_hit', .5]]);
// 90 «Mein Bierzähler fing an zu rattern.»: el Bierzähler del pecho tiembla y sus cifras giran
shot(109.60, 'R', null, L => { kel(L, .6); const c = fel(); holdOnly(c, L, { kind: 'gold', pose: { headX: .4 } }); GK2.userData.setGlow(1.0); GK2.userData.fill(1); cara(c, L.T, { expr: 'shock', eyes: 'down' }); const m = meterOf(c); const r = RNG(Math.floor(L.T * 30)); m.userData.set(Math.floor(r() * 99) + ' Bier', Math.floor(r() * 9999) + ' €', '#ffd23f'); m.rotation.z = Math.sin(L.T * 60) * .06;
  const mp = wpos(m); cm([mp.x + .8, mp.y + 1.2, mp.z + 5, mp.x, mp.y + .3, mp.z, 34], [mp.x + .5, mp.y + 1, mp.z + 4, mp.x, mp.y + .3, mp.z, 32], L.k); SHAKE = .3; sh(V(KEX, 0, -9), 10); DOF = 0; }, [[0, 'counter_fast', .8], [.4, 'rattle', .6]]);
// 91 «Ein Bier.»: empieza a beber del Krug; HUD: 1 Bier
shot(111.12, 'C', null, L => { kel(L); const c = chugGold(L, { t0: L.t0 - .2, expr: 'determined', eyesD: 'closed' }); dcam(c, L.k, 10, -1.0, 4.8); sh(V(KEX, 0, -9), 14); }, [[0, 'gulp', .6], [.4, 'ding_soft', .4]]);
// 92 «20 Euro.»: un billete de 20 cae a su lado
shot(111.94, 'Z', null, L => { kel(L); const c = chugGold(L, { expr: 'happy' }); billDrop(c, L.t0, L.T, 3, 1.4); cashPop(c, '+20 €', clamp(L.lt / .2), 'green', 1); orbit(V(KEX, 5.4, -9), lerp(12, 11, L.k), .7, .1, 42); sh(V(KEX, 0, -9), 14); }, [[0, 'cash', .6], [.2, 'gulp', .4]]);
// 93 «5 Bier.»: el Krug se rellena una y otra vez; 5
shot(112.96, 'C', null, L => { kel(L); const c = chugGold(L, { expr: 'shock' }); badge('num', '5', W / 2, H * .3, clamp((L.lt - .2) / .2), 1, 1.6); onFace(c, 7, .6, -1.6, 40, L.k, 6.2); sh(V(KEX, 0, -9), 12); }, [[0, 'gulp', .6], [.3, 'ding', .5]]);
// 94 «600 Euro.»: estallido de billetes
shot(113.66, 'Z', null, L => { kel(L); const c = chugGold(L, { expr: 'shock' }); billBurst(hp(c), L.t0, L.T, 26, 1.1); cashPop(c, '+600 €', clamp(L.lt / .2), 'gold', 1.1); orbit(V(KEX, 5.4, -9), lerp(14, 12.5, L.k), -.6, .12, 44); sh(V(KEX, 0, -9), 14); }, [[0, 'money_burst', .6], [.1, 'cash_reg', .5]]);
// 95 «20 Bier.»: 20
shot(114.61, 'C', null, L => { kel(L); const c = chugGold(L, { expr: 'shock', eyesD: 'wide' }); badge('num', '20', W / 2, H * .3, clamp((L.lt - .3) / .2), 1, 1.6); dcam(c, L.k, 9, -1.3, 5); sh(V(KEX, 0, -9), 12); }, [[0, 'gulp', .6], [.4, 'ding', .5]]);
// 96 «Millionär.»: destello dorado, lluvia de billetes en el sótano: 1 MIO. €
shot(115.61, 'F', 'punch', L => { kel(L); const c = chugGold(L, { expr: 'shock' }); billRain(V(KEX, 0, -9), L.T, 70, 18, 14, 13, 3); badge('gold', 'MILLIONÄR', W / 2, H * .2, clamp(L.lt / .15), 1, 1.2); orbit(V(KEX, 5.4, -9), lerp(16, 14, L.k), .2, .14, 46); sh(V(KEX, 0, -9), 16); }, [[0, 'magic_hit', .7], [.05, 'money_rain', .6]]);
// 97 «Aber ich konnte nicht mehr aufhören.»: intenta apartar el Krug con la otra mano y no puede; tambalea, suda
shot(116.29, 'W', null, L => { kel(L); const c = chugGold(L, { expr: 'panic', eyesD: 'wide', pose: { aLx: 2.0, aLz: -.3, aLe: 1.6 + Math.sin(L.T * 12) * .2, lean: Math.sin(L.T * 4) * .12, twist: Math.sin(L.T * 3) * .2 } }); c.root.rotation.y = Math.sin(L.T * 3) * .25; sweat(c, L.T, 3);
  onBody(c, 13, -.8 + Math.sin(L.T) * .1, .1, 44, L.k, 11, -.6, 4.6); camera.up.set(Math.sin(L.T * 2) * .08, 1, 0); sh(V(KEX, 0, -9), 14); }, [[0, 'struggle', .6], [.3, 'gulp', .5], [.8, 'gulp', .5]]);
// 98 «Der Krug füllte sich immer wieder.»: primer plano del Krug: la espuma rebosa y vuelve a subir
shot(117.92, 'S', null, L => { kel(L); const c = chugGold(L, { expr: 'shock' }); const p = wpos(GK2); foamOver(p.clone().add(V(0, .6, 0)), L.T, 22, .9, 1.4);
  orbit(V(KEX, 6.4, -9), lerp(8, 7, L.k), -1.25, .08, 40); sh(V(KEX, 0, -9), 10); }, [[0, 'fizz', .7], [.3, 'bubbling', .5]]);
// 99 «100 Bier.»
shot(119.59, 'C', 'punch', L => { kel(L); const c = chugGold(L, { expr: 'panic' }); badge('num', '100', W / 2, H * .28, clamp(L.lt / .15), 1, 1.8); foamOver(wpos(GK2).add(V(0, .6, 0)), L.T, 18, .9, 1.4); orbit(V(KEX, 5.4, -9), lerp(11, 10, L.k), .5, .1, 42); sh(V(KEX, 0, -9), 12); }, [[0, 'impact', .6], [.05, 'ding', .5]]);
// 100 «200 Bier.»
shot(120.33, 'C', 'punch', L => { kel(L); const c = chugGold(L, { expr: 'panic' }); badge('num', '200', W / 2, H * .28, clamp(L.lt / .15), 1, 1.9); foamOver(wpos(GK2).add(V(0, .6, 0)), L.T, 26, 1, 1.6); orbit(V(KEX, 5.4, -9), lerp(12, 11, L.k), -.7, .12, 42); sh(V(KEX, 0, -9), 12); }, [[0, 'impact', .6], [.05, 'ding', .5]]);
// 101 «300 Bier!»: la espuma empieza a llenar el sótano
shot(121.28, 'F', 'punch', L => { kel(L); const c = chugGold(L, { expr: 'panic' }); fluten(lerp(0, .8, L.k), L.T, KEX, -9); badge('gold', '300', W / 2, H * .28, clamp(L.lt / .15), 1, 2); foamOver(wpos(GK2).add(V(0, .6, 0)), L.T, 32, 1.2, 2); orbit(V(KEX, 5.4, -9), lerp(16, 14, L.k), .1, .16, 46); sh(V(KEX, 0, -9), 16); }, [[0, 'impact', .7], [.05, 'ding_reveal', .5], [.2, 'fizz', .6]]);
// 102 «Der Schaum quoll über den Rand,»: la espuma sale a borbotones del Krug y sube por la escalera del sótano
shot(122.39, 'Z', null, L => { kel(L); const c = chugGold(L, { expr: 'panic' }); fluten(lerp(.8, 2.4, L.k), L.T, KEX, -9); foamOver(wpos(GK2).add(V(0, .4, 0)), L.T * 1.4, 40, 1.6, 2.6);
  cm([KEX - 8, 8, 6, KEX, 4, -10, 48], [KEX - 6, 9, 3, KEX, 4.4, -10, 48], L.k); sh(V(KEX, 0, -9), 18); }, [[0, 'foam_gush', .8], [.4, 'bubbling', .5]]);
// 103 «lief über die Straßen»: un río de cerveza y espuma corre por la calle; la gente corre
shot(123.93, 'W', null, L => { town(L, { bg: false }); fluten(lerp(.3, 1.4, L.k), L.T); crowdAt(L, 0, 20, 10, 4, 14, 81, { mode: 'run', dir: PI, face: V(0, 0, -40), full: true });
  cm([12, 6, 60, 0, 2, 10, 50], [10, 7, 52, 0, 2.5, 10, 50], L.k); sh(V(0, 0, 20), 34); DOF = 0; }, [[0, 'river', .7], [.2, 'screams', .4]]);
// 104 «und füllte die ganze Stadt.»: grúa sobre Brauheim inundado de cerveza dorada hasta las ventanas
shot(124.87, 'S', null, L => { town(L); fluten(lerp(2, 6, L.k), L.T); cm([0, 40, 120, 0, 2, -20, 50], [0, 70, 140, 0, 2, -30, 52], L.k); sh(V(0, 0, -10), 80); DOF = 0; }, [[0, 'whoosh', .4], [.2, 'river', .6], [.6, 'bells', .4]]);
// 105 «Autos schwammen davon,»: el taxi y un deportivo flotan a la deriva, cabeceando
shot(126.62, 'R', null, L => { town(L, { bg: false }); fluten(4.6, L.T); const b = t => Math.sin(L.T * 1.6 + t) * .4; show(CAR1, -6 + L.lt * 2, 3.6 + b(0), 20 + L.lt * 1.5, .6 + Math.sin(L.T) * .2, 1); CAR1.rotation.z = Math.sin(L.T * 1.3) * .1; show(CAR2, 10 - L.lt * 2.4, 3.8 + b(2), 34, -.9 + Math.sin(L.T * .8) * .2, 1); CAR2.rotation.x = Math.sin(L.T * 1.5) * .08;
  orbit(V(2, 5, 26), lerp(30, 26, L.k), .3, .2, 48); sh(V(2, 0, 26), 30); }, [[0, 'water_slosh', .7], [.4, 'car_horn', .4]]);
// 106 «der Brunnen auf dem»: la fuente de la plaza escupe chorros de cerveza
shot(127.91, 'W', null, L => { town(L, { bg: false }); fluten(1.2, L.T); jet(V(-14, 0, -26), L.T, 36, 14, 6); orbit(V(-14, 7, -26), lerp(30, 26, L.k), .4, .16, 48); sh(V(-14, 0, -26), 26); }, [[0, 'fountain', .7]]);
// 107 «Marktplatz sprudelte Bier,»: los vecinos ponen sus jarras bajo el chorro y brindan
shot(128.59, 'C', null, L => { town(L, { bg: false }); fluten(1.2, L.T); jet(V(-14, 0, -26), L.T, 36, 14, 6); for (let i = 0; i < 4; i++) { const a = -1 + i * .7, c = put(CR[24 + i], -14 + Math.sin(a) * 9, 0, -26 + Math.cos(a) * 9, a + PI); prost(c, L, .8 + Math.sin(L.T * 5 + i) * .15); laughF(c, L.T + i); }
  orbit(V(-14, 5, -22), lerp(20, 17, L.k), .1, .12, 46); sh(V(-14, 0, -24), 22); }, [[0, 'fountain', .6], [.2, 'cheer', .5], [.5, 'splash', .5]]);
// 108 «und die Leute paddelten»: vecinos metidos en barriles reman por la plaza inundada
shot(129.89, 'S', null, L => { town(L, { bg: false }); const lv = 3.4; fluten(lv, L.T); for (let i = 0; i < 3; i++) { const x = -8 + i * 8, z = 20 - L.lt * 3 + i * 4, bb = Math.sin(L.T * 2 + i) * .25; const f = show(FASS[i], x, lv - 2.2 + bb, z, 0, .85); f.rotation.z = Math.sin(L.T * 1.6 + i) * .08;
    const c = put(CR[28 + i], x, lv - 2.2 + bb + .6, z, PI); const s = Math.sin(L.T * 4 + i); actuar(c, 0, [[0, { aLx: 1.2 + s * .4, aRx: 1.2 - s * .4, aLz: .3, aRz: .3, aLe: .8, aRe: .8, twist: s * .3 }]], { T: L.T }); attach(PADDLE[i], c.aR.hand, [0, -.6, .3], [.3, 0, 0], 1); laughF(c, L.T + i); c.blob.visible = false; }
  orbit(V(0, 4, 22), lerp(26, 22, L.k), -.3, .18, 48); sh(V(0, 0, 22), 26); }, [[0, 'paddle', .6], [.4, 'paddle', .5], [.2, 'laugh_m', .4]]);
// 109 «in Fässern durch die Gassen.»: travelling bajo, a ras de cerveza, siguiendo un barril entre las casas
shot(131.04, 'W', null, L => { town(L, { bg: false }); const lv = 3.4; fluten(lv, L.T); const z = 50 - L.lt * 6, bb = Math.sin(L.T * 2) * .25; show(FASS[0], -36, lv - 2.2 + bb, z, 0, .85);
  const c = put(resi, -36, lv - 2.2 + bb + .6, z, PI); const s = Math.sin(L.T * 4); actuar(c, 0, [[0, { aLx: 1.2 + s * .4, aRx: 1.2 - s * .4, aLz: .3, aRz: .3, aLe: .8, aRe: .8, twist: s * .3 }]], { T: L.T }); attach(PADDLE[0], c.aR.hand, [0, -.6, .3], [.3, 0, 0], 1); laughF(c, L.T); c.blob.visible = false;
  for (let i = 1; i < 3; i++) { show(FASS[i], -30 - i * 2, lv - 2.2 + Math.sin(L.T * 2 + i) * .25, z - 8 * i, 0, .8); }
  cm([-38, lv + 2.2, z + 12, -36, lv + 3, z, 50], [-38, lv + 2.4, z + 10, -36, lv + 3, z, 50], L.k); sh(V(-36, 0, z), 20); }, [[0, 'paddle', .6], [.5, 'water_slosh', .5]]);
// 110 «Und mein Konto?»: el móvil de Felix: el saldo vuela
shot(132.32, 'Z', null, L => { kel(L); fluten(1.6, L.T, KEX, -9); show(PHONE, KEX, 6, -9, 0, 1.6); POST.push(() => PHONE.lookAt(camera.position)); const n = kCount(L.T); PHONE.userData.draw(cx => drawBankApp(cx, 300, 560, euro(money(n)), '+ + + + +', '#ffd23f'));
  cm([KEX + .4, 6.6, -4.6, KEX, 6, -9, 36], [KEX + .3, 6.4, -5.4, KEX, 6, -9, 34], L.k); sh(V(KEX, 0, -9), 8); DOF = 0; }, [[0, 'notif', .6], [.3, 'notif', .5], [.6, 'notif', .5]]);
// 111 «Es stieg und stieg.»: Felix sigue bebiendo con la espuma por las rodillas; el HUD no para
shot(133.27, 'C', null, L => { kel(L); fluten(1.6, L.T, KEX, -9); const c = chugGold(L, { expr: 'panic' }); foamOver(wpos(GK2).add(V(0, .6, 0)), L.T, 20, 1.2, 1.6); orbit(V(KEX, 5.6, -9), lerp(13, 11, L.k), -.4 + L.k * .3, .2, 44); sh(V(KEX, 0, -9), 14); }, [[0, 'counter_fast', .6], [.4, 'gulp', .4]]);
// 112 «Sogar der Bürgermeister»: el alcalde, con la cerveza por la cintura en su despacho, marca el teléfono
shot(134.75, 'W', null, L => { amtS(L); fluten(3.2, L.T, AMX, 0); const c = put(kranzl, AMX + 3, 0, -3, -.3); actuar(c, 0, [[0, { aRx: 2.4, aRz: -.2, aRe: 2.2, headY: .2 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.6, .5], [0, 0, 0], .9); cara(c, L.T, { expr: 'worried', mouth: 'talk' }); PHONE.userData.draw(cx => drawCall(cx, 300, 560, 'FELIX', 'ANRUF …'));
  onBody(c, 13, -.25, .14, 44, L.k, 11, -.15, 4.4); sh(V(AMX + 3, 0, -3), 16); }, [[0, 'water_slosh', .5], [.2, 'phone_dial', .6]]);
// 113 «hat mich angerufen.»: en el sótano vibra el móvil de Felix: «BÜRGERMEISTER»
shot(135.77, 'S', null, L => { kel(L); fluten(1.6, L.T, KEX, -9); show(PHONE, KEX + Math.sin(L.T * 60) * .05, 6, -9, 0, 1.6); POST.push(() => PHONE.lookAt(camera.position)); PHONE.userData.draw(cx => drawCall(cx, 300, 560, 'BÜRGERMEISTER', 'EINGEHENDER ANRUF'));
  cm([KEX + .4, 6.7, -3.4, KEX, 6, -9, 38], [KEX + .3, 6.6, -3.9, KEX, 6, -9, 36], L.k); sh(V(KEX, 0, -9), 8); DOF = 0; }, [[0, 'phone_vibrate', .8], [.4, 'ringtone', .5]]);
// 114 «Unter Tränen.»: primer plano del alcalde llorando al teléfono
shot(136.72, 'C', null, L => { amtS(L); fluten(3.2, L.T, AMX, 0); const c = put(kranzl, AMX + 3, 0, -3, -.3); actuar(c, 0, [[0, { aRx: 2.4, aRz: -.2, aRe: 2.2, headX: .1 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.6, .5], [0, 0, 0], .9); cara(c, L.T, { expr: 'cry', mouth: Math.sin(L.T * 9) > 0 ? 'ah' : 'frown' }); tears(c, L.T, 0);
  onFace(c, 6, .1, -.3, 40, L.k, 5.2); sh(V(AMX + 3, 0, -3), 12); }, [[0, 'cry_m', .7], [.4, 'sniff', .4]]);
// 115 «So etwas hatte die Stadt noch nie gesehen.»: los vecinos asomados a los balcones miran la ciudad de cerveza, boquiabiertos
shot(137.76, 'R', null, L => { town(L); fluten(5.5, L.T); for (let i = 0; i < 6; i++) { const c = put(CR[i + 4], [-18, -14, -10, 10, 14, 18][i], 4.15, 24 + (i % 2) * .6, (i < 3 ? .3 : -.3)); actuar(c, 0, [[0, i % 2 ? 'hands_head' : 'shock']], { T: L.T }); cara(c, L.T + i, { expr: 'shock', mouth: 'o' }); c.blob.visible = false; }
  cm([0, 12, 52, 0, 8, 20, 50], [0, 13, 46, 0, 8.4, 20, 50], L.k); sh(V(0, 0, 24), 40); DOF = 0; }, [[0, 'whirl', .4], [.2, 'gasp', .5], [.6, 'river', .4]]);
// ---------- e: 500 Bier, Trillionär, la crisis y el Schluckauf (139,5 – 168 s) ----------
// corona dorada para el reichster Mensch der Welt
const CROWN = P_(new THREE.Group()); { const gm = new THREE.MeshStandardMaterial({ color: 0xffd23f, metalness: .95, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .35 }); cyl(.8, .75, .5, gm, 20, CROWN, 0, 0, 0); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; const p = new THREE.Mesh(new THREE.ConeGeometry(.2, .6, 4), gm); p.position.set(Math.cos(a) * .72, .5, Math.sin(a) * .72); CROWN.add(p); sphere(.08, mat(0xff2a3a, { emissive: 0xff2a3a, emissiveIntensity: .6 }), CROWN, Math.cos(a) * .79, .1, Math.sin(a) * .79, 8, 6); } }
// portada de revista (2D) alrededor de Felix
function cover2D(k) { FX2D.push(c => { if (k <= 0) return; c.save(); c.globalAlpha = clamp(k * 2); c.strokeStyle = '#ffffff'; c.lineWidth = 18; c.strokeRect(60, 150, W - 120, H * .58); c.fillStyle = '#d8202a'; c.fillRect(60, 150, W - 120, 150); c.fillStyle = '#ffffff'; c.font = `700 96px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('REICHTUM', W / 2, 228);
  c.font = `700 54px ${FONT}`; c.lineWidth = 12; c.strokeStyle = '#1a1a1a'; c.strokeText('DER REICHSTE', W / 2, 400); c.fillStyle = '#ffd23f'; c.fillText('DER REICHSTE', W / 2, 400); c.strokeText('MENSCH DER WELT', W / 2, 466); c.fillText('MENSCH DER WELT', W / 2, 466); c.restore(); }); }
// gráfico de la bolsa (pantalla del banco)
function drawCrash(c, w, h, k, red) { c.fillStyle = red ? '#2a0408' : '#0a1220'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(255,255,255,.08)'; c.lineWidth = 2; for (let x = 0; x < w; x += 60) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y < h; y += 50) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
  c.lineWidth = 8; c.strokeStyle = red ? '#ff3a3a' : '#5aff9a'; c.beginPath(); const n = 40; for (let i = 0; i <= n * k; i++) { const t = i / n; const y = t < .6 ? h * .6 - t * h * .5 + Math.sin(i * 1.7) * 14 : h * .3 + (t - .6) / .4 * h * .65 + Math.sin(i * 2.3) * 10; c.lineTo(30 + t * (w - 60), y); } c.stroke();
  c.fillStyle = red ? '#ff4a4a' : '#ffffff'; c.font = `700 64px ${FONT}`; c.textAlign = 'left'; c.fillText(red ? 'EURO  −99,9 %' : 'EURO', 30, 70); }

// 116 «Und auf einmal:» (zoom lento): Felix sigue bebiendo en el sótano lleno de espuma; todo va más lento
shot(139.52, 'F', 'slow', L => { kel(L); fluten(1.8, L.T, KEX, -9); const c = chugGold(L, { expr: 'panic' }); orbit(V(KEX, 5.6, -9), lerp(16, 11, easeIn(L.k)), -.2, .12, 44); sh(V(KEX, 0, -9), 16); }, [[0, 'slowmo', .6]]);
// 117 «Ruhe.»: el Krug deja de rellenarse; silencio; Felix baja el Krug despacio
shot(140.89, 'C', null, L => { kel(L, .7); fluten(1.8, L.T, KEX, -9); const c = fel(); const k = easeInOut(clamp(L.lt / .4)); drink(c, L, L.t0 - 99.3, 99, { kind: 'gold', meter: true, expr: 'shock', dn: .4 }); GK2.userData.setGlow(.4 * (1 - k)); GK2.userData.fill(0); DARK = .1;
  meterOf(c).userData.set('499 Bier', euro(money(499)), '#ffd23f'); setHUD(499, '#ffd23f'); onFace(c, 7, .2, .4, 40, L.k, 6.4); sh(V(KEX, 0, -9), 12); }, [[0, 'silence', .3]]);
// 118 «Der Krug blieb leer.»: dentro del Krug, vacío; Felix mira por encima del borde
shot(141.32, 'S', null, L => { kel(L, .7); fluten(1.8, L.T, KEX, -9); const c = fel(); holdOnly(c, L, { kind: 'gold', pose: { aRx: 1.0, aRe: .9, headX: .45 } }); GK2.userData.setGlow(.15); GK2.userData.fill(0); GK2.userData.setLid(0); cara(c, L.T, { expr: 'confused', eyes: 'down', mouth: 'o' });
  const p = wpos(GK2); cm([p.x + .6, p.y + 5.2, p.z + 3.2, p.x, p.y + .6, p.z, 40], [p.x + .5, p.y + 4.6, p.z + 2.6, p.x, p.y + .6, p.z, 38], L.k); sh(V(KEX, 0, -9), 10); DOF = 0; }, [[0, 'echo_drip', .5]]);
// 119 «Ich schaute auf meinen Zähler.»: baja la cabeza hacia el Bierzähler del pecho
shot(142.42, 'W', null, L => { kel(L, .7); fluten(1.8, L.T, KEX, -9); const c = fel(); holdOnly(c, L, { kind: 'gold', pose: { headX: lerp(.1, .5, easeOut(clamp(L.lt / .5))) } }); GK2.userData.setGlow(.15); GK2.userData.fill(0); cara(c, L.T, { expr: 'gasp', eyes: 'down' }); meterOf(c).userData.set('499 Bier', euro(money(499)), '#ffd23f'); setHUD(499, '#ffd23f');
  onFace(c, 6.4, -.6, -.8, 40, L.k, 5.6); sh(V(KEX, 0, -9), 12); }, [[0, 'heartbeat', .5]]);
// 120 «500 Bier.» (zoom lento): el Bierzähler cambia a 500 en dorado
shot(143.81, 'Z', 'slow', L => { kel(L, .7); fluten(1.8, L.T, KEX, -9); const c = fel(); holdOnly(c, L, { kind: 'gold', pose: { headX: .5 } }); GK2.userData.fill(0); cara(c, L.T, { expr: 'gasp', eyes: 'down' }); const n = L.lt < .3 ? 499 : 500; const m = meterOf(c); m.userData.set(nBier(n) + ' Bier', euro(money(n)), '#ffd23f'); setHUD(n, '#ffd23f');
  const mp = wpos(m); cm([mp.x + .3, mp.y + .6, mp.z + 4.4, mp.x, mp.y + .1, mp.z, 34], [mp.x + .2, mp.y + .4, mp.z + 2.8, mp.x, mp.y + .1, mp.z, 30], L.k); sh(V(KEX, 0, -9), 8); DOF = 0; }, [[0, 'beep', .5], [.3, 'ding_reveal', .5]]);
// 121 «Ich war Trillionär!»: explosión de oro: Felix en lo alto de la montaña de monedas, brazos arriba; 1 TRILLION €
shot(145.07, 'F', 'punch', L => { town(L, { bg: false }); show(GOLDM, 0, 0, -30, L.T * .05, 1); const c = put(felix, 0, 10.6, -30, 0); actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .5, aRz: .5, aLe: .1, aRe: .1 }]], { T: L.T }); laughF(c, L.T); c.blob.visible = false; meterOf(c).userData.set('500 Bier', '1 Trillion €', '#ffd23f'); setHUD(500, '#ffd23f');
  coins(V(0, 14, -30), L.t0, L.T, 30); billRain(V(0, 4, -30), L.T, 70, 26, 18, 20, 3); badge('gold', '1 TRILLION €', W / 2, H * .2, clamp(L.lt / .15), 1, 1.25); crowdAt(L, 0, -30, 10, 16, 24, 91, { mode: 'shock', face: V(0, 12, -30) });
  orbit(V(0, 13, -30), lerp(26, 22, L.k), .15, .1, 46); sh(V(0, 0, -30), 30); }, [[0, 'explosion_gold', .7], [.05, 'coins', .7], [.2, 'choir', .5], [.3, 'cheer', .4]]);
// 122 «Der reichste Mensch der Welt.»: portada de revista: Felix con corona y la Maß dorada en alto
shot(146.60, 'R', null, L => { town(L, { bg: false }); show(GOLDM, 0, 0, -30, 0, 1); const c = put(felix, 0, 10.6, -30, 0); prost(c, L, 1, { kind: 'gold', pose: { aLx: .4, aLz: .6, aLe: .3 } }); GK2.userData.fill(1); GK2.userData.setGlow(.4); attach(CROWN, c.head, [0, 1.55, 0], [0, 0, .1], 1); grin(c, L.T); c.blob.visible = false;
  cover2D(clamp(L.lt / .3)); orbit(V(0, 14.8, -30), lerp(14, 12.5, L.k), 0, .06, 40); sh(V(0, 0, -30), 20); }, [[0, 'camera_shutter', .7], [.3, 'camera_shutter', .5], [.6, 'sparkle', .4]]);
// 123 «Bis mein Telefon vibrierte.»: el móvil vibra sobre las monedas: «BANK»
shot(148.22, 'W', null, L => { town(L, { bg: false }); show(GOLDM, 0, 0, -30, 0, 1); show(PHONE, Math.sin(L.T * 60) * .06, 11.2, -24, 0, 1.6); PHONE.rotation.set(-1.2, 0, Math.sin(L.T * 50) * .05); PHONE.userData.draw(cx => drawCall(cx, 300, 560, 'BANK', 'EINGEHENDER ANRUF', '#3ad86a'));
  cm([.4, 15.6, -20.6, 0, 11.2, -24, 38], [.3, 15, -21.4, 0, 11.2, -24, 36], L.k); sh(V(0, 0, -26), 14); DOF = 0; }, [[0, 'phone_vibrate', .8], [.3, 'ringtone', .5]]);
// 124 «Meine Bank.»: en su oficina, el banquero al teléfono, muy serio
shot(149.55, 'C', null, L => { bankS(L); BK.scr.userData.draw((cx, w, h) => drawCrash(cx, w, h, .55, false)); const c = put(banker, BKX - 3, 0, -6, .3); actuar(c, 0, [[0, { aRx: 2.4, aRz: -.2, aRe: 2.2, headY: -.2 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.6, .5], [0, 0, 0], .9); PHONE.userData.draw(cx => drawCall(cx, 300, 560, 'FELIX', 'IM GESPRÄCH'));
  talk(c, L.T, L.t0, L.t1, 'worried'); onBody(c, 13, -.2, .14, 44, L.k, 11, -.1, 4.4); sh(V(BKX, 0, -6), 18); }, [[0, 'office_amb', .5], [.2, 'phone_line', .4]]);
// 125 «Durch so viel Geld war die ganze»: la gráfica del euro sube… y se da la vuelta
shot(150.33, 'S', null, L => { bankS(L); BK.scr.userData.draw((cx, w, h) => drawCrash(cx, w, h, lerp(.5, .8, L.k), L.k > .7)); const c = put(banker, BKX - 6, 0, -4, PI - .3); actuar(c, 0, [[0, { aRx: .8, aRz: .3, headX: -.2 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  cm([BKX + 2, 9, 8, BKX, 11, -12.7, 48], [BKX + 1, 9.5, 5, BKX, 11, -12.7, 46], L.k); sh(V(BKX, 0, -8), 20); DOF = 0; }, [[0, 'alarm_soft', .4], [.5, 'down_whistle', .5]]);
// 126 «Wirtschaft zusammengebrochen.»: CRASH en rojo; el banquero se lleva las manos a la cabeza; alarma
shot(151.87, 'Z', 'punch', L => { bankS(L); BK.scr.userData.draw((cx, w, h) => drawCrash(cx, w, h, 1, true)); const c = put(banker, BKX - 3, 0, -4, .2); actuar(c, 0, [[0, 'hands_head']], { T: L.T }); cara(c, L.T, { expr: 'panic' }); TINT = Math.floor(L.T * 6) % 2 ? 'rgba(255,0,0,.14)' : null;
  badge('red', 'CRASH!', W / 2, H * .2, clamp(L.lt / .15), 1, 1.4); onBody(c, 15, .2, .14, 46, L.k, 12.5, .1, 5); sh(V(BKX, 0, -6), 20); }, [[0, 'crash', .8], [.1, 'alarm', .6]]);
// 127 «Jeder Euro war jetzt»: los billetes ruedan por la calle con el viento; nadie se agacha a cogerlos
shot(153.46, 'W', null, L => { town(L, { bg: false }); BILL.forEach((f, i) => { if (i >= 40) return; const r = RNG(i * 7 + 2); f.visible = true; const x = -20 + ((r() * 40 + L.T * (4 + r() * 3)) % 40); f.position.set(x, .1 + Math.abs(Math.sin(L.T * 3 + i)) * .8, 4 + r() * 16); f.rotation.set(-PI / 2 + Math.sin(L.T * 4 + i) * .5, L.T + i, 0); });
  for (let i = 0; i < 3; i++) { const c = put(CR[33 + i], -6 + i * 6, 0, 10 + i * 2, PI / 2); actuar(c, 0, [[0, { ...walkP(L.T, i) }]], { T: L.T }); c.root.position.x += L.lt * 2; cara(c, L.T + i, { expr: 'bored' }); }
  cm([-4, 3, 28, 0, 1.4, 10, 46], [0, 3, 26, 2, 1.4, 10, 46], L.k); sh(V(0, 0, 12), 24); }, [[0, 'wind', .7], [.3, 'paper', .4]]);
// 128 «weniger wert als ein Bierdeckel.»: la balanza: un montón de billetes pesa menos que un Bierdeckel
shot(154.42, 'C', null, L => { town(L, { bg: false }); const k = easeOut(clamp((L.lt - .1) / .6)); show(WAAGE, 0, 0, 0, 0, 1); WAAGE.userData.set(lerp(0, .35, k)); const bp = WAAGE.userData.beam;
  POST.push(() => { WAAGE.updateMatrixWorld(true); const pl = WAAGE.getObjectByName('pan-1'), pr = WAAGE.getObjectByName('pan1'); const a = pl.localToWorld(V(0, -3.2, 0)), b = pr.localToWorld(V(0, -3.2, 0)); for (let i = 0; i < 6; i++) { const f = BILL[i]; f.visible = true; f.position.copy(b).add(V((i % 2 - .5) * .3, i * .12, (i % 3 - 1) * .2)); f.rotation.set(-PI / 2, i * .4, 0); } show(DECK, a.x, a.y + .1, a.z, 0, 1.4); });
  badge('red', 'EURO', W * .7, H * .52, clamp(L.lt / .2), 1, .8); badge('gold', 'BIERDECKEL', W * .3, H * .3, clamp(L.lt / .2), 1, .8);
  cm([0, 7, 26, 0, 5.2, 0, 46], [0, 7, 23, 0, 5.2, 0, 44], L.k); sh(V(0, 0, 0), 16); }, [[0, 'whoosh_soft', .4], [.3, 'scale_tip', .7], [.7, 'thud', .4]]);
// 129 «Also brauchte das Land»: en el ministerio, los funcionarios piensan con la mano en la barbilla
shot(156.18, 'F', null, L => { minS(L); MI.scr.userData.draw((cx, w, h) => { cx.fillStyle = '#1a2a4a'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#ffffff'; cx.font = `700 90px ${FONT}`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('KRISENSITZUNG', w / 2, h / 2); });
  BEA.forEach((b, i) => { const a = (i - 1) * .22; put(b, MIX + Math.sin(a) * 26 * .9, 0, -32 + Math.cos(a) * 26 - 6 - 2.6, -a); actuar(b, 0, [[0, 'think']], { T: L.T + i }); cara(b, L.T + i, { expr: 'confused' }); });
  cm([MIX, 9, 24, MIX, 8, -12, 50], [MIX, 9, 20, MIX, 8.5, -12, 48], L.k); sh(V(MIX, 0, -8), 26); }, [[0, 'flash', .4], [.2, 'hmm', .5], [.6, 'clock_tick', .4]]);
// 130 «ein neues Zahlungsmittel.»: la pantalla: «NEUES ZAHLUNGSMITTEL?»
shot(157.12, 'S', null, L => { minS(L); MI.scr.userData.draw((cx, w, h) => { cx.fillStyle = '#1a2a4a'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#ffd23f'; cx.font = `700 80px ${FONT}`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('NEUES', w / 2, 150); cx.fillText('ZAHLUNGSMITTEL?', w / 2, 260); cx.font = `700 160px ${FONT}`; cx.fillStyle = '#ffffff'; cx.fillText('?', w / 2, 420); });
  cm([MIX + 2, 12, 10, MIX, 13, -17.6, 46], [MIX + 1, 12.6, 6, MIX, 13, -17.6, 44], L.k); sh(V(MIX, 0, -10), 20); DOF = 0; }, [[0, 'swipe', .4], [.2, 'question', .5]]);
// 131 «Und weißt du, wofür sie sich entschieden haben?» (zoom lento): el funcionario coge la tela que tapa la pantalla
shot(158.56, 'W', 'slow', L => { minS(L); MI.scr.userData.draw((cx, w, h) => { cx.fillStyle = '#8a1a1a'; cx.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 40) { cx.fillStyle = 'rgba(0,0,0,.15)'; cx.fillRect(x, 0, 20, h); } }); const b = put(BEA[2], MIX + 6, 0, -14, -.6); actuar(b, 0, [[0, { aRx: 2.4, aRz: .3, aRe: .4, headY: .6 }]], { T: L.T }); cara(b, L.T, { expr: 'smug', mouth: 'smirk' });
  for (let i = 0; i < 2; i++) { const o = put(BEA[i], MIX - 6 + i * 4, 0, -8, PI * 0 + .2); actuar(o, 0, [[0, 'idle']], { T: L.T }); cara(o, L.T + i, { expr: 'lookup' }); }
  cm([MIX + 2, 10, 18, MIX + 2, 10, -14, 48], [MIX + 2, 10.5, 8, MIX + 2, 11, -14, 42], L.k, easeIn); sh(V(MIX, 0, -10), 22); }, [[0, 'drumroll', .6]]);
// 132 «Schluckauf.»: se descubre la pantalla: NEUE WÄHRUNG: SCHLUCKAUF; los funcionarios hacen ¡HICKS!
shot(160.22, 'Z', 'punch', L => { minS(L); MI.scr.userData.draw((cx, w, h) => { cx.fillStyle = '#1a2a4a'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#ffffff'; cx.font = `700 64px ${FONT}`; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('NEUE WÄHRUNG:', w / 2, 120); cx.fillStyle = '#ffd23f'; cx.font = `700 120px ${FONT}`; cx.fillText('SCHLUCKAUF', w / 2, 260);
    cx.fillStyle = '#ffd23f'; cx.beginPath(); cx.arc(w / 2, 420, 70, 0, 7); cx.fill(); cx.fillStyle = '#1a2a4a'; cx.font = `700 40px ${FONT}`; cx.fillText('HICKS', w / 2, 422); });
  const ts = [L.t0 + .2, L.t0 + .55]; const j = hipPose(L.T, ts); BEA.forEach((b, i) => { const o = put(b, MIX - 7 + i * 7, j * .4, -8, 0); actuar(o, 0, [[0, { aLx: .4 + j, aRx: .4 + j, aLz: .3, aRz: .3, headX: -j * .3 }]], { T: L.T }); cara(o, L.T + i, { expr: j > .3 ? 'shock' : 'happy', mouth: j > .3 ? 'o' : 'smile' }); if (i === 1) ts.forEach((t, q) => hicks(o, clamp((L.T - t) / .12) * (L.T - t < .4 ? 1 : 0), .7, q ? -1 : 1)); });
  cm([MIX, 11, 24, MIX, 11, -12, 50], [MIX, 11, 21, MIX, 11, -12, 50], L.k); sh(V(MIX, 0, -10), 24); }, [[0, 'reveal', .7], [.2, 'hiccup', .8], [.55, 'hiccup', .8]]);
// 133 «Und ich?»: Felix en su cuarto, sentado en la cama; en la balda, el goldener Krug
shot(161.10, 'C', null, L => { zimmerS(L); const c = sit2(felix, ZIX - 7, 0, PI * 0 + .3, 3.4); actuar(c, 0, [[0, { ...SITP, aLx: .5, aRx: .5, aLe: .8, aRe: .8, headY: -.2 }]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'bored', mouth: 'flat' }); show(GK2, ZIX - 2, 8.75, -9.2, .4, .8); GK2.userData.setGlow(.15); GK2.userData.fill(0);
  onBody(c, 14, .25, .12, 44, L.k, 12, .3, 3.6); sh(V(ZIX - 4, 0, -4), 16); }, [[0, 'room_amb', .5]]);
// 134 «Seit diesem goldenen Krug»: primer plano del Krug en la balda, brillando un poco
shot(162.21, 'W', null, L => { zimmerS(L); show(GK2, ZIX - 2, 8.75, -9.2, .4 + L.lt * .1, .8); GK2.userData.setGlow(.3 + Math.sin(L.T * 3) * .15); GK2.userData.fill(0); const p = V(ZIX - 2, 9.4, -9.2);
  cm([p.x + 1.2, p.y + 1, p.z + 6, p.x, p.y, p.z, 36], [p.x + .8, p.y + .8, p.z + 4.6, p.x, p.y, p.z, 34], L.k); sh(V(ZIX - 2, 0, -8), 10); DOF = 0; }, [[0, 'shimmer', .5]]);
// 135 «habe ich Schluckauf.»: ¡HICKS! Felix da un bote en la cama
shot(163.25, 'S', null, L => { zimmerS(L); const ts = [L.t0 + .15, L.t0 + .8]; const j = hipPose(L.T, ts); const c = sit2(felix, ZIX - 7, 0, .3, 3.4); c.root.position.y += j * .8; actuar(c, 0, [[0, { ...SITP, aLx: .5 + j, aRx: .5 + j, aLz: .3, aRz: .3, headX: -j * .3 }]], { T: L.T, weight: false }); cara(c, L.T, { expr: j > .3 ? 'shock' : 'bored', mouth: j > .3 ? 'o' : 'flat' });
  ts.forEach((t, q) => hicks(c, clamp((L.T - t) / .12) * (L.T - t < .45 ? 1 : 0), .9, q ? -1 : 1)); onFace(c, 7, .2, .3, 40, L.k, 6.2); sh(V(ZIX - 7, 0, -4), 14); }, [[.15, 'hiccup', .9], [.8, 'hiccup', .9]]);
// 136 «Ununterbrochen.»: hipo sin parar: bota, bota, bota
shot(164.50, 'R', null, L => { zimmerS(L); const ts = [0, .17, .34, .51].map(x => L.t0 + x); const j = hipPose(L.T, ts); const c = put(felix, ZIX, j * .9, -1, 0); actuar(c, 0, [[0, { aLx: .4 + j, aRx: .4 + j, aLz: .3, aRz: .3, headX: -j * .3 }]], { T: L.T }); cara(c, L.T, { expr: 'panic', mouth: 'o' });
  ts.forEach((t, q) => hicks(c, clamp((L.T - t) / .1) * (L.T - t < .3 ? 1 : 0), .7, q % 2 ? -1 : 1)); onBody(c, 14, 0, .12, 44, L.k, 12, 0, 4); sh(V(ZIX, 0, -2), 16); }, [[0, 'hiccup', .8], [.17, 'hiccup', .8], [.34, 'hiccup', .8], [.51, 'hiccup', .8]]);
// 137 «Moment. Warum»: se queda quieto de golpe; el Bierzähler del pecho pita
shot(165.21, 'C', null, L => { zimmerS(L); const c = put(felix, ZIX, 0, -1, 0); actuar(c, 0, [[0, { headX: lerp(0, .45, easeOut(clamp(L.lt / .4))), aLx: .3, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'gasp', eyes: 'down' }); const m = meterOf(c); m.userData.set('1 HICKS', '+1 HICKS', '#ffd23f');
  onFace(c, 8, -1.4, .5, 40, L.k, 7); sh(V(ZIX, 0, -2), 12); }, [[0, 'beep', .6], [.3, 'beep', .5]]);
// 138 «rattert mein Zähler schon wieder?» (zoom lento): el Bierzähler se dispara otra vez: los HICKS suben sin parar y empiezan a caer monedas
shot(166.11, 'F', 'slow', L => { zimmerS(L); const c = put(felix, ZIX, 0, -1, 0); actuar(c, 0, [[0, { headX: .45, aLx: .3, aRx: .3, ...shiver(L.T, .6) }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'down', mouth: 'o' }); const m = meterOf(c); const n = Math.floor(lerp(1, 4800, easeIn(clamp(L.lt / 1.8)))); m.userData.set(n.toLocaleString('de-DE') + ' HICKS', 'SCHLUCKAUF-KONTO', '#ffd23f'); m.rotation.z = Math.sin(L.T * 60) * .05;
  coins(V(ZIX, 9, -1), L.t0 + .4, L.T, 26); const mp = wpos(m); cm([mp.x + .8, mp.y + 2.4, mp.z + 8, mp.x, mp.y - .4, mp.z, 40], [mp.x + .4, mp.y + 1.1, mp.z + 4.4, mp.x, mp.y - .9, mp.z, 34], L.k, easeIn); sh(V(ZIX, 0, -2), 12); }, [[0, 'counter_fast', .7], [.4, 'coins', .6]]);


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
window.DBG = { applyPose, hp, felix, renderer, composer, bloom, sun, grade, scene, camera };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

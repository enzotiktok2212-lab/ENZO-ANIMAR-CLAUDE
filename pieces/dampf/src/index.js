// DAMPF — «In dieser Stadt bekommst du jedes Mal Geld, wenn du an einer Vape ziehst». 1080×1920, 30 fps.
// Estructura del viral del «Furzmesser» (gancho igual, resto con otros datos) + el defecto del protagonista de `traumsammler`.
// Ciudad: Hufenbach de día (pueblo alemán de entramado) envuelta en nubes de vapor. Planos en src/p/*.js; armar.py los une en src/index.js.
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt, chain } from './props.js';
import { makeMayor, makeNachbar, makeLena, makeJonas, makeKassiererin, makeFahrer, makeOma } from './gvolk.js';
import { hufenbach, townhouse, taxi } from './gort.js';
import { makeExtra } from './ecast.js';
import { klasse } from './svsets.js';
import { buero, gymnasium, kiosk, drawRank } from './dsets.js';
import { makeCop } from './gcast.js';
import { knast, phone } from './gsets.js';
import { zimmer } from './gort.js';
import { makeBanker, sportsCar } from './pech.js';
import { makeTimo, makeKessler, makeBeamter, makeNebelmann, inhaler } from './dcast.js';
import { vape, holdVape, smokePool, vapePhase, armVape, wristMeter, drawMeterHUD, money, euro, secs } from './vape.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 122.9, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = new URLSearchParams(location.search).get("ao") !== "0";
// profundidad de campo (fondo desenfocado en los planos cercanos): el foco va al punto que mira la cámara (CAMT)
const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: .0008, maxblur: .01 }); composer.insertPass(bokeh, 2);
// los sprites (humo, nubes) no aguantan los materiales de sustitución de AO y DOF: se ocultan mientras esos pases dibujan su profundidad
const SPRITES = []; const noSprites = p => { const r0 = p.render.bind(p); p.render = (...a) => { if (!SPRITES.length) scene.traverse(o => { if (o.isSprite || o.isPoints) SPRITES.push(o); }); const v = SPRITES.map(s => s.visible); SPRITES.forEach(s => s.visible = false); try { r0(...a); } finally { scene.overrideMaterial = null; SPRITES.forEach((s, i) => s.visible = v[i]); } }; };
noSprites(bokeh); noSprites(ao);
let CAMT = new THREE.Vector3(), DOF = 1;
// supermuestreo (?ss=2 por defecto): se renderiza al doble y se reduce al dibujar en el lienzo final → bordes nítidos sin dientes
const SS = +(new URLSearchParams(location.search).get('ss') ?? 2); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -.0003; sun.shadow.normalBias = .12; sun.shadow.radius = 2.5; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-95, 105, 85)); rim.target.position.copy(p); rim.position.copy(p).add(V(70, 45, -100)); }
const OUTL = 1.1 * SS;   // contorno fino (el usuario quiere contornos mínimos y nítidos)

// ---------- escenarios ----------
// Hufenbach (x = 0) de día: plaza x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (-6, -92); fuente (-18, -24); café (36, -40); bancos (-36, 20), (-36, -50), (14, 30).
const HB = hufenbach(scene);
// despacho (BX = 1300), Gymnasium por fuera (GX = 1700), quiosco (KX = 2100), aula (CX = 2500)
const BX = 1300, GX = 1700, KX = 2100, CX = 2500;
const BU = buero(scene, BX), GY = gymnasium(scene, GX), KI = kiosk(scene, KX), KL = klasse(scene, CX);
// cárcel por fuera (JX = 2900), mi cuarto (ZX = 3300)
const JX = 2900, ZX = 3300; const KN = knast(scene, JX), ZI = zimmer(scene, ZX);
{ const sg = textPlane(30, 4, 1200, 160, (c, w, h) => { c.fillStyle = '#1a1e2a'; c.fillRect(0, 0, w, h); c.shadowColor = '#ff3a3a'; c.shadowBlur = 30; txt(c, 'GEFÄNGNIS', w / 2, h / 2 + 6, 130, '#ff4a4a'); }, 1.2); sg.position.set(JX, 26.6, -14.4); KN.g.add(sg); sg.position.x = 0; }
const SETS = { HB: HB.G, BU: BU.g, GY: GY.g, KI: KI.g, KL: KL.g, KN: KN.g, ZI: ZI.g };
for (const k in SETS) outline(SETS[k], OUTL);
[HB.RANK, HB.BOX, HB.PRICE].forEach(o => o && (o.visible = false));
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3), 20 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 30 + i, Math.PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 40 + i, -Math.PI / 2); }
// ---------- reparto ----------
const ich = makeTimo(scene), nach = makeNachbar(scene), mayor = makeMayor(scene), kess = makeKessler(scene), beam = makeBeamter(scene), nebel = makeNebelmann(scene), bank = makeBanker(scene);
chain(mayor.spine);
const COP = [makeCop(scene, 0), makeCop(scene, 1)];
const XT = [makeLena(scene), makeJonas(scene), makeKassiererin(scene), makeFahrer(scene), makeOma(scene)];
kitFace(ich, 'hero'); kitFace(nach, 'mustache'); kitFace(mayor, 'mustache'); kitFace(kess, 'girl'); kitFace(beam, 'plain'); kitFace(nebel, 'mustache'); kitFace(bank, 'plain'); COP.forEach(c => kitFace(c, 'plain'));
XT.forEach((c, i) => kitFace(c, ['girl', 'hero', 'girl', 'plain', 'girl'][i]));
const EX = Array.from({ length: 28 }, (_, i) => makeExtra(scene, i)); EX.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'girl', 'mustache', 'girl'][i % 6]));
const POOL = [ich, nach, mayor, kess, beam, nebel, bank, ...COP, ...XT, ...EX];
POOL.forEach(c => outline(c.root, OUTL));
// sombra de contacto: mancha oscura y suave bajo los pies (asienta a los personajes en el suelo)
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(.5, 'rgba(0,0,0,.3)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -Math.PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); });
// cada personaje con su vape en la mano derecha y su Dampfmesser en la muñeca izquierda
const VP = new Map(), WM = new Map();
POOL.forEach((c, i) => { const v = holdVape(c, vape(scene, i + 2)); v.visible = false; outline(v, OUTL); outline(v.userData.grip, OUTL); VP.set(c, v);
  const m = wristMeter(c.aL); m.visible = false; WM.set(c, m); });
const GOLD = holdVape(ich, vape(scene, 0, { gold: true })); GOLD.visible = false; outline(GOLD.userData.grip, OUTL); outline(GOLD, OUTL);
const GOLD2 = vape(scene, 0, { gold: true }); outline(GOLD2, OUTL);
const INH = inhaler(ich.aL.hand); INH.position.set(0, -.5, .45); INH.rotation.set(-1.4, 0, 0); INH.visible = false; outline(INH, OUTL);
// ---------- atrezo ----------
const CAR = sportsCar(scene); outline(CAR, OUTL);
// pantalla gigante sobre dos postes (la regla de la ciudad); BOARD.userData.draw(fn) redibuja el contenido
const BOARD = (() => { const g = new THREE.Group(); scene.add(g); const fm = mat(0x1a1c24, { metalness: .6, roughness: .35 });
  for (const s of [-1, 1]) { box(1.2, 14, 1.2, fm, .2, g, s * 8, 7, -.6); box(2.4, .4, 2.4, fm, .1, g, s * 8, .2, -.6); }
  box(21, 13, 1.2, fm, .4, g, 0, 17, -.6); const t = canvasTex(1000, 600, () => {}); const scr = new THREE.Mesh(new THREE.PlaneGeometry(19.6, 11.8), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); scr.position.set(0, 17, .05); g.add(scr);
  for (let i = 0; i < 9; i++) sphere(.22, new THREE.MeshBasicMaterial({ color: new THREE.Color(1, .85, .4).multiplyScalar(2), toneMapped: false }), g, -9.6 + i * 2.4, 23.7, .1, 8, 6);
  g.userData.draw = fn => { fn(t.image.getContext('2d'), 1000, 600); t.needsUpdate = true; }; return g; })(); outline(BOARD, OUTL);
const SMK = smokePool(scene, 1100);
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
// billetes por valor (10 € rojo, 50 € naranja, 100 € verde, 500 € morado), con el número bien grande
const DEN = { 5: ['#b8b8c0', '#6a6a78'], 10: ['#e8605a', '#a82a24'], 50: ['#ffa040', '#b85a10'], 100: ['#5ab84a', '#2a6a2a'], 500: ['#a87ae0', '#5a2a98'] };
const billTex = d => canvasTex(256, 128, (c, w, h) => { const [a, b] = DEN[d]; const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 6; c.strokeRect(8, 8, w - 16, h - 16); c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.arc(w * .72, h / 2, 38, 0, 7); c.fill();
  c.fillStyle = '#ffffff'; c.font = `700 64px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.lineWidth = 8; c.strokeStyle = b; c.strokeText(String(d), 22, h / 2 + 4); c.fillText(String(d), 22, h / 2 + 4); c.font = `700 52px ${FONT}`; c.textAlign = 'center'; c.fillText('€', w * .72, h / 2 + 3); });
const BILLP = {}; for (const [d, n] of [[5, 4], [10, 14], [50, 14], [100, 90], [500, 90]]) { const t = billTex(d); BILLP[d] = Array.from({ length: n }, () => { const p = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.0), new THREE.MeshStandardMaterial({ map: t, side: THREE.DoubleSide, roughness: .7 })); p.castShadow = true; scene.add(p); return p; }); }
const BILL = [...BILLP[100], ...BILLP[500]];   // mezcla para lluvias grandes
const FW = Array.from({ length: 60 }, (_, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(.5, 6, 4), new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL((i % 6) / 6, 1, .6).multiplyScalar(2.5), toneMapped: false })); scene.add(s); return s; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 2 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const STEAM = [], FIRE = [], NOTES = [], HEARTS = [];
const BANK = (() => { const g = new THREE.Group(); scene.add(g); const w = mat(0xb07a45, { roughness: .6 }), m = mat(0x2a2a30, { metalness: .6, roughness: .4 });
  for (let k = 0; k < 3; k++) box(15, .22, .55, w, .05, g, 0, 1.3, -.6 + k * .62); for (let k = 0; k < 3; k++) box(15, .5, .16, w, .05, g, 0, 2.2 + k * .65, -1.25);
  for (const x of [-6.8, 0, 6.8]) { box(.3, 1.3, 1.6, m, .05, g, x, .65, -.1); box(.25, 2.4, .25, m, .05, g, x, 2.6, -1.35); } return g; })(); outline(BANK, OUTL);
const PODIUM = (() => { const g = new THREE.Group(); scene.add(g); box(4, 5, 2.4, mat(0x2a3a6a, { roughness: .5 }), .15, g, 0, 2.5, 0); box(4.4, .3, 2.8, mat(0x1a2a4a), .05, g, 0, 5.1, 0);
  const em = textPlane(3, 1.4, 300, 140, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); txt(c, 'DAMPF-AMT', w / 2, h / 2 + 3, 46, '#1a2a4a'); }); em.position.set(0, 3.4, 1.22); g.add(em);
  const mic = cyl(.05, .05, 1.6, mat(0x2a2a2a, { metalness: .8 }), 8, g, 0, 6, .4); mic.rotation.x = -.5; sphere(.22, mat(0x1a1a1a, { roughness: .4 }), g, 0, 6.7, .8, 10, 8); return g; })(); outline(PODIUM, OUTL);
const BANNER = textPlane(26, 6, 1040, 240, (c, w, h) => { c.fillStyle = '#1a2a4a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffd23f'; c.lineWidth = 12; c.strokeRect(10, 10, w - 20, h - 20); txt(c, 'AMT FÜR DAMPF', w / 2, 90, 96, '#ffd23f'); txt(c, 'Jeder Zug wird gemessen.', w / 2, 180, 54, '#ffffff'); }); BANNER.material.side = THREE.DoubleSide; scene.add(BANNER);
const FOG = (() => { const g = new THREE.Group(); scene.add(g); box(2.6, 1.6, 1.8, mat(0x1a1a22, { metalness: .5, roughness: .4 }), .15, g, 0, .8, 0); const n = cyl(.3, .4, .8, mat(0x6a6a72, { metalness: .8 }), 12, g, 0, 1.1, 1.2); n.rotation.x = Math.PI / 2;
  box(.6, .3, .05, new THREE.MeshBasicMaterial({ color: new THREE.Color(1, .2, .2).multiplyScalar(2), toneMapped: false }), .02, g, -.7, 1.2, .92); const lb = textPlane(1.6, .5, 160, 50, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); txt(c, 'NEBEL 3000', w / 2, h / 2 + 2, 28, '#1a1a1a'); }); lb.position.set(.3, .9, .91); g.add(lb); return g; })(); outline(FOG, OUTL);
const WALLET = (() => { const g = new THREE.Group(); scene.add(g); const a = box(1.6, .12, 1.1, mat(0x6a3a1a, { roughness: .6 }), .05, g, 0, 0, 0); const b = box(1.6, .12, 1.1, mat(0x7a4a24, { roughness: .6 }), .05, g, 0, .5, -.5); b.rotation.x = -1.0; return g; })(); outline(WALLET, OUTL);
const WARN = textPlane(.46, .72, 92, 144, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8323a'; c.fillRect(0, 0, w, 34); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 19px ${FONT}`; c.fillStyle = '#fff'; c.fillText('WARNUNG', w / 2, 18); c.fillStyle = '#d8323a'; c.font = `700 17px ${FONT}`; ['Niemals', 'mehr als', 'einen', 'Zug!'].forEach((t, i) => c.fillText(t, w / 2, 56 + i * 22)); });
WARN.material.polygonOffset = true; WARN.material.polygonOffsetFactor = -2; const WARN2 = WARN.clone(); for (const [v, w] of [[GOLD, WARN], [GOLD2, WARN2]]) { w.position.set(0, .55, -.127); w.rotation.set(0, Math.PI, 0); v.add(w); }
const BARS = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0x5a5e68, { metalness: .85, roughness: .3 }); for (let i = 0; i < 9; i++) cyl(.16, .16, 12, m, 10, g, -4.8 + i * 1.2, 6, 0); for (const y of [.6, 6, 11.4]) box(11, .4, .4, m, .05, g, 0, y, 0); return g; })(); outline(BARS, OUTL);
// fachada del quiosco viejo (de noche): caseta con ventanas tapiadas, letrero torcido y la puerta entreabierta con luz
const KIOSKF = (() => { const g = new THREE.Group(); scene.add(g); const wd = mat(0x6a5a44, { roughness: .9 }); box(12, 9, 8, mat(0x8a7a5a, { roughness: .95 }), .1, g, 0, 4.5, -4); box(13, .6, 9, mat(0x4a3a2a), .05, g, 0, 9.2, -4);
  for (const x of [-3.6, 3.6]) { box(3.4, 3, .2, mat(0x2a2a30), .05, g, x, 5, .05); for (const r of [-.5, .5]) { const p = box(3.8, .4, .2, wd, .03, g, x, 5 + r, .2); p.rotation.z = r * .3; } }
  box(2.6, 5.4, .2, mat(0x3a2a1a), .05, g, 0, 2.7, .05); const dr = box(1.4, 5.2, .2, mat(0x5a4030), .05, g, -.6, 2.6, .5); dr.rotation.y = .9;
  const lt = box(1.0, 5, .1, new THREE.MeshBasicMaterial({ color: new THREE.Color(1, .8, .4).multiplyScalar(1.6), toneMapped: false }), 0, g, .4, 2.6, .1);
  const sg = textPlane(7, 1.8, 420, 108, (c, w, h) => { c.fillStyle = '#c8b890'; c.fillRect(0, 0, w, h); txt(c, 'KIOSK', w / 2, h / 2 + 4, 86, '#7a3a2a'); }); sg.position.set(0, 10.6, .55); sg.rotation.z = -.12; g.add(sg); return g; })(); outline(KIOSKF, OUTL);
const TAXI = taxi(scene); outline(TAXI, OUTL);
// semáforo (caja con tres luces; set(k): 0 rojo, 1 ámbar, 2 verde; boom para explotar)
const AMPEL = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0x2a2e36, { metalness: .5, roughness: .4 }); cyl(.25, .3, 10, m, 10, g, 0, 5, 0); const hd = new THREE.Group(); hd.position.set(0, 11.2, 0); g.add(hd); box(1.6, 4.4, 1.2, m, .2, hd, 0, 0, 0);
  const L = [0xff3030, 0xffb020, 0x30ff60].map((c, i) => sphere(.5, new THREE.MeshBasicMaterial({ color: c, toneMapped: false }), hd, 0, 1.3 - i * 1.3, .55, 12, 8)); g.userData = { hd, set: k => L.forEach((l, i) => l.material.color.set([0xff3030, 0xffb020, 0x30ff60][i]).multiplyScalar(i === k ? 2.4 : .15)) }; return g; })(); outline(AMPEL, OUTL);
const AMPEL2 = AMPEL.clone(true); scene.add(AMPEL2);
const PHONE = phone(scene); PHONE.visible = false;
// pecho que arde: brillo dorado bajo la sudadera de Timo
const CHEST = (() => { const t = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(255,230,140,1)'); g.addColorStop(.4, 'rgba(255,160,40,.5)'); g.addColorStop(1, 'rgba(255,120,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.7), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); m.position.set(0, 1.25, .58); ich.spine.add(m); return m; })();
const SPARK = Array.from({ length: 40 }, () => sphere(.12, new THREE.MeshBasicMaterial({ color: new THREE.Color(1, .8, .3).multiplyScalar(3), toneMapped: false }), scene, 0, 0, 0, 6, 4));
function sparks(c, T0, T, n = 30, sp = 1) { SPARK.forEach((s, i) => { if (i >= n) return; const r = RNG(i * 13 + 2), t = T - T0; if (t < 0 || t > 1.2) return; s.visible = true; const a = r() * 6.283, v = (4 + r() * 6) * sp; s.position.set(c.x + Math.cos(a) * v * t, c.y + (6 + r() * 4) * t - 9 * t * t, c.z + Math.sin(a) * v * t); s.scale.setScalar(1 - t / 1.2); }); }
const PROPS = [TAXI, AMPEL, AMPEL2, PHONE, ...SPARK, KIOSKF, BARS, GOLD2, PODIUM, BANNER, FOG, WALLET, CAR, BOARD, BANK, ...CONF, ...BILLP[5], ...BILLP[10], ...BILLP[50], ...BILLP[100], ...BILLP[500], ...FW, ...DUST, ...SWEAT, ...TEAR];
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.0; hemi.color.setRGB(.82, .9, 1); hemi.groundColor.setRGB(.6, .55, .42); sun.intensity = 3.0; sun.color.setRGB(1, .88, .72); rim.intensity = 1.9; rim.color.setRGB(1, .93, .82);
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; SMK.tint.setRGB(1, 1, 1); }
function night(fill = 40) { MODE = 'night'; sky.clouds.forEach(c => c.visible = false); renderer.toneMappingExposure = 1.05; setSky([.04, .05, .2], [.12, .12, .38], [.32, .22, .5]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.15; hemi.color.setRGB(.7, .74, 1); hemi.groundColor.setRGB(.32, .28, .4); sun.intensity = 1.2; sun.color.setRGB(.78, .78, 1); rim.intensity = 1.8;
  scene.fog.color.setRGB(.12, .12, .3); scene.fog.density = .001; bloom.strength = .32; bloom.threshold = .82; FILL.intensity = fill; BIRDSON = 0; SMK.tint.setRGB(.8, .84, 1); }
function darkNight() { night(28); hemi.intensity = .55; sun.intensity = .55; renderer.toneMappingExposure = .9; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; bloom.threshold = .86; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; SMK.tint.setRGB(1, 1, 1); }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } VP.get(c).visible = false; VP.get(c).userData.grip.visible = false; WM.get(c).visible = false; VP.get(c).userData.setGlow(0); }
  CHEST.material.opacity = 0; GOLD.visible = false; GOLD.userData.grip.visible = false; GOLD.position.set(0, -.25, .47); GOLD.rotation.set(1.54, 0, 0); GOLD.scale.setScalar(.95); KI.beam.visible = true; INH.visible = false;
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  SMK.reset();
  for (const k in SETS) SETS[k].visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .38; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.42; grade.uniforms.sharp.value = 1.25; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; HUD = null; DOF = 1; day(); }
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

// ---------- vapear ----------
const mouthW = ch => { ch.root.updateMatrixWorld(true); return ch.head.localToWorld(V(0, .36 * (ch.spec.headScale || 1), .78)); };
const faceDir = ch => { ch.root.updateMatrixWorld(true); const d = new THREE.Vector3(); ch.head.getWorldDirection(d); return d; };
// dirección del humo: hacia delante y arriba, pero nunca hacia la cámara (se quita la componente que va a cámara y se desvía de lado)
const smokeDir = (ch, up = .3) => { const d = faceDir(ch); d.y = 0; d.normalize(); const m = mouthW(ch), tc = camera.position.clone().sub(m); tc.y = 0; tc.normalize(); const k = d.dot(tc);
  if (k > -.2) { d.addScaledVector(tc, -(k + .2)); const side = V(-tc.z, 0, tc.x); if (d.dot(side) < 0) side.negate(); d.addScaledVector(side, .9); } d.normalize(); d.y += up; return d; };
// ch da una calada que empieza en el tiempo absoluto t0 (calada de `inh` s). o.pose = pose base (sentado, etc.); o.expr; o.meter: muestra el Dampfmesser.
// Devuelve la fase (vapePhase) para sincronizar pop-ups.
const FACES = [];
function vaper(ch, L, t0, inh, o = {}) { if (!o.bg) FACES.push(ch); const lt = L.T - t0, ph = vapePhase(Math.max(0, lt), inh, o), base = o.pose || {};
  const tilt = ph.ph === 'inh' ? -.1 - ph.inhK * .08 : ph.ph === 'exh' ? -.2 * (1 - ph.exhK * .5) : ph.ph === 'hold' ? -.14 : 0;
  const chest = ph.ph === 'inh' ? -.05 * ph.inhK : ph.ph === 'exh' ? -.05 * (1 - ph.exhK) : 0;
  const av = armVape(ph.raise); const pose = { ...base, ...av, headX: (base.headX || 0) + tilt + (o.headX || 0), lean: (base.lean || 0) + chest, headY: (base.headY || 0) };
  actuar(ch, 0, [[0, pose]], { T: L.T, extra: o.extra }); ch.aR.sh.rotation.y = av.aRy;
  const v = o.gold ? GOLD : VP.get(ch); if (!o.noVape) { v.visible = true; v.userData.grip.visible = true; v.userData.setGlow(ph.ph === 'inh' ? .7 + Math.sin(L.T * 30) * .1 : .08); }
  if (o.meter) WM.get(ch).visible = true;
  const ex = o.expr || 'neutral'; cara(ch, L.T, { expr: ex, mouth: ph.ph === 'done' ? (o.after || 'smile') : ph.mouth, ...(ph.eyes && !o.eyes ? { eyes: ph.eyes } : {}), ...(o.eyes ? { eyes: o.eyes } : {}) });
  if (lt > ph.t3) { const m = mouthW(ch), d = smokeDir(ch, .3 + (o.dirUp || 0)); SMK.puff(m, d, L.T, t0 + ph.t3, ph.t4 - ph.t3, { pow: o.pow ?? 4.2 + inh * .5, size: o.size ?? (.7 + Math.min(inh, 10) * .12), n: o.n ?? Math.round(30 + Math.min(inh, 10) * 6), dens: o.dens ?? .85, seed: ch.seed + Math.round(t0 * 10), life: o.life ?? 3 }); }
  return ph; }
// vapea en bucle (gente de fondo): calada corta y nube cada pocos segundos, desfasado por personaje
function vapeLoop(ch, L, i = 0, o = {}) { const per = o.per ?? 4.2, inh = o.inh ?? (1 + (i % 3) * .5), off = (i * 1.37) % per; const t0 = Math.floor((L.T + off) / per) * per - off;
  // la bocanada anterior sigue en el aire mientras empieza la siguiente
  if (L.T - (t0 - per) < 3.5) { const pv = vapePhase(L.T - (t0 - per), inh, o); if (L.T - (t0 - per) > pv.t3) { const m = mouthW(ch), d = smokeDir(ch); SMK.puff(m, d, L.T, t0 - per + pv.t3, pv.t4 - pv.t3, { pow: 3.6, size: .75, n: 26, dens: .75, seed: ch.seed + i * 13 + Math.round((t0 - per) * 10) }); } }
  return vaper(ch, L, t0, inh, { gap: 9, bg: true, ...o }); }
// lluvia de billetes
function billRain(c, T, n = 60, sx = 16, sz = 10, h = 16, clear = 4, pool = BILL) { pool.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 17 + 5); f.visible = true; const y = h - ((T * (2.2 + r() * 1.6) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2.4 + i) * .8, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(Math.sin(T * 3 + i) * .9, T * 2 + i, Math.cos(T * 2.6 + i) * .6);
  // fuera del pasillo cámara–sujeto: si cae delante de la cámara, se aparta
  const cx = camera.position.x - c.x, cz = camera.position.z - c.z, L2 = Math.hypot(cx, cz) || 1, px = f.position.x - c.x, pz = f.position.z - c.z, along = (px * cx + pz * cz) / L2, perp = (px * -cz + pz * cx) / L2; if (along > 0 && Math.abs(perp) < clear) { const sg = perp < 0 ? -1 : 1; f.position.x += (-cz / L2) * sg * (clear - Math.abs(perp)); f.position.z += (cx / L2) * sg * (clear - Math.abs(perp)); } }); }
// billetes que salen disparados desde un punto (pago)
function billBurst(c, T0, T, n = 24, sp = 1, pool = BILL) { const ca = Math.atan2(camera.position.z - c.z, camera.position.x - c.x); pool.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 29 + 11), t = T - T0; if (t < 0) return; f.visible = true; const a = ca + PI * .5 + r() * PI, v = (2.5 + r() * 3) * sp; f.position.set(c.x + Math.cos(a) * v * t, c.y + (6 + r() * 3) * t - 5 * t * t, c.z + Math.sin(a) * v * t); f.rotation.set(T * 5 + i, T * 3 + i, 0); }); }
// billetes que caen del cielo sobre alguien (n billetes del valor d), aleteando hasta el suelo o la mano
function billDrop(ch, T0, T, n = 1, d = 10, spread = 1.4) { const h = hp(ch); BILLP[d].forEach((f, i) => { if (i >= n) return; const r = RNG(i * 41 + d), t = T - T0 - i * .08; if (t < 0) return; f.visible = true;
  const y0 = h.y + 5 + r() * 2, yEnd = i === 0 ? h.y - 2.4 : .05, y = Math.max(yEnd, y0 - t * (9 + r() * 2) * Math.max(.35, 1 - t * .8)); const sway = Math.sin(t * 5 + i) * (y > yEnd + .01 ? .7 : 0);
  const fd = faceDir(ch); f.position.set(h.x + (i ? (r() - .5) * 2 * spread : fd.x * 1.6) + sway, y, h.z + (i ? (r() - .5) * 2 * spread : fd.z * 1.6));
  if (y > yEnd + .01) f.rotation.set(Math.sin(t * 4 + i) * .7, t * 1.5 + i, Math.cos(t * 3 + i) * .5); else if (i === 0) { f.lookAt(camera.position); f.rotateZ(Math.sin(i) * .1); } else f.rotation.set(-PI / 2, i, 0); }); }
// ninguna nube ni billete tapa la cara de un protagonista: lo que queda delante de la cara (en pantalla) se aparta o se vuelve transparente
function clearFaces() { if (!FACES.length) return; camera.updateMatrixWorld(); camera.updateProjectionMatrix();
  const F = FACES.filter(c => c.root.visible).map(c => { const h = hp(c).add(V(0, .65 * (c.spec.scale || 1), 0)); const p = h.clone().project(camera); const d = camera.position.distanceTo(h); const r = 1.25 * (c.spec.scale || 1) / (d * Math.tan(camera.fov * PI / 360)); return { p, d, r }; });
  const test = (o, fn) => { const q = o.position.clone().project(camera); const dc = camera.position.distanceTo(o.position); for (const f of F) { if (dc > f.d + .5) continue; const dx = (q.x - f.p.x) * W / H, dy = q.y - f.p.y, dd = Math.hypot(dx, dy); if (dd < f.r * 1.15) fn(dd / (f.r * 1.15), f); } };
  for (const s of SMK.list) if (s.visible) test(s, k => { s.material.opacity *= k * k * .25; });
  for (const d in BILLP) for (const b of BILLP[d]) if (b.visible) test(b, () => { b.visible = false; }); }
const walkP = (T, i) => { const p = Math.sin(T * 9 + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
const SK = [[68.4, 0], [72.6, 1], [73.5, 1], [74.3, 5], [75.2, 5], [76.4, 10], [77.2, 10], [79.2, 20], [81.4, 20.4], [99.0, 52]];
const zugS = T => { if (T <= SK[0][0]) return 0; for (let i = 1; i < SK.length; i++) if (T <= SK[i][0]) return lerp(SK[i - 1][1], SK[i][1], (T - SK[i - 1][0]) / (SK[i][0] - SK[i - 1][0])); return 52; };
let HUD = null;
// gente vapeando alrededor de (cx, cz) — extras Roblox reales, nunca entre la cámara y el sujeto (hueco de ±gap alrededor de la cámara)
function vapeCrowd(L, cx, cz, n, r0, r1, seed = 1, o = {}) { POST.push(() => { const list = (o.list || EX).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx);
  const arc = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.1), ac + 6.283 - (o.gap ?? 1.1)];
  list.forEach((c, i) => { const a = arc[0] + (i + r() * .8) / list.length * (arc[1] - arc[0]); const d = r0 + r() * (r1 - r0); const x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d;
    const face = o.face || camera.position; const ry = Math.atan2(face.x - x, face.z - z) + (r() - .5) * 1.1; put(c, x, 0, z, ry);
    vapeLoop(c, L, i + seed, { expr: ['smug', 'joy', 'neutral'][i % 3], per: 3.4 + (i % 4) * .5, meter: true }); }); }); }
// pop-up de dinero sobre la cabeza
const cashPop = (ch, text, k, kind = 'green', sc = .8) => badge3(kind, text, hp(ch).add(V(0, 3.2 * (ch.spec.scale || 1), 0)), k, sc);   // { s: segundos, e: euros (número), col }
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
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  c.restore(); }
const KEY = /^(Stadt|Geld|Vape|ziehst|länger|mehr|Eine|Sekunde|Zehn|Euro|Fünf|Sekunden|Fünfhundert|Glückwunsch|Millionär|heute|Genau|Beruf|Niemand|Sportwagen|drei|Pods|Schule|Bürgermeister|acht|Jahren|reichste|Problem|Dampfmesser|Gefängnis|Nebelmaschine|Fünfundzwanzig|pleite|schwache|Lungen|anderthalb|husten|goldene|Warnung|Niemals|einen|Zug|alles|einmal|nichts|brennen|Million|Zwanzig|Milliarde|Nebel|weiter|weinte|Land|Stille|Zweiundfünfzig|Achthundert|Billionen|Welt|Bank|wertlos|Währung|Husten|wieder)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t), huss: false }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0;
// ---------- a: gancho (0 – 15,4 s) ----------
const P = V(-6, 0, -6);   // centro de la plaza
const town = (L, n = 22, cx = P.x, cz = P.z, r0 = 6, r1 = 22, seed = 3, o = {}) => { use('HB'); if (n) vapeCrowd(L, cx, cz, n, r0, r1, seed, o); };
const hazeTown = (L, c = P, n = 26, dens = .32) => SMK.haze(V(c.x, 9, c.z - 10), L.T, n, 34, 4, 26, 9, dens, 11);
const drawRule = (c, w, h, k = 1) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#12204a'); g.addColorStop(1, '#2a0a3a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 62px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText('JE LÄNGER DU ZIEHST,', w / 2, 70); c.fillStyle = '#7aff9a'; c.fillText('DESTO MEHR GELD!', w / 2, 140);
  [['1 s', '10 €', .12], ['5 s', '500 €', .36], ['10 s', '1 Mio. €', 1]].forEach(([a, b, v], i) => { const x = 200 + i * 300, bh = 330 * v * clamp(k * 1.6 - i * .3); c.fillStyle = ['#3ab8ff', '#ffd23f', '#ff3a8a'][i]; c.beginPath(); c.roundRect(x - 80, 560 - bh, 160, bh, 16); c.fill();
    c.font = `700 44px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText(a, x, 590 - 20 + 0); c.fillStyle = '#ffffff'; c.font = `700 40px ${FONT}`; if (bh > 50) c.fillText(b, x, 560 - bh - 30); }); };

// 1 «In dieser Stadt» (zoom lento): la ciudad envuelta en vapor, grúa que baja hacia la plaza llena de gente vapeando; en el centro, Jonas suelta una nube enorme
shot(0, 'Z', 'slow', L => { town(L, 26, P.x, P.z, 7, 26, 3); hazeTown(L); const c = put(XT[1], P.x, 0, P.z + 4, 0); vaper(c, L, -.3, .9, { exh: 1.6, pow: 6, size: 1.6, n: 70, expr: 'smug', meter: true });
  EX.slice(0, 5).forEach((e, i) => POST.push(() => cashPop(e, '+10 €', clamp((L.T - .3 - i * .2) / .3), 'green', .6)));
  cm([P.x + 4, 62, P.z + 78, P.x, 2, P.z - 4, 46], [P.x + 1, 11, P.z + 24, P.x, 4.5, P.z + 2, 44], L.k, easeOut); sh(V(P.x, 0, P.z), 40); DOF = 0; },
  [[0, 'ding_reveal', .7], [.1, 'city_amb', .6], [.3, 'vape_out', .6], [.6, 'cash', .5], [1.0, 'cash', .4]]);
// 2 «bekommst du jedes Mal Geld,»: Jonas de cerca: exhala, su Dampfmesser pita y le salen billetes
shot(1.40, 'C', 'punch', L => { town(L, 10, P.x, P.z + 4, 6, 14, 5); const c = put(XT[1], P.x, 0, P.z + 4, 0); const ph = vaper(c, L, L.t0 - 1.0, .7, { exh: 1.2, pow: 5, size: 1.2, expr: 'joy', meter: true, after: 'open_smile' });
  WM.get(c).userData.set('0,7 s', '+10 €'); billDrop(c, L.t0 + .35, L.T, 1, 10); POST.push(() => cashPop(c, '+10 €', clamp((L.lt - .4) / .25), 'green', 1));
  orbit(V(P.x, 5.4, P.z + 4), lerp(11, 9, L.k), -.25, .06, 40); sh(V(P.x, 0, P.z + 4), 18); }, [[0, 'impact', .5], [.45, 'cash', .7], [.5, 'money_rain', .4]]);
// 3 «wenn du an einer Vape ziehst.»: perfil de la cajera dando una calada larga (el LED brilla), empuje lento
shot(2.50, 'S', null, L => { town(L, 10, 30, 8, 7, 16, 7); const c = put(XT[2], 30, 0, 8, -PI / 2 + .1); vaper(c, L, L.t0 - .1, 1.1, { exh: 1.0, expr: 'smug' });
  const h = hp(c); cm([h.x - 7.5, h.y + 1.2, h.z + 2.5, h.x, h.y - .3, h.z, 34], [h.x - 6.2, h.y + 1.0, h.z + 2.1, h.x, h.y - .2, h.z, 32], L.k); sh(V(30, 0, 8), 16); }, [[0, 'swipe', .4], [.25, 'vape_in', .7], [1.2, 'vape_out', .5]]);
// 4 «Und je länger du ziehst,»: la pantalla gigante con la regla; la gente debajo la mira mientras vapea
shot(3.90, 'W', null, L => { town(L, 14, 10, -38, 6, 16, 9, { face: V(10, 14, -46) }); show(BOARD, 10, 0, -50, 0, 1); BOARD.userData.draw((c, w, h) => drawRule(c, w, h, L.lt / .9));
  cm([10, 8, -8, 10, 15, -50, 46], [10, 10, -16, 10, 16.5, -50, 46], L.k); sh(V(10, 0, -42), 30); DOF = 0; }, [[0, 'whoosh', .4], [.2, 'power_on', .6], [.5, 'pling', .4]]);
// 5 «desto mehr bekommst du.»: un vecino suelta una nube gigante y le llueven billetes; los de alrededor aplauden
shot(5.00, 'F', null, L => { town(L, 12, -30, 6, 6, 14, 13); const c = put(EX[20], -30, 0, 6, .2); vaper(c, L, L.t0 - 1.2, 1.4, { exh: 1.4, pow: 6, size: 1.7, n: 70, expr: 'joy', meter: true, after: 'open_smile' });
  billDrop(c, L.t0 + .1, L.T, 8, 100, 2.2); POST.push(() => cashPop(c, '+800 €', clamp((L.lt - .2) / .25), 'gold', 1));
  orb(L.k, V(-30, 4.8, 6), null, [14, .45, .1, 44], [12, .25, .08, 44]); sh(V(-30, 0, 6), 20); }, [[0, 'flash', .4], [.1, 'vape_out', .6], [.3, 'money_rain', .6], [.6, 'cheer', .4]]);
// 6 «Eine Sekunde?»: chico del gorro: calada de 1 s; el HUD cuenta
shot(6.10, 'C', 'punch', L => { town(L, 10, 30, -30, 8, 16, 15, { gap: 1.5 }); const c = put(EX[2], 30, 0, -30, -.25); vaper(c, L, L.t0 - .2, 1.0, { exh: 1, expr: 'neutral', meter: true });
  const s = clamp(L.lt - .1, 0, 1); HUD = { s, e: money(s) }; WM.get(c).userData.set(secs(s), euro(money(s)));
  onFace(c, 7.6, 0, 0, 40, L.k, 6.8); sh(V(30, 0, -30), 16); }, [[0, 'thump', .5], [.1, 'vape_in', .6], [.2, 'tick', .4]]);
// 7 «Zehn Euro.»: exhala y le salta el +10 € con un billete
shot(7.00, null, null, L => { town(L, 10, 30, -30, 8, 16, 15, { gap: 1.5 }); const c = put(EX[2], 30, 0, -30, -.25); vaper(c, L, L.t0 - 1.6, 1.0, { exh: 1.2, expr: 'joy', meter: true, after: 'smile' });
  HUD = { s: 1, e: 10 }; WM.get(c).userData.set('1,0 s', '10 €'); billDrop(c, L.t0 + .05, L.T, 1, 10); POST.push(() => cashPop(c, '+10 €', clamp(L.lt / .2), 'green', 1.1));
  orbit(V(30, 5.0, -30), lerp(12, 11, L.k), .3, .08, 42); sh(V(30, 0, -30), 16); }, [[0, 'vape_out', .5], [.15, 'cash', .7]]);
// 8 «Fünf Sekunden?»: Lena (delantal de panadera) aguanta una calada larga; el HUD sube a 5 s
shot(7.90, 'W', null, L => { town(L, 10, -40, -30, 8, 16, 17, { gap: 1.5 }); const c = put(XT[0], -40, 0, -30, .35); vaper(c, L, L.t0 - .3, 5, { expr: 'determined', meter: true, eyes: 'closed' });
  const s = clamp((L.lt) / .85 * 5, 0, 5); HUD = { s, e: money(s) }; WM.get(c).userData.set(secs(s), euro(money(s)));
  const h = hp(c); cm([h.x + 4.5, h.y + .9, h.z + 6.5, h.x, h.y - .4, h.z, 36], [h.x + 3.6, h.y + .8, h.z + 5.4, h.x, h.y - .3, h.z, 34], L.k); sh(V(-40, 0, -30), 16); }, [[0, 'whoosh', .4], [.1, 'vape_in', .8], [.3, 'ticks', .5]]);
// 9 «Fünfhundert Euro.»: suelta la nube y le sale el +500 € entre billetes
shot(8.80, 'C', 'punch', L => { town(L, 12, -40, -30, 8, 16, 17, { gap: 1.5 }); const c = put(XT[0], -40, 0, -30, .35); vaper(c, L, L.t0 - 5.6, 5, { exh: 1.3, pow: 6, size: 1.5, n: 60, expr: 'joy', meter: true, after: 'open_smile' });
  HUD = { s: 5, e: 500 }; WM.get(c).userData.set('5,0 s', '500 €'); billDrop(c, L.t0, L.T, 1, 500); billDrop(c, L.t0 + .1, L.T, 9, 50, 2.2); POST.push(() => cashPop(c, '+500 €', clamp(L.lt / .2), 'gold', 1.2));
  orb(L.k, V(-40, 5.2, -30), null, [12, .55, .1, 42], [10.5, .35, .08, 42]); sh(V(-40, 0, -30), 18); }, [[0, 'vape_out', .7], [.1, 'cash_reg', .7], [.3, 'money_rain', .5]]);
// 10 «Zehn Sekunden?» (zoom lento): el vecino de la camisa hawaiana aguanta 10 s, se pone rojo; el HUD llega a 10
shot(9.90, 'F', 'slow', L => { town(L, 12, 6, 16, 6, 16, 19); const c = put(nach, 6, 0, 16, -.2); vaper(c, L, L.t0 - .3, 10, { expr: 'determined', meter: true, eyes: 'squint' }); 
  const s = clamp(L.lt / .85 * 10, 0, 10); HUD = { s, e: money(s), col: s > 8 ? '#ffd23f' : '#7aff9a' }; WM.get(c).userData.set(secs(s), euro(money(s)));
  onFace(c, 5.6, 0, .6, 38, L.k, 4.4); sh(V(6, 0, 16), 16); }, [[0, 'flash', .4], [.05, 'vape_in', .9], [.2, 'ticks', .5]]);
// 11 «Glückwunsch!»: exhala una nube gigantesca; confeti y fuegos; HUD 1 Mio
shot(10.80, 'C', 'punch', L => { town(L, 16, 6, 16, 6, 18, 19); const c = put(nach, 6, 0, 16, .9); vaper(c, L, L.t0 - 10.6, 10, { exh: 1.8, pow: 8, size: 2.4, n: 90, expr: 'joy', meter: true, after: 'open_smile' });
  HUD = { s: 10, e: 1e6, col: '#ffd23f' }; WM.get(c).userData.set('10,0 s', '1.000.000 €'); confetti(V(6, 0, 16), L.t0, L.T, 70); billRain(V(6, 2, 16), L.T, 120, 18, 14, 18); fireworks(V(6, 0, -10), L.T, 3, 12);
  orb(L.k, V(6, 5.0, 16), null, [13, .1, .1, 44], [10.5, .2, .08, 44]); sh(V(6, 0, 16), 22); }, [[0, 'vape_out', .9], [.05, 'party_horn', .6], [.15, 'confetti', .6], [.3, 'cheer', .7]]);
// 12 «Du bist Millionär!»: bailando bajo la lluvia de billetes, rodeado de gente que aplaude; MILLIONÄR en dorado
shot(11.60, 'Z', null, L => { town(L, 18, 6, 16, 6, 16, 23); const c = put(nach, 6, Math.abs(Math.sin(L.T * 8)) * .45, 16, 0); actuar(c, 0, [[0, { aLx: 2.7 + Math.sin(L.T * 8) * .3, aRx: 2.7 + Math.cos(L.T * 8) * .3, aLz: .4, aRz: .4, aLe: .4, aRe: .4, hipY: 2.05, twist: Math.sin(L.T * 8) * .15 }]], { T: L.T }); laughF(c, L.T); FACES.push(c);
  VP.get(c).visible = true; VP.get(c).userData.grip.visible = true; WM.get(c).visible = true; WM.get(c).userData.set('10,0 s', '1.000.000 €');
  billRain(V(6, 2, 16), L.T, 180, 20, 16, 18, 6); badge('gold', 'MILLIONÄR!', W / 2, H * .2, clamp(L.lt / .25), 1, 1.1);
  orb(L.k, V(6, 5.4, 16), null, [15, .2, .12, 46], [13, .4, .1, 46]); sh(V(6, 0, 16), 22); }, [[0, 'money_rain', .7], [.1, 'cheer', .7], [.4, 'coins', .5]]);
// 13 «Überleg mal, wie viel du heute schon hättest.»: una chica se gira hacia TI y te ofrece su vape; su Dampfmesser gira cifras; arriba «? €»
shot(12.80, 'R', null, L => { town(L, 12, P.x, P.z - 4, 7, 16, 29, { gap: 1.5 }); const c = put(EX[9], P.x, 0, P.z, 0); const off = easeOut(clamp((L.lt - .1) / .5));
  actuar(c, 0, [[0, { aRx: lerp(.8, 1.35, off), aRz: lerp(.1, .45, off), aRe: lerp(1.2, .35, off), aLx: .75, aLz: -.1, aLe: 1.45, headX: .05, headZ: -.1 }]], { T: L.T }); VP.get(c).visible = true; VP.get(c).userData.grip.visible = true;
  const m = WM.get(c); m.visible = true; const r = RNG(Math.floor(L.T * 14)); m.userData.set('? s', Math.floor(r() * 9e6).toLocaleString('de-DE') + ' €', '#ffd23f'); cara(c, L.T, { expr: 'smug', eyes: L.lt > 1.2 ? 'wink' : 'half', mouth: 'smirk' });
  badge('gold', '? €', W / 2, H * .16, clamp((L.lt - .2) / .3), 1, 1.2); onFace(c, 7.4, -.3, 0, 40, L.k, 6.2); sh(V(P.x, 0, P.z), 18); }, [[0, 'whirl', .4], [.2, 'count', .5], [.8, 'hmm', .4]]);
// 14 «Genau.»: el vecino guiña a cámara, sonrisa pícara, con su vape
shot(14.70, 'C', 'punch', L => { town(L, 8, 6, 16, 6, 14, 31); const c = put(nach, 6, 0, 16, 0); actuar(c, 0, [[0, { ...armVape(.15), headZ: .12 }]], { T: L.T }); c.aR.sh.rotation.y = armVape(.15).aRy; VP.get(c).visible = true; VP.get(c).userData.grip.visible = true;
  cara(c, L.T, { eyes: L.lt > .15 ? 'wink' : 'half', mouth: 'smirk' }); onFace(c, 6.6, .3, -.4, 38, L.k, 6.0); sh(V(6, 0, 16), 14); }, [[0, 'impact', .4], [.15, 'blink', .5]]);
// ---------- b: la ciudad se adapta (15,4 – 37,7 s) ----------
const SIT = { lLx: 1.5, lRx: 1.5, lLk: 1.45, lRk: 1.45, hipY: 2.05 };
// sentados en el banco de la plaza (-36, 20) que mira a +x: asientos a lo largo de z
const BK = V(2, 0, 46);
const benchSit = (c, L, dx, i, o = {}) => { show(BANK, BK.x, 0, BK.z, 0, 1); put(c, BK.x + dx, -.62, BK.z + .3, 0); return vapeLoop(c, L, i, { pose: SIT, expr: o.expr || 'neutral', per: 3.2 + i * .4, meter: true, bg: false, ...o }); };
const STELLEN = (c, w, h) => { c.fillStyle = '#fff8e8'; c.fillRect(0, 0, w, h); c.fillStyle = '#2a4a7a'; c.fillRect(0, 0, w, 110); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 70px ${FONT}`; c.fillStyle = '#fff'; c.fillText('STELLENANGEBOT', w / 2, 58);
  c.font = `700 92px ${FONT}`; c.fillStyle = '#d8323a'; c.fillText('DAMPFER (m/w/d)', w / 2, 220); c.font = `700 52px ${FONT}`; c.fillStyle = '#1a1a2a'; c.fillText('Lohn: 10 € pro Sekunde', w / 2, 340); c.fillText('Erfahrung: keine', w / 2, 420); c.fillStyle = '#2ab86a'; c.fillText('Sofort anfangen!', w / 2, 510); };

// 15 «Deshalb ist Dampfen in dieser Stadt»: el funcionario de traje, maletín y vape, va a «trabajar» con la placa DAMPFER
shot(15.40, 'W', null, L => { town(L, 12, 30, 10, 7, 16, 41); const c = put(beam, 30, 0, 10, -.35); const ph = vaper(c, L, L.t0 + .1, .8, { expr: 'smug', meter: true, exh: 1.2 });
  badge3('tag', 'BERUF: DAMPFER', hp(c).add(V(0, 3.3, 0)), clamp(L.lt / .3), .9); onFace(c, 8.6, -.4, 0, 40, L.k, 7.6); sh(V(30, 0, 10), 16); }, [[0, 'whoosh', .4], [.15, 'briefcase', .5], [.45, 'vape_in', .6]]);
// 16 «ein richtiger Beruf.»: el cartel de oferta de empleo en la pantalla; la gente hace cola para apuntarse
shot(16.70, 'F', null, L => { use('HB'); show(BOARD, 10, 0, -50, 0, 1); BOARD.userData.draw(STELLEN); vapeCrowd(L, 10, -38, 12, 5, 12, 43, { face: V(10, 14, -50), gap: 1.4 });
  cm([10, 9, -14, 10, 16, -50, 46], [10, 8, -18, 10, 15.5, -50, 44], L.k); sh(V(10, 0, -42), 30); DOF = 0; }, [[0, 'flash', .4], [.1, 'pages', .5], [.5, 'murmur', .4]]);
// 17 «Niemand arbeitet mehr.»: la panadería con «GESCHLOSSEN»; el panadero sentado en la puerta vapeando
shot(18.00, 'S', null, L => { use('HB'); const c = put(XT[3], -50.5, 0, 12, PI / 2); vaper(c, L, L.t0 + .1, .8, { expr: 'smug', exh: 1.1, extra: { lean: -.08 } }); badge3('red', 'GESCHLOSSEN', V(-53.5, 11, 12), clamp(L.lt / .25), .8);
  vapeCrowd(L, -46, 12, 6, 8, 14, 45, { gap: 1.5 }); orb(L.k, V(-51, 5.4, 12), null, [15, 1.25, .1, 44], [13, 1.4, .08, 44]); sh(V(-50, 0, 12), 20); }, [[0, 'swipe', .4], [.1, 'door_close', .5], [.4, 'sigh', .4]]);
// 18 «Die Leute sitzen den ganzen Tag auf Bänken,»: tres vecinos en el banco, cada uno con su nube
shot(19.20, 'C', null, L => { use('HB'); [[EX[12], -4.6, 0], [EX[13], 0, 1], [EX[14], 4.6, 2]].forEach(([c, dz, i]) => benchSit(c, L, dz, i)); vapeCrowd(L, BK.x, BK.z - 8, 8, 6, 14, 47, { gap: 1.6 });
  orb(L.k, V(BK.x, 4.0, BK.z), null, [24, .62, .1, 44], [21, .5, .08, 44]); sh(V(BK.x, 0, BK.z), 18); }, [[0, 'thud', .4], [.2, 'vape_out', .5], [.8, 'vape_out', .4]]);
// 19 «ziehen und»: primer plano de la vecina del medio dando una calada
shot(21.30, 'Z', null, L => { use('HB'); [[EX[12], -4.6, 0], [EX[14], 4.6, 2]].forEach(([c, dz, i]) => benchSit(c, L, dz, i, { bg: true })); const c = EX[13]; put(c, BK.x, -.62, BK.z + .3, 0); vaper(c, L, L.t0, .5, { pose: SIT, expr: 'smug', meter: true, exh: .9 });
  onFace(c, 5.6, .2, 0, 38, L.k, 5); sh(V(BK.x, 0, BK.z), 14); }, [[0, 'zoom_in', .4], [.1, 'vape_in', .6], [.6, 'vape_out', .5]]);
// 20 «warten auf ihr Geld.»: mira su Dampfmesser; le cae un billete de 10 al regazo
shot(22.20, 'C', 'punch', L => { use('HB'); const c = EX[13]; show(BANK, BK.x, 0, BK.z, 0, 1); put(c, BK.x, -.62, BK.z + .3, 0); actuar(c, 0, [[0, { ...SIT, aLx: .85, aLz: -.55, aLe: 1.5, headX: .45, headY: .25 }]], { T: L.T }); VP.get(c).visible = true; VP.get(c).userData.grip.visible = true; FACES.push(c);
  const m = WM.get(c); m.visible = true; m.userData.set('0,9 s', '+10 €'); cara(c, L.T, { expr: 'smug', eyes: 'down', mouth: 'smile' }); billDrop(c, L.t0 + .1, L.T, 1, 10);
  [[EX[12], -4.6, 0], [EX[14], 4.6, 2]].forEach(([e, dz, i]) => benchSit(e, L, dz, i, { bg: true })); onFace(c, 6.2, .8, -.5, 38, L.k, 5.6); sh(V(BK.x, 0, BK.z), 14); }, [[0, 'thump', .4], [.1, 'notif', .6], [.3, 'cash', .5]]);
// 21 «Mein Nachbar kaufte sich einen Sportwagen,»: el vecino junto a su deportivo amarillo, enseñando la llave
shot(23.00, 'W', null, L => { town(L, 8, 30, 40, 9, 16, 49); show(CAR, 26, 0, 40, .5, 1); const c = put(nach, 31, 0, 44, -.3); actuar(c, 0, [[0, { aLx: 2.4, aLz: .2, aLe: .3, aRx: .6, aRz: -.2, aRe: 1.0 }]], { T: L.T }); laughF(c, L.T); FACES.push(c);
  VP.get(c).visible = true; VP.get(c).userData.grip.visible = true; const k = textPlane; badge3('gold', 'NEU!', V(26, 8, 40), clamp(L.lt / .3), .9);
  orb(L.k, V(28.5, 4.5, 42), null, [22, -.1, .12, 46], [19, .1, .1, 46]); sh(V(28, 0, 42), 22); }, [[0, 'whoosh', .4], [.1, 'car', .6], [.6, 'keys', .5]]);
// 22 «nachdem er drei Pods»: tres pods vacíos caen sobre el capó: 1, 2, 3
shot(24.70, 'C', 'punch', L => { town(L, 6, 30, 40, 9, 16, 49); show(CAR, 26, 0, 40, .5, 1); const c = put(nach, 30, 0, 36, -.4); vaper(c, L, L.t0 - .4, 1.4, { expr: 'smug', meter: true });
  const n = Math.min(3, 1 + Math.floor(L.lt / .38)); badge('gold', `${n} PODS`, W / 2, H * .17, 1, 1, 1);
  for (let i = 0; i < 3; i++) { const v = BILLP[50][i]; }   // (sin billetes aquí)
  onFace(c, 7, 0, 0, 40, L.k, 6.2); sh(V(28, 0, 38), 18); }, [[0, 'impact', .4], [.05, 'pop', .5], [.43, 'pop', .5], [.81, 'pop', .6]]);
// 23 «leer gezogen hatte.»: arranca el deportivo y se va dejando una nube de vapor
shot(25.90, 'S', null, L => { use('HB'); const x = 26 + easeIn(clamp(L.lt / 1.2)) * 30; show(CAR, x, 0, 40, PI / 2, 1);   SMK.puff(V(x - 6, 1.2, 40), V(-1, .2, 0), L.T, L.t0, 1.2, { n: 50, pow: 4, size: 2, dens: .8, seed: 7 });
  cm([20, 5, 62, 28, 3.5, 40, 44], [24, 5, 60, 38, 3.5, 40, 44], L.k); sh(V(32, 0, 40), 26); DOF = 0; }, [[0, 'swipe', .3], [.1, 'car', .8], [.4, 'vape_out', .4]]);
// 24 «Meine Lehrerin zog während der Mathearbeit»: el aula; la profesora vapea en su mesa mientras los alumnos sudan con el examen
shot(27.10, 'Z', null, L => { use('KL'); inside(1, 60); KL.BB.userData.draw('mathe', (c, w, h) => { c.fillStyle = '#1e3a2a'; c.fillRect(0, 0, w, h); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 70px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText('MATHEARBEIT', w / 2, 70); c.font = `700 52px ${FONT}`; c.fillText('12 × 17 = ?', w / 2, 170); c.fillText('√144 = ?', w / 2, 240); });
  const c = put(kess, CX - 8, 0, -6.6, .2); vaper(c, L, L.t0 + .1, 1.1, { expr: 'smug', meter: true, exh: 1.2 });
  [[EX[15], -11, -2], [EX[16], 0, -2], [EX[17], 11, -2], [EX[18], -11, 6], [EX[19], 0, 6], [EX[21], 11, 6]].forEach(([e, x, z], i) => { put(e, CX + x, 0, z - 1.6, PI); actuar(e, 0, [[0, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: .9, aRe: .9, headX: .4 }]], { T: L.T }); cara(e, L.T + i, { expr: 'worried' }); e.root.position.y = -.62; });
  orb(L.k, V(CX - 8, 5.4, -6.6), null, [17, .35, .16, 44], [14, .25, .12, 44]); sh(V(CX - 6, 0, -4), 26); }, [[0, 'zoom_in', .4], [.1, 'classroom', .4], [.2, 'pencil', .5], [.5, 'vape_in', .5]]);
// 25 «und kaufte aus Versehen»: su Dampfmesser: «SCHULE GEKAUFT ✓»; ella se sorprende
shot(29.00, 'C', 'punch', L => { use('KL'); inside(1, 60); const c = put(kess, CX - 8, 0, -6.6, .2); actuar(c, 0, [[0, { aLx: 1.6, aLz: -.3, aLe: 1.4, ...armVape(.1), headX: .3 }]], { T: L.T }); c.aR.sh.rotation.y = armVape(.1).aRy; VP.get(c).visible = true; VP.get(c).userData.grip.visible = true; FACES.push(c);
  const m = WM.get(c); m.visible = true; m.userData.set('SCHULE', 'GEKAUFT ✓', '#ffd23f'); cara(c, L.T, { expr: 'shock', eyes: L.lt > .3 ? 'wide' : 'down', mouth: L.lt > .3 ? 'o' : 'flat' }); badge('gold', 'SCHULE GEKAUFT!', W / 2, H * .18, clamp((L.lt - .25) / .25), 1, .9);
  onFace(c, 6.4, .3, 0, 38, L.k, 5.6); sh(V(CX - 8, 0, -6), 14); }, [[0, 'thump', .4], [.1, 'notif', .6], [.3, 'gasp_f', .6]]);
// 26 «die ganze Schule.»: la fachada del Gymnasium con la pancarta VERKAUFT; ella delante, alucinando
shot(30.00, 'W', null, L => { use('GY'); const c = put(kess, GX, 0, 22, 0); actuar(c, 0, [[0, GEST.hands_head]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); FACES.push(c); GY.SOLD.scale.setScalar(spring(clamp(L.lt / .5))); GY.SOLD.position.y = 25;
  vapeCrowd(L, GX, 26, 10, 7, 14, 51, { gap: 1.4 }); cm([GX, 8, 62, GX, 18, 0, 46], [GX, 7, 54, GX, 17, 0, 46], L.k); sh(V(GX, 0, 20), 40); DOF = 0; }, [[0, 'whoosh', .4], [.2, 'stamp', .7], [.4, 'kids_laugh', .4]]);
// 27 «Und der Bürgermeister?» (zoom lento): el Rathaus envuelto en una nube espesa
shot(31.10, 'F', 'slow', L => { use('HB'); SMK.haze(V(-6, 22, -84), L.T, 40, 26, 9, 8, 10, .55, 21); vapeCrowd(L, -6, -66, 10, 6, 16, 53, { gap: 1.3 });
  cm([-6, 12, -30, -6, 20, -92, 44], [-6, 13, -40, -6, 21, -92, 42], L.k); sh(V(-6, 0, -70), 40); DOF = 0; }, [[0, 'flash', .4], [.1, 'bell_far', .5]]);
// 28 «Der hat seit acht Jahren keine frische Luft mehr geatmet.»: el despacho lleno de vapor, ventana sellada con cinta; el alcalde vapea en su sillón
shot(32.10, 'Z', null, L => { use('BU'); inside(1.05, 60); const c = put(mayor, BX, 1.05, -8.6, 0); vaper(c, L, L.t0 + .1, 1.4, { pose: SIT, expr: 'smug', meter: true, exh: 1.4, pow: 4, size: 1.5 });
  SMK.haze(V(BX, 9, -4), L.T, 30, 16, 5, 9, 6, .28, 23);
  orb(L.k, V(BX, 8.0, -8.6), null, [15, .3, .2, 44], [12, .2, .16, 44]); sh(V(BX, 0, -6), 24); }, [[0, 'zoom_in', .4], [.2, 'vape_in', .5], [1.5, 'vape_out', .5]]);
// 29 «frische Luft mehr geatmet.»: la ventana con FENSTER NIE ÖFFNEN y el contador de días
shot(33.40, 'S', null, L => { use('BU'); inside(1.05, 60); const c = put(mayor, BX - 6.5, 0, -11.5, .3); vaper(c, L, L.t0 - .8, 1, { expr: 'smug', exh: 1.3 }); SMK.haze(V(BX, 9, -8), L.T, 22, 14, 4, 4, 6, .22, 25);
  badge('red', '2.920 TAGE', W / 2, H * .16, clamp(L.lt / .3), 1, 1); badge('tag', 'ohne frische Luft', W / 2, H * .23, clamp((L.lt - .15) / .3), 1, .9);
  cm([BX - 3.5, 8.6, 5, BX - 4.6, 7.4, -13, 44], [BX - 3.8, 8.4, 2.5, BX - 4.6, 7.4, -13, 42], L.k); sh(V(BX - 4, 0, -10), 20); }, [[0, 'swipe', .4], [.2, 'tape', .5], [.6, 'tick', .4]]);
// 30 «Er ist der reichste Mann der Stadt.»: el ranking de la ciudad en la pantalla gigante; el alcalde (n.º 1) posa delante con su cadena dorada
const RANK1 = [['Bürgermeister Brandt', '84 Mio. €'], ['Sabine Krüger', '61 Mio. €'], ['Lukas Hoffmann', '47 Mio. €'], ['Anna Wagner', '39 Mio. €'], ['Jonas Becker', '28 Mio. €'], ['Marie Schulz', '21 Mio. €']];
shot(34.80, 'C', 'punch', L => { use('HB'); show(BOARD, 10, -5, -50, 0, 1); BOARD.userData.draw((c, w, h) => drawRank(c, w, h, 'REICHSTE DAMPFER', RANK1, 0, L.lt / .8));
  const c = put(mayor, 10, 0, -27, 0); vaper(c, L, L.t0 + .3, .7, { expr: 'smug', meter: true }); vapeCrowd(L, 10, -34, 10, 5, 12, 55, { face: c.root.position, gap: 1.5 });
  cm([10, 8.4, -8, 10, 8.6, -46, 46], [10, 8.6, -12, 10, 8.8, -46, 46], L.k); sh(V(10, 0, -44), 28); DOF = 0; }, [[0, 'impact', .4], [.1, 'ding_reveal', .5], [.3, 'cash_reg', .5]]);
// 31 «Aber es gibt ein Problem.» (zoom lento): dos policías con escáneres de vapor avanzan por la plaza; todo se oscurece
shot(36.50, 'I', 'slow', L => { use('HB'); COP.forEach((c, i) => { put(c, -8 + i * 5, 0, -1 + L.lt * 2.4, 0); actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); cara(c, L.T, { expr: 'angry', mouth: 'flat' }); FACES.push(c); }); vapeCrowd(L, -5.5, -2, 8, 7, 14, 57, { gap: 1.5 });
  orb(L.k, V(-5.5, 5, 2), null, [14, 0, .05, 44], [11, 0, .04, 42]); DARK = .25 * L.k; sh(V(-5.5, 0, 2), 20); }, [[0, 'iris_pop', .4], [.1, 'steps_heavy', .6]]);
// ---------- c: la ley, yo y el quiosco (37,7 – 68,4 s) ----------
const meterClose = (c, L, a, b, col) => { const m = WM.get(c); m.visible = true; m.userData.set(a, b, col); };
// 32 «Die Regierung nimmt das sehr ernst.»: el funcionario del Amt für Dampf da un discurso ante el Rathaus
shot(37.70, 'W', null, L => { use('HB'); show(PODIUM, -6, 0, -65.6, 0, .72); show(BANNER, -6, 15, -73, 0, 1); const c = put(beam, -6, 0, -68.6, 0); talk(c, L.T, L.t0, L.t0 + 2, 'angry'); actuar(c, 0, [[0, { aRx: 1.2, aRz: -.1, aRe: .4, aLx: .5, aLe: .8 }], [.5, { aRx: .6, aRe: 1.6, aLx: 1.2, aLe: .3 }]], { T: L.T }); FACES.push(c);
  
  orb(L.k, V(-6, 7.4, -68.6), null, [15, .1, .22, 44], [12.5, -.05, .18, 44]); sh(V(-6, 0, -66), 26); }, [[0, 'whoosh', .3], [.2, 'murmur', .4], [.8, 'table_bang', .5]]);
// 33 «sehr ernst.»: primer plano serio; sella con un golpe «STRENG KONTROLLIERT»
shot(38.70, 'C', 'punch', L => { use('HB'); show(PODIUM, -6, 0, -65.6, 0, .72); show(BANNER, -6, 15, -73, 0, 1); const c = put(beam, -6, 0, -68.6, 0); const hit = L.lt > .35;
  actuar(c, 0, [[0, { aRx: hit ? .9 : 1.7, aRe: hit ? .5 : 1.4, lean: hit ? .15 : 0 }]], { T: L.T }); cara(c, L.T, { expr: 'angry', mouth: 'flat' }); FACES.push(c);
  badge('red', 'STRENG KONTROLLIERT', W / 2, H * .2, clamp((L.lt - .35) / .2), 1, .8); onFace(c, 5.2, 2.2, .5, 38, L.k, 4.6); sh(V(-6, 0, -66), 14); }, [[0, 'impact', .4], [.35, 'stamp', .8]]);
// 34 «Jeder trägt einen Dampfmesser am Handgelenk,»: tres vecinos (abuela, chico, obrero) levantan la muñeca con su Dampfmesser
shot(39.70, 'Z', null, L => { use('HB'); [[XT[4], -4], [EX[22], 0], [XT[3], 4]].forEach(([c, x], i) => { put(c, x - 6, 0, 8, 0); const up = easeOut(clamp((L.lt - i * .15) / .35)); actuar(c, 0, [[0, { aLx: lerp(.2, 1.7, up), aLz: lerp(0, -.25, up), aLe: lerp(.2, 1.3, up) }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'joy', mouth: 'smile' }); meterClose(c, L, '0,0 s', '0 €'); FACES.push(c); });
  vapeCrowd(L, -6, 2, 8, 8, 14, 63, { gap: 1.5 }); orb(L.k, V(-6, 5, 8), null, [17, 0, .1, 44], [14, 0, .08, 44]); sh(V(-6, 0, 8), 18); }, [[0, 'zoom_in', .3], [.2, 'watch_click', .5], [.4, 'watch_click', .4], [.6, 'watch_click', .4]]);
// 35 «am Handgelenk,»: macro del Dampfmesser en la muñeca de la abuela (la pantalla cuenta)
shot(40.70, 'C', null, L => { use('HB'); const c = put(XT[4], -10, 0, 8, 0); actuar(c, 0, [[0, { aLx: 1.7, aLz: -.25, aLe: 1.3 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'smile' }); const s = (L.lt * 1.4) % 3; meterClose(c, L, secs(s), euro(money(s)));
  c.root.updateMatrixWorld(true); const M = WM.get(c), w = M.getWorldPosition(V(0, 0, 0)), n = V(0, 0, 1).applyQuaternion(M.getWorldQuaternion(new THREE.Quaternion())), p = w.clone().addScaledVector(n, lerp(4.2, 3.4, L.k)); cam([p.x, p.y, p.z], [w.x, w.y, w.z], 32); camera.up.copy(V(0, 1, 0).applyQuaternion(M.getWorldQuaternion(new THREE.Quaternion()))); camera.lookAt(w); DOF = 1.4; sh(V(-10, 0, 8), 12); }, [[0, 'tick', .5], [.3, 'tick', .4], [.6, 'tick', .4]]);
// 36 «und wer Dampf fälscht,»: un tipo hace «vapor» con un hervidor escondido; su Dampfmesser se pone rojo: FÄLSCHUNG!
shot(41.70, 'S', null, L => { use('HB'); const c = put(nebel, 24, 0, -20, -.4); actuar(c, 0, [[0, { aRx: .9, aRe: 1.2, aLx: 1.6, aLz: -.3, aLe: 1.3, headX: .25 }]], { T: L.T }); show(FOG, 25.6, 0, -18.4, -.4, .8); SMK.puff(V(25.4, 1.4, -17.4), V(.2, .6, 1), L.T, L.t0, 1, { n: 40, pow: 3, size: 1.6, dens: .8, seed: 31 }); FACES.push(c);
  const bad = L.lt > .5; meterClose(c, L, bad ? 'FAKE!' : '0,8 s', bad ? 'FÄLSCHUNG' : '8 €', bad ? '#ff3a3a' : '#7aff9a'); cara(c, L.T, { expr: bad ? 'shock' : 'smug', mouth: bad ? 'o' : 'smirk' }); if (bad) badge('red', 'FÄLSCHUNG!', W / 2, H * .2, clamp((L.lt - .5) / .2), 1, 1);
  orb(L.k, V(24.6, 4.6, -19.4), null, [13, -.3, .12, 44], [11.5, -.15, .1, 44]); sh(V(24, 0, -20), 16); }, [[0, 'swipe', .3], [.1, 'steam', .6], [.5, 'alarm', .6]]);
// 37 «kommt sofort ins Gefängnis.»: la cárcel; dos policías meten al tramposo por la verja
shot(42.70, 'F', null, L => { use('KN'); const z = 6 - L.lt * 3.4; put(nebel, JX, 0, z, PI); actuar(nebel, 0, [[0, { ...walkP(L.T, 0), aLx: -.4, aRx: -.4, aLz: .3, aRz: .3 }]], { T: L.T }); cara(nebel, L.T, { expr: 'sad', mouth: 'frown' });
  COP.forEach((c, i) => { put(c, JX + (i ? 2.6 : -2.6), 0, z + 1.2, PI); actuar(c, 0, [[0, { ...walkP(L.T, i + 1), aRx: 1.2, aRz: i ? .4 : -.4 }]], { T: L.T }); cara(c, L.T, { expr: 'angry' }); });
  KN.gate.position.x = clamp(L.lt / .6) * 11; cm([JX + 2, 9, 38, JX, 10, -6, 46], [JX + 1.5, 8.5, 31, JX, 9.5, -6, 46], L.k); sh(V(JX, 0, 0), 30); DOF = 0; }, [[0, 'flash', .4], [.1, 'siren', .5], [.3, 'metal_creak', .5], [1.1, 'door_slam', .6]]);
// 38 «Letzten Monat hat ein Mann eine Nebelmaschine benutzt.»: de noche, el tipo con su NEBEL 3000 llena la plaza de niebla, sonriendo
shot(44.10, 'R', null, L => { use('HB'); darkNight(); const c = put(nebel, -20, 0, 30, .5); actuar(c, 0, [[0, { aRx: .8, aRz: -.2, aRe: .9, headX: .1, aLx: 2.4, aLe: .3 }]], { T: L.T }); grin(c, L.T); FACES.push(c);
  show(FOG, -17.2, 0, 31.4, .6, 1.2); SMK.puff(V(-16.4, 1.6, 33), V(.5, .3, 1), L.T, L.t0 - 1.5, 4, { n: 90, pow: 5, size: 2.6, dens: .75, seed: 33, life: 4 }); meterClose(c, L, '9,9 s', '980.000 €', '#ffd23f');
  orb(L.k, V(-19, 5, 30.6), null, [16, .1, .12, 44], [13, .3, .1, 44]); sh(V(-19, 0, 31), 18); }, [[0, 'whirl', .4], [.1, 'steam', .7], [.6, 'evil_laugh', .4]]);
// 39 «benutzt.»: los policías lo pillan con la linterna; el Dampfmesser marca FAKE en rojo
shot(45.20, 'C', 'punch', L => { use('HB'); darkNight(); const c = put(nebel, -20, 0, 30, .5); actuar(c, 0, [[0, GEST.shock]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'scream' }); show(FOG, -17.2, 0, 31.4, .6, 1.2); FACES.push(c);
  COP.forEach((p, i) => { put(p, -20 + (i ? 4.6 : -4.6), 0, 33, i ? -.8 : .8); actuar(p, 0, [[0, { aRx: 1.6, aRe: .2, aRz: i ? .3 : -.3 }]], { T: L.T }); cara(p, L.T, { expr: 'angry', mouth: 'shout' }); });
  meterClose(c, L, 'FAKE!', 'FÄLSCHUNG', '#ff3a3a'); TINT = Math.sin(L.T * 18) > 0 ? 'rgba(255,40,40,.12)' : 'rgba(40,80,255,.12)'; onFace(c, 8, .3, 0, 40, L.k, 7); sh(V(-20, 0, 31), 16); }, [[0, 'siren', .7], [.1, 'gasp', .5], [.4, 'shout_m', .4]]);
// 40 «Fünfundzwanzig Jahre.» (zoom lento): detrás de las rejas, triste; 25 JAHRE
shot(46.30, 'I', 'slow', L => { use('KN'); const c = put(nebel, JX - 15, 0, -13.6, 0); show(BARS, JX - 14.4, 0, -11.6, 0, 1); actuar(c, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .32, aRz: .32, aLe: .7, aRe: .7, headX: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' }); tears(c, L.T); FACES.push(c);
  badge('red', '25 JAHRE', W / 2, H * .18, clamp(L.lt / .3), 1, 1.2); const h = hp(c); cm([h.x + .5, h.y + .3, h.z + 9, h.x, h.y - .6, h.z, 36], [h.x + .3, h.y + .2, h.z + 7, h.x, h.y - .5, h.z, 34], L.k); sh(V(JX - 15, 0, -14), 14); }, [[0, 'iris_pop', .4], [.2, 'metal_hit', .5], [.6, 'sad_tone', .5]]);
// 41 «Und ich?»: yo (Timo) en la plaza, me giro a cámara
shot(47.80, 'C', 'punch', L => { town(L, 12, 2, -4, 7, 16, 65); const c = put(ich, 2, 0, 2, lerp(-1.4, 0, easeOut(clamp(L.lt / .3)))); actuar(c, 0, [[0, { aLx: .2, aRx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'neutral', mouth: 'flat' }); FACES.push(c);
  onFace(c, 6.6, .2, 0, 40, L.k, 6); sh(V(2, 0, 2), 14); }, [[0, 'thump', .5], [.1, 'whoosh_soft', .3]]);
// 42 «Ich war komplett pleite.»: en mi cuarto, abro la cartera vacía; el Dampfmesser marca 0 €; una polilla sale volando
shot(48.70, 'S', null, L => { use('ZI'); inside(1, 60); const c = put(ich, ZX, 0, -2, 0); actuar(c, 0, [[0, { aLx: .5, aRx: .5, aLz: -.25, aRz: -.25, aLe: .9, aRe: .9, headX: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown', eyes: 'down' }); FACES.push(c);
  c.root.updateMatrixWorld(true); const hl = c.aL.hand.getWorldPosition(V(0, 0, 0)), hr = c.aR.hand.getWorldPosition(V(0, 0, 0)); show(WALLET, (hl.x + hr.x) / 2, (hl.y + hr.y) / 2 + .1, (hl.z + hr.z) / 2 + .3, 0, 1.2); meterClose(c, L, '0,0 s', '0 €', '#ff5a5a');
  badge('red', '0 €', W / 2, H * .18, clamp(L.lt / .3), 1, 1.2); onFace(c, 8.6, -.2, 0, 40, L.k, 7.8); sh(V(ZX, 0, -2), 16); }, [[0, 'swipe', .3], [.2, 'zip', .5], [.5, 'sad_tone', .4]]);
// 43 «Denn ich habe schwache Lungen,»: me doy un puff del inhalador azul
shot(50.10, 'C', null, L => { use('ZI'); inside(1, 60); const c = put(ich, ZX, 0, -2, 0); const up = easeOut(clamp(L.lt / .25)); actuar(c, 0, [[0, { aLx: lerp(.3, 1.5, up), aLz: lerp(0, -.75, up), aLe: lerp(.2, 2.3, up), headX: -.05 }]], { T: L.T }); INH.visible = true; FACES.push(c);
  cara(c, L.T, { expr: 'worried', eyes: L.lt > .35 ? 'closed' : 'worried', mouth: 'flat' }); onFace(c, 5.8, .2, 1.4, 38, L.k, 5.2); sh(V(ZX, 0, -2), 12); }, [[0, 'impact_soft', .3], [.3, 'breath', .5], [.35, 'steam', .3]]);
// 44 «seit ich geboren bin.»: recuerdo en sepia: yo de pequeño con el inhalador
shot(51.00, 'F', null, L => { use('ZI'); inside(1, 60); const c = put(ich, ZX, 0, -2, 0); c.root.scale.setScalar(.55); actuar(c, 0, [[0, { aLx: 1.5, aLz: -.75, aLe: 2.3 }]], { T: L.T }); INH.visible = true; cara(c, L.T, { expr: 'sad', eyes: 'wide', mouth: 'o' }); FACES.push(c);
  grade.uniforms.sepia.value = .85; grade.uniforms.vig.value = .7; const h = hp(c); cm([h.x + .4, h.y + .6, h.z + 7, h.x, h.y - .8, h.z, 38], [h.x + .2, h.y + .5, h.z + 6, h.x, h.y - .7, h.z, 36], L.k); sh(V(ZX, 0, -2), 12); }, [[0, 'flash', .5], [.2, 'musicbox2', .4]]);
// 45 «Während alle anderen riesige Wolken machten,»: la plaza entera echa nubes enormes a la vez; yo en medio, pequeño
shot(52.10, 'W', null, L => { town(L, 22, -6, -2, 5, 18, 67, { gap: .9 }); EX.slice(0, 6).forEach(e => { if (e.root.visible) SMK.puff(mouthW(e), smokeDir(e, .5), L.T, L.t0 + .1, 1.6, { n: 26, pow: 7, size: 2.4, dens: .8, seed: e.seed + 3 }); });
  const c = put(ich, -6, 0, 4, 0); actuar(c, 0, [[0, { aLx: .1, aRx: .1, headX: -.2 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'flat', eyes: 'up' }); FACES.push(c);
  cm([-6, 26, 30, -6, 3, 0, 46], [-6, 18, 24, -6, 4, 2, 46], L.k); sh(V(-6, 0, 0), 30); DOF = 0; }, [[0, 'whoosh', .3], [.1, 'vape_out', .6], [.4, 'vape_out', .5], [.8, 'cheer', .3]]);
// 46 «schaffte ich anderthalb Sekunden.»: mi calada: 1,5 s y la cara roja del esfuerzo
shot(54.20, 'C', 'punch', L => { town(L, 8, -6, -2, 7, 14, 69, { gap: 1.5 }); const c = put(ich, -6, 0, 4, 0); vaper(c, L, L.t0 - .25, 1.5, { expr: 'determined', meter: true, eyes: 'squint', exh: .5, size: .5, n: 12, pow: 2 });
  const s = clamp(L.lt - .05, 0, 1.5); HUD = { s, e: s * 10 / 3 }; meterClose(c, L, secs(s), euro(s * 10 / 3)); sweat(c, L.T, 2); onFace(c, 5.8, .1, 0, 38, L.k, 5.2); sh(V(-6, 0, 4), 12); }, [[0, 'impact', .4], [.1, 'vape_in', .6], [.6, 'strain', .5]]);
// 47 «Fünf Euro.»: me cae un billete de 5 €, triste
shot(56.00, 'S', null, L => { town(L, 8, -6, -2, 7, 14, 69, { gap: 1.5 }); const c = put(ich, -6, 0, 4, 0); actuar(c, 0, [[0, { aLx: .9, aLz: -.1, aLe: 1.3 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' }); FACES.push(c); VP.get(c).visible = true; VP.get(c).userData.grip.visible = true;
  HUD = { s: 1.5, e: 5 }; meterClose(c, L, '1,5 s', '5 €'); billDrop(c, L.t0, L.T, 1, 5); POST.push(() => cashPop(c, '+5 €', clamp(L.lt / .2), 'tag', .9)); orbit(V(-6, 4.2, 4), lerp(10, 9, L.k), .25, .06, 40); sh(V(-6, 0, 4), 14); }, [[0, 'swipe', .3], [.1, 'coin_flip', .5], [.4, 'sad_tone', .3]]);
// 48 «Dann musste ich husten.»: me doblo tosiendo; bocanadas pequeñas
shot(56.70, 'C', 'punch', L => { town(L, 10, -6, -2, 7, 15, 71, { gap: 1.5 }); const c = put(ich, -6, 0, 4, 0); const k = Math.abs(Math.sin(L.T * 9)); actuar(c, 0, [[0, { lean: .35 + k * .15, headX: .3 + k * .2, aLx: 1.0, aLz: -.6, aLe: 2.0, aRx: .5, aRe: .8 }]], { T: L.T }); FACES.push(c);
  cara(c, L.T, { expr: 'worried', eyes: 'closed', mouth: k > .5 ? 'scream' : 'grimace' }); VP.get(c).visible = true; VP.get(c).userData.grip.visible = true; for (let i = 0; i < 4; i++) SMK.puff(mouthW(c), smokeDir(c, .1), L.T, L.t0 + i * .26, .08, { n: 5, pow: 3, size: .5, dens: .5, seed: 40 + i, life: 1 });
  onFace(c, 6.6, .4, .2, 40, L.k, 6); sh(V(-6, 0, 4), 12); }, [[0, 'cough', .8], [.3, 'cough', .7], [.6, 'cough', .7]]);
// 49 «husten.»: la gente me señala y se ríe
shot(57.60, 'W', null, L => { town(L, 0); [[EX[2], -4.4], [EX[6], 0], [XT[1], 4.4]].forEach(([e, x], i) => { put(e, -6 + x, 0, -6, 0); actuar(e, 0, [[0, { aRx: 1.5, aRe: .1, aRz: x > 0 ? .25 : x < 0 ? -.15 : 0, lean: -.1 + Math.sin(L.T * 12 + i) * .05 }]], { T: L.T }); laughF(e, L.T + i); FACES.push(e); });
  vapeCrowd(L, -6, -10, 8, 6, 12, 73, { gap: 1.4 }); orb(L.k, V(-6, 5, -6), null, [16, 0, .1, 44], [14, .1, .08, 44]); sh(V(-6, 0, -6), 18); }, [[0, 'whoosh', .3], [.1, 'laugh_m', .6], [.4, 'kids_laugh', .4]]);
// 50 «Bis ich etwas fand.» (zoom lento): de noche, una calle vacía y un quiosco viejo con la puerta entreabierta
shot(58.50, 'F', 'slow', L => { use('HB'); darkNight(); show(KIOSKF, -30, 0, -66, 0, 1); const c = put(ich, -29, 0, -55 - L.lt * 1.4, PI); actuar(c, 0, [[0, walkP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  cm([-27, 7, -40, -30, 5.5, -64, 44], [-27.5, 6.5, -44, -30, 5.5, -64, 42], L.k); sh(V(-30, 0, -60), 18); }, [[0, 'flash', .3], [.1, 'wind', .4], [.4, 'steps', .4], [.9, 'door_creak', .5]]);
// 51 «In einem verlassenen Kiosk,»: dentro: polvo, telarañas, baldas desteñidas; entro despacio
shot(59.60, 'Z', null, L => { use('KI'); inside(.8, 40); const c = put(ich, KX + 2, 0, 7.5 - L.lt * 1.2, PI - .5); actuar(c, 0, [[0, walkP(L.T * .6, 0)]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); FACES.push(c);
  SMK.haze(V(KX, 6, -2), L.T, 18, 12, 4, 8, 4, .12, 51); orb(L.k, V(KX + 1, 6, 6), null, [16, -.7, .18, 46], [14, -.85, .14, 46]); sh(V(KX, 0, 0), 20); }, [[0, 'zoom_in', .3], [.1, 'wood_creak', .5], [.6, 'drip', .4]]);
// 52 «ganz hinten im Regal:»: la cámara sube por las baldas hasta la última, de donde sale un brillo dorado
shot(60.90, 'S', null, L => { use('KI'); inside(.8, 40); const G = KI.GOLDPOS; show(GOLD2, G.x, G.y, G.z, .3, 1); GOLD2.userData.setGlow(.6 + Math.sin(L.T * 6) * .3); KI.beam.visible = L.k < .4;
  cm([G.x + 2, G.y - 5, G.z + 9, G.x, G.y - 4, G.z, 40], [G.x + 1, G.y + .8, G.z + 6, G.x, G.y + .5, G.z, 38], L.k, easeOut); DOF = 1.2; sh(V(KX, 0, -6), 14); }, [[0, 'swipe', .3], [.2, 'creepy_ting', .5], [.6, 'sparkle', .4]]);
// 53 «eine goldene Vape.» (zoom lento): la vape dorada brillando sobre la balda polvorienta
shot(62.10, 'F', 'slow', L => { use('KI'); inside(.7, 30); const G = KI.GOLDPOS; show(GOLD2, G.x, G.y, G.z, .3 + L.lt * .3, 1); GOLD2.userData.setGlow(.8 + Math.sin(L.T * 6) * .3); KI.LI.intensity = 60; KI.beam.visible = false;
  cm([G.x + .6, G.y + 1.2, G.z + 3.4, G.x, G.y + .8, G.z, 34], [G.x + .3, G.y + 1.0, G.z + 2.4, G.x, G.y + .8, G.z, 32], L.k); DOF = 2; sh(V(KX, 0, -6), 10); }, [[0, 'flash', .4], [.1, 'choir', .4], [.3, 'sparkle', .6]]);
// 54 «Darauf stand: „Warnung:»: la tengo en la mano, delante de mi cara, y leo la parte de atrás
shot(63.20, 'C', null, L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); actuar(c, 0, [[0, { ...armVape(.55), headX: .3 }]], { T: L.T }); c.aR.sh.rotation.y = armVape(.55).aRy; GOLD.visible = true; GOLD.userData.grip.visible = true; GOLD.userData.setGlow(.6); FACES.push(c);
  cara(c, L.T, { expr: 'confused', eyes: 'down', mouth: 'flat' }); onFace(c, 6.4, .4, .5, 38, L.k, 5.6); DOF = 1.2; sh(V(KX, 0, 6), 12); }, [[0, 'whoosh_soft', .3], [.2, 'paper', .4]]);
// 55 «Niemals mehr als einen Zug.»: macro de la pegatina roja WARNUNG (mi cara desenfocada detrás)
shot(64.50, 'C', 'punch', L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 2, 0); actuar(c, 0, [[0, { aLx: .3, aRx: .3, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); const g = hp(c).add(V(0, -.6, 3.4)); show(GOLD2, g.x, g.y, g.z, PI, 1.6); GOLD2.rotation.z = Math.sin(L.T * 2) * .05; GOLD2.userData.setGlow(.7);
  cam([g.x, g.y + 1.0, g.z + 3.0], [g.x, g.y + .95, g.z], 30); DOF = 2; sh(V(KX, 0, 2), 10); }, [[0, 'impact', .4], [.1, 'heartbeat', .5]]);
// 56 «Also zog ich natürlich alles auf einmal.»: sonrisa pícara… y me la llevo a la boca
shot(66.20, 'C', null, L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); vaper(c, L, L.t0 + .35, 3, { gold: true, expr: 'smug', meter: true });
  if (L.lt < .35) cara(c, L.T, { expr: 'smug', eyes: 'half', mouth: 'smirk' }); onFace(c, 6.6, .2, .2, 38, L.k, 5.8); sh(V(KX, 0, 6), 12); }, [[0, 'whoosh', .3], [.1, 'hmm', .4], [.4, 'vape_in', .7]]);
// 57 «auf einmal.»: macro de mi cara con la vape dorada, el LED dorado a tope, empieza la calada
shot(67.30, 'C', 'punch', L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); vaper(c, L, L.t0 - .8, 3, { gold: true, expr: 'determined', eyes: 'closed' }); GOLD.userData.setGlow(1.2 + Math.sin(L.T * 25) * .3);
  onFace(c, 4.4, -.1, 1.2, 34, L.k, 3.9); DOF = 1.6; sh(V(KX, 0, 6), 10); }, [[0, 'impact', .5], [.05, 'vape_in', .9], [.3, 'heartbeat', .5]]);
// ---------- d: la calada eterna (68,4 – 96,2 s) ----------
// Timo con la vape dorada pegada a la boca; el vapor le sale a chorros por los lados; o.calm = sin chorro
function eternal(c, L, o = {}) { const av = armVape(1); actuar(c, 0, [[0, { ...av, headX: -.18 + Math.sin(L.T * 13) * .02, lean: -.05, ...(o.pose || {}) }]], { T: L.T }); c.aR.sh.rotation.y = av.aRy; GOLD.visible = true; GOLD.userData.grip.visible = true;
  GOLD.userData.setGlow(1.1 + Math.sin(L.T * 25) * .4); FACES.push(c); WM.get(c).visible = true; const s = zugS(L.T); WM.get(c).userData.set(secs(s), euro(money(s)), s > 9 ? '#ffd23f' : '#7aff9a');
  cara(c, L.T, { expr: o.expr || 'shock', eyes: o.eyes || 'wide', mouth: 'flat' }); CHEST.material.opacity = Math.min(.8, (o.chest ?? .5) * (.7 + Math.sin(L.T * 9) * .3));
  if (!o.calm) { const m = mouthW(c), f = faceDir(c), side = V(-f.z, 0, f.x); for (const sg of [-1, 1]) SMK.puff(m.clone().addScaledVector(side, sg * .5), side.clone().multiplyScalar(sg).addScaledVector(f, .3).add(V(0, .5, 0)), L.T, L.t0 - 2, L.t1 - L.t0 + 2, { n: o.n ?? 70, pow: o.pow ?? 5, size: o.size ?? 1.6, dens: .8, seed: 90 + sg, life: 2.5 }); }
  return s; }
const zugHUD = L => { const s = zugS(L.T); HUD = { s, e: money(s), col: s > 9 ? '#ffd23f' : '#7aff9a' }; return s; };
const fogCity = (L, dens = .7, y = 6, size = 34, fd = .012) => { scene.fog.color.setRGB(.9, .92, .96); scene.fog.density = fd; SMK.haze(V(-6, y, -10), L.T, 60, 70, 5, 70, size, dens * .6, 77); };

// 58 «Erst passierte nichts.»: la calada empieza… y nada; silencio, grillos
shot(68.40, 'C', null, L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); eternal(c, L, { calm: true, chest: 0, expr: 'confused', eyes: 'side_l' }); zugHUD(L);
  onFace(c, 6, .2, .9, 38, L.k, 5.6); sh(V(KX, 0, 6), 12); }, [[0, 'crickets', .5], [.6, 'tick', .3]]);
// 59 «Dann fing meine Brust an zu brennen,»: el pecho brilla dorado bajo la sudadera, ojos como platos
shot(69.50, 'F', 'slow', L => { use('KI'); inside(.8, 40); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); eternal(c, L, { calm: L.lt < .5, chest: .3 + L.k, n: 30 }); zugHUD(L);
  orbit(V(KX, 5.2, 6), lerp(9, 7, L.k), .3, .05, 40); sh(V(KX, 0, 6), 12); }, [[0, 'flash', .3], [.2, 'fire_crackle', .5], [.5, 'heartbeat', .6]]);
// 60 «und mein Dampfmesser sprang an.»: macro: el medidor se enciende y empieza a contar
shot(71.10, 'C', 'punch', L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); actuar(c, 0, [[0, { aLx: 1.7, aLz: -.25, aLe: 1.3, ...armVape(1) }]], { T: L.T }); c.aR.sh.rotation.y = armVape(1).aRy; GOLD.visible = true; GOLD.userData.grip.visible = true;
  const on = L.lt > .3; const M = WM.get(c); M.visible = true; M.userData.set(on ? secs(zugS(L.T)) : '- - -', on ? euro(money(zugS(L.T))) : 'START', on ? '#7aff9a' : '#ffd23f');
  c.root.updateMatrixWorld(true); const w = M.getWorldPosition(V(0, 0, 0)), q = M.getWorldQuaternion(new THREE.Quaternion()), n = V(0, 0, 1).applyQuaternion(q), p = w.clone().addScaledVector(n, lerp(3.6, 3, L.k)); cam([p.x, p.y, p.z], [w.x, w.y, w.z], 32); camera.up.copy(V(0, 1, 0).applyQuaternion(q)); camera.lookAt(w); DOF = 1.5; sh(V(KX, 0, 6), 10); }, [[0, 'impact', .4], [.3, 'power_on', .7], [.5, 'tick', .4]]);
// 61 «Eine Sekunde.»: plano medio en el quiosco, el vapor empieza a salir a chorros; HUD 1 s
shot(72.60, 'W', null, L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); eternal(c, L, { n: 40, size: 1.2 }); zugHUD(L);
  orbit(V(KX, 5.4, 6), 12, -.35, .1, 42); sh(V(KX, 0, 6), 14); }, [[0, 'whoosh', .3], [.05, 'steam', .5], [.2, 'tick', .4]]);
// 62 «Zehn Euro.»: le cae un billete de 10 a los pies
shot(73.50, 'C', null, L => { use('KI'); inside(.9, 50); KI.beam.visible = false; const c = put(ich, KX, 0, 6, 0); eternal(c, L, { n: 40, size: 1.2 }); zugHUD(L); billDrop(c, L.t0, L.T, 1, 10); POST.push(() => cashPop(c, '+10 €', clamp(L.lt / .2), 'green', 1));
  orbit(V(KX, 5.0, 6), 10.5, .4, .08, 42); sh(V(KX, 0, 6), 14); }, [[0, 'cash', .6], [.1, 'steam', .4]]);
// 63 «Fünf Sekunden.»: salgo dando tumbos a la calle de noche, echando vapor
shot(74.30, 'S', null, L => { use('HB'); darkNight(); show(KIOSKF, -30, 0, -66, 0, 1); const c = put(ich, -30, 0, -60 + L.lt * 1.5, 0); eternal(c, L, { n: 60, pow: 6, pose: walkP(L.T * .7, 0) }); zugHUD(L);
  cm([-26, 6, -42, -30, 5, -60, 44], [-26.5, 6, -45, -30, 5, -59, 44], L.k); sh(V(-30, 0, -60), 16); }, [[0, 'swipe', .3], [.1, 'door_creak', .4], [.3, 'steam', .6]]);
// 64 «Fünfhundert Euro.»: billetes de 50 y uno de 500 caen a mi alrededor
shot(75.20, 'C', 'punch', L => { use('HB'); darkNight(); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { n: 60, pow: 6 }); zugHUD(L); billDrop(c, L.t0, L.T, 1, 500); billDrop(c, L.t0 + .1, L.T, 10, 50, 2.6); POST.push(() => cashPop(c, '+500 €', clamp(L.lt / .2), 'gold', 1.1));
  orbit(V(-30, 5, -58.6), lerp(12, 10.5, L.k), .25, .1, 42); sh(V(-30, 0, -58), 16); }, [[0, 'cash_reg', .6], [.2, 'money_rain', .4]]);
// 65 «Zehn Sekunden.»: desde arriba: una columna de vapor sube desde mí hacia el cielo
shot(76.40, 'Z', null, L => { use('HB'); darkNight(); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { n: 50, pow: 9, size: 1.8 }); zugHUD(L); SMK.puff(V(-30, 13, -58.6), V(0, 1, 0), L.T, L.t0 - 2, 4, { n: 50, pow: 12, size: 4, dens: .6, seed: 95, life: 3 });
  cm([-30, 22, -36, -30, 6, -58, 46], [-30, 19, -40, -30, 7, -58, 46], L.k); sh(V(-30, 0, -58), 24); DOF = 0; }, [[0, 'zoom_out', .4], [.1, 'wind_rise', .5]]);
// 66 «Eine Million.»: lluvia de billetes enorme sobre mí
shot(77.20, 'C', 'punch', L => { use('HB'); darkNight(); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { n: 60, pow: 6 }); zugHUD(L); billRain(V(-30, 2, -58.6), L.T, 180, 20, 16, 18, 5); badge('gold', 'MILLIONÄR!', W / 2, H * .2, clamp(L.lt / .2), 1, 1.1);
  orbit(V(-30, 5, -58.6), lerp(13, 11, L.k), -.2, .1, 44); sh(V(-30, 0, -58), 18); }, [[0, 'money_rain', .8], [.1, 'cheer', .3], [.2, 'coins', .5]]);
// 67 «Aber es hörte nicht auf.»: intento quitarme la vape y no puedo: se queda pegada a los labios
shot(78.10, 'W', null, L => { use('HB'); darkNight(); const c = put(ich, -30, 0, -58.6, 0); const s = eternal(c, L, { n: 60, pow: 6, expr: 'worried', eyes: 'scared' }); zugHUD(L); const pull = Math.sin(L.T * 14) * .5 + .5;
  c.aL.sh.rotation.set(-1.4 - pull * .2, 0, .5); c.aL.el.rotation.set(-1.5, 0, 0); sweat(c, L.T, 2); onFace(c, 6.2, .1, .6, 38, L.k, 5.6); sh(V(-30, 0, -58), 14); }, [[0, 'whoosh', .3], [.1, 'strain', .6], [.5, 'tug', .5]]);
// 68 «Zwanzig Sekunden.» (zoom lento): el medidor se vuelve loco; mi cara con el resplandor dorado
shot(79.20, 'F', 'slow', L => { use('HB'); darkNight(); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { n: 80, pow: 7, chest: 1.2 }); zugHUD(L); badge('gold', `${Math.floor(zugS(L.T))} SEKUNDEN`, W / 2, H * .2, 1, 1, .9);
  onFace(c, 5.4, 0, .2, 38, L.k, 4.2); sh(V(-30, 0, -58), 12); }, [[0, 'flash', .3], [.2, 'glitch', .4], [.5, 'ticks', .5]]);
// 69 «Eine Milliarde.»: MILLIARDE; el dinero me llega por las rodillas
shot(80.60, 'C', 'punch', L => { use('HB'); darkNight(); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { n: 70, pow: 7 }); zugHUD(L); billRain(V(-30, 2, -58.6), L.T, 180, 18, 14, 18, 5); BILLP[100].slice(0, 30).forEach((b, i) => { const r = RNG(i * 7 + 1); b.visible = true; b.position.set(-30 + (r() - .5) * 9, .1 + r() * .3, -58.6 + (r() - .5) * 7); b.rotation.set(-PI / 2, r() * 6, 0); });
  badge('gold', 'MILLIARDÄR!', W / 2, H * .2, clamp(L.lt / .2), 1, 1.2); orbit(V(-30, 5, -58.6), lerp(12, 10.5, L.k), .3, .14, 44); sh(V(-30, 0, -58), 16); }, [[0, 'boom', .5], [.1, 'money_rain', .7], [.2, 'cash_reg', .6]]);
// 70 «Die ganze Stadt verschwand im Nebel.»: de día, vista aérea: Hufenbach entero bajo un mar de vapor; solo asoman los tejados y la cúpula
shot(81.40, 'Z', 'slow', L => { use('HB'); fogCity(L, .9, 9, 46, .0055 + L.k * .004); setSky([.75, .8, .9], [.85, .88, .94], [.9, .92, .96]);
  cm([60, 70, 110, -6, 8, -30, 46], [40, 55, 90, -6, 8, -30, 46], L.k); sh(V(-6, 0, -20), 60); DOF = 0; }, [[0, 'wind_howl', .6], [.3, 'whoosh_down', .4]]);
// 71 «Autos krachten ineinander,»: en la carretera con niebla, el taxi choca contra el deportivo; chispas y cristales
shot(83.60, 'C', 'punch', L => { use('HB'); fogCity(L, .35, 4, 20, .006); const k = clamp(L.lt / .35); show(CAR, 26, 0, 80 + (1 - easeIn(k)) * 22, PI, 1); show(TAXI, 26, 0, 68 - (1 - easeIn(k)) * 22, 0, 1); if (L.lt > .35) { sparks(V(26, 2.5, 74), L.t0 + .35, L.T, 40, 1.2); CAR.rotation.y = PI + .35; TAXI.rotation.y = -.3; SHAKE = Math.exp(-(L.lt - .35) * 8); SMK.puff(V(26, 2, 74), V(0, 1, .2), L.T, L.t0 + .35, .3, { n: 20, pow: 3, size: 2, dens: .6, seed: 71 }); }
  cm([40, 9, 96, 26, 2.5, 74, 44], [38, 8.5, 92, 26, 2.5, 74, 42], L.k); sh(V(26, 0, 74), 24); }, [[0, 'car_pass', .5], [.35, 'car_hit', .9], [.4, 'glass_break', .6]]);
// 72 «Ampeln explodierten,»: un semáforo parpadea como loco y estalla en chispas
shot(84.90, 'W', null, L => { use('HB'); fogCity(L, .45, 4); show(AMPEL, 18, 0, 4, -.3, 1); const bad = L.lt > .45; AMPEL.userData.set(bad ? -1 : Math.floor(L.T * 12) % 3); AMPEL.userData.hd.rotation.z = bad ? -.6 : 0; AMPEL.userData.hd.position.y = bad ? 10.4 : 11.2;
  if (bad) { sparks(V(18, 11, 4.6), L.t0 + .45, L.T, 40, 1); grade.uniforms.flash.value = Math.max(0, .8 - (L.lt - .45) * 3); SMK.puff(V(18, 11, 4.6), V(0, 1, .3), L.T, L.t0 + .45, .4, { n: 25, pow: 4, size: 1.6, dens: .7, seed: 81 }); }
  cm([22, 9, 22, 18, 9.5, 4, 42], [21, 9.5, 19, 18, 9.8, 4, 40], L.k); sh(V(18, 0, 4), 16); }, [[0, 'switch', .4], [.2, 'sparks', .5], [.45, 'explosion', .8]]);
// 73 «die Leute klammerten sich an Laternen.»: viento de vapor: la gente agarrada a las farolas, en horizontal como banderas
shot(86.10, 'S', null, L => { use('HB'); fogCity(L, .4, 4, 20); [[EX[3], -30, 40, 0, 8.2], [EX[7], -30, 40, 1, 4.4]].forEach(([e, x, z, i, y]) => { put(e, x + 7.1, y + Math.sin(L.T * 9 + i) * .25, z, 0); e.root.rotation.order = 'YXZ'; e.root.rotation.set(PI / 2 - .12 + Math.sin(L.T * 11 + i) * .08, -PI / 2, 0);
    actuar(e, 0, [[0, { aLx: 3.1, aRx: 3.1, aLz: .05, aRz: .05, aLe: .1, aRe: .1, headX: -.6, lLx: Math.sin(L.T * 14 + i) * .5, lRx: -Math.sin(L.T * 14 + i) * .5 }]], { T: L.T }); cara(e, L.T + i, { expr: 'shock', mouth: 'scream' }); FACES.push(e); });
  SMK.puff(V(-50, 6, 40), V(1, .03, 0), L.T, L.t0 - 2, 4, { n: 60, pow: 18, size: 2.6, dens: .5, seed: 83, life: 2.5 });
  cm([-33, 7, 68, -26, 6.5, 40, 44], [-32.5, 6.8, 64, -26, 6.5, 40, 42], L.k); sh(V(-26, 0, 40), 18); }, [[0, 'wind_howl', .7], [.2, 'scream_girl', .4], [.6, 'shout_crowd', .4]]);
// 74 «Und mein Konto?»: miro el medidor de reojo sin soltar la vape
shot(87.90, 'C', null, L => { use('HB'); fogCity(L, .5, 4); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { n: 50, pow: 6, eyes: 'down', expr: 'confused' }); zugHUD(L); c.aL.sh.rotation.set(-1.7, 0, .25); c.aL.el.rotation.set(-1.3, 0, 0);
  onFace(c, 6.4, .3, -.6, 38, L.k, 5.8); sh(V(-30, 0, -58), 14); }, [[0, 'whoosh_soft', .3], [.2, 'hmm', .4]]);
// 75 «Es stieg einfach weiter.»: macro del medidor: las cifras suben sin parar
shot(88.70, 'C', 'punch', L => { use('HB'); fogCity(L, .5, 4); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { calm: true }); c.aL.sh.rotation.set(-1.7, 0, .25); c.aL.el.rotation.set(-1.3, 0, 0); zugHUD(L);
  c.root.updateMatrixWorld(true); const M = WM.get(c), w = M.getWorldPosition(V(0, 0, 0)), q = M.getWorldQuaternion(new THREE.Quaternion()), n = V(0, 0, 1).applyQuaternion(q), p = w.clone().addScaledVector(n, lerp(3.8, 3, L.k)); cam([p.x, p.y, p.z], [w.x, w.y, w.z], 32); camera.up.copy(V(0, 1, 0).applyQuaternion(q)); camera.lookAt(w); DOF = 1.5; sh(V(-30, 0, -58), 10); }, [[0, 'impact', .3], [.1, 'count', .6], [.6, 'coins', .4]]);
// 76 «Der Bürgermeister rief mich persönlich an.»: el alcalde, en su despacho, con el teléfono
shot(90.20, 'W', null, L => { use('BU'); inside(1.05, 60); const c = put(mayor, BX, 1.05, -8.6, 0); actuar(c, 0, [[0, { ...SIT, aRx: 1.2, aRz: .5, aRe: 2.3 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.5, .5], [0, 0, 0], .6); talk(c, L.T, L.t0, L.t0 + 2, 'worried'); FACES.push(c);
  orbit(V(BX, 8.0, -8.6), lerp(13, 11, L.k), -.25, .16, 42); sh(V(BX, 0, -6), 20); }, [[0, 'whoosh', .3], [.1, 'phone_ring', .6], [.9, 'click_set', .4]]);
// 77 «persönlich an.»: yo cojo el móvil sin soltar la vape
shot(91.20, 'C', null, L => { use('HB'); fogCity(L, .5, 4); const c = put(ich, -30, 0, -58.6, 0); eternal(c, L, { calm: false, n: 40, expr: 'confused', eyes: 'side_r' }); zugHUD(L); c.aL.sh.rotation.set(-2.0, 0, .8); c.aL.el.rotation.set(-2.2, 0, 0); attach(PHONE, c.aL.hand, [0, -.5, .5], [0, 0, 0], .6);
  onFace(c, 6, .2, -.5, 38, L.k, 5.4); sh(V(-30, 0, -58), 14); }, [[0, 'phone_ring', .5], [.3, 'click_set', .4]]);
// 78 «Er weinte.»: primer plano del alcalde llorando a mares
shot(92.30, 'C', 'punch', L => { use('BU'); inside(1.05, 60); const c = put(mayor, BX, 1.05, -8.6, 0); actuar(c, 0, [[0, { ...SIT, aRx: 1.2, aRz: .5, aRe: 2.3, headX: .1 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.5, .5], [0, 0, 0], .6); cara(c, L.T, { expr: 'sad', eyes: 'cry', mouth: Math.sin(L.T * 10) > 0 ? 'scream' : 'wavy' }); tears(c, L.T); FACES.push(c);
  onFace(c, 5.2, .2, .4, 38, L.k, 4.6); sh(V(BX, 0, -8), 12); }, [[0, 'impact', .3], [.1, 'cry_girl', .3], [.4, 'sniff', .5]]);
// 79 «Er sagte, ich hätte mehr Geld»: llorando al teléfono, golpea la mesa
shot(93.60, 'S', null, L => { use('BU'); inside(1.05, 60); const c = put(mayor, BX, 1.05, -8.6, 0); const hit = (L.lt % .6) < .15; actuar(c, 0, [[0, { ...SIT, aRx: 1.2, aRz: .5, aRe: 2.3, aLx: hit ? 1.0 : 1.6, aLe: .3, lean: .1 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.5, .5], [0, 0, 0], .6); talk(c, L.T, L.t0, L.t0 + 1.3, 'sad', { eyes: 'cry' }); tears(c, L.T); FACES.push(c);
  orbit(V(BX, 7.6, -8.6), lerp(12, 10.5, L.k), .35, .14, 42); sh(V(BX, 0, -8), 18); }, [[0, 'swipe', .3], [.1, 'table_bang', .5], [.7, 'table_bang', .4]]);
// 80 «als das ganze Land.»: en la pantalla: TIMO contra DEUTSCHLAND, mi barra se sale
shot(94.90, 'C', 'punch', L => { use('HB'); fogCity(L, .3, 3); show(BOARD, 10, -5, -50, 0, 1); BOARD.userData.draw((c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#101a3a'); g.addColorStop(1, '#2a0a3a'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `700 56px ${FONT}`; c.fillStyle = '#ffd23f'; c.fillText('VERMÖGEN', w / 2, 52); const k = clamp(L.lt / .9); [['DEUTSCHLAND', .42, '#3ab8ff'], ['TIMO', .42 + .55 * easeOut(k), '#ffd23f']].forEach(([n, v, col], i) => { const y = 200 + i * 190; c.fillStyle = col; c.beginPath(); c.roundRect(60, y - 50, (w - 120) * Math.min(1, v), 100, 20); c.fill(); c.font = `700 52px ${FONT}`; c.fillStyle = '#ffffff'; c.textAlign = 'left'; c.fillText(n, 80, y - 80 + 10); c.textAlign = 'center'; }); });
  cm([10, 8.4, -8, 10, 9.6, -50, 46], [10, 8.6, -11, 10, 9.8, -50, 46], L.k); sh(V(10, 0, -44), 28); DOF = 0; }, [[0, 'impact', .4], [.2, 'riser_short', .4], [.9, 'ding_reveal', .5]]);
// ---------- e: el final (96,2 – 122,9 s) ----------
// montaña de dinero (fajos) bajo los pies de Timo
const moneyPile = (c, n = 120, R = 9, H0 = 5) => { BILLP[100].concat(BILLP[500]).slice(0, n).forEach((b, i) => { const r = RNG(i * 31 + 7), a = r() * 6.283, d = Math.sqrt(r()) * R, h = H0 * (1 - d / R); b.visible = true; b.position.set(c.x + Math.cos(a) * d, Math.max(.05, h * (.6 + r() * .4)), c.z + Math.sin(a) * d); b.rotation.set(-PI / 2 + (r() - .5) * .8, r() * 6, (r() - .5) * .6); b.scale.setScalar(1.2); }); };
const RANK2 = [['Timo', '800 Bio. €'], ['Bürgermeister Brandt', '84 Mio. €'], ['Sabine Krüger', '61 Mio. €'], ['Lukas Hoffmann', '47 Mio. €'], ['Anna Wagner', '39 Mio. €'], ['Marie Schulz', '21 Mio. €']];
const crashChart = (c, w, h, k) => { c.fillStyle = '#0a1020'; c.fillRect(0, 0, w, h); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 54px ${FONT}`; c.fillStyle = '#ff4a4a'; c.fillText('WIRTSCHAFT', w / 2, 50);
  c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 2; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(40, 120 + i * 80); c.lineTo(w - 40, 120 + i * 80); c.stroke(); }
  c.strokeStyle = '#ff3a3a'; c.lineWidth = 12; c.lineJoin = 'round'; c.beginPath(); const n = 40; for (let i = 0; i <= n * k; i++) { const x = 50 + i / n * (w - 100), y = i < n * .45 ? 180 + Math.sin(i * 1.3) * 25 : 180 + (i - n * .45) / (n * .55) * 380 + Math.sin(i * 2) * 15; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
  if (k > .6) { c.font = `700 70px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText('-99,9 %', w * .72, 300); } };
const newCur = (c, w, h, k) => { c.fillStyle = '#1a2a4a'; c.fillRect(0, 0, w, h); c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = `700 52px ${FONT}`; c.fillStyle = '#ffffff'; c.fillText('NEUE WÄHRUNG:', w / 2, 90);
  if (k > 0) { c.save(); c.translate(w / 2, 300); const s = spring(clamp(k) * 1.6); c.scale(s, s); c.font = `700 190px ${FONT}`; c.lineWidth = 22; c.strokeStyle = '#3a0010'; c.strokeText('HUSTEN', 0, 0); c.fillStyle = '#ffd23f'; c.fillText('HUSTEN', 0, 0); c.restore(); c.font = `700 46px ${FONT}`; c.fillStyle = '#7aff9a'; c.fillText('1× Husten = 1.000 Huster', w / 2, 500); }
  else { c.font = `700 160px ${FONT}`; c.fillStyle = '#ffd23f'; c.fillText('???', w / 2, 300); } };

// 81 «Dann, plötzlich, Stille.» (zoom lento): la niebla se abre; la vape dorada se apaga; yo, quieto, entre billetes
shot(96.20, 'F', 'slow', L => { use('HB'); scene.fog.color.setRGB(.9, .92, .96); scene.fog.density = lerp(.008, .002, L.k); const c = put(ich, -30, 0, -58.6, 0); const av = armVape(.3); actuar(c, 0, [[0, { ...av }]], { T: L.T }); c.aR.sh.rotation.y = av.aRy; GOLD.visible = true; GOLD.userData.grip.visible = true; GOLD.userData.setGlow(0); FACES.push(c);
  cara(c, L.T, { expr: 'confused', eyes: 'wide', mouth: 'flat' }); moneyPile(V(-30, 0, -58.6), 80, 9, 1.2); WM.get(c).visible = true; WM.get(c).userData.set('52,0 s', '800 Bio. €', '#ffd23f');
  orbit(V(-30, 5, -58.6), lerp(16, 11, L.k), .15, .1, 44); sh(V(-30, 0, -58), 20); }, [[0, 'freeze', .4], [.1, 'silence_tick', .3]]);
// 82 «Ich schaute auf meinen Dampfmesser.»: levanto la muñeca y miro
shot(97.80, 'C', null, L => { use('HB'); const c = put(ich, -30, 0, -58.6, 0); actuar(c, 0, [[0, { aLx: 1.7, aLz: -.25, aLe: 1.3, headX: .35, headY: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'down', mouth: 'o' }); FACES.push(c); WM.get(c).visible = true; WM.get(c).userData.set('52,0 s', '800 Bio. €', '#ffd23f');
  moneyPile(V(-30, 0, -58.6), 80, 9, 1.2); onFace(c, 6.4, .6, -.6, 38, L.k, 5.8); sh(V(-30, 0, -58), 14); }, [[0, 'whoosh_soft', .3], [.2, 'watch_click', .5]]);
// 83 «Zweiundfünfzig Sekunden.»: macro: 52,0 s
shot(99.00, 'C', 'punch', L => { use('HB'); const c = put(ich, -30, 0, -58.6, 0); actuar(c, 0, [[0, { aLx: 1.7, aLz: -.25, aLe: 1.3 }]], { T: L.T }); const M = WM.get(c); M.visible = true; M.userData.set('52,0 s', '800 Bio. €', '#ffd23f'); HUD = { s: 52, e: 8e14, col: '#ffd23f' };
  c.root.updateMatrixWorld(true); const w = M.getWorldPosition(V(0, 0, 0)), q = M.getWorldQuaternion(new THREE.Quaternion()), n = V(0, 0, 1).applyQuaternion(q), p = w.clone().addScaledVector(n, lerp(3.6, 3, L.k)); cam([p.x, p.y, p.z], [w.x, w.y, w.z], 32); camera.up.copy(V(0, 1, 0).applyQuaternion(q)); camera.lookAt(w); DOF = 1.5; sh(V(-30, 0, -58), 10); }, [[0, 'impact', .5], [.1, 'ding_reveal', .6]]);
// 84 «Achthundert Billionen Euro.» (zoom lento): de pie sobre una montaña de dinero, la cámara sube
shot(100.50, 'F', 'slow', L => { use('HB'); const c = put(ich, -30, 4.6, -58.6, 0); actuar(c, 0, [[0, { aLx: 2.7, aRx: 2.7, aLz: .4, aRz: .4, aLe: .3, aRe: .3 }]], { T: L.T }); grin(c, L.T); FACES.push(c); moneyPile(V(-30, 0, -58.6), 180, 11, 5); billRain(V(-30, 6, -58.6), L.T, 0);
  HUD = { s: 52, e: 8e14, col: '#ffd23f' }; orb(L.k, V(-30, 8, -58.6), null, [22, .3, .05, 46], [18, .2, .2, 46]); sh(V(-30, 0, -58), 22); }, [[0, 'flash', .4], [.1, 'choir', .5], [.3, 'coins', .5]]);
// 85 «Ich war offiziell der reichste Mensch der Welt.»: el ranking mundial con TIMO arriba; yo delante con corona de billetes
shot(102.40, 'C', 'punch', L => { use('HB'); show(BOARD, 10, -5, -50, 0, 1); BOARD.userData.draw((c, w, h) => drawRank(c, w, h, 'REICHSTE MENSCHEN DER WELT', RANK2, 0, L.lt / .8)); const c = put(ich, 10, 0, -21, 0); actuar(c, 0, [[0, { aLx: 2.6, aRx: .3, aLz: .3, aLe: .4 }]], { T: L.T }); grin(c, L.T); FACES.push(c);
  vapeCrowd(L, 10, -32, 10, 5, 12, 85, { face: c.root.position, gap: 1.5 }); confRain(V(10, 2, -27), L.T, 60, 18, 10, 14); cm([10, 8.4, -8, 10, 8.6, -46, 46], [10, 8.6, -12, 10, 8.8, -46, 46], L.k); sh(V(10, 0, -40), 28); DOF = 0; }, [[0, 'impact', .4], [.1, 'cheer', .7], [.3, 'party_horn', .5]]);
// 86 «Bis mein Handy klingelte.»: el móvil vibra en mi mano; miro la pantalla: BANK
shot(104.80, 'W', null, L => { use('HB'); const c = put(ich, 10, 0, -27, 0); actuar(c, 0, [[0, { aLx: 1.5, aLz: -.4, aLe: 1.6, headX: .25 }]], { T: L.T }); attach(PHONE, c.aL.hand, [Math.sin(L.T * 60) * .04, -.5, .5], [0, 0, 0], .7); cara(c, L.T, { expr: 'confused', eyes: 'down' }); FACES.push(c); badge3('tag', '📞 BANK', hp(c).add(V(0, 3, 0)), clamp(L.lt / .3), .9);
  onFace(c, 6.6, .4, .4, 38, L.k, 6); sh(V(10, 0, -27), 14); }, [[0, 'phone_ring', .8], [.4, 'vibrate', .5]]);
// 87 «Es war die Bank.»: el banquero al teléfono, serio, en su oficina (despacho)
shot(106.00, 'C', 'punch', L => { use('BU'); inside(1.05, 60); const c = put(bank, BX + 6, 0, 2, -.3); actuar(c, 0, [[0, { aRx: 1.2, aRz: .5, aRe: 2.3 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.5, .5], [0, 0, 0], .6); talk(c, L.T, L.t0, L.t0 + 1, 'worried'); FACES.push(c);
  onFace(c, 6.6, .3, 0, 38, L.k, 6); sh(V(BX + 6, 0, 2), 14); }, [[0, 'impact', .3], [.1, 'click_set', .4]]);
// 88 «Mein Geld hatte die ganze Wirtschaft zerstört.»: en la pantalla gigante, la gráfica se desploma; la gente se lleva las manos a la cabeza
shot(106.80, 'S', null, L => { use('HB'); show(BOARD, 10, -5, -50, 0, 1); BOARD.userData.draw((c, w, h) => crashChart(c, w, h, clamp(L.lt / 1.5)));
  [[EX[2], 5.6], [XT[2], 10], [EX[9], 14.4]].forEach(([e, x], i) => { put(e, x, 0, -28, 0); actuar(e, 0, [[0, GEST.hands_head]], { T: L.T + i }); cara(e, L.T + i, { expr: 'shock', mouth: 'scream' }); FACES.push(e); });
  cm([10, 8.4, -8, 10, 8.6, -46, 46], [10, 8.6, -11, 10, 8.8, -46, 46], L.k); sh(V(10, 0, -40), 28); DOF = 0; }, [[0, 'swipe', .3], [.2, 'glitch', .5], [.8, 'shout_crowd', .5]]);
// 89 «Jeder Euro war jetzt wertlos.»: un tipo usa billetes de 500 como pañuelo y los tira a la papelera
shot(108.80, 'C', null, L => { use('HB'); const c = put(EX[5], -6, 0, 6, .3); const k = (L.lt % 1); actuar(c, 0, [[0, { aRx: lerp(1.6, .6, easeOut(k)), aRe: lerp(1.8, .3, easeOut(k)), aRz: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' }); FACES.push(c);
  billDrop(c, L.t0 - .2, L.T, 6, 500, 2); badge('red', '1 € = 0,00 €', W / 2, H * .2, clamp(L.lt / .3), 1, 1); onFace(c, 7.6, .2, 0, 40, L.k, 7); sh(V(-6, 0, 6), 14); }, [[0, 'paper', .5], [.3, 'sniff', .5], [.7, 'trash_hit', .4]]);
// 90 «Jeder Euro war jetzt wertlos.» (2): un barrendero barre montañas de billetes
shot(109.90, 'W', null, L => { use('HB'); const c = put(XT[3], 2, 0, 0, -.6); actuar(c, 0, [[0, { aLx: .9 + Math.sin(L.T * 8) * .3, aRx: .9 + Math.sin(L.T * 8) * .3, aLz: -.3, aRz: .3, aLe: .6, aRe: .6, lean: .2, twist: Math.sin(L.T * 8) * .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' }); FACES.push(c);
  moneyPile(V(-1, 0, 1), 120, 7, 1.2); orbit(V(1, 4.2, 0), lerp(14, 12, L.k), .5, .14, 44); sh(V(0, 0, 0), 18); }, [[0, 'whoosh', .3], [.1, 'brush', .6]]);
// 91 «Also erfand die Regierung eine neue Währung.»: el funcionario en el atril; la pantalla: NEUE WÄHRUNG ???
shot(110.90, 'Z', null, L => { use('HB'); show(BOARD, 10, -5, -50, 0, 1); BOARD.userData.draw((c, w, h) => newCur(c, w, h, 0)); const c = put(beam, 10, 0, -26, -.2); talk(c, L.T, L.t0, L.t1, 'smug'); actuar(c, 0, [[0, { aRx: 1.3, aRz: .2, aRe: .3 }]], { T: L.T }); FACES.push(c);
  cm([10, 8.4, -8, 10, 8.6, -46, 46], [10, 8.4, -12, 10, 8.6, -46, 46], L.k); sh(V(10, 0, -40), 28); DOF = 0; }, [[0, 'zoom_in', .3], [.2, 'murmur', .4], [1, 'pages', .4]]);
// 92 «Und rate mal, was sie gewählt haben?» (zoom lento): redoble: la gente espera en silencio
shot(113.10, 'F', 'slow', L => { use('HB'); show(BOARD, 10, -5, -50, 0, 1); BOARD.userData.draw((c, w, h) => newCur(c, w, h, 0)); [[EX[2], 5.6], [XT[2], 10], [EX[9], 14.4]].forEach(([e, x], i) => { put(e, x, 0, -28, PI); actuar(e, 0, [[0, { headX: -.25 }]], { T: L.T + i }); FACES.push(e); });
  const c = put(ich, 10, 0, -20, PI); actuar(c, 0, [[0, { headX: -.2 }]], { T: L.T }); cm([10, 7, -2, 10, 9, -46, 46], [10, 7.4, -7, 10, 9.5, -46, 44], L.k); sh(V(10, 0, -30), 28); DOF = 0; }, [[0, 'flash', .3], [.1, 'drone', .5]]);
// 93 «Husten.»: ¡HUSTEN! en la pantalla
shot(114.80, 'C', 'punch', L => { use('HB'); show(BOARD, 10, -5, -50, 0, 1); BOARD.userData.draw((c, w, h) => newCur(c, w, h, L.lt / .3)); confetti(V(10, 6, -40), L.t0, L.T, 50);
  cm([10, 8.4, -14, 10, 9.6, -50, 42], [10, 8.6, -16, 10, 9.8, -50, 42], L.k); sh(V(10, 0, -40), 28); DOF = 0; }, [[0, 'boom', .6], [.05, 'cough', .7], [.2, 'cheer', .4]]);
// 94 «Und ich?»: me giro a cámara, tosiendo
shot(115.40, 'C', 'punch', L => { use('HB'); const c = put(ich, 2, 0, 2, lerp(-1.2, 0, easeOut(clamp(L.lt / .3)))); actuar(c, 0, [[0, { lean: .15, aLx: 1.0, aLz: -.6, aLe: 2.0 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'half', mouth: 'grimace' }); FACES.push(c);
  vapeCrowd(L, 2, -6, 8, 7, 14, 87, { gap: 1.6 }); onFace(c, 6.6, .2, 0, 40, L.k, 6); sh(V(2, 0, 2), 14); }, [[0, 'thump', .5], [.2, 'cough', .6]]);
// 95 «Seit dieser goldenen Vape»: toso sin parar… y cada tos me paga: +1.000
shot(116.40, 'W', null, L => { use('HB'); const c = put(ich, 2, 0, 2, 0); const k = Math.abs(Math.sin(L.T * 9)); actuar(c, 0, [[0, { lean: .12 + k * .1, headX: .1 + k * .12, aLx: .55, aLz: -.4, aLe: 1.6 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'closed', mouth: k > .5 ? 'scream' : 'grimace' }); FACES.push(c);
  for (let i = 0; i < 4; i++) { POST.push(() => cashPop(c, '+1.000', clamp((L.lt - i * .4) / .15) * (L.lt - i * .4 < .35 ? 1 : 0), 'gold', .8)); SMK.puff(mouthW(c), smokeDir(c, .1), L.T, L.t0 + i * .4, .08, { n: 5, pow: 3, size: .5, dens: .4, seed: 60 + i, life: 1 }); }
  WM.get(c).visible = true; WM.get(c).userData.set('HUSTEN', `${1 + Math.floor(L.lt / .4)}× · ${(1 + Math.floor(L.lt / .4)) * 1000}`, '#ffd23f'); billDrop(c, L.t0, L.T, 6, 100, 2.4);
  orbit(V(2, 4.6, 2), lerp(12, 10, L.k), .3, .08, 42); sh(V(2, 0, 2), 16); }, [[0, 'cough', .7], [.4, 'cough', .6], [.8, 'cough', .7], [.9, 'cash', .4]]);
// 96 «höre ich nicht mehr auf zu husten.»: primer plano: toso y me río a la vez; me llueve dinero otra vez
shot(118.20, 'C', 'punch', L => { use('HB'); const c = put(ich, 2, 0, 2, 0); const k = Math.abs(Math.sin(L.T * 9)); actuar(c, 0, [[0, { lean: .2 + k * .12, headX: .15 + k * .15, aLx: 1.0, aLz: -.6, aLe: 2.0, aRx: .6, aRe: .8 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: k > .5 ? 'closed' : 'happy', mouth: k > .5 ? 'scream' : 'open_smile' }); FACES.push(c);
  billRain(V(2, 2, 2), L.T, 120, 16, 12, 16, 4); badge('gold', `+${(3 + Math.floor(L.lt * 3)) * 1000} €`, W / 2, H * .18, 1, 1, 1); onFace(c, 6.2, .2, -.3, 38, L.k, 5.6); sh(V(2, 0, 2), 14); }, [[0, 'cough', .7], [.3, 'money_rain', .5], [.6, 'cough', .6], [1.2, 'laugh_m', .4]]);
// 97 «Warte.»: me quedo congelado; silencio
shot(120.20, 'C', null, L => { use('HB'); const c = put(ich, 2, 0, 2, 0); actuar(c, 0, [[0, { aLx: .3, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'flat' }); FACES.push(c);
  onFace(c, 5.4, .1, 0, 38, L.k, 5); sh(V(2, 0, 2), 12); }, [[0, 'freeze', .5]]);
// 98 «Warum piept mein Dampfmesser schon wieder?» (zoom lento): el medidor parpadea en rojo «!!!»; mi cara de pánico detrás
shot(121.10, 'I', 'slow', L => { use('HB'); const c = put(ich, 2, 0, 2, 0); actuar(c, 0, [[0, { aLx: 1.7, aLz: -.25, aLe: 1.3, headX: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'scared', mouth: 'o' }); FACES.push(c);
  const M = WM.get(c); M.visible = true; const on = Math.sin(L.T * 16) > 0; M.userData.set(on ? '!!!' : '', on ? 'ZUG ERKANNT' : '', '#ff3a3a'); TINT = on ? 'rgba(255,0,0,.08)' : null;
  c.root.updateMatrixWorld(true); const w = M.getWorldPosition(V(0, 0, 0)), q = M.getWorldQuaternion(new THREE.Quaternion()), n = V(0, 0, 1).applyQuaternion(q), p = w.clone().addScaledVector(n, lerp(5.5, 3.6, L.k)); cam([p.x, p.y, p.z], [w.x, w.y, w.z], 34); camera.up.copy(V(0, 1, 0).applyQuaternion(q)); camera.lookAt(w); DOF = 1.3; sh(V(2, 0, 2), 10); }, [[0, 'iris_pop', .3], [.1, 'alarm', .7], [.6, 'heartbeat', .6]]);


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); } });
CUES.push({ t: 0, s: 'zoom_fast', g: .9 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD_.length = 0; FACES.length = 0; s.fn(L); while (POST.length) POST.shift()(); clearFaces();
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud', 'cash'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = BLUR;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, MODE === 'night' ? 'noche' : 'polvo', MODE === 'in' ? .3 : .4);
  if (BIRDS.update) BIRDS.update(T, camera.position.clone().addScaledVector(dir, 60).add(V(0, 25, 0)), (MODE === 'day') && BIRDSON ? 1 : 0);
  { const fd = camera.position.distanceTo(CAMT); bokeh.uniforms.focus.value = fd; bokeh.uniforms.aperture.value = DOF * .0022 * clamp((26 - fd) / 14); bokeh.enabled = bokeh.uniforms.aperture.value > .00005 && new URLSearchParams(location.search).get("dof") !== "0"; }
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
  for (const b of BAD_) drawBadge(b); if (HUD) drawMeterHUD(octx, W / 2, H * .085, 1.05, secs(HUD.s), euro(HUD.e ?? money(HUD.s)), HUD.col); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { applyPose, mouthW, XT, hp, ich, renderer, composer, bloom, sun, grade, scene, camera, SMK };

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
//@@PLANOS@@

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

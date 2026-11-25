// LISPELN — «In dieser Stadt ist der Buchstabe S verboten»: wer es sagt, kommt ins Gefängnis; alle sagen TH.
// Jonte descubre que el alcalde Zischler cecea y por eso prohibió la S; lo graba y lo pone en todas las pantallas… y el alcalde prohíbe R y L.
// Ciudad propia: Zischelbach (pueblo alpino). Planos en src/p/*.js; armar.py los une en src/index.js.
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { makeExtra } from './ecast.js';
import { makeKidX } from './acast.js';
import { lindenthal, schule, glowM } from './nsets.js';
import { klasse } from './svsets.js';
import { wohnzimmer } from './zsets.js';
import { polizei } from './gsets.js';
import { sportsCar } from './pech.js';
import { makeCop } from './gcast.js';
import { banSign, drawBan, gantry, bigScreen, robot, robotPose, rathausPlatz, saal, spieleladen } from './lsets.js';
import { makeJonte, makeBela, makeKessler, makeZocker, makeZischler, makePorscheMann } from './lcast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 95.9, U = W / 720;

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
// Zischelbach-Dorf (x = 0, lindenthal): plaza z ∈ [-70, 50], casas a x = ±52 (fachadas en x = ±43), carretera hacia +z (x ∈ ±8), iglesia z = -120,
// Maibaum (18,-14), fuente (-14,-26). Pórtico con la señal «S verboten» sobre la carretera en z = 70. Pantallas gigantes en la plaza.
const LT = lindenthal(scene, { name: 'ZISCHELBACH', shops: { 2: 'THUPERMARKT', 5: 'GATHTHOF', 9: 'CAFÉ', 12: 'BÄCKEREI' } });
const GAN = gantry(scene, 0, 36, 'S'); LT.g.add(GAN);
const DSCR = [[-30, -20, .5], [30, -20, -.5]].map(([x, z, r]) => { const b = bigScreen(scene, 18, 10.125, 640, 360); b.position.set(x, 0, z); b.rotation.y = r; LT.g.add(b); b.visible = false; return b; });
const SCX = 1400, KLX = 2200, ZOX = 3000, WZX = 3800, RPX = 4600, SAX = 5600;
const SC = schule(scene, SCX), KL = klasse(scene, KLX), ZO = spieleladen(scene, ZOX), RP = rathausPlatz(scene, RPX), SA = saal(scene, SAX);
// cartel pintado del colegio (THCHULE) delante del rótulo original
const SCHILD = new THREE.Group(); SC.g.add(SCHILD); SCHILD.position.set(0, 26.4, -25.6);
{ const cv = document.createElement('canvas'); cv.width = 900; cv.height = 108; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const m = new THREE.Mesh(new THREE.PlaneGeometry(30, 3.6), new THREE.MeshStandardMaterial({ map: t, roughness: .7 })); SCHILD.add(m); let key = null;
  SCHILD.userData.draw = k => { const kk = Math.round(k * 20); if (kk === key) return; key = kk; const c = cv.getContext('2d'); c.fillStyle = '#ffffff'; c.fillRect(0, 0, 900, 108); c.font = `700 76px ${FONT}`; c.textBaseline = 'middle'; c.textAlign = 'left';
    if (k < .5) { const tw = c.measureText('SCHULE AM BERG').width, x0 = 450 - tw / 2, sw = c.measureText('S').width; c.fillStyle = '#2a4a7a'; c.fillText('SCHULE AM BERG', x0, 60); c.fillStyle = '#ffffff'; c.fillRect(x0 - 4, 8, (sw + 8) * clamp(k / .45), 92); }
    else { const tw = c.measureText('THCHULE AM BERG').width, x0 = 450 - tw / 2, th = c.measureText('TH').width; c.fillStyle = '#2a4a7a'; c.fillText('CHULE AM BERG', x0 + th, 60); c.save(); c.beginPath(); c.rect(x0 - 4, 0, (th + 8) * clamp((k - .5) / .4), 108); c.clip(); c.fillStyle = '#d8202a'; c.fillText('TH', x0, 60); c.restore(); } t.needsUpdate = true; }; SCHILD.userData.draw(0); }
// tele del salón: noticias con un atril vacío o el robot
const TVC = document.createElement('canvas'); TVC.width = 640; TVC.height = 360; const TVT = new THREE.CanvasTexture(TVC); TVT.colorSpace = THREE.SRGBColorSpace;
const WZ = wohnzimmer(scene, WZX, TVT);
const SETS = { LT: LT.g, SC: SC.g, KL: KL.g, ZO: ZO.g, WZ: WZ.g, RP: RP.g, SA: SA.g };
for (const k in SETS) outline(SETS[k], OS);
// puerta del aula (pared izquierda, x = -19.8, z = 8): hoja que se abre hacia dentro
const DOOR = new THREE.Group(); KL.g.add(DOOR); DOOR.position.set(-19.6, 0, 4.6); { box(.3, 11, 6.6, mat(0x8a5a2a, { roughness: .6 }), .1, DOOR, 0, 5.5, 3.3); sphere(.3, mat(0xd8b040, { metalness: .9 }), DOOR, .4, 5.4, 5.8, 8, 6); box(.6, 11.6, 7.4, mat(0xf4f0e8), .1, KL.g, -19.85, 5.8, 8); const w = box(.32, 3, 2.4, new THREE.MeshStandardMaterial({ color: 0xbfe0ff, roughness: .05, transparent: true, opacity: .6 }), .05, DOOR, 0, 8, 3.3); }
// ---------- reparto ----------
const jonte = makeJonte(scene), bela = makeBela(scene), kess = makeKessler(scene), zock = makeZocker(scene), zisch = makeZischler(scene), pmann = makePorscheMann(scene);
const COPS = [0, 1, 2, 3].map(i => makeCop(scene, i));
kitFace(jonte, 'kid'); kitFace(bela, 'kid'); kitFace(kess, 'girl'); kitFace(zock, 'plain'); kitFace(zisch, 'mustache'); kitFace(pmann, 'plain'); COPS.forEach((c, i) => kitFace(c, i % 2 ? 'mustache' : 'plain'));
const KIDS = Array.from({ length: 10 }, (_, i) => makeKidX(scene, i + 3)); KIDS.forEach((c, i) => kitFace(c, i % 3 === 1 ? 'girl' : 'kid'));
const EX = Array.from({ length: 30 }, (_, i) => makeExtra(scene, i + 60)); EX.forEach((c, i) => kitFace(c, ['girl', 'plain', 'girl', 'hero', 'girl', 'mustache'][i % 6]));
const CR = EX;
const MAIN = [jonte, bela, kess, zock, zisch, pmann, ...COPS];
const POOL = [...MAIN, ...KIDS, ...EX];
POOL.forEach(c => outline(c.root, OC));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(.5, 'rgba(0,0,0,.26)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -Math.PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const PROPS = [];
const P_ = o => { if (!o.parent) scene.add(o); PROPS.push(o); return o; };
const POL = P_(polizei(scene)), POL2 = P_(polizei(scene));
const PORSCHE = P_(sportsCar(scene)); PORSCHE.traverse(o => { if (o.isMesh && o.material.color && o.material.color.getHex() === 0xffc400) { o.material = o.material.clone(); o.material.color.setHex(0xc8ccd4); o.material.metalness = .8; o.material.roughness = .22; } });
{ const pl = textPlane(2.6, .6, 260, 60, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#1a1a1a'; c.lineWidth = 4; c.strokeRect(2, 2, w - 4, h - 4); c.fillStyle = '#1a3a9a'; c.fillRect(2, 2, 26, h - 4); txt(c, 'Z-PS 911', w / 2 + 12, h / 2 + 2, 40, '#1a1a1a'); }); pl.position.set(0, 1.2, 5.55); PORSCHE.add(pl); }
// humo y llamas
const SMOKE = Array.from({ length: 26 }, () => P_(sphere(1, mat(0x5a5a62, { roughness: 1, transparent: true, opacity: .75, depthWrite: false }), scene, 0, 0, 0, 10, 8)));
const FLAME = Array.from({ length: 10 }, (_, i) => P_(sphere(.7, glowM(i % 2 ? 0xff6a1a : 0xffc83a, 2.4), scene, 0, 0, 0, 8, 6)));
// teléfono con pantalla dibujable
const PHONE = P_(new THREE.Group()); scene.add(PHONE); { box(1.1, 2.1, .16, mat(0x1a1a22, { metalness: .6, roughness: .3 }), .12, PHONE, 0, 0, 0); }
const PCV = document.createElement('canvas'); PCV.width = 300; PCV.height = 560; const PTX = new THREE.CanvasTexture(PCV); PTX.colorSpace = THREE.SRGBColorSpace; { const s = new THREE.Mesh(new THREE.PlaneGeometry(.98, 1.9), new THREE.MeshBasicMaterial({ map: PTX, toneMapped: false })); s.position.z = .085; PHONE.add(s); }
PHONE.userData.draw = fn => { const c = PCV.getContext('2d'); c.fillStyle = '#0e1420'; c.fillRect(0, 0, 300, 560); fn(c, 300, 560); PTX.needsUpdate = true; };
// Käsebrot (dos rebanadas con queso y lechuga) y fiambrera vacía
const BROT = P_(new THREE.Group()); { const b = mat(0xd8a860, { roughness: .9 }); box(1.6, .3, 1.4, b, .12, BROT, 0, 0, 0); box(1.7, .12, 1.5, mat(0xffd23f, { roughness: .6 }), .02, BROT, 0, .2, 0); box(1.7, .1, 1.5, mat(0x5ac83a), .02, BROT, 0, .3, 0); box(1.6, .3, 1.4, b, .12, BROT, 0, .48, 0); }
const BOX = P_(new THREE.Group()); { const m = mat(0x3ab8ff, { roughness: .4 }); box(2.4, .2, 1.6, m, .05, BOX, 0, 0, 0); for (const s of [-1, 1]) { box(2.4, .9, .12, m, .03, BOX, 0, .45, s * .76); box(.12, .9, 1.6, m, .03, BOX, s * 1.15, .45, 0); } const lid = box(2.5, .12, 1.7, mat(0x2a8ad8), .05, BOX, 0, 1.0, -.9); lid.rotation.x = -1.2; }
// caja de juego en la mano (GTA 5)
const GAME = P_(new THREE.Group()); { const t = canvasTex(64, 90, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#ff8a3a'); s.addColorStop(1, '#8a2a6a'); c.fillStyle = s; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a2a'; for (let i = 0; i < 6; i++) c.fillRect(4 + i * 10, 40 - (i % 3) * 8, 8, 40); c.fillStyle = '#ffffff'; c.font = `700 22px ${FONT}`; c.textAlign = 'center'; c.lineWidth = 4; c.strokeStyle = '#1a1a2a'; c.strokeText('GTA 5', 32, 26); c.fillText('GTA 5', 32, 26); }); box(1.5, 2.1, .3, mat(0xffffff, { map: t, roughness: .4 }), .04, GAME, 0, 0, 0); }
// carteles de protesta (palos con pancarta dibujada)
const PROTEST = ['WIR WOLLEN DAS S!', 'S IST FREIHEIT!', 'SORRY, SAGEN!', 'GEBT UNS DAS S!', 'SSSSS!', 'S ZURÜCK!'];
const PSIGN = PROTEST.map((t, i) => { const g = P_(new THREE.Group()); scene.add(g); cyl(.1, .1, 6, mat(0x8a5a32), 6, g, 0, -3, 0); const p = textPlane(4.4, 2.6, 260, 154, (c, w, h) => { c.fillStyle = ['#ffffff', '#ffd23f', '#9ad8ff', '#ffb8d8'][i % 4]; c.fillRect(0, 0, w, h); c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.strokeRect(3, 3, w - 6, h - 6); c.font = `700 ${Math.min(64, 2200 / t.length)}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; const ws = t.split(' '); const half = Math.ceil(ws.length / 2); const l1 = ws.slice(0, half).join(' '), l2 = ws.slice(half).join(' '); c.fillStyle = '#d8202a'; c.fillText(l2 ? l1 : t, w / 2, l2 ? h * .34 : h / 2); if (l2) c.fillText(l2, w / 2, h * .7); }); p.position.y = 1.2; g.add(p); const b = p.clone(); b.rotation.y = Math.PI; g.add(b); return g; });
// megáfono
const MEGA = P_(new THREE.Group()); { const m = new THREE.Mesh(new THREE.CylinderGeometry(.9, .3, 2, 16, 1, true), mat(0xf4f4f4, { side: THREE.DoubleSide, roughness: .4 })); m.rotation.x = Math.PI / 2; m.position.z = 1; MEGA.add(m); cyl(.32, .32, .6, mat(0xd8202a), 10, MEGA, 0, 0, -.1).rotation.x = Math.PI / 2; box(.25, .8, .3, mat(0x1a1a1a), .05, MEGA, 0, -.5, 0); }
// esposas
const CUFFS = P_(new THREE.Group()); scene.add(CUFFS); for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.32, .07, 8, 18), mat(0xd8dce4, { metalness: .9, roughness: .2 })); r.position.x = s * .45; CUFFS.add(r); } box(.5, .06, .06, mat(0xd8dce4, { metalness: .9 }), 0, CUFFS, 0, 0, 0);
// mochila del protagonista
const BAG = P_(new THREE.Group()); { box(1.7, 2.1, .9, mat(0xe8322a, { roughness: .8 }), .3, BAG, 0, 0, 0); box(1.3, .9, .3, mat(0xc8202a), .2, BAG, 0, -.4, .55); for (const s of [-1, 1]) box(.2, 1.8, .15, mat(0x2a2a2a), .05, BAG, s * .55, .1, -.5); }
// escalera y brocha del pintor (THCHULE)
const LADDER = P_(new THREE.Group()); { const w = mat(0xb88a4a, { roughness: .8 }); for (const s of [-1, 1]) box(.3, 24, .3, w, .05, LADDER, s * 1.4, 12, 0); for (let k = 0; k < 16; k++) box(2.8, .2, .25, w, .02, LADDER, 0, 1 + k * 1.45, 0); }
const BRUSH = P_(new THREE.Group()); { cyl(.08, .08, 1.4, mat(0x8a5a32), 6, BRUSH, 0, .7, 0); box(.5, .5, .2, mat(0xd8202a), .05, BRUSH, 0, 1.6, 0); }
const PAINT = P_(new THREE.Group()); { cyl(.5, .45, .8, mat(0xc8c8d0, { metalness: .7 }), 12, PAINT, 0, .4, 0); cyl(.46, .46, .05, mat(0xd8202a), 12, PAINT, 0, .78, 0); }
const CONF = Array.from({ length: 80 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xffd23f, 0xffffff, 0x3a7ad8, 0xff4a8a, 0x8ad84a][i % 5], side: THREE.DoubleSide })); scene.add(p); return P_(p); });
const DUST = Array.from({ length: 16 }, () => P_(sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8)));
const SWEAT = Array.from({ length: 3 }, () => P_(sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const TEAR = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8)));
const SPIT = Array.from({ length: 14 }, () => P_(sphere(.055, mat(0xcfefff, { roughness: .05, transparent: true, opacity: .8 }), scene, 0, 0, 0, 8, 6)));
const FLASHL = new THREE.SpotLight(0xfff0c8, 0, 70, .38, .5, 1.2); scene.add(FLASHL, FLASHL.target);
const FALLBAN = P_(banSign(scene, 'S', 4.2));   // señal que cae del pórtico al final

// ---------- ambiente ----------
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
  for (const k in SETS) SETS[k].visible = false; FX2D.length = 0; FACES.length = 0; FLASHL.intensity = 0; DSCR.forEach(s => s.visible = false); RP.SCR.forEach(s => s.visible = false); RP.ROB.visible = false; RP.STG.visible = false; RP.BANS.visible = false; SA.TEL.userData.open(0);
  GAN.visible = true; GAN.userData.sign.visible = true; GAN.userData.sign.userData.bar.visible = true; LADDER.visible = false;
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
  else if (m === 'hands') { actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2, headY: Math.sin(L.T + i) * .2 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'shock', mouth: 'o' }); }
  else if (m === 'sign') { const j = Math.sin(L.T * 4 + i); actuar(c, 0, [[0, { aRx: 2.7, aRz: -.1, aRe: .3, aLx: 2.5 + j * .2, aLz: .3, aLe: .5, lean: -.04 }]], { T: L.T }); const s = PSIGN[i % PSIGN.length]; if (!s.visible) attach(s, c.aR.hand, [0, -.4, 0], [Math.PI, 0, 0], .9); cara(c, T, { expr: 'angry', mouth: Math.sin(L.T * 8 + i) > 0 ? 'talk_wide' : 'o' }); }
  else if (m === 'laugh') { const j = Math.abs(Math.sin(L.T * 9 + i)); actuar(c, 0, [[0, { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.6, aRe: 1.6, lean: .2 + j * .1, crouch: .05 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'silent') { actuar(c, 0, [[0, { aLx: .2, aRx: .2, headX: .15, headY: Math.sin(L.T * .4 + i) * .2 }]], { T: L.T }); cara(c, T, { expr: 'worried', mouth: 'flat' }); }
  else if (m === 'sitcheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); sit(c, x, o.seat ?? 2.4, z, ry, L, { aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3 }); laughF(c, T); }
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); } }
// plano medio/entero de un personaje: cámara delante (yaw relativo a su ry), centro a la altura del pecho
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null, dy = 3.3) { const s = ch.spec.scale || 1, p = ch.root.position, c = V(p.x, p.y + dy * s, p.z); const q = easeInOut(clamp(k)); orbit(c, lerp(dist, dist2 ?? dist * .88, q) * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const _hb = new THREE.Box3(); function heightTo(ch, m) { ch.root.updateMatrixWorld(true); _hb.makeEmpty(); ch.root.traverseVisible(o => { if (o.isMesh && o !== ch.blob) _hb.expandByObject(o, false); }); const t = _hb.max.y - ch.root.position.y; ch.root.scale.multiplyScalar(m * M2U / t); return ch; }
const toCam = ch => { const p = ch.root.position; ch.root.rotation.y = Math.atan2(camera.position.x - p.x, camera.position.z - p.z); };
const FACES = [];
const faceDir = ch => V(Math.sin(ch.root.rotation.y), 0, Math.cos(ch.root.rotation.y));
// nada tapa la cara de un protagonista: confeti y humo delante de la cara se apartan
function clearFaces() { if (!FACES.length) return; camera.updateMatrixWorld(); camera.updateProjectionMatrix();
  const F = FACES.filter(c => c.root.visible).map(c => { const h = hp(c).add(V(0, .65 * (c.spec.scale || 1), 0)); const p = h.clone().project(camera); const d = camera.position.distanceTo(h); const r = 1.25 * (c.spec.scale || 1) / (d * Math.tan(camera.fov * PI / 360)); return { p, d, r }; });
  for (const b of [...CONF, ...SMOKE, ...SPIT]) { if (!b.visible) continue; const q = b.position.clone().project(camera); const dc = camera.position.distanceTo(b.position); for (const f of F) { if (dc > f.d + .5) continue; if (Math.hypot((q.x - f.p.x) * W / H, q.y - f.p.y) < f.r * 1.15) { b.visible = false; break; } } } }
const hero = (...c) => FACES.push(...c);
// humo (y llamas) saliendo de c
function smoke(c, T, n = 26, fire = true) { SMOKE.forEach((s, i) => { if (i >= n) return; const r = RNG(i * 11 + 3), t = (T * (.35 + r() * .2) + r()) % 1; s.visible = true; s.position.set(c.x + (r() - .5) * 3 + Math.sin(T + i) * t * 2, c.y + t * 14, c.z + (r() - .5) * 3 + t * 2); s.scale.setScalar(.8 + t * 3.2); s.material.opacity = .7 * (1 - t); });
  if (fire) FLAME.forEach((f, i) => { const r = RNG(i * 7 + 1), t = (T * 1.6 + r()) % 1; f.visible = true; f.position.set(c.x + (r() - .5) * 3, c.y + t * 2.6, c.z + (r() - .5) * 2.4); f.scale.setScalar((1 - t) * (.8 + r() * .6)); }); }
// saliva del ceceo delante de la boca
function spit(ch, T, t0, n = 8) { const h = hp(ch), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), s = ch.spec.scale || 1; SPIT.forEach((p, i) => { if (i >= n) return; const r = RNG(i * 5 + 2), t = ((T - t0) * 1.6 + r()) % 1; p.visible = true; p.position.set(h.x + fx * (.9 + t * 2.6) * s + (r() - .5) * .8 * t, h.y + (.45 + t * .6 - t * t * 1.4) * s, h.z + fz * (.9 + t * 2.6) * s + (r() - .5) * .8 * t); }); }

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
const KEY = /^(Thtadt|S|verboten|Gefängnith|T-H|Schule|Lehrerin|thtill|Käthebrot|lachen|vier|Polizithten|hoch|lächerlich|GTA|Thechth|Fünf|Regel|Theltthameth|Fernthehen|Roboter|Rathauth|unglaublich|Vorhang|Thüthe|Thahnethothe|Thuper|Thpaghetti|Thieben|Thalatgurken|auththprechen|verboten|Handy|Riethenbildschirm|durch|Verbot|erlaubt|jubelten|Sechs|lächelte|R|L|stiww|Powizist|wuhig|Powsche|bwennt|Kwassenzimmew|Ewnst|wächewte|witzig)$/;
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
  for (const f of FX2D) f(octx); for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { applyPose, hp, jonte, zisch, SA, renderer, composer, bloom, sun, grade, scene, camera };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

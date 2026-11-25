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
const SPIT = Array.from({ length: 14 }, () => P_(sphere(.09, mat(0xcfefff, { roughness: .05, transparent: true, opacity: .8 }), scene, 0, 0, 0, 8, 6)));
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
// ---------- a: gancho, la regla y el colegio (0 – 22,84 s) ----------
// Pueblo (x = 0): plaza z ∈ [-70, 50], carretera hacia +z, pórtico «S verboten» en z = 70. THUPERMARKT = LT.HS[12] (este).
// Colegio (SCX): fachada en z = -26, rótulo en (0, 26.4). Aula (KLX): pizarra en z = -15.45; pupitres x ∈ {-11, 0, 11}, z ∈ {-2, 6, 14} (silla +2.8); puerta x = -19.6, z 4.6…11.2.
function town(L, o = {}) { use('LT'); if (o.night) { night(30); renderer.toneMappingExposure = .9; TINT = 'rgba(10,16,60,.18)'; } else if (o.dusk) dusk(); else day(); }
function schoolS(L) { use('SC'); day(); SCHILD.userData.draw(1); }
function klasseS(L, board = 1) { use('KL'); inside(1.0, 40); KL.BB.userData.draw('d' + board, (c, w, h) => { c.fillStyle = '#1e3a2a'; c.fillRect(0, 0, w, h); c.font = `700 54px ${FONT}`; c.textAlign = 'center'; c.fillStyle = '#f4f4f4'; c.fillText('DIKTAT', w / 2, 62); c.font = `700 44px ${FONT}`; c.fillStyle = '#ffd23f'; c.fillText('THONNE · THAND · THOMMER', w / 2, 140); c.fillStyle = '#ffffff'; c.fillText('S = TH  (!!!)', w / 2, 220); c.strokeStyle = '#ff6a6a'; c.lineWidth = 6; c.beginPath(); c.arc(w / 2 - 92, 206, 34, 0, 7); c.stroke(); }); }
const KW = x => V(KLX + x[0], x[1] ?? 0, x[2]);
// pupitre (q, r) → asiento del alumno
const seatAt = (q, r) => [KLX - 11 + q * 11, -2 + r * 8 + 2.8];
function classKids(L, skip = [], mode = 'sit') { const S_ = [[0, 0], [2, 0], [0, 1], [0, 2], [1, 2], [2, 2], [1, 0]]; S_.forEach(([q, r], i) => { if (skip.some(s => s[0] === q && s[1] === r)) return; const c = KIDS[i]; const [x, z] = seatAt(q, r);
  if (mode === 'hands') { sit(c, x, 2.45, z, PI, L, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2 }); cara(c, L.T + i, { expr: 'shock', mouth: 'o' }); }
  else if (mode === 'laugh') { const j = Math.abs(Math.sin(L.T * 9 + i)); sit(c, x, 2.45, z, PI + Math.sin(i) * .4, L, { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.6, aRe: 1.6, lean: .15 + j * .1 }); laughF(c, L.T + i); }
  else if (mode === 'scared') { sit(c, x, 2.45, z, PI, L, { aLx: 1.2, aRx: 1.2, aLe: 1.8, aRe: 1.8, lean: -.1, headX: -.1 }); cara(c, L.T + i, { expr: 'shock', mouth: 'grimace' }); }
  else { sit(c, x, 2.45, z, PI, L, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2, headY: Math.sin(L.T * .8 + i) * .25 }); cara(c, L.T + i, { expr: 'neutral' }); } }); }
const walkTo = (c, L, x0, z0, x1, z1, i = 0, run = false) => { const q = L.k; c.root.position.x = lerp(x0, x1, q); c.root.position.z = lerp(z0, z1, q); c.root.rotation.y = Math.atan2(x1 - x0, z1 - z0); c.root.position.y = Math.abs(Math.sin(L.T * (run ? 13 : 9) + i)) * (run ? .35 : .12); actuar(c, 0, [[0, run ? runP(L.T, i) : walkP(L.T, i)]], { T: L.T }); };
const holdBag = c => attach(BAG, c.spine, [0, 1.0, -.95], [0, 0, 0], .9);
function drawBubbleWord(ch, text, k, col = '#ffffff') { bubble(ch, text, k); }
const bannerSign = (g, k) => { const S = g.userData.sign; S.scale.setScalar(1 + .06 * Math.sin(k * 30) * (1 - k)); };

// 1 «In diether Thtadt»: la carretera de Zischelbach con el pórtico y la señal gigante «S verboten»; Jonte camina hacia cámara mirando la señal; zoom lento hacia ella
shot(0, 'C', null, L => { town(L); const c = put(jonte, 0, 0, 0, 0); walkTo(c, L, -.8, 38.5, -.4, 41.5); c.root.rotation.y = .05; cara(c, L.T, { expr: 'worried', eyes: 'up' }); holdBag(c); hero(c);
  crowdAt(L, 0, 30, 9, 6, 16, 3, { mode: i => ['walk', 'talk', 'walk', 'point'][i % 4], gap: 1.5, dir: PI * .5 }); bannerSign(GAN, L.k);
  cm([0, 7, 66, 0, 7.4, 36, 50], [0, 7.4, 60, 0, 7.8, 36, 46], L.k, easeOut); sh(V(0, 0, 40), 36); }, [[0, 'whoosh', .5], [.1, 'crowd_murmur', .3], [.5, 'steps', .3]]);
// 2 «itht der Buchthtabe S verboten.»: la señal de cerca; la barra roja golpea la S; vibra
shot(1.05, 'Z', 'punch', L => { town(L); const S = GAN.userData.sign; const k = clamp(L.lt / .35); S.userData.bar.scale.set(easeOut(k), 1, 1); S.rotation.z = Math.sin(L.T * 40) * .03 * (1 - clamp(L.lt / .6));
  crowdAt(L, 0, 26, 6, 6, 12, 5, { mode: 'point', face: V(0, 10, 36), gap: 1.2 });
  cm([3, 7.6, 58, 0, 9.4, 36, 34], [1.5, 8.2, 54, 0, 9.6, 36, 32], L.k); sh(V(0, 0, 36), 26); badge('red', 'VERBOTEN!', W / 2, H * .17, (L.lt - .3) / .25, 1, 1); }, [[0, 'impact', .7], [.05, 'metal_clang', .5], [.3, 'buzzer', .4]]);
// 3 «Wer ihn thagt,»: en la plaza un vecino dice «SSS…» sin querer; dos policías se giran y le señalan
shot(2.48, 'W', null, L => { town(L); const m = put(EX[3], 6, 0, 10, -.3); talk(m, L.T, 2.48, 3.4, 'happy'); actuar(m, 0, [[0, { aRx: .8, aRz: .2, aRe: 1.1, aLx: .3 }]], { T: L.T }); bubble(m, 'SSSERVUS!', (L.lt - .1) / .2); hero(m);
  const c1 = put(COPS[0], 12.5, 0, 3, -.9); actuar(c1, L.lt, [[0, 'idle'], [.25, 'point', { dur: .25 }]], { T: L.T }); cara(c1, L.T, { expr: 'angry', mouth: 'o' }); const c2 = put(COPS[1], 1, 0, 2, .6); actuar(c2, L.lt, [[0, 'idle'], [.35, 'shock', { dur: .25 }]], { T: L.T }); cara(c2, L.T, { expr: 'shock', mouth: 'o' });
  crowdAt(L, 6, 10, 5, 7, 12, 8, { mode: 'shock', from: 4, gap: 1.6, avoid: [[12.5, 3], [1, 2]] });
  orb(L.k, V(6, 4.2, 9), null, [17, -.12, .1, 42], [14, -.2, .08, 42]); sh(V(6, 0, 8), 20); }, [[0, 'gasp', .4], [.3, 'whistle', .6]]);
// 4 «kommt inth Gefängnith.»: los policías le ponen las esposas y lo meten en el coche patrulla
shot(3.4, 'F', null, L => { town(L); const k = easeInOut(L.k); const z = lerp(14, 10.5, k); const m = put(EX[3], 8, 0, z, -.1); actuar(m, 0, [[0, { aLx: -.5, aRx: -.5, aLz: .3, aRz: -.3, aLe: .3, aRe: .3, lean: -.12, headX: -.05, ...shiver(L.T, .8) }]], { T: L.T }); cara(m, L.T, { expr: 'worried', mouth: 'scream' }); hero(m);
  attach(CUFFS, m.aR.hand, [0, -.8, 0], [PI / 2, 0, 0], 1);
  const c1 = put(COPS[0], 5.6, 0, z - .6, .35); actuar(c1, 0, [[0, { aRx: 1.0, aRz: -.6, aRe: .6, aLx: .4, lean: -.08 }]], { T: L.T }); cara(c1, L.T, { expr: 'angry', mouth: 'talk' }); const c2 = put(COPS[1], 10.4, 0, z - .6, -.35); actuar(c2, 0, [[0, { aLx: 1.0, aLz: .6, aLe: .6, aRx: .4, lean: -.08 }]], { T: L.T }); cara(c2, L.T, { expr: 'determined' });
  show(POL, 8, 0, 1.5, PI / 2); crowdAt(L, 8, 8, 6, 9, 14, 9, { mode: 'shock', from: 6, gap: 1.7 });
  onBody(m, 15, .25, .1, 44, L.k, 13, .2, 3.6); sh(V(8, 0, 8), 20); }, [[0, 'siren', .6], [.15, 'cuffs', .6], [.5, 'car_door', .5]]);
// 5 «Und jeder muth ihn»: delante del THUPERMARKT dos vecinas se saludan ceceando (bocadillos «THERVUTH!»)
shot(4.18, 'S', null, L => { town(L); const sp = LT.HS[2].position; const bx = sp.x + 13, bz = sp.z;
  const a = put(EX[4], bx + 1, 0, bz - 2.6, 1.85); talk(a, L.T, 4.18, 4.8, 'happy'); actuar(a, 0, [[0, 'wave']], { T: L.T }); bubble(a, 'THERVUTH!', (L.lt - .05) / .2, 2.2);
  const b = put(EX[6], bx + 1, 0, bz + 2.6, 1.25); talk(b, L.T, 4.8, 5.37, 'happy'); actuar(b, L.lt, [[0, 'idle'], [.5, 'wave', { dur: .2 }]], { T: L.T }); bubble(b, 'THERVUTH!', (L.lt - .6) / .2, 2.2); hero(a, b);
  crowdAt(L, bx + 4, bz, 4, 8, 14, 11, { mode: 'walk', from: 8, gap: 1.6 });
  orb(L.k, V(bx + 1, 4.6, bz), null, [17, 1.45, .1, 42], [15, 1.6, .1, 42]); sh(V(bx, 0, bz), 20); }, [[0, 'chime_shop', .4], [.1, 'giggle', .4], [.6, 'giggle', .4]]);
// 6 «durch T-H erthetzen.»: un pintor en una escalera tacha la S del rótulo del colegio y pinta «TH»
shot(5.37, 'R', null, L => { schoolS(L); SCHILD.userData.draw(clamp(L.lt / 1.0)); const p = put(EX[10], SCX - 9.2, 17.6, -23.6, PI + .5); show(LADDER, SCX - 9.2, 0, -24.4, 0); LADDER.rotation.x = -.06;
  actuar(p, 0, [[0, { aRx: 3.0 + Math.sin(L.T * 9) * .15, aRz: -.1 + Math.sin(L.T * 9) * .2, aRe: .2, aLx: 1.0, aLe: 1.2, lean: -.05 }]], { T: L.T }); attach(BRUSH, p.aR.hand, [0, -.6, 0], [PI, 0, 0], 1); attach(PAINT, p.aL.hand, [0, -.9, 0], [0, 0, 0], .9); cara(p, L.T, { expr: 'determined' }); hero(p);
  crowdAt(L, SCX - 4, -12, 4, 6, 10, 12, { mode: 'point', face: V(SCX - 8, 24, -26), from: 10, gap: 1.4 });
  cm([SCX - 3, 19, -6, SCX - 8.5, 23.5, -25, 40], [SCX - 3.5, 21, -10, SCX - 8.8, 24, -25, 36], L.k); sh(V(SCX - 7, 18, -24), 20); DOF = 0; }, [[0, 'whirl', .3], [.15, 'paint_brush', .6], [.55, 'paint_brush', .6]]);
// 7 «Heute Morgen ging ich zur Schule.»: Jonte va al colegio con la mochila; detrás, el rótulo «THCHULE AM BERG»; otros niños entran
shot(6.54, 'W', null, L => { schoolS(L); const c = put(jonte, 0, 0, 0, 0); walkTo(c, L, SCX - 8, 2, SCX - 3, -1); c.root.rotation.y = 2.0; holdBag(c); cara(c, L.T, { expr: 'tired', mouth: 'flat' }); hero(c);
  KIDS.slice(0, 5).forEach((k, i) => { put(k, 0, 0, 0, 0); walkTo(k, L, SCX + 4 + i * 3, 2 - (i % 2) * 4, SCX + 2 + i * 3, -16 - (i % 2) * 3, i); });
  orb(L.k, V(SCX - 5.5, 6.5, 0), V(SCX - 3.5, 7, -1), [19, 1.25, .05, 46], [16.5, 1.15, .04, 46]); sh(V(SCX - 4, 0, -4), 30); }, [[0, 'birds', .4], [.1, 'steps', .5], [.8, 'school_bell', .5]]);
// 8 «Meine Lehrerin schrie:»: Frau Kessler escribe «DIKTAT: THONNE…» en la pizarra y se gira de golpe
shot(7.93, 'C', null, L => { klasseS(L); const t = put(kess, KLX + 3, 0, -12.6, PI); const turn = easeInOut(clamp((L.lt - .15) / .3)); t.root.rotation.y = lerp(PI, .15, turn);
  actuar(t, 0, [[0, turn < .5 ? { aRx: 2.6 + Math.sin(L.T * 12) * .15, aRz: .2, aRe: .3 } : { aRx: 1.6, aRe: .2, aLx: .4, lean: .08 }]], { T: L.T }); cara(t, L.T, { expr: turn < .5 ? 'neutral' : 'angry', mouth: turn < .5 ? 'flat' : 'talk_wide' }); hero(t);
  classKids(L, [[1, 1]]); const j = sit(jonte, ...[seatAt(1, 1)[0], 2.45, seatAt(1, 1)[1]], PI, L, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2 }); cara(jonte, L.T, { expr: 'tired' });
  orbit(V(KLX + 2, 6.4, -11), lerp(18, 15, L.k), .08, .12, 44); sh(V(KLX, 0, -8), 22); }, [[0, 'chalk', .6], [.45, 'whoosh_soft', .4], [.7, 'gasp', .3]]);
// 9 «„Thetzt euch hin und theid thtill!“»: primer plano de la profesora gritando y señalando abajo; saliva del ceceo
shot(9.01, 'Z', 'punch', L => { klasseS(L); const t = put(kess, KLX + 3, 0, -10.4, .1); talk(t, L.T, 9.01, 10.54, 'angry'); actuar(t, 0, [[0, { aRx: 1.3, aRz: -.1, aRe: .3, aLx: .3, aLz: .2, lean: .1, headX: .05 + Math.sin(L.T * 9) * .04 }]], { T: L.T }); spit(t, L.T, 9.01, 10); hero(t);
  classKids(L, [[1, 1]]); onFace(t, 5.2, .4, .6, 40, L.k, 4.4); sh(V(KLX + 3, 0, -10), 14); }, [[0, 'impact', .5], [.3, 'spit', .4], [.9, 'desk_slam', .4]]);
// 10 «Dann rannte mein bethter Freund»: la puerta se abre de golpe y Bela entra corriendo con la fiambrera
shot(10.54, 'S', null, L => { klasseS(L); DOOR.rotation.y = easeOut(clamp(L.lt / .25)) * 1.45; const b = put(bela, 0, 0, 0, 0); walkTo(b, L, KLX - 20, 8.2, KLX - 12, 10.8, 0, true); attach(BOX, b.aL.hand, [0, -.6, .3], [0, 0, 0], .8);
  cara(b, L.T, { expr: 'shock', mouth: 'scream' }); hero(b); classKids(L, [[1, 1]]); sit(jonte, seatAt(1, 1)[0], 2.45, seatAt(1, 1)[1], PI - .9, L, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2 }); cara(jonte, L.T, { expr: 'shock', mouth: 'o' });
  cm([KLX - 5, 7, 14.5, KLX - 16, 4.4, 9, 46], [KLX - 6, 6.6, 14, KLX - 13, 4.4, 10, 44], L.k); sh(V(KLX - 14, 0, 9), 18); }, [[0, 'door_slam', .7], [.1, 'run_steps', .6]]);
// 11 «inth Klathenzimmer.»: Bela corre entre los pupitres hacia cámara; los niños se giran
shot(11.68, 'W', null, L => { klasseS(L); DOOR.rotation.y = 1.45; const b = put(bela, 0, 0, 0, 0); walkTo(b, L, KLX - 11, 10.8, KLX + 1, 10.8, 1, true); attach(BOX, b.aL.hand, [0, -.6, .3], [0, 0, 0], .8); cara(b, L.T, { expr: 'shock', mouth: 'scream' }); hero(b);
  classKids(L, [[1, 1]]); sit(jonte, seatAt(1, 1)[0], 2.45, seatAt(1, 1)[1], PI - 1.3, L, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2 }); cara(jonte, L.T, { expr: 'shock' });
  cm([KLX + 9, 9.5, 11.5, KLX - 3, 4, 10.8, 46], [KLX + 8, 9, 11.2, KLX, 4, 10.8, 44], L.k); sh(V(KLX, 0, 10), 18); }, [[0, 'run_steps', .6], [.5, 'chair_scrape', .4]]);
// 12 «„Jemand hat mein Käthebrot geklaut!“»: Bela, desesperado, enseña la fiambrera vacía
shot(12.74, 'F', null, L => { klasseS(L); const b = put(bela, KLX + 2, 0, 10.8, PI / 2); talk(b, L.T, 12.74, 13.9, 'shock'); actuar(b, 0, [[0, { aLx: .55, aLz: -.25, aLe: .8, aRx: .55, aRz: -.25, aRe: .8, headX: -.08, ...shiver(L.T, .5) }]], { T: L.T }); attach(BOX, b.aL.hand, [.5, -.7, .5], [0, 0, 0], .9); spit(b, L.T, 12.74, 6); tears(b, L.T); hero(b);
  classKids(L, [[1, 1]]); onFace(b, 7.4, -.9, 0, 42, L.k, 6.2); sh(V(KLX + 2, 0, 10.8), 14); }, [[0, 'flash', .3], [.1, 'cry', .5], [.6, 'box_rattle', .4]]);
// 13 «geklaut!»: plano detalle de la fiambrera vacía con migas; Bela la sacude boca abajo; un queso pinchado en el borde
shot(13.9, 'C', 'punch', L => { klasseS(L); const b = put(bela, KLX + 2, 0, 10.8, PI / 2); actuar(b, 0, [[0, { aLx: 1.6, aLe: .4, aRx: 1.4, aRe: .6, headX: .2 }]], { T: L.T }); attach(BOX, b.aL.hand, [0, -.6, .4], [PI * .85 + Math.sin(L.T * 20) * .15, 0, 0], 1.1); cara(b, L.T, { expr: 'cry', mouth: 'scream' }); hero(b);
  dust(wpos(b.aL.hand).add(V(0, -1, 0)), L.t0 + .05, L.T, 8, .3); const hp_ = wpos(b.aL.hand); cm([hp_.x + 4.6, hp_.y + 1.4, hp_.z + .6, hp_.x, hp_.y + .2, hp_.z, 42], [hp_.x + 4, hp_.y + 1.6, hp_.z + .5, hp_.x, hp_.y + .3, hp_.z, 40], L.k); sh(V(KLX + 2, 0, 10.8), 12); DOF = 0; }, [[0, 'impact_soft', .5], [.05, 'box_rattle', .6]]);
// 14 «Ich konnte nicht aufhören zu lachen.»: Jonte en su pupitre se parte de risa y golpea la mesa
shot(14.95, 'W', null, L => { klasseS(L); const [x, z] = seatAt(1, 1); const j = Math.abs(Math.sin(L.T * 10)); sit(jonte, x, 2.45, z, PI + .25, L, { aLx: 1.2 + j * .4, aRx: 1.2 + j * .4, aLe: 1.4, aRe: 1.4, lean: .2 + j * .15, headX: -.1 + j * .1 }); laughF(jonte, L.T); tears(jonte, L.T); hero(jonte);
  classKids(L, [[1, 1]]); const b = put(bela, x + 6, 0, z + 1, -1.2); actuar(b, 0, [[0, { aLx: 1.5, aLe: .8 }]], { T: L.T }); attach(BOX, b.aL.hand, [0, -.6, .4], [0, 0, 0], .9); cara(b, L.T, { expr: 'sad', mouth: 'frown' });
  orbit(V(x, 4.2, z - 1), lerp(11.5, 9.5, L.k), PI - .3, .16, 42); sh(V(x, 0, z), 14); }, [[0, 'laugh_kid', .7], [.3, 'desk_slam', .4], [.9, 'desk_slam', .4]]);
// 15 «zu lachen.»: toda la clase se ríe; Bela hace pucheros con la fiambrera
shot(15.83, 'S', null, L => { klasseS(L); classKids(L, [[1, 1]], 'laugh'); const [x, z] = seatAt(1, 1); const j = Math.abs(Math.sin(L.T * 10)); sit(jonte, x, 2.45, z, PI, L, { aLx: 1.2 + j * .4, aRx: 1.2 + j * .4, aLe: 1.4, aRe: 1.4, lean: .2 + j * .15 }); laughF(jonte, L.T);
  const b = put(bela, KLX + 5.5, 0, 10.8, PI - .3); actuar(b, 0, [[0, { aLx: 1.5, aLe: .8, aRx: .2, headX: .1 }]], { T: L.T }); attach(BOX, b.aL.hand, [0, -.6, .4], [0, 0, 0], .9); cara(b, L.T, { expr: 'sad', mouth: 'frown' }); hero(b, jonte);
  cm([KLX + 1, 10, -14, KLX + 1, 3.6, 7, 52], [KLX + 1, 9.4, -13, KLX + 1, 3.8, 7, 50], L.k); sh(V(KLX, 0, 4), 26); }, [[0, 'class_laugh', .7], [.6, 'giggle', .4]]);
// 16 «Aber dann thtürmten»: la puerta salta y entra el primer policía de una patada
shot(16.94, 'C', 'punch', L => { klasseS(L); const k = easeOut(clamp(L.lt / .18)); DOOR.rotation.y = k * 1.55; const c = put(COPS[2], 0, 0, 0, 0); walkTo(c, L, KLX - 21, 8, KLX - 15.5, 9.5, 0, true); actuar(c, L.lt, [[0, { lLx: 1.4, lLk: .2, aRx: 1.2, aRe: .3, lean: -.1 }], [.25, runP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'angry', mouth: 'talk_wide' }); hero(c);
  classKids(L, [[1, 1]], 'scared'); dust(V(KLX - 18, 0, 8), L.t0, L.T, 10, .6);
  cm([KLX - 6, 8, 15, KLX - 17, 4.4, 8.5, 46], [KLX - 7, 7.6, 14.5, KLX - 16, 4.4, 9, 44], L.k); sh(V(KLX - 16, 0, 8), 16); }, [[0, 'door_kick', .8], [.1, 'glass_shake', .4], [.2, 'boots', .5]]);
// 17 «vier Polizithten durch die Tür.»: los cuatro policías en fila dentro del aula; un «4» enorme salta
shot(17.7, 'W', null, L => { klasseS(L); DOOR.rotation.y = 1.55; COPS.forEach((c, i) => { const x = KLX - 16 + i * 3.4, z = 11 - (i % 2) * .5; put(c, 0, 0, 0, 0); walkTo(c, { ...L, k: clamp(L.k * 1.6) }, x - 4, z, x, z, i); c.root.rotation.y = 1.0; if (L.k > .62) actuar(c, 0, [[0, i % 2 ? 'point' : { aLx: .3, aRx: .3, aLz: .2, aRz: -.2, aLe: 1.4, aRe: 1.4 }]], { T: L.T }); cara(c, L.T + i, { expr: 'angry', mouth: i % 2 ? 'talk_wide' : 'flat' }); });
  classKids(L, [[1, 1]], 'scared'); hero(...COPS); badge3('big', '4', V(KLX - 11, 11.5, 10.5), (L.lt - .2) / .2, 1.5);
  cm([KLX + 5, 7.6, 17, KLX - 11, 4.6, 10.5, 50], [KLX + 4, 7.4, 16, KLX - 11, 4.6, 10.5, 48], L.k); sh(V(KLX - 10, 0, 10), 20); }, [[0, 'boots', .6], [.25, 'pop', .6], [.5, 'radio_chatter', .4]]);
// 18 «„Alle thofort die Hände hoch!“»: primer plano del policía gritando con el dedo en alto
shot(19.3, 'Z', 'punch', L => { klasseS(L); const c = put(COPS[1], KLX - 6, 0, 2, .7); talk(c, L.T, 19.3, 20.12, 'angry'); actuar(c, 0, [[0, { aRx: 2.7, aRz: -.1, aRe: .2, aLx: .4, lean: .1 }]], { T: L.T }); spit(c, L.T, 19.3, 8); hero(c);
  classKids(L, [[1, 1]], 'scared'); onFace(c, 5.6, .4, -.8, 40, L.k, 4.8); sh(V(KLX - 6, 0, 2), 14); }, [[0, 'impact', .6], [.2, 'megaphone_buzz', .3]]);
// 19 «die Hände hoch!»: toda la clase y la profesora levantan las manos a la vez
shot(20.12, 'S', null, L => { klasseS(L); classKids(L, [[1, 1]], 'hands'); const [x, z] = seatAt(1, 1); sit(jonte, x, 2.45, z, PI, L, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2 }); cara(jonte, L.T, { expr: 'shock', mouth: 'o' });
  const t = put(kess, KLX - 13, 0, -9, .6); actuar(t, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2 }]], { T: L.T }); cara(t, L.T, { expr: 'shock', mouth: 'o' }); hero(jonte, t);
  const b = put(bela, KLX + 5.5, 0, 10.8, PI - .3); actuar(b, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2 }]], { T: L.T }); cara(b, L.T, { expr: 'shock', mouth: 'o' });
  cm([KLX + 1, 9.6, -14, KLX, 4.4, 6, 52], [KLX + 1, 9, -12.5, KLX, 4.6, 6, 50], L.k, easeOut); sh(V(KLX, 0, 2), 26); }, [[0, 'whoosh_up', .5], [.1, 'cloth', .5]]);
// 20 «Thogar die Polizei»: Jonte con las manos arriba aguantándose la risa (mejillas infladas)
shot(20.87, 'F', null, L => { klasseS(L); const [x, z] = seatAt(1, 1); const j = Math.sin(L.T * 14); sit(jonte, x, 2.45, z, PI - .3, L, { aLx: 2.9, aRx: 2.9, aLz: .25, aRz: .25, aLe: .2, aRe: .2, lean: .05 + Math.abs(j) * .05 }); cara(jonte, L.T, { expr: 'smug', eyes: 'squint', mouth: j > .4 ? 'grin' : 'wavy' }); hero(jonte);
  classKids(L, [[1, 1]], 'hands'); onFace(jonte, 6, -.4, -.6, 40, L.k, 5.4); sh(V(x, 0, z), 12); }, [[0, 'flash', .3], [.2, 'snort', .5]]);
// 21 «klang lächerlich.»: los policías gritan «THOFORT!» con los bocadillos mientras los niños se ríen por lo bajo
shot(21.69, 'W', null, L => { klasseS(L); COPS.slice(0, 3).forEach((c, i) => { put(c, KLX - 12 + i * 4, 0, 4 - i, .7 - i * .15); talk(c, L.T + i * .3, 21.69, 22.84, 'angry'); actuar(c, 0, [[0, i === 1 ? 'point' : { aRx: 1.2, aRe: .4, lean: .1 }]], { T: L.T }); });
  bubble(COPS[0], 'THOFORT!', (L.lt - .05) / .2); bubble(COPS[2], 'THTILL!', (L.lt - .45) / .2); classKids(L, [[1, 1]], 'laugh'); hero(...COPS.slice(0, 3));
  orbit(V(KLX - 8, 5.6, 3), lerp(19, 17, L.k), 1.0, .12, 44); sh(V(KLX - 8, 0, 3), 18); }, [[0, 'whoosh_soft', .4], [.2, 'giggle', .5], [.6, 'class_laugh', .4]]);
// ---------- b: la tienda, la sospecha, el robot y el ayuntamiento de noche (22,84 – 46,10 s) ----------
// Tienda (ZOX): mostrador en (0, -6) mirando +z; Zocker detrás en z = -9; estantería de GTA 5 en la pared este (x = 19.4, z = -2); póster «BALD: GTA 6» en (0, 9.5, -15.75).
// Salón (WZX): tele en (0, -9.6) (pantalla ≈ y 4.5); sofá en (0, 3.2) mirando -z. Plaza del ayuntamiento (RPX): balcón en (0, 15, -31…-26.3); escenario con robot en (0, -14).
// Sala (SAX): atril en (0, -6) mirando +z; alcalde detrás en z = -8.6; telón en z = 4 (x ±15.2 cerrado); espejo en (-12, -10).
function ladenS(L) { use('ZO'); inside(1.0, 36); FILL.color.setRGB(.92, .88, 1); }
function wohnS(L) { use('WZ'); inside(.95, 34); }
function platzS(L, o = {}) { use('RP'); if (o.night) { night(18); renderer.toneMappingExposure = .72; TINT = 'rgba(8,12,60,.36)'; DARK = .12; } else day(); }
function saalS(L) { use('SA'); inside(.85, 30); FILL.color.setRGB(1, .9, .78); }
const ZW = (x, y, z) => V(ZOX + x, y, z), RW = (x, y, z) => V(RPX + x, y, z), SW = (x, y, z) => V(SAX + x, y, z);
// cara dibujada del alcalde (pantallas, móvil): pelo gris con raya, bigote enroscado, cadena
function mayorFace(c, x, y, r, T, talkK = 1) { c.save(); c.translate(x, y); c.fillStyle = '#f0c0a0'; c.beginPath(); c.roundRect(-r, -r, 2 * r, 2 * r, r * .25); c.fill(); c.lineWidth = r * .06; c.strokeStyle = '#1a1a1a'; c.stroke();
  c.fillStyle = '#9a9aa2'; c.beginPath(); c.roundRect(-r * 1.05, -r * 1.15, 2.1 * r, r * .6, r * .2); c.fill(); c.fillStyle = '#ffffff'; c.fillRect(-r * .35, -r * 1.1, r * .06, r * .5);
  c.fillStyle = '#1a1a1a'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * r * .38, -r * .15, r * .1, r * .14, 0, 0, 7); c.fill(); }
  const mo = talkK * (.5 + .5 * Math.sin(T * 24)); c.fillStyle = '#6a1a1a'; c.beginPath(); c.ellipse(0, r * .5, r * .3, r * (.06 + mo * .18), 0, 0, 7); c.fill();
  c.fillStyle = '#8a8a92'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * r * .28, r * .3, r * .3, r * .1, s * -.2, 0, 7); c.fill(); c.beginPath(); c.arc(s * r * .62, r * .2, r * .1, 0, 7); c.fill(); }
  c.fillStyle = '#7a1a2a'; c.fillRect(-r * 1.1, r, r * 2.2, r * .7); c.strokeStyle = '#f0c030'; c.lineWidth = r * .08; c.beginPath(); c.arc(0, r * .95, r * .55, .2, Math.PI - .2); c.stroke(); c.restore(); }
function drawMayorVid(c, w, h, T, text = 'THÜTHE THAHNETHOTHE!') { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#5a1a2a'); g.addColorStop(1, '#2a0a1a'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.06)'; for (let i = 0; i < h; i += 6) c.fillRect(0, i, w, 2);
  mayorFace(c, w * .32, h * .5, h * .26, T); c.strokeStyle = '#7aff9a'; c.lineWidth = 6; c.beginPath(); for (let i = 0; i <= 40; i++) { const x = w * .55 + i * w * .01, a = Math.sin(T * 20 + i * .9) * Math.sin(i * .3) * h * .12 * (.6 + .4 * Math.sin(T * 7)); c.lineTo(x, h * .42 + a); } c.stroke();
  c.fillStyle = '#e8141e'; c.beginPath(); c.roundRect(w * .04, h * .06, w * .2, h * .12, 10); c.fill(); c.fillStyle = '#ffffff'; c.font = `700 ${h * .08 | 0}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('● REC', w * .14, h * .125);
  c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(0, h * .78, w, h * .2); c.fillStyle = '#ffd23f'; c.font = `700 ${h * .1 | 0}px ${FONT}`; c.fillText(text, w / 2, h * .88); }
function drawNews(c, w, h, T) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1a3a8a'); g.addColorStop(1, '#0a1a4a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  c.fillStyle = '#6a4a2a'; c.fillRect(w * .42, h * .44, w * .16, h * .34); c.fillStyle = '#d8b040'; c.fillRect(w * .4, h * .42, w * .2, h * .04); c.fillStyle = '#2a2a2a'; c.fillRect(w * .495, h * .3, 6, h * .14);
  c.fillStyle = '#ffffff'; c.font = `700 ${h * .26 | 0}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.globalAlpha = .55 + .45 * Math.sin(T * 6); c.fillText('?', w * .5, h * .22); c.globalAlpha = 1;
  c.fillStyle = '#e8141e'; c.fillRect(0, h * .8, w, h * .2); c.fillStyle = '#ffffff'; c.font = `700 ${h * .075 | 0}px ${FONT}`; c.fillText('LIVE: REDE DES BÜRGERMEISTERS', w / 2, h * .86); c.font = `700 ${h * .06 | 0}px ${FONT}`; c.fillStyle = '#ffd23f'; c.fillText('BÜRGERMEISTER: KEIN BILD', w / 2, h * .94);
  c.fillStyle = '#e8141e'; c.beginPath(); c.roundRect(w * .03, h * .05, w * .14, h * .1, 8); c.fill(); c.fillStyle = '#fff'; c.font = `700 ${h * .06 | 0}px ${FONT}`; c.fillText('LIVE', w * .1, h * .1); }
function drawPhoneRec(c, w, h, T) { c.fillStyle = '#2a1a1a'; c.fillRect(0, 0, w, h); c.fillStyle = '#6a2a3a'; c.fillRect(0, h * .2, w, h * .6); mayorFace(c, w / 2, h * .48, w * .26, T); c.fillStyle = '#e8141e'; c.beginPath(); c.arc(w * .2, h * .08, 12, 0, 7); c.fill();
  c.fillStyle = '#ffffff'; c.font = `700 28px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; const s = Math.floor(T * 1.3) % 60; c.fillText('REC 00:' + String(s).padStart(2, '0'), w * .3, h * .08); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(w / 2, h * .9, 30, 0, 7); c.fill(); c.fillStyle = '#e8141e'; c.beginPath(); c.arc(w / 2, h * .9, 22, 0, 7); c.fill(); }

// 22 «Thpäter wollte ich mir im Laden»: Jonte entra en la Zockerhöhle y mira las estanterías con los ojos como platos
shot(22.84, 'W', null, L => { ladenS(L); const c = put(jonte, 0, 0, 0, 0); walkTo(c, L, ZOX - 15, -1, ZOX - 8, 0); c.root.rotation.y = PI / 2 + .3; cara(c, L.T, { expr: 'joy', eyes: 'wide', mouth: 'open_smile' }); holdBag(c); hero(c);
  const z = put(zock, ZOX, 0, -9, -.3); actuar(z, 0, [[0, 'wave']], { T: L.T }); cara(z, L.T, { expr: 'happy' }); crowdAt(L, ZOX + 10, 6, 2, 3, 5, 21, { mode: 'talk', from: 12, gap: 2 });
  cm([ZOX + 3, 7, 11, ZOX - 10, 4.4, -1, 48], [ZOX + 2, 6.8, 10, ZOX - 8, 4.4, -1, 46], L.k); sh(ZW(-8, 0, 0), 22); }, [[0, 'door_bell', .6], [.2, 'arcade_bleeps', .4], [.5, 'steps', .3]]);
// 23 «GTA Thechth kaufen.»: el póster «BALD: GTA 6» brilla; Jonte lo señala ilusionado; un «6» gigante salta
shot(23.89, 'Z', 'slow', L => { ladenS(L); const c = put(jonte, ZOX + 4.5, 0, -3, PI + .55); actuar(c, 0, [[0, { aRx: 2.5, aRz: -.1, aRe: .2, aLx: .6, aLe: 1.6, lean: -.06, headX: -.3 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'up', mouth: 'open_smile' }); holdBag(c); hero(c);
  badge3('gold', '6', ZW(4, 13.5, -14.8), (L.lt - .45) / .25, 1.6);
  cm([ZOX - 1, 7.8, 12, ZOX + 2, 6.6, -10, 50], [ZOX - .5, 7.4, 9.5, ZOX + 2, 6.8, -10, 48], L.k); sh(ZW(2, 0, -6), 20); DOF = 0; }, [[0, 'sparkle', .6], [.5, 'ding', .5]]);
// 24 «„Kann ich GTA Thechth haben, bitte?“»: Jonte en el mostrador, educado, con las manos juntas; el dependiente escucha
shot(25.33, 'S', null, L => { ladenS(L); const c = put(jonte, ZOX - .4, 0, -2.4, PI); talk(c, L.T, 25.33, 26.87, 'happy'); actuar(c, 0, [[0, { aLx: 1.0, aRx: 1.0, aLz: -.35, aRz: -.35, aLe: 1.4, aRe: 1.4, lean: .08, headZ: .1 }]], { T: L.T }); spit(c, L.T, 25.33, 6); holdBag(c);
  const z = put(zock, ZOX + .4, 0, -9.4, 0); actuar(z, 0, [[0, 'listen']], { T: L.T }); cara(z, L.T, { expr: 'confused' }); hero(c, z);
  cm([ZOX + 10, 8.8, -3.6, ZOX, 5, -5.9, 44], [ZOX + 9, 8.4, -4.2, ZOX, 5, -5.9, 42], L.k); sh(ZW(0, 0, -5), 18); }, [[0, 'tape', .3], [.4, 'arcade_bleeps', .3]]);
// 25 «Der Verkäufer thagte:»: el dependiente se quita un auricular, se inclina sobre el mostrador
shot(26.87, 'C', null, L => { ladenS(L); const z = put(zock, ZOX + .4, 0, -9, .12); actuar(z, 0, [[0, { aRx: .9, aLx: .9, aRz: -.3, aLz: -.3, aLe: .5, aRe: .5, lean: .18 }]], { T: L.T }); talk(z, L.T, 26.87, 28.1, 'sad'); hero(z);
  onBody(z, 10, .15, .06, 42, L.k, 8.6, null, 4.8); sh(ZW(0, 0, -8), 14); }, [[0, 'thump', .4], [.3, 'headset_off', .4]]);
// 26 «„Tut mir leid, wir haben nur GTA Fünf.“»: se encoge de hombros con una caja de GTA 5 en la mano
shot(28.1, 'F', null, L => { ladenS(L); const z = put(zock, ZOX + .4, 0, -9, .2); talk(z, L.T, 28.1, 29.28, 'sad'); actuar(z, 0, [[0, { aRx: 1.35, aRz: -.25, aRe: .25, aLx: .3, aLz: .5, aLe: 1.6, headZ: .12, sx: .05 }]], { T: L.T }); attach(GAME, z.aR.hand, [0, -.9, .4], [-1.2, 0, 0], 1.3); hero(z);
  const c = put(jonte, ZOX - .8, 0, -2.4, PI - .1); actuar(c, 0, [[0, 'idle']], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  cm([ZOX + 6.5, 7.6, -2.6, ZOX + .4, 5.2, -9, 42], [ZOX + 5.6, 7.3, -3.4, ZOX + .4, 5.2, -9, 40], L.k); sh(ZW(0, 0, -7), 14); }, [[0, 'flash', .3], [.2, 'plastic_box', .5], [.6, 'sad_trombone', .3]]);
// 27 «nur GTA Fünf.»: toda la estantería llena de cajas de GTA 5; un «5» rojo salta; el dependiente la presenta con los brazos
shot(29.28, 'W', 'punch', L => { ladenS(L); const z = put(zock, ZOX + 12.5, 0, 4, -2.3); actuar(z, 0, [[0, { aLx: 1.4, aLz: .6, aLe: .3, aRx: .4 }]], { T: L.T }); cara(z, L.T, { expr: 'happy', mouth: 'grin' }); hero(z);
  badge3('red', 'GTA 5', ZW(19, 15, -2), (L.lt - .1) / .2, 1.3);
  cm([ZOX + 4, 8.5, 6, ZOX + 19, 7.4, -2, 46], [ZOX + 6, 8.2, 5, ZOX + 19, 7.4, -2, 44], L.k); sh(ZW(14, 0, 0), 18); }, [[0, 'impact', .5], [.15, 'pop', .5]]);
// 28 «Ich hatte diethe Regel tho thatt.»: Jonte sale por la calle de mal humor y da una patada a una lata; carteles con TH alrededor
shot(30.33, 'S', null, L => { town(L); const sp = LT.HS[2].position; const bx = sp.x + 13, bz = sp.z; const c = put(jonte, 0, 0, 0, 0); walkTo(c, L, bx + 2, bz - 10, bx + 2.5, bz + 3); c.root.rotation.y = .05; actuar(c, L.lt, [[0, walkP(L.T, 0)], [.8, { lRx: -1.2, lRk: .2, aLx: -.4, aRx: .5, lean: -.08 }, { dur: .15 }], [1.05, walkP(L.T, 0), { dur: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'angry', mouth: 'frown' }); holdBag(c); hero(c);
  dust(V(bx + 2.3, 0, bz - 2), L.t0 + .85, L.T, 6, .4); crowdAt(L, bx + 6, bz - 4, 4, 7, 12, 31, { mode: 'talk', from: 14, gap: 1.6 });
  orb(L.k, V(bx + 2.2, 4.2, bz - 4), V(bx + 2.4, 4.2, bz + 1), [14, .65, .12, 44], [12.5, .55, .1, 44]); sh(V(bx + 2, 0, bz), 22); }, [[0, 'steps', .4], [.8, 'can_kick', .6], [1.1, 'grumble', .4]]);
// 29 «Aber dann fiel mir etwath Theltthameth auf.»: en el sofá de casa, Jonte ve las noticias y entorna los ojos
shot(31.78, 'R', null, L => { wohnS(L); TVC.getContext('2d') && drawNews(TVC.getContext('2d'), 640, 360, L.T); TVT.needsUpdate = true; sit(jonte, WZX, 1.6, 3.0, PI + .2, L, { aLx: .6, aRx: .6, aLe: 1.3, aRe: 1.3, headX: .08, lean: .1 + L.k * .12 }); cara(jonte, L.T, { expr: 'sus' }); hero(jonte);
  orbit(V(WZX, 4.4, 3), lerp(13, 10, L.k), PI + .55, .1, 42); sh(V(WZX, 0, 0), 16); }, [[0, 'whirl', .3], [.2, 'tv_news', .5], [1.2, 'hmm', .5]]);
// 30 «Unther Bürgermeithter war nie im Fernthehen.»: la tele de cerca: «LIVE: Rede des Bürgermeisters» y el atril vacío con un «?»
shot(33.82, 'Z', 'slow', L => { wohnS(L); drawNews(TVC.getContext('2d'), 640, 360, L.T); TVT.needsUpdate = true; sit(jonte, WZX, 1.6, 3.0, PI, L, { aLx: .6, aRx: .6, aLe: 1.3, aRe: 1.3 }); cara(jonte, L.T, { expr: 'sus' });
  cm([WZX, 5.2, 4, WZX, 4.6, -9.4, 46], [WZX, 4.8, -1, WZX, 4.6, -9.4, 44], L.k); sh(V(WZX, 0, -4), 14); DOF = 0; }, [[0, 'tv_static', .3], [.3, 'tv_news', .4]]);
// 31 «Er hielt theine Reden nur durch einen»: en la plaza del ayuntamiento, el robot gigante dorado da el discurso ante la multitud
shot(36.12, 'W', null, L => { platzS(L); RP.ROB.visible = true; RP.STG.visible = true; robotPose(RP.ROB, L.T, .7, 1); crowdAt(L, RPX, 12, 16, 6, 22, 41, { mode: i => ['clap', 'idle', 'talk', 'idle'][i % 4], face: RW(0, 20, -14), full: true }); hero();
  orb(L.k, RW(0, 18, -14), null, [70, .12, .2, 50], [62, .05, .18, 50]); sh(RW(0, 0, -6), 50); }, [[0, 'robot_voice', .6], [.2, 'crowd_murmur', .4], [.8, 'clap', .3]]);
// 32 «riethigen Roboter.»: contrapicado del robot: los ojos se encienden, levanta el brazo; altavoz del pecho vibrando
shot(37.42, 'C', 'punch', L => { platzS(L); RP.ROB.visible = true; RP.STG.visible = true; robotPose(RP.ROB, L.T, 1, 1); RP.ROB.userData.eyes.forEach(e => e.material.emissiveIntensity = 2.5 + Math.sin(L.T * 30) * 1.5);
  crowdAt(L, RPX, 6, 6, 5, 10, 43, { mode: 'shock', face: RW(0, 20, -14), from: 10, gap: 1.2 });
  cm([RPX + 6, 3, 14, RPX, 28, -14, 54], [RPX + 4, 2.6, 11, RPX, 29, -14, 52], L.k); sh(RW(0, 0, -10), 40); DOF = 0; }, [[0, 'robot_stomp', .7], [.2, 'servo', .5]]);
// 33 «Altho schlich ich mich nachtth»: de noche, Jonte cruza la plaza vacía a hurtadillas hacia el ayuntamiento
shot(38.49, 'F', null, L => { platzS(L, { night: true }); const c = put(jonte, 0, 0, 0, 0); walkTo(c, L, RPX - 8, 6, RPX - 3, -12); actuar(c, 0, [[0, { ...walkP(L.T * .7, 0), crouch: .25, lean: .3, aLx: .8, aLe: 1.4, aRx: .3, aRe: 1.2 }]], { T: L.T }); c.root.position.y = 0; cara(c, L.T, { expr: 'worried', eyes: 'side_l' }); holdBag(c); hero(c);
  const p = c.root.position; orbit(V(p.x, 4, p.z), lerp(15, 13, L.k), 2.2, .14, 46); sh(V(p.x, 0, p.z), 20); }, [[0, 'night_crickets', .5], [.2, 'sneak_steps', .5], [1.0, 'owl', .3]]);
// 34 «inth Rathauth.»: se cuela por la puerta entreabierta del ayuntamiento y mira atrás
shot(39.93, 'S', null, L => { platzS(L, { night: true }); const c = put(jonte, 0, 0, 0, 0); walkTo(c, L, RPX - 1, -22, RPX - .4, -29.6); c.root.position.y = lerp(1.6, 2.4, L.k); actuar(c, 0, [[0, { ...walkP(L.T * .7, 0), crouch: .2, lean: .25 }]], { T: L.T }); c.root.rotation.y = PI - .5; cara(c, L.T, { expr: 'worried', eyes: 'side_r', mouth: 'grimace' }); holdBag(c); hero(c);
  orb(L.k, RW(-.6, 5.5, -26), null, [14, .45, .08, 44], [12, .35, .08, 44]); sh(RW(0, 0, -26), 16); }, [[0, 'door_creak', .6], [.4, 'gulp', .4]]);
// 35 «Und wath ich dort fand, war unglaublich.»: en la sala, Jonte se asoma por el borde del telón; una luz dorada le ilumina la cara
shot(40.63, 'I', 'slow', L => { saalS(L); const c = put(jonte, SAX - 17, 0, 5.6, 2.6); actuar(c, 0, [[0, { aLx: 1.4, aLz: -.4, aLe: 1.2, aRx: .4, lean: .12, headY: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); holdBag(c); hero(c);
  FLASHL.intensity = 260; FLASHL.position.copy(SW(-8, 10, -2)); FLASHL.target.position.copy(SW(-16, 5, 6)); FLASHL.color.setRGB(1, .86, .5);
  cm([SAX - 11.5, 6.2, -2.5, SAX - 17, 5, 5.6, 42], [SAX - 12.5, 6, -.5, SAX - 17, 5, 5.6, 40], L.k); sh(SW(-15, 0, 4), 14); }, [[0, 'curtain_rustle', .5], [.4, 'heartbeat', .4]]);
// 36 «Hinter einem riethigen Vorhang»: el telón rojo se abre (desde detrás de Jonte) y aparece el alcalde en el atril
shot(42.9, 'R', null, L => { saalS(L); const k = easeInOut(clamp(L.lt / 1.3)); SA.TEL.userData.open(k * .9); const m = put(zisch, SAX, 0, -8.6, 0); actuar(m, 0, [[0, { aLx: .9, aRx: .9, aLe: 1.0, aRe: 1.0, headX: .15 }]], { T: L.T }); attach(SA.CARD, m.aR.hand, [0, -.7, .5], [-1.0, 0, 0], .9); SA.CARD.userData.draw('a', (c, w, h) => { txt(c, 'SÜSSE SAHNESOSSE', w / 2, 70, 34, '#1a1a6a'); txt(c, 'SUPER STARKE SPAGHETTI', w / 2, 124, 28, '#1a1a6a'); txt(c, 'SIEBEN SAURE...', w / 2, 178, 30, '#1a1a6a'); }); cara(m, L.T, { expr: 'neutral' }); hero(m);
  const c = put(jonte, SAX - 4, 0, 11, PI + .2); actuar(c, 0, [[0, { aLx: .6, aLe: 1.2, crouch: .1, lean: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'shock' }); holdBag(c);
  cm([SAX - 6, 7, 22, SAX, 6.5, -8, 46], [SAX - 4.5, 6.8, 18, SAX, 6.5, -8, 44], L.k); sh(SW(0, 0, -2), 22); }, [[0, 'curtain_open', .7], [.6, 'whoosh_soft', .3]]);
// 37 «übte der Bürgermeithter theine Rede.»: el alcalde, de frente, carraspea y ensaya mirando sus fichas
shot(44.64, 'W', null, L => { saalS(L); SA.TEL.userData.open(.9); const m = put(zisch, SAX, 0, -8.6, 0); actuar(m, 0, [[0, { aRx: 1.0, aRe: 1.2, aLx: .7, aLz: -.2, aLe: 1.6, headX: .1 + Math.sin(L.T * 3) * .05 }]], { T: L.T }); attach(SA.CARD, m.aR.hand, [0, -.7, .5], [-1.0, 0, 0], .9); SA.CARD.userData.draw('a', (c, w, h) => { txt(c, 'SÜSSE SAHNESOSSE', w / 2, 70, 34, '#1a1a6a'); txt(c, 'SUPER STARKE SPAGHETTI', w / 2, 124, 28, '#1a1a6a'); txt(c, 'SIEBEN SAURE...', w / 2, 178, 30, '#1a1a6a'); });
  cara(m, L.T, { expr: 'neutral', mouth: L.lt < .6 ? 'o' : 'flat' }); hero(m); onBody(m, 13, 0, .06, 40, L.k, 11, .15, 5.4); sh(SW(0, 0, -7), 14); }, [[0, 'throat_clear', .6], [.7, 'paper', .5]]);
// ---------- c: el ensayo, la grabación, las pantallas y la protesta (46,10 – 74,58 s) ----------
const cardText = (lines, col = '#1a1a6a') => (c, w, h) => lines.forEach((t, i) => txt(c, t, w / 2, 70 + i * 54, Math.min(36, 640 / t.length), i === 0 ? '#c8202a' : col));
function rehearse(L, lines, key, pose) { saalS(L); SA.TEL.userData.open(.9); const m = put(zisch, SAX, 0, -8.6, 0); actuar(m, 0, [[0, pose]], { T: L.T }); attach(SA.CARD, m.aR.hand, [0, -.7, .5], [-1.0, 0, 0], .9); SA.CARD.userData.draw(key, cardText(lines)); hero(m); return m; }
// 38 «„Thüthe Thahnethothe.»: primer plano del alcalde ceceando con orgullo; salen gotitas de saliva
shot(46.1, 'C', 'punch', L => { const m = rehearse(L, ['SÜSSE SAHNESOSSE'], 'b1', { aRx: 1.1, aRe: 1.2, aLx: 1.2, aLz: -.3, aLe: 1.3, headX: -.05, lean: -.04 }); talk(m, L.T, 46.1, 47.35, 'smug'); spit(m, L.T, 46.1, 12);
  onFace(m, 5.6, .2, .7, 40, L.k, 4.8); sh(SW(0, 0, -8), 12); }, [[0, 'impact_soft', .4], [.2, 'spit', .5], [.7, 'spit', .4]]);
// 39 «Thuper thtarke Thpaghetti.»: saca músculo con el brazo libre (bíceps) mientras lee la ficha
shot(47.35, 'S', null, L => { const j = Math.abs(Math.sin(L.T * 6)); const m = rehearse(L, ['SUPER STARKE', 'SPAGHETTI'], 'b2', { aRx: 1.1, aRe: 1.2, aLx: 1.6, aLz: .9, aLe: 2.2 + j * .2, lean: -.06 }); talk(m, L.T, 47.35, 48.79, 'smug'); spit(m, L.T, 47.35, 10);
  onBody(m, 12, -.5, .08, 40, L.k, 10.5, -.4, 5.6); sh(SW(0, 0, -8), 12); }, [[0, 'whoosh_soft', .3], [.2, 'flex', .5], [.8, 'spit', .4]]);
// 40 «Thieben thaure Thalatgurken.“»: muy de cerca, con un «7» que salta y una lluvia de saliva
shot(48.79, 'Z', null, L => { const m = rehearse(L, ['SIEBEN SAURE', 'SALATGURKEN'], 'b3', { aRx: 1.1, aRe: 1.2, aLx: .8, aLz: -.6, aLe: 1.0, headX: -.08 }); talk(m, L.T, 48.79, 50.31, 'smug'); spit(m, L.T, 48.79, 14);
  badge3('gold', '7', hp(m).add(V(-3, 3.2, 0)), (L.lt - .1) / .2, 1.3); onFace(m, 5, .2, -.6, 38, L.k, 4.3); sh(SW(0, 0, -8), 12); }, [[0, 'spit', .5], [.1, 'pop', .5], [.7, 'spit', .5]]);
// 41 «Er konnte dath S nicht auththprechen.»: Jonte detrás del telón se tapa la boca para no reírse; zoom lento
shot(50.31, 'I', 'slow', L => { saalS(L); SA.TEL.userData.open(.9); const c = put(jonte, SAX - 10.6, 0, 6, 2.5); actuar(c, 0, [[0, { aRx: 2.1, aRz: -.5, aRe: 2.0, aLx: .6, aLe: 1.4, lean: .08 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); holdBag(c); hero(c);
  FLASHL.intensity = 220; FLASHL.position.copy(SW(-4, 12, -4)); FLASHL.target.position.copy(SW(-10, 5, 6)); onFace(c, 6.6, 0, .4, 40, L.k, 5); sh(SW(-10, 0, 6), 12); }, [[0, 'gasp', .5], [.5, 'heartbeat', .4]]);
// 42 «Dethhalb hatte er eth verboten.»: el alcalde ante el espejo intenta decir «S», le sale «TH» y arruga la ficha, furioso
shot(52.06, 'W', null, L => { saalS(L); const m = put(zisch, SAX - 8.2, 0, -5.6, PI + .55); talk(m, L.T, 52.06, 53.62, 'angry'); const j = Math.sin(L.T * 9); actuar(m, 0, [[0, { aRx: .8, aRz: -.3, aRe: 1.2 + j * .1, aLx: .8, aLz: .3, aLe: 1.2, lean: .1 }]], { T: L.T }); hero(m);
  bubble(m, 'THHH…', (L.lt - .15) / .2); orbit(SW(-9, 6.4, -7), lerp(16, 14, L.k), -1.6, .1, 42); sh(SW(-10, 0, -8), 14); }, [[0, 'paper_crumple', .6], [.5, 'grumble', .5]]);
// 43 «Alle thollten tho klingen wie er.»: el alcalde en la ventana, sonrisa malvada, mirando el pueblo dormido
shot(53.62, 'F', null, L => { saalS(L); const m = put(zisch, SAX + 12.5, 0, -12.6, -.55); actuar(m, 0, [[0, { aLx: .5, aRx: .5, aLz: -.5, aRz: -.5, aLe: 1.5, aRe: 1.5, headY: -.2 }]], { T: L.T }); talk(m, L.T, 53.62, 55.03, 'smug'); hero(m);
  onBody(m, 12, .15, .12, 44, L.k, 10.5, null, 5.2); sh(SW(12, 0, -12), 12); }, [[0, 'evil_laugh', .5], [.4, 'clock_tick', .3]]);
// 44 «Schnell nahm ich alleth mit meinem Handy auf.»: por encima del hombro de Jonte, el móvil grabando al alcalde en el atril
shot(55.03, 'C', null, L => { saalS(L); SA.TEL.userData.open(.9); const m = put(zisch, SAX, 0, -8.6, 0); actuar(m, 0, [[0, { aRx: 1.1, aRe: 1.2, aLx: 1.2, aLz: -.3, aLe: 1.3 }]], { T: L.T }); talk(m, L.T, 55.03, 56.33, 'smug'); attach(SA.CARD, m.aR.hand, [0, -.7, .5], [-1.0, 0, 0], .9);
  const c = put(jonte, SAX - 3, 0, 9, PI + .3); actuar(c, 0, [[0, { aRx: 2.0, aRz: .2, aRe: 1.2, crouch: .1 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.7, .5], [-.3, 0, 0], 1.4); PHONE.userData.draw((cc, w, h) => drawPhoneRec(cc, w, h, L.T)); cara(c, L.T, { expr: 'determined' }); hero(c);
  const ph = wpos(PHONE); cm([ph.x - 2.6, ph.y + 1.8, ph.z + 4.6, ph.x + .4, ph.y + .1, ph.z - 2, 42], [ph.x - 2.2, ph.y + 1.5, ph.z + 3.8, ph.x + .4, ph.y + .1, ph.z - 2, 40], L.k); sh(SW(-2, 0, 4), 14); DOF = 0; }, [[0, 'rec_beep', .6], [.3, 'camera_click', .4]]);
// 45 «meinem Handy auf.»: la cara de Jonte iluminada por el móvil, con sonrisa pícara
shot(56.33, 'S', null, L => { saalS(L); SA.TEL.userData.open(.9); const c = put(jonte, SAX - 3, 0, 9, PI + .3); actuar(c, 0, [[0, { aRx: 2.0, aRz: .2, aRe: 1.2, crouch: .1 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.7, .5], [-.3, 0, 0], 1.4); PHONE.userData.draw((cc, w, h) => drawPhoneRec(cc, w, h, L.T)); cara(c, L.T, { expr: 'smug', mouth: 'grin' }); hero(c);
  FLASHL.intensity = 120; FLASHL.position.copy(wpos(PHONE)); FLASHL.target.position.copy(hp(c)); onFace(c, 6, -.4, .9, 40, L.k, 5.2); sh(SW(-3, 0, 9), 10); }, [[0, 'whoosh_soft', .3], [.3, 'snicker', .5]]);
// 46 «Am nächthten Morgen thpielte ich die Aufnahme»: por la mañana, Jonte enchufa el móvil a la caja de la pantalla gigante de la plaza
shot(57.25, 'W', null, L => { town(L); DSCR[0].visible = true; DSCR[0].userData.draw('off', (c, w, h) => { c.fillStyle = '#101018'; c.fillRect(0, 0, w, h); c.fillStyle = '#3a3a4a'; c.font = `700 40px ${FONT}`; c.textAlign = 'center'; c.fillText('ZISCHELBACH TV', w / 2, h / 2); });
  const sp = DSCR[0].position; const c = put(jonte, sp.x + 3, 0, sp.z + 3.5, PI + .9); actuar(c, 0, [[0, { aRx: 1.3, aRe: .4, crouch: .2, lean: .25, aLx: .6, aLe: 1 }]], { T: L.T }); attach(PHONE, c.aR.hand, [0, -.7, .5], [-.8, 0, 0], 1.1); PHONE.userData.draw((cc, w, h) => drawPhoneRec(cc, w, h, L.T)); cara(c, L.T, { expr: 'determined', mouth: 'grin' }); hero(c);
  crowdAt(L, sp.x + 8, sp.z + 14, 5, 6, 12, 51, { mode: 'walk', gap: 1.4 }); onBody(c, 12, -.7, .14, 44, L.k, 10.5, -.55, 3.2); sh(V(sp.x, 0, sp.z + 4), 16); }, [[0, 'birds', .4], [.2, 'cable_plug', .6], [.8, 'power_on', .5]]);
// 47 «auf jedem Riethenbildschirm»: la pantalla gigante se enciende con el alcalde ceceando; la gente se gira
shot(58.61, 'Z', 'punch', L => { town(L); const s = DSCR[0]; s.visible = true; s.userData.draw('v' + Math.floor(L.T * 15), (c, w, h) => drawMayorVid(c, w, h, L.T)); const sp = s.position;
  crowdAt(L, sp.x + 8, sp.z + 22, 9, 5, 12, 53, { mode: i => ['point', 'shock', 'laugh'][i % 3], face: V(sp.x, 12, sp.z), full: true, gap: 1.2 });
  cm([sp.x + 20, 6, sp.z + 40, sp.x, 12.5, sp.z, 48], [sp.x + 16, 7, sp.z + 33, sp.x, 12.8, sp.z, 46], L.k); sh(V(sp.x + 6, 0, sp.z + 16), 30); }, [[0, 'tv_on', .6], [.2, 'mayor_lisp_fx', .4], [.6, 'crowd_gasp', .4]]);
// 48 «der Thtadt ab.»: grúa sobre la plaza del ayuntamiento: las dos pantallas gigantes con el vídeo; multitud
shot(59.95, 'S', null, L => { platzS(L); RP.SCR.forEach((s, i) => { s.visible = true; s.userData.draw('v' + Math.floor(L.T * 15), (c, w, h) => drawMayorVid(c, w, h, L.T + i, i ? 'THUPER THTARKE THPAGHETTI!' : 'THÜTHE THAHNETHOTHE!')); });
  crowdAt(L, RPX, 14, 16, 4, 24, 55, { mode: i => ['point', 'laugh', 'shock', 'laugh'][i % 4], face: RW(0, 12, -4), full: true });
  cm([RPX - 4, 12, 40, RPX - 27, 12, 2, 50], [RPX - 6, 12.5, 35, RPX - 27, 12.6, 2, 48], L.k); sh(RW(-14, 0, 14), 40); }, [[0, 'whoosh_down', .4], [.2, 'crowd_laugh', .5]]);
// 49 «Die ganze Thtadt drehte durch.»: en la calle la gente se parte de risa señalando la pantalla, uno se tira al suelo
shot(61.14, 'F', null, L => { town(L); const s = DSCR[1]; s.visible = true; s.userData.draw('v' + Math.floor(L.T * 15), (c, w, h) => drawMayorVid(c, w, h, L.T, 'THIEBEN THAURE THALATGURKEN!')); const sp = s.position; const cx = sp.x - 6, cz = sp.z + 17; const fs = V(sp.x, 6, sp.z);
  const a = put(EX[12], cx - 1.5, 0, cz, 0); a.root.rotation.y = Math.atan2(fs.x - a.root.position.x, fs.z - a.root.position.z) + .5; actuar(a, 0, [[0, { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.6, aRe: 1.6, lean: .35 + Math.abs(Math.sin(L.T * 9)) * .1, crouch: .2 }]], { T: L.T }); laughF(a, L.T); tears(a, L.T);
  const b = put(EX[13], cx + 2, 0, cz + 1.5, 0); b.root.rotation.y = Math.atan2(fs.x - b.root.position.x, fs.z - b.root.position.z) + .2; actuar(b, 0, [[0, 'point']], { T: L.T }); laughF(b, L.T + 1); hero(a, b);
  crowdAt(L, cx, cz + 2, 7, 4, 10, 57, { mode: i => ['laugh', 'point', 'laugh', 'clap'][i % 4], face: fs, from: 14, avoid: [[cx - 1.5, cz], [cx + 2, cz + 1.5]] });
  orbit(V(cx, 4.4, cz), lerp(16, 13.5, L.k), Math.atan2(fs.x - cx, fs.z - cz) - .2, .12, 46); sh(V(cx, 0, cz), 20); }, [[0, 'crowd_laugh', .6], [.5, 'laugh_man', .5], [1.2, 'clap', .4]]);
// 50 «Die Leute verthammelten thich vor dem Rathauth»: vista amplia: multitud con pancartas ante el ayuntamiento
shot(62.83, 'W', null, L => { platzS(L); crowdAt(L, RPX, -6, 22, 3, 20, 61, { mode: i => i % 3 === 0 ? 'sign' : i % 3 === 1 ? 'shout' : 'idle', face: RW(0, 15, -31), full: true, expr: 'angry' });
  cm([RPX - 18, 14, 44, RPX, 10, -24, 50], [RPX - 14, 16, 38, RPX, 11, -24, 48], L.k); sh(RW(0, 0, -6), 44); }, [[0, 'crowd_chant', .6], [.5, 'whistle', .4]]);
// 51 «und forderten, dath Verbot aufzuheben.»: de cerca, vecinos coreando con las pancartas «WIR WOLLEN DAS S!»
shot(64.51, 'C', null, L => { platzS(L); const P = [[-3, 4], [2.5, 3.6], [-.2, 7.6], [5.5, 7], [-6, 7.4]]; P.forEach(([x, z], i) => { const c = put(EX[15 + i], RPX + x, 0, z, PI + Math.sin(i * 2) * .25); crowdGuy(c, RPX + x, z, L, i, { mode: 'sign', ry: PI + Math.sin(i * 2) * .25 }); }); hero(EX[15], EX[16]);
  orbit(RW(0, 6, 5), lerp(17, 14, L.k), PI - .15, .12, 44); sh(RW(0, 0, 5), 18); }, [[0, 'crowd_chant', .7], [.6, 'stomp', .4]]);
// 52 «Endlich kam der Bürgermeithter herauth.»: se abre la puerta del balcón y sale el alcalde, serio; zoom lento
shot(66.49, 'Z', 'slow', L => { platzS(L); const m = put(zisch, 0, 0, 0, 0); const k = easeOut(clamp(L.lt / 1.2)); m.root.position.set(RPX, 15.4, lerp(-31.6, -28.2, k)); m.root.rotation.y = 0; actuar(m, 0, [[0, k < 1 ? walkP(L.T, 0) : { aLx: .6, aRx: .6, aLe: .4, aRe: .4 }]], { T: L.T }); cara(m, L.T, { expr: 'angry', mouth: 'frown' }); hero(m);
  crowdAt(L, RPX, -6, 14, 4, 16, 63, { mode: 'sign', face: RW(0, 15, -31), full: true });
  orbit(RW(0, 19, -28), lerp(30, 22, L.k), 0, .08, 44); sh(RW(0, 15, -28), 20); }, [[0, 'balcony_door', .6], [.3, 'crowd_boo', .4]]);
// 53 «„Na gut.»: primer plano del alcalde, enfurruñado, con los brazos cruzados
shot(68.46, 'C', 'punch', L => { platzS(L); const m = put(zisch, RPX, 15.4, -28.2, 0); actuar(m, 0, [[0, 'cross']], { T: L.T }); talk(m, L.T, 68.46, 69.17, 'angry'); hero(m); onFace(m, 5.6, -.2, .5, 40, L.k, 5); sh(RW(0, 15, -28), 10); }, [[0, 'impact_soft', .4], [.2, 'grumble', .5]]);
// 54 «Dath S itht wieder erlaubt.“»: en el pórtico de la carretera, la barra roja de la señal se suelta y cae; «ERLAUBT!» en verde
shot(69.17, 'F', null, L => { town(L); const S = GAN.userData.sign; const k = clamp((L.lt - .25) / .7); S.userData.bar.visible = k < .02; if (k >= .02) { const b = FALLBAN; b.visible = true; b.position.set(0, 9.6 - k * k * 9, 36.6 + k * 1.5); b.rotation.set(k * 3, 0, -.785 + k * 4); b.scale.setScalar(1); b.children.forEach(o => o.visible = o === b.userData.bar); }
  crowdAt(L, 0, 26, 8, 6, 12, 65, { mode: 'cheer', face: V(0, 10, 36), gap: 1.2 }); badge('green', 'ERLAUBT!', W / 2, H * .2, (L.lt - .5) / .25, 1, 1.1);
  cm([2, 7, 58, 0, 9, 36, 40], [1, 7.6, 54, 0, 9, 36, 38], L.k); sh(V(0, 0, 36), 26); }, [[0, 'metal_clang', .6], [.5, 'fall_whistle', .4], [.9, 'ding', .5]]);
// 55 «Alle jubelten.»: la multitud salta de alegría con confeti ante el ayuntamiento
shot(70.68, 'S', null, L => { platzS(L); crowdAt(L, RPX, 2, 20, 3, 18, 67, { mode: i => i % 3 ? 'cheer' : 'sign', face: RW(0, 15, -31), full: true }); confRain(RW(0, 0, 6), L.T, 70, 30, 24, 18);
  cm([RPX + 4, 9, 34, RPX, 7, 0, 50], [RPX + 2, 10, 30, RPX, 7.5, 0, 48], L.k); sh(RW(0, 0, 4), 34); }, [[0, 'crowd_cheer', .7], [.1, 'confetti_pop', .5]]);
// 56 «Endlich konnte ich wieder laut sagen:»: Jonte entre la gente coge aire hinchando el pecho, ojos cerrados
shot(71.65, 'W', null, L => { platzS(L); const c = put(jonte, RPX + 1, 0, 2, -.15); const k = easeInOut(L.k); actuar(c, 0, [[0, { aLx: lerp(.3, -.6, k), aRx: lerp(.3, -.6, k), aLz: .3, aRz: -.3, lean: lerp(0, -.18, k), headX: lerp(0, -.2, k) }]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'closed', mouth: k > .5 ? 'o' : 'smile' }); holdBag(c); hero(c);
  crowdAt(L, RPX + 1, -2, 10, 5, 11, 69, { mode: 'cheer', gap: 1.7, avoid: [[RPX + 1, 2]] }); confRain(RW(1, 0, 2), L.T, 40, 18, 14, 14);
  onBody(c, 11, 0, .1, 42, L.k, 9, null, 3.6); sh(RW(1, 0, 2), 16); }, [[0, 'inhale', .7], [.6, 'crowd_cheer', .3]]);
// 57 «„GTA Sechs!“»: Jonte grita con los puños arriba; «GTA 6!» dorado gigante; explota el confeti
shot(73.42, 'C', 'punch', L => { platzS(L); const c = put(jonte, RPX + 1, 0, 2, -.15); const j = Math.abs(Math.sin(L.T * 8)); c.root.position.y = j * .5; actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .4, aRz: .4, aLe: .4, aRe: .4, headX: -.15, crouch: .05 }]], { T: L.T }); talk(c, L.T, 73.42, 74.58, 'joy'); hero(c);
  crowdAt(L, RPX + 1, -2, 10, 5, 11, 71, { mode: 'cheer', gap: 1.7, avoid: [[RPX + 1, 2]] }); confetti(RW(1, 3, 2), L.t0, L.T, 80, 1.3); badge('gold', 'GTA 6!', W / 2, H * .2, (L.lt - .05) / .2, 1, 1.25);
  onBody(c, 10, .1, .14, 44, L.k, 8.6, null, 3.8); sh(RW(1, 0, 2), 16); }, [[0, 'impact', .6], [.05, 'confetti_pop', .7], [.1, 'crowd_cheer', .6]]);
// ---------- d: el giro final: R y L prohibidas (74,58 – 95,9 s) ----------
const balcony = (L, o = {}) => { const m = put(zisch, RPX + (o.x ?? 0), 15.4, -28.2, o.ry ?? 0); return m; };
// 58 «Aber dann lächelte der Bürgermeister.»: el alcalde sonríe despacio, de lado; zoom lento con viñeta
shot(74.58, 'I', 'slow', L => { platzS(L); const m = balcony(L); actuar(m, 0, [[0, { aLx: .4, aRx: .4, aLz: -.4, aRz: -.4, aLe: 1.5, aRe: 1.5, headX: .08 }]], { T: L.T }); cara(m, L.T, { expr: 'smug', eyes: L.k > .4 ? 'squint' : 'half', mouth: L.k > .35 ? 'smirk' : 'flat' }); hero(m);
  onFace(m, 6.2, -.2, -.9, 40, L.k, 4.6); sh(RW(0, 15, -28), 10); }, [[0, 'music_stop', .4], [.4, 'evil_chime', .4]]);
// 59 «„Allerdings:»: levanta el índice, triunfal
shot(76.55, 'C', 'punch', L => { platzS(L); const m = balcony(L); actuar(m, 0, [[0, { aRx: 2.8, aRz: -.15, aRe: .1, aLx: .4, aLz: -.3, aLe: 1.4, lean: -.04 }]], { T: L.T }); talk(m, L.T, 76.55, 77.41, 'smug'); hero(m);
  onBody(m, 11, .2, .02, 40, L.k, 9.5, null, 4.6); sh(RW(0, 15, -28), 10); }, [[0, 'impact', .5], [.1, 'ding', .4]]);
// 60 «Ab morgen sind R»: en la barandilla del balcón aparece de golpe la señal de la «R» prohibida
shot(77.41, 'F', null, L => { platzS(L); RP.BANS.visible = true; const [r, l] = RP.BANS.children; r.scale.setScalar(spring(clamp(L.lt / .3) * 1.4)); l.scale.setScalar(.001); const m = balcony(L); actuar(m, 0, [[0, 'point_l']], { T: L.T }); talk(m, L.T, 77.41, 78.43, 'smug'); hero(m);
  cm([RPX - 3, 17, -10, RPX - 2.5, 20.5, -27, 44], [RPX - 3.2, 18, -13, RPX - 2.5, 20.8, -27, 42], L.k); sh(RW(0, 15, -27), 14); }, [[0, 'pop', .6], [.1, 'stamp', .6]]);
// 61 «und L verboten.“»: la «L» también; los dos carteles junto al alcalde que se frota las manos
shot(78.43, 'C', null, L => { platzS(L); RP.BANS.visible = true; const [r, l] = RP.BANS.children; r.scale.setScalar(1); l.scale.setScalar(spring(clamp(L.lt / .3) * 1.4)); const m = balcony(L); const j = Math.sin(L.T * 14); actuar(m, 0, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.5 - j * .1, aRz: -.5 + j * .1, aLe: 1.5, aRe: 1.5 }]], { T: L.T }); talk(m, L.T, 78.43, 79.91, 'smug'); hero(m);
  crowdAt(L, RPX, -10, 8, 3, 10, 73, { mode: 'shock', face: RW(0, 15, -31), full: true });
  orbit(RW(0, 18.5, -27), lerp(26, 22, L.k), .12, .02, 44); sh(RW(0, 15, -27), 16); }, [[0, 'pop', .6], [.1, 'stamp', .6], [.5, 'evil_laugh', .4]]);
// 62 «Die ganze Menge wuwde stiww.»: la plaza en silencio; nadie se mueve; una bola de papel rueda; hojas al viento
shot(79.91, 'S', null, L => { platzS(L); RP.BANS.visible = true; crowdAt(L, RPX, 4, 20, 3, 16, 75, { mode: 'silent', face: RW(0, 15, -31), full: true }); dust(RW(-6, 0, -4), L.t0, L.T, 6, .3);
  cm([RPX + 6, 10, -20, RPX, 4.5, 6, 50], [RPX + 5, 10.4, -18, RPX, 4.6, 6, 48], L.k); sh(RW(0, 0, 4), 34); grade.uniforms.sat.value = .9; }, [[0, 'wind', .6], [.6, 'crickets', .5]]);
// 63 «Dann wief ein Powizist:»: un policía levanta el megáfono entre la gente
shot(81.33, 'W', null, L => { platzS(L); RP.BANS.visible = true; const c = put(COPS[3], RPX - 6, 0, 4, .4); actuar(c, 0, [[0, { aRx: 1.7, aRz: -.2, aRe: 1.5, aLx: .3 }]], { T: L.T }); attach(MEGA, c.aR.hand, [0, -.7, .6], [-.2, 0, 0], 1.0); cara(c, L.T, { expr: 'determined', mouth: 'flat' }); hero(c);
  crowdAt(L, RPX - 6, 0, 8, 5, 11, 77, { mode: 'silent', gap: 1.8, avoid: [[RPX - 6, 4]] });
  onBody(c, 12, .3, .1, 42, L.k, 10, .2, 4.6); sh(RW(-6, 0, 4), 14); }, [[0, 'megaphone_on', .6]]);
// 64 «„Awwe bweiben wuhig!“»: primer plano del policía gritando por el megáfono
shot(82.94, 'Z', 'punch', L => { platzS(L); const c = put(COPS[3], RPX - 6, 0, 4, .4); actuar(c, 0, [[0, { aRx: 1.7, aRz: -.2, aRe: 1.5, aLx: .3, lean: .08 }]], { T: L.T }); attach(MEGA, c.aR.hand, [0, -.7, .6], [-.2, 0, 0], 1.0); talk(c, L.T, 82.94, 84.23, 'angry'); hero(c);
  onFace(c, 6.4, .2, -1.4, 40, L.k, 5.4); sh(RW(-6, 0, 4), 10); }, [[0, 'megaphone_buzz', .5], [.3, 'impact_soft', .3]]);
// 65 «Ein Mann schwie:»: el hombre de la camisa rosa grita con las manos en la cabeza; detrás echa humo su deportivo plateado
shot(84.23, 'C', null, L => { platzS(L); const m = put(pmann, RPX + 14, 0, 10, -.5); actuar(m, 0, [[0, 'hands_head']], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'scream' }); hero(m); show(PORSCHE, RPX + 20, 0, 2, -.6); smoke(RW(21.5, 2.5, -1.5), L.T, 20, true);
  orbit(RW(16, 5, 7), lerp(17, 15, L.k), -.25, .12, 44); sh(RW(17, 0, 6), 18); }, [[0, 'car_alarm', .6], [.2, 'scream_man', .5], [.4, 'fire_crackle', .4]]);
// 66 «„Mein Powsche bwennt!“»: el deportivo con fuego y humo; él salta de desesperación; matrícula «Z-PS 911»
shot(85.05, 'F', null, L => { platzS(L); const m = put(pmann, RPX + 14, 0, 12, -.2); const j = Math.abs(Math.sin(L.T * 9)); m.root.position.y = j * .5; actuar(m, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .5, aRz: .5, aLe: .6, aRe: .6, headX: -.15 }]], { T: L.T }); talk(m, L.T, 85.05, 86.31, 'shock'); hero(m);
  show(PORSCHE, RPX + 20, 0, 2, -.6); smoke(RW(21.5, 2.5, -1.5), L.T, 26, true);
  cm([RPX + 6, 6, 26, RPX + 18, 4, 3, 46], [RPX + 8, 6.5, 23, RPX + 18, 4, 3, 44], L.k); sh(RW(18, 0, 5), 20); }, [[0, 'fire_whoosh', .6], [.3, 'car_alarm', .5]]);
// 67 «Und meine Wehwewin wief:»: la profesora Kessler, entre la gente, grita haciendo bocina con las manos
shot(86.31, 'W', null, L => { platzS(L); const t = put(kess, RPX - 10, 0, 12, .5); actuar(t, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: -.6, aRz: -.6, aLe: 1.9, aRe: 1.9, lean: .1 }]], { T: L.T }); cara(t, L.T, { expr: 'angry', mouth: 'talk_wide' }); hero(t);
  KIDS.slice(0, 5).forEach((k, i) => { const x = RPX - 14 + i * 2.6, z = 18 + (i % 2) * 2; put(k, x, 0, z, PI - .3); crowdGuy(k, x, z, L, i, { mode: 'silent', ry: PI - .3 }); });
  onBody(t, 11, .2, .1, 42, L.k, 9.4, null, 4.4); sh(RW(-10, 0, 12), 14); }, [[0, 'whistle', .5]]);
// 68 «„Kindew, awwe ins Kwassenzimmew!“»: los niños salen corriendo hacia el colegio mientras ella los empuja
shot(87.68, 'S', null, L => { platzS(L); const t = put(kess, 0, 0, 0, 0); walkTo(t, L, RPX - 10, 12, RPX - 6, 22); actuar(t, 0, [[0, { ...walkP(L.T, 0), aRx: 1.6, aRe: .3 }]], { T: L.T }); talk(t, L.T, 87.68, 89.59, 'angry'); hero(t);
  KIDS.slice(0, 6).forEach((k, i) => { put(k, 0, 0, 0, 0); walkTo(k, L, RPX - 13 + i * 2.4, 16 + (i % 2) * 2, RPX - 9 + i * 2.4, 34 + (i % 2) * 2, i, true); cara(k, L.T + i, { expr: 'shock', mouth: 'o' }); });
  orb(L.k, RW(-7, 4, 20), RW(-5, 4, 26), [22, 1.3, .14, 46], [20, 1.1, .14, 46]); sh(RW(-6, 0, 24), 22); }, [[0, 'run_steps', .6], [.3, 'kids_scream', .4]]);
// 69 «Ich sah den Büwgewmeistew an.»: Jonte se gira despacio hacia el balcón, furioso
shot(89.59, 'R', null, L => { platzS(L); RP.BANS.visible = true; const c = put(jonte, RPX + 1, 0, 2, lerp(.8, PI, easeInOut(clamp(L.lt / .9)))); actuar(c, 0, [[0, { aLx: .2, aRx: .2, aLz: .3, aRz: -.3, headX: -.25, sx: .05 }]], { T: L.T }); cara(c, L.T, { expr: 'angry', mouth: 'frown' }); holdBag(c); hero(c);
  crowdAt(L, RPX + 1, 8, 8, 5, 10, 79, { mode: 'silent', gap: 1.9, avoid: [[RPX + 1, 2]] });
  cm([RPX - 3, 5.4, -6.5, RPX + 1, 5.2, 2, 44], [RPX - 2, 5.3, -5, RPX + 1, 5.3, 2, 42], L.k); sh(RW(1, 0, 2), 14); }, [[0, 'whoosh_soft', .3], [.5, 'heartbeat', .4]]);
// 70 «„Das ist doch nicht dein Ewnst!“»: Jonte, de frente y desde abajo, grita con los brazos abiertos hacia el balcón
shot(91.2, 'C', 'punch', L => { platzS(L); const c = put(jonte, RPX + 1, 0, 2, PI); actuar(c, 0, [[0, { aLx: 1.0, aRx: 1.0, aLz: .9, aRz: .9, aLe: .5, aRe: .5, headX: -.15 }]], { T: L.T }); talk(c, L.T, 91.2, 92.53, 'angry'); hero(c);
  onFace(c, 6.4, .6, .3, 42, L.k, 5.4); sh(RW(1, 0, 2), 12); }, [[0, 'impact', .5], [.2, 'gasp', .3]]);
// 71 «Und ew wächewte.»: el alcalde sonríe con una sonrisa enorme; zoom lento con viñeta
shot(92.53, 'I', 'slow', L => { platzS(L); RP.BANS.visible = true; const m = balcony(L); actuar(m, 0, [[0, { aLx: .4, aRx: .4, aLz: -.4, aRz: -.4, aLe: 1.5, aRe: 1.5, headZ: .12 }]], { T: L.T }); cara(m, L.T, { expr: 'smug', eyes: 'squint', mouth: 'grin' }); hero(m);
  onFace(m, 6, -.2, .5, 40, L.k, 4.4); sh(RW(0, 15, -28), 10); }, [[0, 'evil_chime', .5]]);
// 72 «Sehw witzig, odew?»: guiña un ojo y se encoge de hombros; la cámara se aleja y se ven las dos señales R y L sobre la plaza callada
shot(93.67, 'Z', null, L => { platzS(L); RP.BANS.visible = true; const m = balcony(L); actuar(m, 0, [[0, L.lt < .8 ? 'shrug' : { aRx: 2.4, aRz: .4, aRe: .3, aLx: .4 }]], { T: L.T }); talk(m, L.T, 93.67, 94.85, 'smug'); if (L.lt > .35 && L.lt < .7) cara(m, L.T, { expr: 'smug', eyes: 'wink', mouth: 'grin' }); hero(m);
  crowdAt(L, RPX, -6, 12, 4, 14, 81, { mode: 'silent', face: RW(0, 15, -31), full: true });
  orbit(RW(0, 18, -28), lerp(16, 36, easeInOut(L.k)), .05, .04, 44); sh(RW(0, 15, -24), 26); }, [[0, 'wink_ding', .5], [.9, 'trombone_wah', .4]]);


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

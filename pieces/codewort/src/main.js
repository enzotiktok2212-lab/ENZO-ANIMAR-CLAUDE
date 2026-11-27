// CODEWORT — «In dieser Stadt hat jede Familie ein geheimes Wort.»
// Mats (12) y su hermana Ida (7) esperan a Mama en su casa de madera al borde del bosque; a las 18:10 llaman a la puerta con la voz de Mama…
// Motor: el de statue / schlafwandler / schluck / frauenstadt (luz realista, AO, supermuestreo) + mirilla con ojo de pez y pantalla partida.
// Planos en src/p/*.js; armar.py los une en src/index.js.
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { klasse } from './svsets.js';
import { kinderzimmer, kueche } from './swelt.js';
import { handy } from './stwelt.js';
import { siedlung, haus, kammer, buero, hafen, kuscheltier, torte, maske, golf, herbstbaum, halo, glowM } from './cwelt.js';
import { makeMats, makeIda, makeMama, makeMamaB, makePapa, makeKessler, makePohl, makeBrandt, makeKid, makeCaller } from './cvolk.js';
import { makeExtra } from './ecast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 225.6, U = W / 720, PI = Math.PI;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const SPL = document.createElement('canvas'); SPL.width = W; SPL.height = H; const sctx = SPL.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const QS = new URLSearchParams(location.search); const HQ = QS.get('hq') !== '0';
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 5000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = QS.get('ao') !== '0';
const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: .0008, maxblur: .01 }); composer.insertPass(bokeh, 2); let DOF = 1;
// ojo de pez de la mirilla (abomba el centro); amount 0 = apagado
const FISH = new ShaderPass({ uniforms: { tDiffuse: { value: null }, amt: { value: 0 }, asp: { value: W / H } }, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
  fragmentShader: 'uniform sampler2D tDiffuse; uniform float amt; uniform float asp; varying vec2 vUv; void main(){ vec2 c = vec2(.5,.44); vec2 d = vUv - c; d.x *= asp; float r = length(d); float rn = r / .5; vec2 q = d * mix(1., .55 + .9 * rn * rn, amt); q.x /= asp; gl_FragColor = texture2D(tDiffuse, c + q); }' });
composer.insertPass(FISH, composer.passes.length - 1);
let CAMT = new THREE.Vector3(); { const la = camera.lookAt.bind(camera); camera.lookAt = (...a) => { if (a.length === 3) CAMT.set(...a); else CAMT.copy(a[0]); la(...a); }; }
const SS = +(QS.get('ss') ?? 1.5); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
if (HQ) { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = +(QS.get('env') ?? .2); renderer.toneMapping = { agx: THREE.AgXToneMapping, aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping }[QS.get('tm') ?? 'neutral']; }
const sky = nightSky(scene); sky.sky.material.depthWrite = !HQ; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0003; sun.shadow.normalBias = .12; sun.shadow.radius = 2.5; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
const LP = Array.from({ length: 4 }, () => { const l = new THREE.PointLight(0xffb060, 0, 60, 1.6); scene.add(l); return l; });
function sh(p0, s = 30) { const q = 2 * s / 2048 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-95, 105, 85)); rim.target.position.copy(p); rim.position.copy(p).add(V(70, 45, -100)); }
const OLF = HQ ? 0 : 1; const OC = 3 * SS * OLF, OS = 2.2 * SS * OLF;
// ---------- escenarios ----------
// Siedlung (x = 0): calle a lo largo de z, casa de Mats al este (x = 44, z = 0, mira a -x), Kessler enfrente (x = -44, z = 0), Brandt (44, -100).
const HAX = 2400, KAX = 3000, BUX = 3400, KLX = 4000, KZX = 4600, KUX = 5200, HFX = 6000;
const SD = siedlung(scene), HM = SD.houses.MATS, HK = SD.houses.KESSLER, HBR = SD.houses.BRANDT;
const HA = haus(scene, HAX), KA = kammer(scene, KAX), BU = buero(scene, BUX), KL = klasse(scene, KLX), KZ = kinderzimmer(scene, KZX), KU = kueche(scene, KUX), HF = hafen(scene, HFX);
// cocina: la ventana del fondo es un hueco de verdad (x de -3 a 7, y de 6,7 a 13,3) con la noche detrás, para que la Cosa se asome
{ const bw = KU.g.children[1], wm = bw.material; bw.visible = false; const g = KU.g; box(15, 17, .4, wm, 0, g, -10.5, 8.5, -14); box(11, 17, .4, wm, 0, g, 12.5, 8.5, -14); box(10, 6.7, .4, wm, 0, g, 2, 3.35, -14); box(10, 3.7, .4, wm, 0, g, 2, 15.15, -14);
  KU.W.p.visible = false; const bg = textPlane(30, 20, 300, 200, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#04081a'); s.addColorStop(1, '#14203a'); c.fillStyle = s; c.fillRect(0, 0, w, h); c.fillStyle = '#08120c'; for (let i = 0; i < 14; i++) { c.beginPath(); c.moveTo(i * 24 - 10, h * .8); c.lineTo(i * 24 + 6, h * (.3 + (i % 3) * .08)); c.lineTo(i * 24 + 22, h * .8); c.fill(); } c.fillStyle = '#f4f0d8'; c.beginPath(); c.arc(w * .8, h * .18, 10, 0, 7); c.fill(); }, .9);
  bg.position.set(2, 10, -26); g.add(bg); box(30, .4, 12, mat(0x1a2418, { roughness: 1 }), 0, g, 2, 4.6, -20); const KL_ = new THREE.PointLight(0x9ab0ff, 50, 14, 1.6); KL_.position.set(2, 12, -16.5); g.add(KL_); }
const AUTUMN = new THREE.Group(); scene.add(AUTUMN); for (const [x, z, s] of [[-24, -60, 1.1], [24, -78, 1], [-24, -120, 1.2], [24, -128, .9], [-26, 20, 1], [26, 30, 1.1]]) herbstbaum(AUTUMN, x, z, s, x * 3 + z); AUTUMN.visible = false;
// clase: puerta con ventanita en la pared izquierda (x = -20) y pasillo detrás para Herr Pohl
const KDOOR = new THREE.Group(); { const g = KDOOR; g.position.set(KLX - 19.6, 0, 8); KL.g.parent.add(g); const dm = mat(0x8a5a32, { roughness: .5 }), wm = KL.g.children[2].material; KL.g.children[2].visible = false;
  // pared izquierda de la clase con hueco para la puerta (z de 4,9 a 11,1, y < 11)
  box(.4, 20, 20.9, wm, 0, g, -.4, 10, -13.55); box(.4, 20, 4.9, wm, 0, g, -.4, 10, 5.55); box(.4, 9, 6.2, wm, 0, g, -.4, 15.5, 0);
  box(.5, 6.1, 6.2, dm, .05, g, 0, 3.05, 0); box(.5, 1.9, 6.2, dm, .05, g, 0, 10.05, 0); for (const s of [-1, 1]) box(.5, 3, 1.9, dm, .02, g, 0, 7.6, s * 2.15);
  const gl = box(.12, 3, 2.4, new THREE.MeshStandardMaterial({ color: 0xbcd8e8, roughness: .05, transparent: true, opacity: .22 }), 0, g, 0, 7.6, 0); gl.userData.noShadow = true; gl.castShadow = false;
  sphere(.3, mat(0xb8b8c0, { metalness: .9 }), g, .5, 5, 2.3, 10, 8); box(.6, .6, 7, mat(0xf4f0e6), 0, g, 0, 11.2, 0);
  const cor = new THREE.Group(); cor.position.set(-8, 0, 0); g.add(cor); const cw = mat(0xe8dcc0, { roughness: .9 }); box(16, .3, 30, mat(0xc8beb0), 0, cor, 0, 0, 0); box(.3, 16, 30, cw, 0, cor, -6, 8, 0); box(16, .3, 30, mat(0xf4f0e8), 0, cor, 0, 16, 0); for (const s of [-1, 1]) box(16, 16, .3, cw, 0, cor, 0, 8, s * 15);
  for (let k = 0; k < 5; k++) { box(2, 8, 1.6, mat([0xd8323a, 0x2a6ad8, 0xffd23f][k % 3], { metalness: .3, roughness: .5 }), .05, cor, -5, 4, -12 + k * 2.2); }
  const L = new THREE.PointLight(0xfff0d8, 120, 30, 1.6); L.position.set(-2, 13, 0); cor.add(L); }
const SETS = { SD: SD.g, HA: HA.g, KA: KA.g, BU: BU.g, KL: KL.g, KZ: KZ.g, KU: KU.g, HF: HF.g, AU: AUTUMN };
for (const k in SETS) outline(SETS[k], OS);
const BILL = []; scene.traverse(o => { if (o.userData && o.userData.bill) BILL.push(o); });
// ---------- reparto ----------
const mats = makeMats(scene), ida = makeIda(scene), mama = makeMama(scene), mamaB = makeMamaB(scene), ding = makeMama(scene), papa = makePapa(scene), kessler = makeKessler(scene), pohl = makePohl(scene);
const mats5 = makeMats(scene); mats5.spec.scale = .62; const ida2 = makeIda(scene); ida2.spec.scale = .5;
const BRANDT = [0, 1, 2, 3, 4].map(i => makeBrandt(scene, i)), KIDS = Array.from({ length: 8 }, (_, i) => makeKid(scene, i)), CALL = [0, 1, 2, 3].map(i => makeCaller(scene, i));
kitFace(mats, 'kid'); kitFace(mats5, 'kid'); [ida, ida2].forEach(c => kitFace(c, 'girl')); [mama, mamaB, ding, kessler].forEach(c => kitFace(c, 'girl')); kitFace(papa, 'hero'); kitFace(pohl, 'mustache');
BRANDT.forEach((c, i) => kitFace(c, ['hero', 'girl', 'kid', 'girl', 'kid'][i])); KIDS.forEach((c, i) => kitFace(c, i % 3 === 2 ? 'girl' : 'kid')); CALL.forEach((c, i) => kitFace(c, ['plain', 'hero', 'girl', 'kid'][i]));
const EXS = Array.from({ length: 10 }, (_, i) => { const c = makeExtra(scene, i + 50); kitFace(c, ['girl', 'plain', 'girl', 'hero', 'girl', 'mustache'][i % 6]); return c; });
const POOL = [mats, ida, mama, mamaB, ding, papa, kessler, pohl, mats5, ida2, ...BRANDT, ...KIDS, ...CALL, ...EXS];
POOL.forEach(c => outline(c.root, OC));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(.5, 'rgba(0,0,0,.26)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const PROPS = []; const P_ = o => { if (!o.parent) scene.add(o); PROPS.push(o); return o; };
const PHONE = P_(handy(scene)), BUNNY = P_(kuscheltier(scene)), CAKE = P_(torte(scene, 5)), CAKE12 = P_(torte(scene, 12)), MASK = P_(maske(scene)), GOLF = P_(golf(scene)), GOLF2 = P_(golf(scene, 0x2a4a8a));
const BAG = P_(new THREE.Group()); { box(2.2, 1.8, 1, mat(0x8a3a2a, { roughness: .6 }), .2, BAG, 0, 0, 0); cyl(.06, .06, 1.6, mat(0x5a2a1a), 6, BAG, 0, 1.1, 0).rotation.z = PI / 2; }
const KEYS = P_(new THREE.Group()); { const r = new THREE.Mesh(new THREE.TorusGeometry(.4, .06, 6, 16), mat(0xc8c8d0, { metalness: .9, roughness: .3 })); KEYS.add(r); for (let k = 0; k < 6; k++) { const kk = box(.18, 1.1, .05, mat([0xd9a531, 0xc8c8d0][k % 2], { metalness: .9, roughness: .3 }), .03, KEYS, Math.cos(k) * .3, -.7, Math.sin(k) * .3); kk.rotation.z = (k - 2.5) * .25; } }
const TORCH = P_(new THREE.Group()); { cyl(.25, .25, 1.6, mat(0x1a1a1a, { metalness: .5 }), 8, TORCH, 0, 0, 0).rotation.x = PI / 2; const l = cyl(.32, .28, .2, glowM(0xfff4d0, 3), 10, TORCH, 0, 0, .85); l.rotation.x = PI / 2; }
const THERMO = P_(new THREE.Group()); { box(.25, 1.3, .12, mat(0xf4f4f4), .05, THERMO, 0, 0, 0); box(.1, .9, .14, mat(0xd8323a), .03, THERMO, 0, .1, 0); }
const LUNCH = P_(new THREE.Group()); { box(2.4, 2.8, 1.2, mat(0x3a3a42, { roughness: .6 }), .2, LUNCH, 0, 0, 0); }
const POSTER = P_(new THREE.Group()); { const p = textPlane(3.2, 4.2, 320, 420, (c, w, h) => { c.fillStyle = '#f4f0e4'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8323a'; c.fillRect(0, 0, w, 80); txt(c, 'VERMISST', w / 2, 44, 54, '#ffffff'); c.fillStyle = '#c8d8e0'; c.fillRect(30, 100, w - 60, 200); for (let i = 0; i < 5; i++) { c.fillStyle = ['#e8b898', '#f4cdb0', '#f4cdb0', '#f4cdb0', '#f4cdb0'][i]; c.beginPath(); c.arc(60 + i * 50, 190 - (i < 2 ? 20 : 0), 18, 0, 7); c.fill(); c.fillStyle = ['#5a3a6a', '#d86a8a', '#3a9ad8', '#f2b33d', '#8ad84a'][i]; c.fillRect(44 + i * 50, 212 - (i < 2 ? 20 : 0), 32, 60); } txt(c, 'FAMILIE BRANDT', w / 2, 330, 32, '#1a1a22'); txt(c, 'Wer hat sie gesehen?', w / 2, 372, 24, '#3a3a42'); }); POSTER.add(p); }
const SIGN = P_(new THREE.Group()); { box(4.6, 2.2, .15, mat(0xffffff), .05, SIGN, 0, 0, 0); const t = textPlane(4.3, 1.9, 430, 190, (c, w, h) => { c.fillStyle = '#fbf6e8'; c.fillRect(0, 0, w, h); txt(c, 'KUSCHELKEKS', w / 2, h / 2 + 4, 64, '#1a1a22'); }); t.position.z = .09; SIGN.add(t); cyl(.12, .12, 4, mat(0x8a5a32), 6, SIGN, 0, -3, -.1); }
const DRILL = P_(new THREE.Group()); { const t = textPlane(6, 4, 420, 280, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); c.strokeStyle = '#1a1a22'; c.lineWidth = 12; c.strokeRect(6, 6, w - 12, h - 12); txt(c, 'TÜRÜBUNG', w / 2, 70, 58, '#d8323a'); txt(c, '1. Nicht öffnen', w / 2, 140, 34, '#1a1a22'); txt(c, '2. Nach dem Wort fragen', w / 2, 190, 34, '#1a1a22'); txt(c, '3. Erwachsene holen', w / 2, 240, 34, '#1a1a22'); }); DRILL.add(t); }
const NOTES = Array.from({ length: 6 }, (_, i) => P_(textPlane(1.2, 1.2, 64, 64, (c, w, h) => txt(c, i % 2 ? '♪' : '♫', w / 2, h / 2 + 6, 56, '#ffe08a'), 1.2)));
const MOTHS = Array.from({ length: 5 }, () => P_(sphere(.08, mat(0xe8d8b0), scene, 0, 0, 0, 6, 4)));
const LEAVES = Array.from({ length: 30 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.5, .4), new THREE.MeshStandardMaterial({ color: [0xd8741a, 0xe8a22a, 0xb84a1a][i % 3], side: THREE.DoubleSide, roughness: .9 })); scene.add(p); return P_(p); });
const DUST = Array.from({ length: 24 }, () => P_(sphere(1, mat(0xc8c4bc, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 8, 6)));
const SWEAT = Array.from({ length: 3 }, () => P_(sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const TEAR = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8)));
const BREATH = Array.from({ length: 6 }, () => P_(sphere(.5, mat(0xffffff, { transparent: true, opacity: .25, depthWrite: false, roughness: 1 }), scene, 0, 0, 0, 8, 6)));
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1, AIRM = null;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.2, .42, .78], [.5, .66, .86], [.8, .86, .92]); sky.moon.visible = false; sky.sky.material.uniforms.cloud.value = 1; sky.sky.material.uniforms.starK.value = 0; hemi.intensity = 1.0; hemi.color.setRGB(.82, .9, 1); hemi.groundColor.setRGB(.5, .5, .42); sun.intensity = 2.6; sun.color.setRGB(1, .92, .8); rim.intensity = 1.6; rim.color.setRGB(1, .93, .82);
  scene.fog.color.setRGB(.74, .8, .88); scene.fog.density = .0016; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function dusk(k = 1) { day(); sun.color.setRGB(1, lerp(.85, .55, k), lerp(.7, .36, k)); sun.intensity = lerp(2.4, 1.6, k); setSky([lerp(.2, .1, k), lerp(.4, .14, k), lerp(.78, .42, k)], [lerp(.5, .66, k), lerp(.62, .36, k), lerp(.84, .52, k)], [1, lerp(.8, .56, k), lerp(.7, .34, k)]); hemi.color.setRGB(.9, .74, .8); hemi.intensity = lerp(1, .7, k); scene.fog.color.setRGB(lerp(.74, .62, k), lerp(.76, .5, k), lerp(.84, .56, k)); rim.color.setRGB(1, .6, .4); }
// noche azul profunda con luces cálidas (como la referencia), sin quedarse oscura
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = .95; setSky([.02, .04, .12], [.05, .1, .22], [.1, .16, .3]); sky.sky.material.uniforms.cloud.value = 0; sky.sky.material.uniforms.starK.value = 1; sky.moon.visible = true; sky.moon.position.set(300, 420, -1300); hemi.intensity = .7; hemi.color.setRGB(.42, .56, .95); hemi.groundColor.setRGB(.14, .14, .22); sun.intensity = 1.0; sun.color.setRGB(.6, .72, 1); rim.intensity = 1.4; rim.color.setRGB(.66, .8, 1);
  scene.fog.color.setRGB(.05, .09, .18); scene.fog.density = .0032; bloom.strength = .38; bloom.threshold = .74; FILL.intensity = fill; FILL.color.setRGB(1, .84, .66); BIRDSON = 0; }
function morning() { day(); setSky([.62, .68, .74], [.72, .76, .8], [.84, .86, .88]); sun.intensity = .9; sun.color.setRGB(1, .92, .84); hemi.intensity = 1.2; scene.fog.color.setRGB(.78, .8, .82); scene.fog.density = .009; BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .96, .9); hemi.groundColor.setRGB(.55, .46, .38); sun.intensity = 0; rim.intensity = .5; bloom.strength = .24; bloom.threshold = .84; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
let PEEP = 0, SPLIT = null, SEPIA = 0;
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.blob.visible = true; }
  for (const p of PROPS) { p.visible = false; p.rotation.order = 'XYZ'; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const k in SETS) SETS[k].visible = false; FX2D.length = 0; for (const l of LP) l.intensity = 0; SD.tram.visible = false; MASK.visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.2; grade.uniforms.sharp.value = .5; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; DOF = 1; PEEP = 0; SEPIA = 0; AIRM = null;
  resetHouse(); day(); }
// puertas, luces y relojes vuelven a su estado
function resetHouse() { HA.front.door.rotation.y = PI; HA.back.door.rotation.y = 0; HA.backShadow.material.opacity = 0; HA.sweep.material.opacity = 0; KA.door.rotation.y = 0; HA.kammer.door.rotation.y = PI / 2; HM.door.rotation.y = 0; HK.door.rotation.y = 0; HBR.door.rotation.y = 0;
  for (const h of [HM, HK, HBR]) { h.lamp.glass.material.emissiveIntensity = 3; h.lamp.halo.material.opacity = .55; } GOLF.userData.lights(0); GOLF.userData.door.rotation.y = 0; HA.chainOn = 1; HA.front.thumb.rotation.z = 0; }
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
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { dist *= 1.75; if (dist2 != null) dist2 *= 1.75; const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .85, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .45 + dy, h.z + fz * d - fx * side], [h.x, h.y - .05, h.z], fov); }
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null) { const s = ch.spec.scale || 1, p = ch.root.position, q = easeInOut(clamp(k)), d = lerp(dist, dist2 ?? dist * .88, q); const hy = hp(ch).y, mid = (p.y + hy) / 2 + .6 * s; const c = V(p.x, lerp(mid, hy + .45 * s, clamp((13 - d) / 7)), p.z); orbit(c, d * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function ojos(expr, T, sd) { const n = Math.sin(T * .9 + sd) * .55 + Math.sin(T * 2.3 + sd * 2.1) * .45;
  switch (expr) {
    case 'neutral': case 'talk': case undefined: return n > .25 ? 'half' : n < -.55 ? (sd % 2 ? 'side_l' : 'side_r') : 'normal';
    case 'sad': return n > -.1 ? 'worried' : 'down';
    case 'cry': return 'cry';
    case 'happy': case 'smile': case 'relief': case 'joy': return n > -.3 ? 'happy' : 'half';
    case 'warm': return n > .1 ? 'happy' : 'normal';
    case 'worried': return n > .45 ? 'side_l' : n < -.45 ? 'down' : 'worried';
    case 'scared': return n > .3 ? 'terror' : 'scared';
    case 'shock': case 'gasp': return n > -.2 ? 'wide' : 'scared';
    case 'determined': return n > .5 ? 'squint' : 'angry';
    case 'angry': case 'shout': return n > .55 ? 'squint' : 'angry';
    case 'confused': return n > 0 ? 'squint' : 'side_r';
    case 'tired': return n > -.4 ? 'half' : 'closed';
    case 'sus': case 'smug': return n > .2 ? 'squint' : 'half';
    case 'creep': return 'wide';
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed' && s.expr !== 'cry' && s.expr !== 'creep') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk', extra = {}) => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || (expr === 'warm' || expr === 'happy' ? 'smile' : 'flat'), ...extra });
// la Cosa: sonrisa de oreja a oreja (k = cuánto se estira); boca que se mueve (talk) cuando habla
const creepF = (ch, T, k = 1, o = {}) => ch.setFace({ eyes: o.eyes || (Math.sin(T * .7) > .97 ? 'half' : 'stare'), mouth: 'flat', creep: Math.round(clamp(k) * 20) / 20, ...o });
const creepTalk = (ch, T, a, b, k = .9) => { const lp = kitLips(T, spoken(a, b)); creepF(ch, T, lp === 'talk_wide' ? k * .8 : lp ? k * .9 : k); };
const laughF = (ch, T) => cara(ch, T, { eyes: 'happy', mouth: Math.sin(T * 22) > 0 ? 'laugh' : 'open_smile' });
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
const tears = (ch, T, slot = 0) => { const h = hp(ch), s = ch.spec.scale || 1, a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a); for (let i = 0; i < 2; i++) { const k = (T * 1.1 + i * .5) % 1, sd = i ? -.3 : .3; const t = TEAR[slot * 2 + i]; t.visible = true; t.position.set(h.x + (fz * sd + fx * .68) * s, h.y + (.72 - k * 1.0) * s, h.z + (-fx * sd + fz * .68) * s); t.scale.setScalar(s); } };
// vaho al respirar (exteriores de invierno)
const breath = (ch, T, slot = 0) => { const h = hp(ch), s = ch.spec.scale || 1, a = ch.root.rotation.y; for (let i = 0; i < 3; i++) { const k = (T * .7 + i / 3) % 1, b = BREATH[slot * 3 + i]; b.visible = true; b.position.set(h.x + Math.sin(a) * (1 + k * 2.2) * s, h.y + (.4 + k * .8) * s, h.z + Math.cos(a) * (1 + k * 2.2) * s); b.scale.setScalar((.4 + k * 1.2) * s); b.material.opacity = .22 * (1 - k); } };
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.5 + t * 1.4) * s * (.8 + r() * .5)); d.material.opacity = .4 * (1 - t / 1.2); }); }
function leaves(c, T, n = 30, sx = 30, sz = 30, h = 18) { LEAVES.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (1.5 + r() * 1.5) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 1.6 + i) * 1.2, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 2 + i, T * 3 + i, T + i); }); }
function moths(c, T) { MOTHS.forEach((m, i) => { m.visible = true; m.position.set(c.x + Math.sin(T * (5 + i) + i * 2) * 1.2, c.y + Math.cos(T * (6 + i) + i) * .8, c.z + Math.sin(T * (4 + i * .7) + i) * 1.2); }); }
function notes(c, T, n = 5) { NOTES.forEach((p, i) => { if (i >= n) return; const k = (T * .45 + i / n) % 1; p.visible = true; p.position.set(c.x + Math.sin(i * 2.1 + T) * 2.4, c.y + k * 6, c.z + Math.cos(i * 1.3) * .6); p.lookAt(camera.position); p.material.opacity = Math.sin(k * PI); }); }
const walkP = (T, i) => { const p = Math.sin(T * 9 + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
const runP = (T, i) => { const p = Math.sin(T * 13 + i); return { aLx: p * 1.1, aRx: -p * 1.1, aLe: 1.3, aRe: 1.3, lLx: -p * .9, lRx: p * .9, lLk: .3 + Math.max(0, p) * 1.1, lRk: .3 + Math.max(0, -p) * 1.1, lean: .25, headX: -.15 }; };
// paso rígido de las Cosas (sin balanceo de brazos, cabeza fija hacia delante)
const stiffP = (T, i) => { const p = Math.sin(T * 6 + i); return { aLx: .05, aRx: .05, aLz: .04, aRz: .04, lLx: -p * .35, lRx: p * .35, lLk: Math.max(0, p) * .3, lRk: Math.max(0, -p) * .3, lean: -.02, headX: -.04 }; };
const sitPose = (extra = {}) => ({ lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, ...extra });
const sitY = (c, seat) => seat + .1 - 2.05 * (c.spec.scale || 1);
function sit(c, x, seat, z, ry, L, pose = {}) { put(c, x, sitY(c, seat), z, ry); actuar(c, 0, [[0, sitPose(pose)]], { T: L.T, weight: false }); c.blob.visible = false; return c; }
function walk(ch, L, x, z, ry, speed = 2.4, i = 0, o = {}) { const d = speed * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, o.y ?? 0, z + Math.cos(ry) * d, ry); ch.root.position.y = (o.y ?? 0) + Math.abs(Math.sin(L.T * 9 + i)) * .1; actuar(ch, 0, [[0, { ...(o.run ? runP(L.T, i) : o.stiff ? stiffP(L.T, i) : walkP(L.T, i)), ...(o.pose || {}) }]], { T: L.T }); if (o.face !== false) cara(ch, L.T, o.f || { expr: o.expr || 'neutral' }); return ch; }
function crowdGuy(c, x, z, L, i, o) { const T = L.T + i * .37; let ry = o.ry ?? (Math.atan2(camera.position.x - x, camera.position.z - z) + Math.sin(i * 7.3) * (o.jit ?? .35)); put(c, x, o.y ?? 0, z, ry); const m = o.mode;
  if (m === 'talk') { actuar(c, 0, [[0, { aRx: .9 + Math.sin(L.T * 3 + i) * .3, aRz: .2, aRe: 1.2, aLx: .3, headY: Math.sin(L.T * .8 + i) * .4 }]], { T: L.T }); cara(c, T, { expr: 'happy', mouth: Math.sin(L.T * 9 + i) > 0 ? 'talk' : 'smile' }); }
  else if (m === 'shock') { actuar(c, 0, [[0, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9, lean: -.08, headX: -.06 }]], { T: L.T }); cara(c, T, { expr: 'shock', mouth: i % 2 ? 'o' : 'grimace' }); }
  else if (m === 'point') { actuar(c, 0, [[0, GEST.point]], { T: L.T }); cara(c, T, { expr: o.expr || 'shock', mouth: 'o' }); }
  else if (m === 'laugh') { actuar(c, 0, [[0, { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.6, aRe: 1.6, lean: -.12 + Math.sin(L.T * 14 + i) * .05 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'shout') { actuar(c, 0, [[0, { aLx: .4, aRx: 2.4, aRz: .3, aRe: .5, lean: -.08 }]], { T: L.T }); cara(c, T, { expr: 'shout', mouth: 'talk_wide' }); }
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); } }
// ---------- escenarios por plano ----------
function lp(i, x, y, z, k = 40, col = 0xffb060, d = 60) { const l = LP[i]; l.position.set(x, y, z); l.intensity = k; l.color.setHex(col); l.distance = d; }
// calle: o.t = 'day' | 'dusk' (k) | 'night' | 'morning' | 'autumn'
function strasse(L, o = {}) { use('SD'); const t = o.t || 'night';
  if (t === 'night') { night(o.fill ?? 26); AIRM = 'noche'; } else if (t === 'dusk') { dusk(o.k ?? 1); } else if (t === 'morning') { morning(); } else day();
  if (t === 'autumn' || o.autumn) use('AU');
  const lit = t === 'night' || (t === 'dusk' && (o.k ?? 1) > .7) || o.lamps; for (const l of SD.lamps) { l.glass.material.emissiveIntensity = lit ? 3.2 : .05; l.halo.material.opacity = lit ? .75 : 0; l.puddle.material.opacity = lit ? .3 : 0; }
  for (const h of [HM, HK, HBR]) { h.lamp.glass.material.emissiveIntensity = lit ? 3 : .1; h.lamp.halo.material.opacity = lit ? .55 : 0; } }
// casa por dentro (noche: lámparas encendidas; o.dark: todo apagado y azul)
function flur(L, o = {}) { use('HA'); HA.setDay(!!o.day); inside(o.dark ? .3 : .85, o.dark ? 8 : 34); FILL.color.setRGB(1, .88, .72); HA.L.forEach((l, i) => l.intensity = o.dark ? 0 : [240, 200, 160][i]); HA.lamps.forEach(b => b.material.emissiveIntensity = o.dark ? 0 : 2.6); if (o.dark) { hemi.color.setRGB(.5, .6, 1); FILL.color.setRGB(.6, .7, 1); }
  HA.clock.set(o.h ?? 18, o.m ?? 10); }
function kammerS(L) { use('KA'); inside(.12, 3); FILL.color.setRGB(.6, .7, 1); grade.uniforms.vig.value = .6; }
function bueroS(L) { use('BU'); inside(.9, 30); FILL.color.setRGB(.9, .96, 1); BU.screens.forEach((s, i) => s.material.emissiveIntensity = 1.1 + Math.sin(L.T * 3 + i) * .1); }
function schule(L) { use('KL'); inside(.95, 30); KL.BB.userData && KL.BB.userData.draw && 0; }
function zimmer(L, night = true) { use('KZ'); if (KZ.CLOCK) KZ.CLOCK.visible = false; if (night) { inside(.5, 18); FILL.color.setRGB(1, .78, .5); if (KZ.WN) KZ.WN.p.material.map = KZ.WN.night; lp(1, KZX - 1, 8, -8, 30, 0xffc070, 26); } else { inside(.95, 38); if (KZ.WN) KZ.WN.p.material.map = KZ.WN.day; } }
function kuecheS(L, near = false) { use('KU'); inside(1.0, 40); FILL.color.setRGB(1, .9, .74); KU.CH.forEach((c, i) => c.visible = near || i > 1); if (KU.LMP) KU.LMP.visible = true; KU.T.visible = true; }
function hafenS(L) { use('HF'); day(); setSky([.4, .5, .62], [.6, .66, .74], [.78, .8, .84]); scene.fog.density = .0022; BIRDSON = 1; }
// coordenadas útiles de la casa de Mats (fuera): delante de la puerta, en el porche
const HMW = (x, y, z) => HM.w(x, y, z), HKW = (x, y, z) => HK.w(x, y, z), HBW = (x, y, z) => HBR.w(x, y, z);
const PORCH = HMW(HM.doorX, HM.B, HM.frontZ + 3.4);   // en el porche, frente a la puerta (mira a la puerta: ry = PI/2)
const DOORIN = V(HAX + 1.5, 0, 16.6);   // dentro, frente a la puerta de casa (mirando a +z)
const PEEPW = () => HA.front.peepW();
// mirilla: la cámara en la mirilla de la casa de Mats mirando al porche (ojo de pez + círculo)
function peephole(L, k = 1, o = {}) { const p = HMW(HM.doorX, HM.B + 7.6, HM.frontZ + .7), t = o.look || HMW(HM.doorX + (o.dx ?? 0), HM.B + (o.ty ?? 6.4), HM.frontZ + 3.4 + (o.dz ?? 0));
  cam([p.x, p.y, p.z], [t.x, t.y, t.z], o.fov ?? 92); PEEP = k; }
// ---------- gestos de esta pieza ----------
const knockP = (T, t0 = 0, rate = 3) => { const ph = ((T - t0) * rate) % 1; return { ...GEST.knock, aRe: 1.5 - Math.max(0, Math.sin(ph * PI)) * .6, aRx: 1.55 + Math.sin(ph * PI) * .25 }; };
function bigNum(text, k, col = '#ffffff', y = .2, sc = 1) { badge(col === 'red' ? 'red' : col === 'gold' ? 'gold' : col === 'green' ? 'green' : col === 'cyan' ? 'cyan' : 'big', text, W / 2, H * y, k, 1, sc); }
// ---------- capa 2D ----------
const BAD_ = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD_.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD_.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD_.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { if (!b.proj) { const [x, y, z] = proj(b.w3); if (z >= 1) return; if (x < -60 || x > W + 60) return; b.x = clamp(x, 200, W - 200); b.y = clamp(y, 150, H * .64); } } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (['big', 'red', 'num', 'green', 'gold', 'cyan'].includes(b.kind)) { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : b.kind === 'green' ? '#04300e' : b.kind === 'gold' ? '#3a2400' : b.kind === 'cyan' ? '#03283a' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50);
    if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#8aff9a'); g.addColorStop(1, '#1ab84a'); } else if (b.kind === 'gold') { g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a820'); } else if (b.kind === 'cyan') { g.addColorStop(0, '#d8ffff'); g.addColorStop(1, '#2ad8f0'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  else if (b.kind === 'x') { c.lineCap = 'round'; c.lineWidth = 40; c.strokeStyle = '#4a0008'; c.beginPath(); c.moveTo(-70, -70); c.lineTo(70, 70); c.moveTo(70, -70); c.lineTo(-70, 70); c.stroke(); c.lineWidth = 24; c.strokeStyle = '#ff3a3a'; c.stroke(); }
  else if (b.kind === 'check') { c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = 40; c.strokeStyle = '#04300e'; c.beginPath(); c.moveTo(-70, 0); c.lineTo(-20, 50); c.lineTo(80, -60); c.stroke(); c.lineWidth = 24; c.strokeStyle = '#3aff6a'; c.stroke(); }
  else if (b.kind === 'phone') { const w = 380, h = 620; c.fillStyle = '#111'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 50); c.fill(); c.fillStyle = '#1e2a3a'; c.beginPath(); c.roundRect(-w / 2 + 16, -h / 2 + 16, w - 32, h - 32, 38); c.fill(); c.fillStyle = '#e8b898'; c.beginPath(); c.arc(0, -120, 70, 0, 7); c.fill(); c.fillStyle = '#6a3418'; c.beginPath(); c.arc(0, -150, 70, PI, 0); c.fill();
    c.font = `700 60px ${FONT}`; c.fillStyle = '#fff'; c.fillText(b.text, 0, 0); c.font = `700 32px ${FONT}`; c.fillStyle = '#9ab0c8'; c.fillText(b.sub || 'Anruf…', 0, 60); for (const [x, col] of [[-90, '#ff3a3a'], [90, '#3ad86a']]) { c.fillStyle = col; c.beginPath(); c.arc(x, 210, 46, 0, 7); c.fill(); } }
  c.restore(); }
const KEY = /^(Stadt|Familie|geheimes|Wort|Mama|Dunkelheit|nicht|Tür|dunkel|Wald|Gesicht|Stimme|liebst|Rein|aufmachst|Sonnenuntergang|klopft|zuerst|Familienwort|Kessler|schreit|Haustür|Sauerkraut|allein|leere|Sicherheit|Straße|Herbst|Brandts|Vater|Ohne|fragen|Morgen|Straßenbahn|fünf|Lächeln|echten|niemand|Licht|keiner|schlafen|Schule|Türübungen|Pohl|klopft|Klassentür|Gummimaske|Rektorin|achtundzwanzig|Kinder|brüllen|nie|Mats|zwölf|Kuschelkeks|ausgedacht|Gute-Nacht-Lied|lieber|Freunden|Papa|Hamburg|Ida|sieben|gewartet|Winter|halb|vier|verschwand|sechs|stockdunkel|zehn|klopfte|rein|Türspion|Veranda|Wintermantel|lächelte|Ohren|Breite|richtige|Hand|Schloss|lachen|einziges|flach|Schild|Handy|ersten|Klingeln|Tastaturen|Kopierer|Schatz|Büro|flüsterte|stehst|still|ruhig|Fieber|derselben|Herzschlag|Ding|geraten|nachgemacht|Echo|sofort|Hause|aufgelegt|zweimal|Treppe|Schlafanzug|Kuscheltier|Abstellkammer|Dunkeln|Schuhen|Fast|Kammer|dasselbe|uns|Woher|draußen|geschlichen|Verandalicht|leer|Scheinwerfer|Golf|knallte|Kies|Schnelle|rennen|nichts|Luft|Klopf|Hintertür|bin’s)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = [], split = null) => S.push({ t0, tr, zoom, fn, sfx, split });
let DARK = 0, TINT = null, SHAKE = 0; const FX2D = [];
//@@PLANOS@@

// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4, B: 8, G: 5 };
const CUES = [];
const TRS = { W: ['whoosh_soft', 'swipe', 'whoosh_down'], Z: ['swoosh_up', 'zoom_in', 'whoosh_up'], F: ['flash', 'click_set', 'sparkle'], S: ['swipe', 'tape', 'whoosh_soft'], R: ['whirl', 'clock_spin', 'whoosh'], I: ['iris_pop', 'pop', 'pling'], C: ['thump', 'impact_soft', 'fist'], B: ['soft_air', 'soft_air', 'soft_air'], G: ['glitch', 'static', 'glitch'] };
let lastTr = '';
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.tr && i + 1 < S.length) { const L_ = TRS[s.tr]; let n = L_[i % L_.length]; if (n === lastTr) n = L_[(i + 1) % L_.length]; lastTr = n; CUES.push({ t: +(s.t1 - TRW[s.tr] / FPS * .5).toFixed(3), s: n, g: .45, tr: 1 }); }
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  if (s.zoom === 'punch') CUES.push({ t: s.t0, s: 'impact', g: .6 }); });
CUES.push({ t: 0, s: 'zoom_fast', g: .9 }); CUES.push({ t: 0, s: 'ding_reveal', g: .5 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null; const _q = new THREE.Quaternion();
function renderShot(i, T, tr, a, fn = null) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); if (!fn) BAD_.length = 0; (fn || s.fn)(L); while (POST.length) POST.shift()();
  if (HQ) { renderer.toneMappingExposure *= +(QS.get('exp') ?? .85); grade.uniforms.sat.value = +(QS.get('sat') ?? 1.32); grade.uniforms.sharp.value = .6; grade.uniforms.vig.value = Math.min(grade.uniforms.vig.value, MODE === 'night' ? .42 : .32); bloom.strength = Math.min(Math.max(bloom.strength, .14), MODE === 'night' ? .42 : .22); bloom.threshold = MODE === 'night' ? .72 : .86; ao.enabled = QS.get('ao') !== '0'; DOF = 1; }
  if (SEPIA) { grade.uniforms.sepia.value = SEPIA; grade.uniforms.vig.value = Math.max(grade.uniforms.vig.value, .55); }
  if (s.zoom === 'slow' && !fn) { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .26); camera.fov *= lerp(.5, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud', 'knock3', 'door_slam', 'car_door'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, PEEP ? .4 : 1); camera.updateProjectionMatrix(); camera.updateMatrixWorld();
  for (const m of BILL) { m.parent.getWorldQuaternion(_q); m.quaternion.copy(_q.invert().multiply(camera.quaternion)); }
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  FISH.uniforms.amt.value = PEEP; FISH.enabled = PEEP > 0;
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, AIRM || (MODE === 'night' ? 'noche' : 'polvo'), MODE === 'in' ? .25 : .4);
  if (BIRDS.update) BIRDS.update(T, camera.position.clone().addScaledVector(dir, 60).add(V(0, 25, 0)), (MODE === 'day') && BIRDSON ? 1 : 0);
  sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position);
  { const fd = camera.position.distanceTo(CAMT); bokeh.uniforms.focus.value = fd; bokeh.uniforms.aperture.value = DOF * .0022 * clamp((26 - fd) / 14); bokeh.enabled = HQ && QS.get('dof') === '1'; }
  composer.render();
}
// la mirilla: círculo con borde oscuro y viñeta, el resto negro
function peepMask(c) { const cx = W / 2, cy = H * .44, r = W * .47; c.save(); c.fillStyle = '#000'; c.beginPath(); c.rect(0, 0, W, H); c.moveTo(cx + r, cy); c.arc(cx, cy, r, 0, 2 * PI, true); c.closePath(); c.fill('evenodd');
  const g = c.createRadialGradient(cx, cy, r * .55, cx, cy, r); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.8, 'rgba(10,6,0,.35)'); g.addColorStop(1, 'rgba(0,0,0,.95)'); c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.fill();
  c.strokeStyle = 'rgba(200,150,60,.35)'; c.lineWidth = 6; c.beginPath(); c.arc(cx, cy, r - 3, 0, 7); c.stroke(); c.restore(); }
function renderAt(T) {
  const i = shotAt(T), s = S[i]; let tr = null, a = 0, ph = 0; const fO = (s.t1 - T) * FPS, fI = (T - s.t0) * FPS;
  if (s.tr && fO < TRW[s.tr] && i + 1 < S.length) { tr = s.tr; a = 1 - fO / TRW[s.tr]; ph = -1; } else if (i > 0 && S[i - 1].tr && fI < TRW[S[i - 1].tr]) { tr = S[i - 1].tr; a = 1 - fI / TRW[S[i - 1].tr]; ph = 1; }
  renderShot(i, T, tr, a); let SRC = renderer.domElement; const peep1 = PEEP;
  if (s.split) { // pantalla partida: arriba el plano, abajo s.split (franja central de cada uno)
    sctx.fillStyle = '#000'; sctx.fillRect(0, 0, W, H); sctx.drawImage(renderer.domElement, 0, renderer.domElement.height * .2, renderer.domElement.width, renderer.domElement.height * .5, 0, 0, W, H / 2);
    renderShot(i, T, tr, a, s.split); sctx.drawImage(renderer.domElement, 0, renderer.domElement.height * .2, renderer.domElement.width, renderer.domElement.height * .5, 0, H / 2, W, H / 2);
    sctx.fillStyle = '#f4f0e6'; sctx.fillRect(0, H / 2 - 5, W, 10); SRC = SPL; }
  octx.save(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.translate(W / 2, H / 2); const a2 = a * a;
  if (tr === 'W') octx.translate(ph * a2 * W * .45, 0); if (tr === 'S') octx.translate(0, ph * a2 * H * .35);
  if (tr === 'Z') { const sc = ph < 0 ? 1 + a2 * .6 : 1 + a2 * .35; octx.scale(sc, sc); octx.filter = `blur(${(a * 8).toFixed(1)}px)`; }
  if (tr === 'R') { octx.rotate((ph < 0 ? 1 : -1) * a2 * .55); octx.scale(1 + a2 * .3, 1 + a2 * .3); octx.filter = `blur(${(a * 7).toFixed(1)}px)`; }
  if (tr === 'C' && ph > 0) { const sc = 1 + a * .22; octx.scale(sc, sc); }
  if (tr === 'I') { octx.beginPath(); octx.arc(0, 0, Math.max(1, (1 - a2) * H * .62), 0, 7); octx.clip(); }
  if (tr === 'G') { const r = RNG(Math.floor(T * FPS)); octx.translate((r() - .5) * 60 * a, 0); }
  octx.drawImage(SRC, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(SRC, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(SRC, -W / 2, -H / 2 - ph * H, W, H);
  if (tr === 'G') { const r = RNG(Math.floor(T * FPS) + 7); for (let k = 0; k < 7; k++) { const y = r() * H - H / 2, h = 20 + r() * 80; octx.drawImage(SRC, 0, y + H / 2, W, h, -W / 2 + (r() - .5) * 140 * a, y, W, h); } octx.fillStyle = `rgba(255,255,255,${(a * .12).toFixed(3)})`; octx.fillRect(-W / 2, -H / 2, W, H); }
  octx.restore(); octx.filter = 'none';
  if (peep1 > 0 && !s.split) peepMask(octx);
  if (tr === 'B') { octx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`; octx.fillRect(0, 0, W, H); }
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  if (T > DUR - 1) { octx.fillStyle = `rgba(0,0,0,${clamp(T - DUR + 1).toFixed(3)})`; octx.fillRect(0, 0, W, H); }
  for (const f of FX2D) f(octx); for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { applyPose, hp, mats, ida, mama, ding, cam, HM, HA, SD, renderer, composer, bloom, sun, grade, scene, camera, PORCH, DOORIN };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

// STATUE — «In dieser Stadt wirst du zur Statue, wenn du ein Jahr lang keine Freundin oder keinen Freund hast.»
// Finn (yo) es estatua en el Marktplatz de Hufenbach junto a Jonas; Mia (chaqueta verde) le habla cada día… y al final besa a Jonas.
// Motor: el de schlafwandler / schluck / frauenstadt (luz realista, AO, supermuestreo). Planos en src/p/*.js; armar.py los une en src/index.js.
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt, bench } from './props.js';
import { hufenbach } from './gort.js';
import { klasse } from './svsets.js';
import { kinderzimmer, schlafzimmer, glowM } from './swelt.js';
import { sockel, pigeon, dackel, buch, handy, drawChats, kalender, karton, umzugswagen, mall, regen, scarfHand, STONE_T } from './stwelt.js';
import { makeFinn, makeJonas, makeMia, makeMiaKleid, makeEx, makeExFreund, makeLehrerin, makeCousin, makeSucher, makeKind } from './stvolk.js';
import { makeMayor } from './gvolk.js';
import { makeOpa } from './svolk.js';
import { makeExtra } from './ecast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';


await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 165.6, U = W / 720, PI = Math.PI;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const QS = new URLSearchParams(location.search); const HQ = QS.get('hq') !== '0';
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 5000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = QS.get('ao') !== '0';
const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: .0008, maxblur: .01 }); composer.insertPass(bokeh, 2); let DOF = 1;
let CAMT = new THREE.Vector3(); { const la = camera.lookAt.bind(camera); camera.lookAt = (...a) => { if (a.length === 3) CAMT.set(...a); else CAMT.copy(a[0]); la(...a); }; }
const SS = +(QS.get('ss') ?? 1.5); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
if (HQ) { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = +(QS.get('env') ?? .2); renderer.toneMapping = { agx: THREE.AgXToneMapping, aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping }[QS.get('tm') ?? 'neutral']; }
const sky = nightSky(scene); sky.sky.material.depthWrite = !HQ; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0003; sun.shadow.normalBias = .12; sun.shadow.radius = 2.5; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
// luces locales (siempre en la escena; intensidad 0 si no se usan: así no se recompilan los shaders)
const LP = Array.from({ length: 4 }, () => { const l = new THREE.PointLight(0xffb060, 0, 60, 1.6); scene.add(l); return l; });
const LANT = new THREE.PointLight(0xffc070, 0, 34, 1.4); scene.add(LANT);   // farol del guardia (luz en la cara)
function sh(p0, s = 30) { const q = 2 * s / 2048 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-95, 105, 85)); rim.target.position.copy(p); rim.position.copy(p).add(V(70, 45, -100)); }
const OLF = HQ ? 0 : 1; const OC = 3 * SS * OLF, OS = 2.2 * SS * OLF, OP = 1.8 * SS * OLF;
const M2U = 3.95;
// ---------- escenarios ----------
// Hufenbach (x = 0): Marktplatz adoquinado, Rathaus al norte (z = -92). Pedestal en P (mira a +z), estatuas en P.x ± 3,6, y = 3,8.
// Banco «gegenüber» en (P.x, P.z + 22) mirando al pedestal (ry = PI). Interiores: cuarto de Finn (KZX), cuarto de Mia (MZX), cuarto del primo (CZX), clase (KLX), centro comercial (MLX).
const KZX = 2400, MZX = 3000, CZX = 3600, KLX = 4200, MLX = 4800;
const HB = hufenbach(scene); HB.RANK.visible = false;
const P = V(-6, 0, -50), SO = sockel(HB.G, P.x, P.z), TOP = SO.TOP, SPX = SO.SP, BZ = P.z + 22;
bench(HB.G, P.x, BZ, PI); const BENCH = HB.G.children[HB.G.children.length - 1];
const KZ = kinderzimmer(scene, KZX), MZ = kinderzimmer(scene, MZX, { lena: true }), CZ = schlafzimmer(scene, CZX, { wall: '#c8e0f4', wall2: '#b8d0e8', quilt: ['#2a6ad8', '#ffd23f', '#3a3a42', '#f4f4f4'], curtain: '#2a6ad8' });
const KL = klasse(scene, KLX), ML = mall(scene, MLX);
for (const R of [KZ, MZ]) { if (R.GLOVES) R.GLOVES.visible = false; if (R.FANTA) R.FANTA.visible = false; }
const SETS = { HB: HB.G, KZ: KZ.g, MZ: MZ.g, CZ: CZ.g, KL: KL.g, ML: ML.g };
for (const k in SETS) outline(SETS[k], OS);
// ---------- reparto ----------
const finn = makeFinn(scene), jonas = makeJonas(scene), mia = makeMia(scene), miaK = makeMiaKleid(scene), ex = makeEx(scene), exF = makeExFreund(scene), mayor = makeMayor(scene), opa = makeOpa(scene);
const lehrerin = makeLehrerin(scene), cousin = makeCousin(scene), sucher = makeSucher(scene), KIDS = [0, 1, 2, 3].map(i => makeKind(scene, i));
kitFace(finn, 'kid'); kitFace(jonas, 'hero'); [mia, miaK, ex, lehrerin].forEach(c => kitFace(c, 'girl')); kitFace(exF, 'plain'); kitFace(mayor, 'mustache'); kitFace(opa, 'mustache'); kitFace(cousin, 'kid'); kitFace(sucher, 'hero'); KIDS.forEach(c => kitFace(c, 'kid'));
const EXS = Array.from({ length: 16 }, (_, i) => { const c = makeExtra(scene, i + 30); kitFace(c, ['girl', 'plain', 'girl', 'hero', 'girl', 'mustache'][i % 6]); return c; });
const MAIN = [finn, jonas, mia, miaK, ex, exF, mayor, opa, lehrerin, cousin, sucher, ...KIDS];
const POOL = [...MAIN, ...EXS];
POOL.forEach(c => outline(c.root, OC));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(.5, 'rgba(0,0,0,.26)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// piedra: cada malla guarda su material original (om) y una copia de piedra (sm); stone(ch, k) petrifica de los pies (0) a la cabeza (1)
const STT = STONE_T(); STT.wrapS = STT.wrapT = THREE.RepeatWrapping;
for (const c of POOL) c.root.traverse(m => { if (!m.isMesh || m === c.blob) return; m.userData.om = m.material; if (m.material.transparent) return; const s = new THREE.MeshStandardMaterial({ color: m.material.map ? 0x9c9ca2 : 0xffffff, map: m.material.map || STT, roughness: .95, metalness: 0 }); m.userData.sm = s; });
const _v = new THREE.Vector3();
function stone(ch, k = 1, keep = null) { const s = ch.spec.scale || 1, y0 = ch.root.position.y; ch.root.updateMatrixWorld(true); ch.stoneK = k;
  ch.root.traverse(m => { if (!m.isMesh || !m.userData.om) return; m.getWorldPosition(_v); const f = (_v.y - y0) / (8.2 * s * ch.root.scale.y / (s || 1)) , on = f < k && !(keep && keep(m));
    if (m.material.transparent || m.userData.om.transparent) { m.userData.om.color.setHex(on ? 0xe2e2e6 : 0xffffff); return; } m.material = on ? m.userData.sm : m.userData.om; }); return ch; }
const unstone = ch => { if (ch.stoneK) stone(ch, 0); ch.stoneK = 0; };
// ¿la malla cuelga de una mano? (para «bewegte zuerst die Finger»)
const inHand = ch => m => { let o = m; while (o && o !== ch.root) { if (o === ch.aL.hand || o === ch.aR.hand) return true; o = o.parent; } return false; };
// ---------- atrezo ----------
const PROPS = [];
const P_ = o => { if (!o.parent) scene.add(o); PROPS.push(o); return o; };
const PG = Array.from({ length: 6 }, (_, i) => P_(pigeon(scene, i)));
const DOG = P_(dackel(scene));
const BOOK = P_(buch(scene));
const PHONE = P_(handy(scene)); PHONE.userData.draw((c, w, h) => drawChats(c, w, h));
const CAL = P_(new THREE.Group()); const CALP = kalender(CAL, 4, 5);
const BOX = P_(karton(scene, 'FREITAG')), BOX2 = P_(karton(scene, 'KÜCHE')), BOX3 = P_(karton(scene, 'BÜCHER'));
const VAN = P_(umzugswagen(scene));
const SCARFH = P_(scarfHand(scene));
const BOUQ = P_(new THREE.Group()); { cyl(.08, .14, 1.6, mat(0x3a8a3a), 6, BOUQ, 0, .4, 0); for (let k = 0; k < 7; k++) { const a = k / 7 * 6.28; sphere(.3, mat([0xe8325a, 0xffd23f, 0xff8ad0][k % 3], { roughness: .7 }), BOUQ, Math.cos(a) * .35, 1.35 + (k % 2) * .15, Math.sin(a) * .35, 8, 6); } box(.7, .5, .7, mat(0xf4f0e0, { roughness: .9 }), .1, BOUQ, 0, .6, 0); }
const CTRL = P_(new THREE.Group()); { box(1.6, .3, .9, mat(0x1a1a22, { roughness: .4 }), .2, CTRL, 0, 0, 0); for (const s of [-1, 1]) sphere(.22, mat(s < 0 ? 0xd8323a : 0x2a6ad8), CTRL, s * .45, .2, 0, 8, 6); }
const SIGN6 = P_(new THREE.Group()); { box(2.8, 2.0, .1, mat(0xffffff, { roughness: .9 }), .02, SIGN6, 0, 0, 0); const t = textPlane(2.6, 1.8, 260, 180, (c, w, h) => { c.fillStyle = '#fbf6e8'; c.fillRect(0, 0, w, h); txt(c, '6 TAGE', w / 2, 62, 62, '#d8323a'); c.strokeStyle = '#1a1a22'; c.lineWidth = 5; for (let k = 0; k < 7; k++) { const x = 30 + k * 30; c.strokeRect(x, 112, 24, 24); if (k < 1) { c.beginPath(); c.moveTo(x, 112); c.lineTo(x + 24, 136); c.moveTo(x + 24, 112); c.lineTo(x, 136); c.stroke(); } } }); t.position.z = .06; SIGN6.add(t); }
const RAIN = regen(scene);
const DUST = Array.from({ length: 24 }, () => P_(sphere(1, mat(0xc8c4bc, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 8, 6)));
const SWEAT = Array.from({ length: 3 }, () => P_(sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const TEAR = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8)));
const CONF = Array.from({ length: 40 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xffd23f, 0xffffff, 0x3a7ad8, 0xff4a8a, 0x8ad84a][i % 5], side: THREE.DoubleSide })); scene.add(p); return P_(p); });
const HEARTS = Array.from({ length: 8 }, () => { const s = new THREE.Shape(); s.moveTo(0, -.6); s.bezierCurveTo(-1.2, .2, -.6, 1.1, 0, .5); s.bezierCurveTo(.6, 1.1, 1.2, .2, 0, -.6); const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: .25, bevelEnabled: false }), glowM(0xff3a6a, .6)); scene.add(m); return P_(m); });

// ---------- ambiente ----------
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.16, .44, .96], [.45, .72, 1], [.86, .94, 1]); sky.moon.visible = false; sky.sky.material.uniforms.cloud.value = 1; sky.sky.material.uniforms.starK.value = 0; hemi.intensity = 1.0; hemi.color.setRGB(.82, .9, 1); hemi.groundColor.setRGB(.6, .55, .42); sun.intensity = 3.0; sun.color.setRGB(1, .9, .76); rim.intensity = 1.9; rim.color.setRGB(1, .93, .82);
  scene.fog.color.setRGB(.82, .9, 1); scene.fog.density = .0006; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function dusk() { day(); sun.color.setRGB(1, .66, .42); sun.intensity = 2.3; setSky([.14, .18, .52], [.74, .42, .56], [1, .6, .34]); hemi.color.setRGB(.9, .74, .8); scene.fog.color.setRGB(.9, .66, .6); rim.color.setRGB(1, .6, .4); }
// noche de luna: azul profundo con luces cálidas (como la referencia), sin quedarse oscuro
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = .92; setSky([.01, .03, .1], [.03, .08, .2], [.08, .14, .28]); sky.sky.material.uniforms.cloud.value = 0; sky.sky.material.uniforms.starK.value = 1; sky.moon.visible = true; sky.moon.position.set(-300, 520, -1300); hemi.intensity = .62; hemi.color.setRGB(.45, .6, 1); hemi.groundColor.setRGB(.16, .16, .26); sun.intensity = .95; sun.color.setRGB(.62, .74, 1); rim.intensity = 1.3; rim.color.setRGB(.7, .82, 1);
  scene.fog.color.setRGB(.04, .08, .18); scene.fog.density = .0022; bloom.strength = .34; bloom.threshold = .78; FILL.intensity = fill; FILL.color.setRGB(1, .86, .7); BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; bloom.threshold = .86; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.blob.visible = true; unstone(c); if (c.pack) c.pack.visible = true; if (c.flowers) c.flowers.visible = false; }
  for (const p of PROPS) { p.visible = false; p.rotation.order = 'XYZ'; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const k in SETS) SETS[k].visible = false; FX2D.length = 0; for (const l of LP) l.intensity = 0; SO.SCARF.visible = false; RAIN.visible = false; DOG.userData.slipper.visible = true;
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
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { dist *= 1.75; if (dist2 != null) dist2 *= 1.75; const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .85, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .45 + dy, h.z + fz * d - fx * side], [h.x, h.y - .05, h.z], fov); }
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
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); } }
// plano medio/entero de un personaje: cámara delante (yaw relativo a su ry), centro a la altura del pecho
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null, dy = 3.3) { const s = ch.spec.scale || 1, p = ch.root.position, c = V(p.x, p.y + dy * s, p.z); const q = easeInOut(clamp(k)); orbit(c, lerp(dist, dist2 ?? dist * .88, q) * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const _hb = new THREE.Box3(); function heightTo(ch, m) { ch.root.updateMatrixWorld(true); _hb.makeEmpty(); ch.root.traverseVisible(o => { if (o.isMesh && o !== ch.blob) _hb.expandByObject(o, false); }); const t = _hb.max.y - ch.root.position.y; ch.root.scale.multiplyScalar(m * M2U / t); return ch; }
const toCam = ch => { const p = ch.root.position; ch.root.rotation.y = Math.atan2(camera.position.x - p.x, camera.position.z - p.z); };
// ---------- escenarios por plano ----------
function lp(i, x, y, z, k = 40, col = 0xffb060, d = 60) { const l = LP[i]; l.position.set(x, y, z); l.intensity = k; l.color.setHex(col); l.distance = d; }
// Marktplatz: o.night (medianoche), o.dusk (atardecer: las 16:30 de Mia), o.rain (lluvia), o.dawn
function platz(L, o = {}) { use('HB'); HB.RANK.visible = false;
  if (o.night) { night(o.fill ?? 30); lp(0, P.x - 12, 10, P.z + 14, 50); lp(1, P.x + 12, 10, P.z + 14, 50); lp(2, P.x, 9, BZ + 6, 40); lp(3, P.x, 14, P.z + 4, 30, 0xffe0b0); }
  else if (o.dusk) { dusk(); sun.intensity = 2.6; }
  else if (o.rain) { day(); setSky([.36, .4, .48], [.5, .54, .6], [.62, .66, .72]); sun.intensity = .6; hemi.intensity = 1.1; scene.fog.color.setRGB(.6, .64, .7); scene.fog.density = .004; BIRDSON = 0; RAIN.visible = true; RAIN.userData.update(L.T, CAMT.clone().add(V(0, 0, 0))); }
  else if (o.dawn) { dusk(); sun.intensity = 1.8; sun.color.setRGB(1, .8, .62); }
  else day(); }
// las dos estatuas en el pedestal (o.finn / o.jonas = false para quitar una); expresiones de los ojos con o.fe / o.je
const STF = { aLx: .05, aRx: .05, aLz: .06, aRz: .06, headX: .05 }, STJ = { aRx: .2, aRz: .55, aRe: 1.7, aLx: .35, aLz: .15, aLe: .3, headZ: -.06 };
function statues(L, o = {}) { const out = {};
  if (o.jonas !== false) { const j = put(jonas, P.x - SPX, TOP, P.z, 0); actuar(j, 0, [[0, STJ]], { T: L.T, weight: false }); j.blob.visible = false; stone(j, 1); cara(j, L.T, o.je || { eyes: 'half', mouth: 'flat', noBlink: true }); out.j = j; }
  if (o.finn !== false) { const f = put(finn, P.x + SPX, TOP, P.z, 0); actuar(f, 0, [[0, { ...STF, ...(o.fp || {}) }]], { T: L.T, weight: false }); f.blob.visible = false; stone(f, 1); cara(f, L.T, o.fe || { expr: 'sad' }); out.f = f; }
  return out; }
const headF = () => hp(finn), headJ = () => hp(jonas);
function myRoom(L, o = {}) { use('KZ'); if (o.night) { inside(.55, 20); FILL.color.setRGB(.8, .86, 1); KZ.WN.p.material.map = KZ.WN.night; lp(1, KZX - 1, 8, -8, 26, 0xffc870, 24); } else { inside(.95, 38); KZ.WN.p.material.map = KZ.WN.day; } }
function miaRoom(L) { use('MZ'); inside(.95, 38); MZ.WN.p.material.map = MZ.WN.day; }
function cousinRoom(L) { use('CZ'); inside(.8, 30); FILL.color.setRGB(.9, .94, 1); }
function school(L) { use('KL'); inside(.95, 30); }
function mallS(L) { use('ML'); inside(1.1, 40); ML.g.userData.run(L.T); }
// ---------- gestos de esta pieza ----------
// anda desde (x, z) hacia ry
function walk(ch, L, x, z, ry, speed = 2.4, i = 0, o = {}) { const d = speed * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, 0, z + Math.cos(ry) * d, ry); ch.root.position.y = Math.abs(Math.sin(L.T * 9 + i)) * .1; actuar(ch, 0, [[0, { ...walkP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); if (o.face !== false) cara(ch, L.T, o.f || { expr: o.expr || 'neutral' }); return ch; }
// Mia sentada en el banco de enfrente mirando al pedestal (ry = PI)
function miaBench(L, pose = {}, ch = mia) { const c = sit(ch, P.x + .2, 2.4, BZ - .3, PI, L, { aLx: .45, aRx: .45, aLe: .9, aRe: .9, ...pose }); if (c.pack) c.pack.visible = false; return c; }
function hearts(c, T, n = 6, r = 3) { HEARTS.forEach((m, i) => { if (i >= n) return; const t = (T * .5 + i / n) % 1; m.visible = true; m.position.set(c.x + Math.sin(i * 2.3) * r, c.y + t * 6, c.z + Math.cos(i * 1.7) * .8); m.rotation.set(0, T * 2 + i, Math.PI); m.scale.setScalar(.7 * Math.sin(t * PI) + .1); }); }
// palomas: posadas (o.at = [x, y, z]) o volando hacia un punto
function dove(i, x, y, z, ry, T, f = 0) { const p = show(PG[i], x, y, z, ry, 1); p.userData.pose(T + i, f); return p; }
// grietas/polvo de piedra que cae
function stoneDust(c, T0, T, n = 14, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0 - r() * .2; if (t < 0 || t > 1.4) return; d.visible = true; d.position.set(c.x + (r() - .5) * 3 * s, c.y + 2 * s - t * t * 5, c.z + (r() - .5) * 3 * s); d.scale.setScalar((.12 + r() * .18) * s); d.material.opacity = .9 * (1 - t / 1.4); }); }
function bigNum(text, k, col = '#ffffff', y = .2, sc = 1) { badge(col === 'red' ? 'red' : col === 'gold' ? 'gold' : col === 'green' ? 'green' : 'big', text, W / 2, H * y, k, 1, sc); }
// multitud de extras alrededor (paseando, charlando…)
function extras(L, list, spots, mode = 'walk') { list.forEach((c, i) => { const [x, z, ry] = spots[i % spots.length]; if (mode === 'walk' || (Array.isArray(mode) && mode[i % mode.length] === 'walk')) walk(c, L, x, z, ry, 2.2, i, { expr: 'happy' }); else crowdGuy(c, x, z, L, i, { mode: Array.isArray(mode) ? mode[i % mode.length] : mode, ry }); }); }
const CR = EXS; function clearFaces() {}
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
const KEY = /^(Stadt|Statue|Jahr|Freundin|Freund|küsst|drei|Jahren|Freitag|niemand|gewarnt|Neue|Mädchen|Stein|Cousin|letzten|Tag|geschrieben|keine|rechtzeitig|Mitternacht|Bank|Marktplatz|Füße|schwer|Beine|Brust|Bürgermeister|Sockel|Jonas|Museum|niemand|sehen|hören|alles|bewegen|Ex|anderen|nie|Kinder|Tauben|Kopf|alter|Mann|Kummer|Donnerstag|grünen|Jacke|verlegen|Hallo|komisch|reden|halb|fünf|Schule|Lehrerin|anschrie|Brezel|Hund|Hausschuhe|Rolltreppen|Buch|still|Schal|kalt|verliebt|blinzeln|Stunden|Regentage|schlimmsten|Samstag|verweinten|sechs|allein|schreien|springen|Hand|Tage|verstand|versteht|Drei|länger|mutig|nicht|Nacht|Straße|sechsten|früher|Kleid|Haare|peinlich|getraut|nah|küsste|Finger|Knie|Staub|vorbeigelaufen|gesehen|verwirrt|heißt|lachte|weinte|Namen|Lieblingsfarbe|Hundes|nichts|mich)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
let DARK = 0, TINT = null, SHAKE = 0; let HUD = null; const FX2D = [];
// ---------- a: gancho, la regla, cómo me volví estatua (0 – 48,09 s) ----------
// Plaza: pedestal en P (-6, 0, -50) mirando a +z; estatuas en P.x ∓ 3,6 (Jonas izq., Finn der.), y = TOP; banco de enfrente en z = BZ (-28), mirando a -z.
const SPOTS = [[P.x - 16, P.z + 30, PI / 2], [P.x + 18, P.z + 40, -PI / 2], [P.x - 10, P.z + 52, PI * .8], [P.x + 12, P.z + 18, -PI * .7], [P.x - 22, P.z + 12, PI / 3], [P.x + 22, P.z + 6, -PI / 3]];
const petrify = (ch, L, t0, dur = .35, T0 = null) => { const k = clamp((L.lt - t0) / dur) * 1.08; stone(ch, k); if (k > 0 && k < 1.08) stoneDust(hp(ch).add(V(0, -4 * k, 0)), L.t0 + t0, L.T, 10, .7); return k; };
// 1 «In dieser Stadt»: en el Marktplatz, un chico con camisa amarilla y un ramo busca a una chica girando la cabeza a los lados… y en un segundo se vuelve de piedra de los pies a la cabeza
shot(0, 'C', null, L => { platz(L); const c = put(sucher, P.x, 0, P.z + 30, 0); c.flowers.visible = true; const look = Math.sin(L.lt * 9);
  actuar(c, 0, [[0, { aRx: 1.1, aRe: .9, aRz: -.1, aLx: .2, aLz: .15, headY: L.lt < .45 ? look * .6 : .15, lean: -.03 }]], { T: L.T });
  const k = petrify(c, L, .42, .32); cara(c, L.T, k > .6 ? { eyes: 'wide', mouth: 'o', noBlink: true } : { expr: 'happy', eyes: look > 0 ? 'side_l' : 'side_r', mouth: 'smile' });
  extras(L, EXS.slice(0, 4), SPOTS); statues(L);
  orbit(V(P.x, 4.4, P.z + 30), lerp(17, 12.5, easeOut(L.k)), .1, .08, 44); sh(V(P.x, 0, P.z + 26), 30); },
  [[0, 'zoom_fast', .6], [.05, 'steps', .4], [.42, 'stone_crack', .8], [.5, 'rubble', .5]]);
// 2 «wirst du zur Statue,»: el pedestal «1 JAHR SINGLE» con las dos estatuas; la gente señala y hace fotos; grúa hacia el pedestal
shot(.86, 'W', 'punch', L => { platz(L); statues(L, { fe: { eyes: 'side_l', mouth: 'flat', noBlink: true } }); extras(L, EXS.slice(4, 9), [[P.x - 6, P.z + 16, PI * .95], [P.x + 6, P.z + 17, -PI * .95], [P.x - 12, P.z + 22, PI * .8], [P.x + 11, P.z + 24, -PI * .8], [P.x + 1, P.z + 26, PI]], ['point', 'shock', 'point', 'talk', 'shock']);
  cm([P.x, 9, P.z + 32, P.x, 4.6, P.z, 46], [P.x, 7.6, P.z + 24, P.x, 5, P.z, 44], L.k); sh(V(P.x, 0, P.z + 10), 32); }, [[.05, 'crowd_gasp', .5], [.3, 'camera_click', .5]]);
// 3 «wenn du ein Jahr lang keine Freundin»: Finn (antes) en su cuarto, solo en la cama, desliza el móvil sin chats; el calendario lleno de cruces; «1 JAHR»
shot(2.16, 'C', 'punch', L => { myRoom(L); const c = sit(finn, KZX - 9, 3.7, -4.6, 0, L, { aRx: .9, aRe: 1.2, aLx: .8, aLe: 1.3, headX: .08 }); attach(PHONE, c.aR.hand, [0, -.55, .5], [-.4, 0, 0], .9); cara(c, L.T, { expr: 'sad' });
  show(CAL, KZX - 2, 9, -11.7); CALP.userData.draw((x, w, h) => { x.fillStyle = '#fbf6e8'; x.fillRect(0, 0, w, h); x.fillStyle = '#d8323a'; x.fillRect(0, 0, w, 70); txt(x, '365 TAGE', w / 2, 40, 44, '#ffffff'); x.strokeStyle = '#1a1a22'; x.lineWidth = 3; for (let k = 0; k < 35; k++) { const cx = 30 + (k % 7) * 50, cy = 110 + Math.floor(k / 7) * 74; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + 34, cy + 34); x.moveTo(cx + 34, cy); x.lineTo(cx, cy + 34); x.stroke(); } });
  onFace(c, 6.4, -1.4, 1.8, 42, L.k, 5.4); bigNum('1 JAHR', clamp((L.lt - .45) / .2), 'gold', .2, 1.1); }, [[.1, 'phone_tap', .5], [.5, 'pling', .4]]);
// 4 «oder keinen Freund hast.»: en clase, una chica sola en su pupitre mientras las demás van en pareja; la piedra le sube por los pies
shot(3.76, 'S', null, L => { school(L); const g = sit(EXS[2], KLX, 3.3, 6, 0, L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, headX: .25 }); stone(g, .28 + L.k * .18); cara(g, L.T, { expr: 'sad', mouth: 'wavy' });
  sit(EXS[4], KLX - 11, 3.3, 6, .4, L, { aRx: 1.2, aRz: -.6, aRe: .4 }); cara(EXS[4], L.T, { expr: 'happy', mouth: 'laugh' }); sit(EXS[0], KLX - 8.6, 3.3, 6, -.4, L, { aLx: 1.2, aLz: .6, aLe: .4 }); cara(EXS[0], L.T, { expr: 'happy', mouth: 'open_smile' });
  cm([KLX + 2, 8.6, 18, KLX, 4.6, 6, 44], [KLX + 1, 8, 15, KLX, 4.6, 6, 42], L.k); }, [[0, 'swipe', .4], [.2, 'stone_crack', .5], [.5, 'girls_laugh', .3]]);
// 5 «Und bewegen kannst du dich erst wieder,»: una estatua del parque (piedra entera) mueve solo los ojos a un lado y al otro: está viva dentro; órbita lenta
shot(4.86, 'F', null, L => { platz(L); const c = put(EXS[3], P.x + 24, 0, P.z + 6, -.5); actuar(c, 0, [[0, { aRx: 2.6, aRz: .3, aRe: .3, aLx: .1, headY: .1 }]], { T: L.T }); stone(c, 1); cara(c, L.T, { eyes: Math.sin(L.T * 4) > 0 ? 'side_l' : 'side_r', mouth: 'flat', noBlink: true });
  extras(L, EXS.slice(9, 12), SPOTS.slice(3)); const p = c.root.position; orb(L.k, V(p.x, 5.2, p.z), null, [12, -.7, .05, 42], [10, -.25, .05, 42]); sh(V(p.x, 0, p.z), 26); }, [[0, 'flash', .4], [.3, 'creepy_ting', .5], [.9, 'eyes_move', .4]]);
// 6 «wenn dich jemand küsst.»: una chica besa la mejilla de piedra de un chico: el color le vuelve de la cabeza a los pies, corazones
shot(6.67, 'C', 'punch', L => { platz(L, { dusk: true }); const b = put(EXS[1], P.x + 1.2, 0, P.z + 30, -PI / 2 + .25), g = put(EXS[6], P.x - 1.6, 0, P.z + 30.6, PI / 2 - .2); const u = clamp((L.lt - .35) / .5);
  actuar(g, 0, [[0, { lean: .18, aLx: 1.2, aLe: .8, aRx: .9, aRz: -.2, headX: .1 }]], { T: L.T }); cara(g, L.T, { eyes: 'closed', mouth: 'o' });
  actuar(b, 0, [[0, { aLx: .1, aRx: .1, headY: u * .3 }]], { T: L.T }); stone(b, 1.1 - u * 1.1); cara(b, L.T, u > .2 ? { eyes: 'wide', mouth: 'open_smile', noBlink: true } : { eyes: 'half', mouth: 'flat', noBlink: true });
  if (L.lt > .3) hearts(V(P.x, 8, P.z + 30), L.T, 5, 2.5); stoneDust(V(P.x + 1.2, 6, P.z + 30), L.t0 + .35, L.T, 12, .8);
  onBody(b, 12, -.25, .1, 42, L.k, 10, -.15, 2.6); sh(V(P.x, 0, P.z + 30), 20); }, [[.3, 'kiss', .7], [.4, 'stone_crack', .5], [.6, 'sparkle', .5]]);
// 7 «Ich bin vor drei Jahren zur Statue geworden.» (zoom lento): yo, Finn, de piedra en el pedestal; la cámara se acerca a mi cara; «3 JAHRE»
shot(7.8, 'Z', 'slow', L => { platz(L); const s = statues(L, { fe: { expr: 'sad', noBlink: true } }); extras(L, EXS.slice(0, 3), SPOTS.slice(1));
  onFace(finn, 9, -.6, 0, 42, L.k, 5.4); bigNum('3 JAHRE', clamp((L.lt - .35) / .2), 'gold', .19, 1.05); sh(V(P.x, 0, P.z + 6), 28); }, [[.35, 'pling', .4]]);
// 8 «Wir sind an einem Freitag hergezogen,»: la furgoneta de mudanza en la plaza; yo (antes) bajo cargando la caja «FREITAG»
shot(9.83, 'W', null, L => { platz(L); show(VAN, P.x + 26, 0, P.z + 66, -PI / 2 + .3); const c = walk(finn, L, P.x + 6, P.z + 52, -.3, 1.6, 0, { pose: { aLx: 1.2, aRx: 1.2, aLe: 1.0, aRe: 1.0, aLz: -.1, aRz: -.1 }, expr: 'happy' });
  attach(BOX, c.root, [0, 2.6, 1.8], [0, 0, 0], .85); show(BOX2, P.x + 14, 0, P.z + 58, .3, .9); show(BOX3, P.x + 14.4, 2.2, P.z + 58, -.2, .8);
  const p = c.root.position; orbit(V(p.x, 4, p.z), lerp(14, 12, L.k), -.5, .1, 44); sh(V(p.x, 0, p.z), 30); }, [[0, 'truck_door', .5], [.2, 'box_drop', .4], [.4, 'steps', .4]]);
// 9 «und niemand hat uns gewarnt.»: dos vecinas cuchichean tapándose la boca y me miran de reojo; yo saludo sin enterarme
shot(11.21, 'S', null, L => { platz(L); const a = put(EXS[0], P.x - 2, 0, P.z + 46, .5), b = put(EXS[2], P.x + 1.4, 0, P.z + 46.6, -.6);
  actuar(a, 0, [[0, { aRx: 1.9, aRe: 1.9, aRz: -.4, lean: .15, headY: .5 }]], { T: L.T }); actuar(b, 0, [[0, { aLx: 1.9, aLe: 1.9, aLz: .4, lean: .12, headY: -.4 }]], { T: L.T }); cara(a, L.T, { expr: 'sus', eyes: 'side_r' }); cara(b, L.T, { expr: 'sus', eyes: 'side_l' });
  const f = put(finn, P.x + 6.4, 0, P.z + 43, -.5); actuar(f, 0, [[0, 'wave']], { T: L.T }); cara(f, L.T, { expr: 'happy', mouth: 'open_smile' });
  cm([P.x + 2, 7.4, P.z + 66, P.x + 2.4, 4.2, P.z + 44, 46], [P.x + 2.6, 7.2, P.z + 64, P.x + 2.6, 4.2, P.z + 44, 44], L.k); sh(V(P.x, 0, P.z + 46), 22); }, [[0, 'swipe', .4], [.2, 'whisper', .5], [.6, 'hmm', .3]]);
// 10 «Deshalb war ich ein ganzes Jahr lang der Neue,»: en la clase, de pie delante de la pizarra «HERZLICH WILLKOMMEN, FINN»; todos me miran
shot(12.89, 'C', 'punch', L => { school(L); KL.BB.userData.draw && KL.BB.userData.draw('willk', (c, w, h) => { c.fillStyle = '#1e3a2a'; c.fillRect(0, 0, w, h); txt(c, 'Herzlich willkommen,', w / 2, h * .36, 70, '#ffffff'); txt(c, 'Finn!', w / 2, h * .7, 110, '#ffd23f'); });
  const f = put(finn, KLX, 0, -9, 0); actuar(f, 0, [[0, { aLx: .2, aRx: .2, aLz: -.25, aRz: -.25, aLe: .6, aRe: .6 }]], { T: L.T }); cara(f, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(f, L.T, 1);
  [[-11, -2], [11, -2], [-11, 6], [11, 6]].forEach(([x, z], i) => { const c = sit(EXS[i + 4], KLX + x, 3.3, z, PI + (x > 0 ? .5 : -.5), L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6 }); cara(c, L.T, { expr: 'sus' }); });
  onBody(f, 13, 0, .08, 44, L.k, 11, 0, 3); bigNum('1 JAHR', clamp((L.lt - 1.1) / .2), 'gold', .19, .95); }, [[.1, 'chalk', .4], [.5, 'class_murmur', .4], [1.1, 'pling', .4]]);
// 11 «und kein Mädchen»: le ofrezco flores a una chica en la plaza; ella se cruza de brazos y gira la cabeza
shot(14.81, 'W', null, L => { platz(L); const f = put(finn, P.x + 3.2, 0, P.z + 33, -PI / 2 + .7); actuar(f, 0, [[0, { aRx: 1.5, aRe: .3, aRz: .1, lean: .1 }]], { T: L.T }); attach(BOUQ, f.aR.hand, [0, -.5, .5], [0, 0, 0], 1); cara(f, L.T, { expr: 'happy', mouth: 'smile' });
  const g = put(ex, P.x - .6, 0, P.z + 32.4, .5); actuar(g, 0, [[0, { aLx: .15, aRx: .15, aLe: 1.55, aRe: 1.55, aLz: -.35, aRz: -.35, headY: clamp(L.lt / .3) * -.7 }]], { T: L.T }); cara(g, L.T, { expr: 'angry', mouth: 'flat' });
  orb(L.k, V(P.x + 1.2, 4.2, P.z + 33), null, [14, .2, .08, 42], [12, .15, .08, 42]); sh(V(P.x, 0, P.z + 34), 22); }, [[0, 'whoosh', .4], [.3, 'hmph', .5]]);
// 12 «wollte meine Freundin sein.»: me quedo solo con las flores en el banco; las chicas se van riéndose
shot(15.77, 'S', null, L => { platz(L, { dusk: true }); const f = sit(finn, P.x, 2.4, BZ - .3, PI, L, { aRx: .6, aRe: .8, aLx: .4, headX: .12 }); attach(BOUQ, f.aR.hand, [0, -.5, .5], [.8, 0, 0], 1); cara(f, L.T, { expr: 'sad' });
  walk(EXS[2], L, P.x - 4, BZ - 12, -PI / 2 - .4, 2.2, 0, { f: { expr: 'happy', mouth: 'laugh' } }); walk(EXS[4], L, P.x - 6, BZ - 14, -PI / 2 - .4, 2.2, 1, { f: { expr: 'happy', mouth: 'open_smile' } });
  cm([P.x + 1, 6.6, BZ - 13, P.x, 4.2, BZ, 44], [P.x + .5, 6.2, BZ - 11, P.x, 4.2, BZ, 42], L.k); sh(V(P.x, 0, BZ), 22); }, [[0, 'swipe', .4], [.3, 'girls_laugh', .4], [.8, 'sad_sigh', .5]]);
// 13 «Jeder kennt jemanden, der hier sofort»: la plaza llena; travelling lateral por grupos de amigos que se señalan unos a otros riéndose
shot(17.03, 'Z', null, L => { platz(L); const G1 = [[-12, 20], [-8, 21], [4, 22], [8, 21.4], [16, 20], [20, 21]]; G1.forEach(([x, z], i) => { const c = put(EXS[i], P.x + x, 0, P.z + z, i % 2 ? -.6 : .6); actuar(c, 0, [[0, i % 2 ? GEST.point || { aRx: 1.6 } : { aLx: .4, aRx: .4, aLz: .5, aRz: .5, aLe: 1.4, aRe: 1.4, lean: -.1 }]], { T: L.T }); laughF(c, L.T + i); });
  statues(L); cm([P.x - 12, 6.4, P.z + 38, P.x - 6, 4.6, P.z + 20, 46], [P.x + 14, 6.4, P.z + 38, P.x + 12, 4.6, P.z + 20, 46], L.k, x => x); sh(V(P.x, 0, P.z + 20), 34); }, [[0, 'zoom_in', .4], [.2, 'crowd_laugh', .5]]);
// 14 «zu Stein werden würde.»: uno de ellos se vuelve piedra de golpe y su amigo se dobla de la risa
shot(18.63, 'C', 'punch', L => { platz(L); const a = put(EXS[3], P.x - 1.5, 0, P.z + 26, .3), b = put(EXS[0], P.x + 2.2, 0, P.z + 26.4, -.4); actuar(a, 0, [[0, { aRx: .4, aLx: .3, headY: .2 }]], { T: L.T }); const k = petrify(a, L, .12, .28); cara(a, L.T, k > .7 ? { eyes: 'wide', mouth: 'o', noBlink: true } : { expr: 'shock' });
  actuar(b, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: .8, aLe: 1.8, lean: .2 }]], { T: L.T }); laughF(b, L.T);
  cm([P.x, 6.6, P.z + 38, P.x, 4.6, P.z + 26, 42], [P.x, 6.4, P.z + 36, P.x, 4.8, P.z + 26, 40], L.k); sh(V(P.x, 0, P.z + 26), 20); }, [[.12, 'stone_crack', .7], [.4, 'crowd_laugh', .4]]);
// 15 «Wer wäre das bei dir?»: yo, de piedra, giro los ojos y miro directamente a cámara; «?»
shot(19.96, 'F', null, L => { platz(L); statues(L, { fe: { eyes: L.lt > .3 ? 'normal' : 'side_r', mouth: 'flat', noBlink: true } }); onFace(finn, 5, -.4, 0, 40, L.k, 4.2); badge('q', '?', W * .78, H * .3, clamp((L.lt - .35) / .2)); }, [[0, 'flash', .3], [.3, 'eyes_move', .5], [.4, 'pop', .4]]);
// 16 «Bei mir?»: en mi cuarto (antes), me señalo a mí mismo pensando
shot(20.97, 'C', 'punch', L => { myRoom(L); const c = put(finn, KZX - 2, 0, 0, -.2); actuar(c, 0, [[0, { aRx: 1.2, aRe: 1.9, aRz: -.55, aLx: .2, aLz: .1, headZ: .15, headX: -.08 }]], { T: L.T }); talk(c, L.T, 20.9, 21.6, 'confused'); onFace(c, 5.6, 0, .6, 40, L.k, 4.8); }, [[0, 'impact', .4], [.15, 'hmm', .4]]);
// 17 «Ganz klar:»: mi primo en su cuarto, jugando a la consola en la cama, con cascos, gritando
shot(21.58, 'W', null, L => { cousinRoom(L); const c = sit(cousin, CZX - 3, 3.7, -3, 0, L, { aLx: .8, aRx: .8, aLe: 1.5, aRe: 1.5, aLz: -.35, aRz: -.35, headX: .15 }); attach(CTRL, c.aR.hand, [-.5, -.7, .3], [0, 0, 0], .6); cara(c, L.T, { expr: 'determined', mouth: Math.sin(L.T * 12) > 0 ? 'o' : 'grimace' });
  cm([CZX - 1, 8, 10, CZX - 3, 5, -3, 44], [CZX - 1.6, 7.6, 8.4, CZX - 3, 5, -3, 42], L.k); }, [[0, 'whoosh', .4], [.1, 'game_beeps', .5]]);
// 18 «mein Cousin.»: el primo se queda de piedra al instante, con el mando en la mano; «COUSIN»
shot(22.33, 'C', 'punch', L => { cousinRoom(L); const c = sit(cousin, CZX - 3, 3.7, -3, 0, L, { aLx: .8, aRx: .8, aLe: 1.5, aRe: 1.5, aLz: -.35, aRz: -.35, headX: .15 }); attach(CTRL, c.aR.hand, [-.5, -.7, .3], [0, 0, 0], .6); stone(c, 1.1); cara(c, L.T, { eyes: 'half', mouth: 'flat', noBlink: true });
  onFace(c, 6, 0, -.6, 40, L.k, 5); badge('tag', 'MEIN COUSIN', W / 2, H * .2, clamp((L.lt - .1) / .2)); }, [[0, 'stone_crack', .8], [.2, 'game_over', .4]]);
// 19 «Ich erinnere mich noch an den letzten Tag.»: el calendario de mi cuarto: tacho el último día con un rotulador rojo; «LETZTER TAG»
shot(23.08, 'I', null, L => { myRoom(L); const c = put(finn, KZX - 2, 0, -8.6, PI); const k = clamp((L.lt - .3) / .8); actuar(c, 0, [[0, { aRx: 2.2 + Math.sin(L.T * 14) * .08 * k, aRe: .5, aRz: -.1, aLx: .2 }]], { T: L.T });
  show(CAL, KZX - 2.6, 8.8, -11.7); CALP.userData.draw((x, w, h) => { x.fillStyle = '#fbf6e8'; x.fillRect(0, 0, w, h); x.fillStyle = '#d8323a'; x.fillRect(0, 0, w, 70); txt(x, 'LETZTER TAG', w / 2, 40, 42, '#ffffff'); x.strokeStyle = '#1a1a22'; x.lineWidth = 3; for (let q = 0; q < 35; q++) { const cx = 30 + (q % 7) * 50, cy = 110 + Math.floor(q / 7) * 74; x.strokeRect(cx, cy, 34, 34); if (q < 34 || k > .5) { x.strokeStyle = q === 34 ? '#d8323a' : '#1a1a22'; x.lineWidth = q === 34 ? 7 : 3; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + 34, cy + 34); x.moveTo(cx + 34, cy); x.lineTo(cx, cy + 34); x.stroke(); x.strokeStyle = '#1a1a22'; x.lineWidth = 3; } } });
  cm([KZX + 4, 8.4, 4, KZX - 2.4, 7, -11, 46], [KZX + 3, 8.2, 2, KZX - 2.4, 7.2, -11, 44], L.k); }, [[0, 'iris_pop', .4], [.4, 'marker', .6]]);
// 20 «Ich habe jedem Mädchen geschrieben,»: primerísimo plano del móvil: los chats se van llenando de mensajes
shot(24.86, 'C', 'punch', L => { myRoom(L, { night: true }); const n = Math.min(5, Math.floor(L.lt / .22) + 1); PHONE.userData.draw((c, w, h) => drawChats(c, w, h, n, '23:41')); show(PHONE, KZX - 9, 6, -4, 0, 2.4); PHONE.rotation.x = -.15;
  cm([KZX - 9, 6.6, 3.2, KZX - 9, 6, -4, 40], [KZX - 9, 6.4, 2.4, KZX - 9, 6, -4, 38], L.k); }, [[.05, 'typing', .6], [.4, 'msg_send', .4], [.8, 'msg_send', .4]]);
// 21 «das ich kannte.»: yo en la cama, de noche, tecleando a toda prisa, sudando
shot(26.1, 'S', null, L => { myRoom(L, { night: true }); const c = sit(finn, KZX - 9, 3.7, -4.6, 0, L, { aRx: 1.3 + Math.sin(L.T * 30) * .05, aRe: 1.4, aLx: 1.3, aLe: 1.4, headX: .3 }); attach(PHONE, c.aR.hand, [0, -.55, .5], [-.4, 0, 0], .9); PHONE.userData.draw((x, w, h) => drawChats(x, w, h, 5, '23:44')); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T, 2);
  onFace(c, 6, .5, 1, 40, L.k, 5); }, [[0, 'swipe', .4], [.1, 'typing', .6]]);
// 22 «Aber keine hat»: me quedo mirando la pantalla, esperando, con el pie que se mueve nervioso
shot(27.21, 'C', 'punch', L => { myRoom(L, { night: true }); const c = sit(finn, KZX - 9, 3.7, -4.6, 0, L, { aRx: 1.1, aRe: 1.5, aLx: .5, headX: .4, lLx: 1.5 + Math.abs(Math.sin(L.T * 14)) * .2 }); attach(PHONE, c.aR.hand, [0, -.55, .5], [-.4, 0, 0], .9); cara(c, L.T, { expr: 'worried' });
  onBody(c, 10, .2, .15, 42, L.k, 8.6, .2, 2.6); }, [[0, 'impact', .4], [.3, 'clock_tick', .5]]);
// 23 «rechtzeitig geantwortet.»: la pantalla: 23:59, ninguna respuesta; «23:59» en rojo
shot(27.93, 'Z', null, L => { myRoom(L, { night: true }); PHONE.userData.draw((c, w, h) => drawChats(c, w, h, 5, '23:59')); show(PHONE, KZX - 9, 6, -4, 0, 2.4); PHONE.rotation.z = .1;
  cm([KZX - 8.6, 6.4, 2.6, KZX - 9, 6, -4, 40], [KZX - 9.2, 6.2, 2.2, KZX - 9, 6, -4, 38], L.k); bigNum('23:59', clamp((L.lt - .1) / .2), 'red', .2, 1.1); }, [[0, 'zoom_in', .4], [.1, 'clock_tick', .6], [.9, 'clock_tick', .5]]);
// 24 «Um Mitternacht»: la plaza de noche, grúa; el reloj del Rathaus marca las doce; «0:00»
shot(29.23, 'W', null, L => { platz(L, { night: true }); statues(L, { finn: false }); sit(finn, P.x, 2.4, BZ - .3, PI, L, { aLx: .4, aRx: .4, headX: .3 }); cara(finn, L.T, { expr: 'sad' });
  cm([P.x + 6, 24, BZ + 34, P.x, 4, P.z, 50], [P.x + 4, 16, BZ + 24, P.x, 5, P.z, 48], L.k); bigNum('0:00', clamp((L.lt - .2) / .2), 'gold', .2, 1.1); sh(V(P.x, 0, P.z + 10), 50); }, [[0, 'church_bell', .6], [.2, 'night_amb', .4]]);
// 25 «saß ich auf der Bank am Marktplatz.»: yo solo en el banco bajo la farola, con el móvil apagado
shot(30.41, 'C', 'punch', L => { platz(L, { night: true }); const c = sit(finn, P.x, 2.4, BZ - .3, PI, L, { aLx: .6, aRx: .6, aLe: 1.2, aRe: 1.2, headX: .15 }); cara(c, L.T, { expr: 'sad' }); attach(PHONE, c.aR.hand, [0, -.55, .5], [-.6, 0, 0], .9); PHONE.userData.draw((x, w, h) => { x.fillStyle = '#0a0a10'; x.fillRect(0, 0, w, h); });
  onBody(c, 12, .3, .12, 42, L.k, 10, .1, 2.6); sh(V(P.x, 0, BZ), 20); }, [[0, 'impact', .4], [.2, 'crickets', .4], [.7, 'sad_sigh', .4]]);
// 26 «Zuerst wurden meine Füße schwer,»: primer plano de mis zapatillas en el adoquín: se vuelven gris piedra con un crujido
shot(31.72, 'F', null, L => { platz(L, { night: true }); const c = sit(finn, P.x, 2.4, BZ - .3, PI, L, { aLx: .6, aRx: .6, aLe: 1.2, aRe: 1.2, headX: .3 }); stone(c, .08 + clamp((L.lt - .3) / .6) * .12); cara(c, L.T, { expr: 'shock', eyes: 'down' });
  stoneDust(V(P.x, .6, BZ - 2), L.t0 + .35, L.T, 8, .5); cm([P.x + 3, 3.4, BZ - 9, P.x, 1.2, BZ - 1.6, 40], [P.x + 2.4, 3.2, BZ - 7.6, P.x, 1.2, BZ - 1.6, 38], L.k); }, [[0, 'flash', .4], [.35, 'stone_crack', .7], [.8, 'rubble', .4]]);
// 27 «dann meine Beine,»: la piedra sube por las piernas; me agarro las rodillas asustado
shot(33.36, 'C', 'punch', L => { platz(L, { night: true }); const c = sit(finn, P.x, 2.4, BZ - .3, PI, L, { aLx: .9, aRx: .9, aLe: .6, aRe: .6, lean: .25, headX: .15 }); stone(c, .25 + L.k * .15); cara(c, L.T, { expr: 'shock', eyes: 'scared', mouth: 'o' }); sweat(c, L.T, 2);
  onBody(c, 9, -.4, .2, 42, L.k, 8, -.3, 2); }, [[0, 'stone_crack', .7], [.3, 'gasp', .5]]);
// 28 «dann meine Brust.»: la piedra me llega al pecho; me llevo la mano al pecho, sin aire
shot(34.29, 'C', 'punch', L => { platz(L, { night: true }); const c = sit(finn, P.x, 2.4, BZ - .3, PI, L, { aRx: 1.4, aRe: 1.9, aRz: -.5, aLx: .4, headX: -.15 }); stone(c, .45 + L.k * .25); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  onFace(c, 6, 0, .4, 40, L.k, 4.6); }, [[0, 'stone_crack', .8], [.3, 'heartbeat', .6]]);
// 29 «Am Morgen ließ mich der Bürgermeister»: por la mañana, el alcalde con su cadena dorada señala mi estatua (aún en el banco) a dos operarios
shot(35.28, 'W', null, L => { platz(L, { dawn: true }); const s = sit(finn, P.x, 2.4, BZ - .3, PI, L, { aLx: .6, aRx: .6, aLe: 1.2, aRe: 1.2, headX: .15 }); stone(s, 1.1); cara(s, L.T, { expr: 'sad', noBlink: true });
  const m = put(mayor, P.x - 6, 0, BZ - 7, .5); actuar(m, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: .3, lean: -.05 }]], { T: L.T }); talk(m, L.T, 35.2, 36.6, 'smug');
  walk(EXS[7], L, P.x + 9, BZ - 12, -PI * .6, 1.6, 0, { expr: 'neutral' }); walk(EXS[9], L, P.x + 12, BZ - 10, -PI * .6, 1.6, 1, { expr: 'neutral' });
  cm([P.x - 1, 7, BZ - 26, P.x - 3, 4.4, BZ - 3, 46], [P.x - 1.5, 6.8, BZ - 23, P.x - 3, 4.4, BZ - 3, 44], L.k); sh(V(P.x, 0, BZ - 4), 26); }, [[0, 'whoosh', .4], [.1, 'birds', .4], [.5, 'steps', .4]]);
// 30 «auf einen Sockel stellen,»: los operarios suben mi estatua al pedestal con una grúa pequeña; el alcalde da palmadas
shot(36.65, 'C', 'punch', L => { platz(L, { dawn: true }); statues(L, { finn: false }); const u = easeOut(clamp(L.lt / .9)); const f = put(finn, P.x + SPX, lerp(TOP + 3, TOP, u), P.z + lerp(3, 0, u), 0); actuar(f, 0, [[0, STF]], { T: L.T, weight: false }); f.blob.visible = false; stone(f, 1.1); cara(f, L.T, { expr: 'sad', noBlink: true });
  [[P.x + 10, P.z + 6, -.9], [P.x + 13, P.z + 2, -1.2]].forEach(([x, z, ry], i) => { const w = put(EXS[7 + i * 2], x, 0, z, ry); actuar(w, 0, [[0, { aLx: 2.5, aRx: 2.5, aLe: .3, aRe: .3, lean: -.12 }]], { T: L.T }); cara(w, L.T, { expr: 'determined', mouth: 'grimace' }); });
  const m = put(mayor, P.x - 4, 0, P.z + 12, -.3); const cl = Math.sin(L.T * 14); actuar(m, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.2 - cl * .25, aRz: -.2 - cl * .25, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); grin(m, L.T);
  stoneDust(V(P.x + SPX, TOP, P.z), L.t0 + .85, L.T, 10, .8); cm([P.x + 6, 8, P.z + 30, P.x + 4, 5.6, P.z + 3, 48], [P.x + 5, 7.8, P.z + 27, P.x + 4, 5.8, P.z + 3, 46], L.k); sh(V(P.x, 0, P.z + 6), 26); }, [[0, 'impact', .4], [.2, 'chain_rattle', .4], [.85, 'stone_thud', .7]]);
// 31 «direkt neben Jonas,»: travelling de mí a la estatua de Jonas, que tiene la mano en la barbilla; «JONAS»
shot(37.8, 'S', null, L => { platz(L, { dawn: true }); statues(L, { je: { eyes: 'side_r', mouth: 'flat', noBlink: true } }); const a = hp(finn), b = hp(jonas);
  cm([a.x, a.y, a.z + 12, a.x, a.y - .6, a.z, 42], [b.x, b.y, b.z + 12, b.x, b.y - .6, b.z, 42], L.k); badge('tag', 'JONAS', W / 2, H * .2, clamp((L.lt - .5) / .2)); }, [[0, 'swipe', .4], [.5, 'pop', .4]]);
// 32 «der schon seit einem Jahr dort stand.»: Jonas de piedra, con musgo verde en los pies y una paloma en la cabeza; «1 JAHR»
shot(39.02, 'C', 'punch', L => { platz(L); statues(L, { je: { eyes: 'half', mouth: 'flat', noBlink: true } }); const h = hp(jonas); dove(0, h.x, h.y + 1.2, h.z, .4, L.T);
  onBody(jonas, 11, .25, .1, 42, L.k, 9.4, .2, 3.4); bigNum('1 JAHR', clamp((L.lt - .5) / .2), 'gold', .19, 1); }, [[0, 'impact', .4], [.2, 'pigeon_coo', .5], [.5, 'pling', .4]]);
// 33 «„Seit du da bist,»: el alcalde, delante del pedestal, abre los brazos y nos habla sonriendo
shot(40.67, 'W', null, L => { platz(L); statues(L, { fe: { eyes: 'down', mouth: 'flat', noBlink: true } }); const m = put(mayor, P.x + 1, 0, P.z + 9, .25); actuar(m, 0, [[0, { aLx: .6, aRx: .6, aLz: 1.0, aRz: 1.0, aLe: .3, aRe: .3, headX: -.1 }]], { T: L.T }); talk(m, L.T, 40.6, 41.7, 'happy');
  cm([P.x + 5, 5, P.z + 26, P.x + .5, 6, P.z + 6, 46], [P.x + 4, 5.2, P.z + 24, P.x + .5, 6.2, P.z + 6, 44], L.k); sh(V(P.x, 0, P.z + 6), 22); }, [[0, 'whoosh', .4], [.3, 'chain_rattle', .3]]);
// 34 «sieht der Platz aus wie ein Museum.“»: turistas haciendo fotos con flash a las estatuas; el alcalde orgulloso; bocadillo «MUSEUM!»
shot(41.65, 'F', null, L => { platz(L); statues(L, { fe: { eyes: 'squint', mouth: 'flat', noBlink: true } }); const m = put(mayor, P.x - 9, 0, P.z + 10, .4); actuar(m, 0, [[0, { aRx: 1.5, aRz: .4, aRe: .2, aLx: .3 }]], { T: L.T }); talk(m, L.T, 41.6, 43.4, 'happy');
  [[P.x - 3, P.z + 18, PI], [P.x + 3, P.z + 19, PI], [P.x + 8, P.z + 16, PI * .85]].forEach(([x, z, ry], i) => { const c = put(EXS[10 + i], x, 0, z, ry); actuar(c, 0, [[0, { aLx: 1.7, aRx: 1.7, aLe: 1.1, aRe: 1.1, headX: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'happy' }); });
  if ((L.lt % .5) < .06) grade.uniforms.flash.value = .5; bubble(m, 'MUSEUM!', clamp((L.lt - .6) / .2));
  cm([P.x - 2, 8, P.z + 34, P.x, 6.6, P.z + 4, 46], [P.x - 1, 7.6, P.z + 30, P.x, 6.6, P.z + 4, 44], L.k); sh(V(P.x, 0, P.z + 10), 26); }, [[0, 'flash', .4], [.1, 'camera_click', .5], [.6, 'camera_click', .5], [1.1, 'camera_click', .5], [1.5, 'camera_click', .4]]);
// 35 «Was dir niemand erzählt:»: mi cara de piedra, muy cerca: los ojos se deslizan hacia la cámara
shot(43.48, 'C', 'slow', L => { platz(L); statues(L, { fe: { eyes: L.lt < .5 ? 'side_l' : 'normal', mouth: 'flat', noBlink: true } }); onFace(finn, 5, -.3, 0, 40, L.k, 3.6); }, [[.5, 'eyes_move', .5]]);
// 36 «Wir sehen»: mis ojos siguen a una pareja que pasa por la plaza (los vemos desde detrás de mi hombro, la plaza al fondo)
shot(44.74, 'W', null, L => { platz(L); statues(L, { fe: { eyes: Math.sin(L.lt * 3) > 0 ? 'side_l' : 'side_r', mouth: 'flat', noBlink: true } }); walk(EXS[5], L, P.x - 8, P.z + 13, PI / 2, 2.6, 0, { expr: 'happy' }); walk(EXS[8], L, P.x - 8, P.z + 15, PI / 2, 2.6, 1, { expr: 'happy' });
  cm([P.x + 12, 8, P.z + 30, P.x + 1, 5.4, P.z + 6, 46], [P.x + 10, 8, P.z + 28, P.x + 1, 5.6, P.z + 6, 44], L.k); sh(V(P.x, 0, P.z + 10), 26); }, [[0, 'whoosh', .4], [.1, 'steps', .4]]);
// 37 «und hören alles.»: dos señoras cotillean al pie del pedestal; mi oreja de piedra, en primer plano; ondas de sonido
shot(45.48, 'C', 'punch', L => { platz(L); statues(L, { fe: { eyes: 'side_r', mouth: 'flat', noBlink: true } }); const a = put(EXS[0], P.x + 6, 0, P.z + 8, -.8), b = put(EXS[2], P.x + 9, 0, P.z + 6, -1.6); crowdGuy(a, P.x + 6, P.z + 8, L, 0, { mode: 'talk', ry: -.8 }); crowdGuy(b, P.x + 9, P.z + 6, L, 1, { mode: 'talk', ry: -1.6 });
  cm([P.x + 17, 8, P.z + 20, P.x + 6, 4.6, P.z + 5, 46], [P.x + 15, 8.2, P.z + 18, P.x + 6, 4.8, P.z + 5, 44], L.k); badge('tag', '... und dann hat er ...', W / 2, H * .22, clamp((L.lt - .2) / .2)); sh(V(P.x, 0, P.z + 6), 22); }, [[0, 'impact', .4], [.1, 'whisper', .5]]);
// 38 «Wir können uns nur nicht bewegen.»: intento moverme con todas mis fuerzas: tiemblo, sudo… y nada
shot(46.59, 'C', 'punch', L => { platz(L); statues(L, { fe: { expr: 'angry', eyes: 'squint', mouth: 'grimace', noBlink: true } }); sweat(finn, L.T, 2); SHAKE = .25; onFace(finn, 6, -.4, .6, 40, L.k, 5); }, [[0, 'strain', .6], [.5, 'stone_crack', .3]]);
// ---------- b: la vida de estatua y Mia (48,09 – 88,37 s) ----------
// 39 «In den ersten Monaten»: la plaza en otoño, hojas cayendo; mi ex (coleta rubia, top rosa) cruza la plaza
shot(48.09, 'W', null, L => { platz(L, { dusk: true }); statues(L); walk(ex, L, P.x - 14, P.z + 26, PI / 2, 2.4, 0, { expr: 'happy' }); extras(L, EXS.slice(0, 3), SPOTS.slice(2));
  const e = ex.root.position; cm([e.x + 6, 9, e.z + 22, e.x, 4.6, e.z, 46], [e.x + 5, 8.6, e.z + 19, e.x, 4.6, e.z, 44], L.k); sh(V(e.x, 0, e.z), 30); }, [[0, 'whoosh', .4], [.2, 'leaves', .5]]);
// 40 «lief meine Ex jeden Tag»: mi ex, de frente, camina mirando el móvil y sonriendo; «JEDEN TAG»
shot(49.33, 'C', 'punch', L => { platz(L); const c = walk(ex, L, P.x - 2, P.z + 36, PI / 2 + .3, 2.2, 0, { pose: { aRx: 1.2, aRe: 1.4 }, f: { expr: 'happy', mouth: 'smile' } }); attach(PHONE, c.aR.hand, [0, -.55, .5], [-.4, 0, 0], .9);
  onBody(c, 11, 0, .1, 42, L.k, 9.4); bigNum('JEDEN TAG', clamp((L.lt - .2) / .2), 'gold', .19, .95); }, [[0, 'impact', .4], [.2, 'steps', .5]]);
// 41 «über den Platz.»: desde arriba, mi ex cruza por delante del pedestal; las estatuas la miran
shot(50.39, 'S', null, L => { platz(L); statues(L, { fe: { eyes: 'down', mouth: 'flat', noBlink: true } }); walk(ex, L, P.x - 8, P.z + 14, PI / 2, 2.6, 0, { expr: 'happy' });
  const e = ex.root.position; cm([e.x + 3, 16, e.z + 18, e.x, 3, e.z, 48], [e.x + 2, 15, e.z + 16, e.x, 3, e.z, 46], L.k); sh(V(e.x, 0, e.z), 26); }, [[0, 'swipe', .4], [.1, 'steps', .4]]);
// 42 «Hand in Hand mit einem anderen.»: mi ex de la mano con un chico de gorra; se ríen y se balancean las manos
shot(51.31, 'C', 'punch', L => { platz(L); const sw = Math.sin(L.T * 4) * .4; const a = walk(ex, L, P.x - 1.6, P.z + 30, PI / 2 + .25, 1.6, 0, { pose: { aRx: .3 + sw, aRz: -.25 }, f: { expr: 'happy', mouth: 'laugh' } }); const b = walk(exF, L, P.x - 1.6 - 2.6 * Math.cos(PI / 2 + .25 - PI / 2) * 0, P.z + 32.4, PI / 2 + .25, 1.6, 1, { pose: { aLx: .3 + sw, aLz: .25 }, f: { expr: 'happy', mouth: 'open_smile' } });
  const m = a.root.position.clone().add(b.root.position).multiplyScalar(.5); orbit(V(m.x, 4.4, m.z), lerp(13, 11, L.k), PI / 2 + .25, .1, 42); hearts(V(m.x, 8, m.z), L.T, 3, 2); sh(V(m.x, 0, m.z), 20); }, [[0, 'impact', .4], [.2, 'girls_laugh', .4], [.4, 'steps', .4]]);
// 43 «Sie hat nie»: mis ojos de piedra miran hacia abajo, tristes
shot(52.55, 'F', null, L => { platz(L); statues(L, { fe: { eyes: 'down', mouth: 'wavy', noBlink: true } }); onFace(finn, 5.4, .8, -.4, 40, L.k, 4.6); }, [[0, 'flash', .3], [.3, 'sad_sting', .5]]);
// 44 «nach oben geschaut.»: picado desde lo alto del pedestal: la pareja pasa por debajo sin levantar la vista
shot(53.38, 'C', 'slow', L => { platz(L); statues(L); walk(ex, L, P.x - 6, P.z + 9, PI / 2, 2.2, 0, { f: { expr: 'happy', mouth: 'smile' } }); walk(exF, L, P.x - 6, P.z + 11.4, PI / 2, 2.2, 1, { f: { expr: 'happy' } });
  const h = hp(finn); cm([h.x + 1, h.y + 3, h.z + 1, P.x - 5.5, 1.6, P.z + 10, 50], [h.x + 1, h.y + 3.4, h.z + 1, P.x - 4, 1.6, P.z + 10, 46], L.k); sh(V(P.x, 0, P.z + 10), 22); }, []);
// 45 «Kinder kletterten auf meinen Sockel.»: tres niños trepan al pedestal y uno se me cuelga de la pierna
shot(54.45, 'W', null, L => { platz(L); statues(L, { fe: { eyes: 'side_r', mouth: 'grimace', noBlink: true } });
  const k0 = put(KIDS[0], P.x + 5.2, TOP, P.z + 1.6, -.3); actuar(k0, 0, [[0, { aLx: 2.4, aRx: 1.6, aLe: .4, aRe: .8, lean: .2 }]], { T: L.T }); laughF(k0, L.T); k0.blob.visible = false;
  const u = clamp(L.lt / 1.2); const k1 = put(KIDS[1], P.x - 1, lerp(0, TOP, u), P.z + 4.4, PI); actuar(k1, 0, [[0, { aLx: 2.9, aRx: 2.9, aLe: .4 + Math.sin(L.T * 10) * .3, aRe: .4, lLx: .8 + Math.sin(L.T * 10) * .5, lLk: 1.2, lean: -.1 }]], { T: L.T }); cara(k1, L.T, { expr: 'determined' });
  const k2 = put(KIDS[2], P.x + 8.4, 0, P.z + 7, -.6); actuar(k2, 0, [[0, 'cheer']], { T: L.T }); laughF(k2, L.T);
  cm([P.x + 6, 7, P.z + 24, P.x + 2, 5.4, P.z + 2, 46], [P.x + 5, 6.8, P.z + 21, P.x + 2, 5.4, P.z + 2, 44], L.k); sh(V(P.x, 0, P.z + 4), 22); }, [[0, 'whoosh', .4], [.1, 'kids_laugh', .5], [.6, 'climb', .5]]);
// 46 «Tauben setzten sich»: tres palomas bajan aleteando hacia mi cabeza
shot(56.06, 'C', 'punch', L => { platz(L); statues(L, { fe: { eyes: 'up', mouth: 'grimace', noBlink: true } }); const h = hp(finn);
  for (let i = 0; i < 3; i++) { const u = clamp((L.lt - i * .12) / .55); dove(i, lerp(h.x + 6 - i * 5, h.x - .6 + i * .6, u), lerp(h.y + 9, h.y + 1.1 + (i === 1 ? .4 : 0), u), lerp(h.z + 4, h.z - .2 + (i - 1) * .3, u), -.3 + i * .4, L.T, 1 - u * .9); }
  onFace(finn, 6.4, 1.2, .4, 42, L.k, 5.6); }, [[0, 'impact', .4], [.05, 'wings_flap', .6], [.5, 'pigeon_coo', .5]]);
// 47 «auf meinen Kopf.»: plano de mi cabeza con las tres palomas encima; una me mira a los ojos; yo bizqueo hacia arriba
shot(56.98, 'S', null, L => { platz(L); statues(L, { fe: { eyes: 'up', mouth: 'wavy', noBlink: true } }); const h = hp(finn); for (let i = 0; i < 3; i++) dove(i, h.x - .6 + i * .6, h.y + 1.1 + (i === 1 ? .4 : 0), h.z - .2 + (i - 1) * .3, -.3 + i * .6, L.T);
  onFace(finn, 4.4, 1.6, -.4, 40, L.k, 4); }, [[0, 'swipe', .4], [.2, 'pigeon_coo', .6]]);
// 48 «Und ein alter Mann erzählte mir»: de noche, un abuelo con chaqueta de punto se sienta al pie del pedestal y me habla mirando arriba
shot(57.81, 'W', null, L => { platz(L, { night: true }); statues(L, { fe: { eyes: 'down', mouth: 'flat', noBlink: true } }); const o = sit(opa, P.x + SPX, 1.5, P.z + 5.2, 0, L, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2, headX: -.35 }); talk(o, L.T, 57.8, 59.1, 'sad'); o.root.position.y = sitY(o, 1.5);
  cm([P.x + 10, 6, P.z + 22, P.x + 3, 5.4, P.z + 2, 46], [P.x + 9, 6.4, P.z + 20, P.x + 3, 5.8, P.z + 2, 44], L.k); sh(V(P.x, 0, P.z + 4), 24); }, [[0, 'whoosh', .4], [.1, 'crickets', .4], [.4, 'old_sigh', .5]]);
// 49 «eine ganze Nacht lang seinen Kummer,»: primer plano del abuelo llorando, se seca las lágrimas con un pañuelo; la luna detrás; «GANZE NACHT»
shot(59.09, 'C', 'punch', L => { platz(L, { night: true }); const o = sit(opa, P.x + SPX, 1.5, P.z + 5.2, 0, L, { aRx: 2.0, aRe: 2.0, aRz: -.4, aLx: .5, headX: -.2 }); talk(o, L.T, 59.0, 60.8, 'cry'); tears(o, L.T);
  onFace(o, 5.4, 0, .6, 40, L.k, 4.6); bigNum('GANZE NACHT', clamp((L.lt - .4) / .2), 'gold', .19, .9); }, [[0, 'impact', .4], [.2, 'sob_old', .5]]);
// 50 «während er zu meinen Füßen saß.»: contrapicado: el abuelo encogido a mis pies de piedra, yo le miro desde arriba con pena
shot(60.83, 'S', null, L => { platz(L, { night: true }); statues(L, { fe: { eyes: 'down', mouth: 'wavy', noBlink: true } }); const o = sit(opa, P.x + SPX, 1.5, P.z + 5.2, 0, L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, lean: .35, headX: .3 }); cara(o, L.T, { expr: 'sad' });
  cm([P.x + 14, 2.6, P.z + 20, P.x + SPX, 6.4, P.z + 2, 50], [P.x + 13, 2.4, P.z + 19, P.x + SPX, 6.6, P.z + 2, 48], L.k); sh(V(P.x, 0, P.z + 4), 22); }, [[0, 'swipe', .4], [.3, 'owl', .4]]);
// 51 «Bis an einem Donnerstag»: tarde dorada en la plaza, palomas que echan a volar; «DONNERSTAG»
shot(62.28, 'Z', null, L => { platz(L, { dusk: true }); statues(L); for (let i = 0; i < 5; i++) { const u = L.lt * 3; dove(i, P.x - 8 + i * 4 + u * (i - 2), .2 + u * (3 + i), P.z + 22 + u * 2, i, L.T, clamp(L.lt * 4)); }
  extras(L, EXS.slice(10, 13), SPOTS); cm([P.x, 5, P.z + 46, P.x, 6, P.z, 48], [P.x, 6, P.z + 40, P.x, 6.6, P.z, 46], L.k); bigNum('DONNERSTAG', clamp((L.lt - .4) / .2), 'gold', .19, .9); sh(V(P.x, 0, P.z + 20), 34); }, [[0, 'zoom_in', .4], [.1, 'wings_flap', .5], [.4, 'pling', .4]]);
// 52 «ein Mädchen»: entra en la plaza una chica con chaqueta verde, mochila morada y pinza amarilla, andando hacia la cámara
shot(63.32, 'C', 'punch', L => { platz(L, { dusk: true }); const c = walk(mia, L, P.x, P.z + 34, PI, 1.6, 0, { f: { expr: 'neutral' } }); const p = c.root.position; orbit(V(p.x, 4.2, p.z), lerp(13, 11, L.k), PI, .1, 42); sh(V(p.x, 0, p.z), 22); }, [[0, 'impact', .4], [.1, 'steps', .5], [.5, 'soft_chime', .4]]);
// 53 «mit einer grünen Jacke auftauchte.»: travelling vertical por la chaqueta verde hasta su cara tímida
shot(64.24, 'S', null, L => { platz(L, { dusk: true }); const c = walk(mia, L, P.x, P.z + 32.4, PI, 1.2, 0, { f: { expr: 'warm', mouth: 'smile' } }); const h = hp(c);
  cm([h.x, h.y - 3.2, h.z - 7, h.x, h.y - 3, h.z, 40], [h.x, h.y + .6, h.z - 7.4, h.x, h.y + .3, h.z, 40], L.k); }, [[0, 'swipe', .4], [.2, 'cloth', .5]]);
// 54 «Sie setzte sich auf die Bank gegenüber»: se sienta en el banco de enfrente; detrás, el pedestal con nosotros dos
shot(65.67, 'W', null, L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: 'down', mouth: 'flat', noBlink: true } }); miaBench(L); cara(mia, L.T, { expr: 'neutral' });
  cm([P.x + 13, 5, BZ - 2, P.x - 1, 4.6, BZ - 12, 46], [P.x + 12, 5.2, BZ - 4, P.x - 1, 4.8, BZ - 12, 44], L.k); sh(V(P.x, 0, BZ - 10), 30); }, [[0, 'whoosh', .4], [.4, 'bench_creak', .5]]);
// 55 «und schaute verlegen nach oben.»: Mia levanta la vista hacia mí, se sonroja y se coloca el pelo
shot(67.01, 'C', 'slow', L => { platz(L, { dusk: true }); miaBench(L, { headX: -.35, aRx: 1.9, aRe: 2.2, aRz: -.5 }); cara(mia, L.T, { expr: 'warm', eyes: 'happy', mouth: 'smile' });
  onFace(mia, 5.4, -.6, .4, 40, L.k, 4.4); }, [[.2, 'cloth', .4]]);
// 56 «„Hallo.»: Mia saluda tímidamente con la mano
shot(68.73, 'C', 'punch', L => { platz(L, { dusk: true }); miaBench(L, { aRx: 2.4, aRz: .3 + Math.sin(L.T * 10) * .2, aRe: .6, headX: -.3 }); talk(mia, L.T, 68.7, 69.2, 'warm'); onBody(mia, 9, 0, .12, 42, L.k, 8, 0, 4.2); }, [[0, 'impact', .4], [.1, 'girl_hi', .4]]);
// 57 «Ich weiß, das ist komisch.»: se frota la nuca, avergonzada
shot(69.28, 'S', null, L => { platz(L, { dusk: true }); miaBench(L, { aRx: 2.6, aRe: 2.2, aRz: -.6, headX: -.15, headZ: .15 }); talk(mia, L.T, 69.2, 70.5, 'worried'); onFace(mia, 5.4, 0, -.8, 40, L.k, 4.6); }, [[0, 'swipe', .4]]);
// 58 «Aber ich musste mit jemandem reden.“»: contraplano: mi cara de piedra, los ojos muy abiertos, sorprendido
shot(70.51, 'C', 'slow', L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: 'wide', mouth: 'o', noBlink: true } }); onFace(finn, 6, -.5, .3, 40, L.k, 4.4); }, []);
// 59 «Am nächsten Tag kam sie wieder,»: otro día: Mia llega con un helado y saluda hacia el pedestal; «FREITAG»
shot(71.97, 'W', null, L => { platz(L); statues(L); const c = walk(mia, L, P.x + 10, BZ + 4, -PI * .7, 1.8, 0, { pose: { aRx: 2.6, aRz: .3, aRe: .4 }, f: { expr: 'happy', mouth: 'open_smile' } });
  const p = c.root.position; orbit(V(p.x, 4.2, p.z), 13, -PI * .7 + .4, .12, 44); bigNum('FREITAG', clamp((L.lt - .2) / .2), 'gold', .19, .9); sh(V(p.x, 0, p.z), 22); }, [[0, 'whoosh', .4], [.2, 'steps', .4], [.2, 'pling', .3]]);
// 60 «und am Tag danach auch.»: otro día más: Mia ya sentada, con la mochila al lado, nos cuenta algo con las manos; «SAMSTAG»
shot(73.21, 'S', null, L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: 'down', mouth: 'smile', noBlink: true } }); miaBench(L, { aRx: 1.2 + Math.sin(L.T * 6) * .3, aRe: 1.4, aLx: 1.0, aLe: 1.6 - Math.sin(L.T * 6) * .3 }); talk(mia, L.T, 73.2, 74.7, 'happy');
  cm([P.x - 9, 7, BZ - 18, P.x, 4, BZ, 44], [P.x - 8, 6.8, BZ - 16, P.x, 4, BZ, 42], L.k); bigNum('SAMSTAG', clamp((L.lt - .2) / .2), 'gold', .19, .9); sh(V(P.x, 0, BZ - 6), 26); }, [[0, 'swipe', .4], [.2, 'pling', .3]]);
// 61 «Immer um halb fünf,»: el reloj del Rathaus marca las cuatro y media; «16:30»
shot(74.73, 'Z', null, L => { platz(L, { dusk: true }); statues(L); const c = HB.clock.pos; cm([c.x + 4, c.y - 6, c.z + 30, c.x, c.y - 1, c.z, 40], [c.x + 2, c.y - 4, c.z + 22, c.x, c.y - .6, c.z, 38], L.k); bigNum('16:30', clamp((L.lt - .1) / .2), 'gold', .26, 1.2); }, [[0, 'zoom_in', .4], [.1, 'church_bell', .6]]);
// 62 «nach der Schule.»: en clase, suena el timbre: Mia mete los libros en la mochila y sale corriendo
shot(75.61, 'C', 'punch', L => { school(L); const c = put(mia, KLX + 6, 0, 2 - L.lt * 3, PI - .4); actuar(c, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' });
  [[-11, -2], [0, 6], [-11, 6]].forEach(([x, z], i) => { const s = sit(EXS[i + 4], KLX + x, 3.3, z, 0, L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6 }); cara(s, L.T, { expr: 'tired' }); });
  cm([KLX - 2, 9, 16, KLX + 3, 4.6, 0, 46], [KLX - 1, 8.6, 14, KLX + 4, 4.6, -1, 44], L.k); }, [[0, 'school_bell', .6], [.2, 'chair_scrape', .4], [.4, 'steps', .5]]);
// 63 «Sie erzählte mir von ihrer Lehrerin,»: Mia en el banco, imitando con gestos a la profesora (dedo en alto, cara seria)
shot(76.72, 'W', null, L => { platz(L, { dusk: true }); miaBench(L, { aRx: 2.7, aRe: .4, aRz: -.1, headY: .2 }); talk(mia, L.T, 76.7, 78.1, 'angry'); onBody(mia, 9.4, .4, .12, 42, L.k, 8.4, .3, 4.0); }, [[0, 'whoosh', .4], [.4, 'girl_talk', .3]]);
// 64 «die sie ständig anschrie.»: en clase, la Lehrerin (chaqueta roja, moño gris) le grita a Mia, que se encoge en su pupitre
shot(78.09, 'C', 'punch', L => { school(L); const t = put(lehrerin, KLX - 1, 0, 1.2, 0); actuar(t, 0, [[0, { aRx: 2.2, aRe: .3, aRz: -.2, aLz: .5, aLe: 1.5, lean: .15, headX: .1 }]], { T: L.T }); cara(t, L.T, { expr: 'shout', mouth: 'o' });
  const m = sit(mia, KLX, 3.3, 6, PI, L, { aLx: 1.5, aRx: 1.5, aLe: 1.9, aRe: 1.9, lean: .15, headX: .3 }); if (m.pack) m.pack.visible = false; cara(m, L.T, { expr: 'worried', eyes: 'closed', mouth: 'grimace' }); SHAKE = .15;
  cm([KLX + 9, 8, 9, KLX - .5, 5.6, 3, 44], [KLX + 8, 7.8, 8, KLX - .5, 5.6, 3, 42], L.k); }, [[0, 'impact', .4], [.1, 'teacher_shout', .6]]);
// 65 «Von Brezel,»: en casa de Mia: Brezel, un perro salchicha con collar rojo, corre moviendo la cola; «BREZEL»
shot(79.16, 'C', 'punch', L => { miaRoom(L); const d = show(DOG, MZX - 4 + L.lt * 3, 0, 2, PI / 2); DOG.userData.slipper.visible = false; DOG.userData.pose(L.T, 1, 1);
  cm([MZX + 2, 4.6, 12, MZX - 2 + L.lt * 2, 2, 2, 42], [MZX + 3, 4.2, 10, MZX - 1 + L.lt * 2.4, 2, 2, 40], L.k); badge('tag', 'BREZEL', W / 2, H * .2, clamp((L.lt - .3) / .2)); }, [[0, 'impact', .4], [.1, 'dog_bark', .6], [.6, 'paws', .4]]);
// 66 «ihrem Hund, der ihre Hausschuhe fraß.»: Brezel mordisquea una zapatilla rosa y Mia tira de ella riéndose
shot(80.38, 'W', null, L => { miaRoom(L); const d = show(DOG, MZX - 2, 0, 3, -PI / 2 + .3); DOG.userData.pose(L.T, 1, 0); d.rotation.z = Math.sin(L.T * 12) * .04;
  const m = put(mia, MZX - 7.6, 0, 3.6, PI / 2 - .2); if (m.pack) m.pack.visible = false; actuar(m, 0, [[0, { aLx: 1.3, aRx: 1.3, aLe: .3, aRe: .3, lean: -.2 + Math.sin(L.T * 12) * .05, lLx: -.3, lRx: .3 }]], { T: L.T }); laughF(m, L.T);
  cm([MZX - 4.6, 6.4, 16, MZX - 4.8, 3.2, 3, 44], [MZX - 4.8, 6, 14, MZX - 4.8, 3.2, 3, 42], L.k); }, [[0, 'whoosh', .4], [.1, 'dog_growl', .6], [.6, 'girls_laugh', .4]]);
// 67 «Und dass sie Angst vor»: centro comercial: Mia, al pie de la escalera mecánica, se agarra a la mochila
shot(82.08, 'S', null, L => { mallS(L); const m = put(mia, MLX + .4, 0, 7, PI); actuar(m, 0, [[0, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, ...shiver(L.T, 1) }]], { T: L.T }); cara(m, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(m, L.T, 1);
  extras(L, EXS.slice(12, 15), [[MLX - 18, 12, PI / 2], [MLX + 16, 4, -PI / 2], [MLX - 10, -12, 0]]);
  cm([MLX + 6, 7, 22, MLX, 6, 2, 46], [MLX + 5, 6.8, 20, MLX, 6.4, 2, 44], L.k); sh(V(MLX, 0, 0), 30); }, [[0, 'swipe', .4], [.1, 'mall_amb', .5], [.3, 'escalator', .4]]);
// 68 «Rolltreppen hatte.»: primer plano de Mia temblando mirando los escalones que suben; «ROLLTREPPE»
shot(82.95, 'C', 'punch', L => { mallS(L); const m = put(mia, MLX + .4, 0, 7, PI); actuar(m, 0, [[0, { aLx: 1.8, aRx: 1.8, aLe: 2.0, aRe: 2.0, aLz: -.3, aRz: -.3, ...shiver(L.T, 2) }]], { T: L.T }); cara(m, L.T, { expr: 'shock', eyes: 'scared', mouth: 'grimace' });
  onFace(m, 5.2, 0, -.6, 40, L.k, 4.4); badge('tag', 'ROLLTREPPE', W / 2, H * .2, clamp((L.lt - .2) / .2)); }, [[0, 'impact', .4], [.1, 'escalator', .5], [.3, 'gulp', .5]]);
// 69 «Manchmal las sie mir laut aus einem Buch vor.»: Mia en el banco, con un libro abierto, lee en voz alta gesticulando
shot(83.91, 'F', null, L => { platz(L, { dusk: true }); miaBench(L, { aLx: 1.3, aRx: 1.3, aLe: 1.6, aRe: 1.6, aLz: -.1, aRz: -.1, headX: .25 }); attach(BOOK, mia.aR.hand, [-.7, -.6, .6], [.9, 0, 0], 1.2); talk(mia, L.T, 83.9, 85.8, 'happy');
  onBody(mia, 9, -.3, .14, 42, L.k, 8, -.2, 4.0); }, [[0, 'flash', .3], [.2, 'pages', .6]]);
// 70 «Manchmal saß sie einfach still da»: Mia en silencio, abrazada a las rodillas, con el sol bajando detrás
shot(85.85, 'W', null, L => { platz(L, { dusk: true }); miaBench(L, { lLx: 2.2, rLx: 2.2, lLk: 2.4, lRk: 2.4, aLx: 1.2, aRx: 1.2, aLe: 1.8, aRe: 1.8, aLz: -.3, aRz: -.3, headX: .1 }); cara(mia, L.T, { expr: 'warm', eyes: 'half' });
  cm([P.x - 8, 5, BZ - 14, P.x, 4, BZ, 44], [P.x - 7, 5.2, BZ - 13, P.x, 4.2, BZ, 42], L.k); sh(V(P.x, 0, BZ), 22); }, [[0, 'whoosh', .4], [.3, 'wind_soft', .4]]);
// 71 «und schaute nach oben.»: gran plano: Mia en el banco mirando arriba, las dos estatuas al fondo con la luz dorada
shot(87.27, 'S', null, L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: 'down', mouth: 'smile', noBlink: true } }); miaBench(L, { headX: -.35 }); cara(mia, L.T, { expr: 'warm', eyes: 'happy' });
  cm([P.x + 14, 5, BZ + 2, P.x, 6, P.z + 10, 48], [P.x + 13, 5.6, BZ, P.x, 6.4, P.z + 10, 46], L.k); sh(V(P.x, 0, P.z + 12), 30); }, [[0, 'swipe', .4]]);
// ---------- c: la bufanda, la lluvia y la cuenta atrás (88,37 – 127,21 s) ----------
// 72 «Eines Tages brachte sie einen Schal mit»: Mia llega con una bufanda de rayas mostaza y azul en las manos, sonriendo
shot(88.37, 'W', null, L => { platz(L); statues(L); const c = walk(mia, L, P.x + 3, BZ - 4, PI, 1.4, 0, { pose: { aLx: 1.2, aRx: 1.2, aLe: 1.1, aRe: 1.1, aLz: -.15, aRz: -.15 }, f: { expr: 'happy', mouth: 'smile' } }); attach(SCARFH, c.aR.hand, [.8, -.9, .8], [0, 0, 0], 1);
  onBody(c, 12, .2, .1, 42, L.k, 10.4, .1, 3); sh(V(P.x, 0, BZ - 6), 22); }, [[0, 'whoosh', .4], [.1, 'steps', .4], [.6, 'cloth', .4]]);
// 73 «und wickelte ihn um den Sockel,»: Mia, subida al pedestal, enrolla la bufanda en la columnita que hay entre los dos
shot(89.87, 'C', 'punch', L => { platz(L); statues(L, { fe: { eyes: 'side_l', mouth: 'o', noBlink: true } }); SO.SCARF.visible = L.lt > .7; const m = put(mia, P.x + .3, TOP, P.z + 2.2, PI + .1); m.blob.visible = false; const r = Math.sin(L.T * 7);
  actuar(m, 0, [[0, { aLx: 1.6 + r * .3, aRx: 1.6 - r * .3, aLe: 1.2, aRe: 1.2, aLz: -.4, aRz: -.4, headX: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'smile' }); if (L.lt <= .7) attach(SCARFH, m.aR.hand, [.6, -.8, .6], [0, 0, 0], 1);
  cm([P.x + 6, TOP + 7, P.z + 14, P.x, TOP + 4.6, P.z, 44], [P.x + 4.6, TOP + 6.6, P.z + 12, P.x, TOP + 4.8, P.z, 42], L.k); sh(V(P.x, 0, P.z), 20); }, [[0, 'impact', .4], [.2, 'cloth', .6], [.8, 'cloth', .4]]);
// 74 «genau zwischen Jonas und mich.»: la bufanda enrollada, justo en medio de las dos estatuas; travelling de un lado a otro
shot(91.55, 'S', null, L => { platz(L); statues(L, { fe: { eyes: 'side_l', mouth: 'smile', noBlink: true }, je: { eyes: 'side_r', mouth: 'flat', noBlink: true } }); SO.SCARF.visible = true;
  cm([P.x - 5, TOP + 6, P.z + 12, P.x, TOP + 4.4, P.z, 44], [P.x + 5, TOP + 6, P.z + 12, P.x, TOP + 4.4, P.z, 44], L.k); }, [[0, 'swipe', .4], [.3, 'soft_chime', .4]]);
// 75 «„Damit euch nicht kalt ist.“»: Mia, abajo, nos sonríe con las manos juntas; vaho en el aire frío, hojas que caen
shot(93.11, 'F', null, L => { platz(L, { dusk: true }); const m = put(mia, P.x, 0, P.z + 9, PI); actuar(m, 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.5, aRe: 1.5, aLz: -.35, aRz: -.35, headX: -.3 }]], { T: L.T }); talk(m, L.T, 93.1, 94.3, 'warm');
  onFace(m, 5.6, -.4, .3, 40, L.k, 4.8); }, [[0, 'flash', .3], [.3, 'wind_soft', .4]]);
// 76 «Und ich habe mich in sie verliebt,»: mi cara de piedra con las mejillas sonrosadas y corazones que suben
shot(94.39, 'C', 'slow', L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: 'happy', mouth: 'smile', noBlink: true } }); hearts(hp(finn).add(V(0, 1, 1)), L.T, 6, 2.6); onFace(finn, 6, -.3, 0, 40, L.k, 4.6); }, [[.1, 'heartbeat', .5], [.5, 'sparkle', .4]]);
// 77 «ohne auch nur blinzeln zu können.»: primerísimo plano de mis ojos: una hoja seca cae justo delante y no puedo parpadear
shot(95.96, 'C', 'punch', L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: 'wide', mouth: 'flat', noBlink: true } }); const h = hp(finn).add(V(0, .7, 1.2));
  FX2D.push(c => { const [x, y] = proj(h.clone().add(V(Math.sin(L.T * 3) * .6, 1.6 - L.lt * 1.8, 0))); c.save(); c.translate(x, y); c.rotate(L.T * 2); c.fillStyle = '#c8701a'; c.strokeStyle = '#6a3a0a'; c.lineWidth = 6; c.beginPath(); c.ellipse(0, 0, 70, 34, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-70, 0); c.lineTo(70, 0); c.stroke(); c.restore(); });
  onFace(finn, 3.2, .3, 0, 38, L.k, 2.9); }, [[0, 'impact', .4], [.3, 'leaves', .5]]);
// 78 «Ich zählte die Stunden bis halb fünf.»: el reloj del Rathaus gira deprisa; los números saltan 13:00 → 16:30
shot(97.51, 'R', null, L => { platz(L); statues(L); const c = HB.clock.pos; const hrs = ['13:00', '14:00', '15:00', '16:00', '16:30'][Math.min(4, Math.floor(L.lt / .38))];
  cm([c.x - 6, c.y - 10, c.z + 36, c.x, c.y - 1, c.z, 42], [c.x - 3, c.y - 7, c.z + 28, c.x, c.y - .6, c.z, 40], L.k); bigNum(hrs, 1, hrs === '16:30' ? 'gold' : 'big', .26, 1.15); }, [[0, 'clock_spin', .5], [.4, 'clock_tick', .5], [.8, 'clock_tick', .5], [1.2, 'clock_tick', .5], [1.55, 'ding_soft', .5]]);
// 79 «Die Regentage,»: lluvia sobre la plaza vacía; el banco de enfrente mojado y vacío
shot(99.39, 'W', null, L => { platz(L, { rain: true }); statues(L); RAIN.userData.update(L.T, V(P.x, 0, BZ)); cm([P.x - 6, 6, BZ + 14, P.x, 2.6, BZ, 44], [P.x - 4, 5.6, BZ + 12, P.x, 2.6, BZ, 42], L.k); sh(V(P.x, 0, BZ), 24); }, [[0, 'whoosh', .4], [.05, 'rain', .7], [.6, 'thunder', .3]]);
// 80 «an denen sie nicht kam,»: plano de la calle por donde viene Mia: nadie, solo paraguas que pasan
shot(100.05, 'S', null, L => { platz(L, { rain: true }); RAIN.userData.update(L.T, V(P.x, 0, P.z + 60)); walk(EXS[1], L, P.x - 10, P.z + 62, PI / 2, 3, 0, { pose: { aRx: 2.8, aRe: .3 }, expr: 'tired' }); walk(EXS[5], L, P.x + 12, P.z + 70, -PI / 2, 3, 1, { pose: { aRx: 2.8, aRe: .3 }, expr: 'tired' });
  cm([P.x, 6, P.z + 34, P.x, 4, P.z + 80, 46], [P.x, 5.6, P.z + 38, P.x, 4, P.z + 80, 44], L.k); sh(V(P.x, 0, P.z + 60), 30); }, [[0, 'swipe', .4], [.05, 'rain', .7], [.3, 'puddle_steps', .5]]);
// 81 «waren die schlimmsten der Woche.» (zoom lento): yo bajo la lluvia, el agua me cae por la cara de piedra como lágrimas
shot(101.15, 'C', 'slow', L => { platz(L, { rain: true }); statues(L, { fe: { eyes: 'down', mouth: 'wavy', noBlink: true } }); RAIN.userData.update(L.T, hp(finn)); tears(finn, L.T); onFace(finn, 6, -.2, .3, 40, L.k, 4.6); }, [[0, 'rain', .7]]);
// 82 «An einem Samstag»: Mia llega cabizbaja, arrastrando los pies; «SAMSTAG»
shot(102.48, 'W', null, L => { platz(L, { dusk: true }); statues(L); const c = walk(mia, L, P.x, BZ - 3 + 10, PI, 1.0, 0, { pose: { headX: .45, aLx: .1, aRx: .1, lean: .12 }, f: { expr: 'sad' } });
  onBody(c, 13, .3, .12, 42, L.k, 11.4, .2, 3.2); bigNum('SAMSTAG', clamp((L.lt - .2) / .2), 'gold', .19, .9); sh(V(P.x, 0, BZ), 22); }, [[0, 'whoosh', .4], [.1, 'steps', .4], [.3, 'pling', .3]]);
// 83 «kam sie mit verweinten Augen.»: primer plano de Mia llorando en el banco, se frota los ojos rojos
shot(103.22, 'C', 'punch', L => { platz(L, { dusk: true }); miaBench(L, { aRx: 2.4, aRe: 2.3, aRz: -.5, headX: .15 }); cara(mia, L.T, { expr: 'cry', eyes: 'cry', mouth: 'wavy' }); tears(mia, L.T); onFace(mia, 5.2, 0, .5, 40, L.k, 4.4); }, [[0, 'impact', .4], [.2, 'sob_girl', .6]]);
// 84 «„In sechs Tagen»: Mia levanta un cartelito hecho a mano: «6 TAGE» con casillas
shot(104.79, 'Z', null, L => { platz(L, { dusk: true }); miaBench(L, { aLx: 1.6, aRx: 1.6, aLe: .9, aRe: .9, aLz: -.2, aRz: -.2 }); talk(mia, L.T, 104.7, 105.6, 'cry'); tears(mia, L.T); const h = hp(mia); show(SIGN6, h.x, h.y - 2.6, h.z - 1.4, PI);
  onBody(mia, 9, 0, .1, 40, L.k, 8, 0, 4.2); }, [[0, 'zoom_in', .4], [.1, 'paper', .5], [.3, 'sniff', .4]]);
// 85 «bin ich seit einem Jahr allein.“»: Mia sola en el banco, plano amplio, la plaza vacía a su alrededor; «1 JAHR»
shot(105.55, 'S', null, L => { platz(L, { dusk: true }); miaBench(L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, headX: .4 }); talk(mia, L.T, 105.5, 106.9, 'cry');
  cm([P.x - 3, 10, BZ - 20, P.x, 3, BZ, 46], [P.x - 2, 12, BZ - 22, P.x, 3, BZ, 48], L.k); bigNum('1 JAHR', clamp((L.lt - .4) / .2), 'red', .19, 1); sh(V(P.x, 0, BZ), 26); }, [[0, 'swipe', .4], [.4, 'sad_sting', .5]]);
// 86 «Ich wollte schreien.»: mi cara de piedra se agrieta un poco por la fuerza: ojos desesperados, la cámara tiembla
shot(106.95, 'C', 'punch', L => { platz(L, { dusk: true }); statues(L, { fe: { expr: 'angry', eyes: 'wide', mouth: 'grimace', noBlink: true } }); SHAKE = .35; TINT = 'rgba(180,20,30,.12)'; stoneDust(hp(finn), L.t0 + .1, L.T, 8, .6);
  onFace(finn, 4.6, -.2, 0, 40, L.k, 3.8); }, [[0, 'strain', .6], [.1, 'stone_crack', .6], [.3, 'heartbeat', .6]]);
// 87 «Ich wollte von meinem Sockel springen»: (lo imagino, en tono soñado) salto del pedestal, ya con color, con los brazos abiertos
shot(108.16, 'F', null, L => { platz(L, { dusk: true }); statues(L, { finn: false }); const u = clamp(L.lt / 1.1); const f = put(finn, P.x + SPX, TOP * (1 - u) + 4 * u * (1 - u) * 3, P.z + u * 10, 0); actuar(f, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: .5, aRz: .5, lLx: .8, lLk: 1.2, lRk: .4 }]], { T: L.T }); cara(f, L.T, { expr: 'happy', mouth: 'open_smile' });
  TINT = 'rgba(255,190,230,.18)'; cm([P.x + 14, 6, P.z + 24, P.x + 2, 6, P.z + 4, 46], [P.x + 12, 5.6, P.z + 26, P.x + 2, 5, P.z + 8, 44], L.k); sh(V(P.x, 0, P.z + 6), 24); }, [[0, 'dream_harp', .5], [.3, 'whoosh_up', .4]]);
// 88 «und ihre Hand nehmen.»: (soñado) le cojo la mano a Mia en el banco; ella sonríe sorprendida
shot(109.5, 'C', 'punch', L => { platz(L, { dusk: true }); const m = miaBench(L, { aLx: 1.0, aLz: .4, aLe: .2, headX: -.1, headY: .4 }); cara(m, L.T, { expr: 'happy', mouth: 'open_smile' });
  const f = put(finn, P.x + 3.4, 0, BZ - 2.6, -PI / 2 - .6); actuar(f, 0, [[0, { aRx: 1.1, aRz: -.15, aRe: .2, lean: .1 }]], { T: L.T }); grin(f, L.T); TINT = 'rgba(255,190,230,.18)'; hearts(V(P.x + 1.6, 6, BZ - 1.6), L.T, 4, 1.6);
  cm([P.x + 1, 6.8, BZ - 12, P.x + 1.6, 4.4, BZ - 1, 42], [P.x + 1.2, 6.6, BZ - 10.6, P.x + 1.6, 4.4, BZ - 1, 40], L.k); }, [[0, 'impact', .3], [.2, 'sparkle', .5], [.7, 'record_scratch', .3]]);
// 89 «Sie zählte die Tage,»: en su cuarto, Mia tacha un día en su calendario con rotulador; Brezel la mira
shot(110.53, 'W', null, L => { miaRoom(L); const m = put(mia, MZX - 2, 0, -8.6, PI); if (m.pack) m.pack.visible = false; const k = clamp((L.lt - .3) / .5); actuar(m, 0, [[0, { aRx: 2.2 + Math.sin(L.T * 14) * .08 * k, aRe: .5, aRz: -.1, aLx: .2 }]], { T: L.T });
  show(CAL, MZX - 2.6, 8.8, -11.7); CALP.userData.draw((x, w, h) => { x.fillStyle = '#fff0f6'; x.fillRect(0, 0, w, h); x.fillStyle = '#2ab86a'; x.fillRect(0, 0, w, 70); txt(x, 'NOCH 6 TAGE', w / 2, 40, 40, '#ffffff'); x.strokeStyle = '#1a1a22'; x.lineWidth = 4; for (let q = 0; q < 7; q++) { const cx = 40 + (q % 4) * 86, cy = 130 + Math.floor(q / 4) * 140; x.strokeRect(cx, cy, 60, 60); if (q < 1 || (q === 1 && k > .5)) { x.strokeStyle = '#d8323a'; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + 60, cy + 60); x.moveTo(cx + 60, cy); x.lineTo(cx, cy + 60); x.stroke(); x.strokeStyle = '#1a1a22'; } } });
  show(DOG, MZX + 3, 0, -4, -PI * .7); DOG.userData.pose(L.T, .4, 0); DOG.userData.slipper.visible = false;
  cm([MZX + 3, 9, -1, MZX - 2.4, 7.6, -11, 46], [MZX + 2, 8.8, -2.4, MZX - 2.4, 7.8, -11, 44], L.k); }, [[0, 'whoosh', .4], [.3, 'marker', .6]]);
// 90 «genau wie ich sie damals gezählt hatte.»: (recuerdo) yo en mi cuarto, igual, tachando mi calendario; tono sepia
shot(111.63, 'R', null, L => { myRoom(L); const c = put(finn, KZX - 2, 0, -8.6, PI); const k = clamp((L.lt - .3) / .6); actuar(c, 0, [[0, { aRx: 2.2 + Math.sin(L.T * 14) * .08 * k, aRe: .5, aRz: -.1, aLx: .2 }]], { T: L.T });
  show(CAL, KZX - 2.6, 8.8, -11.7); CALP.userData.draw((x, w, h) => { x.fillStyle = '#fbf6e8'; x.fillRect(0, 0, w, h); x.fillStyle = '#d8323a'; x.fillRect(0, 0, w, 70); txt(x, 'NOCH 6 TAGE', w / 2, 40, 40, '#ffffff'); x.strokeStyle = '#1a1a22'; x.lineWidth = 4; for (let q = 0; q < 7; q++) { const cx = 40 + (q % 4) * 86, cy = 130 + Math.floor(q / 4) * 140; x.strokeRect(cx, cy, 60, 60); if (q < 1 || (q === 1 && k > .5)) { x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + 60, cy + 60); x.moveTo(cx + 60, cy); x.lineTo(cx, cy + 60); x.stroke(); } } });
  grade.uniforms.sepia.value = .55; cm([KZX + 3, 9, -1, KZX - 2.4, 7.6, -11, 46], [KZX + 2, 8.8, -2.4, KZX - 2.4, 7.8, -11, 44], L.k); }, [[0, 'whirl', .4], [.3, 'marker', .6]]);
// 91 «Da verstand ich, warum sie kam.» (zoom lento): mis ojos de piedra se abren: lo entiendo
shot(113.5, 'Z', 'slow', L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: L.lt > .6 ? 'wide' : 'half', mouth: 'o', noBlink: true } }); onFace(finn, 6.4, -.3, -.3, 40, L.k, 4.4); }, []);
// 92 «Sie wusste, dass hier jemand war, der sie versteht.»: Mia mira hacia el pedestal con una sonrisa triste; plano a dos: ella abajo, yo arriba al fondo
shot(114.99, 'F', null, L => { platz(L, { dusk: true }); statues(L, { fe: { eyes: 'down', mouth: 'smile', noBlink: true } }); miaBench(L, { headX: -.3 }); cara(mia, L.T, { expr: 'warm', eyes: 'happy', mouth: 'smile' });
  cm([P.x - 2.4, 6.4, BZ - 9, P.x + 2, 7, P.z, 46], [P.x - 2, 6.2, BZ - 7.6, P.x + 2, 7.4, P.z, 44], L.k); sh(V(P.x, 0, (BZ + P.z) / 2), 26); }, [[0, 'flash', .3], [.3, 'soft_chime', .4]]);
// 93 «Drei Tage vorher»: «NOCH 3 TAGE»: Mia en el banco por la tarde
shot(117.15, 'C', 'punch', L => { platz(L, { dusk: true }); statues(L); miaBench(L); cara(mia, L.T, { expr: 'warm' }); cm([P.x + 8, 7, BZ + 10, P.x, 4, BZ, 44], [P.x + 7, 6.8, BZ + 9, P.x, 4, BZ, 42], L.k); bigNum('NOCH 3 TAGE', clamp((L.lt - .1) / .2), 'gold', .19, .95); sh(V(P.x, 0, BZ), 22); }, [[0, 'impact', .4], [.1, 'pling', .4]]);
// 94 «blieb sie länger als je zuvor.»: se hace de noche y Mia sigue en el banco: se encienden las farolas una a una
shot(117.95, 'W', null, L => { const n = L.lt > .9; platz(L, n ? { night: true } : { dusk: true }); statues(L, { fe: { eyes: 'down', mouth: 'smile', noBlink: true } }); miaBench(L, { headX: -.25 }); cara(mia, L.T, { expr: 'warm' });
  cm([P.x + 16, 12, BZ + 18, P.x, 5, (BZ + P.z) / 2, 48], [P.x + 14, 11, BZ + 16, P.x, 5, (BZ + P.z) / 2, 46], L.k); sh(V(P.x, 0, (BZ + P.z) / 2), 34); }, [[0, 'whoosh', .4], [.9, 'lamp_on', .5], [1.1, 'crickets', .4]]);
// 95 «Bevor sie ging, legte sie ihre Hand auf den Sockel.»: primer plano: la mano de Mia sobre el mármol, junto a la placa «FINN»
shot(119.71, 'S', null, L => { platz(L, { night: true }); const m = put(mia, P.x + SPX, 0, P.z + 6.2, PI); const u = easeOut(clamp((L.lt - .2) / .5)); actuar(m, 0, [[0, { aRx: lerp(.2, 1.4, u), aRe: .2, aRz: .1, headX: .25 }]], { T: L.T }); cara(m, L.T, { expr: 'warm', eyes: 'closed', mouth: 'smile' });
  cm([P.x + SPX + 4, 5, P.z + 10, P.x + SPX, 3.2, P.z + 4.4, 42], [P.x + SPX + 3, 4.4, P.z + 9, P.x + SPX, 3, P.z + 4.4, 40], L.k); }, [[0, 'swipe', .4], [.5, 'stone_tap', .5], [.7, 'heartbeat', .5]]);
// 96 «„Ich werde mutig sein.“»: Mia aprieta el puño, decidida, mirando arriba
shot(122.08, 'C', 'punch', L => { platz(L, { night: true }); const m = put(mia, P.x + SPX, 0, P.z + 6.2, PI); actuar(m, 0, [[0, { aRx: 1.6, aRe: 2.0, aRz: -.3, aLx: .2, headX: -.25 }]], { T: L.T }); talk(m, L.T, 122.0, 123.4, 'determined');
  onFace(m, 5.4, -.4, .4, 40, L.k, 4.6); }, [[0, 'impact', .4], [.5, 'fist', .4]]);
// 97 «Einen Tag vorher kam sie nicht.»: el banco vacío, solo palomas picoteando; «NOCH 1 TAG»
shot(123.49, 'W', null, L => { platz(L); statues(L, { fe: { eyes: 'side_l', mouth: 'flat', noBlink: true } }); for (let i = 0; i < 4; i++) dove(i, P.x - 3 + i * 2, 0, BZ - 2 - (i % 2) * 1.6, i * 1.3, L.T);
  cm([P.x - 4, 5, BZ - 12, P.x, 2.4, BZ, 44], [P.x - 3, 4.8, BZ - 10, P.x, 2.4, BZ, 42], L.k); bigNum('NOCH 1 TAG', clamp((L.lt - .2) / .2), 'red', .19, .95); sh(V(P.x, 0, BZ), 20); }, [[0, 'whoosh', .4], [.2, 'pigeon_coo', .5], [.3, 'pling', .3]]);
// 98 «Ich habe die ganze Nacht»: de noche, mis ojos clavados en la calle; la luna
shot(125.11, 'C', 'punch', L => { platz(L, { night: true }); statues(L, { fe: { eyes: 'side_r', mouth: 'flat', noBlink: true } }); onFace(finn, 5.6, -.3, .6, 40, L.k, 4.6); }, [[0, 'impact', .4], [.2, 'owl', .4]]);
// 99 «auf die Straße gestarrt.»: la calle vacía de noche, desde detrás del pedestal hacia la entrada de la plaza: nadie
shot(125.73, 'S', null, L => { platz(L, { night: true }); statues(L); cm([P.x + 6, 12, P.z - 6, P.x + 6, 3, P.z + 70, 50], [P.x + 6, 11, P.z - 2, P.x + 6, 3, P.z + 72, 48], L.k); sh(V(P.x, 0, P.z + 30), 50); }, [[0, 'swipe', .4], [.2, 'wind_night', .5]]);
// ---------- d: el sexto día, el beso a Jonas y el final (127,21 – 165,6 s) ----------
// 100 «Am sechsten Tag kam sie früher.»: por la mañana temprano, Mia entra en la plaza con vestido azul claro; «6. TAG»
shot(127.21, 'I', null, L => { platz(L, { dawn: true }); statues(L, { fe: { eyes: 'wide', mouth: 'o', noBlink: true } }); const c = walk(miaK, L, P.x - 6, BZ + 14, PI - .3, 1.8, 0, { f: { expr: 'warm', mouth: 'smile' } });
  const p = c.root.position; orbit(V(p.x, 4.2, p.z), lerp(15, 13, L.k), PI - .3, .1, 44); bigNum('6. TAG', clamp((L.lt - .2) / .2), 'gold', .19, 1); sh(V(p.x, 0, p.z), 24); }, [[0, 'iris_pop', .4], [.1, 'heels', .5], [.3, 'pling', .3]]);
// 101 «Im Kleid,»: travelling por el vestido azul que se mueve al andar
shot(128.9, 'S', null, L => { platz(L, { dawn: true }); const c = walk(miaK, L, P.x, BZ + 8, PI, 1.2, 0, { f: { expr: 'warm', mouth: 'smile' } }); const p = c.root.position;
  cm([p.x + 4, 2.6, p.z - 7, p.x, 3, p.z, 40], [p.x - 4, 3.4, p.z - 7, p.x, 3.6, p.z, 40], L.k); sh(V(p.x, 0, p.z), 20); }, [[0, 'swipe', .4], [.2, 'cloth', .5]]);
// 102 «die Haare frisch gemacht.»: primer plano: el moño con lazo amarillo, se coloca un mechón y sonríe nerviosa
shot(129.66, 'C', 'punch', L => { platz(L, { dawn: true }); const c = put(miaK, P.x, 0, BZ - 2, PI); actuar(c, 0, [[0, { aRx: 2.6, aRe: 2.1, aRz: -.5, headZ: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'warm', eyes: 'happy', mouth: 'smile' });
  onFace(c, 5, .4, -.9, 40, L.k, 4.2); }, [[0, 'impact', .4], [.2, 'sparkle', .5]]);
// 103 «Sie setzte sich auf die Bank»: se sienta en el borde del banco, rígida, con las manos en las rodillas
shot(130.85, 'W', null, L => { platz(L, { dawn: true }); statues(L); miaBench(L, { aLx: .7, aRx: .7, aLe: .6, aRe: .6 }, miaK); cara(miaK, L.T, { expr: 'worried', mouth: 'grimace' });
  cm([P.x + 9, 6.6, BZ - 12, P.x, 4, BZ, 44], [P.x + 8, 6.4, BZ - 10.6, P.x, 4, BZ, 42], L.k); sh(V(P.x, 0, BZ), 22); }, [[0, 'whoosh', .4], [.3, 'bench_creak', .5]]);
// 104 «und atmete tief durch.»: cierra los ojos y respira hondo: el pecho sube y baja
shot(132.07, 'C', 'slow', L => { platz(L, { dawn: true }); const b = Math.sin(clamp(L.lt / 1) * PI); miaBench(L, { aLx: .7, aRx: .7, aLe: .6, aRe: .6, lean: -.12 * b, headX: -.2 * b, aLz: .15 * b, aRz: .15 * b }, miaK); cara(miaK, L.T, { eyes: 'closed', mouth: b > .3 ? 'o' : 'smile' });
  onFace(miaK, 5.6, 0, .3, 40, L.k, 4.6); }, [[.1, 'breath_in', .6], [.8, 'breath', .5]]);
// 105 «„Es ist mir peinlich,»: Mia, colorada, habla mirando hacia arriba, tapándose media cara
shot(133.11, 'C', 'punch', L => { platz(L, { dawn: true }); miaBench(L, { aRx: 2.2, aRe: 2.3, aRz: -.45, headX: -.3 }, miaK); talk(miaK, L.T, 133.1, 134.2, 'warm', { eyes: 'happy' }); onFace(miaK, 5, -.4, -.5, 40, L.k, 4.2); }, [[0, 'impact', .4], [.2, 'girl_giggle', .4]]);
// 106 «dass ich mich nicht früher getraut habe.“»: yo, de piedra, con los ojos brillando de esperanza y corazones
shot(134.26, 'F', null, L => { platz(L, { dawn: true }); statues(L, { fe: { eyes: 'happy', mouth: 'smile', noBlink: true } }); hearts(hp(finn).add(V(0, 1, 1)), L.T, 5, 2.4); onFace(finn, 6, -.3, .3, 40, L.k, 4.8); }, [[0, 'flash', .3], [.2, 'heartbeat', .5], [.6, 'sparkle', .4]]);
// 107 «Sie stand auf,»: Mia se levanta del banco de golpe, decidida
shot(135.76, 'C', 'punch', L => { platz(L, { dawn: true }); const u = easeOut(clamp(L.lt / .45)); const c = put(miaK, P.x + .2, lerp(sitY(miaK, 2.4), 0, u), BZ - .3 - u * .8, PI); actuar(c, 0, [[0, { lLx: 1.5 * (1 - u), rLx: 1.5 * (1 - u), lLk: 1.5 * (1 - u), lRk: 1.5 * (1 - u), lRx: 1.5 * (1 - u), aRx: .3, aLx: .3 }]], { T: L.T, weight: false }); c.blob.visible = u > .9; cara(c, L.T, { expr: 'determined' });
  onBody(c, 10, .5, .12, 42, L.k, 9, .4, 3); sh(V(P.x, 0, BZ), 20); }, [[0, 'impact', .4], [.1, 'bench_creak', .5], [.3, 'cloth', .4]]);
// 108 «stieg auf den Sockel,»: sube los escalones del pedestal; las dos estatuas al fondo
shot(136.84, 'S', null, L => { platz(L, { dawn: true }); statues(L, { fe: { eyes: 'down', mouth: 'o', noBlink: true }, je: { eyes: 'half', mouth: 'flat', noBlink: true } }); const u = easeInOut(clamp(L.lt / .9)); const c = put(miaK, P.x + .3, lerp(0, TOP, u), P.z + lerp(9, 2.4, u), PI); c.blob.visible = false;
  actuar(c, 0, [[0, { ...walkP(L.T, 0), lLx: -.9 * Math.sin(L.T * 9), lLk: 1.2 * Math.max(0, Math.sin(L.T * 9)), lRk: 1.2 * Math.max(0, -Math.sin(L.T * 9)) }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  cm([P.x + 10, 7, P.z + 20, P.x, 6.6, P.z + 2, 46], [P.x + 9, 7.6, P.z + 17, P.x, 7.2, P.z + 2, 44], L.k); sh(V(P.x, 0, P.z + 4), 22); }, [[0, 'swipe', .4], [.2, 'heels', .5], [.6, 'heels', .5]]);
// 109 «kam ganz nah …» (zoom lento): Mia, en el pedestal, se acerca muchísimo a MI cara; yo con los ojos como platos
shot(137.84, 'C', 'slow', L => { platz(L, { dawn: true }); statues(L, { fe: { eyes: 'wide', mouth: 'o', noBlink: true } }); const c = put(miaK, P.x + SPX * .25, TOP, P.z + 2.2, PI / 2 + .45); c.blob.visible = false; actuar(c, 0, [[0, { lean: .1 + L.k * .1, aLx: .5, aRx: .5, headX: -.1 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'o' });
  const h = hp(finn); cm([h.x - 1, h.y + .6, h.z + 9, h.x - 1.6, h.y - .5, h.z + 1, 42], [h.x - 1, h.y + .4, h.z + 6.4, h.x - 1.6, h.y - .4, h.z + 1, 40], L.k); hearts(h.clone().add(V(0, 1, 1)), L.T, 3, 2); }, []);
// 110 «und küsste»: Mia se gira… hacia el otro lado
shot(138.7, 'W', null, L => { platz(L, { dawn: true }); statues(L, { fe: { eyes: 'side_l', mouth: 'o', noBlink: true } }); const c = put(miaK, P.x - .4, TOP, P.z + 2.2, lerp(PI / 2 + .45, -PI / 2 - .45, easeInOut(clamp(L.lt / .5)))); c.blob.visible = false; actuar(c, 0, [[0, { lean: .1, aLx: .5, aRx: .5 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'o' });
  cm([P.x, TOP + 6, P.z + 15, P.x, TOP + 4.6, P.z, 44], [P.x, TOP + 6, P.z + 13, P.x, TOP + 4.6, P.z, 42], L.k); sh(V(P.x, 0, P.z), 20); }, [[0, 'whoosh', .4], [.2, 'cloth', .4]]);
// 111 «Jonas.»: ¡le da un beso a Jonas! golpe de zoom; yo detrás, con la boca abierta
shot(139.57, 'C', 'punch', L => { platz(L, { dawn: true }); statues(L, { fe: { expr: 'shock', eyes: 'wide', mouth: 'o', noBlink: true } }); const c = put(miaK, P.x - SPX + 1.7, TOP, P.z + 1, -PI / 2 - .35); c.blob.visible = false; actuar(c, 0, [[0, { lean: .2, aLx: 1.0, aRx: 1.0, aLe: .8, aRe: .8, aLz: -.2 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'o' });
  hearts(hp(jonas).add(V(.8, .6, .8)), L.T, 4, 1.6); cm([P.x + 4, TOP + 6.4, P.z + 12, P.x - 1.6, TOP + 5.2, P.z, 42], [P.x + 3.6, TOP + 6.2, P.z + 10.6, P.x - 1.6, TOP + 5.2, P.z, 40], L.k); sh(V(P.x, 0, P.z), 20); }, [[0, 'kiss', .8], [.1, 'braam', .7], [.3, 'record_scratch', .4]]);
// 112 «Jonas bewegte zuerst die Finger.»: la mano de Jonas: los dedos recuperan el color y se mueven
shot(140.23, 'F', null, L => { platz(L, { dawn: true }); statues(L, { finn: false, jonas: false }); const j = put(jonas, P.x - SPX, TOP, P.z, 0); const w = Math.sin(L.T * 14) * .3 * clamp(L.lt * 2); actuar(j, 0, [[0, { ...STJ, aLx: .35 + w, aLe: .3 + Math.abs(w) }]], { T: L.T, weight: false }); j.blob.visible = false; stone(j, 1.1, L.lt > .3 ? inHand(j) : null); cara(j, L.T, { eyes: 'half', mouth: 'flat', noBlink: true });
  const h = wpos(j.aL.hand); cm([h.x + 2.4, h.y + 1.4, h.z + 5, h.x, h.y, h.z, 40], [h.x + 2, h.y + 1.2, h.z + 4.2, h.x, h.y, h.z, 38], L.k); stoneDust(h, L.t0 + .3, L.T, 8, .4); }, [[0, 'flash', .4], [.3, 'stone_crack', .6], [.6, 'creak_stone', .4]]);
// 113 «Dann fiel er auf die Knie»: Jonas, ya con color, cae de rodillas sobre el pedestal entre una nube de polvo de piedra
shot(142.02, 'C', 'punch', L => { platz(L, { dawn: true }); statues(L, { jonas: false, fe: { eyes: 'side_l', mouth: 'o', noBlink: true } }); const u = easeIn(clamp(L.lt / .35)); const j = put(jonas, P.x - SPX, TOP - u * 1.6, P.z + u * .8, .3); j.blob.visible = false; actuar(j, 0, [[0, { lLx: -.3 * u, lRx: -.3 * u, lLk: 1.6 * u, lRk: 1.6 * u, lean: .35 * u, aLx: .9 * u, aRx: .9 * u }]], { T: L.T, weight: false }); stone(j, clamp(.4 - L.lt)); cara(j, L.T, { eyes: 'scared', mouth: 'o' });
  stoneDust(V(P.x - SPX, TOP + 2, P.z + 1), L.t0 + .3, L.T, 18, 1.2); cm([P.x - 1, TOP + 5, P.z + 14, P.x - SPX, TOP + 3, P.z, 44], [P.x - 1.4, TOP + 4.6, P.z + 12.4, P.x - SPX, TOP + 3, P.z, 42], L.k); sh(V(P.x, 0, P.z), 20); }, [[0, 'impact', .5], [.3, 'stone_thud', .7], [.4, 'rubble', .5]]);
// 114 «und hustete Staub.»: Jonas de rodillas tose nubes de polvo gris; Mia a su lado, le pone la mano en la espalda
shot(143.16, 'S', null, L => { platz(L, { dawn: true }); statues(L, { jonas: false, fe: { eyes: 'side_l', mouth: 'flat', noBlink: true } }); const c = Math.abs(Math.sin(L.T * 9)); const j = put(jonas, P.x - SPX, TOP - 1.6, P.z + .8, .3); j.blob.visible = false; actuar(j, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, lean: .4 + c * .15, aRx: 1.6, aRe: 2.0, aRz: -.4, aLx: .9, headX: .2 + c * .2 }]], { T: L.T, weight: false }); cara(j, L.T, { eyes: 'closed', mouth: c > .5 ? 'o' : 'grimace' });
  const m = put(miaK, P.x - SPX + 2.6, TOP, P.z + 1.6, -PI / 2 - .2); m.blob.visible = false; actuar(m, 0, [[0, { lean: .2, aRx: 1.1, aRe: .3, crouch: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'worried' }); dust(hp(j).add(V(0, -.2, 1.4)), L.t0 + .1, L.T, 10, .5);
  onBody(j, 9, .5, .12, 42, L.k, 8, .4, 1.6); }, [[0, 'swipe', .4], [.1, 'cough', .6], [.5, 'cough', .5]]);
// 115 «„Ich bin jeden Tag hier vorbeigelaufen.»: (recuerdo, sepia) Mia pasa cada día junto a Jonas, que mira el móvil y ni la ve
shot(144.18, 'R', null, L => { platz(L); const j = put(jonas, P.x + 4, 0, P.z + 30, -.3); actuar(j, 0, [[0, { aRx: 1.2, aRe: 1.4, headX: .35 }]], { T: L.T }); attach(PHONE, j.aR.hand, [0, -.55, .5], [-.4, 0, 0], .9); cara(j, L.T, { eyes: 'down', mouth: 'flat' });
  walk(mia, L, P.x - 6, P.z + 32, PI / 2 + .2, 2.2, 0, { pose: { headY: -.6 }, f: { expr: 'warm', eyes: 'side_r', mouth: 'smile' } }); grade.uniforms.sepia.value = .55;
  cm([P.x - 2, 6, P.z + 46, P.x, 4.4, P.z + 31, 44], [P.x - 1, 6, P.z + 44, P.x + 1, 4.4, P.z + 31, 42], L.k); sh(V(P.x, 0, P.z + 30), 22); }, [[0, 'whirl', .4], [.2, 'steps', .4]]);
// 116 «Bevor du zur Statue wurdest,»: Mia, arrodillada junto a Jonas en el pedestal, le habla con los ojos llorosos
shot(145.94, 'C', 'punch', L => { platz(L, { dawn: true }); statues(L, { jonas: false }); const j = put(jonas, P.x - SPX, TOP - 1.6, P.z + .8, .5); j.blob.visible = false; actuar(j, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, lean: .1, aLx: .5, aRx: .5, headY: .3 }]], { T: L.T, weight: false }); cara(j, L.T, { expr: 'confused' });
  const m = put(miaK, P.x - SPX + 2.4, TOP - 1.4, P.z + 2.6, -PI / 2 - .5); m.blob.visible = false; actuar(m, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, aLx: .6, aRx: .6, aLe: 1, aRe: 1 }]], { T: L.T, weight: false }); talk(m, L.T, 145.9, 148.4, 'sad'); tears(m, L.T);
  onFace(m, 5.6, 0, -.6, 40, L.k, 4.8); }, [[0, 'impact', .4], [.2, 'sniff', .4]]);
// 117 «hast du mich nie gesehen.“»: plano a dos de perfil: ella le mira, él la mira por primera vez
shot(147.3, 'W', null, L => { platz(L, { dawn: true }); statues(L, { jonas: false, fe: { eyes: 'side_l', mouth: 'wavy', noBlink: true } }); const j = put(jonas, P.x - SPX, TOP - 1.6, P.z + .8, PI / 2 - .3); j.blob.visible = false; actuar(j, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, aLx: .5, aRx: .5 }]], { T: L.T, weight: false }); cara(j, L.T, { expr: 'confused' });
  const m = put(miaK, P.x - SPX + 2.8, TOP - 1.4, P.z + 1.2, -PI / 2 + .1); m.blob.visible = false; actuar(m, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, aLx: .6, aRx: .6, aLe: 1, aRe: 1 }]], { T: L.T, weight: false }); talk(m, L.T, 147.2, 148.4, 'sad');
  cm([P.x - SPX + 1.4, TOP + 4.6, P.z + 11, P.x - SPX + 1.4, TOP + 3, P.z + 1, 42], [P.x - SPX + 1.4, TOP + 4.4, P.z + 10, P.x - SPX + 1.4, TOP + 3, P.z + 1, 40], L.k); }, [[0, 'whoosh', .4]]);
// 118 «Jonas sah sie verwirrt an.»: primer plano de Jonas, confuso, ladeando la cabeza
shot(148.47, 'C', 'punch', L => { platz(L, { dawn: true }); const j = put(jonas, P.x - SPX, TOP - 1.6, P.z + .8, .5); j.blob.visible = false; actuar(j, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, aRx: 1.4, aRe: 2.2, aRz: -.3, headZ: .2 }]], { T: L.T, weight: false }); cara(j, L.T, { expr: 'confused', mouth: 'flat' }); badge('q', '?', W * .72, H * .3, clamp((L.lt - .3) / .2));
  onFace(j, 5, 0, .4, 40, L.k, 4.2); }, [[0, 'impact', .4], [.3, 'hmm', .4]]);
// 119 «„Wie heißt du?“»: Jonas le pregunta, con una sonrisa torpe
shot(149.93, 'S', null, L => { platz(L, { dawn: true }); const j = put(jonas, P.x - SPX, TOP - 1.6, P.z + .8, .5); j.blob.visible = false; actuar(j, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, aRx: .6, aLx: .6 }]], { T: L.T, weight: false }); talk(j, L.T, 149.9, 150.6, 'happy'); onFace(j, 5.4, 0, -.5, 40, L.k, 4.6); }, [[0, 'swipe', .4]]);
// 120 «Sie lachte und weinte gleichzeitig»: Mia ríe y llora a la vez, tapándose la boca
shot(150.68, 'C', 'punch', L => { platz(L, { dawn: true }); const m = put(miaK, P.x - SPX + 2.4, TOP - 1.4, P.z + 2.6, -PI / 2 - .5); m.blob.visible = false; actuar(m, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6, aRx: 2.0, aRe: 2.2, aRz: -.4, aLx: .6 }]], { T: L.T, weight: false }); laughF(m, L.T); tears(m, L.T);
  onFace(m, 5, 0, .4, 40, L.k, 4.4); }, [[0, 'impact', .4], [.1, 'girl_laugh_cry', .5]]);
// 121 «und sagte es ihm.»: se lo dice: bocadillo «MIA!»; los dos se sonríen
shot(152.32, 'W', null, L => { platz(L, { dawn: true }); statues(L, { jonas: false, fe: { eyes: 'side_l', mouth: 'wavy', noBlink: true } }); const j = put(jonas, P.x - SPX, TOP - 1.6, P.z + .8, PI / 2 - .3); j.blob.visible = false; actuar(j, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6 }]], { T: L.T, weight: false }); grin(j, L.T);
  const m = put(miaK, P.x - SPX + 2.8, TOP - 1.4, P.z + 1.2, -PI / 2 + .1); m.blob.visible = false; actuar(m, 0, [[0, { lLx: -.3, lRx: -.3, lLk: 1.6, lRk: 1.6 }]], { T: L.T, weight: false }); talk(m, L.T, 152.3, 153.4, 'happy'); bubble(m, 'MIA!', clamp((L.lt - .4) / .2));
  cm([P.x - SPX + 1.4, TOP + 4.6, P.z + 11, P.x - SPX + 1.4, TOP + 3, P.z + 1, 42], [P.x - SPX + 1.2, TOP + 4.4, P.z + 9.6, P.x - SPX + 1.4, TOP + 3, P.z + 1, 40], L.k); }, [[0, 'whoosh', .4], [.4, 'pop', .4]]);
// 122 «Sie gingen Hand in Hand davon,»: Mia y Jonas se van de la mano por la plaza; detrás, yo solo en el pedestal
shot(153.52, 'S', null, L => { platz(L); statues(L, { jonas: false, fe: { eyes: 'down', mouth: 'wavy', noBlink: true } }); const sw = Math.sin(L.T * 4) * .3;
  walk(miaK, L, P.x - 2, P.z + 14, -.25, 1.6, 0, { pose: { aLx: .3 + sw, aLz: .2 }, f: { expr: 'happy', mouth: 'smile' } }); walk(jonas, L, P.x - 4.6, P.z + 14, -.25, 1.6, 1, { pose: { aRx: .3 + sw, aRz: -.2 }, f: { expr: 'happy' } });
  cm([P.x - 3, 7, P.z + 40, P.x - 1, 6.4, P.z + 8, 46], [P.x - 2, 7.2, P.z + 38, P.x, 6.6, P.z + 8, 44], L.k); sh(V(P.x, 0, P.z + 14), 26); }, [[0, 'swipe', .4], [.2, 'steps', .4], [.4, 'birds', .4]]);
// 123 «und sie nahm den Schal mit.»: Mia desenrolla la bufanda de la columnita y se la lleva; mis ojos la siguen
shot(154.82, 'C', 'punch', L => { platz(L); statues(L, { jonas: false, fe: { eyes: 'side_l', mouth: 'wavy', noBlink: true } }); SO.SCARF.visible = L.lt < .5; const m = put(miaK, P.x + .3, TOP, P.z + 2.2, PI + .1); m.blob.visible = false; actuar(m, 0, [[0, { aLx: 1.6, aRx: 1.6, aLe: 1.2, aRe: 1.2, aLz: -.3, aRz: -.3 }]], { T: L.T }); cara(m, L.T, { expr: 'happy' }); if (L.lt >= .5) attach(SCARFH, m.aR.hand, [.6, -.8, .6], [0, 0, 0], 1);
  cm([P.x + 5, TOP + 6.6, P.z + 13, P.x + 1, TOP + 4.6, P.z, 44], [P.x + 4.4, TOP + 6.4, P.z + 11.6, P.x + 1, TOP + 4.6, P.z, 42], L.k); sh(V(P.x, 0, P.z), 20); }, [[0, 'impact', .4], [.3, 'cloth', .6]]);
// 124 «Er kannte nicht mal ihren Namen.»: Jonas y Mia, de espaldas al fondo de la plaza, él se rasca la cabeza
shot(156.37, 'W', null, L => { platz(L); walk(miaK, L, P.x - 2, P.z + 30, PI - .2, 1.4, 0, { f: { expr: 'happy' } }); walk(jonas, L, P.x - 4.6, P.z + 30, PI - .2, 1.4, 1, { pose: { aRx: 2.6, aRe: 2.2, aRz: -.4 }, f: { expr: 'confused' } }); bubble(jonas, '???', clamp((L.lt - .3) / .2));
  const p = jonas.root.position; orbit(V(p.x + 1.3, 4.4, p.z), 13, PI - .2 + .5, .1, 44); sh(V(p.x, 0, p.z), 22); }, [[0, 'whoosh', .4], [.2, 'steps', .4]]);
// 125 «Ich wusste alles.» (zoom lento): yo, solo en el pedestal; el sitio de Jonas vacío
shot(158.06, 'Z', 'slow', L => { platz(L, { dusk: true }); statues(L, { jonas: false, fe: { eyes: 'down', mouth: 'wavy', noBlink: true } }); onFace(finn, 9, -.4, -1.4, 42, L.k, 5.4); }, []);
// 126 «Ihre Lieblingsfarbe.»: (recuerdo) la chaqueta verde de Mia, en el banco, con luz dorada; «GRÜN»
shot(158.9, 'F', null, L => { platz(L, { dusk: true }); miaBench(L, { headX: -.3 }); cara(mia, L.T, { expr: 'warm', eyes: 'happy' }); grade.uniforms.sepia.value = .35; onBody(mia, 8, .2, .12, 42, L.k, 7, .1, 2.6); badge('green', 'GRÜN', W / 2, H * .2, clamp((L.lt - .3) / .2)); }, [[0, 'flash', .3], [.3, 'soft_chime', .4]]);
// 127 «Den Namen ihres Hundes.»: (recuerdo) Brezel moviendo la cola; «BREZEL»
shot(160.23, 'C', 'punch', L => { miaRoom(L); show(DOG, MZX - 1, 0, 2, .3); DOG.userData.pose(L.T, 1, 0); DOG.userData.slipper.visible = false; grade.uniforms.sepia.value = .35;
  cm([MZX + 1, 4.4, 11, MZX - 1, 2.2, 2, 40], [MZX + .6, 4, 9.6, MZX - 1, 2.2, 2, 38], L.k); badge('tag', 'BREZEL', W / 2, H * .2, clamp((L.lt - .2) / .2)); }, [[0, 'impact', .4], [.1, 'dog_bark', .4]]);
// 128 «Ihre Angst vor Rolltreppen.»: (recuerdo) Mia al pie de la escalera mecánica, asustada
shot(161.39, 'S', null, L => { mallS(L); const m = put(mia, MLX + .4, 0, 7, PI); actuar(m, 0, [[0, { aLx: 1.8, aRx: 1.8, aLe: 2.0, aRe: 2.0, aLz: -.3, aRz: -.3, ...shiver(L.T, 1.5) }]], { T: L.T }); cara(m, L.T, { expr: 'shock', eyes: 'scared', mouth: 'grimace' }); grade.uniforms.sepia.value = .35;
  cm([MLX + 4, 7, 20, MLX, 6, 4, 44], [MLX + 3, 6.8, 18, MLX, 6.2, 4, 42], L.k); }, [[0, 'swipe', .4], [.1, 'escalator', .4]]);
// 129 «Ich wusste nur nicht,»: atardecer: yo solo en el pedestal, la columnita sin bufanda; los ojos llenos de lágrimas
shot(162.68, 'B', null, L => { platz(L, { dusk: true }); statues(L, { jonas: false, fe: { eyes: 'cry', mouth: 'wavy', noBlink: true } }); tears(finn, L.T); onFace(finn, 6, -.2, .4, 40, L.k, 5); }, [[.2, 'sad_sting', .5]]);
// 130 «dass nichts davon für mich war.»: grúa que se aleja: el pedestal «1 JAHR SINGLE» conmigo solo, la plaza vacía al atardecer; fundido
shot(163.8, 'B', null, L => { platz(L, { dusk: true }); statues(L, { jonas: false, fe: { eyes: 'down', mouth: 'wavy', noBlink: true } }); for (let i = 0; i < 2; i++) dove(i, P.x - 3 + i * 2, TOP + .1, P.z + .6, i, L.T);
  cm([P.x + 2, 9, P.z + 16, P.x + 2, 7.4, P.z, 42], [P.x + 2, 26, P.z + 52, P.x, 6, P.z, 48], L.k, easeOut); DARK = clamp((L.lt - 1.3) / .5) * .85; sh(V(P.x, 0, P.z + 10), 40); }, [[0, 'wind_soft', .5], [.4, 'pigeon_coo', .3]]);


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
  if (HQ) { renderer.toneMappingExposure *= +(QS.get('exp') ?? .85); grade.uniforms.sat.value = +(QS.get('sat') ?? 1.38); grade.uniforms.sharp.value = .6; grade.uniforms.vig.value = Math.min(grade.uniforms.vig.value, .32); bloom.strength = Math.min(Math.max(bloom.strength, .14), .2); bloom.threshold = .88; ao.enabled = QS.get('ao') !== '0'; DOF = 1; }
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
  { const fd = camera.position.distanceTo(CAMT); bokeh.uniforms.focus.value = fd; bokeh.uniforms.aperture.value = DOF * .0022 * clamp((26 - fd) / 14); bokeh.enabled = HQ && QS.get('dof') === '1'; }
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
window.DBG = { applyPose, hp, finn, jonas, mia, cam, P, HB, stone, renderer, composer, bloom, sun, grade, scene, camera };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

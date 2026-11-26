// SCHUTZENGEL — «In dieser Welt wird jeder mit zwei Schutzengeln geboren. Und sie sind immer Gegenteile.»
// Jonas (15) nació sin ángeles («das leere Kind»); sus mejores amigos Elias y Mira nacieron el mismo minuto (3:17)… y resultan ser Nachtiel y Lumiel.
// Ciudad propia: Lichtenau (Altstadt de entramado). Planos en src/p/*.js; armar.py los une en src/index.js.
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { schule, lindenthal, sportplatz, alpHaus } from './nsets.js';
import { kueche } from './swelt.js';
import { flur } from './svsets.js';
import { pancakes } from './bsets.js';
import { taxi } from './gort.js';
import { AK, PAIRS, angelito, bigWings, bigHalo, makeTod, makeLeben, beam, shadowDisc, feathers, embers, jungle, saeuglinge, vogelHaus, graffiti, fest, car, wallClock, glowM } from './engwelt.js';
import { makeJonas, makeElias, makeMira, makeMama, makeVogel, makeKevin, makeZwilling, makeArzt, makeGraf, makeBaby } from './engvolk.js';
import { makeExtra } from './ecast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 162.4, U = W / 720, PI = Math.PI;
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
// Lichtenau (x = 0): Lindenthal (plaza adoquinada x ∈ ±50, z ∈ [-85, 65], casas a x = ±52, iglesia (0, -120), Maibaum (18, -14), fuente (-14, -26),
//   bancos en x = -40 (z = -8, 6, 20) mirando +x); Gründerfest: escenario en (0, 0, -64) (tablado y = 4.3), atril en (0, 4.3, -60); muro de la pintada en (-22, 0, 40).
// Küche (KUX): mesa en (0, 0), encimera a la izquierda (x = -17). Säuglingsstation (NUX): cunas en NU.CR, mesa del médico (0, 0, -12), reloj NU.CLK.
// Vogel (VHX): escalinata de 12 peldaños de z = 9 (y 0) a z = -1 (y 7,2); calle z ∈ [15, 45]; aparcamiento en x ∈ [24, 70], z ∈ [18, 40].
// Flur (FLX): pasillo x ∈ ±11, taquillas a x = ±9,8, z ∈ [14, -76]. Sportplatz (SPX): tribuna en x = -31 (bancos que suben hacia -x).
const KUX = 1400, NUX = 2200, VHX = 3000, FLX = 3800, SPX = 4600;
const LT = lindenthal(scene, { name: 'LICHTENAU', shops: { 2: 'BÄCKEREI', 5: 'GASTHOF ENGEL', 9: 'APOTHEKE', 12: 'CAFÉ' } });
const NLT = LT.g.children.length; const FEST = fest(LT.g); FEST.g.visible = false; const FESTX = LT.g.children.slice(NLT).filter(o => o !== FEST.g);
const JUNG = jungle(LT.g); JUNG.visible = false;
const MAUER = new THREE.Group(); LT.g.add(MAUER); MAUER.position.set(-22, 0, 40); { const br = mat(0xd8c8b0, { roughness: .95 }); box(24, 8, 1.4, br, .1, MAUER, 0, 4, 0); box(24.6, .6, 1.8, mat(0xb8a890), .1, MAUER, 0, 8.2, 0); const gf = graffiti(); gf.position.set(0, 4.4, .75); MAUER.add(gf); gf.material.transparent = true; }
const KU = kueche(scene, KUX), NU = saeuglinge(scene, NUX), VH = vogelHaus(scene, VHX), FL = flur(scene, FLX), SP = sportplatz(scene, SPX);
const FLL = []; FL.g.traverse(o => { if (o.isPointLight) FLL.push(o); }); const FLG = []; FL.g.traverse(o => { if (o.isMesh && o.material && o.material.emissiveIntensity > .5 && o.position.y > 15) FLG.push(o); });
const PARK = new THREE.Group(); VH.g.add(PARK); { const lm = mat(0xffffff, { roughness: .6 }); for (let k = 0; k < 7; k++) box(.3, .05, 9, lm, 0, PARK, 24 + k * 7.4, .04, 28); const sg = textPlane(5, 5, 128, 128, (c, w, h) => { c.fillStyle = '#1a5ab8'; c.fillRect(0, 0, w, h); c.font = '700 100px Cap, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText('P', w / 2, h / 2 + 6); }); sg.position.set(20, 9, 20); PARK.add(sg); cyl(.2, .2, 11, mat(0x8a8a8e), 6, PARK, 20, 5.5, 19.8); }
const CARS = [0xd8202a, 0x2a6ad8, 0xf2f2f2, 0x2a2a30, 0xf2c81a, 0x3ab86a].map(c => { const o = car(VH.g, c); o.visible = false; return o; });
const SETS = { LT: LT.g, KU: KU.g, NU: NU.g, VH: VH.g, FL: FL.g, SP: SP.g };
for (const k in SETS) outline(SETS[k], OS);
// ---------- reparto ----------
const jonas = makeJonas(scene), elias = makeElias(scene), mira = makeMira(scene), mama = makeMama(scene), vogel = makeVogel(scene), kevin = makeKevin(scene);
const ZW = [makeZwilling(scene, 0), makeZwilling(scene, 1)], arzt = makeArzt(scene), graf = makeGraf(scene);
const BABY = Array.from({ length: 8 }, (_, i) => makeBaby(scene, i));
kitFace(jonas, 'kid'); kitFace(elias, 'hero'); kitFace(mira, 'girl'); kitFace(mama, 'girl'); kitFace(vogel, 'mustache'); kitFace(kevin, 'villain'); ZW.forEach(c => kitFace(c, 'kid')); kitFace(arzt, 'plain'); kitFace(graf, 'mustache'); BABY.forEach(c => kitFace(c, 'kid'));
const DX = Array.from({ length: 26 }, (_, i) => { const c = makeExtra(scene, i + 60); kitFace(c, ['girl', 'plain', 'girl', 'hero', 'girl', 'mustache', 'kid'][i % 7]); return c; });
const MAIN = [jonas, elias, mira, mama, vogel, kevin, ...ZW, arzt, graf, ...BABY];
const POOL = [...MAIN, ...DX];
POOL.forEach(c => outline(c.root, OC));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(.5, 'rgba(0,0,0,.26)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const PROPS = [];
const P_ = o => { if (!o.parent) scene.add(o); PROPS.push(o); return o; };
// angelitos: varias copias de cada tipo
const ANG = {}; for (const k in AK) ANG[k] = Array.from({ length: ['frieden', 'krieg', 'oben', 'unten'].includes(k) ? 9 : 6 }, () => { const a = P_(angelito(k)); outline(a, OP); return a; });
let AUSE = {}; const angel = (kind, x, y, z, ry, T, s = 1, sd = 0, fly = 1) => { const n = AUSE[kind] = (AUSE[kind] || 0) + 1, a = ANG[kind][n - 1]; if (!a) return null; show(a, x, y, z, ry, s); a.userData.anim(T, sd, fly); return a; };
// los dos ángeles de alguien, a la altura de los hombros (izq = a, der = b); o.spread separa, o.up sube
function engel(ch, a, b, T, o = {}) { const h = hp(ch), s = (ch.spec.scale || 1) * (o.s ?? 1), r = ch.root.rotation.y, rx = Math.cos(r), rz = -Math.sin(r), fx = Math.sin(r), fz = Math.cos(r), sp = (o.spread ?? 2.3) * (ch.spec.scale || 1), up = (o.up ?? -.2) * (ch.spec.scale || 1), fw = o.fw ?? -.2;
  const A = [];
  for (const [kind, sd] of [[a, -1], [b, 1]]) { if (!kind) { A.push(null); continue; } const ry = r + (o.look ?? sd * -.25); A.push(angel(kind, h.x + rx * sp * sd + fx * fw, h.y + up, h.z + rz * sp * sd + fz * fw, ry, T, s * (o.sz ?? 1), ch.seed + sd * 3, o.fly ?? 1)); }
  return A; }
const PAN = P_(new THREE.Group()); { cyl(1.6, 1.4, .3, mat(0x2a2a30, { metalness: .6, roughness: .35 }), 24, PAN, 0, 0, 0); cyl(.14, .14, 2.6, mat(0x1a1a1e), 8, PAN, 2.6, .1, 0).rotation.z = PI / 2; PAN.userData.cake = cyl(1.2, 1.2, .2, mat(0xe8a850, { roughness: .6 }), 20, PAN, 0, .25, 0); }
const CAKES = P_(new THREE.Group()); pancakes(CAKES, .9); { const j = new THREE.Group(); CAKES.add(j); j.position.set(3.2, 0, -.6); cyl(.75, .75, 1.8, mat(0x4a2a14, { roughness: .2, transparent: true, opacity: .95 }), 18, j, 0, .9, 0); cyl(.8, .8, .4, mat(0xffffff, { roughness: .4 }), 18, j, 0, 2.0, 0); const lab = textPlane(1.5, .9, 150, 90, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.font = '700 40px Cap, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#1a1a1a'; c.fillText('n', 24, h / 2); c.fillStyle = '#e8202a'; c.fillText('utella', w / 2 + 18, h / 2); }); lab.position.set(0, .95, .77); j.add(lab); const sp = cyl(.12, .12, 2.4, mat(0xd8d8e0, { metalness: .8 }), 6, j, .4, 2.0, 0); sp.rotation.z = .3; }
const BAG = P_(new THREE.Group()); { box(2, 2.4, 1.2, mat(0xc8a070, { roughness: 1 }), .1, BAG, 0, 1.2, 0); for (let k = 0; k < 3; k++) sphere(.4, mat([0xd8202a, 0xffd23f, 0x3ab84a][k]), BAG, -.6 + k * .6, 2.6, 0, 8, 6); const br = cyl(.3, .3, 2, mat(0xd8a050), 8, BAG, .5, 2.9, 0); br.rotation.z = .3; }
const APPLES = Array.from({ length: 4 }, (_, i) => P_(sphere(.38, mat([0xd8202a, 0x8ad84a, 0xffd23f, 0xd8202a][i], { roughness: .4 }), null, 0, 0, 0, 10, 8)));
const BOOKS = Array.from({ length: 4 }, (_, i) => P_(box(1.6, .35, 2.2, mat([0x2a6ad8, 0xd8202a, 0xffd23f, 0x3ab86a][i], { roughness: .7 }), .05)));
const STETH = P_(new THREE.Group()); { cyl(.08, .08, 1.4, mat(0x2a2a30), 6, STETH, 0, .7, 0); cyl(.3, .3, .14, mat(0xd8d8e0, { metalness: .8 }), 14, STETH, 0, 0, 0).rotation.x = PI / 2; }
const TOD = makeTod(scene), LEBEN = makeLeben(scene); outline(TOD.root, OC); outline(LEBEN.root, OC);
const WE = bigWings({ col: 0x100e16, col2: 0x1e1a2a, em: 0x3a0a6a, glow: .35, size: 1.05, metal: .3 }), WM = bigWings({ pairs: 4, col: 0xffffff, col2: 0xfff4d8, em: 0xfff0c0, glow: .28, size: .78, rough: .4, metal: 0 });
elias.spine.add(WE); WE.position.set(0, 1.5, -.7); mira.spine.add(WM); WM.position.set(0, 1.5, -.7); WE.visible = WM.visible = false;
const HALO = bigHalo(0xfff2b0, true); mira.head.add(HALO); HALO.position.set(0, 2.2, -.1); HALO.rotation.x = -.25; HALO.visible = false;
const REDEYE = []; for (const s of [-1, 1]) { const e = box(.34, .16, .06, glowM(0xff1a2a, 5), .03, elias.head, s * .32, .08, .7); e.userData.noOutline = true; e.visible = false; REDEYE.push(e); }
const GOLDEYE = []; for (const s of [-1, 1]) { const e = box(.34, .16, .06, glowM(0xffe07a, 5), .03, mira.head, s * .32, .08, .7); e.userData.noOutline = true; e.visible = false; GOLDEYE.push(e); }
const HANDG = []; for (const a of [mira.aL, mira.aR]) { const g = sphere(.7, new THREE.MeshBasicMaterial({ color: 0xffb040, transparent: true, opacity: .45, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }), a.hand, 0, -.2, 0, 12, 10); g.userData.noOutline = true; g.visible = false; HANDG.push(g); }
const BEAM = [beam(scene, 0x6aff5a), beam(scene, 0xffffff), beam(scene, 0x8a3aff)]; const SHD = shadowDisc(scene); const FEA = feathers(scene, 34); const EMB = embers(scene, 44);
const AURA = P_(new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), new THREE.MeshBasicMaterial({ color: 0xfff0c0, transparent: true, opacity: .25, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }))); AURA.userData.noOutline = true;
const DUST = Array.from({ length: 24 }, () => P_(sphere(1, mat(0xd8c8b0, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 8, 6)));
const SWEAT = Array.from({ length: 3 }, () => P_(sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const TEAR = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8)));
const CONF = Array.from({ length: 40 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xffd23f, 0xffffff, 0x3a7ad8, 0xff4a8a, 0x8ad84a][i % 5], side: THREE.DoubleSide })); scene.add(p); return P_(p); });
const SPARK = Array.from({ length: 18 }, () => P_(sphere(.12, glowM(0xffe8a0, 4), scene, 0, 0, 0, 6, 4)));

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
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.blob.visible = true; c.aR.sh.rotation.y = 0; c.aL.sh.rotation.y = 0; }
  for (const p of PROPS) { p.visible = false; p.rotation.order = 'XYZ'; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  AUSE = {}; for (const o of [TOD.root, LEBEN.root]) { o.visible = false; o.position.set(0, 0, 0); o.rotation.set(0, 0, 0); o.scale.setScalar(1); } TOD.snap(0);
  WE.visible = WM.visible = HALO.visible = false; WE.userData.spread(0); WM.userData.spread(0); WE.userData.ghost(false); WM.userData.ghost(false); AURA.visible = false; REDEYE.forEach(e => e.visible = false); GOLDEYE.forEach(e => e.visible = false); HANDG.forEach(e => e.visible = false);
  BEAM.forEach(b => b.visible = false); SHD.visible = false; FEA.forEach(f => f.visible = false); EMB.forEach(e => e.visible = false); CARS.forEach(c => c.visible = false);
  FEST.g.visible = false; FESTX.forEach(o => o.visible = false); JUNG.visible = false; MAUER.visible = false; PARK.visible = false;
  for (const l of FLL) l.intensity = 90; for (const m of FLG) m.material.emissiveIntensity = 1.2;
  for (const k in SETS) SETS[k].visible = false; FX2D.length = 0; FACES.length = 0; for (const l of LP) l.intensity = 0; LANT.intensity = 0;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.2; grade.uniforms.sharp.value = .5; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; DOF = 1; BW = 0; BLOOMMAX = .2; day(); }
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
  cam([h.x + fx * d + fz * side, h.y + .45 + dy, h.z + fz * d - fx * side], [h.x, h.y - .4, h.z], fov); }
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
function town(L, o = {}) { use('LT'); MAUER.visible = !!o.mauer; if (o.night) { night(o.fill ?? 30); renderer.toneMappingExposure = .95; } else if (o.dusk) dusk(); else day(); }
// el Gründerfest: plaza al atardecer-noche con guirnaldas encendidas, escenario y puestos
function festS(L, o = {}) { use('LT'); FEST.g.visible = true; FESTX.forEach(x => x.visible = true); dusk(); sun.intensity = 1.5; setSky([.1, .08, .32], [.5, .26, .5], [1, .5, .3]); hemi.intensity = .8; FILL.intensity = o.fill ?? 36; FILL.color.setRGB(1, .82, .6); bloom.strength = .3;
  lp(0, 0, 14, -54, 120, 0xffc070, 70); lp(1, -20, 12, -30, 70, 0xffb060, 60); lp(2, 20, 12, -30, 70, 0xffb060, 60); lp(3, 0, 12, -8, 60, 0xffd090, 60); }
function kitchen(L, o = {}) { use('KU'); for (const c of KU.CH) c.visible = !!o.chairs; inside(1.0, 40); KU.W.p.material.map = KU.W.day; }
function nursery(L) { use('NU'); NU.CR.forEach(c => c.g.visible = true); inside(1.05, 44); FILL.color.setRGB(1, .98, .95); }
function vogelS(L, o = {}) { use('VH'); PARK.visible = !!o.park; day(); }
function flurS(L, o = {}) { use('FL'); inside(.9, 36); if (o.dark) { for (const l of FLL) l.intensity = 0; for (const m of FLG) m.material.emissiveIntensity = 0; hemi.intensity = .05; FILL.intensity = 0; renderer.toneMappingExposure = .4; } }
function sportS(L) { use('SP'); day(); }
// ---------- gestos de esta pieza ----------
const PUSH = { aLx: 1.5, aRx: 1.5, aLe: .2, aRe: .2, aLz: .15, aRz: .15, lean: .32, lLx: -.4, lRx: .5, lRk: .3 };
const POINT = { aRx: 1.6, aRz: .05, aRe: .1, aLx: .3, aLz: -.2, lean: .05 };
const CATCH = { aLx: 1.3, aRx: 1.3, aLe: .9, aRe: .9, aLz: -.1, aRz: -.1, crouch: .2, lean: .1 };
// wings: elias/mira con alas desplegadas k
function eliasWings(k, T, eyes = true) { WE.visible = true; WE.userData.spread(k, T); REDEYE.forEach(e => e.visible = eyes); }
function miraWings(k, T, halo = true) { WM.visible = true; WM.userData.spread(k, T); HALO.visible = halo; HALO.userData.anim(T); HALO.scale.setScalar(Math.max(.01, k)); GOLDEYE.forEach(e => e.visible = true); }
const glowAt = (p, s, col = 0xfff0c0, op = .25) => { AURA.visible = true; AURA.position.copy(p); AURA.scale.setScalar(s); AURA.material.color.setHex(col); AURA.material.opacity = op; };
const DXL = DX; const CR = DX;
const FACES = [];
function clearFaces() {}
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
const KEY = /^(Welt|zwei|Schutzengeln|Gegenteile|Frieden|Krieg|Nutella-Pfannkuchen|Parkplatz|Vogel|Oben|Unten|achtzig|Treppe|Engel|Baby|Ausnahme|mir|Arzt|linke|rechte|Nichts|leere|Kind|allein|Elias|Mira|Freunde|Krankenhaus|Minute|drei|siebzehn|nie|schüchtern|Urlaub|plötzlich|Kevins|Kriegsengel|Spind|Licht|aus|Kevin|Boden|keiner|Zwillinge|Tribüne|unten|warm|Fragen|Gründerfest|Marktplatz|Bühne|Graf|stärksten|Leben|Tod|Junge|keine|Pech|erledige|Sense|Augen|lachen|Fünfzehn|Jahre|versucht|schwarze|Flügel|Schatten|halben|brannte|Acht|weißem|Heiligenschein|Flammen|erstarrte|Nachtiel|Dunkelheit|zurück|Lumiel|Dämon|Lichts|zuerst|Hand|zwei|Teile|Strahl|Dschungel|durch|Händen|einzigen|Drei|Sekunden|Himmel|schwarz|weiß|verschwunden|Rednerpult|Flügel|passiert|leer|Seite|besten)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
let DARK = 0, TINT = null, SHAKE = 0, BW = 0, BLOOMMAX = .2; let HUD = null; const FX2D = [];
// ---------- a: gancho, la regla, Mama, Herr Vogel, los bebés, yo, la ciudad, mis amigos (0 – 31,93 s) ----------
// helpers de esta pieza
function walk(ch, L, x, z, ry, sp = 2.4, i = 0, o = {}) { const d = sp * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, (o.y ?? 0) + Math.abs(Math.sin(L.T * 9 + i)) * .1, z + Math.cos(ry) * d, ry); actuar(ch, 0, [[0, { ...walkP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); if (o.expr !== false) cara(ch, L.T + i, { expr: o.expr || 'neutral', mouth: o.mouth }); return ch; }
function pose(ch, x, y, z, ry, L, p = {}, expr = 'neutral', ex = {}) { put(ch, x, y, z, ry); actuar(ch, 0, [[0, { headY: Math.sin(L.T * .9 + ch.seed) * .12, ...p }]], { T: L.T }); cara(ch, L.T, { expr, ...ex }); return ch; }
// bebé sentado en su cunita (cr de NU.CR)
function cribBaby(b, cr, L, o = {}) { put(b, NUX + cr.x + (o.dx ?? 0), 2.45, cr.z + (o.dz ?? 0), o.ry ?? 0); actuar(b, 0, [[0, { lLx: 1.5, lRx: 1.5, aLx: .5 + Math.sin(L.T * 4 + b.seed) * .3, aRx: .5 - Math.sin(L.T * 4 + b.seed) * .3, aLz: .3, aRz: .3, headY: Math.sin(L.T * 1.3 + b.seed) * .3 }]], { T: L.T, weight: false }); b.blob.visible = false; cara(b, L.T, { expr: o.expr || 'happy', mouth: o.mouth }); return b; }
// aparición de un angelito: escala con rebote (k desde el momento t)
const popS = (lt, t, d = .22) => { const k = clamp((lt - t) / d); return k <= 0 ? .001 : easeOut(k) + Math.sin(k * PI) * .35; };
function sparkle(c, T0, T, n = 10, col = 0xfff4c0) { EMB.burst(c, T0, T, col, n, 7); }
function noCribs(row = 0) { NU.CR.forEach((c, i) => { if (Math.floor(i / 5) === row) c.g.visible = false; }); }
function allCribs() { NU.CR.forEach(c => c.g.visible = true); }
const NP = [['sonne', 'mond'], ['feuer', 'wasser'], ['glueck', 'pech'], ['laut', 'leise'], ['oben', 'unten'], ['frieden', 'krieg'], ['sonne', 'wasser'], ['feuer', 'mond']];

// 1 «In dieser Welt wird»: GANCHO. Säuglingsstation: el médico alza a un recién nacido hacia la luz y, ¡pop, pop!, le aparecen dos angelitos opuestos
// (Sonne y Mond) a los lados con destellos; el bebé ríe y los mira. Golpe de zoom + empuje fuerte hacia el bebé.
shot(0, 'C', null, L => { nursery(L); noCribs(0); noCribs(1); const cx = NUX, cz = -12; const up = easeOut(clamp(L.lt / .4));
  const d = pose(arzt, cx, 0, cz + 3.2, 0, L, { aLx: lerp(1.4, 2.6, up), aRx: lerp(1.4, 2.6, up), aLe: .3, aRe: .3, aLz: -.12, aRz: -.12, headX: -.35 * up }, 'happy', { mouth: 'open_smile' });
  const b = BABY[2]; const h = hp(d); put(b, cx, h.y + lerp(-.6, 1.2, up), cz + 3.9, 0); actuar(b, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: .5 + Math.sin(L.T * 9) * .2, aRz: .5 - Math.sin(L.T * 9) * .2, lLx: .6 + Math.sin(L.T * 7) * .4, lRx: .6 - Math.sin(L.T * 7) * .4 }]], { T: L.T, weight: false }); b.blob.visible = false;
  cara(b, L.T, L.lt > .5 ? { eyes: 'happy', mouth: 'laugh' } : { expr: 'shock', mouth: 'o' });
  const A = engel(b, 'sonne', 'mond', L.T, { s: .9, spread: 7.5, up: .4, look: 0 }); A.forEach((a, i) => { if (a) a.scale.setScalar(.9 * popS(L.lt, .22 + i * .14)); }); sparkle(hp(b).add(V(2.4, 0, 0)), L.t0 + .36, L.T, 12);
  sparkle(hp(b).add(V(-1.4, 0, 0)), L.t0 + .42, L.T, 12);
  const p = hp(b); cm([p.x + 2, p.y - 1, p.z + 24, p.x, p.y - 2.4, p.z, 52], [p.x + .6, p.y - .6, p.z + 15, p.x, p.y - 1.8, p.z, 46], L.k, easeOut); lp(0, cx, 16, cz + 6, 60, 0xfff4d8, 40); },
  [[0, 'zoom_fast', .8], [.05, 'baby_gasp', .6], [.22, 'magic_hit', .7], [.36, 'sparkle', .7], [.7, 'kids_laugh', .4]]);
// 2 «jeder mit zwei Schutzengeln»: la plaza de Lichtenau llena de gente paseando; cada uno con sus dos angelitos revoloteando a los hombros. Grúa bajando rápido.
shot(1.10, 'W', null, L => { town(L); const P = [[-6, 4, PI * .9], [5, 8, -PI * .85], [0, -6, PI], [-12, -10, PI * .2], [11, -4, -PI * .3], [-3, 14, PI * .95], [8, 16, -PI * .6], [-10, 20, PI * .7]];
  P.forEach(([x, z, ry], i) => { const c = walk(DX[i], L, x, z, ry, 2.2, i, { expr: 'happy' }); engel(c, ...NP[i], L.T, { s: .85 }); });
  cm([2, 34, 52, 0, 2, -2, 54], [4, 10, 36, 0, 4, 0, 50], L.k, easeOut); sh(V(0, 0, 4), 40); }, [[0, 'swipe', .5], [.1, 'whoosh_magic', .5], [.4, 'city_amb', .4], [.7, 'feathers', .5]]);
// 3 «geboren.»: la fila de cunitas: un angelito aparece sobre cada bebé, uno tras otro, en ola; travelling lateral rápido
shot(2.56, 'Z', null, L => { nursery(L); NU.CR.slice(5, 10).forEach((cr, i) => { const b = cribBaby(BABY[i], cr, L); const A = engel(b, ...NP[i], L.T, { s: .55, spread: 3.6, up: 1.4, look: 0 }); A.forEach((a, j) => { if (a) a.scale.setScalar(.55 * popS(L.lt, .05 + i * .12 + j * .05)); }); });
  cm([NUX - 16, 13, 16, NUX - 10, 3.5, 2, 46], [NUX + 4, 12, 15, NUX + 8, 3.5, 2, 46], L.k); sh(V(NUX, 0, 2), 30); }, [[0, 'zoom_in', .5], [.05, 'pop', .5], [.2, 'pop', .45], [.35, 'pop', .45], [.5, 'pop', .4], [.62, 'pop', .4]]);
// 4 «Und sie sind immer Gegenteile.»: primer plano de dos angelitos de un bebé, Feuer (rojo, enfadado) y Wasser (azul, tranquilo):
// se miran, chocan de frente con las cabezas y se dan la espalda, cruzados de brazos; órbita rápida
shot(2.92, 'F', null, L => { nursery(L); const cr = NU.CR[7]; const b = cribBaby(BABY[4], cr, L, { expr: 'confused' });
  const c = V(NUX + cr.x, 6.8, cr.z); const bump = Math.sin(clamp((L.lt - .25) / .3) * PI); const turn = easeOut(clamp((L.lt - .55) / .25));
  angel('feuer', c.x - 1.6 + bump * .9, c.y, c.z, lerp(PI / 2, -PI / 2 + .4, turn), L.T, 1.5, 1); angel('wasser', c.x + 1.6 - bump * .9, c.y, c.z, lerp(-PI / 2, PI / 2 - .4, turn), L.T, 1.5, 2);
  if (L.lt > .4 && L.lt < .6) sparkle(c, L.t0 + .42, L.T, 10, 0xffe07a);
  orb(L.k, c, null, [15, -.5, .1, 42], [11, .4, .05, 40]); sh(c, 16); }, [[0, 'flash', .4], [.42, 'boing_metal', .6], [.55, 'whoosh', .4], [.75, 'clack', .4]]);
// 5 «Meine Mama zum Beispiel»: Mama en la cocina, con delantal, se gira hacia nosotros sonriendo y saluda; sus dos ángeles a los hombros. Dolly in.
shot(4.78, 'S', null, L => { kitchen(L); const m = pose(mama, KUX + 3, 0, 8, -.2, L, { aRx: 2.6 + Math.sin(L.T * 10) * .25, aRz: .3, aRe: .4, headY: .1 }, 'happy', { mouth: 'open_smile' }); engel(m, 'frieden', 'krieg', L.T);
  show(CAKES, KUX - 3, 4.4, 0, .3); onBody(m, 22, .35, .1, 42, L.k, 15, -.15); sh(V(KUX, 0, 0), 22); }, [[0, 'swipe', .4], [.1, 'steps', .4], [.3, 'pan_sizzle', .35]]);
// 6 «hat Frieden»: travelling de hombro a hombro: Frieden (blanco, paloma) sonríe y saluda con la mano
shot(5.74, 'R', null, L => { kitchen(L); const m = pose(mama, KUX + 3, 0, 8, 0, L, { headY: -.4 }, 'happy'); const A = engel(m, 'frieden', 'krieg', L.T, { look: 0 });
  const h = hp(m); cm([h.x - 5, h.y + .6, h.z + 10, h.x - 2.2, h.y - .2, h.z, 40], [h.x - 1.4, h.y + .3, h.z + 8, h.x - 1.6, h.y - .2, h.z, 40], L.k); sh(V(KUX, 0, 0), 20); }, [[0, 'whoosh', .4], [.15, 'chime', .5], [.5, 'sparkle', .4]]);
// 7 «und Krieg.»: el otro hombro: Krieg (rojo, casco, silbato) frunce el ceño y saca pecho
shot(6.68, 'C', 'punch', L => { kitchen(L); const m = pose(mama, KUX + 3, 0, 8, 0, L, { headY: .4 }, 'happy'); engel(m, 'frieden', 'krieg', L.T, { look: 0 });
  const h = hp(m); cm([h.x + 5, h.y + .8, h.z + 10, h.x + 2.2, h.y - .2, h.z, 40], [h.x + 3.2, h.y + .3, h.z + 7.4, h.x + 2.2, h.y - .2, h.z, 38], L.k); sh(V(KUX, 0, 0), 20); }, [[0, 'impact', .5], [.1, 'whistle', .5], [.3, 'growl', .3]]);
// 8 «Frieden macht ihr morgens»: Frieden en el fogón voltea una tortita con la sartén: vuela, gira y cae; vapor
shot(7.18, 'Z', null, L => { kitchen(L); const st = V(KUX - 14, 5.2, -6); const a = angel('frieden', st.x + 2.6, st.y + 2.2, st.z + .2, -.6, L.T, 1.2, 3);
  show(PAN, st.x, st.y, st.z, 0); const f = clamp((L.lt - .2) / .55); PAN.userData.cake.position.y = .25 + Math.sin(f * PI) * 3.2; PAN.userData.cake.rotation.x = f * PI * 2; PAN.rotation.z = Math.sin(clamp(L.lt / .25) * PI) * -.25;
  EMB.rise(st.clone().add(V(0, .4, 0)), L.T, 0xffffff, 2.4, 4, 10); orb(L.k, st.clone().add(V(1.2, 2, 0)), null, [17, .75, .2, 42], [12, .35, .15, 42]); sh(st, 14); }, [[0, 'zoom_in', .4], [.1, 'pan_sizzle', .6], [.2, 'whoosh_up', .5], [.75, 'plate_slide', .4]]);
// 9 «Nutella-Pfannkuchen.»: la torre de tortitas con el bote de Nutella; Mama unta con ganas y le da un bocado feliz; empuje al bote
shot(8.12, 'W', null, L => { kitchen(L); const tb = V(KUX, 4.4, 0); show(CAKES, tb.x, tb.y, tb.z, 0, 1); const m = pose(mama, KUX + 5.4, 0, 1.6, -PI / 2, L, { aRx: 1.3 + Math.sin(L.T * 8) * .2, aRe: 1.2, lean: .2, headX: .2 }, 'happy', { eyes: 'happy', mouth: L.lt > .6 ? 'grin' : 'open_smile' }); m.root.rotation.y = -PI / 2 + .3;
  engel(m, 'frieden', 'krieg', L.T, { sz: .8 }); cm([KUX + 1, 10, 19, tb.x + 3, tb.y + 1.8, tb.z + 1, 46], [KUX + 3, 9, 14.5, tb.x + 3, tb.y + 1.8, tb.z + 1, 44], L.k); sh(tb, 16); }, [[0, 'swipe', .4], [.2, 'spoon', .5], [.6, 'chew', .5]]);
// 10 «Und Krieg regelt»: el aparcamiento delante de casa: Krieg en el aire con silbato y brazo extendido dirige los coches, que entran en fila a sus plazas
shot(9.27, 'S', null, L => { vogelS(L, { park: true }); const k = clamp(L.lt / L.d);
  CARS.forEach((c, i) => { c.visible = true; const tx = VHX + 27.7 + i * 7.4 - VHX; const arr = clamp(k * 2.2 - i * .28); c.position.set(lerp(tx + 40, tx, easeOut(arr)) - (i % 2 ? 0 : 0), 0, lerp(40, 28, easeOut(clamp(arr * 1.6 - .6)))); c.rotation.y = lerp(-PI / 2, 0, easeOut(clamp(arr * 1.6 - .6))); });
  const a = angel('krieg', VHX + 46, 9.5, 36, -.5, L.T, 2.2, 4); a.userData.body.rotation.z = Math.sin(L.T * 6) * .3;
  cm([VHX + 30, 26, 74, VHX + 48, 3, 26, 50], [VHX + 40, 16, 62, VHX + 50, 3, 28, 50], L.k); sh(V(VHX + 46, 0, 30), 40); }, [[0, 'whistle', .7], [.15, 'car_pass', .5], [.45, 'brakes', .4], [.6, 'whistle', .5], [.8, 'honk', .3]]);
// 11 «den Parkplatz.»: plano medio: Krieg toca el silbato con mofletes hinchados y señala; el coche de Mama aparca perfecto delante de él
shot(10.31, 'C', 'punch', L => { vogelS(L, { park: true }); const c = CARS[0]; c.visible = true; const k = easeOut(clamp(L.lt / .6)); c.position.set(30, 0, lerp(52, 28, k));
  const a = angel('krieg', VHX + 30, 6.4, 37, .3, L.T, 2.4, 4); a.userData.body.rotation.z = -.2;
  cm([VHX + 44, 9, 62, VHX + 30, 4, 32, 46], [VHX + 38, 8, 55, VHX + 30, 4, 32, 44], L.k); sh(V(VHX + 30, 0, 32), 24); }, [[0, 'impact', .4], [.1, 'whistle', .7], [.5, 'brakes', .5], [.7, 'lock', .4]]);
// 12 «Herr Vogel von nebenan»: Herr Vogel (80) sale por su puerta verde arriba de la escalinata con la bolsa de la compra; sus ángeles Oben y Unten
shot(11.19, 'F', null, L => { vogelS(L); const v = walk(vogel, L, VHX, -1.6, 0, 1.2, 0, { y: 7.6, expr: 'happy' }); attach(BAG, v.aR.hand, [0, -1.2, .2], [0, 0, 0], .8); engel(v, 'oben', 'unten', L.T);
  cm([VHX - 9, 9, 22, VHX, 9.5, 0, 46], [VHX - 4, 10, 17, VHX, 9.5, 0, 44], L.k); sh(V(VHX, 0, 4), 24); }, [[0, 'flash', .3], [.05, 'door_open', .6], [.3, 'steps', .5], [.6, 'birds', .4]]);
// 13 «hat Oben und Unten.»: los dos ángeles: Oben apunta arriba con la flecha dorada, Unten abajo; zoom rápido de uno a otro
shot(12.35, 'Z', null, L => { vogelS(L); const v = pose(vogel, VHX, 7.6, -1, 0, L, {}, 'happy'); attach(BAG, v.aR.hand, [0, -1.2, .2], [0, 0, 0], .8); const A = engel(v, 'oben', 'unten', L.T, { s: 1.3, look: 0 });
  if (A[0]) A[0].userData.body.position.y += Math.sin(clamp(L.lt / .3) * PI) * .8; if (A[1]) A[1].userData.body.position.y -= Math.sin(clamp((L.lt - .3) / .3) * PI) * .8;
  const h = hp(v); cm([h.x - 5, h.y + 1, h.z + 15, h.x - 1.4, h.y - .4, h.z, 42], [h.x + 5, h.y - .4, h.z + 13, h.x + 1.4, h.y - .6, h.z, 42], L.k); sh(V(VHX, 0, 4), 20); }, [[0, 'zoom_in', .4], [.1, 'whoosh_up', .5], [.4, 'whoosh_down', .5]]);
// 14 «Deshalb ist er in achtzig Jahren»: Vogel pisa mal en un peldaño y se va hacia delante… Unten lo frena por el pecho y Oben tira de su cuello de vuelta
shot(13.54, 'C', 'punch', L => { vogelS(L); const k = clamp(L.lt / L.d), st = 9 - 2 * k; const y = .6 * (st + 1), z = 9.45 - .9 * st; const trip = Math.sin(clamp((L.lt - .2) / .8) * PI);
  const v = put(vogel, VHX, y, z, 0); actuar(v, 0, [[0, { lean: .2 + trip * .5, aLx: 1.2 * trip + .2, aRx: .4, aLz: .6 * trip, lLx: -.5 * trip, lRx: .6 * trip, lRk: .4 }]], { T: L.T }); cara(v, L.T, trip > .3 ? { expr: 'shock', mouth: 'o' } : { expr: 'happy' }); attach(BAG, v.aR.hand, [0, -1.2, .2], [0, 0, 0], .8);
  const h = hp(v); angel('unten', h.x, h.y - 1.6, h.z + 2.4 - trip * .3, PI, L.T, 1.2, 1); angel('oben', h.x + .3, h.y + 1.6, h.z - 1.6, 0, L.T, 1.2, 2);
  badge('gold', '80 JAHRE', W / 2, H * .2, clamp((L.lt - .5) / .3));
  cm([VHX + 12, 8, 24, VHX, 6, 4, 44], [VHX + 8, 7, 19, VHX, 6, 4, 42], L.k); sh(V(VHX, 0, 4), 22); }, [[0, 'impact', .4], [.25, 'gasp_old', .6], [.45, 'whoosh', .5], [.6, 'hug', .4], [.7, 'ding_soft', .4]]);
// 15 «nicht ein einziges Mal»: los ángeles lo llevan de los codos; baja peldaño a peldaño, tranquilo, saludando con la gorra; contador 0
shot(14.88, 'R', null, L => { vogelS(L); const k = clamp(L.lt / L.d), st = 7 - 6 * k; const y = .6 * (st + 1), z = 9.45 - .9 * st;
  const v = put(vogel, VHX, y, z, 0); actuar(v, 0, [[0, { ...walkP(L.T * .7, 0), aRx: 2.4, aRe: 1.5, aRz: .2 }]], { T: L.T }); cara(v, L.T, { expr: 'happy', eyes: 'happy', mouth: 'grin' }); attach(BAG, v.aL.hand, [0, -1.2, .2], [0, 0, 0], .8);
  engel(v, 'oben', 'unten', L.T, { spread: 1.9, up: -1.6, fw: .4, look: 0 }); badge('green', '0× GESTÜRZT', W / 2, H * .2, clamp((L.lt - .3) / .3));
  cm([VHX - 16, 4, 22, VHX, 5, 4, 46], [VHX - 9, 6, 26, VHX, 3.5, 7, 44], L.k); sh(V(VHX, 0, 4), 22); }, [[0, 'whoosh', .4], [.1, 'steps', .6], [.5, 'ding_soft', .4]]);
// 16 «die Treppe runtergefallen.»: plano picado desde lo alto de la escalinata: Vogel llega abajo de un saltito y levanta la bolsa, orgulloso
shot(16.14, 'W', null, L => { vogelS(L); const k = clamp(L.lt / .5); const v = put(vogel, VHX, lerp(.6, 0, k) + Math.sin(k * PI) * .5, lerp(9.4, 12, k), 0); actuar(v, 0, [[0, { aLx: 2.6, aLz: .4, aLe: .2, aRx: .3, crouch: Math.sin(k * PI) * .2 }]], { T: L.T }); attach(BAG, v.aL.hand, [0, -1.2, .2], [0, 0, 0], .8); cara(v, L.T, { eyes: 'happy', mouth: 'laugh' });
  engel(v, 'oben', 'unten', L.T); cm([VHX + 2, 15, 0, VHX, 3.5, 12.5, 48], [VHX + 7, 12, 3, VHX, 4, 12.5, 46], L.k); sh(V(VHX, 0, 8), 22); }, [[0, 'swipe', .4], [.35, 'land', .5], [.5, 'cheer', .3]]);
// 17 «Zwei Engel,»: sala de bebés desde arriba: todas las cunas, cada bebé con sus dos ángeles; «2» grande
shot(17.17, 'Z', null, L => { nursery(L); NU.CR.forEach((cr, i) => { if (i > 9) return; const b = cribBaby(BABY[i % 8], cr, L); engel(b, ...NP[i % 8], L.T, { s: .5, spread: 3.4, up: 1.3, look: 0 }); });
  badge('gold', '2', W / 2, H * .2, clamp(L.lt / .2), 1, 1.6); cm([NUX, 16.5, 26, NUX, 3, 0, 50], [NUX, 14, 19, NUX, 3, 0, 54], L.k); sh(V(NUX, 0, 0), 34); }, [[0, 'zoom_in', .4], [.05, 'pop', .5], [.3, 'choir', .4]]);
// 18 «jedes Baby.»: travelling a ras de cunitas: bebés distintos (piel, pelele) con sus parejas de ángeles
shot(17.96, 'S', null, L => { nursery(L); NU.CR.slice(10, 15).forEach((cr, i) => { const b = cribBaby(BABY[(i + 3) % 8], cr, L); engel(b, ...NP[(i + 2) % 8], L.T, { s: .5, spread: 3.4, up: 1.3, look: 0 }); });
  cm([NUX + 20, 6.5, 19, NUX + 14, 4.6, 10, 42], [NUX - 6, 6.5, 19, NUX - 12, 4.6, 10, 42], L.k, x => x); sh(V(NUX, 0, 10), 26); }, [[0, 'swipe', .4], [.2, 'baby_gasp', .4], [.5, 'pop', .4]]);
// 19 «Ohne Ausnahme.»: la enfermera… el médico pasa revista con su carpeta, marcando ✓ cuna por cuna; zoom lateral
shot(18.80, 'W', null, L => { nursery(L); NU.CR.slice(0, 5).forEach((cr, i) => { const b = cribBaby(BABY[i], cr, L); engel(b, ...NP[i], L.T, { s: .5, spread: 3.4, up: 1.3, look: 0 }); });
  const d = walk(arzt, L, NUX - 18 + 0, -1, PI / 2, 9, 0, { expr: 'happy', pose: { aLx: 1.2, aLe: 1.2 } }); show(BOOKS[0], 0, 0, 0); attach(BOOKS[0], d.aL.hand, [0, -.3, .4], [PI / 2, 0, 0], .8);
  for (let i = 0; i < 4; i++) badge('green', '✓', W * (.2 + i * .2), H * .25, clamp((L.lt - .1 - i * .15) / .15), 1, .8);
  orb(L.k, arzt.root.position.clone().add(V(0, 4, 0)), null, [20, .35, .18, 44], [15, -.15, .15, 44]); sh(V(NUX, 0, -4), 28); }, [[0, 'whoosh', .4], [.1, 'pencil', .5], [.3, 'pencil', .4], [.5, 'pencil', .4]]);
// 20 «Außer mir.»: una cuna sola al fondo: bebé Jonas (pelele turquesa) sin ningún ángel; mira a los lados, puchero. Golpe + viñeta
shot(19.69, 'C', 'punch', L => { nursery(L); const cr = NU.CR[14]; const b = BABY[1]; cribBaby(b, cr, L, { expr: 'sad', mouth: 'frown' }); b.head.rotation.y = Math.sin(L.T * 3) * .5;
  const n = NU.CR[13]; const nb = cribBaby(BABY[5], n, L); engel(nb, 'sonne', 'mond', L.T, { s: .5, spread: 3.4, up: 1.3, look: 0 }); grade.uniforms.vig.value = .7;
  const p = hp(b); cm([p.x + 2, p.y + 6, p.z + 9, p.x, p.y - .4, p.z, 42], [p.x + 1, p.y + 4.6, p.z + 6, p.x, p.y - .4, p.z, 38], L.k); sh(V(p.x, 0, p.z), 16); }, [[0, 'impact', .5], [.1, 'sad_tone', .6], [.4, 'sniff', .4]]);
// 21 «Als ich geboren wurde,»: el médico levanta a bebé Jonas sobre la mesa de exploración con la lámpara encendida
shot(20.38, 'S', null, L => { nursery(L); noCribs(0); noCribs(1); const cz = -12, up = easeOut(clamp(L.lt / .6)); const d = pose(arzt, NUX, 0, cz + 3, 0, L, { aLx: lerp(1.2, 1.9, up), aRx: lerp(1.2, 1.9, up), aLe: .4, aRe: .4, headX: .1 }, 'happy');
  const b = BABY[1]; const h = hp(d); put(b, NUX, h.y - 1.4 + up, cz + 4.6, 0); actuar(b, 0, [[0, { aLx: 1.6, aRx: 1.6, lLx: .5, lRx: .5 }]], { T: L.T, weight: false }); b.blob.visible = false; cara(b, L.T, { expr: 'shock', mouth: 'o' });
  lp(0, NUX - 1, 13, cz + 2, 70, 0xfff4d8, 30); onBody(d, 24, -.4, .1, 44, L.k, 17, .2, 5); sh(V(NUX, 0, cz), 20); }, [[0, 'swipe', .4], [.1, 'monitor_beep', .4], [.4, 'baby_gasp', .4]]);
// 22 «schaute der Arzt hinter meine linke Schulter.»: el médico, con gafas, se asoma por detrás del hombro izquierdo del bebé (zoom a sus ojos curiosos)
shot(21.48, 'R', null, L => { nursery(L); noCribs(0); noCribs(1); const cz = -12; const d = pose(arzt, NUX, 0, cz + 3, 0, L, { aLx: 1.9, aRx: 1.9, aLe: .4, aRe: .4, lean: .2, twist: .4, headY: .5, headZ: .2 }, 'confused');
  const b = BABY[1]; const h = hp(d); put(b, NUX + .3, h.y - .4, cz + 4.6, 0); actuar(b, 0, [[0, { aLx: 1.6, aRx: 1.6, lLx: .5, lRx: .5 }]], { T: L.T, weight: false }); b.blob.visible = false; cara(b, L.T, { expr: 'confused' });
  const p = hp(b); cm([p.x - 4, p.y + 2.4, p.z + 14, p.x - .6, p.y - .4, p.z - 1, 42], [p.x - 2, p.y + 1.8, p.z + 10.5, p.x - .6, p.y - .4, p.z - 1, 40], L.k); sh(V(NUX, 0, cz), 18);
  badge('tag', 'LINKS?', W * .3, H * .22, clamp((L.lt - .3) / .25)); }, [[0, 'whoosh', .4], [.2, 'sniff', .4], [.6, 'tick', .4]]);
// 23 «Dann hinter die rechte.»: y ahora por el derecho, con la lupa… nada
shot(23.18, 'W', null, L => { nursery(L); noCribs(0); noCribs(1); const cz = -12; const d = pose(arzt, NUX, 0, cz + 3, 0, L, { aLx: 1.9, aRx: 1.9, aLe: .4, aRe: .4, lean: .2, twist: -.4, headY: -.5, headZ: -.2 }, 'confused');
  const b = BABY[1]; const h = hp(d); put(b, NUX - .3, h.y - .4, cz + 4.6, 0); actuar(b, 0, [[0, { aLx: 1.6, aRx: 1.6, lLx: .5, lRx: .5 }]], { T: L.T, weight: false }); b.blob.visible = false; cara(b, L.T, { expr: 'confused' });
  const p = hp(b); cm([p.x + 4, p.y + 2.4, p.z + 14, p.x + .6, p.y - .4, p.z - 1, 42], [p.x + 2, p.y + 1.8, p.z + 10.5, p.x + .6, p.y - .4, p.z - 1, 40], L.k); sh(V(NUX, 0, cz), 18);
  badge('tag', 'RECHTS?', W * .7, H * .22, clamp((L.lt - .2) / .25)); }, [[0, 'swipe', .4], [.2, 'sniff', .4]]);
// 24 «Nichts.»: el médico se encoge de hombros, cara de «ni idea»; signo de interrogación enorme
shot(24.24, 'C', 'punch', L => { nursery(L); noCribs(0); noCribs(1); const cz = -12; const d = pose(arzt, NUX, 0, cz + 3, 0, L, { aLx: .4, aRx: .4, aLz: -.6, aRz: -.6, aLe: 1.6, aRe: 1.6, headZ: .15 }, 'confused', { mouth: 'grimace' });
  badge('q', '?', W / 2, H * .2, clamp(L.lt / .15), 1, 1.3); onFace(d, 9, .4, 0, 42, L.k, 6.5); sh(V(NUX, 0, cz), 18); }, [[0, 'impact', .5], [.1, 'record_scratch', .5]]);
// 25 «Und seitdem nannte mich»: Jonas (15) camina por la calle con su mochila; los vecinos (con sus ángeles) se giran y le señalan cuchicheando
shot(24.69, 'W', null, L => { town(L); const j = walk(jonas, L, 0, 18, PI, 2.2, 0, { expr: 'sad' }); j.head.rotation.x = .25;
  [[-8, 8, .9], [7, 10, -.9], [-6, -2, .6], [9, 0, -.5]].forEach(([x, z, ry], i) => { const c = pose(DX[i + 8], x, 0, z, ry, L, { ...POINT, aRx: 1.5 + Math.sin(L.T * 3 + i) * .1 }, 'sus', { mouth: i % 2 ? 'o' : 'grimace' }); c.root.rotation.y = faceTo(c.root.position, j.root.position); engel(c, ...NP[i + 2], L.T, { s: .8 }); });
  cm([3, 7, 0, 0, 4, 20, 48], [-2, 9, -6, 0, 4, 16, 48], L.k); sh(V(0, 0, 10), 30); }, [[0, 'swipe', .4], [.2, 'whisper', .6], [.6, 'steps', .4]]);
// 26 «die ganze Stadt nur noch:»: plano general: media plaza señalándole a la vez, él en el centro, encogido
shot(25.80, 'Z', null, L => { town(L); const j = pose(jonas, 0, 0, 0, 0, L, { aLx: .1, aRx: .1, headX: .3, crouch: .05 }, 'sad');
  crowdAt(L, 0, 0, 14, 9, 16, 7, { mode: 'point', expr: 'sus' }); POST.push(() => DX.forEach((c, i) => { if (c.root.visible) engel(c, ...NP[i % 8], L.T, { s: .8 }); }));
  orb(L.k, V(0, 3, 0), null, [28, .2, .5, 48], [17, -.3, .35, 46]); sh(V(0, 0, 0), 30); }, [[0, 'zoom_in', .4], [.1, 'whisper', .6], [.5, 'crowd_run', .2]]);
// 27 «das leere Kind.»: Jonas pasa por delante de la pintada «LEERES KIND» en el muro; se para, la mira y baja la cabeza. Golpe con viñeta
shot(26.84, 'C', 'punch', L => { town(L, { mauer: true }); const k = clamp(L.lt / .7); const j = put(jonas, -22 + lerp(-6, 0, easeOut(k)), 0, 44.5, PI / 2 - .3 * k); actuar(j, 0, [[0, k < 1 ? walkP(L.T, 0) : { headX: .35, aLx: .1, aRx: .1 }]], { T: L.T }); cara(j, L.T, { expr: 'sad', mouth: 'frown' });
  grade.uniforms.vig.value = .65; cm([-12, 6, 64, -22, 4.5, 41, 46], [-16, 5, 58, -22, 4.5, 41, 42], L.k); sh(V(-22, 0, 44), 22); }, [[0, 'impact', .5], [.1, 'sad_tone', .6], [.4, 'brush', .4]]);
// 28 «Aber ich war nicht allein.»: Jonas en un banco, triste; de repente Elias y Mira se dejan caer a su lado de un salto, uno a cada lado (donde irían los ángeles)
shot(28.05, 'F', null, L => { town(L); const bx = -40, bz = 6; sit(jonas, bx, 2.6, bz, PI / 2, L, { aLx: .5, aRx: .5, headX: lerp(.3, 0, clamp((L.lt - .4) / .3)) }); cara(jonas, L.T, L.lt > .5 ? { expr: 'happy', mouth: 'open_smile' } : { expr: 'sad' });
  const land = k => clamp((L.lt - k) / .35); for (const [c, s, t] of [[elias, -1, .1], [mira, 1, .25]]) { const e = land(t); if (e <= 0) { const w = walk(c, L, bx + 10, bz + s * 6, -PI / 2, 4, 0, { expr: 'happy' }); continue; } sit(c, bx, 2.6 + Math.sin(e * PI) * 1.2, bz + s * 2.6, PI / 2, L, { aLx: .4, aRx: .4 }); cara(c, L.T, { expr: 'happy', mouth: 'grin' }); }
  orb(L.k, V(bx, 4, bz), null, [17, PI / 2 + .45, .12, 44], [13, PI / 2 - .1, .1, 42]); sh(V(bx, 0, bz), 20); }, [[0, 'flash', .3], [.1, 'run_cobble', .5], [.35, 'thud', .5], [.5, 'thud', .5], [.6, 'laugh_deep', .3]]);
// 29 «Denn ich hatte Elias»: Elias le choca el puño con una sonrisa ladeada
shot(29.14, 'S', null, L => { town(L); const bx = -40, bz = 6; sit(jonas, bx, 2.6, bz, PI / 2, L, { aLx: 1.2, aLe: .6, aLz: .3 }); cara(jonas, L.T, { expr: 'happy', mouth: 'grin' });
  sit(elias, bx, 2.6, bz - 2.6, PI / 2 + .3, L, { aRx: 1.3, aRe: .3, aRz: -.3 + Math.sin(clamp(L.lt / .3) * PI) * -.1 }); cara(elias, L.T, { expr: 'smug', mouth: 'grin' });
  sit(mira, bx, 2.6, bz + 2.6, PI / 2 - .2, L, {}); cara(mira, L.T, { expr: 'happy' });
  const h = hp(elias); cm([h.x + 12, h.y + .6, h.z - 5, h.x, h.y - 1.2, h.z + 1.4, 42], [h.x + 9.5, h.y + .2, h.z - 1.5, h.x, h.y - 1.2, h.z + 1.4, 40], L.k); sh(V(bx, 0, bz), 18); }, [[0, 'swipe', .4], [.25, 'clap', .5]]);
// 30 «und Mira,»: Mira le pasa el brazo por los hombros y le guiña un ojo
shot(30.12, 'R', null, L => { town(L); const bx = -40, bz = 6; sit(jonas, bx, 2.6, bz, PI / 2 + .2, L, {}); cara(jonas, L.T, { expr: 'happy', mouth: 'grin' });
  sit(mira, bx, 2.6, bz + 2.4, PI / 2 - .3, L, { aLx: 1.8, aLz: .9, aLe: .4 }); cara(mira, L.T, { expr: 'happy', eyes: L.lt > .2 && L.lt < .45 ? 'wink' : 'happy', mouth: 'grin' }); sit(elias, bx, 2.6, bz - 2.6, PI / 2, L, {}); cara(elias, L.T, { expr: 'smug' });
  const h = hp(mira); cm([h.x + 12, h.y + .6, h.z + 5, h.x, h.y - 1.2, h.z - 1.4, 42], [h.x + 9.5, h.y + .2, h.z + 1.5, h.x, h.y - 1.2, h.z - 1.4, 40], L.k); sh(V(bx, 0, bz), 18); }, [[0, 'whoosh', .4], [.2, 'hug', .5], [.35, 'ding_soft', .3]]);
// 31 «meine besten Freunde.»: los tres caminan juntos hacia cámara por la plaza, riendo; Elias con las manos en los bolsillos, Mira dando saltitos
shot(30.70, 'C', null, L => { town(L); walk(jonas, L, 0, -6, 0, 2.4, 0, { expr: 'happy', mouth: 'laugh' }); walk(elias, L, -4, -6.6, 0, 2.4, 1.3, { expr: 'smug', pose: { aLx: -.2, aRx: -.2, aLe: .4, aRe: .4 } }); walk(mira, L, 4, -6.4, 0, 2.4, 2.1, { expr: 'happy', mouth: 'laugh', y: Math.abs(Math.sin(L.T * 6)) * .4 });
  orb(L.k, V(0, 4, -6 + L.lt * 2.4), null, [15, 0, .12, 46], [21, .35, .18, 46]); sh(V(0, 0, -4), 22); }, [[0, 'impact', .3], [.1, 'steps', .5], [.4, 'kids_laugh', .4]]);
// ---------- b: mismo minuto, nadie vio sus ángeles, el pasillo, la tribuna, manos calientes (31,93 – 70,28 s) ----------
// Flur: pasillo x ∈ ±11 (taquillas a x = ±9,8, frente a ±8,3), techo 16, suelo z ∈ [20, -80]. Tribuna: escalón r (0–3) en x = SPX - 28 - 3r, altura 1,6 + 1,6r.
function carry(j, m, L, pose = {}) { m.root.updateMatrixWorld(true); const a = wpos(m.aL.hand), b = wpos(m.aR.hand), c = a.add(b).multiplyScalar(.5); const ry = m.root.rotation.y, rx = Math.cos(ry), rz = -Math.sin(ry);
  put(j, c.x - rx * 2.6 + Math.sin(m.root.rotation.y) * .9, c.y - 1.0, c.z - rz * 2.6 + Math.cos(m.root.rotation.y) * .6, ry); j.root.rotation.z = -1.45; actuar(j, 0, [[0, { lLx: .9, lRx: .9, lLk: 1.1, lRk: 1.1, aLx: .6, aRx: .3, ...pose }]], { T: L.T, weight: false }); j.blob.visible = false; return j; }
const FX = FLX, TRX = r => SPX - 28 - 3 * r, TRY = r => 1.6 + 1.6 * r;
function kidsFlur(L, list, z0, o = {}) { list.forEach((c, i) => { const s = i % 2 ? 1 : -1, z = z0 - Math.floor(i / 2) * 6 - (i % 3); pose(c, FX + s * (3.6 + (i % 3) * .4), 0, z, s > 0 ? -PI / 2 + .5 : PI / 2 - .5, L, o.pose || { aLx: .2, aRx: .2, headY: Math.sin(L.T + i) * .3 }, o.expr || 'neutral', o.ex || {}); if (o.angels !== false) engel(c, ...NP[(i + 3) % 8], L.T, { s: .7 }); }); }

// 32 «Geboren am selben Tag»: tres cunitas juntas; tres bebés (Jonas turquesa, Elias morado, Mira naranja) sin ángeles, entre bebés que sí los tienen
shot(31.93, 'W', null, L => { nursery(L); const T3 = [NU.CR[6], NU.CR[7], NU.CR[8]]; [BABY[1], BABY[4], BABY[5]].forEach((b, i) => cribBaby(b, T3[i], L, { expr: 'happy', mouth: i === 1 ? 'smirk' : 'open_smile' }));
  for (const [i, j] of [[5, 0], [9, 2]]) { const b = cribBaby(BABY[[0, 2][j / 2]], NU.CR[i], L); engel(b, ...NP[j], L.T, { s: .55, spread: 3.4, up: 1.3, look: 0 }); }
  const c = V(NUX, 4, 2); orb(L.k, c, null, [26, -.35, .5, 46], [19, .2, .42, 44]); sh(c, 26); }, [[0, 'swipe', .4], [.2, 'baby_gasp', .4], [.6, 'lullaby', .3]]);
// 33 «wie ich.»: los tres bebés se giran a la vez y se miran entre ellos, sonriendo
shot(33.09, 'C', 'punch', L => { nursery(L); const T3 = [NU.CR[6], NU.CR[7], NU.CR[8]]; [BABY[1], BABY[4], BABY[5]].forEach((b, i) => { cribBaby(b, T3[i], L, { expr: 'happy', mouth: 'laugh', ry: (1 - i) * .5 }); });
  const c = V(NUX, 3.4, 2); cm([c.x - 3, c.y + 8, c.z + 13, c.x, c.y, c.z, 44], [c.x + 1, c.y + 6.4, c.z + 10, c.x, c.y, c.z, 42], L.k); sh(c, 18); }, [[0, 'impact', .4], [.1, 'kids_laugh', .5]]);
// 34 «Im selben Krankenhaus.»: grúa hacia el rótulo SÄUGLINGSSTATION con toda la sala debajo
shot(33.49, 'Z', null, L => { nursery(L); NU.CR.forEach((cr, i) => { const b = cribBaby(BABY[i % 8], cr, L); if (![6, 7, 8].includes(i)) engel(b, ...NP[i % 8], L.T, { s: .5, spread: 3.4, up: 1.3, look: 0 }); });
  cm([NUX - 4, 6, 22, NUX, 6, 0, 52], [NUX - 1, 13, 14, NUX, 13.5, -17, 50], L.k); sh(V(NUX, 0, 0), 30); }, [[0, 'zoom_in', .4], [.1, 'whoosh_up', .5], [.5, 'monitor_beep', .4]]);
// 35 «Sogar in derselben Minute:»: las tres tarjetas de las cunas en fila, todas con «3:17»; travelling
shot(34.70, 'S', null, L => { nursery(L); const T3 = [NU.CR[6], NU.CR[7], NU.CR[8]]; [BABY[1], BABY[4], BABY[5]].forEach((b, i) => cribBaby(b, T3[i], L, { expr: 'happy' }));
  T3.forEach((cr, i) => badge3('gold', '3:17', V(NUX + cr.x, 5.2, cr.z + 1.3), clamp((L.lt - .1 - i * .18) / .2), .7));
  cm([NUX - 6, 9, 18, NUX - 2, 4, 2, 46], [NUX + 4, 9, 18, NUX + 4, 4, 2, 46], L.k, x => x); sh(V(NUX, 0, 2), 22); }, [[0, 'swipe', .4], [.1, 'tick', .5], [.3, 'tick', .5], [.5, 'tick', .5]]);
// 36 «drei Uhr siebzehn.»: el reloj grande de la sala: la aguja salta a las 3:17; golpe de zoom
shot(35.94, 'C', 'punch', L => { nursery(L); const m = L.lt < .3 ? 16 : 17; NU.CLK.userData.set(3, m); const c = V(NUX + 16, 12, -17.4);
  badge('gold', '3:17', W / 2, H * .22, clamp((L.lt - .3) / .2), 1, 1.3); cm([c.x - 3, c.y - 1.5, c.z + 15, c.x, c.y, c.z, 40], [c.x - 1, c.y - .6, c.z + 9.5, c.x, c.y, c.z, 38], L.k); }, [[0, 'impact', .5], [.3, 'clock_tick', .7], [.35, 'ding_reveal', .5]]);
// 37 «Und das Komische daran:»: el pasillo del instituto: Elias y Mira (15) junto a sus taquillas; alrededor, todos los alumnos con sus ángeles… ellos dos sin ninguno
shot(37.24, 'R', null, L => { flurS(L); kidsFlur(L, DX.slice(0, 6), 2); pose(elias, FX - 2.2, 0, -8, .2, L, { aLx: -.2, aRx: -.2, aLe: .4, aRe: .4 }, 'smug'); pose(mira, FX + 2.2, 0, -8, -.2, L, { aRx: .9, aRe: 1.4 }, 'happy');
  show(BOOKS[1], 0, 0, 0); attach(BOOKS[1], mira.aR.hand, [0, -.2, .4], [PI / 2, 0, 0], .9);
  orb(L.k, V(FX, 4, -8), null, [22, .3, .12, 46], [15, -.15, .1, 44]); sh(V(FX, 0, -6), 26); }, [[0, 'whirl', .4], [.1, 'classroom', .5], [.5, 'locker', .4]]);
// 38 «Ihre Engel hat auch nie jemand gesehen.»: dos compañeras con lupa miran detrás de los hombros de Elias y Mira, buscando… nada
shot(38.34, 'W', null, L => { flurS(L); pose(elias, FX - 2.4, 0, -8, 0, L, { aLx: -.2, aRx: -.2, aLe: .4, aRe: .4 }, 'smug'); pose(mira, FX + 2.4, 0, -8, 0, L, {}, 'happy');
  const a = pose(DX[6], FX - 5.4, 0, -10.6, .8, L, { aRx: 1.4, aRe: .6, lean: .3, twist: .3, headX: .3 }, 'confused'); const b = pose(DX[7], FX + 5.4, 0, -10.6, -.8, L, { aLx: 1.4, aLe: .6, lean: .3, twist: -.3, headX: .3 }, 'confused');
  engel(a, 'laut', 'leise', L.T, { s: .7 }); engel(b, 'glueck', 'pech', L.T, { s: .7 }); badge('q', '?', W * .3, H * .22, clamp((L.lt - .4) / .2)); badge('q', '?', W * .7, H * .22, clamp((L.lt - .6) / .2));
  orb(L.k, V(FX, 4.5, -9), null, [16, -.25, .14, 44], [12, .2, .12, 42]); sh(V(FX, 0, -8), 20); }, [[0, 'swipe', .4], [.2, 'sniff', .4], [.6, 'whisper', .4]]);
// 39 «Elias meinte,»: Elias apoyado en la taquilla, se encoge de hombros con media sonrisa
shot(40.27, 'Z', null, L => { flurS(L); const e = pose(elias, FX - 6.6, 0, -12, PI / 2 - .2, L, { lean: -.15, aLx: .3, aRx: .3, aLz: -.5, aRz: -.5, aLe: 1.5, aRe: 1.5, headZ: .15 }, 'smug', { mouth: 'smirk' }); talk(e, L.T, 40.27, 42.1, 'smug');
  onBody(e, 15, .25, .1, 42, L.k, 10, -.1); sh(V(FX, 0, -12), 18); }, [[0, 'zoom_in', .4], [.2, 'cloth', .4]]);
// 40 «seine sind schüchtern.»: dos ángeles diminutos (en su imaginación) se tapan la cara detrás de su taquilla entreabierta; bocadillo «schüchtern»
shot(41.13, 'C', null, L => { flurS(L); const e = pose(elias, FX - 6.6, 0, -12, PI / 2 - .2, L, { lean: -.15, aRx: 1.0, aRe: 1.2, aRz: .3 }, 'smug', { mouth: 'grin' });
  bubble(e, 'schüchtern…', clamp((L.lt - .1) / .25), 2.2); onFace(e, 7.5, .2, 1.2, 42, L.k, 5.8); sh(V(FX, 0, -12), 18); }, [[0, 'impact', .3], [.1, 'pop', .5], [.4, 'whistle_inno', .4]]);
// 41 «Mira meinte,»: Mira, junto a su taquilla con fotos de playa, gira la cabeza y guiña un ojo
shot(42.12, 'F', null, L => { flurS(L); const m = pose(mira, FX + 6.6, 0, -16, -PI / 2 + .2, L, { aLx: .9, aLe: 1.4, aLz: .2, headZ: -.1 }, 'happy', { eyes: L.lt > .3 ? 'wink' : 'happy', mouth: 'grin' }); talk(m, L.T, 42.12, 43.9, 'happy');
  onBody(m, 15, -.25, .1, 42, L.k, 10, .1); sh(V(FX, 0, -16), 18); }, [[0, 'flash', .3], [.3, 'ding_soft', .4]]);
// 42 «ihre sind im Urlaub.»: bocadillo «im Urlaub 🌴»; Mira se pone unas gafas de sol imaginarias y sonríe; zoom
shot(42.92, 'S', null, L => { flurS(L); const m = pose(mira, FX + 6.6, 0, -16, -PI / 2 + .2, L, { aLx: 2.2, aRx: 2.2, aLe: 1.9, aRe: 1.9, aLz: .3, aRz: .3 }, 'happy', { eyes: 'happy', mouth: 'grin' });
  bubble(m, 'im Urlaub ☀', clamp((L.lt - .1) / .25), 2.2); onFace(m, 7.5, .2, -1.2, 42, L.k, 5.8); sh(V(FX, 0, -16), 18); }, [[0, 'swipe', .4], [.1, 'pop', .5], [.4, 'birds', .3]]);
// 43 «Aber jedes Mal,»: el pasillo: Jonas acorralado contra las taquillas por tres matones (con sus ángeles de brazos cruzados)
shot(43.96, 'Z', null, L => { flurS(L); const j = pose(jonas, FX - 7.2, 0, -20, PI / 2, L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, lean: -.15, crouch: .1 }, 'worried'); sweat(j, L.T, 1);
  [[-2.4, -17.6], [-1.2, -20.4], [-2.8, -23]].forEach(([x, z], i) => { const c = pose([kevin, ZW[0], ZW[1]][i], FX + x, 0, z, 0, L, { aRx: .9 + Math.sin(L.T * 6 + i) * .4, aRe: .5, lean: .15 }, 'angry', { mouth: 'grin' }); c.root.rotation.y = faceTo(c.root.position, j.root.position); engel(c, ...[['frieden', 'krieg'], ['feuer', 'wasser'], ['feuer', 'wasser']][i], L.T, { s: .7 }); });
  cm([FX + 5, 6.5, -34, FX - 5, 3.6, -20, 46], [FX + 4, 6, -30, FX - 5, 3.6, -20, 44], L.k); sh(V(FX, 0, -20), 20); }, [[0, 'zoom_in', .4], [.1, 'laugh_deep', .5], [.6, 'locker', .4]]);
// 44 «wenn mich jemand fertigmachte,»: le tiran los libros de las manos y caen al suelo; Jonas se encoge
shot(44.82, 'W', null, L => { flurS(L); const j = pose(jonas, FX - 7.2, 0, -20, PI / 2, L, { aLx: .4, aRx: .4, lean: -.1, crouch: .2, headX: .3 }, 'sad'); const k = pose(kevin, FX - 2.4, 0, -20, -PI / 2, L, { aRx: 1.2 + Math.sin(clamp(L.lt / .3) * PI) * .6, aRe: .2, lean: .2 }, 'angry', { mouth: 'grin' }); engel(k, 'frieden', 'krieg', L.T, { s: .7 });
  BOOKS.forEach((b, i) => { const f = clamp((L.lt - .2 - i * .06) / .5); show(b, FX - 6.4 + i * .5, lerp(4, .2, f * f) , -19.4 + i * .3, i, 1); b.rotation.set(f * (2 + i), i, f * 3); });
  cm([FX + 2, 3.4, -10, FX - 5, 3, -20, 44], [FX + 1, 4.4, -13, FX - 5, 3, -20, 42], L.k); sh(V(FX, 0, -20), 18); }, [[0, 'swipe', .4], [.25, 'paper', .5], [.5, 'thud', .5], [.6, 'laugh_deep', .4]]);
// 45 «waren die beiden plötzlich da.»: al fondo del pasillo aparecen Elias y Mira, caminando decididos hacia cámara; un viento les mueve el pelo
shot(46.18, 'F', null, L => { flurS(L); walk(elias, L, FX - 2.6, -54, 0, 4.2, 0, { expr: 'determined' }); walk(mira, L, FX + 2.6, -54.6, 0, 4.2, 1.4, { expr: 'determined' });
  cm([FX, 3, -32, FX, 4, -54, 44], [FX, 3.4, -38, FX, 4, -52, 40], L.k); sh(V(FX, 0, -48), 22); }, [[0, 'flash', .4], [.05, 'wind', .5], [.2, 'steps', .6], [.6, 'braam_short', .4]]);
// 46 «Als Kevins Kriegsengel»: Kevin, enorme, con su ángel Krieg encima del hombro; el ángel se crece (escala) y se arremanga
shot(47.78, 'C', 'punch', L => { flurS(L); const k = pose(kevin, FX - 1, 0, -20, PI - .35, L, { aLx: .3, aRx: .3, aLz: -.4, aRz: -.4, aLe: 1.6, aRe: 1.6, lean: .05 }, 'angry', { mouth: 'grin' });
  const A = engel(k, 'frieden', 'krieg', L.T, { s: 1, up: 1.4, spread: 3 }); if (A[1]) A[1].scale.setScalar(lerp(1, 1.5, easeOut(clamp(L.lt / .6))));
  cm([FX + 3, 6.5, -36, FX - 1, 5.6, -20, 46], [FX + 1, 6.2, -31, FX - 1, 5.8, -20, 44], L.k); sh(V(FX, 0, -20), 18); }, [[0, 'impact', .5], [.1, 'growl', .5], [.4, 'whoosh_up', .4]]);
// 47 «mich gegen den Spind knallte,»: el Kriegsengel empuja a Jonas con las dos manos y ¡BAM! contra la taquilla, que se abolla; sacudida
shot(48.90, 'C', null, L => { flurS(L); const hit = clamp((L.lt - .25) / .12); const j = put(jonas, FX - lerp(4.5, 7.1, hit), 0, -20, PI / 2); actuar(j, 0, [[0, { aLx: .9 * hit, aRx: .9 * hit, aLz: .6, aRz: .6, lean: -.4 * hit, headX: -.3 * hit }]], { T: L.T }); cara(j, L.T, hit > .5 ? { expr: 'shock', eyes: 'squint', mouth: 'grimace_wide' } : { expr: 'worried' });
  const a = angel('krieg', FX - lerp(2, 4.6, hit), 6.2, -20, -PI / 2, L.T, 1.8, 4); a.userData.body.rotation.z = -.3 * hit; if (hit > 0 && hit < 1) SHAKE = 1; if (L.lt > .25 && L.lt < .55) SHAKE = 1 - (L.lt - .25) / .3;
  dust(V(FX - 8, 3, -20), L.t0 + .3, L.T, 8, .6); cm([FX + 3, 5, -12, FX - 6, 4, -20, 44], [FX + 2, 4.6, -14, FX - 6.4, 4, -20, 42], L.k); sh(V(FX, 0, -20), 18); }, [[0, 'whoosh', .4], [.25, 'metal_hit', .8], [.3, 'locker', .6], [.35, 'gasp', .5]]);
// 48 «bog Elias um die Ecke.»: contrapicado: Elias dobla la esquina del pasillo con las manos en los bolsillos, tranquilísimo; la luz del techo parpadea una vez
shot(50.38, 'R', null, L => { flurS(L); const e = walk(elias, L, FX - 3, -30, 0, 2.6, 0, { expr: 'smug', pose: { aLx: -.25, aRx: -.25, aLe: .5, aRe: .5, aLz: .05, aRz: .05 } });
  if (Math.abs(L.lt - .5) < .06) { renderer.toneMappingExposure *= .4; }
  const p = e.root.position; cm([p.x + 3, 1.2, p.z + 9, p.x, 5.4, p.z, 46], [p.x + 1.4, 1.6, p.z + 6.6, p.x, 5.6, p.z, 44], L.k); sh(p, 18); }, [[0, 'whirl', .4], [.1, 'steps', .6], [.5, 'switch', .4]]);
// 49 «Und genau in dem Moment»: primer plano de Elias: levanta la vista hacia Kevin y sus ojos brillan rojos un instante
shot(51.36, 'Z', 'slow', L => { flurS(L); const e = pose(elias, FX - 3, 0, -24, .1, L, { aLx: -.25, aRx: -.25, aLe: .5, aRe: .5, headX: -.08 }, 'smug', { mouth: 'smirk' }); REDEYE.forEach(r => r.visible = L.lt > .9);
  onFace(e, 7.5, .1, .4, 40, L.k, 4.6); sh(V(FX, 0, -24), 16); }, [[0, 'zoom_in', .3], [.9, 'creepy_ting', .6]]);
// 50 «ging im ganzen Flur»: los fluorescentes del pasillo se apagan uno tras otro hacia cámara, CLAC CLAC CLAC
shot(52.87, 'W', null, L => { flurS(L); const z0 = -70 + L.lt * 60; for (const l of FLL) { if (l.position.z < z0 - 0) l.intensity = 0; } for (const m of FLG) if (m.position.z < z0) m.material.emissiveIntensity = 0; hemi.intensity = lerp(.9, .2, L.k); FILL.intensity = lerp(36, 6, L.k);
  pose(kevin, FX - 1, 0, -20, -PI / 2 + .3, L, { aRx: .8, headY: -.6 }, 'confused'); pose(jonas, FX - 7.1, 0, -20, PI / 2, L, { crouch: .2 }, 'worried'); pose(elias, FX - 3, 0, -26, .1, L, {}, 'smug');
  cm([FX + 4, 12, 6, FX, 6, -40, 48], [FX + 2, 10, 0, FX, 6, -40, 46], L.k); sh(V(FX, 0, -20), 20); }, [[0, 'switch', .6], [.2, 'switch', .6], [.4, 'switch', .6], [.6, 'switch', .6], [.75, 'hum_low', .4]]);
// 51 «das Licht aus.»: negro total; sólo dos ojos rojos que brillan en la oscuridad y un golpe sordo
shot(54.05, 'B', null, L => { flurS(L, { dark: true }); const e = pose(elias, FX - 3, 0, -22, 0, L, {}, 'angry'); REDEYE.forEach(r => r.visible = true); DARK = .55;
  onFace(e, 9, 0, 0, 40, L.k, 7); }, [[0, 'switch', .6], [.3, 'whoosh', .4], [.5, 'thud', .7], [.62, 'impact', .6], [.7, 'metal_hit', .5]]);
// 52 «Als es wieder anging,»: las luces parpadean y vuelven: el pasillo vacío… Elias ya está apoyado en otra taquilla, silbando
shot(54.98, 'F', null, L => { flurS(L); const fl = L.lt < .4 && Math.sin(L.lt * 70) > 0; if (fl) { for (const l of FLL) l.intensity = 0; renderer.toneMappingExposure = .45; }
  pose(elias, FX + 3.4, 0, -16, -.4, L, { lean: -.1, aLx: -.2, aRx: -.2, aLe: .5, aRe: .5 }, 'smug', { mouth: 'o' }); pose(jonas, FX - 3.4, 0, -20, .4, L, { aLx: .5, aRx: .5, headY: .5 }, 'shock', { mouth: 'o' });
  cm([FX - 1, 6, 2, FX, 4, -18, 46], [FX + 1, 5.4, -3, FX, 4, -18, 44], L.k); sh(V(FX, 0, -18), 20); }, [[0, 'flash', .4], [.05, 'hum_glow', .5], [.2, 'switch', .5], [.6, 'whistle_inno', .5]]);
// 53 «lag Kevin am Boden.»: picado: Kevin tumbado boca arriba, mareado, con estrellitas; su Kriegsengel tirado a su lado, con el casco torcido
shot(56.13, 'Z', null, L => { flurS(L); const k = put(kevin, FX - 1, .5, -20, 0); k.root.rotation.x = -PI / 2; actuar(k, 0, [[0, { aLz: .9, aRz: .9, lLx: .2, lRx: -.2 }]], { T: L.T, weight: false }); cara(k, L.T, { eyes: 'squint', mouth: 'wavy' }); k.blob.visible = false;
  const a = angel('krieg', FX + 3, .9, -18.5, 0, L.T, 1.3, 2, 0); a.rotation.z = PI / 2; const h = hp(k);
  FX2D.push(c => { const [x, y] = proj(h.clone().add(V(0, 1.6, 0))); for (let i = 0; i < 5; i++) { const a_ = L.T * 3 + i * 1.26; c.save(); c.translate(x + Math.cos(a_) * 120, y + Math.sin(a_) * 40); c.font = `700 ${60 * U}px ${FONT}`; c.fillStyle = '#ffe07a'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 8; c.textAlign = 'center'; c.strokeText('★', 0, 0); c.fillText('★', 0, 0); c.restore(); } });
  cm([FX + 1, 15, -9, FX - 1, 0, -20, 46], [FX + .5, 12, -13, FX - 1, 0, -20, 44], L.k); sh(V(FX, 0, -20), 16); }, [[0, 'zoom_in', .4], [.1, 'shiver', .3], [.3, 'boing_metal', .4]]);
// 54 «Und keiner hatte gesehen,»: los alumnos asoman por todo el pasillo mirando a todos lados, desconcertados (sus ángeles también)
shot(57.23, 'R', null, L => { flurS(L); kidsFlur(L, DX.slice(0, 6), -8, { pose: { aLx: .5, aRx: .5, aLe: 1.4, aRe: 1.4, aLz: -.4, aRz: -.4, headY: Math.sin(L.T * 4) * .5 }, expr: 'confused' }); pose(jonas, FX - 7.1, 0, -20, PI / 2 + .4, L, { headY: Math.sin(L.T * 3) * .5 }, 'confused');
  cm([FX - 3, 6, 4, FX, 4, -14, 50], [FX + 3, 5.5, 1, FX, 4, -14, 50], L.k); sh(V(FX, 0, -12), 26); }, [[0, 'whirl', .4], [.2, 'whisper', .5], [.6, 'classroom', .4]]);
// 55 «was passiert war.»: Elias, de espaldas a la escena, se aleja silbando con las manos detrás de la cabeza; Mira le da un codazo cómplice
shot(58.25, 'S', null, L => { flurS(L); walk(elias, L, FX - 2, -26, PI, 2, 0, { expr: 'smug', pose: { aLx: 2.8, aRx: 2.8, aLe: 2, aRe: 2, aLz: .3, aRz: .3 } }); elias.root.rotation.y = PI; walk(mira, L, FX + 2, -26.4, PI, 2, 1, { expr: 'happy', mouth: 'grin' });
  orb(L.k, V(FX, 4, -26 - L.lt * 2), null, [-20, .4, .12, 46], [-15, -.1, .1, 44]); sh(V(FX, 0, -30), 18); }, [[0, 'swipe', .4], [.1, 'whistle_inno', .6], [.5, 'steps', .4]]);
// 56 «Als mich die Zwillinge Lukas und Leon»: la tribuna del campo: los gemelos (sudaderas naranjas iguales, LU/LE) arriba del todo, sonriendo con malicia, uno a cada lado de Jonas
shot(59.29, 'W', null, L => { sportS(L); const x = TRX(3), y = TRY(3), z = 0; const j = pose(jonas, x, y, z, PI / 2, L, { aLx: .3, aRx: .3, headY: Math.sin(L.T * 3) * .3 }, 'worried'); sweat(j, L.T, 1);
  ZW.forEach((c, i) => { const s = i ? 1 : -1; pose(c, x - .6, y, z + s * 3.2, PI / 2 - s * .5, L, { aLx: .6, aRx: .6, aLe: 1.4, aRe: 1.4, aLz: -.4, aRz: -.4 }, 'smug', { mouth: 'grin' }); engel(c, 'feuer', 'wasser', L.T, { s: .7 }); });
  for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) { const c = DX[r * 2 + k + 10]; sit(c, TRX(r) + .2, TRY(r) + .7, -10 + k * 18 + r * 2, PI / 2, L, { aLx: .4, aRx: .4 }); cara(c, L.T, { expr: 'happy' }); }
  orb(L.k, V(x, y + 4, z), null, [24, PI / 2 + .45, .1, 46], [17, PI / 2 + .1, .05, 44]); sh(V(x, 0, z), 26); }, [[0, 'swipe', .4], [.1, 'crowd_run', .2], [.4, 'laugh_deep', .5]]);
// 57 «von der obersten Reihe der Tribüne»: plano desde abajo del campo: la tribuna altísima, Jonas en la última fila entre los gemelos; «REIHE 4»
shot(60.75, 'Z', null, L => { sportS(L); const x = TRX(3), y = TRY(3), z = 0; pose(jonas, x, y, z, PI / 2, L, { aLx: .3, aRx: .3 }, 'worried'); ZW.forEach((c, i) => { const s = i ? 1 : -1; pose(c, x - .6, y, z + s * 3.2, PI / 2 - s * .4, L, { aLx: .9, aRx: .9, aLe: .3, aRe: .3 }, 'smug', { mouth: 'grin' }); });
  badge('red', 'REIHE 4', W / 2, H * .18, clamp((L.lt - .2) / .2), 1, .8); cm([SPX - 4, 1.5, 6, x, y + 3, z, 50], [SPX - 10, 1.4, 3, x, y + 4, z, 46], L.k); sh(V(x, 0, z), 26); }, [[0, 'zoom_in', .4], [.2, 'wind', .4]]);
// 58 «schubsten,»: los gemelos empujan a Jonas a la vez por la espalda; sale despedido hacia delante, brazos al aire
shot(62.19, 'C', 'punch', L => { sportS(L); const x = TRX(3), y = TRY(3), z = 0; const pu = clamp(L.lt / .2); const f = clamp((L.lt - .15) / .5);
  const j = put(jonas, x + f * 6, y + f * 1.5 - f * f * 3, z, PI / 2); j.root.rotation.z = -f * .6; actuar(j, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .6, aRz: .6, lLx: -.6, lRx: .5 }]], { T: L.T }); cara(j, L.T, { expr: 'shock', mouth: 'scream' });
  ZW.forEach((c, i) => { const s = i ? 1 : -1; pose(c, x - .4 + pu * .8, y, z + s * 2.2, PI / 2, L, { ...PUSH, aLx: 1.5 * pu, aRx: 1.5 * pu }, 'angry', { mouth: 'grin' }); });
  orb(L.k, V(x + 2, y + 3, z), null, [20, PI / 2 + .9, .2, 46], [16, PI / 2 + .6, .1, 44]); sh(V(x, 0, z), 22); }, [[0, 'impact', .5], [.05, 'kick', .5], [.15, 'scream_girl', .3], [.2, 'whoosh_down', .6]]);
// 59 «kam ich nie unten an.»: cámara lenta: Jonas cayendo de espaldas por el aire, la mochila abierta soltando hojas; el suelo se acerca
shot(62.85, 'R', 'slow', L => { sportS(L); const k = L.k; const p = V(TRX(1) + 2 + k * 4, lerp(8, 3.2, k), 0); const j = put(jonas, p.x, p.y, p.z, PI / 2); j.root.rotation.z = -1.2 - k * .4; actuar(j, 0, [[0, { aLx: 2.8 + Math.sin(L.T * 5) * .2, aRx: 2.6, aLz: .8, aRz: .8, lLx: .8, lRx: -.4, lRk: .6 }]], { T: L.T }); cara(j, L.T, { expr: 'shock', mouth: 'scream', eyes: 'closed' }); j.blob.visible = false;
  for (let i = 0; i < 4; i++) { const b = show(BOOKS[i], p.x - 2 + i * 1.2, p.y + 2 + i * .6 - k, p.z - 2 + i, 0); b.rotation.set(L.T * (1 + i), i, L.T * 2); }
  orbit(p, lerp(26, 20, k), PI / 2 + .5, .05, 46); sh(p, 20); }, [[0, 'whirl', .4], [.1, 'wind', .6], [.3, 'heartbeat', .5]]);
// 60 «Denn Mira fing mich auf.»: ¡Mira aparece debajo y lo coge en brazos sin esfuerzo! Polvo, sus pies apenas se hunden
shot(64.10, 'F', null, L => { sportS(L); const mx = TRX(0) + 6, mz = 0; const k = clamp(L.lt / .18); const m = pose(mira, mx, 0, mz, PI / 2 - .3, L, { ...CATCH, crouch: .25 - k * .1 }, 'happy', { mouth: 'grin' });
  const j = carry(jonas, m, L); j.root.position.y += lerp(5, 0, easeOut(k)); cara(j, L.T, { expr: 'shock', mouth: 'o' });
  dust(V(mx, 0, mz), L.t0 + .15, L.T, 10, .8); onBody(m, 26, .25, .3, 44, L.k, 19, -.1); sh(V(mx, 0, mz), 18); }, [[0, 'flash', .4], [.15, 'land', .7], [.2, 'hug', .4], [.4, 'gasp', .4]]);
// 61 «Ihre Hände waren warm.»: primer plano de las manos de Mira bajo la espalda de Jonas: brillan naranja
shot(65.36, 'Z', null, L => { sportS(L); const mx = TRX(0) + 6, mz = 0; const m = pose(mira, mx, 0, mz, PI / 2 - .3, L, { ...CATCH, crouch: .15 }, 'happy'); const j = carry(jonas, m, L, { aLx: 1.6, lLx: .8, lRx: .8, lLk: .9, lRk: .9 }); cara(j, L.T, { expr: 'confused' });
  HANDG.forEach(g => { g.visible = true; g.scale.setScalar(.8 + Math.sin(L.T * 9) * .15 + L.k * .4); }); EMB.rise(wpos(mira.aR.hand), L.T, 0xffa030, 2, 4, 14);
  const p = wpos(mira.aR.hand); cm([p.x + 5, p.y + 2, p.z + 6, p.x, p.y, p.z, 42], [p.x + 3.4, p.y + 1.4, p.z + 4.4, p.x, p.y, p.z, 40], L.k); sh(p, 12); }, [[0, 'zoom_in', .4], [.1, 'hum_glow', .6], [.4, 'fire_crackle', .3]]);
// 62 «Viel zu warm.»: a Jonas le sale vapor de la chaqueta, suda; mira a Mira; los ojos de ella relampaguean dorados un instante
shot(66.62, 'C', 'punch', L => { sportS(L); const mx = TRX(0) + 6, mz = 0; const m = pose(mira, mx, 0, mz, PI / 2 - .3, L, { ...CATCH, crouch: .15 }, 'happy', { mouth: 'smile' }); GOLDEYE.forEach(e => e.visible = L.lt > .35 && L.lt < .6); const j = carry(jonas, m, L, { aLx: 1.6, lLx: .8, lRx: .8, lLk: .9, lRk: .9, headY: -.6 }); cara(j, L.T, { expr: 'shock', eyes: 'wide', mouth: 'grimace' }); sweat(j, L.T, 2);
  HANDG.forEach(g => { g.visible = true; g.scale.setScalar(1.2); }); EMB.rise(hp(j).add(V(0, -1, 0)), L.T, 0xffffff, 3, 6, 20);
  const p = hp(j).lerp(hp(m), .5); orb(L.k, p.clone().add(V(0, 1, 0)), null, [17, 1.6, .35, 42], [13, 1.2, .3, 40]); sh(p, 14); }, [[0, 'impact', .4], [.1, 'steam', .6], [.35, 'magic_hit', .4], [.5, 'gulp', .5]]);
// 63 «Ich habe nie Fragen gestellt.»: atardecer: los tres caminan por la calle; Jonas se encoge de hombros, sonriendo
shot(67.50, 'W', null, L => { town(L, { dusk: true }); walk(jonas, L, 30, -2, PI, 2, 0, { expr: 'happy', pose: { aLz: -.3, aRz: -.3, aLe: 1.2, aRe: 1.2, aLx: .3, aRx: .3 } }); walk(elias, L, 26.6, -1.4, PI, 2, 1.2, { expr: 'smug' }); walk(mira, L, 33.4, -1.6, PI, 2, 2.2, { expr: 'happy' });
  orb(L.k, V(30, 4, -2 - L.lt * 2), null, [-18, 0, .1, 46], [-14, -.45, .14, 44]); POST.push(() => { for (const c of [jonas, elias, mira]) c.root.rotation.y = PI; }); sh(V(30, 0, -4), 22); }, [[0, 'swipe', .4], [.1, 'steps', .5], [.4, 'birds', .3]]);
// 64 «Hätte ich aber besser.»: zoom lento: en la pared de la casa, sus sombras alargadas… las de Elias y Mira tienen ALAS
shot(68.99, 'C', 'slow', L => { town(L, { dusk: true }); for (const [c, x, i] of [[elias, -3.2, 1], [jonas, 0, 0], [mira, 3.2, 2]]) walk(c, L, x, 10, PI, 1.4, i, { expr: i ? 'smug' : 'happy' });
  WE.visible = true; WE.userData.spread(1, L.T); WE.userData.ghost(true); WM.visible = true; WM.userData.spread(1, L.T); WM.userData.ghost(true); hemi.intensity = .35; FILL.intensity = 8; sun.intensity = 3.6;
  sh(V(0, 0, 0), 30); sun.position.set(0, 12, 40); sun.target.position.set(0, 0, -10); cm([3, 18, 22, 0, 0, 0, 48], [-2, 22, 20, 0, 0, -2, 52], L.k); }, [[0, 'impact', .3], [.4, 'creepy_ting', .5], [.8, 'whoosh_magic', .4]]);
// ---------- c: el Gründerfest, Graf con Leben y Tod, la guadaña, Elias ríe, las alas, Mira arde, los nombres (70,28 – 118,79 s) ----------
// Plaza: escenario z = -64 (tablado y = 4.25), atril (0, 4.25, -60); Graf detrás del atril en (0, 4.25, -62.4) mirando +z; Leben (x = -9) y Tod (x = 9) en el escenario.
// Jonas (0, 0, -34) mirando al escenario (ry = PI), Elias (-3.4, 0, -33.4), Mira (3.4, 0, -33.4).
const SY = 4.25, JZ = -34;
function trio(L, o = {}) { const j = pose(jonas, 0, 0, JZ, PI, L, o.j || {}, o.je || 'worried'); const e = pose(elias, -3.4, 0, JZ + .6, PI + .15, L, o.e || { aLx: -.2, aRx: -.2, aLe: .5, aRe: .5 }, o.ee || 'smug'); const m = pose(mira, 3.4, 0, JZ + .6, PI - .15, L, o.m || {}, o.me || 'happy'); return [j, e, m]; }
function crowdF(L, n = 16, o = {}) { crowdAt(L, o.x ?? 0, o.z ?? -30, n, o.r0 ?? 8, o.r1 ?? 20, o.seed ?? 5, { mode: o.mode || 'cheer', expr: o.expr, gap: o.gap ?? 1.1, face: o.face, avoid: [[0, JZ], [-3.4, JZ + .6], [3.4, JZ + .6]] }); POST.push(() => DX.forEach((c, i) => { if (c.root.visible) engel(c, ...NP[i % 8], L.T, { s: .75 }); })); }
function grafAt(L, p = {}, expr = 'happy', ex = {}) { return pose(graf, 0, SY, -62.4, 0, L, p, expr, ex); }
function todOn(x, y, z, ry, L, p = {}, s = 1) { TOD.root.visible = true; TOD.root.position.set(x, y, z); TOD.root.rotation.y = ry; TOD.root.scale.setScalar(s); TOD.pose(L.T, p); return TOD; }
function lebenOn(x, y, z, ry, L, p = {}, s = 1) { LEBEN.root.visible = true; LEBEN.root.position.set(x, y, z); LEBEN.root.rotation.y = ry; LEBEN.root.scale.setScalar(s); LEBEN.pose(L.T, p); return LEBEN; }
function title(name, sub, k, col) { badge(col, name, W / 2, H * .17, k, 1, 1.25); if (sub) badge('tag', sub, W / 2, H * .255, clamp(k * 1.4 - .3), 1, .9); }

// 65 «Denn dann kam das Gründerfest.»: atardecer: fuegos artificiales sobre la plaza, la pancarta GRÜNDERFEST se ilumina; grúa bajando hacia la fiesta
shot(70.28, 'Z', 'punch', L => { festS(L); crowdF(L, 18, { mode: 'cheer' }); confetti(V(0, 14, -40), L.t0 + .2, L.T, 40, 1.4);
  EMB.burst(V(-14, 34, -70), L.t0 + .15, L.T, 0xff4a8a, 22, 14); EMB.L2 = 0;
  cm([0, 40, 30, 0, 16, -60, 52], [0, 16, 14, 0, 10, -60, 50], L.k, easeOut); sh(V(0, 0, -40), 50); }, [[0, 'impact', .4], [.1, 'firework', .7], [.35, 'cheer', .5], [.6, 'party_horn', .4]]);
// 66 «Die ganze Stadt»: la multitud bailando con sus ángeles revoloteando por encima: lluvia de confeti, guirnaldas
shot(71.99, 'W', null, L => { festS(L); crowdF(L, 22, { mode: i => ['cheer', 'clap', 'wave', 'talk'][i % 4], r0: 4, r1: 22, z: -24 }); confRain(V(0, 0, -24), L.T, 40, 40, 30, 18);
  cm([-18, 14, 4, 0, 4, -26, 50], [18, 12, 6, 0, 4, -26, 50], L.k); sh(V(0, 0, -24), 44); }, [[0, 'swipe', .4], [.1, 'crowd_run', .3], [.3, 'cheer', .5], [.6, 'clap', .4]]);
// 67 «auf dem Marktplatz.»: picado general de la plaza con el escenario al fondo, la fuente y los puestos encendidos
shot(73.05, 'F', null, L => { festS(L); crowdF(L, 22, { mode: 'cheer', r0: 6, r1: 26, z: -26 });
  cm([30, 34, 26, 0, 4, -40, 50], [22, 26, 16, 0, 4, -42, 50], L.k); sh(V(0, 0, -36), 60); }, [[0, 'flash', .3], [.1, 'bells', .4], [.5, 'cheer', .4]]);
// 68 «Und oben auf der Bühne:»: travelling ascendente por la escalera del escenario hasta el atril vacío con el micrófono; foco que se enciende
shot(73.78, 'S', null, L => { festS(L); lp(3, 0, 16, -52, 160, 0xfff0d0, 40); cm([-9, 2, -48, 0, 5, -60, 46], [-4, 8, -50, 0, 7, -60, 44], L.k); sh(V(0, 4, -60), 20); }, [[0, 'swipe', .4], [.2, 'switch', .5], [.4, 'drone', .3]]);
// 69 «Bürgermeister Graf.»: Graf (levita, cadena dorada, monóculo, sombrero tirolés) llega al atril, saluda con la mano a la multitud, sonrisa de político
shot(75.00, 'C', 'punch', L => { festS(L); lp(3, 0, 16, -52, 140, 0xfff0d0, 40); const g = grafAt(L, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 8) * .25, aRe: .3, aLx: .4 }, 'happy', { mouth: 'grin' });
  badge('tag', 'BÜRGERMEISTER GRAF', W / 2, H * .2, clamp((L.lt - .2) / .25)); onBody(g, 20, .3, .05, 42, L.k, 14, -.1, 4); sh(V(0, 4, -62), 20); }, [[0, 'impact', .5], [.1, 'cheer', .5], [.3, 'clap', .5]]);
// 70 «Mit den stärksten Schutzengeln»: zoom lento: detrás de Graf se elevan dos sombras gigantes desde el suelo del escenario; la multitud se calla
shot(76.02, 'Z', 'slow', L => { festS(L); grafAt(L, { aLx: 1.0, aRx: 1.0, aLe: .3, aRe: .3, aLz: .5, aRz: .5 }, 'smug', { mouth: 'grin' }); const up = easeOut(clamp(L.lt / 1.2));
  lebenOn(-9, SY - 13 + up * 13, -65, .15, L, { eyes: up * 4 }); todOn(9, SY - 13 + up * 13, -65, -.15, L, { eyes: up * 4 });
  EMB.rise(V(0, SY, -65), L.T, 0xfff0c0, 24, 10, 30); orb(L.k, V(0, 12, -63), null, [44, 0, .05, 50], [34, 0, .02, 48]); sh(V(0, 4, -62), 30); }, [[0, 'zoom_in', .3], [.1, 'rubble', .5], [.4, 'choir', .5], [.8, 'hum_low', .5]]);
// 71 «der ganzen Welt.»: plano bajo desde la multitud: los tres sobre el escenario: Graf en el centro y los dos colosos detrás, ojos encendidos
shot(77.51, 'F', null, L => { festS(L); grafAt(L, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5, aLe: .3, aRe: .3 }, 'smug', { mouth: 'grin' }); lebenOn(-9, SY, -65, .2, L); todOn(9, SY, -65, -.2, L);
  crowdF(L, 10, { mode: 'shock', r0: 10, r1: 16, z: -30, gap: 2.2 }); cm([-6, 3, -24, 0, 12, -64, 52], [4, 3, -26, 0, 12, -64, 52], L.k); sh(V(0, 4, -62), 30); }, [[0, 'flash', .4], [.1, 'braam_short', .6], [.4, 'gasp', .5]]);
// 72 «Leben»: primer plano del Leben: ojos verdes que se encienden, flores que brotan de su corona
shot(78.62, 'C', 'punch', L => { festS(L); const l = lebenOn(-9, SY, -65, .2, L, { eyes: 2 + L.k * 4, orb: 4 }); EMB.rise(V(-9, 14, -64), L.T, 0x8aff6a, 6, 6, 16);
  const h = l.head.getWorldPosition(V(0, 0, 0)); cm([h.x + 2, h.y, h.z + 12, h.x, h.y - 1, h.z, 40], [h.x + 1, h.y - .4, h.z + 8, h.x, h.y - 1, h.z, 38], L.k); sh(V(-9, 4, -65), 16); }, [[0, 'impact', .4], [.1, 'leaves', .6], [.3, 'hum_glow', .5]]);
// 73 «und Tod.»: primer plano del Tod: la calavera bajo la capucha, ojos azules que se encienden
shot(79.32, 'Z', null, L => { festS(L); const t = todOn(9, SY, -65, -.2, L, { eyes: 2 + L.k * 5 }); TINT = 'rgba(10,20,60,.2)';
  const h = t.head.getWorldPosition(V(0, 0, 0)); cm([h.x - 2, h.y - 1, h.z + 11, h.x, h.y - .6, h.z, 40], [h.x - 1, h.y - .4, h.z + 7.5, h.x, h.y - .6, h.z, 38], L.k); sh(V(9, 4, -65), 16); }, [[0, 'zoom_in', .4], [.1, 'creepy_ting', .7], [.3, 'wind', .5]]);
// 74 «Plötzlich zeigte»: Graf se inclina sobre el atril y señala con el dedo hacia la multitud
shot(79.94, 'W', null, L => { festS(L); const g = grafAt(L, { ...POINT, lean: .25, aRx: 1.4 }, 'angry', { mouth: 'grimace' }); lebenOn(-9, SY, -65, .2, L); todOn(9, SY, -65, -.2, L);
  cm([3, 9, -48, 0, 8, -62, 44], [1.5, 8.6, -51, 0, 8, -62, 42], L.k); sh(V(0, 4, -62), 24); }, [[0, 'swipe', .4], [.15, 'gasp', .5], [.4, 'tick', .4]]);
// 75 «der Bürgermeister auf mich.»: contraplano: la multitud se gira hacia Jonas, que se señala a sí mismo («¿yo?»), con Elias y Mira a los lados
shot(80.68, 'C', null, L => { festS(L); trio(L, { j: { aRx: 1.4, aRe: 1.9, aRz: -.3 } }); cara(jonas, L.T, { expr: 'shock', mouth: 'o' }); crowdF(L, 12, { mode: 'point', expr: 'sus', x: 0, z: JZ, r0: 7, r1: 14, gap: 1.3 });
  orb(L.k, V(0, 4.5, JZ), null, [22, PI + .4, .1, 46], [15, PI + .1, .08, 44]); sh(V(0, 0, JZ), 24); }, [[0, 'impact', .4], [.1, 'whisper', .5], [.5, 'heartbeat', .5]]);
// 76 «Dieser Junge hat keine Engel.»: Graf gritando al micrófono, con la cara roja; el micro silba
shot(81.93, 'R', null, L => { festS(L); const g = grafAt(L, { ...POINT, lean: .2 }, 'angry', { mouth: Math.sin(L.T * 14) > 0 ? 'scream' : 'talk_wide' }); talk(g, L.T, 81.93, 83.5, 'angry');
  onFace(g, 8, .2, -1, 40, L.k, 6); sh(V(0, 4, -62), 16); }, [[0, 'whirl', .4], [.05, 'shout_m', .5], [.2, 'radio', .3]]);
// 77 «Er bringt unserer Stadt nur Pech.»: la gente se aparta de Jonas formando un círculo vacío a su alrededor; sólo Elias y Mira se quedan
shot(83.52, 'S', null, L => { festS(L); trio(L); const k = easeOut(clamp(L.lt / 1)); crowdF(L, 16, { mode: 'walk', expr: 'sus', x: 0, z: JZ, r0: 6 + k * 8, r1: 10 + k * 10, gap: .2 }); POST.push(() => DX.forEach(c => { if (c.root.visible) { const p = c.root.position; c.root.rotation.y = Math.atan2(p.x, p.z - JZ); } }));
  orb(L.k, V(0, 3, JZ), null, [26, PI, 1.0, 50], [30, PI + .5, 1.1, 50]); sh(V(0, 0, JZ), 34); }, [[0, 'swipe', .4], [.1, 'crowd_run', .5], [.5, 'sad_tone', .4]]);
// 78 «Tod, erledige das.»: Graf chasquea los dedos sin mirar atrás; el Tod gira la cabeza y sus ojos se encienden al máximo
shot(85.19, 'C', 'punch', L => { festS(L); grafAt(L, { aRx: 1.6, aRz: .5, aRe: .8, headY: .3 }, 'smug', { mouth: 'smirk' }); const t = todOn(9, SY, -65, lerp(-.2, -.7, easeOut(clamp(L.lt / .4))), L, { eyes: 7 }); lebenOn(-9, SY, -65, .2, L);
  cm([-6, 10, -46, 4, 11, -64, 46], [-4, 9.5, -50, 5, 11, -64, 44], L.k); sh(V(0, 4, -62), 24); }, [[0, 'impact', .5], [.05, 'clack', .6], [.2, 'creepy_ting', .6], [.4, 'evil_laugh', .3]]);
// 79 «Und der Tod hob seine Sense.»: zoom lento en contrapicado: el Tod baja flotando del escenario hasta Jonas y alza la guadaña por encima de su cabeza
shot(86.66, 'Z', 'slow', L => { festS(L); trio(L, { j: { aLx: 1.4, aRx: 1.4, aLe: 1.9, aRe: 1.9, lean: -.25, headX: -.3 } }); cara(jonas, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' }); sweat(jonas, L.T, 2);
  const k = easeInOut(clamp(L.lt / 1.2)); todOn(lerp(9, 0, k), lerp(SY, 0, k), lerp(-65, JZ - 9, k), 0, L, { rx: lerp(-.3, -2.8, clamp((L.lt - .8) / .6)), sx: lerp(1.5, .4, clamp((L.lt - .8) / .6)), eyes: 7 }); TINT = 'rgba(10,10,50,.18)';
  cm([3, 1.4, JZ + 9, 0, 9, JZ - 6, 54], [2, 1.2, JZ + 6, 0, 10, JZ - 6, 50], L.k); sh(V(0, 0, JZ), 24); }, [[0, 'zoom_in', .3], [.1, 'wind', .6], [.9, 'metal_rip', .5], [1.3, 'heartbeat', .6]]);
// 80 «Ich schloss die Augen.»: primer plano de Jonas: aprieta los ojos, se encoge; la sombra de la guadaña le cruza la cara
shot(88.48, 'F', null, L => { festS(L); const [j] = trio(L, { j: { aLx: 1.6, aRx: 1.6, aLe: 2, aRe: 2, crouch: .2, headX: .2 } }); cara(j, L.T, { eyes: 'closed', mouth: 'grimace_wide' }); todOn(0, 0, JZ - 9, 0, L, { rx: -2.8, sx: .4, eyes: 6 }); DARK = .15;
  const h = hp(j); cm([h.x + 3.5, h.y + 2.6, h.z - 6.5, h.x, h.y - .3, h.z, 42], [h.x + 2.6, h.y + 2, h.z - 5, h.x, h.y - .3, h.z, 40], L.k); sh(V(0, 0, JZ), 16); }, [[0, 'flash', .3], [.1, 'gasp', .6], [.5, 'heartbeat', .6]]);
// 81 «Doch dann hörte ich Elias lachen.»: casi a oscuras: Elias, con la cabeza gacha, empieza a reírse, los hombros le tiemblan
shot(89.63, 'B', null, L => { festS(L); const e = pose(elias, -3.4, 0, JZ + .6, PI + .3, L, { headX: lerp(.4, -.2, L.k), lean: .1 + Math.sin(L.T * 18) * .03, aLx: -.2, aRx: -.2, aLe: .5, aRe: .5 }, 'smug'); laughF(e, L.T); DARK = .3; TINT = 'rgba(30,0,40,.25)';
  pose(jonas, 0, 0, JZ, PI, L, { crouch: .2 }, 'worried'); onFace(e, 9, .4, 1.4, 40, L.k, 6.5); sh(V(0, 0, JZ), 16); }, [[0, 'evil_laugh', .6], [.5, 'laugh_deep', .5]]);
// 82 «Fünfzehn Jahre, sagte er.»: Elias levanta la cabeza, sonrisa ladeada; un «15» morado gira a su lado
shot(91.37, 'C', 'punch', L => { festS(L); const e = pose(elias, -3.4, 0, JZ + .6, PI + .3, L, { aLx: -.2, aRx: -.2, aLe: .5, aRe: .5, headX: -.1 }, 'smug'); talk(e, L.T, 91.37, 93.2, 'smug'); TINT = 'rgba(30,0,40,.15)';
  badge('big', '15 JAHRE', W / 2, H * .2, clamp(L.lt / .2)); onFace(e, 8, .3, -1, 40, L.k, 6); sh(V(-3, 0, JZ), 16); }, [[0, 'impact', .5], [.1, 'magic_hit', .4]]);
// 83 «Fünfzehn Jahre warte ich schon darauf,»: Elias camina despacio hacia el Tod, haciendo crujir los nudillos
shot(93.43, 'W', null, L => { festS(L); const e = walk(elias, L, -3.4, JZ - .4, PI + .3, 1.2, 0, { expr: 'smug', pose: { aLx: 1.0, aRx: 1.0, aLe: 1.6, aRe: 1.6, aLz: -.5, aRz: -.5 } }); talk(e, L.T, 93.43, 95.5, 'smug'); todOn(0, 0, JZ - 9, 0, L, { rx: -2.8, sx: .4, eyes: 6 }); pose(jonas, 0, 0, JZ, PI, L, { crouch: .2 }, 'worried'); pose(mira, 3.4, 0, JZ + .6, PI - .15, L, {}, 'smug');
  cm([-10, 4, JZ - 12, -2, 5, JZ, 46], [-8, 4.4, JZ - 8, -2.5, 5, JZ, 44], L.k); sh(V(0, 0, JZ), 22); }, [[0, 'swipe', .4], [.2, 'crack', .5], [.4, 'back_crack', .6], [.7, 'steps', .4]]);
// 84 «dass es endlich einer versucht.»: los ojos de Elias se vuelven rojos y brillantes; zoom rápido
shot(95.53, 'Z', 'slow', L => { festS(L); const e = pose(elias, -2.6, 0, JZ - 2.4, PI + .3, L, { aLx: -.2, aRx: -.2, aLe: .5, aRe: .5 }, 'angry', { mouth: 'smirk' }); REDEYE.forEach(r => r.visible = L.lt > .4); TINT = 'rgba(40,0,10,.15)';
  onFace(e, 8.5, .1, 0, 40, L.k, 4.4); sh(V(-3, 0, JZ), 16); }, [[0, 'zoom_in', .4], [.4, 'creepy_ting', .7]]);
// 85 «Als ich die Augen öffnete,»: Jonas abre los ojos de golpe, la cara iluminada de morado
shot(97.17, 'F', null, L => { festS(L); const j = pose(jonas, 0, 0, JZ, PI, L, { crouch: .1, headX: -.1 }, 'shock'); cara(j, L.T, L.lt < .2 ? { eyes: 'closed', mouth: 'grimace' } : { expr: 'shock', eyes: 'wide', mouth: 'o' }); lp(3, -2, 6, JZ - 3, 120, 0x9a4aff, 20);
  onFace(j, 6.5, .3, 0, 40, L.k, 5); sh(V(0, 0, JZ), 16); }, [[0, 'flash', .4], [.15, 'gasp', .6]]);
// 86 «rissen schwarze Flügel aus seinem Rücken.»: ¡las alas negras estallan desde la espalda de Elias! Lluvia de plumas negras, destello rojo, temblor
shot(98.69, 'C', 'punch', L => { festS(L); const e = pose(elias, -2.6, 0, JZ - 2.4, .4, L, { aLx: .6, aRx: .6, aLz: .6, aRz: .6, aLe: .3, aRe: .3, lean: -.15, headX: -.2 }, 'angry', { mouth: 'grin' }); const k = clamp(L.lt / .45); eliasWings(k, L.T); if (L.lt < .4) SHAKE = 1 - L.lt / .4;
  FEA.fall(V(-2.6, 0, JZ - 2.4), L.T, 0x16141c, .2, 22, 18); if (L.lt < .12) TINT = 'rgba(255,20,40,.45)'; todOn(0, 0, JZ - 9, 0, L, { rx: -2.8, sx: .4, eyes: 6 });
  orb(L.k, V(-2.6, 6, JZ - 2.4), null, [26, PI + .4, .12, 50], [22, PI + .15, .1, 48]); sh(V(-2, 0, JZ), 26); }, [[0, 'impact', .6], [.02, 'metal_rip', .6], [.08, 'feathers', .8], [.2, 'braam', .7], [.5, 'wind', .5]]);
// 87 «aus seinem Rücken.»: desde atrás: las dos alas enormes se despliegan del todo con un golpe de aire que levanta el confeti
shot(99.89, 'R', null, L => { festS(L); const e = pose(elias, -2.6, 0, JZ - 2.4, PI + .2, L, { aLx: .4, aRx: .4, aLz: .3, aRz: .3, headX: -.1 }, 'angry'); eliasWings(1, L.T); confetti(V(6, -4, JZ - 8), L.t0, L.T, 14, 1.2);
  orb(L.k, V(-2.6, 7, JZ - 2.4), null, [24, .2, .25, 52], [19, -.25, .18, 50]); sh(V(-2, 0, JZ), 26); }, [[0, 'whirl', .4], [.1, 'wind', .6], [.3, 'feathers', .5]]);
// 88 «Sein Schatten verschluckte den halben Platz.»: cenital: una sombra negra se extiende desde Elias y se traga media plaza; la gente corre
shot(100.57, 'W', null, L => { festS(L); pose(elias, -2.6, 0, JZ - 2.4, PI + .2, L, { aLx: .4, aRx: .4, aLz: .3, aRz: .3 }, 'angry'); eliasWings(1, L.T); pose(jonas, 0, 0, JZ, PI, L, {}, 'shock'); pose(mira, 3.4, 0, JZ + .6, PI - .15, L, {}, 'smug');
  crowdF(L, 20, { mode: 'run', expr: 'shock', x: 0, z: JZ, r0: 12, r1: 30, gap: 0 }); POST.push(() => DX.forEach(c => { if (c.root.visible) { const p = c.root.position; c.root.rotation.y = Math.atan2(p.x, p.z - JZ); } }));
  SHD.visible = true; SHD.position.set(-2.6, .08, JZ - 2.4); SHD.scale.setScalar(lerp(4, 42, easeOut(clamp(L.lt / 1.4)))); hemi.intensity *= lerp(1, .55, L.k);
  cm([0, 60, JZ + 10, 0, 0, JZ - 2, 50], [0, 46, JZ + 6, 0, 0, JZ - 2, 54], L.k); sh(V(0, 0, JZ), 40); }, [[0, 'swipe', .4], [.1, 'drone', .7], [.4, 'crowd_run', .6], [.8, 'scream_girl', .3]]);
// 89 «den halben Platz.»: plano bajo: la oscuridad avanza por los adoquines hacia la cámara, las bombillas de las guirnaldas se apagan
shot(101.93, 'S', null, L => { festS(L); pose(elias, -2.6, 0, JZ - 2.4, PI + .2, L, { aLx: .4, aRx: .4 }, 'angry'); eliasWings(1, L.T); SHD.visible = true; SHD.position.set(-2.6, .08, JZ - 2.4); SHD.scale.setScalar(42 + L.lt * 6);
  hemi.intensity *= .5; FILL.intensity *= .4; for (let i = 0; i < 3; i++) LP[i].intensity *= .3; DARK = .2;
  cm([6, 1.5, JZ + 22, -2, 6, JZ - 2, 50], [4, 1.8, JZ + 17, -2, 7, JZ - 2, 48], L.k); sh(V(0, 0, JZ), 30); }, [[0, 'whoosh_down', .5], [.2, 'switch', .5], [.5, 'hum_low', .5]]);
// 90 «Und Mira?»: Jonas se gira hacia Mira; ella le devuelve una sonrisa tranquila… y le brilla el pelo
shot(103.02, 'F', null, L => { festS(L); const [j, , m] = trio(L, { j: { headY: lerp(0, -.7, easeOut(clamp(L.lt / .3))) } }); cara(j, L.T, { expr: 'shock', mouth: 'o' }); cara(m, L.T, { expr: 'happy', mouth: 'smile' }); eliasWings(1, L.T); glowAt(hp(m), 3, 0xffd890, .15); DARK = .15;
  orb(L.k, V(1.7, 5.5, JZ + .3), null, [13, PI - .7, .1, 42], [10, PI - .4, .1, 40]); sh(V(0, 0, JZ), 18); }, [[0, 'flash', .3], [.1, 'whoosh', .4], [.4, 'hum_glow', .4]]);
// 91 «Mira brannte.»: Mira se envuelve en luz dorada: brasas subiendo, el aire tiembla a su alrededor
shot(103.77, 'C', 'punch', L => { festS(L); const m = pose(mira, 3.4, 0, JZ + .6, PI - .15, L, { aLx: .4, aRx: .4, aLz: .5, aRz: .5, headX: -.15 }, 'determined'); GOLDEYE.forEach(e => e.visible = true); HANDG.forEach(g => g.visible = true);
  glowAt(hp(m).add(V(0, -1, 0)), 4, 0xffb040, .1); EMB.rise(V(3.4, 0, JZ + .6), L.T, 0xffa020, 6, 14, 44); lp(3, 3.4, 5, JZ + 4, 160, 0xffb040, 24);
  onBody(m, 18, 0, .1, 44, L.k, 13); sh(V(3, 0, JZ), 18); }, [[0, 'impact', .5], [.05, 'fire_whoosh', .7], [.2, 'fire_crackle', .6]]);
// 92 «Acht Flügel»: zoom lento: ocho alas de luz se abren una tras otra detrás de Mira; «8»
shot(105.04, 'Z', 'slow', L => { festS(L); const m = pose(mira, 3.4, 0, JZ + .6, PI - .15, L, { aLx: .6, aRx: .6, aLz: .7, aRz: .7, aLe: .2, aRe: .2, headX: -.2 }, 'determined'); miraWings(easeOut(clamp(L.lt / 1.1)), L.T, false);
  glowAt(hp(m).add(V(0, -1, 0)), 4, 0xfff0c0, .1); EMB.rise(V(3.4, 0, JZ + .6), L.T, 0xfff0c0, 8, 14, 30); lp(3, 3.4, 6, JZ + 6, 140, 0xfff0d0, 30); BLOOMMAX = .24;
  badge('gold', '8', W / 2, H * .18, clamp((L.lt - .9) / .2), 1, 1.5); onBody(m, 30, .05, .12, 48, L.k, 24); sh(V(3, 0, JZ), 24); }, [[0, 'zoom_in', .3], [.1, 'whoosh_magic', .6], [.3, 'feathers', .5], [.6, 'choir', .6]]);
// 93 «aus reinem, weißem Licht.»: órbita alrededor de Mira con las ocho alas abiertas, plumas blancas cayendo
shot(105.72, 'R', null, L => { festS(L); const m = pose(mira, 3.4, 0, JZ + .6, PI - .15, L, { aLx: .6, aRx: .6, aLz: .7, aRz: .7, aLe: .2, aRe: .2 }, 'determined'); miraWings(1, L.T, false); FEA.fall(V(3.4, 0, JZ), L.T, 0xffffff, .8, 22, 18);
  glowAt(hp(m).add(V(0, -1, 0)), 4, 0xfff0c0, .1); lp(3, 3.4, 6, JZ + 6, 140, 0xfff0d0, 30); BLOOMMAX = .24; orb(L.k, V(3.4, 7, JZ + .6), null, [30, PI - .6, .15, 50], [26, PI + .5, .1, 50]); sh(V(3, 0, JZ), 26); }, [[0, 'whirl', .4], [.1, 'choir', .5], [.5, 'sparkle', .5]]);
// 94 «Und ihr Heiligenschein»: aparece la aureola sobre su cabeza…
shot(107.45, 'S', null, L => { festS(L); const m = pose(mira, 3.4, 0, JZ + .6, PI - .15, L, { headX: -.1 }, 'determined'); miraWings(1, L.T, true); HALO.scale.setScalar(easeOut(clamp(L.lt / .4)) * 1.2); BLOOMMAX = .24;
  onFace(m, 9, 1.6, 0, 42, L.k, 7); sh(V(3, 0, JZ), 16); }, [[0, 'swipe', .4], [.1, 'ding_reveal', .6], [.3, 'hum_glow', .5]]);
// 95 «stand in Flammen.»: …y se prende en llamas doradas; primer plano con brasas
shot(108.37, 'C', 'punch', L => { festS(L); const m = pose(mira, 3.4, 0, JZ + .6, PI - .15, L, { headX: -.15 }, 'determined'); miraWings(1, L.T, true); HALO.scale.setScalar(1.2); EMB.rise(hp(m).add(V(0, 2, 0)), L.T, 0xffa020, 3, 5, 24); BLOOMMAX = .26;
  const h = hp(m); cm([h.x - 2, h.y + 5, h.z - 7, h.x, h.y + 1.6, h.z, 42], [h.x - 1.4, h.y + 4, h.z - 5.4, h.x, h.y + 1.6, h.z, 40], L.k); sh(V(3, 0, JZ), 16); }, [[0, 'fire_whoosh', .7], [.1, 'ignite', .6], [.3, 'fire_crackle', .6]]);
// 96 «Der Tod erstarrte.»: el Tod se congela con la guadaña en alto; escarcha azul, sus ojos parpadean
shot(109.55, 'F', null, L => { festS(L); const t = todOn(0, 0, JZ - 9, 0, L, { rx: -2.8, sx: .4, eyes: Math.sin(L.T * 30) > 0 ? 6 : 1 }); TINT = 'rgba(120,180,255,.16)';
  const h = t.head.getWorldPosition(V(0, 0, 0)); cm([h.x + 6, h.y - 3, h.z + 14, h.x, h.y - 2, h.z, 46], [h.x + 4, h.y - 2.4, h.z + 10.5, h.x, h.y - 2, h.z, 44], L.k); sh(V(0, 0, JZ - 9), 20); }, [[0, 'flash', .4], [.1, 'freeze', .7], [.4, 'glass_crack', .4]]);
// 97 «Nachtiel.»: Elias de frente con las alas negras abiertas; título NACHTIEL en morado
shot(110.73, 'C', 'punch', L => { festS(L); const e = pose(elias, -2.6, 0, JZ - 2.4, .1, L, { aLx: .3, aRx: .3, aLz: .5, aRz: .5, headX: -.1 }, 'smug', { mouth: 'smirk' }); eliasWings(1, L.T); FEA.fall(V(-2.6, 0, JZ - 2.4), L.T, 0x16141c, .2, 18, 16, 20); TINT = 'rgba(40,0,70,.2)';
  title('NACHTIEL', null, clamp(L.lt / .2), 'red'); onBody(e, 30, 0, .1, 50, L.k, 24); sh(V(-2, 0, JZ), 26); }, [[0, 'impact', .6], [.05, 'braam', .7], [.3, 'feathers', .4]]);
// 98 «Der Engel der absoluten Dunkelheit.»: grúa lenta alrededor de Nachtiel, ojos rojos, plumas negras cayendo; subtítulo
shot(111.83, 'R', null, L => { festS(L); const e = pose(elias, -2.6, 0, JZ - 2.4, .1, L, { aLx: .3, aRx: .3, aLz: .5, aRz: .5 }, 'angry', { mouth: 'smirk' }); eliasWings(1, L.T); FEA.fall(V(-2.6, 0, JZ - 2.4), L.T, 0x16141c, .2, 18, 16, 24); TINT = 'rgba(40,0,70,.22)';
  title('NACHTIEL', 'DER ENGEL DER ABSOLUTEN DUNKELHEIT', 1, 'red'); orb(L.k, V(-2.6, 6, JZ - 2.4), null, [22, -.6, -.05, 50], [24, .5, .2, 50]); sh(V(-2, 0, JZ), 26); }, [[0, 'whirl', .4], [.2, 'drone', .6], [.7, 'wind', .4]]);
// 99 «Das Leben wich zurück.»: el Leben, en el escenario, retrocede flotando con las manos en alto y los ojos muy abiertos
shot(114.19, 'W', null, L => { festS(L); const l = lebenOn(-9, SY, lerp(-65, -69, easeOut(L.k)), .2, L, { rx: -1.6, lx: -1.6, eyes: 2, hx: -.2 });
  const h = l.head.getWorldPosition(V(0, 0, 0)); cm([h.x + 6, h.y - 4, h.z + 22, h.x, h.y - 3, h.z, 46], [h.x + 3, h.y - 3, h.z + 17, h.x, h.y - 3, h.z, 46], L.k); sh(V(-9, 4, -66), 24); }, [[0, 'swipe', .4], [.1, 'leaves', .5], [.4, 'gasp_old', .4]]);
// 100 «Und Lumiel.»: Mira de frente con las ocho alas y la aureola en llamas; título LUMIEL en oro
shot(115.76, 'C', 'punch', L => { festS(L); const m = pose(mira, 3.4, 0, JZ + .6, -.1, L, { aLx: .6, aRx: .6, aLz: .7, aRz: .7, aLe: .2, aRe: .2 }, 'determined', { mouth: 'smile' }); miraWings(1, L.T, true); HALO.scale.setScalar(1.2); BLOOMMAX = .24; glowAt(hp(m).add(V(0, -1, 0)), 4, 0xfff0c0, .1);
  title('LUMIEL', null, clamp(L.lt / .2), 'gold'); onBody(m, 30, 0, .1, 50, L.k, 24); sh(V(3, 0, JZ), 26); }, [[0, 'impact', .6], [.05, 'magic_hit', .7], [.2, 'choir', .5]]);
// 101 «Der Dämon des absoluten Lichts.»: grúa ascendente sobre Lumiel brillando; subtítulo
shot(116.66, 'Z', null, L => { festS(L); const m = pose(mira, 3.4, 0, JZ + .6, -.1, L, { aLx: .6, aRx: .6, aLz: .7, aRz: .7, aLe: .2, aRe: .2 }, 'determined'); miraWings(1, L.T, true); HALO.scale.setScalar(1.2); BLOOMMAX = .24; EMB.rise(V(3.4, 0, JZ + .6), L.T, 0xfff0c0, 10, 16, 30);
  title('LUMIEL', 'DER DÄMON DES ABSOLUTEN LICHTS', 1, 'gold'); orb(L.k, V(3.4, 6, JZ + .6), null, [24, .4, -.1, 50], [22, -.3, .3, 50]); sh(V(3, 0, JZ), 26); }, [[0, 'zoom_in', .4], [.2, 'hum_glow', .6], [.6, 'sparkle', .5]]);
// ---------- d: la pelea, el rayo blanco y negro, el alcalde escondido, las alas plegadas, el final (118,79 – 162,4 s) ----------
const TZ = JZ - 9;   // donde flota el Tod (delante del trío)
function fightBase(L, o = {}) { festS(L); BLOOMMAX = .24; const e = pose(elias, o.ex ?? -2.6, 0, o.ez ?? JZ - 2.4, o.ery ?? PI, L, o.e || { aLx: .3, aRx: .3, aLz: .4, aRz: .4 }, o.ee || 'angry', { mouth: 'smirk' }); eliasWings(1, L.T);
  const m = pose(mira, o.mx ?? 3.4, 0, o.mz ?? JZ - 1.6, o.mry ?? PI, L, o.m || { aLx: .5, aRx: .5, aLz: .6, aRz: .6 }, o.me || 'determined'); miraWings(1, L.T, true); HALO.scale.setScalar(1.2);
  if (o.jonas !== false) pose(jonas, 0, 0, JZ + 3, PI, L, { crouch: .15, aLx: .8, aRx: .8, aLe: 1.6, aRe: 1.6 }, 'shock', { mouth: 'o' }); return [e, m]; }
const staffTip = () => { LEBEN.root.updateMatrixWorld(true); return LEBEN.orb.getWorldPosition(V(0, 0, 0)); };

// 102 «Trotzdem schlug der Tod zuerst zu.»: el Tod se descongela y lanza un tajo horizontal enorme con la guadaña hacia Elias; estela azul
shot(118.79, 'C', 'punch', L => { const [e] = fightBase(L); const sw = easeIn(clamp((L.lt - .4) / .5)); todOn(0, 0, TZ, -.3, L, { rx: lerp(-2.8, -1.2, sw), rz: lerp(.15, -1.6, sw), sx: lerp(.4, 1.4, sw), eyes: 7 }); TINT = 'rgba(20,30,80,.15)';
  if (sw > .2) EMB.burst(V(-1.5, 8, TZ + 3), L.t0 + .6, L.T, 0x9ae8ff, 20, 9);
  cm([10, 5, TZ + 14, -1, 7, TZ + 2, 50], [7, 5.4, TZ + 10, -1, 7, TZ + 2, 48], L.k); sh(V(0, 0, TZ + 3), 26); }, [[0, 'impact', .4], [.1, 'growl', .5], [.45, 'whoosh', .8], [.8, 'metal_rip', .5]]);
// 103 «Aber Nachtiel fing die Sense»: ¡CLANG! Elias atrapa la hoja con una mano; chispas azules y moradas, el suelo se agrieta
shot(120.86, 'F', null, L => { const [e] = fightBase(L, { e: { aRx: 1.6, aRz: .3, aRe: .2, aLx: .3, lean: .2, lLx: -.4, lRx: .5 } }); todOn(0, 0, TZ, -.3, L, { rx: -1.2, rz: -1.6, sx: 1.4, eyes: 7 });
  const hp_ = wpos(elias.aR.hand); EMB.burst(hp_, L.t0 + .05, L.T, 0xb08aff, 30, 12); if (L.lt < .3) SHAKE = 1 - L.lt / .3; dust(V(-2.6, 0, JZ - 2.4), L.t0, L.T, 10, .8);
  orb(L.k, hp(e).add(V(0, -1, 0)), null, [17, -2.35, .1, 46], [13, -2.0, .08, 44]); sh(V(-2, 0, JZ), 22); }, [[0, 'metal_hit', .9], [.02, 'sparks', .7], [.1, 'impact', .6], [.4, 'rubble', .4]]);
// 104 «mit nur einer Hand.»: primer plano: la mano de Elias apretando el filo brillante sin un rasguño; sonrisa ladeada
shot(122.06, 'Z', null, L => { const [e] = fightBase(L, { e: { aRx: 1.6, aRz: .3, aRe: .2, aLx: -.2, aLe: .5 } , ee: 'smug' }); todOn(0, 0, TZ, -.3, L, { rx: -1.2, rz: -1.6, sx: 1.4, eyes: 7 }); TINT = 'rgba(40,0,70,.15)';
  badge('red', '1 HAND', W / 2, H * .2, clamp((L.lt - .2) / .2), 1, .9); orb(L.k, wpos(elias.aR.hand), null, [11, -2.2, .15, 42], [8.5, -1.9, .12, 40]); sh(V(-2, 0, JZ), 18); }, [[0, 'zoom_in', .4], [.1, 'hum_low', .5], [.3, 'metal_creak', .5]]);
// 105 «Und brach sie einfach in zwei Teile.»: ¡CRACK! la guadaña se parte en dos; la hoja sale girando por el aire; destello
shot(123.22, 'C', 'punch', L => { fightBase(L, { e: { aRx: 1.6 - clamp((L.lt - .2) / .2) * .8, aRz: .3, aLx: .3, lean: .1 } }); const t = todOn(0, 0, TZ, -.3, L, { rx: -1.2, rz: -1.6, sx: 1.4, eyes: 7 }); t.snap(clamp((L.lt - .2) / 1.2)); if (L.lt > .2 && L.lt < .3) TINT = 'rgba(255,255,255,.6)';
  EMB.burst(V(-1, 8, TZ + 4), L.t0 + .2, L.T, 0x9ae8ff, 26, 12); if (L.lt > .2 && L.lt < .45) SHAKE = 1;
  cm([-16, 6, TZ + 10, -1, 7, TZ + 1, 50], [-13, 7, TZ + 8, -1, 8, TZ + 1, 50], L.k); sh(V(0, 0, TZ + 3), 26); }, [[0, 'impact', .5], [.2, 'glass_break', .6], [.22, 'crash_wood', .7], [.35, 'whirl', .5], [.9, 'metal_hit', .4]]);
// 106 «Dann schoss das Leben einen Strahl,»: el Leben en el escenario alza su bastón: el orbe se carga y dispara un rayo verde enorme
shot(125.14, 'W', null, L => { festS(L); const l = lebenOn(-9, SY, -66, .35, L, { rx: -2.2, eyes: 5, orb: 6 }); const tip = staffTip(); const k = clamp((L.lt - .4) / .3);
  if (k > 0) { BEAM[0].visible = true; BEAM[0].userData.set(tip, tip.clone().lerp(V(3.4, 6, JZ - 1.6), k), 1.2, L.T); } EMB.rise(tip, L.T, 0x8aff6a, 3, 4, 20); lp(3, -9, 14, -60, 120 + k * 200, 0x6aff5a, 50);
  cm([-24, 6, -40, -8, 12, -62, 50], [-20, 8, -46, -8, 12, -62, 50], L.k); sh(V(-9, 4, -64), 30); }, [[0, 'swipe', .4], [.1, 'power_on', .6], [.4, 'zap', .8], [.5, 'hum_glow', .6]]);
// 107 «der den ganzen Platz»: el rayo verde barre la plaza: allí donde toca, brotan árboles, helechos y flores a toda velocidad
shot(127.20, 'S', null, L => { festS(L); lebenOn(-9, SY, -66, .35, L, { rx: -2.2, eyes: 5, orb: 6 }); const tip = staffTip(); const tg = V(lerp(-30, 30, L.k), 0, lerp(-20, -40, L.k)); BEAM[0].visible = true; BEAM[0].userData.set(tip, tg, 1.1, L.T);
  JUNG.visible = true; JUNG.userData.grow(L.k * .8); EMB.burst(tg, L.t0 + L.lt - .1, L.T, 0x8aff6a, 14, 6); lp(3, tg.x, 6, tg.z, 160, 0x6aff5a, 40);
  cm([0, 30, 10, 0, 0, -36, 52], [10, 24, 4, 0, 0, -36, 52], L.k); sh(V(0, 0, -36), 50); }, [[0, 'swipe', .4], [.05, 'zap', .6], [.2, 'leaves', .7], [.6, 'rubble', .4]]);
// 108 «in einen Dschungel verwandelte.»: la plaza convertida en selva: lianas sobre las casas, flores gigantes; la gente asoma entre las plantas
shot(128.24, 'Z', null, L => { festS(L); JUNG.visible = true; JUNG.userData.grow(.8 + L.k * .2); crowdF(L, 10, { mode: 'shock', r0: 18, r1: 30, z: -30 });
  badge('green', 'DSCHUNGEL!', W / 2, H * .2, clamp((L.lt - .1) / .2), 1, .9); cm([-30, 10, 10, 0, 6, -30, 50], [-22, 14, 2, 0, 5, -32, 50], L.k); sh(V(0, 0, -30), 50); }, [[0, 'zoom_in', .4], [.1, 'birds', .5], [.3, 'leaves', .5], [.6, 'whinny', .2]]);
// 109 «Doch Lumiel schlug einfach mitten durch.»: Mira vuela contra el rayo verde y lo parte de un puñetazo: el rayo estalla en chispas
shot(129.49, 'C', 'punch', L => { festS(L); JUNG.visible = true; JUNG.userData.grow(1); lebenOn(-9, SY, -66, .35, L, { rx: -2.2, eyes: 5, orb: 6 }); const tip = staffTip();
  const fly = easeOut(clamp(L.lt / .5)); const mp = V(lerp(3.4, -2, fly), lerp(0, 6, fly), lerp(JZ - 1.6, -50, fly)); const m = put(mira, mp.x, mp.y, mp.z, PI + .4); actuar(m, 0, [[0, { aRx: 2.8, aRe: .1, aLx: .4, aLz: .6, lean: .5, lLx: -.6, lRx: .4 }]], { T: L.T, weight: false }); cara(m, L.T, { expr: 'angry', mouth: 'grimace' }); m.blob.visible = false; miraWings(1, L.T, true); HALO.scale.setScalar(1.2);
  const hit = wpos(m.aR.hand); if (L.lt < .5) { BEAM[0].visible = true; BEAM[0].userData.set(tip, hit, 1.1, L.T); } else { EMB.burst(hit, L.t0 + .5, L.T, 0x8aff6a, 40, 14); if (L.lt < .7) TINT = 'rgba(200,255,200,.4)'; SHAKE = L.lt < .8 ? 1 : 0; }
  BLOOMMAX = .26; cm([12, 10, -26, -4, 8, -52, 50], [8, 9, -32, -4, 8, -52, 48], L.k); sh(V(-4, 0, -50), 30); }, [[0, 'whoosh_up', .6], [.45, 'impact', .9], [.5, 'explosion', .6], [.55, 'sparks', .5]]);
// 110 «mitten durch.»: Mira aterriza junto a Elias con el puño humeante, las ocho alas abiertas
shot(130.89, 'F', null, L => { const [e, m] = fightBase(L, { m: { aRx: 1.2, aRe: 1.6, aLx: .4, aLz: .6 }, me: 'smug' }); JUNG.visible = true; JUNG.userData.grow(1); EMB.rise(wpos(mira.aR.hand), L.T, 0xffffff, 1.4, 4, 14);
  orb(L.k, V(.4, 6, JZ - 2), null, [26, PI + .3, .1, 50], [22, PI - .15, .1, 50]); sh(V(0, 0, JZ), 26); }, [[0, 'flash', .3], [.05, 'land', .7], [.2, 'steam', .4]]);
// 111 «Und dann nahmen sich die beiden an den Händen.»: Elias y Mira se miran, asienten y se dan la mano; luz y oscuridad se mezclan en sus manos
shot(131.92, 'R', null, L => { const k = easeOut(clamp(L.lt / .6)); const [e, m] = fightBase(L, { ex: -2.6 + k * 1.4, mx: 3.4 - k * 1.4, ez: JZ - 2, mz: JZ - 2, ery: PI - .4, mry: PI + .4, e: { aLx: 1.2 * k, aLz: -.3 * k, aLe: .2 }, m: { aRx: 1.2 * k, aRz: .3 * k, aRe: .2 }, ee: 'smug', me: 'smug' }); JUNG.visible = true; JUNG.userData.grow(1);
  const hm = wpos(elias.aL.hand).lerp(wpos(mira.aR.hand), .5); glowAt(hm, 1.5 + k, 0xffffff, .3 * k); EMB.rise(hm, L.T, L.T * 8 % 2 > 1 ? 0xffffff : 0x8a3aff, 2, 4, 20);
  orb(L.k, V(0, 6, JZ - 2), null, [22, PI + .5, .1, 48], [16, PI - .2, .1, 46]); sh(V(0, 0, JZ), 22); }, [[0, 'whirl', .4], [.2, 'hug', .4], [.5, 'hum_glow', .6], [.8, 'magic_hit', .4]]);
// 112 «Dunkelheit und Licht.»: espiral: alas negras y blancas giran alrededor de las manos unidas
shot(134.13, 'Z', null, L => { const [e, m] = fightBase(L, { ex: -1.2, mx: 2, ez: JZ - 2, mz: JZ - 2, ery: PI - .4, mry: PI + .4, e: { aLx: 1.2, aLz: -.3, aLe: .2 }, m: { aRx: 1.2, aRz: .3, aRe: .2 }, ee: 'determined' }); JUNG.visible = true; JUNG.userData.grow(1);
  const hm = wpos(elias.aL.hand).lerp(wpos(mira.aR.hand), .5); glowAt(hm, 3, 0xffffff, .35); FEA.fall(hm.clone().add(V(0, -6, 0)), L.T * 2, L.T * 4 % 2 > 1 ? 0xffffff : 0x16141c, .5, 10, 12, 28);
  orb(0, hm, null, [lerp(14, 9, L.k), PI + L.k * 1.4, .15, 46], [0, 0, 0]); sh(V(0, 0, JZ), 20); }, [[0, 'zoom_in', .4], [.1, 'feathers', .6], [.3, 'choir', .5]]);
// 113 «Zu einem einzigen Strahl verdreht.»: zoom lento: de sus manos sale un rayo trenzado, blanco y negro, que atraviesa al Tod y al Leben
shot(135.17, 'C', 'slow', L => { const [e, m] = fightBase(L, { ex: -1.2, mx: 2, ez: JZ - 2, mz: JZ - 2, ery: PI - .2, mry: PI + .2, e: { aLx: 1.6, aLz: -.2, aLe: .1, aRx: .4 }, m: { aRx: 1.6, aRz: .2, aRe: .1, aLx: .4 }, ee: 'determined' }); JUNG.visible = true; JUNG.userData.grow(1);
  todOn(0, 0, TZ - 10, 0, L, { eyes: 7 }); lebenOn(-9, SY, -66, .35, L, { eyes: 5 }); const hm = wpos(elias.aL.hand).lerp(wpos(mira.aR.hand), .5); const k = easeOut(clamp((L.lt - .3) / .6));
  for (const [b, dx] of [[BEAM[1], .9], [BEAM[2], -.9]]) { b.visible = k > 0; const tw = V(Math.sin(L.T * 20) * dx, Math.cos(L.T * 20) * dx, 0); b.userData.set(hm.clone().add(tw), hm.clone().lerp(V(-4, 9, -66), k).add(tw.multiplyScalar(-1)), 1.4, L.T); }
  BLOOMMAX = .35; if (k > 0) lp(3, 0, 10, JZ - 20, 260, 0xffffff, 60); cm([8, 4, JZ + 12, -2, 8, -54, 50], [5, 4.6, JZ + 8, -2, 8, -54, 46], L.k); sh(V(0, 0, JZ - 10), 40); }, [[0, 'riser_short', .5], [.3, 'zap', .9], [.35, 'fire_whoosh', .6], [.6, 'explosion', .5]]);
// 114 «Drei Sekunden lang»: el impacto: TODO se vuelve blanco y negro; las figuras de Tod y Leben se deshacen en luz; «3 SEKUNDEN»
shot(137.32, 'F', null, L => { festS(L); JUNG.visible = true; JUNG.userData.grow(1); BW = 1; BLOOMMAX = .4; const d = clamp(L.lt / .9);
  todOn(0, 0, TZ - 10, 0, L, { eyes: 7 }, 1 - d * .9); lebenOn(-9, SY, -66, .35, L, { eyes: 5 }, 1 - d * .9); EMB.burst(V(-4, 9, -60), L.t0, L.T, 0xffffff, 44, 16); grade.uniforms.flash.value = lerp(.9, 0, clamp(L.lt / .4));
  badge('big', '3 SEKUNDEN', W / 2, H * .2, clamp((L.lt - .2) / .2), 1, .9); cm([0, 8, -20, -4, 10, -62, 54], [0, 10, -26, -4, 10, -62, 52], L.k); sh(V(0, 0, -50), 40); }, [[0, 'explosion', .9], [.05, 'impact', .8], [.3, 'braam', .7]]);
// 115 «war der ganze Himmel»: vista de la ciudad desde lo alto, en blanco y negro, el cielo partido en dos (mitad negra, mitad blanca)
shot(138.26, 'W', null, L => { festS(L); JUNG.visible = true; JUNG.userData.grow(1); BW = 1; setSky([0, 0, 0], [.5, .5, .5], [1, 1, 1]); sun.intensity = 3.5;
  cm([-60, 50, 60, 0, 30, -60, 56], [-40, 60, 50, 0, 40, -60, 56], L.k); sh(V(0, 0, -30), 60); }, [[0, 'swipe', .4], [.1, 'hum_low', .6], [.4, 'wind', .6]]);
// 116 «nur noch schwarz und weiß.»: la gente de la plaza, en blanco y negro, mira al cielo con la boca abierta; nada se mueve
shot(139.28, 'Z', null, L => { festS(L); JUNG.visible = true; JUNG.userData.grow(1); BW = 1; crowdF(L, 12, { mode: 'shock', r0: 10, r1: 20, z: -24 }); POST.push(() => DX.forEach(c => { if (c.root.visible) c.head.rotation.x = -.5; }));
  cm([4, 3, 4, 0, 8, -24, 50], [2, 3.4, -2, 0, 9, -24, 50], L.k); sh(V(0, 0, -24), 40); }, [[0, 'zoom_in', .4], [.1, 'silence_tick', .6], [.5, 'heartbeat', .4]]);
// 117 «Als er wieder klar wurde,»: el color vuelve en una ola desde el centro; humo y plumas flotando
shot(140.83, 'F', null, L => { festS(L); JUNG.visible = true; JUNG.userData.grow(1 - L.k * .6); BW = 1 - easeOut(L.k); FEA.fall(V(0, 0, -50), L.T, 0xffffff, .6, 30, 16, 16); 
  cm([10, 8, -30, 0, 8, -62, 50], [6, 9, -36, 0, 8, -62, 48], L.k); sh(V(0, 4, -62), 30); }, [[0, 'flash', .4], [.1, 'wind', .5], [.4, 'chime', .5]]);
// 118 «waren Leben und Tod verschwunden.»: el escenario: donde estaban, sólo quedan dos marcas quemadas y la media guadaña en el suelo
shot(142.08, 'S', null, L => { festS(L); EMB.rise(V(0, SY, -64), L.T, 0xffd090, 20, 8, 24);
  cm([-6, 8, -40, 0, 6, -64, 50], [-2, 7.5, -45, 0, 6, -64, 48], L.k); sh(V(0, 4, -62), 26); }, [[0, 'swipe', .4], [.1, 'wind', .4], [.4, 'sad_tone', .3]]);
// 119 «Und der Bürgermeister versteckte sich»: Graf agachado detrás del atril, temblando, con el sombrero torcido
shot(143.92, 'C', 'punch', L => { festS(L); const g = put(graf, 0, SY, -62.6, 0); actuar(g, 0, [[0, { crouch: .9, lean: .3, aLx: 2.2, aRx: 2.2, aLe: 1.6, aRe: 1.6, headX: .2 }]], { T: L.T }); shiver(g, L.T); cara(g, L.T, { expr: 'shock', eyes: 'terror', mouth: 'grimace' }); sweat(g, L.T, 2);
  cm([6, 9, -72, 0, 5.5, -62, 46], [4, 8.4, -69, 0, 5.5, -62, 44], L.k); sh(V(0, 4, -62), 18); }, [[0, 'impact', .4], [.1, 'shiver', .5], [.4, 'gulp', .5]]);
// 120 «hinter seinem Rednerpult.»: de frente: sólo asoman los ojos y el sombrero por encima del atril, que tiembla
shot(145.24, 'R', null, L => { festS(L); const g = put(graf, 0, SY - .8, -62.6, 0); actuar(g, 0, [[0, { crouch: .7, aLx: 1.9, aRx: 1.9, aLe: 1.4, aRe: 1.4 }]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'terror', mouth: 'o' }); g.root.position.x = Math.sin(L.T * 40) * .06;
  cm([1.5, 8, -48, 0, 7, -61, 42], [.8, 7.6, -51, 0, 7, -61, 40], L.k); sh(V(0, 4, -62), 18); }, [[0, 'whirl', .4], [.2, 'shiver', .5], [.6, 'kids_laugh', .3]]);
// 121 «Meine besten Freunde falteten ihre Flügel zusammen»: Elias y Mira pliegan las alas a la vez, despacio; las plumas caen
shot(146.71, 'W', null, L => { festS(L); const f = 1 - easeInOut(clamp(L.lt / 1.6)); const e = pose(elias, -2.6, 0, JZ - 2.4, PI, L, { aLx: -.2, aRx: -.2, aLe: .5, aRe: .5 }, 'smug'); WE.visible = true; WE.userData.spread(f, L.T); REDEYE.forEach(r => r.visible = f > .3);
  const m = pose(mira, 3.4, 0, JZ - 1.6, PI, L, {}, 'happy'); miraWings(f, L.T, f > .2); HALO.scale.setScalar(Math.max(.01, f) * 1.2); GOLDEYE.forEach(g => g.visible = f > .3); FEA.fall(V(0, 0, JZ - 2), L.T, 0xffffff, .6, 16, 12, 12);
  orb(L.k, V(.4, 6, JZ - 2), null, [28, 0, .1, 50], [22, .3, .1, 48]); sh(V(0, 0, JZ), 24); }, [[0, 'swipe', .4], [.2, 'feathers', .6], [.6, 'cloth', .5], [1.2, 'whoosh_down', .4]]);
// 122 «und drehten sich um,»: se dan la vuelta hacia Jonas como si nada; Elias se mete las manos en los bolsillos
shot(148.95, 'R', null, L => { festS(L); const t = easeInOut(clamp(L.lt / .6)); pose(elias, -2.6, 0, JZ - 2.4, lerp(PI, .2, t), L, { aLx: -.25, aRx: -.25, aLe: .5, aRe: .5 }, 'smug', { mouth: 'smirk' }); pose(mira, 3.4, 0, JZ - 1.6, lerp(PI, -.2, t), L, { aLx: .2, aRx: .2 }, 'happy', { mouth: 'grin' });
  pose(jonas, 0, 0, JZ + 3, PI, L, {}, 'shock', { mouth: 'o' }); orb(L.k, V(0, 5, JZ), null, [20, PI - .5, .12, 46], [15, PI - .2, .1, 46]); sh(V(0, 0, JZ), 22); }, [[0, 'whirl', .4], [.1, 'steps', .4], [.4, 'whistle_inno', .5]]);
// 123 «als wäre nichts passiert.»: plano a la altura de Jonas: sus amigos delante, normales, saludando; detrás, la plaza destrozada
shot(150.09, 'F', null, L => { festS(L); JUNG.visible = true; JUNG.userData.grow(.4); pose(elias, -2.6, 0, JZ - 2.4, .2, L, { aLx: -.25, aRx: -.25, aLe: .5, aRe: .5 }, 'smug'); pose(mira, 3.4, 0, JZ - 1.6, -.2, L, { aRx: 2.6, aRz: .3 + Math.sin(L.T * 9) * .2, aRe: .3 }, 'happy', { mouth: 'grin' });
  cm([0, 6, JZ + 18, 0, 5, JZ - 2, 48], [0, 6, JZ + 14, 0, 5, JZ - 2, 46], L.k); sh(V(0, 0, JZ), 22); }, [[0, 'flash', .3], [.2, 'chime', .4]]);
// 124 «Du warst nie leer,»: Mira se acerca y le pone la mano en el pecho a Jonas, sonriendo con ternura
shot(151.46, 'C', null, L => { festS(L); const j = pose(jonas, 0, 0, JZ + 3, PI, L, {}, 'sad'); const m = pose(mira, 1.6, 0, JZ - .6, -.3 + PI * 0, L, { aRx: 1.3, aRe: .3, aRz: -.3 }, 'warm', { mouth: 'smile' }); m.root.rotation.y = faceTo(m.root.position, j.root.position); talk(m, L.T, 151.46, 152.6, 'warm');
  tears(j, L.T, 0); const c = hp(m).lerp(hp(j), .5); orb(L.k, c, null, [13, -1.3, .05, 42], [10, -1.05, .05, 40]); sh(V(0, 0, JZ), 16); }, [[0, 'impact', .2], [.1, 'strings', .5], [.4, 'sniff', .4]]);
// 125 «sagte Mira.»: primer plano de Mira, guiño
shot(152.61, 'S', null, L => { festS(L); const j = pose(jonas, 0, 0, JZ + 3, PI, L, {}, 'sad'); const m = pose(mira, 1.6, 0, JZ - .6, 0, L, { aRx: 1.3, aRe: .3, aRz: -.3 }, 'warm', { eyes: L.lt > .2 ? 'wink' : 'happy', mouth: 'grin' }); m.root.rotation.y = faceTo(m.root.position, j.root.position);
  onFace(m, 7.5, .4, 2.8, 40, L.k, 6); sh(V(0, 0, JZ), 16); }, [[0, 'swipe', .4], [.2, 'ding_soft', .4]]);
// 126 «Wir sind nur nie von deiner Seite gewichen,»: Elias le pasa el brazo por los hombros a Jonas; los tres juntos, los amigos a sus lados (como dos ángeles)
shot(153.09, 'Z', null, L => { festS(L); const j = pose(jonas, 0, 0, JZ + 3, 0, L, {}, 'happy', { mouth: 'open_smile' }); tears(j, L.T, 0); const e = pose(elias, -2.6, 0, JZ + 3, .15, L, { aRx: 1.8, aRz: -.9, aRe: .3 }, 'warm'); talk(e, L.T, 153.09, 155.2, 'warm'); pose(mira, 2.6, 0, JZ + 3, -.15, L, { aLx: 1.8, aLz: .9, aLe: .3 }, 'happy', { mouth: 'smile' });
  onBody(j, 22, 0, .1, 44, L.k, 15); sh(V(0, 0, JZ + 3), 20); }, [[0, 'zoom_in', .4], [.2, 'hug', .5], [.5, 'strings', .4]]);
// 127 «sagte Elias.»: Elias le revuelve el pelo a Jonas, sonrisa de verdad
shot(155.24, 'C', null, L => { festS(L); const j = pose(jonas, 0, 0, JZ + 3, 0, L, { headZ: Math.sin(L.T * 14) * .1 }, 'happy', { eyes: 'happy', mouth: 'laugh' }); const e = pose(elias, -2.4, 0, JZ + 3, .5, L, { aRx: 2.6, aRz: -.8, aRe: .4 + Math.sin(L.T * 14) * .2 }, 'happy', { mouth: 'grin' });
  const c = hp(j).lerp(hp(e), .5); orb(L.k, c, null, [11, .5, .05, 42], [8.5, .2, .05, 40]); sh(V(0, 0, JZ), 16); }, [[0, 'impact', .2], [.2, 'laugh_deep', .5], [.4, 'kids_laugh', .3]]);
// 128 «Also ja.»: Jonas mira a cámara y se encoge de hombros con una sonrisa enorme
shot(156.14, 'F', null, L => { festS(L); const j = pose(jonas, 0, 0, JZ + 3, 0, L, { aLx: .3, aRx: .3, aLz: -.5, aRz: -.5, aLe: 1.5, aRe: 1.5 }, 'happy', { mouth: 'grin' });
  onFace(j, 7, .2, 0, 40, L.k, 5.4); sh(V(0, 0, JZ), 16); }, [[0, 'flash', .3], [.2, 'ding_soft', .4]]);
// 129 «In dieser Welt hat jeder zwei Schutzengel.»: noche, la plaza recuperada: la gente con sus angelitos de dos en dos, farolillos; grúa subiendo
shot(156.77, 'W', null, L => { festS(L); crowdF(L, 20, { mode: i => ['talk', 'wave', 'cheer', 'clap'][i % 4], r0: 6, r1: 24, z: -24 }); confRain(V(0, 0, -24), L.T, 30, 40, 30, 18);
  cm([0, 5, 10, 0, 6, -30, 50], [0, 22, 20, 0, 4, -30, 52], L.k); sh(V(0, 0, -24), 44); }, [[0, 'swipe', .4], [.1, 'bells', .5], [.5, 'cheer', .4], [1.2, 'choir', .4]]);
// 130 «Meine tun nur so,»: los tres se alejan por la calle iluminada, de espaldas; Jonas en medio
shot(159.08, 'R', null, L => { town(L, { night: true }); for (const [c, x, i] of [[elias, -3.2, 1], [jonas, 0, 0], [mira, 3.2, 2]]) walk(c, L, x, 10, PI, 2.2, i, { expr: 'happy' });
  orb(L.k, V(0, 5, 10 - L.lt * 2.2), null, [16, .25, .15, 46], [20, 0, .2, 46]); sh(V(0, 0, 8), 24); }, [[0, 'whirl', .4], [.1, 'steps', .5], [.5, 'owl', .3]]);
// 131 «als wären sie meine besten Freunde.»: plano final: sus sombras alargadas en el suelo bajo la farola… las de Elias y Mira tienen alas
shot(160.10, 'Z', 'slow', L => { town(L, { night: true }); for (const [c, x, i] of [[elias, -3.2, 1], [jonas, 0, 0], [mira, 3.2, 2]]) walk(c, L, x, 4, PI, 1.8, i, { expr: 'happy' }); sun.intensity = 2.4;
  WE.visible = true; WE.userData.spread(1, L.T); WE.userData.ghost(true); WM.visible = true; WM.userData.spread(1, L.T); WM.userData.ghost(true); hemi.intensity = .25; FILL.intensity = 8; sun.intensity = 3.4; sun.color.setRGB(.8, .86, 1);
  sh(V(0, 0, 0), 30); sun.position.set(0, 12, 40); sun.target.position.set(0, 0, -10); cm([0, 22, 14, 0, 0, -8, 50], [0, 26, 18, 0, 0, -10, 54], L.k); }, [[0, 'zoom_in', .3], [.2, 'whoosh_magic', .5], [.6, 'lullaby', .4], [1.4, 'ding_reveal', .6]]);
// ---------- portadas (fuera del vídeo; node cover.mjs) ----------
// 1: la plaza de Lichtenau al atardecer: todos los vecinos con sus dos angelitos señalan a Jonas, en el centro, el único sin ángeles (círculo rojo). «JEDER HAT 2 ENGEL… NUR ICH NICHT»
// 2: noche: Jonas en el centro con Elias (alas negras, ojos rojos) y Mira (ocho alas de luz, aureola en llamas) a los lados, como sus dos ángeles. «MEINE BESTEN FREUNDE… SIND MEINE ENGEL»
function strokeTxt(t, x, y, size, font, fill, stroke, lw, rot = 0, maxW = W * .9) { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(t).width, k = Math.min(1, maxW / tw); c.scale(k, k); c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 26; c.shadowOffsetY = 10; c.lineWidth = lw; c.strokeStyle = stroke; c.strokeText(t, 0, 0); c.shadowColor = 'transparent';
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size / 2, 0, size / 2); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function finishCover() { grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; bloom.strength = .14; bloom.threshold = .88; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); ao.enabled = true; bokeh.enabled = false; composer.render(); ao.enabled = false; octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.imageSmoothingQuality = 'high'; octx.drawImage(renderer.domElement, 0, 0, W, H); }
function ringMark(x, y, rx, ry, col = '#ff1a2e') { const c = octx; c.save(); c.lineWidth = 18; c.strokeStyle = col; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 14; c.beginPath(); c.ellipse(x, y, rx, ry, -.06, .25, 6.05); c.stroke(); c.restore(); }
function sparkle2(x, y, r, col = '#fff6c0') { const c = octx; c.save(); c.translate(x, y); c.fillStyle = col; c.shadowColor = col; c.shadowBlur = 20; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * .28 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); c.fill(); c.restore(); }
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita'); out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high';
  const T = 30.3, L = { T, lt: .8, k: 1, t0: 29.5, t1: 31, d: 1.5 }; hideAll(); BAD_.length = 0; FX2D.length = 0; DOF = 0;
  if (v === 0) { town(L, { dusk: true }); sun.intensity = 2.6; const p = V(0, 0, 0);
    const j = put(jonas, 0, 0, 0, 0); actuar(j, 0, [[0, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, aLz: -.3, aRz: -.3, crouch: .05 }]], { T }); cara(j, T, { expr: 'sad', eyes: 'worried', mouth: 'grimace', noBlink: 1 }); sweat(j, T, 1);
    [[-7.5, -3], [7.5, -3], [-11, 3.5], [11, 3.5], [-4, -9], [4.5, -9.5]].forEach(([x, z], i) => { const c = put(DX[i + 2], x, 0, z, 0); c.root.rotation.y = faceTo(c.root.position, j.root.position); actuar(c, 0, [[0, { ...POINT, aRx: 1.5 }]], { T }); cara(c, T, { expr: 'sus', mouth: i % 2 ? 'o' : 'grimace', noBlink: 1 }); engel(c, ...NP[i], T, { s: 1.05, look: 0 }); });
    cam([0, 7.4, 23], [0, 4, 0], 50); sh(V(0, 0, 0), 34); finishCover();
    strokeTxt('JEDER HAT', W / 2, H * .15, 112, 'Lilita', ['#ffffff', '#ffe8c0'], '#3a1400', 26);
    strokeTxt('2 SCHUTZENGEL', W / 2, H * .22, 128, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 30, -.02);
    const hd = proj(hp(j).add(V(0, .4, 0))), ft = proj(V(0, 0, 0)); ringMark(hd[0], (hd[1] + ft[1]) / 2 - 20, 150, (ft[1] - hd[1]) / 2 + 105);
    strokeTxt('NUR ICH NICHT…', W / 2, H * .8, 110, 'Lucky', ['#ffffff', '#ffd0d0'], '#4a0010', 26, -.02);
    sparkle2(W * .1, H * .3, 26); sparkle2(W * .9, H * .28, 22);
  } else { town(L, { night: true }); sun.intensity = 1.2; lp(0, 0, 10, 8, 60, 0xffd090, 40); lp(1, 8, 8, 4, 60, 0xfff0c0, 30); lp(2, -8, 8, 4, 50, 0xb07aff, 30);
    const j = put(jonas, 0, 0, 1, 0); actuar(j, 0, [[0, { aLx: .3, aRx: .3, headY: .2 }]], { T }); cara(j, T, { expr: 'shock', eyes: 'wide', mouth: 'o', noBlink: 1 });
    const e = put(elias, -6.4, 0, -1.4, .25); actuar(e, 0, [[0, { aLx: .3, aRx: .3, aLz: .4, aRz: .4 }]], { T }); cara(e, T, { expr: 'smug', mouth: 'smirk', noBlink: 1 }); eliasWings(1, T);
    const m = put(mira, 6.4, 0, -1.4, -.25); actuar(m, 0, [[0, { aLx: .5, aRx: .5, aLz: .6, aRz: .6 }]], { T }); cara(m, T, { expr: 'determined', mouth: 'smile', noBlink: 1 }); miraWings(1, T, true); HALO.scale.setScalar(1.2); HALO.userData.anim(T);
    FEA.fall(V(0, 0, 0), T, 0xffffff, .6, 26, 18, 14); EMB.rise(V(6.4, 0, -1.4), T, 0xffb040, 8, 12, 24);
    cam([0, 6.6, 27], [0, 5.6, -1], 50); sh(V(0, 0, 0), 34); finishCover();
    strokeTxt('MEINE BESTEN FREUNDE', W / 2, H * .15, 96, 'Lilita', ['#ffffff', '#e0d8ff'], '#14063a', 24);
    strokeTxt('SIND ENGEL?!', W / 2, H * .22, 140, 'Lucky', ['#fff2a0', '#f0a820'], '#3a2400', 30, -.02);
    const hd = proj(hp(j).add(V(0, .4, 0))), ft = proj(V(0, 0, 1)); ringMark(hd[0], (hd[1] + ft[1]) / 2 - 20, 130, (ft[1] - hd[1]) / 2 + 100);
    strokeTxt('UND ICH WUSSTE NICHTS', W / 2, H * .8, 92, 'Lucky', ['#ffffff', '#ffd0d0'], '#4a0010', 24, -.02);
    sparkle2(W * .12, H * .32, 24); sparkle2(W * .88, H * .3, 26); } };


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
  if (HQ) { renderer.toneMappingExposure *= +(QS.get('exp') ?? .85); grade.uniforms.sat.value = +(QS.get('sat') ?? 1.38); grade.uniforms.sharp.value = .6; grade.uniforms.vig.value = Math.min(grade.uniforms.vig.value, .32); bloom.strength = Math.min(Math.max(bloom.strength, .14), BLOOMMAX); bloom.threshold = .88; ao.enabled = QS.get('ao') !== '0'; DOF = 1; }
  if (BW > 0) { grade.uniforms.sat.value *= 1 - BW; grade.uniforms.sharp.value += BW * .6; }
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
window.DBG = { applyPose, hp, jonas, elias, mira, cam, renderer, composer, bloom, sun, grade, scene, camera, TOD, LEBEN, WE, WM };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

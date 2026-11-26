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
const WE = bigWings({ col: 0x100e16, col2: 0x1e1a2a, em: 0x3a0a6a, glow: .35, size: 1.05, metal: .3 }), WM = bigWings({ pairs: 4, col: 0xffffff, col2: 0xfff4d8, em: 0xfff0c0, glow: .45, size: .78, rough: .4, metal: 0 });
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

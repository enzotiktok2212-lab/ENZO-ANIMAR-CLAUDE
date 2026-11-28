// WUNSCH — «In dieser Stadt darf sich jeder, der morgens als Erster aufwacht, für diesen Tag alles wünschen, was er will.»
// Ich (12) soy el que duerme más profundo; Herr Graufeld se despierta a medianoche y desea ruido toda la noche para ganar siempre;
// con tanto ruido solo yo puedo dormirme… y mi hermana Mia (5) me despierta a las 0:00 en punto.
// Ciudad propia: Sternau (Altstadt de entramado, Marktplatz con la torre de San Nikolaus). Motor y look: los de ebbe (cielo con nubes, AgX/neutral, DOF).
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { rimLight } from './roblox.js';
import { FONT, bench, fountain, washer } from './props.js';
import { skyDome, SKIES, applySky, skyEnvs, schild, bake } from './ebwelt.js';
import { roestheim, salon, kellerO, fachwerkHaus } from './kwelt.js';
import { kinderzimmer, schlafzimmer, kueche, wecker } from './swelt.js';
import { baeckerei } from './gort.js';
import { tramIn } from './fsets.js';
import { sportsCar, bus } from './pech.js';
import { bike } from './asets.js';
import { car } from './engwelt.js';
import { dackel } from './stwelt.js';
import { kuchen } from './kaffee.js';
import { kirchturm, kuerbis, hahn, schaf, liebesbrief, bundle, geldberg, stoepsel, uhr, pritsche, omaGarten, stoepselLaden, sparkles, glowM } from './wwelt.js';
import { makeIch, makeIchT, makeMia, makeMiaT, makeOma, makeMama, makePapa, makeGraufeld, makeEmma, makeBen, makeLea, makeBecker } from './wvolk.js';
import { makeFriseurin, makeBaecker, makeJugend } from './kvolk.js';
import { makeBusDriver } from './pech.js';
import { makeKind } from './stvolk.js';
import { makeSchlaefer } from './svolk.js';
import { makeExtra } from './ecast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = window.__TESTDUR ?? 176.0, U = W / 720, PI = Math.PI;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe0f0, .0004);
const QS = new URLSearchParams(location.search); const HQ = QS.get('hq') !== '0';
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 30000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = QS.get('ao') === '1';
const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: .0008, maxblur: .012 }); composer.insertPass(bokeh, 2); let DOF = 1;
let CAMT = new THREE.Vector3(); { const la = camera.lookAt.bind(camera); camera.lookAt = (...a) => { if (a.length === 3) CAMT.set(...a); else CAMT.copy(a[0]); la(...a); }; }
const SS = +(QS.get('ss') ?? 1.0); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
renderer.toneMapping = { agx: THREE.AgXToneMapping, aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping }[QS.get('tm') ?? 'neutral'];
const ENVS = skyEnvs(renderer); const ROOMENV = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
const SKY = skyDome(); scene.add(SKY);
const hemi = new THREE.HemisphereLight(0xdfeeff, 0xb89a70, 1.0); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 3); sun.castShadow = true; const SMS = +(QS.get('sm') ?? 2048); sun.shadow.mapSize.set(SMS, SMS); sun.shadow.bias = -.0002; sun.shadow.normalBias = .08; sun.shadow.radius = 1.5; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
const LP = Array.from({ length: 4 }, () => { const l = new THREE.PointLight(0xffb060, 0, 60, 1.6); scene.add(l); return l; });
let SHR = 70, SHC = null; function sh(p0, s = 40) { SHR = s; const q = 2 * s / SMS * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 1400 }); c.updateProjectionMatrix();
  sun.target.position.copy(p); sun.position.copy(p).addScaledVector(SUND, 500); rim.target.position.copy(p); rim.position.copy(p).add(V(-SUND.x * 100, 60, -SUND.z * 100)); }
const SUND = V(-.35, .62, -.7).normalize();
const OLF = HQ ? 0 : 1; const OC = 3 * SS * OLF, OS = 2.2 * SS * OLF, OP = 1.8 * SS * OLF;
// ---------- escenarios ----------
// Sternau (x = 0): plaza z ∈ [-90, 70], x ∈ [-46, 46]; casas con fachada en x = ±47; fila del fondo z = -108; fuente en (0, -8);
//   torre de San Nikolaus en (0, -86) mirando +z (campana a y ≈ 66, reloj y = 44); banco del final en (0, -64) mirando +z.
//   Carretera/Lindenstraße: x ∈ [-14, 14], z de 100 a 760; casas a x = ±30 mirando a la calle; tienda de Graufeld en (30, 170) mirando -x.
// Interiores en X separadas: mi cuarto KZ, cuarto de niños LZ, dormitorio de matrimonio SZ, cuarto de Lea MZ, dormitorio de Oma OZ, cocina KU,
//   sótano KE, peluquería SA, panadería BA, bus BU; huerto de Oma GA.
const KZX = 2400, LZX = 3000, SZX = 3600, MZX = 4200, OZX = 4800, KUX = 5400, KEX = 6000, SAX = 6600, BAX = 7200, BUX = 7800, GAX = 8600;
const TOWN = roestheim(scene, { noKanne: true, name: 'STERNAU', domCafe: 'CAFÉ STERN', cafeN: ['CAFÉ STERN', 'EISCAFÉ VENEZIA', 'CAFÉ AM MARKT', 'KONDITOREI LANG', 'CAFÉ SCHÖN', 'MILCHBAR', 'CAFÉ NIKOLAUS', 'TEESTUBE'], shopN: ['BÄCKEREI', 'BLUMEN', 'APOTHEKE', 'BUCHLADEN', 'FRISEUR', 'METZGEREI', 'SPIELWAREN', 'SPARKASSE'] });
const TG = TOWN.g; fountain(TG, 0, -8);
const TURM = kirchturm(TG, 0, -86); bench(TG, 0, -64, 0); const BANK = TG.children[TG.children.length - 1];
for (let k = 0; k < 6; k++) { fachwerkHaus(TG, -30, 128 + k * 20, 18, 2 + k % 2, k + 4, PI / 2, k % 3 === 1 ? { shop: ['KIOSK', 'SCHUHE', 'OPTIKER'][k % 3] } : {}); if (k !== 2) fachwerkHaus(TG, 30, 128 + k * 20, 18, 2 + (k + 1) % 2, k + 9, -PI / 2, {}); }
const LADEN = stoepselLaden(TG, 30, 168, -PI / 2);
const KZ = kinderzimmer(scene, KZX), LZ = kinderzimmer(scene, LZX, { lena: true }), SZ = schlafzimmer(scene, SZX);
const MZ = schlafzimmer(scene, MZX, { wall: '#d8f0e8', wall2: '#c8e4dc', quilt: ['#7a3ac8', '#f4f4f4', '#3a3a42', '#d8c8f4'], curtain: '#7a3ac8' });
const OZ = schlafzimmer(scene, OZX, { wall: '#f4e0e8', wall2: '#ead0dc', quilt: ['#5a7a3a', '#f4e8d0', '#e8586a', '#d8c8a0'], curtain: '#5a7a3a' });
const KU = kueche(scene, KUX), KE = kellerO(scene, KEX), SA = salon(scene, SAX, { name: 'SALON STERNAU' }), BA = baeckerei(scene, BAX), BU = tramIn(scene, BUX), GA = omaGarten(scene, GAX);
const PRI = pritsche(KE.g); PRI.position.set(6, 0, -2); PRI.rotation.y = .3;
const GELD = geldberg(MZ.g, 7, 4, 26); GELD.position.set(9, 0, -6);
for (let k = 0; k < 6; k++) for (const s of [-1, 1]) { box(2.8, .5, 2.4, mat(0x2a6ad8, { roughness: .7 }), .15, BU.g, s * 2.9, 2.4, -15 + k * 6); box(2.8, 2.8, .4, mat(0x2a6ad8, { roughness: .7 }), .1, BU.g, s * 2.9, 3.9, -16.2 + k * 6); }
// unir la geometría estática (miles de mallas -> pocas llamadas de dibujo); lo que se mueve queda fuera
TURM.BELL.userData.keep = true; TOWN.TRAM.userData.keep = true; GA.CAL.forEach(k => k.userData.keep = true); for (const R of [KZ, LZ]) { R.DOOR.userData.keep = true; R.CLOCK.userData.keep = true; } for (const R of [KZ, LZ, SZ, MZ, OZ]) R.quilt.userData.keep = true;
if (QS.get('bake') !== '0') for (const g of [TG, KZ.g, LZ.g, SZ.g, MZ.g, OZ.g, KU.g, KE.g, SA.g, BA.g, BU.g, GA.g]) bake(g);
const SETS = { TOWN: TG, KZ: KZ.g, LZ: LZ.g, SZ: SZ.g, MZ: MZ.g, OZ: OZ.g, KU: KU.g, KE: KE.g, SA: SA.g, BA: BA.g, BU: BU.g, GA: GA.g };
for (const k in SETS) outline(SETS[k], OS);
// ---------- reparto ----------
const ich = makeIch(scene), ichT = makeIchT(scene), mia = makeMia(scene), miaT = makeMiaT(scene), oma = makeOma(scene), mama = makeMama(scene), papa = makePapa(scene), grau = makeGraufeld(scene);
const emma = makeEmma(scene), ben = makeBen(scene), lea = makeLea(scene), becker = makeBecker(scene), fris = makeFriseurin(scene), baeck = makeBaecker(scene), fahrer = makeBusDriver(scene);
const JUNG = [0, 1, 2, 3].map(i => makeJugend(scene, i)), KIDS = [0, 1, 2, 3].map(i => makeKind(scene, i));
kitFace(ich, 'kid'); kitFace(ichT, 'kid'); kitFace(mia, 'girl'); kitFace(miaT, 'girl'); [oma, mama, emma, lea, fris].forEach(c => kitFace(c, 'girl')); kitFace(papa, 'hero'); kitFace(grau, 'villain'); kitFace(ben, 'hero');
[becker, baeck, fahrer].forEach(c => kitFace(c, 'mustache')); JUNG.forEach((c, i) => kitFace(c, i % 2 ? 'hero' : 'kid')); KIDS.forEach(c => kitFace(c, 'kid'));
const SL = Array.from({ length: 30 }, (_, i) => { const c = makeSchlaefer(scene, i); kitFace(c, c.kid ? 'kid' : c.girl ? 'girl' : ['plain', 'mustache', 'hero'][i % 3]); return c; });
const EX = Array.from({ length: 20 }, (_, i) => { const c = makeExtra(scene, i + 40); kitFace(c, ['girl', 'plain', 'girl', 'hero', 'girl', 'mustache'][i % 6]); return c; });
const MAIN = [ich, ichT, mia, miaT, oma, mama, papa, grau, emma, ben, lea, becker, fris, baeck, fahrer, ...JUNG, ...KIDS];
const POOL = [...MAIN, ...SL, ...EX];
POOL.forEach(c => outline(c.root, OC));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(.5, 'rgba(0,0,0,.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const PROPS = [];
const P_ = o => { if (!o.parent) scene.add(o); PROPS.push(o); return o; };
const WK = Array.from({ length: 14 }, () => P_(wecker(scene)));
const PORSCHE = P_(sportsCar(scene)), BUS = P_(bus(scene, 0xe8c020, '7')), BIKE = P_(bike(scene, 0xff5a9a, .7)), CARS = [0x2a6ad8, 0xd8323a].map(c => P_(car(scene, c)));
const DOGS = [0, 1, 2].map(() => P_(dackel(scene))), HAHN = P_(hahn(scene)), SHEEP = Array.from({ length: 6 }, () => P_(schaf(scene)));
const KUCHEN = P_(kuchen(scene, { s: 1.4 })); const CANDLES = P_(new THREE.Group()); for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; cyl(.07, .07, .7, mat([0xff5a8a, 0x3ab8f0, 0xffd23f][k % 3]), 6, CANDLES, Math.cos(a) * 1.4, .35, Math.sin(a) * 1.4); sphere(.12, glowM(0xffb040, 3), CANDLES, Math.cos(a) * 1.4, .8, Math.sin(a) * 1.4, 6, 4); }
const LETTERS = Array.from({ length: 24 }, () => P_(liebesbrief(scene))), BUNDLES = Array.from({ length: 16 }, () => P_(bundle(scene))), PLUGS = Array.from({ length: 8 }, (_, i) => P_(stoepsel(scene, 1, [0xff8a1a, 0xffd23f][i % 2])));
const WASH = P_(washer(scene)), UHR = P_(uhr(scene)), KUERB = Array.from({ length: 3 }, (_, i) => P_(kuerbis(scene, 1)));
const FLOW = P_(new THREE.Group()); { cyl(.08, .14, 1.6, mat(0x3a8a3a), 6, FLOW, 0, .4, 0); for (let k = 0; k < 7; k++) { const a = k / 7 * 6.28; sphere(.3, mat([0xe8325a, 0xffd23f, 0xff8ad0][k % 3], { roughness: .7 }), FLOW, Math.cos(a) * .35, 1.35 + (k % 2) * .15, Math.sin(a) * .35, 8, 6); } }
const SCH = P_(schild(null, ['ZU VERKAUFEN', 'GRAUFELD'], 0, 0, 0, 0, 8, 3.6, { bg: '#f4f0e4', ink: '#c8202a', frame: 0x4a4a52, posts: true }));
const SPK = sparkles(scene, 34);
const DUST = Array.from({ length: 24 }, () => P_(sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 8, 6)));
const SWEAT = Array.from({ length: 3 }, () => P_(sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const TEAR = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8)));
const CONF = Array.from({ length: 40 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xffd23f, 0xffffff, 0x3a7ad8, 0xff4a8a, 0x8ad84a][i % 5], side: THREE.DoubleSide })); p.userData.noOutline = true; return P_(p); });
const FW = Array.from({ length: 48 }, (_, i) => { const s = sphere(.35, glowM([0xff4a6a, 0xffd23f, 0x6ad8ff, 0x8aff6a][i % 4], 4), scene, 0, 0, 0, 6, 4); s.userData.noOutline = true; return P_(s); });
const NOTEW = Array.from({ length: 10 }, (_, i) => { const p = textPlane(1.6, 1.6, 64, 64, (c, w, h) => { c.fillStyle = '#fff'; c.strokeStyle = '#1a2a4a'; c.lineWidth = 6; c.font = `700 54px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; const s = ['♪', '♫', '!', '♪', '!!'][i % 5]; c.strokeText(s, w / 2, h / 2); c.fillText(s, w / 2, h / 2); }); p.material.transparent = true; p.material.depthWrite = false; p.userData.noOutline = true; return P_(p); });
// ---------- ambiente ----------
const AIR = aire(scene, 300);
let MODE = 'day', SKYK = 'day';
function setSky(k, sunI = 3) { SKYK = k; applySky(SKY.material, k); const s = SKIES[k]; SUND.set(...s[3]).normalize(); sun.color.setRGB(...s[4]); sun.intensity = sunI; if (HQ) { scene.environment = ENVS[k]; scene.environmentIntensity = 1; }
  scene.fog.color.setRGB(...s[2]); }
function day(k = 'day') { MODE = 'day'; setSky(k, k === 'noon' ? 3.4 : 3.1); renderer.toneMappingExposure = 1.0; hemi.intensity = .9; hemi.color.setRGB(.8, .88, 1); hemi.groundColor.setRGB(.72, .6, .44); rim.intensity = 1.2; rim.color.setRGB(1, .94, .84);
  scene.fog.density = .0006; bloom.strength = .12; bloom.threshold = .95; FILL.intensity = 0; }
function dawn() { day('dawn'); sun.intensity = 2.6; hemi.intensity = .75; hemi.color.setRGB(.9, .74, .8); rim.color.setRGB(1, .62, .4); scene.fog.density = .0009; bloom.strength = .2; bloom.threshold = .88; }
function dusk() { day('dusk'); sun.intensity = 2.4; hemi.intensity = .7; hemi.color.setRGB(.9, .7, .8); rim.color.setRGB(1, .55, .35); scene.fog.density = .0009; bloom.strength = .22; bloom.threshold = .86; }
function night(fill = 30) { MODE = 'night'; setSky('night', .8); renderer.toneMappingExposure = 1.08; hemi.intensity = .62; hemi.color.setRGB(.45, .6, 1); hemi.groundColor.setRGB(.2, .18, .28); rim.intensity = 1.1; rim.color.setRGB(.7, .82, 1);
  scene.fog.density = .0016; bloom.strength = .36; bloom.threshold = .72; FILL.intensity = fill; FILL.color.setRGB(1, .86, .7); }
function inside(h = 1.0, fill = 40) { MODE = 'in'; setSky('day', 0); if (HQ) { scene.environment = ROOMENV; scene.environmentIntensity = .35; } renderer.toneMappingExposure = 1.0; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .5; bloom.strength = .2; bloom.threshold = .88; scene.fog.density = .0001; FILL.intensity = fill; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.blob.visible = true; c.aR.sh.rotation.y = 0; c.aL.sh.rotation.y = 0; }
  for (const p of PROPS) { p.visible = false; p.rotation.order = 'XYZ'; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  SPK.hide(); SPK.S.forEach(s => s.material.color.setHex(0xfff2a0)); HAHN.userData.crow(0); GA.CAL.forEach((k, i) => { k.scale.setScalar(1); k.rotation.set(0, k.userData.ry ?? (k.userData.ry = k.rotation.y), 0); k.position.z = k.userData.z ?? (k.userData.z = k.position.z); }); GELD.userData.setH(1); TURM.BELL.rotation.set(0, 0, 0); TURM.BL.intensity = 0; TURM.setClock(11, 57); LADEN.g.visible = true;
  for (const R of [KZ, LZ]) { R.quilt.position.y = 3.9; R.quilt.position.z = 2.6; R.quilt.scale.set(1, 1, 1); R.CLOCK.visible = true; R.DOOR.rotation.y = 0; } for (const R of [SZ, MZ, OZ]) { R.quilt.position.set(0, 3.9, 2.6); R.quilt.scale.set(1, 1, 1); }
  for (const k in SETS) SETS[k].visible = false; FX2D.length = 0; for (const l of LP) l.intensity = 0;
  FILL.color.setRGB(1, .96, .91); grade.uniforms.vig.value = .35; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = +(QS.get('sat') ?? 1.18); grade.uniforms.con.value = +(QS.get('con') ?? .2); grade.uniforms.warm.value = +(QS.get('warm') ?? .7); grade.uniforms.sharp.value = .5; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; SHAKE = 0; DOF = 1; BW = 0; BLOOMMAX = .3; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
function cam(p, t, fov = 50) { CAMT.set(...t); camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
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
const sleepF = (ch, T) => ch.setFace({ eyes: 'closed', mouth: Math.sin(T * 2.2 + ch.seed) > .3 ? 'o' : 'wavy' });
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
const tears = (ch, T, slot = 0) => { const h = hp(ch), s = ch.spec.scale || 1, a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a); for (let i = 0; i < 2; i++) { const k = (T * 1.1 + i * .5) % 1, sd = i ? -.3 : .3; const t = TEAR[slot * 2 + i]; t.visible = true; t.position.set(h.x + (fz * sd + fx * .68) * s, h.y + (.72 - k * 1.0) * s, h.z + (-fx * sd + fz * .68) * s); t.scale.setScalar(s); } };
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.5 + t * 1.4) * s * (.8 + r() * .5)); d.material.opacity = .4 * (1 - t / 1.2); }); }
function confetti(c, T0, T, n = 40, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function fireworks(c, T, n = 4, r = 14) { FW.forEach((s, i) => { const b = i % n, q = RNG(b * 11 + 2), ph = ((T * .7 + b / n) % 1); const cx = c.x + (q() - .5) * r * 2, cy = c.y + q() * r * .6, cz = c.z + (q() - .5) * r * .5, a = (i / FW.length) * 6.283 * 3 + b, rad = ph * r * .5; s.visible = ph > .05 && ph < .9; s.position.set(cx + Math.cos(a) * rad, cy + Math.sin(a * 1.3) * rad - ph * ph * 3, cz + Math.sin(a) * rad * .4); s.scale.setScalar(1 - ph); }); }
function notesFX(c, T, n = 6, sc = 1) { for (let i = 0; i < n; i++) { const p = NOTEW[i]; if (!p) return; const k = (T * .8 + i / n) % 1; p.visible = true; p.position.set(c.x + Math.sin(i * 2.3 + T) * 2 * sc, c.y + k * 6 * sc, c.z + Math.cos(i * 1.7) * .8 * sc); p.scale.setScalar(sc * (.5 + Math.sin(k * PI) * .8)); p.material.opacity = Math.sin(k * PI); p.lookAt(camera.position); } }
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));
const walkP = (T, i) => { const p = Math.sin(T * 9 + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
const runP = (T, i) => { const p = Math.sin(T * 13 + i); return { aLx: p * 1.1, aRx: -p * 1.1, aLe: 1.3, aRe: 1.3, lLx: -p * .9, lRx: p * .9, lLk: .3 + Math.max(0, p) * 1.1, lRk: .3 + Math.max(0, -p) * 1.1, lean: .25, headX: -.15 }; };
const sitPose = (extra = {}) => ({ lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, ...extra });
const sitY = (c, seat) => seat + .1 - 2.05 * (c.spec.scale || 1);
function sit(c, x, seat, z, ry, L, pose = {}) { put(c, x, sitY(c, seat), z, ry); actuar(c, 0, [[0, sitPose(pose)]], { T: L.T, weight: false }); c.blob.visible = false; return c; }
// tumbado boca arriba con la cabeza en la almohada (x, zP); top = altura del colchón
function lie(ch, x, zP, top = 4.15, L = null, pose = {}) { const s = ch.spec.scale || 1; put(ch, x, top + .55 * s, zP + 4.6 * s, 0); ch.root.rotation.x = -PI / 2; ch.blob.visible = false; actuar(ch, 0, [[0, { aLz: .12, aRz: .12, ...pose }]], { T: L ? L.T : 0, weight: false }); return ch; }
// incorporarse en la cama: up 0 (tumbado) → 1 (sentado); seat = altura del colchón
function riseBed(ch, x, zP, up, L, pose = {}, top = 4.15) { const s = ch.spec.scale || 1; lie(ch, x, zP, top, L); ch.root.rotation.x = -PI / 2 + up * PI / 2; ch.root.position.y = lerp(top + .55 * s, sitY(ch, top - .2), up); ch.root.position.z = lerp(zP + 4.6 * s, zP + 1.2, up);
  actuar(ch, 0, [[0, { lLx: 1.5 * up, lRx: 1.5 * up, aLz: .12, aRz: .12, ...pose }]], { T: L.T, weight: false }); return ch; }
function zzz(ch, T, k = 1) { FX2D.push(c => { const [x, y, z] = proj(hp(ch).add(V(0, 1.6 * (ch.spec.scale || 1), 0))); if (z >= 1) return; for (let i = 0; i < 3; i++) { const t = (T * .6 + i / 3) % 1; c.save(); c.globalAlpha = Math.sin(t * PI) * k; c.translate(clamp(x + 40 + t * 90, 80, W - 80), clamp(y - 30 - t * 160, 120, H * .64)); c.font = `700 ${(46 + t * 40) * U}px ${FONT}`; c.textAlign = 'center'; c.lineWidth = 10; c.strokeStyle = '#0e1226'; c.strokeText('Z', 0, 0); c.fillStyle = '#9ad8ff'; c.fillText('Z', 0, 0); c.restore(); } }); }
// ondas de ruido (2D) alrededor de un punto 3D
function noiseFX(p3, T, k = 1, col = '#ffd23f') { FX2D.push(c => { const [x, y, z] = proj(p3); if (z >= 1) return; c.save(); c.translate(x, y); c.strokeStyle = col; c.lineCap = 'round'; for (let i = 0; i < 3; i++) { const t = (T * 1.6 + i / 3) % 1; c.globalAlpha = (1 - t) * k; c.lineWidth = 12 * U * (1 - t * .5); for (const s of [-1, 1]) { c.beginPath(); c.arc(0, 0, (60 + t * 160) * U, s > 0 ? -.6 : PI - .6, s > 0 ? .6 : PI + .6); c.stroke(); } } c.restore(); }); }
const clockAt = (w, txt, col = '#ff4a3a') => { w.userData.set(txt, col); return w; };
// ---------- gente ----------
const CR = EX, CRN = SL;
function crowdAt(L, cx, cz, n, r0, r1, seed = 1, o = {}) { POST.push(() => { const list = (o.list || CR).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc_ = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.2), ac + 6.283 - (o.gap ?? 1.2)];
  const placed = o.avoid ? [...o.avoid] : [];
  list.forEach((c, i) => { let x, z, tries = 0; do { const a = arc_[0] + (i + r() * .8) / list.length * (arc_[1] - arc_[0]); const d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; tries++; } while (tries < 10 && placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 3.6));
    placed.push([x, z]); crowdGuy(c, x, z, L, i, o); }); }); }
function crowdBox(L, x0, x1, z0, z1, n, seed = 1, o = {}) { POST.push(() => { const list = (o.list || CR).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); const r = RNG(seed); const placed = o.avoid ? [...o.avoid] : [];
  list.forEach((c, i) => { let x, z, tries = 0; do { x = lerp(x0, x1, (i + r()) / list.length); z = lerp(z0, z1, r()); tries++; } while (tries < 10 && placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 3.4)); placed.push([x, z]); crowdGuy(c, x, z, L, i, o); }); }); }
function crowdGuy(c, x, z, L, i, o) { const T = L.T + i * .37, face = o.face || camera.position; let ry = typeof o.ry === 'function' ? o.ry(i) : o.ry ?? (Math.atan2(face.x - x, face.z - z) + Math.sin(i * 7.3) * (o.jit ?? .35));
  put(c, x, o.y ?? 0, z, ry); const m = typeof o.mode === 'function' ? o.mode(i) : o.mode;
  if (m === 'walk' || m === 'run') { const run = m === 'run', d = (o.speed ?? (run ? 9 : 2.2)) * L.lt, a = ry + (o.dir ?? 0); c.root.rotation.y = a; c.root.position.x += Math.sin(a) * d; c.root.position.z += Math.cos(a) * d; c.root.position.y = (o.y ?? 0) + Math.abs(Math.sin(L.T * (run ? 13 : 9) + i)) * (run ? .35 : .12); actuar(c, 0, [[0, run ? runP(L.T, i) : walkP(L.T, i)]], { T: L.T }); cara(c, T, { expr: o.expr || (run ? 'shock' : 'neutral'), mouth: run ? 'o' : undefined }); }
  else if (m === 'talk') { actuar(c, 0, [[0, { aRx: .9 + Math.sin(L.T * 3 + i) * .3, aRz: .2, aRe: 1.2, aLx: .3, headY: Math.sin(L.T * .8 + i) * .4 }]], { T: L.T }); cara(c, T, { expr: 'happy', mouth: Math.sin(L.T * 9 + i) > 0 ? 'talk' : 'smile' }); }
  else if (m === 'shock') { actuar(c, 0, [[0, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9, lean: -.08, headX: -.06 }]], { T: L.T }); cara(c, T, { expr: 'shock', mouth: i % 2 ? 'o' : 'grimace' }); }
  else if (m === 'point') { actuar(c, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: .5, aLz: -.6, aLe: 1.5, lean: -.08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'shock', mouth: 'o' }); }
  else if (m === 'cheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); c.root.position.y = (o.y ?? 0) + j * .45 * (c.spec.scale || 1); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3, crouch: .05 + j * .08 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'wave') { actuar(c, 0, [[0, 'wave']], { T: L.T }); cara(c, T, { expr: 'happy', mouth: 'open_smile' }); }
  else if (m === 'clap') { const j = Math.sin(L.T * 14 + i); actuar(c, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.2 - j * .25, aRz: -.2 - j * .25, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); cara(c, T, { expr: 'joy' }); }
  else if (m === 'look') { actuar(c, 0, [[0, { headX: -.15, aLx: .2, aRx: .2, headY: Math.sin(L.T * .7 + i) * .15 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'happy', mouth: o.mouth || (i % 3 ? 'smile' : 'o') }); }
  else if (m === 'ears') { const j = Math.sin(L.T * 6 + i) * .1; actuar(c, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: .25, aRz: .25, aLe: 2.3 + j, aRe: 2.3 - j, headX: .1, headZ: Math.sin(L.T * 3 + i) * .12, crouch: .06 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'angry', mouth: i % 2 ? 'grimace' : 'grimace_wide', eyes: i % 3 ? 'squint' : 'angry' }); }
  else if (m === 'tired') { actuar(c, 0, [[0, { lean: .2, headX: .35 + Math.sin(L.T * 1.3 + i) * .08, aLz: .05, aRz: .05, aLe: .2, aRe: .2, crouch: .06 }]], { T: L.T }); cara(c, T, { eyes: 'half', mouth: Math.sin(L.T * .8 + i) > .7 ? 'yawn' : 'wavy' }); }
  else if (m === 'sitb') { sit(c, x, o.seat ?? 2.4, z, ry, L, { aLx: .4, aRx: .4, aLe: .6, aRe: .6, headY: Math.sin(L.T * .9 + i) * .3 }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); }
  else if (m === 'sitears') { const j = Math.sin(L.T * 6 + i) * .1; sit(c, x, o.seat ?? 0.9, z, ry, L, { aLx: 2.2, aRx: 2.2, aLz: .25, aRz: .25, aLe: 2.3 + j, aRe: 2.3 - j, headX: .15 }); cara(c, T, { eyes: i % 2 ? 'half' : 'squint', mouth: i % 3 ? 'wavy' : 'grimace' }); }
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); } }
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null, dy = 3.3) { const s = ch.spec.scale || 1, p = ch.root.position, c = V(p.x, p.y + dy * s, p.z); const q = easeInOut(clamp(k)); orbit(c, lerp(dist, dist2 ?? dist * .88, q) * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const toCam = ch => { const p = ch.root.position; ch.root.rotation.y = Math.atan2(camera.position.x - p.x, camera.position.z - p.z); };
// ---------- escenarios por plano ----------
function lp(i, x, y, z, k = 40, col = 0xffb060, d = 60) { const l = LP[i]; l.position.set(x, y, z); l.intensity = k; l.color.setHex(col); l.distance = d; }
// Sternau: t = 'day' | 'noon' | 'dawn' | 'dusk' | 'night'; c = punto de interés (para las luces de noche)
function town(L, t = 'day', c = V(0, 0, 0)) { use('TOWN'); if (t === 'night') { night(30); lp(0, c.x - 12, 10, c.z + 8, 60); lp(1, c.x + 12, 10, c.z + 8, 60); lp(2, c.x, 12, c.z - 16, 50); lp(3, c.x, 8, c.z + 20, 36, 0xffd8a0); } else if (t === 'dawn') dawn(); else if (t === 'dusk') dusk(); else day(t); }
function room(R, L, o = {}) { use(R); const g = SETS[R]; const X = g.position.x; if (o.night) { inside(.5, 16); FILL.color.setRGB(1, .8, .6); lp(1, X - 2, 8, -6, 22, 0xffc870, 24); lp(0, X + 6, 12, 4, 14, 0x9ab8ff, 40); } else if (o.dawn) { inside(.72, 26); FILL.color.setRGB(1, .86, .74); lp(0, X + 4, 10, -8, 50, 0xffb070, 40); } else inside(o.h ?? .95, o.fill ?? 38);
  for (const R_ of [KZ, LZ]) if (R_.g === g && R_.WN) R_.WN.p.material.map = (o.night || o.dawn) ? (o.dawn ? R_.WN.day : R_.WN.night) : R_.WN.day; }
const TINTS = { night: 'rgba(20,30,80,.12)' };

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
const KEY = /^(Stadt|Erster|aufwacht|alles|wünschen|Wunsch|sofort|Emma|Jungs|verlieben|37|Liebesbriefe|Ben|Porsche|16|Führerschein|Lea|Million|Euro|Decke|du|Oma|Hilde|19|4|Garten|wachsen|Kürbisse|Waschmaschinen|Mathearbeit|12|Wecker|Schule|aufwachen|Hahn|Becker|7|tiefste|Schläfer|genau|nie|Geburtstag|Sekunde|Bus|Friseur|Stehen|Bäcker|Mama|Silvesterfeuerwerk|Mia|Viertel|sieben|Bett|Ohr|Aufwachen|AUFWACHEN|5|spät|Graufeld|Ohrstöpsel|Lindenstraße|Mitternacht|20|Keller|0|Drei|Chance|Glocke|Hund|Hupe|Lärm|laut|niemand|gewann|100|Neues|Geld|Fahrrad|Häuser|Marktplatz|Papa|3|Schafe|5000|Kopfschmerzen|Nichts|Glocken|Hunde|Hupen|Minute|23:57|gähnte|geschlafen|mir|Uhr|23|59|57|Sekunden|Kirchturmglocke|schlief|Zwei|Eins|Füßen)$/i;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
let DARK = 0, TINT = null, SHAKE = 0, BW = 0, BLOOMMAX = .24; const FX2D = [];
//@@PLANOS@@

// ---------- transiciones, sonidos, render ----------
S.sort((a, b) => a.t0 - b.t0);
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4, B: 8, P: 5, G: 5 };
const CUES = [];
// cada tipo de transición con sus sonidos propios (claros, por encima de los efectos de ambiente)
const TRS = { W: ['whoosh_soft', 'swipe', 'whoosh_down'], Z: ['swoosh_up', 'zoom_in', 'whoosh_up'], F: ['flash', 'click_set', 'sparkle'], S: ['swipe', 'tape', 'whoosh_soft'], R: ['whirl', 'clock_spin', 'whoosh'], I: ['iris_pop', 'pop', 'pling'], C: ['thump', 'impact_soft', 'fist'], B: ['soft_air', 'soft_air', 'soft_air'], P: ['splash', 'water_whoosh', 'splash'], G: ['glitch', 'whoosh', 'glitch'] };
let lastTr = '';
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.tr && i + 1 < S.length) { const L_ = TRS[s.tr]; let n = L_[i % L_.length]; if (n === lastTr) n = L_[(i + 1) % L_.length]; lastTr = n; CUES.push({ t: +(s.t1 - TRW[s.tr] / FPS * .5).toFixed(3), s: n, g: .8, tr: 1 }); }
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  if (s.zoom === 'punch') CUES.push({ t: s.t0, s: 'impact', g: .6 }); });
CUES.push({ t: 0, s: 'zoom_fast', g: .7 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD_.length = 0; s.fn(L); while (POST.length) POST.shift()();
  if (HQ) { renderer.toneMappingExposure *= +(QS.get('exp') ?? 1); grade.uniforms.sharp.value = +(QS.get('sharp') ?? .55); grade.uniforms.vig.value = Math.min(grade.uniforms.vig.value, .38); bloom.strength = Math.min(bloom.strength, BLOOMMAX); ao.enabled = QS.get('ao') === '1'; }
  if (BW > 0) { grade.uniforms.sat.value *= 1 - BW; grade.uniforms.sharp.value += BW * .6; }
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .82, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (s.zoom === 'hook') { const e1 = clamp(lt / .2), e2 = clamp((lt - .2) / Math.max(.3, d - .2)); camera.fov *= lerp(.5, 1, easeOut(e1)) * lerp(1, .8, easeInOut(e2)); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .62, e2); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud', 'kick'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.2; grade.uniforms.vig.value = .5; grade.uniforms.sat.value = 1.3; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = BLUR;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  sh(SHC ?? camera.position.clone().addScaledVector(dir, Math.min(60, Math.max(14, camera.position.distanceTo(CAMT)))), SHR);
  AIR.update(T, ctr, MODE === 'night' ? 'noche' : 'polvo', MODE === 'in' ? .3 : .25);
  sun.castShadow = sun.intensity >= .45; SKY.position.copy(camera.position); SKY.material.uniforms.time.value = T;
  { const fd = camera.position.distanceTo(CAMT); bokeh.uniforms.focus.value = fd; bokeh.uniforms.aperture.value = DOF * .0016 * clamp((40 - fd) / 24 + .25); bokeh.uniforms.maxblur.value = .012; bokeh.enabled = HQ && QS.get('dof') !== '0' && DOF > 0; }
  composer.render(); BLUR = 0; SHR = 70; SHC = null;
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
  if (tr === 'P') { octx.filter = `blur(${(a * 10).toFixed(1)}px) saturate(${1 + a}) hue-rotate(${(a * 25).toFixed(0)}deg)`; const sc = 1 + a2 * .15; octx.scale(sc, sc); }
  if (tr === 'G') { const r = RNG(Math.floor(T * FPS)); octx.translate((r() - .5) * a * 120, 0); }
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  if (tr === 'G' && a > .2) { const r = RNG(Math.floor(T * FPS) + 7); for (let k = 0; k < 6; k++) { const y = (r() - .5) * H, h = 20 + r() * 80; octx.drawImage(renderer.domElement, 0, (y + H / 2) * renderer.domElement.height / H, renderer.domElement.width, h * renderer.domElement.height / H, -W / 2 + (r() - .5) * 200 * a, y, W, h); } }
  octx.restore(); octx.filter = 'none';
  if (tr === 'P') { const g = octx.createLinearGradient(0, H * (1 - a * 1.4), 0, H); g.addColorStop(0, 'rgba(120,200,220,0)'); g.addColorStop(1, `rgba(200,240,255,${(a * .7).toFixed(3)})`); octx.fillStyle = g; octx.fillRect(0, 0, W, H); }
  if (tr === 'B') { octx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`; octx.fillRect(0, 0, W, H); }
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const f of FX2D) f(octx); for (const b of BAD_) drawBadge(b); caption(T);
}
console.log('ready', performance.now()|0); window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { THREE, applyPose, hp, ich, mia, cam, renderer, composer, bloom, sun, grade, scene, camera, TURM };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

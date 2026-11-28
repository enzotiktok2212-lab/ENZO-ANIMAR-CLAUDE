// WUNSCH — «In dieser Stadt darf sich jeder, der morgens als Erster aufwacht, für diesen Tag alles wünschen, was er will.»
// Ich (12) soy el que duerme más profundo; Herr Graufeld se despierta a medianoche y desea ruido toda la noche para ganar siempre;
// con tanto ruido solo yo puedo dormirme… y mi hermana Mia (5) me despierta a las 0:00 en punto.
// Ciudad propia: Sternau (Altstadt de entramado, Marktplatz con la torre de San Nikolaus). Motor y look: los de ebbe (cielo con nubes, AgX/neutral, DOF).
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { rimLight } from './roblox.js';
import { FONT, bench, fountain, washer } from './props.js';
import { skyDome, SKIES, applySky, skyEnvs, schild } from './ebwelt.js';
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
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 30000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = QS.get('ao') !== '0';
const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: .0008, maxblur: .012 }); composer.insertPass(bokeh, 2); let DOF = 1;
let CAMT = new THREE.Vector3(); { const la = camera.lookAt.bind(camera); camera.lookAt = (...a) => { if (a.length === 3) CAMT.set(...a); else CAMT.copy(a[0]); la(...a); }; }
const SS = +(QS.get('ss') ?? 1.25); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
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
// ---------- a: gancho, la regla y los deseos de los jóvenes (0 – 26,4 s) ----------
// Dormitorio de matrimonio (SZ): cama doble en (SZX, -1), almohadas en x = SZX ± 3,4 (z ≈ -6,6), colchón y ≈ 4,15; ventana en la pared izquierda (x = SZX - 15,75).
const PRAY = { aLx: 1.35, aRx: 1.35, aLz: -.42, aRz: -.42, aLe: 1.55, aRe: 1.55, headX: .12 };
const WISH = (T, i = 0) => ({ aLx: 2.7 + Math.sin(T * 6 + i) * .15, aRx: 2.7 - Math.sin(T * 6 + i) * .15, aLz: .5, aRz: .5, aLe: .3, aRe: .3, headX: -.3 });
// 1 «In dieser Stadt darf sich jeder,»: dos personas duermen en la cama doble (vista diagonal); al amanecer las dos se incorporan de golpe,
//   Mama una fracción antes: celebra con los brazos arriba entre chispas doradas; Papa llega tarde y se tapa la cara. Golpe de zoom + zoom lento.
shot(0, 'C', 'hook', L => { room('SZ', L, { dawn: true }); const X = SZX; SZ.quilt.position.y = 4.55;
  const uM = easeOut(clamp((L.lt - .28) / .16)), uP = easeOut(clamp((L.lt - .62) / .16));
  riseBed(mama, X + 3.2, -6.6, uM, L, uM > .9 ? { aLx: lerp(.3, 2.8, clamp((L.lt - .42) / .14)), aRx: lerp(.3, 2.8, clamp((L.lt - .42) / .14)), aLz: .5, aRz: .5, aLe: .3, aRe: .3, headX: -.25 } : {});
  riseBed(papa, X - 3.2, -6.6, uP, L, uP > .9 ? { aRx: 2.3, aRz: -.45, aRe: 2.35, headX: .3 } : {});
  if (L.lt < .28) sleepF(mama, L.T); else if (L.lt < .42) mama.setFace({ eyes: 'wide', mouth: 'o' }); else laughF(mama, L.T);
  if (L.lt < .62) sleepF(papa, L.T); else cara(papa, L.T, { eyes: 'squint', mouth: 'grimace' });
  if (L.lt > .42) { SPK.at(hp(mama).add(V(0, -1.5, 0)), L.T, clamp((L.lt - .42) / .2), 2.4, 6, 26); badge3('gold', 'ERSTE!', hp(mama).add(V(0, 3.2, 0)), (L.lt - .45) / .2, .9); }
  show(WK[0], X + 10, 3.4, -8.2, -.3, .9); clockAt(WK[0], '6:00', '#ffd23f');
  cm([X + 8.5, 12.5, 16, X + .6, 5.2, -4.6, 46], [X + 6.4, 10.2, 11.6, X + .8, 5.6, -4.8, 44], L.k); sh(V(X, 0, -2), 20); },
  [[.02, 'zoom_fast', .7], [.28, 'cloth', .7], [.32, 'gasp_f', .5], [.45, 'magic_hit', .7], [.48, 'cheer', .45], [.62, 'cloth', .5], [.7, 'sigh', .5]]);
// 2 «der morgens als Erster aufwacht,»: Marktplatz al amanecer: un vecino en pijama sale corriendo al centro y salta con los brazos arriba («1.»); detrás, otros tres llegan bostezando
shot(1.30, 'W', null, L => { town(L, 'dawn'); const c = SL[0], run = clamp(L.lt / .7);
  put(c, lerp(-10, 0, easeOut(run)), 0, lerp(14, 6, easeOut(run)), lerp(.9, 0, run)); if (L.lt < .7) actuar(c, 0, [[0, runP(L.T, 0)]], { T: L.T }); else { const j = Math.abs(Math.sin((L.lt - .7) * 9)); c.root.position.y = j * 1.1; actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .5, aRz: .5, aLe: .2, aRe: .2, lLk: j * .6, lRk: j * .6, headX: -.3 }]], { T: L.T }); }
  laughF(c, L.T); badge3('gold', '1.', hp(c).add(V(0, 3, 0)), (L.lt - .6) / .25, 1.2);
  [[SL[5], -9, -12], [SL[8], 7, -16], [SL[11], -2, -22]].forEach(([s, x, z], i) => { put(s, x, 0, z + L.lt * 2, 0); actuar(s, 0, [[0, { ...walkP(L.T * .6, i), aRx: 2.4, aRz: -.4, aRe: 2.3, headX: .2 }]], { T: L.T }); s.setFace({ eyes: 'half', mouth: 'yawn' }); });
  orb(L.k, V(0, 3.2, 6), V(0, 3.4, 4), [26, .25, .18, 46], [19, .05, .12, 42]); sh(V(0, 0, 0), 40); },
  [[.05, 'run_cobble', .6], [.72, 'jump', .5], [.8, 'cheer', .5], [.3, 'birds', .4], [1.0, 'yawn_big', .35]]);
// 3 «für diesen Tag alles»: una chica en la plaza: un remolino de chispas y de él salen una tarta, una bici, fajos de billetes y cartas que giran a su alrededor
shot(2.68, 'Z', null, L => { town(L, 'day'); const c = EX[0]; put(c, 2, 0, 24, 0); actuar(c, 0, [[0, 'shock'], [.25, WISH(L.T), { dur: .3 }]], { T: L.T }); if (L.lt < .25) cara(c, L.T, { expr: 'gasp' }); else laughF(c, L.T);
  const C = V(2, 3.5, 24); SPK.at(V(2, 0, 24), L.T, 1, 6, 9, 34);
  const items = [KUCHEN, BIKE, ...BUNDLES.slice(0, 4), ...LETTERS.slice(0, 4)]; items.forEach((o, i) => { const a = i / items.length * 6.283 + L.lt * 2.4, r = lerp(.5, 6.5, easeOut(clamp(L.lt / .6))), y = 2 + (i % 3) * 2.4 + Math.sin(L.T * 3 + i);
    show(o, C.x + Math.cos(a) * r, y, C.z + Math.sin(a) * r * .8, a, (o === BIKE ? .7 : o === KUCHEN ? 1.1 : 1.1) * easeOut(clamp(L.lt / .3))); });
  crowdBox(L, -24, 24, 6, 14, 8, 3, { mode: i => ['point', 'shock', 'clap', 'look'][i % 4] });
  orb(L.k, C, null, [24, -.35, .16, 46], [18, .3, .1, 44]); sh(V(2, 0, 24), 34); },
  [[.02, 'magic_hit', .7], [.1, 'sparkle', .6], [.3, 'whoosh', .5], [.6, 'money_rain', .5], [1.0, 'kids_laugh', .4]]);
// 4 «wünschen, was er will.»: primer plano de un señor con los ojos cerrados y las manos juntas pidiendo un deseo; al abrir los ojos, estalla una estrella dorada
shot(4.02, 'F', null, L => { town(L, 'day'); const c = EX[3]; put(c, -6, 0, 10, .2); const k = clamp((L.lt - .9) / .2);
  actuar(c, 0, [[0, PRAY], [.9, WISH(L.T, 1), { dur: .25 }]], { T: L.T }); if (L.lt < .9) c.setFace({ eyes: 'closed', mouth: 'smile' }); else laughF(c, L.T);
  SPK.at(hp(c).add(V(0, -2, 0)), L.T, .35 + k * .65, 2 + k * 3, 6, 30); if (k > 0) confetti(hp(c), L.t0 + .9, L.T, 30, 1);
  crowdBox(L, -20, 10, -26, -8, 5, 7, { mode: 'look' });
  onFace(c, 5.2, .2, .4, 40, L.k, 4.2); sh(V(-6, 0, 10), 24); },
  [[.1, 'whisper', .4], [.9, 'magic_hit', .7], [.95, 'sparkle', .6], [1.1, 'confetti', .5]]);
// 5 «Du machst die Augen auf,»: una chica en su cama, primerísimo plano: abre los ojos de golpe con la luz del amanecer
shot(5.58, 'C', 'punch', L => { room('LZ', L, { dawn: true }); const c = EX[2]; lie(c, LZX - 9, -7.4, 4.15, L); LZ.quilt.position.y = 4.6;
  if (L.lt < .3) c.setFace({ eyes: 'closed', mouth: 'flat' }); else c.setFace({ eyes: 'wide', mouth: 'o' });
  const h = hp(c); cam([h.x + .4, h.y + 5.2, h.z + 2.6], [h.x, h.y, h.z - .2], lerp(40, 34, L.k)); sh(V(LZX - 9, 0, -4), 16); },
  [[.28, 'blink', .7], [.3, 'gasp_f', .5], [.1, 'birds', .3]]);
// 6 «sagst deinen Wunsch laut,»: se incorpora de golpe y grita su deseo («PARTY!»), con los puños arriba
shot(6.82, 'S', null, L => { room('LZ', L, { dawn: true }); const c = EX[2]; LZ.quilt.position.y = 4.6; const up = easeOut(clamp(L.lt / .2));
  riseBed(c, LZX - 9, -7.4, up, L, { aLx: lerp(.2, 2.6, up), aRx: lerp(.2, 2.6, up), aLz: .4, aRz: .4, aLe: .6, aRe: .6, headX: -.2 }); talk(c, L.T, L.t0, L.t1, 'shout', { eyes: 'happy' });
  bubble(c, 'PARTY!', (L.lt - .2) / .2, 2.2); onBody(c, 15, .55, .16, 42, L.k, 12, .35, 2.4); sh(V(LZX - 9, 0, -4), 18); },
  [[.02, 'cloth', .6], [.1, 'shout_m', .5], [.3, 'pop', .5]]);
// 7 «und die Stadt erfüllt ihn sofort.»: la plaza estalla en fiesta: confeti, fuegos artificiales, banderines y vecinos bailando; la cámara sube en grúa
shot(7.74, 'R', null, L => { town(L, 'day'); bloom.strength = .2; confetti(V(0, 6, -10), L.t0, L.T, 40, 1.6); fireworks(V(0, 34, -40), L.T, 4, 22);
  crowdAt(L, 0, -8, 16, 10, 24, 5, { mode: i => ['cheer', 'clap', 'wave', 'cheer'][i % 4], full: true });
  put(EX[2], 0, 0, 6, 0); const j = Math.abs(Math.sin(L.T * 7)); EX[2].root.position.y = j * .8; actuar(EX[2], 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(EX[2], L.T);
  orb(L.k, V(0, 3, 0), V(0, 10, -10), [26, .4, .1, 46], [52, -.15, .42, 50]); sh(V(0, 0, -6), 50); },
  [[.02, 'party_horn', .6], [.1, 'confetti', .6], [.3, 'firework', .5], [.6, 'cheer', .5], [1.0, 'firework', .4], [1.3, 'kids_laugh', .4]]);
// ---------- Emma, Ben y Lea ----------
// 8 «Emma hat sich gewünscht,»: Emma (melena rubia, chaqueta rosa) en la plaza, ojos cerrados y manos juntas; chispas doradas la rodean
shot(10.01, 'I', null, L => { town(L, 'day'); const c = put(emma, 0, 0, 30, 0); actuar(c, 0, [[0, PRAY]], { T: L.T }); c.setFace({ eyes: L.lt < .7 ? 'closed' : 'happy', mouth: 'smile' });
  SPK.at(V(0, 0, 30), L.T, 1, 3.2, 7, 28); crowdBox(L, -22, 22, 8, 16, 7, 11, { mode: i => ['walk', 'look', 'talk'][i % 3], dir: PI / 2 });
  onBody(c, 15, .2, .12, 42, L.k, 11, -.15); sh(V(0, 0, 30), 30); },
  [[.05, 'sparkle', .6], [.3, 'whisper', .35], [.7, 'magic_hit', .5]]);
// 9 «dass sich alle Jungs in sie verlieben.»: cuatro chicos se giran a la vez con corazones sobre la cabeza y corren hacia ella
shot(11.05, 'W', null, L => { town(L, 'day'); const c = put(emma, 0, 0, 30, PI); actuar(c, 0, [[0, { aRx: .3, aLx: .3, headX: -.05 }], [.6, 'shock', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: L.lt < .6 ? 'smile' : 'gasp' });
  JUNG.forEach((j, i) => { const x0 = -12 + i * 8, t = clamp((L.lt - .25 - i * .06) / 1.2); put(j, x0 * (1 - t * .7), 0, 6 + t * 16, lerp(PI, 0, clamp(L.lt * 4 - i * .3))); if (L.lt > .35) actuar(j, 0, [[0, runP(L.T, i)]], { T: L.T }); else actuar(j, 0, [[0, walkP(L.T, i)]], { T: L.T });
    j.setFace({ eyes: 'happy', mouth: 'open_smile' }); badge3('heart', '', hp(j).add(V(0, 2.4, 0)), (L.lt - .3 - i * .05) / .2, .5 + Math.sin(L.T * 12 + i) * .06); });
  orb(L.k, V(0, 3.4, 22), V(0, 3.4, 24), [20, PI + .35, .16, 46], [16, PI + .1, .14, 44]); sh(V(0, 0, 20), 34); },
  [[.25, 'whoosh', .5], [.35, 'run_cobble', .6], [.4, 'piano_note', .5], [.5, 'heartbeat', .5], [.9, 'gasp_f', .4]]);
// 10 «Bis zum Abend bekam sie»: atardecer en la puerta de Emma: un chico tras otro le meten cartas por el buzón; las cartas se amontonan
shot(12.68, 'S', null, L => { town(L, 'dusk'); const D = V(-40, 0, 30); const c = put(emma, D.x + 2, 0, D.z + 3, PI / 2); actuar(c, 0, [[0, 'hold']], { T: L.T }); cara(c, L.T, { expr: 'happy' });
  JUNG.slice(0, 3).forEach((j, i) => { put(j, D.x + 7 + i * 3.6, 0, D.z + 1 - i * .8, -PI / 2); actuar(j, 0, [[0, { aRx: 1.5 + Math.sin(L.T * 4 + i) * .2, aRe: .2, lean: .1 }]], { T: L.T }); j.setFace({ eyes: 'happy', mouth: 'smile' }); const l = LETTERS[i]; show(l, D.x + 5.8 + i * 3.6 - Math.min(L.lt * 2, 1.4), 4.4, D.z + 1.4 - i * .8, -PI / 2, 1); });
  LETTERS.slice(4, 16).forEach((l, i) => { const t = clamp(L.lt * 1.6 - i * .08); show(l, c.root.position.x + Math.sin(i * 2.1) * 1.2, .2 + i * .14 * t + (1 - t) * 6, c.root.position.z + 1.6 + Math.cos(i) * .8, i, 1.2).rotation.set(-PI / 2 + Math.sin(i) * .3, i, 0); });
  orb(L.k, V(D.x + 4, 3.8, D.z + 1), null, [22, PI / 2 + .45, .16, 44], [18, PI / 2 + .2, .12, 42]); sh(V(D.x + 4, 0, D.z), 26); },
  [[.1, 'paper', .5], [.4, 'paper', .5], [.7, 'pages', .5], [.2, 'steps', .4]]);
// 11 «37 Liebesbriefe.»: Emma en su cama rodeada de cartas que llueven del techo; «37» en grande
shot(13.80, 'Z', 'punch', L => { room('LZ', L); const c = put(emma, LZX - 9, sitY(emma, 3.9), -4, 0); c.blob.visible = false; actuar(c, 0, [[0, { lLx: 1.5, lRx: 1.5, aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5, aLe: .3, aRe: .3, headX: -.2 }]], { T: L.T, weight: false }); laughF(c, L.T);
  LETTERS.forEach((l, i) => { const q = RNG(i * 7 + 2); const y = 15 - ((L.T * (2 + q() * 1.5) + q() * 14) % 14); show(l, LZX - 9 + (q() - .5) * 12, y, -4 + (q() - .5) * 10, q() * 6, 1.3).rotation.set(L.T * 2 + i, L.T + i, 0); });
  badge('red', '37', W / 2, H * .2, (L.lt - .05) / .2, 1, 1.6); badge('heart', '', W * .28, H * .26, (L.lt - .2) / .2, 1, .7); badge('heart', '', W * .72, H * .3, (L.lt - .3) / .2, 1, .55);
  onBody(c, 16, .35, .25, 44, L.k, 12, .2, 2.4); sh(V(LZX - 9, 0, -4), 18); },
  [[.02, 'impact', .5], [.1, 'paper', .6], [.4, 'pages', .5], [.6, 'kids_laugh', .4], [.15, 'count', .5]]);
// 12 «Ben hat sich einen Porsche gewünscht.»: Ben (gorra del revés) en la calle con las manos juntas; un remolino de chispas y aparece un deportivo amarillo
shot(15.55, 'F', null, L => { town(L, 'day'); const B = V(0, 0, 140); const c = put(ben, B.x - 6, 0, B.z + 4, .5); const k = clamp((L.lt - .55) / .25);
  actuar(c, 0, [[0, PRAY], [.6, 'shock', { dur: .25 }]], { T: L.T }); if (L.lt < .6) c.setFace({ eyes: 'closed', mouth: 'smile' }); else cara(c, L.T, { expr: 'gasp' });
  SPK.at(V(B.x + 2, 0, B.z), L.T, k > 0 ? 1 : .3, 5, 6, 34); if (k > 0) show(PORSCHE, B.x + 2, 0, B.z, -.7, easeOut(k)).position.y = (1 - k) * 4;
  orb(L.k, V(B.x - 1, 3.2, B.z + 2), null, [26, .6, .14, 46], [22, .35, .12, 44]); sh(V(B.x, 0, B.z), 30); },
  [[.1, 'whisper', .35], [.55, 'magic_hit', .7], [.6, 'sparkle', .6], [.75, 'car', .5]]);
// 13 «Mit 16.»: Ben al volante con gafas de sol, sonriendo; el motor ruge; «16» en grande
shot(17.23, 'C', 'punch', L => { town(L, 'day'); const B = V(0, 0, 140); show(PORSCHE, B.x, 0, B.z, 0, 1); const c = sit(ben, B.x - 1.2, 2.2, B.z - 1, 0, L, { aLx: 1.2, aRx: 1.3, aLe: .4, aRe: .3, headX: -.05 }); grin(c, L.T);
  badge('gold', '16', W / 2, H * .2, (L.lt - .05) / .2, 1, 1.5); dust(V(B.x, 0, B.z - 5), L.t0 + .1, L.T, 10, 1);
  orb(L.k, V(B.x - 1, 3.6, B.z), null, [15, .35, .2, 42], [12, .15, .16, 40]); sh(V(B.x, 0, B.z), 24); },
  [[.02, 'car', .7], [.1, 'impact', .5], [.3, 'evil_laugh', .2]]);
// 14 «Ohne Führerschein.»: el deportivo arranca a lo loco y choca contra un buzón; Ben se encoge de hombros; cartel rojo «KEIN FÜHRERSCHEIN»
shot(18.54, 'R', null, L => { town(L, 'day'); const B = V(0, 0, 140), t = clamp(L.lt / .45); show(PORSCHE, B.x + Math.sin(t * 3) * 3, 0, B.z + easeIn(t) * 14, Math.sin(t * 9) * .3 * (1 - t) + (L.lt > .45 ? .25 : 0), 1); PORSCHE.position.y = L.lt > .45 && L.lt < .6 ? .5 : 0;
  const c = sit(ben, PORSCHE.position.x - 1.2, 2.2, PORSCHE.position.z - 1, PORSCHE.rotation.y, L, L.lt > .5 ? { aLx: .45, aLz: .65, aRx: .45, aRz: .65, aLe: 1.5, aRe: 1.5, headZ: .2 } : { aLx: 1.2, aRx: 1.3 }); cara(c, L.T, { expr: L.lt > .5 ? 'shock' : 'joy' });
  if (L.lt > .45) dust(V(PORSCHE.position.x, 0, B.z + 19), L.t0 + .45, L.T, 14, 1.4); badge('red', 'KEIN FÜHRERSCHEIN', W / 2, H * .22, (L.lt - .5) / .2, 1, .8);
  crowdBox(L, B.x - 14, B.x - 8, B.z + 4, B.z + 18, 3, 9, { mode: 'shock' }); cm([B.x + 14, 8, B.z + 36, B.x, 3, B.z + 12, 48], [B.x + 10, 7, B.z + 32, B.x, 3, B.z + 16, 46], L.k); sh(V(B.x, 0, B.z + 14), 30); },
  [[.02, 'car_pass', .6], [.45, 'car_hit', .7], [.5, 'glass_crack', .4], [.6, 'gasp', .4]]);
// 15 «Und Lea hat sich eine Million Euro gewünscht.»: Lea (gafas, jersey morado) en su cuarto, ojos cerrados y manos juntas; luego mira arriba: empiezan a caer billetes
shot(19.54, 'I', null, L => { room('MZ', L); GELD.userData.setH(0); const c = put(lea, MZX - 2, 0, 3, .2); const k = clamp((L.lt - 1.1) / .3);
  actuar(c, 0, [[0, PRAY], [1.15, { aLx: 2.4, aRx: 2.4, aLz: .6, aRz: .6, aLe: .5, aRe: .5, headX: -.4 }, { dur: .3 }]], { T: L.T }); if (L.lt < 1.1) c.setFace({ eyes: 'closed', mouth: 'smile' }); else cara(c, L.T, { expr: 'joy' });
  SPK.at(V(MZX - 2, 0, 3), L.T, 1, 3, 7, 26); BUNDLES.forEach((b, i) => { const q = RNG(i * 3 + 1); if (k <= 0) return; const y = 15 - ((L.T * (3 + q() * 2) + q() * 13) % 13); show(b, MZX - 2 + (q() - .5) * 10, y, 3 + (q() - .5) * 8, q() * 6, .7).rotation.set(L.T * 3 + i, i, L.T + i); });
  onBody(c, 17, .3, .14, 44, L.k, 13, .1); sh(V(MZX, 0, 0), 20); },
  [[.1, 'whisper', .4], [.9, 'magic_hit', .7], [1.15, 'money_rain', .7], [1.3, 'cash', .6]]);
// 16 «Die Scheine stapelten sich in ihrem Zimmer»: los fajos crecen del suelo en montones y llenan el cuarto; Lea encima, riendo
shot(22.09, 'Z', null, L => { room('MZ', L); const h = clamp(L.lt / 1.2); GELD.userData.setH(easeOut(h) * .7); const c = put(lea, MZX + 2, h * 8, 2, -.3); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .45, aRz: .45, aLe: .3, aRe: .3, crouch: .05 }]], { T: L.T }); laughF(c, L.T);
  BUNDLES.slice(0, 8).forEach((b, i) => { show(b, MZX + 2 + Math.cos(i + L.T * 3) * 3, 4 + h * 8 + Math.sin(i * 2 + L.T * 4) * 2, 2 + Math.sin(i + L.T * 3) * 3, i + L.T, .7); });
  badge('green', '1.000.000 €', W / 2, H * .2, (L.lt - .1) / .2, 1, 1.0);
  cm([MZX - 6, 6, 18, MZX + 4, 5, -3, 50], [MZX - 4, 13, 15, MZX + 4, 9, -3, 50], L.k); sh(V(MZX + 4, 0, -2), 20); },
  [[.02, 'cash_reg', .6], [.2, 'money_rain', .6], [.6, 'cash', .5], [1.0, 'laugh_deep', .25], [1.2, 'coin_flip', .4]]);
// 17 «bis zur Decke.»: grúa hacia arriba: el montón de billetes toca el techo y Lea, aplastada contra él, ríe con la cara pegada
shot(23.73, 'W', 'slow', L => { room('MZ', L); GELD.userData.setH(1); const c = put(lea, MZX + 4, 11.2, -3, 0); actuar(c, 0, [[0, { aLx: 3.0, aRx: 3.0, aLz: .3, aRz: .3, aLe: 1.4, aRe: 1.4, crouch: .25, headX: .15 }]], { T: L.T }); laughF(c, L.T);
  cm([MZX - 2, 8, 14, MZX + 4, 9, -3, 52], [MZX, 13.4, 10, MZX + 4, 14, -3, 46], L.k); sh(V(MZX + 4, 0, -3), 20); },
  [[.05, 'money_rain', .5], [.4, 'thud', .5]]);
// 18 «Und du?»: toda la plaza se gira a la vez y señala a cámara
shot(24.78, 'C', 'punch', L => { town(L, 'day'); crowdBox(L, -16, 16, 14, 30, 14, 21, { mode: 'point', expr: 'happy', face: V(0, 4, 60), jit: .1 });
  put(emma, -3, 0, 36, 0); put(ben, 3.5, 0, 35, 0); put(lea, 0, 0, 38.5, 0); for (const [c, i] of [[emma, 0], [ben, 1], [lea, 2]]) { actuar(c, 0, [[0, { aRx: 1.62, aRz: -.08, aRe: .05, aLz: .12, aLe: .25, lean: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' }); }
  cm([0, 5.2, 54, 0, 4.6, 30, 44], [0, 5, 48, 0, 4.6, 30, 40], L.k); sh(V(0, 0, 32), 30); },
  [[.02, 'impact', .5], [.1, 'whoosh', .4]]);
// 19 «Was würdest du dir wünschen?»: estrella fugaz sobre Sternau al atardecer; una gran «?» dorada
shot(25.32, 'F', 'slow', L => { town(L, 'dusk'); SPK.at(V(lerp(-60, 40, L.k), lerp(70, 50, L.k), -60), L.T, 1, 2, 3, 20);
  badge('q', '?', W / 2, H * .3, (L.lt - .1) / .25, 1, 1.6); crowdBox(L, -14, 14, 20, 30, 6, 17, { mode: 'look', face: V(0, 60, -60), jit: .2 });
  cm([0, 6, 70, 0, 22, -40, 50], [0, 7, 62, 0, 28, -40, 48], L.k); sh(V(0, 0, 20), 40); },
  [[.1, 'sparkle', .6], [.3, 'whoosh_up', .4], [.6, 'piano_note', .4]]);
// ---------- b: Oma Hilde, los niños, el gallo y yo (26,4 – 58,3 s) ----------
// Huerto (GA, x = GAX): casa de Oma al fondo (z = -48), bancales en (±11, -6) y (±11, 12), calabazas GA.CAL, valla en z = 30 (puerta en x ∈ ±4).
// Dormitorio de Oma (OZ): cama doble; Oma en la almohada derecha (x = OZX + 3,4). Mi cuarto (KZ): cama en (KZX - 9), almohada z = -7,4.
// 20 «Aber am häufigsten gewinnt Oma Hilde.»: Oma en su huerto entre calabazas, levanta un trofeo de oro (una calabacita dorada) y guiña
shot(26.41, 'W', null, L => { use('GA'); day('day'); const c = put(oma, GAX, 0, 22, 0); actuar(c, 0, [[0, { aRx: 2.7, aRz: .3, aRe: .3, aLx: .4, aLz: .4, aLe: 1.2, headX: -.1 }]], { T: L.T }); cara(c, L.T, { eyes: L.lt > .9 ? 'wink' : 'happy', mouth: 'open_smile' });
  const tr = KUERB[0]; attach(tr, c.aR.hand, [0, -.6, 0], [0, 0, 0], .7); tr.traverse(o => { if (o.isMesh && !o.userData.gold) { o.userData.gold = 1; } });
  SPK.at(hp(c).add(V(0, 1.6, 0)), L.T, .6, 1.4, 3, 14); badge('tag', 'OMA HILDE', W / 2, H * .18, (L.lt - .2) / .25, 1, 1);
  orb(L.k, V(GAX, 3.4, 22), null, [18, -.4, .14, 44], [14, -.1, .1, 42]); sh(V(GAX, 0, 20), 26); },
  [[.1, 'birds', .4], [.3, 'cheer', .3], [.9, 'blink', .4]]);
// 21 «Sie geht um 19 Uhr ins Bett,»: Oma, con gorro de dormir, se mete en la cama con el sol todavía fuera; el despertador marca 19:00
shot(28.23, 'S', null, L => { room('OZ', L, { dawn: true }); const t = clamp(L.lt / .9); const c = oma;
  if (L.lt < .5) { put(c, OZX + 9, 0, 0, -PI / 2 + .4); actuar(c, 0, [[0, walkP(L.T * .5, 0)]], { T: L.T }); cara(c, L.T, { expr: 'smile' }); } else { lie(c, OZX + 3.4, -6.6, 4.15, L); OZ.quilt.position.y = 4.55; cara(c, L.T, { eyes: 'closed', mouth: 'smile' }); }
  show(WK[0], OZX + 10, 3.4, -8.2, -.4, 1); clockAt(WK[0], '19:00', '#ffd23f'); badge('num', '19:00', W * .5, H * .2, (L.lt - .1) / .2, 1, 1.1);
  cm([OZX - 6, 11, 16, OZX + 4, 4.5, -4, 46], [OZX - 3.4, 10, 12, OZX + 4, 4.8, -4.6, 44], L.k); sh(V(OZX + 3, 0, -3), 18); },
  [[.05, 'steps', .4], [.5, 'cloth', .6], [.7, 'sigh', .4], [.2, 'clock_tick', .4]]);
// 22 «wacht um 4 Uhr auf und ruft:»: de noche, el despertador salta a 4:00 y Oma se sienta de golpe, despierta del todo
shot(29.72, 'C', 'punch', L => { room('OZ', L, { night: true }); const up = easeOut(clamp((L.lt - .45) / .2)); OZ.quilt.position.y = 4.55;
  riseBed(oma, OZX + 3.4, -6.6, up, L, up > .8 ? { aLx: 1.0, aRx: 1.0, aLz: .4, aRz: .4, aLe: 1.6, aRe: 1.6 } : {}); if (L.lt < .45) sleepF(oma, L.T); else cara(oma, L.T, { expr: 'joy' });
  show(WK[0], OZX + 10, 3.4, -8.2, -.4, 1); clockAt(WK[0], L.lt < .45 ? '3:59' : '4:00', L.lt < .45 ? '#ff4a3a' : '#7af0ff'); badge('num', '4:00', W * .5, H * .2, (L.lt - .45) / .2, 1, 1.1);
  if (L.lt < .45) zzz(oma, L.T); cm([OZX + 10.5, 7.5, 2, OZX + 6, 4.6, -6, 44], [OZX + 9.5, 7.4, .4, OZX + 5, 5, -6, 42], L.k); sh(V(OZX + 5, 0, -5), 18); },
  [[.4, 'alarm', .6], [.47, 'cloth', .6], [.5, 'gasp_old', .5]]);
// 23 «„Mein Garten soll wachsen!“»: Oma de pie en la cama, brazos al cielo, gritando; las chispas salen volando por la ventana
shot(32.03, 'Z', null, L => { room('OZ', L, { night: true }); const c = put(oma, OZX + 2, 4, -2, -.5); actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .4, aRz: .4, aLe: .2, aRe: .2, headX: -.35, lean: -.08 }]], { T: L.T }); talk(c, L.T, L.t0, L.t1, 'shout', { eyes: 'happy' }); c.blob.visible = false; OZ.quilt.position.y = 4.55;
  SPK.at(V(lerp(OZX + 2, OZX - 15, (L.T * .8) % 1), 6, lerp(-2, 2, (L.T * .8) % 1)), L.T, 1, 2, 6, 30);
  onBody(c, 17, .5, .2, 44, L.k, 14, .25); sh(V(OZX, 0, -2), 20); },
  [[.02, 'shout_m', .2], [.2, 'magic_hit', .6], [.5, 'sparkle', .6], [.9, 'whoosh_up', .4]]);
// 24 «Sie gewinnt fast jeden Tag,»: al amanecer, el huerto crece de golpe a su alrededor; los vecinos, en pijama, miran desde la valla con cara larga
shot(33.62, 'I', null, L => { use('GA'); dawn(); const c = put(oma, GAX - 4, 0, 4, .3); const j = Math.abs(Math.sin(L.T * 6)); c.root.position.y = j * .5; actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .45, aRz: .45, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(c, L.T);
  GA.CAL.forEach((k, i) => k.scale.setScalar(lerp(.4, 1, easeOut(clamp(L.lt * 1.4 - i * .1)))));
  crowdBox(L, GAX - 14, GAX + 14, 32, 34, 5, 13, { list: SL, mode: 'tired', face: V(GAX - 4, 3, 4), jit: .15 });
  orb(L.k, V(GAX - 2, 3.4, 10), null, [30, PI + .25, .2, 46], [24, PI + .05, .16, 44]); sh(V(GAX, 0, 8), 34); },
  [[.05, 'rooster', .3], [.2, 'leaves', .5], [.4, 'cheer', .35], [.8, 'sigh', .4]]);
// 25 «und ihre Kürbisse sind so groß»: grúa baja entre calabazas gigantes; Oma les da palmaditas
shot(34.91, 'S', null, L => { use('GA'); day('day'); GA.CAL.forEach(k => k.scale.setScalar(1)); const c = put(oma, GAX + 4.5, 0, -1, -.9); actuar(c, 0, [[0, { aRx: 1.4 + Math.abs(Math.sin(L.T * 6)) * .3, aRe: .3, aRz: -.1, lean: .05 }]], { T: L.T }); cara(c, L.T, { expr: 'happy' });
  cm([GAX - 4, 2.2, 18, GAX + 6, 5, -6, 52], [GAX + 2, 7, 20, GAX + 8, 4, -6, 48], L.k); sh(V(GAX + 6, 0, -4), 26); },
  [[.1, 'thud', .4], [.4, 'thud', .4], [.2, 'birds', .4]]);
// 26 «wie Waschmaschinen.»: al lado de una calabaza, una lavadora: igual de grandes; Oma asiente orgullosa
shot(36.62, 'C', 'punch', L => { use('GA'); day('day'); GA.CAL.forEach(k => k.scale.setScalar(1)); show(WASH, GAX + 17, .8, -8, -.6, 1.15); const c = put(oma, GAX + 13.6, 0, -2.4, -.3); actuar(c, 0, [[0, { aRx: 1.6, aRz: .1, aRe: .1, headY: -.3 }]], { T: L.T }); grin(c, L.T);
  badge('big', '=', W / 2, H * .3, (L.lt - .1) / .2, 1, 1.2); orb(L.k, V(GAX + 13.5, 3.4, -7), null, [20, .1, .14, 44], [17, -.05, .12, 42]); sh(V(GAX + 14, 0, -6), 22); },
  [[.02, 'impact', .4], [.2, 'machine_hum', .5], [.5, 'laugh_deep', .2]]);
// 27 «In der Nacht vor einer Mathearbeit»: un niño en su escritorio de noche con un examen de mates («MATHE 5-»), sudando
shot(37.63, 'F', null, L => { room('LZ', L, { night: true }); const c = KIDS[1]; sit(c, LZX + 6, 2.6, 2, -PI / 2 + .4, L, { aLx: 1.0, aRx: 1.2, aLe: 1.2, aRe: 1.0, headX: .3, lean: .25 }); cara(c, L.T, { expr: 'worried' }); sweat(c, L.T);
  badge('red', 'MATHEARBEIT', W / 2, H * .2, (L.lt - .1) / .2, 1, .8);
  onBody(c, 12, .9, .2, 44, L.k, 10, .6, 2.4); sh(V(LZX + 6, 0, 2), 16); },
  [[.1, 'pencil', .5], [.6, 'gulp', .5], [.3, 'clock_tick', .4]]);
// 28 «stellt jedes Kind in der Stadt 12 Wecker»: el niño rodea su cama de despertadores; van apareciendo de uno en uno con el contador
shot(38.89, 'W', null, L => { room('LZ', L, { night: true }); const c = put(KIDS[1], LZX - 3, 0, 2, -PI / 2); const n = Math.min(12, Math.floor(L.lt / 1.6 * 12) + 1);
  actuar(c, 0, [[0, { aRx: 1.3 + Math.sin(L.T * 10) * .2, aRe: .4, lean: .3, crouch: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  for (let i = 0; i < 12; i++) { const w = WK[i]; if (i >= n) continue; const a = i / 12 * PI * 2; show(w, LZX - 9 + Math.cos(a) * 5.6, i % 3 === 0 ? 4.5 : .1, -2 + Math.sin(a) * 6.8, -a + PI / 2, .9); clockAt(w, '6:00', ['#ff4a3a', '#7af0ff', '#ffd23f'][i % 3]); }
  badge('num', String(n), W * .5, H * .2, 1, 1, 1.3); cm([LZX + 6, 14, 12, LZX - 8, 2, -3, 50], [LZX + 3, 12, 10, LZX - 8, 2.4, -3, 48], L.k); sh(V(LZX - 7, 0, -2), 20); },
  [[.05, 'click_metal', .5], [.3, 'click_metal', .5], [.55, 'click_metal', .5], [.8, 'click_metal', .5], [1.05, 'click_metal', .5], [1.3, 'click_metal', .5], [1.55, 'click_metal', .5]]);
// 29 «und betet, dass die Schule ausfällt.»: de rodillas junto a la cama, manos juntas, mirando al cielo por la ventana; bocadillo «BITTE!»
shot(40.67, 'R', null, L => { room('LZ', L, { night: true }); const c = put(KIDS[1], LZX - 9, 0, 6.6, PI); actuar(c, 0, [[0, { ...PRAY, crouch: .6, lLx: 1.4, lRx: 1.4, lLk: 1.9, lRk: 1.9, headX: -.3 }]], { T: L.T, weight: false }); c.root.position.y = -1.2 * (c.spec.scale || 1); c.setFace({ eyes: 'up', mouth: Math.sin(L.T * 9) > 0 ? 'talk' : 'o' });
  for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2; show(WK[i], LZX - 9 + Math.cos(a) * 5.6, i % 3 === 0 ? 4.5 : .1, -2 + Math.sin(a) * 6.8, -a + PI / 2, .9); clockAt(WK[i], '6:00', '#ff4a3a'); }
  bubble(c, 'BITTE!', (L.lt - .15) / .2, 2); cm([LZX - 9, 7, 17, LZX - 9, 4, 4, 44], [LZX - 7.6, 6.4, 13.6, LZX - 9, 4.2, 4, 42], L.k); sh(V(LZX - 9, 0, 2), 18); },
  [[.1, 'whisper', .5], [.5, 'piano_note', .3], [1.2, 'cricket', .4]]);
// 30 «Denn einschlafen reicht nicht.»: el niño ya dormido entre los despertadores; Zzz
shot(43.16, 'I', null, L => { room('LZ', L, { night: true }); const c = lie(KIDS[1], LZX - 9, -7.4, 4.15, L); LZ.quilt.position.y = 4.6; sleepF(c, L.T); zzz(c, L.T);
  for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2; show(WK[i], LZX - 9 + Math.cos(a) * 5.6, i % 3 === 0 ? 4.5 : .1, -2 + Math.sin(a) * 6.8, -a + PI / 2, .9); clockAt(WK[i], '5:59', '#ff4a3a'); }
  cm([LZX - 9, 16, 6, LZX - 9, 4, -4, 46], [LZX - 9, 13, 3, LZX - 9, 4, -5, 44], L.k); sh(V(LZX - 9, 0, -3), 18); },
  [[.05, 'snore', .6], [.6, 'clock_tick', .4]]);
// 31 «Du musst auch wirklich als Erster aufwachen.»: suenan los doce a la vez; el niño se incorpora… y por la ventana ya se ve a un vecino celebrando: «ZU SPÄT!»
shot(44.56, 'C', null, L => { room('LZ', L, { dawn: true }); const up = easeOut(clamp((L.lt - .3) / .2)); LZ.quilt.position.y = 4.6; riseBed(KIDS[1], LZX - 9, -7.4, up, L, up > .8 ? { aRx: 2.3, aRz: -.45, aRe: 2.35, headX: .3 } : {}); if (up > .5) cara(KIDS[1], L.T, { expr: 'sad' }); else sleepF(KIDS[1], L.T);
  for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2, j = Math.sin(L.T * 40 + i) * .12; show(WK[i], LZX - 9 + Math.cos(a) * 5.6 + j, (i % 3 === 0 ? 4.5 : .1) + Math.abs(j), -2 + Math.sin(a) * 6.8, -a + PI / 2 + j, .9); clockAt(WK[i], '6:00', '#ff4a3a'); }
  badge('red', 'ZU SPÄT!', W / 2, H * .22, (L.lt - .9) / .2, 1, 1); cm([LZX + 4, 10, 12, LZX - 9, 5, -5, 46], [LZX + 2, 9, 9, LZX - 9, 5, -5, 44], L.k); sh(V(LZX - 9, 0, -3), 18); },
  [[.0, 'alarm', .7], [.05, 'alarm', .5], [.32, 'cloth', .5], [.9, 'sad_tone', .5], [1.3, 'cheer', .2]]);
// 32 «Und der Hahn von Herrn Becker»: al amanecer, el gallo en un poste de la valla canta con todas sus fuerzas; Herr Becker (sombrero de paja) le anima
shot(46.87, 'S', null, L => { use('GA'); dawn(); const cr = clamp(Math.sin(L.lt * 4) * 1.2); show(HAHN, GAX + 6.6, 3.4, 30, .4, 1.1); HAHN.userData.crow(cr);
  const c = put(becker, GAX + 11, 0, 34, -.5); actuar(c, 0, [[0, { aRx: 2.6, aRz: .3, aRe: .4, aLx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' }); notesFX(V(GAX + 6.6, 8, 31), L.T, 4, 1);
  orb(L.k, V(GAX + 8, 5, 31), null, [18, .7, .12, 44], [15, .45, .1, 42]); sh(V(GAX + 8, 0, 31), 22); },
  [[.05, 'rooster', .8], [.6, 'birds', .4]]);
// 33 «hat seit 7 Jahren»: el gallo con plumas desordenadas y ojeras, en primer plano; «7 JAHRE»
shot(48.27, 'Z', 'punch', L => { use('GA'); dawn(); show(HAHN, GAX + 6.6, 3.4, 30, .4, 1.1); HAHN.userData.crow(.2 + Math.sin(L.T * 3) * .1); badge('red', '7 JAHRE', W / 2, H * .2, (L.lt - .05) / .2, 1, 1.1);
  cm([GAX + 9.8, 7.4, 37.4, GAX + 6.6, 6, 30, 38], [GAX + 9, 7.2, 36, GAX + 6.6, 6, 30, 34], L.k); sh(V(GAX + 6.6, 0, 30), 14); },
  [[.02, 'impact', .4], [.2, 'sad_tone', .5]]);
// 34 «kein einziges Mal gewonnen.»: el gallo canta… y al fondo, en una ventana de la casa, alguien ya celebra; Becker se tapa la cara
shot(49.13, 'W', null, L => { use('GA'); dawn(); show(HAHN, GAX + 6.6, 3.4, 30, .4, 1.1); HAHN.userData.crow(clamp(Math.sin(L.lt * 5))); const c = put(becker, GAX + 11, 0, 34, -.5); actuar(c, 0, [[0, 'facepalm']], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  const w = put(SL[3], GAX - 2, 0, -30, 0); const j = Math.abs(Math.sin(L.T * 7)); w.root.position.y = j * .6; actuar(w, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .45, aRz: .45, aLe: .3, aRe: .3 }]], { T: L.T }); laughF(w, L.T); badge3('gold', '1.', hp(w).add(V(0, 3, 0)), (L.lt - .3) / .2, .9);
  cm([GAX + 16, 6, 46, GAX + 4, 4.5, 10, 46], [GAX + 14, 6.5, 44, GAX + 3, 4.5, 4, 44], L.k); sh(V(GAX + 5, 0, 10), 40); },
  [[.05, 'rooster', .6], [.5, 'cheer', .35], [.9, 'sigh', .5]]);
// 35 «Ich bin der tiefste»: yo, dormido como un tronco en mi cama, boca abierta y babeando un poco; Zzz enormes
shot(50.84, 'F', null, L => { room('KZ', L, { night: true }); const c = lie(ich, KZX - 9, -7.4, 4.15, L, { aRx: 2.6, aRz: .6, aRe: 1.2 }); KZ.quilt.position.y = 4.6; c.setFace({ eyes: 'closed', mouth: Math.sin(L.T * 2) > 0 ? 'yawn' : 'o' }); zzz(c, L.T, 1.2);
  cm([KZX - 4, 11, 2, KZX - 9, 4.4, -5.6, 44], [KZX - 5, 10, 0, KZX - 9, 4.4, -6, 38], L.k); sh(V(KZX - 9, 0, -4), 16); },
  [[.05, 'snore', .7], [.8, 'snore', .5]]);
// 36 «Schläfer der ganzen Stadt.»: grúa por encima de los tejados de noche: todas las ventanas encendidas menos la mía, con una gran «Z» saliendo
shot(52.12, 'Z', null, L => { town(L, 'night', V(0, 0, 40)); const P = V(-47, 14, 34); FX2D.push(c => { const [x, y, z] = proj(P); if (z >= 1) return; for (let i = 0; i < 3; i++) { const t = (L.T * .6 + i / 3) % 1; c.save(); c.globalAlpha = Math.sin(t * PI); c.translate(x + t * 120, y - t * 220); c.font = `700 ${(60 + t * 70) * U}px ${FONT}`; c.textAlign = 'center'; c.lineWidth = 12; c.strokeStyle = '#0e1226'; c.strokeText('Z', 0, 0); c.fillStyle = '#9ad8ff'; c.fillText('Z', 0, 0); c.restore(); } });
  badge('gold', 'NR. 1', W / 2, H * .2, (L.lt - .2) / .2, 1, 1); cm([30, 40, 90, -30, 10, 20, 50], [20, 34, 80, -36, 12, 26, 46], L.k); sh(V(0, 0, 30), 60); },
  [[.05, 'snore_chorus', .5], [.4, 'owl', .4], [.2, 'crickets', .4]]);
// 37 «Dabei weiß ich genau, was ich mir wünschen würde.»: yo de día en la ventana de la plaza, mirando al cielo con una sonrisa; una estrellita brilla en mi mano
shot(53.52, 'I', 'slow', L => { town(L, 'day'); const c = put(ichT, 6, 0, 46, PI - .2); actuar(c, 0, [[0, { aRx: 1.4, aRe: 1.5, aRz: -.2, headX: -.35, headY: .2 }]], { T: L.T }); cara(c, L.T, { eyes: 'happy', mouth: 'smirk' });
  SPK.at(wpos(c.aR.hand).add(V(0, -.6, 0)), L.T, 1, .9, 2.4, 10); onFace(c, 6, .2, -.6, 40, L.k, 4.8); sh(V(6, 0, 46), 20); },
  [[.1, 'sparkle', .5], [.5, 'piano_note', .4]]);
// 38 «Aber ich habe noch nie gewonnen.»: me despierto y el despertador marca 11:00; por la ventana, la fiesta del ganador; me hundo en la almohada
shot(55.36, 'W', null, L => { room('KZ', L); const up = easeOut(clamp((L.lt - .1) / .25)); KZ.quilt.position.y = 4.6; riseBed(ich, KZX - 9, -7.4, up * .8, L, { aLz: .3, aRz: .3, headX: .2 }); cara(ich, L.T, { expr: 'sad' });
  show(WK[0], KZX - 3.6, 3.4, -8.3, 0, 1.1); clockAt(WK[0], '11:00', '#ff4a3a'); badge('red', '11:00', W * .5, H * .2, (L.lt - .15) / .2, 1, 1); fireworks(V(KZX + 4, 9, -30), L.T, 3, 6);
  cm([KZX - 1, 9, 7, KZX - 8, 5, -6, 44], [KZX - 2, 8.6, 5.6, KZX - 8, 5.2, -6, 42], L.k); sh(V(KZX - 8, 0, -4), 16); },
  [[.05, 'yawn_big', .4], [.3, 'cheer', .2], [.8, 'sad_tone', .5]]);
// 39 «Nicht mal an meinem Geburtstag.»: cocina: tarta con 12 velas, Mama y Mia con gorros de fiesta cantando… y yo dormido con la cara junto a la tarta
shot(56.89, 'C', null, L => { room('KU', L); const T0 = V(KUX, 4.75, 0); show(KUCHEN, KUX, 4.75, 1, 0, 1.4); show(CANDLES, KUX, 4.75 + 1.6, 1, 0, 1);
  const c = sit(ich, KUX - 3.4, 2.9, -5.6, 0, L, { lean: .75, headX: .3, aLx: 1.3, aRx: 1.3, aLe: 1.6, aRe: 1.6 }); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T, .9);
  const m = put(mama, KUX + 4, 0, 6.6, PI + .5); actuar(m, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.2 - Math.sin(L.T * 12) * .2, aRz: -.2 - Math.sin(L.T * 12) * .2, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: Math.sin(L.T * 8) > 0 ? 'talk' : 'smile' });
  const mi = put(miaT, KUX + 7.4, 0, 3, -PI / 2 - .3); actuar(mi, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .4, aRz: .4 }]], { T: L.T }); laughF(mi, L.T); badge('gold', '12', W / 2, H * .2, (L.lt - .1) / .2, 1, 1.1);
  cm([KUX - 2, 10, 14, KUX + .5, 5.4, -1, 46], [KUX - 1.4, 9, 12, KUX + .5, 5.4, -1.5, 44], L.k); sh(V(KUX, 0, 0), 18); },
  [[.05, 'party_horn', .5], [.2, 'kids_laugh', .4], [.5, 'snore', .5], [.9, 'party_horn', .3]]);
// ---------- c: duermo en todas partes, Mia, y llega Herr Graufeld (58,3 – 96,9 s) ----------
// Bus (BU): pasillo x = BUX, asientos en x = BUX ± 2,9, z = -15 + k·6 (miran a +z), ventanas a x = ±4,5. Peluquería (SA): sillones en x = SAX + {-10, 0, 10}, z = -4, miran al espejo (-z).
// Panadería (BA): mostrador en z = -2; cola por z > 2. Sótano (KE): catre en (KEX + 6, -2); escalera a la izquierda (x = KEX - 10).
const LEANSLEEP = { headZ: .5, headX: .2, aLz: .05, aRz: .05, aLe: .2, aRe: .2, lean: .05 };
// 40 «Ich schlafe überall in einer Sekunde ein.»: en la plaza, a media frase, me quedo dormido de pie de golpe: cronómetro «1 SEK»
shot(58.34, 'S', null, L => { town(L, 'day'); const c = put(ichT, 0, 0, 40, .2); const k = clamp((L.lt - .7) / .15);
  actuar(c, 0, [[0, { aRx: .8, aRe: 1.2, aRz: .2 }], [.7, { ...LEANSLEEP, crouch: .1, headX: .55 }, { dur: .15 }]], { T: L.T }); if (k < .5) cara(c, L.T, { expr: 'talk', mouth: Math.sin(L.T * 14) > 0 ? 'talk' : 'flat' }); else c.setFace({ eyes: 'closed', mouth: 'o' }); if (k > .5) zzz(c, L.T);
  badge('num', L.lt < .7 ? '0,' + Math.floor(L.lt / .7 * 9) + ' s' : '1 SEK', W / 2, H * .2, 1, 1, 1.1); crowdBox(L, -12, 12, 26, 32, 4, 31, { mode: i => i % 2 ? 'walk' : 'look', dir: PI / 2 });
  onBody(c, 15, .1, .12, 42, L.k, 12, -.1); sh(V(0, 0, 40), 26); },
  [[.1, 'tick', .5], [.4, 'tick', .5], [.7, 'boing_metal', .3], [.75, 'snore', .6]]);
// 41 «Im Bus,»: dormido en el bus con la cabeza contra la ventana; la ciudad pasa fuera; una señora me mira
shot(60.70, 'W', null, L => { use('BU'); inside(1.0, 40); BU.scroll(L.T); const c = sit(ichT, BUX - 2.9, 2.65, -3, 0, L, { ...LEANSLEEP, headZ: .55 }); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T);
  sit(EX[5], BUX + 2.9, 2.65, -3, 0, L, { headY: .5 }); cara(EX[5], L.T, { expr: 'confused' }); sit(EX[6], BUX - 2.9, 2.65, -9, 0, L); cara(EX[6], L.T, { expr: 'neutral' });
  cm([BUX + .4, 7, 10, BUX - 2, 5, -3, 46], [BUX - .2, 6.6, 8, BUX - 2.4, 5, -3, 44], L.k); sh(V(BUX, 0, -3), 16); },
  [[.02, 'wheels', .6], [.2, 'snore', .5]]);
// 42 «beim Friseur,»: dormido en el sillón de la peluquería mientras la peluquera me corta un mechón
shot(61.34, 'S', null, L => { use('SA'); inside(1.0, 42); const c = sit(ichT, SAX, 3.0, -4, PI, L, { ...LEANSLEEP, headZ: -.4 }); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T);
  const f = put(fris, SAX + 2.6, 0, -1.4, PI + .7); actuar(f, 0, [[0, { aRx: 1.6 + Math.sin(L.T * 14) * .12, aRe: 1.2, aRz: -.3, aLx: 1.2, aLe: 1.4, headX: .25 }]], { T: L.T }); cara(f, L.T, { expr: 'confused' });
  cm([SAX - 3, 7.4, -11.5, SAX, 5.6, -3, 46], [SAX - 1.6, 7, -10.6, SAX, 5.6, -3, 42], L.k); sh(V(SAX, 0, -3), 14); },
  [[.02, 'zip', .4], [.2, 'snore', .4]]);
// 43 «und einmal sogar im Stehen,»: de pie, balanceándome dormido, una burbuja de moco; el plano gira a mi alrededor
shot(61.92, 'R', null, L => { use('BA'); inside(1.0, 40); const c = put(ichT, BAX + 3, 0, 8, PI - .5); actuar(c, 0, [[0, { ...LEANSLEEP, sx: Math.sin(L.T * 2.4) * .08, lean: .1 + Math.sin(L.T * 2.4) * .06 }]], { T: L.T }); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T, 1.1);
  orb(L.k, V(BAX + 3, 3.6, 8), null, [14, PI - 1.2, .16, 42], [12, PI - .3, .12, 40]); sh(V(BAX + 3, 0, 8), 16); },
  [[.05, 'snore', .6], [.8, 'snore', .4]]);
// 44 «in der Schlange beim Bäcker.»: la cola de la panadería me adelanta; el panadero grita «NÄCHSTER!» y yo sigo dormido de pie
shot(63.50, 'C', null, L => { use('BA'); inside(1.0, 40); const c = put(ichT, BAX + 3, 0, 8, PI - .5); actuar(c, 0, [[0, LEANSLEEP]], { T: L.T }); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T);
  const b = put(baeck, BAX + 2, 0, -6, 0); actuar(b, 0, [[0, { aRx: 1.6, aRe: .2, aRz: -.1, aLx: .3 }]], { T: L.T }); talk(b, L.T, L.t0, L.t1, 'shout'); bubble(b, 'NÄCHSTER!', (L.lt - .1) / .2, 2.4);
  [EX[7], EX[8]].forEach((e, i) => { put(e, BAX + 5 - i * 3 + L.lt * 2, 0, 5 + i * 3 - L.lt * 2, PI - .3); actuar(e, 0, [[0, walkP(L.T, i)]], { T: L.T }); cara(e, L.T, { expr: 'smug' }); });
  cm([BAX - 8, 8, 18, BAX + 2, 4, 2, 48], [BAX - 6.4, 7.4, 16, BAX + 2, 4.2, 2, 46], L.k); sh(V(BAX + 2, 0, 2), 22); },
  [[.05, 'shout_m', .3], [.1, 'door_bell', .5], [.4, 'steps', .4], [.7, 'snore', .5]]);
// 45 «Wecker funktionieren bei mir nicht.»: el despertador salta como loco en la mesilla y yo ni me muevo
shot(64.44, 'Z', null, L => { room('KZ', L, { dawn: true }); const c = lie(ich, KZX - 9, -7.4, 4.15, L); KZ.quilt.position.y = 4.6; sleepF(c, L.T); zzz(c, L.T);
  KZ.CLOCK.visible = false; const j = Math.sin(L.T * 50) * .15; show(WK[0], KZX - 3.8 + j, 3.4 + Math.abs(j) * 2, -8.3, j * 2, 1.2); clockAt(WK[0], '6:30', '#ff4a3a'); noiseFX(wpos(WK[0]).add(V(0, 1, 0)), L.T, 1, '#ff4a3a');
  cm([KZX - 1, 7, 2, KZX - 5, 4.4, -7, 44], [KZX - 1.4, 6.6, .6, KZX - 5.4, 4.4, -7, 40], L.k); sh(V(KZX - 6, 0, -5), 14); },
  [[.0, 'alarm', .8], [.8, 'snore', .5]]);
// 46 «Mama sagt, ich würde sogar»: Mama en la puerta de la cocina, brazos cruzados, poniendo los ojos en blanco
shot(66.11, 'S', null, L => { room('KU', L); const c = put(mama, KUX - 8, 0, 4, .5); actuar(c, 0, [[0, 'cross']], { T: L.T }); talk(c, L.T, L.t0, L.t1, 'talk', { eyes: L.lt > .5 ? 'up' : 'half' });
  onBody(c, 13, .1, .1, 42, L.k, 10.5, -.1); sh(V(KUX - 8, 0, 4), 16); },
  [[.1, 'sigh', .4]]);
// 47 «ein Silvesterfeuerwerk verschlafen.»: Nochevieja en la plaza: fuegos artificiales y gente brindando; yo dormido en un banco con un gorrito de fiesta
shot(67.27, 'F', null, L => { town(L, 'night', V(16, 0, 4)); bloom.strength = .45; fireworks(V(0, 40, -30), L.T, 4, 30); const c = sit(ichT, 16, 2.0, 4, -PI / 2, L, LEANSLEEP); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T);
  crowdAt(L, 4, 4, 10, 6, 14, 41, { list: EX, mode: i => ['cheer', 'clap', 'cheer', 'point'][i % 4], face: V(0, 40, -30) }); badge('gold', '00:00', W / 2, H * .2, (L.lt - .1) / .2, 1, 1);
  orb(L.k, V(16, 3, 4), null, [16, -PI / 2 - .6, .12, 46], [13, -PI / 2 - .3, .1, 44]); sh(V(14, 0, 4), 24); },
  [[.05, 'firework', .6], [.4, 'firework', .5], [.7, 'cheer', .4], [.9, 'firework', .5], [.3, 'snore', .4]]);
// 48 «Das Einzige, was mich weckt,»: al amanecer en mi cuarto; la puerta se abre despacio con un crujido
shot(68.83, 'I', null, L => { room('KZ', L, { dawn: true }); const c = lie(ich, KZX - 9, -7.4, 4.15, L); KZ.quilt.position.y = 4.6; sleepF(c, L.T); KZ.DOOR.rotation.y = -easeInOut(clamp(L.lt / 1.1)) * 1.2;
  cm([KZX - 2, 9, 12, KZX + 9, 5, 0, 46], [KZX - 1, 9, 10, KZX + 11, 5, 1, 44], L.k); sh(V(KZX, 0, 0), 22); },
  [[.1, 'wood_creak', .6], [.6, 'door_open', .4]]);
// 49 «ist meine kleine Schwester Mia.»: Mia (5) asoma por la puerta con una sonrisa traviesa; «MIA, 5»
shot(70.07, 'C', 'punch', L => { room('KZ', L, { dawn: true }); KZ.DOOR.rotation.y = -1.2; const c = put(mia, KZX + 13, 0, 2, -PI / 2 - .3); actuar(c, 0, [[0, { aLx: .6, aLz: -.3, aLe: 1.6, aRx: .6, aRz: -.3, aRe: 1.6, crouch: .1, lean: .1 }]], { T: L.T }); cara(c, L.T, { eyes: 'squint', mouth: 'grin' });
  badge('tag', 'MIA · 5', W / 2, H * .2, (L.lt - .15) / .2, 1, 1); onBody(c, 12, .1, .1, 40, L.k, 10, -.1, 2.6); sh(V(KZX + 12, 0, 2), 14); },
  [[.02, 'impact', .4], [.2, 'kids_laugh', .4]]);
// 50 «Jeden Morgen um Viertel vor sieben»: primer plano del despertador: 6:44 → 6:45
shot(71.68, 'W', null, L => { room('KZ', L, { dawn: true }); KZ.CLOCK.visible = false; show(WK[0], KZX - 3.6, 3.4, -8.3, .1, 1.3); clockAt(WK[0], L.lt < .7 ? '6:44' : '6:45', L.lt < .7 ? '#ff4a3a' : '#ffd23f');
  cm([KZX - 3.4, 6.2, -3.6, KZX - 3.6, 4.3, -8.3, 30], [KZX - 3.5, 5.6, -4.6, KZX - 3.6, 4.3, -8.3, 26], L.k); sh(V(KZX - 4, 0, -8), 10); },
  [[.1, 'clock_tick', .6], [.7, 'click_metal', .5]]);
// 51 «springt sie auf mein Bett»: Mia salta desde la puerta y aterriza a cuatro patas sobre mi cama; el colchón rebota
shot(73.12, 'R', null, L => { room('KZ', L, { dawn: true }); const c = lie(ich, KZX - 9, -7.4, 4.15, L); KZ.quilt.position.y = 4.6; sleepF(c, L.T);
  saltar(mia, L.lt, .05, { h: 6, dur: .55, base: [KZX - 2, 0, 2], dx: -6, dz: -3 }); if (L.lt > .8) { put(mia, KZX - 8, 4.2, -1, 0); actuar(mia, 0, [[0, { crouch: .5, lean: .3, aLx: 1.2, aRx: 1.2 }]], { T: L.T }); } cara(mia, L.T, { expr: 'joy' });
  cm([KZX + 4, 9, 10, KZX - 7, 4.6, -3, 48], [KZX + 2, 8.6, 8, KZX - 7.6, 4.8, -3, 46], L.k); sh(V(KZX - 6, 0, -2), 18); },
  [[.05, 'jump', .6], [.65, 'spring', .6], [.7, 'thud', .5]]);
// 52 «und schreit mir ins Ohr:»: Mia, a cuatro patas, se acerca a mi oreja con la boca muy abierta
shot(74.24, 'S', null, L => { room('KZ', L, { dawn: true }); const c = lie(ich, KZX - 9, -7.4, 4.15, L); KZ.quilt.position.y = 4.6; sleepF(c, L.T);
  const m = put(mia, KZX - 6.4, 4.2, -5.8, -PI / 2); actuar(m, 0, [[0, { crouch: .6, lean: .8, aLx: 1.6, aRx: 1.6, aLe: .3, aRe: .3, headX: -.2 }]], { T: L.T, weight: false }); m.setFace({ eyes: 'squint', mouth: L.lt > .6 ? 'scream' : 'grin' });
  cm([KZX - 7.6, 7.8, 1, KZX - 8, 4.8, -6.6, 40], [KZX - 7.8, 7.2, -.4, KZX - 8.2, 4.8, -6.8, 36], L.k); sh(V(KZX - 8, 0, -6), 12); },
  [[.1, 'breath', .5], [.6, 'anticip', .5]]);
// 53 «„Aufwachen!“»: primerísimo plano: mis ojos se abren como platos, el pelo se me levanta con la onda del grito
shot(75.51, 'C', 'punch', L => { room('KZ', L, { dawn: true }); const c = lie(ich, KZX - 9, -7.4, 4.15, L); KZ.quilt.position.y = 4.6; c.setFace({ eyes: 'wide', mouth: 'grimace_wide' }); noiseFX(hp(c), L.T, 1, '#ffffff');
  const h = hp(c); cam([h.x + .6, h.y + 4.4, h.z + 1.6], [h.x, h.y, h.z - .3], lerp(36, 32, L.k)); sh(V(KZX - 9, 0, -5), 12); },
  [[.0, 'scream_girl', .3], [.02, 'impact', .6], [.1, 'boing_metal', .4]]);
// 54 «Sie ist 5 und kommt nie zu spät.»: Mia de pie en la cama, brazos en jarras, orgullosa; detrás el despertador marca 6:45
shot(76.35, 'I', null, L => { room('KZ', L, { dawn: true }); const c = put(mia, KZX - 9, 4.2, -2, .3); c.blob.visible = false; actuar(c, 0, [[0, { aLx: .3, aLz: -.5, aLe: 1.8, aRx: .3, aRz: -.5, aRe: 1.8, headX: -.15 }]], { T: L.T }); grin(c, L.T);
  const me = riseBed(ich, KZX - 9, -7.4, .9, L, { aLz: .4, aRz: .4, headX: .2 }); cara(me, L.T, { expr: 'tired' }); KZ.quilt.position.y = 4.6;
  KZ.CLOCK.visible = false; show(WK[0], KZX - 3.6, 3.4, -8.3, -.3, 1.2); clockAt(WK[0], '6:45', '#ffd23f'); badge('gold', '5', W * .5, H * .2, (L.lt - .1) / .2, 1, 1.3);
  onBody(c, 13, .4, .14, 42, L.k, 11, .2, 2.4); sh(V(KZX - 9, 0, -4), 16); },
  [[.1, 'kids_laugh', .4], [.6, 'yawn_big', .4]]);
// 55 «Dann, eines Tages,»: la Lindenstraße de día; una tienda gris con el escaparate tapado con papel; la cámara avanza por la calle
shot(78.41, 'W', null, L => { town(L, 'day'); crowdBox(L, -10, 10, 140, 200, 6, 51, { mode: 'walk', dir: 0, jit: .2 }); cm([-4, 7, 230, 21, 6, 168, 50], [-2, 6.6, 214, 21, 6, 168, 46], L.k); sh(V(16, 0, 180), 50); },
  [[.1, 'city_amb', .5], [.4, 'steps', .3], [.9, 'creepy_ting', .4]]);
// 56 «eröffnete Herr Graufeld einen Laden»: Herr Graufeld (chistera gris, bigote fino) da la vuelta al cartel «GEÖFFNET» y sonríe de lado
shot(79.75, 'S', null, L => { town(L, 'day'); const c = put(grau, 18.4, 0, 170, -PI / 2 - .4); actuar(c, 0, [[0, { aRx: 1.4, aRe: .6, aRz: -.2, aLx: .2 }], [.5, { aRx: 1.0, aRe: 1.4, aRz: .2, aLx: .2, headY: .3 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  badge('tag', 'GEÖFFNET', W / 2, H * .22, (L.lt - .4) / .2, 1, 1); onBody(c, 15, .3, .12, 42, L.k, 12, .1); sh(V(19, 0, 170), 22); },
  [[.1, 'door_bell', .6], [.45, 'click_metal', .4], [.7, 'evil_laugh', .3]]);
// 57 «für Ohrstöpsel»: primer plano del escaparate lleno de tapones de colores; «100 € DAS STÜCK»
shot(81.15, 'Z', null, L => { town(L, 'day'); cm([14.6, 4.2, 173.6, 21.1, 3.4, 171.8, 42], [16.6, 3.8, 172.4, 21.1, 3.4, 171.8, 38], L.k); sh(V(20, 0, 172), 14); },
  [[.1, 'pop', .4], [.3, 'pop', .3], [.5, 'pop', .3]]);
// 58 «in der Lindenstraße.»: el letrero azul de la calle; panorámica hacia arriba
shot(82.55, 'I', null, L => { town(L, 'day'); cm([12, 7, 166, 20.3, 9.6, 162, 44], [13, 9.4, 164.6, 20.3, 9.7, 162, 40], L.k); sh(V(20, 0, 164), 14); },
  [[.05, 'whoosh_up', .4], [.3, 'birds', .4]]);
// 59 «Herr Graufeld war der Einzige in der Stadt,»: al atardecer, todos vuelven a casa bostezando; Graufeld, en medio de la plaza, es el único que va en dirección contraria
shot(83.41, 'R', null, L => { town(L, 'dusk'); const c = put(grau, 0, 0, 30 - L.lt * 2.6, PI); actuar(c, 0, [[0, walkP(L.T * .7, 0)]], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  crowdBox(L, -16, 16, 14, 50, 10, 61, { mode: 'walk', ry: 0, jit: .1, speed: 2.4, list: EX }); orb(L.k, V(0, 3.6, 26), null, [24, PI + .4, .16, 46], [20, PI + .15, .14, 44]); sh(V(0, 0, 26), 30); },
  [[.1, 'steps', .5], [.6, 'yawn_big', .3]]);
// 60 «der bereit war, um Mitternacht aufzuwachen.»: noche cerrada; el reloj de la torre marca las 12; Graufeld lo mira desde abajo, de espaldas a cámara con media cara iluminada
shot(85.20, 'F', 'slow', L => { town(L, 'night', V(0, 0, -60)); TURM.setClock(0, 0, .6); const c = put(grau, 4, 0, -62, PI + .5); actuar(c, 0, [[0, { headX: -.5, aLx: .1, aRx: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  cm([12, 3, -46, 0, 40, -86, 46], [10, 4, -50, 0, 44, -86, 40], L.k); sh(V(2, 0, -70), 40); },
  [[.1, 'owl', .4], [.4, 'bell_far', .6]]);
// 61 «Also ging er um 20 Uhr»: Graufeld baja la escalera del sótano con una vela; el reloj de bolsillo marca 20:00
shot(87.57, 'S', null, L => { use('KE'); inside(.35, 12); FILL.color.setRGB(1, .7, .4); lp(0, KEX - 8, 8, 2, 40, 0xffa040, 26); const t = clamp(L.lt / 1.6); const c = put(grau, KEX - 10, lerp(10, 2, t), lerp(-3, 6, t), PI); actuar(c, 0, [[0, { ...walkP(L.T * .6, 0), aRx: 1.2, aRe: 1.4 }]], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  badge('num', '20:00', W / 2, H * .2, (L.lt - .1) / .2, 1, 1.1); cm([KEX + 2, 9, 14, KEX - 9, 7, 2, 48], [KEX + 1, 7, 13, KEX - 9, 5, 3, 46], L.k); sh(V(KEX - 6, 0, 2), 16); },
  [[.1, 'wood_creak', .5], [.5, 'steps', .5], [1.0, 'wood_creak', .4]]);
// 62 «in seinem stockdunklen Keller schlafen»: el sótano casi a oscuras: Graufeld en un catre, con la chistera sobre el pecho, sonriendo dormido
shot(89.17, 'I', null, L => { use('KE'); inside(.22, 6); FILL.color.setRGB(.6, .7, 1); lp(0, KEX + 6, 6, 2, 16, 0x6a8aff, 18); const c = put(grau, KEX + 6, 3.3, 1.2, .3); c.root.rotation.x = -PI / 2; c.blob.visible = false; actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: -.4, aRz: -.4, aLe: 1.4, aRe: 1.4 }]], { T: L.T, weight: false }); c.setFace({ eyes: 'closed', mouth: 'smirk' }); zzz(c, L.T, .8);
  cm([KEX + 13, 10, 9, KEX + 5.4, 3.4, -1, 44], [KEX + 11, 9, 7, KEX + 5.6, 3.6, -1.2, 40], L.k); sh(V(KEX + 6, 0, -1), 14); },
  [[.05, 'drip', .5], [.4, 'snore', .4]]);
// 63 «und stellte seinen Wecker auf»: su mano gira la ruedecita del despertador
shot(91.05, 'W', null, L => { use('KE'); inside(.25, 8); lp(0, KEX + 2, 6, 2, 20, 0x6a8aff, 18); show(WK[0], KEX + 2, 2.8, 3, -.4, 1.3); clockAt(WK[0], ['23:00', '22:00', '0:00'][Math.min(2, Math.floor(L.lt / .5))], '#ff4a3a');
  cm([KEX + 4.2, 5.6, 6.6, KEX + 2, 3.6, 3, 36], [KEX + 3.8, 5.2, 6, KEX + 2, 3.6, 3, 32], L.k); sh(V(KEX + 2, 0, 3), 10); },
  [[.05, 'ratchet', .6], [.5, 'ratchet', .5], [1.0, 'click_metal', .5]]);
// 64 «0 Uhr.»: el número 0:00 brilla en rojo
shot(92.67, 'C', 'punch', L => { use('KE'); inside(.25, 8); lp(0, KEX + 2, 6, 2, 20, 0xff4a3a, 18); show(WK[0], KEX + 2, 2.8, 3, -.4, 1.3); clockAt(WK[0], '0:00', '#ff4a3a'); badge('red', '0:00', W / 2, H * .22, (L.lt - .05) / .2, 1, 1.3);
  cm([KEX + 3.4, 4.6, 5.4, KEX + 2, 3.6, 3, 30], [KEX + 3.2, 4.4, 5, KEX + 2, 3.6, 3, 28], L.k); sh(V(KEX + 2, 0, 3), 10); },
  [[.02, 'impact', .5], [.1, 'heartbeat', .5]]);
// 65 «Drei Klingeltöne,»: medianoche: el despertador salta tres veces; «1», «2», «3»
shot(93.55, 'Z', null, L => { use('KE'); inside(.3, 10); lp(0, KEX + 2, 6, 2, 26, 0xff6a4a, 18); const n = Math.min(3, Math.floor(L.lt / .28) + 1), j = Math.sin(L.T * 50) * .15 * (L.lt % .28 < .18 ? 1 : 0);
  show(WK[0], KEX + 2 + j, 2.8 + Math.abs(j) * 2, 3, -.4 + j, 1.3); clockAt(WK[0], '0:00', '#ff4a3a'); noiseFX(wpos(WK[0]).add(V(0, 1, 0)), L.T, L.lt % .28 < .18 ? 1 : 0, '#ff4a3a');
  badge('num', String(n), W / 2, H * .22, 1, 1, 1.4); cm([KEX + 5, 6, 8, KEX + 2, 3.6, 3, 40], [KEX + 4.4, 5.6, 7, KEX + 2, 3.6, 3, 36], L.k); sh(V(KEX + 2, 0, 3), 10); },
  [[.0, 'alarm_soft', .7], [.28, 'alarm_soft', .7], [.56, 'alarm_soft', .7]]);
// 66 «und er war wach.»: Graufeld abre los ojos de golpe y se incorpora en el catre con una sonrisa malvada
shot(94.39, 'C', 'punch', L => { use('KE'); inside(.3, 10); lp(0, KEX + 6, 6, 4, 22, 0x8a6aff, 18); const up = easeOut(clamp(L.lt / .25)); const c = put(grau, KEX + 6, lerp(3.3, sitY(grau, 2.6), up), lerp(1.2, -1.5, up), .3); c.root.rotation.x = -PI / 2 + up * PI / 2; c.blob.visible = false;
  actuar(c, 0, [[0, { lLx: 1.5 * up, lRx: 1.5 * up, aLx: .6, aRx: .6 }]], { T: L.T, weight: false }); cara(c, L.T, { eyes: 'wide', mouth: 'smirk' });
  onFace(c, 5, .4, .3, 40, L.k, 4.2); sh(V(KEX + 6, 0, -1), 12); },
  [[.0, 'cloth', .6], [.1, 'evil_laugh', .4]]);
// 67 «Oma hatte keine Chance.»: 4:00 en casa de Oma: se sienta de golpe… y ve que ya es tarde: brazos caídos, cara de pena
shot(95.49, 'W', null, L => { room('OZ', L, { night: true }); OZ.quilt.position.y = 4.55; riseBed(oma, OZX + 3.4, -6.6, 1, L, { aLz: .1, aRz: .1, headX: .3 }); cara(oma, L.T, { expr: 'sad' });
  show(WK[0], OZX + 10, 3.4, -8.2, -.4, 1); clockAt(WK[0], '4:00', '#ff4a3a'); badge('red', 'ZU SPÄT', W / 2, H * .2, (L.lt - .2) / .2, 1, 1);
  cm([OZX + 8, 9, 6, OZX + 3.4, 5.6, -5.4, 44], [OZX + 7, 8.6, 4.6, OZX + 3.4, 5.6, -5.4, 40], L.k); sh(V(OZX + 4, 0, -5), 14); },
  [[.1, 'sad_tone', .5], [.5, 'sigh', .4]]);
// ---------- d: el deseo de Graufeld, la ciudad sin sueño y el final (96,9 – 176 s) ----------
// Plaza de noche: banco del final en (0, -64) mirando +z (asiento ≈ 1,5); la torre detrás en (0, -86) con la campana a y ≈ 66.
const SEAT = 1.5, BZ = -64;
const benchSit = (c, x, L, pose = {}) => sit(c, x, SEAT, BZ + .2, 0, L, { aLx: .4, aRx: .4, aLe: .5, aRe: .5, ...pose });
function plazaNight(L, n = 18, mode = 'sitears', seed = 71, o = {}) { town(L, 'night', V(0, 0, BZ + 14)); crowdBox(L, o.x0 ?? -26, o.x1 ?? 26, o.z0 ?? BZ + 10, o.z1 ?? BZ + 40, n, seed, { list: SL, mode, seat: .9, jit: .5, ...o }); }
const bellSwing = (T, k = 1) => { TURM.BELL.rotation.x = Math.sin(T * 5) * .55 * k; };
// 68 «In der ersten Nacht wünschte er sich,»: Graufeld en la calle a medianoche, brazos abiertos; un remolino de chispas moradas sube al cielo
shot(96.87, 'F', 'slow', L => { town(L, 'night', V(0, 0, 40)); const c = put(grau, 0, 0, 40, 0); actuar(c, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: 1.0, aRz: 1.0, aLe: .3, aRe: .3, headX: -.3 }]], { T: L.T }); cara(c, L.T, { eyes: 'squint', mouth: 'grin' });
  SPK.S.forEach(s => s.material.color.setHex(0xc89aff)); SPK.at(V(0, 0, 40), L.T, 1, 4, 14, 34);
  orb(L.k, V(0, 4, 40), null, [20, .1, .05, 44], [15, -.05, .02, 40]); sh(V(0, 0, 40), 24); },
  [[.1, 'magic_hit', .6], [.3, 'evil_laugh', .5], [.8, 'drone', .4]]);
// 69 «dass jede Glocke,»: la campana de la torre empieza a voltear sola; ondas de ruido
shot(98.57, 'C', 'punch', L => { town(L, 'night', V(0, 0, -86)); TURM.BL.intensity = 30; bellSwing(L.T); noiseFX(V(0, 60, -78), L.T, 1);
  cm([0, 52, -44, 0, 62, -86, 44], [0, 54, -50, 0, 63, -86, 40], L.k); sh(V(0, 50, -86), 30); },
  [[.0, 'bells', .7], [.4, 'bells7', .5]]);
// 70 «jeder Hund»: tres perros salchicha ladran en un portal
shot(99.65, 'W', null, L => { town(L, 'night', V(-36, 0, 20)); DOGS.forEach((d, i) => { show(d, -38 + i * 3.2, 0, 20 + (i % 2) * 2, PI / 2 + (i - 1) * .3, 1.2); d.position.y = Math.abs(Math.sin(L.T * 14 + i)) * .4; }); noiseFX(V(-35, 3, 21), L.T, 1, '#ff8a4a');
  cm([-24, 5, 34, -35, 2.4, 20, 44], [-26, 4.4, 30, -35, 2.4, 20, 40], L.k); sh(V(-35, 0, 20), 16); },
  [[.0, 'bark', .7], [.25, 'bark', .6], [.5, 'growl', .4]]);
// 71 «und jede Hupe in der Stadt»: dos coches aparcados pitan con los faros encendidos
shot(100.43, 'S', null, L => { town(L, 'night', V(0, 0, 110)); show(CARS[0], -6, 0, 112, .2, 1); show(CARS[1], 6, 0, 126, -.2, 1); const on = Math.sin(L.T * 18) > 0; lp(2, -6, 3, 118, on ? 60 : 10, 0xfff0c0, 30); lp(3, 6, 3, 132, on ? 10 : 60, 0xfff0c0, 30); noiseFX(V(-6, 4, 112), L.T, 1, '#ffd23f'); noiseFX(V(6, 4, 126), L.T + .3, 1, '#ffd23f');
  cm([2, 6, 146, 0, 3, 116, 46], [0, 5, 140, 0, 3, 116, 42], L.k); sh(V(0, 0, 118), 24); },
  [[.0, 'horn_blast', .6], [.3, 'horn_blast', .5], [.6, 'car', .4]]);
// 72 «die ganze Nacht Lärm macht.»: vista aérea de Sternau de noche: ondas de ruido saliendo de todos lados
shot(101.53, 'Z', null, L => { town(L, 'night', V(0, 0, 0)); bellSwing(L.T); TURM.BL.intensity = 30; for (const p of [V(0, 60, -80), V(-36, 4, 20), V(0, 4, 116), V(30, 4, -40), V(-20, 4, -60)]) noiseFX(p, L.T + p.x, .9);
  cm([60, 80, 120, 0, 10, -20, 50], [50, 90, 110, 0, 10, -20, 52], L.k); sh(V(0, 0, 0), 90); },
  [[.0, 'bells', .5], [.2, 'bark', .4], [.5, 'horn_blast', .4], [.9, 'bark', .3]]);
// 73 «Es war so laut,»: un vecino en su cama, la almohada apretada contra la cabeza
shot(103.15, 'I', null, L => { room('SZ', L, { night: true }); const c = SL[6]; riseBed(c, SZX + 3.2, -6.6, .7, L, { aLx: 2.4, aRx: 2.4, aLz: .3, aRz: .3, aLe: 2.3, aRe: 2.3, headX: .2 }); SZ.quilt.position.y = 4.55; cara(c, L.T, { eyes: 'squint', mouth: 'grimace_wide' }); noiseFX(hp(c), L.T, .8, '#ffd23f');
  cm([SZX + 7, 9, 6, SZX + 3, 5.4, -4.6, 42], [SZX + 6.4, 8.6, 4.6, SZX + 3, 5.6, -4.8, 38], L.k); sh(V(SZX + 3, 0, -4), 14); },
  [[.0, 'bells', .3], [.2, 'cloth', .5], [.4, 'shout_m', .3]]);
// 74 «dass niemand mehr schlafen konnte.»: ventanas de la plaza encendidas; en cada una, un vecino despierto con ojeras
shot(104.25, 'R', null, L => { town(L, 'night', V(-44, 0, 10)); crowdBox(L, -45, -41, -10, 34, 6, 81, { list: SL, mode: 'tired', ry: PI / 2, jit: .1 }); bellSwing(L.T, .5);
  cm([-14, 6, 34, -46, 5, 8, 46], [-16, 6, 28, -46, 5, 10, 44], L.k); sh(V(-40, 0, 12), 28); },
  [[.0, 'yawn_big', .4], [.4, 'bark', .3], [.8, 'sigh', .4]]);
// 75 «Und wer nicht schläft, kann auch nicht aufwachen.»: Oma en su cama con los ojos como platos mirando al techo; el despertador pasa de 3:59 a 4:00 y no pasa nada
shot(105.87, 'S', null, L => { room('OZ', L, { night: true }); const c = lie(oma, OZX + 3.4, -6.6, 4.15, L); OZ.quilt.position.y = 4.55; c.setFace({ eyes: 'wide', mouth: 'flat' });
  show(WK[0], OZX + 10, 3.4, -8.2, -.4, 1); clockAt(WK[0], L.lt < 1 ? '3:59' : '4:00', '#ff4a3a'); cm([OZX + 3.4, 13, -2, OZX + 3.4, 4.4, -5.6, 42], [OZX + 3.6, 11.6, -3, OZX + 3.4, 4.4, -5.8, 38], L.k); sh(V(OZX + 3, 0, -5), 14); },
  [[.1, 'clock_tick', .5], [.7, 'clock_tick', .5], [1.2, 'sad_tone', .4]]);
// 76 «Also gewann Herr Graufeld jeden einzelnen Tag.»: en el sótano, a las 0:00, Graufeld celebra con chispas moradas; «TAG 1, 2, 3…»
shot(107.88, 'W', null, L => { use('KE'); inside(.4, 14); lp(0, KEX + 4, 6, 4, 30, 0xb08aff, 24); const c = put(grau, KEX + 3, 0, 2, .3); const j = Math.abs(Math.sin(L.T * 7)); c.root.position.y = j * .7; actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, aLe: .3, aRe: .3 }]], { T: L.T }); cara(c, L.T, { eyes: 'happy', mouth: 'grin' });
  SPK.S.forEach(s => s.material.color.setHex(0xc89aff)); SPK.at(V(KEX + 3, 0, 2), L.T, 1, 3, 8, 26); badge('gold', 'TAG ' + (Math.floor(L.lt / .55) + 1), W / 2, H * .2, 1, 1, 1.1);
  onBody(c, 15, .3, .14, 44, L.k, 12, .1); sh(V(KEX + 3, 0, 2), 16); },
  [[.0, 'evil_laugh', .5], [.5, 'magic_hit', .4], [1.1, 'magic_hit', .4], [1.7, 'magic_hit', .4]]);
// 77 «Er verkaufte Ohrstöpsel für 100 Euro das Stück.»: cola de vecinos con ojeras ante la tienda; Graufeld cobra billetes y da un tapón
shot(110.56, 'C', null, L => { town(L, 'day'); const c = put(grau, 18.4, 0, 171, -PI / 2); actuar(c, 0, [[0, { aRx: 1.5, aRe: .3, aRz: -.1, aLx: 1.2, aLe: 1.5 }]], { T: L.T }); cara(c, L.T, { expr: 'smug' }); attach(PLUGS[0], c.aR.hand, [0, -.5, .3], [0, 0, 0], .8);
  for (let i = 0; i < 5; i++) { const e = put(SL[10 + i], 14.6 - i * 3.2, 0, 171 + i * .4, PI / 2); actuar(e, 0, [[0, i === 0 ? { aRx: 1.4, aRe: .3 } : { lean: .15, headX: .3 }]], { T: L.T }); e.setFace({ eyes: 'half', mouth: 'wavy' }); }
  attach(BUNDLES[0], SL[10].aR.hand, [0, -.5, .5], [0, 0, 0], .5); badge('red', '100 €', W / 2, H * .2, (L.lt - .2) / .2, 1, 1.2);
  cm([10, 7, 186, 17, 4, 171, 46], [12, 6.4, 183, 17, 4, 171, 44], L.k); sh(V(15, 0, 172), 22); },
  [[.1, 'cash_reg', .6], [.6, 'cash', .5], [1.2, 'yawn_big', .3], [1.8, 'coin_flip', .4]]);
// 78 «Aber gegen einen Wunsch hilft kein Ohrstöpsel.»: un vecino con dos tapones naranjas en las orejas, en la cama; las ondas de ruido le atraviesan igual
shot(113.58, 'I', null, L => { room('SZ', L, { night: true }); const c = lie(SL[10], SZX + 3.2, -6.6, 4.15, L); SZ.quilt.position.y = 4.55; c.setFace({ eyes: 'wide', mouth: 'grimace' });
  const h = c.head; attach(PLUGS[1], h, [.72, .7, 0], [0, 0, PI / 2], .7); attach(PLUGS[2], h, [-.72, .7, 0], [0, 0, -PI / 2], .7); noiseFX(hp(c), L.T, 1, '#ffd23f');
  cm([SZX + 3.2, 11, -1, SZX + 3.2, 4.4, -5.8, 40], [SZX + 3.2, 10, -2, SZX + 3.2, 4.4, -6, 36], L.k); sh(V(SZX + 3, 0, -5), 12); },
  [[.0, 'bells', .4], [.3, 'bark', .3], [.9, 'sigh', .4]]);
// 79 «Und jeden Morgen wünschte er sich etwas Neues von uns.»: Graufeld en la plaza, señala la ciudad con una sonrisa codiciosa; chispas moradas en la mano
shot(115.80, 'S', 'slow', L => { town(L, 'dawn'); const c = put(grau, 0, 0, 20, PI); actuar(c, 0, [[0, { aRx: 1.62, aRz: -.08, aRe: .05, aLx: .9, aLz: -.4, aLe: 1.6, headX: -.05 }]], { T: L.T }); cara(c, L.T, { eyes: 'squint', mouth: 'grin' });
  SPK.S.forEach(s => s.material.color.setHex(0xc89aff)); SPK.at(wpos(c.aL.hand), L.T, 1, 1.2, 3, 16); crowdBox(L, -20, 20, -40, -20, 8, 91, { list: EX, mode: 'shock', face: V(0, 4, 20) });
  cm([3, 6, 34, 0, 5, 8, 44], [2, 5.6, 30, 0, 5, 6, 40], L.k); sh(V(0, 0, 10), 30); },
  [[.1, 'evil_laugh', .4], [.6, 'magic_hit', .4]]);
// 80 «Am zweiten Tag unser ganzes Geld.»: los billetes salen volando de la cartera de Papa hacia la tienda de Graufeld; «TAG 2»
shot(118.55, 'W', null, L => { town(L, 'day'); const c = put(papa, -4, 0, 30, .4); actuar(c, 0, [[0, { aRx: 1.5, aRe: .4, aLx: 1.2, aLe: 1.3 }], [.5, 'shock', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: L.lt < .5 ? 'neutral' : 'shock' });
  BUNDLES.forEach((b, i) => { const t = clamp(L.lt * 1.3 - i * .05); if (t <= 0) return; show(b, lerp(-3, 30, t), 4 + Math.sin(t * PI) * 8 + i * .2, lerp(30, -20, t) + (i % 3) * 2, t * 9 + i, .55); });
  badge('gold', 'TAG 2', W / 2, H * .18, (L.lt - .05) / .2, 1, 1); orb(L.k, V(-3, 3.6, 30), null, [16, .5, .14, 44], [13, .3, .12, 42]); sh(V(-3, 0, 30), 22); },
  [[.1, 'money_rain', .6], [.4, 'whoosh', .5], [.6, 'gasp', .4]]);
// 81 «Am dritten Tag Leas Million.»: el montón de billetes de Lea se desvanece de golpe; Lea llora
shot(120.44, 'Z', null, L => { room('MZ', L); GELD.userData.setH(1 - easeIn(clamp(L.lt / 1.1))); const c = put(lea, MZX - 2, 0, 3, .3); actuar(c, 0, [[0, 'hands_face']], { T: L.T }); cara(c, L.T, { expr: 'cry' }); tears(c, L.T);
  SPK.S.forEach(s => s.material.color.setHex(0xc89aff)); SPK.at(V(MZX + 9, 0, -6), L.T, 1, 6, 12, 26); badge('gold', 'TAG 3', W / 2, H * .18, (L.lt - .05) / .2, 1, 1);
  cm([MZX - 8, 9, 18, MZX + 3, 6, -2, 50], [MZX - 7, 8.4, 15, MZX + 2, 6, -2, 48], L.k); sh(V(MZX + 2, 0, -2), 20); },
  [[.05, 'magic_hit', .5], [.2, 'whoosh_up', .5], [.6, 'cry_girl', .4]]);
// 82 «Am vierten Tag Mias Fahrrad.»: la bici rosa de Mia se eleva y se va volando; Mia estira los brazos llorando
shot(122.12, 'S', null, L => { town(L, 'day'); const t = clamp((L.lt - .2) / 1.2); show(BIKE, lerp(3, 14, t), easeIn(t) * 14, lerp(36, 10, t), t * 3, .7); const c = put(miaT, -1, 0, 38, .6); actuar(c, 0, [[0, { aLx: 2.0, aRx: 2.0, aLe: .2, aRe: .2, lean: .1, headX: -.3 }]], { T: L.T }); cara(c, L.T, { expr: 'cry' }); tears(c, L.T);
  SPK.S.forEach(s => s.material.color.setHex(0xc89aff)); SPK.at(wpos(BIKE), L.T, 1, 2, 3, 16); badge('gold', 'TAG 4', W / 2, H * .18, (L.lt - .05) / .2, 1, 1);
  orb(L.k, V(2, 4, 34), null, [18, -.4, .2, 46], [15, -.2, .26, 44]); sh(V(2, 0, 34), 22); },
  [[.1, 'magic_hit', .4], [.3, 'whoosh_up', .5], [.5, 'cry_girl', .5]]);
// 83 «Dann Omas Kürbisse.»: las calabazas gigantes ruedan solas fuera del huerto; Oma intenta frenar una
shot(123.89, 'R', null, L => { use('GA'); day('day'); GA.CAL.forEach((k, i) => { const t = clamp(L.lt * .9 - i * .05); k.position.z += t * 30; k.rotation.x = t * 6; });
  const c = put(oma, GAX - 3, 0, 18, PI); actuar(c, 0, [[0, { aLx: 1.6, aRx: 1.6, aLe: .3, aRe: .3, lean: -.2, lLx: -.4, lRx: .4, crouch: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'shock' });
  cm([GAX + 12, 8, 50, GAX, 3, 14, 48], [GAX + 10, 7, 46, GAX, 3, 18, 46], L.k); sh(V(GAX, 0, 20), 34); },
  [[.05, 'rubble', .5], [.4, 'thud', .5], [.6, 'gasp_old', .4]]);
// 84 «Am sechsten Tag gehörten ihm sogar unsere Häuser,»: un cartel «ZU VERKAUFEN · GRAUFELD» delante de nuestra casa; Papa, Mama y Mia salen con la cabeza baja
shot(125.15, 'I', null, L => { town(L, 'dusk'); show(SCH, -39, 2.6, 22, PI / 2, 1); badge('gold', 'TAG 6', W / 2, H * .18, (L.lt - .05) / .2, 1, 1);
  [[papa, -42, 30], [mama, -43, 34], [mia, -41, 38]].forEach(([c, x, z], i) => { put(c, x + L.lt * 2.4, 0, z, PI / 2 + .3); actuar(c, 0, [[0, { ...walkP(L.T * .6, i), headX: .35, aLz: .05, aRz: .05 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' }); });
  cm([-18, 6, 40, -40, 5, 28, 46], [-20, 6, 36, -40, 5, 30, 44], L.k); sh(V(-38, 0, 30), 22); },
  [[.1, 'steps', .5], [.6, 'sad_tone', .4], [1.4, 'door_crash', .3]]);
// 85 «und die ganze Stadt saß draußen auf dem Marktplatz.»: grúa sobre la plaza de noche: todo el pueblo sentado en el suelo en pijama, con mantas, tapándose las orejas
shot(127.70, 'W', 'slow', L => { plazaNight(L, 26, 'sitears', 101, { x0: -30, x1: 30, z0: -40, z1: 40 }); bellSwing(L.T, .4);
  cm([0, 16, 70, 0, 2, 0, 50], [0, 34, 60, 0, 0, -6, 52], L.k); sh(V(0, 0, 0), 60); },
  [[.1, 'crowd_run', .3], [.3, 'bells', .3], [.8, 'bark', .3], [1.4, 'horn_blast', .3]]);
// 86 «Papa stellte 12 Wecker»: Papa sentado en la plaza rodeado de 12 despertadores; el contador sube
shot(130.18, 'C', null, L => { plazaNight(L, 10, 'sitears', 111); const P = V(4, 0, 6); const c = sit(papa, P.x, .9, P.z, .2, L, { aRx: 1.2 + Math.sin(L.T * 9) * .2, aRe: .4, lean: .3 }); cara(c, L.T, { expr: 'determined' }); const n = Math.min(12, Math.floor(L.lt / 1.1 * 12) + 1);
  for (let i = 0; i < n; i++) { const a = i / 12 * PI * 2; show(WK[i], P.x + Math.cos(a) * 4, 0, P.z + Math.sin(a) * 4, -a + PI / 2, .9); clockAt(WK[i], '23:00', ['#ff4a3a', '#7af0ff', '#ffd23f'][i % 3]); }
  badge('num', String(n), W / 2, H * .2, 1, 1, 1.3); cm([P.x + 4, 9, P.z + 14, P.x, 2, P.z, 46], [P.x + 3, 8.4, P.z + 12, P.x, 2.4, P.z, 44], L.k); sh(V(P.x, 0, P.z), 16); },
  [[.05, 'click_metal', .5], [.3, 'click_metal', .5], [.55, 'click_metal', .5], [.8, 'click_metal', .5], [1.05, 'click_metal', .5]]);
// 87 «und trug 3 Paar Ohrstöpsel.»: primer plano de Papa con tres tapones en cada oreja, como un erizo; «3»
shot(131.42, 'Z', 'punch', L => { plazaNight(L, 6, 'sitears', 121); const P = V(4, 0, 6); const c = sit(papa, P.x, .9, P.z, .2, L, { lean: .1 }); c.setFace({ eyes: 'squint', mouth: 'grimace' });
  for (let i = 0; i < 6; i++) { const s = i < 3 ? 1 : -1, k = i % 3; attach(PLUGS[i], c.head, [s * (.7 + k * .35), .7 + (k - 1) * .18, (k - 1) * .2], [0, 0, s * PI / 2], .7); }
  badge('gold', '3', W / 2, H * .2, (L.lt - .1) / .2, 1, 1.3); onFace(c, 5.4, .3, .2, 40, L.k, 4.6); sh(V(P.x, 0, P.z), 12); },
  [[.02, 'pop', .5], [.2, 'pop', .5], [.4, 'pop', .5], [.8, 'bells', .3]]);
// 88 «Trotzdem konnte er nicht schlafen.»: Papa con los ojos como platos, temblando; ondas de ruido
shot(133.31, 'S', null, L => { plazaNight(L, 6, 'sitears', 131); const P = V(4, 0, 6); const c = sit(papa, P.x, .9, P.z, .2, L, { ...shiver(L.T, 2), lean: .1 }); c.setFace({ eyes: 'wide', mouth: 'wavy' });
  for (let i = 0; i < 6; i++) { const s = i < 3 ? 1 : -1, k = i % 3; attach(PLUGS[i], c.head, [s * (.7 + k * .35), .7 + (k - 1) * .18, (k - 1) * .2], [0, 0, s * PI / 2], .7); } noiseFX(hp(c), L.T, 1);
  onFace(c, 6.4, .3, -.6, 42, L.k, 5.4); sh(V(P.x, 0, P.z), 12); },
  [[.0, 'bells', .4], [.3, 'bark', .3], [.6, 'shiver', .5]]);
// 89 «Oma zählte Schafe bis 5000.»: Oma, en su manta, con los ojos cerrados; ovejas saltan una valla sobre su cabeza; contador 4998 → 5000
shot(134.94, 'I', null, L => { plazaNight(L, 6, 'sitears', 141); const P = V(-8, 0, 2); const c = sit(oma, P.x, .9, P.z, .3, L, { aLx: .8, aRx: .8, aLe: 1.4, aRe: 1.4 }); c.setFace({ eyes: 'closed', mouth: Math.sin(L.T * 9) > 0 ? 'talk' : 'flat' });
  SHEEP.forEach((s, i) => { const t = (L.lt * 1.4 + i / SHEEP.length) % 1; show(s, P.x + lerp(-6, 6, t), 7 + Math.sin(t * PI) * 3, P.z - 1, PI / 2, .6); });
  badge('num', String(Math.min(5000, 4997 + Math.floor(L.lt / .5))), W / 2, H * .2, 1, 1, 1.2); cm([P.x + 2, 6, P.z + 18, P.x, 6, P.z, 46], [P.x + 1.6, 6, P.z + 15, P.x, 6, P.z, 44], L.k); sh(V(P.x, 0, P.z), 16); },
  [[.1, 'baa', .5], [.5, 'baa', .4], [.9, 'baa', .4], [1.3, 'count', .4]]);
// 90 «Mama kniff die Augen so fest zu, dass sie Kopfschmerzen bekam.»: Mama aprieta los ojos con fuerza; luego se lleva las manos a la cabeza con estrellitas girando
shot(137.13, 'C', null, L => { plazaNight(L, 6, 'sitears', 151); const P = V(10, 0, -2); const k = L.lt > 1.4; const c = sit(mama, P.x, .9, P.z, -.3, L, k ? { aLx: 2.55, aLz: .55, aRx: 2.55, aRz: .55, aLe: 2.0, aRe: 2.0 } : { aLx: 1.0, aRx: 1.0, aLe: 1.8, aRe: 1.8, lean: .15, ...shiver(L.T, 1.5) });
  c.setFace({ eyes: k ? 'squint' : 'closed', mouth: k ? 'grimace_wide' : 'grimace' }); if (k) SPK.at(hp(c).add(V(0, 1.2, 0)), L.T * 2, 1, 1.4, .4, 8);
  onFace(c, 6, .3, .4, 40, L.k, 4.8); sh(V(P.x, 0, P.z), 12); },
  [[.1, 'shiver', .4], [1.4, 'boing_metal', .4], [1.6, 'sparkle', .4]]);
// 91 «Nichts half.»: plano general: todos despiertos, hundidos, en la plaza
shot(140.29, 'W', null, L => { plazaNight(L, 24, i => i % 3 ? 'sitears' : 'tired', 161, { x0: -26, x1: 26, z0: -30, z1: 30 }); put(papa, 4, sitY(papa, .9), 6, .2); put(mama, 10, sitY(mama, .9), -2, -.3); put(oma, -8, sitY(oma, .9), 2, .3);
  for (const c of [papa, mama, oma]) { actuar(c, 0, [[0, sitPose({ lean: .25, headX: .4 })]], { T: L.T, weight: false }); c.setFace({ eyes: 'half', mouth: 'wavy' }); c.blob.visible = false; }
  cm([0, 20, 54, 0, 2, 0, 48], [0, 22, 50, 0, 2, 0, 46], L.k); sh(V(0, 0, 0), 50); },
  [[.1, 'sigh', .5], [.3, 'crickets', .3]]);
// 92 «Glocken,»: la campana volteando, desde abajo
shot(141.16, 'C', 'punch', L => { town(L, 'night', V(0, 0, -86)); TURM.BL.intensity = 30; bellSwing(L.T * 1.4); noiseFX(V(0, 60, -78), L.T, 1); cm([4, 40, -60, 0, 62, -86, 40], [3, 41, -62, 0, 63, -86, 36], L.k); sh(V(0, 50, -86), 30); },
  [[.0, 'bells', .7]]);
// 93 «Hunde,»: los perros ladrando a cámara
shot(141.72, 'S', null, L => { town(L, 'night', V(-6, 0, 30)); DOGS.forEach((d, i) => { show(d, -8 + i * 3, 0, 30, 0, 1.3); d.position.y = Math.abs(Math.sin(L.T * 14 + i)) * .4; }); noiseFX(V(-5, 2.6, 31), L.T, 1, '#ff8a4a'); cm([-5, 3, 42, -5, 2, 30, 42], [-5, 2.8, 39, -5, 2, 30, 38], L.k); sh(V(-5, 0, 30), 12); },
  [[.0, 'bark', .7], [.25, 'bark', .6]]);
// 94 «Hupen.»: faros y bocina en primer plano
shot(142.22, 'Z', 'punch', L => { town(L, 'night', V(0, 0, 112)); show(CARS[1], 0, 0, 112, 0, 1); lp(2, 0, 2.4, 118, Math.sin(L.T * 22) > 0 ? 80 : 20, 0xfff0c0, 30); noiseFX(V(0, 3, 117), L.T, 1, '#ffd23f'); cm([2, 4, 128, 0, 2.4, 114, 44], [1.4, 3.6, 125, 0, 2.4, 114, 40], L.k); sh(V(0, 0, 114), 14); },
  [[.0, 'horn_blast', .7]]);
// 95 «Jede Minute.»: las agujas del reloj de la torre giran deprisa
shot(142.78, 'R', null, L => { town(L, 'night', V(0, 0, -86)); const m = Math.floor(L.lt * 60) % 60; TURM.setClock(23, m, .6); cm([0, 44, -66, 0, 44, -86, 32], [0, 44, -68, 0, 44, -86, 28], L.k); sh(V(0, 40, -86), 20); },
  [[.0, 'clock_spin', .6], [.3, 'clock_tick', .4]]);
// 96 «Um 23:57 Uhr»: el reloj de la torre se para en las 11:57 y el reloj de pulsera de Mia lo confirma: 23:57
shot(143.62, 'C', 'punch', L => { town(L, 'night', V(0, 0, -86)); TURM.setClock(23, 57, .6); badge('num', '23:57', W / 2, H * .62, (L.lt - .1) / .2, 1, 1.2); cm([0, 44, -64, 0, 44, -86, 34], [0, 44, -66, 0, 44, -86, 30], L.k); sh(V(0, 40, -86), 20); },
  [[.02, 'impact', .5], [.2, 'clock_tick', .5], [1.0, 'clock_tick', .5]]);
// 97 «saß ich mit Mia auf einer Bank am Marktplatz.»: yo y Mia en el banco, en pijama, con la torre detrás; alrededor, todo el pueblo despierto
shot(145.46, 'W', null, L => { plazaNight(L, 14, 'sitears', 171, { z0: BZ + 12, z1: BZ + 40 }); benchSit(ich, -1, L, { headX: .2 }); cara(ich, L.T, { expr: 'tired' }); benchSit(mia, 1.2, L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6 }); cara(mia, L.T, { expr: 'sad' });
  TURM.setClock(23, 57, .6); cm([6, 6, BZ + 22, 0, 9, BZ - 6, 50], [4, 5, BZ + 18, 0, 9, BZ - 4, 48], L.k); sh(V(0, 0, BZ), 20); },
  [[.1, 'bells', .3], [.6, 'bark', .3], [1.2, 'sigh', .4]]);
// 98 «Und ich gähnte.»: primer plano: bostezo enorme
shot(147.64, 'C', 'punch', L => { plazaNight(L, 4, 'sitears', 181, { z0: BZ + 12, z1: BZ + 30 }); const c = benchSit(ich, -1, L, { headX: -.25, aLx: 2.6, aRx: 2.6, aLz: .4, aRz: .4, aLe: 1.6, aRe: 1.6 }); c.setFace({ eyes: 'closed', mouth: 'yawn' });
  onFace(c, 5, .3, .2, 40, L.k, 4.4); sh(V(-1, 0, BZ), 12); },
  [[.05, 'yawn_big', .8]]);
// 99 «Da fiel es mir ein.»: abro los ojos de golpe; una «!» sobre mi cabeza
shot(148.98, 'F', null, L => { plazaNight(L, 4, 'sitears', 191, { z0: BZ + 12, z1: BZ + 30 }); const c = benchSit(ich, -1, L, { aRx: 1.9, aRz: -.5, aRe: 2.3, headY: .1 }); c.setFace({ eyes: 'wide', mouth: 'o' }); badge3('q', '!', hp(c).add(V(0, 2.6, 0)), (L.lt - .05) / .2, 1.1);
  onFace(c, 5.6, .3, -.3, 40, L.k, 4.8); sh(V(-1, 0, BZ), 12); },
  [[.02, 'ding_soft', .7], [.1, 'sparkle', .4]]);
// 100 «Man muss wirklich aufwachen.»: recuerdo (en sepia): Graufeld despertándose de golpe en su sótano
shot(150.04, 'G', null, L => { use('KE'); inside(.4, 14); lp(0, KEX + 6, 6, 4, 26, 0x8a6aff, 18); grade.uniforms.sepia.value = .7; const up = easeOut(clamp(L.lt / .3)); const c = put(grau, KEX + 6, lerp(3.3, sitY(grau, 2.6), up), lerp(1.2, -1.5, up), .3); c.root.rotation.x = -PI / 2 + up * PI / 2; c.blob.visible = false;
  actuar(c, 0, [[0, { lLx: 1.5 * up, lRx: 1.5 * up, aLx: .6, aRx: .6 }]], { T: L.T, weight: false }); cara(c, L.T, { eyes: 'wide', mouth: 'smirk' }); cm([KEX + 12, 8, 8, KEX + 5.6, 4, -1, 44], [KEX + 11, 7.4, 6.6, KEX + 5.6, 4.4, -1, 40], L.k); sh(V(KEX + 6, 0, -1), 14); },
  [[.0, 'glitch', .4], [.1, 'alarm_soft', .4]]);
// 101 «Und aufwachen kann nur, wer vorher geschlafen hat.»: yo en el banco, pensativo, con un bocadillo: una cama con «Zzz» → un sol
shot(151.58, 'S', null, L => { plazaNight(L, 8, 'sitears', 201, { z0: BZ + 12, z1: BZ + 36 }); const c = benchSit(ich, -1, L, { aRx: 1.95, aRz: -.5, aRe: 2.35, headY: .2 }); cara(c, L.T, { expr: 'determined' }); bubble(c, L.lt < 1.1 ? 'Zzz… ' : 'Zzz → ☀', (L.lt - .1) / .2, 2.4);
  benchSit(mia, 1.2, L, { headY: -.4 }); cara(mia, L.T, { expr: 'confused' }); cm([2, 5.4, BZ + 13, -.5, 4, BZ, 44], [1.4, 5, BZ + 11, -.5, 4, BZ, 42], L.k); sh(V(0, 0, BZ), 14); },
  [[.1, 'pop', .4], [1.1, 'ding_soft', .4]]);
// 102 «Und bei diesem Lärm kann hier niemand schlafen.»: grúa por encima del pueblo despierto; ruido por todas partes
shot(154.01, 'R', null, L => { plazaNight(L, 26, i => i % 2 ? 'sitears' : 'tired', 211, { x0: -30, x1: 30, z0: -40, z1: 40 }); bellSwing(L.T, .6); for (const p of [V(0, 60, -80), V(-30, 4, 10), V(24, 4, 0)]) noiseFX(p, L.T + p.x, .8);
  cm([-30, 24, 50, 0, 2, -10, 50], [-20, 30, 46, 0, 2, -14, 50], L.k); sh(V(0, 0, 0), 60); },
  [[.0, 'bells', .4], [.4, 'bark', .3], [.9, 'horn_blast', .3], [1.4, 'yawn_big', .3]]);
// 103 «Außer mir.»: zoom lento a mi cara: sonrisa de lado
shot(156.17, 'Z', 'slow', L => { plazaNight(L, 4, 'sitears', 221, { z0: BZ + 12, z1: BZ + 30 }); const c = benchSit(ich, -1, L, { aLx: .3, aRx: .3 }); cara(c, L.T, { eyes: 'squint', mouth: 'smirk' }); onFace(c, 6.4, .2, 0, 40, L.k, 4.4); sh(V(-1, 0, BZ), 12); },
  [[.1, 'whoosh_up', .3]]);
// 104 «Ich gab Mia meine Uhr.»: le paso mi reloj de pulsera a Mia; ella lo coge con las dos manos
shot(156.89, 'W', null, L => { plazaNight(L, 4, 'sitears', 231, { z0: BZ + 12, z1: BZ + 30 }); const t = clamp(L.lt / .6); const c = benchSit(ich, -1, L, { aRx: 1.4, aRe: .3, aRz: .4, twist: -.2 }); cara(c, L.T, { expr: 'smile' });
  const m = benchSit(mia, 1.2, L, { aLx: 1.3, aRx: 1.3, aLz: -.25, aRz: -.25, aLe: 1.0, aRe: 1.0 }); cara(m, L.T, { expr: 'gasp' }); const a = wpos(c.aR.hand), b = wpos(m.aL.hand); show(UHR, lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t) + .6, 0, .45); UHR.userData.set('23:58');
  cm([.2, 4.6, BZ + 9, .1, 3.2, BZ, 40], [.2, 4.4, BZ + 8, .1, 3.2, BZ, 38], L.k); sh(V(0, 0, BZ), 10); },
  [[.1, 'watch_click', .5], [.5, 'cloth', .4]]);
// 105 «„Weck mich um Mitternacht.“»: le hablo a Mia; ella asiente muy seria y aprieta el reloj
shot(157.85, 'S', null, L => { plazaNight(L, 4, 'sitears', 241, { z0: BZ + 12, z1: BZ + 30 }); const c = benchSit(ich, -1, L, { aRx: .9, aRe: 1.2, aRz: .2, headY: -.4 }); talk(c, L.T, L.t0, L.t1);
  const m = benchSit(mia, 1.2, L, { aLx: 1.2, aRx: 1.2, aLz: -.25, aRz: -.25, aLe: 1.2, aRe: 1.2, headY: .4, headX: Math.sin(L.T * 9) * .12 }); cara(m, L.T, { expr: 'determined' }); attach(UHR, m.aR.hand, [0, -.5, .4], [0, 0, 0], .45); UHR.userData.set('23:58');
  cm([3, 4.6, BZ + 9, .1, 3.4, BZ, 42], [2.6, 4.4, BZ + 8, .1, 3.4, BZ, 40], L.k); sh(V(0, 0, BZ), 10); },
  [[.6, 'cloth', .3]]);
// 106 «Um 23 Uhr 59»: primer plano del reloj en las manos de Mia: 23:59
shot(159.23, 'C', 'punch', L => { plazaNight(L, 2, 'sitears', 251, { z0: BZ + 12, z1: BZ + 20 }); show(UHR, 0, 4, BZ + 4, 0, 1); UHR.userData.set('23:59'); cm([0, 4.6, BZ + 10, 0, 4, BZ + 4, 34], [0, 4.4, BZ + 9, 0, 4, BZ + 4, 30], L.k); sh(V(0, 0, BZ + 4), 10); },
  [[.02, 'impact', .4], [.3, 'heartbeat', .5], [1.2, 'heartbeat', .5]]);
// 107 «und 57 Sekunden»: el reloj muestra 23:59:57
shot(161.21, 'Z', null, L => { plazaNight(L, 2, 'sitears', 261, { z0: BZ + 12, z1: BZ + 20 }); show(UHR, 0, 4, BZ + 4, 0, 1); UHR.userData.set('23:59:57'); cm([0, 4.6, BZ + 9, 0, 4, BZ + 4, 30], [0, 4.4, BZ + 8.4, 0, 4, BZ + 4, 28], L.k); sh(V(0, 0, BZ + 4), 10); },
  [[.1, 'tick', .6], [.6, 'heartbeat', .5]]);
// 108 «schlug die Kirchturmglocke direkt über uns.»: desde abajo, el banco y la torre: la campana da un golpe enorme; onda expansiva; todos se tapan las orejas
shot(162.71, 'C', 'punch', L => { plazaNight(L, 12, 'sitears', 271, { z0: BZ + 12, z1: BZ + 34 }); TURM.BL.intensity = 40; bellSwing(L.T * 1.3, 1.2); noiseFX(V(0, 62, -84), L.T, 1, '#ffffff'); grade.uniforms.flash.value = Math.max(0, .5 - L.lt * 2);
  benchSit(ich, -1, L, { headX: .3 }); ich.setFace({ eyes: L.lt > .9 ? 'closed' : 'half', mouth: 'wavy' }); const m = benchSit(mia, 1.2, L, { aLx: 2.2, aRx: 2.2, aLz: .25, aRz: .25, aLe: 2.3, aRe: 2.3 }); m.setFace({ eyes: 'squint', mouth: 'grimace' });
  cm([3, 2.4, BZ + 20, 0, 40, BZ - 22, 54], [2, 3, BZ + 17, 0, 42, BZ - 22, 52], L.k); sh(V(0, 0, BZ - 8), 40); },
  [[.0, 'bells', .9], [.05, 'braam', .6], [.6, 'bell_far', .5]]);
// 109 «Ich schlief, bevor sie fertig war.»: yo ya dormido apoyado en Mia, Zzz; Mia me mira con los ojos muy abiertos
shot(165.12, 'I', null, L => { plazaNight(L, 6, 'sitears', 281, { z0: BZ + 12, z1: BZ + 30 }); const c = benchSit(ich, -.6, L, { headZ: -.55, lean: .1, aLz: .05, aRz: .05, twist: .2 }); c.setFace({ eyes: 'closed', mouth: 'o' }); zzz(c, L.T, 1.1);
  const m = benchSit(mia, 1.2, L, { headY: .5, aLx: 1.2, aRx: 1.2, aLz: -.25, aRz: -.25, aLe: 1.2, aRe: 1.2 }); cara(m, L.T, { expr: 'gasp' }); attach(UHR, m.aR.hand, [0, -.5, .4], [0, 0, 0], .45); UHR.userData.set('23:59:58');
  cm([1, 5, BZ + 12, .3, 3.4, BZ, 42], [.8, 4.6, BZ + 10, .3, 3.4, BZ, 40], L.k); sh(V(0, 0, BZ), 12); },
  [[.1, 'snore', .6], [.8, 'gasp_f', .3]]);
// 110 «Mia starrte auf die Uhr,»: primer plano de Mia mirando el reloj fijamente; los segundos: 23:59:59
shot(167.13, 'S', 'slow', L => { plazaNight(L, 2, 'sitears', 291, { z0: BZ + 12, z1: BZ + 20 }); const m = benchSit(mia, 1.2, L, { aLx: 1.5, aRx: 1.5, aLz: -.25, aRz: -.25, aLe: 1.4, aRe: 1.4, headX: .3 }); m.setFace({ eyes: 'down', mouth: 'flat' }); attach(UHR, m.aR.hand, [0, -.5, .4], [-.6, 0, 0], .45); UHR.userData.set('23:59:59');
  onFace(m, 5.2, .1, .2, 40, L.k, 4); sh(V(1, 0, BZ), 10); },
  [[.1, 'heartbeat', .6], [.8, 'tick', .5]]);
// 111 «und die ganze Stadt schaute zu.»: todo el pueblo, en pijama, se gira hacia el banco conteniendo el aliento
shot(168.58, 'W', null, L => { plazaNight(L, 24, 'look', 301, { x0: -24, x1: 24, z0: BZ + 8, z1: BZ + 44, face: V(0, 2, BZ), jit: .1, expr: 'gasp' }); benchSit(ich, -.6, L, { headZ: -.5 }); ich.setFace({ eyes: 'closed', mouth: 'o' }); benchSit(mia, 1.2, L, { aLx: 1.5, aRx: 1.5, aLe: 1.4, aRe: 1.4, headX: .3 }); mia.setFace({ eyes: 'down', mouth: 'flat' });
  cm([0, 10, BZ - 8, 0, 3, BZ + 22, 50], [0, 9, BZ - 6, 0, 3, BZ + 20, 48], L.k); sh(V(0, 0, BZ + 14), 30); },
  [[.1, 'crowd_run', .3], [.6, 'heartbeat', .5]]);
// 112 «Drei.»: Mia levanta la vista con el reloj en alto: «3»
shot(170.27, 'C', 'punch', L => { plazaNight(L, 4, 'look', 311, { z0: BZ + 14, z1: BZ + 30, face: V(0, 2, BZ), expr: 'gasp' }); const m = benchSit(mia, 1.2, L, { aRx: 2.4, aRe: .6, aRz: .2 }); cara(m, L.T, { expr: 'determined' }); attach(UHR, m.aR.hand, [0, -.5, .4], [0, 0, 0], .45); UHR.userData.set('3', '#ffd23f');
  badge('red', '3', W / 2, H * .2, (L.lt - .02) / .15, 1, 1.6); onBody(m, 11, .2, .1, 42, L.k, 9.6, .2, 2.4); sh(V(1, 0, BZ), 12); },
  [[.0, 'heartbeat', .8], [.02, 'tick', .6]]);
// 113 «Zwei.»: corte al sótano: Graufeld duerme; su despertador marca 23:59… «2»
shot(170.79, 'C', 'punch', L => { use('KE'); inside(.25, 8); lp(0, KEX + 2, 6, 2, 22, 0xff4a3a, 18); const c = put(grau, KEX + 6, 3.3, 1.2, .3); c.root.rotation.x = -PI / 2; c.blob.visible = false; actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: -.4, aRz: -.4, aLe: 1.4, aRe: 1.4 }]], { T: L.T, weight: false }); c.setFace({ eyes: 'closed', mouth: 'smirk' });
  show(WK[0], KEX + 2, 2.8, 3, -.4, 1.3); clockAt(WK[0], '23:59', '#ff4a3a'); badge('red', '2', W / 2, H * .2, (L.lt - .02) / .15, 1, 1.6); cm([KEX + 7, 7, 9, KEX + 3.4, 3.4, 1.4, 42], [KEX + 6.6, 6.6, 8.4, KEX + 3.4, 3.4, 1.4, 40], L.k); sh(V(KEX + 4, 0, 1), 12); },
  [[.0, 'heartbeat', .8], [.02, 'tick', .6]]);
// 114 «Eins.»: Mia se pone de pie en el banco, flexiona las rodillas lista para saltar: «1»
shot(171.46, 'C', 'punch', L => { plazaNight(L, 6, 'look', 321, { z0: BZ + 12, z1: BZ + 30, face: V(0, 2, BZ), expr: 'gasp' }); const c = benchSit(ich, -.6, L, { headZ: -.5 }); c.setFace({ eyes: 'closed', mouth: 'o' });
  const m = put(mia, 1.4, SEAT, BZ + .2, -.3); m.blob.visible = false; actuar(m, 0, [[0, { crouch: .5, lean: .3, aLx: -.6, aRx: -.6, aLe: .3, aRe: .3, lLx: .5, lRx: .5, lLk: 1, lRk: 1 }]], { T: L.T }); cara(m, L.T, { expr: 'determined' });
  badge('red', '1', W / 2, H * .2, (L.lt - .02) / .15, 1, 1.6); cm([3, 5, BZ + 11, .3, 3.4, BZ, 44], [2.6, 4.8, BZ + 10, .3, 3.4, BZ, 42], L.k); sh(V(0, 0, BZ), 12); },
  [[.0, 'heartbeat', .8], [.02, 'tick', .6], [.4, 'anticip', .5]]);
// 115 «Sie sprang mit beiden Füßen auf mich drauf.»: cámara lenta: Mia salta con los dos pies sobre mí; el reloj marca 0:00
shot(172.22, 'F', null, L => { plazaNight(L, 10, 'look', 331, { z0: BZ + 12, z1: BZ + 34, face: V(0, 2, BZ), expr: 'gasp' }); const c = benchSit(ich, -.6, L, { headZ: -.5 }); c.setFace({ eyes: 'closed', mouth: 'o' });
  saltar(mia, L.lt * .55, 0, { h: 5, dur: .7, base: [1.4, SEAT - .2, BZ + .2], dx: -1.6, dz: .2 }); mia.blob.visible = false; cara(mia, L.T, { expr: 'joy' }); attach(UHR, mia.aR.hand, [0, -.5, .4], [0, 0, 0], .45); UHR.userData.set('0:00', '#8aff6a');
  cm([5, 4, BZ + 14, 0, 4.6, BZ, 46], [4, 5, BZ + 12, 0, 5, BZ, 44], L.k); sh(V(0, 0, BZ), 14); },
  [[.05, 'whoosh_up', .5], [.7, 'jump', .5], [1.1, 'thud', .6]]);
// 116 «„AUFWACHEN!“»: abro los ojos de golpe; Mia encima gritando; el reloj 0:00; chispas doradas explotan y todo el pueblo se levanta
shot(174.30, 'C', 'punch', L => { plazaNight(L, 16, 'cheer', 341, { z0: BZ + 12, z1: BZ + 40, face: V(0, 2, BZ) }); bloom.strength = .5; const c = benchSit(ich, -.6, L, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9, lean: -.1 }); c.setFace({ eyes: 'wide', mouth: 'grimace_wide' });
  const m = put(mia, -.2, SEAT + 1.4, BZ + 1.6, .2); m.blob.visible = false; actuar(m, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, aLe: .2, aRe: .2, headX: -.2 }]], { T: L.T }); talk(m, L.T, L.t0, L.t1, 'shout', { eyes: 'happy' });
  SPK.S.forEach(s => s.material.color.setHex(0xfff2a0)); SPK.at(V(-.4, 0, BZ), L.T, 1, 4, 9, 34); confetti(V(-.4, 2, BZ), L.t0, L.T, 40, 1.4); TURM.setClock(0, 0, .8);
  cm([0, 5.6, BZ + 13, -.3, 4.4, BZ, 44], [0, 5.4, BZ + 11, -.3, 4.4, BZ, 42], L.k); sh(V(0, 0, BZ), 16); },
  [[.0, 'scream_girl', .3], [.02, 'impact', .7], [.1, 'magic_hit', .7], [.2, 'cheer', .6], [.4, 'sparkle', .6]]);


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
  if (HQ) { renderer.toneMappingExposure *= +(QS.get('exp') ?? 1); grade.uniforms.sharp.value = +(QS.get('sharp') ?? .55); grade.uniforms.vig.value = Math.min(grade.uniforms.vig.value, .38); bloom.strength = Math.min(bloom.strength, BLOOMMAX); ao.enabled = QS.get('ao') !== '0'; }
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

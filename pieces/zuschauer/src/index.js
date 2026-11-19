// ZUSCHAUER — «In dieser Stadt … alle – Moment! Er schaut schon wieder zu.» Hufenbach vigila al espectador: Frieda, Metzger Kalle,
// Opa Heinz, Frau Krause, la Tafel de Papa con 600 bombillas, el pulgar gigante y el sofá dorado con «DU». 1080×1920, 30 fps.
// Planos en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight, lightCone } from './roblox.js';
import { FONT, txt, tree } from './props.js';
import { hufenbach, townhouse, zimmer as zimmerF } from './gort.js';
import { kueche, zimmer, phone } from './svsets.js';
import { bus } from './pech.js';
import { alarm } from './esets.js';
import { ladder } from './hals.js';
import { makeExtra } from './ecast.js';
import { glowM, tafel, daumen, fernglas, gurkenglas, gurke, kuehlschrank, kalender, riesenHandy, sofa, hammer, busInnen } from './zprops.js';
import { makeIch, makePapa, makeOpa, coatWind, makeJunge } from './acast.js';
import { makeFrieda, makeKalle, makeKrause } from './zcast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 93.9, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const TMP = document.createElement('canvas'); TMP.width = W; TMP.height = H; const tctx = TMP.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
const GLOW = new THREE.PointLight(0x8ab8ff, 0, 14, 1.4); scene.add(GLOW);   // luz azul del móvil en la cara
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
// Hufenbach (x = 0): plaza adoquinada x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (-6, -92); carretera x = 26 hacia +z.
// La Tafel de Papa en la plaza (TX, 0, TZ) mirando a +z; el sofá dorado en (SX, 0, SZ); el móvil gigante en (HX, 0, HZ).
// Interiores: mi cuarto (DU) de noche ZX = 900, cocina KX = 1300, cuarto de Frieda FX = 1700, bus 42 BX = 2100, túnel NX = 2600.
const ZX = 900, KX = 1300, FX = 1700, BX = 2100, NX = 2600, TX = -6, TZ = -52, SX = -6, SZ = 26, HX = 6, HZ = -2;
const HB = hufenbach(scene), ZI = zimmer(scene, ZX, '#3a4a8a', '#34447e', 'ich'), KU = kueche(scene, KX), FZ = zimmerF(scene, FX), BI = busInnen(scene, BX);
const TUN = (() => { const g = new THREE.Group(); g.position.x = NX; scene.add(g); const fr = [];
  for (let k = 0; k < 18; k++) { const f = new THREE.Group(); f.position.z = -k * 14; g.add(f); const col = new THREE.Color().setHSL((k * .09) % 1, .9, .6); const m = glowM(col, 1.6), dk = mat(0x14141a, { metalness: .6, roughness: .3 });
    for (const [w, h, x, y] of [[13, 1.2, 0, 11.4], [13, 1.2, 0, -11.4], [1.2, 23, 6.4, 0], [1.2, 23, -6.4, 0]]) box(w, h, 1, dk, .3, f, x, y, 0); for (const [w, h, x, y] of [[11.4, .25, 0, 10.6], [11.4, .25, 0, -10.6], [.25, 21.4, 5.6, 0], [.25, 21.4, -5.6, 0]]) box(w, h, 1.1, m, 0, f, x, y, 0); fr.push(f); }
  const end = new THREE.Mesh(new THREE.PlaneGeometry(60, 80), glowM(0xfff4d0, 3)); end.position.z = -18 * 14; g.add(end); return { g, fr }; })();
const SETS = { HB: HB.G, ZI: ZI.g, KU: KU.g, FZ: FZ.g, BI: BI.g, TUN: TUN.g };
for (const k of ['HB', 'ZI', 'KU', 'FZ', 'BI']) outline(SETS[k], 1.4);
[HB.RANK, HB.KINO, HB.BOX, HB.PRICE].forEach(o => o && (o.visible = false));
townhouse(HB.G, -64, -21, 13, 3, 11, Math.PI / 2, { shop: 'METZGEREI KALLE', bg: '#c8203a', fg: '#ffffff' }); townhouse(HB.G, -64, -34.5, 13, 2, 12, Math.PI / 2);
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3), 20 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 30 + i, Math.PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 40 + i, -Math.PI / 2); }
for (let i = 0, x = -120; x <= 140; x += 19, i++) townhouse(HB.G, x, -160 - (i % 2) * 8, 18, 3 + (i % 3), 50 + i, 0);
for (let i = 0, z = 80; z < 200; z += 18, i++) { townhouse(HB.G, 6, z, 16, 2 + (i % 3), 70 + i, Math.PI / 2); townhouse(HB.G, 46, z, 16, 2 + ((i + 1) % 3), 80 + i, -Math.PI / 2); }
// la Tafel, el sofá con su foco, el móvil gigante
const TAF = tafel(HB.G); TAF.position.set(TX, 0, TZ);
const SOFA = sofa(HB.G); SOFA.position.set(SX, 0, SZ); const BEAM = lightCone(HB.G, SX, 46, SZ, 46, 9, 0xfff0b0, .22); BEAM.visible = false;
const RH = riesenHandy(HB.G); RH.position.set(HX, 0, HZ); RH.rotation.y = -.25;
// en mi cuarto: manta de tienda, móvil en la mano, reloj 3:17
const DECKE = (() => { const g = new THREE.Group(); scene.add(g); const tx = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#3a5ab8'; x.fillRect(0, 0, 128, 128); x.fillStyle = '#ffd23f'; for (let i = 0; i < 14; i++) { x.beginPath(); x.arc((i * 37) % 128, (i * 53) % 128, 4, 0, 7); x.fill(); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2); return t; })();
  const m = mat(0xffffff, { map: tx, roughness: .95, side: THREE.DoubleSide }); const s = new THREE.Mesh(new THREE.SphereGeometry(2.4, 26, 14, Math.PI / 2 + 1.0, 2 * Math.PI - 2.0, 0, Math.PI * .62), m); s.scale.set(1.15, 1.25, 1.1); s.position.y = .9; g.add(s); const lap = box(6, 1.2, 5.4, m, .5, g, 0, -3.3, 2.4); g.userData.lap = lap; return g; })();
const PH = phone(scene); PH.scale.setScalar(.7); outline(PH, 1);
const PHS = PH.userData.scr;
// prismáticos, bote, pepinillo, nevera, calendario, despertador, martillo, escalera, pulgar, bus 42
const FG = fernglas(scene); outline(FG, 1); const GLAS = gurkenglas(scene); outline(GLAS, 1); const GURK = gurke(scene);
const FRIDGE = kuehlschrank(KU.g); FRIDGE.position.set(-8, 0, -6);
const KAL = kalender(scene); const WECK = alarm(scene, .55); outline(WECK, 1); const HAM = hammer(scene); outline(HAM, 1); const LAD = ladder(scene, 22);
const DAU = daumen(scene); DAU.scale.setScalar(4.2);
const BUS = bus(HB.G, 0xf2c23a, '42'); outline(BUS, 1.2); BUS.visible = false;
const NEWS = (() => { const g = new THREE.Group(); scene.add(g); const p = textPlane(2.4, 1.6, 240, 160, (c, w, h) => { c.fillStyle = '#f4f0e4'; c.fillRect(0, 0, w, h); txt(c, 'HUFENBACHER', w / 2, 22, 22, '#1a1a1a'); txt(c, 'BOTE', w / 2, 46, 26, '#c8203a'); c.fillStyle = '#9a9a9a'; for (let i = 0; i < 6; i++) c.fillRect(14, 70 + i * 13, w - 28, 6); c.fillStyle = '#1a1a1a'; for (const x of [.36, .64]) { c.beginPath(); c.arc(w * x, h * .55, 14, 0, 7); c.fill(); } }); p.material.side = THREE.DoubleSide; g.add(p); return g; })();
// ---------- reparto ----------
const du = makeIch(scene), papa = makePapa(scene), opa = makeOpa(scene), junge = makeJunge(scene), frieda = makeFrieda(scene), kalle = makeKalle(scene), krause = makeKrause(scene);
kitFace(du, 'hero'); kitFace(papa, 'mustache'); kitFace(opa, 'plain'); kitFace(junge, 'kid'); kitFace(frieda, 'girl'); kitFace(kalle, 'mustache'); kitFace(krause, 'girl');
const EX = Array.from({ length: 30 }, (_, i) => makeExtra(scene, i)); EX.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'girl', 'mustache', 'girl'][i % 6]));
const MAIN = [du, papa, opa, junge, frieda, kalle, krause];
const POOL = [...MAIN, ...EX];
POOL.forEach(c => outline(c.root, 2));
// ---------- efectos ----------
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const FW = Array.from({ length: 60 }, (_, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(.5, 6, 4), new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL((i % 6) / 6, 1, .6).multiplyScalar(2.5), toneMapped: false })); scene.add(s); return s; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 2 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const HEARTS = Array.from({ length: 5 }, () => { const p = textPlane(1.2, 1.2, 64, 64, (c, w, h) => { c.fillStyle = '#ff3a6a'; c.beginPath(); c.moveTo(32, 54); c.bezierCurveTo(0, 30, 8, 4, 32, 18); c.bezierCurveTo(56, 4, 64, 30, 32, 54); c.fill(); }); p.material.depthWrite = false; scene.add(p); return p; });
const EYES = Array.from({ length: 3 }, () => { const p = textPlane(1.6, 1, 96, 60, (c, w, h) => { for (const x of [.28, .72]) { c.fillStyle = '#fff'; c.beginPath(); c.ellipse(w * x, h / 2, 16, 22, 0, 0, 7); c.fill(); c.fillStyle = '#1a1a1a'; c.beginPath(); c.arc(w * x, h / 2 + 4, 8, 0, 7); c.fill(); } }); p.material.depthWrite = false; scene.add(p); return p; });
const ZZZ = Array.from({ length: 3 }, (_, i) => { const p = textPlane(1, 1, 64, 64, (c, w, h) => txt(c, 'Z', w / 2, h / 2 + 3, 54, '#ffffff', '#1a1a3a', 8)); p.material.depthWrite = false; scene.add(p); return p; });
const RINGS = Array.from({ length: 4 }, () => { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .06, 6, 28), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, toneMapped: false })); scene.add(m); return m; });
const PROPS = [DECKE, PH, FG, GLAS, GURK, KAL, WECK, HAM, LAD, DAU, NEWS, BEAM, ...CONF, ...FW, ...DUST, ...SWEAT, ...TEAR, ...HEARTS, ...EYES, ...ZZZ, ...RINGS];
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.25; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.55, .62, .42); sun.intensity = 2.5; sun.color.setRGB(1, .95, .86); rim.intensity = 1.0;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.05; setSky([.04, .05, .2], [.12, .12, .38], [.32, .22, .5]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.15; hemi.color.setRGB(.7, .74, 1); hemi.groundColor.setRGB(.32, .28, .4); sun.intensity = 1.2; sun.color.setRGB(.78, .78, 1); rim.intensity = 1.8;
  scene.fog.color.setRGB(.12, .12, .3); scene.fog.density = .001; bloom.strength = .32; bloom.threshold = .82; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; bloom.threshold = .86; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } }
  coatWind(opa, 0, 0);
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene && p !== BEAM) { p.parent.remove(p); scene.add(p); } }
  PH.scale.setScalar(.7); DAU.scale.setScalar(4.2); BUS.visible = false; SOFA.userData.cover.visible = false; TAF.userData.draw({}); TAF.userData.bulbs(1); RH.userData.draw({}); GLOW.intensity = 0; DROSTE = null; ROLL = 0;
  for (const k in SETS) SETS[k].visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = 1.15; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
const LOOK = new THREE.Vector3();
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); LOOK.set(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
function orbit(c, d, yaw = 0, pitch = .15, fov = 44) { const t = Math.tan(fov * Math.PI / 360) * d * .16; cam([c.x + Math.sin(yaw) * Math.cos(pitch) * d, c.y + Math.sin(pitch) * d, c.z + Math.cos(yaw) * Math.cos(pitch) * d], [c.x, c.y - t, c.z], fov); }
const orb = (k, c0, c1, a, b, e = easeInOut) => { const q = e(clamp(k)); orbit(c0.clone().lerp(c1 ?? c0, q), lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q), lerp(a[3] ?? 44, b[3] ?? 44, q)); };
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { dist *= 1.45; if (dist2 != null) dist2 *= 1.45; const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .85, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .6 + dy, h.z + fz * d - fx * side], [h.x, h.y - .45, h.z], fov); }
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
    case 'stare': return n > .7 ? 'half' : 'wide';
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk', extra = {}) => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat', ...extra });
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
const tears = (ch, T) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < 2; i++) { const k = (T * 1.1 + i * .5) % 1; TEAR[i].visible = true; TEAR[i].position.copy(h).add(V((i ? -.3 : .3) * s, (.75 - k * 1.1) * s, .7 * s)); } };
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
function fireworks(c, T, n = 3, R = 14) { FW.forEach((s, i) => { const b = i % n, k = Math.floor(i / n), per = 1.6, t = ((T + b * .53) % per) / per, r0 = RNG(b * 17 + Math.floor((T + b * .53) / per) * 31); const cx = c.x + (r0() - .5) * 60, cy = c.y + 30 + r0() * 20, cz = c.z + (r0() - .5) * 20;
  const a = k / (FW.length / n) * 6.283, el = Math.sin(k * 2.3) * .8; s.visible = t > .25; const e = easeOut((t - .25) / .75) * R; s.position.set(cx + Math.cos(a) * Math.cos(el) * e, cy + Math.sin(el) * e - t * t * 4, cz + Math.sin(a) * Math.cos(el) * e); s.scale.setScalar(1 - t * .8); s.material.color.setHSL((b * .27 + .05) % 1, 1, .6).multiplyScalar(2.5); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.5 + t * 1.4) * s * (.8 + r() * .5)); d.material.opacity = .4 * (1 - t / 1.2); }); }
function hearts(p, T) { HEARTS.forEach((z, i) => { const k = (T * .6 + i / 5) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 1.7 + T) * 1.4, p.y + k * 3.4, p.z + .4); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
function zzz(p, T) { ZZZ.forEach((z, i) => { const k = (T * .5 + i / 3) % 1; z.visible = true; z.position.set(p.x + k * 1.6, p.y + k * 3, p.z); z.scale.setScalar(.5 + k * .8); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
// ondas de sonido (despertador) alrededor de p
function rings(p, T, s = 1) { RINGS.forEach((r, i) => { const k = (T * 2.2 + i / 4) % 1; r.visible = true; r.position.copy(p); r.scale.setScalar((.8 + k * 3) * s); r.material.opacity = 1 - k; r.lookAt(camera.position); }); }
// ojos que espían (en una ventana, detrás de algo)
function eyesAt(i, p, s = 1) { const e = EYES[i]; e.visible = true; e.position.copy(p); e.scale.setScalar(s); e.lookAt(camera.position); }
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));

// ---------- ayudas de la historia ----------
const PI = Math.PI;
const walkP = (T, i, sp = 9) => { const p = Math.sin(T * sp + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
const runP = (T, i = 0) => { const p = Math.sin(T * 14 + i); return { aLx: p * 1.1, aRx: -p * 1.1, aLe: 1.2, aRe: 1.2, lLx: -p * .9, lRx: p * .9, lLk: Math.max(0, p) * 1.1, lRk: Math.max(0, -p) * 1.1, lean: .3 }; };
const clapP = (T, i = 0) => { const c = Math.abs(Math.sin(T * 9 + i)); return { aLx: 1.35, aRx: 1.35, aLz: -.15 - c * .45, aRz: -.15 - c * .45, aLe: .9, aRe: .9, headX: -.1 }; };
const shv = (p, T, a = 1) => { const s = shiver(T, a), o = { ...p }; for (const k in s) o[k] = (o[k] || 0) + s[k]; return o; };
const SIT = { lLx: -1.5, lRx: -1.5, lLk: 1.5, lRk: 1.5 };
const PHONEP = { aRx: .95, aRz: -.32, aRe: 1.25, aLx: .95, aLz: -.32, aLe: 1.25, headX: .3 };   // móvil con las dos manos delante de la cara
const BINO = { aLx: 2.2, aLz: -.3, aLe: 2.0, aRx: 2.2, aRz: -.3, aRe: 2.0, headX: -.05 };     // prismáticos a los ojos
const FREEZE = (i) => [{ aLx: 1.6, aRx: .4, aLe: .4, lean: .1, lLx: .5, lLk: .3 }, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5, headX: -.2 }, { crouch: .3, aLx: 1.2, aRx: 1.2, aLe: 1.6, aRe: 1.6 }, { aRx: 1.5, aRe: .1, lRx: -.6, lean: -.05 }][i % 4];
// móvil delante de la cara (pantalla hacia la cara si toFace; si no, hacia fuera), a dist delante y drop por debajo de los ojos
function phoneIn(c, toFace = true, s = .7, dist = 1.5, drop = 1.55) { const h = hp(c), sc = c.spec.scale || 1, a = c.root.rotation.y, f = V(Math.sin(a), 0, Math.cos(a)); PH.visible = true; PH.scale.setScalar(s); PH.position.copy(h).addScaledVector(f, dist * sc).add(V(0, (.75 - drop) * sc, 0));
  const tgt = toFace ? h.clone().add(V(0, .75 * sc, 0)) : PH.position.clone().addScaledVector(f, 5).add(V(0, 1.2, 0)); PH.lookAt(tgt); }
function binoIn(c) { c.root.updateMatrixWorld(true); attach(FG, c.head, [0, .78, .95], [0, 0, 0], 1); }
// gente de Hufenbach alrededor de (cx, cz), siempre detrás del sujeto según la cámara
function crowdAt(L, cx, cz, n, r0, r1, seed = 1, o = {}) { const list0 = (o.list || EX).slice(o.from || 0, (o.from || 0) + n); POST.push(() => { const list = list0.filter(c => !c.root.visible); const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const a0 = ac + (o.gap ?? 1.9), a1 = ac + 6.283 - (o.gap ?? 1.9); const dc = Math.hypot(camera.position.x - cx, camera.position.z - cz);
  list.forEach((c, i) => { const a = a0 + (i + .2 + r() * .6) / list.length * (a1 - a0); const d = r0 + r() * (r1 - r0); const x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d; if (Math.hypot(camera.position.x - x, camera.position.z - z) < dc * .95) return; const face = o.face || camera.position; const ry = Math.atan2(face.x - x, face.z - z) + (r() - .5) * (o.face ? .3 : .9); put(c, x, 0, z, ry);
    crowdPose(c, o.mode || 'idle', L.T, i, o, x, z, ry); }); }); }
function crowdPose(c, m, Tg, i, o = {}, x, z, ry) { const T = Tg + i * .7;
    if (m === 'walk') { c.root.rotation.y = ry + PI / 2 * (i % 2 ? 1 : -1); actuar(c, 0, [[0, walkP(Tg, i)]], { T: Tg }); cara(c, T, { expr: 'neutral' }); }
    else if (m === 'clap') { actuar(c, 0, [[0, clapP(Tg, i)]], { T: Tg }); cara(c, T, { expr: 'happy', mouth: 'open_smile' }); }
    else if (m === 'shock') { actuar(c, 0, [[0, i % 2 ? GEST.shock : GEST.hands_face]], { T: Tg }); cara(c, T, { expr: 'shock', mouth: i % 2 ? 'o' : 'ah' }); }
    else if (m === 'cheer') { c.root.position.y = Math.abs(Math.sin(Tg * 8 + i)) * .5; actuar(c, 0, [[0, GEST.cheer]], { T: Tg }); cara(c, T, { expr: 'joy', mouth: 'open_smile' }); }
    else if (m === 'point') { actuar(c, 0, [[0, i % 2 ? GEST.point : GEST.shock]], { T: Tg }); cara(c, T, { expr: 'shock', mouth: 'o' }); }
    else if (m === 'cower') { actuar(c, 0, [[0, shv(GEST.cower, Tg)]], { T: Tg }); cara(c, T, { expr: 'worried', mouth: 'grimace' }); }
    else if (m === 'freeze') { applyPose(c, FREEZE(i)); cara(c, 0, { eyes: 'wide', mouth: 'flat', noBlink: true }); }
    else if (m === 'stare') { actuar(c, 0, [[0, i % 3 === 0 ? { aLx: .2, aRx: .2 } : i % 3 === 1 ? GEST.cross : { aRx: .3, aLx: .3, aLe: .4, aRe: .4, lean: .1 }]], { T: Tg }); cara(c, T, { expr: 'stare', mouth: i % 2 ? 'smile' : 'flat' }); }
    else if (m === 'shh') { actuar(c, 0, [[0, { aRx: 2.3, aRz: -.4, aRe: 2.3, headX: .05 }]], { T: Tg }); cara(c, T, { expr: 'sus', mouth: 'o' }); }
    else if (m === 'sad') { actuar(c, 0, [[0, GEST.slump]], { T: Tg }); cara(c, T, { expr: 'sad', mouth: 'frown' }); }
    else if (m === 'hold') { actuar(c, 0, [[0, shv(GEST.brace, Tg, 2)]], { T: Tg }); cara(c, T, { expr: 'worried', eyes: i % 2 ? 'closed' : 'scared', mouth: 'grimace_wide' }); }
    else if (m === 'wave') { actuar(c, 0, [[0, { ...GEST.wave, aRz: .4 + Math.sin(Tg * 8 + i) * .3 }]], { T: Tg }); cara(c, T, { expr: 'happy', mouth: 'open_smile' }); }
    else if (m === 'phone') { actuar(c, 0, [[0, GEST.phone_look]], { T: Tg }); cara(c, T, { expr: 'neutral' }); }
    else { actuar(c, 0, [[0, i % 3 === 0 ? GEST.listen : i % 3 === 1 ? { aLx: .2, aRx: .3, aLe: .4, headX: Math.sin(Tg + i) * .1 } : GEST.cross]], { T: Tg }); cara(c, T, { expr: o.expr || 'neutral' }); } }
// fila de gente (para tener a todos de frente): n personas en un arco delante de la cámara, mirando a 'face'
function rowAt(L, cx, cz, n, r, a0, a1, mode, seed = 1, o = {}) { const list = (o.list || EX).slice(o.from || 0, (o.from || 0) + n); const rr = RNG(seed); list.forEach((c, i) => { const a = lerp(a0, a1, n > 1 ? i / (n - 1) : .5) + (rr() - .5) * .05, d = r + (rr() - .5) * (o.jit ?? 2); const x = cx + Math.sin(a) * d, z = cz + Math.cos(a) * d; const f = o.face || V(cx, 0, cz + 1000); const ry = faceTo(V(x, 0, z), f) + (rr() - .5) * .2; put(c, x, 0, z, ry); crowdPose(c, mode, L.T, i, o, x, z, ry); }); }
// Hufenbach de día / de noche
function town(L, mode = 'day') { use('HB'); if (mode === 'night') night(40); else day(); }
// la Tafel: estado según el tiempo absoluto (filas que aparecen con la narración)
const DUT = T => 29 + (T - 57.2);   // «Er ist bei 29 Sekunden» en 57,2 s
function tafelAt(T, o = {}) { const rows = []; if (T >= 48.4 || o.all) rows.push({ t: 3, gone: T >= 49.4 || o.all }); if (T >= 49.6 || o.all) rows.push({ t: 7, gone: T >= 50.9 || o.all }); if (T >= 51.0 || o.all) rows.push({ t: 12, gone: T >= 52.3 || o.all });
  const du = T >= 52.8 || o.du ? Math.min(o.max ?? 999, Math.max(24, DUT(T))) : null; TAF.userData.draw({ rows, du, gold: o.gold || (T > 68.18 ? 1 : 0), rec: o.rec }); }
// pulgar gigante sobre la plaza (h = altura de la yema)
function daumenAt(x, y, z, T, o = {}) { show(DAU, x, y + Math.sin(T * 2.2) * .6, z, o.ry ?? .3, 4.2); DAU.rotation.z = o.rz ?? .12 + Math.sin(T * 1.3) * .03; DAU.rotation.x = o.rx ?? -.15; }
// mi cuarto de noche (DU en la cama con la manta y el móvil)
function zimmerN(L, clock = '3:17') { use('ZI'); inside(.42, 0); ZI.LMP.intensity = 0; ZI.BLUE.intensity = 30; ZI.clk.userData.draw(clock, (c, w, h) => { c.fillStyle = '#0a0a0e'; c.fillRect(0, 0, w, h); txt(c, clock, w / 2, h / 2 + 2, 46, '#ff3a2a'); }); ZI.tvS.userData.draw('off', (c, w, h) => { c.fillStyle = '#0a0a10'; c.fillRect(0, 0, w, h); }); ZI.lapS.userData.draw('off', (c, w, h) => { c.fillStyle = '#0a0a10'; c.fillRect(0, 0, w, h); }); }
const BEDP = V(ZX + 13, 1.5, -7);    // donde me siento en la cama (mirando a +z)
function duBed(L, o = {}) { const c = put(du, BEDP.x, BEDP.y, BEDP.z, o.ry ?? 0); actuar(c, 0, [[0, { ...SIT, lLk: 0, lRk: 0, ...PHONEP, lean: .15, ...(o.pose || {}) }]], { T: L.T }); phoneIn(c, o.out ? false : true); cara(c, L.T, { expr: o.expr || 'neutral', eyes: o.eyes, mouth: o.mouth || 'flat' });
  if (o.blanket !== false) { const h = hp(c); show(DECKE, h.x, h.y, h.z, c.root.rotation.y, 1); } c.root.updateMatrixWorld(true); GLOW.position.copy(wpos(PH)).add(V(0, .3, 0)).lerp(hp(c), .3); GLOW.intensity = o.glow ?? 26; GLOW.color.setRGB(.6, .75, 1); return c; }
// cocina de noche con la nevera abierta
function kuecheN(L) { use('KU'); inside(.38, 0); KU.T.visible = false; FRIDGE.userData.L.intensity = 70; }
// bus 42 por dentro
function busIn(L) { use('BI'); inside(1.0, 30); BI.g.userData.scroll(L.T); }
// mi móvil: la pantalla muestra el vídeo de la ciudad (o el efecto Droste si DROSTE apunta a ella)
const droste = (mesh, n = 6) => { DROSTE = { mesh, n }; };
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
  else if (b.kind === 'meter') { const red = b.val >= 100 || b.val === '∞'; c.font = `700 46px ${FONT}`; const t2 = String(b.val); const w = c.measureText(b.text).width + c.measureText(t2).width + 90; c.fillStyle = '#0a0c14'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 14); c.fill(); c.lineWidth = 6; c.strokeStyle = red ? '#ff3a3a' : '#2ad86a'; c.stroke();
    c.textAlign = 'left'; c.fillStyle = '#ffffff'; c.fillText(b.text, -w / 2 + 26, 3); c.textAlign = 'right'; c.fillStyle = red ? '#ff4a3a' : '#ffd23f'; c.fillText(t2, w / 2 - 26, 3); }
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  c.restore(); }
const KEY = /^(Stadt|Moment|schaut|Videos|niemand|Wir|Wochen|Ende|Marktplatz|keiner|Frieda|Decke|Handy|3:17|Uhr|Wecker|verpasst|Metzger|Kalle|Gurken|Glas|alles|Opa|Heinz|Bus|versteckt|42|Krause|vorbeigewischt|Dreimal|zurück|anders|Papa|Tafel|600|Glühbirnen|Zeile|Drei|Sieben|Zwölf|Sekunden|Weg|weg|still|Keiner|29|Daumen|Riesig|festhalten|geblieben|geschrien|Zoom|Zimmer|immer|Tunnel|goldenes|Sofa|Namen|Erste|wohnst|hier|alle|du)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,…–?!]/g, '').replace(/(?<!\d):|:(?!\d)/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t), huss: false }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.huss ? 1.5 : cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); if (cur.huss) c.rotate(((Math.round(cur.t * 10) % 2) ? -1 : 1) * .06); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
// corte dentro de la misma acción: mismo plano con otra cámara (alt = [giro, factor de distancia, dy])
const cut = (t0, tr, alt, sfx = []) => S.push({ t0, tr, zoom: null, fn: null, sfx, alt, cut: true });
let DARK = 0, TINT = null, SHAKE = 0;
// ---------- a: gancho, «wir schauen dir zu», la promesa del Marktplatz, Frieda (0 – 21,97 s) ----------
const P0 = V(-6, 0, 2);   // centro de la plaza
const STOPH = { aRx: 1.75, aRz: -.1, aRe: .05, aLx: .3, aLz: .2, lean: -.08, headX: -.05 };   // mano en alto: «¡Moment!»
function hookStreet(L, push = 1) { town(L); const T = L.T; const j = caminar(junge, L.lt, { x: P0.x, z: P0.z - 6, ry: 0, run: true, speed: 7, T, extra: { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5 } }); cara(junge, T, { expr: 'joy', mouth: 'open_smile' });
  [[-14, -10, .3], [4, -16, -.2], [-20, -24, .4], [10, -28, -.3], [-2, -34, 0]].forEach(([x, z, ry], i) => { const c = EX[i]; caminar(c, L.lt + i * .2, { x, z, ry, run: true, speed: 6.5, T: T + i, extra: { aLx: 2.2, aRx: 2.2 } }); cara(c, T + i, { expr: 'joy', mouth: 'open_smile' }); });
  crowdAt(L, P0.x, P0.z - 20, 12, 10, 26, 3, { from: 6, mode: 'walk' }); tafelAt(0, {}); TAF.userData.bulbs(1, T, 1);
  cm([P0.x + 1, 3.2, P0.z + 22, P0.x, 3.4, P0.z - 30, 46], [P0.x + .5, 3.0, P0.z + 15 + (1 - push) * 4, P0.x, 3.6, P0.z - 30, 44], L.k); sh(P0, 40); }

// 1 «In dieser Stadt … alle –» (zoom lento): la plaza llena de gente que corre feliz; al fondo la Tafel «SCHAUT GERADE»
shot(0, 'C', 'slow', L => { hookStreet(L); }, [[0, 'whoosh', .7], [.1, 'run_cobble', .6], [.2, 'cheer', .4], [.9, 'kids_laugh', .4]]);
// 2 «Moment!»: el chico frena en seco y levanta la mano; todos se paran detrás
shot(1.45, 'C', 'punch', L => { town(L); const c = put(junge, P0.x, 0, P0.z, 0); actuar(c, L.lt, [[0, runP(L.T)], [.12, STOPH]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); dust(V(P0.x, 0, P0.z), L.t0, L.T, 8, .6);
  rowAt(L, P0.x, P0.z - 9, 5, 4, -.9, .9, 'shock', 4, { jit: 1.5 }); onFace(c, 3.4, .2, .3, 38, L.k, 2.9); sh(P0, 20); }, [[0, 'slam', .8], [.05, 'land', .6], [.15, 'gasp', .6]]);
// 3 «Er schaut schon wieder zu»: picado; todos en corro miran ARRIBA, a la cámara (a ti)
shot(2.05, 'Z', null, L => { town(L); const c = put(junge, P0.x, 0, P0.z, 0); actuar(c, 0, [[0, { ...GEST.point, aRx: 2.8, aRz: .1, headX: -.6 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'up', mouth: 'o' });
  const cp = V(P0.x, lerp(34, 28, easeOut(L.k)), P0.z + 13); EX.slice(0, 22).forEach((e, i) => { const a = i / 22 * 6.283, r = 7 + (i % 2) * 3, x = P0.x + Math.sin(a) * r, z = P0.z + Math.cos(a) * r; put(e, x, 0, z, faceTo(V(x, 0, z), cp)); actuar(e, 0, [[0, i % 3 ? { aLx: .3, aRx: .3, headX: -.7 } : { ...GEST.point, aRx: 2.7, headX: -.7 }]], { T: L.T + i }); cara(e, L.T + i, { expr: 'stare', eyes: 'up', mouth: i % 2 ? 'o' : 'flat' }); });
  cam([cp.x, cp.y, cp.z], [P0.x, 0, P0.z - 1.5], 46); camera.up.set(0, 1, 0); sh(P0, 30); }, [[0, 'whoosh_up', .6], [.2, 'creepy_ting', .6], [.6, 'gasp', .5]]);
// 4 «Jeder weiß, dass du Videos über diese Stadt schaust»: tú, sentado en la cama, viendo «In dieser Stadt…» en el móvil
const EDGE = V(ZX + 12, 1.15, 3.2);
function duEdge(L, o = {}) { use('ZI'); inside(.75, 22); ZI.LMP.intensity = 60; const c = put(du, EDGE.x, EDGE.y, EDGE.z, 0); actuar(c, 0, [[0, { ...SIT, ...PHONEP }]], { T: L.T }); phoneIn(c, !o.out, .7, 1.3, 1.0); PH.userData.set('plain', { prog: .2 + L.k * .5 }); cara(c, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' });
  GLOW.position.copy(wpos(PH)).lerp(hp(c), .4); GLOW.intensity = 16; return c; }
shot(3.25, 'W', null, L => { const c = duEdge(L); onFace(c, 4.2, .2, .6, 40, L.k, 3.6); sh(EDGE, 16); }, [[0, 'swipe', .6], [.3, 'notif', .5], [.8, 'kids_laugh', .3]]);
// 4b «… über diese Stadt schaust»: por encima del hombro, la pantalla: un vídeo de «In dieser Stadt»
shot(4.4, 'C', null, L => { const c = duEdge(L, { out: true }); const ph = wpos(PH); cm([ph.x + .8, ph.y + .5, ph.z + 4.2, ph.x, ph.y + .2, ph.z, 40], [ph.x + .5, ph.y + .3, ph.z + 3.2, ph.x, ph.y + .2, ph.z, 38], L.k); sh(EDGE, 16); }, [[0, 'whoosh', .5], [.3, 'mobile', .5]]);
// 5 «Aber niemand weiß das hier:»: el chico se lleva el dedo a los labios; detrás, todos hacen «psst»
shot(5.55, 'F', null, L => { town(L); const c = put(junge, P0.x, 0, P0.z, 0); actuar(c, 0, [[0, { aRx: 2.3, aRz: -.4, aRe: 2.3, lean: .12, headX: .05 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'half', mouth: 'o' });
  rowAt(L, P0.x, P0.z - 7, 6, 4.5, -1, 1, 'shh', 5, { from: 2 }); onFace(c, 3.2, .3, -.4, 38, L.k, 2.6); sh(P0, 20); }, [[0, 'whisper', .7], [.4, 'sniff', .3], [.9, 'silence_tick', .5]]);
// 6 «Wir schauen dir zu.» (zoom lento): todo el pueblo, en filas, mira fijamente a la cámara
shot(7.15, 'C', 'slow', L => { town(L); tafelAt(0); TAF.userData.bulbs(1, L.T, 1); rowAt(L, P0.x, P0.z - 30, 7, 26, -.28, .28, 'stare', 6, { from: 0, face: V(P0.x, 0, 40) }); rowAt(L, P0.x, P0.z - 30, 9, 21, -.36, .36, 'stare', 7, { from: 7, face: V(P0.x, 0, 40) }); rowAt(L, P0.x, P0.z - 30, 9, 16, -.42, .42, 'stare', 8, { from: 16, face: V(P0.x, 0, 40) });
  for (const [ch, x] of [[frieda, -3], [kalle, 0], [krause, 3]]) { put(ch, P0.x + x, 0, P0.z - 3.5, 0); actuar(ch, 0, [[0, x ? { aLx: .2, aRx: .2 } : GEST.cross]], { T: L.T }); cara(ch, L.T, { expr: 'stare', mouth: 'smile' }); }
  cm([P0.x, 5.2, P0.z + 16, P0.x, 4.2, P0.z - 6, 46], [P0.x, 4.8, P0.z + 9, P0.x, 4.3, P0.z - 6, 44], L.k); sh(P0, 30); }, [[0, 'heartbeat', .6], [.6, 'creepy_ting', .5]]);
// 7 «Und zwar schon seit Wochen.»: el calendario de Frieda lleno de cruces; ella tacha otro día
shot(8.45, 'S', null, L => { use('FZ'); inside(.9, 30); show(KAL, FX - 2, 10, -14.6, 0, 1); const c = put(frieda, FX - 4.2, 0, -10.6, .5); actuar(c, L.lt, [[0, { aRx: 2.3, aRz: .1, aRe: .4, headX: -.1 }], [.5, { aRx: 2.0, aRz: .3, aRe: .5, headX: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' });
  cm([FX - 1.2, 9.6, -3.6, FX - 2.4, 8.6, -14, 44], [FX - 1.6, 9.4, -5.2, FX - 2.4, 8.8, -14, 42], L.k); sh(V(FX - 2, 0, -12), 14); }, [[0, 'whoosh_down', .5], [.2, 'pencil', .7], [.7, 'paper', .5]]);
// 8 «Und was am Ende auf unserem Marktplatz auf dich wartet,» (zoom lento): algo enorme tapado con una tela roja y «?»
shot(9.72, 'Z', 'slow', L => { town(L); SOFA.userData.cover.visible = true; BEAM.visible = true; rowAt(L, SX, SZ - 2, 10, 11, -1.2, 1.2, 'point', 9, { from: 0, face: V(SX, 0, SZ) }); orb(L.k, V(SX, 4.5, SZ), null, [34, .35, .14, 46], [22, .15, .1, 42]); sh(V(SX, 0, SZ), 30); }, [[0, 'whoosh', .6], [.3, 'cloth', .6], [1.0, 'gasp', .4], [1.8, 'strings', .5]]);
// 9 «hat bisher noch keiner gesehen.»: Kalle y Krause intentan mirar debajo de la tela; Papa les da en la mano
shot(12.35, 'C', null, L => { town(L); SOFA.userData.cover.visible = true; BEAM.visible = true; const k = put(kalle, SX - 3.2, 0, SZ + 6.4, .5); actuar(k, 0, [[0, GEST.sneak]], { T: L.T }); cara(k, L.T, { expr: 'sus', mouth: 'smirk' });
  const r = put(krause, SX + 1.2, 0, SZ + 7.2, -.2); actuar(r, 0, [[0, { ...GEST.sneak, aRx: 1.4, aRe: .2 }]], { T: L.T }); cara(r, L.T, { expr: 'sus', mouth: 'o' });
  const p = put(papa, SX + 5.6, 0, SZ + 8.4, -1.25); actuar(p, L.lt, [[0, { aRx: .3 }], [.6, { aRx: 2.4, aRz: .2, aRe: .2 }], [.85, { aRx: 1.1, aRe: .3, aLx: .9, aLe: 1.6 }]], { T: L.T }); cara(p, L.T, { expr: 'angry', mouth: 'grimace' });
  cm([SX - 1, 3.6, SZ + 22, SX + 1.2, 4.0, SZ + 6, 46], [SX - .5, 3.4, SZ + 19.5, SX + 1.2, 4.0, SZ + 6, 44], L.k); sh(V(SX, 0, SZ), 24); }, [[0, 'cloth', .6], [.6, 'whistle', .4], [.85, 'slam', .5], [1.2, 'gasp_old', .5]]);
// 10 «Frieda sieht dich.»: de noche, Frieda escondida tras un macetero con los prismáticos apuntándote
shot(14.08, 'I', null, L => { town(L, 'night'); const c = put(frieda, -26, 0, -6.5, 0); actuar(c, 0, [[0, { ...BINO, crouch: .35 }]], { T: L.T }); binoIn(c); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' });
  onFace(c, 3.3, .4, .4, 40, L.k, 2.6); sh(V(-26, 0, -8), 18); }, [[0, 'iris_pop', .6], [.1, 'crickets', .6], [.5, 'zoom_in', .5]]);
// 11 «Unter der Decke.»: tú, a oscuras, bajo la manta (de tienda) en la cama
shot(15.12, 'W', null, L => { zimmerN(L); duBed(L, { glow: 6 + L.k * 4, expr: 'neutral' }); cm([ZX + 13.4, 8, 6, BEDP.x, 4.6, BEDP.z, 42], [ZX + 13.2, 7.4, 3.6, BEDP.x, 4.6, BEDP.z, 40], L.k); sh(BEDP, 14); }, [[0, 'cloth', .7], [.3, 'wood_creak', .4]]);
// 12 «Handy an.»: la pantalla se enciende y te ilumina la cara de azul
shot(15.98, 'C', 'punch', L => { zimmerN(L); const c = duBed(L, { glow: L.lt < .08 ? 0 : 30, expr: 'happy', eyes: 'wide', mouth: 'smile' }); PH.userData.set('plain', { prog: .2 }); onFace(c, 3.6, -.2, 1.0, 38, L.k, 3.1); sh(BEDP, 14); }, [[0, 'power_on', .7], [.05, 'notif', .6]]);
// 13 «3:17 Uhr.»: el despertador digital de la mesilla
shot(16.45, 'Z', null, L => { zimmerN(L, '3:17'); duBed(L, { glow: 26 }); const p = V(ZX + 6, 3.45, -10.6); cm([p.x + 2.2, p.y + 1.8, p.z + 6.4, p.x, p.y + .6, p.z, 40], [p.x + 1.4, p.y + 1.1, p.z + 4.4, p.x, p.y + .4, p.z, 38], L.k); sh(p, 10); }, [[0, 'zoom_in', .5], [.2, 'clock_tick', .7], [.8, 'tick', .5]]);
// 13b «… Uhr.»: plano general del cuarto a oscuras: tú, iluminado por el móvil, y el reloj en primer término
shot(17.1, 'C', null, L => { zimmerN(L, '3:17'); duBed(L, { glow: 28 }); cm([ZX + 6, 8.5, 9, BEDP.x - 2, 5, BEDP.z, 44], [ZX + 7, 8.2, 7.5, BEDP.x - 2, 5, BEDP.z, 42], L.k); sh(BEDP, 14); }, [[0, 'whoosh', .4], [.2, 'owl', .5]]);
// 14 «Schon wieder.»: en la ventana, la cara de Frieda con los prismáticos
shot(17.73, 'S', null, L => { zimmerN(L); const c = put(frieda, ZX - 12, 4.6, -14.0, 0); actuar(c, 0, [[0, BINO]], { T: L.T }); binoIn(c); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'grin' }); FILL.intensity = 18; FILL.color.setRGB(.6, .7, 1);
  cm([ZX - 11.4, 9.6, -5.4, ZX - 12, 8.6, -14.4, 40], [ZX - 11.7, 9.2, -7.4, ZX - 12, 8.7, -14.4, 38], L.k); sh(V(ZX - 12, 0, -13), 10); }, [[0, 'creepy_ting', .6], [.3, 'glass_rattle', .4], [.6, 'sniff', .3]]);
// 15 «Deshalb stellt sie sich jede Nacht einen Wecker»: Frieda, en pijama en su cuarto, pone el despertador a las 3:17
shot(18.6, 'R', null, L => { use('FZ'); inside(.45, 14); const c = put(frieda, FX + 14, 1.3, -6.5, 0); actuar(c, 0, [[0, { ...SIT, aLx: 1.3, aRx: 1.3, aLe: 1.0, aRe: 1.0, aLz: -.2, aRz: -.2, headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'smirk' });
  attach(WECK, c.aR.hand, [-.5, -1.0, .5], [0, 0, 0], .55); WECK.userData.draw(L.k < .5 ? '2:00' : '3:17'); FILL.intensity = 26; FILL.color.setRGB(1, .85, .6);
  cm([FX + 12, 7.6, 2.5, FX + 13.8, 5.0, -6.5, 40], [FX + 12.3, 7.3, 1.0, FX + 13.8, 5.0, -6.5, 38], L.k); sh(V(FX + 14, 0, -6), 14); }, [[0, 'whoosh', .5], [.3, 'ratchet', .7], [.9, 'clock_spin', .6], [1.4, 'click_metal', .6]]);
cut(19.7, 'C', [-.5, .85, .3], [[0, 'whoosh', .4], [.15, 'watch_click', .6], [.5, 'yawn_f', .5]]);
// 16 «– damit sie dich nie verpasst.»: suena el despertador y Frieda salta de la cama con los prismáticos
shot(20.45, 'C', 'punch', L => { use('FZ'); inside(.5, 16); const T = L.T; show(WECK, FX + 10, 3.1, -9.6, .3, .55); WECK.userData.draw('3:17'); WECK.position.x += Math.sin(T * 60) * .06; rings(V(FX + 10, 4, -9.4), T, .9);
  const c = put(frieda, FX + 14, 3.0, -6.5, -.3); saltar(c, L.lt, .1, { h: 1.6, dur: .5, base: [FX + 14, 3.0, -6.5] }); if (L.lt > .8) actuar(c, 0, [[0, BINO]], { T }); if (L.lt > .8) binoIn(c); cara(c, T, { expr: 'shock', eyes: 'wide', mouth: 'open_smile' });
  cm([FX + 11, 8.6, 7, FX + 13, 5.6, -7, 46], [FX + 11.6, 8.2, 4.6, FX + 13, 6, -7, 44], L.k); sh(V(FX + 13, 0, -7), 14); }, [[0, 'alarm', .8], [.3, 'jump', .6], [.75, 'land', .5]]);
// ---------- b: Metzger Kalle y los pepinillos, Opa Heinz en el bus 42, Frau Krause y el «swipe», la Tafel de Papa (21,97 – 48,36 s) ----------
const MZ = V(-60.5, 0, -21);   // puerta de la Metzgerei Kalle (fachada oeste, mira a +x)
const FR0 = V(KX - 8, 0, -6);  // nevera de mi cocina (mira a +z)
// yo en la cocina de noche: bote en la izquierda, pepinillo en la boca
function duFridge(L, o = {}) { kuecheN(L); const c = put(du, FR0.x - .5, 0, FR0.z + 4.6, o.ry ?? 0); actuar(c, 0, [[0, o.pose || { aLx: 1.0, aLz: -.1, aLe: 1.1, aRx: 1.6, aRz: -.45, aRe: 2.1, headX: .05 }]], { T: L.T });
  const h = hp(c), a = c.root.rotation.y, f = V(Math.sin(a), 0, Math.cos(a)), r = V(Math.cos(a), 0, -Math.sin(a));
  show(GLAS, 0, 0, 0, a, .9); GLAS.position.copy(h).addScaledVector(f, 1.2).addScaledVector(r, .9).add(V(0, -2.4, 0));
  if (o.bite !== false) { GURK.visible = true; GURK.position.copy(h).addScaledVector(f, .95).addScaledVector(r, -.15).add(V(0, -.05, 0)); GURK.rotation.set(0, a, 1.2); }
  cara(c, L.T, o.face || { expr: 'happy', eyes: 'happy', mouth: Math.sin(L.T * 16) > 0 ? 'o' : 'grin' }); return c; }
// 17 «Metzger Kalle sieht dich.»: Kalle en la puerta de su carnicería de noche, cuchilla en mano, mirándote
shot(21.97, 'W', null, L => { town(L, 'night'); const c = put(kalle, MZ.x, 0, MZ.z, PI / 2 - .25); actuar(c, 0, [[0, { aRx: 1.2, aRz: -.2, aRe: 1.4, aLx: .3, lean: .05, headY: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' });
  FILL.intensity = 30; onFace(c, 4.2, .4, -.4, 40, L.k, 3.4); sh(MZ, 18); }, [[0, 'whoosh', .5], [.2, 'door_bell', .6], [.7, 'steps', .4], [1.2, 'crickets', .4]]);
cut(22.8, 'C', [.5, 1.05, .3], [[0, 'whoosh', .4], [.2, 'knock', .4]]);
// 18 «Wie du Gurken direkt aus dem Glas isst.»: tú, delante de la nevera abierta, comiendo pepinillos del bote
shot(23.46, 'F', null, L => { const c = duFridge(L); const h = hp(c); cm([h.x + 1.5, 6.4, h.z + 11, h.x, 4.2, h.z, 44], [h.x + 1, 6.0, h.z + 9.5, h.x, 4.2, h.z, 42], L.k); sh(FR0, 14); }, [[0, 'flash', .4], [.15, 'hum', .5], [.4, 'lid_click', .6], [.8, 'chew', .7]]);
cut(24.4, 'C', [-.6, .75, .6], [[0, 'whoosh', .4], [.1, 'chew', .7], [.5, 'sip', .5]]);
// 19 «Weil du glaubst, dass es keiner merkt.»: miras a un lado y a otro, a escondidas
shot(25.6, 'S', null, L => { const c = duFridge(L, { pose: { ...GEST.sneak, aLx: 1.0, aLe: 1.1, aRx: 1.0, aRe: 1.2, headY: Math.sin(L.lt * 6) * .7 }, face: { expr: 'sus', eyes: Math.sin(L.lt * 6) > 0 ? 'side_l' : 'side_r', mouth: 'grimace' }, bite: false });
  onFace(c, 3.4, .3, .5, 40, L.k, 2.9); sh(FR0, 14); }, [[0, 'whoosh', .4], [.3, 'creepy_ting', .4], [.6, 'squeak', .4]]);
// 20 «Aber Kalle merkt alles.»: Kalle asoma detrás de la puerta de la nevera, apuntando en su libreta
shot(27.28, 'C', 'punch', L => { const c = duFridge(L, { pose: GEST.shock, face: { expr: 'shock', eyes: 'wide', mouth: 'scream' }, bite: false }); const k = put(kalle, FR0.x + 6.2, 0, FR0.z + 2.2, -.7); actuar(k, 0, [[0, { lean: .2, twist: .2, aRx: 1.3, aRe: 1.6, aLx: 1.2, aLe: 1.4, headY: -.2 }]], { T: L.T }); cara(k, L.T, { expr: 'smug', eyes: 'squint', mouth: 'grin' });
  NEWS.visible = false; cm([FR0.x + 3, 6.8, FR0.z + 21, FR0.x + 3, 4.6, FR0.z + 3, 46], [FR0.x + 3, 6.5, FR0.z + 19, FR0.x + 3, 4.6, FR0.z + 3, 44], L.k); sh(FR0, 16); }, [[0, 'impact', .6], [.05, 'gasp', .7], [.4, 'pencil', .6], [.6, 'evil_laugh', .4]]);
// 21 «Opa Heinz sieht dich.»: en la parada del bus, por la mañana: Opa con el periódico agujereado
const OP0 = V(35, 0, 6);
shot(28.9, 'Z', null, L => { town(L); const c = put(opa, OP0.x, 0, OP0.z, -PI / 2); actuar(c, 0, [[0, { aLx: 1.5, aRx: 1.5, aLe: .9, aRe: .9, aLz: -.25, aRz: -.25 }]], { T: L.T }); coatWind(c, L.T, .3); cara(c, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' });
  const h = hp(c); show(NEWS, h.x - 1.6, h.y - .2, h.z, -PI / 2, 1.2);
  crowdAt(L, OP0.x - 3, OP0.z, 4, 6, 12, 21, { mode: 'phone' }); cm([OP0.x - 13, 6.4, OP0.z + 2, OP0.x - 1, 4.8, OP0.z, 42], [OP0.x - 11, 6.2, OP0.z + 1.5, OP0.x - 1, 5, OP0.z, 40], L.k); sh(OP0, 18); }, [[0, 'zoom_in', .5], [.2, 'paper', .7], [.6, 'birds', .4], [.9, 'cough', .4]]);
// 22 «Im Bus.»: dentro del bus 42: tú, sentado, mirando el móvil; otros pasajeros
const SEAT = V(BX + 2.9, .75, 11.8);
function busScene(L) { busIn(L); const c = put(du, SEAT.x, SEAT.y, SEAT.z, 0); actuar(c, 0, [[0, { ...SIT, ...PHONEP }]], { T: L.T }); phoneIn(c, true, .7, 1.3, 1.0); PH.userData.set('plain', { prog: .6 }); cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  [[-2.9, 5.2, 0], [-2.9, -7.6, 1], [2.9, -7.6, 2], [-2.9, 11.6, 3]].forEach(([x, z, i]) => { const e = put(EX[10 + i], BX + x, .75, z + .2, 0); actuar(e, 0, [[0, i % 2 ? { ...SIT, aLx: .5, aRx: .5 } : { ...SIT, ...GEST.phone_look }]], { T: L.T + i }); cara(e, L.T + i, { expr: i % 2 ? 'neutral' : 'happy' }); }); return c; }
shot(30.07, 'W', null, L => { busScene(L); cm([BX - 1.5, 7.4, 16, BX + 1.2, 4.2, -4, 46], [BX - 1, 7, 13, BX + 1.2, 4.2, -4, 44], L.k); sh(V(BX, 0, 0), 20); }, [[0, 'whoosh', .5], [.1, 'car', .6], [.4, 'wheels', .4]]);
// 23 «Hinter dem Sitz versteckt.»: Opa asoma por encima del respaldo, detrás de ti, con el periódico
shot(30.78, 'C', null, L => { const c = busScene(L); const o = put(opa, SEAT.x - 1.2, 2.4, SEAT.z - 3.4, .2); actuar(o, 0, [[0, { crouch: Math.max(0, Math.sin(L.lt * 3)) * .1, aLx: 1.5, aRx: 1.5, aLe: .9, aRe: .9, aLz: -.25, aRz: -.25, lean: .1 }]], { T: L.T }); cara(o, L.T, { expr: 'sus', eyes: 'side_r', mouth: 'flat' });
  const h = hp(o); show(NEWS, h.x, h.y - .7, h.z + 1.3, 0, 1.15); cm([BX + 1.6, 6.0, 18.2, SEAT.x, 5.4, SEAT.z - 2.2, 50], [BX + 1.8, 5.9, 17.6, SEAT.x, 5.4, SEAT.z - 2.2, 48], L.k); sh(SEAT, 14); }, [[0, 'impact', .4], [.1, 'paper', .7], [.6, 'creepy_ting', .5]]);
// 24 «Denn er fährt jeden Morgen dieselbe Linie wie du –»: el bus amarillo por la calle del pueblo, al amanecer
shot(31.89, 'S', null, L => { town(L); BUS.visible = true; const z = lerp(60, 110, L.k); BUS.position.set(26, 0, z); BUS.rotation.y = 0; BUS.userData.wheels.forEach(w => w.rotation.x = L.T * 6); sun.color.setRGB(1, .85, .7);
  crowdAt(L, 37, z + 30, 4, 4, 10, 24, { mode: 'wave' }); cm([23, 4.2, z + 38, 26, 5.5, z + 6, 44], [23.5, 4.0, z + 34, 26, 5.5, z + 9, 42], L.k); sh(V(26, 0, z + 10), 30); }, [[0, 'whoosh', .5], [.1, 'car_pass', .7], [.9, 'birds', .4], [1.6, 'rooster', .4]]);
// 25 «die 42.»: golpe de zoom al letrero «42»
shot(34.3, 'C', 'punch', L => { town(L); BUS.visible = true; BUS.position.set(26, 0, 118); BUS.userData.wheels.forEach(w => w.rotation.x = L.T * 6); const s = V(26, 7.6, 131.1); cm([26.6, 8.4, 139, s.x, s.y, s.z, 34], [26.4, 8.1, 136.5, s.x, s.y, s.z, 30], L.k); badge('gold', '42', W / 2, H * .3, (L.lt - .1) * 3); sh(s, 16); }, [[0, 'impact', .7], [.1, 'ding_soft', .6], [.5, 'car', .4]]);
// 26 «Frau Krause sieht dich.»: Frau Krause en el banco de la plaza con unos prismáticos de ópera
const KR0 = V(14, 0, 28.6);
shot(35.47, 'I', null, L => { town(L); const c = put(krause, KR0.x, .9, KR0.z, PI); actuar(c, 0, [[0, { ...SIT, ...BINO }]], { T: L.T }); binoIn(c); cara(c, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' });
  crowdAt(L, KR0.x, KR0.z, 6, 7, 16, 26, { mode: 'phone' }); onFace(c, 3.8, .2, .5, 40, L.k, 3.2); sh(KR0, 18); }, [[0, 'iris_pop', .6], [.2, 'birds', .4], [.5, 'zoom_in', .5], [.9, 'gasp_old', .3]]);
// 27 «Du bist an uns vorbeigewischt.»: el móvil gigante de la plaza: el vídeo del pueblo sube y desaparece
function rhScene(L, st, mode, expr) { town(L); RH.userData.draw(st); rowAt(L, HX, HZ + 7, 6, 4, -1.2, 1.2, mode, 27, { from: 0, face: V(HX, 0, HZ + 40) }); const k = put(krause, HX - 6.5, 0, HZ + 9, .5); actuar(k, 0, [[0, expr === 'shock' ? GEST.hands_face : expr === 'joy' ? GEST.cheer : GEST.slump]], { T: L.T }); cara(k, L.T, { expr, mouth: expr === 'joy' ? 'open_smile' : expr === 'shock' ? 'scream' : 'frown' }); }
shot(36.7, 'W', null, L => { rhScene(L, { swipe: easeInOut(clamp(L.lt / .9)) }, 'shock', 'shock'); cm([HX - 3, 7, HZ + 30, HX, 9, HZ, 46], [HX - 2, 7, HZ + 27, HX, 9, HZ, 44], L.k); sh(V(HX, 0, HZ), 24); }, [[0, 'swipe', .8], [.15, 'whoosh_up', .6], [.6, 'gasp', .6]]);
// 28 «Dreimal.»: tres veces seguidas: 3×
shot(37.94, 'C', 'punch', L => { rhScene(L, { swipe: 1 + clamp(L.lt / .8) * 2 }, 'sad', 'sad'); cm([HX + 2, 7, HZ + 30, HX, 9, HZ, 46], [HX + 1.6, 7.2, HZ + 27, HX, 9, HZ, 44], L.k); badge('red', '3×', W / 2, H * .3, (L.lt - .05) * 3); sh(V(HX, 0, HZ), 24); }, [[0, 'swipe', .7], [.25, 'swipe', .7], [.5, 'swipe', .7], [.6, 'sad_tone', .5]]);
// 29 «Und trotzdem kamst du zurück.»: el vídeo vuelve hacia abajo: el pueblo otra vez. ¡Todos lo celebran!
shot(38.9, 'S', null, L => { rhScene(L, { swipe: 3, back: easeInOut(clamp(L.lt / .7)) }, L.lt > .6 ? 'cheer' : 'shock', L.lt > .6 ? 'joy' : 'shock'); if (L.lt > .6) confetti(V(HX, 2, HZ + 6), L.t0 + .6, L.T, 50); cm([HX - 2, 6.5, HZ + 26, HX, 8.5, HZ, 46], [HX - 1, 6.8, HZ + 23, HX, 8.5, HZ, 44], L.k); sh(V(HX, 0, HZ), 24); }, [[0, 'whoosh_down', .7], [.6, 'cheer', .7], [.65, 'confetti', .5]]);
// 30 «Da wussten wir: Du bist anders.»: Frau Krause, con las manos en el corazón, se emociona
shot(40.33, 'F', null, L => { town(L); const c = put(krause, HX - 6.5, 0, HZ + 9, .3); actuar(c, 0, [[0, { aLx: 1.2, aLz: -.6, aLe: 1.9, aRx: 1.2, aRz: -.6, aRe: 1.9, headX: -.1, headZ: .15 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'cry', mouth: 'smile' }); tears(c, L.T); hearts(hp(c).add(V(0, 1, 0)), L.T);
  crowdAt(L, HX - 6.5, HZ + 9, 6, 6, 14, 30, { mode: 'clap' }); onFace(c, 3.6, .2, -.6, 40, L.k, 3.0); sh(V(HX - 6, 0, HZ + 9), 18); }, [[0, 'flash', .4], [.2, 'strings', .6], [.8, 'sniff', .5], [1.3, 'clap', .4]]);
// 31 «Deshalb hat mein Papa eine riesige Tafel gebaut.»: Papa en la escalera, a martillazos con la Tafel (aún apagada)
function papaLadder(L) { town(L); TAF.userData.draw({ off: true }); TAF.userData.bulbs(0); show(LAD, TX + 11.6, 0, TZ + 1.6, 0); const T = L.T, hit = Math.max(0, Math.sin(T * 9));
  const p = put(papa, TX + 11.6, 13.2, TZ + 2.4, -PI / 2 + .35); actuar(p, 0, [[0, { aRx: 1.6 + hit * .9, aRz: -.1, aRe: .3 + hit * .5, aLx: 1.2, aLe: .5, lLx: .4, lLk: .5 }]], { T }); cara(p, T, { expr: 'determined', mouth: 'grimace' });
  p.root.updateMatrixWorld(true); attach(HAM, p.aR.hand, [0, -.5, .35], [PI / 2, 0, 0], 1);
  const j = put(junge, TX + 13.6, 0, TZ + 4.2, -.6); actuar(j, 0, [[0, { aLx: 1.6, aRx: 1.6, aLe: .4, aRe: .4, headX: -.5 }]], { T }); cara(j, T, { expr: 'happy', eyes: 'up', mouth: 'open_smile' }); return p; }
shot(42.32, 'Z', null, L => { const p = papaLadder(L); const h = hp(p); cm([h.x + 3, h.y - 3, h.z + 16, h.x, h.y - .8, h.z, 46], [h.x + 2.6, h.y - 2.5, h.z + 14, h.x, h.y - .8, h.z, 44], L.k); sh(V(TX + 8, 0, TZ), 30); }, [[0, 'zoom_in', .5], [.1, 'hammer', .8], [.45, 'hammer', .8], [.8, 'hammer', .8], [1.2, 'wood_creak', .5], [1.6, 'hammer', .7]]);
shot(43.5, 'C', null, L => { const p = papaLadder(L); onFace(p, 3.6, .3, .6, 40, L.k, 3.1); }, [[0, 'whoosh', .4], [.1, 'hammer', .8], [.5, 'hammer', .7], [.9, 'hammer', .7]]);
// 32 «Mit 600 Glühbirnen.»: se encienden las bombillas una a una alrededor del marco
shot(44.92, 'C', 'punch', L => { town(L); TAF.userData.draw({}); TAF.userData.bulbs(easeOut(clamp(L.lt / 1.0)), L.T, 0); grade.uniforms.flash.value = L.lt < .1 ? .3 : 0; const p = put(papa, TX + 5, 0, TZ + 8, -.3); actuar(p, 0, [[0, GEST.cheer]], { T: L.T }); cara(p, L.T, { expr: 'joy', mouth: 'open_smile' });
  cm([TX + 3, 8, TZ + 34, TX, 17, TZ, 46], [TX + 2.4, 8.6, TZ + 31, TX, 17.4, TZ, 44], L.k); badge('gold', '600', W / 2, H * .45, (L.lt - .1) * 3); sh(V(TX, 0, TZ), 30); }, [[0, 'power_on', .8], [.1, 'sparkle', .6], [.3, 'switch', .5], [.6, 'ding_soft', .5]]);
// 33 «Jeder, der zuschaut, bekommt eine Zeile.»: la Tafel encendida; Papa la presenta y el pueblo mira
shot(46.2, 'W', null, L => { town(L); tafelAt(46, {}); TAF.userData.bulbs(1, L.T, 1); const p = put(papa, TX - 7, 0, TZ + 7, .6); actuar(p, 0, [[0, { ...GEST.point_l, aLx: 2.0 }]], { T: L.T }); talk(p, L.T, 46.2, 48.3, 'happy');
  rowAt(L, TX, TZ + 22, 9, 6, -1.0, 1.0, 'stare', 33, { from: 0, face: V(TX, 0, TZ) }); cm([TX + 8, 6, TZ + 40, TX, 15, TZ, 46], [TX + 6, 6.5, TZ + 36, TX, 15.5, TZ, 44], L.k); sh(V(TX, 0, TZ + 10), 30); }, [[0, 'whoosh', .5], [.3, 'crowd_run', .3], [.9, 'notif', .5], [1.4, 'pop', .5]]);
// ---------- c: las filas de la Tafel, «Und du?», el silencio, 29 segundos, el pulgar gigante (48,36 – 68,13 s) ----------
const TS = V(TX, 0, TZ + .34);   // pantalla de la Tafel (y 9..29)
const rowY = i => 29 - (240 + i * 110) / 680 * 20;
// primer plano de una fila de la Tafel (icono a la izquierda)
function rowShot(L, i, extra = {}) { town(L); tafelAt(L.T); TAF.userData.bulbs(1, L.T, 1); const y = rowY(i); cm([TX + .8, y - 1.5, TZ + 34, TX + .8, y - 1.8, TZ, 38], [TX + .9, y - 1.5, TZ + 30, TX + .9, y - 1.8, TZ, 36], L.k); sh(V(TX, 0, TZ), 30); }
// el pueblo delante de la Tafel, mirando a la cámara
function crowdTafel(L, mode, seed, o = {}) { town(L); tafelAt(L.T, o); TAF.userData.bulbs(1, L.T, 1); rowAt(L, TX, TZ + 2, 7, 13, -.5, .5, mode, seed, { from: 0, face: V(TX, 0, TZ + 60) }); rowAt(L, TX, TZ + 2, 8, 9.5, -.62, .62, mode, seed + 1, { from: 7, face: V(TX, 0, TZ + 60) }); }
// 34 «Drei Sekunden? Weg.»: la primera fila: 0:03… y la cruz roja
shot(48.36, 'C', null, L => { rowShot(L, 0); }, [[0, 'pop', .6], [.3, 'tick', .6], [1.0, 'glitch', .6], [1.05, 'sad_tone', .4]]);
// 35 «Sieben Sekunden? Weg.»: la segunda fila; el pueblo, decepcionado
shot(49.55, 'S', null, L => { crowdTafel(L, L.T > 50.88 ? 'sad' : 'stare', 35); cm([TX + 3, 6, TZ + 30, TX, 14, TZ, 46], [TX + 2, 6.4, TZ + 27, TX, 14.5, TZ, 44], L.k); sh(V(TX, 0, TZ + 12), 30); }, [[0, 'whoosh', .5], [.2, 'pop', .6], [1.3, 'glitch', .6], [1.35, 'sigh', .5]]);
// 36 «Zwölf Sekunden? Auch weg.»: la tercera fila
shot(50.93, 'C', 'punch', L => { rowShot(L, 2); }, [[0, 'pop', .6], [.4, 'tick', .5], [1.2, 'glitch', .6]]);
// 36b «… weg.»: Kalle se lleva la mano a la cara; Frau Krause, triste
shot(52.07, 'W', null, L => { town(L); tafelAt(L.T); const k = put(kalle, TX - 2.2, 0, TZ + 16, .15); actuar(k, 0, [[0, GEST.facepalm]], { T: L.T }); cara(k, L.T, { expr: 'sad', mouth: 'frown' }); const r = put(krause, TX + 2.2, 0, TZ + 16.5, -.15); actuar(r, 0, [[0, GEST.slump]], { T: L.T }); cara(r, L.T, { expr: 'sad', mouth: 'frown' });
  const m = hp(k).lerp(hp(r), .5); cm([m.x, m.y + .8, m.z + 13, m.x, m.y - .6, m.z, 42], [m.x, m.y + .6, m.z + 11.5, m.x, m.y - .6, m.z, 40], L.k); sh(V(TX, 0, TZ + 16), 20); }, [[0, 'whoosh', .4], [.1, 'sad_tone', .5], [.3, 'sigh', .5]]);
// 37 «Und du? Immer noch da?» (zoom lento): tu fila, verde: «DU 0:24» y subiendo; todos se giran hacia ti
shot(52.7, 'Z', 'slow', L => { crowdTafel(L, 'stare', 37); const y = rowY(3); cm([TX + 1, 8, TZ + 34, TX, y, TZ, 44], [TX + .5, 10, TZ + 24, TX, y, TZ, 38], L.k); sh(V(TX, 0, TZ + 12), 30); }, [[0, 'heartbeat', .6], [.5, 'tick', .4]]);
// 38 «Plötzlich wurde es ganz still.»: grúa sobre la plaza: nadie se mueve, solo grillos
shot(53.93, 'F', null, L => { crowdTafel(L, 'freeze', 38); orb(L.k, V(TX, 5, TZ + 16), null, [24, .45, .25, 46], [22, .3, .22, 44]); sh(V(TX, 0, TZ + 10), 34); }, [[0, 'freeze', .6], [.2, 'crickets', .7], [.9, 'wind', .4]]);
cut(54.8, 'C', [-.7, .6, -6], [[0, 'whoosh', .3], [.2, 'silence_tick', .6]]);
// 39 «Keiner bewegt sich!»: Papa abre los brazos: ¡quietos! El pueblo, congelado a media pose
shot(55.62, 'C', 'punch', L => { crowdTafel(L, 'freeze', 39); const p = put(papa, TX, 0, TZ + 20, 0); actuar(p, 0, [[0, { aLx: .3, aLz: 1.4, aRx: .3, aRz: 1.4, aLe: .2, aRe: .2, lean: .05 }]], { T: L.T }); cara(p, L.T, { expr: 'shout', eyes: 'wide', mouth: 'scream' });
  onFace(p, 4.6, .4, .3, 42, L.k, 4.0); sh(V(TX, 0, TZ + 16), 26); }, [[0, 'slam', .7], [.1, 'shout_m', .6], [.5, 'freeze', .5]]);
// 40 «Er ist bei 29 Sekunden.» (zoom lento): «DU 0:29», enorme
shot(56.84, 'Z', 'slow', L => { town(L); tafelAt(L.T); TAF.userData.bulbs(1, L.T, 1); const y = rowY(3); cm([TX + 1, y - 1, TZ + 40, TX + 1, y - 2, TZ, 40], [TX + 1, y - 1, TZ + 31, TX + 1, y - 2, TZ, 36], L.k); sh(V(TX, 0, TZ), 30); }, [[0, 'tick', .6], [.4, 'clock_tick', .6], [.9, 'tick', .5]]);
// 41 «So weit ist noch nie jemand gekommen.»: la Tafel se pone dorada: ¡REKORD! Kalle y Frau Krause, boquiabiertos
shot(58.6, 'W', null, L => { town(L); tafelAt(L.T, { gold: 1, rec: true }); TAF.userData.bulbs(1, L.T, 1); const k = put(kalle, TX - 2.4, 0, TZ + 15, .2); actuar(k, 0, [[0, GEST.hands_face]], { T: L.T }); cara(k, L.T, { expr: 'shock', mouth: 'o' }); const r = put(krause, TX + 2.4, 0, TZ + 15.5, -.2); actuar(r, 0, [[0, GEST.shock]], { T: L.T }); cara(r, L.T, { expr: 'shock', mouth: 'scream' }); tears(r, L.T);
  cm([TX, 7, TZ + 31, TX, 9.5, TZ + 6, 44], [TX, 7.4, TZ + 28, TX, 10, TZ + 6, 42], L.k); sh(V(TX, 0, TZ + 10), 26); }, [[0, 'whoosh', .5], [.1, 'fanfare', .4], [.4, 'gasp', .6], [1.2, 'gasp_old', .5]]);
cut(59.6, 'C', [.4, .8, 0], [[0, 'whoosh', .4], [.2, 'sparkle', .5]]);
// 42 «Doch dann kam der Daumen.»: el cielo se oscurece y baja un pulgar gigante sobre el Rathaus
shot(60.67, 'F', null, L => { town(L); const q = easeOut(L.k); setSky([.1, .12, .3], [.3, .3, .5], [.6, .55, .7]); sun.intensity = 1.2; hemi.intensity = .9; daumenAt(TX + 2, lerp(140, 70, q), TZ - 30, L.T); crowdTafel(L, 'point', 42);
  cm([TX - 4, 3, TZ + 46, TX, 46, TZ - 20, 52], [TX - 3, 3.2, TZ + 44, TX, 54, TZ - 20, 52], L.k); sh(V(TX, 0, TZ), 40); }, [[0, 'thunder', .6], [.2, 'whoosh_down', .7], [.8, 'drone', .6], [1.2, 'gasp', .5]]);
cut(61.5, 'C', [-.4, .8, 2], [[0, 'whoosh', .4], [.1, 'hum_low', .6]]);
// 43 «Riesig.»: desde abajo, la yema del pulgar con su huella, enorme
shot(62.27, 'C', 'punch', L => { town(L); setSky([.1, .12, .3], [.3, .3, .5], [.6, .55, .7]); sun.intensity = 1.2; daumenAt(TX + 2, 60, TZ - 10, L.T, { rx: -.6 }); crowdTafel(L, 'shock', 43); cm([TX + 2, 4, TZ + 30, TX + 2, 60, TZ - 10, 56], [TX + 2, 4, TZ + 28, TX + 2, 61, TZ - 10, 54], L.k); sh(V(TX, 0, TZ), 40); }, [[0, 'impact', .7], [.05, 'braam_short', .5], [.2, 'gasp', .6]]);
// 44 «Direkt über der Stadt.»: plano aéreo: el pulgar flota sobre la plaza, su sombra sobre el pueblo
shot(62.87, 'S', null, L => { town(L); setSky([.1, .12, .3], [.3, .3, .5], [.6, .55, .7]); sun.intensity = 1.6; daumenAt(TX, 48, TZ + 10, L.T); crowdTafel(L, 'cower', 44); orb(L.k, V(TX, 40, TZ + 8), null, [130, .9, .32, 48], [120, .7, .28, 46]); sh(V(TX, 0, TZ + 10), 60); }, [[0, 'whoosh', .5], [.2, 'wind', .6], [.6, 'heli', .3]]);
// 45 «Alle – festhalten!»: todos se agarran: a las farolas, unos a otros; Papa abraza al chico
shot(64.1, 'C', 'punch', L => { town(L); setSky([.1, .12, .3], [.3, .3, .5], [.6, .55, .7]); sun.intensity = 1.2; daumenAt(TX, 44, TZ + 10, L.T); crowdTafel(L, 'hold', 45); const p = put(papa, TX, 0, TZ + 20, 0); actuar(p, 0, [[0, shv(GEST.brace, L.T, 2)]], { T: L.T }); cara(p, L.T, { expr: 'shout', eyes: 'angry', mouth: 'scream' });
  const j = put(junge, TX + 3, 0, TZ + 19, -.3); actuar(j, 0, [[0, shv(GEST.cower, L.T, 2)]], { T: L.T }); cara(j, L.T, { expr: 'worried', eyes: 'closed', mouth: 'grimace_wide' }); SHAKE = .3; onFace(p, 6, 1.5, .5, 46, L.k, 5.4); sh(V(TX, 0, TZ + 16), 26); }, [[0, 'slam', .6], [.1, 'shout_m', .6], [.4, 'wind', .6], [.8, 'shiver', .5]]);
// 46 (silencio de tensión, zoom lento): el pulgar justo encima de la Tafel; tu contador sigue corriendo
shot(65.35, 'Z', 'slow', L => { town(L); setSky([.1, .12, .3], [.3, .3, .5], [.6, .55, .7]); sun.intensity = 1.2; tafelAt(L.T); TAF.userData.bulbs(1, L.T, 1); daumenAt(TX, 40 - L.k * 3, TZ + 4, L.T, { rx: -.1 }); crowdTafel(L, 'hold', 46);
  const y = rowY(3); cm([TX + 4, 6, TZ + 40, TX, 22, TZ, 50], [TX + 1.5, 9, TZ + 22, TX, 18, TZ, 44], L.k); SHAKE = .12; sh(V(TX, 0, TZ + 10), 34); }, [[0, 'heartbeat', .8], [.9, 'heartbeat', .8], [1.8, 'heartbeat', .8], [.3, 'tick', .5], [1.3, 'tick', .5], [2.3, 'tick', .5]]);
cut(66.75, 'C', [-.6, .7, -3], [[0, 'silence_tick', .5], [.5, 'shiver', .4]]);
// ---------- d: «Er ist geblieben», la fiesta, el zoom infinito, el túnel, el sofá dorado con «DU», el bucle (68,13 – 93,9 s) ----------
// 47 «Er ist geblieben.»: el pulgar se va hacia arriba, vuelve el sol, todos saltan
shot(68.13, 'F', null, L => { town(L); const q = easeIn(clamp(L.lt / .8)); daumenAt(TX, 40 + q * 120, TZ + 4, L.T); tafelAt(L.T, { gold: 1 }); TAF.userData.bulbs(1, L.T, 1); crowdTafel(L, 'cheer', 47, { gold: 1 }); confetti(V(TX, 4, TZ + 12), L.t0 + .1, L.T, 70, 1.4);
  cm([TX + 3, 5, TZ + 36, TX, 12, TZ, 46], [TX + 2, 5.4, TZ + 33, TX, 12.5, TZ, 44], L.k); sh(V(TX, 0, TZ + 10), 30); }, [[0, 'whoosh_up', .8], [.1, 'cheer', .8], [.2, 'confetti', .6], [.5, 'party_horn', .5]]);
// 48 «Die ganze Stadt hat geschrien.»: fuegos artificiales; Papa sube al chico a hombros
shot(69.14, 'C', null, L => { town(L); tafelAt(L.T, { gold: 1 }); TAF.userData.bulbs(1, L.T, 1); const p = put(papa, TX, 0, TZ + 20, 0); actuar(p, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .2, aRz: .2, aLe: .6, aRe: .6, headX: -.2 }]], { T: L.T }); cara(p, L.T, { expr: 'joy', mouth: 'laugh' });
  const h = hp(p); const j = put(junge, h.x, h.y + .2, h.z - .2, 0); actuar(j, 0, [[0, { ...GEST.cheer, lLx: -1.4, lRx: -1.4, lLk: 1.4, lRk: 1.4 }]], { T: L.T }); cara(j, L.T, { expr: 'joy', mouth: 'open_smile' });
  crowdAt(L, TX, TZ + 20, 18, 4, 16, 48, { mode: 'cheer' }); fireworks(V(TX, 10, TZ - 10), L.T); onFace(p, 9, 3.5, -.4, 46, L.k, 8.2); sh(V(TX, 0, TZ + 20), 26); }, [[0, 'firework', .6], [.2, 'cheer', .7], [.6, 'firework', .5], [1.0, 'whistle', .4]]);
cut(70.0, 'C', [.7, 1.3, 4], [[0, 'firework', .6], [.3, 'clap_crowd', .6]]);
// 49 «Und als es wieder ruhig war, sagte Papa:»: atardecer tranquilo; Papa, móvil en mano, te habla
const PP = V(TX + 2, 0, TZ + 30);
function papaPhone(L, o = {}) { town(L); setSky([.3, .3, .7], [.9, .55, .45], [1, .75, .45]); sun.color.setRGB(1, .7, .45); tafelAt(L.T, { gold: 1 }); const p = put(papa, PP.x, 0, PP.z, 0); actuar(p, 0, [[0, { aRx: 1.3, aRz: -.15, aRe: .5, aLx: .2, headX: .05 }]], { T: L.T }); talk(p, L.T, 71.9, 74, 'happy');
  p.root.updateMatrixWorld(true); const h = hp(p); PH.visible = true; PH.scale.setScalar(o.s ?? 1.1); PH.position.copy(h).add(V(.9, -1.2, 2.2)); PH.lookAt(PH.position.clone().add(V(0, 0, 10))); PH.userData.set('plain', { prog: .9 }); return p; }
shot(70.81, 'W', null, L => { const p = papaPhone(L); crowdAt(L, PP.x, PP.z, 10, 6, 16, 49, { mode: 'stare' }); onFace(p, 5, .6, .4, 42, L.k, 4.4); sh(PP, 24); }, [[0, 'whoosh', .5], [.2, 'birds', .4], [.9, 'wind', .3]]);
cut(71.8, 'C', [-.45, .8, .3], [[0, 'whoosh', .3], [.2, 'mobile', .4]]);
// 50 «Zoom rein. Ins Handy.»: la cámara se mete en el móvil de Papa (efecto Droste: el vídeo dentro del vídeo)
shot(72.72, 'Z', null, L => { const p = papaPhone(L, { s: 1.4 }); const ph = wpos(PH); droste(PHS, 6); const e = easeIn(L.k); cm([ph.x, ph.y + .1, ph.z + 7, ph.x, ph.y, ph.z, 40], [ph.x, ph.y, ph.z + 1.25, ph.x, ph.y, ph.z, 40], e, x => x); sh(PP, 24); }, [[0, 'zoom_in', .8], [.4, 'whoosh', .5], [.9, 'magic_hit', .5]]);
// 51 «In dein Zimmer.»: tu cuarto de noche: tú en la cama con el móvil
shot(74.03, 'Z', null, L => { zimmerN(L); const c = duBed(L, { glow: 26, expr: 'happy', mouth: 'smile' }); droste(PHS, 6); const ph = wpos(PH); cm([ZX + 13, 8.5, 9, BEDP.x, 4.6, BEDP.z, 44], [ph.x + .2, ph.y + .4, ph.z + 4.5, ph.x, ph.y, ph.z, 40], easeIn(L.k), x => x); sh(BEDP, 14); }, [[0, 'zoom_in', .7], [.3, 'cloth', .4]]);
// 52 «In dein Handy.»: tu pantalla, cada vez más cerca
shot(74.82, 'Z', null, L => { zimmerN(L); duBed(L, { glow: 26, expr: 'happy', mouth: 'smile', out: true }); droste(PHS, 7); const ph = wpos(PH); PH.updateMatrixWorld(true); const n = V(0, 0, 1).applyQuaternion(PH.getWorldQuaternion(new THREE.Quaternion())); cm([ph.x + n.x * 3.4, ph.y + n.y * 3.4, ph.z + n.z * 3.4, ph.x, ph.y, ph.z, 40], [ph.x + n.x * .95, ph.y + n.y * .95, ph.z + n.z * .95, ph.x, ph.y, ph.z, 40], easeIn(L.k), x => x); sh(BEDP, 14); }, [[0, 'zoom_in', .7], [.4, 'glitch', .4]]);
// 53 «In unsere Stadt.»: desde el cielo, en picado hacia el móvil gigante de la plaza
shot(75.64, 'Z', null, L => { town(L); RH.userData.draw({}); droste(RH.userData.scr, 6); crowdAt(L, HX, HZ + 10, 14, 6, 18, 53, { mode: 'wave' }); const c = V(HX, 10.2, HZ); const f = V(Math.sin(-.25), 0, Math.cos(-.25));
  cm([c.x + f.x * 70, 60, c.z + f.z * 70, c.x, 6, c.z, 46], [c.x + f.x * 11.5, 10.6, c.z + f.z * 11.5, c.x, 10.2, c.z, 44], easeIn(L.k), x => x); sh(V(HX, 0, HZ), 40); }, [[0, 'whoosh_down', .7], [.5, 'zoom_in', .6], [.8, 'city_amb', .4]]);
// 54 «In dein Zimmer.»: otra vez tu cuarto, desde la tele
shot(76.75, 'Z', null, L => { zimmerN(L); duBed(L, { glow: 26, expr: 'happy', mouth: 'smile' }); droste(PHS, 7); const ph = wpos(PH); cm([ZX + 4, 9, 11, BEDP.x, 4.4, BEDP.z, 44], [ph.x - .3, ph.y + .3, ph.z + 3.6, ph.x, ph.y, ph.z, 40], easeIn(L.k), x => x); sh(BEDP, 14); }, [[0, 'zoom_in', .7], [.4, 'whoosh', .4]]);
// 55 «Für immer.»: espiral infinita: la pantalla dentro de la pantalla, girando
shot(77.7, 'R', null, L => { zimmerN(L); duBed(L, { glow: 26, expr: 'happy', mouth: 'smile', out: true }); droste(PHS, 10); const ph = wpos(PH); PH.updateMatrixWorld(true); const n = V(0, 0, 1).applyQuaternion(PH.getWorldQuaternion(new THREE.Quaternion())); const d = lerp(2.2, 1.0, easeIn(L.k)); cam([ph.x + n.x * d, ph.y + n.y * d, ph.z + n.z * d], [ph.x, ph.y, ph.z], 40); ROLL = L.lt * 2.4; sh(BEDP, 14); }, [[0, 'whoosh', .6], [.2, 'clock_spin', .6], [.5, 'magic_hit', .5]]);
// 56 «Denn hinter dem letzten Bild war ein Tunnel.»: un túnel de marcos de pantalla que brillan; la cámara vuela dentro
function tunnel(L, z0, z1) { use('TUN'); MODE = 'in'; renderer.toneMappingExposure = 1; hemi.intensity = .4; sun.intensity = 0; FILL.intensity = 0; bloom.strength = .5; bloom.threshold = .6; scene.fog.color.setRGB(.02, .02, .06); scene.fog.density = .004; setSky([0, 0, .02], [0, 0, .04], [.02, .02, .06]);
  TUN.fr.forEach((f, i) => f.rotation.z = L.T * .4 + i * .15); const z = lerp(z0, z1, L.k); cam([NX + Math.sin(L.T * 1.3) * .6, Math.cos(L.T * 1.1) * .6, z], [NX, 0, z - 30], 60); }
shot(78.49, 'Z', null, L => { tunnel(L, 20, -60); }, [[0, 'whoosh', .7], [.3, 'drone', .6], [1.0, 'whoosh', .5], [1.6, 'whoosh', .5]]);
// 57 «Und ganz am Ende des Tunnels»: la luz al final, cada vez más cerca
shot(80.64, 'F', null, L => { tunnel(L, -120, -225); grade.uniforms.flash.value = Math.max(0, (L.k - .7) / .3) * .7; }, [[0, 'whoosh', .6], [.5, 'choir', .5], [1.0, 'riser_short', .5]]);
// 58 «stand ein goldenes Sofa auf unserem Marktplatz.» (zoom lento): el sofá dorado bajo el foco; el pueblo aplaude alrededor
function sofaScene(L, mode = 'clap', seed = 58) { town(L); tafelAt(L.T, { gold: 1 }); TAF.userData.bulbs(1, L.T, 1); BEAM.visible = true; rowAt(L, SX, SZ - 3, 9, 11, -1.6, -.55, mode, seed, { from: 0, face: V(SX, 0, SZ + 26) }); rowAt(L, SX, SZ - 3, 9, 11, .55, 1.6, mode, seed + 1, { from: 9, face: V(SX, 0, SZ + 26) }); }
shot(81.98, 'F', 'slow', L => { sofaScene(L); confRain(V(SX, 0, SZ + 4), L.T, 50, 30, 20, 18); orb(L.k, V(SX, 4, SZ), null, [38, .4, .16, 46], [24, .15, .12, 42]); sh(V(SX, 0, SZ), 30); }, [[0, 'flash', .6], [.1, 'choir', .6], [.4, 'clap_crowd', .6], [1.4, 'sparkle', .5]]);
cut(83.4, 'C', [-.6, .9, 1], [[0, 'whoosh', .4], [.2, 'fanfare', .4]]);
// 59 «Mit deinem Namen drauf.»: la placa roja con «DU»
shot(84.8, 'C', 'punch', L => { sofaScene(L, 'clap', 59); const p = V(SX, 6.4, SZ - .9); cm([SX + .8, 7.4, SZ + 14, p.x, p.y, p.z, 40], [SX + .5, 7.0, SZ + 11.5, p.x, p.y, p.z, 38], L.k); sh(V(SX, 0, SZ), 20); }, [[0, 'impact', .6], [.1, 'sparkle', .7], [.6, 'ding_soft', .5]]);
// 60 «Weil du der Erste bist, der geblieben ist.»: Papa presenta el sofá; «#1»
shot(86.2, 'W', null, L => { sofaScene(L, 'cheer', 60); const p = put(papa, SX + 6.5, 0, SZ + 6, -.5); actuar(p, 0, [[0, { aLx: 1.2, aLz: .9, aLe: .2, aRx: .3, headX: -.05 }]], { T: L.T }); cara(p, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); const r = put(krause, SX - 6, 0, SZ + 6.5, .5); actuar(r, 0, [[0, { aLx: 1.2, aLz: -.6, aLe: 1.9, aRx: 1.2, aRz: -.6, aRe: 1.9 }]], { T: L.T }); cara(r, L.T, { expr: 'happy', eyes: 'cry', mouth: 'smile' }); tears(r, L.T);
  cm([SX, 7, SZ + 26, SX, 4.5, SZ + 3, 46], [SX, 7.2, SZ + 23, SX, 4.6, SZ + 3, 44], L.k); badge('gold', '#1', W / 2, H * .2, (L.lt - .2) * 3); sh(V(SX, 0, SZ + 4), 26); }, [[0, 'whoosh', .5], [.2, 'fanfare', .5], [.6, 'cheer', .5]]);
cut(87.4, 'C', [.5, .75, .5], [[0, 'whoosh', .4], [.2, 'clap', .5]]);
// 61 «Du schaust diese Stadt nämlich nicht.»: todo el pueblo, en filas, te mira y sonríe
shot(88.59, 'Z', null, L => { town(L); tafelAt(L.T, { gold: 1 }); TAF.userData.bulbs(1, L.T, 1); setSky([.3, .3, .7], [.9, .55, .45], [1, .75, .45]); sun.color.setRGB(1, .75, .5); rowAt(L, P0.x, P0.z - 30, 9, 22, -.34, .34, 'stare', 61, { from: 0, face: V(P0.x, 0, 40) }); rowAt(L, P0.x, P0.z - 30, 9, 17, -.42, .42, 'stare', 62, { from: 9, face: V(P0.x, 0, 40) });
  for (const [ch, x] of [[frieda, -4.5], [kalle, -1.5], [opa, 1.5], [krause, 4.5]]) { put(ch, P0.x + x, 0, P0.z - 4, 0); actuar(ch, 0, [[0, { aLx: .2, aRx: .2 }]], { T: L.T }); cara(ch, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' }); }
  cm([P0.x, 5.2, P0.z + 15, P0.x, 4.2, P0.z - 6, 46], [P0.x, 4.9, P0.z + 11, P0.x, 4.3, P0.z - 6, 44], L.k); sh(P0, 30); }, [[0, 'zoom_in', .5], [.3, 'strings', .5], [1.0, 'heartbeat', .4]]);
// 62 «Du wohnst hier.»: desde el sofá (tus ojos): todos te saludan; Papa te tiende la mano
shot(90.24, 'C', 'punch', L => { sofaScene(L, 'wave', 62); const p = put(papa, SX + 1.5, 0, SZ + 10, PI + .15); actuar(p, 0, [[0, { aRx: 1.5, aRe: .2, aLx: .3, lean: .1 }]], { T: L.T }); cara(p, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); const j = put(junge, SX - 3.5, 0, SZ + 7.5, PI + .3); actuar(j, 0, [[0, { ...GEST.wave, aRz: .4 + Math.sin(L.T * 8) * .3 }]], { T: L.T }); cara(j, L.T, { expr: 'joy', mouth: 'open_smile' });
  crowdAt(L, SX, SZ + 10, 12, 6, 14, 62, { from: 18, mode: 'wave' }); cm([SX, 5.6, SZ + 1, SX, 4.6, SZ + 12, 50], [SX, 5.6, SZ + 1.5, SX, 4.6, SZ + 12, 48], L.k); sh(V(SX, 0, SZ + 8), 24); }, [[0, 'impact', .4], [.1, 'cheer', .5], [.5, 'kids_laugh', .4]]);
// 63 «Also … in dieser Stadt … alle –»: vuelta al principio (bucle): la plaza, la gente corriendo, la Tafel al fondo
shot(91.24, 'W', null, L => { hookStreet(L); }, [[0, 'whoosh', .6], [.1, 'run_cobble', .6], [.5, 'cheer', .4]]);
cut(92.5, 'C', [-.3, .85, .6], [[0, 'whoosh', .4], [.2, 'kids_laugh', .4]]);


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
for (let i = 0; i < S.length; i++) { if (S[i].cut) { S[i].fn = S[i - 1].fn; S[i].g = S[i - 1].g; } else S[i].g = i; }
for (const s of S) { s.G0 = S[s.g].t0; s.G1 = s.t1; } for (let i = S.length - 1; i >= 0; i--) if (i + 1 < S.length && S[i + 1].g === S[i].g) S[i].G1 = S[i + 1].G1;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); } });
CUES.push({ t: 0, s: 'zoom_fast', g: .9 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.G0, d = s.G1 - s.G0, L = { lt, k: clamp(lt / d), T, d, t0: s.G0, t1: s.G1 };
  hideAll(); BAD_.length = 0; s.fn(L);
  if (s.alt) { const [ay, f, dy] = s.alt; const v = camera.position.clone().sub(LOOK); v.applyAxisAngle(V(0, 1, 0), ay); v.multiplyScalar(f ?? 1); camera.position.copy(LOOK).add(v); camera.position.y += dy || 0; camera.lookAt(LOOK); }
  while (POST.length) POST.shift()();
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud', 'huss_hit'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = BLUR;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, MODE === 'night' ? 'noche' : 'polvo', MODE === 'in' ? .3 : .4);
  if (BIRDS.update) BIRDS.update(T, camera.position.clone().addScaledVector(dir, 60).add(V(0, 25, 0)), (MODE === 'day') && BIRDSON ? 1 : 0);
  sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position); composer.render(); BLUR = 0;
}
let BLUR = 0, DROSTE = null, ROLL = 0;
// efecto Droste: copia la imagen dentro de la pantalla del móvil, n veces (túnel infinito)
function drawDroste() { const m = DROSTE.mesh; m.updateMatrixWorld(true); const g = m.geometry; g.computeBoundingBox(); const b = g.boundingBox;
  const P = [[b.min.x, b.max.y], [b.max.x, b.max.y], [b.min.x, b.min.y]].map(([x, y]) => proj(m.localToWorld(V(x, y, 0))));
  if (P.some(p => p[2] >= 1)) return; const [A, B, C] = P; const ax = (B[0] - A[0]) / W, ay = (B[1] - A[1]) / W, bx = (C[0] - A[0]) / H, by = (C[1] - A[1]) / H;
  for (let k = 0; k < DROSTE.n; k++) { tctx.clearRect(0, 0, W, H); tctx.drawImage(out, 0, 0); octx.save(); octx.setTransform(ax, ay, bx, by, A[0], A[1]); octx.drawImage(TMP, 0, 0, W, H); octx.restore(); } }
function renderAt(T) {
  const i = shotAt(T), s = S[i]; let tr = null, a = 0, ph = 0; const fO = (s.t1 - T) * FPS, fI = (T - s.t0) * FPS;
  if (s.tr && fO < TRW[s.tr] && i + 1 < S.length) { tr = s.tr; a = 1 - fO / TRW[s.tr]; ph = -1; } else if (i > 0 && S[i - 1].tr && fI < TRW[S[i - 1].tr]) { tr = S[i - 1].tr; a = 1 - fI / TRW[S[i - 1].tr]; ph = 1; }
  renderShot(i, T, tr, a);
  octx.save(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.translate(W / 2, H / 2); const a2 = a * a; if (ROLL) octx.rotate(ROLL);
  if (tr === 'W') octx.translate(ph * a2 * W * .45, 0); if (tr === 'S') octx.translate(0, ph * a2 * H * .35);
  if (tr === 'Z') { const sc = ph < 0 ? 1 + a2 * .6 : 1 + a2 * .35; octx.scale(sc, sc); octx.filter = `blur(${(a * 8).toFixed(1)}px)`; }
  if (tr === 'R') { octx.rotate((ph < 0 ? 1 : -1) * a2 * .55); octx.scale(1 + a2 * .3, 1 + a2 * .3); octx.filter = `blur(${(a * 7).toFixed(1)}px)`; }
  if (tr === 'C' && ph > 0) { const sc = 1 + a * .22; octx.scale(sc, sc); }
  if (tr === 'I') { octx.beginPath(); octx.arc(0, 0, Math.max(1, (1 - a2) * H * .62), 0, 7); octx.clip(); }
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  if (DROSTE && !tr) drawDroste();
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { hp, du, renderer, composer, bloom, sun, grade, scene, camera, TAF };

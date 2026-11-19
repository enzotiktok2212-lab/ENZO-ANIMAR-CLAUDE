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
function duBed(L, o = {}) { const c = put(du, BEDP.x, BEDP.y, BEDP.z, o.ry ?? 0); actuar(c, 0, [[0, { ...SIT, lLk: 0, lRk: 0, ...PHONEP, lean: .15, ...(o.pose || {}) }]], { T: L.T }); phoneIn(c, true); cara(c, L.T, { expr: o.expr || 'neutral', eyes: o.eyes, mouth: o.mouth || 'flat' });
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
//@@PLANOS@@

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

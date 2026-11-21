// Stadtvideos — planos sincronizados con audio/words.json (1080×1920, 30 fps). Cambio de escena cada ~1,8 s.
// Los planos están en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { makeKumpel, makeJonas, makePapa, makeSie, makeEr, makeLena, makeKassiererin, makeFahrer, makeMayor, makeFeuerwehr, makeHero, makeOma, makeMama } from './gvolk.js';
import { stadt, kueche, bad, zimmer, klasse, flur, omaStube, barrio, mammut, turmRaum, hinterUhr, schacht, phone, vidTex, drawVid, faceIcon, fig, HERO_C, JONAS_C, drawHouses } from './svsets.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 121.7, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
const KX = 1000, BX = 1100, ZX = 1200, JX = 1300, CX = 1400, FX = 1500, OX = 1600, NX = 2000, TX = 2400, UX = 2600, SX = 2800;
const ST = stadt(scene), KU = kueche(scene, KX), BA = bad(scene, BX), ZI = zimmer(scene, ZX), JZ = zimmer(scene, JX, '#2a3a5a', '#24344e', 'jonas'), KL = klasse(scene, CX), FL = flur(scene, FX), OS = omaStube(scene, OX), NB = barrio(scene, NX), TR = turmRaum(scene, TX), HU = hinterUhr(scene, UX), SC = schacht(scene, SX);
const SETS = { ST: ST.G, KU: KU.g, BA: BA.g, ZI: ZI.g, JZ: JZ.g, KL: KL.g, FL: FL.g, OS: OS.g, NB: NB.g, TR: TR.g, HU: HU.g, SC: SC.g };
for (const k in SETS) outline(SETS[k], 1.4);
const OMAH = NB.houses[2];   // casa de la Oma (lado oeste, z = 4)
// ---------- reparto ----------
const ich = makeHero(scene), jonas = makeJonas(scene), brandt = makePapa(scene), oma = makeOma(scene), mama = makeMama(scene), sie = makeSie(scene), er = makeEr(scene), lena = makeLena(scene), kasse = makeKassiererin(scene), fahrer = makeFahrer(scene), mayor = makeMayor(scene);
const K = Array.from({ length: 8 }, (_, i) => makeKumpel(scene, i)); const FW = [makeFeuerwehr(scene, 0), makeFeuerwehr(scene, 1)];
kitFace(ich, 'hero'); kitFace(jonas, 'plain'); kitFace(brandt, 'mustache'); kitFace(oma, 'girl'); kitFace(mama, 'girl'); kitFace(sie, 'girl'); kitFace(er, 'kid'); kitFace(lena, 'girl'); kitFace(kasse, 'girl'); kitFace(fahrer, 'plain'); kitFace(mayor, 'mustache');
K.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'plain', 'girl', 'girl', 'kid', 'hero'][i])); FW.forEach(c => kitFace(c, 'plain'));
const POOL = [ich, jonas, brandt, oma, mama, sie, er, lena, kasse, fahrer, mayor, ...K, ...FW]; POOL.forEach(c => outline(c.root, 2));
const EXTRA = [K[0], K[1], K[2], K[3], K[4], K[5], K[6], K[7], sie, er, lena, kasse, fahrer, mayor, FW[0], FW[1], mama];
// ---------- mamuts ----------
const MAM = [mammut(scene, '#7a5232', '#4a2e18'), mammut(scene, '#8a6040', '#5a3a20'), mammut(scene, '#5a3a22', '#3a2210'), mammut(scene, '#a07040', '#6a4a28', { scale: .45 })];
MAM.forEach(m => outline(m.root, 2.2)); const BABY = MAM[3];
// ---------- atrezo ----------
const PH = Array.from({ length: 18 }, (_, i) => phone(scene, [0x1a1a22, 0xe8e8ec, 0x2a6ad8, 0xff5a85, 0x1a1a22, 0x3ad8a0][i % 6])); PH.forEach(p => outline(p, 1.4));
const TAB = (() => { const g = new THREE.Group(); scene.add(g); box(3.2, 2.2, .14, mat(0xe8e8ec, { metalness: .5, roughness: .3 }), .12, g, 0, 0, 0); const s = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.9), new THREE.MeshBasicMaterial({ color: new THREE.Color(.85, .85, .85), toneMapped: false })); s.position.z = .08; g.add(s); const cv = document.createElement('canvas'); cv.width = 480; cv.height = 315; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; s.material.map = t; let key = null;
  g.userData.draw = (k, fn) => { if (k === key) return; key = k; fn(cv.getContext('2d'), 480, 315); t.needsUpdate = true; }; outline(g, 1.4); return g; })();
const CHALK = (() => { const g = new THREE.Group(); scene.add(g); box(.18, .7, .18, mat(0xffffff), .04, g, 0, 0, 0); return g; })();
const CARD = (() => { const g = new THREE.Group(); scene.add(g); box(1.6, 1, .06, mat(0xffd23f, { metalness: .4, roughness: .3 }), .08, g, 0, 0, 0); box(.4, .3, .08, mat(0xd9a531, { metalness: .8 }), .03, g, -.4, .1, 0); return g; })();
const CASH = Array.from({ length: 14 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(1.2, .6), new THREE.MeshStandardMaterial({ color: 0x8ad88a, roughness: .8, side: THREE.DoubleSide })); scene.add(p); return p; });
const CONF = Array.from({ length: 60 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const SMOKE = Array.from({ length: 22 }, (_, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(.5, 10, 8), new THREE.MeshStandardMaterial({ color: 0x5a5a62, transparent: true, opacity: .55, roughness: 1, depthWrite: false })); scene.add(s); return s; });
const SPARK = Array.from({ length: 24 }, () => { const s = new THREE.Mesh(new THREE.BoxGeometry(.08, .08, .3), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 2, .6), toneMapped: false })); scene.add(s); return s; });
const DRIP = Array.from({ length: 10 }, () => { const s = sphere(.12, new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xff6a1a, emissiveIntensity: .6 }), scene, 0, 0, 0, 6, 4); return s; });
const SWEAT = sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8);
const BOWLS = Array.from({ length: 2 }, () => { const g = new THREE.Group(); scene.add(g); cyl(.9, .6, .7, mat(0xffffff), 16, g, 0, 0, 0); return g; });
const PROPS = [...PH, TAB, CHALK, CARD, ...CASH, ...CONF, ...SMOKE, ...SPARK, ...DRIP, SWEAT, ...BOWLS];
// ---------- ambiente ----------
const AIR = aire(scene, 260); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day';
const WINS = ST.wins;
function winLights(k) { for (const m of WINS) m.emissiveIntensity = k; }
function day() { MODE = 'day'; renderer.toneMappingExposure = .96; setSky([.22, .5, .95], [.5, .74, 1], [.84, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.2; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.55, .6, .45); sun.intensity = 2.4; sun.color.setRGB(1, .95, .86); rim.intensity = 1.0;
  scene.fog.color.setRGB(.82, .9, 1); scene.fog.density = .0008; bloom.strength = .14; bloom.threshold = .92; winLights(0); FILL.intensity = 0; }
function morning() { day(); setSky([.3, .5, .9], [.7, .76, .95], [1, .86, .7]); sun.color.setRGB(1, .86, .66); sun.intensity = 2.2; hemi.intensity = 1.1; scene.fog.color.setRGB(.95, .88, .8); }
function night() { MODE = 'night'; renderer.toneMappingExposure = .92; setSky([.02, .04, .14], [.06, .1, .3], [.16, .2, .42]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = .75; hemi.color.setRGB(.55, .66, 1); hemi.groundColor.setRGB(.18, .18, .28); sun.intensity = .9; sun.color.setRGB(.72, .78, 1); rim.intensity = 1.6;
  scene.fog.color.setRGB(.1, .14, .28); scene.fog.density = .0009; bloom.strength = .22; bloom.threshold = .9; winLights(.9); FILL.intensity = 30; }
function inside(h = .8, fill = 60) { MODE = 'in'; renderer.toneMappingExposure = .92; hemi.intensity = h; hemi.color.setRGB(.95, .95, 1); hemi.groundColor.setRGB(.5, .45, .4); sun.intensity = 0; rim.intensity = .5; bloom.strength = .14; bloom.threshold = .92; scene.fog.density = .0002; FILL.intensity = fill; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const m of MAM) { m.root.visible = false; m.root.rotation.set(0, 0, 0); m.root.scale.setScalar(m.scale); m.pose(0, 0); }
  for (const k in SETS) SETS[k].visible = false;
  OS.LAVA.visible = false; OS.rug.visible = true; OS.LL.intensity = 0; OS.BUB.forEach(b => b.position.y = -5); FL.hot.emissiveIntensity = 0; FL.STEAM.forEach(s => s.visible = false); KL.FLOOR.intensity = 0; NB.PRINTS.visible = false;
  ZI.BLUE.intensity = 0; ZI.LMP.intensity = 120; JZ.BLUE.intensity = 0; JZ.LMP.intensity = 120; ST.GRILL.position.set(2.2, 2.4, .5); ST.GRILL.rotation.set(0, 0, 0);
  TR.SL.intensity = 0; TR.BEAM.visible = false; TR.dome.material.emissiveIntensity = .3; TR.panels.forEach((p, i) => { p.material.map = TR.texH[i]; }); TR.cap.position.y = 4.6; TR.L.intensity = 140; TR.CAMS.forEach(c => c.hd.rotation.set(0, 0, 0));
  grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.42; grade.uniforms.sharp.value = 1.05; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
// teléfono en la mano derecha, pantalla hacia la cara (con la pose 'phone_look')
const holdPhone = (i, ch, kind = 'lava', o = {}, r = 1) => { const p = attach(PH[i], (r ? ch.aR : ch.aL).hand, [0, -.55, .5], [-.35, 0, 0], 1.0); p.userData.set(kind, o); return p; };
// enseñar el móvil a cámara (pantalla hacia delante)
const SHOW = { aRx: 1.0, aRz: -.12, aRe: .65, aLz: .1, aLe: .2, headX: .12 };
const holdShow = (i, ch, kind = 'lava', o = {}, s = 1.3) => { const p = attach(PH[i], ch.aR.hand, [0, -.85, .05], [1.65, 0, 0], s); p.userData.set(kind, o); return p; };
// pantallas especiales del móvil/tableta (texturas cacheadas)
const PT = new Map(); const ptex = (key, fn, w = 300, h = 533) => { if (!PT.has(key)) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; PT.set(key, t); } return PT.get(key); };
const LOOK = { aRx: 1.25, aRz: -.25, aRe: 1.6, aLx: .9, aLz: -.15, aLe: 1.6, headX: .38 };
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .3 + dy, h.z + fz * d - fx * side], [h.x, h.y - .5, h.z], fov); }
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function ojos(expr, T, sd) { const n = Math.sin(T * .9 + sd) * .55 + Math.sin(T * 2.3 + sd * 2.1) * .45;
  switch (expr) {
    case 'neutral': case 'talk': case undefined: return n > .25 ? 'half' : n < -.55 ? (sd % 2 ? 'side_l' : 'side_r') : 'normal';
    case 'sad': return n > -.1 ? 'half' : 'down';
    case 'happy': case 'smile': case 'relief': case 'joy': return n > -.3 ? 'happy' : 'half';
    case 'worried': return n > .45 ? 'side_l' : n < -.45 ? 'down' : 'worried';
    case 'scared': return n > .3 ? 'worried' : 'scared';
    case 'shock': case 'gasp': return n > -.2 ? 'wide' : 'scared';
    case 'determined': return n > .5 ? 'squint' : 'angry';
    case 'angry': case 'shout': return n > .55 ? 'squint' : 'angry';
    case 'confused': return n > 0 ? 'squint' : 'side_r';
    case 'sus': case 'smug': return n > .2 ? 'squint' : 'half';
    case 'bored': case 'tired': return 'half';
    case 'down': return 'down';
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk') => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat' });
const laughF = (ch, T) => cara(ch, T, { expr: 'joy', eyes: 'happy', mouth: Math.sin(T * 18) > 0 ? 'laugh' : 'open_smile' });
const LAUGH = T => ({ lean: -.12 + Math.abs(Math.sin(T * 14)) * .06, headX: -.25, crouch: Math.abs(Math.sin(T * 14)) * .05 });
const sweat = (ch, T) => { const h = hp(ch); const k = (T * .8) % 1; SWEAT.visible = true; SWEAT.position.copy(h).add(V(.5, 1.3 - k * .9, .45)); SWEAT.scale.set(1, 1.4, 1); };
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
// partículas
function confetti(c, T0, T, n = 60) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = 3 + r() * 6; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function smoke(c, T, k = 1, n = 22, col = null) { SMOKE.forEach((s, i) => { if (i >= n) return; const r = RNG(i * 5 + 1), ph = (T * .55 + r()) % 1; s.visible = true; s.position.set(c.x + (r() - .5) * 1.2 + Math.sin(T + i) * ph * .8, c.y + ph * 6 * k, c.z + (r() - .5) * 1.2); s.scale.setScalar((.5 + ph * 2.2) * k); s.material.opacity = .6 * (1 - ph); if (col) s.material.color.set(col); else s.material.color.set(0x5a5a62); }); }
function sparks(c, T0, T, n = 24) { SPARK.forEach((s, i) => { if (i >= n) return; const r = RNG(i * 7 + 3), t = ((T - T0) * 1.3 + r()) % 1; s.visible = true; const a = r() * 6.283, v = 2 + r() * 3; s.position.set(c.x + Math.cos(a) * v * t, c.y + v * t * 1.3 - t * t * 4, c.z + Math.sin(a) * v * t); s.lookAt(c.x, c.y, c.z); }); }
function cashRain(c, T0, T, n = 14) { CASH.forEach((p, i) => { if (i >= n) return; const r = RNG(i * 11 + 2), t = T - T0; if (t < 0) return; p.visible = true; p.position.set(c.x + (r() - .5) * 8 + Math.sin(T * 2 + i) * .6, c.y + 10 - ((t * 3 + r() * 10) % 10), c.z + (r() - .5) * 4); p.rotation.set(T * 2 + i, T * 3 + i, T + i); }); }

// ---------- capa 2D ----------
const BAD_ = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD_.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD_.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD_.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; b.x = clamp(x, 220, W - 220); b.y = clamp(y, 200, H * .62); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num') { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText('?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText('?', 0, 0); }
  c.restore(); }
const KEY = /^(Stadt|Stadt-Videos|jeder|Frühstück|Kinderwecken|Klo|Lehrer|Brandt|Mathe|Lava|zwanzig|Minuten|LAVA|Tafel|Oma|Gerda|Mammut|Baby-Mammut|1\.499|Euro|Frage|Videos|eigentlich|Namen|Kanal|Nacht|4:44|Jonas|drei|Nächte|Wand|Laptop|qualmen|Schulboden|heiß|Sohlen|geschmolzen|echtes|bestimmen|Bild|Uhr|Rathausturm|vier|Lüftungsgitter|Turm|Ziffernblatt|Bildschirme|fünfhundert|Haus|Kamera|allein|Atmen|Plötzlich|Kameras|mir|Sirene|ich|roter|Knopf|ALLES|LÖSCHEN|draufgehauen|keine|kein|getanzt|zurückbekommen|Fernseher|neues|verschwindet|Junge|wusste|Vier|Millionen|Aufrufe|Minute|hochgeladen)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null; const COVERS = [];
// ===== utilidades de los planos =====
const city = (L, m = 'day') => { use('ST'); if (m === 'night') night(); else if (m === 'morning') morning(); else day(); };
const bigVid = (kind, o = {}) => ST.big.userData.draw(kind + JSON.stringify(o), (c, w, h) => drawVid(c, w, h, kind, o));
// gente con móvil: [personaje, x, z, ry, modo('walk'|'laugh'|'look'), vídeo]
function crowd(L, list, base = 0) { list.forEach(([c, x, z, ry, m, kind], i) => { const T = L.T + i * .37;
  if (m === 'walk') { caminar(c, L.lt + i * .5, { x, z, ry, speed: 2.4, T, extra: { aRx: 1.25, aRz: -.25, aRe: 1.6, headX: .38 } }); cara(c, T, { expr: i % 2 ? 'smile' : 'neutral', eyes: 'down' }); }
  else if (m === 'laugh') { put(c, x, 0, z, ry); actuar(c, L.lt, [[0, { ...LOOK, ...LAUGH(T) }]], { T }); laughF(c, T); }
  else { put(c, x, 0, z, ry); actuar(c, L.lt, [[0, LOOK]], { T }); cara(c, T, { expr: 'neutral', eyes: 'down', mouth: 'smile' }); }
  holdPhone(base + i, c, kind || ['lava', 'mammut', 'plain'][i % 3]); }); }
// pantallas especiales
const UI = (c, w, h, bg = '#ffffff') => { c.fillStyle = bg; c.fillRect(0, 0, w, h); };
function drawLock(c, w, h, notif = true) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1a1a4a'); g.addColorStop(1, '#4a2a6a'); c.fillStyle = g; c.fillRect(0, 0, w, h); txt(c, '4:44', w / 2, h * .2, w * .3, '#ffffff'); txt(c, 'Donnerstag, 3. Juni', w / 2, h * .3, w * .065, '#d8d8f8');
  if (notif) { c.fillStyle = 'rgba(255,255,255,.92)'; c.beginPath(); c.roundRect(w * .06, h * .4, w * .88, h * .16, 18); c.fill(); c.fillStyle = '#ff3a5a'; c.beginPath(); c.roundRect(w * .1, h * .425, w * .14, w * .14, 10); c.fill(); txt(c, '▶', w * .17, h * .425 + w * .07, w * .08, '#fff');
    c.textAlign = 'left'; c.fillStyle = '#1a1a1a'; c.font = `700 ${w * .055}px ${FONT}`; c.fillText('IN DIESER STADT', w * .28, h * .445); c.font = `700 ${w * .05}px ${FONT}`; c.fillStyle = '#4a4a5a'; c.fillText('Neues Video ist da!', w * .28, h * .5); } }
function drawNoName(c, w, h) { drawVid(c, w, h, 'mammut', { ui: false }); c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(0, h * .72, w, h * .28); c.fillStyle = '#8a8a96'; c.beginPath(); c.arc(w * .16, h * .79, w * .08, 0, 7); c.fill(); txt(c, '?', w * .16, h * .79 + 2, w * .1, '#fff');
  c.textAlign = 'left'; c.font = `700 ${w * .07}px ${FONT}`; c.fillStyle = '#fff'; c.fillText('@ ? ? ?', w * .28, h * .785); c.font = `700 ${w * .05}px ${FONT}`; c.fillStyle = '#ff8a8a'; c.fillText('Kein Name · Kein Kanal', w * .08, h * .87); }
function drawShop(c, w, h, step = 0) { UI(c, w, h, '#fff6ea'); c.fillStyle = '#ff8a23'; c.fillRect(0, 0, w, h * .14); txt(c, 'TIER-SHOP', w / 2, h * .07, h * .075, '#fff');
  c.fillStyle = '#e8f4ff'; c.fillRect(w * .06, h * .18, w * .5, h * .58); c.fillStyle = '#a07040'; c.beginPath(); c.ellipse(w * .3, h * .5, w * .16, h * .13, 0, 0, 7); c.fill(); c.beginPath(); c.arc(w * .43, h * .41, w * .08, 0, 7); c.fill(); c.fillRect(w * .46, h * .44, w * .03, h * .14); c.fillRect(w * .19, h * .58, w * .05, h * .1); c.fillRect(w * .34, h * .58, w * .05, h * .1);
  c.fillStyle = '#1a1a1a'; c.beginPath(); c.arc(w * .45, h * .39, w * .012, 0, 7); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = w * .012; c.beginPath(); c.arc(w * .44, h * .48, w * .04, 1.3, 3.4); c.stroke(); c.fillStyle = '#ff5a85'; c.beginPath(); c.arc(w * .3, h * .38, w * .03, 0, 7); c.fill();
  c.textAlign = 'left'; c.fillStyle = '#1a1a1a'; c.font = `700 ${h * .075}px ${FONT}`; c.fillText('Baby-Mammut', w * .6, h * .26); c.font = `700 ${h * .05}px ${FONT}`; c.fillStyle = '#4a4a5a'; c.fillText('flauschig · 1 Jahr', w * .6, h * .36); c.fillStyle = '#d8201a'; c.font = `700 ${h * .1}px ${FONT}`; c.fillText('1.499 €', w * .6, h * .5);
  c.fillStyle = step ? '#2ec46a' : '#ffd23f'; c.beginPath(); c.roundRect(w * .6, h * .6, w * .36, h * .14, 14); c.fill(); txt(c, step ? '✓ BESTELLT' : 'IN DEN WARENKORB', w * .78, h * .67, h * (step ? .06 : .045), '#1a1a1a'); }
function drawRefund(c, w, h) { UI(c, w, h, '#eafff0'); c.fillStyle = '#2ec46a'; c.beginPath(); c.arc(w / 2, h * .32, h * .16, 0, 7); c.fill(); txt(c, '✓', w / 2, h * .33, h * .2, '#fff'); txt(c, 'ERSTATTUNG', w / 2, h * .6, h * .08, '#1a6a3a'); txt(c, '+ 1.499 €', w / 2, h * .76, h * .13, '#1a8a4a'); }
function drawClock(c, w, h, txt_) { c.fillStyle = '#05060a'; c.fillRect(0, 0, w, h); c.shadowColor = '#ff3a2a'; c.shadowBlur = 12; txt(c, txt_, w / 2, h / 2 + 3, h * .78, '#ff3a2a'); c.shadowBlur = 0; }
function drawPause(c, w, h, k) { c.fillStyle = '#1a1c24'; c.fillRect(0, 0, w, h); c.save(); c.beginPath(); c.rect(w * .25, h * .04, w * .5, h * .7); c.clip(); c.translate(w * .25, h * .04); drawVid(c, w * .5, h * .7, ['lava', 'mammut', 'plain'][Math.floor(k * 3) % 3], { ui: false }); c.restore();
  c.fillStyle = 'rgba(255,255,255,.85)'; c.fillRect(w * .46, h * .32, w * .03, h * .14); c.fillRect(w * .51, h * .32, w * .03, h * .14);
  for (let i = 0; i < 8; i++) { c.fillStyle = i === Math.floor(k * 8) % 8 ? '#ffd23f' : '#3a3e4a'; c.fillRect(w * (.04 + i * .12), h * .8, w * .1, h * .14); c.fillStyle = ['#ff8a3a', '#8fd0ff', '#f7c6dc'][i % 3]; c.fillRect(w * (.05 + i * .12), h * .82, w * .08, h * .1); }
  c.textAlign = 'left'; c.font = `700 ${h * .06}px ${FONT}`; c.fillStyle = '#fff'; c.fillText('BILD ' + (100 + Math.floor(k * 900)) + ' / 1800', w * .78, h * .1); }
// vídeo congelado con el reloj del Rathaus marcado al fondo
function drawClue(c, w, h, kind, zoom = 0) { c.save(); const z = 1 + zoom * 2.2; c.translate(w * .78, h * .25); c.scale(z, z); c.translate(-w * .78, -h * .25); drawVid(c, w, h, kind, { ui: false });
  c.fillStyle = '#e9dcc8'; c.fillRect(w * .72, h * .1, w * .12, h * .22); c.fillStyle = '#4fb39a'; c.beginPath(); c.moveTo(w * .7, h * .1); c.lineTo(w * .78, h * .03); c.lineTo(w * .86, h * .1); c.fill(); c.fillStyle = '#fdf6e0'; c.beginPath(); c.arc(w * .78, h * .16, w * .04, 0, 7); c.fill(); c.strokeStyle = '#1d2238'; c.lineWidth = 2; c.stroke();
  c.beginPath(); c.moveTo(w * .78, h * .16); c.lineTo(w * .795, h * .15); c.moveTo(w * .78, h * .16); c.lineTo(w * .79, h * .135); c.stroke(); c.restore();
  c.strokeStyle = '#ff2a2a'; c.lineWidth = w * .015; c.beginPath(); const r = w * (.08 + zoom * .18); c.arc(w * .78 + (w * .5 - w * .78) * zoom, h * .2 + (h * .4 - h * .2) * zoom, r, 0, 7); c.stroke(); }
// editor 3D de Jonas: muñeco que atraviesa la pared + error
function drawEditor(c, w, h, k = 0, err = 0) { c.fillStyle = '#2a2e3a'; c.fillRect(0, 0, w, h); c.fillStyle = '#3a3f4e'; c.fillRect(0, 0, w, h * .1); c.fillRect(0, 0, w * .16, h); txt(c, 'MEIN 3D-VIDEO', w * .58, h * .05, h * .06, '#fff');
  c.save(); c.beginPath(); c.rect(w * .18, h * .12, w * .8, h * .84); c.clip(); c.fillStyle = '#8fd0ff'; c.fillRect(w * .18, h * .12, w * .8, h * .84); c.fillStyle = '#5cc24a'; c.fillRect(w * .18, h * .75, w * .8, h * .21);
  c.fillStyle = '#b5564a'; c.fillRect(w * .6, h * .3, w * .1, h * .46); c.strokeStyle = '#8a3a30'; c.lineWidth = 2; for (let y = h * .3; y < h * .76; y += h * .05) { c.beginPath(); c.moveTo(w * .6, y); c.lineTo(w * .7, y); c.stroke(); }
  fig(c, w * (.3 + k * .4), h * .82, h / 330, '#3fa8ff', '#1a1a1a'); c.restore();
  if (err) { c.fillStyle = 'rgba(200,20,20,.9)'; c.beginPath(); c.roundRect(w * .3, h * .35, w * .5, h * .3, 12); c.fill(); txt(c, '⚠ FEHLER', w * .55, h * .45, h * .08, '#fff'); txt(c, 'Figur in Wand!', w * .55, h * .56, h * .055, '#ffe0e0'); } }

// ===== 0–9,6 s: el gancho y «todo el mundo los ve» =====
// 1 «In dieser Stadt» — golpe de zoom: yo en el centro de la plaza; alrededor todo el mundo con el móvil (unos andan, otros se ríen); detrás la pantalla gigante
shot(0, 'C', null, L => { city(L); bigVid('lava', { prog: .2 + L.T * .1 }); put(ich, 0, 0, 6, 0); actuar(ich, L.lt, [[0, { aRx: .3, aRz: .2, aLz: .15, headX: -.05 }]], { T: L.T }); cara(ich, L.T, { expr: 'smile', mouth: 'smile' });
  crowd(L, [[K[0], -3.4, 1.5, .4, 'laugh'], [K[4], 3.6, 0.5, -.5, 'laugh'], [sie, -9, -5, 1.57, 'walk'], [K[1], 8, -9, -1.57, 'walk'], [lena, -2, -6, .2, 'look'], [K[6], 2.8, -8, -.3, 'look'], [fahrer, -6, -12, .5, 'look'], [K[2], 6, -14, -.6, 'laugh'], [er, -1, -18, 0, 'walk'], [kasse, 4, -22, PI, 'walk']]);
  cm([0, 2.6, 21.4, 0, 1.9, 6, 52], [0, 2.6, 19.2, 0, 1.9, 6, 50], L.k, easeOut); sh(V(0, 0, 0), 40); }, [[0, 'whoosh_up', .7], [.05, 'city_amb', .6], [.2, 'kids_laugh', .4], [.4, 'notif', .5]]);
// 2 «schaut jeder diese» — grúa sobre la plaza: decenas de personas mirando el móvil; la pantalla gigante encendida
shot(.78, 'W', null, L => { city(L); bigVid('mammut', { prog: .5 }); crowd(L, [[K[0], -5, 10, 0, 'look'], [K[1], 5, 12, PI, 'look'], [K[2], -10, 0, .7, 'walk'], [K[3], 10, -2, -.7, 'look'], [K[4], -3, -6, .3, 'laugh'], [K[5], 4, -8, -.2, 'look'], [K[6], -8, -16, 1.2, 'walk'], [K[7], 8, -20, -1.4, 'walk'], [sie, 0, 3, PI / 2, 'walk'], [er, -12, 16, .4, 'laugh'], [lena, 11, 18, -.5, 'look'], [kasse, -2, -24, 0, 'look'], [fahrer, 6, 22, PI, 'look'], [mayor, -6, 22, 2.6, 'laugh']]);
  cm([12, 24, 34, 0, 3, -2, 50], [8, 21, 30, 0, 4, -6, 48], L.k); sh(V(0, 0, 0), 50); }, [[0, 'murmur', .5], [.3, 'notif', .5], [.7, 'vibrate', .5]]);
// 3 «„In dieser Stadt“-Videos.» — inserto: una chica enseña su móvil a cámara con el vídeo «IN DIESER STADT…»; se ríe a carcajadas
shot(1.84, 'Z', null, L => { city(L); bigVid('lava'); put(lena, 0, 0, -46, 0); actuar(lena, L.lt, [[0, { ...SHOW, ...LAUGH(L.T), headX: -.15 }]], { T: L.T }); laughF(lena, L.T); holdShow(0, lena, 'lava', { prog: .3 + L.k * .5 });
  crowd(L, [[K[3], -6, -54, .6, 'walk'], [K[5], 5, -56, -.4, 'look']], 1); const h = hp(lena), q = wpos(PH[0]), m = h.clone().add(q).multiplyScalar(.5); cm([m.x + .5, m.y + .6, m.z + 8.4, m.x, m.y + .3, m.z, 46], [m.x + .4, m.y + .5, m.z + 7.4, m.x, m.y + .3, m.z, 44], L.k); sh(V(0, 0, -46), 20); }, [[0, 'pop', .5], [.3, 'laugh_m', .5], [1.0, 'notif', .4]]);
// 4 «Und wenn ich jeder sage,» — yo a cámara, abriendo los brazos; detrás la gente pasa mirando el móvil
shot(3.52, 'S', null, L => { city(L); bigVid('plain'); put(ich, 2, 0, 20, -.15); actuar(ich, L.lt, [[0, 'idle'], [.25, { aLx: .7, aLz: .9, aRx: .7, aRz: .9, aLe: .5, aRe: .5, headZ: .1 }, { anti: .2 }]], { T: L.T }); talk(ich, L.T, 3.52, 4.88, 'smile');
  crowd(L, [[K[0], -8, 10, 1.57, 'walk'], [K[7], 10, 6, -1.57, 'walk'], [sie, -2, 6, .3, 'look'], [er, 5, 4, -.3, 'laugh']]); cm([2.6, 3.4, 33, 2, 2.6, 18, 48], [2.4, 3.3, 30.5, 2, 2.6, 18, 46], L.k); sh(V(2, 0, 16), 30); }, [[0, 'steps', .5], [.4, 'cloth', .4], [.9, 'notif', .4]]);
// 5 «dann meine ich jeder.» — travelling lateral por una fila: el bombero, el alcalde, la cajera, el conductor… todos con el móvil
shot(4.88, 'W', null, L => { city(L); bigVid('mammut'); const row = [FW[0], mayor, kasse, fahrer, K[6], FW[1]]; row.forEach((c, i) => { put(c, -10 + i * 4, 0, 30 + (i % 2) * 1.2, 0); actuar(c, L.lt, [[0, i % 3 === 1 ? { ...LOOK, ...LAUGH(L.T + i) } : LOOK]], { T: L.T + i }); if (i % 3 === 1) laughF(c, L.T + i); else cara(c, L.T + i, { expr: 'neutral', eyes: 'down', mouth: 'smile' }); holdPhone(i, c, ['plain', 'lava', 'mammut'][i % 3]); });
  const x = lerp(-6, 6, easeInOut(L.k)); cam([x, 4.2, 54], [x, 3.0, 30], 46); sh(V(0, 0, 30), 30); }, [[0, 'notif', .5], [.4, 'laugh_deep', .4], [.9, 'vibrate', .4], [1.3, 'notif', .3]]);
// 6 «Beim Frühstück,» — cocina: familia desayunando con los ojos en el móvil; la leche se desborda del bol
shot(6.5, 'Z', null, L => { use('KU'); inside(.9); const T0 = V(KX, 0, 2); sit(sie, KX, 2.65, -3.2, 0); put(K[2], KX + 3.4, 0, -4.4, -.25); put(er, KX - 3.4, 0, -4.6, .25);
  [sie, K[2], er].forEach((c, i) => { actuar(c, L.lt, [[0, { ...(i < 1 ? SIT : {}), aRx: .85, aRz: -.25, aRe: 1.45, aLx: .7, aLe: 1.2, headX: .5 }]], { T: L.T + i }); cara(c, L.T + i, { expr: i === 1 ? 'joy' : 'neutral', eyes: 'down', mouth: i === 1 ? 'open_smile' : 'smile' }); holdPhone(i, c, ['lava', 'mammut', 'plain'][i]); });
  const pour = clamp((L.lt - .2) / .3); KU.milk.rotation.z = lerp(0, 1.6, easeOut(pour)); const h = V(KX, 5, 2); cm([KX + 1, 8.4, 13, KX, 4.6, -3.5, 50], [KX + .8, 8.2, 11.6, KX, 4.6, -3.5, 47], L.k); sh(T0, 20); }, [[0, 'spoon', .6], [.2, 'cup_rattle', .4], [.4, 'splash', .4], [.6, 'notif', .3]]);
// 7 «beim Kinderwecken,» — mamá despierta al niño con una mano… y con la otra mira el móvil; el niño también tiene el suyo
shot(7.34, 'C', null, L => { use('ZI'); inside(.9); ZI.LMP.intensity = 150; const kid = er; put(kid, ZX + 13, 3.6, -5.4, 0); kid.root.rotation.x = -PI / 2; kid.root.scale.setScalar(.75); applyPose(kid, { aRx: 2.6, aRe: .9, aLz: .2, headX: -.2 }); cara(kid, L.T, { expr: 'neutral', eyes: 'half', mouth: 'smile' }); holdPhone(1, kid, 'plain');
  put(mama, ZX + 7.4, 0, -6, PI / 2); actuar(mama, L.lt, [[0, { aLx: 1.4, aLz: -.1, aLe: .4, lean: .2, aRx: 1.25, aRz: -.25, aRe: 1.6, headX: .38 }]], { T: L.T, extra: { aLx: 1.4 + Math.sin(L.T * 14) * .15 } }); cara(mama, L.T, { expr: 'neutral', eyes: 'down', mouth: 'talk' }); holdPhone(0, mama, 'lava');
  cm([ZX + 12, 13, 5, ZX + 10.5, 3.4, -7.5, 50], [ZX + 12, 12.4, 3.6, ZX + 10.5, 3.4, -7.5, 48], L.k); sh(V(ZX + 10, 0, -6), 20); }, [[0, 'yawn_f', .4], [.2, 'blanket', .5], [.5, 'notif', .4], [.7, 'cloth', .3]]);
// 8 «sogar auf dem Klo.» — baño: un señor sentado en el váter, riéndose con el vídeo
shot(8.26, 'R', null, L => { use('BA'); inside(.9); sit(fahrer, BX, 2.62, -4.6, 0); actuar(fahrer, L.lt, [[0, { ...SIT, ...LOOK, ...LAUGH(L.T) }]], { T: L.T }); laughF(fahrer, L.T); holdPhone(0, fahrer, 'lava');
  cm([BX + 2.6, 6.4, 7, BX, 4, -4.6, 48], [BX + 2, 6.2, 5.6, BX, 4, -4.6, 46], L.k); sh(V(BX, 0, -4), 15); }, [[0, 'laugh_deep', .5], [.3, 'water_bloop', .4], [.8, 'laugh_m', .4]]);
const SIT = { crouch: .2, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aLz: .15, aRz: .15 };
function sit(ch, x, y, z, ry) { const s = ch.spec.scale || 1; put(ch, x, y - (2.05 - .2) * s + .08, z, ry); applyPose(ch, SIT); }

// ===== 9,6–21,4 s: el profesor =====
const BBtxt = (lava, k = 1) => KL.BB.userData.draw('bb' + lava + Math.round(k * 20), (c, w, h) => { c.fillStyle = '#1e3a2a'; c.fillRect(0, 0, w, h); c.globalAlpha = .9; txt(c, '2x + 3 = 11', w * .3, h * .3, 70, '#f4f4f4'); txt(c, 'x = ?', w * .3, h * .62, 70, '#f4f4f4');
  if (lava) { c.save(); c.beginPath(); c.rect(w * .5, 0, w * .5 * k, h); c.clip(); txt(c, 'LAVA', w * .75, h * .5, 170, '#ffffff'); c.restore(); } c.globalAlpha = 1; });
const students = (L, n = 6, e = 'neutral') => { [K[0], K[1], K[3], K[4], K[5], K[7]].slice(0, n).forEach((c, i) => { const d = KL.desks[i % 9]; const p = d.position; sit(c, CX + p.x, 2.55, p.z + 2.8, PI); c.root.scale.setScalar(.8); actuar(c, L.lt, [[0, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: 1.2, aRe: 1.2, headX: .05 }]], { T: L.T + i }); cara(c, L.T + i, { expr: typeof e === 'function' ? e(i) : e }); }); };
// 9 «Gestern hat mein Lehrer, Herr Brandt,» — aula: el profe Brandt delante de la pizarra; alumnos en sus pupitres
shot(9.56, 'S', null, L => { use('KL'); inside(.9); BBtxt(false); put(brandt, CX + 3, 0, -12, 0); actuar(brandt, L.lt, [[0, 'idle'], [.4, { aRx: 2.3, aRz: -.2, aRe: .6, headY: -.4 }]], { T: L.T }); cara(brandt, L.T, { expr: 'neutral' }); attach(CHALK, brandt.aR.hand, [0, -.6, .2], [0, 0, 0]);
  students(L, 6); badge3('tag', 'Herr Brandt', hp(brandt).add(V(0, 2.4, 0)), (L.lt - 1.1) * 2.5); cm([CX - 1, 8.6, 3, CX + 2.4, 5.2, -12, 46], [CX - .6, 8.4, 1, CX + 2.6, 5.2, -12, 44], L.k); sh(V(CX, 0, -4), 25); }, [[0, 'classroom', .5], [.3, 'chalk', .5], [1.2, 'pop', .5], [1.6, 'cough', .3]]);
// 10 «mitten in Mathe so ein Video geschaut:» — el profe esconde el móvil detrás del libro de mates y lo mira a escondidas
shot(11.52, 'W', null, L => { use('KL'); inside(.9); BBtxt(false); put(brandt, CX - 2.2, 0, -11.6, -.2); actuar(brandt, L.lt, [[0, { ...LOOK, aRx: .85, aRe: 1.45, headX: .5, aLx: 1.2, aLz: -.3, aLe: 1.5, lean: .1 }]], { T: L.T }); cara(brandt, L.T, { expr: 'smile', eyes: 'down', mouth: 'smile' }); holdPhone(0, brandt, 'lava'); sweat(brandt, L.T);
  students(L, 6); const q = wpos(PH[0]); cm([CX - 1.6, 7.6, -2, CX - 2.6, 5, -11.6, 46], [CX - 1.8, 7.4, -3.4, CX - 2.6, 5, -11.6, 42], L.k); sh(V(CX - 3, 0, -12), 18); }, [[0, 'pages', .5], [.4, 'notif', .4], [1.0, 'whisper', .3], [1.6, 'tick', .3]]);
// 11 «In dieser Stadt wird der Boden» — dentro del vídeo: el salón de la Oma; el suelo empieza a burbujear naranja, la gente sube a los muebles
function lavaRoom(L, k, jumpers = true) { use('OS'); inside(.9); OS.LAVA.visible = true; OS.rug.visible = k < .5; OS.LAVA.material.emissiveIntensity = .5 * k; OS.LAVA.position.y = lerp(-.1, .14, k); OS.LL.intensity = 200 * k; OS.LAVA.material.map.offset.set(L.T * .03, L.T * .02);
  OS.BUB.forEach((b, i) => { const r = RNG(i * 3 + 1), ph = (L.T * .8 + r()) % 1; b.position.set(-14 + r() * 28, .2 + Math.sin(ph * PI) * .6 * k, -10 + r() * 22); b.scale.setScalar((.4 + ph) * k); }); }
shot(13.76, 'F', null, L => { const k = clamp(L.lt / .6); lavaRoom(L, k); sit(K[3], OX + 8, 3.0, -9, 0); actuar(K[3], L.lt, [[0, { ...SIT, lLx: 1.5 + .4 * k, lRx: 1.5 + .4 * k, aLx: .6, aRx: .6, aLz: .5, aRz: .5 }]], { T: L.T }); cara(K[3], L.T, { expr: 'shock' });
  const j = saltar(K[6], L.lt, .5, { h: 3.2, dur: .55, base: [OX + 1, 0, 3], dx: 1.6 }); if (L.lt > 1.2) K[6].root.position.y = 3.0; K[6].root.visible = true; K[6].root.rotation.y = .3; cara(K[6], L.T, { expr: 'shock' });
  cm([OX - 6, 8, 18, OX + 3, 3, -2, 50], [OX - 4, 7, 15, OX + 3, 3, -2, 48], L.k); sh(V(OX, 0, 0), 25); }, [[0, 'fire_crackle', .5], [.4, 'water_bloop', .5], [.6, 'jump', .4], [1.0, 'gasp', .4]]);
// 12 «alle zwanzig Minuten zu Lava.» — la lava lo cubre todo; reloj «20 MIN»; todos sobre el sofá y la mesa
shot(15.04, 'C', null, L => { lavaRoom(L, 1); [[K[3], OX + 6, 3.6, -9.2, .1], [K[1], OX + 10, 3.6, -9.2, -.2], [K[6], OX + 2.6, 3.1, 3, .4]].forEach(([c, x, y, z, ry], i) => { put(c, x, y, z, ry); actuar(c, L.lt, [[0, i === 2 ? 'brace' : { ...shiver(L.T, 1), aLx: .5, aLz: .7, aRx: .5, aRz: .7, aLe: .8, aRe: .8 }]], { T: L.T + i }); cara(c, L.T + i, { expr: i === 1 ? 'scared' : 'shock' }); });
  badge('num', '20 MINUTEN', W / 2, H * .13, (L.lt - .1) * 2.5); cm([OX + 4, 8.5, 20, OX + 6, 3.2, -4, 50], [OX + 4.4, 8, 18, OX + 6, 3.2, -4, 48], L.k); sh(V(OX, 0, 0), 25); }, [[0, 'fire_roar', .5], [.3, 'tick', .5], [.6, 'tick', .5], [1.2, 'scream_girl', .3], [1.6, 'water_bloop', .4]]);
// 13 «Er war so abgelenkt,» — primer plano del profe: risita con el móvil, la mano escribe sola en la pizarra
shot(17.14, 'W', null, L => { use('KL'); inside(.9); BBtxt(false); put(brandt, CX + 2, 0, -13.4, .25); actuar(brandt, L.lt, [[0, { aRx: 2.9, aRz: .25, aRe: .4, aLx: 1.25, aLz: -.25, aLe: 1.6, headX: .35 }]], { T: L.T, extra: { aRz: .25 + Math.sin(L.T * 9) * .12 } }); cara(brandt, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' }); attach(CHALK, brandt.aR.hand, [0, -.6, .2], [0, 0, 0]); holdPhone(0, brandt, 'lava', {}, 0);
  onFace(brandt, 9, .4, 1.6, 44, L.k, 7.4); sh(V(CX, 0, -12), 18); }, [[0, 'chalk', .6], [.4, 'laugh_old', .4], [.8, 'chalk', .5]]);
// 14 «dass er statt der Aufgabe» — los alumnos se miran entre ellos, confusos
shot(18.32, 'Z', null, L => { use('KL'); inside(.9); BBtxt(true, clamp(L.lt / .8) * .4); students(L, 6, i => i % 2 ? 'confused' : 'worried'); K[1].root.rotation.y = PI - .5; K[4].root.rotation.y = PI + .5;
  cm([CX + 2, 11, -14, CX, 3.8, 6, 54], [CX + 1.6, 10.6, -13, CX, 3.8, 6, 50], L.k); sh(V(CX, 0, 4), 25); }, [[0, 'murmur', .4], [.3, 'chair_roll', .4], [.6, 'hmm', .4]]);
// 15 «„LAVA“ an die Tafel geschrieben hat.» — la pizarra: «LAVA» enorme con tiza; el profe sigue riéndose con el móvil
shot(19.12, 'C', null, L => { use('KL'); inside(.9); const k = clamp(.4 + L.lt / 1.0); BBtxt(true, k); put(brandt, CX + 9, 0, -12.6, -.5); actuar(brandt, L.lt, [[0, { ...LOOK, ...LAUGH(L.T) }]], { T: L.T }); laughF(brandt, L.T); holdPhone(0, brandt, 'lava');
  cm([CX + 2, 10.6, 4, CX + 3, 10.3, -15.6, 50], [CX + 2.6, 10.4, 1, CX + 3.4, 10.3, -15.6, 46], L.k); sh(V(CX, 0, -10), 25); }, [[0, 'chalk', .7], [.3, 'chalk', .6], [.8, 'kids_laugh', .4], [1.4, 'gasp', .3]]);
// ===== 21,4–31,6 s: la Oma y el mamut =====
const OMA_SIT = { ...SIT, aRx: .55, aRe: 1.0, aRz: -.2, aLx: .55, aLe: 1.0, aLz: -.2, headX: .25 };
const omaChair = () => { const a = .5; sit(oma, OX - 6 + Math.sin(a) * .3, 3.9, -3 + Math.cos(a) * .3, a); };
const tab = (ch, fn, key, r = 1, s = .7) => { attach(TAB, ch.aR.hand, [-.75, -.5, .3], [1.55, 0, 0], s); TAB.userData.draw(key, fn); return TAB; };
const omaVid = (c, w, h) => { c.fillStyle = '#10131c'; c.fillRect(0, 0, w, h); c.save(); c.translate(w * .32, 0); drawVid(c, w * .36, h, 'mammut', { prog: .6 }); c.restore(); };
const overOma = (L, t, d0 = 4.2, d1 = 3.6) => { const q = wpos(t), a = .5, f = V(Math.sin(a), 0, Math.cos(a)), d = lerp(d0, d1, easeInOut(L.k)); cam([q.x + f.x * d, q.y + 1.2, q.z + f.z * d], [q.x, q.y + .5, q.z], 42); };
// 16 «Und meine Oma Gerda?» — salón: la Oma en su sillón con la tableta, té y el gato durmiendo
shot(21.42, 'I', null, L => { use('OS'); inside(.95); omaChair(); actuar(oma, L.lt, [[0, OMA_SIT]], { T: L.T }); cara(oma, L.T, { expr: 'smile', eyes: 'down', mouth: 'smile' }); tab(oma, omaVid, 'omavid');
  badge3('tag', 'Oma Gerda', hp(oma).add(V(0, 2.2, 0)), (L.lt - .2) * 2.5); cm([OX + 1, 7.4, 9, OX - 5.6, 5, -2.6, 46], [OX, 7.2, 7.6, OX - 5.6, 5, -2.6, 44], L.k); sh(V(OX - 5, 0, -3), 18); }, [[0, 'meow', .4], [.3, 'pop', .5], [.6, 'spoon', .4]]);
// 17 «Sie hat ein Video gesehen,» — por encima del hombro: en la tableta, un vídeo de una calle llena de mamuts; la Oma suelta una risita
shot(22.54, 'W', null, L => { use('OS'); inside(.95); omaChair(); actuar(oma, L.lt, [[0, { ...OMA_SIT, ...LAUGH(L.T), headX: .3 }]], { T: L.T }); laughF(oma, L.T); const t = tab(oma, omaVid, 'omavid');
  overOma(L, t); sh(V(OX - 5, 0, -3), 18); }, [[0, 'laugh_old', .5], [.6, 'whinny', .3], [1.0, 'cup_marble', .3]]);
// mamut con jinete que saluda
function mamWalk(M, L, x, z, ry, sp, rider, i = 0, wave = true) { M.root.visible = true; const d = sp * L.lt; M.root.position.set(x + Math.sin(ry) * d, 0, z + Math.cos(ry) * d); M.root.rotation.y = ry; M.pose(L.T + i, sp > 0 ? 1 : 0, { trunkUp: Math.max(0, Math.sin(L.T * 1.5 + i)) });
  if (rider) { attach(rider.root, M.body, [0, 4.5, -1.2], [0, 0, 0], rider.spec.scale || 1); applyPose(rider, { ...SIT, lLx: 1.2, lRx: 1.2, lLk: 1.3, lRk: 1.3, ...(wave ? { ...GW(L.T + i) } : {}) }); cara(rider, L.T + i, { expr: 'joy', mouth: 'open_smile' }); } return M; }
const GW = T => ({ aRx: 2.7, aRz: .4 + Math.sin(T * 9) * .38, aRe: .5, aLz: .1 });
// 18 «in dem jeder ein Mammut hat.» — el vídeo: una calle del barrio con mamuts gigantes paseando, cada uno con su dueño saludando
shot(23.78, 'Z', null, L => { use('NB'); day(); mamWalk(MAM[0], L, NX - 1, -30, 0, 3, K[1], 0); mamWalk(MAM[1], L, NX + 5, -58, 0, 3, sie, 1); mamWalk(MAM[2], L, NX - 6, -80, 0, 3, K[7], 2);
  put(K[3], NX - 13, 0, -10, PI / 2); actuar(K[3], L.lt, [[0, 'wave']], { T: L.T }); cara(K[3], L.T, { expr: 'joy' });
  const z = MAM[0].root.position.z; cm([NX + 4, 3, z + 30, NX - 1, 9, z, 52], [NX + 3, 3.4, z + 27, NX - 1, 9.5, z, 50], L.k); sh(V(NX, 0, z - 10), 50); }, [[0, 'steps_heavy', .7], [.4, 'whinny', .4], [.8, 'steps_heavy', .6], [1.2, 'cheer', .3]]);
// 19 «Außer ihr.» — la Oma sola en su jardín, triste, mientras detrás pasa un mamut con su dueño
shot(25.42, 'C', null, L => { use('NB'); day(); put(oma, NX - 15, 0, 6, -.72); actuar(oma, L.lt, [[0, { lean: .1, headX: .25, aLz: .05, aRz: .05 }]], { T: L.T }); cara(oma, L.T, { expr: 'sad', mouth: 'frown' });
  mamWalk(MAM[0], L, NX + 3, 22, PI, 3.2, K[1], 0); cm([NX - 22, 4.6, 15, NX - 13.5, 4.2, 4, 46], [NX - 21.4, 4.6, 13.6, NX - 13.5, 4.2, 4, 44], L.k); sh(V(NX - 10, 0, 4), 30); }, [[0, 'sad_tone', .5], [.2, 'steps_heavy', .5], [.5, 'sigh', .4]]);
// 20 «Deshalb hat sie sich online» — la Oma, decidida, teclea en la tableta con un dedo
shot(26.18, 'S', null, L => { use('OS'); inside(.95); omaChair(); actuar(oma, L.lt, [[0, { ...OMA_SIT, aLx: 1.5, aLe: .9, aLz: .25 }]], { T: L.T, extra: { aLe: .9 + Math.abs(Math.sin(L.T * 12)) * .3 } }); cara(oma, L.T, { expr: 'determined', mouth: 'smirk' }); tab(oma, (c, w, h) => drawShop(c, w, h, 0), 'shop0');
  onFace(oma, 7.6, .2, -1.2, 44, L.k, 6.2); sh(V(OX - 5, 0, -3), 18); }, [[0, 'keys', .5], [.5, 'click_metal', .4], [.9, 'keys', .4]]);
// 21 «ein Baby-Mammut bestellt.» — inserto de la tableta: «Baby-Mammut» → el dedo de la Oma pulsa → «✓ BESTELLT»
shot(27.52, 'Z', null, L => { use('OS'); inside(.95); omaChair(); actuar(oma, L.lt, [[0, { ...OMA_SIT, aLx: 1.5, aLe: .9, aLz: .25 }]], { T: L.T }); cara(oma, L.T, { expr: 'joy' }); const st = L.lt > .6 ? 1 : 0; const t = tab(oma, (c, w, h) => drawShop(c, w, h, st), 'shop' + st);
  overOma(L, t, 3.4, 2.8); if (L.lt > .6) badge('tag', '✓ BESTELLT', W / 2, H * .18, (L.lt - .6) * 3); sh(V(OX - 5, 0, -3), 18); }, [[0, 'click_metal', .5], [.6, 'button', .6], [.65, 'ding_soft', .5]]);
// 22 «Für 1.499 Euro.» — la Oma paga con su tarjeta dorada: «1.499 €» enorme; monedas
shot(28.6, 'C', null, L => { use('OS'); inside(.95); omaChair(); actuar(oma, L.lt, [[0, { ...OMA_SIT, aLx: 1.6, aLe: .5, aLz: -.1 }]], { T: L.T }); cara(oma, L.T, { expr: 'smile', eyes: 'happy', mouth: 'grin' }); tab(oma, (c, w, h) => drawShop(c, w, h, 1), 'shop1'); attach(CARD, oma.aL.hand, [0, -.6, .3], [0, 0, .3], 1);
  badge('num', '1.499 €', W / 2, H * .2, (L.lt - .3) * 2.5, 1, 1.5); cashRain(V(OX - 5, 4, -2), 28.9, L.T, 10); onFace(oma, 9, .6, 2, 46, L.k, 7.6); sh(V(OX - 5, 0, -3), 18); }, [[0, 'cash_reg', .7], [.3, 'coins', .6], [.5, 'pop', .6], [1.0, 'coin_flip', .4]]);
// 23 (sigue «Euro.») — llega el paquete: de la caja salta un bebé mamut y la Oma lo abraza
shot(30.0, 'F', null, L => { use('OS'); inside(.95); put(oma, OX + 2.4, 0, 5, -.6); actuar(oma, L.lt, [[0, 'shock'], [.5, 'hug_self']], { T: L.T }); cara(oma, L.T, { expr: L.lt < .5 ? 'shock' : 'joy', mouth: L.lt < .5 ? 'o' : 'open_smile', blush: 1 });
  const k = spring(clamp((L.lt - .15) / .5)); BABY.root.visible = true; BABY.root.position.set(OX - 3.4, 0, 4); BABY.root.rotation.y = 1.0; BABY.root.scale.setScalar(.3 * Math.max(.01, k)); BABY.pose(L.T, 0, { trunkUp: 1 });
  confetti(V(OX - 3, 1, 4), 30.15, L.T, 40); cm([OX + 1, 6, 22, OX - .6, 3.6, 4, 48], [OX + .8, 5.8, 20, OX - .6, 3.6, 4, 46], L.k); sh(V(OX, 0, 4), 18); }, [[0, 'door_bell', .5], [.15, 'pop', .7], [.2, 'confetti', .5], [.5, 'whinny', .4], [.9, 'aah', .4]]);

// ===== 31,6–41,1 s: la pregunta =====
// 24 «Aber eine Frage stellt sich jeder:» — la plaza: la gente baja el móvil y se rasca la cabeza; signos de interrogación
shot(31.61, 'W', null, L => { city(L); bigVid('plain'); [[K[0], -4, 8, .3], [K[5], 4, 6, -.3], [mayor, 0, -2, 0], [kasse, -8, -4, .5], [FW[0], 8, -6, -.5]].forEach(([c, x, z, ry], i) => { put(c, x, 0, z, ry); actuar(c, L.lt, [[0, LOOK], [.3 + i * .12, 'think']], { T: L.T + i }); cara(c, L.T + i, { expr: 'confused' }); holdPhone(i, c, 'plain'); if (i < 3) badge3('q', '', hp(c).add(V(0, 2.4, 0)), (L.lt - .4 - i * .15) * 3, .8); });
  cm([1, 5, 24, 0, 4, 2, 48], [1, 5, 21, 0, 4, 2, 46], L.k); sh(V(0, 0, 2), 30); }, [[0, 'murmur', .5], [.4, 'hmm', .5], [.8, 'pop', .4], [1.2, 'hmm', .4]]);
// 25 «Wer macht diese Videos eigentlich?» — zoom lento a la pantalla gigante: un «?» enorme; la multitud mira arriba
shot(33.55, 'Z', 'slow', L => { city(L); ST.big.userData.draw('q', (c, w, h) => { drawVid(c, w, h, 'plain', { ui: false }); c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(0, 0, w, h); txt(c, '?', w / 2, h * .48, w * .8, '#ffd23f', '#1a1a1a', 20); txt(c, 'WER MACHT DAS?', w / 2, h * .85, w * .1, '#fff', '#000', 8); });
  [K[1], K[2], sie, er, lena].forEach((c, i) => { put(c, -4 + i * 2.4, 0, -50 + (i % 2) * 2, PI); actuar(c, L.lt, [[0, { headX: -.5, aLz: .1, aRz: .1 }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'worried' }); });
  cm([10, 3, -36, 0, 30, -64, 58], [6, 5, -44, 0, 33, -64, 50], L.k, easeIn); sh(V(0, 0, -40), 30); }, [[0, 'murmur', .4], [.6, 'hum_low', .4]]);
// 26 «Es gibt keinen Namen, keinen Kanal.» — un chico enseña el móvil: el vídeo no tiene nombre ni canal («@ ? ? ?»)
shot(35.43, 'C', null, L => { city(L); bigVid('plain'); put(K[3], 4, 0, 8, -.2); actuar(K[3], L.lt, [[0, { ...SHOW, headX: .1 }], [1.2, { ...SHOW, ...GEST_SHRUG_L }]], { T: L.T }); cara(K[3], L.T, { expr: 'confused', mouth: 'grimace' }); holdShow(0, K[3], ptex('noname', drawNoName));
  const h = hp(K[3]); cm([h.x + .6, h.y + .2, h.z + 9, h.x + .3, h.y - .9, h.z, 46], [h.x + .5, h.y + .1, h.z + 8, h.x + .3, h.y - .9, h.z, 44], L.k); sh(V(4, 0, 8), 20); }, [[0, 'click_metal', .5], [.6, 'sad_tone', .3], [1.3, 'hmm', .4]]);
const GEST_SHRUG_L = { aLx: .45, aLz: .65, aLe: 1.5, headZ: .2 };
// 27 «Sie erscheinen einfach,» — de noche: la ciudad dormida; la pantalla gigante se enciende sola con un vídeo nuevo; ventanas que se iluminan
shot(37.61, 'F', null, L => { city(L, 'night'); const on = L.lt > .5; if (on) bigVid('lava', { prog: .05 }); else ST.big.userData.draw('off', (c, w, h) => { c.fillStyle = '#05060a'; c.fillRect(0, 0, w, h); });
  winLights(on ? 1 : .4); cm([0, 6, 10, 0, 30, -64, 56], [0, 6.5, 6, 0, 31, -64, 54], L.k); sh(V(0, 0, -40), 50); }, [[0, 'crickets', .5], [.5, 'power_on', .6], [.55, 'tv_static', .3], [1.1, 'notif', .4]]);
// 28 «jede Nacht um 4:44 Uhr.» — mesilla a oscuras: el móvil se enciende: 4:44, «Neues Video ist da!»
shot(39.37, 'Z', null, L => { use('ZI'); inside(.25, 10); ZI.LMP.intensity = 0; ZI.BLUE.intensity = 30; ZI.clk.userData.draw('444', (c, w, h) => drawClock(c, w, h, '4:44')); const p = show(PH[0], ZX + 6.8, 3.02, -10.6); p.rotation.set(-PI / 2, 0, -.3); p.userData.set(ptex('lock', (c, w, h) => drawLock(c, w, h, L.lt > .3)));
  put(ich, ZX + 13, 3.5, -5.6, 0); ich.root.rotation.x = -PI / 2; applyPose(ich, { aLz: .3, aRz: .3 }); cara(ich, L.T, { eyes: 'closed', mouth: 'flat', noBlink: true });
  badge('num', '4:44', W / 2, H * .16, (L.lt - .4) * 2.5, 1, 1.3); cm([ZX + 8, 8.4, -4.6, ZX + 6.4, 3.2, -10.8, 46], [ZX + 7.6, 7.6, -6, ZX + 6.4, 3.2, -10.8, 40], L.k); sh(V(ZX + 8, 0, -8), 15); }, [[0, 'clock_tick', .5], [.3, 'vibrate', .7], [.35, 'notif', .6], [1.0, 'snore', .3]]);
// ===== 41,1–48,8 s: Jonas =====
const jonasDesk = (L, pose = {}) => { sit(jonas, JX - 6, 3.25, -6.4, PI); actuar(jonas, L.lt, [[0, { ...SIT, aLx: 1.3, aRx: 1.3, aLe: .7, aRe: .7, headX: .1, ...pose }]], { T: L.T }); };
// 29 «Mein bester Freund Jonas» — Jonas, mullet rubio y chándal turquesa, se gira en su silla y saluda; tag «Jonas»
shot(41.11, 'S', null, L => { use('JZ'); inside(.8); JZ.lapS.userData.draw('ed0', (c, w, h) => drawEditor(c, w, h, 0)); put(jonas, JX - 5, 0, -4, .5); actuar(jonas, L.lt, [[0, 'idle'], [.2, 'wave']], { T: L.T }); cara(jonas, L.T, { expr: 'joy', mouth: 'grin' });
  badge3('tag', 'Jonas', hp(jonas).add(V(0, 2.4, 0)), (L.lt - .4) * 2.5); onFace(jonas, 11, .4, 0, 46, L.k, 9.4); sh(V(JX - 5, 0, -4), 18); }, [[0, 'chair_roll', .5], [.4, 'pop', .5], [.7, 'whistle', .3]]);
// 30 «hat drei Nächte lang versucht, selbst eins zu machen.» — de noche frente al portátil: ojeras, latas vacías; «3 NÄCHTE»
shot(42.29, 'W', null, L => { use('JZ'); inside(.35, 20); JZ.LMP.intensity = 0; JZ.BLUE.intensity = 0; JZ.lapS.userData.draw('ed1', (c, w, h) => drawEditor(c, w, h, .2)); jonasDesk(L, { headX: .2, lean: .15 }); cara(jonas, L.T, { expr: 'tired', mouth: 'flat', bags: 1 });
  FILL.intensity = 25; badge('num', '3 NÄCHTE', W / 2, H * .15, (L.lt - .2) * 2.5); onFace(jonas, 4.4, .3, 2.6, 48, L.k, 3.9); sh(V(JX - 6, 0, -8), 15); }, [[0, 'keys', .5], [.5, 'yawn_m', .4], [1.1, 'clock_tick', .4], [1.6, 'keys', .4], [2.0, 'click_metal', .3]]);
// 31 «Seine Figur ist durch eine Wand gelaufen,» — por encima del hombro: en la pantalla el muñeco atraviesa la pared → «FEHLER»; Jonas se lleva la mano a la cara
shot(44.63, 'C', null, L => { use('JZ'); inside(.5, 30); const k = clamp(L.lt / 1.2); JZ.lapS.userData.draw('ed2' + Math.round(k * 12), (c, w, h) => drawEditor(c, w, h, k * .85, k > .8)); jonasDesk(L, L.lt > 1.1 ? GEST.facepalm : {}); cara(jonas, L.T, { expr: L.lt > 1.1 ? 'sad' : 'shock' });
  cm([JX - 3.6, 8.4, -2.6, JX - 6, 6.2, -11.6, 44], [JX - 4.2, 8, -4.2, JX - 6, 6.2, -11.6, 40], L.k); sh(V(JX - 6, 0, -8), 15); }, [[0, 'steps', .3], [.9, 'glitch', .6], [1.0, 'alarm_soft', .4], [1.4, 'slap', .4]]);
// 32 «und dann hat sein Laptop angefangen zu qualmen.» — el portátil echa humo y chispas; Jonas salta hacia atrás tosiendo
shot(46.55, 'R', null, L => { use('JZ'); inside(.5, 30); JZ.lapS.userData.draw('err', (c, w, h) => { c.fillStyle = '#1a0505'; c.fillRect(0, 0, w, h); txt(c, '⚠', w / 2, h * .4, h * .4, '#ff3a2a'); txt(c, 'SYSTEM ÜBERHITZT', w / 2, h * .8, h * .1, '#ff8a6a'); });
  const lp = V(JX - 6, 5.6, -11.2); smoke(lp, L.T, 1.1); sparks(lp, 46.6, L.T); put(jonas, JX - 5, 0, -2.6, .4); actuar(jonas, L.lt, [[0, 'recoil', { anti: .2 }], [.8, { ...GEST.cower, crouch: .3 }]], { T: L.T }); cara(jonas, L.T, { expr: 'shock', mouth: 'scream' });
  cm([JX - 1, 6, 8, JX - 5, 3.6, -4, 50], [JX - 1.2, 5.8, 7, JX - 5, 3.6, -4, 48], L.k); sh(V(JX - 6, 0, -8), 15); }, [[0, 'sparks', .7], [.2, 'fire_crackle', .5], [.4, 'cough', .6], [.9, 'glass_crack', .3], [1.5, 'cough', .5]]);
// 33 «Doch dann ist mir etwas aufgefallen.» — zoom lento a mi cara: me doy cuenta de algo (la pantalla gigante detrás)
shot(48.76, 'Z', 'slow', L => { city(L); bigVid('mammut'); put(ich, 0, 0, -36, 0); actuar(ich, L.lt, [[0, 'idle'], [.4, { headX: -.1, aRx: 1.9, aRz: -.4, aRe: 2.2, headZ: .1 }]], { T: L.T }); cara(ich, L.T, { expr: L.lt > .6 ? 'shock' : 'confused' });
  onFace(ich, 9, .2, .4, 44, L.k, 5.2); sh(V(0, 0, -36), 20); }, [[0, 'heartbeat', .5]]);
// ===== 50,5–60,6 s: los vídeos se cumplen =====
const hop = (c, L, x, z, ry, ph = 0, h = 1.6) => { const t = (L.lt + ph) % .9; c.root.visible = true; c.root.rotation.set(0, ry, 0); saltar(c, t, 0, { h, dur: .45, base: [x, 0, z] }); };
function steam(L, n = 40) { FL.STEAM.forEach((s, i) => { if (i >= n) return; const r = RNG(i * 7 + 2), ph = (L.T * .5 + r()) % 1; s.visible = true; s.position.set(-8 + r() * 16, ph * 6, -40 + r() * 50); s.scale.setScalar(.6 + ph * 2); s.material.opacity = .4 * (1 - ph); }); }
// 34 «Am nächsten Morgen war der Schulboden so heiß,» — pasillo del colegio: el suelo al rojo, vapor; los alumnos dan saltitos
shot(50.53, 'F', null, L => { use('FL'); inside(.9); FL.hot.emissiveIntensity = .55 + Math.sin(L.T * 3) * .1; steam(L); hop(ich, L, FX, -8, 0, 0, 1.4); cara(ich, L.T, { expr: 'shock', mouth: 'scream' });
  hop(K[0], L, FX - 5, -16, .3, .3, 1.8); cara(K[0], L.T, { expr: 'scared' }); hop(K[5], L, FX + 5, -20, -.3, .6, 1.5); cara(K[5], L.T, { expr: 'shock' }); hop(er, L, FX - 2, -28, .1, .15, 1.6); cara(er, L.T, { expr: 'scared' });
  cm([FX + 1.5, 5.4, 9, FX, 3.4, -12, 50], [FX + 1.2, 5, 6.5, FX, 3.4, -12, 48], L.k); sh(V(FX, 0, -12), 30); }, [[0, 'pan_sizzle', .6], [.3, 'jump_small', .5], [.7, 'steam', .5], [1.2, 'jump_small', .5], [1.8, 'gasp', .4]]);
// 35 «dass meine Sohlen geschmolzen sind.» — mis zapatillas: la suela gotea derretida y echa humo
shot(52.95, 'C', null, L => { use('FL'); inside(.9); FL.hot.emissiveIntensity = .6; steam(L, 20); put(ich, FX, .15, -8, .2); actuar(ich, L.lt, [[0, { lLx: .2, lRx: -.1, aLz: .5, aRz: .5, aLe: .6, aRe: .6, headX: .4, ...shiver(L.T, 1.4) }]], { T: L.T }); cara(ich, L.T, { expr: 'shock', mouth: 'scream' });
  const f = V(FX, .2, -8); DRIP.forEach((d, i) => { const r = RNG(i * 5 + 1), ph = (L.T * 1.2 + r()) % 1; d.visible = true; d.position.set(f.x + (i % 2 ? .55 : -.55) + (r() - .5) * .6, .25 - ph * .25, f.z + .2 + (r() - .5) * .9); d.scale.set(1, 1 + ph * 2, 1); }); smoke(V(FX, .2, -7.6), L.T, .35, 14, 0x8a8a92);
  cm([FX + 2.8, .7, -4.4, FX, .25, -8, 50], [FX + 2.4, .7, -5, FX, .3, -8, 46], L.k); sh(V(FX, 0, -8), 12); }, [[0, 'pan_sizzle', .7], [.4, 'drip', .5], [.8, 'steam', .5], [1.2, 'drip', .4]]);
// 36 «Und vor Omas Haus stand ein echtes Mammut.» — zoom lento: delante de la casa de la Oma, un mamut gigante de verdad; la Oma en la puerta con la boca abierta
shot(54.63, 'W', 'slow', L => { use('NB'); morning(); const M = MAM[0]; M.root.visible = true; M.root.position.set(NX - 2, 0, 3); M.root.rotation.y = .9; M.pose(L.T, 0, { trunkUp: 1, headY: -.3 });
  put(oma, NX - 18.6, 0, 9, PI / 2 + .3); actuar(oma, L.lt, [[0, 'shock']], { T: L.T }); cara(oma, L.T, { expr: 'shock', mouth: 'o' }); attach(BOWLS[0], oma.aR.hand, [0, -.7, .3], [0, 0, 0], .5);
  cm([NX + 5, 5, 40, NX - 7, 8, 3, 54], [NX + 3, 5.4, 30, NX - 7, 8, 3, 50], L.k, easeIn); sh(V(NX - 10, 0, 4), 40); }, [[0, 'birds', .4], [.3, 'steps_heavy', .6], [1.2, 'growl', .4]]);
// 37 «Die Videos zeigen nicht, was passiert.» — yo en la plaza, enseño el móvil con el vídeo del mamut, muy preocupado
shot(57.29, 'Z', null, L => { city(L, 'morning'); bigVid('mammut'); put(ich, -2, 0, 12, .15); actuar(ich, L.lt, [[0, SHOW]], { T: L.T }); talk(ich, L.T, 57.29, 59.52, 'worried'); holdShow(0, ich, 'mammut', { prog: .7 });
  const h = hp(ich), q = wpos(PH[0]), m = h.clone().add(q).multiplyScalar(.5); cm([m.x + 1, m.y + .8, m.z + 9, m.x, m.y + .3, m.z, 46], [m.x + .8, m.y + .7, m.z + 8, m.x, m.y + .3, m.z, 44], L.k); sh(V(-2, 0, 12), 20); }, [[0, 'click_metal', .4], [.5, 'heartbeat', .5], [1.4, 'notif', .3]]);
// 38 «Sie bestimmen es.» — golpe de zoom a la pantalla gigante, que se tiñe de rojo
shot(59.52, 'C', null, L => { city(L, 'morning'); ST.big.userData.draw('red', (c, w, h) => { drawVid(c, w, h, 'lava', { ui: false }); c.fillStyle = 'rgba(200,0,20,.45)'; c.fillRect(0, 0, w, h); txt(c, 'IN DIESER STADT…', w / 2, h * .12, w * .09, '#fff', '#000', 8); }); TINT = 'rgba(160,0,20,.12)';
  const k = easeOut(clamp(L.lt / .25)); cam([0, lerp(4, 8, k), lerp(-20, -34, k)], [0, 32, -64], lerp(60, 48, k)); sh(V(0, 0, -50), 30); }, [[0, 'impact', .8], [.05, 'boom', .5], [.5, 'hum_low', .4]]);

// ===== 60,6–68,3 s: la pista =====
const meDesk = (L, pose = {}) => { sit(ich, ZX - 6, 3.25, -6.4, PI); actuar(ich, L.lt, [[0, { ...SIT, aLx: 1.3, aRx: 1.3, aLe: .7, aRe: .7, headX: .1, ...pose }]], { T: L.T }); };
const lapIns = (L, d0 = 3.2, d1 = 2.6) => { const q = wpos(ZI.lapS), d = lerp(d0, d1, easeInOut(L.k)); cam([q.x + .3, q.y + .5, q.z + d], [q.x, q.y, q.z], 44); };
// 39 «Also habe ich jedes Video» — en mi escritorio, decidido, con el portátil
shot(60.6, 'S', null, L => { use('ZI'); inside(.8); ZI.lapS.userData.draw('p' + Math.round(L.k * 6), (c, w, h) => drawPause(c, w, h, L.k * .3)); meDesk(L, { headX: .15 }); cara(ich, L.T, { expr: 'determined' });
  onFace(ich, 6, .4, 3, 50, L.k, 5.4); sh(V(ZX - 6, 0, -8), 15); }, [[0, 'keys', .5], [.6, 'click_metal', .4], [1.0, 'keys', .4]]);
// 40 «Bild für Bild angehalten.» — la pantalla: pausa, fotograma a fotograma
shot(62.0, 'Z', null, L => { use('ZI'); inside(.8); const k = L.k; ZI.lapS.userData.draw('p2' + Math.round(k * 10), (c, w, h) => drawPause(c, w, h, .3 + k * .6)); meDesk(L); lapIns(L); sh(V(ZX - 6, 0, -8), 15); }, [[0, 'click_metal', .5], [.4, 'click_metal', .5], [.8, 'click_metal', .5], [1.2, 'click_metal', .5], [1.6, 'click_metal', .4]]);
// 41 «Und in jedem einzelnen sieht man im Hintergrund» — vídeo tras vídeo, siempre un círculo rojo en el mismo sitio del fondo
shot(63.77, 'C', null, L => { use('ZI'); inside(.8); const kind = ['lava', 'mammut', 'plain'][Math.floor(L.lt / .7) % 3]; ZI.lapS.userData.draw('clue' + kind, (c, w, h) => { c.fillStyle = '#1a1c24'; c.fillRect(0, 0, w, h); c.save(); c.translate(w * .3, 0); drawClue(c, w * .4, h, kind, 0); c.restore(); }); meDesk(L); lapIns(L, 3, 2.7); sh(V(ZX - 6, 0, -8), 15); }, [[0, 'pop', .5], [.7, 'pop', .5], [1.4, 'pop', .5], [1.8, 'hmm', .4]]);
// 42 «dieselbe Uhr:» — zoom lento dentro del vídeo hasta el reloj de la torre
shot(65.91, 'Z', 'slow', L => { use('ZI'); inside(.8); const z = easeIn(L.k); ZI.lapS.userData.draw('cz' + Math.round(z * 20), (c, w, h) => { c.fillStyle = '#1a1c24'; c.fillRect(0, 0, w, h); c.save(); c.translate(w * .3, 0); drawClue(c, w * .4, h, 'mammut', z); c.restore(); }); meDesk(L); lapIns(L, 2.6, 2.2); sh(V(ZX - 6, 0, -8), 15); }, [[0, 'clock_tick', .5], [.5, 'clock_tick', .5]]);
// 43 «die vom Rathausturm.» — grúa hacia arriba: la torre del reloj del Rathaus al final de la plaza
shot(67.02, 'F', null, L => { city(L); bigVid('plain'); cm([6, 4, -150, 0, 34, -226, 52], [3, 26, -170, 0, 52, -226, 46], L.k); sh(V(0, 0, -200), 60); }, [[0, 'bell_far', .6], [.4, 'birds', .4], [.9, 'clock_tick', .4]]);

// ===== 68,3–85,2 s: la torre por dentro =====
// 44 «Um vier Uhr nachts» — de noche, me acerco a escondidas a la torre (capucha), con la linterna del móvil
shot(68.3, 'W', null, L => { city(L, 'night'); bigVid('plain'); const p = caminar(ich, L.lt, { x: 4, z: -196, ry: PI, speed: 3, T: L.T, extra: { ...GEST.sneak, crouch: .3 } }); cara(ich, L.T, { expr: 'scared', eyes: 'side_l' });
  badge('num', '4:00 UHR', W / 2, H * .14, (L.lt - .1) * 2.5); cm([p.x + 5, 4.4, p.z + 10, p.x, 4, p.z - 8, 54], [p.x + 4.4, 4.2, p.z + 9, p.x, 4.4, p.z - 8, 52], L.k); sh(V(p.x, 0, p.z), 30); }, [[0, 'crickets', .5], [.2, 'steps', .4], [.5, 'owl', .4], [.7, 'steps', .3]]);
// 45 «bin ich durchs Lüftungsgitter» — arranco la rejilla de ventilación de la fachada
shot(69.18, 'C', null, L => { city(L, 'night'); const k = easeIn(clamp((L.lt - .3) / .6)); ST.GRILL.position.set(2.2 + k * .4, 2.4 - k * 2.1, .5 + k * 1.6); ST.GRILL.rotation.set(-k * 1.4, 0, k * .3);
  put(ich, 4, 0, -219.4, PI); actuar(ich, L.lt, [[0, { ...GEST.sneak, aLx: 1.4, aRx: 1.4, aLe: .5, aRe: .5 }], [.3, { crouch: .35, lean: -.15, aLx: .8, aRx: .8, aLe: .9, aRe: .9, lLx: .3, lLk: .4 }]], { T: L.T }); cara(ich, L.T, { expr: 'determined' });
  cm([12, 3.8, -213, 4, 2.6, -221.5, 50], [11, 3.6, -214, 4, 2.6, -221.5, 48], L.k); sh(V(4, 0, -220), 15); }, [[0, 'metal_creak', .6], [.5, 'metal_rip', .5], [.9, 'metal_hit', .5]]);
// 46 «in den Turm geklettert.» — dentro del conducto: gateo hacia la luz
shot(70.3, 'R', null, L => { use('SC'); inside(.4, 25); const z = 2 - L.lt * 2.2; put(ich, SX, 1.0, z, PI); ich.root.rotation.set(-1.2, PI, 0); const s = Math.sin(L.T * 7);
  applyPose(ich, { aLx: 1.4 + s * .4, aRx: 1.4 - s * .4, aLe: .3, aRe: .3, lLx: -.2, lRx: -.2, lLk: 1.4 + s * .3, lRk: 1.4 - s * .3, headX: -.9 }); cara(ich, L.T, { expr: 'determined' });
  cam([SX + .8, 3.4, z - 7.5], [SX, 2.2, z], 56); sh(V(SX, 0, z), 12); }, [[0, 'crawl', .6], [.5, 'metal_creak', .4], [.9, 'crawl', .5]]);
// 47 «Hinter dem Ziffernblatt:» — detrás de la esfera del reloj: mi silueta contra los números al revés; engranajes girando
shot(71.48, 'I', null, L => { use('HU'); inside(.35, 0); HU.GEARS.forEach((g, i) => g.rotation.z = L.T * (i % 2 ? .6 : -.8)); HU.dust.forEach((d, i) => { const r = RNG(i * 3 + 1); d.position.set(-6 + r() * 12, 4 + ((r() * 14 + L.T * .3) % 14), -4 + r() * 6); });
  put(ich, UX + .5, 0, -2, PI + .1); actuar(ich, L.lt, [[0, { headX: -.25, aLz: .15, aRz: .15 }]], { T: L.T }); cara(ich, L.T, { expr: 'shock' });
  cm([UX + 2.4, 3, 11, UX, 6, -6, 56], [UX + 2, 3.2, 9.6, UX, 6.4, -6, 54], L.k); sh(V(UX, 0, -3), 15); }, [[0, 'gears', .6], [.4, 'clock_tick', .5], [.8, 'clock_tick', .4]]);
// 48 «ein Raum voller Bildschirme.» — zoom lento hacia atrás: la sala circular con cientos de pantallas; yo diminuto en el centro
shot(72.48, 'F', 'slow', L => { use('TR'); inside(.5, 0); put(ich, TX, 0, -12, .2); actuar(ich, L.lt, [[0, { headX: -.3, headY: .4, aLz: .3, aRz: .3, aLe: .4, aRe: .4 }]], { T: L.T }); cara(ich, L.T, { expr: 'shock', mouth: 'o' }); camPose(L, 0);
  cm([TX + 6, 6, -17, TX + 9, 8, 4, 50], [TX + 8, 12, -22, TX + 10, 12, 8, 70], L.k, easeIn); sh(V(TX, 0, 0), 30); }, [[0, 'machine_hum', .5], [.3, 'hum_low', .4]]);
function camPose(L, look = 0, tgt = null) { const C = TR.CAM; C.arm1.rotation.x = .25 + Math.sin(L.T * .7) * .05; C.arm2.rotation.x = .55; C.head.rotation.x = .35; C.yaw.rotation.y = Math.sin(L.T * .4) * .3; C.rec.material.emissiveIntensity = Math.sin(L.T * 6) > 0 ? 2 : .2; }
// 49 «Über fünfhundert.» — panorámica por la pared de pantallas; «500+»
shot(74.36, 'W', null, L => { use('TR'); inside(.5, 0); camPose(L); const a = lerp(-.4, .5, easeInOut(L.k)); cam([TX + Math.sin(a) * 6, 14, Math.cos(a) * 6], [TX + Math.sin(a) * 24, 16, Math.cos(a) * 24], 56); badge('num', 'ÜBER 500', W / 2, H * .45, (L.lt - .1) * 2.5, 1, 1.4); sh(V(TX, 0, 0), 30); }, [[0, 'tv_static', .4], [.2, 'pop', .6], [.8, 'machine_hum', .4]]);
// 50 «Auf jedem ein Haus aus unserer Stadt.» — de cerca: casas en las pantallas (la de la Oma con el mamut); yo señalo
shot(75.74, 'C', null, L => { use('TR'); inside(.5, 20); camPose(L); const a = .8; put(ich, TX + Math.sin(a) * 15, 0, Math.cos(a) * 15, a + .2); actuar(ich, L.lt, [[0, 'idle'], [.3, { ...GEST.point, aRx: 2.0 }]], { T: L.T, extra: { headY: -.2, headX: -.3 } }); cara(ich, L.T, { expr: 'shock' });
  const p = V(TX + Math.sin(a) * 15, 0, Math.cos(a) * 15); cm([p.x - 7, 6.4, p.z - 2, p.x + 5, 10, p.z + 5, 52], [p.x - 6, 6.6, p.z - 1.4, p.x + 5, 10.4, p.z + 5, 50], L.k); sh(p, 20); }, [[0, 'tv_static', .4], [.4, 'gasp', .5], [1.2, 'pop', .3]]);
// 51 «Und in der Mitte eine riesige Kamera,» — tilt hacia arriba por la cámara gigante en su brazo robótico; el piloto REC parpadea
shot(77.9, 'S', null, L => { use('TR'); inside(.5, 10); camPose(L); put(ich, TX + 3, 0, -10, -.3); actuar(ich, L.lt, [[0, { headX: -.6, lean: -.1, aLz: .2, aRz: .2 }]], { T: L.T }); cara(ich, L.T, { expr: 'scared' });
  cm([TX + 6, 2, -22, TX + 2, 6, -6, 60], [TX + 6, 3, -22, TX + 1, 19, 0, 56], L.k); sh(V(TX, 0, -4), 30); }, [[0, 'machine_hum', .6], [.4, 'metal_creak', .5], [1.2, 'click_set', .4], [1.8, 'hum_low', .3]]);
// 52 «die ganz von allein das nächste Video geschnitten hat:» — la mesa de montaje: los deslizadores se mueven solos; en la previsualización avanza el vídeo; no hay nadie
const preVid = (L, k) => TR.PRE.userData.draw('pre' + Math.round(k * 30), (c, w, h) => { c.fillStyle = '#10131c'; c.fillRect(0, 0, w, h); c.save(); c.translate(w * .34, 0); drawVid(c, w * .32, h * .78, 'atmen', { prog: k }); c.restore(); c.fillStyle = '#2a2e3a'; c.fillRect(0, h * .8, w, h * .2);
  for (let i = 0; i < 9; i++) { c.fillStyle = ['#3fa8ff', '#ff8a3a', '#2ec46a'][i % 3]; c.fillRect(i * w / 9 + 2, h * .84, w / 9 - 4, h * .06); } c.fillStyle = '#ff2a2a'; c.fillRect(k * w, h * .8, 4, h * .2); txt(c, 'AUTO-SCHNITT…', w * .16, h * .1, h * .06, '#ffd23f'); });
shot(80.14, 'Z', null, L => { use('TR'); inside(.5, 20); camPose(L); preVid(L, L.k); TR.slider.forEach((s, i) => s.position.x = -3 + i * 1.2 + Math.sin(L.T * 3 + i) * .3);
  put(ich, TX - 3, 0, -2, -.9); actuar(ich, L.lt, [[0, { headX: .1, aLx: .4, aRx: .4 }]], { T: L.T }); cara(ich, L.T, { expr: 'confused' });
  const q = wpos(TR.PRE), f = V(Math.sin(.9), 0, Math.cos(.9)); cm([q.x + f.x * 9 + 2, q.y + 1, q.z + f.z * 9, q.x, q.y - 2.4, q.z, 50], [q.x + f.x * 7.6 + 1.6, q.y + .8, q.z + f.z * 7.6, q.x, q.y - 2.2, q.z, 48], L.k); sh(q, 20); }, [[0, 'keys', .5], [.5, 'click_metal', .4], [1.0, 'tape', .4], [1.6, 'keys', .4], [2.2, 'click_metal', .3]]);
// 53 «In dieser Stadt zahlt jeder fürs Atmen.» — la previsualización de cerca: el próximo vídeo; me tapo la boca aguantando la respiración
shot(82.8, 'C', null, L => { use('TR'); inside(.5, 20); camPose(L); preVid(L, .3 + L.k * .6); put(ich, TX - 3, 0, -2, -.9); actuar(ich, L.lt, [[0, { ...GEST.hands_face, aRx: 1.9, aLx: 1.9 }]], { T: L.T }); cara(ich, L.T, { expr: 'shock', blush: 1 });
  const q = wpos(TR.PRE), f = V(Math.sin(.9), 0, Math.cos(.9)); cm([q.x + f.x * 4.6, q.y + .2, q.z + f.z * 4.6, q.x, q.y, q.z, 48], [q.x + f.x * 4, q.y + .1, q.z + f.z * 4, q.x, q.y, q.z, 46], L.k); sh(q, 20); }, [[0, 'gasp', .5], [.5, 'coins', .5], [1.0, 'breath', .5], [1.7, 'cash_reg', .4]]);
// ===== 85,2–97,1 s: me descubren y el botón =====
const _q = new THREE.Quaternion();
function camsTurn(k, tgt) { TR.CAMS.forEach((c, i) => { const kk = clamp(k * 1.4 - i * .04); c.hd.quaternion.identity(); c.hd.lookAt(tgt); _q.copy(c.hd.quaternion); c.hd.quaternion.identity().slerp(_q, easeInOut(kk)); }); }
const meMid = (L, pose, expr = 'scared') => { put(ich, TX, 0, -8, .1); actuar(ich, L.lt, [[0, pose]], { T: L.T }); cara(ich, L.T, { expr }); };
const siren = (L, on = 1) => { TR.SL.intensity = on * (220 + Math.sin(L.T * 12) * 120); TR.BEAM.visible = on > 0; TR.BEAM.rotation.y = L.T * 5; TR.dome.material.emissiveIntensity = on ? 2.5 : .3; TR.L.intensity = on ? 50 : 140; };
// 54 «Plötzlich drehten sich alle Kameras zu mir.» — todas las cámaras de las paredes y la gigante giran hacia mí; pilotos rojos
shot(85.18, 'C', null, L => { use('TR'); inside(.5, 10); camPose(L); const k = clamp((L.lt - .2) / .9); meMid(L, { ...GEST.recoil, headX: -.3 }, 'shock'); const h = hp(ich); camsTurn(k, h); TR.CAM.yaw.rotation.y = lerp(0, PI, easeInOut(k)); TR.CAM.head.rotation.x = lerp(.35, .7, k);
  cm([TX + 8, 5, -16, TX, 18, 4, 64], [TX + 7, 5, -15, TX, 17, 4, 62], L.k); sh(V(TX, 0, -4), 30); }, [[0, 'impact', .6], [.2, 'machine_shake', .5], [.4, 'ratchet', .5], [.8, 'click_set', .5], [1.4, 'ratchet', .4], [2.0, 'click_set', .3]]);
// 55 «Eine Sirene ging los,» — sirena roja girando en el techo; todo se tiñe de rojo
shot(87.74, 'R', null, L => { use('TR'); inside(.4, 0); camPose(L); siren(L); camsTurn(1, hp(ich)); meMid(L, GEST.hands_head, 'scared'); TR.CAM.yaw.rotation.y = PI; TINT = `rgba(200,0,0,${.12 + Math.max(0, Math.sin(L.T * 12)) * .1})`;
  cm([TX + 3, 20, -14, TX, 34, 0, 56], [TX + 2, 22, -12, TX, 35, 0, 54], L.k); sh(V(TX, 0, -4), 30); }, [[0, 'siren', .9], [.6, 'alarm', .5]]);
// 56 «und auf jedem Bildschirm war auf einmal nur noch ich.» — zoom lento: las 500 pantallas muestran mi cara asustada
shot(89.06, 'F', 'slow', L => { use('TR'); inside(.4, 0); camPose(L); siren(L, .6); camsTurn(1, hp(ich)); TR.CAM.yaw.rotation.y = PI; TR.panels.forEach((p, i) => { p.material.map = TR.texM[i]; }); TINT = 'rgba(200,0,0,.1)';
  meMid(L, { ...GEST.hands_head }, 'shock'); ich.root.rotation.y = PI; cm([TX + 5, 5.6, -16, TX + 1, 6, -6, 50], [TX + 8, 10, -22, TX + 2, 10, 0, 72], L.k, easeIn); sh(V(TX, 0, -6), 30); }, [[0, 'glitch', .6], [.1, 'tv_static', .5], [.4, 'siren', .5]]);
// 57 «Neben der Kamera leuchtete ein roter Knopf:» — giro la cabeza: un botón rojo que brilla en su pedestal
shot(91.74, 'W', null, L => { use('TR'); inside(.4, 0); camPose(L); siren(L, .6); camsTurn(1, hp(ich)); TR.panels.forEach((p, i) => { p.material.map = TR.texM[i]; }); TR.bt.material.emissiveIntensity = .6 + Math.sin(L.T * 6) * .4; TINT = 'rgba(200,0,0,.08)';
  meMid(L, { headY: -.9, aRx: 1.3, aRe: .2, twist: -.2 }, 'determined'); const b = wpos(TR.BTN); cm([TX - 5, 6, -15, b.x - 2, 4, b.z, 52], [TX - 4, 6, -14, b.x - 1, 4.4, b.z, 50], L.k); sh(V(TX + 4, 0, -6), 25); }, [[0, 'siren', .4], [.4, 'hum_low', .5], [1.2, 'ding_reveal', .5]]);
// 58 (sigue) — el botón de cerca, latiendo
shot(93.14, 'Z', null, L => { use('TR'); inside(.4, 0); camPose(L); siren(L, .5); TR.bt.material.emissiveIntensity = .7 + Math.sin(L.T * 8) * .5; TR.panels.forEach((p, i) => { p.material.map = TR.texM[i]; }); const b = wpos(TR.BTN), a = TR.BTN.rotation.y, f = V(Math.sin(a), 0, Math.cos(a));
  cm([b.x + f.x * 9, 7.4, b.z + f.z * 9, b.x, 4, b.z, 46], [b.x + f.x * 7.4, 7.2, b.z + f.z * 7.4, b.x, 4.2, b.z, 44], L.k); sh(b, 15); }, [[0, 'heartbeat', .6], [.5, 'heartbeat', .5]]);
// 59 «ALLES LÖSCHEN.» — golpe de zoom al rótulo
shot(94.12, 'C', null, L => { use('TR'); inside(.4, 0); siren(L, .5); TR.bt.material.emissiveIntensity = 1.1; TR.panels.forEach((p, i) => { p.material.map = TR.texM[i]; }); const b = wpos(TR.BTN), a = TR.BTN.rotation.y, f = V(Math.sin(a), 0, Math.cos(a)); const k = easeOut(clamp(L.lt / .2));
  cm([b.x + f.x * 8, 4.8, b.z + f.z * 8, b.x, 3.8, b.z, 46], [b.x + f.x * 5.6, 4.2, b.z + f.z * 5.6, b.x, 3.8, b.z, 42], k); sh(b, 15); }, [[0, 'impact', .8], [.1, 'braam_short', .5]]);
// 60 «Ich bin hingerannt und habe draufgehauen.» — corro hacia el botón y lo aporreo: destello, todas las pantallas se apagan
shot(95.15, 'F', null, L => { use('TR'); inside(.4, 0); camPose(L); const hit = 96.25, after = L.T > hit; siren(L, after ? 0 : .6); TR.panels.forEach((p, i) => { p.material.map = after ? TR.texO[i] : TR.texM[i]; });
  const b = wpos(TR.BTN), a = TR.BTN.rotation.y, f = V(Math.sin(a), 0, Math.cos(a)), st = V(b.x + f.x * 12, 0, b.z + f.z * 12), en = V(b.x + f.x * 2.6, 0, b.z + f.z * 2.6); const k = clamp(L.lt / 1.0);
  const p = st.clone().lerp(en, easeOut(k)); put(ich, p.x, 0, p.z, a + PI); if (k < 1) applyPose(ich, runPose(L.T * 1.6)); else actuar(ich, L.lt - 1.0, [[0, { aRx: 2.9, aRe: .3, lean: .1 }], [.08, { aRx: .9, aRe: .1, lean: .45, crouch: .2, headX: .3 }, { dur: .1 }]], { T: L.T }); cara(ich, L.T, { expr: 'determined', mouth: after ? 'scream' : 'grimace' });
  TR.cap.position.y = after ? 4.4 : 4.6; if (after) { grade.uniforms.flash.value = Math.max(0, .9 - (L.T - hit) * 3); TR.L.intensity = 60; } cm([b.x + f.x * 6 + 6, 6, b.z + f.z * 6 - 2, b.x + f.x * 3, 4, b.z + f.z * 3, 54], [b.x + f.x * 5 + 5, 5.6, b.z + f.z * 5 - 1.6, b.x + f.x * 2, 4, b.z + f.z * 2, 50], L.k); sh(b, 20); },
  [[0, 'steps_run', .6], [.5, 'steps_run', .5], [1.1, 'slam', .9], [1.12, 'button', .7], [1.2, 'power_on', .3], [1.3, 'glass_crack', .3]]);
const runPose = T => { const s = Math.sin(T * 14), c = Math.cos(T * 14); return { lLx: s, lRx: -s, lLk: Math.max(0, -c) * 1.4 + .1, lRk: Math.max(0, c) * 1.4 + .1, aLx: -s * 1.1, aRx: s * 1.1, aLe: 1.3, aRe: 1.3, lean: .3, hipY: 2.05 + Math.abs(c) * .2 }; };

// ===== 97,1–105,8 s: la mañana, la fiesta =====
const DANCE = (T, i = 0) => { const s = Math.sin(T * 7 + i), c = Math.cos(T * 7 + i); return { aLx: 2.5 + s * .4, aRx: 2.5 - s * .4, aLz: .5, aRz: .5, aLe: .4, aRe: .4, crouch: Math.abs(s) * .18, twist: Math.sin(T * 3.5 + i) * .35, headZ: s * .15, lLx: Math.max(0, s) * .3, lLk: Math.max(0, s) * .5 }; };
// 61 «Am nächsten Morgen:» — amanecer sobre la ciudad
shot(97.11, 'F', null, L => { city(L, 'morning'); bigVid('plain'); ST.big.userData.draw('off2', (c, w, h) => { c.fillStyle = '#05060a'; c.fillRect(0, 0, w, h); }); cm([30, 50, 40, 0, 14, -70, 54], [26, 46, 34, 0, 14, -70, 52], L.k); sh(V(0, 0, -40), 60); }, [[0, 'rooster', .6], [.3, 'birds', .5]]);
// 62 «keine Lava,» — el pasillo del colegio normal; los alumnos andan tranquilos; yo respiro aliviado
shot(97.77, 'W', null, L => { use('FL'); inside(.9); put(ich, FX, 0, -8, 0); actuar(ich, L.lt, [[0, { lean: -.05, headX: -.15, aLz: .3, aRz: .3 }]], { T: L.T }); cara(ich, L.T, { expr: 'relief', mouth: 'smile' }); [[K[0], -4, -20, 0], [K[5], 4, -26, PI], [er, -2, -34, 0]].forEach(([c, x, z, ry], i) => { caminar(c, L.lt, { x: FX + x, z, ry, speed: 2.2, T: L.T + i }); cara(c, L.T + i, { expr: 'smile' }); });
  cm([FX + 1.4, 5, 5, FX, 3.6, -12, 50], [FX + 1.2, 5, 3.6, FX, 3.6, -12, 48], L.k); sh(V(FX, 0, -12), 30); }, [[0, 'sigh', .5], [.4, 'steps', .4], [.8, 'kids_chatter', .3]]);
// 63 «kein Mammut.» — delante de la casa de la Oma solo quedan las huellas; la Oma se encoge de hombros
shot(99.01, 'C', null, L => { use('NB'); morning(); NB.PRINTS.visible = true; put(oma, NX - 17, 0, 8, .6); actuar(oma, L.lt, [[0, 'shrug']], { T: L.T }); cara(oma, L.T, { expr: 'confused', mouth: 'smile' });
  cm([NX - 11, 6, 22, NX - 17, 2.4, 3, 50], [NX - 11.4, 5.6, 20, NX - 17, 2.4, 3, 48], L.k); sh(V(NX - 15, 0, 4), 25); }, [[0, 'birds', .5], [.3, 'hmm', .4]]);
// 64 «Die ganze Stadt hat auf der Straße getanzt,» — fiesta en la plaza: todos bailan, confeti
shot(99.85, 'S', null, L => { city(L); bigVid('plain'); ST.big.userData.draw('fest', (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#ff5a85'); g.addColorStop(1, '#ffd23f'); c.fillStyle = g; c.fillRect(0, 0, w, h); txt(c, 'FREI!', w / 2, h * .45, w * .35, '#fff', '#1a1a1a', 14); });
  const D = [[ich, 0, 8], [K[0], -4, 4], [K[4], 4, 3], [sie, -7, -2], [K[1], 7, -3], [mayor, -2, -6], [FW[0], 3, -8], [lena, -6, -12], [K[6], 6, -13], [kasse, 0, -16], [fahrer, -9, -18], [K[2], 9, -19]];
  D.forEach(([c, x, z], i) => { put(c, x, 0, z, Math.sin(L.T * 2 + i) * .4); actuar(c, L.lt, [[0, DANCE(L.T, i)]], { T: L.T + i, breathe: false }); cara(c, L.T + i, { expr: 'joy', mouth: 'open_smile' }); }); confetti(V(0, 6, 0), 99.9, L.T);
  cm([0, 4, 26, 0, 3.6, 0, 52], [2, 5, 22, 0, 3.6, 0, 50], L.k); sh(V(0, 0, -4), 40); }, [[0, 'cheer', .7], [.2, 'confetti', .6], [.5, 'party_horn', .5], [1.2, 'firework', .5], [1.8, 'cheer', .5]]);
// 65 «und Oma hat ihre 1.499 Euro zurückbekommen.» — la Oma enseña la tableta: «ERSTATTUNG +1.499 €»
shot(102.13, 'Z', null, L => { city(L); ST.big.userData.draw('fest', () => {}); put(oma, 1, 0, 10, -.2); actuar(oma, L.lt, [[0, { ...SHOW, aLx: 2.6, aLz: .5, aLe: .3 }]], { T: L.T, extra: { aLz: .5 + Math.sin(L.T * 9) * .3 } }); cara(oma, L.T, { expr: 'joy', mouth: 'open_smile', blush: 1 });
  attach(TAB, oma.aR.hand, [0, -.95, .05], [1.65, 0, 0], .8); TAB.userData.draw('refund', (c, w, h) => drawRefund(c, w, h)); badge('num', '+1.499 €', W / 2, H * .17, (L.lt - .3) * 2.5, 1, 1.3);
  const h = hp(oma); cm([h.x + .6, h.y, h.z + 8.4, h.x, h.y - 1.2, h.z, 46], [h.x + .5, h.y, h.z + 7.4, h.x, h.y - 1.2, h.z, 44], L.k); sh(V(1, 0, 10), 20); }, [[0, 'ding_reveal', .6], [.3, 'cash_reg', .6], [1.0, 'laugh_old', .5]]);
// 66 (sigue) — la Oma baila bajo una lluvia de billetes; yo aplaudo a su lado
shot(103.9, 'W', null, L => { city(L); ST.big.userData.draw('fest', () => {}); put(oma, -1.6, 0, 10, .2); actuar(oma, L.lt, [[0, DANCE(L.T, 2)]], { T: L.T, breathe: false }); cara(oma, L.T, { expr: 'joy', mouth: 'open_smile' }); put(ich, 2.6, 0, 9, -.4); actuar(ich, L.lt, [[0, 'cheer']], { T: L.T }); cara(ich, L.T, { expr: 'joy', mouth: 'open_smile' });
  cashRain(V(0, 2, 10), 103.9, L.T); cm([.4, 4.4, 24, .4, 3.4, 9, 48], [.4, 4.2, 22, .4, 3.4, 9, 46], L.k); sh(V(0, 0, 9), 20); }, [[0, 'money_rain', .6], [.5, 'cheer', .4], [1.2, 'coins', .4]]);

// ===== 105,8–121,7 s: el giro final =====
const drawTV = (c, w, h, kind, o = {}) => { c.fillStyle = '#05060a'; c.fillRect(0, 0, w, h); const vw = h * .5625; c.save(); c.translate((w - vw) / 2, 0); drawVid(c, vw, h, kind, o); c.restore(); };
const bedMe = (L, up = 0, expr = 'shock') => { if (up < .5) { put(ich, ZX + 13, 3.5, -5.6, 0); ich.root.rotation.x = -PI / 2; applyPose(ich, { aLz: .3, aRz: .3 }); cara(ich, L.T, { eyes: 'closed', mouth: 'flat', noBlink: true }); }
  else { sit(ich, ZX + 13, 3.4, -8.6, -.56); applyPose(ich, { ...SIT, lLx: 1.5, lRx: 1.5, lLk: .1, lRk: .1, aLz: .3, aRz: .3, aLx: .3, aRx: .3, ...shiver(L.T, 1) }); cara(ich, L.T, { expr }); } };
const nightRoom = (k = 0) => { use('ZI'); inside(.18, 0); ZI.LMP.intensity = 0; ZI.BLUE.intensity = 70 * k; };
// 67 «Aber in der nächsten Nacht,» — mi cuarto a oscuras; duermo
shot(105.75, 'F', null, L => { nightRoom(0); ZI.tvS.userData.draw('off', (c, w, h) => { c.fillStyle = '#05060a'; c.fillRect(0, 0, w, h); }); ZI.clk.userData.draw('443', (c, w, h) => drawClock(c, w, h, '4:43')); bedMe(L, 0);
  cm([ZX + 6, 10, 6, ZX + 13, 3.6, -7, 50], [ZX + 6.6, 9.4, 4.6, ZX + 13, 3.6, -7, 48], L.k); sh(V(ZX + 10, 0, -6), 15); }, [[0, 'crickets', .4], [.3, 'snore', .4], [.8, 'clock_tick', .3]]);
// 68 «um 4:44 Uhr,» — el despertador cambia a 4:44
shot(106.83, 'Z', null, L => { nightRoom(0); ZI.clk.userData.draw(L.lt > .3 ? '444' : '443', (c, w, h) => drawClock(c, w, h, L.lt > .3 ? '4:44' : '4:43')); bedMe(L, 0); const q = wpos(ZI.clk);
  cm([q.x + .6, q.y + .6, q.z + 3.6, q.x, q.y, q.z, 40], [q.x + .4, q.y + .5, q.z + 2.8, q.x, q.y, q.z, 36], L.k); sh(q, 10); }, [[0, 'clock_tick', .6], [.3, 'tick', .7], [.6, 'creepy_ting', .5]]);
// 69 «ist mein Fernseher von allein angegangen.» — la tele se enciende sola (nieve y luz azul); me incorporo de golpe
shot(108.13, 'C', null, L => { const on = L.lt > .3; nightRoom(on ? 1 : 0); ZI.tvS.userData.draw(on ? (L.lt < .8 ? 'st' + Math.floor(L.T * 15) : 'nv') : 'off', (c, w, h) => { if (!on) { c.fillStyle = '#05060a'; c.fillRect(0, 0, w, h); return; } if (L.lt < .8) { const r = RNG(Math.floor(L.T * 15)); for (let y = 0; y < h; y += 3) for (let x = 0; x < w; x += 3) { const v = r() * 255 | 0; c.fillStyle = `rgb(${v},${v},${v})`; c.fillRect(x, y, 3, 3); } } else drawTV(c, w, h, 'plain', { ui: false }); });
  bedMe(L, L.lt > .9 ? 1 : 0, 'shock'); cm([ZX + 5, 8, 8, ZX + 9, 5, -4, 56], [ZX + 5, 7.6, 7, ZX + 10, 5, -5, 54], L.k); sh(V(ZX + 8, 0, -2), 20); }, [[.3, 'power_on', .6], [.32, 'tv_static', .6], [1.0, 'gasp', .6], [1.5, 'blanket', .4]]);
// 70 «Ein neues Video:» — la tele: «NEUES VIDEO»
shot(110.71, 'Z', null, L => { nightRoom(1); ZI.tvS.userData.draw('neu', (c, w, h) => { drawTV(c, w, h, 'plain', { ui: false }); c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff3a5a'; c.beginPath(); c.roundRect(w * .2, h * .35, w * .6, h * .3, 16); c.fill(); txt(c, 'NEUES VIDEO', w / 2, h * .5, h * .12, '#fff'); }); bedMe(L, 1);
  const q = wpos(ZI.tvS); cm([q.x - 1, q.y + .4, q.z - 10, q.x, q.y, q.z, 46], [q.x - .8, q.y + .3, q.z - 8.6, q.x, q.y, q.z, 44], L.k); sh(q, 15); }, [[0, 'notif', .7], [.4, 'creepy_ting', .4]]);
// 71 «In dieser Stadt verschwindet ein Junge, der zu viel wusste.» — zoom lento: en la tele, un chico (yo) se desvanece; yo, aterrado, en la cama
shot(111.51, 'F', 'slow', L => { nightRoom(1); ZI.tvS.userData.draw('j' + Math.round(L.k * 12), (c, w, h) => drawTV(c, w, h, 'junge', { fade: L.k, prog: L.k })); bedMe(L, 1, 'scared');
  const q = wpos(ZI.tvS); cm([ZX + 16.5, 9, -13.5, q.x, q.y - 1, q.z, 54], [ZX + 16, 8.6, -12.4, q.x + 1, q.y - .8, q.z, 44], L.k, easeIn); sh(V(ZX + 8, 0, 0), 25); }, [[0, 'creepy_ting', .5], [1.2, 'heartbeat', .5], [2.2, 'heartbeat', .5]]);
// 72 «Vier Millionen Aufrufe in einer Minute.» — el contador de visitas se dispara hasta 4.000.000
const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
shot(114.87, 'C', null, L => { nightRoom(1); const n = Math.round(4000000 * easeOut(clamp(L.lt / 2.2)) / 1000) * 1000; ZI.tvS.userData.draw('v' + n, (c, w, h) => drawTV(c, w, h, 'junge', { fade: 1, views: fmt(n), prog: 1 })); bedMe(L, 1, 'shock');
  const q = wpos(ZI.tvS); cm([q.x - .6, q.y + .2, q.z - 7.6, q.x, q.y - .3, q.z, 46], [q.x - .5, q.y + .2, q.z - 6.8, q.x, q.y - .3, q.z, 44], L.k); badge('num', fmt(n), W / 2, H * .18, L.lt * 3, 1, 1.2); sh(q, 15); }, [[0, 'notif', .5], [.3, 'tick_down', .5], [.6, 'notif', .4], [1.0, 'notif', .4], [1.4, 'notif', .4], [2.0, 'ding_soft', .4]]);
// 73 «Und hochgeladen hat es ein Kanal namens …» — zoom lento al nombre del canal, que tarda en cargar
shot(117.77, 'Z', 'slow', L => { nightRoom(1); const dots = '.'.repeat(1 + Math.floor(L.lt * 3) % 3); ZI.tvS.userData.draw('ch' + dots, (c, w, h) => { drawTV(c, w, h, 'junge', { fade: 1, ui: false }); chanBox(c, w, h, null, '@' + dots, '#fff'); });
  bedMe(L, 1, 'scared'); const q = wpos(ZI.tvS); cm([q.x, q.y, q.z - 9, q.x, q.y - .5, q.z, 44], [q.x, q.y - .2, q.z - 6.6, q.x, q.y - .6, q.z, 42], L.k, easeIn); sh(q, 15); }, [[0, 'heartbeat', .5], [.8, 'heartbeat', .6]]);
const chanBox = (c, w, h, C, name, col) => { const vw = h * .5625, x0 = (w - vw) / 2; c.fillStyle = 'rgba(0,0,0,.7)'; c.fillRect(x0, h * .28, vw, h * .5); txt(c, 'Hochgeladen von', w / 2, h * .36, vw * .1, '#d8d8e8');
  if (C) faceIcon(c, w / 2, h * .5, vw * .14, C, 'evil'); else { c.fillStyle = '#5a5a66'; c.beginPath(); c.arc(w / 2, h * .5, vw * .14, 0, 7); c.fill(); } txt(c, name, w / 2, h * .67, vw * .17, col, '#000', 6); };
// 74 «Jonas.» — en la tele: el avatar de Jonas, «@JONAS»
shot(120.01, 'C', null, L => { nightRoom(1); ZI.tvS.userData.draw('jonas', (c, w, h) => { drawTV(c, w, h, 'junge', { fade: 1, ui: false }); chanBox(c, w, h, JONAS_C, '@JONAS', '#ffd23f'); });
  bedMe(L, 1, 'shock'); const q = wpos(ZI.tvS); cam([q.x, q.y - .2, q.z - 6.2], [q.x, q.y - .6, q.z], 42); sh(q, 15); }, [[0, 'impact', .8], [.02, 'braam', .9]]);
// 75 (final) — Jonas en su cuarto a oscuras, iluminado por las pantallas, sonríe con malicia
shot(120.65, 'C', null, L => { use('JZ'); inside(.12, 0); JZ.LMP.intensity = 0; JZ.BLUE.intensity = 60; JZ.lapS.userData.draw('jn', (c, w, h) => drawVid(c, w, h, 'junge', { fade: 1 })); sit(jonas, JX - 6, 3.25, -6.4, PI); actuar(jonas, L.lt, [[0, { ...SIT, aLx: 1.3, aRx: 1.3, aLe: 1.6, aRe: 1.6, aLz: -.3, aRz: -.3, headX: -.05 }]], { T: L.T }); cara(jonas, L.T, { expr: 'sus', mouth: 'smirk', eyes: 'squint' });
  onFace(jonas, 6, .1, 1.2, 44, L.k, 4.6); sh(V(JX - 6, 0, -8), 15); }, [[0, 'evil_laugh', .7]]);
// portadas: 0 = yo en la plaza entre la gente con móviles y la pantalla gigante; 1 = la sala de las 500 pantallas con mi cara
COVERS.push({ i: 0, k: .9, cam: () => cam([0, 3.2, 17.5], [0, 2.8, 4], 50), l2: 'SCHAUT JEDER DIESE VIDEOS…' }, { i: 55, k: .6, cam: () => cam([TX - 6, 6, -18.5], [TX + .6, 5.6, -7], 56), l2: '…UND DANN SAH ICH MICH' });


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); } });
CUES.push({ t: 0, s: 'zoom_fast', g: .9 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD_.length = 0; s.fn(L);
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud'].includes(c.s) && T - c.t < .16) sh_ = 1 - (T - c.t) / .16; }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .25 * sh_; camera.position.y += (r() - .5) * .25 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.5; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, MODE === 'night' ? 'noche' : 'polvo', MODE === 'in' ? .3 : .4); BIRDS.update(T, ctr, SETS.ST.visible && MODE === 'day', false);
  if (ST.G.visible) ST.FTN.userData.update?.(T);
  sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position); composer.render();
}
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
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const b of BAD_) drawBadge(b); caption(T);
}
// portadas (sin spoilers)
function coverText(l1, l2, col) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * .115, 132, '#ffffff'], [l2, H * .195, 112, col]]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .92 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .22; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }
window.renderCover = v => { const C = COVERS[v], s = S[C.i], T = s.t0 + (s.t1 - s.t0) * C.k; COVER = C; renderShot(C.i, T, null, 0); COVER = null;
  octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H); coverText('IN DIESER STADT', C.l2, '#E2FD07'); };
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { renderer, composer, bloom, sun, grade, scene, camera };

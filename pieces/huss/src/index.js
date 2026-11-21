// HUSS — «In dieser Stadt geht jeder auf Partys, außer mir»: planos sincronizados con audio/words.json (1080×1920, 30 fps).
// Réplica de la estructura del vídeo de referencia (todos de fiesta, yo entreno → partido de la Sommerparty → 10:0 → el pueblo entero entrena)
// con fútbol en vez de baloncesto. Los planos están en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT } from './props.js';
import { makeOma, makeKumpel, makeLena, makeSie, makeEr, makeKassiererin, makeFahrer, makeJonas, makeMayor } from './gvolk.js';
import { ort, garage, garten, kueche, zimmer } from './wsets.js';
import { omaStube } from './svsets.js';
import { makeHuss, makeGerda, makeKapitaen, makeDJ, gloves } from './hvolk.js';
import { football, partyHat, stadion, bolzplatz, saal, crowd, guitar, punchBag, yogaMat, calendar, pizzaBox, pizza, cake, fishbowl, balloons, discoBall, speaker, glowM } from './hsets.js';
import { signBoard } from './wsets.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 76.2, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
const SPOTL = new THREE.SpotLight(0xfff2c8, 0, 80, .5, .5, 1.1); scene.add(SPOTL, SPOTL.target);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
const BX = 600, SX = 1000, AX = 1500, KX = 1800, GX = 2100, ZX = 2400, RX = 2700, OX = 3000;
const OR = ort(scene), BZ = bolzplatz(scene, BX), ST = stadion(scene, SX), SA = saal(scene, AX), KU = kueche(scene, KX), GT = garten(scene, GX), ZI = zimmer(scene, ZX), GA = garage(scene, RX), OS = omaStube(scene, OX);
const SETS = { OR: OR.G, BZ: BZ.g, ST: ST.g, SA: SA.g, KU: KU.g, GT: GT.g, ZI: ZI.g, GA: GA.g, OS: OS.g };
for (const k in SETS) outline(SETS[k], 1.4);
OR.zoo.visible = false;
// ventanas de las casas del pueblo: luz cálida, luces de fiesta o siluetas que hacen toques con el balón
const silT = f => { const c = document.createElement('canvas'); c.width = 128; c.height = 110; const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 0, 110); g.addColorStop(0, '#ffe9a0'); g.addColorStop(1, '#ffb84a'); x.fillStyle = g; x.fillRect(0, 0, 128, 110); x.fillStyle = '#2a1608';
  const cx = 64 + (f ? 4 : -4); x.fillRect(cx - 13, 22, 26, 24); x.fillRect(cx - 18, 46, 36, 34); x.fillRect(cx - 34, 50 - (f ? 10 : 0), 16, 10); x.fillRect(cx + 18, 50 - (f ? 0 : 10), 16, 10); x.fillRect(cx - 16, 80, 12, 30);
  x.save(); x.translate(cx + 10, 84); x.rotate(f ? -1.1 : -.3); x.fillRect(-6, 0, 12, 24); x.restore(); x.beginPath(); x.arc(cx + (f ? 26 : 16), f ? 60 : 94, 9, 0, 7); x.fill(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
const SIL = [silT(0), silT(1)];
const WIN = OR.houses.map((h, i) => { const ps = []; for (const [wx, wy] of [[5, 3.8], [-5, 7.6], [5, 7.6]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.2), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })); m.position.set(wx, wy, 6.74); h.g.g.add(m); ps.push(m); } return ps; });
let WMODE = 'off';
function windows(mode, T) { WMODE = mode; WIN.forEach((ps, i) => ps.forEach((m, j) => { m.visible = mode !== 'off'; if (mode === 'off') return; const ph = i * 3 + j;
  if (mode === 'warm') { m.material.map = null; m.material.color.setRGB(1.6, 1.25, .6); }
  else if (mode === 'party') { m.material.map = null; const c = new THREE.Color().setHSL(((T * .6 + ph * .13) % 1), 1, .55); m.material.color.setRGB(c.r * 2.2, c.g * 2.2, c.b * 2.2); }
  else if (mode === 'dark') { m.material.map = null; m.material.color.setRGB(.05, .06, .12); }
  else if (mode === 'sil') { m.material.map = SIL[Math.floor(T * 9.5 + ph * .5) % 2]; m.material.color.setRGB(1.5, 1.3, 1.0); }
  m.material.needsUpdate = true; })); }
// ---------- reparto ----------
const ich = makeHuss(scene), jonas = makeJonas(scene), gerda = makeGerda(scene), oma = makeOma(scene), kap = makeKapitaen(scene), dj = makeDJ(scene);
const K = Array.from({ length: 8 }, (_, i) => makeKumpel(scene, i)); const XT = [makeLena(scene), makeSie(scene), makeEr(scene), makeKassiererin(scene), makeFahrer(scene), makeMayor(scene)];
kitFace(ich, 'kid'); kitFace(jonas, 'hero'); kitFace(gerda, 'girl'); kitFace(oma, 'girl'); kitFace(kap, 'villain'); kitFace(dj, 'plain');
K.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'plain', 'girl', 'girl', 'kid', 'hero'][i])); XT.forEach((c, i) => kitFace(c, ['girl', 'girl', 'kid', 'girl', 'plain', 'mustache'][i]));
const POOL = [ich, jonas, gerda, oma, kap, dj, ...K, ...XT]; POOL.forEach(c => outline(c.root, 2));
const HATS = new Map(); POOL.forEach((c, i) => HATS.set(c, partyHat(c.head, i, 1.32 + (c === oma ? .25 : 0) + (c === gerda ? .12 : 0))));
const hat = (...cs) => cs.forEach(c => HATS.get(c).visible = true);
const GLV = gloves(gerda);
// ---------- atrezo ----------
const BALL = football(scene, .55), BALL2 = football(scene, .55); outline(BALL, 1.6); outline(BALL2, 1.6);
const TRL = Array.from({ length: 7 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.5, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .4 * (1 - i / 7), depthWrite: false })); m.renderOrder = 2; scene.add(m); return m; });
const GUIT = guitar(scene); outline(GUIT, 1.4); const BAG = punchBag(scene); outline(BAG, 1.4); const MAT = yogaMat(scene);
const CAL = calendar(scene, 'DIENSTAG', 'PARTY!'); const POSTER = (() => { const g = new THREE.Group(); scene.add(g); cyl(.2, .2, 10, mat(0x3a3e4a, { metalness: .6 }), 8, g, 0, 5, -.3);
  const p = textPlane(4.4, 5.6, 220, 280, (c, w, h) => { c.fillStyle = '#ff4a8a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.font = `700 52px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('MORGEN', w / 2, 60); c.fillStyle = '#ffffff'; c.font = `700 70px ${FONT}`; c.fillText('PARTY!', w / 2, 140); c.font = `700 30px ${FONT}`; c.fillStyle = '#1a1a2a'; c.fillText('ALLE KOMMEN', w / 2, 210); for (let k = 0; k < 14; k++) { c.fillStyle = ['#ffd23f', '#3ab8ff', '#8ad84a', '#fff'][k % 4]; c.fillRect((k * 53) % w, 240 + (k % 3) * 10, 10, 10); } }); p.position.set(0, 5.2, 0); g.add(p); return g; })();
const ABG = (() => { const g = new THREE.Group(); scene.add(g); const s = signBoard('PARTY ABGESAGT', 9, 2.2, '#ffffff', '#d8323a', '#d8323a'); s.position.y = 6; s.rotation.z = -.08; g.add(s); for (const x of [-3.6, 3.6]) cyl(.18, .18, 6, mat(0x8a6a4a), 6, g, x, 3, -.1); return g; })();
const PZ = [pizzaBox(scene, true), pizzaBox(scene, true), pizzaBox(scene, false), pizza(scene, 1)]; PZ.forEach(p => outline(p, 1.4));
const SLICE = (() => { const g = new THREE.Group(); scene.add(g); const s = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, .14, 3, 1, false, 0, Math.PI / 3), mat(0xe8b060)); g.add(s); const t = new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, .06, 3, 1, false, 0, Math.PI / 3), mat(0xe8402a)); t.position.y = .1; g.add(t); return g; })();
const FLOATS = [0xff4a6a, 0xffd23f, 0x3ab8ff].map(c => { const r = new THREE.Mesh(new THREE.TorusGeometry(1.1, .42, 12, 24), mat(c, { roughness: .3 })); r.rotation.x = Math.PI / 2; scene.add(r); outline(r, 1.4); return r; });
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const FW = Array.from({ length: 60 }, (_, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(.5, 6, 4), new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL((i % 6) / 6, 1, .6).multiplyScalar(2.5), toneMapped: false })); scene.add(s); return s; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const NOTES = Array.from({ length: 4 }, (_, i) => { const p = textPlane(1.4, 1.4, 64, 64, (c, w, h) => { c.font = `700 56px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 8; c.strokeStyle = '#1a1a2a'; c.strokeText(i % 2 ? '♪' : '♫', w / 2, h / 2); c.fillStyle = '#ffd23f'; c.fillText(i % 2 ? '♪' : '♫', w / 2, h / 2); }); p.material.depthWrite = false; scene.add(p); return p; });
const HEARTS = Array.from({ length: 5 }, () => { const p = textPlane(1.2, 1.2, 64, 64, (c, w, h) => { c.fillStyle = '#ff3a6a'; c.beginPath(); c.moveTo(32, 54); c.bezierCurveTo(0, 30, 8, 4, 32, 18); c.bezierCurveTo(56, 4, 64, 30, 32, 54); c.fill(); }); p.material.depthWrite = false; scene.add(p); return p; });
const CROWD = crowd(scene, 196); (() => { let i = 0; for (let r = 0; r < 7; r++) for (let k = 0; k < 28; k++) { const s = CROWD.seat[i++]; s.x = SX - 25.3 - r * 2.6; s.y = 1.6 + r * 1.6; s.z = -33 + k * 2.45 + (r % 2) * .6; s.ry = PI2(); } })();
function PI2() { return Math.PI / 2; }
const PROPS = [...TRL, BALL, BALL2, GUIT, BAG, MAT, CAL, POSTER, ABG, ...PZ, SLICE, ...FLOATS, ...CONF, ...FW, ...DUST, ...SWEAT, ...NOTES, ...HEARTS, ...GLV];
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.25; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.55, .62, .42); sun.intensity = 2.5; sun.color.setRGB(1, .95, .86); rim.intensity = 1.0;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function sunset() { day(); MODE = 'sunset'; setSky([.22, .32, .78], [.85, .55, .7], [1, .72, .45]); sun.color.setRGB(1, .82, .62); sun.intensity = 2.3; hemi.color.setRGB(1, .9, .85); scene.fog.color.setRGB(1, .82, .7); bloom.strength = .2; }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.0; setSky([.02, .04, .16], [.08, .12, .34], [.2, .22, .46]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.0; hemi.color.setRGB(.6, .7, 1); hemi.groundColor.setRGB(.25, .25, .36); sun.intensity = 1.1; sun.color.setRGB(.72, .78, 1); rim.intensity = 1.7;
  scene.fog.color.setRGB(.1, .14, .28); scene.fog.density = .0011; bloom.strength = .3; bloom.threshold = .85; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = .95, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .2; bloom.threshold = .88; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } HATS.get(c).visible = false; }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene && !GLV.includes(p)) { p.parent.remove(p); scene.add(p); } }
  CROWD.update(0, 'still', false, 0); BZ.SPOT.intensity = 0; SPOTL.intensity = 0; OR.FEST.visible = false; windows('off', 0); ST.SB.userData.set(0, 0); ST.G1.userData.bulge(0); ST.G2.userData.bulge(0); BZ.GO.userData.bulge(0);
  SA.LC.forEach(l => l.intensity = 0); SA.LI.intensity = 160; SA.FB.userData.fish.userData.face(false);
  for (const k in SETS) SETS[k].visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = 1.08; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
// órbita: cámara a distancia d del centro c, ángulo yaw (0 = desde +z), pitch (arriba +); el centro queda al ~42 % de la altura
function orbit(c, d, yaw = 0, pitch = .15, fov = 44) { const t = Math.tan(fov * Math.PI / 360) * d * .16; cam([c.x + Math.sin(yaw) * Math.cos(pitch) * d, c.y + Math.sin(pitch) * d, c.z + Math.cos(yaw) * Math.cos(pitch) * d], [c.x, c.y - t, c.z], fov); }
const orb = (k, c0, c1, a, b, e = easeInOut) => { const q = e(clamp(k)); orbit(c0.clone().lerp(c1 ?? c0, q), lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q), lerp(a[3] ?? 44, b[3] ?? 44, q)); };
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
// encuadre frontal: cámara a 'dist' delante del personaje (según su ry), un poco a un lado, mirando a la cabeza
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .3 + dy, h.z + fz * d - fx * side], [h.x, h.y - .5, h.z], fov); }
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
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk', extra = {}) => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat', ...extra });
const grin = (ch, T, ex = {}) => cara(ch, T, { expr: 'grin', eyes: 'happy', mouth: 'grin', ...ex });
const laughF = (ch, T) => cara(ch, T, { eyes: 'happy', mouth: Math.sin(T * 22) > 0 ? 'laugh' : 'open_smile' });
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
// fuegos artificiales: estallidos en el cielo
function fireworks(c, T, n = 3, R = 14) { FW.forEach((s, i) => { const b = i % n, k = Math.floor(i / n), per = 1.6, t = ((T + b * .53) % per) / per, r0 = RNG(b * 17 + Math.floor((T + b * .53) / per) * 31); const cx = c.x + (r0() - .5) * 60, cy = c.y + 30 + r0() * 20, cz = c.z + (r0() - .5) * 20;
  const a = k / (FW.length / n) * 6.283, el = Math.sin(k * 2.3) * .8; s.visible = t > .25; const e = easeOut((t - .25) / .75) * R; s.position.set(cx + Math.cos(a) * Math.cos(el) * e, cy + Math.sin(el) * e - t * t * 4, cz + Math.sin(a) * Math.cos(el) * e); s.scale.setScalar(1 - t * .8); s.material.color.setHSL((b * .27 + .05) % 1, 1, .6).multiplyScalar(2.5); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.7 + t * 2) * s * (.8 + r() * .5)); d.material.opacity = .55 * (1 - t / 1.2); }); }
function notes(p, T) { NOTES.forEach((z, i) => { const k = (T * .7 + i / 4) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 2 + T) * 1.5, p.y + k * 4, p.z + .5); z.scale.setScalar(.6 + k * .6); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
function hearts(p, T) { HEARTS.forEach((z, i) => { const k = (T * .6 + i / 5) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 1.7 + T) * 1.4, p.y + k * 3.4, p.z + .4); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));

// ---------- fútbol: toques (keepy-uppy), conducción y tiro ----------
// tiempos de los HUSS de un tramo (absolutos)
const HUSS = WORDS.filter(w => /HUSS/.test(w[2])).map(w => w[0]);
const hussIn = (a, b) => HUSS.filter(t => t >= a - .01 && t < b - .01);
const loc = (ch, x, y, z) => { ch.root.updateMatrixWorld(true); return ch.root.localToWorld(V(x, y, z)); };
// toques: el balón sube y baja entre el pie izquierdo y el derecho en cada golpe (ts absolutos). Pose con brazos de equilibrio.
function juggle(ch, ball, T, ts, o = {}) { const Hh = o.h ?? 2.6; let i = -1; for (let k = 0; k < ts.length; k++) if (ts[k] <= T) i = k;
  const side = k => (k % 2 ? -1 : 1) * .5, foot = k => V(side(k), 1.35, 1.3);
  let p; if (i < 0) { const k = clamp((T - (ts[0] - .3)) / .3); p = V(side(0), lerp(4.4, 1.35, k * k), 1.3); }
  else { const t0 = ts[i], t1 = i + 1 < ts.length ? ts[i + 1] : t0 + (o.tail ?? .45), k = clamp((T - t0) / (t1 - t0)), a = foot(i), b = i + 1 < ts.length ? foot(i + 1) : V(0, o.end ? 6 : 1.35, 1.3);
    p = V(lerp(a.x, b.x, k), lerp(a.y, b.y, k) + 4 * Hh * k * (1 - k), lerp(a.z, b.z, k)); }
  let lL = 0, lR = 0; ts.forEach((t, k) => { const g = Math.exp(-Math.pow((T - t) / .09, 2)); if (k % 2) lL = Math.max(lL, g); else lR = Math.max(lR, g); });
  const pose = { lLx: 1.15 * lL, lLk: .95 * lL, lRx: 1.15 * lR, lRk: .95 * lR, aLx: .5, aLz: .75 + Math.sin(T * 6) * .08, aRx: .5, aRz: .75 - Math.sin(T * 6) * .08, aLe: .5, aRe: .5, headX: .38 - p.y * .05, crouch: .08 + (lL + lR) * .05, lean: .05, twist: (lR - lL) * .12, ...(o.extra || {}) };
  applyPose(ch, pose); const w = loc(ch, p.x, p.y, p.z); show(ball, w.x, w.y, w.z); ball.rotation.set(T * 9, T * 4, 0); return w; }
// trucos de crack (un truco por cada HUSS): suela, bicicleta, elástica, toques, rodilla y rabona-arcoíris.
// El balón deja una estela para que se lea bien su recorrido. ts = golpes (absolutos), seq = truco que empieza en cada golpe.
function trickAt(T, ts, seq, g, o = {}) { let i = -1; for (let k = 0; k < ts.length; k++) if (ts[k] <= T) i = k;
  if (i < 0) { const k = clamp((T - (ts[0] - .25)) / .25); return { p: V(lerp(1.6, .75, easeOut(k)), g, 1.25), kind: 'pre', k, side: 1 }; }
  const t0 = ts[i], last = i + 1 >= ts.length, t1 = last ? t0 + (o.tail ?? .3) : ts[i + 1], k = clamp((T - t0) / (t1 - t0)), kind = last && o.end ? 'end' : seq[i % seq.length], side = i % 2 ? -1 : 1; let p;
  switch (kind) {
    case 'roll': p = V(lerp(.75 * side, -.75 * side, easeInOut(k)), g, 1.25); break;
    case 'step': p = V(.12 * Math.sin(k * PI) * side, g, 1.35); break;
    case 'elastico': p = V(k < .45 ? lerp(0, 1.05 * side, easeOut(k / .45)) : lerp(1.05 * side, -.9 * side, easeInOut((k - .45) / .55)), g, 1.3); break;
    case 'up': p = V(lerp(.5 * side, -.5 * side, k), 1.35 + 4 * 1.7 * k * (1 - k), 1.3); break;
    case 'knee': p = V(lerp(.5 * side, -.5 * side, k), 2.5 + 4 * 1.1 * k * (1 - k), 1.15); break;
    case 'rainbow': p = V(0, g + 4 * 5.6 * k * (1 - k), lerp(-.8, 2.6, k)); break;
    case 'end': p = V(0, 1.35 + 4 * 2.8 * clamp(k * 1.6) * (1 - clamp(k * 1.6)) + (k > .62 ? 0 : 0), 1.3); break;
    default: p = V(.75 * side, g, 1.25); }
  return { p, kind, k, side }; }
function trick(ch, ball, T, ts, seq, o = {}) { const s = ch.spec.scale || 1, g = .55 / s; const r = trickAt(T, ts, seq, g, o), { kind, k, side } = r;
  const P = { crouch: .22, lean: .16, aLx: .45, aRx: .45, aLz: .9 + Math.sin(T * 13) * .12, aRz: .9 - Math.sin(T * 13) * .12, aLe: .6, aRe: .6, headX: .32, lLk: .25, lRk: .25, lLx: .12, lRx: .12 };
  const leg = (sd, x, kn) => { if (sd > 0) { P.lRx = x; P.lRk = kn; } else { P.lLx = x; P.lLk = kn; } };
  if (kind === 'roll') { leg(side, .5, .45); P.sx = lerp(.35 * side, -.35 * side, easeInOut(k)); P.twist = .25 * side * Math.sin(k * PI); }
  else if (kind === 'step') { const l = Math.sin(k * PI); leg(side, .3 + .9 * l, .4 + 1.3 * l); P.sx = -side * .4 * l; P.twist = side * .45 * l; P.lean = .22; }
  else if (kind === 'elastico') { leg(side, .55, .35); P.sx = r.p.x * .3; P.twist = r.p.x * .35; }
  else if (kind === 'up' || kind === 'knee' || kind === 'end') { ts.forEach((t, j) => { const gg = Math.exp(-Math.pow((T - t) / .07, 2)); if (gg > .02) leg(j % 2 ? -1 : 1, kind === 'knee' ? 1.6 * gg : 1.15 * gg, kind === 'knee' ? 1.6 * gg : .95 * gg); }); P.headX = .3 - r.p.y * .05; P.crouch = .12; }
  else if (kind === 'rainbow') { if (k < .2) { const q = Math.sin(k / .2 * PI); P.lRx = -.9 * q; P.lRk = 1.8 * q; P.lLx = .5 * q; } P.headX = lerp(.3, -.35, Math.sin(k * PI)); P.lean = .05; }
  else { leg(1, .4, .3); }
  P.hipY = 2.05 + Math.abs(Math.sin(T * 14)) * .08; Object.assign(P, o.extra || {}); applyPose(ch, P);
  const w = loc(ch, r.p.x, r.p.y, r.p.z); show(ball, w.x, w.y, w.z); ball.rotation.set(T * 16, T * 9, 0);
  TRL.forEach((m, j) => { const q = trickAt(T - (j + 1) * .022, ts, seq, g, o).p; const wq = loc(ch, q.x, q.y, q.z); m.visible = w.distanceTo(wq) > .15; m.position.copy(wq); m.scale.setScalar(1 - j * .08); }); return w; }
// conducción a la carrera: el personaje corre en dirección ry y empuja el balón con cada golpe
function dribble(ch, ball, lt, T, o) { const r = caminar(ch, lt, { x: o.x, z: o.z, ry: o.ry, speed: o.speed ?? 9, run: true, accel: .05, T, extra: o.extra }); const ts = o.ts || [];
  let i = -1; for (let k = 0; k < ts.length; k++) if (ts[k] <= T) i = k; const t0 = i < 0 ? T - .2 : ts[i], t1 = i + 1 < ts.length ? ts[i + 1] : t0 + .4, k = clamp((T - t0) / Math.max(.1, t1 - t0));
  const zz = 1.5 + 1.6 * Math.sin(Math.PI * k), xx = (o.weave ?? 0) * Math.sin((i + k) * Math.PI); const w = loc(ch, xx, .55 / (ch.spec.scale || 1), zz); show(ball, w.x, .55, w.z); ball.rotation.set(T * 14, 0, 0); TRL.slice(0, 4).forEach((m, j) => { m.visible = true; m.position.set(w.x - Math.sin(o.ry) * (j + 1) * .35, .55, w.z - Math.cos(o.ry) * (j + 1) * .35); m.scale.setScalar(1 - j * .15); }); return r; }
// tiro: anticipación (pierna atrás) y golpeo (pierna delante). k: 0..1 del gesto (golpeo en k = .55)
const kickPose = k => k < .55 ? { lRx: lerp(0, -1.0, easeOut(k / .55)), lRk: lerp(0, 1.5, k / .55), aLx: lerp(0, .9, k / .55), aLz: .6, aRx: lerp(0, -.5, k / .55), aRz: .5, lean: -.12, twist: .25, lLk: .25, crouch: .12 }
  : { lRx: lerp(-1.0, 1.55, easeOut((k - .55) / .45)), lRk: lerp(1.5, .05, easeOut((k - .55) / .45)), aLx: lerp(.9, -.2, (k - .55) / .45), aLz: .7, aRx: lerp(-.5, .8, (k - .55) / .45), aRz: .6, lean: lerp(-.12, .18, (k - .55) / .45), twist: lerp(.25, -.3, (k - .55) / .45), lLk: .3, crouch: .1 };
// paso del balón de a (pie) a b (red) con altura h; k 0..1 -> posición
function shotBall(ball, a, b, h, k, T) { const p = arc(a, b, h, clamp(k)); show(ball, p.x, Math.max(.55, p.y), p.z); ball.rotation.set(T * 20, T * 6, 0); return p; }

// ---------- capa 2D ----------
const BAD_ = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD_.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD_.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD_.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
const hussPop = (w3, T, t0) => { const t = T - t0; if (t < 0 || t > .5) return; BAD_.push({ kind: 'huss', text: 'HUSS!', w3: w3.clone().add(V(0, 1.4 + t * 2, 0)), s: spring(clamp(t * 5) * 1.6) * .8, a: 1 - clamp((t - .3) / .2), on: true }); };
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; if (x < -60 || x > W + 60) return; b.x = clamp(x, 200, W - 200); b.y = clamp(y, 150, H * .64); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num' || b.kind === 'green' || b.kind === 'gold') { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : b.kind === 'green' ? '#04300e' : b.kind === 'gold' ? '#3a2400' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#8aff9a'); g.addColorStop(1, '#1ab84a'); } else if (b.kind === 'gold') { g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a820'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'huss') { c.rotate(-.12); c.font = `700 64px ${FONT}`; c.lineWidth = 16; c.strokeStyle = '#1a1a2a'; c.strokeText(b.text, 0, 0); c.fillStyle = '#ffffff'; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  c.restore(); }
const KEY = /^(Stadt|Partys|mir|HUSS|Nacht|Party|Poolpartys|Pizzapartys|Geburtstagsparty|Blubb|Goldfisch|niemand|Morgen|Jonas|Gerda|Oma|Dienstag|nicht|Tag|größte|Jahres|Sommerparty-Fußballspiel|Partyhüten|lachten|Kleine|Ball|Zehn|Tore|Musik|still|gut|Wahrheit|gefeiert|Stadt|falsch|Partylichter|Nichts|Fenster|Gitarre|boxte|Yoga|keiner|trainiert|Einzige|feiert|Gast|Blubbs|Geburtstag|alles|gewünscht)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: /HUSS/.test(t) ? 'HUSS!' : t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0; const COVERS = [];
// el pueblo (ORT, x = 0): calle x ∈ [-8, 8], aceras hasta ±12,6, casas en x = ±24,5 (fachada en ±18) cada 22 desde z = 36,
// barras en x = ±10,6. FEST = banderines, globos y pancarta.
const street = (n = true) => { use('OR'); n ? night() : day(); };
// Bolzplatz (BX): jaula de goma 28 × 36, portería pequeña en z = -14, conos en x ≈ ±1,2, z = 10 … -6
const bolz = (n = true) => { use('BZ'); if (n) { night(30); BZ.SPOT.intensity = 120; bloom.threshold = .92; } else day(); };
// estadio (SX): campo x ∈ ±20, z ∈ ±35; portería de casa (G1) en z = -35; gradas a la izquierda; DJ a la derecha (x = 25,5, z = -6)
const stadium = () => { use('ST'); sunset(); };
// ---------- a: gancho, las fiestas de cada noche, nadie entrena (0 – 16,15 s) ----------
const dance = (ch, T, ph = 0, extra = {}) => { const b = Math.sin(T * 9 + ph); applyPose(ch, { aLx: .35, aLz: 2.2 + b * .35, aRx: .35, aRz: 2.2 - b * .35, aLe: .3, aRe: .3, lean: Math.sin(T * 4.5 + ph) * .08, sx: Math.sin(T * 4.5 + ph) * .25, crouch: .12 + Math.abs(b) * .1, lLk: .2 + Math.max(0, b) * .5, lRk: .2 + Math.max(0, -b) * .5, lLx: Math.max(0, b) * .4, lRx: Math.max(0, -b) * .4, headZ: Math.sin(T * 4.5 + ph) * .15, ...extra }); };
const party = (chs, T, base, sp = 4.2, ry = 0) => chs.forEach((c, i) => { const r = RNG(i * 7 + 3); put(c, base.x + (i % 3 - 1) * sp + (r() - .5) * 1.4, base.y, base.z - Math.floor(i / 3) * sp * .9 + (r() - .5), ry + (r() - .5) * .8); hat(c); dance(c, T, i * 1.3); grin(c, T); });
const holdBall = (ch, T) => { applyPose(ch, { aRx: .35, aRz: .15, aRe: 1.6, aLz: .15, aLe: .3, headX: .02 }); const w = loc(ch, 1.2, 2.55, .45); show(BALL, w.x, w.y, w.z); return w; };
// 1 «In dieser Stadt geht jeder auf Partys»: la calle de noche llena de fiesta; yo delante con el balón bajo el brazo
// 1 «In dieser Stadt»: yo haciendo toques en mitad de la calle de noche; detrás, el pueblo de fiesta
shot(0, 'Z', null, L => { street(); OR.FEST.visible = true; windows('party', L.T); party([...K.slice(0, 6)], L.T, V(0, 0, -22), 4.6, 0);
  const me = put(ich, .3, 0, 2, .05); trick(me, BALL, L.T, [.04, .22, .4, .58, .74], ['up', 'knee', 'up', 'knee', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  fireworks(V(0, 0, -70), L.T, 3, 12); orb(L.k, V(.3, 3.0, 2), null, [13.5, .25, .05, 46], [12.5, .15, .05, 46]); sh(V(0, 0, 0), 30); }, [[.04, 'kick', .5], [.22, 'kick', .4], [.4, 'kick', .5], [.58, 'kick', .4], [.3, 'cheer', .3]]);
// 2 «geht jeder auf Partys»: grúa sobre la calle llena de gente bailando con gorros de fiesta
shot(.76, 'W', null, L => { street(); OR.FEST.visible = true; windows('party', L.T);
  party([...K, ...XT.slice(0, 4)], L.T, V(0, 0, -6), 4.2, 0);
  fireworks(V(0, 0, -60), L.T, 3, 12); confRain(V(0, 0, -8), L.T, 60, 22, 18, 14);
  orb(L.k, V(0, 3.2, -8), null, [20, .1, .32, 48], [17, .02, .26, 48]); sh(V(0, 0, -8), 30); }, [[0, 'swipe', .5], [.2, 'cheer', .45], [.4, 'firework', .5], [1.0, 'party_horn', .4]]);
shot(2.21, 'C', 'punch', L => { bolz(); const me = put(ich, BX, 0, 6, 0); holdBall(me, L.T); talk(me, L.T, 2.21, 3.03, 'smug');
  onFace(me, 9.2, -.4, .8, 38, L.k, 8.2); sh(V(BX, 0, 4), 30); }, [[0, 'thump', .6], [.2, 'hmm', .3]]);
// 3 HUSS (toques): contrapicado frontal, el balón sube y baja de un pie al otro
shot(3.03, 'W', null, L => { bolz(); const ts = hussIn(3.0, 4.2); const me = put(ich, BX, 0, 2, .1); const b = trick(me, BALL, L.T, ts, ['roll', 'step', 'elastico', 'step', 'roll']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
   orb(L.k, V(BX, 1.9, 2), null, [11.5, .2, .06, 46], [10.5, .45, .06, 46]); sh(V(BX, 0, 2), 30); }, [[0, 'swipe', .5]]);
// 4 HUSS (toques y tiro a la portería pequeña): plano lateral, el balón entra y la red se hincha
shot(3.48, 'F', null, L => { bolz(); const ts = hussIn(3.0, 3.9); const me = put(ich, BX + .5, 0, -4, PI + .9); const kt = 3.93;
  if (L.T < kt - .15) { trick(me, BALL, L.T, ts, ['roll', 'step', 'elastico', 'step']); } else { applyPose(me, kickPose(clamp((L.T - (kt - .15)) / .3))); const a = loc(me, .5, 1.0, 1.4).toArray(), g = [BX, 2.2, -15.5]; const k = clamp((L.T - kt) / .2); const p = shotBall(BALL, a, g, .5, k, L.T); BZ.GO.userData.bulge(clamp((L.T - kt - .18) / .1) * (1 - clamp((L.T - kt - .4) / .4)));  }
  cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: L.T > kt ? 'grimace' : 'flat' });
  orb(L.k, V(BX - .6, 2.0, -6), null, [13, PI + 1.15, .12, 46], [11.5, PI + 1.05, .1, 46]); sh(V(BX, 0, -6), 30); }, [[0, 'flash', .4], [.62, 'trash_hit', .5]]);
// 5 «Denn hier steigt jede einzelne Nacht»: grúa sobre el pueblo de noche, ventanas de colores y fuegos artificiales
shot(4.13, 'Z', null, L => { street(); OR.FEST.visible = true; windows('party', L.T); party([...K, ...XT], L.T, V(0, 0, -30), 4.6, 0);
  fireworks(V(0, 0, -80), L.T, 3, 16); const k = easeInOut(L.k); cam([22 - k * 10, 48 - k * 18, 40 - k * 16], [0, 4, -40], 52); sh(V(0, 0, -40), 60); }, [[0, 'whoosh_up', .5], [.3, 'firework', .6], [.9, 'firework', .5], [1.4, 'cheer', .3]]);
// 6 «irgendwo eine Party»: fiesta en el jardín delantero de una casa: baile, globos, altavoz
shot(6.03, 'W', null, L => { street(); windows('party', L.T); const cx = -15.5, cz = 36;
  [K[2], K[5], XT[1], K[7], XT[2]].forEach((c, i) => { put(c, cx + (i % 2) * 1.2 - .6, 0, cz + 6 - i * 3, PI / 2 + (i % 2 ? -.3 : .3)); hat(c); dance(c, L.T, i * 1.7); grin(c, L.T); });
  confRain(V(cx, 0, cz), L.T, 40, 8, 14, 12); orb(L.k, V(cx, 3.4, cz + 1), null, [15, PI / 2 + .12, .2, 48], [13.5, PI / 2 + .05, .18, 48]); sh(V(cx, 0, cz), 30); }, [[0, 'swipe', .5], [.2, 'cheer', .4], [.8, 'laugh_m', .3]]);
// 7 «Poolpartys»: alguien salta en bomba a la piscina iluminada; otros con flotadores
shot(7.77, 'S', null, L => { use('GT'); night(60); const px = GX - 16, pz = 10;
  const j = put(K[1], px + 5.6, 0, pz + .6, -PI / 2); hat(j); saltar(j, L.lt, .05, { h: 1.6, dur: .45, base: [px + 5.6, 0, pz + .6] }); actuar(j, 0, [[0, 'cheer']], { T: L.T, weight: false, breathe: false }); grin(j, L.T);
  [XT[0], K[4]].forEach((c, i) => { put(c, px - 1.8 + i * 3.4, -1.6, pz - 1.4 + i, i ? -.4 : .4); hat(c); applyPose(c, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5 }); grin(c, L.T); show(FLOATS[i], c.root.position.x, 1.5, c.root.position.z); });
  show(FLOATS[2], px + 2, 1.5, pz + 2.6); FLOATS[2].rotation.x = 0; [0, 1, 2].forEach(i => FLOATS[i].rotation.set(PI / 2, 0, 0));
  
  orb(L.k, V(px + 3.2, 2.8, pz + .8), null, [17, -1.3, .2, 48], [15.5, -1.2, .2, 48]); sh(V(px, 0, pz), 30); }, [[0, 'swipe', .4], [.4, 'splash', .7], [.1, 'kids_laugh', .3]]);
// 8 «Pizzapartys»: mesa de la cocina llena de pizzas; tres amigos cogen porciones
shot(8.33, 'R', null, L => { use('KU'); inside(1.0, 60); const tx = KX - 5, tz = 2;
  show(PZ[2], tx - 2, 4.25, tz - .4, .1); show(PZ[3], tx + 1.8, 4.25, tz - .5, -.15);
  [[XT[3], -3.4, .3], [K[6], 3.4, -.3], [K[3], 0, 0]].forEach(([c, dx, ry], i) => { put(c, tx + dx, 0, tz + 3.6 + (i === 2 ? .8 : 0), ry); hat(c); actuar(c, L.lt, [[0, 'idle'], [.1 + i * .15, { aRx: 1.5, aRz: -.2, aRe: .6, lean: .2 }, { dur: .25 }], [.6 + i * .1, { aRx: 2.1, aRe: 1.9, aRz: -.3, headX: -.1 }, { dur: .3 }]], { T: L.T }); laughF(c, L.T); });
  { const c = K[3]; const w = loc(c, 0, 3.0, 1.9); show(PZ[3], w.x, w.y, w.z, 0, .95); } const s0 = K[6]; if (L.lt > .7) { const h = s0.aR.hand; attach(SLICE, h, [0, -.5, .3], [PI / 2, 0, 0], .9); }
  orb(L.k, V(tx, 3.8, tz + 2.6), null, [16, .08, .12, 48], [14.5, .03, .12, 48]); sh(V(tx, 0, tz), 30); }, [[0, 'whirl', .4], [.3, 'paper', .4], [.7, 'chew', .4], [.9, 'laugh_m', .3]]);
// 9 «Sogar eine Geburtstagsparty»: el salón de fiestas, tarta con velas, todos cantan alrededor
shot(9.59, 'Z', null, L => { use('SA'); inside(1.0, 40); SA.LC.forEach((l, i) => l.intensity = 50 + Math.sin(L.T * 6 + i) * 30); SA.DB.rotation.y = L.T;
  [XT[0], K[0], XT[4], K[5], XT[2]].forEach((c, i) => { put(c, AX - 6 + i * 3, 0, -1.8 + Math.abs(i - 2) * .4, PI + (i - 2) * .12); c.root.rotation.y = 0; hat(c); dance(c, L.T, i); grin(c, L.T); });
  SA.FB.userData.fish.userData.swim(L.T); SA.FB.userData.bubbles(L.T); confRain(V(AX, 0, -4), L.T, 50, 18, 10, 14);
  orb(L.k, V(AX, 4.4, -5), null, [20, 0, .1, 48], [17, 0, .1, 46]); sh(V(AX, 0, -5), 30); }, [[0, 'whoosh_up', .5], [.2, 'party_horn', .5], [.6, 'cheer', .35]]);
// 10 «für Herrn Blubb, den Goldfisch»: golpe de zoom a la pecera: el pez con su gorrito delante de la tarta
shot(10.89, 'C', 'punch', L => { use('SA'); inside(1.0, 50); SA.LC.forEach((l, i) => l.intensity = 50 + Math.sin(L.T * 6 + i) * 30); const f = SA.FB.userData.fish; f.userData.swim(L.T); f.userData.face(true); f.rotation.y = Math.sin(L.T * 1.3) * .3; SA.FB.userData.bubbles(L.T);
  const p = wpos(SA.FB); cam([p.x - 1.5 + L.k * .4, p.y + 2.8, p.z + 8.2 - L.k * 1.2], [p.x - .4, p.y + 2.2, p.z], 40); badge3('tag', 'HERR BLUBB', p.clone().add(V(0, 5.2, 0)), (L.lt - .25) * 3); sh(p, 20); }, [[0, 'impact_soft', .6], [.2, 'water_bloop', .5], [.6, 'sparkle', .4]]);
// 11 «Deshalb trainiert hier niemand»: el Bolzplatz de día, abandonado: conos tirados, un chico dormido con gorro de fiesta
shot(12.38, 'W', null, L => { bolz(false); BZ.CONES.forEach((c, i) => { c.rotation.set(i % 2 ? PI / 2 : 0, 0, i % 3 ? PI / 2 : 0); c.position.y = i % 2 || i % 3 ? .45 : .55; });
  const z = put(XT[2], BX + .5, .55, 2.4, 0); hat(z); applyPose(z, { aLx: .15, aLz: .35, aRx: 2.9, aRe: .4, lRx: .45, lRk: .7, headY: .35 }); z.root.rotation.set(-PI / 2, 0, 0); cara(z, L.T, { eyes: 'closed', mouth: 'wavy' });
  show(BALL, BX - 2.4, .3, .6); BALL.scale.set(1, .45, 1);
  orb(L.k, V(BX + .5, .8, .2), null, [12.5, .35, .62, 46], [11, .25, .66, 46]); sh(V(BX, 0, 0), 30); }, [[0, 'whoosh_soft', .4], [.3, 'snore', .5], [.9, 'wind', .3]]);
// 12 «Wozu auch?»: una chica con gorro de fiesta se encoge de hombros delante de la casa de la fiesta
shot(13.92, 'F', 'punch', L => { street(); OR.FEST.visible = true; windows('party', L.T); const c = put(K[4], -12.6, 0, 20, PI / 2 + .25); hat(c); actuar(c, L.lt, [[0, 'idle'], [.05, 'shrug', { dur: .3 }]], { T: L.T }); talk(c, L.T, 13.92, 14.7, 'smug');
  party([K[2], XT[1], K[7]], L.T, V(-17, 0, 24), 3.6, PI / 2);
  onFace(c, 9.5, -.2, -1.2, 40, L.k, 8.5); sh(V(-14, 0, 20), 30); }, [[0, 'flash', .4], [.15, 'hmm', .4]]);
// 13 «Morgen gibt's ja wieder eine Party»: cartel MORGEN PARTY! en una farola; un chico lo señala emocionado
shot(14.70, 'S', null, L => { street(); windows('party', L.T); show(POSTER, 9.4, 0, -4, -PI / 2 - .25);
  const c = put(K[1], 5.4, 0, -1.4, -PI / 2 + .9); hat(c); actuar(c, L.lt, [[0, 'idle'], [.1, 'point', { dur: .25 }], [.8, 'cheer', { dur: .3 }]], { T: L.T }); grin(c, L.T); saltar(c, L.lt, .8, { h: 1.2, dur: .4, base: [5.4, 0, -1.4] });
  orb(L.k, V(7.6, 4.2, -2.8), null, [17, -.65, .08, 46], [15.5, -.75, .08, 46]); sh(V(7, 0, -3), 30); }, [[0, 'swipe', .4], [.15, 'paper', .5], [.8, 'jump', .5], [.9, 'cheer', .3]]);
// ---------- b: Jonas, Gerda y la Oma de fiesta; yo entreno día tras día (16,15 – 28,02 s) ----------
const disco = (L, fill = 45) => { use('SA'); inside(.9, fill); SA.LI.intensity = 90; SA.LC.forEach((l, i) => l.intensity = 70 + Math.sin(L.T * 7 + i * 1.6) * 50); SA.DB.rotation.y = L.T * .8; SA.FB.userData.fish.userData.swim(L.T); };
// 14 «Mein bester Freund Jonas»: Jonas en la pista de baile del salón, cartel con su nombre
shot(16.15, 'W', null, L => { disco(L); const j = put(jonas, AX, 0, 5, 0); hat(j); dance(j, L.T, 0); talk(j, L.T, 99, 99, 'happy', { eyes: 'happy', mouth: 'open_smile' });
  [K[2], XT[1], K[5]].forEach((c, i) => { put(c, AX - 5 + i * 5, 0, 1 - (i % 2) * 1.5, (i - 1) * -.3); hat(c); dance(c, L.T, i * 2); grin(c, L.T); });
  orb(L.k, V(AX, 3.2, 4.4), null, [14, .12, .1, 44], [12, .05, .08, 44]); badge3('tag', 'JONAS', hp(j).add(V(0, 3.4, 0)), (L.lt - .2) * 3); sh(V(AX, 0, 4), 30); }, [[0, 'swipe', .5], [.25, 'pop', .5], [.6, 'party_horn', .4]]);
// 15 «geht auf jede Party»: Jonas salta del escenario sobre el público en la calle de la fiesta
shot(17.17, 'R', null, L => { street(); OR.FEST.visible = true; windows('party', L.T); party([K[0], K[3], XT[0], K[6], XT[3], K[7]], L.T, V(0, 0, -14), 4.0, 0);
  const j = put(jonas, 0, 0, -6, 0); hat(j); const sl = saltar(j, L.lt, .1, { h: 3.4, dur: .7, base: [0, 0, -6], dz: -3 }); applyPose(j, { aLx: 2.8, aRx: 2.8, aLz: .7, aRz: .7, lLk: .8, lRk: .3, lLx: .4 }); grin(j, L.T);
  confRain(V(0, 0, -9), L.T, 40, 14, 10, 14); orb(L.k, V(0, 4.8, -8), null, [19, -.2, .02, 48], [17, -.12, .02, 48]); sh(V(0, 0, -10), 30); }, [[0, 'whirl', .4], [.15, 'jump', .5], [.4, 'cheer', .5], [.9, 'land', .4]]);
// 16 «Meine Nachbarin Gerda»: Gerda sale por la puerta de su casa con gorro de fiesta, lista para salir
shot(18.53, 'Z', 'punch', L => { street(); windows('party', L.T); const g = caminar(gerda, L.lt, { x: 16, z: 4, ry: -PI / 2, speed: 2.6, accel: .2, T: L.T }); hat(gerda); grin(gerda, L.T);
  orb(L.k, V(14.6, 3.4, 4), null, [13, -PI / 2 + .15, .1, 44], [12, -PI / 2 + .1, .08, 44]); badge3('tag', 'GERDA', hp(gerda).add(V(0, 3.3, 0)), (L.lt - .15) * 3); sh(V(15, 0, 4), 30); }, [[0, 'zoom_in', .5], [.05, 'door_open', .5], [.2, 'steps', .4], [.3, 'pop', .4]]);
// 17 «geht auf jede Party»: Gerda baila bajo la bola de discoteca
shot(19.53, 'F', null, L => { disco(L); const g = put(gerda, AX + 1, 0, 4, -.2); hat(g); dance(g, L.T, 1, { aRx: 2.9 + Math.sin(L.T * 9) * .2, aRz: .2 }); cara(g, L.T, { eyes: 'happy', mouth: 'laugh' });
  [XT[2], K[4]].forEach((c, i) => { put(c, AX - 4 + i * 9, 0, 1.4, i ? -.5 : .5); hat(c); dance(c, L.T, i * 2.5); grin(c, L.T); });
  orb(L.k, V(AX + .6, 3.6, 3.6), null, [13, -.3, .16, 46], [12, -.38, .14, 46]); sh(V(AX, 0, 4), 30); }, [[0, 'flash', .4], [.2, 'cheer', .3], [.6, 'clap', .4]]);
// 18 «Sogar meine Oma geht hin» (zoom lento): la Oma se marca un baile en el centro y todos la jalean
shot(20.66, 'W', 'slow', L => { disco(L); const o = put(oma, AX, 0, 5.5, 0); hat(o); dance(o, L.T * 1.3, 0, { crouch: .25 + Math.abs(Math.sin(L.T * 11)) * .15, aLx: 2.0, aRx: 2.0 }); cara(o, L.T, { eyes: 'happy', mouth: 'open_smile' });
  [K[1], XT[0], K[6], XT[4]].forEach((c, i) => { put(c, AX - 5.5 + (i % 2) * 11, 0, 1.6 - (i > 1 ? 3 : 0), (i % 2 ? -.5 : .5)); hat(c); actuar(c, L.lt, [[0, 'cheer']], { T: L.T + i }); grin(c, L.T); });
  confRain(V(AX, 0, 4), L.T, 50, 14, 10, 14); orb(L.k, V(AX, 3.0, 5.2), null, [14, .02, .12, 44], [12.5, .0, .1, 44]); sh(V(AX, 0, 4), 30); }, [[0, 'swipe', .4], [.2, 'cheer', .4], [.7, 'kids_laugh', .3]]);
// 19 «jeden Dienstag»: la Oma enseña el calendario con el martes marcado: PARTY!
shot(22.14, 'C', 'punch', L => { use('OS'); inside(1.0, 60); const o = put(oma, OX - 2, 0, 4, .25); hat(o); actuar(o, L.lt, [[0, 'hold']], { T: L.T }); attach(CAL, o.aR.hand, [-1.1, -.9, .6], [-PI / 2 + .1, 0, 0], .75); CAL.rotation.set(0, 0, 0); CAL.position.set(-1.2, -.5, 1.1); applyPose(o, { aLx: 1.5, aRx: 1.5, aLz: -.1, aRz: -.1, aLe: .5, aRe: .5, headX: -.05 });
  const w = loc(o, -3.0, 3.4, .4); CAL.parent.remove(CAL); scene.add(CAL); show(CAL, w.x, w.y, w.z, .5, .7); applyPose(o, { aLx: 1.4, aLz: .5, aLe: .4, aRz: .1, aRe: .3 }); talk(o, L.T, 22.14, 23.01, 'happy');
  onFace(o, 13, -1.4, -1.6, 44, L.k, 12); sh(V(OX, 0, 4), 30); }, [[0, 'impact_soft', .5], [.15, 'paper', .5], [.4, 'laugh_old', .4]]);
// 20 «Aber ich nicht»: yo solo en el Bolzplatz de noche; al fondo, fuegos artificiales de la fiesta
shot(23.01, 'I', null, L => { bolz(); const me = put(ich, BX, 0, 3, PI - .15); holdBall(me, L.T); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' }); fireworks(V(BX, 0, -90), L.T, 2, 14);
  orb(L.k, V(BX, 2.8, 3), null, [11, PI + .55, .12, 44], [10, PI + .45, .1, 44]); sh(V(BX, 0, 3), 30); }, [[0, 'iris_pop', .5], [.2, 'firework', .3], [.4, 'wind', .3]]);
// 21 HUSS: toques bajo el foco, primer plano desde abajo
shot(23.92, 'W', null, L => { bolz(); const ts = hussIn(23.9, 25.0); const me = put(ich, BX, 0, 2, .2); const b = trick(me, BALL, L.T, ts, ['up', 'knee', 'up', 'knee', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); 
  orb(L.k, V(BX, 2.1, 2), null, [11.5, .3, .05, 46], [10.5, .5, .05, 46]); sh(V(BX, 0, 2), 30); }, [[0, 'swipe', .4]]);
// 22 HUSS: conducción entre los conos, travelling lateral
shot(24.40, 'S', null, L => { bolz(); const ts = hussIn(24.3, 25.0); const r = dribble(ich, BALL, L.lt, L.T, { x: BX, z: 12, ry: PI, speed: 10.5, ts, weave: 1.1 }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  cam([BX + 9, 2.8, r.z - 2], [BX, 1.7, r.z - .5], 48); sh(V(BX, 0, r.z), 30); }, [[0, 'whoosh_soft', .4], [.1, 'steps_run', .5]]);
// 23 «Tag für Tag»: de día, el sol en lo alto, sigo corriendo con el balón y el sudor me cae
shot(25.265, 'Z', null, L => { bolz(false); const me = put(ich, BX - 1, 0, 0, .3); const b = juggle(me, BALL, L.T, [25.3, 25.6, 25.9, 26.15], { h: 2.2 }); cara(me, L.T, { expr: 'determined', eyes: 'squint', mouth: 'grimace' }); sweat(me, L.T, 2);
  orb(L.k, V(BX - 1, 2.0, 0), null, [12, .55, .15, 46], [11, .7, .13, 46]); sh(V(BX, 0, 0), 30); }, [[0, 'zoom_in', .4], [.2, 'birds', .3], [.5, 'strain', .4]]);
// 24 HUSS: de día, toques mirando desde arriba
shot(26.33, 'W', null, L => { bolz(false); const ts = hussIn(26.3, 27.0); const me = put(ich, BX + 1, 0, 1, -.4); const b = trick(me, BALL, L.T, ts, ['rainbow', 'up', 'knee', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' }); sweat(me, L.T, 1);
  orb(L.k, V(BX + 1, 2.5, 1), null, [14, -.55, .12, 46], [13, -.4, .1, 46]); sh(V(BX, 0, 1), 30); }, [[0, 'swipe', .4]]);
// 25 HUSS: de noche otra vez, regateo hacia la portería
shot(26.99, 'F', null, L => { bolz(); const ts = hussIn(26.95, 27.5); const r = dribble(ich, BALL, L.lt, L.T, { x: BX - 2, z: 8, ry: PI + .15, speed: 11, ts, weave: .8 }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  cam([BX - 6.5, 2.6, r.z - 9], [r.x, 1.6, r.z], 48); sh(V(BX, 0, r.z), 30); }, [[0, 'flash', .3], [.1, 'steps_run', .5]]);
// 26 HUSS: tiro desde el borde del área y la red de la portería pequeña se hincha
shot(27.45, 'W', 'punch', L => { bolz(); const kt = 27.70; const me = put(ich, BX - .3, 0, 2, PI); applyPose(me, kickPose(clamp((L.T - (kt - .15)) / .3))); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  if (L.T < kt) { const w = loc(me, .5, .55 / .84, 1.4); show(BALL, w.x, .55, w.z); } else { const a = loc(me, .5, 1.0, 1.4).toArray(); const p = shotBall(BALL, a, [BX + 1.6, 2.4, -15.4], .8, clamp((L.T - kt) / .2), L.T); BZ.GO.userData.bulge(clamp((L.T - kt - .18) / .1)); }
  orb(L.k, V(BX - .3, 2.0, 1), null, [12, PI - .6, .12, 46], [11, PI - .7, .1, 46]); sh(V(BX, 0, -4), 30); }, [[0, 'swipe', .3], [.45, 'trash_hit', .5]]);
// ---------- c: el partido de la Sommerparty: se ríen de mí, 10:0, silencio y «während du gefeiert hast» (28,02 – 49,59 s) ----------
const fans = (T, mode = 'cheer', silent = false) => { CROWD.update(T, mode, silent); };
const FRONT = () => [K[0], XT[3], K[2], XT[1], K[5], XT[0], K[7], XT[2]];
const frontRow = (T, z0 = -6, expr = 'cheer') => FRONT().forEach((c, i) => { put(c, SX - 25.3, 1.6, z0 + i * 2.5, PI / 2); hat(c); if (expr === 'cheer') { actuar(c, 0, [[0, 'cheer']], { T: T + i }); grin(c, T); } else if (expr === 'laugh') { actuar(c, 0, [[0, i % 2 ? 'point' : { aLx: 1.2, aRx: 1.2, aLe: 1.8, aRe: 1.8, lean: .25 }]], { T: T + i }); laughF(c, T + i); } else { actuar(c, 0, [[0, 'shock']], { T: T + i }); cara(c, T, { expr: 'gasp', eyes: 'wide', mouth: 'o' }); } });
// 27 «Dann kam die größte Party des Jahres» (zoom lento): el estadio al atardecer, gradas llenas y fuegos artificiales
shot(28.02, 'Z', 'slow', L => { stadium(); fans(L.T); fireworks(V(SX, 0, -80), L.T, 3, 18); ST.SB.userData.set(0, 0);
  const k = easeInOut(L.k); cam([SX + 34 - k * 8, 40 - k * 14, 52 - k * 12], [SX - 8, 4, -6], 52); sh(V(SX - 10, 0, 0), 60); }, [[0, 'whoosh_up', .5], [.2, 'cheer', .6], [.5, 'firework', .5], [1.3, 'firework', .5]]);
// 28 «das Sommerparty-Fußballspiel»: la pancarta y los rivales calentando con gorro de fiesta
shot(30.33, 'W', null, L => { stadium(); fans(L.T); const kp = put(kap, SX - 11, 0, 1, PI / 2 - .7); hat(kp); const b = juggle(kp, BALL, L.T, [30.4, 30.75, 31.1, 31.45, 31.8, 32.15], { h: 2 }); grin(kp, L.T);
  const c = put(K[3], SX - 13, 0, -4.5, PI / 2 - .2); hat(c); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); grin(c, L.T);
  cam([SX + 2 - L.k * 2, 4.0, 6], [SX - 16, 6.4, -1], 50); sh(V(SX - 14, 0, 0), 40); }, [[0, 'swipe', .4], [.3, 'whistle', .5], [.8, 'cheer', .4]]);
// 29 «Alle kamen mit Partyhüten»: travelling por la grada: todos con gorro de fiesta
shot(32.19, 'S', null, L => { stadium(); fans(L.T); frontRow(L.T, -10); const z = lerp(-12, 4, easeInOut(L.k));
  cam([SX - 13, 5.4, z + 9], [SX - 26, 4.2, z + 2], 48); sh(V(SX - 26, 0, z), 30); }, [[0, 'whoosh_soft', .4], [.2, 'party_horn', .5], [.6, 'party_horn', .4], [.4, 'cheer', .4]]);
// 30 «Als ich aufs Feld lief»: salgo corriendo al campo, travelling de frente
shot(33.64, 'F', null, L => { stadium(); fans(L.T, 'sway'); const r = caminar(ich, L.lt, { x: SX + 4, z: -18, ry: .2, speed: 8, run: true, accel: .1, T: L.T }); cara(ich, L.T, { expr: 'determined', eyes: 'normal', mouth: 'smile' });
  cam([r.x + 1.5, 3.4, r.z + 10], [r.x, 2.6, r.z], 46); sh(V(r.x, 0, r.z), 30); }, [[0, 'flash', .3], [.05, 'steps_run', .6]]);
// 31 «lachten alle»: la primera fila se parte de risa y me señala
shot(34.68, 'C', 'punch', L => { stadium(); fans(L.T, 'sway'); frontRow(L.T, -4, 'laugh');
  cam([SX - 12, 4.6, 3], [SX - 25.3, 4.4, 1.4], 44); sh(V(SX - 25, 0, 2), 30); }, [[0, 'impact_soft', .4], [.05, 'laugh_m', .6], [.3, 'kids_laugh', .5]]);
// 32 «Wer ist denn der Kleine?»: el capitán rival se ríe y me señala desde arriba; yo de espaldas en primer término, pequeño
shot(35.41, 'W', null, L => { stadium(); fans(L.T, 'sway'); const kp = put(kap, SX + 1, 0, -10, PI - .1); hat(kp); actuar(kp, L.lt, [[0, 'idle'], [.1, { aRx: 1.2, aRz: -.1, aRe: .1, headX: .25, lean: -.08 }, { dur: .25 }]], { T: L.T }); talk(kp, L.T, 35.41, 36.67, 'happy', { eyes: 'happy' });
  const me = put(ich, SX + 2.6, 0, -15.6, .3); cara(me, L.T, { expr: 'worried' }); bubble(kp, 'HAHA!', (L.lt - .2) * 3, 2.2);
  cam([SX - .6, 1.8, -22], [SX + .6, 4.8, -10], 46); sh(V(SX, 0, -12), 30); }, [[0, 'swipe', .4], [.2, 'laugh_deep', .5]]);
// 33 «Dann bekam ich den Ball» (zoom lento): el balón llega rodando, lo paro con la suela y levanto la mirada
shot(36.67, 'Z', 'slow', L => { stadium(); fans(L.T, 'sway'); const me = put(ich, SX, 0, -8, 0); const arr = .55; const k = clamp(L.lt / arr);
  if (k < 1) { show(BALL, lerp(SX + 9, SX + .5, easeOut(k)), .55, lerp(-1, -6.6, easeOut(k))); BALL.rotation.set(L.T * 10, 0, 0); applyPose(me, { lRx: .5 * k, lRk: .3 * k, aLz: .3, aRz: .3 }); }
  else { const w = loc(me, .5, .55 / .84, 1.6); show(BALL, w.x, .55, w.z); applyPose(me, { lRx: .35, lRk: .6, crouch: .1, aLz: .4, aRz: .4, headX: lerp(.3, -.05, clamp((L.lt - .7) / .3)) }); }
  cara(me, L.T, { expr: 'determined', eyes: L.lt > .9 ? 'angry' : 'normal', mouth: 'flat' });
  orb(L.k, V(SX, 2.6, -8), null, [12, .25, .08, 46], [9.5, .18, .06, 44]); sh(V(SX, 0, -8), 30); }, [[.0, 'whoosh_soft', .4], [.5, 'kick', .5], [.6, 'murmur', .3]]);
// 34 HUSS: regateo: el primer rival se cae de culo
shot(37.93, 'W', null, L => { stadium(); fans(L.T, 'cheer'); const ts = hussIn(37.9, 38.39); const r = dribble(ich, BALL, L.lt, L.T, { x: SX, z: -8, ry: PI, speed: 11, ts, weave: 1.2 }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  const d = put(K[3], SX - .6, 0, -5.4, PI); hat(d); const f = clamp((L.lt - .2) / .25); applyPose(d, { lean: -1.1 * f, crouch: 1.3 * f, lLx: 1.4 * f, lRx: 1.6 * f, aLx: 1.6 * f, aRx: 1.9 * f, aLz: .5, aRz: .5 }); cara(d, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); if (f > .9) dust(V(SX + .8, 0, -12.5), L.t0 + .45, L.T, 6, .6);
  cam([SX + 15, 3.0, r.z + 1.4], [r.x - .6, 3.4, r.z + 1.2], 50); sh(V(SX, 0, r.z), 30); }, [[0, 'swipe', .3], [.42, 'land', .5]]);
// 35 HUSS: bicicleta y caño al capitán, que se queda girando
shot(38.39, 'R', null, L => { stadium(); fans(L.T, 'cheer'); const ts = hussIn(38.35, 38.84); const r = dribble(ich, BALL, L.lt, L.T, { x: SX - .6, z: -12, ry: PI + .1, speed: 10.5, ts, weave: 1.4 }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  const kp = put(kap, SX - .8, 0, -10.2, PI + L.lt * 7); hat(kp); applyPose(kp, { aLx: 1.0, aRx: 1.0, aLz: .9, aRz: .9, lean: -.2, lLx: .4, lRk: .5 }); cara(kp, L.T, { expr: 'shock', eyes: 'wide', mouth: 'grimace' });
  cam([SX + 15, 3.0, r.z + 1.3], [r.x - .6, 3.4, r.z + 1.1], 50); sh(V(SX, 0, r.z), 30); }, [[0, 'whirl', .4], [.3, 'whoosh', .4]]);
// 36 HUSS: plano cenital: corro hacia la portería dejando atrás a todos
shot(38.84, 'S', null, L => { stadium(); fans(L.T, 'cheer'); const ts = hussIn(38.8, 39.1); const r = dribble(ich, BALL, L.lt, L.T, { x: SX - 1, z: -17, ry: PI, speed: 12, ts }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  [K[3], kap, K[7]].forEach((c, i) => { caminar(c, L.lt, { x: SX - 4 + i * 3, z: -9 - i * 1.5, ry: PI, speed: 6, run: true, T: L.T }); hat(c); cara(c, L.T, { expr: 'shock' }); });
  cam([SX + 3, 15, r.z + 7], [r.x, 0, r.z - 3], 50); sh(V(SX, 0, r.z), 30); }, [[0, 'whoosh_soft', .4], [.05, 'crowd_run', .4]]);
// 37 HUSS: el tiro: el portero se lanza y no llega, la red se hincha
shot(39.05, 'F', 'punch', L => { stadium(); fans(L.T, L.T > 39.6 ? 'cheer' : 'sway'); const kt = 39.30; const me = put(ich, SX - 1, 0, -21, PI); applyPose(me, kickPose(clamp((L.T - (kt - .17)) / .32))); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  const gk = put(K[7], SX, 0, -33.5, 0); hat(gk); const dv = clamp((L.T - kt - .05) / .3); gk.root.position.set(SX - 3.6 * dv, 1.4 * Math.sin(dv * PI), -33.5); gk.root.rotation.set(0, 0, dv * 1.3); applyPose(gk, { aLx: 2.8, aRx: 2.8, aLz: .4, aRz: .2, lLx: .3 }); cara(gk, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  if (L.T < kt) { const w = loc(me, .5, .55 / .84, 1.4); show(BALL, w.x, .55, w.z); } else { const a = loc(me, .5, 1.0, 1.4).toArray(); shotBall(BALL, a, [SX + 3.4, 3.2, -37.6], .6, clamp((L.T - kt) / .26), L.T); ST.G1.userData.bulge(clamp((L.T - kt - .24) / .1)); }
  cam([SX + 4.5, 3.6, -14.5], [SX - .5, 2.2, -30], 48); sh(V(SX, 0, -28), 30); }, [[0, 'flash', .3], [.28, 'net', .7], [.3, 'cheer', .6], [.25, 'whistle', .4]]);
// 38 «Zehn Tore»: el marcador sube a toda velocidad hasta 10:0; yo lo celebro de rodillas
shot(39.72, 'Z', null, L => { stadium(); fans(L.T, 'cheer'); const n = Math.min(10, 1 + Math.floor(L.lt * 14)); ST.SB.userData.set(n, 0, n === 10 ? Math.sin(L.T * 20) : 0);
  const me = put(ich, SX + .5, 0, -27, PI); applyPose(me, { ...GEST.cheer, crouch: 1.0, lLx: 0, lLk: 1.5, lRx: 1.4, lRk: 1.5, hipY: 2.05 }); grin(me, L.T);
  confRain(V(SX, 0, -30), L.T, 60, 24, 16, 20); fireworks(V(SX, 0, -70), L.T, 2, 14);
  cam([SX + 1, 3.2 + L.k * .8, -12 + L.k], [SX, 12.5, -45], 54); sh(V(SX, 0, -30), 40); }, [[0, 'zoom_in', .4], [.05, 'ticks', .6], [.6, 'ding_reveal', .6], [.3, 'cheer', .5]]);
// 39 «Alle von mir»: me señalo con los pulgares el 10 de la camiseta
shot(40.54, 'C', 'punch', L => { stadium(); fans(L.T, 'cheer'); const me = put(ich, SX, 0, -20, .1); applyPose(me, { aLx: 1.0, aLz: -.65, aLe: 2.2, aRx: 1.0, aRz: -.65, aRe: 2.2, lean: -.12, headX: -.08 }); cara(me, L.T, { expr: 'smug', eyes: 'half', mouth: 'smirk' });
  confRain(V(SX, 0, -20), L.T, 40, 14, 10, 12); onFace(me, 9.4, -1.2, .9, 40, L.k, 8.5); sh(V(SX, 0, -20), 30); }, [[0, 'impact', .5], [.2, 'sparkle', .4]]);
// 40 «Die Musik verstummte»: el DJ levanta la aguja con cara de susto; rasgado de disco
shot(41.35, 'R', null, L => { stadium(); fans(L.T, 'still', true); const d = put(dj, SX + 27.6, 0, -6, -PI / 2); actuar(d, L.lt, [[0, { aLx: 1.4, aRx: 1.4, aLe: .9, aRe: .9, lean: .2 }], [.15, { aRx: 2.5, aRz: .4, aRe: .8, aLx: .8, aLz: .9, lean: -.12 }, { dur: .2 }]], { T: L.T }); cara(d, L.T, { expr: 'shock', eyes: 'wide', mouth: 'grimace' });
  ST.DJ.userData.decks.forEach((m, i) => m.rotation.y = L.lt < .15 ? L.T * 8 : 1.2 * 8 + i);
  orb(L.k, V(SX + 26.6, 4.4, -6), null, [15, -PI / 2 + .3, .22, 44], [14, -PI / 2 + .22, .2, 44]); sh(V(SX + 26, 0, -6), 30); }, [[0, 'whirl', .3], [.15, 'record_scratch', .8]]);
// 41 «Die ganze Menge war plötzlich still» (zoom lento): la grada entera con la boca abierta, sin moverse
shot(42.47, 'W', 'slow', L => { stadium(); fans(L.T, 'still', true); frontRow(L.T, -8, 'shock'); TINT = 'rgba(20,30,60,.12)';
  cam([SX - 9 + L.k * 2, 6.4, 1], [SX - 30, 6.6, -1], 46); sh(V(SX - 28, 0, 0), 40); }, [[0, 'swipe', .3], [.3, 'silence_tick', .5], [.9, 'cough', .4]]);
// 42 «Jonas kam zu mir und fragte»: Jonas (con gorro) cruza el campo hacia mí
shot(44.23, 'S', null, L => { stadium(); fans(L.T, 'still', true); const me = put(ich, SX + 1.6, 0, -18.6, -PI / 2 + .35); cara(me, L.T, { expr: 'neutral' }); applyPose(me, { aLz: .1, aRz: .1 });
  caminar(jonas, L.lt, { x: SX - 5.5, z: -19.6, ry: PI / 2 - .25, speed: 3.6, accel: .2, stopAt: 1.0, T: L.T }); hat(jonas); cara(jonas, L.T, { expr: 'gasp', eyes: 'wide', mouth: 'o' });
  orb(L.k, V(SX - .6, 3.0, -19), null, [21, -.05, .1, 46], [19.5, .0, .1, 46]); sh(V(SX, 0, -19), 30); }, [[0, 'whoosh_soft', .4], [.1, 'steps', .5]]);
// 43 «Seit wann bist du so gut?»: Jonas, de cerca, alucinando
shot(45.89, 'C', 'punch', L => { stadium(); fans(L.T, 'still', true); const j = put(jonas, SX - 1.2, 0, -19.4, PI / 2 + .45); hat(j); actuar(j, L.lt, [[0, 'shrug']], { T: L.T }); talk(j, L.T, 45.89, 47.18, 'gasp', { eyes: 'wide' });
  onFace(j, 10, -1, -1.0, 40, L.k, 9); sh(V(SX, 0, -19), 30); }, [[0, 'impact_soft', .4], [.1, 'gasp_f', .3]]);
// 44 «Ich sagte ihm die Wahrheit»: yo, tranquilo, le miro
shot(47.18, 'I', null, L => { stadium(); fans(L.T, 'still', true); const me = put(ich, SX + 2, 0, -18, -PI / 2 - .35); actuar(me, L.lt, [[0, 'idle']], { T: L.T }); talk(me, L.T, 47.18, 48.44, 'neutral');
  onFace(me, 9.6, -1, 1.0, 40, L.k, 9); sh(V(SX, 0, -18), 30); }, [[0, 'iris_pop', .4], [.3, 'wind', .3]]);
// 45 «Während du gefeiert hast»: sonrisa de lado y guiño; golpe de zoom
shot(48.44, 'Z', 'punch', L => { stadium(); fans(L.T, 'still', true); const me = put(ich, SX + 2, 0, -18, -PI / 2 - .35); actuar(me, L.lt, [[0, 'idle'], [.2, { aLx: 1.2, aLz: -.6, aLe: 2.1, headZ: .12 }, { dur: .3 }]], { T: L.T }); talk(me, L.T, 48.44, 49.59, 'smug', { eyes: L.lt > .55 ? 'wink' : 'half' });
  onFace(me, 7.6, -.6, .5, 38, L.k, 6.6); sh(V(SX, 0, -18), 30); }, [[0, 'impact', .5], [.6, 'sparkle', .4]]);
// ---------- d: la noche siguiente: silencio, HUSS en cada ventana, todos entrenan y yo soy el único invitado de Herr Blubb (49,59 s – fin) ----------
// 46 «In der nächsten Nacht lief ich durch die Stadt»: camino por la calle oscura, sin fiesta
shot(49.59, 'W', null, L => { street(); windows('dark', L.T); const r = caminar(ich, L.lt, { x: 1.2, z: -6, ry: 0, speed: 3.4, accel: .2, T: L.T }); cara(ich, L.T, { expr: 'neutral' });
  cam([r.x + 1.6, 4.0, r.z + 13], [r.x, 3.0, r.z - 1], 46); sh(V(r.x, 0, r.z), 30); }, [[0, 'swipe', .4], [.1, 'steps', .5], [.8, 'crickets', .4]]);
// 47 «und etwas stimmte nicht» (zoom lento): me paro y miro a los lados, desconfiado
shot(51.63, 'Z', 'slow', L => { street(); windows('dark', L.T); const me = put(ich, 1.2, 0, 1, -.1); actuar(me, L.lt, [[0, 'idle'], [.3, { headY: .7 }, { dur: .35 }], [.9, { headY: -.7 }, { dur: .35 }]], { T: L.T }); cara(me, L.T, { expr: 'sus', eyes: 'squint', mouth: 'wavy' });
  orb(L.k, V(1.2, 2.8, 1), null, [12.5, .12, .08, 44], [10, .08, .06, 42]); sh(V(1, 0, 1), 30); }, [[0, 'zoom_in', .3], [.4, 'owl', .3], [1.0, 'wind', .3]]);
// 48 «Keine Musik»: el jardín de la piscina vacío; los flotadores van a la deriva y el altavoz está apagado
shot(53.11, 'F', null, L => { use('GT'); night(40); const px = GX - 16, pz = 10; [0, 1, 2].forEach(i => { show(FLOATS[i], px - 2 + i * 2 + Math.sin(L.T * .6 + i) * .4, 1.5, pz - 1 + i * 1.1 + Math.cos(L.T * .5 + i) * .3); FLOATS[i].rotation.set(PI / 2, 0, 0); });
  orb(L.k, V(px, 1.6, pz), null, [14, PI - .4, .55, 44], [13, PI - .3, .55, 44]); sh(V(px, 0, pz), 30); }, [[0, 'flash', .3], [.2, 'crickets', .5], [.5, 'drip', .4]]);
// 49 «Keine Partylichter»: la pancarta GROSSES FEST y los banderines a oscuras; un globo desinflado cae
shot(54.01, 'S', null, L => { street(); windows('dark', L.T); OR.FEST.visible = true; DARK = .15;
  
  cam([2, 7.2, -18 + L.k * 2], [0, 10, -40], 46); sh(V(0, 0, -36), 30); }, [[0, 'whoosh_soft', .3], [.4, 'sad_tone', .4]]);
// 50 «Nichts»: mi cara, sorprendido
shot(55.30, 'C', 'punch', L => { street(); windows('dark', L.T); const me = put(ich, 1.2, 0, 1, .2); actuar(me, L.lt, [[0, 'shock']], { T: L.T }); cara(me, L.T, { expr: 'gasp', eyes: 'wide', mouth: 'o' });
  onFace(me, 7.6, -.5, .4, 38, L.k, 7); sh(V(1, 0, 1), 30); }, [[0, 'impact_soft', .5]]);
// 51 «Dann hörte ich es»: me llevo la mano a la oreja
shot(55.74, 'W', null, L => { street(); windows('warm', L.T); const me = put(ich, 1.2, 0, 1, .2); actuar(me, L.lt, [[0, 'idle'], [.1, 'listen', { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'confused', eyes: 'side_l', mouth: 'o' });
  orb(L.k, V(1.2, 3.0, 1), null, [11, .35, .1, 44], [10, .3, .1, 44]); sh(V(1, 0, 1), 30); }, [[0, 'swipe', .3], [.3, 'hmm', .3]]);
// 52 «aus jedem Fenster» (zoom lento): las ventanas de la casa se encienden una tras otra
shot(56.75, 'Z', 'slow', L => { street(); windows('sil', L.T); WIN.forEach((ps, i) => ps.forEach((m, j) => { m.visible = L.lt > (i * .7 + j * .23) % 1.2; }));
  cam([-5, 5.6, 48 - L.k * 2], [-18, 6.4, 36], 46); sh(V(-20, 0, 36), 30); }, [[0, 'zoom_in', .3], [.2, 'click_set', .4], [.6, 'click_set', .4], [1.0, 'click_set', .4]]);
// 53 HUSS: en la ventana, la silueta de alguien haciendo toques
shot(58.08, 'W', null, L => { street(); windows('sil', L.T); const w = wpos(WIN[0][2]); cam([w.x + 7.5, w.y - .8, w.z + 1.2 + L.k], [w.x, w.y - .2, w.z], 40); sh(V(-18, 0, 36), 30); }, [[0, 'swipe', .3]]);
// 54 HUSS: otra casa, todas las ventanas igual
shot(58.55, 'S', null, L => { street(); windows('sil', L.T); const w = wpos(WIN[1][0]); cam([w.x - 7.5, w.y + .4, w.z - 1.2 - L.k], [w.x, w.y, w.z], 40); sh(V(18, 0, 36), 30); }, [[0, 'swipe', .3]]);
// 55 HUSS: dron sobre la calle: el pueblo entero con las ventanas encendidas
shot(59.00, 'F', null, L => { street(); windows('sil', L.T); const k = easeOut(L.k); cam([0, 30 - k * 4, 46], [0, 4, -30], 50); sh(V(0, 0, -20), 60); }, [[0, 'flash', .3]]);
// 56 «Jonas übte Gitarre»: Jonas en su cuarto toca la guitarra eléctrica a tope
shot(59.505, 'W', null, L => { use('ZI'); inside(1.0, 60); const j = put(jonas, ZX - 2, 0, 1, .2); applyPose(j, { aLx: 1.2, aLz: -.4, aLe: 1.5, aRx: .9 + Math.sin(L.T * 22) * .15, aRz: -.4, aRe: 1.6, headX: .25 + Math.sin(L.T * 9) * .15, lean: .08 + Math.sin(L.T * 9) * .05, crouch: .1, lLx: .2 }); cara(j, L.T, { expr: 'determined', eyes: 'closed', mouth: 'grimace' });
  attach(GUIT, j.spine, [-.1, .9, 1.0], [0, 0, .9], .9); notes(hp(j).add(V(1.5, 1, 0)), L.T);
  orb(L.k, V(ZX - 2, 3.2, 1), null, [12, .3, .1, 44], [11, .2, .08, 44]); sh(V(ZX, 0, 0), 30); }, [[0, 'swipe', .3], [.05, 'guitar', .7], [.7, 'guitar', .6]]);
// 57 «Gerda boxte»: Gerda con guantes golpea el saco del garaje
shot(60.84, 'R', null, L => { use('GA'); inside(1.0, 50); const bx = RX + 1.5, bz = -6; show(BAG, bx, 9.6, bz); const hits = [.12, .38, .62, .86]; let sw = 0; hits.forEach(t => { const g = Math.exp(-Math.pow((L.lt - t - .08) / .1, 2)); sw = Math.max(sw, g); }); BAG.rotation.x = -sw * .18;
  const g = put(gerda, bx + 3.5, 0, bz, -PI / 2); GLV.forEach(x => x.visible = true); const ph = Math.sin(L.lt * PI / .25); applyPose(g, { aLx: 1.5 + Math.max(0, ph) * .2, aLe: Math.max(0, -ph) * 1.6 + .2, aRx: 1.5 + Math.max(0, -ph) * .2, aRe: Math.max(0, ph) * 1.6 + .2, aLz: -.2, aRz: -.2, twist: ph * .25, crouch: .2, lLx: .3, lRx: -.2, lean: .12 }); cara(g, L.T, { expr: 'angry', eyes: 'angry', mouth: 'grimace' }); sweat(g, L.T, 1);
  orb(L.k, V(bx + 1.8, 3.4, bz), null, [14, -.5, .12, 44], [13, -.4, .1, 44]); sh(V(bx, 0, bz), 30); }, [[0, 'whirl', .3], [.12, 'fist', .6], [.38, 'fist', .6], [.62, 'fist', .6], [.86, 'fist', .5]]);
// 58 «Und meine Oma machte Yoga»: la Oma en la postura del árbol sobre la esterilla, muy concentrada
shot(61.82, 'Z', null, L => { use('OS'); inside(1.0, 60); show(MAT, OX - 1, 0, 9.5, 0); const o = put(oma, OX - 1, .12, 9.5, 0); hat(o); const b = Math.sin(L.T * 2) * .03;
  applyPose(o, { aLx: 3.0, aRx: 3.0, aLz: -.25, aRz: -.25, aLe: .2, aRe: .2, lLx: .3, lLk: 2.2, sx: b, headX: -.05 }); o.lL.hp.rotation.z = -1.1; cara(o, L.T, { expr: 'relief', eyes: 'closed', mouth: 'smile' });
  orb(L.k, V(OX - 1, 2.8, 9.5), null, [12, -.25, .1, 44], [11, -.15, .08, 44]); sh(V(OX, 0, 9), 30); }, [[0, 'zoom_in', .3], [.2, 'breath', .5], [.8, 'chime', .4]]);
// 59 «Jetzt geht hier keiner mehr auf Partys»: alguien clava el cartel PARTY ABGESAGT delante de la casa de la fiesta
shot(63.42, 'W', null, L => { street(); windows('sil', L.T); show(ABG, -14.5, 0, 34, PI / 2); const c = put(K[5], -13.2, 0, 38.4, PI / 2 + .7); actuar(c, L.lt, [[0, 'idle'], [.2, 'point_l', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  orb(L.k, V(-14.0, 4.4, 35.6), null, [19, PI / 2 + .25, .08, 46], [17.5, PI / 2 + .15, .08, 46]); sh(V(-14, 0, 35), 30); }, [[0, 'swipe', .3], [.2, 'stamp', .6], [.6, 'stamp', .5]]);
// 60 «Die ganze Stadt trainiert»: la calle llena de gente corriendo y haciendo dominadas
shot(65.31, 'S', null, L => { street(); windows('sil', L.T); [K[0], XT[0], K[3], XT[3], K[6], XT[5], K[2]].forEach((c, i) => { caminar(c, L.lt, { x: -5 + (i % 4) * 3.4, z: -6 - Math.floor(i / 4) * 6 - (i % 2) * 2, ry: 0, speed: 6, run: true, accel: .05, T: L.T + i }); cara(c, L.T, { expr: 'determined' }); sweat(c, L.T, 0); });
  const pu = OR.BARS[2]; const bp = wpos(pu); const g = put(gerda, bp.x, 0, bp.z, PI / 2); const up = (Math.sin(L.T * 5) + 1) / 2; applyPose(g, { aLx: 3.05 - up * .45, aRx: 3.05 - up * .45, aLz: .2 + up * .5, aRz: .2 + up * .5, aLe: up * 2, aRe: up * 2, lLk: .8, lRk: .5 }); g.root.position.y = 7.4 - lerp(6.25, 4.6, up) * .92; cara(g, L.T, { expr: 'determined' });
  cam([2, 5.6, 14 - L.k * 2], [0, 3, -8], 48); sh(V(0, 0, -6), 30); }, [[0, 'whoosh_soft', .3], [.05, 'crowd_run', .5], [.6, 'strain', .4]]);
// 61 «Außer mir»: yo con gorro de fiesta y matasuegras
shot(66.83, 'C', 'punch', L => { street(); windows('sil', L.T); const me = put(ich, 1, 0, 2, 0); hat(me); actuar(me, L.lt, [[0, 'cheer']], { T: L.T }); grin(me, L.T); onFace(me, 8.6, -.6, .5, 40, L.k, 7.8); confetti(hp(me), L.t0 + .1, L.T, 40, .6); sh(V(1, 0, 2), 30); }, [[0, 'impact', .4], [.1, 'party_horn', .7]]);
// 62 «Jetzt bin ich der Einzige, der feiert»: bailo solo en el salón vacío bajo la bola de discoteca
shot(67.58, 'W', null, L => { use('SA'); inside(.9, 45); SA.LI.intensity = 90; SA.LC.forEach((l, i) => l.intensity = 70 + Math.sin(L.T * 7 + i * 1.6) * 50); SA.DB.rotation.y = L.T * .8; SA.FB.userData.fish.userData.swim(L.T);
  const me = put(ich, AX, 0, 4, .15); hat(me); dance(me, L.T, 0); grin(me, L.T); confRain(V(AX, 0, 3), L.T, 40, 16, 10, 14);
  orb(L.k, V(AX, 3.6, 3), null, [19, .05, .2, 48], [16, -.05, .18, 48]); sh(V(AX, 0, 2), 30); }, [[0, 'swipe', .3], [.2, 'party_horn', .4], [.8, 'clap', .4]]);
// 63 «Denn ich war der einzige Gast»: la mesa larga, yo solo al lado de la pecera, sillas vacías
shot(69.47, 'F', null, L => { use('SA'); inside(1.0, 50); SA.LC.forEach((l, i) => l.intensity = 50); const f = SA.FB.userData.fish; f.userData.swim(L.T); f.userData.face(true); SA.FB.userData.bubbles(L.T);
  const me = put(ich, AX - .6, 0, -2.6, -.15); hat(me); actuar(me, L.lt, [[0, 'idle'], [.1, { aLx: 1.6, aLe: 1.2, aLz: .2 }, { dur: .3 }]], { T: L.T }); grin(me, L.T);
  orb(L.k, V(AX, 4.4, -4), null, [19, .35, .18, 48], [17, .28, .16, 48]); sh(V(AX, 0, -5), 30); }, [[0, 'flash', .3], [.3, 'water_bloop', .4], [.8, 'party_horn', .4]]);
// 64 «auf Herrn Blubbs Geburtstag»: soplo las velas junto a Herr Blubb, que lleva su gorrito
shot(70.84, 'C', 'punch', L => { use('SA'); inside(1.0, 50); const f = SA.FB.userData.fish; f.userData.swim(L.T); f.userData.face(true); f.rotation.y = -.5; SA.FB.userData.bubbles(L.T); SA.CK.userData.FL.forEach(fl => fl.visible = L.lt < .7);
  const me = put(ich, AX - 8.2, 0, -4.6, .6); hat(me); applyPose(me, { lean: .2, headY: .6, aLz: .3, aRz: .3, aLx: .6, aRx: .6 }); cara(me, L.T, { eyes: 'closed', mouth: L.lt > .4 ? 'o' : 'smile' });
  const p = wpos(SA.CK); cam([p.x - 3.8, p.y + 1.2, p.z + 12], [p.x - 3.8, p.y + .4, p.z], 44); sh(p, 20); }, [[0, 'impact_soft', .4], [.45, 'blow', .6], [.8, 'clap', .4]]);
// 65 «Es war alles, was er sich je gewünscht hat» (zoom lento): Herr Blubb feliz, con corazones; yo abrazo la pecera
shot(72.34, 'Z', 'slow', L => { use('SA'); inside(1.0, 50); const f = SA.FB.userData.fish; f.userData.swim(L.T * 1.5); f.userData.face(true); f.rotation.y = Math.sin(L.T) * .25; SA.FB.userData.bubbles(L.T); const p = wpos(SA.FB);
  
  hearts(p.clone().add(V(0, 3.4, 0)), L.T); cam([p.x + 1.8, p.y + 2.2, p.z + 13 - L.k * 2], [p.x + 1.6, p.y + 1.2, p.z], 42); sh(p, 20); }, [[0, 'zoom_in', .3], [.3, 'sparkle', .5], [1.0, 'water_bloop', .4]]);
// 66 HUSS: toques en la fiesta; Herr Blubb mira desde la pecera
shot(74.66, 'W', null, L => { use('SA'); inside(.9, 45); SA.LC.forEach((l, i) => l.intensity = 70 + Math.sin(L.T * 7 + i * 1.6) * 50); SA.DB.rotation.y = L.T * .8; const f = SA.FB.userData.fish; f.userData.swim(L.T); f.userData.face(true);
  const ts = hussIn(74.6, 76); const me = put(ich, AX + 1, 0, 3, -.15); hat(me); const b = trick(me, BALL, L.T, ts, ['up', 'knee', 'rainbow', 'up'], { end: true, tail: .9 }); grin(me, L.T); confRain(V(AX, 0, 2), L.T, 40, 14, 10, 14);
  orb(L.k, V(AX + 1, 2.4, 3), null, [14, -.1, .12, 48], [12.5, -.05, .1, 48]); sh(V(AX, 0, 0), 30); }, [[0, 'swipe', .3], [.6, 'cheer', .3]]);


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); } });
HUSS.forEach(t => CUES.push({ t: +(t - .01).toFixed(3), s: 'kick', g: .8 }));
CUES.push({ t: 0, s: 'zoom_fast', g: .9 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD_.length = 0; s.fn(L);
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud'].includes(c.s) && T - c.t < .16) sh_ = Math.max(sh_, 1 - (T - c.t) / .16); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.5; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, MODE === 'night' ? 'noche' : 'polvo', MODE === 'in' ? .3 : .4);
  if (BIRDS.update) BIRDS.update(T, camera.position.clone().addScaledVector(dir, 60).add(V(0, 25, 0)), (MODE === 'day' || MODE === 'sunset') && BIRDSON ? 1 : 0);
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
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { renderer, composer, bloom, sun, grade, scene, camera };

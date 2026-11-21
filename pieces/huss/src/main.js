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
//@@PLANOS@@

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

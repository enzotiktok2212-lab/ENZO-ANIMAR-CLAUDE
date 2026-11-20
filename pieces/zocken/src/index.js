// ZOCKEN — «In dieser Stadt zockt jeder GTA 6, außer mir» (tercera entrega del HUSS): planos sincronizados con audio/words.json (1080×1920, 30 fps).
// Réplica de la estructura del vídeo de referencia (todos juegan, yo entreno → reto de Kickelsdorf → 10:4 → el pueblo juega al fútbol, yo me quedo en el sofá)
// con otra ciudad, otro reparto y otros datos. Multitudes solo con personajes Roblox reales (makeExtra). Planos en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT } from './props.js';
import { makeOma, makeKumpel, makeMama, makeMayor } from './gvolk.js';
import { ort, signBoard } from './wsets.js';
import { omaStube } from './svsets.js';
import { makeHuss, makeGerda, makeKapitaen, gloves } from './hvolk.js';
import { football, stadion, bolzplatz } from './hsets.js';
import { dackel } from './esets.js';
import { makeExtra } from './ecast.js';
import { makeMalte, makeBaecker, makePostbote, makeGegner } from './zcast.js';
import { viceScreen, logoTex, screen, zockerhalle, kirchfeld, tram, rails, controller, tv, letterBig, teamBus, wohnzimmer, baeckerei, glowM } from './zsets.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 111.6, U = W / 720;
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
// el juego en todas las pantallas (una textura animada compartida) y el logo
const VICE = viceScreen(512, 288), VICE2 = viceScreen(512, 288);
const ZX = 600, BX = 1000, KX = 1400, SX = 1800, OX = 2200, MX = 2600, HX = 3000, BKX = 3400;
const OR = ort(scene), ZH = zockerhalle(scene, ZX, VICE), BZ = bolzplatz(scene, BX), KF = kirchfeld(scene, KX), ST = stadion(scene, SX), OS = omaStube(scene, OX);
const MZ = wohnzimmer(scene, MX, VICE2.tex, '#9ad87a', '#8ac86a', 0x2a6ad8), HZ = wohnzimmer(scene, HX, VICE.tex, '#7ab8f4', '#6aa8e8', 0xd8323a), BK = baeckerei(scene, BKX, VICE.tex);
const OTV = tv(OS.g, VICE2.tex, 4, -9, -.25, 9);   // tele de la abuela
const SETS = { OR: OR.G, ZH: ZH.g, BZ: BZ.g, KF: KF.g, ST: ST.g, OS: OS.g, MZ: MZ.g, HZ: HZ.g, BK: BK.g };
for (const k in SETS) outline(SETS[k], 1.4);
OR.zoo.visible = false;
// tranvía en la calle (vía en x = -3,5)
const TRAM = tram(scene); outline(TRAM, 1.4); const RAIL = rails(OR.G, -3.5, 120, -260);
// ---------- reparto ----------
const ich = makeHuss(scene), malte = makeMalte(scene), bernd = makeBaecker(scene), post = makePostbote(scene), oma = makeOma(scene), mama = makeMama(scene), mayor = makeMayor(scene), tw = makeGerda(scene), kap = makeKapitaen(scene);
kitFace(ich, 'kid'); kitFace(malte, 'kid'); kitFace(bernd, 'mustache'); kitFace(post, 'hero'); kitFace(oma, 'girl'); kitFace(mama, 'girl'); kitFace(mayor, 'mustache'); kitFace(tw, 'girl'); kitFace(kap, 'villain');
const K = Array.from({ length: 5 }, (_, i) => makeKumpel(scene, i)); K.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'plain', 'girl'][i]));
const OPP = Array.from({ length: 10 }, (_, i) => makeGegner(scene, i)); OPP.forEach((c, i) => kitFace(c, ["hero", "plain", "kid", "villain"][i % 4]));
const EX = Array.from({ length: 36 }, (_, i) => makeExtra(scene, i)); EX.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'girl', 'mustache', 'girl'][i % 6]));
const TEAM = [malte, bernd, post, oma, tw, ...K];   // los 10 mejores jugones + yo
const POOL = [ich, malte, bernd, post, oma, mama, mayor, tw, kap, ...K, ...OPP, ...EX]; POOL.forEach(c => outline(c.root, 2));
const GLV = gloves(tw); GLV.forEach(g => g.visible = false);
// ---------- atrezo ----------
const BALL = football(scene, .55), BALL2 = football(scene, .55); outline(BALL, 1.6); outline(BALL2, 1.6);
const TRL = Array.from({ length: 7 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.5, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .4 * (1 - i / 7), depthWrite: false })); m.renderOrder = 2; scene.add(m); return m; });
const PAD = Array.from({ length: 40 }, (_, i) => { const c = controller(scene, [0x1a1a24, 0xf4f4f4, 0x1a1a24, 0xd8323a][i % 4]); outline(c, 1); return c; });
const LET = letterBig(scene); const BUS = teamBus(scene); outline(BUS, 1.4); const DOG = dackel(scene); outline(DOG, 1.4);
const STICK = (() => { const g = new THREE.Group(); scene.add(g); const s = cyl(.08, .1, 2.4, mat(0x8a5a2a), 6, g, 0, 0, 0); s.rotation.z = Math.PI / 2; outline(g, 1); return g; })();
const PEN = (() => { const g = new THREE.Group(); scene.add(g); const s = cyl(.06, .06, 1.2, mat(0x1a1a2a), 6, g, 0, 0, 0); s.rotation.x = Math.PI / 2; return g; })();
const AUTO = textPlane(2.4, 1.6, 240, 160, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a2a6a'; c.lineWidth = 5; c.beginPath(); c.moveTo(20, 110); c.bezierCurveTo(60, 20, 80, 140, 120, 60); c.bezierCurveTo(150, 20, 170, 120, 220, 70); c.stroke(); c.fillStyle = '#d8323a'; c.font = `700 30px ${FONT}`; c.textAlign = 'center'; c.fillText('Nr. 10', w / 2, 140); }); AUTO.material.side = THREE.DoubleSide; scene.add(AUTO);
const WHISTLE = (() => { const g = new THREE.Group(); scene.add(g); box(.5, .3, .3, mat(0xc8ccd8, { metalness: .8, roughness: .2 }), .1, g, 0, 0, 0); return g; })();
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const FW = Array.from({ length: 60 }, (_, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(.5, 6, 4), new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL((i % 6) / 6, 1, .6).multiplyScalar(2.5), toneMapped: false })); scene.add(s); return s; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 2 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const NOTES = Array.from({ length: 4 }, (_, i) => { const p = textPlane(1.4, 1.4, 64, 64, (c, w, h) => { c.font = `700 56px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 8; c.strokeStyle = '#1a1a2a'; c.strokeText(i % 2 ? '♪' : '♫', w / 2, h / 2); c.fillStyle = '#ffd23f'; c.fillText(i % 2 ? '♪' : '♫', w / 2, h / 2); }); p.material.depthWrite = false; scene.add(p); return p; });
const HEARTS = Array.from({ length: 5 }, () => { const p = textPlane(1.2, 1.2, 64, 64, (c, w, h) => { c.fillStyle = '#ff3a6a'; c.beginPath(); c.moveTo(32, 54); c.bezierCurveTo(0, 30, 8, 4, 32, 18); c.bezierCurveTo(56, 4, 64, 30, 32, 54); c.fill(); }); p.material.depthWrite = false; scene.add(p); return p; });
const PROPS = [...TRL, BALL, BALL2, ...PAD, LET, BUS, DOG, STICK, PEN, AUTO, WHISTLE, TRAM, ...CONF, ...FW, ...DUST, ...SWEAT, ...TEAR, ...NOTES, ...HEARTS];
const CROWD = { update() {} };
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
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene && !GLV.includes(p)) { p.parent.remove(p); scene.add(p); } }
  BZ.SPOT.intensity = 0; SPOTL.intensity = 0; OR.FEST.visible = false; ST.SB.userData.set(0, 0); ST.G1.userData.bulge(0); ST.G2.userData.bulge(0); BZ.GO.userData.bulge(0); GLV.forEach(g => g.visible = false); VMODE = 'game'; VMODE2 = 'game'; BUS.userData.door.position.x = 2.53;
  ZH.LP.intensity = 110; ZH.LC.intensity = 110;
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
const KEY = /^(Stadt|GTA|6|mir|HUSS|Fußball|Bäcker|Postbote|Oma|Controllern|Controller|Keiner|leer|Straßenbahn|einzigen|Fahrgast|ich|allein|Bolzplatz|Kirche|700|Mauer|sechs|Malte|Digga|Autos|klauen|klau|Ball|Mama|online|Genau|draußen|Dackel|Stöckchen|Zocken|Laternen|Brief|Kickelsdorf|elf|Stadion|nagelneues|Bürgermeister|Panik|Tür|Hand|zehn|Zocker|Sechs|Tage|Training|rennen|Sprinttaste|Spieltag|Tribüne|lachten|Wartezimmer|Anpfiff|X|Pause|respawnt|Torwart|Bus|sieben|null|vier|jeden|einzelnen|Ziel|Tore|Eins|Fünf|Zehn|Autogramm|gewannen|hoch|weinte|weg|neuen|endlich|Hause|Sofa|zocke|Allein)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: /HUSS/.test(t) ? 'HUSS!' : t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0, VMODE = 'game', VMODE2 = 'game'; const COVERS = [];
// el pueblo (OR, x = 0): calle x ∈ [-8, 8] (tranvía en x = -3,5), aceras hasta ±12,6, casas en x = ±24,5 (fachada en ±18) cada 22 desde z = 36
const street = (m = 'day') => { use('OR'); m === 'night' ? night(40) : m === 'sunset' ? sunset() : day(); };
// Bolzplatz (BX): jaula de goma 28 × 36, portería pequeña en z = -14, foco nocturno
const bolz = (n = true) => { use('BZ'); if (n) { night(30); BZ.SPOT.intensity = 120; bloom.threshold = .92; } else day(); };
// campo de la iglesia (KX): muro en z = -10, iglesia detrás, conos z ∈ [-1, 12]
const kirch = (m = 'day') => { use('KF'); m === 'sunset' ? sunset() : m === 'night' ? night(40) : day(); };
// estadio (SX): campo x ∈ ±20, z ∈ ±35; portería G1 en z = -35 (nosotros atacamos hacia G2, z = +35); gradas a la izquierda (x < -22)
const stadium = () => { use('ST'); day(); sun.intensity = 2.6; };
// Zockerhalle (ZX): oscura con neón; pantallas por todas partes
const halle = () => { use('ZH'); inside(.6, 0); renderer.toneMappingExposure = .92; bloom.strength = .22; bloom.threshold = .95; };
const room = (k, h = .95) => { use(k); inside(h, 40); };
// ---------- poses ----------
// sentado (asiento a ~1,15) jugando: pulgares a toda velocidad, cabeza hacia la pantalla
const seatP = (T, i = 0, f = 1) => ({ lLx: 1.45, lRx: 1.45, lLk: 1.45, lRk: 1.45, hipY: 1.55, aLx: 1.05, aRx: 1.05, aLz: -.42, aRz: -.42, aLe: 1.25, aRe: 1.25, lean: .12 + Math.sin(T * 7 + i) * .04 * f, headX: .12 + Math.sin(T * 5 + i) * .05 * f, headY: Math.sin(T * 2 + i) * .12 * f, twist: Math.sin(T * 3.3 + i) * .06 * f });
// de pie jugando con el mando
const standPadP = (T, i = 0) => ({ aLx: 1.05, aRx: 1.05, aLz: -.42, aRz: -.42, aLe: 1.3, aRe: 1.3, lean: .1, headX: .22 + Math.sin(T * 5 + i) * .05, headY: Math.sin(T * 2 + i) * .1, crouch: .05 });
// mando entre las dos manos del personaje (k = índice de mando)
function padAt(ch, k, tilt = -.7) { ch.root.updateMatrixWorld(true); const a = ch.aL.hand.getWorldPosition(V()), b = ch.aR.hand.getWorldPosition(V()), m = a.add(b).multiplyScalar(.5);
  const p = PAD[k]; show(p, m.x, m.y + .15, m.z, ch.root.rotation.y, ch.spec.scale || 1); p.rotation.set(tilt, ch.root.rotation.y, 0, 'YXZ'); return p; }
const gamer = (ch, x, y, z, ry, T, i, k, expr = 'determined', f = 1) => { put(ch, x, y, z, ry); applyPose(ch, seatP(T, i, f)); padAt(ch, k);
  if (expr === 'laugh') laughF(ch, T + i); else cara(ch, T + i, { expr, mouth: expr === 'joy' ? 'open_smile' : expr === 'determined' ? (Math.sin(T * 3 + i) > .3 ? 'grimace' : 'flat') : 'o' }); return ch; };
const padStand = (ch, x, z, ry, T, i, k, expr = 'determined') => { put(ch, x, 0, z, ry); applyPose(ch, standPadP(T, i)); padAt(ch, k); cara(ch, T + i, { expr, mouth: expr === 'joy' ? 'open_smile' : 'flat' }); return ch; };
// la sala llena: extras sentados en los sillones gamer (se saltan los índices de 'skip')
function hallCrowd(L, n = 18, skip = [], expr = null) { let k = 0; ZH.CH.forEach((c, i) => { if (k >= n || skip.includes(i)) return; const e = EX[k]; gamer(e, c.x, 0, c.z, (c.x - ZX) * -.012, L.T, k * 1.7, k + 4, expr || ['determined', 'joy', 'determined', 'laugh', 'shock'][k % 5]); k++; }); }
// grada (a la izquierda del campo): extras de pie animando en los escalones; zc = centro en z, rows = filas
function tribune(L, zc, n = 24, rows = 4, mode = 'cheer', list = EX) { for (let i = 0; i < n; i++) { const c = list[i % list.length], r = i % rows, k = Math.floor(i / rows), per = Math.ceil(n / rows);
  const x = SX - 24 - r * 2.6, y = 1.6 + r * 1.6, z = zc + (k - per / 2) * 2.3 + (r % 2) * 1.1; put(c, x, y, z, PI / 2 + Math.sin(i * 1.7) * .2);
  if (mode === 'cheer') { const b = Math.sin(L.T * 9 + i * 1.3); applyPose(c, { aLx: 2.7 + b * .3, aRx: 2.7 - b * .3, aLz: .4, aRz: .4, aLe: .3, aRe: .3, crouch: .05 + Math.abs(b) * .1 }); laughF(c, L.T + i); }
  else if (mode === 'laugh') { applyPose(c, { aLx: .6, aRx: .6, aLz: -.3, aRz: -.3, aLe: 1.6, aRe: 1.6, lean: .2 + Math.abs(Math.sin(L.T * 12 + i)) * .1, headX: .1 }); laughF(c, L.T + i); }
  else if (mode === 'shock') { applyPose(c, GEST.hands_head); cara(c, L.T + i, { expr: 'shock', mouth: 'o' }); }
  else { applyPose(c, { aLx: .3, aRx: .3, aLz: .1, aRz: .1, headY: Math.sin(L.T + i) * .2 }); cara(c, L.T + i, { expr: 'happy', mouth: 'smile' }); } } }
// bailando / animando de pie
const cheerP = (T, i = 0) => { const b = Math.sin(T * 9 + i); return { aLx: 2.7 + b * .3, aRx: 2.7 - b * .3, aLz: .4, aRz: .4, aLe: .3, aRe: .3, crouch: .06 + Math.abs(b) * .1, lLk: Math.max(0, b) * .3, lRk: Math.max(0, -b) * .3 }; };
const runP = (T, i = 0, sp = 13) => { const s = Math.sin(T * sp + i); return { aLx: -s * 1.1, aRx: s * 1.1, aLe: 1.3, aRe: 1.3, lLx: s * .9, lRx: -s * .9, lLk: Math.max(0, -s) * 1.2 + .2, lRk: Math.max(0, s) * 1.2 + .2, lean: .25, hipY: 2.05 + Math.abs(Math.cos(T * sp + i)) * .25 - .1 }; };
const walkP = (T, i = 0, sp = 8) => { const s = Math.sin(T * sp + i); return { aLx: -s * .55, aRx: s * .55, aLe: .3, aRe: .3, lLx: s * .5, lRx: -s * .5, lLk: Math.max(0, -s) * .5, lRk: Math.max(0, s) * .5, lean: .05, hipY: 2.05 + Math.abs(Math.cos(T * sp + i)) * .08 }; };
const tearsF = (ch, T) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < 2; i++) { const k = (T * 1.1 + i * .5) % 1; TEAR[i].visible = true; TEAR[i].position.copy(h).add(V((i ? -.3 : .3) * s, (.75 - k * 1.1) * s, .7 * s)); } };
// el tranvía recorre la calle de -z a +z (posición z en el tiempo T)
const tramAt = (z, ry = 0) => show(TRAM, -3.5, 0, z, ry);
// colgado de la barra de dominadas: e = flexión de codos (0 colgado, 1 barbilla en la barra). Las manos quedan en la barra.
function hang(ch, x, z, e, T) { put(ch, x, 0, z, 0); applyPose(ch, { aLx: 3.05, aRx: 3.05, aLz: .32, aRz: .32, aLe: e * 2.1, aRe: e * 2.1, lLk: .5, lRk: .5, lLx: .25, lRx: .1, headX: -.15, lean: -.05 });
  ch.root.updateMatrixWorld(true); const hy = Math.max(ch.aL.hand.getWorldPosition(V()).y, ch.aR.hand.getWorldPosition(V()).y); ch.root.position.y = ZH.BAR_Y - hy + .1; return ch; }
// flexión: q 0 arriba … 1 abajo; tumbado mirando al suelo hacia +z (cabeza en +z), manos en el suelo
function pushup(ch, x, z, q, T) { put(ch, x, 0, z, 0); const ang = lerp(1.22, 1.42, q); ch.root.rotation.set(ang, 0, 0); applyPose(ch, { aLx: lerp(1.75, 2.45, q), aRx: lerp(1.75, 2.45, q), aLz: .18, aRz: .18, aLe: lerp(.05, 1.4, q), aRe: lerp(.05, 1.4, q), headX: -.55 });
  ch.root.updateMatrixWorld(true); const hy = Math.min(ch.aL.hand.getWorldPosition(V()).y, ch.aR.hand.getWorldPosition(V()).y); ch.root.position.y = Math.max(0, .35 - hy) ; return ch; }
// contador grande
const score = (a, b, k = 1, y = .17) => badge('big', `${a} : ${b}`, W / 2, H * y, k, 1, .95);
// ---------- a: gancho, todos juegan, la ciudad vacía, mi entrenamiento (0 – 25,59 s) ----------
const tsH = (a, b) => hussIn(a, b);
const ballUnder = (ch) => { applyPose(ch, { aRx: .35, aRz: .15, aRe: 1.6, aLz: .15, aLe: .3, headX: .02 }); const w = loc(ch, 1.2, 2.55, .45); show(BALL, w.x, w.y, w.z); return w; };
// 1 «In dieser Stadt zockt» (zoom lento): la Zockerhalle llena de jugones y pantallas del juego; yo en el centro haciendo flexiones y, de golpe, dominadas
shot(0, 'F', 'slow', L => { halle(); VMODE = 'both'; hallCrowd(L, 18);
  const t = L.lt; if (t < .5) { pushup(ich, ZX, -3.2, (Math.sin(t * 19 - 1.5) + 1) / 2, L.T); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); }
  else if (t < .66) { const k = (t - .5) / .16; put(ich, ZX, k * 2.2, -4, 0); applyPose(ich, { aLx: lerp(1, 3.05, k), aRx: lerp(1, 3.05, k), aLz: .32, aRz: .32, lLk: .4, lRk: .4, crouch: (1 - k) * .4 }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' }); }
  else { const e = (Math.sin((t - .66) * 15 - 1.5) + 1) / 2; hang(ich, ZX, -4, e, L.T); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: e > .5 ? 'grimace' : 'flat' }); sweat(ich, L.T, 2); }
  orb(L.k, V(ZX, lerp(2.6, 6.4, clamp((L.lt - .35) / .4)), -3.6), null, [21, .12, .08, 50], [14, .04, .06, 46]); sh(V(ZX, 0, -2), 30); },
  [[0, 'crowd_murmur', .4], [.05, 'game_beep', .4], [.15, 'grunt', .4], [.35, 'grunt', .4], [.55, 'whoosh', .4], [.7, 'metal_clank', .5], [.95, 'grunt', .4], [1.15, 'grunt', .4]]);
// 2 «jeder GTA 6,»: fila de jugones machacando los mandos; detrás, la gran pantalla con el logo
shot(1.33, 'W', null, L => { halle(); VMODE = 'logo'; const r = ZH.CH; [0, 3, 6].forEach((ci, j) => { const c = r[ci]; gamer(EX[j], c.x, 0, c.z, -.15, L.T, j * 1.7, j + 4, ['determined', 'joy', 'laugh'][j]); });
  [9, 12, 15].forEach((ci, j) => { const c = r[ci]; gamer(EX[3 + j], c.x, 0, c.z, .15, L.T, j * 2.3, j + 8, ['laugh', 'determined', 'joy'][j]); });
  cam([ZX - 2 - L.k * 1.5, 4.4, 9 - L.k], [ZX - 10, 3.2, -6], 46); sh(V(ZX, 0, -6), 30); }, [[0, 'swipe', .4], [.1, 'button_mash', .6], [.6, 'game_engine', .4]]);
// 3 «außer mir.»: yo fuera, en la calle vacía al atardecer, con el balón bajo el brazo; en las ventanas, el brillo de las teles
shot(2.43, 'C', 'punch', L => { street('sunset'); const me = put(ich, 0, 0, 6, 0); ballUnder(me); cara(me, L.T, { expr: 'smug', eyes: 'half', mouth: 'smirk' });
  onFace(me, 8.4, -.3, .7, 40, L.k, 7.6); sh(V(0, 0, 4), 30); }, [[0, 'thump', .6], [.2, 'wind', .3]]);
// 4–7 HUSS ×8: trucos en mitad de la calle vacía (frontal, cenital, lateral, cara)
shot(3.40, 'W', null, L => { street('sunset'); const me = put(ich, 0, 0, 2, .1); trick(me, BALL, L.T, tsH(3.3, 5.7), ['roll', 'step', 'elastico', 'up', 'knee', 'up', 'rainbow', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  orb(L.k, V(0, 1.9, 2), null, [11.5, .2, .06, 46], [10.5, .45, .06, 46]); sh(V(0, 0, 2), 30); }, [[0, 'swipe', .4]]);
shot(4.03, null, null, L => { street('sunset'); const me = put(ich, 0, 0, 2, 0); const b = trick(me, BALL, L.T, tsH(3.3, 5.7), ['roll', 'step', 'elastico', 'up', 'knee', 'up', 'rainbow', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  cam([.6, 9.8 - L.k, 4.6], [0, 1, 2.6], 46); sh(V(0, 0, 2), 30); });
shot(4.52, 'C', null, L => { street('sunset'); const me = put(ich, 0, 0, 2, .2); trick(me, BALL, L.T, tsH(3.3, 5.7), ['roll', 'step', 'elastico', 'up', 'knee', 'up', 'rainbow', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  orb(L.k, V(0, 2.2, 2), null, [10, 1.35, .1, 46], [9.4, 1.15, .12, 46]); sh(V(0, 0, 2), 30); });
shot(5.08, null, null, L => { street('sunset'); const me = put(ich, 0, 0, 2, 0); trick(me, BALL, L.T, tsH(3.3, 5.7), ['roll', 'step', 'elastico', 'up', 'knee', 'up', 'rainbow', 'up'], { end: true }); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); sweat(me, L.T, 2);
  onFace(me, 7.8, -.2, 1.2, 40, L.k, 6.8); sh(V(0, 0, 2), 30); });
// 8 «Ich spiele Fußball.»: el tiro a la portería del Bolzplatz; la red se hincha
shot(5.70, 'Z', null, L => { bolz(false); const me = put(ich, BX + .5, 0, 2, PI); const kt = 6.12; const k = clamp((L.T - (kt - .25)) / .4); applyPose(me, kickPose(k));
  const a = loc(me, .5, 1.0, 1.4).toArray(), g = [BX, 2.2, -15.5]; if (L.T < kt) show(BALL, a[0], .55, a[2]); else shotBall(BALL, a, g, .6, clamp((L.T - kt) / .25), L.T); BZ.GO.userData.bulge(clamp((L.T - kt - .22) / .1) * (1 - clamp((L.T - kt - .5) / .4)));
  cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: L.T > kt ? 'grimace' : 'flat' }); orb(L.k, V(BX, 2.4, -2), null, [13, PI - .5, .14, 46], [11, PI - .35, .12, 46]); sh(V(BX, 0, -4), 30); },
  [[0, 'swoosh', .4], [.42, 'kick', .7], [.7, 'net', .6]]);
// 9 «Der Bäcker zockt GTA.»: Bernd juega detrás del mostrador; una clienta espera con el monedero
shot(6.85, 'S', null, L => { room('BK'); VMODE = 'game'; padStand(bernd, BKX, -3, 0, L.T, 0, 1, 'joy'); const cl = put(EX[20], BKX + 3.4, 0, 4.2, PI + .5); actuar(cl, 0, [[0, 'cross']], { T: L.T }); cara(cl, L.T, { expr: 'angry', mouth: 'frown' });
  orb(L.k, V(BKX, 4.6, -1.6), null, [14, -.35, .14, 46], [12.5, -.2, .12, 46]); sh(V(BKX, 0, 0), 20); }, [[0, 'swipe', .4], [.1, 'shop_bell', .5], [.5, 'button_mash', .5]]);
// 10 «GTA.»: primer plano de Bernd con la tele del juego detrás, el pan humeando
shot(7.57, 'C', 'punch', L => { room('BK'); VMODE = 'game'; padStand(bernd, BKX, -3, 0, L.T, 0, 1, 'laugh'); laughF(bernd, L.T);
  onFace(bernd, 7.8, .6, -.6, 40, L.k, 6.8); sh(V(BKX, 0, 0), 20); }, [[0, 'thump', .5], [.2, 'game_engine', .4]]);
// 11 «Der Postbote»: Ömer con el mando en mitad de la calle; las cartas se le caen de la cartera
shot(8.24, 'W', null, L => { street(); const p = padStand(post, 3, 8, -.2, L.T, 0, 3, 'joy'); for (let i = 0; i < 4; i++) { const k = ((L.lt * 1.4 + i * .25) % 1); }
  [0, 1, 2].forEach(i => { const e = EX[30 + i]; }); show(LET, 4.6, .05, 9.4, .4, .5); LET.rotation.x = -PI / 2;
  orb(L.k, V(3, 3.6, 8), null, [12, .55, .12, 46], [10.5, .3, .1, 46]); sh(V(3, 0, 8), 30); }, [[0, 'swipe', .4], [.2, 'paper', .5], [.5, 'button_mash', .4]]);
// 12 «zockt GTA.»: cara del cartero absorto en el juego
shot(8.90, 'C', null, L => { street(); padStand(post, 3, 8, -.2, L.T, 0, 3, 'shock'); cara(post, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  onFace(post, 7.4, .5, .8, 40, L.k, 6.6); sh(V(3, 0, 8), 30); }, [[0, 'thump', .4], [.3, 'game_beep', .5]]);
// 13 «Meine Oma zockt»: la abuela en su sillón con un mando en cada mano
shot(9.86, 'Z', null, L => { room('OS'); VMODE2 = 'game'; const o = gamer(oma, OX - 6, 2.3, -3, .5, L.T, 0, 2, 'joy'); applyPose(o, { ...seatP(L.T, 0), aLz: .15, aRz: .15, aLx: 1.2, aRx: 1.2, aLe: 1.1, aRe: 1.1 });
  [o.aL.hand, o.aR.hand].forEach((h, j) => { const w = h.getWorldPosition(V()); show(PAD[2 + j * 30], w.x, w.y + .1, w.z, .5, .84); PAD[2 + j * 30].rotation.set(-.7, .5, 0, 'YXZ'); }); grin(o, L.T);
  orb(L.k, V(OX - 6, 5.6, -3), null, [12, .5, .22, 44], [10, .45, .2, 44]); sh(V(OX - 4, 0, -3), 20); }, [[0, 'swoosh', .4], [.2, 'button_mash', .5], [.5, 'oma_laugh', .4]]);
// 14 «mit zwei Controllern.»: plano cenital de las manos de la abuela con los dos mandos y el 2
shot(10.72, 'C', 'punch', L => { room('OS'); VMODE2 = 'game'; const o = gamer(oma, OX - 6, 2.3, -3, .5, L.T, 0, 2, 'joy'); applyPose(o, { ...seatP(L.T, 0), aLz: .15, aRz: .15, aLx: 1.2, aRx: 1.2, aLe: 1.1, aRe: 1.1 });
  [o.aL.hand, o.aR.hand].forEach((h, j) => { const w = h.getWorldPosition(V()); show(PAD[2 + j * 30], w.x, w.y + .1, w.z, .5, .84); PAD[2 + j * 30].rotation.set(-.7 + Math.sin(L.T * 20 + j) * .08, .5, 0, 'YXZ'); }); laughF(o, L.T);
  show(DOG, OX - 2.6, 0, .4, -.6, 1); orb(L.k, V(OX - 5.8, 5.2, -2.8), null, [8.4, .5, .4, 44], [7.6, .5, .38, 44]); badge('gold', '2', W / 2, H * .17, clamp(L.lt / .2)); sh(V(OX - 4, 0, -3), 20); }, [[0, 'impact', .5], [.15, 'pop', .5], [.4, 'button_mash', .5]]);
// 15 «Keiner geht mehr raus.»: grúa sobre la calle vacía, solo el viento y una hoja
shot(11.92, 'W', 'slow', L => { street(); const k = easeInOut(L.k); cam([8 - k * 4, 26 - k * 10, 46 - k * 10], [0, 3, -20], 50); sh(V(0, 0, 0), 60); }, [[0, 'wind', .6], [.4, 'crickets', .3]]);
// 16 «Die Straßen sind leer.»: plano bajo, el balón solo en mitad de la calle, nadie en las aceras
shot(13.12, 'S', null, L => { street(); show(BALL, .8 - L.k * 1.6, .55, 10); BALL.rotation.set(0, 0, L.T * 3); cam([2.4 - L.k, 1.2, 18], [0, 2, 0], 46); sh(V(0, 0, 4), 40); }, [[0, 'swipe', .4], [.3, 'ball_roll', .5]]);
// 17 «Die Straßenbahn fährt»: el tranvía entra en plano por la vía
shot(14.39, 'Z', null, L => { street(); tramAt(-60 + L.lt * 34); orb(L.k, V(-3.5, 4, -40 + L.lt * 20), null, [24, .75, .12, 48], [22, .55, .1, 48]); sh(V(-3.5, 0, -40), 40); }, [[0, 'tram_bell', .7], [.2, 'tram', .6]]);
// 18 «ohne einen einzigen»: por la ventana: asientos vacíos; el conductor solo, con el mando
shot(15.57, 'W', null, L => { street(); tramAt(-28 + L.lt * 8); const d = padStand(EX[21], -3.5, -20.5 + L.lt * 8, 0, L.T, 0, 6, 'joy'); d.root.position.y = 1.4; padAt(d, 6);
  cam([5, 4.8, -12 + L.lt * 8], [-3.5, 4, -28 + L.lt * 8], 48); sh(V(-3.5, 0, -30), 30); }, [[0, 'swipe', .4], [.2, 'tram', .5]]);
// 19 «Fahrgast»: el contador de pasajeros: 0
shot(16.27, 'C', 'punch', L => { street(); tramAt(-6 + L.lt * 6); cam([5, 4.8, 10 + L.lt * 5], [-3.5, 4, -6 + L.lt * 6], 48); badge('red', '0 Fahrgäste', W / 2, H * .2, clamp(L.lt / .2), 1, .8); sh(V(-3.5, 0, -6), 30); }, [[0, 'thump', .5], [.1, 'buzzer', .4]]);
// 20 «durch die Stadt.»: dron sobre el tranvía cruzando el pueblo vacío
shot(16.71, 'R', null, L => { street(); tramAt(20 + L.lt * 22); const k = easeInOut(L.k); cam([18 - k * 6, 30 - k * 4, 60 + k * 10], [-3.5, 2, 20 + L.lt * 22], 50); sh(V(0, 0, 30), 60); }, [[0, 'whoosh', .4], [.2, 'tram', .5]]);
// 21 «Und ich?»: yo, primer plano, con el balón; mirada decidida
shot(17.46, 'C', 'punch', L => { kirch(); const me = put(ich, KX, 0, 4, 0); ballUnder(me); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' }); onFace(me, 7.6, -.2, -.6, 40, L.k, 6.8); sh(V(KX, 0, 4), 30); }, [[0, 'impact', .6]]);
// 22 «Jeden Tag allein»: plano general: yo solo haciendo toques delante del muro, la iglesia detrás
shot(18.07, 'W', null, L => { kirch(); const me = put(ich, KX, 0, -2, 0); juggle(me, BALL, L.T, [18.2, 18.5, 18.8, 19.1, 19.4], { h: 2.2 }); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  orb(L.k, V(KX, 5, -6), null, [26, .25, .2, 50], [22, .1, .16, 50]); sh(V(KX, 0, -4), 40); }, [[0, 'swipe', .4], [.13, 'kick', .3], [.43, 'kick', .3], [.73, 'kick', .3], [1.0, 'church_bell', .4]]);
// 23 «auf dem Bolzplatz»: travelling bajo junto a los conos mientras conduzco el balón
shot(19.17, 'S', null, L => { kirch(); const r = dribble(ich, BALL, L.lt, L.T, { x: KX - 2, z: 12, ry: PI, speed: 7, ts: [19.25, 19.5, 19.75], weave: .8 }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  const p = ich.root.position; cam([p.x + 6, 2.2, p.z - 5], [p.x, 2.2, p.z], 46); sh(V(KX, 0, 6), 30); }, [[0, 'swipe', .4], [.1, 'kick', .3], [.35, 'kick', .3]]);
// 24 «hinter der Kirche.»: desde lo alto de la torre: el campo detrás de la iglesia y yo solo abajo
shot(19.65, 'Z', null, L => { kirch(); const me = put(ich, KX, 0, 2, PI); juggle(me, BALL, L.T, [19.7, 20.0, 20.3], { h: 2 }); const k = easeInOut(L.k);
  cam([KX + 2, 34 - k * 4, -18 + k * 4], [KX, 2, 4], 48); sh(V(KX, 0, -10), 50); }, [[0, 'whoosh', .4], [.2, 'church_bell', .5]]);
// 25 «700 Schüsse»: tiro contra el muro; el 700 sale del impacto
shot(20.58, 'C', 'punch', L => { kirch(); const me = put(ich, KX + 1, 0, 4, PI); const kt = 20.86; const k = clamp((L.T - (kt - .25)) / .4); applyPose(me, kickPose(k)); const a = loc(me, .5, 1.0, 1.4).toArray(), g = [KX + .5, 2.4, -9.4];
  if (L.T < kt) show(BALL, a[0], .55, a[2]); else { const q = clamp((L.T - kt) / .22); shotBall(BALL, a, g, .3, q, L.T); if (q >= 1) dust(V(KX + .5, 1.4, -9), kt + .22, L.T, 8, .5); }
  cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); orb(L.k, V(KX, 3.4, -2), null, [15, .4, .14, 46], [13, .3, .12, 46]); badge('gold', '700', W / 2, H * .17, clamp((L.T - kt) / .2), 1, 1.1); sh(V(KX, 0, -2), 30); }, [[0, 'impact', .5], [.28, 'kick', .7], [.5, 'wall_hit', .7], [.55, 'pop', .4]]);
// 26 «gegen die Mauer,»: el balón golpea el muro una y otra vez (marcas, polvo)
shot(21.42, 'W', null, L => { kirch(); const me = put(ich, KX - .5, 0, 3, PI); const per = .42, ph = (L.lt % per) / per; applyPose(me, kickPose(clamp(ph * 1.6)));
  const a = loc(me, .5, 1.0, 1.4).toArray(), g = [KX - 1 + Math.sin(Math.floor(L.lt / per) * 2) * 2, 2.2, -9.4]; const q = clamp((ph - .35) / .35); if (q <= 0) show(BALL, a[0], .55, a[2]); else shotBall(BALL, a, g, .2, q < 1 ? q : 1 - (q - 1), L.T);
  cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); cam([KX + 6, 3.4, -6.6], [KX - .5, 2.4, -1], 46); sh(V(KX, 0, -4), 30); }, [[0, 'swipe', .4], [.2, 'wall_hit', .5], [.62, 'wall_hit', .5]]);
// 27 «jeden Morgen um sechs.»: amanecer, el reloj de la iglesia marca las seis; yo ya entrenando
shot(22.26, 'F', null, L => { kirch('sunset'); const me = put(ich, KX, 0, -6, 0); juggle(me, BALL, L.T, [22.3, 22.6, 22.9, 23.2], { h: 2.2 }); cara(me, L.T, { expr: 'determined', eyes: 'half', mouth: 'flat' });
  const k = easeInOut(L.k); cam([KX + 3, 3.6, 14 - k * 2], [KX, 9 + k * 2, -30], 48); badge('gold', '6:00', W / 2, H * .15, clamp(L.lt / .2), 1, .9); sh(V(KX, 0, -10), 50); }, [[0, 'flash', .4], [.1, 'church_bell', .7], [.4, 'rooster', .4]]);
// 28–31 HUSS ×7: trucos contra el muro (frontal, lateral, cenital, cara)
shot(23.40, 'W', null, L => { kirch(); const me = put(ich, KX, 0, -3, .15); trick(me, BALL, L.T, tsH(23.3, 25.6), ['elastico', 'up', 'knee', 'step', 'roll', 'up', 'rainbow']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  orb(L.k, V(KX, 2, -3), null, [11, .25, .08, 46], [10, .5, .06, 46]); sh(V(KX, 0, -3), 30); }, [[0, 'swipe', .4]]);
shot(24.05, 'C', null, L => { kirch(); const me = put(ich, KX, 0, -3, .15); trick(me, BALL, L.T, tsH(23.3, 25.6), ['elastico', 'up', 'knee', 'step', 'roll', 'up', 'rainbow']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  orb(L.k, V(KX, 2.2, -3), null, [10, -1.3, .12, 46], [9.4, -1.1, .1, 46]); sh(V(KX, 0, -3), 30); });
shot(24.60, null, null, L => { kirch(); const me = put(ich, KX, 0, -3, .15); trick(me, BALL, L.T, tsH(23.3, 25.6), ['elastico', 'up', 'knee', 'step', 'roll', 'up', 'rainbow']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  cam([KX + .5, 10 - L.k, -.6], [KX, 1, -2.4], 46); sh(V(KX, 0, -3), 30); });
shot(25.18, 'C', null, L => { kirch(); const me = put(ich, KX, 0, -3, .15); trick(me, BALL, L.T, tsH(23.3, 25.6), ['elastico', 'up', 'knee', 'step', 'roll', 'up', 'rainbow'], { end: true }); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); sweat(me, L.T, 2);
  onFace(me, 7.4, -.2, 1.2, 40, L.k, 6.6); sh(V(KX, 0, -3), 30); });
// ---------- b: Malte, mamá, el dackel, las farolas, la carta, el reto, el alcalde (25,59 – 57,05 s) ----------
// 32 «Mein Kumpel Malte sagt:»: Malte en su sofá verde, cascos puestos, jugando
shot(25.59, 'W', null, L => { room('MZ'); VMODE2 = 'game'; gamer(malte, MX, 0, 3.2, PI, L.T, 0, 0, 'joy'); orb(L.k, V(MX, 3.4, 3.2), null, [13, PI + .35, .12, 46], [11.5, PI + .2, .1, 46]); sh(V(MX, 0, 0), 20); }, [[0, 'swipe', .4], [.2, 'button_mash', .5]]);
// 33 «„Digga, in GTA»: primer plano de Malte hablando sin dejar el mando
shot(26.58, 'C', 'punch', L => { room('MZ'); VMODE2 = 'game'; gamer(malte, MX, 0, 3.2, PI, L.T, 0, 0, 'joy'); talk(malte, L.T, 26.58, 28.68, 'smug'); onFace(malte, 6.8, .2, .5, 40, L.k, 6); sh(V(MX, 0, 0), 20); }, [[0, 'thump', .5]]);
// 34 «kannst du Autos klauen.“»: la tele de Malte: el deportivo del juego; Malte al lado, alucinando
shot(27.56, 'Z', null, L => { room('MZ'); VMODE2 = 'game'; gamer(malte, MX, 0, 3.2, PI, L.T, 0, 0, 'joy'); laughF(malte, L.T); cam([MX - 4, 5.2, 7 - L.k], [MX + .5, 5.6, -9.6], 46); badge('tag', 'AUTO GEKLAUT!', W / 2, H * .2, clamp(L.lt / .2)); sh(V(MX, 0, 0), 20); }, [[0, 'swoosh', .4], [.2, 'car_rev', .6], [.6, 'tires', .4]]);
// 35 «Ich sage:»: yo en la puerta del salón de Malte con el balón
shot(28.68, 'S', null, L => { room('MZ'); gamer(malte, MX - 1.5, 0, 3.2, PI, L.T, 0, 0, 'joy'); const me = put(ich, MX + 7, 0, 1, PI + .4); ballUnder(me); talk(me, L.T, 28.68, 29.4, 'smug');
  onFace(me, 8.6, 0, .6, 42, L.k, 7.6); sh(V(MX, 0, 0), 20); }, [[0, 'swipe', .4], [.2, 'door', .4]]);
// 36 «„Im Fußball klau ich dir den Ball.“»: en la calle, le robo el balón a Malte de un caño
shot(29.46, 'W', null, L => { street(); const m = put(malte, -1.6, 0, 0, PI / 2); const me = put(ich, 2.6, 0, .4, -PI / 2); applyPose(m, { aLx: .6, aRx: .6, aLz: .3, aRz: .3, headX: .45 }); cara(m, L.T, { expr: 'shock', mouth: 'o' });
  const ts = [29.7, 30.1, 30.5]; trick(me, BALL, L.T, ts, ['step', 'roll', 'elastico']); talk(me, L.T, 29.46, 30.92, 'smug'); orb(L.k, V(2.4, 2.8, 0), null, [12, .1, .1, 46], [10.5, -.15, .08, 46]); sh(V(2, 0, 0), 30); },
  [[0, 'swipe', .4], [.24, 'kick', .4], [.64, 'kick', .4], [1.0, 'whoosh', .4]]);
// 37 «Mama ruft:»: mamá en la puerta de casa, llamando con la mano
shot(31.16, 'Z', null, L => { street('sunset'); const m = put(mama, -16.6, 0, 37, PI / 2 - .3); actuar(m, L.lt, [[0, 'wave', { dur: .4 }]], { T: L.T }); talk(m, L.T, 31.16, 33.46, 'shout');
  orb(L.k, V(-16.6, 4, 37), null, [11.5, PI / 2 + .2, .1, 44], [10, PI / 2 + .05, .1, 44]); sh(V(-16, 0, 37), 30); }, [[0, 'swoosh', .4], [.1, 'door', .5]]);
// 38 «„Komm rein, alle sind online!“»: mamá con la tableta: 2.340 vecinos online
shot(31.89, 'C', null, L => { street('sunset'); const m = put(mama, -16.6, 0, 37, PI / 2 - .3); actuar(m, 0, [[0, { aRx: .8, aRz: -.3, aRe: 1.0, aLx: .8, aLz: -.3, aLe: 1.0 }]], { T: L.T }); talk(m, L.T, 31.16, 33.46, 'happy');
  padAt(m, 7, -.2); onFace(m, 7.6, .2, -.6, 40, L.k, 6.8); badge('green', '● 2.340 online', W / 2, H * .18, clamp((L.T - 32.53) / .2), 1, .7); sh(V(-16, 0, 37), 30); }, [[0, 'thump', .4], [.65, 'notif', .5]]);
// 39 «Genau.»: yo asiento, sonrisa de lado
shot(33.46, 'C', 'punch', L => { street('sunset'); const me = put(ich, -10, 0, 34, -PI / 2 + .3); ballUnder(me); applyPose(me, { headX: .25 * Math.sin(L.lt * 18) }); cara(me, L.T, { expr: 'smug', eyes: 'half', mouth: 'smirk' }); onFace(me, 6.6, -.2, .4, 40, L.k, 6); sh(V(-10, 0, 34), 30); }, [[0, 'impact', .5]]);
// 40 «Deshalb bin ich draußen.»: me doy la vuelta y sigo con mis toques en la acera; mamá se lleva las manos a la cabeza
shot(33.97, 'W', null, L => { street('sunset'); const m = put(mama, -16.6, 0, 37, PI / 2 - .3); applyPose(m, GEST.facepalm || GEST.hands_head); cara(m, L.T, { expr: 'sad', mouth: 'frown' });
  const me = put(ich, -9, 0, 30, .3); juggle(me, BALL, L.T, [34.05, 34.35, 34.65, 34.95], { h: 2.2 }); cara(me, L.T, { expr: 'happy', mouth: 'smile' });
  orb(L.k, V(-11, 3.6, 32), null, [16, .55, .12, 48], [14, .4, .1, 48]); sh(V(-12, 0, 32), 30); }, [[0, 'swipe', .4], [.1, 'kick', .3], [.4, 'kick', .3], [.7, 'kick', .3], [.3, 'sigh', .4]]);
// 41 «Sogar mein Dackel»: lanzo un palo; el dackel ni se mueve
shot(35.10, 'S', null, L => { street(); const me = put(ich, 6, 0, 20, -.4); const k = clamp(L.lt / .35); applyPose(me, { aRx: lerp(-.4, 2.6, k < .6 ? 0 : (k - .6) / .4) , aRz: .2, aRe: .3, lean: .1 }); cara(me, L.T, { expr: 'happy', mouth: 'open_smile' });
  if (L.lt > .3) { const q = clamp((L.lt - .3) / .7); const p = arc([5.4, 4.5, 20], [1, .2, 12], 3, q); show(STICK, p.x, p.y, p.z, q * 6, 1); } else { const w = me.aR.hand.getWorldPosition(V()); show(STICK, w.x, w.y, w.z, 0, 1); }
  show(DOG, 3, 0, 22, .6, 1.2); orb(L.k, V(4.6, 2.8, 20), null, [14, .3, .1, 46], [12, .15, .1, 46]); sh(V(4, 0, 18), 30); }, [[0, 'swipe', .4], [.35, 'whoosh', .5], [.9, 'stick_drop', .4]]);
// 42 «holt keine Stöckchen mehr.»: el dackel bosteza tumbado junto al palo
shot(36.22, 'C', null, L => { street(); show(DOG, 1.2, 0, 14, -.3, 1.3); show(STICK, 1, .2, 12, .4, 1); cam([3.6, 3.2, 27 - L.k], [1.2, 1, 14], 42); badge('red', '✗', W / 2, H * .2, clamp(L.lt / .2)); sh(V(1, 0, 13), 20); }, [[0, 'thump', .4], [.2, 'dog_whine', .5]]);
// 43 «Er schaut jetzt Oma beim Zocken zu.»: el dackel sentado junto al sillón de la abuela, mirando la tele
shot(37.02, 'W', null, L => { room('OS'); VMODE2 = 'game'; gamer(oma, OX - 6, 2.3, -3, .5, L.T, 0, 2, 'joy'); show(DOG, OX - 3.6, 0, -1, -.2 + Math.sin(L.T * 3) * .1, 1.1);
  orb(L.k, V(OX - 5, 5, -2), null, [14, .5, .24, 44], [12, .45, .22, 44]); sh(V(OX - 4, 0, -3), 20); }, [[0, 'swipe', .4], [.3, 'game_beep', .5], [.9, 'dog_bark', .3]]);
// 44 «Jeden Abend trainiere ich,»: atardecer; yo contra el muro, sombra alargada
shot(38.77, 'Z', null, L => { kirch('sunset'); const me = put(ich, KX, 0, -3, .1); trick(me, BALL, L.T, [38.9, 39.2, 39.5, 39.8], ['up', 'knee', 'up', 'step']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  orb(L.k, V(KX, 2.4, -3), null, [15, -.5, .14, 48], [13, -.3, .12, 48]); sh(V(KX, 0, -3), 30); }, [[0, 'swoosh', .4], [.13, 'kick', .3], [.43, 'kick', .3], [.73, 'kick', .3]]);
// 45 «bis die Laternen angehen.»: las farolas de la calle se encienden una a una
shot(40.05, 'F', null, L => { street('night'); FILL.intensity = 20; const me = put(ich, 8, 0, -8, -.3); juggle(me, BALL, L.T, [40.1, 40.4, 40.7], { h: 2.2 }); cara(me, L.T, { expr: 'determined', mouth: 'flat' });
  SPOTL.position.set(9.2 - 1.6, 10, -11); SPOTL.target.position.set(8, 0, -8); SPOTL.intensity = L.T > 40.4 ? 70 : 0; const k = easeInOut(L.k); cam([-2, 5, 8 - k * 2], [7, 5, -14], 48); sh(V(8, 0, -8), 30); }, [[0, 'flash', .4], [.35, 'lamp_on', .7]]);
// 46 «Dann trainiere ich unter den Laternen.»: de noche, bajo el cono de luz, sigo con los toques
shot(41.31, 'W', null, L => { street('night'); SPOTL.position.set(7.6, 10, -11); SPOTL.target.position.set(8, 0, -8); SPOTL.intensity = 70; const me = put(ich, 8, 0, -8, .2);
  trick(me, BALL, L.T, [41.45, 41.75, 42.05, 42.35, 42.65], ['up', 'knee', 'up', 'rainbow', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); sweat(me, L.T, 2);
  orb(L.k, V(8, 2.6, -8), null, [12, -.5, .14, 46], [10, -.35, .12, 46]); sh(V(8, 0, -8), 30); }, [[0, 'swipe', .4], [.14, 'kick', .3], [.44, 'kick', .3], [.74, 'kick', .3], [1.04, 'kick', .3]]);
// 47 «Dann kam der Brief.» (zoom lento): el cartero, sin soltar el mando, deja caer una carta roja a mis pies
shot(42.98, 'Z', 'slow', L => { street(); const p = padStand(post, 1.5, 4, -.4, L.T, 0, 3, 'joy'); const me = put(ich, -1.6, 0, 6.6, .9); applyPose(me, GEST.shock); cara(me, L.T, { expr: 'shock', mouth: 'o' }); show(BALL, -2.6, .55, 7.8);
  const q = clamp(L.lt / .6); show(LET, lerp(.4, -.4, q), lerp(4, .1, easeIn(q)), lerp(5, 6.2, q), q * 3, .55); if (q >= 1) LET.rotation.set(-PI / 2, 0, .4);
  orb(L.k, V(0, 3, 5), null, [13, .2, .14, 46], [10, .1, .12, 44]); sh(V(0, 0, 5), 30); }, [[0, 'swoosh', .4], [.4, 'paper', .6]]);
// 48 «Die Nachbarstadt Kickelsdorf»: la carta en mis manos: HERAUSFORDERUNG
shot(44.11, 'C', 'punch', L => { street(); const me = put(ich, 0, 0, 4, 0); applyPose(me, { aLx: 1.3, aRx: 1.3, aLz: -.25, aRz: -.25, aLe: .8, aRe: .8, headX: .35 }); const w = loc(me, 0, 3.3, 1.8); show(LET, w.x, w.y, w.z, 0, .62);
  cara(me, L.T, { expr: 'shock', mouth: 'o' }); cam([0, w.y + 1.4, w.z + 4.2 - L.k * .6], [0, w.y + .4, w.z], 44); sh(V(0, 0, 4), 20); }, [[0, 'impact', .5], [.1, 'paper', .5]]);
// 49 «forderte uns heraus.»: el capitán de Kickelsdorf, con su equipo azul detrás, me señala
shot(45.39, 'W', null, L => { stadium(); const c = put(kap, SX, 0, 0, 0); actuar(c, L.lt, [[0, 'point', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' });
  OPP.slice(0, 4).forEach((o, i) => { put(o, SX + (i - 1.5) * 3, 0, -4 - (i % 2), 0); actuar(o, 0, [[0, 'cross']], { T: L.T + i }); cara(o, L.T + i, { expr: 'smug', mouth: 'smirk' }); });
  orb(L.k, V(SX, 3.6, -1), null, [13, .25, .1, 46], [11, .05, .08, 44]); sh(V(SX, 0, -2), 30); }, [[0, 'swipe', .4], [.2, 'impact', .5]]);
// 50 «Fußball, elf gegen elf.»: marcador 11 : 11 y las dos filas de once
shot(46.62, 'Z', null, L => { stadium(); [ich, ...TEAM].forEach((c, i) => { put(c, SX - 15 + i * 3, 0, 4, PI / 2 + .9); applyPose(c, { aLz: .1, aRz: .1 }); cara(c, L.T + i, { expr: c === ich ? 'determined' : 'worried', mouth: 'flat' }); });
  [kap, ...OPP].forEach((c, i) => { put(c, SX - 15 + i * 3, 0, -4, PI / 2 - .9 + PI * 0); c.root.rotation.y = -PI / 2 + .9 + PI; cara(c, L.T + i, { expr: 'smug', mouth: 'smirk' }); });
  orb(L.k, V(SX, 3, 0), null, [34, PI / 2 + .1, .3, 50], [30, PI / 2 + .02, .26, 50]); score(11, 11, clamp(L.lt / .2)); sh(V(SX, 0, 0), 40); }, [[0, 'swoosh', .4], [.3, 'whistle', .5], [.8, 'impact', .4]]);
// 51 «Der Gewinner bekommt ein nagelneues Stadion.» (zoom lento): el estadio vacío y reluciente, con destellos
shot(48.27, 'W', 'slow', L => { stadium(); confRain(V(SX, 0, 0), L.T, 60, 40, 60, 24); const k = easeInOut(L.k); cam([SX + 30 - k * 10, 36 - k * 10, 60 - k * 14], [SX, 2, -6], 50); badge('gold', 'NEUES STADION', W / 2, H * .17, clamp((L.T - 49.23) / .2), 1, .7); sh(V(SX, 0, 0), 60); }, [[0, 'swipe', .4], [.3, 'sparkle', .6], [1.1, 'cheer', .3]]);
// 52 «Der Bürgermeister geriet in Panik.»: el alcalde se lleva las manos a la cabeza delante del ayuntamiento
shot(50.59, 'C', 'punch', L => { street(); const m = put(mayor, 0, 0, -12, 0); applyPose(m, GEST.hands_head); shiver(m, L.T, .5); cara(m, L.T, { expr: 'shock', mouth: 'scream' }); sweat(m, L.T, 2);
  onFace(m, 8.4, .2, .4, 42, L.k, 7); sh(V(0, 0, -12), 30); }, [[0, 'impact', .6], [.2, 'gasp', .5]]);
// 53 «Er klingelte an jeder Tür:»: el alcalde llama a una puerta y corre a la siguiente
shot(52.33, 'W', null, L => { street(); const m = put(mayor, -13, 0, -6, -PI / 2 + .5); const r = Math.sin(L.lt * 14) > 0; applyPose(m, { aRx: 1.6, aRz: -.1, aRe: r ? .5 : .2, headY: .4 }); cara(m, L.T, { expr: 'worried', mouth: 'frown' }); sweat(m, L.T, 2);
  orb(L.k, V(-13.5, 3.8, -6), null, [13, .7, .12, 46], [12, .6, .1, 46]); sh(V(-13, 0, -6), 30); }, [[0, 'swipe', .4], [.05, 'doorbell', .6], [.6, 'doorbell', .5], [1.0, 'knock', .5]]);
// 54 «„Wer kann Fußball spielen?“»: el alcalde grita en medio de la calle
shot(53.79, 'C', null, L => { street(); const m = put(mayor, 0, 0, 2, 0); actuar(m, 0, [[0, { aLx: 1.2, aRx: 1.2, aLz: .7, aRz: .7, aLe: .2, aRe: .2 }]], { T: L.T }); talk(m, L.T, 53.79, 55.07, 'shout'); show(BALL, 2, .55, 4);
  onFace(m, 7.6, .2, -.6, 40, L.k, 6.6); sh(V(0, 0, 2), 30); }, [[0, 'thump', .4], [.2, 'megaphone', .4]]);
// 55 «Alle hoben die Hand.»: la calle se llena: todos levantan la mano
shot(55.07, 'Z', null, L => { street(); for (let i = 0; i < 22; i++) { const c = EX[i]; const r = RNG(i * 3 + 1); put(c, -9 + (i % 6) * 3.6 + r(), 0, -2 - Math.floor(i / 6) * 3.4 + r(), (r() - .5) * .5); const up = clamp((L.lt - i * .02) / .2);
  applyPose(c, { aRx: lerp(0, 2.9, up), aRz: .15, aRe: .1, aLz: .1 }); cara(c, L.T + i, { expr: 'joy', mouth: 'open_smile' }); }
  const m = put(mayor, 5, 0, 3, PI - .5); cara(m, L.T, { expr: 'happy' }); orb(L.k, V(0, 4, -6), null, [22, -.2, .22, 50], [19, -.3, .2, 48]); sh(V(0, 0, -6), 30); }, [[0, 'swoosh', .4], [.1, 'crowd_cheer', .6]]);
// 56 «Mit dem Controller drin.»: primer plano de las manos en alto… cada una con un mando
shot(56.15, 'C', 'punch', L => { street(); for (let i = 0; i < 12; i++) { const c = EX[i]; const r = RNG(i * 3 + 1); put(c, -6 + (i % 4) * 3.6 + r(), 0, -2 - Math.floor(i / 4) * 3.4 + r(), (r() - .5) * .4); applyPose(c, { aRx: 2.9, aRz: .15, aRe: .1, aLz: .1 });
  const w = c.aR.hand.getWorldPosition(V()); show(PAD[i + 10], w.x, w.y + .3, w.z, 0, .9); PAD[i + 10].rotation.set(-1.2, 0, Math.sin(L.T * 5 + i) * .2); cara(c, L.T + i, { expr: 'joy', mouth: 'open_smile' }); }
  cam([0, 7.4 - L.k * .6, 8], [0, 5.4, -5], 46); sh(V(0, 0, -4), 30); }, [[0, 'impact', .5], [.2, 'button_mash', .5]]);
// ---------- c: los diez jugones, el entrenamiento, el partido hasta el 0:4 (57,05 – 84,55 s) ----------
const lineup = (L, list, z = 0, ry = 0, x0 = SX) => list.forEach((c, i) => { put(c, x0 - (list.length - 1) * 1.6 + i * 3.2, 0, z - (i % 2) * .8, ry); });
// 57 «Also nahm er»: el alcalde entra en la Zockerhalle y señala a los jugones
shot(57.05, 'W', null, L => { halle(); VMODE = 'game'; hallCrowd(L, 14, [1, 4]); const m = put(mayor, ZX + 2, 0, 8, .7); actuar(m, L.lt, [[0, 'point', { dur: .25 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'flat' });
  orb(L.k, V(ZX + 1, 4, 4), null, [16, .5, .12, 48], [14, .35, .1, 48]); sh(V(ZX, 0, 0), 30); }, [[0, 'swipe', .4], [.2, 'crowd_murmur', .4]]);
// 58 «die zehn besten Zocker der Stadt.»: los diez, en fila, cada uno con su mando; el 10 encima
shot(57.89, 'Z', null, L => { stadium(); TEAM.forEach((c, i) => { padStand(c, SX - 14.4 + i * 3.2, 0 - (i % 2) * .8, 0, L.T, i, 14 + i, i % 2 ? 'joy' : 'determined'); });
  orb(L.k, V(SX, 3.4, 0), null, [26, .08, .12, 50], [22, -.04, .1, 50]); badge('gold', '10', W / 2, H * .17, clamp(L.lt / .2), 1, 1.1); sh(V(SX, 0, 0), 40); }, [[0, 'swoosh', .4], [.1, 'pop', .5], [.4, 'button_mash', .4]]);
// 59 «Und mich.»: entro en la fila con el balón; todos me miran
shot(59.49, 'C', 'punch', L => { stadium(); TEAM.slice(3, 7).forEach((c, i) => { padStand(c, SX - 6 + i * 3.4 + (i > 1 ? 3 : 0), -1, -.2 * (i - 1.5), L.T, i, 14 + i, 'shock'); }); const me = put(ich, SX + .2, 0, 1, 0); ballUnder(me); cara(me, L.T, { expr: 'smug', eyes: 'half', mouth: 'smirk' });
  onFace(me, 9.4, -.3, .3, 42, L.k, 8.4); sh(V(SX, 0, 0), 30); }, [[0, 'impact', .6]]);
// 60 «Sechs Tage Training.»: el campo de la iglesia, conos; yo con el silbato; el 6 en el calendario
shot(59.91, 'W', null, L => { kirch(); const me = put(ich, KX + 4, 0, 14, .9); actuar(me, 0, [[0, { aRx: 1.9, aRz: -.3, aRe: 2.2, aLz: .3 }]], { T: L.T }); const w = me.aR.hand.getWorldPosition(V()); show(WHISTLE, w.x, w.y + .2, w.z, 0, 1); cara(me, L.T, { expr: 'determined', mouth: 'o' });
  TEAM.slice(0, 6).forEach((c, i) => { put(c, KX - 1.4 + (i % 2) * 2.8, 0, 10 - i * 2.4, .4); applyPose(c, walkP(L.T, i)); cara(c, L.T + i, { expr: 'worried', mouth: 'frown' }); });
  orb(L.k, V(KX + 1, 3.4, 8), null, [20, .75, .16, 48], [17, .6, .14, 48]); badge('gold', '6 Tage', W / 2, H * .16, clamp(L.lt / .2), 1, .85); sh(V(KX, 0, 6), 30); }, [[0, 'swipe', .4], [.15, 'whistle', .7], [.5, 'footsteps', .4]]);
// 61 «Ich ließ sie rennen.»: travelling lateral: los jugones corren jadeando entre los conos
shot(61.38, 'S', null, L => { kirch(); const z0 = 12 - L.lt * 8; TEAM.slice(0, 5).forEach((c, i) => { put(c, KX - 3 + i * 1.6, 0, z0 + i * 1.8, PI); applyPose(c, runP(L.T, i * 1.3, 10)); cara(c, L.T + i, { expr: 'sad', eyes: 'closed', mouth: 'ah' }); if (i === 1) sweat(c, L.T, 2); });
  cam([KX + 7, 3.6, z0 - 9], [KX, 2.6, z0 + 3], 46); sh(V(KX, 0, z0), 30); }, [[0, 'swipe', .4], [.1, 'footsteps', .6], [.5, 'panting', .5]]);
// 62 «Sie fragten,»: Malte se para, agotado, y pregunta…
shot(62.44, 'C', null, L => { kirch(); const m = put(malte, KX, 0, 4, .3); applyPose(m, { lean: .35, aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: .4, aRe: .4, crouch: .2, headX: -.2 }); talk(m, L.T, 62.44, 63.94, 'worried'); sweat(m, L.T, 2);
  onFace(m, 7.4, 0, .5, 40, L.k, 6.6); sh(V(KX, 0, 4), 30); }, [[0, 'thump', .4], [.1, 'panting', .5]]);
// 63 «wo die Sprinttaste ist.»: bocadillo: «Wo ist die Sprinttaste?»; Bernd se busca botones en la camiseta
shot(63.08, 'W', null, L => { kirch(); const m = put(malte, KX - 1.6, 0, 4, .3); applyPose(m, { lean: .3, aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: .4, aRe: .4, crouch: .2 }); cara(m, L.T, { expr: 'confused', mouth: 'o' });
  const b = put(bernd, KX + 2, 0, 3.4, -.3); applyPose(b, { aLx: .7, aRx: .7, aLz: -.6, aRz: -.6, aLe: 1.6, aRe: 1.6, headX: .5 + Math.sin(L.T * 9) * .1 }); cara(b, L.T, { expr: 'confused', mouth: 'o' });
  bubble(m, 'Wo ist die Sprinttaste?', clamp(L.lt / .2)); orb(L.k, V(KX, 3.4, 3.6), null, [13, .1, .1, 46], [11.5, -.05, .08, 46]); sh(V(KX, 0, 4), 30); }, [[0, 'swipe', .4], [.1, 'pop', .5], [.6, 'button_mash', .3]]);
// 64–67 HUSS ×9: les enseño cómo se hace; los jugones boquiabiertos
const hTeam = (L, n) => TEAM.slice(0, n).forEach((c, i) => { put(c, KX - 7 + i * 3.5, 0, -4 - (i % 2) * 1.2, .35 - i * .14); applyPose(c, GEST.shock); cara(c, L.T + i, { expr: 'shock', mouth: 'o' }); });
shot(64.10, 'W', null, L => { kirch(); hTeam(L, 5); const me = put(ich, KX, 0, 3, PI * 0 + .1); trick(me, BALL, L.T, tsH(64, 66.6), ['roll', 'elastico', 'up', 'knee', 'rainbow', 'up', 'step', 'up', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  orb(L.k, V(KX, 2.4, 1), null, [13, .1, .1, 46], [12, .35, .1, 46]); sh(V(KX, 0, 0), 30); }, [[0, 'swipe', .4]]);
shot(64.66, null, null, L => { kirch(); hTeam(L, 5); const me = put(ich, KX, 0, 3, .1); trick(me, BALL, L.T, tsH(64, 66.6), ['roll', 'elastico', 'up', 'knee', 'rainbow', 'up', 'step', 'up', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  orb(L.k, V(KX, 2.2, 3), null, [9.6, -1.3, .12, 44], [9, -1.15, .1, 44]); sh(V(KX, 0, 0), 30); });
shot(65.18, 'C', null, L => { kirch(); hTeam(L, 5); const me = put(ich, KX, 0, 3, .1); trick(me, BALL, L.T, tsH(64, 66.6), ['roll', 'elastico', 'up', 'knee', 'rainbow', 'up', 'step', 'up', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  cam([KX + .6, 10.4 - L.k, 5.2], [KX, 1, 3.4], 46); sh(V(KX, 0, 0), 30); });
shot(65.70, null, null, L => { kirch(); hTeam(L, 5); const me = put(ich, KX, 0, 3, .1); trick(me, BALL, L.T, tsH(64, 66.6), ['roll', 'elastico', 'up', 'knee', 'rainbow', 'up', 'step', 'up', 'up'], { end: true }); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); sweat(me, L.T, 2);
  onFace(me, 7.4, -.5, -.5, 40, L.k, 6.6); sh(V(KX, 0, 0), 30); });
// 68 «Spieltag.»: el estadio desde el aire, lleno, pancarta HUFENBACH – KICKELSDORF
shot(66.72, 'Z', 'punch', L => { stadium(); tribune(L, -6, 36, 4, 'cheer'); const k = easeInOut(L.k); cam([SX + 34 - k * 6, 30 - k * 6, 50 - k * 8], [SX - 12, 4, -10], 52); sh(V(SX, 0, 0), 60); }, [[0, 'whistle', .5], [.1, 'crowd_cheer', .7], [.4, 'firework', .4]]);
// 69 «Die ganze Stadt auf der Tribüne.»: la grada llena animando (yo en el campo, de espaldas a ellos)
shot(67.48, 'W', null, L => { stadium(); tribune(L, 4, 36, 4, 'cheer'); orb(L.k, V(SX - 28, 5.2, 4), null, [26, 1.25, .12, 48], [22, 1.05, .1, 48]); sh(V(SX - 26, 0, 4), 40); }, [[0, 'swipe', .4], [.1, 'crowd_cheer', .7], [.8, 'air_horn', .4]]);
// 70 «Tribüne.»: primer plano de la abuela en la grada… no: Bernd y el alcalde animando entre los vecinos
shot(68.18, 'C', null, L => { stadium(); tribune(L, 0, 16, 2, 'cheer'); const m = put(mayor, SX - 24, 1.6, 1.2, PI / 2); applyPose(m, cheerP(L.T)); laughF(m, L.T); orb(L.k, V(SX - 24, 5, 1.2), null, [11, PI / 2 + .25, .1, 44], [9.6, PI / 2 + .1, .1, 44]); sh(V(SX - 24, 0, 0), 30); }, [[0, 'thump', .4], [.2, 'crowd_cheer', .5]]);
// 71 «Die Gegner lachten uns aus:»: el equipo azul se parte de risa señalándonos
shot(69.11, 'W', null, L => { stadium(); [kap, ...OPP.slice(0, 5)].forEach((c, i) => { put(c, SX - 7.5 + i * 3, 0, -6 - (i % 2), 0); applyPose(c, { aLx: .6, aRx: i % 2 ? 1.5 : .6, aLz: -.3, aRz: -.1, aLe: 1.6, aRe: .1, lean: .25 + Math.abs(Math.sin(L.T * 12 + i)) * .1 }); laughF(c, L.T + i); });
  orb(L.k, V(SX, 3.6, -6.5), null, [16, .1, .1, 48], [13.5, -.05, .08, 46]); sh(V(SX, 0, -6), 30); }, [[0, 'swipe', .4], [.1, 'laugh_group', .7]]);
// 72 «„Ist das eine Mannschaft»: el capitán, burlón
shot(70.56, 'C', 'punch', L => { stadium(); const c = put(kap, SX, 0, -6, 0); actuar(c, 0, [[0, 'point']], { T: L.T }); talk(c, L.T, 70.56, 72.44, 'smug'); onFace(c, 7.6, .2, .6, 40, L.k, 6.6); sh(V(SX, 0, -6), 30); }, [[0, 'impact', .4]]);
// 73 «oder ein Wartezimmer?“»: nuestro equipo sentado en el banquillo, cada uno con su mando
shot(71.46, 'W', null, L => { stadium(); TEAM.slice(0, 8).forEach((c, i) => gamer(c, SX + 22 + 0, 0, -9 + i * 2.6, -PI / 2, L.T, i, 14 + i, ['determined', 'joy', 'laugh', 'determined'][i % 4]));
  orb(L.k, V(SX + 22, 3, 0), null, [16, -1.1, .12, 46], [14, -1.3, .1, 46]); badge('tag', 'WARTEZIMMER', W / 2, H * .18, clamp(L.lt / .2)); sh(V(SX + 22, 0, 0), 30); }, [[0, 'swipe', .4], [.2, 'button_mash', .5], [.6, 'laugh_group', .4]]);
// 74 «Anpfiff.»: el silbato; el balón en el centro y yo delante
shot(72.69, 'F', 'punch', L => { stadium(); const me = put(ich, SX, 0, -1.4, 0); applyPose(me, { crouch: .2, lean: .2, aLz: .4, aRz: .4 }); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' }); show(BALL, SX, .55, 0);
  put(kap, SX + 1.5, 0, -6, 0); applyPose(kap, { crouch: .2, lean: .2 }); cara(kap, L.T, { expr: 'smug' }); cam([SX + 2.4, 2, 7 - L.k], [SX, 2.2, -1], 44); sh(V(SX, 0, 0), 30); }, [[0, 'whistle', .9], [.1, 'crowd_cheer', .5]]);
// 75 «Malte drückte X.»: Malte en el campo pulsando la X del mando; el balón le pasa por delante
shot(73.34, 'W', null, L => { stadium(); const m = padStand(malte, SX + 2, 6, -.3, L.T, 0, 0, 'determined'); cara(m, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); const bx = lerp(SX - 6, SX + 10, L.k); show(BALL, bx, .55, 8); BALL.rotation.set(0, 0, -L.T * 10);
  orb(L.k, V(SX + 2, 3.6, 6), null, [10, .1, .1, 44], [9, -.1, .1, 44]); badge('big', 'X', W / 2, H * .17, clamp(L.lt / .15), 1, 1); sh(V(SX + 2, 0, 6), 30); }, [[0, 'swipe', .4], [.1, 'button_click', .7], [.4, 'ball_roll', .4]]);
// 76 «Oma drückte Pause.»: la abuela pulsa pausa… y se queda congelada en el campo
shot(74.36, 'Z', null, L => { stadium(); const o = padStand(oma, SX - 3, 10, .3, L.T, 0, 2, 'determined'); cara(o, L.T, { expr: 'smug', mouth: 'smirk' }); const p = put(OPP[2], SX - 6, 0, 13, .9); applyPose(p, runP(L.T, 0)); cara(p, L.T, { expr: 'happy' });
  show(BALL, SX - 4.6, .55, 13.6); orb(L.k, V(SX - 4, 3.4, 11), null, [12, .3, .1, 46], [10.5, .15, .1, 46]); badge('tag', '❚❚ PAUSE', W / 2, H * .17, clamp((L.T - 74.92) / .15)); sh(V(SX - 4, 0, 11), 30); }, [[0, 'swoosh', .4], [.55, 'pause_beep', .7]]);
// 77 «Der Bäcker fragte, wo man respawnt.»: Bernd tirado en el césped; bocadillo «Respawn?»
shot(75.52, 'W', null, L => { stadium(); const b = put(bernd, SX + 4, .9, 4, 0); b.root.rotation.set(-PI / 2 + .1, .3, 0); applyPose(b, { aLz: 1.2, aRz: 1.2, lLx: .2 }); cara(b, L.T, { expr: 'confused', eyes: 'closed', mouth: 'o' });
  const p = put(OPP[1], SX + 7, 0, 2, -1.2); applyPose(p, runP(L.T, 1)); cara(p, L.T, { expr: 'happy' }); show(BALL, SX + 6.2, .55, 2.6);
  bubble(b, 'Wo respawnt man?', clamp((L.lt - .2) / .2), .4); orb(L.k, V(SX + 4.6, 2, 4), null, [11, .4, .4, 46], [9.6, .25, .36, 46]); sh(V(SX + 4, 0, 4), 30); }, [[0, 'swipe', .4], [.05, 'body_fall', .6], [.3, 'pop', .4]]);
// 78 «Unser Torwart wollte den Bus der Gegner klauen.»: nuestra portera se cuela por la puerta del autobús azul
shot(77.24, 'S', null, L => { stadium(); show(BUS, SX + 30, 0, -14, 0); BUS.userData.door.position.x = 2.53 + Math.min(1, L.lt * 3) * .1; const t = put(tw, SX + 33.4 - Math.min(1, L.lt / 1.2) * .6, 0, -5.6, -PI / 2 + PI); GLV.forEach(g => g.visible = true);
  applyPose(t, walkP(L.T, 0)); t.root.rotation.y = -PI / 2; cara(t, L.T, { expr: 'sus', mouth: 'smirk' }); orb(L.k, V(SX + 32, 4, -6), null, [16, 1.5, .1, 48], [14, 1.3, .1, 48]); sh(V(SX + 30, 0, -10), 30); }, [[0, 'swipe', .4], [.3, 'door', .5], [.9, 'bus_engine', .6]]);
// 79 «klauen.»: el autobús arranca con ella al volante; los rivales corren detrás
shot(78.26, 'W', null, L => { stadium(); const z = -14 + L.lt * 14; show(BUS, SX + 30, 0, z, 0); put(tw, SX + 30, 2.2, z + 9.4, 0); GLV.forEach(g => g.visible = true); applyPose(tw, { aLx: 1.4, aRx: 1.4, aLe: .4, aRe: .4, lLx: 1.4, lRx: 1.4, lLk: 1.4, lRk: 1.4 }); laughF(tw, L.T);
  OPP.slice(3, 6).forEach((o, i) => { put(o, SX + 28 + i * 2, 0, z - 12 - i * 2, 0); applyPose(o, runP(L.T, i)); cara(o, L.T + i, { expr: 'angry', mouth: 'scream' }); });
  orb(L.k, V(SX + 30, 4, z), null, [26, .9, .15, 50], [24, .7, .12, 50]); sh(V(SX + 30, 0, z), 40); }, [[0, 'swipe', .4], [.1, 'tires', .6], [.5, 'horn', .5]]);
// 80 «Nach sieben Minuten»: el marcador gigante: 7'
shot(79.49, 'Z', null, L => { stadium(); ST.SB.userData.set(0, 4); tribune(L, -24, 16, 4, 'shock'); cam([SX + 4, 9, -26 + L.k * 2], [SX, 13, -52], 46); badge('tag', "7'", W / 2, H * .16, clamp(L.lt / .2)); sh(V(SX, 0, -40), 40); }, [[0, 'swoosh', .4], [.2, 'clock_tick', .5]]);
// 81 «stand es null zu vier.»: los azules celebran; 0 : 4
shot(80.53, 'C', 'punch', L => { stadium(); ST.SB.userData.set(0, 4); [kap, ...OPP.slice(0, 4)].forEach((c, i) => { put(c, SX - 6 + i * 3, Math.abs(Math.sin(L.T * 8 + i)) * .5, 20 - (i % 2), PI); applyPose(c, cheerP(L.T, i)); laughF(c, L.T + i); });
  orb(L.k, V(SX, 3.4, 20), null, [15, PI + .2, .1, 48], [13, PI + .05, .1, 46]); score(0, 4, clamp(L.lt / .2)); sh(V(SX, 0, 20), 30); }, [[0, 'impact', .6], [.1, 'crowd_boo', .5]]);
// 82 «Also nahm ich mir den Ball.» (zoom lento): piso el balón; mirada fija
shot(81.63, 'W', 'slow', L => { stadium(); const me = put(ich, SX, 0, 0, PI); applyPose(me, { lRx: -.4, lRk: .6, aLz: .3, aRz: .3, headX: .2 }); const w = loc(me, -.3, .55 / .84, 1.2); show(BALL, w.x, .55, w.z); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  onFace(me, 10, -.4, .3, 42, L.k, 7); sh(V(SX, 0, 0), 30); }, [[0, 'swipe', .4], [.3, 'heartbeat', .5]]);
// 83–86 HUSS ×6: regates a los azules (frontal, lateral, cenital, cara)
const dribOpp = (L, z0) => OPP.slice(0, 3).forEach((o, i) => { put(o, SX + (i - 1) * 2.8, 0, z0 + 4 + i * 2, PI * 0); applyPose(o, { crouch: .25, lean: .2, aLz: .7, aRz: .7, headX: .2 }); o.root.rotation.y = 0; cara(o, L.T + i, { expr: 'shock', mouth: 'o' }); });
shot(82.90, 'W', null, L => { stadium(); const me = put(ich, SX, 0, 2, 0); trick(me, BALL, L.T, tsH(82.8, 84.6), ['elastico', 'roll', 'step', 'rainbow', 'elastico', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' }); dribOpp(L, -4);
  orb(L.k, V(SX, 2.4, 1), null, [12, .25, .1, 46], [11, .45, .08, 46]); sh(V(SX, 0, 0), 30); }, [[0, 'swipe', .4]]);
shot(83.45, 'C', null, L => { stadium(); const me = put(ich, SX, 0, 2, 0); trick(me, BALL, L.T, tsH(82.8, 84.6), ['elastico', 'roll', 'step', 'rainbow', 'elastico', 'up']); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); dribOpp(L, -4);
  orb(L.k, V(SX, 2.4, 2), null, [10, -1.3, .12, 46], [9.4, -1.1, .1, 46]); sh(V(SX, 0, 0), 30); });
shot(83.98, null, null, L => { stadium(); const me = put(ich, SX, 0, 2, 0); trick(me, BALL, L.T, tsH(82.8, 84.6), ['elastico', 'roll', 'step', 'rainbow', 'elastico', 'up'], { end: true }); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); sweat(me, L.T, 2);
  onFace(me, 7.2, -.2, 1.3, 40, L.k, 6.4); sh(V(SX, 0, 0), 30); });
// ---------- d: diez goles, la victoria, el pueblo juega al fútbol, yo en el sofá (84,55 – 111,6 s) ----------
const goalShot = (L, kt, home, away, lbl) => { stadium(); ST.SB.userData.set(L.T > kt + .25 ? home : home - 1, away); const me = put(ich, SX + 1, 0, 22, 0); const k = clamp((L.T - (kt - .22)) / .4); applyPose(me, kickPose(k));
  const a = loc(me, .5, 1.0, 1.4).toArray(), g = [SX + (home % 2 ? -3 : 3), 2.6, 36.5]; if (L.T < kt) show(BALL, a[0], .55, a[2]); else shotBall(BALL, a, g, .8, clamp((L.T - kt) / .25), L.T);
  ST.G2.userData.bulge(clamp((L.T - kt - .22) / .1) * (1 - clamp((L.T - kt - .5) / .3))); const kp = put(OPP[9], SX + (home % 2 ? 2 : -2), 0, 34, PI); applyPose(kp, { aLx: 2.6, aRx: 2.6, aLz: .6, aRz: .6, crouch: .3, sx: home % 2 ? 1 : -1 }); cara(kp, L.T, { expr: 'shock', mouth: 'o' });
  cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: L.T > kt ? 'grimace' : 'flat' }); score(home, away, clamp((L.T - kt - .25) / .15)); badge('gold', lbl, W / 2, H * .27, clamp((L.T - kt - .25) / .15), 1, .7); sh(V(SX, 0, 26), 30); };
// 87 «Und ich spielte,»: conduzco a toda velocidad por el campo, la grada de pie
shot(84.55, 'W', null, L => { stadium(); tribune(L, 10, 12, 2, 'cheer'); const r = dribble(ich, BALL, L.lt, L.T, { x: SX - 4, z: -10, ry: .2, speed: 10, ts: [84.7, 85.0, 85.3, 85.6], weave: .6 }); cara(ich, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  const p = ich.root.position; cam([p.x + 3, 3, p.z + 10], [p.x, 2.4, p.z], 46); sh(V(p.x, 0, p.z), 30); }, [[0, 'swipe', .4], [.15, 'kick', .3], [.45, 'kick', .3], [.75, 'kick', .3], [.3, 'crowd_cheer', .5]]);
// 88 «als hätte ich jeden einzelnen Tag»: recuerdo (sepia): los chutes contra el muro al amanecer
shot(85.64, 'F', null, L => { kirch('sunset'); grade.uniforms.sepia.value = .7; const me = put(ich, KX + 1, 0, 4, PI); const per = .5, ph = (L.lt % per) / per; applyPose(me, kickPose(clamp(ph * 1.6))); const a = loc(me, .5, 1.0, 1.4).toArray(); const q = clamp((ph - .35) / .35); if (q <= 0) show(BALL, a[0], .55, a[2]); else shotBall(BALL, a, [KX + .5, 2.4, -9.4], .3, q, L.T);
  cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' }); orb(L.k, V(KX, 3, 0), null, [15, .5, .12, 46], [13, .4, .1, 46]); sh(V(KX, 0, -2), 30); }, [[0, 'flash', .5], [.25, 'wall_hit', .4], [.75, 'wall_hit', .4]]);
// 89 «dafür trainiert.»: recuerdo (sepia): bajo la farola, de noche
shot(86.94, 'W', null, L => { street('night'); grade.uniforms.sepia.value = .7; SPOTL.position.set(7.6, 10, -11); SPOTL.target.position.set(8, 0, -8); SPOTL.intensity = 70; const me = put(ich, 8, 0, -8, .2); juggle(me, BALL, L.T, [87, 87.3, 87.6, 87.9, 88.2], { h: 2.2 }); cara(me, L.T, { expr: 'determined', mouth: 'flat' });
  orb(L.k, V(8, 2.6, -8), null, [11, -.3, .14, 46], [10, -.15, .12, 46]); sh(V(8, 0, -8), 30); }, [[0, 'swipe', .4], [.1, 'kick', .3], [.4, 'kick', .3], [.7, 'kick', .3]]);
// 90 «Denn ich hatte nur ein Ziel:» (zoom lento): la portería rival, el portero temblando
shot(88.08, 'Z', 'slow', L => { stadium(); const me = put(ich, SX + 1, 0, 22, 0); applyPose(me, { lRx: -.3, lRk: .5, headX: .1 }); const w = loc(me, -.3, .55 / .84, 1.2); show(BALL, w.x, .55, w.z); cara(me, L.T, { expr: 'determined', eyes: 'angry', mouth: 'flat' });
  const kp = put(OPP[9], SX, 0, 34, PI); applyPose(kp, { aLx: .8, aRx: .8, aLz: .6, aRz: .6, crouch: .3 }); shiver(kp, L.T, .6); cara(kp, L.T, { expr: 'worried', mouth: 'wavy' });
  cam([SX + 3, 7, 12 + L.k * 2], [SX, 2, 35], 46); sh(V(SX, 0, 28), 30); }, [[0, 'swoosh', .4], [.3, 'heartbeat', .5]]);
// 91 «Tore.»: el primer chut
shot(89.48, 'C', 'punch', L => { goalShot(L, 89.6, 1, 4, 'TOR!'); orb(L.k, V(SX, 3.4, 28), null, [15, PI - .3, .12, 46], [14, PI - .2, .1, 46]); }, [[0, 'impact', .4], [.12, 'kick', .8], [.4, 'net', .6], [.45, 'crowd_cheer', .6]]);
// 92 «Eins.»
shot(89.74, 'W', null, L => { goalShot(L, 89.7, 1, 4, '1'); orb(L.k, V(SX, 4, 28), null, [16, PI + .6, .12, 46], [15, PI + .5, .12, 46]); }, [[0, 'swipe', .4], [.35, 'crowd_cheer', .5]]);
// 93 «Fünf.»
shot(90.23, 'S', null, L => { goalShot(L, 90.3, 5, 4, '5'); orb(L.k, V(SX, 4, 28), null, [16, PI - .6, .14, 46], [15, PI - .5, .12, 46]); }, [[0, 'swipe', .4], [.07, 'kick', .8], [.35, 'net', .6], [.4, 'crowd_cheer', .6]]);
// 94 «Zehn.»
shot(90.78, 'C', 'punch', L => { goalShot(L, 90.85, 10, 4, '10'); orb(L.k, V(SX, 3, 28), null, [13, PI + .2, .1, 46], [12, PI + .1, .1, 46]); }, [[0, 'impact', .5], [.07, 'kick', .8], [.35, 'net', .7], [.4, 'crowd_cheer', .7]]);
// 95 «Zehn Tore,»: el marcador gigante: 10 : 4, la grada en pie
shot(91.32, 'Z', null, L => { stadium(); ST.SB.userData.set(10, 4); tribune(L, -26, 16, 4, 'cheer'); cam([SX + 3, 9, -24 + L.k * 2], [SX, 13, -52], 46); confRain(V(SX, 0, -40), L.T, 60, 40, 20, 20); sh(V(SX, 0, -40), 40); }, [[0, 'swoosh', .4], [.1, 'crowd_cheer', .8], [.4, 'firework', .5]]);
// 96 «ganz allein.»: yo solo en el área, brazos abiertos; mis compañeros a lo lejos, con los mandos
shot(92.42, 'W', null, L => { stadium(); const me = put(ich, SX, 0, 24, PI); applyPose(me, { aLz: 1.5, aRz: 1.5, aLx: .3, aRx: .3, headX: -.3 }); grin(me, L.T); TEAM.slice(0, 4).forEach((c, i) => padStand(c, SX - 8 + i * 4, 6, PI * 0, L.T, i, 14 + i, 'shock'));
  orb(L.k, V(SX, 3.6, 22), null, [14, PI - .2, .14, 48], [12, PI - .1, .12, 46]); sh(V(SX, 0, 20), 30); }, [[0, 'swipe', .4], [.2, 'cheer', .5]]);
// 97 «Ihr Torwart wollte ein Autogramm.»: el portero azul me tiende papel y bolígrafo
shot(93.22, 'Z', null, L => { stadium(); const kp = put(OPP[9], SX + 1.6, 0, 30, -PI / 2 + .3); actuar(kp, 0, [[0, { aRx: 1.5, aRz: -.1, aRe: .2, aLx: 1.2, aLe: .4 }]], { T: L.T }); cara(kp, L.T, { expr: 'happy', mouth: 'open_smile' }); const w = kp.aR.hand.getWorldPosition(V()); show(AUTO, w.x - .3, w.y + .4, w.z, PI, .9);
  const me = put(ich, SX - 1.8, 0, 30.4, PI / 2 + .3); applyPose(me, { aRx: 1.4, aRe: .6 }); const pw = me.aR.hand.getWorldPosition(V()); show(PEN, pw.x, pw.y, pw.z, 0, 1); cara(me, L.T, { expr: 'smug', mouth: 'smirk' });
  orb(L.k, V(SX, 4, 30), null, [11, PI - .2, .1, 44], [10, PI - .05, .08, 44]); sh(V(SX, 0, 30), 30); }, [[0, 'swoosh', .4], [.4, 'pen', .5]]);
// 98 «Wir gewannen das Stadion.»: fuegos artificiales y confeti sobre el estadio; todos saltan
shot(94.81, 'W', null, L => { stadium(); tribune(L, -4, 36, 4, 'cheer'); fireworks(V(SX, 0, -20), L.T, 3, 16); confRain(V(SX - 20, 0, -4), L.T, 70, 20, 40, 20); const k = easeInOut(L.k); cam([SX + 18, 18 - k * 4, 34 - k * 6], [SX - 24, 6, -4], 50); badge('gold', 'NEUES STADION!', W / 2, H * .16, clamp(L.lt / .2), 1, .75); sh(V(SX - 10, 0, 0), 50); },
  [[0, 'swipe', .4], [.1, 'firework', .7], [.2, 'crowd_cheer', .8], [.8, 'firework', .5]]);
// 99 «Der Bürgermeister hob mich hoch.»: el alcalde me levanta en brazos, confeti
shot(96.28, 'C', 'punch', L => { stadium(); const m = put(mayor, SX, 0, 6, 0); applyPose(m, { aLx: 2.9, aRx: 2.9, aLz: .3, aRz: .3, aLe: .2, aRe: .2, crouch: .1 }); laughF(m, L.T); const up = easeOut(clamp(L.lt / .4));
  const me = put(ich, SX, lerp(1.5, 4.2, up) + Math.sin(L.T * 6) * .2, 6.2, 0); applyPose(me, { aLx: 2.9, aRx: 2.9, aLz: .4, aRz: .4, lLk: .5, lRk: .5 }); grin(me, L.T); confetti(V(SX, 4, 6), L.t0 + .3, L.T, 70);
  orb(L.k, V(SX, 6.5, 6), null, [16, .25, .05, 48], [14, .15, .04, 48]); sh(V(SX, 0, 6), 30); }, [[0, 'impact', .5], [.2, 'cheer', .6], [.3, 'confetti', .5]]);
// 100 «Malte weinte.»: Malte, lágrimas y mando en la mano
shot(97.73, 'W', null, L => { stadium(); const m = padStand(malte, SX + 4, 2, -.3, L.T, 0, 0, 'sad'); cara(m, L.T, { expr: 'sad', eyes: 'cry', mouth: Math.sin(L.T * 9) > 0 ? 'wavy' : 'frown' }); tearsF(m, L.T); shiver(m, L.T, .3);
  onFace(m, 7.4, 0, .5, 40, L.k, 6.6); sh(V(SX + 4, 0, 2), 30); }, [[0, 'swipe', .4], [.1, 'sob', .6]]);
// 101 «Oma legte beide Controller weg.»: la abuela deja los dos mandos en el césped y se arremanga
shot(98.61, 'Z', null, L => { stadium(); const o = put(oma, SX - 4, 0, 4, .2); const k = clamp(L.lt / .7); applyPose(o, { lean: lerp(0, .5, Math.sin(k * PI)), crouch: lerp(0, .4, Math.sin(k * PI)), aLx: lerp(1.1, .3, k), aRx: lerp(1.1, .3, k), aLz: .2, aRz: .2 }); cara(o, L.T, { expr: 'determined', mouth: 'smirk' });
  [0, 1].forEach(j => { show(PAD[2 + j * 30], SX - 4.8 + j * 1.6, k > .6 ? .2 : lerp(2.6, .2, k / .6), 5.4, .2, .84); }); orb(L.k, V(SX - 4, 3, 4), null, [10, .5, .12, 44], [9, .3, .12, 44]); sh(V(SX - 4, 0, 4), 30); }, [[0, 'swoosh', .4], [.45, 'plastic_drop', .6]]);
// 102 «Jetzt spielt die ganze Stadt Fußball.»: la calle llena de vecinos jugando al fútbol
shot(100.30, 'W', null, L => { street(); OR.FEST.visible = true; for (let i = 0; i < 18; i++) { const c = EX[i]; const r = RNG(i * 5 + 2); const x = -8 + (i % 6) * 3.2 + r(), z = 6 - Math.floor(i / 6) * 6 + r(); put(c, x, 0, z, (r() - .5) * 2); if (i % 3 === 0) { applyPose(c, runP(L.T, i)); } else { applyPose(c, cheerP(L.T, i)); } cara(c, L.T + i, { expr: 'joy', mouth: 'open_smile' }); }
  show(BALL, Math.sin(L.T * 2) * 4, .55 + Math.abs(Math.sin(L.T * 5)) * 2, 0); orb(L.k, V(0, 3.6, 0), null, [24, .3, .26, 50], [20, .15, .22, 50]); sh(V(0, 0, 0), 40); }, [[0, 'swipe', .4], [.1, 'kids_laugh', .5], [.4, 'kick', .4], [1.0, 'kick', .4]]);
// 103 «Fußball.»: Bernd y el cartero se pasan el balón en la calle
shot(101.54, 'C', null, L => { street(); const b = put(bernd, -2, 0, 4, PI / 2 + .5); const p = put(post, 2.4, 0, 4, -PI / 2 - .5); const q = (L.lt * 1.4) % 1, dir = Math.floor(L.lt * 1.4) % 2; show(BALL, dir ? lerp(1.6, -1.2, q) : lerp(-1.2, 1.6, q), .55, 4.6); applyPose(b, kickPose(dir ? 0 : clamp(q * 2))); applyPose(p, kickPose(dir ? clamp(q * 2) : 0)); grin(b, L.T); grin(p, L.T);
  orb(L.k, V(.2, 3.4, 4), null, [16, .05, .1, 48], [14.5, -.05, .1, 48]); sh(V(0, 0, 4), 30); }, [[0, 'thump', .4], [.15, 'kick', .4], [.7, 'kick', .4]]);
// 104 «Jeden Tag, im neuen Stadion.»: el estadio lleno de gente jugando: niños, abuela, panadero…
shot(102.30, 'Z', null, L => { stadium(); tribune(L, 0, 18, 3, 'cheer', EX.slice(18)); [oma, malte, ...K, tw].forEach((c, i) => { const r = RNG(i * 9); put(c, SX - 10 + i * 3, 0, -4 + (i % 3) * 4, (r() - .5) * 2); applyPose(c, runP(L.T, i)); cara(c, L.T + i, { expr: 'joy', mouth: 'open_smile' }); }); GLV.forEach(g => g.visible = true);
  show(BALL, SX + Math.sin(L.T * 2) * 6, .55, 0); const k = easeInOut(L.k); cam([SX + 22 - k * 4, 16 - k * 3, 30 - k * 4], [SX - 2, 2, -2], 48); sh(V(SX, 0, 0), 40); }, [[0, 'swoosh', .4], [.2, 'crowd_cheer', .5], [.6, 'whistle', .4]]);
// 105–108 HUSS ×8: todo el pueblo haciendo toques a la vez (la abuela, Malte, Bernd y yo)
const hussAll = (L, list, z0 = 0) => list.forEach((c, i) => { put(c, SX - (list.length - 1) * 2 + i * 4, 0, z0 - (i % 2) * 2, 0); juggle(c, i ? [BALL2, BALL, BALL2][i % 3] : BALL, L.T, tsH(104, 106.4), { h: 2 }); cara(c, L.T + i, { expr: 'joy', mouth: 'open_smile' }); });
shot(104.15, 'W', null, L => { stadium(); hussAll(L, [malte, oma]); orb(L.k, V(SX, 2.6, 0), null, [12, .2, .1, 46], [11, .35, .1, 46]); sh(V(SX, 0, 0), 30); }, [[0, 'swipe', .4]]);
shot(104.69, 'C', null, L => { stadium(); hussAll(L, [bernd, post]); orb(L.k, V(SX, 2.8, 0), null, [12, -.3, .1, 46], [11, -.15, .1, 46]); sh(V(SX, 0, 0), 30); });
shot(105.22, 'W', null, L => { stadium(); hussAll(L, [mayor, tw]); GLV.forEach(g => g.visible = true); orb(L.k, V(SX, 2.8, 0), null, [12, .1, .12, 46], [11, .25, .1, 46]); sh(V(SX, 0, 0), 30); });
shot(105.76, 'C', null, L => { stadium(); tribune(L, 0, 12, 2, 'cheer'); hussAll(L, [K[0], K[1], K[2], K[3]]); orb(L.k, V(SX, 3, 0), null, [20, .3, .2, 48], [18, .2, .18, 48]); sh(V(SX, 0, 0), 30); });
// 109 «Und ich?»: el estadio sigue; mi sitio en el campo, vacío
shot(106.35, 'Z', null, L => { stadium(); tribune(L, 0, 16, 4, 'cheer'); show(BALL, SX, .55, 0); BALL.rotation.set(0, 0, L.T); cam([SX + 1, 1.4, 8 - L.k], [SX, 1.4, 0], 44); sh(V(SX, 0, 0), 30); }, [[0, 'swoosh', .4], [.2, 'wind', .4]]);
// 110 «Ich bin endlich zu Hause.»: entro en mi salón y suspiro, feliz
shot(106.98, 'W', null, L => { room('HZ'); VMODE = 'logo'; const me = put(ich, HX + 6 - L.lt * 2, 0, 6, -1.6); applyPose(me, walkP(L.T, 0, 6)); grin(me, L.T); orb(L.k, V(HX + 4, 3.6, 5), null, [13, -.6, .12, 46], [11.5, -.45, .1, 46]); sh(V(HX, 0, 0), 20); }, [[0, 'swipe', .4], [.1, 'door', .5], [.6, 'sigh', .5]]);
// 111 «Auf dem Sofa.»: me dejo caer en el sofá
shot(108.36, 'C', 'punch', L => { room('HZ'); VMODE = 'logo'; const k = easeOut(clamp(L.lt / .3)); put(ich, HX, lerp(2.4, 0, k), 3.2, PI); applyPose(ich, { ...seatP(L.T, 0, 0), aLx: .3, aRx: .3, aLz: .9, aRz: .9, aLe: .2, aRe: .2, headX: -.2 }); cara(ich, L.T, { expr: 'happy', eyes: 'closed', mouth: 'smile' });
  orb(L.k, V(HX, 3.6, 3.2), null, [10, PI + .3, .1, 44], [9, PI + .2, .1, 44]); sh(V(HX, 0, 0), 20); }, [[0, 'impact', .4], [.1, 'sofa_flop', .7]]);
// 112 «Und zocke GTA 6.»: con el mando, la tele con el logo del juego detrás de mí
shot(109.04, 'W', null, L => { room('HZ'); VMODE = 'logo'; gamer(ich, HX, 0, 3.2, PI, L.T, 0, 0, 'joy'); grin(ich, L.T); cam([HX + 4, 5.8, 9 - L.k], [HX - 1, 4.2, -8], 46); sh(V(HX, 0, 0), 20); }, [[0, 'swipe', .4], [.2, 'game_start', .6], [.6, 'button_mash', .5]]);
// 113 «6.»: primer plano de mi cara, feliz, iluminada por la tele
shot(110.04, 'C', 'punch', L => { room('HZ'); VMODE = 'game'; gamer(ich, HX, 0, 3.2, PI, L.T, 0, 0, 'joy'); grin(ich, L.T); onFace(ich, 6.4, .2, .4, 40, L.k, 5.6); sh(V(HX, 0, 0), 20); }, [[0, 'impact', .4], [.2, 'button_mash', .5]]);
// 114 «Allein.»: alejamiento: el salón, yo solo en el sofá con la tele
shot(110.89, 'Z', null, L => { room('HZ'); VMODE = 'game'; gamer(ich, HX, 0, 3.2, PI, L.T, 0, 0, 'joy'); orb(L.k, V(HX, 3.6, 3.2), null, [7, PI + .3, .1, 44], [12, PI + .35, .2, 52]); sh(V(HX, 0, 0), 20); }, [[0, 'swoosh', .4], [.2, 'crickets', .4]]);



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
  hideAll(); BAD_.length = 0; s.fn(L); VICE.update(T, VMODE); VICE2.update(T + 3.7, VMODE2);
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

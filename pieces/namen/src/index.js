// NAMEN — «In dieser Stadt bekommst du jedes Mal einen Euro, wenn jemand deinen Namen sagt.»
// Yo me llamo Huss y nadie lo dice; el alcalde Genau, Krass, Digga y el bebé Boah son ricos. El chico del hoodie azul entrena solo: cada bote = «HUSS»… y al final todo el pueblo hace HUSS.
// Motor: el de ebbe/schutzengel (cielo con nubes de verdad, AO, DOF, supermuestreo, sombras 4096) + físicas de monedas (caen, rebotan) y balón.
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { rimLight } from './roblox.js';
import { FONT } from './props.js';
import { skyDome, SKIES, applySky, skyEnvs } from './ebwelt.js';
import { rufingen, drawRanking, villa, krassCenter, diggaGym, strasse, partyGarten, platz, drawScore, euroCoin, basketball, kinderwagen, hantel, langhantel, doenerWrap, sign } from './nwelt.js';
import { makeIch, makeBlau, makeGenau, makeKrass, makeDigga, makeBoah, makeMama, makeNieser, makeDoener } from './nvolk.js';
import { makeExtra } from './ecast.js';
import { partyHat } from './hsets.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = window.__TESTDUR ?? 94.1, U = W / 720, PI = Math.PI;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe0f0, .0004);
const QS = new URLSearchParams(location.search); const HQ = QS.get('hq') !== '0';
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 30000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = QS.get('ao') !== '0';
const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: .0008, maxblur: .012 }); composer.insertPass(bokeh, 2); let DOF = 1;
let CAMT = new THREE.Vector3(); { const la = camera.lookAt.bind(camera); camera.lookAt = (...a) => { if (a.length === 3) CAMT.set(...a); else CAMT.copy(a[0]); la(...a); }; }
const SS = +(QS.get('ss') ?? 1.5); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
renderer.toneMapping = { agx: THREE.AgXToneMapping, aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping }[QS.get('tm') ?? 'neutral'];
console.log('t0', performance.now()|0); const ENVS = skyEnvs(renderer); console.log('envs', performance.now()|0); const ROOMENV = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
const SKY = skyDome(); scene.add(SKY);
const hemi = new THREE.HemisphereLight(0xdfeeff, 0xb89a70, 1.0); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 3); sun.castShadow = true; const SMS = +(QS.get('sm') ?? 4096); sun.shadow.mapSize.set(SMS, SMS); sun.shadow.bias = -.0002; sun.shadow.normalBias = .08; sun.shadow.radius = 1.5; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
const LP = Array.from({ length: 4 }, () => { const l = new THREE.PointLight(0xffb060, 0, 60, 1.6); scene.add(l); return l; });
let SHR = 70, SHC = null; function sh(p0, s = 40) { SHR = s; const q = 2 * s / SMS * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 1400 }); c.updateProjectionMatrix();
  sun.target.position.copy(p); sun.position.copy(p).addScaledVector(SUND, 500); rim.target.position.copy(p); rim.position.copy(p).add(V(-SUND.x * 100, 60, -SUND.z * 100)); }
const SUND = V(-.35, .62, -.7).normalize();
const OLF = HQ ? 0 : 1; const OC = 3 * SS * OLF, OS = 2.2 * SS * OLF, OP = 1.8 * SS * OLF;
// ---------- escenarios ----------
// Rufingen (x = 0): plaza; NAMENSBANK en z = -66 (fachada z ≈ -48, marcador en (0, 18, -48.4)); fuente (0, 22); casas en x = ±54.
// Villa (VX): jacuzzi de oro en (VX, 0, 0), villa en z = -50. Krass Center fuera (KX), dentro (KX + 600). Gym (GX). Mi calle (SX): mi puerta en (SX - 21.4, 2.4, 0).
// Fiesta (PX, noche): döner en (PX + 20, 0, 8) mirando a -x. Cancha vieja (BX). Cancha nueva de oro (NX).
const VX = 1500, KX = 3000, KIX = KX + 600, GX = 4400, SX = 5200, PX = 6200, BX = 7200, NX = 8200;
const RF = rufingen(scene), VI = villa(scene, VX), KC = krassCenter(scene, KX), GY = diggaGym(scene, GX), ST = strasse(scene, SX), PG = partyGarten(scene, PX), PL = platz(scene, BX, { lit: 1 }), NP = platz(scene, NX, { gold: true, seed: 33 });
console.log('sets', performance.now()|0);
const SETS = { RF: RF.g, VI: VI.g, KC: KC.g, GY: GY.g, ST: ST.g, PG: PG.g, PL: PL.g, NP: NP.g };
for (const k in SETS) outline(SETS[k], OS);
// ---------- reparto ----------
const ich = makeIch(scene), blau = makeBlau(scene), genau = makeGenau(scene), krass = makeKrass(scene), digga = makeDigga(scene), boah = makeBoah(scene), mama = makeMama(scene), nieser = makeNieser(scene), doener = makeDoener(scene);
kitFace(ich, 'kid'); kitFace(blau, 'hero'); kitFace(genau, 'mustache'); kitFace(krass, 'girl'); kitFace(digga, 'hero'); kitFace(boah, 'kid'); kitFace(mama, 'girl'); kitFace(nieser, 'mustache'); kitFace(doener, 'kid');
const EXS = Array.from({ length: 34 }, (_, i) => { const c = makeExtra(scene, i + 11); kitFace(c, ['girl', 'plain', 'kid', 'hero', 'girl', 'mustache', 'kid', 'plain'][i % 8]); return c; });
console.log('cast', performance.now()|0); const MAIN = [ich, blau, genau, krass, digga, boah, mama, nieser, doener];
const NB = EXS; const POOL = [...MAIN, ...EXS];
POOL.forEach(c => outline(c.root, OC));
const HATS = POOL.map((c, i) => { const h = partyHat(c.head, i); h.visible = false; return h; });
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(.5, 'rgba(0,0,0,.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const PROPS = [];
const P_ = o => { if (!o.parent) scene.add(o); PROPS.push(o); return o; };
const COINS = Array.from({ length: 40 }, () => P_(euroCoin(scene, 1)));
const BALL = P_(basketball(null)), BALL2 = P_(basketball(null));
const WAGEN = P_(kinderwagen(null));
const HANT = P_(hantel(null, .9)), LANG = P_(langhantel(null, .7));
const WRAPS = Array.from({ length: 10 }, () => P_(doenerWrap(null, .9)));
const PHONE = P_(new THREE.Group()); box(1.1, 2.1, .14, mat(0x1a1a22, { roughness: .3, metalness: .4 }), .12, PHONE, 0, 0, 0);
const TISSUE = P_(sphere(.35, mat(0xf8f8fc, { roughness: 1, flatShading: true }), null, 0, 0, 0, 6, 5));
const DUST = Array.from({ length: 24 }, () => P_(sphere(1, mat(0xd8d0c4, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 8, 6)));
const SWEAT = Array.from({ length: 3 }, () => P_(sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const TEAR = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8)));
const SPRAY = Array.from({ length: 30 }, () => P_(sphere(.12, mat(0xe8f4ff, { roughness: .1, transparent: true, opacity: .8 }), scene, 0, 0, 0, 6, 4)));
const RING = P_(new THREE.Mesh(new THREE.TorusGeometry(1, .06, 6, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .7, depthWrite: false }))); RING.userData.noOutline = true;
const RINGS = Array.from({ length: 4 }, () => P_(new THREE.Mesh(new THREE.TorusGeometry(1, .5, 6, 64), new THREE.MeshBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: .4, depthWrite: false }))));
const CONF = Array.from({ length: 60 }, (_, i) => P_(new THREE.Mesh(new THREE.PlaneGeometry(.35, .5), new THREE.MeshBasicMaterial({ color: [0xffd23f, 0xffffff, 0x3a7ad8, 0xff4a8a, 0x8ad84a][i % 5], side: THREE.DoubleSide }))));
// ---------- ambiente ----------
const AIR = aire(scene, 300);
let MODE = 'day', SKYK = 'day';
function setSky(k, sunI = 3) { SKYK = k; applySky(SKY.material, k); const s = SKIES[k]; SUND.set(...s[3]).normalize(); sun.color.setRGB(...s[4]); sun.intensity = sunI; if (HQ) { scene.environment = ENVS[k]; scene.environmentIntensity = 1; }
  scene.fog.color.setRGB(...s[2]); }
function day(k = 'day') { MODE = 'day'; setSky(k, k === 'noon' ? 3.4 : 3.1); renderer.toneMappingExposure = 1.0; hemi.intensity = .9; hemi.color.setRGB(.8, .88, 1); hemi.groundColor.setRGB(.72, .6, .44); rim.intensity = 1.2; rim.color.setRGB(1, .94, .84);
  scene.fog.density = .00028; bloom.strength = .12; bloom.threshold = .95; FILL.intensity = 0; }
function dawn() { day('dawn'); sun.intensity = 2.6; hemi.intensity = .7; hemi.color.setRGB(.9, .74, .8); rim.color.setRGB(1, .62, .4); scene.fog.density = .0005; bloom.strength = .2; bloom.threshold = .88; }
function dusk() { day('dusk'); sun.intensity = 2.4; hemi.intensity = .65; hemi.color.setRGB(.9, .7, .8); rim.color.setRGB(1, .55, .35); scene.fog.density = .0005; bloom.strength = .22; bloom.threshold = .86; }
function storm() { day('storm'); sun.intensity = 1.8; hemi.intensity = 1.0; scene.fog.density = .00045; }
function night(fill = 30) { MODE = 'night'; setSky('night', .7); renderer.toneMappingExposure = 1.05; hemi.intensity = .5; hemi.color.setRGB(.45, .6, 1); hemi.groundColor.setRGB(.16, .16, .26); rim.intensity = 1.0; rim.color.setRGB(.7, .82, 1);
  scene.fog.density = .0012; bloom.strength = .38; bloom.threshold = .7; FILL.intensity = fill; FILL.color.setRGB(1, .86, .7); }
function inside(h = 1.0, fill = 40) { MODE = 'in'; setSky('day', 0); if (HQ) { scene.environment = ROOMENV; scene.environmentIntensity = .35; } renderer.toneMappingExposure = 1.0; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .5; bloom.strength = .2; bloom.threshold = .88; scene.fog.density = .0001; FILL.intensity = fill; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.blob.visible = true; c.aR.sh.rotation.y = 0; c.aL.sh.rotation.y = 0; }
  for (const h of HATS) h.visible = false; ich.props.tag.visible = false; if (krass.props.tasche) krass.props.tasche.visible = true;
  for (const p of PROPS) { p.visible = false; p.rotation.order = 'XYZ'; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const l of [...RF.LAMPS, ...ST.LAMPS]) l.userData.lamp.material.emissiveIntensity = .15; PL.FEST.visible = false; NP.FEST.visible = false;
  for (const k in SETS) SETS[k].visible = false; FX2D.length = 0; for (const l of LP) l.intensity = 0;
  FILL.color.setRGB(1, .96, .91); grade.uniforms.vig.value = .35; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = +(QS.get('sat') ?? 1.16); grade.uniforms.con.value = +(QS.get('con') ?? .22); grade.uniforms.warm.value = +(QS.get('warm') ?? .8); grade.uniforms.sharp.value = .5; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; SHAKE = 0; DOF = 1; BW = 0; BLOOMMAX = .24; day(); }
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
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
const tears = (ch, T, slot = 0) => { const h = hp(ch), s = ch.spec.scale || 1, a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a); for (let i = 0; i < 2; i++) { const k = (T * 1.1 + i * .5) % 1, sd = i ? -.3 : .3; const t = TEAR[slot * 2 + i]; t.visible = true; t.position.set(h.x + (fz * sd + fx * .68) * s, h.y + (.72 - k * 1.0) * s, h.z + (-fx * sd + fz * .68) * s); t.scale.setScalar(s); } };
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.5 + t * 1.4) * s * (.8 + r() * .5)); d.material.opacity = .4 * (1 - t / 1.2); }); }
// notas musicales que salen de un punto (las conchas cantan)
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));
const walkP = (T, i) => { const p = Math.sin(T * 9 + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
const runP = (T, i) => { const p = Math.sin(T * 13 + i); return { aLx: p * 1.1, aRx: -p * 1.1, aLe: 1.3, aRe: 1.3, lLx: -p * .9, lRx: p * .9, lLk: .3 + Math.max(0, p) * 1.1, lRk: .3 + Math.max(0, -p) * 1.1, lean: .25, headX: -.15 }; };
const climbP = (T, i) => { const p = Math.sin(T * 8 + i); return { aLx: 2.6 + p * .4, aRx: 2.6 - p * .4, aLe: .6 + Math.max(0, p) * .8, aRe: .6 + Math.max(0, -p) * .8, lLx: .9 + p * .5, lRx: .9 - p * .5, lLk: 1 + p * .5, lRk: 1 - p * .5, lean: .05 }; };
const sitPose = (extra = {}) => ({ lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, ...extra });
const sitY = (c, seat) => seat + .1 - 2.05 * (c.spec.scale || 1);
function sit(c, x, seat, z, ry, L, pose = {}) { put(c, x, sitY(c, seat), z, ry); actuar(c, 0, [[0, sitPose(pose)]], { T: L.T, weight: false }); c.blob.visible = false; return c; }
// ---------- gente ----------
const CR = EXS;
function crowdAt(L, cx, cz, n, r0, r1, seed = 1, o = {}) { POST.push(() => { const list = (o.list || CR).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc_ = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.2), ac + 6.283 - (o.gap ?? 1.2)];
  const placed = o.avoid ? [...o.avoid] : [];
  list.forEach((c, i) => { let x, z, tries = 0; do { const a = arc_[0] + (i + r() * .8) / list.length * (arc_[1] - arc_[0]); const d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; tries++; } while (tries < 10 && placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 3.6));
    placed.push([x, z]); crowdGuy(c, x, z, L, i, o); }); }); }
// fila/zona rectangular (x0..x1, z0..z1) con modo; útil para el paseo y el fondo marino
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
  else if (m === 'dig') { const j = Math.sin(L.T * 5 + i); actuar(c, 0, [[0, { crouch: .45, lean: .5, aLx: 1.2 + j * .3, aRx: 1.2 - j * .3, aLe: .6, aRe: .6, headX: .3 }]], { T: L.T }); cara(c, T, { expr: 'happy', mouth: 'smile' }); }
  else if (m === 'climb') { actuar(c, 0, [[0, climbP(L.T, i)]], { T: L.T }); cara(c, T, { expr: o.expr || 'determined', mouth: 'o' }); }
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); } }
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null, dy = 3.3) { const s = ch.spec.scale || 1, p = ch.root.position, c = V(p.x, p.y + dy * s, p.z); const q = easeInOut(clamp(k)); orbit(c, lerp(dist, dist2 ?? dist * .88, q) * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const toCam = ch => { const p = ch.root.position; ch.root.rotation.y = Math.atan2(camera.position.x - p.x, camera.position.z - p.z); };
// ---------- escenarios por plano ----------
function lp(i, x, y, z, k = 40, col = 0xffb060, d = 60) { const l = LP[i]; l.position.set(x, y, z); l.intensity = k; l.color.setHex(col); l.distance = d; }
function tod(t = 'day', fill = 26) { if (t === 'night') night(fill); else if (t === 'dawn') dawn(); else if (t === 'dusk') dusk(); else day(t); }
const RANKS = { normal: [['GENAU', '1.248.112 €', 'up'], ['KRASS', '862.540 €', 'up'], ['DIGGA', '411.907 €', 'up'], ['BOAH', '96.300 €', 'up'], ['DÖNER', '240 €'], ['HUSS', '3 €', 'me']],
  ende: [['HUSS', '1.000.000 €', 'up'], ['KRASS', '864.010 €'], ['DIGGA', '412.200 €'], ['BOAH', '96.410 €'], ['DÖNER', '1.130 €'], ['GENAU', '0 €', 'down']] };
let RKEY = ''; function ranking(k) { if (RKEY !== k) { RKEY = k; drawRanking(RF.BOARD, RANKS[k]); } }
function stadt(L, t = 'day', rk = 'normal') { use('RF'); tod(t); ranking(rk); if (t === 'night' || t === 'dusk') RF.LAMPS.forEach(l => l.userData.lamp.material.emissiveIntensity = t === 'night' ? 2.6 : 1.2); }
function villaS(L, t = 'noon', on = 1) { use('VI'); tod(t); VI.WP.userData.update(L.T, on); lp(0, VX, 6, 0, 30, 0xffc040, 26); }
function mallOut(L) { use('KC'); day('noon'); }
function mallIn(L) { use('KC'); inside(1.05, 34); lp(0, KIX, 30, 0, 60, 0xfff4e0, 120); lp(1, KIX, 14, -40, 40, 0xffd8f0, 70); }
function gym(L) { use('GY'); inside(.75, 22); lp(0, GX, 18, -18, 70, 0xff3a3a, 40); lp(1, GX, 20, 10, 50, 0xf4f8ff, 60); }
function strasseS(L, t = 'day') { use('ST'); tod(t); if (t === 'night' || t === 'dusk') ST.LAMPS.forEach(l => l.userData.lamp.material.emissiveIntensity = t === 'night' ? 2.6 : 1.2); }
function party(L) { use('PG'); night(30); const T = L.T; lp(0, PX - 14, 14, -10, 60, [0xff3a8a, 0x3a8aff, 0x9a5aff][Math.floor(T * 2.4) % 3], 50); lp(1, PX + 14, 14, -6, 60, [0x3affb0, 0xffd23f, 0xff5a3a][Math.floor(T * 2.4 + 1) % 3], 50); lp(2, PX + 20, 8, 12, 50, 0xffb060, 30); PG.disco.rotation.y = T; BLOOMMAX = .4; }
let SKEY = ''; function score(P, a, b) { const k = a + ':' + b; if (SKEY !== k) { SKEY = k; drawScore(P.SB, a, b); } }
function platzS(L, t = 'night', fest = false, sc = [0, 0]) { use('PL'); tod(t, 22); PL.FEST.visible = fest; score(PL, ...sc); PL.LAMPS.forEach(l => l.material.emissiveIntensity = t === 'night' ? 2.4 : .2); if (t === 'night') { lp(0, BX - 18, 21, -28, 90, 0xfff0d0, 70); lp(1, BX + 18, 21, 28, 90, 0xfff0d0, 70); } }
function neuPlatz(L, t = 'dusk') { use('NP'); tod(t); NP.FEST.visible = true; drawScore(NP.SB, 'H', 'U', { l: 'HUSS', r: 'HUSS' }); }
// ---------- física de monedas y balón ----------
// ráfaga de n monedas desde c (V) en T0: salen hacia arriba con dispersión, caen con gravedad y rebotan en el suelo (y0)
function coinBurst(c, T0, T, n = 8, slot = 0, o = {}) { const t = T - T0; if (t < 0 || t > (o.life ?? 1.6)) return; const g = 30, y0 = o.y0 ?? 0;
  for (let i = 0; i < n; i++) { const m = COINS[(slot + i) % COINS.length]; const r = RNG(i * 13 + slot * 7 + 1); const a = r() * PI * 2, sp = (o.spread ?? 3) * (.4 + r()), vy = (o.vy ?? 11) * (.7 + r() * .5);
    let y = c.y + vy * t - .5 * g * t * t, x = c.x + Math.cos(a) * sp * t, z = c.z + Math.sin(a) * sp * t; if (y < y0 + .1) { const tc = (vy + Math.sqrt(vy * vy + 2 * g * (c.y - y0))) / g, tb = t - tc; y = y0 + .1 + Math.max(0, vy * .35 * tb - .5 * g * tb * tb); }
    m.visible = true; m.position.set(x, y, z); m.rotation.set(t * 9 * (r() + .5), t * 6, 0); m.scale.setScalar(o.s ?? .8); } }
// moneda que vuela de un punto a otro (cobrar): arco
function coinFly(a, b, T0, T, n = 3, slot = 30, dur = .5) { for (let i = 0; i < n; i++) { const k = clamp((T - T0 - i * .1) / dur); if (k <= 0 || k >= 1) continue; const m = COINS[(slot + i) % COINS.length]; m.visible = true; m.position.copy(arc([a.x, a.y, a.z], [b.x, b.y, b.z], 2.5, easeInOut(k))); m.rotation.set(0, k * 12, 0); m.scale.setScalar(.75); } }
// balón botando en la mano de ch (dribbling) con física simple; devuelve la fase del bote (0 = suelo)
function dribble(ch, T, sp = 2.6, ball = BALL) { const ph = (T * sp) % 1, h = hp(ch), a = ch.root.rotation.y, s = ch.spec.scale || 1; const hx = h.x + Math.sin(a) * 1.2 * s + Math.cos(a) * 1.1 * s, hz = h.z + Math.cos(a) * 1.2 * s - Math.sin(a) * 1.1 * s;
  const top = ch.root.position.y + 3.0 * s, y = ch.root.position.y + .62 + (top - ch.root.position.y - .62) * Math.abs(Math.cos(ph * PI)); ball.visible = true; ball.position.set(hx, y, hz); ball.rotation.x = T * 6; return ph; }
const dribP = (T, sp = 2.6) => { const q = Math.abs(Math.cos((T * sp) % 1 * PI)); return { aRx: .8 + q * .5, aRz: -.15, aRe: .9 - q * .5, aLx: .4, aLz: .3, aLe: .8, crouch: .18, lean: .18, lLx: .3, lRx: -.2, lLk: .4, lRk: .3, headX: .1 }; };
// tiro: balón en arco desde la mano hasta el aro (k 0..1), con giro
function shotBall(a, rim, k, ball = BALL) { ball.visible = true; ball.position.copy(arc([a.x, a.y, a.z], [rim.x, rim.y + .4, rim.z], 5, clamp(k))); ball.rotation.x = k * 14; if (k > 1) ball.position.set(rim.x, rim.y - (k - 1) * 18, rim.z); }
const rimW = (P, K) => { K.updateMatrixWorld(true); return K.localToWorld(K.userData.rim.clone()); };
function confetti(c, T0, T, n = 60, h = 14) { const t = T - T0; if (t < 0) return; CONF.forEach((p, i) => { if (i >= n) return; const r = RNG(i * 3 + 1); p.visible = true; p.position.set(c.x + (r() - .5) * 30 + Math.sin(T * 2 + i) * 1.2, c.y + h - ((t * (2 + r() * 2) + r() * h) % h), c.z + (r() - .5) * 20); p.rotation.set(T * 3 + i, T * 2 + i * .7, 0); }); }
// «+1 €» que sube y se desvanece sobre un punto 3D
function plus(w3, T0, T, text = '+1 €', kind = 'gold', sc = 1) { const t = T - T0; if (t < 0 || t > 1.1) return; BAD_.push({ kind, text, w3: w3.clone().add(V(0, t * 2.2, 0)), s: spring(clamp(t * 4) * 1.6) * sc * .8, a: 1 - clamp((t - .7) / .4), on: true }); }
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
const KEY = /^(Stadt|Euro|Namen|Haken|anderes|Bürgermeister|Genau|goldenen|Whirlpool|Krass|Einkaufszentrum|Digga|Baby|reich|Boah|Huss|HUSS|Niemand|dreizehn|drei|Zwei|Mama|niesen|Party|Plan|eins|Namensschild|Hans|Null|zwei|Döner|gratis|zweihundertvierzig|allein|Ein|Sechs|Neun|Platz|Hoodie|blauen|Spiel|fertig|Sechzig|Punkte|gut|gefeiert|Nacht|trainierten|pleite|Freitag|Million|besten|Welt|Danke)$/i;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
let DARK = 0, TINT = null, SHAKE = 0, BW = 0, BLOOMMAX = .24; const FX2D = [];
// ---------- a: gancho, la regla, Genau, Krass, Digga, Boah, yo (0 – 23,98 s) ----------
// helpers de esta pieza
function walk(ch, L, x, z, ry, sp = 2.4, i = 0, o = {}) { const d = sp * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, (o.y ?? 0) + Math.abs(Math.sin(L.T * 9 + i)) * .1, z + Math.cos(ry) * d, ry); actuar(ch, 0, [[0, { ...walkP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); if (o.expr !== false) cara(ch, L.T + i, { expr: o.expr || 'neutral', mouth: o.mouth }); return ch; }
function run(ch, L, x, z, ry, sp = 9, i = 0, o = {}) { const d = sp * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, (o.y ?? 0) + Math.abs(Math.sin(L.T * 13 + i)) * .35, z + Math.cos(ry) * d, ry); actuar(ch, 0, [[0, { ...runP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); cara(ch, L.T + i, { expr: o.expr || 'shock', mouth: o.mouth || 'o' }); return ch; }
function pose(ch, x, y, z, ry, L, p = {}, expr = 'neutral', ex = {}) { put(ch, x, y, z, ry); actuar(ch, 0, [[0, typeof p === 'string' ? p : { headY: Math.sin(L.T * .9 + ch.seed) * .12, ...p }]], { T: L.T }); cara(ch, L.T, { expr, ...ex }); return ch; }
const WAVE = (T, i = 0) => ({ aRx: 2.7, aRz: .35 + Math.sin(T * 12 + i) * .35, aRe: .5, aLx: .2, headY: 0 });
const SHOUT = { aRx: 1.2, aRz: .5, aRe: 1.9, aLx: 1.2, aLz: .5, aLe: 1.9, lean: -.08, headX: -.18 };
const money = (t, k, kind = 'gold', y = .12) => badge(kind, t, W / 2, H * y, k);
// saludo: a dice el nombre de b (bocadillo desde la boca) y a b le salta una ráfaga de monedas con «+1 €»
function greet(a, b, L, name, t0, slot = 0, o = {}) { const k = (L.lt - t0) * 3; if (L.lt > t0) bubble(a, name, k, o.dy ?? 1.6); if (L.lt > t0 + .18) { const h = hp(b); coinBurst(h.clone().add(V(0, 1.4, 0)), L.t0 + t0 + .18, L.T, o.n ?? 6, slot, { y0: b.root.position.y, vy: 9, spread: 2.6 }); plus(h.clone().add(V(0, 2.6, 0)), L.t0 + t0 + .2, L.T, o.plus ?? '+1 €'); } }

// 1 «In dieser Stadt bekommst du»: GANCHO. Plaza de Rufingen (la Namensbank al fondo): la gente camina, de pronto se para, se saluda y
// de cada boca sale un bocadillo con un nombre; al nombrado le saltan monedas de euro. Golpe de zoom + zoom lento.
shot(0, 'C', 'hook', L => { stadt(L); const stop = L.lt > .32;
  const A = [EXS[0], EXS[1]], B = [EXS[2], EXS[3]], C2 = [EXS[4], EXS[5]];
  for (const [p, x, z, ry, nm, sl] of [[A, 1.5, 42, -PI / 2, 'HALLO, LENA!', 0], [B, -9.5, 36, PI / 2, 'MOIN, TOM!', 8], [C2, 9.5, 34, -PI / 2, 'SERVUS, ANNA!', 16]]) {
    const [a, b] = p; if (!stop) { walk(a, L, x - Math.sin(ry) * 1.5, z, ry, 2.2, 1); walk(b, L, x - Math.sin(ry) * 6, z + .5, ry + PI, 2.2, 2); }
    else { pose(a, x + Math.sin(ry) * .2, 0, z, ry, L, WAVE(L.T, sl), 'happy', { mouth: 'open_smile' }); pose(b, x - Math.sin(ry) * 3.0, 0, z + .5, ry + PI, L, { aRx: 2.2, aRz: .4, aRe: .6 }, 'joy', { mouth: 'open_smile' }); greet(a, b, L, nm, .36 + sl * .03, sl, { n: 5 }); } }
  crowdBox(L, -26, 26, -6, 8, 10, 3, { mode: 'walk' }); crowdBox(L, -26, -16, 26, 34, 3, 4, { mode: 'talk' }); crowdBox(L, 16, 26, 26, 34, 3, 5, { mode: 'talk' });
  cm([0, 6.4, 62, 0, 4.6, 38, 46], [0, 6, 57, 0, 4.6, 38, 44], L.k); SHC = V(0, 0, 40); },
  [[.36, 'coin_jingle', .8], [.42, 'cash', .6], [.5, 'crowd_happy', .5], [.0, 'footsteps', .5]]);
// 2 «jedes Mal einen Euro»: delante de la heladería: un chico grita «LENA!» y a Lena le salta otra ráfaga; contador 1 €
shot(1.41, 'Z', 'punch', L => { stadt(L); const lena = EXS[1], paul = EXS[6];
  pose(lena, -38, 0, 64, PI / 2 + .4, L, L.lt > .25 ? { aLx: 1.9, aLz: 1.1, aRx: 1.9, aRz: 1.1, aLe: .3, aRe: .3 } : { aRx: .3 }, L.lt > .25 ? 'joy' : 'happy', { mouth: 'open_smile' });
  pose(paul, -33, 0, 66, -PI / 2 - .2, L, WAVE(L.T, 2), 'happy', { mouth: 'open_smile' }); greet(paul, lena, L, 'LENA!', .12, 20, { n: 8 });
  crowdBox(L, -42, -38, 54, 60, 2, 5, { mode: 'look' }); orb(L.k, V(-35.5, 3.4, 65), null, [19, .75, .18, 46], [16.5, .9, .14, 46]);
  money('1 €', (L.lt - .3) * 3); }, [[.15, 'coin_jingle', .8], [.3, 'ding_reveal', .6]]);
// 3 «wenn jemand deinen Namen sagt»: la Namensbank: el marcador gigante con los nombres que más ganan; la cámara sube hacia él
shot(3.01, 'W', null, L => { stadt(L); crowdBox(L, -22, 22, -38, -26, 12, 6, { mode: i => ['look', 'point', 'talk'][i % 3], face: V(0, 18, -48) });
  cm([0, 6, 8, 0, 14, -48, 52], [0, 13, -4, 0, 18, -48, 50], L.k); }, [[.1, 'crowd_murmur', .5], [.6, 'click_set', .5]]);
// 4 «Der Haken:»: Tom, solo, se grita su propio nombre: «TOM! TOM!» … 0 €
shot(4.5, 'F', 'punch', L => { stadt(L); const tom = EXS[3]; pose(tom, 20, 0, 92, -PI / 2 - .3, L, SHOUT, 'shout', { mouth: 'o' }); if (L.lt > .1) bubble(tom, 'TOM! TOM!', (L.lt - .1) * 3, 1.6);
  if (L.lt > .55) { money('0 €', (L.lt - .55) * 3, 'red'); }
  crowdBox(L, 6, 14, 84, 100, 3, 7, { mode: 'look', expr: 'confused' }); orb(L.k, V(20, 3.0, 92), null, [16, -PI / 2 - .3 + .25, .12, 44], [14, -PI / 2 - .3 + .05, .1, 44]); }, [[.1, 'shout_echo', .5], [.6, 'buzzer_wrong', .6]]);
// 5 «Jemand anderes muss ihn sagen»: su amiga llega por detrás: «Hey, TOM!» → monedas, Tom salta
shot(5.9, 'S', null, L => { stadt(L); const tom = EXS[3], fr = EXS[7]; pose(fr, 15.4, 0, 93, PI / 2 - .2, L, WAVE(L.T, 4), 'happy', { mouth: 'open_smile' });
  const j = L.lt > .3 ? Math.max(0, Math.sin((L.lt - .3) * 8)) * .8 : 0; pose(tom, 20, j, 92, -PI / 2 - .1, L, L.lt > .3 ? { aLx: 2.8, aLz: .5, aRx: 2.8, aRz: .5 } : {}, L.lt > .3 ? 'joy' : 'confused', { mouth: L.lt > .3 ? 'open_smile' : undefined });
  greet(fr, tom, L, 'HEY, TOM!', .08, 4, { n: 8 }); orb(L.k, V(17.6, 3.4, 92.5), null, [21, .15, .1, 46], [19, -.08, .08, 46]); money('+1 €', (L.lt - .3) * 3, 'green'); }, [[.3, 'coin_jingle', .8], [.35, 'cash', .5]]);
// 6 «Unser Bürgermeister heißt»: Genau en la escalinata de la Namensbank saluda a la multitud que le aplaude
shot(6.82, 'R', null, L => { stadt(L); pose(genau, 0, 4, -46.5, 0, L, WAVE(L.T, 1), 'happy', { mouth: 'open_smile' });
  crowdBox(L, -20, 20, -42, -36, 12, 8, { mode: i => i % 3 ? 'cheer' : 'clap', face: V(0, 5, -46) }); badge('tag', 'BÜRGERMEISTER', W / 2, H * .12, (L.lt - .15) * 3);
  cm([-5, 9.5, -31, 0, 6.8, -46.5, 46], [4, 9.2, -33, 0, 6.8, -46.5, 44], L.k); SHC = V(0, 4, -40); }, [[0, 'crowd_cheer', .6], [.2, 'applause', .5]]);
// 7 «Genau.»: primer plano de Genau, orgulloso, con la Amtskette; su nombre en grande
shot(7.84, 'C', 'punch', L => { stadt(L); pose(genau, 0, 4, -46.5, .15, L, { aRx: .5, aRz: -.3, aRe: 1.6, aLx: .5, aLz: -.3, aLe: 1.6, lean: -.05 }, 'smug', { mouth: 'grin' });
  onFace(genau, 5.2, -.2, .6, 40, L.k, 4.6); badge('big', 'GENAU', W / 2, H * .13, (L.lt - .05) * 3.5); }, [[0, 'whoosh_up', .5], [.1, 'ding_reveal', .6]]);
// 8 «Genau,»: dos vecinas en la terraza del café asienten: «Genau!» → monedas que salen volando hacia el Rathaus
shot(8.56, 'G', null, L => { stadt(L); const a = EXS[8], b = EXS[9]; pose(a, 35, 0, 55, -PI / 2 + .6, L, { aRx: 1.2, aRe: 1.4, headX: .15 * Math.sin(L.T * 14) }, 'happy', { mouth: 'open_smile' }); pose(b, 32.5, 0, 57.5, PI - .5, L, { aLx: .6 }, 'happy', { mouth: 'smile' });
  if (L.lt > .05) bubble(a, 'GENAU!', (L.lt - .05) * 4, 1.6); coinFly(hp(a).add(V(0, 2, 0)), V(0, 30, -60), L.t0 + .12, L.T, 4, 0, .45); plus(hp(a).add(V(0, 3, 0)), L.t0 + .1, L.T, '+1 € GENAU', 'gold', .8);
  orb(L.k, V(33.8, 3.4, 56.3), null, [18, -.85, .12, 46], [16, -.65, .1, 46]); }, [[.05, 'coin_jingle', .7]]);
// 9 «genau,»: en el puesto del mercado, el panadero y una clienta: «Genau, genau!»
shot(9.08, 'W', null, L => { stadt(L); const a = EXS[10], b = EXS[11]; pose(a, -36, 0, 93, PI / 2, L, { aRx: 1.3, aRz: .2, aRe: 1.2, headX: .2 * Math.sin(L.T * 16) }, 'happy', { mouth: 'open_smile' }); pose(b, -32.4, 0, 94, -PI / 2, L, { aLx: 1.0, aLe: 1.2 }, 'happy', { mouth: 'open_smile' });
  if (L.lt > .02) bubble(b, 'GENAU!', (L.lt - .02) * 4, 1.6); coinFly(hp(b).add(V(0, 2, 0)), V(0, 30, -60), L.t0 + .08, L.T, 4, 4, .4); plus(hp(b).add(V(0, 3, 0)), L.t0 + .08, L.T, '+1 € GENAU', 'gold', .8);
  orb(L.k, V(-34.2, 3.4, 93.5), null, [17, .1, .14, 46], [15.5, -.15, .1, 46]); }, [[.04, 'coin_jingle', .7]]);
// 10 «genau!»: Genau en la plaza con los brazos abiertos: le llueven monedas por todas partes; contador que no para
shot(9.52, 'Z', null, L => { stadt(L); pose(genau, 0, 0, 6, 0, L, { aLx: 2.4, aLz: .9, aRx: 2.4, aRz: .9, headX: -.3 }, 'joy', { mouth: 'open_smile' });
  coinBurst(V(0, 14, 6), L.t0 - .2, L.T, 24, 0, { y0: 0, vy: 2, spread: 5, life: 2 }); crowdAt(L, 0, 6, 8, 9, 13, 4, { mode: 'point', face: V(0, 4, 6) });
  orb(L.k, V(0, 3.6, 6), null, [15, .1, .25, 46], [12, -.1, .18, 46]); money('1.248.112 €', (L.lt - .05) * 3); }, [[0, 'coins_rain', .8], [.3, 'cash', .5]]);
// 11 «Deshalb hat er einen goldenen Whirlpool.»: la villa: Genau sumergido en su jacuzzi de oro, burbujas; zoom lento
shot(10.24, 'P', 'slow', L => { villaS(L); pose(genau, VX, .55, -1, 0, L, { aLx: .2, aLz: 1.35, aRx: .2, aRz: 1.35, aLe: .2, aRe: .2, lean: -.25, lLx: 1.4, lRx: 1.4 }, 'happy', { eyes: 'happy', mouth: 'smile' }); genau.blob.visible = false;
  cm([VX + 10, 13, 32, VX, 3, -1, 46], [VX + 6, 9, 22, VX, 3.6, -1, 44], L.k); badge('gold', 'GOLD', W / 2, H * .13, (L.lt - .5) * 3); }, [[0, 'bubbles', .8], [.2, 'water_jacuzzi', .6]]);
// 12 «Whirlpool.»: Genau lanza monedas al aire que caen sobre el borde dorado y rebotan
shot(11.54, 'F', null, L => { villaS(L); pose(genau, VX, .55, -1, .2, L, { aRx: 2.6 - Math.min(1, L.lt * 3) * .8, aRz: .3, aRe: .3, aLx: .2, aLz: 1.3, lean: -.2, lLx: 1.4, lRx: 1.4 }, 'joy', { mouth: 'laugh' }); genau.blob.visible = false;
  coinBurst(V(VX + 2.6, 5, 1), L.t0 + .05, L.T, 10, 0, { y0: 2.6, vy: 7, spread: 4 }); onFace(genau, 7, .6, 1.4, 42, L.k, 6.2); }, [[.05, 'coin_toss', .8], [.5, 'coins_bounce', .6]]);
// 13 «Dann gibt es ein Mädchen namens Krass.»: Krass pasea por la plaza con su bolso de oro; la gente: «KRASS!» y le saltan monedas
shot(12.36, 'S', null, L => { stadt(L); walk(krass, L, -2, 70, PI, 2.4, 0, { expr: 'smug', mouth: 'smile', pose: { aLx: .5, aLe: 1.3 } });
  const a = EXS[12], b = EXS[13]; pose(a, -7, 0, 66, PI / 2 - .3, L, { aLx: 1.3, aLz: .6, aLe: 1.9, aRx: 1.3, aRz: .6, aRe: 1.9 }, 'shock', { mouth: 'o' }); pose(b, 3, 0, 66, -PI / 2 + .3, L, 'point', 'shock', { mouth: 'o' });
  greet(a, krass, L, 'KRASS!', .2, 0, { n: 5 }); greet(b, krass, L, 'KRASS!', .55, 6, { n: 5 }); crowdBox(L, -24, 24, 80, 90, 5, 9, { mode: 'look', expr: 'shock', face: V(-2, 4, 64) });
  cm([-2, 5, 58, -2, 3.8, 68, 46], [-2, 5, 56.5, -2, 3.8, 66, 46], L.k); }, [[.2, 'coin_jingle', .7], [.55, 'coin_jingle', .7], [0, 'heels', .6]]);
// 14 «Krass.»: primer plano: Krass se baja las gafas de oro y guiña
shot(13.5, 'C', 'punch', L => { stadt(L); const g = clamp(L.lt * 3); pose(krass, -2, 0, 66, .2, L, { aRx: 2.3 - g * .3, aRz: -.2, aRe: 2.0, headX: .08 }, 'smug', { eyes: L.lt > .35 && L.lt < .55 ? 'wink' : 'half', mouth: 'smirk' });
  onFace(krass, 4.6, 0, .5, 40, L.k, 4.1); badge('big', 'KRASS', W / 2, H * .13, (L.lt - .05) * 3.5); }, [[0, 'whoosh_up', .5], [.4, 'sparkle', .6]]);
// 15 «Ihr gehört das Einkaufszentrum.»: el KRASS CENTER: Krass delante, la cámara sube hasta el letrero dorado
shot(14.18, 'Z', null, L => { mallOut(L); pose(krass, KX, 0, -4, 0, L, { aRx: 2.6, aRz: .6, aRe: .3, aLx: .5, aLe: 1.3 }, 'happy', { mouth: 'open_smile' });
  crowdBox(L, KX - 34, KX - 10, -12, 0, 5, 11, { mode: i => i % 2 ? 'walk' : 'look', face: V(KX, 30, -40) }); crowdBox(L, KX + 10, KX + 34, -12, 0, 5, 12, { mode: 'look', face: V(KX, 30, -40) }); cm([KX, 5, 14, KX, 4.5, -4, 50], [KX, 9, 30, KX, 36, -40, 52], L.k, easeIn); }, [[0, 'mall_ambience', .6], [.3, 'ding_reveal', .6]]);
// 16 «Einkaufszentrum.»: dentro: Krass cruza el atrio entre tiendas; los clientes: «KRASS!» → monedas
shot(15.0, 'W', null, L => { mallIn(L); walk(krass, L, KIX, 6, 0, 2.4, 0, { expr: 'smug', mouth: 'smile', pose: { aLx: .5, aLe: 1.3 } });
  const a = EXS[14]; pose(a, KIX - 5, 0, 10, PI / 2 + .3, L, 'point', 'shock', { mouth: 'o' }); greet(a, krass, L, 'KRASS!', .15, 12, { n: 6 });
  crowdBox(L, KIX - 30, KIX + 30, -20, 0, 9, 12, { mode: 'walk' }); cm([KIX + 1.5, 5.5, 21, KIX, 4.4, 7, 46], [KIX + 1, 5.5, 19.5, KIX, 4.4, 7.6, 46], L.k); }, [[.15, 'coin_jingle', .7], [0, 'mall_ambience', .5]]);
// 17 «Der Typ aus dem Fitnessstudio heißt»: DIGGA GYM: Digga hace curl con mancuerna frente al espejo
shot(15.72, 'R', null, L => { gym(L); const c = Math.abs(Math.sin(L.T * 3.2)); pose(digga, GX - 4, 0, -12, .3, L, { aRx: .3 + c * 1.6, aRe: .4 + c * 2.0, aLx: .2, aLz: .3, aLe: .5, lean: -.04 }, 'determined', { mouth: 'grimace' });
  attach(HANT, digga.aR.hand, [0, -.5, .1], [0, PI / 2, 0], .55); sweat(digga, L.T);
  const b = EXS[15]; pose(b, GX + 8, 0, -6, -PI / 2, L, { aLx: 1.5 + Math.sin(L.T * 6) * .3, aRx: 1.5 - Math.sin(L.T * 6) * .3 }, 'determined');
  orb(L.k, V(GX - 3, 4.2, -11), null, [17, .3, .1, 46], [14.5, -.1, .06, 46]); }, [[0, 'gym_clank', .7], [.6, 'grunt', .5]]);
// 18 «Digga.»: Digga, de frente, saca bíceps; su nombre en grande
shot(17.14, 'C', 'punch', L => { gym(L); pose(digga, GX, 0, -8, 0, L, { aLx: 1.6, aLz: 1.4, aLe: 2.3, aRx: 1.6, aRz: 1.4, aRe: 2.3, crouch: .05 }, 'smug', { mouth: 'grin' });
  onBody(digga, 10, .1, .12, 44, L.k, 8.6); badge('big', 'DIGGA', W / 2, H * .13, (L.lt - .05) * 3.5); }, [[0, 'flex_pop', .6], [.1, 'ding_reveal', .6]]);
// 19–21 «Digga, Digga, Digga.»: tres saludos de colegas en el gimnasio; cada uno le hace saltar monedas
for (const [i, t0, tr, nm] of [[0, 17.63, 'G', 'DIGGA!'], [1, 18.08, 'W', 'DIGGA!!'], [2, 18.58, 'Z', 'DIGGAAA!']])
  shot(t0, tr, i === 2 ? 'punch' : null, L => { gym(L); const b = EXS[16 + i], x = GX + [-14, 10, 0][i], z = [-2, 6, -6][i], ry = [.5, -.4, 0][i];
    pose(digga, x + Math.sin(ry) * 3.4, 0, z + Math.cos(ry) * 3.4, ry + PI, L, i === 1 ? { aRx: 2.6, aRz: -.4, aRe: .2 } : { aRx: 1.6, aRe: .3, aLx: .5, aLz: .3 }, 'joy', { mouth: 'open_smile' });
    pose(b, x, 0, z, ry, L, i === 1 ? { aRx: 2.6, aRz: .4, aRe: .2 } : { aRx: 1.6, aRe: .3, lean: .1 }, 'happy', { mouth: 'open_smile' });
    greet(b, digga, L, nm, .03, 8 + i * 8, { n: 7 }); orb(L.k, V(x + Math.sin(ry) * 1.7, 3.8, z + Math.cos(ry) * 1.7), null, [19, ry + PI / 2 + .25, .1, 46], [17, ry + PI / 2 + .1, .08, 46]); }, [[.04, 'fist_bump', .6], [.08, 'coin_jingle', .7]]);
// 22 «Sogar das Baby ist reich.»: mi calle: una niñera empuja el cochecito de oro; Boah, con babero de oro, mueve las manitas
shot(19.04, 'S', null, L => { strasseS(L); const n = EXS[18], z0 = 16 - L.lt * 2.2; walk(n, L, SX + 12, 26, PI, 2.2, 0, { expr: 'happy', mouth: 'smile', pose: { aLx: 1.3, aRx: 1.3, aLe: .3, aRe: .3 } });
  const wz = n.root.position.z - 5.6; show(WAGEN, SX + 12, 0, wz, PI / 2, .9); put(boah, SX + 12, 2.4, wz - .4, PI); actuar(boah, 0, [[0, { aLx: 1.6 + Math.sin(L.T * 9) * .5, aRx: 1.6 - Math.sin(L.T * 9) * .5, lLx: 1.4, lRx: 1.4 }]], { T: L.T }); cara(boah, L.T, { expr: 'joy', mouth: 'open_smile' }); boah.blob.visible = false;
  coinBurst(V(SX + 12, 6, wz - .4), L.t0 + .3, L.T, 6, 0, { y0: 2.4, vy: 5, spread: 1.5 }); cm([SX + 15.5, 5, wz - 12, SX + 12, 3, wz, 44], [SX + 15, 5, wz - 10, SX + 12, 3, wz + 1, 44], L.k); }, [[0, 'stroller_roll', .6], [.3, 'baby_giggle', .6]]);
// 23 «Es heißt Boah.»: dos vecinos se asoman al cochecito: «BOAH!» → le llueven monedas al bebé, que se ríe
shot(20.57, 'I', null, L => { strasseS(L); show(WAGEN, SX + 12, 0, 6, -PI / 2, .9); put(boah, SX + 12, 2.4, 6.4, 0); actuar(boah, 0, [[0, { aLx: 2.6, aRx: 2.6, aLz: .4, aRz: .4, lLx: 1.4, lRx: 1.4 }]], { T: L.T }); cara(boah, L.T, { expr: 'joy', mouth: 'laugh' }); boah.blob.visible = false;
  const a = EXS[19], b = EXS[20]; pose(a, SX + 8, 0, 5, PI / 2, L, { lean: .35, aLx: 1.2, aLz: .5, aLe: 1.8, aRx: 1.2, aRz: .5, aRe: 1.8 }, 'shock', { mouth: 'o' }); pose(b, SX + 16, 0, 6.6, -PI / 2, L, { lean: .35, aLx: 1.2, aLz: .5, aLe: 1.8, aRx: 1.2, aRz: .5, aRe: 1.8 }, 'shock', { mouth: 'o' });
  greet(a, boah, L, 'BOAH!', .05, 0, { n: 8, dy: 1.4 }); greet(b, boah, L, 'BOAH!', .3, 10, { n: 8, dy: 1.4 }); badge('big', 'BOAH', W / 2, H * .13, (L.lt - .55) * 3);
  cm([SX + 12, 8.5, 21, SX + 12, 3.4, 6, 44], [SX + 12, 8, 18.5, SX + 12, 3.4, 6, 44], L.k); }, [[.05, 'coin_jingle', .7], [.3, 'coin_jingle', .7], [.5, 'baby_laugh', .6]]);
// 24 «Und ich?»: golpe de zoom: yo, sentado solo en el escalón de mi casa
shot(21.51, 'C', 'punch', L => { strasseS(L); sit(ich, SX - 19.4, 1.6, 0, PI / 2, L, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6, headX: .1 }); cara(ich, L.T, { expr: 'sad', mouth: 'flat' });
  crowdBox(L, SX + 10, SX + 16, -20, 20, 3, 14, { mode: 'walk', ry: 0 }); onFace(ich, 4.4, .2, -.6, 42, L.k, 3.8); }, [[0, 'whoosh_soft', .4], [.1, 'crickets', .4]]);
// 25 «Ich heiße Huss.»: me levanto y señalo el buzón con mi nombre: HUSS
shot(22.08, 'F', null, L => { strasseS(L); pose(ich, SX - 18.6, 0, 2.6, PI / 2 + .55, L, { aRx: 1.5, aRz: -.4, aRe: .1, headY: .3 }, 'happy', { mouth: 'smile' });
  cm([SX - 4, 5, 6, SX - 18.5, 4.2, 4.6, 46], [SX - 5, 5, 5.6, SX - 18.5, 4.2, 4.7, 46], L.k); badge('tag', 'HUSS', W / 2, H * .13, (L.lt - .2) * 3); }, [[.2, 'pling', .5]]);
// 26 «Niemand sagt ihn.»: la gente pasa a mi lado sin mirarme; yo con la mano levantada, nadie dice nada
shot(22.99, 'W', null, L => { strasseS(L); pose(ich, SX - 13, 0, 0, PI / 2, L, { aRx: 2.4, aRz: .3, aRe: .4 }, 'sad', { mouth: 'flat' });
  walk(EXS[21], L, SX - 11, 14, PI, 2.4, 1); walk(EXS[22], L, SX - 15, -10, 0, 2.2, 2); walk(EXS[23], L, SX - 12, 20, PI, 2.6, 3, { pose: { headY: -.6 } });
  money('0 €', (L.lt - .3) * 3, 'red'); cm([SX + 2, 4.5, 4, SX - 13, 3.8, 0, 44], [SX + 1, 4.5, 1, SX - 13, 3.8, 0, 44], L.k); }, [[0, 'footsteps', .5], [.4, 'crickets', .5]]);


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
window.DBG = { THREE, applyPose, hp, ich, blau, genau, cam, renderer, composer, bloom, sun, grade, scene, camera, RF, PL };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

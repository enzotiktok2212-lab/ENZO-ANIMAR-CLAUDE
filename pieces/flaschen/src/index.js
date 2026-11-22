// FLASCHEN — «In dieser Stadt sitzt jeder auf einer Flasche»: no hay sillas; las botellas son tapones de algo encerrado hace 300 años. 1080×1920, 30 fps.
// Réplica de la estructura del viral con otra ciudad (Hufenbach con el Dom), otro reparto (Noah, Oma, la alcaldesa Dorn) y otros datos.
// Planos en src/p/*.js; armar.py los une en src/index.js.
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { hufenbach, townhouse } from './gort.js';
import { makeExtra } from './ecast.js';
import { klasse, omaStube } from './svsets.js';
import { makeOma } from './gvolk.js';
import { makeBaecker } from './zcast.js';
import { makeCop } from './gcast.js';
import { makeLehrerin } from './acast.js';
import { makeNoah, makeDorn, makeZahn } from './fcast.js';
import { bottle, looseBottle, hole, gamerChair, bigParcel, dom, zahnarzt, tramIn, shopScreen, zimmerF, hoehle, sotano, glowM, basicGlow, LILA } from './fsets.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 96.9, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const QS = new URLSearchParams(location.search);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = QS.get('ao') !== '0';
const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: .0008, maxblur: .01 }); composer.insertPass(bokeh, 2); let DOF = 1;
let CAMT = new THREE.Vector3(); { const la = camera.lookAt.bind(camera); camera.lookAt = (...a) => { if (a.length === 3) CAMT.set(...a); else CAMT.copy(a[0]); la(...a); }; }
// supermuestreo (?ss=2 por defecto): se renderiza al doble y se reduce al dibujar → bordes nítidos sin dientes
const SS = +(QS.get('ss') ?? 2); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -.0003; sun.shadow.normalBias = .12; sun.shadow.radius = 2.5; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-95, 105, 85)); rim.target.position.copy(p); rim.position.copy(p).add(V(70, 45, -100)); }
// bordes marcados: personajes 3, escenarios 2,2, atrezo 1,8 (a la resolución de salida; se escalan con el supermuestreo)
const OC = 2 * SS, OS = 1.5 * SS, OP = 1.25 * SS;
// ---------- escenarios ----------
// Hufenbach (x = 0) = «Domplatz»: plaza x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (-6, -92); fuente (-18, -24); café (36, -40); el Dom al oeste (x = -84, mira a +x).
const HB = hufenbach(scene);
[HB.RANK, HB.BOX, HB.PRICE, HB.KINO, HB.TS].forEach(o => o && (o.visible = false));
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3), 20 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { if (z < 22 && z > -62) continue; townhouse(HB.G, -98, z, 16, 3 + (i % 2), 30 + i, Math.PI / 2); }
for (let i = 0, z = 70; z > -112; z -= 17, i++) townhouse(HB.G, 88, z, 16, 2 + (i % 3), 40 + i, -Math.PI / 2);
for (let i = 0, x = -60; x <= 60; x += 18, i++) townhouse(HB.G, x, 150, 16, 2 + (i % 2), 100 + i, Math.PI);
const DOM = dom(HB.G, -84, -20, Math.PI / 2);
// lejos: clase (KX), salón de la Oma (OX), dentista (ZAX), tranvía (TX), mi cuarto (ZIX), cueva (HX), sótano (SX)
const KX = 900, OX = 1300, ZAX = 1700, TX = 2100, ZIX = 2500, HX = 3000, SX = 3500;
const KL = klasse(scene, KX), OSt = omaStube(scene, OX), ZA = zahnarzt(scene, ZAX), TR = tramIn(scene, TX), SCR = shopScreen(), ZI = zimmerF(scene, ZIX, SCR), HO = hoehle(scene, HX), SO = sotano(scene, SX);
// en esta ciudad no hay sillas: fuera las sillas de los pupitres y el sillón de la Oma
KL.desks.forEach(d => d.children.forEach(ch => { if (ch.isGroup && Math.abs(ch.position.z - 2.8) < .01) ch.visible = false; }));
OSt.AC.visible = false; [OSt.SOFA, OSt.TB, OSt.cat].forEach(o => o && (o.visible = false));
const SETS = { HB: HB.G, KL: KL.g, OS: OSt.g, ZA: ZA.g, TR: TR.g, ZI: ZI.g, HO: HO.g, SO: SO.g };
for (const k in SETS) outline(SETS[k], OS);
// ---------- reparto ----------
const ich = makeNoah(scene), oma = makeOma(scene), bak = makeBaecker(scene), cop1 = makeCop(scene, 0), cop2 = makeCop(scene, 1), dorn = makeDorn(scene), zahn = makeZahn(scene), lehr = makeLehrerin(scene);
kitFace(ich, 'hero'); kitFace(oma, 'girl'); kitFace(bak, 'mustache'); kitFace(cop1, 'plain'); kitFace(cop2, 'mustache'); kitFace(dorn, 'girl'); kitFace(zahn, 'girl'); kitFace(lehr, 'girl');
const EX = Array.from({ length: 34 }, (_, i) => makeExtra(scene, i)); EX.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'girl', 'mustache', 'girl'][i % 6]));
const MAIN = [ich, oma, bak, cop1, cop2, dorn, zahn, lehr];
const POOL = [...MAIN, ...EX];
POOL.forEach(c => outline(c.root, OC));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(.5, 'rgba(0,0,0,.3)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -Math.PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const BOTS = Array.from({ length: 56 }, (_, i) => { const b = bottle(scene, i); outline(b, OP); return b; }); let BI = 0;
const MYB = looseBottle(scene, 0); outline(MYB, OP);          // mi botella (la que saco del suelo y luego rueda)
const DORNB = looseBottle(scene, 1); outline(DORNB, OP);      // la de la alcaldesa
const HOLES = Array.from({ length: 4 }, () => { const h = hole(scene); outline(h, OP); return h; });
const CHAIR = gamerChair(scene); outline(CHAIR, OP);
const PARCEL = bigParcel(scene); outline(PARCEL, OP);
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 2 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const SPARK = Array.from({ length: 40 }, () => sphere(.12, basicGlow(0xd890ff, 2.4), scene, 0, 0, 0, 6, 4));
function sparks(c, T0, T, n = 30, sp = 1) { SPARK.forEach((s, i) => { if (i >= n) return; const r = RNG(i * 13 + 2), t = T - T0; if (t < 0 || t > 1.2) return; s.visible = true; const a = r() * 6.283, v = (3 + r() * 5) * sp; s.position.set(c.x + Math.cos(a) * v * t, c.y + (4 + r() * 4) * t - 6 * t * t, c.z + Math.sin(a) * v * t); s.scale.setScalar(1 - t / 1.2); }); }
// estrellitas de dolor / de mareo alrededor de la cabeza
const STARS = Array.from({ length: 6 }, () => { const s = new THREE.Mesh(new THREE.OctahedronGeometry(.32), basicGlow(0xfff2a0, 2.2)); scene.add(s); return s; });
function stars(ch, T, n = 5) { const h = hp(ch), s = ch.spec.scale || 1; STARS.forEach((st, i) => { if (i >= n) return; st.visible = true; const a = T * 4 + i / n * 6.283; st.position.set(h.x + Math.cos(a) * 1.3 * s, h.y + 1.6 * s + Math.sin(T * 6 + i) * .15, h.z + Math.sin(a) * 1.3 * s); st.rotation.y = T * 5; }); }
const PROPS = [MYB, DORNB, ...HOLES, CHAIR, PARCEL, ...BOTS, ...CONF, ...DUST, ...SWEAT, ...TEAR, ...SPARK, ...STARS];
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.0; hemi.color.setRGB(.82, .9, 1); hemi.groundColor.setRGB(.6, .55, .42); sun.intensity = 3.0; sun.color.setRGB(1, .88, .72); rim.intensity = 1.9; rim.color.setRGB(1, .93, .82);
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function night(fill = 40) { MODE = 'night'; sky.clouds.forEach(c => c.visible = false); renderer.toneMappingExposure = 1.05; setSky([.04, .05, .2], [.12, .12, .38], [.32, .22, .5]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.15; hemi.color.setRGB(.7, .74, 1); hemi.groundColor.setRGB(.32, .28, .4); sun.intensity = 1.2; sun.color.setRGB(.78, .78, 1); rim.intensity = 1.8;
  scene.fog.color.setRGB(.12, .12, .3); scene.fog.density = .001; bloom.strength = .32; bloom.threshold = .82; FILL.intensity = fill; BIRDSON = 0; }
function darkNight() { night(28); hemi.intensity = .55; sun.intensity = .55; renderer.toneMappingExposure = .9; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; bloom.threshold = .86; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.blob.visible = true; }
  for (const p of PROPS) { p.visible = false; p.rotation.order = 'XYZ'; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  HOLES.forEach(h => h.userData.set(0)); BOTS.forEach(b => { b.userData.collar.visible = true; }); BI = 0; ZA.LL.visible = false;
  for (const k in SETS) SETS[k].visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .38; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.42; grade.uniforms.sharp.value = 1.4; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; DOF = 1; day(); }
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
  cam([h.x + fx * d + fz * side, h.y + .6 + dy, h.z + fz * d - fx * side], [h.x, h.y - .9, h.z], fov); }
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
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b && w[2] !== 'HUSS!');
const talk = (ch, T, a, b, expr = 'talk', extra = {}) => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat', ...extra });
const grin = (ch, T, ex = {}) => cara(ch, T, { expr: 'grin', eyes: 'happy', mouth: 'grin', ...ex });
const laughF = (ch, T) => cara(ch, T, { eyes: 'happy', mouth: Math.sin(T * 22) > 0 ? 'laugh' : 'open_smile' });
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
const tears = (ch, T) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < 2; i++) { const k = (T * 1.1 + i * .5) % 1; TEAR[i].visible = true; TEAR[i].position.copy(h).add(V((i ? -.3 : .3) * s, (.75 - k * 1.1) * s, .7 * s)); } };
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.5 + t * 1.4) * s * (.8 + r() * .5)); d.material.opacity = .4 * (1 - t / 1.2); }); }
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));
const walkP = (T, i) => { const p = Math.sin(T * 9 + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
const runP = (T, i) => { const p = Math.sin(T * 13 + i); return { aLx: p * 1.1, aRx: -p * 1.1, aLe: 1.3, aRe: 1.3, lLx: -p * .9, lRx: p * .9, lLk: .3 + Math.max(0, p) * 1.1, lRk: .3 + Math.max(0, -p) * 1.1, lean: .25, headX: -.15 }; };
// ---------- botellas-asiento ----------
const SEAT = 4.5;
const sitY = (c, seat = SEAT) => seat + .1 - 2.05 * (c.spec.scale || 1);
const seatPose = (extra = {}) => ({ lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, ...extra });
// botella clavada en (x, z); i = color
function bot(x, z, i = null, ry = 0) { const b = BOTS[BI++ % BOTS.length]; b.visible = true; b.position.set(x, 0, z); b.rotation.set(0, ry, 0); b.scale.setScalar(1); if (i != null) { const col = [0x1f9a4a, 0x9a4a14, 0x5ac8e8, 0x2a7a3a, 0xb85a1a, 0x7ad8d0][i % 6]; b.userData.m.color.setHex(col); b.userData.m.emissive.setHex(col); } return b; }
// c sentado en una botella en (x, z) mirando a ry; o.pose = brazos/cabeza; o.wob = bamboleo (incómodo)
function seat(c, x, z, ry, L, o = {}) { if (o.bottle !== false) bot(x, z, o.col ?? null); const s = c.spec.scale || 1; put(c, x, sitY(c) + (o.dy || 0), z, ry); const w = o.wob ?? .04;
  c.root.rotation.z = Math.sin(L.T * 2.1 + c.seed) * w; c.root.rotation.x = Math.sin(L.T * 1.7 + c.seed * 2) * w * .6;
  actuar(c, 0, [[0, seatPose(o.pose || {})]], { T: L.T, weight: false }); c.blob.visible = false; return c; }
// pose sentada según modo (para multitudes en botellas)
function seatMode(c, L, i, m, o = {}) { const T = L.T + i * .37;
  if (m === 'talk') { actuar(c, 0, [[0, seatPose({ aRx: .9 + Math.sin(L.T * 3 + i) * .3, aRz: .2, aRe: 1.2, aLx: .3, headY: Math.sin(L.T * .8 + i) * .4 })]], { T: L.T, weight: false }); cara(c, T, { expr: 'happy', mouth: Math.sin(L.T * 9 + i) > 0 ? 'talk' : 'smile' }); }
  else if (m === 'shock') { actuar(c, 0, [[0, seatPose({ aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9, lean: -.12, headX: -.06 })]], { T: L.T, weight: false }); cara(c, T, { expr: 'shock', mouth: i % 2 ? 'o' : 'grimace' }); }
  else if (m === 'stare') { actuar(c, 0, [[0, seatPose({ aLx: .35, aRx: .35, aLe: .6, aRe: .6, ...(o.face ? mirar(c, o.face, 1.2, .5) : {}) })]], { T: L.T, weight: false, breathe: false }); cara(c, T, { expr: 'sus', eyes: i % 3 ? 'squint' : 'wide', mouth: 'flat' }); }
  else if (m === 'shout') { actuar(c, 0, [[0, seatPose({ aLx: 2.0, aRx: 2.0, aLz: .9, aRz: .9, aLe: 1.6, aRe: 1.6, lean: -.08, headX: -.15 })]], { T: L.T, weight: false }); cara(c, T, { expr: 'shout', mouth: 'talk_wide' }); }
  else if (m === 'point') { actuar(c, 0, [[0, seatPose({ aRx: 1.6, aRz: .05, aRe: .1, aLx: .5, aLz: -.6, aLe: 1.5, ...(o.face ? mirar(c, o.face, 1.2, .5) : {}) })]], { T: L.T, weight: false }); cara(c, T, { expr: 'shock', mouth: 'o' }); }
  else if (m === 'cheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); actuar(c, 0, [[0, seatPose({ aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3 })]], { T: L.T, weight: false }); laughF(c, T); }
  else if (m === 'read') { actuar(c, 0, [[0, seatPose({ aLx: 1.2, aRx: 1.2, aLz: -.15, aRz: -.15, aLe: 1.2, aRe: 1.2, headX: .3 })]], { T: L.T, weight: false }); cara(c, T, { expr: 'neutral', mouth: 'flat' }); }
  else if (m === 'wave') { actuar(c, 0, [[0, seatPose({ aRx: 2.7, aRz: .4 + Math.sin(L.T * 9 + i) * .35, aRe: .5, aLx: .2 })]], { T: L.T, weight: false }); cara(c, T, { expr: 'happy', mouth: 'open_smile' }); }
  else if (m === 'ouch') { actuar(c, 0, [[0, seatPose({ aLx: .2, aLz: .3, aRx: -.4, aRz: .2, aRe: .6, lean: .15 + Math.sin(L.T * 6 + i) * .05, headX: .2 })]], { T: L.T, weight: false }); cara(c, T, { expr: 'worried', mouth: 'grimace' }); }
  else { actuar(c, 0, [[0, seatPose({ headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .35, aLx: .3 + Math.sin(L.T * 2 + i) * .08, aRx: .3, aLe: .5, aRe: .5, ...(o.face ? mirar(c, o.face, 1.2, .5) : {}) })]], { T: L.T, weight: false }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); } }
// gente en botellas alrededor de (cx, cz) en un arco por detrás del sujeto (nunca entre la cámara y el sujeto)
function bottleCrowd(L, cx, cz, n, r0, r1, seed = 1, o = {}) { POST.push(() => { const list = (o.list || EX).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx);
  const arc = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.0), ac + 6.283 - (o.gap ?? 1.0)]; const placed = o.avoid ? [...o.avoid] : [];
  list.forEach((c, i) => { let x, z, tries = 0; do { const a = arc[0] + (i + r() * .8) / list.length * (arc[1] - arc[0]); const d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; tries++; } while (tries < 10 && placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 3.6));
    placed.push([x, z]); const face = o.face || camera.position; const ry = Math.atan2(face.x - x, face.z - z) + (o.face ? 0 : (r() - .5) * 1.2);
    seat(c, x, z, ry, L, { wob: .03 }); seatMode(c, L, i + seed, typeof o.mode === 'function' ? o.mode(i) : (o.mode || 'idle'), o); }); }); }
function bottleGrid(L, x0, z0, cols, rows, dx, dz, o = {}) { const list = (o.list || EX).slice(o.from || 0); let i = 0; const r = RNG(o.seed || 3);
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) { const c = list[i]; if (!c) return; const x = x0 + (col - (cols - 1) / 2) * dx + (row % 2) * dx * .5 * (o.stagger ?? 1) + (r() - .5) * .6, z = z0 + row * dz + (r() - .5) * .6; if (o.skip && o.skip(x, z)) { i++; continue; }
    const face = o.face || camera.position; seat(c, x, z, o.ry ?? Math.atan2(face.x - x, face.z - z), L, { wob: .03 }); if (o.scale) c.root.scale.setScalar(o.scale * (c.spec.scale || 1)); if (o.scale) c.root.position.y = SEAT + .1 - 2.05 * o.scale * (c.spec.scale || 1); seatMode(c, L, i, typeof o.mode === 'function' ? o.mode(i) : (o.mode || 'idle'), o); i++; } }
// gente de pie / corriendo (persecución): o.mode 'walk' | 'run' | 'shock' | 'point' | 'shout' | 'idle'
function crowdAt(L, cx, cz, n, r0, r1, seed = 1, o = {}) { POST.push(() => { const list = (o.list || EX).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.2), ac + 6.283 - (o.gap ?? 1.2)];
  const placed = [];
  list.forEach((c, i) => { let x, z, tries = 0; do { const a = arc[0] + (i + r() * .8) / list.length * (arc[1] - arc[0]); const d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; tries++; } while (tries < 8 && placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 3.4));
    placed.push([x, z]); crowdGuy(c, x, z, L, i, o); }); }); }
function crowdGuy(c, x, z, L, i, o) { const T = L.T + i * .37, face = o.face || camera.position; let ry = o.ry ?? (Math.atan2(face.x - x, face.z - z) + Math.sin(i * 7.3) * (o.jit ?? .35));
  put(c, x, o.y ?? 0, z, ry); const m = o.mode;
  if (m === 'walk' || m === 'run') { const run = m === 'run', d = (o.speed ?? (run ? 9 : 2.2)) * L.lt, a = ry; c.root.position.x += Math.sin(a) * d; c.root.position.z += Math.cos(a) * d; c.root.position.y = (o.y ?? 0) + Math.abs(Math.sin(L.T * (run ? 13 : 9) + i)) * (run ? .35 : .12); actuar(c, 0, [[0, run ? runP(L.T, i) : walkP(L.T, i)]], { T: L.T }); cara(c, T, { expr: o.expr || (run ? 'shock' : 'neutral'), mouth: run ? (i % 2 ? 'scream' : 'o') : undefined }); }
  else if (m === 'shout') { actuar(c, 0, [[0, { aLx: 2.0, aRx: 2.0, aLz: .9, aRz: .9, aLe: 1.6, aRe: 1.6, lean: -.08, headX: -.15 }]], { T: L.T }); cara(c, T, { expr: 'shout', mouth: 'talk_wide' }); }
  else if (m === 'shock') { actuar(c, 0, [[0, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9, lean: -.08, headX: -.06 }]], { T: L.T }); cara(c, T, { expr: 'shock', mouth: i % 2 ? 'o' : 'grimace' }); }
  else if (m === 'point') { actuar(c, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: .5, aLz: -.6, aLe: 1.5, lean: -.08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'shock', mouth: 'o' }); }
  else if (m === 'cheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); c.root.position.y = (o.y ?? 0) + j * .45 * (c.spec.scale || 1); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3, crouch: .05 + j * .08 }]], { T: L.T }); laughF(c, T); }
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); } }
// plano medio/entero de un personaje: cámara delante (yaw relativo a su ry), centro a la altura del pecho
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null, dy = 3.3) { const s = ch.spec.scale || 1, p = ch.root.position, c = V(p.x, p.y + dy * s, p.z); const q = easeInOut(clamp(k)); orbit(c, lerp(dist, dist2 ?? dist * .88, q) * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const toCam = ch => { const p = ch.root.position; ch.root.rotation.y = Math.atan2(camera.position.x - p.x, camera.position.z - p.z); };
// ---------- escenarios por plano ----------
function town(L, o = {}) { use('HB'); if (o.night) { darkNight(); renderer.toneMappingExposure = .8; } else if (o.dusk) { day(); sun.color.setRGB(1, .72, .5); sun.intensity = 2.2; setSky([.16, .2, .55], [.72, .42, .55], [1, .62, .36]); } else day(); if (o.lila) { setSky([.22, .1, .4], [.45, .3, .7], [.7, .55, .9]); hemi.color.setRGB(.8, .7, 1); sun.color.setRGB(.9, .75, 1); scene.fog.color.setRGB(.6, .5, .8); } }
function klasseS(L) { use('KL'); inside(1.0, 46); }
function omaS(L) { use('OS'); inside(1.0, 46); }
function zahnS(L) { use('ZA'); inside(1.05, 40); ZA.LL.visible = true; }
function tramS(L) { use('TR'); inside(1.0, 40); TR.scroll(L.T); }
function zimmerS(L) { use('ZI'); inside(.95, 44); }
function hoehleS(L, o = {}) { use('HO'); MODE = 'in'; BIRDSON = 0; renderer.toneMappingExposure = 1.05; hemi.intensity = .5; hemi.color.setRGB(.7, .5, 1); hemi.groundColor.setRGB(.3, .15, .4); sun.intensity = 0; rim.intensity = 1.4; rim.color.setRGB(.8, .4, 1); bloom.strength = .5; bloom.threshold = .7; scene.fog.color.setRGB(.15, .05, .25); scene.fog.density = .006; FILL.intensity = 30; FILL.color.setRGB(.8, .6, 1); HO.open(L.T, o.eyes ?? 1); }
function sotanoS(L, o = {}) { use('SO'); inside(.6, 18); hemi.color.setRGB(1, .85, .7); SO.BULB.rotation.z = Math.sin(L.T * 1.4) * .12; }
// la botella suelta tumbada (rodando): centro en p, giro a lo largo de su eje (rueda) y dirección dir
function rollBottle(b, p, dir, spin) { b.visible = true; b.position.copy(p); b.position.y = 1.1; b.rotation.order = 'YZX'; b.rotation.set(Math.PI / 2, dir, spin); }
// ---------- capa 2D ----------
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
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  c.restore(); }
const KEY = /^(Stadt|Flasche|Flaschen|warum|Stühle|Straßenbahn|Klassenzimmer|Zahnarzt|Oma|52|Jahren|Stuhl|Lehne|Paket|Domplatz|Boden|Lebens|totenstill|Bäcker|Polizei|Sofort|Nein|tausendmal|Bürgermeisterin|Loch|lila|Leuchten|Korken|300|eingesperrt|draufsitzt|blubbern|rein|weggerollt|Sekunde|Plopp|Tag|Keller|Nacht|unten|geklopft)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t), huss: false }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0;
// ---------- a: gancho, el mundo en botellas, la Oma, me quejo (0 – 21,04 s) ----------
// Domplatz: mi silla irá en CP; la botella libre que saco está en HP; la alcaldesa se sienta en DP; el panadero en BKP.
const CP = V(-6.5, 0, 10), HP = V(-2.6, 0, 9.4), DP = V(9, 0, -4), BKP = V(-17, 0, 20);
const AV = [[CP.x, CP.z], [HP.x, HP.z], [DP.x, DP.z], [BKP.x, BKP.z]];
const plaza = (L, o = {}) => bottleCrowd(L, o.cx ?? -3, o.cz ?? 4, o.n ?? 24, o.r0 ?? 7, o.r1 ?? 30, o.seed ?? 1, { avoid: AV, gap: .5, ...o });
const CHS = 2.85;   // altura del asiento de la silla gamer
function inChair(c, x, z, ry, L, pose = {}, cry = null) { show(CHAIR, x, 0, z, cry ?? ry); const s = c.spec.scale || 1; put(c, x + Math.sin(ry) * .25, CHS + .1 - 2.05 * s, z + Math.cos(ry) * .25, ry); actuar(c, 0, [[0, seatPose({ lean: -.18, ...pose })]], { T: L.T, weight: false }); c.blob.visible = false; return c; }
const myHole = (L, glow = 0, bub = 0) => { const h = show(HOLES[0], HP.x, 0, HP.z); h.userData.set(glow, bub, L.T); return h; };
const qBadge = (k, y = .2) => badge('q', '?', W / 2, H * y, k, 1, 1);

// 1 «In dieser Stadt sitzt jeder» (zoom lento): grúa que baja sobre el Domplatz: todos sentados en botellas, yo en el centro
shot(0, 'C', 'slow', L => { town(L); const c = seat(ich, CP.x, CP.z, 0, L, { pose: { aLx: .5, aRx: .5, aLe: .8, aRe: .8 } }); cara(c, L.T, { expr: 'neutral', mouth: 'smile' });
  plaza(L, { n: 30, r0: 5, r1: 34, mode: i => ['talk', 'idle', 'read', 'wave', 'talk'][i % 5] });
  orb(L.k, V(CP.x, 4, CP.z), V(CP.x, 3.4, CP.z), [42, .12, .42, 48], [17, .05, .16, 44], easeOut); sh(V(CP.x, 0, CP.z - 6), 44); }, [[0, 'city_amb', .5], [.3, 'murmur', .35]]);
// 2 «auf einer Flasche.»: plano bajo: mi botella, mis piernas colgando, me balanceo
shot(1.30, 'Z', 'punch', L => { town(L); const c = seat(ich, CP.x, CP.z, 0, L, { wob: .07, pose: { aLx: .6, aRx: .6, aLz: .4, aRz: .4, lLk: 1.2 + Math.sin(L.T * 5) * .3, lRk: 1.2 } }); cara(c, L.T, { expr: 'neutral' });
  plaza(L, { n: 10, r0: 6, r1: 16, seed: 3 });
  cm([CP.x + 3.4, 2.2, CP.z + 13], [CP.x + 2.6, 2.4, CP.z + 11.5], L.k); camera.lookAt(CP.x, 5.2, CP.z); camera.fov = 48; sh(CP, 18); }, [[.1, 'glass_clink', .6], [.5, 'creak', .3]]);
// 3 «Und niemand hat mir je»: me encojo de hombros; a mi lado charlan sin explicarme nada
shot(2.28, 'W', null, L => { town(L); const c = seat(ich, CP.x, CP.z, .15, L, { pose: GEST.shrug }); cara(c, L.T, { expr: 'confused', mouth: 'flat' });
  const a = seat(EX[4], CP.x - 4.2, CP.z - 1.5, .9, L); seatMode(a, L, 1, 'talk'); const b = seat(EX[9], CP.x + 4.4, CP.z - 1.2, -.9, L); seatMode(b, L, 2, 'talk');
  plaza(L, { n: 12, r0: 9, r1: 24, seed: 5 });
  onBody(c, 15, 0, .12, 44, L.k, 12.5, -.12); sh(CP, 20); }, [[.1, 'hmm', .4]]);
// 4 «gesagt, warum.»: primer plano: miro arriba, un «?» enorme
shot(3.55, 'I', null, L => { town(L); const c = seat(ich, CP.x, CP.z, 0, L, { pose: GEST.think }); cara(c, L.T, { expr: 'confused', eyes: 'up', mouth: 'flat' });
  plaza(L, { n: 8, r0: 7, r1: 18, seed: 7 }); qBadge(clamp((L.lt - .08) / .15), .17);
  onFace(c, 5.6, .4, .8, 40, L.k, 4.6); sh(CP, 14); }, [[.1, 'pop', .5]]);
// 5 «Stühle gibt es hier nämlich keine.»: la terraza del café: mesas con botellas en vez de sillas; «KEINE STÜHLE»
shot(4.55, 'S', null, L => { town(L); const tx = 36, tz = -40; const sp = [[tx + 2.6, tz + 1.8], [tx - 2.8, tz - 1.4], [tx + 2.4, tz + 13.6], [tx - 2.6, tz + 10.6], [tx - 1.6, tz + 26], [tx - 6.8, tz + 22.4]];
  sp.forEach(([x, z], i) => { const c = seat(EX[10 + i], x, z, Math.atan2(tx - x + (i > 3 ? -4 : 0), tz + Math.floor(i / 2) * 12 - z), L); seatMode(c, L, i, i % 2 ? 'talk' : 'read'); });
  cm([tx - 16, 9, tz + 28], [tx - 12, 8, tz + 23], L.k); camera.lookAt(tx, 4, tz + 6); camera.fov = 48; badge('red', 'KEINE STÜHLE', W / 2, H * .15, clamp((L.lt - .2) / .15), 1, .85); sh(V(tx, 0, tz + 10), 30); }, [[.05, 'cafe', .4], [.3, 'cup', .4]]);
// 6 «In der Straßenbahn sitzen»: travelling por el pasillo del tranvía: dos filas de pasajeros en botellas
shot(6.03, 'C', null, L => { tramS(L); bottleGrid(L, TX, -16, 2, 7, 5.6, 4.4, { ry: 0, mode: i => ['read', 'idle', 'talk'][i % 3], stagger: 0, face: V(TX, 4, 20) });
  EX.forEach((c, i) => { if (c.root.visible && i < 14) c.root.rotation.y = c.root.position.x < TX ? Math.PI / 2 : -Math.PI / 2; });
  cm([TX + .4, 10.2, 20], [TX + .2, 9.8, 14], L.k); camera.lookAt(TX, 4.4, -10); camera.fov = 52; sh(V(TX, 0, 0), 30); }, [[0, 'tram_bell', .55], [.2, 'rumble', .4]]);
// 7 «alle auf Flaschen.»: el tranvía frena: todos se balancean sobre sus botellas, uno se agarra a la barra
shot(6.95, 'R', null, L => { tramS(L); const j = Math.sin(L.lt * 9) * Math.exp(-L.lt * 2) * .25;
  for (let i = 0; i < 4; i++) { const c = seat(EX[16 + i], TX + (i % 2 ? 2.8 : -2.8), -2 + Math.floor(i / 2) * 4.4, i % 2 ? -Math.PI / 2 : Math.PI / 2, L, { wob: .02 }); c.root.rotation.z = j * (i % 2 ? 1 : -1); seatMode(c, L, i, i === 1 ? 'shock' : 'ouch'); }
  cm([TX + 2.2, 7.4, 8], [TX + 2, 7.2, 6.8], L.k); camera.lookAt(TX - 2.8, 6, -.5); camera.fov = 48; sh(V(TX, 0, 0), 20); }, [[0, 'brake', .45], [.3, 'glass_clink', .5]]);
// 8 «Im Klassenzimmer sitzen»: la clase: la profesora en la pizarra, los alumnos en botellas detrás de los pupitres
shot(8.10, 'F', null, L => { klasseS(L); const lt = put(lehr, KX - 4, 0, -11, .3); actuar(lt, 0, [[0, { aRx: 2.2, aRz: .3, aRe: .6 + Math.sin(L.T * 3) * .2, headY: .5 }]], { T: L.T }); talk(lt, L.T, 8.1, 9.6, 'happy');
  bottleGrid(L, KX, .8, 3, 3, 11, 8, { ry: Math.PI, mode: i => ['read', 'idle', 'ouch'][i % 3], scale: .78, stagger: 0 });
  EX.forEach(c => { if (c.root.visible) c.root.rotation.y = Math.PI; });
  cm([KX + 6, 13, -12], [KX + 4, 12, -10], L.k); camera.lookAt(KX, 3, 6); camera.fov = 52; sh(V(KX, 0, 2), 24); }, [[0, 'chalk', .5], [.4, 'school_bell', .3]]);
// 9 «alle auf Flaschen.»: primer plano de un niño escribiendo: su botella cruje y se tambalea
shot(9.00, 'W', null, L => { klasseS(L); const c = seat(EX[20], KX, 8.8, Math.PI, L, { wob: .09 }); c.root.scale.setScalar(.78 * c.spec.scale); c.root.position.y = SEAT + .1 - 2.05 * .78 * c.spec.scale;
  actuar(c, 0, [[0, seatPose({ aRx: 1.3, aRz: -.1, aRe: 1.1 + Math.sin(L.T * 14) * .1, aLx: 1.0, aLe: 1.2, headX: .35 })]], { T: L.T, weight: false }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T);
  bottleGrid(L, KX, .8, 3, 2, 11, 8, { ry: Math.PI, mode: 'read', scale: .78, stagger: 0, list: EX.slice(22), skip: (x, z) => Math.abs(x - KX) < 3 && Math.abs(z - 8.8) < 3 });
  cm([KX + 6, 6.4, 3], [KX + 5, 6.2, 4], L.k); camera.lookAt(KX, 4.6, 8.8); camera.fov = 48; sh(V(KX, 0, 8), 16); }, [[0, 'pencil', .5], [.4, 'creak', .4]]);
// 10 «Sogar beim Zahnarzt»: la consulta: el paciente en una botella, la dentista con el espejito
shot(10.12, 'C', 'punch', L => { zahnS(L); const p = seat(EX[5], ZAX, 0, .5, L, { wob: .05, pose: { headX: -.45, aLx: .6, aRx: .6, aLz: .5, aRz: .5, aLe: 1.2, aRe: 1.2 } }); cara(p, L.T, { expr: 'worried', eyes: 'wide', mouth: 'o' });
  const z = put(zahn, ZAX + 3.2, 0, 1.4, -1.6); actuar(z, 0, [[0, { aRx: 1.5, aRz: -.3, aRe: .9 + Math.sin(L.T * 8) * .1, aLx: 1.2, aLe: .9, lean: .2, headX: .25, headY: -.2 }]], { T: L.T }); cara(z, L.T, { expr: 'happy' });
  cm([ZAX - 5, 7.5, 13], [ZAX - 3.6, 6.8, 10.5], L.k); camera.lookAt(ZAX + .8, 4.4, 0); camera.fov = 46; badge('tag', 'ZAHNARZT', W / 2, H * .14, clamp((L.lt - .1) / .15), 1, .9); sh(V(ZAX, 0, 0), 18); }, [[0, 'drill', .45], [.5, 'hmm', .3]]);
// 11 «sitzt du auf einer Flasche.»: plano bajo: la botella bajo el paciente; tiembla con el taladro
shot(11.24, 'S', null, L => { zahnS(L); const p = seat(EX[5], ZAX, 0, .5, L, { wob: .02, pose: { headX: -.45, aLx: .6, aRx: .6, aLz: .5, aRz: .5, aLe: 1.2, aRe: 1.2, lLk: 1.5 + Math.sin(L.T * 20) * .15, lRk: 1.5 + Math.sin(L.T * 21) * .15 } }); p.root.position.x += Math.sin(L.T * 40) * .04; cara(p, L.T, { expr: 'shock', mouth: 'scream' });
  const z = put(zahn, ZAX + 3.2, 0, 1.4, -1.6); actuar(z, 0, [[0, { aRx: 1.5, aRz: -.3, aRe: .9, aLx: 1.2, aLe: .9, lean: .2, headX: .25 }]], { T: L.T }); cara(z, L.T, { expr: 'happy' });
  cm([ZAX + 3.6, 3.4, 10], [ZAX + 3, 3.8, 9], L.k); camera.lookAt(ZAX, 5, 0); camera.fov = 52; sh(V(ZAX, 0, 0), 14); }, [[0, 'drill', .55], [.4, 'glass_clink', .4]]);
// 12 «Meine Oma sitzt seit 52 Jahren» (zoom lento): la Oma teje sentada en su botella; «52 JAHRE»
shot(12.40, 'I', 'slow', L => { omaS(L); const o = seat(oma, OX, 1, .1, L, { wob: .02, pose: { aLx: 1.0, aRx: 1.0, aLz: -.25, aRz: -.25, aLe: 1.3 + Math.sin(L.T * 9) * .12, aRe: 1.3 - Math.sin(L.T * 9) * .12, headX: .25 } }); cara(o, L.T, { expr: 'happy', mouth: 'smile' });
  onBody(o, 17, .1, .1, 44, L.k, 12, 0, 2.8); badge('gold', '52 JAHRE', W / 2, H * .15, clamp((L.T - 13.34) / .15), 1, 1); sh(V(OX, 0, 1), 18); }, [[0, 'clock_tick', .5], [.4, 'knit', .4]]);
// 13 «auf derselben Flasche.»: la botella de la Oma: telarañas, la etiqueta gastada, polvo
shot(13.94, 'C', 'punch', L => { omaS(L); const o = seat(oma, OX, 1, .1, L, { wob: .01, pose: { aLx: 1.0, aRx: 1.0, aLz: -.25, aRz: -.25, aLe: 1.3, aRe: 1.3, headX: .25 } }); cara(o, L.T, { expr: 'happy', mouth: 'smile' });
  dust(V(OX + .5, 1.5, 1.8), 13.95, L.T, 8, .4);
  cm([OX + 2.6, 2.2, 9.5], [OX + 2.0, 2.4, 8.2], L.k); camera.lookAt(OX, 2.6, 1); camera.fov = 44; sh(V(OX, 0, 1), 12); }, [[0, 'dust_puff', .5], [.3, 'creak', .4]]);
// 14 «Sie steht nie auf.»: la Oma duerme en su botella, la tele encendida, el gato le trae la merienda
shot(15.82, 'R', null, L => { omaS(L); const o = seat(oma, OX, 1, .1, L, { wob: .015, pose: { aLx: .3, aRx: .3, headX: .45 + Math.sin(L.T * 2) * .05, headZ: .25, lean: .1 } }); cara(o, L.T, { eyes: 'closed', mouth: 'o' });
  orb(L.k, V(OX, 3, 1), null, [17, .9, .18, 44], [15, .5, .14, 44]); badge('tag', 'Zzz', W * .66, H * .22, clamp(L.lt / .2), 1, .8); sh(V(OX, 0, 1), 18); }, [[0, 'snore', .5]]);
// 15 «Ich habe das nie kapiert.»: en la plaza, yo en mi botella, me rasco la cabeza
shot(16.99, 'F', null, L => { town(L); const c = seat(ich, CP.x, CP.z, -.2, L, { pose: GEST.think }); cara(c, L.T, { expr: 'confused', mouth: 'flat' });
  plaza(L, { n: 14, r0: 8, r1: 26, seed: 11 }); qBadge(clamp((L.T - 17.75) / .15), .17);
  orb(L.k, V(CP.x, 4.2, CP.z), null, [14, -.5, .12, 44], [12, -.25, .1, 44]); sh(CP, 20); }, [[0, 'hmm', .45]]);
// 16 «Denn Flaschen sind hart,»: golpeo mi botella con los nudillos: «tok tok»
shot(18.50, 'W', null, L => { town(L); const k = Math.max(0, Math.sin((L.T - 19.1) * 18)); const c = seat(ich, CP.x, CP.z, 0, L, { pose: { lean: .5, headX: .45, aRx: .3 + k * .4, aRz: .5, aRe: 1.7, aLx: .4 } }); cara(c, L.T, { expr: 'confused', eyes: 'down', mouth: 'flat' });
  plaza(L, { n: 8, r0: 7, r1: 18, seed: 13 });
  cm([CP.x + 3.4, 3.4, CP.z + 6.5], [CP.x + 2.6, 3.2, CP.z + 5.6], L.k); camera.lookAt(CP.x, 3.0, CP.z); camera.fov = 44; badge('tag', 'HART', W / 2, H * .18, clamp((L.T - 19.16) / .12), 1, 1); sh(CP, 14); }, [[.6, 'knock', .7], [.75, 'knock', .6]]);
// 17 «glitschig»: me resbalo de lado, agito los brazos
shot(19.70, 'C', 'punch', L => { town(L); const k = easeIn(clamp((L.T - 19.75) / .5)); const c = seat(ich, CP.x, CP.z, 0, L, { wob: 0, pose: { aLx: 2.4, aRx: 1.0, aLz: 1.2 + Math.sin(L.T * 20) * .3, aRz: .9, aLe: .4, aRe: .4, lLk: .6, lRk: 1.2 } });
  c.root.rotation.z = -k * .9; c.root.position.x += k * 1.4; c.root.position.y -= k * .9; cara(c, L.T, { expr: 'shock', mouth: 'scream' });
  plaza(L, { n: 8, r0: 8, r1: 18, seed: 15 });
  orbit(V(CP.x, 3.8, CP.z), 15, .05, .12, 44); badge('tag', 'GLITSCHIG', W / 2, H * .18, clamp((L.lt - .05) / .12), 1, 1); sh(CP, 16); }, [[.1, 'squeak', .6], [.4, 'whoosh_down', .3]]);
// 18 «und tun weh.»: me froto el trasero con cara de dolor; estrellitas
shot(20.30, 'S', null, L => { town(L); const c = seat(ich, CP.x, CP.z, .1, L, { wob: .08, pose: { aLx: -.5, aLz: .3, aLe: .8, aRx: -.4, aRz: .3, aRe: .8, lean: .2, headX: -.2 } }); cara(c, L.T, { expr: 'worried', eyes: 'closed', mouth: 'grimace' }); stars(c, L.T, 5);
  plaza(L, { n: 8, r0: 8, r1: 18, seed: 17 });
  onFace(c, 6, .2, -.8, 42, L.k, 5); badge('red', 'AUA!', W / 2, H * .16, clamp((L.T - 20.54) / .12), 1, .9); sh(CP, 14); }, [[.1, 'ouch', .6], [.3, 'sparkle', .3]]);
// ---------- b: la silla online, el paquete, me siento, totenstill, el panadero (21,04 – 41,34 s) ----------
const DESKP = V(ZIX, 0, -3.2);   // en mi cuarto: botella delante del escritorio (mirando al monitor, -z)
const atDesk = (L, pose = {}, wob = .04) => seat(ich, DESKP.x, DESKP.z, Math.PI, L, { wob, col: 3, pose: { aLx: 1.2, aRx: 1.2, aLz: -.1, aRz: -.1, aLe: .7, aRe: .7, lean: .15, ...pose } });
const DOORW = V(11.1, 0, 91.3);  // puerta de casa (mira a +x)
// 19 «Deshalb habe ich mir heimlich»: en mi cuarto, de noche, en mi botella delante del ordenador: miro a los lados
shot(21.04, 'Z', null, L => { zimmerS(L); hemi.intensity = .6; SCR.draw(0); const c = atDesk(L, { headY: Math.sin(L.lt * 4) * .7 }); cara(c, L.T, { expr: 'sus', mouth: 'flat' });
  cm([ZIX + 8, 8.6, 1], [ZIX + 7, 8.4, 0], L.k); camera.lookAt(ZIX, 7, -5); camera.fov = 46; sh(V(ZIX, 0, -4), 16); }, [[0, 'typing', .4], [.6, 'creak', .3]]);
// 20 «online einen Stuhl bestellt.»: el monitor: «Stuhl mit Lehne – 89,99 €» → clic en KAUFEN → «BESTELLT ✓»
shot(22.40, 'F', null, L => { zimmerS(L); const ph = L.T < 22.8 ? 0 : L.T < 22.98 ? 1 : 2; SCR.draw(ph, clamp((L.T - 22.98) / .4)); atDesk(L);
  cm([ZIX + 3.4, 8.6, -1.2], [ZIX + 3, 8.5, -2.2], L.k); camera.lookAt(ZIX, 8.2, -10); camera.fov = 44; sh(V(ZIX, 0, -8), 12); }, [[.4, 'click', .7], [.58, 'ding_reveal', .6]]);
// 21 «Einen richtigen Stuhl!»: salto de alegría en mi botella, brazos arriba
shot(23.58, 'C', 'punch', L => { zimmerS(L); SCR.draw(2, 1); const c = atDesk(L, { ...GEST.cheer, aLz: .5 + Math.sin(L.T * 12) * .15, aRz: .5 + Math.sin(L.T * 12) * .15 }, .08); c.root.rotation.y = Math.PI - .5; laughF(c, L.T); confetti(V(ZIX, 4, -3), 23.6, L.T, 40, .5);
  cm([ZIX + 9, 8.4, 4], [ZIX + 8, 8, 3], L.k); camera.lookAt(ZIX, 6.4, -3); camera.fov = 46; sh(V(ZIX, 0, -3), 14); }, [[0, 'cheer', .45], [.1, 'party_horn', .4]]);
// 22 «Mit Lehne!»: la foto de la silla en el monitor; un círculo marca el respaldo
shot(24.74, 'W', null, L => { zimmerS(L); SCR.draw(2, 1);
  cm([ZIX - .6, 8.6, -1.6], [ZIX - 1.2, 8.4, -2.8], L.k); camera.lookAt(ZIX - 1.4, 8.2, -10); camera.fov = 44; badge('gold', 'MIT LEHNE!', W / 2, H * .16, clamp((L.T - 25.0) / .12), 1, .95); sh(V(ZIX, 0, -8), 12); }, [[.2, 'sparkle', .5]]);
// 23 «Heute Morgen kam endlich»: por la mañana el cartero me trae un paquete enorme a la puerta de casa
shot(25.60, 'S', null, L => { town(L); const k = clamp(L.lt / .6); const po = put(EX[12], DOORW.x + 7 - k * 2.4, 0, DOORW.z + 1.8, -Math.PI / 2); actuar(po, 0, [[0, k < 1 ? { ...walkP(L.T, 1), ...GEST.hold } : GEST.hold]], { T: L.T }); cara(po, L.T, { expr: 'happy', mouth: 'smile' });
  attach(PARCEL, po.root, [0, 2.2, 2.0], [0, 0, 0], .78);
  const c = put(ich, DOORW.x + 2, 0, DOORW.z - 1.8, Math.PI / 2); actuar(c, 0, [[0, { aLx: 1.0, aRx: 1.0, aLe: .4, aRe: .4, headX: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'wide', mouth: 'open_smile' });
  cm([DOORW.x + 5, 6.5, DOORW.z + 15], [DOORW.x + 5, 6, DOORW.z + 12], L.k); camera.lookAt(DOORW.x + 4, 4, DOORW.z); camera.fov = 46; sh(DOORW, 20); }, [[0, 'doorbell', .55], [.3, 'steps', .35]]);
// 24 «das Paket.»: abrazo el paquete (enorme: «VORSICHT – STUHL»)
shot(26.73, 'I', null, L => { town(L); const c = put(ich, DOORW.x + 2.6, 0, DOORW.z, Math.PI / 2 + .3); actuar(c, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.5, aRz: -.5, aLe: .6, aRe: .6, lean: .08 }]], { T: L.T }); grin(c, L.T);
  attach(PARCEL, c.root, [0, .2, 2.4], [0, 0, 0], .9);
  onBody(c, 15, 0, .1, 44, L.k, 13); sh(DOORW, 16); }, [[0, 'box_drop', .45], [.2, 'happy_hum', .35]]);
// 25 «Also gehe ich zum Domplatz»: cruzo la plaza con el paquete; el Dom al fondo; todos me miran desde sus botellas
shot(27.34, 'C', null, L => { town(L); const c = put(ich, -22 + L.lt * 2.6, 0, 12, Math.PI / 2); actuar(c, 0, [[0, { ...walkP(L.T, 0), aLx: 1.4, aRx: 1.4, aLz: -.45, aRz: -.45, aLe: .6, aRe: .6 }]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 9)) * .12; grin(c, L.T);
  attach(PARCEL, c.root, [0, .4, 2.3], [0, 0, 0], .85);
  plaza(L, { n: 18, r0: 6, r1: 30, seed: 21, mode: 'stare', face: hp(c) });
  cm([-4, 6.5, 17], [-7, 6.2, 16], L.k); camera.lookAt(-44, 10, 6); camera.fov = 52; sh(V(-20, 0, 12), 40); }, [[0, 'steps', .45], [.3, 'murmur', .35]]);
// 26 «und ziehe eine Flasche»: me agarro a una botella libre y tiro con todas mis fuerzas
shot(28.69, 'W', null, L => { town(L); show(PARCEL, CP.x - 2.4, 0, CP.z + 2, .4, .85); const up = Math.max(0, Math.sin(L.T * 26)) * .08 + clamp((L.T - 29.6) / .3) * .6;
  show(MYB, HP.x, up, HP.z, .3); const c = put(ich, HP.x, 0, HP.z - 2.3, 0); actuar(c, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.25, aRz: -.25, aLe: .5, aRe: .5, lean: -.25, crouch: .35, lLx: .5, lRx: -.2, lLk: .6, lRk: .3, headX: -.2 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', eyes: 'closed', mouth: 'grimace' }); sweat(c, L.T);
  plaza(L, { n: 10, r0: 8, r1: 20, seed: 23, mode: 'stare', face: V(HP.x, 3, HP.z) });
  cm([HP.x + 6, 5.5, HP.z + 9], [HP.x + 5, 5, HP.z + 7.8], L.k); camera.lookAt(HP.x, 3, HP.z + 1); camera.fov = 46; sh(HP, 16); }, [[0, 'strain', .5], [.4, 'glass_creak', .45]]);
// 27 «aus dem Boden,»: ¡PLOP! la botella sale; queda un agujero negro; polvo
shot(29.95, 'C', 'punch', L => { town(L); show(PARCEL, CP.x - 2.4, 0, CP.z + 2, .4, .85); myHole(L); const k = easeOut(clamp((L.T - 29.95) / .3));
  show(MYB, HP.x + k * .6, 1.2 + k * 2.4, HP.z + 1.4 * k, .3); MYB.rotation.x = -k * .6;
  const c = put(ich, HP.x, 0, HP.z - 2.6 - k * .8, 0); actuar(c, 0, [[0, { aLx: 2.2, aRx: 2.2, aLz: -.2, aRz: -.2, aLe: .3, aRe: .3, lean: -.35, headX: -.3, lLx: -.3, lRx: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); dust(V(HP.x, 0, HP.z), 29.95, L.T, 10, .7);
  cm([HP.x + 2.6, 9, HP.z + 9.5], [HP.x + 2, 8.6, HP.z + 8.6], L.k); camera.lookAt(HP.x, 1, HP.z); camera.fov = 46; sh(HP, 14); }, [[0, 'cork_pop', .8], [.05, 'dust_puff', .45]]);
// 28 «damit mein Stuhl Platz hat.»: abro el paquete: sale la silla gamer entre destellos
shot(30.45, 'F', null, L => { town(L); myHole(L); show(MYB, HP.x + 2.4, 0, HP.z + 1.6, 0); rollBottle(MYB, V(HP.x + 2.6, 0, HP.z + 2.2), .8, 0);
  const k = easeOut(clamp((L.T - 30.55) / .4)); show(PARCEL, CP.x, -k * 4, CP.z, .2, .95); show(CHAIR, CP.x, 0, CP.z, 0, lerp(.3, 1, k)); sparks(V(CP.x, 4, CP.z), 30.6, L.T, 30, .8);
  const c = put(ich, CP.x + 4, 0, CP.z + 3, -.9); actuar(c, 0, [[0, GEST.cheer]], { T: L.T }); laughF(c, L.T);
  plaza(L, { n: 10, r0: 9, r1: 22, seed: 25, mode: 'stare', face: V(CP.x, 3, CP.z) });
  orb(L.k, V(CP.x + 1.5, 3.6, CP.z), null, [17, .35, .14, 44], [15, .2, .12, 44]); sh(CP, 18); }, [[0, 'tape_rip', .55], [.15, 'magic_hit', .45]]);
// 29 «Ich stelle ihn hin»: coloco la silla junto al agujero
shot(31.70, 'R', null, L => { town(L); myHole(L); rollBottle(MYB, V(HP.x + 2.6, 0, HP.z + 2.2), .8, 0); const k = easeOut(clamp((L.T - 31.75) / .45));
  show(CHAIR, CP.x, (1 - k) * 1.2, CP.z, .4 * (1 - k)); const c = put(ich, CP.x + 3.4, 0, CP.z + .4, -Math.PI / 2); actuar(c, 0, [[0, { aLx: 1.3, aRx: 1.3, aLe: .4, aRe: .4, lean: .3, crouch: .2 * (1 - k) }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  plaza(L, { n: 10, r0: 9, r1: 22, seed: 27, mode: 'stare', face: V(CP.x, 3, CP.z) });
  cm([CP.x - 7, 5, CP.z + 9], [CP.x - 6, 4.6, CP.z + 8], L.k); camera.lookAt(CP.x, 2.8, CP.z + 1); camera.fov = 46; sh(CP, 16); }, [[.4, 'thud', .55]]);
// 30 «und setze mich.»: me dejo caer en la silla: se hunde, me balanceo
shot(32.48, 'S', null, L => { town(L); myHole(L); rollBottle(MYB, V(HP.x + 2.6, 0, HP.z + 2.2), .8, 0); const k = easeOut(clamp((L.T - 32.6) / .35)); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.25 * k, aLx: .6, aRx: .6, aLz: .6, aRz: .6, aLe: .4, aRe: .4 });
  c.root.position.y += (1 - k) * 1.4; CHAIR.position.y = -Math.sin(clamp((L.T - 32.9) / .25) * Math.PI) * .15; cara(c, L.T, { expr: 'happy', eyes: k > .9 ? 'happy' : 'normal', mouth: 'open_smile' });
  plaza(L, { n: 10, r0: 9, r1: 22, seed: 29, mode: 'stare', face: V(CP.x, 3, CP.z) });
  onBody(c, 15, .3, .1, 44, L.k, 12.5, .15, 2.2); sh(CP, 16); }, [[.3, 'cushion', .7], [.5, 'sigh', .45]]);
// 31 «Es ist der beste Moment» (zoom lento): recostado con los ojos cerrados; luz dorada; «PERFEKT»
shot(33.53, 'I', 'slow', L => { town(L, { dusk: 1 }); myHole(L); rollBottle(MYB, V(HP.x + 2.6, 0, HP.z + 2.2), .8, 0); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.32, aLx: -.2, aRx: -.2, aLz: 1.0, aRz: 1.0, aLe: 2.2, aRe: 2.2, headX: -.25 }); cara(c, L.T, { eyes: 'closed', mouth: 'grin' });
  onFace(c, 6.6, .4, .3, 42, L.k, 4.8); badge('gold', 'PERFEKT', W / 2, H * .16, clamp((L.lt - .15) / .15), 1, 1); sh(CP, 14); }, [[0, 'angel_choir', .45], [.2, 'sparkle', .45]]);
// 32 «meines Lebens …»: órbita lenta alrededor de la silla; palomas; confeti de luz
shot(34.61, 'W', null, L => { town(L, { dusk: 1 }); myHole(L); rollBottle(MYB, V(HP.x + 2.6, 0, HP.z + 2.2), .8, 0); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.3, aLz: 1.0, aRz: 1.0, aLx: -.2, aRx: -.2, aLe: 2.2, aRe: 2.2, headX: -.2 }); grin(c, L.T, { eyes: 'closed' });
  plaza(L, { n: 12, r0: 9, r1: 26, seed: 31, mode: 'idle' }); confRain(V(CP.x, 0, CP.z), L.T, 30, 10, 10, 12);
  orb(L.k, V(CP.x, 3.4, CP.z), null, [16, -.6, .16, 46], [16, -.1, .14, 46]); sh(CP, 20); }, [[0, 'birds', .4]]);
// 33 «bis es auf einmal»: plano general: todos se callan a la vez y se giran
shot(35.59, 'C', null, L => { town(L); myHole(L); rollBottle(MYB, V(HP.x + 2.6, 0, HP.z + 2.2), .8, 0); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.3, aLz: 1.0, aRz: 1.0, aLx: -.2, aRx: -.2, aLe: 2.2, aRe: 2.2 }); cara(c, L.T, { eyes: 'closed', mouth: 'smile' });
  plaza(L, { n: 28, r0: 6, r1: 32, seed: 33, mode: i => (L.T > 35.9 + (i % 5) * .05 ? 'stare' : 'talk'), face: V(CP.x, 4, CP.z) });
  cm([CP.x + 4, 22, CP.z + 30], [CP.x + 3, 19, CP.z + 26], L.k); camera.lookAt(CP.x - 2, 2, CP.z - 6); camera.fov = 52; sh(V(CP.x, 0, CP.z - 4), 40); }, [[.3, 'record_scratch', .5]]);
// 34 «totenstill wird.» (zoom lento): silencio; abro un ojo; una hoja cruza la plaza
shot(36.29, 'F', 'slow', L => { town(L); grade.uniforms.sat.value = 1.1; myHole(L); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.28, aLz: 1.0, aRz: 1.0, aLx: -.2, aRx: -.2, aLe: 2.2, aRe: 2.2, headY: -.25 }); cara(c, L.T, { eyes: L.T > 36.7 ? 'side_l' : 'closed', mouth: 'flat' });
  plaza(L, { n: 10, r0: 7, r1: 18, seed: 35, mode: 'stare', face: hp(c) });
  onFace(c, 8, .3, -.6, 44, L.k, 5.5); sh(CP, 14); }, [[0, 'wind', .55], [.5, 'cricket', .4]]);
// 35 «Die ganze Stadt starrt»: contraplano desde detrás de mí: cientos de ojos clavados en mí
shot(37.63, 'R', null, L => { town(L); myHole(L); const c = inChair(ich, CP.x, CP.z, Math.PI, L, { lean: -.15, aLx: .3, aRx: .3 }); cara(c, L.T, { expr: 'worried' });
  plaza(L, { cx: CP.x, cz: CP.z - 8, n: 30, r0: 5, r1: 30, seed: 37, mode: 'stare', face: V(CP.x, 4, CP.z), full: true });
  cm([CP.x + 2.5, 11.5, CP.z + 6], [CP.x + 2.2, 11, CP.z + 5], L.k); camera.lookAt(CP.x - 1, 3.2, CP.z - 16); camera.fov = 54; sh(V(CP.x, 0, CP.z - 10), 34); }, [[0, 'tension_hit', .5]]);
// 36 «mich an.»: dos caras en primer plano: me miran fijamente, sin parpadear
shot(38.33, 'Z', null, L => { town(L); const a = seat(EX[6], CP.x - 2, CP.z - 9, 0, L, { wob: .01 }); seatMode(a, L, 1, 'stare', { face: V(CP.x, 4, CP.z + 6) }); const b = seat(EX[14], CP.x + 2.6, CP.z - 11, -.2, L, { wob: .01 }); seatMode(b, L, 2, 'stare', { face: V(CP.x, 4, CP.z + 6) });
  plaza(L, { cx: CP.x, cz: CP.z - 16, n: 10, r0: 4, r1: 16, seed: 39, mode: 'stare', face: V(CP.x, 4, CP.z + 6), gap: 1.3 });
  cm([CP.x - 1.2, 8.6, CP.z - 1], [CP.x - .4, 8.4, CP.z - 2.4], L.k); camera.lookAt(CP.x + .2, 7.6, CP.z - 10); camera.fov = 44; sh(V(CP.x, 0, CP.z - 10), 16); }, [[0, 'heartbeat', .55]]);
// 37 «Ein Bäcker kippt vor Schreck»: el panadero en su botella, con una bandeja de Brezeln, abre los ojos de golpe
shot(39.33, 'W', 'punch', L => { town(L); const b = seat(bak, BKP.x, BKP.z, .5, L, { wob: .03, pose: { aLx: 1.2, aRx: 1.2, aLz: -.2, aRz: -.2, aLe: .9, aRe: .9, lean: -.1 } }); cara(b, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  plaza(L, { cx: BKP.x, cz: BKP.z - 6, n: 8, r0: 6, r1: 16, seed: 41, mode: 'stare', face: V(CP.x, 4, CP.z) });
  onBody(b, 15, 0, .1, 44, L.k, 12.5, -.15, 3); sh(BKP, 16); }, [[0, 'gasp', .5]]);
// 38 «von seiner Flasche.»: se cae de espaldas: las piernas al aire, la bandeja vuela
shot(40.17, 'C', null, L => { town(L); const k = easeIn(clamp((L.T - 40.2) / .45)); const b = seat(bak, BKP.x, BKP.z, .5, L, { wob: 0, pose: { aLx: 2.4, aRx: 2.4, aLz: .8, aRz: .8, aLe: .3, aRe: .3, lLk: .4, lRk: .4, lLx: 1.6 + k * .6, lRx: 1.4 + k * .6 } });
  b.root.rotation.x = -k * 1.4; b.root.position.z -= k * 2.2; b.root.position.y -= k * (SEAT - 1.8); cara(b, L.T, { expr: 'shock', mouth: 'scream' });
  dust(V(BKP.x, 0, BKP.z - 3), 40.6, L.T, 10, .6); stars(b, L.T, L.T > 40.7 ? 4 : 0);
  plaza(L, { cx: BKP.x, cz: BKP.z - 6, n: 8, r0: 6, r1: 16, seed: 43, mode: 'shock' });
  orbit(V(BKP.x, 2.6, BKP.z - 1.2), 14, 2.1, .14, 46); sh(BKP, 16); }, [[.05, 'whoosh_down', .45], [.45, 'thud', .7], [.55, 'glass_clink', .35]]);
// ---------- c: la policía, «Nein», la alcaldesa, el agujero lila, «Korken» (41,34 – 61,74 s) ----------
const myChairScene = (L, o = {}) => { myHole(L, o.glow ?? 0, o.bub ?? 0); rollBottle(MYB, V(HP.x + 2.6, 0, HP.z + 2.2), .8, 0); };
const lilaK = T => clamp((T - 56.2) / .5);     // el resplandor lila (desde que sale la luz)
// la alcaldesa: de pie junto a su botella (DP), mirando hacia mí
const DRY = Math.atan2(CP.x - DP.x, CP.z - DP.z);
function dornAt(L, o = {}) { const d = put(dorn, DP.x + Math.sin(DRY) * -2.4 + (o.dx || 0), 0, DP.z + Math.cos(DRY) * -2.4 + (o.dz || 0), o.ry ?? DRY); actuar(d, 0, [[0, o.pose || {}]], { T: L.T }); return d; }
// 39 «Die Polizei rennt auf mich zu:»: dos policías cruzan la plaza corriendo hacia mí
shot(41.34, 'S', null, L => { town(L); myChairScene(L); const run = (c, x0, z0, i) => { const p = put(c, x0 - L.lt * 5.5, 0, z0 - L.lt * 4.2, Math.atan2(-5.5, -4.2)); p.root.position.y = Math.abs(Math.sin(L.T * 13 + i)) * .35; actuar(p, 0, [[0, runP(L.T, i)]], { T: L.T }); cara(p, L.T, { expr: 'angry', mouth: 'talk_wide' }); return p; };
  const a = run(cop1, 18, 32, 0), b = run(cop2, 22, 30, 2);
  plaza(L, { cx: 12, cz: 22, n: 14, r0: 6, r1: 22, seed: 45, mode: 'stare', face: hp(a) });
  const m = a.root.position; cm([m.x - 8, 6, m.z - 9], [m.x - 6, 5.6, m.z - 7], L.k); camera.lookAt(m.x + 1, 3.6, m.z + 1); camera.fov = 48; sh(V(m.x, 0, m.z), 22); }, [[0, 'whistle', .55], [.2, 'run_steps', .5]]);
// 40 «„Sofort zurück»: el policía me grita y señala al suelo
shot(42.82, 'C', 'punch', L => { town(L); myChairScene(L); const p = put(cop1, CP.x + 1.2, 0, CP.z + 6, Math.PI + .15); actuar(p, 0, [[0, { aRx: 1.3, aRz: .1, aRe: .1, aLx: .4, aLz: .3, aLe: 1.4, lean: .12, headX: .1 }]], { T: L.T }); talk(p, L.T, 42.8, 44.4, 'angry');
  const q = put(cop2, CP.x + 4.2, 0, CP.z + 5.4, Math.PI - .5); actuar(q, 0, [[0, GEST.cross]], { T: L.T }); cara(q, L.T, { expr: 'angry', mouth: 'flat' });
  plaza(L, { cx: CP.x, cz: CP.z + 14, n: 8, r0: 5, r1: 14, seed: 47, mode: 'stare', face: hp(p) });
  onFace(p, 6, .4, -.6, 42, L.k, 5); bubble(p, 'Sofort zurück auf eine Flasche!', clamp((L.lt - .05) / .15), 1.6); sh(V(CP.x, 0, CP.z + 6), 14); }, [[0, 'shout_m', .45]]);
// 41 «auf eine Flasche!“»: por encima de mi hombro: los dos policías delante de mi silla, uno señala mi botella tirada
shot(43.70, 'W', null, L => { town(L); myChairScene(L); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.2, aLx: .4, aRx: .4, aLz: .3, aRz: .3 }); cara(c, L.T, { expr: 'neutral' });
  const p = put(cop1, CP.x + 1.2, 0, CP.z + 6, Math.PI + .15); actuar(p, 0, [[0, { aRx: 1.0, aRz: -.3, aRe: .1, lean: .1, headX: .25, headY: .35 }]], { T: L.T }); talk(p, L.T, 42.8, 44.4, 'angry');
  const q = put(cop2, CP.x + 4.2, 0, CP.z + 5.4, Math.PI - .5); actuar(q, 0, [[0, GEST.cross]], { T: L.T }); cara(q, L.T, { expr: 'angry', mouth: 'flat' });
  cm([CP.x - 2.4, 11, CP.z - 5], [CP.x - 2, 10.6, CP.z - 4.2], L.k); camera.lookAt(CP.x + 2, 4, CP.z + 6); camera.fov = 48; sh(V(CP.x, 0, CP.z + 3), 16); }, [[0, 'tsk', .4]]);
// 42 «Aber ich sage:»: me cruzo de brazos y me recuesto
shot(44.52, 'F', null, L => { town(L); myChairScene(L); const c = inChair(ich, CP.x, CP.z, 0, L, { ...GEST.cross, lean: -.3 }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' });
  plaza(L, { n: 10, r0: 8, r1: 20, seed: 49, mode: 'stare', face: hp(c) });
  onBody(c, 14, -.35, .1, 44, L.k, 12, -.2, 2.4); sh(CP, 16); }, [[.1, 'cloth', .4]]);
// 43 «„Nein.»: primer plano: «NEIN.»
shot(45.54, 'C', 'punch', L => { town(L); myChairScene(L); const c = inChair(ich, CP.x, CP.z, 0, L, { ...GEST.cross, lean: -.3 }); cara(c, L.T, { expr: 'determined', mouth: L.lt < .25 ? 'o' : 'flat' });
  onFace(c, 6.2, .3, .2, 40, L.k, 5.4); badge('red', 'NEIN.', W / 2, H * .12, clamp(L.lt / .1), 1, 1.1); sh(CP, 12); }, [[0, 'impact', .55]]);
// 44 «Mein Stuhl ist»: doy palmaditas al respaldo
shot(46.03, 'S', null, L => { town(L); myChairScene(L); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.3, aRx: -.3 + Math.abs(Math.sin(L.T * 9)) * .3, aRz: .9, aRe: 1.6, aLx: .5, aLz: .4 }); cara(c, L.T, { expr: 'smug', mouth: 'grin' });
  cm([CP.x + 4.5, 5.4, CP.z + 4.4], [CP.x + 3.8, 5.2, CP.z + 3.6], L.k); camera.lookAt(CP.x, 4.4, CP.z - .5); camera.fov = 44; sh(CP, 12); }, [[.15, 'pat', .5], [.35, 'pat', .4]]);
// 45 «tausendmal bequemer.“»: los policías se miran sin palabras; «1000× BEQUEMER»
shot(46.71, 'R', null, L => { town(L); myChairScene(L); const c = inChair(ich, CP.x, CP.z, 0, L, { lean: -.35, aLx: -.2, aRx: -.2, aLz: 1.0, aRz: 1.0, aLe: 2.2, aRe: 2.2 }); grin(c, L.T, { eyes: 'closed' });
  const p = put(cop1, CP.x + 1.2, 0, CP.z + 6, Math.PI + .5); actuar(p, 0, [[0, GEST.shock]], { T: L.T }); cara(p, L.T, { expr: 'shock', mouth: 'o' }); const q = put(cop2, CP.x + 4.2, 0, CP.z + 5.4, Math.PI - 1.0); actuar(q, 0, [[0, GEST.shrug]], { T: L.T }); cara(q, L.T, { expr: 'confused', mouth: 'flat' });
  plaza(L, { n: 10, r0: 10, r1: 22, seed: 51, mode: 'shock' });
  orb(L.k, V(CP.x + 2, 3.4, CP.z + 3), null, [20, -.7, .2, 46], [18, -.45, .16, 46]); badge('gold', '1000× BEQUEMER', W / 2, H * .15, clamp((L.T - 46.75) / .15), 1, .85); sh(V(CP.x, 0, CP.z + 3), 18); }, [[0, 'ding_reveal', .45], [.4, 'murmur', .4]]);
// 46 «Da brüllt die Bürgermeisterin:»: la alcaldesa salta de su botella y grita con los puños cerrados
shot(48.06, 'Z', 'punch', L => { town(L); const k = clamp((L.T - 48.1) / .3); show(DORNB, DP.x, 0, DP.z, 0); DORNB.userData.collar.visible = true;
  const d = put(dorn, DP.x, lerp(sitY(dorn), 0, k), DP.z + lerp(0, 1.8, k), DRY); actuar(d, 0, [[0, { ...GEST.fists, ...(k < 1 ? seatPose() : {}), lean: .15, headX: -.1 }]], { T: L.T }); talk(d, L.T, 48.1, 49.5, 'angry'); d.blob.visible = k > .8;
  plaza(L, { cx: DP.x, cz: DP.z - 6, n: 10, r0: 6, r1: 18, seed: 53, mode: 'shock' });
  onBody(d, 15, 0, .14, 44, L.k, 12.5, 0, 3.2); badge('tag', 'BÜRGERMEISTERIN', W / 2, H * .14, clamp((L.lt - .1) / .15), 1, .85); sh(DP, 18); }, [[0, 'shout_f', .55], [.05, 'glass_clink', .4]]);
// 47 «„Weißt du denn nicht,»: primer plano de la alcaldesa gritando
shot(49.58, 'C', null, L => { town(L); show(DORNB, DP.x, 0, DP.z, 0); DORNB.userData.collar.visible = true; const d = dornAt(L, { pose: { ...GEST.fists, aRx: 1.4, aRz: .1, aRe: .4, lean: .15 } }); talk(d, L.T, 49.5, 51.5, 'angry');
  onFace(d, 5.6, .2, .6, 40, L.k, 4.6); bubble(d, 'Wozu sind die Flaschen da?', clamp((L.lt - .05) / .15), 1.6); sh(DP, 14); }, [[0, 'shout_f', .45]]);
// 48 «wozu die Flaschen da sind?“»: desde detrás de ella: señala a toda la plaza sentada en botellas; yo en mi silla al fondo
shot(50.48, 'W', null, L => { town(L); myChairScene(L); show(DORNB, DP.x, 0, DP.z, 0); DORNB.userData.collar.visible = true; const d = dornAt(L, { pose: { aRx: 1.6, aRz: .4, aRe: .1, aLx: .5, aLz: -.4, aLe: 1.3, headY: .4 } }); talk(d, L.T, 49.5, 51.5, 'angry');
  const c = inChair(ich, CP.x, CP.z, faceTo(CP, DP), L, { lean: -.2, aLx: .5, aRx: .5 }); cara(c, L.T, { expr: 'confused' });
  plaza(L, { n: 16, r0: 8, r1: 28, seed: 55, mode: 'stare', face: hp(d) });
  const h = hp(d); cm([h.x + 3.4, 8.4, h.z - 6], [h.x + 2.8, 8.2, h.z - 5], L.k); camera.lookAt(CP.x, 3.4, CP.z); camera.fov = 50; sh(V(CP.x, 0, CP.z), 22); }, [[0, 'murmur', .4]]);
// 49 «Ganz langsam zieht sie» (zoom lento): se agacha y agarra su propia botella con las dos manos
shot(51.73, 'I', 'slow', L => { town(L); show(DORNB, DP.x, 0, DP.z, 0); DORNB.userData.collar.visible = true; const d = put(dorn, DP.x, 0, DP.z - 2.1, 0); actuar(d, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.22, aRz: -.22, aLe: .5, aRe: .5, lean: .3, crouch: .3, headX: .1 }]], { T: L.T }); cara(d, L.T, { expr: 'determined', eyes: 'squint', mouth: 'flat' });
  plaza(L, { cx: DP.x, cz: DP.z - 6, n: 10, r0: 6, r1: 16, seed: 57, mode: 'stare', face: V(DP.x, 3, DP.z) });
  orb(L.k, V(DP.x, 3.6, DP.z - 1), null, [18, .2, .2, 46], [11, .1, .14, 44], easeIn); sh(DP, 16); }, [[.2, 'glass_creak', .45]]);
// 50 «ihre eigene Flasche aus dem Boden.»: la botella sube, despacio; por debajo asoma una luz lila
shot(53.38, 'F', null, L => { town(L); const k = easeInOut(clamp((L.T - 53.45) / 1.15)); const h = show(HOLES[1], DP.x, 0, DP.z); h.userData.set(k * .5, 0, L.T); show(DORNB, DP.x, k * 3.6, DP.z, 0); DORNB.userData.collar.visible = false;
  const d = put(dorn, DP.x, 0, DP.z - 2.1, 0); actuar(d, 0, [[0, { aLx: 1.6 + k * .7, aRx: 1.6 + k * .7, aLz: -.22, aRz: -.22, aLe: .5, aRe: .5, lean: .3 - k * .35, crouch: .3 * (1 - k), headX: -.1 }]], { T: L.T }); cara(d, L.T, { expr: 'determined', mouth: 'flat' });
  plaza(L, { cx: DP.x, cz: DP.z - 6, n: 10, r0: 6, r1: 16, seed: 59, mode: 'shock' });
  cm([DP.x + 8, 4.4, DP.z + 2], [DP.x + 7, 4.6, DP.z + 1.2], L.k); camera.lookAt(DP.x, 3.6, DP.z - 1); camera.fov = 46; sh(DP, 14); }, [[0, 'glass_creak', .5], [.6, 'hum_low', .4]]);
// 51 «Darunter ist ein Loch.»: cenital: el agujero, negro y profundo; las cabezas asomándose alrededor
shot(54.68, 'C', 'punch', L => { town(L); const h = show(HOLES[1], DP.x, 0, DP.z); h.userData.set(.25, 0, L.T);
  crowdAt(L, DP.x, DP.z, 8, 3.2, 4.2, 61, { mode: 'idle', expr: 'shock', face: V(DP.x, 0, DP.z), full: true, list: [dorn, ...EX.slice(0, 7)] });
  POST.push(() => [dorn, ...EX.slice(0, 7)].forEach((c, i) => { if (c.root.visible) { actuar(c, 0, [[0, { lean: .45, headX: .6, aLx: .3, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); } }));
  if (dorn.root) show(DORNB, DP.x + 1.6, 6, DP.z - .4, 0);
  cm([DP.x + .4, 15.5, DP.z + 6], [DP.x + .3, 13.5, DP.z + 5], L.k); camera.lookAt(DP.x, 0, DP.z); camera.fov = 50; badge('tag', 'EIN LOCH', W / 2, H * .14, clamp((L.T - 55.65) / .12), 1, .9); sh(DP, 12); }, [[0, 'wind', .4], [.9, 'creepy_ting', .4]]);
// 52 «Und aus diesem Loch kommt»: ¡FUUM! un haz de luz lila sale disparado hacia el cielo
shot(56.14, 'Z', 'punch', L => { town(L, { lila: lilaK(L.T) > .5 }); const g = easeOut(lilaK(L.T)); const h = show(HOLES[1], DP.x, 0, DP.z); h.userData.set(.3 + g * .7, 0, L.T); h.scale.set(1, 1 + g * 2.5, 1);
  const d = put(dorn, DP.x - 1.6, 0, DP.z - 2.4, .5); actuar(d, 0, [[0, { aRx: 2.4, aRz: .4, aRe: .3, aLx: .4, lean: -.1, headX: -.25 }]], { T: L.T }); attach(DORNB, d.aR.el, [0, -1.2, .3], [Math.PI, 0, 0], .7); cara(d, L.T, { expr: 'smug', mouth: 'smirk' });
  plaza(L, { cx: DP.x, cz: DP.z - 4, n: 12, r0: 5, r1: 18, seed: 63, mode: 'shock' }); sparks(V(DP.x, 1, DP.z), 56.2, L.T, 30, .9);
  cm([DP.x + 2, 3, DP.z + 16], [DP.x + 1.6, 4.6, DP.z + 14], L.k); camera.lookAt(DP.x, 7, DP.z); camera.fov = 52; sh(DP, 20); }, [[.05, 'magic_hit', .6], [.1, 'hum_low', .5]]);
// 53 «ein lila Leuchten.»: mi cara iluminada de lila desde abajo; boca abierta
shot(57.43, 'S', null, L => { town(L, { lila: 1 }); myChairScene(L); const c = inChair(ich, CP.x, CP.z, faceTo(CP, DP), L, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9, lean: -.05 }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  FILL.color.setRGB(.8, .35, 1); FILL.intensity = 70; const h = show(HOLES[1], DP.x, 0, DP.z); h.userData.set(1, 0, L.T); h.scale.set(1, 3.5, 1);
  onFace(c, 5.2, -.2, .5, 40, L.k, 4.4); badge('big', 'LILA', W / 2, H * .15, clamp((L.T - 57.65) / .12), 1, .9); sh(CP, 12); }, [[0, 'shimmer', .5]]);
// 54 «Denn die Flaschen sind keine Stühle.»: plano general de la plaza teñida de lila: todos se agarran a sus botellas
shot(58.69, 'C', null, L => { town(L, { lila: 1 }); myChairScene(L); const h = show(HOLES[1], DP.x, 0, DP.z); h.userData.set(1, 0, L.T); h.scale.set(1, 3.5, 1);
  const d = put(dorn, DP.x - 1.6, 0, DP.z - 2.4, .5); actuar(d, 0, [[0, { aRx: 1.2, aRz: .2, aRe: .3, aLx: 1.6, aLz: .3, aLe: .2 }]], { T: L.T }); attach(DORNB, d.aR.el, [0, -1.2, .3], [Math.PI, 0, 0], .7); talk(d, L.T, 58.6, 60.4, 'angry');
  inChair(ich, CP.x, CP.z, faceTo(CP, DP), L, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9 }); cara(ich, L.T, { expr: 'shock' });
  plaza(L, { n: 26, r0: 6, r1: 30, seed: 65, mode: i => i % 3 ? 'ouch' : 'shock' });
  cm([24, 20, 34], [20, 18, 30], L.k); camera.lookAt(0, 2, -2); camera.fov = 50; sh(V(0, 0, 0), 40); }, [[0, 'hum_low', .45], [.3, 'murmur', .35]]);
// 55 «Sie sind Korken.»: la alcaldesa levanta la botella como un trofeo: «KORKEN!»
shot(60.59, 'I', 'punch', L => { town(L, { lila: 1 }); const h = show(HOLES[1], DP.x, 0, DP.z); h.userData.set(1, 0, L.T); h.scale.set(1, 1.6, 1);
  const d = put(dorn, DP.x - 3.6, 0, DP.z - 1.4, .9); actuar(d, 0, [[0, { aRx: 2.9, aRz: .3, aRe: .1, aLx: .3, aLz: .3, headX: -.15 }]], { T: L.T }); attach(DORNB, d.aR.el, [0, -1.3, .3], [Math.PI, 0, 0], .7); talk(d, L.T, 60.5, 61.6, 'angry');
  plaza(L, { cx: DP.x, cz: DP.z - 6, n: 8, r0: 6, r1: 16, seed: 67, mode: 'shock' });
  onBody(d, 16, .2, .2, 46, L.k, 13.5, .1, 4.4); badge('gold', 'KORKEN!', W / 2, H * .15, clamp((L.T - 60.95) / .12), 1, 1.1); sh(DP, 16); }, [[.35, 'cork_pop', .6], [.4, 'impact', .5]]);
// ---------- d: la cueva, el agujero burbujea, la persecución de la botella, «Plopp», el final (61,74 s – fin) ----------
const ROLL0 = V(HP.x + 2.6, 0, HP.z + 2.2);
// recorrido de la botella que rueda (78,1 → 84,2 s): de mi agujero cruza la plaza hacia el Dom y vuelve en curva
const rollPath = T => { const k = clamp((T - 77.6) / 6.6); const a = k * Math.PI * 1.3; return V(HP.x + 2.6 - Math.sin(a) * 26, 0, HP.z + 2.2 - (1 - Math.cos(a)) * 14); };
const rollDir = T => { const p = rollPath(T), q = rollPath(T + .05); return Math.atan2(q.x - p.x, q.z - p.z); };
const eyesK = T => T < 63.6 ? 0 : easeOut(clamp((T - 63.6) / .6));
// 56 «Vor 300 Jahren»: la cueva bajo la ciudad: oscuridad lila, botellas que asoman del techo; «VOR 300 JAHREN»
shot(61.74, 'F', null, L => { hoehleS(L, { eyes: .05 }); grade.uniforms.sepia.value = .25;
  cm([HX + 8, 6, 34], [HX + 5, 8, 28], L.k); camera.lookAt(HX, 14, -20); camera.fov = 56; badge('gold', 'VOR 300 JAHREN', W / 2, H * .15, clamp((L.T - 61.84) / .15), 1, .95); }, [[0, 'cave_drip', .55], [.3, 'rumble', .45]]);
// 57 «wurde unter der Stadt»: la cámara sube hacia el techo: el fondo de cientos de botellas clavadas
shot(62.78, 'R', null, L => { hoehleS(L, { eyes: 0 });
  cm([HX, 8, 14], [HX + 1, 16, 6], L.k); camera.lookAt(HX + 2, 34, -8); camera.fov = 58; }, [[0, 'rumble', .45], [.5, 'cave_drip', .4]]);
// 58 «etwas eingesperrt.» (zoom lento): en la oscuridad se abren unos ojos lila enormes
shot(64.22 - .4, 'C', 'slow', L => { hoehleS(L, { eyes: eyesK(L.T) });
  cm([HX, 9, 20], [HX, 10, 6], L.k, easeIn); camera.lookAt(HX, 10, -40); camera.fov = 50; }, [[.2, 'growl', .55], [.5, 'creepy_ting', .45]]);
// 59 «Und jede Flasche hält es da unten fest,»: el techo de botellas visto de cerca; el monstruo empuja, pero no se mueven
shot(65.22, 'S', null, L => { hoehleS(L, { eyes: 1 }); HO.BOT.forEach((b, i) => { b.position.y += Math.sin(L.T * 20 + i) * .04; });
  cm([HX - 6, 18, 0], [HX - 4, 20, -2], L.k); camera.lookAt(HX + 4, 32, -10); camera.fov = 52; }, [[0, 'glass_creak', .5], [.4, 'growl', .4]]);
// 60 «aber nur, solange»: de vuelta en la plaza: un vecino intenta levantarse de su botella...
shot(66.58 + .68, 'W', null, L => { town(L, { lila: 1 }); const up = L.T < 67.9 ? easeOut(clamp((L.T - 67.3) / .3)) : 1 - easeIn(clamp((L.T - 67.9) / .2)); const P = V(14, 0, 18);
  const c = seat(EX[8], P.x, P.z, -.6, L, { wob: 0, pose: { aLx: .4, aRx: .4, lLk: 1.5 - up * 1.2, lRk: 1.5 - up * 1.2, lLx: 1.5 - up * 1.2, lRx: 1.5 - up * 1.2 } }); c.root.position.y += up * 1.2;
  const h = show(HOLES[2], P.x, 0, P.z); h.userData.set(up * .8, 0, L.T); if (up > .05) BOTS.forEach(b => { if (b.visible && Math.abs(b.position.x - P.x) < .1 && Math.abs(b.position.z - P.z) < .1) b.position.y = up * .9; });
  cara(c, L.T, { expr: up > .5 ? 'shock' : 'worried', mouth: up > .5 ? 'o' : 'grimace' });
  plaza(L, { cx: P.x, cz: P.z - 6, n: 8, r0: 5, r1: 14, seed: 71, mode: 'point', face: hp(c) });
  onBody(c, 15, 0, .12, 44, L.k, 13, 0, 3.6); sh(P, 16); }, [[.1, 'glass_creak', .45], [.5, 'growl', .4]]);
// 61 «jemand draufsitzt.»: ... el agujero brilla: se vuelve a sentar de golpe; todos se agarran fuerte
shot(68.08, 'C', 'punch', L => { town(L, { lila: 1 }); const P = V(14, 0, 18); const c = seat(EX[8], P.x, P.z, -.6, L, { wob: .06, pose: { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: .4, aRe: .4, lean: .2 } }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T);
  plaza(L, { cx: P.x, cz: P.z - 6, n: 10, r0: 5, r1: 16, seed: 73, mode: 'ouch' });
  orbit(V(P.x, 4.6, P.z), 13, -.4, .12, 44); badge('red', 'SITZEN BLEIBEN!', W / 2, H * .15, clamp((L.T - 68.32) / .12), 1, .85); sh(P, 16); }, [[0, 'thud', .55]]);
// 62 «Langsam schaue ich auf das Loch,» (zoom lento): giro la cabeza muy despacio hacia mi agujero
shot(69.22, 'I', 'slow', L => { town(L, { lila: 1 }); myChairScene(L, { glow: .2 }); const k = easeInOut(clamp((L.T - 69.3) / 1.0)); const c = inChair(ich, CP.x, CP.z, 0, L, { headY: -k * 1.0, headX: k * .3, aLx: .4, aRx: .4 }); cara(c, L.T, { expr: 'worried', eyes: k > .6 ? 'side_r' : 'worried', mouth: 'flat' }); sweat(c, L.T);
  onFace(c, 7, .3, 0, 42, L.k, 5); sh(CP, 14); }, [[.2, 'heartbeat', .55]]);
// 63 «aus dem ich vorhin meine Flasche gezogen habe.»: mi agujero, junto a la silla; mi botella tirada al lado
shot(70.64, 'S', null, L => { town(L, { lila: 1 }); myChairScene(L, { glow: .25 }); inChair(ich, CP.x, CP.z, .6, L, { headY: -.6, headX: .4 }); cara(ich, L.T, { expr: 'worried' });
  cm([HP.x + 5, 7.5, HP.z + 8], [HP.x + 3.4, 6, HP.z + 6], L.k); camera.lookAt(HP.x, .4, HP.z); camera.fov = 46; sh(HP, 12); }, [[0, 'wind', .4]]);
// 64 «Es fängt an zu blubbern.»: ¡el agujero burbujea lila!
shot(72.54, 'C', 'punch', L => { town(L, { lila: 1 }); const g = clamp((L.T - 72.7) / .4); myChairScene(L, { glow: .3 + g * .6, bub: g }); SHAKE = .25;
  cm([HP.x + 2.4, 5, HP.z + 5], [HP.x + 1.8, 4.2, HP.z + 4], L.k); camera.lookAt(HP.x, .6, HP.z); camera.fov = 44; badge('tag', 'BLUBB BLUBB', W / 2, H * .17, clamp((L.T - 73.2) / .12), 1, .9); sh(HP, 12); }, [[.1, 'bubbles', .7], [.4, 'growl', .4]]);
// 65 «Alle schreien:»: toda la plaza grita desde sus botellas
shot(73.84, 'Z', null, L => { town(L, { lila: 1 }); myChairScene(L, { glow: .9, bub: 1 });
  plaza(L, { n: 26, r0: 6, r1: 30, seed: 75, mode: 'shout' }); inChair(ich, CP.x, CP.z, 0, L, GEST.shock); cara(ich, L.T, { expr: 'shock', mouth: 'o' });
  cm([CP.x - 6, 16, CP.z + 26], [CP.x - 4, 14, CP.z + 22], L.k); camera.lookAt(CP.x, 3, CP.z - 4); camera.fov = 50; sh(V(CP.x, 0, CP.z - 4), 34); }, [[0, 'shout_crowd', .55]]);
// 66 «„Flasche rein!»: primer plano: dos vecinos gritando
shot(74.62, 'C', 'punch', L => { town(L, { lila: 1 }); const a = seat(EX[2], CP.x - 2, CP.z - 6, .1, L, { wob: .05 }); seatMode(a, L, 1, 'shout'); const b = seat(EX[11], CP.x + 2.2, CP.z - 7.5, -.2, L, { wob: .05 }); seatMode(b, L, 2, 'shout');
  plaza(L, { cx: CP.x, cz: CP.z - 14, n: 8, r0: 4, r1: 14, seed: 77, mode: 'shout', gap: 1.5 });
  cm([CP.x + .2, 7.6, CP.z + 4], [CP.x + .1, 7.2, CP.z + 2.8], L.k); camera.lookAt(CP.x, 6, CP.z - 7); camera.fov = 46; badge('red', 'FLASCHE REIN!', W / 2, H * .15, clamp((L.T - 74.62) / .1), 1, .95); sh(V(CP.x, 0, CP.z - 6), 16); }, [[0, 'shout_crowd', .5]]);
// 67 «Flasche rein!“»: la alcaldesa y los policías también, señalando el agujero
shot(75.36, 'W', 'punch', L => { town(L, { lila: 1 }); myChairScene(L, { glow: .9, bub: 1 }); const d = put(dorn, HP.x + 4, 0, HP.z - 6, -.6); actuar(d, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: 2.0, aLz: .9, aLe: 1.6, lean: .1 }]], { T: L.T }); cara(d, L.T, { expr: 'shout', mouth: 'talk_wide' });
  const p = put(cop1, HP.x + 7, 0, HP.z - 3, -1.1); actuar(p, 0, [[0, { aLx: 2.0, aRx: 2.0, aLz: .9, aRz: .9, aLe: 1.6, aRe: 1.6 }]], { T: L.T }); cara(p, L.T, { expr: 'shout', mouth: 'talk_wide' });
  cm([HP.x - 3, 7, HP.z + 9], [HP.x - 2.4, 6.6, HP.z + 7.6], L.k); camera.lookAt(HP.x + 3, 3.4, HP.z - 3); camera.fov = 48; badge('red', 'FLASCHE REIN!', W / 2, H * .15, clamp((L.T - 75.36) / .1), 1, 1.05); sh(HP, 16); }, [[0, 'shout_f', .45]]);
// 68 «Ich will sie zurückstecken,»: salto de la silla y me lanzo a por mi botella
shot(76.08, 'S', null, L => { town(L, { lila: 1 }); myHole(L, .9, 1); show(CHAIR, CP.x, 0, CP.z, 0); const k = easeOut(clamp((L.T - 76.1) / .7));
  const c = put(ich, lerp(CP.x, HP.x + 1.4, k), Math.sin(k * Math.PI) * 1.4, lerp(CP.z + .3, HP.z + 2.6, k), 1.4); actuar(c, 0, [[0, { ...GEST.reach, lean: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'scream' });
  rollBottle(MYB, V(ROLL0.x + clamp((L.T - 76.9) / .4) * .4, 0, ROLL0.z), .8, L.T * 2 * clamp(L.T - 76.9));
  orbit(V(HP.x + 1, 3.6, HP.z + 2), 16, .3, .14, 46); sh(HP, 16); }, [[0, 'whoosh_up', .4], [.6, 'grunt', .45]]);
// 69 «aber sie ist weggerollt.»: plano bajo: la botella se aleja rodando por el adoquín
shot(77.33, 'C', null, L => { town(L, { lila: 1 }); myHole(L, .9, 1); const p = rollPath(L.T + .3); rollBottle(MYB, p, rollDir(L.T + .3), L.T * 9);
  const c = put(ich, HP.x + 1.6, 0, HP.z + 2.8, -1.6); actuar(c, 0, [[0, { ...GEST.reach, lean: .5, crouch: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  cm([p.x - 2, 1.4, p.z + 6], [p.x - 2.6, 1.6, p.z + 6.6], L.k); camera.lookAt(p.x, 1.2, p.z); camera.fov = 48; sh(p, 14); }, [[0, 'bottle_roll', .65]]);
// 70 «Sie rollt quer über den ganzen Domplatz,»: la botella rueda delante del Dom; la gente aparta los pies
shot(78.47, 'R', null, L => { town(L, { lila: 1 }); const p = rollPath(L.T + .3); rollBottle(MYB, p, rollDir(L.T + .3), L.T * 9);
  plaza(L, { cx: p.x, cz: p.z, n: 12, r0: 5, r1: 18, seed: 79, mode: 'point', face: p, gap: 1.3 });
  cm([p.x + 6, 3, p.z + 12], [p.x + 4, 3.4, p.z + 10], L.k); camera.lookAt(p.x - 2, 4, p.z - 4); camera.fov = 50; sh(p, 18); }, [[0, 'bottle_roll', .6], [.4, 'gasp', .35]]);
// 71 «Domplatz,»: desde el aire: la botella cruza toda la plaza
shot(79.69, 'Z', null, L => { town(L, { lila: 1 }); myHole(L, .9, 1); const p = rollPath(L.T + .3); rollBottle(MYB, p, rollDir(L.T + .3), L.T * 9);
  plaza(L, { n: 26, r0: 5, r1: 32, seed: 81, mode: 'point', face: p });
  cm([p.x + 8, 22, p.z + 18], [p.x + 7, 20, p.z + 16], L.k); camera.lookAt(p.x, 0, p.z - 2); camera.fov = 50; sh(p, 40); }, [[0, 'bottle_roll', .5]]);
// 72 «und die ganze Stadt rennt hinterher.»: todos saltan de sus botellas y corren detrás (los agujeros brillan)
shot(80.49, 'W', null, L => { town(L, { lila: 1 }); const p = rollPath(L.T + .3); rollBottle(MYB, p, rollDir(L.T + .3), L.T * 9); const dir = rollDir(L.T + .3);
  crowdAt(L, p.x - Math.sin(dir) * 9, p.z - Math.cos(dir) * 9, 18, 2, 10, 83, { mode: 'run', ry: dir, speed: 0, full: true });
  cm([p.x + Math.sin(dir) * 10 + 3, 5.5, p.z + Math.cos(dir) * 10], [p.x + Math.sin(dir) * 9 + 2, 5, p.z + Math.cos(dir) * 9], L.k); camera.lookAt(p.x - Math.sin(dir) * 6, 3, p.z - Math.cos(dir) * 6); camera.fov = 52; sh(p, 30); }, [[0, 'run_steps', .55], [.2, 'shout_crowd', .45]]);
// 73 «hinterher.»: yo delante de todos, corriendo con todas mis fuerzas
shot(81.35, 'S', null, L => { town(L, { lila: 1 }); const p = rollPath(L.T + .3), dir = rollDir(L.T + .3); rollBottle(MYB, p, dir, L.T * 9);
  const c = put(ich, p.x - Math.sin(dir) * 4.5, 0, p.z - Math.cos(dir) * 4.5, dir); c.root.position.y = Math.abs(Math.sin(L.T * 13)) * .35; actuar(c, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grimace' });
  crowdAt(L, p.x - Math.sin(dir) * 12, p.z - Math.cos(dir) * 12, 10, 1, 7, 85, { mode: 'run', ry: dir, speed: 0, full: true });
  onBody(c, 15, 0, .14, 46, L.k, 13); sh(c.root.position, 20); }, [[0, 'run_steps', .55]]);
// 74 «In letzter Sekunde» (zoom lento): me lanzo en plancha a por ella, a cámara lenta
shot(82.03, 'I', 'slow', L => { town(L, { lila: 1 }); const tt = 82.03 + (L.T - 82.03) * .35, p = rollPath(tt + .3), dir = rollDir(tt + .3); rollBottle(MYB, p, dir, tt * 9);
  const k = clamp((L.T - 82.03) / 1.5); const c = put(ich, p.x - Math.sin(dir) * (3.5 - k * 1.8), 1.2 + Math.sin(k * Math.PI) * .8, p.z - Math.cos(dir) * (3.5 - k * 1.8), dir); c.root.rotation.order = 'YXZ'; c.root.rotation.x = 1.25; actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .1, aRz: .1, aLe: .1, aRe: .1, lLx: -.2, lRx: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'scream' }); c.blob.visible = false;
  orbit(V(c.root.position.x, 2.2, c.root.position.z), lerp(14, 11, L.k), dir + 1.3, .12, 46); badge('tag', 'LETZTE SEKUNDE', W / 2, H * .15, clamp((L.T - 82.93) / .12), 1, .9); sh(p, 14); }, [[0, 'slowmo', .5]]);
// 75 «fange ich sie,»: ¡la atrapo! la abrazo contra el pecho
shot(83.61, 'C', 'punch', L => { town(L, { lila: 1 }); const P = V(HP.x - 3, 0, HP.z - 6); const c = put(ich, P.x, 0, P.z, .4); actuar(c, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.5, aRz: -.5, aLe: .7, aRe: .7, crouch: .25, lean: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grin' });
  attach(MYB, c.root, [0, 3.2, 1.3], [Math.PI / 2 - .3, 0, 0], .55); dust(V(P.x, 0, P.z), 83.6, L.T, 8, .5);
  onBody(c, 13, .1, .1, 44, L.k, 11.5); sh(P, 14); }, [[0, 'catch', .6]]);
// 76 «stecke sie ins Loch»: la clavo boca abajo... no: de pie, en el agujero que burbujea
shot(84.45, 'F', null, L => { town(L, { lila: 1 }); const k = easeIn(clamp((L.T - 84.5) / .4)); myHole(L, .9 * (1 - k * .5), 1 - k * .5); show(CHAIR, CP.x, 0, CP.z, 0);
  show(MYB, HP.x, lerp(2.2, 0, k), HP.z, 0); MYB.userData.collar.visible = k > .95;
  const c = put(ich, HP.x, 0, HP.z - 2.3, 0); actuar(c, 0, [[0, { aLx: 1.6, aRx: 1.6, aLz: -.25, aRz: -.25, aLe: .5, aRe: .5, lean: .3, crouch: .2 + k * .2 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grimace' });
  cm([HP.x + 5, 6, HP.z + 8], [HP.x + 4, 5.4, HP.z + 7], L.k); camera.lookAt(HP.x, 2.4, HP.z + .6); camera.fov = 46; sh(HP, 14); }, [[.35, 'glass_thud', .6]]);
// 77 «und setze mich drauf.»: me siento encima de golpe; la luz lila se apaga poco a poco
shot(85.19, 'S', null, L => { town(L, { lila: L.T < 86.2 }); const k = easeOut(clamp((L.T - 85.4) / .35)); myHole(L, 0); show(CHAIR, CP.x, 0, CP.z, 0);
  const c = seat(ich, HP.x, HP.z, 0, L, { col: 0, wob: .06, pose: { aLx: 1.2, aRx: 1.2, aLz: .3, aRz: .3, lean: .15 } }); c.root.position.y += (1 - k) * 1.6; cara(c, L.T, { expr: 'determined', eyes: 'closed', mouth: 'grimace' });
  plaza(L, { cx: HP.x, cz: HP.z - 8, n: 10, r0: 4, r1: 14, seed: 87, mode: 'shock', bottle: false });
  onBody(c, 16, .3, .12, 44, L.k, 13, .1, 4.4); sh(HP, 16); }, [[.25, 'thud', .6]]);
// 78 «Plopp.»: primer plano: «PLOPP!»
shot(86.60, 'C', 'punch', L => { town(L); const c = seat(ich, HP.x, HP.z, 0, L, { col: 0, wob: .03, pose: { aLx: 1.2, aRx: 1.2, aLz: .3, aRz: .3, lean: .1 } }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  cm([HP.x + 3.6, 7.6, HP.z + 9.5], [HP.x + 3.2, 7.4, HP.z + 8.5], L.k); camera.lookAt(HP.x, 6.2, HP.z); camera.fov = 44; badge('gold', 'PLOPP!', W / 2, H * .17, clamp(L.lt / .1), 1, 1.2); sh(HP, 12); }, [[0, 'cork_pop', .85]]);
// 79 «Das Blubbern hört auf.»: silencio; la plaza vuelve a la normalidad; todos respiran aliviados
shot(87.30, 'W', null, L => { town(L); show(CHAIR, CP.x, 0, CP.z, 0); const c = seat(ich, HP.x, HP.z, 0, L, { col: 0, pose: { aLx: .4, aRx: .4, lean: .2, headX: .2 } }); cara(c, L.T, { expr: 'relief', eyes: 'closed', mouth: 'smile' });
  plaza(L, { n: 24, r0: 6, r1: 30, seed: 89, mode: i => i % 2 ? 'idle' : 'ouch', expr: 'relief' });
  cm([HP.x + 8, 14, HP.z + 24], [HP.x + 6, 12, HP.z + 20], L.k); camera.lookAt(HP.x, 3, HP.z - 2); camera.fov = 50; sh(V(HP.x, 0, HP.z - 4), 34); }, [[0, 'sigh', .5], [.3, 'birds', .4]]);
// 80 «Seitdem sitze ich auch auf einer Flasche.»: yo en mi botella; la silla gamer, vacía, a mi lado
shot(88.89, 'F', null, L => { town(L); show(CHAIR, CP.x - 1, 0, CP.z + .4, .3); const c = seat(ich, HP.x, HP.z, -.15, L, { col: 0, wob: .05, pose: { aLx: .5, aRx: .5, aLz: .4, aRz: .4, aLe: .6, aRe: .6, lean: .15, headX: .1 } }); cara(c, L.T, { expr: 'sad', mouth: 'flat' });
  plaza(L, { n: 14, r0: 8, r1: 26, seed: 91, mode: i => ['talk', 'read', 'idle'][i % 3] });
  orb(L.k, V(HP.x - 1.6, 4, HP.z), null, [17, .35, .12, 44], [15, .2, .1, 44]); sh(HP, 18); }, [[0, 'sigh', .45]]);
// 81 «Jeden einzelnen Tag.»: la plaza de día, al atardecer y de noche: yo siempre en mi botella; «JEDEN TAG»
shot(90.74, 'C', null, L => { const ph = Math.floor(clamp((L.T - 90.74) / 1.3) * 3); town(L, { dusk: ph === 1, night: ph === 2 }); const c = seat(ich, HP.x, HP.z, 0, L, { col: 0, pose: { aLx: .5, aRx: .5, aLz: .4, aRz: .4, aLe: .6, aRe: .6, lean: .15 } }); cara(c, L.T, { expr: 'sad', eyes: 'half', mouth: 'flat' });
  plaza(L, { n: 14, r0: 7, r1: 26, seed: 93 + ph });
  orbit(V(HP.x, 5, HP.z), 19 - L.k * 2, .1 - L.k * .2, .14, 44); badge('gold', 'JEDEN TAG', W / 2, H * .11, clamp((L.T - 90.74) / .15), 1, 1); sh(HP, 18); }, [[0, 'clock_tick', .5]]);
// 82 «Mein Stuhl steht jetzt im Keller.»: el sótano: la silla gamer bajo la bombilla, cubierta de polvo
shot(92.04, 'I', null, L => { sotanoS(L); show(CHAIR, SX, 0, -3, .35); DOF = 1.4;
  cm([SX + 5, 6.4, 10], [SX + 3.4, 5.8, 7.6], L.k); camera.lookAt(SX, 3.4, -3); camera.fov = 46; badge('tag', 'IM KELLER', W / 2, H * .15, clamp((L.T - 93.04) / .12), 1, .9); }, [[0, 'door_creak', .45], [.4, 'cave_drip', .35]]);
// 83 «Aber letzte Nacht»: la plaza de noche, vacía; solo yo, en mi botella, bajo una farola
shot(93.58, 'R', null, L => { town(L, { night: 1 }); const c = seat(ich, HP.x, HP.z, 0, L, { col: 0, wob: .02, pose: { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.2, aRe: 1.2, lean: .15, headX: .25 } }); cara(c, L.T, { expr: 'sad', eyes: 'half', mouth: 'flat' });
  cm([HP.x + 9, 12, HP.z + 22], [HP.x + 6, 9, HP.z + 17], L.k); camera.lookAt(HP.x, 3.4, HP.z); camera.fov = 48; sh(HP, 20); }, [[0, 'cricket', .5], [.2, 'wind', .4]]);
// 84 «hat jemand von unten»: plano bajo: un brillo lila por debajo de mi botella
shot(94.41, 'F', null, L => { town(L, { night: 1 }); const c = seat(ich, HP.x, HP.z, 0, L, { col: 0, wob: .02, pose: { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.2, aRe: 1.2, lean: .15, headX: .25 } }); cara(c, L.T, { eyes: 'closed', mouth: 'flat' });
  const h = show(HOLES[0], HP.x, 0, HP.z); h.userData.set(.35 + Math.sin(L.T * 4) * .1, 0, L.T); h.scale.set(1.4, .2, 1.4);
  cm([HP.x + 2.4, .9, HP.z + 6.5], [HP.x + 2, 1.1, HP.z + 5.8], L.k); camera.lookAt(HP.x, 2.2, HP.z); camera.fov = 46; sh(HP, 12); }, [[0, 'hum_low', .5]]);
// 85 «an meine Flasche geklopft.»: ¡TOC, TOC! la botella da dos saltos; abro los ojos de golpe
shot(95.36, 'C', 'punch', L => { town(L, { night: 1 }); const kn = t => Math.max(0, 1 - Math.abs(L.T - t) / .08); const j = kn(95.75) + kn(96.05); const c = seat(ich, HP.x, HP.z, 0, L, { col: 0, wob: 0, pose: { ...GEST.shock } }); c.root.position.y += j * .5; BOTS.forEach(b => { if (b.visible) b.position.y = j * .35; });
  cara(c, L.T, { expr: 'shock', eyes: L.T > 95.7 ? 'wide' : 'half', mouth: L.T > 95.7 ? 'o' : 'flat' }); const h = show(HOLES[0], HP.x, 0, HP.z); h.userData.set(.6 + j * .4, 0, L.T); h.scale.set(1.4, .2, 1.4);
  onFace(c, 8, .4, .4, 42, L.k, 6.8); if (L.T > 95.72) badge('red', 'KLOPF! KLOPF!', W / 2, H * .12, clamp((L.T - 95.72) / .1), 1, 1); sh(HP, 12); }, [[.38, 'knock', .9], [.68, 'knock', .9], [.9, 'braam', .6]]);


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const CUES = [];
// cada transición con su propio efecto (rotan para que dos seguidas nunca suenen igual)
const TRS = { W: ['whoosh_soft', 'swipe', 'whoosh_down'], Z: ['swoosh_up', 'zoom_in', 'whoosh_up'], F: ['flash', 'click_set', 'sparkle'], S: ['swipe', 'tape', 'whoosh_soft'], R: ['whirl', 'clock_spin', 'whoosh'], I: ['iris_pop', 'pop', 'pling'], C: ['thump', 'impact_soft', 'fist'] };
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
  hideAll(); BAD_.length = 0; s.fn(L); while (POST.length) POST.shift()();
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud', 'cash'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
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
  { const fd = camera.position.distanceTo(CAMT); bokeh.uniforms.focus.value = fd; bokeh.uniforms.aperture.value = DOF * .0022 * clamp((26 - fd) / 14); bokeh.enabled = bokeh.uniforms.aperture.value > .00005 && QS.get('dof') !== '0'; }
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
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { applyPose, hp, ich, renderer, composer, bloom, sun, grade, scene, camera, HO, TR };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@


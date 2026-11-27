// EBBE — «In dieser Stadt zieht sich alle hundert Jahre das Meer zurück. Einen ganzen Tag lang.»
// Jonte (12) colecciona conchas; las conchas cantan cuando el mar va a volver; sopla el Muschelhorn de Opa desde el mástil del barco pirata y salva al pueblo.
// Ciudad propia: Möwensand (Mar del Norte, sobre un acantilado). Look realista: cielo con nubes, reflejos del cielo, arena con ondas, AgX, DOF.
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { rimLight } from './roblox.js';
import { FONT } from './props.js';
import { CH, skyDome, SKIES, applySky, skyEnvs, moewensand, jonteZimmer, opaStube, rathausSaal, welle, spritzer, regen, regenbogen, moewen, muschelhorn, muschel, truhe, leiter, laterne, schild, rock } from './ebwelt.js';
import { makeJonte, makeOpa, makeMama, makePapa, makeBroesel, makeNachbar } from './ebvolk.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = window.__TESTDUR ?? 144.1, U = W / 720, PI = Math.PI;
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
// Möwensand (x = 0): acantilado en z ≈ 0 (cara a +z), paseo y barandilla en y = CH (48), z ∈ [-26, -4]; casas frente al mar en z = -34 (fachada z = -26); calle en z = -53;
//   cartel de la regla en (0, CH, -12); faro en (150, CH, -16); escaleras de mano MW.LEIT (base z ≈ 10, arriba z ≈ 0).
// Fondo marino (y = 0, z > 6): pecios MW.WRACKS (-60,170) (90,420) (-260,640); arrecifes (-90,230) (120,300) (-200,420) (220,520); huesos (40,560); barco pirata (30,1050); mar lejano desde z = 1800.
// Interiores: Jonte (JZX), Opa (OPX), Rathaus (RHX).
const JZX = 6000, OPX = 6700, RHX = 7400;
const MW = moewensand(scene), JZ = jonteZimmer(scene, JZX), OPS = opaStube(scene, OPX), HORN2 = muschelhorn(null, 1.1), RH = rathausSaal(scene, RHX, HORN2);
console.log('sets', performance.now()|0); const WELLE = welle(scene, 2400); WELLE.visible = false;
const SPRITZ = spritzer(scene, 1600); SPRITZ.visible = false; const REGEN = regen(scene, 1800); REGEN.visible = false; const BOGEN = regenbogen(scene);
const MOEW = moewen(scene, 44);
const SETS = { MW: MW.g, JZ: JZ.g, OP: OPS, RH: RH.g };
for (const k in SETS) outline(SETS[k], OS);
// ---------- reparto ----------
const jonte = makeJonte(scene), opa = makeOpa(scene), mama = makeMama(scene), papa = makePapa(scene), broesel = makeBroesel(scene);
kitFace(jonte, 'kid'); kitFace(opa, 'mustache'); kitFace(mama, 'girl'); kitFace(papa, 'hero'); kitFace(broesel, 'mustache');
const NB = Array.from({ length: 40 }, (_, i) => { const c = makeNachbar(scene, i); kitFace(c, ['girl', 'plain', 'kid', 'hero', 'girl', 'mustache', 'kid', 'plain'][i % 8]); return c; });
console.log('cast', performance.now()|0); const MAIN = [jonte, opa, mama, papa, broesel];
const POOL = [...MAIN, ...NB];
POOL.forEach(c => outline(c.root, OC));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(.5, 'rgba(0,0,0,.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const PROPS = [];
const P_ = o => { if (!o.parent) scene.add(o); PROPS.push(o); return o; };
const HORN = P_(muschelhorn(null, .55));
const SHELLS = Array.from({ length: 6 }, (_, i) => P_(muschel([0xf4dcc4, 0xff9aa8, 0xe8d8c8, 0xfff0e0, 0xe8b8a8, 0xf0c8d0][i], 1.1)));
const TRUHE = P_(truhe(null)); const PLAQ = P_(schild(null, ['EBBE', '1926 · 2026'], 0, 0, 0, 0, 14, 6, { bg: '#c8c0b0', ink: '#3a3028', frame: 0x8a8070, posts: false }));
const LADS = Array.from({ length: 5 }, (_, i) => P_(leiter(null, 0, 0, 22, 0, { col: [0xc89060, 0xb07848, 0xd8a070][i % 3], w: 2.2 })));
const LANTS = Array.from({ length: 6 }, () => { const g = new THREE.Group(); cyl(.5, .5, .2, mat(0x1a1a1a, { metalness: .6 }), 8, g, 0, 0, 0); box(.9, 1.2, .9, new THREE.MeshStandardMaterial({ color: 0xfff0c0, emissive: 0xffb050, emissiveIntensity: 3 }), .05, g, 0, .75, 0); cyl(.55, .3, .3, mat(0x1a1a1a, { metalness: .6 }), 8, g, 0, 1.5, 0); const h = new THREE.Mesh(new THREE.TorusGeometry(.35, .05, 4, 12, PI), mat(0x1a1a1a)); h.position.y = 1.7; g.add(h); return P_(g); });
const BUCKET = jonte.props.eimer;
const DUST = Array.from({ length: 24 }, () => P_(sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 8, 6)));
const SWEAT = Array.from({ length: 3 }, () => P_(sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const TEAR = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8)));
const NOTES = Array.from({ length: 14 }, (_, i) => { const p = textPlane(1.6, 1.6, 64, 64, (c, w, h) => { c.fillStyle = '#fff'; c.strokeStyle = '#1a2a4a'; c.lineWidth = 6; c.font = `700 54px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.strokeText(i % 2 ? '♪' : '♫', w / 2, h / 2); c.fillText(i % 2 ? '♪' : '♫', w / 2, h / 2); }); p.material.transparent = true; p.material.depthWrite = false; p.userData.noOutline = true; return P_(p); });
const RING = P_(new THREE.Mesh(new THREE.TorusGeometry(1, .06, 6, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .7, depthWrite: false }))); RING.userData.noOutline = true;
const RINGS = Array.from({ length: 4 }, () => P_(new THREE.Mesh(new THREE.TorusGeometry(1, .5, 6, 64), new THREE.MeshBasicMaterial({ color: 0xe8f4ff, transparent: true, opacity: .4, depthWrite: false }))));
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
  for (const p of PROPS) { p.visible = false; p.rotation.order = 'XYZ'; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  BUCKET.visible = false; HORN.scale.setScalar(.55); TRUHE.userData.lid.rotation.x = 0;
  WELLE.visible = false; SPRITZ.visible = false; REGEN.visible = false; BOGEN.visible = false; MOEW.hide(); MW.MEERF.visible = true; MW.MEERF.position.z = 2600 + 6000; MW.MEERF.position.y = 0; MW.REGEL.visible = true; MW.LEIT.forEach(l => { l.visible = true; l.rotation.x = 0; });
  for (const l of MW.LAMPS) l.userData.lamp.material.emissiveIntensity = .15;
  for (const k in SETS) SETS[k].visible = false; FX2D.length = 0; for (const l of LP) l.intensity = 0;
  FILL.color.setRGB(1, .96, .91); grade.uniforms.vig.value = .35; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = +(QS.get('sat') ?? 1.12); grade.uniforms.con.value = +(QS.get('con') ?? .22); grade.uniforms.warm.value = +(QS.get('warm') ?? .8); grade.uniforms.sharp.value = .5; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; SHAKE = 0; DOF = 1; BW = 0; BLOOMMAX = .24; day(); }
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
function notes(c, T, n = 6, sc = 1, slot = 0) { for (let i = 0; i < n; i++) { const p = NOTES[slot + i]; if (!p) return; const k = (T * .55 + i / n) % 1; p.visible = true; p.position.set(c.x + Math.sin(i * 2.3 + T) * 1.6 * sc + (i - n / 2) * .3 * sc, c.y + k * 5 * sc, c.z + Math.cos(i * 1.7) * .6 * sc); p.scale.setScalar(sc * (.5 + Math.sin(k * PI) * .7)); p.material.opacity = Math.sin(k * PI); p.lookAt(camera.position); } }
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));
const walkP = (T, i) => { const p = Math.sin(T * 9 + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
const runP = (T, i) => { const p = Math.sin(T * 13 + i); return { aLx: p * 1.1, aRx: -p * 1.1, aLe: 1.3, aRe: 1.3, lLx: -p * .9, lRx: p * .9, lLk: .3 + Math.max(0, p) * 1.1, lRk: .3 + Math.max(0, -p) * 1.1, lean: .25, headX: -.15 }; };
const climbP = (T, i) => { const p = Math.sin(T * 8 + i); return { aLx: 2.6 + p * .4, aRx: 2.6 - p * .4, aLe: .6 + Math.max(0, p) * .8, aRe: .6 + Math.max(0, -p) * .8, lLx: .9 + p * .5, lRx: .9 - p * .5, lLk: 1 + p * .5, lRk: 1 - p * .5, lean: .05 }; };
const sitPose = (extra = {}) => ({ lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, ...extra });
const sitY = (c, seat) => seat + .1 - 2.05 * (c.spec.scale || 1);
function sit(c, x, seat, z, ry, L, pose = {}) { put(c, x, sitY(c, seat), z, ry); actuar(c, 0, [[0, sitPose(pose)]], { T: L.T, weight: false }); c.blob.visible = false; return c; }
// ---------- gente ----------
const CR = NB;
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
// la costa: o.t = 'day' | 'noon' | 'dawn' | 'dusk' | 'night' | 'storm'; o.sea = nivel del mar (0 = seco; 1 = marea alta hasta el pie del acantilado)
function kueste(L, o = {}) { use('MW'); const t = o.t ?? 'day'; if (t === 'night') { night(o.fill ?? 26); MW.LAMPS.forEach(l => l.userData.lamp.material.emissiveIntensity = 2.6); } else if (t === 'dawn') dawn(); else if (t === 'dusk') dusk(); else if (t === 'storm') storm(); else day(t);
  if (o.sea != null) { MW.MEERF.position.z = lerp(2600, -6, o.sea) + 6000; MW.MEERF.position.y = o.seaY ?? lerp(0, 3.5, o.sea); } }
function zimmer(L) { use('JZ'); inside(.95, 40); lp(0, JZX + 12, 16, -14, 90, 0xcfe4ff, 60); }
function stube(L) { use('OP'); inside(.75, 26); lp(0, OPX - 12, 4, -18, 90, 0xff9a40, 50); OPS.userData.flame.scale.set(1.6 + Math.sin(L.T * 13) * .15, 1 + Math.sin(L.T * 17) * .2, .6); }
function saal(L) { use('RH'); inside(.9, 34); }
// la ola en z con altura Hh y curvatura
function wave(T, z, Hh, curl = .5, o = {}) { WELLE.visible = true; WELLE.position.set(o.x ?? 0, o.y ?? 0, z); WELLE.userData.set(T, Hh, curl, o); }
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
const KEY = /^(Stadt|hundert|100|Jahre|Meer|Tag|Meeresboden|Nacht|Leitern|Klippen|Sonnenaufgang|weg|Kilometer|Schiffswracks|Kinder|Riffe|Häuser|Brösel|Schatztruhe|Algen|strahlt|Regel|Sonnenuntergang|Land|Hause|Seltsame|Möwen|Landesinnere|Keine|Jonte|Muscheln|Dreihundertzwölf|312|Ohr|Lied|alle|Sammler|ich|langweiligste|Hobby|Opa|Muschelhorn|Ebbe|singen|Korallen|Walknochen|Piratenschiff|Seite|sechs|6|weiter|Mittag|Muschel|sang|gleichzeitig|Stunden|früh|Horizont|stieg|Luft|größte|Welle|kilometerweit|schrie|Niemand|Opas|Mast|tief|blies|Donner|um|rannten|Familien|Wracks|Papas|Schultern|Omas|schneller|Wand|Klippen|Dunkelgrün|Sonne|hindurch|zurück|Leiter|Brüllen|Hand|Handgelenk|Mama|BUMM|vierzig|40|Meter|Regen|Familie|Kind|Oma|geschafft|Rathaus|blasen|Fall)$/i;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
let DARK = 0, TINT = null, SHAKE = 0, BW = 0, BLOOMMAX = .24; const FX2D = [];
// ---------- a: gancho, la noche de las escaleras, el amanecer, el fondo marino, Herr Brösel, la regla, las gaviotas (0 – 34,1 s) ----------
// helpers de esta pieza
function walk(ch, L, x, z, ry, sp = 2.4, i = 0, o = {}) { const d = sp * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, (o.y ?? 0) + Math.abs(Math.sin(L.T * 9 + i)) * .1, z + Math.cos(ry) * d, ry); actuar(ch, 0, [[0, { ...walkP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); if (o.expr !== false) cara(ch, L.T + i, { expr: o.expr || 'neutral', mouth: o.mouth }); return ch; }
function run(ch, L, x, z, ry, sp = 9, i = 0, o = {}) { const d = sp * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, (o.y ?? 0) + Math.abs(Math.sin(L.T * 13 + i)) * .35, z + Math.cos(ry) * d, ry); actuar(ch, 0, [[0, { ...runP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); cara(ch, L.T + i, { expr: o.expr || 'shock', mouth: o.mouth || 'o' }); return ch; }
function pose(ch, x, y, z, ry, L, p = {}, expr = 'neutral', ex = {}) { put(ch, x, y, z, ry); actuar(ch, 0, [[0, typeof p === 'string' ? p : { headY: Math.sin(L.T * .9 + ch.seed) * .12, ...p }]], { T: L.T }); cara(ch, L.T, { expr, ...ex }); return ch; }
// subir por una escalera de MW.LEIT[i] (k = 0 abajo … 1 arriba), mirando al acantilado
function onLadder(ch, i, k, L, j = 0, o = {}) { const l = MW.LEIT[i], p = l.userData.at(clamp(k)); put(ch, p.x, p.y - 1.2 * (ch.spec.scale || 1), p.z + 1.6, PI); actuar(ch, 0, [[0, climbP(L.T * (o.sp ?? 1), j)]], { T: L.T, weight: false }); ch.blob.visible = false; cara(ch, L.T + j, { expr: o.expr || 'determined', mouth: o.mouth || 'o' }); return ch; }
const LX = i => MW.LEIT[i].position.x;
// el mar bajando por el acantilado (k 0 = lleno … 1 = seco)
function seaDrop(L, k, t = 'dawn') { kueste(L, { t, sea: 1, seaY: lerp(26, 0, easeInOut(k)) }); }
const SHIP = () => MW.SCHIFF.userData.ship;
const mastP = (i, k) => SHIP().userData.mast(i, k);
function rings(c, k, n = 4, R = 120, y = 1) { RINGS.forEach((r, i) => { if (i >= n) return; const q = (k * 1.2 - i * .18); if (q <= 0 || q > 1) return; r.visible = true; r.position.set(c.x, c.y + y, c.z); r.rotation.x = PI / 2; r.scale.setScalar(4 + q * R); r.material.opacity = .45 * (1 - q); }); }

// 1 «In dieser Stadt zieht sich»: GANCHO. Amanecer dorado; el pueblo entero en el paseo, apoyado en la barandilla; bajo ellos el mar se vacía de golpe por el acantilado
// (se ven aparecer las escaleras y las rocas). Golpe de zoom + zoom lento hacia la gente que señala y celebra.
shot(0, 'C', 'hook', L => { kueste(L, { t: 'dawn', sea: 1, seaY: lerp(40, 6, easeInOut(L.k)) }); crowdBox(L, -20, 18, -6.2, -8.8, 16, 3, { y: CH, mode: i => ['point', 'cheer', 'shock', 'point', 'cheer', 'look'][i % 6], face: V(20, CH, 40), jit: .3 });
  pose(jonte, 4, CH, -5.9, .5, L, { aRx: 1.5, aRz: .1, aRe: .1, headX: .25 }, 'shock', { mouth: 'o' }); MOEW.fly(L.T, V(-10, CH - 6, 30), V(1, .1, .2), { lt: L.lt, n: 8, speed: 12, sx: 40, sy: 10, sz: 20 });
  cm([24, CH + 15, 10, -2, CH + 2, -8, 48], [19, CH + 13, 6, -2, CH + 3, -8, 44], L.k); SHC = V(2, CH, -4); }, [[0, 'water_drain', .9], [.3, 'crowd_gasp', .6]]);
// 2 «alle hundert Jahre»: Opa junto a la placa de piedra de la última Ebbe («1926 · 2026»): 100 Jahre
shot(1.62, 'Z', 'punch', L => { kueste(L, { t: 'dawn', sea: 1, seaY: 8 }); show(PLAQ, -34, CH + 5, -9, .25, .55);
  pose(opa, -29, CH, -8, -.35, L, { aRx: 1.3, aRz: -.3, aRe: .2, headY: -.3 }, 'warm', { mouth: 'smile' }); pose(jonte, -24.5, CH, -7.4, -.5, L, { headY: .3 }, 'happy', { mouth: 'open_smile' });
  orb(L.k, V(-28, CH + 4.4, -8), null, [11, .15, .04, 46], [9, -.05, .03, 46]); badge('gold', '100 JAHRE', W / 2, H * .22, (L.lt - .1) * 3); }, [[.1, 'ding_reveal', .7]]);
// 3 «das Meer zurück»: plano aéreo de la costa: el agua se retira hacia el horizonte dejando la arena al descubierto
shot(2.46, 'W', null, L => { kueste(L, { t: 'dawn', sea: lerp(.85, .4, L.k), seaY: 0 }); cm([-160, 170, 160, 0, 0, 420, 52], [-120, 160, 200, 0, 0, 520, 52], L.k); MOEW.fly(L.T, V(-40, 70, 220), V(.3, 0, 1), { lt: L.lt, n: 10, speed: 6, s: 1.6 }); }, [[0, 'wave_retreat', .8]]);
// 4 «Einen ganzen Tag lang»: el sol sube sobre el fondo marino brillante; la gente baja ya por las escaleras
shot(3.28, 'F', null, L => { kueste(L, { t: 'dawn', sea: .2 }); for (let i = 3; i < 8; i++) onLadder(NB[i], i, .35 + (i % 3) * .2 + L.k * .1, L, i, { expr: 'happy', mouth: 'open_smile' });
  cm([-20, 8, 90, 10, 30, 0, 50], [-10, 14, 80, 10, 34, 0, 50], L.k); badge('tag', '1 TAG', W / 2, H * .2, (L.lt - .15) * 3); }, [[.1, 'clock_tick', .6]]);
// 5 «Und du kannst über den Meeresboden laufen»: Jonte salta del último peldaño a la arena mojada y corre mar adentro; sus botas dejan huellas
shot(4.6, 'S', null, L => { kueste(L, { t: 'dawn', sea: .1 }); const x = LX(6); const jk = clamp(L.lt / .5);
  if (jk < 1) { put(jonte, x, arc([0, 6, 15], [0, 0, 19], 3, jk).y, lerp(15, 19, jk), 0); actuar(jonte, 0, [[0, { aLx: 2.4, aRx: 2.4, aLz: .5, aRz: .5, lLx: .6, lRx: .2, lLk: 1, lRk: .6 }]], { T: L.T }); cara(jonte, L.T, { expr: 'happy', mouth: 'open_smile' }); jonte.root.position.x = x; }
  else { run(jonte, { ...L, lt: L.lt - .5 }, x, 19, 0, 7, 0, { expr: 'happy', mouth: 'open_smile' }); dust(V(x, 0, 19), L.T0 ?? L.t0 + .5, L.T, 8, .6); }
  crowdBox(L, x - 34, x - 18, 24, 40, 5, 9, { mode: 'walk', expr: 'happy' }); cm([x + 8, 3, 46, x, 3, 22, 44], [x + 5, 4, 40, x, 2, 26, 44], L.k); }, [[.45, 'splash_step', .7], [.8, 'footsteps_sand', .5]]);

// 6 «In der Nacht davor»: noche en el paseo, farolas encendidas; vecinos cargan escaleras de madera entre faroles
shot(6.53, 'I', null, L => { kueste(L, { t: 'night', sea: 1, seaY: 12 }); lp(0, -6, CH + 10, -12, 70, 0xffb060, 50); lp(1, 10, CH + 10, -16, 60, 0xffb060, 50);
  for (let i = 0; i < 3; i++) { const c = walk(NB[i], L, -14 + i * 9, -18 + i * 3, PI / 2, 2.2, i, { y: CH, expr: 'happy' }); const l = LADS[i]; attach(l, c.aR.hand, [0, -.4, 0], [0, 0, PI / 2 - .2], .6); }
  pose(papa, 6, CH, -14, -PI / 2 + .4, L, { aLx: 1.6, aLe: .4 }, 'happy', { mouth: 'open_smile' }); attach(LANTS[0], papa.aL.hand, [0, -.8, 0]);
  cm([-24, CH + 8, 6, 0, CH + 3, -16, 48], [-18, CH + 7, 2, 2, CH + 3, -16, 48], L.k); }, [[0, 'night_crickets', .6], [.3, 'wood_creak', .6]]);
// 7 «die ganze Stadt»: plano general nocturno: decenas de faroles en la barandilla, cuerdas y escaleras bajando por todo el acantilado
shot(7.53, 'Z', null, L => { kueste(L, { t: 'night', sea: 1, seaY: 12 }); crowdBox(L, -120, 120, -6.5, -9, 30, 5, { y: CH, mode: i => i % 3 ? 'look' : 'point', face: V(0, 0, 60) });
  for (let i = 0; i < 6; i++) { show(LANTS[i], -100 + i * 40, CH + 3.6, -5, 0); lp(i % 4, -100 + i * 40, CH + 6, -2, 40, 0xffb060, 40); }
  cm([60, 70, 160, 0, 30, -10, 54], [40, 64, 140, 0, 32, -10, 52], L.k); }, [[0, 'crowd_murmur', .5]]);
// 8 «Leitern an die Klippen»: desde abajo, a la luz de los faroles, las escaleras se apoyan una tras otra en la roca
shot(8.23, 'R', null, L => { kueste(L, { t: 'night', sea: 1, seaY: 2 }); const x = LX(5); MW.LEIT.forEach((l, i) => { if (i >= 4 && i <= 8) { const k = clamp(L.k * 3 - (i - 4) * .4); l.rotation.x = (1 - easeOut(k)) * .5; } });
  crowdBox(L, x - 30, x + 30, -6.5, -8, 6, 7, { y: CH, mode: 'point', face: V(x, 0, 40) }); lp(0, x, CH + 6, 2, 80, 0xffb060, 70); lp(1, x - 26, CH + 6, 2, 60, 0xffb060, 60);
  cm([x + 4, 3, 46, x, 30, 0, 50], [x + 2, 4, 40, x, 34, 0, 50], L.k); SHC = V(x, 25, 6); }, [[.1, 'wood_clack', .7], [.5, 'wood_clack', .6]]);

// 9 «Bei Sonnenaufgang»: el sol asoma sobre el mar; el pueblo despierta en el paseo con tazas y mantas
shot(9.36, 'F', 'slow', L => { kueste(L, { t: 'dawn', sea: 1, seaY: 3 }); crowdBox(L, -14, 14, -6.4, -9, 10, 11, { y: CH, mode: i => i % 3 ? 'look' : 'wave', face: V(0, CH, 60), jit: .25 });
  cm([0, CH + 2, 16, 0, CH + 4, -8, 48], [0, CH + 2.6, 12, 0, CH + 4.4, -8, 44], L.k); }, [[0, 'birds_dawn', .4]]);
// 10 «ist das Wasser einfach weg»: a ras de arena: el agua se escurre hacia el mar a toda velocidad, peces saltando en los charcos
shot(10.47, 'P', null, L => { kueste(L, { t: 'dawn', sea: lerp(.25, .05, L.k), seaY: lerp(1.2, 0, L.k) }); cm([10, 2.2, 40, 0, 1, 140, 40], [10, 2.6, 52, 0, 1, 160, 40], L.k);
  crowdBox(L, -12, 18, 28, 34, 3, 13, { mode: 'look', face: V(0, 0, 200), expr: 'shock' }); }, [[0, 'water_drain', .9]]);
// 11 «Kilometer um Kilometer»: vuelo de dron sobre el fondo marino infinito; arena con ondas, charcos que reflejan el cielo y el barco pirata a lo lejos
shot(11.78, 'Z', null, L => { kueste(L, { t: 'dawn' }); cm([0, 90, 60, 0, 0, 600, 56], [0, 120, 160, 0, 0, 900, 56], L.k); MOEW.fly(L.T, V(0, 80, 260), V(0, 0, 1), { lt: L.lt, n: 6, speed: 8, s: 1.6 }); badge('big', 'KILOMETER', W / 2, H * .2, (L.lt - .1) * 3); }, [[0, 'wind_soft', .7]]);
// 12 «Die Leute laufen zwischen alten Schiffswracks»: familias paseando junto a la proa oxidada de un carguero hundido
shot(13.5, 'C', null, L => { kueste(L, { t: 'day' }); crowdBox(L, -76, -44, 150, 190, 9, 21, { mode: i => i % 4 === 3 ? 'point' : 'walk', ry: i => .3, speed: 2, expr: 'happy' });
  walk(papa, L, -54, 182, .4, 2.2, 1, { expr: 'happy', mouth: 'open_smile' }); cm([-30, 7, 205, -60, 12, 165, 52], [-36, 8, 210, -60, 13, 165, 52], L.k); }, [[0, 'footsteps_sand', .6], [.2, 'metal_creak', .5]]);
// 13 «Schiffswracks herum»: contrapicado bajo el casco oxidado; un niño golpea el metal y suena hueco
shot(14.83, 'W', null, L => { kueste(L, { t: 'day' }); pose(NB[3], -58, 0, 178, PI - .3, L, { aRx: 2.2 + Math.sin(L.T * 14) * .3, aRe: .4 }, 'happy', { mouth: 'open_smile' }); pose(NB[8], -54, 0, 182, PI + .5, L, { aLx: 1.5 }, 'shock', { mouth: 'o' });
  cm([-26, 2.5, 206, -58, 14, 172, 56], [-28, 2, 204, -58, 18, 170, 56], L.k); }, [[.2, 'metal_bang', .7]]);
// 14 «Die Kinder klettern auf Riffe»: niños trepando por un arrecife cubierto de corales
shot(15.92, 'S', null, L => { kueste(L, { t: 'day' }); const R = MW.RIFFE[0].position; [NB[3], NB[8], NB[13]].forEach((c, i) => { put(c, R.x - 4 + i * 4, 6 + i * 5 + L.k * 3, R.z + 9 - i, PI + (i - 1) * .2); actuar(c, 0, [[0, climbP(L.T, i)]], { T: L.T, weight: false }); c.blob.visible = false; cara(c, L.T, { expr: 'happy', mouth: 'open_smile' }); });
  cm([R.x + 6, 6, R.z + 40, R.x, 14, R.z, 50], [R.x + 8, 10, R.z + 36, R.x, 18, R.z, 50], L.k); }, [[0, 'kids_laugh', .6]]);
// 15 «höher sind als ihre Häuser»: grúa hacia arriba: los niños saludan en la cima, el arrecife más alto que el tejado de una casa (pueblo detrás, lejos)
shot(17.18, 'Z', 'punch', L => { kueste(L, { t: 'day' }); const R = MW.RIFFE[1].position; [NB[13], NB[18]].forEach((c, i) => { pose(c, R.x - 3 + i * 6, 36, R.z, PI - .2 + i * .4, L, i ? { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5 } : 'wave', 'happy', { mouth: 'open_smile' }); c.blob.visible = false; });
  cm([R.x + 10, 4, R.z - 60, R.x, 24, R.z, 54], [R.x + 6, 12, R.z - 52, R.x, 34, R.z, 50], L.k); }, [[.1, 'cheer_kids', .6]]);

// 16 «Herr Brösel hat eine Schatztruhe»: Brösel cava junto a un pecio y asoma un cofre
shot(18.46, 'I', null, L => { kueste(L, { t: 'day' }); const c = V(80, 0, 400); show(TRUHE, c.x, -1.6 + L.k * 1.4, c.z, -.3); pose(broesel, c.x - 3.6, 0, c.z + 3, .9, L, { crouch: .5, lean: .5, aLx: 1.6 + Math.sin(L.T * 9) * .5, aRx: 1.6 - Math.sin(L.T * 9) * .5, headX: .3 }, 'happy', { mouth: 'open_smile' });
  dust(V(c.x, 0, c.z + 1), L.t0, L.T, 10, .5); orb(L.k, V(c.x - 1, 2.6, c.z + 1), null, [16, .7, .2, 44], [13, .5, .16, 44]); }, [[0, 'dig_sand', .7], [.5, 'dig_sand', .6]]);
// 17 «gefunden»: levanta la tapa: un destello dorado… (expectación)
shot(19.86, 'F', 'punch', L => { kueste(L, { t: 'day' }); const c = V(80, 0, 400); show(TRUHE, c.x, -.2, c.z, -.3); TRUHE.userData.lid.rotation.x = -easeOut(clamp(L.lt / .35)) * 1.9;
  pose(broesel, c.x - 1.5, 0, c.z + 4.5, PI * .85, L, { aLx: 1.8, aRx: 1.8, aLe: .5, aRe: .5, lean: .2 }, 'shock', { mouth: 'o' }); grade.uniforms.flash.value = Math.max(0, .5 - L.lt * 1.5);
  onFace(broesel, 6, .4, -2, 42, L.k); broesel.root.rotation.y = PI * .85; }, [[0, 'chest_open', .8], [.1, 'sparkle', .6]]);
// 18 «Sie war voller Algen»: dentro del cofre: solo algas verdes chorreando
shot(20.42, 'C', null, L => { kueste(L, { t: 'day' }); const c = V(80, 0, 400); show(TRUHE, c.x, -.2, c.z, -.3); TRUHE.userData.lid.rotation.x = -1.9;
  cm([c.x + 1, 6, c.z + 4, c.x, 1.8, c.z, 40], [c.x + 1, 5, c.z + 3.2, c.x, 1.8, c.z, 38], L.k); badge('green', 'ALGEN', W / 2, H * .24, (L.lt - .15) * 3); }, [[.1, 'squish', .7]]);
// 19 «Trotzdem strahlt er»: Brösel levanta un puñado de algas como si fuera oro y ríe
shot(21.52, 'R', null, L => { kueste(L, { t: 'day' }); const c = V(80, 0, 400); show(TRUHE, c.x, -.2, c.z, -.3); TRUHE.userData.lid.rotation.x = -1.9;
  pose(broesel, c.x - 1, 0, c.z + 4, PI * .9 + PI, L, { aLx: 3, aRx: 3, aLz: .3, aRz: .3, aLe: .3, aRe: .3, lean: -.1 }, 'joy'); laughF(broesel, L.T); broesel.root.rotation.y = .3;
  onFace(broesel, 7, .6, 0, 44, L.k); }, [[0, 'laugh_old', .6], [.2, 'sparkle', .5]]);

// 20 «Und es gibt nur eine Regel»: el cartel en el paseo; zoom lento
shot(22.76, 'B', 'slow', L => { kueste(L, { t: 'day' }); crowdBox(L, -76, -44, -15, -20, 4, 17, { y: CH, mode: 'walk', ry: () => PI / 2, expr: 'neutral' });
  cm([-60, CH + 6, 16, -60, CH + 7, -12, 46], [-60, CH + 7, 8, -60, CH + 7, -12, 46], L.k); }, []);
// 21 «Vor Sonnenuntergang zurück an Land»: atardecer, Opa da golpecitos con el dedo en el cartel; reloj del cartel en rojo
shot(24.09, 'G', null, L => { kueste(L, { t: 'dusk' }); pose(opa, -67, CH, -10, .7, L, { aRx: 1.5, aRz: .2, aRe: .2 + Math.max(0, Math.sin(L.T * 10)) * .2, headY: .5 }, 'determined'); talk(opa, L.T, 24, 26, 'determined');
  cm([-70, CH + 7, 8, -62, CH + 6, -12, 50], [-71, CH + 6.5, 5, -62, CH + 6, -12, 48], L.k); badge('red', 'VOR SONNENUNTERGANG!', W / 2, H * .2, (L.lt - .2) * 3, 1, .8); }, [[.2, 'knock_wood', .7]]);
// 22 «Denn dann kommt das Meer nach Hause»: atardecer: el mar vuelve, sube suave por el pie del acantilado, las escaleras ya recogidas
shot(26.06, 'P', null, L => { kueste(L, { t: 'dusk', sea: 1, seaY: lerp(2, 9, L.k) }); MW.LEIT.forEach(l => l.visible = false); crowdBox(L, -30, 30, -7.5, -10, 8, 19, { y: CH, mode: 'look', face: V(0, 0, 400) });
  cm([30, 14, 90, 0, 24, 0, 52], [24, 16, 80, 0, 26, 0, 52], L.k); }, [[0, 'waves_shore', .8]]);
// 23 «Aber jetzt kommt das Seltsame»: tejados del pueblo por la mañana: una gaviota en una chimenea gira la cabeza… zoom lento
shot(27.53, 'Z', 'slow', L => { kueste(L, { t: 'day' }); const c = V(-60, CH + 24, -36); MOEW.fly(L.T, c, V(0, 0, 0), { n: 3, speed: 0, sx: 10, sy: 1, sz: 4, glide: true, s: 1.3 });
  cm([-46, CH + 27, -6, -60, CH + 23, -36, 46], [-50, CH + 26, -16, -60, CH + 23.5, -36, 40], L.k); }, [[0, 'gull_call', .6]]);
// 24 «Heute Morgen sind alle Möwen»: de golpe todas despegan a la vez de los tejados
shot(29.2, 'W', null, L => { kueste(L, { t: 'day' }); MOEW.fly(L.T * (.6 + L.k), V(-20, CH + 26, -40), V(0, .3, -1), { lt: L.lt, n: 44, speed: 14, sx: 120, sy: 14, sz: 30 });
  cm([20, CH + 12, 10, -20, CH + 34, -60, 56], [16, CH + 10, 14, -20, CH + 40, -70, 56], L.k); }, [[0, 'wings_flap', .8], [.1, 'gulls_flock', .7]]);
// 25 «der Stadt ins Landesinnere geflogen»: plano general: la bandada se aleja tierra adentro sobre los tejados, el mar a la espalda
shot(30.74, 'S', null, L => { kueste(L, { t: 'day' }); MOEW.fly(L.T, V(0, CH + 40, -30), V(0, .1, -1), { lt: L.lt, n: 44, speed: 20, sx: 160, sy: 26, sz: 50, s: 1.5 });
  crowdBox(L, -20, 20, -14, -20, 5, 23, { y: CH, mode: 'point', face: V(0, CH + 60, -200), expr: 'confused' });
  cm([10, CH + 8, 40, 0, CH + 36, -120, 54], [6, CH + 10, 34, 0, CH + 40, -160, 54], L.k); }, [[0, 'gulls_flock', .6]]);
// 26 «Keine einzige ist am Strand geblieben»: la playa vacía: una sola pluma blanca rueda por la arena
shot(32.33, 'I', null, L => { kueste(L, { t: 'day' }); const f = SHELLS[0]; show(f, 2 + L.k * 3, .3, 40, L.T * 2, .9); cm([6, 2, 56, 0, 1, 30, 46], [4, 2.4, 50, 0, 1, 30, 46], L.k); }, [[0, 'wind_soft', .7]]);
// ---------- b: Jonte y sus conchas, la familia, el Muschelhorn de Opa, el día de la Ebbe (34,1 – 67,5 s) ----------
const JD = (x, z) => V(JZX + x, 0, z);
// 27 «Ich heiße Jonte»: Jonte en su cuarto, delante de las estanterías de conchas, saluda a cámara
shot(34.08, 'Z', 'punch', L => { zimmer(L); pose(jonte, JZX - 4, 0, -12, .35, L, 'wave', 'happy'); talk(jonte, L.T, 34, 35, 'happy'); BUCKET.visible = false;
  onFace(jonte, 8, .2, 1.5, 42, L.k, 6.5); }, [[0, 'pop', .5]]);
// 28 «Ich sammle Muscheln»: coloca una concha rosa en la estantería llena
shot(35.08, 'W', null, L => { zimmer(L); BUCKET.visible = false; pose(jonte, JZX - 22, 0, -6, -PI / 2, L, { aRx: lerp(1.2, 1.9, easeInOut(L.k)), aRe: .5, aRz: -.1, headY: -.2 }, 'happy', { mouth: 'smile' }); attach(SHELLS[1], jonte.aR.hand, [0, -.5, .3], [0, 0, 0], 1);
  cm([JZX - 14, 9, 3, JZX - 23, 7, -6, 46], [JZX - 15, 8.6, 1, JZX - 23, 7, -6, 44], L.k); }, [[.5, 'shell_clink', .7]]);
// 29 «Dreihundertzwölf Stück»: barrido por todas las estanterías; contador 312
shot(35.84, 'S', null, L => { zimmer(L); cm([JZX - 14, 14, 6, JZX - 29, lerp(20, 8, L.k), -6 + lerp(-8, 8, L.k), 50], [JZX - 15, 12, 6, JZX - 29, lerp(20, 8, L.k), -6 + lerp(-8, 8, L.k), 50], L.k, k => k);
  badge('gold', String(Math.round(lerp(1, 312, easeOut(clamp(L.lt / .7))))), W / 2, H * .24, 1, 1, 1.4); }, [[0, 'counter_tick', .7]]);
// 30 «Halt dir eine ans Ohr»: Jonte con los ojos cerrados, una concha en la oreja
shot(37.28, 'F', null, L => { zimmer(L); BUCKET.visible = false; pose(jonte, JZX + 8, 0, -8, -.3, L, { aRx: 2.4, aRz: .5, aRe: 2.2, headZ: .15 }, 'happy', { eyes: 'closed', mouth: 'smile' }); attach(SHELLS[3], jonte.aR.hand, [0, -.4, .2], [0, 0, 1.2], 1.4);
  onFace(jonte, 6, .1, 1.6, 40, L.k, 5); }, [[.1, 'ocean_shell', .8]]);
// 31 «und sie summt ihr eigenes Lied»: notas que salen de la concha; Jonte tararea
shot(38.47, 'I', null, L => { zimmer(L); BUCKET.visible = false; pose(jonte, JZX + 8, 0, -8, -.3, L, { aRx: 2.4, aRz: .5, aRe: 2.2, headZ: .15, headY: Math.sin(L.T * 3) * .1 }, 'happy', { eyes: 'closed', mouth: Math.sin(L.T * 8) > 0 ? 'o' : 'smile' }); attach(SHELLS[3], jonte.aR.hand, [0, -.4, .2], [0, 0, 1.2], 1.4);
  notes(wpos(SHELLS[3]), L.T, 5, 1); onFace(jonte, 7, .5, -2, 42, L.k); }, [[0, 'hum_tune', .7]]);
// 32 «Ich kenne sie alle»: ante su caja de conchas, señala orgulloso cada una
shot(39.94, 'C', null, L => { zimmer(L); BUCKET.visible = false; pose(jonte, JZX + 12, 0, -13, PI, L, { aRx: 1.2, aRe: .3, aRz: .1 + Math.sin(L.T * 4) * .2 }, 'happy', { mouth: 'open_smile' });
  cm([JZX + 6, 12, -6, JZX + 12, 7, -18, 44], [JZX + 7, 11, -8, JZX + 12, 7, -18, 42], L.k); }, [[.2, 'shell_clink', .5]]);
// 33 «Jede Familie hat so einen komischen Sammler»: el salón de casa: Mama con el móvil, Papa con el periódico, Opa con su pipa… y la mesa cubierta de conchas
shot(40.78, 'W', null, L => { stube(L); sit(papa, OPX + 4, 3.6, -6, 0, L, { aLx: 1.2, aRx: 1.2, aLe: 1.2, aRe: 1.2 }); cara(papa, L.T, { expr: 'happy', mouth: 'smile' });
  pose(mama, OPX - 4, 0, -2, .4, L, { aLx: .3, aRx: 1.4, aRe: 1.6, headX: .2 }, 'happy', { mouth: 'smile' }); pose(opa, OPX + 12, 0, -4, -.5, L, { aRx: 1.6, aRe: 2, headY: -.2 }, 'warm', { mouth: 'smile' });
  pose(jonte, OPX + 2, 0, 4, PI + .2, L, { aLx: 1.2, aRx: 1.2, aLe: .5, aRe: .5, crouch: .1 }, 'happy', { mouth: 'open_smile' }); for (let i = 0; i < 6; i++) show(SHELLS[i], OPX - 2 + i * 1.4, .3, 6 + (i % 2), i, 1.2);
  cm([OPX + 2, 14, 30, OPX + 2, 5, -2, 50], [OPX + 2, 13, 26, OPX + 2, 5, -2, 48], L.k); }, [[0, 'room_tone', .5], [.3, 'clock_tick', .4]]);
// 34 «Bei uns bin das ich»: Jonte levanta el cubo lleno de conchas con una sonrisa enorme; la familia se ríe
shot(42.86, 'Z', 'punch', L => { stube(L); pose(jonte, OPX + 2, 0, 2, 0, L, { aRx: 2.6, aRz: .3, aRe: .3, aLx: .4 }, 'joy'); grin(jonte, L.T); pose(mama, OPX - 6, 0, -4, .6, L, { aLx: 1.2, aLe: 1.6 }, 'joy'); laughF(mama, L.T); pose(opa, OPX + 9, 0, -3, -.6, L, {}, 'joy'); laughF(opa, L.T);
  onFace(jonte, 9, 1, 0, 44, L.k, 7.5); }, [[0, 'laugh_family', .6]]);
// 35 «Die anderen Kinder sagen»: en el paseo, tres niños se burlan de Jonte señalándolo
shot(43.98, 'R', null, L => { kueste(L, { t: 'day', sea: 1, seaY: 4 }); pose(jonte, 3, CH, -14, PI - .6, L, { aLx: .3, aRx: .3, headX: .2 }, 'sad');
  [NB[13], NB[18], NB[23]].forEach((c, i) => { pose(c, -5 + i * 2.6, CH, -12 + i * 1.2, PI / 2 + .3 - i * .2, L, i === 1 ? { aRx: 1.6, aRe: .1 } : { aLx: 1.2, aRx: 1.2, aLe: 1.6, aRe: 1.6, lean: -.1 }, 'joy'); laughF(c, L.T + i); });
  cm([-3, CH + 5, -24, -1, CH + 3, -11, 46], [-2, CH + 5, -22, -1, CH + 3, -11, 44], L.k); }, [[0, 'kids_laugh', .7]]);
// 36 «das langweiligste Hobby der Welt»: un niño finge dormirse de aburrimiento (Zzz); Jonte abraza su cubo
shot(45.42, 'G', null, L => { kueste(L, { t: 'day', sea: 1, seaY: 4 }); pose(NB[18], -2, CH, -12, PI + .3, L, { headX: .4, headZ: .3, aLx: .2, aRx: .2, lean: .1 }, 'tired', { eyes: 'closed', mouth: 'o' }); pose(jonte, 4, CH, -13, PI - .5, L, { aLx: 1, aLe: 1.4, aRx: 1, aRe: 1.4 }, 'sad');
  onFace(NB[18], 8, .5, -2, 44, L.k); badge('big', 'LANGWEILIG!', W / 2, H * .22, (L.lt - .2) * 3, 1, .9); }, [[.2, 'snore', .7]]);
// 37 «Opa hat mir sein altes Muschelhorn geschenkt»: junto a la chimenea, Opa le entrega la caracola con las dos manos
shot(46.97, 'B', null, L => { stube(L); const k = easeInOut(clamp(L.lt / .9)); pose(opa, OPX - 15, 0, -14, 1.0, L, { aLx: 1.4, aRx: 1.4, aLe: .4, aRe: .4, lean: .15 }, 'warm', { mouth: 'smile' });
  pose(jonte, OPX - 8.6, 0, -12.6, -2.1, L, { aLx: 1.2 + k * .3, aRx: 1.2 + k * .3, aLe: .6, aRe: .6 }, 'shock', { mouth: 'o' }); show(HORN, lerp(OPX - 12.6, OPX - 11.2, k), 5.6, lerp(-13, -12.8, k), -.6, .55);
  cm([OPX - 11, 9, 4, OPX - 11.5, 5.5, -13, 46], [OPX - 11, 8.5, 1, OPX - 11.5, 5.5, -13, 44], L.k); }, [[0, 'fire_crackle', .7]]);
// 38 «Muschelhorn»: primer plano de la caracola en manos de Jonte, la luz del fuego en el nácar
shot(48.08, 'F', 'punch', L => { stube(L); pose(jonte, OPX - 9, 0, -12, .3, L, { aLx: 1.5, aRx: 1.5, aLe: .5, aRe: .5 }, 'shock', { mouth: 'o' }); attach(HORN, jonte.aR.hand, [.4, -.6, .6], [0, 0, 0], .55);
  const h = wpos(HORN); cm([h.x + 3, h.y + 1.8, h.z + 5, h.x, h.y, h.z, 38], [h.x + 2.4, h.y + 1.4, h.z + 4, h.x, h.y, h.z, 36], L.k); }, [[0, 'sparkle', .7]]);
// 39 «Es wird seit der letzten großen Ebbe weitergegeben»: zoom lento a la foto antigua «EBBE 1926»
shot(49.2, 'Z', 'slow', L => { stube(L); cm([OPX + 6, 17, -10, OPX + 6, 17, -24, 44], [OPX + 6, 17, -16, OPX + 6, 17, -24, 40], L.k); BW = .4; }, [[0, 'old_paper', .5]]);
// 40 «„Wenn das Meer zurückkommt", hat er gesagt»: Opa, serio, a la luz del fuego
shot(51.5, 'W', null, L => { stube(L); pose(opa, OPX - 15, 0, -14, .6, L, { aRx: .8, aRe: 1.2, aRz: -.1, headX: .1 }, 'determined'); talk(opa, L.T, 51.5, 53.6, 'determined');
  onFace(opa, 7, .2, 2, 42, L.k, 5.5); }, [[0, 'fire_crackle', .6]]);
// 41 «„fangen die Muscheln an zu singen"»: las conchas de la estantería brillan y salen notas
shot(53.64, 'I', null, L => { zimmer(L); notes(V(JZX - 27, 10, -6), L.T, 7, 1.4); notes(V(JZX - 27, 17, -2), L.T + .5, 6, 1.2, 7); lp(1, JZX - 24, 12, -6, 40, 0xc8e8ff, 30);
  cm([JZX - 14, 13, 4, JZX - 29, 13, -6, 48], [JZX - 17, 13, 2, JZX - 29, 13, -6, 46], L.k); }, [[0, 'shells_sing', .8]]);

// 42 «Bei Sonnenaufgang war das Meer weg»: amanecer; el fondo marino seco hasta el horizonte, el pueblo en lo alto
shot(55.07, 'P', null, L => { kueste(L, { t: 'dawn' }); cm([-40, 22, 160, 0, 30, 0, 52], [-30, 26, 150, 0, 34, 0, 50], L.k); crowdBox(L, -40, 40, -7, -10, 14, 29, { y: CH, mode: 'cheer' }); }, [[0, 'birds_dawn', .5]]);
// 43 «Die ganze Stadt ging hinunter»: decenas bajando por las escaleras a la vez, Jonte entre ellos con su cubo
shot(57.14, 'S', null, L => { kueste(L, { t: 'dawn' }); for (let i = 2; i < 10; i++) for (let j = 0; j < 2; j++) onLadder(NB[(i * 2 + j) % 40], i, .15 + j * .45 + ((L.k * .2 + i * .07) % .2), L, i * 2 + j, { expr: 'happy', mouth: 'open_smile' });
  onLadder(jonte, 6, .5 - L.k * .2, L, 3, { expr: 'happy', mouth: 'open_smile' }); crowdBox(L, -60, 60, 20, 40, 8, 31, { mode: 'walk', ry: () => 0 });
  cm([LX(6) + 30, 14, 70, LX(6), 24, 6, 54], [LX(6) + 24, 16, 64, LX(6), 26, 6, 54], L.k); }, [[0, 'ladder_steps', .7], [.3, 'crowd_happy', .5]]);
// 44 «Leuchtende Korallen»: corales que brillan en colores; una niña los mira de cerca
shot(58.74, 'F', null, L => { kueste(L, { t: 'day' }); const c = V(-150, 0, 300); pose(NB[3], c.x + 3, 0, c.z + 9, PI + .4, L, { aLx: 1.3, aLe: .2, lean: .25, crouch: .15 }, 'shock', { mouth: 'o' });
  pose(jonte, c.x + 8, 0, c.z + 10, PI - .3, L, { headX: .2 }, 'happy', { mouth: 'open_smile' }); cm([c.x + 8, 5, c.z + 26, c.x + 2, 2.6, c.z + 2, 46], [c.x + 6, 4.4, c.z + 23, c.x + 2, 2.6, c.z + 2, 44], L.k); }, [[0, 'sparkle', .6], [.3, 'water_drip', .4]]);
// 45 «riesige Walknochen»: gente pasando bajo las costillas de la ballena, cámara baja entre los huesos
shot(59.9, 'R', null, L => { kueste(L, { t: 'day' }); const K = MW.KNOCHEN.position; crowdBox(L, K.x - 6, K.x + 6, K.z - 10, K.z + 4, 5, 33, { mode: 'walk', ry: () => -.6 + PI, expr: 'happy' });
  cm([K.x - 8, 3, K.z + 24, K.x + 2, 6, K.z - 10, 56], [K.x - 4, 3, K.z + 20, K.x + 2, 7, K.z - 10, 56], L.k); }, [[0, 'wind_soft', .6], [.2, 'bone_knock', .5]]);
// 46 «ein versunkenes Piratenschiff»: revelación del barco pirata con la bandera negra; la gente se acerca
shot(61.13, 'Z', 'punch', L => { kueste(L, { t: 'day' }); const S_ = MW.SCHIFF.position; crowdBox(L, S_.x - 30, S_.x + 30, S_.z + 50, S_.z + 70, 9, 35, { mode: i => i % 3 ? 'point' : 'shock', face: S_ });
  cm([S_.x + 10, 6, S_.z + 100, S_.x, 26, S_.z, 54], [S_.x + 6, 8, S_.z + 88, S_.x, 28, S_.z, 54], L.k); }, [[0, 'pirate_flag', .6], [.1, 'crowd_gasp', .6]]);
// 47 «auf der Seite liegend»: contrapicado a lo largo del casco inclinado, mástiles cruzando el cielo
shot(62.53, 'W', null, L => { kueste(L, { t: 'day' }); const S_ = MW.SCHIFF.position; cm([S_.x - 30, 3, S_.z + 30, S_.x, 34, S_.z - 6, 58], [S_.x - 26, 3, S_.z + 26, S_.x, 38, S_.z - 6, 58], L.k); }, [[0, 'wood_creak', .7]]);
// 48 «Ich bin fast sechs Kilometer hinausgelaufen»: Jonte camina solo mar adentro con su cubo; 6 KM
shot(63.73, 'S', null, L => { kueste(L, { t: 'day' }); walk(jonte, L, 10, 700, 0, 2.6, 0, { expr: 'happy', mouth: 'smile' }); cm([4, 4, 740, 10, 4, 700, 44], [2, 5, 742, 10, 4, 704, 44], L.k); badge('gold', '6 KM', W / 2, H * .22, (L.lt - .3) * 3); }, [[0, 'footsteps_sand', .7]]);
// 49 «hinausgelaufen»: cenital: sus huellas en línea recta sobre la arena ondulada
shot(65.0, 'I', null, L => { kueste(L, { t: 'day' }); walk(jonte, L, 10, 720, 0, 2.6, 0, { expr: 'happy' }); const jp = jonte.root.position; cm([jp.x + 2, 26, jp.z - 8, jp.x, 0, jp.z + 2, 50], [jp.x + 2, 28, jp.z - 8, jp.x, 0, jp.z + 2, 50], L.k); }, [[0, 'wind_soft', .5]]);
// 50 «Weiter als alle anderen»: plano enorme: Jonte diminuto lejos, el pueblo y la gente muy atrás, junto al acantilado
shot(66.09, 'Z', null, L => { kueste(L, { t: 'day' }); walk(jonte, L, 10, 760, PI, 2.4, 0, { expr: 'happy' }); crowdBox(L, -60, 60, 120, 260, 12, 37, { mode: 'walk' });
  cm([30, 10, 820, 0, 10, 300, 50], [28, 14, 840, 0, 14, 300, 50], L.k); }, [[0, 'wind_soft', .5]]);
// ---------- c: las conchas cantan, la ola se forma, el Muschelhorn, la huida (67,5 – 110 s) ----------
const SC = V(-50, 0, 880);   // donde Jonte recoge las conchas, junto al barco pirata
// 51 «Am Mittag hob ich eine Muschel auf»: mediodía; Jonte se agacha y recoge una concha
shot(67.53, 'C', null, L => { kueste(L, { t: 'noon' }); const k = easeInOut(clamp(L.lt / .8)); pose(jonte, SC.x, 0, SC.z, .4, L, { crouch: .5 - k * .3, lean: .5 - k * .3, aRx: 1.4 + k * .6, aRe: .3 + k * .6, headX: .4 - k * .2 }, 'happy', { mouth: 'smile' });
  attach(SHELLS[2], jonte.aR.hand, [0, -.5, .3], [0, 0, 0], 1.1); onBody(jonte, 12, .3, .25, 44, L.k, 10); }, [[.2, 'shell_clink', .6]]);
// 52 «Sie sang»: la concha suelta notas; Jonte abre mucho los ojos
shot(69.31, 'F', 'punch', L => { kueste(L, { t: 'noon' }); pose(jonte, SC.x, 0, SC.z, .4, L, { aRx: 2.2, aRz: .3, aRe: 1.8 }, 'shock', { mouth: 'o' }); attach(SHELLS[2], jonte.aR.hand, [0, -.5, .3], [0, 0, 0], 1.1);
  notes(wpos(SHELLS[2]), L.T, 5, .9); onFace(jonte, 6, .3, 1.2, 40, L.k, 5); }, [[0, 'shell_sing1', .8]]);
// 53 «Dann noch eine»: otra concha en la arena empieza a cantar a su lado
shot(69.88, 'S', null, L => { kueste(L, { t: 'noon' }); show(SHELLS[4], SC.x + 3, .25, SC.z + 4, 1, 1.4); notes(V(SC.x + 3, .5, SC.z + 4), L.T, 4, .8); pose(jonte, SC.x, 0, SC.z, 1.2, L, { headX: .3 }, 'shock', { mouth: 'o' });
  cm([SC.x + 8, 4, SC.z + 14, SC.x + 1.5, 2, SC.z + 2, 44], [SC.x + 7, 3.6, SC.z + 12, SC.x + 1.5, 2, SC.z + 2, 42], L.k); }, [[0, 'shell_sing2', .8]]);
// 54 «Und noch eine»: y otra, más allá
shot(70.52, 'R', null, L => { kueste(L, { t: 'noon' }); show(SHELLS[5], SC.x - 4, .25, SC.z + 6, 2, 1.4); notes(V(SC.x - 4, .5, SC.z + 6), L.T, 4, .8); show(SHELLS[4], SC.x + 3, .25, SC.z + 4, 1, 1.4); notes(V(SC.x + 3, .5, SC.z + 4), L.T + .3, 4, .8, 4);
  cm([SC.x - 8, 2.4, SC.z + 12, SC.x - 3, .8, SC.z + 5, 40], [SC.x - 7, 2.2, SC.z + 11, SC.x - 3, .8, SC.z + 5, 38], L.k); }, [[0, 'shell_sing3', .8]]);
// 55 «Alle Muscheln auf dem Meeresboden sangen gleichzeitig»: plano general: notas brotando de toda la arena hasta el horizonte; Jonte en medio
shot(71.57, 'Z', 'punch', L => { kueste(L, { t: 'noon' }); pose(jonte, SC.x, 0, SC.z, PI, L, { aLx: .4, aRx: .4, aLz: .4, aRz: .4 }, 'shock', { mouth: 'o' });
  for (let i = 0; i < 14; i++) { const r = RNG(i * 3 + 1); NOTES[i].visible = true; const k = (L.T * .6 + r()) % 1; NOTES[i].position.set(SC.x + (r() - .5) * 60, k * 9 + 1, SC.z - 6 - r() * 50); NOTES[i].scale.setScalar(2.2 * Math.sin(k * PI) + .2); NOTES[i].material.opacity = Math.sin(k * PI); NOTES[i].lookAt(camera.position); }
  cm([SC.x, 5, SC.z + 22, SC.x, 4, SC.z - 30, 54], [SC.x, 8, SC.z + 26, SC.x, 4, SC.z - 30, 54], L.k); }, [[0, 'shells_choir', .9]]);
// 56 «Stunden zu früh»: Jonte mira el reloj de la torre a lo lejos… y al cartel en su cabeza: 12:00 (debía ser al atardecer)
shot(74.28, 'G', null, L => { kueste(L, { t: 'noon' }); pose(jonte, SC.x, 0, SC.z, PI + .3, L, { aLx: 1.2, aLe: 1.6, headX: -.1 }, 'worried'); sweat(jonte, L.T);
  onFace(jonte, 7, .4, -1.5, 42, L.k); jonte.root.rotation.y = .3; badge('red', '12:00 — ZU FRÜH!', W / 2, H * .22, (L.lt - .15) * 3, 1, .8); }, [[0, 'clock_tick', .7]]);
// 57 «Ich sah zum Horizont»: de espaldas, Jonte mira al mar lejano; el horizonte se ve oscuro
shot(75.38, 'B', null, L => { kueste(L, { t: 'storm' }); pose(jonte, SC.x, 0, SC.z, PI, L, { headX: -.1 }, 'worried'); wave(L.T, 2400, 18, .1, { glow: .2 });
  cm([SC.x + 3, 6, SC.z - 10, SC.x, 6, SC.z + 600, 40], [SC.x + 2, 6.4, SC.z - 8, SC.x, 7, SC.z + 600, 38], L.k); }, [[0, 'wind_strong', .6]]);
// 58 «Er stieg»: zoom lento al horizonte: una línea verde oscura que crece
shot(76.6, 'Z', 'slow', L => { kueste(L, { t: 'storm' }); wave(L.T, 2200, lerp(18, 40, L.k), .2, { glow: .2 }); cm([SC.x, 8, SC.z + 30, SC.x, 12, SC.z + 900, 30], [SC.x, 8, SC.z + 40, SC.x, 14, SC.z + 900, 22], L.k); }, [[0, 'rumble_far', .8]]);
// 59 «Das Meer war nicht für einen Tag weggegangen»: cielo que se oscurece sobre el barco pirata; la gente aún tranquila
shot(77.38, 'W', null, L => { kueste(L, { t: 'storm' }); wave(L.T, 2100, 44, .25, { glow: .2 }); const S_ = MW.SCHIFF.position; crowdBox(L, S_.x - 40, S_.x + 40, S_.z - 120, S_.z - 60, 8, 41, { mode: 'look', face: V(0, 0, 0), expr: 'happy' });
  cm([S_.x - 60, 10, S_.z - 160, S_.x, 26, S_.z + 300, 54], [S_.x - 56, 12, S_.z - 150, S_.x, 26, S_.z + 300, 54], L.k); }, [[0, 'wind_strong', .6]]);
// 60 «Es hatte nur Luft geholt»: el mar retrocede aún más y se levanta como si inhalara (sonido de succión)
shot(79.58, 'P', null, L => { kueste(L, { t: 'storm' }); wave(L.T, 1900, lerp(44, 66, L.k), lerp(.25, .4, L.k), { glow: .35 }); cm([0, 30, 1500, 0, 40, 1900, 56], [0, 26, 1520, 0, 44, 1900, 56], L.k); }, [[0, 'water_suck', .9]]);
// 61 «Für die größte Welle seit hundert Jahren»: la ola enorme, verde, con la cresta blanca; zoom lento
shot(81.19, 'F', 'slow', L => { kueste(L, { t: 'storm' }); wave(L.T, 1700, lerp(66, 80, L.k), .5, { glow: .5 }); cm([30, 10, 1450, 0, 50, 1700, 58], [24, 12, 1480, 0, 54, 1700, 54], L.k); badge('red', '100 JAHRE', W / 2, H * .2, (L.lt - 1) * 3, 1, .9); }, [[0, 'wave_roar', .8]]);
// 62 «Und die ganze Stadt stand kilometerweit draußen»: vista aérea: familias dispersas por el fondo marino, diminutas, haciendo picnic
shot(83.18, 'S', null, L => { kueste(L, { t: 'storm' }); crowdBox(L, -80, 80, 500, 900, 30, 43, { mode: i => ['dig', 'look', 'talk', 'walk', 'clap'][i % 5], expr: 'happy' });
  cm([0, 110, 500, 0, 0, 800, 56], [0, 120, 540, 0, 0, 840, 56], L.k); badge('tag', 'KILOMETERWEIT', W / 2, H * .2, (L.lt - .2) * 3); }, [[0, 'wind_strong', .5]]);
// 63 «auf dem Meeresboden»: una familia de picnic ríe sobre una manta, de espaldas al mar
shot(86.12, 'C', null, L => { kueste(L, { t: 'storm' }); const c = V(-30, 0, 620); const bl = PLAQ; [NB[1], NB[6], NB[11]].forEach((p_, i) => { sit(p_, c.x - 3 + i * 3, .8, c.z, -.2 + i * .2, L, { aRx: 1 + Math.sin(L.T * 3 + i) * .3, aRe: 1 }); laughF(p_, L.T + i); });
  pose(broesel, c.x + 6, 0, c.z + 2, -.4, L, { aRx: 2.4, aRe: .4 }, 'joy'); laughF(broesel, L.T); cm([c.x + 2, 5, c.z + 16, c.x + 1, 2.8, c.z, 44], [c.x + 1, 4.6, c.z + 14, c.x + 1, 2.8, c.z, 42], L.k); }, [[0, 'picnic_laugh', .6]]);
// 64 «Ich schrie»: Jonte grita con las manos en la boca
shot(87.32, 'Z', 'punch', L => { kueste(L, { t: 'storm' }); pose(jonte, SC.x, 0, SC.z - 60, PI, L, { aLx: 2.3, aRx: 2.3, aLz: -.2, aRz: -.2, aLe: 1.8, aRe: 1.8, lean: .1 }, 'shout', { mouth: 'scream' }); jonte.root.rotation.y = 0;
  onFace(jonte, 6, .3, 1.5, 42, L.k, 5); }, [[0, 'kid_shout', .7]]);
// 65 «Niemand hörte mich»: la gente lejos, sin girarse; su voz se pierde en el viento
shot(88.04, 'I', null, L => { kueste(L, { t: 'storm' }); crowdBox(L, -40, 40, 360, 420, 10, 47, { mode: i => ['dig', 'talk', 'look'][i % 3], face: V(0, 0, 0), expr: 'happy' }); pose(jonte, 0, 0, 470, PI, L, { aLx: 2.3, aRx: 2.3, aLe: 1.8, aRe: 1.8 }, 'shout', { mouth: 'scream' });
  cm([6, 7, 486, 0, 3, 380, 46], [5, 7.5, 488, 0, 3, 380, 44], L.k); }, [[0, 'wind_strong', .7]]);
// 66 «Dann dachte ich an Opas Muschelhorn»: Jonte saca el Muschelhorn de la mochila/cubo; recuerdo de Opa (tono cálido)
shot(89.2, 'F', null, L => { kueste(L, { t: 'storm' }); pose(jonte, SC.x, 0, SC.z - 30, 0, L, { aRx: lerp(.6, 1.6, easeOut(clamp(L.lt / .6))), aRe: .6, aLx: .4 }, 'determined'); attach(HORN, jonte.aR.hand, [.4, -.6, .6], [0, 0, 0], .55);
  onFace(jonte, 6, 0, 1.4, 42, L.k, 5); }, [[0, 'sparkle', .6]]);
// 67 «Ich kletterte auf den Mast»: Jonte trepa por el mástil inclinado del barco pirata
shot(91.17, 'W', null, L => { kueste(L, { t: 'storm' }); const p = mastP(1, lerp(.3, .55, L.k)); put(jonte, p.x, p.y - 2, p.z + 1.2, PI); actuar(jonte, 0, [[0, climbP(L.T, 0)]], { T: L.T, weight: false }); jonte.blob.visible = false; cara(jonte, L.T, { expr: 'determined', mouth: 'grimace' });
  cm([p.x - 8, p.y - 4, p.z - 11, p.x, p.y, p.z, 48], [p.x - 7, p.y - 3, p.z - 10, p.x, p.y + 1, p.z, 48], L.k); }, [[0, 'wood_creak', .7], [.2, 'rope_creak', .5]]);
// 68 «des Piratenschiffs»: plano general del barco con Jonte arriba, la ola a lo lejos
shot(92.39, 'Z', null, L => { kueste(L, { t: 'storm' }); wave(L.T, 1600, 74, .5, { glow: .45 }); const p = mastP(1, .7); put(jonte, p.x, p.y - 2, p.z + 1.2, PI); actuar(jonte, 0, [[0, climbP(L.T, 0)]], { T: L.T, weight: false }); jonte.blob.visible = false;
  const S_ = MW.SCHIFF.position; cm([S_.x - 40, 8, S_.z - 80, S_.x, 30, S_.z + 100, 54], [S_.x - 36, 10, S_.z - 72, S_.x, 32, S_.z + 100, 54], L.k); }, [[0, 'wave_roar', .5]]);
// 69 «Ich holte so tief Luft»: en la cofa, Jonte inspira hondo, pecho hinchado, la caracola en los labios
shot(93.39, 'S', null, L => { kueste(L, { t: 'storm' }); const p = mastP(1, .86); const ins = easeOut(clamp(L.lt / 1.2)); pose(jonte, p.x, p.y + .2, p.z, .2, L, { aRx: 2.2, aRe: 1.8, aLx: 2, aLe: 1.6, headX: -.2 * ins, lean: -.1 * ins, sx: 1 + ins * .06 }, 'determined', { mouth: 'o' }); jonte.blob.visible = false;
  attach(HORN, jonte.aR.hand, [.5, -.4, .6], [0, 0, .6], .55); onFace(jonte, 6, .4, 2, 42, L.k, 5); }, [[0, 'inhale_deep', .9]]);
// 70 «wie noch nie in meinem Leben»: zoom lento a su cara con las mejillas hinchadas
shot(94.85, 'I', 'slow', L => { kueste(L, { t: 'storm' }); const p = mastP(1, .86); pose(jonte, p.x, p.y + .2, p.z, .2, L, { aRx: 2.3, aRe: 1.9, aLx: 2.1, aLe: 1.7, headX: -.25 }, 'determined', { mouth: 'o', eyes: 'squint' }); jonte.blob.visible = false;
  attach(HORN, jonte.aR.hand, [.5, -.4, .6], [0, 0, .6], .55); onFace(jonte, 5, .3, -1.5, 40, L.k, 3.6); }, []);
// 71 «Und ich blies»: ¡sopla! anillos de sonido salen de la caracola; golpe de zoom
shot(96.03, 'C', 'punch', L => { kueste(L, { t: 'storm' }); const p = mastP(1, .86); pose(jonte, p.x, p.y + .2, p.z, .2, L, { aRx: 2.3, aRe: 1.9, aLx: 2.1, aLe: 1.7, headX: -.1 }, 'determined', { mouth: 'o', eyes: 'closed' }); jonte.blob.visible = false;
  attach(HORN, jonte.aR.hand, [.5, -.4, .6], [0, 0, .6], .55); const h = wpos(HORN); RINGS.forEach((r, i) => { const q = (L.lt * 1.4 - i * .2); if (q <= 0 || q > 1) return; r.visible = true; r.position.copy(h); r.lookAt(h.clone().add(V(Math.sin(.2), 0, Math.cos(.2)))); r.scale.setScalar(1 + q * 14); r.material.opacity = .5 * (1 - q); });
  SHAKE = .4; onFace(jonte, 9, 1, 3, 46, L.k, 8); }, [[0, 'horn_blast', 1]]);
// 72 «Der Ton rollte über den Meeresboden wie Donner»: anillos gigantes recorren el fondo marino, los charcos vibran, la arena salta
shot(97.14, 'Z', null, L => { kueste(L, { t: 'storm' }); const S_ = MW.SCHIFF.position; rings(V(S_.x, 0, S_.z), L.k, 4, 420, 2); SHAKE = .25; crowdBox(L, -60, 60, 420, 600, 14, 51, { mode: 'look', face: V(S_.x, 20, S_.z), expr: 'shock' });
  cm([S_.x + 60, 70, S_.z - 260, S_.x, 0, S_.z - 60, 60], [S_.x + 50, 80, S_.z - 280, S_.x, 0, S_.z - 60, 60], L.k); }, [[0, 'thunder_roll', .8]]);
// 73 «Alle drehten sich um»: las familias del fondo marino se giran a la vez hacia el sonido
shot(99.73, 'W', null, L => { kueste(L, { t: 'storm' }); crowdBox(L, -24, 24, 440, 470, 12, 53, { mode: 'look', ry: i => lerp(0, PI, easeInOut(clamp(L.k * 1.6 - i * .05))), expr: 'shock' });
  cm([0, 6, 420, 0, 4, 460, 48], [0, 6.5, 424, 0, 4, 460, 46], L.k); }, [[0, 'crowd_gasp', .7]]);
// 74 «Sie sahen die Welle»: por encima de sus hombros: la ola gigante en el horizonte
shot(100.94, 'B', 'punch', L => { kueste(L, { t: 'storm' }); wave(L.T, 1300, 80, .55, { glow: .5 }); crowdBox(L, -20, 20, 460, 470, 8, 55, { mode: 'shock', ry: () => 0 });
  cm([4, 9, 440, 0, 30, 1300, 54], [3, 9.5, 444, 0, 32, 1300, 52], L.k); }, [[0, 'wave_roar', .8], [0, 'crowd_scream', .6]]);
// 75 «Und sie rannten»: todos corren hacia cámara, la ola detrás
shot(101.78, 'C', null, L => { kueste(L, { t: 'storm' }); wave(L.T, 1250, 80, .55, { glow: .5 }); crowdBox(L, -22, 22, 470, 500, 12, 57, { mode: 'run', ry: () => PI, speed: 10, expr: 'shock' });
  cm([0, 6, 430 - L.lt * 10, 0, 8, 520, 54], [0, 6, 424 - L.lt * 10, 0, 8, 520, 54], L.k); }, [[0, 'footsteps_run', .8], [0, 'crowd_scream', .5]]);
// 76 «Familien rasten zwischen den Wracks hindurch»: travelling lateral junto al carguero oxidado
shot(102.92, 'S', null, L => { kueste(L, { t: 'storm' }); const Wr = MW.WRACKS[1].position; crowdBox(L, Wr.x - 26, Wr.x + 4, Wr.z - 40, Wr.z - 20, 10, 59, { mode: 'run', ry: () => PI, speed: 11 }); run(mama, L, Wr.x - 8, Wr.z - 28, PI, 11, 2);
  cm([Wr.x - 44, 6, Wr.z - 34 - L.lt * 11, Wr.x - 8, 5, Wr.z - 30 - L.lt * 11, 52], [Wr.x - 42, 6, Wr.z - 38 - L.lt * 11, Wr.x - 8, 5, Wr.z - 34 - L.lt * 11, 52], L.k); }, [[0, 'footsteps_run', .7], [.2, 'metal_creak', .5]]);
// 77 «Wracks hindurch»: bajo la proa de otro pecio, gente saltando las rocas
shot(104.2, 'R', null, L => { kueste(L, { t: 'storm' }); const Wr = MW.WRACKS[0].position; crowdBox(L, Wr.x + 10, Wr.x + 34, Wr.z - 30, Wr.z - 14, 8, 61, { mode: 'run', ry: () => PI + .3, speed: 11 });
  cm([Wr.x + 30, 3, Wr.z - 60, Wr.x + 14, 7, Wr.z - 10, 56], [Wr.x + 29, 3.2, Wr.z - 62, Wr.x + 14, 7, Wr.z - 10, 56], L.k); }, [[0, 'footsteps_run', .7]]);
// 78 «Papas mit Kindern auf den Schultern»: Papa Ole corre con un niño a hombros
shot(105.15, 'W', null, L => { kueste(L, { t: 'storm' }); wave(L.T, 900, 80, .6, { glow: .5 }); run(papa, L, 6, 300, PI, 10, 1); const kid = NB[13]; put(kid, 0, 0, 0, 0); papa.spine.add(kid.root); kid.root.position.set(0, .9, -.4); kid.root.rotation.set(0, 0, 0); kid.root.scale.setScalar(.9); actuar(kid, 0, [[0, sitPose({ aLx: 2.6, aRx: 2.6, aLz: .4, aRz: .4 })]], { T: L.T, weight: false }); kid.blob.visible = false; cara(kid, L.T, { expr: 'shock', mouth: 'o' });
  const p = papa.root.position; cm([p.x + 3, 7, p.z - 12, p.x, 6, p.z, 50], [p.x + 3, 7, p.z - 11, p.x, 6, p.z, 50], L.k); }, [[0, 'footsteps_run', .7], [0, 'heavy_breath', .5]]);
// 79 «Omas, die die Leitern … hochkletterten»: abuelas subiendo las escaleras a toda velocidad
shot(106.79, 'S', null, L => { kueste(L, { t: 'storm' }); const om = [NB[5], NB[15], NB[25], NB[35]]; om.forEach((c, i) => onLadder(c, 4 + i, .2 + i * .12 + L.k * .5, L, i, { sp: 2.2, expr: 'determined', mouth: 'grimace' }));
  cm([LX(5) + 24, 10, 54, LX(5) + 12, 24, 4, 52], [LX(5) + 20, 16, 50, LX(5) + 12, 30, 4, 52], L.k); }, [[0, 'ladder_steps', .8]]);
// 80 «schneller … als ich es je gesehen hatte»: picado desde arriba: las escaleras llenas de gente subiendo rapidísimo
shot(107.95, 'Z', null, L => { kueste(L, { t: 'storm' }); for (let i = 3; i < 9; i++) for (let j = 0; j < 3; j++) onLadder(NB[(i * 3 + j) % 40], i, .1 + j * .3 + L.k * .2, L, i * 3 + j, { sp: 2.2, expr: 'shock' });
  crowdBox(L, -60, 60, -7, -10, 8, 63, { y: CH, mode: 'point', face: V(0, 0, 60), list: [mama, opa, ...NB.slice(36)] });
  cm([LX(5) + 40, 22, 74, LX(5), 30, 4, 54], [LX(5) + 36, 24, 70, LX(5), 32, 4, 54], L.k); }, [[0, 'ladder_steps', .8], [.3, 'crowd_scream', .4]]);
// ---------- d: la pared de agua, la carrera de Jonte, Mama, el BUMM, la lluvia, el Rathaus (110 – 144,1 s) ----------
// 81 «Die Welle war jetzt eine Wand»: la ola ocupa todo el cuadro; gente diminuta corriendo delante
shot(110.0, 'P', 'punch', L => { kueste(L, { t: 'storm' }); wave(L.T, 520 - L.lt * 20, 82, .6, { glow: .55 }); crowdBox(L, -60, 60, 300, 380, 14, 65, { mode: 'run', ry: () => PI, speed: 11 });
  cm([10, 4, 240, 0, 46, 520, 62], [8, 4, 236, 0, 50, 520, 62], L.k); }, [[0, 'wave_roar', .9]]);
// 82 «Höher als die Klippen»: de perfil: la ola más alta que el acantilado y el pueblo
shot(111.38, 'W', 'slow', L => { kueste(L, { t: 'storm' }); wave(L.T, 330 - L.lt * 20, 82, .6, { glow: .5 }); crowdBox(L, -40, 40, -7, -10, 10, 67, { y: CH, mode: 'shock', face: V(0, 40, 300) });
  cm([-320, 40, 150, 0, 40, 170, 56], [-300, 42, 160, 0, 42, 170, 54], L.k); }, [[0, 'rumble_far', .8]]);
// 83 «Dunkelgrün»: primer plano de la cara de la ola, verde oscuro y translúcida
shot(112.99, 'F', null, L => { kueste(L, { t: 'day' }); wave(L.T, 300, 82, .6, { glow: .8 }); cm([20, 14, 200, 0, 70, 300, 52], [18, 16, 204, 0, 72, 300, 50], L.k); }, [[0, 'water_rush', .7]]);
// 84 «und die Sonne schien durch sie hindurch»: contraluz: el sol brilla a través de la cresta (verde esmeralda)
shot(113.88, 'R', null, L => { kueste(L, { t: 'day' }); SUND.set(0, .35, 1).normalize(); wave(L.T, 300, 82, .65, { glow: 1.1 }); cm([-10, 12, 200, 0, 80, 330, 56], [-8, 14, 206, 0, 82, 330, 56], L.k); BLOOMMAX = .5; bloom.strength = .5; }, [[0, 'shimmer', .6]]);
// 85 «Ich rutschte den Mast hinunter»: Jonte se desliza por el mástil abrazado a él
shot(115.35, 'S', null, L => { kueste(L, { t: 'storm' }); const p = mastP(1, lerp(.8, .3, easeIn(L.k))); put(jonte, p.x, p.y - 2, p.z + 1.2, PI); actuar(jonte, 0, [[0, { aLx: 2.6, aRx: 2.6, aLe: 1.2, aRe: 1.2, lLx: .6, lRx: .6, lLk: 1, lRk: 1 }]], { T: L.T, weight: false }); jonte.blob.visible = false; cara(jonte, L.T, { expr: 'shock', mouth: 'scream' });
  attach(HORN, jonte.aR.hand, [.4, -.6, .6], [0, 0, 0], .55); cm([p.x - 16, p.y - 4, p.z - 20, p.x, p.y, p.z, 50], [p.x - 15, p.y - 6, p.z - 19, p.x, p.y - 2, p.z, 50], L.k); }, [[0, 'slide_rope', .8]]);
// 86 «und rannte die fast sechs Kilometer zurück»: Jonte corre hacia cámara con todas sus fuerzas; la ola detrás
shot(116.61, 'Z', null, L => { kueste(L, { t: 'storm' }); run(jonte, L, 0, 260, PI, 9, 0, { expr: 'determined', mouth: 'grimace' }); attach(HORN, jonte.aR.hand, [.4, -.6, .6], [0, 0, 0], .55); wave(L.T, 420, 82, .6, { glow: .5 });
  const p = jonte.root.position; cm([p.x + 2, 5, p.z - 14, p.x, 5, p.z + 60, 52], [p.x + 2, 5, p.z - 12, p.x, 6, p.z + 60, 52], L.k); badge('gold', '6 KM', W / 2, H * .2, (L.lt - .2) * 3); }, [[0, 'footsteps_run', .8], [0, 'heavy_breath', .7]]);
// 87 «zurück»: travelling lateral, Jonte corriendo entre charcos que salpican
shot(117.6, 'W', null, L => { kueste(L, { t: 'storm' }); run(jonte, L, 0, 160, PI, 9, 0, { expr: 'determined', mouth: 'grimace' }); attach(HORN, jonte.aR.hand, [.4, -.6, .6], [0, 0, 0], .55); const p = jonte.root.position;
  cm([p.x + 14, 3, p.z, p.x, 3, p.z, 46], [p.x + 14, 3, p.z - 2, p.x, 3, p.z - 2, 46], L.k); }, [[0, 'splash_step', .7]]);
// 88 «Ich erreichte die Leiter»: Jonte llega al pie de la escalera y se agarra
shot(118.56, 'C', null, L => { kueste(L, { t: 'storm' }); const x = LX(6); const k = clamp(L.lt / .5); if (k < 1) run(jonte, L, x, 26, PI, 12, 0, { expr: 'determined', mouth: 'grimace' }); else onLadder(jonte, 6, .02 + (L.lt - .5) * .08, L, 0, { sp: 2 });
  cm([x + 10, 4, 34, x, 6, 14, 50], [x + 9, 5, 32, x, 7, 14, 50], L.k); }, [[.4, 'wood_clack', .7]]);
// 89 «und kletterte los»: picado: sube peldaño a peldaño, la arena muy abajo
shot(119.66, 'S', null, L => { kueste(L, { t: 'storm' }); onLadder(jonte, 6, .15 + L.k * .2, L, 0, { sp: 2, expr: 'determined', mouth: 'grimace' }); const p = jonte.root.position; cm([p.x + 3, p.y + 12, p.z + 6, p.x, p.y - 4, p.z + 2, 54], [p.x + 3, p.y + 11, p.z + 5, p.x, p.y - 4, p.z + 2, 54], L.k); }, [[0, 'ladder_steps', .7]]);
// 90 «Hinter mir wurde das Brüllen lauter»: desde detrás de Jonte en la escalera: la ola enorme llegando
shot(120.65, 'Z', 'slow', L => { kueste(L, { t: 'storm' }); onLadder(jonte, 6, .45 + L.k * .2, L, 0, { sp: 2, expr: 'shock', mouth: 'scream' }); wave(L.T, lerp(220, 130, L.k), 84, .7, { glow: .55 }); const p = jonte.root.position; SHAKE = .2 + L.k * .4;
  cm([p.x - 4, p.y + 4, p.z - 2, p.x + 4, p.y + 10, 200, 60], [p.x - 3, p.y + 3, p.z - 3, p.x + 4, p.y + 14, 200, 60], L.k); }, [[0, 'wave_roar', 1]]);
// 91 «Eine Hand packte mich am Handgelenk»: primer plano: una mano agarra la muñeca de Jonte en el último peldaño
shot(122.37, 'C', 'punch', L => { kueste(L, { t: 'storm' }); const x = LX(6); onLadder(jonte, 6, .93, L, 0, { sp: .3, expr: 'shock', mouth: 'o' });
  put(mama, x, CH, -4.8, 0); actuar(mama, 0, [[0, { aRx: 2.3, aRe: .1, lean: .55, crouch: .25, aLx: 1.2, headX: .4 }]], { T: L.T }); cara(mama, L.T, { expr: 'determined', mouth: 'grimace' });
  cm([x + 9, CH + 3, 12, x, CH + 1, -1, 44], [x + 8, CH + 3, 10, x, CH + 1, -1, 42], L.k); }, [[0, 'grab', .8]]);
// 92 «und zog mich hoch»: Mama tira de él por encima de la barandilla
shot(124.03, 'W', null, L => { kueste(L, { t: 'storm' }); const x = LX(6), k = easeInOut(clamp(L.lt / .8)); put(jonte, x, lerp(CH - 3, CH + .3, k), lerp(1, -7, k), lerp(PI, 0, k)); actuar(jonte, 0, [[0, { aRx: 2.8, aLx: 1.6, lLx: .8, lLk: 1 }]], { T: L.T, weight: false }); cara(jonte, L.T, { expr: 'shock', mouth: 'o' }); jonte.blob.visible = false;
  pose(mama, x + 1, CH, -9.5, 0, L, { aRx: 1.8 - k * .6, aLx: 1.8 - k * .6, lean: -.3, crouch: .2 }, 'determined', { mouth: 'grimace' });
  cm([x + 12, CH + 6, -22, x, CH + 2, -5, 46], [x + 10, CH + 6, -20, x, CH + 2, -5, 46], L.k); }, [[0, 'heave', .7]]);
// 93 «Mama.»: abrazo; la cara de Mama aliviada
shot(124.94, 'I', null, L => { kueste(L, { t: 'storm' }); const x = LX(6); pose(mama, x, CH, -12, PI + .3, L, { aLx: 1.4, aRx: 1.4, aLz: -.5, aRz: -.5, aLe: 1.4, aRe: 1.4 }, 'relief', { mouth: 'smile' }); tears(mama, L.T);
  pose(jonte, x - .6, CH, -13.6, .3, L, { aLx: 1.3, aRx: 1.3, aLz: -.5, aRz: -.5, aLe: 1.3, aRe: 1.3 }, 'relief'); onFace(mama, 7, .3, 1.5, 42, L.k, 5.5); }, [[0, 'soft_air', .5]]);
// 94 «Die Welle krachte unter uns gegen die Klippen»: desde arriba: la ola rompe contra el acantilado, la gente agarrada a la barandilla
shot(125.43, 'S', null, L => { kueste(L, { t: 'storm', sea: 1, seaY: lerp(8, 30, L.k) }); wave(L.T, lerp(80, 24, L.k), 82, lerp(.6, .95, L.k), { glow: .5 }); crowdBox(L, -30, 30, -7, -10, 12, 69, { y: CH, mode: 'shock', ry: () => PI });
  cm([-18, CH + 14, -18, 0, 18, 60, 58], [-16, CH + 15, -20, 0, 16, 60, 60], L.k); SHAKE = .3 + L.k * .5; }, [[0, 'wave_crash', 1]]);
// 95 «BUMM!»: impacto: columna de espuma blanca, destello y sacudida
shot(127.33, 'C', 'punch', L => { kueste(L, { t: 'storm', sea: 1, seaY: 30 }); SPRITZ.userData.burst(V(0, 20, 10), L.lt * 1.2, { h: 160, sx: 300 }); SHAKE = 1 - L.k * .5; grade.uniforms.flash.value = Math.max(0, .7 - L.lt * 2);
  cm([60, 30, 140, 0, 50, 0, 60], [56, 32, 136, 0, 54, 0, 60], L.k); badge('big', 'BUMM!', W / 2, H * .2, L.lt * 4, 1, 1.4); }, [[0, 'boom', 1], [0, 'wave_crash', .8]]);
// 96 «Das Wasser schoss vierzig Meter in die Luft»: la columna de agua sube por encima de los tejados; 40 METER
shot(128.06, 'Z', null, L => { kueste(L, { t: 'storm', sea: 1, seaY: 28 }); SPRITZ.userData.burst(V(0, 20, 10), .9 + L.lt * .9, { h: 160, sx: 300 }); crowdBox(L, -30, 30, -8, -14, 10, 71, { y: CH, mode: 'shock', face: V(0, 120, 20) });
  cm([10, CH + 4, -20, 0, CH + 60, 20, 62], [8, CH + 3, -18, 0, CH + 70, 20, 62], L.k); badge('cyan', '40 METER', W / 2, H * .2, (L.lt - .6) * 3, 1, 1.2); }, [[0, 'water_rush', .7]]);
// 97 «Und fiel wie Regen auf die ganze Stadt»: lluvia sobre el pueblo, la gente alza los brazos; arcoíris
shot(130.28, 'F', null, L => { kueste(L, { t: 'day', sea: 1, seaY: 10 }); REGEN.visible = true; REGEN.userData.set(V(0, CH, -20), L.T, { r: 60, h: 60 }); BOGEN.visible = true; BOGEN.position.set(-200, -300, -1500); BOGEN.lookAt(camera.position);
  crowdBox(L, -30, 30, -10, -24, 14, 73, { y: CH, mode: i => i % 2 ? 'cheer' : 'look', face: V(0, CH + 40, 30), expr: 'joy' });
  cm([0, CH + 6, 20, 0, CH + 12, -60, 56], [0, CH + 7, 14, 0, CH + 14, -60, 56], L.k); }, [[0, 'rain', .8]]);
// 98 «Ich sah mich um»: Jonte empapado mira a su alrededor
shot(132.48, 'S', null, L => { kueste(L, { t: 'day', sea: 1, seaY: 10 }); REGEN.visible = true; REGEN.userData.set(V(0, CH, -14), L.T, { r: 30, h: 40 }); pose(jonte, 0, CH, -12, PI + Math.sin(L.T * 1.5) * .6, L, { headY: Math.sin(L.T * 2) * .5 }, 'shock', { mouth: 'o' });
  cm([1, CH + 6, -24, 0, CH + 4.5, -10, 44], [1, CH + 5.6, -22, 0, CH + 4.5, -10, 42], L.k); }, [[0, 'rain', .6]]);
// 99 «Jede Familie»: una familia se abraza bajo la lluvia
shot(133.42, 'W', null, L => { kueste(L, { t: 'day', sea: 1, seaY: 10 }); REGEN.visible = true; REGEN.userData.set(V(0, CH, -14), L.T, { r: 30, h: 40 }); const H_ = { aLx: 1.4, aRx: 1.4, aLz: -.5, aRz: -.5, aLe: 1.3, aRe: 1.3 };
  pose(NB[0], -2, CH, -12, PI - .6, L, H_, 'relief', { mouth: 'smile' }); pose(NB[2], 1.6, CH, -12.6, PI + .6, L, H_, 'relief', { mouth: 'smile' }); pose(NB[3], 0, CH, -14.2, PI, L, { ...H_, aLz: .3, aRz: .3 }, 'joy');
  cm([0, CH + 5, -24, 0, CH + 3.4, -11, 44], [0, CH + 5, -22, 0, CH + 3.4, -11, 42], L.k); }, [[0, 'cheer_soft', .5]]);
// 100 «Jedes Kind»: los niños saltan en los charcos del paseo
shot(134.32, 'C', null, L => { kueste(L, { t: 'day', sea: 1, seaY: 10 }); REGEN.visible = true; REGEN.userData.set(V(0, CH, -14), L.T, { r: 30, h: 40 }); crowdBox(L, -8, 8, -10, -14, 4, 75, { y: CH, mode: 'cheer', list: [NB[8], NB[13], NB[18], NB[23]] });
  cm([0, CH + 3.5, -24, 0, CH + 3, -11, 44], [0, CH + 3.8, -22, 0, CH + 3, -11, 42], L.k); }, [[0, 'kids_laugh', .6], [.2, 'splash_step', .6]]);
// 101 «Jede Oma»: dos abuelas ríen a carcajadas, chorreando
shot(135.22, 'R', null, L => { kueste(L, { t: 'day', sea: 1, seaY: 10 }); REGEN.visible = true; REGEN.userData.set(V(0, CH, -14), L.T, { r: 30, h: 40 }); pose(NB[5], -2, CH, -12, PI - .4, L, { aLx: 1.2, aLe: 1.6 }, 'joy'); laughF(NB[5], L.T); pose(NB[15], 2, CH, -12, PI + .4, L, { aRx: 2.4, aRe: .4 }, 'joy'); laughF(NB[15], L.T + 1);
  cm([0, CH + 4.6, -24, 0, CH + 3.8, -11, 42], [0, CH + 4.6, -22, 0, CH + 3.8, -11, 40], L.k); }, [[0, 'laugh_old', .6]]);
// 102 «Alle hatten es geschafft»: el pueblo alza a Jonte a hombros; confeti de agua y gaviotas que vuelven
shot(136.0, 'Z', 'punch', L => { kueste(L, { t: 'day', sea: 1, seaY: 10 }); put(jonte, 0, CH + 4 + Math.abs(Math.sin(L.T * 6)) * 1.2, -12, PI); actuar(jonte, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5 }]], { T: L.T, weight: false }); laughF(jonte, L.T); jonte.blob.visible = false; attach(HORN, jonte.aR.hand, [.4, -.6, .6], [0, 0, 1.4], .55);
  crowdAt(L, 0, -12, 14, 3, 9, 77, { y: CH, mode: 'cheer', list: [mama, opa, papa, broesel, ...NB] }); MOEW.fly(L.T, V(-40, CH + 30, 20), V(1, 0, .2), { lt: L.lt, n: 14, speed: 10 });
  cm([0, CH + 7, -24.5, 0, CH + 6, -9, 54], [0, CH + 7.5, -23, 0, CH + 6, -9, 52], L.k); }, [[0, 'crowd_cheer', .8]]);
// 103 «Jetzt hängt Opas Muschelhorn im Rathaus»: la sala del Rathaus, la caracola en su placa; Opa y Jonte delante
shot(137.31, 'B', null, L => { saal(L); pose(opa, RHX - 6, 0, -22, .35, L, { headY: -.3 }, 'warm', { mouth: 'smile' }); pose(jonte, RHX + 6, 0, -22, -.35, L, { headY: .3, aRx: 1.4, aRe: .1, aRz: -.4 }, 'happy', { mouth: 'smile' });
  cm([RHX + 4, 13, 4, RHX, 12, -26, 50], [RHX + 3, 13, 0, RHX, 12.5, -26, 48], L.k); }, [[0, 'room_hall', .5]]);
// 104 «Und in hundert Jahren»: zoom lento a la placa «NÄCHSTE EBBE: MITTAGS BLASEN»
shot(139.27, 'F', 'slow', L => { saal(L); cm([RHX, 11, -12, RHX, 10.4, -29, 44], [RHX, 10.8, -18, RHX, 10.4, -29, 40], L.k); badge('gold', '100 JAHRE', W / 2, H * .22, (L.lt - .3) * 3); }, [[0, 'clock_tick', .5]]);
// 105 «am Mittag, wird es jemand blasen»: primer plano de la caracola brillando a la luz de la ventana
shot(140.6, 'I', null, L => { saal(L); const h = wpos(HORN2); cm([h.x + 4, h.y - 1, h.z + 10, h.x, h.y, h.z, 40], [h.x + 3, h.y - .8, h.z + 8.5, h.x, h.y, h.z, 38], L.k); }, [[0, 'sparkle', .6]]);
// 106 «Nur für den Fall»: final: Jonte guiña el ojo a cámara junto a Opa; detrás, por la ventana, el mar tranquilo
shot(142.33, 'W', null, L => { saal(L); pose(opa, RHX - 2.4, 0, -20, .2, L, {}, 'warm', { mouth: 'smile' }); pose(jonte, RHX + 2, 0, -19, -.15, L, { aRx: 1.4, aRe: 1.6, aRz: .3 }, 'happy', { eyes: 'wink', mouth: 'smirk' }); BUCKET.visible = false;
  onFace(jonte, 9, .6, -2, 44, L.k, 7.5); }, [[0, 'pling', .6]]);


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
window.DBG = { THREE, applyPose, hp, jonte, opa, mama, cam, renderer, composer, bloom, sun, grade, scene, camera, MW, WELLE };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

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
//@@PLANOS@@

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

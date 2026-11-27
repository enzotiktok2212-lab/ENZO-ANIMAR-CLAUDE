// SEIL — «In dieser Stadt springen wir alle neun Sekunden. Alle. Unser ganzes Leben lang.»
// Yo (el Rufer, 12) estornudo y Lotte «se adelanta»; camino hasta la torre de personas que gira la cuerda… y mando un mensaje con la ola.
// Mundo propio (swwelt.js) y reparto (swvolk.js). Planos en src/p/*.js; armar.py los une en src/index.js.
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { RA, XF, XT, CR, TX, AZ, Ax, Bx, ropePt, phiAt, ropeY, wrap, wiese, hierba, weg, dorf, parcela, zaun, sockel, seil, anillos, seilNah, turm, turmPt, tR, tBend, TH, fischerdorf, horn, schnecke, decke, suppe, gotas, bogen, opTisch, zzz, schnee, karren, glowM } from './swwelt.js';
import { makeIch, makeLotte, makeFischer, makeBraut, makeBraeutigam, makeBeamtin, makeChirurg, makeSuppe, makeOma, makeMutter, wickel } from './swvolk.js';
import { makeExtra } from './ecast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 195.4, U = W / 720, PI = Math.PI;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const QS = new URLSearchParams(location.search); const HQ = QS.get('hq') !== '0';
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 5000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = QS.get('ao') !== '0';
const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: .0008, maxblur: .01 }); composer.insertPass(bokeh, 2); let DOF = 1;
let CAMT = new THREE.Vector3(); { const la = camera.lookAt.bind(camera); camera.lookAt = (...a) => { if (a.length === 3) CAMT.set(...a); else CAMT.copy(a[0]); la(...a); }; }
const SS = +(QS.get('ss') ?? 1.5); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
if (HQ) { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = +(QS.get('env') ?? .2); renderer.toneMapping = { agx: THREE.AgXToneMapping, aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping }[QS.get('tm') ?? 'neutral']; }
const sky = nightSky(scene); sky.sky.material.depthWrite = !HQ; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0003; sun.shadow.normalBias = .12; sun.shadow.radius = 2.5; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
// luces locales (siempre en la escena; intensidad 0 si no se usan: así no se recompilan los shaders)
const LP = Array.from({ length: 4 }, () => { const l = new THREE.PointLight(0xffb060, 0, 60, 1.6); scene.add(l); return l; });
const LANT = new THREE.PointLight(0xffc070, 0, 34, 1.4); scene.add(LANT);   // farol del guardia (luz en la cara)
function sh(p0, s = 30) { const q = 2 * s / 2048 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(SUNOFF); rim.target.position.copy(p); rim.position.copy(p).add(V(70, 45, -100)); }
const OLF = HQ ? 0 : 1; const OC = 3 * SS * OLF, OS = 2.2 * SS * OLF, OP = 1.8 * SS * OLF;
const M2U = 3.95; const SUNOFF = V(-95, 105, 85);
// ---------- escenarios ----------
// Mundo plano. Heimatdorf D1 en (0, 0): parcelas cada 17 (rejilla 5×4), caminos en x = 0 y z = 0, pedestales de Rufer en D1.peds.
// Otros pueblos: D2 (-220, 140), D3 (240, -160), D4 (-300, -260), D5 (420, 220). Fischerdorf en (FX, 0) con el lago al sur (z > 40). Nieve desde x ≈ 960.
// La cuerda: setRope(φ) (φ = 0: abajo en z = 0; avanza hacia −z). Torre de Lotte en +TX (mira a −x; manivela en x ≈ XT); la otra en −TX.
const FX = 680;
const WIESE = wiese(scene), GRASS = hierba(scene);
const WORLD = new THREE.Group(); scene.add(WORLD);
const D1 = dorf(WORLD, 0, 0, 1), D2 = dorf(WORLD, -220, 140, 2, 4, 3), D3 = dorf(WORLD, 240, -160, 3, 4, 3), D4 = dorf(WORLD, -300, -260, 4, 3, 3), D5 = dorf(WORLD, 420, 220, 5, 3, 3);
const DOERFER = [[0, 0, 5, 4], [-220, 140, 4, 3], [240, -160, 4, 3], [-300, -260, 3, 3], [420, 220, 3, 3]];
const FD = fischerdorf(WORLD, FX, 0);
const ROPE = seil(scene), RINGS = anillos(scene), TURM = turm(scene, TX, -1), TURM2 = turm(scene, -TX, 1), NAH = seilNah(scene);
const SNOW = schnee(scene);
const SETS = { W: WORLD };
for (const k in SETS) outline(SETS[k], OS);
// ---------- reparto ----------
const ich = makeIch(scene), lotte = makeLotte(scene), fischer = makeFischer(scene), braut = makeBraut(scene), braeut = makeBraeutigam(scene), beamtin = makeBeamtin(scene);
const CH = [makeChirurg(scene, 0), makeChirurg(scene, 1)], suppeM = makeSuppe(scene), oma = makeOma(scene), mutter = makeMutter(scene);
kitFace(ich, 'kid'); kitFace(lotte, 'girl'); kitFace(fischer, 'mustache'); kitFace(braut, 'girl'); kitFace(braeut, 'hero'); kitFace(beamtin, 'girl'); CH.forEach(c => kitFace(c, 'plain')); kitFace(suppeM, 'mustache'); kitFace(oma, 'girl'); kitFace(mutter, 'girl');
const DX = Array.from({ length: 30 }, (_, i) => { const c = makeExtra(scene, i + 60); kitFace(c, ['girl', 'plain', 'girl', 'hero', 'girl', 'mustache', 'kid'][i % 7]); return c; });
const MAIN = [ich, lotte, fischer, braut, braeut, beamtin, ...CH, suppeM, oma, mutter];
const POOL = [...MAIN, ...DX];
POOL.forEach(c => outline(c.root, OC));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(.5, 'rgba(0,0,0,.26)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const PROPS = [];
const P_ = o => { if (!o.parent) scene.add(o); PROPS.push(o); return o; };
const HORNS = Array.from({ length: 8 }, () => { const h = P_(horn()); outline(h, OP); return h; });
const SNAILS = Array.from({ length: 16 }, (_, i) => { const s = P_(schnecke(i)); outline(s, OP); return s; });
const DECKE = P_(decke()), KARREN = P_(karren()), SUPPE = P_(suppe()), BOGEN = P_(bogen()), OPT = P_(opTisch());
const BABYS = Array.from({ length: 3 }, (_, i) => P_(wickel([0xff8ad0, 0x9ad0f4, 0xffd23f][i])));
const ZZZ = Array.from({ length: 3 }, () => P_(zzz()));
const SPLASH = gotas(scene, 24, 0xd8902a), SPRAY = gotas(scene, 30, 0xd8ecff);
const DUST = Array.from({ length: 24 }, () => P_(sphere(1, mat(0xd8c8b0, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 8, 6)));
const SWEAT = Array.from({ length: 3 }, () => P_(sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const TEAR = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8)));
const CONF = Array.from({ length: 40 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xffd23f, 0xffffff, 0x3a7ad8, 0xff4a8a, 0x8ad84a][i % 5], side: THREE.DoubleSide })); scene.add(p); return P_(p); });
const SPARK = Array.from({ length: 18 }, () => P_(sphere(.12, glowM(0xffe8a0, 4), scene, 0, 0, 0, 6, 4)));


// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.16, .44, .96], [.45, .72, 1], [.86, .94, 1]); sky.moon.visible = false; sky.sky.material.uniforms.cloud.value = 1; sky.sky.material.uniforms.starK.value = 0; hemi.intensity = 1.0; hemi.color.setRGB(.82, .9, 1); hemi.groundColor.setRGB(.6, .55, .42); sun.intensity = 3.0; sun.color.setRGB(1, .9, .76); rim.intensity = 1.9; rim.color.setRGB(1, .93, .82);
  scene.fog.color.setRGB(.82, .9, 1); scene.fog.density = .0006; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function dusk() { day(); sun.color.setRGB(1, .66, .42); sun.intensity = 2.3; setSky([.14, .18, .52], [.74, .42, .56], [1, .6, .34]); hemi.color.setRGB(.9, .74, .8); scene.fog.color.setRGB(.9, .66, .6); rim.color.setRGB(1, .6, .4); }
// noche de luna: azul profundo con luces cálidas (como la referencia), sin quedarse oscuro
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = .92; setSky([.01, .03, .1], [.03, .08, .2], [.08, .14, .28]); sky.sky.material.uniforms.cloud.value = 0; sky.sky.material.uniforms.starK.value = 1; sky.moon.visible = true; sky.moon.position.set(-300, 520, -1300); hemi.intensity = .62; hemi.color.setRGB(.45, .6, 1); hemi.groundColor.setRGB(.16, .16, .26); sun.intensity = .95; sun.color.setRGB(.62, .74, 1); rim.intensity = 1.3; rim.color.setRGB(.7, .82, 1);
  scene.fog.color.setRGB(.04, .08, .18); scene.fog.density = .0022; bloom.strength = .34; bloom.threshold = .78; FILL.intensity = fill; FILL.color.setRGB(1, .86, .7); BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; bloom.threshold = .86; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.blob.visible = true; c.blob.position.y = .06; c.aR.sh.rotation.y = 0; c.aL.sh.rotation.y = 0; }
  for (const p of PROPS) { p.visible = false; p.rotation.order = 'XYZ'; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const s of [...SPLASH, ...SPRAY]) s.visible = false;
  ROPE.visible = false; ROPE.position.set(0, 0, 0); RINGS.visible = false; TURM.visible = false; TURM2.visible = false; NAH.visible = false; SNOW.visible = false; GRASS.visible = false; WIESE.visible = false;
  for (const k in SETS) SETS[k].visible = false; FX2D.length = 0; FACES.length = 0; for (const l of LP) l.intensity = 0; LANT.intensity = 0;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.2; grade.uniforms.sharp.value = .5; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; DOF = 1; BW = 0; BLOOMMAX = .2; SUNOFF.set(-95, 105, 85); day(); }
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
// lágrimas: caen por las mejillas en la dirección a la que mira
const tears = (ch, T, slot = 0) => { const h = hp(ch), s = ch.spec.scale || 1, a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a); for (let i = 0; i < 2; i++) { const k = (T * 1.1 + i * .5) % 1, sd = i ? -.3 : .3; const t = TEAR[slot * 2 + i]; t.visible = true; t.position.set(h.x + (fz * sd + fx * .68) * s, h.y + (.72 - k * 1.0) * s, h.z + (-fx * sd + fz * .68) * s); t.scale.setScalar(s); } };
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.5 + t * 1.4) * s * (.8 + r() * .5)); d.material.opacity = .4 * (1 - t / 1.2); }); }
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));
const walkP = (T, i) => { const p = Math.sin(T * 9 + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
const runP = (T, i) => { const p = Math.sin(T * 13 + i); return { aLx: p * 1.1, aRx: -p * 1.1, aLe: 1.3, aRe: 1.3, lLx: -p * .9, lRx: p * .9, lLk: .3 + Math.max(0, p) * 1.1, lRk: .3 + Math.max(0, -p) * 1.1, lean: .25, headX: -.15 }; };
const sitPose = (extra = {}) => ({ lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, ...extra });
const sitY = (c, seat) => seat + .1 - 2.05 * (c.spec.scale || 1);
// sentado en un asiento a la altura seat
function sit(c, x, seat, z, ry, L, pose = {}) { put(c, x, sitY(c, seat), z, ry); actuar(c, 0, [[0, sitPose(pose)]], { T: L.T, weight: false }); c.blob.visible = false; return c; }
// ---------- gente ----------
function crowdAt(L, cx, cz, n, r0, r1, seed = 1, o = {}) { POST.push(() => { const list = (o.list || CR).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc_ = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.2), ac + 6.283 - (o.gap ?? 1.2)];
  const placed = o.avoid ? [...o.avoid] : [];
  list.forEach((c, i) => { let x, z, tries = 0; do { const a = arc_[0] + (i + r() * .8) / list.length * (arc_[1] - arc_[0]); const d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; tries++; } while (tries < 10 && placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 3.6));
    placed.push([x, z]); crowdGuy(c, x, z, L, i, o); }); }); }
function crowdGuy(c, x, z, L, i, o) { const T = L.T + i * .37, face = o.face || camera.position; let ry = o.ry ?? (Math.atan2(face.x - x, face.z - z) + Math.sin(i * 7.3) * (o.jit ?? .35));
  put(c, x, o.y ?? 0, z, ry); const m = typeof o.mode === 'function' ? o.mode(i) : o.mode;
  if (m === 'walk' || m === 'run') { const run = m === 'run', d = (o.speed ?? (run ? 9 : 2.2)) * L.lt, a = ry + (o.dir ?? 0); c.root.rotation.y = a; c.root.position.x += Math.sin(a) * d; c.root.position.z += Math.cos(a) * d; c.root.position.y = (o.y ?? 0) + Math.abs(Math.sin(L.T * (run ? 13 : 9) + i)) * (run ? .35 : .12); actuar(c, 0, [[0, run ? runP(L.T, i) : walkP(L.T, i)]], { T: L.T }); cara(c, T, { expr: o.expr || (run ? 'determined' : 'neutral'), mouth: run ? 'o' : undefined }); }
  else if (m === 'talk') { actuar(c, 0, [[0, { aRx: .9 + Math.sin(L.T * 3 + i) * .3, aRz: .2, aRe: 1.2, aLx: .3, headY: Math.sin(L.T * .8 + i) * .4 }]], { T: L.T }); cara(c, T, { expr: 'happy', mouth: Math.sin(L.T * 9 + i) > 0 ? 'talk' : 'smile' }); }
  else if (m === 'shock') { actuar(c, 0, [[0, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9, lean: -.08, headX: -.06 }]], { T: L.T }); cara(c, T, { expr: 'shock', mouth: i % 2 ? 'o' : 'grimace' }); }
  else if (m === 'point') { actuar(c, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: .5, aLz: -.6, aLe: 1.5, lean: -.08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'shock', mouth: 'o' }); }
  else if (m === 'cheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); c.root.position.y = (o.y ?? 0) + j * .45 * (c.spec.scale || 1); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3, crouch: .05 + j * .08 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'wave') { actuar(c, 0, [[0, 'wave']], { T: L.T }); cara(c, T, { expr: 'happy', mouth: 'open_smile' }); }
  else if (m === 'clap') { const j = Math.sin(L.T * 14 + i); actuar(c, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.2 - j * .25, aRz: -.2 - j * .25, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); cara(c, T, { expr: 'joy' }); }
  else if (m === 'sitb') { sit(c, x, o.seat ?? 2.4, z, ry, L, { aLx: .4, aRx: .4, aLe: .6, aRe: .6, headY: Math.sin(L.T * .9 + i) * .3 }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); }
  else if (m === 'sitcheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); sit(c, x, o.seat ?? 2.4, z, ry, L, { aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3 }); laughF(c, T); }
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); } }
// plano medio/entero de un personaje: cámara delante (yaw relativo a su ry), centro a la altura del pecho
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null, dy = 3.3) { const s = ch.spec.scale || 1, p = ch.root.position, c = V(p.x, p.y + dy * s, p.z); const q = easeInOut(clamp(k)); orbit(c, lerp(dist, dist2 ?? dist * .88, q) * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const _hb = new THREE.Box3(); function heightTo(ch, m) { ch.root.updateMatrixWorld(true); _hb.makeEmpty(); ch.root.traverseVisible(o => { if (o.isMesh && o !== ch.blob) _hb.expandByObject(o, false); }); const t = _hb.max.y - ch.root.position.y; ch.root.scale.multiplyScalar(m * M2U / t); return ch; }
const toCam = ch => { const p = ch.root.position; ch.root.rotation.y = Math.atan2(camera.position.x - p.x, camera.position.z - p.z); };
// ---------- escenarios por plano ----------
function lp(i, x, y, z, k = 40, col = 0xffb060, d = 60) { const l = LP[i]; l.position.set(x, y, z); l.intensity = k; l.color.setHex(col); l.distance = d; }
// ¿dentro de una parcela, un camino o el lago? (ahí no crece la hierba alta)
const NOGRASS = [];
function inPlot(x, z) { for (const [x0, z0, x1, z1] of NOGRASS) if (x > x0 && x < x1 && z > z0 && z < z1) return true; for (const [cx, cz, nx, nz] of DOERFER) { const dx = x - cx, dz = z - cz, hx = nx * 17 / 2 + 6, hz = nz * 17 / 2 + 6; if (Math.abs(dx) > hx + 20 || Math.abs(dz) > hz + 20) continue;
    if (Math.abs(dx) < 3.4 || Math.abs(dz) < 3.4) return true; if (Math.abs(dx) > hx || Math.abs(dz) > hz) continue; const ix = Math.floor(dx / 17 + nx / 2); if (Math.abs((ix + .5 - nx / 2) * 17) < 1) continue; const ux = ((dx / 17 + nx / 2) % 1 + 1) % 1, uz = ((dz / 17 + nz / 2) % 1 + 1) % 1; if (Math.abs(ux - .5) < .44 && Math.abs(uz - .5) < .44) return true; }
  if (Math.abs(x - FX) < 210 && z > 26) return true; if (Math.abs(x - FX) < 80 && Math.abs(z - 5) < 12) return true; return false; }
// hora dorada (como la referencia): sol bajo y cálido, cielo claro y largo
function gold() { day(); sun.color.setRGB(1, .78, .52); sun.intensity = 2.8; setSky([.22, .46, .86], [.62, .74, .92], [1, .84, .66]); hemi.color.setRGB(.9, .86, .8); scene.fog.color.setRGB(.96, .86, .74); scene.fog.density = .00045; rim.color.setRGB(1, .7, .45); SUNOFF.set(-70, 60, 110); }
function winter(L) { day(); setSky([.52, .6, .72], [.72, .78, .86], [.9, .92, .95]); sun.intensity = 1.4; sun.color.setRGB(.92, .95, 1); hemi.intensity = 1.25; hemi.color.setRGB(.9, .94, 1); scene.fog.color.setRGB(.86, .9, .95); scene.fog.density = .0022; BIRDSON = 0; POST.push(() => SNOW.userData.update(L.T, CAMT)); }
// el mundo: alrededor de (gx, gz) crece la hierba alta. o.dusk / o.gold / o.snow; o.grass = false sin hierba; las torres siempre al fondo
function welt(L, gx = 0, gz = 0, o = {}) { use('W'); WIESE.visible = true; if (o.grass !== false) GRASS.userData.at(gx, gz, inPlot, o.snow ? 1 : 0);
  if (o.snow) winter(L); else if (o.dusk) dusk(); else if (o.day) day(); else gold();
  RINGS.visible = o.rings !== false; TURM.visible = o.turm !== false; TURM2.visible = o.turm2 !== false; if (o.phi != null) setRope(o.phi); }
function setRope(phi) { ROPE.userData.set(phi); TURM.userData.anim(phi); TURM2.userData.anim(-phi); }
// la cuerda en un plano: su parte de abajo pasa por zc en el instante local tp, a velocidad v (hacia +z, hacia la cámara por defecto). Devuelve φ.
function cuerda(L, tp, zc = 0, v = 170) { const zb = zc + v * (L.lt - tp); const phi = Math.asin(clamp(-zb / AZ, -1, 1)); setRope(phi); return phi; }
// salto de alguien en z cuando le pasa la cuerda (mismos tp, zc, v): sube, recoge las piernas y cae flexionando
const JD = .66;
function salto(ch, L, tp, zc = 0, v = 170, J = 3.4, base = 0) { const z = ch.root.position.z, s = ch.spec.scale || 1; const d = L.lt - (tp + (z - zc) / v); let k = 0;
  if (Math.abs(d) < JD / 2) k = Math.cos(Math.PI * d / JD); const y = J * k * s; ch.root.position.y = base + y; ch.blob.position.y = .06 - y / s; ch.blob.scale.setScalar(1 - k * .4);
  const pre = clamp(1 - Math.abs(d + JD * .62) / .16), post = clamp(1 - Math.abs(d - JD * .62) / .16), c = Math.max(pre, post);
  return { k, pose: { lLx: .55 * k, lRx: .55 * k, lLk: 1.2 * k + c * .5, lRk: 1.2 * k + c * .5, aLx: .3 + .8 * k, aRx: .3 + .8 * k, aLz: .35 + .4 * k, aRz: .35 + .4 * k, aLe: .5, aRe: .5, lean: .12 * c, headX: .1 * c } }; }
// un vecino que salta: pose base + salto (+ cara)
function springer(c, x, z, ry, L, tp, zc, v, i = 0, o = {}) { put(c, x, o.y ?? 0, z, ry); const s = salto(c, L, tp, zc, v, o.J ?? 3.4, o.y ?? 0); actuar(c, 0, [[0, { ...(o.pose || {}), ...s.pose }]], { T: L.T + i * .3 }); if (o.spin) c.root.rotation.y = ry + s.k * 0 + (s.k > 0 ? (1 - Math.cos(Math.PI * s.k)) * Math.PI * (L.lt > tp ? 1 : 0) : 0);
  if (o.face !== false) cara(c, L.T + i, o.f || (s.k > .2 ? { expr: 'happy', mouth: 'open_smile' } : { expr: o.expr || 'neutral' })); return s; }
// el Rufer grita con la trompetilla delante de la boca
function rufen(ch, L, h = 0, k = 1, o = {}) { const H = attach(HORNS[h], ch.head, [0, -.15, .75], [0, 0, 0], .85); actuar(ch, 0, [[0, { aRx: 1.55, aRz: -.45, aRe: 1.95, aLx: 1.3, aLz: -.2, aLe: 1.6, lean: -.06 * k, headX: -.12 * k, ...(o.pose || {}) }]], { T: L.T }); cara(ch, L.T, { expr: 'shout', eyes: k > .5 ? 'squint' : 'normal', mouth: k > .5 ? 'scream' : 'open_smile', ...(o.f || {}) }); return H; }
// trompetilla colgada del hombro (sin gritar)
function hornHang(ch, h = 0) { attach(HORNS[h], ch.spine, [.95, .4, .55], [-.4, .3, -.6], .7); }
// gotas de un estornudo / de la sopa
function spray(list, c, dir, T0, T, n = 24, sp = 1, g = 9) { list.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 7 + 1), t = T - T0; if (t < 0 || t > 1) return; d.visible = true; d.position.set(c.x + (dir.x * (5 + r() * 6) + (r() - .5) * 3) * t * sp, c.y + (dir.y * 4 + (r() - .5) * 3) * t * sp - g * t * t, c.z + (dir.z * (5 + r() * 6) + (r() - .5) * 3) * t * sp); d.scale.setScalar(.6 + r() * .8); }); }
// muro de personas reales en la torre (para los primeros planos): filas una sobre los hombros de otra, brazos en cruz agarrando muñecas
// a: ángulo en la torre (π = cara que mira al pueblo); y0: altura de la fila de abajo; cada uno mira hacia fuera
function wand(L, list, a0, y0, rows, cols, o = {}) { const out = []; const sp = o.sp ?? 4.1, dy = o.dy ?? 5.6, sw = Math.sin(L.T * .7) * (o.lean ?? 1);
  let n = 0; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const ch = list[n++]; if (!ch) continue; const y = y0 + r * dy, R = tR(y); const a = a0 + ((c - (cols - 1) / 2) * sp + (r % 2) * sp * .5) / R; const p = turmPt(TX, y, a, -1, 1.6);
    put(ch, p.x, p.y, p.z, Math.atan2(Math.cos(a), Math.sin(a))); ch.blob.visible = false; actuar(ch, 0, [[0, { aLz: 1.45 + Math.sin(L.T * 2 + n) * .04, aRz: 1.45 + Math.cos(L.T * 2 + n) * .04, aLe: .1, aRe: .1, aLx: .1, aRx: .1, headZ: sw * .2, sx: sw * .3, lean: .04 }]], { T: L.T + n * .2, weight: false });
    cara(ch, L.T + n, o.face ? o.face(n) : { expr: n % 3 ? 'tired' : 'sad' }); out.push(ch); } return out; }
// ---------- gestos de esta pieza ----------
const PUSH = { aLx: 1.5, aRx: 1.5, aLe: .2, aRe: .2, aLz: .15, aRz: .15, lean: .32, lLx: -.4, lRx: .5, lRk: .3 };
const POINT = { aRx: 1.6, aRz: .05, aRe: .1, aLx: .3, aLz: -.2, lean: .05 };
const CATCH = { aLx: 1.3, aRx: 1.3, aLe: .9, aRe: .9, aLz: -.1, aRz: -.1, crouch: .2, lean: .1 };
const DXL = DX; const CR_ = DX;
const FACES = [];
function clearFaces() {}
// ---------- capa 2D ----------
const BAD_ = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD_.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD_.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
function bigNum(text, k, col = 'big', y = .2, sc = 1) { badge(col === 'white' ? 'big' : col, text, W / 2, H * y, k, 1, sc); }
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
const KEY = /^(Stadt|springen|neun|Sekunden|Alle|Leben|Seil|Welt|Gewitterwolken|verpasst|Bräute|Chirurgen|schlafen|Rücken|wach|warum|Stücken|Hochzeit|Sprung|Suppe|Leistungssport|Babys|Jahr|Spring|Knie|geboren|kommen|Welle|Rufer|Job|Kind|Nachrichten|Decken|Schnecken|Lotte|Drehung|schön|Freundin|niesen|spät|erwischt|Horizont|gedreht|vorausgegangen|Unglück|hingeschaut|Richtung|losgelaufen|Niemand|grüßen|Fischer|Ärmel|keiner|Menschen|Augen|Winter|Gürtel|Schals|Schnürsenkel|zusammengeknotet|Namen|Kleidern|Himmel|tausend|Arme|Mensch|Riese|Turm|Schultern|Handgelenken|links|rechts|Kurbel|Haus|Reihen|früh|Losgelassen|gewarnt|gelacht|Lebens|geradeaus|flachen|kennen|angefangen|Monster|andere|Einzige|Nachricht|Seiten|Mund|nie|Schnecke|los|nicht|raufgeklettert|Handgelenk|laut|Neunhundertachtundneunzig|Neunhundertneunundneunzig)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
let DARK = 0, TINT = null, SHAKE = 0, BW = 0, BLOOMMAX = .2; let HUD = null; const FX2D = [];
// ---------- a: gancho, el mundo, la boda, la sopa, los bebés, la ola y los Rufer (0 – 50,02 s) ----------
// Heimatdorf D1 en (0, 0): caminos en x = 0 (N-S) y z = 0 (E-O); las parcelas en x = ±17, ±34. La cuerda avanza hacia +z (hacia la cámara si yaw = 0).
// Pedestales de Rufer: D1.peds = (8.5, 8.5), (-8.5, -8.5), (25.5, -8.5), (-25.5, 8.5).
const VV = 120;   // velocidad de la cuerda en los planos normales (en el mundo es mucho más rápida: se «ve» a cámara lenta)
// nubarrones alrededor de la punta de la torre
const WOLKEN = P_(new THREE.Group()); { const r = RNG(19); const ms = [mat(0x5a6070, { roughness: 1 }), mat(0x4a5060, { roughness: 1 }), mat(0x6a7080, { roughness: 1 })]; for (let k = 0; k < 40; k++) { const a = r() * 6.28, d = 40 + r() * 110; const s = sphere(22 + r() * 26, ms[k % 3], WOLKEN, Math.cos(a) * d, (r() - .3) * 50, Math.sin(a) * d, 12, 8); s.castShadow = false; s.scale.y = .55; } }
const wolken = () => show(WOLKEN, TX - 30, 430, 0);
// parcela suelta para los primeros planos (mesa, cama, valla): en (PX, 0, PZ)
const PX = -140, PZ = 70; NOGRASS.push([PX - 8, PZ - 8, PX + 8, PZ + 24]); const PARC = P_(parcela(null, 0, 0, 7)); const ZAUN = P_(zaun(null, -6, 0, 6, 0));
// escoba y tablón
const BESEN = P_(new THREE.Group()); { cyl(.12, .12, 5, mat(0x9a6a3e), 6, BESEN, 0, 2.5, 0); const b = box(1.6, .9, .5, mat(0xd8b060, { roughness: 1 }), .1, BESEN, 0, .2, 0); }
const BRETT = P_(new THREE.Group()); box(4, .25, .7, mat(0xb8885a, { roughness: .8 }), .05, BRETT, 0, 0, 0);
const HAMMER = P_(new THREE.Group()); { cyl(.1, .1, 1.6, mat(0x9a6a3e), 6, HAMMER, 0, .8, 0); box(.7, .35, .35, mat(0x4a4a52, { metalness: .7 }), .05, HAMMER, 0, 1.6, 0); }
// vecinos que saltan: spots [[x, z, ry], …] con extras desde DX[from]
function vecinos(L, spots, tp, zc, v = VV, from = 0, o = {}) { spots.forEach(([x, z, ry], i) => { const c = DX[(from + i) % DX.length]; if (c.root.visible) return; springer(c, x, z, ry ?? 0, L, tp, zc, v, i + from, o); }); }
// fila de gente que levanta los brazos cuando le llega la ola de gritos (frente en zw, avanza hacia +z)
function ola(L, list, x0, z0, dz, zw, w = 14) { list.forEach((c, i) => { const z = z0 + i * dz, x = x0 + Math.sin(i * 2.3) * 3; put(c, x, 0, z, 0); const k = clamp(1 - Math.abs(z - zw) / w); actuar(c, 0, [[0, { aLx: 2.8 * k + .1, aRx: 2.8 * k + .1, aLz: .3 + .3 * k, aRz: .3 + .3 * k, aLe: .3, aRe: .3, headX: -.25 * k, lean: -.08 * k }]], { T: L.T + i * .2 }); cara(c, L.T + i, k > .3 ? { expr: 'shout', mouth: 'scream', eyes: 'squint' } : { expr: 'neutral' }); }); }
const SPOTS1 = [[-6, 4, .2], [6, 2, -.2], [-3, -6, .1], [4, -9, -.1], [-9, -14, .3], [8, -16, -.3], [-12, 12, .4], [11, 14, -.3], [0, -22, 0], [-15, -26, .2], [14, -28, -.2], [-4, -34, .1]];

// 1 «In dieser Stadt springen»: todo el pueblo salta a la vez; la cuerda de ropa llega barriendo el suelo hacia la cámara y pasa bajo sus pies (golpe de zoom en el 0)
shot(0, 'W', null, L => { welt(L, 0, 10); const tp = .5, zc = 6; cuerda(L, tp, zc, VV);
  springer(ich, 0, 6, 0, L, tp, zc, VV, 0, { f: { expr: 'happy', mouth: 'open_smile' } }); vecinos(L, SPOTS1, tp, zc, VV, 0);
  orbit(V(0, 4.6, 6), lerp(19, 15, easeOut(L.k)), .12, .06, 46); sh(V(0, 0, 2), 34); },
  [[0, 'zoom_fast', .6], [.3, 'rope_swish', .9], [.5, 'jump_crowd', .7], [.78, 'land_crowd', .5]]);
// 2 «springen wir alle»: desde arriba: la cuerda cruza el pueblo y todos saltan en ola según les llega
shot(.875, 'S', null, L => { welt(L, 0, 0); const tp = .45, zc = 0; cuerda(L, tp, zc, 90);
  vecinos(L, [...SPOTS1, [-20, 20, 0], [20, 22, 0], [-2, 30, 0], [24, 6, 0], [-24, -4, 0], [3, 16, 0], [-8, 26, 0], [9, -40, 0], [-16, -40, 0], [17, 34, 0], [-28, 30, 0], [28, -20, 0]], tp, zc, 90, 0, { J: 3 });
  orb(L.k, V(0, 0, -4), null, [70, .5, .72, 46], [62, .62, .78, 46]); sh(V(0, 0, 0), 60); }, [[.2, 'rope_swish', .7], [.4, 'jump_crowd', .7]]);
// 3 «neun Sekunden»: yo en el pedestal con la trompetilla; contador «9 SEKUNDEN»
shot(1.675, 'Z', 'punch', L => { welt(L, 8, 8); const p = D1.peds[0]; put(ich, p[0], 2.3, p[1], .3); rufen(ich, L, 0, clamp(L.lt / .2)); ich.blob.visible = false; cuerda(L, 2.6, 0, VV);
  vecinos(L, [[p[0] - 6, p[1] - 8, .3], [p[0] + 5, p[1] - 10, -.2]], 2.6, 0, VV, 12);
  onBody(ich, 13, .95, .1, 42, L.k, 11); bigNum('9 SEKUNDEN', clamp((L.lt - .15) / .2), 'gold', .19, 1.05); sh(V(p[0], 0, p[1]), 24); }, [[0, 'horn_blow', .6], [.15, 'pling', .4]]);
// 4 «Alle.»: otro pueblo entero en el aire a la vez, visto de lado entre la hierba alta
shot(2.70, 'C', null, L => { welt(L, -220, 152); const tp = .14, zc = 140; cuerda(L, tp, zc, 60);
  vecinos(L, [[-232, 140, .4], [-224, 141, .2], [-216, 139, 0], [-208, 141, -.2], [-200, 140, -.4], [-228, 132, .3], [-212, 131, -.1], [-236, 148, .5], [-204, 149, -.5], [-220, 150, 0]], tp, zc, 60, 14, { J: 3.6 });
  orbit(V(-218, 3.5, 141), lerp(24, 22, L.k), .05, .02, 44); sh(V(-218, 0, 141), 30); }, [[0, 'whoosh_down', .5], [.05, 'crowd_hey', .6]]);
// 5 «Unser ganzes»: una abuela salta con su chal y su bastón (toda la vida)
shot(2.962, 'W', null, L => { welt(L, -6, 22); const tp = .4, zc = 20; cuerda(L, tp, zc, VV); const s = springer(oma, -6, 20, .2, L, tp, zc, VV, 3, { J: 2.6, pose: { aRx: .4, aRe: .6 }, f: { expr: 'determined', mouth: 'grimace' } });
  vecinos(L, [[-12, 14, .3], [0, 13, -.2]], tp, zc, VV, 20); onBody(oma, 12, .15, .1, 42, L.k, 10.5); sh(V(-6, 0, 20), 22); }, [[.35, 'rope_swish', .6], [.4, 'jump', .5], [.7, 'land', .4]]);
// 6 «Leben lang.»: una madre salta con su bebé en brazos
shot(3.877, 'F', null, L => { welt(L, 5, 24); const tp = .3, zc = 22; cuerda(L, tp, zc, VV); springer(mutter, 5, 22, -.25, L, tp, zc, VV, 4, { pose: { aLx: 1.1, aRx: 1.1, aLe: 1.3, aRe: 1.3, aLz: -.35, aRz: -.35 }, f: { expr: 'smile' } });
  attach(BABYS[0], mutter.spine, [0, 1.05, 1.35], [0, 0, 0], .8); onBody(mutter, 11, -.1, .08, 42, L.k, 9.6); sh(V(5, 0, 22), 22); }, [[0, 'flash', .4], [.25, 'jump', .5], [.5, 'baby_coo', .5]]);
// 7 «Ein Seil fegt über die»: a ras de suelo fuera del pueblo: la cuerda viene barriendo la pradera hacia la cámara
shot(4.58, 'S', null, L => { welt(L, 70, 10, { day: false }); cuerda(L, .95, 18, 260);
  cm([70, 5, 34, 70, 1.6, -40, 44], [70, 5.4, 30, 70, 1.6, -40, 46], L.k); sh(V(70, 0, 0), 40); }, [[.2, 'rope_far', .8], [.85, 'rope_swish', 1]]);
// 8 «ganze Welt.»: desde muy alto: la cuerda es una línea que barre la pradera con los pueblos
shot(5.78, 'Z', null, L => { welt(L, 0, 0, { grass: false }); cuerda(L, .5, -60, 200);
  cm([60, 260, 360, 0, 0, -60, 46], [40, 300, 400, 0, 0, -80, 46], L.k); sh(V(0, 0, 0), 120); }, [[.1, 'wind', .5], [.3, 'rope_swish', .5]]);
// 9 «Und etwas, so hoch wie die Gewitterwolken,» (zoom lento): la torre en el horizonte, entre nubarrones; la cámara sube hacia la punta
shot(6.44, 'W', 'slow', L => { welt(L, 300, 0, { dusk: true, grass: false }); wolken(); setRope(-.5 + L.lt * .35);
  cm([340, 6, 40, TX, 150, 0, 40], [360, 10, 30, TX, 330, 0, 36], L.k); scene.fog.density = .00028; sh(V(400, 0, 0), 80); }, [[0, 'thunder', .5], [.6, 'wind', .5]]);
// 10 «schwingt es.»: la manivela gigante girando con la cuerda
shot(8.68, 'C', 'punch', L => { welt(L, XT - 100, 0, { grass: false, dusk: true, rings: false }); wolken(); setRope(1.2 + L.lt * 2.2); const h = wpos(TURM.userData.crank);
  cm([h.x - 70, h.y - 20, 70, h.x, h.y - 4, 0, 42], [h.x - 64, h.y - 16, 62, h.x, h.y - 4, 0, 42], L.k); sh(h, 60); }, [[0, 'crank', .8], [.4, 'creak', .6]]);
// 11 «Wer es verpasst,»: uno se agacha a atarse el cordón… la cuerda le llega por detrás
shot(9.60, 'W', null, L => { welt(L, 0, -30); const c = put(DX[3], 0, 0, -30, .5); const u = clamp((L.lt - .55) / .2);
  actuar(c, 0, [[0, { crouch: .55, lean: .55, headX: .4, aLx: 1.2, aRx: 1.2, aLe: .5, aRe: .5, lLx: .9, lLk: 1.4, lRx: .2, lRk: .6 }], [.6, { crouch: .2, lean: -.2, headX: -.3, aLx: 1, aRx: 1, aLz: .8, aRz: .8, aLe: 1.4, aRe: 1.4 }, { dur: .15 }]], { T: L.T });
  cara(c, L.T, u > .2 ? { eyes: 'terror', mouth: 'scream', noBlink: true } : { expr: 'neutral', eyes: 'down' }); cuerda(L, .95, -30, VV);
  vecinos(L, [[-7, -36, .3], [6, -38, -.2]], .95, -30, VV, 18); onBody(c, 12, .9, .1, 42, L.k, 10.5); sh(V(0, 0, -30), 22); }, [[.1, 'shoelace', .4], [.55, 'gasp', .5], [.85, 'rope_swish', .8]]);
// 12 «den nimmt das Seil mit.»: la cuerda se lo lleva enredado, dando vueltas, pradera adelante; la cámara le sigue de lado
shot(10.586, 'F', null, L => { welt(L, 0, -10); const v = 46, z = -30 + v * (L.lt + .15); cuerda(L, -.15, -30, v); const c = put(DX[3], 0, ropeY(z) + 1.4, z, 0); c.blob.visible = false; c.root.rotation.set(-.9 + L.lt * 5, 0, L.lt * 7);
  actuar(c, 0, [[0, { aLx: 2.6, aRx: 2.2, aLz: .9, aRz: .7, lLx: -.6, lRx: .8, lLk: 1, lRk: .4 }]], { T: L.T }); cara(c, L.T, { eyes: 'terror', mouth: 'scream', noBlink: true });
  vecinos(L, [[-8, -36, PI / 2], [8, -40, -PI / 2]], -.15, -30, v, 20, { f: { expr: 'shock', mouth: 'o' } }); cam([16, 5, z - 4], [0, 3, z], 44); sh(V(0, 0, z), 30); }, [[0, 'whoosh', .7], [.1, 'scream_far', .6], [.4, 'rope_drag', .6]]);
// 13 «Bräute springen.»: los novios saltan bajo el arco de flores (bajito), el velo vuela
shot(11.626, 'S', null, L => { welt(L, 0, -22); show(BOGEN, 0, 0, -24, 0, 1); const tp = .5, zc = -21; cuerda(L, tp, zc, VV);
  springer(braut, -1.7, -21, .25, L, tp, zc, VV, 0, { pose: { aRx: .9, aRz: -.6, aRe: .6 }, f: { expr: 'joy' } }); springer(braeut, 1.7, -21, -.25, L, tp, zc, VV, 1, { pose: { aLx: .9, aLz: -.6, aLe: .6 }, f: { expr: 'joy' } });
  orbit(V(0, 4.4, -21), lerp(15, 13, L.k), .15, .08, 44); if (L.lt > tp) confetti(V(0, 3, -21), L.t0 + tp, L.T, 36, .7); sh(V(0, 0, -22), 22); }, [[.4, 'rope_swish', .6], [.5, 'jump', .5], [.55, 'cheer_small', .5]]);
// 14 «Chirurgen springen.»: dos cirujanos saltan a los lados de la mesa de operaciones bajita; el paciente rebota dormido
shot(12.755, 'Z', null, L => { welt(L, -25, 2); show(OPT, -25, 0, 0, PI / 2); const tp = .45, zc = 0; cuerda(L, tp, zc, VV);
  springer(CH[0], -27.7, 0, PI / 2, L, tp, zc, VV, 0, { pose: { aLx: 1.2, aRx: 1.3, aLe: 1.2, aRe: 1.0 }, f: { eyes: 'squint', mouth: 'flat' } }); springer(CH[1], -22.3, 0, -PI / 2, L, tp, zc, VV, 1, { pose: { aLx: 1.3, aRx: 1.2, aLe: 1.0, aRe: 1.2 }, f: { eyes: 'normal', mouth: 'flat' } });
  const p = put(DX[5], -25, 1.45 + Math.max(0, Math.cos(PI * (L.lt - tp) / .4)) * (Math.abs(L.lt - tp) < .2 ? .6 : 0), 0, 0); p.root.position.z = 2.6; p.root.rotation.set(-PI / 2, 0, 0); p.blob.visible = false; cara(p, L.T, { eyes: 'closed', mouth: 'o' });
  orbit(V(-25, 3.4, 0), lerp(19, 17, L.k), .55, .3, 44); sh(V(-25, 0, 0), 22); }, [[.3, 'rope_swish', .6], [.45, 'jump', .6], [.55, 'beep_monitor', .4]]);
// 15 «Wir schlafen auf dem Rücken»: uno pasea con otro dormido a caballito (Zzz)
const caballito = (L, a, b, x, z, ry, tp, zc, v) => { const s = springer(a, x, z, ry, L, tp, zc, v, 0, { pose: { aLx: .4, aRx: .4, aLz: -.4, aRz: -.4, aLe: 1.6, aRe: 1.6, lean: .2 }, f: { expr: 'tired' } });
  attach(b.root, a.spine, [0, -1.5, -1.25], [.3, 0, 0], b.spec.scale / a.spec.scale); b.root.visible = true; b.blob.visible = false; applyPose(b, { lLx: 1.4, lRx: 1.4, lLk: 1.3, lRk: 1.3, aLx: 1.5, aRx: 1.5, aLz: -.5, aRz: -.5, aLe: .5, aRe: .5, headX: .3, headZ: .35 + Math.sin(L.T * 3) * .04 });
  cara(b, L.T, { eyes: 'closed', mouth: Math.sin(L.T * 2) > 0 ? 'o' : 'wavy', noBlink: true }); const h = hp(b); show(ZZZ[0], h.x + 1, h.y + 1.6 + (L.T % 1) * .8, h.z, 0, 1); return s; };
shot(13.783, 'W', null, L => { welt(L, 8, -12); caballito(L, DX[6], DX[7], 8 - L.lt * 2, -12, -.6, 9, 0, VV); vecinos(L, [[16, -20, -.3]], 9, 0, VV, 22);
  onBody(DX[6], 15, 1.1, .1, 42, L.k, 13); sh(V(8, 0, -12), 22); }, [[0, 'snore', .5], [.4, 'steps_grass', .4]]);
// 16 «von denen, die gerade wach sind.»: salta con él a cuestas; el dormido ni se entera
shot(14.663, 'F', null, L => { welt(L, -14, 18); const tp = .6, zc = 18; cuerda(L, tp, zc, VV); caballito(L, DX[8], DX[9], -14, 18, .3, tp, zc, VV);
  vecinos(L, [[-22, 12, .3], [-6, 11, -.3]], tp, zc, VV, 24); orbit(V(-14, 4.6, 18), lerp(17, 15, L.k), 1.3, .06, 44); sh(V(-14, 0, 18), 22); }, [[.5, 'rope_swish', .6], [.6, 'jump', .5], [.7, 'snore', .5]]);
// 17 «Gefragt, warum,»: un niño señala la torre del horizonte; su madre le tapa la boca
shot(16.259, 'C', null, L => { welt(L, 20, 10); const k = put(DX[10], 18, 0, 10, .9); k.root.scale.setScalar(.62); actuar(k, 0, [[0, { aRx: 1.7, aRz: .1, aRe: .1, headX: -.2 }]], { T: L.T }); cara(k, L.T, { expr: 'confused', mouth: L.lt < .35 ? 'talk' : 'o' });
  const m = put(mutter, 21, 0, 9, -.2); actuar(m, 0, [[0, {}], [.3, { aRx: 1.7, aRz: -.9, aRe: 1.6, lean: .2, headX: .2 }, { dur: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'worried', eyes: 'side_l' });
  orbit(V(19.5, 3.4, 9.5), lerp(14, 12.5, L.k), .45, .08, 42); sh(V(19.5, 0, 9.2), 20); }, [[.05, 'kid_hm', .5], [.35, 'shush', .6]]);
// 18 «hat es noch nie jemand.»: los mayores se encogen de hombros y miran al suelo
shot(16.939, 'S', null, L => { welt(L, 0, -38); [[DX[11], -4, -40, .4], [DX[12], 0, -42, .1], [DX[13], 4, -40, -.3], [oma, 0, -37, 0]].forEach(([c, x, z, r], i) => { put(c, x, 0, z, r); actuar(c, 0, [[0, {}], [.2 + i * .1, i % 2 ? 'shrug' : { headX: .45, aLz: .1, aRz: .1, lean: .1 }, { dur: .3 }]], { T: L.T + i }); cara(c, L.T + i, { expr: i % 2 ? 'confused' : 'sad', eyes: i % 2 ? undefined : 'down' }); });
  orbit(V(0, 3.6, -39.5), lerp(17, 15, L.k), .05, .1, 44); sh(V(0, 0, -40), 22); }, [[.2, 'cloth', .4], [.5, 'sigh', .4]]);
// 19 «Hier dauert alles neun Sekunden.»: alguien barre, salta y sigue barriendo; reloj 9→1
shot(18.205, 'W', null, L => { welt(L, 12, 26); const tp = 1.05, zc = 26; cuerda(L, tp, zc, VV); const c = DX[14]; const s = springer(c, 12, 26, -.3, L, tp, zc, VV, 0, { pose: { aLx: .9 + Math.sin(L.T * 9) * .3, aRx: .7 + Math.sin(L.T * 9) * .3, aLe: .6, aRe: .5, aLz: -.3, aRz: -.1, lean: .15 } });
  attach(BESEN, c.aR.hand, [0, -.4, .3], [1.3 + Math.sin(L.T * 9) * .3, 0, 0], .9); dust(V(12, 0, 28), L.t0, L.T, 6, .4);
  onBody(c, 14, .3, .1, 42, L.k, 12.5, null, 2.6); badge('gold', '0:0' + Math.max(1, 9 - Math.floor(L.lt * 6)), W * .76, H * .1, clamp(L.lt / .15)); sh(V(12, 0, 26), 22); }, [[0, 'broom', .5], [.5, 'tick', .4], [1.0, 'jump', .5]]);
// 20 «Oder es passiert in Stücken.»: uno clava la valla tabla a tabla, entre salto y salto
shot(19.785, 'Z', null, L => { welt(L, PX, PZ + 8); show(ZAUN, PX, 0, PZ + 6); const c = put(DX[15], PX + 2, 0, PZ + 8.5, PI - .2); const hit = Math.sin(L.T * 10);
  actuar(c, 0, [[0, { aRx: 1.6 + hit * .7, aRe: .8, aLx: 1.1, aLe: .6, crouch: .25, lean: .3, headX: .3 }]], { T: L.T }); attach(HAMMER, c.aR.hand, [0, -.4, .2], [1.4, 0, 0], .9); cara(c, L.T, { expr: 'determined' });
  show(BRETT, PX + 1, 1.3, PZ + 6.2, 0); onBody(c, 12, .45, .14, 42, L.k, 10.5); sh(V(PX, 0, PZ + 7), 20); }, [[.1, 'hammer', .6], [.45, 'hammer', .6], [.8, 'hammer', .6]]);
// boda: arco en (0, -24); novios en (∓1,7, -21); la Standesbeamtin con su libro detrás; invitados sentados en el suelo
function boda(L, o = {}) { welt(L, 0, -18); show(BOGEN, 0, 0, -24, 0, 1); const bt = put(beamtin, 0, 0, -25.5, 0); actuar(bt, 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); cara(bt, L.T, { expr: 'smile' }); attach(DECKE, bt.aR.hand, [0, -.3, .5], [0, 0, 0], .4);
  [[-7, -14, .5], [-4, -13, .3], [4, -13, -.3], [7, -14, -.5], [-6, -10, .4], [6, -10, -.4]].forEach(([x, z, r], i) => { const c = DX[16 + i]; if (o.jump != null) springer(c, x, z, r + PI, L, o.jump, -18, VV, i, { f: { expr: 'joy' } }); else { sit(c, x, .9, z, r + PI, L, { aLx: .4, aRx: .4 }); cara(c, L.T + i, { expr: 'smile' }); } }); }
// 21 «Eine Hochzeit geht so:»: la boda entera, bajita, en la pradera
shot(21.254, 'W', null, L => { boda(L); put(braut, -1.7, 0, -21, PI + .3); put(braeut, 1.7, 0, -21, PI - .3); for (const c of [braut, braeut]) { actuar(c, 0, [[0, { aLx: .3, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy' }); }
  orb(L.k, V(0, 3.4, -20), null, [22, PI + .5, .2, 44], [20, PI + .3, .16, 44]); sh(V(0, 0, -20), 26); }, [[0, 'birds', .4], [.3, 'organ_soft', .4]]);
// 22 «„Ja, ich will.“»: la novia lo dice emocionada
shot(22.444, 'C', null, L => { boda(L); const b = put(braut, -1.7, 0, -21, PI + .45); actuar(b, 0, [[0, { aLx: .6, aRx: .6, aLe: 1.3, aRe: 1.3, aLz: -.3, aRz: -.3 }]], { T: L.T }); talk(b, L.T, 22.4, 23.1, 'happy'); put(braeut, 1.7, 0, -21, PI - .45); cara(braeut, L.T, { expr: 'smile' });
  onFace(b, 6, -.4, .6, 40, L.k, 5.4); sh(V(0, 0, -21), 16); }, [[0, 'sparkle', .3]]);
// 23 «Sprung.»: los dos y todos los invitados saltan
shot(23.276, 'F', 'punch', L => { boda(L, { jump: .2 }); cuerda(L, .2, -21, VV); springer(braut, -1.7, -21, PI + .2, L, .2, -21, VV, 0, { f: { expr: 'joy' } }); springer(braeut, 1.7, -21, PI - .2, L, .2, -21, VV, 1, { f: { expr: 'joy' } });
  orbit(V(0, 4, -18), 20, PI + .1, .05, 46); sh(V(0, 0, -20), 26); }, [[.1, 'rope_swish', .7], [.2, 'jump_crowd', .7]]);
// 24 «„Ich auch.“»: el novio, con una sonrisa enorme
shot(23.791, 'C', null, L => { boda(L); const g = put(braeut, 1.7, 0, -21, PI - .45); actuar(g, 0, [[0, { aRx: .5, aRz: -.2, aRe: 1 }]], { T: L.T }); talk(g, L.T, 23.75, 24.3, 'happy'); put(braut, -1.7, 0, -21, PI + .45); cara(braut, L.T, { expr: 'joy' });
  onFace(g, 6, -.4, -.6, 40, L.k, 5.4); sh(V(0, 0, -21), 16); }, [[0, 'sparkle', .3]]);
// 25 «Sprung.»: desde el suelo: los novios en el aire de la mano, confeti, la cuerda bajo ellos
shot(24.511, 'W', null, L => { boda(L, { jump: .15 }); cuerda(L, .15, -21, VV); springer(braut, -1.4, -21, PI + .5, L, .15, -21, VV, 0, { pose: { aRx: 1.6, aRz: -.4 }, f: { expr: 'joy' } }); springer(braeut, 1.4, -21, PI - .5, L, .15, -21, VV, 1, { pose: { aLx: 1.6, aLz: -.4 }, f: { expr: 'joy' } });
  confetti(V(0, 2, -21), L.t0, L.T, 40, .8); cm([10, 1.4, -25, 0, 5.6, -21, 48], [9.4, 1.6, -24.4, 0, 5.8, -21, 46], L.k); sh(V(0, 0, -21), 20); }, [[.05, 'jump', .6], [.15, 'cheer_small', .6]]);
// 26 «Suppe essen ist Leistungssport.»: uno salta con el cuenco y la cuchara en la boca; la sopa vuela
shot(24.968, 'S', null, L => { welt(L, 22, 2); const tp = .8, zc = 2; cuerda(L, tp, zc, VV); const c = suppeM; const s = springer(c, 22, 2, -.4, L, tp, zc, VV, 0, { pose: { aLx: 1.2, aLe: 1.5, aLz: -.4, aRx: 1.8, aRz: -.5, aRe: 2.1, headX: .1 }, f: { expr: 'determined', mouth: 'o' } });
  attach(SUPPE, c.aL.hand, [0, -.5, .5], [0, 0, 0], 1); if (L.lt > tp - .1) spray(SPLASH, wpos(SUPPE).add(V(0, .5, 0)), V(0, 1, .3), L.t0 + tp - .1, L.T, 22, .8, 10);
  onBody(c, 11, .3, .08, 42, L.k, 9.8); sh(V(22, 0, 2), 20); }, [[.1, 'slurp', .6], [.75, 'jump', .5], [.8, 'splash', .7], [1.2, 'land', .4]]);
// 27 «Babys tragen wir»: una madre lleva al bebé en brazos mientras salta
shot(26.684, 'W', null, L => { welt(L, -12, 30); const tp = .55, zc = 30; cuerda(L, tp, zc, VV); springer(mutter, -12, 30, .3, L, tp, zc, VV, 0, { pose: { aLx: 1.1, aRx: 1.1, aLe: 1.3, aRe: 1.3, aLz: -.35, aRz: -.35 }, f: { expr: 'warm' } });
  attach(BABYS[0], mutter.spine, [0, 1.05, 1.35], [0, 0, 0], .8); orbit(V(-12, 4, 30), lerp(13, 11, L.k), .5, .1, 42); sh(V(-12, 0, 30), 20); }, [[.5, 'jump', .5], [.6, 'baby_coo', .4]]);
// 28 «ein ganzes Jahr lang.»: un padre también, con el «1 JAHR»
shot(27.964, 'Z', null, L => { welt(L, 14, 30); const tp = .2, zc = 30; cuerda(L, tp, zc, VV); springer(DX[22], 14, 30, -.3, L, tp, zc, VV, 0, { pose: { aLx: 1.1, aRx: 1.1, aLe: 1.3, aRe: 1.3, aLz: -.35, aRz: -.35 }, f: { expr: 'tired' } });
  attach(BABYS[1], DX[22].spine, [0, 1.05, 1.35], [0, 0, 0], .8); onBody(DX[22], 11, -.2, .1, 42, L.k, 9.6); bigNum('1 JAHR', clamp((L.lt - .05) / .15), 'gold', .19, 1.1); sh(V(14, 0, 30), 20); }, [[.15, 'jump', .5], [.05, 'pling', .4]]);
// 29 «Dann lernen sie es.»: un niño pequeñito da su primer salto torpe; los padres aplauden
shot(28.364, 'C', null, L => { welt(L, 0, 34); const tp = .55, zc = 34; cuerda(L, tp, zc, 80); const k = DX[23]; springer(k, 0, 34, 0, L, tp, zc, 80, 0, { J: 2.2, pose: { aLx: 1.2, aRx: 1.2, aLz: .6, aRz: .6 }, f: L.lt > tp ? { expr: 'joy' } : { expr: 'worried', mouth: 'o' } }); k.root.scale.setScalar(.48);
  for (const [c, x, r] of [[mutter, -4, .4], [DX[22], 4, -.4]]) { put(c, x, 0, 31, r); crowdGuy(c, x, 31, L, 1, { mode: 'clap', ry: r }); }
  orbit(V(0, 2.6, 33.5), lerp(13, 11.5, L.k), 0, .1, 42); sh(V(0, 0, 33), 18); }, [[.5, 'jump_small', .5], [.75, 'clap', .6]]);
// 30 «Ihr erstes Wort ist»: el bebé en brazos abre la boca; la madre se acerca a escuchar
shot(29.513, 'W', null, L => { welt(L, -6, 14); const m = put(mutter, -6, 0, 14, .3); actuar(m, 0, [[0, { aLx: 1.1, aRx: 1.1, aLe: 1.3, aRe: 1.3, aLz: -.35, aRz: -.35, headX: .35, lean: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'warm' });
  const b = attach(BABYS[0], m.spine, [0, 1.05, 1.35], [0, 0, .15], .8); b.userData.mouth.scale.y = 1 + clamp((L.lt - .5) / .2) * 2.5;
  onBody(m, 9, .15, .05, 40, L.k, 8, null, 4.6); sh(V(-6, 0, 14), 16); }, [[.3, 'baby_coo', .5]]);
// 31 «„Spring!“»: ¡el bebé lo grita! burbuja «SPRING!»; la madre, con los ojos como platos
shot(30.433, 'C', 'punch', L => { welt(L, -6, 14); const m = put(mutter, -6, 0, 14, .3); actuar(m, 0, [[0, { aLx: 1.1, aRx: 1.1, aLe: 1.3, aRe: 1.3, aLz: -.35, aRz: -.35, lean: -.1 }]], { T: L.T }); cara(m, L.T, { eyes: 'wide', mouth: 'open_smile', noBlink: true });
  const b = attach(BABYS[0], m.spine, [0, 1.05, 1.35], [0, 0, .15], .8); b.userData.mouth.scale.set(1.6, 4, 1); const bp = wpos(b); BAD_.push({ kind: 'bubble', text: 'SPRING!', w3: bp.clone().add(V(0, 3, 0)), s: spring(clamp(L.lt / .12) * 1.6) * 1.2, a: 1, on: true });
  onBody(m, 7, .1, 0, 38, L.k, 6.2, null, 4.8); sh(V(-6, 0, 14), 16); }, [[0, 'baby_shout', .8], [.1, 'pop', .5]]);
// 32-34 «Kein Tisch, kein Bett, kein Zaun»: primeros planos a ras de suelo: la mesita, la cama, la valla
shot(31.242, 'S', null, L => { welt(L, PX, PZ); show(PARC, PX, 0, PZ, 0); cm([PX + 3, 1.4, PZ + 7, PX + 3, 1, PZ + 2, 38], [PX + 4.4, 1.6, PZ + 6.4, PX + 3, 1, PZ + 2, 38], L.k); sh(V(PX, 0, PZ), 14); }, [[0, 'tap', .4]]);
shot(32.002, 'S', null, L => { welt(L, PX, PZ); show(PARC, PX, 0, PZ, 0); cm([PX - 1, 1.6, PZ + 4, PX - 3, .8, PZ - 2.6, 40], [PX - .2, 1.8, PZ + 3.6, PX - 3, .8, PZ - 2.6, 40], L.k); sh(V(PX, 0, PZ), 14); }, [[0, 'cloth', .4]]);
shot(32.617, 'S', null, L => { welt(L, PX, PZ + 8); show(PARC, PX, 0, PZ, 0); show(ZAUN, PX, 0, PZ + 10); cm([PX - 4, 1.4, PZ + 15, PX, 1, PZ + 10, 40], [PX - 2.6, 1.6, PZ + 15, PX, 1, PZ + 10, 40], L.k); sh(V(PX, 0, PZ + 10), 14); }, [[0, 'wood_knock', .4]]);
// 35 «ist bei uns höher als ein Knie.»: yo junto a la valla y la mesa: todo me llega por la rodilla; marca «KNIE»
shot(33.197, 'Z', null, L => { welt(L, PX, PZ + 8); show(PARC, PX, 0, PZ, 0); show(ZAUN, PX, 0, PZ + 10); const c = put(ich, PX + 1.5, 0, PZ + 12, 0); actuar(c, 0, [[0, { aRx: .4, aRz: .1, headX: .35, aLx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'smile', eyes: 'down' });
  orbit(V(PX + 1, 3.4, PZ + 11), lerp(15, 12.5, L.k), -.35, .06, 44); badge3('tag', 'KNIE', V(PX + 1.5, 2, PZ + 12.6), clamp((L.lt - .2) / .2)); sh(V(PX, 0, PZ + 10), 18); }, [[.2, 'pop', .5]]);
// 36 «Das Seil hat sich schon gedreht,»: hace siglos (sepia): gente de antes saltando igual
shot(34.832, 'F', null, L => { welt(L, -40, -20, { dusk: true }); const tp = .7, zc = -20; cuerda(L, tp, zc, VV); vecinos(L, [[-46, -20, .2], [-40, -22, 0], [-34, -20, -.2], [-43, -26, .1], [-37, -27, -.1]], tp, zc, VV, 24, { f: { expr: 'neutral' } });
  grade.uniforms.sepia.value = .85; BW = .5; orbit(V(-40, 4, -22), lerp(20, 17, L.k), .2, .08, 44); sh(V(-40, 0, -22), 26); }, [[0, 'old_film', .5], [.6, 'rope_swish', .5]]);
// 37 «lange bevor irgendjemand geboren wurde.»: la torre, sepia, girando ya entonces
shot(36.372, 'W', null, L => { welt(L, 600, 0, { dusk: true, grass: false }); wolken(); setRope(2 + L.lt * .5); grade.uniforms.sepia.value = .85; BW = .5; cm([700, 30, 260, TX, 200, 0, 44], [720, 34, 240, TX, 210, 0, 42], L.k); sh(V(TX, 0, 0), 80); }, [[.2, 'crank', .5], [.5, 'old_film', .4]]);
// 38 «Wir sehen es kommen.»: yo en el pedestal mirando al horizonte con la mano de visera; a lo lejos la cuerda se acerca levantando polvo
shot(38.472, 'C', null, L => { welt(L, -8, -8); const p = D1.peds[1]; const c = put(ich, p[0], 2.3, p[1], PI); c.blob.visible = false; hornHang(c, 0); actuar(c, 0, [[0, { aRx: 2.4, aRz: -.6, aRe: 2.3, headX: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', eyes: 'squint' });
  cuerda(L, 3.5, p[1], 300); onBody(c, 12, .6, .02, 42, L.k, 10.5); sh(V(p[0], 0, p[1]), 20); }, [[0, 'wind', .5], [.3, 'rope_far', .6]]);
// 39 «Wir hören es kommen.»: la mano en la oreja; el zumbido se acerca (ondas)
shot(39.521, 'S', null, L => { welt(L, -8, -8); const p = D1.peds[1]; const c = put(ich, p[0], 2.3, p[1], PI - .6); c.blob.visible = false; hornHang(c, 0); actuar(c, 0, [[0, GEST.listen]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'side_l' });
  for (let k = 0; k < 3; k++) { const q = ((L.lt * 1.4 + k / 3) % 1); FX2D.push(x => { x.save(); x.strokeStyle = `rgba(255,255,255,${(1 - q) * .7})`; x.lineWidth = 10; x.beginPath(); x.arc(W * .3, H * .4, 60 + q * 300, -1, 1); x.stroke(); x.restore(); }); }
  onFace(c, 7, -.6, 1.6, 40, L.k, 6); sh(V(p[0], 0, p[1]), 16); }, [[0, 'rope_far', .7]]);
// 40 «Ganz weit weg schreien die Leute»: en el pueblo de al lado, todos con los brazos arriba gritando
shot(40.617, 'W', null, L => { welt(L, -220, 140); ola(L, DX.slice(0, 10), -220, 128, 2.4, 160, 60);
  cm([-205, 6, 175, -222, 4, 138, 30], [-208, 6, 170, -222, 4, 138, 28], L.k); sh(V(-220, 0, 140), 30); }, [[.1, 'crowd_far_shout', .8]]);
// 41 «„Spring!“»: más cerca: la gente grita «SPRING!»
shot(41.997, 'C', 'punch', L => { welt(L, -220, 140); [[DX[10], -224, 140, .2], [DX[11], -219, 141, 0], [DX[12], -214, 140, -.2], [oma, -221, 136, .1]].forEach(([c, x, z, r], i) => { put(c, x, 0, z, r); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, aLe: .3, aRe: .3, headX: -.2 }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'shout', mouth: 'scream', eyes: 'squint' }); });
  orbit(V(-219, 4.4, 139), lerp(16, 14, L.k), 0, .06, 44); badge('red', 'SPRING!', W / 2, H * .2, clamp(L.lt / .12), 1, 1.2); sh(V(-219, 0, 139), 20); }, [[0, 'crowd_shout', 1]]);
// 42 «Und der Schrei rollt auf uns zu»: desde arriba: una ola de brazos levantados cruza la pradera hacia el pueblo
shot(43.113, 'Z', null, L => { welt(L, -100, 60); ola(L, DX, -100, -10, 5.2, -10 + L.lt * 90, 18);
  cm([-30, 70, 120, -100, 0, 60, 46], [-40, 64, 110, -100, 0, 70, 44], L.k); sh(V(-100, 0, 60), 80); }, [[0, 'crowd_wave', .9]]);
// 43 «wie eine Welle.»: a ras de suelo, la ola de gente pasa junto a la cámara
shot(44.533, 'W', null, L => { welt(L, -100, 60); ola(L, DX, -100, 20, 3.2, 20 + L.lt * 60, 9);
  cm([-90, 3, 70, -100, 4, 30, 44], [-90, 3.4, 66, -100, 4.4, 30, 44], L.k); sh(V(-100, 0, 50), 30); }, [[0, 'crowd_wave', .9], [.4, 'whoosh_soft', .4]]);
// 44 «Die Rufer geben ihn weiter.»: tres Rufer en sus pedestales, uno tras otro, con trompetillas
shot(45.482, 'S', null, L => { welt(L, 0, -30); [[DX[2], -14, -40], [DX[4], 0, -30], [DX[6], 14, -20]].forEach(([c, x, z], i) => { put(c, x, 2.3, z, -.4); c.root.scale.setScalar(.72); c.blob.visible = false; const on = clamp((L.lt - i * .3) / .15) * clamp((i * .3 + .45 - L.lt) / .1 + 1);
    if (on > .1) rufen(c, L, i + 1, on); else { actuar(c, 0, [[0, { aRx: .3 }]], { T: L.T }); hornHang(c, i + 1); cara(c, L.T, { expr: 'determined' }); } });
  PEDS.forEach((p, i) => show(p, [-14, 0, 14][i], 0, [-40, -30, -20][i]));
  cm([30, 9, -2, -2, 4, -30, 44], [26, 9, -6, 2, 4, -30, 44], L.k); sh(V(0, 0, -30), 30); }, [[0, 'horn_blow', .6], [.3, 'horn_blow', .6], [.6, 'horn_blow', .6]]);
const PEDS = [0, 1, 2].map(() => P_(sockel(null, 0, 0)));
// 45 «Ich bin einer davon.»: yo en mi pedestal, la trompetilla al hombro, orgulloso
shot(46.801, 'C', null, L => { welt(L, 8, 8); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], .1); c.blob.visible = false; hornHang(c, 0); actuar(c, 0, [[0, { aLx: .3, aLz: .7, aLe: 1.9, aRx: .3, aRz: .7, aRe: 1.9, lean: -.08, headX: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smile' });
  orbit(V(p[0], 5.6, p[1]), lerp(13, 10.5, L.k), .05, .02, 42); sh(V(p[0], 0, p[1]), 18); }, [[0, 'sparkle', .4]]);
// 46 «Der wichtigste Job,»: grito «SPRING!» por la trompetilla (golpe de zoom)
shot(47.918, 'Z', 'punch', L => { welt(L, 8, 8); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], .1); c.blob.visible = false; rufen(c, L, 0, clamp(L.lt / .1));
  onFace(c, 6.5, -.4, -5.2, 40, L.k, 5.4); sh(V(p[0], 0, p[1]), 16); }, [[0, 'horn_blow', .8], [.05, 'shout_kid', .7]]);
// 47 «den ein Kind haben kann.»: desde detrás de mí: el pueblo entero salta a mi señal
shot(49.118, 'W', null, L => { welt(L, 0, 0); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], PI + .3); c.blob.visible = false; rufen(c, L, 0, .8); const tp = .5, zc = -6; cuerda(L, tp, zc, VV);
  vecinos(L, [[4, -4, .3], [-2, -6, .1], [10, -8, -.2], [-8, -12, .2], [2, -14, 0], [14, -16, -.3], [-12, -20, .2], [6, -24, 0], [-4, -26, .1]], tp, zc, VV, 0, { pose: {} });
  cm([p[0] + 3, 9, p[1] + 9, p[0] - 4, 3, p[1] - 20, 46], [p[0] + 2.4, 9.4, p[1] + 8, p[0] - 4, 3, p[1] - 22, 46], L.k); sh(V(0, 0, -10), 30); }, [[.4, 'rope_swish', .6], [.5, 'jump_crowd', .6]]);
// ---------- b: los mensajes, los caracoles, Lotte, el estornudo, «vorausgegangen», el viaje y el pescador (50,02 – 100,68 s) ----------
// salto con pirueta (Lotte): gira 360° mientras está en el aire
function drehSprung(ch, L, tp, zc, v, ry, o = {}) { const s = springer(ch, ch === lotte ? o.x : o.x, o.z, ry, L, tp, zc, v, 0, o); const z = o.z, d = L.lt - (tp + (z - zc) / v), u = clamp((d + JD / 2) / JD);
  ch.root.rotation.y = ry + easeInOut(u) * Math.PI * 2 * (o.turns ?? 1); for (const b of [ch.aL, ch.aR]) b.sh.rotation.y = 0; return s; }
// pedestal suelto (sockel) para escenas fuera de D1
const PED2 = [0, 1, 2].map(() => P_(sockel(null, 0, 0)));
const SNOWDISC = P_(new THREE.Mesh(new THREE.CircleGeometry(90, 40), mat(0xf2f6fc, { roughness: .8 }))); SNOWDISC.rotation.x = -Math.PI / 2; SNOWDISC.receiveShadow = true;
// lazo rojo de Lotte (lo que queda de ella)
const LAZO = P_(new THREE.Group()); { const m = mat(0xd8202a, { roughness: .5 }); for (const s of [-1, 1]) { const b = box(.7, .45, .2, m, .1, LAZO, s * .4, 0, 0); b.rotation.z = s * .5; } sphere(.18, m, LAZO, 0, 0, 0, 8, 6); box(.18, .8, .1, m, .04, LAZO, -.15, -.5, 0).rotation.z = .3; }
const STEIN = P_(new THREE.Group()); { const st = mat(0xa8a090, { roughness: .9 }); const k = box(2.4, 1.2, 1.6, st, .4, STEIN, 0, .6, 0); }
const BUNDLE = P_(new THREE.Group()); { cyl(.1, .1, 6, mat(0x8a5a32), 6, BUNDLE, 0, 0, 0).rotation.z = Math.PI / 2; const b = sphere(1, mat(0xd8323a, { roughness: 1 }), BUNDLE, 2.8, -.6, 0, 10, 8); b.scale.set(1, .9, 1); for (let k = 0; k < 12; k++) sphere(.12, mat(0xffffff), b, Math.cos(k) * .9, Math.sin(k * 2) * .5, Math.sin(k) * .9, 5, 4); }
// las dos manos del pescador agarrando la manga (a la altura del codo)
function agarrar(a, b) { const e = wpos(b.aL.el); return e; }

// 48 «Auch Nachrichten reisen mit der Welle.»: un Rufer grita un mensaje al siguiente («MORGEN REGEN!»)
shot(50.019, 'S', null, L => { welt(L, -60, -60); const pA = [-64, -60], pB = [-48, -76]; show(PED2[0], pA[0], 0, pA[1]); show(PED2[1], pB[0], 0, pB[1]);
  const a = put(DX[2], pA[0], 2.3, pA[1], .8); a.root.scale.setScalar(.72); a.blob.visible = false; rufen(a, L, 1, 1); BAD_.push({ kind: 'bubble', text: 'MORGEN REGEN!', w3: hp(a).add(V(0, 3, 0)), s: spring(clamp(L.lt / .15) * 1.6), a: 1, on: true });
  const b = put(DX[4], pB[0], 2.3, pB[1], -2.4); b.root.scale.setScalar(.72); b.blob.visible = false; actuar(b, 0, [[0, GEST.listen]], { T: L.T }); hornHang(b, 2); cara(b, L.T, { expr: 'confused' });
  onBody(a, 15, 1.0, .06, 44, L.k, 13); sh(V(pA[0], 0, pA[1]), 24); }, [[0, 'horn_blow', .7], [.15, 'shout_kid', .6]]);
// 49 «Aber sie kommen nicht immer gleich an.»: el siguiente lo repite mal: «MORGEN … SEGEN?»
shot(51.625, 'W', null, L => { welt(L, -48, -76); const pB = [-48, -76]; show(PED2[1], pB[0], 0, pB[1]); const b = put(DX[4], pB[0], 2.3, pB[1], .3); b.root.scale.setScalar(.72); b.blob.visible = false; rufen(b, L, 2, clamp(L.lt / .2), { f: { eyes: 'squint', mouth: 'grimace' } });
  BAD_.push({ kind: 'bubble', text: 'MORGEN … SEGEN?', w3: hp(b).add(V(0, 3, 0)), s: spring(clamp((L.lt - .2) / .15) * 1.6), a: 1, on: L.lt > .2 });
  onFace(b, 8, -.4, 2, 40, L.k, 6.5); sh(V(pB[0], 0, pB[1]), 18); }, [[.2, 'horn_blow', .6], [.6, 'wrong_buzz', .4]]);
// 50 «Letzten Winter hat jemand gerufen:»: un pueblo lejano bajo la nieve; un Rufer tiritando grita por su trompetilla
shot(53.144, 'F', null, L => { welt(L, -300, -260, { snow: true, grass: false }); show(SNOWDISC, -300, .08, -256); show(PED2[0], -300, 0, -252); const a = put(DX[5], -300, 2.3, -252, .4); a.blob.visible = false; rufen(a, L, 1, .9, { f: { eyes: 'squint', mouth: 'grimace' } });
  a.root.position.x += Math.sin(L.T * 40) * .05; for (const [c, x, z] of [[DX[6], -308, -262], [DX[7], -292, -264]]) { put(c, x, 0, z, .3); actuar(c, 0, [[0, GEST.hug_self]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'wavy' }); c.root.position.x += Math.sin(L.T * 35 + x) * .05; }
  onBody(a, 16, .3, .08, 44, L.k, 14); sh(V(-300, 0, -255), 24); }, [[0, 'wind_cold', .7], [.4, 'shiver', .4]]);
// 51 «„Schickt mehr Decken!“»: la burbuja con las mantas
shot(54.884, 'C', 'punch', L => { welt(L, -300, -260, { snow: true, grass: false }); show(SNOWDISC, -300, .08, -256); show(PED2[0], -300, 0, -252); const a = put(DX[5], -300, 2.3, -252, .4); a.blob.visible = false; rufen(a, L, 1, 1);
  show(DECKE, -297.5, 9.6 + Math.sin(L.T * 3) * .2, -249, L.T, 1.0); onFace(a, 9, .2, 3, 42, L.k, 7.5); badge('tag', 'SCHICKT MEHR DECKEN!', W / 2, H * .15, clamp(L.lt / .12), 1, 1.15); sh(V(-300, 0, -252), 18); }, [[0, 'horn_blow', .8], [.05, 'shout_man', .6]]);
// 52 «Bei uns kamen»: llega un carro… lleno de caracoles; los vecinos se miran
shot(56.216, 'W', null, L => { welt(L, 0, 20); const x = 6 - L.lt * 3; show(KARREN, x, 0, 20, 0); const p = put(DX[12], x + 5.4, 0, 20, -PI / 2); actuar(p, 0, [[0, { ...walkP(L.T, 0), ...PUSH }]], { T: L.T }); cara(p, L.T, { expr: 'smile' });
  SNAILS.slice(0, 9).forEach((sn, i) => show(sn, x - 1.6 + (i % 3) * 1.4, 2.0 + Math.floor(i / 3) * .5, 19 - .9 + (i % 2) * 1.6, i, .7));
  [[oma, -6, 17, .5], [DX[13], -9, 22, .7], [ich, -4, 23, .3]].forEach(([c, x2, z2, r], i) => { put(c, x2, 0, z2, r); actuar(c, 0, [[0, i === 2 ? GEST.facepalm : 'shrug']], { T: L.T }); cara(c, L.T, { expr: i === 2 ? 'tired' : 'confused' }); });
  orbit(V(1, 3, 20), lerp(30, 27, L.k), .05, .16, 46); sh(V(0, 0, 20), 24); }, [[0, 'cart_wheels', .6], [.4, 'murmur', .5]]);
// 53 «Schnecken an.»: primer plano: un caracol baja del carro y se pasea por una bota
shot(56.976, 'Z', null, L => { welt(L, 0, 20); show(KARREN, 4, 0, 20, 0); SNAILS.slice(0, 9).forEach((sn, i) => show(sn, 2.4 + (i % 3) * 1.4, 2.0 + Math.floor(i / 3) * .5, 19.1 + (i % 2) * 1.6, i, .7)); const sn = show(SNAILS[10], 1.2 - L.lt * .4, 0, 23, -PI / 2 + .3, 1.1);
  const o = put(oma, -1.5, 0, 24, .5); actuar(o, 0, [[0, { aLx: .8, aRx: .8, aLz: .4, aRz: .4, aLe: 1.6, aRe: 1.6, lean: .2, headX: .45 }]], { T: L.T }); cara(o, L.T, { eyes: 'wide', mouth: 'o' });
  cm([4.5, 4, 32, 1.4, 2, 22, 42], [4, 3.8, 31, 1.4, 2, 22, 40], L.k); sh(V(1, 0, 23), 14); }, [[0, 'snail_slime', .6], [.3, 'oma_huh', .5]]);
// 54 «Lotte ist nie einfach nur gesprungen.»: Lotte salta con una pirueta completa; las trenzas vuelan
shot(57.671, 'S', null, L => { welt(L, 0, 12); const tp = .9, zc = 12; cuerda(L, tp, zc, VV); drehSprung(lotte, L, tp, zc, VV, 0, { x: 0, z: 12, J: 4, pose: { aLz: .9, aRz: .9 }, f: { expr: 'joy' } });
  vecinos(L, [[-7, 6, .2], [7, 5, -.2]], tp, zc, VV, 8); orbit(V(0, 4, 12), lerp(15, 13, L.k), 0, .08, 44); badge3('tag', 'LOTTE', hp(lotte).add(V(0, 2.4, 0)), clamp((L.lt - .1) / .2)); sh(V(0, 0, 12), 22); }, [[.1, 'sparkle', .4], [.8, 'jump_spin', .6]]);
// 55 «Sie hat immer eine Drehung eingebaut.»: desde abajo, a cámara lenta: Lotte gira en el aire justo sobre la cuerda
shot(59.594, 'W', null, L => { welt(L, 0, 12); const tp = .55, zc = 12, v = 60; cuerda(L, tp, zc, v); drehSprung(lotte, L, tp, zc, v, .3, { x: 0, z: 12, J: 4.4, pose: { aLx: 2.6, aRx: 2.6, aLz: .3, aRz: .3 }, f: { eyes: 'closed', mouth: 'open_smile', noBlink: true } });
  cm([2.4, 1.0, 19, 0, 3.8, 12, 46], [2, 1.0, 18.4, 0, 5.2, 12, 44], L.k); sh(V(0, 0, 12), 18); }, [[.4, 'rope_swish', .5], [.5, 'whoosh_soft', .5]]);
// 56 «eingebaut.»: los vecinos aplauden su pirueta
shot(60.654, 'F', null, L => { welt(L, 0, 12); const l = put(lotte, 0, 0, 12, 0); actuar(l, 0, [[0, { aLz: 1.2, aRz: 1.2, aLx: .4, aRx: .4 }]], { T: L.T }); grin(l, L.T);
  [[DX[14], -5, 7, .4], [DX[15], 5, 7, -.4], [oma, -2.6, 5, .2], [DX[16], 3, 4.5, -.2]].forEach(([c, x, z, r], i) => crowdGuy(c, x, z, L, i, { mode: 'clap', ry: r }));
  orbit(V(0, 3.6, 10), lerp(15, 13, L.k), .25, .12, 44); sh(V(0, 0, 15), 18); }, [[0, 'clap', .7], [.2, 'cheer_small', .5]]);
// Lotte y yo sentados en el murete de una parcela (D1, x = 17, z = 8,5: muro sur en z = 15)
const MUR = [17, 15];
function banco(L, o = {}) { welt(L, MUR[0], MUR[1] + 6, o); const l = sit(lotte, MUR[0] - 1.4, 1.35, MUR[1] + .2, 0, L, { aLx: .4, aRx: .4, ...(o.lp || {}) }); const i = sit(ich, MUR[0] + 1.6, 1.35, MUR[1] + .2, 0, L, { aLx: .3, aRx: .3, ...(o.ip || {}) }); hornHang(i, 0); return [l, i]; }
// 57 «„Wenn wir das schon für immer machen“,»: Lotte, sentada a mi lado en el murete, me lo explica con las manos
shot(61.361, 'C', null, L => { const [l, i] = banco(L, { lp: { aRx: 1 + Math.sin(L.T * 4) * .3, aRz: -.3, aRe: 1.2, headY: -.3 }, ip: { headY: .4 } }); talk(l, L.T, 61.3, 62.7, 'happy'); cara(i, L.T, { expr: 'smile', eyes: 'side_l' });
  l.root.rotation.y = -.3; i.root.rotation.y = .3; orbit(V(MUR[0], 3.6, MUR[1]), lerp(13, 11.5, L.k), -.1, .1, 42); sh(V(MUR[0], 0, MUR[1]), 16); }, [[0, 'birds', .4]]);
// 58 «hat sie gesagt, „dann soll es»: se levanta de un salto con otra pirueta y los brazos abiertos
shot(63.001, 'S', null, L => { welt(L, 0, 24); const tp = .55, zc = 24; cuerda(L, tp, zc, VV); drehSprung(lotte, L, tp, zc, VV, 0, { x: 0, z: 24, J: 4, pose: { aLz: 1.4, aRz: 1.4, aLx: .3, aRx: .3 }, f: { expr: 'joy' } }); talk(lotte, L.T, 63.6, 65.3, 'happy');
  orbit(V(0, 4.2, 24), lerp(13, 11.5, L.k), .35, .1, 44); sh(V(0, 0, 24), 18); }, [[.45, 'jump_spin', .6]]);
// 59 «wenigstens schön aussehen.“»: aterriza como una bailarina, brazos arriba; destellos
shot(64.502, 'Z', null, L => { welt(L, 0, 24); const l = put(lotte, 0, 0, 24, .2); actuar(l, 0, [[0, { aLx: 2.7, aRx: 2.7, aLz: .4, aRz: .4, lRx: -.4, lRk: .5, headX: -.15 }]], { T: L.T }); talk(l, L.T, 64.5, 65.3, 'happy');
  SPARK.forEach((s, i) => { const a = i / SPARK.length * 6.28 + L.T, r = 3 + Math.sin(L.T * 2 + i) * .6; s.visible = true; s.position.set(Math.cos(a) * r, 3 + Math.sin(i * 2.1 + L.T * 3) * 2.4, 24 + Math.sin(a) * r); });
  onBody(l, 10, .1, .1, 42, L.k, 8.6); sh(V(0, 0, 24), 16); }, [[0, 'sparkle', .6], [.3, 'chime', .4]]);
// 60 «Sie war meine beste Freundin.»: al atardecer, los dos en el murete, riéndonos
shot(65.523, 'W', null, L => { const [l, i] = banco(L, { dusk: true, lp: { aLx: 1.4, aLz: -.5, aLe: 1.6 }, ip: { aRx: .9, aRe: 1.4 } }); laughF(l, L.T); laughF(i, L.T + .3); l.root.rotation.y = -.35; i.root.rotation.y = .35;
  orbit(V(MUR[0], 3.4, MUR[1]), lerp(15, 13, L.k), .3, .06, 42); sh(V(MUR[0], 0, MUR[1]), 16); }, [[0, 'laugh_kids', .6]]);
// 61 «Und ich war ihr Rufer.»: yo en el pedestal gritando su «¡salta!»; ella salta abajo, mirándome
shot(66.919, 'C', null, L => { welt(L, 8, 14); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], PI - .1); c.blob.visible = false; rufen(c, L, 0, clamp(L.lt / .2));
  const tp = .7, zc = 2; cuerda(L, tp, zc, VV); drehSprung(lotte, L, tp, zc, VV, .1, { x: p[0] - 1, z: 2, J: 3.8, f: { expr: 'joy' } });
  cm([p[0] + 3, 10, p[1] + 9, p[0] - 1, 4, p[1] - 6, 44], [p[0] + 2.6, 10.4, p[1] + 8, p[0] - 1, 4, p[1] - 6, 44], L.k); sh(V(p[0], 0, p[1] - 3), 20); }, [[0, 'horn_blow', .6], [.6, 'jump_spin', .5]]);
// 62 «Letzten Herbst musste ich»: otoño, atardecer naranja; en el pedestal, la nariz me pica
shot(68.005, 'W', null, L => { welt(L, 8, 8, { dusk: true }); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], .1); c.blob.visible = false; hornHang(c, 0); const k = clamp(L.lt / .9);
  actuar(c, 0, [[0, { aRx: .4 }], [.3, { lean: -.18 * k, headX: -.3 * k, aRx: 1.9, aRz: -.6, aRe: 2.2 }, { dur: .4 }]], { T: L.T }); cara(c, L.T, { eyes: k > .4 ? 'squint' : 'half', mouth: k > .4 ? 'o' : 'wavy', noBlink: true });
  CONF.forEach((f, i) => { if (i > 18) return; const r = RNG(i + 3); f.visible = true; f.material.color.setHex([0xd8601a, 0xe8a020, 0xb8401a][i % 3]); f.position.set(p[0] + (r() - .5) * 14, 2 + ((r() * 12 - L.T * 2) % 12 + 12) % 12, p[1] + (r() - .5) * 10 + 4); f.rotation.set(L.T * 2 + i, L.T + i, 0); });
  onFace(c, 8, -.6, .8, 40, L.k, 6); sh(V(p[0], 0, p[1]), 16); }, [[0, 'wind', .4], [.3, 'sniff', .6]]);
// 63 «niesen.»: ¡ATCHÍS! la cabeza da un golpe adelante; gotitas por todas partes
shot(69.025, 'C', 'punch', L => { welt(L, 8, 8, { dusk: true }); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], .1); c.blob.visible = false; hornHang(c, 0);
  actuar(c, 0, [[0, { lean: -.2, headX: -.35, aRx: 1.9, aRz: -.6, aRe: 2.2 }], [.04, { lean: .45, headX: .5, aRx: .6, aLx: .4, crouch: .1 }, { dur: .1 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'scream', noBlink: true });
  const h = hp(c); spray(SPRAY, h.clone().add(V(0, -.2, .8)), V(0, -.2, 1), L.t0 + .05, L.T, 30, 1.2, 5); onFace(c, 8, -.4, 2.6, 40, L.k, 7); SHAKE = clamp(1 - L.lt / .3); sh(V(p[0], 0, p[1]), 16); }, [[0, 'sneeze', 1]]);
// 64 «Ein einziges Mal.»: me quedo con los ojos muy abiertos; «1×»
shot(69.537, 'Z', null, L => { welt(L, 8, 8, { dusk: true }); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], .1); c.blob.visible = false; hornHang(c, 0); actuar(c, 0, [[0, { aRx: .9, aRe: 1.8, aRz: -.3, headX: .05 }]], { T: L.T }); cara(c, L.T, { eyes: 'wide', mouth: 'flat', noBlink: true });
  onFace(c, 6, -.4, 0, 38, L.k, 5); bigNum('1×', clamp((L.lt - .1) / .15), 'red', .17, 1.1); sh(V(p[0], 0, p[1]), 14); }, [[.1, 'pling_low', .5]]);
// 65 «Mein „Spring!“»: grito «SPRING!»… tarde
shot(70.584, 'C', 'punch', L => { welt(L, 8, 8, { dusk: true }); const p = D1.peds[0]; const c = put(ich, p[0], 2.3, p[1], PI - .15); c.blob.visible = false; rufen(c, L, 0, 1, { f: { eyes: 'terror' } });
  onFace(c, 7, -.4, -4, 40, L.k, 6); badge('red', 'SPRING!', W / 2, H * .17, clamp(L.lt / .1), 1, 1.1); sh(V(p[0], 0, p[1]), 14); }, [[0, 'horn_blow', .9], [.02, 'shout_kid', .8]]);
// 66 «kam zu spät.»: Lotte se gira hacia mí; detrás de ella ya llega la cuerda
shot(71.084, 'S', null, L => { welt(L, 7, 0, { dusk: true }); const l = put(lotte, 7, 0, 2, .4); actuar(l, 0, [[0, { headY: .5, aLx: .3, aRx: .3 }], [.4, 'recoil', { dur: .3 }]], { T: L.T }); cara(l, L.T, { eyes: L.lt > .4 ? 'wide' : 'normal', mouth: L.lt > .4 ? 'o' : 'smile', noBlink: true });
  cuerda(L, 1.35, 2, VV); onBody(l, 10, -.2, .08, 42, L.k, 8.5); sh(V(7, 0, 2), 16); }, [[.2, 'rope_far', .7], [.45, 'gasp_girl', .5]]);
// 67 «Das Seil hat sie erwischt» (zoom lento): la cuerda le golpea las piernas y la levanta
shot(72.265, 'F', 'slow', L => { welt(L, 7, 4, { dusk: true }); const tp = .55, zc = 2, v = 28, z = zc + v * (L.lt - tp); cuerda(L, tp, zc, v); const caught = L.lt > tp;
  const l = put(lotte, 7, caught ? ropeY(z) + .4 + (L.lt - tp) * 3 : 0, caught ? z - .6 : 2, .4); l.blob.visible = !caught; if (caught) l.root.rotation.set(-.6 - (L.lt - tp) * 2, .4, (L.lt - tp) * 4);
  actuar(l, 0, [[0, 'recoil'], [tp, { aLx: 2.6, aRx: 2.4, aLz: .8, aRz: .7, lLx: -.5, lRx: .6, lLk: .9 }, { dur: .15 }]], { T: L.T }); cara(l, L.T, { eyes: 'terror', mouth: 'scream', noBlink: true });
  orbit(V(7, 3.4, 3), lerp(14, 11, L.k), .7, .06, 42); sh(V(7, 0, 3), 16); }, [[.5, 'rope_hit', .8], [.55, 'scream_girl', .6]]);
// 68 «und mitgenommen,»: la cuerda se la lleva por la pradera, dando vueltas, las trenzas al viento
shot(73.385, 'W', null, L => { welt(L, 7, 30, { dusk: true }); const v = 40, z = 6 + v * L.lt; cuerda(L, 0, 6, v); const l = put(lotte, 7, ropeY(z) + 1.2, z, 0); l.blob.visible = false; l.root.rotation.set(-1 + L.lt * 4, 0, L.lt * 8);
  actuar(l, 0, [[0, { aLx: 2.6, aRx: 2.2, aLz: .9, aRz: .7, lLx: -.5, lRx: .7 }]], { T: L.T }); cara(l, L.T, { eyes: 'terror', mouth: 'o', noBlink: true }); cam([10, 13, z - 15], [7, 2.2, z], 44); sh(V(7, 0, z), 24); }, [[0, 'rope_drag', .7], [.2, 'scream_far', .5]]);
// 69 «bis hinter den Horizont.»: desde el pueblo: un puntito en la cuerda que se aleja hasta el horizonte
shot(74.098, 'Z', null, L => { welt(L, 7, 10, { dusk: true }); const z = 80 + 900 * easeIn(L.k); const phi = -Math.asin(clamp(z / AZ)); setRope(phi); const l = put(lotte, 7, ropeY(z) + 1.2, z, 0); l.blob.visible = false; l.root.rotation.set(-1, 0, L.T * 8); l.root.scale.setScalar(2.2);
  const i = put(ich, 7, 0, 6, PI); actuar(i, 0, [[0, { aRx: 1.7, aRe: .1, aLx: .3 }]], { T: L.T }); cara(i, L.T, { expr: 'shock' }); cam([7.6, 6.4, -6], [7, 4.4, 200], 40); sh(V(7, 0, 8), 18); }, [[0, 'wind', .6], [.6, 'rope_far', .5]]);
// 70 «Und sie hat sich dabei noch gedreht.»: teleobjetivo: lejos, Lotte todavía hace su pirueta encima de la cuerda
shot(75.293, 'S', null, L => { welt(L, 7, 600, { dusk: true, grass: false }); const z = 640 + L.lt * 60; setRope(-Math.asin(clamp(z / AZ))); const l = put(lotte, 7, ropeY(z) + 2.2, z, L.T * 5); l.blob.visible = false;
  actuar(l, 0, [[0, { aLz: 1.3, aRz: 1.3, aLx: .3, aRx: .3, lRx: .4, lRk: .6 }]], { T: L.T }); cara(l, L.T, { eyes: 'closed', mouth: 'smile', noBlink: true }); cam([12, 6, z - 34], [7, 7.4, z], 22); sh(V(7, 0, z), 24); }, [[0, 'music_box', .5]]);
// 71 «Wir sagen nicht „verpasst“.» (fundido): el pueblo en círculo, cabizbajo
shot(76.725, 'W', null, L => { welt(L, 0, 0, { dusk: true }); const ring = [oma, mutter, DX[17], DX[18], DX[19], DX[20], DX[21], DX[22]]; ring.forEach((c, i) => { const a = i / ring.length * 6.28 + .3; put(c, Math.cos(a) * 6, 0, -14 + Math.sin(a) * 6, Math.atan2(-Math.cos(a), -Math.sin(a))); actuar(c, 0, [[0, { headX: .5, aLx: .3, aRx: .3, aLz: -.3, aRz: -.3, aLe: 1, aRe: 1 }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'sad', eyes: 'down' }); });
  show(STEIN, 0, 0, -14); orbit(V(0, 2, -14), lerp(24, 21, L.k), .3, .5, 44); sh(V(0, 0, -14), 22); }, [[0, 'wind_soft', .5]]);
// 72 «Wir sagen: „vorausgegangen“.»: la abuela deja el lazo rojo de Lotte sobre la piedra; «VORAUSGEGANGEN»
shot(78.042, 'W', null, L => { welt(L, 0, -12, { dusk: true }); show(STEIN, 0, 0, -14); const o = put(oma, 0, 0, -11.4, PI); actuar(o, 0, [[0, { lean: .45, headX: .4, aRx: 1.2, aLx: .3, crouch: .2 }]], { T: L.T }); cara(o, L.T, { expr: 'sad' });
  show(LAZO, 0, 1.45, -13.6, 0, .9); onBody(o, 12, .55, .25, 42, L.k, 10.5); badge('tag', 'VORAUSGEGANGEN', W / 2, H * .16, clamp((L.lt - .35) / .2), 1, 1); sh(V(0, 0, -13), 16); }, [[.2, 'cloth', .4], [.4, 'chime_sad', .5]]);
// 73 «Und keiner schaut, wohin sie gehen.»: todos se tapan los ojos o dan la espalda al horizonte
shot(79.486, 'S', null, L => { welt(L, 0, 10, { dusk: true }); [[DX[17], -6, 6], [DX[18], -2, 9], [DX[19], 3, 7], [DX[20], 7, 10], [mutter, -4, 13], [DX[21], 5, 14]].forEach(([c, x, z], i) => { put(c, x, 0, z, (i % 2 ? .3 : -.2)); actuar(c, 0, [[0, i % 2 ? GEST.hands_face : { aLx: 2.0, aLz: -.2, aLe: 2.3, headX: .2, headY: .6 }]], { T: L.T + i }); cara(c, L.T + i, { eyes: 'closed', mouth: 'frown', noBlink: true }); });
  orbit(V(0, 4, 10), lerp(20, 18, L.k), .1, .12, 44); sh(V(0, 0, 10), 20); }, [[0, 'murmur_low', .5]]);
// 74 «Das bringt Unglück.»: la abuela me advierte con el dedo
shot(80.989, 'C', null, L => { welt(L, 0, 12, { dusk: true }); const o = put(oma, 0, 0, 12, 0); actuar(o, 0, [[0, { aRx: 1.9, aRz: -.3, aRe: 1.3, lean: .1, headX: .1, sx: Math.sin(L.T * 12) * .0 }], [0, { aRz: -.3 + Math.sin(L.T * 14) * .25 }, { dur: .2 }]], { T: L.T }); talk(o, L.T, 80.9, 81.8, 'angry');
  onFace(o, 6.5, -.4, .8, 40, L.k, 5.6); sh(V(0, 0, 12), 14); }, [[0, 'tsk', .6]]);
// 75 «Ich habe hingeschaut.»: el único que mira al horizonte: yo, entre los que dan la espalda
shot(81.912, 'Z', null, L => { welt(L, 0, 10, { dusk: true }); [[DX[17], -5, 8], [DX[18], 5, 8], [DX[19], -3, 4], [DX[20], 4, 3]].forEach(([c, x, z], i) => { put(c, x, 0, z, 0); actuar(c, 0, [[0, { headX: .45, aLx: .3, aRx: .3 }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'sad', eyes: 'closed' }); });
  const c = put(ich, 0, 0, 6, PI); hornHang(c, 0); actuar(c, 0, [[0, { aLx: .1, headX: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); cm([0, 6.2, -10, 0, 5.4, 6, 40], [0, 6.4, -7.6, 0, 5.6, 6, 38], L.k); sh(V(0, 0, 6), 18); }, [[0, 'heartbeat', .5]]);
// 76 «Das Seil zieht immer in dieselbe Richtung.»: la cuerda en lo alto del cielo; prendas y siluetas se deslizan por ella hacia la torre
shot(82.812, 'W', null, L => { welt(L, 0, 0, { dusk: true, grass: false }); setRope(PI); DX.slice(0, 7).forEach((c, i) => { const x = 140 + ((L.lt * 130 + i * 160) % 1100); const p = ropePt(x, PI); put(c, p.x, p.y - 4.5, p.z, -PI / 2); c.blob.visible = false; c.root.scale.setScalar(2.4); actuar(c, 0, [[0, { aLx: 3, aRx: 3, aLe: .2, aRe: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' }); });
  cam([-60, 2, 30], [500, 300, -10], 50); }, [[0, 'wind_high', .6], [.4, 'rope_creak', .5]]);
// 77 «Zu dem, der es schwingt.» (zoom lento): la torre y su manivela, lejos
shot(84.831, 'W', 'slow', L => { welt(L, 900, 0, { dusk: true, grass: false }); wolken(); setRope(.6 + L.lt * .8); cm([800, 20, 120, TX, 230, 0, 30], [820, 22, 110, TX, 220, 0, 22], L.k); sh(V(TX, 0, 0), 80); }, [[0, 'crank', .6]]);
// 78 «Also bin ich losgelaufen.»: me voy del pueblo con mi hatillo y la trompetilla; miro atrás una vez
shot(86.313, 'S', null, L => { welt(L, 46, 0, { dusk: true }); const c = walkTo(ich, L, 44 + L.lt * 3, 0, PI / 2); attach(BUNDLE, c.aR.hand, [0, -.3, 0], [0, 0, -1.1], .8); hornHang(c, 0); actuar(c, 0, [[0, { ...walkP(L.T, 0), aRx: 2.4, aRz: -.4, aRe: 1.6, headY: L.lt > .5 ? -.9 : 0 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', eyes: L.lt > .5 ? 'side_r' : 'normal' });
  onBody(c, 13, -.9, .06, 42, L.k, 11.5); sh(V(46, 0, 0), 20); }, [[0, 'steps_grass', .6]]);
// andar hacia ry
function walkTo(ch, L, x, z, ry, i = 0) { put(ch, x, Math.abs(Math.sin(L.T * 9 + i)) * .1, z, ry); actuar(ch, 0, [[0, walkP(L.T, i)]], { T: L.T }); return ch; }
// 79 «Immer neun Sekunden am Stück.»: camino por la pradera; la cuerda pasa, salto y sigo andando
shot(87.626, 'W', null, L => { welt(L, 200, 6); const x = 196 + L.lt * 3, tp = .8, zc = 6; cuerda(L, tp, zc, VV); const c = put(ich, x, 0, 6, PI / 2); const s = salto(c, L, tp, zc, VV); attach(BUNDLE, c.aR.hand, [0, -.3, 0], [0, 0, -1.1], .8); hornHang(c, 0);
  actuar(c, 0, [[0, { ...walkP(L.T, 0), ...(s.k > 0 ? s.pose : {}), aRx: 2.4, aRz: -.4, aRe: 1.6 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); orbit(V(x, 3.6, 6), lerp(14, 12, L.k), PI / 2 - 1.1, .08, 44); badge('gold', '9', W * .8, H * .14, clamp(L.lt / .15), 1, .9); sh(V(x, 0, 6), 20); }, [[0, 'steps_grass', .5], [.75, 'jump', .5]]);
// 80 «Niemand läuft auf dieses Ding zu.»: un grupo camina en dirección contraria; yo, solo, voy hacia la torre
shot(89.239, 'Z', null, L => { welt(L, 300, 40); const c = walkTo(ich, L, 296 + L.lt * 3, 40, PI / 2); hornHang(c, 0); cara(c, L.T, { expr: 'determined' });
  [[DX[22], 0], [DX[23], 1], [DX[24], 2], [DX[25], 3]].forEach(([d, i]) => { walkTo(d, L, 312 - L.lt * 3 - i * 1.5, 44 + (i % 2) * 2.4 - i * .5, -PI / 2, i); cara(d, L.T + i, { expr: 'sus', eyes: 'side_r' }); });
  orbit(V(304, 3.6, 42), lerp(26, 23, L.k), .15, .1, 44); sh(V(304, 0, 42), 26); }, [[0, 'steps_grass', .6]]);
// 81 «Die Leute haben aufgehört, mich zu grüßen.»: saludo a los de un pueblo; me dan la espalda
shot(90.874, 'S', null, L => { welt(L, 420, 226); const c = put(ich, 420, 0, 232, PI); hornHang(c, 0); actuar(c, 0, [[0, 'wave']], { T: L.T }); cara(c, L.T, { expr: 'smile' });
  [[DX[26], 415, 222], [DX[27], 421, 220], [DX[28], 426, 223]].forEach(([d, x, z], i) => { put(d, x, 0, z, lerp(0, PI, clamp((L.lt - .2 - i * .12) / .3))); actuar(d, 0, [[0, { aLz: -.1, aRz: -.1, headX: .1 }]], { T: L.T + i }); cara(d, L.T + i, { expr: 'sus' }); });
  cm([436, 6, 232, 420, 4.4, 226, 44], [435, 6, 231, 420, 4.4, 226, 42], L.k); sh(V(421, 0, 226), 18); }, [[.3, 'cloth', .4], [.5, 'sigh', .4]]);
// 82 «Im letzten Dorf»: el pueblo de pescadores junto al lago, al atardecer
shot(92.636, 'W', null, L => { welt(L, FX, 10, { dusk: true }); [[DX[1], FX - 10, 12], [DX[2], FX + 6, 18], [DX[3], FX + 16, 10]].forEach(([d, x, z], i) => crowdGuy(d, x, z, L, i, { mode: i === 1 ? 'talk' : 'idle', ry: .3 }));
  cm([FX - 40, 26, -40, FX, 2, 30, 46], [FX - 36, 24, -36, FX, 2, 30, 46], L.k); sh(V(FX, 0, 20), 60); }, [[0, 'gulls', .6], [.2, 'water_lap', .5]]);
// pescador y yo (yo en FX, 20; él a mi izquierda)
const FZ = 8, FXX = FX + 10;
function fischer2(L, o = {}) { welt(L, FXX, FZ, { dusk: true }); const f = put(fischer, FXX - 2.2, 0, FZ, PI - .9 + (o.fr ?? 0)), i = put(ich, FXX + 2, 0, FZ, PI + .9 + (o.ir ?? 0)); hornHang(i, 0); return [f, i]; }
// 83 «hat mich ein alter Fischer am Ärmel gepackt,»: me agarra de la manga
shot(93.656, 'C', null, L => { const [f, i] = fischer2(L); actuar(f, 0, [[0, {}], [.25, { aRx: 1.5, aRz: -.25, aRe: .2, lean: .2 }, { dur: .2 }]], { T: L.T }); cara(f, L.T, { expr: 'worried' }); actuar(i, 0, [[0, { aLx: .7, aLz: .2 }], [.35, { aLx: .9, aLz: .4, headY: .5, lean: -.08 }, { dur: .2 }]], { T: L.T }); cara(i, L.T, { eyes: L.lt > .35 ? 'wide' : 'normal', mouth: 'o' });
  orbit(V(FXX, 4, FZ), lerp(14, 12, L.k), PI + .05, .08, 42); sh(V(FXX, 0, FZ), 16); }, [[.25, 'grab_cloth', .6], [.4, 'gasp', .4]]);
// 84 «zwischen zwei Sprüngen.»: saltamos los dos y él no me suelta
shot(95.136, 'F', null, L => { welt(L, FXX, FZ, { dusk: true }); const tp = .5, zc = FZ; cuerda(L, tp, zc, VV); springer(fischer, FXX - 2.2, FZ, PI - .9, L, tp, zc, VV, 0, { pose: { aRx: 1.5, aRz: -.25, aRe: .2 }, f: { expr: 'worried' } }); springer(ich, FXX + 2, FZ, PI + .9, L, tp, zc, VV, 1, { pose: { aLx: .9, aLz: .4 }, f: { expr: 'worried' } }); hornHang(ich, 0);
  orbit(V(FXX, 4.4, FZ), lerp(16, 14, L.k), PI + .4, .05, 44); sh(V(FXX, 0, FZ), 18); }, [[.4, 'rope_swish', .6], [.5, 'jump', .5], [.55, 'jump', .4]]);
// 85 «„Da lang geht keiner, Rufer.“»: primer plano del pescador, señalando hacia la torre
shot(96.179, 'C', null, L => { const [f, i] = fischer2(L); actuar(f, 0, [[0, { aRx: 1.5, aRz: -.25, aRe: .2, aLx: 1.55, aLz: .5, aLe: .1, headY: .2 }]], { T: L.T }); talk(f, L.T, 96.1, 97.6, 'worried'); cara(i, L.T, { expr: 'worried' });
  onFace(f, 6.5, -.4, 1.4, 40, L.k, 5.6); sh(V(FXX, 0, FZ), 14); }, [[0, 'wind_soft', .4]]);
// 86 «„Und wer hat Ihnen dann erzählt, was da ist?“»: yo, serio, le pregunto
shot(97.763, 'S', null, L => { const [f, i] = fischer2(L); actuar(f, 0, [[0, { aRx: 1.5, aRz: -.25, aRe: .2 }]], { T: L.T }); cara(f, L.T, { expr: 'worried' }); actuar(i, 0, [[0, { aLx: .9, aLz: .4, headY: .4 }]], { T: L.T }); talk(i, L.T, 97.7, 99.5, 'determined');
  onFace(i, 6.5, -.4, -1.4, 40, L.k, 5.6); sh(V(FXX, 0, FZ), 14); }, [[0, 'heartbeat', .4]]);
// 87 «Er hat mich losgelassen.»: me suelta y baja la mirada; yo sigo mi camino
shot(99.586, 'W', null, L => { const [f, i] = fischer2(L); actuar(f, 0, [[0, { aRx: 1.5, aRz: -.25, aRe: .2 }], [.2, { aRx: .2, headX: .5, aRz: .1 }, { dur: .4 }]], { T: L.T }); cara(f, L.T, { expr: 'sad', eyes: 'down' }); actuar(i, 0, [[0, { aLx: .4, headY: .3 }]], { T: L.T }); cara(i, L.T, { expr: 'sad' });
  orbit(V(FXX, 4, FZ), lerp(13, 15, L.k), PI - .3, .1, 42); sh(V(FXX, 0, FZ), 16); }, [[.2, 'cloth', .4], [.5, 'water_lap', .4]]);
// ---------- c: ya no hay nadie, el invierno, la cuerda de cerca, la torre de personas y Lotte (100,68 – 152,43 s) ----------
// Nieve desde x ≈ 960. Torre de Lotte en TX (cara al pueblo: ángulo π, x ≈ TX − tR(y)). Muro de gente real: wand(L, lista, a0, y0, filas, columnas).
const WX = 1060; NOGRASS.push([858, -62, 884, -34]);   // donde camino en invierno
const HORN_LOST = P_(horn()); outline(HORN_LOST, OP);
const SNOWPILE = P_(new THREE.Group()); { for (let k = 0; k < 6; k++) { const s = sphere(1.4 + k * .2, mat(0xf2f6fc, { roughness: .85 }), SNOWPILE, Math.cos(k) * 2, .2, Math.sin(k * 1.7) * 2, 10, 6); s.scale.y = .4; } }
// trozo de cuerda de primer plano pasando a mi lado (a lo largo de x, a la altura y, avanzando en z)
const nah = (x, y, z, ry = 0) => { NAH.visible = true; NAH.position.set(x, y, z); NAH.rotation.set(0, ry, 0); return NAH; };
// mi bufanda y mi gorro de invierno
const MUETZE = P_(new THREE.Group()); { const m = mat(0xd8323a, { roughness: 1 }); const c = sphere(1.0, m, MUETZE, 0, 0, 0, 14, 8); c.scale.y = .7; sphere(.35, mat(0xffffff, { roughness: 1 }), MUETZE, 0, .75, 0, 8, 6); cyl(1.02, 1.02, .4, mat(0xffffff, { roughness: 1 }), 16, MUETZE, 0, -.35, 0); }
const winterIch = c => { attach(MUETZE, c.head, [0, 1.45, -.05], [0, 0, 0], 1); };
// pose de escalada (de cara a la torre)
const KLETTER = (T) => ({ aLx: 2.6 + Math.sin(T * 3) * .2, aRx: 2.2 - Math.sin(T * 3) * .2, aLz: .3, aRz: .3, aLe: .4, aRe: .4, lLx: .9 + Math.sin(T * 3) * .3, lLk: 1.2, lRx: .2, lRk: .4, lean: .15 });
// la torre vista de cerca: muro de gente desde la fila de y0
const TA = Math.PI;   // cara de la torre que mira al pueblo
function turmNah(L, y0 = 40, o = {}) { welt(L, TX - 200, 0, { grass: false, snow: o.snow ?? false, dusk: !o.snow, rings: o.rings ?? false }); TURM.visible = true; setRope(o.phi ?? (L.T * .7)); TURM.userData.anim(o.phi ?? (L.T * .7), o.lean ?? .4);
  return wand(L, o.list || DX, TA + (o.da ?? 0), y0, o.rows ?? 4, o.cols ?? 5, o); }
const surf = (y, da = 0, out = 1.6) => turmPt(TX, y, TA + da / tR(y), -1, out);

// 88 «Danach kamen keine Menschen mehr.»: la pradera vacía al atardecer; yo, un puntito, camino hacia la torre
shot(100.675, 'W', null, L => { welt(L, 860, -60, { dusk: true }); const c = walkTo(ich, L, 850 + L.lt * 3, -60, PI / 2); hornHang(c, 0); attach(BUNDLE, c.aR.hand, [0, -.3, 0], [0, 0, -1.1], .8); actuar(c, 0, [[0, { ...walkP(L.T, 0), aRx: 2.4, aRz: -.4, aRe: 1.6 }]], { T: L.T }); cara(c, L.T, { expr: 'tired' });
  cm([826, 14, -20, 852, 3, -60, 40], [830, 13, -24, 854, 3, -60, 40], L.k); sh(V(852, 0, -60), 30); }, [[0, 'wind', .6], [.4, 'steps_grass', .4]]);
// 89 «Keine Rufer.»: un pedestal abandonado; la trompetilla de alguien tirada en la hierba
shot(102.411, 'S', null, L => { welt(L, 870, -50, { dusk: true }); show(PED2[2], 870, 0, -50, .3); show(HORN_LOST, 872.4, .7, -47, 1.2); HORN_LOST.rotation.z = 1.4;
  cm([877, 3.4, -38, 871, 1.6, -49, 40], [876, 3.2, -40, 871, 1.6, -49, 38], L.k); sh(V(871, 0, -48), 16); }, [[0, 'wind_soft', .6], [.2, 'crow', .3]]);
// 90 «Keine Welle.»: la cuerda pasa sobre la pradera vacía, sin nadie que grite
shot(103.233, 'Z', null, L => { welt(L, 880, -70, { dusk: true }); cuerda(L, .5, -70, 90); cm([890, 2.4, -46, 880, 3, -110, 42], [889, 2.6, -48, 880, 3, -110, 42], L.k); sh(V(880, 0, -70), 30); }, [[.3, 'rope_swish', .6]]);
// 91 «Ich musste das Seil mit meinen eigenen Augen beobachten.»: mis ojos entornados, vigilando la cuerda que se acerca
shot(103.978, 'C', 'punch', L => { welt(L, 900, -60, { dusk: true }); const c = put(ich, 900, 0, -60, PI); hornHang(c, 0); actuar(c, 0, [[0, { lean: .1, headX: .05, aLx: .4, aRx: .4 }]], { T: L.T }); cara(c, L.T, { eyes: L.lt > .5 ? 'squint' : 'normal', mouth: 'flat', noBlink: true });
  onFace(c, 4.2, -.3, 0, 34, L.k, 3.6); sh(V(900, 0, -60), 12); }, [[0, 'heartbeat', .5]]);
// 92 «Augen beobachten.»: salto yo solo, en medio de la nada
shot(105.378, 'W', null, L => { welt(L, 905, -60, { dusk: true }); const tp = .5, zc = -60; cuerda(L, tp, zc, VV); springer(ich, 905, -60, .3, L, tp, zc, VV, 0, { f: { expr: 'determined' } }); hornHang(ich, 0);
  orbit(V(905, 3.6, -60), lerp(30, 26, L.k), .4, .1, 44); sh(V(905, 0, -60), 30); }, [[.4, 'rope_swish', .6], [.5, 'jump', .5]]);
// 93 «Das hat mich den ganzen Winter gekostet.»: tormenta de nieve; camino encogido con gorro, hundiéndome en la nieve
shot(106.40, 'F', null, L => { welt(L, WX, 20, { snow: true, grass: false }); const c = walkTo(ich, L, WX - 4 + L.lt * 2.4, 20, PI / 2 + .2); c.root.position.y = -.6; winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, { ...walkP(L.T, 0), ...GEST.hug_self, lean: .3 }]], { T: L.T }); cara(c, L.T, { eyes: 'squint', mouth: 'wavy' }); c.root.position.x += Math.sin(L.T * 30) * .04;
  show(SNOWPILE, WX + 6, 0, 24); orbit(V(WX - 3, 3.4, 20), lerp(16, 14, L.k), 1.1, .08, 44); sh(V(WX, 0, 20), 20); }, [[0, 'blizzard', .8], [.3, 'snow_steps', .5]]);
// 94 «Winter gekostet.»: la cuerda gigante pasa por encima de mí, alta, entre los copos
shot(107.18, 'S', null, L => { welt(L, WX, 20, { snow: true, grass: false }); cuerda(L, .45, 20, 70); const c = put(ich, WX, -.5, 20, PI / 2); winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, { headX: -.6, lean: -.1, ...GEST.hug_self, headY: 0 }]], { T: L.T }); cara(c, L.T, { eyes: 'up', mouth: 'o', noBlink: true });
  cm([WX - 3, 1.2, 31, WX + 1, 9, 14, 52], [WX - 2.8, 1.3, 30, WX + 1, 10, 14, 52], L.k); sh(V(WX, 0, 20), 20); }, [[0, 'rope_whoosh_high', .8], [.4, 'blizzard', .5]]);
// 95 «Von Nahem ist das Seil gar kein Seil.»: la cuerda pasa despacio junto a mi cara; me acerco a mirarla
shot(108.211, 'W', null, L => { welt(L, WX + 40, 20, { snow: true, grass: false }); const c = put(ich, WX + 40, 0, 24, PI); winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, { lean: .2, headX: .15, aRx: 1.1, aRe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'confused' });
  nah(WX + 40, 5.2, 20 - L.lt * .6); cm([WX + 50, 8, 40, WX + 40, 4.6, 22, 42], [WX + 49, 7.6, 38, WX + 40, 4.6, 22, 40], L.k); sh(V(WX + 40, 0, 22), 18); }, [[0, 'rope_creak', .6], [.3, 'cloth', .4]]);
// 96 «kein Seil.»: los nudos de cerca
shot(109.711, 'S', null, L => { welt(L, WX + 40, 20, { snow: true, grass: false }); nah(WX + 40, 5.2, 20); const k = WX + 40 - 35 + 3 + 3 * 4.9 + 2.2; cm([k + 3, 10, 28, k, 5.2, 20, 38], [k + 2.4, 9.6, 27, k, 5.2, 20, 36], L.k); sh(V(k, 0, 20), 14); }, [[0, 'rope_creak', .6]]);
// 97-100 «Es sind Ärmel, Gürtel, Schals und Schnürsenkel.»: cada prenda en primer plano
const prenda = (L, x, dy = .8, side = 1) => { welt(L, WX + 40, 20, { snow: true, grass: false }); nah(WX + 40, 5.2, 20); const X = WX + 40 + x; cm([X + 1.6 * side, 5.2 + dy + 3.4, 30.5, X, 5.2 + dy, 21, 36], [X + 1.2 * side, 5.2 + dy + 3.2, 29.5, X, 5.2 + dy, 21, 34], L.k); sh(V(X, 0, 20), 12); };
shot(110.051, 'C', null, L => { prenda(L, -7.5, 1.4); const X = WX + 40 - 7.5; cm([X + 3, 13, 34, X, 6.4, 21, 32], [X + 2.6, 12.6, 33, X, 6.4, 21, 30], L.k); }, [[0, 'cloth', .6]]);
shot(111.116, 'C', null, L => prenda(L, -2.6, 0, -1), [[0, 'buckle', .6]]);
shot(111.731, 'C', null, L => prenda(L, 2.3, -1.6), [[0, 'cloth', .5]]);
shot(112.171, 'C', null, L => prenda(L, 7.2, 2.4), [[0, 'lace', .5]]);
// 101 «Alles zusammengeknotet.»: la cámara se aleja: kilómetros de ropa anudada
shot(112.942, 'W', null, L => { welt(L, WX + 40, 20, { snow: true, grass: false }); nah(WX + 40, 5.2, 20); const c = put(ich, WX + 40, 0, 24.5, PI); winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, { aLx: .3, headY: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  cm([WX + 44, 7, 32, WX + 40, 5, 20, 40], [WX + 50, 12, 46, WX + 40, 5, 20, 46], L.k); sh(V(WX + 40, 0, 22), 26); }, [[0, 'whoosh_soft', .5]]);
// 102 «Auf manchen Sachen sind noch Namen»: una etiqueta bordada: «OMA ROSI»
shot(114.256, 'Z', null, L => { welt(L, WX + 40, 20, { snow: true, grass: false }); nah(WX + 40, 5.2, 20); const X = WX + 40 - 35 + 3 + 6 * 4.9 - 1; cm([X + .6, 6.8, 34, X, 5.3, 22, 26], [X + .5, 6.6, 33, X, 5.3, 22, 24], L.k); sh(V(X, 0, 20), 10); }, [[0, 'pling_low', .4]]);
// 103 «Namen eingestickt.»: toco la etiqueta «PAUL» con el dedo, triste
shot(115.336, 'C', null, L => { welt(L, WX + 40, 20, { snow: true, grass: false }); nah(WX + 40, 5.2, 20); const X = WX + 40 - 35 + 3 - 1; const c = put(ich, X + 1, 0, 24, PI - .2); winterIch(c); actuar(c, 0, [[0, { aRx: 1.5, aRz: -.1, aRe: .3, lean: .15, headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'sad' });
  cm([X + 7, 8.4, 36, X + .6, 5.4, 22, 40], [X + 6.4, 8.2, 35, X + .6, 5.4, 22, 38], L.k); sh(V(X, 0, 22), 14); }, [[.2, 'cloth', .4], [.5, 'chime_sad', .4]]);
// 104 «Wer macht ein Seil aus Kleidern?»: miro hacia arriba: la cuerda sube hasta perderse en el cielo, hacia la torre
shot(116.459, 'W', null, L => { welt(L, 1240, 0, { snow: true, grass: false }); setRope(PI * .55 + L.lt * .3); const c = put(ich, 1240, 0, 6, PI / 2 + .4); winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, { headX: -.7, lean: -.15 }]], { T: L.T }); cara(c, L.T, { eyes: 'up', mouth: 'o', noBlink: true });
  cm([1226, 2, 22, 1340, 140, -40, 52], [1228, 2.2, 20, 1340, 150, -40, 52], L.k); sh(V(1240, 0, 6), 20); }, [[0, 'wind_high', .6]]);
// 105 «Das Ding, das es schwingt,» (zoom lento): la silueta entre los nubarrones
shot(118.516, 'W', 'slow', L => { welt(L, 1300, 0, { snow: true, grass: false, rings: true }); wolken(); setRope(1 + L.lt * .7); cm([1250, 4, 140, TX, 260, 0, 46], [1262, 5, 120, TX, 300, 0, 38], L.k); scene.fog.density = .0006; sh(V(1300, 0, 0), 60); }, [[0, 'thunder', .6], [.8, 'crank', .5]]);
// 106 «füllt den halben Himmel.»: contrapicado: la torre llena medio cielo; yo diminuto abajo
shot(119.996, 'C', null, L => { welt(L, 1450, 0, { snow: true, grass: false }); wolken(); setRope(2 + L.lt * .7); const c = put(ich, 1452, 0, 40, -1.2); winterIch(c); cara(c, L.T, { eyes: 'up', mouth: 'o', noBlink: true }); actuar(c, 0, [[0, { headX: -.6 }]], { T: L.T });
  cm([1440, 1.6, 58, 1560, 260, -20, 60], [1442, 1.8, 56, 1560, 270, -20, 60], L.k); scene.fog.density = .0006; sh(V(1452, 0, 40), 20); }, [[0, 'rumble', .7]]);
// 107 «Von Weitem hat es tausend Arme.»: de lejos, la torre se eriza de brazos; «1000»
shot(121.381, 'W', null, L => { welt(L, 1300, 0, { snow: true, grass: false, rings: true }); wolken(); setRope(1.6 + L.lt * .7); cm([1180, 30, 160, TX, 220, 0, 34], [1186, 32, 150, TX, 220, 0, 32], L.k); scene.fog.density = .0005; bigNum('1000 ARME', clamp((L.lt - .2) / .2), 'gold', .15, 1); sh(V(TX, 0, 0), 80); }, [[.2, 'pling', .4], [.4, 'crowd_moan', .5]]);
// 108 «Von Nahem ist»: la cámara vuela hacia la pared de la torre
shot(123.276, 'Z', null, L => { const W_ = turmNah(L, 64, { rows: 4, cols: 5 }); const p = surf(76); cm([p.x - 90, p.y + 20, p.z + 40, p.x, p.y, p.z, 40], [p.x - 26, p.y + 4, p.z + 6, p.x, p.y, p.z, 40], L.k, easeIn); sh(p, 30); }, [[0, 'whoosh_up', .7]]);
// 109 «jeder Arm ein Mensch.»: primer plano: cada «brazo» es una persona agarrada a las muñecas de los de al lado
shot(124.576, 'C', null, L => { const W_ = turmNah(L, 64, { rows: 4, cols: 5 }); const p = surf(75); cm([p.x - 16, p.y + 1, p.z + 2, p.x, p.y, p.z, 40], [p.x - 14, p.y + 1, p.z + 1, p.x, p.y, p.z, 40], L.k); sh(p, 20); }, [[0, 'crowd_moan', .5]]);
// 110 «Es ist kein Riese.»: yo, con la boca abierta, en la nieve
shot(125.758, 'S', null, L => { welt(L, 1440, 40, { snow: true, grass: false }); const c = put(ich, 1440, 0, 40, -1.3); winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, GEST.recoil]], { T: L.T }); cara(c, L.T, { eyes: 'terror', mouth: 'grimace', noBlink: true });
  onFace(c, 6, -.2, 1.5, 40, L.k, 5); sh(V(1440, 0, 40), 14); }, [[0, 'gasp', .6]]);
// 111 «Es ist ein Turm aus Menschen.»: la torre entera desde el pie; un mar de cuerpos hasta las nubes
shot(127.064, 'W', null, L => { welt(L, 1440, 0, { snow: true, grass: false, rings: true }); wolken(); setRope(2.4 + L.lt * .7); const c = put(ich, 1440, 0, 20, -PI / 2); winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, { headX: -.5 }]], { T: L.T }); cara(c, L.T, { eyes: 'up', mouth: 'o' });
  cm([1410, 6, 34, TX, 200, 0, 58], [1406, 4, 30, TX, 230, 0, 60], L.k); scene.fog.density = .0005; sh(V(1440, 0, 20), 20); }, [[0, 'braam', .5], [.3, 'crowd_moan', .5]]);
// 112 «Einer steht auf den Schultern des anderen,»: contrapicado del muro: los pies de cada uno en los hombros del de abajo
shot(128.935, 'Z', null, L => { const W_ = turmNah(L, 30, { rows: 5, cols: 3, dy: 5.4 }); const p = surf(36); cm([p.x - 10, p.y - 6, p.z, p.x, p.y + 10, p.z, 46], [p.x - 9, p.y - 5, p.z, p.x, p.y + 12, p.z, 46], L.k); sh(p, 20); }, [[0, 'creak', .5]]);
// 113 «und alle halten sich an den Handgelenken fest.»: las manos agarrando muñecas, en primer plano
shot(130.775, 'C', null, L => { const W_ = turmNah(L, 40, { rows: 3, cols: 4 }); const h = wpos(W_[5].aR.hand); cm([h.x - 11, h.y + 1.4, h.z + 2.4, h.x, h.y, h.z, 38], [h.x - 10, h.y + 1.3, h.z + 2.2, h.x, h.y, h.z, 36], L.k); sh(h, 12); }, [[0, 'grip', .6]]);
// 114 «Alle, die jemals vorausgegangen sind.»: barrido lento por sus caras tristes (entre ellas, el del cordón)
shot(132.868, 'W', null, L => { const W_ = turmNah(L, 50, { rows: 3, cols: 6, list: [DX[0], DX[1], DX[3], DX[4], DX[5], DX[6], DX[7], DX[8], DX[9], DX[10], DX[11], DX[12], DX[13], DX[14], DX[15], DX[16], DX[17], DX[18]], face: n => ({ expr: 'sad', eyes: n % 2 ? 'down' : 'worried' }) });
  const a = surf(56, -8 + L.k * 16); cm([a.x - 18, a.y + 1, a.z + 2, a.x, a.y, a.z, 42], [a.x - 18, a.y + 1, a.z + 2, a.x, a.y, a.z, 42], 0); sh(a, 24); }, [[0, 'chime_sad', .5]]);
// 115-116 «Sie lehnen sich nach links. Dann nach rechts.»: la torre entera se inclina a un lado y al otro
shot(134.964, 'S', null, L => { welt(L, 1300, 0, { snow: true, grass: false, rings: true }); wolken(); const phi = PI / 2 + L.lt * 1.2; setRope(phi); TURM.userData.anim(phi, 3); scene.fog.density = .00035; cm([1200, 40, 200, TX, 220, 0, 40], [1204, 40, 196, TX, 220, 0, 40], L.k); sh(V(TX, 0, 0), 80); }, [[0, 'creak_big', .7]]);
shot(136.202, 'S', null, L => { welt(L, 1300, 0, { snow: true, grass: false, rings: true }); wolken(); const phi = 3 * PI / 2 + L.lt * 1.2; setRope(phi); TURM.userData.anim(phi, 3); scene.fog.density = .00035; cm([1204, 40, 196, TX, 220, 0, 40], [1208, 40, 192, TX, 220, 0, 40], L.k); sh(V(TX, 0, 0), 80); }, [[0, 'creak_big', .7]]);
// 117 «Und so drehen sie eine Kurbel,»: la manivela gira, la cuerda sale disparada
shot(137.202, 'C', 'punch', L => { welt(L, XT - 100, 0, { grass: false, snow: true, rings: false }); wolken(); setRope(L.lt * 2.4); const h = wpos(TURM.userData.crank); cm([h.x - 60, h.y + 10, 50, h.x, h.y - 6, 0, 44], [h.x - 56, h.y + 8, 46, h.x, h.y - 6, 0, 44], L.k); sh(h, 60); }, [[0, 'crank', .9], [.2, 'rope_swish', .6]]);
// 118 «so groß wie ein Haus.»: yo, diminuto, en la nieve bajo la rueda de la manivela
shot(138.562, 'W', null, L => { welt(L, XT - 30, 30, { grass: false, snow: true, rings: false }); wolken(); setRope(.5 + L.lt * 1.4); const h = wpos(TURM.userData.crank);
  cm([h.x - 36, h.y + 14, 52, h.x + 20, h.y - 6, 0, 46], [h.x - 33, h.y + 13, 48, h.x + 20, h.y - 6, 0, 46], L.k); sh(h, 60); }, [[0, 'crank', .6], [.3, 'rumble', .5]]);
// 119 «Drei Reihen weiter oben»: trepo por el muro de gente, de hombro en hombro; miro hacia arriba
shot(140.16, 'Z', null, L => { const W_ = turmNah(L, 40, { rows: 5, cols: 4 }); const p = surf(41.6, 2, 3.4); const c = put(ich, p.x, p.y, p.z, -PI / 2 + .4); c.blob.visible = false; winterIch(c); hornHang(c, 0); actuar(c, 0, [[0, KLETTER(L.T)]], { T: L.T }); cara(c, L.T, { eyes: 'up', mouth: 'flat' }); c.root.rotation.y = PI / 2 * 0 + Math.PI * 1.5 + .6;
  cm([p.x - 14, p.y + 2, p.z + 4, p.x, p.y + 6, p.z, 44], [p.x - 13, p.y + 3, p.z + 3, p.x, p.y + 7, p.z, 44], L.k); badge('gold', '3 REIHEN', W / 2, H * .14, clamp((L.lt - .2) / .2), 1, .9); sh(p, 20); }, [[0, 'climb', .6], [.5, 'grunt', .4]]);
// Lotte en el muro (fila 3 desde y0 = 40: y ≈ 56,8), mirando hacia fuera
function lotteWand(L, o = {}) { const list = []; let d = 0; for (let i = 0; i < 20; i++) list.push(i === 7 ? null : i === 12 ? lotte : DX[d++]); const W_ = turmNah(L, 40, { rows: 4, cols: 5, list, face: n => n === 13 ? (o.lf || { expr: 'smile' }) : { expr: 'tired' } }); return W_; }
// 120 «baute jemand eine kleine Drehung ein.»: alguien en el muro mueve la cadera, un giro pequeñito
shot(141.16, 'S', null, L => { const W_ = lotteWand(L, { lf: { eyes: 'closed', mouth: 'smile', noBlink: true } }); lotte.root.rotation.y += Math.sin(L.T * 6) * .3; applyPose(lotte, { aLz: 1.45, aRz: 1.45, aLe: .1, aRe: .1, twist: Math.sin(L.T * 6) * .5, headZ: Math.sin(L.T * 6) * .2 });
  const p = hp(lotte); cm([p.x - 20, p.y - 1, p.z, p.x, p.y - 2, p.z, 40], [p.x - 18, p.y - 1, p.z, p.x, p.y - 2, p.z, 40], L.k); sh(p, 20); }, [[.2, 'sparkle', .4]]);
// 121 «Lotte.»: su cara, con la sonrisa de siempre
shot(143.08, 'C', 'punch', L => { lotteWand(L, { lf: { expr: 'happy', mouth: 'smile' } }); const p = hp(lotte); cm([p.x - 6.4, p.y + .4, p.z, p.x, p.y - .2, p.z, 38], [p.x - 5.8, p.y + .4, p.z, p.x, p.y - .2, p.z, 36], L.k); sh(p, 12); }, [[0, 'chime', .6], [0, 'heartbeat', .4]]);
// Lotte y yo: yo agarrado al muro justo debajo y a su lado
function nosotros(L, o = {}) { const W_ = lotteWand(L, o); const p = hp(lotte); const q = surf(45.6, 2.05, 2.6); const c = put(ich, q.x, q.y, q.z, -PI / 2 + .25); c.blob.visible = false; winterIch(c); actuar(c, 0, [[0, { aLz: 1.45, aRz: 1.2, aRx: .4, aLe: .1, aRe: .3, headX: -.45, headY: -.15, ...(o.ip || {}) }]], { T: L.T }); return { W_, p, c }; }
// 122 «„Du bist früh dran“, hat sie gesagt.»
shot(143.565, 'C', null, L => { const { p, c } = nosotros(L); talk(lotte, L.T, 143.5, 144.4, 'warm'); cara(c, L.T, { expr: 'sad', eyes: 'up' }); cm([p.x - 7, p.y, p.z - 1.6, p.x, p.y - .4, p.z, 40], [p.x - 6.4, p.y, p.z - 1.4, p.x, p.y - .4, p.z, 38], L.k); sh(p, 12); }, [[0, 'wind_high', .4]]);
// 123 «Losgelassen hat sie nicht.»: sus manos siguen bien agarradas a las muñecas de los de al lado
shot(145.25, 'S', null, L => { lotteWand(L); const h = wpos(lotte.aL.hand); cm([h.x - 10, h.y + 1.2, h.z - 2, h.x, h.y, h.z, 38], [h.x - 9.4, h.y + 1.1, h.z - 1.8, h.x, h.y, h.z, 36], L.k); sh(h, 10); }, [[0, 'grip', .5]]);
// 124 «Da oben kann das keiner.»: el muro entero, todos agarrados, nadie se suelta
shot(146.479, 'W', null, L => { const W_ = lotteWand(L); const p = surf(52); cm([p.x - 40, p.y + 4, p.z - 6, p.x, p.y, p.z, 44], [p.x - 46, p.y + 6, p.z - 8, p.x, p.y, p.z, 46], L.k); sh(p, 30); }, [[0, 'crowd_moan', .5]]);
// 125 «„Ich hab dich gewarnt. Ich musste niesen.“»: yo, agarrado a su lado, con los ojos húmedos
shot(147.665, 'C', null, L => { const { p, c } = nosotros(L, { lf: { expr: 'sad' } }); talk(c, L.T, 147.6, 149.5, 'sad'); tears(c, L.T); const h = hp(c); cm([h.x - 6.4, h.y + .2, h.z - .6, h.x, h.y - .3, h.z, 38], [h.x - 5.8, h.y + .2, h.z - .5, h.x, h.y - .3, h.z, 36], L.k); sh(h, 12); }, [[0, 'sniff', .5]]);
// 126 «„Ich weiß.»
shot(149.653, 'C', null, L => { const { p, c } = nosotros(L); talk(lotte, L.T, 149.6, 150.1, 'warm'); cm([p.x - 6.4, p.y + .2, p.z - 1, p.x, p.y - .3, p.z, 38], [p.x - 6, p.y + .2, p.z - .9, p.x, p.y - .3, p.z, 36], L.k); sh(p, 12); }, []);
// 127 «Ich hab’s gehört.“»: los dos en el mismo plano
shot(150.331, 'S', null, L => { const { p, c } = nosotros(L); talk(lotte, L.T, 150.3, 150.95, 'warm'); cara(c, L.T, { expr: 'sad', eyes: 'up' }); const m = p.clone().lerp(hp(c), .5); cm([m.x - 13, m.y + .4, m.z - .5, m.x, m.y, m.z, 40], [m.x - 12, m.y + .4, m.z - .4, m.x, m.y, m.z, 40], L.k); sh(m, 14); }, [[0, 'wind_high', .3]]);
// 128 «Sie hat fast gelacht.»: casi se ríe
shot(151.198, 'Z', null, L => { const { p, c } = nosotros(L, { lf: { eyes: 'happy', mouth: Math.sin(L.T * 14) > 0 ? 'open_smile' : 'smile', noBlink: true } }); cm([p.x - 5.6, p.y + .2, p.z - .6, p.x, p.y - .3, p.z, 36], [p.x - 5.2, p.y + .2, p.z - .5, p.x, p.y - .3, p.z, 34], L.k); sh(p, 12); }, [[0, 'giggle', .5]]);
// ---------- d: la otra torre, «nadie sabe quién empezó», el mensaje con la ola y la cuenta 998 – 999 (152,43 – 195,4 s) ----------
// muro con Lotte y yo dentro, agarrados de las muñecas (yo a su derecha)
function juntos(L, o = {}) { const list = []; let d = 0; for (let i = 0; i < 20; i++) list.push(i === 12 ? lotte : i === 13 ? ich : DX[d++]); winterIch(ich);
  return turmNah(L, 40, { rows: 4, cols: 5, list, face: n => n === 13 ? (o.lf || { expr: 'warm' }) : n === 14 ? (o.if || { expr: 'determined' }) : (o.ff ? o.ff(n) : { expr: 'tired' }), ...o }); }
const RED = 'rgba(160,0,20,.22)';
const GLOWBALL = P_(new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), new THREE.MeshBasicMaterial({ color: 0xff2a2a, transparent: true, opacity: .35, depthWrite: false, toneMapped: false })));

// 129 «„Das schlimmste Niesen meines Lebens.“»: yo, con lágrimas y media sonrisa
shot(152.43, 'C', null, L => { const { p, c } = nosotros(L, { lf: { eyes: 'happy', mouth: 'smile' } }); talk(c, L.T, 152.4, 153.9, 'sad', { mouth: kitLips(L.T, spoken(152.4, 153.9)) || 'smile' }); tears(c, L.T); const h = hp(c);
  cm([h.x - 6.4, h.y + .2, h.z - .6, h.x, h.y - .3, h.z, 38], [h.x - 5.8, h.y + .2, h.z - .5, h.x, h.y - .3, h.z, 36], L.k); sh(h, 12); }, [[0, 'sniff', .4]]);
// 130 «„Warum dreht ihr das Seil?“»
shot(154.274, 'S', null, L => { const { p, c } = nosotros(L, { lf: { expr: 'neutral' }, ip: { headY: -.4 } }); talk(c, L.T, 154.2, 155.3, 'confused'); const h = hp(c); cm([h.x - 6.4, h.y + .4, h.z + 1.4, h.x, h.y - .3, h.z, 38], [h.x - 6, h.y + .4, h.z + 1.2, h.x, h.y - .3, h.z, 36], L.k); sh(h, 12); }, [[0, 'wind_high', .3]]);
// 131 «„Schau mal geradeaus.“»: Lotte señala con la barbilla, al frente
shot(155.442, 'C', null, L => { const { p } = nosotros(L); applyPose(lotte, { aLz: 1.45, aRz: 1.45, aLe: .1, aRe: .1, headX: -.15 + Math.sin(L.T * 6) * .08 }); talk(lotte, L.T, 155.4, 156.5, 'determined'); cm([p.x - 6.4, p.y + .5, p.z + 1.2, p.x, p.y - .3, p.z, 38], [p.x - 6, p.y + .5, p.z + 1.1, p.x, p.y - .3, p.z, 36], L.k); sh(p, 12); }, [[0, 'whoosh_soft', .3]]);
// 132 «Am anderen Ende dieser flachen Welt»: desde lo alto de la torre: el mundo plano entero, la cuerda, los pueblos… y al fondo, otra torre
shot(156.517, 'W', null, L => { welt(L, 0, 0, { grass: false, rings: true }); setRope(.4 + L.lt * .7); TURM2.visible = true; scene.fog.density = .00018; cm([TX - 70, 150, 30, -TX, 150, 0, 40], [TX - 90, 146, 26, -TX, 160, 0, 36], L.k); sh(V(0, 0, 0), 200); }, [[0, 'wind_high', .6]]);
// 133 «stand noch ein Turm.» (zoom lento): teleobjetivo: la otra torre, igual que la nuestra, girando su manivela
shot(158.117, 'Z', 'slow', L => { welt(L, -900, 0, { grass: false, rings: true }); setRope(.8 + L.lt * .7); scene.fog.density = .00016; cm([TX - 100, 140, 0, -TX, 210, 0, 11], [TX - 100, 140, 0, -TX, 210, 0, 8], L.k); }, [[0, 'rumble', .6]]);
// 134 «„Die drehen auch.»: la manivela de la otra torre, girando
shot(159.294, 'C', null, L => { welt(L, -XT + 100, 0, { grass: false, rings: false }); setRope(L.lt * 2.2); const h = wpos(TURM2.userData.crank); cm([h.x + 70, h.y - 20, 70, h.x, h.y - 4, 0, 42], [h.x + 64, h.y - 16, 62, h.x, h.y - 4, 0, 42], L.k); sh(h, 60); }, [[0, 'crank', .8]]);
// 135 «Wenn wir zuerst aufhören,»: Lotte, seria
shot(160.231, 'S', null, L => { const { p } = nosotros(L, { lf: { expr: 'worried' } }); talk(lotte, L.T, 160.2, 161.3, 'worried'); cm([p.x - 6.6, p.y + .5, p.z + .8, p.x, p.y - .3, p.z, 38], [p.x - 6, p.y + .5, p.z + .7, p.x, p.y - .3, p.z, 36], L.k); sh(p, 12); }, [[0, 'heartbeat', .4]]);
// 136 «fällt das Seil auf alle, die wir kennen.“»: (imaginado, tono rojo) la cuerda cae floja sobre nuestro pueblo; todos se agachan aterrados
shot(161.471, 'W', null, L => { welt(L, 0, 0, { dusk: true }); const k = easeIn(clamp(L.lt / .9)); setRope(0); ROPE.position.y = 0; const y = lerp(60, 0, k);
  ROPE.userData.set(0); ROPE.position.y = y; [[oma, -5, 4], [mutter, 4, 3], [DX[10], -1, -4], [DX[11], 7, -6], [DX[12], -8, -6], [suppeM, 1, 8]].forEach(([c, x, z], i) => { put(c, x, 0, z, (i % 2 ? .3 : -.3)); actuar(c, 0, [[0, GEST.cower]], { T: L.T + i }); cara(c, L.T + i, { expr: 'terror', mouth: 'scream' }); });
  if (L.lt > .9) dust(V(0, 0, 0), L.t0 + .9, L.T, 20, 3); orbit(V(0, 12, 0), lerp(34, 30, L.k), .2, .06, 50); TINT = RED; sh(V(0, 0, 0), 30); }, [[.2, 'rope_falling', .7], [.9, 'boom', .8], [.95, 'screams', .6]]);
// 137 «„Und wer sind die?“»
shot(163.13, 'C', null, L => { const { c } = nosotros(L, { lf: { expr: 'sad' } }); talk(c, L.T, 163.1, 163.8, 'confused'); const h = hp(c); cm([h.x - 6.4, h.y + .2, h.z - .6, h.x, h.y - .3, h.z, 38], [h.x - 6, h.y + .2, h.z - .5, h.x, h.y - .3, h.z, 36], L.k); sh(h, 12); }, []);
// 138 «„Alle, die die kennen.“»: al otro lado del mundo, otros pueblos que saltan igual que el nuestro
shot(163.923, 'W', null, L => { welt(L, -700, 30); const tp = .4, zc = 30; cuerda(L, tp, zc, VV); vecinos(L, [[-706, 26, .2], [-700, 30, 0], [-694, 27, -.2], [-710, 34, .3], [-690, 35, -.3], [-703, 38, .1]], tp, zc, VV, 0, { f: { expr: 'happy' } });
  show(PARC, -700, 0, 14, 0); orbit(V(-700, 3.6, 30), lerp(24, 21, L.k), .1, .12, 44); sh(V(-700, 0, 30), 24); }, [[.3, 'rope_swish', .5], [.4, 'jump_crowd', .5]]);
// 139 «„Und wer hat angefangen?“»
shot(164.977, 'C', null, L => { const { c } = nosotros(L, { lf: { expr: 'sad' } }); talk(c, L.T, 164.9, 165.86, 'determined'); const h = hp(c); cm([h.x - 6.4, h.y + .4, h.z + 1, h.x, h.y - .3, h.z, 38], [h.x - 6, h.y + .4, h.z + .9, h.x, h.y - .3, h.z, 36], L.k); sh(h, 12); }, []);
// 140 «„Das weiß keiner mehr.“»: Lotte, triste, mira abajo
shot(165.857, 'S', null, L => { const { p } = nosotros(L); applyPose(lotte, { aLz: 1.45, aRz: 1.45, aLe: .1, aRe: .1, headX: .3, headZ: .15 }); talk(lotte, L.T, 165.86, 166.9, 'sad'); cm([p.x - 6.4, p.y + 1, p.z - .4, p.x, p.y - .3, p.z, 38], [p.x - 6, p.y + 1, p.z - .3, p.x, p.y - .3, p.z, 36], L.k); sh(p, 12); }, [[0, 'chime_sad', .4]]);
// 141 «Jede Seite glaubt,»: nuestra torre, vista desde el otro lado del mundo… también parece un monstruo (rojo)
shot(167.089, 'W', null, L => { welt(L, 1300, 0, { grass: false, dusk: true, rings: true }); setRope(2 + L.lt * .8); scene.fog.density = .0004; cm([1200, 20, -160, TX, 230, 0, 40], [1206, 22, -150, TX, 240, 0, 38], L.k); TINT = 'rgba(200,0,30,.22)'; sh(V(TX, 0, 0), 80); }, [[0, 'braam', .6], [.3, 'growl', .4]]);
// 142 «das Monster ist die andere.»: la otra torre, roja y amenazante
shot(168.229, 'Z', 'punch', L => { welt(L, -1300, 0, { grass: false, dusk: true, rings: true }); setRope(2.6 + L.lt * .8); scene.fog.density = .0004; cm([-1200, 20, 160, -TX, 230, 0, 40], [-1206, 22, 150, -TX, 240, 0, 38], L.k); TINT = 'rgba(200,0,30,.28)'; SHAKE = .3; sh(V(-TX, 0, 0), 80); }, [[0, 'braam', .8], [.2, 'growl', .5]]);
// 143 «Also habe ich das Einzige gemacht,»: saco mi trompetilla
shot(169.37, 'S', null, L => { const W_ = lotteWand(L, { lf: { expr: 'worried' } }); const q = surf(45.6, 2.05, 2.6); const c = put(ich, q.x, q.y, q.z, -PI / 2 + .2); c.blob.visible = false; winterIch(c); attach(HORNS[0], c.aR.hand, [0, -.4, .4], [-1.2 + clamp(L.lt / .6) * 1.2, 0, 0], .85);
  actuar(c, 0, [[0, { aLz: 1.45, aLe: .1, aRx: .4, aRe: .3 }], [.3, { aLz: 1.45, aLe: .1, aRx: 1.4, aRz: -.2, aRe: 1.6, headX: .1 }, { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); const h = hp(c);
  cm([h.x - 8, h.y - .6, h.z - 1.6, h.x, h.y - 1.4, h.z, 40], [h.x - 7.4, h.y - .6, h.z - 1.4, h.x, h.y - 1.4, h.z, 38], L.k); sh(h, 14); }, [[.3, 'horn_grab', .6]]);
// 144 «was ein Rufer machen kann.»: me pongo de pie sobre unos hombros y levanto la trompetilla hacia el mundo
shot(170.89, 'C', null, L => { const W_ = lotteWand(L, { lf: { expr: 'worried' } }); const q = surf(48.6, 2.05, 3); const c = put(ich, q.x, q.y, q.z, -PI / 2); c.blob.visible = false; winterIch(c); rufen(c, L, 0, clamp((L.lt - .5) / .3)); const h = hp(c);
  cm([h.x - 12, h.y - 3, h.z + 4, h.x, h.y - .6, h.z, 44], [h.x - 11, h.y - 2.6, h.z + 3.6, h.x, h.y - .6, h.z, 42], L.k); sh(h, 16); }, [[.2, 'wind_high', .4], [.5, 'inhale', .5]]);
// 145 «Ich habe eine Nachricht mit der Welle losgeschickt:»: desde detrás de mí: grito hacia el mundo de abajo
shot(172.093, 'W', null, L => { const W_ = lotteWand(L); const q = surf(48.6, 2.05, 3); const c = put(ich, q.x, q.y, q.z, -PI / 2); c.blob.visible = false; winterIch(c); rufen(c, L, 0, 1); const h = hp(c);
  for (let k = 0; k < 3; k++) { const ph = (L.lt * 1.2 + k / 3) % 1; FX2D.push(x => { x.save(); x.strokeStyle = `rgba(255,240,180,${(1 - ph) * .8})`; x.lineWidth = 12; x.beginPath(); x.arc(W / 2, H * .44, 80 + ph * 420, -2.6, -.5); x.stroke(); x.restore(); }); }
  cm([h.x - 12, h.y - 2, h.z + 4, h.x, h.y - .6, h.z, 44], [h.x - 11.4, h.y - 1.8, h.z + 3.8, h.x, h.y - .6, h.z, 44], L.k); sh(h, 30); }, [[0, 'horn_blow', .9], [.1, 'shout_kid', .7]]);
// 146 «„Beide Seiten:»
shot(174.34, 'C', 'punch', L => { const W_ = lotteWand(L); const q = surf(48.6, 2.05, 3); const c = put(ich, q.x, q.y, q.z, -PI / 2); c.blob.visible = false; winterIch(c); rufen(c, L, 0, 1); onFace(c, 7, -.4, -4.5, 40, L.k, 6); badge('tag', 'BEIDE SEITEN:', W / 2, H * .15, clamp(L.lt / .1), 1, 1.2); sh(hp(c), 14); }, [[0, 'horn_blow', .8]]);
// 147 «Hört auf bei Sprung tausend.“»: «STOPP BEI SPRUNG 1000»
shot(174.96, 'Z', 'punch', L => { const W_ = lotteWand(L); const q = surf(48.6, 2.05, 3); const c = put(ich, q.x, q.y, q.z, -PI / 2); c.blob.visible = false; winterIch(c); rufen(c, L, 0, 1); onFace(c, 8, -.6, -4.8, 40, L.k, 6.4);
  bigNum('SPRUNG 1000', clamp((L.lt - .9) / .15), 'red', .17, 1.15); badge('tag', 'HÖRT AUF BEI…', W / 2, H * .1, clamp(L.lt / .1), 1, 1); sh(hp(c), 14); }, [[0, 'horn_blow', .8], [.9, 'impact', .7]]);
// 148 «Sie muss quer über die ganze Welt.»: a vista de pájaro: la ola de brazos cruza la pradera de pueblo en pueblo
shot(177.189, 'W', null, L => { welt(L, 300, 0); const list = DX; list.forEach((c, i) => { const x = 420 - i * 14, z = Math.sin(i * 1.7) * 30; put(c, x, 0, z, -PI / 2); const k = clamp(1 - Math.abs(x - (440 - L.lt * 260)) / 40); actuar(c, 0, [[0, { aLx: 2.8 * k + .1, aRx: 2.8 * k + .1, aLz: .4, aRz: .4 }]], { T: L.T + i }); cara(c, L.T + i, k > .3 ? { expr: 'shout', mouth: 'scream' } : { expr: 'neutral' }); c.root.scale.setScalar(1.6); });
  cm([520, 130, 140, 160, 0, 0, 50], [500, 126, 136, 140, 0, 0, 50], L.k); sh(V(250, 0, 0), 200); }, [[0, 'crowd_wave', .9]]);
// 149 «Von Mund zu Mund.»: tres Rufer, uno detrás de otro, se pasan el mensaje
shot(179.075, 'S', null, L => { welt(L, 0, -30); [[DX[2], -14, -40], [DX[4], 0, -30], [DX[6], 14, -20]].forEach(([c, x, z], i) => { put(c, x, 2.3, z, -.4); c.root.scale.setScalar(.72); c.blob.visible = false; const on = clamp((L.lt - i * .28) / .12) * clamp((i * .28 + .4 - L.lt) / .1 + 1);
    if (on > .1) rufen(c, L, i + 1, on); else { actuar(c, 0, [[0, GEST.listen]], { T: L.T }); hornHang(c, i + 1); cara(c, L.T, { expr: 'determined' }); } });
  PEDS.forEach((p, i) => show(p, [-14, 0, 14][i], 0, [-40, -30, -20][i])); badge('tag', '…SPRUNG 1000!', W / 2, H * .14, clamp(L.lt / .15), 1, 1);
  cm([-30, 9, -58, 2, 4, -30, 44], [-26, 9, -54, -2, 4, -30, 44], L.k); sh(V(0, 0, -30), 30); }, [[0, 'horn_blow', .6], [.28, 'horn_blow', .6], [.56, 'horn_blow', .6]]);
// 150 «Wenn sie richtig ankommt,»: al otro lado, junto a la otra torre, un Rufer lo recibe y asiente
shot(180.238, 'W', null, L => { welt(L, -1100, 20, { dusk: true }); show(PED2[0], -1100, 0, 20); const a = put(DX[8], -1100, 2.3, 20, .6); a.blob.visible = false; actuar(a, 0, [[0, GEST.listen], [.6, { headX: .2 + Math.sin(L.T * 10) * .15 }, { dur: .2 }]], { T: L.T }); hornHang(a, 3); cara(a, L.T, { expr: L.lt > .6 ? 'happy' : 'determined' });
  BAD_.push({ kind: 'bubble', text: 'SPRUNG 1000!', w3: hp(a).add(V(0, 3, 0)), s: spring(clamp((L.lt - .1) / .15) * 1.6), a: 1, on: L.lt > .1 }); onBody(a, 16, .6, .1, 44, L.k, 14); sh(V(-1100, 0, 20), 24); }, [[.1, 'horn_far', .5], [.7, 'nod', .4]]);
// 151 «muss nie wieder jemand springen.»: (imaginado) la cuerda quieta en el suelo; la gente tumbada en la hierba, los niños corren, luz dorada
shot(181.473, 'F', null, L => { welt(L, 0, 10); setRope(0); [[oma, -6, 8], [mutter, 4, 6], [DX[14], -2, 14]].forEach(([c, x, z], i) => { put(c, x, .6, z, .3); c.root.rotation.x = -PI / 2; c.blob.visible = false; applyPose(c, { aLx: 2.8, aRx: 2.6, aLz: .4, aRz: .5 }); cara(c, L.T + i, { eyes: 'closed', mouth: 'smile', noBlink: true }); });
  [[DX[15], -8], [DX[16], 6]].forEach(([c, x], i) => { const z = 2 + L.lt * 8 + i * 3; put(c, x + L.lt * 4, Math.abs(Math.sin(L.T * 12 + i)) * .3, z, .4); actuar(c, 0, [[0, runP(L.T, i)]], { T: L.T }); c.root.scale.setScalar(.6); laughF(c, L.T + i); });
  confRain(V(0, 0, 10), L.T, 30, 20, 20, 14); orbit(V(0, 2, 9), lerp(22, 19, L.k), .2, .3, 46); sh(V(0, 0, 9), 24); }, [[0, 'birds', .6], [.2, 'laugh_kids', .5], [.4, 'music_box', .4]]);
// 152 «Wenn sie als Schnecke ankommt,»: el mensaje llega mal: un Rufer, con un caracol en la mano: «SCHNECKE?»
shot(183.055, 'C', 'punch', L => { welt(L, -300, -260); show(PED2[0], -300, 0, -252); const a = put(DX[5], -300, 2.3, -252, .4); a.blob.visible = false; actuar(a, 0, [[0, { aLx: 1.6, aLe: 1.0, aLz: .3, headX: .25, headY: .2 }]], { T: L.T }); cara(a, L.T, { expr: 'confused', mouth: 'o' });
  attach(SNAILS[12], a.aL.hand, [0, -.6, .7], [0, 0, 0], .9); onBody(a, 11, .3, .08, 40, L.k, 9.5); badge('tag', 'SCHNECKE?', W / 2, H * .15, clamp(L.lt / .12), 1, 1.2); sh(V(-300, 0, -252), 18); }, [[0, 'wrong_buzz', .6], [.2, 'snail_slime', .4]]);
// 153 «lässt eine Seite los.»: en la otra torre, las manos se sueltan
shot(184.529, 'S', null, L => { const W_ = turmNah(L, 40, { rows: 3, cols: 4, list: DX.slice(10, 22) }); const u = clamp((L.lt - .3) / .4); W_.forEach((c, i) => { applyPose(c, { aLz: lerp(1.45, .2, u), aRz: lerp(1.45, .2, u), aLx: u * 1.2, aRx: u * 1.2, aLe: .2, aRe: .2 }); cara(c, L.T + i, u > .3 ? { eyes: 'terror', mouth: 'scream' } : { expr: 'tired' }); });
  const p = surf(48); cm([p.x - 22, p.y + 2, p.z, p.x, p.y, p.z, 40], [p.x - 20, p.y + 2, p.z, p.x, p.y, p.z, 40], L.k); TINT = 'rgba(200,0,30,.18)'; sh(p, 24); }, [[.3, 'release', .6], [.5, 'gasp_crowd', .6]]);
// 154 «Und die andere nicht.»: la cuerda da un latigazo y se desploma; oscuridad
shot(185.861, 'W', null, L => { welt(L, 0, 0, { dusk: true, grass: false, rings: false }); const k = easeIn(clamp(L.lt / .9)); setRope(PI); ROPE.position.y = -k * 390; cm([0, 3, 70, 0, 160, 0, 64], [0, 3, 68, 0, 120, 0, 64], L.k); DARK = clamp((L.lt - .5) / .4) * .55; TINT = RED; SHAKE = k * .6; }, [[0, 'whip', .9], [.5, 'boom', .8]]);
// 155 «Ich bin raufgeklettert,»: subo por el muro hacia Lotte
shot(186.97, 'Z', null, L => { const W_ = lotteWand(L, { lf: { expr: 'warm' } }); const q = surf(lerp(40.6, 44.6, L.k), 2.05, 2.8); const c = put(ich, q.x, q.y, q.z, PI / 2 - .4); c.blob.visible = false; winterIch(c); actuar(c, 0, [[0, KLETTER(L.T)]], { T: L.T }); cara(c, L.T, { expr: 'determined', eyes: 'up' });
  const p = hp(lotte); cm([p.x - 18, p.y - 4, p.z + 3, p.x, p.y - 4, p.z, 44], [p.x - 16, p.y - 3, p.z + 2.6, p.x, p.y - 3.4, p.z, 44], L.k); sh(p, 20); }, [[0, 'climb', .6]]);
// 156 «bis Lotte mein Handgelenk gepackt hat.»: su mano agarra la mía
shot(188.05, 'C', null, L => { const W_ = juntos(L, { lf: { expr: 'warm' }, if: { expr: 'happy' } }); applyPose(lotte, { aLz: 1.45, aRz: 1.45, aLe: .1, aRe: .1 }); const h = hp(lotte).lerp(hp(ich), .5).add(V(0, -1.2, 0));
  cm([h.x - 13, h.y + .6, h.z, h.x, h.y, h.z, 40], [h.x - 12, h.y + .6, h.z, h.x, h.y, h.z, 38], L.k); sh(h, 12); }, [[.1, 'grip', .7], [.3, 'chime', .5]]);
// 157 «Jetzt zählen wir laut.»: los dos en el muro, entre todos; todos abren la boca para contar
shot(189.829, 'W', null, L => { juntos(L, { lf: { expr: 'determined', mouth: 'talk' }, if: { expr: 'determined', mouth: 'talk' }, ff: n => ({ expr: 'determined', mouth: Math.sin(L.T * 9 + n) > 0 ? 'talk' : 'o' }) }); const p = hp(lotte).lerp(hp(ich), .5);
  cm([p.x - 26, p.y + 2, p.z + 2, p.x, p.y - 1, p.z, 44], [p.x - 22, p.y + 1.5, p.z + 1.6, p.x, p.y - 1, p.z, 42], L.k); sh(p, 26); }, [[0, 'crowd_murmur', .6]]);
// 158 «Neunhundertachtundneunzig.» (zoom lento): «998»; nuestras caras, la cuerda pasa por debajo
shot(191.08, 'W', 'slow', L => { juntos(L, { lf: { expr: 'determined', mouth: kitLips(L.T, spoken(191, 192.6)) || 'flat' }, if: { expr: 'determined', mouth: kitLips(L.T, spoken(191, 192.6)) || 'flat' }, phi: 1.2 + L.lt * .8 }); const p = hp(lotte).lerp(hp(ich), .5);
  cm([p.x - 15, p.y + 3, p.z + 1, p.x, p.y + 1.8, p.z, 40], [p.x - 13, p.y + 3, p.z + .8, p.x, p.y + 1.8, p.z, 38], L.k); bigNum('998', clamp(L.lt / .15), 'gold', .16, 1.5); sh(p, 14); }, [[0, 'drum', .7]]);
// 159 «Neunhundertneunundneunzig.»: «999»: la cámara sale disparada hacia el mundo; la cuerda en lo alto, a punto…
shot(192.88, 'C', 'punch', L => { juntos(L, { lf: { eyes: 'closed', mouth: 'flat', noBlink: true }, if: { eyes: 'closed', mouth: 'flat', noBlink: true }, phi: 2.6 + L.lt * .4 }); const p = hp(lotte).lerp(hp(ich), .5);
  cm([p.x - 11, p.y + 2.4, p.z + .6, p.x, p.y + 1.8, p.z, 38], [p.x - 60, p.y + 30, p.z + 20, p.x, p.y - 10, p.z, 50], L.k, easeIn); bigNum('999', clamp(L.lt / .12), 'red', .16, 1.8); DARK = clamp((L.lt - 2.2) / .3); sh(p, 30); }, [[0, 'drum', .9], [.05, 'heartbeat', .7], [2.2, 'riser_cut', .6]]);
// portadas: se hacen al final (node cover.mjs)
window.renderCover = () => {};


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4, B: 8 };
const CUES = [];
const TRS = { W: ['whoosh_soft', 'swipe', 'whoosh_down'], Z: ['swoosh_up', 'zoom_in', 'whoosh_up'], F: ['flash', 'click_set', 'sparkle'], S: ['swipe', 'tape', 'whoosh_soft'], R: ['whirl', 'clock_spin', 'whoosh'], I: ['iris_pop', 'pop', 'pling'], C: ['thump', 'impact_soft', 'fist'], B: ['soft_air', 'soft_air', 'soft_air'] };
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
  hideAll(); BAD_.length = 0; s.fn(L); while (POST.length) POST.shift()(); clearFaces();
  if (HQ) { renderer.toneMappingExposure *= +(QS.get('exp') ?? .85); grade.uniforms.sat.value = +(QS.get('sat') ?? 1.38); grade.uniforms.sharp.value = .6; grade.uniforms.vig.value = Math.min(grade.uniforms.vig.value, .32); bloom.strength = Math.min(Math.max(bloom.strength, .14), BLOOMMAX); bloom.threshold = .88; ao.enabled = QS.get('ao') !== '0'; DOF = 1; }
  if (BW > 0) { grade.uniforms.sat.value *= 1 - BW; grade.uniforms.sharp.value += BW * .6; }
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud', 'kick'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
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
  { const fd = camera.position.distanceTo(CAMT); bokeh.uniforms.focus.value = fd; bokeh.uniforms.aperture.value = DOF * .0022 * clamp((26 - fd) / 14); bokeh.enabled = HQ && QS.get('dof') === '1'; }
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
  if (tr === 'B') { octx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`; octx.fillRect(0, 0, W, H); }   // fundido a negro suave (momentos tristes)
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const f of FX2D) f(octx); for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { applyPose, hp, ich, lotte, cam, renderer, composer, bloom, sun, grade, scene, camera, ROPE, TURM, setRope, GRASS };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

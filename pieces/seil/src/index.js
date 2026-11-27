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
  ROPE.visible = false; RINGS.visible = false; TURM.visible = false; TURM2.visible = false; NAH.visible = false; SNOW.visible = false; GRASS.visible = false; WIESE.visible = false;
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
function winter(L) { day(); setSky([.52, .6, .72], [.72, .78, .86], [.9, .92, .95]); sun.intensity = 1.4; sun.color.setRGB(.92, .95, 1); hemi.intensity = 1.25; hemi.color.setRGB(.9, .94, 1); scene.fog.color.setRGB(.86, .9, .95); scene.fog.density = .0022; BIRDSON = 0; SNOW.userData.update(L.T, CAMT); }
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
const PX = -140, PZ = 70; NOGRASS.push([PX - 8, PZ - 8, PX + 8, PZ + 14]); const PARC = P_(parcela(null, 0, 0, 7)); const ZAUN = P_(zaun(null, -6, 0, 6, 0));
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
  cm([70, 2.2, 34, 70, 3.2, -40, 44], [70, 2.8, 30, 70, 3, -40, 46], L.k); sh(V(70, 0, 0), 40); }, [[.2, 'rope_far', .8], [.85, 'rope_swish', 1]]);
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
shot(9.60, 'W', null, L => { welt(L, -10, -8); const c = put(DX[3], -10, 0, -8, .5); const u = clamp((L.lt - .55) / .2);
  actuar(c, 0, [[0, { crouch: .55, lean: .55, headX: .4, aLx: 1.2, aRx: 1.2, aLe: .5, aRe: .5, lLx: .9, lLk: 1.4, lRx: .2, lRk: .6 }], [.6, { crouch: .2, lean: -.2, headX: -.3, aLx: 1, aRx: 1, aLz: .8, aRz: .8, aLe: 1.4, aRe: 1.4 }, { dur: .15 }]], { T: L.T });
  cara(c, L.T, u > .2 ? { eyes: 'terror', mouth: 'scream', noBlink: true } : { expr: 'neutral', eyes: 'down' }); cuerda(L, .95, -8, VV);
  vecinos(L, [[-18, -14, .3], [-4, -18, -.2]], .95, -8, VV, 18); onBody(c, 12, .9, .1, 42, L.k, 10.5); sh(V(-10, 0, -8), 22); }, [[.1, 'shoelace', .4], [.55, 'gasp', .5], [.85, 'rope_swish', .8]]);
// 12 «den nimmt das Seil mit.»: la cuerda se lo lleva enredado, dando vueltas, pradera adelante hasta perderse
shot(10.586, 'F', null, L => { welt(L, -10, 30); const v = 70, z = -8 + v * (L.lt + .1); cuerda(L, -.1, -8, v); const c = put(DX[3], -10, ropeY(z) + .6, z, 0); c.blob.visible = false; c.root.rotation.set(-1.2 + L.lt * 6, 0, L.lt * 9);
  actuar(c, 0, [[0, { aLx: 2.6, aRx: 2.2, aLz: .9, aRz: .7, lLx: -.6, lRx: .8, lLk: 1, lRk: .4 }]], { T: L.T }); cara(c, L.T, { eyes: 'terror', mouth: 'scream', noBlink: true });
  vecinos(L, [[-18, -10, -2.8], [-2, -12, 2.8]], -.1, -8, v, 20, { f: { expr: 'shock', mouth: 'o' } }); cam([-6, 4.5, z - 13 + L.k * 3], [-10, ropeY(z) + 1.5, z], 42); sh(V(-10, 0, z), 30); }, [[0, 'whoosh', .7], [.1, 'scream_far', .6], [.4, 'rope_drag', .6]]);
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
  onBody(c, 14, .3, .1, 42, L.k, 12.5, null, 2.6); badge('gold', '0:0' + Math.max(1, 9 - Math.floor(L.lt * 6)), W / 2, H * .13, clamp(L.lt / .15)); sh(V(12, 0, 26), 22); }, [[0, 'broom', .5], [.5, 'tick', .4], [1.0, 'jump', .5]]);
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
  confetti(V(0, 2, -21), L.t0, L.T, 40, .8); cm([2, 1.6, -31, 0, 5.6, -21, 48], [1.6, 1.8, -30, 0, 5.8, -21, 46], L.k); sh(V(0, 0, -21), 20); }, [[.05, 'jump', .6], [.15, 'cheer_small', .6]]);
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
  cuerda(L, 3.5, p[1], 300); cm([p[0] + 2.2, 9.6, p[1] + 9, p[0] - .3, 7, p[1] - 6, 42], [p[0] + 1.8, 9.4, p[1] + 8, p[0] - .3, 7, p[1] - 6, 40], L.k); sh(V(p[0], 0, p[1]), 20); }, [[0, 'wind', .5], [.3, 'rope_far', .6]]);
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

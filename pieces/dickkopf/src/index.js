// DICKKOPF — «In dieser Stadt wird dein Kopf mit jedem HUSS größer.» Yo (sudadera mostaza, gorra verde) nunca he hecho HUSS; las cabezas grandes flotan;
// solo la verdad las encoge (Bürgermeister, Paketbote, Oma)… y al final un elogio de Jonas me hace HUSS y mi cabeza atraviesa las nubes.
// Motor: el de statue / schutzengel (luz realista, AO, supermuestreo) con sombras 4096, niebla de distancia y más volumen. Planos en src/p/*.js.
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt, bench } from './props.js';
import { hufenbach } from './gort.js';
import { kirche } from './nsets.js';
import { freibad, lieferwagen } from './asets.js';
import { bad, wolken } from './wsets.js';
import { saal, balloons, partyHat } from './hsets.js';
import { pigeon, karton } from './stwelt.js';
import { makeIch, makeBote, makeVecino, makeJonas, makeKind, makeMayor, makeOma } from './dvolk.js';
import { paket, giesskanne, salatschuessel, wattestaebchen, turnschuhe, haribo, baerenberg, schneewolke, rednerpult, band, schere, ente, fenster, lichter, glow, ladentuer } from './dwelt.js';
import { makeExtra } from './ecast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';


await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 94.6, U = W / 720, PI = Math.PI;
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
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -.0003; sun.shadow.normalBias = .12; sun.shadow.radius = 3.5; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
// luces locales (siempre en la escena; intensidad 0 si no se usan: así no se recompilan los shaders)
const LP = Array.from({ length: 4 }, () => { const l = new THREE.PointLight(0xffb060, 0, 60, 1.6); scene.add(l); return l; });
const LANT = new THREE.PointLight(0xffc070, 0, 34, 1.4); scene.add(LANT);   // farol del guardia (luz en la cara)
function sh(p0, s = 30) { const q = 2 * s / 2048 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-95, 105, 85)); rim.target.position.copy(p); rim.position.copy(p).add(V(70, 45, -100)); }
const OLF = HQ ? 0 : 1; const OC = 3 * SS * OLF, OS = 2.2 * SS * OLF, OP = 1.8 * SS * OLF;
const M2U = 3.95;
// ---------- escenarios ----------
// Hufenbach (x = 0): carretera en x = 26 (a lo largo de z), casas al oeste (x = -64, miran a +x) y al este (x = 52, miran a -x), Rathaus al norte (z = -92).
// Kirche al oeste (torre en KT, balcón a y = 46). Interiores/lejanos: Freibad (FBX), baño de Jonas (BDX), fachada con mi ventana (FNX), sala de fiestas (SAX), cielo de nubes (WKX).
const FBX = 1500, BDX = 2100, FNX = 2600, SAX = 3200, WKX = 3900;
const HB = hufenbach(scene); HB.RANK.visible = false;
kirche(HB.G, -112, -6, PI / 2); const KT = V(-106, 46, -6);   // torre (lado +x), balcón a 46
const FB = freibad(scene, FBX); const PULT = rednerpult(FB.g || FB); PULT.position.set(0, .4, 19); const BAND = band(FB.g || FB, 14); BAND.position.set(0, .4, 24);
const BD = bad(scene, BDX), FN = fenster(scene, FNX), SA = saal(scene, SAX), WK = wolken(scene, WKX);
SA.g.children.forEach(o => { if (Math.abs(o.position.z + 15.7) < .05 && Math.abs(o.position.y - 11) < .05) o.visible = false; }); for (const k of ['FB', 'CK', 'TB']) if (SA[k]) SA[k].visible = false;
{ const b = textPlane(22, 2.6, 880, 104, (c, w, h) => { c.fillStyle = '#ff4a8a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffd23f'; c.lineWidth = 8; c.strokeRect(4, 4, w - 8, h - 8); txt(c, 'DANKE FÜR DIE WAHRHEIT!', w / 2, h / 2 + 4, 64, '#ffffff'); }, .3); b.position.set(0, 11, -15.7); SA.g.add(b); }
const SETS = { HB: HB.G, FB: FB.g || FB, BD: BD.g || BD, FN: FN.g, SA: SA.g || SA, WK: WK.g };
for (const k in SETS) outline(SETS[k], OS);
// ---------- reparto ----------
const ich = makeIch(scene), jonas = makeJonas(scene), bote = makeBote(scene), oma = makeOma(scene), mayor = makeMayor(scene);
const KIDS = [0, 1, 2, 3].map(i => makeKind(scene, i)), VEC = Array.from({ length: 6 }, (_, i) => makeVecino(scene, i));
kitFace(ich, 'kid'); kitFace(jonas, 'hero'); kitFace(bote, 'plain'); kitFace(oma, 'girl'); kitFace(mayor, 'mustache'); KIDS.forEach(c => kitFace(c, 'kid')); VEC.forEach((c, i) => kitFace(c, ['plain', 'girl', 'hero', 'girl', 'mustache', 'kid'][i]));
{ const gl = new THREE.Group(); oma.head.add(gl); for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.2, .04, 6, 20), mat(0x6a3ad8)); r.position.set(s * .27, .78, .7); gl.add(r); } }
const EXS = Array.from({ length: 16 }, (_, i) => { const c = makeExtra(scene, i + 50); kitFace(c, ['girl', 'plain', 'girl', 'hero', 'girl', 'mustache'][i % 6]); return c; });
const MAIN = [ich, jonas, bote, oma, mayor, ...KIDS, ...VEC];
const POOL = [...MAIN, ...EXS];
POOL.forEach(c => outline(c.root, OC));
const HATS = POOL.map((c, i) => partyHat(c.head, i));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(.5, 'rgba(0,0,0,.26)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const PROPS = [];
const P_ = o => { if (!o.parent) scene.add(o); PROPS.push(o); return o; };
const PG = Array.from({ length: 6 }, (_, i) => P_(pigeon(scene, i)));
const PAK = Array.from({ length: 4 }, (_, i) => P_(paket(scene, ['PAKET', 'EILIG', 'PAKET', 'ZERBRECHLICH'][i])));
const VAN = P_(lieferwagen(scene));
const KANNE = P_(giesskanne(scene)), SALAT = P_(salatschuessel(scene)), STAB = P_(wattestaebchen(scene)), SCHUHE = P_(turnschuhe(scene));
const HAR = Array.from({ length: 6 }, () => P_(haribo(scene))); const BERG = P_(new THREE.Group()); baerenberg(BERG);
const SNOW = P_(schneewolke(scene)), SCHERE = P_(schere(scene)), ENTE = P_(ente(scene));
const BALL = P_(balloons(scene, 0, 0, 0, 5, 2)), BALL2 = P_(balloons(scene, 0, 0, 0, 4, 5));
const LICHT = P_(new THREE.Group()); lichter(LICHT, [-14, 12, 0], [14, 12, 0], 22, 2); lichter(LICHT, [-14, 13, -8], [14, 13, -8], 22, 2);
const PHONE = P_(new THREE.Group()); box(1.1, 2.1, .14, mat(0x1a1a22, { roughness: .3, metalness: .4 }), .12, PHONE, 0, 0, 0);
const CONF = Array.from({ length: 40 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xffd23f, 0xffffff, 0x3a7ad8, 0xff4a8a, 0x8ad84a][i % 5], side: THREE.DoubleSide })); scene.add(p); return P_(p); });
const DUST = Array.from({ length: 24 }, () => P_(sphere(1, mat(0xc8c4bc, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 8, 6)));
const SWEAT = Array.from({ length: 3 }, () => P_(sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8)));
const TEAR = Array.from({ length: 4 }, () => P_(sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8)));
const TUER = P_(ladentuer(scene));
const BULB = P_(new THREE.Group()); { sphere(.8, glow(0xffe880, 2.4), BULB, 0, 0, 0, 16, 12); cyl(.4, .4, .6, mat(0x9a9aa2, { metalness: .7 }), 10, BULB, 0, -.9, 0); }

// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.16, .44, .96], [.45, .72, 1], [.86, .94, 1]); sky.moon.visible = false; sky.sky.material.uniforms.cloud.value = 1; sky.sky.material.uniforms.starK.value = 0; hemi.intensity = 1.0; hemi.color.setRGB(.82, .9, 1); hemi.groundColor.setRGB(.6, .55, .42); sun.intensity = 3.0; sun.color.setRGB(1, .9, .76); rim.intensity = 1.9; rim.color.setRGB(1, .93, .82);
  scene.fog.color.setRGB(.82, .9, 1); scene.fog.density = .0006; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function dusk() { day(); sun.color.setRGB(1, .66, .42); sun.intensity = 2.3; setSky([.14, .18, .52], [.74, .42, .56], [1, .6, .34]); hemi.color.setRGB(.9, .74, .8); scene.fog.color.setRGB(.9, .66, .6); rim.color.setRGB(1, .6, .4); }
// noche de luna: azul profundo con luces cálidas (como la referencia), sin quedarse oscuro
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = .92; setSky([.01, .03, .1], [.03, .08, .2], [.08, .14, .28]); sky.sky.material.uniforms.cloud.value = 0; sky.sky.material.uniforms.starK.value = 1; sky.moon.visible = false; sky.moon.position.set(-300, 520, -1300); hemi.intensity = .62; hemi.color.setRGB(.45, .6, 1); hemi.groundColor.setRGB(.16, .16, .26); sun.intensity = .95; sun.color.setRGB(.62, .74, 1); rim.intensity = 1.3; rim.color.setRGB(.7, .82, 1);
  scene.fog.color.setRGB(.04, .08, .18); scene.fog.density = .0022; bloom.strength = .34; bloom.threshold = .78; FILL.intensity = fill; FILL.color.setRGB(1, .86, .7); BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; bloom.threshold = .86; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.blob.visible = true; c.head.scale.setScalar(1); if (c.pack) c.pack.visible = true; if (c.flowers) c.flowers.visible = false; }
  for (const h of HATS) h.visible = false;
  for (const p of PROPS) { p.visible = false; p.rotation.order = 'XYZ'; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const k in SETS) SETS[k].visible = false; FX2D.length = 0; for (const l of LP) l.intensity = 0;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.2; grade.uniforms.sharp.value = .5; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; DOF = 1; day(); }
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
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { dist *= 1.75; if (dist2 != null) dist2 *= 1.75; const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .85, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .45 + dy, h.z + fz * d - fx * side], [h.x, h.y - .05, h.z], fov); }
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
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null, dy = 3.3) { const s = ch.spec.scale || 1, p = ch.root.position, q = easeInOut(clamp(k)), d = lerp(dist, dist2 ?? dist * .88, q); const hy = hp(ch).y, mid = (p.y + hy) / 2 + .6 * s; const c = V(p.x, lerp(mid, hy + .45 * s, clamp((13 - d) / 7)), p.z); orbit(c, d * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const _hb = new THREE.Box3(); function heightTo(ch, m) { ch.root.updateMatrixWorld(true); _hb.makeEmpty(); ch.root.traverseVisible(o => { if (o.isMesh && o !== ch.blob) _hb.expandByObject(o, false); }); const t = _hb.max.y - ch.root.position.y; ch.root.scale.multiplyScalar(m * M2U / t); return ch; }
const toCam = ch => { const p = ch.root.position; ch.root.rotation.y = Math.atan2(camera.position.x - p.x, camera.position.z - p.z); };
// ---------- escenarios por plano ----------
function lp(i, x, y, z, k = 40, col = 0xffb060, d = 60) { const l = LP[i]; l.position.set(x, y, z); l.intensity = k; l.color.setHex(col); l.distance = d; }
function town(L, o = {}) { use('HB'); HB.RANK.visible = false; if (o.night) { night(o.fill ?? 34); for (let i = 0; i < 3; i++) lp(i, [-30, 18, 34][i] + (o.x ?? 0), 10, [0, -20, 20][i] + (o.z ?? 0), 60); } else if (o.dusk) dusk(); else day(); }
function pool(L) { use('FB'); day(); }
function bath(L) { use('BD'); inside(1.0, 40); }
function window_(L) { use('FN'); day(); FN.L.intensity = 60; }
function party(L) { use('SA'); inside(.8, 40); FILL.color.setRGB(1, .8, .9); }
function sky_(L, o = {}) { use('WK'); if (o.night) { night(20); } else day(); }
// ---------- cabezas ----------
// kopf(ch, s): escala de la cabeza (1 = normal); huss(k): golpe con rebote; floatP: postura flotando (piernas colgando, brazos abiertos)
const kopf = (ch, s) => { ch.head.scale.setScalar(s); return ch; };
const pop = (s0, s1, k) => lerp(s0, s1, clamp(spring(clamp(k) * 1.8)));
const floatP = (T, i = 0) => ({ lLx: .25 + Math.sin(T * 2 + i) * .15, lRx: -.1 - Math.sin(T * 2 + i) * .15, lLk: .5, lRk: .3, aLz: .7 + Math.sin(T * 1.7 + i) * .15, aRz: .7 - Math.sin(T * 1.7 + i) * .15, aLx: .3, aRx: .3 });
function flot(ch, L, x, y, z, ry, s = 3, i = 0, o = {}) { put(ch, x + Math.sin(L.T * .7 + i) * .4, y + Math.sin(L.T * 1.3 + i) * .5, z, ry + Math.sin(L.T * .5 + i) * .15); kopf(ch, s); actuar(ch, 0, [[0, { ...floatP(L.T, i), ...(o.pose || {}) }]], { T: L.T, weight: false }); ch.blob.visible = false; if (o.face !== false) cara(ch, L.T, o.f || { expr: o.expr || 'happy' }); return ch; }
// gritar HUSS: boca abierta, cabeza atrás, puños; con badge rojo
function hussPose(ch, L, t0 = 0, o = {}) { const k = clamp((L.lt - t0) / .12); actuar(ch, 0, [[0, { aLx: .6 + k * .6, aRx: .6 + k * .6, aLz: .3, aRz: .3, aLe: 1.6, aRe: 1.6, headX: -.25 * k, lean: -.12 * k, crouch: .05, ...(o.pose || {}) }]], { T: L.T }); cara(ch, L.T, { eyes: 'squint', mouth: k > .2 ? 'scream' : 'o' }); }
function hussFX(L, t0 = 0, y = .2, sc = 1.2) { y = .6; const k = clamp((L.lt - t0) / .16); if (L.lt >= t0) { badge('red', 'HUSS!', W / 2, H * y, k, 1, sc); FX2D.push(c => { c.save(); c.globalAlpha = .55 * (1 - clamp((L.lt - t0) / .6)); c.strokeStyle = '#ffffff'; c.lineWidth = 10; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283; c.beginPath(); c.moveTo(W / 2 + Math.cos(a) * 300, H * .38 + Math.sin(a) * 300); c.lineTo(W / 2 + Math.cos(a) * 620, H * .38 + Math.sin(a) * 620); c.stroke(); } c.restore(); }); } }
// centro de la cabeza (crece hacia arriba desde el cuello) y cámaras a la cara
const hc = ch => { const s = ch.head.scale.x * (ch.spec.scale || 1) * ch.root.scale.y; return hp(ch).add(V(0, .66 * s, 0)); };
function fcam(ch, d, k = 0, d2 = null, yaw = 0, dy = 0, fov = 40, pitch = .06) { const c = hc(ch).add(V(0, dy, 0)); orbit(c, lerp(d, d2 ?? d * .85, easeInOut(clamp(k))), ch.root.rotation.y + yaw, pitch, fov); }
// gente paseando / mirando en la plaza
const SPOTS = [[-14, 36, PI / 2], [10, 46, -PI / 2], [-6, 58, PI * .8], [14, 22, -PI * .7], [-22, 12, PI / 3], [6, 6, -PI / 3]];
function extras(L, list, spots, mode = 'walk', o = {}) { list.forEach((c, i) => { const [x, z, ry] = spots[i % spots.length]; const m = Array.isArray(mode) ? mode[i % mode.length] : mode; if (o.heads) kopf(c, o.heads[i % o.heads.length]); if (m === 'walk') walk(c, L, x, z, ry, 2.2, i, { expr: 'happy' }); else crowdGuy(c, x, z, L, i, { mode: m, ry }); }); }
function walk(ch, L, x, z, ry, speed = 2.4, i = 0, o = {}) { const d = speed * (L.lt + (o.t0 ?? 0)); put(ch, x + Math.sin(ry) * d, 0, z + Math.cos(ry) * d, ry); ch.root.position.y = Math.abs(Math.sin(L.T * 9 + i)) * .1; actuar(ch, 0, [[0, { ...walkP(L.T, i), ...(o.pose || {}) }]], { T: L.T }); if (o.face !== false) cara(ch, L.T, o.f || { expr: o.expr || 'neutral' }); return ch; }
function bigNum(text, k, col = '#ffffff', y = .2, sc = 1) { badge(col === 'red' ? 'red' : col === 'gold' ? 'gold' : col === 'green' ? 'green' : 'big', text, W / 2, H * y, k, 1, sc); }
function dove(i, x, y, z, ry, T, f = 0) { const p = show(PG[i], x, y, z, ry, 1); p.userData.pose(T + i, f); return p; }
const CR = EXS; function clearFaces() {}

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
const KEY = /^(Stadt|Kopf|HUSS|größer|Paketbote|Haustür|Lieferwagen|Omas|Oma|groß|schneit|Jonas|Badewanne|gehusst|drin|ich|normal|nie|einziges|lachen|Digga|winzig|lächle|Einzige|Tür|schlimmer|schweben|Bürgermeister|Freibad|Rednerpult|weggeflogen|Sonntag|halbe|Dächern|Fenster|Gießkanne|gewinkt|angeschwebt|cool|Nein|Wattestäbchen|schrumpfte|Turnschuhe|kapiert|Sache|klein|Wahrheit|Kirchturm|Reden|Tauben|Runter|Pakete|Nachbarn|Dreimal|Kartoffelsalat|Radiergummi|schnell|sauer|landete|Party|Haribo|Decke|coolste|anders|Wolken|keiner)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
let DARK = 0, TINT = null, SHAKE = 0; let HUD = null; const FX2D = [];
// ---------- a: gancho, ejemplos, yo y la puerta (0 – 29,40 s) ----------
// Plaza de Hufenbach: acción hacia (0, 0, 30), cámara desde +z (al fondo el Rathaus). Casas del este en x ≈ 44 (fachadas), carretera x = 26.
const PZ = 30;
// 1 «In dieser Stadt»: picado desde el cielo que baja a la plaza llena de gente con cabezas enormes paseando
shot(0, 'Z', null, L => { town(L); extras(L, EXS.slice(0, 10), [[-14, 20, .6], [12, 26, -.8], [-4, 40, PI], [16, 44, -2.4], [-20, 48, 2.2], [4, 12, .3], [-10, 6, 1], [20, 8, -1.2], [-26, 30, 1.6], [8, 54, 2.8]], 'walk', { heads: [2.2, 1.6, 3, 2.6, 1.9, 2.8, 2.4, 1.7, 3.2, 2] });
  cm([30, 90, 110, 0, 0, 25, 50], [14, 26, 62, 0, 4, 22, 46], L.k, easeOut); sh(V(0, 0, 28), 50); }, [[0, 'whoosh_down', .6], [.4, 'crowd_murmur', .4]]);
// 2 «wird dein Kopf mit jedem»: un vecino de camisa azul coge aire, inflando el pecho; la gente pasa detrás
shot(.83, 'C', null, L => { town(L); const c = put(VEC[0], 0, 0, PZ, 0); const k = clamp(L.lt / 1.1); actuar(c, 0, [[0, { aLz: .2 + k * .3, aRz: .2 + k * .3, aLx: .2, aRx: .2, headX: -.15 * k, lean: -.06 * k }]], { T: L.T }); cara(c, L.T, { eyes: 'half', mouth: 'o' });
  extras(L, EXS.slice(10, 13), [[-12, PZ - 10, PI / 2], [12, PZ - 14, -PI / 2], [-6, PZ - 22, .4]], 'walk', { heads: [2.4, 2, 2.8] }); fcam(c, 15, L.k, 12.5, .25, -1.5, 42); sh(V(0, 0, PZ), 30); }, [[.1, 'inhale', .7]]);
// 3 «HUSS größer.»: ¡HUSS! y la cabeza le crece de golpe (1 → 2,2)
shot(2.09, 'F', 'punch', L => { town(L); const c = put(VEC[0], 0, 0, PZ, 0); hussPose(c, L); kopf(c, pop(1, 2.2, (L.lt - .05) / .35)); hussFX(L, 0, .17);
  extras(L, EXS.slice(10, 12), [[-12, PZ - 8, .3], [12, PZ - 12, -.4]], 'shock', { heads: [2.4, 2] }); fcam(c, 19, L.k, 16, 0, -.4, 44); sh(V(0, 0, PZ), 30); }, [[0, 'huss', 1], [.06, 'balloon_inflate', .7]]);
// 4 ¡HUSS! (2): una vecina con moño frente a la fuente: 1,8 → 2,6
shot(3.26, 'C', 'punch', L => { town(L); const c = put(VEC[1], -18, 0, -14, .5); hussPose(c, L); kopf(c, pop(1.6, 2.6, L.lt / .25)); hussFX(L, 0, .18, 1);
  orb(L.k, hc(c).add(V(0, -.5, 0)), null, [19, .7, .05, 44], [16.5, .55, .05, 44]); sh(V(-18, 0, -14), 30); }, [[0, 'huss', 1], [.03, 'balloon_inflate', .6]]);
// 5 ¡HUSS! (3): un niño de gorra junto al café: 2,2 → 3,1
shot(3.68, 'C', 'punch', L => { town(L); const c = put(KIDS[1], 30, 0, -34, -.5); hussPose(c, L); kopf(c, pop(2.2, 3.1, L.lt / .22)); hussFX(L, 0, .19, .95);
  orb(L.k, hc(c).add(V(0, -.3, 0)), null, [17, -.5, .1, 44], [15, -.35, .1, 44]); sh(V(30, 0, -34), 30); }, [[0, 'huss', 1], [.03, 'balloon_inflate', .6]]);
// 6 ¡HUSS! (4): plano general: tres cabezas enormes a la vez en la plaza; grúa hacia arriba
shot(4.0, 'W', null, L => { town(L); [[VEC[0], -8, PZ - 6, .3, 2.2], [VEC[1], 0, PZ - 10, 0, 2.6], [KIDS[1], 8, PZ - 6, -.3, 3.2]].forEach(([c, x, z, ry, s], i) => { put(c, x, 0, z, ry); hussPose(c, L, i * .05); kopf(c, s + L.k * .4); });
  hussFX(L, 0, .16, .9); cm([0, 4, PZ + 22, 0, 6, PZ - 8, 46], [0, 9, PZ + 18, 0, 7, PZ - 8, 46], L.k); sh(V(0, 0, PZ - 6), 34); }, [[0, 'huss', 1], [.05, 'balloon_inflate', .6]]);
// Paketbote: puertas de las casas del este (fachada ≈ x 44); él de espaldas a la puerta, mirando a -x
const BX = 37;
// 7 «Unser Paketbote husst»: el repartidor con un paquete delante de una puerta: ¡HUSS! (5,19) y la cabeza 1,6 → 2,3
shot(4.39, 'S', null, L => { town(L); const c = put(bote, BX, 0, 4, -PI / 2 + .25); attach(PAK[0], c.root, [0, 3.0, 1.5], [0, 0, 0], .85); const h = L.T >= 5.19;
  if (h) { hussPose(c, L, 5.19 - L.t0, { pose: { aLx: 1.2, aLe: 1.4 } }); kopf(c, pop(1.6, 2.3, (L.T - 5.19) / .25)); hussFX(L, 5.19 - L.t0, .17, .9); } else { actuar(c, 0, [[0, { aLx: 1.2, aLe: 1.4, aRx: .4, aRe: .3 }]], { T: L.T }); kopf(c, 1.6); cara(c, L.T, { expr: 'happy' }); }
  orb(L.k, hc(c).add(V(0, -.6, 0)), null, [21, -PI / 2 - .25, .08, 44], [17, -PI / 2 - .05, .08, 44]); sh(V(BX, 0, 4), 30); }, [[0, 'doorbell', .6], [.8, 'huss', 1], [.82, 'balloon_inflate', .6]]);
// 8 «an jeder Haustür.»: en la siguiente puerta, otro paquete, otro HUSS: 2,3 → 3,0; una vecina abre y se asusta
shot(5.59, 'C', 'punch', L => { town(L); const c = put(bote, BX, 0, -6, -PI / 2 - .2); attach(PAK[1], c.root, [0, 3.0, 1.5], [0, 0, 0], .85); hussPose(c, L, .05, { pose: { aLx: 1.2, aLe: 1.4 } }); kopf(c, pop(2.3, 3, (L.lt - .05) / .25)); hussFX(L, .05, .16, .9);
  const v = put(EXS[3], BX + 3, 0, -13, -PI / 2 - .6); crowdGuy(v, BX + 3, -13, L, 1, { mode: 'shock', ry: -PI / 2 + .5 }); orb(L.k, hc(c).add(V(0, -.8, 0)), null, [23, -PI / 2 + .3, .1, 44], [19, -PI / 2 + .15, .1, 44]); sh(V(BX, 0, -6), 30); }, [[0, 'doorbell', .5], [.05, 'huss', 1], [.08, 'balloon_inflate', .6]]);
// Lieferwagen en la carretera (x = 26) mirando a +z; puerta del conductor a la izquierda (x ≈ 23)
const VZ = 20;
// 9 «Jetzt passt sein Kopf nicht mehr»: camina hacia su furgoneta con la cabeza enorme (3,4) que se bambolea
shot(6.91, 'W', null, L => { town(L); show(VAN, 26, 0, VZ, 0); const c = walk(bote, L, 34, VZ + 20, -2.5, 2.6, 0, { expr: 'happy' }); kopf(c, 3.4); c.head.rotation.z = Math.sin(L.T * 4.5) * .12;
  const p = c.root.position; orbit(V(p.x, 9.5, p.z), lerp(25, 21, L.k), -2.5 + .5, .12, 46); sh(V(p.x, 0, p.z), 34); }, [[0, 'steps', .5], [.4, 'whistle', .3]]);
// 10 «in seinen Lieferwagen.»: intenta meterse por la puerta del conductor: la cabeza choca con el techo, la furgoneta se balancea
shot(8.03, 'C', 'punch', L => { town(L); const v = show(VAN, 26, 0, VZ, 0); const b = Math.max(0, Math.sin(L.lt * 9)) * Math.exp(-L.lt * 2); v.rotation.z = b * .06; const c = put(bote, 22.4, 0, VZ + 5.5, .9); kopf(c, 3.4); c.head.rotation.z = -.25 - b * .2;
  actuar(c, 0, [[0, { aRx: 1.4, aRz: .3, aRe: .4, aLx: .8, aLz: .5, lean: .15, headX: .2 }]], { T: L.T }); cara(c, L.T, { eyes: 'squint', mouth: 'grimace' }); sweat(c, L.T);
  orb(L.k, V(23, 8.5, VZ + 5), null, [24, .45, .12, 46], [21, .3, .12, 46]); sh(V(24, 0, VZ + 4), 30); }, [[0, 'bonk', .9], [.25, 'car_rock', .5], [.6, 'groan', .5]]);
// Oma en el banco del oeste (-36, 20) mirando a +x
// 11 «Omas Kopf ist so groß,»: grúa desde sus pies hasta la cabeza gigante (3,4) mientras hace punto
shot(9.4, 'Z', null, L => { town(L); const c = sit(oma, -35.4, 2.4, 20.3, PI / 2, L, { aLx: 1.0, aRx: 1.0, aLz: -.3, aRz: -.3, aLe: 1.5 + Math.sin(L.T * 9) * .2, aRe: 1.5 - Math.sin(L.T * 9) * .2 }); kopf(c, 3.4); cara(c, L.T, { expr: 'happy' });
  extras(L, EXS.slice(4, 6), [[-22, 6, -.3], [-24, 36, PI - .2]], 'walk', { heads: [2.2, 2.6] }); cm([-20, 3, 22, -35, 3, 20, 48], [-17, 9, 26, -35, 9, 20, 46], L.k); sh(V(-34, 0, 20), 30); }, [[0, 'whoosh_up', .4], [.2, 'knit', .4]]);
// 12 «dass es über ihr schneit.»: su propia nube de nieve encima de la cabeza; tirita y se sacude los copos
shot(10.52, 'F', null, L => { town(L); const c = sit(oma, -35.4, 2.4, 20.3, PI / 2, L, { aLx: .9, aRx: .9, aLz: .6, aRz: .6, aLe: 1.9, aRe: 1.9, headX: .05, ...shiver(L.T, 3) }); kopf(c, 3.4); cara(c, L.T, { expr: 'worried', mouth: 'wavy' });
  const h = hc(c); const s = show(SNOW, h.x, h.y + 4.6, h.z, 0, 1.2); s.userData.snow(L.T, 5.5); orb(L.k, h.add(V(0, -.6, 0)), null, [21, PI / 2 - .3, .08, 44], [18, PI / 2 - .1, .08, 44]); sh(V(-34, 0, 20), 30); }, [[0, 'flash', .3], [.1, 'wind_cold', .6], [.5, 'teeth_chatter', .4]]);
// Baño de Jonas (BDX): bañera en (BDX, 0, -6), borde a y ≈ 4,2
const TUBP = [BDX, 4.4, -6];
const inTub = (c, L, pose = {}) => { put(c, TUBP[0], sitY(c, TUBP[1]), TUBP[2], 0); actuar(c, 0, [[0, sitPose({ aLx: .4, aRx: .4, aLz: .5, aRz: .5, aLe: .5, aRe: .5, ...pose })]], { T: L.T, weight: false }); c.blob.visible = false; return c; };
// 13 «Mein bester Freund Jonas hat einmal in der Badewanne»: Jonas en la bañera con espuma, juega con el patito
shot(12.6, 'S', null, L => { bath(L); const c = inTub(jonas, L, { aRx: 1.2, aRe: 1.2, aRz: .1 + Math.sin(L.T * 3) * .2 }); laughF(c, L.T); show(ENTE, TUBP[0] + 2.4, 4.3 + Math.sin(L.T * 4) * .1, TUBP[2] + 1.2, -.6, 1);
  orb(L.k, hc(c).add(V(0, -1.2, 0)), null, [15, .45, .22, 44], [13, .25, .2, 44]); }, [[0, 'water_splash', .5], [.6, 'duck_squeak', .6]]);
// 14 «gehusst.» (15,18): coge aire… ¡HUSS! y la cabeza se le hace enorme (1 → 4,4), rozando el techo
shot(14.24, 'C', null, L => { bath(L); const c = inTub(jonas, L); const t = 15.18 - L.t0; if (L.lt < t) { cara(c, L.T, { eyes: 'half', mouth: 'o' }); kopf(c, 1); } else { hussPose(c, L, t, { pose: sitPose({ aLx: 1, aRx: 1, aLe: 1.6, aRe: 1.6 }) }); kopf(c, pop(1, 4.4, (L.lt - t) / .3)); hussFX(L, t, .15, .9); }
  show(ENTE, TUBP[0] + 2.4, 4.3, TUBP[2] + 1.2, -.6, 1); orb(L.k, V(BDX, 9.5, -6), null, [21, .2, .14, 46], [19, .1, .14, 46]); }, [[.1, 'inhale', .6], [.94, 'huss', 1], [.97, 'balloon_inflate', .7]]);
// 15 «Er steckt immer noch drin.»: la cabeza atascada entre las paredes; Jonas triste con el patito; calendario con días tachados
shot(15.73, 'W', null, L => { bath(L); const c = inTub(jonas, L, { aRx: .9, aRe: 1.4 }); kopf(c, 4.4); c.head.rotation.z = Math.sin(L.T * 1.5) * .05; cara(c, L.T, { expr: 'sad', mouth: 'wavy' }); attach(ENTE, c.aR.hand, [0, -.6, .6], [0, 0, 0], .5);
  orb(L.k, V(BDX, 9, -6), null, [17, -.25, .1, 46], [19, -.1, .12, 46]); bigNum('SEIT 3 WOCHEN', clamp((L.lt - .2) / .2), 'gold', .13, .8); }, [[0, 'whoosh_soft', .4], [.3, 'sad_trombone', .4]]);
// 16 «Aber ich?»: yo, cabeza normal, me giro hacia la cámara en la plaza entre cabezas gigantes
shot(16.97, 'Z', 'punch', L => { town(L); const c = put(ich, 0, 0, PZ, lerp(-.9, 0, easeOut(clamp(L.lt / .3)))); actuar(c, 0, [[0, { aRx: 1.2, aRz: -.4, aRe: 1.6, headY: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  extras(L, EXS.slice(0, 4), [[-8, PZ - 8, .5], [8, PZ - 10, -.4], [-14, PZ - 20, .2], [12, PZ - 22, -.1]], 'walk', { heads: [2.6, 3, 2.2, 2.8] }); fcam(c, 15, L.k, 12.5, 0, -1.5, 42); sh(V(0, 0, PZ), 30); }, [[0, 'zoom_in', .5]]);
// 17 «Mein Kopf ist ganz normal.»: me mido la cabeza con una cinta métrica amarilla; «NORMAL» en verde
shot(17.65, 'S', null, L => { town(L); const c = put(ich, 0, 0, PZ, .15); actuar(c, 0, [[0, { aLx: 2.6, aLz: .5, aLe: 1.2, aRx: 2.6, aRz: .5, aRe: 1.2 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'up' });
  bigNum('NORMAL ✓', clamp((L.lt - .3) / .2), 'green', .17, .95); orb(L.k, hc(c).add(V(0, -1.8, 0)), null, [13, .5, .05, 40], [11.5, .2, .05, 40]); sh(V(0, 0, PZ), 26); }, [[.3, 'pling', .5]]);
// 18 «Denn ich habe noch nie gehusst.»: hago el gesto de cerrarme la boca con cremallera y niego con la cabeza
shot(19.12, 'C', null, L => { town(L); const c = put(ich, 0, 0, PZ, -.1); const z = clamp(L.lt / .5); actuar(c, 0, [[0, { aRx: 1.7, aRz: lerp(.5, -.4, z), aRe: 1.9, headY: L.lt > .6 ? Math.sin(L.T * 12) * .25 : 0 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'flat' });
  extras(L, EXS.slice(4, 6), [[-9, PZ - 12, .3], [10, PZ - 14, -.3]], 'walk', { heads: [2.5, 2.9] }); fcam(c, 11, L.k, 9.5, -.35, -1.4, 40); sh(V(0, 0, PZ), 26); }, [[.1, 'zipper', .7]]);
// 19 «Kein einziges Mal.»: brazos cruzados, orgulloso; contador «0× HUSS»
shot(20.67, 'F', null, L => { town(L); const c = put(ich, 0, 0, PZ, 0); actuar(c, 0, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.75, aRz: -.75, aLe: 1.7, aRe: 1.7, headX: -.06 }]], { T: L.T }); cara(c, L.T, { expr: 'smug' }); bigNum('0× HUSS', clamp((L.lt - .1) / .2), 'gold', .1, 1.1);
  orb(L.k, hc(c).add(V(0, -1.6, 0)), null, [16, -.3, .1, 42], [14, -.05, .1, 42]); sh(V(0, 0, PZ), 26); }, [[.1, 'ding', .5]]);
// 20 «Alle lachen mich aus.»: los niños de cabezas enormes se ríen y me señalan; yo en primer término
shot(21.9, 'W', null, L => { town(L); [[KIDS[0], -5, PZ - 6, .3, 2.6], [KIDS[1], 0, PZ - 8, 0, 3.1], [KIDS[2], 5, PZ - 6, -.3, 2.4], [KIDS[3], 9, PZ - 3, -.6, 2.8]].forEach(([c, x, z, ry, s], i) => { put(c, x, 0, z, ry); kopf(c, s); actuar(c, 0, [[0, i % 2 ? { aRx: 1.6, aRe: .1, aLx: .8, aLz: .4, aLe: 1.6, lean: -.1 } : { aLx: 1.2, aRx: 1.2, aLz: -.3, aRz: -.3, aLe: 1.6, aRe: 1.6, lean: .15 + Math.sin(L.T * 14 + i) * .05 }]], { T: L.T }); laughF(c, L.T + i); });
  const m = put(ich, -3, 0, PZ + 9, PI - .3); actuar(m, 0, [[0, { aLx: .1, aRx: .1 }]], { T: L.T }); orb(L.k, V(1, 6, PZ - 4), null, [22, .15, .14, 46], [19, -.05, .12, 46]); sh(V(0, 0, PZ - 4), 30); }, [[0, 'kids_laugh', .7]]);
// 21 «Digga,»: un niño con cabeza enorme se agacha hacia mí burlándose
shot(22.78, 'C', 'punch', L => { town(L); const c = put(KIDS[1], 0, 0, PZ - 4, 0); kopf(c, 3.1); actuar(c, 0, [[0, { lean: .25, aLx: .4, aRx: .4, aLz: .5, aRz: .5, aLe: .6, aRe: .6 }]], { T: L.T }); talk(c, L.T, 22.78, 23.68, 'smug');
  fcam(c, 21, L.k, 18, .2, -1, 42); bubble(c, 'Digga…', clamp(L.lt / .2), 1.6); sh(V(0, 0, PZ), 30); }, [[0, 'whoosh_soft', .4]]);
// 22 «warum ist dein Kopf so winzig?»: contraplano por encima de la cabeza gigante: yo pequeñito mirando hacia arriba
shot(23.68, 'S', null, L => { town(L); const k = put(KIDS[1], 0, 0, PZ - 4, 0); kopf(k, 3.1); actuar(k, 0, [[0, { lean: .2, aRx: 1.5, aRe: .1 }]], { T: L.T }); talk(k, L.T, 23.68, 25, 'smug');
  const c = put(ich, 0, 0, PZ + 5, PI); actuar(c, 0, [[0, { headX: -.25, aLx: .2, aRx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'neutral', eyes: 'up' }); const h = hc(c);
  cm([-4, 15, PZ - 9, h.x, h.y - 1, h.z, 46], [-3, 13.5, PZ - 8, h.x, h.y - 1, h.z, 42], L.k); bigNum('WINZIG?', clamp((L.lt - .7) / .2), 'red', .15, .95); sh(V(0, 0, PZ), 26); }, [[.7, 'boing', .5]]);
// 23 «Ich lächle nur.»: primer plano: sonrío tranquilo; detrás los niños aún riéndose desenfocados
shot(25.24, 'F', null, L => { town(L); const c = put(ich, 0, 0, PZ, .1); actuar(c, 0, [[0, { aLx: .1, aRx: .1, headZ: -.08 }]], { T: L.T }); cara(c, L.T, { eyes: 'happy', mouth: 'smile', noBlink: true });
  [KIDS[0], KIDS[2]].forEach((k, i) => { put(k, i ? 6 : -6, 0, PZ - 12, i ? -.4 : .4); kopf(k, 2.6); actuar(k, 0, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.6, aRe: 1.6 }]], { T: L.T }); laughF(k, L.T + i); }); fcam(c, 10, L.k, 8.5, .15, -1.2, 38); sh(V(0, 0, PZ), 26); }, [[.1, 'sparkle', .4]]);
// Bäckerei (puerta abierta) en (-6, 0, 52) mirando a +z
const TX = -6, TZ = 52;
// 24 «Ich bin der Einzige, der noch durch eine Tür»: entro tan tranquilo por la puerta de la Bäckerei
shot(26.15, 'W', null, L => { town(L); show(TUER, TX, 0, TZ, 0); const c = walk(ich, L, TX + .2, TZ + 7, PI, 3.2, 0, { expr: 'happy' }); extras(L, EXS.slice(6, 8), [[TX - 12, TZ + 10, .2], [TX + 12, TZ + 12, -.3]], ['shock', 'point'], { heads: [3, 2.6] });
  cm([TX + 14, 8, TZ + 32, TX, 6, TZ + 2, 46], [TX + 8, 8, TZ + 27, TX, 6, TZ + 2, 44], L.k); sh(V(TX, 0, TZ + 6), 30); }, [[0, 'steps', .5], [.6, 'shop_bell', .6]]);
// 25 «passt.»: detrás de mí, dos vecinos de cabeza gigante se quedan atascados en el marco empujando
shot(27.29, 'C', 'punch', L => { town(L); show(TUER, TX, 0, TZ, 0); const a = put(VEC[2], TX, 0, TZ - .4, 0); kopf(a, 3.4); a.head.rotation.z = Math.sin(L.T * 10) * .08; actuar(a, 0, [[0, { lean: .3, aLx: 1.6, aRx: 1.6, aLe: .2, aRe: .2 }]], { T: L.T }); cara(a, L.T, { eyes: 'squint', mouth: 'grimace' });
  const b = put(VEC[4], TX + 1.4, 0, TZ - 2.6, 0); kopf(b, 2.8); actuar(b, 0, [[0, { lean: .35, aLx: 1.8, aRx: 1.8, aLe: .1, aRe: .1 }]], { T: L.T }); cara(b, L.T, { eyes: 'squint', mouth: 'grimace' }); sweat(a, L.T);
  orb(L.k, V(TX, 8.5, TZ + 1), null, [24, .35, .1, 46], [21, .15, .1, 46]); sh(V(TX, 0, TZ + 4), 30); }, [[0, 'bonk', .8], [.3, 'squeeze', .6], [.6, 'groan', .5]]);
// 26 «Dann wurde es schlimmer.»: la plaza al atardecer, viento; miro arriba preocupado (zoom lento)
shot(28.13, 'Z', 'slow', L => { town(L, { dusk: true }); const c = put(ich, 0, 0, PZ, 0); actuar(c, 0, [[0, { headX: -.3, aLx: .2, aRx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'up' });
  extras(L, EXS.slice(8, 11), [[-10, PZ - 14, .3], [10, PZ - 16, -.3], [0, PZ - 26, 0]], ['shock', 'point', 'shock'], { heads: [3.2, 2.8, 3.6] }); fcam(c, 17, L.k, 12, 0, -1.7, 44, -.05); sh(V(0, 0, PZ), 30); }, [[0, 'wind', .5]]);
// ---------- b: flotar, el alcalde, la ventana, el bastoncillo, la verdad (29,40 – 59,59 s) ----------
// gente flotando sobre los tejados alrededor de c (cabezas 2,6–4,2)
function floaters(L, list, c, r = 30, y0 = 30, y1 = 55, seed = 3) { const rr = RNG(seed); list.forEach((ch, i) => { const a = rr() * 6.283, d = 6 + rr() * r; flot(ch, L, c.x + Math.cos(a) * d, y0 + rr() * (y1 - y0), c.z + Math.sin(a) * d * .6, rr() * 6.28, 2.6 + rr() * 1.6, i, { expr: ['happy', 'shock', 'worried', 'joy'][i % 4] }); }); }
const FL = () => [...EXS.slice(0, 8), ...VEC.slice(1, 4)];
// 27 «Wenn dein Kopf zu groß wird,»: a un vecino se le hincha la cabeza (2,4 → 4) y se pone de puntillas
shot(29.4, 'S', null, L => { town(L); const c = put(VEC[3], 0, 0, PZ, 0); const k = clamp(L.lt / 1.3); kopf(c, lerp(2.4, 4, easeInOut(k))); c.root.position.y = k * .5; actuar(c, 0, [[0, { aLz: .4 + k * .4, aRz: .4 + k * .4, lLx: -.1 * k, lRx: .1 * k, headX: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'o' });
  extras(L, EXS.slice(8, 10), [[-12, PZ - 10, .4], [12, PZ - 12, -.4]], 'point', { heads: [2.2, 2.6] }); fcam(c, 24, L.k, 21, .2, -2.6, 44); sh(V(0, 0, PZ), 30); }, [[0, 'balloon_inflate', .7], [.6, 'creak', .4]]);
// 28 «fängst du an zu schweben.»: despega del suelo y sube; la cámara le sigue hacia arriba con los tejados detrás
shot(30.92, 'W', null, L => { town(L); const y = easeIn(clamp(L.lt / 1.1)) * 9; const c = flot(VEC[3], L, 0, y, PZ, 0, 4, 0, { expr: 'shock' }); c.root.position.y = y;
  extras(L, EXS.slice(8, 10), [[-12, PZ - 10, .4], [12, PZ - 12, -.4]], 'shock', { heads: [2.2, 2.6] }); cm([0, 6, PZ + 26, 0, 9, PZ, 46], [0, 15, PZ + 24, 0, 16, PZ, 46], L.k); sh(V(0, 0, PZ), 32); }, [[0, 'whoosh_up', .6], [.3, 'crowd_gasp', .4]]);
// Freibad (FBX): atril en z = 19 mirando a +z, cinta roja en z = 24, el público en z 30–38 mirando a -z; piscina detrás del alcalde
const PUB = (L, mode = 'clap', heads = [2.2, 1.8, 2.6, 2, 2.8, 2.4]) => extras(L, EXS.slice(0, 6), [[FBX - 9, 31, PI + .3], [FBX - 3, 33, PI + .1], [FBX + 3, 32, PI - .1], [FBX + 9, 31, PI - .3], [FBX - 6, 38, PI], [FBX + 6, 38, PI]], mode, { heads });
// 29 «Der Bürgermeister hat gehusst,»: el alcalde da su discurso en el atril del Freibad nuevo; el público aplaude
shot(32.22, 'Z', null, L => { pool(L); const c = put(mayor, FBX, .4, 16.6, 0); actuar(c, 0, [[0, { aRx: 1.3 + Math.sin(L.T * 4) * .3, aRz: -.2, aRe: .9, aLx: .7, aLe: 1.2 }]], { T: L.T }); talk(c, L.T, 30, 40, 'happy');
  PUB(L); orb(L.k, V(FBX, 7, 18), null, [30, .35, .32, 44], [25, .2, .3, 44]); sh(V(FBX, 0, 22), 36); bigNum('NEUES FREIBAD', clamp((L.lt - .2) / .2), 'gold', .12, .8); }, [[0, 'crowd_applause', .5], [.2, 'mic_feedback', .3]]);
// 30 «als er das neue Freibad eröffnet hat.»: baja con las tijeras gigantes y corta la cinta roja: ¡CLIC!
shot(33.46, 'C', null, L => { pool(L); const c = put(mayor, FBX - 1.5, .4, 22.2, 0); const k = clamp((L.lt - .7) / .2); actuar(c, 0, [[0, { aRx: 1.2, aRz: -.1, aRe: .6 - k * .4, lean: .15, headX: .15 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' });
  attach(SCHERE, c.aR.hand, [0, -.8, .8], [PI / 2, 0, 0], 1); const r = BAND.userData.ribbon; r.visible = k < 1; BAND.userData.bow.visible = k < 1;
  PUB(L, 'cheer'); orb(L.k, V(FBX - 1, 5.5, 23), null, [18, 1.25, .12, 44], [15, 1.1, .12, 44]); sh(V(FBX, 0, 24), 30); }, [[.7, 'scissors', .8], [.8, 'crowd_cheer', .5]]);
// 31 «HUSS!»: de la emoción, ¡HUSS! y la cabeza del alcalde se infla (1 → 3,6)
shot(35.21, 'F', 'punch', L => { pool(L); const c = put(mayor, FBX, .4, 16.6, 0); hussPose(c, L); kopf(c, pop(1, 3.6, L.lt / .3)); hussFX(L, 0, .1, 1);
  PUB(L, 'shock'); fcam(c, 26, L.k, 23, .15, -1, 44, .3); sh(V(FBX, 0, 20), 34); }, [[0, 'huss', 1], [.03, 'balloon_inflate', .8]]);
// 32 «Und ist direkt vom Rednerpult weggeflogen.»: sale volando del atril hacia el cielo; el público señala hacia arriba
shot(35.76, 'W', null, L => { pool(L); const y = .4 + easeIn(clamp(L.lt / 1.7)) * 22; const c = flot(mayor, L, FBX, y, 16.6, 0, 3.6, 0, { expr: 'shock' }); c.root.position.y = y;
  PUB(L, 'point'); cm([FBX + 6, 5, 52, FBX, 8, 16, 48], [FBX + 4, 9, 48, FBX, 19, 16, 48], L.k); sh(V(FBX, 0, 24), 40); }, [[0, 'whoosh_up', .7], [.4, 'crowd_gasp', .5], [1, 'balloon_squeak', .4]]);
// 33 «Bis Sonntag»: contrapicado desde la plaza: cabezas gigantes flotando entre los tejados; «SONNTAG»
shot(37.86, 'S', null, L => { town(L); floaters(L, FL(), V(0, 0, 10), 26, 22, 44, 5); cm([6, 3, 64, 0, 30, 0, 50], [2, 3, 58, 0, 34, 0, 50], L.k); bigNum('SONNTAG', clamp((L.lt - .1) / .2), 'gold', .12, 1); sh(V(0, 0, 20), 60); }, [[0, 'whoosh_soft', .4], [.2, 'church_bell', .5]]);
// 34 «schwebte die halbe Stadt über den Dächern.»: plano aéreo sobre los tejados de Hufenbach con la media ciudad flotando
shot(39.04, 'Z', null, L => { town(L); floaters(L, FL(), V(-10, 0, 0), 40, 34, 52, 9); floaters(L, [mayor, bote, ...KIDS.slice(0, 2)], V(10, 0, -20), 30, 36, 50, 11);
  cm([60, 70, 80, -6, 30, -6, 50], [50, 62, 66, -6, 32, -6, 50], L.k); sh(V(0, 0, -6), 80); }, [[0, 'wind', .5], [.5, 'birds', .4]]);
// fachada con mi ventana (FNX): hueco x ∈ [-4, 4], y ∈ [8, 15]; yo dentro en z = -3 mirando a +z; fuera flota la gente en z ≈ +4
const ME_IN = (L, f = { expr: 'happy' }, pose = { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2 }) => { const c = put(ich, FNX, 7.8, -2.6, 0); actuar(c, 0, [[0, pose]], { T: L.T }); cara(c, L.T, f); return c; };
// 35 «Oma schwebte an meinem Fenster vorbei.»: Oma (cabeza enorme) pasa flotando por delante de mi ventana; yo la miro asombrado
shot(41.07, 'W', null, L => { window_(L); ME_IN(L, { expr: 'gasp' }); flot(oma, L, FNX + lerp(-10, 6, L.k), 6.4, 5, PI / 2 - .4, 2.6, 0, { expr: 'happy' });
  cm([FNX + 6, 13, 34, FNX, 13, 0, 46], [FNX + 3, 13, 30, FNX, 13, 0, 46], L.k); sh(V(FNX, 0, 2), 30); }, [[0, 'whoosh_soft', .5], [.4, 'wind', .4]]);
// 36 «Mit ihrer Gießkanne.»: riega las flores de mi jardinera con la regadera verde
shot(43.08, 'C', null, L => { window_(L); ME_IN(L, { expr: 'happy' }); const c = flot(oma, L, FNX + 3, 6, 4.6, -.5, 2.6, 0, { expr: 'happy', pose: { aRx: 1.4, aRz: .2, aRe: .4, aLx: .3 } }); attach(KANNE, c.aR.hand, [0, -.8, .5], [0, PI / 2, .5 + Math.sin(L.T * 3) * .1], .8);
  orb(L.k, V(FNX + 1.5, 11.5, 2), null, [18, -.3, .08, 44], [15, -.15, .08, 44]); sh(V(FNX, 0, 2), 28); }, [[0, 'water_pour', .6]]);
// 37 «Sie hat gewinkt.»: me saluda con la mano; yo le devuelvo el saludo desde la ventana
shot(44.18, 'F', null, L => { window_(L); ME_IN(L, { expr: 'happy', mouth: 'open_smile' }, { aRx: 2.8, aRz: .3 + Math.sin(L.T * 10) * .3, aRe: .3, aLx: .3 }); const c = flot(oma, L, FNX + 3.6, 6, 5, -.55, 2.6, 0, { f: { expr: 'joy' }, pose: { aLx: 2.8, aLz: -.3 - Math.sin(L.T * 10) * .3, aLe: .3 } });
  orb(L.k, V(FNX + 1.5, 12, 2), null, [16, .35, .06, 42], [14, .2, .06, 42]); sh(V(FNX, 0, 2), 28); }, [[0, 'pling', .4]]);
// 38 «Dann kam Jonas angeschwebt und fragte mich:»: Jonas llega flotando de lado con la cabeza gigante
shot(44.98, 'S', null, L => { window_(L); ME_IN(L, { expr: 'neutral' }); flot(jonas, L, FNX + lerp(14, 4.6, easeOut(L.k)), 6.2, 5, -.45, 4, 1, { expr: 'happy' });
  orb(L.k, V(FNX + 5, 12.5, 4), null, [28, .3, .08, 46], [24, .15, .08, 46]); sh(V(FNX, 0, 2), 30); }, [[0, 'whoosh_in', .6]]);
// 39 «„Seh ich cool aus?“»: posa con gafas de sol imaginarias, sacando pecho
shot(47.23, 'C', 'punch', L => { window_(L); const c = flot(jonas, L, FNX + 4.6, 6.2, 5, -.5, 4, 1, { pose: { aRx: 2.6, aRz: -.3, aRe: 1.9, aLz: .6, lean: -.1 } }); talk(c, L.T, 47.23, 48, 'smug');
  fcam(c, 22, L.k, 19, .1, -2.4, 42); sh(V(FNX, 0, 2), 30); bigNum('COOL?', clamp((L.lt - .2) / .2), 'gold', .1, .9); }, [[0, 'pose', .5]]);
// 40 «Ich sagte: „Nein.“»: yo, serio, desde la ventana: «NEIN»
shot(48.17, 'W', null, L => { window_(L); const c = ME_IN(L, { expr: 'bored' }, { aRx: 1.1, aRz: -.3, aRe: 1.2, aLx: .4, headY: L.T > 48.92 ? Math.sin(L.T * 11) * .2 : 0 }); talk(c, L.T, 48.9, 49.2, 'bored');
  orb(L.k, hc(c).add(V(0, -1, 0)), null, [12, 0, .04, 40], [10.5, .1, .04, 40]); bigNum('NEIN.', clamp((L.T - 48.92) / .15), 'red', .12, 1); sh(V(FNX, 0, 0), 26); }, [[.75, 'buzzer', .5]]);
// 41 «Du siehst aus wie ein Wattestäbchen.»: junto a Jonas aparece un bastoncillo gigante con su misma silueta
shot(49.41, 'Z', null, L => { window_(L); const c = flot(jonas, L, FNX + 2.2, 6.2, 5, 0, 4, 1, { expr: 'shock' }); const k = clamp((L.lt - .5) / .3); const st = show(STAB, FNX + 8, 13.5 + Math.sin(L.T * 1.3 + 1) * .5, 5, 0, 1.75 * spring(k)); st.rotation.z = .08;
  orb(L.k, V(FNX + 5, 12.5, 5), null, [30, 0, .06, 44], [27, .05, .06, 44]); sh(V(FNX, 0, 2), 30); }, [[.5, 'pop', .6], [.7, 'boing', .5]]);
// 42 «Sein Kopf schrumpfte.»: la cabeza se le deshincha (4 → 1) silbando como un globo
shot(51.03, 'C', 'punch', L => { window_(L); const k = easeInOut(clamp(L.lt / .9)); const c = flot(jonas, L, FNX + 3.2, 6.2 - k * .5, 5, -.3, lerp(4, 1, k), 1, { f: { eyes: 'wide', mouth: 'o' } }); c.head.rotation.z = Math.sin(L.T * 30) * .1 * (1 - k);
  orb(L.k, V(FNX + 3, 11, 5), null, [22, -.2, .08, 44], [18, -.1, .08, 44]); sh(V(FNX, 0, 2), 30); }, [[0, 'deflate', .9]]);
// 43 «Und er fiel direkt in seine Turnschuhe.»: cae al césped de la plaza justo dentro de sus zapatillas: ¡PLOF!
shot(52.66, 'F', null, L => { town(L); const k = clamp(L.lt / .7); const c = put(jonas, 0, (1 - easeIn(k)) * 26, PZ, .1); actuar(c, 0, [[0, k < 1 ? { aLz: 2.4, aRz: 2.4, lLx: .3, lRx: -.2 } : { aLz: .2, aRz: .2, lLk: .3, lRk: .3, crouch: .2 * Math.exp(-(L.lt - .7) * 6) }]], { T: L.T, weight: false }); cara(c, L.T, k < 1 ? { eyes: 'wide', mouth: 'scream' } : { eyes: 'squint', mouth: 'wavy' });
  show(SCHUHE, 0, 0, PZ + .4, .1, 1); if (k >= 1) dust(V(0, 0, PZ + 2), L.t0 + .7, L.T, 8, .35); extras(L, EXS.slice(9, 11), [[-9, PZ - 6, .5], [9, PZ - 8, -.5]], 'point', { heads: [2.6, 3] });
  orb(L.k, V(0, 4.6, PZ), null, [17, .2, .14, 44], [15, .1, .12, 44]); sh(V(0, 0, PZ), 28); }, [[0, 'fall_whistle', .6], [.7, 'thud', .9], [.75, 'shoe_squeak', .5]]);
// 44 «Da hab ich es kapiert.»: en mi ventana se me enciende una bombilla encima de la cabeza
shot(54.77, 'Z', 'punch', L => { window_(L); const c = ME_IN(L, { expr: 'gasp' }, { aRx: 2.4, aRz: .1, aRe: 1.6, aLx: .3 }); const h = hc(c); const k = clamp(L.lt / .2); show(BULB, h.x, h.y + 2.6 + Math.sin(L.T * 4) * .1, h.z, 0, .9 * spring(k));
  orb(L.k, h.add(V(0, .2, 0)), null, [13, -.15, .05, 40], [11, 0, .05, 40]); sh(V(FNX, 0, 0), 26); }, [[0, 'ding_idea', .8]]);
// 45 «Nur eine Sache macht»: en la plaza, miro hacia arriba a la gente flotando; la cámara sube por detrás de mí
shot(55.69, 'S', null, L => { town(L); const c = put(ich, 0, 0, PZ, PI); actuar(c, 0, [[0, { headX: -.45, aRx: .5, aRe: .9 }]], { T: L.T }); cara(c, L.T, { expr: 'think' });
  floaters(L, FL(), V(0, 0, 0), 24, 20, 40, 13); cm([7, 4, PZ + 12, 0, 18, PZ - 10, 50], [5, 6, PZ + 10, 0, 22, PZ - 14, 50], L.k); sh(V(0, 0, PZ - 6), 40); }, [[0, 'whoosh_soft', .4], [.4, 'wind', .3]]);
// 46 «einen großen Kopf wieder klein.»: Jonas, ya con la cabeza normal y sus zapatillas, me sonríe aliviado; al fondo los demás siguen flotando
shot(57.16, 'W', null, L => { town(L); const j = put(jonas, -2.4, 0, PZ, .45); actuar(j, 0, [[0, { aRx: 2.7, aRz: .2, aRe: .3 }]], { T: L.T }); cara(j, L.T, { expr: 'relief' }); show(SCHUHE, -2.4, 0, PZ + .4, .45, 1);
  const c = put(ich, 2.6, 0, PZ + 1, -.5); actuar(c, 0, [[0, { aLx: .4, aRx: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'happy' }); floaters(L, FL().slice(0, 6), V(0, 0, PZ - 30), 20, 24, 36, 15);
  orb(L.k, V(0, 5, PZ), null, [17, -.3, .14, 44], [15, -.15, .12, 44]); sh(V(0, 0, PZ), 30); bigNum('KLEIN', clamp((L.lt - .7) / .2), 'green', .12, .9); }, [[.1, 'pling', .4]]);
// 47 «Die Wahrheit.»: primer plano decidido, zoom lento; «DIE WAHRHEIT» en dorado
shot(58.76, 'C', 'slow', L => { town(L); const c = put(ich, 0, 0, PZ, 0); actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLe: 1.6, aRe: 1.6, aLz: .2, aRz: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  fcam(c, 11, L.k, 8.5, 0, -.9, 40); bigNum('DIE WAHRHEIT', clamp(L.lt / .15), 'gold', .1, .9); sh(V(0, 0, PZ), 26); }, []);
// ---------- c: las tres verdades, la fiesta y el final (59,59 – 94,6 s) ----------
// Torre de la Kirche: centro (-106, ·, -6), cara +x en x = -99, balcón a y = 46, reloj a y = 52. Yo en el balcón mirando a +x.
const TWX = -98.3, TWY = 46.5, TWZ = -6;
const onTower = (L, pose, f = { expr: 'determined' }) => { const c = put(ich, TWX, TWY, TWZ, PI / 2); actuar(c, 0, [[0, pose]], { T: L.T }); c.blob.visible = false; cara(c, L.T, f); return c; };
const CUP = { aLx: 2.0, aRx: 2.0, aLz: -.5, aRz: -.5, aLe: 1.9, aRe: 1.9, lean: -.08, headX: -.1 };
const shout = (L, a, b) => { const c = onTower(L, CUP, { eyes: 'angry', mouth: kitLips(L.T, spoken(a, b)) || 'talk_wide' }); return c; };
// 48 «Also bin ich auf den»: cruzo la plaza corriendo hacia la iglesia
shot(59.59, 'W', null, L => { town(L); const d = 9 * L.lt; const c = put(ich, -20 - d, Math.abs(Math.sin(L.T * 13)) * .3, -2, -PI / 2); actuar(c, 0, [[0, runP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); floaters(L, FL().slice(0, 5), V(-30, 0, -10), 20, 26, 38, 17);
  const p = c.root.position; orbit(V(p.x, 5, p.z), 17, -PI / 2 - .55, .14, 46); sh(V(p.x, 0, p.z), 30); }, [[0, 'run_steps', .6]]);
// 49 «Kirchturm geklettert.»: trepo por la pared de la torre; grúa hacia arriba con el reloj encima
shot(60.31, 'Z', null, L => { town(L); const y = lerp(30, 40, L.k), cl = Math.sin(L.T * 8); const c = put(ich, TWX - .3, y, TWZ, -PI / 2); c.blob.visible = false; actuar(c, 0, [[0, { aLx: 2.8 + cl * .3, aRx: 2.8 - cl * .3, aLe: .4, aRe: .4, lLx: .8 + cl * .5, lRx: .8 - cl * .5, lLk: 1, lRk: 1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  cm([TWX + 16, y - 2, TWZ + 8, TWX, y + 4, TWZ, 48], [TWX + 14, y + 2, TWZ + 6, TWX, y + 6, TWZ, 48], L.k); sh(V(TWX, y, TWZ), 30); }, [[0, 'climb', .6], [.6, 'wind', .4]]);
// 50 «„Herr Bürgermeister,»: en el balcón de la torre, grito con las manos en la boca; abajo la ciudad
shot(61.4, 'C', 'punch', L => { town(L); const c = shout(L, 61.4, 62.4); orb(L.k, hc(c).add(V(0, -1.4, 0)), null, [14, PI / 2 + .45, .05, 42], [12, PI / 2 + .3, .05, 42]); sh(V(TWX, TWY, TWZ), 26); }, [[0, 'shout', .5]]);
// 51 «bei Ihren Reden schlafen sogar die Tauben ein.“»: el alcalde flotando con tres palomas dormidas en la cabeza; «Zzz»
const MY = V(-44, 50, -8);
shot(62.44, 'S', null, L => { town(L); const c = flot(mayor, L, MY.x, MY.y, MY.z, -PI / 2 + .2, 3.6, 0, { expr: 'worried' }); const h = hc(c), top = h.y + 2.4;
  [[-1.6, 0], [0, .4], [1.6, -.2]].forEach(([dx, dz], i) => { const p = dove(i, h.x + dz, top + .1, h.z + dx, -PI / 2 + i * .4, L.T, 0); p.rotation.x = .2; }); badge3('big', 'Zzz', h.clone().add(V(0, 5.4, 0)), clamp(L.lt / .3), .7);
  orb(L.k, h.add(V(0, -.6, 0)), null, [22, -PI / 2 + .55, .05, 44], [19, -PI / 2 + .35, .05, 44]); sh(V(MY.x, MY.y - 6, MY.z), 30); }, [[0, 'snore', .6], [.6, 'coo', .4]]);
// 52 «Runter kam er.»: se le encoge la cabeza y cae hacia la plaza; las palomas salen volando
shot(64.58, 'F', null, L => { town(L); const k = clamp(L.lt / .3), f = easeIn(clamp((L.lt - .2) / .55)); const c = flot(mayor, L, MY.x, MY.y - f * 44, MY.z, -PI / 2 + .2, lerp(3.6, 1, k), 0, { f: { eyes: 'wide', mouth: 'scream' }, pose: { aLz: 2.4, aRz: 2.4 } });
  for (let i = 0; i < 3; i++) dove(i, MY.x + i * 2 + L.lt * 8, MY.y + 4 + L.lt * 10 + i, MY.z - 2 + i * 2, -PI / 2, L.T, 1);
  { const h = hc(c); cam([h.x + 15, h.y + 4 + L.k * 3, h.z + 17], [h.x, h.y - 2, h.z], 46); } sh(V(MY.x, 10, MY.z), 40); }, [[0, 'deflate', .7], [.25, 'fall_whistle', .6], [.3, 'wings_flap', .5]]);
// 53 «„Paketbote,»: grito otra vez desde la torre, ahora girado a la izquierda
shot(65.65, 'C', null, L => { town(L); const c = shout(L, 65.65, 66.4); c.root.rotation.y = PI / 2 + .4; orb(L.k, hc(c).add(V(0, -1.4, 0)), null, [13, PI / 2 + .9, .1, 42], [11.5, PI / 2 + .75, .08, 42]); sh(V(TWX, TWY, TWZ), 26); }, [[0, 'shout', .5]]);
// 54 «du gibst meine Pakete immer beim Nachbarn ab.“»: el repartidor flota con sus paquetes, pillado, sudando
const BY = V(-74, 48, 14);
shot(66.41, 'W', null, L => { town(L); const c = flot(bote, L, BY.x, BY.y, BY.z, -PI / 2 - .3, 3.4, 2, { f: { expr: 'worried', mouth: 'grimace' }, pose: { aLx: 1.2, aRx: 1.2, aLe: 1.4, aRe: 1.4, aLz: -.2, aRz: -.2 } }); sweat(c, L.T);
  const p = c.root.position; [0, 1, 2].forEach(i => show(PAK[i], p.x - 1.6, p.y + 2.6 + i * 1.6 + Math.sin(L.T * 2 + i) * .1, p.z + (i - 1) * .3, i * .3, .8)); show(PAK[3], p.x + .4, p.y + 1, p.z + 2.6, .4, .7);
  orb(L.k, hc(c).add(V(0, -2.4, 0)), null, [24, -PI / 2 - .7, .05, 44], [21, -PI / 2 - .5, .05, 44]); sh(V(BY.x, BY.y - 6, BY.z), 30); }, [[0, 'whoosh_soft', .4], [.6, 'gulp', .6]]);
// 55 «„Dreimal.“»: levanto tres dedos; «3×»
shot(68.53, 'C', 'punch', L => { town(L); const c = onTower(L, { aRx: 2.6, aRz: -.1, aRe: .4, aLx: .5, aLe: 1.4, headX: -.05 }, { expr: 'angry', mouth: L.T < 69 ? 'talk_wide' : 'flat' }); orb(L.k, hc(c).add(V(0, -1.2, 0)), null, [12, PI / 2 + .1, .03, 40], [10.5, PI / 2 + .2, .03, 40]);
  bigNum('3×', clamp(L.lt / .15), 'red', .1, 1.4); sh(V(TWX, TWY, TWZ), 26); }, [[0, 'impact_soft', .6]]);
// 56 «Runter kam er.»: el repartidor se deshincha y cae sobre el techo de su furgoneta; los paquetes rebotan
shot(69.31, 'F', null, L => { town(L); show(VAN, 26, 0, VZ, 0); const k = clamp(L.lt / .45); const y = lerp(30, 7.3, easeIn(k)); const c = put(bote, 26, y, VZ - 1, .3); kopf(c, lerp(3.4, 1, clamp(L.lt / .25))); c.blob.visible = false;
  actuar(c, 0, [[0, k < 1 ? { aLz: 2.4, aRz: 2.4, lLx: .3 } : { aLz: .3, aRz: .3, crouch: .25 * Math.exp(-(L.lt - .45) * 6), lLk: .4, lRk: .4 }]], { T: L.T, weight: false }); cara(c, L.T, k < 1 ? { eyes: 'wide', mouth: 'scream' } : { eyes: 'squint', mouth: 'wavy' });
  [0, 1, 2].forEach(i => { const t = Math.max(0, L.lt - .45 - i * .05); show(PAK[i], 26 + (i - 1) * 3, 7.2 + Math.max(0, 5 * t - 14 * t * t) + (k < 1 ? 30 * (1 - easeIn(k)) + 2 : 0), VZ + 2 + i, i, .8); });
  orb(L.k, V(26, 7, VZ), null, [26, .5, .22, 46], [23, .4, .2, 46]); sh(V(26, 0, VZ), 30); }, [[0, 'deflate', .6], [.45, 'metal_thud', .9], [.55, 'box_drop', .5]]);
// 57 «„Oma, dein Kartoffelsalat»: Oma flota orgullosa con su ensalada de patatas
const OY = V(-72, 46, -26);
shot(70.26, 'S', null, L => { town(L); const c = flot(oma, L, OY.x, OY.y, OY.z, -PI / 2 + .5, 3.2, 3, { f: { expr: 'happy' }, pose: { aLx: 1.3, aRx: 1.3, aLe: 1.2, aRe: 1.2, aLz: -.25, aRz: -.25 } }); const h = hc(c), p = c.root.position;
  const d = V(Math.sin(c.root.rotation.y), 0, Math.cos(c.root.rotation.y)); show(SALAT, p.x + d.x * 2.6, p.y + 2.6, p.z + d.z * 2.6, 0, 1.1);
  orb(L.k, h.add(V(0, -2.6, 0)), null, [22, -PI / 2 + .9, .05, 44], [19, -PI / 2 + .7, .05, 44]); sh(V(OY.x, OY.y - 6, OY.z), 30); }, [[0, 'whoosh_soft', .4]]);
// 58 «schmeckt nach Radiergummi.“»: Oma se ofende, boca abierta; la ensalada se le inclina
shot(71.5, 'C', 'punch', L => { town(L); const c = flot(oma, L, OY.x, OY.y, OY.z, -PI / 2 + .5, 3.2, 3, { f: { eyes: 'wide', mouth: 'grimace_wide' }, pose: { aLx: 1.1, aRx: 1.1, aLe: 1.2, aRe: 1.2, lean: -.12 } }); const p = c.root.position;
  const d = V(Math.sin(c.root.rotation.y), 0, Math.cos(c.root.rotation.y)); const s = show(SALAT, p.x + d.x * 2.6, p.y + 2.4, p.z + d.z * 2.6, 0, 1.1); s.rotation.z = .5;
  fcam(c, 20, L.k, 17, .1, -2.2, 42); bigNum('RADIERGUMMI?!', clamp((L.lt - .3) / .2), 'red', .1, .8); sh(V(OY.x, OY.y - 6, OY.z), 30); }, [[0, 'gasp', .6], [.3, 'record_scratch', .5]]);
// 59 «Sie kam so schnell runter,»: cae en picado hasta el césped de su jardín: ¡BUM! nube de polvo
shot(73.01, 'Z', null, L => { town(L); const k = clamp(L.lt / .5); const c = put(oma, -30, (1 - easeIn(k)) * 40, 12, PI / 2); kopf(c, lerp(3.2, 1, clamp(L.lt / .2))); actuar(c, 0, [[0, k < 1 ? { aLz: 2.6, aRz: 2.6 } : { aLz: .4, aRz: .4, crouch: .3 * Math.exp(-(L.lt - .5) * 6) }]], { T: L.T, weight: false }); cara(c, L.T, k < 1 ? { eyes: 'terror', mouth: 'scream' } : { eyes: 'squint', mouth: 'grimace' });
  if (k >= 1) dust(V(-30, 0, 12), L.t0 + .5, L.T, 16, 1.2); orb(L.k, V(-30, 4, 12), null, [22, PI / 2 + .3, .12, 46], [19, PI / 2 + .1, .1, 46]); sh(V(-30, 0, 12), 30); }, [[0, 'fall_whistle', .6], [.5, 'boom', .9]]);
// 60 «dass sie heute noch sauer auf mich ist.»: Oma con los brazos cruzados me fulmina con la mirada; yo sonrío nervioso
shot(74.61, 'W', null, L => { town(L); const o = put(oma, -30, 0, 12, PI / 2 - .45); actuar(o, 0, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.75, aRz: -.75, aLe: 1.7, aRe: 1.7, headY: Math.sin(L.T * 2) * .1 }]], { T: L.T }); cara(o, L.T, { expr: 'angry' });
  const c = put(ich, -24, 0, 13, -PI / 2 + .55); actuar(c, 0, [[0, { aRx: 2.2, aRz: .2, aRe: 1.2, headZ: .1 }]], { T: L.T }); cara(c, L.T, { eyes: 'happy', mouth: 'grimace' }); sweat(c, L.T, 1);
  orb(L.k, V(-27, 5, 13.5), null, [21, .1, .12, 44], [18, .25, .12, 44]); sh(V(-27, 0, 14), 26); bigNum('HEUTE NOCH', clamp((L.lt - .3) / .2), 'gold', .1, .8); }, [[0, 'grumble', .6]]);
// 61 «Einer nach dem anderen»: los vecinos caen uno tras otro en la plaza (cabezas que se deshinchan)
shot(76.22, 'S', null, L => { town(L); FL().forEach((c, i) => { const t0 = i * .08, k = clamp((L.lt - t0) / .4); const r = RNG(i * 3 + 1); const x = (r() - .5) * 26, z = PZ - 8 + (r() - .5) * 16; put(c, x, (1 - easeIn(k)) * (30 + r() * 10), z, r() * 6.28); kopf(c, k < 1 ? lerp(3, 1, k) : 1); c.blob.visible = k >= 1;
    actuar(c, 0, [[0, k < 1 ? floatP(L.T, i) : { crouch: .25 * Math.exp(-(L.lt - t0 - .4) * 6) }]], { T: L.T, weight: false }); cara(c, L.T, k < 1 ? { eyes: 'wide', mouth: 'o' } : { expr: 'relief' }); });
  cm([10, 14, PZ + 40, 0, 16, PZ - 8, 54], [8, 11, PZ + 36, 0, 12, PZ - 8, 54], L.k); sh(V(0, 0, PZ - 8), 40); }, [[0, 'thud', .5], [.3, 'thud', .5], [.6, 'thud', .5]]);
// 62 «landete die ganze Stadt.»: toda la ciudad en el suelo, celebrando; me rodean
shot(77.08, 'F', null, L => { town(L); const c = put(ich, 0, 0, PZ, 0); actuar(c, 0, [[0, 'cheer']], { T: L.T }); laughF(c, L.T);
  extras(L, FL(), [[-6, PZ - 4, .5], [6, PZ - 5, -.5], [-11, PZ - 9, .4], [11, PZ - 10, -.4], [-3, PZ - 12, .1], [3, PZ - 13, -.1], [-15, PZ - 2, .9], [15, PZ - 1, -.9], [-8, PZ - 17, .3], [8, PZ - 18, -.3], [0, PZ - 20, 0]], 'cheer');
  orb(L.k, V(0, 6, PZ - 6), null, [30, 0, .22, 46], [25, .1, .2, 46]); sh(V(0, 0, PZ - 8), 34); }, [[0, 'crowd_cheer', .7]]);
// fiesta de noche en la plaza: guirnaldas de luces, gorros de fiesta, globos
const partyNight = L => { town(L, { night: true, z: PZ - 10 }); show(LICHT, 0, 0, PZ - 6, 0, 1); show(BALL, -12, 0, PZ - 8, 0, 1.6); show(BALL2, 12, 0, PZ - 10, 0, 1.6); };
const hats = (list) => list.forEach(c => { const i = POOL.indexOf(c); if (i >= 0) HATS[i].visible = true; });
// 63 «An dem Abend hat mir die ganze Stadt eine Party»: plaza de noche con luces; la ciudad entera me aplaude
shot(78.55, 'B', null, L => { partyNight(L); const c = put(ich, 0, 0, PZ, 0); actuar(c, 0, [[0, { aRx: 2.8, aRz: .4, aRe: .2, aLx: 2.8, aLz: .4, aLe: .2 }]], { T: L.T }); laughF(c, L.T);
  const L_ = FL(); extras(L, L_, [[-6, PZ - 4, .5], [6, PZ - 5, -.5], [-11, PZ - 9, .4], [11, PZ - 10, -.4], [-3, PZ - 12, .1], [3, PZ - 13, -.1], [-15, PZ - 2, .9], [15, PZ - 1, -.9], [-8, PZ - 17, .3], [8, PZ - 18, -.3], [0, PZ - 20, 0]], ['clap', 'cheer']); hats([ich, ...L_]);
  cm([0, 14, PZ + 30, 0, 6, PZ - 6, 46], [0, 9, PZ + 22, 0, 6, PZ - 6, 46], L.k); sh(V(0, 0, PZ - 8), 34); }, [[0, 'party_horn', .6], [.3, 'crowd_cheer', .6]]);
// 64 «eine Party geschmissen.»: confeti, gente bailando a mi alrededor; órbita
shot(80.17, 'C', null, L => { partyNight(L); const c = put(ich, 0, 0, PZ, .2); actuar(c, 0, [[0, 'cheer']], { T: L.T }); laughF(c, L.T); const L_ = FL().slice(0, 6); extras(L, L_, [[-6, PZ - 3, .6], [6, PZ - 4, -.6], [-9, PZ - 9, .4], [9, PZ - 9, -.4], [-3, PZ - 12, .1], [3, PZ - 12, -.1]], 'cheer'); hats([ich, ...L_]);
  confetti(V(0, 4, PZ - 4), L.t0, L.T, 40, 1.2); orb(L.k, V(0, 6, PZ - 4), null, [20, -.5, .14, 44], [18, .3, .14, 44]); sh(V(0, 0, PZ - 4), 30); }, [[0, 'confetti_pop', .7]]);
// 65 «Mit Haribo bis unter die Decke.»: en la sala de fiestas, una montaña de ositos y bolsas de Haribo hasta el techo; yo encima
shot(81.38, 'Z', null, L => { party(L); show(BERG, SAX, 0, -2, 0, 1.6); HAR.forEach((h, i) => show(h, SAX - 10 + (i % 3) * 10 + (i > 2 ? 5 : 0), i > 2 ? 4 : .2, 4 + (i > 2 ? -6 : 0), (i - 2) * .3, 1.4));
  SA.DB.visible = false; const c = put(ich, SAX, 5.6, 1, 0); actuar(c, 0, [[0, 'cheer']], { T: L.T }); laughF(c, L.T); hats([ich]); cm([SAX + 4, 4, 26, SAX, 6, -2, 50], [SAX + 2, 7, 23, SAX, 9, -2, 50], L.k); }, [[0, 'whoosh_up', .5], [.3, 'candy_rustle', .6]]);
// 66 «Dann sagte Jonas:»: Jonas se acerca entre la gente de la fiesta
shot(82.94, 'W', null, L => { partyNight(L); const c = put(ich, 2.4, 0, PZ, -.4); actuar(c, 0, [[0, { aLx: .3, aRx: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy' }); const j = walk(jonas, L, -6, PZ - 2, 1.1, 2.4, 1, { expr: 'happy' }); hats([ich, jonas]);
  extras(L, EXS.slice(0, 4), [[-10, PZ - 12, .3], [8, PZ - 12, -.3], [-2, PZ - 16, 0], [14, PZ - 6, -.8]], 'cheer'); { const p = j.root.position; orb(L.k, V((p.x + 2.4) / 2, 5, PZ - 1), null, [30, 0, .12, 46], [26, 0, .12, 46]); } sh(V(0, 0, PZ), 30); }, [[0, 'steps', .4]]);
// 67 «„Digga, du bist der coolste Typ»: Jonas me pone el pulgar arriba; bocadillo
shot(83.75, 'C', 'punch', L => { partyNight(L); const j = put(jonas, -2.2, 0, PZ, .5); actuar(j, 0, [[0, { aRx: 1.7, aRz: -.2, aRe: 1.2, aLx: .6, aLz: .5, aLe: .5 }]], { T: L.T }); talk(j, L.T, 83.75, 86.1, 'happy'); hats([jonas]);
  fcam(j, 12, L.k, 10, .1, -1.4, 40); bubble(j, 'COOLSTER TYP!', clamp((L.lt - .7) / .2), 2.2); sh(V(0, 0, PZ), 26); }, [[0, 'whoosh_soft', .4]]);
// 68 «der Stadt.“»: yo, halagado, me sonrojo con una sonrisa enorme
shot(84.91, 'S', null, L => { partyNight(L); const c = put(ich, 2.4, 0, PZ, -.4); actuar(c, 0, [[0, { aRx: 2.4, aRz: .3, aRe: 1.9, headZ: .12, aLx: .2 }]], { T: L.T }); cara(c, L.T, { eyes: 'happy', mouth: 'grin', blush: 1 }); hats([ich]);
  fcam(c, 10, L.k, 8.5, -.1, -1.1, 40); sh(V(0, 0, PZ), 26); }, [[0, 'aww', .5], [.3, 'sparkle', .4]]);
// 69 «Und ich konnte nicht anders.»: me aguanto: mofletes hinchados, tiemblo y sudo (zoom lento)
shot(86.39, 'Z', 'slow', L => { partyNight(L); const c = put(ich, 2.4, 0, PZ, -.2); actuar(c, 0, [[0, { aLx: .4, aRx: .4, aLe: 1.5, aRe: 1.5, ...shiver(L.T, 4 + L.k * 6) }]], { T: L.T }); cara(c, L.T, { eyes: 'squint', mouth: 'grimace', blush: 1 }); sweat(c, L.T); hats([ich]);
  fcam(c, 11, L.k, 7.5, 0, -1, 40); sh(V(0, 0, PZ), 26); }, []);
// 70 «HUSS!»: ¡HUSS! y mi cabeza se infla de golpe (1 → 4,5)
shot(88.07, 'F', 'punch', L => { partyNight(L); const c = put(ich, 2.4, 0, PZ, -.2); hussPose(c, L); kopf(c, pop(1, 4.5, L.lt / .3)); hussFX(L, 0, .1, 1.1); hats([ich]);
  extras(L, EXS.slice(0, 3), [[-6, PZ - 6, .4], [9, PZ - 8, -.4], [-1, PZ - 12, 0]], 'shock'); fcam(c, 24, L.k, 22, 0, -2.8, 44); sh(V(0, 0, PZ), 30); }, [[0, 'huss', 1], [.03, 'balloon_inflate', .9]]);
// 71 «Mein Kopf schoss durch die Wolken.»: mi cabeza gigante sube atravesando el mar de nubes
shot(88.61, 'W', null, L => { sky_(L, { night: true }); const y = lerp(-34, 4, easeOut(clamp(L.lt / 1.3))); const c = put(ich, WKX, y, -60, 0); kopf(c, 9); c.blob.visible = false; actuar(c, 0, [[0, { aLz: .3, aRz: .3 }]], { T: L.T }); cara(c, L.T, { eyes: 'wide', mouth: 'open_smile' });
  cm([WKX + 18, 34, -14, WKX, 12, -60, 50], [WKX + 14, 38, -20, WKX, 16, -60, 50], L.k); }, [[0, 'whoosh_up', .8], [.3, 'rocket', .5]]);
// 72 «Und jetzt traut sich in der ganzen Stadt keiner mehr,»: la gente en la plaza de noche mira al cielo en silencio, tapándose la boca
shot(90.4, 'S', null, L => { town(L, { night: true }); const L_ = [...FL(), ...KIDS]; extras(L, L_, [[-6, PZ - 2, .3], [5, PZ - 3, -.3], [-11, PZ - 8, .2], [10, PZ - 9, -.2], [-2, PZ - 11, 0], [3, PZ - 14, 0], [-15, PZ - 4, .6], [14, PZ - 2, -.6], [-8, PZ - 16, .2], [8, PZ - 17, -.2], [0, PZ - 20, 0], [-4, PZ + 3, .1], [4, PZ + 3, -.1], [-13, PZ + 2, .4], [13, PZ + 2, -.4]], 'idle');
  L_.forEach((c, i) => { actuar(c, 0, [[0, { aRx: 2.2, aRz: -.2, aRe: 2.2, headX: -.5 }]], { T: L.T }); cara(c, L.T, { eyes: 'up', mouth: 'flat' }); });
  cm([0, 6, PZ + 26, 0, 7, PZ - 6, 50], [0, 6, PZ + 22, 0, 8, PZ - 6, 50], L.k); sh(V(0, 0, PZ - 6), 34); }, [[0, 'crickets', .6]]);
// 73 «mir die Wahrheit zu sagen.»: yo por encima de las nubes, sonrisa chulesca bajo la luna; la cámara se aleja despacio
shot(92.0, 'F', null, L => { sky_(L, { night: true }); const c = put(ich, WKX, 4, -60, 0); kopf(c, 9); c.blob.visible = false; actuar(c, 0, [[0, {}]], { T: L.T }); cara(c, L.T, { expr: 'smug' });
  const h = hc(c); orb(L.k, h.add(V(0, -1, 0)), null, [36, .15, .1, 46], [54, .3, .2, 46], easeOut); }, [[0, 'wind', .5], [.5, 'ding_reveal', .4]]);
// ---------- portadas (fuera del vídeo; node cover.mjs) ----------
// Sin círculo rojo ni flecha. Cada una, una idea gráfica distinta:
// 1 «rueda de reconocimiento»: pared de medir de comisaría; el Paketbote y Oma con cabezas enormes y yo en medio con la cabeza normal. Carteles «HUSS ×…».
// 2 «cine»: atardecer en la plaza, contrapicado: yo abajo, mirando arriba, y el cielo lleno de gente flotando con cabezas gigantes.
const CV = () => { const c = document.createElement('canvas'); c.width = 2 * W; c.height = 2 * H; return c; };
const LINE_T = canvasTex(1024, 1024, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#3a4a66'); g.addColorStop(1, '#26324a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  for (let i = 0; i <= 20; i++) { const y = h - i * h / 20; c.fillStyle = i % 4 === 0 ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.45)'; c.fillRect(0, y - (i % 4 ? 2 : 4), w, i % 4 ? 4 : 8);
    if (i % 4 === 0 && i) { c.font = 'bold 44px sans-serif'; c.fillStyle = 'rgba(255,255,255,.85)'; c.textAlign = 'left'; c.fillText(String(i * 10), 16, y - 12); c.textAlign = 'right'; c.fillText(String(i * 10), w - 16, y - 12); } } });
const LINEUP = (() => { const g = new THREE.Group(); scene.add(g); const wm = new THREE.MeshStandardMaterial({ map: LINE_T, roughness: .85 }); const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), wm); wall.position.set(0, 20, -4); wall.receiveShadow = true; g.add(wall);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.MeshStandardMaterial({ color: 0x8a8f9a, roughness: .9 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, 8); fl.receiveShadow = true; g.add(fl); g.visible = false; return g; })();
function shot3d(build) { hideAll(); BAD_.length = 0; FX2D.length = 0; DOF = 0; build(); while (POST.length) POST.shift()(); clearFaces();
  if (HQ) renderer.toneMappingExposure *= .85; grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .5; grade.uniforms.sat.value = 1.5; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0;
  bloom.strength = .16; bloom.threshold = .86; camera.updateProjectionMatrix(); sky.sky.position.copy(camera.position); ao.enabled = true; bokeh.enabled = false; composer.render(); ao.enabled = false;
  const c = CV(); const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(renderer.domElement, 0, 0, c.width, c.height); return c; }
function word(c, t, x, y, size, font, fill, o = {}) { c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.font = `${size}px ${font}`; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.lineJoin = 'round';
  if (o.ls) c.letterSpacing = o.ls + 'px'; const tw = c.measureText(t).width, k = Math.min(1, (o.maxW || W * .9) / tw); c.scale(k, k);
  if (o.shadow !== false) { c.shadowColor = o.shCol || 'rgba(0,0,0,.55)'; c.shadowBlur = o.shB ?? 30; c.shadowOffsetY = o.shY ?? 12; }
  if (o.lw) { c.lineWidth = o.lw; c.strokeStyle = o.stroke || '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; }
  if (Array.isArray(fill)) { const g = c.createLinearGradient(0, -size * .8, 0, 0); g.addColorStop(0, fill[0]); g.addColorStop(1, fill[1]); c.fillStyle = g; } else c.fillStyle = fill; c.fillText(t, 0, 0); c.restore(); }
function grain(c, a = .05) { const r = RNG(77); c.save(); for (let i = 0; i < 9000; i++) { c.fillStyle = r() > .5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`; c.fillRect(r() * W, r() * H, 1.5, 1.5); } c.restore(); }
function placard(c, x, y, txt, col, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 20; c.shadowOffsetY = 8; c.fillStyle = '#f6f1e4'; c.beginPath(); c.roundRect(-130, -52, 260, 104, 14); c.fill(); c.shadowColor = 'transparent';
  c.lineWidth = 6; c.strokeStyle = '#1a1a22'; c.stroke(); c.font = '64px Lucky'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col; c.fillText(txt, 0, 6); c.restore(); }
window.renderCover = async v => { await document.fonts.load('80px Lucky'); await document.fonts.load('80px Lilita');
  out.width = 2 * W; out.height = 2 * H; octx.setTransform(2, 0, 0, 2, 0, 0); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; const c = octx; const T = 30;
  if (v === 0) {
    let P = [];
    const img = shot3d(() => { day(); LINEUP.visible = true; sun.intensity = 2.6; hemi.intensity = 1.1;
      const b = put(bote, -4.4, 0, 0, .18); kopf(b, 2.9); actuar(b, 0, [[0, { aLz: .15, aRz: .15, headY: .1 }]], { T }); cara(b, T, { expr: 'smug', eyes: 'half', mouth: 'smirk' });
      const o = put(oma, 4.6, 0, 0, -.15); kopf(o, 2.7); actuar(o, 0, [[0, { aLz: .15, aRz: .15, headY: -.1 }]], { T }); cara(o, T, { expr: 'happy', mouth: 'smile' });
      const m = put(ich, 0, 0, .6, 0); actuar(m, 0, [[0, { aLz: .12, aRz: .12 }]], { T }); cara(m, T, { expr: 'smug', eyes: 'half', mouth: 'smirk' });
      cam([0, 5.0, 34], [0, 5.2, 0], 40); sh(V(0, 0, 0), 22); sun.position.set(-30, 50, 60);
      P = [proj(V(-4.4, .2, 2.2)), proj(V(0, .2, 2.4)), proj(V(4.6, .2, 2.2))]; });
    LINEUP.visible = false; c.drawImage(img, 0, 0, W, H);
    // foco de comisaría desde arriba
    const sp = c.createRadialGradient(W / 2, H * .52, 80, W / 2, H * .52, 900); sp.addColorStop(0, 'rgba(255,250,230,.12)'); sp.addColorStop(1, 'rgba(0,0,20,.45)'); c.fillStyle = sp; c.fillRect(0, 0, W, H);
    placard(c, P[0][0], P[0][1], 'HUSS ×9', '#d8202a', -.04); placard(c, P[1][0], P[1][1], 'HUSS ×0', '#1e8a4a', 0); placard(c, P[2][0], P[2][1], 'HUSS ×7', '#d8202a', .04);
    const tg = c.createLinearGradient(0, 0, 0, 640); tg.addColorStop(0, 'rgba(10,14,30,.85)'); tg.addColorStop(1, 'rgba(10,14,30,0)'); c.fillStyle = tg; c.fillRect(0, 0, W, 640);
    word(c, 'IN DIESER STADT WÄCHST', W / 2, 340, 70, 'Lilita', '#ffffff', { lw: 16, stroke: '#0a0e1e', ls: 2 });
    word(c, 'DEIN KOPF', W / 2, 480, 150, 'Lucky', ['#ffffff', '#dfe8ff'], { lw: 28, stroke: '#0a0e1e', rot: -.02 });
    word(c, 'MIT JEDEM HUSS!', W / 2, 620, 120, 'Lucky', ['#ffe86a', '#ff9a1a'], { lw: 26, stroke: '#2a0c00', rot: -.02 });
    grain(c, .03);
  } else {
    let me;
    const img = shot3d(() => { town({}); dusk(); scene.fog.density = .0005;
      me = put(ich, 0, 0, 30, 0); actuar(me, 0, [[0, { headX: -.5, aLz: .25, aRz: .25, aLx: .2, aRx: .2 }]], { T }); cara(me, T, { eyes: 'up', mouth: 'o', noBlink: true });
      const fl = [...EXS.slice(0, 8), ...VEC.slice(1, 5), mayor, bote, oma, jonas]; const r = RNG(21);
      fl.forEach((ch, i) => { const a = (i / fl.length) * 6.283 + r() * .3, d = 5 + r() * 14; flot(ch, { T: T + i }, Math.cos(a) * d, 20 + r() * 16, 14 + Math.sin(a) * d * .8, (r() - .5) * .8, 2.6 + r() * 1.6, i, { expr: ['joy', 'shock', 'happy', 'worried'][i % 4] }); });
      cam([0, 1.6, 45], [0, 9, 22], 56); sh(V(0, 0, 24), 40); lp(0, 2, 5, 36, 30, 0xffd8a0, 20); });
    c.drawImage(img, 0, 0, W, H);
    const tg = c.createLinearGradient(0, 0, 0, 420); tg.addColorStop(0, 'rgba(20,10,40,.6)'); tg.addColorStop(1, 'rgba(20,10,40,0)'); c.fillStyle = tg; c.fillRect(0, 0, W, 420);
    const bg = c.createLinearGradient(0, H - 520, 0, H); bg.addColorStop(0, 'rgba(20,10,40,0)'); bg.addColorStop(1, 'rgba(20,10,40,.75)'); c.fillStyle = bg; c.fillRect(0, H - 520, W, 520);
    word(c, 'DIE HALBE STADT', W / 2, 800, 112, 'Lucky', ['#ffffff', '#ffe2f0'], { lw: 24, stroke: '#1a0a2a', ls: 3 });
    word(c, 'SCHWEBT…', W / 2, 960, 160, 'Lucky', ['#ffe07a', '#ff7a3a'], { lw: 30, stroke: '#2a0a00', ls: 4, rot: -.03 });
    word(c, '…AUSSER MIR!', W / 2, 1075, 84, 'Lucky', ['#c8ff7a', '#5ad83a'], { lw: 20, stroke: '#0a2a0a', ls: 3, rot: .02 });
    grain(c, .035);
  } };


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
  if (HQ) { renderer.toneMappingExposure *= +(QS.get('exp') ?? .85); grade.uniforms.sat.value = +(QS.get('sat') ?? 1.38); grade.uniforms.sharp.value = .6; grade.uniforms.vig.value = Math.min(grade.uniforms.vig.value, .32); bloom.strength = Math.min(Math.max(bloom.strength, .14), .2); bloom.threshold = .88; ao.enabled = QS.get('ao') !== '0'; DOF = 1; }
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
window.DBG = { applyPose, hp, ich, jonas, cam, HB, renderer, composer, bloom, sun, grade, scene, camera };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

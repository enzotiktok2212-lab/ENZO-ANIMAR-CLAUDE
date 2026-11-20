// KELLER — «In dieser Stadt gibt es eine Stadt!»: en cada sótano hay una ciudad diminuta, y en la suya otra… hasta el móvil del espectador. 1080×1920, 30 fps.
// Réplica de la estructura del vídeo de referencia con otra ciudad (casas amarillas y rojas), otro reparto (Thomas) y otros datos.
// Planos en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, runPose, idlePose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { ciudad, keller, treppe, puppenhaus, flurTreppe, toyCar, kHaus, TABLE_Y, MINI_S, RING, skyTex } from './ksets.js';
import { makeThomas, makePohl } from './kcast.js';
import { lupe, brezel, goldbar, goldpile, tornado, explosion, deckel, leiter, zeppelin, handyRect, daumen, bulb, zimmer } from './kprops.js';
import { makeExtra } from './ecast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 129.15, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
// Ciudad (x = 0): plaza [-32, 32], carretera en cuadro (carril a ±38), casas desde ±50; casa de Thomas al norte (0, -62).
// Keller (KX = 900): mesa en (KX, 5.4, 0) con la maqueta (escala .062); ventana al fondo (z = -22); escalera a la derecha.
// Treppe (TX = 1300): escalera estrecha que baja hacia -z, puerta con luz abajo.
const KX = 900, TX = 1300, PX = 1700;
const CITY = ciudad(scene); const MINI_T = ciudad(null, { mini: true });
const KE = keller(scene, KX, MINI_T), TR = treppe(scene, TX), PU = puppenhaus(scene, PX, MINI_T);
// gancho: la casa de Thomas por dentro (pasillo + escalera) y su sótano justo debajo, con la maqueta (todo conectado)
const FT = flurTreppe(scene), HK = keller(scene, 3.25, MINI_T, { y: -26, z: -104.5, door: true, window: false });
HK.traverse(m => { if (m.isMesh) m.castShadow = false; }); HK.userData.MINI.traverse(m => { if (m.isMesh) m.castShadow = true; }); HK.userData.LAMPS.forEach(l => l.intensity = 25);
const HMC = V(3.25, -26 + TABLE_Y + 6 * MINI_S, -104.5);   // centro de la maqueta del gancho
const SETS = { CI: CITY, KE: KE, TR: TR, PU: PU, FT: FT, HK: HK };
outline(CITY, 1.4); outline(FT, 1.2); outline(HK, 1.2); outline(KE, 1.2); outline(TR, 1.2); outline(PU, 1.2);
// ---------- reparto ----------
const ich = makeThomas(scene), ichG = makeThomas(scene), ichT = makeThomas(scene), ichT2 = makeThomas(scene), pohl = makePohl(scene);
[ich, ichG, ichT, ichT2].forEach(c => kitFace(c, 'hero')); kitFace(pohl, 'girl');
// el espectador (la cara detrás del móvil): sudadera con capucha gris, pelo castaño
const fan = makeExtra(scene, 30); kitFace(fan, 'plain');
const EX = Array.from({ length: 24 }, (_, i) => makeExtra(scene, i)); EX.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'girl', 'mustache', 'girl'][i % 6]));
const POOL = [ich, ichG, ichT, ichT2, pohl, fan, ...EX]; POOL.forEach(c => outline(c.root, 2));
// ---------- atrezo ----------
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 2 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const FW = []; const NOTES = []; const HEARTS = []; const STEAM = []; const FIRE = [];
const LUPE = lupe(scene), LUPE2 = lupe(scene), BRZ = brezel(scene), BRZ2 = brezel(scene), GB = goldbar(scene), GB2 = goldbar(scene), GPILE = goldpile(scene), TOR = tornado(scene), EXP = explosion(scene);
const DECK = deckel(scene), LEI = leiter(scene), ZEP = zeppelin(scene), HANDY = handyRect(scene), THUMB = daumen(scene), BULB = bulb(scene);
const CAR_P = toyCar(scene, 0x3ac8c8);   // el coche de Frau Pohl
const ZIM = zimmer(scene, 2400); SETS.ZI = ZIM;
[LUPE, LUPE2, BRZ, BRZ2, GB, GB2, GPILE, LEI, ZEP, THUMB, CAR_P].forEach(o => outline(o, 1.4)); outline(ZIM, 1.2);
const PROPS = [...CONF, ...DUST, ...SWEAT, ...TEAR, LUPE, LUPE2, BRZ, BRZ2, GB, GB2, GPILE, TOR, EXP, DECK, LEI, ZEP, HANDY, THUMB, BULB, CAR_P];
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.25; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.55, .62, .42); sun.intensity = 2.5; sun.color.setRGB(1, .95, .86); rim.intensity = 1.0;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.05; setSky([.04, .05, .2], [.12, .12, .38], [.32, .22, .5]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.15; hemi.color.setRGB(.7, .74, 1); hemi.groundColor.setRGB(.32, .28, .4); sun.intensity = 1.2; sun.color.setRGB(.78, .78, 1); rim.intensity = 1.8;
  scene.fog.color.setRGB(.12, .12, .3); scene.fog.density = .001; bloom.strength = .32; bloom.threshold = .82; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; bloom.threshold = .86; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const k in SETS) SETS[k].visible = false; SPEED = 0; GRID = null; sky.sky.visible = true; PU.userData.roof.visible = true; CITY.userData.CARS.forEach(c => c.visible = true); if (CITY.userData.TH.userData.doorPiv) CITY.userData.TH.userData.doorPiv.rotation.y = 0;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = 1.12; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; day(); }
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
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk', extra = {}) => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat', ...extra });
const grin = (ch, T, ex = {}) => cara(ch, T, { expr: 'grin', eyes: 'happy', mouth: 'grin', ...ex });
const laughF = (ch, T) => cara(ch, T, { eyes: 'happy', mouth: Math.sin(T * 22) > 0 ? 'laugh' : 'open_smile' });
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
const tears = (ch, T) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < 2; i++) { const k = (T * 1.1 + i * .5) % 1; TEAR[i].visible = true; TEAR[i].position.copy(h).add(V((i ? -.3 : .3) * s, (.75 - k * 1.1) * s, .7 * s)); } };
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
function fireworks(c, T, n = 3, R = 14) { FW.forEach((s, i) => { const b = i % n, k = Math.floor(i / n), per = 1.6, t = ((T + b * .53) % per) / per, r0 = RNG(b * 17 + Math.floor((T + b * .53) / per) * 31); const cx = c.x + (r0() - .5) * 60, cy = c.y + 30 + r0() * 20, cz = c.z + (r0() - .5) * 20;
  const a = k / (FW.length / n) * 6.283, el = Math.sin(k * 2.3) * .8; s.visible = t > .25; const e = easeOut((t - .25) / .75) * R; s.position.set(cx + Math.cos(a) * Math.cos(el) * e, cy + Math.sin(el) * e - t * t * 4, cz + Math.sin(a) * Math.cos(el) * e); s.scale.setScalar(1 - t * .8); s.material.color.setHSL((b * .27 + .05) % 1, 1, .6).multiplyScalar(2.5); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.5 + t * 1.4) * s * (.8 + r() * .5)); d.material.opacity = .4 * (1 - t / 1.2); }); }
function notes(p, T) { NOTES.forEach((z, i) => { const k = (T * .7 + i / 4) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 2 + T) * 1.5, p.y + k * 4, p.z + .5); z.scale.setScalar(.6 + k * .6); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
function hearts(p, T) { HEARTS.forEach((z, i) => { const k = (T * .6 + i / 5) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 1.7 + T) * 1.4, p.y + k * 3.4, p.z + .4); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
function steam(p, T, n = 6) { STEAM.forEach((s, i) => { if (i >= n) return; const k = (T * .8 + i / n) % 1; s.visible = true; s.position.set(p.x + Math.sin(i * 2.1 + T) * 1.2, p.y + k * 4, p.z + Math.cos(i * 1.7) * .8); s.scale.setScalar(.25 + k * .6); s.material.opacity = .22 * (1 - k); }); }
function flames(p, T, w = 5) { FIRE.forEach((f, i) => { f.visible = true; const r = RNG(i * 7 + 1); f.position.set(p.x + (i / 7 - .5) * w, p.y + .4 + Math.abs(Math.sin(T * 12 + i)) * .3, p.z + (r() - .5) * 1.2); f.scale.set(.35, (.7 + Math.abs(Math.sin(T * 15 + i * 2)) * .9) * .35, .35); f.position.y = p.y + .1; }); }
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));

// ---------- gente ----------
const runPoseK = (T, i = 0) => runPose(T + i * .3, 1.2);
const idlePoseK = (T, i = 0) => idlePose(T, i);
const walkP = (T, i, sp = 9) => { const p = Math.sin(T * sp + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
// paseante: camina de a a b (en bucle de período per), mirando hacia donde va
function stroll(c, a, b, T, per = 8, i = 0, expr = 'joy') { const u = ((T / per + i * .37) % 1), k = u < .5 ? u * 2 : 2 - u * 2, x = lerp(a[0], b[0], k), z = lerp(a[1], b[1], k), dir = u < .5 ? 1 : -1;
  put(c, x, 0, z, Math.atan2((b[0] - a[0]) * dir, (b[1] - a[1]) * dir)); actuar(c, 0, [[0, walkP(T, i * 1.3)]], { T }); cara(c, T + i, { expr, mouth: 'smile' }); return c; }
// gente en la plaza: unos pasean, otros charlan, uno riega flores (solo extras reales)
function plazaLife(T, n = 14, seed = 3, avoid = null) { const r = RNG(seed); for (let i = 0; i < n; i++) { const c = EX[i]; const x0 = (r() - .5) * 52, z0 = (r() - .5) * 52, ang = r() * 6.283, L = 6 + r() * 8;
  if (Math.hypot(x0, z0) < 11) continue; if (avoid && avoid(x0, z0)) continue;
  if (i % 3 === 2) { put(c, x0, .5, z0, r() * 6.283); actuar(c, 0, [[0, { aLx: .5 + Math.sin(T * 3 + i) * .3, aLe: 1.2, aRx: .2, headY: Math.sin(T + i) * .3 }]], { T }); cara(c, T + i, { expr: 'happy', mouth: kitLips(T * 1.3 + i, [[0, 1e6]]) || 'smile' }); }
  else { stroll(c, [x0, z0], [x0 + Math.cos(ang) * L, z0 + Math.sin(ang) * L], T, 7 + i % 4, i); c.root.position.y = .5; } } }
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
const KEY = /^(Stadt|Thomas|Keller|winzige|winzigere|Albtraum|Tornado|Erdbeben|Neun|Rathaus|explodiert|Seltsames|Junge|Lupe|Satz|Hunderte|dasselbe|Himmel|Deckel|Auge|Riesen-Thomas|Brezel|BUMM|Haus|Brezeln|Goldbarren|Auto|Pohl|reichste|oben|Leiter|größeren|achtzig|Zeppelin|Handy|Gesicht|Deins|Daumen|Nein|weiterscrollen|Frage|vielleicht|Sekunde|Eine|ich)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t), huss: w[2] === 'BUMM!' }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.huss ? 1.5 : cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); if (cur.huss) c.rotate(((Math.round(cur.t * 10) % 2) ? -1 : 1) * .06); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0, SPEED = 0, GRID = null;
// ---------- a: gancho (zoom infinito CONTINUO, sin cortes) y presentación (0 – 15,35 s) ----------
// Un solo movimiento de cámara por ciclo, en un espacio conectado: la ciudad desde el aire → la puerta de la casa de Thomas (se abre) → el pasillo →
// la escalera que baja → el sótano justo debajo de la casa → la maqueta de la mesa. La pose final dentro de la maqueta es exactamente la pose inicial
// a escala, así que el siguiente ciclo empieza en la ciudad grande sin que se note: zoom infinito.
const MC = V(KX, TABLE_Y + 6 * MINI_S, 0);   // centro de la maqueta del sótano de los demás planos
const HP0 = [[0, 100, 36], [0, 0, -30], 46];   // pose aérea de la ciudad (relativa al centro de la plaza)
const toMini = p => V(HMC.x + p[0] * MINI_S, HMC.y + p[1] * MINI_S, HMC.z + p[2] * MINI_S);
const HK_KEYS = [   // u, posición, objetivo, fov
  [0, V(...HP0[0]), V(...HP0[1]), 46], [.16, V(1.5, 42, -6), V(3.25, 4, -52), 46], [.30, V(3.25, 3.6, -41), V(3.25, 3.2, -60), 50], [.37, V(3.25, 3.4, -51.5), V(3.25, 2.4, -62), 54],
  [.44, V(3.25, 3.2, -56), V(3.25, -8, -68), 56], [.58, V(3.25, -9.5, -69), V(3.25, -21, -86), 56], [.70, V(3.25, -16.5, -86), V(3.25, -23, -102), 52], [.84, V(3.25, -17.5, -96), V(3.25, -23, -104.5), 48],
  [1, toMini(HP0[0]), toMini(HP0[1]), 46]];
const HK_P = new THREE.CatmullRomCurve3(HK_KEYS.map(k => k[1]), false, 'centripetal'), HK_T = new THREE.CatmullRomCurve3(HK_KEYS.map(k => k[2]), false, 'centripetal');
function hookCam(u) { u = clamp(u); let i = 0; while (i < HK_KEYS.length - 2 && u > HK_KEYS[i + 1][0]) i++; const a = HK_KEYS[i], b = HK_KEYS[i + 1], f = clamp((u - a[0]) / (b[0] - a[0])), t = (i + f) / (HK_KEYS.length - 1);
  const p = HK_P.getPoint(t), q = HK_T.getPoint(t); cam([p.x, p.y, p.z], [q.x, q.y, q.z], lerp(a[3], b[3], easeInOut(f))); return p; }
// la velocidad dentro de cada ciclo: arranca rápido, se frena un pelín en la puerta y acelera al caer en la maqueta
const hookU = k => clamp(k * .82 + .18 * easeIn(k));
function hookLoop(L, cycles) { day(); scene.fog.density = 0; use('CI', 'FT', 'HK'); CITY.userData.CARS.forEach(c => c.visible = false);
  // ciclo actual según la hora absoluta
  let c = 0; while (c + 1 < cycles.length && L.T >= cycles[c + 1]) c++; const t0 = cycles[c], t1 = c + 1 < cycles.length ? cycles[c + 1] : t0 + 2.2, u = hookU((L.T - t0) / (t1 - t0));
  const p = hookCam(u); CITY.userData.TH.userData.doorPiv.rotation.y = 1.55 * easeOut(clamp((u - .2) / .12));
  const under = p.z < -52.6; CITY.visible = !under;   // bajo la casa no se ve la ciudad (y no tapa el sol de la maqueta)
  SPEED = .35 + .35 * Math.sin(u * Math.PI); BLUR = .006 * Math.sin(u * Math.PI);
  if (under) sh(V(HMC.x, HMC.y, HMC.z), 12); else sh(V(0, 0, -30), 90);
  // golpe de zoom al empezar cada frase (sin corte)
  const since = L.T - t0; if (c > 0 && since < .2) camera.fov *= lerp(.75, 1, easeOut(since / .2)); }
const HOOK_C = [0, 2.19, 4.50, 6.60, 8.8];
shot(0, 'W', null, L => hookLoop(L, HOOK_C), [[0, 'whoosh', .6], [.45, 'door', .5], [.75, 'steps', .5], [1.15, 'whoosh', .5], [1.5, 'sparkle', .4],
  [2.19, 'impact', .5], [2.64, 'door', .5], [2.95, 'steps', .5], [3.4, 'whoosh', .5], [3.8, 'sparkle', .4], [4.50, 'impact', .5], [4.95, 'door', .5], [5.25, 'steps', .5], [5.7, 'whoosh', .5], [6.1, 'sparkle', .4], [6.60, 'impact', .6]]);

// «Ich heiße Thomas, und»: yo en el sótano junto a la maqueta, saludo a cámara
shot(7.13, 'W', null, L => { use('KE'); inside(.95, 0); const c = put(ich, KX - 7.5, 0, 3, .3);
  actuar(c, 0, [[0, 'wave']], { T: L.T }); talk(c, L.T, 7.13, 8.31, 'joy', { eyes: 'happy' });
  orb(L.k, V(KX - 6, 3.4, 3), null, [15, .42, .12, 46], [12.5, .3, .1, 46]); sh(V(KX, 0, 4), 22); }, [[0, 'pop', .4], [.2, 'zoom_fast', .3]]);
// «in meiner Stadt hat»: grúa sobre mi ciudad viva (gente en la plaza, coches)
shot(8.31, 'Z', null, L => { use('CI'); day(); plazaLife(L.T, 18, 11);
  cm([-22, 62, 44, 0, 0, -14, 50], [-4, 74, 50, 0, 0, -18, 48], L.k); sh(V(0, 0, 0), 60); }, [[0, 'city_amb', .5], [.4, 'car_pass', .4]]);
// «jeder eine winzige Stadt»: la vecina se inclina sobre SU maqueta (otro sótano, otro ángulo)
shot(9.35, 'S', null, L => { use('KE'); inside(.95, 0); const c = put(pohl, KX + 1, 0, -6.4, 0); actuar(c, 0, [[0, { lean: .35, headX: .4, aLx: 1.0, aRx: 1.0, aLz: -.25, aRz: -.25, aLe: .6, aRe: .6 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'open_smile' });
  orb(L.k, V(KX + .5, 3.6, -3), null, [15, -.25, .4, 44], [12.5, -.05, .42, 44]); sh(V(KX, 0, -4), 22); }, [[0, 'swipe', .4], [.3, 'sparkle', .4]]);
// «im Keller.»: corte de la casa de muñecas: el sótano bajo la casa, con su mesa y su maqueta
shot(10.47, 'C', 'punch', L => { use('PU'); day(); const c = put(EX[2], PX + .6, -15, -6.6, 0); actuar(c, 0, [[0, { lean: .12, headX: .12, aRx: .8 + Math.sin(L.T * 3) * .1, aLx: .8, aRe: .5, aLe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' });
  cm([PX + 3, -3, 34, PX + 1, -10, -3, 40], [PX + 1.5, -6, 23, PX + .5, -11, -3, 40], L.k); sh(V(PX, 0, 0), 40); }, [[0, 'thud', .5]]);
// «Und die winzigen Leute da unten»: dentro de la maqueta, a ras de suelo: un vecino diminuto pasea entre flores; arriba, mi cara gigante
shot(11.45, 'Z', null, L => { use('KE'); inside(1.0, 0); const s = MINI_S;
  // vecinos diminutos paseando por la plaza de la maqueta (extras reales a escala de la maqueta), la cámara a su altura, retrocediendo delante del primero
  const wz = (13 + L.k * 7) * s, wx = KX + 1 * s;
  [[EX[5], wx, wz, 0], [EX[8], wx - 4.5 * s, wz - 9 * s, 1], [EX[11], wx + 4.5 * s, wz - 11 * s, 2]].forEach(([c, x, z, i]) => { put(c, x, MC.y + .5 * s, z, 0); c.root.scale.setScalar(.95 * s); actuar(c, 0, [[0, walkP(L.T, i * 1.7)]], { T: L.T }); cara(c, L.T + i, { expr: 'joy', eyes: i ? undefined : 'happy', mouth: i ? 'smile' : 'open_smile' }); });
  cm([wx + 1.5 * s, MC.y + 6 * s, wz + 15 * s, wx, MC.y + 4 * s, wz - 3 * s, 46], [wx + 1 * s, MC.y + 5.5 * s, wz + 12 * s, wx, MC.y + 4 * s, wz - 3 * s, 46], L.k); sh(V(KX, 0, 0), 22); }, [[0, 'steps', .4], [.4, 'birds', .4]]);
// «haben eine noch winzigere Stadt»: desde el aire, bajando hacia la casa cortada
shot(12.85, 'W', 'slow', L => { use('PU'); day(); PU.userData.roof.visible = false; const c = put(EX[2], PX + .6, -15, -6.6, 0); actuar(c, 0, [[0, { lean: .12, headX: .12, aRx: .8 + Math.sin(L.T * 3) * .1, aLx: .8, aRe: .5, aLe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'smile' });
  cm([PX + 8, 26, 70, PX, -2, -4, 46], [PX + 2, -1, 34, PX, -10, -3, 44], L.k); sh(V(PX, 0, 0), 40); }, [[0, 'whoosh', .4]]);
// «in ihrem Keller.»: primer plano de la mesa del sótano diminuto, con su maqueta aún más pequeña
shot(14.37, 'C', 'punch', L => { use('PU'); day(); const c = put(EX[2], PX + .6, -15, -6.6, 0); actuar(c, 0, [[0, { lean: .12, headX: .12, aRx: .8 + Math.sin(L.T * 3) * .1, aLx: .8, aRe: .5, aLe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' });
  cm([PX + 1.5, -6.5, 12, PX + .5, -11, -3, 50], [PX + 1.2, -7.4, 9.5, PX + .5, -11.3, -3, 48], L.k); sh(V(PX, -15, 0), 20); }, [[0, 'impact', .5], [.2, 'sparkle', .4]]);
// ---------- b: la pesadilla, el niño diminuto, la lupa, otro Thomas (15,35 – 47,88 s) ----------
const kel = (L, lamp = 110) => { use('KE'); inside(1.0, 0); KE.userData.LAMPS.forEach(l => l.intensity = lamp); sh(V(KX, 0, 0), 20); };
// yo detrás de la mesa (lado norte), mirando la maqueta (+z)
const atTable = (ch, T, pose = {}, x = KX, z = -6.6) => { put(ch, x, 0, z, 0); actuar(ch, 0, [[0, { lean: .3, headX: .35, aLx: .9, aRx: .9, aLz: -.2, aRz: -.2, aLe: .5, aRe: .5, ...pose }]], { T }); return ch; };
// personaje a escala de maqueta, en coordenadas de la ciudad (x, z)
const tiny = (c, x, z, ry = 0, f = 1) => { put(c, KX + x * MINI_S, MC.y + .5 * MINI_S, z * MINI_S, ry); c.root.scale.setScalar((c.spec.scale || 1) * MINI_S * f); return c; };
const mw = (x, y, z) => V(KX + x * MINI_S, MC.y + y * MINI_S, z * MINI_S);   // punto de la maqueta
const sneeze = (T, t0) => { const k = T - t0; if (k < 0) return {}; return k < .35 ? { headX: -.35 * easeOut(k / .35), lean: -.15 } : { headX: .5, lean: .45 }; };

// «Klingt cool, oder?»: a ras de la maqueta; yo, gigante, sonriendo detrás de los tejados
shot(15.35, 'Z', null, L => { kel(L); atTable(ich, L.T, { headX: .25 }); talk(ich, L.T, 15.35, 16.2, 'joy', { eyes: 'happy' });
  const h = hp(ich); cm([KX + 6 * MINI_S, MC.y + 44 * MINI_S, 100 * MINI_S, h.x, h.y - .2, h.z, 50], [KX + 4 * MINI_S, MC.y + 40 * MINI_S, 90 * MINI_S, h.x, h.y - .1, h.z, 48], L.k); }, [[0, 'whoosh', .4], [.3, 'sparkle', .4]]);
// «Glaub mir,»: primer plano, me pongo serio
shot(16.37, 'C', 'punch', L => { kel(L); atTable(ich, L.T, { headX: .05, lean: .1 }); talk(ich, L.T, 16.37, 17.0, 'sus', { eyes: 'half', mouth: 'flat' });
  onFace(ich, 5.2, .8, .4, 42, L.k, 4.6); }, [[0, 'thud', .4]]);
// «es ist ein Albtraum.» (zoom lento): me tapo la cara, la maqueta delante
shot(17.09, null, 'slow', L => { kel(L, 70); atTable(ich, L.T, { ...GEST.facepalm, lean: .1 }); cara(ich, L.T, { expr: 'sad', eyes: 'closed', mouth: 'frown' });
  orb(L.k, V(KX, 3.6, -6), null, [13, 0, .38, 44], [10, 0, .34, 42]); }, [[0, 'groan', .4]]);
// «Wenn ich niese,»: echo la cabeza atrás… ¡achís! sobre la maqueta
shot(18.40, 'W', null, L => { kel(L); const t0 = 18.95; atTable(ich, L.T, { ...sneeze(L.T, t0), aLx: .6, aRx: .6 }); cara(ich, L.T, L.T < t0 ? { expr: 'shock', eyes: 'squint', mouth: 'o' } : { eyes: 'closed', mouth: 'shout' });
  if (L.T > t0 + .3) for (let i = 0; i < 8; i++) { const d = SWEAT[i % 3]; }
  dust(V(KX, MC.y + .3, -1.5), t0 + .3, L.T, 14, .5); orb(L.k, V(KX, 3.6, -4.5), null, [12, .5, .42, 46], [11, .42, .4, 46]); }, [[.4, 'gasp', .4], [.55, 'sneeze', .7]]);
// «bekommt die Stadt unter mir einen Tornado.»: el tornado arrasa la plaza
shot(19.24, 'Z', 'punch', L => { use('CI'); day(); TOR.visible = true; TOR.position.set(-6 + L.k * 10, 0, -6); TOR.userData.update(L.T); setSky([.32, .38, .5], [.5, .55, .62], [.7, .72, .76]);
  [EX[0], EX[1], EX[3], EX[4]].forEach((c, i) => { const x = 18 + i * 5 - L.k * 6, z = 14 + (i % 2) * 6; put(c, x, .5, z, -Math.PI / 2 - .3); actuar(c, 0, [[0, runPoseK(L.T, i)]], { T: L.T }); cara(c, L.T + i, { expr: 'shock', mouth: 'shout' }); });
  cm([22, 14, 30, 0, 16, -6, 56], [18, 12, 26, 0, 18, -6, 56], L.k); SHAKE = .4; sh(V(0, 0, 0), 60); }, [[0, 'wind', .8], [.4, 'rumble', .5]]);
// «Wenn die niesen,»: un vecino diminuto estornuda en la plaza
shot(21.15, 'S', null, L => { use('CI'); day(); plazaLife(L.T, 10, 21, (x, z) => Math.abs(x - 2) < 7 && Math.abs(z - 22) < 8); const c = EX[7]; const t0 = 21.6;
  put(c, 2, .5, 22, -.3); actuar(c, 0, [[0, { ...sneeze(L.T, t0), aLx: .5, aRx: .5, aLe: 1.6, aRe: 1.6 }]], { T: L.T }); cara(c, L.T, L.T < t0 ? { expr: 'shock', eyes: 'squint', mouth: 'o' } : { eyes: 'closed', mouth: 'shout' });
  dust(V(2, 3, 24), t0 + .2, L.T, 10, .3); orbit(V(2, 3.6, 22), lerp(11, 9.5, L.k), -.3, .12, 44); sh(V(2, 0, 22), 16); }, [[.4, 'sneeze', .6]]);
// «bekommt die nächste ein Erdbeben.»: la ciudad tiembla, grietas y polvo
shot(22.05, 'C', 'punch', L => { use('CI'); day(); const q = Math.sin(L.T * 40) * .4;
  [EX[9], EX[10], EX[12]].forEach((c, i) => { put(c, -10 + i * 7, .5, 26 - i * 2, .2); actuar(c, 0, [[0, { ...GEST.shock, lean: Math.sin(L.T * 20 + i) * .2 }]], { T: L.T }); cara(c, L.T + i, { expr: 'shock', mouth: 'shout' }); });
  dust(V(-4, 0, 22), 22.1, L.T, 16, 1.4); cm([-4 + q, 12, 52, -4, 6, 0, 50], [-4 - q, 10, 46, -4, 6, -4, 50], L.k); SHAKE = 1; sh(V(0, 0, 10), 50); }, [[0, 'rumble', .8], [.3, 'crash', .5]]);
// «Neun Städte tiefer»: bajada en picado por la escalera de nuevo, el contador sube 1…9
shot(23.65, 'Z', null, L => { day(); scene.fog.density = 0; use('CI', 'FT', 'HK'); CITY.userData.CARS.forEach(c => c.visible = false); const u = (L.k * 3) % 1; const p = hookCam(hookU(u)); CITY.visible = p.z >= -52.6;
  CITY.userData.TH.userData.doorPiv.rotation.y = 1.55; SPEED = .7; if (p.z < -52.6) sh(V(HMC.x, HMC.y, HMC.z), 12); else sh(V(0, 0, -30), 90);
  badge('gold', String(Math.min(9, 1 + Math.floor(L.k * 9))), W / 2, H * .2, 1, 1, 1.4); }, [[0, 'whoosh', .6], [.5, 'whoosh', .5], [1.0, 'whoosh', .5]]);
// «ist gerade das Rathaus explodiert!»: el Rathaus revienta
shot(24.95, 'C', 'punch', L => { use('CI'); day(); const t0 = 25.55, k = clamp((L.T - t0) / 1.3); EXP.visible = true; EXP.position.set(0, 10, 58); EXP.userData.set(k, 14); CITY.userData.RH.g.visible = k < .12;
  [EX[13], EX[14]].forEach((c, i) => { put(c, -6 + i * 12, .5, 34, Math.PI + (i ? .3 : -.3)); actuar(c, 0, [[0, L.T > t0 ? GEST.shock : { aLx: .2 }]], { T: L.T }); cara(c, L.T, { expr: L.T > t0 ? 'shock' : 'neutral', mouth: L.T > t0 ? 'shout' : 'flat' }); });
  cm([4, 14, 6, 0, 12, 58, 50], [3, 13, 10, 0, 13, 58, 52], L.k); if (L.T > t0) SHAKE = 1 - k; sh(V(0, 0, 50), 40); }, [[.55, 'explosion', .9], [.7, 'crash', .5]]);
// «Tschuldigung!»: yo, avergonzado, mano en la nuca, humo saliendo de la maqueta
shot(26.17, 'W', null, L => { kel(L); atTable(ich, L.T, { aRx: 2.5, aRz: .1, aRe: 2.0, headX: .1, headZ: .15, lean: .05 }); cara(ich, L.T, { expr: 'worried', eyes: 'happy', mouth: 'grimace' });
  dust(mw(0, 0, 50), 26.0, L.T, 10, .25); onFace(ich, 5.4, -.2, -.5, 42, L.k, 4.8); }, [[0, 'pop', .4]]);
// «Aber eines Tages fiel mir etwas Seltsames auf.» (zoom lento): me acerco a la maqueta, extrañado
shot(27.08, null, 'slow', L => { kel(L, 70); atTable(ich, L.T, { lean: .45, headX: .5, headY: Math.sin(L.T * 1.5) * .2 }); cara(ich, L.T, { expr: 'confused', mouth: 'o' });
  orb(L.k, V(KX, 3.6, -5), null, [13, -.5, .45, 44], [10, -.4, .42, 42]); }, [[0, 'whoosh', .3]]);
// «Klar.»: cara de listillo
shot(29.70, 'C', 'punch', L => { kel(L); atTable(ich, L.T, { headX: 0, lean: .05, ...GEST.cross }); cara(ich, L.T, { expr: 'smug', mouth: 'smirk' }); onFace(ich, 4.8, .8, .6, 42, L.k, 4.3); }, [[0, 'pop', .4]]);
// «Mir fällt immer was auf.»: saco la lupa y guiño
shot(30.18, 'S', null, L => { kel(L); atTable(ich, L.T, { lean: .05, headX: 0, aRx: 1.9, aRz: -.2, aRe: .8 }); talk(ich, L.T, 30.18, 31.2, 'smug', { eyes: 'half' });
  attach(LUPE, ich.aR.hand, [0, -.6, .4], [0, 0, 0], .7); onFace(ich, 5.6, .8, -.6, 44, L.k, 5); }, [[0, 'sparkle', .5]]);
// «In meiner winzigen Stadt stand ein winziger Junge»: en la maqueta, un niño diminuto solo en la acera (¡igualito a mí!)
shot(31.35, 'Z', null, L => { kel(L); tiny(ichT, 4, 44, Math.PI); actuar(ichT, 0, [[0, idlePoseK(L.T)]], { T: L.T }); cara(ichT, L.T, { expr: 'neutral', mouth: 'flat' });
  const p = mw(4, 2.6, 44); cm([p.x + 8 * MINI_S, p.y + 6 * MINI_S, p.z - 26 * MINI_S, p.x, p.y, p.z, 44], [p.x + 6 * MINI_S, p.y + 4 * MINI_S, p.z - 19 * MINI_S, p.x, p.y, p.z, 42], L.k); }, [[0, 'whoosh', .4], [.3, 'birds', .3]]);
// «und redete mit niemandem.»: habla solo, gesticulando, nadie alrededor
shot(33.77, 'W', null, L => { kel(L); tiny(ichT, 4, 44, Math.PI - .4); actuar(ichT, 0, [[0, { aLx: .6 + Math.sin(L.T * 6) * .3, aLe: 1.2, aRx: .3, headY: Math.sin(L.T * 2) * .3 }]], { T: L.T }); cara(ichT, L.T, { expr: 'talk', mouth: kitLips(L.T, [[33.7, 35.1]]) || 'talk' });
  bubble(ichT, '…', clamp((L.T - 33.9) * 4), 2.6); const p = mw(4, 2.6, 44); orbit(p, lerp(16, 13, L.k) * MINI_S, 2.5, .15, 42); }, [[0, 'mumble', .4]]);
// «Ich holte meine Lupe.»: la cojo de la estantería
shot(35.23, 'C', null, L => { kel(L); const c = put(ich, KX - 25.5, 0, -8, -Math.PI / 2 + 1.1); const k = easeOut(clamp(L.lt / .6)); actuar(c, 0, [[0, { aRx: lerp(1.2, 1.8, k), aRz: .1, aRe: .4, headX: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  attach(LUPE, c.aR.hand, [0, -.6, .4], [0, 0, 0], .7); cm([KX - 21.5, 4.8, 3, KX - 26.5, 4, -9, 48], [KX - 22.5, 4.6, 2, KX - 26.5, 4, -9, 46], L.k); sh(V(KX - 25, 0, -8), 14); }, [[0, 'grab', .5]]);
// «Er sagte:»: miro por la lupa (la lupa llena el plano, dentro el niño diminuto)
const lensShot = (L, who, x, z, talkA, talkB, pose = null) => { kel(L); tiny(who, x, z, Math.PI); actuar(who, 0, [[0, pose || idlePoseK(L.T)]], { T: L.T }); talkA != null ? talk(who, L.T, talkA, talkB, 'joy') : cara(who, L.T, { expr: 'neutral' });
  const p = mw(x, 3, z); const c = V(p.x, p.y + 1.6 * MINI_S, p.z); const cp = V(p.x + 2 * MINI_S, p.y + 10 * MINI_S, p.z - 30 * MINI_S); cam([cp.x, cp.y, cp.z], [c.x, c.y, c.z], lerp(30, 26, L.k));
  const d = c.clone().sub(cp).normalize(); show(LUPE, cp.x + d.x * .9, cp.y + d.y * .9 + .02, cp.z + d.z * .9, 0, .13); LUPE.lookAt(cp); LUPE.rotateY(Math.PI); };
shot(36.32, 'I', null, L => lensShot(L, ichT, 4, 44, null), [[0, 'sparkle', .5]]);
// «„Ich heiße Thomas, und in meiner Stadt …"»: ¡saluda igual que yo!
shot(36.99, null, null, L => lensShot(L, ichT, 4, 44, 36.99, 39.1, 'wave'), [[0, 'pop', .4]]);
// «Moment, das ist mein Satz!»: me aparto de la lupa, indignado
shot(39.11, 'C', 'punch', L => { kel(L); atTable(ich, L.T, { lean: .1, headX: 0, aRx: 1.3, aRe: .6, aLx: .4 }); attach(LUPE, ich.aR.hand, [0, -.6, .4], [0, 0, 0], .7); talk(ich, L.T, 39.11, 40.7, 'angry', { eyes: 'wide' });
  bubble(ich, 'HEY!', clamp((L.T - 39.2) * 4), 2.2); onFace(ich, 5.6, .8, .5, 44, L.k, 4.8); }, [[0, 'record_scratch', .6]]);
// «Ich schaute eine Stadt tiefer:»: bajada rápida otra vez (sin cortes)
shot(40.81, 'Z', null, L => { day(); scene.fog.density = 0; use('CI', 'FT', 'HK'); CITY.userData.CARS.forEach(c => c.visible = false); const p = hookCam(hookU(L.k)); CITY.visible = p.z >= -52.6; CITY.userData.TH.userData.doorPiv.rotation.y = 1.55; SPEED = .6;
  if (p.z < -52.6) sh(V(HMC.x, HMC.y, HMC.z), 12); else sh(V(0, 0, -30), 90); }, [[0, 'whoosh', .6], [.6, 'whoosh', .4]]);
// «noch ein Thomas.»: por la lupa, otro Thomas diminuto (en otra esquina)
shot(42.29, 'F', null, L => lensShot(L, ichT2, -26, 20, null, null, { aLx: .2, aRx: .2, headY: Math.sin(L.T * 2) * .2 }), [[0, 'sparkle', .5]]);
// «„Klingt cool, oder?"»: el otro Thomas lo dice, guiñando
shot(43.20, null, null, L => lensShot(L, ichT2, -26, 20, 43.2, 44.05, { aRx: 1.6, aRz: .3, aRe: .8 }), [[0, 'pop', .4]]);
// «Und noch einer.»: en la casa de muñecas, otro Thomas en su sótano
shot(44.32, 'W', null, L => { use('PU'); day(); const c = put(ichG, PX + .6, -15, -6.6, 0); c.root.scale.setScalar(.9); actuar(c, 0, [[0, { lean: .2, headX: .2, aRx: .8, aLx: .8, aRe: .5, aLe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'smile' });
  cm([PX + 2, -7, 16, PX + .5, -10.5, -4, 48], [PX + 1.5, -8, 12, PX + .5, -10.5, -4, 46], L.k); sh(V(PX, -15, 0), 20); }, [[0, 'whoosh', .4]]);
// «„Aber eines Tages fiel mir etwas Seltsames auf."»: ese Thomas también se extraña, igual que yo
shot(45.26, 'C', 'slow', L => { use('PU'); day(); const c = put(ichG, PX + .6, -15, -6.6, 0); c.root.scale.setScalar(.9); actuar(c, 0, [[0, { lean: .35, headX: .4, headY: Math.sin(L.T * 1.5) * .2, aRx: .8, aLx: .8 }]], { T: L.T }); talk(c, L.T, 45.26, 47.7, 'confused');
  cm([PX + 1.2, -9, 7, PX + .6, -10.6, -6.6, 44], [PX + 1, -9.4, 5.5, PX + .6, -10.6, -6.6, 40], L.k); sh(V(PX, -15, 0), 20); }, [[0, 'mumble', .3]]);
// ---------- c: cientos de Thomas, la tapa del cielo, el ojo gigante, el brezel y el oro (47,88 – 89,80 s) ----------
// la ciudad bajo la tapa: el techo gigante sustituye al cielo
const underLid = (L) => { use('CI'); day(); CITY.userData.CARS.forEach(c => c.visible = false); DECK.visible = true; sky.sky.visible = false; scene.fog.density = 0; hemi.intensity = 1.1; };
// Thomas gigante inclinado sobre la ciudad (sobre la tapa no: dentro de su sótano), con la lupa delante del ojo
const giant = (L, pose = {}, S = .9 / MINI_S) => { const g = put(ichG, 0, -(TABLE_Y + .23) / MINI_S + 26, -110, 0); g.root.scale.setScalar(S); actuar(g, 0, [[0, { lean: .35, headX: -.15, aRx: 2.3, aRz: -.25, aRe: 1.9, aLx: .3, aLe: .4, ...pose }]], { T: L.T }); return g; };

// «Hunderte Thomas,»: mosaico de cientos de mí, todos con su maqueta
shot(47.88, 'Z', 'punch', L => { kel(L); atTable(ich, L.T, { headX: .25 }); talk(ich, L.T, 47.88, 50.5, 'joy'); orbit(V(KX, 3.6, -3), 13, .3, .25, 44); const n = Math.round(lerp(2, 7, easeIn(L.k))); GRID = [n, Math.round(n * 1.6), 1]; }, [[0, 'whoosh', .5], [.4, 'crowd', .5]]);
// «und alle sagten genau dasselbe.»: cientos hablando a la vez
shot(48.98, 'S', null, L => { kel(L); atTable(ich, L.T, { headX: .1, lean: .1, aRx: 1.2 + Math.sin(L.T * 5) * .2, aRe: .8 }); talk(ich, L.T, 48.98, 50.5, 'talk'); onFace(ich, 5, 0, .3, 42, L.k, 4.4); GRID = [6, 10, 1]; }, [[0, 'crowd', .5]]);
// «Und da verstand ich es.» (zoom lento): fuera, delante de mi casa, me quedo helado
shot(50.69, 'C', 'slow', L => { use('CI'); day(); const c = put(ich, 3.25, .5, -45, 0); actuar(c, 0, [[0, { aLx: .1, aRx: .1, headX: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  onFace(c, 6.4, .6, .4, 44, L.k, 4.6); CITY.userData.CARS.forEach(c => c.visible = false); sh(V(3, 0, -44), 18); }, [[0, 'heartbeat', .5]]);
// «Ganz langsam schaute ich nach oben.» (zoom lento): plano bajo, levanto la cabeza
shot(52.09, null, 'slow', L => { use('CI'); day(); const c = put(ich, 3.25, .5, -45, 0); const k = easeInOut(L.k); actuar(c, 0, [[0, { headX: lerp(0, -.6, k), lean: lerp(0, -.15, k), aLx: .1, aRx: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'wide', mouth: 'o' });
  CITY.userData.CARS.forEach(c => c.visible = false); cm([5.5, 1.8, -36, 3.25, 5.4, -45, 50], [5, 1.6, -37.5, 3.25, 5.8, -45, 46], L.k); sh(V(3, 0, -44), 18); }, [[0, 'whoosh', .3]]);
// «Der Himmel hatte einen Deckel.»: mirando arriba: en vez de cielo, un techo de madera gigante
shot(53.84, 'F', 'punch', L => { underLid(L); plazaLife(L.T, 12, 53); cm([0, 8, 40, 0, 200, -240, 64], [0, 8, 40, 20, 230, -260, 62], L.k); sh(V(0, 0, 0), 60); }, [[0, 'braam', .8]]);
// «Und ein riesiges Auge starrte»: un ojo gigante (mi cara enorme) asoma sobre los tejados
shot(55.72, 'Z', 'slow', L => { underLid(L); giant(L); cara(ichG, L.T, { expr: 'neutral', eyes: 'normal', mouth: 'flat' }); const h = hp(ichG);
  cm([3, 4, 30, h.x, h.y - 6, h.z, 56], [3, 4, 22, h.x, h.y - 4, h.z, 48], L.k); sh(V(0, 0, 0), 60); }, [[0, 'rumble', .5]]);
// «durch eine Lupe auf mich herab.»: la lupa gigante delante del ojo
shot(57.46, 'C', 'punch', L => { underLid(L); giant(L, { aRx: 2.6, aRz: -.45, aRe: 2.3 }); cara(ichG, L.T, { expr: 'neutral', eyes: 'wide', mouth: 'o' }); attach(LUPE2, ichG.aR.hand, [0, -.6, .45], [0, 0, 0], .9);
  const h = hp(ichG); cm([0, 4, 20, h.x, h.y + 6, h.z, 40], [0, 4, 16, h.x, h.y + 6, h.z, 36], L.k); sh(V(0, 0, -30), 60); }, [[0, 'sparkle', .5]]);
// «Das war ich.»: primer plano, en shock
shot(58.94, 'W', null, L => { use('CI'); day(); const c = put(ich, 3.25, .5, -45, 0); actuar(c, 0, [[0, GEST.shock]], { T: L.T }); talk(c, L.T, 58.94, 59.7, 'shock', { eyes: 'wide' }); onFace(c, 4.2, 0, -.4, 40, L.k, 3.6); sh(V(3, 0, -44), 18); }, [[0, 'gasp', .5]]);
// «Ein Riesen-Thomas!»: plano enorme: mi cara gigante sobre la ciudad
shot(59.97, 'C', 'punch', L => { underLid(L); giant(L, { aRx: .6, aRe: .4 }); cara(ichG, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); plazaLife(L.T, 12, 60);
  const h = hp(ichG); cm([-16, 6, 40, h.x, h.y - 14, h.z, 58], [-12, 6, 34, h.x, h.y - 12, h.z, 56], L.k); sh(V(0, 0, 0), 60); }, [[0, 'impact', .6], [.2, 'crowd_gasp', .5]]);
// «Ich winkte.»: yo, abajo, saludo hacia arriba
shot(61.30, 'S', null, L => { use('CI'); day(); const c = put(ich, 3.25, .5, -45, 0); actuar(c, 0, [[0, 'wave']], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'happy', mouth: 'grin' }); orbit(V(3.25, 3.4, -44), lerp(12, 10.5, L.k), .3, .1, 44); sh(V(3, 0, -44), 18); }, [[0, 'pop', .4]]);
// «Er winkte.»: el gigante saluda (desde el suelo, contrapicado)
shot(62.08, 'W', null, L => { underLid(L); giant(L, { aRx: 2.8, aRz: .5 + Math.sin(L.T * 9) * .38, aRe: .4, lean: .25 }); cara(ichG, L.T, { expr: 'joy', eyes: 'happy', mouth: 'grin' });
  const h = hp(ichG); cm([-6, 3, 26, h.x, h.y + 4, h.z, 58], [-6, 3, 22, h.x, h.y + 4, h.z, 54], L.k); sh(V(0, 0, 0), 60); }, [[0, 'whoosh', .4]]);
// «Der winzige Thomas winkte auch.»: en la maqueta, el diminuto saluda
shot(62.83, 'C', null, L => { kel(L); tiny(ichT, 4, 44, Math.PI); actuar(ichT, 0, [[0, 'wave']], { T: L.T }); cara(ichT, L.T, { expr: 'joy', eyes: 'happy', mouth: 'grin' });
  const p = mw(4, 3, 44); orbit(p, lerp(15, 12, L.k) * MINI_S, Math.PI, .2, 44); }, [[0, 'pop', .4]]);
// «Wir machen alle genau dasselbe,»: tres franjas: los tres a la vez
shot(64.70, 'Z', null, L => { kel(L); atTable(ich, L.T, { lean: .05, headX: 0, ...{ aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .38, aRe: .5 } }); cara(ich, L.T, { expr: 'joy', eyes: 'happy', mouth: 'grin' }); onFace(ich, 5.4, 0, 0, 44, L.k, 5); GRID = [1, 3, 1]; }, [[0, 'whoosh', .4]]);
// «genau zur selben Zeit.»: los relojes marcan lo mismo (grid de 3×3)
shot(66.43, 'S', null, L => { kel(L); atTable(ich, L.T, { lean: .05, headX: 0, aRx: 2.7, aRz: .4 + Math.sin(L.T * 9) * .38, aRe: .5 }); cara(ich, L.T, { expr: 'joy', eyes: 'happy', mouth: 'grin' }); onFace(ich, 6, 0, .2, 44, L.k, 5.5); GRID = [3, 3, 1]; }, [[0, 'clock_tick', .5]]);
// «Also hatte ich eine Idee.»: bombilla encima de la cabeza
shot(68.04, 'C', 'punch', L => { kel(L); atTable(ich, L.T, { lean: .05, headX: -.1, aRx: 1.9, aRz: -.1, aRe: 2.2 }); cara(ich, L.T, { expr: 'joy', eyes: 'wide', mouth: 'open_smile' }); const h = hp(ich); show(BULB, h.x + .4, h.y + 2.6, h.z, 0, spring(clamp((L.T - 68.3) * 2)) * .6);
  onFace(ich, 6.4, 1.6, -.3, 48, L.k, 5.8); }, [[.25, 'ding', .7]]);
// «Ich ließ eine Brezel in meine winzige Stadt fallen.»: suelto el brezel sobre la maqueta
shot(69.63, 'W', null, L => { kel(L); atTable(ich, L.T, { lean: .35, headX: .45, aRx: 1.6, aRz: -.1, aRe: .3 }); cara(ich, L.T, { expr: 'smug', mouth: 'smirk' }); const t0 = 70.6, k = clamp((L.T - t0) / .7);
  const hpos = wpos(ich.aR.hand); if (L.T < t0) show(BRZ, hpos.x, hpos.y - .4, hpos.z + .2, 0, .45); else show(BRZ, lerp(hpos.x, KX + 6 * MINI_S, k), lerp(hpos.y - .4, MC.y + 2 * MINI_S, k * k), lerp(hpos.z + .2, 10 * MINI_S, k), k * 3, .45 * (1 - k * .5));
  orb(L.k, V(KX, 3.2, -2), null, [12, .7, .3, 46], [10.5, .6, .28, 46]); }, [[.95, 'whoosh', .5]]);
// «Eine Sekunde später:»: en la calle, todos miran arriba: una sombra crece
shot(72.21, 'Z', 'slow', L => { use('CI'); day(); plazaLife(L.T, 6, 72); [EX[15], EX[16], EX[17]].forEach((c, i) => { put(c, 7 + i * 5, .5, 22 - (i % 2) * 2, Math.PI + (i - 1) * .3); actuar(c, 0, [[0, { headX: -.6, lean: -.1, aRx: i === 1 ? 2.0 : .2, aRe: .2 }]], { T: L.T }); cara(c, L.T + i, { expr: 'worried', eyes: 'wide', mouth: 'o' }); });
  const k = easeIn(L.k); show(BRZ, 12, 48 - k * 26, 38, 1, 10); BRZ.rotation.x = -Math.PI / 2; cm([12, 3.5, 4, 12, 18, 40, 60], [12, 3.5, 7, 12, 18, 40, 58], L.k); sh(V(12, 0, 30), 40); }, [[0, 'whistle_fall', .6]]);
// «BUMM!»
shot(73.07, 'C', 'punch', L => { use('CI'); day(); show(BRZ, 12, 1.5, 38, 1, 10); BRZ.rotation.x = -Math.PI / 2; dust(V(12, 0, 36), 73.07, L.T, 16, 2.5); SHAKE = 1 - L.k;
  cm([24, 14, 20, 12, 4, 38, 54], [23, 13, 21, 12, 4, 38, 52], L.k); sh(V(12, 0, 36), 40); }, [[0, 'boom', 1], [.1, 'crash', .5]]);
// «Eine Brezel, so groß wie ein Haus,»: el brezel junto a las casas, la gente alucina
shot(73.99, 'W', null, L => { use('CI'); day(); show(BRZ, 12, 1.5, 38, 1, 10); BRZ.rotation.x = -Math.PI / 2; [EX[15], EX[16], EX[17], EX[18]].forEach((c, i) => { put(c, -2 + i * 5, .3, 16 - (i % 2) * 2, Math.PI * .85); actuar(c, 0, [[0, GEST.shock]], { T: L.T }); cara(c, L.T + i, { expr: 'shock', mouth: i % 2 ? 'open_smile' : 'o' }); });
  cm([-20, 30, -10, 12, 6, 40, 50], [-14, 26, -6, 12, 6, 40, 48], L.k); sh(V(6, 0, 30), 40); }, [[0, 'crowd_gasp', .5]]);
// «landete in meiner Straße.»: yo salgo corriendo de casa hacia el brezel
shot(75.83, 'S', null, L => { use('CI'); day(); show(BRZ, 12, 1.5, 38, 1, 10); BRZ.rotation.x = -Math.PI / 2; const c = put(ich, lerp(4, 9, L.k), .5, lerp(10, 24, L.k), .35); actuar(c, 0, [[0, runPoseK(L.T)]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' });
  const p = wpos(c.root); orbit(V(p.x, 3.4, p.z), 12, .35 + 1.2, .15, 46); sh(V(p.x, 0, p.z), 20); }, [[0, 'steps', .6]]);
// «Unendlich Brezeln!»: abrazado al brezel gigante, mordiéndolo
shot(77.48, 'C', 'punch', L => { use('CI'); day(); show(BRZ, 12, 1.5, 38, 1, 10); BRZ.rotation.x = -Math.PI / 2; const c = put(ich, 10, .5, 26, Math.PI); actuar(c, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.2, aRz: -.2, aLe: 1.2, aRe: 1.2, lean: -.05 }]], { T: L.T }); laughF(c, L.T); const hm = wpos(c.aR.hand); show(BRZ2, hm.x - .6, hm.y + .3, hm.z - .4, 0, .55);
  badge('gold', '∞', W / 2, H * .2, clamp((L.T - 77.6) * 3), 1, 1.2); orbit(V(10, 3.6, 26), lerp(11, 9.5, L.k), Math.PI + .25, .12, 46); sh(V(9, 0, 30), 20); }, [[0, 'ding', .7], [.2, 'crunch', .5]]);
// «Dann probierte ich einen Goldbarren.»: sostengo un lingote sobre la maqueta
shot(78.94, 'W', null, L => { kel(L); atTable(ich, L.T, { lean: .3, headX: .4, aRx: 1.6, aRz: -.1, aRe: .3 }); cara(ich, L.T, { expr: 'smug', mouth: 'grin' }); const hpos = wpos(ich.aR.hand); show(GB, hpos.x, hpos.y - .45, hpos.z + .2, 0, .5);
  orb(L.k, V(KX, 3.6, -4.5), null, [11, .55, .4, 46], [9.5, .45, .38, 46]); }, [[0, 'sparkle', .5], [.4, 'coins', .4]]);
// «BUMM!»: el lingote gigante cae en la calle
shot(80.45, 'C', 'punch', L => { use('CI'); day(); show(GB, -38, 0, 12, 1.6, 6); show(CAR_P, -38, 0, 12, 0, 1); CAR_P.scale.set(1, .25, 1); dust(V(-38, 0, 12), 80.45, L.T, 16, 2.4); SHAKE = 1 - L.k;
  cm([-20, 10, 6, -38, 3, 12, 52], [-21, 9, 7, -38, 3, 12, 50], L.k); sh(V(-38, 0, 12), 30); }, [[0, 'boom', 1], [.05, 'metal_crash', .6]]);
// «Er zerquetschte das Auto von Frau Pohl.»: Frau Pohl ante su coche aplastado
shot(80.96, 'W', null, L => { use('CI'); day(); show(GB, -38, 0, 12, 1.6, 6); show(CAR_P, -38, 0, 12, 0, 1); CAR_P.scale.set(1, .25, 1); const c = put(pohl, -26, .5, 18, 1.1); actuar(c, 0, [[0, { ...GEST.shock, aLx: 2.4, aRx: 2.4, aLe: 1.8, aRe: 1.8 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'shout' });
  bubble(pohl, 'MEIN AUTO!', clamp((L.T - 81.4) * 4), 2.3); cm([-14, 6, 26, -32, 3, 14, 50], [-15, 5.6, 25, -32, 3, 14, 48], L.k); sh(V(-32, 0, 16), 24); }, [[0, 'gasp', .5], [.6, 'car_alarm', .5]]);
// «Schon wieder: Tschuldigung!»: yo, encogido, sonrisa culpable
shot(83.44, 'C', null, L => { kel(L); atTable(ich, L.T, { aRx: 2.5, aRz: .1, aRe: 2.0, aLx: 2.5, aLz: .1, aLe: 2.0, headX: .1, lean: .05, crouch: .15 }); cara(ich, L.T, { expr: 'worried', eyes: 'happy', mouth: 'grimace' }); sweat(ich, L.T);
  onFace(ich, 4.6, 0, .5, 42, L.k, 4.1); }, [[0, 'pop', .4]]);
// «Ich war der reichste Thomas der Welt.»: sentado en un montón de oro, con gafas de sol
shot(84.99, 'Z', 'punch', L => { use('CI'); day(); show(GPILE, 3.25, 0, -34, 0, 1.6); const c = put(ich, 3.25, 3.6, -34, 0); actuar(c, 0, [[0, { lLx: 1.5, lRx: 1.5, lLk: 1.4, lRk: 1.4, aLx: 2.4, aRx: 2.4, aLz: .4, aRz: .4, hipY: Math.sin(L.T * 5) * .1 }]], { T: L.T }); laughF(c, L.T);
  confRain(V(3.25, 0, -34), L.T, 50, 16, 12, 16); orbit(V(3.25, 5, -34), lerp(14, 12, L.k), -.2, .12, 46); sh(V(3.25, 0, -34), 20); }, [[0, 'coins', .7], [.3, 'cheer', .4]]);
// «Na ja, genauso reich wie jeder andere Thomas.»: mosaico: todos igual de ricos
shot(86.97, 'S', null, L => { use('CI'); day(); show(GPILE, 3.25, 0, -34, 0, 1.6); const c = put(ich, 3.25, 3.6, -34, 0); actuar(c, 0, [[0, { lLx: 1.5, lRx: 1.5, lLk: 1.4, lRk: 1.4, aLx: .3, aRx: .3, headY: Math.sin(L.T) * .2 }]], { T: L.T }); talk(c, L.T, 86.97, 89.5, 'sus', { eyes: 'half' });
  orbit(V(3.25, 5, -34), 12, -.2, .12, 46); sh(V(3.25, 0, -34), 20); GRID = L.k < .3 ? null : [3, 4, 1]; }, [[.3, 'whoosh', .4]]);
// ---------- d: ¿quién está arriba?, la escalera, el zepelín, el móvil, el pulgar y tu sótano (89,80 – 129,15 s) ----------
// el vacío de arriba del todo: suelo de tablones bajo las estrellas (VX = 3000)
const VX = 3000; const VOID = (() => { const g = new THREE.Group(); g.position.x = VX; scene.add(g); const f = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat(0xffffff, { map: (() => { const t = KE.children[0].material.map.clone(); t.repeat.set(30, 30); t.needsUpdate = true; return t; })(), roughness: .8, color: 0x9a7a5a })); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; g.add(f);
  const lid = new THREE.Group(); lid.position.set(0, 0, 0); g.add(lid); box(8, .6, 8, mat(0x6a4224, { roughness: .7 }), .1, lid, 0, .3, 0); for (let i = -3; i <= 3; i++) box(.15, .62, 8, mat(0x4a2e18), 0, lid, i * 1.1, .31, 0);
  const hole = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.8, 1.5, 1.0), toneMapped: false })); hole.rotation.x = -Math.PI / 2; hole.position.y = .02; g.add(hole);
  g.userData = { lid, hole }; outline(g, 1.2); return g; })(); SETS.VO = VOID;
// postales de la ciudad (para «tu ciudad»)
const POST_T = Array.from({ length: 6 }, (_, i) => { const p = textPlane(6, 9, 240, 360, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#4a9aff'); g.addColorStop(1, '#bfe2ff'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#62c84e'; c.fillRect(0, h * .62, w, h * .38);
  for (let k = 0; k < 4; k++) { const x = 14 + k * 56 + (i * 9) % 20, y = h * .62 - 70 - (k % 2) * 20; c.fillStyle = (k + i) % 2 ? '#f6d04a' : '#d8402e'; c.fillRect(x, y, 46, 70 + (k % 2) * 20); c.fillStyle = (k + i) % 2 ? '#d8402e' : '#f2b83a'; c.beginPath(); c.moveTo(x - 6, y); c.lineTo(x + 23, y - 30); c.lineTo(x + 52, y); c.fill(); c.fillStyle = '#9fd2f2'; c.fillRect(x + 8, y + 14, 12, 14); c.fillRect(x + 26, y + 14, 12, 14); }
  c.fillStyle = '#e8e6e2'; c.fillRect(0, h * .78, w, 26); c.lineWidth = 14; c.strokeStyle = '#ffffff'; c.strokeRect(0, 0, w, h); }); p.material.side = THREE.DoubleSide; scene.add(p); PROPS.push(p); return p; });
const sunset = () => { day(); setSky([.25, .25, .7], [.95, .5, .35], [1, .75, .4]); sun.color.setRGB(1, .7, .45); sun.intensity = 2.2; hemi.color.setRGB(1, .8, .7); hemi.intensity = 1.0; };
const voidN = () => { use('VO'); night(30); hemi.intensity = .9; FILL.intensity = 40; };
const RIDGE = V(0, 33.2, -58);   // caballete del tejado de mi casa
const handyAt = (z = -40, s = 1) => { show(HANDY, VX, 0, z, 0, s); HANDY.userData.glow.forEach(b => b.visible = true); };
const fanBehind = (L, z = -40, look = 0) => { const f = put(fan, VX, -44, z - 22, 0); f.root.scale.setScalar(16); actuar(f, 0, [[0, { headX: .1 + look, aRx: 1.2, aLx: 1.2, aRe: 1.4, aLe: 1.4 }]], { T: L.T }); cara(f, L.T, { expr: 'neutral', eyes: 'half', mouth: 'flat' }); return f; };

// «Aber eine Sache musste ich wissen:»: al atardecer, sentado en el tejado, pensativo
shot(89.80, 'F', null, L => { use('CI'); sunset(); const c = put(ich, RIDGE.x, RIDGE.y, RIDGE.z, .3); actuar(c, 0, [[0, { ...GEST.think, lLx: .1 }]], { T: L.T }); talk(c, L.T, 89.8, 91.3, 'confused');
  orbit(V(RIDGE.x, RIDGE.y + 3.4, RIDGE.z), lerp(14, 12, L.k), .5, .08, 46); sh(RIDGE, 20); }, [[0, 'wind', .4], [.3, 'birds', .3]]);
// «Wer sitzt ganz oben?» (zoom lento): miro arriba, a la tapa
shot(91.51, null, 'slow', L => { use('CI'); sunset(); DECK.visible = true; sky.sky.visible = false; const c = put(ich, RIDGE.x, RIDGE.y, RIDGE.z, 0); actuar(c, 0, [[0, { headX: -.6, lean: -.1, aRx: 1.9, aRz: -.1, aRe: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', eyes: 'wide' });
  cm([RIDGE.x + 3, RIDGE.y + 1.2, RIDGE.z + 9, RIDGE.x, RIDGE.y + 6.5, RIDGE.z - 2, 56], [RIDGE.x + 2.4, RIDGE.y + 1.2, RIDGE.z + 8, RIDGE.x, RIDGE.y + 7, RIDGE.z - 2, 52], L.k); sh(RIDGE, 20); }, [[0, 'wind', .4]]);
// «Also baute ich eine Leiter»: subo la escalera de mano desde el tejado
shot(93.06, 'W', null, L => { use('CI'); sunset(); show(LEI, RIDGE.x, RIDGE.y, RIDGE.z - 2, 0, 1); LEI.scale.y = 6; const c = put(ich, RIDGE.x, RIDGE.y + 2 + L.k * 8, RIDGE.z - .9, Math.PI); const s = Math.sin(L.T * 8); actuar(c, 0, [[0, { aLx: 2.6 + s * .3, aRx: 2.6 - s * .3, lLx: .6 + s * .5, lRx: .6 - s * .5, lLk: .8, lRk: .8 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  cm([RIDGE.x + 10, RIDGE.y + 2, RIDGE.z + 12, RIDGE.x, RIDGE.y + 6 + L.k * 6, RIDGE.z, 50], [RIDGE.x + 8, RIDGE.y + 6, RIDGE.z + 10, RIDGE.x, RIDGE.y + 10 + L.k * 6, RIDGE.z, 50], L.k); sh(RIDGE, 30); }, [[0, 'wood_creak', .5], [.4, 'steps', .4]]);
// «und kletterte durch den Deckel»: contrapicado: la escalera llega a una trampilla con luz en el techo gigante
shot(94.46, 'Z', null, L => { use('CI'); sunset(); DECK.visible = true; sky.sky.visible = false; show(LEI, 0, 0, -58, 0, 1); LEI.scale.set(3, 24, 3); BULB.visible = false;
  const c = put(ich, 0, 380 + L.k * 140, -56.5, Math.PI); c.root.scale.setScalar(3); const s = Math.sin(L.T * 8); actuar(c, 0, [[0, { aLx: 2.6 + s * .3, aRx: 2.6 - s * .3, lLx: .6 + s * .5, lRx: .6 - s * .5 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  cm([30, 300, 20, 0, 560, -58, 50], [26, 340, 16, 0, 560, -58, 48], L.k); sh(V(0, 300, -58), 120); }, [[0, 'wood_creak', .5], [.6, 'whoosh', .4]]);
// «in einen größeren Keller.»: salgo de la maqueta a la mesa de un sótano enorme (yo diminuto)
shot(95.52, 'F', 'punch', L => { kel(L); tiny(ichT, 40, 0, Math.PI, 1); ichT.root.position.set(KX + 5.1, TABLE_Y, 1); ichT.root.rotation.y = Math.PI + .5; actuar(ichT, 0, [[0, { headX: -.5, aLx: .5, aRx: .5, aLz: .6, aRz: .6 }]], { T: L.T }); cara(ichT, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  cm([KX + 5.5, TABLE_Y + .14, 1.75, KX + 3, TABLE_Y + 3.4, -8, 72], [KX + 5.6, TABLE_Y + .14, 2.0, KX + 2, TABLE_Y + 4.4, -8, 72], L.k); }, [[0, 'whoosh', .5]]);
// «Dann in einen noch größeren.»: la cámara se aleja: la mesa, el sótano entero, yo un puntito
shot(96.88, 'W', null, L => { kel(L); tiny(ichT, 0, 0, 0, 1); ichT.root.position.set(KX + 4.8, TABLE_Y, 1); cara(ichT, L.T, { expr: 'shock' });
  cm([KX + 6, TABLE_Y + .6, 3, KX + 4.8, TABLE_Y + .2, 1, 50], [KX + 18, 18, 20, KX + 2, 2, 0, 52], easeIn(L.k)); }, [[0, 'whoosh', .5]]);
// «Und noch einen!»: otro sótano todavía mayor (la casa de muñecas), alejándose
shot(98.35, 'C', 'punch', L => { use('PU'); day(); cm([PX + 1, -10, 4, PX, -11.6, -2, 50], [PX + 4, 4, 52, PX, -8, -2, 44], easeIn(L.k)); sh(V(PX, -15, 0), 30); }, [[0, 'whoosh', .5]]);
// «Nach achtzig Städten»: el contador 80 sobre mi cabeza al pie de una escalera colosal
shot(99.36, 'Z', null, L => { use('TR'); inside(.9, 0); const c = put(ich, TX, 26 - 13 * 1.9 - .1 + .3, -33, Math.PI); c.root.scale.setScalar(.25); actuar(c, 0, [[0, { headX: -.5, lean: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  badge('gold', String(Math.round(lerp(60, 80, clamp(L.k * 1.4)))), W / 2, H * .2, 1, 1, 1.2); cm([TX + 2.8, 2.6, -35.3, TX, 5, -24, 58], [TX + 2.6, 2.6, -35.2, TX, 5.6, -24, 56], L.k); sh(V(TX, 0, -20), 30); }, [[0, 'count', .5]]);
// «waren die Treppenstufen so riesig,»: intento subir un escalón más alto que yo
shot(100.66, 'S', null, L => { use('TR'); inside(.9, 0); const c = put(ich, TX - 1, 26 - 13 * 1.9 + .3, -32.6, Math.PI); c.root.scale.setScalar(.35); const s = Math.sin(L.T * 10); actuar(c, 0, [[0, { aLx: 2.8, aRx: 2.8, lLx: .8 + s * .3, lLk: 1.2, headX: -.3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grimace' }); sweat(c, L.T);
  cm([TX + 3, 3.4, -35, TX - 1, 2.4, -32.4, 56], [TX + 2.8, 3.3, -35.1, TX - 1, 2.4, -32.4, 54], L.k); sh(V(TX, 0, -30), 20); }, [[0, 'grunt', .5]]);
// «dass ich einen Zeppelin brauchte.»: subo en mi zepelín por la escalera gigante
shot(102.14, 'C', 'punch', L => { use('TR'); inside(.95, 0); const z = lerp(-30, -12, L.k), y = 26 + z * .79 + 5; show(ZEP, TX, y, z, Math.PI, .45); ZEP.rotation.x = -.35; ZEP.userData.prop.rotation.z = L.T * 40;
  const c = put(ich, TX, 0, 0, Math.PI); c.root.scale.setScalar(.12); const gp = V(TX, y - 2.7 * .45 + .15, z + .3 * .45); c.root.position.copy(gp).add(V(0, -.2, 0)); actuar(c, 0, [[0, { aRx: 2.6, aRz: .3, aRe: .3 }]], { T: L.T }); laughF(c, L.T);
  const zc = z - 8; cam([TX + 2.6, Math.max(y + 2, 26 + zc * .79 + 3), zc], [TX, y - .4, z], 52); sh(V(TX, y, z), 20); }, [[0, 'propeller', .6]]);
// «Endlich erreichte ich den letzten Deckel.»: de noche, la última trampilla en el vacío
shot(103.58, 'W', 'slow', L => { voidN(); show(LEI, VX, -26, 0, 0, 1); const c = put(ich, VX, -8 + L.k * 3, 1.1, Math.PI); const s = Math.sin(L.T * 8); actuar(c, 0, [[0, { aLx: 2.6 + s * .2, aRx: 2.6 - s * .2, lLx: .4 + s * .3, lRx: .4 - s * .3, headX: -.4 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  VOID.userData.lid.position.y = 0; VOID.userData.hole.visible = false; cm([VX + 10, -6, 14, VX, -2, 0, 50], [VX + 8, -5, 12, VX, -1, 0, 48], L.k); sh(V(VX, 0, 0), 20); }, [[0, 'wood_creak', .5]]);
// «Ich drückte ihn auf.»: empujo la tapa, sale luz
shot(105.57, 'C', 'punch', L => { voidN(); show(LEI, VX, -26, 0, 0, 1); const k = easeOut(clamp(L.lt / .6)); VOID.userData.lid.position.set(-k * 6, k * 1.5, 0); VOID.userData.lid.rotation.z = k * .8; VOID.userData.hole.visible = true;
  const c = put(ich, VX, -3.5 + k * 2.5, 1, Math.PI); actuar(c, 0, [[0, { aLx: 3.0, aRx: 3.0, aLz: .1, aRz: .1, aLe: .2, aRe: .2, headX: -.3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grimace' });
  cm([VX + 9, 3, 12, VX, 0, 0, 50], [VX + 8, 4, 11, VX, .5, 0, 48], L.k); sh(V(VX, 0, 0), 20); }, [[0, 'creak', .6], [.3, 'thud', .5]]);
// «Keine Stadt.»: arriba no hay nada: tablones y estrellas
shot(106.64, 'F', null, L => { voidN(); VOID.userData.lid.position.set(-6, 0, 0); const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { headY: Math.sin(L.T * 2) * .5 }]], { T: L.T }); cara(c, L.T, { expr: 'confused' });
  cm([VX - 30, 22, 50, VX, 2, 6, 46], [VX - 26, 20, 46, VX, 2, 6, 44], L.k); sh(V(VX, 0, 8), 20); }, [[0, 'wind', .4]]);
// «Kein Thomas.»: solo yo
shot(107.43, 'S', null, L => { voidN(); const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { ...GEST.shrug }]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); orbit(V(VX, 3, 8), lerp(13, 11, L.k), .4, .1, 44); sh(V(VX, 0, 8), 20); }, [[0, 'crickets', .5]]);
// «Nur ein gigantisches, leuchtendes Rechteck.» (zoom lento): el rectángulo de luz delante de mí
shot(108.03, 'Z', 'slow', L => { voidN(); handyAt(-40); const c = put(ich, VX, 0, 8, Math.PI); actuar(c, 0, [[0, { headX: -.4, lean: -.1 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); FILL.intensity = 60;
  cm([VX + 6, 3, 26, VX, 30, -40, 52], [VX + 4, 3, 22, VX, 34, -40, 54], L.k); sh(V(VX, 0, 0), 30); }, [[0, 'hum', .6]]);
// «Ein Handy.»
shot(110.78, 'C', 'punch', L => { voidN(); handyAt(-40); const c = put(ich, VX, 0, 8, Math.PI); actuar(c, 0, [[0, GEST.point]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); cm([VX - 30, 20, 60, VX, 36, -40, 54], [VX - 26, 22, 56, VX, 36, -40, 54], L.k); sh(V(VX, 0, 0), 30); }, [[0, 'phone_buzz', .5]]);
// «Und dahinter ein Gesicht.»: detrás del cristal, una cara enorme (la tuya), iluminada por la pantalla
shot(111.55, 'W', 'slow', L => { voidN(); handyAt(-40); fanBehind(L); FILL.intensity = 30; const h = hp(fan); cm([VX + 2, 10, 14, h.x, h.y - 6, h.z, 50], [VX + 1.5, 14, 6, h.x, h.y - 6, h.z, 46], L.k); sh(V(VX, 0, -40), 60); }, [[0, 'heartbeat', .5]]);
// «Deins.»: primer plano de tu cara a través del cristal
shot(112.84, 'C', 'punch', L => { voidN(); handyAt(-40); fanBehind(L); const h = hp(fan); cm([h.x, h.y + 6, -18, h.x, h.y + 4, h.z, 40], [h.x, h.y + 6, -22, h.x, h.y + 4, h.z, 38], L.k); sh(V(VX, 0, -40), 60); }, [[0, 'braam', .7]]);
// «Da verstand ich es endlich:» (zoom lento)
shot(113.44, null, 'slow', L => { voidN(); handyAt(-40); FILL.intensity = 50; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, GEST.think]], { T: L.T }); cara(c, L.T, { expr: 'worried', eyes: 'wide' }); orbit(V(VX, 3.6, 8), lerp(11, 9, L.k), .3, .08, 44); sh(V(VX, 0, 8), 20); }, [[0, 'whoosh', .3]]);
// «Die größte Stadt von allen ist deine Stadt.»: postales de tu ciudad flotando a mi alrededor
shot(114.80, 'Z', null, L => { voidN(); FILL.intensity = 60; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: .9, aRz: .9, headY: Math.sin(L.T) * .3 }]], { T: L.T }); talk(c, L.T, 114.8, 117, 'shock');
  POST_T.forEach((p, i) => { const a = i / 6 * 6.283 + L.T * .5; p.visible = true; p.position.set(VX + Math.cos(a) * 9, 5 + Math.sin(L.T * 2 + i) * .6, 8 + Math.sin(a) * 9); p.lookAt(camera.position); p.scale.setScalar(.6); });
  orbit(V(VX, 4, 8), lerp(22, 19, L.k), .2, .14, 46); POST.push(() => POST_T.forEach(p => p.lookAt(camera.position))); sh(V(VX, 0, 8), 20); }, [[0, 'sparkle', .6]]);
// «Und du hast uns die ganze Zeit zugeschaut.»: te señalo a ti
shot(117.27, 'C', 'punch', L => { voidN(); FILL.intensity = 50; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { aRx: 1.62, aRz: -.08, aRe: .05, aLz: .12, aLe: .25 }]], { T: L.T }); talk(c, L.T, 117.27, 119.3, 'sus', { eyes: 'half' }); orbit(V(VX, 3.6, 8), lerp(10, 8.5, L.k), .15, .08, 44); sh(V(VX, 0, 8), 20); }, [[0, 'pop', .4]]);
// «Dann kam ein riesiger Daumen.»: el pulgar baja desde arriba
shot(119.52, 'W', 'slow', L => { voidN(); FILL.intensity = 50; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { headX: -.5, lean: -.15, ...GEST.shock }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  show(THUMB, VX + 2, lerp(50, 16, easeInOut(L.k)), 2, 0, .7); THUMB.rotation.set(.3, 0, -.4); cm([VX + 5, 3.5, 24, VX, 10, 4, 62], [VX + 5, 3.5, 23, VX, 9, 4, 62], L.k); sh(V(VX, 0, 8), 30); }, [[0, 'rumble', .5]]);
// «Nein, nein, nein!»: corro mientras el pulgar barre
shot(121.13, 'C', 'punch', L => { voidN(); FILL.intensity = 50; const c = put(ich, VX + lerp(-2, 6, L.k), 0, 8, Math.PI / 2); actuar(c, 0, [[0, { ...runPoseK(L.T), aLx: 2.8, aRx: 2.8 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'shout' });
  show(THUMB, VX + lerp(-16, 2, easeIn(L.k)), 7, 6, 0, .7); THUMB.rotation.set(.2, 0, -1.2); orbit(V(VX + 2, 3.4, 8), 15, 0, .12, 50); SHAKE = .4; sh(V(VX, 0, 8), 30); }, [[0, 'whoosh', .6], [.3, 'scream', .4]]);
// «Nicht weiterscrollen!»: me pego al cristal, con las manos contra la pantalla (vista desde tu móvil)
shot(122.33, 'Z', null, L => { voidN(); FILL.intensity = 60; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { aLx: 1.7, aRx: 1.7, aLz: .5, aRz: .5, aLe: .3, aRe: .3, lean: .25 }]], { T: L.T }); talk(c, L.T, 122.33, 123.4, 'shout', { eyes: 'wide' });
  const h = hp(c); cam([h.x, h.y, h.z + 8 - L.k * .6], [h.x, h.y - .9, h.z], 52); SHAKE = .3; sh(V(VX, 0, 8), 20); }, [[0, 'glass_knock', .6]]);
// «Okay.»: el pulgar se va
shot(123.37, 'S', null, L => { voidN(); FILL.intensity = 50; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { headX: -.3 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); show(THUMB, VX + 2, lerp(16, 60, easeIn(L.k)), 2, 0, .7); THUMB.rotation.set(.3, 0, -.4);
  cm([VX + 5, 3.5, 24, VX, 9, 4, 62], [VX + 5, 3.5, 23, VX, 10, 4, 62], L.k); sh(V(VX, 0, 8), 30); }, [[0, 'whoosh', .4]]);
// «Gut. Du bist noch da.»: alivio, sonrisa
shot(124.22, 'C', null, L => { voidN(); FILL.intensity = 60; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { aLx: .2, aRx: .2, lean: -.05 }]], { T: L.T }); talk(c, L.T, 124.22, 125.3, 'relief', { eyes: 'happy' }); orbit(V(VX, 4.2, 8), lerp(9, 7.5, L.k), .25, .06, 44); sh(V(VX, 0, 8), 20); }, [[0, 'sigh', .5]]);
// «Nur eine Frage:»: me acerco a la cámara, serio
shot(125.51, 'W', null, L => { voidN(); FILL.intensity = 60; const c = put(ich, VX, 0, 8, 0); actuar(c, 0, [[0, { lean: .2, headX: .1, aRx: 1.4, aRz: -.1, aRe: 1.2 }]], { T: L.T }); talk(c, L.T, 125.51, 126.3, 'sus', { eyes: 'half' }); orbit(V(VX, 3.8, 8), lerp(9, 7.8, L.k), -.2, .06, 44); sh(V(VX, 0, 8), 20); }, [[0, 'whoosh', .3]]);
// «Warst du schon mal in deinem Keller?» (zoom lento): tu cuarto de noche, tú en la cama con el móvil; detrás, la puerta del sótano se entreabre
shot(126.47, 'F', 'slow', L => { use('ZI'); inside(.35, 0); night(0); hemi.intensity = .5; scene.fog.density = 0; const f = put(fan, 2394, 2.2, -10.5, 0); actuar(f, 0, [[0, { lean: -.2, aLx: 1.3, aRx: 1.3, aLe: 1.4, aRe: 1.4, lLx: 1.5, lRx: 1.5, headX: .3 }]], { T: L.T }); FILL.intensity = 25; FILL.color.setRGB(.5, .7, 1); cara(f, L.T, { expr: 'neutral', eyes: 'half' });
  ZIM.userData.door.rotation.y = -easeInOut(L.k) * .9; ZIM.userData.pl.intensity = 30 + L.k * 60; cm([2399, 11, 5, 2395, 4.6, -10.5, 50], [2399, 10.5, 3.5, 2395.5, 4.8, -11, 48], L.k); sh(V(2400, 0, 0), 30); }, [[0, 'creak', .6]]);
// «Denn vielleicht …»: la cámara cruza la puerta, baja al sótano y cae en la maqueta… (vuelve al principio)
shot(128.14, 'Z', null, L => { day(); scene.fog.density = 0; use('CI', 'FT', 'HK'); CITY.userData.CARS.forEach(c => c.visible = false); const p = hookCam(hookU(.36 + L.k * .64)); CITY.visible = p.z >= -52.6; CITY.userData.TH.userData.doorPiv.rotation.y = 1.55; SPEED = .6;
  if (p.z < -52.6) sh(V(HMC.x, HMC.y, HMC.z), 12); else sh(V(0, 0, -30), 90); }, [[0, 'whoosh', .6], [.5, 'riser_short', .5]]);
// ---------- portadas (1080×1920): composiciones propias, todo lo importante entre y = 240 y 1680, centrado ----------
const COVERS = [
  // 1: yo detrás de la mesa, con la lupa delante del ojo, inclinado sobre la maqueta (que llena el tercio inferior); un yo diminuto saluda en la plaza
  { fn: L => { kel(L, 110); FILL.intensity = 25; const c = put(ich, KX, 0, -5.2, 0); actuar(c, 0, [[0, { lean: .12, headX: -.12, aRx: 2.25, aRz: -.5, aRe: 2.0, aLx: .9, aLz: -.25, aLe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'open_smile' });
      attach(LUPE, c.aR.hand, [0, -.55, .5], [0, 0, 0], .62);
      tiny(ichT, 0, 18, 0); actuar(ichT, 0, [[0, 'wave']], { T: L.T }); cara(ichT, L.T, { expr: 'joy', eyes: 'happy', mouth: 'grin' }); [[EX[5], -14, 26], [EX[8], 12, 22], [EX[11], -6, -14]].forEach(([e, x, z], i) => { tiny(e, x, z, i); actuar(e, 0, [[0, walkP(L.T, i)]], { T: L.T }); });
      cam([KX, 6.0, 9.5], [KX, 3.7, -3.5], 40); }, top: ['IN JEDEM', 'KELLER'], bot: 'EINE STADT!', ty: [.115, .19], by: .885 },
  // 2: la casa cortada: en el sótano, alguien con su maqueta; encima, mi cara gigante asomando con la lupa (ciudades dentro de ciudades)
  { fn: L => { use('PU'); day(); PU.userData.roof.visible = false; FILL.intensity = 40; const c = put(ichT, PX + .5, -15, -6.2, 0); c.root.scale.setScalar(.9); actuar(c, 0, [[0, { lean: .2, headX: .15, aRx: .9, aLx: .9, aRe: .5, aLe: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' });
      const g = put(ichG, PX, -8, -30, 0); g.root.scale.setScalar(7); actuar(g, 0, [[0, { lean: .4, headX: -.2, aRx: 2.1, aRz: -.5, aRe: 1.9, aLx: 1.2, aLz: .3, aLe: .4 }]], { T: L.T }); cara(g, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); attach(LUPE2, g.aR.hand, [0, -.55, .5], [0, 0, 0], .62);
      cam([PX, 10, 92], [PX, 9, -6], 44); sh(V(PX, 0, -10), 70); }, top: ['UND DARIN…'], bot: 'NOCH EINE STADT', ty: [.105], by: .9 },
];
window.renderCover = v => { const C = COVERS[v], T = 60, L = { lt: .5, k: .5, T, d: 1, t0: 59.5, t1: 60.5 };
  hideAll(); BAD_.length = 0; C.fn(L); while (POST.length) POST.shift()(); CITY.userData.update(T);
  grade.uniforms.sharp.value = 1.6; grade.uniforms.vig.value = .55; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0;
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  camera.updateProjectionMatrix(); sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position); composer.render();
  octx.drawImage(renderer.domElement, 0, 0, W, H);
  const line = (t, y, size, fill) => { octx.save(); octx.font = `700 ${size}px ${FONT}`; octx.textAlign = 'center'; octx.textBaseline = 'middle'; octx.lineJoin = 'round'; const tw = octx.measureText(t).width; const k = Math.min(1, W * .9 / tw); octx.translate(W / 2, y); octx.scale(k, k); octx.rotate(-.025);
    octx.shadowColor = 'rgba(0,0,0,.6)'; octx.shadowBlur = 26; octx.shadowOffsetY = 10; octx.lineWidth = size * .22; octx.strokeStyle = '#000'; octx.strokeText(t, 0, 0); octx.shadowColor = 'transparent'; octx.fillStyle = fill; octx.fillText(t, 0, 0); octx.restore(); };
  C.top.forEach((t, i) => line(t, H * C.ty[i], 132, '#ffffff')); line(C.bot, H * C.by, 132, '#E2FD07'); };


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); } });
CUES.push({ t: 0, s: 'zoom_fast', g: .9 }); CUES.push({ t: .05, s: 'riser', g: .9, d: 6.5 }); CUES.push({ t: 6.6, s: 'braam', g: 1 });   // gancho: riser de principio a fin + golpe
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD_.length = 0; s.fn(L); while (POST.length) POST.shift()(); CITY.userData.update(T);
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud', 'huss_hit'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = BLUR;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, MODE === 'night' ? 'noche' : 'polvo', MODE === 'in' ? .3 : .4);
  if (BIRDS.update) BIRDS.update(T, camera.position.clone().addScaledVector(dir, 60).add(V(0, 25, 0)), (MODE === 'day') && BIRDSON ? 1 : 0);
  sun.castShadow = sun.intensity >= .45; sky.sky.position.copy(camera.position); composer.render(); BLUR = 0;
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
  if (GRID) { const [nx, ny, z] = GRID; const tw = W / nx * z, th = H / ny * z, a = tw / th; let sw = W, sh = W / a; if (sh > H) { sh = H; sw = H * a; } const sx = (W - sw) / 2, sy = clamp(H * .42 - sh / 2, 0, H - sh);
    for (let ix = 0; ix < nx; ix++) for (let iy = 0; iy < ny; iy++) octx.drawImage(renderer.domElement, sx, sy, sw, sh, -W / 2 * z + ix * tw, -H / 2 * z + iy * th, tw - 6, th - 6); }
  else octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  if (SPEED > 0) { const r = RNG(Math.floor(T * FPS) * 7 + 3); octx.save(); octx.strokeStyle = `rgba(255,255,255,${(.55 * SPEED).toFixed(2)})`; octx.lineCap = 'round';
    for (let k = 0; k < 26; k++) { const a = r() * 6.283, r0 = 380 + r() * 260, r1 = r0 + 160 + r() * 420; octx.lineWidth = 3 + r() * 6; octx.beginPath(); octx.moveTo(W / 2 + Math.cos(a) * r0, H * .44 + Math.sin(a) * r0 * 1.2); octx.lineTo(W / 2 + Math.cos(a) * r1, H * .44 + Math.sin(a) * r1 * 1.2); octx.stroke(); } octx.restore(); }
  for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { THREE, hp, ich, renderer, composer, bloom, sun, grade, scene, camera };

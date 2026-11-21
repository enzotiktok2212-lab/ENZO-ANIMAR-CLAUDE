// Zehn Lügen — planos sincronizados con audio/words.json (1080×1920, 30 fps). Cada plano repite la escena del plano
// equivalente de «Zehn Neins» (mismo momento del guion, mismo tipo de imagen) desde otra perspectiva, con otro pueblo y otro reparto.
// Los planos están en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { makeKind, makeMutti, makeKowalski, makeSammler, makeBaecker, makeLeute, makeKinder, makeFam } from './gvolk.js';
import { gasse, wohnzimmer, kueche, esszimmer, kinderzimmer, bad, koffer, geige, leine, schild, hund, feuerwerk, partyHat } from './lsets.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 176.4, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0x1a2448, .0012);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false);
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
const WARM = new THREE.PointLight(0xffb868, 0, 40, 1.4); scene.add(WARM);   // luz cálida de farola/puerta cerca del sujeto
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
const WX = 1000, KX = 1100, EX = 1200, ZX = 1300, BX = 1400;
const GA = gasse(scene), WZ = wohnzimmer(scene, WX), KU = kueche(scene, KX), ES = esszimmer(scene, EX), KZ = kinderzimmer(scene, ZX), BD = bad(scene, BX);
const SETS = { GA: GA.G, WZ: WZ.g, KU: KU.g, ES: ES.g, KZ: KZ.g, BD: BD.g };
for (const k in SETS) outline(SETS[k], 1.4);
const HOME = GA.L[0], KOWH = GA.L[1], BAKH = GA.R[1], FAMH = GA.R[3], DARKH = [GA.R[3], GA.L[5], GA.R[6], GA.L[8], GA.R[9]];
// ---------- reparto ----------
const ich = makeKind(scene), mama = makeMutti(scene), kow = makeKowalski(scene), kow2 = makeKowalski(scene), sam = makeSammler(scene), bk = makeBaecker(scene);
const LE = Array.from({ length: 8 }, (_, i) => makeLeute(scene, i)), KI = Array.from({ length: 4 }, (_, i) => makeKinder(scene, i)), FA = Array.from({ length: 4 }, (_, i) => makeFam(scene, i));
kitFace(ich, 'kid'); kitFace(mama, 'girl'); kitFace(kow, 'mustache'); kitFace(kow2, 'mustache'); kitFace(sam, 'villain'); kitFace(bk, 'mustache');
LE.forEach((c, i) => kitFace(c, ['girl', 'plain', 'girl', 'mustache', 'hero', 'girl', 'plain', 'girl'][i])); KI.forEach((c, i) => kitFace(c, 'kid')); FA.forEach((c, i) => kitFace(c, ['mustache', 'girl', 'kid', 'kid'][i]));
const POOL = [ich, mama, kow, kow2, sam, bk, ...LE, ...KI, ...FA]; POOL.forEach(c => outline(c.root, 2));
POOL.forEach(c => { c._skinM = c.head.children[0].material; c._skin0 = c._skinM.color.clone(); });
// palidez (kreidebleich): la piel va hacia blanco tiza
const PALE = new THREE.Color(0xf2f2f6); const pale = (ch, k) => { ch._skinM.color.copy(ch._skin0).lerp(PALE, k); return '#' + ch._skinM.color.getHexString(); };
const KR = hund(scene, 'krumel'), BR = hund(scene, 'dackel'); const DOGS = [KR, BR]; DOGS.forEach(d => outline(d.root, 2));
// ---------- atrezo ----------
const KOF = koffer(scene); outline(KOF.g, 1.6);
const GEIGE = geige(scene), LEINE = leine(scene), SCHILD = schild(scene, 'HUND?', 'BITTE BITTE!'); [GEIGE, LEINE, SCHILD].forEach(o => outline(o, 1.6));
const HATS = Array.from({ length: 4 }, (_, i) => { const h = partyHat(['#ff4a8a', '#3ab8ff', '#8ad84a', '#ffd23f'][i], '#ffffff'); scene.add(h); return h; });
const CONF = Array.from({ length: 60 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const SPARK = Array.from({ length: 30 }, () => { const s = new THREE.Mesh(new THREE.BoxGeometry(.1, .1, .4), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 1.4, 3), toneMapped: false })); scene.add(s); return s; });
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const ORBS = Array.from({ length: 14 }, (_, i) => sphere(.5, new THREE.MeshBasicMaterial({ color: new THREE.Color(...[[2, 1.4, 3], [3, 2.2, 1], [1.4, 2.4, 3]][i % 3]), toneMapped: false }), scene, 0, 0, 0, 10, 8));
const PROPS = [GEIGE, LEINE, SCHILD, ...HATS, ...CONF, ...SPARK, ...SWEAT, ...ORBS];
const FW = feuerwerk(scene, 7);
// ---------- ambiente ----------
const AIR = aire(scene, 700);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'night', SNOWY = 1, FWON = null;
function night() { MODE = 'night'; renderer.toneMappingExposure = .98; setSky([.03, .05, .17], [.1, .12, .36], [.3, .26, .5]); sky.moon.visible = true; sky.moon.position.set(-500, 650, -1300); hemi.intensity = 1.0; hemi.color.setRGB(.62, .7, 1); hemi.groundColor.setRGB(.36, .36, .5); sun.intensity = 1.15; sun.color.setRGB(.72, .8, 1); rim.intensity = 1.6;
  scene.fog.color.setRGB(.1, .13, .28); scene.fog.density = .0016; bloom.strength = .2; bloom.threshold = .88; FILL.intensity = 45; WARM.intensity = 0; }
function inside(h = .8, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .95, .9); hemi.groundColor.setRGB(.5, .42, .36); sun.intensity = 0; rim.intensity = .5; bloom.strength = .16; bloom.threshold = .9; scene.fog.density = .0002; FILL.intensity = fill; WARM.intensity = 0; SNOWY = 0; }
function hideAll() {
  for (const c of POOL) { c._skinM.color.copy(c._skin0); c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } }
  for (const d of DOGS) { d.root.visible = false; d.root.rotation.set(0, 0, 0); d.root.scale.setScalar(1); d.hat.visible = false; d.pose(0); if (d.root.parent !== scene) { d.root.parent.remove(d.root); scene.add(d.root); } }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  KOF.g.visible = false; KOF.g.rotation.set(0, 0, 0); KOF.g.scale.setScalar(1); KOF.open(0); if (KOF.g.parent !== scene) { KOF.g.parent.remove(KOF.g); scene.add(KOF.g); }
  for (const k in SETS) SETS[k].visible = false;
  for (const Hh of [...GA.L, ...GA.R]) { Hh.g.visible = true; Hh.g.scale.set(1, 1, 1); Hh.dirt.visible = false; Hh.door.rotation.y = 0; Hh.win.emissiveIntensity = .95; Hh.win.color.setHex(0xffe2a6); Hh.btn.material.emissiveIntensity = .8; }
  for (const Hh of DARKH) houseDark(Hh, 1);
  GA.TW.hands.visible = true; clockAt(23, 55);
  WZ.VASE.visible = true; WZ.SHARDS.visible = false; ES.gans.userData.smk.forEach(s => s.visible = false); KZ.NL.intensity = 0; KZ.ZL.intensity = 90;
  grade.uniforms.vig.value = .42; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.42; grade.uniforms.sharp.value = 1.05; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; SNOWY = 1; FWON = null; night(); }
function houseDark(Hh, k) { Hh.win.emissiveIntensity = .95 * (1 - k); Hh.win.color.setRGB(lerp(1, .24, k), lerp(.89, .26, k), lerp(.65, .32, k)); }
function clockAt(h, m) { GA.TW.minH.rotation.z = -m / 60 * Math.PI * 2; GA.TW.hourH.rotation.z = -((h % 12) + m / 60) / 12 * Math.PI * 2; }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
const dogAt = (d, x, y, z, ry = 0, s = 1) => { d.root.visible = true; d.root.position.set(x, y, z); d.root.rotation.set(0, ry, 0); d.root.scale.setScalar(s); return d; };
// maletín en la mano derecha del Coleccionista (o suelto en el mundo)
const kofHand = (ch, r = 1) => { attach(KOF.g, (r ? ch.aR : ch.aL).hand, [0, -.25, 0], [0, Math.PI / 2, 0], .72); return KOF; };
const kofAt = (x, y, z, ry = 0, s = 1) => { KOF.g.visible = true; KOF.g.position.set(x, y, z); KOF.g.rotation.set(0, ry, 0); KOF.g.scale.setScalar(s); return KOF; };
// coordenadas locales de una casa (x a lo largo de la fachada, z hacia la calle) -> mundo
const LH = (Hh, lx, ly, lz) => Hh.at(lx, ly, lz);
const putH = (ch, Hh, lx, lz, y = 0, lry = 0) => { const p = LH(Hh, lx, 0, lz); return put(ch, p.x, y, p.z, Hh.ry + lry); };
function camH(Hh, p, t, fov = 50) { const a = LH(Hh, ...p), b = LH(Hh, ...t); cam([a.x, a.y, a.z], [b.x, b.y, b.z], fov); }
function cmH(Hh, p0, p1, k, e = easeInOut) { const q = e(clamp(k)); const a = LH(Hh, lerp(p0[0], p1[0], q), lerp(p0[1], p1[1], q), lerp(p0[2], p1[2], q)), b = LH(Hh, lerp(p0[3], p1[3], q), lerp(p0[4], p1[4], q), lerp(p0[5], p1[5], q)); cam([a.x, a.y, a.z], [b.x, b.y, b.z], lerp(p0[6] ?? 50, p1[6] ?? 50, q)); }
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .3 + dy, h.z + fz * d - fx * side], [h.x, h.y - .5, h.z], fov); }
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function ojos(expr, T, sd) { const n = Math.sin(T * .9 + sd) * .55 + Math.sin(T * 2.3 + sd * 2.1) * .45;
  switch (expr) {
    case 'neutral': case 'talk': case undefined: return n > .25 ? 'half' : n < -.55 ? (sd % 2 ? 'side_l' : 'side_r') : 'normal';
    case 'sad': return n > -.1 ? 'half' : 'down';
    case 'happy': case 'smile': case 'relief': case 'joy': return n > -.3 ? 'happy' : 'half';
    case 'worried': return n > .45 ? 'side_l' : n < -.45 ? 'down' : 'worried';
    case 'scared': return n > .3 ? 'worried' : 'scared';
    case 'shock': case 'gasp': return n > -.2 ? 'wide' : 'scared';
    case 'determined': return n > .5 ? 'squint' : 'angry';
    case 'angry': case 'shout': return n > .55 ? 'squint' : 'angry';
    case 'confused': return n > 0 ? 'squint' : 'side_r';
    case 'sus': case 'smug': return n > .2 ? 'squint' : 'half';
    case 'bored': case 'tired': return 'half';
    case 'down': return 'down';
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk', extra = {}) => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat', ...extra });
const grin = (ch, T, ex = {}) => cara(ch, T, ch === sam ? { expr: 'neutral', mouth: 'grin', ...ex } : { expr: 'grin', eyes: 'happy', mouth: 'grin', ...ex });
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
function confetti(c, T0, T, n = 60) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = 3 + r() * 6; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function sparks(c, T0, T, n = 30, sp = 1) { SPARK.forEach((s, i) => { if (i >= n) return; const r = RNG(i * 7 + 3), t = ((T - T0) * 1.3 + r()) % 1; s.visible = true; const a = r() * 6.283, v = (2 + r() * 3) * sp; s.position.set(c.x + Math.cos(a) * v * t, c.y + v * t * 1.3 - t * t * 4, c.z + Math.sin(a) * v * t); s.lookAt(c.x, c.y, c.z); }); }
// orbes de luz que salen del maletín y vuelan a un destino
function orbs(from, to, T0, T, n = 14, dur = 1.2) { ORBS.forEach((o, i) => { if (i >= n) return; const r = RNG(i * 17 + 2), t = clamp((T - T0 - r() * .5) / dur); if (t <= 0 || t >= 1) return; o.visible = true; const dst = to(i, r); o.position.set(lerp(from.x, dst.x, t), lerp(from.y, dst.y, t) + Math.sin(t * Math.PI) * (6 + r() * 8), lerp(from.z, dst.z, t)); o.scale.setScalar(.6 + Math.sin(t * Math.PI) * .6); }); }

// ---------- capa 2D ----------
const BAD_ = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD_.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD_.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD_.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
// contador de mentiras sobre la cabeza: cnt(ch, n, k, {gold, pop (s desde el cambio), sc, dy})
const cnt = (ch, n, k = 1, o = {}) => { const pop = o.pop != null && o.pop >= 0 && o.pop < .35 ? 1 + Math.sin(o.pop / .35 * Math.PI) * .35 : 1; BAD_.push({ kind: 'cnt', text: String(n), gold: o.gold, w3: hp(ch).add(V(0, (o.dy ?? 1.9) * (ch.spec.scale || 1), 0)), s: spring(clamp(k) * 1.6) * Math.max(o.sc ?? .8, .78) * 1.25 * pop, a: 1, on: k > 0, flash: o.pop != null && o.pop >= 0 && o.pop < .2 }); };
// cuenta que baja en ciertos tiempos locales: cntDrop(ch, L.lt, start, [t1, t2...])
const cntDrop = (ch, lt, n0, times, o = {}) => { let n = n0, last = -9; for (const t of times) if (lt >= t) { n--; last = t; } cnt(ch, Math.max(0, n), o.k ?? 1, { ...o, pop: lt - last }); return n; };
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; if (b.kind === 'cnt' && (x < -30 || x > W + 30 || y < 0)) return; b.x = b.kind === 'cnt' ? clamp(x, 170, W - 170) : clamp(x, 200, W - 200); b.y = clamp(y, 150, H * .64); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num' || b.kind === 'green') { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : b.kind === 'green' ? '#04300e' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#8aff9a'); g.addColorStop(1, '#1ab84a'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  else if (b.kind === 'cnt') { const G = b.gold; c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 14; c.shadowOffsetY = 5; c.fillStyle = b.flash ? '#ffffff' : '#141a36'; c.beginPath(); c.roundRect(-104, -40, 208, 80, 40); c.fill(); c.shadowColor = 'transparent';
    c.lineWidth = 6; c.strokeStyle = G ? '#ffd23f' : '#ff4a8a'; c.stroke(); const gg = c.createLinearGradient(0, -32, 0, 32); gg.addColorStop(0, G ? '#ffe68a' : '#ff7aa8'); gg.addColorStop(1, G ? '#e0a020' : '#e01a5a'); c.fillStyle = gg; c.beginPath(); c.arc(-62, 0, 32, 0, 7); c.fill();
    c.font = `700 21px ${FONT}`; c.fillStyle = G ? '#3a2400' : '#ffffff'; c.lineWidth = 3; c.strokeStyle = G ? 'rgba(255,255,255,.5)' : 'rgba(80,0,30,.6)'; c.strokeText('LÜGEN', -62, 1); c.fillText('LÜGEN', -62, 1); c.font = `700 62px ${FONT}`; c.fillStyle = b.flash ? '#e01a5a' : (b.text === '0' ? '#ff6a6a' : '#ffffff'); c.fillText(b.text, 34, 4); }
  c.restore(); }
const KEY = /^(Stadt|zehnmal|lügen|Wahrheit|Neujahr|zehn|Lügen|Lüge|Januar|pleite|Februar|Eltern|alles|Weihnachtsessen|Lecker|Sammler|Silvesterabend|Riesig|Lächeln|Koffer|wertvollsten|Klick|immer|leerer|Kind|riecht|zweitausendmal|Hund|Nein|zweiten|dritten|Krümel|Silvester|elf|Schnee|kreidebleich|null|schuld|Kowalski|Juli|Spiegel|Auto|angelogen|Ja|Dackel|Bruno|nie|nochmal|allein|Leine|Hand|eiskalt|Sohn|Zehn|Frage|nachfragt|besiegen|fünf|Drei|Zwei|Eins|letzte|umdreht|zurück|Geige|Bäcker|Familie|Mitternacht|gelogen|Jahres)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null; const COVERS = [];
// la calle: casas en x = ±20,6 (fachada en x = ±15), acera hasta ±11, calzada ±7. Nuestra casa = L[0] (z = 10), Kowalski = L[1] (z = -9),
// panadería = R[1] (z = -9), casa de la familia desaparecida = R[3] (z = -47), plaza con abeto z = -262, torre z = -330.
const street = (snow = 1) => { use('GA'); night(); SNOWY = snow; };
// ===== Planos 1-28 (0 – 47,2 s): la regla, cómo vive el pueblo, el Coleccionista =====
// utilidades de puerta: residente en el umbral (sobre el escalón) y el Coleccionista abajo, mirando a la casa
const inDoor = (ch, Hh, side = 0, lry = 0) => putH(ch, Hh, Hh.dx + side, Hh.F + .95, .45, lry);
const atDoor = (ch, Hh, dist = 4.2, side = 0) => putH(ch, Hh, Hh.dx + side, Hh.F + Math.max(dist, 3.6), 0, PI);
const warmAt = (p, k = 70) => { WARM.position.copy(p); WARM.intensity = k; };
// gente andando por la calle (extras con contador)
function walkers(L, list, z0, n0 = 10, o = {}) { list.forEach(([c, x, dz, sp, ry], i) => { caminar(c, L.lt, { x, z: z0 + dz, ry: ry ?? 0, speed: sp ?? 2.6, T: L.T + i }); cara(c, L.T + i * 1.3, { expr: o.expr ?? 'neutral' }); if (o.cnt !== false) cnt(c, typeof n0 === 'function' ? n0(i) : n0, clamp(L.lt * 3 - i * .15), { sc: .7 }); }); }

// 1 · gancho: la calle nevada, todos con su contador de 10 mentiras; yo en el centro
shot(0, 'Z', null, L => { street(); const z0 = -40;
  const me = caminar(ich, L.lt, { x: -1.6, z: z0, ry: 0, speed: 2.4, T: L.T }); cara(ich, L.T, { expr: 'happy' }); cnt(ich, 10, clamp(L.lt * 3), { sc: .7 });
  walkers(L, [[LE[0], 1.9, -.4, 2.4], [LE[4], -3.4, -5.6, 2.4], [LE[6], .4, -9.0, 2.4]], z0, 10, { expr: 'smile' });
  cm([0, 7.6, me.z + 19, 0, 2.6, me.z - 3, 50], [0, 7.4, me.z + 17.5, 0, 2.6, me.z - 3, 48], L.k, easeOut); sh(V(0, 0, me.z), 40); }, [[.05, 'steps_snow', .6], [.4, 'pling', .5], [1.2, 'wind', .3]]);
// 1b · «…kannst du nur zehnmal im Jahr lügen.»: más cerca, todos alrededor de mí, cada uno con su 10
shot(.74, 'W', null, L => { street(); const z0 = -30, X = 9.2;
  const me = put(ich, X, .3, z0, -PI / 2); actuar(me, L.lt, [[0, {}], [.5, { aRx: 2.6, aRz: .3, aRe: .2 }, { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'happy', mouth: 'open_smile' }); cnt(me, 10, clamp(L.lt * 4), { sc: .9 });
  [[LE[5], X + .4, z0 + 3.1, -PI / 2 - .3], [LE[1], X + .6, z0 - 3.2, -PI / 2 + .3], [LE[7], X + 2.8, z0 + 1.6, -PI / 2]].forEach(([c, x, z, ry], i) => { put(c, x, .3, z, ry); actuar(c, L.lt, [[0, {}], [.3 + i * .12, 'wave', { dur: .3 }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'smile' }); cnt(c, 10, clamp(L.lt * 4 - .3 - i * .25), { sc: .8 }); });
  cm([-9.5, 2.6, z0 + 4.5, X, 2.4, z0, 46], [-8.5, 2.8, z0 - 2.0, X, 2.4, z0, 44], L.k); sh(V(X, 0, z0), 30); }, [[.05, 'pop', .5], [.4, 'pling', .45], [.8, 'pling', .45], [1.4, 'steps_snow', .4]]);
// 2 · «danach kommt nur noch die Wahrheit»: un vecino con el contador a 0; la verdad se le escapa (WAHRHEIT)
shot(2.81, 'C', null, L => { street(); const c = put(LE[1], 1.2, 0, -58, -.35);
  actuar(c, L.lt, [[0, { aLx: .3, aRx: .3 }], [.8, { ...GEST.hands_face, aLx: 1.7, aRx: 1.7 }, { dur: .4 }]], { T: L.T });
  cara(c, L.T, { expr: L.lt < .8 ? 'worried' : 'shock', mouth: L.lt < .8 ? 'frown' : 'scream' }); cnt(c, 0, 1, { sc: .75 }); badge('big', 'WAHRHEIT!', W / 2, H * .2, (L.lt - .9) * 2.5, 1, .9);
  onFace(c, 8.5, -.6, -3.2, 44, L.k, 7.2); sh(V(0, 0, -58), 30); }, [[.1, 'hmm', .5], [.9, 'magic_hit', .6]]);
// 3 · Año Nuevo: fuegos sobre la plaza, todos celebran y su contador salta a 10
shot(5.15, 'F', null, L => { street(); clockAt(0, 0); FWON = Object.assign(V(0, 0, -320), { spread: 140, h: 70 });
  const P = [[LE[0], -6, -244], [LE[5], -2.2, -242], [KI[0], 1.6, -241], [LE[4], 5.4, -243.5], [LE[2], -9, -248], [LE[6], 8.6, -248], [KI[2], -4, -239.5], [LE[1], 3.6, -238.6]];
  P.forEach(([c, x, z], i) => { put(c, x, 0, z, 0); actuar(c, L.lt, [[0, GEST.cheer]], { T: L.T + i, extra: { crouch: Math.abs(Math.sin(L.T * 6 + i)) * .08 } }); cara(c, L.T + i, { expr: 'joy', eyes: 'happy', mouth: Math.sin(L.T * 9 + i) > 0 ? 'laugh' : 'open_smile' }); const k = clamp((L.lt - .3 - i * .07) * 4); cnt(c, k < .5 ? 0 : 10, 1, { sc: .55, pop: L.lt - .3 - i * .07 - .12 }); });
  badge('tag', 'NEUJAHR', W / 2, H * .1, L.lt * 3);
  cm([0, 3.6, -222, 0, 9, -262, 52], [0, 4.4, -226, 0, 10, -262, 50], L.k); sh(V(0, 0, -244), 40); }, [[.05, 'firework', .8], [.4, 'cheer', .55], [.9, 'firework', .6], [1.5, 'party_horn', .5]]);
// 4 · «wer dich etwas fragt»: dos vecinas en la acera; una pregunta
shot(7.54, 'W', null, L => { street(); const a = put(LE[2], 9.2, .3, -27.2, PI - .5), b = put(LE[7], 9.0, .3, -31.6, -.5);
  actuar(a, L.lt, [[0, { aRx: 1.0, aRe: .9, aRz: -.1, lean: .08 }]], { T: L.T }); talk(a, L.T, 7.5, 8.64, 'talk'); actuar(b, L.lt, [[0, GEST.listen]], { T: L.T }); cara(b, L.T, { expr: 'worried' });
  cnt(a, 4, 1, { sc: .55 }); cnt(b, 3, 1, { sc: .55 }); badge3('q', '?', hp(a).add(V(0, 2.2, 0)), L.lt * 3, .8);
  cm([-2.6, 4.4, -26.6, 9.1, 4.0, -29.4, 50], [-1.8, 4.2, -27.4, 9.1, 4.0, -29.4, 48], L.k); sh(V(9, 0, -29), 25); }, [[.05, 'steps_snow', .5], [.3, 'hmm', .4]]);
// 5 · «bekommt eine Antwort»: ella contesta (y se le nota que no quiere)
shot(8.64, 'C', null, L => { street(); const b = put(LE[7], 8.8, .3, -31.4, .15); actuar(b, L.lt, [[0, { aLx: .6, aLe: 1.2, aRx: .3 }]], { T: L.T }); talk(b, L.T, 8.6, 9.64, 'worried'); cnt(b, 3, 1, { sc: .6 });
  onFace(b, 7.2, -.4, 1.8, 42, L.k, 6.4); sh(V(9, 0, -31), 25); }, [[.05, 'breath', .4], [.5, 'gulp', .4]]);
// 6 · «und sind deine Lügen aufgebraucht»: el contador de un vecino baja hasta 0; suda
shot(9.64, 'S', null, L => { street(); const c = put(LE[4], -1, 0, -88, .25); actuar(c, L.lt, [[0, { ...GEST.hug_self }]], { T: L.T, extra: shiver(L.T, .8) }); cara(c, L.T, { expr: 'scared' }); sweat(c, L.T);
  cntDrop(c, L.lt, 2, [.35, .9], { sc: .75 }); onFace(c, 9, -.2, -2.4, 44, L.k, 7.4); sh(V(0, 0, -88), 30); }, [[.35, 'tick_down', .6], [.9, 'tick_down', .6], [1.1, 'shiver', .4]]);
// 7 · «ist diese Antwort immer ehrlich»: se tapa la boca, pero sale la verdad
shot(11.16, 'C', null, L => { street(); const c = put(LE[4], -1, 0, -88, .25);
  actuar(c, L.lt, [[0, { ...GEST.hands_face, aLx: 1.9, aRx: 1.9, aLe: 2.4, aRe: 2.4 }], [.7, { aLx: 1.0, aLz: .9, aRx: 1.0, aRz: .9, aLe: .8, aRe: .8, lean: -.12, headX: -.2 }, { dur: .25 }]], { T: L.T });
  cara(c, L.T, { expr: L.lt < .7 ? 'worried' : 'shock', mouth: L.lt < .7 ? 'wavy' : 'talk_wide' }); cnt(c, 0, 1, { sc: .7 }); badge('green', 'EHRLICH!', W / 2, H * .2, (L.lt - .75) * 2.5, 1, .85);
  onFace(c, 7.8, -.5, 2.2, 44, L.k, 7); sh(V(0, 0, -88), 30); }, [[.1, 'gulp', .5], [.75, 'pling', .55]]);
// 8 · «Wir Kinder sind schon im Januar pleite»: cuatro niños con los bolsillos vacíos y el contador a 0 (JANUAR)
shot(12.91, 'W', null, L => { street(); const X = [-4.2, -1.4, 1.4, 4.2];
  KI.forEach((c, i) => { put(c, X[i], 0, -120 + Math.abs(X[i]) * .3, -X[i] * .05); actuar(c, L.lt, [[0, { ...GEST.shrug, headZ: (i % 2 ? -.2 : .2) }]], { T: L.T + i }); cara(c, L.T + i, { expr: i % 2 ? 'sad' : 'worried' }); cnt(c, 0, clamp(L.lt * 3 - i * .2), { sc: .5 }); });
  badge('tag', 'JANUAR', W / 2, H * .12, L.lt * 3);
  cm([0, 3.4, -100.5, 0, 2.6, -120, 50], [0, 3.0, -102.5, 0, 2.6, -120, 50], L.k); sh(V(0, 0, -120), 25); }, [[.05, 'wind', .45], [.6, 'sigh_kid', .5], [1.2, 'coin_flip', .3]]);
// 9 · «Ich hab Hausaufgaben gemacht.»: cocina, cuaderno en blanco; la madre mira; su contador baja 1 -> 0
shot(14.81, 'Z', null, L => { use('KU'); inside(.85, 40); const c = put(KI[1], KX - 2.4, 0, 5.4, PI), m = put(LE[5], KX - 5.6, 0, 8.4, PI - .4);
  applyPose(c, { lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, hipY: 1.9, aLx: .9, aRx: .9, aLe: .6, aRe: .6 }); c.root.position.y = .9; talk(c, L.T, 14.8, 16.1, 'smile');
  actuar(m, L.lt, [[0, GEST.cross]], { T: L.T }); cara(m, L.T, { expr: 'sus' }); cntDrop(c, L.lt, 1, [.75], { sc: .6 });
  cm([KX - 2.6, 5.4, -4.6, KX - 2.8, 4.4, 6.0, 48], [KX - 2.6, 5.2, -3.8, KX - 2.8, 4.4, 6.0, 46], L.k); sh(V(KX, 0, 3), 20); }, [[.05, 'pages', .5], [.75, 'tick_down', .6]]);
// 10 · «Ich war's nicht.»: el jarrón roto, el balón; manos a la espalda
shot(16.14, 'C', null, L => { use('WZ'); inside(.8, 40); WZ.VASE.visible = false; WZ.SHARDS.visible = true; const c = put(KI[2], WX + 10.6, 0, 9.2, -.5);
  actuar(c, L.lt, [[0, { aLx: -.5, aRx: -.5, aLz: -.1, aRz: -.1, aLe: .9, aRe: .9, headZ: .15, lean: -.04 }]], { T: L.T }); cara(c, L.T, { expr: 'smile', eyes: L.lt % .6 < .3 ? 'side_l' : 'side_r', mouth: 'smile' }); cntDrop(c, L.lt, 1, [.45], { sc: .6 });
  cm([WX + 12.0, 3.0, 17.2, WX + 11.0, 2.6, 8.4, 50], [WX + 12.4, 2.8, 16.4, WX + 11.0, 2.6, 8.4, 50], L.k); sh(V(WX + 12, 0, 7), 20); }, [[.02, 'porcelain_break', .55], [.45, 'tick_down', .6], [.6, 'whistle_inno', .4]]);
// 11 · «Ich bin gar nicht müde.»: en la cama con ojeras enormes, bostezando
shot(17.06, 'S', null, L => { use('KZ'); inside(.55, 25); KZ.ZL.intensity = 30; KZ.NL.intensity = 70; const c = put(KI[3], ZX - 5, 2.6, -6.5, 0);
  applyPose(c, { lLx: 1.55, lRx: 1.55, lLk: .1, lRk: .1, hipY: 1.2, aLx: .3, aRx: .3, headX: Math.sin(L.T * 3) * .08 }); cara(c, L.T, { expr: 'sleepy', eyes: 'half', mouth: L.lt > .5 && L.lt < .95 ? 'yawn' : 'smile', bags: 1 }); cntDrop(c, L.lt, 1, [.3], { sc: .6 });
  cm([ZX - 4.4, 6.6, 4.4, ZX - 5, 5.4, -5.6, 46], [ZX - 4.6, 6.4, 3.4, ZX - 5, 5.4, -5.6, 44], L.k); sh(V(ZX - 5, 0, -5), 20); }, [[.3, 'tick_down', .6], [.5, 'yawn_f', .5]]);
// 12 · «Ab Februar…»: la madre con los brazos cruzados y el niño sin mentiras (FEBRUAR)
shot(18.15, 'W', null, L => { use('KU'); inside(.85, 40); const c = put(KI[0], KX - 1.6, 0, 8.4, 0), m = put(LE[7], KX + 1.7, 0, 8.6, 0);
  m.root.rotation.y = -.55; c.root.rotation.y = .55;
  actuar(m, L.lt, [[0, GEST.cross]], { T: L.T }); cara(m, L.T, { expr: 'smug' }); actuar(c, L.lt, [[0, GEST.slump]], { T: L.T }); cara(c, L.T, { expr: 'sad' }); cnt(c, 0, 1, { sc: .55 }); cnt(m, 6, 1, { sc: .55 });
  badge('tag', 'FEBRUAR', W / 2, H * .12, L.lt * 3);
  cm([KX, 4.4, 23.4, KX, 3.6, 8.4, 46], [KX, 4.2, 22.4, KX, 3.6, 8.4, 46], L.k); sh(V(KX, 0, 8), 20); }, [[.05, 'pages', .5], [.4, 'clock_tick', .4]]);
// 13 · «…wissen unsere Eltern einfach alles.»: el niño lo confiesa todo de golpe; ella asiente
shot(19.47, 'C', null, L => { use('KU'); inside(.85, 40); const c = put(KI[0], KX - 1.6, 0, 8.4, 0), m = put(LE[7], KX + 1.7, 0, 8.6, 0);
  m.root.rotation.y = faceTo(m.root.position, c.root.position); c.root.rotation.y = faceTo(c.root.position, m.root.position);
  actuar(c, L.lt, [[0, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: .9, aRe: .9, lean: .08 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: kitLips(L.T * 1.7, [[0, 999, 'x']]) || 'talk_wide' }); sweat(c, L.T, 1);
  actuar(m, L.lt, [[0, { ...GEST.cross, headX: Math.max(0, Math.sin(L.T * 7)) * .15 }]], { T: L.T }); cara(m, L.T, { expr: 'smug', eyes: 'half', mouth: 'smirk' }); cnt(c, 0, 1, { sc: .55 });
  onFace(m, 7.2, -.6, -2.2, 44, L.k, 6.2); sh(V(KX, 0, 3), 20); }, [[.1, 'whisper', .4], [.6, 'hmm', .45]]);
// 14 · «Die Erwachsenen dagegen sparen jede Lüge.»: un señor protege su contador dorado como un tesoro
shot(20.85, 'R', null, L => { street(); const c = put(LE[3], -8.8, .3, -66, .6);
  actuar(c, L.lt, [[0, { ...GEST.hug_self, headY: Math.sin(L.T * 2.4) * .5, lean: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: Math.sin(L.T * 2.4) > 0 ? 'side_r' : 'side_l', mouth: 'smirk' }); cnt(c, 10, 1, { gold: true, sc: .8 });
  onFace(c, 9.6, .2, -2.6, 46, L.k, 8); sh(V(-9, 0, -66), 25); }, [[.05, 'ding_soft', .5], [.6, 'sniff', .4], [1.4, 'chain_rattle', .3]]);
// 15 · «Beim Weihnachtsessen sagt keiner…»: la mesa de Navidad, todos callados, contadores dorados
shot(23.01, 'S', null, L => { use('ES'); inside(.7, 35);
  const P = [[LE[0], -5.4, -4.5, PI / 2], [LE[3], -5.4, 0, PI / 2], [LE[6], -5.4, 4.5, PI / 2], [LE[5], 5.4, -4.5, -PI / 2], [LE[1], 5.4, 0, -PI / 2], [LE[7], 5.4, 4.5, -PI / 2]];
  P.forEach(([c, x, z, ry], i) => { put(c, EX + x, 0, z, ry); applyPose(c, { lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, hipY: 2.0, aLx: .9, aRx: .9, aLe: .5, aRe: .5, headX: .15, headY: Math.sin(L.T * 1.3 + i) * .3 }); c.root.position.y = .3; cara(c, L.T + i, { expr: 'bored', eyes: i % 2 ? 'side_l' : 'half', mouth: 'flat' }); cnt(c, 10, clamp(L.lt * 3 - i * .1), { gold: true, sc: .45 }); });
  badge('tag', 'WEIHNACHTEN', W / 2, H * .1, L.lt * 3);
  cm([EX, 21, 25, EX, 2.5, -.5, 46], [EX, 20, 24, EX, 2.5, -.5, 46], L.k); sh(V(EX, 0, 0), 25); }, [[.05, 'bell_far', .5], [.4, 'spoon', .4], [1.0, 'clock_tick', .4], [1.5, 'chew', .3]]);
// 16 · «„Lecker!“, weil es eben nicht lecker ist»: el ganso quemado humea; el abuelo mastica con cara de sufrimiento: «…»
shot(24.85, 'C', null, L => { use('ES'); inside(.7, 35); const c = put(LE[3], EX - 5.4, .3, 0, PI / 2);
  applyPose(c, { lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, hipY: 2.0, aRx: 1.3, aRe: 1.8, aLx: .8, aLe: .5, headZ: Math.sin(L.T * 9) * .04 }); cara(c, L.T, { expr: 'sad', eyes: 'squint', mouth: Math.sin(L.T * 10) > 0 ? 'wavy' : 'grimace' });
  ES.gans.userData.smk.forEach((s, i) => { s.visible = true; const ph = (L.T * .5 + i / 6) % 1; s.position.set(Math.sin(i * 2 + L.T) * .4, 1.4 + ph * 3, Math.cos(i) * .3); s.scale.setScalar(.6 + ph * 1.6); s.material.opacity = .45 * (1 - ph); });
  bubble(c, '…', (L.lt - .5) * 3, 2.0); cnt(c, 10, 1, { gold: true, sc: .55 });
  cm([EX + 4.6, 8.2, 3.2, EX, 4.4, 0, 46], [EX + 2.2, 6.6, 1.2, EX - 5.2, 5.8, 0, 44], L.k, easeInOut); sh(V(EX, 0, 0), 20); }, [[.1, 'pan_sizzle', .4], [.6, 'chew', .5], [1.2, 'gulp', .5]]);
// 17 · «Und wieso das Ganze? Wegen dem…»: la calle se vacía, la gente entra deprisa y cierra puertas
shot(26.55, 'W', null, L => { street(); const z0 = -14;
  [[LE[6], 1.6, 0, PI / 2 - .3], [KI[1], -2.2, -5, -PI / 2 + .3], [LE[2], 2.8, -11, PI / 2 - .2]].forEach(([c, x, dz, ry], i) => { caminar(c, L.lt, { x, z: z0 + dz, ry, speed: 4.2, run: true, T: L.T + i }); cara(c, L.T, { expr: 'scared' }); });
  GA.R[0].door.rotation.y = 1.3 * (1 - clamp(L.lt * 1.4)); GA.L[2].door.rotation.y = 1.3 * (1 - clamp(L.lt * 1.2 - .2)); badge('q', '?', W / 2, H * .22, L.lt * 3, 1, 1.1);
  cm([0, 5.4, 6, 0, 3.6, -22, 52], [0, 5.8, 4.6, 0, 3.6, -22, 52], L.k); sh(V(0, 0, -14), 35); }, [[.05, 'crowd_run', .5], [.7, 'door_slam', .55], [1.1, 'door_slam', .45]]);
// 18 · «…dem Sammler, der jeden Silvesterabend kommt.» (zoom lento): avanza por la calle vacía entre la nieve, fuegos detrás
shot(27.98, 'C', 'slow', L => { street(1.2); FWON = Object.assign(V(0, 0, -300), { spread: 160, h: 80 }); scene.fog.density = .003;
  const r = caminar(sam, L.lt, { x: 0, z: -106, ry: 0, speed: 2.0, T: L.T, stride: 1.2 }); grin(sam, L.T); kofHand(sam);
  badge('tag', 'SILVESTER', W / 2, H * .1, (L.lt - .2) * 3);
  cm([0, 2.2, r.z + 22, 0, 6, r.z, 46], [0, 2.6, r.z + 17, 0, 6.6, r.z, 44], L.k); sh(V(0, 0, r.z), 40); }, [[.05, 'firework', .5], [.3, 'steps_snow', .6], [1.2, 'wind', .4]]);
// 19 · «Riesig, immer am Lächeln»: contrapicado: enorme, sonrisa fija
shot(30.32, 'Z', null, L => { street(); const c = put(sam, 0, 0, -84, 0); actuar(c, L.lt, [[0, { aRx: .15, headX: .25 }]], { T: L.T }); grin(c, L.T); kofHand(c);
  cm([1.8, 1.2, -76.4, 0, 8.4, -84, 54], [1.2, 1.4, -78.2, 0, 8.8, -84, 50], L.k); sh(V(0, 0, -84), 30); }, [[.05, 'steps_heavy', .6], [.5, 'creepy_ting', .5]]);
// 20 · «in der Hand ein schwarzer Koffer»: el maletín balanceándose al andar (cámara al lado, a la altura de la mano)
shot(31.84, 'S', null, L => { street(); const r = caminar(sam, L.lt, { x: 0, z: -80, ry: 0, speed: 2.0, T: L.T, stride: 1.2 }); grin(sam, L.T); kofHand(sam);
  const kp = wpos(KOF.g); cam([kp.x + 8.4, 2.2, kp.z + 4.6], [kp.x, 2.4, kp.z], 48); sh(V(0, 0, r.z), 25); }, [[.05, 'briefcase', .6], [.7, 'steps_heavy', .5], [1.2, 'chain_rattle', .3]]);
// 21 · «Er klingelt an jedem Haus»: el dedo enguantado aprieta el timbre
shot(33.43, 'W', null, L => { street(); const Hh = GA.R[2]; const c = putH(sam, Hh, Hh.dx + .05, Hh.F + 2.4, 0, PI); const pr = clamp((L.lt - .3) * 4) * (L.lt < .8 ? 1 : 0);
  actuar(c, L.lt, [[0, { aLx: .3 }], [.15, { aLx: 1.25, aLz: .05, aLe: .3, lean: .16 }, { dur: .2 }]], { T: L.T }); grin(c, L.T); kofHand(c); Hh.btn.material.emissiveIntensity = .8 + pr * 3;
  camH(Hh, [Hh.dx + 12, 6.0, Hh.F + 8], [Hh.dx + 1.4, 3.8, Hh.F + 1.4], 34); warmAt(LH(Hh, Hh.dx, 4, Hh.F + 2)); sh(LH(Hh, Hh.dx, 0, Hh.F), 15); }, [[.32, 'door_bell', .8]]);
// 22 · «und fragt nur eins:»: se agacha hacia la puerta abierta (desde dentro, por detrás de la vecina)
shot(34.53, 'C', null, L => { street(); const Hh = GA.R[2]; Hh.door.rotation.y = 1.4; const c = atDoor(sam, Hh, 4.2, -1.6), v = inDoor(LE[7], Hh, .3, 0);
  actuar(c, L.lt, [[0, { lean: .32, headX: .2, aRx: .2 }]], { T: L.T }); grin(c, L.T); kofHand(c); applyPose(v, { ...GEST.shrug }); cara(v, L.T, { expr: 'worried' });
  camH(Hh, [Hh.dx + 8, 10.5, Hh.F + 17], [Hh.dx, 4.6, Hh.F + 2.2], 32); warmAt(LH(Hh, Hh.dx, 4, Hh.F + 1)); sh(LH(Hh, Hh.dx, 0, Hh.F), 15); }, [[.05, 'door_creak', .55], [.6, 'creepy_ting', .4]]);
// 23 · «Was ist Ihnen hier am wertvollsten?»: él, en contrapicado, preguntando con la sonrisa enorme
shot(35.88, 'Z', null, L => { street(); const Hh = GA.R[2]; Hh.door.rotation.y = 1.4; const c = atDoor(sam, Hh, 6.4, 0);
  actuar(c, L.lt, [[0, { lean: .06, headX: .25, aLx: .9, aLe: 1.3, aLz: .1 }]], { T: L.T }); talk(c, L.T, 35.8, 37.6, 'grin', { eyes: 'happy' }); kofHand(c);
  const h = hp(c); const f = LH(Hh, Hh.dx + .8, 0, Hh.F + 1.3); cam([f.x, 5.0, f.z], [h.x, h.y + .2, h.z], 50); warmAt(LH(Hh, Hh.dx, 5, Hh.F + 2.4), 30); sh(LH(Hh, Hh.dx, 0, Hh.F), 15); }, [[.1, 'whisper', .4], [1.2, 'creepy_ting', .45]]);
// 24 · «Und weil fast keiner mehr eine Lüge hat»: la vecina, contador a 0, aterrada
shot(37.58, 'S', null, L => { street(); const Hh = GA.R[2]; Hh.door.rotation.y = 1.4; const v = inDoor(LE[7], Hh, 0, 0);
  actuar(v, L.lt, [[0, { ...GEST.hands_face, aLx: 1.7, aRx: 1.7 }]], { T: L.T, extra: shiver(L.T) }); cara(v, L.T, { expr: 'scared' }); sweat(v, L.T); cnt(v, 0, 1, { sc: .7 });
  onFace(v, 7.6, -.3, 1.6, 44, L.k, 6.6); warmAt(hp(v).add(V(0, 2, 0)), 50); sh(LH(Hh, Hh.dx, 0, Hh.F), 15); }, [[.05, 'heartbeat', .6], [.9, 'gasp_old', .5]]);
// 25 · «sagen alle die Wahrheit.»: el panadero confiesa: su violín
shot(39.52, 'W', null, L => { street(); const Hh = BAKH; Hh.door.rotation.y = 1.4; const c = inDoor(bk, Hh, 0, 0);
  actuar(c, L.lt, [[0, { aLx: .9, aLe: 1.0, aRx: .9, aRe: 1.0, aLz: .3, aRz: .3, headX: .2 }]], { T: L.T }); talk(c, L.T, 39.5, 40.7, 'sad'); cnt(c, 0, 1, { sc: .6 }); bubble(c, 'Meine Geige…', (L.lt - .2) * 3, 1.6);
  onFace(c, 9.5, .2, -2.4, 44, L.k, 8.6); warmAt(hp(c).add(V(0, 2, 0)), 50); sh(LH(Hh, Hh.dx, 0, Hh.F), 15); }, [[.05, 'sigh', .5], [.6, 'strings', .45]]);
// 26 · «Klick, der Koffer schnappt zu.»: el violín vuela al maletín y la tapa se cierra de golpe
shot(40.69, 'C', null, L => { street(); const Hh = BAKH; const base = LH(Hh, Hh.dx, 0, Hh.F + 3.2);
  const k = kofAt(base.x, 2.0, base.z, Hh.ry, 1.1); const sh_ = clamp((L.lt - .25) / .12); k.open(1 - sh_);
  const fly = clamp(L.lt / .3), g0 = LH(Hh, Hh.dx, 4, Hh.F + .5); if (fly < 1) show(GEIGE, lerp(g0.x, base.x, fly), lerp(g0.y, 1.4, fly), lerp(g0.z, base.z, fly), L.T * 9, lerp(1, .3, fly));
  if (L.lt > .25 && L.lt < .55) sparks(V(base.x, 1.2, base.z), .25, L.T, 20, .6);
  const c = LH(Hh, Hh.dx + 6.4, 0, Hh.F + 9.6); cam([c.x, 4.4, c.z], [base.x, 1.6, base.z], 40); sh(base, 15); }, [[.05, 'whoosh_soft', .5], [.27, 'lid_click', .9], [.3, 'magic_hit', .5]]);
// 27 · «Was sie gesagt haben, ist weg. Für immer.»: el panadero, con las manos vacías, en la puerta
shot(42.04, 'S', null, L => { street(); const Hh = BAKH; Hh.door.rotation.y = 1.4; const c = inDoor(bk, Hh, 0, 0);
  actuar(c, L.lt, [[0, { aLx: .9, aRx: .9, aLe: .4, aRe: .4, aLz: .2, aRz: .2, headX: .2 }], [1.2, { ...GEST.slump, headX: .22 }, { dur: .5 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', eyes: L.lt > 1.2 ? 'cry' : 'down', mouth: 'frown' });
  camH(Hh, [Hh.dx - 2.4, 4.8, Hh.F + 8.6], [Hh.dx, 4.4, Hh.F], 46); warmAt(hp(c).add(V(0, 2, 0)), 50); sh(LH(Hh, Hh.dx, 0, Hh.F), 18); }, [[.1, 'wind', .45], [1.3, 'sad_tone', .5]]);
// 28 · «Deshalb wird unsere Stadt jedes Jahr ein bisschen leerer.»: vista aérea; casas que se apagan una a una (JEDES JAHR)
shot(44.35, 'Z', null, L => { street(); scene.fog.density = .0022; const order = [GA.L[3], GA.R[4], GA.L[6]]; order.forEach((Hh, i) => houseDark(Hh, clamp((L.lt - .5 - i * .55) * 3)));
  badge('tag', 'JEDES JAHR', W / 2, H * .1, L.lt * 3);
  cm([0, 70, 40, 0, 0, -70, 50], [0, 62, 24, 0, 0, -80, 48], L.k); sh(V(0, 0, -60), 90); }, [[.05, 'wind', .55], [.55, 'switch', .5], [1.1, 'switch', .5], [1.65, 'switch', .5], [2.2, 'sad_tone', .4]]);
COVERS.push({ i: 0, k: .7, cam: () => cam([0, 3.0, -25], [0, 3.4, -40], 48), l2: 'NUR ZEHN LÜGEN IM JAHR' });
// ===== Planos 29-58 (47,2 – 97,9 s): yo, mamá y el perro; Nochevieja; Herr Kowalski =====
const SOFA_Y = .95;   // altura de la raíz para sentarse en el sofá del salón
const sitPose = (ex = {}) => ({ lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, hipY: 2.0, ...ex });
const mamaSofa = (L, ex = {}, face = { expr: 'bored' }) => { const m = put(mama, WX - 1.6, SOFA_Y, -5.6, 0); applyPose(m, sitPose({ aLx: 1.1, aRx: 1.1, aLe: 1.3, aRe: 1.3, headX: .3, ...ex })); cara(m, L.T, face); return m; };
const book = (m) => { attach(SCHILD, m.aR.hand, [0, -.6, .4], [-.4, 0, 0], .0001); };   // (sin libro: se deja oculto)

// 29 · «Und ich? Ich bin das Kind,»: yo, delante de casa, saludo (ICH)
shot(47.24, 'W', null, L => { street(); const c = put(ich, -9.6, .3, 6.2, PI / 2); actuar(c, L.lt, [[0, {}], [.15, 'wave', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' }); cnt(c, 10, 1, { sc: .65 });
  badge('tag', 'ICH', W / 2, H * .17, (L.lt - .1) * 3); warmAt(V(-12, 6, 6), 60);
  cm([-1.2, 3.0, 7.8, -9.6, 2.6, 6.2, 46], [-2.2, 2.8, 7.6, -9.6, 2.6, 6.2, 44], L.k); sh(V(-10, 0, 6), 25); }, [[.05, 'steps_snow', .5], [.3, 'pop', .5]]);
// 30 · «das jede Lüge riecht.»: un vecino suelta una mentira (su contador baja) y yo lo huelo y lo señalo: LÜGE!
shot(48.66, 'C', null, L => { street(); const c = put(ich, 2, 0, -31.0, PI + .7), v = put(LE[1], 2.4, 0, -34.6, -1.1);
  actuar(c, L.lt, [[0, { headX: -.1 }], [.55, { ...GEST.point, aRx: 1.9 }, { dur: .25 }]], { T: L.T, extra: { headZ: Math.sin(L.T * 14) * .05 } }); cara(c, L.T, { expr: 'sus', eyes: 'squint', mouth: 'wavy' });
  actuar(v, L.lt, [[0, { aRx: .6, aRe: 1.2 }]], { T: L.T }); talk(v, L.T, 48.6, 49.3, 'smile'); cntDrop(v, L.lt, 6, [.3], { sc: .7 }); badge('red', 'LÜGE!', W / 2, H * .22, (L.lt - .6) * 3, 1, .85);
  cm([-12, 5.0, -31.6, 2.2, 3.4, -32.8, 44], [-11, 4.9, -31.6, 2.2, 3.4, -32.8, 42], L.k); sh(V(2, 0, -32), 20); }, [[.1, 'sniff', .7], [.3, 'tick_down', .55], [.6, 'stamp', .5]]);
// 31 · «Ich frage nach. Und frage nach.»: tirando de la manga de mamá, que intenta leer en el sofá
shot(50.12, 'S', null, L => { use('WZ'); inside(.8, 40); const m = mamaSofa(L, { headY: -.35 }, { expr: 'bored', eyes: 'half' }); const c = put(ich, WX + 1.4, 0, -3.0, -1.0);
  actuar(c, L.lt, [[0, { aLx: 1.5, aLe: .3, lean: .12, aRx: .4 }]], { T: L.T, extra: { aLx: 1.5 + Math.sin(L.T * 12) * .25 } }); talk(c, L.T, 50.1, 51.7, 'happy'); badge3('q', '?', hp(c).add(V(0, 2, 0)), L.lt * 3, .7);
  cm([WX + 1.2, 5.0, 9.4, WX + .5, 3.6, -4.4, 46], [WX + 1.0, 4.8, 8.6, WX + .5, 3.6, -4.4, 46], L.k); sh(V(WX, 0, -4), 20); }, [[.05, 'cloth', .5], [.5, 'hmm', .4], [1.0, 'cloth', .4]]);
// 32 · «Und frage nach.»: mi cara, decidida, y signos de interrogación por todas partes
shot(51.64, 'C', null, L => { use('WZ'); inside(.8, 40); const c = put(ich, WX + 2.4, 0, -3.4, -.6); actuar(c, L.lt, [[0, { lean: .1, aRx: .5, aLx: .5 }]], { T: L.T }); talk(c, L.T, 51.6, 53.2, 'determined');
  [[.3, .2, .2], [.75, .2, .5], [.25, .3, .8], [.7, .32, 1.05]].forEach(([x, y, t], i) => badge('q', i % 2 ? '??' : '?', W * x, H * y, (L.lt - t) * 3, 1, .7));
  onFace(c, 5.2, -.3, 1.2, 42, L.k, 4.6); sh(V(WX, 0, -4), 20); }, [[.2, 'pop', .4], [.5, 'pop', .4], [.8, 'pop', .4], [1.05, 'pop', .4]]);
// 33 · «Dieses Jahr habe ich Mama»: el cartel HUND? BITTE BITTE! delante de mamá
shot(53.18, 'W', null, L => { use('WZ'); inside(.8, 40); const m = mamaSofa(L, {}, { expr: 'bored', eyes: 'half', bags: .6 }); const c = put(ich, WX + 1.6, 0, -2.4, -.6);
  actuar(c, L.lt, [[0, { aLx: 2.7, aRx: 2.7, aLz: .25, aRz: .25, aLe: .1, aRe: .1 }]], { T: L.T, extra: { crouch: Math.abs(Math.sin(L.T * 7)) * .08 } }); cara(c, L.T, { expr: 'happy' });
  const sp_ = hp(c); show(SCHILD, sp_.x, 7.4 + Math.abs(Math.sin(L.T * 7)) * .2, sp_.z + .3, -.6, 1);
  cm([WX + 1.2, 5.6, 9.6, WX + .6, 5.0, -4, 50], [WX + 1.0, 5.4, 8.4, WX + .6, 5.0, -4, 48], L.k); sh(V(WX, 0, -3), 20); }, [[.05, 'paper', .55], [.6, 'jump_small', .4]]);
// 34 · «zweitausendmal gefragt:»: asomo con el cartel por detrás del sofá (×2000)
shot(54.43, 'Z', null, L => { use('WZ'); inside(.8, 40); const m = mamaSofa(L, { headX: .5 }, { expr: 'tired', eyes: 'half', bags: 1 }); const pop = Math.abs(Math.sin(L.T * 5)); const c = put(ich, WX + 3.2, 1.2 + pop * 1.6, -9.4, 0);
  applyPose(c, { aLx: 2.7, aRx: 2.7, aLe: .1, aRe: .1 }); cara(c, L.T, { expr: 'joy' }); show(SCHILD, WX + 3.2, 6.6 + pop * 1.6, -9.0, 0, .9);
  badge('big', '×2000', W / 2, H * .17, (L.lt - .1) * 3, 1, 1.1);
  cm([WX + 1.4, 6.0, 9, WX + 1, 4.6, -6, 48], [WX + 1.2, 6.2, 7.6, WX + 1, 4.6, -6, 46], L.k); sh(V(WX, 0, -5), 20); }, [[.05, 'count', .5], [.4, 'boing_metal', .3], [.9, 'jump_small', .4]]);
// 35 · «„Willst du nicht eigentlich auch einen Hund?“»: ojitos de cachorro
shot(56.06, 'C', null, L => { use('WZ'); inside(.8, 40); const c = put(ich, WX + 1.6, 0, -2, -.9); actuar(c, L.lt, [[0, { ...GEST.hold, aLx: 1.6, aRx: 1.6, aLz: -.4, aRz: -.4, aLe: 1.9, aRe: 1.9, headZ: .25, headX: -.15 }]], { T: L.T });
  talk(c, L.T, 56, 57.8, 'love', { eyes: 'up', blush: 1 }); onFace(c, 5.4, .3, -1, 42, L.k, 4.8); sh(V(WX, 0, -3), 20); }, [[.05, 'sparkle', .45], [1.0, 'aah', .35]]);
// 36 · «Jedes Mal sagte sie „Nein“.»: mamá, agotada: Nein. Cada «Nein» es una mentira: el contador baja
shot(57.79, 'S', null, L => { use('WZ'); inside(.8, 40); const m = mamaSofa(L, { headX: .2, headY: .3 }, { expr: 'tired', eyes: 'half', bags: 1, mouth: L.lt > 1.4 ? 'talk' : 'flat' });
  bubble(m, 'Nein.', (L.lt - 1.4) * 3, 1.8); cntDrop(m, L.lt, 3, [.5, 1.45], { sc: .7 });
  onFace(m, 6.6, .2, 1.8, 42, L.k, 5.8); sh(V(WX, 0, -5), 20); }, [[.5, 'tick_down', .55], [1.0, 'sigh', .5], [1.45, 'tick_down', .55]]);
// 37 · «Am zweiten Februar war ihre letzte Lüge weg.»: su contador llega a 0 (2. FEBRUAR)
shot(59.54, 'C', null, L => { use('WZ'); inside(.8, 40); const m = mamaSofa(L, { headX: .45, aRx: 1.9, aRe: 2.3, aRz: -.4 }, { expr: 'tired', eyes: 'closed', bags: 1 });
  badge('tag', '2. FEBRUAR', W / 2, H * .12, L.lt * 3); cntDrop(m, L.lt, 1, [2.0], { sc: .8, dy: 1.3 });
  onFace(m, 6.8, .2, -1.6, 44, L.k, 5.8); sh(V(WX, 0, -5), 20); }, [[.05, 'pages', .5], [1.0, 'clock_tick', .4], [2.0, 'tick_down', .7]]);
// 38 · «Am dritten Februar hatten wir einen Hund.»: salto de alegría con el cachorro (3. FEBRUAR)
shot(62.09, 'W', null, L => { use('WZ'); inside(.8, 40); const m = mamaSofa(L, { headX: .1, aLx: .6, aRx: .6 }, { expr: 'smile', eyes: 'half', bags: .8 }); cnt(m, 0, 1, { sc: .5 });
  put(ich, WX + 1.6, 0, -.6, -.4); saltar(ich, L.lt % .9, .05, { h: 1.6, dur: .5, base: [WX + 1.6, 0, -.6] }); cara(ich, L.T, { expr: 'joy', eyes: 'happy', mouth: 'laugh' });
  const d = dogAt(KR, WX + 4.6, 0, .6, -.8, .9); d.pose(L.T, { hop: 1, wag: 24 }); badge('tag', '3. FEBRUAR', W / 2, H * .12, L.lt * 3);
  cm([WX + 2.2, 4.8, 13.4, WX + 1.6, 3.4, -1, 48], [WX + 2.6, 4.6, 12, WX + 1.8, 3.4, -1, 46], L.k); sh(V(WX, 0, -2), 20); }, [[.05, 'cheer', .45], [.3, 'bark', .6], [.9, 'jump_small', .45], [1.4, 'bark', .5]]);
// 39 · «Krümel. Dann war Silvester.»: Krümel con gorrito de fiesta en el escalón de casa; fuegos en el cielo
shot(64.2, 'Z', null, L => { street(); FWON = Object.assign(V(10, 0, -60), { spread: 140, h: 70 }); const p = LH(HOME, HOME.dx + .8, 0, HOME.F + 1.3); const d = dogAt(KR, p.x, .45, p.z, HOME.ry + .3, 1); d.hat.visible = true; d.pose(L.T, { wag: 20, headX: -.25 });
  badge('big', 'KRÜMEL', W / 2, H * .2, L.lt * 4, clamp(1 - (L.lt - .45) * 5), .9); badge('tag', 'SILVESTER', W / 2, H * .12, (L.lt - .5) * 3);
  const c = LH(HOME, HOME.dx + .6, 0, HOME.F + 9.4); cam([c.x, 3.0, c.z], [p.x, 2.6, p.z], 42); warmAt(LH(HOME, HOME.dx, 4.4, HOME.F + 1.4), 60); sh(p, 15); }, [[.05, 'bark', .6], [.5, 'firework', .7], [1.1, 'party_horn', .45]]);
// 40 · «Kurz nach elf schaute ich raus in den Schnee»: yo en la ventana (desde fuera del cristal, entre la escarcha) 23:07
shot(65.74, 'S', null, L => { use('WZ'); inside(.6, 30); const c = put(ich, WX - 3, 2.6, -11.2, PI); applyPose(c, { aLx: 1.4, aRx: 1.4, aLe: 1.2, aRe: 1.2, aLz: -.2, aRz: -.2, headY: Math.sin(L.T * 1.4) * .25 }); cara(c, L.T, { expr: 'worried', eyes: Math.sin(L.T * 1.4) > 0 ? 'side_l' : 'side_r' });
  badge('tag', '23:07', W / 2, H * .12, L.lt * 3);
  cm([WX - 3.2, 6.2, -13.5, WX - 3, 5.8, -8, 48], [WX - 3.1, 6.0, -13.4, WX - 3, 5.8, -8, 46], L.k); grade.uniforms.vig.value = .7; sh(V(WX, 0, -10), 20); }, [[.05, 'wind', .55], [.8, 'clock_tick', .45]]);
// 41 · «– und da stand er.» (zoom lento): al otro lado de la calle, bajo la farola, quieto, mirando nuestra casa
shot(67.77, 'C', 'slow', L => { street(1.3); scene.fog.density = .0024; const c = put(sam, 8.4, .3, 9.4, -PI / 2); applyPose(c, { aRx: .1, headY: .05 }); grin(c, L.T); kofHand(c); warmAt(V(9.6, 9, 10), 90);
  const w = LH(HOME, -HOME.w / 3.2, 0, HOME.F + .6); cm([w.x, 4.4, w.z, 8.4, 6.6, 9.4, 34], [w.x + 2, 4.6, w.z - .4, 8.4, 7.2, 9.4, 26], L.k); sh(V(8, 0, 9), 20); }, [[.05, 'heartbeat', .7]]);
// 42 · «Mama sah ihn und wurde kreidebleich.»: mamá en la ventana; se le va el color de la cara
shot(68.92, 'W', null, L => { use('WZ'); inside(.6, 30); const m = put(mama, WX - 1.2, 0, -9.0, PI); const k = clamp((L.lt - .9) / 1.0);
  actuar(m, L.lt, [[0, { aLx: .4, aRx: .4 }], [.9, { ...GEST.hands_face, aLx: 1.6, aRx: 1.6 }, { dur: .4 }]], { T: L.T }); cara(m, L.T, { expr: k > .3 ? 'shock' : 'worried', skin: pale(m, k) });
  cm([WX - 1.3, 5.2, -13.4, WX - 1.2, 4.9, -8, 46], [WX - 1.3, 5.2, -13.3, WX - 1.2, 4.9, -8, 42], L.k); grade.uniforms.vig.value = .7; sh(V(WX, 0, -10), 20); }, [[.1, 'gasp_f', .6], [.9, 'freeze', .5]]);
// 43 · «Ihre Zahl stand auf null.»: desde detrás de mamá: su contador, en rojo, parpadea en 0
shot(71.13, 'C', null, L => { use('WZ'); inside(.6, 30); const m = put(mama, WX - 1.2, 0, -11.0, PI); applyPose(m, { ...GEST.hands_face, aLx: 1.6, aRx: 1.6 }); cara(m, L.T, { expr: 'shock', skin: pale(m, 1) });
  cnt(m, 0, 1, { sc: 1.15, pop: (L.lt % .5) < .12 ? .05 : -1, dy: 1.7 });
  cm([WX + 1.4, 7.4, -4.4, WX - 1.4, 6.4, -12, 46], [WX + 1.0, 7.2, -5.4, WX - 1.4, 6.4, -12, 44], L.k); sh(V(WX, 0, -10), 20); }, [[.05, 'alarm_soft', .45], [.6, 'tick_hollow', .5]]);
// 44 · «Und schuld war ich.»: yo, cabizbajo
shot(72.66, 'S', null, L => { use('WZ'); inside(.6, 30); const c = put(ich, WX + 1.8, 0, -8, PI * .82); actuar(c, L.lt, [[0, { ...GEST.slump, headX: .22 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', eyes: 'down' });
  onFace(c, 5.6, .3, .8, 42, L.k, 4.8); sh(V(WX, 0, -8), 20); }, [[.1, 'sad_tone', .55]]);
// 45 · «Zuerst klingelte der Sammler beim Nachbarn.»: cruza hacia la casa de Kowalski y llama
shot(73.92, 'W', null, L => { street(); const d = LH(KOWH, KOWH.dx, 0, KOWH.F + 2.8), s0 = V(-3, 0, -4); const ry = faceTo(s0, d); const r = caminar(sam, L.lt, { x: s0.x, z: s0.z, ry, speed: 4.6, stopAt: 1.4, T: L.T, stride: 1.2 }); grin(sam, L.T); kofHand(sam);
  cm([6, 5.6, 6.4, -9, 3.6, -11, 50], [5, 5.2, 4.4, -10, 3.6, -11.6, 50], L.k); sh(V(-8, 0, -10), 25); }, [[.05, 'steps_snow', .6], [.7, 'steps_snow', .5], [1.7, 'door_bell', .7]]);
// 46 · «Herr Kowalski hatte sich das ganze Jahr»: él en su puerta, orgulloso, contador DORADO con un 1
shot(75.88, 'S', null, L => { street(); KOWH.door.rotation.y = 1.4; const c = inDoor(kow, KOWH, 0, 0); actuar(c, L.lt, [[0, GEST.cross]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); cnt(c, 1, clamp(L.lt * 3), { gold: true, sc: .8 });
  badge('tag', 'HERR KOWALSKI', W / 2, H * .12, L.lt * 3); warmAt(hp(c).add(V(0, 2, 2)), 50);
  camH(KOWH, [KOWH.dx - 1.0, 4.4, KOWH.F + 10.4], [KOWH.dx, 4.2, KOWH.F + 1], 46); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, [[.05, 'door_open', .5], [.5, 'ding_soft', .5]]);
// 47 · «eine Lüge aufgehoben.»: primer plano: se da golpecitos en la sien; su 1 dorado brilla
shot(77.70, 'C', null, L => { street(); KOWH.door.rotation.y = 1.4; const c = inDoor(kow, KOWH, 0, 0); actuar(c, L.lt, [[0, { ...GEST.think, aRx: 2.1, aRe: 2.5 }]], { T: L.T, extra: { aRe: 2.5 + Math.max(0, Math.sin(L.T * 12)) * .15 } }); cara(c, L.T, { expr: 'smug', eyes: 'wink', mouth: 'smirk' });
  cnt(c, 1, 1, { gold: true, sc: 1.0, pop: (L.lt % .6) - .1 }); warmAt(hp(c).add(V(0, 2, 2)), 50);
  onFace(c, 6.4, -.2, 1.6, 42, L.k, 5.6); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, [[.1, 'sparkle', .5], [.7, 'ding_soft', .4]]);
// 48 · «Seit Juli hatte er sie vor dem Spiegel geübt.»: en el baño, ensayando «Mein Auto!» ante el espejo (JULI)
shot(78.90, 'R', null, L => { use('BD'); inside(.8, 30); const a = put(kow, BX - .4, 0, .4, PI), b = put(kow2, BX - .4, 0, -8.4, 0);
  const P = { aRx: 1.6 + Math.sin(L.T * 8) * .15, aRz: -.1, aRe: .1, lean: .1, headX: -.1 }; actuar(a, L.lt, [[0, P]], { T: L.T }); actuar(b, L.lt, [[0, { ...P, aRx: 0, aLx: P.aRx, aLz: -.1, aLe: .1 }]], { T: L.T });
  const mo = Math.sin(L.T * 9) > 0 ? 'talk_wide' : 'talk'; cara(a, L.T, { expr: 'shout', mouth: mo }); cara(b, L.T, { expr: 'shout', mouth: mo });
  bubble(b, 'Mein Auto!', (L.lt - .3) * 3, 1.6); badge('tag', 'JULI', W / 2, H * .12, L.lt * 3);
  cm([BX + 1.6, 6.0, 3.0, BX - .4, 5.2, -8.4, 42], [BX + 1.5, 6.0, 2.6, BX - .4, 5.2, -8.4, 40], L.k); sh(V(BX, 0, -3), 20); }, [[.05, 'water_bloop', .35], [.4, 'shout_m', .4], [1.4, 'shout_m', .35]]);
// 49 · «„Was ist Ihnen hier am wertvollsten?“»: el Coleccionista en la puerta de Kowalski (desde el lado del porche)
shot(81.38, 'Z', null, L => { street(); KOWH.door.rotation.y = 1.4; const k = inDoor(kow, KOWH, .3, 0), c = atDoor(sam, KOWH, 4.4, -2.6);
  actuar(c, L.lt, [[0, { lean: .2, headX: .2, aLx: .05, aLe: .3 }]], { T: L.T }); talk(c, L.T, 81.3, 83, 'grin'); kofHand(c); applyPose(k, GEST.cross); cara(k, L.T, { expr: 'smug' }); cnt(k, 1, 1, { gold: true, sc: .6 });
  camH(KOWH, [KOWH.dx + 8, 10.5, KOWH.F + 17], [KOWH.dx, 4.6, KOWH.F + 2.2], 32); warmAt(LH(KOWH, KOWH.dx, 5, KOWH.F + 1.5), 25); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, [[.1, 'whisper', .45]]);
// 50 · «„Mein Auto!“, rief Herr Kowalski.»: señala su coche gritando; el 1 dorado cae a 0
shot(82.98, 'C', null, L => { street(); KOWH.door.rotation.y = 1.4; const k = inDoor(kow, KOWH, 0, 0); actuar(k, L.lt, [[0, GEST.cross], [.2, { aRx: 1.5, aRz: 1.0, aRe: .05, aLz: .1, aLe: .3 }, { dur: .2 }]], { T: L.T, extra: { headY: -.45 } });
  cara(k, L.T, { expr: 'shout', mouth: L.lt < 1.2 ? 'talk_wide' : 'smirk' }); cntDrop(k, L.lt, 1, [.38], { gold: L.lt < .38, sc: .75 }); badge('big', 'MEIN AUTO!', W / 2, H * .2, (L.lt - .2) * 3, 1, .9);
  cam([-4.2, 3.8, -15.6], [-13.4, 4.8, -12.8], 48); warmAt(hp(k).add(V(1, 2, 0)), 60); sh(V(-11, 0, -12), 18); }, [[.1, 'shout_m', .55], [.38, 'tick_down', .6], [1.2, 'car', .3]]);
// 51 · «Der Sammler lächelte:»: primer plano de la sonrisa
shot(84.95, 'S', null, L => { street(); const c = atDoor(sam, KOWH, 6.4, 0); actuar(c, L.lt, [[0, { lean: .26, headX: .15 }]], { T: L.T }); grin(c, L.T, { eyes: L.lt > .5 ? 'squint' : 'normal' }); kofHand(c);
  onFace(c, 5.0, -1.2, -.6, 46, L.k, 4.6); warmAt(hp(c).add(V(0, 1, 2)), 50); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, [[.1, 'creepy_ting', .55]]);
// 52 · «„Haben Sie mich gerade angelogen?“»: se inclina hacia él (ANGELOGEN?)
shot(85.91, 'Z', null, L => { street(); KOWH.door.rotation.y = 1.4; const k = inDoor(kow, KOWH, .3, 0), c = atDoor(sam, KOWH, 4.4, -2.6);
  actuar(c, L.lt, [[0, { lean: .2 }], [.3, { lean: .42, headX: .3, aLx: .1, aLe: .3 }, { dur: .5 }]], { T: L.T }); talk(c, L.T, 85.9, 87.4, 'grin'); kofHand(c); applyPose(k, { ...GEST.recoil }); cara(k, L.T, { expr: 'worried' });
  badge('red', 'ANGELOGEN?', W / 2, H * .18, (L.lt - .6) * 3, 1, .85);
  camH(KOWH, [KOWH.dx + 8, 10.5, KOWH.F + 17], [KOWH.dx, 4.6, KOWH.F + 2.2], 32); warmAt(LH(KOWH, KOWH.dx, 5, KOWH.F + 1.5), 25); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, [[.1, 'whisper', .5], [.6, 'stamp', .5]]);
// 53 · «Und Herr Kowalski hatte keine Lüge mehr.» (zoom lento): congelado, sudando, contador a 0
shot(87.44, 'C', 'slow', L => { street(); KOWH.door.rotation.y = 1.4; const k = inDoor(kow, KOWH, 0, 0); actuar(k, L.lt, [[0, { ...GEST.shock }]], { T: L.T, extra: shiver(L.T, .7) }); cara(k, L.T, { expr: 'terror' }); sweat(k, L.T); cnt(k, 0, 1, { sc: .8 });
  onFace(k, 7.4, -.2, .6, 44, L.k, 5.4); warmAt(hp(k).add(V(0, 1, 2)), 50); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, []);
// 54 · «„…Ja. Mein Dackel Bruno.“»: mira hacia abajo, a Bruno, a sus pies (BRUNO)
shot(89.62, 'W', null, L => { street(); KOWH.door.rotation.y = 1.4; const k = inDoor(kow, KOWH, 0, 0); actuar(k, L.lt, [[0, { ...GEST.slump, headX: .55 }]], { T: L.T }); talk(k, L.T, 89.6, 91.1, 'sad', { eyes: 'cry' }); cnt(k, 0, 1, { sc: .6 });
  const p = LH(KOWH, KOWH.dx - 1.4, 0, KOWH.F + 2.0); const d = dogAt(BR, p.x, 0, p.z, KOWH.ry + .5, 1.05); d.pose(L.T, { wag: 10, headX: -.3 }); badge('tag', 'BRUNO', W / 2, H * .12, (L.lt - .5) * 3);
  camH(KOWH, [KOWH.dx + 1.4, 3.6, KOWH.F + 10.4], [KOWH.dx - .4, 3.4, KOWH.F + 1.4], 46); warmAt(LH(KOWH, KOWH.dx, 4, KOWH.F + 2), 60); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, [[.05, 'gulp', .5], [.6, 'bark', .35]]);
// 55 · «Klick. Denn eine Lüge reicht nie.»: Bruno vuela al maletín; la tapa se cierra (FALLE!)
shot(91.08, 'C', null, L => { street(); const base = LH(KOWH, KOWH.dx + .4, 0, KOWH.F + 4.6); const k = kofAt(base.x, 2.0, base.z, KOWH.ry, 1.1); k.open(1 - clamp((L.lt - .16) / .1));
  const fly = clamp((L.lt + .1) / .28), p0 = LH(KOWH, KOWH.dx - 1.4, 0, KOWH.F + 2.0); if (fly < 1) { const d = dogAt(BR, lerp(p0.x, base.x, fly), lerp(0, 1.2, fly) + Math.sin(fly * PI) * 2, lerp(p0.z, base.z, fly), L.T * 8, lerp(1, .2, fly)); d.pose(L.T, { open: .5 }); }
  if (L.lt > .16 && L.lt < .5) sparks(V(base.x, 1.2, base.z), .16, L.T, 20, .6); badge('red', 'FALLE!', W / 2, H * .2, (L.lt - .7) * 3, 1, 1);
  const c = LH(KOWH, KOWH.dx + 5.4, 0, KOWH.F + 9.4); cam([c.x, 4.2, c.z], [base.x, 1.6, base.z], 42); sh(base, 15); }, [[.02, 'bark', .5], [.17, 'lid_click', .9], [.2, 'magic_hit', .5], [.75, 'stamp', .5]]);
// 56 · «Der Sammler fragt einfach nochmal.»: levanta el dedo, sonriendo: ?  ?
shot(93.19, 'W', null, L => { street(); const c = atDoor(sam, KOWH, 6.4, 0); actuar(c, L.lt, [[0, { aLx: 2.0, aLe: 1.2, aLz: .2, lean: .15 }]], { T: L.T, extra: { aLz: .2 + Math.sin(L.T * 10) * .15 } }); talk(c, L.T, 93.1, 94.9, 'grin'); kofHand(c);
  badge('q', '?', W * .3, H * .22, (L.lt - .3) * 3, 1, .8); badge('q', '?', W * .7, H * .2, (L.lt - .8) * 3, 1, .8);
  onFace(c, 5.0, -1.0, .6, 48, L.k, 4.6); warmAt(hp(c).add(V(0, 1, 2)), 50); sh(LH(KOWH, KOWH.dx, 0, KOWH.F), 15); }, [[.3, 'pop', .4], [.8, 'pop', .4], [1.2, 'evil_laugh', .3]]);
// 57 · «Herr Kowalski stand allein im Schnee.»: plano alto: solo en su jardín; el Coleccionista se aleja
shot(94.88, 'S', null, L => { street(1.3); const k = putH(kow, KOWH, KOWH.dx, KOWH.F + 2.4, 0, 0); actuar(k, L.lt, [[0, { ...GEST.slump }]], { T: L.T }); cara(k, L.T, { expr: 'sad', eyes: 'cry' }); attach(LEINE, k.aR.hand, [0, -.4, .2], [0, 0, 0], .45);
  caminar(sam, L.lt, { x: -2, z: -18, ry: PI, speed: 2.2, T: L.T, stride: 1.2 }); grin(sam, L.T); kofHand(sam);
  cm([-3.4, 11, -6.4, -12.6, 2.6, -13.1, 46], [-3.8, 10.4, -7, -12.6, 2.6, -13.1, 46], L.k); sh(V(-8, 0, -14), 30); }, [[.05, 'wind', .6], [.6, 'steps_snow', .4]]);
// 58 · «Mit einer leeren Leine.»: la correa vacía colgando de su mano
shot(96.72, 'C', null, L => { street(1.3); const k = putH(kow, KOWH, KOWH.dx, KOWH.F + 2.4, 0, 0); applyPose(k, { ...GEST.slump, aRx: .5, aRe: .4 }); cara(k, L.T, { expr: 'sad' });
  const l = attach(LEINE, k.aR.hand, [0, -.4, .2], [Math.sin(L.T * 2) * .12, 0, Math.sin(L.T * 1.5) * .1], .45); const lp = wpos(LEINE);
  cam([lp.x + 3.4, lp.y - .4, lp.z + 1.6], [lp.x, lp.y - 1.1, lp.z], 46); sh(lp, 10); }, [[.1, 'chain_rattle', .4], [.5, 'sad_tone', .5]]);
// ===== Planos 59-89 (97,9 – 148 s): llama a nuestra puerta, «Mein Sohn», el 10 sobre su cabeza, la cuenta atrás =====
// en nuestra puerta: mamá en el umbral, yo delante de ella, el Coleccionista abajo (apartado a un lado para que se nos vea)
function ourDoor(o = {}) { street(); HOME.door.rotation.y = 1.4; const m = inDoor(mama, HOME, o.ms ?? .5, 0); const c = putH(ich, HOME, HOME.dx + (o.cs ?? -.7), HOME.F + (o.cz ?? 2.1), 0, o.cr ?? 0);
  const s = atDoor(sam, HOME, o.sd ?? 4.6, o.ss ?? -2.4); kofHand(s); warmAt(LH(HOME, HOME.dx, 5, HOME.F + 2), 28); sh(LH(HOME, HOME.dx, 0, HOME.F + 2), 18); return { m, c, s }; }
const HIGH = (Hh) => camH(Hh, [Hh.dx + 8, 10.5, Hh.F + 17], [Hh.dx, 4.4, Hh.F + 2.2], 32);
const samClose = (s, L, d0 = 5.0, d1 = 4.5, side = -.6, fov = 46) => onFace(s, d0, -1.1, side, fov, L.k, d1);

// 59 · «Dann klingelte es bei uns.»: el Coleccionista en nuestro porche; las ventanas encendidas
shot(97.89, 'S', null, L => { street(); const s = putH(sam, HOME, HOME.dx + .05, HOME.F + 2.4, 0, PI); kofHand(s); grin(s, L.T);
  actuar(s, L.lt, [[0, { aLx: .3 }], [.2, { aLx: 1.25, aLz: .05, aLe: .3, lean: .16 }, { dur: .2 }]], { T: L.T }); HOME.btn.material.emissiveIntensity = .8 + clamp((L.lt - .35) * 4) * 3;
  camH(HOME, [HOME.dx + 12.5, 5.6, HOME.F + 2.6], [HOME.dx + .6, 4.6, HOME.F + 2.2], 42); warmAt(LH(HOME, HOME.dx, 5, HOME.F + 2), 40); sh(LH(HOME, HOME.dx, 0, HOME.F), 18); }, [[.38, 'door_bell', .9], [1.0, 'heartbeat', .5]]);
// 60 · «Mama hielt meine Hand.»: las dos manos, en el salón
shot(99.36, 'C', null, L => { use('WZ'); inside(.6, 30); const m = put(mama, WX + 4, 0, 6, PI), c = put(ich, WX + 6.3, 0, 6.2, PI);
  const k = clamp(L.lt * 2); applyPose(m, { aRx: .45 * k, aRz: .32 * k, aRe: .15, headX: .25, headY: -.3 * k }); applyPose(c, { aLx: .9 * k, aLz: .25 * k, aLe: .1, headX: -.3, headY: .3 * k }); cara(m, L.T, { expr: 'worried' }); cara(c, L.T, { expr: 'scared' });
  cm([WX + 5.1, 3.6, -5, WX + 5.1, 3.0, 6, 46], [WX + 5.1, 3.4, -4, WX + 5.1, 2.8, 6, 44], L.k); sh(V(WX + 5, 0, 6), 15); }, [[.1, 'cloth', .55], [.5, 'heartbeat', .55]]);
// 61 · «Ihre Finger waren eiskalt.»: mamá tiembla; frío azul
shot(100.51, 'S', null, L => { use('WZ'); inside(.55, 26); const m = put(mama, WX + 4, 0, 6, PI); actuar(m, L.lt, [[0, { ...GEST.hug_self }]], { T: L.T, extra: shiver(L.T, 1.4) }); cara(m, L.T, { expr: 'scared', skin: pale(m, .45) });
  TINT = 'rgba(120,170,255,.12)'; onFace(m, 5.6, -.2, 1.4, 42, L.k, 4.8); sh(V(WX + 4, 0, 6), 15); }, [[.05, 'shiver', .6], [.6, 'wind', .45]]);
// 62 · «„Was ist Ihnen hier am wertvollsten?“»: él, desde nuestro umbral, en contrapicado
shot(102.09, 'Z', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false;
  actuar(s, L.lt, [[0, { lean: .06, headX: .25, aLx: .2 }]], { T: L.T }); talk(s, L.T, 102, 103.6, 'grin'); samClose(s, L, 5.2, 4.6, .8, 48); }, [[.1, 'whisper', .5], [1.2, 'creepy_ting', .45]]);
// 63 · «Mama kämpfte,»: aprieta los labios, se tapa la boca; yo a su lado
shot(103.64, 'W', null, L => { const { m, c } = ourDoor(); s_hide();
  actuar(m, L.lt, [[0, { ...GEST.hands_face, aLx: 1.9, aRx: 1.9, aLe: 2.4, aRe: 2.4 }]], { T: L.T, extra: shiver(L.T, 1.2) }); cara(m, L.T, { expr: 'scared', mouth: 'wavy', skin: pale(m, .6) }); actuar(c, L.lt, [[0, { headY: -.5, headX: -.2 }]], { T: L.T }); cara(c, L.T, { expr: 'scared' });
  camH(HOME, [HOME.dx - 1.4, 4.6, HOME.F + 10.4], [HOME.dx, 4.2, HOME.F + 1.2], 46); }, [[.05, 'strain', .55], [.7, 'heartbeat', .55]]);
function s_hide() { sam.root.visible = false; KOF.g.visible = false; }
// 64 · «aber die Wahrheit rutschte einfach raus:» (zoom lento): la cara de mamá luchando
shot(105.0, 'C', 'slow', L => { const { m } = ourDoor(); s_hide(); ich.root.visible = false; actuar(m, L.lt, [[0, { aLx: .7, aRx: .7, aLe: 1.2, aRe: 1.2, headX: -.05 }]], { T: L.T, extra: shiver(L.T, 1.5) });
  cara(m, L.T, { expr: 'scared', mouth: L.lt % .5 < .25 ? 'wavy' : 'grimace', skin: pale(m, .6) }); onFace(m, 6.4, -.2, .4, 42, L.k, 4.4); }, []);
// 65 · «„Mein Sohn.“»: lo dice; me abraza por detrás
shot(106.79, 'S', null, L => { const { m, c } = ourDoor({ cz: 1.7, cs: .2, cr: 0 }); s_hide(); actuar(m, L.lt, [[0, { aLx: .55, aRx: .55, aLz: -.25, aRz: -.25, aLe: .2, aRe: .2, lean: .1, headX: .2 }]], { T: L.T });
  cara(m, L.T, { expr: 'cry', mouth: L.lt < .5 ? 'talk' : 'frown', skin: pale(m, .5) }); cara(c, L.T, { expr: 'shock' }); badge('big', 'MEIN SOHN', W / 2, H * .18, (L.lt - .05) * 3, 1, .9);
  camH(HOME, [HOME.dx + 1.6, 4.6, HOME.F + 9.6], [HOME.dx + .3, 4.2, HOME.F + 1.4], 44); }, [[.05, 'gasp_f', .5], [.3, 'sad_tone', .5]]);
// 66 · «Der Sammler klappte seinen Koffer auf.»: el maletín se abre hacia nosotros; luz violeta en nuestras caras
shot(107.98, 'Z', null, L => { const { m, c, s } = ourDoor({ cz: 2.0, cs: .2 }); const hp_ = LH(HOME, HOME.dx + .1, 0, HOME.F + 4.6); KOF.g.parent.remove(KOF.g); scene.add(KOF.g);
  const k = kofAt(hp_.x, 1.0, hp_.z, HOME.ry, 1.0); k.open(easeOut(clamp((L.lt - .15) / .5))); sam.root.visible = false;
  cara(c, L.T, { expr: 'shock' }); applyPose(c, GEST.recoil); cara(m, L.T, { expr: 'scared', skin: pale(m, .5) }); applyPose(m, { aLx: .5, aRx: .5, aLz: -.2, aRz: -.2, aLe: .3, aRe: .3, lean: .1 });
  camH(HOME, [HOME.dx + .4, 6.4, HOME.F + 9.6], [HOME.dx + .1, 3.0, HOME.F + 2], 44); }, [[.12, 'lid_click', .7], [.3, 'creepy_ting', .6], [.4, 'hum_low', .5]]);
// 67 · «Und genau in dem Moment sah ich es:» (zoom lento): mi cara, iluminada de violeta, los ojos se abren
shot(109.36, 'C', 'slow', L => { const { c } = ourDoor(); s_hide(); mama.root.visible = false; actuar(c, L.lt, [[0, { headX: -.3 }]], { T: L.T }); cara(c, L.T, { expr: L.lt > 1.3 ? 'gasp' : 'scared', eyes: L.lt > 1.3 ? 'wide' : 'up' });
  TINT = 'rgba(150,60,220,.12)'; onFace(c, 5.2, -.6, -.6, 42, L.k, 3.6); }, []);
// 68 · «Über seinem Kopf stand eine Zehn.»: contrapicado: SU contador, un 10 que nadie había visto
shot(111.35, 'Z', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; actuar(s, L.lt, [[0, { headX: .15 }]], { T: L.T }); grin(s, L.T);
  cnt(s, 10, (L.lt - .4) * 2, { sc: 1.0, dy: 1.6 }); samClose(s, L, 6.0, 5.4, .6, 50); }, [[.4, 'ding_reveal', .7], [.5, 'sparkle', .5]]);
// 69 · «Kein Mensch hatte ihm je eine Frage gestellt.»: recuerdo en sepia: la gente se aparta de él, nadie le habla (NIE GEFRAGT)
shot(113.24, 'S', null, L => { street(); grade.uniforms.sepia.value = .85; const r = caminar(sam, L.lt, { x: 0, z: -40, ry: 0, speed: 1.6, T: L.T, stride: 1.2 }); grin(sam, L.T); kofHand(sam); cnt(sam, 10, 1, { sc: .6 });
  [[LE[0], -4.6, -33, PI / 2 + .6], [LE[2], 4.4, -34, -PI / 2 - .6], [LE[5], -5, -38.5, PI / 2 + .3], [LE[6], 5.2, -39, -PI / 2]].forEach(([c, x, z, ry], i) => { put(c, x - Math.sign(x) * (1 - L.k) * .8, 0, z, ry); actuar(c, L.lt, [[0, GEST.recoil]], { T: L.T + i }); cara(c, L.T, { expr: 'scared', mouth: 'flat' }); });
  badge('tag', 'NIE GEFRAGT', W / 2, H * .12, L.lt * 3); cm([0, 5.2, r.z + 16, 0, 4.6, r.z, 48], [0, 5.0, r.z + 14, 0, 4.6, r.z, 46], L.k); sh(V(0, 0, r.z), 25); }, [[.05, 'film_roll', .4], [.5, 'murmur', .35], [1.5, 'steps_heavy', .4]]);
// 70 · «Also hatte er noch alle seine Lügen.»: su sonrisa enorme, el 10 brillando
shot(115.61, 'C', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; actuar(s, L.lt, [[0, { headX: .2, headZ: .1 }]], { T: L.T }); grin(s, L.T, { eyes: 'squint' });
  cnt(s, 10, 1, { sc: .9, dy: 1.6, pop: (L.lt % .8) - .1 }); samClose(s, L, 4.8, 4.4, -.8, 48); }, [[.1, 'evil_laugh', .4], [.8, 'ding_soft', .4]]);
// 71 · «Und ich bin nun mal das Kind, das immer nachfragt.»: mi sonrisa de lado, decidida
shot(117.37, 'W', null, L => { const { c } = ourDoor(); s_hide(); mama.root.visible = false; actuar(c, L.lt, [[0, { headX: -.25 }], [1.2, { ...GEST.fists, headX: -.25 }, { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' });
  TINT = 'rgba(150,60,220,.08)'; onFace(c, 5.4, .2, 1.4, 42, L.k, 4.6); }, [[.2, 'whoosh_up', .3], [1.2, 'fist', .5]]);
// 72 · «Also trat ich vor Mama und fragte:»: doy un paso al frente, entre ella y él (de lado)
shot(119.94, 'S', null, L => { const { m, c, s } = ourDoor({ cz: 1.6, cs: .4 }); const z = HOME.F + 1.6 + easeOut(clamp(L.lt / .6)) * .9; putH(c, HOME, HOME.dx + .4, z, 0, 0);
  actuar(c, L.lt, [[0, walkPose_(L.T)], [.6, { aLz: .4, aRz: .4, headX: -.35 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); grin(s, L.T); applyPose(m, GEST.recoil); cara(m, L.T, { expr: 'scared' });
  camH(HOME, [HOME.dx + 3.4, 3.8, HOME.F + 11], [HOME.dx + .4, 3.6, HOME.F + 2], 44); }, [[.05, 'steps', .6], [.5, 'steps', .5]]);
function walkPose_(T) { return { lLx: Math.sin(T * 9) * .5, lRx: -Math.sin(T * 9) * .5, aLx: -Math.sin(T * 9) * .4, aRx: Math.sin(T * 9) * .4 }; }
// 73 · «„Kann man Sie besiegen?“»: lo pregunto mirándolo desde abajo
shot(121.77, 'C', null, L => { const { c } = ourDoor({ cz: 2.6, cs: .4 }); mama.root.visible = false; actuar(c, L.lt, [[0, { headX: -.45, aLz: .3, aRz: .3 }]], { T: L.T }); talk(c, L.T, 121.7, 122.9, 'determined');
  camH(HOME, [HOME.dx + 2.6, 2.4, HOME.F + 7.4], [HOME.dx + .4, 3.4, HOME.F + 2.6], 42); }, [[.1, 'breath', .5]]);
// 74 · «Sein Lächeln blieb. „Nein.“»: sonríe; su 10 baja a 9
shot(122.86, 'Z', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; actuar(s, L.lt, [[0, { headX: .2 }]], { T: L.T }); talk(s, L.T, 123.9, 124.3, 'grin');
  cntDrop(s, L.lt, 10, [1.08], { sc: .9, dy: 1.6 }); samClose(s, L, 5.0, 4.6, .6, 48); }, [[.1, 'creepy_ting', .4], [1.08, 'tick_down', .7]]);
// 75 · «„Kann man Sie besiegen?“ – „Nein.“»: plano alto de la puerta: 9 -> 8
shot(124.33, 'S', null, L => { const { m, c, s } = ourDoor({ cz: 2.7, cs: .4 }); actuar(c, L.lt, [[0, { headX: -.4 }]], { T: L.T }); talk(c, L.T, 124.3, 125.1, 'determined'); talk(s, L.T, 125.3, 125.7, 'grin'); applyPose(m, GEST.hug_self); cara(m, L.T, { expr: 'scared' });
  cntDrop(s, L.lt, 9, [1.0], { sc: .7 }); HIGH(HOME); }, [[1.0, 'tick_down', .7]]);
// 76 · «Er versuchte, an mir vorbei nach Mama zu greifen.»: estira el brazo por encima de mí (de lado)
shot(125.70, 'W', null, L => { const { m, c, s } = ourDoor({ cz: 2.7, cs: .4, sd: 5.4, ss: 0 }); const k = easeInOut(clamp(L.lt / 1.2));
  actuar(s, L.lt, [[0, {}], [.2, { lean: .5, aLx: 1.7, aLe: .1, aLz: -.1, headX: .2 }, { dur: .8 }]], { T: L.T }); grin(s, L.T); cnt(s, 8, 1, { sc: .6 });
  applyPose(c, { aLz: 1.1, aRz: 1.1, aLe: .1, aRe: .1, headX: -.4, lean: -.1 }); cara(c, L.T, { expr: 'determined' }); applyPose(m, GEST.cower); cara(m, L.T, { expr: 'terror' });
  camH(HOME, [HOME.dx + 13, 5.6, HOME.F + 3.6], [HOME.dx, 5.0, HOME.F + 3.2], 46); }, [[.2, 'cloth', .6], [.8, 'gasp_f', .5]]);
// 77 · «Aber ich war dran.»: brazos abiertos, bloqueando, decidido
shot(127.94, 'C', null, L => { const { c } = ourDoor({ cz: 2.7, cs: .4 }); mama.root.visible = false; applyPose(c, { aLz: 1.35, aRz: 1.35, aLe: .1, aRe: .1, headX: -.3, crouch: .05 }); cara(c, L.T, { expr: 'determined', mouth: 'flat' });
  camH(HOME, [HOME.dx + 2.8, 2.8, HOME.F + 8.6], [HOME.dx + .4, 3.4, HOME.F + 2.7], 42); }, [[.05, 'stamp', .5]]);
// 78 · «„Kann man Sie besiegen?“ – „Nein.“»: 8 -> 7
shot(128.91, 'S', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; actuar(s, L.lt, [[0, { headX: .2, headZ: -.08 }]], { T: L.T }); talk(s, L.T, 129.7, 130.4, 'grin', { eyes: 'squint' });
  cntDrop(s, L.lt, 8, [.86], { sc: .9, dy: 1.6 }); samClose(s, L, 4.6, 4.3, -1.0, 46); }, [[.86, 'tick_down', .7]]);
// 79 · «Noch fünf.»: el contador baja rápido 7, 6, 5; la sonrisa tiembla
shot(130.41, 'C', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; applyPose(s, { headX: .2, headZ: Math.sin(L.T * 30) * .02 }); cara(s, L.T, { expr: 'neutral', mouth: L.lt % .3 < .15 ? 'grin' : 'smirk' });
  cntDrop(s, L.lt, 7, [.15, .4], { sc: 1.15, dy: 1.4 }); onFace(s, 4.0, -.6, 0, 50, L.k, 3.8); }, [[.15, 'tick_down', .6], [.4, 'tick_down', .6], [.6, 'glitch', .4]]);
// 80 · «Ich hörte nicht auf.»: pregunto una y otra vez: ? ? ?
shot(131.31, 'S', null, L => { const { c } = ourDoor({ cz: 2.7, cs: .4 }); mama.root.visible = false; actuar(c, L.lt, [[0, { headX: -.4, lean: .1, aRx: .6, aRe: .8 }]], { T: L.T, extra: { aRx: .6 + Math.sin(L.T * 12) * .2 } }); cara(c, L.T, { expr: 'determined', mouth: Math.sin(L.T * 18) > 0 ? 'talk_wide' : 'talk' });
  [[.25, .2, 0], [.75, .22, .35], [.5, .14, .7]].forEach(([x, y, t], i) => badge('q', '?', W * x, H * y, (L.lt - t) * 3, 1, .75)); onFace(c, 5.0, .2, 1.4, 42, L.k, 4.4); }, [[.05, 'pop', .4], [.35, 'pop', .4], [.7, 'pop', .4], [1.0, 'tick', .4]]);
// 81 · «Drei. Sein Lächeln verschwand.»: 3; la sonrisa se borra
shot(132.62, 'Z', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; applyPose(s, { headX: .15 }); cara(s, L.T, { expr: 'neutral', mouth: L.lt < .7 ? 'smirk' : 'flat', eyes: 'squint' });
  cntDrop(s, L.lt, 5, [.0, .05], { sc: 1.0, dy: 1.6 }); samClose(s, L, 4.8, 4.2, .9, 46); }, [[.02, 'tick_down', .7], [.8, 'creepy_ting', .4]]);
// 82 · «Zwei. Schweiß lief ihm übers Gesicht,»: 2; suda
shot(134.54, 'S', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; applyPose(s, { headX: .15, headZ: Math.sin(L.T * 24) * .02 }); cara(s, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(s, L.T, 3);
  cntDrop(s, L.lt, 3, [.02], { sc: 1.0, dy: 1.6 }); samClose(s, L, 4.4, 4.0, -.9, 46); }, [[.02, 'tick_down', .7], [.6, 'drip', .5], [1.4, 'drip', .4]]);
// 83 · «obwohl es schneite.»: de lado, la nevada cae sobre él y aun así suda
shot(136.69, 'W', null, L => { const { s } = ourDoor({ sd: 5.4, ss: 0, cz: 2.7, cs: .4 }); SNOWY = 1.8; mama.root.visible = false; applyPose(s, { headX: .1, aLz: .1, aRz: .1 }); cara(s, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(s, L.T, 3); cnt(s, 2, 1, { sc: .7 });
  cara(ich, L.T, { expr: 'determined' }); applyPose(ich, { headX: -.4 }); camH(HOME, [HOME.dx + 4, 7, HOME.F + 15], [HOME.dx - 1, 5.0, HOME.F + 4.2], 40); }, [[.05, 'wind', .6]]);
// 84 · «Eins.»: 1, enorme
shot(137.64, 'C', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; applyPose(s, { headX: .1, headZ: Math.sin(L.T * 30) * .03 }); cara(s, L.T, { expr: 'scared', mouth: 'grimace' }); sweat(s, L.T, 3);
  cntDrop(s, L.lt, 2, [.02], { sc: 1.3, dy: 1.3 }); onFace(s, 4.2, -.4, .2, 50, L.k, 3.9); }, [[.02, 'tick_down', .8], [.3, 'heartbeat', .6]]);
// 85 · «„Nein“, hauchte er. Seine letzte Lüge.» (zoom lento): lo susurra; 1 -> 0
shot(138.36, 'S', 'slow', L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; applyPose(s, { headX: .25, lean: .05 }); cara(s, L.T, { expr: 'sad', eyes: 'half', mouth: L.lt < .5 ? 'o' : 'frown' }); sweat(s, L.T, 3);
  cntDrop(s, L.lt, 1, [.25], { sc: 1.1, dy: 1.4 }); samClose(s, L, 5.2, 4.0, -.6, 46); }, [[.25, 'tick_down', .8], [.3, 'whisper', .5]]);
// 86 · «„Kann man Sie besiegen?“»: una vez más
shot(141.13, 'Z', null, L => { const { c } = ourDoor({ cz: 2.7, cs: .4 }); mama.root.visible = false; actuar(c, L.lt, [[0, { headX: -.45, lean: .08 }]], { T: L.T }); talk(c, L.T, 141.1, 142.2, 'determined');
  onFace(c, 4.8, -.2, 1.0, 42, L.k, 4.3); }, [[.1, 'breath', .5]]);
// 87 · «Er presste die Lippen zusammen, aber es kam trotzdem raus:» (zoom lento): aprieta, tiembla, se le hinchan las venas
shot(142.16, 'C', 'slow', L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; applyPose(s, { headX: .2, headZ: Math.sin(L.T * 34) * .05, headY: Math.sin(L.T * 22) * .04 }); cara(s, L.T, { expr: 'angry', mouth: L.lt % .3 < .15 ? 'wavy' : 'grimace' }); sweat(s, L.T, 3);
  cnt(s, 0, 1, { sc: 1.0, dy: 1.6 }); samClose(s, L, 5.0, 3.8, .7, 46); }, [[.2, 'strain', .6]]);
// 88 · «„…Ja.“»: se le escapa: JA
shot(145.04, 'Z', null, L => { const { s } = ourDoor({ sd: 6.4, ss: 0 }); ich.root.visible = false; mama.root.visible = false; applyPose(s, { headX: .3, lean: -.05 }); cara(s, L.T, { expr: 'shock', mouth: L.lt < .35 ? 'o' : 'frown' }); cnt(s, 0, 1, { sc: .9, dy: 1.6 });
  badge('green', 'JA', W / 2, H * .2, L.lt * 4, 1, 1.1); samClose(s, L, 4.6, 4.3, 0, 48); }, [[.02, 'magic_hit', .6]]);
// 89 · «„Wie?“ – „Wenn man… meinen Koffer umdreht.“»: mira de reojo su maletín
shot(145.80, 'W', null, L => { const { m, c, s } = ourDoor({ cz: 2.7, cs: .4, sd: 4.8, ss: -2.0 }); actuar(c, L.lt, [[0, { headX: -.4 }]], { T: L.T }); talk(c, L.T, 145.5, 146, 'determined'); bubble(c, 'Wie?', (.4 - L.lt) * 5 + 1, 1.6);
  actuar(s, L.lt, [[0, {}], [.3, { headY: .7, headX: .45, aRx: .5 }, { dur: .4 }]], { T: L.T }); talk(s, L.T, 146, 148, 'sad'); applyPose(m, GEST.hug_self); cara(m, L.T, { expr: 'worried' });
  badge3('q', '?', wpos(KOF.g).add(V(0, 2, 0)), (L.lt - .8) * 3, .6); HIGH(HOME); }, [[.3, 'hmm', .4], [1.0, 'briefcase', .5]]);
// ===== Planos 90-104 (148 s – final): el maletín volcado, todo vuelve, se va en la nieve, medianoche, el giro final =====
// 90 · «Ich riss ihm den Koffer aus der Hand»: salto y se lo arranco
shot(147.98, 'C', null, L => { const { m, c, s } = ourDoor({ cz: 3.0, cs: -.6, sd: 4.8, ss: -1.4 }); mama.root.visible = true;
  const grab = L.lt > .45; if (grab) { attach(KOF.g, c.aR.hand, [0, -.2, .4], [0, PI / 2, 0], .55); }
  saltar(c, L.lt, .05, { h: 1.8, dur: .45, base: [c.root.position.x, 0, c.root.position.z], extra: { aRx: 2.6, aRe: .2 } }); cara(c, L.T, { expr: 'determined', mouth: 'grimace' });
  actuar(s, L.lt, [[0, {}], [.45, { ...GEST.recoil }, { dur: .3 }]], { T: L.T }); cara(s, L.T, { expr: 'shock' }); cnt(s, 0, 1, { sc: .55 }); applyPose(m, GEST.hands_face); cara(m, L.T, { expr: 'shock' });
  camH(HOME, [HOME.dx + 12, 6.0, HOME.F + 8], [HOME.dx - .6, 4.4, HOME.F + 3], 40); }, [[.05, 'jump', .5], [.45, 'tug', .7], [.55, 'briefcase', .6]]);
// 91 · «und kippte ihn aus.»: lo pongo boca abajo: se abre y sale una explosión de luz
shot(149.36, 'F', null, L => { street(); const p = LH(HOME, HOME.dx - .6, 0, HOME.F + 3.4); const flip = easeOut(clamp(L.lt / .3));
  const k = kofAt(p.x, 3.2, p.z, HOME.ry, 1.2); KOF.g.rotation.z = flip * PI; k.open(clamp((L.lt - .3) * 4));
  if (L.lt > .35) { sparks(V(p.x, 2.0, p.z), .35, L.T, 30, 2.2); orbs(V(p.x, 2, p.z), (i, r) => V(p.x + (r() - .5) * 40, 10 + r() * 10, p.z - 10 - r() * 60), .35, L.T, 14, .9); }
  grade.uniforms.flash.value = Math.max(0, 1 - Math.abs(L.lt - .45) * 4) * .7; warmAt(V(p.x, 4, p.z), 80); WARM.color.setHex(0xc890ff);
  camH(HOME, [HOME.dx - .6, 2.0, HOME.F + 11], [HOME.dx - .6, 3.6, HOME.F + 3.4], 44); sh(p, 15); }, [[.1, 'whoosh_up', .4], [.35, 'explosion', .6], [.4, 'magic_hit', .7], [.6, 'sparkle', .6]]);
// 92 · «Und die ganze Straße entlang kam alles zurück.»: vista aérea: luces que vuelan a las casas y las ventanas apagadas se encienden
shot(150.61, 'Z', null, L => { street(); WARM.color.setHex(0xffb868); const order = [GA.L[3], GA.R[4], GA.L[6], ...DARKH]; order.forEach((Hh, i) => houseDark(Hh, 1 - clamp((L.lt - .4 - i * .22) * 3)));
  orbs(V(-10, 3, 6), (i, r) => { const Hh = order[i % order.length]; return LH(Hh, 0, 8, Hh.F); }, .0, L.T, 14, 1.4);
  cm([0, 48, 26, 0, 0, -50, 50], [0, 42, 14, 0, 0, -60, 48], L.k); sh(V(0, 0, -40), 90); }, [[.05, 'magic_hit', .5], [.6, 'switch', .5], [1.0, 'switch', .5], [1.4, 'switch', .5], [1.8, 'ding_reveal', .5]]);
// 93 · «Bruno landete Herrn Kowalski direkt in den Armen.»: Bruno cae del cielo a sus brazos; ¡alegría!
shot(153.40, 'S', null, L => { street(); const k = putH(kow, KOWH, KOWH.dx, KOWH.F + 2.6, 0, 0); actuar(k, L.lt, [[0, { aLx: 1.6, aRx: 1.6, aLz: .3, aRz: .3, aLe: .2, aRe: .2, headX: -.35 }], [.6, { aLx: 1.3, aRx: 1.3, aLz: -.3, aRz: -.3, aLe: 1.4, aRe: 1.4, headX: .15 }, { dur: .3 }]], { T: L.T });
  cara(k, L.T, { expr: L.lt < .6 ? 'gasp' : 'joy', eyes: L.lt < .6 ? 'wide' : 'happy', mouth: L.lt < .6 ? 'o' : 'laugh' }); const h = hp(k); const f = clamp(L.lt / .6);
  const d = dogAt(BR, h.x + 1.1, lerp(h.y + 9, h.y - 2.8, easeIn(f)), h.z, KOWH.ry, 1); d.pose(L.T, { wag: 26, tongue: true, headX: -.2 }); if (f >= 1) confetti(h, 154.0, L.T, 40);
  camH(KOWH, [KOWH.dx - 1.0, 4.6, KOWH.F + 11.6], [KOWH.dx, 5.0, KOWH.F + 2.6], 44); warmAt(h.clone().add(V(2, 2, 0)), 30); sh(h, 18); }, [[.1, 'whoosh_down', .4], [.6, 'thump', .5], [.7, 'bark', .7], [1.0, 'cheer', .45], [1.6, 'bark', .5]]);
// 94 · «Dann die Geige vom Bäcker.»: el panadero toca su violín delante de la panadería
shot(155.88, 'W', null, L => { street(); const Hh = BAKH; Hh.door.rotation.y = 1.4; const c = putH(bk, Hh, Hh.dx, Hh.F + 2.2, 0, 0);
  applyPose(c, { aLx: 1.9, aLz: -.3, aLe: 1.7, aRx: 1.4, aRz: -.6, aRe: 1.4 + Math.sin(L.T * 9) * .35, headZ: .3, headX: .1 }); cara(c, L.T, { expr: 'relief', eyes: 'closed', mouth: 'smile' });
  attach(GEIGE, c.aL.hand, [0, -.3, .8], [-.5, 1.2, .3], .8);
  onFace(c, 9.0, .2, 1.8, 46, L.k, 8.0); warmAt(hp(c).add(V(0, 2, 3)), 35); sh(LH(Hh, Hh.dx, 0, Hh.F + 2), 18); }, [[.05, 'strings', .6], [.8, 'strings', .5]]);
// 95 · «Dann eine ganze Familie, die schon vor meiner Geburt verschwunden war.»: aparecen delante de su casa, que se vuelve a encender
shot(157.45, 'S', null, L => { street(); const Hh = FAMH; houseDark(Hh, 1 - clamp((L.lt - .3) * 2)); const X = [-2.8, -.9, 1.0, 2.8];
  FA.forEach((c, i) => { const k = clamp((L.lt - .2 - i * .18) * 2.5); putH(c, Hh, Hh.dx + X[i] - .6, Hh.F + 3.2, 0, 0); c.root.scale.setScalar((c.spec.scale || 1) * Math.max(.01, spring(k))); actuar(c, L.lt, [[0, {}], [1.6, GEST.cheer, { dur: .4 }]], { T: L.T + i }); cara(c, L.T + i, { expr: L.lt < 1.6 ? 'gasp' : 'joy', eyes: L.lt < 1.6 ? 'wide' : 'happy' }); if (k > 0 && k < .6) sparks(hp(c), L.lt, L.T, 8, .5); });
  camH(Hh, [Hh.dx - .6, 4.2, Hh.F + 19], [Hh.dx - .6, 3.0, Hh.F + 3.2], 44); warmAt(LH(Hh, Hh.dx, 5, Hh.F + 4), 30); sh(LH(Hh, Hh.dx, 0, Hh.F + 3), 18); }, [[.2, 'magic_hit', .5], [.4, 'sparkle', .5], [1.3, 'aah', .4], [2.4, 'cheer', .45]]);
// 96 · «Der Sammler drehte sich um und ging in den Schnee.»: se da la vuelta y se marcha, sin maletín, encogido
shot(160.83, 'W', null, L => { street(1.3); const r = caminar(sam, L.lt, { x: -1.5, z: 0, ry: PI, speed: 1.6, T: L.T, stride: 1.1, extra: { headX: .35, lean: .1 } }); cara(sam, L.T, { expr: 'sad', eyes: 'down' }); KOF.g.visible = false; cnt(sam, 0, 1, { sc: .6 });
  cm([1.4, 5.4, r.z + 12, -1.5, 4.4, r.z - 4, 46], [1.4, 5.6, r.z + 13, -1.5, 4.4, r.z - 4, 46], L.k); sh(V(-1, 0, r.z), 25); }, [[.05, 'steps_snow', .5], [.8, 'steps_snow', .45], [1.6, 'wind', .5]]);
// 97 · «Seitdem hat ihn niemand mehr gesehen.»: una figura diminuta que se pierde en la ventisca
shot(163.26, 'C', null, L => { street(1.6); scene.fog.density = .004 + L.k * .006; const r = caminar(sam, L.lt + 3, { x: -1.5, z: -40, ry: PI, speed: 1.6, T: L.T, stride: 1.1, extra: { headX: .35 } }); sam.root.visible = L.k < .85;
  cm([0, 4.2, -14, -1, 4, -60, 40], [0, 4.0, -16, -1, 4, -60, 40], L.k); sh(V(0, 0, -40), 30); }, [[.05, 'wind', .7], [1.2, 'bell_far', .45]]);
// 98 · «Um Mitternacht»: la torre marca las 00:00; fuegos artificiales
shot(165.15, 'F', null, L => { street(); clockAt(0, 0); FWON = Object.assign(V(0, 0, -340), { spread: 160, h: 60 }); badge('tag', '00:00', W / 2, H * .12, L.lt * 3);
  cm([0, 52, -276, 0, 61.6, -330, 46], [0, 53, -279, 0, 61.6, -330, 44], L.k); sh(V(0, 0, -300), 60); }, [[.02, 'bell_big', .8], [.4, 'firework', .7]]);
// 99 · «leuchtete über jedem Kopf wieder eine Zehn.»: en la calle, todos miran arriba y su contador vuelve a 10
shot(166.23, 'R', null, L => { street(); FWON = Object.assign(V(0, 0, -120), { spread: 140, h: 60 });
  const P = [[LE[1], -5.4, -60], [KI[0], -2, -58], [LE[4], 2.2, -59], [LE[7], 5.6, -61], [bk, -7.6, -66], [kow, 7.6, -66], [LE[5], -3.4, -67], [FA[0], 3.6, -68]];
  P.forEach(([c, x, z], i) => { put(c, x, 0, z, 0); actuar(c, L.lt, [[0, { headX: -.4 }], [.4 + i * .1, GEST.cheer, { dur: .3 }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'joy', eyes: 'happy', mouth: 'laugh' }); const t = .3 + i * .12; cnt(c, L.lt > t ? 10 : 0, 1, { sc: .5, pop: L.lt - t }); });
  if (L.lt > .3) dogAt(BR, 9.4, 0, -63, -.4, 1).pose(L.T, { hop: 1, wag: 26 });
  cm([0, 3.8, -45, 0, 5, -64, 50], [0, 4.4, -47, 0, 5.4, -64, 50], L.k); sh(V(0, 0, -62), 30); }, [[.3, 'pling', .5], [.6, 'pling', .5], [.9, 'pling', .5], [1.1, 'cheer', .5], [1.5, 'firework', .6]]);
// 100 · «Mama drückte mich ganz fest,»: el abrazo, en el salón
shot(168.17, 'S', null, L => { use('WZ'); inside(.8, 40); const m = put(mama, WX - .3, 0, -.4, .25), c = put(ich, WX + 1.6, 0, 1.0, -.15);
  const k = easeOut(clamp(L.lt * 2)); applyPose(m, { aLx: 1.2 * k, aRx: 1.2 * k, aLz: -.55 * k, aRz: -.55 * k, aLe: .6 * k, aRe: .6 * k, lean: .3 * k, crouch: .2 * k, headX: .1, headZ: .25 * k }); applyPose(c, { aLx: .9 * k, aRx: .9 * k, aLz: -.3 * k, aRz: -.3 * k, aLe: 1.2, aRe: 1.2, headZ: -.15 * k });
  cara(m, L.T, { expr: 'relief', eyes: 'closed', mouth: 'smile' }); cara(c, L.T, { expr: 'happy', eyes: 'happy' }); cnt(m, 10, 1, { sc: .6 });
  cm([WX + .8, 4.2, 10.4, WX + .6, 3.6, 0, 46], [WX + .8, 4.1, 9.4, WX + .6, 3.6, 0, 44], L.k); sh(V(WX, 0, 0), 20); }, [[.1, 'hug', .6], [.6, 'aah', .35]]);
// 101 · «und Krümel fing an zu bellen.»: Krümel, con su gorrito, ladra y salta
shot(169.57, 'C', null, L => { use('WZ'); inside(.8, 40); const d = dogAt(KR, WX + 4, 0, 3, -.5, 1); d.hat.visible = true; d.pose(L.T, { bark: 1, hop: 1, wag: 26 });
  const p = V(WX + 4, 2.2, 3); cam([p.x - 2.6, 3.2, p.z + 6.2], [p.x, 2.2, p.z], 44); sh(p, 15); }, [[.05, 'bark', .7], [.5, 'bark', .7], [1.0, 'bark', .6], [1.4, 'bark', .5]]);
// 102 · «„Sag mal, hast du eigentlich jemals gelogen?“»: mamá pregunta, sonriendo; su contador ya está en 10
shot(171.24, 'W', null, L => { use('WZ'); inside(.8, 40); const m = put(mama, WX + 1, 0, -1.2, .1); actuar(m, L.lt, [[0, { crouch: .25, lean: .15, headZ: .15, aLx: .5, aLe: .9 }]], { T: L.T }); talk(m, L.T, 171.2, 173.6, 'smile', { eyes: 'happy' }); cnt(m, 10, 1, { sc: .7 });
  onFace(m, 6.0, -.3, 1.4, 42, L.k, 5.2); sh(V(WX, 0, 0), 20); }, [[.1, 'hmm', .35]]);
// 103 · «„Nein.“»: lo digo... y mi contador baja de 10 a 9 (NEIN.)
shot(173.66, 'C', null, L => { use('WZ'); inside(.8, 40); const c = put(ich, WX + 1, 0, 1.4, PI + .25); actuar(c, L.lt, [[0, { headX: -.25 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: L.lt < .4 ? 'talk' : 'smile' });
  cntDrop(c, L.lt, 10, [.3], { sc: .9, dy: 1.6 }); badge('red', 'NEIN.', W / 2, H * .085, (L.lt - .05) * 3, 1, .9); onFace(c, 5.0, .2, -.8, 42, L.k, 4.6); sh(V(WX, 0, 0), 20); }, [[.3, 'tick_down', .7]]);
// 104 · «Meine erste Lüge des Jahres.»: guiño a cámara; el 9 sobre mi cabeza
shot(174.73, 'Z', null, L => { use('WZ'); inside(.8, 40); const c = put(ich, WX + 1, 0, 1.4, PI + .25); actuar(c, L.lt, [[0, { headX: -.2, headZ: -.12 }]], { T: L.T }); cara(c, L.T, { expr: 'wink', eyes: L.lt > .5 ? 'wink' : 'happy', mouth: 'smirk' });
  cnt(c, 9, 1, { sc: .9, dy: 1.6 }); onFace(c, 4.8, .2, .4, 42, L.k, 3.8); sh(V(WX, 0, 0), 20); }, [[.5, 'sparkle', .5], [.9, 'ding_soft', .4]]);
COVERS.push({ i: 67, k: .7, cam: () => {}, l2: '…UND ÜBER SEINEM KOPF STAND EINE ZEHN' });


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); } });
CUES.push({ t: 0, s: 'zoom_fast', g: .9 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
let COVER = null;
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD_.length = 0; s.fn(L);
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud'].includes(c.s) && T - c.t < .16) sh_ = 1 - (T - c.t) / .16; }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .25 * sh_; camera.position.y += (r() - .5) * .25 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.5; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, SNOWY ? 'nieve' : MODE === 'night' ? 'noche' : 'polvo', SNOWY ? SNOWY : MODE === 'in' ? .3 : .4);
  FW.pts.visible = !!FWON; if (FWON) FW.update(T, FWON, FWON.spread ?? 120, FWON.h ?? 90);
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
// portadas (sin spoilers)
function coverText(l1, l2, col) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * .115, 132, '#ffffff'], [l2, H * .195, 112, col]]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .92 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .22; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }
window.renderCover = v => { const C = COVERS[v], s = S[C.i], T = s.t0 + (s.t1 - s.t0) * C.k; COVER = C; renderShot(C.i, T, null, 0); COVER = null;
  octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H); coverText(C.l1 ?? 'IN DIESER STADT', C.l2, '#E2FD07'); };
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { renderer, composer, bloom, sun, grade, scene, camera };

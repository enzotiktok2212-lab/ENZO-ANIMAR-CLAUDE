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
//@@PLANOS@@

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

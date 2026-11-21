// Hände — 98 planos sincronizados con audio/words.json (1080×1920, 30 fps, 140,6 s).
// El camino (árbol caído → arroyo de 7 piedras → valla del poste roto) se siembra de día y se cobra de noche en la ventisca.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { tannengrund, wald, mensa, turnhalle, stube, busInnen, blizzard, snowFall, SNOWM, sign } from './hsets.js';
import { bus } from './pech.js';
import { makeIch, makePapa, makeOpa, makeMama, makeFinn, makeLehrerin, makeFahrer, makeMaedchen, makeKind } from './hcast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, actuar, mirar, caminar, saltar, shiver, luzCielo, viento, setViento, aire, bandada, camaraEnMano } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 140.61, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xdfeaff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x9aa4b8, 1.4); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.5); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 5; scene.add(sun, sun.target);
const rim = rimLight(scene);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 700 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-70, 140, 90)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
const WX = 1000, MX = 1400, TX = 1600, SX = 1800, BX = 2000;
const TG = tannengrund(scene), WD = wald(scene, WX), MS = mensa(scene, MX), TH = turnhalle(scene, TX), SB = stube(scene, SX), BI = busInnen(scene, BX);
const SETS = { TG: TG.G, WD: WD.g, MS: MS.g, TH: TH.g, SB: SB.g, BI: BI.g };
const winsOn = on => TG.WIN.forEach(L => L.forEach(p => p.visible = on));
const BUS = bus(scene, 0xf2b81a, 'SCHULBUS'); BUS.scale.setScalar(.82);
const TRUCK = (() => { const g = new THREE.Group(); scene.add(g); const b = mat(0xf4f4f4, { roughness: .5 }); box(7, 8, 16, b, .4, g, 0, 5.2, -2); box(7, 5, 5.6, mat(0x2a6ad8, { roughness: .4 }), .5, g, 0, 3.8, 9); box(6, 2.4, .1, mat(0x9fd8f8, { roughness: .05, emissive: 0x2a6a9a, emissiveIntensity: .25 }), .2, g, 0, 4.8, 11.85);
  const s = textPlane(10, 2.4, 500, 120, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); txt(c, 'UMZÜGE MEYER', w / 2, h / 2 + 2, 64, '#2a6ad8'); }); s.position.set(3.52, 6, -2); s.rotation.y = Math.PI / 2; g.add(s);
  for (const z of [-7, 7]) for (const x of [-3.2, 3.2]) { const w = cyl(1.2, 1.2, .8, mat(0x161618), 14, g, x, 1.2, z); w.rotation.z = Math.PI / 2; } box(6.6, .3, 4, mat(0x8a8a90, { metalness: .6 }), .05, g, 0, .9, -11.4); return g; })();
const BOXES = Array.from({ length: 4 }, (_, i) => box(1.8, 1.4, 1.6, mat(0xb8905a, { roughness: 1 }), .06, scene));
// ---------- reparto ----------
const ich = makeIch(scene), papa = makePapa(scene), opa = makeOpa(scene), mama = makeMama(scene), finn = makeFinn(scene), lehr = makeLehrerin(scene), fahrer = makeFahrer(scene), mad = makeMaedchen(scene);
const K = Array.from({ length: 20 }, (_, i) => makeKind(scene, i));
kitFace(ich, 'hero'); kitFace(papa, 'plain'); kitFace(opa, 'plain'); kitFace(mama, 'girl'); kitFace(finn, 'villain'); kitFace(lehr, 'girl'); kitFace(fahrer, 'plain'); kitFace(mad, 'girl');
K.forEach((c, i) => kitFace(c, ['kid', 'girl', 'plain', 'kid', 'girl', 'plain'][i % 6]));
const POOL = [ich, papa, opa, mama, finn, lehr, fahrer, mad, ...K];
// ---------- atrezo ----------
const PHONE = (() => { const g = new THREE.Group(); scene.add(g); box(.7, 1.3, .1, mat(0x1a1a1e, { metalness: .5 }), .06, g, 0, 0, 0); const scr = new THREE.Mesh(new THREE.PlaneGeometry(.6, 1.15), new THREE.MeshBasicMaterial({ map: null, toneMapped: false })); scr.position.z = .06; g.add(scr);
  const tex = (pct, red) => canvasTex2(64, 120, (c, w, h) => { c.fillStyle = '#0a0f1a'; c.fillRect(0, 0, w, h); c.strokeStyle = red ? '#ff3a3a' : '#ffffff'; c.lineWidth = 3; c.strokeRect(14, 44, 32, 18); c.fillRect(46, 49, 4, 8); c.fillStyle = red ? '#ff3a3a' : '#3ad86a'; c.fillRect(17, 47, 26 * pct, 12); });
  const T = { full: tex(.9, 0), low: tex(.1, 1) }; return { g, scr, T }; })();
function canvasTex2(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
const LIGHTS = Array.from({ length: 6 }, () => { const s = sphere(.18, new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), scene, 0, 0, 0, 8, 6); const l = new THREE.SpotLight(0xffffff, 0, 30, .5, .5, 1.2); scene.add(l, l.target); return { s, l }; });
const TRAY = (() => { const g = new THREE.Group(); scene.add(g); box(1.8, .1, 1.2, mat(0xd8323a, { roughness: .4 }), .05, g, 0, 0, 0); cyl(.42, .42, .08, mat(0xffffff), 16, g, -.4, .08, 0); sphere(.22, mat(0xe8a040), g, -.45, .2, -.05, 10, 8); return g; })();
const TRAYS2 = Array.from({ length: 5 }, (_, i) => { const g = TRAY.clone(); scene.add(g); g.children[0].material = mat([0x2a8a5a, 0xf2c23a, 0x6a4ad8, 0x2a8ad8, 0xd8323a][i]); return g; });
const BALL = sphere(.7, mat(0xd8323a, { roughness: .5 }), scene, 0, 0, 0, 16, 12);
const SPLASH = Array.from({ length: 10 }, () => sphere(.18, mat(0xd8f0ff, { transparent: true, opacity: .8, roughness: .1 }), scene, 0, 0, 0, 6, 5));
const BREATH = Array.from({ length: 6 }, () => sphere(.3, mat(0xffffff, { transparent: true, opacity: .4, roughness: 1 }), scene, 0, 0, 0, 8, 6));
const CURT = (() => { const g = new THREE.Group(); scene.add(g); for (const s of [-1, 1]) { const c = box(1.4, 2.6, .1, mat(0xf2e0b0, { roughness: 1 }), .05, g, s * .7, 0, 0); c.userData.s = s; } return g; })();
const PROPS = [BUS, TRUCK, ...BOXES, PHONE.g, ...LIGHTS.map(l => l.s), TRAY, ...TRAYS2, BALL, ...SPLASH, ...BREATH, CURT];
// ---------- ambiente ----------
const IBL = luzCielo(renderer, scene, sky.sky, .45); const AIR = aire(scene, 520); const BIRDS = bandada(scene, 9); viento(TG.G); viento(WD.g);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', SNOWY = 0, STORM = 0;
const lampsOn = v => { TG.lamps.forEach(b => b.material.emissiveIntensity = v); };
function day() { MODE = 'day'; setSky([.3, .55, .92], [.6, .78, .98], [.86, .92, 1]); hemi.intensity = 1.35; hemi.color.setRGB(.86, .92, 1); hemi.groundColor.setRGB(.7, .74, .82); sun.intensity = 2.4; sun.color.setRGB(1, .95, .88); rim.intensity = 1.2; scene.fog.color.setRGB(.86, .91, 1); scene.fog.density = .0016; bloom.strength = .24; lampsOn(.2); winsOn(false); SNOWM.emissive.setRGB(0, 0, 0); STORM = 0; }
function dusk() { MODE = 'dusk'; setSky([.24, .22, .5], [.9, .45, .38], [1, .62, .36]); hemi.intensity = .9; hemi.color.setRGB(.9, .72, .7); sun.intensity = 1.5; sun.color.setRGB(1, .58, .36); rim.intensity = 1.5; scene.fog.color.setRGB(.7, .5, .5); scene.fog.density = .0018; bloom.strength = .38; lampsOn(1.6); winsOn(true); SNOWM.emissive.setRGB(.05, .03, .06); STORM = 0; }
function night(f = .003) { MODE = 'night'; setSky([.01, .02, .07], [.04, .06, .16], [.08, .11, .24]); hemi.intensity = .55; hemi.color.setRGB(.5, .6, 1); hemi.groundColor.setRGB(.2, .25, .4); sun.intensity = .35; sun.color.setRGB(.6, .7, 1); rim.intensity = 1.6; scene.fog.color.setRGB(.05, .07, .16); scene.fog.density = f; bloom.strength = .5; lampsOn(2.4); winsOn(true); SNOWM.emissive.setRGB(.06, .08, .16); STORM = 0; }
// ventisca de noche: todo azul oscuro, la nieve brilla un poco y las personas son siluetas negras
function storm(f = .03, lvl = 1) { MODE = 'night'; setSky([.02, .03, .08], [.06, .08, .18], [.14, .18, .32]); hemi.intensity = .18; hemi.color.setRGB(.45, .55, 1); hemi.groundColor.setRGB(.1, .12, .25); sun.intensity = 0; rim.intensity = .5; scene.fog.color.setRGB(.13, .17, .33); scene.fog.density = f; bloom.strength = .45; lampsOn(0); winsOn(false); SNOWM.emissive.setRGB(.16 * lvl, .22 * lvl, .42 * lvl); STORM = 1; }
// ventisca de día (gris): niebla blanca densa
function whiteout(f = .02) { MODE = 'day'; setSky([.62, .66, .74], [.72, .75, .8], [.8, .82, .86]); hemi.intensity = 1.0; hemi.color.setRGB(.8, .84, .92); sun.intensity = .4; rim.intensity = .6; scene.fog.color.setRGB(.78, .8, .86); scene.fog.density = f; bloom.strength = .25; SNOWM.emissive.setRGB(0, 0, 0); STORM = 2; }
function inside(h = .9, s = .3) { MODE = 'in'; hemi.intensity = h; sun.intensity = s; bloom.strength = .38; scene.fog.density = .0002; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(p === BUS ? .82 : 1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  LIGHTS.forEach(l => l.l.intensity = 0); PHONE.scr.material.map = PHONE.T.full; PHONE.scr.material.color.setRGB(1, 1, 1); PHONE.scr.material.needsUpdate = true;
  for (const k in SETS) SETS[k].visible = false; TG.flakes.forEach(f => f.visible = false); WD.flakes.forEach(f => f.visible = false); WD.LAMP.userData.bulb.material.emissiveIntensity = .2; WD.EWIN.forEach(p => p.visible = false); EDGE_L.intensity = 0;
  grade.uniforms.vig.value = .42; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = .85; grade.uniforms.sepia.value = 0; day(); }
const EDGE_L = new THREE.PointLight(0xffc880, 0, 40, 1.4); scene.add(EDGE_L);
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + dy, h.z + fz * d - fx * side], [h.x, h.y - .3, h.z], fov); }
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
const handP = (ch, r = 1) => { ch.root.updateMatrixWorld(true); return (r ? ch.aR : ch.aL).hand.getWorldPosition(V(0, 0, 0)); };
// ojos según la emoción, cambiando con el tiempo (párpados caídos, miradas de lado, ojos de felicidad…), nunca siempre abiertos del todo
function ojos(expr, T, sd) { const n = Math.sin(T * .9 + sd) * .55 + Math.sin(T * 2.3 + sd * 2.1) * .45;
  switch (expr) {
    case 'neutral': case 'talk': case undefined: return n > .25 ? 'half' : n < -.55 ? (sd % 2 ? 'side_l' : 'side_r') : 'normal';
    case 'sad': case 'lookdown': return n > -.1 ? 'half' : 'down';
    case 'happy': case 'smile': case 'love': case 'relief': return n > -.3 ? 'happy' : 'half';
    case 'joy': case 'grin': return 'happy';
    case 'worried': return n > .45 ? 'side_l' : n < -.45 ? 'down' : 'worried';
    case 'scared': return n > .3 ? 'worried' : 'scared';
    case 'shock': case 'gasp': return n > -.2 ? 'wide' : 'scared';
    case 'determined': return n > .5 ? 'squint' : 'angry';
    case 'angry': case 'shout': case 'furious': return n > .55 ? 'squint' : 'angry';
    case 'confused': return n > 0 ? 'squint' : 'side_r';
    case 'sus': return n > .2 ? 'squint' : 'side_l';
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk') => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat' });
const SIT = { crouch: .2, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aLz: .15, aRz: .15 };
const sit = (ch, x, y, z, ry, extra = {}) => { const s = ch.spec.scale || 1; put(ch, x, y - (2.05 - .2) * s + .08, z, ry); applyPose(ch, { ...SIT, ...extra }); };
const breath = (ch, T, n = 4) => { const h = hp(ch), a = ch.root.rotation.y; BREATH.forEach((s, i) => { if (i >= n) return; const k = ((T * .8 + i / n) % 1); s.visible = true; s.position.set(h.x + Math.sin(a) * (1 + k * 1.6), h.y + .45 + k * .5, h.z + Math.cos(a) * (1 + k * 1.6)); s.scale.setScalar(.4 + k * 1.2); s.material.opacity = .35 * (1 - k); }); };
// fila de la mano (en fila india, cada uno da la mano al de detrás). ord[0] va delante.
const HOLD = { aRx: -.55, aRz: .12, aRe: .1, aLx: .55, aLz: .1, aLe: .15 };
function fila(ord, lt, T, o) { const sp = o.sp ?? 2.8, ry = o.ry ?? 0, P = [];
  ord.forEach((c, j) => { const bx = -Math.sin(ry) * sp * j + Math.cos(ry) * (j % 2 ? .7 : -.7) * (o.zig ?? 1), bz = -Math.cos(ry) * sp * j - Math.sin(ry) * (j % 2 ? .7 : -.7) * (o.zig ?? 1);
    const ex = { ...(j === 0 ? { aLx: .3, aLz: .2 } : {}), ...(j < ord.length - 1 ? { aRx: HOLD.aRx, aRz: HOLD.aRz, aRe: HOLD.aRe } : {}), ...(j > 0 ? { aLx: HOLD.aLx, aLz: HOLD.aLz, aLe: HOLD.aLe } : {}), ...(o.extra || {}) };
    if (o.walk === false) { put(c, o.x + bx, o.y ?? 0, o.z + bz, ry); actuar(c, lt, [[0, ex]], { T: T + j * .3 }); }
    else caminar(c, lt + j * .07, { x: o.x + bx, y: o.y ?? 0, z: o.z + bz, ry, speed: o.speed ?? 2.4, accel: .01, T, extra: { ...ex, lean: .12 } });
    P.push(c.root.position.clone()); }); return P; }

// ---------- capa 2D ----------
const BAD = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; b.x = clamp(x, 200, W - 200); b.y = clamp(y, 180, H * .64); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num') { c.font = `700 ${b.kind === 'num' ? 74 : 100}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 620) { const k = 620 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#5a0010' : '#1d2238'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 48px ${FONT}`; const w = c.measureText(b.text).width + 56; c.fillStyle = '#1d2238'; c.beginPath(); c.roundRect(-w / 2, -38, w, 76, 38); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 46px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'wave') { for (let i = 0; i < 3; i++) { const t = (b.text + i * .33) % 1; c.globalAlpha = (1 - t) * .9; c.lineWidth = 9; c.strokeStyle = '#E2FD07'; c.beginPath(); c.arc(0, 0, 40 + t * 160, -.7, .7); c.stroke(); c.beginPath(); c.arc(0, 0, 40 + t * 160, Math.PI - .7, Math.PI + .7); c.stroke(); } }
  c.restore(); }
const KEY = /^(Stadt|Hautfarbe|schwarze|Tannengrund|Opa|Angst|Tisch|Tablett|Völkerball|Letzter|Schulbus|Fahrer|trotzdem|allein|Kiefernwald|Baum|sieben|Steine|Bach|Zaun|Pfosten|vier|dunkel|Licht|Papa|Kopf|wirklich|Dezember|Wasserfall|Schneesturm|verschwand|Sonne|kalt|Handys|Lehrerin|Hand|weinen|Wind|Stiefel|Dreimal|Baumstumpf|sofort|genau|Weg|Finn|Busfenster|lacht|Dunkeln|Haut|Stimme|zu|Händen|mir|fünften|Mädchen|eiskalte|Wasser|raus|22|Stunde|los|Lichter|Straßenlaterne|sehen|Hände|meiner|fester|Haltestelle|Platz|freigehalten)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI, SW = -9.6, HZ = -12;   // SW: acera izquierda; HZ: z de la casa de la familia (izquierda)
const town = (L, mode = 'day') => { use('TG'); if (mode === 'dusk') dusk(); else if (mode === 'night') night(); TG.flakes.forEach(f => f.visible = true); snowFall(TG.flakes, camera.position, L.T, 30); };
const forest = (L, mode = 'day') => { use('WD'); if (mode === 'dusk') dusk(); else if (mode === 'night') night(.004); };
const KB = K.slice(0, 12);
// 1 «In dieser Stadt» — golpe de zoom en el fotograma 0: tirado en la nieve, Finn y otros niños se ríen de él y le tiran bolas de nieve
shot(0, 'C', null, L => { town(L); const z0 = 13; sit(ich, SW, .75, z0, .6, { lean: -.35, aLx: -.6, aRx: -.6, aLz: .5, aRz: .5, lLx: .9, lRx: .6, lLk: .4, lRk: .9, headX: .1 }); cara(ich, L.T, { expr: 'sad', eyes: 'worried', mouth: 'frown' });
  const B = [[finn, 0, 'grin', 'point'], [KB[0], -3.2, 'grin', 'cross'], [KB[8], 3.2, 'joy', { aRx: 2.6, aRe: 1.6, aRz: .2 }], [KB[2], 5.8, 'smug', 'point_l']];
  B.forEach(([c, dx, e, g], i) => { put(c, SW + dx * .9, .55, z0 + 6.4 - Math.abs(dx) * .3, PI + dx * .08); actuar(c, L.lt, [[0, g, { anti: .1 }]], { T: L.T + i }); cara(c, L.T, { expr: e, mouth: i < 2 ? 'laugh' : undefined }); });
  SPLASH.forEach((b, i) => { if (i > 2) return; const k = clamp(((L.lt + i * .25) % .75) / .45); b.visible = k > 0 && k < 1; b.material.color.setRGB(1, 1, 1); b.scale.setScalar(2.2); b.position.set(lerp(SW + 3 + i, SW, k), 4.2 + Math.sin(k * PI) * 1.2 - k * 2.4, lerp(z0 + 5, z0 + .4, k)); });
  cm([SW + 7.5, 5, z0 - 9, SW - 1, 2.6, z0 + 1.6, 56], [SW + 7, 4.8, z0 - 8.4, SW - 1, 2.6, z0 + 1.6, 54], L.k); sh(V(SW, 0, z0), 25); },
  [[0, 'kids_laugh', .7], [.25, 'snowball_hit', .7], [.5, 'snowball_hit', .5]]);
// 2 «hasst mich jeder» — el narrador camina por la acera; los vecinos se giran y le miran mal
shot(.78, 'W', null, L => { town(L); const p = caminar(ich, L.lt, { x: SW, y: .55, z: 20, ry: PI, speed: 2.6, T: L.T }); cara(ich, L.T, { expr: 'sad', eyes: 'down' });
  const g = [[KB[4], SW - 3, 25, PI, 'angry'], [KB[7], SW + 3.2, 23.4, PI + .3, 'sus'], [KB[1], SW + .4, 28, PI - .2, 'angry']]; for (const [c, x, z, ry, e] of g) { put(c, x, .4, z, ry); actuar(c, L.lt, [[0, 'cross']], { T: L.T + x }); const m = mirar(c, hp(ich)); actuar(c, L.lt, [[0, { ...{ aLx: .9, aRx: .9, aLe: 1.9, aRe: 1.9, aLz: .3, aRz: .3 }, ...m }]], { T: L.T + x }); cara(c, L.T, { expr: e }); }
  cm([SW + 2.5, 5.4, -2, SW, 3.4, 14, 50], [SW + 2.2, 5.2, -1, SW, 3.4, 14, 48], L.k); sh(V(SW, 0, 10), 30); }, [[0, 'snow_steps', .7], [.6, 'murmur', .4]]);
// 3 «wegen meiner Hautfarbe.» — primer plano de su cara, triste (zoom lento)
shot(2.1, 'C', 'slow', L => { town(L); put(ich, SW, .55, 10, PI - .3); actuar(ich, L.lt, [[0, 'slump']], { T: L.T }); cara(ich, L.T, { expr: 'sad', eyes: 'down' }); onFace(ich, 8.5, -1.3, 1.2, 40, L.k, 6.5); sh(V(SW, 0, 10), 20); }, [[0, 'wind', .4]]);
// 4 «Wir sind die einzige schwarze Familie» — la familia delante de su casa; los vecinos asoman
shot(2.81, 'Z', null, L => { town(L); const fam = [[papa, -13.6, HZ - 3, 'happy'], [mama, -13.6, HZ + 3, 'smile'], [opa, -11, HZ + 6.6, 'smile'], [ich, -11, HZ - .4, 'smile']];
  for (const [c, x, z, e] of fam) { put(c, x, .2, z, PI / 2); actuar(c, L.lt, [[0, c === papa ? { aRx: .5, aRz: .5, aRe: .3 } : 'idle']], { T: L.T + z }); cara(c, L.T, { expr: e }); }
  put(KB[8], 13.6, .55, HZ + 4, -PI / 2); actuar(KB[8], L.lt, [[0, 'cross']], { T: L.T }); cara(KB[8], L.T, { expr: 'sus' }); put(KB[2], 13, .55, HZ - 6, -PI / 2 + .4); actuar(KB[2], L.lt, [[0, 'point_l']], { T: L.T }); cara(KB[2], L.T, { expr: 'shock' });
  cm([5, 5.4, HZ + 7, -12.6, 4, HZ + .6, 52], [4.4, 5.2, HZ + 6.4, -12.6, 4.2, HZ + .6, 48], L.k); sh(V(-12, 0, HZ), 30); }, [[0, 'door_close', .5], [.6, 'murmur', .4]]);
// 5 «in Tannengrund.» — el cartel del pueblo; el coche de la familia pasa
shot(4.41, 'S', null, L => { town(L); const k = easeOut(clamp(L.lt / .3)); TG.TS.scale.setScalar(1); cm([3, 3.6, 92, 8.5, 5.2, 78, 40], [2.4, 4.2, 90, 8.5, 5.4, 78, 36], L.k); show(TRUCK, 3.5, .35, 70 - L.lt * 14, PI, .9); sh(V(6, 0, 78), 25); }, [[0, 'truck', .7], [.4, 'wind', .4]]);
// 6 «Bevor wir hergezogen sind,» — camión de mudanzas; Papa y el narrador cargan cajas
shot(5.34, 'R', null, L => { town(L); show(TRUCK, 3.2, .35, HZ - 4, PI, 1); const b = [[papa, -10.4, HZ + 9, -PI / 2], [ich, -12.6, HZ + 5.5, -PI / 2 - .3]];
  b.forEach(([c, x, z, ry], i) => { caminar(c, L.lt, { x, y: .55 - (x < -10.5 ? .35 : 0), z, ry: -PI / 2 + .9, speed: 1.4, T: L.T, extra: { aLx: 1.3, aRx: 1.3, aLe: .9, aRe: .9, lean: .1 } }); attach(BOXES[i], c.aL.hand, [.8 * (c.spec.scale || 1), -.6, .9], [0, 0, 0], i ? .7 : 1); cara(c, L.T, { expr: i ? 'determined' : 'happy' }); });
  cm([7, 6, HZ + 24, -10, 3.6, HZ + 5, 50], [6.4, 5.8, HZ + 22.5, -10, 3.6, HZ + 5, 47], L.k); sh(V(-8, 0, HZ + 5), 30); }, [[0, 'cardboard', .7], [.5, 'snow_steps', .5], [1.0, 'truck_door', .4]]);
// 7 «hatte hier noch nie jemand» — tras la valla, tres vecinos miran fijamente
shot(6.7, 'C', null, L => { town(L); const g = [KB[4], KB[9], KB[11]]; g.forEach((c, i) => { put(c, 12.5 + i * .1, .55, 2 - i * 3, -PI / 2); actuar(c, L.lt, [[0, i === 1 ? 'point' : 'cross']], { T: L.T + i }); cara(c, L.T, { expr: ['sus', 'shock', 'angry'][i] }); });
  cm([4, 4.2, -6, 12.5, 3.8, -1, 44], [4.6, 4.1, -5.2, 12.5, 3.9, -1, 41], L.k); sh(V(12, 0, -1), 25); }, [[0, 'murmur', .6], [.5, 'snow_steps', .3]]);
// 8 «Haut wie meine gesehen.» — una niña le mira fijo; su madre tira de ella
shot(7.84, 'Z', null, L => { town(L); put(KB[2], 9.6, .55, -2, -PI / 2 - .3); const pull = easeOut(clamp((L.lt - .35) / .5)); actuar(KB[2], L.lt, [[0, 'idle'], [.35, { aLx: 1.2, aLz: .4, lean: .1 }]], { T: L.T }); KB[2].root.position.z = -2 - pull * 1.5; cara(KB[2], L.T, { expr: 'shock' });
  put(KB[10], 10.8, .55, -5.2, -PI / 2 + .4); actuar(KB[10], L.lt, [[0, { aRx: 1.2, aRz: .3, lean: -.1 }]], { T: L.T }); cara(KB[10], L.T, { expr: 'worried' });
  onFace(KB[2], 6, .4, -1.5, 42, L.k, 5); sh(V(10, 0, -3), 20); }, [[.35, 'cloth', .6]]);
// 9 «Und Opa sagt:» — salón: Opa en el sillón junto a la chimenea
shot(8.79, 'W', null, L => { use('SB'); inside(.9, .2); sit(opa, SX - 10, 2.4, -4, .7); actuar(opa, L.lt, [[0, { ...SIT, aRx: .9, aRe: .8 }]], { T: L.T }); talk(opa, L.T, 8.79, 9.69); SB.fire.forEach((f, i) => f.scale.setScalar(.8 + Math.sin(L.T * 9 + i) * .25));
  sit(ich, SX - 3, .2, -1, -1.1, { crouch: .2 }); put(ich, SX - 3, .25, -1, -1.4); applyPose(ich, { crouch: .3, lLx: 1.6, lRx: 1.6, lLk: 2.4, lRk: 2.4, aLx: .6, aRx: .6 }); cara(ich, L.T, { expr: 'sad' });
  cm([SX + 6, 7, 10, SX - 7, 3.6, -3, 50], [SX + 5.4, 6.6, 9, SX - 7, 3.6, -3, 47], L.k); }, [[0, 'fire', .7], [.4, 'clock_tick', .3]]);
// 10 «Menschen haben Angst vor dem,» — Opa levanta el dedo, primer plano
shot(9.69, 'C', null, L => { use('SB'); inside(.9, .2); sit(opa, SX - 10, 2.4, -4, .7); actuar(opa, L.lt, [[0, { ...SIT }], [.1, { ...SIT, aRx: 2.3, aRe: 1.2, aRz: .1 }]], { T: L.T }); talk(opa, L.T, 9.69, 10.85, 'talk'); SB.fire.forEach((f, i) => f.scale.setScalar(.8 + Math.sin(L.T * 9 + i) * .25));
  onFace(opa, 7, .4, 2.2, 40, L.k, 5.8); }, [[0, 'fire', .5], [.2, 'chair_creak', .4]]);
// 11 «was sie nicht kennen.» — una madre ve venir al narrador y cruza la calle con su hija
shot(10.85, 'S', null, L => { town(L, 'dusk'); const w = caminar(ich, L.lt, { x: SW, y: .55, z: 2, ry: PI, speed: 2.2, T: L.T }); cara(ich, L.T, { expr: 'sad' });
  const turn = clamp((L.lt - .2) / .4); const ry = lerp(0, PI / 2 + .5, easeOut(turn)); for (const [c, dx] of [[KB[10], 0], [KB[2], -2.8]]) { caminar(c, L.lt, { x: SW + dx * Math.cos(ry) + .2, y: .45, z: -12 - dx * Math.sin(ry), ry, speed: 2.8, T: L.T, extra: c === KB[2] ? { aRx: .5, aRz: -.3 } : { aLx: .5, aLz: -.3 } }); cara(c, L.T, { expr: c === KB[2] ? 'confused' : 'scared' }); }
  cm([SW + 13, 6.4, -2, SW + 3, 3, -10, 50], [SW + 12.4, 6.2, -1.4, SW + 3, 3, -10, 48], L.k); sh(V(SW, 0, -8), 30); }, [[0, 'snow_steps', .7], [.3, 'snow_steps', .5]]);
// 12 «Deshalb nimmt in der Mittagspause der ganze Tisch» — Mensa: se sienta con su bandeja
const mesa = (L, leave) => { use('MS'); inside(.75, .2); const tx = MX - 14, tz = 2; sit(ich, tx + 6, 2.0, tz - 3.2, 0, { aLx: 1.0, aRx: 1.0, aLe: .9, aRe: .9 });
  const seats = [[-6, -1], [-2, -1], [2, -1], [-6, 1], [-2, 1], [6, 1]]; seats.forEach(([dx, s], i) => { const c = KB[i]; const up = clamp((L.T - (13.75 + i * .12)) / .5) * leave;
    if (up <= 0) { sit(c, tx + dx, 2.0, tz + s * 3.2, s > 0 ? PI : 0, { aLx: 1.0, aRx: 1.0, aLe: 1.1, aRe: 1.1 }); cara(c, L.T, { expr: 'smile' }); }
    else { const w = caminar(c, Math.max(0, L.T - 14.1 - i * .12), { x: tx + dx, z: tz + s * 3.2 + s * 1.2 * up, ry: s > 0 ? 0 : PI, speed: 3, accel: .2, T: L.T, extra: { aLx: 1.2, aRx: 1.2, aLe: .8, aRe: .8 } }); cara(c, L.T, { expr: 'sus' }); attach(TRAYS2[i % 5], c.aL.hand, [.85, -.5, .5], [0, 0, 0], .9); } }); return { tx, tz }; };
shot(11.93, 'I', null, L => { const { tx, tz } = mesa(L, 0); show(TRAY, tx + 6, 3.3, tz - 1.1); cara(ich, L.T, { expr: 'smile' }); cm([tx + 12, 9, tz + 14, tx, 3, tz, 46], [tx + 11, 8.4, tz + 12.6, tx, 3, tz, 44], L.k); }, [[0, 'cafeteria', .7], [.5, 'tray', .6]]);
// 13 «sein Tablett» — todos cogen la bandeja y se levantan a la vez
shot(13.75, 'C', null, L => { const { tx, tz } = mesa(L, 1); show(TRAY, tx + 6, 3.3, tz - 1.1); cara(ich, L.T, { expr: 'shock' }); cm([tx + 12, 9, tz + 12, tx + 2, 3.6, tz - 1, 50], [tx + 11, 8.6, tz + 11, tx + 2, 3.6, tz - 1, 48], L.k); }, [[0, 'chairs_scrape', .8], [.4, 'tray', .5], [.9, 'snow_steps', .3]]);
// 14 «setzt sich woanders hin, sobald ich komme.» — solo en la mesa larga; los demás en la otra le miran
shot(15.33, 'Z', null, L => { use('MS'); inside(.75, .2); const tx = MX - 14, tz = 2; sit(ich, tx + 6, 2.0, tz - 3.2, 0, { aLx: 1.0, aRx: 1.0, aLe: .9, aRe: .9 }); cara(ich, L.T, { expr: 'sad', eyes: 'down' }); show(TRAY, tx + 6, 3.3, tz - 1.1);
  [[-6, -1], [-2, -1], [2, -1], [-6, 1], [-2, 1]].forEach(([dx, s], i) => { const c = KB[i]; sit(c, tx + dx, 2.0, -10 + s * 3.2, s > 0 ? PI : 0, { aLx: 1.0, aRx: 1.0, aLe: 1.1, aRe: 1.1 }); const m = mirar(c, hp(ich)); applyPose(c, { ...SIT, aLx: 1, aRx: 1, aLe: 1.1, aRe: 1.1, ...m }); cara(c, L.T, { expr: i % 2 ? 'smug' : 'sus' }); });
  cm([tx + 9, 6.6, tz + 10, tx + 3, 3.4, tz - 6, 50], [tx + 8.4, 6.3, tz + 9, tx + 3, 3.4, tz - 6, 47], L.k); }, [[0, 'cafeteria', .5], [.5, 'murmur', .4]]);
// 15 «Beim Völkerball» — gimnasio: los capitanes eligen equipo
shot(16.78, 'W', null, L => { use('TH'); inside(.75, .2); const cap1 = KB[3], cap2 = KB[6]; put(cap1, TX - 4, 0, 6, PI); put(cap2, TX + 4, 0, 6, PI); actuar(cap1, L.lt, [[0, 'point', { anti: .2 }]], { T: L.T }); actuar(cap2, L.lt, [[0, 'cross'], [.8, 'point_l']], { T: L.T }); cara(cap1, L.T, { expr: 'smug' }); cara(cap2, L.T, { expr: 'grin' });
  const row = [KB[0], KB[1], ich, KB[2], KB[5]]; row.forEach((c, i) => { const x = TX - 6 + i * 3, picked = i !== 2 && L.lt > .3 + i * .2; const z = picked ? -6 + easeOut(clamp((L.lt - .3 - i * .2) / .5)) * 10 : -6; put(c, x + (picked ? (i < 2 ? -1 : 1) * easeOut(clamp((L.lt - .3 - i * .2) / .5)) * 3 : 0), 0, z, 0); actuar(c, L.lt, [[0, picked ? 'cheer' : 'idle']], { T: L.T + i }); cara(c, L.T, { expr: picked ? 'happy' : c === ich ? 'worried' : 'neutral' }); });
  cm([TX + 2, 6, 12, TX, 3, -3, 52], [TX + 2.6, 5.8, 11, TX, 3, -3, 50], L.k); show(BALL, TX - 4.6, 3.6, 6.8); }, [[0, 'gym_echo', .6], [.4, 'ball_bounce', .7], [1.0, 'ball_bounce', .5]]);
// 16 «bleibe ich jedes Mal als Letzter übrig.» — solo contra la pared; la pelota rueda hasta sus pies
shot(18.64, 'C', null, L => { use('TH'); inside(.75, .2); put(ich, TX - 30, 0, -12, PI / 2); actuar(ich, L.lt, [[0, 'slump']], { T: L.T }); cara(ich, L.T, { expr: 'sad' }); const k = easeOut(clamp(L.lt / 1.1)); show(BALL, TX - 22 + k * 6.6 - 6.6 + 0, .7, -12 + .4, 0); BALL.position.x = lerp(TX - 18, TX - 27.6, k); BALL.rotation.z = k * 8;
  onFace(ich, 9, .2, 0, 44, L.k, 7); badge('tag', 'LETZTER', W / 2, H * .2, (L.lt - .3) * 1.5); }, [[0, 'ball_roll', .6], [.5, 'sigh', .4]]);
// 17 «Und der Schulbus?» — el bus amarillo por la carretera nevada
shot(19.8, 'R', null, L => { town(L); show(BUS, 3.5, .35, 40 - L.lt * 14, PI); cm([8, 1.6, 10, 3.5, 3.6, 30, 46], [7.4, 1.5, 11, 3.5, 3.6, 28, 44], L.k); sh(V(3, 0, 30), 30); }, [[0, 'bus_engine', .8], [.4, 'snow_crunch', .3]]);
// 18 «Der Fahrer sieht mich an der Haltestelle stehen» — desde la cabina: el conductor le ve en la parada
shot(20.66, 'S', null, L => { town(L); const bz = 22 - L.lt * 5; show(BUS, 3.5, .35, bz, PI); BUS.updateMatrixWorld(true); const dp = V(-1.6, 3.6, 9).applyMatrix4(BUS.matrixWorld); put(fahrer, dp.x, dp.y - 3.3, dp.z, PI); applyPose(fahrer, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: .5, aRe: .5, headY: L.lt > .5 ? -.9 : -.2 }); cara(fahrer, L.T, { expr: 'bored', eyes: L.lt > .5 ? 'side_r' : undefined });
  put(ich, -12, .55, 6, PI / 2 + .4); actuar(ich, L.lt, [[0, { aRx: 2.6, aRz: .3, aRe: .3 }]], { T: L.T }); cara(ich, L.T, { expr: 'happy' });
  cm([-15, 4.8, 2, dp.x, dp.y + 2, dp.z, 50], [-14.8, 4.7, 2.5, dp.x, dp.y + 2, dp.z, 48], L.k); sh(V(-6, 0, 8), 30); }, [[0, 'bus_engine', .7], [.3, 'brakes_squeak', .3]]);
// 19 «und fährt trotzdem weiter.» — el bus pasa de largo y le salpica nieve; en las ventanas se ríen
shot(22.44, 'C', null, L => { town(L); show(BUS, 3.5, .35, 18 - L.lt * 18, PI); put(ich, -12, .55, 6, PI / 2); actuar(ich, L.lt, [[0, { aRx: 2.4, aRz: .3 }], [.45, 'slump']], { T: L.T }); cara(ich, L.T, { expr: L.lt < .45 ? 'happy' : 'sad' });
  SPLASH.forEach((s, i) => { const k = clamp((L.lt - .35 - i * .02) / .6); s.visible = k > 0 && k < 1; s.position.set(lerp(-1, -9, k) + Math.sin(i) * .6, .6 + Math.sin(k * PI) * 2.2, 6 + Math.cos(i * 2) * 1.6); s.material.color.setRGB(1, 1, 1); s.scale.setScalar(1.4); });
  cm([-13.5, 3.4, -9, -5, 3, 8, 50], [-13.3, 3.3, -8, -5, 3, 8, 48], L.k); sh(V(-6, 0, 6), 30); }, [[0, 'bus_pass', .9], [.4, 'snow_splash', .6], [.6, 'kids_laugh', .5]]);
// 20 «Also laufe ich jeden Tag allein» — sale del pueblo por la carretera, solo, con la mochila
shot(23.92, 'W', null, L => { town(L); const p = caminar(ich, L.lt, { x: 1.5, y: .35, z: 66, ry: 0, speed: 2.6, T: L.T }); cara(ich, L.T, { expr: 'neutral' }); cam([p.x - 5, 5.5, p.z - 11], [p.x, 3.4, p.z + 4], 50); sh(V(0, 0, p.z), 30); }, [[0, 'snow_steps', .8], [.6, 'crow', .4]]);
// 21 «durch den Kiefernwald.» — dron sobre el pinar: un punto naranja entre los pinos
shot(25.66, 'Z', null, L => { forest(L); const p = caminar(ich, L.lt, { x: WX, y: .3, z: -100, ry: 0, speed: 2.6, T: L.T }); cara(ich, L.T, { expr: 'neutral' }); const k = easeOut(clamp(L.lt / .9)); cam([WX + 22 - k * 4, 46 - k * 6, p.z + 36], [WX, 0, p.z - 2], 48); sh(V(WX, 0, p.z), 60); }, [[0, 'wind_trees', .7], [.4, 'crow', .3]]);
// 22 «Erst am umgestürzten Baum vorbei,» — trepa por el árbol caído
shot(26.58, 'C', null, L => { forest(L); const k = clamp(L.lt / 1.8); const z = lerp(-76, -64, k), y = .3 + Math.sin(k * PI) * 2.2; put(ich, WX + 1.5, y, z, 0); actuar(ich, L.lt, [[0, { lLx: 1.2, lLk: 1.4, aLx: 1.2, aRx: .4, lean: .3 }], [.8, { lRx: 1.2, lRk: 1.4, aRx: 1.2, aLx: .4, lean: .2 }], [1.4, 'idle']], { T: L.T }); cara(ich, L.T, { expr: 'determined' });
  cm([WX + 10, 4.4, -60, WX + 1, 2.6, -70, 46], [WX + 9.4, 4.2, -59, WX + 1, 2.6, -70, 44], L.k); sh(V(WX, 0, -70), 30); }, [[0, 'snow_crunch', .7], [.6, 'wood_creak', .6], [1.2, 'thud_snow', .5]]);
// 23 «dann über sieben flache Steine» — las siete piedras del arroyo aparecen con su número
shot(28.59, 'S', null, L => { forest(L); cm([WX + 7, 7, -11, WX, .2, -25, 48], [WX + 6.4, 6.8, -11.6, WX, .2, -25, 46], L.k); put(ich, WX - .4, .3, -19.6, PI); actuar(ich, L.lt, [[0, 'point', { anti: .2 }]], { T: L.T }); cara(ich, L.T, { expr: 'smile' });
  WD.STONES.forEach((s, i) => badge3('num', String(i + 1), s.clone().add(V(0, 1.4, 0)), (L.lt - .1 - i * .1) * 2.4, .9)); sh(V(WX, 0, -25), 25); }, [[0, 'creek', .8], [.3, 'pop', .3], [.7, 'pop', .3]]);
// 24 «durch den Bach» — salta de piedra en piedra
shot(29.69, 'R', null, L => { forest(L); const i = clamp(Math.floor(L.lt / .32), 0, 5), f = (L.lt % .32) / .32, a = WD.STONES[6 - i], b = WD.STONES[5 - i]; ich.root.visible = true; saltar(ich, f * .32, 0, { h: .9, dur: .2, base: [a.x, a.y, a.z], dx: b.x - a.x, dz: b.z - a.z }); ich.root.rotation.y = PI; cara(ich, L.T, { expr: 'happy' });
  cm([WX - 10, 4.4, -18, WX, 2.2, -26, 48], [WX - 9.6, 4.3, -18.4, WX, 2.2, -26, 46], L.k); sh(V(WX, 0, -25), 25); }, [[0, 'creek', .7], [.3, 'stone_step', .6], [.64, 'stone_step', .6], [.96, 'stone_step', .5]]);
// 25 «und zum Schluss am Zaun» — sigue la valla nevada
shot(30.71, 'W', null, L => { forest(L); const p = caminar(ich, L.lt, { x: WX - 1.8, y: .3, z: 4, ry: 0, speed: 2.4, T: L.T, extra: { aLx: .4, aLz: .5 } }); cara(ich, L.T, { expr: 'neutral' }); cm([WX + 5, 4.4, p.z + 12, WX - 2.6, 2.6, p.z, 44], [WX + 4.6, 4.2, p.z + 11, WX - 2.6, 2.6, p.z + 1, 42], L.k); sh(V(WX, 0, p.z), 30); }, [[0, 'snow_steps', .7], [.6, 'wind', .3]]);
// 26 «mit dem kaputten Pfosten entlang.» — toca el poste roto al pasar
shot(32.05, 'C', null, L => { forest(L); const p = caminar(ich, L.lt, { x: WX - 2, y: .3, z: 19, ry: 0, speed: 2, T: L.T, extra: { aLx: .9, aLz: .6, aLe: .3 } }); cara(ich, L.T, { expr: 'smile' }); const f = WD.FPOST; cm([f.x - 5, 3.2, f.z + 6, f.x + 1, 1.8, f.z - 1, 46], [f.x - 4.6, 3, f.z + 5.4, f.x + 1, 1.8, f.z - 1, 44], L.k);
  badge3('tag', 'KAPUTT', f.clone().add(V(0, 3.4, 0)), (L.lt - .4) * 2); sh(f, 20); }, [[0, 'snow_steps', .6], [.6, 'wood_knock', .7]]);
// 27 «Weil es im Winter schon um vier dunkel wird,» — el reloj de la iglesia marca las cuatro al atardecer
shot(33.53, 'Z', null, L => { town(L, 'dusk'); TG.clock.hh.rotation.z = -PI * 2 * 4 / 12; TG.clock.mh.rotation.z = -L.lt * .2; const c = V(-6, 28, -231.9); cm([c.x + 8, c.y - 14, c.z + 52, c.x, c.y - 4, c.z, 38], [c.x + 7, c.y - 13, c.z + 48, c.x, c.y - 3, c.z, 36], L.k); badge('tag', '16:00', W / 2, H * .2, (L.lt - .3) * 1.5); sh(c, 40); }, [[0, 'church_bell', .8], [.6, 'church_bell', .6]]);
// 28 «… dunkel wird,» — el cielo se oscurece rápido sobre el bosque
shot(34.77, 'F', null, L => { forest(L, 'dusk'); const k = clamp(L.lt / .8); setSky([lerp(.24, .01, k), lerp(.22, .02, k), lerp(.5, .08, k)], [lerp(.9, .05, k), lerp(.45, .06, k), lerp(.38, .17, k)], [lerp(1, .1, k), lerp(.62, .12, k), lerp(.36, .26, k)]); hemi.intensity = lerp(.9, .5, k); sun.intensity = lerp(1.5, .3, k);
  cm([WX + 30, 12, 40, WX, 20, -60, 60], [WX + 28, 13, 38, WX, 22, -60, 58], L.k); put(ich, WX + 1, .3, 30, PI); actuar(ich, L.lt, [[0, 'idle']], { T: L.T }); sh(V(WX, 0, 20), 40); }, [[0, 'wind_trees', .6], [.4, 'owl', .4]]);
// 29 «kenne ich inzwischen jeden Schritt» — de noche, camina tranquilo con los ojos cerrados
shot(35.63, 'W', null, L => { forest(L, 'night'); const p = caminar(ich, L.lt, { x: WX + .3, y: .3, z: 44, ry: 0, speed: 2.2, T: L.T }); cara(ich, L.T, { expr: 'relief', eyes: 'closed' }); onFace(ich, 9, .4, 1.6, 44, 0); sh(V(WX, 0, p.z), 25); }, [[0, 'snow_steps', .7], [.5, 'owl', .3]]);
// 30 «auch ohne Licht.» — sus botas pisan seguras en la oscuridad
shot(36.59, 'S', null, L => { forest(L, 'night'); const p = caminar(ich, L.lt, { x: WX + .3, y: .3, z: 50, ry: 0, speed: 2.2, T: L.T }); cara(ich, L.T, { expr: 'relief', eyes: 'closed' }); cam([p.x + 3.4, 1.6, p.z + 4.6], [p.x, .9, p.z], 46); sh(V(WX, 0, p.z), 20); }, [[0, 'snow_crunch', .8], [.6, 'snow_crunch', .7]]);
// 31 «Papa sagt: „Kopf hoch.“» — en el salón, Papa le levanta la barbilla
shot(37.94, 'I', null, L => { use('SB'); inside(.9, .2); SB.fire.forEach((f, i) => f.scale.setScalar(.8 + Math.sin(L.T * 9 + i) * .25)); put(papa, SX + 2, 0, 2, -PI / 2 - .2); put(ich, SX - 1.4, 0, 2.3, PI / 2);
  const up = easeOut(clamp((L.lt - .7) / .4)); actuar(papa, L.lt, [[0, { lean: .25, crouch: .2 }], [.7, { lean: .25, crouch: .2, aRx: 1.3, aRe: .8, aRz: -.1 }]], { T: L.T }); talk(papa, L.T, 37.94, 39.4, 'smile');
  actuar(ich, L.lt, [[0, { headX: .45 }], [.7, { headX: lerp(.45, -.25, up) }]], { T: L.T }); cara(ich, L.T, { expr: up > .5 ? 'neutral' : 'sad', eyes: up > .5 ? undefined : 'down' });
  cm([SX + 4.4, 5.6, 8, SX - 1.4, 4, 2.3, 46], [SX + 4, 5.4, 7.6, SX - 1.4, 4.1, 2.3, 44], L.k); }, [[0, 'fire', .5], [.7, 'cloth', .4]]);
// 32 «Irgendwann sehen sie,» — Papa de rodillas, la mano en su hombro, junto a la ventana nevada
shot(39.4, 'C', null, L => { use('SB'); inside(.9, .2); put(papa, SX + 10.6, 0, -11, PI + .5); put(ich, SX + 12, 0, -13.2, .3); actuar(papa, L.lt, [[0, { crouch: .55, lLk: 1.5, lRx: 1.4, lRk: 1.6, aLx: 1.6, aLe: .3, aLz: -.05 }]], { T: L.T }); talk(papa, L.T, 39.4, 40.42, 'smile');
  actuar(ich, L.lt, [[0, 'idle']], { T: L.T }); cara(ich, L.T, { expr: 'neutral' }); onFace(papa, 7, .6, 2.4, 42, L.k, 5.6); }, [[0, 'wind', .3], [.3, 'cloth', .3]]);
// 33 «wer du wirklich bist.» — primer plano del narrador: levanta la cabeza
shot(40.42, 'Z', null, L => { use('SB'); inside(.9, .2); put(ich, SX + 12, 0, -13.2, .3); put(papa, SX + 10.6, 0, -11, PI + .5); applyPose(papa, { crouch: .55, lLk: 1.5, lRx: 1.4, lRk: 1.6 }); actuar(ich, L.lt, [[0, { headX: .2 }], [.3, { headX: -.15 }]], { T: L.T }); cara(ich, L.T, { expr: L.lt > .4 ? 'determined' : 'neutral' }); onFace(ich, 5, .2, -1, 40, L.k, 4); }, [[0, 'fire', .3], [.4, 'heartbeat', .3]]);
// 34 «Im Dezember fuhr unsere Klasse» — calendario: el 14 marcado «Ausflug!» y el narrador lo señala
shot(41.48, 'S', null, L => { use('SB'); inside(.9, .2); put(ich, SX - 15.6, 0, 6, -PI / 2 + .3); actuar(ich, L.lt, [[0, 'point', { anti: .2 }]], { T: L.T }); cara(ich, L.T, { expr: 'happy' }); cm([SX - 12, 8.4, 9, SX - 19.6, 8, 4, 40], [SX - 12.6, 8.3, 8.4, SX - 19.6, 8, 4, 36], L.k); }, [[0, 'paper', .7], [.6, 'pen', .4]]);
// 35 «zum gefrorenen Wasserfall,» — la clase ante la cascada helada; la profesora la señala
shot(43.0, 'W', null, L => { forest(L); const g = [lehr, finn, mad, ich, ...KB.slice(0, 6)]; g.forEach((c, i) => { const x = WX - 9 + (i % 5) * 4, z = -150 - Math.floor(i / 5) * 3.6; put(c, x, .2, z, PI + (x - WX) * -.02); actuar(c, L.lt, [[0, i === 0 ? 'point' : i % 3 ? 'idle' : 'cheer']], { T: L.T + i }); cara(c, L.T, { expr: ['talk', 'smug', 'happy', 'joy'][i % 4] }); });
  cm([WX + 10, 9, -126, WX, 12, -176, 54], [WX + 9, 9.4, -128, WX, 13, -176, 50], L.k); sh(V(WX, 0, -160), 40); }, [[0, 'kids_chatter', .5], [.4, 'ice_crack', .5], [.9, 'camera_click', .4]]);
// 36 «mitten in diesem Wald.» — dron: la cascada en medio del pinar infinito
shot(44.49, 'Z', null, L => { forest(L); const k = easeOut(clamp(L.lt / 1.2)); cam([WX + 40 + k * 30, 40 + k * 30, -110 + k * 20], [WX, 10, -175], 52); sh(V(WX, 0, -150), 80); }, [[0, 'wind_trees', .6], [.5, 'crow', .3]]);
// 37 «Doch auf dem Rückweg kam ein Schneesturm,» — la fila de vuelta; detrás llega un muro blanco
shot(45.72, 'C', null, L => { forest(L); const k = clamp(L.lt / 1.9); scene.fog.color.setRGB(.86, .88, .92); scene.fog.density = lerp(.002, .012, k); setSky([lerp(.3, .62, k), lerp(.55, .66, k), lerp(.92, .74, k)], [.72, .75, .8], [.8, .82, .86]); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .4 + k * .6);
  const ord = [lehr, ...KB.slice(0, 4), mad, finn, ich]; fila(ord, L.lt, L.T, { x: WX, z: -110, ry: 0, sp: 3.2, speed: 2.2, extra: {} }); ord.forEach(c => cara(c, L.T, { expr: 'worried' }));
  cm([WX + 9, 4, -88, WX, 3, -120, 50], [WX + 8.6, 4, -87, WX, 3.4, -120, 48], L.k); sh(V(WX, 0, -105), 30); }, [[0, 'wind_rise', .8], [.5, 'snow_steps', .5]]);
// 38 «so heftig,» — la ventisca les golpea; se protegen la cara (zoom lento)
shot(47.66, 'R', 'slow', L => { forest(L); whiteout(.03); WD.flakes.forEach(f => f.visible = true); const ord = [KB[0], mad, KB[2], finn]; ord.forEach((c, i) => { put(c, WX - 3 + i * 2.9, .3, -100 - (i % 2) * 1.2, PI - .3); actuar(c, L.lt, [[0, 'brace']], { T: L.T + i, extra: shiver(L.T, 1.5) }); cara(c, L.T, { expr: 'scared', eyes: 'closed' }); });
  blizzard(WD.flakes, camera.position, L.T, 1.3); cm([WX + 1.4, 3.6, -88, WX + 1.4, 3.6, -100, 46], [WX + 1.4, 3.6, -91, WX + 1.4, 3.8, -100, 44], L.k, easeIn); }, [[0, 'blizzard', .9]]);
// 39 «dass der Weg unter dem Schnee verschwand.» — las huellas del camino se llenan de nieve (zoom lento)
shot(48.58, 'C', 'slow', L => { forest(L); whiteout(.02); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, 1.2); const k = clamp(L.lt / 1.6);
  for (let i = 0; i < 6; i++) { const b = BREATH[i]; b.visible = true; b.material.color.setRGB(.3, .32, .4); b.material.opacity = .7 * (1 - k); b.position.set(WX + (i % 2 ? .6 : -.6), .32, -80 + i * 1.6); b.scale.set(1.2, .12, 2); }
  cm([WX + 1, 5, -68, WX, .3, -78, 46], [WX + .8, 3.6, -70, WX, .3, -78, 42], L.k, easeIn); }, [[0, 'blizzard', .8], [.6, 'wind_howl', .5]]);
// 40 «Kurz danach ging die Sonne unter.» — el sol rojo se hunde tras los pinos
shot(50.4, 'W', null, L => { forest(L, 'dusk'); const k = clamp(L.lt / 1.7); sun.intensity = lerp(1.5, .2, k); hemi.intensity = lerp(.9, .35, k); scene.fog.density = .006; const s = V(WX + 150, lerp(30, -6, k), -170); SUN.visible = true; SUN.position.copy(s); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .6);
  cm([WX - 4, 5, -40, WX + 150, 14, -170, 50], [WX - 4, 4.6, -41, WX + 150, 10, -170, 48], L.k); }, [[0, 'wind', .6], [.8, 'crow', .3]]);
const SUN = sphere(14, new THREE.MeshBasicMaterial({ color: 0xff7a3a, toneMapped: false, fog: false }), scene, 0, 0, 0, 24, 16); PROPS.push(SUN);
// 41 «Und weil es so kalt war,» — aliento helado, tiritan; el termómetro marca −14 °C
shot(52.16, 'S', null, L => { forest(L, 'night'); night(.012); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .7); put(KB[1], WX + 1, .3, -60, PI); actuar(KB[1], L.lt, [[0, 'hug_self']], { T: L.T, extra: shiver(L.T, 2) }); cara(KB[1], L.T, { expr: 'scared' }); breath(KB[1], L.T);
  onFace(KB[1], 6, .4, 1.6, 42, L.k, 5); badge('red', '−14 °C', W / 2, H * .2, (L.lt - .2) * 1.5); }, [[0, 'teeth_chatter', .7], [.5, 'wind', .5]]);
// 42 «gingen die Handys aus,» — el móvil: batería en rojo y se apaga
const phoneShot = (who, off) => L => { forest(L, 'night'); storm(.02, .7); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .8); put(who, WX, .3, -58, PI); actuar(who, L.lt, [[0, 'phone']], { T: L.T }); cara(who, L.T, { expr: 'worried', eyes: 'down' });
  attach(PHONE.g, who.aR.hand, [0, -.5, .6], [-.4, 0, 0], 1.1); const dead = L.lt > off; PHONE.scr.material.map = dead ? null : (L.lt > off * .5 ? PHONE.T.low : PHONE.T.full); PHONE.scr.material.color.setRGB(dead ? .02 : 1, dead ? .02 : 1, dead ? .02 : 1); PHONE.scr.material.needsUpdate = true;
  const h = hp(who); LIGHTS[0].l.intensity = dead ? 0 : 22; LIGHTS[0].l.color.setRGB(.7, .8, 1); LIGHTS[0].l.position.copy(h).add(V(0, -.6, -1.4)); LIGHTS[0].l.target.position.copy(h).add(V(0, .4, 1)); return h; };
shot(53.34, 'C', null, L => { phoneShot(KB[5], .55)(L); onFace(KB[5], 5.6, -.6, 1.4, 42, L.k, 4.6); }, [[0, 'wind', .4], [.55, 'phone_off', .8]]);
// 43 «eins nach dem anderen.» — las linternas de los móviles se apagan una tras otra
shot(54.22, 'W', null, L => { forest(L, 'night'); storm(.02, .7); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .8); const g = [KB[0], KB[3], mad, KB[6], finn, KB[7]];
  g.forEach((c, i) => { put(c, WX - 7 + i * 2.9, .3, -56 - (i % 2) * 1.4, PI); actuar(c, L.lt, [[0, { aRx: 2.0, aRe: .5 }]], { T: L.T + i, extra: shiver(L.T, .6) }); cara(c, L.T, { expr: 'scared' }); const on = L.lt < .2 + i * .22; const lt = LIGHTS[i]; lt.s.visible = on; const p = handP(c); lt.s.position.copy(p).add(V(0, .3, 0)); lt.l.intensity = on ? 40 : 0; lt.l.position.copy(lt.s.position); lt.l.target.position.copy(p).add(V(0, -2, 6)); });
  cm([WX, 3.6, -44, WX, 3.6, -56, 52], [WX - .4, 3.6, -45, WX, 3.6, -56, 50], L.k); }, [[.2, 'click_metal', .5], [.42, 'click_metal', .5], [.64, 'click_metal', .5], [.86, 'click_metal', .5], [1.08, 'click_metal', .5], [1.3, 'click_metal', .5]]);
// 44 «Sogar das von unserer Lehrerin.» — su cara iluminada por el móvil… y negro
shot(55.66, 'Z', null, L => { phoneShot(lehr, .9)(L); cara(lehr, L.T, { expr: L.lt > .9 ? 'scared' : 'worried', eyes: L.lt > .9 ? undefined : 'down' }); onFace(lehr, 5.4, -.2, 1.2, 40, L.k, 4.4); }, [[0, 'wind', .4], [.9, 'phone_off', .8]]);
// 45 «Bald sah ich nicht mal mehr» — oscuridad: solo nieve azul y siluetas
shot(57.29, 'C', null, L => { forest(L, 'night'); storm(.035, .8); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, 1); const g = [ich, KB[2], KB[4]]; g.forEach((c, i) => { put(c, WX - 3 + i * 3, .3, -60 - i * 2, PI + .3 - i * .3); actuar(c, L.lt, [[0, 'brace']], { T: L.T + i, extra: shiver(L.T) }); });
  cm([WX + 2, 4, -50, WX, 3, -62, 52], [WX + 1.6, 4, -51, WX, 3, -62, 48], L.k); }, [[0, 'wind_howl', .7]]);
// 46 «meine eigene Hand vor dem Gesicht.» — su mano negra delante de la cámara, apenas visible
shot(58.51, 'S', null, L => { forest(L, 'night'); storm(.04, .8); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, 1); put(ich, WX, .3, -62, PI); actuar(ich, L.lt, [[0, { aRx: 1.6, aRe: 1.5, aRz: -.2 }]], { T: L.T, extra: { aRx: 1.6 + Math.sin(L.T * 3) * .1 } });
  hemi.intensity = .55; onFace(ich, 5.2, .2, 1.4, 44, L.k, 4.4); }, [[0, 'wind', .6], [.6, 'breath_heavy', .5]]);
// 47 «Die ersten Kinder fingen an zu weinen.» — una niña llora, sentada en la nieve
shot(60.03, 'R', null, L => { forest(L, 'night'); storm(.02, 1); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .9); hemi.intensity = .3; sit(KB[4], WX + 1, .9, -58, PI - .4, { aLx: 1.2, aRx: 1.2, aLe: 2, aRe: 2, headX: .3 }); cara(KB[4], L.T, { expr: 'cry' });
  put(KB[9], WX + 3.6, .3, -59, PI - 1); actuar(KB[9], L.lt, [[0, 'hands_face']], { T: L.T, extra: shiver(L.T, 1.4) }); cara(KB[9], L.T, { expr: 'cry' }); onFace(KB[4], 7, 1, 2, 44, L.k, 5.6); }, [[0, 'kid_cry', .8], [.6, 'wind', .5]]);
// 48 «Der Wind heulte,» — los pinos se doblan en la ventisca
shot(61.94, 'W', null, L => { forest(L, 'night'); storm(.018, 1); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, 1.5); WD.PINES.forEach((p, i) => { p.rotation.z = Math.sin(L.T * 2.4 + i) * .07 + .05; });
  cm([WX + 5, 4, -30, WX - 20, 14, -80, 56], [WX + 4.6, 3.8, -31, WX - 20, 12, -80, 54], L.k); }, [[0, 'wind_howl', 1]]);
// 49 «und der Schnee drückte sich in unsere Stiefel.» — botas que se hunden hasta el tobillo
shot(62.84, 'C', null, L => { forest(L, 'night'); storm(.02, 1.1); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .8); const p = caminar(ich, L.lt, { x: WX, y: -.5, z: -66, ry: 0, speed: 1.2, T: L.T, tired: 1 }); hemi.intensity = .5; cam([p.x + 3, 1.8, p.z + 4.6], [p.x, .6, p.z], 46); }, [[0, 'snow_crunch', .9], [.5, 'snow_crunch', .8], [1.0, 'snow_crunch', .8]]);
// 50 «… in unsere Stiefel.» — la fila avanza con nieve hasta las rodillas
shot(64.17, 'S', null, L => { forest(L, 'night'); storm(.022, 1); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, 1); const ord = [lehr, KB[0], KB[1], KB[2], KB[3]]; ord.forEach((c, i) => { caminar(c, L.lt, { x: WX + (i % 2 ? .6 : -.6), y: -.8, z: -40 - i * 3, ry: PI, speed: 1.1, T: L.T, tired: 1 }); });
  cm([WX + 7, 4, -36, WX, 2, -46, 50], [WX + 6.6, 4, -37, WX, 2, -46, 48], L.k); }, [[0, 'snow_steps', .7], [.6, 'wind', .5]]);
// 51 «Dreimal führte uns die Lehrerin» — la profesora delante, guiando en círculo
shot(65.31, 'W', null, L => { forest(L, 'night'); storm(.016, 1); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .8); const ord = [lehr, KB[0], KB[1], mad, KB[2], finn, ich];
  const R = 6.5, a0 = L.lt * .5; ord.forEach((c, j) => { const a = a0 - j * .32, x = WX - 4.5 + Math.cos(a) * R, z = -64 + Math.sin(a) * R; caminar(c, 0, { x, y: .3, z, ry: -a, speed: 0, T: L.T }); const p = caminar(c, L.lt, { x, y: .3, z, ry: -a + PI, speed: .001, T: L.T, extra: { ...(j ? { aLx: HOLD.aLx } : {}), lean: .1 } }); c.root.position.set(x, .3, z); c.root.rotation.y = -a + PI; });
  cm([WX + 6, 9, -50, WX - 4.5, 1, -64, 54], [WX + 5.6, 8.8, -51, WX - 4.5, 1, -64, 52], L.k); }, [[0, 'snow_steps', .7], [.7, 'wind', .5]]);
// 52 «am selben Baumstumpf vorbei.» — el mismo tocón otra vez: «3×» (zoom lento)
shot(66.89, 'C', 'slow', L => { forest(L, 'night'); storm(.014, 1.1); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .8); const s = WD.ST.position.clone().add(V(WX, 0, 0)); [lehr, KB[0], KB[1]].forEach((c, i) => { caminar(c, L.lt, { x: s.x + 3, y: .3, z: s.z - 4 - i * 3, ry: 0, speed: 1.6, T: L.T }); });
  cm([s.x - 8, 4.6, s.z + 9, s.x + 1, 2, s.z - 2, 48], [s.x - 6, 4, s.z + 7, s.x + 1, 2, s.z - 2, 42], L.k, easeIn); badge3('red', '3×', s.clone().add(V(0, 4.4, 0)), (L.lt - .4) * 2); }, [[0, 'snow_steps', .5]]);
// 53 «Aber ich erkannte ihn sofort:» — los ojos del narrador se abren: lo reconoce
shot(68.45, 'Z', null, L => { forest(L, 'night'); storm(.014, 1.1); hemi.intensity = .45; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .7); put(ich, WX - 2, .3, -60, PI - .6); actuar(ich, L.lt, [[0, 'idle'], [.5, 'shock', { anti: .2 }]], { T: L.T }); cara(ich, L.T, { expr: L.lt > .5 ? 'shock' : 'worried' }); onFace(ich, 5, .2, 0, 40, L.k, 3.6); }, [[.5, 'gasp', .6]]);
// 54 «Er stand direkt neben dem umgestürzten Baum.» — panorámica del tocón al árbol caído
shot(70.11, 'W', null, L => { forest(L, 'night'); storm(.01, 1.2); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .6); const k = easeInOut(clamp(L.lt / 2.3)); cam([WX - 10, 4.4, -60], [lerp(WX - 4.5, WX + 2, k), 1.6, lerp(-64, -70, k)], 44);
  badge3('tag', 'DER BAUM!', V(WX + 1, 4.6, -70), (L.lt - 1.2) * 2); }, [[0, 'wind', .4], [1.2, 'pop', .4]]);
// 55 «Also wusste ich genau, wo wir waren.» — sonríe decidido; detrás, el árbol caído
shot(72.58, 'C', null, L => { forest(L, 'night'); storm(.012, 1.1); hemi.intensity = .5; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .6); put(ich, WX - 3, .3, -63, PI + .4); actuar(ich, L.lt, [[0, 'fists']], { T: L.T }); cara(ich, L.T, { expr: 'determined' }); onFace(ich, 7, .6, -2.4, 44, L.k, 5.6); }, [[0, 'heartbeat', .4], [.6, 'cloth', .4]]);
// 56 «„Ich kenne den Weg“, sagte ich.» — se lo dice al grupo
shot(74.48, 'R', null, L => { forest(L, 'night'); storm(.01, 1.1); hemi.intensity = .5; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .6); put(ich, WX - 1, .3, -62, PI); actuar(ich, L.lt, [[0, 'point', { anti: .2 }]], { T: L.T }); talk(ich, L.T, 74.48, 75.4, 'determined');
  [lehr, KB[0], KB[3], finn].forEach((c, i) => { put(c, WX - 4 + i * 2.9, .3, -56 - (i % 2), 0); actuar(c, L.lt, [[0, 'idle']], { T: L.T + i, extra: shiver(L.T, .5) }); cara(c, L.T, { expr: 'worried' }); });
  cm([WX + 1, 5, -50, WX - 1, 3.6, -62, 46], [WX + .6, 4.8, -51, WX - 1, 3.6, -62, 44], L.k); bubble(ich, 'Ich kenne den Weg!', (L.lt - .1) * 2); }, [[0, 'wind', .4]]);
// 57 «„Auf den hören wir nicht“, rief Finn.» — Finn grita, con desprecio
shot(76.09, 'C', null, L => { forest(L, 'night'); storm(.01, 1.1); hemi.intensity = .5; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .6); put(finn, WX + 1, .3, -56, PI + .4); actuar(finn, L.lt, [[0, 'point_l', { anti: .2 }]], { T: L.T }); talk(finn, L.T, 76.09, 77.53, 'angry');
  onFace(finn, 7, .6, 2, 44, L.k, 6); bubble(finn, 'Auf den hören wir nicht!', (L.lt - .1) * 2); }, [[0, 'shout', .4]]);
// 58 «Ausgerechnet Finn,» — primer plano de Finn, sonrisa burlona
shot(78.38, 'Z', null, L => { forest(L, 'night'); storm(.01, 1.1); hemi.intensity = .55; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .5); put(finn, WX + 1, .3, -56, PI + .4); actuar(finn, L.lt, [[0, 'cross']], { T: L.T }); cara(finn, L.T, { expr: 'smug' }); onFace(finn, 4.6, .2, 0, 40, L.k, 3.8); }, [[0, 'wind', .4]]);
// 59 «der Junge, der jeden Morgen aus dem Busfenster lacht,» — recuerdo: Finn se ríe en la ventana del bus
shot(79.28, 'F', null, L => { use('BI'); inside(.8, .2); grade.uniforms.sepia.value = .3; const st = BI.SEATS[6]; sit(finn, BX + st.position.x + .3, 1.9, st.position.z, -PI / 2 + .5, {}); actuar(finn, L.lt, [[0, { ...SIT, aRx: 1.6, aRz: .5, aRe: .2, headY: -.6 }]], { T: L.T }); cara(finn, L.T, { expr: 'grin', mouth: 'laugh' });
  const s2 = BI.SEATS[4]; sit(KB[3], BX + s2.position.x + .3, 1.9, s2.position.z, -PI / 2 + .3); applyPose(KB[3], { ...SIT, headY: -.7 }); cara(KB[3], L.T, { expr: 'joy' }); cm([BX - 3.9, 4.8, st.position.z + 4.4, BX - 2.2, 4.4, st.position.z, 46], [BX - 3.9, 4.8, st.position.z + 4, BX - 2.2, 4.4, st.position.z, 44], L.k); }, [[0, 'bus_engine', .6], [.4, 'kids_laugh', .8]]);
// 60 «wenn der Bus an mir vorbeifährt.» — el bus pasa de largo ante el narrador (otro ángulo)
shot(82.1, 'S', null, L => { town(L); grade.uniforms.sepia.value = .35; show(BUS, 3.5, .35, 30 - L.lt * 22, PI); put(ich, -12, .55, 6, PI / 2 - .3); actuar(ich, L.lt, [[0, 'slump']], { T: L.T }); cara(ich, L.T, { expr: 'sad' });
  cm([-6.5, 2.6, -8, -12, 3.6, 7, 48], [-6.7, 2.6, -7, -12, 3.6, 7, 46], L.k); sh(V(-6, 0, 6), 30); }, [[0, 'bus_pass', .8]]);
// 61 «Doch die Lehrerin wusste nicht mehr weiter.» — la profesora, perdida, se lleva las manos a la cabeza
shot(83.45, 'C', null, L => { forest(L, 'night'); storm(.012, 1); hemi.intensity = .5; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .7); put(lehr, WX, .3, -58, PI + .3); actuar(lehr, L.lt, [[0, 'shrug'], [.8, 'hands_head']], { T: L.T }); cara(lehr, L.T, { expr: L.lt < .8 ? 'confused' : 'panic' });
  onFace(lehr, 7.5, 1, -2.4, 44, L.k, 6); }, [[0, 'wind', .5], [.8, 'sigh', .5]]);
// 62 «Und im Dunkeln sah niemand meine Haut.» — todos son siluetas negras iguales (zoom lento)
shot(85.24, 'Z', 'slow', L => { forest(L, 'night'); storm(.03, 1.2); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .8); const g = [KB[0], finn, ich, mad, KB[5]]; g.forEach((c, i) => { put(c, WX - 6 + i * 3, .3, -60 + Math.abs(i - 2) * .6, PI); actuar(c, L.lt, [[0, i === 2 ? 'idle' : 'brace']], { T: L.T + i, extra: shiver(L.T, .4) }); });
  cm([WX, 3.2, -46, WX, 3.2, -60, 50], [WX, 3.3, -50, WX, 3.3, -60, 46], L.k, easeIn); }, [[0, 'wind_howl', .6]]);
// 63 «Sie hörten nur meine Stimme.» — ondas de su voz; las cabezas se giran hacia él
shot(87.47, 'C', null, L => { forest(L, 'night'); storm(.02, 1.2); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .6); put(ich, WX, .3, -60, 0); actuar(ich, L.lt, [[0, { aRx: .6, aLx: .6, aRz: .5, aLz: .5, headX: -.2 }]], { T: L.T });
  [KB[0], finn, mad, KB[5], lehr].forEach((c, i) => { const a = -1 + i * .5, p = V(WX + Math.sin(a) * 7, .3, -60 + Math.cos(a) * 7); put(c, p.x, p.y, p.z, a + PI); const turn = clamp((L.lt - .3 - i * .12) / .3); applyPose(c, { headY: lerp(1.2, 0, turn) }); });
  cm([WX, 14, -48, WX, 0, -60, 52], [WX, 13, -49, WX, 0, -60, 50], L.k); badge3('wave', L.T * 1.2, hp(ich), 1); }, [[0, 'wind', .4]]);
// 64 «Deshalb hörten sie mir zum ersten Mal zu.» — se acercan en corro a escucharle
shot(88.92, 'W', null, L => { forest(L, 'night'); storm(.016, 1); hemi.intensity = .4; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .5); put(ich, WX, .3, -60, 0); actuar(ich, L.lt, [[0, 'point']], { T: L.T }); talk(ich, L.T, 88.92, 91.09, 'determined');
  [KB[0], finn, mad, KB[5], lehr].forEach((c, i) => { const a = -1 + i * .5, r = lerp(7, 4.4, easeOut(clamp(L.lt / 1.1))), p = V(WX + Math.sin(a) * r, .3, -60 + Math.cos(a) * r); put(c, p.x, p.y, p.z, a + PI); actuar(c, L.lt, [[0, 'listen']], { T: L.T + i }); cara(c, L.T, { expr: 'worried' }); });
  cm([WX + 6, 7.4, -48, WX, 2.6, -60, 48], [WX + 5.6, 7, -49, WX, 2.6, -60, 46], L.k); }, [[0, 'snow_steps', .6]]);
// 65 «… zum ersten Mal zu.» — caras atentas a la luz de la nieve
shot(90.1, 'C', null, L => { forest(L, 'night'); storm(.01, 1); hemi.intensity = .6; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .4); const g = [KB[0], mad, KB[5]]; g.forEach((c, i) => { put(c, WX - 2.8 + i * 2.8, .3, -57, PI); actuar(c, L.lt, [[0, 'listen']], { T: L.T + i }); cara(c, L.T, { expr: 'neutral' }); });
  cm([WX, 4, -62, WX, 3.8, -57, 44], [WX, 4, -61.4, WX, 3.8, -57, 42], L.k); }, [[0, 'wind', .3]]);
// 66 «„Alle an den Händen fassen“,» — manos que se buscan y se agarran (primer plano)
shot(91.09, 'Z', null, L => { forest(L, 'night'); storm(.01, 1); hemi.intensity = .45; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .4); const k = easeOut(clamp(L.lt / .7));
  put(KB[0], WX - 1.5, .3, -58, PI / 2); put(mad, WX + 1.5, .3, -58, -PI / 2); applyPose(KB[0], { aLx: lerp(.2, 1.0, k), aLz: -.1 }); applyPose(mad, { aRx: lerp(.2, 1.0, k), aRz: -.1 });
  const a = handP(KB[0], 0), b = handP(mad, 1); hemi.intensity = .8; cam([(a.x + b.x) / 2, a.y + 1.8, a.z + 6.4], [(a.x + b.x) / 2, a.y, a.z], 34); }, [[0, 'cloth', .6], [.6, 'glove_grab', .7]]);
// 67 «sagte ich. „Folgt mir.“» — se forma la fila; él se pone delante y hace la señal
shot(92.31, 'C', null, L => { forest(L, 'night'); storm(.014, 1); hemi.intensity = .45; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .5); const ord = [ich, finn, KB[0], mad, KB[1], lehr]; fila(ord, L.lt, L.T, { x: WX, z: -58, ry: 0, walk: false });
  actuar(ich, L.lt, [[0, { aLx: 2.2, aLz: .2, aRx: HOLD.aRx, aRz: HOLD.aRz }], [.6, { aLx: 1.2, aLz: .8, aRx: HOLD.aRx, aRz: HOLD.aRz }]], { T: L.T }); talk(ich, L.T, 92.31, 93.66, 'determined');
  cm([WX + 7, 4.4, -50, WX, 3, -62, 50], [WX + 6.6, 4.2, -50.6, WX, 3, -62, 48], L.k); bubble(ich, 'Folgt mir!', (L.lt - .7) * 2); }, [[0, 'snow_steps', .5], [.7, 'shout', .3]]);
// 68 «Ich ging vorne» — la cadena entera avanza en la ventisca
shot(93.66, 'W', null, L => { forest(L, 'night'); storm(.016, 1); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .7); const ord = [ich, finn, KB[0], mad, KB[1], KB[2], KB[3], lehr]; const P = fila(ord, L.lt, L.T, { x: WX, z: -56, ry: 0 });
  cm([WX + 10, 5, P[0].z + 4, WX, 2.6, P[3].z, 52], [WX + 10, 5, P[0].z + 6, WX, 2.6, P[3].z + 1, 50], L.k); }, [[0, 'snow_steps', .8], [.6, 'wind', .5]]);
// 69 «und sagte jede Wegmarke laut an.» — él delante, gritando las señales
shot(95.16, 'C', null, L => { forest(L, 'night'); storm(.012, 1); hemi.intensity = .45; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .6); const ord = [ich, finn, KB[0]]; const P = fila(ord, L.lt, L.T, { x: WX, z: -80, ry: 0, speed: 2 }); talk(ich, L.T, 95.16, 96.42, 'shout');
  onFace(ich, 6, .3, 1.8, 44, 0); }, [[0, 'snow_steps', .6]]);
// 70 «Der umgestürzte Baum.» — de noche, la fila pasa el árbol caído agarrada
shot(96.42, 'W', null, L => { forest(L, 'night'); storm(.01, 1.1); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .5); const k = clamp(L.lt / 1.3); put(ich, WX + 1.5, .3 + Math.sin(k * PI) * 2.2, lerp(-74, -64, k), 0); actuar(ich, L.lt, [[0, { lLx: 1.2, lLk: 1.4, aLx: 1.2, aRx: HOLD.aRx, lean: .3 }], [.7, { lRx: 1.2, lRk: 1.4, aRx: HOLD.aRx, lean: .2 }]], { T: L.T });
  put(finn, WX + 1.5, .3, lerp(-77, -74, k), 0); actuar(finn, L.lt, [[0, { aLx: 1.2, lean: .2 }]], { T: L.T }); bubble(ich, 'Der Baum!', (L.lt - .1) * 2); cm([WX + 10, 4.4, -60, WX + 1, 2.6, -70, 46], [WX + 9.4, 4.2, -59, WX + 1, 2.6, -70, 44], L.k); }, [[0, 'wood_creak', .6], [.6, 'snow_crunch', .6]]);
// 71 «Dann der Bach:» — el agua negra del arroyo corre entre el hielo
shot(97.7, 'S', null, L => { forest(L, 'night'); storm(.008, 1); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .4); WD.water.material.emissiveIntensity = .6 + Math.sin(L.T * 4) * .1; cm([WX + 4, 2.4, -16, WX, 0, -25, 46], [WX + 3.6, 2.2, -17, WX, 0, -25, 44], L.k); }, [[0, 'creek', 1]]);
// 72 «sieben flache Steine,» — las 7 piedras se numeran en la oscuridad
shot(98.56, 'C', null, L => { forest(L, 'night'); storm(.008, 1); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .4); cm([WX + 6, 6.5, -14, WX, .2, -25, 46], [WX + 5.4, 6.2, -14.6, WX, .2, -25, 44], L.k); put(ich, WX - .4, .3, -32, 0); actuar(ich, L.lt, [[0, 'point']], { T: L.T });
  WD.STONES.forEach((s, i) => badge3('num', String(i + 1), s.clone().add(V(0, 1.4, 0)), (L.lt - i * .1) * 2.4, .9)); }, [[0, 'creek', .7], [.3, 'pop', .3]]);
// 73 «einer nach dem anderen.» — pies que pasan de piedra en piedra
shot(99.73, 'W', null, L => { forest(L, 'night'); storm(.008, 1); hemi.intensity = .4; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .4); [ich, finn].forEach((c, j) => { const t = L.lt - j * .5, i = clamp(Math.floor(t / .4), 0, 5), f = clamp((t % .4) / .4), a = WD.STONES[i], b = WD.STONES[i + 1]; c.root.visible = true; saltar(c, f * .4, 0, { h: .6, dur: .26, base: [a.x, a.y, a.z], dx: b.x - a.x, dz: b.z - a.z, extra: j ? { aLx: .9 } : { aRx: HOLD.aRx } }); c.root.rotation.y = 0; });
  hemi.intensity = .6; cm([WX - 10, 4.6, -18, WX, 2.6, -27, 48], [WX - 9.6, 4.5, -17.6, WX, 2.6, -27, 46], L.k); }, [[0, 'stone_step', .6], [.4, 'stone_step', .6], [.8, 'stone_step', .6]]);
// 74 «Beim fünften rutschte ein Mädchen ab,» — en la quinta piedra la niña resbala
shot(100.92, 'Z', null, L => { forest(L, 'night'); storm(.008, 1); hemi.intensity = .45; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .4); const s5 = WD.STONES[4]; const k = easeIn(clamp((L.lt - .5) / .5));
  put(mad, s5.x + k * .8, s5.y - k * 1.2, s5.z, 0); actuar(mad, L.lt, [[0, 'idle'], [.5, 'shock', { anti: .1 }]], { T: L.T }); mad.root.rotation.z = -k * .6; cara(mad, L.T, { expr: L.lt > .5 ? 'scream' : 'worried' });
  put(KB[0], WD.STONES[6].x, WD.STONES[6].y, WD.STONES[6].z, 0); actuar(KB[0], L.lt, [[0, { aRx: HOLD.aRx }]], { T: L.T }); put(KB[1], WD.STONES[2].x, WD.STONES[2].y, WD.STONES[2].z, 0); actuar(KB[1], L.lt, [[0, { aLx: .8 }]], { T: L.T });
  cm([s5.x - 7, 3.4, s5.z + 4, s5.x, 1.4, s5.z, 46], [s5.x - 6.6, 3.2, s5.z + 3.6, s5.x, 1.4, s5.z, 44], L.k); badge3('red', '5', s5.clone().add(V(0, 4.6, 0)), (L.lt - .2) * 2); }, [[.5, 'slip', .8], [.7, 'scream_kid', .4]]);
// 75 «bis zu den Knien ins eiskalte Wasser.» — ¡splash! hasta las rodillas (zoom lento)
shot(102.78, 'C', 'slow', L => { forest(L, 'night'); storm(.008, 1); hemi.intensity = .45; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .4); const s5 = WD.STONES[4]; put(mad, s5.x + 1.2, -1.9, s5.z, 0); actuar(mad, L.lt, [[0, { aLx: 1.6, aRx: 1.0, aLz: .4, aRz: .6 }]], { T: L.T, extra: shiver(L.T, 2) }); cara(mad, L.T, { expr: 'cry' });
  SPLASH.forEach((s, i) => { const k = clamp(L.lt / .8 - i * .03); s.visible = k > 0 && k < 1; s.position.set(s5.x + 1.2 + Math.sin(i * 2.3) * 1.6 * k, -.3 + Math.sin(k * PI) * 2.6, s5.z + Math.cos(i * 2.3) * 1.6 * k); s.scale.setScalar(1.2); });
  cm([s5.x + 10, 3, s5.z + 6, s5.x + 1.2, 0, s5.z, 46], [s5.x + 8, 2.6, s5.z + 4.8, s5.x + 1.2, .2, s5.z, 40], L.k, easeIn); }, [[0, 'splash', 1], [.4, 'water_cold', .6]]);
// 76 «Doch weil sich alle festhielten,» — las manos aprietan fuerte (primer plano)
shot(104.7, 'S', null, L => { forest(L, 'night'); storm(.006, 1); hemi.intensity = .5; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .3); put(KB[1], WX - 1.5, .3, -18, PI / 2); put(KB[2], WX + 1.5, .3, -18, -PI / 2);
  const sq = Math.sin(L.T * 14) * .04; applyPose(KB[1], { aLx: 1.0 + sq, aLz: -.1, lean: -.1 }); applyPose(KB[2], { aRx: 1.0 + sq, aRz: -.1, lean: -.1 }); hemi.intensity = .8; const a = handP(KB[1], 0); cam([a.x + .9, a.y + 1.8, a.z + 6.6], [a.x + .9, a.y, a.z], 34); }, [[0, 'glove_grab', .8], [.6, 'strain', .5]]);
// 77 «zog die ganze Reihe sie sofort wieder raus.» — la fila tira y la saca del agua
shot(106.49, 'W', null, L => { forest(L, 'night'); storm(.008, 1); hemi.intensity = .45; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .4); const s5 = WD.STONES[4], k = easeOut(clamp(L.lt / 1.2));
  put(mad, s5.x + lerp(1.2, 0, k), lerp(-1.9, s5.y, k), s5.z, 0); actuar(mad, L.lt, [[0, { aRx: 1.8, aLx: 1.2 }], [1.2, 'relief']], { T: L.T }); cara(mad, L.T, { expr: k > .9 ? 'relief' : 'scared' });
  [[KB[1], 5], [KB[0], 6], [finn, 3]].forEach(([c, si], j) => { const s = WD.STONES[si]; put(c, s.x, s.y, s.z, si > 4 ? PI : 0); actuar(c, L.lt, [[0, { aRx: 1.2, aLx: 1.2, lean: -.35 + k * .2, crouch: .2 }]], { T: L.T + j }); cara(c, L.T, { expr: 'determined' }); });
  cm([s5.x + 9, 3.6, s5.z + 1, s5.x, 1.4, s5.z, 48], [s5.x + 8.6, 3.4, s5.z + 1.4, s5.x, 1.6, s5.z, 46], L.k); }, [[0, 'strain', .7], [.5, 'splash', .6], [1.2, 'cheer_small', .4]]);
// 78 «Dann der Zaun mit dem kaputten Pfosten.» — el poste roto, de noche, la fila pasando
shot(108.66, 'C', null, L => { forest(L, 'night'); storm(.008, 1.1); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .5); const ord = [ich, finn, KB[0], mad]; fila(ord, L.lt, L.T, { x: WX + .6, z: 30, ry: 0, speed: 2 }); const f = WD.FPOST; bubble(ich, 'Der Zaun!', (L.lt - .2) * 2);
  cm([f.x + 5, 3, f.z - 6, f.x + 2, 2, f.z + 2, 44], [f.x + 4.6, 2.9, f.z - 5.6, f.x + 2, 2, f.z + 3, 42], L.k); }, [[0, 'wood_knock', .5], [.6, 'snow_steps', .5]]);
// 79 «Hinter mir:» — mira por encima del hombro
shot(110.66, 'S', null, L => { forest(L, 'night'); storm(.01, 1.1); hemi.intensity = .5; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .5); put(ich, WX, .3, 40, 0); actuar(ich, L.lt, [[0, { headY: 1.0, twist: .4, aRx: HOLD.aRx }]], { T: L.T }); hemi.intensity = .7; cara(ich, L.T, { expr: 'determined', eyes: 'side_r' }); onFace(ich, 7, .4, 2, 44, 0); }, [[0, 'cloth', .5]]);
// 80 «22 Kinder und eine Lehrerin.» — dron: la cadena larguísima en la ventisca, «22»
shot(111.31, 'W', null, L => { forest(L, 'night'); storm(.008, 1.1); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .5); const ord = [ich, finn, mad, ...K, lehr]; const P = fila(ord, L.lt, L.T, { x: WX, z: 46, ry: 0, sp: 2.8, speed: 2, zig: .6 });
  const k = easeOut(clamp(L.lt / 2.3)); cam([WX + 16 + k * 6, 26 + k * 8, P[0].z + 10], [WX, 0, P[11].z], 52); badge('big', '22', W / 2, H * .2, (L.lt - .1) * 1.5); }, [[0, 'snow_steps', .8], [.5, 'wind', .5], [.1, 'pop', .4]]);
// 81 «Eine Stunde lang ließ keiner los.» — las manos de la cadena; «1 STUNDE»
shot(113.66, 'C', null, L => { forest(L, 'night'); storm(.01, 1.1); hemi.intensity = .35; WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .6); const ord = [KB[4], KB[5], KB[6], KB[7], KB[8]]; const P = fila(ord, L.lt, L.T, { x: WX, z: 20, ry: 0, speed: 1.6 });
  cam([P[2].x + 10, 4, P[2].z + 2], [P[2].x, 2.6, P[2].z], 46); badge('tag', '1 STUNDE', W / 2, H * .2, (L.lt - .3) * 1.5); }, [[0, 'snow_steps', .7], [.5, 'clock_tick', .5], [1.2, 'wind', .4]]);
// 82 «Dann sahen wir zwischen den Bäumen» — las caras se levantan: ¡luz!
shot(115.8, 'Z', null, L => { forest(L, 'night'); storm(.008, 1); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .4); WD.EWIN.forEach(p => p.visible = true); EDGE_L.intensity = 80; EDGE_L.position.set(WX, 6, 60); const ord = [ich, finn, KB[0]]; fila(ord, L.lt, L.T, { x: WX, z: 52, ry: 0, walk: false }); const up = clamp((L.lt - .4) / .4);
  ord.forEach(c => { c.setFace({}); cara(c, L.T, { expr: up > .5 ? 'shock' : 'worried' }); applyPose(c, { headX: -.2 * up }); }); hemi.intensity = .4 + up * .2; cm([WX - 1, 4, 60, WX, 3.4, 52, 44], [WX - 1, 4, 59, WX, 3.4, 52, 42], L.k); }, [[0, 'wind', .4], [.4, 'gasp', .5]]);
// 83 «die Lichter von Tannengrund.» — entre los pinos aparecen las ventanas encendidas y la farola (zoom lento)
shot(117.22, 'C', 'slow', L => { forest(L, 'night'); storm(.006, .9); WD.flakes.forEach(f => f.visible = true); blizzard(WD.flakes, camera.position, L.T, .3); WD.EWIN.forEach(p => p.visible = true); WD.LAMP.userData.bulb.material.emissiveIntensity = 3; EDGE_L.intensity = 70; EDGE_L.position.set(WX + 3.4, 11, 70);
  cm([WX - 2, 3.4, 40, WX, 6, 100, 52], [WX - 1.6, 3.6, 46, WX, 6.2, 100, 44], L.k, easeIn); }, [[0, 'wind', .3], [.6, 'dog_bark', .3]]);
// 84 «Unter der ersten Straßenlaterne» — la cadena entra en el círculo de luz cálida
shot(118.77, 'W', null, L => { forest(L, 'night'); night(.004); SNOWM.emissive.setRGB(.05, .07, .14); WD.EWIN.forEach(p => p.visible = true); WD.LAMP.userData.bulb.material.emissiveIntensity = 3; EDGE_L.intensity = 80; EDGE_L.position.set(WX + 3.4, 11, 70);
  const ord = [ich, finn, KB[0], mad, KB[1]]; fila(ord, L.lt, L.T, { x: WX + 2, z: 62, ry: 0, speed: 2.2 }); ord.forEach(c => cara(c, L.T, { expr: 'relief' })); cm([WX + 12, 6, 78, WX + 2, 3, 64, 50], [WX + 11.6, 5.8, 77, WX + 2, 3, 65, 48], L.k); }, [[0, 'snow_steps', .6], [.5, 'lamp_hum', .5]]);
// 85 «konnten wir endlich wieder sehen.» — vuelven los colores y las caras
shot(120.39, 'F', null, L => { forest(L, 'night'); night(.002); SNOWM.emissive.setRGB(.05, .07, .14); hemi.intensity = .9; WD.EWIN.forEach(p => p.visible = true); WD.LAMP.userData.bulb.material.emissiveIntensity = 3; EDGE_L.intensity = 90; bloom.strength = .28; SNOWM.emissive.setRGB(.03, .04, .08); EDGE_L.position.set(WX + 3.4, 11, 70);
  const ord = [KB[0], mad, KB[1], KB[2]]; ord.forEach((c, i) => { put(c, WX + i * 2.9 - 2, .3, 68 + (i % 2), PI); actuar(c, L.lt, [[0, 'idle'], [.3, 'cheer']], { T: L.T + i }); cara(c, L.T, { expr: 'joy' }); }); cm([WX + 2, 4.6, 56, WX + 2, 3.8, 68, 46], [WX + 2, 4.5, 57, WX + 2, 3.8, 68, 44], L.k); }, [[0, 'kids_cheer', .6]]);
// 86 «Und weil jeder wissen wollte,» — se miran unos a otros
shot(122.19, 'C', null, L => { forest(L, 'night'); night(.002); hemi.intensity = .9; WD.EWIN.forEach(p => p.visible = true); WD.LAMP.userData.bulb.material.emissiveIntensity = 3; EDGE_L.intensity = 90; bloom.strength = .28; SNOWM.emissive.setRGB(.03, .04, .08); EDGE_L.position.set(WX + 3.4, 11, 70);
  const a = KB[5], b = KB[6]; put(a, WX, .3, 66, PI / 2 + .3); put(b, WX + 2.8, .3, 66, -PI / 2 - .3); actuar(a, L.lt, [[0, { aRx: -.3 }]], { T: L.T }); actuar(b, L.lt, [[0, { aLx: -.3 }]], { T: L.T }); cara(a, L.T, { expr: 'confused' }); cara(b, L.T, { expr: 'shock' }); cm([WX + 1.4, 6, 77, WX + 1.4, 4.4, 66, 48], [WX + 1.4, 5.9, 76, WX + 1.4, 4.4, 66, 46], L.k); }, [[0, 'murmur', .5]]);
// 87 «wen er die ganze Zeit festgehalten hatte,» — travelling a lo largo de las manos unidas
shot(123.59, 'W', null, L => { forest(L, 'night'); night(.002); hemi.intensity = .9; WD.EWIN.forEach(p => p.visible = true); WD.LAMP.userData.bulb.material.emissiveIntensity = 3; EDGE_L.intensity = 90; bloom.strength = .28; SNOWM.emissive.setRGB(.03, .04, .08); EDGE_L.position.set(WX + 3.4, 11, 70); const ord = [KB[3], KB[4], KB[7], KB[8], KB[9]]; const P = fila(ord, L.lt, L.T, { x: WX - 6, z: 70, ry: PI / 2, walk: false, zig: .4 });
  ord.forEach(c => cara(c, L.T, { expr: 'neutral' })); const k = clamp(L.lt / 1.7); cam([lerp(P[0].x, P[4].x, k), 3.4, 79], [lerp(P[0].x, P[4].x, k), 2.6, 70], 44); }, [[0, 'cloth', .4], [.6, 'snow_steps', .3]]);
// 88 «schauten alle auf ihre Hände.» — todos bajan la vista a sus manos
shot(125.35, 'C', null, L => { forest(L, 'night'); night(.002); hemi.intensity = .9; WD.EWIN.forEach(p => p.visible = true); WD.LAMP.userData.bulb.material.emissiveIntensity = 3; EDGE_L.intensity = 90; bloom.strength = .28; SNOWM.emissive.setRGB(.03, .04, .08); EDGE_L.position.set(WX + 3.4, 11, 70); const ord = [KB[0], mad, KB[1], KB[2], KB[5]]; fila(ord, L.lt, L.T, { x: WX - 4, z: 68, ry: PI / 2, walk: false, zig: .4, extra: { headX: .45 } });
  ord.forEach(c => cara(c, L.T, { expr: 'shock', eyes: 'down' })); cm([WX - 9.5, 7, 77, WX - 9.5, 3, 68, 48], [WX - 9.5, 6.8, 76, WX - 9.5, 3, 68, 46], L.k); }, [[0, 'gasp', .4]]);
// 89 «Direkt hinter mir stand Finn.» — se gira: es Finn (zoom lento)
shot(127.14, 'Z', 'slow', L => { forest(L, 'night'); night(.002); hemi.intensity = .9; WD.EWIN.forEach(p => p.visible = true); WD.LAMP.userData.bulb.material.emissiveIntensity = 3; EDGE_L.intensity = 90; bloom.strength = .28; SNOWM.emissive.setRGB(.03, .04, .08); EDGE_L.position.set(WX + 3.4, 11, 70);
  put(ich, WX + 1.4, .3, 68, -PI + .3 - easeOut(clamp(L.lt / .6)) * .9); put(finn, WX + 1.4 - .3, .3, 65.2, 0); actuar(ich, L.lt, [[0, { aRx: HOLD.aRx }]], { T: L.T }); actuar(finn, L.lt, [[0, { aLx: HOLD.aLx }]], { T: L.T }); cara(ich, L.T, { expr: 'shock' }); cara(finn, L.T, { expr: 'shock' });
  cm([WX + 6, 4.6, 70, WX + 1.2, 4.2, 65.6, 44], [WX + 4.6, 4.5, 69, WX + 1.2, 4.2, 65.4, 38], L.k, easeIn); }, [[0, 'heartbeat', .6]]);
// 90 «Seine Hand lag in meiner.» — primer plano: la mano clara dentro de la mano oscura
shot(128.83, 'C', null, L => { forest(L, 'night'); night(.002); hemi.intensity = 1.0; WD.EWIN.forEach(p => p.visible = true); WD.LAMP.userData.bulb.material.emissiveIntensity = 3; EDGE_L.intensity = 90; bloom.strength = .28; SNOWM.emissive.setRGB(.03, .04, .08); EDGE_L.position.set(WX + 3.4, 11, 68);
  put(ich, WX - 1.3, .3, 64, PI / 2); put(finn, WX + 1.3, .3, 64, -PI / 2); applyPose(ich, { aLx: .9, aLz: -.12, aLe: .1 }); applyPose(finn, { aRx: .9, aRz: -.12, aRe: .1 }); finn.aR.hand.children.forEach(m => m.visible = false); FINN_G.visible = true;
  cam([WX + L.k * .4, 5.6, 71.5], [WX, 3, 64], 40); }, [[0, 'heartbeat', .5], [.4, 'glove_grab', .5]]);
const FINN_G = (() => { const g = new THREE.Group(); finn.aR.hand.add(g); box(.84, .55, .86, mat(0x1a1a1a, { roughness: 1 }), .16, g, 0, -.2, .02); g.visible = false; return g; })();
// 91 «Er starrte darauf,» — Finn mira las manos
shot(130.22, 'S', null, L => { forest(L, 'night'); night(.002); hemi.intensity = 1.0; EDGE_L.intensity = 90; bloom.strength = .28; SNOWM.emissive.setRGB(.03, .04, .08); EDGE_L.position.set(WX + 3.4, 11, 68); WD.LAMP.userData.bulb.material.emissiveIntensity = 3; put(finn, WX + 1.3, .3, 64, -PI / 2 + .3); actuar(finn, L.lt, [[0, { aRx: .9, aRz: -.12, headX: .45 }]], { T: L.T }); cara(finn, L.T, { expr: 'confused', eyes: 'down' }); onFace(finn, 5, .6, 1.2, 40, L.k, 4.4); }, [[0, 'wind', .2]]);
// 92 «als würde er sie zum ersten Mal sehen.» — sus ojos cambian (zoom lento)
shot(131.3, 'C', 'slow', L => { forest(L, 'night'); night(.002); hemi.intensity = 1.0; EDGE_L.intensity = 90; bloom.strength = .28; SNOWM.emissive.setRGB(.03, .04, .08); EDGE_L.position.set(WX + 3.4, 11, 68); WD.LAMP.userData.bulb.material.emissiveIntensity = 3; put(finn, WX + 1.3, .3, 64, -PI / 2 + .3); actuar(finn, L.lt, [[0, { aRx: .9, headX: .3 }]], { T: L.T }); cara(finn, L.T, { expr: L.lt > .9 ? 'sad' : 'confused' }); onFace(finn, 4.4, .2, 0, 38, L.k, 3.2); }, [[0, 'heartbeat', .4]]);
// 93 «Doch statt loszulassen,» — el narrador espera que le suelte
shot(133.0, 'Z', null, L => { forest(L, 'night'); night(.002); hemi.intensity = 1.0; EDGE_L.intensity = 90; bloom.strength = .28; SNOWM.emissive.setRGB(.03, .04, .08); EDGE_L.position.set(WX + 3.4, 11, 68); WD.LAMP.userData.bulb.material.emissiveIntensity = 3; put(ich, WX - 1.3, .3, 64, PI / 2 - .3); actuar(ich, L.lt, [[0, { aLx: .9, headX: .2 }]], { T: L.T }); cara(ich, L.T, { expr: 'worried' }); onFace(ich, 4.6, .2, 0, 40, L.k, 3.8); }, [[0, 'breath_heavy', .4]]);
// 94 «drückte er noch fester.» — las manos aprietan; Finn sonríe
shot(134.33, 'C', null, L => { forest(L, 'night'); night(.002); hemi.intensity = 1.0; WD.EWIN.forEach(p => p.visible = true); EDGE_L.intensity = 90; bloom.strength = .28; SNOWM.emissive.setRGB(.03, .04, .08); EDGE_L.position.set(WX + 3.4, 11, 68); WD.LAMP.userData.bulb.material.emissiveIntensity = 3; put(ich, WX - 1.3, .3, 64, PI / 2 - .2); put(finn, WX + 1.3, .3, 64, -PI / 2 + .2);
  const sq = L.lt > .3 ? Math.sin(L.T * 18) * .03 : 0; applyPose(ich, { aLx: .9 + sq, aLz: -.12 }); applyPose(finn, { aRx: .9 + sq, aRz: -.12 }); cara(ich, L.T, { expr: L.lt > .5 ? 'happy' : 'shock' }); cara(finn, L.T, { expr: L.lt > .4 ? 'smile' : 'neutral' });
  cm([WX, 4.6, 70, WX, 3.8, 64, 46], [WX, 4.5, 69.2, WX, 3.8, 64, 42], L.k); }, [[.3, 'glove_grab', .7], [.6, 'heartbeat', .3]]);
// 95 «Am nächsten Morgen» — mañana soleada; el bus amarillo se acerca a la parada
shot(135.66, 'W', null, L => { town(L); const k = easeOut(clamp(L.lt / 1.1)); show(BUS, 3.5, .35, lerp(40, 14, k), PI); put(ich, -12, .55, 6, PI / 2); actuar(ich, L.lt, [[0, 'idle']], { T: L.T }); cara(ich, L.T, { expr: 'neutral' }); cm([-15.5, 5, -10, -4, 3.6, 12, 52], [-15.3, 4.8, -9, -4, 3.6, 12, 50], L.k); sh(V(-4, 0, 6), 30); }, [[0, 'birds', .5], [.3, 'bus_engine', .7]]);
// 96 «hielt der Schulbus an meiner Haltestelle.» — frena delante de él y se abre la puerta
shot(136.88, 'C', null, L => { town(L); show(BUS, -3.6, .35, 6.5, PI); BUS.userData.door.position.z = 9.6 - easeOut(clamp((L.lt - .4) / .4)) * 2.6; put(ich, -11, .55, 0, PI / 2 + .2); actuar(ich, L.lt, [[0, 'idle'], [.6, 'shock', { anti: .2 }]], { T: L.T }); cara(ich, L.T, { expr: L.lt > .6 ? 'shock' : 'neutral' });
  cm([-9, 4.4, 15, -8, 3.8, -1, 50], [-9.2, 4.3, 14, -8, 3.8, -1, 48], L.k); sh(V(-6, 0, 6), 30); }, [[0, 'brakes_squeak', .8], [.4, 'bus_door', .9]]);
// 97 «Und Finn hatte mir einen Platz freigehalten.» — dentro del bus: Finn da palmaditas al asiento libre
shot(138.46, 'Z', null, L => { use('BI'); inside(.8, .2); const s = BI.SEATS[9]; sit(finn, BX + 2.6 - .8, 1.9, s.position.z, -PI / 2 + .5, { aRx: .9, aRz: -.2 }); actuar(finn, L.lt, [[0, { ...SIT, aRx: .8 + Math.max(0, Math.sin(L.T * 9)) * .3, aRz: -.3 }]], { T: L.T }); finn.root.position.y = 1.9 - 1.85 * .88 + .08; cara(finn, L.T, { expr: 'smile' });
  const w = caminar(ich, L.lt, { x: BX, z: 14, ry: PI, speed: 2.4, stopAt: .9, accel: .3, T: L.T }); cara(ich, L.T, { expr: 'happy' }); [[0, 2], [1, 4], [2, 7], [3, 11]].forEach(([i, si]) => { const t = BI.SEATS[si]; sit(KB[i + 4], BX + t.position.x, 1.9, t.position.z, 0); cara(KB[i + 4], L.T, { expr: 'smile' }); });
  cm([BX - .4, 6.4, -2.6, BX + 1.4, 3.6, s.position.z + 2, 50], [BX - .3, 6.3, -2, BX + 1.4, 3.6, s.position.z + 2, 48], L.k); }, [[0, 'bus_engine', .5], [.4, 'seat_pat', .7], [1.2, 'kids_chatter', .4]]);

// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  else if (i > 0) CUES.push({ t: s.t0 + .04, s: ['zoom_in', 'zoom_out'][i % 2], g: .35 });
  if (s.tr === 'C') CUES.push({ t: +(s.t1 + .01).toFixed(3), s: 'impact', g: .4 }); });
CUES.push({ t: 0, s: 'whoosh_up', g: .9 }); CUES.push({ t: 0, s: 'zoom_fast', g: .9 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); FINN_G.visible = false; finn.aR.hand.children.forEach(m => { if (m !== FINN_G) m.visible = true; }); BAD.length = 0; s.fn(L);
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .78, e); camera.fov *= lerp(1, .9, e); }
  if (i === 0) { const k = clamp(T / .2); camera.fov *= lerp(.62, 1, easeOut(k)); }   // golpe de zoom en el fotograma 0
  let sh_ = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast'].includes(c.s) && T - c.t < .14) sh_ = 1 - (T - c.t) / .14; }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .22 * sh_; camera.position.y += (r() - .5) * .22 * sh_; }
  camaraEnMano(camera, T, STORM === 1 ? 1.6 : 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  const outside = SETS.TG.visible || SETS.WD.visible;
  IBL.update(MODE !== 'in' && STORM !== 1); setViento(T, STORM ? 2.2 : 1);
  AIR.update(T, ctr, MODE === 'in' ? 'polvo' : 'nieve', MODE === 'in' ? .6 : STORM ? 1 : .5);
  BIRDS.update(T, ctr, outside && MODE === 'day' && !STORM && grade.uniforms.sepia.value === 0, false);
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
  for (const b of BAD) drawBadge(b); caption(T);
}
// portadas 1080×1920 (sin spoilers): 0 = los niños se ríen de él en la nieve; 1 = la fila de siluetas en la ventisca
function coverText(l1, l2, col) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * .12, 118, '#ffffff'], [l2, H * .2, 120, col]]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .92 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .22; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }
window.renderCover = v => { const i = v === 0 ? 0 : S.findIndex(s => s.t0 === 93.66); const s = S[i], T = s.t0 + (s.t1 - s.t0) * (v === 0 ? .7 : .6);
  renderShot(i, T, null, 0); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H);
  coverText('IN DIESER STADT', v === 0 ? 'HASST MICH JEDER…' : '…BIS ZU DIESER NACHT', v === 0 ? '#E2FD07' : '#ff5a4a'); };
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;

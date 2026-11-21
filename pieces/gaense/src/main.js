// Gänse — planos sincronizados con audio/words.json (1080×1920, 30 fps). Un plano ≈ 1,7 s, cámara siempre en movimiento.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { hufenbach, zimmer, baeckerei, treppe, taxi, tractor, fireTruck, bus, drawScreen, STAIRS, sign } from './gort.js';
import { makeIch, makePapa, makeLena, makeJonas, makeMayor, makeFahrer, makeKassiererin, makeSie, makeEr, makeKumpel, makeFeuerwehr } from './gvolk.js';
import { makeGoose, poseGoose, gooseWalk, makeHerd, field, lookAt, GCOL } from './gans.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, actuar, mirar, caminar, saltar, luzCielo, viento, setViento, aire, bandada, camaraEnMano } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 100.0, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0012);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.3); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.6); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target);
const rim = rimLight(scene);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 800 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
const ZX = 1000, BX = 1200, TX = 1400;
const HB = hufenbach(scene), ZM = zimmer(scene, ZX), BK = baeckerei(scene, BX), TR = treppe(scene, TX);
const SETS = { HB: HB.G, ZM: ZM.g, BK: BK.g, TR: TR.g };
const BUS = bus(scene, 0x2aa84a, '7 · MARKT'); BUS.scale.setScalar(.85);
const TAXIS = Array.from({ length: 7 }, () => taxi(scene)); const TRAK = tractor(scene); const FT = fireTruck(scene);
// calendario (cuarto) y cartel de la puerta con la cuenta de gansos
const CAL = textPlane(6, 6.6, 300, 330, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8323a'; c.fillRect(0, 0, w, 64); txt(c, 'JUNI', w / 2, 34, 40, '#fff'); for (let i = 0; i < 30; i++) { const x = 30 + (i % 7) * 40, y = 100 + Math.floor(i / 7) * 46; txt(c, String(i + 1), x, y, 24, '#333'); if (i < 8) { c.strokeStyle = '#1a1a1a'; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 14, y - 12); c.lineTo(x + 14, y + 12); c.moveTo(x + 14, y - 12); c.lineTo(x - 14, y + 12); c.stroke(); } if (i === 17) { c.strokeStyle = '#d8323a'; c.lineWidth = 5; c.beginPath(); c.arc(x, y, 19, 0, 7); c.stroke(); txt(c, '🎂', x + 14, y - 16, 20, '#000'); } } });
CAL.position.set(-21.7, 8.6, -2); CAL.rotation.y = Math.PI / 2; ZM.g.add(CAL);
const TALLY = textPlane(3.4, 4.2, 204, 252, (c, w, h) => { c.fillStyle = '#6b4a2e'; c.fillRect(0, 0, w, h); c.fillStyle = '#1e2a24'; c.fillRect(10, 10, w - 20, h - 20); txt(c, 'GÄNSE', w / 2, 44, 34, '#fff'); c.strokeStyle = '#fff'; c.lineWidth = 4; for (let g = 0; g < 6; g++) for (let k = 0; k < 5; k++) { const x = 30 + g * 26 + k * 4, y = 80; c.beginPath(); if (k < 4) { c.moveTo(x, y); c.lineTo(x, y + 40); } else { c.moveTo(x - 18, y + 34); c.lineTo(x + 2, y + 6); } c.stroke(); } txt(c, '311', w / 2, 170, 46, '#fff'); c.strokeStyle = '#ff5a4a'; c.lineWidth = 5; c.beginPath(); c.moveTo(60, 170); c.lineTo(145, 165); c.stroke(); txt(c, '312', w / 2, 220, 52, '#ffd23f'); });
TALLY.position.set(-8.2, 6, 7.5); HB.HAUS.add(TALLY);
// ---------- reparto ----------
const ich = makeIch(scene), papa = makePapa(scene), lena = makeLena(scene), jonas = makeJonas(scene), mayor = makeMayor(scene), fahrer = makeFahrer(scene), kasse = makeKassiererin(scene), sie = makeSie(scene), er = makeEr(scene);
const K = Array.from({ length: 8 }, (_, i) => makeKumpel(scene, i)); const FW = [makeFeuerwehr(scene, 0), makeFeuerwehr(scene, 1)];
kitFace(ich, 'hero'); kitFace(papa, 'mustache'); kitFace(lena, 'girl'); kitFace(jonas, 'plain'); kitFace(mayor, 'mustache'); kitFace(fahrer, 'plain'); kitFace(kasse, 'girl'); kitFace(sie, 'girl'); kitFace(er, 'kid');
K.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'plain', 'girl', 'girl', 'kid', 'hero'][i])); FW.forEach(c => kitFace(c, 'plain'));
const POOL = [ich, papa, lena, jonas, mayor, fahrer, kasse, sie, er, ...K, ...FW];
// ---------- gansos ----------
const GG = Array.from({ length: 10 }, (_, i) => makeGoose(scene, [0, 2, 3, 1, 4, 5, 0, 3, 2, 1][i], { seed: i * 5 + 2, bow: [0xd8323a, null, 0x2a8ad8, null, 0xffd23f, null, null, 0x8a4ad8, null, null][i] }));
// el ganso de Papa (final): gris, gafitas redondas y bigote como él
const PG = makeGoose(scene, 2, { seed: 99, bow: 0x2a4a8a }); { const m = mat(0x1a1a1a); for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.13, .025, 6, 16), m); r.position.set(s * .35, .2, .3); r.rotation.y = s * (Math.PI / 2 - .55); PG.head.add(r); } for (const s of [-1, 1]) { const mu = box(.22, .08, .08, mat(0x5a4a3a), .03, PG.beakU, s * .12, .17, .1); mu.rotation.z = s * -.3; } }
const GALL = [...GG, PG];
const HERD = makeHerd(scene, 720);
// ---------- atrezo ----------
const CROOK = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0x8a5a2a, { roughness: .6 }); cyl(.12, .14, 9, m, 8, g, 0, 0, 0); const hk = new THREE.Mesh(new THREE.TorusGeometry(.7, .13, 8, 20, Math.PI * 1.2), m); hk.position.set(.7, 4.5, 0); hk.rotation.z = -.3; g.add(hk); return g; })();
const CARD = textPlane(2.4, 1.7, 360, 255, (c, w, h) => { c.fillStyle = '#fff6e8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ff6a9a'; c.lineWidth = 10; c.strokeRect(8, 8, w - 16, h - 16); txt(c, 'EINLADUNG 🎂', w / 2, 48, 40, '#d8323a'); txt(c, 'Lenas Geburtstag', w / 2, 100, 30, '#333'); txt(c, 'Lindenstraße 4', w / 2, 150, 30, '#333'); txt(c, '4. STOCK', w / 2, 205, 50, '#2a4a8a'); });
CARD.material.side = THREE.DoubleSide; scene.add(CARD);
const GIFT = (() => { const g = new THREE.Group(); scene.add(g); box(1.4, 1.2, 1.4, mat(0x3ab8ff, { roughness: .4 }), .08, g, 0, 0, 0); box(.25, 1.25, 1.45, mat(0xffd23f), .03, g, 0, 0, 0); box(1.45, 1.25, .25, mat(0xffd23f), .03, g, 0, 0, 0); for (const s of [-1, 1]) { const b = box(.5, .3, .2, mat(0xffd23f), .08, g, s * .25, .75, 0); b.rotation.z = s * .4; } return g; })();
const TICKET = textPlane(.9, .45, 90, 45, (c, w, h) => { c.fillStyle = '#ffd23f'; c.fillRect(0, 0, w, h); txt(c, '½', w / 2, h / 2 + 2, 32, '#d8323a'); }); TICKET.material.side = THREE.DoubleSide; scene.add(TICKET);
const MIC = (() => { const g = new THREE.Group(); scene.add(g); cyl(.06, .06, 4.2, mat(0x2a2a2a, { metalness: .7 }), 6, g, 0, 2.1, 0); sphere(.25, mat(0x3a3a3a, { metalness: .6 }), g, 0, 4.4, .2, 10, 8); cyl(.6, .6, .1, mat(0x2a2a2a), 12, g, 0, .05, 0); return g; })();
const MUG = (() => { const g = new THREE.Group(); scene.add(g); cyl(.35, .32, .7, mat(0xd8323a, { roughness: .3 }), 14, g, 0, 0, 0); const h = new THREE.Mesh(new THREE.TorusGeometry(.2, .06, 6, 12), mat(0xd8323a)); h.position.x = .38; g.add(h); return g; })();
const HAT = (() => { const c = new THREE.Mesh(new THREE.ConeGeometry(.45, 1.2, 14), mat(0xffffff, { map: (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 64; const x = cv.getContext('2d'); for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#ff4a8a' : '#ffd23f'; x.fillRect(0, i * 8, 64, 8); } const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; })() })); scene.add(c); return c; })();
const CHAIRS = Array.from({ length: 2 }, () => { const g = new THREE.Group(); scene.add(g); const m = mat(0x2a6a4a, { metalness: .5, roughness: .4 }); box(2.2, .25, 2.2, m, .08, g, 0, 2.3, 0); box(2.2, 2.4, .2, m, .08, g, 0, 3.6, -1.0); for (const [x, z] of [[-.9, -.9], [.9, -.9], [-.9, .9], [.9, .9]]) cyl(.08, .08, 2.3, m, 6, g, x, 1.15, z); return g; });
const FEATH = Array.from({ length: 26 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.35, .7), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .9, side: THREE.DoubleSide })); scene.add(p); return p; });
const CONF = Array.from({ length: 40 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.22, .34), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
// cabina del bus (primer plano del conductor): asiento, salpicadero, volante, mampara verde con ventanas
const CAB = (() => { const g = new THREE.Group(); g.position.set(600, 0, 0); scene.add(g); const gr = mat(0x2aa84a, { roughness: .4 }), dk = mat(0x2a2e36, { roughness: .5 });
  box(14, .4, 14, mat(0x3a3e46), 0, g, 0, 0, 0); box(14, 12, .4, gr, .1, g, 0, 6, -5); const wv = textPlane(10, 4, 300, 120, (c, w, h) => { const gg = c.createLinearGradient(0, 0, 0, h); gg.addColorStop(0, '#8ac8f4'); gg.addColorStop(1, '#d8f0ff'); c.fillStyle = gg; c.fillRect(0, 0, w, h); c.fillStyle = '#5cc24a'; c.fillRect(0, h * .75, w, h * .25); c.fillStyle = '#f2b8c6'; c.fillRect(30, 30, 60, 60); c.fillStyle = '#a8d8f0'; c.fillRect(180, 20, 80, 70); }, .5); wv.position.set(0, 8, -4.75); g.add(wv);
  box(4, 3, 3.6, dk, .3, g, 0, 1.8, -1.4); box(4.2, 4.4, .6, dk, .3, g, 0, 4.2, -3.0); box(8, 2.6, 3, dk, .3, g, 0, 3.6, 4.6); const sw = new THREE.Mesh(new THREE.TorusGeometry(1.3, .16, 8, 28), mat(0x1a1a1a)); sw.position.set(0, 5.6, 3.0); sw.rotation.x = -.9; g.add(sw); cyl(.15, .15, 1.6, mat(0x1a1a1a), 8, g, 0, 4.9, 3.5).rotation.x = -.9;
  for (let k = 0; k < 3; k++) sphere(.12, mat([0x3aff6a, 0xffd23f, 0xff4a4a][k], { emissive: [0x3aff6a, 0xffd23f, 0xff4a4a][k], emissiveIntensity: 1.5 }), g, -2 + k * .5, 5.0, 5.6, 8, 6);
  const L = new THREE.PointLight(0xfff4e0, 60, 30, 1.4); L.position.set(3, 10, 6); g.add(L); g.visible = false; return g; })();
const SWEAT = sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8);
const PROPS = [CAB, BUS, ...TAXIS, TRAK, FT, CROOK, CARD, GIFT, TICKET, MIC, MUG, HAT, ...CHAIRS, ...FEATH, ...CONF, SWEAT];
// ---------- ambiente ----------
const IBL = luzCielo(renderer, scene, sky.sky, .5); const AIR = aire(scene, 400); const BIRDS = bandada(scene, 9); viento(HB.G);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day';
function day() { MODE = 'day'; setSky([.22, .5, .95], [.5, .74, 1], [.84, .93, 1]); hemi.intensity = 1.3; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.55, .62, .45); sun.intensity = 2.6; sun.color.setRGB(1, .95, .86); rim.intensity = 1.1; scene.fog.color.setRGB(.82, .9, 1); scene.fog.density = .0011; bloom.strength = .22; }
function morning() { day(); setSky([.3, .5, .9], [.7, .76, .95], [1, .86, .7]); sun.color.setRGB(1, .86, .66); sun.intensity = 2.3; hemi.intensity = 1.15; scene.fog.color.setRGB(.95, .88, .8); bloom.strength = .3; }
function inside(h = .8, s = .2) { MODE = 'in'; hemi.intensity = h; sun.intensity = s; bloom.strength = .3; scene.fog.density = .0002; }
function nightIn() { MODE = 'in'; setSky([.01, .02, .07], [.04, .06, .16], [.08, .11, .24]); hemi.intensity = .25; hemi.color.setRGB(.5, .6, 1); hemi.groundColor.setRGB(.2, .2, .3); sun.intensity = 0; rim.intensity = .6; bloom.strength = .5; scene.fog.density = .0002; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); }
  for (const g of GALL) { g.root.visible = false; g.root.scale.setScalar(g.scale); g.root.rotation.set(0, 0, 0); g.setEyes('normal'); if (g.root.parent !== scene) { g.root.parent.remove(g.root); scene.add(g.root); } }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(p === BUS ? .85 : 1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const k in SETS) SETS[k].visible = false; HERD.set([]);
  HB.CURT.forEach(c => c.position.x = c.userData.s < 0 ? -6.6 : -1.4); HB.DOOR.rotation.y = 0; BUS.userData.door.position.z = 9.6; FT.userData.ladder.rotation.x = 0; ZM.DESK.intensity = 0; ZM.LMP.intensity = 120;
  ZM.lapS.draw((c, w, h) => drawScreen(c, w, h, false)); ZM.phS.draw((c, w, h) => drawScreen(c, w, h, false)); ZM.tvS.draw((c, w, h) => drawScreen(c, w, h, false)); ZM.frS.draw((c, w, h) => drawScreen(c, w, h, false));
  papa.root.traverse(m => { if (m.isMesh && m.userData.skin0) m.material.color.copy(m.userData.skin0); });
  grade.uniforms.vig.value = .36; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.42; grade.uniforms.sharp.value = .9; grade.uniforms.sepia.value = 0; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const gp = g => { g.root.updateMatrixWorld(true); return g.head.getWorldPosition(V(0, 0, 0)); };
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + dy, h.z + fz * d - fx * side], [h.x, h.y - .3, h.z], fov); }
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
const handP = (ch, r = 1) => { ch.root.updateMatrixWorld(true); return (r ? ch.aR : ch.aL).hand.getWorldPosition(V(0, 0, 0)); };
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
    case 'sus': case 'smug': return n > .2 ? 'squint' : 'half';
    case 'bored': return 'half';
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk') => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat' });
const SIT = { crouch: .2, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aLz: .15, aRz: .15 };
const sit = (ch, x, y, z, ry, extra = {}) => { const s = ch.spec.scale || 1; put(ch, x, y - (2.05 - .2) * s + .08, z, ry); applyPose(ch, { ...SIT, ...extra }); };
// gansos: helpers
const goose = (g, x, z, ry, T, p = {}) => { g.root.visible = true; g.root.position.set(x, p.y ?? 0, z); g.root.rotation.set(0, ry, 0); poseGoose(g, T, p); return g; };
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
// estela de gansos que siguen a alguien: devuelve lista para la bandada (se colocan detrás de la posición p con orientación ry)
function trail(p, ry, n, T, o = {}) { const L = [], r = RNG(o.seed ?? 3); for (let i = 0; i < n; i++) { const row = Math.floor(i / (o.w ?? 3)), col = i % (o.w ?? 3) - ((o.w ?? 3) - 1) / 2; const back = (o.gap ?? 4) + row * (o.sp ?? 2.6), side = col * (o.sp ?? 2.6) + (r() - .5) * 1.2;
    L.push({ x: p.x - Math.sin(ry) * back + Math.cos(ry) * side, z: p.z - Math.cos(ry) * back - Math.sin(ry) * side, ry: ry + (r() - .5) * .3, ph: r(), walk: o.walk ?? 1, ci: Math.floor(r() * 6), look: (r() - .5) * .5 }); } return L; }
// plumas al aire (estallido o lluvia)
function feathers(c, T0, T, n = 26, sp = 4, life = 1.4) { FEATH.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 7 + 1), t = T - T0; if (t < 0 || t > life + r() * .5) return; f.visible = true; const a = r() * 6.283, v = sp * (.5 + r());
  f.position.set(c.x + Math.cos(a) * v * Math.min(t, .5) * 1.5, c.y + v * .6 * Math.min(t, .4) * 2 - t * t * 1.2 + 1, c.z + Math.sin(a) * v * Math.min(t, .5) * 1.5); f.rotation.set(T * 3 + i, T * 2 + i * 2, Math.sin(T * 5 + i)); f.scale.setScalar(1 - Math.max(0, t - life) * 2); }); }
function confetti(c, T0, T) { CONF.forEach((f, i) => { const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = 3 + r() * 5; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2, c.y + 3 + v * Math.min(t, .3) * 2 - t * t * 4, c.z + Math.sin(a) * v * Math.min(t, .4) * 2); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
const sweat = (ch, T) => { const h = hp(ch); const k = (T * .8) % 1; SWEAT.visible = true; SWEAT.position.copy(h).add(V(.5, 1.3 - k * .9, .45)); SWEAT.scale.set(1, 1.4, 1); };

// ---------- capa 2D ----------
const BAD = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; b.x = clamp(x, 200, W - 200); b.y = clamp(y, 180, H * .64); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num') { c.font = `700 ${b.kind === 'num' ? 74 : 100}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 620) { const k = 620 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#5a0010' : '#1d2238'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 52px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#1d2238'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 44px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  c.restore(); }
const KEY = /^(Stadt|Gans|goonst|immer|jeder|40|Gänse|Dates|hart|beide|Kino|halben|Preis|Kumpel|ausgelacht|nie|Bürgermeister|Traktor|niemand|Nummer|zwei|312|Bus|Hirtenstab|Moses|Meer|Federn|Tür|Papa|Vorhänge|Junge|recht|Lena|Bäckerei|Geburtstag|Hause|Problem|vierter|Aufzug|Treppenhaus|keine|10|Tage|Nacht|Corn|allem|Bildschirm|Handy|Laptop|Fernseher|Kühlschrank|ersten|zweimal|dritten|Kopf|davon|sechsten|Taxikolonnen|neunten|Busfahrer|einsteigen|weinen|vier|allein|Jonas|Feuerwehr|knallrot|mir)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
const town = (L, m = 'day') => { use('HB'); if (m === 'morning') morning(); };
const plazaHerd = (n, seed, o = {}) => field(o.cx ?? -6, o.cz ?? -10, o.w ?? 90, o.d ?? 120, n, seed, { walk: 1, spread: 6.28, ...o });
// Herd de fondo de la plaza (gente con sus gansos): grupos que caminan
function townLife(L, n = 120, seed = 7) { const l = plazaHerd(n, seed, { honk: .1 }); for (const q of l) { q.x += Math.sin(q.ry) * L.T * 1.2; q.z += Math.cos(q.ry) * L.T * 1.2; q.x = ((q.x + 56) % 100 + 100) % 100 - 56; q.z = ((q.z + 90) % 150 + 150) % 150 - 90; } return l; }

// 1 «In dieser Stadt» — golpe de zoom: yo camino hacia la cámara con el cayado y detrás me sigue una marea de gansos (travelling hacia atrás, cámara baja)
shot(0, 'Z', null, L => { town(L); const p = caminar(ich, L.lt + .6, { x: 4, z: 14, ry: 0, speed: 3.2, T: L.T, extra: { aRx: .5, aRe: 1.0, aRz: .1 } }); attach(CROOK, ich.aR.hand, [0, -.3, .4], [PI - .4, 0, 0], 1.0); cara(ich, L.T, { expr: 'bored', eyes: 'half' });
  const l = trail(p, 0, 320, L.T, { w: 16, gap: 4.5, sp: 2.4, seed: 101 }).map(q => ({ ...q, honk: Math.random() < .2, flap: q.x % 7 < .6 ? 1 : 0 })); HERD.set(l); goose(GG[0], p.x - 3.2, p.z - 3.4, .15, L.T, { walk: L.T * 1.9, moving: 1, neck: .8, eyes: 'normal' }); goose(GG[2], p.x + 3.4, p.z - 4, -.1, L.T, { walk: L.T * 1.9 + .5, moving: 1, neck: .7, honk: Math.max(0, Math.sin(L.T * 9)) });
  feathers(V(p.x, 3, p.z - 8), 0, L.T, 16, 3, 2);
  cm([p.x + 3, 6.4, p.z + 11, p.x, 1.4, p.z - 5, 58], [p.x + 2.4, 8.4, p.z + 15, p.x, .6, p.z - 9, 56], L.k, easeOut); sh(V(p.x, 0, p.z - 10), 40); }, [[0, 'honk_crowd', .8], [.1, 'steps', .5], [.3, 'feathers', .5]]);
// 2 «kriegst du jedes Mal eine Gans,» — un chico cruza la plaza llena de vida… ¡puf! le aparece un ganso al lado y se lleva un susto
shot(.82, 'C', null, L => { town(L); const pop = L.T - 2.18; const p = caminar(K[0], L.lt, { x: -26.6, z: 9.4, ry: .5, speed: 2.6, stopAt: 1.24, accel: .14, T: L.T }); const c = K[0];
  if (pop > 0) { actuar(c, pop, [[0, 'recoil', { anti: .2 }]], { T: L.T }); c.root.position.set(p.x, 0, p.z); } cara(c, L.T, { expr: pop > 0 ? 'shock' : 'neutral', eyes: pop > 0 ? 'wide' : undefined });
  HERD.set(townLife(L, 140, 2).filter(q => Math.hypot(q.x - p.x, q.z - p.z) > 7)); [[K[4], -40, 2, 1.2], [K[6], -12, 30, -2.4], [K[5], -44, 26, 2.2]].forEach(([w, x, z, ry], i) => { const q = caminar(w, L.lt, { x, z, ry, speed: 2.4, T: L.T + i }); cara(w, L.T, { expr: 'neutral' }); HERD.list.push(...trail(q, ry, 5 + i * 2, L.T, { seed: 20 + i })); });
  if (pop > 0) { const s = spring(clamp(pop / .35)); goose(GG[0], p.x + 3, p.z - 1.8, -1.2, L.T, { neck: .8, pitch: -.2, eyes: 'normal' }); GG[0].root.scale.setScalar(GG[0].scale * s); feathers(V(p.x + 3, 1, p.z - 1.8), 2.18, L.T, 22, 3); }
  cam([p.x + 9.5, 5, p.z + 8.5], [p.x + 1.2, 3.4, p.z + 1.2], lerp(48, 42, easeInOut(L.k))); sh(V(p.x, 0, p.z), 25); }, [[0, 'steps', .5], [.4, 'city_amb', .4], [1.36, 'pop', .8], [1.38, 'feathers', .7], [1.45, 'honk', .7], [1.5, 'gasp', .5]]);
// 3 «wenn du goonst.» — se rasca la nuca, colorado; el ganso le mira de reojo
shot(2.6, 'Z', null, L => { town(L); const c = put(K[0], -24, 0, 14, .5); actuar(c, L.lt, [[0, { aRx: 2.5, aRz: .65, aRe: 2.0, headZ: .15, headX: .08, lean: .05 }]], { T: L.T }); cara(c, L.T, { expr: 'smile', eyes: 'side_r', mouth: 'grimace' }); sweat(c, L.T);
  goose(GG[0], -21.6, 16.6, -2.4, L.T, { neck: .9, pitch: .25, yaw: -.3, eyes: 'sus' }); cm([-25.6, 5.2, 26, -22.6, 4.0, 15.2, 42], [-25.2, 5, 24.6, -22.6, 4.0, 15.2, 38], L.k); sh(V(-22, 0, 15), 20); }, [[.1, 'honk', .5], [.3, 'cloth', .4]]);
// 4 «Sie taucht einfach auf und folgt dir für immer.» — camina por la plaza y el ganso le sigue (luego dos, luego tres)
shot(3.35, 'W', null, L => { town(L); const p = caminar(K[0], L.lt, { x: -26, z: 20, ry: -PI / 2 + .3, speed: 2.8, T: L.T }); cara(K[0], L.T, { expr: 'worried', eyes: 'side_l' });
  const ry = -PI / 2 + .3; [0, 1, 2].forEach(i => { if (i > 0 && L.T < 4.4 + i * .4) return; const back = 4.6 + i * 3.2, side = i ? (i % 2 ? 1.6 : -1.6) : 0; const g = GG[i]; gooseWalk(g, L.lt, { x: -26 - Math.sin(ry) * back + Math.cos(ry) * side, z: 20 - Math.cos(ry) * back + Math.sin(ry) * side, ry, speed: 2.8, T: L.T, p: { neck: .7 } }); if (i > 0) { const k = spring(clamp((L.T - 4.4 - i * .4) / .3)); g.root.scale.setScalar(g.scale * k); } });
  cam([p.x - 4, 4.2, p.z + 17], [p.x + 3.4, 2.8, p.z], 48); sh(V(p.x, 0, p.z), 25); }, [[0, 'steps', .5], [.2, 'honk', .4], [1.05, 'pop', .5], [1.45, 'pop', .5]]);
// 5 «Deshalb weiß es jeder,» — los vecinos le señalan y cuchichean al verle pasar con su fila de gansos
shot(5.58, 'S', null, L => { town(L); const p = caminar(K[0], L.lt, { x: -6, z: 30, ry: -PI / 2, speed: 2.6, T: L.T }); cara(K[0], L.T, { expr: 'sad', eyes: 'down' }); HERD.set(trail(p, -PI / 2, 9, L.T, { seed: 5 }));
  [[K[2], -16, 40, PI, 'point'], [K[5], -12.4, 41.4, PI - .3, { aRx: 2.3, aRz: -.4, aRe: 2.2, lean: .1, headZ: .25 }], [K[7], -19.6, 41, PI + .2, 'cross']].forEach(([c, x, z, ry, g], i) => { put(c, x, 0, z, ry); actuar(c, L.lt, [[0, g]], { T: L.T + i }); cara(c, L.T, { expr: ['grin', 'smug', 'sus'][i] }); });
  cm([-1, 4.6, 20, -13, 3.4, 37, 50], [-2, 4.4, 21.4, -13, 3.4, 37, 48], L.k); sh(V(-12, 0, 36), 28); }, [[0, 'whisper', .6], [.4, 'laugh_deep', .3], [.2, 'honk', .3]]);
// 6 «denn 40 Gänse kann man nicht verstecken.» — se esconde detrás de un árbol… y asoman 40 gansos por los lados
shot(6.77, 'R', null, L => { town(L); const T0 = V(-42, 0, -6); put(K[0], T0.x + 1.6, 0, T0.z + 2.6, PI / 2); actuar(K[0], L.lt, [[0, { lean: -.05, aLx: .2, aRx: .2, aLz: -.1, aRz: -.1 }]], { T: L.T }); cara(K[0], L.T, { expr: 'worried', eyes: 'side_l' });
  const l = []; const r = RNG(40); for (let i = 0; i < 40; i++) { const a = -1.5 + (i / 39) * 3, rr = 4.5 + (i % 3) * 2.6; l.push({ x: T0.x + 3 + Math.cos(a) * rr * .6 + 2, z: T0.z + 1 + Math.sin(a) * rr * 1.5, ry: PI / 2 + (r() - .5) * .6, ph: r(), walk: 0, ci: i % 6, look: (r() - .5) }); } HERD.set(l);
  const k = easeOut(L.k); cam([T0.x + lerp(12, 34, k), lerp(4, 9, k), T0.z + 2], [T0.x + 1, 2.6, T0.z + 1], lerp(44, 50, k)); badge('num', '40', W / 2, H * .2, (L.lt - .2) * 2, 1, 1.4); sh(V(T0.x + 6, 0, T0.z), 30); }, [[0, 'honk_crowd', .6], [.2, 'feathers', .4], [.3, 'pop', .6]]);
// 7 «Erste Dates sind hart.» — mesa del café: ella y él, incómodos
const TB = V(36, 0, -40); const date = (L, eS, eE) => { show(CHAIRS[0], TB.x, 0, TB.z - 3.4, 0); show(CHAIRS[1], TB.x, 0, TB.z + 3.4, PI); sit(sie, TB.x, 2.55, TB.z - 3.2, 0, { aLx: 1.2, aRx: 1.2, aLe: 1.0, aRe: 1.0 }); sit(er, TB.x, 2.55, TB.z + 3.2, PI, { aLx: 1.1, aRx: 1.1, aLe: 1.2, aRe: 1.2 }); cara(sie, L.T, { expr: eS }); cara(er, L.T, { expr: eE }); };
shot(8.86, 'Z', null, L => { town(L); date(L, 'smile', 'worried'); applyPose(er, { ...SIT, aLx: 1.1, aRx: 1.1, aLe: 1.2, aRe: 1.2, headX: .2 }); sweat(er, L.T); const a = lerp(-1.2, -1.6, easeInOut(L.k)); cam([TB.x + Math.sin(a) * 13, 6.6, TB.z + Math.cos(a) * 13], [TB.x, 4, TB.z], 46); sh(TB, 20); }, [[0, 'cup_rattle', .5], [.5, 'sip', .5], [1.0, 'cough', .4]]);
// 8 «Sie schaut dich an, du schaust sie an.» — ella le mira (de ella a él con barrido de cámara)
shot(10.29, 'C', null, L => { town(L); date(L, L.T < 11.21 ? 'love' : 'smile', L.T < 11.21 ? 'worried' : 'smile'); const k = easeInOut(clamp((L.T - 11.0) / .4));
  const fS = hp(sie), fE = hp(er); cam([lerp(fS.x + 3.6, fE.x - 3.6, k), 5.6, lerp(fS.z + 6.4, fE.z - 6.4, k)], [lerp(fS.x, fE.x, k), lerp(fS.y, fE.y, k) + .5, lerp(fS.z, fE.z, k)], 40); sh(TB, 20); }, [[0, 'cloth', .3], [.9, 'cup_marble', .25]]);
// 9 «Und die Gänse schauen euch beide an.» — zoom out: decenas de gansos alrededor de la mesa, todos mirando fijamente
shot(12.21, 'R', null, L => { town(L); date(L, 'side_l', 'side_r'); cara(sie, L.T, { expr: 'worried', eyes: 'side_l' }); cara(er, L.T, { expr: 'worried', eyes: 'side_r' });
  const l = []; const r = RNG(12); for (let i = 0; i < 70; i++) { const a = (i / 70) * 6.283, rr = 7 + (i % 4) * 2.8 + r(); const x = TB.x + Math.cos(a) * rr, z = TB.z + Math.sin(a) * rr; if (x > 41) continue; l.push({ x, z, ry: Math.atan2(TB.x - x, TB.z - z), ph: r(), walk: 0, ci: i % 6, look: 0, up: -.15 }); } HERD.set(l);
  goose(GG[1], TB.x - 5, TB.z + .5, PI / 2, L.T, { neck: 1, eyes: 'wide', pitch: -.1 }); const k = easeOut(L.k); cam([TB.x - lerp(8, 20, k), lerp(6, 18, k), TB.z - lerp(4, 10, k)], [TB.x, 3, TB.z], 50); sh(TB, 30); }, [[0, 'honk', .6], [.3, 'honk_crowd', .5], [.8, 'cricket', .4]]);
// 10 «Sogar das Kino hat sich angepasst:» — grúa desde la cola de gansos hasta la marquesina «VOM WINDE VERGANST»
shot(13.74, 'S', null, L => { town(L); const l = []; for (let i = 0; i < 18; i++) l.push({ x: -44 + (i % 2) * 2.4, z: -22 + Math.floor(i / 2) * 3.2, ry: PI, ph: i * .13, walk: 0, ci: i % 6, look: 0 }); HERD.set(l);
  [[K[6], -46, -14, PI], [K[4], -42, -9, PI + .2]].forEach(([c, x, z, ry], i) => { put(c, x, 0, z, ry); actuar(c, L.lt, [[0, 'idle']], { T: L.T + i }); cara(c, L.T, { expr: 'neutral' }); });
  cm([-30, 3, -4, -46, 4, -20, 50], [-26, 16, 0, -52, 16, -28, 48], L.k); sh(V(-48, 0, -20), 30); }, [[0, 'film_roll', .5], [.4, 'honk', .4], [.8, 'city_amb', .4]]);
// 11 «Gänse zahlen dort nur den halben Preis.» — la pizarra: «Gans 4,50 € — ½ PREIS»; el ganso se va con su entrada en el pico
shot(15.39, 'C', null, L => { town(L); put(kasse, -50.6, 0, -28, PI / 2); actuar(kasse, L.lt, [[0, 'idle'], [.6, { aRx: 1.4, aRe: .3 }]], { T: L.T }); cara(kasse, L.T, { expr: 'smile' });
  const g = goose(GG[4], -45, -26.5, -PI / 2, L.T, { neck: .9, pitch: .1 }); if (L.lt > .9) { attach(TICKET, GG[4].beakU, [0, .1, .5], [0, PI / 2, 0], 1); } put(K[6], -44, 0, -31, -PI / 2 + .2); actuar(K[6], L.lt, [[0, 'idle']], { T: L.T }); cara(K[6], L.T, { expr: 'happy' });
  cm([-40, 5.4, -15, -50, 4.6, -19.5, 40], [-39, 4.6, -21, -48, 3.8, -27, 46], L.k); sh(V(-48, 0, -24), 20); }, [[0, 'chalk', .5], [.6, 'cash_reg', .6], [.9, 'paper', .5], [1.2, 'honk', .5]]);
// 12 «Und wer behauptet, die Gans gehöre seinem Kumpel,» — señala a su colega: «¡Es de él!»
const KP = V(-14, 0, -48);
shot(17.39, 'W', null, L => { town(L); put(K[1], KP.x, 0, KP.z, .4); actuar(K[1], L.lt, [[0, 'idle'], [.7, 'point', { anti: .2 }]], { T: L.T }); talk(K[1], L.T, 17.39, 19.54, 'smug'); put(K[2], KP.x + 5, 0, KP.z + 1.5, -1.4); actuar(K[2], L.lt, [[0, 'idle'], [1.0, 'shrug']], { T: L.T }); cara(K[2], L.T, { expr: L.lt > 1 ? 'confused' : 'neutral' });
  put(K[3], KP.x + 7, 0, KP.z - 2.4, -.8); actuar(K[3], L.lt, [[0, 'cross']], { T: L.T }); cara(K[3], L.T, { expr: 'sus' }); goose(GG[2], KP.x - 2.2, KP.z + 2.4, .7, L.T, { neck: .8, yaw: .4, eyes: 'normal' });
  bubble(K[1], 'Die gehört meinem Kumpel!', (L.lt - .5) * 2); cm([KP.x + 2, 5, KP.z + 17, KP.x + 1.6, 3.6, KP.z + 1, 46], [KP.x - 1, 5.2, KP.z + 16, KP.x + 1.6, 3.6, KP.z + 1, 44], L.k); sh(KP, 22); }, [[0, 'steps', .4], [.5, 'honk', .4], [1.2, 'shout_m', .3]]);
// 13 «wird ausgelacht, weil sie nie dem Kumpel gehört.» — todos se ríen; el ganso se frota cariñoso contra su pierna
shot(19.54, 'Z', null, L => { town(L); put(K[1], KP.x, 0, KP.z, .4); actuar(K[1], L.lt, [[0, 'shrug'], [.9, 'facepalm']], { T: L.T }); cara(K[1], L.T, { expr: L.lt > .9 ? 'sad' : 'worried' });
  [[K[2], KP.x + 5, KP.z + 1.5, -1.4], [K[3], KP.x + 7, KP.z - 2.4, -.8], [K[7], KP.x - 4.6, KP.z - 2.6, .9]].forEach(([c, x, z, ry], i) => { put(c, x, 0, z, ry); actuar(c, L.lt, [[0, { lean: -.2, aLx: .6, aRx: .6, aLe: 1.6, aRe: 1.6, headX: -.3, crouch: .05 + Math.abs(Math.sin(L.T * 14 + i)) * .06 }]], { T: L.T + i }); cara(c, L.T, { expr: 'joy', mouth: 'laugh' }); });
  const rub = Math.sin(L.T * 6) * .25; goose(GG[2], KP.x - 1.2, KP.z + 1.6, .2 + rub, L.T, { neck: .5, pitch: .4, tilt: .3 + rub, eyes: 'happy' });
  cm([KP.x - 2, 4.4, KP.z + 13, KP.x, 3, KP.z + 1.4, 46], [KP.x - 1.6, 4, KP.z + 10.4, KP.x, 3.2, KP.z + 1, 44], L.k); sh(KP, 22); }, [[0, 'laugh_deep', .7], [.4, 'kids_laugh', .4], [1.2, 'honk', .4], [1.6, 'cloth', .4]]);
// 14 «Der Bürgermeister hat so viele,» — grúa desde el reloj del Rathaus hasta el alcalde ante un mar de gansos
const RHF = V(-6, 0, -76);
shot(21.93, 'S', null, L => { town(L); put(mayor, RHF.x, 2.4, RHF.z, 0); actuar(mayor, L.lt, [[0, 'wave']], { T: L.T }); cara(mayor, L.T, { expr: 'happy' }); HERD.set(field(-6, -40, 90, 60, 420, 14, { spread: .6, ry: PI, lookSpread: .4 }));
  cm([RHF.x + 8, 30, RHF.z + 40, RHF.x, 22, RHF.z - 8, 50], [RHF.x + 10, 9, RHF.z + 26, RHF.x, 5, RHF.z, 50], L.k, easeOut); sh(V(-6, 0, -50), 50); }, [[0, 'bells', .5], [.3, 'honk_crowd', .7], [.8, 'cheer', .3]]);
// 15 «dass er nur noch vom Traktor aus spricht,» — subido al tractor con micrófono, en medio de la marea de gansos
const TRP = V(-2, 0, -44);
shot(23.53, 'C', null, L => { town(L); show(TRAK, TRP.x, 0, TRP.z, .3); const d = V(TRP.x + Math.sin(.3) * -2.6, 5.4, TRP.z + Math.cos(.3) * -2.6); put(mayor, d.x, d.y, d.z, .3); actuar(mayor, L.lt, [[0, { aRx: 1.2, aRe: 1.6, aRz: -.2 }], [.8, { aRx: 1.2, aRe: 1.6, aRz: -.2, aLx: 2.4, aLz: .5, aLe: .3 }]], { T: L.T }); talk(mayor, L.T, 23.53, 25.33, 'happy');
  show(MIC, d.x + Math.sin(.3) * 1.6, 5.4, d.z + Math.cos(.3) * 1.6, 0); HERD.set(field(TRP.x, TRP.z + 6, 70, 50, 300, 15, { spread: .5, ry: PI + .3, hole: [TRP.x, TRP.z, 7] }));
  const a = lerp(-.5, .1, easeInOut(L.k)); cam([TRP.x + Math.sin(a) * 14, 5, TRP.z + Math.cos(a) * 14], [TRP.x - .6, 9.6, TRP.z - 2], 48); sh(TRP, 30); }, [[0, 'radio', .5], [.2, 'tractor', .5], [.9, 'honk_crowd', .5]]);
// 16 «denn zwischen seinen Gänsen» — primer plano: habla, y a sus pies solo hay gansos hasta el horizonte
shot(25.33, 'Z', null, L => { town(L); show(TRAK, TRP.x, 0, TRP.z, .3); const d = V(TRP.x + Math.sin(.3) * -2.6, 5.4, TRP.z + Math.cos(.3) * -2.6); put(mayor, d.x, d.y, d.z, .3); actuar(mayor, L.lt, [[0, { aRx: 1.2, aRe: 1.6, aRz: -.2, aLx: .9, aLz: .4, aLe: .8 }]], { T: L.T }); talk(mayor, L.T, 25.33, 26.39, 'talk');
  show(MIC, d.x + Math.sin(.3) * 1.6, 5.4, d.z + Math.cos(.3) * 1.6, 0); HERD.set(field(TRP.x, TRP.z + 6, 70, 50, 300, 15, { spread: .5, ry: PI + .3, hole: [TRP.x, TRP.z, 7] })); onFace(mayor, 9, 1.6, 3, 44, L.k, 7.6); sh(TRP, 30); }, [[0, 'radio', .4], [.5, 'honk', .4]]);
// 17 «würde ihn sonst niemand finden.» — cenital: el alcalde a pie se hunde entre gansos que aletean; solo asoma su mano
shot(26.39, 'R', null, L => { town(L); const M0 = V(-2, 0, -30); put(mayor, M0.x, 0, M0.z, 0); const sink = easeIn(clamp(L.lt / .9)); actuar(mayor, L.lt, [[0, { crouch: sink * 2.6, aRx: 2.9, aRz: .3, aRe: .2, headX: .3 }]], { T: L.T, extra: { aRz: .3 + Math.sin(L.T * 12) * .3 } }); cara(mayor, L.T, { expr: 'scared' });
  const l = field(M0.x, M0.z, 30, 30, 120, 17, { spread: 6.28 }); for (const q of l) { const d = Math.hypot(q.x - M0.x, q.z - M0.z); if (d < 4) { q.y = 2.4 * (1 - d / 4) + Math.abs(Math.sin(L.T * 9 + q.ph * 9)) * 1.2; q.flap = 1; } } HERD.set(l); feathers(V(M0.x, 4, M0.z), 26.6, L.T, 26, 5, 2);
  const k = easeOut(L.k); cam([M0.x + .01, lerp(22, 40, k), M0.z + .02], [M0.x, 0, M0.z], 50); camera.up.set(0, 0, -1); camera.lookAt(M0.x, 0, M0.z); sh(M0, 30); }, [[0, 'honk_crowd', .8], [.3, 'feathers', .7], [.6, 'shout_m', .3]]);
// 18 «Ich dagegen bin die Nummer zwei der Stadt:» — me presento junto a la clasificación: «2. ICH 312»
shot(27.73, 'W', null, L => { town(L); const B = HB.RANK.position; put(ich, B.x + 6.4, 0, B.z + 4, -.6); actuar(ich, L.lt, [[0, 'shrug'], [.9, { aLx: 1.5, aLz: -.3, aLe: .2, aRz: .1 }]], { T: L.T }); talk(ich, L.T, 27.73, 30.32, 'smile');
  HERD.set(trail(V(B.x + 6.4, 0, B.z + 4), PI - .6, 12, L.T, { walk: 0, gap: 4, seed: 18 })); const k = easeInOut(clamp((L.lt - .7) / 1.2));
  cam([lerp(B.x + 9, B.x + 4, k), lerp(5.6, 6.8, k), lerp(B.z + 14, B.z + 18, k)], [lerp(B.x + 6.4, B.x + 2.6, k), lerp(5.4, 5.6, k), lerp(B.z + 4, B.z, k)], lerp(40, 46, k)); sh(B, 25); }, [[0, 'steps', .4], [.9, 'chalk', .4], [1.2, 'ding_soft', .5]]);
// 19 «312 Gänse.» — plano épico: yo delante y 312 gansos detrás llenando la calle (zoom lento)
shot(30.32, 'C', 'slow', L => { town(L); put(ich, 4, 0, 30, 0); actuar(ich, L.lt, [[0, { aLz: .2, aRz: .2, headX: -.05 }]], { T: L.T }); cara(ich, L.T, { expr: 'bored' }); HERD.set(field(4, -6, 60, 64, 312, 19, { spread: .4, ry: 0, lookSpread: .3 }));
  cm([4, 4.6, 52, 4, 7, 14, 52], [4, 4.6, 46, 4, 7, 14, 50], L.k, easeIn); badge('num', '312', W / 2, H * .2, (L.lt - .1) * 2.2, 1, 1.6); sh(V(4, 0, 10), 50); }, [[0, 'honk_crowd', .8]]);
// 20 «Deshalb hält kein Bus mehr für mich,» — el bus pasa de largo ante la parada y me despeina
const ST = V(31.5, 0, 6);
shot(31.5, 'S', null, L => { town(L); put(ich, ST.x + 2, 0, ST.z, -PI / 2); actuar(ich, L.lt, [[0, { aRx: 2.6, aRz: .3, aRe: .3 }], [.9, 'slump']], { T: L.T, extra: L.lt < .9 ? { aRz: .3 + Math.sin(L.T * 10) * .3 } : {} }); cara(ich, L.T, { expr: L.lt < .9 ? 'happy' : 'sad' });
  HERD.set(trail(V(ST.x + 2, 0, ST.z), PI / 2 + PI, 15, L.T, { walk: 0, gap: 3, seed: 20 }).map(q => ({ ...q, x: q.x + 6 }))); show(BUS, 23, 0, lerp(-60, 60, L.lt / 1.8), 0, .85);
  cm([ST.x + 12, 4.4, ST.z + 18, ST.x - 2, 4, ST.z - 2, 48], [ST.x + 11, 4.2, ST.z + 16, ST.x - 2, 4, ST.z - 2, 46], L.k); sh(ST, 30); }, [[0, 'car_pass', .9], [.4, 'wind', .4], [1.0, 'sigh', .5]]);
// 21 «und ich laufe mit einem Hirtenstab zur Arbeit.» — camino con el cayado y la fila de gansos detrás
shot(33.3, 'W', null, L => { town(L, 'morning'); const p = caminar(ich, L.lt, { x: 16, z: 120, ry: 0, speed: 3, T: L.T, extra: { aRx: .5, aRe: 1.0, aRz: .1 } }); attach(CROOK, ich.aR.hand, [0, -.3, .4], [PI - .4, 0, 0], 1.0); cara(ich, L.T, { expr: 'determined' });
  HERD.set(trail(p, 0, 60, L.T, { w: 4, gap: 5, sp: 2.8, seed: 21 })); cam([p.x + 6, 3.2, p.z + 13], [p.x - 1, 4, p.z - 2], 48); sh(V(p.x, 0, p.z), 30); }, [[0, 'steps', .6], [.3, 'wood_creak', .4], [1.0, 'honk', .4], [1.5, 'steps', .5]]);
// 22 «Wie Moses teile ich jeden Morgen» — cenital: la marea de gansos se abre a mi paso
shot(35.39, 'Z', null, L => { town(L, 'morning'); const p = caminar(ich, L.lt, { x: 4, z: 40, ry: PI, speed: 3, T: L.T, extra: { aRx: .5, aRe: 1.0 } }); attach(CROOK, ich.aR.hand, [0, -.3, .4], [PI - .4, 0, 0], 1.0); cara(ich, L.T, { expr: 'determined' });
  const l = field(4, 20, 40, 60, 360, 22, { spread: .4, ry: 0 }); for (const q of l) { const dz = q.z - p.z, dx = q.x - p.x; if (dz < 6) { const push = Math.max(0, 7 - Math.abs(dx)) * clamp((6 - dz) / 6); q.x += Math.sign(dx || 1) * push; q.ry = Math.sign(dx || 1) * PI / 2 * clamp(push / 3); q.walk = push > .5 ? 1 : 0; } } HERD.set(l);
  cam([p.x + 6, 30, p.z + 12], [p.x, 0, p.z - 6], 52); sh(V(p.x, 0, p.z - 6), 40); }, [[0, 'honk_crowd', .7], [.4, 'feathers', .4], [.9, 'steps', .4]]);
// 23 «ein Meer aus Federn.» — contrapicado: alzo el cayado entre dos muros de gansos que aletean; plumas al sol
shot(36.79, 'C', null, L => { town(L, 'morning'); put(ich, 4, 0, 24, PI); actuar(ich, L.lt, [[0, { aRx: 2.8, aRz: .2, aRe: .2, headX: -.25, lean: -.1 }]], { T: L.T }); attach(CROOK, ich.aR.hand, [0, -.3, .4], [PI - .4, 0, 0], 1.0); cara(ich, L.T, { expr: 'determined' });
  const l = field(4, 10, 40, 50, 260, 23, { spread: .4, ry: 0 }).filter(q => Math.abs(q.x - 4) > 6).map(q => ({ ...q, flap: 1, ry: q.x > 4 ? -PI / 2 : PI / 2 })); HERD.set(l); feathers(V(4, 6, 20), 36.8, L.T, 26, 6, 2);
  cm([5.4, 1.2, 13, 4, 7, 26, 56], [5, 1.4, 15, 4, 8, 26, 52], L.k); sh(V(4, 0, 18), 30); }, [[0, 'feathers', .7], [.2, 'honk_crowd', .7], [.6, 'choir', .3]]);
// 24 «Und jeden Morgen wartet eine neue vor der Tür.» — abro la puerta y hay otro ganso en el felpudo, con lazo
const DM = V(13.4, 0, 91.3);
shot(38.43, 'I', null, L => { town(L, 'morning'); const op = easeOut(clamp((L.lt - .2) / .5)); HB.DOOR.rotation.y = -op * 1.4; put(ich, 8.4, 1.5, 91.6, PI / 2); actuar(ich, L.lt, [[0, { aRx: 1.4, aRe: .3 }], [.7, 'slump']], { T: L.T }); cara(ich, L.T, { expr: L.lt > .7 ? 'bored' : 'neutral' });
  goose(GG[5], DM.x + .4, DM.z, -PI / 2, L.T, { neck: .9, pitch: -.35, eyes: 'normal' }); HERD.set(field(16, 112, 8, 12, 14, 24, { spread: 6, walk: 0 }));
  cm([30, 3.4, 86, DM.x - 1, 3.2, DM.z, 44], [26, 3.2, 88, DM.x - 1, 3, DM.z, 40], L.k); sh(DM, 22); }, [[.2, 'door_open', .7], [.6, 'honk', .5], [1.4, 'rooster', .4]]);
// 25 «Papa zieht die Vorhänge auf,» — las cortinas rojas se abren: Papa en chaleco de punto, con su taza
const WN = V(11, 0, 100);   // ventana (exterior)
const papaWin = (L, open) => { HB.CURT.forEach(c => c.position.x = (c.userData.s < 0 ? -6.6 : -1.4) + c.userData.s * 2.6 * open); put(papa, 8.4, 1.5, 100, PI / 2); };
shot(40.75, 'C', null, L => { town(L, 'morning'); const op = easeInOut(clamp((L.lt - .2) / .7)); papaWin(L, op); actuar(papa, L.lt, [[0, { aLx: .9, aLz: .5, aLe: .5, aRx: .9, aRz: .5, aRe: .5 }], [.9, { aRx: 1.2, aRe: 1.9, aRz: -.3 }]], { T: L.T }); cara(papa, L.T, { expr: 'bored' });
  if (L.lt > .9) attach(MUG, papa.aR.hand, [0, -.4, .4], [0, 0, 0], 1); cm([24, 5.4, 104, WN.x, 5.2, 100, 40], [21, 5.2, 102.6, WN.x, 5.2, 100, 38], L.k); sh(WN, 18); }, [[.2, 'curtain', .8], [.9, 'sip', .4]]);
// 26 «zählt nach und seufzt:» — por encima de su hombro: el jardín lleno de gansos; cuenta con el dedo
shot(42.35, 'S', null, L => { town(L, 'morning'); papaWin(L, 1); actuar(papa, L.lt, [[0, { aRx: 1.5, aRz: -.1 + Math.sin(L.lt * 9) * .25, aRe: .1 }]], { T: L.T }); cara(papa, L.T, { expr: 'bored' }); attach(MUG, papa.aL.hand, [0, -.4, .4], [0, 0, 0], 1);
  HERD.set(field(19, 104, 12, 26, 70, 26, { spread: 6, walk: 0 })); const n = 309 + Math.min(3, Math.floor(L.lt / .4)); badge('tag', String(n), W / 2, H * .22, 1);
  cm([6.0, 9.6, 99.0, 22, 2, 100.6, 50], [6.3, 9.3, 99.4, 22, 2, 101.4, 48], L.k); sh(V(18, 0, 100), 25); }, [[0, 'count', .5], [.4, 'tick', .3], [.8, 'tick', .3], [1.2, 'sigh', .5]]);
// 27 «„Noch eine, Junge.“» — primer plano de Papa, resignado
shot(43.7, 'Z', null, L => { town(L, 'morning'); papaWin(L, 1); actuar(papa, L.lt, [[0, { headX: .1, lean: .05 }]], { T: L.T }); talk(papa, L.T, 43.7, 44.77, 'bored'); attach(MUG, papa.aR.hand, [0, -.4, .4], [0, 0, 0], 1);
  onFace(papa, 7.4, .2, 1.6, 40, L.k, 6.2); }, [[0, 'sigh', .5]]);
// 28 «Leider hat er jedes Mal recht.» — la pizarra de la puerta: 311 tachado, 312; me tapo la cara
shot(44.77, 'W', null, L => { town(L, 'morning'); put(ich, 12.4, 0, 98.6, PI / 2 + .3); actuar(ich, L.lt, [[0, 'idle'], [.6, 'facepalm']], { T: L.T }); cara(ich, L.T, { expr: 'sad' }); goose(GG[5], 14.6, 95, -.4, L.T, { neck: .7, eyes: 'happy' });
  cm([23, 6.4, 98, 11.6, 5.2, 102.6, 44], [21.4, 6, 98.8, 11.6, 5.2, 102.4, 42], L.k); sh(V(12, 0, 99), 18); }, [[0, 'chalk', .6], [.6, 'cloth', .4], [1.2, 'honk', .4]]);
// 29 «Doch dann lud mich Lena aus der Bäckerei» — la panadería: Lena tras el mostrador saluda
const bake = L => { use('BK'); inside(.85, .2); };
shot(46.68, 'I', null, L => { bake(L); put(lena, BX + .4, .8, -6.4, .15); actuar(lena, L.lt, [[0, 'idle'], [.4, 'wave']], { T: L.T }); cara(lena, L.T, { expr: 'happy' }); put(ich, BX + 4.4, 0, 5, PI - .35); actuar(ich, L.lt, [[0, 'idle']], { T: L.T }); cara(ich, L.T, { expr: 'smile' });
  cm([BX + 2.6, 6.6, 15, BX + 2, 5.4, -5, 50], [BX + 2.4, 6.4, 13, BX + 2, 5.4, -5, 48], L.k); }, [[0, 'door_bell', .7], [.4, 'cash_reg', .3]]);
// 30 «zu ihrem Geburtstag ein,» — me tiende la invitación por encima del mostrador
shot(48.48, 'C', null, L => { bake(L); put(lena, BX + 1, .8, -5.4, 0); actuar(lena, L.lt, [[0, { aRx: 1.5, aRe: .2, lean: .15 }]], { T: L.T }); talk(lena, L.T, 48.48, 49.7, 'happy'); 
  put(ich, BX + 1.6, 0, 4, PI); actuar(ich, L.lt, [[0, 'idle'], [.6, { aLx: 1.3, aLe: .4 }]], { T: L.T }); cara(ich, L.T, { expr: 'happy' }); const c = handP(lena); cm([c.x - 4, c.y + 2.6, c.z + 9, c.x, c.y + .4, c.z, 46], [c.x - 3.2, c.y + 2, c.z + 7.4, c.x, c.y + .4, c.z, 44], L.k); CARD.visible = true; CARD.position.copy(c).add(V(0, .3, 1.0)); CARD.lookAt(camera.position); }, [[0, 'paper', .6], [.5, 'sparkle', .3]]);
// 31 «zu sich nach Hause. Das Problem:» — la tarjeta: «4. STOCK»… y mi cara cambia
shot(49.7, 'Z', null, L => { bake(L); put(ich, BX + 1.6, 0, 7.5, PI); actuar(ich, L.lt, [[0, { aLx: 1.5, aLe: 1.2, aLz: -.1, headX: .25 }]], { T: L.T }); const pr = L.T > 50.55; const hc = handP(ich, 0); CARD.visible = true; CARD.scale.setScalar(1.15); CARD.position.copy(hc).add(V(0, .6, -.8)); cara(ich, L.T, { expr: pr ? 'shock' : 'happy', eyes: pr ? 'wide' : 'down' });
  const c = CARD.position.clone(), h = hp(ich); const k = easeInOut(clamp((L.T - 50.4) / .45)); cam([lerp(c.x - .4, h.x - 1, k), lerp(c.y + 1.4, h.y + 1.4, k), lerp(c.z - 5.6, h.z - 6.4, k)], [lerp(c.x, h.x, k), lerp(c.y, h.y + .5, k), lerp(c.z, h.z, k)], lerp(40, 40, k)); CARD.lookAt(camera.position); }, [[0, 'paper', .4], [.85, 'zoom_fast', .6], [.86, 'gasp', .5]]);
// 32 «vierter Stock, kein Aufzug,» — el bloque de ladrillo: la cámara sube hasta el 4.º (globos) y el cartel «KEIN AUFZUG»
shot(51.41, 'S', null, L => { town(L); put(ich, 40, 0, 92, PI / 2 + .3); actuar(ich, L.lt, [[0, { headX: -.5 }]], { T: L.T }); cara(ich, L.T, { expr: 'worried', eyes: 'up' }); const k = easeInOut(L.k);
  cam([30, lerp(4, 20, k), lerp(80, 84, k)], [47, lerp(8, 44, k), lerp(96, 112, k)], 54); badge3('tag', '4. STOCK', V(46, 46.5, 116), (L.lt - .3) * 2); badge3('red', 'KEIN AUFZUG', V(44, 30, 88), (L.T - 52.15) * 2, .42); sh(V(47, 20, 100), 50); }, [[0, 'wind', .4], [.2, 'birds', .4], [.75, 'buzzer', .5]]);
// 33 «und durch ihr Treppenhaus passen» — el ensayo: la escalera atascada de gansos que aletean
const stairs = L => { use('TR'); inside(.75, .2); };
shot(52.85, 'C', null, L => { stairs(L); const l = []; const r = RNG(33); for (let i = 0; i < 60; i++) { const f = i < 30 ? 0 : 1, s = i % 30; const onA = s < 15, k = (s % 15) / 15;
    const [x, y0, z0, dz] = onA ? STAIRS.A(0) : STAIRS.B(0); l.push({ x: TX + x + (r() - .5) * 3.6, y: y0 + Math.min(5, k * 5 + .5) - .5 + (f ? .6 : 0), z: z0 + dz * 5 * k + (r() - .5) * 1, ry: onA ? 0 : PI, ph: r(), walk: 1, wsp: 14, ci: i % 6, flap: r() < .5 ? 1 : 0, honk: 1 }); } HERD.set(l);
  put(ich, TX - 3, 0, -6.5, -.5); actuar(ich, L.lt, [[0, 'hands_head']], { T: L.T }); cara(ich, L.T, { expr: 'shock' }); feathers(V(TX + 3, 4, 0), 52.9, L.T, 20, 3, 1.4);
  cm([TX - 8, 3, -10.6, TX + 2, 5.4, 3, 56], [TX - 7.4, 3.4, -10, TX + 2, 6, 3, 54], L.k); }, [[0, 'honk_crowd', .9], [.3, 'feathers', .7], [.8, 'thud', .4]]);
// 34 «keine 312 Gänse.» — por fuera: la torre de cristal llena de gansos atascados; «✗ 312»
shot(54.35, 'R', null, L => { town(L); const l = []; const r = RNG(34); for (let f = 0; f < 4; f++) for (let i = 0; i < 26; i++) l.push({ x: 46.5 + r() * 7, y: f * 10 + .5 + (r() < .3 ? r() * 2 : 0), z: 85.5 + r() * 7, ry: r() * 6.28, ph: r(), walk: 0, ci: i % 6, flap: r() < .3 ? 1 : 0, honk: 1, s: .95 }); HERD.set(l);
  const k = easeOut(L.k); cam([lerp(36, 26, k), lerp(14, 22, k), lerp(78, 70, k)], [50, 18, 89], 50); badge('red', '✗ 312', W / 2, H * .2, (L.lt - .2) * 2, 1, 1.2); sh(V(50, 20, 89), 40); }, [[0, 'honk_crowd', .8], [.2, 'glass_rattle', .5], [.4, 'impact', .4]]);
// 35 «Mir blieben genau 10 Tage.» — el calendario: el cumpleaños marcado; «10 TAGE» (zoom lento)
shot(55.77, 'Z', 'slow', L => { use('ZM'); inside(.8, .2); const c = V(ZX - 21.5, 8.6, -2); put(ich, ZX - 14, 0, 2, -PI / 2 - .4); actuar(ich, L.lt, [[0, 'think']], { T: L.T }); cara(ich, L.T, { expr: 'worried' });
  cm([c.x + 13, 9.6, c.z + 7, c.x, 8.4, c.z, 44], [c.x + 8, 9, c.z + 3.4, c.x, 8.6, c.z, 40], L.k, easeIn); badge('big', '10 TAGE', W / 2, H * .2, (L.lt - .4) * 2, 1, 1.1); }, [[0, 'clock_tick', .5], [.5, 'pencil', .4]]);
// 36 «Also sperrte ich noch in derselben Nacht» — de noche, al escritorio: cara decidida iluminada por el portátil
const night = L => { use('ZM'); nightIn(); ZM.LMP.intensity = 12; ZM.DESK.intensity = 45; };
shot(57.53, 'I', null, L => { night(L); sit(ich, ZX - 6, 3.3, -6.6, PI, { aLx: 1.3, aRx: 1.3, aLe: .9, aRe: .9, lean: .2 }); actuar(ich, L.lt, [[0, { ...SIT, aLx: 1.3, aRx: 1.3, aLe: .9, aRe: .9, lean: .2 }], [.8, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: 2.1, aRe: 2.1, aLz: -.6, aRz: -.6, lean: .1 }]], { T: L.T }); cara(ich, L.T, { expr: 'determined' });
  onFace(ich, 7, .4, 1.6, 42, L.k, 5.4); }, [[0, 'chair_roll', .4], [.8, 'back_crack', .5], [1.3, 'clack', .4]]);
// 37 «Corn auf allem, was einen Bildschirm hat:» — la pantalla del portátil: aparece el candado «CORN GESPERRT»
shot(59.25, 'C', null, L => { night(L); sit(ich, ZX - 6, 3.3, -6.6, PI, {}); actuar(ich, L.lt, [[0, { ...SIT, aLx: 1.4, aRx: 1.4, aLe: .7, aRe: .7, lean: .25, aRz: Math.sin(L.T * 20) * .05 }]], { T: L.T }); cara(ich, L.T, { expr: 'determined' }); const k = clamp((L.lt - .6) / .4); ZM.lapS.draw((c, w, h) => drawScreen(c, w, h, k > 0, k));
  const s = V(ZX - 4.6, 6, -11.6); cm([s.x - 3, s.y + 2.4, s.z + 9, s.x, s.y, s.z, 40], [s.x - 1.4, s.y + 1.2, s.z + 5.2, s.x, s.y, s.z, 36], L.k); }, [[0, 'clack', .5], [.3, 'clack', .5], [.6, 'lid_click', .7], [.62, 'lock', .6]]);
// 38 «Handy, Laptop, Fernseher.» — barrido rápido: móvil → portátil → tele, cada uno se bloquea con su palabra
shot(61.3, 'W', null, L => { night(L); sit(ich, ZX - 6, 3.3, -6.6, PI, {}); applyPose(ich, { ...SIT, aLx: 1.3, aRx: 1.3, aLe: .9, aRe: .9, lean: .2 }); cara(ich, L.T, { expr: 'determined' });
  const lk = t0 => clamp((L.T - t0) / .2); ZM.phS.draw((c, w, h) => drawScreen(c, w, h, true, lk(61.32))); ZM.lapS.draw((c, w, h) => drawScreen(c, w, h, true, 1)); ZM.tvS.draw((c, w, h) => drawScreen(c, w, h, true, lk(62.5)));
  const P = [[ZX - 8.6, 4.9, -9.6, 4.2], [ZX - 4.6, 6, -11.6, 6], [ZX + 4, 6.4, 12.9, 13]], seg = L.T < 61.92 ? 0 : L.T < 62.5 ? 1 : 2, t0 = [61.3, 61.92, 62.5][seg], kk = easeOut(clamp((L.T - t0) / .25));
  const tgt = P[seg], prv = P[Math.max(0, seg - 1)]; const tx = lerp(prv[0], tgt[0], seg ? kk : 1), ty = lerp(prv[1], tgt[1], seg ? kk : 1), tz = lerp(prv[2], tgt[2], seg ? kk : 1), d = lerp(prv[3], tgt[3], seg ? kk : 1);
  const back = seg === 2 && kk > .5 ? -1 : 1; cam([tx - 1.5, ty + 2.2, tz + d * (seg === 2 ? -1 : 1)], [tx, ty, tz], 44); if (seg === 2) cam([tx - 2, ty + 1.6, tz - lerp(9, d, kk)], [tx, ty, tz], 44); }, [[.02, 'lock', .7], [.62, 'lock', .7], [1.2, 'lock', .7], [1.22, 'power_on', .4]]);
// 39 «Sogar auf dem Kühlschrank.» — la nevera inteligente también: candado; asiento con un bocadillo en la mano
shot(63.09, 'S', null, L => { night(L); ZM.frS.draw((c, w, h) => drawScreen(c, w, h, true, clamp((L.lt - .5) / .25))); put(ich, ZX + 13.6, 0, 10, PI / 2 + .9); actuar(ich, L.lt, [[0, 'idle'], [.6, { headX: .25 }], [.9, { headX: -.1 }]], { T: L.T }); cara(ich, L.T, { expr: 'determined' });
  ZM.LMP.intensity = 40; const s = V(ZX + 17.4, 8.6, 4.7); cm([ZX + 10.4, 9.4, 2.4, s.x, 7.8, s.z + 1.6, 50], [ZX + 11.4, 9, 3, s.x, 7.8, s.z + 1.6, 46], L.k); }, [[0, 'machine_hum', .4], [.5, 'lock', .7], [.9, 'beep', .4]]);
// 40 «Am ersten Tag kam keine neue Gans,» — TAG 1: abro la puerta… el felpudo vacío, solo una pluma
shot(64.42, 'Z', null, L => { town(L, 'morning'); HB.DOOR.rotation.y = -1.4 * easeOut(clamp(L.lt / .4)); put(ich, 10.6, .3, 91.4, PI / 2); actuar(ich, L.lt, [[0, 'idle'], [.6, { headX: .4, lean: .15 }]], { T: L.T }); cara(ich, L.T, { expr: L.lt > .9 ? 'happy' : 'neutral', eyes: L.lt > .6 && L.lt < 1.2 ? 'down' : undefined });
  FEATH[0].visible = true; FEATH[0].position.set(DM.x + .4, .5, DM.z + .3); FEATH[0].rotation.set(-PI / 2, 0, .8); badge('tag', 'TAG 1', W / 2, H * .13, (L.lt - .1) * 2);
  cm([22, 3, 87, DM.x - 1, 3, DM.z, 44], [19, 2.6, 89, DM.x - 1, 2.4, DM.z, 40], L.k); sh(DM, 18); }, [[0, 'door_open', .6], [.4, 'birds', .5], [1.2, 'sparkle', .3]]);
// 41 «und Papa zählte zweimal nach.» — Papa en la ventana se frota los ojos y vuelve a contar
shot(66.6, 'C', null, L => { town(L, 'morning'); papaWin(L, 1); actuar(papa, L.lt, [[0, { aRx: 2.1, aRz: -.2, aRe: 2.3, headX: .1 }], [.6, { aRx: 1.5, aRz: -.1 + Math.sin(L.lt * 9) * .3, aRe: .1 }]], { T: L.T }); cara(papa, L.T, { expr: 'confused' }); badge('tag', '0 ?', W / 2, H * .22, (L.lt - .7) * 2);
  onFace(papa, 8, .4, -2.4, 42, L.k, 6.6); }, [[0, 'cloth', .4], [.6, 'count', .5], [1.2, 'gasp_old', .4]]);
// 42 «Am dritten Tag sah mich eine Gans an,» — TAG 3: un ganso se planta delante de mí y me mira fijo
const G3 = V(-10, 0, 34);
shot(68.24, 'W', null, L => { town(L); put(ich, G3.x, 0, G3.z - 6, 0); actuar(ich, L.lt, [[0, 'idle']], { T: L.T }); cara(ich, L.T, { expr: 'neutral' }); goose(GG[3], G3.x, G3.z, PI, L.T, { neck: 1, pitch: -.15, eyes: 'sus' });
  badge('tag', 'TAG 3', W / 2, H * .13, (L.lt - .1) * 2); const h = gp(GG[3]); cm([h.x + 1.8, h.y + .2, h.z - 5.2, h.x, h.y - .4, h.z, 42], [h.x + 1.3, h.y + .1, h.z - 3.8, h.x, h.y - .3, h.z, 40], L.k); sh(G3, 18); }, [[0, 'birds', .4], [.4, 'honk', .4], [1.2, 'cricket', .3]]);
// 43 «schüttelte den Kopf und watschelte davon.» — niega con la cabeza y se va contoneándose
shot(70.34, 'C', null, L => { town(L); put(ich, G3.x, 0, G3.z - 6, 0); actuar(ich, L.lt, [[0, 'idle'], [.9, 'shrug']], { T: L.T }); cara(ich, L.T, { expr: L.lt > .9 ? 'confused' : 'neutral' }); const sk = L.lt < .7 ? 1 : 0;
  if (L.lt < .8) goose(GG[3], G3.x, G3.z, PI, L.T, { neck: .8, shake: sk, eyes: 'closed' }); else { const tr = easeOut(clamp((L.lt - .8) / .25)); gooseWalk(GG[3], L.lt - 1.0, { x: G3.x, z: G3.z, ry: PI + tr * PI * .9, speed: 2.2, T: L.T, p: { neck: .7, eyes: 'half' } }); }
  cm([G3.x + 10, 3.6, G3.z - 2, G3.x, 2.6, G3.z + .6, 48], [G3.x + 9, 3.4, G3.z, G3.x, 2.6, G3.z + 1.6, 46], L.k); sh(G3, 20); }, [[0, 'shake', .6], [.4, 'honk', .5], [1.0, 'steps', .4], [1.4, 'steps', .3]]);
// 44 «Am sechsten Tag verließen sie die Stadt» — TAG 6: taxis amarillos llenos de gansos por la carretera
shot(72.28, 'S', null, L => { town(L); const z0 = 120 + L.lt * 14; TAXIS.slice(0, 4).forEach((t, i) => { show(t, 23, 0, z0 - i * 14, 0); });
  const l = []; TAXIS.slice(0, 4).forEach((t, i) => { for (const [sx, sz] of [[-1, .6], [1, .6], [-1, -1.9], [1, -1.9]]) l.push({ x: 23 + sx * 1.3, y: .9, z: z0 - i * 14 + sz, ry: sx * 1.2, ph: i * .3 + sx, walk: 0, ci: (i + sx + 6) % 6, look: sx * .3, s: .78, honk: 1 }); }); HERD.set(l);
  badge('tag', 'TAG 6', W / 2, H * .13, (L.lt - .1) * 2); cm([14, 5, z0 + 6, 23, 3, z0 - 10, 50], [14.6, 4.6, z0 + 8, 23, 3, z0 - 8, 48], L.k); sh(V(23, 0, z0 - 20), 40); }, [[0, 'car', .7], [.4, 'honk', .5], [1.0, 'car_pass', .5]]);
// 45 «in ganzen Taxikolonnen.» — desde el aire: la columna de taxis sale por el cartel de Hufenbach
shot(74.02, 'Z', null, L => { town(L); const z0 = 236 + L.lt * 16; TAXIS.forEach((t, i) => show(t, 23, 0, z0 - i * 12, 0)); const l = []; TAXIS.forEach((t, i) => { for (const sx of [-1, 1]) l.push({ x: 23 + sx * 1.3, y: .9, z: z0 - i * 12 - .6, ry: sx * 1.2, ph: i, walk: 0, ci: i % 6, look: sx * .3, s: .78 }); }); HERD.set(l);
  const k = easeOut(L.k); cam([lerp(60, 50, k), lerp(46, 40, k), z0 - 30], [24, 0, z0 - 30], 52); sh(V(24, 0, z0 - 30), 60); }, [[0, 'car', .6], [.5, 'honk_crowd', .3], [.9, 'birds', .4]]);
// 46 «Am neunten Tag ließ mich» — TAG 9: el bus frena en la parada; yo solo, sin gansos
shot(75.5, 'W', null, L => { town(L); const k = easeOut(clamp(L.lt / 1.1)); show(BUS, 23, 0, lerp(-40, 4, k), 0, .85); put(ich, ST.x + 2.4, 0, ST.z + 2, -PI / 2); actuar(ich, L.lt, [[0, 'idle'], [1.0, 'shock', { anti: .2 }]], { T: L.T }); cara(ich, L.T, { expr: L.lt > 1 ? 'shock' : 'neutral' });
  badge('tag', 'TAG 9', W / 2, H * .13, (L.lt - .1) * 2); cm([ST.x + 10, 4.4, ST.z + 22, ST.x - 4, 4, ST.z - 2, 48], [ST.x + 9, 4.2, ST.z + 20, ST.x - 4, 4, ST.z - 2, 46], L.k); sh(ST, 30); }, [[0, 'car', .7], [.8, 'brakes', .7]]);
// 47 «der Busfahrer endlich einsteigen» — se abre la puerta y subo; el conductor sonríe
shot(76.87, 'C', null, L => { town(L); show(BUS, 23, 0, 4, 0, .85); BUS.updateMatrixWorld(true); BUS.userData.door.position.z = 9.6 - easeOut(clamp(L.lt / .3)) * 2.6; const dp = V(-1.6, 3.4, 9).applyMatrix4(BUS.matrixWorld);
  put(fahrer, dp.x, dp.y - 3.1, dp.z, 0); applyPose(fahrer, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: .5, aRe: .5, headY: .9 }); cara(fahrer, L.T, { expr: 'happy' });
  const w = caminar(ich, L.lt - .2, { x: 33, z: 12.2, ry: -PI / 2, speed: 3, T: L.T }); ich.root.position.y = clamp((27.6 - w.x) / 1.6) * 1.2; cara(ich, L.T, { expr: 'happy' });
  cm([38, 5.4, 24, 27, 4.4, 11.6, 46], [37, 5.2, 22.6, 27, 4.4, 11.6, 44], L.k); sh(ST, 30); }, [[0, 'bus_door', .8], [.4, 'steps', .5], [.9, 'steps', .5]]);
// 48 «und fing vor Rührung an zu weinen.» — el conductor llora de emoción, mano en el pecho
shot(78.49, 'Z', null, L => { town(L); CAB.visible = true; const dp = V(600, 2.95, -1.4); sit(fahrer, dp.x, 3.4, dp.z, 0, {});
  actuar(fahrer, L.lt, [[0, { ...SIT, aLx: 1.2, aLe: .5, aRx: 1.0, aRz: -.55, aRe: 1.5, headX: -.1 }]], { T: L.T, extra: { headZ: Math.sin(L.T * 10) * .03 } }); cara(fahrer, L.T, { expr: 'cry', eyes: 'cry', mouth: 'wavy' });
  onFace(fahrer, 6.4, 1.4, 2.2, 40, L.k, 5.2); }, [[0, 'sniff', .7], [.6, 'sob', .5], [1.2, 'sniff', .5]]);
// 49 «An ihrem Geburtstag stieg ich» — al pie de la escalera con el regalo, miro hacia arriba
shot(80.25, 'I', null, L => { town(L); put(ich, 41.6, 0, 89, PI / 2); actuar(ich, L.lt, [[0, { aLx: 1.3, aRx: 1.3, aLe: 1.2, aRe: 1.2, aLz: -.3, aRz: -.3, headX: -.45 }]], { T: L.T }); attach(GIFT, ich.aR.hand, [-.9, -.6, .8], [0, 0, 0], 1); cara(ich, L.T, { expr: 'determined', eyes: 'up' });
  cm([32, 4.4, 82, 45, 11, 89.4, 56], [32.8, 4, 82.8, 45, 13, 89.4, 54], L.k); sh(V(44, 0, 89), 25); }, [[0, 'door_open', .5], [.4, 'steps', .5]]);
// 50 «die vier Stockwerke hoch, ganz allein.» — subo los cuatro pisos (la cámara sube conmigo); arriba, sin gansos
shot(81.75, 'S', null, L => { stairs(L); const q = clamp(L.lt / 1.6); const tot = 8, s = q * tot, fl = Math.floor(s / 2), half = s % 2; const [x0, y0, z0, dz] = half < 1 ? STAIRS.A(Math.min(fl, 3)) : STAIRS.B(Math.min(fl, 3)); const f = half % 1;
  const y = fl >= 4 ? 40 : y0 + f * 5, z = fl >= 4 ? -6 : z0 + dz * 5 * f; put(ich, TX + (fl >= 4 ? 0 : x0), y, z, dz > 0 ? 0 : PI); const p = caminar(ich, L.lt, { x: ich.root.position.x, y, z, ry: dz > 0 ? 0 : PI, speed: 0.001, T: L.T }); ich.root.position.set(fl >= 4 ? TX : TX + x0, y, z);
  const ph = L.lt * 9; applyPose(ich, { lLx: Math.max(0, Math.sin(ph)) * 1.2, lLk: Math.max(0, Math.sin(ph)) * 1.4, lRx: Math.max(0, -Math.sin(ph)) * 1.2, lRk: Math.max(0, -Math.sin(ph)) * 1.4, aLx: Math.sin(ph) * .5, aRx: 1.3, aRe: 1.2, lean: .2 }); attach(GIFT, ich.aR.hand, [-.9, -.6, .8], [0, 0, 0], 1);
  if (L.lt > 1.6) { applyPose(ich, { headY: 2.2, aRx: 1.3, aRe: 1.2 }); ich.root.rotation.y = PI; } cara(ich, L.T, { expr: L.lt > 1.6 ? 'happy' : 'determined' }); badge('tag', String(Math.min(4, fl)) + '. STOCK', W / 2, H * .2, 1);
  const ix = ich.root.position.x; cam([ix - 4, y + 5, 19], [ix, y + 3.6, z], 52); }, [[0, 'steps', .6], [.4, 'steps', .6], [.8, 'steps', .6], [1.2, 'steps', .6], [1.6, 'breath', .5]]);
// 51 «Jonas dagegen kam mit seinen Gänsen,» — Jonas llega al portal con sus gansos, chulito
shot(83.59, 'W', null, L => { town(L); const p = caminar(jonas, L.lt, { x: 30, z: 78, ry: .6, speed: 2.4, T: L.T, extra: { lean: -.06, aRz: .25, aLz: .25 } }); cara(jonas, L.T, { expr: 'smug' }); HERD.set(trail(p, .6, 40, L.T, { w: 5, gap: 4, sp: 2.4, seed: 51 }));
  cm([44, 2.4, 96, p.x, 4, p.z, 50], [43, 2.8, 95, p.x, 4, p.z, 48], L.k); sh(V(p.x, 0, p.z), 30); }, [[0, 'steps', .6], [.3, 'honk_crowd', .6], [1.2, 'whistle', .4]]);
// 52 «und deshalb holt die Feuerwehr sie» — el camión de bomberos, sirena, la escalera sube hacia la torre llena de gansos
shot(85.39, 'C', null, L => { town(L); show(FT, 22, 0, 89, PI / 2); FT.userData.ladder.rotation.x = -easeOut(clamp(L.lt / 1.2)) * .45; const l = []; const r = RNG(52); for (let f = 0; f < 4; f++) for (let i = 0; i < 22; i++) l.push({ x: 46.5 + r() * 7, y: f * 10 + .5, z: 85.5 + r() * 7, ry: r() * 6.28, ph: r(), walk: 0, ci: i % 6, flap: r() < .3 ? 1 : 0, honk: 1 }); HERD.set(l);
  put(jonas, 34, 0, 76, .3); actuar(jonas, L.lt, [[0, 'hands_head']], { T: L.T }); cara(jonas, L.T, { expr: 'worried' }); const k = easeInOut(L.k); cam([lerp(18, 20, k), lerp(4, 8, k), 70], [44, lerp(10, 22, k), 89], 54); sh(V(42, 10, 88), 40); }, [[0, 'siren', .7], [.4, 'ratchet', .5], [1.0, 'honk_crowd', .5]]);
// 53 «bis heute aus dem Treppenhaus.» — un bombero saca un ganso en brazos; el ganso le grazna en la cara
shot(86.86, 'Z', null, L => { town(L); show(FT, 22, 0, 89, PI / 2); FT.userData.ladder.rotation.x = -.45; const p = caminar(FW[0], L.lt, { x: 44.4, z: 89, ry: -PI / 2 - .3, speed: 1.8, T: L.T, extra: { aLx: 1.3, aRx: 1.3, aLe: 1.2, aRe: 1.2, aLz: -.3, aRz: -.3 } }); cara(FW[0], L.T, { expr: 'bored' });
  FW[0].root.updateMatrixWorld(true); const hpos = handP(FW[0]).add(handP(FW[0], 0)).multiplyScalar(.5); goose(GG[6], hpos.x, hpos.z, FW[0].root.rotation.y + PI / 2, L.T, { y: hpos.y - 1.6, neck: .9, honk: Math.max(0, Math.sin(L.T * 8)), flap: .4, yaw: 1.2, eyes: 'angry' });
  put(FW[1], 41, 0, 82, .6); actuar(FW[1], L.lt, [[0, { aLx: 1.4, aRx: 1.4, aLe: 1, aRe: 1, lean: .1 }]], { T: L.T }); cara(FW[1], L.T, { expr: 'determined' }); goose(GG[7], 41.4, 85, .6, L.T, { neck: .9, honk: .6, flap: .6 });
  cm([36, 5.4, 100, p.x, 4.2, p.z, 46], [37, 5.2, 98.6, p.x, 4.2, p.z, 44], L.k); sh(V(p.x, 0, p.z), 25); }, [[0, 'honk', .8], [.5, 'honk', .7], [.9, 'feathers', .5], [1.2, 'siren', .3]]);
// 54 «Lena öffnete die Tür:» — 4.º piso: se abre la puerta y aparece Lena con gorro de fiesta
const LDP = V(TX - 2, 40, -11.5);
shot(88.46, 'I', null, L => { stairs(L); const op = easeOut(clamp(L.lt / .5)); put(lena, LDP.x, 40, LDP.z + lerp(-2, 1.6, op), 0); actuar(lena, L.lt, [[0, 'idle'], [.4, { aLx: 2.5, aLz: .6, aLe: .3 }]], { T: L.T }); cara(lena, L.T, { expr: 'happy' }); attach(HAT, lena.head, [0, 1.9, 0], [0, 0, -.15], 1);
  put(ich, LDP.x + 1, 40, LDP.z + 8, PI); actuar(ich, L.lt, [[0, { aRx: 1.2, aRe: 1.3 }]], { T: L.T }); attach(GIFT, ich.aR.hand, [-.9, -.6, .8], [0, 0, 0], 1); cara(ich, L.T, { expr: 'smile' });
  cm([LDP.x + 4.4, 46.4, LDP.z + 15, LDP.x, 44, LDP.z, 44], [LDP.x + 3.8, 46, LDP.z + 13.4, LDP.x, 44, LDP.z, 42], L.k); }, [[0, 'door_open', .7], [.3, 'party_horn', .5]]);
// 55 «„Keine Gänse?“ – „Keine Gänse.“» — ella se asoma detrás de mí… y yo, orgulloso; confeti
shot(89.7, 'C', null, L => { stairs(L); put(lena, LDP.x, 40, LDP.z + 1.6, 0); const lean = L.T < 90.4; actuar(lena, L.lt, [[0, { lean: .2, twist: .4, headY: .5, sx: .4 }], [.7, { aLx: 2.6, aLz: .4, aRx: 2.6, aRz: .4, aLe: .3, aRe: .3 }]], { T: L.T }); if (lean) talk(lena, L.T, 89.7, 90.38, 'gasp'); else cara(lena, L.T, { expr: 'joy' }); attach(HAT, lena.head, [0, 1.9, 0], [0, 0, -.15], 1);
  put(ich, LDP.x + 1, 40, LDP.z + 8, PI); actuar(ich, L.lt, [[0, { aRx: 1.2, aRe: 1.3 }], [.7, { aRx: 1.2, aRe: 1.3, lean: -.1, headX: -.1 }]], { T: L.T }); attach(GIFT, ich.aR.hand, [-.9, -.6, .8], [0, 0, 0], 1); if (!lean) talk(ich, L.T, 90.38, 91.4, 'smile'); else cara(ich, L.T, { expr: 'neutral' }); if (!lean) confetti(V(LDP.x + .5, 44, LDP.z + 4), 90.6, L.T);
  const a = lerp(-.6, -.2, easeInOut(L.k)); cam([LDP.x + .5 + Math.sin(a) * 13, 45.6, LDP.z + 4.6 + Math.cos(a) * 9], [LDP.x + .5, 44, LDP.z + 4.6], 44); }, [[0, 'gasp_f', .5], [.7, 'confetti', .7], [.75, 'cheer', .4]]);
// 56 «Doch am nächsten Morgen zog Papa die Vorhänge auf,» — amanecer: la cámara se acerca a la ventana; se abren las cortinas
shot(91.4, 'F', null, L => { town(L, 'morning'); const op = easeInOut(clamp((L.T - 92.9) / .6)); papaWin(L, op); actuar(papa, L.lt, [[0, { aLx: .9, aLz: .5, aLe: .5, aRx: .9, aRz: .5, aRe: .5 }]], { T: L.T }); cara(papa, L.T, { expr: 'neutral' });
  cm([40, 14, 112, WN.x, 6, 100, 50], [24, 6.2, 103, WN.x, 5.2, 100, 42], L.k); sh(WN, 25); }, [[0, 'rooster', .6], [.4, 'birds', .5], [1.5, 'curtain', .8]]);
// 57 «starrte nach draußen,» — Papa se queda helado mirando el felpudo
shot(93.64, 'Z', null, L => { town(L, 'morning'); papaWin(L, 1); actuar(papa, L.lt, [[0, { aLx: .9, aLz: .5, aLe: .5, aRx: .9, aRz: .5, aRe: .5 }], [.3, { headX: .35, aLx: .4, aRx: .4, lean: .1 }]], { T: L.T }); cara(papa, L.T, { expr: 'shock', eyes: 'down' }); onFace(papa, 8, .8, 2.6, 42, L.k, 6.4); }, [[0, 'gasp_old', .5], [.3, 'heartbeat', .4]]);
// 58 «wurde knallrot und sagte:» — la cara se le pone roja como un tomate (zoom lento)
const RED = new THREE.Color(0xe8443a); papa.root.traverse(m => { if (m.isMesh && m.material.color && m.material.color.getHex() === 0xf2b898) { m.userData.skin0 = m.material.color.clone(); } });
shot(94.99, 'C', 'slow', L => { town(L, 'morning'); papaWin(L, 1); actuar(papa, L.lt, [[0, { headX: .2, aRx: 2.4, aRz: -.1, aRe: 2.3 }]], { T: L.T }); const k = easeInOut(clamp(L.lt / 1.2)); papa.root.traverse(m => { if (m.isMesh && m.userData.skin0) m.material.color.copy(m.userData.skin0).lerp(RED, k); }); cara(papa, L.T, { expr: 'smile', eyes: 'side_r', mouth: 'grimace' }); sweat(papa, L.T);
  onFace(papa, 7, .4, -1.6, 40, L.k, 4.8); }, [[0, 'heartbeat', .5]]);
// 59 «„Junge … ich glaube,» — yo, en el jardín con el cayado, me giro hacia él con la boca abierta
shot(96.78, 'W', null, L => { town(L, 'morning'); papaWin(L, 1); actuar(papa, L.lt, [[0, { headX: .3, aRx: 2.4, aRz: -.1, aRe: 2.3 }]], { T: L.T }); papa.root.traverse(m => { if (m.isMesh && m.userData.skin0) m.material.color.copy(m.userData.skin0).lerp(RED, 1); }); talk(papa, L.T, 96.78, 98.23, 'smile');
  put(ich, 15.6, 0, 97.4, -PI / 2 + .5); actuar(ich, L.lt, [[0, 'idle'], [.3, 'shock', { anti: .2 }]], { T: L.T }); attach(CROOK, ich.aR.hand, [0, -.3, .4], [PI - .4, 0, 0], 1.0); cara(ich, L.T, { expr: 'shock' });
  cm([22, 8.8, 95.6, 9.6, 6.6, 100, 46], [21.2, 8.6, 96, 9.6, 6.6, 100, 44], L.k); sh(V(14, 0, 98), 22); }, [[0, 'gasp', .5], [.6, 'cloth', .3]]);
// 60 «die gehört mir.“» — en el felpudo, un ganso gris con gafitas y bigote como Papa, le mira enamorado
shot(98.23, 'C', null, L => { town(L, 'morning'); goose(PG, DM.x + .4, DM.z, -.31, L.T, { neck: 1, pitch: -.4, eyes: 'happy' }); papaWin(L, 1); put(papa, 8.4, 1.5, 100, PI / 2); papa.root.traverse(m => { if (m.isMesh && m.userData.skin0) m.material.color.copy(m.userData.skin0).lerp(RED, 1); }); applyPose(papa, { headX: .3, aRx: 2.4, aRz: -.1, aRe: 2.3 }); cara(papa, L.T, { expr: 'smile', eyes: 'side_r' });
  const h = gp(PG); cm([22, 4.6, 83, 12.6, 5.4, 95.6, 48], [h.x + 3.4, h.y + .4, h.z + 4.4, h.x - .2, h.y - .3, h.z, 44], L.k, easeInOut); sh(DM, 18); }, [[0, 'honk', .6], [.3, 'sparkle', .4], [.9, 'impact', .5]]);

// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const TRS = { W: 'swipe', Z: 'zoom_in', F: 'flash', S: 'swipe', R: 'whoosh_down', I: 'iris_pop', C: 'impact' };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  else if (i > 0) CUES.push({ t: s.t0 + .04, s: ['zoom_in', 'zoom_out'][i % 2], g: .35 });
 });
CUES.push({ t: 0, s: 'riser', g: .8, d: .8 }); CUES.push({ t: .8, s: 'braam', g: .9 }); CUES.push({ t: 0, s: 'zoom_fast', g: .9 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD.length = 0; s.fn(L); HERD.update(T);
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .78, e); camera.fov *= lerp(1, .9, e); }
  if (i === 0) { const k = clamp(T / .2); camera.fov *= lerp(.62, 1, easeOut(k)); grade.uniforms.vig.value = lerp(.36, .6, clamp(T / .8)); }
  let sh_ = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast'].includes(c.s) && T - c.t < .14) sh_ = 1 - (T - c.t) / .14; }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .22 * sh_; camera.position.y += (r() - .5) * .22 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .58; grade.uniforms.sat.value = 1.5; grade.uniforms.lift.value = .015; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  const outside = SETS.HB.visible; IBL.update(MODE !== 'in'); setViento(T, 1);
  AIR.update(T, ctr, 'polvo', MODE === 'in' ? .5 : .6); BIRDS.update(T, ctr, outside && MODE === 'day', false);
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
// portadas (sin spoilers): 0 = el chico con el ganso que aparece; 1 = la marea de 312 gansos
function coverText(l1, l2, col) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * .115, 132, '#ffffff'], [l2, H * .195, 118, col]]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .92 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .22; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }
let COVER = null;
// portadas (sin spoilers), sujeto centrado, más nitidez y viñeta: 0 = yo al frente de la marea de gansos; 1 = el chico y el ganso que le aparece
const COVERS = [{ i: 0, k: .9, cam: () => { const p = ich.root.position; cam([p.x + 1.4, 5.6, p.z + 13.5], [p.x, 3.4, p.z - 2], 50); }, l2: 'KRIEGST DU EINE GANS…' },
  { i: 1, k: .95, cam: () => { const p = K[0].root.position; cam([p.x + 9, 5.2, p.z + 8], [p.x + 1.4, 3.6, p.z + .4], 46); }, l2: '…WENN DU GOONST' }];
window.renderCover = v => { const C = COVERS[v], s = S[C.i], T = s.t0 + (s.t1 - s.t0) * C.k; COVER = C; renderShot(C.i, T, null, 0); COVER = null;
  octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H); coverText('IN DIESER STADT', C.l2, '#E2FD07'); };
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { renderer, composer, bloom, sun, HERD, grade, scene };

// KNOPF — «In dieser Stadt wird jeder mit einem Knopf mitten auf dem Bauch geboren»: un botón que reinicia un día, una sola vez.
// El Opa lo gastó por el nieto; al final el nieto gasta el suyo por el Opa. 1080×1920, 30 fps.
// Ciudad propia: Lindenthal (pueblo alpino), reparto propio. Planos en src/p/*.js; armar.py los une en src/index.js.
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { makeExtra } from './ecast.js';
import { makeLehrerin } from './acast.js';
import { zimmer, klasse, kueche } from './svsets.js';
import { football } from './hsets.js';
import { lindenthal, opaHaus, schule, sportplatz, klinikAussen, klinikZimmer, glowM } from './nsets.js';
import { makeKlein, makeGross, makeOpaK, makeFreund, makeSchwester, makeKicker, makeTorwart, makeBaby, addKnopf, KCOL } from './ncast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 187.6, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const QS = new URLSearchParams(location.search);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 5000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = QS.get('ao') !== '0';
const bokeh = new BokehPass(scene, camera, { focus: 10, aperture: .0008, maxblur: .01 }); composer.insertPass(bokeh, 2); let DOF = 1;
let CAMT = new THREE.Vector3(); { const la = camera.lookAt.bind(camera); camera.lookAt = (...a) => { if (a.length === 3) CAMT.set(...a); else CAMT.copy(a[0]); la(...a); }; }
// supermuestreo (?ss=1.5 por defecto)
const SS = +(QS.get('ss') ?? 1.5); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0003; sun.shadow.normalBias = .12; sun.shadow.radius = 2.5; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 2048 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-95, 105, 85)); rim.target.position.copy(p); rim.position.copy(p).add(V(70, 45, -100)); }
const OC = 2 * SS, OS = 1.5 * SS, OP = 1.25 * SS;
// ---------- escenarios ----------
// Lindenthal (x = 0); lejos: casa del Opa (OPX), colegio (SCX), campo (SPX), hospital fuera (KAX) y dentro (KZX), mi cuarto (ZIX), cocina (KUX), clase (KLX)
const LT = lindenthal(scene);
const OPX = 1400, SCX = 2200, SPX = 3000, KAX = 3800, KZX = 4600, ZIX = 5200, KUX = 5800, KLX = 6400;
const OP_ = opaHaus(scene, OPX), SC = schule(scene, SCX), SP = sportplatz(scene, SPX), KA = klinikAussen(scene, KAX), KZ = klinikZimmer(scene, KZX), ZI = zimmer(scene, ZIX, '#6ab88a', '#5aa87a'), KU = kueche(scene, KUX), KL = klasse(scene, KLX);
const SETS = { LT: LT.g, OP: OP_.g, SC: SC.g, SP: SP.g, KA: KA.g, KZ: KZ.g, ZI: ZI.g, KU: KU.g, KL: KL.g };
for (const k in SETS) outline(SETS[k], OS);
// ---------- reparto ----------
const kl = makeKlein(scene), gr = makeGross(scene), opa = makeOpaK(scene), opaH = makeOpaK(scene, true), fr = makeFreund(scene), sw = makeSchwester(scene), lehr = makeLehrerin(scene), tw = makeTorwart(scene);
addKnopf(lehr, .62);
const baby = makeBaby(scene); kitFace(baby, 'kid');
const TEAM = Array.from({ length: 6 }, (_, i) => makeKicker(scene, i)), RIV = Array.from({ length: 5 }, (_, i) => makeKicker(scene, i + 10, true));
kitFace(kl, 'kid'); kitFace(gr, 'hero'); kitFace(opa, 'mustache'); kitFace(opaH, 'mustache'); kitFace(fr, 'plain'); kitFace(sw, 'girl'); kitFace(lehr, 'girl'); kitFace(tw, 'kid');
TEAM.forEach((c, i) => kitFace(c, ['kid', 'girl', 'kid', 'plain', 'kid', 'girl'][i])); RIV.forEach((c, i) => kitFace(c, ['plain', 'kid', 'girl', 'kid', 'plain'][i]));
const EX = Array.from({ length: 26 }, (_, i) => { const c = makeExtra(scene, i + 3); addKnopf(c, .6); return c; }); EX.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'girl', 'mustache', 'girl'][i % 6]));
const MAIN = [baby, kl, gr, opa, opaH, fr, sw, lehr, tw, ...TEAM, ...RIV];
const POOL = [...MAIN, ...EX];
POOL.forEach(c => outline(c.root, OC));
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(.5, 'rgba(0,0,0,.3)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -Math.PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// ---------- atrezo ----------
const BALL = football(scene, .55); outline(BALL, OP);
const MUG = new THREE.Group(); scene.add(MUG); cyl(.55, .5, 1.1, mat(0xf4f4f4, { roughness: .3 }), 16, MUG, 0, .55, 0); { const hd = new THREE.Mesh(new THREE.TorusGeometry(.3, .08, 6, 12), mat(0xf4f4f4)); hd.position.set(.6, .6, 0); hd.rotation.y = Math.PI / 2; MUG.add(hd); } const COCOA = cyl(.48, .48, .05, mat(0x6a3a1a, { roughness: .2 }), 16, MUG, 0, 1.0, 0); outline(MUG, OP);
const SPILL = new THREE.Mesh(new THREE.CircleGeometry(1, 20), mat(0x6a3a1a, { roughness: .15 })); SPILL.rotation.x = -Math.PI / 2; scene.add(SPILL);
const STAIN = new THREE.Mesh(new THREE.CircleGeometry(.55, 14), new THREE.MeshStandardMaterial({ color: 0x6a3a1a, roughness: .3, polygonOffset: true, polygonOffsetFactor: -3 })); scene.add(STAIN);   // mancha en la camiseta
const KNIFE = new THREE.Group(); scene.add(KNIFE); box(.22, .9, .3, mat(0x7a4a26), .08, KNIFE, 0, 0, 0); box(.08, .8, .22, mat(0xd8dce4, { metalness: .9, roughness: .2 }), .02, KNIFE, 0, .85, 0);
const WOODB = new THREE.Group(); scene.add(WOODB); box(.9, .7, .6, mat(0xd8b07a, { roughness: .8 }), .25, WOODB, 0, 0, 0); box(.5, .5, .5, mat(0xd8b07a), .2, WOODB, .45, .45, 0);
const TEST = new THREE.Group(); scene.add(TEST); { const p = textPlane(2.4, 3.2, 192, 256, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.strokeStyle = '#9ab8e8'; c.lineWidth = 2; for (let y = 60; y < h; y += 16) { c.beginPath(); c.moveTo(10, y); c.lineTo(w - 10, y); c.stroke(); } txt(c, 'MATHEARBEIT', w / 2, 26, 22, '#1a1a1a'); c.fillStyle = '#1a1a1a'; for (let k = 0; k < 6; k++) c.fillRect(20, 70 + k * 26, 80 + (k % 3) * 30, 4); c.strokeStyle = '#e8202a'; c.lineWidth = 6; for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(150, 64 + k * 34); c.lineTo(168, 82 + k * 34); c.moveTo(168, 64 + k * 34); c.lineTo(150, 82 + k * 34); c.stroke(); } c.beginPath(); c.arc(150, 222, 26, 0, 7); c.stroke(); txt(c, '6', 150, 224, 40, '#e8202a'); }); p.material.side = THREE.DoubleSide; p.material.transparent = false; TEST.add(p); }
const ALBUM = new THREE.Group(); scene.add(ALBUM); { const cov = mat(0x5a2a1a, { roughness: .7 }); box(3.2, .3, 2.4, cov, .05, ALBUM, -1.65, 0, 0); box(3.2, .3, 2.4, cov, .05, ALBUM, 1.65, 0, 0); for (const s of [-1, 1]) { const pg = textPlane(3, 2.2, 192, 140, (c, w, h) => { c.fillStyle = '#f4ecd8'; c.fillRect(0, 0, w, h); for (let k = 0; k < 2; k++) { c.fillStyle = '#ffffff'; c.fillRect(12 + k * 90, 16, 78, 104); const gg = c.createLinearGradient(0, 22, 0, 110); gg.addColorStop(0, s > 0 ? '#8ac0e8' : '#e8c08a'); gg.addColorStop(1, '#5a8a4a'); c.fillStyle = gg; c.fillRect(18 + k * 90, 22, 66, 80); c.fillStyle = '#f1c8a8'; c.fillRect(38 + k * 90, 48, 14, 14); c.fillStyle = k ? '#2a9a4a' : '#8a2a32'; c.fillRect(34 + k * 90, 62, 22, 26); c.fillStyle = '#3a2416'; c.fillRect(38 + k * 90, 44, 14, 5); } }); pg.rotation.x = -Math.PI / 2; pg.position.set(s * 1.6, .17, 0); ALBUM.add(pg); } }
const TABLET = new THREE.Group(); scene.add(TABLET); box(4.2, 2.8, .2, mat(0x1a1a1e, { metalness: .5, roughness: .3 }), .15, TABLET, 0, 0, 0); const TABS = (() => { const cv = document.createElement('canvas'); cv.width = 320; cv.height = 200; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; const m = new THREE.Mesh(new THREE.PlaneGeometry(3.9, 2.5), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); m.position.z = .11; TABLET.add(m); let key = null;
  m.userData.draw = T => { const k = Math.floor(T * 15); if (k === key) return; key = k; const c = cv.getContext('2d'); for (let i = 0; i < 10; i++) { c.fillStyle = i % 2 ? '#3ab83a' : '#34a834'; c.fillRect(i * 32, 0, 32, 200); } c.strokeStyle = '#fff'; c.lineWidth = 3; c.strokeRect(10, 10, 300, 180); c.beginPath(); c.moveTo(160, 10); c.lineTo(160, 190); c.stroke(); c.beginPath(); c.arc(160, 100, 30, 0, 7); c.stroke();
    for (let i = 0; i < 5; i++) { c.fillStyle = '#2a9a4a'; c.beginPath(); c.arc(80 + Math.sin(T * 1.3 + i) * 50 + i * 20, 40 + i * 30, 8, 0, 7); c.fill(); c.fillStyle = '#d8323a'; c.beginPath(); c.arc(220 + Math.sin(T * 1.1 + i * 2) * 50 - i * 10, 50 + i * 26, 8, 0, 7); c.fill(); } c.fillStyle = '#ffffff'; c.beginPath(); c.arc(160 + Math.sin(T * 2) * 90, 100 + Math.cos(T * 1.6) * 60, 6, 0, 7); c.fill();
    c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(110, 14, 100, 26); c.font = `700 20px ${FONT}`; c.textAlign = 'center'; c.fillStyle = '#fff'; c.fillText('2 : 1', 160, 34); t.needsUpdate = true; }; return m; })();
const ALARM = (() => { const g = new THREE.Group(); scene.add(g); box(3.4, 1.9, 1.4, mat(0x1a1a1e, { roughness: .4 }), .3, g, 0, 0, 0); const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128; const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.5), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); m.position.z = .72; g.add(m); let key = null;
  g.userData.show = (s, col = '#ff3a3a', blink = false, T = 0) => { const k = s + col + (blink && Math.floor(T * 3) % 2); if (k === key) return; key = k; const c = cv.getContext('2d'); c.fillStyle = '#080808'; c.fillRect(0, 0, 256, 128); if (!(blink && Math.floor(T * 3) % 2)) { c.font = `700 92px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.shadowColor = col; c.shadowBlur = 14; c.fillStyle = col; c.fillText(s, 128, 68); } t.needsUpdate = true; }; return g; })();
outline(ALARM, OP);
// cuna, pila de platos, foto enmarcada, reloj grande con agujas (delante de la torre de la iglesia)
const CRIB = new THREE.Group(); scene.add(CRIB); { const wm = mat(0xf4f0e8, { roughness: .6 }); box(5, .4, 3, wm, .1, CRIB, 0, 2.4, 0); box(4.8, .5, 2.8, mat(0xffd8e8, { roughness: .95 }), .2, CRIB, 0, 2.8, 0); for (const s of [-1, 1]) { box(.3, 4.6, .3, wm, .05, CRIB, s * 2.4, 2.3, -1.4); box(.3, 4.6, .3, wm, .05, CRIB, s * 2.4, 2.3, 1.4); box(5, .3, .3, wm, .05, CRIB, 0, 4.4, s * 1.4); } for (let k = -2; k <= 2; k++) box(.14, 2, .14, wm, .02, CRIB, k * .8, 3.4, -1.4); for (const s of [-1, 1]) box(.3, .3, 3, wm, .05, CRIB, s * 2.4, 4.4, 0); } outline(CRIB, OP);
const PLATES = Array.from({ length: 7 }, () => { const p = cyl(.9, .7, .18, mat(0xffffff, { roughness: .2 }), 18, scene); return p; }); const CAKE = new THREE.Group(); scene.add(CAKE); cyl(1.1, 1.1, .8, mat(0xfff0f4, { roughness: .6 }), 18, CAKE, 0, .4, 0); cyl(.8, .8, .7, mat(0xff8ab0, { roughness: .6 }), 18, CAKE, 0, 1.15, 0); sphere(.2, mat(0xd8202a), CAKE, 0, 1.6, 0, 8, 6);
const PHOTO = new THREE.Group(); scene.add(PHOTO); box(1.8, 2.2, .14, mat(0x8a5a2a), .05, PHOTO, 0, 0, 0); { const p = textPlane(1.5, 1.9, 96, 120, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#e8d0a0'); g.addColorStop(1, '#b8966a'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = '#f1c8a8'; c.fillRect(34, 30, 28, 28); c.fillStyle = '#6a6a72'; c.fillRect(26, 58, 44, 50); c.fillStyle = '#f2f2f2'; c.fillRect(34, 26, 28, 7); c.fillStyle = '#2a2a2a'; c.fillRect(40, 40, 4, 4); c.fillRect(52, 40, 4, 4); }); p.position.z = .08; PHOTO.add(p); }
const CLOCK = new THREE.Group(); scene.add(CLOCK); { const f = textPlane(8.6, 8.6, 200, 200, (c, w, h) => { c.fillStyle = '#1a2a4a'; c.beginPath(); c.arc(100, 100, 98, 0, 7); c.fill(); c.strokeStyle = '#ffd23f'; c.lineWidth = 8; c.stroke(); c.fillStyle = '#ffd23f'; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; c.beginPath(); c.arc(100 + Math.cos(a) * 80, 100 + Math.sin(a) * 80, 6, 0, 7); c.fill(); } }); f.material.transparent = true; CLOCK.add(f);
  const hm = mat(0xffd23f, { metalness: .7, roughness: .3, emissive: 0x6a4a00, emissiveIntensity: .4 }); const H1 = new THREE.Group(); CLOCK.add(H1); box(.4, 2.4, .1, hm, .05, H1, 0, 1.1, .1); const H2 = new THREE.Group(); CLOCK.add(H2); box(.28, 3.4, .1, hm, .05, H2, 0, 1.6, .16); CLOCK.userData = { H1, H2 }; }
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0x2a9a4a, 0xffffff, 0xffd23f, 0x3ab8ff, 0x8ad84a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 4 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const SPARK = Array.from({ length: 40 }, () => sphere(.12, glowM(KCOL, 2.4), scene, 0, 0, 0, 6, 4));
function sparks(c, T0, T, n = 30, sp = 1, col = null) { SPARK.forEach((s, i) => { if (i >= n) return; const r = RNG(i * 13 + 2), t = T - T0; if (t < 0 || t > 1.2) return; s.visible = true; const a = r() * 6.283, v = (3 + r() * 5) * sp; s.position.set(c.x + Math.cos(a) * v * t, c.y + (4 + r() * 4) * t * sp - 6 * t * t, c.z + Math.sin(a) * v * t); s.scale.setScalar((1 - t / 1.2) * sp); }); }
// aro de luz que se expande desde el botón (al pulsarlo)
const RINGW = new THREE.Mesh(new THREE.RingGeometry(.8, 1, 48), new THREE.MeshBasicMaterial({ color: KCOL, transparent: true, side: THREE.DoubleSide, toneMapped: false, depthWrite: false })); scene.add(RINGW);
function ringwave(p, k, face = null, max = 14) { RINGW.visible = k > 0 && k < 1; RINGW.position.copy(p); RINGW.scale.setScalar(.3 + easeOut(k) * max); RINGW.material.opacity = (1 - k) * .9; if (face) RINGW.lookAt(face); }
const PROPS = [CRIB, CAKE, PHOTO, CLOCK, ...PLATES, BALL, MUG, SPILL, STAIN, KNIFE, WOODB, TEST, ALBUM, TABLET, ALARM, RINGW, ...CONF, ...DUST, ...SWEAT, ...TEAR, ...SPARK];
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.16, .44, .96], [.45, .72, 1], [.86, .94, 1]); sky.moon.visible = false; hemi.intensity = 1.0; hemi.color.setRGB(.82, .9, 1); hemi.groundColor.setRGB(.6, .55, .42); sun.intensity = 3.0; sun.color.setRGB(1, .9, .76); rim.intensity = 1.9; rim.color.setRGB(1, .93, .82);
  scene.fog.color.setRGB(.82, .9, 1); scene.fog.density = .0006; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function dusk() { day(); sun.color.setRGB(1, .66, .42); sun.intensity = 2.3; setSky([.14, .18, .52], [.74, .42, .56], [1, .6, .34]); hemi.color.setRGB(.9, .74, .8); scene.fog.color.setRGB(.9, .66, .6); rim.color.setRGB(1, .6, .4); }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.05; setSky([.04, .05, .2], [.12, .12, .38], [.3, .22, .48]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.1; hemi.color.setRGB(.7, .74, 1); hemi.groundColor.setRGB(.3, .28, .4); sun.intensity = 1.1; sun.color.setRGB(.78, .78, 1); rim.intensity = 1.8;
  scene.fog.color.setRGB(.12, .12, .3); scene.fog.density = .0009; bloom.strength = .32; bloom.threshold = .82; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; bloom.threshold = .86; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
// estado de los botones: el del Opa se gasta en 53,1 s; el mío en 128,1 s (en el día repetido el Opa ya no lo tiene)
let KOPA = true, KICH = true;
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } c.blob.visible = true; if (c.knopf) { c.knopfOn(true); c.knopf.scale.setScalar(c === baby ? 1.6 : 1); } }
  for (const p of PROPS) { p.visible = false; p.rotation.order = 'XYZ'; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const k in SETS) SETS[k].visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.42; grade.uniforms.sharp.value = 1.5; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; DOF = 1; day(); }
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
const kp = ch => wpos(ch.knopf);
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { dist *= 1.45; if (dist2 != null) dist2 *= 1.45; const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .85, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .6 + dy, h.z + fz * d - fx * side], [h.x, h.y - .9, h.z], fov); }
// plano del botón: cámara delante del botón de ch a distancia d (de d0 a d1), un poco desde arriba
function onKnopf(ch, d0, d1, k, side = 0, dy = .6, fov = 38) { const p = kp(ch), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(d0, d1, easeInOut(clamp(k))); cam([p.x + fx * d + fz * side, p.y + dy, p.z + fz * d - fx * side], [p.x, p.y + .45 * d / 4, p.z], fov); }
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
// tumbado en la cama del hospital (cabecero alzado): el Opa recostado mirando a +z
function inBed(c, L, pose = {}, ry = 0) { const b = KZ.BED.position, X = KZX; put(c, X + b.x, 3.0, b.z - 2.6, ry); c.root.rotation.x = -.95; actuar(c, 0, [[0, { lLx: 1.45, lRx: 1.45, lLk: .12, lRk: .12, aLz: .12, aRz: .12, aLe: .3, aRe: .3, headX: .55, ...pose }]], { T: L.T, weight: false, breathe: true }); c.blob.visible = false; return c; }
// botones según la historia: el del Opa se gasta a las 55,4 s (salvo en flashbacks); el mío a las 128,1 s
const opaBtn = (c, T, on = T < 55.4) => { c.knopfOn(on); return c; };
const myBtn = (c, T, on = T < 128.1) => { c.knopfOn(on); return c; };
// ---------- gente ----------
function crowdAt(L, cx, cz, n, r0, r1, seed = 1, o = {}) { POST.push(() => { const list = (o.list || EX).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc_ = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.2), ac + 6.283 - (o.gap ?? 1.2)];
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
  else if (m === 'knopf') { actuar(c, 0, [[0, { aRx: .9, aRz: -.3, aRe: 1.6, headX: .45, lean: .08 }]], { T: L.T }); cara(c, T, { expr: 'happy', mouth: 'smile' }); }
  else if (m === 'sitb') { sit(c, x, o.seat ?? 2.4, z, ry, L, { aLx: .4, aRx: .4, aLe: .6, aRe: .6, headY: Math.sin(L.T * .9 + i) * .3 }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); }
  else if (m === 'sitcheer') { const j = Math.abs(Math.sin(L.T * 7 + i)); sit(c, x, o.seat ?? 2.4, z, ry, L, { aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3 }); laughF(c, T); }
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); } }
// plano medio/entero de un personaje: cámara delante (yaw relativo a su ry), centro a la altura del pecho
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null, dy = 3.3) { const s = ch.spec.scale || 1, p = ch.root.position, c = V(p.x, p.y + dy * s, p.z); const q = easeInOut(clamp(k)); orbit(c, lerp(dist, dist2 ?? dist * .88, q) * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const toCam = ch => { const p = ch.root.position; ch.root.rotation.y = Math.atan2(camera.position.x - p.x, camera.position.z - p.z); };
// ---------- escenarios por plano ----------
function town(L, o = {}) { use('LT'); if (o.night) { night(30); renderer.toneMappingExposure = .85; TINT = 'rgba(10,16,60,.22)'; } else if (o.dusk) dusk(); else day(); }
function opaS(L, o = {}) { use('OP'); o.dusk ? dusk() : day(); }
function schulS(L, o = {}) { use('SC'); o.dusk ? dusk() : day(); }
function sportS(L, o = {}) { use('SP'); o.dusk ? dusk() : day(); SP.SB.userData.set(...(o.score || [0, 0])); }
function klinikS(L, o = {}) { use('KA'); o.night ? (night(30), TINT = 'rgba(10,16,60,.2)') : o.dusk ? dusk() : day(); }
// habitación: o.mode 'day' | 'dusk' | 'night'; o.flat = instante (absoluto) en que la línea del monitor se queda plana
function zimmerK(L, o = {}) { use('KZ'); const m = o.mode || 'night'; inside(m === 'night' ? .75 : 1.0, m === 'night' ? 30 : 46); if (m === 'night') { hemi.color.setRGB(.8, .85, 1); KZ.LMP.intensity = 70; KZ.BEDL.intensity = 60; FILL.color.setRGB(1, .85, .7); } else { KZ.LMP.intensity = 140; KZ.BEDL.intensity = 0; } KZ.view(m); KZ.ecg(L.T, o.flat || 0, o.bpm || 64); }
function meinZimmer(L, o = {}) { use('ZI'); inside(o.dark ? .6 : 1.0, o.dark ? 24 : 46); ZI.LMP.intensity = o.dark ? 30 : 120; }
function kuecheS(L) { use('KU'); inside(1.0, 46); }
function klasseS(L) { use('KL'); inside(1.0, 46); }
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
const KEY = /^(Stadt|Knopf|Bauch|einmal|immer|Opa|schlimmsten|7|52|6|45|Wecker|Kakao|spät|Elfmeter|verloren|weinend|lächelte|Morgen|Seltsames|Pünktlich|sauber|Tribüne|gewannen|schwächer|Krankenhaus|Großer|Mathearbeit|gestritten|wütend|erschöpft|Herzmonitor|Ton|weg|perfekten|schwarz|lebte|umarmte|Fotoalbum|Tablet|tausendmal|wunderschön|beste|benutzt|Tränen|warum|schenken|flüsterte|bereut|drücken)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0;
// ---------- a: gancho (la regla del botón) y el peor día de mi vida (0 – 42,67 s) ----------
// Lindenthal: plaza alrededor de (0, 0, -10); Maibaum (18, -14); fuente (-14, -26); café x = 38; bancos x = -40 (miran +x).
// Casa del Opa (OPX): banco con asiento a 2,55 en (OPX + 2, 3) mirando +z.
const OSEAT = 2.55, OB = V(OPX + .4, 0, 3.4);
// el Opa en su banco tallando; o.knife / o.bird: lo que tiene en las manos
function opaBench(L, o = {}) { opaS(L, o); const c = sit(opa, OB.x, OSEAT, OB.z, o.ry ?? 0, L, o.pose || { aLx: 1.1, aRx: 1.2, aLz: -.25, aRz: -.3, aLe: 1.5, aRe: 1.6, headX: .35 }); opaBtn(c, L.T, o.btn);
  if (o.knife !== false) attach(KNIFE, c.aR.hand, [0, -.4, .3], [1.2, 0, 0], .9); if (o.bird !== false) attach(WOODB, c.aL.hand, [.2, -.5, .3], [0, .4, 0], .9); c.blob.visible = false; return c; }
// el niño en la plaza / la calle
const KP = V(-6, 0, 4);

// 1 «In dieser Stadt»: grúa que baja sobre la plaza de Lindenthal: gente por todas partes, cada uno con su botón brillando
shot(0, 'C', null, L => { town(L); crowdAt(L, 0, -6, 24, 4, 30, 1, { full: true, mode: i => ['walk', 'talk', 'wave', 'knopf', 'walk', 'talk'][i % 6], speed: 2 });
  orb(L.k, V(0, 4, -6), V(0, 4, -8), [70, .3, .55, 50], [40, .15, .3, 46], easeOut); sh(V(0, 0, -6), 50); }, [[0, 'city_amb', .5], [.2, 'murmur', .4], [.5, 'chime', .25]]);
// 2 «jeder»: travelling hacia atrás por la calle: cinco vecinos caminan hacia la cámara, todos con el botón encendido
shot(1.10, 'W', null, L => { town(L); for (let i = 0; i < 5; i++) { const c = EX[3 + i], x = -10 + i * 5 + (i % 2) * .6, z = 10 + (i % 2) * 3 + L.lt * 2.4; put(c, x, 0, z, 0); actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 9 + i)) * .12; cara(c, L.T + i, { expr: 'happy', mouth: i % 2 ? 'smile' : 'open_smile' }); }
  crowdAt(L, 0, -10, 10, 14, 30, 2, { mode: 'talk' }); cm([0, 5.2, 36 + L.lt * 2.4], [0, 4.2, 24], L.k); camera.lookAt(0, 3.6, 10 + L.lt * 2.4); camera.fov = 46; sh(V(0, 0, 14), 30); }, [[0, 'steps', .5], [.4, 'murmur', .3]]);
// 3 «mit einem Knopf mitten auf dem Bauch»: acercamiento al botón de una vecina; brilla y ella lo toca con orgullo
shot(1.90, 'Z', 'punch', L => { town(L); const c = put(EX[9], -2, 0, -2, 0); actuar(c, L.lt, [[0, { headX: .3 }], [.4, { aRx: .7, aRz: -.25, aRe: 1.4, headX: .4 }, { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); c.knopfOn(true, 2.2 + Math.sin(L.T * 8) * .8);
  crowdAt(L, -2, -8, 6, 8, 20, 3, { mode: 'talk' }); onKnopf(c, 7, 3.4, L.k, .3, 1.2, 40); sh(V(-2, 0, -2), 16); }, [[0, 'pling', .5], [.3, 'hum_glow', .4]]);
// 4 «geboren»: el hospital: un bebé en la cuna con su botón diminuto brillando; la madre se inclina sonriendo
shot(2.98, 'F', null, L => { zimmerK(L, { mode: 'day' }); show(CRIB, KZX + 7, 0, 4, -.4); const b = put(baby, KZX + 7, 3.12, 4.4, -.4); b.root.rotation.order = 'YXZ'; b.root.rotation.x = -PI / 2; actuar(b, 0, [[0, { aLx: 2.4 + Math.sin(L.T * 5) * .3, aRx: 2.2, aLe: .6, aRe: .8, lLx: .6 + Math.sin(L.T * 6) * .3, lRx: .4, lLk: .5, lRk: .6 }]], { T: L.T, weight: false }); cara(b, L.T, { eyes: 'happy', mouth: 'open_smile' }); b.blob.visible = false; b.knopfOn(true, 2.6 + Math.sin(L.T * 6));
  const m = put(EX[4], KZX + 10.4, 0, 5.4, -1.7); actuar(m, 0, [[0, { lean: .35, headX: .3, aLx: .9, aRx: .9, aLe: .9, aRe: .9 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', eyes: 'happy', mouth: 'smile' });
  cm([KZX + 6.4, 9.4, 11.4], [KZX + 6.8, 8.6, 9.6], L.k); camera.lookAt(KZX + 7, 3.2, 4.2); camera.fov = 44; }, [[0, 'baby_coo', .6], [.2, 'sparkle', .4]]);
// 5 «Und dieser Knopf»: un dedo se acerca despacio al botón
shot(3.74, 'S', null, L => { town(L); const c = put(EX[11], 4, 0, -4, -.2); actuar(c, L.lt, [[0, { aRx: .5, aRz: -.1, aRe: 1.0, headX: .4 }], [.1, { aRx: .95, aRz: -.42, aRe: 1.7, headX: .45, lean: .06 }, { dur: .7 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', mouth: 'smirk' });
  onKnopf(c, 4.2, 3.2, L.k, -1.2, 1.6, 42); sh(V(4, 0, -4), 14); }, [[.1, 'tension_tick', .4]]);
// 6 «lässt dich einen Tag deines Lebens»: el reloj de la iglesia gira hacia atrás y el sol cruza el cielo al revés
shot(4.61, 'R', null, L => { town(L); const sp = L.lt * 14; show(CLOCK, 0, 40, -106.6); CLOCK.userData.H1.rotation.z = sp * .5; CLOCK.userData.H2.rotation.z = sp * 6;
  crowdAt(L, 0, -60, 8, 4, 20, 4, { mode: 'walk', speed: -6 }); cm([8, 10, -40], [4, 22, -62], L.k); camera.lookAt(0, 34, -106); camera.fov = 44; sh(V(0, 0, -80), 50);
  sun.position.add(V(Math.sin(L.lt * 4) * 160, 0, 0)); const q = L.k; setSky([lerp(.16, .5, Math.sin(q * PI)), lerp(.44, .3, Math.sin(q * PI)), lerp(.96, .5, Math.sin(q * PI))], [.45, .72, 1], [lerp(.86, 1, q), lerp(.94, .7, Math.sin(q * PI)), lerp(1, .5, Math.sin(q * PI))]);
  badge('gold', '1 TAG', W / 2, H * .17, clamp((L.lt - .25) / .2), 1, 1.1); }, [[0, 'clock_rewind', .7], [.6, 'tick_fast', .4]]);
// 7 «neu starten.»: ¡clic! una onda de luz turquesa sale del botón y barre la plaza
shot(6.14, 'F', null, L => { town(L); const c = put(EX[12], 0, 0, -10, 0); actuar(c, L.lt, [[0, { aRx: .95, aRz: -.42, aRe: 1.7, headX: .3 }], [.25, { aLx: .5, aRx: .5, aLz: .5, aRz: .5, aLe: 1, aRe: 1, lean: -.1, headX: -.2 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'o' });
  const p = kp(c); ringwave(p, clamp((L.lt - .08) / .8), V(p.x, p.y + 30, p.z), 30); RINGW.rotation.x = -PI / 2; sparks(p, L.t0 + .08, L.T, 30, 1.2); crowdAt(L, 0, -10, 12, 6, 24, 5, { mode: 'shock' });
  grade.uniforms.flash.value = Math.max(0, .7 - L.lt * 2); orb(L.k, V(0, 3, -10), null, [20, .4, .32, 46], [16, .2, .22, 46]); sh(V(0, 0, -10), 28); }, [[.05, 'button_click', .8], [.1, 'whoosh_magic', .6]]);
// 8 «Nur einmal.»: el botón enorme ocupando el plano; «NUR 1×»
shot(7.13, 'C', 'punch', L => { town(L); const c = put(EX[13], 0, 0, 0, 0); cara(c, L.T, { expr: 'neutral' }); c.knopfOn(true, 2.6); onKnopf(c, 2.6, 2.2, L.k, 0, .3, 40); badge('cyan', 'NUR 1×', W / 2, H * .2, clamp((L.lt - .05) / .15), 1, 1.2); sh(V(0, 0, 0), 10); }, [[0, 'hit_deep', .6]]);
// 9 «Denn sobald du ihn drückst,»: un vecino pulsa su botón: la luz se encoge
shot(8.00, 'W', null, L => { town(L); const c = put(EX[14], 18, 0, -4, -.4); actuar(c, L.lt, [[0, { aRx: .4, aRe: .6 }], [.25, { aRx: .95, aRz: -.42, aRe: 1.75, headX: .4, lean: .08 }, { dur: .35 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'flat' });
  const pr = L.lt > .6; c.knopfOn(true, pr ? 4 : 2.2); if (pr) ringwave(kp(c), clamp((L.lt - .6) / .6), camera.position, 6);
  crowdAt(L, 18, -10, 5, 7, 18, 6, { mode: 'point', expr: 'shock' }); onBody(c, 15, .25, .1, 42, L.k, 12, .1); sh(V(18, 0, -4), 20); }, [[.6, 'button_click', .8], [.65, 'hum_glow', .4]]);
// 10 «verschwindet er für immer.»: el botón se deshace en chispas y deja solo una marca; «FÜR IMMER»
shot(9.28, 'I', null, L => { town(L); const c = put(EX[14], 18, 0, -4, -.4); cara(c, L.T, { expr: 'sad', mouth: 'frown' }); actuar(c, 0, [[0, { headX: .5, aLx: .3, aRx: .3 }]], { T: L.T }); const k = clamp(L.lt / .7);
  c.knopf.scale.setScalar(1 - k * .99); c.knopfUsed.visible = true; c.knopfUsed.scale.setScalar(1 / Math.max(.01, 1 - k * .99)); sparks(kp(c), L.t0, L.T, 26, .5); onKnopf(c, 4.4, 3.6, L.k, .4, .8, 40);
  badge('red', 'FÜR IMMER', W / 2, H * .19, clamp((L.lt - .35) / .2), 1, 1); sh(V(18, 0, -4), 12); }, [[0, 'sparkle_down', .6], [.35, 'hit_deep', .5]]);
// 11 «Deshalb heben ihn sich die meisten»: la plaza: todos se tapan el botón con la mano, como un tesoro
shot(10.59, 'S', null, L => { town(L); crowdAt(L, 4, -12, 20, 3, 24, 7, { full: true, mode: 'knopf' }); orb(L.k, V(4, 3, -12), null, [34, -.5, .35, 46], [28, -.2, .26, 46]); sh(V(4, 0, -12), 34); }, [[0, 'murmur', .4], [.4, 'cloth', .4]]);
// 12 «für etwas Wichtiges auf.»: una boda delante de la iglesia: los novios, los botones intactos, lluvia de confeti
shot(12.03, 'Z', null, L => { town(L); const a = put(EX[5], -2.4, 0, -96, .3), b = put(EX[1], 2.4, 0, -96, -.3); [a, b].forEach((c, i) => { actuar(c, 0, [[0, { aRx: i ? .5 : .2, aLx: i ? .2 : .5, aLz: i ? 0 : -.5, aRz: i ? -.5 : 0, aLe: 1, aRe: 1, headY: i ? -.3 : .3 }]], { T: L.T }); grin(c, L.T); });
  confRain(V(0, 0, -96), L.T); crowdAt(L, 0, -92, 10, 8, 18, 8, { mode: 'cheer' }); orb(L.k, V(0, 3.6, -96), null, [22, .1, .2, 44], [17, -.05, .16, 44]); sh(V(0, 0, -96), 24); }, [[0, 'church_bells', .5], [.2, 'cheer', .35]]);
// 13 «Manche benutzen ihn, um einen schrecklichen Fehler»: un camarero tropieza y la tarta vuela
shot(13.24, 'C', null, L => { town(L); const c = put(EX[6], 30, 0, -26, -PI / 2 + .3); const tr = L.lt > .6, k = clamp((L.lt - .6) / .6);
  if (!tr) { actuar(c, 0, [[0, { ...walkP(L.T, 1), aLx: 1.4, aRx: 1.4, aLe: .9, aRe: .9 }]], { T: L.T }); c.root.position.x -= L.lt * 3; attach(CAKE, c.aR.hand, [-.9, -.8, .6], [0, 0, 0], 1); cara(c, L.T, { expr: 'happy', mouth: 'smile' }); }
  else { c.root.position.x -= 1.8 + k * 1.2; c.root.rotation.z = -k * .5; actuar(c, 0, [[0, GEST.shock]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'scream' }); const p = arc([27, 5, -26], [22, .4, -26], 3, k); show(CAKE, p.x, p.y, p.z); CAKE.rotation.z = k * 3; if (k >= 1) { CAKE.scale.set(1.6, .3, 1.6); dust(V(22, 0, -26), L.t0 + 1.2, L.T, 8, .6); } }
  crowdAt(L, 30, -26, 6, 7, 16, 9, { mode: L.lt > 1 ? 'shock' : 'talk' }); cm([24, 7, -4], [23, 6.4, -8], L.k); camera.lookAt(26, 3, -26); camera.fov = 46; sh(V(26, 0, -26), 20); }, [[.6, 'trip', .6], [1.2, 'splat', .7], [1.3, 'gasp_crowd', .4]]);
// 14 «rückgängig zu machen.»: pulsa su botón: la tarta vuelve volando a sus manos
shot(14.88, 'R', null, L => { town(L); const c = put(EX[6], 27, 0, -26, -PI / 2 + .3); const k = clamp((L.lt - .25) / .7);
  actuar(c, L.lt, [[0, { aRx: .95, aRz: -.42, aRe: 1.75, headX: .3 }], [.3, { aLx: 1.4, aRx: 1.4, aLe: .9, aRe: .9 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: L.lt > .9 ? 'relief' : 'determined', mouth: L.lt > .9 ? 'open_smile' : 'flat' });
  c.knopfOn(L.lt < .2); if (L.lt > .15) ringwave(kp(c), clamp((L.lt - .15) / .7), camera.position, 10); const p = arc([22, .4, -26], [25.6, 5.2, -25.4], 3, easeOut(k)); show(CAKE, p.x, p.y, p.z); CAKE.rotation.z = (1 - k) * 3;
  grade.uniforms.sepia.value = .25 * (1 - k); cm([23, 6.4, -8], [24, 6.6, -10], L.k); camera.lookAt(25, 3.4, -26); camera.fov = 44; sh(V(26, 0, -26), 20); badge('cyan', 'RÜCKGÄNGIG', W / 2, H * .17, clamp((L.lt - .5) / .2), 1, .9); }, [[.15, 'button_click', .7], [.2, 'rewind', .6]]);
// 15 «Andere sparen ihn für den Tag,»: una pareja mayor en un banco al atardecer, de la mano
shot(16.10, 'W', null, L => { town(L, { dusk: true }); const a = sit(EX[25], -40, 2.55, -9.4, PI / 2, L, { aRx: .6, aRz: .3, aRe: .4, headY: .3 }), b = sit(EX[20], -40, 2.55, -6.4, PI / 2, L, { aLx: .6, aLz: .3, aLe: .4, headY: -.3 }); grin(a, L.T, { mouth: 'smile' }); cara(b, L.T, { expr: 'warm', mouth: 'smile' });
  cm([-26, 5.4, -4], [-27.5, 5, -6.4], L.k); camera.lookAt(-40, 4.2, -8); camera.fov = 42; sh(V(-40, 0, -8), 14); }, [[0, 'birds_evening', .4]]);
// 16 «an dem sie jemanden verlieren, den sie lieben.»: ella sola en el banco con la foto; una lágrima; la mano junto al botón
shot(17.56, 'B', 'slow', L => { town(L, { dusk: true }); const a = sit(EX[25], -40, 2.55, -8, PI / 2, L, { aLx: 1.3, aRx: 1.1, aLz: -.2, aRz: -.5, aLe: 1.3, aRe: 1.5, headX: .45 }); cara(a, L.T, { expr: 'cry', mouth: 'frown' }); tears(a, L.T); attach(PHOTO, a.aL.hand, [.3, -.6, .5], [-.4, .2, 0], .8);
  grade.uniforms.sat.value = 1.0; onFace(a, 6.4, .6, -1.2, 40, L.k, 4.6); sh(V(-40, 0, -8), 12); }, [[0, 'sad_piano_hit', .4]]);
// 17 «Aber mein Opa?»: golpe de zoom: mi Opa en su banco, levanta la vista de la talla y guiña un ojo
shot(19.26, 'Z', 'punch', L => { const c = opaBench(L, { btn: false }); cara(c, L.T, { expr: 'warm', eyes: L.lt > .4 ? 'wink' : 'happy', mouth: 'grin' }); applyPose(c, {}); actuar(c, 0, [[0, sitPose({ aLx: 1.1, aRx: 1.2, aLz: -.25, aRz: -.3, aLe: 1.5, aRe: 1.6, headX: -.05 })]], { T: L.T, weight: false });
  onFace(c, 6, .2, .6, 40, L.k, 5); badge('tag', 'OPA', W / 2, H * .16, clamp((L.lt - .05) / .15), 1, 1); sh(OB, 14); }, [[0, 'whoosh_up', .4], [.4, 'wink', .5]]);
// 18 «Er hat seinen für mich benutzt.»: el Opa con la mano en mi cabeza: su barriga sin botón (solo la marca), el mío brillando
shot(20.07, 'S', 'slow', L => { opaS(L); const o = put(opa, OPX - 1.2, 0, 10, .3); opaBtn(o, L.T, false); actuar(o, 0, [[0, { aRx: 2.1, aRz: -.6, aRe: 1.0, headX: .35, headY: -.3 }]], { T: L.T }); cara(o, L.T, { expr: 'warm', mouth: 'smile' });
  const k = put(kl, OPX + 1.4, 0, 11, -.3); cara(k, L.T, { expr: 'happy', mouth: 'open_smile' }); actuar(k, 0, [[0, { headX: -.25, headY: .3 }]], { T: L.T });
  cm([OPX + .2, 4.6, 22], [OPX, 3.6, 16], L.k); camera.lookAt(OPX, 3.0, 10.4); camera.fov = 44; sh(V(OPX, 0, 10), 16); }, [[0, 'heartbeat_soft', .4]]);
// 19 «Und ich wusste es nicht einmal.»: yo, pequeño, en la plaza, me encojo de hombros: «?»
shot(21.57, 'F', null, L => { town(L); const c = put(kl, KP.x, 0, KP.z, .2); actuar(c, L.lt, [[0, {}], [.1, GEST.shrug]], { T: L.T }); cara(c, L.T, { expr: 'confused', mouth: 'wavy' }); crowdAt(L, KP.x, KP.z - 6, 8, 6, 20, 10, { mode: 'walk' });
  onBody(c, 15, 0, .1, 42, L.k, 12); badge('q', '?', W / 2, H * .2, clamp((L.lt - .2) / .15), 1, 1); sh(KP, 16); }, [[.1, 'hmm', .5]]);

// ---------- el peor día ----------
// 20 «Als ich klein war,»: salgo de casa por la mañana, pequeño, con mi camiseta del 9
shot(23.06, 'W', null, L => { town(L); const c = put(kl, -46 + L.lt * 3, 0, 14, PI / 2); actuar(c, 0, [[0, walkP(L.T, 0)]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 9)) * .1; cara(c, L.T, { expr: 'happy', mouth: 'smile' });
  crowdAt(L, -30, 10, 6, 8, 18, 11, { mode: 'walk' }); cm([-30, 5, 26], [-32, 4.4, 22], L.k); camera.lookAt(-43 + L.lt * 3, 2.6, 14); camera.fov = 44; sh(V(-42, 0, 14), 18); badge('tag', '9 JAHRE', W / 2, H * .17, clamp((L.lt - .2) / .2), 1, .9); }, [[0, 'door_open', .5], [.3, 'steps', .4]]);
// 21 «hatte ich den schlimmsten Tag meines Lebens.»: nube gris sobre mí, la plaza se apaga: «SCHLIMMSTER TAG»
shot(24.02, 'C', 'slow', L => { town(L, { dusk: true }); const c = put(kl, KP.x, 0, KP.z, 0); actuar(c, 0, [[0, GEST.slump]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' }); grade.uniforms.sat.value = .75;
  orb(L.k, V(KP.x, 2.4, KP.z), null, [16, .3, .18, 44], [10, .2, .1, 42]); badge('red', 'SCHLIMMSTER TAG', W / 2, H * .17, clamp((L.lt - .2) / .2), 1, .85); sh(KP, 14); }, [[0, 'thunder_far', .5]]);
// 22 «Weil mein Wecker nicht klingelte,»: mi cuarto: duermo; el despertador, apagado
shot(25.72, 'S', null, L => { meinZimmer(L, { dark: true }); const c = put(kl, ZIX + 13, 3.3, -6.6, PI); c.root.rotation.order = 'YXZ'; c.root.rotation.x = -PI / 2; applyPose(c, { aLz: .2, aRz: .2 }); cara(c, L.T, { eyes: 'closed', mouth: Math.sin(L.T * 3) > 0 ? 'o' : 'flat' }); c.blob.visible = false;
  show(ALARM, ZIX + 6, 4.4, -10.4, 0, .55); ALARM.userData.show('--:--', '#ff3a3a'); cm([ZIX + 8, 8, 2], [ZIX + 9, 7, 0], L.k); camera.lookAt(ZIX + 10, 4, -9); camera.fov = 46; badge('big', 'Zzz', W * .62, H * .3, clamp(L.lt / .2), 1, .8); }, [[0, 'snore', .5], [.6, 'clock_tick', .4]]);
// 23 «wachte ich erst um 7 Uhr»: me despierto de golpe, ojos como platos
shot(27.35, 'Z', 'punch', L => { meinZimmer(L); const c = put(kl, ZIX + 13, 3.3 + Math.min(L.lt, .3) * 2, -6.6, PI); c.root.rotation.order = 'YXZ'; c.root.rotation.x = -PI / 2 + easeOut(clamp(L.lt / .35)) * 1.3; applyPose(c, GEST.shock); cara(c, L.T, { expr: 'shock', mouth: 'scream' }); c.blob.visible = false;
  const h = hp(c); cam([h.x - .6, h.y + 1.6, h.z + 6.4], [h.x, h.y + .2, h.z], 42); }, [[0, 'gasp', .6], [0, 'sheet_rustle', .5]]);
// 24 «52 auf.»: el despertador: 7:52 en rojo parpadeando
shot(28.59, 'C', 'punch', L => { meinZimmer(L); show(ALARM, ZIX + 6, 4.4, -10.4, 0, .55); ALARM.userData.show('7:52', '#ff3a3a', true, L.T); cm([ZIX + 6.2, 5.2, -5.2], [ZIX + 6, 4.9, -6.6], L.k); camera.lookAt(ZIX + 6, 4.5, -10.4); camera.fov = 40;
  badge('red', '7:52', W / 2, H * .2, clamp((L.lt - .05) / .15), 1, 1.2); }, [[0, 'alarm_beep', .6]]);
// 25 «Beim Frühstück kippte ich mir in der Eile»: la cocina: como a toda prisa, de pie, la taza al borde
shot(30.00, 'W', null, L => { kuecheS(L); const c = put(kl, KUX - 1, 0, 6.6, PI); actuar(c, 0, [[0, { aRx: 2.2, aRz: -.4, aRe: 2.0, aLx: 1.1, aLe: .6, lean: .12, headX: Math.sin(L.T * 9) * .08 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: Math.sin(L.T * 12) > 0 ? 'o' : 'flat' }); c.root.position.y = Math.abs(Math.sin(L.T * 11)) * .08;
  show(MUG, KUX - 1.4, 3.85, 4.2); cm([KUX + 4, 7.2, 13], [KUX + 2.6, 6.6, 11.6], L.k); camera.lookAt(KUX - 1, 4.2, 5); camera.fov = 44; }, [[0, 'kitchen_clatter', .5], [.4, 'munch', .5]]);
// 26 «Kakao über die Klamotten,»: el codo da a la taza: cacao volando, mancha marrón en la camiseta
shot(31.54, 'C', 'punch', L => { kuecheS(L); const c = put(kl, KUX - 1, 0, 6.6, PI); const k = clamp(L.lt / .35); actuar(c, 0, [[0, GEST.shock]], { T: L.T }); cara(c, L.T, { expr: 'shock', mouth: 'scream' });
  show(MUG, KUX - 1.4, 3.85, 4.2 + k * .4); MUG.rotation.x = k * 1.6; if (L.lt > .25) { const s = clamp((L.lt - .25) / .3); STAIN.visible = true; c.spine.add(STAIN); STAIN.position.set(.1, .9, .58); STAIN.scale.set(s * 1.2, s * 1.4, 1); show(SPILL, KUX - 1.4, 3.88, 5); SPILL.rotation.x = -PI / 2; SPILL.scale.setScalar(s * 1.2); }
  onBody(c, 9, .3, .12, 42, L.k, 8, .2, 2.8); }, [[.05, 'mug_tip', .7], [.2, 'splash', .7]]);
// 27 «sodass ich auch noch zu»: corro por el patio del colegio con la camiseta manchada
shot(32.68, 'S', null, L => { schulS(L); const c = put(kl, SCX - 6 + L.lt * 2, 0, 10 - L.lt * 9, PI - .2); actuar(c, 0, [[0, runP(L.T, 0)]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 13)) * .3; cara(c, L.T, { expr: 'worried', mouth: 'o' }); c.spine.add(STAIN); STAIN.visible = true; STAIN.position.set(.1, .9, .58); STAIN.scale.set(1.2, 1.4, 1);
  cm([SCX + 6, 4.6, 22], [SCX + 4, 4.2, 14], L.k); camera.lookAt(SCX - 4 + L.lt * 2, 2.8, 6 - L.lt * 9); camera.fov = 46; sh(V(SCX, 0, 0), 30); }, [[0, 'run_steps', .6], [.2, 'school_bell', .4]]);
// 28 «spät zur Schule kam.»: la maestra en la puerta, brazos cruzados, señala el reloj: «ZU SPÄT!»
shot(33.58, 'Z', null, L => { schulS(L); const t = put(lehr, SCX + 1.2, 0, -21, 0); actuar(t, L.lt, [[0, GEST.cross], [.4, { aRx: 1.9, aRz: -.3, aRe: 1.6, aLx: 1.2, aLz: -.5, aLe: 1.8 }]], { T: L.T }); cara(t, L.T, { expr: 'angry', mouth: 'frown' });
  const c = put(kl, SCX - 1.4, 0, -15, PI); actuar(c, 0, [[0, { ...GEST.cower, crouch: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(c, L.T);
  cm([SCX - 7, 5, -4], [SCX - 5.4, 4.6, -6], L.k); camera.lookAt(SCX, 3.6, -19); camera.fov = 44; sh(V(SCX, 0, -18), 16); badge('red', 'ZU SPÄT!', W / 2, H * .17, clamp((L.lt - .2) / .2), 1, 1); }, [[.1, 'tsk', .5], [.3, 'clock_tick', .4]]);
// 29 «Und als endlich mein Fußballspiel kam,»: el campo del SV Lindenthal: los dos equipos salen, la grada llena
shot(34.66, 'Z', null, L => { sportS(L); TEAM.forEach((c, i) => { const x = -10 + i * 4; put(c, SPX + x, 0, -2 + L.lt * 1.5, PI); actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); cara(c, L.T + i, { expr: 'happy', mouth: 'smile' }); }); const k = put(kl, SPX + 14, 0, -2 + L.lt * 1.5, PI); actuar(k, 0, [[0, walkP(L.T, 7)]], { T: L.T }); cara(k, L.T, { expr: 'determined', mouth: 'flat' });
  RIV.forEach((c, i) => { put(c, SPX - 8 + i * 4, 0, -14, 0); actuar(c, 0, [[0, { aLx: .2, aRx: .2, headY: Math.sin(L.T + i) * .3 }]], { T: L.T }); cara(c, L.T + i, { expr: 'smug', mouth: 'smirk' }); });
  crowdAt(L, SPX - 30, 0, 12, 0, 14, 12, { mode: 'sitcheer', seat: 2.65, ry: PI / 2, list: EX }); cm([SPX + 26, 16, 30], [SPX + 20, 12, 22], L.k); camera.lookAt(SPX, 2, -6); camera.fov = 48; sh(V(SPX, 0, -6), 44); }, [[0, 'stadium_crowd', .5], [.3, 'whistle', .5]]);
// 30 «verschoss ich den leichtesten»: el penalti: cojo carrerilla; el portero rival agachado
shot(36.50, 'S', null, L => { sportS(L); const c = put(kl, SPX + 1.6, 0, -18 + Math.min(L.lt, .9) * 3.4, PI); actuar(c, 0, [[0, runP(L.T, 0)]], { T: L.T }); c.root.position.y = Math.abs(Math.sin(L.T * 13)) * .25; cara(c, L.T, { expr: 'determined', mouth: 'flat' });
  show(BALL, SPX, .55, -25); const g = put(tw, SPX, 0, -33.6, 0); actuar(g, 0, [[0, { ...GEST.brace, aLz: 1.1, aRz: 1.1 }]], { T: L.T }); cara(g, L.T, { expr: 'determined', mouth: 'grimace' }); g.root.position.x += Math.sin(L.T * 6) * .5;
  cm([SPX + 3, 3.6, -10], [SPX + 2.4, 3.4, -12], L.k); camera.lookAt(SPX, 2.4, -30); camera.fov = 44; sh(V(SPX, 0, -26), 18); badge('tag', 'ELFMETER', W / 2, H * .16, clamp((L.lt - .2) / .2), 1, .9); }, [[0, 'run_steps', .5], [.2, 'crowd_tense', .4]]);
// 31 «Elfmeter»: ¡pum! el balón sale altísimo por encima de la portería
shot(37.54, 'C', 'punch', L => { sportS(L); const c = put(kl, SPX + .6, 0, -23.6, PI + .1); actuar(c, L.lt, [[0, { lRx: -.9, lLx: .3, aLz: .6, aRz: .6, aLx: .3, lean: -.2 }], [.12, { lRx: 1.5, lRk: .1, lLx: -.2, aLz: .9, aRz: .9, lean: -.35, headX: -.3 }, { dur: .15 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'grimace' });
  const k = clamp((L.lt - .12) / .7); const p = arc([SPX, .55, -25], [SPX - 2, 13, -44], 4, k); show(BALL, p.x, p.y, p.z); BALL.rotation.x = -L.T * 20; const g = put(tw, SPX - Math.min(k, .5) * 6, 0, -33.6, 0); actuar(g, 0, [[0, GEST.brace]], { T: L.T });
  cm([SPX + 5, 2.2, -18], [SPX + 4.4, 2.6, -19], L.k); camera.lookAt(SPX - .5, 3.6 + k * 4, -30); camera.fov = 48; sh(V(SPX, 0, -28), 20); }, [[.12, 'kick', .9], [.3, 'whoosh_ball', .5]]);
// 32 «Lebens.»: el balón vuela por encima de la red y se pierde entre los pinos
shot(38.32, 'W', null, L => { sportS(L); const k = clamp(L.lt / .54); show(BALL, SPX - 2, 13 + k * 4, -46 - k * 16); BALL.rotation.x = -L.T * 20; const g = put(tw, SPX - 3, 0, -33.6, .2); actuar(g, 0, [[0, GEST.point]], { T: L.T }); laughF(g, L.T);
  cm([SPX + 2, 3, -20], [SPX + 2, 3.4, -21], L.k); camera.lookAt(SPX - 2, 9 + k * 3, -46); camera.fov = 50; sh(V(SPX, 0, -36), 24); }, [[0, 'crowd_ohh', .6]]);
// 33 «Deshalb haben wir verloren.»: el marcador 0 : 1; los rivales lo celebran
shot(38.86, 'R', null, L => { sportS(L, { score: [0, 1] }); RIV.forEach((c, i) => { crowdGuy(c, SPX - 6 + i * 3, -42, L, i, { mode: 'cheer', face: V(SPX, 3, -20) }); });
  cm([SPX, 6, -26], [SPX, 8, -30], L.k); camera.lookAt(SPX, 11, -50); camera.fov = 48; sh(V(SPX, 0, -46), 24); badge('red', 'VERLOREN', W / 2, H * .66, clamp((L.lt - .3) / .2), 1, .9); }, [[0, 'buzzer', .5], [.2, 'cheer', .4]]);
// 34 «Wegen mir.»: mis compañeros me miran mal; yo, cabizbajo en medio
shot(39.94, 'I', 'slow', L => { sportS(L, { dusk: true }); const c = put(kl, SPX, 0, -10, 0); actuar(c, 0, [[0, GEST.slump]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' });
  TEAM.slice(0, 4).forEach((t, i) => { const a = -1.3 + i * .85, x = SPX + Math.sin(a + PI) * 5.5, z = -10 + Math.cos(a + PI) * 5.5; put(t, x, 0, z, faceTo(V(x, 0, z), V(SPX, 0, -10))); actuar(t, 0, [[0, i % 2 ? GEST.cross : GEST.point]], { T: L.T }); cara(t, L.T + i, { expr: 'angry', mouth: 'frown' }); });
  orb(L.k, V(SPX, 2.2, -10), null, [14, .1, .3, 44], [9, .05, .2, 42]); sh(V(SPX, 0, -10), 16); }, [[0, 'grumble', .5]]);
// 35 «Ich kam weinend»: vuelvo a casa por la calle, de noche, arrastrando los pies
shot(40.91, 'W', null, L => { town(L, { dusk: true }); const c = put(kl, -20 + L.lt * 2, 0, 24, PI / 2); actuar(c, 0, [[0, { ...walkP(L.T * .6, 0), lean: .2, headX: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'cry', mouth: 'frown' }); c.spine.add(STAIN); STAIN.visible = true; STAIN.position.set(.1, .9, .58); STAIN.scale.set(1.2, 1.4, 1);
  cm([-6, 4, 34], [-8, 3.8, 32], L.k); camera.lookAt(-18 + L.lt * 2, 2.6, 24); camera.fov = 42; sh(V(-18, 0, 24), 16); }, [[0, 'steps_slow', .5], [.3, 'sniff', .5]]);
// 36 «nach Hause.»: primer plano: lloro, lágrimas
shot(41.80, 'F', null, L => { town(L, { dusk: true }); const c = put(kl, -16, 0, 24, .4); actuar(c, 0, [[0, { headX: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'cry', mouth: Math.sin(L.T * 10) > 0 ? 'frown' : 'grimace' }); tears(c, L.T); onFace(c, 3.4, .1, .3, 40, L.k, 2.8); sh(V(-16, 0, 24), 10); }, [[0, 'sob', .6]]);


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
  hideAll(); BAD_.length = 0; s.fn(L); while (POST.length) POST.shift()();
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
  { const fd = camera.position.distanceTo(CAMT); bokeh.uniforms.focus.value = fd; bokeh.uniforms.aperture.value = DOF * .0022 * clamp((26 - fd) / 14); bokeh.enabled = bokeh.uniforms.aperture.value > .00005 && QS.get('dof') !== '0'; }
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
  for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { applyPose, hp, kl, gr, opa, renderer, composer, bloom, sun, grade, scene, camera, KZ, SP };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

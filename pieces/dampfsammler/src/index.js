// DAMPFSAMMLER — «In dieser Stadt ist Dampfen streng verboten»: quien vapea y suelta el humo, se lo lleva el Dampfsammler. 1080×1920, 30 fps.
// Estructura del viral del «Husser» (regla → monstruo → 3 víctimas → el pueblo en silencio → «los elige» → papá desaparecido → la radio → mi hermano),
// con otro tema (vapear), otro villano (caballero de chistera, no terrorífico), otra ciudad (Hufenbach), otro reparto y otros datos.
// Planos en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, canvasTex, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { hufenbach, townhouse } from './gort.js';
import { makeExtra } from './ecast.js';
import { zockerhalle, viceScreen } from './zsets.js';
import { club, ringStage, warnSign, warnPoster, radio, machine, keller, cuarto, glowM } from './ssets.js';
import { makeIch, makeBruder, makePapa, makeDJ, makeRocco, makeKai, makeSammler } from './scast.js';
import { vape, holdVape, smokePool, vapePhase, armVape } from './vape.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 117.9, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const QS = new URLSearchParams(location.search);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = QS.get('ao') === '1';
// los sprites (humo) no aguantan el material de sustitución del AO: se ocultan mientras ese pase dibuja su profundidad
const SPRITES = []; const noSprites = p => { const r0 = p.render.bind(p); p.render = (...a) => { if (!SPRITES.length) scene.traverse(o => { if (o.isSprite || o.isPoints) SPRITES.push(o); }); const v = SPRITES.map(s => s.visible); SPRITES.forEach(s => s.visible = false); try { r0(...a); } finally { scene.overrideMaterial = null; SPRITES.forEach((s, i) => s.visible = v[i]); } }; };
noSprites(ao);
let CAMT = new THREE.Vector3();
// supermuestreo (?ss=2 por defecto): se renderiza al doble y se reduce al dibujar → bordes nítidos sin dientes
const SS = +(QS.get('ss') ?? 1.3); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0003; sun.shadow.normalBias = .12; sun.shadow.radius = 2.5; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-95, 105, 85)); rim.target.position.copy(p); rim.position.copy(p).add(V(70, 45, -100)); }
// bordes marcados: personajes 3, escenarios 2,2, atrezo 1,8 (a la resolución de salida; se escalan con el supermuestreo)
const OC = 2 * SS, OS = 1.5 * SS, OP = 1.25 * SS;

// ---------- escenarios ----------
// Hufenbach (x = 0) de día: plaza x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (-6, -92); fuente (-18, -24); café (36, -40).
const HB = hufenbach(scene);
[HB.RANK, HB.BOX, HB.PRICE, HB.KINO, HB.TS].forEach(o => o && (o.visible = false));
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3), 20 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 30 + i, Math.PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 40 + i, -Math.PI / 2); }
for (let i = 0, x = -60; x <= 60; x += 18, i++) townhouse(HB.G, x, 150, 16, 2 + (i % 2), 100 + i, Math.PI);
// escenario de la Dampfring-Meisterschaft en la plaza norte (mira al sur, +z)
const RSP = V(-6, 0, -58); const RS = ringStage(HB.G, RSP.x, RSP.z);
// carteles «DAMPFEN VERBOTEN» repartidos por la plaza
const WARN = new THREE.Group(); HB.G.add(WARN);
[[-14, 8, .3], [10, -6, -.4], [-30, -20, .6], [22, 24, -.2], [-40, 30, .9], [30, -30, -.7], [0, 40, 0], [-20, -40, .2]].forEach(([x, z, r]) => warnSign(WARN, x, z, r));
// club NACHTWERK (CX), sala del torneo (AX), sótano de papá (KX), mi cuarto (ZX)
const CX = 1300, AX = 1700, KX = 2100, ZX = 2500;
const CL = club(scene, CX); const VICE = viceScreen(); const AR = zockerhalle(scene, AX, VICE); const KE = keller(scene, KX); const CU = cuarto(scene, ZX);
{ const ban = textPlane(30, 4, 1200, 160, (c, w, h) => { const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#ff3a9a'); g.addColorStop(1, '#3ae0ff'); c.fillStyle = g; c.fillRect(0, 0, w, h); txt(c, 'TURNIER – FINALE', w / 2, h / 2 + 6, 110, '#ffffff', '#1a0a3a', 12); }, .8); ban.position.set(0, 16.2, -21.6); AR.g.add(ban); }
// pósteres «DAMPFEN VERBOTEN» en el club (se ven en «Im Club feiern alle ohne eine einzige Wolke»)
const CLP = new THREE.Group(); CL.g.add(CLP); for (const [x, z, r] of [[34.6, 10, -Math.PI / 2], [-34.6, -10, Math.PI / 2], [26, -27.6, 0], [-26, -27.6, 0]]) { const p = warnPoster(6, 8.4); p.position.set(x, 10, z); p.rotation.y = r; CLP.add(p); }
const SETS = { HB: HB.G, CL: CL.g, AR: AR.g, KE: KE.g, CU: CU.g };
for (const k in SETS) outline(SETS[k], OS);
// ---------- reparto ----------
const ich = makeIch(scene), bru = makeBruder(scene), papa = makePapa(scene), dj = makeDJ(scene), rocco = makeRocco(scene), kai = makeKai(scene), sam = makeSammler(scene);
kitFace(ich, 'hero'); kitFace(bru, 'kid'); kitFace(papa, 'mustache'); kitFace(dj, 'plain'); kitFace(rocco, 'mustache'); kitFace(kai, 'kid'); 
const EX = Array.from({ length: 30 }, (_, i) => makeExtra(scene, i)); EX.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'girl', 'mustache', 'girl'][i % 6]));
const MAIN = [ich, bru, papa, dj, rocco, kai, sam];
const POOL = [...MAIN, ...EX];
POOL.forEach(c => outline(c.root, OC));
// sombra de contacto: mancha oscura y suave bajo los pies
const BLOBT = canvasTex(128, 128, (c, w, h) => { const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(.5, 'rgba(0,0,0,.3)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
POOL.forEach(c => { const b = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.6), new THREE.MeshBasicMaterial({ map: BLOBT, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 })); b.rotation.x = -Math.PI / 2; b.position.y = .06; b.renderOrder = 1; c.root.add(b); c.blob = b; });
// cada personaje con su vape en la mano derecha (oculto salvo cuando vapea)
const VP = new Map();
POOL.forEach((c, i) => { const v = holdVape(c, vape(scene, i + 2)); v.visible = false; outline(v, OP); outline(v.userData.grip, OP); VP.set(c, v); });
const OLDV = vape(scene, 6); outline(OLDV, OP);   // la vape vieja de papá (negra), suelta en el sótano
// ---------- atrezo ----------
const RADIO = radio(scene); outline(RADIO, OP);
const MACH = machine(scene); outline(MACH, OP);
const CHAIR = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0x1a1a24, { roughness: .5 }); box(2.8, .5, 2.6, m, .2, g, 0, 2.1, 0); box(2.8, 3.6, .5, m, .2, g, 0, 4.2, -1.25); box(1.2, 3.6, .52, mat(0x3ae0ff, { roughness: .5 }), .1, g, 0, 4.2, -1.24); for (const t of [-1, 1]) box(.4, .3, 2.2, m, .1, g, t * 1.5, 2.9, 0);
  cyl(.2, .2, 1.6, mat(0x8a8e9a, { metalness: .7 }), 8, g, 0, 1.0, 0); for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283; const l = box(1.4, .15, .25, mat(0x2a2a34), .05, g, Math.cos(a) * .7, .2, Math.sin(a) * .7); l.rotation.y = -a; } return g; })(); outline(CHAIR, OP);
const DESK = (() => { const g = new THREE.Group(); scene.add(g); box(7, .3, 3.2, mat(0x1a1a24, { roughness: .4 }), .05, g, 0, 3.2, 0); for (const s of [-1, 1]) box(.3, 3.2, 3, mat(0x2a2a34), .05, g, s * 3.3, 1.6, 0); box(7, .1, .1, glowM(0x3ae0ff, 2.5), 0, g, 0, 3.0, 1.6);
  const sc = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 3.0), new THREE.MeshBasicMaterial({ map: VICE.tex, toneMapped: false })); sc.position.set(0, 5.4, -.9); g.add(sc); box(5.8, 3.4, .3, mat(0x101016), .05, g, 0, 5.4, -1.1); box(.4, 1.4, .3, mat(0x101016), .05, g, 0, 3.9, -1.1);
  box(3, .1, 1, mat(0x2a2a34), .03, g, -.4, 3.4, .5); for (let i = 0; i < 12; i++) box(.18, .08, .18, glowM([0xff3a9a, 0x3ae0ff, 0xb86aff][i % 3], 1.6), .02, g, -1.6 + (i % 6) * .28, 3.48, .3 + Math.floor(i / 6) * .3); box(.6, .12, .9, mat(0x1a1a1a), .1, g, 2, 3.4, .5); return g; })(); outline(DESK, OP);
const TROPHY = (() => { const g = new THREE.Group(); scene.add(g); const gd = mat(0xffc830, { metalness: .9, roughness: .2 }); box(1.4, .5, 1.4, mat(0x2a2a30), .08, g, 0, .25, 0); cyl(.15, .3, 1, gd, 10, g, 0, 1, 0); cyl(.8, .4, 1.4, gd, 16, g, 0, 2.2, 0); return g; })(); outline(TROPHY, OP);
// anillos de vapor (aros perfectos que suben)
const RINGS = Array.from({ length: 8 }, () => { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .22, 10, 40), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: .7, roughness: 1, depthWrite: false })); scene.add(m); return m; });
const SMK = smokePool(scene, 1400);
// la sombra del Dampfsammler: humo negro (normal) + jirones azul/morado que brillan (aditivo)
const DSMK = smokePool(scene, 420); DSMK.tint.setRGB(.06, .04, .1);
const GSMK = smokePool(scene, 260); GSMK.list.forEach(sp => { sp.material.blending = THREE.AdditiveBlending; sp.renderOrder = 6; });
// sombra que surge alrededor de c (desde t0): columna giratoria de humo negro con destellos morados y azules
function shadowBurst(L, c, t0, dur = 1.2, R = 2.6, H_ = 9) { const t = L.T - t0; if (t < -.05) return; const n = 70;
  for (let i = 0; i < n; i++) { const r = RNG(i * 7 + 3), te = t0 + (i / n) * dur * .7, a = L.T - te; if (a < 0 || a > 1.6) continue; const s = DSMK.take(); if (!s) break; const k = a / 1.6, ang = i * 2.399 + a * 4.5, rad = R * (1.2 - .55 * k) * (.7 + r() * .5);
    s.position.set(c.x + Math.cos(ang) * rad, c.y + .3 + r() * H_ * .35 + a * H_ * .45, c.z + Math.sin(ang) * rad); const sc = (2.2 + a * 3.2) * (.8 + r() * .5); s.scale.set(sc, sc, 1); s.material.rotation = ang; s.material.opacity = .9 * clamp(a / .12) * (1 - k); s.material.color.copy(DSMK.tint); }
  for (let i = 0; i < 46; i++) { const r = RNG(i * 13 + 5), te = t0 + (i / 46) * dur * .7, a = L.T - te; if (a < 0 || a > 1.3) continue; const s = GSMK.take(); if (!s) break; const k = a / 1.3, ang = -i * 2.1 - a * 5.5, rad = R * (1 - .5 * k) * (.6 + r() * .6);
    s.position.set(c.x + Math.cos(ang) * rad, c.y + .5 + r() * H_ * .5 + a * H_ * .3, c.z + Math.sin(ang) * rad); const sc = (1.2 + a * 1.8) * (.7 + r() * .6); s.scale.set(sc, sc, 1); s.material.rotation = ang; s.material.opacity = .55 * clamp(a / .1) * (1 - k); s.material.color.setRGB(...(i % 2 ? [.55, .2, 1] : [.2, .55, 1])); } }
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 2 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
// chispas cian del Dampfsammler (cuando aparece o se lleva a alguien)
const SPARK = Array.from({ length: 40 }, () => sphere(.12, new THREE.MeshBasicMaterial({ color: new THREE.Color(.5, 1, 1.2).multiplyScalar(2.4), toneMapped: false }), scene, 0, 0, 0, 6, 4));
function sparks(c, T0, T, n = 30, sp = 1) { SPARK.forEach((s, i) => { if (i >= n) return; const r = RNG(i * 13 + 2), t = T - T0; if (t < 0 || t > 1.2) return; s.visible = true; const a = r() * 6.283, v = (3 + r() * 5) * sp; s.position.set(c.x + Math.cos(a) * v * t, c.y + (4 + r() * 4) * t - 6 * t * t, c.z + Math.sin(a) * v * t); s.scale.setScalar(1 - t / 1.2); }); }
// remolino: chispas que giran alrededor de un punto subiendo (desaparición)
function swirl(c, T0, T, R = 2.6, n = 40) { SPARK.forEach((s, i) => { if (i >= n) return; const t = T - T0; if (t < 0 || t > 1.6) return; s.visible = true; const a = i * 2.399 + t * 7, h = (i % 10) / 10 * 7 + t * 3; s.position.set(c.x + Math.cos(a) * R * (1 - t * .35), c.y + h, c.z + Math.sin(a) * R * (1 - t * .35)); s.scale.setScalar(1.2 * (1 - t / 1.6)); }); }
const STEAM = [], FIRE = [], NOTES = [], HEARTS = [], FW = [];
const DROPV = vape(scene, 3); outline(DROPV, OP);   // la vape que se queda en el suelo
// columna de anuncios (Litfaßsäule) con tres carteles «VERMISST» y uno «DAMPFEN VERBOTEN»
const drawMissing = (c, w, h, name, col, hair) => { c.fillStyle = '#fff6e0'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8202f'; c.fillRect(0, 0, w, 70); txt(c, 'VERMISST', w / 2, 38, 52, '#ffffff');
  c.fillStyle = '#cfe8ff'; c.fillRect(30, 90, w - 60, 200); c.fillStyle = col; c.fillRect(w / 2 - 70, 220, 140, 70); c.fillStyle = '#e8b48e'; c.fillRect(w / 2 - 50, 120, 100, 100); c.fillStyle = hair; c.fillRect(w / 2 - 54, 108, 108, 30); c.fillStyle = '#1a1a1a'; c.fillRect(w / 2 - 28, 160, 12, 14); c.fillRect(w / 2 + 16, 160, 12, 14); c.fillRect(w / 2 - 16, 196, 32, 6);
  txt(c, name, w / 2, 330, 44, '#1a1a24'); };
const LITF = (() => { const g = new THREE.Group(); scene.add(g); cyl(3.4, 3.4, 12, mat(0x2a5a3a, { roughness: .6 }), 28, g, 0, 6.6, 0); cyl(3.8, 3.8, .6, mat(0x1a3a2a, { roughness: .5 }), 28, g, 0, .3, 0); cyl(3.9, 3.6, 1.2, mat(0x1a3a2a, { roughness: .5 }), 28, g, 0, 13, 0); sphere(1.2, mat(0x1a3a2a), g, 0, 14, 0, 14, 8);
  const posters = [['DJ BLITZ', '#16161c', '#1a1208'], ['ROCCO', '#d8202f', '#14100c'], ['KAI', '#6a2ac8', '#3ae0ff']];
  posters.forEach(([n, c1, c2], i) => { const p = textPlane(2.9, 4.0, 260, 360, (c, w, h) => drawMissing(c, w, h, n, c1, c2)); const a = (i - 1) * .95; p.position.set(Math.sin(a) * 3.45, 7, Math.cos(a) * 3.45); p.rotation.y = a; g.add(p); });
  const wp = warnPoster(3.4, 4.6); wp.position.set(0, 7, -3.45); wp.rotation.y = Math.PI; g.add(wp); return g; })(); outline(LITF, OP);
const PROPS = [DROPV, LITF, RADIO, MACH, CHAIR, DESK, TROPHY, OLDV, ...RINGS, ...CONF, ...DUST, ...SWEAT, ...TEAR, ...SPARK];
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.0; hemi.color.setRGB(.82, .9, 1); hemi.groundColor.setRGB(.6, .55, .42); sun.intensity = 3.0; sun.color.setRGB(1, .88, .72); rim.intensity = 1.9; rim.color.setRGB(1, .93, .82);
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; SMK.tint.setRGB(1, 1, 1); }
function night(fill = 40) { MODE = 'night'; sky.clouds.forEach(c => c.visible = false); renderer.toneMappingExposure = 1.05; setSky([.04, .05, .2], [.12, .12, .38], [.32, .22, .5]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.15; hemi.color.setRGB(.7, .74, 1); hemi.groundColor.setRGB(.32, .28, .4); sun.intensity = 1.2; sun.color.setRGB(.78, .78, 1); rim.intensity = 1.8;
  scene.fog.color.setRGB(.12, .12, .3); scene.fog.density = .001; bloom.strength = .32; bloom.threshold = .82; FILL.intensity = fill; BIRDSON = 0; SMK.tint.setRGB(.8, .84, 1); }
function darkNight() { night(28); hemi.intensity = .55; sun.intensity = .55; renderer.toneMappingExposure = .9; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; bloom.threshold = .86; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; SMK.tint.setRGB(1, 1, 1); }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.head.visible = true; c.root.rotation.order = 'XYZ'; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } VP.get(c).visible = false; VP.get(c).userData.grip.visible = false; VP.get(c).userData.setGlow(0); c.blob.visible = true; }
  sam.setEyes(1); RADIO.userData.setGlow(0); MACH.userData.setPower(.4); OLDV.userData.setGlow(0);
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  SMK.reset(); DSMK.reset(); GSMK.reset(); WARN.visible = true; CLP.visible = false;
  for (const k in SETS) SETS[k].visible = false;
  KE.BULBS.forEach(b => { b.l.intensity = 70; b.bl.material.emissiveIntensity = 2.2; });
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .38; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.42; grade.uniforms.sharp.value = 1.4; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; day(); }
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
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b && w[2] !== 'HUSS!');
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

// ---------- vapear ----------
const mouthW = ch => { ch.root.updateMatrixWorld(true); return ch.head.localToWorld(V(0, .36 * (ch.spec.headScale || 1), .78)); };
const faceDir = ch => { ch.root.updateMatrixWorld(true); const d = new THREE.Vector3(); ch.head.getWorldDirection(d); return d; };
// dirección del humo: hacia delante y arriba, pero nunca hacia la cámara (se quita la componente que va a cámara y se desvía de lado)
const smokeDir = (ch, up = .3) => { const d = faceDir(ch); d.y = 0; d.normalize(); const m = mouthW(ch), tc = camera.position.clone().sub(m); tc.y = 0; tc.normalize(); const k = d.dot(tc);
  if (k > -.2) { d.addScaledVector(tc, -(k + .2)); const side = V(-tc.z, 0, tc.x); if (d.dot(side) < 0) side.negate(); d.addScaledVector(side, .9); } d.normalize(); d.y += up; return d; };
// ch da una calada que empieza en el tiempo absoluto t0 (calada de `inh` s). o.pose = pose base (sentado, etc.); o.expr; o.meter: muestra el Dampfmesser.
// Devuelve la fase (vapePhase) para sincronizar pop-ups.
const FACES = [];
function vaper(ch, L, t0, inh, o = {}) { if (!o.bg) FACES.push(ch); const lt = L.T - t0, ph = vapePhase(Math.max(0, lt), inh, o), base = o.pose || {};
  const tilt = ph.ph === 'inh' ? -.1 - ph.inhK * .08 : ph.ph === 'exh' ? -.2 * (1 - ph.exhK * .5) : ph.ph === 'hold' ? -.14 : 0;
  const chest = ph.ph === 'inh' ? -.05 * ph.inhK : ph.ph === 'exh' ? -.05 * (1 - ph.exhK) : 0;
  const av = armVape(ph.raise); const pose = { ...base, ...av, headX: (base.headX || 0) + tilt + (o.headX || 0), lean: (base.lean || 0) + chest, headY: (base.headY || 0) };
  actuar(ch, 0, [[0, pose]], { T: L.T, extra: o.extra }); ch.aR.sh.rotation.y = av.aRy;
  const v = o.vape || VP.get(ch); if (!o.noVape) { v.visible = true; if (v.userData.grip) v.userData.grip.visible = true; v.userData.setGlow(ph.ph === 'inh' ? .7 + Math.sin(L.T * 30) * .1 : .08); }
  const ex = o.expr || 'neutral'; cara(ch, L.T, { expr: ex, mouth: ph.ph === 'done' ? (o.after || 'smile') : ph.mouth, ...(ph.eyes && !o.eyes ? { eyes: ph.eyes } : {}), ...(o.eyes ? { eyes: o.eyes } : {}) });
  if (lt > ph.t3) { const m = mouthW(ch), d = smokeDir(ch, .3 + (o.dirUp || 0)); SMK.puff(m, d, L.T, t0 + ph.t3, ph.t4 - ph.t3, { pow: o.pow ?? 4.2 + inh * .5, size: o.size ?? (.7 + Math.min(inh, 10) * .12), n: o.n ?? Math.round(30 + Math.min(inh, 10) * 6), dens: o.dens ?? .85, seed: ch.seed + Math.round(t0 * 10), life: o.life ?? 3 }); } if (lt > ph.t3 && !o.bg) { const m2 = mouthW(ch), d2 = smokeDir(ch, .45 + (o.dirUp || 0)); SMK.puff(m2.clone().addScaledVector(d2, 1.6), d2, L.T, t0 + ph.t3 + .08, ph.t4 - ph.t3, { pow: 3.2, size: (o.size ?? 1.2) * 1.7, n: 46, dens: .62, up: .7, spread: .55, seed: ch.seed + 7, life: 3.2 }); }
  return ph; }
// vapea en bucle (gente de fondo): calada corta y nube cada pocos segundos, desfasado por personaje
function vapeLoop(ch, L, i = 0, o = {}) { const per = o.per ?? 4.2, inh = o.inh ?? (1 + (i % 3) * .5), off = (i * 1.37) % per; const t0 = Math.floor((L.T + off) / per) * per - off;
  // la bocanada anterior sigue en el aire mientras empieza la siguiente
  if (L.T - (t0 - per) < 3.5) { const pv = vapePhase(L.T - (t0 - per), inh, o); if (L.T - (t0 - per) > pv.t3) { const m = mouthW(ch), d = smokeDir(ch); SMK.puff(m, d, L.T, t0 - per + pv.t3, pv.t4 - pv.t3, { pow: 3.6, size: .75, n: 26, dens: .75, seed: ch.seed + i * 13 + Math.round((t0 - per) * 10) }); } }
  return vaper(ch, L, t0, inh, { gap: 9, bg: true, ...o }); }
// ninguna nube ni billete tapa la cara de un protagonista: lo que queda delante de la cara (en pantalla) se aparta o se vuelve transparente
function clearFaces() { if (!FACES.length) return; camera.updateMatrixWorld(); camera.updateProjectionMatrix();
  const F = FACES.filter(c => c.root.visible).map(c => { const h = hp(c).add(V(0, .65 * (c.spec.scale || 1), 0)); const p = h.clone().project(camera); const d = camera.position.distanceTo(h); const r = 1.25 * (c.spec.scale || 1) / (d * Math.tan(camera.fov * PI / 360)); return { p, d, r }; });
  const test = (o, fn) => { const q = o.position.clone().project(camera); const dc = camera.position.distanceTo(o.position); for (const f of F) { if (dc > f.d + .5) continue; const dx = (q.x - f.p.x) * W / H, dy = q.y - f.p.y, dd = Math.hypot(dx, dy); if (dd < f.r * 1.15) fn(dd / (f.r * 1.15), f); } };
  for (const s of SMK.list) if (s.visible) test(s, k => { s.material.opacity *= k * k * .25; });
}
const walkP = (T, i) => { const p = Math.sin(T * 9 + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
// gente vapeando alrededor de (cx, cz) — extras Roblox reales, nunca entre la cámara y el sujeto (hueco de ±gap alrededor de la cámara)
function vapeCrowd(L, cx, cz, n, r0, r1, seed = 1, o = {}) { POST.push(() => { const list = (o.list || EX).filter(c => !c.root.visible).slice(o.from || 0, (o.from || 0) + n); const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx);
  const arc = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.1), ac + 6.283 - (o.gap ?? 1.1)];
  list.forEach((c, i) => { const a = arc[0] + (i + r() * .8) / list.length * (arc[1] - arc[0]); const d = r0 + r() * (r1 - r0); const x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d;
    const face = o.face || camera.position; const ry = Math.atan2(face.x - x, face.z - z) + (r() - .5) * 1.1; put(c, x, 0, z, ry);
    vapeLoop(c, L, i + seed, { expr: ['smug', 'joy', 'neutral'][i % 3], per: 3.4 + (i % 4) * .5 }); }); }); }
// ---------- multitudes (solo extras Roblox reales) ----------
// gente alrededor de (cx, cz) en un arco por detrás del sujeto según la cámara (nunca entre la cámara y el sujeto).
// o.mode: 'idle' | 'wave' | 'cheer' | 'shout' | 'laugh' | 'shrug' | 'walk' | 'point' | 'clap' | 'shock' | 'dance' | 'look' (miran a o.face)
const CROWD = EX;
function crowdAt(L, cx, cz, n, r0, r1, seed = 1, o = {}) { const list = (o.list || CROWD).slice(o.from || 0, (o.from || 0) + n); POST.push(() => { const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.2), ac + 6.283 - (o.gap ?? 1.2)];
  const placed = [];
  list.forEach((c, i) => { if (c.root.visible) return; let x, z, tries = 0; do { const a = arc[0] + (i + r() * .8) / list.length * (arc[1] - arc[0]); const d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; tries++; } while (tries < 8 && placed.some(p => Math.hypot(p[0] - x, p[1] - z) < 3.4));
    placed.push([x, z]); crowdGuy(c, x, z, L, i, o); }); }); }
function crowdGrid(L, x0, z0, cols, rows, dx, dz, o = {}) { const list = (o.list || CROWD).slice(o.from || 0); let i = 0; const r = RNG(o.seed || 3);
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) { const c = list[i]; if (!c) return; const x = x0 + (col - (cols - 1) / 2) * dx + (row % 2) * dx * .5 + (r() - .5) * .8, z = z0 + row * dz + (r() - .5) * .8; if (o.skip && o.skip(x, z)) { i++; continue; } crowdGuy(c, x, z, L, i, o); i++; } }
function crowdGuy(c, x, z, L, i, o) { const T = L.T + i * .37, face = o.face || camera.position; let ry = Math.atan2(face.x - x, face.z - z) + Math.sin(i * 7.3) * (o.jit ?? .35);
  put(c, x, o.y ?? 0, z, ry); const m = o.mode;
  if (m === 'walk') { const d = (o.speed ?? 2.2) * L.lt, a = ry + (o.walkDir ?? 0); c.root.position.x += Math.sin(a) * d; c.root.position.z += Math.cos(a) * d; c.root.rotation.y = a; c.root.position.y = (o.y ?? 0) + Math.abs(Math.sin(L.T * 9 + i)) * .12; actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral' }); }
  else if (m === 'wave') { actuar(c, 0, [[0, { aRx: 2.7, aRz: .4 + Math.sin(L.T * 9 + i) * .35, aRe: .5, aLx: .2 }]], { T: L.T }); cara(c, T, { expr: 'happy', mouth: 'open_smile' }); }
  else if (m === 'cheer' || m === 'dance') { const j = Math.abs(Math.sin(L.T * (m === 'dance' ? 8 : 7) + i)); c.root.position.y = (o.y ?? 0) + j * .45 * (c.spec.scale || 1); actuar(c, 0, [[0, m === 'dance' ? { aLx: 2.6 + Math.sin(L.T * 8 + i) * .3, aRx: 1.2 + Math.cos(L.T * 8 + i) * .9, aLz: .3, aRz: .2, aLe: .5, aRe: 1.2, crouch: .05 + j * .1, twist: Math.sin(L.T * 4 + i) * .3, headZ: Math.sin(L.T * 8 + i) * .15 } : { aLx: 2.8, aRx: 2.8, aLz: .45 + j * .2, aRz: .45 + j * .2, aLe: .3, aRe: .3, crouch: .05 + j * .08 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'clap') { const j = Math.abs(Math.sin(L.T * 11 + i)); actuar(c, 0, [[0, { aLx: 1.3, aRx: 1.3, aLz: -.2 - j * .35, aRz: -.2 - j * .35, aLe: 1.0, aRe: 1.0 }]], { T: L.T }); cara(c, T, { expr: 'joy', mouth: 'open_smile' }); }
  else if (m === 'shout') { actuar(c, 0, [[0, { aLx: 2.0, aRx: 2.0, aLz: .9, aRz: .9, aLe: 1.6, aRe: 1.6, lean: -.08, headX: -.15 }]], { T: L.T }); cara(c, T, { expr: 'shout', mouth: 'talk_wide' }); }
  else if (m === 'shock') { actuar(c, 0, [[0, { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9, aRe: 1.9, lean: -.08, headX: -.06 }]], { T: L.T }); cara(c, T, { expr: 'shock', mouth: i % 2 ? 'o' : 'grimace' }); }
  else if (m === 'laugh') { actuar(c, 0, [[0, { aLx: .4, aRx: .9, aLz: -.4, aRz: .2, aRe: 1.5, lean: -.1 + Math.sin(L.T * 14 + i) * .05 }]], { T: L.T }); laughF(c, T); }
  else if (m === 'shrug') { actuar(c, 0, [[0, GEST.shrug]], { T: L.T }); cara(c, T, { expr: 'confused' }); }
  else if (m === 'point') { actuar(c, 0, [[0, { aRx: 1.6, aRz: .05, aRe: .1, aLx: .5, aLz: -.6, aLe: 1.5, lean: -.08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'shock', mouth: 'o' }); }
  else { actuar(c, 0, [[0, { headX: Math.sin(L.T * 1.3 + i) * .06, headY: Math.sin(L.T * .9 + i * 2) * .2, aLx: .1 + Math.sin(L.T * 2 + i) * .08 }]], { T: L.T }); cara(c, T, { expr: o.expr || 'neutral', mouth: o.mouth }); } }
// plano medio/entero de un personaje: cámara delante (yaw relativo a su ry), centro a la altura del pecho
function onBody(ch, dist, yaw = 0, pitch = .12, fov = 42, k = 0, dist2 = null, yaw2 = null) { const s = ch.spec.scale || 1, p = ch.root.position, c = V(p.x, p.y + 3.3 * s, p.z); const q = easeInOut(clamp(k)); orbit(c, lerp(dist, dist2 ?? dist * .88, q) * s, ch.root.rotation.y + lerp(yaw, yaw2 ?? yaw, q), pitch, fov); }
const sitY = (c, seat = 2.45) => seat + .1 - 2.05 * (c.spec.scale || 1);
const seatPose = (extra = {}) => ({ lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, ...extra });
// la cara mira a cámara
const toCam = ch => { const p = ch.root.position; ch.root.rotation.y = Math.atan2(camera.position.x - p.x, camera.position.z - p.z); };
// ---------- escenarios por plano ----------
function town(L, o = {}) { use('HB'); if (o.night) night(o.fill ?? 40); else if (o.dusk) { day(); sun.color.setRGB(1, .72, .5); sun.intensity = 2.2; setSky([.16, .2, .55], [.72, .42, .55], [1, .62, .36]); } else day(); RS.bulbs.forEach((b, i) => b.material.emissiveIntensity = 1.4 + Math.sin(L.T * 6 + i) * .8); }
// club: luces de colores que barren, pantalla LED y suelo que laten con la música; o.off = apagón (0..1); o.clean = sin una sola nube (carteles visibles)
function clubS(L, o = {}) { use('CL'); MODE = 'in'; BIRDSON = 0; renderer.toneMappingExposure = 1.0; hemi.intensity = .55; hemi.color.setRGB(.8, .7, 1); hemi.groundColor.setRGB(.3, .2, .4); sun.intensity = 0; rim.intensity = 1.2; rim.color.setRGB(1, .5, .9);
  bloom.strength = .14; bloom.threshold = .9; scene.fog.density = .0002; FILL.intensity = 26; FILL.color.setRGB(1, .85, 1); SMK.tint.setRGB(.95, .85, 1);
  const on = 1 - (o.off ?? 0); CL.drawLED(L.T, on); CL.drawFloor(L.T, on); CL.CONES.forEach((c, i) => { c.rotation.z = Math.sin(L.T * 1.6 + i) * .45; c.rotation.x = Math.cos(L.T * 1.3 + i * 2) * .3; c.visible = on > .5; });
  CL.DB.rotation.y = L.T * .8; CL.LM.intensity = 220 * on; CL.LS.intensity = 160 * on; CL.LC.forEach((l, i) => l.intensity = 90 * on * (.6 + .4 * Math.sin(L.T * 6 + i))); hemi.intensity = .55 * Math.max(.12, on); FILL.intensity = 26 * Math.max(.15, on);
  CLP.visible = !!o.clean; }
function arena(L) { use('AR'); MODE = 'in'; BIRDSON = 0; renderer.toneMappingExposure = 1.0; hemi.intensity = .85; hemi.color.setRGB(.85, .8, 1); hemi.groundColor.setRGB(.35, .3, .5); sun.intensity = 0; rim.intensity = 1.0; rim.color.setRGB(.6, .9, 1); bloom.strength = .24; bloom.threshold = .84; scene.fog.density = .0002; FILL.intensity = 34; FILL.color.setRGB(1, .95, 1); if (VICE.draw) VICE.draw(L.T); else if (VICE.update) VICE.update(L.T); }
function kellerS(L, o = {}) { use('KE'); inside(.75, 28); hemi.color.setRGB(1, .9, .78); renderer.toneMappingExposure = .98; bloom.strength = .2; bloom.threshold = .86; show(MACH, KX, 0, -6, 0, 1); MACH.userData.core.scale.setScalar(1 + Math.sin(L.T * 3) * .06); MACH.userData.coil.rotation.z = L.T * .6;
  if (o.radio !== false) { show(RADIO, KX - 9.6, 4.45, -12.2, .25, .8); }
  const off = o.off ?? 0; KE.BULBS.forEach(b => { b.l.intensity = 70 * (1 - off); b.bl.material.emissiveIntensity = .2 + 2 * (1 - off); }); hemi.intensity = .75 * (1 - off * .8); FILL.intensity = 28 * (1 - off * .85); }
function cuartoS(L, o = {}) { use('CU'); MODE = 'in'; BIRDSON = 0; renderer.toneMappingExposure = 1.0; hemi.intensity = .6; hemi.color.setRGB(.6, .68, 1); hemi.groundColor.setRGB(.3, .28, .4); sun.intensity = 0; rim.intensity = 1.0; rim.color.setRGB(.6, .7, 1); bloom.strength = .25; bloom.threshold = .84; scene.fog.density = .0002; FILL.intensity = 22; FILL.color.setRGB(.8, .85, 1);
  show(RADIO, ZX - 13.4, 4.2, -10, .5, .85); }
// ---------- el Dampfsammler ----------
// de pie en (x, z) mirando a ry; o.reach: brazo derecho extendido hacia delante (0..1); o.tip: se quita/toca la chistera
function samAt(L, x, z, ry, o = {}) { put(sam, x, 0, z, ry); const rc = o.reach ?? 0;
  const sw = Math.sin(L.T * 1.7) * .08; actuar(sam, 0, [[0, { aRx: lerp(.55 + sw, 1.45, rc), aRz: lerp(.55, .2, rc), aRe: lerp(.8, .2, rc), aLx: .5 - sw, aLz: .58, aLe: .85, lean: .5 + .1 * rc, headX: -.55 + (o.headX ?? 0), headY: o.headY ?? 0, lLx: .25, lRx: .1, lLk: .5, lRk: .35, hipY: 2.9, crouch: .2, ...(o.grab ? { aLx: 1.35, aLz: -.05, aLe: .25, aRx: 1.35, aRz: -.05, aRe: .25, lean: .7 } : {}), ...(o.pose || {}) }]], { T: L.T });
  cara(sam, L.T, { expr: o.expr || 'smug', mouth: o.mouth || 'smirk', eyes: o.eyes || 'half' }); sam.setEyes(o.glow ?? 1); sam.setAura(L.T, o.aura ?? 1); FACES.push(sam); return sam; }
// aparece: se materializa dentro de una nube densa (escala .35 → 1) con chispas cian
function appear(L, t0, c, dur = .45) { const k = easeOut(clamp((L.T - t0) / dur)); sam.root.scale.setScalar(1.6 * lerp(.35, 1, k)); sam.root.visible = L.T >= t0 - .02;
  SMK.puff(V(c.x, 1.5, c.z), V(0, 1, 0), L.T, t0 - .1, .5, { n: 60, pow: 2.4, size: 2.4, dens: .75, up: .3, spread: 1.2, life: 2.6, seed: 77 }); sparks(V(c.x, 2, c.z), t0, L.T, 26, .8); return k; }
// se lleva a alguien: los dos se encogen en un remolino de vapor y chispas y desaparecen (desde t0, en dur s)
function takeAway(L, chs, t0, c, dur = .8) { const k = clamp((L.T - t0 - .25) / dur), e = easeIn(k);
  shadowBurst(L, c, t0 - .1, dur + .3, 2.8, 9);
  chs.forEach(ch => { const s0 = ch.spec.scale || 1; if (ch !== sam) { const lift = easeOut(clamp((L.T - t0) / .3)) * .8; ch.root.position.y += lift; ch.root.position.x += (c.x - ch.root.position.x) * e; ch.root.position.z += (c.z - ch.root.position.z) * e; }
    ch.root.scale.setScalar(s0 * (1 - e)); ch.root.rotation.y += e * 5; if (k >= 1) ch.root.visible = false; ch.blob.visible = k < .5; });
  if (L.T >= t0) swirl(V(c.x, 0, c.z), t0, L.T, 2.8, 40); return k; }
// aros de vapor perfectos que salen de la boca y suben agrandándose
function smokeRings(ch, T0, T, n = 5, gap = .22) { const m = mouthW(ch), d = smokeDir(ch, .45); RINGS.forEach((r, i) => { if (i >= n) return; const t = T - T0 - i * gap; if (t < 0 || t > 2.4) return; r.visible = true; const dist = 1.2 + t * 2.6;
  r.position.copy(m).addScaledVector(d, dist).add(V(0, t * .8, 0)); r.lookAt(r.position.clone().add(d)); r.scale.setScalar(.35 + t * .55); r.material.opacity = .8 * (1 - t / 2.4); }); }
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
const KEY = /^(Stadt|Dampfen|verboten|Vape|Pfffffff|Dampfsammler|Mann|Niemand|sechs|Jahren|DJ|Konzert|Licht|weg|Dampfring-Meister|Rekord|verschwunden|Gamer|Turnier|zack|leer|Warnschilder|Club|Wolke|seltsam|unschlagbar|aussuchen|ehrlich|Vater|vier|geholt|Erfinder|Keller|Maschine|Papa|Radio|stumm|Nacht|Stimme|Sohn|zufällig|sammelt|Signal|Bruder|beben|Augen|Zylinder|hier|Familie)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–?!]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t), huss: false }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0;
// ---------- a: gancho, el DJ, el Dampfring-Meister (0 – 31,09 s) ----------
const G1 = EX[7], GP = V(-10, 0, 14);            // el chico que vapea a escondidas en la plaza (mira a +z)
const STY = CL.SY, DJP = V(CX, STY, -21.9);         // el DJ en el escenario del club (mira a +z)
const RKP = V(RSP.x, RS.H + .2, RSP.z + 1);      // Rocco en la tarima (mira a +z)
const clubCrowd = (L, o = {}) => crowdGrid(L, CX, -12, 7, 4, 3.8, 3.8, { face: V(CX, 6, -21), mode: 'dance', jit: .25, seed: 5, ...o });
const ringCrowd = (L, o = {}) => crowdGrid(L, RSP.x, RSP.z + 14, 6, 3, 4, 3.6, { face: V(RSP.x, 6, RSP.z), mode: 'cheer', jit: .2, seed: 9, ...o });
const djPlay = (L, o = {}) => { put(dj, DJP.x, DJP.y, DJP.z, 0); const s = Math.sin(L.T * 10); actuar(dj, 0, [[0, { aLx: 1.25 + s * .12, aRx: 1.3 - s * .12, aLz: -.15, aRz: -.15, aLe: .9, aRe: .9, headX: .12 + Math.abs(s) * .12, crouch: Math.abs(s) * .08, ...(o.pose || {}) }]], { T: L.T }); if (!o.face) grin(dj, L.T); return dj; };

// 1 «In dieser Stadt ist» (zoom lento): grúa que baja sobre Hufenbach: carteles DAMPFEN VERBOTEN por todas partes, la gente paseando
shot(0, 'C', 'slow', L => { town(L); crowdAt(L, -8, 6, 14, 6, 22, 1, { mode: 'walk', speed: 2, full: true, gap: .4 });
  cm([-4, 46, 78, -10, 4, 2, 48], [-8, 16, 40, -12, 6, 6, 46], L.k, easeOut); sh(V(-10, 0, 4), 40); }, [[0, 'city_amb', .5], [.2, 'birds', .4]]);
// 2 «Dampfen streng verboten.»: el cartel en primer plano; una madre se lo señala a su hijo
shot(1.10, 'W', 'punch', L => { town(L); const m = put(EX[3], -11.6, 0, 11.2, -.55), k = put(EX[8], -9.4, 0, 12.0, -.75); m.root.scale.setScalar(.95); k.root.scale.setScalar(.7);
  actuar(m, 0, [[0, { aLx: 2.1, aLz: -.3, aLe: .1, aRx: .4, aRz: .3, aRe: 1.2, headY: -.3 }]], { T: L.T }); cara(m, L.T, { expr: 'serious', mouth: 'talk' }); actuar(k, 0, [[0, { headX: -.35, headY: -.3, aLx: .3 }]], { T: L.T }); cara(k, L.T, { expr: 'worried', eyes: 'up' });
  cm([-9.6, 5.6, 30], [-10.4, 6.0, 27], L.k); camera.lookAt(-12.2, 5.6, 9.5); camera.fov = 44; sh(V(-12, 0, 10), 18); }, [[0, 'metal_hit', .35], [.4, 'hmm', .3]]);
// 3 «Denn jedes Mal, wenn jemand an einer»: un chico mira a los lados, a escondidas, y saca su vape
shot(2.71, 'S', null, L => { town(L); const c = put(G1, GP.x, 0, GP.z, .15); const look = Math.sin(L.lt * 5) * .6;
  vaper(c, L, 3.99, 1.0, { expr: 'sus', headX: 0 }); c.neck.rotation.y += look; crowdAt(L, GP.x, GP.z - 4, 6, 10, 20, 3, { mode: 'walk', speed: 1.6 });
  onBody(c, 12, -.3, .06, 42, L.k, 10.5, -.15); sh(GP, 18); }, [[0, 'steps', .35], [.6, 'cloth', .4]]);
// 4 «Vape zieht und ausatmet,»: primer plano: la calada, el LED se enciende
shot(4.09, 'Z', null, L => { town(L); const c = put(G1, GP.x, 0, GP.z, .15); vaper(c, L, 3.99, 1.0, { expr: 'smug', exh: 1.8, pow: 6, size: 1.6, n: 70 });
  onFace(c, 4.4, .1, .5, 40, L.k, 3.8); sh(GP, 14); }, [[.15, 'vape_in', .7]]);
// 5 «Pfffffff! erscheint ein»: la nube enorme sale de su boca y envuelve la plaza; la gente se gira
shot(5.45, 'C', 'punch', L => { town(L); const c = put(G1, GP.x, 0, GP.z, .15); vaper(c, L, 3.99, 1.0, { expr: 'smug', exh: 1.8, pow: 8, size: 2.4, n: 110, dens: 1, life: 3.5 });
  crowdAt(L, GP.x, GP.z, 7, 7, 13, 5, { mode: 'shock', face: V(GP.x, 3, GP.z) });
  orbit(V(GP.x, 5, GP.z), lerp(17, 19, L.k), .35, .1, 46); sh(GP, 22); }, [[.05, 'vape_out', .8], [.5, 'gasp', .35]]);
// 6 «mysteriöser Mann, der» (zoom lento): en la nube se forma una silueta: ojos cian, chistera, garras; el chico se queda helado
shot(6.63, 'I', 'slow', L => { town(L); const c = put(G1, GP.x, 0, GP.z, .15); actuar(c, 0, [[0, { ...GEST.shock, headY: -.4 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'side_l', mouth: 'grimace' }); sweat(c, L.T);
  SMK.haze(V(GP.x - 1, 4, GP.z - 4), L.T, 26, 5, 3, 3, 4.5, .55, 21); const s = samAt(L, GP.x - 1.6, GP.z - 4.2, .3, { reach: .2 }); appear(L, 6.66, V(GP.x - 1.6, 0, GP.z - 4.2), .9);
  orbit(V(GP.x - .8, 6, GP.z - 2), lerp(22, 15, easeIn(L.k)), .3, .06, 46); sh(GP, 18); }, [[0, 'whisper', .4], [.3, 'creepy_ting', .5]]);
// 7 «Dampfsammler, und nimmt»: primer plano de la criatura: los ojos se encienden; cartel con su nombre
shot(7.90, 'C', 'punch', L => { town(L); SMK.haze(V(GP.x - 1.6, 5, GP.z - 4.2), L.T, 18, 4, 3, 3, 4, .45, 22); const s = samAt(L, GP.x - 1.6, GP.z - 4.2, .3, { reach: clamp((L.T - 8.9) / .3), glow: 1 });
  const h = hp(s); cam([h.x + Math.sin(.3) * 12, h.y - .6, h.z + Math.cos(.3) * 12], [h.x, h.y - 2.4, h.z], 44); badge('gold', 'DER DAMPFSAMMLER', W / 2, H * .15, clamp((L.lt - .05) / .15), 1, .8); sh(GP, 14); }, [[0, 'magic_hit', .6], [.1, 'growl', .35]]);
// 8 «ihn mit. Niemand weiß,»: la garra sobre su hombro y los dos desaparecen en un remolino de vapor; la gente lo ve
shot(9.22, 'F', null, L => { town(L); const c = put(G1, GP.x, 0, GP.z, .15); actuar(c, 0, [[0, GEST.cower]], { T: L.T }); cara(c, L.T, { expr: 'scared', mouth: 'scream' });
  samAt(L, GP.x - .9, GP.z - 2.6, .3, { reach: 1, grab: true }); takeAway(L, [c, sam], 9.3, V(GP.x - .5, 0, GP.z - 1.3), .8);
  crowdAt(L, GP.x, GP.z - 2, 6, 8, 13, 7, { mode: 'point', face: V(GP.x, 3, GP.z) });
  orbit(V(GP.x - .5, 5.5, GP.z - 1), 21, .55, .1, 46); sh(GP, 22); }, [[.2, 'whirl', .55], [.45, 'gasp', .45], [.7, 'sparkle', .4]]);
// 9 «wohin sie verschwinden.»: plano bajo: solo queda la vape en el adoquín, echando un hilo de vapor; la gente se asoma
shot(10.77, 'R', null, L => { town(L); show(DROPV, GP.x - .4, .25, GP.z - 1, .4, 1.6); DROPV.rotation.set(Math.PI / 2, 0, .5); DROPV.userData.setGlow(.4 + Math.sin(L.T * 6) * .3);
  SMK.puff(V(GP.x - .4, .6, GP.z - 1), V(0, 1, 0), L.T, L.t0 - 1, 3, { n: 30, pow: .8, size: .5, dens: .5, up: .9, spread: .2, life: 2.5, seed: 31 });
  crowdAt(L, GP.x - .4, GP.z - 2, 5, 4.5, 6, 9, { mode: 'idle', expr: 'worried', face: V(GP.x - .4, 0, GP.z - 1) });
  cm([GP.x + 1.2, 8.5, GP.z + 9.5], [GP.x + .6, 7.8, GP.z + 8.2], L.k); camera.lookAt(GP.x - .4, 1.6, GP.z - 2.2); camera.fov = 46; sh(GP, 14); }, [[0, 'wind', .45], [.3, 'steam', .3]]);
// 10 «Vor sechs Jahren spielte»: el club NACHTWERK lleno, el DJ al fondo; «VOR 6 JAHREN»
shot(12.00, 'C', null, L => { clubS(L); djPlay(L); clubCrowd(L);
  cm([CX + 6, 15, 18], [CX + 3, 13, 14], L.k); camera.lookAt(CX, 6, -14); camera.fov = 50; badge('gold', 'VOR 6 JAHREN', W / 2, H * .14, clamp(L.lt / .15), 1, .9); sh(V(CX, 0, -6), 34); }, [[0, 'bass_hit', .5], [.1, 'cheer', .4]]);
// 11 «unser bester DJ das»: DJ Blitz con las manos arriba
shot(13.20, 'W', null, L => { clubS(L); const d = put(dj, DJP.x, DJP.y, DJP.z, 0); actuar(d, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .35, aRz: .35, aLe: .3, aRe: .3, headX: -.15 + Math.sin(L.T * 10) * .08 }]], { T: L.T }); cara(d, L.T, { expr: 'joy', mouth: 'laugh' });
  orbit(V(DJP.x, DJP.y + 5.2, DJP.z), lerp(15, 13, L.k), .15, .08, 42); sh(DJP, 16); }, [[0, 'cheer', .5], [.3, 'whistle', .35]]);
// 12 «größte Konzert seines»: grúa por encima de la pista: cientos saltando, luces barriendo
shot(14.34, 'Z', null, L => { clubS(L); djPlay(L); clubCrowd(L, { mode: 'cheer' });
  cm([CX - 12, 22, 14], [CX - 6, 20, 10], L.k); camera.lookAt(CX, 2, -10); camera.fov = 52; sh(V(CX, 0, -8), 34); }, [[0, 'shout_crowd', .45], [.4, 'bass_hit', .4]]);
// 13 «Lebens. Mitten im Beat»: primer plano de las manos en los platos; los altavoces vibran
shot(15.44, 'F', null, L => { clubS(L); djPlay(L, { pose: { aRx: 1.0, aRz: -.1, aRe: 1.2 } });
  const h = hp(dj); cm([DJP.x + 3.2, DJP.y + 6.4, DJP.z + 6.8], [DJP.x + 2.6, DJP.y + 6.0, DJP.z + 6.0], L.k); camera.lookAt(DJP.x, DJP.y + 3.8, DJP.z + 1.2); camera.fov = 44; sh(DJP, 14); }, [[0, 'record_scratch', .55], [.6, 'bass_hit', .4]]);
// 14 «zog er an seiner Vape und atmete»: saca la vape del bolsillo y da una calada larga
shot(16.75, 'S', null, L => { clubS(L); const d = put(dj, DJP.x, DJP.y, DJP.z, 0); vaper(d, L, 17.32, 1.0, { expr: 'smug', exh: 1.6, pow: 8, size: 2.2, n: 90 });
  onFace(d, 5.2, .2, .6, 40, L.k, 4.4); sh(DJP, 14); }, [[.4, 'cloth', .35], [.6, 'vape_in', .7]]);
// 15 «aus: Pfffffff!»: desde la pista: una nube gigante sale del escenario y tapa las luces
shot(18.38, 'C', 'punch', L => { clubS(L); const d = put(dj, DJP.x, DJP.y, DJP.z, 0); vaper(d, L, 17.32, 1.0, { expr: 'smug', exh: 1.6, pow: 11, size: 3.2, n: 120, dens: 1, life: 3.6, dirUp: .3 }); clubCrowd(L, { mode: 'shock' });
  cm([CX + 4, 13, 2], [CX + 3, 13, 0], L.k); camera.lookAt(CX, 8, -18); camera.fov = 48; sh(DJP, 30); }, [[.05, 'vape_out', .8], [.3, 'murmur', .4]]);
// 16 «Das Licht ging aus. Und als»: apagón: solo la nube iluminada por dos ojos cian y el aura detrás del DJ
shot(19.48, 'I', 'slow', L => { const off = clamp((L.T - 19.62) / .15); clubS(L, { off }); const d = put(dj, DJP.x, DJP.y, DJP.z, 0); actuar(d, 0, [[0, { ...GEST.shock, headY: .5 }]], { T: L.T }); cara(d, L.T, { expr: 'shock', eyes: 'side_l', mouth: 'o' });
  SMK.haze(V(DJP.x, DJP.y + 6, DJP.z - 2), L.T, 22, 6, 3, 2, 5, .5, 41); if (L.T > 19.9) { samAt(L, DJP.x - .4, DJP.z - 3.0, 0, { reach: 1, grab: L.T > 20.3, aura: 1 }); sam.root.position.y = DJP.y; }
  if (L.T > 20.2) takeAway(L, [d, sam], 20.25, V(DJP.x, DJP.y, DJP.z - 1.3), .6);
  cm([DJP.x + 1, DJP.y + 6.5, DJP.z + 17], [DJP.x + .6, DJP.y + 6.5, DJP.z + 13], easeIn(L.k)); camera.lookAt(DJP.x, DJP.y + 5.8, DJP.z - 1); camera.fov = 46; sh(DJP, 16); }, [[.14, 'power_down', .7], [.5, 'heartbeat', .5], [1.1, 'whirl', .45]]);
// 17 «es wieder anging, war er weg.»: vuelve la luz: la mesa vacía, los cascos balanceándose, la gente desconcertada
shot(20.92, 'F', null, L => { clubS(L); clubCrowd(L, { mode: 'shrug' }); show(DROPV, DJP.x + 1.4, DJP.y + 3.15, DJP.z + 1.6, .8, 1.1); DROPV.rotation.set(Math.PI / 2, 0, .8); DROPV.userData.setGlow(.3);
  SMK.haze(V(DJP.x, DJP.y + 6, DJP.z), L.T, 10, 6, 2, 2, 4, .25, 43);
  cm([DJP.x - 4, DJP.y + 7, DJP.z + 12], [DJP.x - 2.5, DJP.y + 6.6, DJP.z + 10], L.k); camera.lookAt(DJP.x, DJP.y + 3.6, DJP.z); camera.fov = 44; sh(DJP, 24); }, [[0, 'power_on', .6], [.4, 'murmur', .45], [.9, 'record_scratch', .3]]);
// 18 «Dann wollte unser Dampfring-Meister»: Rocco en la tarima de la plaza saluda al público
shot(22.67, 'W', null, L => { town(L); const r = put(rocco, RKP.x, RKP.y, RKP.z, 0); actuar(r, 0, [[0, { aRx: 2.6, aRz: .5 + Math.sin(L.T * 7) * .25, aRe: .4, aLx: .6, aLz: .2, aLe: .9, lean: -.04 }]], { T: L.T }); grin(r, L.T); ringCrowd(L);
  cm([RSP.x + 8, 9, RSP.z + 30], [RSP.x + 6, 8, RSP.z + 26], L.k); camera.lookAt(RSP.x, 7, RSP.z); camera.fov = 46; sh(RSP, 30); }, [[0, 'cheer', .5], [.3, 'clap', .45]]);
// 19 «einen neuen Rekord aufstellen.»: el marcador «NEUER REKORD?» y Rocco que lo señala, seguro de sí
shot(24.05, 'S', null, L => { town(L); RS.drawScore('?', 'NEUER REKORD'); const r = put(rocco, RKP.x, RKP.y, RKP.z, .5); actuar(r, 0, [[0, { aRx: 1.9, aRz: -.1, aRe: .1, aLx: .3, aLz: .5, aLe: 1.8, headY: .3 }]], { T: L.T }); cara(r, L.T, { expr: 'smug', mouth: 'smirk' });
  cm([RSP.x - 4, 9, RSP.z + 24], [RSP.x - 3, 9, RSP.z + 21], L.k); camera.lookAt(RSP.x + 3, 7, RSP.z - 1); camera.fov = 46; sh(RSP, 20); }, [[0, 'beep', .4], [.3, 'drum_roll', .45]]);
// 20 «Er zog, so tief er konnte,»: calada larguísima; el pecho se hincha, la cara roja del esfuerzo
shot(25.70, 'Z', null, L => { town(L); const r = put(rocco, RKP.x, RKP.y, RKP.z, 0); vaper(r, L, 26.42, 1.3, { expr: 'determined', exh: 1.8 }); r.spine.scale.setScalar(1 + clamp((L.T - 26.7) / 1.2) * .08);
  onFace(r, 5, .2, -.5, 40, L.k, 4.2); sh(RSP, 14); }, [[.6, 'vape_in', .75], [1.1, 'breath', .35]]);
// 21 «und blies: Pfffffff!»: aros de vapor perfectos que suben; el público boquiabierto; el marcador sube
shot(27.26, 'R', null, L => { town(L); RS.drawScore(String(Math.max(0, Math.floor((L.T - 28.25) * 6))), 'RINGE'); const r = put(rocco, RKP.x, RKP.y, RKP.z, 0); vaper(r, L, 26.42, 1.3, { expr: 'determined', exh: 1.8, n: 10, dens: .4 }); smokeRings(r, 28.25, L.T, 8, .2);
  ringCrowd(L, { mode: L.T > 28.4 ? 'cheer' : 'shock' });
  cm([RSP.x + 7, 7.5, RSP.z + 19], [RSP.x + 6, 8, RSP.z + 17], L.k); camera.lookAt(RSP.x, 10, RSP.z); camera.fov = 48; sh(RSP, 22); }, [[.95, 'vape_out', .7], [1.2, 'cheer', .4]]);
// 22 «Und plötzlich war»: entre los aros aparece la criatura detrás de Rocco y lo agarra
shot(28.82, 'C', 'punch', L => { town(L); const r = put(rocco, RKP.x, RKP.y, RKP.z, 0); actuar(r, 0, [[0, GEST.shock]], { T: L.T }); cara(r, L.T, { expr: 'shock', mouth: 'scream' });
  samAt(L, RKP.x - .5, RKP.z - 2.8, 0, { reach: 1, grab: L.T > 29.05 }); sam.root.position.y = RKP.y; appear(L, 28.84, V(RKP.x - .5, RKP.y, RKP.z - 2.8), .3); takeAway(L, [r, sam], 29.1, V(RKP.x, RKP.y, RKP.z - 1.3), .55);
  orbit(V(RKP.x, RKP.y + 5.5, RKP.z - 1), 19, -.25, .04, 46); sh(RSP, 18); }, [[0, 'magic_hit', .55], [.55, 'whirl', .5]]);
// 23 «er verschwunden. Sogar»: la tarima vacía, los últimos aros flotando; el público se queda de piedra
shot(29.85, 'W', null, L => { town(L); RS.drawScore('?', 'NEUER REKORD'); RINGS.forEach((rg, i) => { rg.visible = true; rg.position.set(RKP.x + Math.sin(i * 2) * 3, RKP.y + 7 + i * 1.1 + L.lt * .6, RKP.z + Math.cos(i * 3)); rg.rotation.set(Math.PI / 2 + Math.sin(i) * .3, 0, 0); rg.scale.setScalar(1.4 + i * .15); rg.material.opacity = .5; });
  ringCrowd(L, { mode: 'shock' }); cm([RSP.x - 6, 13, RSP.z + 30], [RSP.x - 4, 13, RSP.z + 27], L.k); camera.lookAt(RSP.x, 6, RSP.z); camera.fov = 46; sh(RSP, 28); }, [[0, 'wind', .45], [.3, 'murmur', .45]]);
// ---------- b: el gamer, la prohibición, el club sin nubes, «los elige» (31,09 – 56,19 s) ----------
const KDP = V(AX, 0, 7.2);                        // silla de Kai (mira a -z, hacia su pantalla)
const kaiSit = (L, o = {}) => { show(DESK, AX, 0, 4, 0); show(CHAIR, KDP.x, 0, KDP.z, PI + (o.spin || 0)); const k = put(kai, KDP.x, sitY(kai, 2.35), KDP.z, PI + (o.spin || 0));
  const s = Math.sin(L.T * 18); actuar(k, 0, [[0, seatPose({ aLx: 1.15, aRx: 1.15, aLz: -.25, aRz: -.25, aLe: 1.05 + s * .05, aRe: 1.05 - s * .05, lean: .12, headX: .08, ...(o.pose || {}) })]], { T: L.T }); return k; };
const arenaCrowd = (L, o = {}) => crowdGrid(L, AX, 18, 6, 2, 4.2, 4, { face: V(AX, 4, 4), mode: 'cheer', jit: .2, seed: 13, from: 8, ...o });
const LIT = V(32, 0, 2);                         // la Litfaßsäule (en la plaza)

// 24 «unser bester Gamer verschwand»: la sala del torneo: Kai en la mesa del centro, la gran pantalla FINALE, el público
shot(31.09, 'S', null, L => { arena(L); kaiSit(L); cara(kai, L.T, { expr: 'determined' }); arenaCrowd(L);
  cm([AX - 15, 11, -4], [AX - 13, 10, -2], L.k); camera.lookAt(AX, 4.5, 6.5); camera.fov = 50; sh(V(AX, 0, 6), 30); }, [[0, 'cheer', .45], [.3, 'keys', .4]]);
// 25 «mitten in einem Turnier.»: de lado: dedos a toda velocidad en el teclado, la pantalla con la partida
shot(32.53, 'C', null, L => { arena(L); kaiSit(L); cara(kai, L.T, { expr: 'determined', mouth: 'flat' });
  cm([AX - 7.5, 6.4, 3.2], [AX - 6.8, 6.2, 4.0], L.k); camera.lookAt(AX, 4.6, 6.4); camera.fov = 44; sh(V(AX, 0, 6), 16); }, [[0, 'keys', .55], [.6, 'click_set', .4]]);
// 26 «Er war komplett konzentriert»: primer plano: Kai sin parpadear, la luz de la pantalla en la cara
shot(33.88, 'Z', null, L => { arena(L); kaiSit(L, { pose: { headX: .02 } }); cara(kai, L.T, { expr: 'determined', eyes: 'squint', mouth: 'flat', noBlink: true });
  const h = hp(kai); cm([h.x - 3.6, h.y + .6, h.z - 3.2], [h.x - 3.0, h.y + .5, h.z - 2.7], L.k); camera.lookAt(h.x, h.y + .2, h.z); camera.fov = 40; sh(KDP, 12); }, [[0, 'heartbeat', .4], [.5, 'keys', .4]]);
// 27 «und zog heimlich an seiner»: mira a los lados y se lleva la vape a la boca a escondidas
shot(35.34, 'W', null, L => { arena(L); const k = kaiSit(L); vaper(k, L, 35.92, .7, { expr: 'sus', pose: seatPose({ aLx: 1.15, aLz: -.25, aLe: 1.05, lean: .12 }), exh: 1.5, pow: 6, size: 1.8, n: 70 }); k.neck.rotation.y += Math.sin(L.lt * 6) * .35;
  cm([AX - 6.8, 6.6, 2.4], [AX - 6.0, 6.4, 3.0], L.k); camera.lookAt(AX, 5.0, 7); camera.fov = 42; sh(KDP, 14); }, [[.2, 'cloth', .35], [.6, 'vape_in', .7]]);
// 28 «Vape: Pfffffff!»: la nube sale por encima de la mesa y tapa la pantalla
shot(36.67, 'C', 'punch', L => { arena(L); const k = kaiSit(L); vaper(k, L, 35.92, .7, { expr: 'smug', pose: seatPose({ aLx: 1.15, aLz: -.25, aLe: 1.05, lean: .12 }), exh: 1.5, pow: 7, size: 2.2, n: 90, dens: .95 }); arenaCrowd(L, { mode: 'idle', expr: 'neutral' });
  cm([AX - 11, 9, 0], [AX - 10, 9.5, 1], L.k); camera.lookAt(AX, 5.6, 6.5); camera.fov = 46; sh(KDP, 22); }, [[.45, 'vape_out', .8]]);
// 29 «Und zack! Sein»: la garra sale de la nube: Kai y la criatura desaparecen en un remolino
shot(37.78, 'F', null, L => { arena(L); const k = kaiSit(L); actuar(k, 0, [[0, seatPose({ ...GEST.shock })]], { T: L.T }); cara(k, L.T, { expr: 'shock', mouth: 'scream' });
  SMK.haze(V(AX, 6, 5), L.T, 18, 4, 3, 3, 4, .5, 51); samAt(L, AX - 2.2, KDP.z + 2.8, PI + .6, { reach: 1, grab: true }); appear(L, 37.78, V(AX - 2.2, 0, KDP.z + 2.8), .2); takeAway(L, [k, sam], 37.95, V(AX - 1, 0, KDP.z + 1), .65);
  cm([AX - 12, 8, 2], [AX - 11.5, 8.2, 2.6], L.k); camera.lookAt(AX - 1, 5.4, KDP.z + 1.2); camera.fov = 46; sh(KDP, 20); }, [[0, 'impact', .6], [.2, 'whirl', .5], [.5, 'sparkle', .4]]);
// 30 «Gaming-Stuhl war leer.»: la silla vacía sigue girando; los cascos caen al suelo; el público se levanta
shot(39.00, 'R', null, L => { arena(L); show(DESK, AX, 0, 4, 0); show(CHAIR, KDP.x, 0, KDP.z, PI + L.lt * 2.4); arenaCrowd(L, { mode: 'shock' });
  SMK.haze(V(AX, 5, 7), L.T, 8, 4, 2, 2, 4, .22, 53);
  cm([AX + 7, 8, 14], [AX + 6, 7.6, 12.5], L.k); camera.lookAt(AX, 3.4, KDP.z); camera.fov = 44; sh(KDP, 22); }, [[0, 'chair_roll', .6], [.5, 'murmur', .45]]);
// 31 «Deshalb ist Dampfen seitdem»: un operario atornilla un cartel nuevo «DAMPFEN VERBOTEN» en la plaza
shot(40.17, 'S', null, L => { town(L); const w = put(EX[11], 12.4, 0, -5.6, .25); actuar(w, 0, [[0, { aRx: 2.0 + Math.sin(L.T * 14) * .15, aRz: -.2, aRe: .6, aLx: 1.8, aLz: -.3, aLe: .7, headX: -.25 }]], { T: L.T }); cara(w, L.T, { expr: 'determined', mouth: 'flat' });
  crowdAt(L, 10, -6, 5, 7, 13, 17, { mode: 'look', expr: 'worried', face: V(10, 6, -6) });
  cm([17, 6, 6], [16, 6.2, 5], L.k); camera.lookAt(11.5, 5.4, -6); camera.fov = 44; sh(V(10, 0, -4), 18); }, [[0, 'ratchet', .55], [.6, 'hammer', .45]]);
// 32 «verboten. Überall hängen»: travelling por la calle: cartel tras cartel en farolas y fachadas
shot(41.45, 'Z', null, L => { town(L); crowdAt(L, -10, 6, 8, 6, 18, 19, { mode: 'walk', speed: 1.6, full: true, gap: .3 });
  cm([30, 9, 34], [20, 9, 30], L.k); camera.lookAt(-14, 7, 4); camera.fov = 48; sh(V(0, 0, 10), 40); }, [[0, 'whoosh_soft', .35], [.3, 'steps', .35]]);
// 33 «Warnschilder. Im Club»: la columna de anuncios llena de carteles; dos vecinos la leen y se miran
shot(42.60, 'F', null, L => { town(L); show(LITF, LIT.x, 0, LIT.z, -.3); [EX[15], EX[16]].forEach((c, i) => { put(c, LIT.x + (i ? 3.4 : -3.4), 0, LIT.z + 5.4, i ? -2.7 : 2.7); actuar(c, 0, [[0, { headX: -.15, aLx: .2, aRx: i ? 1.4 : .2, aRe: i ? 1.6 : 0 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' }); });
  cm([LIT.x - 2, 7.5, LIT.z + 25], [LIT.x - 1.6, 7.6, LIT.z + 23], L.k); camera.lookAt(LIT.x, 6.4, LIT.z + 2); camera.fov = 46; sh(LIT, 18); }, [[0, 'paper', .5], [.5, 'hmm', .35]]);
// 34 «feiern alle ohne eine einzige»: el club lleno, todos bailando y ni una nube; carteles DAMPFEN VERBOTEN en las paredes
shot(43.87, 'W', null, L => { clubS(L, { clean: true }); djPlay(L); clubCrowd(L, { mode: 'dance' });
  cm([CX + 22, 11, 14], [CX + 18, 10.5, 12], L.k); camera.lookAt(CX - 4, 6, -12); camera.fov = 50; sh(V(CX, 0, -6), 34); }, [[0, 'bass_hit', .45], [.4, 'cheer', .35]]);
// 35 «Wolke. Aber etwas»: un chico saca la vape en la pista; su amiga le baja la mano y señala el cartel
shot(45.20, 'S', null, L => { clubS(L, { clean: true }); const a = put(EX[12], CX + 4, 0, 6, -.4), b = put(EX[13], CX + 7, 0, 5.4, -1.3); VP.get(a).visible = true; VP.get(a).userData.grip.visible = true;
  const dn = clamp((L.lt - .35) / .3); actuar(a, 0, [[0, { ...armVape(lerp(.6, 0, dn)), headY: .4 }]], { T: L.T }); a.aR.sh.rotation.y = armVape(lerp(.6, 0, dn)).aRy; cara(a, L.T, { expr: dn > .5 ? 'worried' : 'smug', mouth: dn > .5 ? 'frown' : 'smirk' });
  actuar(b, 0, [[0, { aRx: lerp(.6, 1.1, dn), aRz: -.6, aRe: .4, aLx: lerp(.3, 2.2, clamp((L.lt - .6) / .25)), aLz: .4, headX: .05 }]], { T: L.T }); cara(b, L.T, { expr: 'angry', mouth: 'talk' });
  clubCrowd(L, { mode: 'dance', from: 14 });
  cm([CX + 8, 6.4, 18], [CX + 7.4, 6.2, 16.5], L.k); camera.lookAt(CX + 5.4, 4.2, 5.6); camera.fov = 42; sh(V(CX + 5, 0, 6), 16); }, [[.35, 'slap', .45], [.7, 'tsk', .4]]);
// 36 «war seltsam. Der DJ»: yo delante de la columna, mirando los tres carteles VERMISST, pensativo
shot(46.48, 'I', null, L => { town(L, { dusk: true }); show(LITF, LIT.x, 0, LIT.z, -.3); const m = put(ich, LIT.x - 4, 0, LIT.z + 9, -PI + .7); actuar(m, 0, [[0, { aRx: 1.6, aRz: -.1, aRe: 2.1, aLx: .9, aLz: .1, aLe: 1.5, headX: -.15, headY: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'think', eyes: 'up', mouth: 'wavy' });
  cm([LIT.x - 12, 7, LIT.z + 21], [LIT.x - 11, 6.8, LIT.z + 20], L.k); camera.lookAt(LIT.x - 3.6, 5.2, LIT.z + 8); camera.fov = 46; sh(LIT, 18); }, [[0, 'hmm', .45], [.4, 'creepy_ting', .35]]);
// 37 «war der beste der Stadt.»: recuerdo: DJ Blitz con su trofeo, lluvia de confeti en el club
shot(47.85, 'C', null, L => { clubS(L); const d = put(dj, DJP.x, DJP.y, DJP.z + 2.6, 0); attach(TROPHY, d.aR.hand, [0, -.5, .4], [0, 0, 0], .8); actuar(d, 0, [[0, { aRx: 2.9, aRz: .2, aRe: .1, aLx: 1.6, aLz: .5, aLe: .8 }]], { T: L.T }); grin(d, L.T); confRain(V(DJP.x, DJP.y, DJP.z + 2), L.T, 60, 14, 8, 14);
  orbit(V(DJP.x, DJP.y + 4.6, DJP.z + 2.6), 13, -.2, -.02, 42); badge('gold', 'BESTER DJ', W / 2, H * .15, clamp(L.lt / .15), 1, .9); grade.uniforms.sepia.value = .18; sh(DJP, 16); }, [[0, 'confetti', .5], [.2, 'cheer', .4]]);
// 38 «Der Dampfring-Meister hatte»: recuerdo: Rocco con medallas en la tarima, haciendo un aro perfecto
shot(49.22, 'W', null, L => { town(L); const r = put(rocco, RKP.x, RKP.y, RKP.z, 0); actuar(r, 0, [[0, { aLx: 2.6, aLz: .5, aLe: .4, aRx: .4, aRz: .2, aRe: 1.4 }]], { T: L.T }); grin(r, L.T); RINGS.forEach((rg, i) => { if (i > 2) return; rg.visible = true; rg.position.set(RKP.x + 1.6, RKP.y + 6.4 + i * 1.4 + L.lt, RKP.z + 1); rg.lookAt(camera.position); rg.scale.setScalar(.8 + i * .3); rg.material.opacity = .7; });
  confRain(V(RKP.x, RKP.y, RKP.z), L.T, 40, 12, 8, 14); badge('gold', 'MEISTER', W / 2, H * .15, clamp(L.lt / .15), 1, .9);
  orbit(V(RKP.x, RKP.y + 4.4, RKP.z), 12.5, .25, .0, 42); grade.uniforms.sepia.value = .18; sh(RSP, 16); }, [[0, 'pling', .5], [.4, 'clap', .45]]);
// 39 «jeden Rekord gebrochen.»: el marcador: REKORD tras REKORD, y explota de confeti
shot(50.36, 'Z', null, L => { town(L); RS.drawScore(String(Math.floor(lerp(60, 99, clamp(L.lt / 1)))), 'REKORD!'); confetti(V(RSP.x + 6, 6, RSP.z - 1), L.t0 + .4, L.T, 50, .8); const r = put(rocco, RKP.x, RKP.y, RKP.z, .5); actuar(r, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: .4, aRz: .4 }]], { T: L.T }); laughF(r, L.T);
  cm([RSP.x + 7, 9, RSP.z + 12], [RSP.x + 7.5, 9, RSP.z + 10.5], L.k); camera.lookAt(RSP.x + 11.8, 8.2, RSP.z - 2); camera.fov = 46; grade.uniforms.sepia.value = .18; sh(RSP, 20); }, [[0, 'beep', .45], [.4, 'party_horn', .45]]);
// 40 «Und der Gamer war unschlagbar.»: recuerdo: Kai levanta el trofeo; en la pantalla gigante «UNSCHLAGBAR»
shot(51.72, 'F', null, L => { arena(L); const k = put(kai, AX, 0, 4, 0); attach(TROPHY, k.aR.hand, [0, -.5, .4], [0, 0, 0], .8); actuar(k, 0, [[0, { aRx: 2.9, aRz: .2, aRe: .1, aLx: 2.6, aLz: .4, aLe: .4 }]], { T: L.T }); laughF(k, L.T); confRain(V(AX, 0, 4), L.T, 60, 14, 10, 14);
  orbit(V(AX, 4.2, 4), lerp(13, 11.5, L.k), .2, .02, 44); badge('gold', 'UNSCHLAGBAR', W / 2, H * .15, clamp(L.lt / .15), 1, .9); grade.uniforms.sepia.value = .18; sh(V(AX, 0, 4), 18); }, [[0, 'cheer', .5], [.3, 'confetti', .4]]);
// 41 «Fast so, als würde der» (zoom lento): de noche: la criatura delante de la columna, una garra sobre los tres carteles VERMISST
shot(53.50, 'S', 'slow', L => { town(L, { night: true }); show(LITF, LIT.x, 0, LIT.z, -.3); samAt(L, LIT.x - 2.6, LIT.z + 6.0, -.9, { reach: .7, headX: .2 });
  cm([LIT.x - 6, 7, LIT.z + 26], [LIT.x - 4.5, 7.4, LIT.z + 18], easeIn(L.k)); camera.lookAt(LIT.x - 1.4, 7.2, LIT.z + 3); camera.fov = 46; sh(LIT, 20); }, [[0, 'wind_howl', .4]]);
// 42 «Dampfsammler sie aussuchen.»: primer plano: los ojos se entornan y brillan más
shot(54.93, 'C', 'punch', L => { town(L, { night: true }); show(LITF, LIT.x, 0, LIT.z, -.3); const s = samAt(L, LIT.x - 2.4, LIT.z + 6.4, -.4, { reach: .2, glow: 1 + Math.sin(L.T * 9) * .25 });
  const h = hp(s), a = s.root.rotation.y; cam([h.x + Math.sin(a) * 9, h.y + .4, h.z + Math.cos(a) * 9], [h.x, h.y - .8, h.z], 42); sh(LIT, 14); }, [[0, 'magic_hit', .5], [.3, 'whisper', .4]]);
// ---------- c: la pregunta, papá, la noche del sótano, la radio (56,19 – 94,35 s) ----------
const BUS = V(30, 0, 30);                          // parada del bus (plaza sur-este)
const MP = V(KX, 0, -6);                           // la máquina
const BEDX = ZX - 8, BEDZ = -8;                    // donde me siento en la cama (mirando a +x)
const RAD = V(ZX - 13.4, 4.2, -10);                // la radio en la mesilla
const inBed = (L, pose = {}, face = {}) => { const m = put(ich, BEDX, sitY(ich, 3.45), BEDZ, PI / 2); actuar(m, 0, [[0, seatPose({ lLk: 0, lRk: 0, aLx: .5, aRx: .5, aLe: .6, aRe: .6, ...pose })]], { T: L.T }); cara(m, L.T, face); return m; };
const radioOn = (L, k) => { RADIO.userData.setGlow(k); RADIO.userData.needle.position.x = .95 + Math.sin(L.T * 3) * .25 * k; };
const papaWork = (L, o = {}) => { const p = put(papa, MP.x - 5.2, 0, MP.z + 4.4, .9); const s = Math.sin(L.T * 12); actuar(p, 0, [[0, { aRx: 1.5 + s * .25, aRz: -.1, aRe: .9, aLx: 1.2, aLz: -.2, aLe: 1.0, lean: .15, headX: .15, ...(o.pose || {}) }]], { T: L.T }); cara(p, L.T, { expr: o.expr || 'determined', mouth: 'flat' }); return p; };

// 43 «Und mal ehrlich: Kennst du auch»: yo, mirando a cámara con una ceja levantada (te lo pregunto a ti)
shot(56.19, 'W', null, L => { town(L); const m = put(ich, 6, 0, 30, 0); actuar(m, 0, [[0, { aRx: 1.3, aRz: -.25, aRe: 1.5, aLx: .2, headZ: .12, headX: -.05 }]], { T: L.T }); cara(m, L.T, { expr: 'sus', eyes: 'squint', mouth: 'smirk' });
  crowdAt(L, 6, 30, 5, 8, 16, 23, { mode: 'walk', speed: 1.5 }); onFace(m, 5, .1, 0, 40, L.k, 4.2); sh(V(6, 0, 30), 16); }, [[0, 'pop', .4], [.5, 'hmm', .35]]);
// 44 «jemanden, der keinen einzigen Tag»: en la parada del bus: un vecino que tiembla con la vape en el puño, sin atreverse
shot(57.75, 'Z', null, L => { town(L); const g = put(EX[18], BUS.x, 0, BUS.z, -.3); VP.get(g).visible = true; VP.get(g).userData.grip.visible = true; const sh_ = Math.sin(L.T * 38) * .05;
  actuar(g, 0, [[0, { ...armVape(.25 + sh_), headY: Math.sin(L.T * 4) * .5, lean: .06, crouch: .05 }]], { T: L.T }); g.aR.sh.rotation.y = armVape(.25).aRy; cara(g, L.T, { expr: 'worried', mouth: 'wavy' }); sweat(g, L.T, 3);
  crowdAt(L, BUS.x, BUS.z, 4, 5, 8, 25, { mode: 'idle', expr: 'sus', face: V(BUS.x, 4, BUS.z) });
  onBody(g, 12, .1, .08, 42, L.k, 10.5); sh(BUS, 16); }, [[0, 'shiver', .5], [.5, 'heartbeat', .4]]);
// 45 «ohne seine Vape aushält?»: primer plano: la mano tiembla, la frente sudando; el reloj de la parada; «?»
shot(59.11, 'F', null, L => { town(L); const g = put(EX[18], BUS.x, 0, BUS.z, -.3); VP.get(g).visible = true; VP.get(g).userData.grip.visible = true; const sh_ = Math.sin(L.T * 40) * .06;
  actuar(g, 0, [[0, { ...armVape(.55 + sh_), headX: .1, headY: Math.sin(L.T * 5) * .2 }]], { T: L.T }); g.aR.sh.rotation.y = armVape(.55).aRy; cara(g, L.T, { expr: 'worried', eyes: 'wide', mouth: 'grimace' }); sweat(g, L.T, 3);
  onFace(g, 4.4, -.2, .7, 40, L.k, 3.8); badge('q', '?', W * .78, H * .2, clamp((L.lt - .4) / .15), 1, 1); sh(BUS, 14); }, [[0, 'vibrate', .45], [.5, 'gulp', .45]]);
// 46 «Ich schon. Meinen»: en mi cuarto, sentado en la cama, asiento despacio con una foto en la mano
shot(60.84, 'S', null, L => { cuartoS(L); const m = inBed(L, { aLx: 1.2, aRx: 1.2, aLe: 1.4, aRe: 1.4, aLz: -.35, aRz: -.35, headX: .25 + Math.sin(L.T * 3) * .05 }, { expr: 'sad', eyes: 'down' });
  onFace(m, 5.5, .3, -.6, 40, L.k, 4.6); sh(V(BEDX, 0, BEDZ), 14); }, [[0, 'sigh_kid', .45]]);
// 47 «Vater. Denn vor vier»: recuerdo: papá en su taller, sonriendo, dando una calada a su vape negra
shot(62.00, 'C', null, L => { kellerS(L); const p = put(papa, MP.x - 7, 0, MP.z + 9, .3); vaper(p, L, 61.4, .6, { expr: 'happy', vape: OLDV, exh: 1.3, pow: 5, size: 1.6, n: 60 }); OLDV.visible = true; if (OLDV.parent !== p.aR.hand) { p.aR.hand.add(OLDV); } OLDV.position.set(0, -.25, .47); OLDV.rotation.set(1.54, 0, 0); OLDV.scale.setScalar(.95);
  onFace(p, 5.2, .2, .4, 40, L.k, 4.4); grade.uniforms.sepia.value = .25; sh(V(MP.x - 7, 0, MP.z + 9), 14); }, [[0, 'vape_in', .5], [.8, 'vape_out', .5]]);
// 48 «Jahren hat der Dampfsammler ihn» (zoom lento): la puerta del sótano entreabierta; en la oscuridad, dos ojos cian
shot(63.18, 'I', 'slow', L => { kellerS(L, { off: .8 }); samAt(L, KX + 17.5, -12.5, -PI / 2 - .4, { reach: .1 }); sam.root.position.y = 9.2;
  cm([KX - 2, 8, 12], [KX + 4, 9.5, 4], easeIn(L.k)); camera.lookAt(KX + 17, 13, -14); camera.fov = lerp(46, 36, easeIn(L.k)); badge('gold', 'VOR 4 JAHREN', W / 2, H * .14, clamp(L.lt / .15), 1, .9); sh(V(KX + 10, 0, -8), 24); }, [[0, 'door_creak', .5], [.4, 'heartbeat', .5]]);
// 49 «geholt. Mein Vater war der»: recuerdo de día: papá en la plaza presenta un invento (un dron de latón); la gente aplaude
shot(64.56, 'W', null, L => { town(L); const p = put(papa, -6, 0, 18, 0); actuar(p, 0, [[0, { aRx: 2.4, aRz: .3, aRe: .2, aLx: .6, aLz: .3, aLe: 1.2 }]], { T: L.T }); grin(p, L.T);
  show(MACH, -1.2, 0, 15, -.5, .42); MACH.userData.setPower(.9); crowdAt(L, -6, 18, 9, 7, 13, 27, { mode: 'clap', face: V(-6, 4, 18) });
  orbit(V(-5, 5.4, 18), lerp(18, 16, L.k), .1, .08, 46); grade.uniforms.sepia.value = .25; sh(V(-6, 0, 18), 20); }, [[0, 'clap', .5], [.3, 'machine_hum', .35]]);
// 50 «größte Erfinder der Stadt.»: papá con las gafas de soldador, rodeado de inventos, pulgar arriba
shot(65.89, 'Z', null, L => { kellerS(L); const p = put(papa, KX - 10, 0, -6.8, .35); actuar(p, 0, [[0, { aRx: 1.6, aRz: -.3, aRe: 1.5, aLx: .5, aLz: .3, aLe: 1.2, headZ: .1 }]], { T: L.T }); grin(p, L.T);
  onBody(p, 11, .1, .1, 42, L.k, 9.5); badge('gold', 'ERFINDER', W / 2, H * .15, clamp(L.lt / .15), 1, .9); grade.uniforms.sepia.value = .25; sh(V(KX - 10, 0, -7), 16); }, [[0, 'ding_soft', .5], [.4, 'gears', .4]]);
// 51 «Eines Nachts arbeitete er in»: de noche en el sótano: papá suelda la máquina, chispas
shot(67.55, 'F', null, L => { kellerS(L); const p = papaWork(L); sparks(V(MP.x - 3.2, 3.4, MP.z + 2.4), Math.floor(L.T * 3) / 3, L.T, 26, .5);
  cm([MP.x + 1, 6.4, MP.z + 15], [MP.x, 6.2, MP.z + 14], L.k); camera.lookAt(MP.x - 4.6, 4.6, MP.z + 4); camera.fov = 44; sh(MP, 18); }, [[0, 'weld', .55], [.6, 'sparks', .45]]);
// 52 «unserem Keller an einer geheimnisvollen» (zoom lento): la máquina enorme: la cúpula con vapor brillando, las bobinas girando
shot(69.01, 'S', 'slow', L => { kellerS(L); MACH.userData.setPower(.7 + Math.sin(L.T * 4) * .3); papaWork(L, { expr: 'smug' });
  cm([MP.x + 6, 4, MP.z + 18], [MP.x + 3, 6, MP.z + 12], easeIn(L.k)); camera.lookAt(MP.x, 8, MP.z); camera.fov = 48; sh(MP, 18); }, [[0, 'machine_hum', .55], [.6, 'zap', .35]]);
// 53 «Maschine. Plötzlich hörte ich:»: arriba, en mi cama: me despierto y me incorporo, escuchando
shot(70.81, 'R', null, L => { cuartoS(L); const up = clamp((L.T - 71.4) / .4); const m = inBed(L, { lean: lerp(-.6, 0, up), headY: up * .5, aLx: .3, aRx: .3 }, { expr: up > .3 ? 'shock' : 'neutral', eyes: up > .3 ? 'wide' : 'closed' });
  cm([BEDX + 8, 6.5, BEDZ + 7], [BEDX + 7, 6.2, BEDZ + 6], L.k); camera.lookAt(BEDX, 4.4, BEDZ); camera.fov = 44; sh(V(BEDX, 0, BEDZ), 14); }, [[0, 'snore', .3], [.6, 'gasp', .5]]);
// 54 «Pfffffff! Ich rannte»: en el sótano estalla una nube con luz cian; papá y la criatura giran en el remolino
shot(72.43, 'C', 'punch', L => { kellerS(L); const p = papaWork(L, { expr: 'shock' }); p.aR.hand.add(OLDV); OLDV.visible = true; OLDV.position.set(0, -.25, .47); OLDV.rotation.set(1.54, 0, 0); SMK.puff(mouthW(p), V(1, .4, .3), L.T, 72.4, .6, { n: 60, pow: 5, size: 1.8, dens: .9, seed: 64 }); SMK.haze(V(MP.x - 4, 4, MP.z + 4), L.T, 26, 5, 3, 4, 5, .55, 61); MACH.userData.setPower(1.6);
  samAt(L, MP.x - 7.4, MP.z + 1.9, .9, { reach: 1, grab: true }); takeAway(L, [p, sam], 72.45, V(MP.x - 6, 0, MP.z + 3.6), .55);
  cm([MP.x - 14, 7, MP.z + 16], [MP.x - 13, 7, MP.z + 15], L.k); camera.lookAt(MP.x - 5, 5, MP.z + 3); camera.fov = 46; sh(MP, 18); }, [[0, 'vape_out', .6], [.1, 'magic_hit', .5], [.35, 'whirl', .5]]);
// 55 «nach unten, aber Papa»: bajo corriendo la escalera del sótano
shot(73.40, 'W', null, L => { kellerS(L); const k = clamp(L.lt / 1.2), step = lerp(10, 4, k); const z = 6 - step * 1.3, y = .95 + step * .75;
  const m = put(ich, KX + 17.5, y + Math.abs(Math.sin(L.T * 16)) * .2, z, 0); actuar(m, 0, [[0, { ...walkP(L.T * 1.6, 0), aLx: .9, aRx: -.6 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'o' });
  cm([KX + 6, 11, z + 10], [KX + 6.5, 9, z + 9], L.k); camera.lookAt(KX + 17.5, y + 3.5, z); camera.fov = 44; sh(V(KX + 16, 0, z), 18); }, [[0, 'steps_run', .55], [.6, 'wood_creak', .35]]);
// 56 «war weg. Nur seine unfertige»: el sótano vacío: vapor flotando, la vape de papá en el suelo
shot(74.60, 'Z', null, L => { kellerS(L); MACH.userData.setPower(.3); SMK.haze(V(MP.x - 5, 3, MP.z + 4), L.T, 14, 6, 2, 4, 5, .25, 63); show(OLDV, MP.x - 6, .25, MP.z + 4, 0, 1.2); OLDV.rotation.set(Math.PI / 2, 0, .4);
  const m = put(ich, KX + 2, 0, 4, -2.94); actuar(m, 0, [[0, { ...GEST.shock, headY: -.3 }]], { T: L.T }); cara(m, L.T, { expr: 'sad', mouth: 'frown' });
  cm([KX + 9, 8, 17], [KX + 8, 7.8, 16], L.k); camera.lookAt(KX - 1, 3.5, 0); camera.fov = 48; sh(V(KX, 0, 0), 22); }, [[0, 'gasp', .45], [.5, 'wind', .35]]);
// 57 «Maschine und ein altes Radio waren»: la máquina sin terminar (cables colgando) y la radio vieja en el banco
shot(76.09, 'S', null, L => { kellerS(L); MACH.userData.setPower(.25); const m = put(ich, KX - 13.5, 0, -5, 2.64); actuar(m, 0, [[0, { aLx: 1.1, aLz: -.1, aLe: .6, headX: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'sad' });
  cm([KX - 1, 7.5, 6], [KX - 2, 7.4, 5], L.k); camera.lookAt(KX - 11.5, 4.4, -7); camera.fov = 46; sh(V(KX - 6, 0, -8), 18); }, [[0, 'metal_creak', .4], [.6, 'radio', .2]]);
// 58 «übrig. Vier Jahre lang»: la radio en mi mesilla, cubierta de polvo; pasan los días por la ventana; «4 JAHRE»
shot(77.81, 'F', null, L => { cuartoS(L); dust(V(RAD.x, RAD.y + 2, RAD.z), L.t0, L.T, 8, .4);
  cm([RAD.x + 1.6, 7.0, RAD.z + 8.4], [RAD.x + 1.4, 6.8, RAD.z + 7.4], L.k); camera.lookAt(RAD.x, 6, RAD.z); camera.fov = 42; badge('gold', '4 JAHRE', W / 2, H * .15, clamp(L.lt / .15), 1, .95); sh(RAD, 12); }, [[0, 'clock_tick', .5], [.5, 'wind', .3]]);
// 59 «blieb dieses Radio stumm.»: yo en la cama, mirando la radio callada
shot(79.27, 'W', null, L => { cuartoS(L); const m = inBed(L, { headY: -.9, headX: .1 }, { expr: 'sad', eyes: 'down' });
  cm([BEDX + 9, 7.5, BEDZ + 6], [BEDX + 8, 7.2, BEDZ + 5.4], L.k); camera.lookAt(BEDX - 3, 4.6, BEDZ - 1); camera.fov = 46; sh(V(BEDX, 0, BEDZ), 16); }, [[0, 'silence_tick', .45], [.5, 'cricket', .3]]);
// 60 «Bis gestern Nacht.» (zoom lento): la radio a oscuras
shot(80.85, 'I', 'slow', L => { cuartoS(L); cm([RAD.x + 1.6, 6.4, RAD.z + 9], [RAD.x + 1.2, 6.1, RAD.z + 5.8], easeIn(L.k)); camera.lookAt(RAD.x, 6, RAD.z); camera.fov = 42; sh(RAD, 12); }, [[0, 'owl', .35]]);
// 61 «Plötzlich ging es von selbst an,»: el dial se enciende de golpe, la aguja se mueve
shot(81.94, 'C', 'punch', L => { cuartoS(L); radioOn(L, clamp(L.lt / .15)); FILL.intensity = 30; FILL.color.setRGB(1, .8, .5);
  cm([RAD.x + 1.3, 6.6, RAD.z + 5.6], [RAD.x + 1.1, 6.4, RAD.z + 5.0], L.k); camera.lookAt(RAD.x, 6.1, RAD.z); camera.fov = 40; sh(RAD, 12); }, [[0, 'radio', .7], [.1, 'switch', .45]]);
// 62 «und ich hörte eine bekannte»: me incorporo de golpe, la luz naranja de la radio en la cara
shot(83.29, 'R', null, L => { cuartoS(L); radioOn(L, 1); const m = inBed(L, { headY: -.8, aLx: .9, aLz: .3, aLe: 1.2 }, { expr: 'shock', mouth: 'o' });
  onFace(m, 5, .1, .8, 40, L.k, 4.2); sh(V(BEDX, 0, BEDZ), 14); }, [[0, 'gasp', .5], [.4, 'radio', .3]]);
// 63 «Stimme. „Mein Sohn,»: la radio habla: ondas de luz, «Mein Sohn…»
shot(84.60, 'Z', null, L => { cuartoS(L); radioOn(L, 1 + Math.sin(L.T * 20) * .15); for (let i = 0; i < 3; i++) { const rg = RINGS[i], t = (L.T * 1.2 + i / 3) % 1; rg.visible = true; rg.position.set(RAD.x + .1, RAD.y + 1.7, RAD.z + 1.0 + t * 2.0); rg.lookAt(camera.position); rg.scale.setScalar(.35 + t * .8); rg.material.opacity = .45 * (1 - t); }
  cm([RAD.x + 1.2, 6.4, RAD.z + 8], [RAD.x + 1.0, 6.2, RAD.z + 7], L.k); camera.lookAt(RAD.x, 6.2, RAD.z); camera.fov = 42; sh(RAD, 12); }, [[0, 'radio', .45]]);
// 64 «hörst du mich? Papa?»: me abalanzo sobre la radio y la agarro: «PAPA?»
shot(85.90, 'W', null, L => { cuartoS(L); radioOn(L, 1); const m = put(ich, ZX - 16.5, 0, -5, 1.75); actuar(m, 0, [[0, { aLx: 1.4, aRx: 1.4, aLz: -.2, aRz: -.2, aLe: .9, aRe: .9, lean: .3, headX: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: L.T > 86.85 ? 'talk_wide' : 'o' });
  bubble(m, 'PAPA?', clamp((L.T - 86.9) / .1), 1.6); cm([ZX - 6, 7, 6], [ZX - 7, 6.8, 5], L.k); camera.lookAt(ZX - 15, 4.8, -6.5); camera.fov = 44; sh(RAD, 14); }, [[0, 'steps', .35], [.9, 'gasp', .35]]);
// 65 «Hör gut zu. Der Dampfsammler»: la radio de cerca, la aguja tiembla, el dial parpadea
shot(87.42, 'S', null, L => { cuartoS(L); radioOn(L, .8 + Math.sin(L.T * 30) * .2); cm([RAD.x - 2.0, 6.8, RAD.z + 5.4], [RAD.x - 1.6, 6.6, RAD.z + 4.6], L.k); camera.lookAt(RAD.x + .3, 6.0, RAD.z); camera.fov = 40; sh(RAD, 12); }, [[0, 'radio', .4], [.6, 'tv_static', .3]]);
// 66 «nimmt die Leute nicht zufällig mit.»: yo escuchando con los ojos muy abiertos, la cara iluminada en naranja
shot(88.99, 'F', null, L => { cuartoS(L); radioOn(L, 1); const m = put(ich, ZX - 16.5, 0, -5, 1.05); actuar(m, 0, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.2, aRz: -.2, aLe: 1.0, aRe: 1.0, lean: .25, headX: .15, headZ: .15, headY: .55 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', eyes: 'wide', mouth: 'flat' });
  cm([ZX - 8, 6.4, 3], [ZX - 8.6, 6.3, 2.4], L.k); camera.lookAt(ZX - 16.5, 5.2, -5); camera.fov = 40; FILL.color.setRGB(1, .75, .45); sh(RAD, 12); }, [[0, 'heartbeat', .45]]);
// 67 «Er sammelt. Dann wurde das» (zoom lento): la radio; «ER SAMMELT.» en rojo
shot(90.64, 'I', 'slow', L => { cuartoS(L); radioOn(L, 1); cm([RAD.x + 1.4, 6.4, RAD.z + 8], [RAD.x + 1.1, 6.2, RAD.z + 5], easeIn(L.k)); camera.lookAt(RAD.x, 6.0, RAD.z); camera.fov = 42; badge('red', 'ER SAMMELT.', W / 2, H * .16, clamp(L.lt / .15), 1, .85); sh(RAD, 12); }, [[0, 'whisper', .4]]);
// 68 «Signal immer schwächer.»: interferencias: la luz de la radio parpadea y se apaga
shot(91.91, 'R', null, L => { cuartoS(L); const k = 1 - clamp(L.lt / 1.3); radioOn(L, k * (Math.sin(L.T * 47) > -.2 ? 1 : .2)); TINT = `rgba(255,255,255,${(Math.sin(L.T * 91) * .5 + .5) * .06 * k})`;
  cm([RAD.x + 1.2, 6.2, RAD.z + 6.2], [RAD.x + 1.1, 6.2, RAD.z + 5.6], L.k); camera.lookAt(RAD.x, 6.0, RAD.z); camera.fov = 42; sh(RAD, 12); }, [[0, 'tv_static', .55], [.7, 'glitch', .35]]);
// 69 «Was sammelt er?»: grito a la radio, sacudiéndola
shot(93.39, 'C', 'punch', L => { cuartoS(L); radioOn(L, .05); const m = put(ich, ZX - 16.5, 0, -5, 1.75); actuar(m, 0, [[0, { aLx: 1.5, aRx: 1.5, aLz: -.3, aRz: -.3, aLe: .8, aRe: .8, lean: .2 + Math.sin(L.T * 30) * .05, headX: -.1 }]], { T: L.T }); cara(m, L.T, { expr: 'shout', mouth: 'scream' });
  bubble(m, 'WAS SAMMELT ER?', clamp(L.lt / .1), 1.4); cm([ZX - 7, 6.6, 5], [ZX - 7.6, 6.4, 4.4], L.k); camera.lookAt(ZX - 15.5, 5, -6); camera.fov = 42; sh(RAD, 14); }, [[0, 'shout_m', .4], [.2, 'shake', .35]]);
// ---------- d: el ruido abajo, mi hermano, la calada, el Dampfsammler vuelve (94,35 – 117,9 s) ----------
const BRP = V(KX - 5.4, 0, -.6);                  // mi hermano junto a la máquina (la máquina a su derecha)
const MEP = V(KX + 3, 0, 9);                       // donde llego yo al pie de la escalera
const SMP = V(KX - 6.4, 0, -4.6);                  // la criatura detrás de mi hermano (entre él y la máquina)
const bruAt = (L, ry, pose = {}, face = {}) => { const b = put(bru, BRP.x, 0, BRP.z, ry); actuar(b, 0, [[0, pose]], { T: L.T }); cara(b, L.T, face); return b; };
const holdOld = b => { b.aR.hand.add(OLDV); OLDV.visible = true; OLDV.position.set(0, -.25, .47); OLDV.rotation.set(1.54, 0, 0); OLDV.scale.setScalar(.95); OLDV.userData.setGlow(.3); };

// 70 «Plötzlich hörte ich etwas unten im»: me giro hacia la puerta; por debajo sale una luz cian
shot(94.35, 'F', null, L => { cuartoS(L); const m = put(ich, ZX + 10, 0, 2, 1.2); actuar(m, 0, [[0, { headY: .6, aLx: .3, aRx: .3, lean: -.05 }]], { T: L.T }); cara(m, L.T, { expr: 'worried', eyes: 'side_r' });
  FILL.color.setRGB(.6, .9, 1); cm([ZX + 4, 7, 15], [ZX + 4.6, 6.8, 14], L.k); camera.lookAt(ZX + 11.5, 4.6, 2.5); camera.fov = 46; sh(V(ZX + 12, 0, 3), 16); }, [[0, 'thud', .45], [.6, 'creepy_ting', .4]]);
// 71 «Keller. Ich stürmte hinunter.»: bajo la escalera del sótano a toda velocidad
shot(95.67, 'W', null, L => { kellerS(L); const k = clamp(L.lt / 1.3), step = lerp(11, 2, k); const z = 6 - step * 1.3, y = .95 + step * .75;
  const m = put(ich, KX + 17.5, y + Math.abs(Math.sin(L.T * 16)) * .2, z, 0); actuar(m, 0, [[0, { ...walkP(L.T * 1.7, 0), aLx: 1.0, aRx: -.7, lean: .15 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'grimace' });
  cm([KX + 7, 6, z + 4], [KX + 8, 5, z + 3], L.k); camera.lookAt(KX + 17.5, y + 3.5, z); camera.fov = 46; sh(V(KX + 16, 0, z), 18); }, [[0, 'steps_run', .6], [.5, 'door_open', .4]]);
// 72 «Und da stand mein kleiner»: el sótano en penumbra: mi hermano pequeño de pie junto a la máquina
shot(96.99, 'Z', null, L => { kellerS(L, { off: .35 }); MACH.userData.setPower(.6); bruAt(L, .5, { aLx: .3, aRx: .9, aRe: 1.4, headX: .2 }, { expr: 'happy' }); holdOld(bru);
  cm([KX + 6, 8, 12], [KX + 4.5, 7.4, 10.5], L.k); camera.lookAt(BRP.x + 1, 3.8, BRP.z - 2); camera.fov = 46; sh(BRP, 20); }, [[0, 'machine_hum', .45], [.6, 'drip', .35]]);
// 73 «Bruder, mit Papas alter»: se da la vuelta y me enseña lo que ha encontrado, muy contento
shot(98.26, 'S', null, L => { kellerS(L, { off: .35 }); const b = bruAt(L, lerp(-.4, .7, easeOut(clamp(L.lt / .5))), { aRx: 1.6, aRz: -.1, aRe: .9, aLx: .4, aLz: .2, aLe: .8 }, { expr: 'happy', mouth: 'open_smile' }); holdOld(b);
  onBody(b, 9, -.15, .1, 42, L.k, 8, -.05); sh(BRP, 14); }, [[0, 'cloth', .35], [.3, 'kids_laugh', .3]]);
// 74 «Vape in der Hand, direkt»: primer plano: la vape negra y vieja de papá en su mano pequeña
shot(99.67, 'C', 'punch', L => { kellerS(L, { off: .35 }); const b = bruAt(L, .7, { aRx: 1.7, aRz: -.05, aRe: .7, headX: .3 }, { expr: 'happy', eyes: 'down', mouth: 'smile' }); holdOld(b); OLDV.userData.setGlow(.5 + Math.sin(L.T * 5) * .3);
  const v = wpos(OLDV); cm([v.x + Math.sin(.7) * 3.4, v.y + 1, v.z + Math.cos(.7) * 3.4], [v.x + Math.sin(.7) * 3.0, v.y + .9, v.z + Math.cos(.7) * 3.0], L.k); camera.lookAt(v.x, v.y + .6, v.z); camera.fov = 40; sh(BRP, 12); }, [[0, 'pling', .45]]);
// 75 «neben der riesigen Maschine.»: plano bajo: mi hermano diminuto al lado de la máquina gigante
shot(101.02, 'R', null, L => { kellerS(L, { off: .35 }); MACH.userData.setPower(.8); const b = bruAt(L, .7, { aRx: 1.3, aRe: .9, headX: -.3, headY: .5 }, { expr: 'happy', eyes: 'up' }); holdOld(b);
  cm([KX + 1, 2.2, 11], [KX + .5, 2.4, 10], L.k); camera.lookAt(KX - 6, 5, -1); camera.fov = 52; sh(MP, 22); }, [[0, 'machine_hum', .5], [.6, 'metal_creak', .35]]);
// 76 «Bevor ich ihn aufhalten konnte,»: corro hacia él con el brazo extendido: «NEIN!»
shot(102.53, 'W', null, L => { kellerS(L, { off: .35 }); const k = clamp(L.lt / 1.4); const m = put(ich, lerp(MEP.x, MEP.x - 3, k), Math.abs(Math.sin(L.T * 14)) * .18, lerp(MEP.z, MEP.z - 3, k), -2.4);
  actuar(m, 0, [[0, { ...walkP(L.T * 1.5, 0), aRx: 1.7, aRz: .1, aRe: .1, lean: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'shout', mouth: 'scream' }); bubble(m, 'NEIN!', clamp((L.lt - .2) / .1), 1.4);
  const b = bruAt(L, .7, { aRx: 1.3, aRe: .9 }, { expr: 'happy' }); holdOld(b);
  cm([KX + 6, 8, 20], [KX + 5, 7.6, 18], L.k); camera.lookAt(KX - 1.5, 3.8, 3); camera.fov = 48; sh(V(KX, 0, 3), 22); }, [[0, 'steps_run', .5], [.25, 'shout_m', .4]]);
// 77 «zog er daran: Pfffffff!»: le da una calada; tose una nube; la máquina responde con un destello
shot(104.03, 'C', null, L => { kellerS(L, { off: .35 }); const b = put(bru, BRP.x, 0, BRP.z, .7); vaper(b, L, 104.0, .35, { expr: 'happy', vape: OLDV, exh: 1.2, pow: 5, size: 1.6, n: 60, dens: .9 }); holdOld(b); MACH.userData.setPower(.8 + clamp((L.T - 104.8) / .4) * 1.2);
  onFace(b, 5.4, .2, .6, 42, L.k, 4.6); sh(BRP, 14); }, [[.2, 'vape_in', .6], [.75, 'vape_out', .6], [1.0, 'cough', .4]]);
// 78 «Das ganze Haus fing an zu beben.»: todo tiembla: polvo de las vigas, tarros que tintinean, la máquina zumba
shot(105.62, 'S', null, L => { kellerS(L, { off: .35 }); SHAKE = .7; MACH.userData.setPower(2); MACH.position.x += Math.sin(L.T * 60) * .08; dust(V(KX - 4, 15, -2), L.t0, L.T, 14, 1.2);
  const b = bruAt(L, .7, { ...GEST.shock }, { expr: 'shock', mouth: 'o' }); holdOld(b); const m = put(ich, MEP.x - 3, 0, MEP.z - 3, -2.4); actuar(m, 0, [[0, { aLx: .9, aRx: .9, aLz: .6, aRz: .6, aLe: .5, aRe: .5, crouch: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'grimace' });
  cm([KX - 2, 9, 20], [KX - 2, 8.6, 18.5], L.k); camera.lookAt(KX - 2, 4, 2); camera.fov = 50; sh(V(KX, 0, 0), 24); }, [[0, 'machine_shake', .6], [.3, 'glass_rattle', .45], [.7, 'rubble', .35]]);
// 79 «Das Licht ging aus.»: las bombillas parpadean y se apagan una a una
shot(107.00, 'F', null, L => { const off = clamp((L.T - 107.7) / .4); kellerS(L, { off: Math.max(off, Math.sin(L.T * 40) > .6 ? .8 : 0) }); KE.BULBS.forEach((b, i) => { if (L.T > 107.55 + i * .1) { b.l.intensity = 0; b.bl.material.emissiveIntensity = .1; } }); MACH.userData.setPower(.5);
  cm([KX + 2, 7, 14], [KX + 2, 7.5, 13], L.k); camera.lookAt(KX, 11.5, -2); camera.fov = 52; sh(V(KX, 0, 0), 24); }, [[0, 'neon_buzz', .45], [.55, 'power_down', .6]]);
// 80 «Und hinter meinem Bruder»: oscuridad; mi hermano, iluminado solo por el brillo cian de la máquina
shot(108.39, 'Z', null, L => { kellerS(L, { off: 1 }); MACH.userData.setPower(.9); FILL.intensity = 6; FILL.color.setRGB(.5, .9, 1); const b = bruAt(L, .7, { aRx: .9, aRe: 1.2, aLx: .6, aLz: .3, aLe: 1.4, headY: -.2 }, { expr: 'worried', eyes: 'side_l' }); holdOld(b);
  onBody(b, 10, -.1, .08, 42, L.k, 8.6); sh(BRP, 14); }, [[0, 'heartbeat', .55], [.5, 'whisper', .35]]);
// 81 «leuchteten zwei Augen unter einem» (zoom lento): detrás de él, en la oscuridad, se encienden dos ojos cian
shot(109.66, 'I', 'slow', L => { kellerS(L, { off: 1 }); MACH.userData.setPower(.5); FILL.intensity = 4; FILL.color.setRGB(.5, .9, 1); const b = bruAt(L, .7, { aRx: .9, aRe: 1.2, aLx: .6, aLz: .3, aLe: 1.4 }, { expr: 'worried' }); holdOld(b);
  samAt(L, SMP.x, SMP.z, .5, { reach: 0, glow: clamp((L.T - 110.1) / .3), aura: clamp((L.T - 110.4) / .6) * .6 });
  const h = hp(bru); cm([h.x + 3.2, h.y + 1.5, h.z + 10.5], [h.x + 2.4, h.y + 2.5, h.z + 6.5], easeIn(L.k)); camera.lookAt(h.x - .4, h.y + 2.8, h.z - 3); camera.fov = 46; sh(BRP, 16); }, [[.45, 'creepy_ting', .55]]);
// 82 «schwarzen Zylinder auf.»: se revela entera: la chistera, la capucha, los brazos larguísimos abiertos sobre mi hermano
shot(111.10, 'C', 'punch', L => { kellerS(L, { off: 1 }); MACH.userData.setPower(.6); FILL.intensity = 8; FILL.color.setRGB(.6, .5, 1); const b = bruAt(L, .7, { aRx: .9, aRe: 1.2, aLx: .6, aLz: .3, aLe: 1.4 }, { expr: 'worried' }); holdOld(b);
  samAt(L, SMP.x, SMP.z, .5, { reach: .3, aura: 1 }); SMK.haze(V(SMP.x, 1.5, SMP.z), L.T, 14, 4, 1, 3, 4, .35, 71);
  orbit(V(BRP.x - .4, 6.5, BRP.z - 2), lerp(24, 21, L.k), .55, .05, 46); sh(BRP, 20); }, [[0, 'magic_hit', .6], [.2, 'growl', .4]]);
// 83 «Der Dampfsammler war hier.»: primer plano de la criatura: los ojos brillan con fuerza, la garra se acerca
shot(112.74, 'R', null, L => { kellerS(L, { off: 1 }); FILL.intensity = 6; FILL.color.setRGB(.6, .5, 1); bruAt(L, .7, { ...GEST.cower }, { expr: 'scared', mouth: 'o' }); holdOld(bru);
  const s = samAt(L, SMP.x, SMP.z, .5, { reach: clamp(L.lt / 1.2), glow: 1.3, aura: 1 }); const h = hp(s); cam([h.x + Math.sin(.5) * 9, h.y + .2, h.z + Math.cos(.5) * 9], [h.x, h.y - .9, h.z], 42); sh(BRP, 16); }, [[0, 'whisper', .45], [.6, 'growl', .4]]);
// 84 «Und dieses Mal würde ich ihn meine»: yo, decidido, me planto delante de mi hermano con la llave inglesa
shot(114.20, 'W', null, L => { kellerS(L, { off: 1 }); FILL.intensity = 10; FILL.color.setRGB(.6, .8, 1); const m = put(ich, BRP.x + 1.6, 0, BRP.z + 2.0, -2.0); actuar(m, 0, [[0, { aLx: .9, aLz: .9, aLe: .3, aRx: 1.7, aRz: -.2, aRe: .7, lean: .05 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', mouth: 'grimace' });
  onFace(m, 5, .1, -.5, 40, L.k, 4.2); sh(BRP, 14); }, [[0, 'steps_heavy', .45], [.5, 'heartbeat', .45]]);
// 85 «Familie nicht mitnehmen»: plano general: yo entre mi hermano y la criatura, que se alza enorme con su aura
shot(115.80, 'S', null, L => { kellerS(L, { off: 1 }); FILL.intensity = 10; FILL.color.setRGB(.6, .6, 1); const b = put(bru, BRP.x + 3.6, 0, BRP.z + 2.6, -2.3); actuar(b, 0, [[0, GEST.cower]], { T: L.T }); cara(b, L.T, { expr: 'scared' });
  const m = put(ich, BRP.x + 1.2, 0, BRP.z + .8, -2.5); actuar(m, 0, [[0, { aLx: .9, aLz: .9, aLe: .3, aRx: .9, aRz: .9, aRe: .3, lean: .05 }]], { T: L.T }); cara(m, L.T, { expr: 'determined' });
  samAt(L, SMP.x, SMP.z, .6, { reach: .5, aura: 1 }); orbit(V(KX - 4, 6, -1.6), lerp(26, 24, L.k), 1.1, .06, 48); sh(V(KX - 4, 0, -1), 22); }, [[0, 'braam_short', .5]]);
// 86 «lassen.» (zoom lento): primer plano de mis ojos, decidido; los ojos cian se reflejan detrás
shot(116.94, 'Z', 'slow', L => { kellerS(L, { off: 1 }); FILL.intensity = 10; FILL.color.setRGB(.6, .8, 1); const m = put(ich, BRP.x + 1.2, 0, BRP.z + .8, -2.5); actuar(m, 0, [[0, { aLx: .9, aLz: .9, aLe: .3, aRx: .9, aRz: .9, aRe: .3 }]], { T: L.T }); cara(m, L.T, { expr: 'determined', eyes: 'angry', mouth: 'grimace' });
  samAt(L, SMP.x, SMP.z, .6, { reach: .5, aura: 1 }); onFace(m, lerp(4.6, 3.6, easeIn(L.k)), .1, .4, 40, 0); sh(BRP, 14); }, [[0, 'heartbeat', .5]]);


// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const CUES = [];
// cada transición con su propio efecto (rotan para que dos seguidas nunca suenen igual)
const TRS = { W: ['whoosh_soft', 'swipe', 'whoosh_down'], Z: ['swoosh_up', 'zoom_in', 'whoosh_up'], F: ['flash', 'click_set', 'sparkle'], S: ['swipe', 'tape', 'whoosh_soft'], R: ['whirl', 'clock_spin', 'whoosh'], I: ['iris_pop', 'pop', 'pling'], C: ['thump', 'impact_soft', 'fist'] };
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
  hideAll(); BAD_.length = 0; FACES.length = 0; s.fn(L); while (POST.length) POST.shift()(); clearFaces();
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud', 'cash'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
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
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { applyPose, mouthW, hp, ich, sam, renderer, composer, bloom, sun, grade, scene, camera, SMK, CL, KE, CU, AR, RS };
// ---------- portadas (1080×1920; lo importante entre y = 240 y 1680) ----------
//@@COVER@@

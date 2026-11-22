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
const SS = +(QS.get('ss') ?? 2); if (SS > 1) { renderer.setPixelRatio(SS); renderer.setSize(W, H); composer.setPixelRatio(SS); composer.setSize(W, H); grade.uniforms.px.value.set(1 / W, 1 / H); octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high'; }
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -.0003; sun.shadow.normalBias = .12; sun.shadow.radius = 2.5; scene.add(sun, sun.target);
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
//@@PLANOS@@

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

// SCHWEISSBAND — «In dieser Stadt husst einfach jeder.»: planos sincronizados con audio/words.json (1080×1920, 30 fps).
// Hufenbach (pueblo alemán de entramado) vive para la HUSS-Weltmeisterschaft; Max, el único que no hace HUSS, entrena de noche
// y en el estadio gana al HUSS-O-MAT 9000, que llevaba la muñequera dorada robada al Opa. Planos en src/p/*.js (los t0 se atan a palabras).
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, lamp, makeExtra, skyscraper, bench } from './props.js';
import { makeOma, makeKumpel, makeLena, makeSie, makeEr, makeKassiererin, makeMayor, makeMama, makeVerk, makeNachbar } from './gvolk.js';
import { hufenbach, townhouse } from './gort.js';
import { wurstWagen } from './gsets.js';
import { goal, football, crowd, stadion, saal, partyHat } from './hsets.js';
import { omaStube } from './svsets.js';
import { needles, yarn } from './hals.js';
import { makeDoener, makeSchiri } from './fast.js';
import { makeHuss, makeMax, makeBasket, makeOpaK, makeRobo } from './hvolk.js';
import { bball, hoop, band, pedestal, kaestchen, brief, podium, strickTisch, pulli, floete, strassenBanner, court, fahne, anzeige, wurst, txt as txt2 } from './wm.js';
import { signBoard } from './wsets.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 148.5, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
const GLOW = new THREE.PointLight(0xffc870, 0, 30, 1.5); scene.add(GLOW);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }
const PI = Math.PI;

// ---------- escenarios ----------
// Hufenbach (x = 0): plaza adoquinada x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (x = -6, z ≈ -84); fuente (-18,-24); café (36,-40);
// carretera x = 26 hacia +z con pancarta HUSS-WM en z = 60 y farolas cada 16; casa de Max HAUS (4, 96); Wurstwagen (40, 30); canasta (-34, -46); portería (-25, -62).
// Estadio (STX): césped con cancha de madera en el centro; gradas a la izquierda (x = STX-26 … -44) mirando +x; marcador grande en (0, 18, -46).
// Stube (OSX): sillón de Opa AC (-6,-3), sofá SOFA (8,-9), mesa TB (3,3). Saal (SAX): Verliererparty.
const STX = 700, OSX = 1100, SAX = 1500;
const HB = hufenbach(scene), ST = stadion(scene, STX, 'HUSS-WELTMEISTERSCHAFT'), OS = omaStube(scene, OSX), SA = saal(scene, SAX);
const SETS = { HB: HB.G, ST: ST.g, OS: OS.g, SA: SA.g };
for (const k in SETS) outline(SETS[k], 1.4);
[HB.RANK, HB.KINO, HB.BOX, HB.PRICE].forEach(o => o && (o.visible = false));
townhouse(HB.G, -64, -21, 13, 3, 11, PI / 2); townhouse(HB.G, -64, -34.5, 13, 2, 12, PI / 2);
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3) + (Math.abs(x + 6) < 30 ? 1 : 0), 20 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 30 + i, PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 40 + i, -PI / 2); }
for (let i = 0, x = -140; x <= 140; x += 20, i++) townhouse(HB.G, x, -170, 18, 4 + (i % 3), 50 + i, 0);
for (let i = 0, z = 130; z < 330; z += 18, i++) townhouse(HB.G, 0, z, 16, 2 + (i % 2), 60 + i, PI / 2);
for (let i = 0, z = 80; z < 330; z += 18, i++) townhouse(HB.G, 54, z + 40, 16, 2 + (i % 3), 70 + i, -PI / 2);
const BAN = strassenBanner(HB.G, 'HUSS-WELTMEISTERSCHAFT', 15); BAN.position.set(26, 0, 60);
const BAN2 = strassenBanner(HB.G, 'HUSS-WM · HUSS-WM · HUSS-WM', 15); BAN2.position.set(26, 0, 150);
const BULBS = []; for (let z = 20, i = 0; z < 320; z += 16, i++) { BULBS.push(lamp(HB.G, 18.4, z, -1), lamp(HB.G, 33.6, z + 8, 1)); }
const WAGEN = wurstWagen(HB.G); WAGEN.position.set(-46, 0, 12); WAGEN.rotation.y = 0;
const HOOP = hoop(HB.G); HOOP.position.set(-34, 0, -48);
const GOAL = goal(HB.G, -25, -66, 0, 12, 5, 3.4);
bench(HB.G, 12, -14, 0); const OMASIGN = (() => { const s = signBoard('OMA HILDE · 70× MEISTERIN', 9, 1.6, '#ffffff', '#8a3ad8', '#8a3ad8', .3); s.position.set(12, 7.2, -17); HB.G.add(s); for (const x of [-4.2, 4.2]) cyl(.15, .15, 7.2, mat(0x8a6a4a), 6, HB.G, 12 + x, 3.6, -17.1); return s; })();
// estadio: cancha, marcador, pedestal con la muñequera, mesas del Strickfinale, podio, focos de la nave
const COURT = court(ST.g); COURT.position.set(0, 0, 0);
const BOARD = anzeige(ST.g, 18, 8); BOARD.position.set(0, 20, -47);
for (const s of [-1, 1]) cyl(.4, .4, 16, mat(0x3a3e4a, { metalness: .5 }), 8, ST.g, s * 8.5, 8, -47.6);
const PED = pedestal(ST.g); PED.position.set(0, 0, -18);
const TISCH1 = strickTisch(ST.g); TISCH1.position.set(-6, 0, -6); const TISCH2 = strickTisch(ST.g); TISCH2.position.set(6, 0, -6);
const POD = podium(ST.g); POD.position.set(0, 0, 14);
ST.ban.visible = true;
const HALLAMPS = Array.from({ length: 12 }, (_, i) => { const b = box(1.6, .8, 1.6, mat(0xffffff, { emissive: 0xfff2c8, emissiveIntensity: 0 }), .1, ST.g, -18 + (i % 6) * 7.2, 26, -30 + Math.floor(i / 6) * 50); return b; });
// Verliererparty
const VBAN = signBoard('VERLIERERPARTY', 26, 4.4, '#6a6a7a', '#ffffff', '#3a3a48', .2); VBAN.position.set(0, 12, -15.4); SA.g.add(VBAN);
// ---------- reparto ----------
const ich = makeMax(scene), opa = makeOpaK(scene), oma = makeOma(scene), mama = makeMama(scene), fuss = makeHuss(scene), bask = makeBasket(scene), wm = makeDoener(scene), robo = makeRobo(scene), schiri = makeSchiri(scene);
const K = Array.from({ length: 8 }, (_, i) => makeKumpel(scene, i)); const XT = [makeKassiererin(scene), makeVerk(scene), makeNachbar(scene), makeMayor(scene), makeLena(scene), makeSie(scene), makeEr(scene)];
kitFace(ich, 'kid'); kitFace(opa, 'mustache'); kitFace(oma, 'girl'); kitFace(mama, 'girl'); kitFace(fuss, 'kid'); kitFace(bask, 'hero'); kitFace(wm, 'mustache'); kitFace(robo, 'villain'); kitFace(schiri, 'mustache');
K.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'plain', 'girl', 'girl', 'kid', 'hero'][i])); XT.forEach((c, i) => kitFace(c, ['girl', 'girl', 'plain', 'mustache', 'girl', 'girl', 'plain'][i]));
const BG = Array.from({ length: 16 }, (_, i) => makeExtra(scene, i + 3)); BG.forEach((c, i) => kitFace(c, ['plain', 'girl', 'kid', 'hero', 'mustache', 'girl', 'plain', 'kid'][i % 8]));
const POOL = [ich, opa, oma, mama, fuss, bask, wm, robo, schiri, ...K, ...XT, ...BG]; POOL.forEach(c => { outline(c.root, 2); c.root.rotation.order = 'YXZ'; });
const HATS = new Map(); [...K, ...XT, ...BG].forEach((c, i) => { const h = partyHat(c.head, i, 1.32); h.visible = false; HATS.set(c, h); });
const hat = (...cs) => cs.forEach(c => HATS.get(c) && (HATS.get(c).visible = true));
// atrezo en las manos (se colocan con attach)
const NEED = needles(scene), YARN = yarn(scene, 0xd8323a), YARN2 = yarn(scene, 0x2a6ad8);
const BALL = football(scene, .55), BBALL = bball(scene, .62), BBALL2 = bball(scene, .62); [BALL, BBALL, BBALL2].forEach(b => outline(b, 1.6));
const WURST = wurst(scene), BRIEF = brief(scene), KAST = kaestchen(scene), BANDF = band(scene, .55);
const PULLI = pulli(scene, 0xd8323a); const PULLIS = Array.from({ length: 14 }, (_, i) => pulli(scene, [0x2a6ad8, 0x2ab86a, 0xffd23f, 0x8a3ad8, 0xff8a3a][i % 5]));
const FLOETEN = Array.from({ length: 4 }, () => floete(scene));
const FAHNEN = Array.from({ length: 8 }, (_, i) => fahne(scene, i));
// multitud instanciada en las gradas del estadio
const CRW = crowd(scene, 196); (() => { let i = 0; for (let r = 0; r < 7; r++) for (let k = 0; k < 28; k++) { const s = CRW.seat[i++]; s.x = STX - 25.3 - r * 2.6; s.y = 1.6 + r * 1.6; s.z = -33 + k * 2.45 + (r % 2) * .6; s.ry = PI / 2; } })();
const stands = (T, mode = 'cheer', silent = false) => CRW.update(T, mode, silent, 196);
// ---------- efectos ----------
const CONF = Array.from({ length: 60 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 4 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const SMOKE = Array.from({ length: 8 }, () => sphere(1, mat(0x3a3a3e, { transparent: true, opacity: .5, depthWrite: false, roughness: 1 }), scene, 0, 0, 0, 8, 6));
const SPARK = Array.from({ length: 14 }, () => sphere(.18, new THREE.MeshBasicMaterial({ color: 0xffe08a, toneMapped: false }), scene, 0, 0, 0, 6, 4));
const PARTS = Array.from({ length: 10 }, (_, i) => box([1.2, .8, 1.4, .6][i % 4], [.8, 1.2, .5, .6][i % 4], [.6, .8, .5, 1][i % 4], mat(i % 3 ? 0x8a94a4 : 0x3a4050, { metalness: .7, roughness: .35 }), .05, scene, 0, 0, 0));
const TRL = Array.from({ length: 7 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.5, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .4 * (1 - i / 7), depthWrite: false })); m.renderOrder = 2; scene.add(m); return m; });
const HEARTS = Array.from({ length: 5 }, () => { const p = textPlane(1, 1, 64, 64, (c, w, h) => { c.fillStyle = '#ff4a7a'; c.beginPath(); c.moveTo(32, 54); c.bezierCurveTo(-10, 26, 12, -6, 32, 16); c.bezierCurveTo(52, -6, 74, 26, 32, 54); c.fill(); }); p.material.depthWrite = false; p.material.transparent = true; scene.add(p); return p; });
const NOTES = Array.from({ length: 5 }, (_, i) => { const p = textPlane(1.4, 1.4, 64, 64, (c, w, h) => txt2(c, i % 2 ? '♪' : '♫', w / 2, h / 2, 56, '#ffffff', '#1a1a2a', 8)); p.material.depthWrite = false; p.material.transparent = true; scene.add(p); return p; });
const QM = textPlane(1.6, 1.6, 64, 64, (c, w, h) => txt2(c, '?', 32, 34, 60, '#ffd23f', '#1a1a2a', 8)); QM.material.depthWrite = false; scene.add(QM);
const PROPS = [NEED, YARN, YARN2, BALL, BBALL, BBALL2, WURST, BRIEF, KAST, BANDF, PULLI, ...PULLIS, ...FLOETEN, ...FAHNEN, ...CONF, ...DUST, ...SWEAT, ...TEAR, ...SMOKE, ...SPARK, ...PARTS, ...TRL, ...HEARTS, ...NOTES, QM];
PROPS.forEach(p => p.visible = false);
// ---------- ambiente ----------
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.25; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.55, .62, .42); sun.intensity = 2.5; sun.color.setRGB(1, .95, .86); rim.intensity = 1.0;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function sunset() { day(); MODE = 'sunset'; setSky([.22, .32, .78], [.85, .55, .7], [1, .72, .45]); sun.color.setRGB(1, .82, .62); sun.intensity = 2.3; hemi.color.setRGB(1, .9, .85); scene.fog.color.setRGB(1, .82, .7); bloom.strength = .2; }
function grey() { day(); setSky([.3, .34, .42], [.45, .5, .58], [.6, .64, .7]); sun.intensity = 1.1; hemi.intensity = .95; BIRDSON = 0; }
function winter() { day(); setSky([.55, .62, .74], [.72, .78, .86], [.88, .9, .94]); sun.intensity = 1.3; hemi.intensity = 1.3; scene.fog.color.setRGB(.9, .92, .96); scene.fog.density = .003; BIRDSON = 0; }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.0; setSky([.02, .04, .16], [.08, .12, .34], [.2, .22, .46]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.0; hemi.color.setRGB(.6, .7, 1); hemi.groundColor.setRGB(.25, .25, .36); sun.intensity = 1.1; sun.color.setRGB(.72, .78, 1); rim.intensity = 1.7;
  scene.fog.color.setRGB(.1, .14, .28); scene.fog.density = .0011; bloom.strength = .3; bloom.threshold = .85; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = .95, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .2; bloom.threshold = .88; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); c.root.position.y = 0; applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } }
  for (const h of HATS.values()) h.visible = false; ich.props.gold.visible = false; ich.props.band.visible = true; robo.props.gold.visible = true; robo.props.visor.material.emissiveIntensity = 2.4;
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  CRW.update(0, 'still', false, 0); BULBS.forEach(b => b.material.emissiveIntensity = .1); HALLAMPS.forEach(b => b.material.emissiveIntensity = 0); GLOW.intensity = 0;
  PED.visible = true; PED.userData.band.visible = true; TISCH1.visible = TISCH2.visible = POD.visible = false; KAST.userData.lid.rotation.x = -1.9;
  for (const k in SETS) SETS[k].visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = 1.15; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
// órbita: cámara a distancia d del centro c, ángulo yaw (0 = desde +z), pitch (arriba +); el centro queda al ~42 % de la altura
function orbit(c, d, yaw = 0, pitch = .15, fov = 44) { const t = Math.tan(fov * Math.PI / 360) * d * .16; cam([c.x + Math.sin(yaw) * Math.cos(pitch) * d, c.y + Math.sin(pitch) * d, c.z + Math.cos(yaw) * Math.cos(pitch) * d], [c.x, c.y - t, c.z], fov); }
const orb_ = (k, c0, c1, a, b, e = easeInOut) => { const q = e(clamp(k)); orbit(c0.clone().lerp(c1 ?? c0, q), lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q), lerp(a[3] ?? 44, b[3] ?? 44, q)); };
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
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
const tears = (ch, T) => { const h = hp(ch), s = ch.spec.scale || 1, a = ch.root.rotation.y; TEAR.forEach((d, i) => { const k = (T * 1.2 + i * .25) % 1, sd = i % 2 ? -1 : 1; d.visible = true; const lx = sd * .3 * s, lz = .62 * s; d.position.set(h.x + Math.cos(a) * lx + Math.sin(a) * lz, h.y + (.7 - k * 1.2) * s, h.z - Math.sin(a) * lx + Math.cos(a) * lz); }); };
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.7 + t * 2) * s * (.8 + r() * .5)); d.material.opacity = .55 * (1 - t / 1.2); }); }
function splash(c, T0, T, s = 1) { SPLASH.forEach((d, i) => { const r = RNG(i * 7 + 1), t = T - T0; if (t < 0 || t > 1.1) return; d.visible = true; const a = r() * 6.283, v = (2 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * t, c.y + (6 + r() * 5) * s * t - 14 * t * t, c.z + Math.sin(a) * v * t); d.scale.setScalar(s * (1 - t * .6)); }); }
function smoke(c, T, s = 1) { SMOKE.forEach((d, i) => { const k = (T * .5 + i / 8) % 1; d.visible = true; d.position.set(c.x + Math.sin(i * 2.3 + T) * .8 * s, c.y + k * 6 * s, c.z + Math.cos(i * 1.7) * .6 * s); d.scale.setScalar((.6 + k * 1.6) * s); d.material.opacity = .55 * (1 - k); }); }
function steam(c, T) { STEAM.forEach((d, i) => { const k = (T * .7 + i / 5) % 1; d.visible = true; d.position.set(c.x + Math.sin(i * 2 + T * 2) * .3, c.y + k * 2.4, c.z); d.scale.setScalar(.3 + k * .6); d.material.opacity = .5 * (1 - k); }); }
function hearts(p, T) { HEARTS.forEach((z, i) => { const k = (T * .6 + i / 5) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 1.7 + T) * 1.4, p.y + k * 3.4, p.z + .4); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
const arc = (a, b, h, k) => V(lerp(a.x, b.x, k), lerp(a.y, b.y, k) + 4 * h * k * (1 - k), lerp(a.z, b.z, k));
const loc = (ch, x, y, z) => { ch.root.updateMatrixWorld(true); return ch.root.localToWorld(V(x, y, z)); };
// ---------- capa 2D ----------
const BAD_ = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD_.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD_.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD_.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; if (x < -60 || x > W + 60) return; b.x = clamp(x, 200, W - 200); b.y = clamp(y, 150, H * .64); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num' || b.kind === 'green' || b.kind === 'gold') { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : b.kind === 'green' ? '#04300e' : b.kind === 'gold' ? '#3a2400' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#8aff9a'); g.addColorStop(1, '#1ab84a'); } else if (b.kind === 'gold') { g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a820'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'huss') { c.rotate(-.12); c.font = `700 120px ${FONT}`; c.lineWidth = 24; c.strokeStyle = '#1a1a2a'; c.strokeText(b.text, 0, 0); c.fillStyle = '#ffffff'; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  c.restore(); }
const KEY = /^(Stadt|HUSS|HUSS-Weltmeisterschaft|Fußballer|Basketballer|Würstchenmann|Oma|Hilde|siebzigfache|Welt|Preis|goldene|Schweißband|Verliererparty|Drei|Regel|dreimal|Großstadt|zweimal|Max|mir|Schnürsenkel|Plumps|Opa|zweiundneunzig|Kästchen|sechzig|gestohlen|Nacht|zwei|fünf|zehn|Straßenlaternen|Roboter|HUSS-O-MAT|9000|langsam|kreidebleich|Goldenes|Strickfinale|Minute|Pullover|zweihundert|Ohnmacht|siebzig|Duell|Hand|Halle|null|Prozent|Schneller|Lampe|Laternen|qualmte|schwitzen|Schweiß|Klonk|Füße|husste|einziges|frei|vier|Sofa|Brief|10000|10.000|aufhören)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
// tiempos atados a las palabras: tw('Wort', n) = inicio de la n-ésima aparición (sin puntuación); th(g, j) = j-ésimo HUSS de la ráfaga g (1..13)
const norm_ = s => s.replace(/[„“"”.,!?:…–]/g, '').trim();
const tw = (w, n = 1) => { let k = 0; for (const x of WORDS) if (norm_(x[2]) === w && ++k === n) return x[0]; throw new Error('palabra ' + w + ' ' + n); };
const th = (g, j = 1) => { const L = WORDS.filter(x => x[3] === -g); if (!L.length) throw new Error('HUSS ' + g); return L[Math.min(j, L.length) - 1][0]; };
const hEnd = g => { const L = WORDS.filter(x => x[3] === -g); return L[L.length - 1][1]; };
let DARK = 0, TINT = null, SHAKE = 0; const COVERS = [];
let LMODE = 'day'; const town = (m = 'day') => { use('HB'); LMODE = m; if (m === 'night') night(45); else if (m === 'morning') sunset(); else if (m === 'grey') grey(); else day(); };

// ---------- ayudas de los planos ----------
// skyline de la Großstadt (lejos, al norte del pueblo)
const CITY = new THREE.Group(); HB.G.add(CITY); for (let i = 0; i < 9; i++) skyscraper(CITY, -160 + i * 40, -420 - (i % 3) * 30, 26, 90 + (i * 37) % 80, 26);
// gente del pueblo alrededor de (cx, cz) (reparto de fondo, sin pisarse, del lado opuesto a la cámara)
function folk(cx, cz, n, r0, r1, T, seed = 1, o = {}) { POST.push(() => { const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc = o.arc || [ac + 1.6, ac + 6.283 - 1.6];
  const busy = POOL.filter(c => c.root.visible && !BG.includes(c)).map(c => c.root.position.clone()); const P = []; const m = Math.min(n, BG.length);
  for (let i = 0; i < m; i++) { let x, z, ok = false; for (let t = 0; t < 30 && !ok; t++) { const a = arc[0] + r() * (arc[1] - arc[0]), d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; ok = [...busy, ...P].every(q => Math.hypot(q.x - x, q.z - z) > 3.6); }
    if (!ok) continue; P.push(V(x, 0, z)); const c = BG[i]; const ry = o.face ? Math.atan2(o.face.x - x, o.face.z - z) + (r() - .5) * .5 : Math.atan2(camera.position.x - x, camera.position.z - z) + (r() - .5) * .8; put(c, x, o.y || 0, z, ry); if (o.hats) hat(c);
    const md = o.mode || 'mix'; const g = md === 'cheer' ? [[0, 'cheer']] : md === 'laugh' ? [[0, i % 2 ? 'point' : 'point_l']] : md === 'sad' ? [[0, i % 2 ? 'slump' : 'facepalm']] : md === 'shock' ? [[0, i % 2 ? 'shock' : 'hands_face']] : md === 'ears' ? [[0, 'hands_head']] : [[0, ['idle', 'cross', 'wave', 'point', 'idle', 'shrug'][i % 6]]];
    actuar(c, T + i * .37, g, { T: T + i, extra: md === 'cheer' ? { hipY: 2.05 + Math.abs(Math.sin(T * 6 + i)) * .3 } : {} });
    if (md === 'cheer') grin(c, T + i); else if (md === 'laugh') laughF(c, T + i); else cara(c, T + i, { expr: { sad: 'sad', shock: 'shock', ears: 'angry' }[md] || ['smile', 'neutral', 'happy', 'smug'][i % 4] }); } }); }
// gente corriendo por la carretera (z decreciente: hacia la cámara si la cámara está en -z). balls: botan balones
function runners(T, lt, z0, n, seed = 3, o = {}) { const r = RNG(seed), dir = o.dir ?? 1, x0 = o.x ?? 26, wd = o.w ?? 11; for (let i = 0; i < Math.min(n, BG.length); i++) { const c = BG[i]; const x = x0 - wd / 2 + r() * wd, z = z0 + i * (o.gap ?? 3.4) + r() * 2, sp = (o.sp ?? 6) + r() * 2;
    put(c, x, Math.abs(Math.sin(T * 9 + i)) * .25, z - dir * sp * lt, dir > 0 ? PI : 0); applyPose(c, runPoseL(T * 1.6 + i * .7)); if (o.hats) hat(c); if (o.cheer && i % 2) applyPose(c, { ...runPoseL(T * 1.6 + i), aLx: 2.8, aLz: .4, aLe: .2 }); grin(c, T + i);
    if (o.flags && i < FAHNEN.length) { const f = attach(FAHNEN[i], c.aR.hand, [0, -.4, .2], [0, 0, 0], 1); f.userData.cloth.rotation.y = Math.sin(T * 6 + i) * .3; applyPose(c, { ...runPoseL(T * 1.6 + i * .7), aRx: 2.5, aRe: .3 }); } } }
const runPoseL = ph => { const s = Math.sin(ph * 5), c2 = Math.cos(ph * 5); return { lLx: s * .9, lRx: -s * .9, lLk: Math.max(0, -c2) * 1.2 + .2, lRk: Math.max(0, c2) * 1.2 + .2, aLx: -s * .9, aRx: s * .9, aLe: 1.2, aRe: 1.2, lean: .22 }; };
// botar un balón: pose de bote + balón entre la mano y el suelo (fast = HUSS)
function dribble(ch, b, T, o = {}) { const f = o.f ?? 3, sc = ch.spec.scale || 1; const ph = (T * f) % 1, up = Math.abs(Math.sin(ph * PI)); const hand = o.left ? ch.aL : ch.aR;
  const base = o.run ? runPoseL(T * (o.rs ?? 1.4)) : { crouch: .25, lean: .18, lLx: .3, lRx: -.2, lLk: .4, lRk: .4 }; const arm = o.left ? { aLx: .9 + up * .5, aLe: .9 - up * .4, aLz: .25 } : { aRx: .9 + up * .5, aRe: .9 - up * .4, aRz: .25 };
  applyPose(ch, { ...base, ...arm, ...(o.extra || {}) }); POST.push(() => { const h = wpos(hand.hand); const fl = V(h.x, b.geometry.parameters.radius, h.z); b.visible = true; b.position.lerpVectors(fl, h.add(V(0, -.7 * sc, 0)), up); b.rotation.x = T * 9; if (o.trail) trailOn(b.position, T, o.trail); }); }
function trailOn(p, T, n = 7) { TRL.forEach((m, i) => { if (i >= n) return; m.visible = true; m.position.copy(p).add(V(Math.sin(T * 17 + i) * .2 * i, -i * .05, i * .35)); m.scale.setScalar(1 - i * .1); }); }
// ráfaga de HUSS!: letrero blanco que entra con golpe en cada sílaba (g = ráfaga)
function hussPop(g, T, x = W / 2, y = H * .2) { const L_ = WORDS.filter(w => w[3] === -g); let k = -1; L_.forEach((w, i) => { if (T >= w[0]) k = i; }); if (k < 0) return; const lt = T - L_[k][0]; badge('huss', 'HUSS!', x + (k % 2 ? 60 : -60) * U, y + (k % 3) * 18, lt * 6, 1, 1.05); }
// golpes del HUSS: k 0..1 dentro de cada sílaba (para movimientos rápidos)
const hk = (g, T) => { const L_ = WORDS.filter(w => w[3] === -g); for (let i = L_.length - 1; i >= 0; i--) if (T >= L_[i][0]) return i + clamp((T - L_[i][0]) / .2); return 0; };
// cara de esfuerzo
const effort = (ch, T) => cara(ch, T, { expr: 'determined', mouth: Math.sin(T * 30) > 0 ? 'grimace' : 'open_smile' });
function sparks(c, T0, T, n = 14, s = 1) { SPARK.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 11 + 5), t = T - T0; if (t < 0 || t > .9) return; d.visible = true; const a = r() * 6.283, v = (4 + r() * 5) * s; d.position.set(c.x + Math.cos(a) * v * t, c.y + (5 + r() * 4) * s * t - 9 * t * t, c.z + Math.sin(a) * v * t); d.scale.setScalar(1 - t); }); }
function notes(p, T) { NOTES.forEach((z, i) => { const k = (T * .7 + i / 5) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 1.7 + T) * 1.6, p.y + k * 3.4, p.z + .4); z.scale.setScalar(.6 + k * .5); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
// marcador grande del estadio
const board = (key, fn) => BOARD.userData.draw(key, fn);
const bText = (lines) => board(lines.map(l => l[0]).join('|'), (c, w, h) => lines.forEach(([t, y, sz, col]) => txt2(c, t, w / 2, h * y, sz, col || '#ffd23f')));
// sepia para recuerdos
const sepia = () => { grade.uniforms.sepia.value = .85; grade.uniforms.vig.value = .75; grade.uniforms.sat.value = 1.0; };
// estadio
const stadium = (m = 'day') => { use('ST'); if (m === 'night') night(30); else day(); };
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
  hideAll(); BAD_.length = 0; s.fn(L); while (POST.length) POST.shift()();
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .8, e); camera.fov *= lerp(1, .86, e); }
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud'].includes(c.s) && T - c.t < .16) sh_ = Math.max(sh_, 1 - (T - c.t) / .16); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, MODE === 'night' ? 'noche' : 'polvo', MODE === 'in' ? .3 : .4);
  if (BIRDS.update) BIRDS.update(T, camera.position.clone().addScaledVector(dir, 60).add(V(0, 25, 0)), (MODE === 'day' || MODE === 'sunset') && BIRDSON ? 1 : 0);
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
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { renderer, composer, bloom, sun, grade, scene, camera };

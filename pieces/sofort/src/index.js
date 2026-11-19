// SOFORT — «In dieser Stadt bin ich der Superschurke.»: planos sincronizados con audio/words.json (1080×1920, 30 fps).
// Kapitän Sofort convierte en polvo a quien decide. Fue héroe en la Liga der Supers (Stahlpranke, Zack, Funkel, Herr Alleskann); no hizo nada contra el gigante
// Granitor, los convirtió en polvo, borró a los criminales, se dejó arrestar, en el juicio vació la sala y hoy escribe las reglas. Planos en src/p/*.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, lamp, makeExtra, skyscraper, bench, txt as txt2 } from './props.js';
import { makeOma, makeKumpel, makeLena, makeSie, makeEr, makeKassiererin, makeMayor, makeMama, makeVerk, makeNachbar, makeDieb } from './gvolk.js';
import { hufenbach, townhouse } from './gort.js';
import { knast, bruecke } from './gsets.js';
import { crowd } from './hsets.js';
import { omaStube } from './svsets.js';
import { signBoard } from './wsets.js';
import { cape, innenstadt, turm, tribunal, zelleK, panzer, dustPile, laser, wespe, schild, sockel, fernseher, gerichtFront, auto } from './ksets.js';
import { makeKapitaen, makeKlein, makeStahl, makeZack, makeFunkel, makeAlles, makeGranitor, makeRichter, makeSoldat, makeStatue, makePolizist } from './kcast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 174.1, U = W / 720;
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
// Hufenbach (HB, x = 0): plaza adoquinada x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (x = -6, z ≈ -92); carretera x = 26 hacia +z; casa del capitán HAUS (4, 96) con la fachada a +x (césped x 12–18).
// Innenstadt (DT): avenida a lo largo de z (x ∈ [-11, 11]), aceras, rascacielos a ambos lados; Landgericht con escalinata al fondo (z = -360, mira a +z).
// Puente (BR): tablero x ∈ [-24, 24], z ∈ [-6, 6], y ≈ 2; río a lo largo de z. Sala de la Liga (TR): mesa redonda en (0, -2), ventanal al fondo (-z).
// Gefängnis (KN), celda (ZE), Gerichtssaal (GE): estrado al fondo (z = -16), banco del acusado (0, 0), cámaras. Salón con tele (WO).
const DTX = 700, BRX = 1200, TRX = 1600, KNX = 2000, ZEX = 2400, GEX = 2800, WOX = 3200;
const HB = hufenbach(scene), DT = innenstadt(scene, DTX), BR = bruecke(scene, BRX), TR = turm(scene, TRX), KN = knast(scene, KNX), ZE = zelleK(scene, ZEX), GE = tribunal(scene, GEX), WO = omaStube(scene, WOX);
DT.CARS.forEach(c => { c.userData.p0 = c.position.clone(); c.userData.r0 = c.rotation.y; }); TR.CHAIRS.forEach(c => c.userData.r0 = c.rotation.y);
const SETS = { HB: HB.G, DT: DT.g, BR: BR.g, TR: TR.g, KN: KN.g, ZE: ZE.g, GE: GE.g, WO: WO.g };
for (const k in SETS) outline(SETS[k], 1.4);
[HB.RANK, HB.KINO, HB.BOX, HB.PRICE].forEach(o => o && (o.visible = false));
townhouse(HB.G, -64, -21, 13, 3, 11, PI / 2); townhouse(HB.G, -64, -34.5, 13, 2, 12, PI / 2);
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3) + (Math.abs(x + 6) < 30 ? 1 : 0), 20 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 30 + i, PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 40 + i, -PI / 2); }
for (let i = 0, x = -140; x <= 140; x += 20, i++) townhouse(HB.G, x, -170, 18, 4 + (i % 3), 50 + i, 0);
for (let i = 0, z = 130; z < 330; z += 18, i++) townhouse(HB.G, 0, z, 16, 2 + (i % 2), 60 + i, PI / 2);
for (let i = 0, z = 80; z < 330; z += 18, i++) townhouse(HB.G, 54, z + 40, 16, 2 + (i % 3), 70 + i, -PI / 2);
const CITY = new THREE.Group(); HB.G.add(CITY); for (let i = 0; i < 11; i++) skyscraper(CITY, -200 + i * 40, -330 - (i % 3) * 30, 26, 90 + (i * 37) % 80, 26);
const BULBS = []; for (let z = 20; z < 320; z += 16) BULBS.push(lamp(HB.G, 18.4, z, -1), lamp(HB.G, 33.6, z + 8, 1));
// estatua en la plaza (sobre su pedestal) y pantalla gigante de la plaza
const SOCK = sockel(HB.G); SOCK.position.set(-6, 0, -30); SOCK.visible = false;
const BIGTV = fernseher(HB.G); BIGTV.position.set(-6, 22, -70); BIGTV.scale.setScalar(2.2);
// Landgericht al fondo de la avenida
const GFRONT = gerichtFront(DT.g); GFRONT.position.set(0, 0, -340);
const OSIGN = (() => { const p = signBoard('BÜRGERMEISTER', 24, 4, '#3a2010', '#ffd23f', '#d9a531', .6); p.position.set(-27.6, 15, 0); p.rotation.y = PI / 2; TR.g.add(p); p.visible = false; return p; })();
// cárcel: cartel propio
KN.g.children.filter(o => o.isMesh && o.geometry.parameters && o.geometry.parameters.width === 30 && o.geometry.parameters.height === 4).forEach(o => o.visible = false);
const KSIGN = signBoard('GEFÄNGNIS', 30, 4, '#1a1e2a', '#ffffff', '#ff4a4a', 1.0); KSIGN.position.set(0, 26.6, -14.5); KN.g.add(KSIGN);
// Liga: foto de grupo
TR.FOTO.userData.draw('foto', (c, w, h) => { c.fillStyle = '#e8eef8'; c.fillRect(0, 0, w, h); const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#5ab0ff'); g.addColorStop(1, '#bfe4ff'); c.fillStyle = g; c.fillRect(14, 14, w - 28, h - 28);
  const cols = [['#ff8a1a', '#6a707e', '#f4f0e0'], ['#ffd23f', '#1a6aff', '#f4f4fa'], ['#6a2ad8', '#141a3a', '#101016'], ['#d9a531', '#d8202a', '#5a3018'], ['#8a3ad8', '#7ad8b8', '#f2f2f2']];
  cols.forEach(([cp, bd, hr], i) => { const x = 60 + i * 90, y = i === 2 ? 120 : 150, s = i === 2 ? 1.25 : 1; c.fillStyle = cp; c.fillRect(x - 32 * s, y, 64 * s, 130 * s); c.fillStyle = bd; c.fillRect(x - 24 * s, y + 4, 48 * s, 90 * s); c.fillStyle = '#f0c8a8'; c.fillRect(x - 18 * s, y - 40 * s, 36 * s, 38 * s); c.fillStyle = hr; c.fillRect(x - 20 * s, y - 46 * s, 40 * s, 12 * s); c.fillStyle = '#1a1a1a'; c.fillRect(x - 9 * s, y - 26 * s, 5, 5); c.fillRect(x + 5 * s, y - 26 * s, 5, 5); });
  txt2(c, 'LIGA DER SUPERS', w / 2, h - 34, 34, '#ffffff', '#1a1a2a', 6); });
// ---------- reparto ----------
const ich = makeKapitaen(scene), klein = makeKlein(scene), stahl = makeStahl(scene), zack = makeZack(scene), funkel = makeFunkel(scene), alles = makeAlles(scene), gran = makeGranitor(scene), richter = makeRichter(scene), statue = makeStatue(scene);
const polizist = makePolizist(scene), mayor = makeMayor(scene), mama = makeMama(scene), dieb = makeDieb(scene);
const SOLD = Array.from({ length: 4 }, (_, i) => makeSoldat(scene, i));
const K = Array.from({ length: 8 }, (_, i) => makeKumpel(scene, i)); const XT = [makeKassiererin(scene), makeVerk(scene), makeNachbar(scene), makeLena(scene), makeSie(scene), makeEr(scene), makeOma(scene)];
kitFace(ich, 'villain'); kitFace(klein, 'kid'); kitFace(stahl, 'girl'); kitFace(zack, 'kid'); kitFace(funkel, 'hero'); kitFace(alles, 'mustache'); kitFace(gran, 'villain'); kitFace(richter, 'mustache'); kitFace(statue, 'hero');
kitFace(mayor, 'mustache'); kitFace(polizist, 'plain'); kitFace(mama, 'girl'); kitFace(dieb, 'plain'); SOLD.forEach((c, i) => kitFace(c, ['plain', 'hero', 'plain', 'kid'][i]));
K.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'plain', 'girl', 'girl', 'kid', 'hero'][i])); XT.forEach((c, i) => kitFace(c, ['girl', 'girl', 'plain', 'girl', 'girl', 'plain', 'girl'][i]));
const BG = Array.from({ length: 16 }, (_, i) => makeExtra(scene, i + 3)); BG.forEach((c, i) => kitFace(c, ['plain', 'girl', 'kid', 'hero', 'mustache', 'girl', 'plain', 'kid'][i % 8]));
const LIGA = [stahl, zack, funkel, alles];
const POOL = [polizist, ich, klein, stahl, zack, funkel, alles, gran, richter, statue, mayor, mama, dieb, ...SOLD, ...K, ...XT, ...BG]; POOL.forEach(c => { outline(c.root, c === gran ? 6 : 2); c.root.rotation.order = 'YXZ'; });
// capas pequeñas para los niños y la cola de la Liga der Größe (capa negra/violeta como la del capitán)
[...K, ...BG.slice(0, 8)].forEach(c => { cape(c, 0x101014, 0x6a2ad8, 3.4); c.props.cape.visible = false; });
const capeOn = (...cs) => cs.forEach(c => c.props.cape && (c.props.cape.visible = true));
// ---------- atrezo ----------
const PILES = Array.from({ length: 6 }, () => dustPile(scene, 1)); const CAPESF = Array.from({ length: 4 }, (_, i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 4), mat([0xff8a1a, 0xffd23f, 0xd9a531, 0x8a3ad8][i], { side: THREE.DoubleSide, roughness: .6 })); m.castShadow = true; scene.add(m); return m; });
const LZ = [laser(scene), laser(scene)]; const WESP = Array.from({ length: 12 }, () => wespe(scene));
const SIGNS = Array.from({ length: 10 }, (_, i) => schild(scene, i % 3 ? 'FREIHEIT FÜR DEN KAPITÄN!' : 'KAPITÄN = HELD', i));
const TANKS = Array.from({ length: 12 }, () => panzer(scene));
const TV = fernseher(scene); const CUFFS = new THREE.Group(); scene.add(CUFFS); for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.5, .14, 8, 20), mat(0xb8bcc8, { metalness: .9, roughness: .2 })); r.position.x = s * .5; CUFFS.add(r); } box(.5, .1, .1, mat(0xb8bcc8, { metalness: .9 }), .02, CUFFS, 0, 0, 0);
const MICS = new THREE.Group(); scene.add(MICS); box(5, 3.6, 2.2, mat(0x2a3a6a, { roughness: .4 }), .1, MICS, 0, 1.8, 0); for (let k = 0; k < 6; k++) { const m = cyl(.06, .06, 1.6, mat(0x2a2a2a), 6, MICS, -1.6 + k * .64, 4.3, .4); m.rotation.x = -.3; sphere(.2, mat([0xd8323a, 0x2a6ad8, 0x1a1a1a, 0x2ab86a, 0xffd23f, 0x1a1a1a][k]), MICS, -1.6 + k * .64, 5.1, .2, 8, 6); }
const BIKE = new THREE.Group(); scene.add(BIKE); for (const z of [-1.4, 1.4]) { const w = new THREE.Mesh(new THREE.TorusGeometry(1, .1, 6, 20), mat(0x1a1a1a)); w.position.set(0, 1, z); w.rotation.y = PI / 2; BIKE.add(w); } box(.12, .12, 2.6, mat(0xd8323a, { metalness: .5 }), .02, BIKE, 0, 1.8, 0); box(.12, 1, .12, mat(0xd8323a), .02, BIKE, 0, 1.4, -.6); box(.5, .14, .9, mat(0x1a1a1a), .04, BIKE, 0, 2.1, -.6); box(1.4, .1, .1, mat(0x8a8e96, { metalness: .8 }), .02, BIKE, 0, 2.2, 1.2);
const PROPS = [...PILES, ...CAPESF, ...LZ, ...WESP, ...SIGNS, ...TANKS, TV, CUFFS, MICS, BIKE];
// ---------- efectos ----------
const CONF = Array.from({ length: 60 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xb8b0a4, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const GRAIN = Array.from({ length: 40 }, () => box(.18, .18, .18, mat(0x9a948a, { roughness: 1 }), .02, scene, 0, 0, 0));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 4 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const SMOKE = Array.from({ length: 10 }, () => sphere(1, mat(0x3a3a3e, { transparent: true, opacity: .5, depthWrite: false, roughness: 1 }), scene, 0, 0, 0, 8, 6));
const FIRE = Array.from({ length: 10 }, (_, i) => { const m = new THREE.Mesh(new THREE.ConeGeometry(1, 2.6, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(...[[3, 1.2, .2], [3, .6, .1], [3, 2, .4]][i % 3]), toneMapped: false, transparent: true, opacity: .9 })); scene.add(m); return m; });
const SPARK = Array.from({ length: 14 }, () => sphere(.18, new THREE.MeshBasicMaterial({ color: 0xffe08a, toneMapped: false }), scene, 0, 0, 0, 6, 4));
const TRL = Array.from({ length: 8 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.9, 12, 8), new THREE.MeshBasicMaterial({ color: 0x8ad0ff, transparent: true, opacity: .45 * (1 - i / 8), depthWrite: false, toneMapped: false })); m.renderOrder = 2; scene.add(m); return m; });
const QM = textPlane(1.6, 1.6, 64, 64, (c, w, h) => txt2(c, '?', 32, 34, 60, '#ffd23f', '#1a1a2a', 8)); QM.material.depthWrite = false; scene.add(QM);
const ZZZ = textPlane(1.6, 1.6, 64, 64, (c, w, h) => txt2(c, 'z', 32, 34, 60, '#ffffff', '#1a1a2a', 8)); ZZZ.material.depthWrite = false; ZZZ.material.transparent = true; scene.add(ZZZ);
const DEBRIS = Array.from({ length: 12 }, (_, i) => box(1.4 + (i % 3), 1 + (i % 2), 1.2, mat([0x8a8e96, 0xc8c4bc, 0x6a6e78][i % 3], { roughness: .9 }), .1, scene, 0, 0, 0));
const FX = [...CONF, ...DUST, ...GRAIN, ...SWEAT, ...TEAR, ...SMOKE, ...FIRE, ...SPARK, ...TRL, QM, ZZZ, ...DEBRIS];
PROPS.forEach(p => p.visible = false); FX.forEach(p => p.visible = false);
// multitud instanciada (plaza, escalinata, cola, manifestación)
const CRW = crowd(scene, 240); let CRWN = 0; CRW.g.children[3].visible = false;
function crowdGrid(cx, cz, cols, rows, sp = 3, ry = 0, y0 = 0, step = 0, jit = .8) { const r = RNG(cols * 7 + rows); let i = 0; const cs = Math.cos(ry), sn = Math.sin(ry);
  for (let a = 0; a < rows; a++) for (let b = 0; b < cols; b++) { if (i >= 240) break; const lx = (b - (cols - 1) / 2) * sp + (r() - .5) * jit, lz = -a * sp + (r() - .5) * jit; const s = CRW.seat[i++]; s.x = cx + lx * cs + lz * sn; s.z = cz - lx * sn + lz * cs; s.y = y0 + a * step; s.ry = ry + (r() - .5) * .3; } CRWN = i; }
const stands = (T, mode = 'cheer', silent = false) => CRW.update(T, mode, silent, CRWN);
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.25; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.55, .62, .42); sun.intensity = 2.5; sun.color.setRGB(1, .95, .86); rim.intensity = 1.0;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function sunset() { day(); MODE = 'sunset'; setSky([.22, .32, .78], [.85, .55, .7], [1, .72, .45]); sun.color.setRGB(1, .82, .62); sun.intensity = 2.3; hemi.color.setRGB(1, .9, .85); scene.fog.color.setRGB(1, .82, .7); bloom.strength = .2; }
function dusk() { day(); MODE = 'sunset'; setSky([.12, .1, .3], [.7, .3, .3], [1, .5, .25]); sun.color.setRGB(1, .6, .4); sun.intensity = 2.0; hemi.intensity = 1.0; hemi.color.setRGB(1, .8, .75); scene.fog.color.setRGB(.9, .5, .35); scene.fog.density = .0016; bloom.strength = .26; BIRDSON = 0; }
function grey() { day(); setSky([.3, .34, .42], [.45, .5, .58], [.6, .64, .7]); sun.intensity = 1.1; hemi.intensity = .95; BIRDSON = 0; }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.0; setSky([.02, .04, .16], [.08, .12, .34], [.2, .22, .46]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.0; hemi.color.setRGB(.6, .7, 1); hemi.groundColor.setRGB(.25, .25, .36); sun.intensity = 1.1; sun.color.setRGB(.72, .78, 1); rim.intensity = 1.7;
  scene.fog.color.setRGB(.1, .14, .28); scene.fog.density = .0011; bloom.strength = .3; bloom.threshold = .85; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = .95, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .2; bloom.threshold = .88; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); c.root.position.y = 0; applyPose(c, {}); c.setFace({}); c.props.fly = 0; c.props.wind = .5; if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } }
  [...K, ...BG.slice(0, 8)].forEach(c => c.props.cape.visible = false); LIGA.forEach(c => c.props.cape.visible = true); ich.props.cape.visible = true;
  gran.props.crack.emissiveIntensity = 1.2; gran.props.armor.forEach(m => { m.emissive.setHex(0x000000); m.emissiveIntensity = 0; });
  for (const p of [...PROPS, ...FX]) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  CRW.update(0, 'still', false, 0); CRWN = 0; BULBS.forEach(b => b.material && (b.material.emissiveIntensity = .1)); GLOW.intensity = 0; SOCK.visible = false; BIGTV.visible = false; TR.CHAIRS.forEach(c => c.rotation.y = c.userData.r0); TR.T.position.set(0, 0, -2); TR.T.visible = true; TR.sg.visible = true; OSIGN.visible = false; KN.beam.visible = true; KN.SPOT.intensity = 0; ich.props.cape.rotation.y = 0; DT.CARS.forEach(c => { c.position.copy(c.userData.p0); c.rotation.set(0, c.userData.r0, 0); c.visible = true; }); GE.CHAIR.rotation.y = 0;
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
const orb = (k, c0, c1, a, b, e = easeInOut) => { const q = e(clamp(k)); orbit(c0.clone().lerp(c1 ?? c0, q), lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q), lerp(a[3] ?? 44, b[3] ?? 44, q)); };
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
// cámara frontal a la cara de un personaje (según su ry): dist, altura extra, desvío lateral (rad), fov
function onFace(ch, d = 7, dy = 0, side = 0, fov = 40, k = 0, d2 = null) { const h = hp(ch), a = ch.root.rotation.y + side, dd = d2 == null ? d : lerp(d, d2, easeInOut(clamp(k))); const s = ch.spec.scale || 1; orbit(V(h.x, h.y + (.4 + dy) * s, h.z), dd * s, a, .08, fov); }
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
    case 'bored': return n > -.4 ? 'half' : 'up';
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk', extra = {}) => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat', ...extra });
const grin = (ch, T, ex = {}) => cara(ch, T, { expr: 'grin', eyes: 'happy', mouth: 'grin', ...ex });
const smug = (ch, T, ex = {}) => cara(ch, T, { expr: 'smug', mouth: 'smirk', ...ex });
const laughF = (ch, T) => cara(ch, T, { eyes: 'happy', mouth: Math.sin(T * 22) > 0 ? 'laugh' : 'open_smile' });
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
const tears = (ch, T) => { const h = hp(ch), s = ch.spec.scale || 1, a = ch.root.rotation.y; TEAR.forEach((d, i) => { const k = (T * 1.2 + i * .25) % 1, sd = i % 2 ? -1 : 1; d.visible = true; const lx = sd * .3 * s, lz = .62 * s; d.position.set(h.x + Math.cos(a) * lx + Math.sin(a) * lz, h.y + (.7 - k * 1.2) * s, h.z - Math.sin(a) * lx + Math.cos(a) * lz); }); };
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.7 + t * 2) * s * (.8 + r() * .5)); d.material.opacity = .55 * (1 - t / 1.2); }); }
function smoke(c, T, s = 1) { SMOKE.forEach((d, i) => { const k = (T * .5 + i / 10) % 1; d.visible = true; d.position.set(c.x + Math.sin(i * 2.3 + T) * .8 * s, c.y + k * 6 * s, c.z + Math.cos(i * 1.7) * .6 * s); d.scale.setScalar((.6 + k * 1.6) * s); d.material.opacity = .55 * (1 - k); }); }
function fire(c, T, s = 1, n = 10) { FIRE.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 9 + 2); f.visible = true; const k = (T * 1.6 + r()) % 1; f.position.set(c.x + (r() - .5) * 6 * s, c.y + k * 3 * s, c.z + (r() - .5) * 6 * s); f.scale.setScalar((1 - k * .7) * s * (.7 + r() * .6)); }); }
function sparks(c, T0, T, n = 14, s = 1) { SPARK.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 11 + 5), t = T - T0; if (t < 0 || t > .9) return; d.visible = true; const a = r() * 6.283, v = (4 + r() * 5) * s; d.position.set(c.x + Math.cos(a) * v * t, c.y + (5 + r() * 4) * s * t - 9 * t * t, c.z + Math.sin(a) * v * t); d.scale.setScalar(1 - t); }); }
function trailOn(p, T, dir = V(0, 0, 1), n = 8, sp = 1.4) { TRL.forEach((m, i) => { if (i >= n) return; m.visible = true; m.position.copy(p).addScaledVector(dir, -i * sp).add(V(Math.sin(T * 17 + i) * .2, Math.sin(T * 11 + i) * .2, 0)); m.scale.setScalar(1.4 - i * .12); }); }
const arc = (a, b, h, k) => V(lerp(a.x, b.x, k), lerp(a.y, b.y, k) + 4 * h * k * (1 - k), lerp(a.z, b.z, k));
const loc = (ch, x, y, z) => { ch.root.updateMatrixWorld(true); return ch.root.localToWorld(V(x, y, z)); };
const runPoseL = ph => { const s = Math.sin(ph * 5), c2 = Math.cos(ph * 5); return { lLx: s * .9, lRx: -s * .9, lLk: Math.max(0, -c2) * 1.2 + .2, lRk: Math.max(0, c2) * 1.2 + .2, aLx: -s * .9, aRx: s * .9, aLe: 1.2, aRe: 1.2, lean: .22 }; };
const walkP = ph => { const s = Math.sin(ph * 4); return { lLx: s * .5, lRx: -s * .5, lLk: Math.max(0, -Math.cos(ph * 4)) * .5, lRk: Math.max(0, Math.cos(ph * 4)) * .5, aLx: -s * .4, aRx: s * .4, aLe: .3, aRe: .3 }; };
// poses del capitán
const FLOAT = { lLx: .25, lRx: -.1, lLk: .5, lRk: .2, aLz: .25, aRz: .25, aLe: .2, aRe: .2, crouch: 0 };
const CROSS = { ...GEST.cross };
const SIT = { crouch: 1.0, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5 };
const flyY = (T, a = .4) => Math.sin(T * 1.8) * a;
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
  c.restore(); }
const KEY = /^(Stadt|Superschurke|gestern|übernommen|Kapitän|Sofort|weg|Blitz|Geräusch|Staub|acht|Wespen|Wespe|Held|Liga|Supers|fünf|Stahlpranke|Fähren|Zack|Schnellste|Funkel|Laser|Alleskann|Foto|Mitte|Stärkste|Angst|Granitor|Riese|Hochhaus|Brücke|Autos|Brust|rot|schwebte|Sekunde|Name|Lust|sieben|Stunden|halbe|kaputt|Feigling|Umhang|leise|verletzt|langweilig|klar|Keiner|aufhalten|Schulter|Stille|Vier|Umhänge|Boden|Morgen|Größe|Verbrecher|Dieb|Schläger|Fahrrad|Gefängnis|still|null|Statue|Schule|Bürgermeister|mir|zwölf|Panzer|Rasen|verhaften|Armee|Böse|Tausende|Schildern|Freiheit|Plan|Prozess|Sender|Richter|Wahrheit|achtzig|Kamera|Polizisten|Politiker|Saal|Stuhl|Treppe|jubelte|jubelten|Schlange|Block|Rathaus|Wachen|Nein|Heute|Regeln|zählt)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
// tiempos atados a las palabras: tw('Wort', n) = inicio de la n-ésima aparición (sin puntuación)
const norm_ = s => s.replace(/[„“"”.,!?:…–]/g, '').trim();
const tw = (w, n = 1) => { let k = 0; for (const x of WORDS) if (norm_(x[2]) === w && ++k === n) return x[0]; throw new Error('palabra ' + w + ' ' + n); };
const twE = (w, n = 1) => { let k = 0; for (const x of WORDS) if (norm_(x[2]) === w && ++k === n) return x[1]; throw new Error('palabra ' + w + ' ' + n); };
let DARK = 0, TINT = null, SHAKE = 0; const COVERS = [];
const town = (m = 'day') => { use('HB'); if (m === 'night') night(45); else if (m === 'morning') sunset(); else if (m === 'grey') grey(); else if (m === 'dusk') dusk(); else day(); };
const city = (m = 'day') => { use('DT'); if (m === 'night') night(45); else if (m === 'dusk') dusk(); else day(); };
const sepia = () => { grade.uniforms.sepia.value = .85; grade.uniforms.vig.value = .75; grade.uniforms.sat.value = 1.0; };
// ---------- ayudas de los planos ----------
// gente alrededor de (cx, cz) (reparto de fondo, sin pisarse, del lado opuesto a la cámara)
function folk(cx, cz, n, r0, r1, T, seed = 1, o = {}) { POST.push(() => { const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc = o.arc || [ac + 1.6, ac + 6.283 - 1.6];
  const busy = POOL.filter(c => c.root.visible && !BG.includes(c)).map(c => c.root.position.clone()); const P = []; const m = Math.min(n, BG.length);
  for (let i = 0; i < m; i++) { let x, z, ok = false; for (let t = 0; t < 30 && !ok; t++) { const a = arc[0] + r() * (arc[1] - arc[0]), d = r0 + r() * (r1 - r0); x = cx + Math.cos(a) * d; z = cz + Math.sin(a) * d; ok = [...busy, ...P].every(q => Math.hypot(q.x - x, q.z - z) > 3.6); }
    if (!ok) continue; P.push(V(x, 0, z)); const c = BG[i]; const ry = o.face ? Math.atan2(o.face.x - x, o.face.z - z) + (r() - .5) * .5 : Math.atan2(camera.position.x - x, camera.position.z - z) + (r() - .5) * .8; put(c, x, o.y || 0, z, ry); if (o.capes && i < 8) capeOn(c);
    const md = o.mode || 'mix'; const g = md === 'cheer' ? [[0, 'cheer']] : md === 'laugh' ? [[0, i % 2 ? 'point' : 'point_l']] : md === 'sad' ? [[0, i % 2 ? 'slump' : 'facepalm']] : md === 'shock' ? [[0, i % 2 ? 'shock' : 'hands_face']] : md === 'cower' ? [[0, i % 2 ? 'cower' : 'hug_self']] : md === 'still' ? [[0, 'idle']] : [[0, ['idle', 'cross', 'wave', 'point', 'idle', 'shrug'][i % 6]]];
    actuar(c, T + i * .37, g, { T: T + i, extra: md === 'cheer' ? { hipY: 2.05 + Math.abs(Math.sin(T * 6 + i)) * .3 } : {} });
    if (md === 'cheer') grin(c, T + i); else if (md === 'laugh') laughF(c, T + i); else cara(c, T + i, { expr: { sad: 'sad', shock: 'shock', cower: 'worried', still: 'worried' }[md] || ['smile', 'neutral', 'happy', 'smug'][i % 4] }); } }); }
// gente corriendo (dir 1: hacia -z)
function runners(T, lt, z0, n, seed = 3, o = {}) { const r = RNG(seed), dir = o.dir ?? 1, x0 = o.x ?? 0, wd = o.w ?? 14; for (let i = 0; i < Math.min(n, BG.length); i++) { const c = BG[i]; const x = x0 - wd / 2 + r() * wd, z = z0 + i * (o.gap ?? 3.4) + r() * 2, sp = (o.sp ?? 6) + r() * 2;
    put(c, x, Math.abs(Math.sin(T * 9 + i)) * .25, z - dir * sp * lt, dir > 0 ? PI : 0); applyPose(c, runPoseL(T * 1.6 + i * .7)); cara(c, T + i, { expr: o.expr || 'shock', mouth: 'scream' }); } }
// «puf»: el personaje desaparece de golpe y queda un montoncito de polvo (pile i) en su sitio
function poof(ch, T0, T, pile = 0, s = 1) { const p = ch.root.position.clone(); const sc = (ch.spec.scale || 1) * s; if (T < T0) return false; ch.root.visible = false; if (ch.props.cape) ch.props.cape.visible = false;
  const t = T - T0; show(PILES[pile], p.x, p.y, p.z, 0, sc * clamp(.3 + t * 4)); dust(V(p.x, p.y, p.z), T0, T, 8, .6 * sc);
  GRAIN.forEach((g, i) => { if (i >= 20 || t > 1) return; const r = RNG(i * 7 + pile), a = r() * 6.283; g.visible = true; g.position.set(p.x + Math.cos(a) * r() * 1.4 * sc, p.y + (1 + r() * 4) * sc * (1 - t) ** 2, p.z + Math.sin(a) * r() * 1.4 * sc); }); return true; }
// láser de los ojos de Funkel hasta un punto
function eyeLaser(ch, to, T, w = 1) { const h = hp(ch), a = ch.root.rotation.y, s = ch.spec.scale || 1; for (const [i, sd] of [[0, -1], [1, 1]]) { const lx = sd * .3 * s, lz = .7 * s; const p = V(h.x + Math.cos(a) * lx + Math.sin(a) * lz, h.y + .84 * s, h.z - Math.sin(a) * lx + Math.cos(a) * lz); LZ[i].userData.span(p, to.clone().add(V(sd * .2, 0, 0)), w * (1 + Math.sin(T * 40) * .15)); } }
// avispas volando alrededor de c
function wasps(c, T, n = 12, r = 3, o = {}) { WESP.forEach((w, i) => { if (i >= n) return; w.visible = true; const a = T * (2 + i % 3) + i * 1.3, rr = r * (.6 + (i % 4) * .2); w.position.set(c.x + Math.cos(a) * rr, c.y + Math.sin(T * 5 + i) * 1.2 + (i % 3) * .6, c.z + Math.sin(a) * rr); w.rotation.y = -a; w.userData.flap(T + i); w.scale.setScalar(o.s || 1); }); }
// capas en el suelo (las de los cuatro héroes)
function capesFloor(c, T, n = 4) { CAPESF.forEach((m, i) => { if (i >= n) return; m.visible = true; m.position.set(c.x - 3.3 + i * 2.2, c.y + .06 + i * .01, c.z + (i % 2) * 1.8 - .9); m.rotation.set(-PI / 2, 0, (i - 1.5) * .5); m.scale.setScalar(.75); }); }
// ascensión del capitán en el aire con la capa al viento
const hover = (ch, x, y, z, ry, T, o = {}) => { put(ch, x, y + flyY(T, o.a ?? .4), z, ry); actuar(ch, T, [[0, { ...FLOAT, ...(o.pose || {}) }]], { T }); ch.props.fly = o.fly ?? .6; ch.props.wind = o.wind ?? 1; return ch; };
// marcador de televisión en una pantalla
const tvDraw = (scr, key, fn) => scr.userData.draw(key, fn);
// dibuja la escena «noticias» en una pantalla (titular + cara del capitán)
function news(scr, head, sub, col = '#d8323a') { tvDraw(scr, head + sub, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1a2a5a'); g.addColorStop(1, '#0a1230'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  const x = w * .5, y = h * .38; c.fillStyle = '#6a2ad8'; c.fillRect(x - 70, y + 40, 140, 80); c.fillStyle = '#141a3a'; c.fillRect(x - 50, y + 40, 100, 80); c.fillStyle = '#f0c8a8'; c.fillRect(x - 40, y - 50, 80, 86); c.fillStyle = '#101016'; c.fillRect(x - 44, y - 62, 88, 26); c.fillStyle = '#1a1a1a'; c.fillRect(x - 22, y - 20, 12, 10); c.fillRect(x + 10, y - 20, 12, 10); c.fillRect(x - 14, y + 12, 28, 5);
  c.fillStyle = col; c.fillRect(0, h - 96, w, 60); txt2(c, head, w / 2, h - 66, 40, '#ffffff'); c.fillStyle = '#ffffff'; c.fillRect(0, h - 36, w, 36); txt2(c, sub, w / 2, h - 18, 24, '#1a1a2a'); c.fillStyle = '#d8323a'; c.fillRect(16, 16, 90, 36); txt2(c, 'LIVE', 61, 35, 26, '#ffffff'); }); }
// ---------- a: gancho (supervillano, poder del polvo), avispas, la Liga der Supers (0 – 39,8 s) ----------
// atrezo propio de los planos
const FERRY = (() => { const g = new THREE.Group(); scene.add(g); const w = mat(0xf4f4f4, { roughness: .4 }), r = mat(0xd8323a, { roughness: .4 });
  box(10, 3, 30, w, 1, g, 0, 1.5, 0); box(10.2, .8, 30.2, r, .2, g, 0, .3, 0); box(8, 3.4, 16, w, .4, g, 0, 4.6, -2); box(6, 2.6, 8, w, .4, g, 0, 7.6, -4); cyl(1.2, 1.2, 4, r, 14, g, 0, 10.6, -6);
  for (let i = 0; i < 6; i++) for (const s of [-1, 1]) box(.1, 1, 1.6, mat(0x3a8ad8, { roughness: .1 }), .02, g, s * 4.02, 4.8, -8 + i * 2.6); const t = textPlane(8, 1.4, 400, 70, (c, ww, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, ww, h); txt2(c, 'FÄHRE 3', ww / 2, h / 2 + 3, 50, '#d8323a'); }, .2); t.position.set(5.06, 2, 4); t.rotation.y = PI / 2; g.add(t);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; }); g.visible = false; PROPS.push(g); return g; })();
const DUCK = (() => { const g = new THREE.Group(); scene.add(g); const y = mat(0xffd21a, { roughness: .3 }); const b = sphere(3, y, g, 0, 2.6, 0, 20, 14); b.scale.set(1, .75, 1.3); sphere(1.8, y, g, 0, 5.4, 2.4, 18, 12); const bk = new THREE.Mesh(new THREE.ConeGeometry(.7, 1.6, 12), mat(0xff8a1a)); bk.rotation.x = PI / 2; bk.position.set(0, 5.2, 4.6); g.add(bk);
  for (const s of [-1, 1]) { sphere(.32, mat(0x101010), g, s * .8, 6, 3.8, 10, 8); sphere(.1, mat(0xffffff), g, s * .8 + .1, 6.15, 4.1, 6, 4); } const t = sphere(1, y, g, 0, 3.4, -3.8, 10, 8); t.scale.set(.8, .6, 1); g.traverse(o => { if (o.isMesh) o.castShadow = true; }); g.visible = false; PROPS.push(g); return g; })();
const CHUNK = (() => { const g = new THREE.Group(); scene.add(g); const st = mat(0xb8a888, { roughness: .9 }); box(16, 1.4, 12, st, .1, g, 0, 0, 0); box(16, .1, 10, mat(0x4a4e5a), 0, g, 0, .75, 0); for (const z of [-5.6, 5.6]) box(16, 2.4, .8, st, .1, g, 0, 1.6, z); for (let k = 0; k < 6; k++) box(.6 + (k % 2) * .4, 1, .6, st, .1, g, -8.4, -.4 + (k % 3) * .4, -5 + k * 2);
  g.traverse(o => { if (o.isMesh) o.castShadow = true; }); g.visible = false; PROPS.push(g); return g; })();
const PANEL = (() => { const s = new THREE.Group(); scene.add(s); const sc = fernseher(s); sc.scale.setScalar(1.4); s.userData.scr = sc.userData.scr; s.visible = false; PROPS.push(s); return s; })();
const LBAN = (() => { const p = textPlane(30, 8, 1200, 320, (c, w, h) => { c.fillStyle = '#141a3a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d9a531'; c.lineWidth = 16; c.strokeRect(8, 8, w - 16, h - 16); txt2(c, 'LIGA DER GRÖSSE', w / 2, h * .42, 150, '#ffd23f'); txt2(c, '⌛  KAPITÄN SOFORT  ⌛', w / 2, h * .78, 60, '#c89aff'); }, .6); scene.add(p); p.visible = false; PROPS.push(p); return p; })();
const flash = (L, a = .12) => { grade.uniforms.flash.value = Math.max(0, 1 - L.lt / a) * .9; };
const purple = (L, s = 1) => { TINT = `rgba(120,40,220,${(.12 + Math.sin(L.T * 12) * .04) * s})`; };
const DT0 = DTX;
const effort = (ch, T) => cara(ch, T, { expr: 'determined', mouth: Math.sin(T * 30) > 0 ? 'grimace' : 'open_smile' });
function splashW(c, T, k = 1) { TRL.forEach((m, i) => { const r = RNG(i * 5 + 2), t = (T * .8 + r()) % 1; m.visible = true; const a = r() * 6.283; m.position.set(c.x + Math.cos(a) * (3 + t * 6), c.y + Math.sin(t * PI) * 6 * k, c.z + Math.sin(a) * (3 + t * 6)); m.scale.setScalar(1.2 - t * .6); }); }

// 1 «In dieser Stadt bin ich der Superschurke.» (zoom lento): al atardecer, el capitán flota sobre la avenida llena de gente que mira hacia arriba; la cámara sube hacia él
shot(0, 'C', 'slow', L => { city('dusk'); const c = hover(ich, DT0, 14, -40, 0, L.T, { pose: { ...CROSS, lLx: .2, lRx: -.1, lLk: .4 } }); smug(c, L.T);
  crowdGrid(DT0, -34, 7, 8, 2.8, PI, 0, 0); stands(L.T, 'still', true);
  cm([DT0 + 2, 6, 12, DT0, 10, -40, 60], [DT0 + 1, 8, -2, DT0, 12, -40, 52], L.k, easeOut); sh(V(DT0, 0, -36), 60); }, [[0, 'zoom_fast', .9], [.1, 'wind', .5], [.6, 'whoosh', .3], [1.4, 'crowd_gasp', .4]]);
// 2 «Und gestern habe ich endlich die ganze Stadt übernommen.»: sobre el Rathaus de Hufenbach cuelga su bandera morada; él aterriza en el balcón con los brazos abiertos
shot(tw('Und', 1), 'R', null, L => { town('dusk'); const c = hover(ich, -6, 21 - easeOut(clamp(L.lt / .6)) * 4, -78, 0, L.T, { pose: { aLx: 1.6, aLz: 1.2, aRx: 1.6, aRz: 1.2, aLe: .1, aRe: .1 }, fly: .4 }); grin(c, L.T);
  show(LBAN, -6, 31, -82.6, 0, .55); crowdGrid(-6, -60, 10, 7, 3, PI, 0, 0); stands(L.T, 'still', true);
  cm([-6, 8, -12, -6, 14, -78, 58], [-6, 11, -30, -6, 17, -78, 50], L.k); sh(V(-6, 0, -70), 60); }, [[0, 'swoosh', .6], [.4, 'land', .5], [.9, 'crowd_murmur', .4], [1.6, 'bell', .3]]);
// 3 «Mein Name ist Kapitän Sofort.» golpe de zoom: primer plano frontal, la capa ondea, el nombre en dorado
shot(tw('Mein', 1), 'C', 'punch', L => { city('dusk'); const c = hover(ich, DT0, 8, -60, 0, L.T, { pose: { aLz: .3, aRz: .3, aRx: .3, aRe: .4 }, wind: 1.2 }); talk(c, L.T, L.t0, L.t1, 'smug', { mouth: kitLips(L.T, spoken(L.t0, L.t1)) || 'smirk' });
  badge('gold', 'KAPITÄN SOFORT', W / 2, H * .17, (L.lt - .55) * 3); onFace(c, 8, -.6, .25 - L.k * .3, 40); sh(V(DT0, 0, -60), 30); }, [[0, 'impact', .6], [.7, 'ding', .5], [1.2, 'wind', .3]]);
// 4 «Denn wenn ich entscheide, dass du weg bist,»: por la acera corre un ladrón con un saco; el capitán, de espaldas a cámara, lo señala con el dedo
shot(tw('Denn', 1), 'W', null, L => { city('dusk'); const d = put(dieb, DT0 + 16, 0, -40 - L.lt * 5, PI); applyPose(d, runPoseL(L.T * 1.8)); cara(d, L.T, { expr: 'smug', mouth: 'grin' });
  const c = hover(ich, DT0 + 4, 7, -6, faceTo(V(DT0 + 4, 0, -6), d.root.position), L.T, { pose: { ...GEST.point, lLx: .2, lLk: .4 }, a: .2 }); cara(c, L.T, { expr: 'determined', mouth: 'flat' });
  folk(DT0 + 16, -46, 5, 6, 12, L.T, 4, { mode: 'mix' });
  cm([DT0 - 6, 9, 4, DT0 + 10, 5, -34, 48], [DT0 - 4, 8.5, 1, DT0 + 11, 5, -36, 46], L.k); sh(V(DT0 + 10, 0, -30), 40); }, [[0, 'whoosh', .5], [.2, 'footsteps_run', .5], [.9, 'point', .3]]);
// 5 «dann bist du weg.»: el ladrón en plano medio, mira atrás asustado… y desaparece: polvo
shot(tw('dann', 1), 'C', null, L => { city('dusk'); const d = put(dieb, DT0 + 16, 0, -48, PI * .9); actuar(d, L.lt, [[0, runPoseL(L.T * 1.8)], [.2, 'recoil', { dur: .15 }]], { T: L.T }); cara(d, L.T, { expr: 'shock', mouth: 'scream' });
  const gone = poof(d, tw('weg', 2) - .05, L.T, 0, 1); orbit(V(DT0 + 16, 3.8, -48), lerp(17, 15, L.k), PI * .9 + .5, .1, 44); sh(V(DT0 + 16, 0, -48), 30); }, [[0, 'gasp', .5], [tw('weg', 2) - tw('dann', 1) - .05, 'poof', .9]]);
// 6 «Sofort.» golpe: el montoncito de polvo humea en la acera; el saco cae al lado
shot(tw('Sofort', 2), 'F', 'punch', L => { city('dusk'); show(PILES[0], DT0 + 16, 0, -48, 0, 1.1); dust(V(DT0 + 16, 0, -48), L.t0 - .3, L.T, 8, .5); badge('red', 'SOFORT!', W / 2, H * .2, (L.lt - .1) * 3);
  orbit(V(DT0 + 16, 1.4, -48), lerp(9, 7, easeOut(L.k)), -1.2, .35, 42); sh(V(DT0 + 16, 0, -48), 20); }, [[0, 'boom', .7], [.2, 'sand', .4]]);
// 7 «Kein Blitz, kein Geräusch.»: travelling lateral: los peatones se quedan quietos mirando el polvo, en silencio
shot(tw('Kein', 1), 'S', null, L => { city('dusk'); show(PILES[0], DT0 + 16, 0, -48, 0, 1.1); const a = put(XT[3], DT0 + 12, 0, -52, -.6), b = put(K[1], DT0 + 19.5, 0, -53, .5), c = put(XT[1], DT0 + 13, 0, -43, PI - .6);
  [a, b, c].forEach((x, i) => { actuar(x, L.lt + i * .2, [[0, i === 1 ? 'hands_face' : 'shock']], { T: L.T }); cara(x, L.T + i, { expr: 'shock', mouth: 'o' }); });
  cm([DT0 + 21, 5, -34, DT0 + 15, 2.5, -49, 48], [DT0 + 20, 5, -31, DT0 + 15, 2.5, -49, 48], L.k); sh(V(DT0 + 16, 0, -48), 30); }, [[0, 'silence_hit', .5], [.6, 'wind', .3], [1.2, 'heartbeat', .4]]);
// 8 «Nur ein kleiner Haufen Staub,»: macro: los granitos de polvo aún resbalan por el montón
shot(tw('Nur', 1), 'Z', null, L => { city('dusk'); show(PILES[0], DT0 + 16, 0, -48, L.T * .05, 1.1); GRAIN.forEach((g, i) => { if (i > 14) return; const r = RNG(i + 4), k = (L.T * .5 + r()) % 1, a = r() * 6.283; g.visible = true; g.position.set(DT0 + 16 + Math.cos(a) * (.2 + k * 1.4), 1.4 - k * 1.3, -48 + Math.sin(a) * (.2 + k * 1.4)); });
  orbit(V(DT0 + 16, .8, -48), lerp(4.2, 3.4, L.k), -.3 + L.k * .4, .12, 40); sh(V(DT0 + 16, 0, -48), 12); }, [[0, 'sand', .6], [.8, 'sand', .4]]);
// 9 «genau da, wo du gerade noch standest.»: plano cenital: la silueta de tiza alrededor del montón; la gente da un rodeo
shot(tw('genau', 1), 'W', null, L => { city('dusk'); show(PILES[0], DT0 + 16, 0, -48, 0, 1.1); for (let i = 0; i < 3; i++) { const c = BG[i]; const z = -58 + i * 3 + L.lt * 4; put(c, DT0 + 13 + (Math.abs(z + 48) < 4 ? -2.5 : 0), 0, z, 0); applyPose(c, walkP(L.T * 1.4 + i)); cara(c, L.T + i, { expr: 'worried', mouth: 'flat' }); }
  cm([DT0 + 16, 22, -40, DT0 + 16, 0, -48.5, 46], [DT0 + 16, 17, -44, DT0 + 16, 0, -48.5, 46], L.k); sh(V(DT0 + 16, 0, -48), 30); }, [[0, 'whoosh', .4], [.4, 'footsteps', .4], [1.0, 'footsteps', .3]]);
// 10 «Als ich acht war,» (recuerdo, sepia): el pequeño capitán con toalla de capa en el jardín de casa
shot(tw('Als', 1), 'I', null, L => { town(); sepia(); const k = put(klein, 16, 0, 92, PI / 2 + .3); actuar(k, L.lt, [[0, 'idle'], [.3, 'cheer', { dur: .4 }]], { T: L.T }); grin(k, L.T); k.props.wind = .9;
  badge('num', '8 JAHRE', W / 2, H * .2, (L.lt - .2) * 3); orbit(V(16, 2.6, 92), lerp(11, 9, L.k), PI / 2 + .1, .15, 44); sh(V(14, 0, 94), 30); }, [[0, 'magic', .5], [.3, 'birds', .4], [.8, 'ding', .4]]);
// 11 «haben mich die Wespen genervt.»: una nube de avispas le rodea la cabeza; manotea y pone mala cara
shot(tw('haben', 1), 'C', null, L => { town(); sepia(); const k = put(klein, 16, 0, 92, PI / 2 + .3); actuar(k, L.lt, [[0, { aLx: 2 + Math.sin(L.T * 14) * .6, aRx: 2 - Math.sin(L.T * 14) * .6, aLe: 1, aRe: 1, headY: Math.sin(L.T * 9) * .3 }]], { T: L.T }); cara(k, L.T, { expr: 'angry', mouth: 'grimace' });
  wasps(hp(k), L.T, 12, 2.2, { s: 1.3 }); onFace(k, 9, -.6, -.2 + L.k * .3, 42); sh(V(16, 0, 92), 20); }, [[0, 'buzz', .8], [.6, 'swat', .5], [1.1, 'buzz', .6]]);
// 12 «Seitdem gibt es hier keine einzige Wespe mehr.» destello: cierra los ojos, las avispas se vuelven polvo y caen; el cartel «0 WESPEN»
shot(tw('Seitdem'), 'F', null, L => { town(); sepia(); const k = put(klein, 16, 0, 92, PI / 2 + .3); actuar(k, L.lt, [[0, 'cross']], { T: L.T }); cara(k, L.T, { eyes: L.lt < .6 ? 'closed' : 'happy', mouth: 'smirk' });
  if (L.lt < .4) wasps(hp(k), L.T, 12, 2.6, { s: .9 }); else GRAIN.forEach((g, i) => { if (i > 11) return; const r = RNG(i * 3 + 1), t = L.lt - .4; g.visible = true; const a = r() * 6.283; g.position.set(16 + Math.cos(a) * 2.4, Math.max(.1, 5 - t * t * 9), 92 + Math.sin(a) * 2.4); });
  badge('num', '0 WESPEN', W / 2, H * .2, (L.lt - .8) * 3); orbit(V(16, 3, 92), lerp(9, 11, L.k), PI / 2 + .5, .12, 44); sh(V(16, 0, 92), 20); }, [[0, 'magic', .5], [.4, 'poof', .6], [.9, 'ding', .5], [1.4, 'birds', .3]]);
// 13 «Dabei war ich früher ein Held.»: hace años, en la plaza: el capitán con traje de héroe saluda en un desfile; confeti
shot(tw('Dabei', 1), 'W', null, L => { town(); const c = put(ich, -6, 0, -20, 0); actuar(c, L.lt, [[0, 'wave']], { T: L.T }); grin(c, L.T); confRain(V(-6, 0, -20), L.T, 50, 24, 20, 18);
  folk(-6, -20, 12, 7, 16, L.T, 13, { mode: 'cheer' }); orbit(V(-6, 4.6, -20), lerp(14, 11, L.k), .3 - L.k * .4, .1, 46); sh(V(-6, 0, -20), 30); }, [[0, 'cheer', .7], [.4, 'confetti', .4], [.9, 'fanfare', .4]]);
// 14 «In der Liga der Supers.»: grúa en la sala de la Liga: el letrero, la mesa redonda y los cinco sentados
const LIGA_SEATS = (L, ex = {}) => { const ppl = [stahl, zack, ich, funkel, alles]; ppl.forEach((c, i) => { const a = PI + (i - 2) * .5; const x = TRX + Math.sin(a) * 11.5, z = -2 + Math.cos(a) * 11.5; put(c, x, 1.75, z, a + PI); actuar(c, L.lt + i * .3, [[0, { ...SIT, ...(ex[i] || {}) }]], { T: L.T + i }); c.props.wind = .1; }); return ppl; };
shot(tw('In', 2), 'R', null, L => { use('TR'); inside(.9, 40); const ppl = LIGA_SEATS(L); ppl.forEach((c, i) => cara(c, L.T + i, { expr: 'smile' }));
  cm([TRX + 6, 17, 26, TRX, 4, -9, 50], [TRX + 2, 14, 22, TRX, 4, -10, 48], L.k); sh(V(TRX, 0, -2), 40); }, [[0, 'swoosh', .6], [.4, 'hum', .4], [1.0, 'chair', .3]]);
// 15 «Wir waren fünf.»: los cinco posan en fila sobre la azotea al atardecer, capas al viento; «5»
shot(tw('Wir'), 'Z', null, L => { city('dusk'); const ppl = [stahl, zack, ich, funkel, alles]; ppl.forEach((c, i) => { put(c, DT0 - 8 + i * 4, 0, -150 - Math.abs(i - 2) * 1.2, 0); actuar(c, L.lt + i * .2, [[0, ['fists', 'point', 'cross', 'fists', 'wave'][i]]], { T: L.T + i }); c.props.wind = 1.4; grin(c, L.T + i); });
  badge('num', '5', W / 2, H * .18, (L.lt - .3) * 3, 1, 1.3); orbit(V(DT0, 4.4, -151), lerp(20, 17, L.k), -.15 + L.k * .3, .06, 44); sh(V(DT0, 0, -150), 40); }, [[0, 'whoosh', .5], [.4, 'ding', .5], [.6, 'wind', .4]]);
// 16 «Stahlpranke hob ganze Fähren hoch.»: en el río, Stahlpranke levanta un ferry entero por encima de la cabeza
shot(tw('Stahlpranke', 1), 'C', null, L => { use('BR'); day(); const up = easeOut(clamp(L.lt / .8)); const s = hover(stahl, BRX, 4 + up * 6, -40, .2, L.T, { pose: { aLx: 3.0, aRx: 3.0, aLz: .3, aRz: .3, aLe: .2, aRe: .2 }, a: .2 }); effort(s, L.T);
  POST.push(() => { const h = hp(s); show(FERRY, h.x, h.y + 2.4, h.z, .2 + PI / 2, .6); }); splashW(V(BRX, -1.5, -40), L.T, up);
  orbit(V(BRX, 9 + up * 5, -40), lerp(46, 40, L.k), .5, .02, 50); sh(V(BRX, 0, -40), 50); }, [[0, 'splash', .7], [.3, 'strain', .5], [.8, 'water_drip', .4]]);
// 17 «Zack war der Schnellste der Welt.»: Zack cruza la avenida como un rayo dejando estela; los coches se quedan atrás
shot(tw('Zack', 1), 'W', null, L => { city(); const z = 40 - L.lt * 60; const c = put(zack, DT0 - 3, 0, z, PI); applyPose(c, runPoseL(L.T * 4)); c.props.wind = 2; grin(c, L.T);
  POST.push(() => trailOn(hp(c).add(V(0, -1.5, 0)), L.T, V(0, 0, -1), 8, 1.6)); confRain(V(DT0 - 3, 0, z + 4), L.T, 0);
  cam([DT0 + 3, 3, z - 16], [DT0 - 3, 3.4, z], 44); sh(V(DT0, 0, z), 30); }, [[0, 'whoosh_big', .8], [.4, 'wind', .5], [.9, 'car_pass', .3]]);
// 18 «Funkel schoss Laser aus den Augen.»: Funkel, en el aire, dispara dos láseres a una diana en la azotea; chispas
shot(tw('Funkel', 1), 'F', null, L => { city(); const f = hover(funkel, DT0 + 2, 12, -60, -.7, L.T, { pose: { aLz: .4, aRz: .4 } }); cara(f, L.T, { expr: 'determined', mouth: 'grimace' });
  const tgt = V(DT0 - 12, 6, -66); eyeLaser(f, tgt, L.T); sparks(tgt, L.t0 + ((L.lt * 3) | 0) / 3, L.T, 14, .6); GLOW.position.copy(tgt); GLOW.color.setRGB(1, .3, .2); GLOW.intensity = 60;
  cm([DT0 + 10, 13, -46, DT0 - 2, 10, -64, 48], [DT0 + 8, 12.5, -48, DT0 - 3, 10, -64, 46], L.k); sh(V(DT0, 0, -62), 30); }, [[0, 'laser', .8], [.4, 'sizzle', .5], [.9, 'laser', .5]]);
// 19 «Und Herr Alleskann»: el amable Herr Alleskann sonríe y toca un coche aparcado con un dedo
shot(tw('Und', 2), 'S', null, L => { city(); const a = put(alles, DT0 + 5, 0, -84, -PI / 2 + .3); actuar(a, L.lt, [[0, 'idle'], [.3, 'point', { dur: .4 }]], { T: L.T }); grin(a, L.T);
  orbit(V(DT0 + 3, 4.4, -84), lerp(14, 12, L.k), -.5 + L.k * .2, .1, 44); sh(V(DT0 + 3, 0, -84), 30); }, [[0, 'whoosh', .4], [.5, 'magic', .4]]);
// 20 «verwandelte alles in etwas anderes.»: ¡puf!: el coche se convierte en un pato de goma gigante; él se ríe
shot(tw('verwandelte'), 'C', 'punch', L => { city(); const a = put(alles, DT0 + 5, 0, -84, -PI / 2 + .3); actuar(a, L.lt, [[0, 'point'], [.6, 'cheer', { dur: .3 }]], { T: L.T }); laughF(a, L.T);
  const k = clamp((L.lt - .15) / .25); show(DUCK, DT0 + 1, 0, -84, PI / 2, .1 + k * .9); sparks(V(DT0 + 1, 3, -84), L.t0 + .15, L.T, 14, .8); confetti(V(DT0 + 1, -2, -84), L.t0 + .15, L.T, 30, .6);
  orbit(V(DT0 + 3, 4.4, -84), lerp(24, 21, L.k), -.6, .12, 46); sh(V(DT0 + 2, 0, -84), 30); }, [[0, 'magic', .7], [.2, 'squeak', .7], [.8, 'laugh', .4]]);
// 21 «Und ich?»: el capitán en la sala de la Liga, apoyado en la pared, se encoge de hombros, aburrido
shot(tw('Und', 3), 'Z', null, L => { use('TR'); inside(.9, 40); const c = put(ich, TRX + 18, 0, -12, -.8); actuar(c, L.lt, [[0, 'cross'], [.2, 'shrug', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'bored', mouth: 'flat' });
  onFace(c, 7, -.3, .2, 40, L.k, 6); sh(V(TRX + 18, 0, -12), 20); }, [[0, 'whoosh', .4], [.3, 'sigh', .5]]);
// 22 «Ich stand auf jedem Foto in der Mitte.»: foto de grupo en la plaza: los cinco posan, él en el centro; flashes de los fotógrafos
shot(tw('Ich', 1), 'F', null, L => { town(); const ppl = [stahl, zack, ich, funkel, alles]; ppl.forEach((c, i) => { put(c, -14 + i * 4, 0, -30 - Math.abs(i - 2) * .8, 0); actuar(c, L.lt, [[0, ['fists', 'point', 'cross', 'wave', 'cheer'][i]]], { T: L.T + i }); grin(c, L.T + i); });
  if (((L.lt * 4) | 0) % 2 === 0) grade.uniforms.flash.value = .5 * Math.max(0, 1 - ((L.lt * 4) % 1) * 4); for (let i = 0; i < 4; i++) { const c = BG[i], sx = i % 2 ? 1 : -1; put(c, -6 + sx * (10 + (i >> 1) * 3), 0, -20 - (i >> 1) * 2, faceTo(V(-6 + sx * 10, 0, -20), V(-6, 0, -30))); actuar(c, L.lt, [[0, 'phone_look']], { T: L.T + i }); cara(c, L.T + i, { expr: 'happy', mouth: 'smile' }); }
  badge('tag', 'MITTE', W / 2, H * .2, (L.lt - .8) * 3); cm([-6, 4.6, -6, -6, 4, -30, 42], [-6, 4.4, -10, -6, 4, -30, 40], L.k); sh(V(-6, 0, -28), 30); }, [[0, 'camera_shutter', .7], [.25, 'camera_shutter', .6], [.5, 'camera_shutter', .6], [.9, 'cheer', .4]]);
// 23 «Aber nur, weil ich der Stärkste war.»: en la pantalla de la Liga, la barra de fuerza del capitán se sale del gráfico
shot(tw('Aber', 1), 'W', null, L => { use('TR'); inside(.9, 40); const p = show(PANEL, TRX - 14, 0, -16, .5); p.position.y = 2; const k = clamp(L.lt / 1.2);
  tvDraw(p.userData.scr, 'bars' + Math.round(k * 20), (c, w, h) => { c.fillStyle = '#0e1430'; c.fillRect(0, 0, w, h); txt2(c, 'STÄRKE', w / 2, 34, 36, '#ffd23f'); const N = ['STAHL', 'ZACK', 'FUNKEL', 'ALLES', 'SOFORT'], V_ = [.55, .4, .5, .45, 1.6], C_ = ['#ff8a1a', '#1a6aff', '#d8202a', '#7ad8b8', '#8a3ad8'];
    N.forEach((n, i) => { const y = 80 + i * 48; txt2(c, n, 70, y + 14, 22, '#ffffff'); c.fillStyle = C_[i]; c.fillRect(130, y, Math.min(w - 140, (w - 160) * V_[i] * k), 30); }); });
  const c = put(ich, TRX - 6, 0, -8, .4); actuar(c, L.lt, [[0, 'cross']], { T: L.T }); smug(c, L.T);
  cm([TRX + 2, 7.5, 12, TRX - 9, 5.5, -13, 50], [TRX + 1, 7.5, 9, TRX - 9, 5.5, -13, 48], L.k); sh(V(TRX - 10, 0, -12), 30); }, [[0, 'whoosh', .4], [.2, 'beep', .4], [.9, 'power_up', .6]]);
// 24 «Und weil sie Angst hatten, was ich sonst tun würde.»: él en primer término, aburrido; detrás los cuatro cuchichean y sudan
shot(tw('Und', 4), 'S', null, L => { use('TR'); inside(.9, 40); const c = put(ich, TRX + 2, 0, 17, PI * .05); actuar(c, L.lt, [[0, 'cross']], { T: L.T }); cara(c, L.T, { expr: 'bored', mouth: 'flat' });
  LIGA.forEach((h, i) => { put(h, TRX - 6 + i * 3.6, 0, 9.5 - (i % 2), faceTo(V(TRX - 6 + i * 3.6, 0, 9), V(TRX + 2, 0, 17)) * .6); actuar(h, L.lt + i * .2, [[0, i % 2 ? 'hug_self' : 'lean_in']], { T: L.T + i }); cara(h, L.T + i, { expr: 'worried', mouth: 'wavy' }); if (i === 1) sweat(h, L.T); });
  cm([TRX + 4, 6.5, 30, TRX, 4.5, 12, 46], [TRX + 2, 6, 28, TRX - 1, 4.5, 11, 44], L.k); sh(V(TRX, 0, 0), 30); }, [[0, 'whoosh', .4], [.5, 'whisper', .5], [1.3, 'gulp', .5]]);
// ---------- b: Granitor, la batalla, el capitán no hace nada (39,8 – 63,3 s) ----------
const GZ = -120;   // el gigante avanza por la avenida
const giant = (L, x, z, ry = 0, o = {}) => { const g = put(gran, x, 0, z, ry); const ph = o.walk === false ? 0 : L.T * .9; actuar(g, L.lt, [[0, o.pose || { lLx: Math.sin(ph * 2) * .45, lRx: -Math.sin(ph * 2) * .45, lLk: Math.max(0, -Math.cos(ph * 2)) * .4, lRk: Math.max(0, Math.cos(ph * 2)) * .4, aLx: -Math.sin(ph * 2) * .35, aRx: Math.sin(ph * 2) * .35, aLz: .2, aRz: .2 }]], { T: L.T }); cara(g, L.T, { expr: o.expr || 'angry', mouth: o.mouth || 'grimace' }); return g; };
const chaos = (L, cx, cz) => { smoke(V(cx, 0, cz), L.T, 3); fire(V(cx + 6, 0, cz + 4), L.T, 1.4, 6); };

// 25 «Dann kam Granitor.» (zoom lento): un pie de piedra gigantesco cae en la avenida; los coches saltan; polvo
shot(tw('Dann', 1), 'C', 'slow', L => { city(); const g = giant(L, DT0, GZ, 0, { pose: { lRx: .6 - easeIn(clamp(L.lt / .7)) * .6, lRk: .4 - clamp(L.lt / .7) * .4, aLz: .3, aRz: .3 } });
  dust(V(DT0 + 4, 0, GZ + 6), L.t0 + .7, L.T, 16, 3); DT.CARS.slice(4, 8).forEach((c, i) => { const j = L.lt > .7 ? Math.max(0, Math.sin((L.lt - .7) * 8)) * 1.6 / (1 + (L.lt - .7) * 3) : 0; c.position.y = j * (1 + i * .2); });
  cm([DT0 + 2, 3, GZ + 80, DT0 + 2, 18, GZ, 56], [DT0 + 2, 4, GZ + 70, DT0 + 2, 22, GZ, 56], L.k); sh(V(DT0, 0, GZ + 10), 60); }, [[0, 'rumble', .7], [.7, 'boom', .9], [.75, 'car_alarm', .5], [1.0, 'debris', .5]]);
// 26 «Ein Riese, so groß wie ein Hochhaus.»: contrapicado: Granitor al lado de un rascacielos, igual de alto; gente corriendo
shot(tw('Ein', 1), 'W', null, L => { city(); const g = giant(L, DT0, GZ + L.lt * 3, 0); runners(L.T, L.lt, GZ + 30, 10, 6, { x: DT0, w: 16, dir: -1, sp: 8 });
  badge('tag', 'HOCHHAUS', W * .3, H * .22, (L.lt - .8) * 3); cm([DT0 + 1, 2, GZ + 74, DT0, 28, GZ, 66], [DT0 + 1, 2, GZ + 68, DT0, 31, GZ, 64], L.k); sh(V(DT0, 0, GZ + 20), 80); }, [[0, 'rumble', .6], [.3, 'crowd_scream', .6], [1.0, 'boom', .5]]);
// 27 «Stahlpranke hielt die Brücke fest.»: en el río, el gigante ha partido el puente de una patada; Stahlpranke sostiene el tramo roto
shot(tw('Stahlpranke', 2), 'F', null, L => { use('BR'); day(); const g = giant(L, BRX - 4, -70, .2, { pose: { lRx: -.6, lRk: .2, aLz: .4, aRz: .4 } }); g.root.position.y = -4;
  const s = hover(stahl, BRX, -1.2, -18, PI * .3, L.T, { pose: { aLx: 3.0, aRx: 3.0, aLz: .25, aRz: .25, aLe: .3, aRe: .3, lLx: .4, lLk: .6 }, a: .1 }); effort(s, L.T); sweat(s, L.T);
  POST.push(() => { const h = hp(stahl); show(CHUNK, h.x, h.y + 2.4, h.z, 0, 1).rotation.z = .08 + Math.sin(L.T * 3) * .03; }); for (let i = 0; i < 3; i++) { const c = BG[i]; put(c, BRX - 4 + i * 4, 9.2 + flyY(L.T, .1), -18, .6); actuar(c, L.lt, [[0, 'hands_head']], { T: L.T + i }); cara(c, L.T + i, { expr: 'shock', mouth: 'scream' }); }
  splashW(V(BRX, -1.5, -18), L.T, .6); cm([BRX + 30, 4, -36, BRX, 6, -20, 54], [BRX + 26, 5, -34, BRX, 6, -20, 52], L.k); sh(V(BRX, 0, -10), 60); }, [[0, 'crash', .8], [.2, 'strain', .6], [.6, 'concrete_creak', .5], [1.2, 'splash', .4]]);
// 28 «Zack zog die Leute aus den Autos.»: Zack pasa como un rayo y deja a la gente a salvo en la acera; estela azul
shot(tw('Zack', 2), 'W', null, L => { city(); const x = DT0 - 8 + ((L.lt * 1.6) % 1) * 16; const z = GZ + 50; const c = put(zack, x, 0, z + Math.sin(L.T * 6) * 2, PI / 2); applyPose(c, runPoseL(L.T * 4)); grin(c, L.T); c.props.wind = 2;
  POST.push(() => trailOn(hp(c).add(V(0, -1.5, 0)), L.T, V(1, 0, 0), 8, 1.5)); for (let i = 0; i < 5; i++) { const p = BG[i]; const done = L.lt > .25 + i * .2; put(p, done ? DT0 + 14 + i * 1.2 : DT0 - 7.6 + (i % 2) * 15, done ? 0 : 1.2, z - 8 + i * 4, done ? -PI / 2 : 0); actuar(p, L.lt, [[0, done ? 'shock' : 'cower']], { T: L.T + i }); cara(p, L.T + i, { expr: 'shock', mouth: 'o' }); }
  giant(L, DT0, GZ - 10, 0); orbit(V(DT0, 3.5, z), lerp(24, 22, L.k), .6, .12, 50); sh(V(DT0, 0, z), 40); }, [[0, 'whoosh_big', .7], [.35, 'whoosh', .5], [.7, 'whoosh', .5], [1.1, 'whoosh', .4]]);
// 29 «Funkel schoss ihm Laser in die Brust,»: Funkel en el aire dispara los dos láseres al pecho del gigante
shot(tw('Funkel', 2), 'C', 'punch', L => { city(); const g = giant(L, DT0, GZ, 0, { walk: false, pose: { lean: -.12, aLx: .9, aRx: .9, aLz: .6, aRz: .6, aLe: 1.3, aRe: 1.3 }, expr: 'shock', mouth: 'scream' });
  const f = hover(funkel, DT0 + 6, 26, GZ + 40, PI + .2, L.T, { pose: { aLz: .4, aRz: .4, lean: .2 } }); cara(f, L.T, { expr: 'determined', mouth: 'grimace' });
  const tgt = V(DT0, 30, GZ + 5); eyeLaser(f, tgt, L.T, 1.6); sparks(tgt, L.t0 + ((L.lt * 4) | 0) / 4, L.T, 14, 1.4); GLOW.position.copy(tgt); GLOW.color.setRGB(1, .3, .2); GLOW.intensity = 200;
  cm([DT0 + 14, 30, GZ + 66, DT0 + 2, 28, GZ + 10, 54], [DT0 + 12, 30, GZ + 60, DT0 + 2, 28, GZ + 10, 52], L.k); sh(V(DT0, 0, GZ + 20), 80); }, [[0, 'laser', .9], [.3, 'sizzle', .6], [.9, 'laser', .6]]);
// 30 «bis seine Rüstung rot glühte.»: primer plano del pecho de piedra: se pone al rojo vivo, humea
shot(tw('bis', 1), 'Z', null, L => { city(); const g = giant(L, DT0, GZ, 0, { walk: false, pose: { lean: -.12, aLx: .9, aRx: .9, aLz: .6, aRz: .6, aLe: 1.3, aRe: 1.3 }, expr: 'shock', mouth: 'scream' });
  const k = clamp(L.lt / 1.2); gran.props.armor.forEach(m => { m.emissive.setRGB(1, .2, .05); m.emissiveIntensity = k * 1.4; }); gran.props.crack.emissiveIntensity = 1.2 + k * 3; smoke(V(DT0, 26, GZ + 8), L.T, 2.4);
  badge('red', 'ROT!', W / 2, H * .2, (L.lt - .9) * 3); cm([DT0 + 8, 26, GZ + 52, DT0, 28, GZ + 4, 48], [DT0 + 6, 27, GZ + 44, DT0, 28, GZ + 4, 46], L.k); sh(V(DT0, 0, GZ + 10), 60); }, [[0, 'sizzle', .8], [.5, 'heat_hiss', .6], [1.0, 'growl', .6]]);
// 31 «Und ich?»: el capitán flota tumbado más arriba, con los brazos cruzados, mirando de lado
shot(tw('Und', 5), 'S', null, L => { city(); const c = hover(ich, DT0 - 16, 40, GZ + 30, .6, L.T, { pose: { ...CROSS, lLx: .3, lLk: .5 } }); cara(c, L.T, { expr: 'bored', mouth: 'flat' }); giant(L, DT0, GZ, 0);
  onFace(c, 9, -.4, .3, 42); sh(V(DT0 - 16, 0, GZ + 30), 30); }, [[0, 'whoosh', .4], [.3, 'wind', .5], [.8, 'yawn', .5]]);
// 32 «Ich schwebte nur da und schaute zu.»: plano general: el capitán, pequeño, flota quieto en primer término; detrás, la batalla (láser, humo, el gigante)
shot(tw('Ich', 2), 'W', null, L => { city(); const c = hover(ich, DT0 - 10, 34, GZ + 60, PI + .2, L.T, { pose: CROSS }); cara(c, L.T, { expr: 'bored', mouth: 'flat' });
  const g = giant(L, DT0, GZ, 0, { pose: { lean: -.12, aLx: .9, aRx: .9, aLz: .6, aRz: .6, aLe: 1.3, aRe: 1.3 } }); const f = hover(funkel, DT0 + 10, 30, GZ + 34, PI + .3, L.T); eyeLaser(f, V(DT0, 30, GZ + 5), L.T, 1.4); chaos(L, DT0 + 6, GZ + 20);
  cm([DT0 - 16, 38, GZ + 76, DT0 - 4, 30, GZ + 30, 54], [DT0 - 14, 37, GZ + 72, DT0 - 4, 30, GZ + 30, 52], L.k); sh(V(DT0, 0, GZ + 30), 80); }, [[0, 'laser', .5], [.4, 'explosion', .5], [1.1, 'wind', .4]]);
// 33 «Dabei hätte ich es in einer Sekunde beenden können.» (zoom lento): levanta un dedo hacia el gigante; «1 SEKUNDE»
shot(tw('Dabei', 2), 'C', 'slow', L => { city(); const c = hover(ich, DT0 - 10, 34, GZ + 60, PI - .1, L.T, { pose: { aRx: 1.7, aRe: .1, aRz: -.1, aLz: .2 } }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); giant(L, DT0, GZ, 0);
  badge('num', '1 SEKUNDE', W / 2, H * .17, (L.lt - .9) * 3); cm([DT0 - 18, 36, GZ + 74, DT0 - 10, 37, GZ + 58, 46], [DT0 - 14, 36.5, GZ + 70, DT0 - 10, 37, GZ + 58, 40], L.k); sh(V(DT0 - 10, 0, GZ + 60), 30); }, [[0, 'tick', .6], [.5, 'tick', .5], [1.0, 'tick', .5]]);
// 34 «Das ist wörtlich mein Name.»: primer plano con sonrisa torcida; el letrero dorado «SOFORT»
shot(tw('Das', 1), 'C', 'punch', L => { city(); const c = hover(ich, DT0 - 10, 34, GZ + 60, PI - .3, L.T, { pose: { aLz: .3, aRz: .3 } }); talk(c, L.T, L.t0, L.t1, 'smug');
  badge('gold', 'SOFORT', W / 2, H * .17, (L.lt - .6) * 3, 1, 1.2); onFace(c, 7, -.4, -.25, 40); sh(V(DT0 - 10, 0, GZ + 60), 30); }, [[0, 'impact', .5], [.6, 'ding', .5]]);
// 35 «Ich hatte nur keine Lust.»: tumbado en el aire con las manos detrás de la cabeza; zetas
shot(tw('Ich', 3), 'R', null, L => { city(); const c = put(ich, DT0 - 10, 34 + flyY(L.T, .3), GZ + 60, PI - .3); c.root.rotation.x = -1.2; actuar(c, L.lt, [[0, { aLx: 2.8, aRx: 2.8, aLe: 2.4, aRe: 2.4, lLx: .3, lRx: -.1, lRk: .6 }]], { T: L.T }); c.props.wind = .3;
  cara(c, L.T, { eyes: 'closed', mouth: 'smirk' }); POST.push(() => { const h = hp(c); ZZZ.visible = true; const k = (L.T * .6) % 1; ZZZ.position.copy(h).add(V(1 + k, 2 + k * 2, 0)); ZZZ.scale.setScalar(.8 + k); ZZZ.material.opacity = 1 - k; ZZZ.lookAt(camera.position); });
  orbit(V(DT0 - 10, 34.5, GZ + 60), lerp(12, 10, L.k), PI - .9, .45, 44); sh(V(DT0 - 10, 0, GZ + 60), 30); }, [[0, 'whoosh', .4], [.3, 'snore', .6]]);
// 36 «Deshalb dauerte es sieben Stunden.»: lapso de tiempo: el cielo pasa de día a atardecer; los héroes, agotados; «7 STUNDEN»
shot(tw('Deshalb'), 'F', null, L => { use('DT'); const k = clamp(L.lt / 1.6); if (k < .5) day(); else dusk(); const g = giant(L, DT0, GZ, 0, { pose: { lLx: Math.sin(L.T * 5) * .3, lRx: -Math.sin(L.T * 5) * .3, aLx: Math.sin(L.T * 6) * 1.2, aRx: -Math.sin(L.T * 6) * 1.2, aLz: .4, aRz: .4 } });
  const s = put(stahl, DT0 - 6, 0, GZ + 40, PI * .9), z = put(zack, DT0 + 5, 0, GZ + 42, PI); [s, z].forEach((h, i) => { actuar(h, L.lt, [[0, { lean: .5, aLx: .6, aRx: .6, aLe: .3, aRe: .3, crouch: .3, lLk: .4, lRk: .4 }]], { T: L.T + i }); sweat(h, L.T); cara(h, L.T + i, { expr: 'sad', mouth: 'open_smile' }); });
  badge('num', (1 + Math.floor(k * 6.99)) + ' STUNDEN', W / 2, H * .17, (L.lt) * 3); cm([DT0, 6, GZ + 64, DT0, 10, GZ + 20, 56], [DT0 + 2, 7, GZ + 60, DT0, 12, GZ + 20, 54], L.k); sh(V(DT0, 0, GZ + 30), 60); }, [[0, 'clock_fast', .7], [.8, 'clock_fast', .6], [1.4, 'ding', .5]]);
// 37 «Granitor entkam,»: el gigante se aleja entre el humo, de espaldas, hacia el horizonte
shot(tw('Granitor', 2), 'W', null, L => { city('dusk'); const g = giant(L, DT0, GZ - 40 - L.lt * 10, PI); smoke(V(DT0 - 4, 0, GZ - 10), L.T, 4);
  cm([DT0 + 4, 4, GZ + 40, DT0, 20, GZ - 40, 54], [DT0 + 3, 4, GZ + 36, DT0, 22, GZ - 50, 52], L.k); sh(V(DT0, 0, GZ - 30), 80); }, [[0, 'rumble', .6], [.4, 'boom', .4], [.9, 'boom', .3]]);
// 38 «und die halbe Stadt war kaputt.»: grúa sobre la avenida destrozada: coches volcados, fuego, escombros; «½ STADT»
shot(tw('und', 2), 'Z', null, L => { city('dusk'); chaos(L, DT0 - 4, GZ + 20); DEBRIS.forEach((d, i) => { const r = RNG(i * 7 + 3); d.visible = true; d.position.set(DT0 - 10 + r() * 20, .5, GZ + 6 + r() * 40); d.rotation.set(r() * 2, r() * 3, r()); });
  DT.CARS.slice(4, 8).forEach((c, i) => { c.rotation.z = i % 2 ? PI : .5; c.position.y = i % 2 ? 2.6 : .4; }); POST.push(() => DT.CARS.slice(4, 8).forEach((c, i) => { }));
  badge('red', '½ STADT KAPUTT', W / 2, H * .17, (L.lt - .4) * 3); cm([DT0 + 10, 16, GZ + 70, DT0, 4, GZ + 20, 52], [DT0 + 8, 26, GZ + 64, DT0, 4, GZ + 20, 52], L.k); sh(V(DT0, 0, GZ + 30), 60); }, [[0, 'fire', .6], [.4, 'siren', .5], [1.0, 'debris', .4]]);
// ---------- c: la noche en la torre, el polvo, la Liga der Größe, borra a los criminales (63,3 – 101,1 s) ----------
// sala de la Liga de noche: el capitán junto al ventanal, los cuatro frente a él (lado +z de la mesa)
const tower = () => { use('TR'); inside(.8, 30); TR.T.position.set(0, 0, -12); };
const HX = [TRX - 9, TRX - 3, TRX + 3, TRX + 9];   // posiciones de los cuatro (z = 12)
const ichT = (L, ry = PI, ex = {}) => { const c = put(ich, TRX, 0, 13, ry); actuar(c, L.lt, [[0, ex.pose || 'cross']], { T: L.T }); return c; };
const heroesT = (L, poses = [], exprs = []) => LIGA.map((h, i) => { put(h, HX[i], 0, 4 - Math.abs(i - 1.5) * .8, faceTo(V(HX[i], 0, 4), V(TRX, 0, 13))); actuar(h, L.lt + i * .2, [[0, poses[i] || 'idle']], { T: L.T + i }); cara(h, L.T + i, { expr: exprs[i] || 'angry', mouth: 'frown' }); return h; });

// 39 «In der Nacht nannte mich Zack einen Feigling.»: Zack le señala, a gritos; bocadillo «FEIGLING!»
shot(tw('In', 3), 'I', null, L => { tower(); heroesT(L, ['cross', 'point', 'cross', 'idle'], ['angry', 'shout', 'angry', 'sad']); talk(zack, L.T, tw('nannte'), L.t1, 'shout'); ichT(L);
  bubble(zack, 'FEIGLING!', (L.lt - .9) * 3); onFace(zack, 9, -.5, .25, 42); sh(V(TRX, 0, 8), 30); }, [[0, 'night_ambience', .5], [.5, 'shout', .5], [1.3, 'impact', .4]]);
// 40 «Stahlpranke wollte meinen Umhang zurück.»: Stahlpranke tira de la capa del capitán con su puño de acero
shot(tw('Stahlpranke', 3), 'S', null, L => { tower(); const c = ichT(L, PI * .8); cara(c, L.T, { expr: 'bored', mouth: 'flat' }); const s = put(stahl, TRX - 3, 0, 10, faceTo(V(TRX - 3, 0, 10), V(TRX, 0, 13))); actuar(s, L.lt, [[0, 'idle'], [.3, { aRx: 1.4, aRe: .3, lean: -.2, aLz: .3 }, { dur: .3 }]], { T: L.T }); cara(s, L.T, { expr: 'angry', mouth: 'grimace' });
  c.props.wind = 1.6; ich.props.cape.rotation.y = -.4 * clamp((L.lt - .3) * 3); badge('tag', 'UMHANG ZURÜCK!', W / 2, H * .2, (L.lt - .5) * 3);
  orbit(V(TRX - 1.5, 4.4, 11.5), lerp(13, 11, L.k), -1.2, .12, 44); sh(V(TRX, 0, 11), 20); }, [[0, 'whoosh', .4], [.4, 'cloth_tug', .7], [.9, 'grunt', .4]]);
// 41 «Und Herr Alleskann, der Netteste von allen,»: Herr Alleskann, triste y amable, se quita las gafas
shot(tw('Und', 6), 'W', null, L => { tower(); heroesT(L, ['cross', 'cross', 'cross', 'idle'], ['angry', 'angry', 'angry', 'sad']); const a = alles; actuar(a, L.lt, [[0, 'idle'], [.4, { aRx: 2.0, aRe: 2.0, aRz: -.3, headX: .2 }, { dur: .5 }]], { T: L.T }); cara(a, L.T, { expr: 'sad', mouth: 'frown' });
  badge('green', 'DER NETTESTE', W / 2, H * .2, (L.lt - 1.2) * 3); onFace(a, 8, -.4, -.2 + L.k * .3, 40, L.k, 7); sh(V(HX[3], 0, 4), 20); }, [[0, 'whoosh', .4], [.6, 'soft_piano', .5]]);
// 42 «sagte ganz leise:» (zoom lento): primer plano: se acerca y habla muy bajo; todo se oscurece
shot(tw('sagte', 1), 'Z', 'slow', L => { tower(); heroesT(L, ['cross', 'cross', 'cross', 'idle'], ['angry', 'angry', 'angry', 'sad']); talk(alles, L.T, L.t0, L.t1 + 3, 'sad');
  DARK = .2 * L.k; onFace(alles, 6, -.4, .1, 40, L.k, 4.6); sh(V(HX[3], 0, 4), 20); }, [[0, 'whisper', .4], [.4, 'heartbeat', .4]]);
// 43 «„Heute wurden Menschen verletzt,»: recuerdo de la avenida rota: un hospital de campaña, gente con vendas y muletas
shot(tw('Heute', 1), 'F', null, L => { city('dusk'); smoke(V(DT0 - 6, 0, GZ + 10), L.T, 3); for (let i = 0; i < 5; i++) { const c = BG[i]; put(c, DT0 - 6 + i * 3, 0, GZ + 40 - (i % 2) * 2, PI * .1 + (i - 2) * .2); actuar(c, L.lt, [[0, i % 2 ? 'hug_self' : 'slump']], { T: L.T + i }); cara(c, L.T + i, { expr: 'sad', mouth: 'frown' }); }
  POST.push(() => BG.slice(0, 5).forEach((c, i) => { const h = hp(c); })); TINT = 'rgba(255,60,40,.08)';
  badge('red', 'VERLETZT', W / 2, H * .2, (L.lt - .4) * 3); cm([DT0, 5, GZ + 54, DT0, 3.5, GZ + 38, 46], [DT0 + 2, 5, GZ + 52, DT0, 3.5, GZ + 38, 44], L.k); sh(V(DT0, 0, GZ + 40), 30); }, [[0, 'siren', .5], [.3, 'cough', .4], [.9, 'crying', .3]]);
// 44 «nur weil dir langweilig war.“»: el capitán bosteza mientras Herr Alleskann se lo dice
shot(tw('nur', 4), 'C', null, L => { tower(); const c = ichT(L, PI * .9, { pose: 'cross' }); cara(c, L.T, { expr: 'bored', eyes: 'half', mouth: L.lt > .3 ? 'yawn' : 'flat' }); put(alles, TRX + 3.5, 0, 9, faceTo(V(TRX + 3.5, 0, 9), V(TRX, 0, 13))); actuar(alles, L.lt, [[0, { aRx: 1.2, aRe: .6 }]], { T: L.T }); talk(alles, L.T, L.t0, L.t1, 'sad');
  badge('tag', 'LANGWEILIG', W / 2, H * .2, (L.lt - .5) * 3); cm([TRX - 8, 6.5, 4, TRX + 1.5, 5, 11.5, 48], [TRX - 7, 6.5, 5, TRX + 1.5, 5, 11.5, 46], L.k); sh(V(TRX, 0, 11), 20); }, [[0, 'whoosh', .3], [.4, 'yawn', .6]]);
// 45 «Da wurde mir etwas klar:» (zoom lento): primerísimo plano de sus ojos; se le ilumina una idea; viñeta
shot(tw('Da'), 'C', 'slow', L => { tower(); const c = ichT(L, PI); cara(c, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' }); purple(L, L.k);
  onFace(c, 5, -.1, 0, 36, L.k, 3.2); sh(V(TRX, 0, 13), 20); }, [[0, 'tension', .5], [.6, 'heartbeat', .5]]);
// 46 «Keiner von ihnen konnte mich aufhalten.»: contrapicado desde detrás del capitán: los cuatro pequeños y él enorme, con aura violeta
shot(tw('Keiner'), 'W', null, L => { tower(); const c = ichT(L, PI); heroesT(L, ['brace', 'brace', 'fists', 'idle'], ['worried', 'worried', 'angry', 'sad']); purple(L, .8);
  cm([TRX + 2, 2, 19, TRX, 6, 2, 60], [TRX + 1.5, 2.2, 18.5, TRX, 6.5, 2, 58], L.k); sh(V(TRX, 0, 8), 30); }, [[0, 'power_up', .6], [.5, 'rumble', .4]]);
// 47 «Sie hofften nur, dass ich es nie merke.»: los cuatro se miran entre ellos, sudando
shot(tw('Sie', 1), 'S', null, L => { tower(); heroesT(L, ['hug_self', 'cower', 'brace', 'idle'], ['worried', 'worried', 'worried', 'sad']); LIGA.forEach((h, i) => { h.root.rotation.y += Math.sin(L.T * 2 + i) * .4; sweat(h, L.T); });
  cm([TRX + 3, 6, 18, TRX, 4.6, 3, 52], [TRX - 3, 6, 18, TRX, 4.6, 3, 52], L.k); sh(V(TRX, 0, 4), 30); }, [[0, 'whoosh', .3], [.4, 'gulp', .5], [1.0, 'whisper', .4]]);
// 48 «Dann griff Herr Alleskann nach meiner Schulter.» (zoom lento): la mano amable se posa en su hombro
shot(tw('Dann', 2), 'C', 'slow', L => { tower(); const c = ichT(L, PI * .95); cara(c, L.T, { expr: 'angry', mouth: 'flat' }); const a = put(alles, TRX + 2.2, 0, 10.5, faceTo(V(TRX + 2.2, 0, 10.5), V(TRX, 0, 13)) - .3);
  actuar(a, L.lt, [[0, 'idle'], [.2, { aLx: 1.5, aLe: .3, aLz: -.4, lean: .1 }, { dur: .8 }]], { T: L.T }); cara(a, L.T, { expr: 'sad', mouth: 'smile' });
  cm([TRX + 5, 7, 19, TRX + 1, 5.6, 12, 46], [TRX + 3.5, 6.6, 18, TRX + 1, 5.6, 12, 42], L.k); sh(V(TRX, 0, 12), 20); }, [[0, 'tension', .4], [.9, 'cloth', .4]]);
// 49 «Ich weiß nicht mehr, ob ich es entschieden habe.»: cierra los ojos; destello violeta; la sala tiembla
shot(tw('Ich', 4), 'F', null, L => { tower(); const c = ichT(L, PI); cara(c, L.T, { eyes: 'closed', mouth: 'flat' }); purple(L, 1.8); SHAKE = .5; grade.uniforms.flash.value = Math.max(0, .7 - L.lt * .8);
  onFace(c, 6, -.2, .15, 40, L.k, 5); sh(V(TRX, 0, 13), 20); }, [[0, 'whoosh_big', .6], [.1, 'poof', .9], [.3, 'poof', .8], [.5, 'poof', .8], [.7, 'poof', .8]]);
// 50 «Ich erinnere mich nur an die Stille.»: la sala vacía; las sillas giran solas; silencio
shot(tw('Ich', 5), 'I', null, L => { tower(); TR.CHAIRS.forEach((c, i) => c.rotation.y = (PI + (i - 2) * .5 + PI) + Math.sin(L.T * .8 + i) * .2); DARK = .15;
  cm([TRX + 12, 12, 26, TRX, 3, 0, 52], [TRX + 8, 11, 24, TRX, 3, 0, 50], L.k); sh(V(TRX, 0, 4), 30); }, [[0, 'silence_hit', .6], [.6, 'chair_creak', .4]]);
// 51 «Vier Umhänge auf dem Boden.»: cenital: cuatro capas de colores en el suelo; «4»
shot(tw('Vier', 1), 'C', 'punch', L => { tower(); capesFloor(V(TRX + 1, 0, 4), L.T); badge('num', '4', W / 2, H * .18, (L.lt - .2) * 3, 1, 1.3);
  cm([TRX + 1, 18, 14, TRX + 1, 0, 4.5, 50], [TRX + 1, 16, 13, TRX + 1, 0, 4.5, 48], L.k); sh(V(TRX, 0, 4), 20); }, [[0, 'impact', .5], [.3, 'cloth', .4]]);
// 52 «Vier kleine Haufen Staub.» (zoom lento): cuatro montoncitos; sobre uno, las gafas redondas de Herr Alleskann
shot(tw('Vier', 2), 'S', 'slow', L => { tower(); capesFloor(V(TRX + 1, 0, 4), L.T); for (let i = 0; i < 4; i++) show(PILES[i], TRX - 2.3 + i * 2.2, 0, 4 + (i % 2) * 1.8 - .9, 0, .55);
  cm([TRX + 1, 5, 19, TRX + 1, 1, 5, 50], [TRX + 1, 3.6, 15, TRX + 1, .8, 5, 46], L.k); sh(V(TRX, 0, 5), 20); }, [[0, 'sand', .6], [.8, 'wind', .3]]);
// 53 «Am nächsten Morgen sagte ich der Stadt:»: rueda de prensa al amanecer delante del Rathaus; micrófonos y mucha gente
shot(tw('Am'), 'W', null, L => { town('morning'); const c = put(ich, -6, 0, -66, 0); actuar(c, L.lt, [[0, { aLx: .4, aRx: 1.2, aRe: .8, aLz: .2 }]], { T: L.T }); talk(c, L.T, L.t0, L.t1, 'smug'); show(MICS, -6, -1.4, -63, 0);
  crowdGrid(-6, -48, 10, 6, 3, PI, 0, 0); stands(L.T, 'still', false); cm([-6, 12, -18, -6, 5, -66, 50], [-6, 11, -26, -6, 5, -66, 46], L.k); sh(V(-6, 0, -50), 50); }, [[0, 'camera_shutter', .5], [.3, 'crowd_murmur', .5], [.9, 'camera_shutter', .4]]);
// 54 «Die Liga war nicht gut genug.»: primer plano al micrófono; en la pantalla de la plaza: «LIGA: NICHT GUT GENUG»
shot(tw('Die', 1), 'C', null, L => { town('morning'); const c = put(ich, -6, 0, -66, 0); actuar(c, L.lt, [[0, { aLx: .4, aRx: 1.2, aRe: .8, aLz: .2 }]], { T: L.T }); talk(c, L.T, L.t0, L.t1, 'angry'); show(MICS, -6, -1.4, -63, 0);
  badge('red', 'NICHT GUT GENUG', W / 2, H * .18, (L.lt - .4) * 3); onFace(c, 9, .2, .3, 42); sh(V(-6, 0, -66), 20); }, [[0, 'whoosh', .4], [.4, 'crowd_gasp', .5]]);
// 55 «Aber ich schon.»: sonrisa, pulgar al pecho
shot(tw('Aber', 2), 'C', 'punch', L => { town('morning'); const c = put(ich, -6, 0, -66, 0); actuar(c, L.lt, [[0, { aRx: 1.6, aRz: -.6, aRe: 2.3, aLz: .2 }]], { T: L.T }); grin(c, L.T); show(MICS, -6, -1.4, -63, 0);
  onFace(c, 6.5, -.1, -.3, 40); sh(V(-6, 0, -66), 20); }, [[0, 'impact', .5], [.3, 'ding', .5]]);
// 56 «Also gründete ich ein neues Team:»: cae la tela y aparece la gran pancarta del Rathaus
shot(tw('Also', 1), 'W', null, L => { town('morning'); const k = clamp(L.lt / .9); show(LBAN, -6, 31 + (1 - easeOut(k)) * 0, -82.6, 0, .55); LBAN.scale.y = .55 * easeOut(k); const c = put(ich, -6, 0, -66, PI); actuar(c, L.lt, [[0, 'point']], { T: L.T });
  crowdGrid(-6, -40, 10, 7, 3, PI, 0, 0); stands(L.T, 'still', false); cm([-6, 8, -30, -6, 22, -80, 54], [-6, 10, -36, -6, 26, -80, 50], L.k); sh(V(-6, 0, -60), 50); }, [[0, 'cloth', .6], [.5, 'fanfare', .6]]);
// 57 «die Liga der Größe.»: la pancarta de cerca con confeti
shot(tw('die', 8), 'Z', null, L => { town('morning'); show(LBAN, -6, 31, -82.6, 0, .55); confRain(V(-6, 20, -80), L.T, 60, 24, 10, 16);
  cm([-6, 26, -50, -6, 31, -82, 46], [-6, 28, -56, -6, 31, -82, 44], L.k); sh(V(-6, 0, -80), 50); }, [[0, 'confetti', .6], [.3, 'cheer', .5]]);
// 58 «Und um es zu beweisen, schloss ich die Augen»: en el balcón, cierra los ojos y flota; el aura violeta crece
shot(tw('Und', 7), 'R', null, L => { town('morning'); const c = hover(ich, -6, 18 + L.lt * .8, -76, 0, L.T, { pose: { aLz: .8, aRz: .8, aLe: .2, aRe: .2 } }); cara(c, L.T, { eyes: L.lt > 1 ? 'closed' : 'normal', mouth: 'flat' }); purple(L, clamp(L.lt / 2));
  onFace(c, 10, -.4, .15, 44, L.k, 8); sh(V(-6, 0, -76), 30); }, [[0, 'riser_short', .5], [1.0, 'power_up', .6]]);
// 59 «und dachte an jeden Verbrecher.»: la pantalla gigante de la plaza llena de fichas de criminales
shot(tw('und', 3), 'F', null, L => { town('morning'); BIGTV.visible = true; tvDraw(BIGTV.userData.scr, 'wanted', (c, w, h) => { c.fillStyle = '#1a1a22'; c.fillRect(0, 0, w, h); for (let i = 0; i < 18; i++) { const x = 20 + (i % 6) * 90, y = 20 + Math.floor(i / 6) * 100; c.fillStyle = '#f4e8c8'; c.fillRect(x, y, 80, 92); c.fillStyle = ['#e8b08a', '#c88a5a', '#f2c8a8'][i % 3]; c.fillRect(x + 22, y + 14, 36, 36); c.fillStyle = '#1a1a1a'; c.fillRect(x + 22, y + 10, 36, 10); c.fillRect(x + 30, y + 28, 5, 5); c.fillRect(x + 45, y + 28, 5, 5); txt2(c, 'GESUCHT', x + 40, y + 74, 14, '#d8323a'); } });
  cm([-6, 18, -30, -6, 22, -70, 50], [-6, 20, -38, -6, 22, -70, 46], L.k); sh(V(-6, 0, -60), 50); }, [[0, 'static', .4], [.3, 'beep', .5], [.9, 'tension', .4]]);
// 60 «Jeden Dieb.»: un ladrón con antifaz sale de una tienda con una bolsa… puf
shot(tw('Jeden', 1), 'C', null, L => { town(); const d = put(dieb, 30, 0, -30, -PI / 2); applyPose(d, runPoseL(L.T * 1.6)); d.root.position.x -= L.lt * 3; cara(d, L.T, { expr: 'shock', mouth: 'grin' }); poof(d, L.t0 + .45, L.T, 0);
  orbit(V(28, 3.4, -30), 11, -PI / 2 + .6, .1, 44); sh(V(28, 0, -30), 20); }, [[0, 'whoosh', .4], [.45, 'poof', .9]]);
// 61 «Jeden Schläger.»: en un callejón, un matón agarra a un chaval por la sudadera… puf; el chaval se queda boquiabierto
shot(tw('Jeden', 2), 'W', null, L => { town(); const b = put(K[3], -40, 0, 30, PI / 2), v = put(K[6], -36.6, 0, 30, -PI / 2); v.root.scale.setScalar(.8); actuar(b, L.lt, [[0, { aRx: 1.5, aRe: .4, lean: .15, aLx: .9, aLe: 2 }]], { T: L.T }); cara(b, L.T, { expr: 'angry', mouth: 'grimace' });
  actuar(v, L.lt, [[0, 'cower'], [.6, 'shock', { dur: .3 }]], { T: L.T }); cara(v, L.T, { expr: 'shock', mouth: L.lt > .5 ? 'o' : 'frown' }); poof(b, L.t0 + .45, L.T, 1);
  orbit(V(-38.3, 3.4, 30), 11, .2, .1, 44); sh(V(-38, 0, 30), 20); }, [[0, 'punch_air', .4], [.45, 'poof', .9], [.8, 'gasp', .4]]);
// 62 «Jeden, der je ein Fahrrad geklaut hat.»: un tipo huye en una bici robada… puf: la bici sigue rodando sola
shot(tw('Jeden', 3), 'S', null, L => { town(); const z = 40 - L.lt * 9; const d = put(K[0], 26, .9, z, PI); applyPose(d, { ...SIT, crouch: .3, lLx: 1.2 + Math.sin(L.T * 9) * .4, lRx: 1.2 - Math.sin(L.T * 9) * .4, lLk: 1.2, lRk: 1.2, aLx: 1.3, aRx: 1.3, aLe: .4, aRe: .4, lean: .3 }); cara(d, L.T, { expr: 'smug', mouth: 'grin' });
  show(BIKE, 26, 0, z, 0, 1.4); const gone = poof(d, tw('geklaut') - .1, L.T, 2, .8); if (gone) { BIKE.rotation.z = Math.min(.6, (L.T - tw('geklaut')) * .6); }
  orbit(V(26, 3, z), 14, -.9, .12, 44); sh(V(26, 0, z), 20); }, [[0, 'bike_bell', .5], [.3, 'bike', .5], [tw('geklaut') - tw('Jeden', 3) - .1, 'poof', .9], [1.3, 'bike_crash', .5]]);
// ---------- d: cárceles en silencio, estatua, miedo del alcalde, tanques, cárcel, juicio, escalinata, Rathaus, final (101,1 – 174,1 s) ----------
const BOOTH = (() => { const g = new THREE.Group(); scene.add(g); box(4, 7, 4, mat(0xd8d4cc, { roughness: .8 }), .1, g, 0, 3.5, 0); box(4.4, .5, 4.4, mat(0x8a2a2a), .1, g, 0, 7.2, 0); box(3, 2, .2, mat(0x9ad0f4, { roughness: .1, metalness: .4 }), .02, g, 0, 4.6, 2.02);
  const s = textPlane(3.4, .8, 270, 64, (c, w, h) => { c.fillStyle = '#1a2a5a'; c.fillRect(0, 0, w, h); txt2(c, 'WACHE', w / 2, h / 2 + 3, 44, '#ffffff'); }, .3); s.position.set(0, 6.4, 2.06); g.add(s); g.traverse(o => { if (o.isMesh) o.castShadow = true; }); g.visible = false; PROPS.push(g); return g; })();
const GCAP = (() => { const m = mat(0x1a2a5a); const g = new THREE.Group(); scene.add(g); cyl(.78, .74, .5, m, 20, g, 0, .25, 0); box(1.6, .1, 1.1, mat(0x101010), .05, g, 0, 0, .45); g.visible = false; PROPS.push(g); return g; })();
const DESK = (() => { const g = new THREE.Group(); scene.add(g); box(12, .6, 5, mat(0x5a3218, { roughness: .4 }), .1, g, 0, 4, 0); box(11.6, 3.8, 4.6, mat(0x4a2410, { roughness: .5 }), .1, g, 0, 1.9, 0);
  const sc = textPlane(4, 3, 320, 240, (c, w, h) => { c.fillStyle = '#f4e8c8'; c.fillRect(0, 0, w, h); txt2(c, 'NEUE REGELN', w / 2, 34, 36, '#3a2010'); ['1. Ich entscheide.', '2. Wer Nein sagt …', '3. ???'].forEach((t, i) => { c.font = `700 26px ${FONT}`; c.textAlign = 'left'; c.fillStyle = '#3a2010'; c.fillText(t, 26, 90 + i * 50); }); }, .3);
  sc.rotation.x = -PI / 2; sc.position.set(0, 4.32, .6); g.add(sc); const q = cyl(.06, .02, 2.2, mat(0xffffff), 6, g, 2, 5.2, .8); q.rotation.z = -.6; g.userData.quill = q; g.traverse(o => { if (o.isMesh) o.castShadow = true; }); g.visible = false; PROPS.push(g); return g; })();
const office = () => { use('TR'); night(30); inside(.85, 40); TR.T.visible = false; TR.sg.visible = false; OSIGN.visible = true; };
const ROOFY = 6.4, STZ = -354;   // escalinata del Landgericht (DT)
const court = () => { use('GE'); inside(.9, 40); };
const JUDGE = (L, ex = {}) => { const j = put(richter, GEX, 6.6, -17.5, 0); actuar(j, L.lt, [[0, { ...SIT, aLx: .9, aRx: .9, aLe: .9, aRe: .9, ...ex }]], { T: L.T }); return j; };
const DOCKC = (L, pose = 'idle', ry = PI) => { const c = put(ich, GEX, 0, 1.6, ry); actuar(c, L.lt, [[0, pose]], { T: L.T }); c.props.wind = .2; return c; };
const officials = (L, skip = []) => { const p = put(polizist, GEX - 15, 0, -9, PI / 2 - .3), m = put(mayor, GEX + 15, 0, -9, -PI / 2 + .3); [p, m].forEach((c, i) => { if (skip.includes(c)) { c.root.visible = false; return; } actuar(c, L.lt, [[0, i ? 'cross' : 'idle']], { T: L.T + i }); cara(c, L.T + i, { expr: 'smug', mouth: 'flat' }); }); return [p, m]; };
const gallery = (L, mode = 'still', silent = false) => { crowdGrid(GEX, 10, 12, 4, 4, PI, 0, .9); stands(L.T, mode, silent); };

// 63 «Plötzlich wurde jedes Gefängnis»: la cárcel de noche; el foco barre el patio… y se apaga
shot(tw('Plötzlich'), 'C', null, L => { use('KN'); night(20); KN.SPOT.intensity = L.lt < 1 ? 600 : 0; KN.beam.visible = L.lt < 1; KN.beam.rotation.y = Math.sin(L.T) * .5; DARK = L.lt > 1 ? .25 : 0;
  cm([KNX + 30, 14, 60, KNX, 12, -15, 50], [KNX + 22, 18, 46, KNX, 12, -15, 48], L.k); sh(V(KNX, 0, -10), 60); }, [[0, 'whoosh', .5], [.3, 'night_ambience', .5], [1.0, 'power_down', .7]]);
// 64 «gleichzeitig still.»: dentro de una celda: sobre la cama solo queda un montoncito de polvo y el uniforme a rayas
shot(tw('gleichzeitig'), 'I', null, L => { use('ZE'); inside(.7, 30); show(PILES[0], ZEX - 5, 2.6, -6, 0, .9); dust(V(ZEX - 5, 2.4, -6), L.t0 - .2, L.T, 6, .5);
  cm([ZEX + 3, 6.5, 6, ZEX - 4.5, 2.6, -6, 48], [ZEX + 2, 6, 5, ZEX - 4.5, 2.6, -6, 46], L.k); sh(V(ZEX, 0, -4), 20); }, [[0, 'silence_hit', .6], [.4, 'sand', .4], [.9, 'drip', .3]]);
// 65 «Über Nacht fiel die Kriminalität auf null.»: la pantalla de la plaza: la curva cae en picado hasta 0
shot(tw('Über'), 'W', null, L => { town('morning'); BIGTV.visible = true; const k = clamp(L.lt / 1.6); tvDraw(BIGTV.userData.scr, 'crime' + Math.round(k * 30), (c, w, h) => { c.fillStyle = '#0e1430'; c.fillRect(0, 0, w, h); txt2(c, 'KRIMINALITÄT', w / 2, 34, 34, '#ffd23f');
    c.strokeStyle = '#ff4a4a'; c.lineWidth = 8; c.beginPath(); const N = 30; for (let i = 0; i <= N * k; i++) { const x = 30 + i / N * (w - 60), v = i < 12 ? .75 + Math.sin(i * 1.3) * .08 : Math.max(0, .75 - (i - 12) / 6); c.lineTo(x, h - 30 - v * (h - 90)); } c.stroke(); });
  badge('green', 'NULL', W / 2, H * .17, (L.lt - 1.2) * 3, 1, 1.2); crowdGrid(-6, -46, 10, 6, 3, PI, 0, 0); stands(L.T, 'still', true);
  cm([-6, 12, -12, -6, 22, -70, 52], [-6, 14, -20, -6, 22, -70, 48], L.k); sh(V(-6, 0, -50), 50); }, [[0, 'beep', .4], [.4, 'slide_down', .6], [1.3, 'ding', .6]]);
// 66 «Sie bauten mir eine Statue.»: la estatua de piedra del capitán en la plaza; grúa hacia arriba; la gente aplaude
shot(tw('Sie', 2), 'R', null, L => { town(); SOCK.visible = true; const st = put(statue, -6, 7.2, -30, 0); actuar(st, 0, [[0, { aRx: 2.9, aRz: .3, aRe: .1, aLz: .2 }]], { T: 0 }); cara(st, 0, { eyes: 'normal', mouth: 'smirk', noBlink: true });
  folk(-6, -30, 10, 10, 18, L.T, 31, { mode: 'cheer', face: V(-6, 0, -30) }); confRain(V(-6, 4, -30), L.T, 40, 30, 20, 30);
  cm([-6, 3, -4, -6, 12, -30, 54], [-6, 9, -10, -6, 16, -30, 52], L.k); sh(V(-6, 0, -26), 40); }, [[0, 'whoosh', .4], [.2, 'cheer', .7], [.8, 'fanfare', .4]]);
// 67 «Kinder trugen meinen Umhang zur Schule.»: niños con capas negras y violetas corren por la calle hacia el colegio
shot(tw('Kinder'), 'S', null, L => { town(); for (let i = 0; i < 6; i++) { const c = K[i]; const z = 60 - i * 3.2 - L.lt * 6; put(c, 22 + (i % 3) * 3, 0, z, PI); c.root.scale.setScalar(.7); applyPose(c, runPoseL(L.T * 1.6 + i)); capeOn(c); c.props.wind = 1.4; c.props.fly = .3; grin(c, L.T + i); }
  orbit(V(25, 3, 50 - L.lt * 6), lerp(16, 14, L.k), PI + .5, .12, 46); sh(V(25, 0, 48), 30); }, [[0, 'kids_laugh', .6], [.4, 'footsteps_run', .5], [1.0, 'school_bell', .4]]);
// 68 «Aber der Bürgermeister bekam Angst.»: el alcalde, escondido tras una columna del Rathaus, mira la estatua y suda
shot(tw('Aber', 3), 'W', null, L => { town(); const m = put(mayor, -16, 0, -64, PI * .85); actuar(m, L.lt, [[0, 'hug_self']], { T: L.T }); cara(m, L.T, { expr: 'worried', mouth: 'wavy' }); sweat(m, L.T);
  badge('tag', 'BÜRGERMEISTER', W / 2, H * .2, (L.lt - .3) * 3); onFace(m, 8, -.3, .4, 42); sh(V(-16, 0, -64), 20); }, [[0, 'whoosh', .4], [.4, 'gulp', .6], [1.2, 'heartbeat', .4]]);
// 69 «Nicht vor den Verbrechern.»: el alcalde mira un montoncito de polvo en la acera y niega con la cabeza
shot(tw('Nicht', 1), 'C', null, L => { town(); show(PILES[0], -10, 0, -66, 0, .9); const m = put(mayor, -13, 0, -70, .6); actuar(m, L.lt, [[0, { headY: Math.sin(L.T * 8) * .4, headX: .25, lean: .1 }]], { T: L.T }); cara(m, L.T, { expr: 'sad', mouth: 'frown' });
  orbit(V(-11.5, 3, -68), 10, .9, .2, 44); sh(V(-12, 0, -68), 20); }, [[0, 'whoosh', .3], [.3, 'tsk', .5]]);
// 70 «Vor mir.» golpe: contrapicado del capitán, sonriendo, con aura violeta
shot(tw('Vor', 1), 'C', 'punch', L => { town(); const c = hover(ich, -6, 1.2, -50, 0, L.T, { pose: CROSS, a: .1 }); smug(c, L.T); purple(L, .8);
  cm([-6, 1.4, -40, -6, 7, -50, 46], [-6, 1.6, -41, -6, 7.2, -50, 44], L.k); sh(V(-6, 0, -50), 20); }, [[0, 'braam', .6], [.3, 'power_up', .4]]);
// 71 «Denn wenn ich entscheide, wer ein Verbrecher ist …»: pasea entre la gente y la señala uno a uno; todos se encogen
shot(tw('Denn', 2), 'W', null, L => { town(); const c = put(ich, -6 + L.lt * 2, 0, -40, PI * .6); applyPose(c, { ...walkP(L.T), aRx: 1.6, aRe: .1 }); cara(c, L.T, { expr: 'sus', mouth: 'smirk' });
  for (let i = 0; i < 5; i++) { const p = BG[i]; put(p, -14 + i * 4, 0, -34 + (i % 2) * 2, PI * .9); actuar(p, L.lt, [[0, 'cower']], { T: L.T + i }); cara(p, L.T + i, { expr: 'worried', mouth: 'wavy' }); }
  POST.push(() => { QM.visible = true; QM.position.copy(hp(BG[2])).add(V(0, 2.4, 0)); QM.lookAt(camera.position); }); cm([-6, 7, -18, -4, 4, -38, 48], [-3, 7, -20, -2, 4, -38, 46], L.k); sh(V(-4, 0, -36), 30); }, [[0, 'footsteps', .4], [.6, 'tension', .5], [1.4, 'gasp', .4]]);
// 72 «was entscheide ich dann noch?» (zoom lento): sus ojos se entrecierran; viñeta
shot(tw('was', 2), 'Z', 'slow', L => { town('dusk'); const c = put(ich, -6, 0, -40, 0); actuar(c, L.lt, [[0, CROSS]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'squint', mouth: 'smirk' }); purple(L, L.k);
  onFace(c, 6, -.1, .15, 38, L.k, 4); sh(V(-6, 0, -40), 20); }, [[0, 'tension', .5]]);
// 73 «Also standen zwölf Panzer auf meinem Rasen.»: doce tanques aparcados en el césped y la calle de su casa; «12»
const tanks = (L, n = 12, aim = 0) => { TANKS.forEach((t, i) => { if (i >= n) return; const r = (i / 4) | 0, c = i % 4; show(t, 30 + c * 13, 0, 78 + r * 16 + (c % 2) * 3, -PI / 2); t.userData.tur.rotation.y = aim * Math.sin(i) * .2; }); };
shot(tw('Also', 2), 'C', null, L => { town(); tanks(L); badge('num', '12 PANZER', W / 2, H * .17, (L.lt - .6) * 3);
  cm([36, 74, 150, 44, 0, 96, 50], [34, 80, 146, 44, 0, 98, 48], L.k); sh(V(40, 0, 96), 60); }, [[0, 'tank_engine', .8], [.6, 'ding', .4], [1.0, 'tank_tracks', .5]]);
// 74 «Panzer auf meinem Rasen.»: de cerca: las torretas giran hacia la puerta; soldados apuntan
shot(tw('Panzer'), 'S', null, L => { town(); tanks(L, 12, 1); TANKS[0].userData.tur.rotation.y = -.2 + L.k * .2; SOLD.forEach((s, i) => { put(s, 20 + (i % 2) * 2, 0, 88 + i * 4, -PI / 2); actuar(s, L.lt, [[0, { aLx: 1.4, aRx: 1.5, aLe: .5, aRe: 1.2 }]], { T: L.T + i }); cara(s, L.T + i, { expr: 'determined', mouth: 'flat' }); });
  cm([14, 7, 70, 32, 3, 94, 50], [15, 7, 72, 32, 3, 96, 48], L.k); sh(V(26, 0, 92), 40); }, [[0, 'turret', .7], [.5, 'gun_cock', .5]]);
// 75 «Und ich ließ mich verhaften.»: en la puerta de casa, tiende las muñecas; aparecen las esposas
shot(tw('Und', 8), 'W', null, L => { town(); tanks(L, 12, 1); const c = put(ich, 13, 0, 96, PI / 2); actuar(c, L.lt, [[0, 'idle'], [.2, { aLx: 1.4, aRx: 1.4, aLz: -.25, aRz: -.25, aLe: .3, aRe: .3 }, { dur: .4 }]], { T: L.T }); smug(c, L.T);
  const s = put(SOLD[0], 17, 0, 96, -PI / 2); actuar(s, L.lt, [[0, 'reach']], { T: L.T }); cara(s, L.T, { expr: 'worried', mouth: 'flat' }); if (L.lt > .6) POST.push(() => { const a = wpos(ich.aL.hand), b = wpos(ich.aR.hand); show(CUFFS, (a.x + b.x) / 2, (a.y + b.y) / 2 - .3, (a.z + b.z) / 2, PI / 2); });
  orbit(V(15, 4.4, 96), lerp(11, 9.5, L.k), .25, .1, 44); sh(V(15, 0, 96), 20); }, [[0, 'footsteps', .4], [.6, 'handcuffs', .8]]);
// 76 «Ich hätte die ganze Armee zu Staub machen können.»: él mira los tanques… y por un instante (tinte violeta) los ve todos convertidos en montones de polvo
shot(tw('Ich', 6), 'F', null, L => { town(); const vis = L.lt > .9; if (!vis) tanks(L, 12, 1); else { purple(L, 1.2); TANKS.forEach((t, i) => { const r = (i / 4) | 0, c = i % 4; show(PILES[i % 6], 30 + c * 13, 0, 78 + r * 16 + (c % 2) * 3, 0, 3.4); }); }
  const c = put(ich, 13, 0, 96, PI / 2 + .2); actuar(c, L.lt, [[0, { aLx: 1.4, aRx: 1.4, aLz: -.25, aRz: -.25, aLe: .3, aRe: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', mouth: 'smirk' });
  cm([6, 9, 76, 28, 3, 94, 58], [7, 9, 77, 28, 3, 95, 56], L.k); sh(V(30, 0, 94), 60); }, [[0, 'whoosh', .4], [.9, 'poof', .8], [1.0, 'braam', .4]]);
// 77 «Aber dann wäre ich ja der Böse.»: guiña un ojo a cámara, con las esposas puestas
shot(tw('Aber', 4), 'C', 'punch', L => { town(); const c = put(ich, 13, 0, 96, PI / 2); actuar(c, L.lt, [[0, { aLx: 1.4, aRx: 1.4, aLz: -.25, aRz: -.25, aLe: .3, aRe: .3 }]], { T: L.T }); cara(c, L.T, { eyes: L.lt > .5 ? 'wink' : 'normal', mouth: 'smirk', noBlink: true });
  POST.push(() => { const a = wpos(ich.aL.hand), b = wpos(ich.aR.hand); show(CUFFS, (a.x + b.x) / 2, (a.y + b.y) / 2 - .3, (a.z + b.z) / 2, PI / 2); }); badge('tag', 'DER BÖSE?', W / 2, H * .2, (L.lt - .3) * 3); onFace(c, 7, -.1, .2, 40); sh(V(13, 0, 96), 20); }, [[0, 'impact', .4], [.5, 'wink', .6]]);
// 78 «Während ich im Gefängnis saß,»: en la celda, sentado en la cama, piernas cruzadas, tan tranquilo
shot(tw('Während'), 'I', null, L => { use('ZE'); inside(.75, 40); const c = put(ich, ZEX - 5, 1.6, -6, .3); actuar(c, L.lt, [[0, { ...SIT, lLx: 1.5, lRx: 1.2, lRk: 1.8, aLx: 2.6, aRx: 2.6, aLe: 2.4, aRe: 2.4 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); c.props.wind = .1;
  cm([ZEX + 3, 6, 15, ZEX - 4, 3.6, -6, 46], [ZEX + 1, 6, 13, ZEX - 4.5, 3.6, -6, 44], L.k); sh(V(ZEX, 0, -4), 20); }, [[0, 'cell_door', .6], [.6, 'drip', .3]]);
// 79 «marschierten Tausende mit meinem Gesicht auf ihren Schildern:»: la calle frente a la cárcel llena de gente con pancartas; «TAUSENDE»
shot(tw('marschierten'), 'W', null, L => { use('KN'); day(); crowdGrid(KNX, 10, 12, 14, 2.8, PI, 0, 0); stands(L.T, 'cheer', false); SIGNS.forEach((g, i) => { const r = RNG(i * 5 + 2); show(g, KNX - 14 + r() * 28, Math.abs(Math.sin(L.T * 4 + i)) * .5, 12 + r() * 30, PI); });
  badge('num', 'TAUSENDE', W / 2, H * .16, (L.lt - .5) * 3); cm([KNX + 14, 18, 60, KNX, 4, 20, 54], [KNX + 10, 22, 56, KNX, 4, 18, 52], L.k); sh(V(KNX, 0, 24), 60); }, [[0, 'crowd_march', .7], [.5, 'chant', .6], [1.2, 'drum', .5]]);
// 80 «„Freiheit für den Kapitän!“»: de cerca: pancartas con su cara arriba y abajo; la gente grita
shot(tw('Freiheit'), 'C', 'punch', L => { use('KN'); day(); for (let i = 0; i < 5; i++) { const c = BG[i]; put(c, KNX - 8 + i * 4, 0, 16 + (i % 2) * 2, PI); actuar(c, L.lt, [[0, { aRx: 2.8, aRz: .2, aRe: .2, aLz: .2 }]], { T: L.T + i }); cara(c, L.T + i, { expr: 'angry', mouth: 'scream' });
    POST.push(() => { const h = wpos(c.aR.hand); show(SIGNS[i], h.x, h.y - 3 + Math.sin(L.T * 6 + i) * .3, h.z, PI); }); } crowdGrid(KNX, 22, 10, 6, 2.8, PI, 0, 0); stands(L.T, 'cheer', false);
  cm([KNX + 2, 7, -4, KNX, 7, 18, 52], [KNX + 1, 7.4, -2, KNX, 7.4, 18, 50], L.k); sh(V(KNX, 0, 18), 30); }, [[0, 'chant', .8], [.6, 'crowd_cheer', .5]]);
// 81 «Genau das war der Plan.» (zoom lento): en la celda, sonríe a cámara
shot(tw('Genau'), 'Z', 'slow', L => { use('ZE'); inside(.7, 40); const c = put(ich, ZEX - 5, 1.6, -6, .3); actuar(c, L.lt, [[0, { ...SIT, lLx: 1.5, lRx: 1.2, lRk: 1.8, aLx: 2.6, aRx: 2.6, aLe: 2.4, aRe: 2.4 }]], { T: L.T }); grin(c, L.T, { eyes: 'squint' }); purple(L, .5 * L.k);
  onFace(c, 8, -.3, 0, 40, L.k, 5.5); sh(V(ZEX - 5, 0, -6), 20); }, [[0, 'tension', .4], [1.2, 'chuckle', .5]]);
// 82 «Mein Prozess lief auf jedem Sender.»: en un salón, una familia ve el juicio en la tele: «LIVE: PROZESS GEGEN KAPITÄN SOFORT»
shot(tw('Mein', 2), 'W', null, L => { use('WO'); inside(.9, 40); const tv = show(TV, WOX + 4, 2, -13, 0, 1.3); news(tv.userData.scr, 'PROZESS', 'KAPITÄN SOFORT VOR GERICHT');
  const m = put(mama, WOX + 2.4, 0, 1, PI), k = put(K[2], WOX + 5.8, 0, 1.5, PI + .1); k.root.scale.setScalar(.75); [m, k].forEach((c, i) => { actuar(c, L.lt, [[0, i ? 'shock' : 'hands_face']], { T: L.T + i }); cara(c, L.T + i, { expr: 'shock', mouth: 'o' }); });
  cm([WOX + 4, 8, 13, WOX + 4, 5, -12, 50], [WOX + 4, 7, 10, WOX + 4, 5, -12, 48], L.k); sh(V(WOX + 3, 0, -4), 30); }, [[0, 'tv_news', .7], [.6, 'gasp', .4]]);
// 83 «Als der Richter fragte, ob ich noch etwas sagen wolle,»: el juez, desde lo alto, se inclina y pregunta
shot(tw('Als', 2), 'S', null, L => { court(); const j = JUDGE(L, { lean: .25 }); talk(j, L.T, L.t0, L.t1, 'sus'); DOCKC(L); gallery(L);
  cm([GEX + 4, 8, -4, GEX, 9.5, -17, 46], [GEX + 3, 8.4, -6, GEX, 9.5, -17, 44], L.k); sh(V(GEX, 0, -12), 30); }, [[0, 'gavel', .6], [.4, 'murmur', .4]]);
// 84 «stand ich auf.»: se levanta en el banquillo; la capa se abre
shot(tw('stand', 2), 'C', 'punch', L => { court(); JUDGE(L); const c = DOCKC(L, 'idle'); c.root.position.y = -1.2 + easeOut(clamp(L.lt / .4)) * 1.2; c.props.wind = 1.4; c.props.fly = .3; smug(c, L.T); gallery(L, 'still', true);
  cm([GEX + 2, 5.5, -7, GEX, 5, 1.6, 46], [GEX + 1.5, 5.4, -5.5, GEX, 5, 1.6, 44], L.k); sh(V(GEX, 0, 0), 20); }, [[0, 'cloth', .6], [.2, 'impact', .4]]);
// 85 «Ich sagte, dass die Leute in diesem Saal»: señala alrededor: al juez, al policía, al alcalde
shot(tw('Ich', 7), 'W', null, L => { court(); JUDGE(L); const c = DOCKC(L, 'point', PI - .9 + L.k * 1.8); talk(c, L.T, L.t0, L.t1, 'angry'); officials(L); gallery(L);
  cm([GEX + 2, 11, -11, GEX, 4.5, 2, 54], [GEX - 2, 11, -11, GEX, 4.5, 2, 52], L.k); sh(V(GEX, 0, -4), 40); }, [[0, 'whoosh', .4], [.4, 'murmur', .5]]);
// 86 «Verbrecher achtzig Jahre lang laufen ließen.»: la tribuna, escandalizada; «80 JAHRE»
shot(tw('Verbrecher', 3), 'C', null, L => { court(); gallery(L, 'still', true); const off = officials(L); off.forEach((c, i) => cara(c, L.T + i, { expr: 'shock', mouth: 'o' }));
  badge('num', '80 JAHRE', W / 2, H * .17, (L.lt - .4) * 3); cm([GEX + 6, 7, -4, GEX + 15, 4.6, -9, 46], [GEX + 7, 7, -4.5, GEX + 15, 4.6, -9, 44], L.k); sh(V(GEX + 14, 0, -9), 20); }, [[0, 'crowd_gasp', .6], [.5, 'ding', .5]]);
// 87 «Und dass die Stadt mich nur deshalb überhaupt brauchte.»: abre los brazos, como un salvador
shot(tw('Und', 9), 'S', null, L => { court(); const c = DOCKC(L, { aLx: 1.2, aRx: 1.2, aLz: 1.0, aRz: 1.0, aLe: .2, aRe: .2 }); talk(c, L.T, L.t0, L.t1, 'smug'); c.props.wind = 1; JUDGE(L);
  onFace(c, 10, -.4, .2 - L.k * .4, 44); sh(V(GEX, 0, 0), 20); }, [[0, 'whoosh', .4], [.6, 'choir', .4]]);
// 88 «Dann schaute ich in die Kamera.»: vista desde la cámara de TV: él mira directo al objetivo; «LIVE»
shot(tw('Dann', 3), 'Z', null, L => { court(); const cp = wpos(GE.CAMS[0]).add(V(0, 5.6, 0)).lerp(V(GEX, 5.6, 1.6), .25); const c = DOCKC(L, 'idle', faceTo(V(GEX, 0, 1.6), cp)); cara(c, L.T, { expr: 'sus', mouth: 'flat' }); JUDGE(L);
  TINT = 'rgba(40,60,80,.12)'; badge('red', '● LIVE', W * .22, H * .1, 1, 1, .6); cm([cp.x, cp.y, cp.z, GEX, 5, 1.6, 40], [cp.x * .97 + GEX * .03, cp.y, cp.z * .9 + 1.6 * .1, GEX, 5, 1.6, 30], L.k); sh(V(GEX, 0, 0), 30); }, [[0, 'camera_zoom', .6], [.5, 'beep', .3]]);
// 89 «Und ich dachte an jeden Richter.»: el juez… puf; queda polvo en el sillón
shot(tw('Und', 10), 'C', null, L => { court(); const j = JUDGE(L); cara(j, L.T, { expr: 'shock', mouth: 'o' }); poof(j, tw('Richter', 2) + .1, L.T, 0, 1);
  cm([GEX + 3, 9, -6, GEX, 8, -17, 46], [GEX + 2.4, 9, -7.4, GEX, 8, -17, 44], L.k); sh(V(GEX, 0, -15), 20); }, [[0, 'tension', .4], [tw('Richter', 2) - tw('Und', 10) + .1, 'poof', .9]]);
// 90 «Jeden Polizisten.»: el policía de la sala… puf
shot(tw('Jeden', 4), 'W', null, L => { court(); const [p] = officials(L); cara(p, L.T, { expr: 'shock', mouth: 'o' }); poof(p, L.t0 + .45, L.T, 1, 1);
  orbit(V(GEX - 15, 4.4, -9), 10, PI / 2 + .2, .1, 44); sh(V(GEX - 15, 0, -9), 20); }, [[0, 'whoosh', .3], [.45, 'poof', .9]]);
// 91 «Jeden Politiker.»: el alcalde… puf; su cadena de oro cae sobre el polvo
shot(tw('Jeden', 5), 'W', null, L => { court(); const [, m] = officials(L); cara(m, L.T, { expr: 'shock', mouth: 'scream' }); poof(m, L.t0 + .4, L.T, 2, 1);
  orbit(V(GEX + 15, 4.6, -9), 10, -PI / 2 - .2, .1, 44); sh(V(GEX + 15, 0, -9), 20); }, [[0, 'whoosh', .3], [.4, 'poof', .9]]);
// 92 «Der Saal wurde still.»: plano general: montoncitos de polvo donde estaban; la tribuna, petrificada; la luz LIVE sigue encendida
shot(tw('Der', 1), 'I', null, L => { court(); show(PILES[0], GEX, 6.1, -17.5, 0, .8); show(PILES[1], GEX - 15, 0, -9, 0, 1); show(PILES[2], GEX + 15, 0, -9, 0, 1); DOCKC(L); gallery(L, 'still', true); DARK = .1;
  cm([GEX, 20, 20, GEX, 3, -8, 54], [GEX, 18, 18, GEX, 3, -8, 52], L.k); sh(V(GEX, 0, -6), 40); }, [[0, 'silence_hit', .7], [.6, 'clock_tick', .4]]);
// 93 «Nur der Stuhl des Richters drehte sich noch.» (zoom lento): el sillón vacío gira despacio; polvo en el asiento
shot(tw('Nur', 2), 'C', 'slow', L => { court(); GE.CHAIR.rotation.y = L.T * 1.4; POST.push(() => { const p = wpos(GE.CHAIR); show(PILES[0], p.x, p.y + 2.8, p.z, 0, .7); });
  cm([GEX + 4, 12, -2, GEX, 8, -17.5, 46], [GEX + 3, 11.4, -5, GEX, 8, -17.5, 40], L.k); sh(V(GEX, 0, -16), 20); }, [[0, 'chair_creak', .7], [.8, 'chair_creak', .5]]);
// 94 «Draußen auf der Treppe warteten Tausende.»: sale por la puerta del Landgericht a lo alto de la escalinata; la avenida, llena
shot(tw('Draußen'), 'W', null, L => { city(); const c = put(ich, DT0, ROOFY, STZ - 2 + L.lt * 2, 0); applyPose(c, walkP(L.T)); smug(c, L.T); crowdGrid(DT0, -332, 9, 12, 2.6, PI, 0, 0); stands(L.T, 'still', true);
  cm([DT0 + 16, 14, -334, DT0, 6, -350, 58], [DT0 + 15, 15, -332, DT0, 6, -350, 56], L.k); sh(V(DT0, 0, -330), 60); }, [[0, 'door_open', .6], [.5, 'crowd_murmur', .5]]);
// 95 «Aber keiner jubelte mehr.»: caras de la gente en primera fila: miedo, silencio
shot(tw('Aber', 5), 'S', null, L => { city(); for (let i = 0; i < 5; i++) { const c = BG[i]; put(c, DT0 - 8 + i * 4, 0, -334 + (i % 2) * 2, PI); actuar(c, L.lt, [[0, i % 2 ? 'hug_self' : 'idle']], { T: L.T + i }); cara(c, L.T + i, { expr: 'worried', mouth: 'flat' }); } crowdGrid(DT0, -326, 9, 8, 2.6, PI, 0, 0); stands(L.T, 'still', true);
  cm([DT0 - 6, 5, -344, DT0, 4.4, -333, 46], [DT0 + 6, 5, -344, DT0, 4.4, -333, 46], L.k); sh(V(DT0, 0, -334), 30); }, [[0, 'silence_hit', .5], [.6, 'wind', .4]]);
// 96 «Also machte ich es einfach:»: levanta un dedo en lo alto de la escalinata
shot(tw('Also', 3), 'C', null, L => { city(); const c = put(ich, DT0, ROOFY, STZ + 1, 0); actuar(c, L.lt, [[0, 'idle'], [.2, { aRx: 2.8, aRe: .1, aRz: .1 }, { dur: .4 }]], { T: L.T }); smug(c, L.T); c.props.wind = 1;
  onFace(c, 9, -.2, .3, 42); sh(V(DT0, 0, STZ), 20); }, [[0, 'whoosh', .4], [.4, 'ding', .4]]);
// 97 «„Wer ein Verbrechen begeht,»: contrapicado desde la multitud: él habla desde arriba; el Landgericht detrás
shot(tw('Wer'), 'W', null, L => { city(); const c = put(ich, DT0, ROOFY, STZ + 1, 0); actuar(c, L.lt, [[0, { aRx: 1.6, aRe: .2, aLz: .2 }]], { T: L.T }); talk(c, L.T, L.t0, L.t1, 'angry'); c.props.wind = 1.2; crowdGrid(DT0, -332, 9, 6, 2.6, PI, 0, 0); stands(L.T, 'still', true);
  cm([DT0 + 2, 4, -318, DT0, 10, STZ, 50], [DT0 + 1, 4.5, -322, DT0, 10.5, STZ, 48], L.k); sh(V(DT0, 0, -340), 40); }, [[0, 'whoosh', .3], [.5, 'crowd_murmur', .3]]);
// 98 «wird sofort zu Staub.“» golpe: primer plano; el letrero rojo
shot(tw('wird'), 'C', 'punch', L => { city(); const c = put(ich, DT0, ROOFY, STZ + 1, 0); actuar(c, L.lt, [[0, { aRx: 1.7, aRe: .1 }]], { T: L.T }); talk(c, L.T, L.t0, L.t1, 'angry'); purple(L, .7);
  badge('red', 'SOFORT ZU STAUB', W / 2, H * .17, (L.lt - .1) * 3); onFace(c, 6.5, -.2, -.2, 40); sh(V(DT0, 0, STZ), 20); }, [[0, 'impact', .7], [.2, 'braam', .5]]);
// 99 «Und dann jubelten sie.»: plano aéreo: toda la avenida salta y aplaude
shot(tw('Und', 11), 'R', null, L => { city(); crowdGrid(DT0, -332, 9, 20, 2.6, PI, 0, 0); stands(L.T, 'cheer', false); const c = put(ich, DT0, ROOFY, STZ + 1, 0); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); grin(c, L.T); confRain(V(DT0, 0, -320), L.T, 50, 24, 40, 20);
  cm([DT0 + 16, 40, -270, DT0, 0, -330, 52], [DT0 + 12, 46, -276, DT0, 0, -332, 50], L.k); sh(V(DT0, 0, -320), 80); }, [[0, 'crowd_cheer', .8], [.6, 'confetti', .4]]);
// 100 «Vor allem, weil sie Angst hatten, es nicht zu tun.»: dos personas aplauden con sonrisa forzada, sudando y mirándose de reojo
shot(tw('Vor', 2), 'S', null, L => { city(); const a = put(XT[3], DT0 - 1.8, 0, -332, PI + .3), b = put(K[4], DT0 + 1.8, 0, -332, PI - .3); [a, b].forEach((c, i) => { actuar(c, L.lt, [[0, { aLx: 1.2, aRx: 1.2, aLz: -.2 + Math.abs(Math.sin(L.T * 10)) * .3, aRz: -.2 + Math.abs(Math.sin(L.T * 10)) * .3, aLe: 1.4, aRe: 1.4 }]], { T: L.T + i }); cara(c, L.T + i, { eyes: i ? 'side_l' : 'side_r', mouth: 'grimace' }); sweat(c, L.T + i); });
  cm([DT0, 5, -343, DT0, 4.6, -332, 44], [DT0, 5, -341, DT0, 4.6, -332, 42], L.k); sh(V(DT0, 0, -332), 20); }, [[0, 'clap', .6], [.4, 'clap', .5], [.9, 'gulp', .5], [1.3, 'clap', .4]]);
// 101 «Bis zum Mittag stand eine Schlange um den ganzen Block.»: plano aéreo de Hufenbach: una cola larguísima de gente con capas; «12:00»
shot(tw('Bis'), 'W', null, L => { town(); crowdGrid(26, 34, 2, 60, 2.6, PI, 0, 0); stands(L.T, 'sway', false); for (let i = 0; i < 6; i++) { const c = BG[i]; put(c, 25 + (i % 2) * 2, 0, 18 + i * 2.6, PI); capeOn(c); actuar(c, L.lt, [[0, 'idle']], { T: L.T + i }); cara(c, L.T + i, { expr: 'worried', mouth: 'flat' }); }
  const c = put(ich, 26, 0, 12, 0); actuar(c, L.lt, [[0, 'cross']], { T: L.T }); badge('num', '12:00', W / 2, H * .16, (L.lt - .4) * 3); cm([2, 46, 24, 26, 0, 64, 52], [4, 52, 20, 26, 0, 70, 50], L.k); sh(V(26, 0, 70), 120); }, [[0, 'whoosh', .4], [.4, 'crowd_murmur', .5], [1.0, 'bell', .6]]);
// 102 «Alle wollten in meine Liga.»: él les va poniendo capas negras y violetas
shot(tw('Alle'), 'C', null, L => { town(); const c = put(ich, 26, 0, 12, 0); actuar(c, L.lt, [[0, { aRx: 1.3, aRe: .3, aLz: .2 }]], { T: L.T }); smug(c, L.T);
  for (let i = 0; i < 4; i++) { const p = BG[i]; put(p, 26 + (i ? (i % 2 ? 1.4 : -1.4) : 0), 0, 16 + i * 2.6, PI); capeOn(p); p.props.wind = 1; actuar(p, L.lt, [[0, i ? 'idle' : 'cheer']], { T: L.T + i }); cara(p, L.T + i, { expr: i ? 'worried' : 'happy', mouth: i ? 'flat' : 'smile' }); }
  cm([33, 7, 8, 26, 4.4, 15, 46], [32, 7, 10, 26, 4.4, 15, 44], L.k); sh(V(26, 0, 14), 20); }, [[0, 'cloth', .6], [.5, 'cheer', .3], [1.0, 'cloth', .5]]);
// 103 «Dann ging ich ins Rathaus.»: camina por la plaza vacía hacia el Rathaus, de espaldas, la capa al viento
shot(tw('Dann', 4), 'W', null, L => { town(); const c = put(ich, -6, 0, -40 - L.lt * 4, PI); applyPose(c, walkP(L.T)); c.props.wind = 1.2;
  cm([-4, 6, -18, -6, 8, -80, 50], [-4, 6, -24, -6, 8, -80, 48], L.k); sh(V(-6, 0, -50), 40); }, [[0, 'footsteps', .6], [.8, 'wind', .4]]);
// 104 «Keine Wachen.»: la garita de la guardia, vacía: un montoncito de polvo y la gorra en el suelo
shot(tw('Keine'), 'C', null, L => { town(); show(BOOTH, 6, 0, -74, 0); show(PILES[0], 6, 0, -70.6, 0, .9); show(GCAP, 7.2, .1, -69.8, .4);
  orbit(V(6.5, 1.6, -71), lerp(9, 8, L.k), .5, .2, 44); sh(V(6, 0, -72), 20); }, [[0, 'wind', .5], [.3, 'silence_hit', .4]]);
// 105 «Niemand, der Nein sagte.»: sube la escalinata del Rathaus; las puertas se abren solas
shot(tw('Niemand'), 'S', null, L => { town(); const c = put(ich, -6, 0, -70 - L.lt * 3, PI); applyPose(c, walkP(L.T)); c.props.wind = .8;
  cm([-12, 4, -56, -6, 6, -80, 50], [-10, 4.4, -60, -6, 6, -82, 48], L.k); sh(V(-6, 0, -74), 30); }, [[0, 'door_creak', .6], [.6, 'footsteps', .4]]);
// 106 «Das war gestern.»: el Rathaus al atardecer con su pancarta; grúa hacia atrás
shot(tw('Das', 2), 'I', null, L => { town('dusk'); show(LBAN, -6, 31, -82.6, 0, .55);
  cm([-6, 14, -50, -6, 20, -84, 50], [-6, 22, -30, -6, 20, -84, 52], L.k); sh(V(-6, 0, -70), 60); }, [[0, 'whoosh', .4], [.5, 'bell', .5]]);
// 107 «Heute schreibe ich die neuen Regeln.»: en el despacho del alcalde, de noche, escribe en un pergamino «NEUE REGELN»
shot(tw('Heute', 2), 'F', null, L => { office(); show(DESK, TRX, 0, 4, 0); const c = put(ich, TRX, .8, -.4, 0); actuar(c, L.lt, [[0, { ...SIT, crouch: .7, aRx: 1.2, aRe: 1.2 + Math.sin(L.T * 9) * .15, aLx: .9, aLe: 1.4, lean: .25, headX: .35 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', mouth: 'smirk' }); c.props.wind = .1;
  badge('tag', 'NEUE REGELN', W / 2, H * .2, (L.lt - .5) * 3); cm([TRX + 3, 11, 13, TRX, 4.3, 4.4, 46], [TRX + 2, 10, 11.5, TRX, 4.3, 4.4, 44], L.k); sh(V(TRX, 0, 3), 20); }, [[0, 'quill', .7], [.6, 'quill', .6], [1.2, 'paper', .4]]);
// 108 «Ich habe nur noch nicht entschieden …» (zoom lento): levanta la mirada del papel, despacio
shot(tw('Ich', 8), 'Z', 'slow', L => { office(); show(DESK, TRX, 0, 4, 0); const c = put(ich, TRX, .8, -.4, 0); actuar(c, L.lt, [[0, { ...SIT, crouch: .7, aRx: 1.2, aRe: 1.2, aLx: .9, aLe: 1.4, lean: .25 - L.k * .25, headX: .35 - L.k * .45 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' }); purple(L, L.k * .6);
  cm([TRX, 7.4, 13, TRX, 6.2, -.4, 44], [TRX, 7, 9.5, TRX, 6.4, -.4, 38], L.k); sh(V(TRX, 0, 2), 20); }, [[0, 'tension', .5]]);
// 109 «was alles als Verbrechen zählt.»: te señala a ti (a cámara); oscuridad violeta; fin
shot(tw('was', 3), 'C', 'punch', L => { office(); show(DESK, TRX, 0, 4, 0); const c = put(ich, TRX, .8, -.4, 0); actuar(c, L.lt, [[0, { ...SIT, crouch: .7, aRx: 1.6, aRe: .05, aRz: -.05, aLx: .9, aLe: 1.4 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' }); purple(L, 1);
  DARK = clamp((L.lt - 1.1) / .5) * .6; cm([TRX + .5, 7, 9, TRX, 6.4, -.4, 40], [TRX + .3, 6.9, 8, TRX, 6.4, -.4, 36], L.k); sh(V(TRX, 0, 2), 20); }, [[0, 'impact', .7], [.3, 'braam', .6], [1.2, 'heartbeat', .5]]);
// ---------- portadas (fuera del vídeo) ----------
function coverTxt(l1, l2, y0 = .255) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * y0, 104, '#ffffff'], [l2, H * (y0 + .06), 92, '#E2FD07']]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .84 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .24; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }
window.renderCover = v => {
  const i = v === 0 ? 0 : S.findIndex(s => s.t0 === tw('Vier', 2)), T = S[i].t0 + (v === 0 ? 1.2 : .6);
  if (v === 0) COVER = { cam: () => cam([DT0 + 1, 8.5, -16], [DT0, 13, -40], 50) };
  else COVER = { cam: () => cam([TRX + 1, 5.2, 22], [TRX + 1, 3.2, 2], 44) };
  const f0 = S[i].fn; if (v === 1) S[i].fn = L => { f0(L); const c = hover(ich, TRX + 1, 3.2, -1, 0, L.T, { pose: { ...CROSS } }); smug(c, L.T); };
  renderShot(i, T, null, 0); COVER = null; S[i].fn = f0;
  octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H);
  if (v === 0) coverTxt('IN DIESER STADT', 'BIN ICH DER SUPERSCHURKE', .6); else coverTxt('VIER HELDEN.', 'VIER HAUFEN STAUB.', .55); };


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
  for (const c of POOL) if (c.root.visible && c.props.cape && c.props.cape.visible) c.props.cape.userData.sway(T + c.seed, c.props.wind ?? .5, c.props.fly ?? 0);
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

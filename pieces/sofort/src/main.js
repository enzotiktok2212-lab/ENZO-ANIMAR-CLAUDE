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

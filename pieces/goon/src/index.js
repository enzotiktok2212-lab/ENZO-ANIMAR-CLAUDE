// GOON — «In dieser Stadt kommst du fürs Goonen ins Gefängnis»: planos sincronizados con audio/words.json (1080×1920, 30 fps).
// Réplica de la estructura del vídeo de referencia en Hufenbach (pueblo alemán de entramado), con el número sobre la cabeza en vez del reloj. Los planos están en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT } from './props.js';
import { makeOma, makeKumpel, makeLena, makeSie, makeEr, makeKassiererin, makeFahrer, makePapa, makeMayor } from './gvolk.js';
import { hufenbach, zimmer, baeckerei, townhouse } from './gort.js';
import { crowd } from './hsets.js';
import { makeKid, makeCop, makeHelga, makePfeiffer, makeApothekerin, makeHaeftling, makeWilli } from './gcast.js';
import { numSprite, numTex, tissueBox, tissueBall, bins, polizei, fleet, polDrone, polDog, wurstWagen, knast, zelle, apotheke, drogerie, keller, bruecke, banner, stoneMitts, scooter, phone, doener, boxPile } from './gsets.js';
import { mustache, txt } from './props.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 133.2, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
const SPOTL = new THREE.SpotLight(0xfff2c8, 0, 80, .5, .5, 1.1); scene.add(SPOTL, SPOTL.target);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
const KX = 700, ZLX = 1000, APX = 1300, DRX = 1600, KEX = 1900, BRX = 2300, ZMX = 2700, BKX = 3000;
const HB = hufenbach(scene), KN = knast(scene, KX), ZL = zelle(scene, ZLX), AP = apotheke(scene, APX), DR = drogerie(scene, DRX), KE = keller(scene, KEX), BR = bruecke(scene, BRX), ZM = zimmer(scene, ZMX), BK = baeckerei(scene, BKX);
const SETS = { HB: HB.G, KN: KN.g, ZL: ZL.g, AP: AP.g, DR: DR.g, KE: KE.g, BR: BR.g, ZM: ZM.g, BK: BK.g };
for (const k in SETS) outline(SETS[k], 1.4);
[HB.RANK, HB.KINO, HB.BOX, HB.PRICE].forEach(o => o.visible = false);
// Hufenbach: cartel GOONEN VERBOTEN en el Rathaus, balcón del alcalde, contenedores, quiosco de döner
const RHB = banner('GOONEN', 'VERBOTEN!', 22, 9); RHB.position.set(-6, 17.6, -82.4); RHB.scale.setScalar(.8); HB.G.add(RHB);
const BALC = new THREE.Group(); BALC.position.set(-6, 0, -92 + 7.2); HB.G.add(BALC); box(12, .8, 5, mat(0xf4f2ee), .1, BALC, 0, 10.4, 1.8); for (let k = 0; k < 13; k++) cyl(.12, .12, 2.4, mat(0xe9c23a, { metalness: .8 }), 6, BALC, -5.6 + k * .93, 12, 4.1); const hr_ = cyl(.16, .16, 12, mat(0xe9c23a, { metalness: .8 }), 8, BALC, 0, 13.2, 4.1); hr_.rotation.z = Math.PI / 2;
// relleno para que el pueblo se vea lleno: casas en el hueco del cine, filas detrás del Rathaus y detrás de las filas laterales, bloques altos al fondo
townhouse(HB.G, -64, -21, 13, 3, 11, Math.PI / 2); townhouse(HB.G, -64, -34.5, 13, 2, 12, Math.PI / 2);
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3) + (Math.abs(x + 6) < 30 ? 1 : 0), 20 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 30 + i, Math.PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 40 + i, -Math.PI / 2); }
for (let i = 0, x = -140; x <= 140; x += 20, i++) townhouse(HB.G, x, -170, 18, 4 + (i % 3), 50 + i, 0);
const BINS = bins(HB.G, -40, -14, Math.PI / 2, true); const DOEN = doener(HB.G, 40, 40, -Math.PI / 2);
const PLZ = banner('GOONEN', 'VERBOTEN!', 10, 4.4); PLZ.position.set(-30, 7, 18); PLZ.rotation.y = Math.PI / 2; HB.G.add(PLZ); for (const s of [-1, 1]) cyl(.18, .18, 9, mat(0x5a5e68), 6, HB.G, -30.1, 4.5, 18 + s * 4.6);
// ventanas encendidas de noche (casas de la plaza)
const NWIN = []; HB.W.forEach((h, i) => { if (!h) return; });
const FLEET = fleet(scene, 20);
// multitud instanciada para los planos generales de la plaza (sin gorros), con números flotando encima
const CRW = crowd(scene, 90); CRW.g.children[3].visible = false; (() => { const r = RNG(31); CRW.seat.forEach((s, i) => { const grp = i % 9, gx = [-36, -22, -8, 12, 30, -30, -14, 18, 34][grp], gz = [-30, -50, -56, -52, -24, 6, -4, -20, 0][grp]; s.x = gx + (r() - .5) * 9; s.y = 0; s.z = gz + (r() - .5) * 8; s.ry = r() * 6.28; }); })();
const NUMX = Array.from({ length: 40 }, (_, i) => { const s = numSprite(); scene.add(s); const v = [0, 0, 0, 2, 0, 0, 7, 0, 0, 0, 13, 0, 0, 3, 0, 0, 0, 48, 0, 0][i % 20]; s.userData.v = v; return s; });
function crowdOn(T, mode = 'sway', n = 90) { CRW.update(T, mode, false, n); NUMX.forEach((s, i) => { const st = CRW.seat[i * 2]; if (!st || i * 2 >= n) { s.visible = false; return; } s.visible = true; s.material.map = numTex(s.userData.v, s.userData.v ? 'red' : 'zero'); s.position.set(st.x, 6.4 + Math.sin(T * 3 + i) * .08, st.z); s.scale.set(2.2, 1.72, 1); }); }
// ---------- reparto ----------
const ich = makeKid(scene), mayor = makeMayor(scene), helga = makeHelga(scene), pfeif = makePfeiffer(scene), apo = makeApothekerin(scene), haeft = makeHaeftling(scene), willi = makeWilli(scene), papa = makePapa(scene);
mustache(mayor.head, 0xbababa);
const COP = Array.from({ length: 4 }, (_, i) => makeCop(scene, i));
const K = Array.from({ length: 8 }, (_, i) => makeKumpel(scene, i)); const XT = [makeLena(scene), makeSie(scene), makeEr(scene), makeKassiererin(scene), makeFahrer(scene), makeOma(scene)];
kitFace(ich, 'kid'); kitFace(mayor, 'mustache'); kitFace(helga, 'girl'); kitFace(pfeif, 'mustache'); kitFace(apo, 'girl'); kitFace(haeft, 'plain'); kitFace(willi, 'villain'); kitFace(papa, 'mustache');
COP.forEach((c, i) => kitFace(c, ['hero', 'plain', 'hero', 'mustache'][i]));
K.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'plain', 'girl', 'girl', 'kid', 'hero'][i])); XT.forEach((c, i) => kitFace(c, ['girl', 'girl', 'kid', 'girl', 'plain', 'girl'][i]));
const POOL = [ich, mayor, helga, pfeif, apo, haeft, willi, papa, ...COP, ...K, ...XT]; POOL.forEach(c => outline(c.root, 2));
const NUM = new Map(); POOL.forEach(c => { const s = numSprite(); c.head.add(s); s.position.set(0, 3.3 / (c.spec.headScale || 1), 0); NUM.set(c, s); });
// num(ch, n, kind, k): enseña el número encima de la cabeza; k = tiempo desde que aparece (pop)
const num = (ch, n, k = 1, kind) => { const s = NUM.get(ch); s.visible = true; s.material.map = numTex(n, kind || (n === 0 ? 'zero' : 'red')); const p = spring(clamp(k) * 1.6), wx = String(n).length > 2 ? 2 : 1; s.scale.set(2.2 * p * wx, 1.72 * p, 1); s.position.y = 3.3 + Math.sin((k + ch.seed) * 3) * .06; };
const MITT = new Map([[haeft, stoneMitts(haeft)], [mayor, stoneMitts(mayor)], [helga, stoneMitts(helga)]]);
const mitts = ch => MITT.get(ch).forEach(m => m.visible = true);
// ---------- atrezo ----------
const WAGEN = wurstWagen(scene); outline(WAGEN, 1.6); const PCAR = [polizei(scene), polizei(scene)]; PCAR.forEach(c => outline(c, 1.6));
const DRONES = [polDrone(scene), polDrone(scene), polDrone(scene)]; DRONES.forEach(d => outline(d, 1.4)); const DOG = polDog(scene); outline(DOG.root, 1.6);
const TBOX = [tissueBox(scene, 1), tissueBox(scene, 1, 0xff8ad0), tissueBox(scene, 1, 0x2ab86a)]; TBOX.forEach(t => outline(t, 1.4));
const BALLS = Array.from({ length: 16 }, () => { const b = tissueBall(scene, 1.2); outline(b, 1); return b; });
const ROLLER = scooter(scene); outline(ROLLER, 1.4); const PHONE = phone(scene); const PHONE2 = phone(scene);
const DOUGH = (() => { const d = sphere(1, mat(0xf4e4c0, { roughness: .9 }), scene, 0, 0, 0, 18, 12); d.scale.set(1.6, .55, 1.3); outline(d, 1.2); return d; })();
const CAMS = Array.from({ length: 2 }, () => { const g = new THREE.Group(); scene.add(g); box(1.6, .9, .9, mat(0xf4f4f4), .2, g, 0, 0, 0); const l = cyl(.3, .3, .3, mat(0x101014), 12, g, 0, 0, .6); l.rotation.x = Math.PI / 2; sphere(.1, new THREE.MeshBasicMaterial({ color: 0xff2020 }), g, .5, .3, .46, 6, 4); box(.2, 1.2, .2, mat(0x6a6e78), .05, g, 0, .8, -.3); outline(g, 1.2); return g; });
const CASH = Array.from({ length: 12 }, () => { const b = box(1.3, .04, .65, mat(0x5ab84a, { roughness: .8, side: THREE.DoubleSide }), .01, scene, 0, 0, 0); return b; });
const CONF = Array.from({ length: 40 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const ZZZ = Array.from({ length: 3 }, () => { const p = textPlane(1.2, 1.2, 64, 64, (c, w, h) => { c.font = `700 56px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 8; c.strokeStyle = '#1a1a2a'; c.strokeText('Z', w / 2, h / 2); c.fillStyle = '#ffffff'; c.fillText('Z', w / 2, h / 2); }); p.material.depthWrite = false; scene.add(p); return p; });
const BEAM = (() => { const m = new THREE.Mesh(new THREE.ConeGeometry(3.4, 22, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff6c8, transparent: true, opacity: .14, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false })); m.geometry.translate(0, -11, 0); scene.add(m); return m; })();
const PROPS = [WAGEN, ...PCAR, ...DRONES, DOG.root, ...TBOX, ...BALLS, ROLLER, PHONE, PHONE2, DOUGH, ...CAMS, ...CASH, ...CONF, ...DUST, ...SWEAT, ...ZZZ, BEAM];
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.25; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.55, .62, .42); sun.intensity = 2.5; sun.color.setRGB(1, .95, .86); rim.intensity = 1.0;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function sunset() { day(); MODE = 'sunset'; setSky([.22, .32, .78], [.85, .55, .7], [1, .72, .45]); sun.color.setRGB(1, .82, .62); sun.intensity = 2.3; hemi.color.setRGB(1, .9, .85); scene.fog.color.setRGB(1, .82, .7); bloom.strength = .2; }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.0; setSky([.02, .04, .16], [.08, .12, .34], [.2, .22, .46]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.0; hemi.color.setRGB(.6, .7, 1); hemi.groundColor.setRGB(.25, .25, .36); sun.intensity = 1.1; sun.color.setRGB(.72, .78, 1); rim.intensity = 1.7;
  scene.fog.color.setRGB(.1, .14, .28); scene.fog.density = .0011; bloom.strength = .3; bloom.threshold = .85; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = .95, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .2; bloom.threshold = .88; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } NUM.get(c).visible = false; }
  MITT.forEach(ms => ms.forEach(m => m.visible = false));
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  DRONES.forEach(d => d.userData.beam(true)); FLEET.show(0); CRW.update(0, 'still', false, 0); NUMX.forEach(s => s.visible = false); KE.pile.set(0); KN.SPOT.intensity = 0; KN.beam.visible = false; SPOTL.intensity = 0; DR.DOOR.rotation.y = 0;
  for (const k in SETS) SETS[k].visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = 1.08; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; THERM = false; BIRDSON = 1; SHAKE = 0; day(); }
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
// encuadre frontal: cámara a 'dist' delante del personaje (según su ry), un poco a un lado, mirando a la cabeza
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .3 + dy, h.z + fz * d - fx * side], [h.x, h.y - .5, h.z], fov); }
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
function confetti(c, T0, T, n = 60, spread = 1) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = (3 + r() * 6) * spread; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
function confRain(c, T, n = 60, sx = 20, sz = 20, h = 16) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 13 + 7); f.visible = true; const y = h - ((T * (3 + r() * 2) + r() * h) % h); f.position.set(c.x + (r() - .5) * sx + Math.sin(T * 2 + i) * .5, c.y + y, c.z + (r() - .5) * sz); f.rotation.set(T * 3 + i, T * 5 + i, 0); }); }
// fuegos artificiales: estallidos en el cielo
function fireworks(c, T, n = 3, R = 14) { FW.forEach((s, i) => { const b = i % n, k = Math.floor(i / n), per = 1.6, t = ((T + b * .53) % per) / per, r0 = RNG(b * 17 + Math.floor((T + b * .53) / per) * 31); const cx = c.x + (r0() - .5) * 60, cy = c.y + 30 + r0() * 20, cz = c.z + (r0() - .5) * 20;
  const a = k / (FW.length / n) * 6.283, el = Math.sin(k * 2.3) * .8; s.visible = t > .25; const e = easeOut((t - .25) / .75) * R; s.position.set(cx + Math.cos(a) * Math.cos(el) * e, cy + Math.sin(el) * e - t * t * 4, cz + Math.sin(a) * Math.cos(el) * e); s.scale.setScalar(1 - t * .8); s.material.color.setHSL((b * .27 + .05) % 1, 1, .6).multiplyScalar(2.5); }); }
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.7 + t * 2) * s * (.8 + r() * .5)); d.material.opacity = .55 * (1 - t / 1.2); }); }
function notes(p, T) { NOTES.forEach((z, i) => { const k = (T * .7 + i / 4) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 2 + T) * 1.5, p.y + k * 4, p.z + .5); z.scale.setScalar(.6 + k * .6); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
function hearts(p, T) { HEARTS.forEach((z, i) => { const k = (T * .6 + i / 5) % 1; z.visible = true; z.position.set(p.x + Math.sin(i * 1.7 + T) * 1.4, p.y + k * 3.4, p.z + .4); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));

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
  else if (b.kind === 'huss') { c.rotate(-.12); c.font = `700 64px ${FONT}`; c.lineWidth = 16; c.strokeStyle = '#1a1a2a'; c.strokeText(b.text, 0, 0); c.fillStyle = '#ffffff'; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  c.restore(); }
const KEY = /^(Stadt|Goonen|Gefängnis|Drei|Jahre|Goon-Knast|Fäustlinge|Stein|jeder|Kopf|Null|Taschentücher|Apotheke|Ausweis|Drogeriemarkt|Tresor|Mützen|verboten|tippt|verdächtigt|Gestern|Helga|abgeführt|Pizzateig|Eins|Bürgermeister|leuchtende|Vorbild|Polizeidrohnen|Kopf|nicht|Mülltonnen|Taschentüchern|Polizei|Kameras|Spürhunde|Wärmebilder|Nichts|halb|vier|Drohnen|Currywurstwagen|Currywurst|Achtzig|Euro|Schlange|Dönerladen|Nachbar|Allergie|fünfzehn|geniest|Papa|Bett|Roller|Hecke|Brücke|Bahnhof|Polizisten|Bratwurst|Fabrik|Keller|Rathaus|Kartons|Decke|Plakat|Unterschrift|Geldscheine|erfunden|Einziger|filmen|schneller|Hundert|Zweihundert|Dreihundert|plötzlich|Zahl|Eins|erstarrte|Geld|Zwei|Drei|Vier|zwanzig|Polizeiwagen|Goon-Polizei|Turm|krachte|Steinfäustlingen|Gesetz|abgeschafft|immer)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0, THERM = false; const COVERS = [];
// Hufenbach (x = 0): plaza adoquinada x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (x = -6, fachada z ≈ -84, balcón y = 10,4, cartel GOONEN VERBOTEN);
// fuente (-18, -24); café (36, -40); contenedores (-40, -14); cartel de la plaza (-30, 18); döner (40, 40); carretera x = 26 hacia +z; mi casa (4, 96, mira a +x).
let LMODE = 'day'; const town = (m = 'day') => { use('HB'); LMODE = m; if (m === 'night') night(45); else if (m === 'morning') sunset(); else day(); };
// ---------- a: gancho, la cárcel, el número sobre la cabeza (0 – 15,65 s) ----------
const walkC = (ch, lt, x, z, ry, sp = 3.4, T, extra) => caminar(ch, lt, { x, z, ry, speed: sp, accel: .05, T, extra });
const crowdWalk = (L, list, x0, z0, ry, nums, sp = 3.2) => list.forEach((c, i) => { const r = RNG(i * 13 + 5); walkC(c, L.lt + r() * .4, x0 + (i % 4 - 1.5) * 4 + (r() - .5) * 1.5, z0 - Math.floor(i / 4) * 5 + r() * 2, ry + (r() - .5) * .3, sp * (.85 + r() * .3), L.T + i);
  if (nums) num(c, nums[i % nums.length], 1); cara(c, L.T + i, { expr: 'smile' }); });
// 1 «In dieser Stadt kommst du»: un preso con su 1353 corre hacia cámara por la plaza; tres policías y dos drones le persiguen; los del 0 se apartan y miran
shot(0, 'Z', 'slow', L => { town(); crowdOn(L.T, 'sway', 90); NUMX.forEach(s => s.visible = false); const z = -50 + L.lt * 8.5; caminar(haeft, L.lt + .4, { x: -4, z: -53.4, ry: 0, speed: 8.5, run: true, accel: .05, T: L.T }); num(haeft, 1353, 1); cara(haeft, L.T, { expr: 'panic', eyes: 'terror', mouth: 'scream' }); sweat(haeft, L.T, 2);
  COP.slice(0, 3).forEach((c, i) => { caminar(c, L.lt + .4, { x: -4 + (i - 1) * 3.2, z: -61 - (i % 2) * 2, ry: 0, speed: 8.5, run: true, accel: .05, T: L.T + i }); cara(c, L.T, { expr: 'shout', mouth: 'talk_wide' }); });
  [[K[0], -11, -40], [XT[0], 3.4, -38], [K[4], -11.4, -30], [XT[1], 4, -28], [K[6], -12, -22], [XT[3], 4.6, -20]].forEach(([c, x, zz], i) => { put(c, x, 0, zz, x < -4 ? PI / 2 - .3 : -PI / 2 + .3); actuar(c, L.lt, [[0, i % 2 ? 'shock' : 'point']], { T: L.T + i }); num(c, 0, 1); cara(c, L.T, { expr: 'gasp' }); });
  const hz = haeft.root.position.z; DRONES.slice(0, 2).forEach((d, i) => { show(d, -4 + (i ? 3 : -3), 12 + i, hz - 3 - i * 2); d.userData.spin(L.T + i); d.userData.beam(true, 11 + i); });
  cam([-4, 6, hz + lerp(26, 19, easeIn(L.k))], [-4, 3.8, hz - 2], 46); sh(V(-4, 0, hz - 4), 40); }, [[0, 'siren', .5], [.1, 'drone', .5], [.3, 'steps_run', .6], [.5, 'shout_m', .4]]);
// 2 «fürs Goonen»: le alcanzan: dos policías le agarran y el 1353 rojo brilla; la gente con su 0 le señala
shot(1.2, 'W', 'punch', L => { town(); const m = put(haeft, -12, 0, -20, .3); num(m, 1353, 1); actuar(m, L.lt, [[0, 'recoil'], [.3, 'cower', { dur: .3 }]], { T: L.T, extra: shiver(L.T, 1) }); cara(m, L.T, { expr: 'scared', eyes: 'terror', mouth: 'grimace_wide' }); sweat(m, L.T, 2);
  [[COP[0], -1], [COP[1], 1]].forEach(([c, s], i) => { put(c, -12 + s * 2.9, 0, -20.8, .3 - s * 1.3); actuar(c, L.lt, [[0, { aLx: 1.4, aRx: 1.4, aLe: .4, aRe: .4, lean: .15 }]], { T: L.T + i }); cara(c, L.T, { expr: 'angry' }); });
  [[K[2], -19, -12, .8], [XT[1], -5, -11, -.6], [K[4], -16, -9, .5]].forEach(([c, x, z, ry], i) => { put(c, x, 0, z, ry + PI); c.root.rotation.y = faceTo(c.root.position, V(-12, 0, -20)); actuar(c, L.lt, [[0, i === 1 ? 'shock' : 'point']], { T: L.T + i }); num(c, 0, 1); cara(c, L.T, { expr: 'shock' }); });
  const d = DRONES[0]; show(d, -12, 12, -21); d.userData.spin(L.T); d.userData.beam(true, 11.5);
  orb(L.k, V(-12, 3.4, -18), null, [19, .25, .12, 48], [17, .18, .1, 48]); sh(V(-12, 0, -18), 30); }, [[0, 'impact', .5], [.05, 'pling', .4], [.2, 'gasp_f', .4], [.4, 'cuffs', .5]]);
// 3 «ins Gefängnis» (zoom lento): el coche de policía llega al Goon-Knast al atardecer; el foco de la torre barre la entrada
shot(1.98, 'F', 'slow', L => { use('KN'); sunset(); KN.SPOT.intensity = 1800; KN.beam.visible = true; KN.beam.rotation.set(.9, Math.sin(L.T * 1.2) * .5 - .5, 0);
  const c = PCAR[0]; const z = lerp(36, 6, easeOut(clamp(L.lt / 1.0))); show(c, KX + 3, 0, z, PI); c.userData.set(L.T);
  const p = put(haeft, KX - 3, 0, -9 + L.lt * 2, PI); caminar(p, L.lt, { x: KX - 2, z: 2, ry: PI, speed: 3, T: L.T, extra: { aLx: .3, aRx: .3, aLz: -.3, aRz: -.3, headX: .3 } }); num(p, 1353, 1);
  put(COP[2], KX - 4.4, 0, 3.4 - L.lt * 3, PI - .2); caminar(COP[2], L.lt, { x: KX - 4.6, z: 4.4, ry: PI, speed: 3, T: L.T });
  cm([KX + 18, 6, 44, KX, 9, -14, 46], [KX + 12, 5, 30, KX, 10, -14, 44], L.k); sh(V(KX, 0, 0), 50); }, [[0, 'flash', .4], [.1, 'siren', .5], [.6, 'door_slam', .5]]);
// 4 «Drei Jahre Goon-Knast»: en la celda, el preso agarrado a los barrotes; palitos en la pared y cartel 3 JAHRE
shot(3.28, 'C', 'punch', L => { use('ZL'); inside(.9, 40); const p = put(haeft, ZLX + .75, 0, 5.2, 0); num(p, 1353, 1); applyPose(p, { aLx: 1.9, aRx: 1.9, aLz: .3, aRz: .3, aLe: .8, aRe: .8, headX: .15, lean: .08 }); mitts(p); cara(p, L.T, { expr: 'sad', eyes: 'down', mouth: 'frown' });
  badge('red', '3 JAHRE', W / 2, H * .3, (L.lt - .1) * 3, 1, .85); cm([ZLX + 1.4, 5.2, 17, ZLX + .75, 4.6, 4, 44], [ZLX + .9, 4.8, 13.5, ZLX + .75, 4.8, 4, 42], L.k); sh(V(ZLX, 0, 4), 20); }, [[0, 'metal_hit', .5], [.2, 'sigh', .4]]);
// 5 «und so lange musst du»: intenta comer con las manoplas de piedra: la cuchara se le cae
shot(4.76, 'W', null, L => { use('ZL'); inside(.9, 40); const p = put(haeft, ZLX - 3, 0, -4.6, .2); num(p, 1353, 1); mitts(p); const k = Math.sin(L.lt * 6) * .2;
  applyPose(p, { aRx: 1.3 + k, aRe: 1.2, aRz: -.2, aLx: .9, aLe: 1.2, aLz: -.3, headX: .25, lean: .1, crouch: .1 }); cara(p, L.T, { expr: 'worried', mouth: 'grimace' }); sweat(p, L.T, 1);
  const f = clamp((L.lt - .45) / .4); show(TBOX[0], ZLX - 3, 2.9, -2.4, 0, .01); const w = loc(p, 1.4, 2.6 - f * 2.4, 2.2); show(CASH[0], w.x, Math.max(.1, w.y), w.z, f * 4);
  orb(L.k, V(ZLX - 3, 3.6, -4), null, [12, .2, .16, 44], [11, .3, .14, 44]); sh(V(ZLX, 0, -4), 20); }, [[0, 'swipe', .4], [.5, 'clack', .5], [.8, 'sigh', .3]]);
// 6 «Fäustlinge aus Stein tragen»: golpe de las manoplas de piedra contra el banco: polvo
shot(5.86, 'R', 'punch', L => { use('ZL'); inside(.9, 40); const p = put(haeft, ZLX - 3, 0, -4.4, .1); num(p, 1353, 1); mitts(p); const hit = clamp((L.lt - .2) / .15);
  applyPose(p, { aLx: lerp(2.4, 1.1, hit), aRx: lerp(2.4, 1.1, hit), aLe: .4, aRe: .4, lean: lerp(-.1, .3, hit), headX: .2, crouch: .15 * hit }); cara(p, L.T, { expr: hit > .9 ? 'shock' : 'angry' }); 
  badge('tag', 'STEIN', W / 2, H * .2, (L.lt - .4) * 3); orb(L.k, V(ZLX - 3, 3.0, -3.6), null, [13, .7, .2, 44], [12, .6, .2, 44]); sh(V(ZLX, 0, -4), 20); }, [[0, 'whirl', .3], [.33, 'slam', .7], [.36, 'thud', .5]]);
// 7 «Und erwischt wird hier jeder»: un dron de la policía baja sobre la plaza y su foco barre a la gente, que se aparta
shot(7.54, 'Z', null, L => { town(); const d = DRONES[0]; show(d, -8 + Math.sin(L.T) * 3, 15 - L.k * 2, -12); d.userData.spin(L.T); d.userData.beam(true, 14);
  [K[0], XT[2], K[6], XT[4], K[1]].forEach((c, i) => { const a = i / 5 * 6.28; put(c, -8 + Math.cos(a) * 6, 0, -12 + Math.sin(a) * 5, a + PI / 2); actuar(c, L.lt, [[0, i % 2 ? 'cower' : 'shock']], { T: L.T + i }); num(c, 0, 1); cara(c, L.T, { expr: 'scared' }); });
  orb(L.k, V(-8, 8, -12), null, [26, .4, .18, 50], [23, .3, .2, 50]); sh(V(-8, 0, -12), 30); }, [[0, 'zoom_in', .4], [.1, 'drone', .6], [.4, 'scan', .5]]);
// 8 «Denn über deinem Kopf steht»: a un vecino le aparece de golpe un 3 rojo encima; se tapa la cabeza
shot(9.33, 'W', 'punch', L => { town(); const c = put(K[3], -24, 0, 6, .4); num(c, 3, (L.lt - .25) * 4); actuar(c, L.lt, [[0, 'idle'], [.3, 'hands_head', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: L.lt > .3 ? 'shock' : 'smile' });
  onFace(c, 11, -1.4, .6, 42, L.k, 10); sh(V(-24, 0, 6), 30); }, [[0, 'swipe', .3], [.25, 'pling', .6], [.4, 'gasp_f', .4]]);
// 9 «wie oft du es getan hast»: una mujer pasa con un 7 enorme; los demás se giran y se ríen
shot(10.57, 'S', null, L => { town(); walkC(XT[3], L.lt, 18, -30, -PI / 2 - .2, 2.6, L.T); num(XT[3], 7, 1); cara(XT[3], L.T, { expr: 'worried', eyes: 'side_l' }); sweat(XT[3], L.T, 2);
  [[K[7], 12, -37], [K[2], 20, -37]].forEach(([c, x, z], i) => { put(c, x, 0, z, faceTo(V(x, 0, z), V(14, 0, -30))); actuar(c, L.lt, [[0, i ? 'point' : 'hands_face']], { T: L.T }); num(c, 0, 1); laughF(c, L.T + i); });
  orb(L.k, V(16, 3.4, -30), V(14.6, 3.4, -30), [15, -.5, .1, 46], [14, -.6, .1, 46]); sh(V(12, 0, -30), 30); }, [[0, 'swipe', .4], [.3, 'laugh_m', .4], [.6, 'kids_laugh', .3]]);
// 10 «Deshalb läuft hier jeder Erwachsene»: travelling por la plaza: todos caminan con su 0 verde, sacando pecho
shot(12.01, 'F', null, L => { town(); crowdWalk(L, [K[0], XT[0], K[1], XT[1], K[5], XT[4], K[6], XT[2]], -8, -30, 0, [0], 3.0); const x = lerp(-18, -2, easeInOut(L.k));
  cam([x, 6, 4 - L.k * 3], [-8, 3, -26], 50); sh(V(-8, 0, -8), 30); }, [[0, 'flash', .3], [.1, 'steps', .5], [.8, 'murmur', .3]]);
// 11 «mit einer stolzen Null»: Herr Pfeiffer saca pecho y se señala su 0 brillante con los pulgares
shot(13.65, 'Z', 'punch', L => { town(); const c = put(pfeif, -6, 0, 10, .2); num(c, 0, 1); actuar(c, L.lt, [[0, 'idle'], [.1, { aLx: 1.6, aRx: 1.6, aLz: .2, aRz: .2, aLe: 2.3, aRe: 2.3, lean: -.18, headX: -.15 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'smug', eyes: 'half', mouth: 'smirk' });
  onFace(c, 10, -1.2, .8, 42, L.k, 9); sh(V(-6, 0, 10), 30); }, [[0, 'impact_soft', .5], [.2, 'sparkle', .5], [.5, 'hmm', .3]]);
// ---------- b: pañuelos con carné, Tresor, gorros prohibidos, teclear rápido, Tante Helga, el alcalde y los drones (15,65 – 39,6 s) ----------
const HAT = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0x2a6ad8, { roughness: 1 }); const c = new THREE.Mesh(new THREE.SphereGeometry(.85, 20, 12, 0, 6.283, 0, 1.6), m); c.scale.set(1, 1.05, 1); g.add(c); cyl(.88, .88, .35, mat(0xf4f4f4, { roughness: 1 }), 20, g, 0, .05, 0); sphere(.32, mat(0xf4f4f4, { roughness: 1 }), g, 0, .95, 0, 10, 8); outline(g, 1.4); return g; })();
PROPS.push(HAT);
// 12 «Taschentücher gibt's in der Apotheke»: una clienta enseña el carné; la farmacéutica lo escanea con cara de sospecha
shot(15.65, 'W', null, L => { use('AP'); inside(1.0, 50); const a = put(apo, APX - 4, 0, -4.4, .35); actuar(a, L.lt, [[0, { aRx: 1.2, aRe: .6, aRz: -.2, headX: .2 }], [.6, { aRx: .9, aRe: 1.4, headX: .1, headY: .3 }, { dur: .3 }]], { T: L.T }); num(a, 0, 1); cara(a, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' });
  const c = put(XT[3], APX - 6.4, 0, 2.6, PI - .45); actuar(c, L.lt, [[0, { aRx: 1.5, aRe: .3, lean: .12 }]], { T: L.T }); num(c, 0, 1); cara(c, L.T, { expr: 'worried' }); attach(PHONE, c.aR.hand, [0, -.6, .3], [-PI / 2, 0, 0], .9);
  AP.SCR.material.emissive.setHex(L.lt > .9 ? 0x3aff6a : 0x3ad8ff);
  orb(L.k, V(APX - 2.8, 4.6, -.8), null, [16, .55, .14, 46], [14.5, .45, .12, 46]); sh(V(APX - 4, 0, 0), 20); }, [[0, 'swipe', .4], [.3, 'scan', .5], [.9, 'pling', .5]]);
// 13 «nur gegen Ausweis»: la farmacéutica le da UN solo pañuelo con pinzas; la clienta lo mira decepcionada
shot(17.37, 'C', 'punch', L => { use('AP'); inside(1.0, 50); const a = put(apo, APX + 1, 0, -4.4, -.1); actuar(a, L.lt, [[0, { aRx: 2.6, aRe: .3, aRz: .2, lean: .05 }]], { T: L.T }); num(a, 0, 1); cara(a, L.T, { expr: 'smug' });
  const t = loc(a, 1.4, 6.4, 1.2); BALLS.slice(0, 1).forEach(b => show(b, t.x, t.y, t.z, L.T, 1));
  badge('tag', 'AUSWEIS?', W / 2, H * .19, (L.lt - .15) * 3); onFace(a, 10, 1.0, -1.2, 42, L.k, 9); sh(V(APX + 1, 0, -2), 20); }, [[0, 'impact_soft', .4], [.4, 'paper', .5]]);
// 14 «im Drogeriemarkt»: pasillo rosa de la droguería; al fondo, el Tresor con su volante dorado
shot(18.43, 'S', null, L => { use('DR'); inside(1.0, 45); const e = put(K[5], DRX + 5.4, 0, -9.6, -PI / 2 - .5); actuar(e, L.lt, [[0, { aLx: 1.6, aRx: 1.6, aLe: .5, aRe: .5, lean: .1 }]], { T: L.T }); num(e, 0, 1); cara(e, L.T, { expr: 'determined' }); DR.wheel.rotation.z = L.T * 3;
  walkC(XT[0], L.lt, DRX - 7, 0, PI - .5, 2.2, L.T); num(XT[0], 0, 1); cara(XT[0], L.T, { expr: 'neutral' });
  cm([DRX - 3, 6, 18, DRX, 6.5, -12, 46], [DRX - 1, 6, 12, DRX, 6.5, -12, 44], L.k); sh(V(DRX, 0, -8), 30); }, [[0, 'whoosh_soft', .4], [.2, 'ratchet', .5], [.6, 'gears', .4]]);
// 15 «sind sie im Tresor eingeschlossen»: la puerta blindada se abre: detrás de barrotes, las cajas de pañuelos
shot(19.59, 'Z', 'slow', L => { use('DR'); inside(1.0, 45); DR.DOOR.rotation.y = -easeOut(clamp(L.lt / 1.0)) * 1.7; DR.wheel.rotation.z = L.T * 4;
  const e = put(K[5], DRX + 6, 0, -9.4, -PI / 2 - .3); actuar(e, L.lt, [[0, { aLx: 1.4, aLe: .6, aLz: .3 }], [.6, 'shock']], { T: L.T }); num(e, 0, 1); cara(e, L.T, { expr: 'gasp' });
  cm([DRX + .5, 7, 4, DRX, 6.4, -14, 46], [DRX + .3, 6.8, 0, DRX, 6.4, -14, 42], L.k, easeIn); sh(V(DRX, 0, -12), 20); }, [[.05, 'metal_creak', .6], [.4, 'gears', .4]]);
// 16 «Mützen sind verboten»: un policía le arranca el gorro a un chico: debajo asoma su 2
shot(20.78, 'R', 'punch', L => { town(); const c = put(K[6], 6, 0, -30, .3); const off = clamp((L.lt - .35) / .25);
  if (off < 1) { attach(HAT, c.head, [0, 1.2, 0], [0, 0, 0], 1); } else { const w = loc(COP[1], 1.6, 6.4, 1); show(HAT, w.x, w.y, w.z, L.T * 4, .9); num(c, 2, (L.lt - .6) * 4); }
  actuar(c, L.lt, [[0, 'idle'], [.6, 'hands_head', { dur: .25 }]], { T: L.T }); cara(c, L.T, { expr: off >= 1 ? 'shock' : 'worried' });
  const p = put(COP[1], 9.4, 0, -28.8, -PI / 2 - .5); actuar(p, L.lt, [[0, { aRx: 1.6, aRe: .3, lean: .1 }], [.35, { aRx: 2.8, aRz: .3, aRe: .1, lean: -.1 }, { dur: .2 }]], { T: L.T }); cara(p, L.T, { expr: 'angry' });
  orb(L.k, V(7.6, 3.8, -29.4), null, [15, .1, .1, 46], [13.5, .05, .1, 46]); sh(V(7, 0, -29), 30); }, [[0, 'whirl', .3], [.35, 'cloth', .6], [.62, 'pling', .5], [.7, 'gasp_f', .4]]);
// 17 «Wer zu schnell tippt»: un chico en un banco teclea a toda velocidad en el móvil
shot(22.16, 'W', null, L => { town(); const c = put(K[1], -18, 1.5, -15.6, 0); applyPose(c, { lLx: 1.5, rLx: 1.5, lLk: 1.5, lRx: 1.5, lRk: 1.5, hipY: 1.55, aLx: 1.0, aRx: 1.0, aLz: -.25, aRz: -.25, aLe: 1.4 + Math.sin(L.T * 40) * .12, aRe: 1.4 + Math.sin(L.T * 40 + 1) * .12, headX: .4 }); c.root.position.y = .7; num(c, 0, 1);
  const w = loc(c, 0, 2.4, 1.5); show(PHONE, w.x, w.y, w.z, 0, .55); PHONE.rotation.set(-.9, 0, 0); cara(c, L.T, { expr: 'determined', eyes: 'down', mouth: 'grimace' });
  orb(L.k, V(-18, 3.4, -15.6), null, [11, .35, .16, 44], [10, .2, .14, 44]); sh(V(-18, 0, -15), 20); }, [[0, 'swipe', .3], [.05, 'typing', .6], [.5, 'typing', .5]]);
// 18 «wird verdächtigt»: dos policías y un dron le rodean; él se queda congelado con el móvil
shot(23.10, 'F', 'punch', L => { town(); const c = put(K[1], -18, 1.5, -15.6, 0); applyPose(c, { lLx: 1.5, rLx: 1.5, lLk: 1.5, lRx: 1.5, lRk: 1.5, hipY: 1.55, aLx: 1.2, aRx: 1.2, aLe: 1.4, aRe: 1.4, headX: -.1, ...shiver(L.T, 1) }); c.root.position.y = .7; num(c, 0, 1); cara(c, L.T, { expr: 'scared' }); sweat(c, L.T, 2);
  const w = loc(c, 0, 2.4, 1.5); show(PHONE, w.x, w.y, w.z, 0, .55); PHONE.rotation.set(-.9, 0, 0);
  [[COP[0], -22.6, -10.6], [COP[3], -13.4, -10.6]].forEach(([p, x, z], i) => { put(p, x, 0, z, faceTo(V(x, 0, z), V(-18, 0, -15.6))); actuar(p, L.lt, [[0, i ? 'point_l' : 'cross']], { T: L.T + i }); num(p, 0, 1); cara(p, L.T, { expr: 'sus' }); });
  const d = DRONES[0]; show(d, -18, 11.5, -15); d.userData.spin(L.T); d.userData.beam(true, 10);
  badge('red', 'VERDÄCHTIG!', W / 2, H * .17, (L.lt - .15) * 3, 1, .7); orb(L.k, V(-18, 4.6, -13), null, [17, .1, .14, 48], [15.5, 0, .14, 48]); sh(V(-18, 0, -13), 30); }, [[0, 'flash', .4], [.1, 'drone', .5], [.3, 'siren_short', .4]]);
// 19 «Gestern wurde Tante Helga abgeführt»: dos policías sacan a Helga de la panadería en volandas; ella patalea, enharinada
shot(23.95, 'S', null, L => { town(); const x = -52 + L.lt * 3.2; const h = put(helga, x, .8, 12, PI / 2); applyPose(h, { aLx: 1.2, aRx: 1.2, aLz: .9, aRz: .9, lLx: Math.sin(L.T * 14) * .5 + .3, lRx: -Math.sin(L.T * 14) * .5 + .3, lLk: .6, lRk: .6, headX: -.1 }); num(h, 1, 1); cara(h, L.T, { expr: 'furious', eyes: 'angry', mouth: 'scream' });
  [[COP[2], -2.6], [COP[0], 2.6]].forEach(([c, s], i) => { caminar(c, L.lt, { x: -52 + 1, z: 12 + s, ry: PI / 2, speed: 3.2, accel: .01, T: L.T + i, extra: { [s < 0 ? 'aRx' : 'aLx']: 1.3, [s < 0 ? 'aRz' : 'aLz']: -.4 } }); cara(c, L.T, { expr: 'determined' }); });
  dust(V(x, 2, 12), Math.floor(L.T * 3) / 3, L.T, 5, .4); orb(L.k, V(x + 1, 3.6, 12), null, [17, PI / 2 + .45, .12, 46], [15.5, PI / 2 + .35, .12, 46]); sh(V(x, 0, 12), 30); }, [[0, 'whoosh_soft', .4], [.1, 'shout_f', .5], [.6, 'steps', .4], [1.2, 'shout_f', .4]]);
// 20 «weil sie Pizzateig zu schnell geknetet hat»: dentro de la panadería, Helga amasa a velocidad de vértigo; vuela la harina
shot(25.81, 'W', null, L => { use('BK'); inside(1.0, 50); const h = put(helga, BKX, .8, -4.4, 0); const s = Math.sin(L.T * 34); applyPose(h, { aLx: 1.2 + s * .25, aRx: 1.2 - s * .25, aLe: .9 - s * .3, aRe: .9 + s * .3, aLz: -.3, aRz: -.3, lean: .28, headX: .3, crouch: .1 }); num(h, 0, 1); cara(h, L.T, { expr: 'determined', eyes: 'squint', mouth: 'grimace' }); sweat(h, L.T, 2);
  show(DOUGH, BKX, 3.4, -2.2, Math.sin(L.T * 20) * .3); DOUGH.scale.set(1.0 + s * .15, .35 - s * .05, .8); dust(V(BKX, 3.6, -2.4), Math.floor(L.T * 5) / 5, L.T, 8, .35);
  { const c = hp(h); cm([c.x - 3, c.y + 3.2, c.z + 10, c.x, c.y - 1.0, c.z, 46], [c.x - 2.2, c.y + 2.8, c.z + 8.4, c.x, c.y - 1.0, c.z, 44], L.k); } sh(V(BKX, 0, -3), 20); }, [[0, 'swipe', .4], [.05, 'dough', .6], [.4, 'dough', .6], [.8, 'dough', .5]]);
// 21 «und über ihr plötzlich eine Eins stand»: ¡pling! le salta un 1 rojo; Helga se queda blanca con las manos en la masa
shot(27.63, 'Z', 'slow', L => { use('BK'); inside(1.0, 50); const h = put(helga, BKX, .8, -4.4, 0); applyPose(h, { aLx: 1.0, aRx: 1.0, aLe: .9, aRe: .9, aLz: -.3, aRz: -.3, lean: -.05, headX: -.25 }); num(h, L.lt > .55 ? 1 : 0, L.lt > .55 ? (L.lt - .55) * 4 : 1); cara(h, L.T, { expr: L.lt > .55 ? 'shock' : 'neutral', eyes: L.lt > .55 ? 'wide' : 'normal', mouth: L.lt > .55 ? 'o' : 'flat' });
  show(DOUGH, BKX, 3.4, -2.2); DOUGH.scale.set(1.0, .35, .8);
  { const c = hp(h); cm([c.x + 1.2, c.y + 2.6, c.z + 10, c.x, c.y - .2, c.z, 44], [c.x + .6, c.y + 2.2, c.z + 7.6, c.x, c.y - .2, c.z, 40], L.k, easeIn); } sh(V(BKX, 0, -4), 20); }, [[.55, 'pling', .7], [.6, 'gasp_f', .5]]);
// 22 «Nur unser Bürgermeister trägt immer eine leuchtende Null»: el alcalde saluda desde el balcón del Rathaus con su 0 dorado
shot(29.71, 'W', null, L => { town(); const m = put(mayor, -6, 10.8, -82.2, 0); actuar(m, L.lt, [[0, 'wave']], { T: L.T }); num(m, 0, 1, 'gold'); grin(m, L.T);
  [K[0], XT[1], K[4], XT[3], K[7], XT[0]].forEach((c, i) => { put(c, (i % 2 ? 1 : -1) * (9 + (i >> 1) * 3) - 6, 0, -68 + (i >> 1) * 2, PI + (i % 2 ? .3 : -.3)); actuar(c, L.lt, [[0, 'cheer']], { T: L.T + i }); num(c, 0, 1); });
  cm([-6, 9, -56, -6, 13.2, -82, 46], [-6, 10, -62, -6, 13.4, -82, 44], L.k); sh(V(-6, 0, -74), 40); }, [[0, 'swipe', .4], [.2, 'cheer', .5], [.8, 'clap', .4]]);
// 23 «Er sagt, er ist das sauberste Vorbild»: primer plano: saca brillo a su 0 con un pañuelito y guiña
shot(32.71, 'C', 'punch', L => { town(); const m = put(mayor, -6, 10.8, -82.2, 0); actuar(m, L.lt, [[0, { aRx: 2.8, aRz: .2, aRe: 1.2 + Math.sin(L.T * 16) * .3, headX: -.1 }]], { T: L.T }); num(m, 0, 1, 'gold'); talk(m, L.T, 32.71, 35.72, 'smug', { eyes: L.lt > 1.5 ? 'wink' : 'half' });
  const w = loc(m, 1.4, 7.6, .3); show(BALLS[0], w.x, w.y, w.z, 0, .5); badge('gold', 'VORBILD', W / 2, H * .25, (L.lt - 1.2) * 3, 1, .8);
  onFace(m, 11.5, -.6, .9, 42, L.k, 10); sh(V(-6, 0, -80), 20); }, [[0, 'impact_soft', .4], [.3, 'sparkle', .6], [1.6, 'ding_soft', .5]]);
// 24 «Und nachts fliegen Polizeidrohnen über die Dächer»: de noche, tres drones sobrevuelan los tejados con sus focos
shot(35.72, 'F', null, L => { town('night'); DRONES.forEach((d, i) => { show(d, -50 + i * 18 + L.lt * 4, 36 + Math.sin(L.T * 2 + i) * 1.5, 30 - i * 26); d.userData.spin(L.T + i); d.userData.beam(true, 30); });
  const k = easeInOut(L.k); cam([-10 + k * 6, 30 + k * 4, 48], [-40, 26, -10], 50); sh(V(-40, 0, 0), 70); }, [[0, 'flash', .3], [.1, 'drone', .7], [1.0, 'drone', .5]]);
// 25 «und scannen jeden Kopf»: en un dormitorio, el foco del dron entra por la ventana; la que duerme se despierta y le sale su 0
shot(37.96, 'W', null, L => { use('ZM'); inside(.4, 10); DARK = .1; const c = put(XT[0], ZMX + 14, 3.4, -4, 0); c.root.rotation.set(-PI / 2, 0, 0); applyPose(c, { aLx: .2, aRx: .2 }); const aw = L.lt > .4; cara(c, L.T, { eyes: aw ? 'wide' : 'closed', mouth: aw ? 'o' : 'flat' }); if (aw) num(c, 0, (L.lt - .45) * 4);
  SPOTL.intensity = 120; SPOTL.position.set(ZMX + 18, 14, -6); SPOTL.target.position.set(ZMX + 14, 3, -6);
  orb(L.k, V(ZMX + 14, 4.2, -5), null, [11, .35, .5, 46], [10, .3, .5, 46]); sh(V(ZMX + 14, 0, -5), 20); }, [[0, 'swipe', .3], [.2, 'scan', .6], [.45, 'gasp_f', .4]]);
// ---------- c: los contenedores, la investigación, el carrito de currywurst y el vecino (39,6 – 66,5 s) ----------
const binsPos = V(-40, 0, -14);
// 26 «Aber irgendwas passt nicht»: por la mañana paso junto a los contenedores, me paro y entorno los ojos
shot(39.60, 'Z', 'slow', L => { town('morning'); num(ich, 0, 1); caminar(ich, L.lt, { x: -35, z: -16, ry: 0, speed: 3, accel: .2, stopAt: .5, T: L.T, extra: { headY: clamp((L.lt - .7) * 3) * 1.0 } }); cara(ich, L.T, { expr: 'sus', eyes: 'squint', mouth: 'wavy' });
  orb(L.k, V(-36, 2.6, -13), null, [13, .3, .1, 44], [10.5, .2, .08, 42]); sh(V(-38, 0, -8), 20); }, [[0, 'zoom_in', .3], [.1, 'birds', .4], [.4, 'steps', .4]]);
// 27 «Jeden Morgen quellen die Mülltonnen»: los contenedores rebosan; las bolas de pañuelos ruedan por el suelo
shot(41.35, 'W', null, L => { town('morning'); BALLS.forEach((b, i) => { const r = RNG(i * 7 + 1), t = clamp(L.lt * 1.4 - r() * .6); show(b, -38 + (r() - .2) * 4 + t * (2 + r() * 4), Math.max(.4, 4.6 - t * t * 8), -14 + (r() - .5) * 9, L.T * 3 + i); });
  const g = put(ich, -34, 0, -7.4, .4); actuar(g, L.lt, [[0, 'shock']], { T: L.T }); num(g, 0, 1); cara(g, L.T, { expr: 'gasp' });
  orb(L.k, V(-38, 3, -12), null, [15, 1.0, .16, 46], [13.5, .9, .14, 46]); sh(V(-38, 0, -12), 20); }, [[0, 'swipe', .3], [.1, 'paper', .6], [.4, 'trash_hit', .4], [.8, 'paper', .4]]);
// 28 «trotzdem über vor Taschentüchern»: primer plano: la tapa amarilla salta y escupe pañuelos
shot(42.99, 'C', 'punch', L => { town('morning'); BALLS.forEach((b, i) => { const r = RNG(i * 3 + 2), t = (L.lt * .9 + r()) % 1; show(b, -40 + (r() - .5) * 3, 4.4 + t * 5 - t * t * 4, -14 + (r() - .5) * 2 + t * 4, L.T * 4 + i); });
  const me = put(ich, -35.4, 0, -8, .5); actuar(me, L.lt, [[0, 'recoil']], { T: L.T }); num(me, 0, 1); cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  orb(L.k, V(-38, 4.0, -11), null, [15, .55, .18, 46], [13.5, .45, .18, 44]); sh(V(-38, 0, -12), 20); }, [[0, 'impact', .4], [.1, 'paper', .7], [.5, 'boing', .4]]);
// 29 «Die Polizei hat alles versucht»: dos policías ante un mapa clavado en el coche, rascándose la cabeza
shot(44.66, 'W', null, L => { town(); show(PCAR[0], 12, 0, -10, PI / 2 + .2); PCAR[0].userData.set(L.T); [[COP[0], 15, -4, .3], [COP[2], 10, -4, -.4]].forEach(([c, x, z, ry], i) => { put(c, x, 0, z, ry); actuar(c, L.lt, [[0, i ? 'think' : 'facepalm']], { T: L.T + i }); num(c, 0, 1); cara(c, L.T, { expr: 'confused' }); });
  orb(L.k, V(12.6, 3.6, -5), null, [15, .15, .14, 46], [13.5, .05, .12, 46]); sh(V(12, 0, -6), 20); }, [[0, 'swipe', .3], [.3, 'hmm', .5], [.9, 'paper', .3]]);
// 30 «Kameras»: un policía en una escalera atornilla una cámara en la fachada
shot(46.49, 'S', null, L => { town(); const c = put(COP[1], -51, 3.2, 30, -PI / 2 - .9); actuar(c, L.lt, [[0, { aRx: 2.4, aRe: .8 + Math.sin(L.T * 12) * .2, aLx: 2.0, aLe: .5, headX: -.3 }]], { T: L.T }); num(c, 0, 1); cara(c, L.T, { expr: 'determined' });
  show(CAMS[0], -53.4, 10.2, 30, PI / 2 + Math.sin(L.T * 2) * .3); badge('tag', 'KAMERAS', W / 2, H * .17, (L.lt - .1) * 3);
  orb(L.k, V(-52, 7, 31), null, [15, .1, -.05, 46], [14, -.05, -.05, 46]); sh(V(-60, 0, 30), 20); }, [[0, 'whoosh_soft', .3], [.2, 'ratchet', .6]]);
// 31 «Spürhunde»: un pastor alemán con chaleco olfatea los contenedores tirando de la correa
shot(47.23, 'R', null, L => { town(); const x = -34 - L.lt * 2.5; show(DOG.root, x, 0, -9, -PI / 2 - .3); DOG.pose(L.T, { walk: 1, sniff: 1 }); const c = put(COP[3], x + 4.4, 0, -8, -PI / 2); caminar(COP[3], L.lt, { x: -30, z: -8, ry: -PI / 2, speed: 2.5, T: L.T, extra: { aLx: 1.0, aLe: .3 } }); num(COP[3], 0, 1); cara(COP[3], L.T, { expr: 'sus' });
  badge('tag', 'SPÜRHUNDE', W / 2, H * .17, (L.lt - .1) * 3); orb(L.k, V(x + 2, 2.6, -9), null, [17, -.4, .14, 46], [16, -.5, .14, 46]); sh(V(x, 0, -10), 20); }, [[0, 'whirl', .3], [.1, 'sniff', .6], [.5, 'bark', .5]]);
// 32 «sogar Wärmebilder»: vista térmica de la plaza: siluetas naranjas paseando, todo normal
shot(48.00, 'F', null, L => { town('night'); THERM = true; crowdWalk(L, [K[0], XT[0], K[2], XT[3], K[5]], -6, -8, 0, null, 3); FILL.intensity = 0; hemi.intensity = .3;
  badge('green', 'WÄRMEBILD', W / 2, H * .15, (L.lt - .1) * 3, 1, .75); cm([2, 7, 20, -6, 3, -6, 48], [0, 7, 16, -6, 3, -6, 48], L.k); sh(V(-6, 0, -2), 30); }, [[0, 'flash', .4], [.2, 'beep', .5], [.8, 'beep', .4]]);
// 33 «Nichts»: los policías se encogen de hombros
shot(49.25, 'Z', 'punch', L => { town(); [[COP[0], -1.6], [COP[2], 1.8]].forEach(([c, dx], i) => { put(c, 12 + dx, 0, -4, PI + dx * .1); actuar(c, L.lt, [[0, 'shrug']], { T: L.T + i }); num(c, 0, 1); cara(c, L.T, { expr: 'sad' }); });
  badge('red', 'NICHTS', W / 2, H * .17, (L.lt - .05) * 3, 1, .85); orb(L.k, V(12.2, 3.6, -4), null, [12.5, PI + .1, .1, 44], [11.5, PI + .05, .1, 44]); sh(V(12, 0, -4), 20); }, [[0, 'impact_soft', .4], [.15, 'sad_tone', .5]]);
// 34 «Denn jede Nacht um halb vier»: el reloj del Rathaus marca las 3:30; los policías duermen en el coche
shot(49.81, 'W', null, L => { town('night'); show(PCAR[0], -2, 0, -64, .4); PCAR[0].userData.set(L.T * 0); [[COP[0], -4.2, -60], [COP[2], .8, -59.6]].forEach(([c, x, z], i) => { put(c, x, 0, z, .3); applyPose(c, { headX: .5, headZ: i ? .3 : -.3, aLz: .1, aRz: .1, crouch: .1 }); num(c, 0, 1); cara(c, L.T, { eyes: 'closed', mouth: 'wavy' }); });
  ZZZ.forEach((z, i) => { const k = (L.T * .6 + i / 3) % 1; z.visible = true; z.position.set(-3.4 + k * 1.6, 5.8 + k * 3, -59 + k * .4); z.scale.setScalar(.6 + k); z.material.opacity = 1 - k; z.lookAt(camera.position); });
  badge('big', '03:30', W / 2, H * .32, (L.lt - .1) * 3, 1, .9); orb(L.k, V(-2, 3.6, -61), null, [16, .25, .12, 46], [14.5, .15, .12, 46]); sh(V(-2, 0, -62), 30); }, [[0, 'swipe', .3], [.1, 'snore_chorus', .6], [.3, 'clock_tick', .4]]);
// 35 «wenn die Drohnen aufladen»: los drones posados en su base de carga, con la batería roja
shot(51.47, 'S', null, L => { town('night'); DRONES.forEach((d, i) => { show(d, -11 + i * 5, 1.4, -64); d.userData.beam(false); d.userData.spin(0); }); BEAM.visible = false;
  badge('red', 'AKKU 3%', W / 2, H * .17, (L.lt - .1) * 3, 1, .8); orb(L.k, V(-6, 2.6, -64), null, [15, .2, .25, 46], [14, .1, .25, 46]); sh(V(-6, 0, -64), 20); }, [[0, 'whoosh_soft', .3], [.2, 'beep', .5], [.6, 'zap', .3]]);
// 36 «rollt ein Currywurstwagen durch die Straßen»: el carrito avanza por la calle oscura con los faros encendidos
shot(52.81, 'F', null, L => { town('night'); const z = 80 - L.lt * 9; show(WAGEN, 26, 0, z, PI); cm([22, 3.2, z - 22, 26, 4, z, 46], [21, 3.4, z - 18, 26, 4, z, 46], L.k); sh(V(26, 0, z), 30); }, [[0, 'flash', .3], [.05, 'engine', .6], [.8, 'brakes', .3]]);
// 37 «Und der verkauft keine Currywurst»: Brutzel-Willi niega con la cabeza junto al letrero CURRYWURST tachado
shot(54.65, 'W', null, L => { town('night'); show(WAGEN, 26, 0, 30, PI); const w = put(willi, 21.6, 0, 30.6, -PI / 2 - .5); actuar(w, L.lt, [[0, { aRx: 1.4, aRz: -.2, aRe: .4, headY: Math.sin(L.T * 9) * .45 }]], { T: L.T }); num(w, 0, 1); cara(w, L.T, { expr: 'smug' });
  orb(L.k, V(22.4, 3.6, 30.6), null, [14, -PI / 2 - .4, .08, 44], [13, -PI / 2 - .5, .08, 44]); sh(V(24, 0, 30), 20); }, [[0, 'swipe', .3], [.2, 'hmm', .4]]);
// 38 «Er verkauft Taschentücher»: saca una caja de pañuelos por la ventanilla, como si fuera oro
shot(56.66, 'C', 'punch', L => { town('night'); show(WAGEN, 26, 0, 30, PI); const w = put(willi, 21.6, 0, 30.6, -PI / 2 - .5); actuar(w, L.lt, [[0, { aRx: 1.6, aLx: 1.6, aRe: .2, aLe: .2, lean: .1 }]], { T: L.T }); num(w, 0, 1); grin(w, L.T);
  const t = loc(w, 0, 2.3, 2.4); show(TBOX[1], t.x, t.y, t.z, -PI / 2); badge('gold', 'TASCHENTÜCHER', W / 2, H * .17, (L.lt - .1) * 3, 1, .65);
  orb(L.k, V(21.8, 3.8, 30.6), null, [11, -PI / 2 - .4, .05, 42], [10, -PI / 2 - .5, .05, 42]); sh(V(24, 0, 30), 20); }, [[0, 'impact_soft', .4], [.2, 'sparkle', .6], [.3, 'choir', .4]]);
// 39 «Achtzig Euro die Packung»: un cliente paga con un fajo; el precio 80 € brilla
shot(58.21, 'W', null, L => { town('night'); show(WAGEN, 26, 0, 30, PI); const w = put(willi, 21.6, 0, 30.6, -PI / 2 - .5); actuar(w, L.lt, [[0, { aRx: 1.4, aRe: .4 }]], { T: L.T }); num(w, 0, 1); grin(w, L.T);
  const c = put(K[0], 20.2, 0, 32.4, -.64); actuar(c, L.lt, [[0, { aRx: 1.5, aRe: .2, lean: .15, headY: -.6 }]], { T: L.T }); num(c, 0, 1); cara(c, L.T, { expr: 'worried' }); const m = loc(c, 1.4, 3.2, 2.2); show(CASH[0], m.x, m.y, m.z, PI / 2);
  badge('red', '80 €', W / 2, H * .3, (L.lt - .1) * 3, 1, .95); orb(L.k, V(21.6, 4.2, 28.6), null, [15, -PI / 2 + .8, .1, 46], [14, -PI / 2 + .7, .1, 46]); sh(V(22, 0, 30), 20); }, [[0, 'swipe', .3], [.2, 'cash', .7], [.6, 'coins', .4]]);
// 40 «Die Schlange ist länger als vor dem Dönerladen»: cola enorme ante el carrito; el del döner, solo, afila el cuchillo aburrido
shot(59.77, 'S', null, L => { town('night'); show(WAGEN, 26, 0, 30, PI); [K[1], XT[2], K[2], XT[3], K[4], XT[4], K[5], K[6], XT[1], K[7]].forEach((c, i) => { put(c, 20.6, 0, 26 - i * 2.6, PI + (i % 2 ? .1 : -.1)); actuar(c, 0, [[0, i % 3 ? 'idle' : 'phone_look']], { T: L.T + i }); num(c, 0, 1); cara(c, L.T + i, { expr: 'bored' }); });
  const k = easeInOut(L.k); cam([4 + k * 4, 9, 40 - k * 4], [22, 3, 10 - k * 14], 50); sh(V(20, 0, 14), 40); }, [[0, 'swipe', .3], [.3, 'murmur', .5]]);
// 41 «Mein Nachbar sagt, er hat nur eine Allergie»: Herr Pfeiffer, cargado de cajas, finge un estornudo
shot(61.90, 'W', null, L => { town('night'); const c = put(pfeif, 20.6, 0, 22, PI / 2 - .5); const sn = clamp((L.lt - .9) / .2); actuar(c, L.lt, [[0, { aLx: 1.3, aRx: 1.3, aLe: 1.2, aRe: 1.2, aLz: -.2, aRz: -.2 }], [.7, { headX: -.35, lean: -.15 }, { dur: .2 }], [1.0, { headX: .45, lean: .25 }, { dur: .1 }]], { T: L.T }); num(c, 0, 1); cara(c, L.T, { expr: L.lt > .7 ? 'yawn' : 'smile' });
  { const t = loc(c, 0, .9, 1.6); show(TBOX[0], t.x, t.y, t.z, PI / 2 - .5); const u = loc(c, 1.8, 2.0, .4); show(TBOX[1], u.x, u.y, u.z, PI / 2 - .5, .8); }
  onFace(c, 12, -1.8, -.8, 44, L.k, 11); sh(V(20, 0, 22), 20); }, [[0, 'swipe', .3], [.75, 'inhale', .5], [1.0, 'fake_sneeze', .6]]);
// 42 «Der Mann hat seit fünfzehn Jahren nicht mal geniest»: yo pongo los ojos en blanco detrás de él; cartel 15 JAHRE
shot(63.86, 'Z', 'punch', L => { town('night'); const c = put(pfeif, 20.6, 0, 22, PI / 2 - .5); actuar(c, L.lt, [[0, { aLx: 1.3, aRx: 1.3, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); num(c, 0, 1); grin(c, L.T); { const t = loc(c, 0, .9, 1.6); show(TBOX[0], t.x, t.y, t.z, PI / 2 - .5); const u = loc(c, 1.8, 2.0, .4); show(TBOX[1], u.x, u.y, u.z, PI / 2 - .5, .8); }
  const me = put(ich, 23.6, 0, 17.6, -.4); actuar(me, L.lt, [[0, 'cross']], { T: L.T }); num(me, 0, 1); cara(me, L.T, { eyes: 'up', mouth: 'flat' });
  badge('green', '15 JAHRE', W / 2, H * .15, (L.lt - .1) * 3, 1, .8); badge('tag', 'KEIN NIESER', W / 2, H * .23, (L.lt - .3) * 3, 1, .8);
  orb(L.k, V(22, 3.4, 20), null, [15, .55, .12, 46], [13.5, .45, .12, 46]); sh(V(22, 0, 20), 20); }, [[0, 'impact_soft', .4], [.4, 'hmm', .4]]);
// ---------- d: sigo al carrito, el sótano del Rathaus, el número del alcalde, la redada y el final (66,5 s – fin) ----------
const FSIGN = (() => { const g = new THREE.Group(); scene.add(g); cyl(.2, .2, 9, mat(0x5a5e68), 8, g, 0, 4.5, 0); const s = textPlane(7, 1.8, 420, 108, (c, w, h) => { c.fillStyle = '#f2c23a'; c.beginPath(); c.moveTo(0, 0); c.lineTo(w - 50, 0); c.lineTo(w, h / 2); c.lineTo(w - 50, h); c.lineTo(0, h); c.fill(); txt(c, 'FABRIK', w / 2 - 20, h / 2 + 4, 70, '#1a1a1a'); }); s.position.set(3, 7.8, .2); g.add(s); outline(g, 1.2); return g; })();
const GDOOR = (() => { const g = new THREE.Group(); scene.add(g); box(.6, 11, 13, mat(0x8a8e96, { metalness: .5, roughness: .4 }), .05, g, 0, 5.5, 0); const d = new THREE.Group(); g.add(d); for (let k = 0; k < 8; k++) box(.4, 1.2, 12, mat(0x5a5e68, { metalness: .6 }), .05, d, .4, .7 + k * 1.25, 0); g.userData.d = d; outline(g, 1.2); return g; })();
const STAMP = (() => { const p = textPlane(26, 5, 1040, 200, (c, w, h) => { c.fillStyle = '#d8323a'; c.fillRect(0, 20, w, h - 40); txt(c, 'ABGESCHAFFT', w / 2, h / 2 + 6, 140, '#ffffff'); }, .6); scene.add(p); return p; })();
const WURST = Array.from({ length: 2 }, () => { const w = cyl(.22, .22, 1.6, mat(0xb8582a, { roughness: .5 }), 10, scene, 0, 0, 0); outline(w, 1); return w; });
PROPS.push(FSIGN, GDOOR, STAMP, ...WURST);
const ride = (ch, lt, x, z, ry, sp, T) => { const d = sp * lt; const px = x + Math.sin(ry) * d, pz = z + Math.cos(ry) * d; put(ch, px, .6, pz, ry); show(ROLLER, px, 0, pz, ry); applyPose(ch, { aLx: 1.3, aRx: 1.3, aLz: -.25, aRz: -.25, aLe: .5, aRe: .5, lean: .22, lLx: .25, lLk: .2, lRx: -.5 + Math.sin(T * 6) * .5, lRk: .4, headX: -.1 }); return V(px, 0, pz); };
// 43 «Ich wollte wissen, wem dieser Wagen gehört»: yo en la ventana de mi casa, de noche, mirando el carrito
shot(66.50, 'W', null, L => { town('night'); HB.HL.intensity = 30; HB.CURT.forEach(c => c.position.x = (c.userData.s < 0 ? -6.6 : -1.4) + c.userData.s * 2.6); const me = put(ich, 8.6, 1.5, 100, PI / 2); actuar(me, L.lt, [[0, { aLx: 1.2, aRx: 1.2, aLe: 1.6, aRe: 1.6, lean: .12 }]], { T: L.T }); num(me, 0, 1); cara(me, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' });
  show(WAGEN, 26, 0, 106 - L.lt * 3, PI);
  orb(L.k, V(10, 4.6, 100), null, [12, PI / 2 + .3, .05, 44], [10.5, PI / 2 + .2, .05, 42]); sh(V(10, 0, 100), 20); }, [[0, 'swipe', .3], [.3, 'engine', .4], [.8, 'hmm', .4]]);
// 44 «Papa hat gesagt, nachts bleibe ich im Bett»: Papa me arropa y me señala con el dedo
shot(68.64, 'R', null, L => { use('ZM'); inside(.6, 25); const me = put(ich, ZMX + 12.6, 3.2, -9.2, -.3); applyPose(me, { lLx: 1.5, rLx: 1.5, lRx: 1.5, hipY: 1.55, aLx: .5, aRx: .5, aLe: .8, aRe: .8, headY: -.5, lean: -.1 }); me.root.position.y = 2.2; cara(me, L.T, { expr: 'worried', eyes: 'side_l' });
  const p = put(papa, ZMX + 7.6, 0, -6.6, PI / 2 - .1); actuar(p, L.lt, [[0, { aRx: 2.0, aRz: -.2, aRe: .6 + Math.sin(L.T * 10) * .2, lean: .1 }]], { T: L.T }); num(p, 0, 1); talk(p, L.T, 68.64, 70.8, 'angry');
  badge('red', 'IM BETT!', W / 2, H * .3, (L.lt - .4) * 3, 1, .85); cm([ZMX + 10.2, 9, 11, ZMX + 10.2, 4.6, -8, 48], [ZMX + 10.2, 8.6, 9.4, ZMX + 10.2, 4.6, -8, 46], L.k); sh(V(ZMX + 11, 0, -6), 20); }, [[0, 'whirl', .3], [.3, 'hmm', .4]]);
// 45 «Doch mein Roller lag schon versteckt hinter der Hecke»: salgo a hurtadillas y saco el patinete de detrás del seto
shot(70.80, 'S', null, L => { town('night'); show(ROLLER, 17, 0, 106, PI / 2 + L.lt * .4); const me = put(ich, 15.4, 0, 104, PI / 2 + .5); actuar(me, L.lt, [[0, 'sneak'], [.7, { aRx: 1.4, aRe: .3, lean: .3, crouch: .3 }, { dur: .3 }]], { T: L.T }); num(me, 0, 1); cara(me, L.T, { expr: 'smug', eyes: 'side_r', mouth: 'smirk' });
  orb(L.k, V(16, 2.4, 105), null, [12, PI / 2 + .9, .2, 44], [11, PI / 2 + .75, .18, 44]); sh(V(16, 0, 105), 20); }, [[0, 'whoosh_soft', .3], [.2, 'leaves', .5], [.8, 'click_set', .4]]);
// 46 «Ich fuhr ihm hinterher»: en patinete detrás del carrito por la calle oscura
shot(73.06, 'Z', null, L => { town('night'); const p = ride(ich, L.lt, 26, 60, PI, 9, L.T); show(WAGEN, 26, 0, p.z - 22, PI); num(ich, 0, 1); cara(ich, L.T, { expr: 'determined' });
  cam([p.x + 4, 3.2, p.z + 9], [p.x, 2.6, p.z - 4], 50); sh(V(p.x, 0, p.z - 8), 40); }, [[0, 'zoom_in', .3], [.05, 'wheels', .6], [.4, 'engine', .3]]);
// 47 «über die Brücke»: cruzo el puente de piedra con las farolas encendidas
shot(74.19, 'W', null, L => { use('BR'); night(40); const p = ride(ich, L.lt, BRX - 14, -1.6, PI / 2, 10, L.T); ich.root.position.y = 2.55; ROLLER.position.y = 1.95; num(ich, 0, 1); cara(ich, L.T, { expr: 'determined' }); show(WAGEN, p.x + 20, 1.95, 1.6, PI / 2);
  cm([p.x - 12, 6.6, -1.2, p.x + 6, 3.2, -1.6, 50], [p.x - 11.4, 6.4, -1.2, p.x + 7, 3.2, -1.6, 50], L.k); sh(V(p.x, 0, 0), 30); }, [[0, 'swipe', .3], [.05, 'wheels', .5], [.4, 'water', .4]]);
// 48 «am Bahnhof vorbei»: paso por delante del Bahnhof iluminado
shot(75.02, 'S', null, L => { use('BR'); night(40); const p = ride(ich, L.lt, BRX + 60, 0, PI / 2, 11, L.T); num(ich, 0, 1); cara(ich, L.T, { expr: 'determined' });
  cm([p.x + 4, 4.4, 17, p.x + 2, 3.6, -2, 50], [p.x + 6, 4.4, 16, p.x + 4, 3.6, -2, 50], L.k); sh(V(p.x, 0, -8), 40); }, [[0, 'whoosh_soft', .3], [.2, 'train_bell', .5], [.6, 'wheels', .4]]);
// 49 «an den Polizisten vorbei, die gerade Bratwurst aßen»: dos policías comiendo bratwurst junto al coche; paso detrás sin que me vean
shot(76.03, 'F', null, L => { town('night'); show(PCAR[0], 36, 0, 140, 0); PCAR[0].userData.set(L.T); [[COP[1], 33, 135, -1.0], [COP[3], 37, 134, -.3]].forEach(([c, x, z, ry], i) => { put(c, x, 0, z, ry); actuar(c, L.lt, [[0, { aRx: 2.3, aRz: -.4, aRe: 2.3 + Math.sin(L.T * 8 + i) * .2, headX: .1 }]], { T: L.T + i }); num(c, 0, 1); cara(c, L.T + i, { eyes: 'happy', mouth: Math.sin(L.T * 9 + i) > 0 ? 'o' : 'smile' }); const w = loc(c, 1.2, 4.6, 1.2); show(WURST[i], w.x, w.y, w.z); WURST[i].rotation.set(.3, 0, 1.2); });
  const p = ride(ich, L.lt, 26, 126, 0, 9, L.T); num(ich, 0, 1); cara(ich, L.T, { expr: 'scared', eyes: 'side_r' });
  cam([19 + L.k * 2, 5, 128], [33, 3.4, 135], 48); sh(V(32, 0, 134), 30); }, [[0, 'flash', .3], [.1, 'chew', .6], [.6, 'wheels', .4], [1.2, 'laugh_m', .3]]);
// 50 «Er fuhr nicht in die Fabrik»: el carrito pasa de largo junto al cartel FABRIK
shot(78.68, 'W', null, L => { town('night'); show(FSIGN, 33, 0, 160, PI / 2); const z = 150 - L.lt * 10; show(WAGEN, 26, 0, z, PI);
  cm([40, 5, 175, 30, 5, 158, 46], [38, 5, 171, 28, 5, 156, 46], L.k); sh(V(30, 0, 158), 30); }, [[0, 'swipe', .3], [.05, 'engine', .5]]);
// 51 «Er fuhr direkt in den Keller vom Rathaus»: el portón lateral del Rathaus se abre y el carrito se mete; yo me escondo tras un árbol
shot(79.94, 'Z', 'slow', L => { town('night'); show(GDOOR, 14.8, 0, -92); GDOOR.userData.d.position.y = easeOut(clamp(L.lt / .6)) * 9; const x = lerp(40, 22, easeOut(clamp(L.lt / 2))); show(WAGEN, x, 0, -92, -PI / 2);
  const me = put(ich, 34, 0, -66, -PI / 2 - 1.2); actuar(me, L.lt, [[0, 'sneak']], { T: L.T }); num(me, 0, 1); cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  cm([30, 6, -50, 22, 4, -86, 46], [29, 6, -55, 22, 4, -86, 44], L.k); sh(V(24, 0, -84), 40); }, [[.05, 'metal_creak', .6], [.3, 'engine', .4]]);
// 52 «Da unten stapelten sich Kartons voller Taschentücher, bis an die Decke»: grúa por la montaña de cajas hasta el techo
shot(82.12, 'W', null, L => { use('KE'); inside(.8, 30); const k = easeInOut(L.k); cam([KEX + 6, 3 + k * 10, 14 - k * 2], [KEX - 8, 4 + k * 10, -6], 52); sh(V(KEX - 8, 0, -6), 30); }, [[0, 'swipe', .3], [.2, 'ambience_low', .5], [1.5, 'creak', .3]]);
// 53 «An der Wand hing das Plakat»: el cartel GOONEN VERBOTEN en la pared del sótano
shot(86.32, 'F', null, L => { use('KE'); inside(.8, 40); cm([KEX + 3, 9, -6, KEX + 4, 9, -19.7, 48], [KEX + 4, 9.4, -9, KEX + 4, 9.2, -19.7, 44], L.k); sh(V(KEX + 4, 0, -16), 20); }, [[0, 'flash', .3], [.3, 'paper', .5]]);
// 54 «mit seiner Unterschrift»: primer plano de la firma, que se ilumina
shot(88.84, 'Z', 'punch', L => { use('KE'); inside(.8, 40); cm([KEX + 4, 6.6, -14.6, KEX + 4, 6.2, -19.7, 40], [KEX + 4.2, 6.4, -15.6, KEX + 4.2, 6.2, -19.7, 38], L.k); badge('gold', 'SAUBERMANN', W / 2, H * .17, (L.lt - .3) * 3, 1, .7); sh(V(KEX + 14, 0, -16), 20); }, [[0, 'impact_soft', .4], [.3, 'pencil', .5]]);
// 55 «Und mittendrin saß der Bürgermeister und bündelte Geldscheine»: el alcalde en su mesa haciendo fajos, con sonrisa de oreja a oreja
const desk = L => { const m = put(mayor, KEX + 9, 0, -4.6, 0); return m; };
shot(90.20, 'W', null, L => { use('KE'); inside(.8, 40); const m = desk(L); actuar(m, L.lt, [[0, { aLx: 1.2, aRx: 1.2, aLe: .9 + Math.sin(L.T * 9) * .2, aRe: .9 - Math.sin(L.T * 9) * .2, aLz: -.3, aRz: -.3, lean: .25, headX: .3 }]], { T: L.T }); num(m, 0, 1, 'gold'); grin(m, L.T);
  orb(L.k, V(KEX + 9, 4.6, -3.6), null, [15, -.35, .2, 46], [13.5, -.25, .18, 46]); sh(V(KEX + 9, 0, -3), 20); }, [[0, 'swipe', .3], [.2, 'cash', .5], [.8, 'paper', .4]]);
// 56 «Er hatte das Gesetz nur erfunden»: risa malvada del alcalde, primer plano
shot(93.61, 'C', 'punch', L => { use('KE'); inside(.8, 40); const m = desk(L); actuar(m, L.lt, [[0, { aLx: 1.6, aRx: 1.6, aLz: .5, aRz: .5, aLe: 1.6, aRe: 1.6, lean: -.15, headX: -.25 }]], { T: L.T }); num(m, 0, 1, 'gold'); laughF(m, L.T);
  badge('red', 'ERFUNDEN!', W / 2, H * .3, (L.lt - .2) * 3, 1, .85); onFace(m, 10, -1.2, .6, 42, L.k, 9); sh(V(KEX + 9, 0, -4), 20); }, [[0, 'impact', .4], [.2, 'evil_laugh', .7]]);
// 57 «damit er als Einziger Taschentücher verkaufen kann»: Willi descarga cajas del carrito y le da al alcalde un fajo de billetes
shot(95.35, 'R', null, L => { use('KE'); inside(.8, 40); show(WAGEN, KEX + 18, 0, 13, PI / 2); const w = put(willi, KEX + 12, 0, 2, -PI / 2 + .3); actuar(w, L.lt, [[0, { aLx: 1.5, aRx: 1.5, aLe: .5, aRe: .5, lean: .1 }]], { T: L.T }); num(w, 0, 1); grin(w, L.T); const t = loc(w, 0, 2.2, 1.8); show(TBOX[0], t.x, t.y, t.z, -PI / 2 + .3);
  const m = put(mayor, KEX + 8.6, 0, -1, -.9 + PI / 2); actuar(m, L.lt, [[0, 'cheer']], { T: L.T }); num(m, 0, 1, 'gold'); grin(m, L.T);
  orb(L.k, V(KEX + 10.4, 4, .4), null, [17, -.5, .12, 46], [15.5, -.6, .12, 46]); sh(V(KEX + 10, 0, 0), 20); }, [[0, 'whirl', .3], [.3, 'box_drop', .5], [1.0, 'cash', .5]]);
// 58 «Ich wollte ihn filmen»: escondido tras las cajas, saco el móvil y le grabo
shot(97.89, 'W', null, L => { use('KE'); inside(.8, 40); const m = desk(L); actuar(m, L.lt, [[0, { aLx: 1.2, aRx: 1.2, aLe: .9, aRe: .9, lean: .25, headX: .3 }]], { T: L.T }); num(m, 0, 1, 'gold'); grin(m, L.T);
  const me = put(ich, KEX + 1.6, 0, 3.6, PI / 2 + .7); actuar(me, L.lt, [[0, 'sneak'], [.2, { aRx: 1.9, aRe: .5, aRz: -.1, crouch: .4, lean: .3 }, { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'determined', eyes: 'squint' }); const ph = loc(me, .4, 3.6, 2.4); show(PHONE2, ph.x, ph.y, ph.z, PI / 2 + .7);
  cm([KEX - 4.6, 6, 10.6, KEX + 6, 3.4, -1, 46], [KEX - 4, 5.8, 9.6, KEX + 6, 3.4, -1, 44], L.k); sh(V(KEX + 4, 0, 0), 20); }, [[0, 'swipe', .3], [.4, 'camera_beep', .6]]);
// 59 «Doch dann sah ich, wie er die Scheine durchblätterte»: primer plano de las manos pasando billetes a toda velocidad
shot(98.96, 'Z', null, L => { use('KE'); inside(.8, 40); const m = desk(L); actuar(m, L.lt, [[0, { aLx: 1.0, aRx: 1.4, aLe: 1.2, aRe: .7 + Math.sin(L.T * 26) * .3, lean: .1, headX: .12 }]], { T: L.T }); num(m, 0, 1, 'gold'); cara(m, L.T, { expr: 'joy' });
  CASH.forEach((c, i) => { const k = (L.T * 3 + i / 12) % 1; const w = loc(m, -.4 + k * 1.6, 3.4 + Math.sin(k * PI) * .8, 2.2); show(c, w.x, w.y, w.z, k * 3); c.rotation.x = k * 4; });
  cm([KEX + 9.6, 5.2, 5.4, KEX + 9, 4.0, -2, 44], [KEX + 9.4, 5.0, 4.4, KEX + 9, 4.0, -2, 42], L.k); sh(V(KEX + 9, 0, -2), 20); }, [[0, 'zoom_in', .3], [.1, 'paper', .5], [.5, 'paper', .5], [.9, 'paper', .5]]);
// 60-63 «Immer schneller. Hundert. Zweihundert. Dreihundert.»: cortes rápidos con el contador
const flip = (L, n, ang) => { use('KE'); inside(.8, 40); const m = desk(L); actuar(m, 0, [[0, { aLx: 1.0, aRx: 1.4, aLe: 1.2, aRe: .7 + Math.sin(L.T * 40) * .35, lean: .1, headX: .12 }]], { T: L.T }); num(m, 0, 1, 'gold'); cara(m, L.T, { expr: 'joy' }); sweat(m, L.T, n > 1 ? 1 : 0);
  CASH.forEach((c, i) => { const k = (L.T * 5 + i / 12) % 1; const w = loc(m, -.4 + k * 1.6, 3.4 + Math.sin(k * PI) * .9, 2.2); show(c, w.x, w.y, w.z, k * 4); c.rotation.x = k * 5; });
  if (n) badge('gold', String(n), W / 2, H * .17, L.lt * 4, 1, 1.1); orb(L.k, V(KEX + 9, 5.4, -2.6), null, [9.5, ang, .2, 42], [8.6, ang + .1, .2, 40]); sh(V(KEX + 9, 0, -2), 20); };
shot(101.29, 'W', null, L => flip(L, 0, -.5), [[0, 'whoosh', .3], [.1, 'paper', .5]]);
shot(101.85, 'C', 'punch', L => flip(L, 100, .4), [[0, 'impact_soft', .4], [.05, 'ding_soft', .5]]);
shot(102.70, 'C', 'punch', L => flip(L, 200, -.2), [[0, 'impact_soft', .4], [.05, 'ding_soft', .55]]);
shot(103.62, 'C', 'punch', L => flip(L, 300, .15), [[0, 'impact_soft', .4], [.05, 'ding_soft', .6]]);
// 64 «Und plötzlich sprang die Zahl über seinem Kopf» (zoom lento): el 0 dorado parpadea…
shot(104.51, 'Z', 'slow', L => { use('KE'); inside(.8, 40); const m = desk(L); actuar(m, 0, [[0, { aLx: 1.0, aRx: 1.2, aLe: 1.2, aRe: 1.0, lean: .08, headX: 0 }]], { T: L.T }); num(m, 0, 1, Math.floor(L.T * 10) % 2 && L.lt > 1 ? 'red' : 'gold'); cara(m, L.T, { expr: 'joy' });
  const h = hp(m); cam([h.x + .8, h.y + 1.4, h.z + 10 - L.k * 2], [h.x, h.y + 1.6, h.z], 44); sh(V(KEX + 9, 0, -3), 20); }, [[.3, 'glitch', .4], [1.2, 'glitch', .5]]);
// 65 «Von Null auf Eins»: ¡pling! el 0 salta a un 1 rojo
shot(107.03, 'F', 'punch', L => { use('KE'); inside(.8, 40); const m = desk(L); applyPose(m, { aLx: 1.0, aRx: 1.0, aLe: 1.2, aRe: 1.2, lean: .05, headX: -.05 }); const one = L.lt > .45; num(m, one ? 1 : 0, one ? (L.lt - .45) * 4 : 1, one ? 'red' : 'gold'); cara(m, L.T, { expr: 'joy' });
  const h = hp(m); cam([h.x + .6, h.y + 1.4, h.z + 8.6], [h.x, h.y + 1.7, h.z], 42); sh(V(KEX + 9, 0, -3), 20); }, [[0, 'flash', .4], [.45, 'pling', .8], [.5, 'impact', .4]]);
// 66 «Er erstarrte»: el alcalde se queda congelado, ojos como platos
shot(108.42, 'Z', 'punch', L => { use('KE'); inside(.8, 40); const m = desk(L); applyPose(m, { aLx: 1.0, aRx: 1.0, aLe: 1.2, aRe: 1.2, lean: .1, headX: 0 }); num(m, 1, 1); cara(m, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); sweat(m, L.T, 2);
  onFace(m, 8.6, -.6, 0, 40, L.k, 7.8); sh(V(KEX + 9, 0, -3), 20); }, [[0, 'impact_soft', .4], [.1, 'silence_tick', .5]]);
// 67 «Ich erstarrte»: yo, detrás de las cajas, igual
shot(109.28, 'W', 'punch', L => { use('KE'); inside(.8, 40); const me = put(ich, KEX + 3.5, 0, 6, 2.5); applyPose(me, { aRx: .9, aRe: .5, crouch: .2, lean: -.1, ...shiver(L.T, .6) }); num(me, 0, 1); cara(me, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  onFace(me, 8, -.4, 0, 40, L.k, 7); sh(V(KEX + 2, 0, 3), 20); }, [[0, 'swipe', .3], [.1, 'gasp_f', .4]]);
// 68 «„Ich zähle doch nur Geld“, flüsterte er»: el alcalde enseña el fajo con una sonrisa nerviosa y susurra
shot(110.04, 'C', null, L => { use('KE'); inside(.8, 40); const m = desk(L); actuar(m, L.lt, [[0, { aRx: 1.6, aRe: .6, aRz: -.1, aLz: .3, headZ: .15 }]], { T: L.T }); num(m, 1, 1); talk(m, L.T, 110.04, 112.72, 'worried', { eyes: 'side_l' }); sweat(m, L.T, 2);
  const w = loc(m, 1.3, 4.4, 2.0); show(CASH[0], w.x, w.y, w.z, 0); CASH[0].rotation.x = PI / 2; bubble(m, 'Nur Geld…', (L.lt - .6) * 3, 2.6);
  onFace(m, 10, -1, -.8, 42, L.k, 9); sh(V(KEX + 9, 0, -3), 20); }, [[0, 'impact_soft', .3], [.3, 'whisper', .5]]);
// 69 «Aber die Zahl kletterte weiter»: el número tiembla y empieza a subir
shot(112.72, 'Z', 'slow', L => { use('KE'); inside(.8, 40); const m = desk(L); applyPose(m, { aLx: 1.6, aRx: 1.6, aLe: 2.2, aRe: 2.2, aLz: -.2, aRz: -.2, headX: -.2, ...shiver(L.T, 1.5) }); num(m, 1, 1 + Math.sin(L.T * 30) * .05); cara(m, L.T, { expr: 'scared' }); sweat(m, L.T, 3);
  const h = hp(m); cam([h.x - .6, h.y + 2, h.z + 9.4 - L.k], [h.x, h.y + 2, h.z], 44); sh(V(KEX + 9, 0, -3), 20); }, [[.2, 'tick', .5]]);
const climb = (L, n, side) => { use('KE'); inside(.8, 40); const m = desk(L); applyPose(m, { aLx: 2.6, aRx: 2.6, aLe: 1.8, aRe: 1.8, aLz: .2, aRz: .2, headX: -.2, ...shiver(L.T, 2) }); num(m, n, L.lt * 4); cara(m, L.T, { expr: 'panic', eyes: 'terror', mouth: 'grimace_wide' }); sweat(m, L.T, 3);
  const h = hp(m); cam([h.x + side * 2, h.y + 1.6, h.z + 7.8 - L.k * .8], [h.x, h.y + 1.8, h.z], 42); sh(V(KEX + 9, 0, -3), 20); };
shot(114.06, 'C', 'punch', L => climb(L, 2, -1), [[0, 'pling', .7], [.05, 'impact_soft', .4]]);
shot(114.82, 'C', 'punch', L => climb(L, 3, 1), [[0, 'pling', .75], [.05, 'impact_soft', .4]]);
shot(115.52, 'C', 'punch', L => climb(L, 4, 0), [[0, 'pling', .8], [.05, 'impact', .5]]);
// 70 «Keine zwei Minuten später umstellten zwanzig Polizeiwagen das Rathaus»: vista aérea: 20 coches con las sirenas rodean el Rathaus
shot(116.25, 'W', null, L => { town('night'); const n = Math.min(20, Math.floor(4 + L.lt * 12)); for (let i = 0; i < 20; i++) { const a = PI * (i / 19), r = 30 + (i % 3) * 7; FLEET.set(i, -6 + Math.cos(a) * r, -84 + Math.sin(a) * r * .9, a + PI / 2); } FLEET.show(n, L.T);
  badge('red', '20', W / 2, H * .16, (L.lt - .4) * 3, 1, 1.0); const k = easeInOut(L.k); cam([-6 + k * 10, 60 - k * 10, -18 + k * 6], [-6, 4, -76], 52); sh(V(-6, 0, -76), 70); }, [[0, 'swipe', .3], [.05, 'siren', .7], [.6, 'brakes', .5], [1.4, 'door_slam', .4]]);
// 71 «Die Goon-Polizei stürmte den Keller»: los policías entran corriendo por el portón
shot(120.18, 'S', null, L => { use('KE'); inside(.8, 40); COP.forEach((c, i) => { caminar(c, L.lt, { x: KEX + 15 - (i % 2) * 3, z: -14 + i * 1.2, ry: -PI / 2 - .4 + i * .1, speed: 10, run: true, accel: .05, T: L.T + i }); num(c, 0, 1); cara(c, L.T, { expr: 'shout', mouth: 'talk_wide' }); });
  const m = put(mayor, KEX + 6, 0, -2, PI / 2 + .3); actuar(m, L.lt, [[0, 'shock']], { T: L.T }); num(m, 4, 1); cara(m, L.T, { expr: 'scream' });
  cm([KEX - 6, 7, 16, KEX + 10, 3, -8, 50], [KEX - 4, 6.6, 14, KEX + 10, 3, -8, 50], L.k); sh(V(KEX + 8, 0, -6), 30); }, [[0, 'whoosh_soft', .3], [.05, 'crowd_run', .7], [.3, 'shout_crowd', .5]]);
// 72 «und der ganze Turm aus Kartons krachte auf ihn herunter»: la avalancha de cajas sepulta al alcalde
shot(121.88, 'Z', 'punch', L => { use('KE'); inside(.8, 40); KE.pile.set(clamp((L.lt - .2) / 1.6)); const m = put(mayor, KEX - 3, 0, 4, PI); actuar(m, L.lt, [[0, 'cower']], { T: L.T }); num(m, 4, 1); cara(m, L.T, { expr: 'scream' }); m.root.position.y = -clamp((L.lt - 1.2) / .6) * 3;
  orb(L.k, V(KEX - 3, 4.5, 4), null, [17, .1, .2, 48], [15, .05, .2, 48]); SHAKE = clamp(L.lt - .3) * .6; sh(V(KEX - 4, 0, 0), 30); }, [[.2, 'rumble', .6], [.4, 'box_drop', .6], [.8, 'slam', .6], [1.4, 'thud', .5]]);
// 73 «Jetzt sitzt der Bürgermeister drei Jahre mit Steinfäustlingen»: en la celda, con sus manoplas de piedra y su 4
shot(125.12, 'I', null, L => { use('ZL'); inside(.9, 40); const m = put(mayor, ZLX - 2.25, 0, -5.6, .1); applyPose(m, { aLx: .9, aRx: .9, aLz: -.2, aRz: -.2, aLe: .6, aRe: .6, headX: .35, lean: .1 }); mitts(m); num(m, 4, 1); cara(m, L.T, { expr: 'sad' });
  badge('red', '3 JAHRE', W / 2, H * .3, (L.lt - .3) * 3, 1, .8); cm([ZLX - 1.9, 5, 16, ZLX - 2.25, 4.4, -5, 44], [ZLX - 2.1, 5, 13, ZLX - 2.25, 4.4, -5, 42], L.k); sh(V(ZLX, 0, 0), 20); }, [[0, 'iris_pop', .4], [.2, 'metal_hit', .5], [.8, 'sigh', .4]]);
// 74 «Das Gesetz ist abgeschafft»: la plaza celebra; el sello ABGESCHAFFT cae sobre el cartel; ya nadie tiene número
shot(128.13, 'W', 'punch', L => { town(); const st = clamp((L.lt - .1) / .25); show(STAMP, -6, 17.8, -82.1, 0, lerp(2.2, 1, easeOut(st))); STAMP.rotation.set(0, 0, -.18); STAMP.visible = st > 0;
  [K[0], XT[0], K[1], XT[1], K[2], XT[3], K[4], XT[4], helga, haeft].forEach((c, i) => { put(c, -18 + (i % 5) * 6, 0, -60 + Math.floor(i / 5) * 6, PI); actuar(c, L.lt, [[0, 'cheer']], { T: L.T + i }); saltar(c, L.lt, (i % 3) * .2, { h: 1.2, dur: .45, base: [c.root.position.x, 0, c.root.position.z] }); });
  confRain(V(-6, 0, -66), L.T, 40, 30, 16, 20); cm([-6, 5, -26, -6, 16, -84, 50], [-6, 6, -34, -6, 17, -84, 48], L.k); sh(V(-6, 0, -66), 40); }, [[.1, 'stamp', .8], [.2, 'cheer', .6], [.6, 'firework', .4]]);
// 75 «Nur über seinem Kopf steht für immer: Vier» (zoom lento): el alcalde en su celda, solo, con su 4 rojo brillando
shot(129.78, 'Z', 'slow', L => { use('ZL'); inside(.7, 30); const m = put(mayor, ZLX - 3.75, 0, -5.6, .1); applyPose(m, { aLx: .9, aRx: .9, aLz: -.2, aRz: -.2, aLe: .6, aRe: .6, headX: -.1, lean: .05 }); mitts(m); num(m, 4, 1); cara(m, L.T, { expr: 'cry' });
  const h = hp(m); cam([h.x + .4, h.y + 2.4, h.z + 14 - L.k * 4], [h.x, h.y + 1.6, h.z], 42); sh(V(ZLX, 0, -4), 20); }, [[.3, 'sad_tone', .6], [1.6, 'bell_far', .4]]);
// ---------- portadas (fuera del vídeo): el preso con su 1353 huyendo, policías y drones detrás, los del 0 mirando ----------
function coverTxt(l1, l2, y0 = .255) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * y0, 104, '#ffffff'], [l2, H * (y0 + .06), 92, '#E2FD07']]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .84 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .24; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }
window.renderCover = v => { const T = 2.1; hideAll(); BAD_.length = 0; town(); BIRDSON = 0;
  const z = -40; caminar(haeft, .9, { x: -4, z: z - 7.6, ry: 0, speed: 8.5, run: true, accel: .05, T }); num(haeft, 1353, 1); cara(haeft, T, { eyes: 'terror', mouth: 'scream', noBlink: 1 }); sweat(haeft, T, 2);
  [[COP[0], -8.6], [COP[1], .6]].forEach(([c, x], i) => { caminar(c, .9, { x, z: z - 16, ry: 0, speed: 8.5, run: true, accel: .05, T: T + i }); cara(c, T, { expr: 'shout', mouth: 'talk_wide', noBlink: 1 }); });
  [[K[0], -10.6, z + 2, .7], [XT[0], 2.8, z + 2, -.7]].forEach(([c, x, zz, ry], i) => { put(c, x, 0, zz, ry); actuar(c, 0, [[0, i ? 'shock' : 'point']], { T }); num(c, 0, 1); cara(c, T, { eyes: 'wide', mouth: 'o', noBlink: 1 }); });
  DRONES.slice(0, 2).forEach((d, i) => { show(d, -4 + (i ? 4.5 : -4.5), 13.5, z - 12); d.userData.spin(T + i); d.userData.beam(true, 13); });
  cam([-4, 6.2, z + 18], [-4, 6.4, z - 6], 52); sh(V(-4, 0, z - 6), 40);
  grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.blurAmt.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); composer.render(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H);
  if (v === 0) coverTxt('IN DIESER STADT', 'IST GOONEN VERBOTEN'); else coverTxt('ÜBER DEINEM KOPF', 'STEHT, WIE OFT …'); };


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
  if (s.zoom === 'punch') { const e = clamp(lt / .18); camera.fov *= lerp(.72, 1, easeOut(e)); }
  if (i === 0) { const k = clamp(T / .22); camera.fov *= lerp(.58, 1, easeOut(k)); }
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud'].includes(c.s) && T - c.t < .16) sh_ = Math.max(sh_, 1 - (T - c.t) / .16); }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .3 * sh_; camera.position.y += (r() - .5) * .3 * sh_; }
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.5; grade.uniforms.lift.value = .01; }
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
  if (THERM) octx.filter = 'contrast(1.5) saturate(2.4) hue-rotate(190deg) brightness(1.1)';
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  if (TINT) { octx.fillStyle = TINT; octx.fillRect(0, 0, W, H); }
  if (DARK > 0) { octx.fillStyle = `rgba(0,0,0,${DARK})`; octx.fillRect(0, 0, W, H); }
  for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { renderer, composer, bloom, sun, grade, scene, camera };

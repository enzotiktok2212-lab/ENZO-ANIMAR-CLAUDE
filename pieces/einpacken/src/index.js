// EINPACKEN — «In dieser Stadt sind alle feiern, außer mir»: el que solo sabe envolver hamburguesas (secuela del HUSS). 1080×1920, 30 fps.
// Réplica de la estructura del vídeo de referencia con otra ciudad (Hufenbach de noche, de fiesta), otro reparto y otros datos.
// Los HUSS vienen del audio original (audio/huss.json: [inicio, fin, [golpes]] por ráfaga). Planos en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { makeOma, makeKumpel, makeLena, makeSie, makeEr, makeKassiererin, makeFahrer, makeJonas, makeMayor, makeLeo, makeNachbar } from './gvolk.js';
import { hufenbach, townhouse } from './gort.js';
import { partyHat, crowd, cake, calendar, balloons, speaker, djDesk, discoBall } from './hsets.js';
import { bunting } from './wsets.js';
import { stube, broetchenburg, burger, wrapper, parcel, tower, alarm, stopwatch, plate, wrappedPlate, dackel, clipboard, letter, potatoHeart, tie, spatula, paperHat, patty, glowM } from './esets.js';
import { makeMats, makeChef, makeExtra } from './ecast.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const HU = await (await fetch('./audio/huss.json')).json();   // 7 ráfagas: [t0, t1, [golpes]]
const DUR = 111.6, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
// Hufenbach (x = 0) de noche y de fiesta: plaza x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte (-6, -92); fuente (-18, -24); café (36, -40); DJ en (24, 6).
// Stube (SX = 900): mi cuarto; mesa centrada en (SX, 3.4, 0), yo detrás en z = -3.2 mirando +z, ventana detrás (z = -10) con la fiesta fuera.
// Brötchenburg (BX = 1300): mostrador en z = 0 (jefe detrás en z = -2.4, cliente delante en z = 2.6); plancha en z = -9; fachada en z = 40.
const SX = 900, BX = 1300;
const HB = hufenbach(scene), ST = stube(scene, SX), BB = broetchenburg(scene, BX);
const SETS = { HB: HB.G, ST: ST.g, BB: BB.g };
for (const k in SETS) outline(SETS[k], 1.4);
[HB.RANK, HB.KINO, HB.BOX, HB.PRICE].forEach(o => o && (o.visible = false));
// relleno del pueblo
townhouse(HB.G, -64, -21, 13, 3, 11, Math.PI / 2); townhouse(HB.G, -64, -34.5, 13, 2, 12, Math.PI / 2);
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3), 20 + i, 0);
for (let i = 0, z = 70; z > -112; z -= 17, i++) { townhouse(HB.G, -98, z, 16, 3 + (i % 2), 30 + i, Math.PI / 2); townhouse(HB.G, 88, z, 16, 2 + (i % 3), 40 + i, -Math.PI / 2); }
// decoración de fiesta: guirnaldas, bombillas, globos, altavoces, DJ
const FEST = new THREE.Group(); HB.G.add(FEST);
for (let k = 0; k < 6; k++) bunting(FEST, [-54, 16 + (k % 2) * 2, -60 + k * 22], [44, 17, -50 + k * 22], 34, 2.2);
const BULBS = []; for (let k = 0; k < 4; k++) for (let i = 0; i < 26; i++) { const x = -50 + i * 3.8, z = -40 + k * 26; const b = sphere(.3, glowM([0xffd23f, 0xff4a8a, 0x3ab8ff, 0x8ad84a][(i + k) % 4], 3), FEST, x, 19 - Math.sin(i / 25 * Math.PI) * 3, z, 8, 6); BULBS.push(b); }
for (const [x, z, n, s] of [[-30, 10, 4, 3], [10, -20, 5, 5], [30, 30, 3, 7], [-40, -40, 4, 9], [0, 40, 4, 11]]) balloons(FEST, x, 6, z, n, s);
speaker(FEST, 18, 0, 1.2, -.6); speaker(FEST, 30, 12, 1.2, -1.2); djDesk(FEST, 24, 6, -.9); discoBall(FEST, 0, 22, 0, 2.2);
outline(FEST, 1.2);
// ---------- reparto ----------
const ich = makeMats(scene), udo = makeNachbar(scene), chef = makeChef(scene), mayor = makeMayor(scene), oma = makeOma(scene), kid = makeLeo(scene);
const K = Array.from({ length: 8 }, (_, i) => makeKumpel(scene, i)); const XT = [makeLena(scene), makeSie(scene), makeEr(scene), makeKassiererin(scene), makeFahrer(scene), makeJonas(scene)];
kitFace(ich, 'hero'); kitFace(udo, 'mustache'); kitFace(chef, 'mustache'); kitFace(mayor, 'mustache'); kitFace(oma, 'girl'); kitFace(kid, 'kid');
K.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'plain', 'girl', 'girl', 'kid', 'hero'][i])); XT.forEach((c, i) => kitFace(c, ['girl', 'girl', 'kid', 'girl', 'plain', 'hero'][i]));
const EX = Array.from({ length: 24 }, (_, i) => makeExtra(scene, i)); EX.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'girl', 'mustache', 'girl'][i % 6]));
const POOL = [ich, udo, chef, mayor, oma, kid, ...K, ...XT, ...EX];
const EXTRA = [...K, ...XT, ...EX]; POOL.forEach(c => outline(c.root, 2));
const HATS = new Map(); POOL.forEach((c, i) => HATS.set(c, partyHat(c.head, i, 1.32 + (c === oma ? .25 : 0) + (c === udo ? .5 : 0))));
const hat = (...cs) => cs.forEach(c => HATS.get(c).visible = true);
const PHAT = paperHat(ich.head); PHAT.visible = false; outline(PHAT, 1.2);
const TIE = tie(chef.spine); TIE.position.set(0, 1.95, .62); outline(TIE, 1.2);
// ---------- atrezo ----------
const WR = [wrapper(scene), wrapper(scene)]; WR.forEach(w => outline(w, 1.2));
const PARC = [parcel(scene), parcel(scene), parcel(scene)]; PARC.forEach(p => outline(p, 1.2));
const BUR = [burger(scene), burger(scene)]; BUR.forEach(b => outline(b, 1.2));
const TWR = [tower(scene, 40, 1, 11), tower(scene, 40, 1, 13), tower(scene, 40, 1, 17)]; TWR.forEach(t => outline(t, 1.2));
const ALM = alarm(scene); outline(ALM, 1.2); const SW = stopwatch(scene); outline(SW, 1.2);
const PLT = plate(scene), WPLT = wrappedPlate(scene); outline(PLT, 1.2); outline(WPLT, 1.2);
const EGG = (() => { const g = new THREE.Group(); scene.add(g); const w = cyl(.7, .7, .06, mat(0xffffff, { roughness: .3 }), 20, g, -.3, .24, .1); w.scale.z = .8; sphere(.3, mat(0xffc020, { roughness: .2 }), g, -.3, .3, .1, 12, 8).scale.y = .5; for (const z of [-.5, -.2]) box(1.4, .08, .3, mat(0xb8402a, { roughness: .6 }), .03, g, .6, .27, z); outline(g, 1); return g; })();
const DOG = dackel(scene); outline(DOG, 1.4);
const CLIP = clipboard(scene); outline(CLIP, 1.2); const LET = letter(scene); const POT = potatoHeart(scene); outline(POT, 1.4);
const CAKE = cake(scene, 5, 1.2); outline(CAKE, 1.2); const CALD = calendar(scene, 'DIENSTAG', 'PARTY!'); outline(CALD, 1.2);
const PTAB = (() => { const g = new THREE.Group(); scene.add(g); cyl(2.0, 2.0, .2, mat(0xffffff, { roughness: .4 }), 20, g, 0, 2.1, 0); cyl(2.05, 2.05, .5, mat(0xff8ad0, { roughness: .7 }), 20, g, 0, 1.85, 0); cyl(.25, .25, 2.1, mat(0x2a2a2a, { metalness: .6 }), 8, g, 0, 1.05, 0); outline(g, 1.2); return g; })();
const CALDI = textPlane(4, 4.8, 200, 240, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8323a'; c.fillRect(0, 0, w, 64); txt(c, 'DIENSTAG', w / 2, 34, 36, '#ffffff'); c.fillStyle = '#ff4a8a'; c.font = `700 70px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('PARTY!', w / 2, 140); }); CALDI.material.side = THREE.DoubleSide; scene.add(CALDI);
const SPAT = spatula(scene); outline(SPAT, 1);
const PAT = Array.from({ length: 6 }, () => patty(scene)); PAT.forEach(p => outline(p, 1));
const MGR = (() => { const g = new THREE.Group(); scene.add(g); box(7, .9, 3.6, mat(0x2a2a2e, { metalness: .5, roughness: .4 }), .1, g, 0, .45, 0); box(6.6, .1, 3.2, mat(0x101012, { roughness: .3, metalness: .6 }), 0, g, 0, .92, 0); for (const s of [-1, 1]) box(.3, .3, .3, mat(0xd8323a), .05, g, s * 3, .5, 1.85); outline(g, 1.2); return g; })();
const FIRE = Array.from({ length: 8 }, (_, i) => { const m = new THREE.Mesh(new THREE.ConeGeometry(.35, 1.2, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, .7, .2), transparent: true, opacity: .85, toneMapped: false })); scene.add(m); return m; });
const STEAM = Array.from({ length: 8 }, () => sphere(.5, mat(0xffffff, { roughness: 1, transparent: true, opacity: .4, depthWrite: false }), scene, 0, 0, 0, 8, 6));
const CONF = Array.from({ length: 70 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const FW = Array.from({ length: 60 }, (_, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(.5, 6, 4), new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL((i % 6) / 6, 1, .6).multiplyScalar(2.5), toneMapped: false })); scene.add(s); return s; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 2 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const NOTES = Array.from({ length: 4 }, (_, i) => { const p = textPlane(1.4, 1.4, 64, 64, (c, w, h) => { c.font = `700 56px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 8; c.strokeStyle = '#1a1a2a'; c.strokeText(i % 2 ? '♪' : '♫', w / 2, h / 2); c.fillStyle = '#ffd23f'; c.fillText(i % 2 ? '♪' : '♫', w / 2, h / 2); }); p.material.depthWrite = false; scene.add(p); return p; });
const HEARTS = Array.from({ length: 5 }, () => { const p = textPlane(1.2, 1.2, 64, 64, (c, w, h) => { c.fillStyle = '#ff3a6a'; c.beginPath(); c.moveTo(32, 54); c.bezierCurveTo(0, 30, 8, 4, 32, 18); c.bezierCurveTo(56, 4, 64, 30, 32, 54); c.fill(); }); p.material.depthWrite = false; scene.add(p); return p; });
// rayas de velocidad (manos que ya no se ven)
const STREAK = Array.from({ length: 14 }, () => { const m = new THREE.Mesh(new THREE.PlaneGeometry(.12, 2.6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .8, depthWrite: false, side: THREE.DoubleSide })); scene.add(m); return m; });
// brazos fantasma (borrón de las manos): copias de las manos del personaje
const GHOST = Array.from({ length: 6 }, () => { const m = box(.8, .52, .82, new THREE.MeshBasicMaterial({ color: 0xc68b5e, transparent: true, opacity: .35, depthWrite: false }), .16, scene, 0, 0, 0); return m; });

const PROPS = [CALDI, PTAB, ...WR, ...PARC, ...BUR, ...TWR, ALM, SW, PLT, WPLT, EGG, DOG, CLIP, LET, POT, CAKE, CALD, SPAT, ...PAT, MGR, ...FIRE, ...STEAM, ...CONF, ...FW, ...DUST, ...SWEAT, ...TEAR, ...NOTES, ...HEARTS, ...STREAK, ...GHOST];
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.25; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.55, .62, .42); sun.intensity = 2.5; sun.color.setRGB(1, .95, .86); rim.intensity = 1.0;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function night(fill = 40) { MODE = 'night'; renderer.toneMappingExposure = 1.05; setSky([.04, .05, .2], [.12, .12, .38], [.32, .22, .5]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = 1.15; hemi.color.setRGB(.7, .74, 1); hemi.groundColor.setRGB(.32, .28, .4); sun.intensity = 1.2; sun.color.setRGB(.78, .78, 1); rim.intensity = 1.8;
  scene.fog.color.setRGB(.12, .12, .3); scene.fog.density = .001; bloom.strength = .32; bloom.threshold = .82; FILL.intensity = fill; BIRDSON = 0; }
function inside(h = 1.0, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .22; bloom.threshold = .86; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } HATS.get(c).visible = false; }
  PHAT.visible = false; TIE.userData.wrap.visible = false; CLIP.userData.wrap.visible = false; DOG.userData.wrap.visible = false; WR.forEach(w => w.userData.set(0));
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  ST.TW.forEach(t => t.userData.set(0)); BB.PARTY.visible = false; FEST.visible = true;
  for (const k in SETS) SETS[k].visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = 1.12; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; day(); }
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

// ---------- envolver ----------
// golpes de la ráfaga n (1..7); cuántos han pasado en T y fracción hacia el siguiente
const hits = n => HU[n - 1][2];
const hitN = (T, hs) => { let n = 0; for (const h of hs) if (T >= h) n++; return n; };
const sinceHit = (T, hs) => { let l = -9; for (const h of hs) if (T >= h) l = h; return T - l; };
// progreso del envoltorio: arranca en p0 y avanza un paso por golpe (con remate)
const wrapP = (T, hs, p0 = 0, step = .34) => { const n = hitN(T, hs); const d = sinceHit(T, hs); return p0 + (n - 1 + (n ? easeOut(clamp(d / .12)) : 0)) * step + (n ? step : 0) * 0; };
// pose de envolver: brazos sobre la mesa; en cada golpe las manos se juntan de golpe (izquierda/derecha alternas)
function wrapPose(T, hs, speed = 1) { const n = hitN(T, hs), d = sinceHit(T, hs), j = Math.exp(-d * 18) * (n % 2 ? 1 : -1), s = Math.sin(T * 22 * speed) * .12;
  return { aLx: 1.35 + s, aRx: 1.35 - s, aLz: -.35 - j * .45, aRz: -.35 + j * .45, aLe: .7 + Math.abs(j) * .5, aRe: .7 + Math.abs(j) * .5, lean: .22, headX: .32, crouch: .05 }; }
const wrapLoop = (T, rate = 2.2) => (T * rate) % 1;   // envoltorio continuo (sin golpes)
function wrapIdle(T, rate = 2.2) { const ph = Math.floor(T * rate * 4), j = Math.exp(-((T * rate * 4) % 1) * 3) * (ph % 2 ? 1 : -1);
  return { aLx: 1.35, aRx: 1.35, aLz: -.35 - j * .35, aRz: -.35 + j * .35, aLe: .7 + Math.abs(j) * .4, aRe: .7 + Math.abs(j) * .4, lean: .2, headX: .3 }; }
// ich detrás de la mesa de la Stube, mirando a cámara (+z)
const atDesk = (pose, T) => { const c = put(ich, SX, 0, -3.0, 0); actuar(c, 0, [[0, pose]], { T }); return c; };
const DESK = V(SX, 2.3, -.3);
// multitud de extras reales (EX) alrededor de (cx, cz), por detrás del sujeto según la cámara (nunca entre la cámara y el sujeto)
function partyCrowd(L, cx, cz, n, r0, r1, seed = 1, o = {}) { const list = (o.list || EX).slice(0, n); POST.push(() => { const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx); const arc = o.full ? [0, 6.283] : [ac + (o.gap ?? 1.4), ac + 6.283 - (o.gap ?? 1.4)];
  list.forEach((c, i) => { const a = arc[0] + (i + r() * .8) / list.length * (arc[1] - arc[0]); const d = r0 + r() * (r1 - r0); const x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d;
    const face = o.face || camera.position; const ry = Math.atan2(face.x - x, face.z - z) + (r() - .5) * .9;
    if (o.mode === 'walk') { put(c, x, 0, z, ry); actuar(c, 0, [[0, walkP(L.T, i)]], { T: L.T }); cara(c, L.T + i, { expr: o.expr || 'joy', mouth: o.mouth || 'open_smile' }); }
    else if (o.mode === 'hungry') { put(c, x, 0, z, ry); actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: -.3, aRz: -.3, aLe: 1.6, aRe: 1.6, headX: -.15 + Math.sin(L.T * 6 + i) * .05 }]], { T: L.T }); cara(c, L.T + i, { expr: 'shock', mouth: Math.sin(L.T * 8 + i) > 0 ? 'o' : 'ah' }); }
    else partyGuy(c, x, z, ry, L.T, i * 1.7, i % 3 ? 'joy' : 'laugh');
    if (o.hats !== false) hat(c); }); }); }
const walkP = (T, i) => { const p = Math.sin(T * 9 + i); return { aLx: p * .6, aRx: -p * .6, lLx: -p * .5, lRx: p * .5, lLk: Math.max(0, p) * .5, lRk: Math.max(0, -p) * .5, lean: .08 }; };
// la Stube por la noche: luces de fiesta fuera, gente bailando detrás de la ventana
function stubeN(L, crowdN = 12) { use('ST'); inside(.85, 18); ST.LO.intensity = 70 + Math.sin(L.T * 9) * 30; ST.BULB.forEach((b, i) => b.material.emissiveIntensity = 2 + Math.sin(L.T * 6 + i) * 1.5);
  if (crowdN) { const r = RNG(5); EX.slice(0, crowdN).forEach((c, i) => { partyGuy(c, SX - 22 + i * (44 / crowdN) + r() * 2, -15 - r() * 9, (r() - .5) * .8, L.T, i * 1.3); }); }
  fireworks(V(SX, 12, -60), L.T, 3, 12); }
// Hufenbach de noche y de fiesta (extras reales alrededor de (cx, cz))
function townN(L, crowdN = 24, cx = -6, cz = -10, r0 = 7, r1 = 26, seed = 9, o = {}) { use('HB'); night(45); FEST.visible = true; BULBS.forEach((b, i) => b.material.emissiveIntensity = 2.2 + Math.sin(L.T * 5 + i * .7) * 1.4);
  if (crowdN) partyCrowd(L, cx, cz, crowdN, r0, r1, seed, o);
  fireworks(V(cx, 20, cz - 60), L.T, 3, 14); }
// Brötchenburg
function burgIn(L, light = 1) { use('BB'); inside(.78 * light, 18); BB.LI.intensity = 70; BB.LK.intensity = 30; }
function burgOut(L, nightM = false) { use('BB'); if (nightM) night(45); else day(); }
const dance = (ch, T, i = 0) => ({ aLx: 2.6 + Math.sin(T * 8 + i) * .4, aRx: 2.6 + Math.cos(T * 8 + i) * .4, aLz: .5, aRz: .5, aLe: .6, aRe: .6, hipY: Math.sin(T * 8 + i) * .25, crouch: .1 + Math.abs(Math.sin(T * 8 + i)) * .12, headZ: Math.sin(T * 4 + i) * .15 });
function partyGuy(ch, x, z, ry, T, i = 0, expr = 'joy') { put(ch, x, Math.abs(Math.sin(T * 8 + i)) * .35, z, ry); hat(ch); actuar(ch, 0, [[0, dance(ch, T, i)]], { T }); if (expr === 'laugh') laughF(ch, T + i); else cara(ch, T + i, { expr, mouth: Math.sin(T * 6 + i) > 0 ? 'open_smile' : 'grin' }); return ch; }

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
const KEY = /^(Stadt|feiern|außer|mir|HUSS!|Geburtstag|Dienstag|Kartoffel|Herzform|übrigens|Vorstellungsgespräch|Job|Burger|Brötchenburg|trainiere|Halb|fünf|Handgelenke|Dreihundert|Frühstück|kein|Falten|falten|stecken|rollen|Fünf|Sekunden|langsam|Teller|Dackel|warm|gut|Udo|Nacht|einmal|Genau|Leben|Drei|Eine|Sekunde|Hände|Gespräch|Chef|Theke|eingewickelt|Klemmbrett|Krawatte|beeindruckt|einzige|Frage|braten|gebraten|nie|gegessen|nur|nicht|Brief|fast|Fast|eingestellt|angefangen|Freitagnacht|Party|Mitternacht|ganze|Hungrig|Fünfhundert|Leute|ich|Fünfzig|Bürgermeister|gefeiert)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,:…–]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t), huss: w[2] === 'HUSS!' }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.huss ? 1.5 : cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); if (cur.huss) c.rotate(((Math.round(cur.t * 10) % 2) ? -1 : 1) * .06); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0;
// cronómetro subido encima de un paquete (para que quede por encima del subtítulo)
const swAt = (x, y, z, ry, s, t, col, k) => { show(PARC[2], x, y, z, ry, s * 1.05); show(SW, x, y + s * 1.4, z, ry, s); SW.userData.draw(t, col, k); };
// ---------- planos de HUSS (ráfaga n, golpes en hits(n)) ----------
// progreso del envoltorio: cada 3 golpes un paquete (0,3 → 0,6 → paquete)
const tripleP = (T, hs) => { const n = hitN(T, hs); if (!n) return 0; const i = (n - 1) % 3, d = sinceHit(T, hs), q = easeOut(clamp(d / .1)); return i === 2 ? .86 + .14 * clamp(d / .2) : lerp(i * .33, (i + 1) * .33, q); };
const hitFlash = (T, hs) => Math.exp(-sinceHit(T, hs) * 14);
// dónde: 'ST' cuarto (de noche), 'BB' mostrador de la Brötchenburg (fiesta), 'GR' aprendiendo a freír (plancha en el cuarto)
function hussSet(L, where) { if (where === 'BB') { burgIn(L); BB.PARTY.visible = true; return V(BX, 2.7, .3); } stubeN(L, 40); return DESK.clone(); }
function hussShot(L, n, kind, where = 'ST', o = {}) { const hs = hits(n), T = L.T, D = hussSet(L, where), fl = hitFlash(T, hs), base = o.base ?? 0;
  const me = where === 'BB' ? put(ich, BX, 0, -2.2, 0) : put(ich, SX, 0, -3.0, 0); if (where === 'BB') PHAT.visible = true;
  actuar(me, 0, [[0, wrapPose(T, hs, 1.2)]], { T }); cara(me, T, { expr: 'determined', eyes: 'angry', mouth: fl > .4 ? 'grimace' : 'flat' });
  const cnt = base + hitN(T, hs); const tw = where === 'BB' ? TWR[0] : ST.TW[0]; if (where === 'BB') { show(TWR[0], BX - 3.2, 2.7, .4, 0, .5); show(TWR[1], BX - 5.4, 2.7, .1, .3, .5); TWR[1].userData.set(Math.min(40, 12 + Math.floor(cnt / 2))); }
  tw.userData.set(Math.min(30, 4 + Math.floor(cnt / 3)));
  if (where === 'GR') { show(MGR, D.x, D.y, D.z, 0, .5); PAT.forEach((p, i) => { show(p, D.x - 1.2 + (i % 3) * 1.2, D.y + .55, D.z - .3 + Math.floor(i / 3) * .7, 0, .5); p.userData.set(i % 3 === (hitN(T, hs) % 3) ? clamp(sinceHit(T, hs) / .3) : 0, D.y + .55); }); attach(SPAT, me.aR.hand, [0, -.5, .3], [-1.4, 0, 0], .55); steam(V(D.x, D.y + .8, D.z), T, 6); flames(V(D.x, D.y + .2, D.z), T, 3); }
  else { show(WR[0], D.x, D.y, D.z, 0, .5); WR[0].userData.set(tripleP(T, hs)); }
  const H_ = hp(me);
  if (kind === 'top') cam([D.x + .2, D.y + 7.4 - fl * .5, D.z + 2.6], [D.x, D.y, D.z - .2], 42);
  else if (kind === 'face') { const s = o.side ?? .25; cam([H_.x + s * 6, H_.y + 1.0, H_.z + 6.8 - fl * .6], [H_.x, H_.y - .9, H_.z], 42); if (where !== 'BB') sweat(me, T, 2); }
  else if (kind === 'side') cam([D.x + 7, D.y + 2.6, D.z + 5.5 - fl * .4], [D.x - .3, D.y + 1.4, D.z - 1.2], 42);
  else if (kind === 'low') cam([D.x - 3.6, D.y + .9, D.z + 6.2], [D.x, D.y + 1.6, D.z - 1.4], 46);
  else if (kind === 'wide') orbit(V(D.x, D.y + 1.4, D.z - 1.4), lerp(13, 11, L.k), o.yaw ?? -.35, where === 'BB' ? .42 : .14, 44);
  if (o.clock) { const v = o.clock(T); swAt(D.x - 2.6, D.y, D.z + .4, .35, .38, v[0], v[1], v[2]); }
  if (o.counter) badge('gold', o.counter(cnt), W / 2, H * .17, 1, 1, .85);
  SHAKE = Math.max(SHAKE, fl * .5); BLUR = fl * .03; sh(V(D.x, 0, D.z), 14); }
const hussSfx = (n, t0, t1, kind = 'paper') => hits(n).filter(h => h >= t0 - .001 && h < t1).map(h => [h - t0, ['paper', 'cloth', 'rip'][Math.round(h * 10) % 3], .7]).concat(kind === 'grill' ? [[0, 'pan_sizzle', .5]] : []);
// ---------- a: gancho, la fiesta, mi entrenamiento (0 – 32,05 s) ----------
const P0 = V(-6, 0, -6);   // centro de la fiesta en la plaza
const dancers = (L, cx, cz, list, r = 3.2, face = null) => list.forEach((c, i) => { const a = (i / list.length) * PI * 1.4 - PI * .7 + PI; const x = cx + Math.sin(a) * r * (i % 2 ? 1 : .7), z = cz + Math.cos(a) * r * .6 - 1.5;
  partyGuy(c, x, z, face ? faceTo(V(x, 0, z), face) : 0, L.T, i * 1.3, i % 2 ? 'laugh' : 'joy'); });
const deskBase = (L, n = 10) => { stubeN(L, 12); ST.TW.forEach((t, i) => t.userData.set([n, n + 6, n + 3][i])); };

// 1 «In dieser Stadt sind alle feiern,» (zoom lento): la plaza llena de fiesta, Udo y los colegas bailando en el centro, fuegos artificiales
shot(0, 'Z', 'slow', L => { townN(L, 24, P0.x, P0.z, 6, 22, 3); partyGuy(udo, P0.x, P0.z + 1, 0, L.T, 0, 'laugh'); dancers(L, P0.x, P0.z, [K[0], XT[0], K[1], XT[1]], 3.4);
  orb(L.k, V(P0.x, 3.8, P0.z + 1), null, [19, .12, .14, 48], [12.5, .05, .1, 46]); confRain(V(P0.x, 0, P0.z + 2), L.T, 50, 14, 10, 12); sh(V(P0.x, 0, P0.z), 30); },
  [[0, 'party_horn', .6], [.2, 'cheer', .6], [.6, 'firework', .5], [1.2, 'confetti', .5]]);
// 2 «außer mir.»: yo en mi cuarto, serio, la fiesta al otro lado de la ventana
shot(1.79, 'C', 'punch', L => { deskBase(L, 6); const c = atDesk({ aLx: .3, aRx: .3, aLz: -.9, aRz: -.9, aLe: 1.9, aRe: 1.9, headX: .05 }, L.T); cara(c, L.T, { expr: 'determined', eyes: 'half', mouth: 'flat' }); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5);
  orbit(V(SX, 4.1, -3), lerp(9, 8, L.k), .06, .1, 42); sh(V(SX, 0, -3), 16); }, [[0, 'thud', .5], [.2, 'crickets', .3]]);
// 3–6 HUSS ×6 (ráfaga 1)
shot(2.60, 'C', null, L => hussShot(L, 1, 'top'), hussSfx(1, 2.60, 2.98));
shot(2.98, null, null, L => hussShot(L, 1, 'face'), hussSfx(1, 2.98, 3.55));
shot(3.55, 'C', null, L => hussShot(L, 1, 'side'), hussSfx(1, 3.55, 3.95));
shot(3.95, null, null, L => hussShot(L, 1, 'low'), hussSfx(1, 3.95, 4.55));
// 7 «Die feiern für alles:»: colegas brindando y bailando bajo las guirnaldas
shot(4.55, 'W', null, L => { townN(L, 16, 20, -30, 6, 18, 5); dancers(L, 20, -30, [K[2], XT[2], K[3]], 2.6); orb(L.k, V(20, 3.6, -31), null, [17, -.5, .12, 46], [15, -.25, .1, 46]); sh(V(20, 0, -30), 24); },
  [[0, 'cheer', .5], [.4, 'clack', .4]]);
// 8 «einen Geburtstag,»: la abuela sopla las velas de la tarta, todos con gorro
shot(5.42, 'F', null, L => { townN(L, 14, 36, -40, 6, 16, 7); put(oma, 36, 0, -40, 0); hat(oma); const blow = L.lt > .35; actuar(oma, 0, [[0, { aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: 1.2, aRe: 1.2, lean: blow ? .25 : .1, headX: .2 }]], { T: L.T }); cara(oma, L.T, { expr: 'joy', mouth: blow ? 'o' : 'open_smile' });
  show(PTAB, 37.6, 0, -38.4); show(CAKE, 37.6, 2.2, -38.4, 0, .6); partyGuy(K[4], 33.2, -39.5, .6, L.T, 1); partyGuy(XT[3], 38.8, -39.5, -.6, L.T, 2); if (blow) confetti(V(36, 0, -38), L.t0 + .4, L.T, 50, .7);
  orbit(V(36.5, 4.2, -39.4), lerp(11.5, 10, L.k), -.25, .2, 44); sh(V(36, 0, -39), 16); }, [[0, 'pop', .4], [.35, 'party_horn', .6], [.45, 'confetti', .5]]);
// 9 «einen Dienstag,»: Lena baila con el calendario DIENSTAG – PARTY!
shot(6.36, 'S', null, L => { townN(L, 14, -30, 10, 6, 18, 11); const c = put(XT[0], -30, Math.abs(Math.sin(L.T * 8)) * .3, 10, 0); hat(c); actuar(c, 0, [[0, { aLx: 2.3, aRx: 2.3, aLz: .1, aRz: .1, aLe: .5, aRe: .5, hipY: Math.sin(L.T * 8) * .25 }]], { T: L.T }); laughF(c, L.T);
  show(CALDI, -27.4, 5.6, 9.4, -.2, .8); partyGuy(K[5], -33, 8.5, .4, L.T, 3); partyGuy(EX[20], -27, 8.5, -.4, L.T, 4);
  orb(L.k, V(-28.8, 4.6, 10), null, [12, -.2, .1, 46], [10.5, .05, .08, 46]); sh(V(-30, 0, 10), 18); }, [[0, 'pages', .5], [.3, 'cheer', .4]]);
// 10 «einmal, weil jemand eine Kartoffel»: el niño levanta la patata con forma de corazón
shot(7.50, 'C', 'punch', L => { townN(L, 14, 10, 30, 6, 16, 13); const c = put(kid, 10, 0, 30, 0); hat(kid); const up = easeOut(clamp(L.lt / .4)); actuar(c, 0, [[0, { aLx: lerp(.4, 2.9, up), aRx: lerp(.4, 2.9, up), aLz: .15, aRz: .15, aLe: .2, aRe: .2, headX: -.25 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', mouth: 'open_smile' });
  const hp_ = c.aR.hand.getWorldPosition(V()), hl = c.aL.hand.getWorldPosition(V()); show(POT, (hp_.x + hl.x) / 2, (hp_.y + hl.y) / 2 + .55, (hp_.z + hl.z) / 2 + .1, 0, .42);
  orbit(V(10, 3.8, 30), lerp(9, 7.5, L.k), .15, .02, 46); sh(V(10, 0, 30), 16); }, [[0, 'sparkle', .6], [.3, 'gasp', .4]]);
// 11 «in Herzform gefunden hat.»: todos lo levantan en hombros, confeti, corazón gigante
shot(8.80, 'Z', null, L => { townN(L, 20, 10, 30, 6, 18, 17); const c = put(kid, 10, 2.6 + Math.sin(L.T * 7) * .25, 30, 0); hat(kid); actuar(c, 0, [[0, { aLx: 2.9, aRx: 2.9, aLz: .3, aRz: .3, lLx: .3, lRx: .3 }]], { T: L.T }); laughF(c, L.T);
  [[K[6], -1.3], [XT[4], 1.3]].forEach(([k, s], i) => { put(k, 10 + s, 0, 28.9, 0); hat(k); actuar(k, 0, [[0, { aLx: 2.8, aRx: 2.8, aLz: s < 0 ? -.4 : .2, aRz: s < 0 ? .2 : -.4, aLe: .4, aRe: .4 }]], { T: L.T + i }); laughF(k, L.T + i); });
  const hp_ = c.aR.hand.getWorldPosition(V()), hl = c.aL.hand.getWorldPosition(V()); show(POT, (hp_.x + hl.x) / 2, (hp_.y + hl.y) / 2 + .55, (hp_.z + hl.z) / 2, Math.sin(L.T * 3) * .3, .5); hearts(V(10, 7.5, 30.5), L.T); confetti(V(10, 0, 30), L.t0, L.T, 60);
  orb(L.k, V(10, 5.4, 30), null, [16, -.15, .08, 48], [13, .15, .1, 48]); sh(V(10, 0, 30), 18); }, [[0, 'cheer', .7], [.2, 'confetti', .5], [.6, 'party_horn', .5]]);
// 12 «Während die anderen feiern,»: grúa sobre la plaza llena (DJ, bombillas)
shot(10.0, 'W', null, L => { townN(L, 24, 20, 4, 5, 20, 19); partyGuy(K[7], 20, 6, 0, L.T, 2); partyGuy(XT[5], 17.5, 4.5, .4, L.T, 3);
  cm([8, 18, 30, 20, 3, 0, 50], [6, 10, 22, 20, 3, 2, 48], L.k); sh(V(20, 0, 4), 30); }, [[0, 'cheer', .5], [.3, 'firework', .5]]);
// 13 «übrigens,»: primer plano: me giro a cámara, serio
shot(11.08, 'C', null, L => { deskBase(L, 8); const c = atDesk({ ...GEST.cross, headY: lerp(-.5, 0, easeOut(clamp(L.lt / .3))) }, L.T); cara(c, L.T, { expr: 'sus', eyes: 'half', mouth: 'flat' }); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(.3);
  onFace(c, 5.2, 0, .3, 38, L.k, 4.6); sh(V(SX, 0, -3), 14); }, [[0, 'whoosh', .4], [.2, 'blink', .4]]);
// 14 «bin ich hier drin»: plano general del cuarto: yo envolviendo, torres de paquetes, la fiesta en la ventana
shot(11.86, 'S', null, L => { deskBase(L, 14); const c = atDesk(wrapIdle(L.T), L.T); cara(c, L.T, { expr: 'determined' }); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(wrapLoop(L.T, 1.2));
  orb(L.k, V(SX, 3.6, -3), null, [17, .35, .14, 46], [15, .2, .12, 46]); sh(V(SX, 0, -3), 18); }, [[0, 'paper', .5], [.5, 'cloth', .4]]);
// 15 «und bereite mich auf mein»: el calendario en la pared: FREITAG 13 – GESPRÄCH! (rodeado en rojo)
shot(12.86, 'F', null, L => { deskBase(L, 14); const c = atDesk(wrapIdle(L.T), L.T); cara(c, L.T, { expr: 'determined', eyes: 'side_l' });
  cm([SX - 8.5, 6.4, 3.6, SX - 14.7, 6.2, 3.5, 40], [SX - 9.6, 6.3, 3.5, SX - 14.7, 6.2, 3.5, 40], L.k); sh(V(SX, 0, -3), 18); }, [[0, 'pages', .5], [.3, 'pencil', .4]]);
// 16 «Vorstellungsgespräch vor.» (zoom lento): el cartel WIR STELLEN EIN; señalo con el dedo
shot(13.66, null, 'slow', L => { deskBase(L, 14); const c = put(ich, SX - 12.6, 0, -.6, PI / 2 + .25); actuar(c, 0, [[0, { aLx: 2.0, aLz: .3, aLe: .1, headY: -.3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'smirk' });
  orb(L.k, V(SX - 13.0, 5, -2.0), null, [13, 1.25, .08, 46], [10, 1.3, .06, 44]); sh(V(SX - 12, 0, -3), 16); }, [[0, 'pop', .4]]);
// 17–19 HUSS ×6 (ráfaga 2)
shot(14.90, 'C', null, L => hussShot(L, 2, 'face', 'ST', { side: -.3, base: 6 }), hussSfx(2, 14.90, 15.82));
shot(15.82, null, null, L => hussShot(L, 2, 'top', 'ST', { base: 6 }), hussSfx(2, 15.82, 16.25));
shot(16.25, 'C', null, L => hussShot(L, 2, 'side', 'ST', { base: 6 }), hussSfx(2, 16.25, 16.62));
// 20 «Der Job:»: la Brötchenburg de día, la cámara entra
shot(16.62, 'Z', null, L => { burgOut(L); partyCrowd(L, BX, 52, 6, 4, 12, 21, { mode: 'walk', hats: false });
  orb(L.k, V(BX, 6.2, 40), null, [34, 0, .04, 48], [28, .05, .05, 48]); sh(V(BX, 0, 44), 30); }, [[0, 'city_amb', .5], [.2, 'car_pass', .3]]);
// 21 «Burger einwickeln»: el cartel del escaparate: WIR STELLEN EIN! – Burger-Einwickler
shot(17.18, 'C', 'punch', L => { burgOut(L); const p = V(BX + 5.9, 2.85, 40.5); cm([p.x - .4, p.y + .1, p.z + 7.2, p.x, p.y, p.z, 38], [p.x - .2, p.y, p.z + 6.2, p.x, p.y, p.z, 38], L.k); sh(V(BX, 0, 44), 20); }, [[0, 'pop', .5], [.2, 'paper', .4]]);
// 22 «in der Brötchenburg.»: grúa hacia arriba: el letrero con el castillo-hamburguesa; yo delante mirando
shot(17.90, 'W', null, L => { burgOut(L); put(ich, BX, 0, 47, PI); actuar(ich, 0, [[0, { headX: -.35 }]], { T: L.T }); cara(ich, L.T, { expr: 'happy', eyes: 'up' });
  cm([BX + 3, 3.4, 60, BX, 5.2, 40, 50], [BX + 2, 4.5, 63, BX, 8, 40, 50], L.k); sh(V(BX, 0, 44), 30); }, [[0, 'sparkle', .5], [.4, 'ding_soft', .4]]);
// 23 «Also trainiere ich.»: me ato la cinta y crujo los dedos
shot(18.95, 'F', null, L => { deskBase(L, 14); const k = L.lt; const c = atDesk(k < .5 ? { aRx: 2.5, aRz: 1.2, aRe: 1.9, aLx: .3, aLz: .1, headX: -.05 } : { aLx: .9, aRx: .9, aLz: .5, aRz: .5, aLe: 1.9 + Math.sin(L.T * 30) * .1, aRe: 1.9, lean: .05 }, L.T); cara(c, L.T, { expr: 'determined', mouth: 'smirk' });
  onFace(c, 6, -.2, -.6, 40, L.k, 5); sh(V(SX, 0, -3), 14); }, [[0, 'cloth', .5], [.55, 'back_crack', .6]]);
// 24 «Halb fünf Uhr morgens:»: el despertador suena a las 4:30 en la mesa; me levanto de un salto (cuarto a oscuras, alba azul)
shot(20.05, 'C', 'punch', L => { use('ST'); inside(.5, 10); ST.LO.intensity = 0; ST.LI.intensity = 20; TINT = 'rgba(30,50,120,.18)'; ST.TW.forEach((t, i) => t.userData.set([14, 20, 17][i]));
  const sh_ = Math.sin(L.T * 60) * .06; show(ALM, SX - .4, 2.3, .2, sh_, .55); ALM.userData.draw('4:30'); const c = put(ich, SX, Math.max(0, Math.sin(clamp((L.lt - .2) / .5) * PI)) * 1.2, -3, 0); actuar(c, 0, [[0, 'shock']], { T: L.T }); cara(c, L.T, { expr: 'determined', eyes: 'wide' });
  cam([SX - 1.2, 3.6, 4.2], [SX - .4, 3.4, -1], 42); sh(V(SX, 0, -2), 14); }, [[0, 'alarm', .7], [.3, 'jump', .4]]);
// 25 «Handgelenke dehnen.»: primer plano: estiro las muñecas (muñequeras verdes)
shot(21.22, 'S', null, L => { use('ST'); inside(.7, 14); ST.LO.intensity = 0; TINT = 'rgba(40,60,130,.1)'; const r = Math.sin(L.T * 9); const c = atDesk({ aLx: 1.55, aRx: 1.55, aLz: -.25 + r * .2, aRz: -.25 - r * .2, aLe: .2, aRe: .2 }, L.T); cara(c, L.T, { expr: 'determined', eyes: 'squint' });
  c.aL.hand.rotation.x = r * .9; c.aR.hand.rotation.x = -r * .9; const h = hp(c); cam([h.x + 1.4, h.y + .2, h.z + 8.5], [h.x, h.y - 1.3, h.z + 1], 42); sh(V(SX, 0, -3), 14); }, [[0, 'back_crack', .5], [.4, 'cloth', .4]]);
// 26 «Dreihundert Burger»: las torres de paquetes crecen a toda velocidad; contador 300
shot(22.0, 'Z', null, L => { deskBase(L, 0); const n = Math.floor(easeOut(L.k) * 26); ST.TW.forEach((t, i) => t.userData.set(Math.min(30, 4 + n + i * 2))); const c = atDesk(wrapIdle(L.T, 3.2), L.T); cara(c, L.T, { expr: 'determined' }); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(wrapLoop(L.T, 3));
  badge('gold', String(Math.round(easeOut(L.k) * 300)), W / 2, H * .2, 1, 1, 1); orb(L.k, V(SX, 3.9, -3), null, [13, -.4, .18, 48], [11, -.25, .14, 48]); sh(V(SX, 0, -3), 18); }, [[0, 'count', .5], [.5, 'paper', .4]]);
// 27 «vor dem Frühstück.»: amanece en la ventana; la mesa llena; 300 en el contador
shot(23.0, 'W', null, L => { use('ST'); day(); inside(.9, 20); ST.LO.intensity = 0; ST.TW.forEach((t, i) => t.userData.set([30, 30, 30][i])); const c = atDesk(wrapIdle(L.T, 2.5), L.T); cara(c, L.T, { expr: 'determined', eyes: 'half' }); sweat(c, L.T, 2);
  badge('gold', '300', W / 2, H * .2, 1, 1, 1);
  orbit(V(SX, 3.6, -3), lerp(12, 10.5, L.k), .45, .1, 46); sh(V(SX, 0, -3), 18); }, [[0, 'rooster', .4], [.4, 'paper', .4]]);
// 28 «Ich esse kein Frühstück.»: me ponen el desayuno delante (huevo y bacon): niego con la cabeza
shot(24.08, 'F', null, L => { use('ST'); day(); inside(.9, 20); ST.LO.intensity = 0; ST.TW.forEach((t, i) => t.userData.set([30, 30, 30][i])); const c = atDesk({ aLx: .4, aRx: .4, aLz: -.9, aRz: -.9, aLe: 1.8, aRe: 1.8, headY: Math.sin(L.T * 9) * .35 }, L.T); cara(c, L.T, { expr: 'determined', mouth: 'flat' });
  show(PLT, DESK.x, DESK.y, DESK.z + .2, 0, .5); show(EGG, DESK.x, DESK.y, DESK.z + .2, 0, .5); orbit(V(SX, 3.5, -2.2), lerp(8, 7, L.k), -.25, .12, 42); sh(V(SX, 0, -3), 14); }, [[0, 'plate_slide', .5], [.4, 'sniff', .4]]);
// 29 «Ich wickle es ein.»: cenital: el desayuno desaparece en el papel → plato envuelto
shot(25.28, 'C', 'punch', L => { use('ST'); day(); inside(.9, 20); ST.LO.intensity = 0; const c = atDesk(wrapIdle(L.T, 3), L.T); cara(c, L.T, { expr: 'determined' }); const w = L.lt > .55;
  show(w ? WPLT : PLT, DESK.x, DESK.y, DESK.z + .2, 0, .5 * (w ? 1 + Math.sin(clamp((L.lt - .55) / .2) * PI) * .2 : 1)); if (!w) show(EGG, DESK.x, DESK.y, DESK.z + .2, 0, .5); dust(V(DESK.x, DESK.y, DESK.z), L.t0 + .55, L.T, 6, .25);
  cam([DESK.x + .2, DESK.y + 5.2, DESK.z + 1.8], [DESK.x, DESK.y, DESK.z], 42); sh(V(SX, 0, -3), 14); }, [[0, 'paper', .6], [.55, 'pop', .6]]);
// 30–33 «Falten, falten, stecken, rollen.»: cada palabra un plano; el envoltorio avanza
const fold = (p, kind) => L => { use('ST'); day(); inside(.9, 20); ST.LO.intensity = 0; ST.TW.forEach((t, i) => t.userData.set([22, 26, 24][i])); const c = atDesk(wrapIdle(L.T, 2), L.T); cara(c, L.T, { expr: 'determined', eyes: 'squint' });
  show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(lerp(p - .22, p, easeOut(clamp(L.lt / .3)))); const D = DESK;
  if (kind === 'top') cam([D.x - .2, D.y + 5, D.z + 1.4], [D.x, D.y, D.z], 40); else if (kind === 'side') cam([D.x + 4.8, D.y + 2, D.z + 2.6], [D.x, D.y + .4, D.z], 40); else cam([D.x - 3, D.y + 1, D.z + 3.6], [D.x, D.y + .5, D.z], 42); sh(V(SX, 0, -3), 14); };
shot(26.58, 'C', null, fold(.22, 'top'), [[0, 'paper', .7]]);
shot(27.20, 'C', null, fold(.44, 'side'), [[0, 'paper', .7]]);
shot(27.64, 'C', null, fold(.66, 'low'), [[0, 'cloth', .7]]);
shot(28.12, 'C', null, fold(1.0, 'top'), [[0, 'rip', .5], [.2, 'pop', .5]]);
// 34 «Fünf Sekunden.»: el cronómetro marca 5,0 en rojo; yo detrás, frustrado
shot(28.60, 'C', 'punch', L => { use('ST'); day(); inside(.9, 20); ST.LO.intensity = 0; const c = atDesk({ aLx: 1.1, aRx: 1.1, aLz: -.4, aRz: -.4, aLe: .9, aRe: .9 }, L.T); cara(c, L.T, { expr: 'angry' }); show(PARC[0], DESK.x + .6, DESK.y, DESK.z, .2, .5);
  swAt(DESK.x - .8, DESK.y, DESK.z + .9, .25, .42, '5,0', '#d8323a', 1); cam([DESK.x - .8, DESK.y + 2.2, DESK.z + 6.6], [DESK.x - .6, DESK.y + .9, DESK.z - .6], 44); sh(V(SX, 0, -3), 14); }, [[0, 'watch_click', .6], [.2, 'tick', .4]]);
// 35 «Zu langsam.»: me llevo las manos a la cabeza
shot(29.45, 'W', null, L => { use('ST'); day(); inside(.9, 20); ST.LO.intensity = 0; ST.TW.forEach((t, i) => t.userData.set([22, 26, 24][i])); const c = atDesk(GEST.hands_head, L.T); cara(c, L.T, { expr: 'angry', mouth: 'grimace_wide' }); show(PARC[0], DESK.x + .6, DESK.y, DESK.z, .2, .5);
  onFace(c, 7, .2, .8, 42, L.k, 6); badge('red', 'ZU LANGSAM', W / 2, H * .12, (L.lt - .1) * 4, 1, .75); sh(V(SX, 0, -3), 14); }, [[0, 'sigh', .5], [.3, 'sad_tone', .4]]);
// 36–39 HUSS ×6 (ráfaga 3)
shot(30.38, 'C', null, L => hussShot(L, 3, 'top', 'ST', { base: 12 }), hussSfx(3, 30.38, 30.78));
shot(30.78, null, null, L => hussShot(L, 3, 'face', 'ST', { base: 12, side: .35 }), hussSfx(3, 30.78, 31.35));
shot(31.35, 'C', null, L => hussShot(L, 3, 'side', 'ST', { base: 12, clock: T => ['4,0', '#e8a020', .8] }), hussSfx(3, 31.35, 31.75));
shot(31.75, null, null, L => hussShot(L, 3, 'low', 'ST', { base: 12 }), hussSfx(3, 31.75, 32.05));
// ---------- b: lo envuelvo todo, Udo, «un vida, una entrevista», manos invisibles (32,05 – 54,05 s) ----------
const roomN = (L, n = 16) => { stubeN(L, 12); ST.TW.forEach((t, i) => t.userData.set([n, n + 6, n + 3][i])); };
// 40 «Ich wickle den Burger ein.»: cenital: una hamburguesa entra en el papel → paquete
shot(32.05, 'C', null, L => { roomN(L); const c = atDesk(wrapIdle(L.T, 2.4), L.T); cara(c, L.T, { expr: 'determined' }); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(easeInOut(clamp(L.lt / 1.1)));
  cam([DESK.x + .3, DESK.y + 5.4, DESK.z + 1.7], [DESK.x, DESK.y, DESK.z], 42); sh(V(SX, 0, -3), 14); }, [[0, 'paper', .6], [.5, 'cloth', .5], [1.0, 'pop', .5]]);
// 41 «Ich wickle den Teller ein.»: el plato vacío → plato envuelto (pop)
shot(33.42, 'W', null, L => { roomN(L); const c = atDesk(wrapIdle(L.T, 2.4), L.T); cara(c, L.T, { expr: 'determined', eyes: 'squint' }); const w = L.lt > .55;
  show(w ? WPLT : PLT, DESK.x, DESK.y, DESK.z + .1, 0, .5 * (w ? 1 + Math.sin(clamp((L.lt - .55) / .2) * PI) * .2 : 1)); dust(V(DESK.x, DESK.y, DESK.z), L.t0 + .55, L.T, 6, .25);
  cam([DESK.x + 1.2, DESK.y + 6.2, DESK.z + 3.2], [DESK.x, DESK.y + .2, DESK.z], 42); sh(V(SX, 0, -3), 14); }, [[0, 'porcelain_break', .25], [.5, 'paper', .6], [.6, 'pop', .5]]);
// 42 «Ich wickle den Dackel»: el perro salchicha del vecino sobre la mesa, olisqueando; le miro
shot(34.62, 'F', null, L => { roomN(L); const c = atDesk({ aLx: .9, aRx: .9, aLz: -.3, aRz: -.3, aLe: .9, aRe: .9, lean: .15, headX: .3 }, L.T); cara(c, L.T, { expr: 'sus', eyes: 'down' }); show(DOG, DESK.x, DESK.y, DESK.z + .3, .5, .42); DOG.userData.set(false, L.T);
  cam([DESK.x + 2.2, DESK.y + 2.2, DESK.z + 4.4], [DESK.x, DESK.y + 1, DESK.z], 42); sh(V(SX, 0, -3), 14); }, [[0, 'sniff', .6], [.4, 'bark', .3]]);
// 43 «von meinem Nachbarn ein.»: ¡pop! el Dackel envuelto, solo asoma la cabeza
shot(35.50, 'C', 'punch', L => { roomN(L); const c = atDesk({ aLx: 1.0, aRx: 1.0, aLz: .4, aRz: .4, aLe: .4, aRe: .4, headX: .1 }, L.T); cara(c, L.T, { expr: 'smug' }); show(DOG, DESK.x, DESK.y, DESK.z + .3, .2, .42 * (1 + Math.sin(clamp(L.lt / .25) * PI) * .15)); DOG.userData.set(true, L.T);
  dust(V(DESK.x + .8, DESK.y, DESK.z + .3), L.t0, L.T, 4, .12); orbit(V(SX, 3.4, -1.6), lerp(9, 8, L.k), -.2, .1, 42); sh(V(SX, 0, -3), 14); }, [[0, 'paper', .6], [.1, 'pop', .6]]);
// 44 «Dem Dackel geht's gut.»: primer plano del perro envuelto, contento, lengua fuera
shot(36.62, 'S', null, L => { roomN(L); atDesk(wrapIdle(L.T, 1.5), L.T); cara(ich, L.T, { expr: 'smile' }); show(DOG, DESK.x, DESK.y, DESK.z + .3, .1, .42); DOG.userData.set(true, L.T); DOG.userData.head.rotation.z = Math.sin(L.T * 4) * .15;
  const h = wpos(DOG.userData.head); cam([h.x + .9, h.y + .3, h.z + 3.6], [h.x, h.y - .2, h.z], 38); sh(V(SX, 0, -3), 14); }, [[0, 'bark', .4], [.5, 'sniff', .3]]);
// 45 «Dem Dackel ist warm.»: se le cierran los ojos; corazones
shot(37.80, 'Z', null, L => { roomN(L); atDesk(wrapIdle(L.T, 1.5), L.T); show(DOG, DESK.x, DESK.y, DESK.z + .3, -.1, .42); DOG.userData.set(true, L.T); DOG.userData.head.rotation.x = .25; const h = wpos(DOG.userData.head);
  hearts(h.clone().add(V(0, .3, 0)), L.T); cm([h.x - .8, h.y + .5, h.z + 3.4, h.x, h.y, h.z, 38], [h.x - .5, h.y + .4, h.z + 2.8, h.x, h.y, h.z, 38], L.k); sh(V(SX, 0, -3), 14); }, [[0, 'zzz', .4], [.3, 'sparkle', .4]]);
// 46 «Mein Nachbar Udo feiert»: Udo en la plaza con su gorro, bailando delante de los altavoces
shot(38.98, 'W', null, L => { townN(L, 18, 24, 2, 6, 16, 23); partyGuy(udo, 14, 10, -.4, L.T, 0, 'laugh'); notes(V(14, 7, 10), L.T); orb(L.k, V(14, 3.8, 10), null, [13, -.6, .1, 46], [11, -.4, .08, 46]); sh(V(14, 0, 10), 18); }, [[0, 'cheer', .5], [.4, 'party_horn', .4]]);
// 47 «jede einzelne Nacht.»: Udo encima de una mesa, fuegos artificiales; «JEDE NACHT»
shot(40.08, 'F', null, L => { townN(L, 20, -20, 30, 6, 18, 29); show(PTAB, -20, 0, 30); const c = partyGuy(udo, -20, 30, 0, L.T, 2, 'laugh'); c.root.position.y += 2.3; fireworks(V(-20, 12, -10), L.T, 3, 16);
  badge('big', 'JEDE NACHT', W / 2, H * .17, (L.lt - .2) * 4, 1, .8); orb(L.k, V(-20, 5.6, 30), null, [13, .2, .02, 48], [12, -.1, .05, 48]); sh(V(-20, 0, 30), 18); }, [[0, 'firework', .6], [.3, 'cheer', .5]]);
// 48 «„Komm raus“, sagt er.»: Udo asoma por la puerta de mi cuarto y me hace señas
shot(41.47, 'C', null, L => { roomN(L); ST.DOOR.rotation.y = -PI / 2 + 1.2; const u = put(udo, SX + 12.2, 0, 2.6, -PI / 2 - .25); hat(udo); actuar(u, 0, [[0, { aRx: 1.9, aRz: .9 + Math.sin(L.T * 10) * .3, aRe: .5 + Math.sin(L.T * 10) * .4, aLx: .3 }]], { T: L.T }); talk(udo, L.T, 41.47, 42.74, 'joy');
  const c = atDesk(wrapIdle(L.T, 2), L.T); cara(c, L.T, { expr: 'determined', eyes: 'side_r' }); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(wrapLoop(L.T, 1.5)); bubble(udo, 'Komm raus!', (L.lt - .05) * 4);
  cm([SX + 3.4, 4.6, 7.4, SX + 12.2, 3.6, 2.4, 46], [SX + 4.4, 4.4, 6.8, SX + 12.2, 3.6, 2.4, 44], L.k); sh(V(SX + 6, 0, 0), 18); }, [[0, 'door_open', .6], [.3, 'cheer', .3]]);
// 49 «„Man lebt nur einmal.“»: Udo en primer plano, brazos abiertos; «NUR EINMAL!»
shot(42.74, 'W', null, L => { roomN(L); ST.DOOR.rotation.y = -PI / 2 + 1.2; const u = put(udo, SX + 12.2, 0, 2.6, -PI / 2 - .25); hat(udo); actuar(u, 0, [[0, { aLx: 1.6, aRx: 1.6, aLz: .9, aRz: .9, aLe: .3, aRe: .3, headX: -.1 }]], { T: L.T }); talk(udo, L.T, 42.74, 43.96, 'joy');
  badge('gold', 'NUR EINMAL!', W / 2, H * .18, (L.lt - .15) * 4, 1, .8); onFace(u, 7, 0, .4, 40, L.k, 6); sh(V(SX + 10, 0, 2), 14); }, [[0, 'party_horn', .4]]);
// 50 «Genau.»: primer plano, yo serio asintiendo
shot(43.96, 'C', 'punch', L => { roomN(L); const c = atDesk({ ...wrapIdle(L.T, 1), headX: Math.sin(clamp(L.lt / .35) * PI) * .3, headY: .35 }, L.T); cara(c, L.T, { expr: 'determined', eyes: 'half', mouth: 'smirk' }); onFace(c, 6, 0, -.6, 40); sh(V(SX, 0, -3), 14); }, [[0, 'thud', .4]]);
// 51 «Ein Leben, ein Vorstellungsgespräch.» (zoom lento): 1 LEBEN = 1 GESPRÄCH; señalo el calendario
shot(44.46, null, 'slow', L => { roomN(L); const c = put(ich, SX - 12.6, 0, 6, PI / 2 + .3); actuar(c, 0, [[0, { aRx: 2.0, aRz: .3, aRe: .1, headY: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined' });
  badge('gold', '1 LEBEN', W / 2, H * .15, (L.lt - .05) * 4, 1, .75); badge('red', '1 GESPRÄCH', W / 2, H * .24, (L.lt - .8) * 4, 1, .75);
  orb(L.k, V(SX - 13.0, 5, 5.0), null, [13, 1.4, .06, 46], [10, 1.35, .05, 44]); sh(V(SX - 12, 0, 2), 16); }, [[0, 'pop', .5], [.8, 'pop', .5]]);
// 52–55 HUSS ×6 (ráfaga 4)
shot(46.48, 'C', null, L => hussShot(L, 4, 'face', 'ST', { base: 18, side: -.35 }), hussSfx(4, 46.48, 46.85));
shot(46.85, null, null, L => hussShot(L, 4, 'top', 'ST', { base: 18 }), hussSfx(4, 46.85, 47.42));
shot(47.42, 'C', null, L => hussShot(L, 4, 'side', 'ST', { base: 18 }), hussSfx(4, 47.42, 47.82));
shot(47.82, null, null, L => hussShot(L, 4, 'wide', 'ST', { base: 18, yaw: .4 }), hussSfx(4, 47.82, 48.33));
// 56–59 «Falten, falten, stecken, rollen.» (más rápido)
const fold2 = (p, kind) => L => { roomN(L, 24); const c = atDesk(wrapIdle(L.T, 3), L.T); cara(c, L.T, { expr: 'determined', eyes: 'angry' }); sweat(c, L.T, 2);
  show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(lerp(p - .22, p, easeOut(clamp(L.lt / .2)))); const D = DESK;
  if (kind === 'top') cam([D.x + .3, D.y + 4.6, D.z + 1.2], [D.x, D.y, D.z], 40); else if (kind === 'side') cam([D.x - 4.4, D.y + 1.8, D.z + 2.6], [D.x, D.y + .4, D.z], 40); else cam([D.x + 2.6, D.y + .9, D.z + 3.4], [D.x, D.y + .5, D.z], 42); sh(V(SX, 0, -3), 14); };
shot(48.33, 'C', null, fold2(.22, 'top'), [[0, 'paper', .7]]);
shot(48.95, 'C', null, fold2(.44, 'side'), [[0, 'paper', .7]]);
shot(49.41, 'C', null, fold2(.66, 'top'), [[0, 'cloth', .7]]);
shot(49.85, 'C', null, fold2(1.0, 'low'), [[0, 'rip', .5], [.15, 'pop', .5]]);
// 60 «Drei Sekunden.»: cronómetro 3,0 (amarillo)
shot(50.20, 'C', 'punch', L => { roomN(L, 24); const c = atDesk(wrapIdle(L.T, 3.4), L.T); cara(c, L.T, { expr: 'determined' }); show(WR[0], DESK.x + .8, DESK.y, DESK.z, 0, .5); WR[0].userData.set(wrapLoop(L.T, 2.5));
  swAt(DESK.x - .9, DESK.y, DESK.z + .9, .2, .42, '3,0', '#e8a020', .6); cam([DESK.x - .8, DESK.y + 2.2, DESK.z + 6.6], [DESK.x - .6, DESK.y + .9, DESK.z - .6], 44); sh(V(SX, 0, -3), 14); }, [[0, 'watch_click', .6]]);
// 61 «Eine Sekunde.»: cronómetro 1,0 (verde), chispas
shot(51.05, 'F', null, L => { roomN(L, 28); const c = atDesk(wrapIdle(L.T, 5), L.T); cara(c, L.T, { expr: 'determined', eyes: 'angry' }); show(WR[0], DESK.x + .8, DESK.y, DESK.z, 0, .5); WR[0].userData.set(wrapLoop(L.T, 4.5));
  swAt(DESK.x - .9, DESK.y, DESK.z + .9, .2, .42, '1,0', '#1ab84a', .2); confetti(V(DESK.x - .9, DESK.y - 2, DESK.z + 1), L.t0 + .1, L.T, 20, .4); cam([DESK.x - 1.4, DESK.y + 2.2, DESK.z + 6.4], [DESK.x - .6, DESK.y + .9, DESK.z - .4], 44); sh(V(SX, 0, -3), 14); }, [[0, 'watch_click', .6], [.1, 'sparkle', .5]]);
// 62 «Irgendwann konnte ich meine eigenen»: plano lateral: las manos van tan rápido que son un borrón con estelas
function blurHands(L, c) { const sp = Math.sin(L.T * 70); c.aL.sh.rotation.x -= sp * .25; c.aR.sh.rotation.x += sp * .25; c.root.updateMatrixWorld(true);
  const hs = [c.aL.hand.getWorldPosition(V()), c.aR.hand.getWorldPosition(V())]; GHOST.forEach((g, i) => { const h = hs[i % 2]; g.visible = true; g.position.copy(h).add(V(Math.sin(L.T * 50 + i) * .5, Math.cos(L.T * 43 + i * 2) * .3, Math.sin(L.T * 37 + i) * .3)); g.rotation.set(L.T * 9 + i, i, 0); });
  STREAK.forEach((s, i) => { const h = hs[i % 2]; s.visible = true; s.position.copy(h).add(V((i % 7 - 3) * .2, .2 + (i % 3) * .15, (i % 5 - 2) * .2)); s.lookAt(camera.position); s.rotateZ(PI / 2 + Math.sin(i) * .4); s.material.opacity = .4 + .4 * Math.abs(Math.sin(L.T * 20 + i)); }); BLUR = .025; }
shot(51.80, 'W', null, L => { roomN(L, 28); const c = atDesk(wrapIdle(L.T, 6), L.T); cara(c, L.T, { expr: 'determined', eyes: 'angry' }); sweat(c, L.T, 2); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(wrapLoop(L.T, 5));
  cam([DESK.x + 6, DESK.y + 2.8, DESK.z + 5], [DESK.x, DESK.y + 1.3, DESK.z - .8], 42); POST.push(() => blurHands(L, c)); sh(V(SX, 0, -3), 14); }, [[0, 'whoosh', .5], [.4, 'whoosh_up', .4], [.8, 'paper', .5]]);
// 63 «Hände nicht mehr sehen.»: yo miro mis manos-borrón, alucinado
shot(53.0, 'C', 'punch', L => { roomN(L, 28); const c = atDesk({ ...wrapIdle(L.T, 6), headX: .45 }, L.T); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); show(WR[0], DESK.x, DESK.y, DESK.z, 0, .5); WR[0].userData.set(wrapLoop(L.T, 5));
  onFace(c, 5.4, .3, .9, 42, L.k, 4.8); POST.push(() => blurHands(L, c)); sh(V(SX, 0, -3), 14); }, [[0, 'gasp', .6], [.2, 'whoosh', .4]]);
// ---------- c: la entrevista, el rechazo, aprendo a freír (54,05 – 86,74 s) ----------
// en el mostrador: el jefe detrás (z = -2.2, mira +z), yo delante (z = 2.6, mira -z)
const counter = (L, o = {}) => { burgIn(L); partyCrowd(L, BX, 14, o.n ?? 6, 9, 16, 31, { mode: 'walk', hats: false, gap: 1.6 });
  const c = put(chef, BX - 1.2, 0, -2.2, 0); const m = put(ich, BX + 1.4, 0, 2.6, PI); return [c, m]; };
const CTOP = 2.7;   // altura de la encimera
// 64 «Dann kam das Gespräch.»: camino hacia la Brötchenburg (de día), decidido
shot(54.05, 'Z', null, L => { burgOut(L); const z = lerp(62, 54, L.k); const c = put(ich, BX + 1, 0, z, PI); actuar(c, 0, [[0, walkP(L.T, 0)]], { T: L.T }); cara(c, L.T, { expr: 'determined' }); partyCrowd(L, BX, 54, 6, 6, 14, 33, { mode: 'walk', hats: false });
  cam([BX + 1 + 2.4, 4.4, z + 9.5], [BX + 1, 3.8, z - 4], 46); sh(V(BX, 0, z), 20); }, [[0, 'steps', .5], [.3, 'city_amb', .4]]);
// 65 «Der Chef legte einen Burger»: el jefe deja una hamburguesa sobre el mostrador
shot(55.20, 'W', null, L => { const [c, m] = counter(L); m.root.visible = false; const k = easeInOut(clamp(L.lt / .8)); actuar(c, 0, [[0, { aRx: lerp(.6, 1.2, k), aRz: -.1, aRe: lerp(1.2, .4, k), lean: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'smile' }); cara(m, L.T, { expr: 'determined', eyes: 'down' });
  const hpos = c.aR.hand.getWorldPosition(V()); show(BUR[0], lerp(hpos.x, BX + .1, k), lerp(hpos.y - .3, CTOP, k), lerp(hpos.z + .2, .2, k), 0, .5);
  orbit(V(BX - 1.0, 3.9, -1.0), lerp(15, 13.5, L.k), 1.3, .14, 44); sh(V(BX, 0, 0), 16); }, [[0, 'steps', .3], [.8, 'plate_slide', .5]]);
// 66 «auf die Theke.»: la hamburguesa en el mostrador (plano detalle), ding
shot(56.50, 'C', 'punch', L => { const [c, m] = counter(L); actuar(c, 0, [[0, { aLx: .2, aRx: .2 }]], { T: L.T }); show(BUR[0], BX + .1, CTOP, .2, 0, .5); cara(c, L.T, { expr: 'smile' });
  cam([BX - 1.0, CTOP + 2.8, 4.4], [BX + .1, CTOP + .3, .2], 38); sh(V(BX, 0, 0), 14); }, [[0, 'ding_soft', .7]]);
// 67 «„Wann immer Sie bereit sind“, sagte er.»: el jefe con su portapapeles, sonriente
shot(57.06, 'F', null, L => { const [c, m] = counter(L); actuar(c, 0, [[0, { aLx: .7, aLz: -.2, aLe: 1.5, aRx: .4, aRz: .1, aRe: .6 }]], { T: L.T }); talk(c, L.T, 57.06, 58.9, 'smile'); show(BUR[0], BX + .1, CTOP, .2, 0, .5);
  attach(CLIP, c.aL.hand, [0, -.4, .3], [-.4, 0, 0], .55); onFace(c, 7.5, .2, -1.6, 40, L.k, 6.5); sh(V(BX, 0, 0), 14); }, [[0, 'pages', .4]]);
// 68 «Der Burger war schon eingewickelt.»: ¡ya es un paquete! el jefe parpadea
shot(58.90, 'C', 'punch', L => { const [c, m] = counter(L); actuar(c, 0, [[0, { aLx: .7, aLz: -.2, aLe: 1.5, headX: .25 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); attach(CLIP, c.aL.hand, [0, -.4, .3], [-.4, 0, 0], .55);
  show(PARC[0], BX + .1, CTOP, .2, .3, .45 * (1 + Math.sin(clamp(L.lt / .2) * PI) * .2)); dust(V(BX + .3, CTOP, .2), L.t0, L.T, 6, .25); orbit(V(BX - .4, 3.6, -.8), lerp(10, 9, L.k), -.55, .14, 42); sh(V(BX, 0, 0), 14); }, [[0, 'pop', .6], [.2, 'paper', .5]]);
// 69 «Sein Klemmbrett auch.»: el portapapeles envuelto
shot(60.42, 'W', null, L => { const [c, m] = counter(L); actuar(c, 0, [[0, { aLx: .45, aLz: -.1, aLe: 1.6, headX: .2 }]], { T: L.T }); cara(c, L.T, { expr: 'confused' }); attach(CLIP, c.aL.hand, [0, -.4, .3], [-.4, 0, 0], .55); CLIP.userData.wrap.visible = true;
  show(PARC[0], BX + .1, CTOP, .2, .3, .45); const p = wpos(CLIP); cam([p.x - .6, p.y + 1.6, p.z + 6.4], [p.x + .3, p.y + .9, p.z], 40); sh(V(BX, 0, 0), 14); }, [[0, 'paper', .6], [.1, 'pop', .5]]);
// 70 «Und seine Krawatte.»: la corbata envuelta
shot(61.30, 'C', null, L => { const [c, m] = counter(L); actuar(c, 0, [[0, { aLx: .45, aLz: -.1, aLe: 1.6, headX: .45 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'down', mouth: 'o' }); attach(CLIP, c.aL.hand, [0, -.4, .3], [-.4, 0, 0], .55); CLIP.userData.wrap.visible = true; TIE.userData.wrap.visible = true;
  const h = hp(c); cm([h.x - 1.4, h.y + 1.0, h.z + 8.2, h.x, h.y - .7, h.z, 40], [h.x - 1.1, h.y + .9, h.z + 7.6, h.x, h.y - .8, h.z, 40], L.k); sh(V(BX, 0, 0), 14); }, [[0, 'paper', .6], [.1, 'pop', .5]]);
// 71 «Er war beeindruckt.»: el jefe aplaude, ojos brillantes
shot(62.48, 'F', null, L => { const [c, m] = counter(L); const cl = Math.abs(Math.sin(L.T * 12)); actuar(c, 0, [[0, { aLx: .9, aRx: .9, aLz: -.3 - cl * .3, aRz: -.3 - cl * .3, aLe: 1.3, aRe: 1.3 }]], { T: L.T }); cara(c, L.T, { expr: 'joy', eyes: 'happy', mouth: 'open_smile' }); TIE.userData.wrap.visible = true;
  show(PARC[0], BX + .1, CTOP, .2, .3, .45); onFace(c, 8, 0, -1.4, 40, L.k, 7); sparkleBadge(L); sh(V(BX, 0, 0), 14); }, [[0, 'hug', .3], [.1, 'clack', .5], [.3, 'clack', .5]]);
function sparkleBadge(L) { badge('gold', 'WOW', W / 2, H * .2, (L.lt - .2) * 4, 1, .7); }
// 72 «Das sah ich ihm an.»: yo, satisfecho, de espaldas al jefe hacia cámara (contraplano)
shot(63.50, 'S', null, L => { const [c, m] = counter(L); actuar(m, 0, [[0, GEST.cross]], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: 'smirk' }); TIE.userData.wrap.visible = true; cara(c, L.T, { expr: 'joy' });
  onFace(m, 6, 0, -.9, 40, L.k, 5.4); sh(V(BX, 0, 2), 14); }, [[0, 'sparkle', .4]]);
// 73 «Dann stellte er mir eine einzige Frage:» (zoom lento): el jefe se inclina sobre el mostrador
shot(64.38, null, 'slow', L => { const [c, m] = counter(L); actuar(c, 0, [[0, { lean: .35, aLx: .9, aRx: .9, aLz: -.4, aRz: -.4, aLe: .5, aRe: .5, headX: .1 }]], { T: L.T }); cara(c, L.T, { expr: 'sus', eyes: 'squint', mouth: 'flat' }); TIE.userData.wrap.visible = true;
  badge('q', '?', W / 2, H * .18, (L.lt - .9) * 3, 1, 1); onFace(c, 9, .2, -.8, 42, easeIn(L.k), 6); sh(V(BX, 0, 0), 14); }, [[0, 'heartbeat', .5]]);
// 74 «„Können Sie einen Burger braten?“»: primer plano del jefe; la plancha detrás, con llamas
shot(66.20, 'C', null, L => { const [c, m] = counter(L); actuar(c, 0, [[0, { aRx: 1.2, aRz: .5, aRe: .4, headX: .05 }]], { T: L.T }); talk(c, L.T, 66.2, 67.5, 'sus'); TIE.userData.wrap.visible = true; flames(V(BX, 2.7, -9), L.T, 8);
  const h = hp(c); cam([h.x - 1.6, h.y + .7, h.z + 6.6], [h.x - .1, h.y - .7, h.z - 2], 40); sh(V(BX, 0, 0), 14); }, [[0, 'pan_sizzle', .5], [.3, 'fire_crackle', .4]]);
// 75 «Ich habe noch nie einen Burger gebraten.»: yo sudando, ojos como platos
shot(67.50, 'W', 'punch', L => { const [c, m] = counter(L); actuar(m, 0, [[0, { ...GEST.shock, headX: -.05 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', eyes: 'wide', mouth: 'grimace' }); sweat(m, L.T, 3);
  onFace(m, 5.4, .1, -1, 40, L.k, 4.6); sh(V(BX, 0, 2), 14); }, [[0, 'gasp', .5], [.6, 'heartbeat', .4]]);
// 76 «Ich habe noch nie einen gegessen.»: miro la hamburguesa en mis manos como si fuera un objeto extraño
shot(69.30, 'F', null, L => { const [c, m] = counter(L); actuar(m, 0, [[0, { aLx: .25, aRx: .25, aLz: -.5, aRz: -.5, aLe: 1.75, aRe: 1.75, headX: .45, headZ: Math.sin(L.T * 3) * .25 }]], { T: L.T }); cara(m, L.T, { expr: 'confused', eyes: 'down' });
  const a = m.aL.hand.getWorldPosition(V()), b = m.aR.hand.getWorldPosition(V()); show(BUR[1], (a.x + b.x) / 2, (a.y + b.y) / 2 + .05, (a.z + b.z) / 2, L.T, .45); badge('q', '?', W / 2 + 160, H * .3, (L.lt - .3) * 4, 1, .6);
  onFace(m, 5.4, .8, -.9, 40, L.k, 4.8); sh(V(BX, 0, 2), 14); }, [[0, 'sniff', .5], [.5, 'pop', .3]]);
// 77 «Ich wickle nur.»: me encojo de hombros y ¡zas! la hamburguesa ya es un paquete
shot(70.75, 'C', null, L => { const [c, m] = counter(L); const w = L.lt > .25; actuar(m, 0, [[0, w ? GEST.shrug : { aLx: 1.2, aRx: 1.2, aLz: -.4, aRz: -.4, aLe: 1.0, aRe: 1.0 }]], { T: L.T }); cara(m, L.T, { expr: w ? 'smug' : 'neutral', mouth: w ? 'smirk' : 'flat' });
  show(w ? PARC[1] : BUR[1], BX + 1.4, CTOP, 1.0, 0, .45); onFace(m, 6, -.4, -1, 40, L.k, 5.4); sh(V(BX, 0, 2), 14); }, [[.25, 'paper', .6], [.3, 'pop', .5]]);
// 78 «Ich bekam den Job nicht.»: salgo por la puerta de la Brötchenburg cabizbajo; la puerta se cierra; atardecer
shot(71.55, 'Z', null, L => { use('BB'); day(); setSky([.22, .32, .78], [.85, .55, .7], [1, .72, .45]); sun.color.setRGB(1, .8, .6); const z = lerp(42, 45.5, L.k); const c = put(ich, BX, 0, z, 0); actuar(c, 0, [[0, { ...walkP(L.T * .5, 0), headX: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'sad', mouth: 'frown' });
  badge('red', 'ABGELEHNT', W / 2, H * .18, (L.lt - .3) * 4, 1, .8); cam([BX - 2.5, 3, 54], [BX, 3.4, 42], 46); sh(V(BX, 0, 44), 20); }, [[0, 'door_open', .5], [.5, 'slam', .5], [.6, 'sad_tone', .5]]);
// 79 «Im Brief stand:»: en mi cuarto con la carta en la mano
shot(72.80, 'W', null, L => { use('ST'); day(); inside(.8, 16); ST.LO.intensity = 0; setSky([.22, .32, .78], [.85, .55, .7], [1, .72, .45]); ST.TW.forEach((t, i) => t.userData.set([30, 30, 30][i])); const c = atDesk({ aLx: 1.3, aRx: 1.3, aLz: -.3, aRz: -.3, aLe: 1.1, aRe: 1.1, headX: .3 }, L.T); cara(c, L.T, { expr: 'sad', eyes: 'down' });
  const a = c.aL.hand.getWorldPosition(V()), b = c.aR.hand.getWorldPosition(V()); show(LET, (a.x + b.x) / 2, (a.y + b.y) / 2 + .7, (a.z + b.z) / 2 + .1, 0, .42); LET.rotation.x = -.5;
  onFace(c, 6.4, .4, .9, 42, L.k, 5.6); sh(V(SX, 0, -3), 14); }, [[0, 'pages', .6]]);
// 80 «„Danke, dass Sie meine Krawatte eingewickelt haben.“»: la carta en primer plano
shot(73.55, 'C', null, L => { use('ST'); day(); inside(.8, 16); ST.LO.intensity = 0; const c = atDesk({ aLx: 1.3, aRx: 1.3, aLz: -.3, aRz: -.3, aLe: 1.1, aRe: 1.1, headX: .3 }, L.T); cara(c, L.T, { expr: 'sad', eyes: 'down' });
  const a = c.aL.hand.getWorldPosition(V()), b = c.aR.hand.getWorldPosition(V()); const p = V((a.x + b.x) / 2, (a.y + b.y) / 2 + .7, (a.z + b.z) / 2 + .1); show(LET, p.x, p.y, p.z, 0, .42); LET.rotation.x = -.5; LET.updateMatrixWorld(true);
  const n = V(0, Math.sin(.5), Math.cos(.5)); cm([p.x + n.x * 2.6, p.y + n.y * 2.6 + .1, p.z + n.z * 2.6, p.x, p.y, p.z, 42], [p.x + n.x * 2.2, p.y + n.y * 2.2 + .05, p.z + n.z * 2.2, p.x, p.y - .1, p.z, 42], L.k); sh(V(SX, 0, -3), 14); }, [[0, 'paper', .5]]);
// 81 «Ach… fast.» (zoom lento): yo, triste, una lágrima
shot(75.33, null, 'slow', L => { use('ST'); day(); inside(.7, 14); ST.LO.intensity = 0; setSky([.22, .32, .78], [.85, .55, .7], [1, .72, .45]); const c = atDesk({ aLx: .5, aRx: .5, aLz: -.2, aRz: -.2, aLe: 1.2, aRe: 1.2, headX: .2, lean: .05 }, L.T); cara(c, L.T, { expr: 'sad', eyes: 'cry', mouth: 'wavy' }); tears(c, L.T);
  onFace(c, 6, .2, -.6, 40, easeIn(L.k), 4.4); sh(V(SX, 0, -3), 14); }, [[0, 'sad_tone', .5], [.3, 'sigh', .5]]);
// 82 «Fast.»: cabeza en la mesa
shot(76.75, 'C', null, L => { use('ST'); day(); inside(.7, 14); ST.LO.intensity = 0; const c = atDesk({ aLx: 1.2, aRx: 1.2, aLz: -.6, aRz: -.6, aLe: 1.6, aRe: 1.6, lean: .55, headX: .4 }, L.T); cara(c, L.T, { expr: 'sad', eyes: 'closed', mouth: 'frown' });
  orbit(V(SX, 3.2, -2.2), lerp(7.5, 6.8, L.k), -.5, .2, 40); sh(V(SX, 0, -3), 14); }, [[0, 'thud', .4]]);
// 83 «Also bin ich heute Nacht, während die anderen feiern,»: la plaza de noche, fuegos artificiales
shot(77.35, 'W', null, L => { townN(L, 24, -6, 20, 5, 22, 41); partyGuy(udo, -6, 22, 0, L.T, 0, 'laugh'); partyGuy(oma, -9, 20, .3, L.T, 1); partyGuy(kid, -3, 20, -.3, L.T, 2);
  cm([-6, 16, 46, -6, 4, 18, 50], [-6, 7, 33, -6, 4, 20, 48], L.k); sh(V(-6, 0, 20), 30); }, [[0, 'firework', .6], [.4, 'cheer', .5], [1.2, 'firework', .5]]);
// 84 «übrigens,»: yo en mi cuarto, serio, mirando a cámara
shot(79.45, 'C', 'punch', L => { stubeN(L, 12); const c = atDesk({ aLx: .3, aRx: .3, aLz: -.9, aRz: -.9, aLe: 1.9, aRe: 1.9 }, L.T); cara(c, L.T, { expr: 'sus', eyes: 'half', mouth: 'flat' }); onFace(c, 4.8, 0, .4, 38); sh(V(SX, 0, -3), 14); }, [[0, 'thud', .4]]);
// 85 «wieder hier drin und lerne braten.»: la plancha en mi mesa; espátula; llamas y vapor
shot(80.12, 'F', null, L => { stubeN(L, 12); const c = atDesk({ aRx: 1.3, aRz: -.1, aRe: .8 + Math.sin(L.T * 6) * .3, aLx: .8, aLz: -.3, aLe: .9, lean: .1 }, L.T); cara(c, L.T, { expr: 'determined' });
  show(MGR, DESK.x, DESK.y, DESK.z, 0, .5); PAT.forEach((p, i) => { show(p, DESK.x - 1.2 + (i % 3) * 1.2, DESK.y + .55, DESK.z - .3 + Math.floor(i / 3) * .7, 0, .5); p.userData.set(i === 1 ? clamp((L.lt - .5) / .4) : 0, DESK.y + .55); }); attach(SPAT, c.aR.hand, [0, -.5, .3], [-1.4, 0, 0], .55);
  steam(V(DESK.x, DESK.y + .8, DESK.z), L.T, 6); flames(V(DESK.x, DESK.y + .2, DESK.z), L.T, 3); orbit(V(SX, 3.6, -2.2), lerp(10, 9, L.k), .4, .14, 44); sh(V(SX, 0, -3), 14); }, [[0, 'pan_sizzle', .7], [.5, 'ignite', .4]]);
// 86 «Halb fünf Uhr morgens.»: el despertador otra vez (4:30), cuarto azul de madrugada
shot(81.78, 'C', 'punch', L => { use('ST'); inside(.5, 10); ST.LO.intensity = 0; ST.LI.intensity = 20; TINT = 'rgba(30,50,120,.18)'; show(MGR, DESK.x + .6, DESK.y, DESK.z, 0, .5);
  show(ALM, SX - 2.8, 2.3, .4, Math.sin(L.T * 60) * .06, .5); ALM.userData.draw('4:30'); const c = atDesk({ aRx: 1.3, aRe: .8, aLx: .8, aLe: .9 }, L.T); cara(c, L.T, { expr: 'determined', eyes: 'wide' });
  cam([SX - 2.2, 3.8, 6], [SX - 1.2, 3.2, -1], 44); sh(V(SX, 0, -2), 14); }, [[0, 'alarm', .7]]);
// 87 «Dreihundert Burger vor dem Frühstück.»: carne volando de vuelta en vuelta, torres de hamburguesas, 300
shot(82.90, 'W', null, L => { use('ST'); inside(.8, 18); ST.LO.intensity = 0; TINT = 'rgba(40,60,130,.06)'; const c = atDesk({ aRx: 1.3, aRz: -.1, aRe: .8 + Math.sin(L.T * 12) * .4, aLx: .8, aLz: -.3, aLe: .9, lean: .1 }, L.T); cara(c, L.T, { expr: 'determined', eyes: 'angry' }); sweat(c, L.T, 2);
  show(MGR, DESK.x, DESK.y, DESK.z, 0, .5); PAT.forEach((p, i) => { show(p, DESK.x - 1.2 + (i % 3) * 1.2, DESK.y + .55, DESK.z - .3 + Math.floor(i / 3) * .7, 0, .5); p.userData.set(((L.T * 2.5 + i * .33) % 1), DESK.y + .55); }); attach(SPAT, c.aR.hand, [0, -.5, .3], [-1.4, 0, 0], .55);
  show(TWR[2], SX + 3.4, 2.3, .6, 0, .5); TWR[2].userData.set(Math.min(40, 4 + Math.floor(L.k * 20))); steam(V(DESK.x, DESK.y + .8, DESK.z), L.T, 8); flames(V(DESK.x, DESK.y + .2, DESK.z), L.T, 3);
  badge('gold', String(Math.round(easeOut(L.k) * 300)), W / 2, H * .17, 1, 1, .9); orbit(V(SX + .6, 3.6, -2), lerp(12, 10, L.k), -.4, .16, 46); sh(V(SX, 0, -3), 16); }, [[0, 'pan_sizzle', .6], [.6, 'count', .4], [1.2, 'pan_sizzle', .5]]);
// 88–91 HUSS ×6 (ráfaga 5): dando la vuelta a la carne
shot(84.98, 'C', null, L => hussShot(L, 5, 'top', 'GR'), hussSfx(5, 84.98, 85.37, 'grill'));
shot(85.37, null, null, L => hussShot(L, 5, 'face', 'GR', { side: .3 }), hussSfx(5, 85.37, 85.95));
shot(85.95, 'C', null, L => hussShot(L, 5, 'side', 'GR'), hussSfx(5, 85.95, 86.35, 'grill'));
shot(86.35, null, null, L => hussShot(L, 5, 'low', 'GR'), hussSfx(5, 86.35, 86.74));
// ---------- d: contratado, la fiesta del año en la Brötchenburg, 500 en 50 s, final (86,74 – fin) ----------
const counter2 = (L, hatOn = false) => { burgIn(L); const c = put(chef, BX - 1.2, 0, -2.2, 0); const m = put(ich, BX + 1.4, 0, 2.6, PI); if (hatOn) PHAT.visible = true; return [c, m]; };
// el bar lleno: extras mirando al mostrador, con gorro de fiesta (z de 5 a 22)
function fullHouse(L, n = 38, mode = 'party') { BB.PARTY.visible = true; const r = RNG(61); EXTRA.slice(0, n).forEach((c, i) => { const row = Math.floor(i / 9), col = i % 9; const x = BX - 13 + col * 3.2 + (row % 2) * 1.5 + (r() - .5), z = 9 + row * 4 + (r() - .5);
  const ry = faceTo(V(x, 0, z), V(BX, 0, -1)) + (r() - .5) * .4; if (mode === 'hungry') { put(c, x, 0, z, ry); actuar(c, 0, [[0, { aLx: .6, aRx: .6, aLz: -.3, aRz: -.3, aLe: 1.6, aRe: 1.6, headX: -.15 + Math.sin(L.T * 6 + i) * .05 }]], { T: L.T }); cara(c, L.T + i, { expr: 'shock', mouth: Math.sin(L.T * 8 + i) > 0 ? 'o' : 'ah' }); }
  else partyGuy(c, x, z, ry, L.T, i * 1.3, i % 3 ? 'joy' : 'laugh'); hat(c); }); }
// 92 «„Sie sind eingestellt“, sagte er.»: el jefe me da la mano; confeti; EINGESTELLT
shot(86.74, 'F', null, L => { const [c, m] = counter2(L); actuar(c, 0, [[0, { aRx: 1.3, aRz: -.1, aRe: .3 + Math.sin(L.T * 10) * .1 }]], { T: L.T }); talk(c, L.T, 86.74, 88.3, 'joy'); actuar(m, 0, [[0, { aRx: 1.3, aRz: -.1, aRe: .3 + Math.sin(L.T * 10) * .1 }]], { T: L.T }); grin(m, L.T);
  confetti(V(BX, 2, 0), L.t0 + .2, L.T, 50, .8); badge('green', 'EINGESTELLT!', W / 2, H * .18, (L.lt - .25) * 4, 1, .8); orbit(V(BX + .1, 3.6, .2), lerp(16, 14.5, L.k), .45, .55, 44); sh(V(BX, 0, 0), 14); }, [[0, 'confetti', .5], [.2, 'cheer', .4], [.3, 'cash_reg', .5]]);
// 93 «„Wann können Sie anfangen?“»: el jefe pregunta, pulgar arriba
shot(88.40, 'W', null, L => { const [c, m] = counter2(L); actuar(c, 0, [[0, { aRx: 1.6, aRz: .3, aRe: 1.2 }]], { T: L.T }); talk(c, L.T, 88.4, 89.4, 'smile'); onFace(c, 7, .1, -1.1, 40, L.k, 6); sh(V(BX, 0, 0), 14); }, [[0, 'pop', .3]]);
// 94 «Ich hatte schon angefangen.»: yo ya detrás del mostrador, con el gorro de papel, envolviendo; torre al lado
shot(89.40, 'C', 'punch', L => { burgIn(L); PHAT.visible = true; const m = put(ich, BX, 0, -2.2, 0); actuar(m, 0, [[0, wrapIdle(L.T, 3)]], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: 'smirk' }); show(WR[0], BX, CTOP, .3, 0, .5); WR[0].userData.set(wrapLoop(L.T, 2.5));
  show(TWR[0], BX + 3.2, CTOP, .4, 0, .5); TWR[0].userData.set(9); const c = put(chef, BX - 4, 0, -2.6, .6); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); orbit(V(BX - .8, 3.8, -1.6), lerp(11, 10, L.k), -.25, .1, 44); sh(V(BX, 0, 0), 14); }, [[0, 'paper', .6], [.4, 'gasp', .4]]);
// 95 «Meine erste Schicht war Freitagnacht,»: la Brötchenburg de noche, guirnaldas, gente llegando
shot(90.53, 'Z', null, L => { use('BB'); night(45); BB.PARTY.visible = true; partyCrowd(L, BX, 50, 14, 4, 12, 71, { mode: 'walk', face: V(BX, 0, 40) }); badge('tag', 'FREITAG, 23 UHR', W / 2, H * .16, (L.lt - .2) * 4, 1, .9);
  orb(L.k, V(BX, 5.6, 42), null, [34, .2, .05, 48], [28, .1, .05, 48]); fireworks(V(BX, 14, 0), L.T, 3, 12); sh(V(BX, 0, 46), 30); }, [[0, 'city_amb', .4], [.4, 'cheer', .4], [1.0, 'firework', .4]]);
// 96 «die größte Party des Jahres.»: la plaza a reventar, fuegos artificiales enormes
shot(92.68, 'F', null, L => { townN(L, 24, -6, -10, 4, 20, 77); partyGuy(udo, -6, -8, 0, L.T, 0, 'laugh'); partyGuy(mayor, -9, -9, .3, L.T, 1); partyGuy(oma, -3, -9.5, -.3, L.T, 2); confRain(V(-6, 0, -8), L.T, 70, 18, 10, 14);
  badge('gold', 'PARTY DES JAHRES', W / 2, H * .16, (L.lt - .2) * 4, 1, .8); orb(L.k, V(-6, 5, -9), null, [20, -.2, .2, 50], [16, .1, .12, 48]); sh(V(-6, 0, -8), 30); }, [[0, 'firework', .7], [.3, 'cheer', .6], [.8, 'party_horn', .5]]);
// 97 «Um Mitternacht kam»: medianoche: el reloj marca 0:00 y la gente desfila hacia la Brötchenburg
shot(94.30, 'W', null, L => { use('BB'); night(45); BB.PARTY.visible = true; partyCrowd(L, BX, 46, 18, 2, 10, 79, { mode: 'walk', face: V(BX, 0, 40), gap: 1.2 }); show(ALM, BX - 4.5, 0, 50, .3, .9); ALM.userData.draw('0:00', '#d8323a');
  cam([BX - 8, 3.2, 60], [BX - 1, 3.6, 44], 48); sh(V(BX, 0, 48), 24); }, [[0, 'bells', .6], [.3, 'crowd_run', .5]]);
// 98 «die ganze Stadt rein.»: dentro: la multitud entra en tropel por la puerta
shot(95.30, 'C', null, L => { burgIn(L); BB.PARTY.visible = true; const r = RNG(83); EX.slice(0, 20).forEach((c, i) => { const row = Math.floor(i / 4); const z = 36 - row * 4 - L.k * 9 + (r() - .5), x = BX - 4 + (i % 4) * 2.6 + (r() - .5); put(c, x, 0, z, PI); actuar(c, 0, [[0, walkP(L.T * 1.4, i)]], { T: L.T }); hat(c); cara(c, L.T + i, { expr: 'joy', mouth: 'open_smile' }); });
  cam([BX + 2, 4.5, 4], [BX, 3.5, 24], 50); sh(V(BX, 0, 20), 24); }, [[0, 'crowd_run', .6], [.3, 'door_crash', .4]]);
// 99 «Hungrig.»: caras hambrientas en primera fila, manos en la tripa
shot(96.15, 'C', 'punch', L => { burgIn(L); BB.PARTY.visible = true; fullHouse(L, 27, 'hungry'); orbit(V(BX, 3.9, 6), lerp(8, 7, L.k), PI, .05, 44); sh(V(BX, 0, 8), 18); }, [[0, 'stomach', .7], [.2, 'growl', .3]]);
// 100 «Fünfhundert Leute.»: plano general desde detrás del mostrador: el local lleno; 500
shot(96.74, 'Z', null, L => { burgIn(L); fullHouse(L, 38); badge('gold', '500 LEUTE', W / 2, H * .15, (L.lt - .1) * 4, 1, .9); cm([BX + 1, 9.5, -6, BX, 3, 14, 52], [BX - 1, 8, -5, BX, 3.2, 14, 50], L.k); sh(V(BX, 0, 12), 30); }, [[0, 'cheer', .6], [.4, 'count', .4]]);
// 101 «Und nur ich.» (zoom lento): yo solo detrás del mostrador, con el gorro de papel
shot(98.18, null, 'slow', L => { burgIn(L); fullHouse(L, 20); PHAT.visible = true; const m = put(ich, BX, 0, -2.2, 0); actuar(m, 0, [[0, GEST.fists]], { T: L.T }); cara(m, L.T, { expr: 'determined', eyes: 'angry' }); show(WR[0], BX, CTOP, .3, 0, .5);
  onFace(m, 9, 2.4, .2, 42, easeIn(L.k), 6); sh(V(BX, 0, 0), 14); }, [[0, 'heartbeat', .5]]);
// 102–105 HUSS ×6 (ráfaga 6): en el mostrador, contador de hamburguesas
const cnt6 = n => String(Math.min(500, 20 + n * 80));
shot(99.30, 'C', null, L => { hussShot(L, 6, 'top', 'BB', { counter: cnt6 }); fullHouse(L, 12); }, hussSfx(6, 99.30, 99.70));
shot(99.70, null, null, L => { hussShot(L, 6, 'face', 'BB', { counter: cnt6, side: .3 }); fullHouse(L, 12); }, hussSfx(6, 99.70, 100.27));
shot(100.27, 'C', null, L => { hussShot(L, 6, 'side', 'BB', { counter: cnt6 }); fullHouse(L, 20); }, hussSfx(6, 100.27, 100.67));
shot(100.67, null, null, L => { hussShot(L, 6, 'wide', 'BB', { counter: cnt6, yaw: .5 }); fullHouse(L, 30); }, hussSfx(6, 100.67, 101.0));
// 106 «Fünfhundert Burger.»: torres de paquetes hasta el techo; 500
shot(101.0, 'C', 'punch', L => { burgIn(L); fullHouse(L, 30); PHAT.visible = true; const m = put(ich, BX, 0, -2.2, 0); actuar(m, 0, [[0, GEST.cross]], { T: L.T }); cara(m, L.T, { expr: 'smug', mouth: 'smirk' });
  TWR.forEach((t, i) => { show(t, BX + [-3.4, 3.4, 6.6][i], CTOP, [.2, .2, -.2][i], i * .3, .5); t.userData.set(40); }); badge('gold', '500', W / 2, H * .15, 1, 1, 1.1);
  orbit(V(BX, 5.4, -.6), lerp(16, 14, L.k), .25, .4, 50); sh(V(BX, 0, 0), 18); }, [[0, 'cash_reg', .6], [.2, 'cheer', .5]]);
// 107 «Fünfzig Sekunden.»: el cronómetro: 50 s (verde)
shot(101.96, 'F', null, L => { burgIn(L); fullHouse(L, 30); PHAT.visible = true; const m = put(ich, BX, 0, -2.2, 0); actuar(m, 0, [[0, GEST.cross]], { T: L.T }); cara(m, L.T, { expr: 'smug' });
  swAt(BX - 1.2, CTOP, .6, .2, .5, '50 s', '#1ab84a', 50 / 60); cam([BX - 1.2, CTOP + 2.6, 7.6], [BX - 1.1, CTOP + 1.0, -.4], 42); sh(V(BX, 0, 0), 14); }, [[0, 'watch_click', .6], [.3, 'ding_soft', .5]]);
// 108 «Der Bürgermeister starrte mich an:»: el alcalde en primera fila, boquiabierto
shot(103.45, 'W', null, L => { burgIn(L); fullHouse(L, 26); const c = put(mayor, BX + .4, 0, 3.2, PI); hat(mayor); actuar(c, 0, [[0, { aLx: .3, aRx: .3, headX: -.05 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  onFace(c, 6.2, .2, .9, 40, L.k, 5.6); sh(V(BX, 0, 3), 14); }, [[0, 'gasp_old', .5], [.6, 'silence_tick', .4]]);
// 109 «„Wie hast du das gemacht?“»: el alcalde pregunta, señalando las torres
shot(105.04, 'C', null, L => { burgIn(L); fullHouse(L, 26); const c = put(mayor, BX + .4, 0, 3.2, PI); hat(mayor); actuar(c, 0, [[0, { aRx: 1.5, aRz: .4, aRe: .2 }]], { T: L.T }); talk(mayor, L.T, 105.04, 106.37, 'shock');
  TWR.forEach((t, i) => { show(t, BX + [-3.4, 3.4, 6.6][i], CTOP, [.2, .2, -.2][i], i * .3, .5); t.userData.set(40); }); onFace(c, 6.6, .6, -.9, 40, L.k, 6); sh(V(BX, 0, 3), 14); }, [[0, 'pop', .3]]);
// 110 «„Während ihr gefeiert habt“,»: yo respondo, tranquilo
shot(106.37, 'S', null, L => { burgIn(L); fullHouse(L, 20); PHAT.visible = true; const m = put(ich, BX, 0, -2.2, 0); actuar(m, 0, [[0, { aRx: .9, aRz: .3, aRe: .8 }]], { T: L.T }); talk(ich, L.T, 106.37, 107.6, 'smug'); onFace(m, 6.4, 1.4, .6, 40, L.k, 5.8); sh(V(BX, 0, 0), 14); }, [[0, 'whoosh', .3]]);
// 111 «sagte ich, „übrigens.“» (zoom lento): primer plano, guiño
shot(107.60, null, 'slow', L => { burgIn(L); fullHouse(L, 20); PHAT.visible = true; const m = put(ich, BX, 0, -2.2, 0); actuar(m, 0, [[0, GEST.cross]], { T: L.T }); cara(m, L.T, L.lt > .7 ? { expr: 'smug', eyes: 'wink', mouth: 'smirk' } : { expr: 'smug', mouth: 'smirk' }); onFace(m, 6.4, 1.4, -.4, 40, easeIn(L.k), 5); sh(V(BX, 0, 0), 14); }, [[.75, 'sparkle', .5]]);
// 112–115 HUSS ×6 (ráfaga 7, final): de vuelta al trabajo, el último paquete aplasta la torre
shot(109.05, 'C', null, L => { hussShot(L, 7, 'face', 'BB', { side: -.3 }); fullHouse(L, 12); }, hussSfx(7, 109.05, 109.45));
shot(109.45, null, null, L => { hussShot(L, 7, 'top', 'BB'); fullHouse(L, 12); }, hussSfx(7, 109.45, 110.02));
shot(110.02, 'C', null, L => { hussShot(L, 7, 'side', 'BB'); fullHouse(L, 20); }, hussSfx(7, 110.02, 110.42));
shot(110.42, null, null, L => { hussShot(L, 7, 'wide', 'BB', { yaw: -.4 }); fullHouse(L, 30); }, hussSfx(7, 110.42, 111.6).concat([[.5, 'cheer', .5]]));


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
  let sh_ = SHAKE; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'zoom_fast', 'slam', 'boom', 'thud', 'huss_hit'].includes(c.s) && T - c.t < .14) sh_ = Math.max(sh_, 1 - (T - c.t) / .14); }
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
window.DBG = { hp, ich, chef, udo, renderer, composer, bloom, sun, grade, scene, camera };

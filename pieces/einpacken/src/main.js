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

// Tierwurf — «In dieser Stadt kauft man keine Tiere»: planos sincronizados con audio/words.json (1080×1920, 30 fps).
// Réplica de la estructura del vídeo de referencia (lanzar comida → llega un animal) con los Tiere como brainrots de bloques.
// Los planos están en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { makeOma, makeMayor, makeKumpel, makeLena, makeSie, makeEr, makeKassiererin, makeFahrer, makeLeo, makeBanane, makeNachbar, makeDieb, makeLehrer, makeVerk } from './gvolk.js';
import { ort, feld, DIST, garage, garten, bad, kueche, zimmer, laden, kueste, markt, wald, wueste, vulkan, jahrmarkt, wolken, schwarz, food, signBoard, bars } from './wsets.js';
import { noobini, tung, cappuccino, chimp, lirili, frigo, tralalero, erdbeerfant, coin, GOLD } from './brainrots.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 161.4, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xcfe6ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xdfeeff, 0x8aa070, 1.2); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2e0, 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 4; scene.add(sun, sun.target);
const rim = rimLight(scene);
const FILL = new THREE.PointLight(0xfff4e8, 0, 0, 1.3); scene.add(FILL);
const TORCH = new THREE.SpotLight(0xfff2c8, 0, 60, .35, .5, 1.2); scene.add(TORCH, TORCH.target);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 900 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-80, 150, 70)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
const FX = 600, GX = 800, TX = 900, BX = 1000, KX = 1100, ZX = 1200, LX = 1300, CX = 1500, MX = 1800, WAX = 2000, WUX = 2300, VUX = 2600, JMX = 2900, WOX = 3200, SWX = 3500;
const OR = ort(scene), FE = feld(scene, FX), GA = garage(scene, GX), GT = garten(scene, TX), BA = bad(scene, BX), KU = kueche(scene, KX), ZI = zimmer(scene, ZX), LA = laden(scene, LX), KS = kueste(scene, CX), MA = markt(scene, MX);
const WA = wald(scene, WAX), WU = wueste(scene, WUX), VU = vulkan(scene, VUX), JM = jahrmarkt(scene, JMX), WO = wolken(scene, WOX), SW = schwarz(scene, SWX);
const SETS = { OR: OR.G, FE: FE.g, GA: GA.g, GT: GT.g, BA: BA.g, KU: KU.g, ZI: ZI.g, LA: LA.g, KS: KS.g, MA: MA.g, WA: WA.g, WU: WU.g, VU: VU.g, JM: JM.g, WO: WO.g, SW: SW.g };
for (const k in SETS) if (k !== 'WO') outline(SETS[k], 1.4);
// ---------- reparto ----------
const ich = makeLeo(scene), ban = makeBanane(scene), nb = makeNachbar(scene), oma = makeOma(scene), mayor = makeMayor(scene), dieb = makeDieb(scene), lehrer = makeLehrer(scene), verk = makeVerk(scene);
const K = Array.from({ length: 8 }, (_, i) => makeKumpel(scene, i)); const XT = [makeLena(scene), makeSie(scene), makeEr(scene), makeKassiererin(scene), makeFahrer(scene)];
kitFace(ich, 'kid'); kitFace(ban, 'hero'); kitFace(nb, 'mustache'); kitFace(oma, 'girl'); kitFace(mayor, 'mustache'); kitFace(dieb, 'villain'); kitFace(lehrer, 'plain'); kitFace(verk, 'girl');
K.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'plain', 'girl', 'girl', 'kid', 'hero'][i])); XT.forEach((c, i) => kitFace(c, ['girl', 'girl', 'kid', 'girl', 'plain'][i]));
const POOL = [ich, ban, nb, oma, mayor, dieb, lehrer, verk, ...K, ...XT]; POOL.forEach(c => outline(c.root, 2));
const CROWD = [...K, ...XT, lehrer, verk];
// brazos de Leo: finos (0) → normales (.5) → fuertes (1)
const armsK = (ch, k) => { const s = lerp(.62, 1.45, k); for (const a of [ch.aL, ch.aR]) { a.sh.scale.set(s, 1, s); a.el.scale.set(lerp(.65, 1.3, k), 1, lerp(.65, 1.3, k)); } };
// ---------- Tiere ----------
const NB = [noobini(scene), noobini(scene)], TG = [tung(scene), tung(scene)], CA = cappuccino(scene), CH = chimp(scene), LI = [lirili(scene), lirili(scene), lirili(scene)], FR = frigo(scene), TR = tralalero(scene), EF = erdbeerfant(scene), EG = erdbeerfant(scene, true);
const BEASTS = [...NB, ...TG, CA, CH, ...LI, FR, TR, EF, EG]; BEASTS.forEach(b => outline(b.root, 2));
const KALLE = NB[0];
// manadas instanciadas (40 Lirilì, lluvia de Tiere): una InstancedMesh por pieza de la plantilla
const OUTM = new THREE.MeshBasicMaterial({ color: 0x14101a, side: THREE.BackSide, fog: false }); OUTM.onBeforeCompile = s => { s.vertexShader = s.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>\n vec3 nV_ = normalize(normalMatrix * normal); gl_Position.xy += nV_.xy * 2.0 * gl_Position.w * vec2(2.0 / 1080.0, 2.0 / 1920.0);`); };
function herd(make, n) { const t = make(scene); t.pose(0, {}); t.root.position.set(0, 0, 0); t.root.updateMatrixWorld(true); const inv = new THREE.Matrix4().copy(t.root.matrixWorld).invert(); const parts = [], g = new THREE.Group(); scene.add(g);
  t.root.traverse(o => { if (!o.isMesh || o.userData.isOutline) return; const loc = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld); const im = new THREE.InstancedMesh(o.geometry, o.material, n); im.castShadow = !o.material.transparent; im.receiveShadow = true; im.frustumCulled = false; g.add(im); parts.push([im, loc]);
    if (!o.material.transparent && o.geometry.type !== 'PlaneGeometry' && o.geometry.type !== 'CircleGeometry') { const io = new THREE.InstancedMesh(o.geometry, OUTM, n); io.frustumCulled = false; g.add(io); parts.push([io, loc]); } });
  scene.remove(t.root); const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S3 = new THREE.Vector3(), P3 = new THREE.Vector3(), E = new THREE.Euler();
  const H_ = { g, n, count: n, set(i, x, y, z, ry = 0, s = 1, rx = 0, rz = 0) { Q.setFromEuler(E.set(rx, ry, rz)); M.compose(P3.set(x, y, z), Q, S3.set(s, s, s)); for (const [im, loc] of parts) im.setMatrixAt(i, new THREE.Matrix4().multiplyMatrices(M, loc)); },
    show(k) { H_.count = k; for (const [im] of parts) { im.count = k; im.instanceMatrix.needsUpdate = true; } g.visible = k > 0; } }; H_.show(0); return H_; }
const LIH = herd(lirili, 44), RAIN = [herd(tung, 8), herd(noobini, 10), herd(lirili, 8), herd(cappuccino, 6)];
const HERDS = [LIH, ...RAIN];
// ---------- atrezo ----------
const FOODS = {}; for (const k of ['karotte', 'apfel', 'steak', 'banane', 'burger', 'pizza', 'kaese']) { FOODS[k] = food(k, 1); scene.add(FOODS[k]); outline(FOODS[k], 1.6); }
const GIANT = { karotte: food('karotte', 1), apfel: food('apfel', 1), steak: food('steak', 1) }; for (const k in GIANT) { scene.add(GIANT[k]); outline(GIANT[k], 2.4); }
const COINS = Array.from({ length: 40 }, () => coin(scene)); COINS.forEach(c => outline(c, 1.4));
const CONF = Array.from({ length: 60 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const DUST = Array.from({ length: 22 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const ZZZ = Array.from({ length: 3 }, (_, i) => { const p = textPlane(1.2, 1.2, 64, 64, (c, w, h) => { c.font = `700 56px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 8; c.strokeStyle = '#1a1a2a'; c.strokeText('Z', w / 2, h / 2); c.fillStyle = '#ffffff'; c.fillText('Z', w / 2, h / 2); }); p.material.depthWrite = false; scene.add(p); return p; });
const TRAIL = Array.from({ length: 16 }, () => sphere(.4, new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 2.4, .8), toneMapped: false, transparent: true, opacity: .8, depthWrite: false }), scene, 0, 0, 0, 8, 6));
const FLASHL = (() => { const g = new THREE.Group(); scene.add(g); cyl(.22, .26, 1.4, mat(0x2a2a34, { metalness: .5 }), 10, g, 0, 0, 0).rotation.x = Math.PI / 2; const l = cyl(.3, .22, .1, new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 3, 2.4), toneMapped: false }), 10, g, 0, 0, .72); l.rotation.x = Math.PI / 2;
  const beam = new THREE.Mesh(new THREE.ConeGeometry(3.6, 22, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff6c8, transparent: true, opacity: .16, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })); beam.rotation.x = -Math.PI / 2; beam.position.z = 11.6; g.add(beam); return g; })();
const CHAIR = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0x3a8ad8, { roughness: .6 }); box(2.4, .3, 2.4, m, .05, g, 0, 1.8, 0); box(2.4, 2.6, .3, m, .05, g, 0, 3.1, -1.1); for (const s of [-1, 1]) for (const z of [-1, 1]) cyl(.08, .08, 1.8, mat(0xd8dce4), 4, g, s * 1.1, .9, z * 1.1); return g; })();
const TABLE = (() => { const g = new THREE.Group(); scene.add(g); box(5, .3, 3.4, mat(0xffffff, { roughness: .9 }), .05, g, 0, 3.3, 0); for (const s of [-1, 1]) for (const z of [-1, 1]) cyl(.12, .12, 3.3, mat(0xc8946a), 6, g, s * 2.2, 1.65, z * 1.4); const cup = cyl(.35, .3, .6, mat(0xff8a3a), 10, g, 1.4, 3.75, 0); const pl = cyl(.9, .8, .12, mat(0xffffff), 16, g, -.6, 3.5, 0); for (let k = 0; k < 2; k++) box(1, .2, .7, mat(0xe8b05a), .1, g, -.6, 3.7 + k * .22, 0); return g; })();
const CAL = (() => { const g = new THREE.Group(); scene.add(g); box(3.2, 3.8, .2, mat(0xffffff), .1, g, 0, 0, 0); box(3.2, .9, .25, mat(0xd8323a), .05, g, 0, 1.45, .02); const pg = textPlane(3, 2.6, 192, 166, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#1a1a2a'; c.font = `700 110px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('+7', w / 2, h / 2 + 6); }); pg.position.set(0, -.4, .13); g.add(pg); return g; })();
const PROPS = [...Object.values(FOODS), ...Object.values(GIANT), ...COINS, ...CONF, ...DUST, ...SWEAT, ...ZZZ, ...TRAIL, FLASHL, CHAIR, TABLE, CAL];
// ---------- ambiente ----------
const AIR = aire(scene, 300); const BIRDS = bandada(scene, 9);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day', BIRDSON = 1;
function day() { MODE = 'day'; renderer.toneMappingExposure = .98; setSky([.18, .48, .98], [.45, .72, 1], [.82, .93, 1]); sky.moon.visible = false; hemi.intensity = 1.25; hemi.color.setRGB(.88, .94, 1); hemi.groundColor.setRGB(.55, .62, .42); sun.intensity = 2.5; sun.color.setRGB(1, .95, .86); rim.intensity = 1.0;
  scene.fog.color.setRGB(.8, .9, 1); scene.fog.density = .0009; bloom.strength = .16; bloom.threshold = .9; FILL.intensity = 0; }
function night() { MODE = 'night'; renderer.toneMappingExposure = .95; setSky([.02, .04, .14], [.06, .1, .3], [.16, .2, .42]); sky.moon.visible = true; sky.moon.position.set(-500, 700, -1200); hemi.intensity = .85; hemi.color.setRGB(.55, .66, 1); hemi.groundColor.setRGB(.2, .2, .32); sun.intensity = 1.0; sun.color.setRGB(.72, .78, 1); rim.intensity = 1.6;
  scene.fog.color.setRGB(.1, .14, .28); scene.fog.density = .0012; bloom.strength = .24; bloom.threshold = .88; FILL.intensity = 40; BIRDSON = 0; }
function inside(h = .9, fill = 50) { MODE = 'in'; renderer.toneMappingExposure = .95; hemi.intensity = h; hemi.color.setRGB(1, .97, .92); hemi.groundColor.setRGB(.55, .48, .42); sun.intensity = 0; rim.intensity = .6; bloom.strength = .16; bloom.threshold = .9; scene.fog.density = .0002; FILL.intensity = fill; BIRDSON = 0; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } }
  armsK(ich, .25);
  for (const b of BEASTS) { b.root.visible = false; b.root.rotation.set(0, 0, 0); b.root.scale.setScalar(1); b.pose(0, {}); if (b.root.parent !== scene) { b.root.parent.remove(b.root); scene.add(b.root); } }
  for (const h of HERDS) h.show(0);
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const k in SETS) SETS[k].visible = false; FE.arch.visible = true; OR.FEST.visible = false; GT.MONEY.visible = false; ZI.JAR.userData.set(0); KU.DOOR.visible = true; KU.DOOR.rotation.set(0, 0, 0); KU.DOOR.position.set(-2.8, 0, 2.15); if (KU.DOOR.parent !== KU.fr) { KU.DOOR.parent.remove(KU.DOOR); KU.fr.add(KU.DOOR); } KU.FL.intensity = 0; KS.DOOR.rotation.y = 0;
  TORCH.intensity = 0; FILL.color.setRGB(1, .96, .91); BA.foam.position.y = 0; sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = 1.08; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const beast = (b, x, y, z, ry = 0, s = 1) => { b.root.visible = true; b.root.position.set(x, y, z); b.root.rotation.set(0, ry, 0); b.root.scale.setScalar(s); return b; };
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
const inHand = (ch, k, r = 1, s = .5) => attach(FOODS[k], (r ? ch.aR : ch.aL).hand, [0, -.55, .1], [0, 0, 0], s);
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
// órbita: cámara a distancia d del centro c, ángulo yaw (0 = desde +z), pitch (arriba +); el centro queda al ~42 % de la altura
function orbit(c, d, yaw = 0, pitch = .15, fov = 44) { const t = Math.tan(fov * Math.PI / 360) * d * .16; cam([c.x + Math.sin(yaw) * Math.cos(pitch) * d, c.y + Math.sin(pitch) * d, c.z + Math.cos(yaw) * Math.cos(pitch) * d], [c.x, c.y - t, c.z], fov); }
const orb = (k, c0, c1, a, b) => { const q = easeInOut(clamp(k)); orbit(c0.clone().lerp(c1 ?? c0, q), lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q), lerp(a[3] ?? 44, b[3] ?? 44, q)); };
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
const wpos = o => { o.updateMatrixWorld(true); return o.getWorldPosition(V(0, 0, 0)); };
// encuadre frontal: cámara a 'dist' delante del personaje (según su ry), un poco a un lado, mirando a la cabeza
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + .3 + dy, h.z + fz * d - fx * side], [h.x, h.y - .5, h.z], fov); }
// lo mismo para un Tier (centro a la altura hy relativa)
function onBeast(b, dist, hy, dy = 0, side = 0, fov = 40) { const p = b.root.position, a = b.root.rotation.y, s = b.root.scale.x, fx = Math.sin(a), fz = Math.cos(a), y = p.y + hy * s;
  cam([p.x + fx * dist + fz * side, y + dy, p.z + fz * dist - fx * side], [p.x, y, p.z], fov); }
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function ojos(expr, T, sd) { const n = Math.sin(T * .9 + sd) * .55 + Math.sin(T * 2.3 + sd * 2.1) * .45;
  switch (expr) {
    case 'neutral': case 'talk': case undefined: return n > .25 ? 'half' : n < -.55 ? (sd % 2 ? 'side_l' : 'side_r') : 'normal';
    case 'sad': return n > -.1 ? 'half' : 'down';
    case 'happy': case 'smile': case 'relief': case 'joy': return n > -.3 ? 'happy' : 'half';
    case 'worried': return n > .45 ? 'side_l' : n < -.45 ? 'down' : 'worried';
    case 'scared': return n > .3 ? 'worried' : 'scared';
    case 'shock': case 'gasp': return n > -.2 ? 'wide' : 'scared';
    case 'determined': return n > .5 ? 'squint' : 'angry';
    case 'angry': case 'shout': return n > .55 ? 'squint' : 'angry';
    case 'confused': return n > 0 ? 'squint' : 'side_r';
    case 'sus': case 'smug': return n > .2 ? 'squint' : 'half';
    case 'bored': case 'tired': return 'half';
    case 'down': return 'down';
    default: return null; } }
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const b = eyesAlive(T, ch.seed, 'normal'); const o = ojos(s.expr, T, ch.seed); if (b === 'closed') s.eyes = 'closed'; else if (o) s.eyes = o; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk', extra = {}) => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat', ...extra });
const grin = (ch, T, ex = {}) => cara(ch, T, { expr: 'grin', eyes: 'happy', mouth: 'grin', ...ex });
const faceTo = (from, to) => Math.atan2(to.x - from.x, to.z - from.z);
const sweat = (ch, T, n = 2) => { const h = hp(ch), s = ch.spec.scale || 1; for (let i = 0; i < n; i++) { const k = (T * .8 + i * .5) % 1; SWEAT[i].visible = true; SWEAT[i].position.copy(h).add(V((i ? -.55 : .55) * s, (1.3 - k * .9) * s, .5 * s)); SWEAT[i].scale.set(s, 1.4 * s, s); } };
function confetti(c, T0, T, n = 60) { CONF.forEach((f, i) => { if (i >= n) return; const r = RNG(i * 3 + 9), t = T - T0; if (t < 0) return; f.visible = true; const a = r() * 6.283, v = 3 + r() * 6; f.position.set(c.x + Math.cos(a) * v * Math.min(t, .4) * 2.4, c.y + 6 + v * Math.min(t, .3) * 2.4 - t * t * 2.5, c.z + Math.sin(a) * v * Math.min(t, .4) * 2.4); f.rotation.set(T * 6 + i, T * 4 + i, 0); }); }
// monedas que saltan de un punto: pop(c, t0, T, n, i0)
function coinPop(c, T0, T, n = 6, i0 = 0, sp = 1) { for (let i = 0; i < n; i++) { const r = RNG(i * 11 + i0 * 5 + 1), t = T - T0 - r() * .5; const cn = COINS[(i0 + i) % COINS.length]; if (t < 0 || t > 1.6) continue; cn.visible = true; const a = r() * 6.283, v = (1.5 + r() * 2) * sp;
  cn.position.set(c.x + Math.cos(a) * v * t, c.y + (7 * t - 9 * t * t) * sp, c.z + Math.sin(a) * v * t); if (cn.position.y < c.y - 2 * sp) cn.position.y = c.y - 2 * sp; cn.rotation.set(0, T * 8 + i, 0); cn.scale.setScalar(sp); } }
// lluvia de monedas en una caja alrededor del centro
function coinRain(c, T, n = 40, sx = 20, sz = 20, h = 30, sp = 1) { for (let i = 0; i < n; i++) { const r = RNG(i * 13 + 7), cn = COINS[i % COINS.length]; cn.visible = true; const y = h - ((T * (10 + r() * 6) + r() * h) % h); cn.position.set(c.x + (r() - .5) * sx, c.y + y, c.z + (r() - .5) * sz); cn.rotation.set(T * 3 + i, T * 5 + i, 0); cn.scale.setScalar(sp); } }
function dust(c, T0, T, n = 14, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.4) return; d.visible = true; const a = r() * 6.283, v = (4 + r() * 4) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + 1 + t * 2 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((1 + t * 2.4) * s * (.8 + r() * .5)); d.material.opacity = .6 * (1 - t / 1.4); }); }
function zzz(p, T) { ZZZ.forEach((z, i) => { const k = (T * .5 + i / 3) % 1; z.visible = true; z.position.set(p.x + k * 1.6, p.y + k * 3, p.z + k * .4); z.scale.setScalar(.6 + k); z.material.opacity = 1 - k; z.lookAt(camera.position); }); }
function trail(pos, vel, T, n = 16, sp = .5) { TRAIL.forEach((t, i) => { if (i >= n) return; t.visible = true; t.position.copy(pos).addScaledVector(vel, -(i + 1) * sp); t.scale.setScalar(1 - i / n); t.material.opacity = .8 * (1 - i / n); }); }
// vuelo parabólico: de a a b con altura h, k ∈ [0, 1] -> posición
const arc = (a, b, h, k) => V(lerp(a[0], b[0], k), lerp(a[1], b[1], k) + 4 * h * k * (1 - k), lerp(a[2], b[2], k));
// lanzamiento: anticipación (brazo atrás) y lanzamiento (brazo delante). k: 0..1 del gesto
const throwPose = k => k < .55 ? { aRx: lerp(0, -1.2, easeOut(k / .55)), aRz: .5, aRe: lerp(.2, 1.4, k / .55), twist: lerp(0, .5, k / .55), lean: -.12, aLx: lerp(0, 1.3, k / .55), lLx: -.3, lRx: .3, headY: -.1 }
  : { aRx: lerp(-1.2, 2.2, easeOut((k - .55) / .45)), aRz: .1, aRe: lerp(1.4, .1, (k - .55) / .45), twist: lerp(.5, -.5, easeOut((k - .55) / .45)), lean: lerp(-.12, .32, (k - .55) / .45), aLx: lerp(1.3, -.4, (k - .55) / .45), lLx: .45, lRx: -.4, lRk: .3 };
// colgado de una barra (y del cuerpo para que las manos estén en la barra a altura hb). k: 0 abajo -> 1 arriba (dominada)
function pullup(ch, x, z, ry, hb, k, extra = {}) { const s = ch.root.scale.x; const up = easeInOut(clamp(k)); const p = { aLx: lerp(3.05, 2.6, up), aRx: lerp(3.05, 2.6, up), aLz: lerp(.18, .7, up), aRz: lerp(.18, .7, up), aLe: lerp(.05, 2.0, up), aRe: lerp(.05, 2.0, up), lLx: .25, lRx: .1, lLk: .9, lRk: .6, headX: -.15 * up, ...extra };
  applyPose(ch, p); const reach = lerp(6.25, 4.6, up) * s; put(ch, x, hb - reach, z, ry); return ch; }

// ---------- capa 2D ----------
const BAD_ = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD_.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const badge3 = (kind, text, w3, k, sc = 1) => BAD_.push({ kind, text, w3, s: spring(clamp(k) * 1.6) * sc, a: 1, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD_.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
// +N con moneda que sube y se desvanece (sobre un punto del mundo)
const plus = (w3, text, t, sc = 1) => { if (t < 0 || t > 1.1) return; BAD_.push({ kind: 'plus', text, w3: w3.clone().add(V(0, t * 2.2, 0)), s: spring(clamp(t * 4) * 1.6) * sc, a: 1 - clamp((t - .7) / .4), on: true }); };
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; if (x < -60 || x > W + 60) return; b.x = clamp(x, 200, W - 200); b.y = clamp(y, 150, H * .64); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num' || b.kind === 'green' || b.kind === 'gold') { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : b.kind === 'green' ? '#04300e' : b.kind === 'gold' ? '#3a2400' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#8aff9a'); g.addColorStop(1, '#1ab84a'); } else if (b.kind === 'gold') { g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a820'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'plus') { c.font = `700 70px ${FONT}`; const tw = c.measureText(b.text).width; c.lineWidth = 16; c.strokeStyle = '#3a2400'; c.strokeText(b.text, 30, 0); const g = c.createLinearGradient(0, -36, 0, 36); g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a820'); c.fillStyle = g; c.fillText(b.text, 30, 0);
    const cx = -tw / 2 - 12; c.fillStyle = '#3a2400'; c.beginPath(); c.arc(cx, 0, 32, 0, 7); c.fill(); const gc = c.createRadialGradient(cx - 8, -8, 4, cx, 0, 28); gc.addColorStop(0, '#fff6c0'); gc.addColorStop(1, '#f0b020'); c.fillStyle = gc; c.beginPath(); c.arc(cx, 0, 26, 0, 7); c.fill(); c.strokeStyle = '#c88a10'; c.lineWidth = 4; c.beginPath(); c.arc(cx, 0, 17, 0, 7); c.stroke(); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'rare') { const cols = { COMMON: '#9aa0aa', RARE: '#3ab8ff', EPIC: '#b86aff', LEGENDÄR: '#ffb21a', MYTHISCH: '#ff3a5a', GOTT: '#3af0c8', OG: '#ffd23f' }; const col = cols[b.text] || '#fff'; c.font = `700 44px ${FONT}`; const w = c.measureText(b.text).width + 50; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -32, w, 64, 32); c.fill(); c.lineWidth = 6; c.strokeStyle = col; c.stroke(); c.fillStyle = col; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  c.restore(); }
const KEY = /^(Stadt|Tiere|Essen|dir|Banane|Hügel|Chimpanzini|Bananini|Garage|Leo|Wurf|krasser|Tier|Karotte|zehn|Noobini|Pizzanini|Apfel|Fluss|Tung|Sahur|Steak|Berg|Cappuccino|Assassino|Haustür|Beste|Geld|Goldmünzen|40|Lirilì|Larilà|sechs|Fest|gratis|Himmel|Nacht|klauen|Taschenlampe|Zaun|Klimmzugstangen|Kinder|Lehrer|Oma|500|Frühstück|Cheeseburger|drei|Tage|Frigo|Camelo|Badewanne|Bürgermeister|Pizza|Meer|Woche|Tralalero|Tralala|Tür|schwächsten|Arme|Meter|Kalle|Münze|gelacht|trainiert|Klimmzug|tausend|stark|Kühlschranktür|gespart|teuerste|goldenen|Käse|geworfen|Wald|Wüste|Vulkan|Geister-Jahrmarkt|Wolken|schwarz|Stille|Stunde|Zwei|Stunden|Nichts|Plötzlich|beben|Bumm|Berge|Strawberry|Elephant|Gold|Schule|verbeugte|Münzen|reichste|Teich|Pfeifen|riesige|Marktplatz|Wolkenkratzer|Fußballfeld|Lächelnd|kapiert|Einzigen|werfen|Großes|angerannt)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0; const COVERS = [];
// la calle (ORT, x = 0): calzada x ∈ [-8, 8], aceras hasta ±12,6, barras en x = ±10,6 cada 22 (z = 25, 3, -19…; las de la derecha +6),
// casas en x = ±24,5 (fachada en ±18, valla en ±11,5), colegio al fondo (z = -236), zoohandlung a la izquierda en z = 62.
const street = () => { use('OR'); day(); };
// campo (FELD, x = FX): círculo en z = 0, carteles de distancia a la derecha (x = FX + 15,6)
const field = () => { use('FE'); day(); };
// ---------- a: gancho, la regla, los Tiere y el dinero (0 – 33,9 s) ----------
const walkB = (b, lt, x, z, ry, sp, T) => { const d = sp * lt; b.root.visible = true; b.root.position.set(x + Math.sin(ry) * d, 0, z + Math.cos(ry) * d); b.root.rotation.set(0, ry, 0); b.pose(T, { walk: 1 }); return b.root.position; };
const walkC = (ch, lt, x, z, ry, sp = 3.4, T, extra) => caminar(ch, lt, { x, z, ry, speed: sp, accel: .01, T, extra });
const rareTag = (b, txt, k, hy) => badge3('rare', txt, b.root.position.clone().add(V(0, (hy ?? b.H) * b.root.scale.x + .8, 0)), k, .9);
const thrower = (ch, x, z, ry, k, food, ksz = .5) => { put(ch, x, 0, z, ry); applyPose(ch, throwPose(clamp(k))); if (k < .62) inHand(ch, food, 1, ksz); return ch; };
const handPos = ch => { ch.root.updateMatrixWorld(true); return ch.aR.hand.getWorldPosition(V(0, 0, 0)); };
// 1 «In dieser Stadt»: la calle; yo en el centro y los Tiere paseando por la acera
shot(0, 'Z', null, L => { street(); const z0 = -4;
  const me = put(ich, .4, 0, z0, -.1); actuar(me, L.lt, [[0, 'idle'], [.1, 'wave', { dur: .25 }]], { T: L.T }); talk(me, L.T, 0, .84, 'happy');
  beast(NB[1], -1.9, 0, z0 + 2, .25).pose(L.T, { wave: 1, face: { eyes: 'happy', mouth: 'grin' } });
  walkB(TG[0], L.lt, 3.2, z0 - 15, -.15, 2.4, L.T); walkB(LI[0], L.lt, -3.6, z0 - 12, .1, 2.2, L.T);
  put(XT[1], 6.2, 0, z0 - 16, -.4); actuar(XT[1], L.lt, [[0, 'wave']], { T: L.T }); grin(XT[1], L.T);
  orb(L.k, V(0, 3.6, z0 - 3), null, [19, .02, .1, 48], [16.5, 0, .08, 46]); sh(V(0, 0, z0 - 4), 30); }, [[.02, 'whoosh', .6], [.25, 'pop', .5], [.5, 'steps', .4]]);
// 2 «kauft man keine Tiere»: la tienda de animales cerrada, alguien niega con la cabeza
shot(.84, 'W', null, L => { street(); const zz = 62;
  const g = put(K[3], -13.4, 0, zz + 2.6, PI / 2 + .45); actuar(g, L.lt, [[0, 'idle'], [.15, { aRx: 1.5, aRz: -.1, aRe: .1, headY: Math.sin(L.T * 9) * .5 }]], { T: L.T }); cara(g, L.T, { expr: 'sad', mouth: 'frown' });
  orb(L.k, V(-17, 5.2, zz - .6), null, [36, 1.18, .08, 46], [33, 1.22, .06, 46]); sh(V(-16, 0, zz), 30); }, [[.05, 'swipe', .5], [.3, 'buzzer', .35], [.6, 'door_creak', .3]]);
// 3 «Man wirft Essen»: alguien lanza una manzana desde el círculo
shot(2.26, 'F', null, L => { field(); const k = clamp(L.lt / .62); const t = thrower(K[1], FX, 0, PI, k, 'apfel'); cara(t, L.T, { expr: 'determined', mouth: 'teeth' });
  if (k >= .62) { const f = clamp((L.lt - .38) / 1.2), p = arc([FX + .8, 6, -.6], [FX - 2, 3, -60], 26, f); show(FOODS.apfel, p.x, p.y, p.z, L.T * 6, .7); }
  put(K[5], FX - 6.5, 0, 4, PI - .6); actuar(K[5], L.lt, [[0, 'cheer']], { T: L.T }); grin(K[5], L.T);
  orb(L.k, V(FX - .4, 3.8, 0), null, [17, PI + .45, .12, 44], [15.5, PI + .38, .1, 44]); sh(V(FX, 0, -2), 30); }, [[.3, 'throw', .6], [.4, 'whoosh_up', .5], [.5, 'cheer', .3]]);
// 4 «und was angerannt kommt»: un Tung Tung corre hacia la cámara con el campo detrás
shot(3.02, 'Z', null, L => { field(); const z = -34 + L.lt * 17; const b = beast(TG[0], FX - .5, 0, z, 0); b.pose(L.T, { walk: 1, speed: 1.7, face: { eyes: 'wide', mouth: 'open' } }); dust(V(FX - .5, 0, z - 1), Math.floor(L.T * 4) / 4, L.T, 6, .5);
  cm([FX + 1.5, 3.6, z + 13, FX - .5, 4, z, 46], [FX + 1.2, 3.4, z + 11, FX - .5, 4, z, 44], L.k); sh(V(FX, 0, z), 30); }, [[0, 'steps_run', .6], [.5, 'run_grass', .5], [1.0, 'whistle_inno', .3]]);
// 5 «gehört dir»: el lanzador abraza a su Tung Tung nuevo
shot(4.47, 'C', 'punch', L => { field(); const me = put(K[1], FX + 1.5, 0, -6, -.25); actuar(me, L.lt, [[0, 'cheer'], [.25, { aLx: 1.4, aLz: -.9, aLe: 1.2, aRx: 2.8, aRz: .4, aRe: .3 }, { dur: .3 }]], { T: L.T }); grin(me, L.T);
  const b = beast(TG[0], FX - 1.7, 0, -6.4, .3); b.pose(L.T, { face: { eyes: 'happy', mouth: 'grin' } });
  orb(L.k, V(FX, 3.6, -6.2), null, [15, .05, .12, 44], [13.5, .02, .1, 44]); sh(V(FX, 0, -6), 30); badge('green', 'DEINS!', W / 2, H * .2, (L.lt - .05) * 3, 1, .9); }, [[0, 'pling', .6], [.1, 'hug', .5], [.3, 'sparkle', .4]]);
// 6 «Siehst du den Typen da?»: el del plátano en el círculo; yo le señalo
shot(5.07, 'W', 'punch', L => { field(); const b = put(ban, FX + 1.2, 0, -2, PI - .25); actuar(b, L.lt, [[0, { aLx: 1.0, aLz: .8, aLe: 2.2, aRx: 1.0, aRz: .8, aRe: 2.2, lean: -.05 }]], { T: L.T }); grin(b, L.T); inHand(b, 'banane', 1, .55);
  const me = put(ich, FX - 3.6, 0, -9.2, PI * .78); actuar(me, L.lt, [[0, 'point_l']], { T: L.T }); talk(me, L.T, 5.07, 6.15, 'smug');
  orb(L.k, V(FX - .4, 3.8, -4), null, [17, PI + .3, .1, 44], [15.5, PI + .26, .1, 42]); sh(V(FX, 0, -4), 30); }, [[0, 'zoom_in', .5], [.3, 'hmm', .3]]);
// 7 «Der hat gerade eine Banane»: carga el brazo con el plátano
shot(6.15, 'W', null, L => { field(); const k = clamp((L.lt - .1) / .95); const b = thrower(ban, FX, 0, PI, k, 'banane', .6); cara(b, L.T, { expr: 'determined', mouth: 'teeth' });
  if (k >= .62) { const f = clamp((L.lt - .7) / 1.5), p = arc([FX + .8, 7, -.6], [FX, 8, -150], 60, f); show(FOODS.banane, p.x, p.y, p.z, L.T * 8, .9); }
  orb(L.k, V(FX, 3.6, 0), null, [15, PI + .4, .06, 44], [14, PI + .3, .05, 44]); sh(V(FX, 0, 0), 30); }, [[.15, 'strain', .4], [.75, 'throw', .7], [.8, 'whoosh_up', .6]]);
// 8 «über den Hügel geschleudert»: el plátano gira por encima de la colina
shot(7.31, 'S', null, L => { field(); const f = clamp(.12 + L.lt / 1.5 * .88), p = arc([FX + .8, 7, -.6], [FX, 8, -260], 70, f); show(FOODS.banane, p.x, p.y, p.z, L.T * 9, 2.2); trail(p, V(0, .2, -1).normalize(), L.T, 14, .9);
  cam([p.x + 12, p.y + 3, p.z + 26], [p.x, p.y - 4, p.z - 10], 50); sh(V(FX, 0, -120), 60); }, [[0, 'whoosh', .6], [.6, 'whoosh_soft', .4], [1.0, 'whistle', .3]]);
// 9 «Und jetzt haust ein Chimpanzini Bananini» (zoom lento): el chimpancé-plátano se golpea el pecho en el garaje
shot(8.65, null, 'slow', L => { use('GA'); day(); const b = beast(CH, GX, 0, -8.5, 0); b.pose(L.T, { beat: L.lt > .3 ? 1 : 0, hop: L.lt > .3 ? 1 : 0, face: { mouth: L.lt > .3 ? 'open' : 'grin' } });
  cm([GX, 5.4, 9, GX, 4.6, -8.5, 44], [GX, 5.2, 4, GX, 4.8, -8.5, 40], L.k, easeOut); sh(V(GX, 0, -8), 30); rareTag(b, 'LEGENDÄR', clamp((L.lt - .9) * 3), 6.4); }, [[.3, 'growl', .5], [.45, 'fist', .5], [.7, 'fist', .5], [.95, 'fist', .5], [1.2, 'aah', .3]]);
// 10 «in seiner Garage»: plano general del garaje: el dueño en el sofá y el Chimpanzini dentro
shot(10.79, 'W', null, L => { use('GA'); day(); const b = beast(CH, GX + 2.6, 0, -9.6, -.3); b.pose(L.T, { cheer: 1, face: { eyes: 'happy', mouth: 'grin' } });
  const o = put(ban, GX - 3.2, .6, -11, .1); applyPose(o, { lLx: 1.5, rLx: 1.5, lLk: 1.5, lRx: 1.5, lRk: 1.5, hipY: 1.55, aLx: .4, aLz: .5, aRz: .5, aRx: .4, aLe: .4, aRe: .4, headY: .3 }); grin(o, L.T);
  cm([GX + 8, 6.4, 13, GX, 4.6, -8, 46], [GX + 5.5, 6, 11.4, GX, 4.6, -8, 46], L.k); sh(V(GX, 0, -6), 30); }, [[0, 'whoosh_soft', .4], [.3, 'laugh_m', .3], [.6, 'clack', .3]]);
// 11 «Ich heiße Leo»: yo delante de mi casa saludando
shot(11.90, 'I', 'punch', L => { street(); const Hh = OR.houses[0]; const me = put(ich, -14, 0, 41.6, PI / 2); actuar(me, L.lt, [[0, 'wave']], { T: L.T }); talk(me, L.T, 11.9, 12.63, 'happy');
  beast(NB[1], -13.2, 0, 44.6, PI / 2 + .2).pose(L.T, { wave: 1 });
  orb(L.k, V(-13.4, 3.4, 42.4), null, [15, PI / 2 + .12, .12, 44], [13.5, PI / 2 + .05, .1, 44]); sh(V(-14, 0, 42), 30); badge('tag', 'LEO', W / 2, H * .2, (L.lt - .1) * 3, 1, 1); }, [[0, 'iris_pop', .5], [.2, 'pop', .5]]);
// 12 «und bei uns gilt:»: bajo el arco WURFPLATZ, señalo hacia arriba
shot(12.63, 'R', null, L => { field(); const me = put(ich, FX + 1.2, 0, 1.2, PI + .2); actuar(me, L.lt, [[0, 'idle'], [.1, { aRx: 2.6, aRz: .2, aRe: .1, headX: -.3 }]], { T: L.T }); talk(me, L.T, 12.63, 13.73, 'smug');
  orb(L.k, V(FX + 1.2, 4.6, 1.2), null, [12, PI + .15, -.18, 56], [11, PI + .1, -.2, 54]); sh(V(FX, 0, 3), 30); }, [[0, 'whirl', .5], [.3, 'ding_soft', .4]]);
// 13 «Je weiter dein Wurf»: grúa sobre el campo con los carteles de distancia
shot(13.73, 'W', null, L => { field(); const k = easeInOut(L.k);
  cam([FX + 6, 10 + k * 8, 8 - k * 30], [FX + 3, 2, -40 - k * 30], 50); sh(V(FX, 0, -40), 60); [['3 M', -6], ['10 M', -16], ['25 M', -38], ['100 M', -96]].forEach(([t, z], i) => badge3('big', t, V(FX + 15.6, 7.5, z), (L.lt - i * .18) * 3, .55)); }, [[0, 'whoosh_up', .5], [.2, 'tick', .4], [.4, 'tick', .4], [.6, 'tick', .4], [.8, 'ding_soft', .4]]);
// 14 «desto krasser dein Tier»: los Tiere en fila de menor a mayor con su rareza
shot(14.81, 'Z', null, L => { field(); const zr = -34; const row = [[NB[1], 'COMMON', 4.1], [TG[1], 'RARE', 7.1], [CA, 'EPIC', 4.8], [CH, 'LEGENDÄR', 6.4], [FR, 'MYTHISCH', 10], [TR, 'GOTT', 6.4]]; const xs = [-12, -6.5, -1, 4.5, 11, 19];
  row.forEach(([b, t, h], i) => { beast(b, FX + xs[i], 0, zr - i * .5, b === TR ? -.5 : 0); b.pose(L.T + i, {}); rareTag(b, t, (L.lt - .1 - i * .12) * 3, h); });
  const x = lerp(-9, 15, easeInOut(L.k)); cam([FX + x, 7, zr + 24], [FX + x + 1, 5, zr], 46); sh(V(FX + 3, 0, zr), 40); }, [[0, 'whoosh', .5], [.15, 'pling', .4], [.4, 'pling', .4], [.65, 'pling', .45], [.9, 'pling', .5], [1.1, 'ding_reveal', .5]]);
// 15 «Eine Karotte zehn Meter weit?»: lanzamiento corto, la zanahoria cae en el cartel de 10 m
shot(16.17, 'S', null, L => { field(); const k = clamp(L.lt / .5); const t = thrower(K[3], FX, 0, PI, k, 'karotte', .55); cara(t, L.T, { expr: 'determined' });
  const f = clamp((L.lt - .3) / .9); if (k >= .62) { const p = arc([FX + .8, 6, -.6], [FX + 2, .6, DIST[10]], 6, f); show(FOODS.karotte, p.x, p.y, p.z, 0, .8).rotation.set(f * 6, 0, .4); }
  cm([FX - 6, 5, -1, FX + 1, 2.8, -11, 48], [FX - 6.6, 5.4, -2.5, FX + 1.2, 2.4, -14, 48], L.k); sh(V(FX, 0, -8), 30); badge3('big', '10 M', V(FX + 6, 7, DIST[10]), (L.lt - .6) * 3, .8); }, [[.2, 'throw', .5], [.3, 'whoosh_soft', .4], [1.15, 'thud', .5], [1.2, 'ding_soft', .4]]);
// 16 «Ein Noobini Pizzanini»: sale del suelo junto a la zanahoria
shot(18.04, 'Z', 'punch', L => { field(); const up = easeOut(clamp(L.lt / .5)); const b = beast(NB[1], FX + 2, -4.1 + up * 4.1, DIST[10] - 1, -.2); b.pose(L.T, { wave: L.lt > .6, face: { eyes: 'open', mouth: 'smile' } }); show(FOODS.karotte, FX + 3.6, .5, DIST[10] + .4, 0, .8).rotation.set(1.4, 0, .4);
  cm([FX + 2.6, 3, DIST[10] + 8.5, FX + 2, 2.2, DIST[10] - 1, 40], [FX + 2.4, 2.8, DIST[10] + 7, FX + 2, 2.3, DIST[10] - 1, 38], L.k); sh(V(FX, 0, DIST[10]), 30); rareTag(b, 'COMMON', (L.lt - .4) * 3, 4.1); }, [[0, 'pop', .6], [.1, 'rubble', .4], [.5, 'toy', .4]]);
// 17 «Ein Apfel über den Fluss?»: la manzana cruza el río
shot(19.84, 'W', null, L => { field(); const f = clamp(.15 + L.lt / 1.38 * .85), p = arc([FX + .8, 6, -.6], [FX - 4, 1, -92], 30, f); show(FOODS.apfel, p.x, p.y, p.z, L.T * 6, 1.4); trail(p, V(0, 0, -1), L.T, 10, .7);
  cam([FX + 30, 6, -30], [p.x, lerp(4, p.y, .45), p.z], 60); sh(V(FX, 0, -64), 60); }, [[0, 'whoosh', .55], [.5, 'creek', .4], [1.1, 'splash', .25]]);
// 18 «Ein Tung Tung Tung Sahur»: sale del otro lado del río golpeando con el bate en cada «Tung»
shot(21.22, 'C', null, L => { field(); const b = beast(TG[1], FX - 4, 0, -92, .4); const bk = [.14, .41, .67].reduce((a, t) => L.lt >= t && L.lt < t + .26 ? (L.lt - t) / .26 : a, null); b.pose(L.T, { bonk: bk, face: { eyes: 'wide', mouth: bk != null ? 'open' : 'teeth' } });
  show(FOODS.apfel, FX - 7.2, 1, -89.6, 0, 1.1); cm([FX + 2, 5.4, -77, FX - 4, 4.6, -92, 42], [FX + 1.2, 5.2, -79, FX - 4, 4.8, -92, 40], L.k); sh(V(FX - 4, 0, -92), 30); rareTag(b, 'RARE', (L.lt - .5) * 3, 7.1); }, [[.14, 'metal_hit', .45], [.41, 'metal_hit', .45], [.67, 'metal_hit', .45], [.9, 'pling', .4]]);
// 19 «Ein Steak über den Berg»: el filete vuela hacia la montaña nevada
shot(22.85, 'S', null, L => { field(); const f = clamp(.2 + L.lt / 1.14 * .8), p = arc([FX + .8, 6, -.6], [FX + 30, 20, -290], 150, f); show(FOODS.steak, p.x, p.y, p.z, L.T * 5, 3); FOODS.steak.rotation.x = L.T * 4; trail(p, V(.1, .3, -1).normalize(), L.T, 12, 1.5);
  cam([p.x - 16, p.y + 4, p.z + 30], [p.x + 4, p.y - 6, p.z - 20], 50); sh(V(FX, 0, -200), 80); }, [[0, 'whoosh_up', .6], [.5, 'wind', .4]]);
// 20 «und ein Cappuccino Assassino»: aterriza en la calle en pose ninja
shot(23.99, 'Z', null, L => { street(); const y = Math.max(0, 14 - L.lt * 40); const b = beast(CA, 0, y, -4, 0); b.pose(L.T, { stance: clamp(L.lt * 2), crouch: y < .1 && L.lt < .7, face: { eyes: 'angry' } }); 
  orb(L.k, V(0, 3, -4), null, [13, .15, .05, 44], [11.5, .1, .04, 44]); sh(V(0, 0, -4), 30); rareTag(b, 'EPIC', (L.lt - .5) * 3, 4.8); }, [[0, 'whoosh_down', .5], [.33, 'land', .6], [.5, 'metal_creak', .3], [.8, 'swipe', .5], [1.2, 'zip', .4]]);
// 21 «spaziert direkt zu deiner Haustür»: camina por el jardín hasta la puerta y la dueña abre asustada
shot(25.77, 'W', null, L => { street(); const zz = -8 + 5.1, x = lerp(-11, -15.4, clamp(L.lt / 1.3)); const b = beast(CA, x, 0, zz, -PI / 2); b.pose(L.T, { walk: L.lt < 1.3 ? 1 : 0, stance: .3 });
  const o = put(XT[1], -17.1, .5, zz, PI / 2); actuar(o, L.lt, [[0, 'idle'], [.9, 'shock', { dur: .25 }]], { T: L.T }); cara(o, L.T, { expr: L.lt > .9 ? 'shock' : 'neutral', mouth: L.lt > .9 ? 'o' : 'flat' });
  orb(L.k, V(-14.6, 3.2, zz), null, [14, .3, .12, 44], [13, .26, .1, 44]); sh(V(-14, 0, zz), 30); }, [[0, 'steps', .5], [.6, 'steps', .5], [1.0, 'door_open', .5], [1.2, 'gasp_f', .4]]);
// 22 «Und das Beste?»: yo de cerca, cómplice
shot(27.55, 'C', 'punch', L => { street(); const me = put(ich, 0, 0, 10, PI / 10); actuar(me, L.lt, [[0, { aRx: 1.9, aRz: -.5, aRe: 2.3, headZ: .1 }]], { T: L.T }); talk(me, L.T, 27.55, 28.44, 'smug');
  orb(L.k, V(0, 4.2, 10), null, [10.5, PI / 10 + .1, .06, 44], [9.2, PI / 10 + .04, .06, 42]); sh(V(0, 0, 10), 20); }, [[0, 'zoom_fast', .5], [.3, 'sparkle', .4]]);
// 23 «Die Tiere machen Geld»: jardines con Tiere y monedas saltando por todas partes
shot(28.44, 'F', null, L => { street(); const z0 = -8; const B = [[NB[1], 2.6, z0 + 6], [LI[0], -3.2, z0 + 1], [CH, 3.4, z0 - 6], [TG[0], -3, z0 - 13]];
  B.forEach(([b, x, z], i) => { beast(b, x, 0, z, x < 0 ? .25 : -.25); b.pose(L.T + i, { face: { eyes: 'happy', mouth: 'grin' } }); const t = (L.lt + i * .27) % .9; coinPop(V(x, 4, z), L.T - t, L.T, 3, i * 4, .8); plus(V(x, 6.5, z), '+1', t, .8); });
  cm([0, 8, z0 + 21, 0, 3, z0 - 4, 48], [0, 7.4, z0 + 18, 0, 3, z0 - 4, 46], L.k); sh(V(0, 0, z0), 30); badge('gold', '$$$', W / 2, H * .15, (L.lt - .1) * 3, 1, .8); }, [[0, 'coins', .5], [.4, 'cash', .5], [.8, 'coins', .45], [1.2, 'cash_reg', .4]]);
// 24 «Alle paar Sekunden ploppen Goldmünzen aus ihnen raus»: un Lirilì escupe monedas cada pocos segundos
shot(29.91, 'W', null, L => { street(); const b = beast(LI[1], -1, 0, -4, .25); const per = .82, t = L.lt % per, n = Math.floor(L.lt / per); b.pose(L.T, { trunkUp: t < .3, face: { eyes: t < .3 ? 'wide' : 'half' } }); b.root.scale.setScalar(1 + (t < .15 ? Math.sin(t / .15 * PI) * .08 : 0));
  coinPop(V(-1, 3.2, -2.6), L.T - t, L.T, 5, n * 5, .7); plus(V(-1, 6, -3), '+1', t, 1);
  cm([3, 4.6, 7, -1, 3.2, -4, 42], [2.4, 4.2, 5.2, -1, 3.2, -4, 40], L.k); sh(V(0, 0, -4), 30); }, [[.02, 'pop', .55], [.84, 'pop', .55], [1.66, 'pop', .55], [2.0, 'coins', .4]]);
// 25 «Frag mich bloß nicht, wie»: yo me encojo de hombros
shot(32.59, 'R', null, L => { street(); const me = put(ich, 1, 0, -4, -.2); actuar(me, L.lt, [[0, 'idle'], [.1, 'shrug', { dur: .3 }]], { T: L.T }); talk(me, L.T, 32.59, 33.89, 'confused');
  const b = beast(LI[1], -2.4, 0, -6.4, .3); b.pose(L.T, {}); orb(L.k, V(-.6, 3.2, -5), null, [14, .05, .1, 44], [12.6, .02, .08, 44]); sh(V(0, 0, -4), 30); badge('q', '?', W * .7, H * .2, (L.lt - .3) * 3, 1, .9); }, [[.1, 'cloth', .4], [.3, 'hmm', .4]]);
// ---------- b: el vecino y sus 40, la fiesta, la noche de los ladrones, las barras, la Oma y el alcalde (33,9 – 77,9 s) ----------
const garden = () => { use('GT'); day(); };
// 40 Lirilì en la hierba del jardín (rejilla 8 × 5 con jitter), botando un poco
const herd40 = (T, n = 40, night_ = 0) => { LIH.show(n); for (let i = 0; i < n; i++) { const r = RNG(i * 7 + 3), x = TX - 15 + (i % 8) * 3.7 + (r() - .5) * 1.2, z = -20 + (i / 8 | 0) * 4.6 + (r() - .5) * 1.2; LIH.set(i, x, Math.abs(Math.sin(T * 3 + i)) * .12, z, (r() - .5) * .8 + (night_ ? 0 : Math.sin(T + i) * .1), .82); } };
const lieOn = (ch, x, y, z, ry = 0, rec = .35) => { put(ch, x, y, z, ry); ch.root.rotation.set(-PI / 2 + rec, ry, 0, 'YXZ'); applyPose(ch, { aLx: 2.9, aLz: .4, aLe: 1.6, aRx: 2.9, aRz: .4, aRe: 1.6, lLx: .1, lRx: -.05, headX: -.2 }); return ch; };
const sitOn = (ch, x, y, z, ry, extra = {}) => { put(ch, x, y, z, ry); applyPose(ch, { lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, hipY: 1.55, ...extra }); return ch; };
// 26 «Mein Nachbar hat»: en su tumbona, saluda con gafas de sol
shot(33.89, 'I', null, L => { garden(); const n = lieOn(nb, TX + 16, 2.2, 8.6, 0); applyPose(n, { aRx: 2.9, aRz: .4 + Math.sin(L.T * 9) * .35, aRe: .4, aLx: 2.9, aLz: .4, aLe: 1.6, headX: -.5 }); grin(n, L.T);
  herd40(L.T, 18); orb(L.k, V(TX + 16, 2.6, 5.4), null, [12, -.45, .7, 44], [10.5, -.4, .66, 42]); sh(V(TX + 10, 0, 2), 30); }, [[0, 'iris_pop', .5], [.2, 'birds', .3], [.5, 'laugh_m', .3]]);
// 27 «40 Lirilì Larilà im Garten»: el jardín lleno, el número en grande
shot(34.63, 'Z', null, L => { garden(); herd40(L.T); lieOn(nb, TX + 16, 2.2, 8.6, 0); grin(nb, L.T);
  cm([TX - 4, 17, 20, TX - 2, 1, -8, 50], [TX - 2, 14, 17, TX - 2, 1, -8, 48], L.k); sh(V(TX, 0, -6), 40); badge('gold', '40', W / 2, H * .15, (L.lt - .1) * 3, 1, 1.3); }, [[0, 'zoom_out', .5], [.2, 'ding_reveal', .5], [.6, 'toy', .3], [1.3, 'murmur', .3]]);
// 28 «Der war seit sechs Jahren nicht mehr arbeiten»: duerme en la tumbona sobre un montón de monedas
shot(36.81, 'W', null, L => { garden(); GT.MONEY.visible = true; const n = lieOn(nb, TX + 16, 2.2, 8.6, 0); cara(n, L.T, { eyes: 'closed', mouth: 'o', noBlink: 1 }); zzz(hp(n).add(V(.6, 1.6, 0)), L.T);
  herd40(L.T, 12); orb(L.k, V(TX + 16, 2.4, 5.2), null, [12, -.35, .5, 44], [11, -.3, .48, 42]); sh(V(TX + 14, 0, 6), 30); badge('big', '6 JAHRE', W / 2, H * .17, (L.lt - .2) * 3, 1, .9); }, [[0, 'snore', .45], [.6, 'coins', .4], [1.3, 'snore', .4]]);
// 29 «Und einmal im Jahr gibt's das große Fest»: banderines, globos, confeti y la gente bailando en la calle
shot(38.90, 'F', null, L => { street(); OR.FEST.visible = true; const z0 = -32; const P = [ich, K[0], K[4], XT[0], K[2], XT[2], K[7]];
  P.forEach((c, i) => { const x = -7 + i * 2.4, z = z0 + (i % 2) * 2.2; put(c, x, Math.abs(Math.sin(L.T * 5 + i)) * .5, z, Math.sin(i) * .3); actuar(c, L.lt, [[0, i % 2 ? 'cheer' : 'wave']], { T: L.T + i }); grin(c, L.T + i); });
  confetti(V(0, 6, z0), 0, L.lt % 2.2, 60); cm([0, 6.4, z0 + 17, 0, 6, z0 - 6, 50], [0, 5.6, z0 + 13.5, 0, 6.4, z0 - 6, 48], L.k); sh(V(0, 0, z0), 30); }, [[0, 'party_horn', .5], [.2, 'cheer', .5], [.6, 'confetti', .5], [1.4, 'firework', .4], [1.9, 'cheer', .4]]);
// 30 «Da regnet es gratis Tiere vom Himmel»: llueven Tiere sobre la calle de la fiesta y la gente los atrapa
shot(41.16, 'S', null, L => { street(); OR.FEST.visible = true; const z0 = -36;
  RAIN.forEach((h, j) => { h.show(h.n); for (let i = 0; i < h.n; i++) { const r = RNG(i * 9 + j * 31); r(); r(); const x = (r() - .5) * 13, z = z0 - r() * 22 + 2, y = ((40 + r() * 30) - (L.lt * (12 + r() * 6)) % 70); h.set(i, x, Math.max(0, y), z, r() * 6, .7, Math.sin(L.T * 2 + i) * .3, Math.cos(L.T * 2 + i) * .3); } });
  [K[1], XT[1], K[5]].forEach((c, i) => { put(c, -4 + i * 4, 0, z0 + 6 - (i % 2) * 2, Math.sin(i) * .2); actuar(c, L.lt, [[0, 'cheer']], { T: L.T + i }); grin(c, L.T + i); });
  cm([0, 4, z0 + 20, 0, 12, z0 - 6, 54], [0, 4.4, z0 + 18, 0, 13, z0 - 6, 52], L.k); sh(V(0, 0, z0), 40); badge('green', 'GRATIS!', W / 2, H * .14, (L.lt - .3) * 3, 1, .9); }, [[0, 'whoosh_down', .5], [.3, 'pop', .4], [.6, 'land', .4], [.9, 'pop', .4], [1.2, 'land', .4], [1.5, 'cheer', .4], [1.8, 'land', .4]]);
// 31 «Aber in der Nacht macht keiner ein Auge zu»: de noche, cada vecino vigila su jardín con los ojos como platos
shot(43.33, 'I', null, L => { street(); night(); const W_ = [[XT[3], LI[0], -4.2, 0], [K[0], TG[0], 4.4, -7], [lehrer, CA, -4, -16]];
  W_.forEach(([c, b, x, z], i) => { const s = x < 0 ? 1 : -1; put(c, x, 0, z, s * .35); actuar(c, L.lt, [[0, 'hug_self']], { T: L.T + i }); cara(c, L.T, { eyes: 'wide', mouth: 'flat', look: [Math.sin(L.T * 3 + i) * .6, 0], noBlink: 1 }); beast(b, x - s * 2.2, 0, z - 1.6, s * .35); b.pose(L.T, { face: { eyes: 'closed' } }); });
  cm([0, 6.4, 17, 0, 3.4, -6, 46], [0, 6, 13.5, 0, 3.4, -7, 46], L.k); sh(V(0, 0, -6), 40); }, [[0, 'crickets', .5], [.6, 'owl', .4], [1.2, 'heartbeat', .4]]);
// 32 «Denn jeder versucht, dir deine zu klauen»: un ladrón se lleva un Lirilì bajo el brazo, de puntillas
shot(45.60, 'W', null, L => { garden(); night(); herd40(L.T, 40, 1); const x = TX - 9 + L.lt * 2.6, z = 6; const d = put(dieb, x, 0, z, PI / 2); const p = { ...GEST.sneak, aRx: .9, aRe: 1.4, lLx: Math.sin(L.T * 6) * .5, lRx: -Math.sin(L.T * 6) * .5 }; applyPose(d, p); cara(d, L.T, { expr: 'sus', mouth: 'smirk' });
  const b = beast(LI[1], x + 1.4, 2.4, z + .8, PI / 2, .55); b.pose(L.T, { face: { eyes: 'wide' } }); b.root.rotation.z = -.5;
  orbit(V(x + .8, 3, z), 12, .35, .12, 44); sh(V(x, 0, z), 30); }, [[0, 'steps', .3], [.5, 'sneak' && 'crawl', .4], [1.2, 'tension_str', .4], [1.8, 'creepy_ting', .3]]);
// 33 «Mein Nachbar sitzt die ganze Nacht mit einer Taschenlampe vor seinem Zaun»: sentado en su silla, alumbra el jardín
shot(47.85, 'Z', null, L => { garden(); night(); herd40(L.T, 32, 1); show(CHAIR, TX + 20, 0, -6, -PI / 2); const n = sitOn(nb, TX + 20.2, .3, -6, -PI / 2, { aRx: 1.4, aRz: -.1, aRe: .3, aLx: .5, aLz: .2, aLe: .8 }); cara(n, L.T, { eyes: 'wide', mouth: 'flat', noBlink: 1 });
  const sw = Math.sin(L.T * 1.6) * .5; n.spine.rotation.y = sw * .6; attach(FLASHL, n.aR.hand, [0, -.5, .3], [-1.5, 0, 0], 1); TORCH.intensity = 110; FLASHL.updateMatrixWorld(true); TORCH.position.copy(wpos(FLASHL)); TORCH.target.position.set(TX - 2, 0, -6 + sw * 14);
  orb(L.k, V(TX + 19, 3.2, -6), null, [13, -PI / 2 + .8, .14, 44], [11.5, -PI / 2 + .75, .12, 42]); sh(V(TX, 0, 0), 30); }, [[0, 'switch', .5], [.4, 'crickets', .4], [1.5, 'chair_roll', .3], [2.5, 'owl', .3]]);
// 34 «und zählt sie. Alle 40.»: el foco recorre la manada; 38, 39, 40
shot(50.95, 'C', null, L => { garden(); night(); herd40(L.T, 40, 1); const n = sitOn(nb, TX + 20.2, .3, -6, -PI / 2, { aRx: 1.4, aRz: -.1, aRe: .3, aLx: 2.0, aLz: -.3, aLe: .2 }); cara(n, L.T, { expr: 'determined', mouth: kitLips(L.T, spoken(50.95, 52.9)) || 'flat' }); show(CHAIR, TX + 20, 0, -6, -PI / 2);
  attach(FLASHL, n.aR.hand, [0, -.5, .3], [-1.5, 0, 0], 1); TORCH.intensity = 110; FLASHL.updateMatrixWorld(true); TORCH.position.copy(wpos(FLASHL)); TORCH.target.position.set(TX - 2, 0, -8 + Math.sin(L.T * 2) * 10);
  cm([TX + 25, 13, 3, TX + 2, 1, -10, 48], [TX + 24.4, 12.4, 1.6, TX + 2, 1, -10, 46], L.k); sh(V(TX, 0, 0), 30); const c = L.lt < .55 ? '38' : L.lt < 1.05 ? '39' : '40'; badge(c === '40' ? 'gold' : 'big', c, W / 2, H * .16, 1, 1, c === '40' ? 1.3 : 1); }, [[0, 'tick', .5], [.55, 'tick', .5], [1.06, 'ding_reveal', .55], [1.5, 'sigh', .4]]);
// 35 «Deshalb trainiert hier jeder den ganzen Tag»: de día, la calle llena de gente haciendo dominadas
shot(52.90, 'F', null, L => { street(); const P = [[K[4], -10.6, -20.3, PI / 2], [XT[4], -10.6, -17.7, PI / 2], [K[7], -10.6, -41, PI / 2]];
  P.forEach(([c, x, z, ry], i) => { pullup(c, x, z, ry, 7.4, .5 + .5 * Math.sin(L.T * 4 + i * 1.3)); cara(c, L.T, { expr: 'determined', mouth: 'teeth' }); });
  cm([1.6, 5.6, -16, -10.6, 5.2, -19.5, 44], [.6, 5.4, -17, -10.6, 5.2, -19.5, 42], L.k); sh(V(-8, 0, -8), 40); }, [[0, 'sunrise_shine', .4], [.3, 'strain', .4], [.9, 'metal_creak', .3], [1.4, 'strain', .4], [1.9, 'birds', .3]]);
// 36 «In jeder Straße stehen Klimmzugstangen»: plano aéreo bajando por la calle llena de barras de colores
shot(55.16, 'W', null, L => { street(); const z = 30 - L.lt * 14; cam([0, 22 - L.lt * 3, z + 14], [0, 2, z - 26], 52); sh(V(0, 0, z - 20), 60);
  [[K[2], -10.6, -19, PI / 2], [K[6], 10.6, -13, -PI / 2], [K[0], -10.6, -41, PI / 2]].forEach(([c, x, z_, ry], i) => { pullup(c, x, z_, ry, 7.4, .5 + .5 * Math.sin(L.T * 4 + i)); }); }, [[0, 'whoosh', .5], [.4, 'clack', .3], [.9, 'metal_hit', .3], [1.6, 'birds', .3]]);
// 37 «Kinder,»: dos niños pequeños colgados de la barra
shot(57.46, 'Z', null, L => { street(); [[K[2], 3 - 1.2, .7], [K[6], 3 + 1.2, .68]].forEach(([c, z, s], i) => { c.root.scale.setScalar(s); pullup(c, -10.6, z, PI / 2, 7.4, .5 + .5 * Math.sin(L.T * 6 + i * 2)); cara(c, L.T, { expr: 'determined', mouth: 'grin' }); });
  orb(L.k, V(-10.6, 6.2, 3), null, [13, PI / 2 + .1, .05, 44], [12, PI / 2 + .05, .04, 44]); sh(V(-10, 0, 3), 30); }, [[0, 'kids_laugh', .45], [.3, 'spring', .4]]);
// 38 «Lehrer,»: el profe delante del colegio
shot(58.11, 'S', null, L => { street(); pullup(lehrer, 10.6, -207, -PI / 2, 7.4, .5 + .5 * Math.sin(L.T * 5)); cara(lehrer, L.T, { expr: 'determined', mouth: 'teeth' });
  orb(L.k, V(10.6, 4.8, -207), null, [13, -PI / 2 - .25, .1, 44], [12, -PI / 2 - .2, .08, 44]); sh(V(10, 0, -207), 30); }, [[0, 'whoosh_soft', .4], [.2, 'chalk', .3], [.4, 'strain', .4]]);
// 39 «sogar meine Oma.»: la Oma colgada, con su moño
shot(58.70, 'C', 'punch', L => { street(); pullup(oma, -10.6, -41, PI / 2, 7.4, .5 + .5 * Math.sin(L.T * 7)); grin(oma, L.T);
  orb(L.k, V(-10.6, 4.8, -41), null, [12.5, PI / 2 + .2, .08, 44], [11.5, PI / 2 + .15, .06, 44]); sh(V(-10, 0, -41), 30); }, [[0, 'zoom_fast', .5], [.2, 'gasp_old', .4]]);
// 40 «Die schafft 500 Klimmzüge vor dem Frühstück.»: a toda velocidad, el contador sube a 500, y el desayuno espera al lado
shot(59.76, 'W', null, L => { street(); const k = .5 + .5 * Math.sin(L.T * 16); pullup(oma, -10.6, -41, PI / 2, 7.4, k); cara(oma, L.T, { expr: 'determined', mouth: 'teeth' }); sweat(oma, L.T, 2);
  show(TABLE, -7.6, 0, -36.5, PI / 2); cm([-1.6, 5.6, -33, -9.6, 4, -39, 46], [-2.4, 5.4, -34, -9.6, 4.2, -39, 44], L.k); sh(V(-9, 0, -38), 30);
  const n = Math.min(500, Math.round(500 * easeIn(clamp(L.lt / 1.4)))); badge(n === 500 ? 'gold' : 'num', String(n), W / 2, H * .16, 1, 1, n === 500 ? 1.3 : 1); badge3('tag', 'FRÜHSTÜCK', V(-7.6, 4.8, -36.5), (L.lt - 1.2) * 3, .7); }, [[0, 'ticks', .45], [.6, 'ticks', .45], [1.2, 'ticks', .45], [1.42, 'ding_reveal', .55], [1.9, 'plate_slide', .3]]);
// 41 «Letzte Woche hat sie einen Cheeseburger so weit geworfen,»: la Oma lanza la hamburguesa en el campo
shot(62.33, 'S', null, L => { field(); const k = clamp((L.lt - .3) / 1.1); const t = thrower(oma, FX, 0, PI, k, 'burger', .55); cara(t, L.T, { expr: 'determined', mouth: 'teeth' });
  if (k >= .62) { const f = clamp((L.lt - 1.0) / 1.6), p = arc([FX + .8, 6, -.6], [FX, 180, -400], 80, f); show(FOODS.burger, p.x, p.y, p.z, L.T * 6, 1); }
  cm([FX + 5, 3.6, -9, FX, 3.6, 0, 42], [FX + 6, 3.2, -8, FX, 3.8, 0, 40], L.k); sh(V(FX, 0, 0), 30); }, [[.3, 'strain', .4], [.95, 'throw', .7], [1.0, 'whoosh_up', .6], [1.6, 'cheer', .3]]);
// 42 «dass er drei Tage zum Landen gebraucht hat»: la hamburguesa sigue volando mientras pasan días y noches
shot(65.09, 'R', null, L => { field(); const c = (Math.cos(L.lt / L.d * PI * 6) + 1) / 2; setSky([lerp(.02, .18, c), lerp(.04, .48, c), lerp(.14, .98, c)], [lerp(.06, .45, c), lerp(.1, .72, c), lerp(.3, 1, c)], [lerp(.16, .82, c), lerp(.2, .93, c), lerp(.42, 1, c)]); sun.intensity = lerp(.9, 2.5, c); hemi.intensity = lerp(.8, 1.25, c); sky.moon.visible = c < .5; sky.moon.position.set(-500, 700, -1200); BIRDSON = 0;
  const p = V(FX, 140 + L.lt * 4, -300 - L.lt * 30); show(FOODS.burger, p.x, p.y, p.z, L.T * 5, 2.4); trail(p, V(0, .1, -1), L.T, 10, 1.2); cam([p.x + 8, p.y - 6, p.z + 22], [p.x, p.y, p.z], 50);
  const day_ = Math.min(3, 1 + Math.floor(L.lt / L.d * 3)); badge('big', day_ + (day_ === 1 ? ' TAG' : ' TAGE'), W / 2, H * .17, 1, 1, .9); }, [[0, 'whirl', .5], [.5, 'rooster', .3], [.75, 'wind', .4], [1.2, 'crickets', .3], [1.5, 'rooster', .3]]);
// 43 «Jetzt gehört ihr ein Frigo Camelo.»: el camello-nevera junto a la Oma en su jardín
shot(67.33, 'Z', 'punch', L => { street(); const b = beast(FR, 15.6, 0, -7.2, -PI / 2 - .5); b.pose(L.T, { neckX: -.1, face: { eyes: 'half' } }); const o = put(oma, 13.6, 0, -3.4, -PI / 2 - .3); actuar(o, L.lt, [[0, 'cheer']], { T: L.T }); grin(o, L.T);
  orb(L.k, V(15, 5.4, -5.6), null, [22, -PI / 2, .12, 46], [20, -PI / 2 + .05, .1, 46]); sh(V(15, 0, -8), 30); rareTag(b, 'MYTHISCH', (L.lt - .3) * 3, 10); }, [[0, 'zoom_fast', .5], [.2, 'hooves', .45], [.5, 'ding_reveal', .5], [1.2, 'machine_hum', .3]]);
// 44 «Er pennt in ihrer Badewanne.»: dormido en la bañera con espuma y patito
shot(69.33, 'W', null, L => { use('BA'); inside(); const b = beast(FR, BX - .8, 2.5, -6, PI / 2, .7); b.pose(L.T, { sit: 1, sleep: 1 }); zzz(V(BX + 3.6, 8.6, -6), L.T);
  cm([BX + 9, 11, 3, BX + 2, 5.4, -6, 46], [BX + 8, 10.6, 2, BX + 2, 5.4, -6, 44], L.k); }, [[0, 'snore', .5], [.6, 'water_bloop', .4], [1.2, 'snore', .45]]);
// 45 «Und unser Bürgermeister?»: delante de su villa junto al mar, con pose
shot(70.91, 'F', null, L => { use('KS'); day(); const m = put(mayor, CX + 3.6, 0, 1.8, -.2); actuar(m, L.lt, [[0, 'idle'], [.1, { aLx: 1.0, aLz: .6, aLe: 2.0, aRx: 1.9, aRz: -.4, aRe: 2.2, headX: -.1 }]], { T: L.T }); grin(m, L.T);
  orb(L.k, V(CX + 3.4, 4, 1.8), null, [14, .3, .1, 44], [12.8, .24, .08, 44]); sh(V(CX, 0, 0), 30); badge('tag', 'BÜRGERMEISTER', W / 2, H * .17, (L.lt - .2) * 3, 1, .9); }, [[0, 'flash', .4], [.2, 'bell_far', .4], [.5, 'murmur', .3]]);
// 46 «Der hat eine komplette Pizza übers Meer geworfen.»: en la playa lanza la pizza hacia el horizonte
shot(71.92, 'S', null, L => { use('KS'); day(); const k = clamp((L.lt - .2) / 1.0); const m = put(mayor, CX, 0, 30, 0); applyPose(m, throwPose(k)); cara(m, L.T, { expr: 'determined', mouth: 'teeth' }); if (k < .62) inHand(m, 'pizza', 1, .7);
  if (k >= .62) { const f = clamp((L.lt - .85) / 1.8), p = arc([CX + .8, 6, 30.6], [CX, 30, 800], 120, f); show(FOODS.pizza, p.x, p.y, p.z, L.T * 9, 2.2); FOODS.pizza.rotation.x = .4; }
  cm([CX - 5, 3.8, 41, CX, 4.4, 30, 42], [CX - 9, 5, 22, CX + 2, 10, 70, 50], L.k > .4 ? (L.k - .4) / .6 : 0); sh(V(CX, 0, 30), 30); }, [[.2, 'strain', .4], [.85, 'throw', .7], [.9, 'whoosh_up', .6], [1.6, 'wind', .4], [2.2, 'splash', .2]]);
// 47 «Eine Woche später»: calendario +7 en la puerta de la villa
shot(74.57, 'I', null, L => { use('KS'); day(); show(CAL, CX - .2, 6.6, -5.3, 0, 1); CAL.rotation.z = Math.sin(L.T * 3) * .05; cm([CX - .2, 6, 4, CX - .2, 5.6, -5.3, 40], [CX - .2, 6, 2.4, CX - .2, 5.8, -5.3, 38], L.k); sh(V(CX, 0, -4), 30);
  badge('big', '1 WOCHE SPÄTER', W / 2, H * .17, (L.lt - .05) * 3, 1, .8); }, [[0, 'pages', .5], [.3, 'tick', .4]]);
// 48 «klopfte Tralalero Tralala an seine Tür.»: el tiburón llama con la aleta; el alcalde abre y se queda blanco
shot(75.31, 'Z', null, L => { use('KS'); day(); const b = beast(TR, CX - .6, 1.25, -1.0, PI - .55); const kn = [.0, .25, .5].some(t => L.lt > t && L.lt < t + .12); b.pose(L.T, { open: kn ? .4 : 0, face: { eyes: 'open' } }); b.body.rotation.x = kn ? .12 : 0;
  KS.DOOR.rotation.y = -1.3 * easeOut(clamp((L.lt - 1.0) / .5)); const m = put(mayor, CX + .6, 1.4, -7.4, 0); actuar(m, L.lt, [[0, 'idle'], [1.2, 'shock', { dur: .25 }]], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'o' });
  orb(L.k, V(CX, 4.4, -3), null, [17, 1.25, .1, 44], [15.5, 1.2, .08, 44]); sh(V(CX, 0, -3), 30); rareTag(b, 'GOTT', (L.lt - .8) * 3, 6.4); }, [[0, 'knock', .6], [.25, 'knock', .6], [.5, 'knock', .6], [1.0, 'door_creak', .5], [1.3, 'gasp', .5], [1.8, 'ding_reveal', .4]]);
// ---------- c: yo, Kalle, el entrenamiento, el queso dorado y su viaje (77,9 – 115,2 s) ----------
const flex = { aLx: 1.3, aLz: 1.25, aLe: 2.3, aRx: 1.3, aRz: 1.25, aRe: 2.3, lean: -.06, headX: -.05 };
// ciclo día/noche del cielo (c = 1 día, 0 noche)
function dayNight(c) { setSky([lerp(.02, .18, c), lerp(.04, .48, c), lerp(.14, .98, c)], [lerp(.06, .45, c), lerp(.1, .72, c), lerp(.3, 1, c)], [lerp(.16, .82, c), lerp(.2, .93, c), lerp(.42, 1, c)]); sun.intensity = lerp(.9, 2.5, c); hemi.intensity = lerp(.8, 1.25, c); sky.moon.visible = c < .5; sky.moon.position.set(-500, 700, -1200); BIRDSON = 0; }
// queso volando con estela (escala s)
const cheeseFly = (p, T, s = 1.6, dir = V(0, 0, -1)) => { show(FOODS.kaese, p.x, p.y, p.z, T * 5, s); FOODS.kaese.rotation.x = T * 3; trail(p, dir, T, 16, .55 * s); };
// 49 «Aber ich?»: yo, cabizbajo
shot(77.86, 'Z', 'punch', L => { street(); const me = put(ich, 0, 0, 6, .15); armsK(me, 0); actuar(me, L.lt, [[0, { headX: .12, aLz: .05, aRz: .05, lean: .08 }]], { T: L.T }); talk(me, L.T, 77.86, 78.47, 'sad');
  orb(L.k, V(0, 4, 6), null, [10, .25, .1, 44], [9, .2, .08, 42]); sh(V(0, 0, 6), 20); }, [[0, 'zoom_fast', .5], [.2, 'sad_tone', .4]]);
// 50 «Ich hatte die schwächsten Arme der ganzen Stadt.»: colgado de la barra sin poder subir, brazos finos, dos niños se ríen
shot(78.47, 'W', null, L => { street(); const me = ich; armsK(me, 0); pullup(me, -10.6, 3, PI / 2, 7.4, .08 + Math.abs(Math.sin(L.T * 9)) * .06); cara(me, L.T, { expr: 'worried', mouth: 'teeth' }); sweat(me, L.T, 2);
  [[K[2], -6.4, 6.4, .72], [K[6], -6.8, -.4, .7]].forEach(([c, x, z, s], i) => { put(c, x, 0, z, -PI / 2 + (i ? .5 : -.5)); c.root.scale.setScalar(s); actuar(c, L.lt, [[0, i ? 'point' : 'point_l']], { T: L.T + i }); cara(c, L.T, { expr: 'happy', mouth: 'grin', eyes: 'happy' }); });
  orb(L.k, V(-9.6, 4.4, 3), null, [15, PI / 2 + .25, .12, 44], [14, PI / 2 + .2, .1, 44]); sh(V(-9, 0, 3), 30); badge('red', 'SCHWACH', W / 2, H * .15, (L.lt - .6) * 3, 1, .8); }, [[0, 'strain', .5], [.6, 'kids_laugh', .45], [1.3, 'stretch_creak', .35], [1.9, 'kids_laugh', .4]]);
// 51 «Meine erste Karotte flog drei Meter.»: mi lanzamiento ridículo
shot(80.88, 'S', null, L => { field(); const k = clamp(L.lt / .55); const me = thrower(ich, FX, 0, PI, k, 'karotte', .5); armsK(me, 0); cara(me, L.T, { expr: k < .9 ? 'determined' : 'shock', mouth: k < .9 ? 'teeth' : 'o' });
  if (k >= .62) { const f = clamp((L.lt - .34) / .6), p = arc([FX + .8, 4.8, -.6], [FX + 1.4, .5, DIST[3]], 2.2, f); show(FOODS.karotte, p.x, p.y, p.z, 0, .7).rotation.set(f * 5, 0, .5); }
  orb(L.k, V(FX + .6, 3.2, -2.6), null, [15, PI - .9, .14, 44], [14, PI - .95, .12, 44]); sh(V(FX, 0, -3), 30); badge3('big', '3 M', V(FX + 1.4, 3.6, DIST[3]), (L.lt - .95) * 3, .8); }, [[.15, 'throw', .5], [.3, 'whoosh_soft', .35], [.95, 'thud', .5], [1.2, 'sad_tone', .4]]);
// 52 «Und ich bekam einen Noobini Pizzanini.»: Kalle llega andando; yo nada impresionado
shot(82.84, 'Z', null, L => { field(); const me = put(ich, FX + .4, 0, -1.2, PI + .5); armsK(me, 0); actuar(me, L.lt, [[0, 'idle'], [.8, 'facepalm', { dur: .4 }]], { T: L.T }); cara(me, L.T, { expr: 'bored', mouth: 'flat' });
  const z = Math.min(-3.4, -9 + L.lt * 3.2); const b = beast(KALLE, FX - .6 - (z + 9) * .5, 0, z, -.5); b.pose(L.T, { walk: z < -3.45 ? 1 : 0, wave: z >= -3.45, face: { eyes: 'open', mouth: 'smile' } });
  orb(L.k, V(FX - .1, 2.8, -3), null, [13, -1.35, .12, 44], [12, -1.25, .1, 44]); sh(V(FX, 0, -3), 30); rareTag(b, 'COMMON', (L.lt - .3) * 3, 4.1); }, [[0, 'steps', .4], [.6, 'toy', .4], [1.2, 'sigh_kid', .45]]);
// 53 «Ich nannte ihn Kalle.»: lo levanto como a un trofeo
shot(85.33, 'C', 'punch', L => { field(); const me = put(ich, FX, 0, -1, PI + .15); armsK(me, 0); actuar(me, L.lt, [[0, { aLx: 2.0, aLz: .2, aLe: .3, aRx: 2.0, aRz: .2, aRe: .3, headX: -.2 }]], { T: L.T }); grin(me, L.T);
  const b = beast(KALLE, FX - Math.sin(PI + .15) * 1.3, 4.4, -1 - Math.cos(PI + .15) * 1.3, PI + .15, .62); b.pose(L.T, { up: 1, face: { eyes: 'happy', mouth: 'grin' } });
  orb(L.k, V(FX, 4.6, -1.6), null, [11.5, PI + .3, .05, 44], [10.5, PI + .25, .04, 44]); sh(V(FX, 0, -1), 30); badge('tag', 'KALLE', W / 2, H * .15, (L.lt - .3) * 3, 1, 1.1); }, [[0, 'pop', .5], [.3, 'sparkle', .45], [.6, 'toy', .4]]);
// 54 «Er macht eine Münze am Tag.»: Kalle en mi escritorio; una sola moneda
shot(86.38, 'W', null, L => { use('ZI'); inside(); const b = beast(KALLE, ZX - .6, 5.25, -9.2, .2, .58); b.pose(L.T, { face: { eyes: L.lt > .4 && L.lt < .7 ? 'wide' : 'open', mouth: 'smile' } }); ZI.JAR.userData.set(.04);
  coinPop(V(ZX - .6, 7.4, -9), .45, L.lt, 1, 0, .6); plus(V(ZX - .6, 8.4, -9.2), '+1', L.lt - .45, 1);
  orb(L.k, V(ZX + .4, 6.8, -9.2), null, [11, .2, .2, 44], [10, .15, .18, 44]); badge('big', '1 MÜNZE / TAG', W / 2, H * .15, (L.lt - .8) * 3, 1, .75); }, [[0, 'tick', .4], [.45, 'pop', .55], [.5, 'coin_flip', .5], [.9, 'ding_soft', .4]]);
// 55 «Die ganze Stadt hat gelacht.»: la gente se ríe y me señala; yo con Kalle en brazos
shot(87.83, 'F', null, L => { street(); const me = put(ich, 0, 0, 0, 0); armsK(me, 0); actuar(me, L.lt, [[0, 'hold']], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'frown' }); beast(KALLE, 0, 1.6, 1.3, 0, .55).pose(L.T, { face: { eyes: 'open' } });
  const P = [[K[0], -4.2, -5], [XT[0], 4.4, -4.6], [K[4], -2, -9], [lehrer, 2.4, -9.4], [K[7], -6, -11], [XT[2], 6, -11]]; P.forEach(([c, x, z], i) => { put(c, x, 0, z, faceTo(V(x, 0, z), V(0, 0, 0))); actuar(c, L.lt, [[0, i % 2 ? 'point' : 'point_l'], [.4 + i * .1, { lean: -.2, aLx: .8, aRx: .8, aLe: 1.6, aRe: 1.6, aLz: .5, aRz: .5, headX: -.25 }]], { T: L.T + i }); cara(c, L.T, { expr: 'happy', mouth: Math.sin(L.T * 14 + i) > 0 ? 'grin' : 'o', eyes: 'happy' }); });
  orb(L.k, V(0, 3.6, -3), null, [17, .05, .14, 46], [15.5, .02, .12, 46]); sh(V(0, 0, -4), 30); }, [[0, 'laugh_m', .45], [.3, 'laugh_deep', .4], [.6, 'kids_laugh', .4], [1.0, 'laugh_old', .35]]);
// 56 «Also hab ich trainiert.» (zoom lento): me agarro a la barra con decisión
shot(89.37, null, 'slow', L => { street(); const me = ich; armsK(me, .15); pullup(me, -10.6, 3, PI / 2, 7.4, 0); cara(me, L.T, { expr: 'determined', mouth: 'flat' });
  orb(L.k, V(-10.6, 5.6, 3), null, [11, PI / 2 + .35, .04, 44], [8.6, PI / 2 + .3, .02, 40]); sh(V(-10, 0, 3), 30); }, [[.1, 'clack', .5], [.4, 'breath', .45]]);
// 57 «Jeden einzelnen Tag.»: días y noches pasan volando mientras sigo con las dominadas
shot(90.51, 'W', null, L => { street(); const c = (Math.cos(L.lt / L.d * PI * 6) + 1) / 2; dayNight(c); const me = ich; armsK(me, .2 + L.k * .2); pullup(me, -10.6, 3, PI / 2, 7.4, .5 + .5 * Math.sin(L.T * 8)); cara(me, L.T, { expr: 'determined', mouth: 'teeth' });
  orb(L.k, V(-10.6, 5, 3), null, [16, PI / 2 + .7, .2, 46], [15, PI / 2 + .9, .2, 46]); sh(V(-10, 0, 3), 30); }, [[0, 'whirl', .45], [.3, 'rooster', .3], [.7, 'crickets', .3], [1.0, 'rooster', .3]]);
// 58–60 «Ein Klimmzug, dann zehn, dann tausend.»: el contador y los brazos crecen
shot(92.21, 'C', 'punch', L => { street(); const me = ich; armsK(me, .15); pullup(me, -10.6, 3, PI / 2, 7.4, easeInOut(clamp(L.lt / .7))); cara(me, L.T, { expr: 'determined', mouth: 'teeth' }); sweat(me, L.T, 1);
  orb(L.k, V(-10.6, 5.2, 3), null, [12, PI / 2 + .2, .05, 44], [11, PI / 2 + .15, .04, 44]); sh(V(-10, 0, 3), 30); badge('num', '1', W / 2, H * .15, 1, 1, 1.2); }, [[0, 'strain', .5], [.6, 'ding_soft', .4]]);
shot(93.09, 'C', 'punch', L => { street(); dayNight(.25); const me = ich; armsK(me, .45); pullup(me, -10.6, 3, PI / 2, 7.4, .5 + .5 * Math.sin(L.T * 12)); cara(me, L.T, { expr: 'determined', mouth: 'teeth' });
  orb(L.k, V(-10.6, 5.2, 3), null, [12, PI / 2 - .35, .1, 44], [11, PI / 2 - .4, .08, 44]); sh(V(-10, 0, 3), 30); badge('num', '10', W / 2, H * .15, 1, 1, 1.25); }, [[0, 'ding_soft', .45], [.3, 'strain', .4]]);
shot(93.83, 'Z', 'punch', L => { street(); const me = ich; armsK(me, .8); pullup(me, -10.6, 3, PI / 2, 7.4, .5 + .5 * Math.sin(L.T * 22)); cara(me, L.T, { expr: 'angry', mouth: 'teeth' }); sweat(me, L.T, 2);
  orb(L.k, V(-10.6, 5.2, 3), null, [13, PI / 2 + .6, .25, 46], [12, PI / 2 + .55, .22, 46]); sh(V(-10, 0, 3), 30); badge('gold', '1000', W / 2, H * .15, 1, 1, 1.35); }, [[0, 'ticks', .5], [.3, 'ticks', .5], [.6, 'ding_reveal', .5]]);
// 61 «Meine Arme wurden so stark,»: saco músculo con los brazos enormes, destellos
shot(94.69, 'S', null, L => { street(); const me = put(ich, 0, 0, 4, .1); armsK(me, 1); actuar(me, L.lt, [[0, 'idle'], [.15, flex, { dur: .3 }]], { T: L.T }); grin(me, L.T); confetti(V(0, 2, 4), .2, L.lt, 24);
  orb(L.k, V(0, 4, 4), null, [12, .3, .08, 44], [10.5, .25, .06, 42]); sh(V(0, 0, 4), 30); }, [[.15, 'stretch', .5], [.3, 'sparkle', .5], [.8, 'cheer', .3]]);
// 62 «dass ich aus Versehen die Kühlschranktür abgerissen hab.»: tiro de la puerta de la nevera y me quedo con ella en la mano
shot(96.23, 'W', null, L => { use('KU'); inside(); const me = put(ich, KX + 8.6, 0, -3.2, lerp(PI - .2, PI * 2 + .6, easeInOut(clamp((L.lt - .85) / .4)))); armsK(me, 1); const rip = clamp((L.lt - .55) / .25);
  actuar(me, L.lt, [[0, 'reach'], [.55, { aRx: 1.0, aRe: .9, aRz: .2, lean: -.25, aLx: .5, lLx: -.3, lRx: .3 }, { dur: .2 }], [.9, { ...GEST.shock, aRx: 1.4, aRe: .5 }, { dur: .3 }]], { T: L.T }); cara(me, L.T, L.lt > .7 ? { expr: 'shock', mouth: 'o' } : { expr: 'neutral' });
  KU.FL.intensity = L.lt > .5 ? 40 : 0; KU.DOOR.rotation.y = lerp(0, .9, rip); KU.DOOR.position.set(lerp(-2.8, -5.5, rip), lerp(0, 1.0, rip), lerp(2.15, 4.4, rip)); KU.DOOR.rotation.z = rip * .2;
  cm([KX + 14, 7, 9, KX + 7.4, 4.6, -5, 48], [KX + 13.4, 6.8, 8, KX + 7.4, 4.6, -5, 48], L.k); }, [[0, 'steps', .35], [.55, 'metal_rip', .6], [.62, 'door_crash', .5], [.9, 'gasp', .45], [1.3, 'clack', .35]]);
// 63 «Ich hab jede Münze gespart,»: el bote se llena y el contador sube
shot(98.54, 'R', null, L => { use('ZI'); inside(); const k = easeInOut(L.k); ZI.JAR.userData.set(lerp(.05, .85, k)); beast(KALLE, ZX - 2.6, 5.25, -9.2, .2, .58).pose(L.T, { face: { eyes: 'happy', mouth: 'grin' } }); coinPop(V(ZX + 1.6, 10, -9.2), 0, (L.lt * 2) % 1.2, 3, 7, .5);
  orb(L.k, V(ZX + .6, 7, -9.2), null, [11, -.2, .14, 44], [10, -.15, .12, 44]); const n = Math.round(lerp(1, 906, k * k)); badge(n > 900 ? 'gold' : 'num', String(n), W / 2, H * .15, 1, 1, 1.1); }, [[0, 'coins', .5], [.5, 'coins', .45], [1.0, 'coins', .45], [1.3, 'cash', .4]]);
// 64 «die Kalle je gemacht hat,»: Kalle escupe una moneda que cae dentro del bote
shot(99.98, 'C', null, L => { use('ZI'); inside(); ZI.JAR.userData.set(.86); const b = beast(KALLE, ZX - 1.2, 5.25, -9, .9, .62); const t = L.lt % .55; b.pose(L.T, { up: t < .2, face: { eyes: t < .2 ? 'wide' : 'happy', mouth: t < .2 ? 'open' : 'smile' } });
  coinPop(V(ZX - .3, 7.4, -9), L.T - t, L.T, 1, (L.lt / .55 | 0), .5); plus(V(ZX - 1.2, 8.6, -9), '+1', t, .9);
  orb(L.k, V(ZX + .2, 6.8, -9), null, [7.4, .35, .12, 42], [6.6, .3, .1, 40]); }, [[0, 'pop', .5], [.55, 'pop', .5], [.9, 'coin_flip', .4]]);
// 65 «und das teuerste Essen im Laden gekauft:»: vacío el bote en el mostrador; la cajera alucina
shot(101.08, 'W', null, L => { use('LA'); inside(); const me = put(ich, LX - 1.4, 0, 1.4, PI); armsK(me, 1); actuar(me, L.lt, [[0, { aRx: 1.6, aRe: .6, aLx: 1.6, aLe: .6, lean: .15 }]], { T: L.T }); grin(me, L.T);
  const v = put(verk, LX + .6, 0, -5.2, .1); actuar(v, L.lt, [[0, 'idle'], [.5, 'shock', { dur: .25 }]], { T: L.T }); cara(v, L.T, { expr: L.lt > .5 ? 'shock' : 'happy', mouth: L.lt > .5 ? 'o' : 'smile' });
  coinRain(V(LX - .6, 4.4, -2), L.T, 30, 3, 2, 3, .5); cm([LX - 6, 8, 9, LX - .4, 4, -3, 48], [LX - 5.4, 7.6, 8, LX - .4, 4, -3, 48], L.k); }, [[0, 'money_rain', .55], [.5, 'gasp_f', .45], [.9, 'cash_reg', .5]]);
// 66 «den goldenen Käse.» (zoom lento): el queso dorado en su pedestal, con rayos y foco
shot(103.31, null, 'slow', L => { use('LA'); inside(); LA.rays.rotation.z = L.T * .4; LA.KAESE.rotation.y = .6 + Math.sin(L.T * .8) * .5; LA.KAESE.rotation.x = .25; LA.KAESE.position.y = 6.4 + Math.sin(L.T * 2) * .15;
  orb(L.k, V(LX, 7, -10), null, [16, .02, .06, 46], [10, .02, .04, 40]); }, [[0, 'choir', .5], [.2, 'sparkle', .45]]);
// 67 «Ich hab tief Luft geholt»: en el campo, con el queso en la mano, cierro los ojos y respiro
shot(104.60, 'Z', null, L => { field(); const me = put(ich, FX, 0, 0, PI + .1); armsK(me, 1); const br = Math.sin(clamp(L.lt / 1.05) * PI); applyPose(me, { aRx: .35, aRe: .4, aRz: .25, lean: -.12 * br, headX: -.25 * br, aLz: .2 + .3 * br, aLx: .3 }); cara(me, L.T, { eyes: 'closed', mouth: br > .5 ? 'o' : 'flat', noBlink: 1 });
  attach(FOODS.kaese, me.aR.hand, [0, -.6, .2], [0, 0, 0], .32); orb(L.k, V(FX, 4.2, 0), null, [11, PI + .85, .06, 42], [10, PI + .8, .04, 40]); sh(V(FX, 0, 0), 30); }, [[0, 'breath', .55], [.5, 'wind', .3]]);
// 68 «und geworfen.»: el lanzamiento con todo, destello y estela dorada
shot(105.69, 'F', null, L => { field(); const k = clamp(L.lt / .45); const me = thrower(ich, FX, 0, PI, k, 'kaese', .55); armsK(me, 1); cara(me, L.T, { expr: 'angry', mouth: 'teeth' }); if (k < .62) attach(FOODS.kaese, me.aR.hand, [0, -.6, .2], [0, 0, 0], .32);
  if (k >= .62) { const f = clamp((L.lt - .28) / 1.0), p = arc([FX + .8, 6, -.6], [FX, 120, -400], 40, f); cheeseFly(p, L.T, 1.2, V(0, .3, -1).normalize()); dust(V(FX, 0, 0), .3, L.lt, 8, .5); }
  orb(L.k, V(FX, 4, 0), null, [14, PI - .8, .05, 46], [13, PI - .85, .04, 46]); sh(V(FX, 0, 0), 30); }, [[.12, 'strain', .5], [.28, 'throw', .7], [.3, 'fire_whoosh', .6], [.5, 'sparkle', .45]]);
// 69–74 el viaje del queso: bosque, desierto, volcán, feria embrujada, nubes, tierra del sol negro
shot(106.69, 'W', null, L => { use('WA'); day(); const p = V(WAX + 4, 34 - L.lt * 2, 30 - L.lt * 60); cheeseFly(p, L.T, 1.8); cam([p.x + 12, p.y + 5, p.z + 10], [p.x - 1, p.y - 4, p.z - 6], 54); sh(V(WAX, 0, p.z - 20), 80); }, [[0, 'whoosh', .55], [.3, 'birds', .4], [.8, 'leaves', .35]]);
shot(107.88, 'W', null, L => { use('WU'); day(); setSky([.3, .55, .95], [.75, .8, .9], [1, .86, .62]); scene.fog.color.setRGB(1, .9, .7); const p = V(WUX - 2, 12, 40 - L.lt * 70); cheeseFly(p, L.T, 1.8); cam([p.x + 3, 17, p.z + 18], [p.x, 8, p.z - 16], 52); sh(V(WUX, 0, p.z), 80); }, [[0, 'whoosh', .55], [.3, 'wind', .45]]);
shot(108.77, 'W', null, L => { use('VU'); day(); setSky([.2, .06, .08], [.6, .2, .1], [1, .45, .2]); scene.fog.color.setRGB(.5, .2, .12); scene.fog.density = .0016; sun.color.setRGB(1, .55, .3); BIRDSON = 0; VU.SMK.forEach((s, i) => s.position.y = 100 + ((L.T * 8 + i * 9) % 140));
  const p = V(VUX, 112, -40 - L.lt * 70); cheeseFly(p, L.T, 2); cam([p.x - 8, p.y + 12, p.z + 30], [p.x, p.y - 22, p.z - 40], 54); sh(V(VUX, 0, -150), 120); }, [[0, 'fire_roar', .55], [.3, 'fire_whoosh', .45], [.6, 'rubble', .3]]);
shot(109.57, 'S', null, L => { use('JM'); night(); setSky([.04, .0, .08], [.16, .04, .22], [.3, .1, .36]); scene.fog.color.setRGB(.2, .06, .26); JM.WH.rotation.z = L.T * .25; JM.GH.forEach((g, i) => { g.position.y = 18 + (i % 3) * 6 + Math.sin(L.T * 2 + i) * 2; g.rotation.y = L.T + i; });
  const p = V(JMX - 2, 30, 40 - L.lt * 50); cheeseFly(p, L.T, 1.8); cam([p.x + 16, 24, p.z + 14], [JMX - 20, 28, p.z - 40], 56); sh(V(JMX, 0, p.z), 80); }, [[0, 'whoosh', .5], [.2, 'musicbox2', .4], [.8, 'evil_laugh', .35], [1.4, 'owl', .3]]);
shot(111.44, 'Z', null, L => { use('WO'); day(); setSky([.3, .6, 1], [.6, .8, 1], [.95, .97, 1]); scene.fog.color.setRGB(.95, .97, 1); scene.fog.density = .003; BIRDSON = 0; const p = V(WOX, 4, 30 - L.lt * 80); cheeseFly(p, L.T, 1.6); cam([p.x + 3, p.y + 2, p.z + 14], [p.x, p.y, p.z - 10], 56); }, [[0, 'whoosh_soft', .5], [.3, 'wind', .45]]);
shot(112.36, null, 'slow', L => { use('SW'); night(); setSky([.08, 0, .18], [.36, .06, .5], [.8, .2, .7]); scene.fog.color.setRGB(.3, .05, .4); scene.fog.density = .0016; sky.moon.visible = false; SW.SUN.rotation.z = L.T * .1;
  const p = V(SWX, 40 + L.lt * 6, -20 - L.lt * 45); cheeseFly(p, L.T, 1.8, V(0, .1, -1).normalize()); cam([p.x + 4, p.y + 1, p.z + 22], [SWX, 90, -380], 58); }, [[0, 'drone', .5], [.5, 'creepy_ting', .4], [1.5, 'hum_low', .4]]);
// ---------- d: la espera, el temblor, el Strawberry Elephant de oro, la riqueza y el giro final (115,2 – 161,4 s) ----------
// ojos gigantes tras las montañas (iris ámbar, pupila negra, párpados para parpadear)
const EYES = (() => { const g = new THREE.Group(); scene.add(g); const lids = []; for (const s of [-1, 1]) { const e = new THREE.Group(); e.position.x = s * 1.4; g.add(e); const w = sphere(1, new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 2.2, 1.4), toneMapped: false, fog: false }), e, 0, 0, 0, 24, 16); w.scale.set(1, .62, .3);
  const ir = sphere(.42, new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 1.3, .2), toneMapped: false, fog: false }), e, 0, 0, .22, 18, 12); ir.scale.z = .3; const pu = sphere(.2, new THREE.MeshBasicMaterial({ color: 0x000000, fog: false }), e, 0, 0, .32, 14, 10); pu.scale.set(.55, 1.2, .3);
  lids.push(e); } g.userData.blink = k => lids.forEach(e => e.scale.y = Math.max(.04, 1 - k)); return g; })();
const PILE = (() => { const g = new THREE.Group(); scene.add(g); const m = sphere(6, GOLD(), g, 0, -1.4, 0, 28, 14); m.scale.set(1, .55, 1); for (let i = 0; i < 46; i++) { const r = RNG(i + 3); const a = r() * 6.283, rr = r() * 5.4; const c = cyl(.55, .55, .14, GOLD(), 16, g, Math.cos(a) * rr, Math.max(.2, 1.9 * Math.sqrt(Math.max(0, 1 - (rr / 6) ** 2)) - 1.2) + .3, Math.sin(a) * rr); c.rotation.set(r() * 2, r() * 6, r() * 2); } outline(g, 1.4); return g; })();
const CROWN = (() => { const g = new THREE.Group(); scene.add(g); cyl(.78, .72, .5, GOLD(), 20, g, 0, 0, 0); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; const s = new THREE.Mesh(new THREE.ConeGeometry(.2, .55, 6), GOLD()); s.position.set(Math.cos(a) * .7, .48, Math.sin(a) * .7); g.add(s); sphere(.11, mat(0xff2a4a, { roughness: .2 }), g, Math.cos(a) * .76, .05, Math.sin(a) * .76, 8, 6); } outline(g, 1.4); return g; })();
const POND = (() => { const g = new THREE.Group(); scene.add(g); cyl(5.4, 5.6, 1.4, GOLD(), 32, g, 0, .7, 0); const w = cyl(5, 5, .12, new THREE.MeshStandardMaterial({ color: 0xffd23f, metalness: .6, roughness: .12, emissive: 0x8a6a00, emissiveIntensity: .6 }), 32, g, 0, 1.3, 0); for (let i = 0; i < 30; i++) { const r = RNG(i * 3 + 1), a = r() * 6.283, rr = r() * 4.4; const c = cyl(.45, .45, .12, GOLD(), 14, g, Math.cos(a) * rr, 1.4, Math.sin(a) * rr); c.rotation.set(r() * .6, r() * 6, r() * .6); }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, .35, 10, 24), mat(0xff4a6a, { roughness: .4 })); ring.rotation.x = Math.PI / 2; ring.position.y = 1.5; g.add(ring); g.userData.ring = ring; outline(g, 1.4); return g; })();
PROPS.push(EYES, PILE, CROWN, POND);
const shadesK = (() => { const g = new THREE.Group(); scene.add(g); box(1.25, .1, .1, mat(0x111111), .02, g, 0, 0, 0); for (const s of [-1, 1]) box(.5, .32, .08, mat(0x111111, { roughness: .1, metalness: .6 }), .04, g, s * .32, -.12, 0); return g; })(); PROPS.push(shadesK);
const nightField = () => { use('FE'); night(); };
// 75 «Dann Stille.»: el campo vacío, yo solo y Kalle, el viento
shot(115.15, 'I', null, L => { field(); const me = put(ich, FX, 0, -2, PI); armsK(me, 1); actuar(me, L.lt, [[0, { headX: -.3, aLz: .1, aRz: .1 }]], { T: L.T }); cara(me, L.T, { expr: 'neutral', look: [0, .4] }); beast(KALLE, FX + 2.2, 0, -1.6, PI + .3).pose(L.T, { headX: -.3 });
  orb(L.k, V(FX + .6, 2.8, -2), null, [22, PI - .6, .3, 46], [24, PI - .55, .34, 46]); sh(V(FX, 0, -2), 30); }, [[0, 'wind', .55], [.4, 'silence_tick', .35]]);
// 76 «Eine Stunde.»: sentado en la hierba
shot(115.95, 'C', null, L => { field(); dayNight(.9); const me = put(ich, FX, 0, -2, PI + .3); armsK(me, 1); applyPose(me, { hipY: .95, lLx: 1.5, lRx: 1.5, lLk: 1.9, lRk: 1.9, aLx: .9, aRx: .9, aLe: 1.2, aRe: 1.2, aLz: -.2, aRz: -.2, headX: -.25, lean: .15 }); cara(me, L.T, { expr: 'bored', look: [0, .5] });
  beast(KALLE, FX + 2, 0, -1, PI + .4).pose(L.T, { face: { eyes: 'half' } }); orb(L.k, V(FX + .6, 2, -1.6), null, [12, PI - .7, .12, 44], [11, PI - .75, .1, 44]); sh(V(FX, 0, -2), 30); badge('big', '1 STUNDE', W / 2, H * .15, (L.lt - .05) * 3, 1, .95); }, [[0, 'clock_tick', .5], [.4, 'clock_tick', .5]]);
// 77 «Zwei Stunden.»: tumbado boca arriba, el cielo se pone naranja
shot(116.73, 'C', null, L => { field(); setSky([.3, .4, .8], [.9, .6, .5], [1, .7, .4]); sun.color.setRGB(1, .75, .5); const me = lieOn(ich, FX, .6, 1.6, 0, 0); armsK(me, 1); cara(me, L.T, { expr: 'bored', mouth: 'flat', look: [0, -.5] });
  beast(KALLE, FX + 2.2, 0, -1, PI + .6).pose(L.T, { face: { eyes: 'closed' } }); orb(L.k, V(FX, 1, -.6), null, [12, .3, .85, 46], [11, .25, .88, 46]); sh(V(FX, 0, -1), 30); badge('big', '2 STUNDEN', W / 2, H * .15, (L.lt - .05) * 3, 1, .95); }, [[0, 'clock_tick', .5], [.4, 'clock_tick', .5], [.6, 'sigh_kid', .4]]);
// 78 «Nichts.»: el cielo vacío, de cerca mi cara triste
shot(117.55, 'Z', null, L => { field(); setSky([.3, .4, .8], [.9, .6, .5], [1, .7, .4]); const me = put(ich, FX, 0, -2, PI + .2); armsK(me, 1); actuar(me, L.lt, [[0, { headX: .15, lean: .1, aLz: .04, aRz: .04 }]], { T: L.T }); cara(me, L.T, { expr: 'sad', mouth: 'frown' });
  orb(L.k, V(FX, 4.4, -2), null, [8, PI + .3, .04, 40], [7.2, PI + .28, .03, 38]); sh(V(FX, 0, -2), 20); }, [[0, 'sad_tone', .45], [.3, 'wind', .4]]);
// 79 «Plötzlich fing der Boden an zu beben.»: todo tiembla, me levanto de golpe
shot(118.18, 'W', null, L => { field(); SHAKE = .55; const me = put(ich, FX, 0, -2, PI + .2); armsK(me, 1); actuar(me, L.lt, [[0, 'brace'], [.6, 'shock', { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'scared', mouth: 'o' });
  const b = beast(KALLE, FX + 2.2, Math.abs(Math.sin(L.T * 18)) * .4, -1.4, PI + .3); b.pose(L.T, { face: { eyes: 'wide', mouth: 'open' } }); dust(V(FX - 1, 0, -7), Math.floor(L.lt / .5) * .5, L.lt, 8, .35);
  orb(L.k, V(FX + .8, 3.4, -2), null, [14, PI - .5, .12, 46], [13, PI - .55, .1, 46]); sh(V(FX, 0, -2), 30); }, [[0, 'rumble', .6], [.4, 'rubble', .5], [1.0, 'machine_shake', .45], [1.4, 'gasp', .4]]);
// 80–82 «Bumm, bumm, bumm!»: la calle, el baño y la casa del alcalde saltan con cada golpe
shot(119.98, 'C', 'punch', L => { street(); SHAKE = 1 - clamp(L.lt / .5); const c = put(K[0], 0, Math.max(0, .8 - L.lt * 3), 2, 0); actuar(c, L.lt, [[0, 'shock'], [.2, 'cower', { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'scared', mouth: 'o' }); beast(TG[0], 3.4, Math.max(0, 1.2 - L.lt * 4), -1, -.3).pose(L.T, { face: { eyes: 'wide', mouth: 'open' } });
  orb(L.k, V(1.4, 3.6, 0), null, [14, .2, .12, 46], [13, .18, .1, 46]); sh(V(0, 0, 0), 30); }, [[0, 'boom', .7], [.15, 'glass_rattle', .45]]);
shot(120.53, 'C', 'punch', L => { use('BA'); inside(); SHAKE = 1 - clamp(L.lt / .5); const b = beast(FR, BX - .8, 2.5 + Math.max(0, 1.4 - L.lt * 4), -6, PI / 2, .7); b.pose(L.T, { sit: 1, neckX: -.5, face: { eyes: 'wide' } }); BA.foam.position.y = Math.max(0, .8 - L.lt * 2);
  cm([BX + 9, 11, 3, BX + 2, 5.4, -6, 46], [BX + 8.4, 10.8, 2.4, BX + 2, 5.4, -6, 46], L.k); }, [[0, 'boom', .7], [.05, 'splash', .55]]);
shot(121.05, 'C', 'punch', L => { use('KS'); day(); SHAKE = 1 - clamp(L.lt / .5); const m = put(mayor, CX + 2.4, 0, 3, -.4); actuar(m, L.lt, [[0, 'shock']], { T: L.T }); cara(m, L.T, { expr: 'shock', mouth: 'o' }); const b = beast(TR, CX - 3.6, 0, 3, .5); b.pose(L.T, { open: .6, face: { eyes: 'wide' } });
  orb(L.k, V(CX - .4, 4, 3), null, [17, .1, .14, 46], [16, .08, .12, 46]); sh(V(CX, 0, 3), 30); }, [[0, 'boom', .75], [.1, 'gasp', .4]]);
// 83 «Irgendwas flog über die Berge.»: un destello dorado sobre las montañas; yo lo señalo
shot(121.58, 'W', null, L => { field(); const p = V(FX - 40 + L.lt * 30, 60 + Math.sin(L.T * 2) * 3, -200 + L.lt * 10); const b = beast(EG, p.x, p.y, p.z, 1.2, 5); b.pose(L.T, { fly: 1 });
  const me = put(ich, FX + 1.6, 0, -9, PI - .4); armsK(me, 1); actuar(me, L.lt, [[0, 'point']], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'o' }); badge3('q', '!', p.clone().add(V(0, 26, 0)), (L.lt - .4) * 3, .8);
  cam([FX - 2, 4.5, -2], [FX - 14, 40, -200], 52); sh(V(FX, 0, 0), 30); }, [[0, 'whoosh_up', .45], [.3, 'sparkle', .5], [.9, 'jet', .4]]);
// 84 «Ein Strawberry Elephant aus purem Gold,» (zoom lento): el elefante de fresa de oro con alas, acercándose
shot(123.24, null, 'slow', L => { field(); const b = beast(EG, FX, 18 + Math.sin(L.T * 2) * 1.2, -40 + L.lt * 6, .15, 1.5); b.pose(L.T, { fly: 1, trunkUp: 1, face: { eyes: 'open' } });
  orb(L.k, V(FX, 18 + 7.5 * 1.5, -40 + L.lt * 6), null, [44, .25, -.05, 50], [34, .2, -.08, 46]); rareTag(b, 'OG', (L.lt - .9) * 3, 12); }, [[0, 'choir', .5], [.4, 'sparkle', .5], [1.2, 'wind', .4], [2.0, 'magic_hit', .4]]);
// 85 «größer als unsere ganze Schule.»: pasa volando por encima del colegio
shot(125.84, 'S', null, L => { street(); const b = beast(EG, -20 + L.lt * 22, 42, -236 + 6, PI / 2 - .3, 4.2); b.pose(L.T, { fly: 1 });
  cam([4, 4, -150], [0, 30, -236], 52); sh(V(0, 0, -230), 80); badge('big', 'GRÖSSER ALS DIE SCHULE', W / 2, H * .14, (L.lt - .3) * 3, 1, .6); }, [[0, 'jet', .5], [.4, 'wind', .45], [1.0, 'aah', .4]]);
// 86 «Er landete direkt vor mir»: aterriza en el campo con un golpe y polvo
shot(127.68, 'Z', null, L => { field(); const y = Math.max(0, 22 - L.lt * 28); const b = beast(EG, FX - 1, y, -24, .1, 2.2); b.pose(L.T, { fly: y > 0, face: { eyes: 'open' } }); if (y <= 0) { SHAKE = Math.max(0, 1 - (L.lt - .78) * 3); dust(V(FX - 1, 0, -24), .78, L.lt, 16, 1.6); }
  const me = put(ich, FX + 4, 0, -2, PI + .5); armsK(me, 1); actuar(me, L.lt, [[0, 'shock'], [.8, 'recoil', { dur: .2 }]], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'o' });
  cam([FX + 13, 6, 8], [FX - 1, 9, -20], 52); sh(V(FX, 0, -14), 40); }, [[0, 'whoosh_down', .5], [.78, 'impact', .8], [.8, 'rubble', .5], [1.0, 'gasp', .4]]);
// 87 «und verbeugte sich.»: se inclina ante mí; yo con la boca abierta
shot(129.02, 'C', null, L => { field(); const bw = easeInOut(clamp((L.lt - .1) / .6)); const b = beast(EG, FX - 1, 0, -22, .1, 2.2); b.pose(L.T, { bow: bw, face: { eyes: bw > .5 ? 'closed' : 'open' } });
  const me = put(ich, FX + 3.6, 0, -4, PI + .3); armsK(me, 1); actuar(me, L.lt, [[0, 'shock'], [.7, 'hands_face', { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'o' });
  cam([FX + 17, 8, 6], [FX, 7.5, -16], 50); sh(V(FX, 0, -14), 40); }, [[.1, 'growl', .4], [.4, 'choir', .45], [.8, 'gasp', .4]]);
// 88 «Über die ganze Straße regnete es Münzen.»: lluvia de monedas, todos celebran
shot(130.28, 'F', null, L => { street(); OR.FEST.visible = true; coinRain(V(0, 0, -10), L.T, 40, 14, 14, 22, .8); const P = [[K[1], -3, -4], [XT[1], 2.6, -6], [K[5], -1, -10], [oma, 4.6, -12], [K[3], -5, -12]];
  P.forEach(([c, x, z], i) => { put(c, x, Math.abs(Math.sin(L.T * 5 + i)) * .5, z, Math.sin(i) * .3); actuar(c, L.lt, [[0, 'cheer']], { T: L.T + i }); grin(c, L.T + i); });
  cm([0, 5, 12, 0, 6, -8, 50], [0, 4.4, 9, 0, 6.4, -8, 48], L.k); sh(V(0, 0, -8), 30); }, [[0, 'money_rain', .6], [.4, 'cheer', .5], [1.2, 'coins', .45], [1.8, 'cheer', .4]]);
// 89 «Ich war das reichste Kind der Stadt.»: en lo alto de una montaña de oro, con corona y gafas de sol
shot(132.75, 'W', null, L => { street(); show(PILE, 0, 0, -6, L.T * .1, 1); const me = put(ich, 0, 2.3, -6, .1); armsK(me, 1); actuar(me, L.lt, [[0, 'cheer']], { T: L.T }); grin(me, L.T); attach(CROWN, me.head, [0, 1.55, 0], [0, 0, .08], 1); attach(shadesK, me.head, [0, .85, .66], [0, 0, 0], 1);
  coinRain(V(0, 0, -6), L.T, 24, 10, 10, 18, 1.1); beast(EG, -9, 0, -26, .4, 1.4).pose(L.T, { trunkUp: 1 });
  orb(L.k, V(0, 5.6, -6), null, [17, .15, .12, 46], [15, .12, .1, 46]); sh(V(0, 0, -8), 30); badge('gold', 'REICHSTES KIND', W / 2, H * .14, (L.lt - .3) * 3, 1, .75); }, [[0, 'cash_reg', .5], [.3, 'coins', .5], [.9, 'cheer', .4], [1.5, 'sparkle', .45]]);
// 90 «Und Kalle bekam seinen eigenen goldenen Teich.»: Kalle flota en su estanque de oro con flotador y gafas
shot(134.65, 'R', null, L => { garden(); show(POND, TX - 4, 0, 0, 0, 1); const b = beast(KALLE, TX - 4, .3 + Math.sin(L.T * 2) * .15, 0, .3, 1); b.pose(L.T, { face: { eyes: 'happy', mouth: 'grin' } }); b.root.rotation.z = Math.sin(L.T * 1.5) * .08; attach(shadesK, b.head, [0, .78, .62], [0, 0, 0], .9);
  sparks_(V(TX - 4, 2, 0), L.T); orb(L.k, V(TX - 4, 2.6, 0), null, [13, .5, .3, 44], [11.5, .45, .28, 42]); sh(V(TX - 4, 0, 0), 30); badge('gold', 'GOLDENER TEICH', W / 2, H * .14, (L.lt - .4) * 3, 1, .75); }, [[0, 'water_bloop', .5], [.4, 'sparkle', .5], [1.2, 'splash', .35], [1.8, 'toy', .35]]);
function sparks_(c, T) { CONF.forEach((f, i) => { if (i >= 20) return; const r = RNG(i * 3 + 2), k = (T * .6 + r()) % 1; f.visible = true; f.position.set(c.x + (r() - .5) * 9, c.y + k * 6, c.z + (r() - .5) * 9); f.rotation.set(T * 3 + i, T * 2, 0); f.scale.setScalar(.6); }); }
// 91 «Aber in der Nacht hörte ich ein seltsames Pfeifen am Himmel.» (zoom lento): de noche en la calle, escucho mirando arriba
shot(137.57, null, 'slow', L => { street(); night(); const me = put(ich, 0, 0, 4, .15); armsK(me, .5); actuar(me, L.lt, [[0, 'idle'], [.6, { ...GEST.listen, headX: -.45 }, { dur: .5 }]], { T: L.T }); cara(me, L.T, { expr: 'worried', mouth: 'flat', look: [0, -.6] });
  orb(L.k, V(0, 4.2, 4), null, [12, .3, -.12, 44], [9, .25, -.1, 40]); sh(V(0, 0, 4), 30); }, [[0, 'crickets', .4], [.6, 'whistle', .55], [1.8, 'whistle', .6]]);
// 92 «Bumm!»: destello e impacto en la plaza
shot(140.69, 'F', 'punch', L => { use('MA'); night(); const k = clamp(L.lt / .25); show(GIANT.karotte, MX + 4, lerp(60, 30, k), -24, 0, 30).rotation.set(0, 0, .25); dust(V(MX + 4, 0, -24), .2, L.lt, 20, 3); grade.uniforms.flash.value = Math.max(0, .8 - L.lt * 2);
  cam([MX - 6, 8, 40], [MX + 2, 20, -20], 54); sh(V(MX, 0, -10), 60); }, [[0, 'whistle', .4], [.2, 'explosion', .8], [.25, 'rubble', .5]]);
// 93 «Eine riesige Karotte krachte auf den Marktplatz,»: clavada en la plaza junto a la fuente; la gente sale a mirar
shot(141.29, 'W', null, L => { use('MA'); night(); show(GIANT.karotte, MX + 4, 30, -24, 0, 30).rotation.set(0, 0, .25); [[K[0], -6, 10], [XT[1], 2, 12], [K[4], 6, 9]].forEach(([c, x, z], i) => { put(c, MX + x, 0, z, PI - .1); actuar(c, L.lt, [[0, 'shock']], { T: L.T + i }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); });
  cm([MX - 4, 6, 34, MX + 2, 22, -20, 56], [MX - 6, 5, 30, MX + 2, 26, -20, 56], L.k); sh(V(MX, 0, 0), 60); }, [[0, 'rubble', .5], [.6, 'murmur', .4], [1.4, 'gasp', .4], [2.2, 'siren', .3]]);
// 94 «so hoch wie ein Wolkenkratzer.»: panorámica vertical: la zanahoria junto a los rascacielos
shot(144.09, 'S', null, L => { use('MA'); night(); show(GIANT.karotte, MX + 4, 30, -24, 0, 30).rotation.set(0, 0, .25); const k = easeInOut(L.k);
  cam([MX + 16, 4, 26], [MX + 4, lerp(10, 70, k), -40], 58); sh(V(MX, 0, -20), 80); badge('big', 'WOLKENKRATZER', W / 2, H * .14, (L.lt - .8) * 3, 1, .7); }, [[0, 'whoosh_up', .5], [.5, 'wind', .45], [1.2, 'ding_reveal', .4]]);
// 95 «Dann ein Apfel.»: cae una manzana gigante
shot(145.93, 'C', 'punch', L => { use('MA'); night(); const k = clamp(L.lt / .3); show(GIANT.apfel, MX - 30, lerp(80, 22, easeIn(k)), -10, L.T * .3, 22); if (k >= 1) { dust(V(MX - 30, 0, -10), .3, L.lt, 16, 2.6); SHAKE = Math.max(0, 1 - (L.lt - .3) * 3); }
  show(GIANT.karotte, MX + 4, 30, -24, 0, 30).rotation.set(0, 0, .25); cam([MX - 10, 6, 40], [MX - 22, 18, -10], 54); sh(V(MX - 20, 0, -10), 60); }, [[0, 'whistle', .4], [.3, 'impact', .8], [.35, 'rubble', .5]]);
// 96 «Dann ein Steak, so groß wie ein Fußballfeld.»: un filete enorme tapa todo el campo de lanzamiento
shot(147.04, 'W', null, L => { nightField(); const k = clamp(L.lt / .4); show(GIANT.steak, FX, lerp(60, 5, easeIn(k)), -50, .3, 32); if (k >= 1) { dust(V(FX, 0, -50), .4, L.lt, 16, 4); SHAKE = Math.max(0, 1 - (L.lt - .4) * 3); }
  const q = easeInOut(L.k); cam([FX + 40, lerp(50, 70, q), lerp(60, 40, q)], [FX, 0, -50], 58); sh(V(FX, 0, -50), 100); badge('big', 'FUSSBALLFELD', W / 2, H * .14, (L.lt - 1.2) * 3, 1, .7); }, [[0, 'whistle', .4], [.4, 'explosion', .8], [.5, 'rubble', .5], [1.6, 'wind', .4]]);
// 97 «Alle liefen langsam darauf zu.»: la gente camina despacio hacia la zanahoria gigante
shot(149.97, 'Z', null, L => { use('MA'); night(); show(GIANT.karotte, MX + 4, 30, -24, 0, 30).rotation.set(0, 0, .25); const P = [K[0], XT[1], K[4], lehrer, K[7], XT[3], oma];
  P.forEach((c, i) => { const r = RNG(i * 5 + 1); r(); caminar(c, L.lt, { x: MX - 8 + (i % 4) * 3, z: 30 - (i >> 2) * 4 + r() * 2, ry: PI + .2, speed: 1.6, accel: .01, T: L.T + i }); grin(c, L.T + i, { eyes: 'happy' }); });
  cm([MX - 9, 5.5, 47, MX + 1, 14, -24, 54], [MX - 9, 5.2, 44, MX + 1, 15, -24, 54], L.k); sh(V(MX - 10, 0, 10), 50); }, [[0, 'steps_heavy', .4], [.6, 'steps', .4], [1.2, 'steps_heavy', .4], [1.5, 'murmur', .3]]);
// 98 «Lächelnd.»: caras sonrientes de cerca, iluminadas en naranja
shot(151.85, 'C', null, L => { use('MA'); night(); const P = [[K[0], -1.8], [XT[1], 0], [K[4], 1.8]]; P.forEach(([c, x], i) => { put(c, MX + x, 0, 10 - Math.abs(x) * .4, 0); applyPose(c, { headZ: (i - 1) * .12 }); cara(c, L.T, { eyes: 'happy', mouth: 'grin', noBlink: 1 }); });
  FILL.color.setRGB(1, .6, .3); orb(L.k, V(MX, 4.8, 10), null, [9, 0, .02, 44], [8, 0, .01, 42]); sh(V(MX, 0, 10), 30); }, [[0, 'creepy_ting', .5], [.3, 'heartbeat', .45]]);
// 99 «Da hab ich es kapiert:» (zoom lento): mi cara al entenderlo
shot(152.49, null, 'slow', L => { street(); night(); const me = put(ich, 0, 0, 4, .1); armsK(me, 1); actuar(me, L.lt, [[0, 'shock']], { T: L.T }); cara(me, L.T, { expr: 'scared', mouth: 'o', noBlink: 1 });
  orb(L.k, V(0, 4.4, 4), null, [10, .15, .02, 42], [7, .1, .02, 36]); sh(V(0, 0, 4), 20); }, [[0, 'heartbeat', .5], [.6, 'heartbeat', .5]]);
// 100 «Wir waren nicht die Einzigen, die Essen werfen.»: plano aéreo: la plaza con la comida gigante clavada como en nuestro campo
shot(153.66, 'W', null, L => { use('MA'); night(); show(GIANT.karotte, MX + 4, 30, -24, 0, 30).rotation.set(0, 0, .25); show(GIANT.apfel, MX - 30, 22, -10, 0, 22); const q = easeInOut(L.k);
  cam([MX + 10, lerp(90, 140, q), lerp(90, 110, q)], [MX - 8, 0, -16], 56); sh(V(MX, 0, -10), 120); }, [[0, 'whoosh_up', .5], [.5, 'drone', .45], [1.4, 'tension_str', .45]]);
// 101 «Und irgendwo hinter den Bergen»: las montañas de noche bajo la luna
shot(155.85, 'S', null, L => { nightField(); const q = easeInOut(L.k); cam([FX + lerp(-10, 10, q), 6, 10], [FX, 50, -300], 52); sh(V(FX, 0, -40), 60); }, [[0, 'wind', .5], [.6, 'owl', .4], [1.2, 'drone', .4]]);
// 102 «wartet etwas sehr, sehr Großes» (zoom lento): dos ojos gigantes se abren detrás de las montañas
shot(157.47, null, 'slow', L => { nightField(); const up = easeOut(clamp(L.lt / 1.2)); show(EYES, FX + 6, lerp(40, 110, up), -300, 0, 34); EYES.userData.blink(1 - clamp((L.lt - .6) / .5));
  orb(L.k, V(FX + 4, 70, -300), null, [330, 0, -.12, 46], [270, 0, -.13, 40]); }, [[0, 'drone', .5], [.6, 'growl', .55], [1.4, 'heartbeat', .5]]);
// 103 «darauf, wer angerannt kommt.»: yo delante, aterrado; detrás, los ojos gigantes miran
shot(159.73, 'Z', null, L => { nightField(); show(EYES, FX + 6, 110, -300, 0, 34); EYES.userData.blink(L.lt > 1.2 && L.lt < 1.35 ? 1 : 0); const me = put(ich, FX, 0, 0, .1); armsK(me, 1); actuar(me, L.lt, [[0, 'brace']], { T: L.T }); cara(me, L.T, { expr: 'scared', mouth: 'o', noBlink: 1 });
  cam([FX + 1, 3.2, 12], [FX + 2, 16, -60], 56); sh(V(FX, 0, 0), 30); }, [[0, 'impact_soft', .5], [.3, 'heartbeat', .55], [1.0, 'growl', .5]]);
// ---------- portadas (fuera del vídeo): yo lanzando el queso dorado, los Tiere corriendo hacia mí y el elefante de oro en el cielo ----------
function coverTxt(l1, l2) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * .43, 112, '#ffffff'], [l2, H * .49, 92, '#E2FD07']]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .84 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .24; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }
window.renderCover = v => { const T = 3.3; hideAll(); BAD_.length = 0; field(); BIRDSON = 0; FE.arch.visible = false;
  const me = put(ich, FX, 0, -12, .1); armsK(me, .9); applyPose(me, { aRx: 2.7, aRz: .35, aRe: .2, aLx: .7, aLz: .5, aLe: .5, lean: -.08, lLx: .25, lRx: -.2, headX: -.25 }); cara(me, T, { eyes: 'wide', mouth: 'grin', noBlink: 1 });
  me.root.updateMatrixWorld(true); const hp_ = me.aR.hand.getWorldPosition(V(0, 0, 0)); show(FOODS.kaese, hp_.x - .2, hp_.y + 1.6, hp_.z + .3, .5, .8); FOODS.kaese.rotation.x = .3;
  beast(EG, FX, 19, -56, .2, 1.6).pose(1.1, { fly: 1, trunkUp: 1, face: { eyes: 'open' } });
  beast(TG[0], FX - 5.2, 0, -23, .35).pose(.6, { walk: 1, face: { eyes: 'wide', mouth: 'open' } }); beast(CH, FX + 5.4, 0, -22, -.35).pose(1.3, { cheer: 1, face: { eyes: 'happy', mouth: 'grin' } });
  beast(NB[1], FX - 3.3, 0, -9.4, .3).pose(.2, { wave: 1, face: { eyes: 'happy', mouth: 'grin' } }); beast(LI[0], FX + 3.5, 0, -10, -.35).pose(.9, { trunkUp: 1, face: { eyes: 'wide' } });
  beast(CA, FX - 10, 0, -32, .4).pose(.4, { stance: 1 }); beast(TR, FX + 10.5, 0, -34, -.5).pose(.4, { walk: 1 });
  coinPop(V(FX + 4.4, 3, -10.6), 0, .55, 5, 0, .8); coinPop(V(FX - 6.4, 5, -22), 0, .7, 5, 6, .8); coinPop(V(FX + 6.2, 5, -21), 0, .45, 5, 12, .8); trail(V(hp_.x, hp_.y + 1.4, hp_.z), V(0, -1, 0), T, 8, .4);
  cam([FX, 6.5, 9], [FX, 9, -30], 64); sh(V(FX, 0, -20), 50);
  grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.blurAmt.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); composer.render(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H);
  for (const b of BAD_) drawBadge(b);
  if (v === 0) coverTxt('IN DIESER STADT', 'KAUFT MAN KEINE TIERE'); else coverTxt('WIRF ESSEN …', '… UND ES GEHÖRT DIR'); };


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
  if (BIRDS.update) BIRDS.update(T, camera.position.clone().addScaledVector(dir, 60).add(V(0, 25, 0)), MODE === 'day' && BIRDSON ? 1 : 0);
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

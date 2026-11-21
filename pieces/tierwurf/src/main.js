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

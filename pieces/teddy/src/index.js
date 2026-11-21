// TEDDY — «In meiner Welt … und der Direktor ist ein Teddybär»: planos sincronizados con audio/words.json (1080×1920, 30 fps).
// Réplica de la estructura del vídeo de referencia (internado-trampa, juicio de clase) con reparto, ciudad y datos propios. Los planos están en src/p/*.js; armar.py los une en src/index.js.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { makeKumpel, makeLena, makeSie, makeEr, makeKassiererin, makeFahrer, makeOma, makeJonas } from './gvolk.js';
import { crowd } from './hsets.js';
import { makeIch, makeMira, makeOllie, makeKoch, makeHackerin, makeZopf, makeStille, makeBiker, makeReich, makeFan, makeSpielerin, makeSchwimmerin, makeMama, makePapa, makeTeddy, racket, skates, laptop, pan, scissors, teddyToy } from './tcast.js';
import { stadt, klasse, turnhalle, flur, zimmer, wohnzimmer, gericht, tennis, kinderzimmer, cage, ballMachine, tball, drum, ticket, photo, lipstick, secCam } from './tsets.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 157.5, U = W / 720;
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
const KLX = 600, THX = 900, FLX = 1200, ZAX = 1500, ZBX = 1700, WZX = 2000, GRX = 2300, TNX = 2700, KZX = 3000;
const ST = stadt(scene), KL = klasse(scene, KLX), TH = turnhalle(scene, THX), FL = flur(scene, FLX), ZA = zimmer(scene, ZAX), ZB = zimmer(scene, ZBX, '#f8d8e8', '#b84a7a', '#ff8ab8'), WZ = wohnzimmer(scene, WZX), GR = gericht(scene, GRX), TN = tennis(scene, TNX), KZ = kinderzimmer(scene, KZX);
ZB.nums.visible = false;
const SETS = { ST: ST.G, KL: KL.g, TH: TH.g, FL: FL.g, ZA: ZA.g, ZB: ZB.g, WZ: WZ.g, GR: GR.g, TN: TN.g, KZ: KZ.g };
for (const k in SETS) outline(SETS[k], 1.4);
// multitud instanciada (gente de la ciudad / alumnos lejanos)
const CRW = crowd(scene, 60); CRW.g.children[3].visible = false;
// ---------- reparto ----------
const ich = makeIch(scene), mira = makeMira(scene), ollie = makeOllie(scene), koch = makeKoch(scene), hack = makeHackerin(scene), zopf = makeZopf(scene), still = makeStille(scene), biker = makeBiker(scene), reich = makeReich(scene), fan = makeFan(scene), spiel = makeSpielerin(scene), schwimm = makeSchwimmerin(scene);
const mama = makeMama(scene), papa = makePapa(scene);
const TOWN = [makeKumpel(scene, 0), makeLena(scene), makeKumpel(scene, 1), makeSie(scene), makeEr(scene), makeKumpel(scene, 4), makeKassiererin(scene), makeOma(scene), makeFahrer(scene), makeJonas(scene)];
kitFace(ich, 'kid'); kitFace(mira, 'girl'); kitFace(ollie, 'hero'); kitFace(koch, 'plain'); kitFace(hack, 'girl'); kitFace(zopf, 'girl'); kitFace(still, 'girl'); kitFace(biker, 'villain'); kitFace(reich, 'plain'); kitFace(fan, 'kid'); kitFace(spiel, 'girl'); kitFace(schwimm, 'girl'); kitFace(mama, 'girl'); kitFace(papa, 'mustache');
TOWN.forEach((c, i) => kitFace(c, ['plain', 'girl', 'hero', 'girl', 'kid', 'girl', 'girl', 'girl', 'plain', 'mustache'][i]));
// los 12 alumnos (orden de los atriles del juicio)
const KIDS = [ich, mira, ollie, koch, hack, zopf, still, biker, reich, fan, spiel, schwimm];
const OTHERS = KIDS.slice(1);
const POOL = [...KIDS, mama, papa, ...TOWN]; POOL.forEach(c => outline(c.root, 2));
const teddy = makeTeddy(scene); outline(teddy.root, 2);
// ---------- atrezo ----------
const RACK = racket(scene), SKATES = skates(mira), LAP = laptop(scene), PAN = pan(scene), SCI = scissors(scene), TOY = teddyToy(scene), CAGE = cage(scene), BM = ballMachine(scene), DRUM = drum(scene), TICK = ticket(scene), PHOTO = photo(scene), LIP = lipstick(scene);
[RACK, LAP, PAN, SCI, TOY, CAGE, BM, DRUM, LIP].forEach(o => outline(o, 1.2));
const BALLS = Array.from({ length: 40 }, () => tball(scene));
const PHONE = (() => { const g = new THREE.Group(); scene.add(g); box(1.0, 1.9, .14, mat(0x1a1a22, { metalness: .5 }), .1, g, 0, 0, 0); return g; })();
const CONF = Array.from({ length: 40 }, (_, i) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(.3, .45), new THREE.MeshBasicMaterial({ color: [0xff4a8a, 0xffd23f, 0x3ab8ff, 0x8ad84a, 0xff8a3a][i % 5], side: THREE.DoubleSide })); scene.add(p); return p; });
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xd8c8a8, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 2 }, () => sphere(.14, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9 }), scene, 0, 0, 0, 10, 8));
const ZZZ = Array.from({ length: 3 }, () => { const p = textPlane(1.2, 1.2, 64, 64, (c, w, h) => { c.font = `700 56px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 8; c.strokeStyle = '#1a1a2a'; c.strokeText('Z', w / 2, h / 2); c.fillStyle = '#ffffff'; c.fillText('Z', w / 2, h / 2); }); p.material.depthWrite = false; scene.add(p); return p; });
const HEARTS = Array.from({ length: 5 }, () => { const p = textPlane(1.2, 1.2, 64, 64, (c, w, h) => { c.font = `700 56px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ff4a8a'; c.fillText('♥', w / 2, h / 2); }); p.material.depthWrite = false; scene.add(p); return p; });
const BEAM = (() => { const m = new THREE.Mesh(new THREE.ConeGeometry(4.4, 26, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff6c8, transparent: true, opacity: .16, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false })); m.geometry.translate(0, -13, 0); scene.add(m); return m; })();
const DARKPLANE = (() => { const m = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshBasicMaterial({ color: 0x000000 })); m.rotation.x = -Math.PI / 2; scene.add(m); return m; })();
const PROPS = [RACK, LAP, PAN, SCI, TOY, CAGE, BM, DRUM, TICK, PHOTO, LIP, PHONE, ...BALLS, ...CONF, ...DUST, ...SWEAT, ...TEAR, ...ZZZ, ...HEARTS, BEAM, DARKPLANE];
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
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.root.parent !== scene) { c.root.parent.remove(c.root); scene.add(c.root); } }
  teddy.root.visible = false; teddy.root.rotation.set(0, 0, 0); teddy.root.scale.setScalar(1); teddy.pose({}); SKATES.forEach(s => s.visible = false);
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  CRW.update(0, 'still', false, 0); SPOTL.intensity = 0; TH.spots.forEach(s => s.intensity = 0); ZA.nums.visible = false; ZA.door.rotation.y = 0; ZB.door.rotation.y = 0; FL.doors.forEach(d => d.rotation.y = 0); TH.trap.hole.visible = false; TH.g.userData.L.intensity = 360; TH.trap.lids.forEach(l => l.rotation.z = 0); KL.note.visible = true; KL.note.rotation.z = 0;
  for (const k in SETS) SETS[k].visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .4; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = 1.08; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; THERM = false; VIDEO = 0; BIRDSON = 1; SHAKE = 0; day(); }
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
  if (!b.on) return; if (b.kind === 'fn') { octx.save(); b.fn(octx); octx.restore(); return; } if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; if (x < -60 || x > W + 60) return; b.x = clamp(x, 200, W - 200); b.y = clamp(y, 150, H * .64); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'num' || b.kind === 'green' || b.kind === 'gold') { c.font = `700 ${b.kind === 'num' ? 74 : 92}px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 600) { const k = 600 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#4a0008' : b.kind === 'green' ? '#04300e' : b.kind === 'gold' ? '#3a2400' : '#0e1226'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#8aff9a'); g.addColorStop(1, '#1ab84a'); } else if (b.kind === 'gold') { g.addColorStop(0, '#fff2a0'); g.addColorStop(1, '#f0a820'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'huss') { c.rotate(-.12); c.font = `700 64px ${FONT}`; c.lineWidth = 16; c.strokeStyle = '#1a1a2a'; c.strokeText(b.text, 0, 0); c.fillStyle = '#ffffff'; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 50px ${FONT}`; const w = c.measureText(b.text).width + 60; c.fillStyle = '#0e1226'; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 42px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'q') { c.font = `700 120px ${FONT}`; c.lineWidth = 18; c.strokeStyle = '#0e1226'; c.strokeText(b.text || '?', 0, 0); c.fillStyle = '#ffd23f'; c.fillText(b.text || '?', 0, 0); }
  c.restore(); }
const KEY = /^(Welt|Weg|töten|Teddybär|nichts|Besten|Eiskunstläuferin|Tennisspieler|Koch|Hackerin|normales|ausgelost|Glück|ich|schwarz|Klassenzimmer|Eisenplatten|Kamera|Zettel|Turnhalle|elf|Mira|nie|Bär|rosa|grau|Krone|Willkommen|immer|Niemand|Tötet|erwischen|lachten|Zopf|Ohr|verboten|Käfig|Boden|niemand|Video|Familie|Leer|Sofas|kreidebleich|Nacht|tauschen|ja|Morgen|Schere|fünf|Zahlen|Lippenstift|3|1|7|0|Klassengericht|recht|Täter|falsch|frei|alle|mich|außer|Kopfhörern|nicht|Foto|Kopf|OLLIE|Ollie|Mira|losgegangen|gewehrt|ausschalten|anhängen|Netzpfosten|Ballmaschine|zweitausend|Hihihi|Nächste|Bett|meins|Bären|Fünf|Jahre|Kinderzimmer|Mörder|vermisse)$/;
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
let VIDEO = 0;
// ciudad (x = 0): calle x ∈ [-8, 8] (z de 90 a -24), aceras a ±14, casas a ±32; verja del internado en z = -24 (rótulo ELITE-INTERNAT a y = 17); patio hasta z = -56; edificio en z = -68 con torre de reloj (0, -62).
// aula (KLX): ventanas blindadas en x = +19,5; pizarra en z = -15,6; pupitres 3×4 en x = -13 + q·8,6, z = -5 + r·7,5 (el mío: desks[5] = q 1, r 1 → (KLX-4,4, 0, 2,5)).
// gimnasio (THX): escenario y = 4,2 de z = -16 a -28, atril en (0, 4,2, -19); trampilla en (0, 0, 2); monitores a ±24.
// pasillo (FLX): puertas a x = ±12,6, z = 6 - i·14. Habitaciones (ZAX mía, ZBX de Mira): cama (-8, -6), escritorio (8, -10), pared de los números z = -12,65, puerta (7, 12,6).
// juicio (GRX): anillo de 12 atriles R = 11 (atril i en ángulo i/12·2π: x = sin·11, z = cos·11, mirando al centro); trono del oso en (0, 5,5, -24).
// tenis (TNX): pista 40×80, red en z = 0, postes en x = ±18,5. Cuarto de niño (KZX): cama en (0, -4).
const town = () => { use('ST'); day(); };
// ---------- a: gancho, la regla, los mejores del país, el sorteo, el aula blindada, el gimnasio y Mira (0 – 45,45 s) ----------
const bear = (x, y, z, ry = 0, p = {}, s = 1) => { teddy.root.visible = true; teddy.root.position.set(x, y, z); teddy.root.rotation.set(0, ry, 0); teddy.root.scale.setScalar(s); teddy.pose(p); return teddy; };
const tedM = (T, a, b) => { const w = spoken(a, b).find(w => T >= w[0] && T < w[1]); if (!w) return .12; const k = (T - w[0]) / Math.max(.08, w[1] - w[0]), n = Math.max(1, Math.round((w[1] - w[0]) / .15)); return .25 + .75 * Math.abs(Math.sin(k * Math.PI * n)); };
const SIT = { lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, hipY: 2.0 };
const walkC = (ch, lt, x, z, ry, sp = 3.4, T, extra) => caminar(ch, lt, { x, z, ry, speed: sp, accel: .05, T, extra });
const lie = (ch, x, y, z, ry = 0) => { put(ch, x, y, z, 0); ch.root.rotation.order = 'YXZ'; ch.root.rotation.set(-PI / 2, ry, 0); return ch; };
const gate = k => ST.gate.forEach((w, i) => w.rotation.y = (i ? -1 : 1) * 1.35 * k);
const inHand = (obj, ch, side = 'R', p = [0, -.55, .35], r = [0, 0, 0], s = 1) => attach(obj, ch[side === 'R' ? 'aR' : 'aL'].hand, p, r, s);
const ring = (i, r = 12.4) => { const a = i / 12 * PI * 2; return [GRX + Math.sin(a) * r, Math.cos(a) * r, a + PI]; };
const atPod = (c, i, L, keys = [[0, 'idle']], face = {}) => { const [x, z, ry] = ring(i); put(c, x, 0, z, ry); actuar(c, L.lt, keys, { T: L.T + i }); cara(c, L.T + i, face); return c; };
const sepia = (v = .8) => { grade.uniforms.sepia.value = v; grade.uniforms.vig.value = .7; };
// atrezo propio de esta parte
const ICE = cyl(9, 9, .16, mat(0xd8f2ff, { roughness: .08, metalness: .2 }), 40, scene); const PANCAKE = (() => { const p = sphere(.7, mat(0xf0c060, { roughness: .8 }), scene, 0, 0, 0, 14, 8); p.scale.y = .25; return p; })();
const FIRE = Array.from({ length: 6 }, (_, i) => sphere(.5, new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 1.2 + i * .1, .2), toneMapped: false, transparent: true, opacity: .8 }), scene, 0, 0, 0, 8, 6));
const NOTE2 = textPlane(1.8, 1.3, 180, 130, (c, w, h) => { c.fillStyle = '#fffbe8'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8e8ff'; for (let y = 30; y < h; y += 22) c.fillRect(0, y, w, 2); txt(c, 'Komm in die', w / 2, h * .38, 26, '#2a1a3a'); txt(c, 'TURNHALLE', w / 2, h * .7, 30, '#d8283a'); }); NOTE2.material.side = THREE.DoubleSide; scene.add(NOTE2);
const MEDAL = (() => { const g = new THREE.Group(); scene.add(g); const m = cyl(.6, .6, .12, mat(0xffd23f, { metalness: .9, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .4 }), 20, g, 0, 0, 0); m.rotation.x = Math.PI / 2; const r = box(.3, 1.4, .05, mat(0xd8283a), .02, g, 0, .9, -.05); return g; })();
const TROPHY = (() => { const g = new THREE.Group(); scene.add(g); const gm = mat(0xffd23f, { metalness: .9, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .3 }); cyl(.5, .7, .4, gm, 14, g, 0, .2, 0); cyl(.12, .12, .8, gm, 8, g, 0, .8, 0); cyl(.8, .3, 1.2, gm, 16, g, 0, 1.8, 0); return g; })();
PROPS.push(ICE, PANCAKE, ...FIRE, NOTE2, MEDAL, TROPHY);

// 1 «In meiner Welt ist der einzige Weg, die Schule zu verlassen» (golpe de zoom + zoom lento): yo en mi atril del juicio, nervioso; a los lados otros alumnos en los suyos; la cámara se acerca poco a poco
shot(0, 'Z', 'slow', L => { use('GR'); inside(.75, 28); KIDS.forEach((c, i) => { const [x, z, ry] = ring(i); put(c, x, 0, z, ry + (i ? Math.sin(L.T * 1.3 + i) * .4 : 0)); actuar(c, L.lt, [[0, i ? ['cross', 'hug_self', 'think'][i % 3] : { aLx: 1.1, aRx: 1.1, aLe: .5, aRe: .5, lean: .12 }]], { T: L.T + i, extra: i ? {} : shiver(L.T, .8) }); cara(c, L.T + i, i ? { expr: ['worried', 'sus', 'scared'][i % 3] } : { expr: 'scared', eyes: 'wide', mouth: 'grimace' }); });
  sweat(ich, L.T, 2); cm([GRX, 8, -12, GRX, 5.2, 12.4, 50], [GRX, 6.6, 1.5, GRX, 5, 12.4, 46], L.k, easeIn); }, [[0, 'impact', .6], [.2, 'choir', .5], [1.2, 'heartbeat', .5], [2.4, 'whisper', .3]]);
// 2 «einen Mitschüler zu töten und damit davonzukommen»: el anillo visto desde un lado: los alumnos se señalan unos a otros, acusándose
shot(3.19, 'W', 'punch', L => { use('GR'); inside(.75, 28); const tg = [3, 7, 9, 10, 1, 11, 2, 0, 5, 4, 6, 8];
  KIDS.forEach((c, i) => { const [x, z] = ring(i), [tx, tz] = ring(tg[i]); put(c, x, 0, z, Math.atan2(tx - x, tz - z)); actuar(c, L.lt, [[0, 'idle'], [.15 + (i % 4) * .12, i % 3 ? 'point' : 'shock', { dur: .25 }]], { T: L.T + i }); cara(c, L.T + i, { expr: i % 3 ? 'angry' : 'shock', mouth: i % 3 ? 'talk_wide' : 'o' }); });
  cm([GRX + 2, 9, 4, GRX, 4.6, -12.4, 50], [GRX - 2, 8.6, 1, GRX, 4.6, -12.4, 48], L.k); }, [[0, 'impact', .5], [.3, 'shout_m', .4], [.9, 'gasp', .4], [1.6, 'shout_m', .3]]);
// 3 «Und der Direktor ist ein Teddybär»: primer plano del osito en el trono: mitad rosa, mitad gris, ojo de corazón; saluda
shot(5.72, 'C', 'punch', L => { use('GR'); inside(.75, 28); bear(GRX, 6, -24, 0, { sit: 1, aR: 2.5 + Math.sin(L.T * 9) * .3, aRz: .5, aL: .6, mouth: tedM(L.T, 5.7, 7.6) + .2, headZ: Math.sin(L.T * 3) * .12, glow: 2.4 }, 1.3);
  const h = teddy.head.getWorldPosition(V(0, 0, 0)); cam([h.x - .6, h.y + .2, h.z + lerp(14, 11, easeOut(L.k))], [h.x, h.y - 1.6, h.z], 44); }, [[0, 'slam', .5], [.2, 'boing_metal', .4], [1.2, 'evil_laugh', .4]]);
// 4 «Das Verrückte:» yo detrás de los barrotes de la verja, encogiéndome de hombros
shot(7.66, 'W', 'punch', L => { town(); gate(0); const me = put(ich, 0, 0, -25.6, 0); actuar(me, L.lt, [[0, { aLx: 2.0, aRx: 2.0, aLz: .28, aRz: .28, aLe: .55, aRe: .55 }], [.3, 'shrug', { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'smug', mouth: 'smirk' });
  cam([.6, 5.6, -14], [0, 5, -25.6], 44); sh(V(0, 0, -26)); }, [[0, 'impact', .4], [.2, 'metal_creak', .4]]);
// 5 «Ich bin überhaupt nichts Besonderes»: la verja en plano general, yo pequeño detrás; cartel «0 TALENTE»
shot(8.5, 'Z', null, L => { town(); gate(0); const me = put(ich, 0, 0, -27, 0); actuar(me, L.lt, [[0, 'shrug']], { T: L.T }); cara(me, L.T, { expr: 'sad' });
  TOWN.slice(2, 5).forEach((c, i) => { walkC(c, L.lt, [-11, 11, -12][i], [-8, 4, 4][i], i % 2 ? PI : 0, 3, L.T + i); cara(c, L.T + i, {}); });
  badge('tag', '0 TALENTE', W / 2, H * .2, (L.lt - .4) * 3); cm([0, 9, 14, 0, 9, -26, 50], [0, 8.6, 8, 0, 8.6, -26, 50], L.k); sh(V(0, 0, -20), 40); }, [[0, 'zoom_in', .3], [.3, 'sad_tone', .4], [.8, 'wind', .3]]);
// 6 «Auf diese Schule kommen nur die Besten»: vista de dron del internado con la torre del reloj; los alumnos con trofeos entran por la verja abierta
shot(10.16, 'Z', null, L => { town(); gate(1); OTHERS.slice(0, 8).forEach((c, i) => { walkC(c, L.lt + i * .1, -6 + (i % 4) * 4, -14 - Math.floor(i / 4) * 5, PI, 2.8, L.T + i); cara(c, L.T + i, { expr: 'smug' }); });
  cm([0, 20, -52, 0, 3, -17, 50], [0, 14, -42, 0, 3.4, -19, 48], L.k); sh(V(0, 0, -30), 60); }, [[0, 'zoom_in', .4], [.2, 'bells', .4], [.6, 'steps', .4]]);
// 7 «des ganzen Landes»: delante de la verja posan los mejores; la gente de la ciudad hace fotos (destellos)
shot(11.88, 'S', null, L => { town(); gate(1); [mira, ollie, koch, hack, reich, schwimm].forEach((c, i) => { put(c, -8.5 + i * 3.4, 0, -16, 0); actuar(c, L.lt, [[0, i % 2 ? 'cheer' : 'wave']], { T: L.T + i }); cara(c, L.T + i, { expr: 'happy' }); });
  inHand(TROPHY, ollie, 'R', [0, -.6, .3], [0, 0, 0], .7); inHand(MEDAL, mira, 'L', [0, -.5, .5]);
  TOWN.slice(0, 5).forEach((c, i) => { put(c, [-12, -10.5, 10.5, 12, -13.5][i], 0, -4 - (i % 2) * 3, faceTo(V([-12, -10.5, 10.5, 12, -13.5][i], 0, -4), V(0, 0, -16))); actuar(c, L.lt, [[0, { aRx: 1.9, aLx: 1.9, aRe: .9, aLe: .9, aRz: -.2, aLz: -.2 }]], { T: L.T + i }); });
  if (Math.floor(L.lt * 6) % 3 === 0) grade.uniforms.flash.value = .25; cm([-6, 6, 10, -1, 5, -16, 46], [4, 5.6, 8, 1, 5, -16, 46], L.k); sh(V(0, 0, -12)); }, [[0, 'swipe', .3], [.2, 'flash', .4], [.6, 'flash', .35], [.9, 'cheer', .4]]);
// 8 «Die beste Eiskunstläuferin»: Mira gira sobre el hielo con los patines, la medalla brilla
shot(13.15, 'R', 'punch', L => { town(); gate(1); show(ICE, 0, .08, -33); const m = put(mira, 0, .2, -33, Math.sin(L.lt * 6) * .7); SKATES.forEach(s => s.visible = true); applyPose(m, { aLx: .5, aRx: .5, aLz: 1.4, aRz: 1.4, aLe: .1, aRe: .1, lLx: -.6, lLk: 1.2, headX: -.1 }); cara(m, L.T, { expr: 'happy', eyes: 'closed' });
  badge('tag', 'WELTMEISTERIN', W / 2, H * .2, (L.lt - .3) * 3); orb(L.k, V(0, 3.8, -33), null, [14, .2, .2, 46], [12, -.2, .16, 46]); sh(V(0, 0, -33)); }, [[0, 'whoosh', .4], [.2, 'steps_snow', .5], [.6, 'sparkle', .5], [1.0, 'cheer', .3]]);
// 9 «der beste Tennisspieler»: Ollie saca en la pista de tenis: lanza la pelota y golpea
shot(14.75, 'W', null, L => { use('TN'); day(); TN.lights.forEach(l => l.intensity = 0); const o = put(ollie, TNX - 4, 0, 30, PI + .3); const hit = clamp((L.lt - .55) / .2);
  applyPose(o, { aLx: 2.8 * (1 - hit), aLz: .2, aRx: lerp(2.6, .8, hit), aRz: lerp(.6, -.3, hit), aRe: lerp(1.8, .2, hit), lean: lerp(-.25, .35, hit), twist: lerp(.4, -.5, hit), headX: lerp(-.5, .1, hit) }); cara(o, L.T, { expr: 'determined', mouth: hit > 0 && hit < 1 ? 'talk_wide' : 'smirk' });
  inHand(RACK, o, 'R', [0, -.5, .2], [PI / 2, 0, 0], 1); const b = BALLS[0]; b.visible = true; b.position.copy(L.lt < .55 ? loc(o, -1.4, 9 + Math.sin(L.lt / .55 * PI) * 2.5, .8) : loc(o, 0, 9.6, 1 + (L.lt - .55) * 60));
  orbit(V(TNX - 4, 5, 30), lerp(15, 12.5, L.k), PI + .5, .1, 48); sh(V(TNX, 0, 26)); }, [[0, 'swipe', .3], [.55, 'kick', .6], [.6, 'whoosh', .4], [.9, 'cheer', .3]]);
// 10 «der beste Koch»: el cocinero lanza un crêpe con la sartén entre llamas, delante de las casas
shot(16.01, 'Z', 'punch', L => { town(); const k = put(koch, -2, 0, 52, .25); const f = (L.lt * 1.6) % 1; applyPose(k, { aRx: 1.3 + Math.sin(f * PI) * .5, aRe: .5, aLx: .7, aLe: 1.2, lean: .05, headX: -.3 * Math.sin(f * PI) }); cara(k, L.T, { expr: 'happy', mouth: 'open_smile' });
  inHand(PAN, k, 'R', [0, -.6, .9], [PI / 2, 0, 0]); const pp = loc(k, -1.5, 4.6, 3.2); show(PANCAKE, pp.x, pp.y + Math.sin(f * PI) * 4, pp.z, 0).rotation.x = f * PI * 2;
  FIRE.forEach((s, i) => { s.visible = true; const q = (L.T * 2 + i / 6) % 1; s.position.set(pp.x + Math.sin(i * 2) * .5, pp.y - .4 + q * 2.2, pp.z + Math.cos(i * 2) * .5); s.scale.setScalar(1 - q); });
  onFace(k, 11, -1.2, -1, 44, L.k, 9); sh(V(-2, 0, 52)); }, [[0, 'impact', .4], [.1, 'fire_whoosh', .5], [.3, 'pan_sizzle', .5]]);
// 11 «die beste Hackerin»: la hacker teclea en su portátil, luz verde en la cara, «ZUGRIFF ✓»
shot(16.93, 'F', null, L => { use('KL'); inside(.6, 25); const h = put(hack, KLX + 4.2, .4, 2.5 + 2.8, PI); applyPose(h, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: .9 + Math.sin(L.T * 30) * .1, aRe: .9 - Math.sin(L.T * 30) * .1, headX: .2 }); cara(h, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' });
  show(LAP, KLX + 2.6, 4.25, 3.0, .4); badge('green', 'ZUGRIFF ✓', W / 2, H * .22, (L.lt - .5) * 3, 1, .8); cm([KLX + 5.6, 6.8, -1.2, KLX + 4.2, 4.4, 5.3, 42], [KLX + 5.3, 6.6, -.4, KLX + 4.2, 4.4, 5.3, 40], L.k); }, [[0, 'flash', .3], [.1, 'keys', .6], [.6, 'beep', .4]]);
// 12 «Aber jedes Jahr wird ein ganz normales»: en la calle gira el bombo de la lotería; la gente mira
shot(18.03, 'S', null, L => { town(); gate(0); show(DRUM, 0, 0, 10, 0, 1.1); DRUM.userData.d.rotation.x = L.T * 8;
  TOWN.slice(0, 4).forEach((p, i) => { put(p, [-10, -7.5, 7.5, 10][i], 0, 9 + (i % 2), faceTo(V([-10, -7.5, 7.5, 10][i], 0, 9), V(0, 0, 10))); actuar(p, L.lt, [[0, i % 2 ? 'lean_in' : 'hands_face']], { T: L.T + i }); cara(p, L.T + i, { expr: 'shock' }); });
  orb(L.k, V(1.6, 5.2, 9), null, [16, .35, .14, 46], [14, .6, .12, 46]); sh(V(0, 0, 12)); }, [[0, 'swipe', .3], [.1, 'gears', .5], [.5, 'machine_shake', .4]]);
// 13 «Kind ausgelost»: sale una bola y el billete dorado «GEWONNEN!»
shot(19.47, 'C', 'punch', L => { town(); show(DRUM, 0, 0, 10, 0, 1.1); DRUM.userData.d.rotation.x = L.T * 2; const k = easeOut(clamp(L.lt / .5)); show(TICK, 0, 7 + k * 2.2, 14.5, 0, k * .7); TICK.rotation.z = Math.sin(L.T * 4) * .08;
  const c = put(TOWN[6], 3.6, 0, 6.6, -.5); actuar(c, L.lt, [[0, 'cheer']], { T: L.T }); cara(c, L.T, { expr: 'happy', mouth: 'open_smile' }); confetti(V(0, 4, 13), .2, L.lt, 30, .6);
  cm([1, 7.4, 30, 0, 7, 11, 44], [.5, 7.2, 26, 0, 7, 11, 44], L.k); sh(V(0, 0, 12)); }, [[0, 'pop', .6], [.2, 'confetti', .5], [.4, 'chime', .5]]);
// 14 «Einfach aus Glück»: el billete vuela por la calle y me cae en las manos; me quedo con la boca abierta
shot(21.0, 'W', null, L => { town(); const me = put(ich, -3, 0, 46, .3); actuar(me, L.lt, [[0, 'idle'], [.35, { aLx: 1.5, aRx: 1.5, aLe: .9, aRe: .9, aLz: -.15, aRz: -.15 }, { dur: .25 }]], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'o' });
  const k = clamp(L.lt / .45); if (k < 1) { show(TICK, lerp(6, -2.6, k), 8 - k * 3.6 + Math.sin(k * 9) * .5, lerp(50, 48.6, k), 0, .7); TICK.rotation.z = k * 6; } else inHand(TICK, me, 'R', [-.8, -.7, .5], [0, 0, 0], .7);
  onFace(me, 10, -1.2, -.8, 44, L.k, 8.5); sh(V(-3, 0, 46)); }, [[0, 'swipe', .3], [.1, 'paper', .5], [.45, 'sparkle', .5]]);
// 15 «Dieses Jahr war ich das»: me señalo a mí mismo con el billete; confeti y la gente aplaude
shot(21.86, 'Z', 'punch', L => { town(); const me = put(ich, -3, 0, 46, 0); actuar(me, L.lt, [[0, { aRx: .9, aRz: -.6, aRe: 2.0, aLx: 2.6, aLz: .4 }]], { T: L.T }); cara(me, L.T, { expr: 'happy', mouth: 'open_smile', eyes: 'wide' }); inHand(TICK, me, 'L', [0, -.7, .3], [0, 0, 0], .8);
  confRain(V(-3, 0, 46), L.T, 40, 18, 10, 14); TOWN.slice(0, 5).forEach((c, i) => { put(c, -12 + i * 4.6 + (i > 1 ? 4 : 0), 0, 40 - (i % 2) * 2, faceTo(V(-12 + i * 4.6, 0, 40), V(-3, 0, 46))); actuar(c, L.lt, [[0, i % 2 ? 'cheer' : 'wave']], { T: L.T + i }); cara(c, L.T + i, { expr: 'happy' }); });
  orbit(V(-3, 3.8, 46), lerp(15, 12, easeOut(L.k)), .1, .12, 46); sh(V(-3, 0, 44)); }, [[0, 'impact', .5], [.1, 'confetti', .5], [.3, 'cheer', .5], [.8, 'clap', .4]]);
// 16 «Ich lief durch das Schultor»: entro por la verja abierta con la mochila; detrás, la ciudad
shot(23.42, 'F', null, L => { town(); gate(1); const me = walkC(ich, L.lt, 0, -18, PI, 3, L.T); cara(ich, L.T, { expr: 'happy' });
  cm([1, 5.6, -30, 0, 4.4, -19, 44], [.8, 5.4, -28, 0, 4.4, -21, 44], L.k); sh(V(0, 0, -22)); }, [[0, 'flash', .3], [.1, 'steps', .5], [.6, 'metal_creak', .4]]);
// 17 «und plötzlich wurde alles schwarz» (zoom lento): la verja se cierra de golpe detrás de mí, me giro y todo se funde a negro
shot(24.52, 'C', 'slow', L => { town(); const sl = clamp((L.lt - .2) / .3); gate(1 - easeIn(sl)); const me = put(ich, 0, 0, -27, PI); me.root.rotation.y = PI + (L.lt > .55 ? .5 : 0); actuar(me, L.lt, [[0, 'idle'], [.55, 'shock', { dur: .2 }], [1.2, 'slump', { dur: .5 }]], { T: L.T }); cara(me, L.T, { expr: L.lt > .55 ? 'shock' : 'happy', mouth: L.lt > .55 ? 'scream' : 'flat' });
  DARK = clamp((L.lt - 1.1) / .8); cm([0, 5.8, -44, 0, 4.6, -27, 44], [0, 5.4, -36, 0, 4.6, -27, 40], L.k); sh(V(0, 0, -26)); }, [[.45, 'slam', .7], [.5, 'chain_rattle', .5], [.7, 'gasp', .4], [1.2, 'whoosh_down', .4]]);
// 18 «Ich wachte in einem Klassenzimmer auf»: levanto la cabeza del pupitre, mareado; el aula vacía
shot(26.51, 'I', null, L => { use('KL'); inside(.85, 40); const me = put(ich, KLX - 4.4, .4, 5.3, PI); const up = easeOut(clamp((L.lt - .3) / .8)); applyPose(me, { ...SIT, aLx: 1.4, aRx: 1.4, aLe: 1.6, aRe: 1.6, lean: lerp(1.0, .1, up), headX: lerp(.4, -.1, up), headY: Math.sin(L.T * 2) * .3 * up }); cara(me, L.T, { expr: 'confused', eyes: up < .3 ? 'closed' : 'half', mouth: 'flat' });
  DARK = 1 - clamp(L.lt / .5); cm([KLX - 4.4, 6.4, -6, KLX - 4.4, 5, 5, 46], [KLX - 4.4, 6.6, -3.4, KLX - 4.4, 5, 5, 46], L.k); }, [[0, 'iris_pop', .3], [.3, 'yawn_big', .4], [.9, 'chair_roll', .3]]);
// 19 «Die Fenster waren mit Eisenplatten zugeschraubt»: golpeo la placa de hierro de la ventana; tornillos y rendija de luz
shot(28.48, 'W', null, L => { use('KL'); inside(.85, 40); const me = put(ich, KLX + 16.6, 0, -8, PI / 2); const kn = Math.max(0, Math.sin(L.lt * 12)); actuar(me, L.lt, [[0, { aRx: 1.8, aRe: .4 + kn * .5, aRz: -.1, aLx: .4, lean: .05 }]], { T: L.T }); cara(me, L.T, { expr: 'worried', mouth: 'grimace' });
  cm([KLX + 11.4, 6.2, .8, KLX + 16.8, 4.4, -8, 50], [KLX + 12.2, 6, -.4, KLX + 16.8, 4.4, -8, 48], L.k); }, [[0, 'swipe', .3], [.2, 'metal_hit', .6], [.5, 'metal_hit', .5], [.8, 'metal_hit', .5], [1.4, 'ratchet', .4]]);
// 20 «und in jeder Ecke hing eine Kamera»: una cámara de la esquina gira hacia mí con su luz roja; yo la miro desde abajo
shot(30.64, 'Z', 'punch', L => { use('KL'); inside(.85, 40); KL.cams[0].rotation.y = PI / 4 + Math.sin(L.lt * 3) * .5; const me = put(ich, KLX - 12, 0, -6, PI + .7); actuar(me, L.lt, [[0, { headX: -.6, aLx: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'worried', eyes: 'wide' });
  cm([KLX - 14, 15.6, -10, KLX - 18.4, 18, -14.4, 46], [KLX - 15, 16.2, -11, KLX - 18.4, 18, -14.4, 40], L.k); }, [[0, 'impact', .4], [.1, 'gears', .4], [.4, 'beep', .4]]);
// 21 «Auf meinem Pult lag ein Zettel»: cojo la nota de mi pupitre
shot(32.67, 'S', null, L => { use('KL'); inside(.85, 40); const me = put(ich, KLX - 4.4, 0, 9, PI); const k = clamp((L.lt - .3) / .4); actuar(me, L.lt, [[0, 'idle'], [.2, { aRx: 1.3, aRe: .4, lean: .3, headX: .4 }, { dur: .3 }], [.8, { aRx: 1.6, aRe: 1.4, headX: .2, lean: .05 }, { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'confused' });
  if (L.lt > .8) { KL.note.visible = false; const hp2 = loc(me, -.6, 3.6, 2.2); show(NOTE2, hp2.x, hp2.y, hp2.z, 0, 1); } cm([KLX - 2, 8.6, .5, KLX - 4.4, 5, 8.4, 46], [KLX - 2.4, 8.4, 1.6, KLX - 4.4, 5, 8.6, 46], L.k); if (NOTE2.visible) NOTE2.lookAt(camera.position); }, [[0, 'swipe', .3], [.6, 'paper', .5]]);
// 22 «Komm in die Turnhalle»: la nota sobre el pupitre, de cerca; yo detrás alargando la mano
shot(34.15, 'C', 'punch', L => { use('KL'); inside(.85, 40); KL.note.rotation.z = PI; const me = put(ich, KLX - 4.4, .4, 5.3, PI); applyPose(me, { ...SIT, aRx: 1.3, aRe: .3, aLx: .9, aLe: 1, headX: .1, lean: .25 }); cara(me, L.T, { expr: 'worried', eyes: 'down' });
  cm([KLX - 4.2, 9.4, -1.6, KLX - 4.4, 3.4, 3.6, 46], [KLX - 4.3, 8.8, -.6, KLX - 4.4, 3.4, 3.6, 42], L.k); }, [[0, 'impact', .4], [.2, 'paper', .4]]);
// 23 «Dort warteten schon elf andere Schüler» (zoom lento): entro al gimnasio; los once se giran a mirarme
shot(35.29, 'F', 'slow', L => { use('TH'); inside(.85, 40); OTHERS.forEach((c, i) => { const x = -12 + (i % 6) * 4.8, z = -6 - Math.floor(i / 6) * 4.5; const r0 = faceTo(V(x, 0, z), V(0, 0, 16)); put(c, THX + x, 0, z, lerp(PI, r0, easeInOut(clamp((L.lt - .3 - i * .05) / .4)))); actuar(c, L.lt, [[0, 'idle'], [.5 + i * .04, i % 3 ? 'cross' : 'listen']], { T: L.T + i }); cara(c, L.T + i, { expr: 'sus' }); });
  const me = walkC(ich, L.lt, THX, 18, PI, 1.6, L.T); cara(ich, L.T, { expr: 'worried' });
  cm([THX, 9, 25, THX, 5, -6, 50], [THX, 8, 20, THX, 5, -6, 50], L.k); }, [[0, 'flash', .3], [.1, 'door_open', .5], [.5, 'steps', .3], [1.0, 'whisper', .4]]);
// 24 «Eine davon kannte ich aus der Grundschule»: la señalo, sorprendido
shot(37.39, 'W', 'punch', L => { use('TH'); inside(.85, 40); const me = put(ich, THX - 2, 0, 8, PI - .3); actuar(me, L.lt, [[0, 'shock'], [.4, 'point', { dur: .25 }]], { T: L.T }); cara(me, L.T, { expr: 'shock', mouth: 'o' });
  put(mira, THX - 6, 0, -2, .3); cara(mira, L.T, {}); onFace(me, 10, -1.2, 1.2, 44, L.k, 8.5); }, [[0, 'impact', .4], [.3, 'gasp', .4]]);
// 25 «Mira,»: Mira de cerca, se gira y saluda; su nombre aparece
shot(39.29, 'Z', null, L => { use('TH'); inside(.85, 40); const m = put(mira, THX - 6, 0, -2, lerp(PI, .3, easeOut(clamp(L.lt / .4)))); actuar(m, L.lt, [[0, 'idle'], [.35, 'wave', { dur: .3 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'open_smile' }); inHand(MEDAL, m, 'L', [0, -.5, .5]);
  badge('tag', 'MIRA', W / 2, H * .18, (L.lt - .2) * 3); onFace(m, 10, -1.4, -.6, 42, L.k, 8.6); }, [[0, 'zoom_in', .3], [.35, 'sparkle', .5], [.6, 'whoosh_up', .3]]);
// 26 «inzwischen echte Eiskunstlauf-Weltmeisterin»: Mira en el podio con la medalla de oro y el trofeo, confeti y focos
shot(40.63, 'R', 'punch', L => { use('TH'); inside(.8, 30); TH.spots.forEach(s => s.intensity = 175); show(ICE, THX - 9, 4.25, -21, 0, .5); const m = put(mira, THX - 9, 4.4, -21, Math.sin(L.T * 2) * .3); SKATES.forEach(s => s.visible = true); actuar(m, L.lt, [[0, 'cheer']], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'open_smile' });
  inHand(TROPHY, m, 'R', [0, -.6, .3], [0, 0, 0], .8); confRain(V(THX - 9, 4, -21), L.T, 40, 14, 8, 16); badge('gold', 'WELTMEISTERIN', W / 2, H * .2, (L.lt - .2) * 3, 1, .7);
  orbit(V(THX - 9, 7.6, -21), lerp(15, 12, easeOut(L.k)), .2, .1, 44); }, [[0, 'impact', .5], [.1, 'cheer', .5], [.3, 'confetti', .4], [.8, 'bells', .3]]);
// 27 «Ich hatte nie mit ihr geredet» (recuerdo sepia): de pequeños en primaria: yo solo al fondo, ella riendo con sus amigas
shot(42.24, 'F', null, L => { use('KL'); inside(.85, 40); sepia(.85); const me = put(ich, KLX - 4.4, .4, 10 + 2.8, PI + .5); ich.root.scale.setScalar(.7); applyPose(me, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: 1.5, aRe: 1.5, headX: .1 }); cara(me, L.T, { expr: 'sad', eyes: 'side_l' });
  [[mira, 0, -1, .6], [zopf, 1.6, 1, -2.4], [schwimm, -1, 1.6, 2.4]].forEach(([c, x, z, ry], i) => { put(c, KLX + x, 0, z, ry); c.root.scale.setScalar(.65); actuar(c, L.lt, [[0, i ? 'hands_face' : 'shrug']], { T: L.T + i }); laughF(c, L.T + i); });
  cm([KLX + 1, 7, 18, KLX - 1.5, 2.8, 4, 50], [KLX + .6, 6.6, 16.5, KLX - 1.5, 2.8, 4, 48], L.k); }, [[0, 'flash', .3], [.2, 'kids_laugh', .4], [.8, 'sigh', .4]]);
// 28 «Trotzdem erinnerte sie sich an mich»: en el gimnasio Mira me sonríe y saluda; me pongo rojo (corazoncitos)
shot(43.63, 'W', null, L => { use('TH'); inside(.85, 40); const m = put(mira, THX - 3.2, 0, 2, .7); actuar(m, L.lt, [[0, 'wave']], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'open_smile' });
  const me = put(ich, THX + 3, 0, 4.4, -1.5); actuar(me, L.lt, [[0, 'idle'], [.4, 'hands_face', { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'grin', blush: 1 }); const hp_ = hp(me);
  HEARTS.forEach((z, i) => { const k = (L.T * .6 + i / 5) % 1; z.visible = true; z.position.set(hp_.x + Math.sin(i * 1.7 + L.T) * 1.4, hp_.y + 1 + k * 3.4, hp_.z + .4); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); });
  orb(L.k, V(THX, 4.6, 3.2), null, [20, 0, .1, 44], [18, .15, .1, 44]); }, [[0, 'swipe', .3], [.3, 'sparkle', .4], [.6, 'heartbeat', .4], [1.2, 'kids_laugh', .3]]);
// ---------- b: el osito en el escenario, las reglas, la chica de la trenza, los vídeos, el cambio de habitación y los números (45,45 – 98,47 s) ----------
const TDOOR = (() => { const g = new THREE.Group(); g.position.set(0, 0, 27.6); g.rotation.y = PI; TH.g.add(g); box(10, 12, .4, mat(0x8a8e96, { metalness: .5 }), .05, g, 0, 6, -.2); const lv = [-1, 1].map(s => { const l = new THREE.Group(); l.position.set(s * 4.6, 0, 0); g.add(l); box(4.5, 11, .5, mat(0x3a6ad8, { metalness: .3, roughness: .4 }), .05, l, -s * 2.25, 5.5, .1); box(.3, 2.4, .5, mat(0xd8dce4, { metalness: .9 }), .05, l, -s * 3.9, 5.4, .5); box(3, 2.4, .1, mat(0xbfe6ff, { transparent: true, opacity: .6 }), .02, l, -s * 2.25, 8, .4); return l; });
  const ch = new THREE.Group(); g.add(ch); for (let k = 0; k < 9; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.32, .08, 6, 12), mat(0xb8bcc4, { metalness: .9, roughness: .2 })); r.position.set(-3.2 + k * .8, 5.4 + Math.sin(k) * .1, .8); r.rotation.y = k % 2 ? PI / 2 : 0; ch.add(r); } box(1, 1.3, .5, mat(0xe9c23a, { metalness: .8 }), .1, ch, 0, 4.8, .9); return { g, lv, ch }; })();
const TABS = Array.from({ length: 6 }, () => { const g = new THREE.Group(); scene.add(g); box(1.9, 1.3, .1, mat(0x1a1a22), .06, g, 0, 0, 0); const s = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.1), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.2, .5, .8), toneMapped: false })); s.position.z = .06; g.add(s); return g; });
const KEY_ = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0xe9c23a, { metalness: .9, roughness: .2 }); const r = new THREE.Mesh(new THREE.TorusGeometry(.25, .07, 6, 14), m); g.add(r); box(.12, .7, .08, m, .02, g, 0, -.55, 0); box(.25, .1, .08, m, .02, g, .12, -.8, 0); return g; })();
const GCH = (() => { const g = new THREE.Group(); scene.add(g); for (let k = 0; k < 11; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(.32, .08, 6, 12), mat(0xb8bcc4, { metalness: .9, roughness: .2 })); r.position.set(-4 + k * .8, 6 + Math.sin(k * .6) * .3, 0); r.rotation.y = k % 2 ? PI / 2 : 0; g.add(r); } const lk = box(1.2, 1.4, .6, mat(0xe9c23a, { metalness: .8, roughness: .25 }), .15, g, 0, 5, .2); const sh_ = new THREE.Mesh(new THREE.TorusGeometry(.4, .1, 6, 12, Math.PI), mat(0xb8bcc4, { metalness: .9 })); sh_.position.set(0, 5.7, .2); g.add(sh_); return g; })();
PROPS.push(...TABS, KEY_, GCH);
const tabFace = (ch, side = 'R') => { const t = TABS[0]; inHand(t, ch, side, [.4, -.9, .7], [-1.1, 0, 0]); return t; };
const bearStage = (L, p = {}, y = 9.4) => bear(THX, y, -19, 0, { glow: 1.6, ...p }, 1.0);
const studentsGym = (L, face = { expr: 'shock' }, g = ['shock', 'cower', 'hands_head', 'shock']) => OTHERS.forEach((c, i) => { if (c === zopf && L.T > 68.5) return; const x = -12 + (i % 6) * 4.8, z = -2 - Math.floor(i / 6) * 4.5; put(c, THX + x, 0, z, faceTo(V(x, 0, z), V(0, 0, -19)) * .5); actuar(c, L.lt, [[0, g[i % g.length]]], { T: L.T + i }); cara(c, L.T + i, face); });

// 29 «Dann sprang ein kleiner Bär auf die Bühne»: el osito salta desde un lado y aterriza en el atril; los alumnos retroceden
shot(45.45, 'Z', 'punch', L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 200); const k = clamp(L.lt / .9), p = arc([THX + 16, 4.2, -20], [THX, 9.4, -19], 7, easeInOut(k));
  bear(p.x, p.y, p.z, lerp(-.8, 0, k), { aL: 2.6 * (1 - k) + .4, aR: 2.6 * (1 - k) + .4, aLz: .7, aRz: .7, legs: k < 1 ? 1.2 : 0, mouth: .8, glow: 1.8 });
  studentsGym(L, { expr: 'shock' }, ['recoil', 'shock', 'cower']); ich.root.visible = false;
  cm([THX + 8, 11, 14, THX + 4, 9, -19, 50], [THX + 3, 11, 8, THX + 1, 10, -19, 48], L.k); }, [[0, 'impact', .4], [.1, 'jump', .5], [.85, 'land', .6], [.95, 'boing_metal', .4], [1.2, 'gasp', .4]]);
// 30 «Halb rosa»: primer plano del lado rosa
shot(47.54, 'W', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 200); bearStage(L, { aL: 1.2, aLz: .5, headZ: .15, mouth: .5, headY: -.3 });
  orbit(V(THX - .4, 12.2, -19), lerp(11, 9.5, L.k), -.75, .06, 40); badge('tag', 'ROSA', W / 2, H * .2, (L.lt - .1) * 3); }, [[0, 'swipe', .3], [.2, 'sparkle', .4]]);
// 31 «halb grau»: primer plano del lado gris, el ojo de corazón brilla
shot(48.46, 'W', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 200); bearStage(L, { aR: 1.2, aRz: .5, headZ: -.15, mouth: .3, headY: .3, glow: 2.6 });
  orbit(V(THX + .4, 12.2, -19), lerp(11, 9.5, L.k), .75, .06, 40); badge('tag', 'GRAU', W / 2, H * .2, (L.lt - .1) * 3); }, [[0, 'swipe', .3], [.2, 'creepy_ting', .5]]);
// 32 «mit einer winzigen Krone»: la coronita de cerca, destellos
shot(49.18, 'Z', 'punch', L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 200); bearStage(L, { aL: 2.6, aLz: .2, aLe: 1, headX: -.15, mouth: .6, headZ: Math.sin(L.T * 4) * .1 });
  const c = teddy.crown; teddy.root.updateMatrixWorld(true); const p = c.getWorldPosition(V(0, 0, 0)); cam([p.x + .6, p.y + 1.6, p.z + 5.6], [p.x, p.y - .2, p.z], lerp(36, 32, L.k)); }, [[0, 'impact', .4], [.15, 'sparkle', .6], [.6, 'chime', .4]]);
// 33 «Willkommen in eurer neuen Schule!»: brazos abiertos en el atril, confeti, los monitores muestran su cara
shot(50.44, 'R', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 200); bearStage(L, { aL: 2.4 + Math.sin(L.T * 6) * .2, aR: 2.4 - Math.sin(L.T * 6) * .2, aLz: 1, aRz: 1, mouth: tedM(L.T, 50.4, 52.5), hop: Math.abs(Math.sin(L.T * 5)) * .3 });
  TH.mons.forEach(m => m.userData.s.userData.draw('bear', (c, w, h) => { c.fillStyle = '#2a0a2a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffa6c8'; c.beginPath(); c.arc(w / 2, h / 2, h * .38, Math.PI / 2, Math.PI * 1.5); c.fill(); c.fillStyle = '#8a8e9a'; c.beginPath(); c.arc(w / 2, h / 2, h * .38, -Math.PI / 2, Math.PI / 2); c.fill(); c.fillStyle = '#ff2030'; c.font = `700 ${h * .25}px Cap`; c.textAlign = 'center'; c.fillText('♥', w / 2 + h * .15, h * .5); c.fillStyle = '#111'; c.beginPath(); c.arc(w / 2 - h * .15, h * .42, h * .06, 0, 7); c.fill(); }));
  confRain(V(THX, 4, -19), L.T, 40, 20, 10, 18); studentsGym(L, { expr: 'worried' }, ['idle', 'cross', 'listen']); ich.root.visible = true; put(ich, THX + 1, 0, 6, PI); cam([THX + lerp(-4, 4, L.k), 10, 14], [THX, 11, -19], 50); }, [[0, 'whirl', .3], [.1, 'party_horn', .5], [.3, 'confetti', .5], [1.2, 'clap', .3]]);
// 34 «Ihr bleibt für immer hier»: desde el escenario, junto al osito: los alumnos asustados abajo
shot(52.53, 'F', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 150); bearStage(L, { aR: 1.6, aRz: -.1, mouth: tedM(L.T, 52.5, 53.8), headY: -.3 }); teddy.root.rotation.y = .5;
  studentsGym(L, { expr: 'scared' }); put(ich, THX + 2, 0, 1, PI); actuar(ich, L.lt, [[0, 'shock']], { T: L.T }); cara(ich, L.T, { expr: 'scared' }); OTHERS.forEach(c => c.root.rotation.y = PI);
  cm([THX - 6, 14, -26, THX + 1, 3, 0, 50], [THX - 5, 13, -24, THX + 1, 3, 0, 50], L.k); }, [[0, 'flash', .3], [.2, 'gasp', .5], [.8, 'heartbeat', .4]]);
// 35 «Niemand kommt rein»: fuera, la verja cerrada con cadena y candado; la gente de la ciudad intenta mirar dentro
shot(53.82, 'C', 'punch', L => { town(); gate(0); TOWN.slice(0, 3).forEach((c, i) => { put(c, -4 + i * 4, 0, -21.6, PI); actuar(c, L.lt, [[0, { aLx: 1.9, aRx: 1.9, aLe: .5, aRe: .5, lean: .1 }]], { T: L.T + i, extra: shiver(L.T + i, .5) }); cara(c, L.T + i, { expr: 'worried' }); });
  show(GCH, 0, 0, -23.2); GCH.rotation.z = Math.sin(L.T * 9) * .02 * Math.exp(-L.lt * 2); cm([1, 7, -40, 0, 6, -22, 46], [1, 7, -37, 0, 6, -22, 44], L.k); sh(V(0, 0, -24)); }, [[0, 'slam', .5], [.1, 'chain_rattle', .6], [.5, 'lock', .6]]);
// 36 «Niemand geht raus»: el motero tira de las puertas del gimnasio: cadena y candado
shot(55.29, 'W', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150;
  const b = put(biker, THX + 1, 0, 24.4, 0); const pull = Math.sin(L.lt * 14); actuar(b, L.lt, [[0, { aLx: 1.6, aRx: 1.6, aLe: .3, aRe: .3, lean: -.25 - pull * .08, crouch: .2 }]], { T: L.T }); cara(b, L.T, { expr: 'angry', mouth: 'grimace_wide' }); TDOOR.lv.forEach((l, i) => l.rotation.y = pull * .02 * (i ? 1 : -1));
  cm([THX + 9, 7.5, 27, THX + 1, 5.2, 24.4, 50], [THX + 8.4, 7.3, 27, THX + 1, 5.2, 24.4, 48], L.k); }, [[0, 'swipe', .3], [.15, 'chain_rattle', .6], [.5, 'metal_hit', .5], [.9, 'growl', .3]]);
// 37 «Wer gehen will? Ganz einfach:» el osito se inclina sobre el atril, dedo arriba, guiño
shot(56.57, 'Z', 'punch', L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 200);
  bearStage(L, { aR: 2.4, aRz: -.2, lean: .3, mouth: tedM(L.T, 56.5, 58.2), wink: L.lt > .6, headZ: .2 }); orbit(V(THX, 12.2, -19), lerp(12.5, 11, L.k), -.2, .02, 42); }, [[0, 'impact', .4], [.3, 'whoosh_up', .3], [.8, 'blink', .4]]);
// 38 «Tötet jemanden – und lasst euch nicht erwischen» (zoom lento): el ojo de corazón brilla rojo, la sala se tiñe
shot(58.24, 'C', 'slow', L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 120); bearStage(L, { aL: .3, aR: .3, mouth: tedM(L.T, 58.2, 60.7), glow: 2 + L.k * 3, brow: .4, headX: .15 }); TINT = `rgba(180,0,30,${.12 + L.k * .18})`;
  const h = teddy.head.getWorldPosition(V(0, 0, 0)); cam([h.x + .4, h.y + .4, h.z + lerp(9, 5.6, easeIn(L.k))], [h.x + .2, h.y - .2, h.z], 40); }, [[0, 'slam', .4], [.3, 'heartbeat', .6], [1.4, 'creepy_ting', .5]]);
// 39 «Alle lachten»: los alumnos se ríen (creen que es una broma)
shot(60.75, 'W', null, L => { use('TH'); inside(.85, 40); OTHERS.forEach((c, i) => { const x = -12 + (i % 6) * 4.8, z = -2 - Math.floor(i / 6) * 4.5; put(c, THX + x, 0, z, faceTo(V(x, 0, z), V(0, 0, 20)) * .3); actuar(c, L.lt, [[0, i % 3 ? 'hands_face' : 'shrug']], { T: L.T + i }); laughF(c, L.T + i); });
  put(ich, THX + 2, 0, 3, 0); laughF(ich, L.T); cm([THX - 6, 7, 20, THX, 4.5, -4, 48], [THX + 6, 7, 20, THX, 4.5, -4, 48], L.k); }, [[0, 'swipe', .3], [.1, 'kids_laugh', .6], [.4, 'laugh_deep', .3]]);
// 40 «Ein Mädchen mit Zopf stapfte zu ihm»: la chica de la trenza sube las escaleras del escenario a zancadas, enfadada
shot(61.55, 'S', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 150); bearStage(L, { mouth: .2, headX: .3, aL: .4, aR: .4 }); const k = clamp(L.lt / 1.5), z = lerp(-8, -15.6, k), y = clamp((z + 12.4) / -3.2) * 4.2;
  caminar(zopf, L.lt, { x: THX - 1.4, z: -8, ry: PI, speed: 4.6, accel: .05, T: L.T, extra: { lean: .2, aLx: -.3, aRx: -.3 } }); zopf.root.position.z = z; zopf.root.position.y = y; cara(zopf, L.T, { expr: 'angry', mouth: 'grimace' });
  cm([THX - 7, 10, -21, THX - 1.4, 5.5, -10, 46], [THX - 6.6, 10, -20, THX - 1.4, 6.5, -12, 46], L.k); }, [[0, 'swipe', .3], [.1, 'steps', .6], [.7, 'thud', .4], [1.2, 'growl', .3]]);
// 41 «und packte ihn am Ohr»: le agarra de la oreja y le levanta; el osito patalea
shot(63.21, 'C', 'punch', L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 175); const z = put(zopf, THX - 1.8, 4.2, -17.6, .5); actuar(z, L.lt, [[0, { aRx: 2.3, aRz: -.4, aRe: .4, lean: -.1 }]], { T: L.T }); cara(z, L.T, { expr: 'angry', mouth: 'smirk' });
  const up = easeOut(clamp(L.lt / .3)); bear(THX - .1, 4.4 + up * 2.6, -17.2, -.4, { aL: 1 + Math.sin(L.T * 20) * .6, aR: 1 - Math.sin(L.T * 20) * .6, legs: L.T * 18, mouth: .9, headZ: .4, glow: 2 }, .9);
  cm([THX + 3, 9, -3, THX - 1, 8.4, -17.4, 46], [THX + 2.4, 9, -5, THX - 1, 8.6, -17.4, 44], L.k); }, [[0, 'impact', .5], [.05, 'rip', .4], [.3, 'toy', .5], [.7, 'gasp_f', .4]]);
// 42 «„Oh-oh“, sagte der Bär»: primer plano del osito colgando: boca en O, ojo de corazón encendido
shot(64.33, 'Z', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 175); put(zopf, THX - 1.8, 4.2, -17.6, .5); applyPose(zopf, { aRx: 2.3, aRz: -.4, aRe: .4 }); cara(zopf, L.T, { expr: 'smug' });
  bear(THX - .1, 7, -17.2, -.2, { aL: .3, aR: .3, mouth: L.lt < .9 ? .9 : tedM(L.T, 64.3, 66.1), headZ: .4 + Math.sin(L.T * 3) * .05, glow: 3 + Math.sin(L.T * 10), brow: -.3 }, .9);
  const h = teddy.head.getWorldPosition(V(0, 0, 0)); cam([h.x + 1, h.y + .6, h.z + lerp(9.5, 8.5, L.k)], [h.x, h.y - .4, h.z], 40); }, [[0, 'whoosh', .3], [.1, 'creepy_ting', .6], [.9, 'beep', .3]]);
// 43 «Den Direktor anzufassen ist verboten»: dedo que dice que no, alarmas rojas
shot(66.13, 'F', null, L => { use('TH'); inside(.55, 12); TH.g.userData.L.intensity = 150; TH.spots.forEach(s => s.intensity = 120); put(zopf, THX - 1.8, 4.2, -17.6, .5); applyPose(zopf, { aRx: 2.3, aRz: -.4, aRe: .4 }); cara(zopf, L.T, { expr: 'worried' });
  bear(THX - .1, 7, -17.2, -.2, { aR: 2.2, aRz: Math.sin(L.T * 14) * .4, mouth: tedM(L.T, 66.1, 68.5), headZ: .4, glow: 3, brow: .5 }, .9); TINT = Math.floor(L.T * 4) % 2 ? 'rgba(255,0,30,.22)' : 'rgba(255,0,30,.05)';
  cm([THX + 6, 8, -6, THX, 8, -17.4, 46], [THX + 5, 8.4, -8, THX, 8.4, -17.4, 44], L.k); }, [[0, 'alarm', .5], [.6, 'buzzer', .4], [1.4, 'alarm', .4]]);
// 44 «Ein Käfig fiel von der Decke»: la jaula cae sobre la chica de la trenza en mitad del gimnasio
shot(68.51, 'C', 'punch', L => { use('TH'); inside(.75, 30); const z = put(zopf, THX, 0, 2, 0); actuar(z, L.lt, [[0, 'idle'], [.2, 'shock', { dur: .2 }], [.45, 'cower', { dur: .3 }]], { T: L.T }); cara(z, L.T, { expr: 'scared', eyes: 'terror', mouth: 'scream' });
  const f = clamp(L.lt / .38); show(CAGE, THX, 30 * (1 - f * f) + (f >= 1 ? Math.abs(Math.sin((L.lt - .38) * 14)) * .5 * Math.exp(-(L.lt - .38) * 6) : 0), 2);
  OTHERS.forEach((c, i) => { if (c === zopf) return; const a = i / 11 * PI * 2; put(c, THX + Math.sin(a) * 11, 0, 2 + Math.cos(a) * 11, a + PI); actuar(c, L.lt, [[0, 'idle'], [.4, i % 2 ? 'recoil' : 'hands_head', { dur: .2 }]], { T: L.T + i }); cara(c, L.T + i, { expr: L.lt > .4 ? 'shock' : 'neutral' }); });
  cm([THX + 4, 9, 18, THX, 5, 2, 46], [THX + 3, 8.4, 15, THX, 5, 2, 46], L.k); }, [[0, 'whoosh_down', .5], [.38, 'slam', .8], [.42, 'metal_hit', .6], [.6, 'scream_girl', .4]]);
// 45 «und sie verschwand im Boden»: vista cenital: se abre la trampilla y la jaula se hunde
shot(69.79, 'I', null, L => { use('TH'); inside(.75, 30); const o = easeOut(clamp(L.lt / .3)), d = easeIn(clamp((L.lt - .35) / .8)); TH.trap.hole.visible = true; TH.trap.lids.forEach((l, i) => l.rotation.z = (i ? 1 : -1) * o * 1.5);
  const z = put(zopf, THX, -d * 9, 2, 0); actuar(z, L.lt, [[0, 'hands_head']], { T: L.T }); cara(z, L.T, { expr: 'scared', eyes: 'terror', mouth: 'scream' }); show(CAGE, THX, -d * 9, 2);
  [koch, fan, schwimm].forEach((c, i) => { put(c, THX - 7 + i * 7, 0, 10 + (i % 2) * 2, PI); actuar(c, L.lt, [[0, 'hands_face']], { T: L.T + i }); cara(c, L.T + i, { expr: 'shock' }); });
  cam([THX + .5, 26 - L.k * 4, 12], [THX, 0, 2], 46); }, [[0, 'iris_pop', .3], [.1, 'wood_creak', .5], [.4, 'whoosh_down', .5], [.6, 'rubble', .4]]);
// 46 «Danach lachte niemand mehr» (zoom lento): los alumnos en silencio, pálidos; la trampilla cerrada
shot(71.19, 'S', 'slow', L => { use('TH'); inside(.7, 25); studentsGym(L, { expr: 'scared', mouth: 'flat' }, ['cower', 'idle', 'hug_self']); zopf.root.visible = false; put(ich, THX + 2, 0, 3, 0); actuar(ich, L.lt, [[0, 'hug_self']], { T: L.T }); cara(ich, L.T, { expr: 'scared', mouth: 'flat' });
  cm([THX, 7, 20, THX, 5, -3, 50], [THX, 6.4, 14, THX, 5, -3, 46], L.k); }, [[0, 'swipe', .3], [.2, 'silence_tick', .5], [1.0, 'heartbeat', .4]]);
// 47 «Am nächsten Tag zeigte er jedem ein Video»: el osito entra en mi habitación y me da una tableta encendida
shot(72.85, 'F', null, L => { use('ZA'); inside(1.0, 50); const me = put(ich, ZAX + 1, 0, 2, -.6); const k = easeOut(clamp(L.lt / 1)); actuar(me, L.lt, [[0, 'idle'], [1.2, { aRx: 1.3, aRe: .5 }, { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'worried' });
  bear(lerp(ZAX + 8, ZAX + 3.6, k), Math.abs(Math.sin(L.lt * 8)) * .5 * (1 - k), lerp(6, 4.4, k), -1.6, { legs: L.T * 10 * (1 - k), aR: 1.6, mouth: tedM(L.T, 72.8, 75.2) }, .9); const t = TABS[0]; t.parent.remove(t); teddy.aR.add(t); t.position.set(0, -1.3, .5); t.rotation.set(-.4, 0, 0); t.visible = true;
  orb(L.k, V(ZAX + 2.4, 4, 3), null, [10, -.9, .12, 46], [9, -.7, .1, 46]); }, [[0, 'flash', .3], [.1, 'jump_small', .4], [.6, 'power_on', .5], [1.4, 'notif', .4]]);
// 48 «In meinem:» yo con la tableta delante, la luz en la cara
shot(75.16, 'Z', 'punch', L => { use('KL'); inside(.6, 25); const me = put(ich, KLX - 4.4, .4, 5.3, PI); applyPose(me, { ...SIT, aLx: 1.4, aRx: 1.4, aLe: 1.1, aRe: 1.1, headX: 0 }); cara(me, L.T, { expr: 'worried', eyes: 'down' }); const t = TABS[0]; show(t, KLX - 4.4, 4.9, 3.4, PI); t.rotation.x = -1.0;
  cm([KLX - 4.4, 8, -.4, KLX - 4.4, 5.4, 5.3, 42], [KLX - 4.4, 7.8, .4, KLX - 4.4, 5.4, 5.3, 40], L.k); }, [[0, 'impact', .4], [.2, 'tv_static', .4]]);
// 49 «das Wohnzimmer meiner Familie» (vídeo): el salón de casa, las fotos de la familia en la pared
shot(75.88, 'F', null, L => { use('WZ'); inside(.8, 30); VIDEO = 1; cm([WZX - 6, 11, 11, WZX - 9, 9, -12, 48], [WZX - 2, 10.6, 9, WZX - 9, 9, -12, 48], L.k); }, [[0, 'tv_static', .4], [.2, 'radio', .3]]);
// 50 «Leer» (vídeo): barrido lento por el salón vacío
shot(77.22, 'W', null, L => { use('WZ'); inside(.7, 25); VIDEO = 1; cm([WZX + 12, 9, 10, WZX, 4, -2, 50], [WZX + 6, 9, 11, WZX - 4, 4, -2, 50], L.k); }, [[0, 'tv_static', .3], [.2, 'wind', .3]]);
// 51 «Die Sofas umgekippt» (vídeo): el sofá volcado, la lámpara en el suelo
shot(77.96, 'C', 'punch', L => { use('WZ'); inside(.7, 25); VIDEO = 1; cm([WZX - 1, 6, 6, WZX - 6, 2.6, -6, 44], [WZX - 2, 5.6, 4, WZX - 6, 2.6, -6, 42], L.k); }, [[0, 'glitch', .4], [.2, 'crash_wood', .4]]);
// 52 «Mira sah ihr Video und wurde kreidebleich»: Mira con la tableta, se tapa la boca, pálida
shot(79.32, 'R', null, L => { use('KL'); inside(.7, 30); const m = put(mira, KLX + 4.2, .4, 5.3, PI); applyPose(m, { ...SIT, aLx: 1.3, aLe: 1.2, aRx: 2.1, aRe: 2.4, aRz: -.2, headX: -.05, lean: -.1 }); cara(m, L.T, { expr: 'shock', eyes: 'terror', mouth: 'o' }); const t = TABS[1]; show(t, KLX + 4.6, 4.9, 3.6, PI); t.rotation.x = -1.0;
  grade.uniforms.sat.value = lerp(1.45, .6, clamp(L.lt / 1.2)); sweat(m, L.T, 2); cm([KLX + 4.4, 8, -.4, KLX + 4.2, 5.4, 5.3, 42], [KLX + 4.4, 7.8, .4, KLX + 4.2, 5.4, 5.3, 40], L.k); }, [[0, 'whirl', .3], [.3, 'gasp_f', .6], [1.2, 'heartbeat', .4]]);
// 53 «In der Nacht klopfte sie an meine Tür»: pasillo de noche, Mira llama a mi puerta
shot(81.97, 'F', null, L => { use('FL'); night(); inside(.55, 20); const m = put(mira, FLX - 9.6, 0, -9.8, -PI / 2 + .5); const kn = Math.max(0, Math.sin(L.lt * 11)); actuar(m, L.lt, [[0, { aRx: 1.7, aRe: .6 + kn * .6, aRz: -.15, aLx: .3 }]], { T: L.T }); cara(m, L.T, { expr: 'worried', eyes: 'side_l' });
  cm([FLX - 5, 7, 6, FLX - 10, 5.6, -8.5, 48], [FLX - 5.5, 6.8, 4, FLX - 10, 5.6, -8.5, 46], L.k); }, [[0, 'flash', .2], [.15, 'knock', .6], [.9, 'knock', .5], [1.3, 'owl', .2]]);
// 54 «Können wir die Zimmer tauschen? Nur heute Nacht?»: abro; Mira con las manos juntas, suplicando
shot(83.66, 'W', null, L => { use('FL'); night(); inside(.55, 20); FL.doors[1].rotation.y = 1.3; const m = put(mira, FLX - 8.4, 0, -10, -PI / 2 + .5); actuar(m, L.lt, [[0, { aLx: 1.6, aRx: 1.6, aLz: -.4, aRz: -.4, aLe: 1.4, aRe: 1.4, headZ: .2 }]], { T: L.T }); talk(m, L.T, 83.6, 85.8, 'worried');
  const me = put(ich, FLX - 12, 0, -8.6, PI / 2 - .5); cara(me, L.T, { expr: 'confused' }); bubble(m, 'Tauschen?', (L.lt - .3) * 3);
  cm([FLX - 4, 7, 5, FLX - 10, 5.6, -9, 46], [FLX - 4.4, 6.8, 3.6, FLX - 10, 5.6, -9, 44], L.k); }, [[0, 'swipe', .3], [.1, 'door_open', .5], [.6, 'whisper', .4]]);
// 55 «Ich sagte ja»: asiento con la cabeza
shot(85.83, 'C', 'punch', L => { use('FL'); night(); inside(.55, 20); FL.doors[1].rotation.y = 1.3; const me = put(ich, FLX - 11.4, 0, -8.6, PI / 2 - .5); actuar(me, L.lt, [[0, { headX: Math.max(0, Math.sin(L.lt * 12)) * .35 }]], { T: L.T }); cara(me, L.T, { expr: 'happy', mouth: 'smirk' });
  onFace(me, 9, -1.2, .6, 42, L.k, 8); }, [[0, 'impact', .3], [.2, 'ding_soft', .4]]);
// 56 «Natürlich sagte ich ja»: le doy la llave, me pongo rojo; corazoncitos
shot(86.69, 'S', null, L => { use('FL'); night(); inside(.55, 20); FL.doors[1].rotation.y = 1.3; const me = put(ich, FLX - 11, 0, -8.6, PI / 2 - .5); actuar(me, L.lt, [[0, { aRx: 1.5, aRe: .3, aLx: .4, headZ: .15 }]], { T: L.T }); cara(me, L.T, { expr: 'happy', eyes: 'happy', mouth: 'grin', blush: 1 }); inHand(KEY_, me, 'R', [0, -.7, .4]);
  const m = put(mira, FLX - 7.4, 0, -9.6, -PI / 2 + .5); actuar(m, L.lt, [[0, { aLx: 1.4, aLe: .4 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'smirk' }); const hp_ = hp(me);
  HEARTS.forEach((z, i) => { const k = (L.T * .6 + i / 5) % 1; z.visible = true; z.position.set(hp_.x + Math.sin(i * 1.7 + L.T) * 1.4, hp_.y + 1 + k * 3.4, hp_.z + .4); z.scale.setScalar(.5 + k * .7); z.material.opacity = 1 - k; z.lookAt(camera.position); });
  orb(L.k, V(FLX - 9.2, 4.8, -8), null, [12, .25, .08, 44], [11, -.05, .08, 44]); }, [[0, 'swipe', .3], [.3, 'keys', .5], [.6, 'sparkle', .4]]);
// 57 «Am Morgen öffnete ich meine alte Tür»: la puerta se abre desde dentro de mi antigua habitación; luz de mañana
shot(87.98, 'F', null, L => { use('ZA'); inside(1.0, 50); ZA.door.rotation.y = -1.4 * easeOut(clamp(L.lt / .6)); const me = put(ich, ZAX + 7, 0, 13.6 - easeOut(clamp(L.lt / 1.4)) * 1.5, PI); cara(me, L.T, { expr: 'happy' });
  cm([ZAX + 4, 7, -2, ZAX + 7, 5.2, 12, 46], [ZAX + 4.6, 6.8, 0, ZAX + 7, 5.2, 12, 44], L.k); }, [[0, 'flash', .3], [.1, 'door_open', .6], [.6, 'birds', .3]]);
// 58 «Mira lag auf dem Boden, eine Schere neben ihr» (zoom lento): Mira tendida en el suelo, las tijeras al lado; yo en la puerta
shot(89.95, 'C', 'slow', L => { use('ZA'); inside(.9, 40); ZA.door.rotation.y = -1.4; lie(mira, ZAX + 1, .55, 0, PI / 2 + .3); applyPose(mira, { aLz: .5, aRz: .3, aLx: .3, lLx: .1, lRx: -.1 }); cara(mira, L.T, { eyes: 'closed', mouth: 'flat', noBlink: 1 });
  show(SCI, ZAX + 2.6, .1, 3.2, .7, 1.2); const me = put(ich, ZAX + 7, 0, 11.4, PI); actuar(me, L.lt, [[0, 'shock'], [.8, 'hands_head', { dur: .3 }]], { T: L.T }); cara(me, L.T, { expr: 'shock', eyes: 'terror', mouth: 'scream' });
  cm([ZAX - 4, 12, 8, ZAX + 1.5, 1, .5, 52], [ZAX - 3.4, 11, 6.5, ZAX + 1.5, 1.2, .5, 50], L.k); }, [[0, 'slam', .4], [.2, 'gasp', .6], [1.0, 'heartbeat', .5]]);
// 59 «An der Wand dahinter standen fünf Zahlen»: la cámara sube a la pared: los números en rojo
shot(92.35, 'W', null, L => { use('ZA'); inside(.9, 40); ZA.nums.visible = true; lie(mira, ZAX + 1, .55, 0, PI / 2 + .3); applyPose(mira, { aLz: .5, aRz: .3 }); cara(mira, L.T, { eyes: 'closed', mouth: 'flat', noBlink: 1 }); show(SCI, ZAX + 2.6, .1, 3.2, .7, 1.2);
  const me = put(ich, ZAX - 5, 0, 2, -2.6); actuar(me, L.lt, [[0, 'point']], { T: L.T }); cara(me, L.T, { expr: 'shock' });
  cm([ZAX - 2, 6, 14, ZAX, 4, -4, 50], [ZAX, 10, 9, ZAX, 10, -12, 50], L.k); }, [[0, 'swipe', .3], [.3, 'creepy_ting', .5]]);
// 60 «mit Lippenstift geschrieben»: me agacho junto al pintalabios abierto en el suelo
shot(94.41, 'Z', 'punch', L => { use('ZA'); inside(.9, 40); ZA.nums.visible = true; show(LIP, ZAX + 1, 0, -10.6, 0, 1.6); LIP.rotation.z = PI / 2; const me = put(ich, ZAX + 3.6, 0, -9.4, -1.9); applyPose(me, { crouch: 1.4, lean: .5, aRx: 1.3, aRe: .3, headX: .5 }); cara(me, L.T, { expr: 'worried', eyes: 'down' });
  cm([ZAX - 2, 3.2, -4, ZAX + 1.4, 1, -10.4, 42], [ZAX - 1.4, 3, -5, ZAX + 1.4, 1, -10.4, 40], L.k); }, [[0, 'impact', .4], [.2, 'lid_click', .5]]);
// 61 «3, 1, 7, 7, 0»: los números de la pared de frente; cada cifra salta al decirla
shot(95.8, 'C', 'punch', L => { use('ZA'); inside(.9, 40); ZA.nums.visible = true; const me = put(ich, ZAX - 3, 0, -2, PI + .3); cara(me, L.T, { expr: 'worried' }); applyPose(me, { headX: -.15 });
  [95.8, 96.26, 96.98, 97.49, 98.1].forEach((t, i) => badge('red', '31770'[i], W / 2 + (i - 2) * 160, H * .46, (L.T - t) * 4, 1, 1.1));
  cm([ZAX + 1, 11, 6, ZAX, 10.4, -12, 46], [ZAX + .6, 10.8, 3.6, ZAX, 10.4, -12, 44], L.k); }, [[0, 'impact', .5], [.46, 'pop', .5], [1.18, 'pop', .5], [1.69, 'pop', .5], [2.3, 'pop', .6]]);
// ---------- c: el juicio, OLLIE, la ejecución con pelotas de tenis y el final (98,47 – 157,5 s) ----------
const ROPE = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0xc8a060, { roughness: 1 }); for (let k = 0; k < 4; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1.35, .14, 6, 20), m); r.rotation.x = PI / 2; r.position.y = 1.7 + k * .78; r.scale.set(1.05, 1, .85); g.add(r); } return g; })();
const PILE = (() => { const t = canvasTexBalls(); const m = new THREE.Mesh(new THREE.SphereGeometry(3.4, 24, 12, 0, PI * 2, 0, PI / 2), mat(0xffffff, { map: t, roughness: .7 })); scene.add(m); return m; })();
function canvasTexBalls() { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#b8d020'; x.fillRect(0, 0, 256, 256); for (let i = 0; i < 160; i++) { const px = (i * 47) % 256, py = (i * 83) % 256; x.fillStyle = i % 2 ? '#d8f03a' : '#c8e030'; x.beginPath(); x.arc(px, py, 14, 0, 7); x.fill(); x.strokeStyle = '#f4f4e8'; x.lineWidth = 2; x.beginPath(); x.arc(px - 6, py, 10, -1, 1); x.stroke(); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 1); return t; }
PROPS.push(ROPE, PILE);
const headCam = (ch, back = 3, up = 5, side = 1.5, fov = 44, tgt = 0) => { const h = hp(ch), f = ch.root.position, d = V(h.x - f.x, 0, h.z - f.z).normalize(), sd = V(-d.z, 0, d.x); cam([h.x + d.x * back + sd.x * side, h.y + up, h.z + d.z * back + sd.z * side], [h.x - d.x * tgt, h.y, h.z - d.z * tgt], fov); };
const ICHP = () => { const [x, z] = ring(0); return V(x, 0, z); };
const scrDraw = (key, fn) => GR.scr.userData.s.userData.draw(key, fn);
const faces12 = (c, w, h, hl = -1, mark = null) => { c.fillStyle = '#1a0a1a'; c.fillRect(0, 0, w, h); const cols = ['#7a4a26', '#3a6ae8', '#e0302a', '#1a1414', '#8a4ad8', '#f0b088', '#b8a0d8', '#5a3a1e', '#f0d870', '#2a2018', '#101014', '#4a2a14'];
  for (let i = 0; i < 12; i++) { const x = (i % 6) * w / 6 + w / 12, y = Math.floor(i / 6) * h / 2 + h / 4, r = h * .17; c.globalAlpha = hl < 0 || hl === i ? 1 : .3; c.fillStyle = cols[i]; c.fillRect(x - r, y - r, r * 2, r * .8); c.fillStyle = '#f2c8a8'; c.fillRect(x - r * .8, y - r * .3, r * 1.6, r * 1.2); c.fillStyle = '#111'; c.fillRect(x - r * .4, y + r * .05, r * .2, r * .2); c.fillRect(x + r * .2, y + r * .05, r * .2, r * .2); }
  c.globalAlpha = 1; if (mark) { c.font = `700 ${h * .3}px Cap`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 16; c.strokeStyle = '#000'; c.strokeText(mark[0], w / 2, h / 2); c.fillStyle = mark[1]; c.fillText(mark[0], w / 2, h / 2); } };
const trialKids = (L, gest = i => 'idle', face = i => ({ expr: 'worried' }), skip = [1, 5]) => KIDS.forEach((c, i) => { if (skip.includes(i)) return; atPod(c, i, L, [[0, gest(i)]], face(i)); });

// 62 «Der Bär hüpfte neben mich»: el osito entra dando saltitos y se planta a mi lado delante de los números
shot(98.47, 'W', null, L => { use('ZA'); inside(.9, 40); ZA.nums.visible = true; const me = put(ich, ZAX - 3, 0, -4, PI + .2); actuar(me, L.lt, [[0, 'idle'], [.6, 'recoil', { dur: .25 }]], { T: L.T }); cara(me, L.T, { expr: L.lt > .6 ? 'shock' : 'worried' });
  const k = clamp(L.lt / 1.1), hop = Math.abs(Math.sin(L.lt * 9)) * 1.6 * (1 - k * .7); bear(lerp(ZAX + 10, ZAX + 1.6, easeOut(k)), hop, lerp(4, -4.4, easeOut(k)), -.6, { legs: L.T * 12, aL: 1, aR: 1, mouth: .6 }, .95);
  cm([ZAX - 1, 7, 12, ZAX, 4.5, -4, 48], [ZAX - .5, 6.6, 10, ZAX, 4.5, -4, 46], L.k); }, [[0, 'swipe', .3], [.1, 'jump_small', .5], [.4, 'jump_small', .5], [.7, 'jump_small', .5], [1.0, 'land', .4]]);
// 63 «Na endlich!»: brazos arriba, confeti; yo me aparto
shot(99.99, 'Z', 'punch', L => { use('ZA'); inside(.9, 40); ZA.nums.visible = true; bear(ZAX + 1.6, Math.abs(Math.sin(L.lt * 8)) * .8, -4.4, -.3, { aL: 2.7, aR: 2.7, aLz: .8, aRz: .8, mouth: .9, glow: 2.2 }, .95); confetti(V(ZAX + 1.6, 2, -4.4), 0, L.lt, 40, .8);
  const me = put(ich, ZAX - 3, 0, -4, PI - .3); actuar(me, L.lt, [[0, 'recoil']], { T: L.T }); cara(me, L.T, { expr: 'shock' }); orbit(V(ZAX + 1.6, 4, -4.4), lerp(11, 9.5, L.k), -.1, .1, 44); }, [[0, 'party_horn', .5], [.1, 'confetti', .5], [.3, 'evil_laugh', .4]]);
// 64 «Jetzt gibt’s ein Klassengericht» (zoom lento): la sala del juicio desde arriba; la cámara baja hacia el anillo y el trono
shot(101.01, 'F', 'slow', L => { use('GR'); inside(.7, 25); trialKids(L, i => i % 2 ? 'cross' : 'idle', i => ({ expr: 'scared' })); bear(GRX, 6, -24, 0, { sit: 1, aL: 1.6, aR: 1.6, aLz: .9, aRz: .9, mouth: tedM(L.T, 101, 102.7), glow: 2 }, 1.3);
  cm([GRX, 32, 22, GRX, 2, -6, 50], [GRX, 18, 20, GRX, 4, -8, 48], L.k); }, [[0, 'flash', .3], [.1, 'choir', .5], [.5, 'curtain', .4]]);
// 65 «Ihr stimmt ab, wer es war»: los alumnos pulsan sus botones; en la gran pantalla las 12 caras
shot(102.68, 'W', null, L => { use('GR'); inside(.7, 25); scrDraw('f12', (c, w, h) => faces12(c, w, h)); trialKids(L, i => ({ aRx: 1.1 + Math.max(0, Math.sin(L.T * 6 + i)) * .3, aRe: .6, headX: .3 }), i => ({ expr: 'worried', eyes: 'down' }));
  bear(GRX, 6, -24, 0, { sit: 1, aR: 2, mouth: tedM(L.T, 102.6, 104.2) }, 1.3); cm([GRX - 10, 12, 14, GRX, 14, -24, 50], [GRX - 7, 13, 12, GRX, 15, -24, 50], L.k); }, [[0, 'swipe', .3], [.2, 'button', .5], [.5, 'button', .4], [.8, 'beep', .4], [1.1, 'button', .4]]);
// 66 «Habt ihr recht, wird nur der Täter bestraft»: la pantalla marca a uno solo: «RICHTIG»
shot(104.17, 'C', 'punch', L => { use('GR'); inside(.7, 25); scrDraw('ok', (c, w, h) => faces12(c, w, h, 7, ['RICHTIG', '#3ae86a'])); bear(GRX, 6, -24, 0, { sit: 1, aR: 2.4, aRz: -.3, mouth: tedM(L.T, 104.1, 106.4), glow: 2 }, 1.3);
  trialKids(L, i => 'idle', i => ({ expr: 'worried' })); cm([GRX + 2, 14, 2, GRX, 18, -26, 46], [GRX + 1.4, 15, -2, GRX, 18.4, -26, 46], L.k); }, [[0, 'impact', .4], [.2, 'chime', .5]]);
// 67 «Liegt ihr falsch, kommt der Täter frei»: la pantalla en rojo «FALSCH»: la verja del internado se abre para una sombra
shot(106.37, 'W', null, L => { town(); gate(easeOut(clamp(L.lt / 1.2))); DARK = .35; TINT = 'rgba(60,0,40,.25)'; walkC(reich, L.lt, 0, -30, 0, 3, L.T); cara(reich, L.T, { expr: 'smug', mouth: 'smirk' });
  badge('red', 'FALSCH', W / 2, H * .2, (L.lt - .1) * 3, 1, .9); cm([4, 6, -6, 0, 5, -26, 46], [3, 5.8, -9, 0, 5, -26, 44], L.k); sh(V(0, 0, -24)); }, [[0, 'buzzer', .5], [.3, 'metal_creak', .5], [.8, 'steps', .4], [1.6, 'evil_laugh', .3]]);
// 68 «und alle anderen werden bestraft»: alarma roja en la sala; todos se agarran la cabeza
shot(108.92, 'R', 'punch', L => { use('GR'); inside(.6, 20); scrDraw('bad', (c, w, h) => faces12(c, w, h, -1, ['ALLE', '#ff2030'])); TINT = Math.floor(L.T * 4) % 2 ? 'rgba(255,0,30,.25)' : 'rgba(255,0,30,.08)';
  trialKids(L, i => i % 2 ? 'hands_head' : 'shock', i => ({ expr: 'scared', eyes: 'terror', mouth: 'scream' })); bear(GRX, 6, -24, 0, { sit: 1, aL: 1.4, aR: 1.4, mouth: .9, glow: 3 }, 1.3);
  orb(L.k, V(GRX, 4, 0), null, [24, .8, .35, 50], [22, .3, .3, 50]); }, [[0, 'alarm', .5], [.2, 'scream_girl', .4], [.6, 'gasp', .4], [1.2, 'alarm_soft', .4]]);
// 69 «Es war mein Zimmer»: yo en mi atril, sudando
shot(110.86, 'Z', null, L => { use('GR'); inside(.7, 25); const me = atPod(ich, 0, L, [[0, { aLx: 1.2, aRx: 1.2, aLe: .5, aRe: .5, lean: .1 }]], { expr: 'scared', mouth: 'grimace' }); sweat(me, L.T, 2);
  const p = ICHP(); cam([p.x + 1.4, 6.8, p.z - lerp(9, 7.6, L.k)], [p.x, 5.4, p.z], 42); }, [[0, 'zoom_in', .3], [.2, 'heartbeat', .5]]);
// 70 «Also zeigten alle auf mich»: todos me señalan desde sus atriles
shot(111.96, 'C', 'punch', L => { use('GR'); inside(.7, 25); const p = ICHP(); KIDS.forEach((c, i) => { if (i === 1 || i === 5) return; const [x, z] = ring(i); put(c, x, 0, z, i ? Math.atan2(p.x - x, p.z - z) : PI); actuar(c, L.lt, [[0, i ? 'point' : 'shock']], { T: L.T + i }); cara(c, L.T + i, i ? { expr: 'angry', mouth: 'talk_wide' } : { expr: 'scared', eyes: 'terror', mouth: 'scream' }); });
  cam([p.x - 2.4, 8.6, p.z + 3.4], [GRX, 4.4, -2], 52); }, [[0, 'impact', .5], [.1, 'shout_m', .5], [.5, 'gasp', .3]]);
// 71 «Alle – außer einem stillen Mädchen mit Kopfhörern»: ella con los brazos cruzados, sin señalar; los de al lado sí señalan
shot(113.66, 'W', null, L => { use('GR'); inside(.7, 25); const p = ICHP(); KIDS.forEach((c, i) => { if ([0, 1, 5].includes(i)) return; const [x, z] = ring(i); put(c, x, 0, z, i === 6 ? ring(6)[2] : Math.atan2(p.x - x, p.z - z)); actuar(c, L.lt, [[0, i === 6 ? 'cross' : 'point']], { T: L.T + i }); cara(c, L.T + i, i === 6 ? { expr: 'neutral', eyes: 'half', mouth: 'flat' } : { expr: 'angry' }); });
  const [sx, sz] = ring(6); cm([sx + 4, 7.6, sz + 13, sx, 5.6, sz, 44], [sx + 2.6, 7.2, sz + 11, sx, 5.6, sz, 42], L.k); badge3('tag', '?', V(sx, 9.4, sz), (L.lt - .8) * 3); }, [[0, 'swipe', .3], [.4, 'creepy_ting', .4], [1.4, 'hum', .3]]);
// 72 «das sonst nie redete»: se baja los auriculares despacio
shot(116.42, 'Z', 'punch', L => { use('GR'); inside(.7, 25); const s = atPod(still, 6, L, [[0, 'cross'], [.2, { aLx: 2.5, aRx: 2.5, aLz: .4, aRz: .4, aLe: 2, aRe: 2, headX: .1 }, { dur: .4 }]], { expr: 'neutral', eyes: 'half', mouth: 'flat' });
  onFace(s, 7.6, -1.2, .5, 40, L.k, 6.8); }, [[0, 'impact', .3], [.3, 'cloth', .4]]);
// 73 «Sie sagte, ich könne es gar nicht gewesen sein»: habla; todos se giran hacia ella
shot(117.67, 'F', null, L => { use('GR'); inside(.7, 25); const [sx, sz] = ring(6); KIDS.forEach((c, i) => { if ([1, 5].includes(i)) return; const [x, z, ry] = ring(i); put(c, x, 0, z, i === 6 ? ry : lerp(ry, Math.atan2(sx - x, sz - z), easeOut(clamp((L.lt - .2) / .5)))); actuar(c, L.lt, [[0, i === 6 ? { aRx: 1.2, aRz: -.2, aRe: .3 } : 'idle']], { T: L.T + i }); i === 6 ? talk(c, L.T, 117.6, 119.9, 'neutral') : cara(c, L.T + i, { expr: 'shock' }); });
  bubble(still, 'Er war es nicht.', (L.lt - .3) * 3); cm([GRX + 8, 10, 4, sx, 5, sz, 50], [GRX + 6, 9, 2, sx, 5, sz, 48], L.k); }, [[0, 'flash', .2], [.2, 'whisper', .4], [.7, 'gasp', .4]]);
// 74 «Ich schaute mir die Zahlen nochmal an»: miro la foto de los números en mi atril
shot(119.92, 'S', null, L => { use('GR'); inside(.7, 25); const me = atPod(ich, 0, L, [[0, { aRx: 1.5, aRe: 1.3, aLx: 1.5, aLe: 1.3, headX: .35 }]], { expr: 'confused', eyes: 'down' }); show(PHOTO, GRX, 4.6, 10.4, PI, 1.2); PHOTO.rotation.x = .3;
  cam([GRX + .8, 7.6, lerp(2.4, 3.6, L.k)], [GRX, 5.8, 11], 44); }, [[0, 'swipe', .3], [.2, 'paper', .5], [1.0, 'tick', .3]]);
// 75 «Und dann drehte ich das Foto auf den Kopf»: giro la foto 180 grados
shot(121.61, 'R', null, L => { use('GR'); inside(.7, 25); const me = atPod(ich, 0, L, [[0, { aRx: 1.5, aRe: 1.3, aLx: 1.5, aLe: 1.3, headX: .35 }]], { expr: 'determined' }); const r = easeInOut(clamp((L.lt - .4) / .9)) * PI; show(PHOTO, GRX, 4.6, 10.4, PI, 1.2); PHOTO.rotation.set(.3, PI, r);
  cam([GRX + .4, 5.8, 4.6], [GRX, 5, 10.4], 38); }, [[0, 'whirl', .3], [.4, 'paper', .5], [1.3, 'click_metal', .4]]);
// 76 «Kopfüber stand da ein Name»: los números del revés se convierten en letras
shot(123.81, 'C', 'slow', L => { use('GR'); inside(.5, 20); DARK = .55; const r = easeInOut(clamp(L.lt / 1.1));
  BAD_.push({ kind: 'fn', on: true, fn: c => { c.translate(W / 2, H * .42); c.rotate(PI * r); c.font = `700 ${230}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 30; c.strokeStyle = '#3a0010'; c.strokeText('31770', 0, 0); c.fillStyle = '#ff2a5a'; c.fillText('31770', 0, 0); } });
  trialKids(L, i => 'lean_in', i => ({ expr: 'shock' })); bear(GRX, 6, -24, 0, { sit: 1, mouth: .5, glow: 2 }, 1.3);
  cam([GRX, 8, 20], [GRX, 5, 0], 50); }, [[0, 'whoosh', .4], [.4, 'clock_spin', .5], [1.1, 'magic_hit', .5]]);
// 77 «OLLIE»: el nombre gigante; en la pantalla se ilumina su cara
shot(125.27, 'Z', 'punch', L => { use('GR'); inside(.7, 25); scrDraw('ollie', (c, w, h) => faces12(c, w, h, 2, ['OLLIE', '#ffd23f'])); badge('gold', 'OLLIE', W / 2, H * .24, L.lt * 4, 1, 1.2); trialKids(L, i => i === 2 ? 'recoil' : 'shock', i => ({ expr: 'shock' }));
  cm([GRX - 6, 14, 10, GRX, 18, -26, 50], [GRX - 5, 14.4, 8, GRX, 18, -26, 48], L.k); }, [[0, 'impact', .6], [.05, 'braam_short', .6], [.2, 'gasp', .5]]);
// 78 «Ollie, der Tennisspieler» (zoom lento): Ollie en su atril, sudando, con la raqueta a la espalda
shot(125.9, 'F', 'slow', L => { use('GR'); inside(.7, 25); const o = atPod(ollie, 2, L, [[0, { aLx: .3, aRx: .3, headX: .1 }]], { expr: 'scared', eyes: 'side_l', mouth: 'grimace' }); sweat(o, L.T, 2); attach(RACK, o.spine, [.4, .6, -.9], [0, 0, .5], 1);
  badge('tag', 'TENNISSPIELER', W / 2, H * .2, (L.lt - .3) * 3); onFace(o, 10, -1.2, .8, 42, L.k, 7.6); }, [[0, 'flash', .3], [.3, 'heartbeat', .6]]);
// 79 «Er schrie, Mira sei mit der Schere»: Ollie grita y se defiende con los brazos
shot(127.47, 'C', 'punch', L => { use('GR'); inside(.7, 25); const o = atPod(ollie, 2, L, [[0, { aLx: 1.8, aRx: 1.8, aLz: .5, aRz: .5, aLe: .6, aRe: .6, lean: -.1 }]], {}); talk(o, L.T, 127.4, 129.5, 'angry', { mouth: 'scream' }); bubble(o, 'Sie wollte mich…!', (L.lt - .2) * 3);
  onFace(o, 9, -1, -.8, 42, L.k, 8); }, [[0, 'impact', .4], [.1, 'shout_m', .6]]);
// 80 «auf ihn losgegangen» (recuerdo sepia): de noche, Mira se lanza con las tijeras; Ollie para con la raqueta
shot(128.85, 'W', null, L => { use('ZA'); night(); inside(.5, 20); sepia(.75); DARK = .2; const lunge = easeOut(clamp(L.lt / .4)); const m = put(mira, ZAX - 4 + lunge * 2, 0, -2, PI / 2 + .2); actuar(m, L.lt, [[0, { aRx: 2.4, aRe: .4, lean: .3 * lunge, aLx: .6 }]], { T: L.T }); cara(m, L.T, { expr: 'angry', eyes: 'angry', mouth: 'grimace_wide' }); inHand(SCI, m, 'R', [0, -.7, .3], [PI / 2, 0, 0], 1.2);
  const o = put(ollie, ZAX + 2.4, 0, -1.6, -PI / 2 - .2); actuar(o, L.lt, [[0, { aRx: 2.0, aRz: -.4, aRe: .8, aLx: 1.6, lean: -.2 }]], { T: L.T }); cara(o, L.T, { expr: 'scared', eyes: 'terror', mouth: 'scream' }); inHand(RACK, o, 'R', [0, -.4, .2], [PI / 2 + .3, 0, 0]);
  orb(L.k, V(ZAX - .4, 4.4, -1.8), null, [13, .1, .12, 46], [11.5, -.15, .12, 46]); }, [[0, 'swipe', .3], [.2, 'whoosh', .5], [.4, 'metal_hit', .6], [.6, 'scream_girl', .3]]);
// 81 «er habe sich nur gewehrt»: Ollie con las manos en alto, llorando
shot(130.11, 'R', null, L => { use('GR'); inside(.7, 25); const o = atPod(ollie, 2, L, [[0, { aLx: 2.6, aRx: 2.6, aLz: .5, aRz: .5, aLe: .4, aRe: .4, headX: .1 }]], { expr: 'sad', mouth: 'frown' }); const h = hp(o);
  TEAR.forEach((t, i) => { t.visible = true; const k = (L.T * 1.2 + i * .5) % 1; t.position.copy(h).add(V(i ? -.35 : .35, .9 - k * 1.2, .65)); }); onFace(o, 9.5, -1.2, .6, 42, L.k, 8.4); }, [[0, 'whirl', .3], [.3, 'sob', .5]]);
// 82 «Und dann verstanden wir, warum sie das Zimmer tauschen wollte»: me doy cuenta: «!» encima de mi cabeza
shot(131.37, 'Z', 'punch', L => { use('GR'); inside(.7, 25); const me = atPod(ich, 0, L, [[0, 'think'], [1.2, 'shock', { dur: .25 }]], { expr: L.lt > 1.2 ? 'shock' : 'confused', mouth: L.lt > 1.2 ? 'o' : 'flat' });
  badge3('q', '!', hp(me).add(V(0, 3.4, 0)), (L.lt - 1.2) * 4); const p = ICHP(); cam([p.x - 1, 6.8, p.z - lerp(9, 7.4, L.k)], [p.x, 5.6, p.z], 42); }, [[0, 'impact', .4], [.5, 'tick', .3], [1.2, 'ding_soft', .6]]);
// 83 «Sie wollte ihn ausschalten» (recuerdo): Mira avanza de noche por el pasillo con las tijeras hacia la puerta de Ollie
shot(133.98, 'F', null, L => { use('FL'); night(); inside(.45, 15); sepia(.7); const m = walkC(mira, L.lt, FLX + 2, 2, PI, 1.6, L.T, { aRx: 1.2, aRe: .3 }); cara(mira, L.T, { expr: 'angry', eyes: 'squint', mouth: 'smirk' }); inHand(SCI, mira, 'R', [0, -.7, .3], [PI / 2, 0, 0], 1.2);
  cm([FLX + 5, 6, -18, FLX + 2, 5, 0, 46], [FLX + 4, 5.8, -15, FLX + 2, 5, -1, 44], L.k); }, [[0, 'flash', .3], [.1, 'steps', .3], [.6, 'creepy_ting', .4], [1.2, 'heartbeat', .4]]);
// 84 «und es mir anhängen»: en mi habitación, Mira señala mi cama con una sonrisa malvada
shot(135.48, 'W', null, L => { use('ZA'); night(); inside(.5, 20); sepia(.7); const m = put(mira, ZAX - 2, 0, 2, -PI / 2 - .6); actuar(m, L.lt, [[0, 'point']], { T: L.T }); cara(m, L.T, { expr: 'smug', eyes: 'squint', mouth: 'smirk' }); inHand(SCI, m, 'L', [0, -.7, .3], [PI / 2, 0, 0], 1.2);
  ZA.nums.visible = L.lt > .8; orb(L.k, V(ZAX - 2.4, 4.4, 1), null, [12, -2.0, .1, 46], [10.5, -2.3, .1, 46]); }, [[0, 'swipe', .3], [.3, 'evil_laugh', .3], [.9, 'lid_click', .4]]);
// 85 «Der Bär band Ollie an einen Netzpfosten»: pista de tenis de noche; el osito tira de la cuerda
shot(137.01, 'C', 'punch', L => { use('TN'); night(); TN.lights.forEach(l => l.intensity = 75); const px = TNX + 18.5; const o = put(ollie, px, 0, 1.4, PI); applyPose(o, { aLx: -.2, aRx: -.2, aLz: -.1, aRz: -.1, headX: -.1 }); actuar(o, L.lt, [[0, { aLz: -.05, aRz: -.05 }]], { T: L.T, extra: shiver(L.T, 1.5) }); cara(o, L.T, { expr: 'scared', eyes: 'terror', mouth: 'scream' });
  show(ROPE, px, 0, .8); ROPE.scale.setScalar(1 + Math.sin(L.T * 10) * .02); bear(px - 4.5, 0, -1.5, PI / 2 + .3, { aL: 1.4, aR: 1.4, lean: -.3 - Math.max(0, Math.sin(L.lt * 6)) * .2, mouth: .7, glow: 2 }, .95);
  cm([px - 12, 8, 10, px - 2, 4.5, 0, 48], [px - 10, 7.6, 8, px - 2, 4.5, 0, 46], L.k); }, [[0, 'impact', .4], [.2, 'tug', .5], [.6, 'tug', .5], [1.2, 'scream_girl', .2], [1.6, 'evil_laugh', .3]]);
// 86 «Eine Ballmaschine»: la máquina azul entra rodando; el osito pulsa el botón
shot(139.25, 'W', null, L => { use('TN'); night(); TN.lights.forEach(l => l.intensity = 75); const px = TNX + 18.5; const k = easeOut(clamp(L.lt / .9)); show(BM, lerp(TNX + 30, px, k), 0, lerp(26, 20, k), PI); put(ollie, px, 0, 1.4, PI); cara(ollie, L.T, { expr: 'scared' }); show(ROPE, px, 0, .8);
  bear(px + 3.4, 0, 22, -PI / 2, { aR: L.lt > .9 ? 1.6 : 1, mouth: .8 }, .9); cm([px - 10, 8, 32, px, 4, 18, 48], [px - 8, 7.4, 30, px, 4, 18, 46], L.k); }, [[0, 'swipe', .3], [.1, 'wheels', .6], [.9, 'button', .6], [1.0, 'machine_hum', .5]]);
// 87 «feuerte zweitausend Tennisbälle auf ihn»: las pelotas salen en chorro; contador hasta 2000
shot(140.51, 'C', 'punch', L => { use('TN'); night(); TN.lights.forEach(l => l.intensity = 75); const px = TNX + 18.5; show(BM, px, 0, 20, PI); const o = put(ollie, px, 0, 1.4, PI); actuar(o, L.lt, [[0, 'cower']], { T: L.T, extra: shiver(L.T, 2) }); cara(o, L.T, { expr: 'scared', eyes: 'closed', mouth: 'scream' }); show(ROPE, px, 0, .8);
  BALLS.forEach((b, i) => { const ph = (L.lt * 4 + i / BALLS.length) % 1; b.visible = true; b.position.set(px + Math.sin(i * 7) * .8, 2.6 + Math.sin(ph * PI) * 1.4 + Math.cos(i) * .6, lerp(18, 1.8, ph)); });
  badge('num', String(Math.min(2000, Math.round(easeIn(clamp(L.lt / 1.7)) * 2000))), W / 2, H * .2, L.lt * 4, 1, 1); cm([px - 9, 6.6, 12, px, 3.6, 7, 48], [px - 8, 6.2, 11, px, 3.6, 6, 46], L.k); }, [[0, 'impact', .5], [.05, 'machine_shake', .5], [.15, 'kick', .5], [.4, 'kick', .5], [.65, 'kick', .5], [.9, 'kick', .5], [1.15, 'kick', .5], [1.5, 'kick', .5]]);
// 88 «bis er sich nicht mehr bewegte» (zoom lento): la cámara se aleja: Ollie hundido en un montón de pelotas; los alumnos miran tras la valla
shot(142.37, 'F', 'slow', L => { use('TN'); night(); TN.lights.forEach(l => l.intensity = 75); const px = TNX + 18.5; show(BM, px, 0, 20, PI); const o = put(ollie, px, 0, 1.4, PI); applyPose(o, { headX: .7, aLx: -.1, aRx: -.1, lean: .25, crouch: .3 }); cara(o, L.T, { eyes: 'closed', mouth: 'flat', noBlink: 1 }); show(ROPE, px, 0, .8);
  show(PILE, px, 0, 1.8, 0); PILE.scale.set(1, .6 + L.k * .25, 1); [ich, koch, hack, spiel].forEach((c, i) => { put(c, TNX + 29, 0, 4 - i * 4, -PI / 2); actuar(c, L.lt, [[0, i % 2 ? 'hands_face' : 'hands_head']], { T: L.T + i }); cara(c, L.T + i, { expr: 'shock' }); });
  cm([px - 6, 8, 12, px + 2, 3, 1, 46], [px - 12, 12, 22, px + 3, 3, 1, 48], L.k); }, [[0, 'rubble', .4], [.4, 'silence_tick', .4], [1.0, 'sad_tone', .4]]);
// 89 «Hihihi!»: el osito se ríe dando botes encima de la máquina
shot(143.73, 'Z', 'punch', L => { use('TN'); night(); TN.lights.forEach(l => l.intensity = 75); const px = TNX + 18.5; show(BM, px, 0, 20, PI); bear(px, 6.8 + Math.abs(Math.sin(L.lt * 9)) * .8, 20, PI + .3, { aL: 1.8 + Math.sin(L.T * 18) * .3, aR: 1.8 - Math.sin(L.T * 18) * .3, aLz: .3, aRz: .3, mouth: .9, lean: Math.sin(L.T * 12) * .1, glow: 2.4 }, .9);
  orbit(V(px, 9.6, 20), lerp(11, 9.5, L.k), PI + .3, .12, 44); }, [[0, 'evil_laugh', .7], [.2, 'boing_metal', .4], [.6, 'boing_metal', .3]]);
// 90 «Wer ist der Nächste?»: se gira hacia la cámara; el ojo de corazón se enciende al máximo
shot(144.78, 'C', 'punch', L => { use('TN'); night(); TN.lights.forEach(l => l.intensity = 60); const px = TNX + 18.5; show(BM, px, 0, 20, PI); bear(px, 6.8, 20, PI + lerp(.3, 0, easeOut(clamp(L.lt / .4))), { aR: 1.6, aRz: -.1, mouth: tedM(L.T, 144.7, 146), glow: 4, brow: .5, headZ: .15 }, .9); TINT = 'rgba(120,0,30,.18)';
  const h = teddy.head.getWorldPosition(V(0, 0, 0)); cam([h.x + .3, h.y + .4, h.z - lerp(7, 5.4, easeIn(L.k))], [h.x, h.y - .3, h.z], 40); }, [[0, 'slam', .5], [.2, 'creepy_ting', .5], [.9, 'heartbeat', .5]]);
// 91 «In dieser Nacht lag ich in einem Bett»: en la habitación rosa de Mira, tumbado y despierto
shot(145.99, 'I', null, L => { use('ZB'); night(); inside(.4, 15); lie(ich, ZBX - 8, 3.4, -5.6, 0); applyPose(ich, { aLx: .2, aRx: .2, aLz: .3, aRz: .3 }); cara(ich, L.T, { expr: 'sad', eyes: 'half', mouth: 'flat' });
  headCam(ich, lerp(-5, -4.2, L.k), 5, .8, 44, -.8); }, [[0, 'iris_pop', .3], [.3, 'crickets', .4], [1.4, 'clock_tick', .3]]);
// 92 «das nicht meins war»: los pósteres y la colcha rosa de Mira; yo me giro
shot(147.79, 'W', null, L => { use('ZB'); night(); inside(.4, 15); lie(ich, ZBX - 8, 3.4, -5.6, 0); applyPose(ich, { headY: -.6 + Math.sin(L.lt) * .1 }); cara(ich, L.T, { expr: 'sad', eyes: 'side_l' });
  cm([ZBX + 4, 10, 4, ZBX - 2, 9, -12, 48], [ZBX + 2, 10.4, 2, ZBX - 4, 8, -12, 48], L.k); }, [[0, 'swipe', .3], [.4, 'sigh', .4]]);
// 93 «Und ich dachte an den Bären»: mi cara de cerca, mirando al techo
shot(148.98, 'F', null, L => { use('ZB'); night(); inside(.4, 15); lie(ich, ZBX - 8, 3.4, -5.6, 0); cara(ich, L.T, { expr: 'sad', eyes: 'down', mouth: 'frown' }); const h = hp(ich);
  cam([h.x + .3, h.y + lerp(6, 5, L.k), h.z + 1.2], [h.x, h.y, h.z + .2], 40); }, [[0, 'flash', .2], [.3, 'lullaby', .4]]);
// 94 «Fünf Jahre lang lag er jede Nacht neben mir» (recuerdo cálido): yo de pequeño abrazado al osito de peluche
shot(150.08, 'F', 'slow', L => { use('KZ'); inside(.5, 20); grade.uniforms.sepia.value = .25; const me = lie(ich, KZX, 3.3, -4.6, 0); ich.root.scale.setScalar(.62); applyPose(me, { aLx: .7, aRx: .7, aLz: -.5, aRz: -.5, aLe: 1.7, aRe: 1.7 }); cara(me, L.T, { expr: 'happy', eyes: 'closed', mouth: 'smirk', noBlink: 1 });
  { const h = hp(ich); show(TOY, h.x + 1.6, 2.4, h.z, -.5, .8); } TOY.rotation.z = .3; badge('tag', '5 JAHRE', W / 2, H * .2, (L.lt - .2) * 3);
  ZZZ.forEach((z, i) => { const k = (L.T * .5 + i / 3) % 1; z.visible = true; z.position.set(KZX - 1 + k * 2, 5 + k * 3, -6 + i * .2); z.scale.setScalar(.5 + k); z.material.opacity = 1 - k; z.lookAt(camera.position); });
  headCam(ich, lerp(-3.4, -2.8, L.k), 3.6, .4, 44, -1.5); }, [[0, 'flash', .3], [.2, 'lullaby', .5], [1.2, 'snore', .2]]);
// 95 «in meinem Kinderzimmer»: el cuarto de niño entero con la lucecita de noche
shot(152.11, 'W', null, L => { use('KZ'); inside(.5, 20); grade.uniforms.sepia.value = .25; const me = lie(ich, KZX, 3.3, -4.6, 0); ich.root.scale.setScalar(.62); applyPose(me, { aLx: .7, aRx: .7, aLz: -.5, aRz: -.5, aLe: 1.7, aRe: 1.7 }); cara(me, L.T, { eyes: 'closed', mouth: 'smirk', noBlink: 1 });
  { const h = hp(ich); show(TOY, h.x + 1.6, 2.4, h.z, -.5, .8); } TOY.rotation.z = .3; headCam(ich, -7, 6, lerp(-4, -2, L.k), 50, 1); }, [[0, 'swipe', .3], [.4, 'chime', .3]]);
// 96 «Jetzt wollte er mich zum Mörder machen» (zoom lento): el osito en su trono a oscuras; solo brilla el ojo de corazón
shot(153.82, 'C', 'slow', L => { use('GR'); inside(.2, 8); DARK = .35; bear(GRX, 6, -24, 0, { sit: 1, aL: .6, aR: .6, mouth: .25, glow: 3 + L.k * 3, brow: .5, headX: .1 }, 1.3);
  const h = teddy.head.getWorldPosition(V(0, 0, 0)); cam([h.x, h.y + .8, h.z + lerp(16, 8, easeIn(L.k))], [h.x, h.y - .6, h.z], 42); }, [[0, 'slam', .4], [.2, 'heartbeat', .6], [1.2, 'creepy_ting', .4]]);
// 97 «Und trotzdem vermisse ich ihn»: en la cama de Mira abrazo el osito pequeño; una lágrima. La cámara se aleja
shot(155.72, 'F', null, L => { use('ZB'); night(); inside(.45, 18); lie(ich, ZBX - 8, 3.4, -5.6, .3); applyPose(ich, { aLx: .7, aRx: .7, aLz: -.5, aRz: -.5, aLe: 1.7, aRe: 1.7 }); cara(ich, L.T, { expr: 'sad', eyes: 'closed', mouth: 'frown', noBlink: 1 }); { const h = hp(ich); show(TOY, h.x + 1.5, 3.3, h.z - .4, -.4, .8); } TOY.rotation.z = .4;
  const h = hp(ich); TEAR.forEach((t, i) => { if (i) return; t.visible = true; const k = (L.T * .7) % 1; t.position.copy(h).add(V(.45, .3, .3 - k * .8)); });
  headCam(ich, lerp(-3.4, -6, L.k), lerp(3.6, 6.5, L.k), .8, 44, -.6); }, [[0, 'flash', .2], [.3, 'sob', .4], [.8, 'lullaby', .4], [1.5, 'piano_note', .4]]);
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
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, -9); FILL.intensity *= 2.6;
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
  if (VIDEO) { const c = octx; c.save(); c.fillStyle = 'rgba(0,0,0,.18)'; for (let y = (Math.floor(T * 60) % 6); y < H; y += 6) c.fillRect(0, y, W, 2); c.fillStyle = 'rgba(40,0,20,.12)'; c.fillRect(0, 0, W, H);
    c.lineWidth = 10; c.strokeStyle = 'rgba(255,255,255,.85)'; const m = 70; for (const [x, y, dx, dy] of [[m, m + 200, 1, 1], [W - m, m + 200, -1, 1], [m, H * .66, 1, -1], [W - m, H * .66, -1, -1]]) { c.beginPath(); c.moveTo(x, y + dy * 90); c.lineTo(x, y); c.lineTo(x + dx * 90, y); c.stroke(); }
    if (Math.floor(T * 2) % 2 === 0) { c.fillStyle = '#ff2030'; c.beginPath(); c.arc(m + 50, m + 260, 18, 0, 7); c.fill(); } c.font = `700 52px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = '#fff'; c.fillText('REC', m + 82, m + 262); c.restore(); }
  for (const b of BAD_) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;
window.DBG = { renderer, composer, bloom, sun, grade, scene, camera };

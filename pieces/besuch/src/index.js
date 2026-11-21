// BESUCHSTAG — «In dieser Stadt bekommt jeder, der stirbt, noch einen Tag mehr»: planos sincronizados con audio/words.json (1080×1920, 30 fps).
// Hufenbach en invierno (nieve), la Stube de la familia (espejos con sábanas), el Mühlenteich al atardecer (hielo con reflejo real) y el cementerio.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl, textPlane, outline } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt } from './props.js';
import { makeKumpel } from './gvolk.js';
import { hufenbach, townhouse, taxi } from './gort.js';
import { bus } from './pech.js';
import { makeNoah, makeMia, makePapaB, makeMamaB, makeOpa, makeOmaB, makeKind } from './bcast.js';
import { NOREFL, winterize, snowman, lights, bareTree, prints, stube, teich, friedhof, calendar, pancakes, onion, newspaper, ruleBoard, katze, sparkles, drawCal } from './bsets.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, GEST, actuar, mirar, caminar, saltar, aire, bandada, camaraEnMano, shiver } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 100.3, U = W / 720;
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
// Hufenbach (x = 0) en invierno: plaza x ∈ [-64, 52], z ∈ [-80, 70]; Rathaus al norte; carretera x = 26 hacia +z; casa de la familia HB.HAUS (4, 96, mira a +x, porche con luces).
// Stube (X = 900): salón-cocina, paredes x ±20, fondo z = -15, abierto a +z. Mühlenteich (X = 1400): hielo r = 34 en el centro, molino al norte. Friedhof (X = 1800).
const STX = 900, TX = 1400, FX = 1800;
const HB = hufenbach(scene); winterize(HB.G); const ST = stube(scene, STX), TE = teich(scene, TX), FH = friedhof(scene, FX);
const SETS = { HB: HB.G, ST: ST.g, TE: TE.g, FH: FH.g };
for (const k in SETS) outline(SETS[k], 1.4);
[HB.RANK, HB.KINO, HB.BOX, HB.PRICE].forEach(o => o && (o.visible = false));
townhouse(HB.G, -64, -21, 13, 3, 11, Math.PI / 2); townhouse(HB.G, -64, -34.5, 13, 2, 12, Math.PI / 2);
for (let i = 0, x = -100; x <= 90; x += 17, i++) townhouse(HB.G, x, -126, 16, 2 + (i % 3), 20 + i, 0);
for (let i = 0, z = 130; z < 260; z += 18, i++) townhouse(HB.G, 0, z, 16, 2 + (i % 2), 60 + i, Math.PI / 2);
for (let i = 0, z = 80; z < 260; z += 18, i++) townhouse(HB.G, 54, z + 40, 16, 2 + (i % 3), 70 + i, -Math.PI / 2);
winterize(HB.G);
// porche de la casa: guirnalda de luces y muñeco de nieve en el jardín (local de HB.HAUS: fachada z = 7, puerta x ≈ 4.7)
const PL = lights(HB.HAUS, [-11, 12.5, 7.6], [11, 12.5, 7.6], 22, .6); const PL2 = lights(HB.HAUS, [-11, 6.4, 8.2], [11, 6.4, 8.2], 22, .5);
const SNOWM = snowman(HB.HAUS, -7, 16, 0, .7);
const RULE = ruleBoard(HB.G); RULE.position.set(-20, 0, 4); RULE.rotation.y = .35;
const CARS = [taxi(HB.G), taxi(HB.G)]; CARS[1].traverse(o => { if (o.isMesh && o.material.color && o.material.color.getHex() === 0xf6c81a) { o.material = o.material.clone(); o.material.color.setHex(0x2a6ad8); } });
// huellas en el estanque: Mia (pequeñas, desde el pueblo hasta la orilla)
const FPM = prints(TE.g, [[14, 90], [12, 60], [6, 44], [2, 37]], 'small', 1.1);
const SUNM = sphere(40, new THREE.MeshBasicMaterial({ color: 0xfff0b0, fog: false, toneMapped: false }), scene, TX + 60, 60, -1500, 24, 16); SUNM.visible = false;
// ---------- reparto ----------
const ich = makeNoah(scene), mia = makeMia(scene), papa = makePapaB(scene), mama = makeMamaB(scene), opa = makeOpa(scene), oma = makeOmaB(scene);
const KD = Array.from({ length: 4 }, (_, i) => makeKind(scene, i)); const K = Array.from({ length: 8 }, (_, i) => makeKumpel(scene, i));
kitFace(ich, 'kid'); kitFace(mia, 'girl'); kitFace(papa, 'plain'); kitFace(mama, 'girl'); kitFace(opa, 'mustache'); kitFace(oma, 'girl');
KD.forEach((c, i) => kitFace(c, ['kid', 'girl', 'kid', 'girl'][i])); K.forEach((c, i) => kitFace(c, ['plain', 'hero', 'kid', 'plain', 'girl', 'girl', 'kid', 'hero'][i]));
const POOL = [ich, mia, papa, mama, opa, oma, ...KD, ...K]; POOL.forEach(c => outline(c.root, 2));
// ---------- atrezo ----------
const CAL = calendar(scene), PANC = pancakes(scene), PANC2 = pancakes(scene, .8), ONI = onion(scene), NEWS = newspaper(scene), CAT = katze(scene), SPK = sparkles(scene, 70);
const PLATES = Array.from({ length: 5 }, () => { const g = new THREE.Group(); scene.add(g); cyl(1.3, 1.2, .14, mat(0xffffff, { roughness: .3 }), 20, g, 0, .07, 0); const f = sphere(.8, mat([0xe8a850, 0xd8323a, 0x6aa84a][Math.floor(Math.random() * 3)]), g, 0, .3, 0, 12, 8); f.scale.y = .35; return g; });
const CUPS = Array.from({ length: 4 }, (_, i) => { const g = new THREE.Group(); scene.add(g); cyl(.4, .35, .8, mat([0xd84a5a, 0x3a6ab8, 0xffd23f, 0xffffff][i]), 12, g, 0, .4, 0); return g; });
const KNIFE = (() => { const g = new THREE.Group(); scene.add(g); box(.12, .1, 1.4, mat(0xd8dce4, { metalness: .9, roughness: .2 }), .02, g, 0, 0, .7); box(.2, .2, .8, mat(0x2a2a2a), .05, g, 0, 0, -.4); return g; })();
const BOARD = (() => { const g = new THREE.Group(); scene.add(g); box(3, .25, 2, mat(0xc89a60), .1, g, 0, .12, 0); const h = sphere(.5, mat(0xf4e8f4), g, .4, .3, 0, 10, 6); h.scale.y = .4; return g; })();
const PROPS = [CAL, PANC, PANC2, ONI, NEWS, CAT, ...PLATES, ...CUPS, KNIFE, BOARD];
PROPS.forEach(p => p.visible = false);
const SWEAT = Array.from({ length: 3 }, () => sphere(.16, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .85 }), scene, 0, 0, 0, 10, 8));
const TEAR = Array.from({ length: 4 }, () => sphere(.12, mat(0x9fd8ff, { roughness: .05, transparent: true, opacity: .9, emissive: 0x3a7aaa, emissiveIntensity: .4 }), scene, 0, 0, 0, 10, 8));
const DUST = Array.from({ length: 16 }, () => sphere(1, mat(0xf4f8ff, { roughness: 1, transparent: true, opacity: .6, depthWrite: false }), scene, 0, 0, 0, 10, 8));
const HEARTS = Array.from({ length: 5 }, () => { const p = textPlane(1, 1, 64, 64, (c, w, h) => { c.fillStyle = '#ff4a7a'; c.beginPath(); c.moveTo(32, 54); c.bezierCurveTo(-10, 26, 12, -6, 32, 16); c.bezierCurveTo(52, -6, 74, 26, 32, 54); c.fill(); }); p.material.depthWrite = false; p.material.transparent = true; scene.add(p); return p; });
const FX_ = [...SWEAT, ...TEAR, ...DUST, ...HEARTS]; FX_.forEach(p => p.visible = false);
// los visitantes no tienen reflejo
const visitor = (...c) => { for (const x of c) if (!NOREFL.includes(x.root)) NOREFL.push(x.root); };
const unvisit = () => { NOREFL.length = 0; };
// ---------- ambiente ----------
const AIR = aire(scene, 500); const BIRDS = bandada(scene, 9);
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
  for (const p of [...PROPS, ...FX_]) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  CAT.userData.set('calm'); CAT.userData.arch(0); SPK.hide(); unvisit(); ST.MIR.forEach(m => m.sheet.visible = true); TE.HOLE.visible = false; SUNM.visible = false; RULE.visible = false; CARS.forEach(c => c.visible = false); FPM.visible = true; ST.PLUG.position.set(4.8, 1.6, -1.5); ST.PLUG.rotation.set(0, 0, 0); ST.setClock(9, 10); SNOWF = 1;
  for (const k in SETS) SETS[k].visible = false;
  FILL.color.setRGB(1, .96, .91); sun.color.setRGB(1, .95, .86); grade.uniforms.vig.value = .42; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = 1.08; grade.uniforms.sepia.value = 0; DARK = 0; TINT = null; BIRDSON = 1; SHAKE = 0; day(); }
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
function dust(c, T0, T, n = 10, s = 1) { DUST.forEach((d, i) => { if (i >= n) return; const r = RNG(i * 5 + 3), t = T - T0; if (t < 0 || t > 1.2) return; d.visible = true; const a = r() * 6.283, v = (3 + r() * 3) * s; d.position.set(c.x + Math.cos(a) * v * Math.sqrt(t), c.y + .5 + t * 1.6 * s, c.z + Math.sin(a) * v * Math.sqrt(t)); d.scale.setScalar((.7 + t * 2) * s * (.8 + r() * .5)); d.material.opacity = .55 * (1 - t / 1.2); }); }
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
const KEY = /^(Stadt|stirbt|Tag|mehr|Besuchstag|Toten|Sonnenaufgang|Sonnenuntergang|Spiegelbild|Spuren|Schnee|gestorben|Regel|nie|tot|verschwindet|sofort|Abschied|Spiegel|Lieblingsessen|lächeln|dreizehn|Mia|sechs|Winter|Mühlenteich|Eis|verhängt|Radio|ausgesteckt|Apfelpfannkuchen|Unfall|Mias|nie|Zwiebeln|Hand|Socke|fauchte|Papa|einprägen|halb|fünf|Teich|Ufer|weinte|gerettet|geschoben|aufgetaucht|keiner|Spur|Stiefel|bleibt|erinnern|Blick|meiner|Danke|immer|Immer|Namen|fort)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').replace(/^-|-$/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const POST = []; const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
let DARK = 0, TINT = null, SHAKE = 0, THERM = false, SNOWF = 1; const COVERS = [];
let LMODE = 'day'; const town = (m = 'day') => { use('HB'); LMODE = m; if (m === 'night') night(45); else if (m === 'morning') sunset(); else day(); };
// ---------- a: ayudas comunes ----------
const sc_ = ch => ch.spec.scale || 1;
const headC = ch => hp(ch).add(V(0, .65 * sc_(ch), 0));
const stubeOn = (fill = 40) => { use('ST'); inside(1.0, fill); SNOWF = 0; };
const teichOn = () => { use('TE'); sunset(); setSky([.2, .22, .58], [.92, .5, .55], [1, .66, .36]); sun.position; SUNM.visible = true; scene.fog.color.setRGB(1, .78, .66); scene.fog.density = .0016; SNOWF = .35; };
const fhOn = () => { use('FH'); sunset(); setSky([.25, .35, .78], [.75, .6, .78], [1, .8, .6]); SNOWF = .8; };
const SX = x => STX + x, TXX = x => TX + x, FXX = x => FX + x;
// lágrimas que caen de los ojos
function tears(ch, T, n = 2) { const h = hp(ch), s = sc_(ch), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a); for (let i = 0; i < n; i++) { const k = (T * .9 + i * .5) % 1, sd = i % 2 ? -1 : 1; const t = TEAR[i]; t.visible = true; t.position.set(h.x + fx * .62 * s + fz * sd * .32 * s, h.y + (.55 - k * 1.0) * s, h.z + fz * .62 * s - fx * sd * .32 * s); t.scale.set(s, 1.4 * s, s); } }
// caras tristes con lágrimas
const cry = (ch, T, ex = {}) => { cara(ch, T, { expr: 'sad', mouth: 'frown', ...ex }); tears(ch, T); };
// de la mano: brazo derecho de a con brazo izquierdo de b
const handR = { aRx: .35, aRz: -.35, aRe: .2 }, handL = { aLx: .35, aLz: -.35, aLe: .2 };
// gente del pueblo caminando / haciendo cosas (K, KD), en un arco detrás del centro
function folk(cx, cz, lt, T, n = 8, r0 = 8, r1 = 22, seed = 1, o = {}) { const r = RNG(seed); const ac = Math.atan2(camera.position.z - cz, camera.position.x - cx);
  const L = [...K, ...KD].slice(0, n); L.forEach((c, i) => { const a = ac + Math.PI + (r() - .5) * 2.2, d = r0 + r() * (r1 - r0); const x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d, ry = r() * 6.283;
    if (i % 3 === 0 && !o.still) caminar(c, lt + i, { x: x - Math.sin(ry) * 3, z: z - Math.cos(ry) * 3, ry, speed: 2.4, T }); else { put(c, x, 0, z, Math.atan2(camera.position.x - x, camera.position.z - z) + (r() - .5) * 1.4); actuar(c, lt, [[0, [GEST.wave, 'idle', GEST.point, GEST.cheer, GEST.shrug][i % 5]]], { T: T + i }); }
    cara(c, T + i, { expr: o.expr || 'happy' }); }); }
// huellas dinámicas del niño visitante (aparecen según avanza)
const KPR = prints(HB.G, [[-34, 52], [-34, 20]], 'small', 1.1); KPR.visible = false;
const showPrints = (G, k) => { G.visible = true; const n = G.children.length; G.children.forEach((c, i) => c.visible = i < n * k); };
// visitante con brillo suave (borde dorado) — se usa poco, para que el giro no se vea venir
const HOUSE = () => wpos(HB.HAUS);
const hz = (lx, lz) => V(4 + lz, 0, 96 - lx);   // local de HB.HAUS -> mundo
const CAP = (() => { const g = new THREE.Group(); scene.add(g); const m = mat(0x6a5a48, { roughness: .9 }); box(1.5, .38, 1.42, m, .18, g, 0, .2, 0); const b = box(1.3, .12, .8, m, .05, g, 0, .05, .9); outline(g, 1.5); g.visible = false; return g; })();
PROPS.push(CAP);
// ---------- b: gancho, la regla, el pueblo (0 – 28,3 s) ----------
// 1 «In dieser Stadt bekommt jeder,» (zoom lento): calle nevada al amanecer, coches; en el centro Opa vuelve a casa con «+1 TAG» y la gente le saluda
shot(0, 'C', 'slow', L => { town('morning'); SNOWF = 1; const z0 = 175; CARS.forEach((c, i) => show(c, 26 + (i ? 3.5 : -3.5), 0, i ? 215 + L.lt * 14 : 260 - L.lt * 16, i ? 0 : PI));
  caminar(opa, L.lt, { x: 25, z: z0, ry: PI, speed: 2.2, T: L.T }); visitor(opa); cara(opa, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' });
  folk(25, z0 - 6, L.lt, L.T, 9, 5, 14, 3, { expr: 'happy' }); badge('gold', '+1 TAG', W / 2, H * .16, (L.lt - .2) * 3, 1, .9);
  orbit(V(25, 4.5, z0 - L.lt * 2.2), lerp(40, 18, easeOut(L.k)), PI + .15, .1, 50); sh(V(25, 0, z0), 60); }, [[0, 'wind', .5], [.1, 'car_pass', .4], [.4, 'steps_snow', .5], [1.0, 'bells', .4]]);
// 2 «der stirbt,»: cementerio nevado, la tumba de Heinrich con la vela; la cámara se acerca
shot(1.70, 'F', null, L => { fhOn(); SNOWF = 1.2; orbit(V(FXX(0), 4.2, 10), lerp(18, 13, L.k), .15, .1, 46); sh(V(FXX(0), 0, 10), 40); }, [[0, 'bell_far', .6], [.2, 'wind', .5]]);
// 3 «noch einen Tag mehr.»: Opa se levanta junto a su tumba, estira los brazos y sonríe; destellos; «+1 TAG»
shot(2.34, 'Z', 'punch', L => { fhOn(); SNOWF = 1.2; const c = put(opa, FXX(3.6), 0, 13, -.25); visitor(opa); actuar(c, L.lt, [[0, 'slump'], [.15, 'cheer', { dur: .35 }]], { T: L.T }); cara(c, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' });
  SPK.run(hp(c).add(V(0, -4, 0)), clamp(L.lt / 1.2), L.T, 3, 5); badge('gold', '+1 TAG', W / 2, H * .2, (L.lt - .3) * 3, 1, 1);
  orbit(headC(c).add(V(0, -1, 0)), lerp(10, 8.5, L.k), -.2, .05, 44); sh(V(FXX(3), 0, 13), 30); }, [[0, 'magic_hit', .6], [.1, 'sparkle', .6], [.6, 'gasp_old', .4]]);
// 4 «Wir nennen ihn den Besuchstag.»: calendario de enero con el día marcado en rojo «BESUCH»
shot(3.58, 'W', null, L => { stubeOn(); show(CAL, SX(15), 7.2, -14.7); CAL.scale.setScalar(.6); const k = easeInOut(L.k); cam([SX(15 + lerp(-1.2, .3, k)), 7.2, -14.7 + lerp(11, 7.4, k)], [SX(15), 7.2, -14.7], 44);
  badge('tag', 'BESUCHSTAG', W / 2, H * .18, (L.lt - .8) * 3, 1, 1); }, [[0, 'pages', .5], [.9, 'pencil', .6], [1.1, 'ding_soft', .5]]);
// 5 «Die Toten kommen bei Sonnenaufgang heim»: el porche con luces al amanecer; Opa sube los escalones, Mama y los nietos abren y saludan
shot(5.72, 'S', null, L => { town('morning'); const d = hz(4.7, 9.4); const o = caminar(opa, L.lt, { x: d.x + 6, z: d.z, ry: -PI / 2, speed: 1.8, T: L.T }); visitor(opa); cara(opa, L.T, { expr: 'happy', eyes: 'happy', mouth: 'open_smile' }); opa.root.rotation.y = -PI / 2 + .9;
  const m = put(mama, d.x - 1.5, 0, d.z + 2.5, PI / 2 + .3); actuar(m, L.lt, [[0, 'wave']], { T: L.T }); cara(m, L.T, { expr: 'happy', mouth: 'open_smile' }); KD.slice(0, 2).forEach((k, i) => { put(k, d.x - .5, 0, d.z - 2 - i * 2, PI / 2); actuar(k, L.lt, [[0, i ? 'cheer' : 'wave']], { T: L.T + i }); grin(k, L.T); });
  orbit(V(d.x + 2.5, 4, d.z - 1), lerp(26, 20, L.k), PI / 2 + 1.1, .12, 48); sh(d, 40); badge('tag', 'SONNENAUFGANG', W / 2, H * .17, (L.lt - .2) * 3, 1, .8); }, [[0, 'steps_snow', .5], [.3, 'door_open', .5], [.8, 'kids_laugh', .5]]);
// 6 «und gehen bei Sonnenuntergang.»: atardecer: Opa se aleja por la calle y se gira para decir adiós
shot(7.62, 'R', null, L => { town('morning'); setSky([.22, .2, .55], [.9, .45, .5], [1, .6, .3]); sun.color.setRGB(1, .65, .45); caminar(opa, L.lt, { x: 30, z: 120, ry: 0, speed: 2.2, T: L.T, extra: { aRx: 2.4, aRz: .3 } }); visitor(opa); cara(opa, L.T, { expr: 'happy', eyes: 'happy' });
  opa.root.rotation.y = -.8; orbit(V(30, 4, 120 + L.lt * 2.2), lerp(15, 20, L.k), -1.0, .18, 48); sh(V(30, 0, 122), 40); badge('tag', 'SONNENUNTERGANG', W / 2, H * .17, (L.lt - .2) * 3, 1, .8); }, [[0, 'steps_snow', .5], [.5, 'wind', .4]]);
// 7 «Sie essen»: en la mesa: Opa come tortitas con los nietos, Mama sirve
shot(9.42, 'C', null, L => { stubeOn(); show(PANC, SX(-1), 3.1, -2, 0, .55); visitor(opa); const o = put(opa, SX(-1), 0, -7.6, 0); actuar(o, L.lt, [[0, { aRx: 1.2, aRe: 1.5 + Math.sin(L.T * 9) * .3, aLx: .8, aLe: .9 }]], { T: L.T }); cara(o, L.T, { expr: 'happy', mouth: Math.sin(L.T * 9) > 0 ? 'open' : 'flat' });
  KD.slice(0, 2).forEach((k, i) => { put(k, SX(-1 + (i ? 4.6 : -4.6)), 0, -3, i ? -PI / 2 : PI / 2); actuar(k, L.lt, [[0, { aRx: 1.2, aRe: 1.4 + Math.sin(L.T * 8 + i) * .3 }]], { T: L.T + i }); grin(k, L.T); });
  const m = put(mama, SX(-6), 0, -7, .5); actuar(m, L.lt, [[0, 'hold']], { T: L.T }); show(PLATES[0], SX(-6) + .3, 5.4, -5.6).visible = true; attach(PLATES[0], m.aR.hand, [0, -.5, .5], [0, 0, 0], .8); cara(m, L.T, { expr: 'happy' });
  cm([SX(-1), 8.5, 16], [SX(-1), 8, 13], L.k); camera.lookAt(SX(-1), 3.8, -4.5); }, [[0, 'spoon', .5], [.3, 'chew', .5], [.6, 'plate_slide', .4]]);
// 8 «und lachen wie früher.»: primer plano de Opa riendo a carcajadas
shot(10.06, 'Z', 'punch', L => { stubeOn(); visitor(opa); const o = put(opa, SX(-1), 0, -7.6, 0); actuar(o, L.lt, [[0, { lean: -.15 + Math.sin(L.T * 14) * .04, headX: -.2, aLx: .6, aLz: .4, aRx: .6, aRz: .4 }]], { T: L.T }); laughF(o, L.T);
  KD.slice(0, 1).forEach(k => { put(k, SX(3.6), 0, -3, -PI / 2 - .4); laughF(k, L.T); });
  onFace(o, lerp(7, 5.6, L.k), -.4, .8, 40); }, [[0, 'laugh_deep', .6], [.2, 'kids_laugh', .5]]);
// 9 «Aber sie haben kein Spiegelbild,» (zoom lento): Oma Liesel delante del espejo destapado: en el espejo solo sale el niño a su lado
shot(11.32, 'F', 'slow', L => { stubeOn(); ST.MIR[0].sheet.visible = false; visitor(oma); const o = put(oma, SX(-16), 0, -2.6, -PI / 2), k = put(KD[1], SX(-15.6), 0, .6, -PI / 2 + .25); actuar(o, L.lt, [[0, { aRx: 1.3, aRe: 1.6, headZ: .1 }]], { T: L.T }); cara(o, L.T, { expr: 'happy' });
  actuar(k, L.lt, [[0, 'idle'], [1, 'shock', { dur: .3 }]], { T: L.T }); cara(k, L.T, { expr: L.lt > 1 ? 'shock' : 'neutral' });
  cm([SX(-6), 6.5, 6], [SX(-8.5), 6.2, 4], L.k); camera.lookAt(SX(-19.7), 5, -1.4); }, [[0, 'glass_rattle', .4], [.8, 'creepy_ting', .5]]);
// 10 «keine Spuren im Schnee»: nieve en el jardín: Opa y un nieto caminan: solo el niño deja huellas
shot(13.16, 'W', null, L => { town('morning'); const kk = clamp((L.lt + .3) / 1.6); showPrints(KPR, kk * .5); visitor(opa);
  caminar(opa, L.lt + .3, { x: -31, z: 50, ry: PI, speed: 3.6, T: L.T }); caminar(KD[2], L.lt + .3, { x: -34, z: 50, ry: PI, speed: 3.6, T: L.T + 1 }); cara(opa, L.T, { expr: 'happy' }); grin(KD[2], L.T);
  orbit(V(-32.5, 2, 50 - (L.lt + .3) * 3.6 + 3), lerp(20, 16, L.k), PI - .5, .5, 48); sh(V(-32, 0, 44), 30); }, [[0, 'steps_snow', .7], [.6, 'steps_snow', .6]]);
// 11 «und wissen nicht, wie sie gestorben sind.»: Opa lee su propia esquela en el periódico, confundido
shot(14.44, 'R', null, L => { stubeOn(); visitor(opa); const o = put(opa, SX(9), 0, 4, -PI / 2); actuar(o, L.lt, [[0, 'hold']], { T: L.T }); show(NEWS, SX(7.2), 3.9, 4, PI / 2 - PI, .75); NEWS.rotation.set(-.35, PI / 2, 0, 'YXZ'); cara(o, L.T, { expr: 'confused' });
  const k = easeInOut(L.k); cam([SX(11.6 - k * .8), 7.6, 6.2], [SX(7.2), 3.9, 4], 46); badge('q', '?', W * .78, H * .18, (L.lt - .5) * 3, 1, .8); }, [[0, 'paper', .6], [.8, 'creepy_ting', .4]]);
// 12 «Die Regel:»: el tablón de la plaza con la regla Nr. 1 (golpe de zoom)
shot(16.58, 'C', 'punch', L => { town(); RULE.visible = true; folk(-20, 4, L.lt, L.T, 8, 9, 20, 5, { expr: 'worried' }); const p = V(-20, 5, 4); orbit(p, lerp(20, 17, L.k), .35, .1, 44); sh(V(-20, 0, 4), 40); }, [[0, 'impact', .6], [.1, 'paper', .4]]);
// 13 «Sag einem Besucher nie, dass er tot ist.»: un nieto va a hablar; Mama le tapa la boca; Opa sigue comiendo feliz
shot(17.34, 'I', null, L => { stubeOn(); show(PANC, SX(-1), 3.1, -3, 0, .8); visitor(opa); const o = put(opa, SX(-1), 0, -7.6, 0); actuar(o, L.lt, [[0, { aRx: 1.2, aRe: 1.5 + Math.sin(L.T * 9) * .3 }]], { T: L.T }); cara(o, L.T, { expr: 'happy', eyes: 'happy' });
  const k = put(KD[0], SX(4.2), 0, -1.6, -PI / 2 + 1.1), m = put(mama, SX(5.6), 0, -3.4, -PI / 2 + .6); actuar(k, L.lt, [[0, 'point_l'], [.9, 'shock', { dur: .25 }]], { T: L.T }); cara(k, L.T, { expr: L.lt < .9 ? 'talk' : 'shock', mouth: L.lt < .9 ? 'open' : 'o' });
  actuar(m, L.lt, [[0, 'idle'], [.8, { aLx: 1.7, aLz: -.6, aLe: 1.4, lean: .15 }, { dur: .25 }]], { T: L.T }); cara(m, L.T, { expr: 'worried' });
  orbit(V(SX(3.4), 3.2, -2.6), lerp(12, 10, L.k), .35, .12, 46); badge('red', 'NIE!', W / 2, H * .17, (L.lt - 1.0) * 3, 1, .9); }, [[0, 'chew', .4], [.9, 'gasp', .5], [1.1, 'cloth', .5]]);
// 14 «Merkt er es,» (zoom lento): Opa ve la esquela y se da cuenta: cara de shock
shot(19.78, 'F', 'slow', L => { stubeOn(); visitor(opa); const o = put(opa, SX(9), 0, 4, -PI / 2 + .5); actuar(o, L.lt, [[0, 'hold'], [.4, 'shock', { dur: .3 }]], { T: L.T }); cara(o, L.T, { expr: L.lt > .4 ? 'shock' : 'confused' });
  onFace(o, lerp(5.6, 4.2, L.k), -.2, -.6, 40); }, [[.3, 'gasp_old', .6], [.4, 'heartbeat', .5]]);
// 15 «verschwindet er sofort.»: Opa se deshace en destellos; la familia alarga las manos
shot(20.68, 'C', null, L => { stubeOn(); visitor(opa); const o = put(opa, SX(2), 0, -6, .2); const k = clamp((L.lt - .2) / 1.1); o.root.scale.setScalar(sc_(o) * (1 - easeIn(k) * .95)); o.root.visible = k < .98; cara(o, L.T, { expr: 'sad' }); SPK.run(V(SX(2), 0, -6), k, L.T, 3, 7);
  KD.slice(0, 2).forEach((c, i) => { put(c, SX(2 + (i ? 4 : -4)), 0, -2, i ? -.6 : .6); actuar(c, L.lt, [[0, 'reach']], { T: L.T + i }); cara(c, L.T, { expr: 'shock' }); });
  orbit(V(SX(2), 3.6, -4.5), lerp(14, 11, L.k), .1, .12, 46); sh(V(SX(2), 0, -5), 30); }, [[.1, 'magic_hit', .6], [.2, 'sparkle', .7], [.8, 'gasp', .4]]);
// 16 «Ohne Abschied.»: la silla vacía con la gorra de Opa; un nieto llora
shot(22.16, 'S', null, L => { stubeOn(); const k = put(KD[1], SX(-5.6), 0, -9.8, -.6); actuar(k, L.lt, [[0, { headX: .2, aLx: .3, aRx: .3 }]], { T: L.T }); cry(k, L.T); show(CAP, SX(-4), 1.9, -7.6, .3, 1);
  cm([SX(-11.5), 4.2, -3.6], [SX(-10.5), 4, -4.4], L.k); camera.lookAt(SX(-5.2), 2.3, -8.4); }, [[0, 'sad_tone', .6], [.4, 'sniff', .5]]);
// 17 «Darum verhängen Familien jeden Spiegel,»: Papa cuelga la sábana sobre el espejo (cae de arriba abajo)
shot(23.20, 'W', null, L => { stubeOn(); const M = ST.MIR[0]; const k = easeOut(clamp(L.lt / 1.0)); M.sheet.position.y = (1 - k) * 8; const p = put(papa, SX(-16.4), 0, 2.6, .2); actuar(p, L.lt, [[0, { aLx: 2.6, aRx: 2.6, aLe: .3, aRe: .3, headX: -.2 }], [.9, 'idle', { dur: .4 }]], { T: L.T }); cara(p, L.T, { expr: 'sad' });
  cm([SX(-9), 6.5, 13], [SX(-11), 6.2, 11], L.k); camera.lookAt(SX(-18.5), 5, -.2); }, [[0, 'cloth', .7], [.6, 'cloth', .4]]);
// 18 «kochen sein Lieblingsessen»: Mama en el fogón: la tortita vuela de la sartén
shot(25.54, 'Z', null, L => { stubeOn(); const m = put(mama, SX(-12), 0, -9.4, PI - .25); m.root.rotation.y = .25; actuar(m, L.lt, [[0, { aRx: 1.2, aRe: .6, aLx: .9, aLe: 1.2 }], [.3, { aRx: 1.9, aRe: .3 }, { dur: .15 }], [.55, { aRx: 1.2, aRe: .6 }, { dur: .2 }]], { T: L.T }); cara(m, L.T, { expr: 'happy', eyes: 'happy' });
  const fl = clamp((L.lt - .3) / .5); show(PANC2, SX(-12), 3.9 + 4 * fl * (1 - fl) * 3, -12.4).rotation.x = fl * 6.283; PANC2.scale.setScalar(.45);
  cm([SX(-9), 8.5, 1], [SX(-10.5), 8, -2], L.k); camera.lookAt(SX(-12), 5.5, -11); }, [[0, 'pan_sizzle', .7], [.3, 'whoosh_up', .4], [.8, 'plate_slide', .4]]);
// 19 «und lächeln viel zu viel.»: la familia alrededor de Opa con sonrisas exageradas y sudor
shot(26.60, 'R', null, L => { stubeOn(); visitor(opa); const o = put(opa, SX(-1), 0, -7.6, 0); cara(o, L.T, { expr: 'happy' }); actuar(o, L.lt, [[0, 'idle']], { T: L.T });
  const F = [[mama, -3.4, -7.0, .3], [papa, 1.4, -7.0, -.3], [KD[0], -2.3, -9.4, .1], [KD[1], .3, -9.4, -.1]]; F.forEach(([c, x, z, r], i) => { put(c, SX(x), 0, z, r); actuar(c, L.lt, [[0, 'idle']], { T: L.T + i }); grin(c, L.T); }); sweat(papa, L.T, 2);
  orbit(V(SX(-1), 3.8, -7.5), lerp(12, 10, L.k), .05, .3, 50); }, [[0, 'whistle_inno', .4], [.5, 'boing_metal', .3]]);
// 20 «Ich bin dreizehn,»: yo en el porche, saludando; «13»
shot(28.30, 'W', null, L => { town('morning'); const d = hz(4.7, 11); const c = put(ich, d.x, 0, d.z, PI / 2); actuar(c, L.lt, [[0, 'wave']], { T: L.T }); talk(c, L.T, 28.3, 29.8, 'happy');
  orbit(headC(c).add(V(0, -1.5, 0)), lerp(14, 11, L.k), PI / 2 + .3, .08, 44); sh(d, 30); badge('num', '13', W * .5, H * .12, (L.lt - .5) * 3, 1, 1.3); }, [[0, 'steps_snow', .4], [.6, 'pop', .5]]);
// 21 «meine Schwester Mia ist sechs.»: Mia en el jardín lanza una bola de nieve y ríe; «6»
shot(29.80, 'C', null, L => { town('morning'); const d = hz(-4, 19); const c = put(mia, d.x, 0, d.z, PI / 2 + .3); actuar(c, L.lt, [[0, { aRx: 2.6, aRe: 1.2 }], [.5, { aRx: .9, aRe: .2, lean: .2 }, { dur: .2 }]], { T: L.T }); laughF(c, L.T);
  orbit(headC(c).add(V(0, -.6, 0)), lerp(9, 7.5, L.k), PI / 2 + .5, .1, 44); sh(d, 30); badge('num', '6', W * .5, H * .12, (L.lt - .6) * 3, 1, 1.3); }, [[.5, 'whoosh', .4], [.7, 'kids_laugh', .5], [.9, 'pop', .5]]);
// 22 «Letzten Winter» (recuerdo): el Mühlenteich de día, Mia patinando sola sobre el hielo
shot(31.56, 'F', null, L => { teichOn(); day(); SUNM.visible = false; setSky([.6, .66, .78], [.75, .8, .88], [.88, .9, .94]); grade.uniforms.sepia.value = .35; grade.uniforms.sat.value = .9; FPM.visible = false;
  caminar(mia, L.lt, { x: TXX(-6), y: .1, z: 4, ry: .9, speed: 2.4, T: L.T, extra: { aLz: .9, aRz: .9 } }); const c = mia; cara(c, L.T, { expr: 'happy', eyes: 'happy' });
  orbit(V(TXX(-5) + (L.lt * 2.4 * Math.sin(.9)), 2, 4 + L.lt * 2.4 * Math.cos(.9)), lerp(16, 13, L.k), .9, .15, 46); sh(V(TXX(-4), 0, 6), 40); badge('tag', 'LETZTEN WINTER', W / 2, H * .17, (L.lt - .1) * 3, 1, .9); }, [[0, 'wind', .6], [.3, 'freeze', .4]]);
// 23 «brach Mia im Mühlenteich durchs Eis.»: el hielo se rompe: agujero, trozos de hielo y salpicadura
shot(32.12, 'C', 'punch', L => { teichOn(); day(); SUNM.visible = false; setSky([.6, .66, .78], [.75, .8, .88], [.88, .9, .94]); grade.uniforms.sepia.value = .35; grade.uniforms.sat.value = .9; FPM.visible = false; TE.HOLE.visible = true;
  const c = put(mia, TXX(4), -.5 - L.lt * .4, -6, .4); actuar(c, L.lt, [[0, { aLx: 2.9, aRx: 2.6, aLz: .3, aRz: .4, aLe: .4, aRe: .3, headX: -.3 }]], { T: L.T, extra: shiver(L.T, .8) }); cara(c, L.T, { expr: 'shock', mouth: 'o' }); dust(V(TXX(4), 0, -6), 0, L.lt, 12, .6);
  orbit(V(TXX(4), 1, -6), lerp(14, 11, L.k), .3, .45, 46); sh(V(TXX(4), 0, -6), 30); badge('tag', 'MÜHLENTEICH', W / 2, H * .17, (L.lt - .3) * 3, 1, .9); }, [[0, 'glass_crack', .7], [.15, 'splash', .7], [.5, 'scream_girl', .3]]);
// ---------- c: la mañana, el día con Mia, camino al estanque (34,48 – 68,3 s) ----------
const kidsAt = (x, z, ry, gap = 2.3) => { put(ich, x - Math.cos(ry) * gap / 2, 0, z + Math.sin(ry) * gap / 2, ry); put(mia, x + Math.cos(ry) * gap / 2, 0, z - Math.sin(ry) * gap / 2, ry); };
const flashback = () => { grade.uniforms.sepia.value = .35; grade.uniforms.sat.value = .9; };
// 24 «Heute früh:»: me despierto en el sofá, bostezo y me estiro; el reloj marca las 7:15
shot(34.48, 'F', null, L => { stubeOn(); ST.setClock(7, 15); const c = put(ich, SX(9), 0, 6, -.5); actuar(c, L.lt, [[0, { aLx: 2.8, aRx: 2.8, aLz: .3, aRz: .3, aLe: .4, aRe: .4, lean: -.12, headX: -.2 }]], { T: L.T }); cara(c, L.T, { eyes: 'closed', mouth: 'o' });
  cm([SX(4), 5.5, 16], [SX(5), 5, 14], L.k); camera.lookAt(SX(8), 3.4, 4); badge('tag', '7:15', W / 2, H * .15, (L.lt - .1) * 3, 1, .9); }, [[0, 'yawn_big', .5], [.1, 'clock_tick', .4]]);
// 25 «jeder Spiegel verhängt.»: barrido por los espejos tapados con sábanas; yo los miro
shot(34.94, 'W', null, L => { stubeOn(); const c = put(ich, SX(-12.7), 0, 12.8, -PI / 2 + 1.4); actuar(c, L.lt, [[0, 'idle'], [.4, { headY: -.6 }, { dur: .4 }]], { T: L.T }); cara(c, L.T, { expr: 'worried' });
  const k = easeInOut(L.k); cam([SX(-8), 5.5, lerp(19, 17, k)], [SX(-8.5), 5.4, lerp(18, 16, k)], 50); camera.lookAt(SX(-19.7), 4.6, lerp(9, 2, k)); }, [[0, 'cloth', .5], [.5, 'creepy_ting', .4]]);
// 26 «Papa hatte das Radio ausgesteckt.»: Papa tira del enchufe junto al aparador; la radio se calla
shot(36.90, 'S', null, L => { stubeOn(); const k = easeOut(clamp((L.lt - .5) / .3)); ST.PLUG.position.set(4.8 - k * .6, 1.6 + k * .8, -1.5 - k * 1.4);
  const p = put(papa, SX(15.6), 0, -5, PI / 2 - .9); actuar(p, L.lt, [[0, { aRx: .9, aRz: -.1, aRe: .4, lean: .3, crouch: .25 }], [.5, { aRx: 1.4, aRe: 1.4, lean: .05, crouch: .1 }, { dur: .2 }]], { T: L.T }); cara(p, L.T, { expr: 'sad' });
  cm([SX(7), 5.4, -10.5], [SX(8.5), 5, -10], L.k); camera.lookAt(SX(17), 2.6, -5.4); badge('tag', 'RADIO AUS', W / 2, H * .15, (L.lt - .6) * 3, 1, .8); }, [[0, 'radio', .4], [.5, 'click_metal', .7], [.55, 'silence_tick', .4]]);
// 27 «Mama backte Apfelpfannkuchen,»: primer plano de la torre de tortitas de manzana con azúcar glas; vapor
shot(38.84, 'Z', 'punch', L => { stubeOn(); show(PANC, SX(-1), 3.1, -3, L.lt * .3, 1); orbit(V(SX(-1), 4.4, -3), lerp(7.5, 6, L.k), .3, .35, 42); }, [[0, 'pan_sizzle', .6], [.3, 'steam', .4], [.8, 'plate_slide', .4]]);
// 28 «erstmals seit dem Unfall.»: Mama en el fogón con los ojos llorosos; en la nevera el dibujo de Mia
shot(40.48, 'R', null, L => { stubeOn(); const m = put(mama, SX(-12), 0, -9.4, .35); actuar(m, L.lt, [[0, { aRx: 1.1, aRe: .7, aLx: .9, aLe: 1.6, headX: .25 }]], { T: L.T }); cry(m, L.T);
  onFace(m, lerp(7.5, 6, L.k), -.6, -1.4, 42); }, [[0, 'sad_tone', .5], [.4, 'pan_sizzle', .3], [.8, 'sniff', .5]]);
// 29 «Also klar:»: mi cara de sorpresa (golpe de zoom)
shot(41.92, 'C', 'punch', L => { stubeOn(); const c = put(ich, SX(2), 0, 4, .2); actuar(c, L.lt, [[0, 'shock']], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' });
  onFace(c, lerp(5.2, 4.4, L.k), -.4, 0, 40); }, [[0, 'impact', .6], [.05, 'gasp', .5]]);
// 30 «Mias Besuchstag.»: Mia entra por la puerta con su gorro y abrigo, sonriendo; «BESUCHSTAG»
shot(42.84, 'F', null, L => { stubeOn(); ST.DOOR.rotation.y = -PI / 2 - easeOut(clamp(L.lt / .5)) * 1.3; caminar(mia, L.lt, { x: SX(18), z: 10, ry: -PI / 2 - .4, speed: 2.4, T: L.T, stopAt: .9 }); cara(mia, L.T, { expr: 'happy', mouth: 'open_smile' }); actuar(mia, L.lt, [[0, 'idle'], [.9, 'wave', { dur: .3 }]], { T: L.T });
  orbit(V(SX(15), 2.6, 9.5), lerp(10, 8, L.k), -1.1, .1, 46); badge('tag', 'MIAS BESUCHSTAG', W / 2, H * .15, (L.lt - .3) * 3, 1, .85); }, [[0, 'door_open', .6], [.4, 'steps', .4], [.9, 'kids_laugh', .3]]);
// 31 «Ich schwor mir, dass sie es nie merkt.»: yo, decidido, aprieto el puño; Mia detrás quitándose el gorro
shot(44.08, 'I', null, L => { stubeOn(); const c = put(ich, SX(6), 0, 7, .5); actuar(c, L.lt, [[0, 'idle'], [.3, { aRx: 1.9, aRz: -.3, aRe: 2.2, lean: .05 }, { dur: .3 }]], { T: L.T }); cara(c, L.T, { expr: 'determined', mouth: 'flat' });
  const m = put(mia, SX(10), 0, 4, -.4); actuar(m, L.lt, [[0, { aLx: 2.6, aRx: 2.6, aLe: 1.6, aRe: 1.6 }]], { T: L.T }); cara(m, L.T, { expr: 'happy' });
  onFace(c, lerp(7, 5.8, L.k), -.4, -1.2, 42); }, [[.3, 'whoosh', .3], [.35, 'impact', .4]]);
// 32 «Als sie fragte, warum Mama weint,»: Mama llora cortando cebollas; Mia me tira de la manga y la señala
shot(46.28, 'W', null, L => { stubeOn(); show(BOARD, SX(-14), 3.25, -12.2, 0, 1); const m = put(mama, SX(-14), 0, -9.6, 0); actuar(m, L.lt, [[0, { aRx: .9, aRe: 1.2 + Math.sin(L.T * 14) * .25, aLx: .7, aLe: 1.1, headX: .3 }]], { T: L.T }); attach(KNIFE, m.aR.hand, [0, -.55, .3], [-.3, 0, 0]); cry(m, L.T);
  const a = put(mia, SX(-7.2), 0, -3.4, -.9), b = put(ich, SX(-5), 0, -2.6, -1.2); actuar(a, L.lt, [[0, 'point']], { T: L.T }); talk(a, L.T, 46.28, 48, 'worried'); actuar(b, L.lt, [[0, 'idle']], { T: L.T }); cara(b, L.T, { expr: 'worried' });
  cm([SX(-2), 6.5, 9], [SX(-3.5), 6, 7], L.k); camera.lookAt(SX(-10), 3.2, -6.5); }, [[0, 'chalk', .3], [.2, 'cry_girl', .2], [.8, 'sniff', .4]]);
// 33 «sagte ich: Zwiebeln.»: levanto una cebolla y sonrío nervioso; Mia la mira
shot(48.00, 'C', 'punch', L => { stubeOn(); const c = put(ich, SX(-5), 0, -2.6, .2); actuar(c, L.lt, [[0, { aRx: 1.5, aRz: -.4, aRe: 1.2 }]], { T: L.T }); attach(ONI, c.aR.hand, [0, -.7, .25], [0, 0, 0], .8); grin(c, L.T); sweat(c, L.T, 2);
  const a = put(mia, SX(-2.6), 0, -1.4, -.6); cara(a, L.T, { expr: 'confused' }); onFace(c, lerp(8, 6.8, L.k), -.6, -1.4, 44); badge('big', 'ZWIEBELN!', W / 2, H * .15, (L.lt - .8) * 3, 1, .8); }, [[0, 'pop', .5], [.8, 'boing_metal', .3]]);
// 34 «Den ganzen Tag ließ Mia meine Hand nicht los.»: Mia y yo de la mano por el salón y luego en el sofá; primer plano de las manos
shot(49.56, 'S', null, L => { stubeOn(); const x0 = SX(2), z0 = 6; caminar(ich, L.lt, { x: x0, z: z0, ry: PI / 2, speed: 1.6, T: L.T, extra: { aLx: .35, aLz: -.3, aLe: .2 } }); caminar(mia, L.lt, { x: x0, z: z0 + 2.1, ry: PI / 2, speed: 1.6, T: L.T + .3, extra: { aRx: .5, aRz: .3, aRe: .3 } });
  cara(mia, L.T, { expr: 'happy' }); cara(ich, L.T, { expr: 'neutral' }); const h = V(x0 + L.lt * 1.6, 2.2, z0 + 1); cm([h.x + 1, 3.4, h.z + 9], [h.x + 2, 3, h.z + 7.5], L.k); camera.lookAt(h.x, 2.6, h.z); badge('tag', 'DEN GANZEN TAG', W / 2, H * .15, (L.lt - .2) * 3, 1, .8); }, [[0, 'steps', .4], [.9, 'cloth', .3]]);
// 35 «Kater Socke»: el gato negro con calcetines blancos en el porche nevado; nos acercamos
shot(51.86, 'Z', null, L => { town(); const d = hz(1, 9.6); show(CAT, d.x, 0, d.z, PI / 2); CAT.userData.set('calm'); CAT.userData.tail.rotation.y = Math.sin(L.T * 3) * .4;
  orbit(V(d.x, 1.8, d.z), lerp(8, 6.5, L.k), PI / 2 + .35, .15, 42); sh(d, 20); badge('tag', 'KATER SOCKE', W / 2, H * .15, (L.lt - .2) * 3, 1, .85); }, [[0, 'steps_snow', .4], [.4, 'wind', .3]]);
// 36 «fauchte, sobald wir kamen.»: el gato arquea el lomo y bufa cuando llegamos de la mano; nos asustamos
shot(52.84, 'C', 'punch', L => { town(); const d = hz(8, 9.6); show(CAT, d.x, 0, d.z, PI / 2 + .3); const k = easeOut(clamp(L.lt / .25)); CAT.userData.arch(k); CAT.userData.set(k > .3 ? 'hiss' : 'calm');
  kidsAt(d.x + 5.5, d.z, -PI / 2 - .5, 2.4); actuar(ich, L.lt, [[0, { ...handL }], [.2, { ...GEST.recoil, ...handL }, { dur: .25 }]], { T: L.T }); actuar(mia, L.lt, [[0, { ...handR }], [.2, { ...GEST.recoil, ...handR }, { dur: .25 }]], { T: L.T }); cara(ich, L.T, { expr: 'shock' }); cara(mia, L.T, { expr: 'shock' });
  orbit(V(d.x + 2.8, 2.2, d.z), lerp(22, 19, L.k), PI - .2, .14, 46); sh(d, 30); }, [[0, 'growl', .7], [.1, 'gasp', .4]]);
// 37 «Papa starrte uns an,»: Papa en la puerta del porche nos mira fijamente, triste
shot(54.44, 'W', null, L => { town(); const d = hz(4.7, 8.6); const p = put(papa, d.x, 0, d.z, PI / 2 + .3); actuar(p, L.lt, [[0, 'idle']], { T: L.T }); cara(p, L.T, { expr: 'sad', eyes: 'normal' });
  orbit(headC(p).add(V(0, -1.2, 0)), lerp(13, 10, L.k), PI / 2 + .25, .05, 44); sh(d, 30); }, [[0, 'wind', .4], [.6, 'heartbeat', .4]]);
// 38 «als wollte er sich alles einprägen.»: primer plano de Papa con lágrimas
shot(55.78, 'F', 'slow', L => { town(); const d = hz(4.7, 8.6); const p = put(papa, d.x, 0, d.z, PI / 2 + .3); actuar(p, L.lt, [[0, 'idle']], { T: L.T }); cry(p, L.T); onFace(p, lerp(5.2, 4.2, L.k), -.4, 0, 40); sh(d, 20); }, [[0, 'sad_tone', .5], [.5, 'sniff', .5]]);
// 39 «Um halb fünf»: el reloj de la pared: 4:30
shot(57.38, 'Z', 'punch', L => { stubeOn(); ST.setClock(4, 30); const p = wpos(ST.CLK); cam([p.x + Math.sin(L.lt) * .4, p.y, p.z + lerp(5.4, 4.4, L.k)], [p.x, p.y - .2, p.z], 40); badge('tag', '16:30', W / 2, H * .15, (L.lt - .1) * 3, 1, .9); }, [[0, 'clock_tick', .7], [.4, 'bell_far', .4]]);
// 40 «zog sie mich zum Teich.»: atardecer: Mia tira de mi mano por la calle nevada hacia el estanque
shot(58.30, 'S', null, L => { teichOn(); const x0 = TXX(12), z0 = 78; caminar(mia, L.lt, { x: x0, z: z0, ry: PI + .1, speed: 4.2, run: true, T: L.T, extra: { aRx: -.6, aRz: .3, aRe: .2 } }); caminar(ich, L.lt, { x: x0 + 2, z: z0 + 2.4, ry: PI + .1, speed: 4.2, T: L.T + .2, extra: { aLx: 1.2, aLz: -.3, aLe: .1, lean: -.15 } });
  cara(mia, L.T, { expr: 'determined' }); cara(ich, L.T, { expr: 'worried' }); orbit(V(x0 + 1, 2.4, z0 - L.lt * 4.2), lerp(16, 13, L.k), PI - .5, .1, 46); sh(V(x0, 0, z0 - 4), 30); }, [[0, 'run_grass', .4], [0, 'steps_snow', .6], [.5, 'wind', .4]]);
// 41 «Sieht sie das Eis, erinnert sie sich.»: plano general: el estanque helado al sol bajo, nosotros llegando; mi cara preocupada
shot(59.86, 'R', 'slow', L => { teichOn(); const z0 = 48 - L.lt * 2.2; caminar(mia, L.lt, { x: TXX(4), z: z0 + 4, ry: PI, speed: 2.2, T: L.T, extra: handR }); caminar(ich, L.lt, { x: TXX(6.4), z: z0 + 4, ry: PI, speed: 2.2, T: L.T + .3, extra: handL }); cara(ich, L.T, { expr: 'worried' }); cara(mia, L.T, { expr: 'sad' });
  orbit(V(TXX(5), 3, z0), lerp(24, 17, L.k), PI + .45, .16, 46); sh(V(TXX(5), 0, z0), 40); }, [[0, 'steps_snow', .5], [.4, 'freeze', .4]]);
// 42 «Am Ufer weinte sie.»: en la orilla Mia llora; primer plano
shot(61.92, 'C', null, L => { teichOn(); visitor(ich); const m = put(mia, TXX(3), .1, 31, PI + .3); actuar(m, L.lt, [[0, { headX: .1 }]], { T: L.T }); cry(m, L.T); put(ich, TXX(5.6), .1, 32, PI - .6);
  onFace(m, lerp(5.4, 4.6, L.k), .5, .6, 42); sh(V(TXX(3), 0, 31), 20); }, [[0, 'cry_girl', .4], [.5, 'wind', .3]]);
// 43 «Hier hast du mich gerettet.»: Mia me mira y habla llorando; yo, de espaldas en primer término (contraplano)
shot(63.50, 'W', null, L => { teichOn(); visitor(ich); const m = put(mia, TXX(3), .1, 31, PI / 2 - .3), c = put(ich, TXX(6.2), .1, 31.4, -PI / 2 - .2); actuar(m, L.lt, [[0, { aRx: 1.0, aRz: -.2, aRe: .5 }]], { T: L.T }); talk(m, L.T, 63.5, 64.9, 'sad'); tears(m, L.T); cara(c, L.T, { expr: 'sad' });
  cm([TXX(9.4), 4.2, 25.6], [TXX(8.8), 4, 26.4], L.k); camera.lookAt(TXX(3.4), 2.1, 31); }, [[0, 'sniff', .5], [.4, 'wind', .3]]);
// 44 «Du hast mich aufs Eis geschoben,» (recuerdo, gris): yo en el agua empujo a Mia hacia arriba, sobre el hielo
shot(64.94, 'F', null, L => { teichOn(); day(); SUNM.visible = false; setSky([.6, .66, .78], [.75, .8, .88], [.88, .9, .94]); flashback(); FPM.visible = false; TE.HOLE.visible = true; const k = easeOut(clamp(L.lt / 1.1));
  const c = put(ich, TXX(4), -1.6, -6, -PI / 2 + .8); actuar(c, L.lt, [[0, { aLx: 2.8, aRx: 2.8, aLe: .4, aRe: .4, headX: -.3 }]], { T: L.T, extra: shiver(L.T, .6) }); cara(c, L.T, { expr: 'determined', mouth: 'open' });
  const m = put(mia, lerp(TXX(3), TXX(-1), k), lerp(-.6, .1, k), -6, -PI / 2); m.root.rotation.z = k * 1.2; cara(m, L.T, { expr: 'shock', mouth: 'o' }); dust(V(TXX(4), 0, -6), 0, L.lt, 10, .5);
  orbit(V(TXX(2.5), 1.2, -6), lerp(14, 12, L.k), PI / 2 + .3, .35, 46); sh(V(TXX(4), 0, -6), 30); }, [[0, 'splash', .7], [.3, 'shout_m', .2], [.7, 'land', .4]]);
// 45 «aber du bist nicht mehr aufgetaucht.» (zoom lento): el agujero oscuro en el hielo, burbujas, nadie
shot(66.48, 'I', 'slow', L => { teichOn(); day(); SUNM.visible = false; setSky([.6, .66, .78], [.75, .8, .88], [.88, .9, .94]); flashback(); grade.uniforms.sat.value = .7; FPM.visible = false; TE.HOLE.visible = true;
  const m = put(mia, TXX(4), .1, -10.6, .1); m.root.rotation.x = 0; actuar(m, L.lt, [[0, { crouch: .5, lean: .5, aLx: 1.4, aRx: 1.4, lLk: 1, lRk: 1 }]], { T: L.T }); cry(m, L.T);
  orbit(V(TXX(4), 1, -8), lerp(15, 10, L.k), .15, .55, 46); sh(V(TXX(4), 0, -7), 30); }, [[0, 'water_bloop', .6], [.6, 'water_bloop', .4], [1.0, 'heartbeat', .5]]);
// ---------- d: el reflejo, la verdad, la despedida (68,3 – 100,3 s) ----------
// en la orilla: Mia (TXX(3), 30) y yo (TXX(5.4), 30), de cara al norte (al sol). Yo soy el visitante: sin reflejo.
const MZ = 30, MX = TXX(3), IX = TXX(5.4);
const pond = (late = 0) => { teichOn(); visitor(ich); if (late) { setSky([.12, .12, .4], [.75, .35, .5], [1, .5, .3]); SUNM.position.y = 400 - late * 160; scene.fog.color.setRGB(.9, .6, .6); } else SUNM.position.y = 400; };
const pair = (ry = PI) => { put(mia, MX, .1, MZ, ry); put(ich, IX, .1, MZ, ry); };
const hugPose = { crouch: .35, lean: .28, aLx: 1.35, aRx: 1.35, aLz: -.55, aRz: -.55, aLe: 1.25, aRe: 1.25, headX: .25 }, hugMia = { aLx: 2.3, aRx: 2.3, aLz: -.45, aRz: -.45, aLe: .9, aRe: .9, headX: -.25 };
const hug = (cx, rI = PI / 2) => { put(ich, cx + .55, .1, MZ, -PI / 2 + .25); put(mia, cx - .55, .1, MZ, PI / 2 + .25); };
// 46 «Im Eis:»: yo miro el hielo a mis pies y me quedo helado
shot(68.30, 'C', 'punch', L => { pond(); pair(PI); actuar(ich, L.lt, [[0, { headX: .5, lean: .15 }]], { T: L.T }); cara(ich, L.T, { expr: 'shock', eyes: 'down' }); actuar(mia, L.lt, [[0, { headX: .4 }]], { T: L.T }); cara(mia, L.T, { expr: 'sad', eyes: 'down' });
  orbit(V(IX - .6, 3.4, MZ), lerp(9, 7.5, L.k), PI - .25, .05, 44); sh(V(IX, 0, MZ), 20); }, [[0, 'freeze', .6], [.1, 'glass_crack', .3]]);
// 47 «Mias Spiegelbild.»: cámara baja sobre el hielo: el reflejo de Mia, del revés
shot(69.16, 'F', null, L => { pond(); pair(PI); actuar(mia, L.lt, [[0, { headX: .4 }]], { T: L.T }); cry(mia, L.T); actuar(ich, L.lt, [[0, { headX: .5 }]], { T: L.T });
  const k = easeInOut(L.k); cam([MX - .6, lerp(2.2, 1.6, k), MZ - lerp(9, 7.5, k)], [MX, .2, MZ - 2], 46); sh(V(MX, 0, MZ), 20); }, [[0, 'creepy_ting', .5], [.4, 'sparkle', .3]]);
// 48 «Daneben: keiner.» (zoom lento): Mia y yo; en el hielo solo está su reflejo; en mi sitio, nada
shot(70.50, 'S', 'slow', L => { pond(); pair(PI); actuar(mia, L.lt, [[0, { headX: .3 }]], { T: L.T }); cara(mia, L.T, { expr: 'sad' }); actuar(ich, L.lt, [[0, { headX: .5 }]], { T: L.T }); cara(ich, L.T, { expr: 'shock', eyes: 'down' });
  const k = easeInOut(L.k); cam([lerp(TXX(4.2), IX + .2, k), lerp(3.2, 2.0, k), MZ - lerp(12, 7, k)], [lerp(TXX(4.2), IX, k), lerp(1.4, .3, k), MZ - 1.5], 46); sh(V(TXX(4), 0, MZ), 20);
  badge('red', 'KEINER', W / 2, H * .15, (L.lt - .7) * 3, 1, .9); }, [[0, 'heartbeat', .6], [.6, 'heartbeat', .6]]);
// 49 «Im Schnee nur eine Spur:»: me giro y miro atrás: en la nieve solo hay una fila de huellas, las de Mia
shot(71.82, 'W', null, L => { pond(); put(mia, MX, .1, MZ, PI); const c = put(ich, IX, .1, MZ, lerp(PI, .3, easeInOut(clamp(L.lt / .6)))); cara(c, L.T, { expr: 'shock' }); cara(mia, L.T, { expr: 'sad' });
  cm([TXX(1), 7, 60], [TXX(1.5), 6.5, 54], L.k); camera.lookAt(TXX(4.5), 1.5, 34); sh(V(TXX(6), 0, 44), 30); badge('tag', 'NUR EINE SPUR', W / 2, H * .15, (L.lt - .3) * 3, 1, .85); }, [[0, 'steps_snow', .4], [.3, 'wind', .5]]);
// 50 «kleine Stiefel.»: primer plano de las huellas pequeñas en la nieve, la cámara las sigue
shot(73.62, 'Z', null, L => { pond(); const z = lerp(52, 46, L.k); cam([TXX(8.4), 2.4, z + 5], [TXX(7.6), .1, z], 44); sh(V(TXX(10), 0, z), 15); }, [[0, 'steps_snow', .6], [.5, 'wind', .3]]);
// 51 «Mia hielt meine Hand nicht fest, damit sie bleibt.»: nuestras manos agarradas, muy fuerte; Mia llora
shot(74.74, 'R', null, L => { pond(); put(mia, MX + .9, .1, MZ, PI - .3); put(ich, IX - .4, .1, MZ, PI + .3); actuar(mia, L.lt, [[0, { aRx: .6, aRz: .45, aRe: .5, headY: -.5, headX: -.2 }]], { T: L.T, extra: shiver(L.T, .3) }); actuar(ich, L.lt, [[0, { aLx: .6, aLz: .45, aLe: .5, headY: .4, headX: .3 }]], { T: L.T });
  cry(mia, L.T); cara(ich, L.T, { expr: 'sad' }); const h = V((MX + IX) / 2 + .2, 1.6, MZ); cm([h.x - 1.4, 2.8, h.z - 8.4], [h.x - 1, 2.6, h.z - 7.4], L.k); camera.lookAt(h.x, 1.8, h.z); sh(h, 15); }, [[0, 'cloth', .4], [.4, 'sniff', .5]]);
// 52 «Sie wollte sich an mich erinnern.»: Mia me mira hacia arriba, memorizando mi cara
shot(77.50, 'F', null, L => { pond(); const m = put(mia, MX + .6, .1, MZ, PI / 2 - .5), c = put(ich, IX, .1, MZ, -PI / 2); actuar(m, L.lt, [[0, { headX: -.45, aRx: .6, aRz: .4 }]], { T: L.T }); cry(m, L.T); cara(c, L.T, { expr: 'sad' });
  cm([MX + 3.6, 3.4, MZ - 5.4], [MX + 3.2, 3.2, MZ - 4.8], L.k); camera.lookAt(MX + .6, 2, MZ); sh(V(MX, 0, MZ), 15); }, [[0, 'heartbeat', .4], [.5, 'sniff', .4]]);
// 53 «Die Spiegel,»: ráfaga: los espejos tapados del salón
shot(79.12, 'C', 'punch', L => { stubeOn(); grade.uniforms.sepia.value = .25; cam([SX(-12), 5.5, lerp(6, 4, L.k)], [SX(-12.5), 5.4, lerp(5, 3, L.k)], 48); camera.lookAt(SX(-19.7), 5.2, 1); }, [[0, 'cloth', .5], [.1, 'whoosh', .3]]);
// 54 «die Pfannkuchen,»: ráfaga: las tortitas
shot(79.94, 'C', 'punch', L => { stubeOn(); grade.uniforms.sepia.value = .25; show(PANC, SX(-1), 3.1, -3, L.lt, 1); orbit(V(SX(-1), 4.2, -3), lerp(6.5, 5.6, L.k), -.4, .4, 42); }, [[0, 'plate_slide', .5]]);
// 55 «Papas Blick.»: ráfaga: Papa mirándome con lágrimas
shot(80.92, 'C', 'punch', L => { town(); grade.uniforms.sepia.value = .25; const d = hz(4.7, 8.6); const p = put(papa, d.x, 0, d.z, PI / 2 + .3); cry(p, L.T); onFace(p, lerp(4.6, 4, L.k), -.3, .3, 40); sh(d, 20); }, [[0, 'sad_tone', .5]]);
// 56 «Es war nie Mias Besuchstag.» (zoom lento): mi cara al comprenderlo
shot(81.88, 'I', 'slow', L => { pond(); const c = put(ich, IX, .1, MZ, PI - .2); actuar(c, L.lt, [[0, { aLx: .5, aRx: .5, aLe: 1.2, aRe: 1.2 }]], { T: L.T }); cara(c, L.T, { expr: 'shock', eyes: 'wide', mouth: 'o' }); put(mia, MX, .1, MZ, PI);
  onFace(c, lerp(7, 4.4, L.k), -.3, 0, 40); sh(V(IX, 0, MZ), 15); }, [[0, 'heartbeat', .6], [.8, 'heartbeat', .6]]);
// 57 «Es war meiner.»: golpe: yo de pie sobre el hielo… y en el hielo no estoy; «MEINER»
shot(83.80, 'C', 'punch', L => { pond(); pair(PI); actuar(ich, L.lt, [[0, 'shock']], { T: L.T }); cara(ich, L.T, { expr: 'shock' }); cry(mia, L.T);
  cam([IX - .8, 1.8, MZ - lerp(9, 8, L.k)], [IX - .6, 1.1, MZ], 46); sh(V(IX, 0, MZ), 15); badge('red', 'MEINER', W / 2, H * .6, (L.lt - .05) * 3, 1, 1.1); }, [[0, 'braam', .7], [.05, 'impact', .5]]);
// 58 «Warum hast du nichts gesagt?»: le pregunto a Mia, con lágrimas
shot(84.86, 'W', null, L => { pond(); const c = put(ich, IX, .1, MZ, -PI / 2 + .5), m = put(mia, MX, .1, MZ, PI / 2 - .3); actuar(c, L.lt, [[0, 'shrug']], { T: L.T }); talk(c, L.T, 84.86, 86.1, 'sad'); tears(c, L.T); cara(m, L.T, { expr: 'sad' });
  onFace(c, lerp(6, 5, L.k), -.2, .8, 42); sh(V(IX, 0, MZ), 15); }, [[0, 'sniff', .4], [.5, 'wind', .3]]);
// 59 «Das ist die Regel, flüsterte sie.»: Mia susurra llorando
shot(86.10, 'S', null, L => { pond(); const m = put(mia, MX, .1, MZ, PI - .2); put(ich, IX, .1, MZ, -PI / 2 + .5); actuar(m, L.lt, [[0, { headX: .2, aRx: .4 }]], { T: L.T }); talk(m, L.T, 86.1, 87.6, 'sad'); tears(m, L.T);
  onFace(m, lerp(5.2, 4.4, L.k), .4, -.8, 40); sh(V(MX, 0, MZ), 15); }, [[0, 'whisper', .6], [.8, 'sniff', .4]]);
// 60 «Die Sonne ging unter.»: plano general al contraluz: el sol se esconde detrás del molino; los dos sobre el hielo
shot(88.62, 'F', null, L => { pond(L.k); pair(PI); actuar(mia, L.lt, [[0, handR]], { T: L.T }); actuar(ich, L.lt, [[0, handL]], { T: L.T });
  orbit(V(TXX(4.2), 4, MZ - 4), lerp(30, 34, L.k), lerp(-.05, .05, L.k), .12, 50); sh(V(TXX(4), 0, MZ), 30); }, [[0, 'wind', .6], [.3, 'strings', .4]]);
// 61 «Ich hab nie Danke gesagt.»: Mia, con lágrimas, me lo dice
shot(89.92, 'R', null, L => { pond(1); const m = put(mia, MX, .1, MZ, PI - .2); put(ich, IX, .1, MZ, -PI / 2 + .4); talk(m, L.T, 89.92, 91, 'sad'); tears(m, L.T); actuar(m, L.lt, [[0, { aLx: .8, aRx: .8, aLe: 1.6, aRe: 1.6 }]], { T: L.T });
  onFace(m, lerp(5, 4.3, L.k), .4, -.8, 40); sh(V(MX, 0, MZ), 15); }, [[0, 'cry_girl', .3], [.6, 'sniff', .4]]);
// 62 «Ich drückte sie, so fest ich konnte.»: el abrazo, la cámara gira alrededor
shot(91.58, 'C', null, L => { pond(1); hug(TXX(4.2)); actuar(ich, L.lt, [[0, hugPose]], { T: L.T }); actuar(mia, L.lt, [[0, hugMia]], { T: L.T }); cara(ich, L.T, { expr: 'sad', eyes: 'closed' }); cry(mia, L.T, 2);
  orbit(V(TXX(4.2), 2.6, MZ), lerp(8, 7, L.k), lerp(PI - .9, PI - .2, L.k), .1, 44); sh(V(TXX(4), 0, MZ), 15); }, [[0, 'hug', .7], [.3, 'cloth', .4], [.8, 'strings', .3]]);
// 63 «Ich würde es immer wieder tun.»: mi cara sobre su hombro: sonrío con lágrimas
shot(93.86, 'Z', null, L => { pond(1); hug(TXX(4.2)); actuar(ich, L.lt, [[0, hugPose]], { T: L.T }); actuar(mia, L.lt, [[0, hugMia]], { T: L.T }); actuar(ich, L.lt, [[0, { ...hugPose, crouch: .05, headX: 0 }]], { T: L.T }); cara(ich, L.T, { expr: 'happy', eyes: 'happy', mouth: kitLips(L.T, spoken(93.86, 95.5)) || 'smile' }); tears(ich, L.T);
  onFace(ich, lerp(5, 4.4, L.k), .9, 0, 40); sh(V(TXX(4), 0, MZ), 15); }, [[0, 'sniff', .4], [.5, 'piano_note', .4]]);
// 64 «Immer.»: plano general del abrazo con el sol en el horizonte
shot(95.56, 'F', null, L => { pond(1.4); hug(TXX(4.2)); actuar(ich, L.lt, [[0, hugPose]], { T: L.T }); actuar(mia, L.lt, [[0, hugMia]], { T: L.T }); cara(ich, L.T, { expr: 'happy', eyes: 'closed' }); cara(mia, L.T, { expr: 'sad', eyes: 'closed' });
  orbit(V(TXX(4.2), 3, MZ - 2), lerp(16, 19, L.k), -.05, .1, 46); sh(V(TXX(4), 0, MZ), 20); }, [[0, 'strings', .4], [.2, 'wind', .3]]);
// 65 «Und sie rief meinen Namen über den Teich,»: me deshago en destellos entre sus brazos; Mia grita mi nombre
shot(96.18, 'S', null, L => { pond(1.6); const k = clamp(L.lt / 1.6); hug(TXX(4.2)); ich.root.scale.setScalar(sc_(ich) * (1 - easeIn(k) * .95)); ich.root.visible = k < .97; actuar(ich, L.lt, [[0, hugPose]], { T: L.T }); cara(ich, L.T, { expr: 'happy', eyes: 'closed' }); SPK.run(V(TXX(4.75), .1, MZ), k, L.T, 2.2, 4);
  actuar(mia, L.lt, [[0, hugMia], [.9, { aLx: 2.0, aRx: 2.0, aLz: -.9, aRz: -.9, aLe: 2.1, aRe: 2.1, headX: -.35 }, { dur: .4 }]], { T: L.T }); cara(mia, L.T, { expr: 'sad', mouth: L.lt > .9 ? 'open' : 'frown' }); tears(mia, L.T);
  orbit(V(TXX(4.2), 2.4, MZ), lerp(9, 7, L.k), PI - .4, .12, 44); sh(V(TXX(4), 0, MZ), 15); }, [[0, 'sparkle', .7], [.2, 'magic_hit', .4], [1.0, 'cry_girl', .3]]);
// 66 «bis ich fort war.»: Mia sola sobre el hielo; la cámara sube y se aleja; una sola fila de huellas
shot(98.42, 'I', null, L => { pond(2); const m = put(mia, TXX(3.6), .1, MZ, PI); actuar(m, L.lt, [[0, { aLx: 2.0, aRx: 2.0, aLz: -.9, aRz: -.9, aLe: 2.1, aRe: 2.1, headX: -.3 }]], { T: L.T }); cara(m, L.T, { expr: 'sad', mouth: 'open' }); tears(m, L.T);
  const k = easeInOut(L.k); cam([TXX(3.6) - lerp(2, 6, k), lerp(4, 18, k), MZ + lerp(9, 26, k)], [TXX(3.6), 1.5, MZ - lerp(0, 6, k)], 48); sh(V(TXX(4), 0, MZ + 6), 40); }, [[0, 'wind', .6], [.4, 'sad_tone', .5], [1.2, 'piano_note', .4]]);
// ---------- portadas (fuera del vídeo) ----------
// v0: Mia y yo de la mano sobre el hielo al atardecer (el reflejo solo de ella, sin destripar); texto en medio.
// v1: Opa riendo en la mesa con la familia sonriendo de más y el espejo tapado; texto en medio.
function coverTxt(l1, l2, y0 = .43) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz] of [[l1, H * y0, 112], [l2, H * (y0 + .068), 126]]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .86 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = 22; c.shadowOffsetY = 8; c.lineWidth = sz * .24; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(t, 0, 0); c.restore(); }
  c.restore(); }
window.renderCover = v => { const T = 3.1; hideAll(); BAD_.length = 0; BIRDSON = 0;
  if (v === 0) { fhOn(); SNOWF = .9; visitor(opa); const o = put(opa, FXX(0), 3.2, 8.6, 0); applyPose(o, { ...GEST.cheer, headX: -.2 }); cara(o, T, { eyes: 'happy', mouth: 'laugh', noBlink: 1 }); SPK.run(V(FXX(0), 2.5, 8.6), .45, T, 5, 8);
    const k1 = put(KD[0], FXX(-2.9), 0, 14.6, .45), k2 = put(KD[1], FXX(2.9), 0, 14.8, -.45); applyPose(k1, { ...GEST.cheer, headX: -.25 }); applyPose(k2, { ...GEST.hands_face, headX: -.2 });
    cara(k1, T, { eyes: 'wide', mouth: 'open_smile', noBlink: 1 }); cara(k2, T, { eyes: 'happy', mouth: 'open_smile', noBlink: 1 }); tears(k2, T);
    cam([FXX(0), 4.4, 29], [FXX(0), 5.0, 10], 48); sh(V(FXX(0), 0, 12), 30); AIR.update(T, camera.position.clone().add(V(0, 0, -10)), 'nieve', .9); }
  else { stubeOn(); visitor(opa); const o = put(opa, SX(-1), 0, -7.6, 0); applyPose(o, { lean: -.1, headX: -.15, aLx: .5, aLz: .5, aRx: .5, aRz: .5 }); cara(o, T, { eyes: 'happy', mouth: 'laugh', noBlink: 1 });
    show(PANC, SX(-1), 3.1, -4, 0, .55); [[mama, -4.2, -6.2, .4], [papa, 2.2, -6.2, -.4], [KD[0], -2.9, -.2, .3], [KD[1], .9, -.2, -.3]].forEach(([c, x, z, r], i) => { put(c, SX(x), 0, z, r); applyPose(c, i < 2 ? { aLx: .3, aRx: .3 } : GEST.cheer); grin(c, T, { noBlink: 1 }); }); sweat(papa, T, 2);
    cam([SX(-1), 6.2, 11], [SX(-1), 4.2, -5], 52); }
  grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; grade.uniforms.blurAmt.value = 0; grade.uniforms.flash.value = 0; grade.uniforms.sepia.value = 0; camera.updateProjectionMatrix();
  sky.sky.position.copy(camera.position); composer.render(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H);
  if (v === 0) coverTxt('JEDER TOTE BEKOMMT', 'EINEN TAG MEHR', .43); else coverTxt('SAG IHNEN NIE,', 'DASS SIE TOT SIND', .5); };


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
  if (COVER != null) { COVER.cam(); grade.uniforms.sharp.value = 1.5; grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.5; grade.uniforms.lift.value = .01; }
  else camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  FILL.position.copy(camera.position).add(V(0, 3, 0)).addScaledVector(dir, 2);
  AIR.update(T, ctr, MODE === 'in' ? 'polvo' : 'nieve', MODE === 'in' ? .25 : SNOWF);
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

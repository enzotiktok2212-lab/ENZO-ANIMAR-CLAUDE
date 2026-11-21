// Gesichter — ~95 planos sincronizados con audio/words.json (1080×1920, 30 fps, 153,1 s).
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, idlePose, mixPose, V, lerp, clamp,
  easeOut, easeIn, easeInOut, spring, blinking, lip, RNG, mat, box, sphere, cyl, canvasTex, textPlane } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, txt, tree } from './props.js';
import { loaf } from './diam.js';
import { makeHero, makeLenny, makeMom, makeDad, makeBrandt, makeBaker, makeHunter, makeFolk, radio, hungFace } from './gcast.js';
import { stadt, snowFall, mauer, dachboden, funkhuette, wohnzimmer, kunstraum, halle, turm, schwarz, mower, kaefig, sign } from './gsets.js';

await document.fonts.load('700 40px Cap');
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 153.125, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xbfe3ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x8a8070, 1.7); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d8, 2.7); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 5; scene.add(sun, sun.target);
const rim = rimLight(scene);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 700 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-70, 140, 90)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
const DX = 1000, FX = 1100, WX = 1200, KX = 1300, HX = 1400, TX = 1600, BX = 1700, NX = 1800, MX = 3000;
const ST = stadt(scene), MA = mauer(scene, MX), DA = dachboden(scene, DX), FU = funkhuette(scene, FX), WO = wohnzimmer(scene, WX), KU = kunstraum(scene, KX), HA = halle(scene, HX), TU = turm(scene, TX), SW = schwarz(scene, NX);
// panadería por dentro (X = 1700)
const BK = (() => { const g = new THREE.Group(); g.position.x = BX; scene.add(g); const fl = new THREE.Mesh(new THREE.PlaneGeometry(26, 22), mat(0xb88a5a)); fl.rotation.x = -Math.PI / 2; g.add(fl);
  box(26, 14, .6, mat(0xf4e2c0), 0, g, 0, 7, -11); for (const s of [-1, 1]) box(.6, 14, 22, mat(0xf4e2c0), 0, g, s * 13, 7, 0);
  for (let r = 0; r < 3; r++) { box(18, .3, 2, mat(0x6a4426), .05, g, 0, 6 + r * 2.4, -10); for (let k = 0; k < 7; k++) { const l = loaf(g); l.position.set(-7.5 + k * 2.5, 6.6 + r * 2.4, -10); l.scale.setScalar(.7); } }
  box(16, 3.6, 3, mat(0x7a4c28), .1, g, 0, 1.8, -3); box(16.4, .3, 3.4, mat(0xe8dcc0), .05, g, 0, 3.75, -3); const cr = box(2, .9, 1.4, mat(0x2a2a2e, { metalness: .6 }), .1, g, 5.5, 4.35, -3);
  const sg = sign(6, 1.2, 'FRISCH!', '#c8781e', '#fff6d8', 64); sg.position.set(-5, 11, -10.6); g.add(sg); const l = new THREE.PointLight(0xffd8a0, 40, 40, 1.4); l.position.set(0, 12, 2); g.add(l);
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return { g }; })();
// atrezo de los interiores
const calendar = textPlane(4, 5, 320, 400, (c, w, h) => { c.fillStyle = '#fffdf6'; c.fillRect(0, 0, w, h); c.fillStyle = '#5ab85a'; c.fillRect(0, 0, w, 90); txt(c, 'FRÜHLING', w / 2, 46, 48, '#fff'); c.strokeStyle = '#ccc'; c.lineWidth = 2; for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) { c.strokeRect(10 + i * 60, 100 + j * 72, 60, 72); txt(c, String(1 + i + j * 5 + (j > 1 ? 1 : 0)), 40 + i * 60, 126 + j * 72, 24, '#555'); } txt(c, '13', 40 + 2 * 60, 126 + 2 * 72, 26, '#d8323a'); }); calendar.position.set(DX + 10, 8, -14.6); scene.add(calendar);
const calRing = new THREE.Mesh(new THREE.TorusGeometry(.42, .07, 6, 24), mat(0xd8323a, { emissive: 0x6a0000 })); calRing.position.set(DX + 10, 7.42, -14.5); scene.add(calRing);
const collar = (() => { const g = new THREE.Group(); scene.add(g); const t = new THREE.Mesh(new THREE.TorusGeometry(.5, .1, 8, 24), mat(0xd8323a)); t.rotation.x = Math.PI / 2; g.add(t); const tag = cyl(.18, .18, .05, mat(0xe9c23a, { metalness: .8 }), 12, g, 0, -.1, .55); tag.rotation.x = Math.PI / 2; g.position.set(DX + 2.2, 3.55, -8.2); return g; })();
const table = (() => { const g = new THREE.Group(); g.position.set(WX, 0, 2); scene.add(g); box(8, .4, 5, mat(0x7a4c28), .05, g, 0, 3.4, 0); for (const [x, z] of [[-3.6, -2.2], [3.6, -2.2], [-3.6, 2.2], [3.6, 2.2]]) box(.35, 3.4, .35, mat(0x5a3a1e), .05, g, x, 1.7, z); return g; })();
const cake = (() => { const g = new THREE.Group(); scene.add(g); cyl(1.5, 1.5, 1.2, mat(0xf4e2f0), 32, g, 0, .6, 0); cyl(1.55, 1.55, .25, mat(0xd85a9a), 32, g, 0, 1.15, 0); cyl(1.0, 1.0, .9, mat(0xfff0f8), 32, g, 0, 1.7, 0);
  const n = textPlane(1.4, .7, 140, 70, (c, w, h) => { txt(c, '13', w / 2, h / 2, 60, '#d8323a', '#fff', 8); }); n.position.set(0, 1.75, 1.02); g.add(n);
  for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283; cyl(.06, .06, .6, mat(0x5ab8f0), 6, g, Math.cos(a) * .7, 2.45, Math.sin(a) * .7); const f = sphere(.08, new THREE.MeshBasicMaterial({ color: 0xffc040, toneMapped: false }), g, Math.cos(a) * .7, 2.85, Math.sin(a) * .7, 6, 4); f.scale.y = 1.6; } return g; })();
const bench = (() => { const g = new THREE.Group(); scene.add(g); for (let k = 0; k < 3; k++) box(6, .25, .6, mat(0xb07a45), .05, g, 0, 2.2, -.7 + k * .7); box(6, 1.6, .25, mat(0xb07a45), .05, g, 0, 3.4, -1.1); for (const s of [-1, 1]) box(.3, 2.2, 2, mat(0x2a2a2e, { metalness: .6 }), .05, g, s * 2.6, 1.1, -.2); return g; })();
const lunch = box(.9, .6, .7, mat(0xe8c890), .1, scene);
const poster = (() => { const g = new THREE.Group(); scene.add(g); const p = textPlane(2.6, 3.4, 260, 340, (c, w, h) => { c.fillStyle = '#f4ecd8'; c.fillRect(0, 0, w, h); txt(c, 'VERMISST', w / 2, 40, 44, '#d8323a'); c.fillStyle = '#d9a47a'; c.fillRect(70, 80, 120, 130); c.fillStyle = '#2a1d1a'; c.beginPath(); c.arc(105, 135, 9, 0, 7); c.arc(155, 135, 9, 0, 7); c.fill(); c.strokeStyle = '#2a1d1a'; c.lineWidth = 5; c.beginPath(); c.arc(130, 170, 20, .2, 2.9); c.stroke(); c.fillStyle = '#3a2214'; c.fillRect(70, 70, 120, 26); txt(c, 'Hast du mich gesehen?', w / 2, 250, 24, '#333'); txt(c, 'Tel. 0815', w / 2, 300, 22, '#666'); }); g.add(p); return g; })();
const mirror = (() => { const g = new THREE.Group(); scene.add(g); box(3.4, 4.4, .2, mat(0x6a4426), .1, g, 0, 0, 0); const m = box(3, 4, .1, mat(0xc8e4f4, { metalness: .9, roughness: .05 }), .05, g, 0, 0, .12); return g; })();
const MOW = mower(scene), CAGE = kaefig(scene), HRAD = radio(scene, .9);
const HANDF = hungFace(scene, { skin: 0xf3d6c0, css: '#f3d6c0', hair: 0x14141a, face: { mouth: 'smile', iris: '#3a5a8a' } });   // la cara de Lenny (para colgarla)
const FOLKF = hungFace(scene, { skin: 0xc68b5e, css: '#c68b5e', hair: 0x111111, face: { iris: '#2a1608' } });
const HEROF = hungFace(scene, { skin: 0xd9a47a, css: '#d9a47a', hair: 0x3a2214, face: { mouth: 'smile', iris: '#5a3a1a', freckles: 1 } });   // la cara robada del narrador (final)
const drops = []; for (let k = 0; k < 26; k++) drops.push(sphere(.12, mat([0x5a8ad8, 0x7ab84a, 0xd85a9a][k % 3], { transparent: true, opacity: .85, roughness: .1 }), scene, 0, 0, 0, 6, 4));
const spit = sphere(.14, mat(0xdff4ff, { transparent: true, opacity: .8, roughness: .05 }), scene, 0, 0, 0, 8, 6);
const dust = []; for (let k = 0; k < 18; k++) dust.push(sphere(1, mat(0xa88a62, { transparent: true, opacity: .55, roughness: 1 }), scene, 0, 0, 0, 8, 6));
const boxes = []; for (let k = 0; k < 3; k++) boxes.push(box(1.8, 1.4, 1.6, mat(0xb8905a, { roughness: 1 }), .06, scene));
const lineDust = box(.15, .05, 6, mat(0x3a2a1a), .02, scene);
const LOAF1 = loaf(scene), LOAF2 = loaf(scene), LOAF3 = loaf(scene), HOLE = box(1.2, 1.4, .1, mat(0x000000), .1, scene);
const chairM = mat(0x6a4426, { roughness: .8 }); const CHAIRS = Array.from({ length: 8 }, () => { const g = new THREE.Group(); scene.add(g); box(2.2, .3, 2.2, chairM, .06, g, 0, 2.15, 0); box(2.2, 2.4, .3, chairM, .06, g, 0, 3.4, -1.0); for (const [x, z] of [[-.9, -.9], [.9, -.9], [-.9, .9], [.9, .9]]) box(.22, 2.1, .22, chairM, .03, g, x, 1.05, z); return g; });
let chairN = 0; const chair = (x, z, ry) => { const c = CHAIRS[chairN++ % CHAIRS.length]; return show(c, x, 0, z, ry); };
for (const s2 of [-1, 1]) { box(1.6, .35, 30, mat(0x5a3020), .05, HA.g, s2 * 11, 2.0, 2); for (let z = -12; z <= 16; z += 7) box(.3, 2, .3, mat(0x3a2010), .03, HA.g, s2 * 11, 1, z); }
// multitud lejana instanciada (cabezas negras = sin cara)
const CROWD = (() => { const n = 160; const bodyG = new THREE.BoxGeometry(1.8, 3.8, 1); bodyG.translate(0, 1.9, 0); const headG = new THREE.BoxGeometry(1.2, 1.2, 1.2); headG.translate(0, 4.5, 0);
  const bi = new THREE.InstancedMesh(bodyG, new THREE.MeshStandardMaterial({ roughness: .7 }), n), hi = new THREE.InstancedMesh(headG, new THREE.MeshStandardMaterial({ color: 0x08090c, roughness: .15, metalness: .3 }), n); bi.castShadow = hi.castShadow = true; bi.frustumCulled = hi.frustumCulled = false; scene.add(bi, hi);
  const cols = [0xd8323a, 0x2a6ad8, 0x2ec46a, 0xffd23f, 0x9b5de5, 0xff8a23, 0x3a3a4a, 0xf4f4f4, 0x8a5a2a, 0x1fae9a], c = new THREE.Color(); for (let i = 0; i < n; i++) bi.setColorAt(i, c.set(cols[i % cols.length]));
  const r = RNG(55), P = Array.from({ length: n }, () => [r(), r(), r()]), d = new THREE.Object3D();
  const at = (cx, cz, Wd, D, T, face = 0, run = 0, count = n) => { bi.visible = hi.visible = true; for (let i = 0; i < n; i++) { const [a, b, e] = P[i]; if (i >= count) d.scale.setScalar(0); else { d.scale.setScalar(1); d.position.set(cx + (a - .5) * Wd, run ? Math.abs(Math.sin(T * 9 + e * 9)) * .4 : 0, cz + (b - .5) * D + (run ? T * run : 0)); d.rotation.set(run ? .2 : 0, face + (e - .5) * .5, 0); } d.updateMatrix(); bi.setMatrixAt(i, d.matrix); hi.setMatrixAt(i, d.matrix); } bi.instanceMatrix.needsUpdate = hi.instanceMatrix.needsUpdate = true; };
  return { bi, hi, at }; })();
// ---------- reparto ----------
const hero = makeHero(scene), len = makeLenny(scene), mom = makeMom(scene), dad = makeDad(scene), dadC = makeDad(scene, true), brandt = makeBrandt(scene), baker = makeBaker(scene);
const hun = [makeHunter(scene, 0), makeHunter(scene, 1)];
const fk = Array.from({ length: 12 }, (_, i) => makeFolk(scene, i));
const kids = Array.from({ length: 4 }, (_, i) => { const k = makeFolk(scene, i + 3); k.root.scale.setScalar(.78); k.spec.scale = .78; return k; });
const POOL = [hero, len, mom, dad, dadC, brandt, baker, ...hun, ...fk, ...kids];
const PROPS = [LOAF1, LOAF2, LOAF3, HOLE, ...CHAIRS, calendar, calRing, collar, table, cake, bench, lunch, poster, mirror, MOW, CAGE, HRAD, HANDF, FOLKF, HEROF, ...drops, spit, ...dust, ...boxes, lineDust, CROWD.bi, CROWD.hi];
// ---------- utilidades ----------
const SETS = { ST: ST.G, MA: MA.g, DA: DA.g, FU: FU.g, WO: WO.g, KU: KU.g, HA: HA.g, TU: TU.g, BK: BK.g, SW: SW.g };
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
function day() { setSky([.26, .58, .98], [.5, .78, 1], [.78, .9, 1]); hemi.intensity = 1.7; hemi.color.setRGB(.81, .9, 1); sun.intensity = 2.7; sun.color.setRGB(1, .94, .85); rim.intensity = 1.3; scene.fog.color.setRGB(.75, .88, 1); scene.fog.density = .0008; ST.lamps.forEach(l => l.userData && l.userData.bulb && (l.userData.bulb.material.emissiveIntensity = .2)); bloom.strength = .26; }
function night() { setSky([.03, .05, .16], [.08, .12, .3], [.16, .22, .42]); hemi.intensity = .75; hemi.color.setRGB(.55, .65, 1); sun.intensity = .55; sun.color.setRGB(.6, .7, 1); rim.intensity = 2.2; scene.fog.color.setRGB(.05, .08, .2); bloom.strength = .5; }
function dusk() { setSky([.36, .3, .62], [1, .5, .3], [1, .66, .3]); hemi.intensity = 1.3; hemi.color.setRGB(1, .78, .62); sun.intensity = 2; sun.color.setRGB(1, .62, .36); rim.intensity = 1.6; scene.fog.color.setRGB(.9, .6, .4); bloom.strength = .36; }
function winter() { setSky([.55, .6, .7], [.72, .76, .84], [.86, .88, .92]); hemi.intensity = 1.9; hemi.color.setRGB(.86, .9, 1); sun.intensity = 1.2; sun.color.setRGB(.9, .93, 1); rim.intensity = 1.0; scene.fog.color.setRGB(.82, .85, .9); scene.fog.density = .003; bloom.strength = .3; }
function inside(h = .9, s = .5) { hemi.intensity = h; sun.intensity = s; bloom.strength = .42; scene.fog.density = .0002; }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
const TREES = []; ST.G.traverse(o => { if (o.userData && o.userData.leaves) TREES.push(o); }); const trees = on => TREES.forEach(t => t.visible = on);
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.head.scale.set(1, 1, 1); c.head.visible = true; c.unmask(0); c.setFace({}); if (c.props.lantern) c.props.lantern.visible = true; }
  chairN = 0; for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const k in SETS) SETS[k].visible = false; trees(true); ST.SNOW.visible = false; MA.doors.forEach((d, i) => d.rotation.y = 0); DA.light.intensity = 30;
  grade.uniforms.vig.value = .42; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = .85; grade.uniforms.sepia.value = 0; day(); scene.fog.density = .0008; }
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
function face(ch, f, T) { const s = { ...f }; if (blinking(T, ch.seed) && !['closed', 'happy'].includes(s.eyes) && !s.noBlink) s.eyes = 'closed'; ch.setFace(s); }
function kp(ch, lt, keys, extra = {}) { let p = keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const [t0, a] = keys[i], [t1, b] = keys[i + 1]; if (lt >= t0 && lt <= t1) { p = mixPose(a, b, easeInOut((lt - t0) / (t1 - t0))); break; } if (lt > t1) p = b; } applyPose(ch, { ...p, ...extra }); }
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
const hp = ch => ch.head.getWorldPosition(V(0, 0, 0)); const handP = (ch, r = 1) => (r ? ch.aR : ch.aL).hand.getWorldPosition(V(0, 0, 0));
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { ch.root.updateMatrixWorld(true); const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + dy, h.z + fz * d - fx * side], [h.x, h.y - .3, h.z], fov); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b); const talkFace = (ch, T, a, b, f) => face(ch, { ...f, mouth: lip(T, spoken(a, b)) || f.mouth }, T);
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function walkTo(ch, x0, z0, ry, T, lt, speed = 3, run = false, sp = .6) { const d = speed * lt; put(ch, x0 + Math.sin(ry) * d, 0, z0 + Math.cos(ry) * d, ry); applyPose(ch, run ? runPose(T, 1.0) : walkPose(T, sp)); }
const wt = (w, after = 0) => { const x = WORDS.find(q => q[0] >= after - .01 && q[2].replace(/[.,:?!„“"]/g, '').toLowerCase().startsWith(w.toLowerCase())); if (!x) throw new Error('word ' + w); return x[0]; };
const STN = {}; for (const w of WORDS) if (!(w[3] in STN)) STN[w[3]] = w[0]; const st = n => STN[n]; const W2 = (w, n) => wt(w, st(n));
const SIT = { crouch: .2, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aLz: .15, aRz: .15 };
const sit = (ch, x, y, z, ry, extra = {}) => { const s = ch.spec.scale || 1; put(ch, x, y - (2.05 - .2) * s + .08, z, ry); applyPose(ch, { ...SIT, ...extra }); };
const RIGID = { aLz: .04, aRz: .04, aLe: 0, aRe: 0 };
const LAUGH = (T) => ({ lean: -.12 + Math.sin(T * 16) * .04, headX: -.25, aLz: .25, aRz: .25, aLe: .5, aRe: .5, hipY: 2.05 + Math.abs(Math.sin(T * 16)) * .05 });
const CRY = (T) => ({ headX: .35, lean: .15, aLx: 1.2, aRx: 1.2, aLe: 1.9, aRe: 1.9, aLz: -.2, aRz: -.2, hipY: 2.05 + Math.sin(T * 22) * .03 });
const WAVE = (T, sp = 7) => ({ aRx: 2.6, aRz: .35 + Math.sin(T * sp) * .35, aRe: .4 });
const RADIO = { aRx: 1.25, aRe: 1.75, aRz: -.15, headX: .1 };
const dropsAt = (from, vel, t, n = 26, g = 9) => drops.forEach((d, i) => { d.visible = t > 0 && i < n; const a = i * 2.399, sp = .6 + (i % 5) * .25; d.position.set(from.x + (vel.x + Math.cos(a) * sp) * t, from.y + (vel.y + Math.sin(a) * sp) * t - g * t * t, from.z + (vel.z + Math.sin(a * 1.3) * sp) * t); });
const dustAt = (c, t, sc = 1) => dust.forEach((s, i) => { s.visible = t > 0; const a = i * 2.399, r = t * (1.5 + (i % 4)) * sc; s.position.set(c.x + Math.cos(a) * r, c.y + ((i % 3) * .3 + t * 1.2) * sc, c.z + Math.sin(a) * r); s.scale.setScalar((.3 + t * .9) * sc); s.material.opacity = clamp(.6 - t * .4); });
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const pop = (lt, at = 0) => spring(clamp((lt - at) * 1.8));
// gente del pueblo en la calle: caminan, todos con la misma sonrisa
const townWalk = (T, lt, n = 8, z0 = 0, dir = 1) => { for (let i = 0; i < n; i++) { const e = fk[i], s = i % 2 ? 1 : -1; walkTo(e, s * (3 + (i % 3) * 2.6), z0 - i * 5 * dir, dir > 0 ? 0 : Math.PI, T + (i % 3) * .05, lt, 2.2); face(e, { mouth: 'grin', eyes: 'open', noBlink: 1 }, T); } };

// ---------- capa 2D ----------
const BAD = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD.push({ kind, text, x, y, s: spring(clamp(k) * 1.6) * sc, a, on: k > 0 });
const bubble = (ch, text, k, dy = 2.4) => BAD.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(clamp(k) * 1.6), a: 1, on: k > 0 });
function drawBadge(b) {
  if (!b.on) return; if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; b.x = clamp(x, 220, W - 220); b.y = clamp(y, 200, H * .62); } if (b.s <= .01 || b.a <= 0) return;
  const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red') { c.font = `700 100px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 620) { const k = 620 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#5a0010' : '#1d2238'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50); if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 48px ${FONT}`; const w = c.measureText(b.text).width + 56; c.fillStyle = '#1d2238'; c.beginPath(); c.roundRect(-w / 2, -38, w, 76, 38); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#fff'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'bubble') { c.font = `700 46px ${FONT}`; const w = Math.max(160, c.measureText(b.text).width + 60); c.fillStyle = '#fff'; c.strokeStyle = '#1a1a1a'; c.lineWidth = 6; c.beginPath(); c.roundRect(-w / 2, -44, w, 88, 36); c.fill(); c.stroke(); c.beginPath(); c.moveTo(-18, 42); c.lineTo(10, 42); c.lineTo(-24, 78); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#1a1a1a'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'heart') { const sc = 1 + Math.max(0, Math.sin(b.text * 9)) * .25; c.scale(sc, sc); c.fillStyle = '#e8203a'; c.strokeStyle = '#4a0010'; c.lineWidth = 8; c.beginPath(); c.moveTo(0, 40); c.bezierCurveTo(-90, -20, -50, -90, 0, -45); c.bezierCurveTo(50, -90, 90, -20, 0, 40); c.fill(); c.stroke(); }
  c.restore(); }
const KEY = /^(Mensch|Gesicht|gefressen|Mauer|Bergen|Spion|klein|Nacht|Mama|Jäger|Tor|Leben|Schatz|falsch|Brandt|Rasen|Gras|Bäckerei|zwanzig|Brot|lachen|Dunkeln|Wand|Regeln|weinen|Herz|keins|Lenny|links|Hund|Tränen|Pinselwasser|Festnacht|Haken|Jacken|schwarz|nass|Maul|dreizehn|Frühling|Winter|Käfig|Papa|spuckte|Monster|Papas|lange|Nein|Geburtstag|Halle|Gesichter|Nichts|weinte|Hand|Lauf|Kumpel|Stimme|Wasserturm|wusstest|Freund|allein|Weg|Funkgerät|Schulter|Nagel|Anfang|Hundert|schwarz|eigene|Hause|auf)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI;
// posiciones fijas
const HOMEZ = -40;   // calle principal: casa del narrador (izquierda) y la de enfrente (derecha)
const VS = 200, BR = V(186, 0, 30);   // Vorstadt, jardín de Herr Brandt

// 1 GANCHO — golpe de zoom en el fotograma 0: el narrador camina hacia cámara entre vecinos idénticos
shot(0, 'W', null, L => { use('ST'); townWalk(L.T, L.lt, 8, -26); walkTo(hero, 0, -30, 0, L.T, L.lt, 2.2); face(hero, { mouth: 'flat', look: [Math.sin(L.T * 2) * .6, 0], brows: -.2 }, L.T);
  const z0 = .3, h = hero.root.position; if (L.T < z0) { const k = easeOut(L.T / z0); cam([h.x, lerp(9, 5.2, k), h.z + lerp(30, 12, k)], [h.x, 4.2, h.z], lerp(76, 46, k)); } else cm([h.x, 5.2, h.z + 12, h.x, 4.2, h.z, 46], [h.x + 1, 5, h.z + 9.5, h.x, 4.2, h.z, 44], (L.lt - z0) / (L.d - z0), q => q); sh(h, 30); },
  [[0, 'zoom_fast', 1], [.1, 'steps', .6], [.5, 'city_amb', .5], [1.1, 'steps', .5]]);
// 2 Alle anderen sehen nur so aus. — contrapicado de la multitud al paso
shot(st(2) - .24, 'Z', null, L => { use('ST'); for (let i = 0; i < 7; i++) { const e = fk[i]; walkTo(e, -6 + i * 2, -50 - (i % 2) * 3, 0, L.T, L.lt, 2.2); face(e, { mouth: 'grin', eyes: 'open', noBlink: 1 }, 0); } cm([-9, 1.2, -32, 0, 6, -50, 50], [7, 1.4, -31, 0, 6, -48, 48], L.k); sh(V(0, 0, -48), 30); },
  [[0, 'steps', .7], [.4, 'steps', .6], [.9, 'cloth', .4], [1.3, 'steps', .6]]);
// 3 Denn jedes Gesicht hier gehörte mal jemandem, — farola con cartel VERMISST
shot(st(3) - .1, 'C', null, L => { use('ST'); show(poster, 11.1, 6.4, -52, -PI / 2); walkTo(fk[3], 8.4, -47, PI, L.T, L.lt, 2.4); face(fk[3], { mouth: 'grin', noBlink: 1 }, 0); cm([3.5, 6.8, -50, 11, 6.4, -52, 34], [6.4, 6.6, -51.4, 11, 6.4, -52, 30], L.k, easeIn); sh(V(10, 0, -52), 20); },
  [[0, 'wind', .6], [.4, 'paper', .7], [1.0, 'steps', .5]]);
// 4 den sie gefressen haben. — primer plano: la sonrisa se ensancha (zoom lento + golpe)
shot(wt('den', st(3) + .5), 'F', 'slow', L => { use('ST'); put(fk[1], 0, 0, -70, 0); applyPose(fk[1], idlePose(L.T)); face(fk[1], { mouth: L.k > .55 ? 'teeth' : 'grin', eyes: L.k > .55 ? 'wide' : 'open', noBlink: 1, brows: L.k > .55 ? .2 : 0 }, 0); onFace(fk[1], 6.5, .2, 0, 36, L.k, 4.6); sh(V(0, 0, -70), 20); },
  [[.2, 'breath', .5], [.8, 'creepy_ting', .6]]);
// 5 Die letzten Menschen leben hinter der Mauer in den Bergen. — gran plano de la Mauer, dron avanzando
shot(st(4), 'S', null, L => { use('MA'); day(); setSky([.4, .62, .95], [.66, .82, 1], [.9, .95, 1]); for (let i = 0; i < 2; i++) { const g = fk[8 + i]; put(g, MX - 30 + i * 60 + Math.sin(L.T * .6 + i) * 6, MA.Hh + .6, -60 + 4, i ? -PI / 2 : PI / 2); applyPose(g, walkPose(L.T + i, .4)); face(g, { mouth: 'smile' }, L.T); }
  cm([MX + 10, 34, 120, MX, 30, -60, 50], [MX + 4, 30, 70, MX, 30, -60, 50], L.k); sh(V(MX, 0, -40), 90); badge('tag', 'DIE MAUER', W / 2, H * .14, L.lt - .3); },
  [[0, 'wind', .8], [.6, 'bell_far', .4], [1.4, 'steps_snow', .4]]);
// 6 Und ich bin ihr Spion. — el narrador, pequeño, ante la puerta de hierro; grúa que sube
shot(st(5), 'R', null, L => { use('MA'); put(hero, MX, 0, -30, PI); kp(hero, L.lt, [[0, { headX: -.2 }], [.5, { headX: -.55, aRx: .4, aRe: 1.6 }], [1.1, { headX: -.6, aRx: .2, aRe: 1.2 }]]); face(hero, { mouth: 'flat', look: [0, -1], brows: -.3 }, L.T);
  cm([MX + 2, 3, -6, MX, 8, -40, 54], [MX + 2, 7, -4, MX, 16, -52, 56], L.k); sh(V(MX, 0, -40), 40); },
  [[0, 'steps_snow', .6], [.6, 'cloth', .5], [1.0, 'wind', .5]]);
// 7 Weil ich klein bin. Und die Kleinen kontrolliert keiner. — dos cazadores pasan de largo
shot(st(6) - .1, 'W', null, L => { use('ST'); for (let i = 0; i < 2; i++) { walkTo(hun[i], -1.6 + i * 3.6, -80, 0, L.T + i * .3, L.lt, 2.4, false, .5); face(hun[i], { mouth: 'flat', eyes: 'half', look: [i ? -.8 : .8, .4] }, L.T); hun[i].props.lantern.visible = false; }
  put(hero, .8, 0, -66, PI); applyPose(hero, { ...RIGID, headX: .1 }); face(hero, { mouth: L.k > .6 ? 'frown' : 'flat', look: [0, -.2], sweat: 1, brows: -.4 }, L.T);
  const h = hero.root.position; cm([h.x - 5, 3.5, h.z - 9, h.x, 4, h.z, 46], [h.x + 4, 3.5, h.z - 9.5, h.x, 4, h.z, 44], L.k); sh(h, 30); },
  [[0, 'steps_heavy', .7], [.6, 'steps_heavy', .6], [1.3, 'gulp', .7], [1.9, 'steps_heavy', .5]]);
// 8 Jede Nacht funke ich Mama an, — desván: gira el dial, el LED se enciende
shot(st(8), 'I', null, L => { use('DA'); inside(.5, .1); chair(DX - 1.2, -6.2, PI); sit(hero, DX - 1.2, 2.6, -6.4, PI, { ...RADIO, aLx: 1.0, aLe: 1.2 }); face(hero, { mouth: 'flat', look: [0, .3] }, L.T); DA.radio.userData.led.visible = L.lt > .6 || (L.lt * 8 | 0) % 2;
  cm([DX + 3.8, 6.4, -8.8, DX - 1.2, 4.8, -6.4, 44], [DX + 3.2, 6.2, -8.9, DX - 1.2, 4.8, -6.4, 40], L.k); },
  [[0, 'cricket', .4], [.3, 'dial', .8], [.9, 'radio', .6], [1.4, 'click_set', .5]]);
// 9 sobald die Jäger losziehen. — desde la ventana redonda: los cazadores salen con faroles
shot(W2('sobald', 8), 'Z', null, L => { use('ST'); night(); for (let i = 0; i < 2; i++) { walkTo(hun[i], -3 + i * 6, -100, PI, L.T + i * .4, L.lt, 2.2, false, .5); face(hun[i], { mouth: 'flat', eyes: 'half' }, L.T); }
  cm([-14, 22, -80, 0, 2, -104, 46], [-12, 21, -82, 0, 2, -106, 42], L.k); sh(V(0, 0, -100), 30); badge('tag', '🔦 JÄGER', W / 2, H * .14, L.lt - .3); },
  [[0, 'owl', .5], [.3, 'steps_heavy', .6], [.9, 'steps_heavy', .5]]);
// 10 So schließt die Mauer rechtzeitig das Tor. — la puerta de hierro se cierra
shot(st(9) - .06, 'C', null, L => { use('MA'); night(); hemi.intensity = 1.4; sun.intensity = 1.2; const k = easeInOut(clamp(L.lt / 1.5)); MA.doors[0].rotation.y = lerp(-1.3, 0, k); MA.doors[1].rotation.y = lerp(1.3, 0, k);
  for (let i = 0; i < 2; i++) { const s = i ? 1 : -1; put(fk[10 + i], MX + s * lerp(18, 6, k), 0, -50, s > 0 ? -PI / 2 : PI / 2); applyPose(fk[10 + i], { lean: .4, aRx: 1.5, aLx: 1.5, aRe: .3, aLe: .3, ...walkPose(L.T, .5), lean: .45 }); face(fk[10 + i], { mouth: 'teeth', eyes: 'squint', brows: .5 }, L.T); }
  cm([MX - 10, 5, -10, MX, 12, -55, 58], [MX - 8, 5, -16, MX, 13, -55, 56], L.k); sh(V(MX, 0, -50), 40); },
  [[0, 'metal_creak', .8], [.5, 'chain_rattle', .6], [1.45, 'door_slam', 1], [1.5, 'impact', .6]]);
// 11 „Noch am Leben." — susurra a la radio
shot(st(10) - .07, 'S', null, L => { use('DA'); inside(.5, .1); chair(DX - 1.2, -6.2, PI); sit(hero, DX - 1.2, 2.6, -6.4, PI, { ...RADIO, aLx: 1.3, aLe: 2.2, aLz: -.3, headX: .25 }); talkFace(hero, L.T, L.t0, L.t1, { mouth: 'flat', eyes: 'half', look: [0, .4] }); DA.radio.userData.led.visible = true;
  onFace(hero, 4.6, .4, -1.4, 38, L.k, 3.6); }, [[0, 'whisper', .6], [.2, 'tv_static', .4]]);
// 12 „Bleib versteckt, Schatz." — Mama en la Funkhütte, sonrisa triste, toca la foto
shot(st(11), 'W', null, L => { use('FU'); inside(.8, .2); chair(FX + .5, -4.8, .5); sit(mom, FX + .5, 2.6, -5, .5, { aRx: 1.2, aRe: 1.6, aLx: 1.0, aLe: .9, aLz: .3 }); talkFace(mom, L.T, L.t0, L.t1, { mouth: 'smile', brows: -.4, eyes: 'half' });
  onFace(mom, 6, .3, -1.5, 40, L.k, 4.8); }, [[0, 'radio', .5], [.3, 'fire_crackle', .5], [.9, 'cloth', .4]]);
// 13 Sie machen uns alles nach. — un vecino copia el saludo del otro un segundo tarde
shot(st(12) - .04, 'F', null, L => { use('ST'); put(fk[0], -2.4, 0, -90, .4); put(fk[5], 2.4, 0, -90, -.4); applyPose(fk[0], WAVE(L.T)); applyPose(fk[5], L.lt > .45 ? WAVE(L.T - .45) : RIGID); face(fk[0], { mouth: 'grin', noBlink: 1 }, 0); face(fk[5], { mouth: 'grin', noBlink: 1, look: [-.8, 0] }, 0);
  cm([-4, 4.6, -78, 0, 4.2, -90, 46], [4, 4.6, -78, 0, 4.2, -90, 44], L.k); sh(V(0, 0, -90), 20); }, [[0, 'birds', .4], [.2, 'cloth', .5], [.7, 'cloth', .5]]);
// 14 Nur ein bisschen falsch. — se dan la mano cruzada (izquierda con derecha)
shot(st(13) - .06, 'R', null, L => { use('ST'); put(fk[2], -1.6, 0, -96, PI / 2); put(fk[6], 1.6, 0, -96, -PI / 2); const sh2 = Math.sin(L.T * 14) * .12; applyPose(fk[2], { aLx: 1.3, aLe: .2, aLz: -.2 + sh2 }); applyPose(fk[6], { aLx: 1.3, aLe: .2, aLz: -.2 - sh2 }); face(fk[2], { mouth: 'grin', noBlink: 1 }, 0); face(fk[6], { mouth: 'grin', noBlink: 1 }, 0);
  cm([0, 7, -82, 0, 4, -96, 36], [0, 6.8, -83, 0, 4, -96, 34], L.k); badge('red', 'FALSCH!', W / 2, H * .16, L.lt - .3, 1, .8); sh(V(0, 0, -96), 20); }, [[0, 'zoom_in', .5], [.2, 'slap', .5], [.6, 'creepy_ting', .5]]);
// 15 Herr Brandt mäht den ganzen Tag Rasen. — empuja el cortacésped feliz
shot(st(14), 'Z', null, L => { use('ST'); const x = BR.x + Math.sin(L.T * .9) * 3; put(brandt, x - 3.2, 0, BR.z, PI / 2); applyPose(brandt, { ...walkPose(L.T, .45), aRx: 1.0, aLx: 1.0, aRe: .4, aLe: .4, lean: .18 }); face(brandt, { mouth: 'grin', eyes: 'happy' }, L.T);
  show(MOW, x + .4, 0, BR.z, PI / 2); MOW.rotation.z = Math.sin(L.T * 30) * .01; dustAt(V(x + 1, .2, BR.z), (L.T * .8) % 1, .8); cm([BR.x + 12, 5, BR.z + 14, BR.x, 3, BR.z, 46], [BR.x + 15, 5, BR.z + 8, BR.x, 3, BR.z, 46], L.k); sh(BR, 30); },
  [[0, 'machine_hum', .7], [.4, 'machine_shake', .5], [1.2, 'birds', .4], [1.8, 'machine_hum', .6]]);
// 16 Obwohl da kein Gras mehr ist. — picado sobre la tierra pelada
shot(st(15) - .03, 'S', null, L => { use('ST'); const x = BR.x + 1; put(brandt, x - 3.2, 0, BR.z, PI / 2); applyPose(brandt, { ...walkPose(L.T, .45), aRx: 1.0, aLx: 1.0, aRe: .4, aLe: .4, lean: .18 }); face(brandt, { mouth: 'grin', eyes: 'happy' }, L.T); show(MOW, x + .4, 0, BR.z, PI / 2); dustAt(V(x + 1.2, .2, BR.z), (L.T * .8) % 1, 1.2);
  cm([BR.x + 2, 10, BR.z + 4, BR.x + 1, 0, BR.z, 48], [BR.x + 2, 16, BR.z + 3, BR.x + 1, 0, BR.z, 48], L.k); badge('tag', '0 GRAS', W / 2, H * .16, L.lt - .4); sh(BR, 30); }, [[0, 'machine_hum', .6], [.4, 'rubble', .4], [.9, 'wind', .4]]);
// 17 Die Bäckerei verkauft — fachada, un cliente sale con una barra
shot(st(16) - .1, 'W', null, L => { use('ST'); walkTo(fk[4], -20.2, -3.2, PI / 2 + .3, L.T, L.lt, 2); face(fk[4], { mouth: 'grin', noBlink: 1 }, 0); attach(LOAF1, fk[4].aR.hand, [0, -.6, .4], [0, 0, PI / 2], .8);
  applyPose(fk[4], { ...walkPose(L.T, .5), aRx: .8, aRe: 1.2 }); cm([2, 6, 12, -19, 5, -1, 50], [0, 6, 9, -19, 5, -1, 46], L.k); sh(V(-14, 0, 2), 30); }, [[0, 'door_bell', .8], [.4, 'steps', .5], [1.0, 'birds', .4]]);
// 18 seit zwanzig Jahren dasselbe Brot. — el panadero levanta la barra orgulloso; pop-up 20 JAHRE
shot(W2('seit', 16), 'C', null, L => { use('BK'); inside(1, .3); put(baker, BX, 0, -5.4, 0); attach(LOAF2, baker.aR.hand, [0, -.6, .3], [0, 0, PI / 2], 1); kp(baker, L.lt, [[0, { aRx: .3, aRe: .4 }], [.5, { aRx: 2.3, aRe: .7, aRz: .2 }]]); face(baker, { mouth: 'grin', eyes: 'open', noBlink: 1 }, 0);
  cm([BX + 2, 6.5, 7, BX, 5.5, -5, 46], [BX + 1.5, 6.5, 4, BX, 5.5, -5, 40], L.k); badge('big', '20 JAHRE', W / 2, H * .16, L.lt - .3); }, [[0, 'impact_soft', .6], [.4, 'paper', .5], [1.0, 'ding_soft', .4]]);
// 19 Reingebissen hat nie jemand. — la barra entera, polvorienta; una mano la gira
shot(st(17) - .14, 'I', null, L => { use('BK'); inside(1, .3); put(baker, BX, 0, -5.4, 0); applyPose(baker, { aRx: 1.2, aRe: .6, aLx: 1.2, aLe: .6, headX: .3 }); face(baker, { mouth: 'grin', noBlink: 1, look: [0, 1] }, 0); show(LOAF3, BX, 4.3, -3, L.lt * .8, 1.3);
  cm([BX + 3, 6, 3, BX, 4.6, -3.4, 36], [BX - 2.4, 6, 3, BX, 4.6, -3.4, 34], L.k); badge('tag', 'KEIN BISS', W / 2, H * .16, L.lt - .5); }, [[0, 'plate_slide', .5], [.6, 'sniff', .5], [1.1, 'tick', .4]]);
// 20 Alle lachen gleichzeitig. — plaza: 8 vecinos ríen a la vez; alejamiento rápido
shot(st(18), 'F', null, L => { use('ST'); for (let i = 0; i < 8; i++) { const e = fk[i]; put(e, -9 + (i % 4) * 6 + (i > 3 ? 3 : 0), 0, -160 - (i > 3 ? 6 : 0), (i % 4 - 1.5) * .15); applyPose(e, LAUGH(L.T)); face(e, { mouth: 'shout', eyes: 'happy' }, 0); }
  put(hero, 0, 0, -154, 0); applyPose(hero, RIGID); face(hero, { mouth: 'flat', eyes: 'wide', look: [.6, 0] }, L.T); const k = easeOut(clamp(L.lt / .35)); cam([0, 6, lerp(-144, -132, k)], [0, 4.4, -160], lerp(40, 54, k)); sh(V(0, 0, -160), 30); },
  [[0, 'zoom_out', .6], [.05, 'laugh_m', .9], [.1, 'kids_laugh', .6], [.5, 'laugh_deep', .7]]);
// 21 Und hören gleichzeitig auf. — se callan en seco; el narrador fuerza una risa
shot(st(19), 'W', null, L => { use('ST'); for (let i = 0; i < 8; i++) { const e = fk[i]; put(e, -9 + (i % 4) * 6 + (i > 3 ? 3 : 0), 0, -160 - (i > 3 ? 6 : 0), (i % 4 - 1.5) * .15); applyPose(e, L.lt < .25 ? LAUGH(L.T) : { ...RIGID, headY: L.lt > .9 ? (i % 2 ? .5 : -.5) * clamp((L.lt - .9) * 3) : 0 }); face(e, L.lt < .25 ? { mouth: 'shout', eyes: 'happy' } : { mouth: 'flat', eyes: 'open', noBlink: 1 }, 0); }
  put(hero, 0, 0, -154, 0); applyPose(hero, L.lt < .9 ? RIGID : LAUGH(L.T)); face(hero, L.lt < .9 ? { mouth: 'flat', eyes: 'wide', sweat: 1 } : { mouth: 'grin', eyes: 'squint', sweat: 1 }, L.T);
  cm([0, 6, -132, 0, 4.4, -160, 54], [0, 5, -146, 0, 4.4, -156, 40], L.k); sh(V(0, 0, -160), 30); }, [[0, 'laugh_m', .6], [.26, 'freeze', .8], [.7, 'silence_tick', .6], [.95, 'laugh_m', .4]]);
// 22 Und nachts stehen sie im Dunkeln, — salón a oscuras: una familia de pie, inmóvil
shot(st(20) - .15, 'Z', null, L => { use('WO'); inside(.35, .05); for (let i = 0; i < 3; i++) { const e = [fk[0], fk[7], kids[0]][i]; put(e, WX - 5 + i * 5, 0, -9, PI); applyPose(e, RIGID); face(e, { mouth: 'flat', eyes: 'open', noBlink: 1 }, 0); }
  cm([WX + 13, 6, 6, WX, 4.5, -9, 46], [WX + 8, 6, 8, WX, 4.5, -9, 46], L.k); }, [[0, 'clock_tick', .6], [.6, 'clock_tick', .5], [1.2, 'wood_creak', .4]]);
// 23 das Gesicht zur Wand. — detrás: tres nucas frente a la pared
shot(W2('das', 20), 'S', null, L => { use('WO'); inside(.35, .05); for (let i = 0; i < 3; i++) { const e = [fk[0], fk[7], kids[0]][i]; put(e, WX - 5 + i * 5, 0, -10.6, PI); applyPose(e, RIGID); face(e, { mouth: 'flat', eyes: 'open', noBlink: 1 }, 0); }
  cm([WX, 6.5, 2, WX, 5, -12, 44], [WX, 6, -1, WX, 5, -12, 40], L.k); }, [[0, 'clock_tick', .6], [.6, 'clock_tick', .5], [1.0, 'breath', .3]]);
// 24 Also stehe ich auch. — el narrador también, ojos muy abiertos (de lado)
shot(st(21) - .07, 'C', null, L => { use('WO'); inside(.35, .05); put(hero, WX + 4, 0, -10, PI); applyPose(hero, RIGID); face(hero, { mouth: 'frown', eyes: 'wide', look: [-.9, 0], noBlink: 1 }, 0); put(fk[7], WX - 2, 0, -10, PI); applyPose(fk[7], RIGID);
  const a = -.55 + L.k * .3; cam([WX + 4 + Math.cos(a) * 6, 4.6, -10 + Math.sin(a) * 6], [WX + 3.4, 3.9, -10], 44); }, [[0, 'impact_soft', .5], [.3, 'clock_tick', .6], [.8, 'heartbeat', .5]]);
// 25 Ich habe zwei Regeln. — dos dedos, pop-up 2
shot(st(22) - .1, 'R', null, L => { use('DA'); inside(.6, .1); put(hero, DX, 0, -2, 0); kp(hero, L.lt, [[0, {}], [.35, { aRx: 2.3, aRe: .9, aRz: -.2 }]]); talkFace(hero, L.T, L.t0, L.t1, { mouth: 'flat', brows: .3 }); onFace(hero, 8, .5, 0, 44, L.k, 6.5); badge('big', '2 REGELN', W / 2, H * .16, L.lt - .3); },
  [[0, 'zoom_fast', .6], [.3, 'cloth', .5], [.8, 'pop', .4]]);
// 26 Nie weinen, denn sie können es nicht. — ante el espejo se seca la lágrima (zoom lento)
shot(st(23) - .1, 'I', 'slow', L => { use('DA'); inside(.6, .1); show(mirror, DX - 8, 6, -14.4); put(hero, DX - 8, 0, -9.6, PI); kp(hero, L.lt, [[0, { headX: .1 }], [.8, { aRx: 2.1, aRe: 2.3, aRz: -.4, headX: .2 }], [1.3, { aRx: 1.6, aRe: 2.2, headX: .15 }]]); face(hero, { mouth: 'frown', brows: -.5, tears: L.lt < 1 ? 1 : 0 }, L.T);
  onFace(hero, 4.2, .3, .6, 40, L.k, 3.2); badge('red', 'NIE WEINEN', W / 2, H * .15, L.lt - .3, 1, .8); }, [[0, 'sniff', .7], [.7, 'cloth', .5], [1.2, 'breath', .4]]);
// 27 Und niemand darf mein Herz hören, — se tapa el pecho; el corazón late
shot(st(24), 'F', null, L => { use('DA'); inside(.6, .1); put(hero, DX, 0, -4, 0); applyPose(hero, { aRx: 1.0, aRe: 1.7, aRz: -.6, aLx: .9, aLe: 1.6, aLz: -.6, headX: .25 }); face(hero, { mouth: 'frown', eyes: 'wide', look: [0, .6] }, L.T);
  const p = hero.spine.getWorldPosition(V(0, 0, 0)); cm([p.x + 1, p.y + 2.6, p.z + 7, p.x, p.y + 1.6, p.z, 40], [p.x + .8, p.y + 2.4, p.z + 5.5, p.x, p.y + 1.6, p.z, 38], L.k); BAD.push({ kind: 'heart', text: L.T, x: W / 2, y: H * .45, s: spring(clamp(L.lt * 2)) * 1.4, a: .9, on: true }); }, [[0, 'heartbeat', .9], [.7, 'heartbeat', .9], [1.3, 'heartbeat', .9]]);
// 28 denn sie haben keins. — un vecino se abre la chaqueta: dentro, oscuridad (golpe dramático)
shot(W2('denn', 24), 'W', null, L => { use('ST'); dusk(); put(fk[0], 0, 0, -110, 0); kp(fk[0], L.lt, [[0, { aRx: .6, aRe: 1.6, aLx: .6, aLe: 1.6 }], [.5, { aRx: .9, aRe: 1.2, aRz: .9, aLx: .9, aLe: 1.2, aLz: .9 }]]); face(fk[0], { mouth: 'grin', noBlink: 1 }, 0);
  attach(HOLE, fk[0].spine, [0, 1.2, .56]); HOLE.scale.set(1, 1, 1); HOLE.visible = L.lt > .45; onFace(fk[0], 7, -1.8, 0, 40, L.k, 5.5); sh(V(0, 0, -110), 20); }, [[0, 'zip', .7], [.5, 'impact', .8], [.6, 'silence_tick', .6]]);
// 29 Deshalb lasse ich keinen an mich ran. — patio: come solo en un banco
shot(st(25), 'Z', null, L => { use('ST'); show(bench, 0, 0, -165, 0); sit(hero, 0, 2.3, -165.6, 0, { aRx: .9, aRe: 1.4 }); attach(lunch, hero.aR.hand, [0, -.6, .3]); face(hero, { mouth: 'frown', look: [0, .5], brows: -.3 }, L.T);
  for (let i = 0; i < 3; i++) { const k = kids[1 + i]; put(k, -14 + i * 4, 0, -176, .4 * (i - 1)); applyPose(k, LAUGH(L.T + i)); face(k, { mouth: 'grin', eyes: 'happy' }, 0); }
  cm([8, 5, -150, 0, 3.5, -166, 46], [4, 5, -152, 0, 3.5, -166, 44], L.k); sh(V(0, 0, -166), 30); }, [[0, 'kids_laugh', .4], [.6, 'chew', .6], [1.3, 'birds', .4]]);
// 30 Außer Lenny. — Lenny se sienta de un salto a su lado y sonríe
shot(st(26) - .04, 'S', null, L => { use('ST'); show(bench, 0, 0, -165, 0); sit(hero, 0, 2.3, -165.6, 0, { aRx: .9, aRe: 1.4 }); face(hero, { mouth: L.lt > .3 ? 'smile' : 'o', look: [.8, 0] }, L.T);
  const k = clamp(L.lt / .4), jy = Math.sin(k * PI) * 1.5; sit(len, lerp(4.5, 2.2, k), 2.3 + jy, -165.6, 0, { aLz: .3 + jy * .3, aRz: .3 }); face(len, { mouth: 'grin', look: [-.8, 0] }, L.T); onFace(len, 7, .4, -1.6, 46, L.k, 6); sh(V(0, 0, -166), 30); },
  [[0, 'zoom_in', .5], [.05, 'jump_small', .7], [.4, 'land', .6]]);
// 31 Er sitzt immer links von mir. — en el aula, Lenny en el pupitre de la izquierda saluda
shot(st(27), 'R', null, L => { use('KU'); inside(1.2, .9); chair(KX, 7.4, PI); sit(hero, KX, 2.3, 7, PI, { aRx: .9, aRe: 1.0, aLx: .9, aLe: 1.0 }); chair(KX - 3.4, 7.4, PI); sit(len, KX - 3.4, 2.3, 7, PI, { ...WAVE(L.T), aLx: .9, aLe: 1.0 }); face(hero, { mouth: 'smile', look: [-.5, 0] }, L.T); face(len, { mouth: 'grin' }, L.T);
  cm([KX - 6, 6.5, -4, KX - 1.7, 4.5, 7, 44], [KX + 2, 6.5, -4, KX - 1.7, 4.5, 7, 44], L.k); badge('tag', '⬅ LINKS', W * .32, H * .2, L.lt - .3); }, [[0, 'classroom', .5], [.4, 'chair_roll', .5], [.9, 'cloth', .4]]);
// 32 Und er ist der Einzige, der im richtigen Moment lacht. — chiste del profesor: Lenny ríe a tiempo
shot(st(28), 'W', null, L => { use('KU'); inside(1.2, .9); put(fk[4], KX, 0, -10, 0); applyPose(fk[4], { aRx: 1.6, aRe: .5, aRz: .3, ...{} }); talkFace(fk[4], L.T, L.t0, L.t0 + .8, { mouth: 'grin' });
  chair(KX, 7.4, PI); sit(hero, KX, 2.3, 7, PI); chair(KX - 3.4, 7.4, PI); sit(len, KX - 3.4, 2.3, 7, PI); const ok = L.lt > 1.0, late = L.lt > 1.8; applyPose(hero, ok ? { ...SIT, ...LAUGH(L.T), crouch: .2, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5 } : SIT); applyPose(len, ok ? { ...SIT, ...LAUGH(L.T + .3), crouch: .2, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5 } : SIT);
  face(hero, ok ? { mouth: 'grin', eyes: 'happy' } : { mouth: 'flat' }, L.T); face(len, ok ? { mouth: 'grin', eyes: 'happy' } : { mouth: 'smile' }, L.T);
  for (let i = 0; i < 2; i++) { const k = kids[i]; chair(KX + 8 + i * 3.4, 7.4, PI); sit(k, KX + 8 + i * 3.4, 2.3, 7, PI, late ? { ...SIT, ...LAUGH(L.T) } : {}); face(k, late ? { mouth: 'shout', eyes: 'happy' } : { mouth: 'flat', eyes: 'open', noBlink: 1 }, 0); }
  cm([KX + 3, 7, -3, KX + 1, 4.5, 7, 50], [KX - 1, 6.5, -1, KX - 1.7, 4.5, 7, 40], L.k); }, [[0, 'chalk', .5], [1.0, 'laugh_m', .6], [1.05, 'kids_laugh', .5], [1.8, 'laugh_deep', .5]]);
// 33 Als unser Hund starb, — desván: la radio, baja la cabeza; un collar en la mesa
shot(st(29) - .08, 'I', null, L => { use('DA'); inside(.5, .1); collar.visible = true; chair(DX - 1.2, -6.2, PI); sit(hero, DX - 1.2, 2.6, -6.4, PI, { ...RADIO, headX: lerp(.1, .5, clamp(L.lt)) }); face(hero, { mouth: 'frown', eyes: L.lt > .6 ? 'half' : 'open', brows: -.6 }, L.T); DA.radio.userData.led.visible = true;
  cm([DX + 4, 6.6, -9, DX - .6, 4.4, -6.8, 46], [DX + 3.4, 6.4, -9.2, DX - .6, 4.4, -6.8, 42], L.k); badge('tag', '🐕 ✝', W / 2, H * .16, L.lt - .3); }, [[0, 'radio', .4], [.3, 'sad_tone', .6], [.9, 'sigh_kid', .6]]);
// 34 kamen mir im Unterricht die Tränen. — Kunstraum: le tiembla el labio, asoma una lágrima (zoom lento)
shot(W2('kamen', 29), 'C', 'slow', L => { use('KU'); inside(1.2, .9); chair(KX, 7.4, PI); sit(hero, KX, 2.3, 7, PI, { aRx: 1.0, aRe: 1.0, headX: .25 + Math.sin(L.T * 20) * .02 }); face(hero, { mouth: 'frown', brows: -.7, tears: L.k > .5 ? 1 : 0, eyes: 'half' }, L.T);
  onFace(hero, 5.5, .6, .5, 40, L.k, 4); }, [[0, 'sniff', .6], [.7, 'shiver', .4]]);
// 35 Doch bevor jemand hinsah, — dos compañeros giran la cabeza hacia él
shot(st(30), 'Z', null, L => { use('KU'); inside(1.2, .9); for (let i = 0; i < 2; i++) { const k = kids[i]; chair(KX + 8 + i * 3.4, 7.4, PI); sit(k, KX + 8 + i * 3.4, 2.3, 7, PI, { headY: -1.1 * easeInOut(clamp((L.lt - .2) * 2)) }); face(k, { mouth: 'flat', eyes: 'open', noBlink: 1, look: [-1, 0] }, 0); }
  chair(KX, 7.4, PI); sit(hero, KX, 2.3, 7, PI, { headX: .3 }); face(hero, { mouth: 'frown', tears: 1 }, L.T); cm([KX + 14, 6, -1, KX + 6, 4.6, 7, 46], [KX + 13, 6, 1, KX + 6, 4.6, 7, 42], L.k); }, [[0, 'zoom_in', .5], [.2, 'wood_creak', .5], [.6, 'wood_creak', .5]]);
// 36 kippte mir Lenny Pinselwasser ins Gesicht. — Lenny vuelca el tarro: salpicadura de colores
shot(W2('kippte', 30), 'F', null, L => { use('KU'); inside(1.2, .9); chair(KX, 7.4, PI); sit(hero, KX, 2.3, 7, PI, { headX: -.2, aLz: .5, aRz: .5 }); chair(KX - 3.4, 7.4, PI); sit(len, KX - 3.4, 2.3, 7, PI); const t = L.lt - .45;
  kp(len, L.lt, [[0, { ...SIT, aLx: .8, aLe: .6 }], [.4, { ...SIT, aLx: 1.5, aLe: .2, aLz: -.6, lean: .2 }]]); face(len, { mouth: 'o', eyes: 'wide' }, L.T); face(hero, t > 0 ? { mouth: 'o', eyes: 'closed' } : { mouth: 'frown', tears: 1 }, L.T);
  const hpz = hp(hero); if (t > 0) dropsAt(hpz.clone().add(V(-1, .6, 0)), V(1.4, 1.6, 0), Math.min(t, .7), 26, 6); const c0 = hpz; cam([c0.x - 1.6, c0.y + .6, c0.z - 7], [c0.x - 1.2, c0.y - .2, c0.z], 42); camera.fov *= L.lt > .45 && L.lt < .7 ? .85 : 1; },
  [[0, 'zoom_fast', .6], [.45, 'splash', 1], [.55, 'water_bloop', .6], [1.0, 'drip', .5]]);
// 37 „Ups." Und ganz leise: — Lenny se tapa la boca y finge torpeza
shot(st(31) - .1, 'S', null, L => { use('KU'); inside(1.2, .9); chair(KX - 3.4, 7.4, PI); sit(len, KX - 3.4, 2.3, 7, PI, { aRx: 2.2, aRe: 2.4, aRz: -.4, headZ: .15 }); face(len, { mouth: 'o', eyes: 'squint', brows: -.3 }, L.T); chair(KX, 7.4, PI); sit(hero, KX, 2.3, 7, PI, { headX: .1 }); face(hero, { mouth: 'flat', eyes: 'open', look: [-.8, 0] }, L.T);
  const k = easeOut(clamp(L.lt / .3)); onFace(len, lerp(4.5, 6.5, k), .4, 0, 42); bubble(len, 'UPS!', L.lt - .05); }, [[0, 'zoom_out', .6], [.1, 'gasp', .5], [.8, 'drip', .4]]);
// 38 „Ich pass auf dich auf." — de perfil, Lenny susurra; el narrador abre mucho los ojos
shot(st(33) - .22, 'W', null, L => { use('KU'); inside(1.2, .9); chair(KX, 7.4, PI); sit(hero, KX, 2.3, 7, PI); chair(KX - 2.2, 7.4, PI - .9); sit(len, KX - 2.2, 2.3, 7, PI - .9, { lean: .2, aLx: .6, aLe: 1.2 }); talkFace(len, L.T, L.t0, L.t1, { mouth: 'smile', eyes: 'half' }); face(hero, { mouth: 'flat', eyes: 'wide', look: [-1, 0] }, L.T);
  cm([KX - 1, 5.6, 1.2, KX - 1, 4.6, 7, 40], [KX - 1, 5.4, 2.8, KX - 1, 4.6, 7, 36], L.k); }, [[0, 'whisper', .7], [.6, 'cloth', .4]]);
// 39 Einmal im Monat ist Festnacht. — Festhalle por fuera al atardecer, la multitud entra con faroles
shot(st(34) - .05, 'R', null, L => { use('ST'); dusk(); for (let i = 0; i < 8; i++) { walkTo(fk[i], -6 + (i % 4) * 4, -150 - Math.floor(i / 4) * 4, PI, L.T + i * .2, L.lt, 2.2); face(fk[i], { mouth: 'grin', noBlink: 1 }, 0); }
  for (let i = 0; i < 2; i++) { walkTo(hun[i], -8 + i * 16, -158, PI, L.T, L.lt, 2.2, false, .5); }
  cm([10, 24, -110, 0, 10, -190, 50], [8, 14, -128, 0, 12, -190, 50], L.k); sh(V(0, 0, -170), 50); badge('tag', 'FESTNACHT', W / 2, H * .14, L.lt - .3); }, [[0, 'crowd_run', .3], [.3, 'steps', .6], [.9, 'bell_far', .5], [1.4, 'murmur', .5]]);
// 40 Dann hängen alle ihre Gesichter an Haken. — un vecino se quita la cara y la cuelga (zoom lento)
shot(st(35) - .1, 'C', 'slow', L => { use('HA'); inside(1, .2); const v = fk[8]; put(v, HX + 1.5, 0, 22.6, PI); const t = L.lt;
  kp(v, t, [[0, { aRx: 2.6, aRe: 1.6, aRz: -.3 }], [.7, { aRx: 2.8, aRe: .6, aRz: -.2 }], [1.2, { aRx: 2.4, aRe: .5, aRz: .3 }]]); v.unmask(t > .5 ? 1 : 0, .3); face(v, { mouth: 'grin', noBlink: 1 }, 0); if (t > .5) v.unmask(1, .3);
  if (t > .5) { attach(FOLKF, t < 1.2 ? v.aR.hand : HA.HK, t < 1.2 ? [0, -.9, .6] : [-1.5 + 0.1, 7.5, 1.0], [0, t < 1.2 ? PI : 0, 0], t < 1.2 ? 1 : 1.25); }
  cm([HX + 7, 8, 13, HX + 1, 6.4, 24, 48], [HX + 6, 7.8, 15, HX + 1, 6.6, 24.5, 44], L.k); }, [[0, 'murmur', .4], [.5, 'rip', .6], [1.15, 'click_metal', .8]]);
// 41 Wie Jacken. — travelling por la fila de caras colgadas; otra mano cuelga otra
shot(st(36) - .16, 'Z', null, L => { use('HA'); inside(1, .2); const v = fk[9]; put(v, HX - 6 + L.k * 2, 0, 23.2, PI); v.unmask(1, .4); applyPose(v, { aRx: 2.6, aRe: .5 });
  cm([HX - 14 + L.k * 8, 7.5, 21, HX - 10 + L.k * 8, 7.4, 27, 40], [HX - 14 + L.k * 8, 7.5, 21, HX - 10 + L.k * 8, 7.4, 27, 40], 1); }, [[0, 'zoom_in', .5], [.1, 'click_metal', .6], [.4, 'cloth', .5]]);
// 42 Darunter: schwarz, nass, nur Maul. — primer plano de una cabeza sin cara (zoom lento + golpe)
shot(st(37), 'F', 'slow', L => { use('HA'); inside(.9, .2); const v = fk[8]; put(v, HX + 1.5, 0, 20, 0); applyPose(v, idlePose(L.T)); const open = .2 + .8 * Math.abs(Math.sin(L.lt * 2.6)); v.unmask(1, open);
  onFace(v, 7.5, .3, 0, 38, L.k, 4.2); }, [[0, 'drip', .7], [.5, 'growl', .7], [1.2, 'drip', .6], [1.7, 'growl', .6]]);
// 43 Kinder behalten ihr Gesicht bis dreizehn. — niños con cara junto a padres sin cara; pop-up 13
shot(st(39), 'S', null, L => { use('HA'); inside(1, .2); for (let i = 0; i < 3; i++) { const k = kids[i], p = fk[i + 1]; put(k, HX - 6 + i * 6, 0, 14, 0); put(p, HX - 7.6 + i * 6, 0, 13, 0); p.unmask(1, .3); applyPose(k, { aRx: 2.2, aRe: 2.2, aLx: 2.2, aLe: 2.2, aRz: -.3, aLz: -.3 }); face(k, { mouth: 'frown', eyes: 'wide' }, L.T); applyPose(p, { aLx: .4, aLe: .4 }); }
  cm([HX - 10, 6, 26, HX - 2, 4, 14, 46], [HX + 6, 6, 26, HX + 2, 4, 14, 46], L.k); badge('big', '13', W / 2, H * .16, L.lt - .4); }, [[0, 'murmur', .5], [.6, 'cloth', .4], [1.2, 'heartbeat', .5]]);
// 44 Dann ziehen sie es vor allen ab. — escenario: un chico se arranca la cara, el público aplaude
shot(st(40), 'W', null, L => { use('HA'); inside(1, .2); const b = kids[3]; put(b, HX, 2.4, -20, 0); const t = L.lt; kp(b, t, [[0, { aRx: 2.3, aRe: 2.0, aLx: 2.3, aLe: 2.0 }], [.6, { aRx: 2.6, aRe: .5, aLx: 2.6, aLe: .5 }]]); b.unmask(t > .55 ? 1 : 0, .5); if (t <= .55) face(b, { mouth: 'grin', eyes: 'closed' }, 0);
  if (t > .55) attach(FOLKF, b.aR.hand, [0, -.9, .5], [0, PI, 0], .8); for (let i = 0; i < 4; i++) { const p = fk[i + 4]; put(p, HX - 7 + i * 4.6, 0, -8, PI); p.unmask(1, .5); applyPose(p, { aRx: 1.4, aRe: 1.6 + Math.sin(L.T * 18 + i) * .3, aLx: 1.4, aLe: 1.6 + Math.sin(L.T * 18 + i + 1) * .3 }); }
  cm([HX - 3, 6, -9, HX, 6.5, -20, 46], [HX + 3, 5.6, -10, HX, 7, -20, 44], L.k); }, [[0, 'drone', .3], [.6, 'rip', .7], [.8, 'cheer', .6], [1.2, 'cheer', .4]]);
// 45 Und im Frühling werde ich dreizehn. — calendario: lo marca con miedo
shot(st(41) - .13, 'I', null, L => { use('DA'); inside(.8, .2); calendar.visible = true; calRing.visible = L.lt > .7; calRing.scale.setScalar(pop(L.lt, .7)); put(hero, DX + 8.2, 0, -11.4, PI - .5); applyPose(hero, { aRx: 2.0, aRe: .5, aRz: -.4 }); face(hero, { mouth: 'frown', eyes: 'wide', brows: -.5, look: [.4, -.4] }, L.T);
  cm([DX + 6, 8.4, -6, DX + 10, 7.8, -14.6, 40], [DX + 7, 8.2, -8.5, DX + 10, 7.6, -14.6, 34], L.k); badge('big', '13', W / 2, H * .16, L.lt - .7); }, [[0, 'zoom_fast', .6], [.3, 'pages', .6], [.8, 'pencil', .7], [1.3, 'gulp', .5]]);
// 46 Letzten Winter brachten die Jäger einen Käfig. — calle nevada: tiran del carro con la jaula
shot(st(42), 'R', null, L => { use('ST'); winter(); ST.SNOW.visible = true; const z = -120 + L.lt * 3; show(CAGE, 0, 0, z, PI / 2); for (let i = 0; i < 2; i++) { put(hun[i], -2 + i * 4, 0, z + 9, 0); applyPose(hun[i], { ...walkPose(L.T, .4), aRx: .8, aRe: .3, lean: .3 }); face(hun[i], { mouth: 'flat', eyes: 'half' }, L.T); hun[i].props.lantern.visible = false; }
  put(dad, 0, 2.5, z, 0); applyPose(dad, { ...SIT, crouch: 1.2, lLx: 1.6, lRx: 1.6, lLk: 2.4, lRk: 2.4, headX: .3 }); face(dad, { mouth: 'frown', eyes: 'half' }, L.T); snowFall(ST, 0, 0, z, L.T);
  cm([14, 6, z + 22, 0, 4, z, 46], [10, 5, z + 18, 0, 4, z, 46], L.k); sh(V(0, 0, z), 30); }, [[0, 'wheels', .7], [.4, 'steps_snow', .6], [1.0, 'wind', .6], [1.6, 'chain_rattle', .5]]);
// 47 Drin saß mein Papa. — se agarra a los barrotes (zoom lento + golpe)
shot(st(43) - .3, 'C', 'slow', L => { use('ST'); winter(); ST.SNOW.visible = true; show(CAGE, 0, 0, -116, PI / 2); put(dad, 0, 2.5, -115, 0); applyPose(dad, { ...SIT, crouch: 1.0, lLx: 1.6, lRx: 1.6, lLk: 2.4, lRk: 2.4, aRx: 1.6, aRe: 1.2, aLx: 1.6, aLe: 1.2 }); face(dad, { mouth: 'frown', eyes: 'open', brows: -.5, look: [Math.sin(L.T * 3) * .5, 0] }, L.T);
  snowFall(ST, 0, 0, -116, L.T); onFace(dad, 7, .2, 0, 40, L.k, 5); sh(V(0, 0, -116), 20); }, [[0, 'chain_rattle', .6], [.5, 'wind', .5]]);
// 48 Er hatte mich gesucht. — recorre la multitud con la mirada
shot(st(44) - .14, 'Z', null, L => { use('ST'); winter(); ST.SNOW.visible = true; show(CAGE, 0, 0, -116, PI / 2); put(dad, 0, 2.5, -115, 0); applyPose(dad, { ...SIT, crouch: 1.0, lLx: 1.6, lRx: 1.6, lLk: 2.4, lRk: 2.4, aRx: 1.6, aRe: 1.2, aLx: 1.6, aLe: 1.2, headY: Math.sin(L.lt * 2.4) * .5 }); face(dad, { mouth: 'flat', eyes: 'open', look: [Math.sin(L.lt * 2.4) * .9, 0] }, L.T);
  snowFall(ST, 0, 0, -116, L.T); onFace(dad, 6, .4, -1, 40, L.k, 5); }, [[0, 'zoom_in', .5], [.3, 'murmur', .5], [.8, 'breath', .4]]);
// 49 Und jetzt sah er mich. — subjetiva: el narrador entre la gente; miradas que se cruzan
shot(st(45) - .06, 'F', null, L => { use('ST'); winter(); ST.SNOW.visible = true; for (let i = 0; i < 6; i++) { put(fk[i], -6 + i * 2.4, 0, -96 + (i % 2) * 1.5, PI); applyPose(fk[i], RIGID); face(fk[i], { mouth: 'grin', noBlink: 1 }, 0); } put(hero, 0, 0, -99, PI); applyPose(hero, RIGID); face(hero, { mouth: 'o', eyes: 'wide', noBlink: 1 }, 0);
  snowFall(ST, 0, 0, -100, L.T); const k = easeOut(clamp(L.lt / .25)); const h = hp(hero); cam([h.x + .5, h.y + .5, h.z - lerp(10, 5, k)], [h.x, h.y, h.z], 40); }, [[0, 'zoom_fast', .7], [.1, 'heartbeat', .7], [.7, 'heartbeat', .7]]);
// 50 Er spuckte mir vor die Füße. — el escupitajo cae en la nieve; respingo
shot(st(46) - .14, 'S', null, L => { use('ST'); winter(); ST.SNOW.visible = true; put(hero, 0, 0, -99, PI); const t = L.lt - .5; applyPose(hero, t > 0 && t < .3 ? { ...RIGID, hipY: 2.2, lean: -.15 } : RIGID); face(hero, { mouth: 'o', eyes: 'wide' }, L.T);
  spit.visible = t > -.3; const sk = clamp((t + .3) / .3); spit.position.set(0, lerp(4, .15, sk), -99 - 2.2 + sk * .2); spit.scale.set(1 + (sk >= 1 ? 1.5 : 0), sk >= 1 ? .2 : 1, 1 + (sk >= 1 ? 1.5 : 0));
  cm([2, 2.5, -103.5, 0, .4, -100.6, 40], [1.5, 2.2, -103, 0, .4, -100.6, 36], L.k); }, [[.2, 'spit', .9], [.5, 'splash', .4], [.55, 'gasp', .6]]);
// 51 „Monster." Als würde er mich nicht kennen. — gira la cara con desprecio fingido; una lágrima
shot(st(47) - .2, 'W', null, L => { use('ST'); winter(); ST.SNOW.visible = true; show(CAGE, 0, 0, -116, PI / 2); put(dad, 0, 2.5, -115, 0); applyPose(dad, { ...SIT, crouch: 1.0, lLx: 1.6, lRx: 1.6, lLk: 2.4, lRk: 2.4, aRx: 1.6, aRe: 1.2, aLx: 1.6, aLe: 1.2, headY: L.lt > .8 ? -.8 : 0 }); talkFace(dad, L.T, L.t0, L.t0 + .9, { mouth: 'frown', brows: .6, eyes: 'squint', tears: L.lt > .9 ? 1 : 0 });
  snowFall(ST, 0, 0, -116, L.T); const a = .3 + L.k * .5; const h = hp(dad); cam([h.x + Math.sin(a) * 6, h.y + .3, h.z + Math.cos(a) * 6], [h.x, h.y, h.z], 40); bubble(dad, 'MONSTER!', L.lt - .1); }, [[0, 'shout_m', .4], [.9, 'sniff', .4], [1.4, 'wind', .5]]);
// 52 Am nächsten Morgen zog gegenüber ein Mann ein. — baja cajas de un carro
shot(st(49) - .06, 'Z', null, L => { use('ST'); day(); put(dadC, 15, 0, HOMEZ + 4, -PI / 2 + .3); kp(dadC, L.lt, [[0, { aRx: 1.4, aRe: .8, aLx: 1.4, aLe: .8, lean: .3, crouch: .5 }], [1.2, { aRx: 1.2, aRe: 1.2, aLx: 1.2, aLe: 1.2, lean: .05 }]]); face(dadC, { mouth: 'grin', noBlink: 1 }, 0);
  show(boxes[0], 0, 0, 0); attach(boxes[0], dadC.aR.hand, [.8, -.6, .8]); show(boxes[1], 12.5, .7, HOMEZ + 8); show(boxes[2], 12.5, 2.1, HOMEZ + 8.3, .3); cm([-2, 7, HOMEZ + 18, 15, 5, HOMEZ, 48], [0, 7, HOMEZ + 16, 15, 5, HOMEZ, 46], L.k); sh(V(15, 0, HOMEZ), 30); },
  [[0, 'zoom_in', .5], [.2, 'birds', .4], [.6, 'thud', .5], [1.4, 'steps', .5]]);
// 53 Mit Papas Gesicht. — se gira: sonrisa fija (zoom lento + golpe)
shot(st(50) - .08, 'C', 'slow', L => { use('ST'); day(); put(dadC, 15, 0, HOMEZ + 4, -PI / 2 + lerp(.3, 1.2, easeInOut(clamp(L.lt * 2)))); applyPose(dadC, RIGID); face(dadC, { mouth: 'grin', eyes: 'open', noBlink: 1 }, 0); onFace(dadC, 6, .3, 0, 38, L.k, 4.4); sh(V(15, 0, HOMEZ), 20); }, [[0, 'creepy_ting', .6]]);
// 54 Er winkte mir. — desde la ventana del narrador
shot(st(51) - .14, 'R', null, L => { use('ST'); day(); put(dadC, 15, 0, HOMEZ + 4, -PI / 2 + 1.2); applyPose(dadC, WAVE(L.T)); face(dadC, { mouth: 'grin', noBlink: 1 }, 0); cm([-10, 9, HOMEZ - 2, 15, 5, HOMEZ + 4, 34], [-9, 9, HOMEZ - 1, 15, 5, HOMEZ + 4, 30], L.k); sh(V(15, 0, HOMEZ), 20); }, [[0, 'cloth', .5], [.4, 'birds', .3]]);
// 55 Viel zu lange. — el mismo saludo, en bucle (golpe de zoom)
shot(st(52) - .12, 'I', null, L => { use('ST'); day(); put(dadC, 15, 0, HOMEZ + 4, -PI / 2 + 1.2); applyPose(dadC, WAVE(L.T, 14)); face(dadC, { mouth: 'grin', noBlink: 1 }, 0); onFace(dadC, 9, -.5, 0, 40); camera.fov *= L.lt < .2 ? lerp(1.3, 1, L.lt / .2) : 1; badge('tag', 'VIEL ZU LANGE', W / 2, H * .16, L.lt - .2); }, [[0, 'zoom_fast', .7], [.2, 'cloth', .5], [.5, 'cloth', .5]]);
// 56 Und ich winkte zurück. — tras la ventana, sonrisa rota
shot(st(53) - .07, 'W', null, L => { use('ST'); day(); const hx = -18.6, hz = HOMEZ - 3; put(hero, hx, 0, hz, PI / 2); applyPose(hero, WAVE(L.T, 5)); face(hero, { mouth: 'smile', brows: -.6, eyes: 'half' }, L.T); const h = hp(hero); cam([h.x + lerp(7, 5, L.k), h.y, h.z + .8], [h.x, h.y - .2, h.z], 40); sh(V(hx, 0, hz), 20); }, [[0, 'cloth', .5], [.6, 'breath', .4]]);
// 57 Ich habe nicht geweint. — aprieta los labios; los ojos brillan
shot(st(54) - .1, 'F', null, L => { use('DA'); inside(.6, .1); put(hero, DX, 0, -2, 0); applyPose(hero, { headX: .1 }); face(hero, { mouth: 'flat', brows: -.6, eyes: 'open', look: [0, .2] }, L.T); onFace(hero, 4, .2, 0, 36, L.k, 3.4); }, [[0, 'sniff', .5], [.5, 'clock_tick', .4]]);
// 58 Nachts fragte Mama, ob ich ihn gesehen hätte. — Mama pregunta por radio
shot(st(55) - .1, 'Z', null, L => { use('FU'); inside(.8, .2); chair(FX + .5, -4.8, .5); sit(mom, FX + .5, 2.6, -5, .5, { aRx: 1.2, aRe: 1.6 }); talkFace(mom, L.T, L.t0, L.t1, { mouth: 'flat', brows: -.3 }); onFace(mom, 7, .5, 1.5, 42, L.k, 5.5); }, [[0, 'radio', .5], [.5, 'fire_crackle', .4], [1.2, 'tv_static', .3]]);
// 59 „Nein." — cierra los ojos y dice que no
shot(st(56) - .1, 'S', null, L => { use('DA'); inside(.5, .1); sit(hero, DX - 1.2, 2.6, -6.4, PI, { ...RADIO, headX: .3 }); talkFace(hero, L.T, L.t0, L.t0 + .5, { mouth: 'frown', eyes: 'closed' }); DA.radio.userData.led.visible = true; chair(DX - 1.2, -6.2, PI); onFace(hero, 4.6, .3, 1.2, 38, L.k, 3.8); bubble(hero, 'NEIN.', L.lt - .05); }, [[0, 'radio', .4], [.2, 'click_set', .4]]);
// 60 Dann kam mein dreizehnter Geburtstag. — tarta con 13; manos sin cara la empujan hacia él
shot(st(57) + .6, 'R', null, L => { use('WO'); inside(1.1, .4); table.visible = true; show(cake, WX + lerp(-1.5, 0, easeOut(clamp(L.lt))), 3.6, 2, 0, pop(L.lt)); put(fk[0], WX - 4.5, 0, 2, PI / 2); fk[0].unmask(1, .3); applyPose(fk[0], { aRx: 1.5, aRe: .4 });
  put(hero, WX + 5, 0, 2.5, -PI / 2); applyPose(hero, RIGID); face(hero, { mouth: 'frown', eyes: 'wide', look: [-.8, .3] }, L.T); cm([WX, 9, 13, WX, 4, 2, 46], [WX + 1, 8, 10, WX, 4, 2, 42], L.k); badge('big', '13', W / 2, H * .16, L.lt - .3); }, [[0, 'zoom_in', .5], [.2, 'plate_slide', .6], [.7, 'ignite', .5], [1.3, 'heartbeat', .5]]);
// 61 Die ganze Stadt wartete in der Halle. — Festhalle llena, todos lo miran a la vez; dron que retrocede
shot(st(58), 'C', null, L => { use('HA'); inside(1, .2); const crowd = [...fk, ...hun]; crowd.forEach((p, i) => { sit(p, HX + (i % 2 ? 11 : -11) + (i % 2 ? 1 : -1) * 0, 2.3, -10 + Math.floor(i / 2) * 4, PI); face(p, { mouth: 'grin', noBlink: 1 }, 0); if (p.props.lantern) p.props.lantern.visible = false; });
  put(hero, HX, 2.4, -20, 0); applyPose(hero, RIGID); face(hero, { mouth: 'frown', eyes: 'wide' }, L.T); cm([HX + 2, 7, -25, HX, 4.5, -2, 50], [HX - 2, 9, -27, HX, 4, 2, 54], L.k); }, [[0, 'impact', .6], [.3, 'murmur', .5], [1.2, 'wood_creak', .4]]);
// 62 Ohne Gesichter. — todas las cabezas son negras (golpe de zoom)
shot(st(59) - .02, 'W', null, L => { use('HA'); inside(1, .2); const crowd = [...fk, ...hun]; crowd.forEach((p, i) => { sit(p, HX + (i % 2 ? 11 : -11), 2.3, -10 + Math.floor(i / 2) * 4, PI); p.unmask(1, .2); if (p.props.lantern) p.props.lantern.visible = false; });
  const k = easeOut(clamp(L.lt / .2)); cam([HX + 4, 6.5, -18], [HX + 11, 5, -4], lerp(60, 44, k)); }, [[0, 'zoom_fast', .8], [.1, 'braam_short', .6]]);
// 63 „Zieh es ab", sagten sie. Alle gleichzeitig. — fila de bocas que se mueven a la vez
shot(st(60) - .06, 'F', null, L => { use('HA'); inside(1, .2); fk.forEach((p, i) => { sit(p, HX - 11, 2.3, -10 + i * 3, PI / 2 + .9); p.unmask(1, .2 + .7 * Math.abs(Math.sin(L.T * 9))); });
  cm([HX - 5, 6.6, -12, HX - 11, 5.6, -6, 44], [HX - 5, 6.6, -2, HX - 11, 5.6, 4, 44], L.k); badge('red', 'ZIEH ES AB!', W / 2, H * .16, L.lt - .2, 1, .8); }, [[0, 'shout_crowd', .8], [.8, 'shout_crowd', .6], [1.4, 'growl', .4]]);
// 64 Ich zog. — se agarra la cara con las dos manos y tira
shot(st(62) - .1, 'Z', null, L => { use('HA'); inside(1, .2); put(hero, HX, 2.4, -20, 0); kp(hero, L.lt, [[0, { aRx: 2.0, aRe: 2.2, aLx: 2.0, aLe: 2.2, aRz: -.4, aLz: -.4 }], [.5, { aRx: 2.3, aRe: 1.8, aLx: 2.3, aLe: 1.8, aRz: -.3, aLz: -.3, headX: -.25, lean: -.15 }]]); face(hero, { mouth: 'teeth', eyes: 'squint', brows: .4 }, L.T); onFace(hero, 6, .4, 0, 42, L.k, 5); }, [[0, 'zoom_in', .5], [.3, 'strain', .7]]);
// 65 Nichts. Es war einfach nur mein Gesicht. — la cara no sale; se le estira la piel (zoom lento + golpe)
shot(st(63), 'I', 'slow', L => { use('HA'); inside(1, .2); put(hero, HX, 2.4, -20, 0); applyPose(hero, { aRx: 2.3, aRe: 1.8, aLx: 2.3, aLe: 1.8, aRz: -.3, aLz: -.3, headX: -.25 + Math.sin(L.T * 30) * .03 }); hero.head.scale.set(1 + Math.sin(L.T * 20) * .03, 1 + .04 * Math.abs(Math.sin(L.T * 9)), 1); face(hero, { mouth: L.k > .5 ? 'o' : 'teeth', eyes: 'wide', brows: -.6 }, L.T);
  onFace(hero, 5.5, .3, 0, 40, L.k, 3.8); badge('tag', 'NICHTS', W / 2, H * .16, L.lt - .2); }, [[0, 'stretch', .7], [.6, 'strain', .5], [1.2, 'gasp', .6]]);
// 66 Und zum ersten Mal seit zwei Jahren weinte ich. — solo bajo el foco, llora; pop-up 2 JAHRE
shot(st(65) - .3, 'Z', null, L => { use('HA'); inside(.6, .1); put(hero, HX, 2.4, -20, 0); applyPose(hero, CRY(L.T)); face(hero, { mouth: 'frown', eyes: 'closed', tears: 1, brows: -.8 }, L.T); const h = hp(hero); cam([h.x + 2, h.y + 1, h.z + lerp(11, 7, L.k)], [h.x, h.y - 1, h.z], 44); badge('big', '2 JAHRE', W / 2, H * .16, L.lt - .6); },
  [[0, 'cry_girl', .5], [.8, 'sniff', .6], [1.8, 'sad_tone', .5]]);
// 67 Jedes Maul im Saal ging auf. — todas las bocas se abren a la vez (alejamiento rápido)
shot(st(66) - .16, 'C', null, L => { use('HA'); inside(1, .2); const crowd = [...fk, ...hun]; crowd.forEach((p, i) => { put(p, HX + (i % 2 ? 9 : -9), 2.3 * 0, -10 + Math.floor(i / 2) * 4, i % 2 ? -PI / 2 - .6 : PI / 2 + .6); p.unmask(1, easeOut(clamp(L.lt * 1.5))); applyPose(p, { aRx: .6, aLx: .6, lean: .2 }); if (p.props.lantern) p.props.lantern.visible = false; });
  put(hero, HX, 2.4, -20, 0); applyPose(hero, CRY(L.T)); face(hero, { mouth: 'o', eyes: 'wide', tears: 1 }, L.T); const k = easeOut(clamp(L.lt / .35)); cam([HX, lerp(6, 9, k), lerp(-23, -27, k)], [HX, 4, 0], lerp(38, 58, k)); }, [[0, 'zoom_out', .7], [.1, 'growl', .9], [.5, 'growl', .6]]);
// 68 Doch plötzlich packte jemand meine Hand. — una mano con manga de rayas agarra la suya
shot(st(67) - .18, 'S', null, L => { use('HA'); inside(1, .2); put(hero, HX, 2.4, -20, 0); applyPose(hero, { aRx: .6, aRz: .2 }); face(hero, { mouth: 'o', tears: 1 }, L.T); const k = easeOut(clamp((L.lt - .3) * 3)); put(len, HX + lerp(5, 2.6, k), 2.4, -20.4, -PI / 2); applyPose(len, { aRx: 1.5 * k, aRe: .2 });
  const p = handP(hero); cm([p.x + 2, p.y + 2, p.z + 4.5, p.x + .6, p.y, p.z, 40], [p.x + 1.6, p.y + 1.6, p.z + 3.6, p.x + .6, p.y, p.z, 36], L.k); }, [[0, 'zoom_in', .5], [.4, 'slap', .7], [.5, 'cloth', .5]]);
// 69 Lenny. „Lauf!" — tira de él
shot(st(68) - .3, 'W', null, L => { use('HA'); inside(1, .2); put(len, HX + 1.5, 2.4, -20, -PI / 2 + .8); applyPose(len, { aRx: 1.2, aRe: .2, aRz: .3, lean: .3, ...walkPose(L.T, .8), aRx: 1.3 }); talkFace(len, L.T, L.t0, L.t1, { mouth: 'shout', brows: .5, eyes: 'wide' }); onFace(len, 5.5, .3, 1, 42, L.k, 4.5); bubble(len, 'LAUF!', L.lt - .5); }, [[0, 'gasp', .5], [.5, 'shout_m', .5], [.7, 'run_cobble', .6]]);
// 70 Hinter uns rief die ganze Stadt. — los dos corren hacia cámara; detrás la multitud sin cara
shot(st(70) - .1, 'R', null, L => { use('ST'); dusk(); const z = -60 + L.lt * 9; put(hero, -1.6, 0, z, 0); applyPose(hero, runPose(L.T)); face(hero, { mouth: 'o', eyes: 'wide', tears: 1 }, L.T); put(len, 1.6, 0, z - .5, 0); applyPose(len, { ...runPose(L.T + .2), aRx: .9 }); face(len, { mouth: 'shout', eyes: 'wide' }, L.T);
  for (let i = 0; i < 8; i++) { put(fk[i], -6 + (i % 4) * 4, 0, z - 10 - Math.floor(i / 4) * 4, 0); applyPose(fk[i], { ...runPose(L.T + i * .1), aRx: 1.4, aLx: 1.4 }); fk[i].unmask(1, .7); } CROWD.at(0, z - 30, 16, 20, L.T, 0, 9, 60);
  cm([0, 3.5, z + 9, 0, 3.6, z - 4, 50], [0, 3.5, z + 9.5, 0, 3.6, z - 4, 50], L.k); sh(V(0, 0, z), 40); }, [[0, 'run_cobble', .8], [.3, 'crowd_run', .7], [.8, 'shout_crowd', .6], [1.4, 'run_cobble', .6]]);
// 71 „Komm zurück, Kumpel!" — el falso Papa al frente, grita
shot(st(71) - .03, 'F', null, L => { use('ST'); dusk(); put(dadC, 0, 0, -70 + L.lt * 8, 0); applyPose(dadC, { ...runPose(L.T), aRx: 1.4 }); dadC.unmask(1, .4 + .5 * Math.abs(Math.sin(L.T * 8))); onFace(dadC, 7, .3, 0, 42, L.k, 5.5); bubble(dadC, 'KOMM ZURÜCK!', L.lt - .1); }, [[0, 'shout_m', .5], [.3, 'growl', .6], [.6, 'run_cobble', .5]]);
// 72 Mit Papas Stimme. — corre y mira atrás con dolor
shot(st(72) - .06, 'Z', null, L => { use('ST'); dusk(); const z = -40 + L.lt * 9; put(hero, 0, 0, z, 0); applyPose(hero, { ...runPose(L.T), headY: 1.0 }); face(hero, { mouth: 'frown', eyes: 'half', tears: 1, look: [1, 0], brows: -.7 }, L.T); onFace(hero, 6, .4, 3, 44, L.k, 5); }, [[0, 'zoom_in', .5], [.2, 'run_cobble', .6], [.6, 'sad_tone', .4]]);
// 73 Wir versteckten uns im alten Wasserturm. — suben por la escalera al anochecer
shot(st(73) - .06, 'I', null, L => { use('ST'); night(); const y = L.lt * 6; put(hero, 78, 6 + y, -113.2, PI); applyPose(hero, { aRx: 2.6 + Math.sin(L.T * 8) * .2, aLx: 2.6 - Math.sin(L.T * 8) * .2, lLx: .6 + Math.sin(L.T * 8) * .4, lRx: .6 - Math.sin(L.T * 8) * .4, lLk: 1, lRk: 1 }); face(hero, { mouth: 'o' }, L.T);
  put(len, 78, 1 + y, -113.2, PI); applyPose(len, { aRx: 2.6 - Math.sin(L.T * 8) * .2, aLx: 2.6 + Math.sin(L.T * 8) * .2, lLx: .6 - Math.sin(L.T * 8) * .4, lRx: .6 + Math.sin(L.T * 8) * .4, lLk: 1, lRk: 1 });
  trees(false); cm([86, 4, -96, 78, 10, -114, 50], [88, 9, -97, 78, 14, -114, 50], L.k); sh(V(76, 0, -116), 40); }, [[0, 'metal_creak', .6], [.4, 'click_metal', .5], [.9, 'click_metal', .5], [1.4, 'owl', .4]]);
// 74 „Du wusstest es", flüsterte ich. — sentados, jadeando
shot(st(74), 'S', null, L => { use('TU'); inside(.6, .1); sit(hero, TX + 1.6, 0, 0, -.5, { aRx: .6, aRe: .8 }); sit(len, TX - 1.6, 0, 0, .5); talkFace(hero, L.T, L.t0, L.t0 + 1.2, { mouth: 'frown', brows: -.4, look: [-1, 0] }); face(len, { mouth: 'smile', look: [1, 0] }, L.T);
  const a = .2 + L.k * .5; cam([TX + Math.sin(a) * 8, 5, Math.cos(a) * 8], [TX, 3.4, 0], 46); }, [[0, 'breath', .7], [.6, 'drip', .5], [1.2, 'whisper', .5]]);
// 75 „Ich sitze links von dir. Ich höre dein Herz." — se señala la oreja; pulso del corazón
shot(st(75), 'W', null, L => { use('TU'); inside(.6, .1); sit(len, TX - 1.6, 0, 0, .5, { aRx: 2.4, aRe: 2.4, aRz: -.6, headZ: -.15 }); talkFace(len, L.T, L.t0, L.t1, { mouth: 'smile', eyes: 'half' }); onFace(len, 5.5, .3, .8, 40, L.k, 4.2);
  if (L.lt > 1.2) BAD.push({ kind: 'heart', text: L.T, x: W * .72, y: H * .3, s: spring(clamp((L.lt - 1.2) * 2)) * .9, a: .9, on: true }); }, [[0, 'drip', .4], [1.3, 'heartbeat', .8], [1.9, 'heartbeat', .8]]);
// 76 „Und warum hast du mich nicht verraten?" — ceño de duda
shot(st(77) - .1, 'C', null, L => { use('TU'); inside(.6, .1); sit(hero, TX + 1.6, 0, 0, -.5); talkFace(hero, L.T, L.t0, L.t1, { mouth: 'flat', brows: -.5, look: [-1, 0] }); onFace(hero, 5, .3, -.8, 40, L.k, 4); }, [[0, 'impact_soft', .5], [.7, 'drip', .4]]);
// 77 „Weil du mein bester Freund bist." — sonrisa cálida, demasiado perfecta
shot(st(78) - .05, 'F', null, L => { use('TU'); inside(.6, .1); sit(len, TX - 1.6, 0, 0, .5); talkFace(len, L.T, L.t0, L.t1, { mouth: 'grin', eyes: 'happy' }); onFace(len, 5, .3, .8, 38, L.k, 4.2); }, [[0, 'cloth', .4], [.8, 'piano_note', .4]]);
// 78 Ich umarmte ihn. Endlich war ich nicht mehr allein. — abrazo fuerte; luz cálida
shot(st(79) - .1, 'Z', null, L => { use('TU'); inside(.7, .1); put(hero, TX + .7, 0, 0, -PI / 2); put(len, TX - .7, 0, 0, PI / 2); applyPose(hero, { aRx: 1.5, aRe: 1.5, aRz: -.5, aLx: 1.5, aLe: 1.5, aLz: -.5, headY: .3 }); applyPose(len, { aRx: 1.3, aRe: 1.4, aRz: -.4, aLx: 1.3, aLe: 1.4, aLz: -.4, headY: -.3 });
  face(hero, { mouth: 'smile', eyes: 'closed', tears: 1 }, L.T); face(len, { mouth: 'smile', eyes: 'open', look: [.4, 0] }, L.T); const a = -.4 + L.k * .9; cam([TX + Math.sin(a) * 9, 6, Math.cos(a) * 9], [TX, 4, 0], 44); }, [[0, 'hug', .7], [.6, 'cloth', .5], [1.6, 'piano_note', .4]]);
// 79 „Ich komme mit", sagte er. „Sag mir nur, wie man durchs Tor kommt." — mano en el hombro, serio
shot(st(81) - .1, 'R', null, L => { use('TU'); inside(.6, .1); put(hero, TX + 1.5, 0, 0, -PI / 2 + .4); put(len, TX - 1.5, 0, 0, PI / 2 - .4); applyPose(len, { aRx: 1.5, aRe: .3, aRz: -.1 }); talkFace(len, L.T, L.t0, L.t1, { mouth: 'flat', eyes: 'open', brows: .1 }); face(hero, { mouth: 'flat', look: [-1, 0] }, L.T);
  onFace(len, 6.5, .4, -2.4, 44, L.k, 5.5); }, [[0, 'cloth', .5], [1.4, 'drip', .4], [2.4, 'metal_creak', .3]]);
// 79b „Sag mir nur, wie man durchs Tor kommt." — desde el narrador: Lenny en primer plano, serio
shot(st(82) - .05, 'W', null, L => { use('TU'); inside(.6, .1); put(hero, TX + 1.5, 0, 0, -PI / 2 + .4); put(len, TX - 1.5, 0, 0, PI / 2 - .4); applyPose(len, { aRx: 1.5, aRe: .3, aRz: -.1, headX: .1 }); talkFace(len, L.T, L.t0, L.t1, { mouth: 'flat', eyes: 'half', brows: .2 }); applyPose(hero, {}); face(hero, { mouth: 'flat', look: [-1, 0] }, L.T);
  onFace(len, 6, .6, -2.4, 38, L.k, 5); badge('tag', 'DAS TOR?', W / 2, H * .16, L.lt - .6); }, [[0, 'drip', .4], [.8, 'cloth', .4]]);
// 80 Also erzählte ich ihm alles. — habla y gesticula
shot(st(83) - .1, 'S', null, L => { use('TU'); inside(.6, .1); put(hero, TX + 1.5, 0, 0, -PI / 2 + .4); applyPose(hero, { aRx: 1 + Math.sin(L.T * 6) * .3, aRe: 1.2, aLx: .8 + Math.cos(L.T * 6) * .3, aLe: 1.2 }); talkFace(hero, L.T, L.t0, L.t1 + 1, { mouth: 'smile' }); onFace(hero, 6, .4, 1.6, 44, L.k, 5); }, [[0, 'whisper', .6], [.7, 'cloth', .4]]);
// 81a Den Weg. — dibuja el mapa en el polvo
shot(st(84) - .18, 'W', null, L => { use('TU'); inside(.6, .1); sit(hero, TX + 1, 0, 2, 0, { aRx: 1.8, aRe: .3, lean: .6, headX: .5 }); lineDust.visible = true; lineDust.position.set(TX + 1.4, .03, 5.5); lineDust.scale.set(1, 1, clamp(L.lt * 1.4)); face(hero, { mouth: 'flat', look: [0, 1] }, L.T);
  cm([TX + 2.5, 7.5, 10, TX + 1.2, 1.5, 4, 44], [TX + 2.2, 7, 9.2, TX + 1.2, 1.5, 4, 40], L.k); }, [[0, 'zoom_fast', .5], [.2, 'brush', .7]]);
// 81b Wie Mama mich nennt. — inserto: Mama con los cascos
shot(st(85) - .1, 'F', null, L => { use('FU'); inside(.8, .2); chair(FX + .5, -4.8, .5); sit(mom, FX + .5, 2.6, -5, .5, { aRx: 1.2, aRe: 1.6 }); face(mom, { mouth: 'smile' }, L.T); onFace(mom, 5, .3, -1, 40, L.k, 4); bubble(mom, 'SCHATZ', L.lt - .1); }, [[0, 'radio', .5], [.3, 'tv_static', .3]]);
// 81c Und was ich ins Funkgerät sage. — toca la radio de la mochila
shot(st(86), 'Z', null, L => { use('TU'); inside(.6, .1); put(hero, TX + 1.5, 0, 0, .3); applyPose(hero, { aRx: 1.3, aRe: 1.5 }); attach(HRAD, hero.aR.hand, [0, -.5, .5], [0, PI, 0], .9); HRAD.userData.led.visible = true; face(hero, { mouth: 'smile', look: [0, .5] }, L.T);
  const p = handP(hero); cm([p.x + 4, p.y + 2.4, p.z + 3.4, p.x, p.y + .6, p.z, 44], [p.x + 3.4, p.y + 2.2, p.z + 3, p.x, p.y + .6, p.z, 40], L.k); }, [[0, 'zoom_in', .5], [.3, 'radio', .6], [.9, 'click_set', .5]]);
// 82 Er drückte meine Schulter. „Ich pass auf dich auf." — sonrisa
shot(st(87) - .1, 'I', null, L => { use('TU'); inside(.6, .1); put(hero, TX + 1.5, 0, 0, -PI / 2 + .4); put(len, TX - 1, 0, .2, PI / 2 - .2); applyPose(len, { aRx: 1.4, aRe: .4, aRz: -.25 }); face(hero, { mouth: 'smile', look: [-1, 0] }, L.T); talkFace(len, L.T, st(88), L.t1, { mouth: 'grin', eyes: 'half' });
  cm([TX, 5.5, 6.5, TX, 4.3, 0, 40], [TX, 5.4, 5.4, TX, 4.4, 0, 36], L.k); }, [[0, 'cloth', .6], [.3, 'hug', .4]]);
// 83 Dann zog er sein Gesicht ab und hängte es an einen Nagel. — cabeza negra; la cara al clavo (zoom lento + golpe)
shot(st(89) - .08, 'C', 'slow', L => { use('TU'); inside(.55, .1); const t = L.lt; put(len, TX + 2.4, 0, -10.6, t < 1.5 ? 0 : lerp(0, 1.2, clamp((t - 1.5) * 3))); kp(len, t, [[0, { aRx: 2.6, aRe: 1.6, aRz: -.3, aLx: 2.6, aLe: 1.6, aLz: -.3 }], [.8, { aRx: 2.8, aRe: .5, aLx: 1.0, aLe: .4 }], [1.8, { aRx: 2.3, aRe: .4, aRz: .3 }]]); len.unmask(t > .7 ? 1 : 0, .45);
  if (t > .7) attach(HANDF, t < 1.8 ? len.aR.hand : scene, t < 1.8 ? [0, -.9, .6] : [TX + 6.4, 6, -11.8], [0, -.6, 0], t < 1.8 ? 1 : 1.2); else face(len, { mouth: 'grin', eyes: 'happy' }, 0);
  put(hero, TX - 1.5, 0, -4, PI); applyPose(hero, RIGID); face(hero, { mouth: 'o', eyes: 'wide' }, L.T); cm([TX + 1, 5.6, -1, TX + 2.6, 4.4, -10.6, 46], [TX + 1.6, 5.4, -3.5, TX + 2.6, 4.6, -10.6, 40], L.k); }, [[.6, 'rip', .8], [1.75, 'click_metal', .8]]);
// 84 Die ganze Stadt hatte es von Anfang an gewusst. — la multitud sin cara rodea la torre
shot(st(90), 'F', null, L => { use('ST'); night(); for (let i = 0; i < 12; i++) { const a = i / 12 * PI * 2; put(fk[i], 70 + Math.cos(a) * 16, 0, -120 + Math.sin(a) * 16, -a - PI / 2); applyPose(fk[i], RIGID); fk[i].unmask(1, .2); } CROWD.at(70, -120, 70, 70, L.T, 0, 0, 120); trees(false);
  cm([70, 22, -84, 70, 8, -120, 52], [70, 36, -66, 70, 8, -120, 52], L.k); sh(V(70, 0, -120), 60); }, [[0, 'wind', .7], [.6, 'murmur', .4], [1.6, 'owl', .4]]);
// 85 Hundert Jahre lang fanden sie die Mauer nicht. — la Mauer de noche; pop-up 100 JAHRE
shot(st(91) - .06, 'Z', null, L => { use('MA'); night(); cm([MX - 14, 30, 110, MX, 30, -60, 50], [MX - 8, 34, 80, MX, 30, -60, 50], L.k); for (let i = 0; i < 2; i++) { put(fk[10 + i], MX - 30 + i * 60, MA.Hh + .6, -56, i ? -PI / 2 : PI / 2); applyPose(fk[10 + i], walkPose(L.T + i, .4)); } sh(V(MX, 0, -40), 90); badge('big', '100 JAHRE', W / 2, H * .16, L.lt - .3); }, [[0, 'zoom_in', .5], [.2, 'wind', .8], [1.2, 'bell_far', .4]]);
// 86 Sie brauchten nur jemanden, der ihnen den Weg verrät. — la multitud con faroles avanza por el camino de montaña
shot(st(92) - .06, 'S', null, L => { use('MA'); night(); CROWD.at(MX, 20 - L.lt * 4, 34, 40, L.T, PI, 0, 140); for (let i = 0; i < 2; i++) { walkTo(hun[i], MX - 4 + i * 8, 30, PI, L.T, L.lt, 2.4, false, .5); hun[i].unmask(1, .3); }
  cm([MX + 20, 12, 70, MX, 5, 20, 50], [MX + 16, 12, 62, MX, 5, 10, 50], L.k); sh(V(MX, 0, 30), 60); }, [[0, 'crowd_run', .6], [.5, 'steps_snow', .6], [1.4, 'wind', .6], [2.0, 'steps_snow', .5]]);
// 87 Dann wurde alles schwarz. — cae al suelo; iris que se cierra
shot(st(93) - .08, null, null, L => { use('TU'); inside(.5, .1); const k = easeIn(clamp(L.lt / .8)); put(hero, TX - 1.5, 0, -4, PI); applyPose(hero, { lean: lerp(0, -1.4, k), hipY: lerp(2.05, .9, k), aLz: .8 * k, aRz: .8 * k }); face(hero, { mouth: 'o', eyes: k > .6 ? 'closed' : 'wide' }, L.T);
  cam([TX + 1, 4.4, -10], [TX - 1.5, lerp(4, 1.5, k), -4], 46); grade.uniforms.lift.value = 0; }, [[.2, 'collapse', .8], [.8, 'thud', .6], [1.2, 'heartbeat', .5]]);
// 88 Mein Funkgerät knisterte. „Schatz, bist du da?" — casi negro: solo el LED de la radio en la mochila
shot(st(94) - .1, 'F', null, L => { use('SW'); inside(.05, 0); put(hero, NX, 0, 0, 0); applyPose(hero, { lean: -1.4, hipY: .9 }); hero.root.rotation.x = 0; const p = hero.props.pack.getWorldPosition(V(0, 0, 0)); cm([p.x + 2.5, p.y + 2, p.z + 3, p.x, p.y, p.z, 38], [p.x + 2, p.y + 1.6, p.z + 2.4, p.x, p.y, p.z, 34], L.k);
  bubble(hero, '📻 SCHATZ, BIST DU DA?', L.lt - 1.3, .5); }, [[0, 'tv_static', .8], [.4, 'radio', .6], [1.3, 'radio', .5]]);
// 89 Und über mir hörte ich meine eigene Stimme. — figura sin cara con la cara del narrador puesta (zoom lento)
shot(st(96) - .1, 'C', 'slow', L => { use('SW'); inside(.7, .3); put(len, NX, 0, -2, 0); len.unmask(1, .3); attach(HEROF, len.head, [0, .64, .2], [0, 0, 0], 1.02); applyPose(len, { aRx: 1.3, aRe: 1.6 }); attach(HRAD, len.aR.hand, [0, -.5, .5], [0, PI, 0], .9); HRAD.userData.led.visible = true;
  const l = hp(len); cam([l.x + 1, l.y - 4, l.z + lerp(9, 6, L.k)], [l.x, l.y, l.z], 46); }, [[0, 'tv_static', .5], [.6, 'creepy_ting', .6], [1.6, 'breath', .4]]);
// 90 „Hi Mama! Ich komme nach Hause! Mach das Tor auf!" — Mama sonríe y corre a la palanca; la puerta se abre
shot(st(97) - .1, 'F', null, L => { use('FU'); inside(.8, .2); chair(FX + .5, -4.8, .5); sit(mom, FX + .5, 2.6, -5, .5, { aRx: 1.2, aRe: 1.6, aLx: 2.4, aLe: .6 }); face(mom, { mouth: 'grin', eyes: 'happy', tears: 1 }, L.T); onFace(mom, 5.5, .3, -1, 40, L.k, 4.6); bubble(mom, 'MEIN SCHATZ!', L.lt - .4); }, [[0, 'radio', .6], [.4, 'gasp', .5], [.9, 'chair_roll', .5]]);
shot(st(98) - .1, 'C', null, L => { use('MA'); night(); const k = easeInOut(clamp(L.lt / 1.6)); MA.doors[0].rotation.y = lerp(0, -1.3, k); MA.doors[1].rotation.y = lerp(0, 1.3, k); CROWD.at(MX, -20, 40, 30, L.T, PI, 0, 120);
  cm([MX + 4, 4, 30, MX, 14, -60, 52], [MX + 2, 4, 10, MX, 14, -60, 48], L.k); sh(V(MX, 0, -40), 60); badge('red', 'DAS TOR GEHT AUF', W / 2, H * .16, L.lt - .4, 1, .8); }, [[0, 'metal_creak', .9], [.4, 'chain_rattle', .7], [1.3, 'growl', .7], [1.9, 'impact', .9]]);

// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const HOOK = st(3) - .1;
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  else if (i > 0 && !s.sfx.some(x => /^zoom/.test(x[1]))) CUES.push({ t: s.t0 + .04, s: ['zoom_in', 'zoom_out'][i % 2], g: .35 });
  if (s.tr === 'Z') CUES.push({ t: +(s.t1 - TRW.Z / FPS).toFixed(3), s: 'zoom_in', g: .6 }); if (s.tr === 'C') CUES.push({ t: +(s.t1 + .01).toFixed(3), s: 'impact', g: .55 }); });
CUES.push({ t: .02, s: 'riser', g: .9, d: +(HOOK + 3.2).toFixed(3) }); CUES.push({ t: st(4) - .02, s: 'braam', g: 1 });   // gancho: riser hasta "gefressen haben"
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD.length = 0; s.fn(L);
  if (s.zoom === 'slow' || T < st(4)) { const e = s.zoom === 'slow' ? easeIn(L.k) : easeIn(clamp(T / st(4))); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .78, e); camera.fov *= lerp(1, .9, e); }
  let sh_ = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'door_slam', 'zoom_fast'].includes(c.s) && T - c.t < .14) sh_ = 1 - (T - c.t) / .14; }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .22 * sh_; camera.position.y += (r() - .5) * .22 * sh_; }
  camera.position.x += Math.sin(T * 1.7) * .03; camera.position.y += Math.sin(T * 2.3) * .025;   // leve balanceo de mano
  camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  sky.sky.position.copy(camera.position); composer.render();
}
function renderAt(T) {
  const i = shotAt(T), s = S[i]; let tr = null, a = 0, ph = 0; const fO = (s.t1 - T) * FPS, fI = (T - s.t0) * FPS;
  if (s.tr && fO < TRW[s.tr]) { tr = s.tr; a = 1 - fO / TRW[s.tr]; ph = -1; } else if (i > 0 && S[i - 1].tr && fI < TRW[S[i - 1].tr]) { tr = S[i - 1].tr; a = 1 - fI / TRW[S[i - 1].tr]; ph = 1; }
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
  if (i === S.findIndex(x => x.t0 === st(93) - .08)) { const k = clamp((T - s.t0 - .7) / (s.t1 - s.t0 - .7)); if (k > 0) { octx.save(); octx.fillStyle = '#000'; octx.beginPath(); octx.rect(0, 0, W, H); octx.arc(W / 2, H * .45, Math.max(0, (1 - k) * H * .7), 0, 7, true); octx.fill('evenodd'); octx.restore(); } }
  for (const b of BAD) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;

// ---------- portadas para TikTok (1080×1920) ----------
const coverText = (lines, tag, tagCol = '#d6202f') => { const c = octx;
  const g = c.createLinearGradient(0, 0, 0, H * .32); g.addColorStop(0, 'rgba(0,0,0,.7)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H * .32);
  const g2 = c.createLinearGradient(0, H * .74, 0, H); g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,.65)'); c.fillStyle = g2; c.fillRect(0, H * .74, W, H * .26);
  const T = (s, x, y, size, fill, rot = 0) => { c.save(); c.translate(x, y); c.rotate(rot); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; const tw = c.measureText(s).width; if (tw > W * .92) { const k = W * .92 / tw; c.scale(k, k); } c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.shadowOffsetY = 10; c.lineWidth = size * .22; c.strokeStyle = '#000'; c.strokeText(s, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = fill; c.fillText(s, 0, 0); c.restore(); };
  lines.forEach(([s, size, col], i) => T(s, W / 2, H * (.075 + i * .075), size, col, -.02));
  c.save(); c.translate(W / 2, H * .875); c.rotate(.03); c.font = `700 72px ${FONT}`; const tk = Math.min(1, 860 / c.measureText(tag).width); c.scale(tk, tk); const tw = c.measureText(tag).width + 90; c.fillStyle = tagCol; c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 20; c.beginPath(); c.roundRect(-tw / 2, -58, tw, 116, 30); c.fill(); c.shadowBlur = 0; c.lineWidth = 10; c.strokeStyle = '#fff'; c.stroke(); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(tag, 0, 6); c.restore(); };
const arrow = (x, y, rot) => { const c = octx; c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = '#E2FD07'; c.strokeStyle = '#000'; c.lineWidth = 12; c.beginPath(); c.moveTo(-20, 0); c.lineTo(100, 0); c.lineTo(100, -40); c.lineTo(180, 30); c.lineTo(100, 100); c.lineTo(100, 60); c.lineTo(-20, 60); c.closePath(); c.stroke(); c.fill(); c.restore(); };
window.renderCover = (variant = 0) => {
  hideAll(); BAD.length = 0;
  if (variant === 0) {   // el narrador asustado delante; detrás, el pueblo con la misma sonrisa y dos ya sin cara
    use('ST'); dusk(); put(hero, 0, 0, -60, 0); applyPose(hero, { aRx: 1.2, aRe: 1.9, aLx: 1.2, aLe: 1.9, aRz: -.25, aLz: -.25, headX: .05, lean: -.05 }); hero.setFace({ mouth: 'o', eyes: 'wide', brows: -.7, sweat: 1 });
    const pos = [[-5.5, -66], [5.5, -66], [-2.6, -70], [2.6, -70], [-8, -72], [8, -72], [0, -75]]; pos.forEach(([x, z], i) => { const p = fk[i]; put(p, x, 0, z, -x * .03); applyPose(p, { ...RIGID, headX: .12 }); if (i === 2 || i === 3) p.unmask(1, .9); else p.setFace({ mouth: 'grin', eyes: 'open', look: [-x * .1, .3] }); });
    cam([0, 4.4, -50], [0, 3.0, -64], 54); grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55; sh(V(0, 0, -66), 30);
    camera.updateProjectionMatrix(); sky.sky.position.copy(camera.position); composer.render(); octx.drawImage(renderer.domElement, 0, 0, W, H);
    coverText([['ICH BIN DER', 112, '#ffffff'], ['EINZIGE MENSCH', 140, '#E2FD07']], 'SIE TRAGEN UNSERE GESICHTER');
  } else {   // la pared de las caras colgadas con el narrador mirándolas
    use('HA'); inside(1, .2); put(hero, HX - .6, 0, 15.5, PI + .12); applyPose(hero, { headX: -.25, aLz: .2, aRz: .2, headY: -.25 }); hero.setFace({ mouth: 'o', eyes: 'wide', brows: -.6 });
    put(fk[8], HX + 4.5, 0, 22.5, PI - .5); fk[8].unmask(1, .8); applyPose(fk[8], { aRx: 2.5, aRe: .6 }); attach(FOLKF, fk[8].aR.hand, [0, -.9, .6], [0, PI, 0], 1);
    cam([HX - 1.6, 4.6, 6.5], [HX - .2, 4.4, 27], 58); grade.uniforms.vig.value = .6; grade.uniforms.sat.value = 1.55;
    camera.updateProjectionMatrix(); composer.render(); octx.drawImage(renderer.domElement, 0, 0, W, H);
    coverText([['WEM GEHÖREN', 112, '#ffffff'], ['DIESE GESICHTER?', 128, '#E2FD07']], 'NIEMALS WEINEN!');
    arrow(W * .86, H * .28, 2.2);
  }
};

// Nichts — 70 planos sincronizados con audio/words.json (1080×1920, 30 fps, 87,2 s).
// Parodia de terror: cada escena se monta como de miedo (penumbra, riser, zoom lento) y se resuelve con lo más normal.
import { runPose, THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, V, lerp, clamp, easeOut, easeIn, easeInOut, spring, RNG, mat, box, sphere, cyl } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, tree } from './props.js';
import { makeFolk } from './gcast.js';
import { stadt, mower } from './gsets.js';
import { wohnung, kinderzimmer } from './wsets.js';
import { lantern } from './diam.js';
import { makeIch, makeMama, makeAlter, makeJunge, makeKellner, makeArbeiter, makeFahrer } from './ncast.js';
import { keller, restaurant, bad, nacht, supermarkt, car, truck, ampel, van, stromkasten, burger, fries, phoneOrNote, coins, thermo } from './nsets.js';
import { loadKitFaces, kitFace, kitLips, eyesAlive, actuar, caminar, shiver, luzCielo, viento, setViento, aire, bandada, camaraEnMano } from './vivo.js';

await document.fonts.load('700 40px Cap'); await loadKitFaces();
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 87.19, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xbfe3ff, .0008);
const camera = new THREE.PerspectiveCamera(50, W / H, .3, 4000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera); ao.enabled = false;
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach(c => c.visible = false); sky.moon.visible = false;
const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x8a8070, 1.4); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d8, 2.7); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 5; scene.add(sun, sun.target);
const rim = rimLight(scene);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 700 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-70, 140, 90)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- escenarios ----------
const VS = 200, WX = 1200, KZ = 1400, KX = 1600, RX = 1800, BX = 2000, NX = 2200;
const ST = stadt(scene), WG = wohnung(scene, WX), KZG = kinderzimmer(scene, KZ), KG = keller(scene, KX), RG = restaurant(scene, RX), BG = bad(scene, BX), NG = nacht(scene, NX);
const SM = supermarkt(ST.VS, -128);
const SETS = { ST: ST.G, WG: WG.g, KZ: KZG.g, KG: KG.g, RG: RG.g, BG: BG.g, NG: NG.g };
// farolas en las aceras de la Vorstadt y luz en todas las ventanas (para el apagón)
const VLAMP = []; for (let z = 18; z > -100; z -= 24) for (const s of [-1, 1]) { const l = lantern(ST.VS, s * 10.6, z + (s > 0 ? 12 : 0)); VLAMP.push(l.userData.bulb); }
const WIN = ST.vh.map(h => { const L = []; for (const wx of [-5, 5]) for (const wy of [3.8, 7.6]) { if (wx < 0 && wy < 5) continue; const p = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.2), new THREE.MeshBasicMaterial({ color: 0xffc870, toneMapped: false })); p.position.set(wx, wy, 6.74); p.visible = false; h.g.add(p); L.push(p); } return L; });
const winsOn = (fn) => WIN.forEach((L, i) => L.forEach(p => { p.visible = fn(i); }));
// hierba alta en el césped del narrador (planos rasantes)
const GRASS = (() => { const n = 2600, m = new THREE.InstancedMesh(new THREE.ConeGeometry(.07, .9, 3), mat(0x4fb83c, { roughness: 1 }), n), d = new THREE.Object3D(), r = RNG(44), c = new THREE.Color();
  for (let i = 0; i < n; i++) { d.position.set(VS - 22 + r() * 12, .45, 2 + r() * 18); d.rotation.set((r() - .5) * .5, r() * 6, (r() - .5) * .5); d.scale.set(1, .6 + r() * .9, 1); d.updateMatrix(); m.setMatrixAt(i, d.matrix); m.setColorAt(i, c.setHSL(.28 + r() * .06, .6, .32 + r() * .14)); }
  scene.add(m); m.visible = false; return m; })();
// puerta del piso con bisagra (para abrirla)
const DOORP = (() => { let d = null; WG.g.traverse(o => { if (o.isMesh && Math.abs(o.position.x - 17) < .01 && Math.abs(o.position.z - 13.6) < .01) d = o; }); const p = new THREE.Group(); p.position.set(19, 0, 13.6); WG.g.add(p); if (d) { WG.g.remove(d); d.position.set(-2, 4.2, 0); p.add(d); } return p; })();
const PORCH = box(9, .6, 4, mat(0x8a6a44, { roughness: .8 }), .05, NG.g, 0, .3, 2.6);
const SWITCH = box(.5, .8, .15, mat(0xf4f4f4), .05, KZG.g, 12.6, 5, 2.5); SWITCH.rotation.y = -Math.PI / 2;
const KCLOCK = (() => { const g = new THREE.Group(); KZG.g.add(g); g.position.set(-12.6, 9, -4); g.rotation.y = Math.PI / 2; const f = cyl(1, 1, .2, mat(0xffffff), 24, g, 0, 0, 0); f.rotation.x = Math.PI / 2; const h1 = box(.1, .7, .05, mat(0x1a1a1a), 0, g, 0, .3, .15), h2 = box(.08, .9, .05, mat(0xd8323a), 0, g, 0, 0, .16); return { g, h2 }; })();
// ---------- reparto ----------
const ich = makeIch(scene), mama = makeMama(scene), alter = makeAlter(scene), junge = makeJunge(scene), kellner = makeKellner(scene), arb = makeArbeiter(scene), fahrer = makeFahrer(scene);
const fk = Array.from({ length: 6 }, (_, i) => makeFolk(scene, i + 1));
kitFace(ich, 'hero'); kitFace(mama, 'plain'); kitFace(alter, 'plain'); kitFace(junge, 'kid'); kitFace(kellner, 'plain'); kitFace(arb, 'plain'); kitFace(fahrer, 'plain');
fk.forEach((c, i) => kitFace(c, ['girl', 'plain', 'kid', 'girl', 'plain', 'villain'][i]));
// niños del parque (primer plano)
const kids = Array.from({ length: 5 }, (_, i) => { const c = makeFolk(scene, 2 + i * 2); c.spec.scale = .58; c.root.scale.setScalar(.58); c.seed = 900 + i; kitFace(c, ['kid', 'girl', 'kid', 'girl', 'kid'][i]); return c; });
const POOL = [ich, mama, alter, junge, kellner, arb, fahrer, ...fk, ...kids];
// parque infantil y calle transversal al norte de la Vorstadt (solo para el primer plano)
const PZ = 66, PARK = (() => { const g = new THREE.Group(); ST.G.add(g); g.position.set(VS, 0, PZ); const wd = mat(0xd8323a, { roughness: .5 }), mt = mat(0x2a6ad8, { metalness: .4, roughness: .4 }), yl = mat(0xf2c23a, { roughness: .4 });
  const xr = new THREE.Mesh(new THREE.PlaneGeometry(160, 10), mat(0x4a5060, { roughness: .9 })); xr.rotation.x = -Math.PI / 2; xr.position.set(0, .07, -8); g.add(xr); for (let k = -8; k <= 8; k++) box(4, .04, .35, mat(0xffffff), 0, g, k * 10, .1, -8);
  box(160, .3, 3, mat(0xd8d4cc), .05, g, 0, .15, -14.5); box(160, .3, 3, mat(0xd8d4cc), .05, g, 0, .15, -1.5);
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(40, 22), mat(0xe8d4a0, { roughness: 1 })); sand.rotation.x = -Math.PI / 2; sand.position.set(0, .08, 12); g.add(sand);
  for (const [w, d, x, z] of [[40.6, .6, 0, 1], [40.6, .6, 0, 23], [.6, 22, -20, 12], [.6, 22, 20, 12]]) box(w, .6, d, mat(0x8a5a32), .05, g, x, .3, z);
  // columpio
  const SW = new THREE.Group(); SW.position.set(-10, 0, 12); g.add(SW); for (const sx of [-4, 4]) for (const sz of [-1.6, 1.6]) { const l = cyl(.18, .18, 8, mt, 8, SW, sx, 3.9, sz * .5); l.rotation.x = sz > 0 ? -.2 : .2; } const bar = cyl(.2, .2, 8.6, mt, 8, SW, 0, 7.6, 0); bar.rotation.z = Math.PI / 2;
  const swings = [-2, 2].map(x => { const p = new THREE.Group(); p.position.set(x, 7.6, 0); SW.add(p); for (const sx of [-.6, .6]) cyl(.04, .04, 5, mat(0x5a5a5a), 4, p, sx, -2.5, 0); box(1.6, .2, .8, yl, .05, p, 0, -5, 0); return p; });
  // tobogán
  const SL = new THREE.Group(); SL.position.set(8, 0, 14); g.add(SL); for (const sx of [-1, 1]) cyl(.15, .15, 6, mt, 8, SL, sx, 3, -2); box(2.6, .3, 2.6, wd, .05, SL, 0, 6, -2); for (let k = 0; k < 6; k++) box(2, .15, .3, mt, .02, SL, 0, .9 + k, -3.4);
  const ramp = box(2.2, .25, 9, yl, .1, SL, 0, 3.2, 2.6); ramp.rotation.x = .62; for (const sx of [-1.1, 1.1]) { const r = box(.15, .6, 9, yl, .05, SL, sx, 3.5, 2.6); r.rotation.x = .62; }
  // banco y árboles
  for (const x of [-26, 26]) tree(g, x, 10, 1); for (const x of [-16, 16]) tree(g, x, 30, 1.1);
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return { g, swings, SL }; })();

// ---------- atrezo ----------
const CARS = [0xd8323a, 0xf2c23a, 0x2ab8a8].map(c => car(scene, c)); const TRUCK = truck(scene), TRUCK2 = truck(scene, 'BAUSTOFFE'); const AMP = ampel(scene); const VAN = van(scene); const BOX = stromkasten(scene);
const BURG = burger(scene), FRIES = fries(scene), FRIES2 = fries(scene), NOTE = phoneOrNote(scene), COINS = coins(scene, 3), THERMO = thermo(scene), MOW = mower(scene);
const BOWL = (() => { const g = new THREE.Group(); scene.add(g); cyl(.9, .55, .6, mat(0x2a6ad8, { roughness: .3 }), 18, g, 0, .3, 0); cyl(.82, .82, .05, mat(0xf2d080, { roughness: 1 }), 18, g, 0, .58, 0); for (let k = 0; k < 9; k++) sphere(.12, mat(0xe8b040), g, Math.sin(k * 2.3) * .5, .64, Math.cos(k * 2.3) * .5, 6, 4); return g; })();
const SPOON = cyl(.06, .06, 1.2, mat(0xc8c8d0, { metalness: .9, roughness: .2 }), 6, scene);
const PARCEL = box(1.8, 1.4, 1.6, mat(0xb8905a, { roughness: 1 }), .06, scene);
const SHIRT = box(1.6, 1.8, .1, mat(0x7ab8e8, { roughness: 1 }), .05, scene);
const WRENCH = box(.2, 1.2, .15, mat(0xc8c8d0, { metalness: .9 }), .03, scene);
const PUFF = Array.from({ length: 8 }, () => sphere(.3, mat(0xffffff, { transparent: true, opacity: .5, roughness: 1 }), scene, 0, 0, 0, 8, 6));
const PROPS = [...CARS.map(c => c), TRUCK.g, TRUCK2.g, AMP.g, VAN.g, BOX.g, BURG, FRIES, FRIES2, NOTE, COINS, THERMO, MOW, BOWL, SPOON, PARCEL, SHIRT, WRENCH, KG.flash, BG.brush, ...PUFF];
const FL = new THREE.SpotLight(0xfff4e0, 0, 40, .4, .5, 1.2); scene.add(FL, FL.target);   // linterna
const HL = new THREE.SpotLight(0xfff8e8, 0, 50, .35, .4, 1.2); scene.add(HL, HL.target);   // linterna del casco
// ---------- ambiente ----------
const IBL = luzCielo(renderer, scene, sky.sky, .45); const AIR = aire(scene, 480); const BIRDS = bandada(scene, 9); viento(ST.G); viento(NG.g); viento(RG.g);
function setSky(top, mid, hor) { const u = sky.sky.material.uniforms; u.top.value.setRGB(...top); u.mid.value.setRGB(...mid); u.hor.value.setRGB(...hor); }
let MODE = 'day';
function day() { MODE = 'day'; setSky([.26, .58, .98], [.5, .78, 1], [.78, .9, 1]); hemi.intensity = 1.4; hemi.color.setRGB(.81, .9, 1); sun.intensity = 2.7; sun.color.setRGB(1, .94, .85); rim.intensity = 1.3; scene.fog.color.setRGB(.75, .88, 1); scene.fog.density = .0008; bloom.strength = .26; VLAMP.forEach(b => b.material.emissiveIntensity = .2); winsOn(() => false); }
function night(f = .002) { MODE = 'night'; setSky([.02, .04, .13], [.06, .1, .26], [.13, .18, .36]); hemi.intensity = .6; hemi.color.setRGB(.5, .6, 1); sun.intensity = .45; sun.color.setRGB(.6, .7, 1); rim.intensity = 1.8; scene.fog.color.setRGB(.05, .07, .18); scene.fog.density = f; bloom.strength = .55; VLAMP.forEach(b => b.material.emissiveIntensity = 2.2); winsOn(() => true); }
function dusk() { MODE = 'dusk'; setSky([.36, .3, .62], [1, .5, .3], [1, .66, .3]); hemi.intensity = 1.1; hemi.color.setRGB(1, .78, .62); sun.intensity = 2; sun.color.setRGB(1, .62, .36); rim.intensity = 1.6; scene.fog.color.setRGB(.9, .6, .4); scene.fog.density = .0012; bloom.strength = .36; VLAMP.forEach(b => b.material.emissiveIntensity = 1.4); winsOn(i => i % 3 !== 0); }
function inside(h = .9, s = .4) { MODE = 'in'; hemi.intensity = h; sun.intensity = s; bloom.strength = .42; scene.fog.density = .0002; }
function hideAll() { PARK.g.visible = false;
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFace({}); if (c.props.cane) c.props.cane.visible = true; }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); if (p.parent !== scene) { p.parent.remove(p); scene.add(p); } }
  for (const k in SETS) SETS[k].visible = false; GRASS.visible = false; FL.intensity = 0; HL.intensity = 0; KG.setBulb(1); KG.door.rotation.y = 0; DOORP.rotation.y = 0; KG.drum.rotation.z = 0; BURG.userData.plate.visible = true; NG.mbm.color.setHex(0x1d2a4a); NG.lampL.position.set(NX + 3.5, 12.5, 40);
  NG.lampL.intensity = 300; NG.lampR.intensity = 22; AMP.set(0); TRUCK.hl.forEach(h => h.material.emissiveIntensity = 2);
  grade.uniforms.vig.value = .42; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.45; grade.uniforms.sharp.value = .85; grade.uniforms.sepia.value = 0; day(); }
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
const show = (o, x, y, z, ry = 0, s = 1) => { o.visible = true; o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.setScalar(s); return o; };
const attach = (obj, parent, p = [0, 0, 0], r = [0, 0, 0], s = 1) => { parent.add(obj); obj.position.set(...p); obj.rotation.set(...r); obj.scale.setScalar(s); obj.visible = true; return obj; };
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
const hp = ch => { ch.root.updateMatrixWorld(true); return ch.head.getWorldPosition(V(0, 0, 0)); };
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + dy, h.z + fz * d - fx * side], [h.x, h.y - .3, h.z], fov); }
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
const handP = (ch, r = 1) => { ch.root.updateMatrixWorld(true); return (r ? ch.aR : ch.aL).hand.getWorldPosition(V(0, 0, 0)); };
// cara: expresión del kit + parpadeo y miradas vivas; habla con kitLips
function cara(ch, T, f = {}) { const s = { ...f }; if (!s.eyes && !s.noBlink) { const e = eyesAlive(T, ch.seed, 'normal'); if (e === 'closed' || !s.expr) s.eyes = e; } delete s.noBlink; ch.setFace(s); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, expr = 'talk') => cara(ch, T, { expr, mouth: kitLips(T, spoken(a, b)) || 'flat' });
const SIT = { crouch: .2, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aLz: .15, aRz: .15 };
const sit = (ch, x, y, z, ry, extra = {}) => { const s = ch.spec.scale || 1; put(ch, x, y - (2.05 - .2) * s + .08, z, ry); applyPose(ch, { ...SIT, ...extra }); };
const runPoseK = t => runPose(t, 1);
const pop = (lt, at = 0) => spring(clamp((lt - at) * 1.8));
// vecinos de fondo: caminan por la acera izquierda o hacen cosas
function vecinos(T, z0, n = 3) { for (let i = 0; i < n; i++) { const c = fk[i], dir = i % 2 ? 1 : -1; caminar(c, T + i * 3, { x: VS - 9 - (i % 2) * .4, z: z0 - 24 + i * 9 - dir * 5, ry: dir > 0 ? 0 : Math.PI, speed: 2.6 + i * .3, accel: .01, T }); cara(c, T, { expr: 'smile' }); } }
const puffs = (p, t, n = 5) => PUFF.forEach((s, i) => { if (i >= n) return; const k = ((t * .9 + i / n) % 1); s.visible = true; s.position.set(p.x + Math.sin(i * 2.1) * .2 + k * .6, p.y + k * .7, p.z + k * 1.2); s.scale.setScalar(.3 + k * 1.1); s.material.opacity = .45 * (1 - k); });

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
  else if (b.kind === 'zzz') { c.font = `700 70px ${FONT}`; for (let i = 0; i < 3; i++) { const t = (b.text + i * .33) % 1; c.globalAlpha = Math.sin(t * Math.PI); c.lineWidth = 10; c.strokeStyle = '#1d2238'; c.strokeText('Z', i * 40 + t * 30, -t * 120); c.fillStyle = '#ffffff'; c.fillText('Z', i * 40 + t * 30, -t * 120); } }
  c.restore(); }
const KEY = /^(Stadt|normal|Keller|Treppe|Licht|flackerte|Trockner|Wäsche|Schuhe|links|rechts|Motor|Lastwagen|vorbei|Supermarkt|Mann|Augen|Jacke|kalt|Restaurant|Junge|blinzelte|nichts|starrte|Pommes|Burger|Strom|dunkel|Schritte|Klopf|Tür|Stadtwerke|zwanzig|Fenster|Gestalt|Haus|Briefkasten|Zähne|schlafen|nie|grün)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const PI = Math.PI, NARR = VS + 9;
const drone = (L, k0) => { use('ST'); vecinos(L.T, -10, 3); const k = easeOut(clamp(L.lt / .35)); cam([VS + 34 - L.lt * 2, lerp(78, 44, k) - L.lt * 2, lerp(120, 76, k) - L.lt * 3], [VS, 4, -14], lerp(72, 52, k) - L.lt); sh(V(VS, 0, -10), 80); };
// 1 «In dieser Stadt» — golpe de zoom en el fotograma 0 sobre la Vorstadt
// 1 «In dieser Stadt» — golpe de zoom: el narrador en primer plano, detrás la vida normal (coches, corredores, gente paseando, niños en el parque)
shot(0, 'C', null, L => { use('ST'); PARK.g.visible = true; const T = L.T, z0 = PZ;
  put(ich, VS + .5, 0, z0 - 18, PI + .15); actuar(ich, L.lt, [[0, 'shrug'], [.25, { aLx: .4, aLz: .9, aRx: .4, aRz: .9, aLe: .4, aRe: .4, headX: -.1 }, { anti: .2 }]], { T }); cara(ich, T, { expr: 'happy' });
  // coches por la calle transversal
  show(CARS[0], VS - 9 + T * 18, 0, z0 - 10.5, PI / 2); show(CARS[1], VS + 13 - T * 16, 0, z0 - 5.5, -PI / 2); show(CARS[2], VS - 30 + T * 18, 0, z0 - 10.5, PI / 2);
  // corredores y paseantes en las aceras
  caminar(fk[0], T, { x: VS - 9, z: z0 - 14.5, ry: PI / 2, run: true, speed: 7, accel: .01, T }); cara(fk[0], T, { expr: 'determined' });
  caminar(fk[1], T, { x: VS + 9, z: z0 - 1.5, ry: -PI / 2, run: true, speed: 6.5, accel: .01, T }); cara(fk[1], T, { expr: 'happy' });
  caminar(fk[2], T, { x: VS + 12, z: z0 - 1.2, ry: -PI / 2, speed: 2.6, accel: .01, T }); cara(fk[2], T, { expr: 'smile' });
  caminar(fk[3], T, { x: VS - 6, z: z0 - 1, ry: PI / 2, speed: 2.4, accel: .01, T }); cara(fk[3], T, { expr: 'smile' });
  put(fk[4], VS + 4, 0, z0 + 3.5, PI + .3); actuar(fk[4], L.lt, [[0, (t) => ({ aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, crouch: Math.max(0, Math.sin(t * 9)) * .4, lLx: .3, lRx: .3, lLk: Math.max(0, Math.sin(t * 9)) * .8, lRk: Math.max(0, Math.sin(t * 9)) * .8 })]], { T }); cara(fk[4], T, { expr: 'joy' });   // gimnasia
  // niños: columpio, tobogán, pilla-pilla
  const a = Math.sin(T * 3.2) * .7; PARK.swings[0].rotation.x = a; PARK.swings[1].rotation.x = -a * .8; const sp = PARK.swings[0]; sp.updateMatrixWorld(true); const seat = V(0, -5, 0).applyMatrix4(sp.matrixWorld);
  put(kids[0], seat.x, seat.y - 1.0, seat.z, 0); kids[0].root.rotation.x = a; applyPose(kids[0], { crouch: .2, lLx: 1.4, lRx: 1.4, lLk: .3 + a * .6, lRk: .3 + a * .6, aLx: 2.6, aRx: 2.6, aLe: .3, aRe: .3 }); cara(kids[0], T, { expr: 'joy' });
  const sk = (T * .5) % 1; put(kids[1], VS + 8, 5.0 - sk * 4.6, z0 + 12.9 + sk * 7.4, 0); applyPose(kids[1], { crouch: .2, lLx: 1.5, lRx: 1.5, aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5 }); cara(kids[1], T, { expr: 'joy' });
  for (let i = 2; i < 5; i++) { const ang = T * 1.6 + i * 2.1, x = VS + Math.cos(ang) * 3.5 - 1, z = z0 + 9 + Math.sin(ang) * 3; put(kids[i], x, 0, z, ang + PI); applyPose(kids[i], runPoseK(T + i)); cara(kids[i], T, { expr: i === 2 ? 'grin' : 'joy' }); }
  // cámara: golpe de zoom (en renderShot) + travelling que gira alrededor del narrador
  const q = easeOut(clamp(L.lt / .74)); cam([VS + lerp(5.5, 2.5, q), lerp(8.4, 6.2, q), z0 - 18 - lerp(19, 13, q)], [VS + .5, lerp(1.4, 1.8, q), z0 - 9], 50); sh(V(VS, 0, z0 - 6), 45); }, [[0, 'birds', .5], [.05, 'kids_laugh', .5], [.2, 'car_pass', .5], [.4, 'steps', .4]]);

// 2 «ist alles normal.» — el narrador saluda en la acera; el vecino corta el césped
shot(.74, 'W', null, L => { use('ST'); put(ich, VS - 9, 0, 14, .5); actuar(ich, L.lt, [[0, 'idle'], [.2, 'wave', { anti: .2 }]], { T: L.T }); cara(ich, L.T, { expr: 'happy' });
  caminar(fk[1], L.lt, { x: VS - 16, z: 4, ry: 0, speed: 2, T: L.T, extra: { aLx: 1.2, aRx: 1.2, aLe: .5, aRe: .5, lean: .2 } }); const p = fk[1].root.position; show(MOW, p.x, 0, p.z + 3.4, PI); cara(fk[1], L.T, { expr: 'smile' });
  vecinos(L.T, 20, 1); cm([VS - 3, 6, 25, VS - 9.5, 4, 12, 46], [VS - 3.5, 5.6, 23, VS - 9.5, 4.2, 12, 44], L.k); sh(V(VS - 9, 0, 10), 30); }, [[0, 'machine_hum', .5], [.4, 'kids_laugh', .25]]);
// 3 Autos fahren auf der Straße.
shot(1.99, 'S', null, L => { use('ST'); const z = -20; show(CARS[0], VS + 3.5, 0, z + 30 - L.lt * 16, PI); show(CARS[1], VS - 3.5, 0, z - 22 + L.lt * 14, 0); show(CARS[2], VS + 3.5, 0, z + 58 - L.lt * 16, PI);
  put(fk[2], VS + 10, 0, z - 2, -PI / 2); actuar(fk[2], L.lt, [[0, 'idle']], { T: L.T }); cara(fk[2], L.T, { expr: 'smile' });
  cm([VS + 11, 2.2, z + 9, VS, 2, z - 6, 52], [VS + 10.5, 2.4, z + 7, VS, 2, z - 6, 50], L.k); sh(V(VS, 0, z), 40); }, [[.05, 'car_pass', .8], [.8, 'car_pass', .6]]);
// 4 Lastwagen halten an roten Ampeln.
shot(3.62, 'Z', null, L => { use('ST'); show(AMP.g, VS + 8, 0, -60, 0); AMP.set(0); const k = easeOut(clamp(L.lt / 1.3)); show(TRUCK2.g, VS + 3.5, 0, lerp(-22, -44.6, k), PI);
  put(fk[3], VS + 10.6, 0, -57, -PI / 2 + .3); actuar(fk[3], L.lt, [[0, 'idle']], { T: L.T }); cara(fk[3], L.T, { expr: 'neutral' });
  cm([VS + 9.5, 5, -44, VS + 4.8, 7.5, -62, 50], [VS + 9.2, 5.2, -45.5, VS + 6, 7.5, -62, 48], L.k); sh(V(VS, 0, -55), 40); }, [[0, 'car', .6], [1.0, 'steam', .6]]);
// 5 Das Gras ist grün. — plano rasante sobre la hierba, el cortacésped se acerca
shot(5.54, 'R', null, L => { use('ST'); GRASS.visible = true; caminar(fk[1], L.lt, { x: VS - 15, z: -6, ry: 0, speed: 2, T: L.T, extra: { aLx: 1.2, aRx: 1.2, aLe: .5, aRe: .5, lean: .2 } }); const p = fk[1].root.position; show(MOW, p.x, 0, p.z + 3.4, PI); cara(fk[1], L.T, { expr: 'smile' });
  cm([VS - 12, .8, 16, VS - 14.5, 1.6, 0, 46], [VS - 12.2, .9, 15, VS - 14.5, 1.8, 0, 44], L.k); sh(V(VS - 15, 0, 8), 25); }, [[0, 'machine_hum', .7], [.4, 'leaves', .4]]);
// 6 Das war schon immer so. — la misma calle en sepia (foto antigua)
shot(7.04, 'F', null, L => { use('ST'); grade.uniforms.sepia.value = .95; grade.uniforms.vig.value = .7; caminar(fk[4], L.lt, { x: VS - 15, z: 2, ry: 0, speed: 1.8, T: L.T, extra: { aLx: 1.2, aRx: 1.2, aLe: .5, aRe: .5, lean: .2 } }); show(MOW, fk[4].root.position.x, 0, fk[4].root.position.z + 3.4, PI); cara(fk[4], L.T, { expr: 'smile' });
  put(alter, VS - 9.5, 0, 10, .4); actuar(alter, L.lt, [[0, 'wave']], { T: L.T }); cara(alter, L.T, { expr: 'smile' });
  cm([VS - 2, 7, 30, VS - 12, 4, 6, 46], [VS - 2.6, 6.6, 28, VS - 12, 4, 6, 44], L.k); badge('tag', '1958', W / 2, H * .16, L.lt - .2); sh(V(VS - 10, 0, 10), 30); }, [[0, 'film_roll', .6]]);
// 7 Eines Morgens hörte ich … — desayuno; se queda quieto con la cuchara en el aire
shot(8.13, 'W', null, L => { use('WG'); inside(1.0, .5); sit(ich, WX - 8, 2.3, 2.4, PI); const heard = L.lt > .75;
  actuar(ich, L.lt, [[0, { aRx: 1.2, aRe: 1.6 + Math.max(0, Math.sin(L.T * 6)) * .5 * (heard ? 0 : 1), aLx: .9, aLe: 1.2 }], [.8, { aRx: 1.3, aRe: 1.5, aLx: .9, aLe: 1.2, headX: .25, headY: .3 }]], { T: L.T, extra: { crouch: .2, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5 } });
  cara(ich, L.T, { expr: heard ? 'worried' : 'happy', eyes: heard ? 'down' : undefined }); show(BOWL, WX - 8, 3.62, .9); attach(SPOON, ich.aR.hand, [0, -.4, .3], [1.2, 0, 0]);
  cm([WX - 6.5, 5.6, -7.5, WX - 8, 4.2, 2.4, 44], [WX - 6.8, 5.4, -6.6, WX - 8, 4.3, 2.4, 42], L.k); }, [[0, 'spoon', .5], [.3, 'birds', .3], [.8, 'thud', .7]]);
// 8 … ein Geräusch im Keller. — sótano a oscuras, algo golpea (zoom lento)
shot(9.39, 'C', 'slow', L => { use('KG'); inside(.15, 0); KG.setBulb(0); KG.sun.intensity = 30; scene.fog.density = .004; scene.fog.color.setRGB(.02, .02, .04); KG.drum.rotation.z = L.T * 9;
  cm([KX - 4, 4, 8, KX + 8, 3, -10, 52], [KX - 2, 3.8, 5, KX + 8, 3, -10, 48], L.k, easeIn); }, [[0, 'thud', .8], [.35, 'thud', .7], [.7, 'thud', .8]]);
// 9 Also ging ich langsam … — abre la puerta de arriba y mira hacia abajo
shot(10.28, 'Z', null, L => { use('KG'); inside(.45, 0); KG.setBulb(0); KG.sun.intensity = 30; scene.fog.density = .003; scene.fog.color.setRGB(.02, .02, .04); KG.door.rotation.y = -1.6 * easeOut(clamp(L.lt / .5));
  put(ich, KX - 12, 8, -12.3, 0); actuar(ich, L.lt, [[0, { aRx: 1.3, aRe: .4, lean: .2 }], [.5, 'lean_in']], { T: L.T }); cara(ich, L.T, { expr: 'worried', eyes: 'down' });
  FL.intensity = 260; FL.position.set(KX - 12, 13, -13.5); FL.target.position.set(KX - 12, 6, -9);
  cm([KX - 9, 3.5, -2, KX - 12, 11, -12, 50], [KX - 9.4, 3.8, -3, KX - 12, 11, -12, 46], L.k); }, [[0, 'door_open', .7], [.6, 'wood_creak', .5]]);
// 10 … die Treppe runter. — pies bajando los peldaños (crujen)
shot(11.62, 'S', null, L => { use('KG'); inside(.2, 0); KG.setBulb(0); KG.sun.intensity = 30; scene.fog.density = .003; scene.fog.color.setRGB(.02, .02, .04);
  const i = 1 + L.lt * 2.6; put(ich, KX - 12, 8 - i + .05, -11.7 + i * 1.3, 0); actuar(ich, L.lt, [[0, (T) => ({ lLx: Math.sin(T * 8) * .5 + .3, lRx: -Math.sin(T * 8) * .4 + .2, lLk: Math.max(0, Math.cos(T * 8)) * .8 + .2, lRk: Math.max(0, -Math.cos(T * 8)) * .8 + .2, aLz: .5, aRz: .5, aLe: .5, aRe: .5, lean: .1 })]], { T: L.T });
  cara(ich, L.T, { expr: 'scared' }); FL.intensity = 200; FL.position.set(KX - 12, 13, -13.5); FL.target.position.copy(ich.root.position);
  const p = ich.root.position; cm([KX - 7.5, p.y + 1.5, p.z + 4, KX - 12, p.y + 1.2, p.z, 46], [KX - 7.6, p.y + 1.3, p.z + 3.5, KX - 12, p.y + 1, p.z, 44], L.k); }, [[0, 'wood_creak', .7], [.4, 'wood_creak', .6]]);
// 11 Das Licht flackerte. — la bombilla parpadea; cara de miedo (zoom lento)
shot(12.45, 'F', 'slow', L => { use('KG'); inside(.25, 0); const f = Math.floor(L.T * 30); const on = [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1][f % 12]; KG.setBulb(on ? .7 : .03); KG.sun.intensity = 20; scene.fog.density = .002; scene.fog.color.setRGB(.02, .02, .04);
  put(ich, KX - 9, 0, 0, -.6); actuar(ich, L.lt, [[0, 'brace']], { T: L.T, extra: shiver(L.T, 1.2) }); cara(ich, L.T, { expr: 'terror' });
  onFace(ich, 7, 1.4, 1.5, 40, L.k, 4.8); }, [[0, 'hum', .5], [.15, 'click_metal', .5], [.5, 'click_metal', .5], [.8, 'heartbeat', .5]]);
// 12 Es war der Trockner. — luz encendida: la secadora dando vueltas
shot(13.5, 'C', null, L => { use('KG'); inside(.9, .3); KG.setBulb(1.2); KG.drum.rotation.z = L.T * 9;
  put(ich, KX + 6.6, 0, -2, PI - .3); actuar(ich, L.lt, [[0, 'shrug']], { T: L.T }); cara(ich, L.T, { expr: 'bored' });
  cm([KX + 9, 5, 3, KX + 10.6, 2.6, -8.6, 46], [KX + 9.6, 4.4, .5, KX + 10.6, 2.6, -8.6, 42], L.k); }, [[0, 'machine_shake', .8], [.3, 'ding_soft', .5]]);
// 13 Meine Mutter machte Wäsche. — mamá saca ropa y saluda
shot(14.4, 'W', null, L => { use('KG'); inside(.9, .3); KG.setBulb(1.2); KG.drum.rotation.z = L.T * 9; show(KG.basket, KX + 8, 0, -5.4);
  put(mama, KX + 5.5, 0, -6.5, .3); actuar(mama, L.lt, [[0, { aRx: 1.3, aRe: .6, aLx: 1.2, aLe: .7, lean: .25 }], [.5, 'wave', { anti: .2 }]], { T: L.T }); cara(mama, L.T, { expr: 'happy' }); attach(SHIRT, mama.aL.hand, [0, -.9, .3]);
  cm([KX + 2, 6, 6, KX + 6, 4.4, -6.5, 46], [KX + 2.6, 5.6, 4.6, KX + 6, 4.6, -6.5, 44], L.k); }, [[0, 'cloth', .6], [.5, 'machine_hum', .4]]);
// 14 Danach beschloss ich, rauszugehen. — junto a la puerta del piso
shot(15.59, 'I', null, L => { use('WG'); inside(1.0, .5); put(ich, WX + 15.5, 0, 9.4, .25); actuar(ich, L.lt, [[0, 'think'], [.8, 'point', { anti: .2 }]], { T: L.T }); cara(ich, L.T, { expr: L.lt < .8 ? 'sus' : 'determined' });
  cm([WX + 9, 6, 2, WX + 16, 4.2, 10.5, 46], [WX + 9.8, 5.6, 2.6, WX + 16, 4.2, 10.5, 44], L.k); }, [[0, 'steps', .5], [.8, 'keys', .5]]);
// 15 Ich zog meine Schuhe an. — sentado en el sofá, se inclina a ponérselos
shot(17.18, 'S', null, L => { use('WG'); inside(1.0, .5); sit(ich, WX + 11, 2.2, -6.9, 0); actuar(ich, L.lt, [[0, { ...SIT, lean: .55, aLx: .7, aRx: .7, aLe: .4, aRe: .4, headX: .2 }]], { T: L.T, extra: { lLk: 1.3 + Math.sin(L.T * 8) * .1 } }); cara(ich, L.T, { expr: 'neutral', eyes: 'down' });
  cm([WX + 13, 3.2, -1.5, WX + 11, 2.6, -5.5, 46], [WX + 12.6, 3.0, -2, WX + 11, 2.4, -5.5, 44], L.k); }, [[0, 'cloth', .5], [.5, 'zip', .5]]);
// 16 Erst links, — 17 dann rechts. — insertos de cada zapato con su cartel
const shoe = (side, txt) => L => { use('WG'); inside(1.0, .5); sit(ich, WX + 11, 2.2, -6.9, 0); const lg = side < 0 ? 'lLx' : 'lRx'; actuar(ich, L.lt, [[0, { ...SIT, lean: .5, [lg]: 1.1 + .3 * easeOut(clamp(L.lt * 3)), aLx: .7, aRx: .7, aLe: .3, aRe: .3, headX: .25 }]], { T: L.T }); cara(ich, L.T, { expr: 'determined', eyes: 'down' });
  const f = (side < 0 ? ich.lL : ich.lR).shoe.getWorldPosition(V()); cam([f.x + side * 1.2 + .4, f.y + 1.2, f.z + 3.2], [f.x, f.y, f.z], 40); camera.fov -= L.k * 4; badge('big', txt, W / 2, H * .3, L.lt * 1.5); };
shot(18.33, 'C', null, shoe(-1, 'LINKS'), [[0, 'tug', .7], [.3, 'cloth', .4]]);
shot(19.1, 'C', null, shoe(1, 'RECHTS'), [[0, 'tug', .7], [.3, 'cloth', .4]]);
// 18 Ich lief die Straße entlang. — travelling por la acera
shot(19.83, 'W', null, L => { use('ST'); const p = caminar(ich, L.lt, { x: NARR, z: 34, ry: PI, speed: 3.2, accel: .01, T: L.T }); cara(ich, L.T, { expr: 'smile' }); vecinos(L.T, 20, 2);
  cam([p.x - 6, 4.5, p.z - 9], [p.x, 3.8, p.z], 48); sh(V(VS, 0, p.z), 40); }, [[0, 'steps', .6], [.5, 'birds', .4]]);
// 19 Und plötzlich hörte ich … — se para en seco
shot(21.18, 'R', null, L => { use('ST'); caminar(ich, L.lt, { x: NARR, z: 4, ry: PI, speed: 3.2, accel: .01, stopAt: .25, T: L.T }); actuar(ich, L.lt, [[0, {}], [.5, 'shock', { anti: .3 }]], { T: L.T, extra: L.lt < .5 ? {} : {} });
  cara(ich, L.T, { expr: L.lt < .5 ? 'smile' : 'shock' }); onFace(ich, 6, .6, -1, 42, L.k, 4.6); sh(V(NARR, 0, 0), 30); }, [[.5, 'gasp', .4]]);
// 20 … hinter mir einen lauten Motor. — el morro del camión, faros encendidos (zoom lento)
shot(22.27, 'Z', 'slow', L => { use('ST'); show(TRUCK.g, VS + 3.5, 0, 74 - L.lt * 5, PI); grade.uniforms.vig.value = .6;
  cm([VS + 6, 1.4, 46, VS + 3.5, 3.4, 64, 46], [VS + 5.6, 1.5, 48, VS + 3.5, 3.4, 64, 40], L.k, easeIn); sh(V(VS, 0, 60), 30); }, [[0, 'car', .8], [.5, 'hum_low', .6]]);
// 21 Ich drehte mich um. — se gira: cara de pánico
shot(23.9, 'C', null, L => { use('ST'); const k = spring(clamp(L.lt / .45)); put(ich, NARR, 0, 0, PI - PI * k); actuar(ich, L.lt, [[0, 'shock'], [.35, 'recoil', { anti: .3 }]], { T: L.T }); cara(ich, L.T, { expr: L.lt < .3 ? 'shock' : 'terror' });
  show(TRUCK.g, VS + 3.5, 0, 50 - L.lt * 8, PI); cm([NARR - 2, 4.6, 8, NARR, 4.2, 0, 44], [NARR - 1.8, 4.5, 7, NARR, 4.2, 0, 42], L.k); sh(V(NARR, 0, 0), 30); }, [[0, 'cloth', .5], [.2, 'gasp', .6]]);
// 22 Ein Lastwagen raste … — plano general: el camión baja la calle a toda velocidad
shot(24.83, 'W', null, L => { use('ST'); show(TRUCK.g, VS + 3.5, 0, 64 - L.lt * 22, PI); put(ich, NARR, 0, 0, 0); actuar(ich, L.lt, [[0, 'recoil']], { T: L.T, extra: shiver(L.T) }); cara(ich, L.T, { expr: 'terror' });
  cm([VS - 8, 9, -16, VS + 5, 4, 30, 52], [VS - 7.5, 8.6, -15, VS + 5, 4, 30, 50], L.k); sh(V(VS, 0, 20), 50); }, [[0, 'car', 1], [.4, 'wind', .5]]);
// 23 … direkt auf mich zu. — por encima del hombro: el camión se le echa encima (zoom lento)
shot(25.89, 'Z', 'slow', L => { use('ST'); show(TRUCK.g, VS + 3.5, 0, 42 - L.lt * 16, PI); put(ich, NARR, 0, 0, 0); actuar(ich, L.lt, [[0, 'brace']], { T: L.T, extra: shiver(L.T, 1.5) }); cara(ich, L.T, { expr: 'scream' });
  cm([NARR + 1.5, 5.4, -6.5, VS + 4, 4.6, 24, 50], [NARR + 1.2, 5.2, -5.5, VS + 4, 4.6, 24, 44], L.k, easeIn); sh(V(VS, 0, 10), 40); }, [[0, 'car', 1], [.6, 'shout_m', .4]]);
// 24 Er fuhr einfach an mir vorbei. — pasa de largo; el viento le despeina
shot(27.03, 'C', null, L => { use('ST'); show(TRUCK.g, VS + 3.5, 0, 18 - L.lt * 26, PI); put(ich, NARR, 0, 0, 0); actuar(ich, L.lt, [[0, 'brace'], [1.1, 'idle', { dur: .5 }]], { T: L.T }); cara(ich, L.T, { expr: L.lt < 1.1 ? 'shock' : 'neutral' });
  cm([NARR + 1, 3.6, 11, NARR, 4, 0, 46], [NARR + 1.2, 3.8, 10, NARR, 4, 0, 44], L.k); sh(V(NARR, 0, 0), 30); }, [[0, 'car_pass', 1], [.2, 'wind', .8], [.4, 'leaves', .5]]);
// 25 Er wollte nur zum Supermarkt. — aparca; el camionero descarga
shot(28.89, 'W', null, L => { use('ST'); const z0 = -128; show(TRUCK.g, VS - 6, 0, z0 + 3, PI / 2 + .2); caminar(fahrer, L.lt, { x: VS + 4, z: z0 + 2, ry: -PI / 2 - .4, speed: 2.4, T: L.T, extra: { aLx: 1.3, aRx: 1.3, aLe: .9, aRe: .9 } }); attach(PARCEL, fahrer.spine, [0, 1.2, 1.6]); cara(fahrer, L.T, { expr: 'smile' });
  vecinos(L.T, -110, 2); cm([VS + 4, 9, z0 + 32, VS, 6, z0 - 6, 50], [VS + 3.6, 8.6, z0 + 29, VS, 6, z0 - 6, 48], L.k); sh(V(VS, 0, z0), 60); }, [[0, 'steam', .5], [.6, 'door_open', .4], [1.1, 'cash_reg', .3]]);
// 26 Dann packte mich … — una mano huesuda le agarra del brazo
const OLDZ = -80; const oldScene = () => { put(ich, NARR, 0, OLDZ, PI); put(alter, NARR - 2.9, 0, OLDZ - .6, PI / 2 - .2); };
shot(30.41, 'C', null, L => { use('ST'); oldScene(); actuar(alter, L.lt, [[0, 'idle'], [.05, { aRx: 1.45, aRz: -.2, aRe: .3, lean: .12, headY: .1 }, { dur: .2 }]], { T: L.T }); cara(alter, L.T, { expr: 'sus' }); actuar(ich, L.lt, [[0, 'idle'], [.15, 'recoil', { dur: .2 }]], { T: L.T }); cara(ich, L.T, { expr: 'shock' });
  const a = handP(alter); cam([a.x - 1.5, a.y + 1.4, a.z + 5.2], [a.x + .3, a.y, a.z], 40); sh(V(NARR, 0, OLDZ), 30); }, [[0, 'cloth', .7], [.1, 'gasp', .5]]);
// 27 … ein alter Mann am Arm — contrapicado del anciano altísimo
shot(31.2, 'Z', null, L => { use('ST'); oldScene(); actuar(alter, L.lt, [[0, { aRx: 1.45, aRz: -.2, aRe: .3, lean: .12, headY: .3, headX: -.1 }]], { T: L.T }); cara(alter, L.T, { expr: 'sus' }); actuar(ich, L.lt, [[0, 'recoil']], { T: L.T }); cara(ich, L.T, { expr: 'scared' });
  grade.uniforms.vig.value = .6; const h = hp(alter); cm([h.x + 2.2, 1.4, h.z + 7.5, h.x + .4, h.y - .6, h.z, 56], [h.x + 2, 1.5, h.z + 6.8, h.x + .4, h.y - .5, h.z, 54], L.k); sh(V(NARR, 0, OLDZ), 30); }, [[0, 'wind', .5], [.4, 'tick_hollow', .5]]);
// 28 … und starrte mir tief in die Augen. — primerísimo plano de sus ojos (zoom lento)
shot(32.09, 'C', 'slow', L => { use('ST'); oldScene(); alter.root.rotation.y = PI / 2 - .3; actuar(alter, L.lt, [[0, { aRx: 1.45, aRz: -.2, aRe: .3, lean: .2, headY: .15, headX: .15 }]], { T: L.T }); cara(alter, L.T, { expr: 'shock', noBlink: true }); cara(ich, L.T, { expr: 'scared' });
  grade.uniforms.vig.value = .7; onFace(alter, 4.4, -.2, .3, 34, L.k, 2.6); sh(V(NARR, 0, OLDZ), 30); }, [[0, 'heartbeat', .6]]);
// 29 „Egal, was passiert: — se inclina y susurra; el chico suda
shot(33.87, 'S', null, L => { use('ST'); oldScene(); alter.root.rotation.y = PI / 2 - .3; actuar(alter, L.lt, [[0, { aRx: 1.45, aRz: -.2, aRe: .3, lean: .3, headY: .1, headX: .25 }]], { T: L.T }); talk(alter, L.T, 33.87, 35.18, 'sus');
  actuar(ich, L.lt, [[0, 'recoil']], { T: L.T, extra: shiver(L.T, .6) }); cara(ich, L.T, { expr: 'scared', sweat: 1 }); ich.root.rotation.y = -PI / 2 + .4;
  cm([NARR - 1.4, 5.6, OLDZ + 7.5, NARR - 1.4, 5, OLDZ, 40], [NARR - 1.3, 5.6, OLDZ + 6.5, NARR - 1.4, 5, OLDZ, 38], L.k); sh(V(NARR, 0, OLDZ), 30); }, [[0, 'whisper', .6]]);
// 30 Vergiss deine Jacke nicht. — señala la chaqueta naranja
shot(35.18, 'C', null, L => { use('ST'); oldScene(); alter.root.rotation.y = PI / 2 - .3; actuar(alter, L.lt, [[0, { aRx: 1.45, aRe: .3, lean: .2 }], [.1, { aRx: 1.3, aRz: -.15, aRe: .05, lean: .25, headX: .2 }, { anti: .3 }]], { T: L.T }); talk(alter, L.T, 35.18, 36.47, 'angry');
  ich.root.rotation.y = -PI / 2 + .4; actuar(ich, L.lt, [[0, 'recoil']], { T: L.T }); cara(ich, L.T, { expr: 'confused' }); bubble(alter, 'JACKE!', L.lt * 1.4, 2.2);
  const j = ich.spine.getWorldPosition(V()).add(V(0, 1.2, 0)); cm([j.x - 3.5, j.y + 1.2, j.z + 6, j.x, j.y, j.z, 46], [j.x - 3, j.y + 1, j.z + 4.6, j.x, j.y, j.z, 42], L.k); sh(V(NARR, 0, OLDZ), 30); }, [[0, 'impact', .3], [.2, 'cloth', .5]]);
// 31 Draußen ist es kalt.“ — tiembla, vaho, termómetro a 3 °C
shot(36.47, 'W', null, L => { use('ST'); oldScene(); alter.root.rotation.y = PI / 2 - .5; actuar(alter, L.lt, [[0, 'hug_self']], { T: L.T, extra: shiver(L.T, 1.4) }); talk(alter, L.T, 36.47, 37.73, 'worried');
  const h = hp(alter); puffs(h.clone().add(V(.8, -.4, .3)), L.T); show(THERMO, NARR - 5.6, 5.4, OLDZ - 1.2, .3, 1.1); THERMO.scale.setScalar(1.1 * pop(L.lt, .2));
  cm([NARR - 1.5, 6.2, OLDZ + 9, NARR - 2.4, 5.4, OLDZ - .5, 46], [NARR - 1.3, 6, OLDZ + 8, NARR - 2.4, 5.4, OLDZ - .5, 44], L.k); sh(V(NARR, 0, OLDZ), 30); }, [[0, 'wind', .8], [.4, 'shiver', .5]]);
// 32 Ich hatte meine Jacke. — se sube la cremallera, orgulloso
shot(37.73, 'Z', null, L => { use('ST'); put(ich, NARR, 0, OLDZ - 6, PI + .3); actuar(ich, L.lt, [[0, { aRx: 1.0, aRe: 1.6, aLx: .9, aLe: 1.8 }], [.4, { aRx: 2.1, aRe: 2.2, aLx: .9, aLe: 1.8, headX: -.1 }, { anti: .2 }]], { T: L.T }); cara(ich, L.T, { expr: 'smug' });
  onFace(ich, 7, 0, 1.2, 44, L.k, 5.6); sh(V(NARR, 0, OLDZ), 30); }, [[.3, 'zip', .8]]);
// 33 Und es war wirklich kalt. — tiembla, hojas al viento
shot(38.81, 'R', null, L => { use('ST'); put(ich, NARR, 0, OLDZ - 8, PI + .2); actuar(ich, L.lt, [[0, 'hug_self']], { T: L.T, extra: shiver(L.T, 1.6) }); cara(ich, L.T, { expr: 'worried' }); puffs(hp(ich).add(V(-.2, -.4, -.7)), L.T);
  cm([NARR - 7, 5, OLDZ - 16, NARR, 4, OLDZ - 8, 48], [NARR - 6.5, 4.8, OLDZ - 15, NARR, 4, OLDZ - 8, 46], L.k); sh(V(NARR, 0, OLDZ), 30); }, [[0, 'wind', .9], [.5, 'leaves', .6]]);
// 34 Also ging ich in ein Restaurant … — entra por la puerta
shot(40.2, 'W', null, L => { use('RG'); const p = caminar(ich, L.lt, { x: RX + 12.3, z: 24, ry: PI, speed: 3.4, stopAt: .7, T: L.T }); cara(ich, L.T, { expr: 'smile' }); RG.door.rotation.y = -1.2 * easeOut(clamp((L.lt - .6) / .4));
  caminar(fk[5], L.lt, { x: RX - 24, z: 22, ry: PI / 2, speed: 2.6, accel: .01, T: L.T }); cara(fk[5], L.T, { expr: 'smile' });
  cm([RX - 2, 7, 42, RX + 9, 5.5, 18, 50], [RX - 1.4, 6.8, 40.5, RX + 9, 5.5, 18, 48], L.k); sh(V(RX, 0, 18), 40); }, [[0, 'steps', .6], [.7, 'door_bell', .6]]);
// 35 … und setzte mich. — se sienta en la mesa B
const seatB = [RX + 6, -5.6], seatA = [RX - 6, -5.6];
shot(41.45, 'S', null, L => { use('RG'); inside(1.1, .4); const k = easeOut(clamp(L.lt / .5)); const s = ich.spec.scale; put(ich, seatB[0], lerp(0, 2.0 - (2.05 - .2) * s + .08, k), seatB[1], 0); applyPose(ich, { crouch: .2 * k, lLx: 1.5 * k, lRx: 1.5 * k, lLk: 1.5 * k, lRk: 1.5 * k, aLz: .15, aRz: .15, lean: .2 * Math.sin(k * PI) });
  cara(ich, L.T, { expr: 'smile' }); sit(junge, seatA[0], 2.9, seatA[1], 0); cara(junge, L.T, { expr: 'neutral', noBlink: true }); junge.neck.rotation.y = .9;
  cm([RX + 9, 6.5, 8, RX + 5, 4.2, -5, 46], [RX + 8.4, 6.2, 6.6, RX + 5, 4.2, -5, 44], L.k); }, [[0, 'cloth', .5], [.3, 'wood_creak', .5]]);
const diner = (T, kidHead = .9) => { use('RG'); inside(1.1, .4); sit(ich, seatB[0], 2.0, seatB[1], 0); sit(junge, seatA[0], 2.9, seatA[1], 0); junge.neck.rotation.y = kidHead; show(FRIES, seatA[0] + 1.7, 3.45, -2.4); show(FRIES2, seatA[0] - 1.8, 3.45, -2.6, .4); };
// 36 Am Nebentisch saß ein Junge. — el niño de la mesa de al lado (zoom lento)
shot(42.52, 'Z', 'slow', L => { diner(L.T); cara(ich, L.T, { expr: 'neutral' }); cara(junge, L.T, { expr: 'neutral', eyes: 'side_r', noBlink: true }); grade.uniforms.vig.value = .55;
  cm([RX - 6, 5.6, 6, RX - 6, 4.2, -5.6, 44], [RX - 6, 5.0, 2.2, RX - 6, 4.1, -5.6, 38], L.k, easeIn); }, [[0, 'clock_tick', .5]]);
// 37 Er blinzelte nicht. — primerísimo plano de los ojos
shot(44.0, 'C', null, L => { diner(L.T); cara(junge, L.T, { expr: 'neutral', eyes: 'side_r', noBlink: true }); cara(ich, L.T, { expr: 'worried' }); grade.uniforms.vig.value = .6;
  const h = hp(junge).add(V(0, .7, 0)); cm([h.x + 1.2, h.y + .1, h.z + 3.2, h.x, h.y, h.z, 30], [h.x + 1, h.y, h.z + 2.6, h.x, h.y, h.z, 28], L.k); }, [[0, 'clock_tick', .6], [.5, 'clock_tick', .6]]);
// 38 Er sagte nichts. — boca cerrada, las patatas sin tocar
shot(45.03, 'C', null, L => { diner(L.T); cara(junge, L.T, { expr: 'neutral', eyes: 'side_r', noBlink: true }); cara(ich, L.T, { expr: 'worried' }); grade.uniforms.vig.value = .6;
  cm([RX - 4, 4.6, 2, RX - 6, 3.9, -5, 40], [RX - 4.3, 4.5, 1.2, RX - 6, 3.9, -5, 38], L.k); }, [[0, 'silence_tick', .5]]);
// 39 Er starrte mich einfach nur an. — contraplano: el narrador suda (zoom lento)
shot(45.95, 'Z', 'slow', L => { diner(L.T); cara(junge, L.T, { expr: 'neutral', eyes: 'side_r', noBlink: true }); cara(ich, L.T, { expr: 'scared', sweat: 1, eyes: 'side_l' }); ich.neck.rotation.y = -.5; grade.uniforms.vig.value = .6;
  cm([RX - 6.5, 6, -9, RX + 6, 4.2, -5.6, 46], [RX - 5, 5.6, -8.4, RX + 6, 4.3, -5.6, 36], L.k, easeIn); }, [[0, 'heartbeat', .6]]);
// 40 Dann aß er weiter seine Pommes. — come patatas tan feliz
shot(47.66, 'F', null, L => { diner(L.T, .9 * (1 - easeOut(clamp(L.lt / .3)))); const b = Math.max(0, Math.sin(L.T * 7)); applyPose(junge, { ...SIT, aRx: .9 + b * 1.1, aRe: 1.2 + b * 1.0 }); cara(junge, L.T, { expr: 'joy' }); cara(ich, L.T, { expr: 'relief' });
  cm([RX - 8.6, 6, 3.5, RX - 6, 4.7, -5.6, 42], [RX - 8.2, 5.8, 2.6, RX - 6, 4.7, -5.6, 40], L.k); }, [[.2, 'chew', .7], [.7, 'chew', .6], [1.0, 'ding_soft', .4]]);
// 41 Ich bestellte einen Burger. — el camarero apunta
shot(49.4, 'W', null, L => { diner(L.T, 0); actuar(ich, L.lt, [[0, { ...SIT }], [.2, { ...SIT, aRx: 2.0, aRz: -.1, aRe: .1, headX: -.2, headY: -.3 }, { anti: .2 }]], { T: L.T }); cara(ich, L.T, { expr: 'happy' }); cara(junge, L.T, { expr: 'joy' });
  put(kellner, RX + 8.6, 0, -.6, -.6); actuar(kellner, L.lt, [[0, { aLx: 1.3, aLe: 1.6, aRx: 1.2, aRe: 1.9, headX: .3 }]], { T: L.T, extra: { aRe: 1.9 + Math.sin(L.T * 14) * .15 } }); attach(NOTE, kellner.aL.hand, [0, -.5, .4], [-.5, 0, 0]); cara(kellner, L.T, { expr: 'neutral', eyes: 'down' });
  cm([RX + 2, 6.8, 7, RX + 6.5, 5, -5, 46], [RX + 2.6, 6.6, 6, RX + 6.5, 5, -5, 44], L.k); }, [[0, 'pencil', .6], [.6, 'pages', .4]]);
// 42 Der Kellner brachte ihn mir. — camina con el plato
shot(50.71, 'S', null, L => { diner(L.T, 0); cara(ich, L.T, { expr: 'happy' }); const p = caminar(kellner, L.lt, { x: RX + 2, z: -11, ry: .35, speed: 3, stopAt: .8, T: L.T, extra: { aRx: 1.4, aRe: 1.3, aRz: -.1 } }); cara(kellner, L.T, { expr: 'smile' });
  attach(BURG, kellner.aR.hand, [0, -.6, .9], [0, 0, 0], .9);
  cm([RX + 9, 6, 6, RX + 4, 4.6, -6, 46], [RX + 8.4, 5.8, 5, RX + 4, 4.6, -6, 44], L.k); }, [[0, 'steps', .6], [.8, 'plate_slide', .6]]);
// 43 Ich biss hinein. — mordisco
shot(51.93, 'C', null, L => { diner(L.T, 0); const k = clamp(L.lt / .15); actuar(ich, L.lt, [[0, { ...SIT, aLx: 1.5, aRx: 1.5, aLe: 1.6, aRe: 1.6, aLz: -.3, aRz: -.3 }], [.1, { ...SIT, aLx: 1.9, aRx: 1.9, aLe: 1.9, aRe: 1.9, aLz: -.35, aRz: -.35, headX: .1 }, { dur: .15 }]], { T: L.T });
  attach(BURG, ich.aR.hand, [-.6, -.7, .5], [0, 0, 0], .7); BURG.userData.plate.visible = false; cara(ich, L.T, { expr: L.lt < .15 ? 'gasp' : 'neutral', mouth: L.lt < .15 ? 'scream' : (Math.sin(L.T * 20) > 0 ? 'wavy' : 'flat') });
  onFace(ich, 4.2, -.3, .8, 38, L.k, 3.4); }, [[.12, 'chew', .9]]);
// 44 Er schmeckte nach Burger. — cara de póquer masticando
shot(52.78, 'Z', null, L => { diner(L.T, 0); actuar(ich, L.lt, [[0, { ...SIT, aLx: 1.2, aRx: 1.2, aLe: 1.2, aRe: 1.2, aLz: -.3, aRz: -.3 }]], { T: L.T }); attach(BURG, ich.aR.hand, [-.6, -.6, .5], [0, 0, 0], .7); BURG.userData.plate.visible = false; cara(ich, L.T, { expr: 'bored', mouth: Math.sin(L.T * 18) > 0 ? 'wavy' : 'flat' });
  onFace(ich, 6, .2, -.6, 40, L.k, 5); }, [[0, 'chew', .6], [.5, 'chew', .5]]);
// 45 Ich bezahlte … — monedas en la mano del camarero
shot(53.7, 'W', null, L => { diner(L.T, 0); actuar(ich, L.lt, [[0, { ...SIT, aRx: 1.5, aRe: .4, aRz: .1, headY: .3 }]], { T: L.T }); cara(ich, L.T, { expr: 'smile' }); put(kellner, RX + 8.4, 0, -2.2, -.9); actuar(kellner, L.lt, [[0, { aLx: 1.3, aLe: .6, aLz: -.1 }]], { T: L.T }); cara(kellner, L.T, { expr: 'happy' });
  const h = handP(kellner, 0); show(COINS, h.x, h.y + .45 + Math.max(0, .6 - L.lt) * 2, h.z); cm([RX + 4, 5.6, 3, RX + 7.4, 3.8, -3.6, 40], [RX + 4.4, 5.4, 2.2, RX + 7.4, 3.8, -3.6, 38], L.k); }, [[.1, 'coin_flip', .6], [.5, 'cash_reg', .6]]);
// 46 … und ging nach Hause. — vuelve a casa al atardecer
shot(54.6, 'R', null, L => { use('ST'); dusk(); const p = caminar(ich, L.lt, { x: NARR, z: -30, ry: 0, speed: 3, accel: .01, T: L.T }); cara(ich, L.T, { expr: 'smile' });
  cm([p.x - 7, 5, p.z + 13, p.x, 4, p.z, 48], [p.x - 6.6, 4.8, p.z + 12.4, p.x, 4, p.z, 46], L.k); sh(V(VS, 0, p.z), 40); }, [[0, 'steps', .6], [.4, 'crickets', .3]]);
// 47 Doch genau in dieser Nacht — el pueblo de noche, todo iluminado
const nightDrone = (L, a, b) => { use('ST'); night(); cm(a, b, L.k); sh(V(VS, 0, -20), 80); };
shot(55.7, 'F', null, L => nightDrone(L, [VS + 40, 60, 70, VS, 4, -20, 50], [VS + 38, 56, 66, VS, 4, -20, 48]), [[0, 'crickets', .6], [.6, 'owl', .4]]);
// 48 … fiel in der ganzen Stadt — las ventanas se apagan una tras otra
shot(57.12, 'C', null, L => { nightDrone(L, [VS - 30, 34, 40, VS, 4, -30, 52], [VS - 29, 33, 38, VS, 4, -30, 50]); const k = clamp(L.lt / 1.0); winsOn(i => i / WIN.length > k); VLAMP.forEach((b, i) => b.material.emissiveIntensity = i / VLAMP.length > k ? 2.2 : 0); },
  [[0, 'switch', .6], [.35, 'switch', .6], [.7, 'switch', .6], [.9, 'hum_low', .4]]);
// 49 … der Strom aus. — la última farola muere; negro
shot(58.34, 'C', null, L => { use('ST'); night(.004); winsOn(() => false); VLAMP.forEach(b => b.material.emissiveIntensity = 0); const on = L.lt < .3 || (L.lt > .38 && L.lt < .45); VLAMP[2].material.emissiveIntensity = on ? 2.5 : 0;
  hemi.intensity = .35; grade.uniforms.lift.value = -clamp((L.lt - .5) / .6) * .5; cm([VS + 6, 6, 20, VS + 10.6, 11, 30, 44], [VS + 6.4, 6.2, 21, VS + 10.6, 11, 30, 42], L.k); sh(V(VS, 0, 20), 30); }, [[.3, 'tick_hollow', .7], [.5, 'silence_tick', .5]]);
// 50 Jedes Haus wurde dunkel. — salón a oscuras, solo la linterna
shot(59.48, 'I', null, L => { use('WG'); inside(.3, 0); WG.light.intensity = 0; scene.fog.density = .004; scene.fog.color.setRGB(.01, .01, .03); put(ich, WX + 8, 0, 2, .5); actuar(ich, L.lt, [[0, { aRx: 1.4, aRe: .3, aLx: .4, aLz: .2, aLe: .6 }]], { T: L.T, extra: shiver(L.T, .6) });
  cara(ich, L.T, { expr: 'scared' }); const h = handP(ich); attach(KG.flash, ich.aR.hand, [0, -.6, .5]); FL.intensity = 300; FL.position.copy(h).add(V(0, -.2, .8)); FL.target.position.copy(h).add(V(4, -1, 10));
  grade.uniforms.vig.value = .7; onFace(ich, 7, .6, -1.6, 44, L.k, 5.6); }, [[0, 'click_metal', .6], [.4, 'breath', .6]]);
// 51 Und dann hörte ich … — se queda helado mirando a la puerta
shot(60.94, 'Z', null, L => { use('WG'); inside(.08, 0); WG.light.intensity = 0; scene.fog.density = .004; scene.fog.color.setRGB(.01, .01, .03); put(ich, WX + 12, 0, 6, .7); actuar(ich, L.lt, [[0, { aRx: 1.4, aRe: .3 }], [.2, { aRx: 1.5, aRe: .2, headY: .3, lean: -.1 }, { anti: .2 }]], { T: L.T, extra: shiver(L.T, 1) });
  cara(ich, L.T, { expr: 'terror', eyes: 'side_r' }); attach(KG.flash, ich.aR.hand, [0, -.6, .5]); const h = handP(ich); FL.intensity = 300; FL.position.copy(h).add(V(0, -.2, .8)); FL.target.position.set(WX + 17, 4, 13.6);
  grade.uniforms.vig.value = .7; onFace(ich, 5, .4, 1.4, 40, L.k, 4.2); }, [[.2, 'heartbeat', .7]]);
// 52 … Schritte auf der Veranda. — botas que suben al porche, linterna del casco (zoom lento)
shot(61.85, 'C', 'slow', L => { use('NG'); night(.003); NG.lampR.intensity = 0; NG.lampB.visible = false; const p = caminar(arb, L.lt, { x: NX - 1, z: 10, ry: PI, speed: 2.6, stopAt: 1.0, T: L.T }); arb.root.position.y = p.z < 4.6 ? .6 : 0; cara(arb, L.T, { expr: 'neutral' });
  HL.intensity = 220; const hh = hp(arb); HL.position.copy(hh).add(V(0, .6, -.6)); HL.target.position.set(NX, 2, -2); grade.uniforms.vig.value = .7;
  cm([NX + 3.2, 1.3, 1.6, NX - 1, 1.6, 8, 48], [NX + 3, 1.3, 2, NX - 1, 1.4, 7, 42], L.k, easeIn); }, [[0, 'steps', .8], [.5, 'steps', .8], [.9, 'wood_creak', .6]]);
// 53 Klopf! Klopf! — la puerta tiembla con cada golpe
const knockAt = [0, .51];
shot(63.22, 'C', null, L => { use('WG'); inside(.08, 0); WG.light.intensity = 0; scene.fog.density = .003; scene.fog.color.setRGB(.01, .01, .03); let sk = 0; for (const t of knockAt) if (L.lt > t && L.lt - t < .15) sk = 1 - (L.lt - t) / .15; DOORP.rotation.y = sk * .03;
  FL.intensity = 70; hemi.intensity = .3; FL.position.set(WX + 12, 4.5, 6); FL.target.position.set(WX + 17, 4.5, 13.6); cm([WX + 11, 4.8, 3, WX + 17, 4.6, 13.6, 46], [WX + 12.6, 4.8, 6.4, WX + 17, 4.6, 13.6, 40 - L.lt * 4], L.k); grade.uniforms.vig.value = .65; }, [[0, 'knock', 1], [.51, 'knock', 1]]);
// 54 Klopf! — cara del narrador
shot(64.31, 'C', null, L => { use('WG'); inside(.3, 0); WG.light.intensity = 0; scene.fog.density = .003; scene.fog.color.setRGB(.01, .01, .03); put(ich, WX + 13, 0, 8, .6); actuar(ich, L.lt, [[0, 'brace']], { T: L.T, extra: shiver(L.T, 1.4) }); cara(ich, L.T, { expr: 'scream' });
  attach(KG.flash, ich.aR.hand, [0, -.6, .5]); FL.intensity = 200; FL.position.copy(handP(ich)).add(V(0, 0, .8)); FL.target.position.set(WX + 17, 4, 13.6); grade.uniforms.vig.value = .65; onFace(ich, 4.2, .2, -.6, 40, L.k, 3.4); }, [[0, 'knock', 1]]);
// 55 Ich öffnete die Tür. — abre despacio; una luz cegadora (zoom lento)
shot(64.87, 'Z', 'slow', L => { use('WG'); inside(.08, 0); WG.light.intensity = 0; scene.fog.density = .003; scene.fog.color.setRGB(.01, .01, .03); DOORP.rotation.y = -1.3 * easeIn(clamp(L.lt / 1.0));
  put(ich, WX + 16.8, 0, 11, PI * 0 + .1); actuar(ich, L.lt, [[0, { aRx: 1.3, aRe: .5, lean: .1 }]], { T: L.T }); cara(ich, L.T, { expr: 'scared' });
  HL.intensity = 400 * easeIn(clamp(L.lt / 1)); HL.position.set(WX + 17, 6, 18); HL.target.position.set(WX + 16, 3, 8); grade.uniforms.flash.value = easeIn(clamp((L.lt - .6) / .45)) * .7;
  cm([WX + 13.5, 6, 4.5, WX + 17, 4.6, 13, 46], [WX + 14.4, 5.8, 6.8, WX + 17, 4.6, 13, 40], L.k, easeIn); }, [[.1, 'door_open', .7], [.5, 'wood_creak', .5]]);
// 56 Es waren die Stadtwerke. — el operario saluda; la furgoneta con su rotativo
shot(65.94, 'F', null, L => { use('NG'); night(.0015); put(arb, NX - .5, 0, 7.4, PI + .15); actuar(arb, L.lt, [[0, 'wave', { anti: .2 }]], { T: L.T }); cara(arb, L.T, { expr: 'happy' }); show(VAN.g, NX - 14, 0, 29, PI / 2); VAN.beacon.material.emissiveIntensity = Math.sin(L.T * 12) > 0 ? 3 : .3;
  HL.intensity = 120; HL.position.copy(hp(arb)).add(V(0, .6, -.6)); HL.target.position.set(NX, 3, -4); cm([NX + .6, 5.6, 1.6, NX - .5, 4.8, 7.4, 50], [NX + .4, 5.5, 2.2, NX - .5, 4.8, 7.4, 46], L.k); }, [[0, 'flash', .4], [.3, 'radio', .4]]);
// 57 Nach zwanzig Minuten … — repara el armario eléctrico; reloj «20 MIN»
shot(67.1, 'W', null, L => { use('NG'); night(.0015); show(BOX.g, NX - 7, 0, 21.3, PI); put(arb, NX - 7, 0, 24.2, PI); actuar(arb, L.lt, [[0, { aRx: 1.5, aRe: 1.1 + Math.sin(L.T * 12) * .3, aLx: 1.3, aLe: .8 }]], { T: L.T }); attach(WRENCH, arb.aR.hand, [0, -.6, .4]); cara(arb, L.T, { expr: 'determined', eyes: 'down' });
  HL.intensity = 160; HL.position.copy(hp(arb)).add(V(0, .6, -.6)); HL.target.position.set(NX - 7, 3, 21); show(VAN.g, NX - 18, 0, 29, PI / 2); VAN.beacon.material.emissiveIntensity = Math.sin(L.T * 12) > 0 ? 3 : .3;
  badge('big', '20 MIN', W / 2, H * .2, L.lt * 1.6); cm([NX - .5, 6, 27.5, NX - 7, 3.6, 22.5, 48], [NX - 1, 5.8, 27, NX - 7, 3.6, 22.5, 46], L.k); }, [[0, 'ratchet', .6], [.4, 'sparks', .4], [.7, 'clock_tick', .4]]);
// 58 … war alles repariert. — vuelve la luz a todo el pueblo
shot(67.92, 'C', null, L => { nightDrone(L, [VS + 30, 40, 50, VS, 4, -20, 52], [VS + 28, 38, 46, VS, 4, -20, 50]); const k = clamp(L.lt / .5); winsOn(i => i / WIN.length < k); VLAMP.forEach((b, i) => b.material.emissiveIntensity = i / VLAMP.length < k ? 2.2 : 0); grade.uniforms.flash.value = Math.max(0, .5 - L.lt) * .6; }, [[0, 'power_on', .8], [.5, 'hum', .4]]);
// 59 Vor dem Schlafen schaute ich aus dem Fenster. — el narrador en la ventana, desde fuera
shot(69.4, 'W', null, L => { use('NG'); night(.0018); put(ich, NX, 5, -1.6, 0); actuar(ich, L.lt, [[0, { aLx: .9, aRx: .9, aLe: 1.2, aRe: 1.2, lean: .1 }]], { T: L.T }); cara(ich, L.T, { expr: 'neutral' });
  cm([NX + 2, 9, 12, NX, 10, 0, 38], [NX + 1.6, 9.2, 10, NX, 10, 0, 34], L.k); }, [[0, 'crickets', .6], [.6, 'cloth', .4]]);
// 60 Unter der Straßenlaterne — su punto de vista a través del cristal
shot(71.46, 'Z', null, L => { use('NG'); night(.004); NG.mbm.color.setHex(0x050608); NG.lampL.position.set(NX + 1.6, 12, 44); put(ich, NX, 5, -1.6, 0); cm([NX - .3, 10.4, -1, NX + 3, 5.5, 40, 46], [NX - .3, 10.4, -.6, NX + 3, 5.5, 40, 40], L.k); }, [[0, 'hum', .4], [.4, 'crickets', .5]]);
// 61 … stand eine Gestalt. — la silueta bajo la farola (zoom lento)
shot(72.7, 'C', 'slow', L => { use('NG'); night(.006); NG.mbm.color.setHex(0x050608); NG.lampL.position.set(NX + 1.6, 12, 44); NG.lampL.intensity = 220; grade.uniforms.vig.value = .72; cm([NX - 2, 4, 22, NX + 2, 5.2, 39.6, 44], [NX - .6, 4.6, 28, NX + 2, 5.4, 39.6, 36], L.k, easeIn); }, [[0, 'wind', .5], [.5, 'heartbeat', .5]]);
// 62 Sie bewegte sich nicht — quieta del todo, niebla
shot(73.98, 'C', null, L => { use('NG'); night(.007); NG.mbm.color.setHex(0x050608); NG.lampL.position.set(NX + 1.6, 12, 44); NG.lampL.intensity = 200; grade.uniforms.vig.value = .74; cm([NX + 5, 3.2, 31, NX + 1.6, 5.6, 39.6, 36], [NX + 4.8, 3.3, 31.6, NX + 1.6, 5.6, 39.6, 34], L.k); }, [[0, 'silence_tick', .5], [.4, 'owl', .3]]);
// 63 … und starrte direkt auf mein Haus. — desde detrás de la figura hacia la ventana del narrador (zoom lento)
shot(74.94, 'Z', 'slow', L => { use('NG'); night(.004); NG.mbm.color.setHex(0x050608); NG.lampL.position.set(NX + 1.6, 12, 44); NG.lampL.intensity = 220; put(ich, NX, 5, -1.6, 0); cara(ich, L.T, { expr: 'scared' }); actuar(ich, L.lt, [[0, { aLx: .9, aRx: .9, aLe: 1.6, aRe: 1.6 }]], { T: L.T, extra: shiver(L.T, .6) });
  grade.uniforms.vig.value = .72; cm([NX + 2.6, 7.4, 44, NX, 10, 0, 40], [NX + 2.3, 7.2, 42, NX, 10, 0, 30], L.k, easeIn); }, [[0, 'heartbeat', .7]]);
// 64 Es war ein Briefkasten. — luz: es un buzón (Nr. 12)
shot(77.05, 'C', null, L => { use('NG'); night(.0008); NG.lampL.intensity = 600; hemi.intensity = 1.0; cm([NX - .5, 4.6, 29, NX + 1.6, 4.2, 39.6, 40], [NX - .3, 4.6, 30, NX + 1.6, 4.2, 39.6, 38], L.k); badge('tag', 'NR. 12', W / 2, H * .18, L.lt - .3); }, [[0, 'ding_soft', .7]]);
// 65 Es war schon immer ein Briefkasten. — en sepia, de día, alguien echa una carta
shot(78.39, 'F', null, L => { use('NG'); day(); grade.uniforms.sepia.value = .95; grade.uniforms.vig.value = .7; NG.lampL.intensity = 0; put(fk[4], NX + 4.4, 0, 37.8, PI + .9); actuar(fk[4], L.lt, [[0, { aRx: 1.5, aRe: .4 }], [.6, 'idle']], { T: L.T }); cara(fk[4], L.T, { expr: 'smile' });
  badge('tag', '1958', W / 2, H * .16, L.lt - .2); cm([NX - 5, 6, 30, NX + 1.6, 5, 39.6, 46], [NX - 4.5, 5.8, 31, NX + 1.6, 5, 39.6, 44], L.k); sh(V(NX, 0, 39), 30); }, [[0, 'film_roll', .6], [.6, 'paper', .5]]);
// 66 Ich putzte mir die Zähne, — en el baño
shot(80.1, 'W', null, L => { use('BG'); inside(1.0, .3); put(ich, BX + .4, 0, -3.2, PI + .5); actuar(ich, L.lt, [[0, { aRx: 1.9, aRe: 2.0 + Math.sin(L.T * 22) * .25, aRz: -.3, headX: -.05 }]], { T: L.T }); attach(BG.brush, ich.aR.hand, [0, -.6, .45], [0, 0, 0]); cara(ich, L.T, { expr: 'bored', mouth: 'grimace' });
  cm([BX + 4, 5.6, -6.2, BX + .4, 4.4, -3.2, 46], [BX + 3.8, 5.5, -6, BX + .4, 4.4, -3.2, 42], L.k); }, [[0, 'brush', .8], [.7, 'brush', .7]]);
// 67 … machte das Licht aus — interruptor; la habitación se apaga
shot(81.53, 'C', null, L => { use('KZ'); inside(.9, .3); const off = L.lt > .4; KZG.g.traverse(o => { if (o.isPointLight) o.intensity = off ? 4 : 26; }); if (off) { hemi.intensity = .15; } put(ich, KZ + 10.8, 0, 2.5, PI / 2); actuar(ich, L.lt, [[0, 'idle'], [.15, { aRx: 1.6, aRe: .5, aRz: -.1 }, { dur: .2 }]], { T: L.T }); cara(ich, L.T, { expr: 'sleepy' });
  cm([KZ + 11.8, 5.4, 8.5, KZ + 11, 4.6, 2.5, 46], [KZ + 11.6, 5.3, 7.8, KZ + 11, 4.6, 2.5, 44], L.k); }, [[.4, 'switch', .9]]);
// 68 … und ging schlafen. — se acuesta y cierra los ojos
shot(82.67, 'S', null, L => { use('KZ'); inside(.15, .05); KZG.g.traverse(o => { if (o.isPointLight) o.intensity = 4; }); put(ich, KZ - 4, 3.0, -3.2, 0); ich.root.rotation.set(-PI / 2, 0, 0); applyPose(ich, { aLz: .1, aRz: .1 }); cara(ich, L.T, { expr: 'relief', eyes: 'closed' });
  cm([KZ - .5, 7.2, -10.2, KZ - 4, 3.2, -6.4, 46], [KZ - .8, 7, -10, KZ - 4, 3.2, -6.4, 42], L.k); }, [[0, 'cloth', .6], [.4, 'sigh', .4]]);
// 69 Es passierte nichts. — duerme; el reloj hace tic-tac
shot(83.38, 'Z', null, L => { use('KZ'); inside(.15, .05); KZG.g.traverse(o => { if (o.isPointLight) o.intensity = 4; }); put(ich, KZ - 4, 3.0, -3.2, 0); ich.root.rotation.set(-PI / 2, 0, 0); applyPose(ich, { aLz: .1, aRz: .1 }); cara(ich, L.T, { expr: 'sleepy', eyes: 'closed' }); KCLOCK.h2.rotation.z = -L.T * 6;
  BAD.push({ kind: 'zzz', text: L.T * .8, x: W * .62, y: H * .36, s: 1, a: 1, on: true }); cm([KZ + 4, 9, 6, KZ - 4, 3, -5, 50], [KZ + 3.4, 8.6, 5, KZ - 4, 3, -5, 48], L.k); }, [[0, 'clock_tick', .6], [.4, 'snore', .5]]);
// 70 Also ja: — por la mañana, se encoge de hombros a cámara
shot(84.42, 'C', null, L => { use('ST'); put(ich, VS - 9, 0, 14, .4); actuar(ich, L.lt, [[0, 'idle'], [.05, 'shrug', { anti: .2 }]], { T: L.T }); cara(ich, L.T, { expr: 'bored' }); onFace(ich, 6.5, .2, 0, 44, L.k, 5.4); sh(V(VS - 9, 0, 12), 30); }, [[0, 'cloth', .5], [.3, 'birds', .4]]);
// 71 In dieser Stadt passiert nie etwas. — el dron se aleja sobre la Vorstadt (cierra el bucle)
shot(85.02, 'W', null, L => { use('ST'); vecinos(L.T, -10, 3); put(ich, VS - 9, 0, 14, .4); actuar(ich, L.lt, [[0, 'wave']], { T: L.T }); cara(ich, L.T, { expr: 'happy' }); const k = easeInOut(clamp(L.lt / 2.1)); cam([VS - 6 + k * 40, lerp(8, 70, k), lerp(26, 110, k)], [VS - 9 + k * 9, lerp(4, 4, k), lerp(14, -14, k)], lerp(46, 56, k)); sh(V(VS, 0, 0), 70); }, [[0, 'birds', .6], [.6, 'wind', .4]]);

// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  else if (i > 0) CUES.push({ t: s.t0 + .04, s: ['zoom_in', 'zoom_out'][i % 2], g: .35 });
  if (s.tr === 'C') CUES.push({ t: +(s.t1 + .01).toFixed(3), s: 'impact', g: .4 }); });
CUES.push({ t: 0, s: 'whoosh_up', g: .9 }); CUES.push({ t: 0, s: 'zoom_fast', g: .9 });
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD.length = 0; s.fn(L);
  if (s.zoom === 'slow') { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .78, e); camera.fov *= lerp(1, .9, e); }
  if (i === 0) { const k = clamp(T / .2); camera.fov *= lerp(.62, 1, easeOut(k)); }   // golpe de zoom en el fotograma 0
  let sh_ = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'braam', 'knock', 'zoom_fast'].includes(c.s) && T - c.t < .14) sh_ = 1 - (T - c.t) / .14; }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .22 * sh_; camera.position.y += (r() - .5) * .22 * sh_; }
  camaraEnMano(camera, T, 1); camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  // ambiente: luz del cielo, viento, partículas, pájaros
  const dir = new THREE.Vector3(); camera.getWorldDirection(dir); const ctr = camera.position.clone().addScaledVector(dir, 14);
  const outside = SETS.ST.visible || SETS.NG.visible || SETS.RG.visible && camera.position.z - 0 > 14;
  IBL.update(MODE !== 'in'); setViento(T, MODE === 'night' ? .6 : 1);
  AIR.update(T, ctr, MODE === 'night' ? (SETS.NG.visible ? 'noche' : 'luciernagas') : MODE === 'in' ? 'polvo' : 'polvo', MODE === 'in' ? .8 : .45);
  BIRDS.update(T, ctr, outside && MODE !== 'in' && grade.uniforms.sepia.value === 0, MODE === 'night');
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
  for (const b of BAD) drawBadge(b); caption(T);
}
// portadas 1080×1920 (sin spoilers): 0 = la "figura" bajo la farola mirando la ventana; 1 = el camión que se le echa encima
function coverText(l1, l2, col) { const c = octx; c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  for (const [t, y, sz, f] of [[l1, H * .12, 118, '#ffffff'], [l2, H * .2, 132, col]]) { c.font = `700 ${sz}px ${FONT}`; const tw = c.measureText(t).width, k = Math.min(1, W * .92 / tw); c.save(); c.translate(W / 2, y); c.scale(k, k);
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.lineWidth = sz * .22; c.strokeStyle = '#000'; c.strokeText(t, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = f; c.fillText(t, 0, 0); c.restore(); } c.restore(); }
window.renderCover = v => { const i = v === 0 ? S.findIndex(s => s.t0 === 74.94) : S.findIndex(s => s.t0 === 23.9); const s = S[i], T = s.t0 + (s.t1 - s.t0) * (v === 0 ? .7 : .85);
  renderShot(i, T, null, 0); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.drawImage(renderer.domElement, 0, 0, W, H);
  coverText('IN DIESER STADT', v === 0 ? 'STEHT ER JEDE NACHT DA…' : 'IST ALLES NORMAL?', v === 0 ? '#E2FD07' : '#ff5a4a'); };
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;

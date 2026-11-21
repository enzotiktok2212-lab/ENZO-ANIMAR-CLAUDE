// Traumsammler — ~42 planos sincronizados con audio/words.json. Estilo Roblox, AO, haces de luz, luz líquida.
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, idlePose, mixPose, V, lerp, clamp,
  easeOut, easeIn, easeInOut, spring, blinking, lip, RNG, mat, box, sphere, cyl, canvasTex, textPlane, checkTex } from './engine.js';
import { nightSky, rathausturm, FONT } from './sets.js';
import { nursery } from './sets2.js';
import { living, kitchen } from './world.js';
import { emilRoom } from './world2.js';
import { makeBen, makeGrey, makeFolk, dreamOrb, lightCone, rimLight } from './roblox.js';

await document.fonts.load('700 40px Cap');
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 66.08;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xbfd8f0, .004);
const camera = new THREE.PerspectiveCamera(46, W / H, .2, 3000); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera);
const sky = nightSky(scene); sky.clouds.forEach((c, i) => c.position.set(-700 + i * 160, 380 + (i % 3) * 60, -1300));
const hemi = new THREE.HemisphereLight(0xcfe0ff, 0x8a7a6a, 1.6); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d8, 2.6); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 5; scene.add(sun, sun.target);
const rim = rimLight(scene);
function sh(p, s = 30) { const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 600 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-60, 120, 80)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- texturas detalladas ----------
const noiseTex = (base, var_, n = 900, size = 3, rep = 1) => { const t = canvasTex(256, 256, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); const r = RNG(base.length * 7); for (let i = 0; i < n; i++) { c.fillStyle = var_[i % var_.length]; c.globalAlpha = .35 + r() * .5; c.fillRect(r() * w, r() * h, size, size * (1 + r())); } c.globalAlpha = 1; }, true); t.repeat.set(rep, rep); return t; };
const shingle = (col) => canvasTex(128, 128, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 14) for (let x = (y / 14) % 2 ? -10 : 0; x < w; x += 20) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(x, y + 11, 20, 3); c.fillStyle = 'rgba(255,255,255,.07)'; c.fillRect(x + 2, y, 16, 4); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(x, y, 2, 14); } }, true);
// ---------- barrio ----------
const G = new THREE.Group(); scene.add(G);
const gr = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), mat(0xffffff, { roughness: 1, map: noiseTex('#5fbf4a', ['#4fa83c', '#6cc858', '#7ad060', '#3f9a34'], 2400, 2, 70) })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; G.add(gr);
const road = new THREE.Mesh(new THREE.PlaneGeometry(14, 500), mat(0xffffff, { roughness: .95, map: (() => { const t = noiseTex('#3a3e48', ['#2e323b', '#464a55', '#52565f'], 3000, 2, 1); t.repeat.set(2, 70); return t; })() })); road.rotation.x = -Math.PI / 2; road.position.y = .03; road.receiveShadow = true; G.add(road);
for (let z = 120; z > -260; z -= 8) box(.4, .02, 3.6, mat(0xf2f2f2), 0, G, 0, .05, z);
const tiles = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#d8d4cc'; c.fillRect(0, 0, w, h); c.strokeStyle = '#b8b4ac'; c.lineWidth = 3; for (let i = 0; i <= w; i += 32) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } }, true); tiles.repeat.set(1.5, 140);
for (const s of [-1, 1]) { const sw = box(4, .3, 500, mat(0xffffff, { map: tiles, roughness: .9 }), .05, G, s * 9, .15, 0); sw.castShadow = false; box(.4, .4, 500, mat(0xbab6ae), .05, G, s * 7, .2, 0); }
const COLS = [0xf6d86a, 0x7ab0e8, 0xf2a6c2, 0xb8e0a0, 0xe8c8f0, 0xf6b87a];
const houses = [];
function house(x, z, ci, face) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = face; G.add(g); const wall = mat(COLS[ci % 6], { roughness: .85 }), wh = mat(0xffffff, { roughness: .6 });
  const sid = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.12)'; for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 2); c.fillStyle = 'rgba(255,255,255,.5)'; for (let y = 2; y < h; y += 8) c.fillRect(0, y, w, 1); }, true); sid.repeat.set(4, 4); wall.map = sid;
  box(16, 11, 12, wall, .1, g, 0, 5.5, 0); box(16.4, .5, 12.4, wh, .05, g, 0, 11, 0); box(16.4, .6, 12.4, mat(0x8a8478), .05, g, 0, .3, 0);
  const rt = shingle(['#8a3a3a', '#3a4a7a', '#5a3a2a'][ci % 3]); rt.repeat.set(5, 3); const roof = new THREE.Mesh(new THREE.CylinderGeometry(.01, 11.6, 6, 4, 1, false, Math.PI / 4), mat(0xffffff, { map: rt, roughness: .7 })); roof.scale.set(1, 1, .8); roof.position.y = 14.1; roof.castShadow = true; g.add(roof);
  box(2, 4, 2, mat(0xffffff, { map: (() => { const t = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#a85a3a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#7a3a24'; for (let y = 0; y < h; y += 8) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } }, true); return t; })() }), .1, g, 4, 15, -2);
  const wins = [];
  for (const [wx, wy] of [[-4.5, 3.8], [4.5, 3.8], [-4.5, 8.4], [4.5, 8.4]]) { const wm = new THREE.MeshStandardMaterial({ color: 0x9fd0f0, roughness: .1, metalness: .2, emissive: 0xffc870, emissiveIntensity: 0 }); box(3, 3, .3, wm, .05, g, wx, wy, 6.1); box(3.6, .3, .6, wh, .05, g, wx, wy - 1.7, 6.2); box(3.6, .3, .4, wh, .05, g, wx, wy + 1.7, 6.2); box(.25, 3, .35, wh, 0, g, wx, wy, 6.2); box(3, .2, .35, wh, 0, g, wx, wy, 6.2); for (const s of [-1, 1]) box(.9, 3.2, .2, mat(0x2f5a9a), .05, g, wx + s * 2.1, wy, 6.15); wins.push(wm); }
  const door = box(2.6, 5, .3, mat([0x8a2a2a, 0x2a5a3a, 0x3a3a7a][ci % 3], { roughness: .4 }), .06, g, 0, 2.5, 6.15); for (const y of [1.3, 3.6]) box(1.9, 1.4, .1, mat([0x7a2424, 0x24502f, 0x2f2f6a][ci % 3]), .04, g, 0, y, 6.32); sphere(.15, mat(0xd9a531, { metalness: .8, roughness: .2 }), g, .9, 2.5, 6.4); box(3.2, .4, .8, wh, .05, g, 0, 5.2, 6.3);
  const lampD = box(.5, .8, .5, mat(0xfff0c0, { emissive: 0xffc870, emissiveIntensity: 0 }), .1, g, 1.9, 4, 6.5);
  box(5, .4, 2.4, mat(0xc8c0b0), .05, g, 0, .2, 7.4); box(4.4, .3, 1.6, mat(0xb8b0a0), .05, g, 0, .5, 7.2); box(2.4, .05, 1.4, mat(0x8a3a3a, { roughness: 1 }), 0, g, 0, .72, 7.4);
  for (let i = -6; i <= 6; i++) if (Math.abs(i) > 1) { box(.3, 1.8, .3, wh, .05, g, i * 1.2, .9, 10.5); const tip = new THREE.Mesh(new THREE.ConeGeometry(.22, .4, 4), wh); tip.position.set(i * 1.2, 2, 10.5); g.add(tip); } for (const y of [.6, 1.4]) { box(5.6, .2, .15, wh, 0, g, -4.7, y, 10.5); box(5.6, .2, .15, wh, 0, g, 4.7, y, 10.5); }
  const mb = new THREE.Group(); mb.position.set(4, 0, 11.5); g.add(mb); cyl(.12, .12, 3, mat(0x5a3a22), 8, mb, 0, 1.5, 0); box(1, .8, 1.4, mat(0x2a5ab8, { metalness: .4, roughness: .3 }), .3, mb, 0, 3.2, 0); box(.1, .5, .3, mat(0xd8323a), 0, mb, .55, 3.6, .3);
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) { sphere(.55, mat(k % 2 ? 0xff7ab0 : 0xffd23f, { roughness: 1 }), g, s * (3 + k * .9), .5, 8.6, 10, 8); sphere(.35, mat(0x3a8a3a, { roughness: 1 }), g, s * (3.4 + k * .9), .35, 8.9, 8, 6); }
  houses.push({ g, wins, door, lampD }); return houses.at(-1); }
for (let i = 0; i < 7; i++) for (const s of [-1, 1]) house(s * 22, 20 - i * 24, i * 2 + (s > 0), s > 0 ? -Math.PI / 2 : Math.PI / 2);
const tree = (x, z, sc = 1) => { cyl(.6 * sc, .8 * sc, 7 * sc, mat(0xffffff, { map: noiseTex('#6a4428', ['#5a3820', '#7a5030'], 600, 2, 1) }), 8, G, x, 3.5 * sc, z); const lm = mat(0x3f9a3a, { roughness: .95 }); for (let k = 0; k < 7; k++) sphere((2.4 + (k % 3) * .5) * sc, k % 2 ? lm : mat(0x4cb04a, { roughness: .95 }), G, x + Math.sin(k * 2.1) * 1.8 * sc, (8 + (k % 3) * 1.4) * sc, z + Math.cos(k * 2.1) * 1.8 * sc, 16, 12); };
for (let i = 0; i < 7; i++) for (const s of [-1, 1]) tree(s * 12.5, 8 - i * 24, 1);
const lamps = []; for (let i = 0; i < 7; i++) for (const s of [-1, 1]) { const x = s * 10.6, z = -4 - i * 24; cyl(.18, .22, 11, mat(0x2a2e3a, { metalness: .6 }), 10, G, x, 5.5, z); box(1.6, .3, .3, mat(0x2a2e3a), .05, G, x - s * .7, 11, z); const bulb = box(.9, .5, .9, mat(0xfff0c0, { emissive: 0xffc870, emissiveIntensity: 0 }), .1, G, x - s * 1.4, 10.7, z); const cone = lightCone(G, x - s * 1.4, 10.5, z, 10.4, 4.2, 0xffcf80, .22); cone.visible = false; const pl = new THREE.PointLight(0xffc070, 0, 30, 2); pl.position.set(x - s * 1.4, 10, z); G.add(pl); lamps.push({ bulb, cone, pl }); }
const tower = rathausturm(G, 0, -220); tower.hands.visible = true; tower.minH.rotation.z = -.4; tower.hourH.rotation.z = -1.2;
// tumbona y pony del vecino
const lounger = new THREE.Group(); G.add(lounger); box(3, .4, 7, mat(0xffffff, { map: checkTex('#f2c23a', '#ffffff', 4) }), .1, lounger, 0, 1.6, 0); for (const [x, z] of [[-1.3, -3], [1.3, -3], [-1.3, 3], [1.3, 3]]) box(.25, 1.6, .25, mat(0xdddddd, { metalness: .5 }), 0, lounger, x, .8, z); const back = box(3, 3.2, .4, mat(0xffffff, { map: checkTex('#f2c23a', '#ffffff', 4) }), .1, lounger, 0, 3, -3.2); back.rotation.x = -.5;
const pony = new THREE.Group(); G.add(pony); { const wm = mat(0xf6f2ff, { roughness: .8 }), pm = mat(0xff8ad0, { roughness: .7 }); box(2.2, 2, 4.6, wm, .5, pony, 0, 3.4, 0); const nk = box(1.2, 2.6, 1.2, wm, .4, pony, 0, 5, 2.2); nk.rotation.x = .4; box(1.3, 1.3, 2.2, wm, .4, pony, 0, 6, 3.2);
  for (const s of [-1, 1]) { sphere(.2, mat(0x111111), pony, s * .66, 6.3, 3.6, 8, 6); const e = new THREE.Mesh(new THREE.ConeGeometry(.22, .6, 6), wm); e.position.set(s * .35, 7, 2.7); pony.add(e); }
  for (let i = 0; i < 6; i++) box(.4, .6, .5, pm, .15, pony, 0, 6.5 - i * .5, 2.4 - i * .55); const tail = box(.5, 2.2, .6, pm, .2, pony, 0, 3.4, -2.6); tail.rotation.x = -.5; box(2.3, .3, 1.8, mat(0x8a3a3a), .05, pony, 0, 4.45, -.2);
  pony.userData.legs = [[-.7, 1.6], [.7, 1.6], [-.7, -1.6], [.7, -1.6]].map(([x, z]) => { const l = new THREE.Group(); l.position.set(x, 2.6, z); pony.add(l); box(.5, 2.6, .5, wm, .15, l, 0, -1.3, 0); box(.55, .4, .6, mat(0x8a6a8a), .1, l, 0, -2.5, 0); return l; }); }
// ---------- interiores ----------
const RX = 1000, NX = 1200, LX = 1400, KX = 1600, MX = 1800, TX = 600;
const room = emilRoom(scene, RX); room.mir.plane.visible = true;
const nur = nursery(scene, NX, 0); nur.book.visible = false; nur.cross.visible = false; nur.mother.root.visible = false; nur.clock.g.visible = false;
const liv = living(scene, LX), kit = kitchen(scene, KX);
const mayorRoom = new THREE.Group(); mayorRoom.position.x = MX; scene.add(mayorRoom); { const g = mayorRoom; const f = new THREE.Mesh(new THREE.PlaneGeometry(34, 26), mat(0xffffff, { map: (() => { const t = checkTex('#6a2a3a', '#7a3446', 8); t.repeat.set(4, 3); return t; })() })); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; g.add(f);
  const wm = mat(0xffffff, { map: (() => { const t = canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#4a2a6a'; c.fillRect(0, 0, w, h); c.fillStyle = '#d9a531'; for (let y = 8; y < h; y += 16) for (let x = 8; x < w; x += 16) { c.beginPath(); c.arc(x, y, 2.5, 0, 7); c.fill(); } }, true); t.repeat.set(10, 5); return t; })() });
  box(34, 22, .6, wm, 0, g, 0, 11, -13); for (const s of [-1, 1]) box(.6, 22, 26, wm, 0, g, s * 17, 11, 0);
  const bed = new THREE.Group(); bed.position.set(0, 0, -5); g.add(bed); const gold = mat(0xd9a531, { metalness: .8, roughness: .25 });
  box(11, 2.4, 15, mat(0x5a2a1a), .2, bed, 0, 1.2, 0); box(10.6, 1.6, 14.4, mat(0xffffff), .5, bed, 0, 3, 0); box(10.8, 1.2, 9, mat(0xc8202a, { roughness: .5 }), .5, bed, 0, 3.8, 2.5); box(11.4, 9, 1, mat(0x5a2a1a), .3, bed, 0, 5.5, -7.4);
  for (const s of [-1, 1]) { cyl(.35, .35, 14, gold, 12, bed, s * 5.4, 7, -7); sphere(.7, gold, bed, s * 5.4, 14.2, -7); } box(12, .6, 1.2, gold, .2, bed, 0, 10, -7.4);
  for (let i = 0; i < 4; i++) box(2.6, 1, 2, mat(0xffffff), .45, bed, -3.9 + i * 2.6, 4.2, -5.4);
  const por = textPlane(6, 7.5, 240, 300, (c, w, h) => { c.fillStyle = '#2a1a3a'; c.fillRect(0, 0, w, h); c.fillStyle = '#f0c8a8'; c.fillRect(80, 70, 80, 90); c.fillStyle = '#c8202a'; c.fillRect(60, 160, 120, 140); c.fillStyle = '#d9a531'; c.fillRect(60, 170, 120, 16); c.strokeStyle = '#d9a531'; c.lineWidth = 12; c.strokeRect(6, 6, w - 12, h - 12); }); por.position.set(10, 13, -12.6); g.add(por);
  const L = new THREE.PointLight(0xffd8a0, 500, 60, 2); L.position.set(0, 18, 4); g.add(L); }
// torre: sala de los sueños
const T = new THREE.Group(); T.position.x = TX; scene.add(T); const wood = mat(0xffffff, { map: noiseTex('#7a4a2a', ['#6a3e22', '#8a5a34'], 800, 2, 2), roughness: .7 });
const tfl = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), mat(0xffffff, { map: (() => { const t = noiseTex('#5a3a22', ['#4a2e1a', '#6a4428'], 2000, 3, 4); return t; })(), roughness: .8 })); tfl.rotation.x = -Math.PI / 2; tfl.receiveShadow = true; T.add(tfl);
const towerOrbs = [];
for (const [x, z, r] of [[0, -14, 0], [-14, -4, Math.PI / 2], [14, -4, -Math.PI / 2], [0, 14, Math.PI]]) { const w = new THREE.Group(); w.position.set(x, 0, z); w.rotation.y = r; T.add(w); box(30, 26, .6, mat(0xffffff, { map: noiseTex('#4a3428', ['#3a2a20', '#5a4030'], 900, 4, 3) }), 0, w, 0, 13, -.6);
  for (let y = 0; y < 5; y++) { box(28, .4, 2.4, wood, .05, w, 0, 1 + y * 4.6, .8); for (let k = 0; k < 9; k++) { const sx = -12 + k * 3; const sk = sphere(1.05, mat(0xffffff, { map: noiseTex('#c8a46a', ['#b08a50', '#d8b47a'], 500, 2, 1), roughness: 1 }), w, sx, 2.4 + y * 4.6, .9, 14, 10); sk.scale.set(1, 1.15, .8);
    cyl(.2, .35, .4, mat(0xa07a40), 8, w, sx, 3.6 + y * 4.6, .9); const o = dreamOrb(w, .42, [[1, .85, .35], [1, .55, .8], [.5, .95, .7], [.6, .7, 1]][(k + y) % 4], [.5, .4, 1], k * 3 + y); o.position.set(sx, 3.9 + y * 4.6, 1.2); towerOrbs.push(o); } } }
const gear = (x, y, z, r) => { const g = new THREE.Group(); g.position.set(x, y, z); T.add(g); const m = mat(0xc89a3a, { metalness: .8, roughness: .3 }); const d = cyl(r, r, .5, m, 32, g, 0, 0, 0); d.rotation.x = Math.PI / 2; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; const t = box(.5, .6, .5, m, .05, g, Math.cos(a) * (r + .25), Math.sin(a) * (r + .25), 0); t.rotation.z = a; } return g; };
const gears = [gear(-6, 24, -13, 3), gear(3, 26, -13, 2)];
const tl = new THREE.PointLight(0xffc070, 600, 60, 2); tl.position.set(0, 14, 4); T.add(tl); const tbeam = lightCone(T, 0, 30, -2, 30, 8, 0xffd8a0, .18);
const SETS = { G, room: room.g, nur: nur.g, liv: liv.g, kit: kit.g, mayor: mayorRoom, T };

// ---------- reparto ----------
const ben = makeBen(scene), grey = makeGrey(scene);
const neigh = makeFolk(scene, 1), mama = makeFolk(scene, 2), papa = makeFolk(scene, 4), sis = makeFolk(scene, 5, { scale: .66, headScale: 1.1 }), opa = makeFolk(scene, 3, { face: { browColor: '#e8e8e8' } }), mayor = makeFolk(scene, 0);
const extras = [0, 1, 2, 3].map(i => makeFolk(scene, i + 6));
{ const sash = box(.4, 2.6, .06, mat(0xd9a531, { metalness: .6, roughness: .3 }), .02, mayor.spine, 0, 1.1, .56); sash.rotation.z = .6; box(.6, .6, .1, mat(0xd9a531, { metalness: .8 }), .1, mayor.spine, -.4, .5, .6);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(.6, 1.6, 20), mat(0x3a8ad8, { map: checkTex('#3a8ad8', '#ffd23f', 4) })); cap.position.y = 1.9; opa.head.add(cap); opa.props.cap = cap; }
const POOL = [ben, grey, neigh, mama, papa, sis, opa, mayor, ...extras];
// atrezo: billetes, monedas, sueños, tarta, tortitas, ondas en la puerta, globos
const bills = []; const billM = mat(0xffffff, { map: canvasTex(64, 32, (c, w, h) => { c.fillStyle = '#7ad07a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a7a3a'; c.lineWidth = 3; c.strokeRect(3, 3, w - 6, h - 6); c.fillStyle = '#2a7a3a'; c.font = 'bold 18px sans-serif'; c.textAlign = 'center'; c.fillText('€', w / 2, 23); }), side: THREE.DoubleSide });
for (let i = 0; i < 40; i++) { const b = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .7), billM); b.castShadow = true; scene.add(b); bills.push(b); }
const coins = []; for (let i = 0; i < 12; i++) { const c = cyl(.35, .35, .1, mat(0xf2c23a, { metalness: .8, roughness: .25, emissive: 0x6a4a00, emissiveIntensity: .3 }), 20, scene); c.rotation.x = Math.PI / 2; coins.push(c); }
const orbs = [0, 1, 2, 3, 4, 5].map(i => dreamOrb(scene, .6, [[1, .85, .35], [1, .5, .8], [.5, .95, .7], [.6, .7, 1], [1, .7, .4], [.8, .5, 1]][i], [.4, .6, 1], i * 7));
const cake = new THREE.Group(); scene.add(cake); cyl(2, 2, 1.4, mat(0xfff2f0), 32, cake, 0, .7, 0); cyl(1.5, 1.5, 1.2, mat(0xff9ac0), 32, cake, 0, 2, 0); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; cyl(.08, .08, .8, mat(0x6ab0ff), 6, cake, Math.cos(a), 3, Math.sin(a)); sphere(.12, mat(0xffd27a, { emissive: 0xffa030, emissiveIntensity: 3 }), cake, Math.cos(a), 3.5, Math.sin(a), 8, 6); }
const balloons = []; for (let i = 0; i < 5; i++) { const g = new THREE.Group(); scene.add(g); const b = sphere(1, mat([0xff4a6a, 0x4ab0ff, 0xffd23f, 0x6ad06a, 0xb86aff][i], { roughness: .2 }), g, 0, 0, 0, 16, 12); b.scale.y = 1.2; cyl(.02, .02, 5, mat(0xffffff), 4, g, 0, -3.5, 0); balloons.push(g); }
const pancakes = new THREE.Group(); scene.add(pancakes); cyl(1.4, 1.3, .12, mat(0xffffff), 28, pancakes, 0, 0, 0); for (let i = 0; i < 4; i++) cyl(1.05, 1.05, .25, mat(0xe0a050, { roughness: .6 }), 24, pancakes, 0, .2 + i * .26, 0); cyl(.5, .5, .1, mat(0xf6e080), 12, pancakes, 0, 1.25, 0);
const ripples = []; for (let i = 0; i < 4; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1, .05, 8, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color(.6, 1.6, 2.4), toneMapped: false, transparent: true })); scene.add(r); ripples.push(r); }
const PROPS = [...bills, ...coins, ...orbs, cake, ...balloons, pancakes, ...ripples, lounger, pony];

// ---------- utilidades ----------
const use = (...n) => { for (const k of n) SETS[k].visible = true; };
function day(k) { const u = sky.sky.material.uniforms; u.top.value.setRGB(.01 + .19 * k, .02 + .48 * k, .1 + .85 * k); u.mid.value.setRGB(.05 + .51 * k, .07 + .71 * k, .25 + .75 * k); u.hor.value.setRGB(.2 + .7 * k, .2 + .75 * k, .45 + .55 * k); sky.moon.material.opacity = 1 - k; sky.moon.position.set(-200, 380, -1400);
  hemi.intensity = .12 + 1.48 * k; hemi.color.setRGB(.5 + .3 * k, .55 + .33 * k, 1); sun.intensity = .35 + 2.25 * k; sun.color.setRGB(.6 + .4 * k, .7 + .24 * k, 1 - .15 * k); rim.intensity = 2.2 - .8 * k; scene.fog.color.setRGB(.05 + .7 * k, .07 + .78 * k, .18 + .76 * k); scene.fog.density = .006 - .002 * k;
  lamps.forEach(l => { l.bulb.material.emissiveIntensity = (1 - k) * 1.6; l.cone.visible = k < .5; l.pl.intensity = (1 - k) * 110; }); houses.forEach(h => h.lampD.material.emissiveIntensity = (1 - k) * 2.5); bloom.strength = .35 + (1 - k) * .45; }
function hideAll() {
  for (const c of POOL) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.faceMat.color.setRGB(1, 1, 1); }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); }
  for (const k in SETS) SETS[k].visible = false; houses.forEach(h => h.wins.forEach(w => w.emissiveIntensity = 0));
  grey.props.sack.visible = true; opa.props.cap.visible = false; coins.forEach(c => c.rotation.set(Math.PI / 2, 0, 0));
  grade.uniforms.sepia.value = 0; grade.uniforms.vig.value = .32; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.25; tbeam.visible = true; day(1); ao.enabled = true;
}
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
function face(ch, f, T) { const s = { ...f }; if (blinking(T, ch.seed) && !['closed', 'happy'].includes(s.eyes)) s.eyes = 'closed'; ch.setFace(s); }
function kp(ch, lt, keys, extra = {}) { let p = keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const [t0, a] = keys[i], [t1, b] = keys[i + 1]; if (lt >= t0 && lt <= t1) { p = mixPose(a, b, easeInOut((lt - t0) / (t1 - t0))); break; } if (lt > t1) p = b; } applyPose(ch, { ...p, ...extra }); }
function cam(p, t, fov = 46) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 46, b[6] ?? 46, q)); }
const punch = (lt, at, amt = .3, d = .18) => lt < at ? 1 : 1 - amt * easeOut((lt - at) / d);
const hp = ch => ch.head.getWorldPosition(V(0, 0, 0));
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .82, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + dy + .4, h.z + fz * d - fx * side], [h.x, h.y + .2, h.z], fov); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const talk = (ch, T, a, b, f) => face(ch, { ...f, mouth: lip(T, spoken(a, b)) || f.mouth }, T);
const proj = v => { const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
// caminar avanzando: posición = inicio + dirección * velocidad * t
function walkTo(ch, x0, z0, ry, T, lt, speed = 3.2, run = false) { const d = speed * lt; put(ch, x0 + Math.sin(ry) * d, 0, z0 + Math.cos(ry) * d, ry); applyPose(ch, run ? runPose(T, 1.1) : walkPose(T, .8)); }
const sleeper = (ch, x, y, z, T, ry = 0) => { put(ch, x, y, z, ry); ch.root.rotation.x = -Math.PI / 2; applyPose(ch, { aLz: .15, aRz: .15, headX: Math.sin(T * 1.5) * .03 }); ch.setFace({ eyes: 'closed', mouth: 'o', blush: .4 }); };
const money = (n, cx, cy, cz, T, spread = 6, rate = 1) => { for (let i = 0; i < n; i++) { const b = bills[i]; b.visible = true; const ph = ((T * .6 * rate + i * .137) % 1); b.position.set(cx + Math.sin(i * 2.3) * spread * .5, cy + 8 - ph * 9, cz + Math.cos(i * 1.7) * spread * .5); b.rotation.set(T * 2 + i, i * .7, T * 1.3 + i); } };
const BEN_H = () => houses[2];   // casa de Ben (lado izq., 2ª)
const night = () => { day(0); };

// ---------- capa 2D ----------
const BAD = []; const badge = (kind, text, x, y, k, a = 1) => BAD.push({ kind, text, x, y, s: spring(k * 1.6), a });
function drawBadge(b) {
  if (b.s <= .01 || b.a <= 0) return; const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s, b.s); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'big' || b.kind === 'red' || b.kind === 'green') { c.font = `700 104px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > W * .86) { const k = W * .86 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#5a0010' : b.kind === 'green' ? '#0a3a1a' : '#1d2238'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50);
    if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#9aff9a'); g.addColorStop(1, '#22c46a'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 48px ${FONT}`; const w = c.measureText(b.text).width + 56; c.fillStyle = '#1d2238'; c.beginPath(); c.roundRect(-w / 2, -38, w, 76, 38); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#ffd23f'; c.fillText(b.text, 0, 3); }
  else if (b.kind === 'coin') { c.font = `700 52px ${FONT}`; const w = c.measureText(b.text).width + 110; c.shadowColor = 'rgba(255,240,120,.9)'; c.shadowBlur = 24; c.fillStyle = '#22c46a'; c.beginPath(); c.roundRect(-w / 2, -38, w, 76, 38); c.fill(); c.shadowBlur = 0; c.lineWidth = 5; c.strokeStyle = '#fff'; c.stroke();
    const cg = c.createRadialGradient(-w / 2 + 34, -10, 4, -w / 2 + 40, 0, 40); cg.addColorStop(0, '#fffbb0'); cg.addColorStop(1, '#f2b800'); c.fillStyle = cg; c.beginPath(); c.arc(-w / 2 + 38, 0, 30, 0, 7); c.fill(); c.fillStyle = '#c88a00'; c.font = `700 36px ${FONT}`; c.fillText('€', -w / 2 + 38, 2); c.fillStyle = '#fff'; c.font = `700 52px ${FONT}`; c.fillText(b.text, 24, 3); }
  else if (b.kind === 'zzz') { c.font = `700 70px ${FONT}`; c.lineWidth = 12; c.strokeStyle = '#1d2238'; c.strokeText(b.text, 0, 0); c.fillStyle = '#bfe3ff'; c.fillText(b.text, 0, 0); }
  c.restore(); }
const KEY = /^(Stadt|Stunde|Schlaf|Euro|Babys|Millionäre|Opa|Geburtstag|Bürgermeister|2019|Ben|schlafen|Minute|nie|ärmste|Null|achtzehn|Pony|Nickerchen|dunkel|Licht|meins|gesehen|grauen|Sack|Wasser|Lichter|Träume|reicher|leerer|singen|Witze|Pfannkuchen|warum|gefolgt|Uhrturm|Tausende|Traum|kalte|Schulter|Endlich|Jahren)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 10; c.shadowOffsetY = 4; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const BR = { x: RX + 9, z: -4 };   // cama del cuarto de Ben
const coinPops = (L, T0 = 0, n = 4, every = .35) => { for (let i = 0; i < n; i++) { const t = L.lt - T0 - i * every; if (t > 0 && t < .8) badge('coin', '+1', W * (.32 + (i % 2) * .36), H * (.3 - t * .12), t * 2, clamp(1.4 - t * 1.6)); } };
// 1 golpe de zoom: durmiente que cobra por dormir
shot(0, 'C', null, L => { use('room'); sleeper(extras[0], BR.x, 3.4, BR.z + 2.6, L.T); const k = easeOut(clamp(L.lt / .35));
  cam([lerp(RX - 6, RX + 4, k), lerp(16, 9, k), lerp(14, 5, k)], [BR.x, 3.6, BR.z], lerp(62, 44, k)); coinPops(L, .3, 4, .3); for (let i = 0; i < 4; i++) { const c = coins[i], t = L.lt - .3 - i * .3; c.visible = t > 0; c.position.set(BR.x - 1.5 + i, 4.5 + Math.max(0, 3 - t * 8), BR.z + 2); c.rotation.z = t * 8; }
  badge('zzz', 'Zzz', W * .62, H * .26, L.lt - .2); sh(V(RX, 0, -4), 20); }, [[0, 'zoom_fast', 1], [.35, 'impact', .7], [.4, 'coin_flip', .5], [.7, 'coins', .4], [1.0, 'cash', .5]]);
// 2 cada hora de sueño, un euro (los billetes llueven sobre la cama)
shot(1.60, 'Z', 'slowv', L => { use('room'); sleeper(extras[0], BR.x, 3.4, BR.z + 2.6, L.T); money(26, BR.x, 3, BR.z + 1, L.T, 8); cm([BR.x - 5, 9, BR.z + 9, BR.x, 3.5, BR.z, 48], [BR.x - 3.6, 7.4, BR.z + 6.6, BR.x, 3.5, BR.z, 42], L.k, easeIn); badge('coin', '1 € / STUNDE', W / 2, H * .15, L.lt - .2); sh(V(RX, 0, -4), 20); }, [[0, 'money_rain', .6], [.6, 'coins', .4]]);
// 3 por eso los bebés son millonarios
shot(3.17, 'S', null, L => { use('nur'); nur.mobile.rotation.y = L.T * .6; money(30, NX - 2, 4, -4, L.T, 7, 1.4); nur.babyFace.material.map = nur.babyFace.material.map; cm([NX - 1, 9.5, 8, NX - 3.8, 3.6, -4, 46], [NX - 1.4, 9, 6.8, NX - 3.8, 3.6, -4, 44], L.k); badge('big', '1.000.000 €', W / 2, H * .15, L.lt - .3); }, [[0, 'baby_gasp', .4], [.3, 'cash', .7], [.6, 'money_rain', .5]]);
// 4 el abuelo durmió su propio cumpleaños
shot(5.08, 'W', null, L => { use('liv'); cake.visible = true; cake.position.set(LX - 2, 0, 1); cake.scale.setScalar(.8); balloons.forEach((b, i) => { b.visible = true; b.position.set(LX - 8 + i * 4, 12 + Math.sin(L.T * 2 + i) * .4, -6 + (i % 2) * 3); });
  put(opa, LX + 6, 1.4, -3.2, -.3); opa.props.cap.visible = true; applyPose(opa, { crouch: 1, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, headX: .45, headZ: .2, aLz: .2, aRz: .2 }); face(opa, { eyes: 'closed', mouth: 'o', blush: .3 }, 99);
  [extras[1], extras[2], sis].forEach((c, i) => { put(c, LX - 4 + i * 3.5, 0, 4, .4 - i * .3); applyPose(c, { aLz: 2.4, aRz: 2.4, aLe: .4 + Math.sin(L.T * 9 + i) * .3 }); face(c, { eyes: 'happy', mouth: 'grin' }, 99); });
  cm([LX - 2, 7, 15, LX + 1, 4.5, -1, 50], [LX - 2.4, 7, 13.5, LX + 1, 4.5, -1, 48], L.k); badge('tag', 'ALLES GUTE, OPA!', W / 2, H * .13, L.lt - .2); }, [[0, 'party_horn', .6], [.3, 'cheer', .5], [.9, 'snore', .5]]);
shot(6.35, 'C', null, L => { use('liv'); put(opa, LX + 6, 1.4, -3.2, -.3); opa.props.cap.visible = true; applyPose(opa, { crouch: 1, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, headX: .45, headZ: .2 + Math.sin(L.T * 1.6) * .05 }); face(opa, { eyes: 'closed', mouth: 'o', blush: .3 }, 99);
  onFace(opa, 5.5, .8, 1.2, 42, L.k, 4.6); badge('zzz', 'Zzz', W * .66, H * .22, (L.lt % .9) * 1.5); }, [[0, 'snore', .7]]);
// 5 el alcalde duerme desde 2019
shot(7.61, 'S', null, L => { use('mayor'); sleeper(mayor, MX, 4.7, -8.2, L.T); money(18, MX, 4, -5, L.T, 9, .7); cm([MX + 6, 12, 14, MX, 4, -5, 50], [MX + 5, 11, 12.5, MX, 4, -5, 48], L.k); badge('tag', 'BÜRGERMEISTER', W / 2, H * .12, L.lt - .1); }, [[0, 'snore', .6], [.4, 'clock_tick', .4]]);
shot(8.90, 'Z', null, L => { use('mayor'); sleeper(mayor, MX, 4.7, -8.2, L.T); cm([MX + 2, 8, 7, MX, 4.6, -7, 44], [MX + 1.6, 7.6, 5.5, MX, 4.6, -7, 42], L.k); badge('big', 'SEIT 2019', W / 2, H * .15, L.lt - .2); badge('zzz', 'Zzz', W * .7, H * .3, L.lt - .5); }, [[.2, 'impact_soft', .6], [.5, 'snore', .6]]);
// 6 soy Ben
shot(10.18, 'W', null, L => { use('room'); put(ben, RX - 1, 0, 1, .1); kp(ben, L.lt, [[0, {}], [.25, { aRz: 2.6, aRe: .3 }]], { aRe: .3 + Math.abs(Math.sin(L.T * 9)) * .4 }); face(ben, { eyes: 'open', mouth: 'smile', bags: .9 }, L.T); onFace(ben, 8.5, .9, 1, 46, L.k, 7); badge('tag', 'BEN', W / 2, H * .15, L.lt - .1); }, [[0, 'pop', .6]]);
// 7 y no puedo dormir
shot(10.96, 'C', null, L => { use('room'); day(.15); room.lamp.intensity = 80; room.lamp.color.setRGB(.5, .6, 1); put(ben, BR.x, 3.4, BR.z + 2.6, 0); ben.root.rotation.x = -Math.PI / 2; applyPose(ben, { aLz: .2, aRz: .2 }); face(ben, { eyes: 'wide', mouth: 'flat', bags: 1, look: [Math.sin(L.T * 2) * .6, -.3] }, 99);
  const h = hp(ben); cm([h.x + .5, h.y + 6, h.z + 2.6, h.x, h.y, h.z, 44], [h.x + .4, h.y + 4.6, h.z + 2, h.x, h.y, h.z, 40], L.k); }, [[0, 'clock_tick', .6], [.6, 'clock_tick', .6]]);
// 8 ni un minuto, nunca
shot(12.08, 'R', null, L => { use('room'); day(.15); room.lamp.intensity = 80; room.lamp.color.setRGB(.5, .6, 1); room.digits.forEach(d => d.visible = false); room.digits[Math.floor(L.T * 6) % 3].visible = true; const p = room.digits[0].getWorldPosition(V(0, 0, 0));
  put(ben, BR.x - 1, 3.4, BR.z + 2.6, 0); ben.root.rotation.x = -Math.PI / 2; face(ben, { eyes: 'wide', mouth: 'frown', bags: 1 }, 99);
  cm([p.x + 3, p.y + 2, p.z + 6, p.x + 1, p.y, p.z, 44], [p.x + 2.4, p.y + 1.6, p.z + 5, p.x + 1, p.y, p.z, 40], L.k); badge('red', '0 MIN.', W / 2, H * .15, L.lt - .4); }, [[0, 'clock_spin', .6], [.5, 'impact_soft', .5]]);
// 9 por eso soy el niño más pobre
shot(13.94, 'S', null, L => { use('G'); walkTo(ben, -2, -30, Math.PI * .95, L.T, L.lt, 1.6); applyPose(ben, { ...walkPose(L.T, .6, .8), aLz: .3, aRz: .3 }); face(ben, { eyes: 'half', mouth: 'frown', bags: 1, brows: -.6 }, L.T);
  extras.forEach((e, i) => { walkTo(e, (i % 2 ? 4 : -6), -38 - i * 6, i % 2 ? Math.PI : 0, L.T + i, L.lt, 2.4); face(e, { eyes: 'happy', mouth: 'grin' }, 99); });
  const h = hp(ben); cm([h.x + 3, 5, h.z + 9, h.x, 4.2, h.z, 48], [h.x + 2.4, 5, h.z + 8, h.x, 4.2, h.z, 46], L.k); badge('tag', 'DER ÄRMSTE', W / 2, H * .13, L.lt - .3); sh(V(0, 0, -34), 30); }, [[0, 'steps', .5], [.8, 'sigh_kid', .6], [1.4, 'coins', .3]]);
// 10 cero euros
shot(16.05, 'C', null, L => { use('G'); put(ben, -2, 0, -30, .2); applyPose(ben, { aLx: .7, aRx: .7, aLe: 1, aRe: 1, aLz: .4, aRz: .4 }); face(ben, { eyes: 'wide', mouth: 'teeth', bags: 1, brows: -.8 }, L.T); onFace(ben, 6, .6, 0, 42 * punch(L.lt, .02, .2), 0); badge('red', '0 €', W / 2, H * .15, L.lt * 2); sh(V(0, 0, -30), 20); }, [[0, 'impact', .7], [.1, 'sad_tone', .5]]);
// 11 el vecino duerme 18 horas
shot(16.80, 'W', null, L => { use('G'); lounger.visible = true; lounger.position.set(-15, .3, -46); lounger.rotation.y = Math.PI / 2; put(neigh, -15.4, 2.6, -46.5, Math.PI / 2); neigh.root.rotation.z = 0; neigh.root.rotation.x = 0; applyPose(neigh, { crouch: .2, lean: -.9, lLx: 1.4, lRx: 1.4, lLk: .1, aLz: .3, aRz: .3, headX: -.2 }); face(neigh, { eyes: 'closed', mouth: 'o' }, 99);
  cm([-6, 6, -40, -15, 3, -46, 48], [-7, 6, -41, -15, 3, -46, 46], L.k); badge('big', '18 STUNDEN', W / 2, H * .15, L.lt - 1.1); badge('zzz', 'Zzz', W * .6, H * .28, L.lt - .4); sh(V(-15, 0, -46), 20); }, [[0, 'snore', .6], [1.1, 'impact_soft', .5], [1.4, 'birds', .4]]);
// 12 hasta duerme la siesta en su pony
shot(19.28, 'S', null, L => { use('G'); pony.visible = true; const z = -50 + L.lt * 3; pony.position.set(2, 0, z); pony.rotation.y = 0; const s = Math.sin(L.T * 6); pony.userData.legs.forEach((l, i) => l.rotation.x = (i % 3 ? s : -s) * .5); pony.position.y = Math.abs(s) * .2;
  put(neigh, 2, 4.6 + Math.abs(s) * .2, z - .2, 0); applyPose(neigh, { crouch: .6, lLx: 1.2, lRx: 1.2, lLk: .5, lRk: .5, lLz: 0, headX: .7, lean: .4, aLz: .2, aRz: .2 }); face(neigh, { eyes: 'closed', mouth: 'o' }, 99);
  cm([9, 6, z + 10, 2, 5, z, 46], [8.4, 6, z + 10, 2, 5, z + 1, 44], L.k); badge('tag', 'NICKERCHEN', W / 2, H * .13, L.lt - .2); badge('zzz', 'Zzz', W * .56, H * .23, L.lt - .3); sh(V(2, 0, z), 20); }, [[0, 'hooves', .7], [.6, 'snore', .5], [1.2, 'whinny', .4]]);
// 13 cada noche el pueblo entero se oscurece
shot(21.18, 'Z', null, L => { use('G'); const k = 1 - easeInOut(clamp(L.lt / 1.6)); day(k); houses.forEach((h, i) => h.wins.forEach((w, j) => w.emissiveIntensity = (1 - k) * 2.6 * ((i + j) % 3 ? 1 : 0))); cm([0, 50, 30, 0, 0, -50, 52], [0, 46, 22, 0, 0, -50, 50], L.k); sh(V(0, 0, -30), 70); }, [[0, 'wind', .5], [.8, 'crickets', .4]]);
// 14 se apagan todas las luces…
shot(23.17, 'C', null, L => { use('G'); night(); houses.forEach((h, i) => h.wins.forEach((w, j) => { const off = .15 + ((i * 4 + j) % 11) * .09; w.emissiveIntensity = (L.lt < off ? 2.6 : 0) * ((i + j) % 3 ? 1 : 0); })); BEN_H().wins[2].emissiveIntensity = 1.8;
  cm([8, 8, 6, -16, 7, -20, 54], [7.4, 8, 5, -16, 7, -20, 52], L.k); }, [[.15, 'switch', .5], [.4, 'switch', .5], [.7, 'switch', .5], [1.0, 'switch', .4]]);
// 15 …menos la mía
shot(24.38, 'W', null, L => { use('G'); night(); const H2 = BEN_H(); H2.wins[2].emissiveIntensity = 1.8; bloom.strength = .5; const wc = H2.g.localToWorld(V(-4.5, 8.4, 6.4)); cm([wc.x + 20, wc.y - 4, wc.z + 4, wc.x, wc.y - 2, wc.z, 46], [wc.x + 17, wc.y - 3.6, wc.z + 3.5, wc.x, wc.y - 2, wc.z, 44], L.k); badge('tag', 'NUR MEINS', W / 2, H * .15, L.lt - .1); }, [[0, 'ding_soft', .6]]);
// 16 por eso lo vi — ZOOM LENTO a Ben en la ventana
shot(25.00, 'Z', 'slow', L => { use('room'); day(0); room.lamp.intensity = 120; room.lamp.color.setRGB(1, .8, .55); put(ben, RX + 12.4, 0, 4.4, 2.8); applyPose(ben, { aLx: 1.3, aLe: .5, aRx: .4 }); face(ben, { eyes: L.lt > 1 ? 'wide' : 'open', mouth: L.lt > 1 ? 'o' : 'flat', bags: 1, look: [.6, 0] }, 99);
  onFace(ben, 6, .4, -1.6, 44, L.k, 3.6); }, []);
// 17 un hombre gris con un saco bajando por nuestra calle
shot(26.85, 'S', null, L => { use('G'); night(); BEN_H().wins[2].emissiveIntensity = 3.5; walkTo(grey, 1.5, -40, 0, L.T, L.lt, 2.4); face(grey, { eyes: 'half', mouth: 'flat' }, L.T); const g = grey.root.position;
  cm([g.x + 4, 1.4, g.z + 14, g.x, 6, g.z, 50], [g.x + 3.4, 1.4, g.z + 12, g.x, 6.4, g.z, 48], L.k); sh(V(g.x, 0, g.z), 25); }, [[0, 'steps_heavy', .6], [.4, 'creepy_ting', .4]]);
shot(28.30, 'C', null, L => { use('G'); night(); walkTo(grey, 1.5, -36.5, 0, L.T, L.lt, 2.4); face(grey, { eyes: 'half', mouth: 'smirk' }, L.T); const sk = grey.props.sack.getWorldPosition(V(0, 0, 0)); cm([sk.x - 4, sk.y + 1, sk.z + 4, sk.x, sk.y - 1, sk.z, 44], [sk.x - 3.4, sk.y + 1, sk.z + 3.4, sk.x, sk.y - 1, sk.z, 42], L.k); sh(V(1.5, 0, -34), 20); }, [[0, 'cloth', .6], [.5, 'steps_heavy', .5]]);
// 18 metía la mano en la puerta como si fuera agua
const doorOf = (i) => houses[i].g.localToWorld(V(0, 2.5, 6.35));
shot(29.82, 'W', null, L => { use('G'); night(); const dp = doorOf(3); put(grey, dp.x - 3.2, 0, dp.z, Math.PI / 2); const k = easeInOut(clamp(L.lt / 1.2)); applyPose(grey, { aRx: lerp(.3, 1.6, k), aRe: .2, lean: .1 * k }); face(grey, { eyes: 'half', mouth: 'flat' }, L.T);
  ripples.forEach((r, i) => { const t = ((L.lt * 1.4 + i * .25) % 1); r.visible = k > .8; r.position.set(dp.x + .25, 4.4, dp.z); r.rotation.y = Math.PI / 2; r.scale.setScalar(.3 + t * 1.6); r.material.opacity = 1 - t; });
  cm([dp.x - 9, 5.5, dp.z - 8, dp.x - 1.5, 4.6, dp.z, 46], [dp.x - 8, 5.5, dp.z - 7, dp.x - 1.5, 4.6, dp.z, 44], L.k); sh(dp, 15); }, [[.5, 'water_bloop', .8], [1.0, 'water_bloop', .6]]);
shot(31.50, 'C', null, L => { use('G'); night(); const dp = doorOf(3); put(grey, dp.x - 3.2, 0, dp.z, Math.PI / 2); applyPose(grey, { aRx: 1.6, aRe: .2, lean: .15 }); face(grey, { eyes: 'half', mouth: 'smirk' }, L.T);
  ripples.forEach((r, i) => { const t = ((L.lt * 1.4 + i * .25) % 1); r.visible = true; r.position.set(dp.x + .25, 4.4, dp.z); r.rotation.y = Math.PI / 2; r.scale.setScalar(.3 + t * 1.6); r.material.opacity = 1 - t; });
  cm([dp.x - 2, 5, dp.z + 6, dp.x, 4.4, dp.z, 42], [dp.x - 1.6, 5, dp.z + 5, dp.x, 4.4, dp.z, 40], L.k); bloom.strength = .8; }, [[0, 'water_bloop', .7], [.8, 'hum_low', .4]]);
// 19 y sacaba pequeñas luces — ZOOM LENTO (riser hasta "Träume")
shot(33.23, 'Z', 'slow', L => { use('G'); night(); const dp = doorOf(3); put(grey, dp.x - 3.2, 0, dp.z, Math.PI / 2); const k = easeOut(clamp(L.lt / 1.2)); applyPose(grey, { aRx: lerp(1.6, 1.2, k), aRe: lerp(.2, .9, k), lean: .05 }); face(grey, { eyes: 'half', mouth: 'grin' }, 99);
  const o = orbs[0]; o.visible = true; o.scale.setScalar(.4 + k * 1.1); o.position.copy(grey.aR.hand.getWorldPosition(V(0, 0, 0))).add(V(.4, -.1, 0)); o.userData.update(L.T);
  cm([dp.x - 5, 6, dp.z + 7, dp.x - 1.5, 5, dp.z, 46], [dp.x - 3.6, 5.6, dp.z + 4.6, dp.x - 1.5, 5, dp.z, 38], L.k, easeIn); bloom.strength = .9; }, [[.2, 'sparkle', .6]]);
// 20 Sueños
shot(35.02, 'C', null, L => { use('G'); night(); const o = orbs[1]; o.visible = true; o.scale.setScalar(1.5); o.position.set(6, 6, -30); o.userData.update(L.T); cam([6, 6.4, -23.5], [6, 6.6, -30], 40 * punch(L.lt, .02, .2)); bloom.strength = .45; badge('big', 'TRÄUME', W / 2, H * .17, L.lt * 2); }, [[0, 'magic_hit', .8]]);
// 21 recogía los sueños de todo el pueblo
shot(35.62, 'R', null, L => { use('G'); night(); houses.forEach(h => h.wins.forEach(w => w.emissiveIntensity = 0)); BEN_H().wins[2].emissiveIntensity = 3.5; put(grey, 0, 0, -34, 0); applyPose(grey, { aLx: .5 }); face(grey, { eyes: 'half', mouth: 'grin' }, 99);
  orbs.forEach((o, i) => { const hi = [1, 3, 5, 6, 8, 10][i]; const st = houses[hi].g.localToWorld(V(0, 4, 6.4)); const t = clamp((L.lt * .9 + i * .12) % 1.2); const sk = grey.props.sack.getWorldPosition(V(0, 0, 0)); o.visible = true; o.scale.setScalar(.7); o.position.copy(st.lerp(sk, easeInOut(t))).add(V(0, Math.sin(t * Math.PI) * 6, 0)); o.userData.update(L.T + i); });
  cm([0, 38, 18, 0, 0, -36, 52], [0, 34, 14, 0, 0, -36, 50], L.k); bloom.strength = .9; sh(V(0, 0, -36), 50); }, [[0, 'whoosh_soft', .5], [.4, 'sparkle', .5], [1.2, 'sparkle', .5]]);
// 22 a la mañana siguiente nadie recordaba lo que había soñado
shot(37.84, 'F', null, L => { use('kit'); [[papa, -3.5, -1.6, 0], [mama, 3.5, -1.6, 0], [sis, -3.5, 4.6, Math.PI]].forEach(([c, x, z, r]) => { put(c, KX + x, 3, z + 1, r); applyPose(c, { crouch: 1, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aLx: 1.2, aLe: 1.6, headZ: .15 }); face(c, { eyes: 'open', mouth: 'flat', brows: -.4, look: [0, -.4] }, L.T); });
  pancakes.visible = true; pancakes.position.set(KX - 3.5, 4.7, 3.8); kit.broc.visible = false; kit.xmas.visible = false; cm([KX + 5, 7.5, 12, KX, 5.6, 1, 48], [KX + 4.6, 7.5, 11, KX, 5.6, 1, 46], L.k); badge('tag', 'MORGEN', W / 2, H * .13, L.lt - .1); badge('big', '?', W * .3, H * .27, L.lt - .6); badge('big', '?', W * .7, H * .3, L.lt - .9); }, [[0, 'rooster', .6], [.6, 'hmm', .4], [1.4, 'spoon', .4]]);
shot(39.20, 'S', null, L => { use('kit'); put(papa, KX - 3.5, 3, -.6, 0); applyPose(papa, { crouch: 1, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aRx: 2.4, aRe: 2.4, aRz: -.2, headZ: .2 }); face(papa, { eyes: 'squint', mouth: 'flat', brows: -.5, look: [.4, -.4] }, L.T); onFace(papa, 6, .3, 1.5, 44, L.k, 5); kit.broc.visible = false; kit.xmas.visible = false; }, [[.2, 'hmm', .5]]);
// 23 todos eran más ricos
shot(40.68, 'C', null, L => { use('kit'); kit.broc.visible = false; kit.xmas.visible = false; put(papa, KX - 3.5, 3, -.6, .2); applyPose(papa, { crouch: 1, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aLx: 1.5, aRx: 1.5, aLe: .5, aRe: .5 }); face(papa, { eyes: 'open', mouth: 'smile' }, L.T); money(24, KX - 2, 5, 0, L.T, 6, 1.2);
  cm([KX + 2, 8, 9, KX - 2, 5, -.6, 48], [KX + 1.6, 7.6, 8, KX - 2, 5, -.6, 46], L.k); badge('coin', '+9', W / 2, H * .15, L.lt - .1); }, [[0, 'cash', .7], [.3, 'money_rain', .5]]);
// 24 pero también un poco más vacíos
shot(41.79, 'W', null, L => { use('kit'); kit.broc.visible = false; kit.xmas.visible = false; [[papa, -3.5, -1.6], [mama, 3.5, -1.6]].forEach(([c, x, z]) => { put(c, KX + x, 3, z + 1, 0); applyPose(c, { crouch: 1, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, headX: .3 }); face(c, { eyes: 'half', mouth: 'flat', brows: -.2 }, 99); });
  grade.uniforms.sat.value = lerp(1.25, .1, easeInOut(clamp(L.lt))); cm([KX, 8, 17, KX, 6, -.6, 48], [KX, 7.8, 15.5, KX, 6, -.6, 46], L.k); badge('tag', 'LEERER', W / 2, H * .14, L.lt - .3); }, [[0, 'sad_tone', .6], [.4, 'hum_low', .3]]);
// 25 mamá dejó de cantar
shot(43.18, 'S', null, L => { use('kit'); kit.broc.visible = false; kit.xmas.visible = false; put(mama, KX + 4, 0, -6.4, Math.PI); const s = Math.sin(L.T * 4); applyPose(mama, { aRx: 1.2, aRe: 1 + s * .2, aLx: .9, aLe: .8 }); face(mama, { eyes: 'half', mouth: 'flat', brows: -.4 }, L.T); grade.uniforms.sat.value = .55;
  put(mama, KX + 4, 0, -5.4, -.5); face(mama, { eyes: 'open', mouth: 'frown', brows: -.5 }, L.T); cm([KX + 3, 8.2, -.8, KX + 4, 6.6, -5.4, 44], [KX + 3.2, 8, -1.4, KX + 4, 6.6, -5.4, 42], L.k); }, [[0, 'pan_sizzle', .5], [.6, 'spoon', .3]]);
// 26 papá ya no se reía de sus chistes
shot(44.49, 'W', null, L => { use('kit'); kit.broc.visible = false; kit.xmas.visible = false; put(papa, KX - 3.5, 3, -.6, .3); applyPose(papa, { crouch: 1, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aRx: 1.4, aRe: .6, aRz: .3 + Math.sin(L.T * 6) * .15 }); talk(papa, L.T, 44.5, 45.6, { eyes: 'open', mouth: 'flat', brows: -.2 }); if (L.lt > 1.1) face(papa, { eyes: 'half', mouth: 'flat', brows: -.5 }, 99);
  grade.uniforms.sat.value = .55; onFace(papa, 6.5, .4, -1.4, 44, L.k, 5.4); badge('tag', 'HAHA…?', W * .7, H * .2, L.lt - .3); }, [[.1, 'laugh_m', .3], [1.2, 'cricket', .5]]);
// 27 mi hermana lloraba sobre sus tortitas
shot(46.62, 'C', null, L => { use('kit'); kit.broc.visible = false; kit.xmas.visible = false; put(sis, KX - 3.5, 3.6, 5.6, Math.PI); applyPose(sis, { crouch: 1, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, headX: .35, aLx: 1, aLe: 1.8, headZ: Math.sin(L.T * 9) * .04 }); face(sis, { eyes: 'closed', mouth: 'frown', brows: -.9, tears: 1 }, 99);
  pancakes.visible = true; pancakes.position.set(KX - 3.5, 4.7, 3.8); grade.uniforms.sat.value = .7; onFace(sis, 5, 1.2, 1.4, 42, L.k, 4.2); }, [[0, 'cry_girl', .6]]);
shot(48.20, 'W', null, L => { use('kit'); kit.broc.visible = false; kit.xmas.visible = false; put(sis, KX - 3.5, 3.6, 5.6, Math.PI); applyPose(sis, { crouch: 1, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, headX: .1, aLz: .5, aRz: .5, aLe: 1, aRe: 1 }); face(sis, { eyes: 'open', mouth: 'frown', brows: -.8, tears: 1, look: [0, -.2] }, L.T);
  grade.uniforms.sat.value = .7; onFace(sis, 4.8, 1.2, 0, 40, L.k, 4.2); badge('big', 'WARUM?', W / 2, H * .15, L.lt - .6); }, [[.6, 'impact_soft', .5], [.7, 'sniff', .5]]);
// 28 así que esta noche lo seguí
shot(49.83, 'S', null, L => { use('G'); night(); walkTo(grey, 1, -60, Math.PI, L.T, L.lt, 2.2); face(grey, { eyes: 'half', mouth: 'flat' }, L.T); const g = grey.root.position;
  put(ben, -6.5, 0, g.z + 14, Math.PI); applyPose(ben, { ...walkPose(L.T, .5), crouch: .5, lean: .35, lLk: .8, lRk: .8 }); ben.root.position.z = -60 + 14 - L.lt * 2.2; face(ben, { eyes: 'squint', mouth: 'flat', brows: .6, bags: 1 }, L.T);
  const b = ben.root.position; cm([b.x - 4, 4.5, b.z + 8, b.x + 2, 4, b.z - 8, 50], [b.x - 3.6, 4.5, b.z + 7, b.x + 2, 4, b.z - 9, 48], L.k); sh(V(0, 0, b.z - 6), 25); }, [[0, 'steps_snow', .5], [.6, 'heartbeat', .5]]);
// 29 hasta la torre del reloj
shot(51.65, 'W', null, L => { use('G'); night(); walkTo(grey, 0, -170, Math.PI, L.T, L.lt, 2.2); face(grey, { eyes: 'half', mouth: 'flat' }, L.T); cm([6, 3, -150, 0, 40, -220, 50], [5, 3.4, -153, 0, 42, -220, 48], L.k); badge('tag', 'UHRTURM', W / 2, H * .13, L.lt - .2); sh(V(0, 0, -180), 50); }, [[0, 'bell_far', .7], [.3, 'wind', .4]]);
// 30 dentro había miles de sacos llenos de sueños — ZOOM LENTO
shot(52.60, 'Z', 'slow', L => { use('T'); night(); towerOrbs.forEach(o => o.userData.update(L.T)); gears.forEach((g, i) => g.rotation.z = L.T * (i ? -.6 : .4)); put(ben, TX, 0, 6, Math.PI); applyPose(ben, { headX: -.35, aLz: .3, aRz: .3 }); face(ben, { eyes: 'wide', mouth: 'o', bags: 1 }, L.T);
  cm([TX + 3, 3.5, 13, TX, 11, -14, 54], [TX + 2, 4, 9, TX, 12, -14, 46], L.k, easeIn); bloom.strength = .8; sh(V(TX, 0, 0), 25); }, [[.1, 'gears', .4]]);
// 31 cada sueño que este pueblo tuvo jamás
shot(55.17, 'R', null, L => { use('T'); night(); towerOrbs.forEach(o => o.userData.update(L.T)); gears.forEach((g, i) => g.rotation.z = L.T * (i ? -.6 : .4)); const a = -1.1 + L.k * 1.4; cam([TX + Math.sin(a) * 6, 9, 0 + Math.cos(a) * 6], [TX - Math.sin(a) * 10, 10, -Math.cos(a) * 12], 56); bloom.strength = .8; badge('big', 'TAUSENDE', W / 2, H * .14, L.lt - .2); }, [[0, 'choir', .4], [.6, 'sparkle', .5]]);
// 32 alargué la mano hacia uno
shot(57.29, 'C', null, L => { use('T'); night(); towerOrbs.forEach(o => o.userData.update(L.T)); const k = easeInOut(clamp(L.lt / .8)); put(ben, TX - 3, 0, -9.6, Math.PI); applyPose(ben, { aRx: lerp(.2, 1.7, k), aRe: .2, lean: .15 * k }); face(ben, { eyes: 'open', mouth: 'o', bags: 1 }, L.T);
  cm([TX - 7, 6, -4, TX - 3.6, 4.6, -11, 46], [TX - 6.4, 6, -4.6, TX - 3.6, 4.6, -11, 44], L.k); }, [[.2, 'cloth', .5], [.6, 'sparkle', .4]]);
// 33 una mano fría cayó sobre mi hombro — ZOOM LENTO
shot(58.17, 'S', 'slow', L => { use('T'); night(); towerOrbs.forEach(o => o.userData.update(L.T)); put(ben, TX - 3, 0, -9.6, Math.PI + .3 * easeOut(clamp((L.lt - .8) * 2))); applyPose(ben, { aRx: 1.7 - clamp((L.lt - .8) * 2) * 1.4, aRe: .2, headY: .5 * clamp((L.lt - .8) * 2) }); face(ben, { eyes: 'wide', mouth: 'teeth', bags: 1, brows: -.9, sweat: 1 }, L.T);
  put(grey, TX - 1.6, 0, -5.2, Math.PI); grey.props.sack.visible = false; applyPose(grey, { aLx: lerp(.2, 1.15, easeOut(clamp(L.lt / .7))), aLe: .5, aLz: -.15, lean: .1 }); face(grey, { eyes: 'half', mouth: 'flat' }, L.T);
  cm([TX - 7.5, 6.2, -3.5, TX - 2.6, 4.4, -8.6, 48], [TX - 6.2, 6, -4.6, TX - 2.6, 4.4, -8.6, 40], L.k, easeIn); grade.uniforms.sat.value = .8; }, [[.6, 'hand_glass', .7], [.65, 'freeze', .5]]);
// 34 "No deberías estar aquí", dijo él
shot(60.66, 'C', null, L => { use('T'); night(); put(grey, TX - 1.6, 0, -5.2, Math.PI + .3); grey.props.sack.visible = false; applyPose(grey, { aLx: 1.1, aLe: .5, lean: .15, headX: .15 }); talk(grey, L.T, 60.6, 62.6, { eyes: 'half', mouth: 'flat', brows: .3 });
  put(ben, TX - 3, 0, -9.6, .3); applyPose(ben, { lean: -.15 }); face(ben, { eyes: 'wide', mouth: 'o', bags: 1, brows: -.8 }, L.T); const h = hp(grey); cm([h.x - 2, h.y - .2, h.z - 6.5, h.x, h.y + .3, h.z, 42], [h.x - 1.6, h.y - .2, h.z - 5.4, h.x, h.y + .3, h.z, 40], L.k); }, [[0, 'hum_low', .5]]);
// 35 entonces sonrió
shot(62.68, 'W', null, L => { use('T'); night(); put(grey, TX - 1.6, 0, -5.2, Math.PI + .3); grey.props.sack.visible = false; applyPose(grey, { headX: .2 }); face(grey, { eyes: 'squint', mouth: L.lt > .3 ? 'grin' : 'smirk', brows: .6 }, 99); onFace(grey, 5, -.3, 0, 38, L.k, 4.4); }, [[.3, 'creepy_ting', .7]]);
// 36 "Por fin. Te llevo años buscando." — ZOOM LENTO final + TEIL 2?
shot(63.66, null, 'slow', L => { use('T'); night(); towerOrbs.forEach(o => o.userData.update(L.T)); put(grey, TX - 1.6, 0, -5.2, Math.PI + .3); grey.props.sack.visible = false; applyPose(grey, { headX: .2, aLx: 1.1, aLe: .5 }); talk(grey, L.T, 63.6, 66, { eyes: 'squint', mouth: 'grin', brows: .7 });
  put(ben, TX - 3, 0, -9.6, .3); face(ben, { eyes: 'wide', mouth: 'teeth', bags: 1, sweat: 1 }, L.T); const h = hp(grey); cm([h.x - 3, h.y - 1, h.z - 7, h.x - .6, h.y - .6, h.z - 1.8, 46], [h.x - 1.8, h.y - .6, h.z - 4.6, h.x - .6, h.y - .4, h.z - 1.8, 38], L.k, easeIn);
  if (L.lt > 1.5) badge('big', 'TEIL 2?', W / 2, H * .15, L.lt - 1.5); }, [[1.5, 'impact', .6]]);

// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 3, Z: 3, F: 2, S: 3, R: 4, I: 5, C: 4 }, TR_SFX = { W: 'whoosh', Z: 'swoosh_up', F: 'flash', S: 'swipe', R: 'whirl', I: 'iris_pop', C: 'thump' };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slowv') { } else if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  else if (i > 0) CUES.push({ t: s.t0 + .05, s: ['zoom_in', 'whoosh_soft', 'zoom_out'][i % 3], g: .35 });
  if (s.tr) CUES.push({ t: +(s.t1 - TRW[s.tr] / FPS).toFixed(3), s: TR_SFX[s.tr], g: .8 }); });
CUES.push({ t: .05, s: 'riser', g: .9, d: 3.07 }); CUES.push({ t: 3.15, s: 'braam', g: 1 });   // gancho
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d };
  hideAll(); BAD.length = 0; s.fn(L);
  if (s.zoom && s.zoom.startsWith('slow')) { const e = easeIn(L.k); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .85, e); camera.fov *= lerp(1, .92, e); }
  let sh_ = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'thump', 'braam', 'magic_hit'].includes(c.s) && T - c.t < .12) sh_ = 1 - (T - c.t) / .12; }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .22 * sh_; camera.position.y += (r() - .5) * .22 * sh_; }
  camera.updateProjectionMatrix();
  if (tr === 'W' || tr === 'S') { grade.uniforms.blurAmt.value = a * .07; grade.uniforms.dir.value.set(tr === 'W' ? 1 : 0, tr === 'W' ? 0 : 1); } else grade.uniforms.blurAmt.value = 0;
  if (tr === 'F') grade.uniforms.flash.value = Math.max(grade.uniforms.flash.value, a * .95);
  composer.render();
}
function renderAt(T) {
  const i = shotAt(T), s = S[i]; let tr = null, a = 0, ph = 0; const fO = (s.t1 - T) * FPS, fI = (T - s.t0) * FPS;
  if (s.tr && fO < TRW[s.tr]) { tr = s.tr; a = 1 - fO / TRW[s.tr]; ph = -1; } else if (i > 0 && S[i - 1].tr && fI < TRW[S[i - 1].tr]) { tr = S[i - 1].tr; a = 1 - fI / TRW[S[i - 1].tr]; ph = 1; }
  renderShot(i, T, tr, a);
  octx.save(); octx.fillStyle = '#000'; octx.fillRect(0, 0, W, H); octx.translate(W / 2, H / 2); const a2 = a * a;
  if (tr === 'W') octx.translate(ph * a2 * W * .45, 0); if (tr === 'S') octx.translate(0, ph * a2 * H * .35);
  if (tr === 'Z') { const sc = ph < 0 ? 1 + a2 * .6 : 1 + a2 * .35; octx.scale(sc, sc); octx.filter = `blur(${(a * 6).toFixed(1)}px)`; }
  if (tr === 'R') { octx.rotate((ph < 0 ? 1 : -1) * a2 * .55); octx.scale(1 + a2 * .3, 1 + a2 * .3); octx.filter = `blur(${(a * 5).toFixed(1)}px)`; }
  if (tr === 'C' && ph > 0) { const sc = 1 + a * .22; octx.scale(sc, sc); }
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  for (const b of BAD) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;

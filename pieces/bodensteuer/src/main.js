// Bodensteuer — 69 planos sincronizados con audio/words.json (1080×1920, 30 fps).
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, idlePose, mixPose, V, lerp, clamp,
  easeOut, easeIn, easeInOut, spring, blinking, lip, RNG, mat, box, sphere, cyl, canvasTex, textPlane, checkTex } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight, lightCone } from './roblox.js';
import { FONT, noiseTex, stripes, screen, txt, building, skyscraper, tree, lamp, hydrant, bench, rathaus, fountain, pool, makeMax, makeMayor, makeRich, makeGuard, makeExtra,
  makeNeighbor, makeStilts, makeWasher, makeClerk, makeOfficial, rocketBoots, officeChair, stilts, washer, drone, limo, phoneProp, drawBank, drawNotif } from './props.js';

await document.fonts.load('700 40px Cap');
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 121.5, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xbfe3ff, .001);
const camera = new THREE.PerspectiveCamera(50, W / H, .6, 2500); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera);
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach((c, i) => c.position.set(-800 + i * 170, 360 + (i % 3) * 70, -1400));
const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x8a8070, 1.7); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d8, 2.7); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 5; scene.add(sun, sun.target);
const rim = rimLight(scene);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 700 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-70, 140, 90)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }

// ---------- ciudad ----------
const G = new THREE.Group(); scene.add(G);
const gr = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), mat(0xffffff, { roughness: 1, map: noiseTex('#5fbf4a', ['#4fa83c', '#6cc858', '#3f9a34'], 2400, 2, 90) })); gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; G.add(gr);
const asphalt = noiseTex('#264174', ['#20386a', '#2c4a80', '#30508a'], 3000, 2, 1); asphalt.repeat.set(2, 60);
const road = new THREE.Mesh(new THREE.PlaneGeometry(16, 260), mat(0xffffff, { roughness: .9, map: asphalt })); road.rotation.x = -Math.PI / 2; road.position.set(0, .07, -60); road.receiveShadow = true; G.add(road);
for (let z = 60; z > -170; z -= 7) box(.4, .04, 3.4, mat(0xe8d23a, { emissive: 0xe8d23a, emissiveIntensity: .15 }), 0, G, 0, .1, z);
const tiles = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#e4e0d8'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c4beb4'; c.lineWidth = 3; for (let i = 0; i <= w; i += 32) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } }, true); tiles.repeat.set(2, 70);
for (const s of [-1, 1]) { const sw = box(7.6, .3, 260, mat(0xffffff, { map: tiles, roughness: .9 }), .05, G, s * 11.8, .15, -60); sw.castShadow = false; box(.4, .4, 260, mat(0xbab6ae), .05, G, s * 8.1, .2, -60); }
const plazaT = tiles.clone(); plazaT.repeat.set(16, 8); const plaza = new THREE.Mesh(new THREE.PlaneGeometry(80, 44), mat(0xffffff, { map: plazaT })); plaza.rotation.x = -Math.PI / 2; plaza.position.set(0, .42, -182); plaza.receiveShadow = true; G.add(plaza);
const shops = []; let bi = 0;
for (let z = 52; z > -160; z -= 16) for (const s of [-1, 1]) { if (s < 0 && z === -84) { bi++; continue; } shops.push(building(G, s * 15.6, z, s, bi, 14 + ((bi * 7) % 4) * 4.4)); bi++; }
const lampBulbs = []; for (let z = 44; z > -160; z -= 32) for (const s of [-1, 1]) { lampBulbs.push(lamp(G, s * 9.4, z, s)); hydrant(G, s * 10, z - 6); tree(G, s * 12.6, z - 16, .9); bench(G, s * 13.6, z - 8, s > 0 ? -Math.PI / 2 : Math.PI / 2); }
const crashTree = tree(G, 12.6, -52, 1.1);
const RH = rathaus(G, -205); const FT = fountain(G, 0, -176);
const POOL = pool(G, -29, -84);
const glassM = []; for (const [x, z, w, h] of [[-48, -60, 22, 70], [50, -40, 20, 60], [-60, -140, 26, 110], [64, -170, 24, 90], [-40, -250, 30, 130], [40, -260, 26, 100], [-90, -40, 30, 80], [95, -110, 30, 120], [0, -330, 40, 150]]) glassM.push(skyscraper(G, x, z, w, h, w));
const TOWER = { x: 36, z: -118, h: 96 }; skyscraper(G, TOWER.x, TOWER.z, 16, TOWER.h, 16, '#9fe0ff', '#3fa8e8'); cyl(.5, .7, 20, mat(0xd8d8e0, { metalness: .8 }), 10, G, TOWER.x, TOWER.h + 10, TOWER.z); sphere(.8, mat(0xff2a2a, { emissive: 0xff2a2a, emissiveIntensity: 3 }), G, TOWER.x, TOWER.h + 20.5, TOWER.z);
for (const y of [6, 12, 17]) box(6, .3, .3, mat(0xd8d8e0, { metalness: .8 }), .05, G, TOWER.x, TOWER.h + y, TOWER.z);
// pantalla gigante de la ciudad (roja → verde)
const BB = new THREE.Group(); BB.position.set(-13.2, 0, -112); BB.rotation.y = Math.PI / 2 - .35; G.add(BB); cyl(.5, .6, 12, mat(0x3a3e48, { metalness: .7 }), 10, BB, 0, 6, 0); box(15, 9, .8, mat(0x22252e), .2, BB, 0, 16, -.4);
const bbS = screen(14, 8, 700, 400, 1.5); bbS.position.set(0, 16, .05); BB.add(bbS);
const drawBB = green => bbS.userData.draw(green, (c, w, h) => { c.fillStyle = green ? '#0fa85a' : '#c8102e'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.08)'; for (let y = 0; y < h; y += 6) c.fillRect(0, y, w, 2);
  txt(c, 'BODENSTEUER', w / 2, 110, 84, '#fff', '#000', 10); txt(c, green ? 'DEAKTIVIERT' : '10 € / SCHRITT', w / 2, 250, green ? 92 : 100, '#ffd23f', '#000', 12); });
// muro LED con puerta secreta junto al Rathaus
const LED = new THREE.Group(); LED.position.set(30, 0, -190); LED.rotation.y = -Math.PI / 2; G.add(LED); box(18, 12, 1, mat(0x2a2e3a), .1, LED, 0, 6, -.6); const ledS = screen(16, 10, 640, 400, 1.6); ledS.position.set(0, 6, 0); LED.add(ledS);
ledS.userData.draw('ad', (c, w, h) => { const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#5839a4'); g.addColorStop(1, '#ff5a85'); c.fillStyle = g; c.fillRect(0, 0, w, h); txt(c, 'DEINE STADT', w / 2, 140, 70, '#fff', '#1d2238', 10); txt(c, 'DEIN BODEN', w / 2, 240, 70, '#ffd23f', '#1d2238', 10); txt(c, 'RATHAUS', w / 2, 330, 44, '#fff'); });
const ramp = new THREE.Mesh(new THREE.PlaneGeometry(14, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(.2, 2.2, 1.2), toneMapped: false })); ramp.position.set(0, 5, -1.2); LED.add(ramp);
// tasa "0 €" del alcalde: lector en la acera
const READ = new THREE.Group(); READ.position.set(11, 0, -40); G.add(READ); box(1.2, 3.4, .8, mat(0x3a3e48, { metalness: .6 }), .2, READ, 0, 1.7, 0); const readS = screen(1.0, 1.4, 160, 220, 1.6); readS.position.set(0, 2.6, .42); READ.add(readS);

// ---------- interiores ----------
const BX = 1000, KX = 1100, WX = 1200, OX = 1300, SX = 1400;
function room(x, w, d, h, wallM, floorM, ceil = false) { const g = new THREE.Group(); g.position.x = x; scene.add(g); const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorM); f.rotation.x = -Math.PI / 2; f.receiveShadow = true; g.add(f);
  box(w, h, .6, wallM, 0, g, 0, h / 2, -d / 2); for (const s of [-1, 1]) box(.6, h, d, wallM, 0, g, s * w / 2, h / 2, 0); if (ceil) box(w, .4, d, mat(0xffffff), 0, g, 0, h, 0); box(w, .8, .7, mat(0xffffff), .05, g, 0, .4, -d / 2 + .3); return g; }
const rep = (t, a, b) => { t.repeat.set(a, b); return t; };
const plank = () => rep(canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#b07a45'; c.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 16) { c.fillStyle = y % 32 ? '#a06a38' : '#bc8650'; c.fillRect(0, y, w, 15); c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, y + 15, w, 1); c.fillRect((y * 7) % w, y, 1, 16); } }, true), 4, 4);
// dormitorio
const BED = room(BX, 34, 28, 22, mat(0xffffff, { map: rep(stripes('#5cc8e0', '#7ad6ea', 8), 6, 1) }), mat(0xffffff, { map: plank() }));
{ const g = BED; const bed = new THREE.Group(); bed.position.set(-6, 0, -6); g.add(bed); box(8, 2, 13, mat(0x8a5a30), .2, bed, 0, 1, 0); box(7.6, 1.4, 12.4, mat(0xffffff), .4, bed, 0, 2.6, 0); box(7.8, .8, 8, mat(0xffffff, { map: rep(stripes('#ffd23f', '#3a7ad8', 10), 1, 1) }), .3, bed, 0, 3.4, 2); box(8.4, 7, 1, mat(0x8a5a30), .3, bed, 0, 3.5, -6.6); box(5, 1.2, 2.4, mat(0xffffff), .5, bed, 0, 3.7, -4.6);
  const shelf = new THREE.Group(); shelf.position.set(10, 0, -13.2); g.add(shelf); box(8, 14, 1.6, mat(0xd8a868), .1, shelf, 0, 7, 0); for (let r = 0; r < 4; r++) { box(7.6, .3, 1.6, mat(0xb88848), .05, shelf, 0, 2 + r * 3.4, .1); for (let k = 0; k < 9; k++) { const b = box(.6, 2 + (k % 3) * .3, 1.2, mat([0xff5a85, 0x3fa8ff, 0xffd23f, 0x2ec46a, 0x9b5de5, 0xff8a23][(k + r) % 6]), .05, shelf, -3.2 + k * .8, 3.2 + r * 3.4 + (k % 3) * .15, .1); if (k === 4) b.rotation.z = .2; } }
  const win = textPlane(9, 7, 360, 280, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#439bfe'); s.addColorStop(1, '#bfe3ff'); c.fillStyle = s; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; for (const [x, y] of [[80, 70], [240, 110]]) { c.beginPath(); c.arc(x, y, 26, 0, 7); c.arc(x + 30, y - 8, 30, 0, 7); c.arc(x + 60, y, 24, 0, 7); c.fill(); } c.fillStyle = '#7fd4ff'; c.fillRect(20, 160, 60, 120); c.fillRect(250, 140, 70, 140); }, .6); win.position.set(2, 12, -13.6); g.add(win);
  box(9.6, .5, 1, mat(0xffffff), .05, g, 2, 8.3, -13.4); box(.4, 7, .4, mat(0xffffff), 0, g, 2, 12, -13.5); for (const s of [-1, 1]) box(2.2, 9, .4, mat(0xff8a23, { roughness: .9 }), .2, g, 2 + s * 5.6, 12, -13.2);
  const rug = cyl(6, 6, .1, mat(0xffffff, { map: stripes('#ff5a85', '#ffd23f', 12) }), 40, g, 3, .06, 3); const ns = box(3, 3, 3, mat(0xd8a868), .2, g, -12, 1.5, -11); cyl(.6, .9, .4, mat(0x2a7ad8), 16, g, -12, 3.2, -11); cyl(.1, .1, 2, mat(0x333333), 8, g, -12, 4.3, -11); cyl(.7, 1.1, 1.2, mat(0xfff4c0, { emissive: 0xffd27a, emissiveIntensity: 1 }), 16, g, -12, 5.6, -11);
  const post = textPlane(5, 6.5, 200, 260, (c, w, h) => { c.fillStyle = '#1b1f4a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(60, 70, 30, 0, 7); c.fill(); c.fillStyle = '#ff8a23'; c.beginPath(); c.moveTo(100, 230); c.lineTo(130, 100); c.lineTo(160, 230); c.fill(); c.fillStyle = '#fff'; for (let i = 0; i < 30; i++) c.fillRect((i * 53) % w, (i * 97) % h, 3, 3); c.strokeStyle = '#ff5a85'; c.lineWidth = 8; c.strokeRect(4, 4, w - 8, h - 8); }); post.position.set(-14, 12, -13.6); g.add(post);
  const L = new THREE.PointLight(0xffe8c8, 500, 70, 2); L.position.set(0, 18, 4); g.add(L); }
const BEDP = { x: BX - 6, y: 3.3, z: -6 };
// cocina
const KIT = room(KX, 34, 28, 22, mat(0xebe2c7), mat(0xffffff, { map: rep(checkTex('#f04a3c', '#f4f0f0', 8), 3, 3) }));
{ const g = KIT; const cab = mat(0x4cb6a8, { roughness: .5 }), top = mat(0xf4f4f4, { roughness: .3 }); for (let k = 0; k < 5; k++) { box(4, 5, 4, cab, .1, g, -14 + k * 4.2, 2.5, -11.6); box(.8, .2, .2, mat(0xd9a531, { metalness: .8 }), .05, g, -14 + k * 4.2, 4.3, -9.5); box(3.6, 3.4, 2.4, cab, .1, g, -14 + k * 4.2, 14, -12.6); }
  box(21, .5, 4.4, top, .05, g, -5.6, 5.2, -11.6); box(5, 12, 4.5, mat(0xf4f4f8, { roughness: .3 }), .3, g, 12, 6, -11.4); box(.3, 3, .3, mat(0xaaaaaa, { metalness: .8 }), .1, g, 9.8, 8, -9); const pan = cyl(1.2, 1, .4, mat(0x2a2a2a, { metalness: .6 }), 20, g, -2, 5.7, -11); for (let k = 0; k < 3; k++) cyl(.8, .8, .2, mat(0xffffff), 16, g, -9 + k * .3, 5.6 + k * .22, -11);
  const tab = new THREE.Group(); tab.position.set(4, 0, 2); g.add(tab); box(8, .5, 5, mat(0xd8a868), .1, tab, 0, 4, 0); for (const [x, z] of [[-3.6, -2.2], [3.6, -2.2], [-3.6, 2.2], [3.6, 2.2]]) box(.4, 4, .4, mat(0xb88848), .05, tab, x, 2, z); box(8.2, .05, 5.2, mat(0xffffff, { map: checkTex('#ff5a85', '#ffffff', 8) }), 0, tab, 0, 4.28, 0);
  const lmp = new THREE.Group(); lmp.position.set(4, 21, 2); g.add(lmp); cyl(.05, .05, 4, mat(0x333333), 6, lmp, 0, -2, 0); const sh_ = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.4, 20, 1, true), mat(0xff8a23, { side: THREE.DoubleSide })); sh_.position.y = -4.4; lmp.add(sh_); sphere(.5, mat(0xfff4c0, { emissive: 0xffd27a, emissiveIntensity: 3 }), lmp, 0, -4.8, 0);
  const clk = cyl(1.4, 1.4, .3, mat(0xffffff), 24, g, 0, 15, -13.6); clk.rotation.x = Math.PI / 2; const L = new THREE.PointLight(0xffe8c8, 520, 70, 2); L.position.set(4, 16, 4); g.add(L); }
// taller
const WORK = room(WX, 36, 28, 22, mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#c8a070'; c.fillRect(0, 0, w, h); c.fillStyle = '#b08a5a'; for (let y = 0; y < h; y += 16) c.fillRect(0, y, w, 2); }, true), 8, 6) }), mat(0xffffff, { map: noiseTex('#7a7f8a', ['#6a6f7a', '#8a8f9a'], 2000, 3, 4) }));
const wb = new THREE.Group(); wb.position.set(WX, 0, -6); scene.add(wb);
{ box(18, .8, 6, mat(0x8a5634), .15, wb, 0, 5.2, 0); for (const s of [-1, 1]) box(.8, 5, 5, mat(0x6b4426), .1, wb, s * 8, 2.5, 0); const peg = textPlane(16, 7, 640, 280, (c, w, h) => { c.fillStyle = '#c89a5a'; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,0,0,.25)'; for (let y = 10; y < h; y += 20) for (let x = 10; x < w; x += 20) c.fillRect(x, y, 4, 4); c.fillStyle = '#d8323a'; c.fillRect(60, 60, 30, 140); c.fillStyle = '#555'; c.fillRect(140, 50, 20, 160); c.fillRect(210, 70, 110, 24); c.fillStyle = '#2a7ad8'; c.fillRect(360, 60, 28, 150); c.fillStyle = '#ffd23f'; c.fillRect(440, 90, 120, 40); }); peg.position.set(0, 11, -7.6); wb.add(peg);
  const post = textPlane(7, 9, 280, 360, (c, w, h) => { c.fillStyle = '#0e1440'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; for (let i = 0; i < 50; i++) c.fillRect((i * 71) % w, (i * 113) % h, 3, 3); c.fillStyle = '#ff5a2a'; c.beginPath(); c.moveTo(140, 60); c.lineTo(190, 200); c.lineTo(90, 200); c.fill(); c.fillStyle = '#e8e8f0'; c.fillRect(110, 120, 60, 120); c.fillStyle = '#3fe8ff'; c.beginPath(); c.arc(140, 160, 16, 0, 7); c.fill(); c.fillStyle = '#ffa030'; c.beginPath(); c.moveTo(110, 240); c.lineTo(140, 330); c.lineTo(170, 240); c.fill(); txt(c, 'SPACE', w / 2, 30, 30, '#ffd23f'); }); post.position.set(-13, 12, -6.7); wb.add(post);
  for (let k = 0; k < 6; k++) box(2.4, 1.6, 2, mat([0x8a6a4a, 0x6a8aaa, 0xaa6a6a][k % 3]), .1, wb, 11 + (k % 2) * 2.6, 1 + Math.floor(k / 2) * 1.7, -4); const vise = box(1.4, 1, 1, mat(0x3a5aaa, { metalness: .5 }), .1, wb, -6, 6.1, 1);
  const L = new THREE.PointLight(0xffd8a0, 700, 70, 2); L.position.set(2, 16, 6); wb.add(L); }
const benchShoes = new THREE.Group(); scene.add(benchShoes); for (const s of [-1, 1]) { const b = new THREE.Group(); b.position.set(s * .9, 0, 0); benchShoes.add(b); box(1.12, .5, 1.45, mat(0x9aa4b4, { metalness: .7, roughness: .25 }), .14, b, 0, .25, 0); box(1.16, .14, 1.5, mat(0xff5a2a), .04, b, 0, .5, 0); cyl(.32, .4, .4, mat(0x3a3a44, { metalness: .8 }), 16, b, 0, .3, -.9).rotation.x = Math.PI / 2; for (const q of [-1, 1]) box(.08, .5, .5, mat(0xff5a2a), .02, b, q * .6, .4, -.7); }
const sparks = []; for (let k = 0; k < 40; k++) sparks.push(sphere(.06, new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 2.2, .8), toneMapped: false }), scene, 0, 0, 0, 4, 3));
// despacho del alcalde
const OFF = room(OX, 36, 28, 24, mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#5839a4'; c.fillRect(0, 0, w, h); c.fillStyle = '#e9c23a'; for (let y = 8; y < h; y += 16) for (let x = 8; x < w; x += 16) { c.beginPath(); c.arc(x, y, 2.4, 0, 7); c.fill(); } }, true), 10, 5) }), mat(0xffffff, { map: rep(checkTex('#7a2434', '#8a2a3e', 8), 4, 3) }));
const graph = screen(16, 9, 800, 450, 1.4); graph.position.set(OX, 15.6, -13.6); scene.add(graph);
{ const g = OFF, gold = mat(0xe9c23a, { metalness: .8, roughness: .25 }); box(17, 10, .6, mat(0x1a1a22), .1, g, 0, 13, -13.9); const desk = new THREE.Group(); desk.position.set(0, 0, 0); g.add(desk); box(14, 4.6, 5, mat(0x4a2414, { roughness: .4 }), .2, desk, 0, 2.3, 0); box(14.4, .4, 5.4, gold, .1, desk, 0, 4.7, 0);
  const plate = textPlane(6, 1.1, 480, 88, (c, w, h) => { c.fillStyle = '#e9c23a'; c.fillRect(0, 0, w, h); txt(c, 'BÜRGERMEISTER', w / 2, h / 2 + 3, 54, '#3a2470'); }, .4); plate.position.set(0, 3.4, 2.56); desk.add(plate);
  const chairB = box(5, 9, 1.2, mat(0x8a1a2a, { roughness: .6 }), .5, g, 0, 6, -6); box(5.6, .6, 1.4, gold, .1, g, 0, 10.6, -6); for (let k = 0; k < 3; k++) cyl(.8, .8, .3, gold, 16, g, -4 + k * .5, 5.1 + k * .32, .5); box(2, 1.4, 1.4, mat(0x2a7a3a), .05, g, 4, 5.6, .5);
  for (const s of [-1, 1]) { cyl(.12, .12, 12, gold, 8, g, s * 14, 6, -11); box(3, 4, .1, mat(0xffffff, { map: stripes('#5839a4', '#e9c23a', 3, false) }), .02, g, s * 14 + 1.6, 10, -11); }
  const safe = box(5, 6, 4, mat(0x3a3a44, { metalness: .7 }), .2, g, 13, 3, -10); const wh = cyl(1, 1, .3, gold, 16, g, 13, 3.4, -7.9); wh.rotation.x = Math.PI / 2; const L = new THREE.PointLight(0xffd8a0, 500, 70, 2); L.position.set(0, 18, 6); g.add(L); }
const drawGraph = (k) => graph.userData.draw(Math.round(k * 30), (c, w, h) => { c.fillStyle = '#0e1430'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(255,255,255,.12)'; for (let x = 0; x < w; x += 50) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
  txt(c, 'EINNAHMEN', 150, 40, 36, '#ffffff'); c.lineWidth = 10; c.lineJoin = 'round'; const n = 20, m = Math.floor(n * k); c.beginPath(); for (let i = 0; i <= m; i++) { const x = 40 + i * 36, y = i < 9 ? 330 - i * 22 + Math.sin(i * 2) * 14 : 140 + (i - 9) ** 1.6 * 9; i ? c.lineTo(x, y) : c.moveTo(x, y); c.strokeStyle = i < 9 ? '#22e39a' : '#ff3a4a'; } c.stroke();
  if (k > .55) txt(c, '-4.000.000 €', w - 220, 80, 64, '#ff3a4a', '#000', 8); });
// sala secreta
const SEC = room(SX, 44, 34, 26, mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#0e2230'; c.fillRect(0, 0, w, h); c.strokeStyle = '#1b3a4a'; c.lineWidth = 2; c.strokeRect(1, 1, w - 2, h - 2); }, true), 10, 6) }), mat(0xffffff, { map: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#0a1a24'; c.fillRect(0, 0, w, h); c.strokeStyle = '#1aa87a'; c.lineWidth = 2; c.strokeRect(1, 1, w - 2, h - 2); }, true), 12, 10), emissive: 0x22e39a, emissiveIntensity: .25, emissiveMap: rep(canvasTex(64, 64, (c, w, h) => { c.fillStyle = '#000'; c.fillRect(0, 0, w, h); c.strokeStyle = '#1aa87a'; c.lineWidth = 2; c.strokeRect(1, 1, w - 2, h - 2); }, true), 12, 10) }), true);
const neon = (col) => new THREE.MeshBasicMaterial({ color: new THREE.Color(...col), toneMapped: false });
for (const y of [4, 22]) { box(44, .3, .3, neon([.3, 3, 1.6]), 0, SEC, 0, y, -16.6); for (const s of [-1, 1]) box(.3, .3, 34, neon([.4, 2.4, 3]), 0, SEC, s * 21.6, y, 0); }
const MCH = new THREE.Group(); MCH.position.set(SX, 0, -8); scene.add(MCH);
{ const k = mat(0x2a3440, { metalness: .7, roughness: .3 }); cyl(6, 7, 3, k, 40, MCH, 0, 1.5, 0); cyl(5.4, 5.4, .4, neon([.3, 3, 1.6]), 40, MCH, 0, 3.1, 0); cyl(5, 5, 14, mat(0xbfefff, { transparent: true, opacity: .22, roughness: .02, metalness: .1, side: THREE.DoubleSide }), 40, MCH, 0, 10, 0); cyl(5.6, 5.6, 1.2, k, 40, MCH, 0, 17.6, 0);
  for (let q = 0; q < 6; q++) { const a = q / 6 * 6.283; cyl(.5, .5, 9, k, 10, MCH, Math.cos(a) * 6, 22, Math.sin(a) * 6); } for (const s of [-1, 1]) { const gg = cyl(1.2, 1.2, .3, mat(0xffffff), 20, MCH, s * 7.4, 6, 2); gg.rotation.x = Math.PI / 2; box(.1, 1, .05, mat(0xd8323a), 0, MCH, s * 7.4, 6.3, 2.2); }
  const pile = cyl(4.6, 4.8, 4, mat(0xf5c400, { metalness: .85, roughness: .25, emissive: 0x6a4a00, emissiveIntensity: .4 }), 32, MCH, 0, 5, 0); }
const mCoins = []; for (let k = 0; k < 70; k++) { const c = cyl(.6, .6, .14, mat(0xffd23f, { metalness: .85, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .5 }), 20, MCH, 0, 0, 0); mCoins.push(c); }
const mCount = screen(8, 2.4, 480, 144, 1.6); mCount.position.set(0, 19.8, 5.7); MCH.add(mCount);
const PED = new THREE.Group(); PED.position.set(SX, 0, 6); scene.add(PED); box(5, 5, 4, mat(0x2a3440, { metalness: .7, roughness: .3 }), .3, PED, 0, 2.5, 0); box(5.2, .3, 4.2, neon([3, .5, .5]), .05, PED, 0, 5, 0); cyl(1.5, 1.6, .5, mat(0x222222, { metalness: .6 }), 32, PED, 0, 5.4, 0);
const BTN = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 16, 0, 6.283, 0, Math.PI / 2), mat(0xe0102a, { roughness: .2, emissive: 0xff1a3a, emissiveIntensity: .8 })); BTN.position.set(0, 5.6, 0); BTN.scale.y = .6; PED.add(BTN);
const plateB = textPlane(4.4, 1.6, 440, 160, (c, w, h) => { c.fillStyle = '#c8c8d0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#555'; c.lineWidth = 8; c.strokeRect(4, 4, w - 8, h - 8); txt(c, 'BODENSTEUER', w / 2, 54, 52, '#c8102e'); txt(c, 'DEAKTIVIEREN', w / 2, 112, 52, '#1d2238'); }, .5); plateB.position.set(0, 3.4, 2.03); PED.add(plateB);
const MON = new THREE.Group(); MON.position.set(SX - 17, 0, -2); MON.rotation.y = Math.PI / 2 - .3; scene.add(MON); box(14, 10, 1, mat(0x1a1e24), .1, MON, 0, 8, -.6); const mons = []; for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) { const s = screen(4, 2.8, 160, 112, 1.2); s.position.set(-4.4 + q * 4.4, 11 - r * 3.1, 0); MON.add(s); mons.push(s); }
const desk2 = new THREE.Group(); desk2.position.set(SX + 15, 0, 0); desk2.rotation.y = -Math.PI / 2 + .4; scene.add(desk2); box(7, 3.4, 3.4, mat(0x2a3440), .1, desk2, 0, 1.7, 0); const gChair = officeChair(desk2); gChair.position.set(0, 0, 3.6); gChair.rotation.y = .5; cyl(.4, .35, .9, mat(0xffffff), 12, desk2, 2, 3.85, 0); cyl(.3, .3, .1, mat(0x5a3a1a), 12, desk2, 2, 4.3, 0); const gcap = cyl(.9, .9, .4, mat(0x1d3557), 16, desk2, -1.6, 3.6, .4);
const steamP = []; for (let k = 0; k < 8; k++) steamP.push(sphere(.18, mat(0xffffff, { transparent: true, opacity: .4 }), desk2, 2, 4.5, 0, 6, 4));
const L2 = new THREE.PointLight(0x40ffb0, 600, 80, 2); L2.position.set(0, 18, 8); SEC.add(L2); const L3 = new THREE.PointLight(0xff3a4a, 200, 30, 2); L3.position.set(0, 9, 12); SEC.add(L3);
const SETS = { G, BED, KIT, WORK: WORK, wb, OFF, SEC, MCH, PED, MON, desk2 };
const SETG = { BED: [BED], KIT: [KIT], WORK: [WORK, wb], OFF: [OFF, graph], SEC: [SEC, MCH, PED, MON, desk2] };

// ---------- reparto ----------
const max = makeMax(scene), mayor = makeMayor(scene), rich = makeRich(scene), guards = [0, 1].map(i => makeGuard(scene, i)), neigh = makeNeighbor(scene), stil = makeStilts(scene), wash = makeWasher(scene), clerk = makeClerk(scene), offi = makeOfficial(scene);
const ex = Array.from({ length: 12 }, (_, i) => makeExtra(scene, i));
rocketBoots(max); rocketBoots(neigh); ex.slice(0, 8).forEach(rocketBoots); stilts(stil, 7);
const POOLC = [max, mayor, rich, ...guards, neigh, stil, wash, clerk, offi, ...ex];
const phone = phoneProp(scene); const chairs = [0, 1, 2, 3, 4].map(() => officeChair(scene)); const WM = washer(scene); const drones = [0, 1, 2].map(() => drone(scene)); const LIMO = limo(scene);
const ruler = new THREE.Group(); scene.add(ruler); box(6, .1, .5, mat(0xffd23f), .02, ruler, 0, 0, 0); for (let k = 0; k <= 30; k++) box(.03, .02, k % 5 ? .15 : .3, mat(0x111111), 0, ruler, -3 + k * .2, .06, -.1);
const bills = []; const billM = mat(0xffffff, { map: canvasTex(64, 32, (c, w, h) => { c.fillStyle = '#7ad07a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a7a3a'; c.lineWidth = 3; c.strokeRect(3, 3, w - 6, h - 6); c.fillStyle = '#2a7a3a'; c.font = 'bold 18px sans-serif'; c.textAlign = 'center'; c.fillText('10 €', w / 2, 23); }), side: THREE.DoubleSide });
for (let i = 0; i < 24; i++) { const b = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .7), billM); scene.add(b); bills.push(b); }
const confetti = []; for (let i = 0; i < 160; i++) { const c = new THREE.Mesh(new THREE.PlaneGeometry(.5, .3), new THREE.MeshStandardMaterial({ color: [0xff5a85, 0xffd23f, 0x3fa8ff, 0x2ec46a, 0x9b5de5, 0xff8a23][i % 6], side: THREE.DoubleSide, emissive: [0xff5a85, 0xffd23f, 0x3fa8ff, 0x2ec46a, 0x9b5de5, 0xff8a23][i % 6], emissiveIntensity: .3 })); scene.add(c); confetti.push(c); }
const rings = [0, 1, 2, 3, 4, 5].map(() => { const r = new THREE.Mesh(new THREE.TorusGeometry(1.4, .12, 8, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, .5, 1.3), toneMapped: false, transparent: true })); r.rotation.x = Math.PI / 2; scene.add(r); return r; });
const smoke = []; for (let k = 0; k < 20; k++) smoke.push(sphere(1, mat(0xf0f0f0, { transparent: true, opacity: .6, roughness: 1 }), scene, 0, 0, 0, 10, 8));
const leafP = []; for (let k = 0; k < 30; k++) leafP.push(box(.5, .1, .4, mat(0x4cb64a), .02, scene));
const PROPS = [phone, ...chairs, WM, ...drones, LIMO, ruler, ...bills, ...confetti, ...rings, ...smoke, ...leafP, benchShoes, ...sparks];

// ---------- utilidades ----------
const use = (...n) => { for (const k of n) (SETG[k] || [SETS[k]]).forEach(o => o.visible = true); if (n.includes('G')) ao.enabled = false; if (n.includes('SEC')) { bloom.strength = .16; L2.color.setRGB(.25, 1, .7); } };
function day(k) { const u = sky.sky.material.uniforms; u.top.value.setRGB(.02 + .24 * k, .03 + .58 * k, .12 + .87 * k); u.mid.value.setRGB(.05 + .45 * k, .08 + .72 * k, .25 + .75 * k); u.hor.value.setRGB(.15 + .6 * k, .2 + .69 * k, .4 + .6 * k); sky.moon.material.opacity = 1 - k; sky.moon.position.set(-200, 380, -1400);
  hemi.intensity = .2 + 1.5 * k; hemi.color.setRGB(.5 + .31 * k, .55 + .35 * k, 1); sun.intensity = .4 + 2.3 * k; sun.color.setRGB(.6 + .4 * k, .7 + .24 * k, 1 - .15 * k); rim.intensity = 2.2 - .8 * k; scene.fog.color.setRGB(.05 + .7 * k, .08 + .81 * k, .2 + .8 * k); scene.fog.density = .0024 - .0016 * k;
  lampBulbs.forEach(b => b.material.emissiveIntensity = .1 + (1 - k) * 3); shops.forEach((s, i) => { s.wins[0].emissiveIntensity = (1 - k) * 1.4 * ((i % 3) ? 1 : .3); s.show.emissiveIntensity = .25 + (1 - k) * 1.5; }); bloom.strength = .26 + (1 - k) * .4; }
function hideAll() {
  for (const c of POOLC) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.setFlame && c.setFlame(0); c.head.scale.set(1, 1, 1); }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); }
  rings.forEach(r => r.rotation.x = Math.PI / 2); for (const k in SETS) SETS[k].visible = false; graph.visible = false; phone.parent !== scene && scene.attach(phone);
  grade.uniforms.vig.value = .32; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.48; day(1); ao.enabled = true; drawBB(false); max.props.goggles.visible = true; }
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
function face(ch, f, T) { const s = { ...f }; if (blinking(T, ch.seed) && !['closed', 'happy'].includes(s.eyes)) s.eyes = 'closed'; ch.setFace(s); }
function kp(ch, lt, keys, extra = {}) { let p = keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const [t0, a] = keys[i], [t1, b] = keys[i + 1]; if (lt >= t0 && lt <= t1) { p = mixPose(a, b, easeInOut((lt - t0) / (t1 - t0))); break; } if (lt > t1) p = b; } applyPose(ch, { ...p, ...extra }); }
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
const punch = (lt, at, amt = .3, d = .18) => lt < at ? 1 : 1 - amt * easeOut((lt - at) / d) * (lt - at < .6 ? 1 : clamp(1 - (lt - at - .6) / .3));
const hp = ch => ch.head.getWorldPosition(V(0, 0, 0)); const cp = ch => ch.spine.getWorldPosition(V(0, 0, 0)).add(V(0, 1, 0));
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch).add(V(0, .6, 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + dy, h.z + fz * d - fx * side], [h.x, h.y - .3, h.z], fov); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b);
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function walkTo(ch, x0, z0, ry, T, lt, speed = 3, run = false, sp = .6) { const d = speed * lt; put(ch, x0 + Math.sin(ry) * d, 0, z0 + Math.cos(ry) * d, ry); applyPose(ch, run ? runPose(T, 1.0) : walkPose(T, sp)); }
const wt = (w, after = 0) => { const x = WORDS.find(q => q[0] >= after - .01 && q[2].replace(/[.,:?!„“"]/g, '').toLowerCase().startsWith(w.toLowerCase())); if (!x) throw new Error('word ' + w); return x[0]; };
// paga por pisar: aro rosa + pop-up "-10 €" cada paso
function pay(ch, lt, rate, i0 = 0, label = '-10 €', kind = 'pay', ring = 0) { const n = Math.floor(lt * rate); for (let q = Math.max(0, n - 2); q <= n; q++) { const t = lt - q / rate; if (t < 0 || t > .9) continue; const h = hp(ch).add(V(0, 2.4 + t * 1.6, 0)); BAD.push({ kind, text: label, w3: h, s: spring(t * 2.2 * 1.6) * .8, a: clamp(1.6 - t * 1.8) }); }
  const r = rings[ring]; const t = lt - n / rate; r.visible = true; r.position.copy(ch.root.position).setY(.35); r.scale.setScalar((.6 + t * 1.6) * (ch.spec.scale || 1)); r.material.opacity = clamp(1 - t * 1.4); r.material.color.setRGB(...(kind === 'free' ? [.4, 3, 1.2] : [3, .5, 1.3])); }
const stepCues = (from, to, rate, a = 'cash_reg', b = 'coin_flip') => { const o = []; for (let t = from, i = 0; t < to; t += 1 / rate, i++) o.push([t, i % 2 ? b : a, .6]); return o; };
function money(n, cx, cy, cz, T, spread = 6, rate = 1) { for (let i = 0; i < n; i++) { const b = bills[i]; b.visible = true; const ph = ((T * .6 * rate + i * .137) % 1); b.position.set(cx + Math.sin(i * 2.3) * spread * .5, cy + 6 - ph * 7, cz + Math.cos(i * 1.7) * spread * .5); b.rotation.set(T * 2 + i, i * .7, T * 1.3 + i); } }
function confettiAt(cx, cy, cz, T, sp = 16) { confetti.forEach((c, i) => { c.visible = true; const ph = (T * .25 + i * .0618) % 1; c.position.set(cx + Math.sin(i * 7.1) * sp + Math.sin(T * 2 + i) * .8, cy + 14 - ph * 16, cz + Math.cos(i * 3.3) * sp); c.rotation.set(T * 4 + i, T * 3 + i * 2, i); }); }
function flyer(ch, x, y, z, ry, T, k = 1) { put(ch, x, y, z, ry); applyPose(ch, { lean: .5 * k, lLx: -.3, lRx: -.2, lLk: .3, lRk: .2, aLx: -.4, aRx: -.4, aLz: .5, aRz: .5, headX: -.4 * k }); ch.setFlame && ch.setFlame(1, T); }
function smokeAt(cx, cy, cz, t) { smoke.forEach((s, i) => { s.visible = t > 0; const a = i * 2.399, r = t * (3 + (i % 4)); s.position.set(cx + Math.cos(a) * r, cy + (i % 3) * .5 + t * 1.5, cz + Math.sin(a) * r); s.scale.setScalar(.5 + t * 1.6); s.material.opacity = clamp(.7 - t * .5); }); }
function holdPhone(ch, key, fn, camD = 3.2, k = 0, camD2 = null) { const a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), h = hp(ch); phone.visible = true; phone.scale.setScalar(1.05); phone.position.set(h.x + fx * 1.8, h.y - 1.25, h.z + fz * 1.8); phone.rotation.set(-.2, a, 0);
  phone.userData.scr.userData.draw(key, fn); const d = lerp(camD, camD2 ?? camD * .75, easeInOut(k)) + 2.2; cam([h.x + fx * (1.8 + d), h.y + .2, h.z + fz * (1.8 + d)], [h.x + fx * .9, h.y - .45, h.z + fz * .9], 50); }
const HOLD = { aRx: .9, aRe: 1.2, aRz: -.3, aLx: .9, aLe: 1.2, aLz: -.3, headX: .3 };
function sitChair(ch, chair, x, z, ry, T, roll = 0) { chair.visible = true; chair.position.set(x, 0, z); chair.rotation.y = ry; put(ch, x, .55, z + Math.cos(ry) * -.2, ry); applyPose(ch, { crouch: .2, lLx: 1.5, lRx: 1.5, lLk: 1.5 + Math.sin(T * 8) * .3 * roll, lRk: 1.5 - Math.sin(T * 8) * .3 * roll, aLz: .3, aRz: .3, aLe: .4, aRe: .4, lean: -.1 }); }
function machineCoins(T, on = 1) { mCoins.forEach((c, i) => { c.visible = true; const ph = ((T * (.5 + (i % 5) * .08) * on + i * .137) % 1); const a = i * 2.4, r = 1 + (i % 4) * .9; c.position.set(Math.cos(a) * r, 16.5 - ph * 9.5, Math.sin(a) * r); c.rotation.set(T * 3 * on + i, i, T * 2 * on); }); }
const drawCount = (v, green = false) => mCount.userData.draw(v + green, (c, w, h) => { c.fillStyle = green ? '#0a3a1a' : '#1a0a0a'; c.fillRect(0, 0, w, h); txt(c, v, w / 2, h / 2 + 4, 96, green ? '#22e39a' : '#ff3a4a'); });
const drawMons = (mode, T) => mons.forEach((s, i) => s.userData.draw(mode + (mode === 'cam' ? Math.floor(T * 6) % 2 : 0), (c, w, h) => { c.fillStyle = mode === 'off' ? '#05080a' : mode === 'green' ? '#0fa85a' : '#203040'; c.fillRect(0, 0, w, h); if (mode === 'off') { txt(c, 'AUS', w / 2, h / 2, 34, '#333a44'); } else if (mode === 'green') txt(c, 'FREI', w / 2, h / 2, 40, '#fff'); else { c.fillStyle = 'rgba(255,255,255,.1)'; for (let y = 0; y < h; y += 4) c.fillRect(0, y + (Math.floor(T * 6) % 2), w, 1); } }));

// ---------- capa 2D ----------
const BAD = []; const badge = (kind, text, x, y, k, a = 1, sc = 1) => BAD.push({ kind, text, x, y, s: spring(k * 1.6) * sc, a });
function pill(c, text, col, glow) { c.font = `700 54px ${FONT}`; const w = c.measureText(text).width + 120; c.shadowColor = glow; c.shadowBlur = 30; c.fillStyle = col; c.beginPath(); c.roundRect(-w / 2, -40, w, 80, 40); c.fill(); c.shadowBlur = 0; c.lineWidth = 6; c.strokeStyle = '#fff'; c.stroke();
  c.fillStyle = col; c.beginPath(); c.moveTo(-14, 38); c.lineTo(14, 38); c.lineTo(0, 58); c.fill(); const cg = c.createRadialGradient(-w / 2 + 36, -10, 4, -w / 2 + 42, 0, 40); cg.addColorStop(0, '#fffb56'); cg.addColorStop(1, '#f5c400'); c.fillStyle = cg; c.beginPath(); c.arc(-w / 2 + 42, 0, 30, 0, 7); c.fill(); c.fillStyle = '#c88a00'; c.font = `700 36px ${FONT}`; c.fillText('€', -w / 2 + 42, 2); c.fillStyle = '#fff'; c.font = `700 54px ${FONT}`; c.fillText(text, 26, 3); }
function drawBadge(b) {
  if (b.w3) { const [x, y, z] = proj(b.w3); if (z >= 1) return; b.x = x; b.y = y; } if (b.s <= .01 || b.a <= 0) return; const c = octx; c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.scale(b.s * U, b.s * U); c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  if (b.kind === 'pay') pill(c, b.text, '#ff5a85', 'rgba(255,255,255,.9)'); else if (b.kind === 'free') pill(c, b.text, '#2ee69a', 'rgba(255,255,255,.9)');
  else if (b.kind === 'big' || b.kind === 'red' || b.kind === 'green') { c.font = `700 100px ${FONT}`; const tw = c.measureText(b.text).width; if (tw > 620) { const k = 620 / tw; c.scale(k, k); }
    c.lineWidth = 22; c.strokeStyle = b.kind === 'red' ? '#5a0010' : b.kind === 'green' ? '#0a3a1a' : '#1d2238'; c.strokeText(b.text, 0, 0); const g = c.createLinearGradient(0, -50, 0, 50);
    if (b.kind === 'red') { g.addColorStop(0, '#ff6a6a'); g.addColorStop(1, '#d6202f'); } else if (b.kind === 'green') { g.addColorStop(0, '#9aff9a'); g.addColorStop(1, '#22c46a'); } else { g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#ffe07a'); } c.fillStyle = g; c.fillText(b.text, 0, 0); }
  else if (b.kind === 'tag') { c.font = `700 48px ${FONT}`; const w = c.measureText(b.text).width + 56; c.fillStyle = '#1d2238'; c.beginPath(); c.roundRect(-w / 2, -38, w, 76, 38); c.fill(); c.lineWidth = 6; c.strokeStyle = '#ffd23f'; c.stroke(); c.fillStyle = '#ffd23f'; c.fillText(b.text, 0, 3); }
  c.restore(); }
const KEY = /^(Stadt|10|Euro|Boden|Regierung|Zentimeter|Konto|Max|teuer|Minus|80|pleite|kreativ|Stelzen|Bürostühlen|Hubschrauber|Reichen|nichts|Raketenschuhe|funktioniert|Cent|Himmel|Millionen|Bürgermeister|Drohnen|Regel|1000|Lizenz|Panik|Baum|Wolkenkratzer|Seltsames|Warum|heimlich|geheimen|Rathaus|Maschine|Knopf|Bodensteuer|deaktivieren|Wachen|Kameras|gedrückt|grün|kostenlos|Helden|Steuer|Atmen|1|Sekunde|Luft|Ernst)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const walkers = (T, lt, n = 6, z0 = -30, pays = true) => { for (let i = 0; i < n; i++) { const e = ex[i + 2], s = i % 2 ? 1 : -1; walkTo(e, s * (3 + (i % 3) * 3.6), z0 - i * 5, i % 3 === 2 ? Math.PI : 0, T + i * .3, lt, 2.2); face(e, { eyes: 'open', mouth: pays ? 'frown' : 'grin', brows: pays ? -.4 : 0 }, T); if (pays && i < 3) pay(e, lt + i * .2, 2.2, 0, '-10 €', 'pay', i + 1); } };

// 1 gancho: dron aéreo sobre la avenida
shot(0, 'W', null, L => { use('G'); const cut = wt('kostet'); walkers(L.T, L.lt, 6, -36);
  if (L.T < cut) { const k = L.T / cut; cm([0, 80, 40, 0, 4, -60, 56], [1.5, 3.2, -12, 0, 3.6, -40, 50], k, q => 1 - Math.pow(1 - q, 2.2)); }
  else { const k = (L.T - cut) / (L.t1 - cut); cam([-1.5, .8, -22 + k * 2.4], [-.5, 3.6, -38 + k * 2.4], 58 * (L.T - cut < .18 ? 1 - .12 * (1 - (L.T - cut) / .18) : 1)); } RH.flag.rotation.y = Math.sin(L.T * 3) * .2; FT.userData.update(L.T); sh(V(0, 0, -60), 90); badge('big', '10 €', W / 2, H * .16, L.lt - .5); }, [[0, 'whoosh', .7], [wt('kostet') - .02, 'impact_soft', .7], [.95, 'cash_reg', .6], [1.3, 'coins', .5], [1.6, 'cash_reg', .5]]);
// 2 a ras de suelo: cada paso, -10 €
shot(wt('den', 1), 'Z', null, L => { use('G'); walkTo(ex[0], -11, -26, 0, L.T, L.lt, 2.2, false, .55); face(ex[0], { eyes: 'open', mouth: 'frown', brows: -.3 }, L.T); pay(ex[0], L.lt, 2.2, 0);
  const p = ex[0].root.position; cm([p.x + 1.5, .8, p.z + 9, p.x, 3.2, p.z, 56], [p.x + 1.2, .8, p.z + 8, p.x, 3.4, p.z, 54], L.k); sh(p, 20); }, stepCues(0, 2, 2.2));
// 3 el suelo es del gobierno: Rathaus con guardias
shot(3.46, 'S', null, L => { use('G'); FT.userData.update(L.T); guards.forEach((g, i) => { put(g, (i ? 6 : -6), 3.4, -191, 0); applyPose(g, { ...idlePose(L.T, i), aLz: .1, aRz: .1, aLx: .2, aRx: .2 }); face(g, { eyes: 'open', mouth: 'flat', brows: .5 }, L.T); });
  RH.flag.rotation.y = Math.sin(L.T * 3) * .2; cm([0, 4, -140, 0, 18, -200, 54], [0, 5, -152, 0, 18, -200, 52], L.k); badge('tag', 'EIGENTUM DER REGIERUNG', W / 2, H * .14, L.lt - .3); sh(V(0, 0, -190), 40); }, [[0, 'bell_far', .5], [.4, 'steps_heavy', .4]]);
// 4 jeder einzelne Zentimeter: el funcionario mide la acera
shot(5.30, 'C', null, L => { use('G'); put(offi, -12, 0, -10, Math.PI / 2); const k = easeInOut(clamp(L.lt / 1.2)); applyPose(offi, { crouch: .9, lLx: 1.1, lLk: 1.6, lRx: .2, lRk: 1.4, lean: .9, aRx: 1.5, aLx: 1.2, aRe: .2, headX: .3 }); face(offi, { eyes: 'squint', mouth: 'flat', brows: .4 }, L.T);
  ruler.visible = true; ruler.position.set(-9 + k * .6, .35, -10); const ra = proj(V(-9, .5, -10)); cm([-6, 1.2, -2, -10, 1.5, -10, 46], [-6.4, 1.1, -3.4, -10, 1.4, -10, 42], L.k); badge('tag', '1 CM = 10 €', W / 2, H * .15, L.lt - .2); sh(V(-10, 0, -10), 14); }, [[.1, 'tape', .6], [.8, 'stamp', .5], [1.2, 'pencil', .4]]);
// 5 jedes Mal...: la multitud camina pagando
shot(7.22, 'R', null, L => { use('G'); walkers(L.T, L.lt, 8, -26); cm([0, 4, -4, 0, 4, -40, 54], [0, 4, -8, 0, 4, -40, 52], L.k); sh(V(0, 0, -30), 30); }, [...stepCues(.1, 2.1, 2.2, 'coins', 'cash_reg'), [0, 'murmur', .4]]);
// 6 verschwinden 10 Euro von deinem Konto: el teléfono
shot(wt('verschwinden', 7), 'F', null, L => { use('G'); put(max, -11, 0, -20, .3); applyPose(max, HOLD); face(max, { eyes: 'open', mouth: 'o', brows: -.4, look: [0, -.6] }, L.T); const n = Math.min(3, Math.floor(L.lt * 2.2)); holdPhone(max, 'b' + n, (c, w, h) => drawBank(c, w, h, (120 - n * 10) + ' €', n > 0, n > 0 ? '-10 €' : null), 3.4, L.k); sh(V(-11, 0, -20), 10); }, [[.05, 'notif', .6], [.5, 'cash_reg', .6], [.95, 'coin_flip', .5], [1.4, 'cash_reg', .6]]);
// 7 Ich heiße Max: saludo
shot(11.6, 'W', null, L => { use('G'); FT.userData.update(L.T); put(max, 0, .35, -158, 0); kp(max, L.lt, [[0, { aRz: .3 }], [.2, { aRz: 2.7, aRe: .3 }]], { aRe: .3 + Math.abs(Math.sin(L.T * 9)) * .5, headZ: Math.sin(L.T * 4) * .08, ...{ lLx: 0 } }); face(max, { eyes: 'happy', mouth: 'grin' }, L.T);
  onFace(max, 13, -1.2, 1, 50, L.k, 10.5); badge('tag', 'MAX', W / 2, H * .15, L.lt - .1); sh(V(0, 0, -158), 20); }, [[0, 'pop', .6], [.2, 'cloth', .4]]);
// 8 und genau deshalb: Max camina pagando
shot(12.57, 'S', null, L => { use('G'); walkTo(max, -11, -50, 0, L.T, L.lt, 2.2, false, .55); face(max, { eyes: 'open', mouth: 'frown', brows: -.5 }, L.T); pay(max, L.lt, 2.2, 0); const p = max.root.position;
  cm([p.x + 5, 4.5, p.z + 10, p.x, 3.6, p.z, 48], [p.x + 4, 4.2, p.z + 9, p.x, 3.6, p.z, 46], L.k); sh(p, 20); }, stepCues(0, 1.5, 2.2));
// 9 unfassbar teuer — ZOOM LENTO
shot(wt('unfassbar', 12), 'C', 'slow', L => { use('G'); put(max, -11, 0, -46, .4); applyPose(max, { ...idlePose(L.T), aLx: .4, aLe: 1.2, aRx: .4, aRe: 1.2, aLz: .4, aRz: .4, headX: .15 }); face(max, { eyes: 'wide', mouth: 'teeth', brows: -.9, sweat: 1 }, L.T);
  onFace(max, 9, .2, .6, 44, L.k, 5); badge('red', 'UNFASSBAR TEUER', W / 2, H * .15, L.lt - .3); sh(V(-11, 0, -46), 15); }, [[.3, 'gasp', .5]]);
// 10 heute Morgen: se levanta de la cama
shot(15.54, 'Z', null, L => { use('BED'); const k = clamp(L.lt / 1.4); put(max, BEDP.x + lerp(0, 2.4, easeInOut(clamp((k - .5) * 2))), BEDP.y, BEDP.z + 1, Math.PI / 2 * easeInOut(clamp((k - .3) * 2)));
  max.root.rotation.x = -Math.PI / 2 * (1 - easeInOut(clamp(k * 1.6))); applyPose(max, { aLz: 2.6 * Math.sin(Math.PI * clamp(k * 1.4)), aRz: 2.6 * Math.sin(Math.PI * clamp(k * 1.4)), crouch: .6 * easeInOut(clamp(k * 1.5)), lLx: 1.4 * easeInOut(clamp(k * 1.5)), lRx: 1.4 * easeInOut(clamp(k * 1.5)), lLk: 1.4 * easeInOut(clamp(k * 1.5)), lRk: 1.4 * easeInOut(clamp(k * 1.5)) });
  face(max, { eyes: k < .4 ? 'closed' : 'half', mouth: k < .5 ? 'yawn' : 'flat' }, L.T); cm([BX + 10, 18, 14, BX - 4, 3, -6, 52], [BX + 9, 16.5, 12, BX - 4, 3, -6, 50], L.k); }, [[0, 'yawn_m', .5], [.5, 'bed_creak', .6], [1.2, 'blanket', .5]]);
// 11 Minus 10 Euro: el pie toca la alfombra
shot(17.32, 'C', null, L => { use('BED'); put(max, BEDP.x + 3.8, 0, BEDP.z + 3, Math.PI / 2); const k = easeOut(clamp(L.lt / .3)); applyPose(max, { lRx: .4 * (1 - k), lRk: .3 * (1 - k), aLz: .2 + .4 * clamp((L.lt - .3) * 3), aRz: .2 + .4 * clamp((L.lt - .3) * 3) }); face(max, { eyes: L.lt > .3 ? 'wide' : 'open', mouth: L.lt > .3 ? 'o' : 'flat', brows: -.6 }, L.T);
  const p = max.root.position, tl = easeInOut(clamp((L.lt - .4) / .7)); cm([p.x + 4, .6, p.z + 3, p.x, lerp(.6, 4.4, tl), p.z, lerp(40, 50, tl)], [p.x + 4, .6 + tl * 1.4, p.z + 3, p.x, lerp(.6, 4.4, tl), p.z, lerp(40, 50, tl)], L.k); if (L.lt > .3) pay(max, L.lt - .3, .01, 0); }, [[.3, 'land', .5], [.32, 'cash_reg', .8]]);
// 12 noch ein Schritt
shot(18.68, 'W', null, L => { use('BED'); walkTo(max, BEDP.x + 4, BEDP.z + 4, Math.PI / 2, L.T, L.lt, 2, false, .5); face(max, { eyes: 'open', mouth: 'frown', brows: -.4 }, L.T); const p = max.root.position; cm([p.x - 1, 3.6, p.z + 12, p.x, 3.4, p.z, 46], [p.x + 1.4, 3.6, p.z + 11, p.x + 1.4, 3.4, p.z, 46], L.k); pay(max, L.lt, 2, 0); }, stepCues(.05, .8, 2, 'steps', 'coin_flip'));
// 13 wieder 10 Euro: susto frontal
shot(19.52, 'C', null, L => { use('BED'); put(max, BEDP.x + 7, 0, BEDP.z + 4, 0); applyPose(max, { aLz: .7, aRz: .7, aLe: .6, aRe: .6, lean: -.15 * easeOut(clamp(L.lt * 4)) }); face(max, { eyes: 'wide', mouth: 'teeth', brows: -.8, sweat: 1 }, L.T); onFace(max, 7, 0, 0, 44 * punch(L.lt, .02, .25), 0); pay(max, L.lt, .01, 0); }, [[0, 'impact', .6], [.05, 'cash_reg', .7]]);
// 14 hasta la cocina: 80 €
shot(20.52, 'S', null, L => { use('KIT'); walkTo(max, KX - 12, 6, Math.PI * .65, L.T, L.lt, 2.4, false, .55); face(max, { eyes: 'half', mouth: 'frown', brows: -.6 }, L.T); pay(max, L.lt, 2.6, 0); const p = max.root.position;
  cm([KX + 8, 22, 18, p.x, 2, p.z, 56], [KX + 6, 20, 15, p.x, 2, p.z, 54], L.k); const n = Math.min(8, 3 + Math.floor(L.lt * 2.6)); badge('red', `-${n * 10} €`, W / 2, H * .15, 1, 1, L.lt > 1.4 ? 1.25 : 1); }, [...stepCues(0, 2.6, 2.6, 'cash_reg', 'coins'), [wt('80', 20) - 20.52, 'impact', .6]]);
// 15 fast pleite — ZOOM LENTO al teléfono 13 € → 3 €
shot(23.22, 'Z', 'slow', L => { use('KIT'); put(max, KX - 2, 0, 4, .2); applyPose(max, HOLD); face(max, { eyes: 'half', mouth: 'frown', brows: -.8, look: [0, -.5] }, L.T); const v = L.lt > .8 ? '3 €' : '13 €'; holdPhone(max, 'p' + v, (c, w, h) => drawBank(c, w, h, v, true, v === '3 €' ? 'FAST PLEITE' : '-10 €'), 4.4, L.k, 2.6); }, [[.8, 'cash_reg', .6], [.9, 'sad_tone', .4]]);
// 16 darum: la gente se volvió creativa
shot(24.89, 'R', null, L => { use('G'); sitChair(ex[4], chairs[0], 3, -40 + L.lt * 4, 0, L.T, 1); face(ex[4], { eyes: 'happy', mouth: 'grin' }, L.T); WM.visible = true; WM.position.set(-6, 24 + Math.sin(L.T * 2) * .5, -60 + L.lt * 6); WM.userData.rot.rotation.y = L.T * 30; WM.userData.tr.rotation.x = L.T * 40; put(wash, -6, WM.position.y + 2.2, WM.position.z, 0); applyPose(wash, { crouch: 1, aRz: 2.5, aRe: Math.abs(Math.sin(L.T * 8)) * .4 }); face(wash, { eyes: 'happy', mouth: 'grin' }, L.T);
  cm([2, 4, -18, 0, 10, -50, 56], [2, 4, -21, 0, 11, -50, 54], L.k); badge('tag', 'KREATIV', W / 2, H * .14, L.lt - .2); sh(V(0, 0, -40), 30); }, [[0, 'chair_roll', .6], [.3, 'heli', .5], [1.2, 'boing_metal', .4]]);
// 17 Stelzen: contrapicado
shot(26.75, 'W', null, L => { use('G'); walkTo(stil, -10, -64, 0, L.T, L.lt, 1.6, false, .45); stil.root.position.y = 7; face(stil, { eyes: 'open', mouth: 'smile' }, L.T); const p = stil.root.position, tl = easeInOut(L.k);
  cm([p.x + 3, .8, p.z + 7, p.x, lerp(2, 10, tl), p.z, 62], [p.x + 3, .8, p.z + 6, p.x, lerp(2, 11, tl), p.z, 60], L.k); badge('tag', 'STELZEN', W / 2, H * .14, L.lt - .3); sh(p, 20); }, [[0, 'wood_creak', .5], [.5, 'steps_heavy', .5], [1.1, 'wood_creak', .5], [1.6, 'steps_heavy', .4]]);
// 18 Bürostühle: fila hacia cámara
shot(29.24, 'Z', null, L => { use('G'); for (let i = 0; i < 5; i++) { const e = ex[i + 4], x = -6 + i * 3, z = -70 + L.lt * 7 - (i % 2) * 4; sitChair(e, chairs[i], x, z, 0, L.T + i, 1); face(e, { eyes: i % 2 ? 'happy' : 'open', mouth: 'grin' }, L.T); applyPose(e, { crouch: .2, lLx: 1.5, lRx: 1.5, lLk: 1.5 + Math.sin(L.T * 9 + i) * .4, lRk: 1.5 - Math.sin(L.T * 9 + i) * .4, aLz: .3, aRz: .3, aLx: .3, aRx: .3, lean: -.1 }); }
  cm([0, 3, -42, 0, 3, -62, 50], [0, 3, -45, 0, 3, -62, 48], L.k); sh(V(0, 0, -60), 30); }, [[0, 'chair_roll', .7], [.9, 'chair_roll', .5], [1.6, 'laugh_m', .4]]);
// 19 Waschmaschine → Hubschrauber: pasa por el cielo
shot(31.62, 'R', null, L => { use('G'); WM.visible = true; const x = lerp(-30, 30, L.k); WM.position.set(x, 22 + Math.sin(L.T * 3), -50); WM.rotation.set(0, Math.PI / 2, Math.sin(L.T * 2) * .1); WM.userData.rot.rotation.y = L.T * 30; WM.userData.tr.rotation.x = L.T * 40; put(wash, x, WM.position.y + 2.2, -50, Math.PI / 2); applyPose(wash, { crouch: 1, aRz: 2.5 }); face(wash, { eyes: 'happy', mouth: 'grin' }, L.T);
  cm([0, 2, -30, x * .6, 18, -50, 58], [0, 2, -31, x * .8, 20, -50, 56], L.k); sh(V(0, 0, -50), 40); }, [[0, 'heli', .7], [.6, 'whoosh', .4]]);
shot(wt('Hubschrauber', 31), 'C', null, L => { use('G'); WM.visible = true; WM.position.set(0, 20, -50); WM.rotation.set(0, .3, Math.sin(L.T * 2) * .08); WM.userData.rot.rotation.y = L.T * 30; WM.userData.tr.rotation.x = L.T * 40; put(wash, 0, 22.2, -50, .3);
  applyPose(wash, { crouch: 1, aRz: 2.6, aRe: Math.abs(Math.sin(L.T * 9)) * .5, headZ: Math.sin(L.T * 5) * .1 }); face(wash, { eyes: 'happy', mouth: 'grin' }, L.T); const h = hp(wash); cm([h.x + 6, h.y + 1, h.z + 14, h.x, h.y - 2, h.z, 46], [h.x + 5, h.y + 1, h.z + 12, h.x, h.y - 2, h.z, 44], L.k); badge('tag', 'HUBSCHRAUBER', W / 2, H * .14, L.lt - .1); sh(V(0, 20, -50), 15); }, [[0, 'impact_soft', .5], [.2, 'heli', .6], [.8, 'kids_laugh', .4]]);
// 20 die Reichen laufen ganz normal
shot(35.06, 'S', null, L => { use('G'); walkTo(rich, 13.2, -30, 0, L.T, L.lt, 2.4, false, .55); face(rich, { eyes: 'open', mouth: 'smirk', brows: .2 }, L.T); pay(rich, L.lt, 2.4, 0); money(14, 13.2, 4, -30 + L.lt * 2.4 * 1.3, L.T, 6);
  const p = rich.root.position; cm([p.x - 5, 4, p.z + 10, p.x, 3.8, p.z, 48], [p.x - 4, 4, p.z + 9, p.x, 3.8, p.z, 46], L.k); sh(p, 20); }, [...stepCues(0, 1.8, 2.4, 'cash_reg', 'coins'), [.3, 'money_rain', .4]]);
// 21 10 € no significan nada: lanza billetes riéndose
shot(36.89, 'W', null, L => { use('G'); put(rich, 11, 0, -22, -.3); kp(rich, L.lt, [[0, { aRx: .2 }], [.4, { aRx: 1.6, aRz: .6, aRe: .2 }], [.7, { aRx: 2.4, aRz: 1.2 }]], { headX: -.15 }); face(rich, { eyes: 'squint', mouth: 'grin', brows: .3 }, L.T); money(18, 11, 6, -22, L.T, 9, 1.4);
  onFace(rich, 10, 0, 1.5, 50, L.k, 8); badge('big', '10 € = NICHTS', W / 2, H * .15, L.lt - .3); sh(V(11, 0, -22), 15); }, [[.3, 'throw', .6], [.4, 'money_rain', .5], [.9, 'laugh_deep', .5]]);
// 22 aber für mich schon
shot(38.95, 'C', null, L => { use('G'); put(max, -11, 0, -30, .3); applyPose(max, { ...idlePose(L.T), aLz: .2, aRz: .2 }); face(max, { eyes: 'squint', mouth: 'frown', brows: -.7 }, L.T); onFace(max, 6, .2, -.6, 42 * punch(L.lt, .02, .22), 0); sh(V(-11, 0, -30), 12); }, [[0, 'thump', .6], [.4, 'hmm', .4]]);
// 23 Raketenschuhe: idea + soldadura en el taller
shot(39.96, 'F', null, L => { use('WORK'); put(max, WX, 0, -1.6, Math.PI); const k = L.lt; applyPose(max, k < .5 ? { aRx: 1.4, aRe: 1.6, headX: -.3 } : { aRx: 1.3, aRe: .8, aLx: 1.2, aLe: .8, lean: .25, headX: .3 }); face(max, k < .5 ? { eyes: 'wide', mouth: 'grin', brows: .2 } : { eyes: 'squint', mouth: 'flat', brows: -.3 }, L.T);
  if (k < .35) grade.uniforms.flash.value = (1 - k / .35) * .8; benchShoes.visible = true; benchShoes.position.set(WX, 5.6, -5); sparks.forEach((s, i) => { const t = (L.T * 2.5 + i * .07) % 1, a = i * 2.4; s.visible = k > .5; s.position.set(WX + .8 + Math.cos(a) * t * 3, 6 + t * 3 - t * t * 6, -5 + Math.sin(a) * t * 2); });
  cm([WX + 9, 7, 4, WX, 4.4, -2.6, 50], [WX + 8.2, 6.8, 3.4, WX, 4.4, -2.6, 48], L.k); }, [[0, 'ding_reveal', .7], [.55, 'weld', .6], [1.1, 'hammer', .5]]);
shot(wt('Raketenschuhe', 39), 'Z', null, L => { use('WORK'); benchShoes.visible = true; benchShoes.position.set(WX, 5.6, -5); benchShoes.rotation.y = .4 + L.lt * .3; put(max, WX - 2.6, 0, -1.8, Math.PI - .5); applyPose(max, { aRx: 1.3, aRe: .6, aLx: 1.1, aLe: .8, lean: .3, headX: .35 }); face(max, { eyes: 'happy', mouth: 'grin' }, L.T); cm([WX + 5, 7, 3, WX - 1.4, 5, -2.8, 46], [WX + 4.4, 6.8, 2.2, WX - 1.4, 5, -2.8, 44], L.k); badge('tag', 'RAKETENSCHUHE', W / 2, H * .14, L.lt - .2); }, [[0, 'sparkle', .6], [.5, 'click_metal', .5]]);
// 24 y funcionaron: despegue
shot(42.26, 'R', null, L => { use('G'); const t = clamp((L.lt - .4) / 1.1); put(max, 0, easeIn(t) * 12, -40, 0); applyPose(max, t > 0 ? { lean: .1, aLz: .5, aRz: .5, lLx: -.1, headX: -.2 } : { crouch: .5, lLx: .6, lRx: .6, lLk: 1, lRk: 1, aLx: .3, aRx: .3 }); max.setFlame(L.lt > .3 ? 1 : 0, L.T); face(max, { eyes: t > 0 ? 'wide' : 'squint', mouth: t > 0 ? 'grin' : 'flat', brows: t > 0 ? .3 : -.4 }, L.T); smokeAt(0, .3, -40, L.lt - .3);
  const p = max.root.position; cm([4, 2, -28, 0, p.y + 3, -40, 56], [4, 3, -29, 0, p.y + 4, -40, 54], L.k); sh(V(0, 0, -40), 20); }, [[.3, 'ignite', .8], [.4, 'jet', .7], [1.3, 'cheer', .3]]);
// 25 überallhin: vuela sobre los tejados
shot(44.16, 'W', null, L => { use('G'); const z = -20 - L.lt * 20; flyer(max, -6 + Math.sin(L.T) * 2, 26, z, Math.PI, L.T); face(max, { eyes: 'happy', mouth: 'grin' }, L.T); const p = max.root.position; cm([p.x + 4, p.y + 4, p.z + 11, p.x, p.y, p.z, 54], [p.x + 3, p.y + 3, p.z + 10, p.x, p.y, p.z, 52], L.k); sh(V(0, 0, z), 40); }, [[0, 'jet', .6], [.8, 'wind', .5], [1.4, 'whoosh_up', .4]]);
// 26 ohne einen einzigen Cent: pasa rozando hacia cámara
shot(wt('ohne', 44), 'S', null, L => { use('G'); const z = -70 + L.k * 62; flyer(max, 0, 4, z, 0, L.T, .8); face(max, { eyes: 'happy', mouth: 'grin' }, L.T); const p = max.root.position; cm([0, 3, -2, p.x, p.y + 2, p.z, 54], [0, 3, -4, p.x, p.y + 2, p.z, 52], L.k); badge('free', '0 €', W / 2, H * .17, L.lt - .2); walkers(L.T, L.lt, 4, -40, true); sh(V(0, 0, z), 25); }, [[0, 'jet', .6], [.3, 'ding_reveal', .5], [1.3, 'whoosh', .6]]);
// 27 alle bauen nach: despegan otros
shot(48.23, 'Z', null, L => { use('G'); for (let i = 0; i < 6; i++) { const e = ex[i], t = clamp((L.lt - i * .25) / 1.2); put(e, -12 + i * 4.8, easeIn(t) * 14, -60 - (i % 2) * 6, 0); applyPose(e, t > 0 ? { lean: .15, aLz: .6, aRz: .6, headX: -.2 } : { crouch: .4, lLx: .5, lRx: .5, lLk: .8, lRk: .8 }); e.setFlame(t > 0 ? 1 : 0, L.T + i); face(e, { eyes: t > 0 ? 'happy' : 'open', mouth: 'grin' }, L.T); }
  cm([0, 4, -34, 0, 8, -60, 56], [0, 5, -36, 0, 10, -60, 54], L.k); smokeAt(0, .3, -60, L.lt); sh(V(0, 0, -60), 30); }, [[.1, 'ignite', .6], [.4, 'jet', .5], [.8, 'ignite', .5], [1.3, 'jet', .5]]);
shot(wt('meine', 49), 'F', null, L => { use('WORK'); for (let i = 0; i < 3; i++) { const e = ex[8 + i]; put(e, WX - 5 + i * 5, 0, -1.6, Math.PI); applyPose(e, { aRx: 1.4 + Math.sin(L.T * 10 + i) * .4, aRe: .8, aLx: 1.1, aLe: .9, lean: .2, headX: .3 }); face(e, { eyes: 'squint', mouth: 'grin' }, L.T); } benchShoes.visible = true; benchShoes.position.set(WX, 5.6, -5);
  cm([WX + 10, 8, 5, WX, 5, -3, 54], [WX + 9, 7.6, 4, WX, 5, -3, 52], L.k); badge('tag', 'NACHGEBAUT', W / 2, H * .14, L.lt - .2); }, [[0, 'hammer', .6], [.6, 'weld', .5], [1.2, 'hammer', .5]]);
// 28 el cielo lleno de gente volando
shot(52.05, 'R', null, L => { use('G'); FT.userData.update(L.T); [max, neigh, ...ex.slice(0, 8)].forEach((e, i) => { const a = i * .9 + L.T * .25; flyer(e, Math.sin(a) * (12 + i * 2), 14 + (i % 4) * 5, -170 + Math.cos(a) * 14, a + Math.PI / 2, L.T + i); face(e, { eyes: 'happy', mouth: 'grin' }, L.T); });
  cm([0, 3, -128, 0, 18, -175, 58], [0, 3, -134, 0, 20, -175, 56], L.k); sh(V(0, 0, -170), 40); }, [[0, 'jet', .5], [.7, 'cheer', .4], [1.4, 'whoosh_up', .5]]);
// 29 la regulación pierde millones: gráfico
shot(54.42, 'S', null, L => { use('OFF'); drawGraph(clamp(L.lt / 1.4)); put(clerk, OX + 5, 0, -6, Math.PI + .5); applyPose(clerk, { aLx: 1.2, aLe: 1.6, aRx: 1.2, aRe: 1.6, aLz: .5, aRz: .5, headX: -.2 }); face(clerk, { eyes: 'wide', mouth: 'shout', brows: -.8, sweat: 1 }, L.T);
  cm([OX - 7, 8, 9, OX + 1.5, 11, -10, 54], [OX - 6, 8, 7.6, OX + 1.5, 11.4, -10, 52], L.k); }, [[0, 'alarm', .4], [.9, 'impact_soft', .6], [1.2, 'gasp', .5]]);
// 30 al alcalde no le gustó — ZOOM LENTO + puñetazo en la mesa
shot(56.75, 'W', 'slow', L => { use('OFF'); put(mayor, OX, 1.4, -3.4, 0); const hit = L.lt > 2.2; kp(mayor, L.lt, [[0, { aLx: .4, aRx: .4 }], [1.8, { aRx: 1.9, aRe: 1.2, aLx: .4, lean: -.1 }], [2.2, { aRx: .9, aRe: .2, aLx: .4, lean: .2 }]]); face(mayor, { eyes: 'squint', mouth: 'teeth', brows: .9, look: [0, 0] }, L.T); mayor.head.scale.setScalar(1 + (hit ? .04 : 0));
  cm([OX, 9.6, 6, OX, 8, -3.4, 40], [OX, 9.2, 3.6, OX, 8, -3.4, 38], L.k, easeIn); badge('tag', 'BÜRGERMEISTER', W / 2, H * .14, L.lt - .2); }, [[.2, 'growl', .4], [2.25, 'table_bang', .8]]);
// 31 al día siguiente: drones sobre el Rathaus
shot(59.76, 'Z', null, L => { use('G'); drones.forEach((d, i) => { d.visible = true; d.position.set(-22 + i * 22, 18 + easeOut(clamp(L.lt / 1.4)) * 14 + i * 2, -186 + i * 4); d.userData.rots.forEach(r => r.rotation.y = L.T * 40); d.userData.scr.userData.draw('r', (c, w, h) => { c.fillStyle = '#c8102e'; c.fillRect(0, 0, w, h); txt(c, 'NEUE REGEL!', w / 2, h / 2, 76, '#fff', '#000', 10); }); });
  cm([0, 2, -150, 0, 24, -190, 60], [0, 2, -156, 0, 26, -190, 58], L.k); sh(V(0, 0, -190), 50); }, [[0, 'drone', .7], [.6, 'alarm', .4]]);
shot(wt('Drohnen', 59), 'S', null, L => { use('G'); drones.forEach((d, i) => { d.visible = true; d.position.set(-12 + i * 12, 22 + Math.sin(L.T * 2 + i), -60 - i * 14); d.rotation.y = .2 * Math.sin(L.T + i); d.userData.rots.forEach(r => r.rotation.y = L.T * 40); }); walkers(L.T, 0, 6, -30, false);
  for (let i = 0; i < 6; i++) { const e = ex[i + 2]; applyPose(e, { headX: -.6, aRx: i % 2 ? 2.4 : 0, aLz: .2 }); face(e, { eyes: 'wide', mouth: 'o' }, L.T); } cm([0, 3, -10, 0, 18, -60, 56], [0, 3, -13, 0, 19, -60, 54], L.k); sh(V(0, 0, -40), 40); }, [[0, 'drone', .7], [.6, 'murmur', .5]]);
// 32 mit einer neuen Regel: altavoz
shot(62.79, 'C', null, L => { use('G'); const d = drones[0]; d.visible = true; d.position.set(0, 22, -50); d.userData.rots.forEach(r => r.rotation.y = L.T * 40); const sp = d.userData.spk.getWorldPosition(V(0, 0, 0)); d.userData.spk.scale.setScalar(1 + Math.abs(Math.sin(L.T * 30)) * .06);
  for (let i = 0; i < 4; i++) { const e = ex[i + 2]; put(e, -4 + i * 2.6, 0, -40 - (i % 2) * 2, Math.PI); applyPose(e, { aLx: 1.3, aLe: 2.2, aLz: .6, aRx: 1.3, aRe: 2.2, aRz: .6, headX: -.5 }); face(e, { eyes: 'squint', mouth: 'teeth', brows: -.7 }, L.T); }
  cm([sp.x + 2, 2, sp.z + 18, sp.x, sp.y - 4, sp.z, 46 * punch(L.lt, .02, .2)], [sp.x + 1.6, 2, sp.z + 16, sp.x, sp.y - 3, sp.z, 46 * punch(L.lt, .02, .2)], L.k); badge('red', 'NEUE REGEL!', W / 2, H * .15, L.lt - .1); sh(sp, 15); }, [[0, 'impact', .6], [.1, 'alarm', .5]]);
// 33 Fluglizenz 1000 € — ZOOM LENTO a la pantalla
shot(64.05, 'R', 'slow', L => { use('G'); const d = drones[1]; d.visible = true; d.position.set(0, 22, -50); d.rotation.y = 0; d.userData.rots.forEach(r => r.rotation.y = L.T * 40); d.userData.scr.userData.draw('l', (c, w, h) => { c.fillStyle = '#c8102e'; c.fillRect(0, 0, w, h); txt(c, 'FLIEGEN OHNE', w / 2, 60, 52, '#fff'); txt(c, 'LIZENZ', w / 2, 120, 60, '#fff'); txt(c, '1.000 €', w / 2, 210, 100, '#ffd23f', '#000', 12); });
  const s = d.userData.scr.getWorldPosition(V(0, 0, 0)); flyer(max, s.x + 2.4, s.y - 7, s.z + 14, Math.PI, L.T, .3); max.root.rotation.y = Math.PI; applyPose(max, { headX: -.5, aLz: .5, aRz: .5, lean: -.1 }); face(max, { eyes: 'wide', mouth: 'o', brows: -.6 }, L.T); cm([s.x, s.y - 3, s.z + 26, s.x, s.y - 1.5, s.z, 46], [s.x, s.y - 2, s.z + 17, s.x, s.y - .5, s.z, 42], L.k, easeIn); badge('big', '1.000 €', W / 2, H * .15, L.lt - 1.2); sh(s, 20); }, [[0, 'drone', .5]]);
// 34 pánico: todos caen
shot(67.02, 'W', null, L => { use('G'); [neigh, ...ex.slice(0, 6)].forEach((e, i) => { const t = L.lt; put(e, -16 + i * 5.4, Math.max(2, 22 - (i % 3) * 3 - 5 * t * t * (1 + i % 2)), -60 - (i % 2) * 6, i); e.root.rotation.z = t * (i % 2 ? 2 : -2); applyPose(e, { aLz: 2.5 + Math.sin(L.T * 14 + i) * .4, aRz: 2.5 + Math.cos(L.T * 14 + i) * .4, lLx: Math.sin(L.T * 12 + i), lRx: -Math.sin(L.T * 12 + i) }); e.setFlame(Math.sin(L.T * 30 + i) > .3 ? .5 : 0, L.T); face(e, { eyes: 'wide', mouth: 'shout', brows: -.8, sweat: 1 }, L.T); });
  cm([0, 6, -26, 0, 14, -60, 58], [0, 6, -28, 0, 13, -60, 56], L.k); sh(V(0, 0, -60), 40); }, [[0, 'shout_crowd', .5], [.4, 'whoosh', .5], [.9, 'alarm', .3]]);
// 35 uno se estrella contra un árbol
shot(68.5, 'C', null, L => { use('G'); const e = ex[3], t = clamp(L.lt / .5); put(e, lerp(-4, 12.6, t), lerp(16, 9, t), -52, Math.PI / 2); e.root.rotation.z = t < 1 ? 0 : .3; applyPose(e, t < 1 ? { lean: .6, aLx: 2.6, aRx: 2.6 } : { aLz: 1.6, aRz: 1.6, lLx: .6, lRx: -.4, headX: .3 }); face(e, t < 1 ? { eyes: 'wide', mouth: 'shout' } : { eyes: 'closed', mouth: 'o', blush: 1 }, L.T);
  crashTree.rotation.z = t >= 1 ? Math.sin((L.lt - .5) * 30) * .04 * Math.exp(-(L.lt - .5) * 4) : 0; leafP.forEach((l, i) => { const q = L.lt - .5; l.visible = q > 0; const a = i * 2.4; l.position.set(12.6 + Math.cos(a) * q * 4, 10 + q * 3 - q * q * 4, -52 + Math.sin(a) * q * 4); l.rotation.set(q * 5 + i, i, q * 3); });
  cm([2, 7, -36, 10, 8, -52, 50], [2.6, 7, -38, 10, 8, -52, 48 * punch(L.lt, .5, .2)], L.k); sh(V(12, 0, -52), 20); }, [[0, 'whoosh', .5], [.5, 'crash_wood', .8], [.55, 'leaves', .6], [1.0, 'strain', .4]]);
// 36 otro en la piscina (sin narrar: lo dice el plano) + vecino en el rascacielos
shot(70.21, 'S', null, L => { use('G'); const t = L.lt; const by = Math.max(.6, 30 - 9.8 * t * t * 1.8 - t * 4); put(neigh, TOWER.x, Math.min(TOWER.h + 18, lerp(TOWER.h - 30, TOWER.h + 18, easeOut(clamp(t / 1.2)))), TOWER.z + 1, 0); applyPose(neigh, { aRx: 3, aLz: 2.4, lLx: Math.sin(L.T * 10) * .6, lRx: -Math.sin(L.T * 10) * .6 }); neigh.setFlame(t < 1.2 ? 1 : 0, L.T); face(neigh, { eyes: 'wide', mouth: 'shout' }, L.T);
  const tl = easeInOut(L.k); cm([TOWER.x - 12, 4, TOWER.z + 40, TOWER.x, lerp(20, TOWER.h + 12, tl), TOWER.z, 56], [TOWER.x - 12, 6, TOWER.z + 40, TOWER.x, lerp(24, TOWER.h + 14, tl), TOWER.z, 52], L.k); sh(V(TOWER.x, TOWER.h, TOWER.z), 40); badge('tag', 'WOLKENKRATZER', W / 2, H * .14, L.lt - .3); }, [[0, 'jet', .4], [.7, 'wind', .6], [1.2, 'metal_hit', .5]]);
shot(wt('Wolkenkratzer', 70), 'Z', null, L => { use('G'); put(neigh, TOWER.x, TOWER.h + 13.5, TOWER.z + 1.1, 0); applyPose(neigh, { aRx: 3.0, aRe: .2, aLz: 1.8 + Math.sin(L.T * 9) * .4, lLx: Math.sin(L.T * 8) * .7, lRx: -Math.sin(L.T * 8) * .7, lLk: .5, lRk: .5 }); face(neigh, { eyes: 'wide', mouth: 'shout', brows: -.8, sweat: 1 }, L.T);
  const h = hp(neigh); cm([h.x + 5, h.y - 3, h.z + 9, h.x, h.y - 1, h.z, 46], [h.x + 4, h.y - 2.6, h.z + 7.6, h.x, h.y - 1, h.z, 44], L.k); sh(h, 15); }, [[0, 'shout_m', .5], [.5, 'wind', .6], [1.1, 'metal_creak', .5]]);
// 37 algo raro — ZOOM LENTO, Max de reojo
shot(73.75, 'C', 'slow', L => { use('G'); put(max, -11, 0, -36, .5); applyPose(max, { ...idlePose(L.T), headY: -.35, aLx: .2 }); face(max, { eyes: 'squint', mouth: 'flat', brows: -.6, look: [-.8, 0] }, L.T); onFace(max, 8, .4, 1.4, 46, L.k, 4.6); sh(V(-11, 0, -36), 12); }, [[.2, 'hmm', .5]]);
// 38 el alcalde pasea gratis con sus guardias
shot(76.07, 'W', null, L => { use('G'); walkTo(mayor, 11, -52, 0, L.T, L.lt, 2, false, .5); face(mayor, { eyes: 'happy', mouth: 'smirk', brows: .4 }, L.T); guards.forEach((g, i) => { walkTo(g, 11 + (i ? 3 : -3), -55, 0, L.T + .3, L.lt, 2, false, .5); face(g, { eyes: 'open', mouth: 'flat', brows: .5 }, L.T); });
  const p = mayor.root.position; cm([p.x - 9, 4, p.z + 11, p.x, 4.2, p.z, 50], [p.x - 8, 4, p.z + 10, p.x, 4.2, p.z, 48], L.k); sh(p, 20); }, [[0, 'steps_heavy', .5], [.6, 'steps', .4], [1.2, 'steps_heavy', .5], [1.8, 'whistle', .4]]);
// 39 kein einziger Cent: el lector marca 0 €
shot(78.25, 'R', null, L => { use('G'); READ.visible = true; readS.userData.draw('z', (c, w, h) => { c.fillStyle = '#0a2a1a'; c.fillRect(0, 0, w, h); txt(c, 'BÜRGER-', w / 2, 40, 26, '#fff'); txt(c, 'MEISTER', w / 2, 72, 26, '#fff'); txt(c, '0 €', w / 2, 150, 70, '#22e39a'); }); walkTo(mayor, 11, -46, 0, L.T, L.lt, 2, false, .5); face(mayor, { eyes: 'happy', mouth: 'grin' }, L.T); pay(mayor, L.lt, 2, 0, '0 €', 'free');
  const p = mayor.root.position; cm([7, 3, -32, 10.6, 3, -40, 46], [7.4, 3, -33, 10.6, 3, -40, 44], L.k); badge('green', '0 €', W / 2, H * .15, L.lt - .3); sh(V(11, 0, -40), 15); }, [[0, 'steps_heavy', .5], [.3, 'ding_soft', .6], [.9, 'ding_soft', .5], [1.5, 'steps_heavy', .4]]);
// 40 Warum?
shot(80.76, 'C', null, L => { use('G'); put(max, -11, 0, -30, .2); applyPose(max, { aRx: 1.1, aRe: 1.6, aRz: -.3, headZ: .2 }); face(max, { eyes: 'squint', mouth: 'o', brows: -.7 }, L.T); onFace(max, 5, .2, 0, 40 * punch(L.lt, .02, .3), 0); badge('big', 'WARUM?', W / 2, H * .15, L.lt); sh(V(-11, 0, -30), 10); }, [[0, 'impact', .7]]);
// 41 de noche: sigue el coche del alcalde
shot(81.27, 'Z', null, L => { use('G'); day(0); LIMO.visible = true; LIMO.position.set(-3, 0, -20 - L.lt * 12); LIMO.rotation.y = Math.PI; flyer(max, -1, 6.5, -17 - L.lt * 12, Math.PI, L.T, .5); face(max, { eyes: 'squint', mouth: 'flat', brows: -.5 }, L.T); cm([6, 4, -8 - L.lt * 11, -2, 4, -22 - L.lt * 12, 52], [5, 4, -10 - L.lt * 11, -2, 4, -22 - L.lt * 12, 52], L.k); sh(V(0, 0, -30), 30); }, [[0, 'car', .7], [.6, 'crickets', .4]]);
shot(wt('heimlich', 81), 'W', null, L => { use('G'); day(0); LIMO.visible = true; LIMO.position.set(-3, 0, -80 - L.lt * 14); LIMO.rotation.y = Math.PI; flyer(max, -3, 16, LIMO.position.z + 22, Math.PI, L.T, .6); face(max, { eyes: 'squint', mouth: 'flat', brows: -.5 }, L.T);
  const p = max.root.position; cm([p.x + 6, p.y + 7, p.z + 14, p.x, p.y - 6, p.z - 14, 54], [p.x + 5, p.y + 6, p.z + 12, p.x, p.y - 6, p.z - 14, 52], L.k); sh(p, 40); }, [[0, 'jet', .4], [.5, 'car', .5], [1.2, 'owl', .4]]);
// 42 la puerta LED secreta
shot(84.02, 'S', null, L => { use('G'); day(0); const t = easeInOut(clamp(L.lt / 1.2)); ledS.position.y = 6 + t * 11; LIMO.visible = true; LIMO.position.set(18 + L.lt * 6, 0, -190); LIMO.rotation.y = Math.PI / 2;
  cm([10, 4, -168, 26, 6, -190, 54], [11, 4, -170, 26, 6, -190, 52], L.k); badge('tag', 'GEHEIM', W / 2, H * .14, L.lt - .6); sh(V(26, 0, -190), 20); }, [[0, 'metal_creak', .6], [.4, 'hum', .5], [1.2, 'car', .5]]);
// 43 justo debajo del Rathaus — ZOOM LENTO con inclinación hacia abajo
shot(86.29, 'R', 'slow', L => { use('G'); day(0); ledS.position.y = 17; const tl = easeIn(L.k); cm([0, 30, -120, 0, lerp(30, 2, tl), -205, 54], [0, 22, -150, 0, lerp(30, -6, tl), -205, 48], L.k); badge('tag', 'UNTER DEM RATHAUS', W / 2, H * .14, L.lt - .3); sh(V(0, 0, -200), 50); }, [[0, 'wind', .4]]);
// 44 la sala secreta y la máquina
shot(88.02, 'F', null, L => { use('SEC'); machineCoins(L.T); drawCount('8.304.120 €'); drawMons('cam', L.T); put(max, SX - 2, 0, 14, Math.PI); applyPose(max, { ...idlePose(L.T), aLz: .3, aRz: .3, headX: -.2 }); face(max, { eyes: 'wide', mouth: 'o' }, L.T);
  cm([SX - 3, 6, 22, SX, 9, -8, 54], [SX - 2.4, 6, 19, SX, 9, -8, 52], L.k); }, [[0, 'hum', .6], [.4, 'coins', .4], [1.2, 'gears', .5], [2, 'coins', .4]]);
shot(wt('Bodenzahlung', 88), 'Z', null, L => { use('SEC'); machineCoins(L.T); drawCount('8.304.' + (120 + Math.floor(L.lt * 30) * 10) + ' €'); put(max, SX + 6.4, 0, -4, -1.2); applyPose(max, { aRx: 1.5, aRe: .2, aRz: -.3, lean: .1, headX: -.2 }); face(max, { eyes: 'wide', mouth: 'o', look: [-.6, .3] }, L.T); cm([SX + 15, 7, 8, SX + 3.5, 6, -5, 46], [SX + 13.6, 7, 7, SX + 3.5, 6, -5, 44], L.k); badge('tag', 'JEDE BODENZAHLUNG', W / 2, H * .14, L.lt - .2); }, [[0, 'coins', .6], [.5, 'cash_reg', .4], [1.0, 'coins', .5], [1.5, 'gears', .4]]);
// 45 genau in der Mitte
shot(92.49, 'S', null, L => { use('SEC'); machineCoins(L.T); drawCount('8.304.320 €'); drawMons('cam', L.T); walkTo(max, SX + 1, 16, Math.PI, L.T, L.lt, 1.6, false, .45); face(max, { eyes: 'wide', mouth: 'o' }, L.T); cm([SX + 3, 13, 28, SX, 4, 6, 50], [SX + 3, 12, 24, SX, 4, 6, 48], L.k); }, [[0, 'whoosh_soft', .5], [.4, 'hum', .5]]);
// 46 roter Knopf — ZOOM LENTO
shot(93.75, 'C', 'slow', L => { use('SEC'); machineCoins(L.T); BTN.material.emissiveIntensity = .8 + Math.sin(L.T * 8) * .5; put(max, SX, 0, 1.6, 0); applyPose(max, { lean: .2, headX: .3, aRx: .5 + L.k * .5, aRe: .4 }); face(max, { eyes: 'wide', mouth: 'flat', brows: -.4, sweat: 1, look: [0, -.4] }, L.T); cm([SX + 2, 9, 16, SX, 5.6, 6, 44], [SX + .8, 7.4, 10.5, SX, 5.6, 6, 38], L.k, easeIn); badge('tag', 'ROTER KNOPF', W / 2, H * .14, L.lt - .3); }, [[.2, 'heartbeat', .5]]);
// 47 Bodensteuer deaktivieren: la placa
shot(95.64, 'W', null, L => { use('SEC'); BTN.material.emissiveIntensity = 1; put(max, SX, 0, 1.8, 0); applyPose(max, { lean: .3, headX: .4, aLx: .5, aRx: .5 }); face(max, { eyes: 'wide', mouth: 'o', brows: -.5, look: [0, -.5] }, L.T); const p = PED.position; cm([p.x - 2.4, 4.4, p.z + 9, p.x, 4.6, p.z, 40], [p.x + 2.4, 4.4, p.z + 8.4, p.x, 4.6, p.z, 38], L.k); }, [[0, 'neon_buzz', .6], [.6, 'heartbeat', .5]]);
// 48 keine Wachen: silla vacía
shot(97.28, 'C', null, L => { use('SEC'); put(max, SX + 2, 0, 12, .3 + Math.sin(L.lt * 6) * .4); applyPose(max, { headY: Math.sin(L.lt * 6) * .6, lean: .1 }); face(max, { eyes: 'squint', mouth: 'flat', brows: -.5, look: [Math.sin(L.lt * 6), 0] }, L.T); steamP.forEach((s, i) => { s.visible = true; const t = (L.T * .5 + i / 8) % 1; s.position.set(2 + Math.sin(i + L.T) * .2, 4.5 + t * 2, 0); s.scale.setScalar(.6 + t); });
  const d = desk2.position; cm([d.x - 10, 7, d.z + 12, d.x, 3, d.z, 48], [d.x - 9, 6.4, d.z + 11, d.x, 3, d.z, 46], L.k); badge('red', 'KEINE WACHEN', W / 2, H * .15, L.lt - .1); }, [[0, 'impact_soft', .5], [.2, 'steam', .4]]);
// 49 keine Kameras: monitores apagados
shot(98.06, 'S', null, L => { use('SEC'); drawMons('off', L.T); put(max, SX - 10, 0, 2, -Math.PI / 2 - .3); applyPose(max, { headY: -.4, aLz: .3, aRz: .3 }); face(max, { eyes: 'squint', mouth: 'smirk', brows: -.3, look: [-.6, 0] }, L.T); const m = MON.position; cm([m.x + 14, 7, m.z + 9, m.x + 2, 6, m.z + 2, 50], [m.x + 12.6, 7, m.z + 8, m.x + 2, 6, m.z + 2, 48], L.k); badge('red', 'KEINE KAMERAS', W / 2, H * .15, L.lt - .1); }, [[0, 'switch', .6], [.3, 'switch', .4]]);
// 50 lo pulsé
shot(99.05, 'F', null, L => { use('SEC'); const k = clamp(L.lt / .8); put(max, SX, 0, 9.6, Math.PI); applyPose(max, { aRx: lerp(1.0, 1.6, easeIn(k)), aRe: lerp(1.2, .2, easeIn(k)), lean: .25 * k, headX: .3 }); face(max, { eyes: 'squint', mouth: 'teeth', brows: -.7 }, L.T); BTN.scale.y = .6 * (k >= 1 ? .55 : 1); BTN.material.emissiveIntensity = k >= 1 ? 3 : 1;
  cm([SX + 4, 9, 12, SX, 5.6, 6, 44 * punch(L.lt, .8, .25)], [SX + 3.4, 8.6, 11, SX, 5.6, 6, 44 * punch(L.lt, .8, .25)], L.k); if (L.lt > .8) grade.uniforms.flash.value = clamp(1 - (L.lt - .8) * 3) * .9; }, [[.3, 'cloth', .4], [.8, 'button', 1], [.82, 'boom', .6]]);
// 51 todo se ilumina y se pone verde
shot(100.64, 'Z', null, L => { use('SEC'); machineCoins(L.T, clamp(1 - L.lt)); drawCount('0 €', true); drawMons('green', L.T); bloom.strength = .3; put(max, SX + 3.5, 0, 12, Math.PI + .3); kp(max, L.lt, [[0, { aRx: 1.4 }], [.6, { aLz: 2.7, aRz: 2.7, aLe: .3, aRe: .3 }]], { headX: -.2 }); face(max, { eyes: L.lt > .5 ? 'happy' : 'wide', mouth: L.lt > .5 ? 'grin' : 'o' }, L.T); cm([SX, 8, 24, SX, 10, -8, 56], [SX, 8, 20, SX, 10, -8, 54], L.k); }, [[0, 'power_on', .7], [.6, 'ding_reveal', .5]]);
shot(wt('grün', 100), 'R', null, L => { use('G'); day(0); drawBB(L.lt > .2); walkers(L.T, 0, 4, -100, false); for (let i = 0; i < 4; i++) { applyPose(ex[i + 2], { headX: -.4, aRz: L.lt > .3 ? 2.6 : .1, aLz: L.lt > .3 ? 2.6 : .1 }); face(ex[i + 2], { eyes: L.lt > .3 ? 'happy' : 'wide', mouth: L.lt > .3 ? 'grin' : 'o' }, L.T); }
  cm([2, 4, -90, -12, 15, -112, 56], [1, 4, -92, -12, 15, -112, 52], L.k); badge('green', 'DEAKTIVIERT', W / 2, H * .14, L.lt - .3); sh(V(0, 0, -100), 30); }, [[.2, 'power_on', .6], [.5, 'cheer', .5]]);
// 52 la gente tira los zancos
shot(103.27, 'W', null, L => { use('G'); const t = clamp((L.lt - .4) / .6); put(stil, -10, 7 * (1 - easeIn(t)), -60, 0); applyPose(stil, { aRz: 2.6, aLz: 2.6, aRe: .4 }); face(stil, { eyes: 'happy', mouth: 'grin' }, L.T); sitChair(ex[5], chairs[0], -2, -58, 0, L.T); if (L.lt > .6) { put(ex[5], -2 + (L.lt - .6) * 2, Math.max(0, 1.6 - (L.lt - .6) * 3), -56, 0); applyPose(ex[5], { aLz: 2.6, aRz: 2.6, lLx: .5, lRx: -.3 }); } face(ex[5], { eyes: 'happy', mouth: 'grin' }, L.T); pay(ex[5], Math.max(0, L.lt - .6), .01, 0, 'GRATIS', 'free');
  const p = stil.root.position; cm([-4, 5, -42, -6, 5, -60, 54], [-4.4, 5, -44, -6, 5, -60, 52], L.k); sh(V(-6, 0, -60), 20); }, [[.4, 'wood_creak', .6], [.9, 'land', .6], [1.2, 'jump', .5], [1.5, 'ding_soft', .5]]);
// 53 por primera vez en años: todos caminan gratis
shot(105.33, 'S', null, L => { use('G'); walkers(L.T, L.lt, 8, -30, false); for (let i = 0; i < 3; i++) pay(ex[i + 2], L.lt + i * .2, 2.2, 0, 'GRATIS', 'free', i + 1); confettiAt(0, 6, -40, L.T, 14); cm([0, 4, -6, 0, 4, -40, 52], [0, 4, -9, 0, 4, -40, 50], L.k); sh(V(0, 0, -35), 30); }, [[0, 'confetti', .6], [.4, 'cheer', .5], [1.0, 'ding_soft', .4], [1.6, 'confetti', .5]]);
shot(wt('kostenlos', 105), 'Z', null, L => { use('G'); walkTo(ex[9], -11, -40, 0, L.T, L.lt, 2.2, false, .55); face(ex[9], { eyes: 'happy', mouth: 'grin' }, L.T); pay(ex[9], L.lt, 2.2, 0, 'GRATIS', 'free'); const p = ex[9].root.position; cm([p.x + 1.5, .8, p.z + 8, p.x, 3, p.z, 54], [p.x + 1.2, .8, p.z + 7, p.x, 3.2, p.z, 52], L.k); confettiAt(p.x, 4, p.z, L.T, 8); sh(p, 15); }, [...stepCues(0, 1.8, 2.2, 'ding_soft', 'pling')]);
// 54 el mayor héroe: la multitud levanta a Max
shot(109.2, 'F', null, L => { use('G'); FT.userData.update(L.T); put(max, 0, 6 + Math.abs(Math.sin(L.T * 4)) * 1.2, -150, 0); applyPose(max, { aLz: 2.7, aRz: 2.7, aLe: .3, aRe: .3, lLx: .2, lRx: -.2 }); face(max, { eyes: 'happy', mouth: 'grin', blush: .6 }, L.T);
  for (let i = 0; i < 8; i++) { const e = ex[i], a = i / 8 * 6.283; put(e, Math.cos(a) * 3.2, 0, -150 + Math.sin(a) * 3.2, -a + Math.PI / 2); applyPose(e, { aLz: 2.8, aRz: 2.8, aLx: .3, aRx: .3, crouch: Math.abs(Math.sin(L.T * 4 + i)) * .2 }); face(e, { eyes: 'happy', mouth: 'grin' }, L.T); }
  confettiAt(0, 10, -150, L.T, 12); onFace(max, 16, -4, 0, 50, L.k, 13); badge('big', 'HELD', W / 2, H * .15, L.lt - .3); sh(V(0, 0, -150), 20); }, [[0, 'cheer', .7], [.3, 'confetti', .6], [1.2, 'bells', .4], [1.8, 'confetti', .5]]);
// 55 a la mañana siguiente el móvil vibra
shot(111.81, 'W', null, L => { use('BED'); put(max, BEDP.x, BEDP.y, BEDP.z + 1, 0); max.root.rotation.x = -Math.PI / 2; applyPose(max, { aLz: .2, aRz: .2 }); face(max, { eyes: 'closed', mouth: 'smile' }, L.T); max.props.goggles.visible = false; phone.visible = true; phone.position.set(BX - 12, 3.4 + (Math.sin(L.T * 80) * .05), -9.6); phone.rotation.set(-Math.PI / 2, 0, Math.sin(L.T * 60) * .05);
  phone.userData.scr.userData.draw('n0', (c, w, h) => drawNotif(c, w, h, 1)); cm([BX - 1, 12, 10, BX - 9, 3, -7, 52], [BX - 2, 11, 8.6, BX - 9.4, 3, -7, 50], L.k); }, [[0, 'birds', .4], [.3, 'vibrate', .7], [1.2, 'vibrate', .6]]);
// 56 la notificación
shot(wt('vibriert', 111), 'C', null, L => { use('BED'); phone.visible = true; phone.position.set(BX - 12, 3.4 + Math.sin(L.T * 80) * .03, -9.6); phone.rotation.set(-Math.PI / 2, 0, 0); phone.userData.scr.userData.draw('n1', (c, w, h) => drawNotif(c, w, h, 1)); put(max, BEDP.x - 2.6, BEDP.y, BEDP.z - 1, -Math.PI / 2); max.props.goggles.visible = false; max.root.rotation.z = -.4; applyPose(max, { aRx: 1.6 * easeOut(clamp(L.lt * 1.5)), aRe: .3 }); face(max, { eyes: 'half', mouth: 'flat' }, L.T); cm([BX - 9, 9, -4, BX - 11.6, 3.4, -9.4, 46], [BX - 9.6, 8, -5, BX - 11.6, 3.4, -9.4, 44], L.k); }, [[0, 'notif', .8], [.1, 'impact_soft', .4]]);
// 57 eine neue Steuer: Max lee sentado en la cama
shot(114.16, 'S', null, L => { use('BED'); put(max, BEDP.x + 3, BEDP.y - 1.2, BEDP.z + 2, Math.PI / 2); max.props.goggles.visible = false; applyPose(max, { crouch: .7, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, ...HOLD }); face(max, { eyes: 'open', mouth: 'o', brows: -.4, look: [0, -.6] }, L.T); holdPhone(max, 'n1', (c, w, h) => drawNotif(c, w, h, 1), 4, L.k); badge('red', 'NEUE STEUER', W / 2, H * .15, L.lt - .1); }, [[0, 'gasp', .5], [.3, 'impact', .5]]);
// 58 Atmen: 1 € pro Sekunde — ZOOM LENTO al móvil
shot(115.2, 'R', 'slow', L => { use('BED'); put(max, BEDP.x + 3, BEDP.y - 1.2, BEDP.z + 2, Math.PI / 2); max.props.goggles.visible = false; applyPose(max, { crouch: .7, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, ...HOLD }); face(max, { eyes: 'wide', mouth: 'teeth', brows: -.8, sweat: 1, look: [0, -.6] }, L.T); holdPhone(max, 'n2', (c, w, h) => drawNotif(c, w, h, 2), 4.6, easeIn(L.k), 1.6); badge('big', '1 € / SEKUNDE', W / 2, H * .15, L.lt - .5); }, [[0, 'notif', .6]]);
// 59 contiene la respiración — ZOOM LENTO
shot(117.34, 'Z', 'slow', L => { use('BED'); put(max, BEDP.x + 3, BEDP.y - 1.2, BEDP.z + 2, Math.PI / 2); max.props.goggles.visible = false; const k = easeInOut(clamp(L.lt / 1.4)); applyPose(max, { crouch: .7, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aLx: .3, aRx: .3, headX: -.1 }); max.head.scale.set(1 + k * .08, 1, 1); face(max, { eyes: 'wide', mouth: 'flat', blush: k, brows: -.3, sweat: k > .6 ? 1 : 0 }, L.T);
  onFace(max, 9, .2, 0, 44, L.k, 4.4); }, [[.1, 'gasp', .6], [.5, 'tick', .4], [1.5, 'tick', .4]]);
// 60 das ist doch nicht euer Ernst: golpe de zoom, -1 € cada segundo
shot(119.83, null, null, L => { use('BED'); put(max, BEDP.x + 3, BEDP.y - 1.2, BEDP.z + 2, Math.PI / 2); max.props.goggles.visible = false; applyPose(max, { crouch: .7, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aLx: .2, aRx: .2 }); face(max, { eyes: 'half', mouth: 'frown', brows: -.9 }, L.T);
  onFace(max, 7, .3, 0, 44 * punch(L.lt, .05, .35), 0); pay(max, L.lt, 1, 0, '-1 €'); }, [[0, 'impact', .8], [.05, 'cash_reg', .7], [1.05, 'cash_reg', .6]]);

// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 }, TR_SFX = { W: 'whoosh', Z: 'swoosh_up', F: 'flash', S: 'swipe', R: 'whirl', I: 'iris_pop', C: 'thump' };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  else if (i > 0) CUES.push({ t: s.t0 + .05, s: ['zoom_in', 'whoosh_soft', 'zoom_out'][i % 3], g: .35 });
  if (!s.zoom && i > 1 && i % 3 === 0) { const d = (S[i + 1]?.t0 ?? DUR) - s.t0; CUES.push({ t: +(s.t0 + d * .45).toFixed(3), s: ['impact_soft', 'thump', 'zoom_in'][(i / 3) % 3], g: .6 }); }
  if (s.tr) CUES.push({ t: +(s.t1 - TRW[s.tr] / FPS).toFixed(3), s: TR_SFX[s.tr], g: .8 }); });
CUES.push({ t: .05, s: 'riser', g: .9, d: 3.3 }); CUES.push({ t: 3.42, s: 'braam', g: 1 });   // gancho
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t1: s.t1 };
  hideAll(); BAD.length = 0; s.fn(L); if (location.search.includes('noao')) ao.enabled = false;
  if (s.zoom === 'slow' || (i === 0 || i === 1)) { const e = s.zoom === 'slow' ? easeIn(L.k) : easeIn(clamp(T / 3.4)); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .85, e); camera.fov *= lerp(1, .92, e); }
  let sh_ = 0; for (const c of CUES) { if (c.t > T) break; if (['impact', 'thump', 'braam', 'boom', 'table_bang', 'crash_wood'].includes(c.s) && T - c.t < .14) sh_ = 1 - (T - c.t) / .14; }
  if (sh_) { const r = RNG(Math.floor(T * FPS) + 1); camera.position.x += (r() - .5) * .25 * sh_; camera.position.y += (r() - .5) * .25 * sh_; }
  if (!s.zoom && i > 1 && i % 3 === 0) camera.fov *= punch(lt, d * .45, .16, .16);
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
  if (tr === 'Z') { const sc = ph < 0 ? 1 + a2 * .6 : 1 + a2 * .35; octx.scale(sc, sc); octx.filter = `blur(${(a * 8).toFixed(1)}px)`; }
  if (tr === 'R') { octx.rotate((ph < 0 ? 1 : -1) * a2 * .55); octx.scale(1 + a2 * .3, 1 + a2 * .3); octx.filter = `blur(${(a * 7).toFixed(1)}px)`; }
  if (tr === 'C' && ph > 0) { const sc = 1 + a * .22; octx.scale(sc, sc); }
  octx.drawImage(renderer.domElement, -W / 2, -H / 2, W, H);
  if (tr === 'W') octx.drawImage(renderer.domElement, -W / 2 - ph * W, -H / 2, W, H); if (tr === 'S') octx.drawImage(renderer.domElement, -W / 2, -H / 2 - ph * H, W, H);
  octx.restore(); octx.filter = 'none';
  for (const b of BAD) drawBadge(b); caption(T);
}
window.renderAt = renderAt; window.DUR = DUR; window.FPS = FPS; window.CUES = CUES; window.SHOTS = S.map(s => [s.t0, s.t1, s.tr, s.zoom]); window.__ready = true;

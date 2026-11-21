// Pech — ~72 planos sincronizados con audio/words.json (1080×1920, 30 fps).
import { THREE, W, H, FPS, makeRenderer, makeComposer, applyPose, walkPose, runPose, idlePose, mixPose, V, lerp, clamp,
  easeOut, easeIn, easeInOut, spring, blinking, lip, RNG, mat, box, sphere, cyl, canvasTex, textPlane, checkTex } from './engine.js';
import { nightSky } from './sets.js';
import { rimLight } from './roblox.js';
import { FONT, noiseTex, stripes, screen, txt, building, skyscraper, tree, lamp, hydrant, bench, fountain, pool, makeExtra, limo, phoneProp } from './props.js';
import { B, gold, glass, label, makeFinn, makeBuddy, makeLightningMan, makeTycoon, makeDriver, makeBusDriver, makeMechanic, makeOfficer, makeClerkL, makeBanker, bus, sportsCar, jet, villa, rainSet, stormCloud, bolt, rainbow, suburb, country, lottoBooth, pechAmtFront, pechAmtIn, bath, vault, freeCard, ticket, wrench, phoneFall } from './pech.js';

await document.fonts.load('700 40px Cap');
const WORDS = await (await fetch('./audio/words.json')).json();
const DUR = 125.79, U = W / 720;
const stage = document.getElementById('stage'); const renderer = makeRenderer(stage); renderer.domElement.style.display = 'none';
const out = document.createElement('canvas'); out.width = W; out.height = H; stage.appendChild(out); const octx = out.getContext('2d');
const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(0xbfe3ff, .001);
const camera = new THREE.PerspectiveCamera(50, W / H, .6, 2500); const { composer, bloom, grade, ao } = makeComposer(renderer, scene, camera);
const sky = nightSky(scene); sky.sky.material.depthWrite = true; sky.clouds.forEach((c, i) => c.position.set(-800 + i * 170, 360 + (i % 3) * 70, -1400));
const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x8a8070, 1.7); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff0d8, 2.7); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0004; sun.shadow.normalBias = .3; sun.shadow.radius = 5; scene.add(sun, sun.target);
const rim = rimLight(scene);
function sh(p0, s = 30) { const q = 2 * s / 4096 * 4, p = V(Math.round(p0.x / q) * q, Math.round(p0.y / q) * q, Math.round(p0.z / q) * q); const c = sun.shadow.camera; Object.assign(c, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 700 }); c.updateProjectionMatrix(); sun.target.position.copy(p); sun.position.copy(p).add(V(-70, 140, 90)); rim.target.position.copy(p); rim.position.copy(p).add(V(60, 40, -90)); }
// ---------- ciudad ----------
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
const POOL = pool(G, -29, -84);
const glassM = []; for (const [x, z, w, h] of [[-48, -60, 22, 70], [50, -40, 20, 60], [-60, -140, 26, 110], [64, -170, 24, 90], [-40, -250, 30, 130], [40, -260, 26, 100], [-90, -40, 30, 80], [95, -110, 30, 120], [0, -330, 40, 150]]) glassM.push(skyscraper(G, x, z, w, h, w));
const TOWER = { x: 36, z: -118, h: 96 }; skyscraper(G, TOWER.x, TOWER.z, 16, TOWER.h, 16, '#9fe0ff', '#3fa8e8'); cyl(.5, .7, 20, mat(0xd8d8e0, { metalness: .8 }), 10, G, TOWER.x, TOWER.h + 10, TOWER.z); sphere(.8, mat(0xff2a2a, { emissive: 0xff2a2a, emissiveIntensity: 3 }), G, TOWER.x, TOWER.h + 20.5, TOWER.z);
for (const y of [6, 12, 17]) box(6, .3, .3, mat(0xd8d8e0, { metalness: .8 }), .05, G, TOWER.x, TOWER.h + y, TOWER.z);
const BX = 1000;
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
  const L = new THREE.PointLight(0xffe8c8, 500, 70, 2); L.position.set(0, 18, 4); g.add(L); BED.userData.L = L;
  const night = textPlane(9, 7, 180, 140, (c, w, h) => { const s = c.createLinearGradient(0, 0, 0, h); s.addColorStop(0, '#0a1240'); s.addColorStop(1, '#2a3a8a'); c.fillStyle = s; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; for (let i = 0; i < 40; i++) c.fillRect((i * 53) % w, (i * 37) % (h * .7), 2, 2); c.fillStyle = '#fff6c8'; c.beginPath(); c.arc(140, 36, 18, 0, 7); c.fill(); }, .5); night.position.set(2, 12, -13.55); g.add(night); BED.userData.night = night;
  const ns2 = new THREE.Group(); ns2.position.set(0, 0, -9); g.add(ns2); box(3.4, 4.4, 3, mat(0xd8a868), .2, ns2, 0, 2.2, 0); cyl(.5, .7, .4, mat(0xff8a23), 12, ns2, -.8, 4.6, -.6); cyl(.08, .08, 1.6, mat(0x333333), 6, ns2, -.8, 5.6, -.6); cyl(.6, 1, 1, mat(0xfff4c0, { emissive: 0xffc870, emissiveIntensity: .5 }), 16, ns2, -.8, 6.6, -.6);
  const lampL = new THREE.PointLight(0xffb060, 0, 30, 2); lampL.position.set(-.8, 7, -8); g.add(lampL); BED.userData.lampL = lampL; }
const BEDP = { x: BX - 6, y: 3.3, z: -6 };
// ---------- escenarios propios ----------
const SUBX = 300, CTX = 600, BAX = 1100, VAX = 1200, PAX = 1300;
const PA = pechAmtFront(G, -205); const FT = fountain(G, 0, -176);
const SUB = suburb(scene, SUBX); const VIL = villa(SUB.g, 0, -205, 0); const CTRY = country(scene, CTX);
const BATH = bath(scene, BAX), VLT = vault(scene, VAX), PAI = pechAmtIn(scene, PAX);
const LOT = lottoBooth(G, 12.4, -60, -Math.PI / 2);
// marquesina de autobús en la acera izquierda
const STOP = new THREE.Group(); STOP.position.set(-11.5, 0, -20); G.add(STOP); { const k = mat(0x2a2e3a, { metalness: .6 }); for (const z of [-3, 3]) cyl(.15, .15, 6, k, 8, STOP, -2, 3, z); box(4.6, .3, 7.4, mat(0x2a2e3a), .1, STOP, -1, 6.1, 0); box(.1, 4.4, 6.4, glass(), .02, STOP, -2.2, 3.4, 0); box(1.4, .3, 5, mat(0xb07a45), .05, STOP, -1.4, 1.6, 0);
  const sg = label(3, 1.2, 'BUS 13', '#ffd23f', '#1d2238', 46); sg.position.set(1.2, 5.2, 3.2); sg.rotation.y = Math.PI / 2; STOP.add(sg); const ad = textPlane(2.6, 3.6, 200, 280, (c, w, h) => { c.fillStyle = '#ff5a85'; c.fillRect(0, 0, w, h); txt(c, 'PECH?', w / 2, 70, 40, '#fff'); txt(c, '= GELD!', w / 2, 130, 40, '#ffd23f', '#1d2238', 6); c.fillStyle = '#1d2238'; c.beginPath(); c.arc(w / 2, 210, 36, 0, 7); c.fill(); }, .5); ad.position.set(-2.1, 3.4, -1.2); ad.rotation.y = Math.PI / 2; STOP.add(ad); }
// coches de la avenida
function miniCar(col) { const g = new THREE.Group(); scene.add(g); const b = mat(col, { roughness: .25, metalness: .35 }); box(4.6, 1.6, 8.4, b, .5, g, 0, 1.5, 0); box(4, 1.4, 4.4, glass(), .5, g, 0, 2.9, -.4); box(4.2, .2, 4.6, b, .1, g, 0, 3.6, -.4);
  for (const z of [-2.8, 2.8]) for (const s of [-1, 1]) { const w = cyl(.85, .85, .6, mat(0x161618), 14, g, s * 2.2, .85, z); w.rotation.z = Math.PI / 2; } for (const s of [-1, 1]) { sphere(.3, mat(0xffffff, { emissive: 0xfff4c0, emissiveIntensity: 2 }), g, s * 1.5, 1.7, 4.2); sphere(.28, mat(0xff2a2a, { emissive: 0xff2a2a, emissiveIntensity: 1.5 }), g, s * 1.6, 1.8, -4.2); }
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); return g; }
const CARS = [0xe0303a, 0x3fa8ff, 0xffd23f, 0x2ec46a, 0xffffff, 0x9b5de5].map(miniCar);
function traffic(T, n = 6) { CARS.forEach((c, i) => { if (i >= n) return; c.visible = true; const dir = i % 2 ? 1 : -1, sp = 7 + i; c.rotation.y = dir > 0 ? 0 : Math.PI; c.position.set(dir > 0 ? 3.6 : -3.6, 0, ((-200 + (T * sp * dir + i * 47) % 240 + 240) % 240) - 180); }); }
// ---------- reparto ----------
const finn = makeFinn(scene), buddy = makeBuddy(scene), lman = makeLightningMan(scene), tyc = makeTycoon(scene), drv = makeDriver(scene), bdrv = makeBusDriver(scene), mech = makeMechanic(scene), off = makeOfficer(scene), clk = makeClerkL(scene), bank = makeBanker(scene);
const ex = Array.from({ length: 12 }, (_, i) => makeExtra(scene, i));
const POOLC = [finn, buddy, lman, tyc, drv, bdrv, mech, off, clk, bank, ...ex];
// ---------- atrezo ----------
const CBUS = bus(scene, 0x2a7ad8, '13 · ZENTRUM'), SBUS = bus(scene, 0xffc21a, 'SCHULBUS'), RBUS = bus(scene, 0xc8763a, '7 · STADTRAND', true);
const LIMO = limo(scene), CAR = sportsCar(scene), JET = jet(scene), RAIN = rainSet(scene), CLOUD = stormCloud(scene), CLOUD2 = stormCloud(scene), BOLT = bolt(scene), RB = rainbow(scene), CARD = freeCard(scene), TICK = ticket(scene), WR = wrench(scene), PH = phoneFall(scene);
const phone = phoneProp(scene); const umb = new THREE.Group(); scene.add(umb); { const c = new THREE.Mesh(new THREE.ConeGeometry(2.6, 1.2, 10, 1, true), mat(0xff5a85, { side: THREE.DoubleSide })); c.position.y = 3; umb.add(c); cyl(.06, .06, 3, mat(0x333333), 6, umb, 0, 1.5, 0); }
const bills = []; const billM = mat(0xffffff, { map: canvasTex(96, 48, (c, w, h) => { c.fillStyle = '#7ad07a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a7a3a'; c.lineWidth = 4; c.strokeRect(4, 4, w - 8, h - 8); c.fillStyle = '#2a7a3a'; c.beginPath(); c.arc(w / 2, h / 2, 12, 0, 7); c.fill(); c.fillStyle = '#d8f8d8'; c.font = 'bold 18px sans-serif'; c.textAlign = 'center'; c.fillText('€', w / 2, h / 2 + 6); }), side: THREE.DoubleSide });
for (let i = 0; i < 40; i++) { const b = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .7), billM); scene.add(b); bills.push(b); }
const confetti = []; for (let i = 0; i < 140; i++) { const col = [0xff5a85, 0xffd23f, 0x3fa8ff, 0x2ec46a, 0x9b5de5, 0xff8a23][i % 6]; const c = new THREE.Mesh(new THREE.PlaneGeometry(.5, .3), new THREE.MeshStandardMaterial({ color: col, side: THREE.DoubleSide, emissive: col, emissiveIntensity: .3 })); scene.add(c); confetti.push(c); }
const smoke = []; for (let k = 0; k < 22; k++) smoke.push(sphere(1, mat(0xd8d8d8, { transparent: true, opacity: .6, roughness: 1 }), scene, 0, 0, 0, 10, 8));
const drops = []; for (let k = 0; k < 30; k++) drops.push(sphere(.25, mat(0xffffff, { emissive: 0x8fd8ff, emissiveIntensity: 1, transparent: true, opacity: .9 }), scene, 0, 0, 0, 8, 6));
const sparks = []; for (let k = 0; k < 30; k++) sparks.push(sphere(.07, B([3, 2.2, .8]), scene, 0, 0, 0, 4, 3));
const debris = []; for (let k = 0; k < 24; k++) debris.push(box(1.2 + (k % 3) * .6, .5, 1 + (k % 2) * .8, mat([0xf6d6a8, 0xb8423a, 0xffffff, 0x8a5a30][k % 4]), .1, scene));
const stars = []; for (let k = 0; k < 5; k++) { const s = new THREE.Mesh(new THREE.OctahedronGeometry(.3, 0), B([3, 2.6, .4])); scene.add(s); stars.push(s); }
const coin = cyl(.7, .7, .16, mat(0xffd23f, { metalness: .85, roughness: .2, emissive: 0x6a4a00, emissiveIntensity: .5 }), 24, scene); const clover = new THREE.Group(); scene.add(clover); for (let k = 0; k < 4; k++) { const l = sphere(.35, mat(0x2fc84a), clover, Math.cos(k * 1.57) * .32, 0, Math.sin(k * 1.57) * .32, 10, 8); l.scale.y = .3; }
const PROPS = [CBUS, SBUS, RBUS, LIMO, CAR, JET, RAIN.ps, CLOUD, CLOUD2, BOLT, RB, CARD, TICK, WR, PH, phone, umb, bills, confetti, smoke, drops, sparks, debris, stars, coin, clover, CARS, PAI.beam].flat();

// ---------- utilidades ----------
const SETS = { G, SUB: SUB.g, CTRY, BED, BATH: BATH.g, VLT: VLT.g, PAI: [PAI.g, PAI.big] };
const OUTS = ['G', 'SUB', 'CTRY'];
const use = (...n) => { for (const k of n) [].concat(SETS[k]).forEach(o => o.visible = true); if (!n.some(k => OUTS.includes(k))) { hemi.intensity = 1.0; sun.intensity = 1.0; bloom.strength = .2; } };
function day(k) { const u = sky.sky.material.uniforms; u.top.value.setRGB(.02 + .24 * k, .03 + .58 * k, .12 + .87 * k); u.mid.value.setRGB(.05 + .45 * k, .08 + .72 * k, .25 + .75 * k); u.hor.value.setRGB(.15 + .6 * k, .2 + .69 * k, .4 + .6 * k); sky.moon.material.opacity = 1 - k; sky.moon.position.set(-200, 380, -1400);
  hemi.intensity = .25 + 1.45 * k; hemi.color.setRGB(.5 + .31 * k, .55 + .35 * k, 1); sun.intensity = .4 + 2.3 * k; sun.color.setRGB(.6 + .4 * k, .7 + .24 * k, 1 - .15 * k); rim.intensity = 2.2 - .8 * k; scene.fog.color.setRGB(.05 + .7 * k, .08 + .81 * k, .2 + .8 * k); scene.fog.density = .0009;
  lampBulbs.forEach(b => b.material.emissiveIntensity = .1 + (1 - k) * 3); shops.forEach((s, i) => { s.wins[0].emissiveIntensity = (1 - k) * 1.4 * ((i % 3) ? 1 : .3); s.show.emissiveIntensity = .25 + (1 - k) * 1.5; }); bloom.strength = .26 + (1 - k) * .4; }
function storm(k) { day(1 - .62 * k); sky.moon.material.opacity = 0; const u = sky.sky.material.uniforms; u.top.value.lerp(new THREE.Color(.25, .28, .34), k); u.mid.value.lerp(new THREE.Color(.4, .43, .5), k); u.hor.value.lerp(new THREE.Color(.55, .58, .64), k); grade.uniforms.sat.value = 1.48 - .35 * k; }
function sunset(k = 1) { day(1 - .35 * k); const u = sky.sky.material.uniforms; u.top.value.lerp(new THREE.Color(.36, .32, .78), k); u.mid.value.lerp(new THREE.Color(1, .55, .45), k); u.hor.value.lerp(new THREE.Color(1, .72, .36), k); sun.color.setRGB(1, .7, .45); hemi.color.setRGB(1, .8, .7); }
function hideAll() {
  for (const c of POOLC) { c.root.visible = false; c.root.rotation.set(0, 0, 0); c.root.scale.setScalar(c.spec.scale || 1); applyPose(c, {}); c.head.scale.set(1, 1, 1); }
  for (const p of PROPS) { p.visible = false; p.rotation.set(0, 0, 0); p.scale.setScalar(1); }
  for (const k in SETS) [].concat(SETS[k]).forEach(o => o.visible = false); phone.parent !== scene && scene.attach(phone);
  SUB.houses[2].g.scale.set(1, 1, 1); SUB.houses[2].g.rotation.set(0, 0, 0); SUB.houses[2].g.visible = true; CBUS.userData.door.position.z = 9.6; RBUS.userData.door.position.z = 9.6; BED.userData.L.intensity = 500; BED.userData.night.visible = false; BED.userData.lampL.intensity = 0;
  grade.uniforms.vig.value = .3; grade.uniforms.flash.value = 0; grade.uniforms.lift.value = 0; grade.uniforms.sat.value = 1.48; day(1); ao.enabled = false; }
function put(ch, x, y, z, ry = 0) { ch.root.visible = true; ch.root.position.set(x, y, z); ch.root.rotation.set(0, ry, 0); return ch; }
function face(ch, f, T) { const s = { ...f }; if (blinking(T, ch.seed) && !['closed', 'happy'].includes(s.eyes)) s.eyes = 'closed'; ch.setFace(s); }
function kp(ch, lt, keys, extra = {}) { let p = keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const [t0, a] = keys[i], [t1, b] = keys[i + 1]; if (lt >= t0 && lt <= t1) { p = mixPose(a, b, easeInOut((lt - t0) / (t1 - t0))); break; } if (lt > t1) p = b; } applyPose(ch, { ...p, ...extra }); }
function cam(p, t, fov = 50) { camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(...t); camera.fov = fov; }
function cm(a, b, k, e = easeInOut) { const q = e(clamp(k)), L = i => lerp(a[i], b[i], q); cam([L(0), L(1), L(2)], [L(3), L(4), L(5)], lerp(a[6] ?? 50, b[6] ?? 50, q)); }
const punch = (lt, at, amt = .3, d = .18) => lt < at ? 1 : 1 - amt * easeOut((lt - at) / d) * (lt - at < .6 ? 1 : clamp(1 - (lt - at - .6) / .3));
const hp = ch => ch.head.getWorldPosition(V(0, 0, 0)); const handP = (ch, r = 1) => (r ? ch.aR : ch.aL).hand.getWorldPosition(V(0, 0, 0));
function onFace(ch, dist, dy = 0, side = 0, fov = 40, k = 0, dist2 = null) { const h = hp(ch).add(V(0, .6 * (ch.spec.scale || 1), 0)), a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), d = lerp(dist, dist2 ?? dist * .8, easeInOut(k));
  cam([h.x + fx * d + fz * side, h.y + dy, h.z + fz * d - fx * side], [h.x, h.y - .3, h.z], fov); }
const spoken = (a, b) => WORDS.filter(w => w[0] >= a - .01 && w[0] < b); const talkFace = (ch, T, a, b, f) => face(ch, { ...f, mouth: lip(T, spoken(a, b)) || f.mouth }, T);
const proj = v => { camera.updateMatrixWorld(); const p = v.clone().project(camera); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z]; };
function walkTo(ch, x0, z0, ry, T, lt, speed = 3, run = false, sp = .6, tired = 0) { const d = speed * lt; put(ch, x0 + Math.sin(ry) * d, 0, z0 + Math.cos(ry) * d, ry); applyPose(ch, run ? runPose(T, 1.0) : walkPose(T, sp, tired)); }
const wt = (w, after = 0) => { const x = WORDS.find(q => q[0] >= after - .01 && q[2].replace(/[.,:?!„“"]/g, '').toLowerCase().startsWith(w.toLowerCase())); if (!x) throw new Error('word ' + w); return x[0]; };
const ST = {}; for (const w of WORDS) if (!(w[3] in ST)) ST[w[3]] = w[0]; const st = n => ST[n];
function money(n, cx, cy, cz, T, spread = 6, rate = 1) { for (let i = 0; i < n; i++) { const b = bills[i % bills.length]; b.visible = true; const ph = ((T * .6 * rate + i * .137) % 1); b.position.set(cx + Math.sin(i * 2.3) * spread * .5, cy + 6 - ph * 7, cz + Math.cos(i * 1.7) * spread * .5); b.rotation.set(T * 2 + i, i * .7, T * 1.3 + i); } }
function confettiAt(cx, cy, cz, T, sp = 16) { confetti.forEach((c, i) => { c.visible = true; const ph = (T * .25 + i * .0618) % 1; c.position.set(cx + Math.sin(i * 7.1) * sp + Math.sin(T * 2 + i) * .8, cy + 14 - ph * 16, cz + Math.cos(i * 3.3) * sp); c.rotation.set(T * 4 + i, T * 3 + i * 2, i); }); }
function smokeAt(cx, cy, cz, t, col = null, sc = 1) { smoke.forEach((s, i) => { s.visible = t > 0; const a = i * 2.399, r = (t * (3 + (i % 4))) * sc; s.position.set(cx + Math.cos(a) * r, cy + ((i % 3) * .5 + t * 1.5) * sc, cz + Math.sin(a) * r); s.scale.setScalar((.5 + t * 1.6) * sc); s.material.opacity = clamp(.7 - t * .45); if (col) s.material.color.set(col); else s.material.color.set(0xd8d8d8); }); }
function splashAt(c, t, sc = 1) { drops.forEach((d, k) => { const a = k * 2.399, v = (4 + (k % 5)) * sc; d.visible = t > 0 && t < 1.4; d.position.set(c.x + Math.cos(a) * t * 3 * sc, c.y + v * t - 9 * t * t * sc, c.z + Math.sin(a) * t * 3 * sc); d.scale.setScalar(sc); }); }
function sparksAt(c, T) { sparks.forEach((s, k) => { const t = (T * 2.4 + k * .137) % 1, a = k * 2.399; s.visible = true; s.position.set(c.x + Math.cos(a) * t * 2.4, c.y + 2.4 * t - 4 * t * t, c.z + Math.sin(a) * t * 2.4); }); }
function starsAt(ch, T) { const h = hp(ch); stars.forEach((s, k) => { s.visible = true; const a = T * 4 + k * 1.256; s.position.set(h.x + Math.cos(a) * 1.3, h.y + 1.9, h.z + Math.sin(a) * 1.3); s.rotation.set(T * 3, T * 2, 0); }); }
function holdPhone(ch, key, fn, camD = 3.2, k = 0, camD2 = null, side = 0) { const a = ch.root.rotation.y, fx = Math.sin(a), fz = Math.cos(a), h = hp(ch); phone.visible = true; phone.scale.setScalar(1.05); phone.position.set(h.x + fx * 1.6, h.y - 1.0, h.z + fz * 1.6); phone.rotation.set(-.15, a, 0);
  phone.userData.scr.userData.draw(key, fn); const d = lerp(camD, camD2 ?? camD * .75, easeInOut(k)) + 2.2; cam([h.x + fx * (1.6 + d) + fz * side, h.y + .3, h.z + fz * (1.6 + d) - fx * side], [h.x + fx * .8, h.y - .35, h.z + fz * .8], 50); }
function phoneClose(key, fn, k, at, ry = 0) { phone.visible = true; phone.position.copy(at); phone.rotation.set(0, ry, 0); phone.userData.scr.userData.draw(key, fn); const d = lerp(4.3, 3.6, easeInOut(k)); cam([at.x + Math.sin(ry) * d + .3, at.y - .25, at.z + Math.cos(ry) * d], [at.x, at.y - .55, at.z], 40); }
const HOLD = { aRx: .95, aRe: 1.25, aRz: -.3, aLx: .95, aLe: 1.25, aLz: -.3, headX: .3 };
const SIT = { crouch: .2, lLx: 1.5, lRx: 1.5, lLk: 1.5, lRk: 1.5, aLz: .15, aRz: .15 };
const sit = (ch, x, y, z, ry, extra = {}) => { const s = ch.spec.scale || 1; put(ch, x, y - (2.05 - .2) * s + .08, z, ry); applyPose(ch, { ...SIT, ...extra }); };
const CHEER = { aLx: 2.8, aRx: 2.8, aLz: .5, aRz: .5, aLe: .2, aRe: .2 };
const SHRUG = { aLz: .9, aRz: .9, aLe: 1.4, aRe: 1.4, aLx: .3, aRx: .3, headZ: .15 };
const POINT = { aRx: 1.55, aRe: .05, aRz: .1 };
const FACEPALM = { aRx: 2.3, aRe: 2.1, aRz: -.4, headX: .25 };
// pantallas del teléfono
const scrBG = (c, w, h, a = '#14213d', b = '#2a4a8a') => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.fillRect(0, 0, w, h); };
function wrapTxt(c, s, x, y, maxW, size, col, lh = 1.2) { c.font = `700 ${size}px ${FONT}`; const ws = s.split(' '); let line = '', yy = y; const out = []; for (const w of ws) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } out.push(line); out.forEach((l, i) => txt(c, l, x, yy + i * size * lh, size, col)); }
const drawLock = (c, w, h) => { scrBG(c, w, h); txt(c, '23:47', w / 2, 120, 76, '#fff'); c.fillStyle = 'rgba(255,255,255,.94)'; c.beginPath(); c.roundRect(18, 210, w - 36, 170, 26); c.fill(); c.fillStyle = '#1aa88a'; c.beginPath(); c.roundRect(36, 228, 50, 50, 12); c.fill(); txt(c, '!', 61, 254, 36, '#fff');
  c.textAlign = 'left'; c.font = `700 24px ${FONT}`; c.fillStyle = '#1aa88a'; c.fillText('PECH-AMT', 100, 254); c.fillStyle = '#1d2238'; c.font = `700 30px ${FONT}`; c.fillText('1 neue Nachricht', 40, 320); c.font = `700 22px ${FONT}`; c.fillStyle = '#7a7a8a'; c.fillText('jetzt', 40, 356); };
const drawCongr = (c, w, h) => { scrBG(c, w, h, '#0e3a30', '#1aa88a'); txt(c, 'PECH-AMT', w / 2, 70, 34, '#7affd8'); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w / 2, 200, 70, 0, 7); c.fill(); txt(c, '★', w / 2, 204, 90, '#c88a00'); txt(c, 'GLÜCKWUNSCH,', w / 2, 330, 40, '#fff'); txt(c, 'FINN!', w / 2, 400, 78, '#ffd23f', '#0e3a30', 8); };
const drawTitle = (c, w, h) => { scrBG(c, w, h, '#0e3a30', '#1aa88a'); txt(c, 'OFFIZIELL:', w / 2, 90, 34, '#7affd8'); wrapTxt(c, 'DER GRÖSSTE PECHVOGEL', w / 2, 200, w - 50, 46, '#fff'); txt(c, 'ALLER ZEITEN', w / 2, 360, 44, '#ffd23f', '#0e3a30', 6); c.fillStyle = '#ffd23f'; c.beginPath(); c.moveTo(w / 2 - 60, 440); c.lineTo(w / 2 + 60, 440); c.lineTo(w / 2 + 40, 520); c.lineTo(w / 2 - 40, 520); c.fill(); c.fillRect(w / 2 - 12, 520, 24, 26); c.fillRect(w / 2 - 50, 546, 100, 16); };
const drawQuote1 = (c, w, h) => { scrBG(c, w, h, '#1d2238', '#3a2a6a'); txt(c, '„', 50, 90, 90, '#ffd23f'); wrapTxt(c, 'In einer Welt, in der Pech reich macht,', w / 2, 200, w - 50, 44, '#fff'); txt(c, '…', w / 2, 470, 60, '#ffd23f'); };
const drawQuote2 = (c, w, h) => { scrBG(c, w, h, '#1d2238', '#3a2a6a'); wrapTxt(c, 'ist perfektes Glück', w / 2, 140, w - 50, 46, '#fff'); wrapTxt(c, 'DAS GRÖSSTE PECH', w / 2, 290, w - 40, 54, '#ffd23f'); txt(c, 'VON ALLEN.', w / 2, 460, 50, '#ff5a85'); };
const drawPA = (mode, k = 0) => PAI.big.userData.draw(mode + Math.round(k * 20), (c, w, h) => { c.fillStyle = '#0a1a24'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(122,255,216,.12)'; for (let x = 0; x < w; x += 40) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
  if (mode === 'scan') { txt(c, 'GESICHTS-SCAN', w / 2, 60, 46, '#7affd8'); c.strokeStyle = '#7affd8'; c.lineWidth = 8; c.strokeRect(w / 2 - 130, 110, 260, 290); c.fillStyle = '#f6d2b8'; c.fillRect(w / 2 - 100, 140, 200, 230); c.fillStyle = '#1d2238'; c.fillRect(w / 2 - 60, 220, 30, 30); c.fillRect(w / 2 + 30, 220, 30, 30); c.fillStyle = '#ff3a4a'; c.fillRect(w / 2 - 130, 110 + 290 * k, 260, 10); txt(c, Math.round(k * 100) + '%', w - 120, h - 60, 56, '#fff'); }
  else { txt(c, 'PECH-METER', w / 2, 60, 50, '#7affd8'); c.lineWidth = 40; c.strokeStyle = '#2a3a4a'; c.beginPath(); c.arc(w / 2, 360, 200, Math.PI, 0); c.stroke(); c.strokeStyle = '#ff3a4a'; c.beginPath(); c.arc(w / 2, 360, 200, Math.PI, Math.PI + .05); c.stroke(); c.strokeStyle = '#fff'; c.lineWidth = 10; c.beginPath(); c.moveTo(w / 2, 360); c.lineTo(w / 2 - 180, 352); c.stroke(); txt(c, '0% PECH', w / 2, 300, 96, '#ff3a4a', '#000', 10); } });
const drawLotto = (on, T) => LOT.userData.scr.userData.draw(on + (on ? Math.floor(T * 8) % 2 : 0), (c, w, h) => { c.fillStyle = on && Math.floor(T * 8) % 2 ? '#ffd23f' : '#1d2238'; c.fillRect(0, 0, w, h); txt(c, on ? 'JACKPOT!' : 'LOTTO', w / 2, h / 2 - 20, on ? 70 : 60, on && Math.floor(T * 8) % 2 ? '#d8323a' : '#ffd23f'); txt(c, on ? '5.000.000 €' : 'HEUTE: 5 MIO', w / 2, h / 2 + 50, 34, '#fff', '#1d2238', 6); });
// accesorios de "pechvogel" (vendas)
const bandage = new THREE.Mesh(new THREE.TorusGeometry(.78, .16, 8, 24), mat(0xffffff, { roughness: .9 })); scene.add(bandage); const cast_ = box(1.0, 1.6, 1.0, mat(0xf4f4f4, { roughness: .9 }), .2, scene); const sack = sphere(1.1, mat(0xb8864a, { roughness: .9 }), scene, 0, 0, 0, 14, 10); const sackTag = cyl(.4, .4, .1, gold(), 16, sack, 0, .2, 1.05); sackTag.rotation.x = Math.PI / 2; PROPS.push(bandage, cast_, sack);
const bandOn = ch => { bandage.visible = true; const h = hp(ch); bandage.position.copy(h).add(V(0, 1.0 * (ch.spec.scale || 1), 0)); bandage.rotation.set(Math.PI / 2 + .15, 0, .2); };
const castOn = (ch, r = 0) => { cast_.visible = true; cast_.position.copy((r ? ch.aR : ch.aL).el.getWorldPosition(V(0, 0, 0))).add(V(0, -.35, 0)); cast_.rotation.copy(ch.root.rotation); };
const sackOn = (ch, r = 1) => { sack.visible = true; sack.position.copy(handP(ch, r)).add(V(0, -.9, .3)); };
const drawBank2 = (c, w, h, s) => { scrBG(c, w, h, '#0a3a1a', '#1fae5a'); txt(c, 'MEINE BANK', w / 2, 60, 34, '#fff'); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w / 2, 170, 50, 0, 7); c.fill(); txt(c, '€', w / 2, 172, 58, '#c88a00'); txt(c, 'KONTOSTAND', w / 2, 270, 30, '#c8f8d8'); c.font = `700 80px ${FONT}`; const k = Math.min(1, (w - 30) / c.measureText(s).width); txt(c, s, w / 2, 350, 80 * k, '#fff'); txt(c, '+ GUTSCHRIFT: PECH-AMT', w / 2, 440, 22, '#ffd23f'); };

// ---------- capa 2D ----------
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
const KEY = /^(Stadt|bezahlt|Pech|Bus|100|Euro|Regen|500|Haus|zerstört|1|Million|Pechvögel|Reichsten|Nachbar|dreimal|Blitz|Villa|reichste|Privatjet|Pool|50|Millionen|ich|Finn|Problem|nie|Gutes|Schulbus|Endlich|Limousine|umsonst|0|Gewitter|klitschnass|Regenbogen|Lotterielos|verlieren|Jackpot|Kind|gesperrten|Sparkonto|pleite|Freund|Handy|Klo|10000|10\.000|Sportwagen|reicht's|Pech-Amt|Gesicht|lachen|0%|fassen|letztes|Bus|Motor|Mechaniker|10|Sekunden|Freikarte|lebenslange|geschlagen|reich|perfekt|Schlechtes|Handy|Nachricht|Glückwunsch|Pechvogel|erstarre|Glück|Milliarde|Konto|froh)$/;
const CAPS = WORDS.map(w => { const t = w[2].replace(/[„“"”.,!?:…–]/g, '').trim(); return { t: w[0], txt: t, key: KEY.test(t) }; }).filter(w => w.txt);
function caption(T) { let cur = null; for (const w of CAPS) { if (w.t <= T) cur = w; else break; } if (!cur) return;
  const f = (T - cur.t) * FPS, s = f < 1 ? .2 : f < 2 ? 1.12 : 1, size = H * .046 * (cur.key ? 1.35 : 1), c = octx;
  c.save(); c.translate(W / 2, H * .74); c.scale(s, s); c.font = `700 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  const tw = c.measureText(cur.txt).width; if (tw > W * .9) { const k = W * .9 / tw; c.scale(k, k); }
  c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 14; c.shadowOffsetY = 6; c.lineWidth = size * .24; c.strokeStyle = '#000'; c.strokeText(cur.txt, 0, 0); c.shadowColor = 'transparent'; c.fillStyle = '#E2FD07'; c.fillText(cur.txt, 0, 0); c.restore(); }

// ---------- planos ----------
// ---------- planos ----------
const S = []; const shot = (t0, tr, zoom, fn, sfx = []) => S.push({ t0, tr, zoom, fn, sfx });
const bubble = (ch, text, k, dy = 2.4) => BAD.push({ kind: 'bubble', text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1) + .6, 0)), s: spring(k * 1.6), a: 1 });
const pillOn = (ch, text, k, kind = 'free', dy = 2.6) => BAD.push({ kind, text, w3: hp(ch).add(V(0, dy * (ch.spec.scale || 1), 0)), s: spring(k * 1.6) * .9, a: clamp(k * 6) });
const walkers = (T, lt, n = 8, z0 = -10, skip = []) => { for (let i = 0; i < n; i++) { if (skip.includes(i)) continue; const e = ex[i], s = i % 2 ? 1 : -1; walkTo(e, s * (10 + (i % 3) * 1.6), z0 - i * 9, i % 3 === 2 ? Math.PI : 0, T + i * .3, lt, 2.4); face(e, { eyes: 'open', mouth: i % 3 ? 'smile' : 'flat' }, T + i); } };
const H0 = SUB.houses[0], H2 = SUB.houses[2];   // casa de Finn (izquierda, z=20) y la casa que se derrumba
const FH = V(SUBX - 25, 0, 20);   // puerta de Finn ≈ (SUBX-25+6.6, 0, 20+...) — la casa mira a +x

// 1 GANCHO: golpe de zoom con "ding" y dron sobre la avenida (como la referencia: calle larga, rascacielos al fondo, gente y coches)
shot(0, 'C', null, L => { use('G'); walkers(L.T, L.lt, 12, 30); traffic(L.T + 3); FT.userData.update(L.T);
  const z0 = .32; if (L.T < z0) { const k = easeOut(L.T / z0); cam([0, lerp(70, 44, k), lerp(110, 62, k)], [0, 0, -70], lerp(74, 50, k)); } else cm([0, 44, 62, 0, 0, -70, 50], [0, 38, 44, 0, 0, -80, 48], (L.T - z0) / (L.t1 - z0), q => q);
  sh(V(0, 0, -20), 70); badge('tag', 'PECH = GELD', W / 2, H * .14, L.lt - .9); }, [[0, 'zoom_fast', .9], [.02, 'whoosh', .6], [.3, 'city_amb', .6], [.9, 'car_pass', .5], [1.6, 'steps', .4], [2.2, 'car_pass', .4]]);
// 2 Bus verpasst? → +100 €
shot(st(2), 'W', null, L => { use('G'); const turn = st(3) - L.t0; CBUS.visible = true; CBUS.rotation.y = Math.PI; CBUS.position.set(-4.2, 0, -26 - L.lt * 9); traffic(L.T, 0);
  if (L.lt < turn) { walkTo(ex[0], -9.6, -12, Math.PI, L.T, L.lt, 4.6, true); face(ex[0], { eyes: 'wide', mouth: 'shout', brows: -.5, sweat: 1 }, L.T); } else { put(ex[0], -9.6, 0, -12 - turn * 4.6, 0); applyPose(ex[0], CHEER); face(ex[0], { eyes: 'happy', mouth: 'grin' }, L.T); pillOn(ex[0], '+100 €', L.lt - turn); }
  const p = ex[0].root.position; cm([p.x + 5, 4.6, p.z + 9, p.x - 1, 3.8, p.z - 4, 50], [p.x + 4.4, 4.4, p.z + 8, p.x - 1, 3.8, p.z - 4, 48], L.k); sh(p, 26); }, [[0, 'steps_run', .6], [.2, 'car', .6], [.5, 'whistle', .4], [st(3) - st(2), 'cash', .8], [st(3) - st(2) + .1, 'coins', .6]]);
// 3 Vom Regen erwischt? → +500 €
shot(st(4), 'Z', null, L => { use('G'); storm(.6); const turn = st(5) - L.t0; put(ex[1], 10.4, 0, -40, -.4); CLOUD.visible = true; CLOUD.position.set(10.4, 15, -40); CLOUD.scale.setScalar(.7); RAIN.at(V(10.4, 0, -40), L.T, .6, 3.6, 13);
  umb.visible = true; umb.position.copy(handP(ex[1])).add(V(0, -.6, 0)); umb.rotation.set(lt2(L.lt) * Math.PI, 0, .3);
  if (L.lt < turn) { applyPose(ex[1], { aRx: 2.4, aRe: .4, aLz: .5, headX: -.3 }); face(ex[1], { eyes: 'squint', mouth: 'frown', brows: -.6 }, L.T); } else { applyPose(ex[1], { ...CHEER, aRx: 2.4 }); face(ex[1], { eyes: 'happy', mouth: 'grin' }, L.T); pillOn(ex[1], '+500 €', L.lt - turn); }
  onFace(ex[1], 13, -.6, 2.4, 46, L.k, 11); sh(V(10, 0, -40), 20); }, [[0, 'rain', .7], [.3, 'wind', .5], [.5, 'rip', .5], [st(5) - st(4), 'cash_reg', .8], [st(5) - st(4) + .15, 'coins', .5]]);
function lt2(lt) { return clamp((lt - .35) / .3); }
// 4 Und wenn dein Haus zerstört wird? (se derrumba)
shot(st(6), 'R', null, L => { use('SUB'); const c = V(SUBX - 25, 0, -4), k = clamp((L.lt - .45) / .7); H2.g.scale.set(1 + k * .15, 1 - k * .82, 1 + k * .1); H2.g.rotation.z = k * .12; smokeAt(c.x + 4, 1, c.z, k > 0 ? k * 1.2 : 0, 0xc8b8a0, 1.6);
  debris.forEach((d, i) => { d.visible = k > 0; const a = i * 2.4, t = k * 1.4; d.position.set(c.x + 8 + Math.cos(a) * t * 7, Math.max(.3, 6 + 8 * t - 9 * t * t + (i % 3)), c.z + Math.sin(a) * t * 7); d.rotation.set(t * 4 + i, i, t * 3); });
  put(ex[2], SUBX - 7, 0, 2, -Math.PI / 2 + .7); applyPose(ex[2], k > .1 ? { aLz: 1.4, aRz: 1.4, aLe: 1.6, aRe: 1.6, lean: -.15 } : { aRx: .4 }); face(ex[2], k > .1 ? { eyes: 'wide', mouth: 'o', brows: -.6 } : { eyes: 'open', mouth: 'smile' }, L.T);
  cm([SUBX + 4, 6, 14, SUBX - 18, 5, -4, 52], [SUBX + 2, 5.4, 12, SUBX - 18, 4.4, -4, 50], L.k); sh(V(SUBX - 14, 0, 0), 30); }, [[0, 'birds', .4], [.4, 'rumble', .8], [.55, 'collapse', .9], [.8, 'glass_break', .5], [1.0, 'rubble', .6], [1.2, 'gasp', .5]]);
// 5 1 Million Euro: llueve dinero sobre el dueño
shot(st(7), 'F', null, L => { use('SUB'); H2.g.scale.set(1.15, .18, 1.1); H2.g.rotation.z = .12; put(ex[2], SUBX - 7, 0, 2, Math.PI / 2 - .3); const j = Math.abs(Math.sin(L.lt * 6)) * 1.2; ex[2].root.position.y = j; applyPose(ex[2], { ...CHEER, lLk: j * .6, lRk: j * .6 }); face(ex[2], { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T);
  money(40, SUBX - 7, 4, 2, L.T, 9, 1.4); onFace(ex[2], 12, .4, -2, 48, L.k, 10); badge('green', '+1.000.000 €', W / 2, H * .17, L.lt - .15); sh(V(SUBX - 7, 0, 2), 20); }, [[0, 'money_rain', .8], [.1, 'cash', .9], [.3, 'cheer', .5], [.8, 'coins', .6], [1.2, 'cash_reg', .6]]);
// 6 Deshalb sind die größten Pechvögel hier die Reichsten: vendado, escayola y saco de dinero
shot(st(8), 'S', null, L => { use('G'); traffic(L.T, 3); walkTo(ex[3], -10.6, -48, 0, L.T, L.lt, 1.6, false, .45, .3); applyPose(ex[3], { ...walkPose(L.T, .45, .3), aRx: .3, aRe: .4, aLx: .9, aLe: 1.4 }); bandOn(ex[3]); castOn(ex[3], 0); sackOn(ex[3], 1); face(ex[3], { eyes: 'happy', mouth: 'grin' }, L.T);
  walkTo(ex[4], -13, -56, 0, L.T + .4, L.lt, 1.4, false, .45); face(ex[4], { eyes: 'open', mouth: 'grin' }, L.T); bubble(ex[4], '+50.000 €', L.lt - .9, 2.2);
  const p = ex[3].root.position, kk = wt('Reichsten', st(8)) - L.t0; onFace(ex[3], 13, .2, 3, 46 * punch(L.lt, kk, .22), L.k, 11); money(10, p.x, p.y + 5, p.z, L.T, 4); sh(p, 26); badge('tag', 'PECHVÖGEL = REICH', W / 2, H * .14, L.lt - .3); }, [[0, 'steps', .5], [.4, 'coins', .6], [1.2, 'cash', .6], [wt('Reichsten', st(8)) - st(8), 'impact', .7]]);
// 7 Mein Nachbar: tres rayos
const B1 = st(9), B3 = wt('dreimal', B1); const strikes = [B3 - B1 - .5, B3 - B1 + .05, B3 - B1 + .55];
shot(st(9), 'C', null, L => { use('SUB'); storm(.8); put(lman, SUBX + 9, 0, -30, -Math.PI / 2 + .5); CLOUD.visible = true; CLOUD.position.set(SUBX + 9, 22, -30);
  const hit = strikes.findIndex(s => L.lt >= s && L.lt < s + .16), n = strikes.filter(s => L.lt >= s).length; BOLT.visible = hit >= 0; BOLT.position.set(SUBX + 9, 22, -30); BOLT.scale.setScalar(.95); if (hit >= 0) grade.uniforms.flash.value = .22;
  applyPose(lman, n ? { aLz: 1.8 + Math.sin(L.T * 40) * .2, aRz: 1.8 - Math.sin(L.T * 40) * .2, lLx: .2, lRx: -.2, headZ: Math.sin(L.T * 30) * .1 } : { aLz: .1, aRz: .1, headX: -.4 }); face(lman, n ? { eyes: 'wide', mouth: 'shout', soot: 1, brows: -.5 } : { eyes: 'open', mouth: 'o', headX: -.4 }, L.T); if (n) starsAt(lman, L.T);
  onFace(lman, 13, 1, -2, 50, L.k, 12); if (n) badge('red', n + '×', W / 2, H * .16, L.lt - strikes[n - 1]); sh(V(SUBX + 9, 0, -30), 20); }, [[0, 'rumble', .6], ...strikes.flatMap(s => [[s, 'zap', .8], [s + .02, 'thump', .7]]), [strikes[2] + .3, 'shout_m', .4]]);
// 8 Jetzt gehört ihm eine Villa
shot(wt('jetzt', B1), 'W', null, L => { use('SUB'); put(lman, SUBX + 1, 0, -184, 0); applyPose(lman, { ...CHEER, aLx: 2.2, aRx: 2.2 }); face(lman, { eyes: 'happy', mouth: 'grin', soot: 1 }, L.T); starsAt(lman, L.T); put(ex[5], SUBX - 5, 0, -190, .5); applyPose(ex[5], { aRx: 1.3, aRe: .8 }); face(ex[5], { eyes: 'open', mouth: 'smile' }, L.T);
  cm([SUBX + 14, 3, -160, SUBX, 12, -200, 56], [SUBX + 8, 3.4, -162, SUBX, 12, -200, 54], L.k); badge('tag', 'VILLA', W / 2, H * .14, L.lt - .3); sh(V(SUBX, 0, -195), 40); }, [[0, 'sparkle', .6], [.3, 'cheer', .4], [.8, 'birds', .4]]);
// 9 el hombre más rico de la ciudad, en su piscina
const PP = V(SUBX - 70, 0, -100); POOL.parent.remove(POOL); SUB.g.add(POOL); POOL.position.set(-70, 0, -100);
shot(st(10), 'Z', null, L => { use('SUB'); put(tyc, PP.x - 5, 0, PP.z + 6, .5); applyPose(tyc, { aRx: 1.4, aRe: 1.5, headX: -.05, ...idlePose(L.T) }); face(tyc, { eyes: 'open', mouth: 'smirk', brows: .2 }, L.T); put(ex[6], PP.x + 4, 0, PP.z + 8, -.6); applyPose(ex[6], { aLx: 1.2, aLe: .6 }); face(ex[6], { eyes: 'open', mouth: 'smile' }, L.T);
  onFace(tyc, 15, 1.5, 4, 48, L.k, 13); badge('tag', 'REICHSTER MANN', W / 2, H * .14, L.lt - .3); money(6, PP.x - 5, 4, PP.z + 6, L.T, 3, .5); sh(PP, 24); }, [[0, 'water_bloop', .4], [.3, 'coins', .5], [.8, 'sip', .5]]);
// 10 su jet privado cae en picado (zoom lento + riser → golpe)
const CR = wt('Pool', st(11));
shot(st(11), 'C', 'slow', L => { use('SUB'); const k = easeIn(L.k); JET.visible = true; JET.scale.setScalar(.85); JET.position.set(lerp(PP.x + 30, PP.x, k), lerp(46, 1, k), lerp(PP.z - 20, PP.z, k)); JET.rotation.set(.6, -Math.PI / 2 + .9, .3 + L.lt); smokeAt(JET.position.x + 6, JET.position.y + 3, JET.position.z - 4, .6, 0x5a5a5a, .8);
  put(tyc, PP.x - 6, 0, PP.z + 7, .3); applyPose(tyc, { aLz: 1.2, aRx: 2.4, aRe: .1, headX: -.6 }); face(tyc, { eyes: 'wide', mouth: 'shout', brows: -.6 }, L.T);
  cm([PP.x - 14, 3, PP.z + 22, PP.x + 8, 18, PP.z - 10, 58], [PP.x - 12, 3, PP.z + 20, PP.x + 4, 12, PP.z - 6, 52], L.k); sh(PP, 26); }, [[0, 'jet', .8], [.5, 'alarm', .4], [.9, 'scream_girl', .3]]);
// 11 ¡SPLASH! en la piscina
shot(CR, 'R', null, L => { use('SUB'); JET.visible = true; JET.scale.setScalar(.55); JET.position.set(PP.x, -1.5, PP.z); JET.rotation.set(1.1, -Math.PI / 2 + .9, .3); splashAt(V(PP.x, 1, PP.z), L.lt, 2.4); smokeAt(PP.x, 1, PP.z, clamp(L.lt), 0xffffff, 1.3);
  put(tyc, PP.x - 6, 0, PP.z + 7, .3); applyPose(tyc, { aLz: 1.4, aRz: 1.4, lean: -.25 }); face(tyc, { eyes: 'wide', mouth: 'o', tears: 1 }, L.T);
  cm([PP.x - 4, 6, PP.z + 24, PP.x, 3, PP.z, 52], [PP.x - 4, 6.6, PP.z + 21, PP.x, 3, PP.z, 50], L.k); sh(PP, 26); }, [[0, 'explosion', .7], [.02, 'splash', 1], [.3, 'water_bloop', .6], [.6, 'gasp_old', .5]]);
// 12 50 Millionen Euro
shot(st(12), 'S', null, L => { use('SUB'); JET.visible = true; JET.scale.setScalar(.55); JET.position.set(PP.x, -1.5, PP.z); JET.rotation.set(1.1, -Math.PI / 2 + .9, .3); put(tyc, PP.x - 6, 0, PP.z + 7, .3); applyPose(tyc, { ...CHEER, lean: -.15 }); face(tyc, { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T);
  money(40, PP.x - 6, 6, PP.z + 7, L.T, 8, 1.4); onFace(tyc, 13, .5, -3, 50, L.k, 11); badge('green', '+50.000.000 €', W / 2, H * .17, L.lt - .1); sh(PP, 26); }, [[0, 'cash', .9], [.1, 'money_rain', .8], [.4, 'laugh_deep', .6], [1.1, 'coins', .6]]);
// 13 Aber ich? — golpe de zoom a Finn
shot(st(13), 'C', null, L => { use('G'); traffic(L.T, 2); put(finn, -10, 0, -30, .3); applyPose(finn, { aRx: .9, aRe: 1.9, aRz: -.6, headX: .1 }); face(finn, { eyes: 'open', mouth: 'flat', brows: -.2 }, L.T); onFace(finn, 9, .3, 0, 44 * punch(L.lt, .02, .3), 0); sh(V(-10, 0, -30), 16); }, [[0, 'zoom_fast', .8], [.02, 'impact_soft', .6]]);
// 14 Ich heiße Finn (saluda delante de su casa)
shot(wt('heiße', st(14)), 'W', null, L => { use('SUB'); put(finn, SUBX - 12, 0, 22, Math.PI / 2 - .4); applyPose(finn, { aRx: 2.6, aRz: .3 + Math.sin(L.T * 12) * .25, aRe: .4 }); talkFace(finn, L.T, L.t0, L.t1, { eyes: 'happy', mouth: 'grin' });
  onFace(finn, 10, .6, 2, 46, L.k, 8.5); badge('tag', 'FINN', W / 2, H * .14, L.lt - .2); sh(V(SUBX - 12, 0, 22), 20); }, [[0, 'pop', .5], [.3, 'birds', .4], [.9, 'cloth', .4]]);
// 15 riesiges Problem
shot(wt('riesiges', st(14)), 'Z', null, L => { use('SUB'); put(finn, SUBX - 12, 0, 22, Math.PI / 2 - .2); applyPose(finn, { aRx: 2.4, aRe: 2.1, aRz: -.5, headZ: .15 }); face(finn, { eyes: 'open', mouth: 'frown', brows: -.7, sweat: 1 }, L.T);
  onFace(finn, 8, .4, -1.6, 44, L.k, 7); badge('red', 'PROBLEM!', W / 2, H * .16, L.lt - .25); sh(V(SUBX - 12, 0, 22), 20); }, [[0, 'whoosh_soft', .5], [.25, 'impact', .7], [.5, 'hmm', .5]]);
// 16 Ich hatte noch nie Pech (zoom lento, viñeta, riser → golpe)
shot(st(15), 'S', 'slow', L => { use('SUB'); put(finn, SUBX - 12, 0, 22, Math.PI / 2); applyPose(finn, { aLz: .3, aRz: .3, headX: .1 }); face(finn, { eyes: 'half', mouth: 'flat', brows: -.4 }, L.T); clover.visible = true; clover.position.copy(handP(finn)).add(V(0, .3, 0));
  onFace(finn, 9, .4, 0, 42, L.k, 5.5); badge('big', '0× PECH', W / 2, H * .16, L.lt - .2); }, [[.2, 'heartbeat', .5]]);
// 17 Jeden Tag passiert mir etwas Gutes: cae una moneda a sus pies y la atrapa
shot(st(16), 'Z', null, L => { use('SUB'); walkTo(finn, SUBX - 7, 10, Math.PI, L.T, Math.min(L.lt, 1), 2.4, false, .55); const p = finn.root.position; if (L.lt > 1) { applyPose(finn, { aRx: 1.7, aRe: .5, crouch: clamp((L.lt - 1) * 2) * .3, headX: .3 }); face(finn, { eyes: 'happy', mouth: 'grin' }, L.T); } else face(finn, { eyes: 'open', mouth: 'smile' }, L.T);
  coin.visible = true; const ct = clamp(L.lt / 1.1); coin.position.set(p.x + .5, Math.max(.2, 9 - 9 * ct * ct + (ct > .99 ? 0 : 0)), p.z - 1.6); if (L.lt > 1.05) coin.position.copy(handP(finn)).add(V(0, .4, 0)); coin.rotation.set(L.T * 9, 0, .4);
  if (L.lt > 1.05) BAD.push({ kind: 'bubble', text: 'GLÜCK!', w3: hp(finn).add(V(0, 2.6, 0)), s: spring((L.lt - 1.05) * 1.6), a: 1 }); onFace(finn, 11, 1.4, 3, 46, L.k, 9); sh(p, 18); }, [[0, 'steps', .5], [.6, 'sparkle', .5], [1.05, 'coin_flip', .8], [1.3, 'pling', .6], [2, 'birds', .4]]);
// 18 Eines Morgens verpasse ich den Schulbus
shot(st(17), 'W', null, L => { use('SUB'); day(.92); SBUS.visible = true; SBUS.rotation.y = Math.PI; SBUS.position.set(SUBX - 3.5, 0, 0 - L.lt * 8); walkTo(finn, SUBX - 8.6, 22, Math.PI, L.T, L.lt, 5, true); applyPose(finn, { ...runPose(L.T), aRx: 2.4, aRe: .3 }); face(finn, { eyes: 'wide', mouth: 'shout', sweat: 1 }, L.T);
  const p = finn.root.position; cm([p.x + 6, 4, p.z + 10, p.x - 1, 3.4, p.z - 6, 52], [p.x + 5, 4, p.z + 9, p.x - 1, 3.4, p.z - 6, 50], L.k); badge('tag', 'SCHULBUS', W / 2, H * .14, L.lt - .3); sh(p, 26); }, [[0, 'steps_run', .6], [.1, 'car', .6], [.6, 'whoosh_soft', .4], [1.2, 'shout_m', .3]]);
// 19 Endlich, denke ich, 100 Euro!
shot(st(18), 'C', null, L => { use('SUB'); day(.92); put(finn, SUBX - 8.6, 0, 12, Math.PI / 2 + .3); const pm = Math.sin(clamp(L.lt * 3) * Math.PI); applyPose(finn, { aRx: 2.2 + pm * .6, aRe: 1.4, aLz: .3 }); face(finn, { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T);
  if (L.lt > wt('100', st(18)) - L.t0 - .1) pillOn(finn, '+100 €?', L.lt - (wt('100', st(18)) - L.t0 - .1)); onFace(finn, 10, .4, 0, 46, L.k, 8); sh(V(SUBX - 8, 0, 12), 18); }, [[0, 'gasp', .5], [.4, 'fist', .6], [wt('100', st(18)) - st(18), 'cash', .7], [wt('100', st(18)) - st(18) + .2, 'pling', .5]]);
// 20 Doch genau in dem Moment hält eine Limousine
const FD = wt('Fahrer', st(19));
shot(st(19), 'R', null, L => { use('SUB'); day(.92); const k = easeOut(clamp(L.lt / 1.4)); LIMO.visible = true; LIMO.position.set(SUBX - 3.6, 0, lerp(50, 12, k)); LIMO.rotation.y = Math.PI; put(finn, SUBX - 8.6, 0, 12, Math.PI / 2 + .4 * k); applyPose(finn, k > .6 ? { aLz: .9, aRz: .9, aLe: 1.2, aRe: 1.2 } : {}); face(finn, k > .6 ? { eyes: 'wide', mouth: 'o' } : { eyes: 'happy', mouth: 'smile' }, L.T);
  cm([SUBX - 6, 7, -8, SUBX - 6, 3.2, 14, 52], [SUBX - 6, 7, -6.6, SUBX - 6, 3.2, 14, 50], L.k); sh(V(SUBX - 5, 0, 12), 22); }, [[0, 'car', .7], [1.1, 'wheels', .6], [1.4, 'thud', .4], [1.7, 'gasp', .4]]);
// 21 el chófer abre la puerta, Finn sube
shot(FD, 'S', null, L => { use('SUB'); day(.92); LIMO.visible = true; LIMO.position.set(SUBX - 3.6, 0, 12); LIMO.rotation.y = Math.PI; put(drv, SUBX - 7.6, 0, 9, Math.PI / 2 + .3); applyPose(drv, { lean: .35, aLx: .4, aRx: 1.1, aRz: .5, headX: .3 }); face(drv, { eyes: 'happy', mouth: 'smile' }, L.T);
  walkTo(finn, SUBX - 8.8, 15.5, Math.PI * .85, L.T, L.lt, 1.4, false, .5); face(finn, { eyes: 'open', mouth: 'flat', brows: -.3 }, L.T); bubble(drv, 'GRATIS!', L.lt - .5, 2.2);
  cm([SUBX - 13, 6, 1, SUBX - 7.6, 3.8, 12, 50], [SUBX - 12.6, 6, 1.6, SUBX - 7.6, 3.8, 12, 48], L.k); sh(V(SUBX - 7, 0, 12), 18); }, [[0, 'door_open', .6], [.4, 'steps', .4], [1.2, 'cloth', .4], [1.8, 'door_slam', .5]]);
// 22 0 Euro: Finn asoma por el techo de la limusina, con cara larga
shot(st(20), 'C', null, L => { use('G'); traffic(L.T, 3); LIMO.visible = true; LIMO.rotation.y = Math.PI; LIMO.position.set(-3.6, 0, -40 - L.lt * 9); put(finn, -3.6, 1.6, LIMO.position.z - 2, Math.PI); applyPose(finn, { aLz: .6, aRz: .6, aLe: 1, aRe: 1 }); face(finn, { eyes: 'half', mouth: 'frown', brows: -.5 }, L.T);
  const h = hp(finn); cam([h.x + 2.4, h.y + 2.4, h.z - 10], [h.x, h.y - .6, h.z], 46); pillOn(finn, '0 €', L.lt - .05, 'pay', 2.4); sh(h, 16); }, [[0, 'sad_tone', .6], [.1, 'car', .5]]);
// 23 se pone en medio de la tormenta
shot(st(21), 'W', null, L => { use('SUB'); storm(1); CLOUD.visible = CLOUD2.visible = true; CLOUD.position.set(SUBX - 20, 30, 0); CLOUD.scale.setScalar(2); CLOUD2.position.set(SUBX + 10, 34, -20); CLOUD2.scale.setScalar(2.4);
  walkTo(finn, SUBX - 12, 18, Math.PI / 2, L.T, Math.min(L.lt, 1.2), 4, false, .6); if (L.lt > 1.2) applyPose(finn, { aLz: 1.5, aRz: 1.5, headX: -.4 }); face(finn, { eyes: 'happy', mouth: 'grin' }, L.T); const fl = Math.sin(L.lt * 9) > .9; BOLT.visible = fl; BOLT.position.set(SUBX + 40, 40, -60); BOLT.scale.setScalar(3); if (fl) grade.uniforms.flash.value = .3;
  const p = finn.root.position; cm([p.x + 10, 3, p.z + 6, p.x, 6, p.z - 2, 56], [p.x + 9, 3.2, p.z + 5, p.x, 6, p.z - 2, 54], L.k); sh(p, 20); }, [[0, 'rumble', .7], [.3, 'wind', .6], [.8, 'door_slam', .4], [1.3, 'zap', .5], [1.5, 'thump', .5]]);
// 24 um klitschnass zu werden: espera con los ojos cerrados
shot(wt('klitschnass', st(21)) - .4, 'Z', null, L => { use('SUB'); storm(1); CLOUD.visible = true; CLOUD.position.set(SUBX - 6, 18, 18); CLOUD.scale.setScalar(1); put(finn, SUBX - 6, 0, 18, Math.PI / 2 - .3); applyPose(finn, { aLz: 1.5, aRz: 1.5, headX: -.5, aLx: .3, aRx: .3 }); face(finn, { eyes: 'closed', mouth: 'smile' }, L.T); RAIN.at(V(SUBX - 6, 0, 18), L.T, .1, 6, 16);
  onFace(finn, 9, 1.8, 1, 46, L.k, 7.6); badge('tag', 'KLITSCHNASS?', W / 2, H * .14, L.lt - .3); }, [[0, 'wind', .5], [.4, 'drip', .6], [1.0, 'drip', .5]]);
// 25 en cuanto sale, deja de llover y vuelve el sol
shot(st(22), 'F', null, L => { use('SUB'); const k = easeInOut(clamp(L.lt / 1.6)); storm(1 - k); CLOUD.visible = true; CLOUD.position.set(SUBX - 6 + k * 40, 22 + k * 10, 18); CLOUD.scale.setScalar(1 - k * .3); put(finn, SUBX - 6, 0, 18, Math.PI / 2 - .3); applyPose(finn, { aLz: 1.5 - k, aRz: 1.5 - k, headX: -.6 }); face(finn, { eyes: k > .3 ? 'wide' : 'closed', mouth: k > .3 ? 'o' : 'smile' }, L.T);
  onFace(finn, 10, -1.6, 0, 52, L.k, 8.6); sh(V(SUBX - 6, 0, 18), 20); }, [[0, 'flash', .5], [.2, 'wind', .4], [.6, 'sunrise_shine', .7], [1.6, 'birds', .5]]);
// 26 ...und ein Regenbogen erscheint
shot(wt('Regenbogen', st(22)), 'S', null, L => { use('SUB'); RB.visible = true; RB.position.set(SUBX - 4, -6, -60); RB.scale.setScalar(.6 + .4 * easeOut(clamp(L.lt * 2))); put(finn, SUBX - 6, 0, 16, Math.PI); applyPose(finn, { aLz: .2, aRz: .2, headX: -.2, lean: .1 }); face(finn, { eyes: 'half', mouth: 'frown', brows: -.5 }, L.T);
  const p = finn.root.position; cm([p.x + .6, 3, p.z + 11, p.x, 8, p.z - 30, 60], [p.x + .5, 3, p.z + 10, p.x, 8.6, p.z - 30, 58], L.k); sh(p, 26); }, [[0, 'sparkle', .7], [.3, 'choir', .5], [.9, 'birds', .5], [1.4, 'sigh_kid', .5]]);
// 27 Wieder 0 Euro
shot(st(23), 'C', null, L => { use('SUB'); RB.visible = true; RB.position.set(SUBX - 4, -6, -60); put(finn, SUBX - 6, 0, 16, 0); applyPose(finn, { aLz: .3, aRz: .3, aLe: 1.6, aRe: 1.6, aLx: .4, aRx: .4 }); face(finn, { eyes: 'squint', mouth: 'teeth', brows: .8, veins: 1 }, L.T);
  onFace(finn, 7.6, .4, 0, 44, L.k, 6.4); badge('red', '0 €', W / 2, H * .16, L.lt - .1); }, [[0, 'impact', .7], [.2, 'sad_tone', .5], [.6, 'growl', .3]]);
// 28 Also kaufe ich ein Lotterielos, um zu verlieren
const LB = V(12.4, 0, -60);
shot(st(24), 'W', null, L => { use('G'); drawLotto(0, L.T); put(clk, LB.x + 1.8, 0, LB.z, -Math.PI / 2); applyPose(clk, { aRx: 1.4, aRe: .4 }); face(clk, { eyes: 'happy', mouth: 'smile' }, L.T); put(finn, LB.x - 4.4, 0, LB.z + .6, Math.PI / 2); applyPose(finn, { aRx: 1.3, aRe: .2 }); face(finn, { eyes: 'squint', mouth: 'smirk', brows: .4 }, L.T);
  TICK.visible = true; const k = clamp((L.lt - .9) / .6); TICK.position.copy(handP(clk)).lerp(handP(finn), k).add(V(0, .5, 0)); TICK.rotation.y = -Math.PI / 2;
  cm([LB.x - 17, 8, LB.z + 11, LB.x - 2, 5, LB.z, 50], [LB.x - 16, 8, LB.z + 10, LB.x - 2, 5, LB.z, 48], L.k); bubble(finn, 'BITTE VERLIEREN!', L.lt - .2, 2.4); sh(LB, 18); }, [[0, 'door_bell', .5], [.4, 'coins', .5], [.9, 'paper', .6], [1.6, 'ratchet', .3]]);
// 29 Stattdessen knacke ich den Jackpot (zoom lento → golpe)
shot(st(25), 'Z', 'slow', L => { use('G'); drawLotto(1, L.T); put(clk, LB.x + 1.8, 0, LB.z, -Math.PI / 2); applyPose(clk, CHEER); face(clk, { eyes: 'happy', mouth: 'grin' }, L.T); put(finn, LB.x - 4.4, 0, LB.z + .6, Math.PI / 2 - .5); applyPose(finn, { aLz: 1.3, aRz: 1.3, aLe: 1.5, aRe: 1.5 }); face(finn, { eyes: 'wide', mouth: 'o', sweat: 1 }, L.T);
  confettiAt(LB.x - 2, 2, LB.z, L.T, 7); TICK.visible = true; TICK.position.copy(handP(finn)).add(V(0, .5, 0)); TICK.rotation.y = -Math.PI / 2; cm([LB.x - 17, 6, LB.z - 9, LB.x - 2, 5.4, LB.z, 52], [LB.x - 14, 6, LB.z - 7, LB.x - 2, 5.4, LB.z, 44], L.k); badge('big', 'JACKPOT!', W / 2, H * .15, L.lt - .2); sh(LB, 18); }, [[0, 'party_horn', .6], [.1, 'cash', .8], [.4, 'confetti', .5], [.8, 'cheer', .4]]);
// 30 Das Problem:
shot(st(26), 'C', null, L => { use('G'); drawLotto(1, L.T); put(finn, LB.x - 4.4, 0, LB.z + .6, 0); applyPose(finn, { aRx: .9, aRe: 2, aRz: -.4 }); face(finn, { eyes: 'open', mouth: 'flat', brows: -.6, sweat: 1 }, L.T); onFace(finn, 7, .3, 1, 44 * punch(L.lt, .02, .2), 0); }, [[0, 'thump', .6], [.3, 'hmm', .4]]);
// 31 Gewinnen zählt nicht als Pech: el funcionario sella "KEIN PECH"
shot(st(27), 'S', null, L => { use('PAI'); drawPA('zero'); put(off, PAX, 0, -7.4, 0); const k = clamp((L.lt - .6) / .25); applyPose(off, { aRx: lerp(1.9, 1.1, k), aRe: lerp(1.2, .3, k), aLx: .8, aLe: .6 }); face(off, { eyes: 'half', mouth: 'flat', brows: .5 }, L.T); put(finn, PAX + 1, 0, 1, Math.PI); applyPose(finn, { aRx: 1.3 }); face(finn, { eyes: 'open', mouth: 'o' }, L.T);
  cm([PAX - 3, 6.4, 9, PAX, 6, -6, 50], [PAX - 2.6, 6.4, 8.2, PAX, 6, -6, 48], L.k); if (L.lt > .85) badge('red', 'KEIN PECH', W / 2, H * .17, L.lt - .85); badge('tag', 'GEWINN ≠ PECH', W / 2, H * .27, L.lt - .3); sh(V(PAX, 0, -3), 16); }, [[0, 'pages', .5], [.6, 'whoosh_soft', .4], [.85, 'stamp', .9], [1.2, 'sigh', .4]]);
// 32 Und weil ich noch ein Kind bin: mostrador del banco demasiado alto
shot(st(28), 'W', null, L => { use('VLT'); put(bank, VAX + 2, 0, -2, -.4); applyPose(bank, { aRx: 1.5, aRe: .4, aRz: Math.sin(L.T * 10) * .2 }); face(bank, { eyes: 'half', mouth: 'smirk', brows: .4 }, L.T); put(finn, VAX - 3, 0, 3, .6); applyPose(finn, { aRx: 2.8, aRe: .1, aLx: 2.8, aLe: .1 }); face(finn, { eyes: 'open', mouth: 'o', brows: -.4 }, L.T); TICK.visible = true; TICK.position.copy(handP(finn)).add(V(0, .6, 0));
  cm([VAX - 6, 5, 14, VAX - .5, 5, -1, 50], [VAX - 5.4, 5, 13, VAX - .5, 5, -1, 48], L.k); badge('tag', 'ERST AB 18', W / 2, H * .14, L.lt - .4); sh(V(VAX, 0, 0), 16); }, [[0, 'steps', .4], [.4, 'paper', .5], [1.0, 'tick', .6], [1.3, 'tick', .5]]);
// 33 ...landet alles auf einem gesperrten Sparkonto: se cierra la cámara acorazada
shot(wt('landet', st(28)), 'R', null, L => { use('VLT'); const k = clamp(L.lt / .9); VLT.wheel.rotation.z = -k * 4; VLT.chains.scale.setScalar(.2 + .8 * easeOut(clamp((L.lt - .7) / .4))); VLT.lock.position.y = 9 + (1 - easeOut(clamp((L.lt - 1.1) / .3))) * 6; money(16, VAX, 4, -8, L.T, 5, 2);
  put(finn, VAX - 6, 0, -2, .9); applyPose(finn, { aRx: 2.6, aRe: 2.2, aLx: 2.6, aLe: 2.2 }); face(finn, { eyes: 'wide', mouth: 'shout', brows: -.6 }, L.T);
  cm([VAX + 3, 7, 10, VAX, 8, -12, 54], [VAX + 2.4, 7, 8.6, VAX, 8.4, -12, 52], L.k); if (L.lt > 1.2) badge('red', 'GESPERRT', W / 2, H * .16, L.lt - 1.2); sh(V(VAX, 0, -6), 16); }, [[0, 'money_rain', .5], [.3, 'gears', .6], [.8, 'chain_rattle', .8], [1.2, 'click_metal', .8], [1.3, 'door_slam', .6]]);
// 34 Ich bin also immer noch pleite: bolsillos vacíos
shot(st(29), 'Z', null, L => { use('G'); traffic(L.T, 3); put(finn, -10.6, 0, -76, .4); applyPose(finn, SHRUG); face(finn, { eyes: 'half', mouth: 'frown', brows: -.7 }, L.T); smokeAt(finn.root.position.x, 1.6, finn.root.position.z + .8, clamp(L.lt * .8) * .4, 0xd8c8a8, .25);
  onFace(finn, 10, .6, 2, 46, L.k, 8.4); badge('red', 'PLEITE', W / 2, H * .16, L.lt - .3); sh(V(-10, 0, -76), 16); }, [[0, 'cloth', .6], [.3, 'sad_tone', .6], [.9, 'cough', .4]]);
// 35 Währenddessen... mein bester Freund (en el baño, con el móvil)
const KL = wt('Klo', st(30));
shot(st(30), 'S', null, L => { use('BATH'); put(buddy, BAX + 2.4, 0, -3, -.5); applyPose(buddy, { ...HOLD, aLx: 1.0, headX: .4, lean: .1 }); face(buddy, { eyes: 'open', mouth: 'grin' }, L.T); PH.visible = true; PH.position.copy(handP(buddy, 0).add(handP(buddy)).multiplyScalar(.5)).add(V(0, .5, .3)); PH.rotation.set(-.4, -.5, 0);
  cm([BAX + 8, 7, 8, BAX + 1, 4, -4, 50], [BAX + 7.4, 7, 7.4, BAX + 1, 4, -4, 48], L.k); badge('tag', 'MEIN BESTER FREUND', W / 2, H * .14, L.lt - .3); sh(V(BAX, 0, -4), 14); }, [[0, 'notif', .5], [.5, 'button', .5], [1.1, 'kids_laugh', .3], [1.6, 'button', .4]]);
// 36 ...lässt sein Handy ins Klo fallen
shot(wt('Handy', st(30)), 'Z', null, L => { use('BATH'); const k = clamp(L.lt / .7), bp = BATH.bowlPos; put(buddy, BAX + 1.4, 0, -3, -.3); applyPose(buddy, { aRx: 1.6, aRe: .2, aLz: 1.2, lean: .3 }); face(buddy, { eyes: 'wide', mouth: 'shout', brows: -.6 }, L.T);
  PH.visible = k < 1; const a = handP(buddy).add(V(0, .4, .5)); PH.position.set(lerp(a.x, bp.x, k), lerp(a.y, bp.y, k) + Math.sin(k * Math.PI) * 1.2, lerp(a.z, bp.z, k)); PH.rotation.set(k * 9, k * 4, 0); if (L.lt > .7) splashAt(bp, L.lt - .7, .6);
  cm([BAX - 4, 8, 4, BAX - 1.4, 3.2, -6, 50], [BAX - 3.6, 7.6, 3.4, BAX - 1.6, 3, -6.4, 46], L.k); sh(V(BAX, 0, -5), 14); }, [[0, 'gasp', .5], [.3, 'whoosh_soft', .5], [.7, 'splash', .9], [.85, 'water_bloop', .7]]);
// 37 10.000 Euro
shot(st(31), 'C', null, L => { use('BATH'); put(buddy, BAX + 1.4, 0, -2, -.4); applyPose(buddy, CHEER); face(buddy, { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T); money(30, BAX + 1.4, 6, -2, L.T, 7, 1.4); onFace(buddy, 10, .6, 2, 48, L.k, 8.4); badge('green', '+10.000 €', W / 2, H * .17, L.lt - .1); }, [[0, 'cash', .9], [.2, 'money_rain', .7], [.5, 'cheer', .4]]);
// 38 ...und er kauft sich einen Sportwagen (pasa delante de Finn)
shot(wt('kauft', st(31)), 'W', null, L => { use('G'); CAR.visible = true; CAR.rotation.y = Math.PI; CAR.position.set(-3.8, 0, -64 - L.lt * 14); CAR.userData.wheels.forEach(w => w.rotation.x = -L.T * 12); sit(buddy, -3.8, 2.1, CAR.position.z + .6, Math.PI, { aLx: 1.2, aRx: 2.6, aRe: .3 }); face(buddy, { eyes: 'happy', mouth: 'grin' }, L.T);
  put(finn, -10.4, 0, -82, .9); applyPose(finn, { aLz: .2, aRz: .2, headY: .5 }); face(finn, { eyes: 'half', mouth: 'frown', brows: -.6, look: [.6, 0] }, L.T);
  cm([-6, 6, -96, -6, 3, -78, 54], [-6.4, 6, -95, -6, 3, -78, 52], L.k); sh(V(-6, 0, -80), 22); }, [[0, 'car_pass', .9], [.3, 'whistle', .4], [.9, 'sigh_kid', .5], [1.3, 'party_horn', .3]]);
// 39 Jetzt reicht's!
shot(st(32), 'Z', null, L => { use('G'); put(finn, -10.4, 0, -82, .4); const st_ = Math.abs(Math.sin(L.lt * 8)); applyPose(finn, { aLz: .3, aRz: .3, aLe: 1.9, aRe: 1.9, aLx: .5, aRx: .5, lLx: st_ * .5, lLk: st_ * .6 }); face(finn, { eyes: 'squint', mouth: 'teeth', brows: 1, veins: 1 }, L.T);
  onFace(finn, 7.4, .4, -1, 44 * punch(L.lt, .02, .3), 0); badge('red', 'JETZT REICHT\'S!', W / 2, H * .16, L.lt - .05); }, [[0, 'impact', .8], [.25, 'thud', .6], [.5, 'growl', .4]]);
// 40 ...gehe ich zum offiziellen Pech-Amt
shot(st(33), 'S', null, L => { use('G'); walkTo(finn, 0, -150, Math.PI, L.T, L.lt, 3.4, false, .7); face(finn, { eyes: 'squint', mouth: 'flat', brows: .7 }, L.T); FT.userData.update(L.T); walkTo(ex[7], 8, -186, Math.PI / 2, L.T, L.lt, 2); walkTo(ex[8], -10, -184, -Math.PI / 2, L.T + .5, L.lt, 2);
  const p = finn.root.position; cm([p.x - 2, 2.2, p.z + 9, 0, 16, -205, 56], [p.x - 2, 2.4, p.z + 7.4, 0, 16, -205, 54], L.k); badge('tag', 'PECH-AMT', W / 2, H * .14, L.lt - .4); sh(V(0, 0, -170), 50); }, [[0, 'steps', .6], [.6, 'steps', .5], [1.3, 'wind', .3], [2.0, 'door_open', .5]]);
// 41 Der Mitarbeiter scannt mein Gesicht
const SC = wt('schaut', st(34));
shot(st(34), 'W', null, L => { use('PAI'); drawPA('scan', clamp(L.lt / (SC - L.t0))); put(off, PAX, 0, -7.4, 0); applyPose(off, { aRx: 1.3, aRe: .8, aLx: .9, aLe: .9 }); face(off, { eyes: 'squint', mouth: 'flat', brows: .3 }, L.T); put(finn, PAX + 3, 0, -.6, Math.PI - .9); applyPose(finn, { aLz: .2, aRz: .2 }); face(finn, { eyes: 'closed', mouth: 'flat' }, L.T);
  const hd = PAI.head.getWorldPosition(V(0, 0, 0)), hf = hp(finn); PAI.beam.visible = true; PAI.beam.position.copy(hd).lerp(hf, .5).add(V(0, .3, 0)); PAI.beam.lookAt(hf); PAI.beam.rotateX(Math.PI / 2); PAI.beam.scale.set(.4, hd.distanceTo(hf) / 8, .4); PAI.head.rotation.x = -.5 + Math.sin(L.T * 6) * .1;
  cm([PAX + 10, 6.6, 3.6, PAX + 2.2, 5.2, -2, 50], [PAX + 9.4, 6.6, 3, PAX + 2.2, 5.2, -2, 48], L.k); sh(V(PAX, 0, -3), 16); }, [[0, 'power_on', .6], [.3, 'hum', .5], [.8, 'glitch', .3], [1.4, 'button', .5]]);
// 42 schaut auf den Bildschirm und fängt an zu lachen (zoom lento → golpe en "0% Pech")
shot(SC, 'C', 'slow', L => { use('PAI'); drawPA('scan', 1); put(off, PAX, 0, -7.4, .5); const lg = L.lt > .9; applyPose(off, lg ? { aLz: .8, aRz: .8, aLe: 1.8, aRe: 1.8, lean: -.2 + Math.sin(L.T * 22) * .08, headX: -.3 } : { headY: -.6, headX: -.2 }); face(off, lg ? { eyes: 'happy', mouth: 'grin', tears: 1 } : { eyes: 'open', mouth: 'o' }, L.T);
  onFace(off, 10, 2.2, -3, 46, L.k, 6.4); if (lg) bubble(off, 'HAHAHA!', L.lt - .9, 2.2); }, [[.9, 'laugh_m', .8], [1.4, 'laugh_deep', .5]]);
// 43 „0% Pech“: la pantalla gigante
shot(st(35), 'F', null, L => { use('PAI'); drawPA('zero'); put(off, PAX - 4, 0, -7.4, .6); applyPose(off, { aLz: .8, aRz: .8, aLe: 1.8, aRe: 1.8, lean: -.2 + Math.sin(L.T * 22) * .08 }); face(off, { eyes: 'happy', mouth: 'grin' }, L.T); put(finn, PAX + 2, 0, -2, Math.PI); applyPose(finn, { headX: -.4, aLz: .5, aRz: .5 });
  cm([PAX - 3, 6, 8, PAX, 12, -14, 56], [PAX - 2.6, 6, 7, PAX, 12.4, -14, 54], L.k); badge('red', '0% PECH', W / 2, H * .62, L.lt - .2); }, [[0, 'alarm_soft', .6], [.3, 'glitch', .5], [.6, 'laugh_m', .4]]);
// 44 Ich kann es nicht fassen
shot(st(36), 'Z', null, L => { use('PAI'); drawPA('zero'); put(finn, PAX + 2, 0, -2, 0); applyPose(finn, { aRx: 2.4, aRe: 2.1, aLx: 2.4, aLe: 2.1, aRz: -.3, aLz: -.3 }); face(finn, { eyes: 'wide', mouth: 'shout', brows: -.7, sweat: 1 }, L.T); onFace(finn, 7, .3, 0, 44 * punch(L.lt, .02, .25), L.k, 6); }, [[0, 'zoom_fast', .7], [.05, 'gasp', .7], [.5, 'heartbeat', .5]]);
// 45 Darum versuche ich ein letztes Mal etwas (carretera comarcal)
shot(st(37), 'R', null, L => { use('CTRY'); walkTo(finn, CTX + 9, 0, Math.PI, L.T, L.lt, 3.2, false, .7); face(finn, { eyes: 'squint', mouth: 'flat', brows: .7 }, L.T); const p = finn.root.position;
  cm([p.x - 3, 4, p.z + 8, p.x + 1, 4, p.z - 10, 54], [p.x - 2.6, 4, p.z + 7, p.x + 1, 4, p.z - 10, 52], L.k); badge('tag', 'LETZTER VERSUCH', W / 2, H * .14, L.lt - .3); sh(p, 22); }, [[0, 'steps', .6], [.5, 'wind', .4], [1.2, 'crickets', .3], [1.7, 'steps', .5]]);
// 46 Ich steige in den Bus, der ständig liegen bleibt
shot(st(38), 'W', null, L => { use('CTRY'); const k = easeOut(clamp(L.lt / 1)); RBUS.visible = true; RBUS.rotation.y = Math.PI; RBUS.position.set(CTX + 4, 0, lerp(30, -14, k)); RBUS.userData.door.position.z = L.lt > 1.1 ? 12 : 9.6; RBUS.position.y = Math.sin(L.T * 30) * .05;
  put(bdrv, CTX + 4, 2.4, RBUS.position.z - 11, Math.PI); applyPose(bdrv, { ...SIT }); walkTo(finn, CTX + 9.6, -21, -Math.PI / 2, L.T, Math.max(0, L.lt - 1.1), 2, false, .6); face(finn, { eyes: 'squint', mouth: 'smirk', brows: .5 }, L.T);
  cm([CTX + 16, 4, -10, CTX + 5, 4, -22, 54], [CTX + 15, 4, -11, CTX + 5, 4, -22, 52], L.k); badge('tag', 'BUS 7: IMMER KAPUTT', W / 2, H * .14, L.lt - .3); sh(V(CTX + 6, 0, -20), 26); }, [[0, 'car', .6], [.9, 'steam', .5], [1.1, 'door_open', .6], [1.6, 'steps', .4]]);
// 47 Und tatsächlich: auf halber Strecke qualmt der Motor
const QM = wt('qualmt', st(39));
shot(st(39), 'S', null, L => { use('CTRY'); RBUS.visible = true; RBUS.rotation.y = Math.PI; const k = clamp(L.lt / (QM - L.t0)); RBUS.position.set(CTX + 4, Math.sin(L.T * 26) * .08, -80 - L.lt * 10 * (1 - k * .5)); const e = RBUS.position.clone().add(V(0, 3, 13)); smokeAt(e.x, e.y, e.z, .3 + k * .8, 0x4a4a4a, .7 + k * .5);
  cm([CTX + 18, 8, RBUS.position.z + 30, CTX + 4, 4, RBUS.position.z, 54], [CTX + 16, 8, RBUS.position.z + 28, CTX + 4, 4, RBUS.position.z, 52], L.k); sh(RBUS.position, 30); }, [[0, 'car', .6], [.5, 'machine_shake', .6], [1.2, 'cough', .4], [1.8, 'steam', .6]]);
// 48 ...qualmt der Motor: se para, humo negro, el conductor se rasca la cabeza
shot(QM, 'C', null, L => { use('CTRY'); RBUS.visible = true; RBUS.rotation.y = Math.PI; RBUS.position.set(CTX + 4, 0, -100); const e = V(CTX + 4, 3, -87); smokeAt(e.x, e.y, e.z, 1 + L.lt * .3, 0x3a3a3a, 1.3); put(bdrv, CTX + 1, 0, -84, Math.PI * .8); applyPose(bdrv, { aRx: 2.4, aRe: 2.2, aRz: -.3, headZ: .2 }); face(bdrv, { eyes: 'open', mouth: 'o', brows: -.5 }, L.T);
  cm([CTX - 4, 4, -74, CTX + 3, 4, -88, 52], [CTX - 3.4, 4, -75, CTX + 3, 4, -88, 50], L.k); sh(e, 16); }, [[0, 'metal_creak', .6], [.2, 'steam', .8], [.6, 'cough', .5]]);
// 49 Endlich!
shot(st(40), 'Z', null, L => { use('CTRY'); RBUS.visible = true; RBUS.rotation.y = Math.PI; RBUS.position.set(CTX + 4, 0, -100); smokeAt(CTX + 4, 3, -87, 1.2, 0x3a3a3a, 1.3); put(finn, CTX + 9, 0, -93, -Math.PI / 2 + .6); const j = Math.abs(Math.sin(L.lt * 7)) * 1.4; finn.root.position.y = j; applyPose(finn, { ...CHEER, lLk: j * .5, lRk: j * .5 }); face(finn, { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T);
  onFace(finn, 9, .4, 1, 46, L.k, 7.6); badge('green', 'ENDLICH!', W / 2, H * .16, L.lt - .05); }, [[0, 'cheer', .5], [.1, 'jump', .6], [.5, 'land', .4]]);
// 50 Doch gerade als ich jubele, taucht ein Mechaniker auf
const RP = wt('repariert', st(41));
shot(st(41), 'W', null, L => { use('CTRY'); RBUS.visible = true; RBUS.rotation.y = Math.PI; RBUS.position.set(CTX + 4, 0, -100); smokeAt(CTX + 4, 3, -87, 1.2, 0x3a3a3a, 1.2); walkTo(mech, CTX - 18, -84, Math.PI / 2 + .2, L.T, L.lt, 7, true); face(mech, { eyes: 'happy', mouth: 'grin' }, L.T); WR.visible = true; WR.position.copy(handP(mech)); WR.rotation.z = L.T * 3;
  put(finn, CTX + 9, 0, -93, -Math.PI / 2); applyPose(finn, { ...CHEER, aLx: lerp(2.8, .3, clamp(L.lt)), aRx: lerp(2.8, .3, clamp(L.lt)) }); face(finn, { eyes: 'wide', mouth: 'o' }, L.T);
  const p = mech.root.position; cm([CTX - 14, 5, -64, p.x + 3, 4, p.z, 54], [CTX - 13, 5, -65, p.x + 3, 4, p.z, 52], L.k); bubble(mech, 'ICH MACH DAS!', L.lt - .6, 2.4); sh(p, 26); }, [[0, 'steps_run', .7], [.4, 'whistle_inno', .4], [1.0, 'keys', .5], [1.6, 'gasp', .4]]);
// 51 ...und repariert ihn in 10 Sekunden
shot(RP, 'R', null, L => { use('CTRY'); RBUS.visible = true; RBUS.rotation.y = Math.PI; RBUS.position.set(CTX + 4, 0, -100); const k = clamp(L.lt / (L.t1 - L.t0)); smokeAt(CTX + 4, 3, -87, 1.2 * (1 - k), 0x3a3a3a, 1.2 * (1 - k) + .01); put(mech, CTX + 4, 0, -84.5, Math.PI); applyPose(mech, { aRx: 1.6 + Math.sin(L.T * 18) * .4, aRe: .8, lean: .4, aLx: 1.2 }); face(mech, { eyes: 'squint', mouth: 'smirk' }, L.T);
  WR.visible = true; WR.position.copy(handP(mech)); WR.rotation.set(0, 0, Math.sin(L.T * 18)); sparksAt(V(CTX + 4, 3.2, -87), L.T); cm([CTX + 12, 5, -78, CTX + 4, 3.4, -86, 50], [CTX + 11, 5, -79, CTX + 4, 3.4, -86, 48], L.k); badge('big', Math.max(0, Math.ceil(10 - k * 10)) + ' SEK', W / 2, H * .15, 1); sh(V(CTX + 4, 0, -86), 14); }, [[0, 'ratchet', .7], [.4, 'hammer', .6], [.8, 'sparks', .6], [1.2, 'weld', .4], [1.8, 'ratchet', .6], [2.1, 'ding_soft', .6]]);
// 52 Obendrauf schenkt mir der Fahrer eine lebenslange Freikarte
const LB2 = wt('lebenslange', st(42));
shot(st(42), 'S', null, L => { use('CTRY'); RBUS.visible = true; RBUS.rotation.y = Math.PI; RBUS.position.set(CTX + 4, 0, -100); put(bdrv, CTX + 8, 0, -88.5, Math.PI / 2); applyPose(bdrv, { aRx: 1.5, aRe: .3 }); face(bdrv, { eyes: 'happy', mouth: 'grin' }, L.T); put(finn, CTX + 12, 0, -88.5, -Math.PI / 2); applyPose(finn, { aRx: 1.2, aRe: .4 }); face(finn, { eyes: 'half', mouth: 'flat', brows: -.5 }, L.T);
  CARD.visible = true; CARD.position.copy(handP(bdrv)).lerp(handP(finn), clamp((L.lt - .6) / .5)).add(V(0, .5, 0)); CARD.rotation.y = -Math.PI / 2 + .4; cm([CTX + 10.6, 6, -76, CTX + 10, 4.6, -88.5, 50], [CTX + 10.4, 6, -77, CTX + 10, 4.6, -88.5, 48], L.k); sh(V(CTX + 10, 0, -89), 14); }, [[0, 'pop', .5], [.6, 'paper', .6], [1.2, 'pling', .5]]);
shot(LB2, 'Z', null, L => { use('CTRY'); put(finn, CTX + 12, 0, -89, Math.PI / 2 + 1.2); applyPose(finn, { aRx: 1.4, aRe: .9, headX: .3 }); face(finn, { eyes: 'half', mouth: 'frown', brows: -.5 }, L.T); CARD.visible = true; const h = handP(finn).add(V(0, .9, 0)); CARD.position.copy(h); CARD.rotation.y = finn.root.rotation.y;
  const a = finn.root.rotation.y; cam([h.x + Math.sin(a) * lerp(4.4, 3.6, L.k), h.y + .4, h.z + Math.cos(a) * lerp(4.4, 3.6, L.k)], [h.x, h.y, h.z], 44); badge('tag', 'LEBENSLANG GRATIS', W / 2, H * .14, L.lt - .2); }, [[0, 'sparkle', .5], [.5, 'sad_tone', .5]]);
// 53 Völlig geschlagen gehe ich nach Hause (atardecer)
shot(st(43), 'W', null, L => { use('SUB'); sunset(1); walkTo(finn, SUBX - 7, -40, 0, L.T, L.lt, 1.6, false, .45, .9); face(finn, { eyes: 'half', mouth: 'frown', brows: -.7 }, L.T); const p = finn.root.position;
  cm([p.x + 3, 3, p.z + 11, p.x, 3.6, p.z, 50], [p.x + 2.4, 3, p.z + 10.4, p.x, 3.6, p.z, 48], L.k); sh(p, 22); }, [[0, 'steps', .4], [.5, 'sigh_kid', .6], [1.1, 'crickets', .4], [1.5, 'steps', .3]]);
// 54 Alle anderen werden durch ihr Pech reich: fiesta en la villa
shot(st(44), 'C', null, L => { use('SUB'); sunset(1); for (let i = 0; i < 5; i++) { const e = [lman, ex[5], ex[9], ex[10], ex[11]][i]; put(e, SUBX - 8 + i * 4, Math.abs(Math.sin(L.T * 6 + i)) * .8, -184 + (i % 2) * 2, (i - 2) * -.15); applyPose(e, CHEER); face(e, { eyes: 'happy', mouth: 'grin' }, L.T + i); } bandOn(ex[9]); money(30, SUBX, 6, -184, L.T, 16); confettiAt(SUBX, 2, -184, L.T, 12);
  cm([SUBX + 3, 4, -164, SUBX, 5, -186, 54], [SUBX + 2.4, 4, -166, SUBX, 5, -186, 52], L.k); sh(V(SUBX, 0, -184), 26); }, [[0, 'cheer', .6], [.2, 'money_rain', .6], [.6, 'party_horn', .5], [1.2, 'laugh_m', .4]]);
// 55 nur mein Leben ist perfekt
shot(wt('nur', st(44)), 'S', null, L => { use('SUB'); sunset(1); sit(finn, SUBX - 15.4, .9, 20.4, Math.PI / 2, { aRx: 1.4, aRe: 2.2, aLx: 1.4, aLe: 2.2, headX: .2, lean: .2 }); face(finn, { eyes: 'half', mouth: 'frown', brows: -.6 }, L.T);
  cm([SUBX - 2, 4, 26, SUBX - 18, 6, 18, 52], [SUBX - 3, 4, 25.4, SUBX - 18, 6, 18, 50], L.k); badge('tag', 'PERFEKT…', W / 2, H * .14, L.lt - .3); sh(V(SUBX - 16, 0, 20), 20); }, [[0, 'birds', .5], [.6, 'sigh', .5], [1.2, 'wind', .3]]);
// 56 dormitorio de noche, sentado en la cama
shot(st(45), 'F', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, { aRx: 1.2, aLx: 1.2, aRe: 1.8, aLe: 1.8, lLx: 2.2, lRx: 2.2, lLk: 2.4, lRk: 2.4, headX: .2 }); face(finn, { eyes: 'half', mouth: 'frown', brows: -.6 }, L.T);
  cm([BEDP.x + 9, 8, BEDP.z + 14, BEDP.x, 5, BEDP.z, 50], [BEDP.x + 8.4, 8, BEDP.z + 13, BEDP.x, 5, BEDP.z, 48], L.k); sh(V(BEDP.x, 0, BEDP.z), 14); }, [[0, 'crickets', .5], [.4, 'bed_creak', .6], [1, 'owl', .3]]);
// 57 Warum passiert mir nicht ein einziges Mal etwas Schlechtes? (susurro; zoom lento → golpe con el pitido)
const EZ = wt('einziges', st(46));
shot(st(46), 'W', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, { aRx: 1.2, aLx: 1.2, aRe: 1.8, aLe: 1.8, lLx: 2.2, lRx: 2.2, lLk: 2.4, lRk: 2.4, headX: -.2 }); talkFace(finn, L.T, L.t0, L.t1, { eyes: 'half', mouth: 'frown', brows: -.7 });
  cm([BEDP.x - 6, 6, BEDP.z + 9, BEDP.x + .5, 6, BEDP.z + 2, 46], [BEDP.x - 5.4, 6, BEDP.z + 8.4, BEDP.x + .5, 6, BEDP.z + 2, 44], L.k); }, [[0, 'whisper', .5], [.8, 'sniff', .4]]);
shot(EZ, 'Z', 'slow', L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, { aRx: 1.2, aLx: 1.2, aRe: 1.8, aLe: 1.8, lLx: 2.2, lRx: 2.2, lLk: 2.4, lRk: 2.4, headX: -.2 }); talkFace(finn, L.T, L.t0, L.t1, { eyes: 'half', mouth: 'frown', brows: -.8, tears: 1 });
  onFace(finn, 8, .3, 0, 44, L.k, 4.6); }, [[.4, 'whisper', .4], [1, 'heartbeat', .4]]);
// 58 Plötzlich piept mein Handy
const NS = V(BEDP.x + 3, 3.75, BEDP.z + 3.4);
shot(st(47), 'C', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; phone.visible = true; phone.position.copy(NS); phone.rotation.set(-Math.PI / 2, 0, Math.sin(L.T * 60) * .06 * (L.lt % .6 < .3 ? 1 : 0)); phone.userData.scr.userData.draw('lock', drawLock);
  sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, .6, { headY: .6, aLz: .3 }); face(finn, { eyes: 'wide', mouth: 'o' }, L.T); cam([NS.x + 1.6, NS.y + 3.6, NS.z + 3.6], [NS.x - .6, NS.y + .4, NS.z - .4], 48 * punch(L.lt, .02, .2)); }, [[0, 'notif', .9], [.4, 'vibrate', .7], [.8, 'notif', .6]]);
// 59 Eine Nachricht:
shot(st(48), 'W', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, HOLD); face(finn, { eyes: 'open', mouth: 'o', look: [0, .6] }, L.T); holdPhone(finn, 'lock', drawLock, 3.6, L.k, 3); }, [[0, 'cloth', .5], [.3, 'button', .5]]);
// 60 „Glückwunsch, Finn.
shot(st(49), 'Z', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; phoneClose('cg', drawCongr, L.k, V(BEDP.x, 6, BEDP.z + 4)); }, [[0, 'pling', .7], [.3, 'sparkle', .5]]);
// 61 Du bist offiziell der größte Pechvogel aller Zeiten
const PV = wt('Pechvogel', st(50));
shot(st(50), 'S', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; phoneClose('tt', drawTitle, L.k, V(BEDP.x, 6, BEDP.z + 4), .15); }, [[0, 'swipe', .4], [.6, 'ding_soft', .5]]);
shot(PV, 'C', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, HOLD); face(finn, { eyes: 'wide', mouth: 'o', brows: -.4 }, L.T); holdPhone(finn, 'tt', drawTitle, 2.6, L.k, 2.2, 1.2); badge('big', 'PECHVOGEL Nr. 1', W / 2, H * .15, L.lt - .1); }, [[0, 'impact', .6], [.1, 'bell_far', .4], [.8, 'heartbeat', .4]]);
// 62 Ich erstarre
shot(st(51), 'Z', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, HOLD); face(finn, { eyes: 'wide', mouth: 'o', brows: -.2 }, L.T); onFace(finn, 6, .2, 0, 42 * punch(L.lt, .02, .3), 0); grade.uniforms.sat.value = .9; }, [[0, 'freeze', .8], [.05, 'zoom_fast', .6]]);
// 63 Denn weiter steht da: „In einer Welt, in der Pech reich macht,
const IST = wt('ist', st(53));
shot(st(52), 'W', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; phoneClose('q1', drawQuote1, L.k, V(BEDP.x, 6, BEDP.z + 4), -.12); }, [[0, 'swipe', .5], [.8, 'pages', .4], [1.8, 'whoosh_soft', .3]]);
shot(wt('Pech', st(53)), 'C', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, HOLD); face(finn, { eyes: 'open', mouth: 'o', brows: -.3, look: [0, .7] }, L.T); holdPhone(finn, 'q1', drawQuote1, 3, L.k, 2.6, -1.2); }, [[0, 'heartbeat', .5], [.6, 'tension_str', .4]]);
// 64 ist perfektes Glück das größte Pech von allen.“ (zoom lento → golpe)
shot(IST, 'R', 'slow', L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 90; phoneClose('q2', drawQuote2, L.k, V(BEDP.x, 6, BEDP.z + 4)); }, [[.3, 'strings', .4]]);
// 65 Und genau in diesem Moment: el dinero sale disparado del teléfono
const LD = wt('landen', st(54));
shot(st(54), 'F', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 200; BED.userData.lampL.intensity = 260; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, { ...CHEER, aLx: 2.0, aRx: 2.0 }); face(finn, { eyes: 'wide', mouth: 'shout' }, L.T); money(40, BEDP.x + .5, 5, BEDP.z + 3, L.T, 10, 1.6); bloom.strength = .5;
  onFace(finn, 12, 1, 3, 50, L.k, 10); }, [[0, 'magic_hit', .7], [.1, 'money_rain', .9], [.5, 'cash', .7], [1.0, 'coins', .6]]);
// 66 ...landen 1 Milliarde Euro auf meinem Konto
shot(LD, 'Z', null, L => { use('BED'); BED.userData.night.visible = true; BED.userData.L.intensity = 200; sit(finn, BEDP.x + .5, 3.9, BEDP.z + 2, 0, HOLD); face(finn, { eyes: 'wide', mouth: 'grin' }, L.T); const v = Math.min(1e9, Math.round(Math.pow(10, 9 * easeOut(clamp(L.lt / 1.4))))); const s = v.toLocaleString('de-DE') + ' €';
  holdPhone(finn, s, (c, w, h) => drawBank2(c, w, h, s), 2.8, L.k, 2.2, -1); money(20, BEDP.x + .5, 5, BEDP.z + 3, L.T, 10); badge('green', s, W / 2, H * .16, 1); }, [[0, 'cash_reg', .8], [.4, 'coins', .7], [.9, 'cash', .7], [1.4, 'ding_reveal', .8]]);
// 67 Endlich bin ich der reichste Mensch der Stadt (la ciudad le aclama)
const ZM = wt('zum', st(55)), FR = wt('froh', st(55));
shot(st(55), 'W', null, L => { use('G'); traffic(L.T, 2); put(finn, 0, 2.6, -60, 0); LIMO.visible = true; LIMO.position.set(0, 0, -60); applyPose(finn, CHEER); face(finn, { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T); for (let i = 0; i < 8; i++) { const e = ex[i]; put(e, (i % 2 ? 1 : -1) * (7 + (i % 3) * 1.6), 0, -54 - i * 2.4, (i % 2 ? -1 : 1) * 1.2); applyPose(e, i % 3 ? CHEER : { aRx: 2.5, aRe: .5 }); face(e, { eyes: 'happy', mouth: 'grin' }, L.T + i); }
  confettiAt(0, 4, -60, L.T, 14); money(24, 0, 8, -60, L.T, 12); cm([6, 5, -40, 0, 6, -60, 52], [5, 5.4, -42, 0, 6, -60, 50], L.k); badge('tag', 'REICHSTER MENSCH DER STADT', W / 2, H * .14, L.lt - .3); sh(V(0, 0, -58), 24); }, [[0, 'cheer', .8], [.2, 'confetti', .6], [.6, 'party_horn', .5], [1.2, 'shout_crowd', .4], [1.8, 'firework', .5]]);
// 68 ...und zum ersten Mal in meinem Leben
shot(ZM, 'Z', null, L => { use('G'); put(finn, 0, 2.6, -60, 0); LIMO.visible = true; LIMO.position.set(0, 0, -60); applyPose(finn, { aRx: 1.4, aRe: .5, aRz: -.3, aLz: .3 }); face(finn, { eyes: 'happy', mouth: 'grin', blush: 1 }, L.T); money(20, 0, 8, -60, L.T, 10); confettiAt(0, 4, -60, L.T, 12);
  onFace(finn, 9, .5, 1.6, 46, L.k, 7.4); sh(V(0, 0, -60), 16); }, [[0, 'sparkle', .6], [.6, 'coins', .5], [1.2, 'cheer', .4]]);
// 69 ...bin ich froh, ein Pechvogel zu sein (dron que sube, espejo del gancho)
shot(FR, 'C', null, L => { use('G'); traffic(L.T, 4); walkers(L.T, L.lt, 8, 20); put(finn, 0, 2.6, -60, 0); LIMO.visible = true; LIMO.position.set(0, 0, -60); applyPose(finn, { ...CHEER }); face(finn, { eyes: 'happy', mouth: 'grin' }, L.T); confettiAt(0, 4, -60, L.T, 14); money(20, 0, 8, -60, L.T, 12);
  const k = easeInOut(L.k); cam([lerp(4, 0, k), lerp(6, 40, k), lerp(-46, -10, k)], [0, lerp(5, 0, k), -60 - k * 20], lerp(48, 54, k)); if (L.lt > .4) badge('big', 'PECHVOGEL', W / 2, H * .16, L.lt - .4); sh(V(0, 0, -50), 40); }, [[0, 'whoosh_up', .7], [.4, 'cheer', .5], [.9, 'firework', .5], [1.3, 'bell_far', .4]]);

// ---------- transiciones, sonidos, render ----------
for (let i = 0; i < S.length; i++) S[i].t1 = i + 1 < S.length ? S[i + 1].t0 : DUR;
const TRW = { W: 4, Z: 4, F: 3, S: 4, R: 5, I: 6, C: 4 }, TR_SFX = { W: 'whoosh', Z: 'swoosh_up', F: 'flash', S: 'swipe', R: 'whirl', I: 'iris_pop', C: 'thump' };
const CUES = [];
S.forEach((s, i) => { for (const [lt, n, g] of s.sfx) CUES.push({ t: +(s.t0 + lt).toFixed(3), s: n, g: g ?? 1 });
  if (s.zoom === 'slow') { CUES.push({ t: s.t0 + .05, s: 'riser', g: .9, d: +(s.t1 - s.t0 - .05).toFixed(3) }); CUES.push({ t: s.t1 - .02, s: 'braam', g: 1 }); }
  else if (i > 0) CUES.push({ t: s.t0 + .05, s: ['zoom_in', 'whoosh_soft', 'zoom_out'][i % 3], g: .35 });
  if (!s.zoom && i > 1 && i % 3 === 0) { const d = (S[i + 1]?.t0 ?? DUR) - s.t0; CUES.push({ t: +(s.t0 + d * .45).toFixed(3), s: ['impact_soft', 'thump', 'zoom_in'][(i / 3) % 3], g: .6 }); }
  if (s.tr) CUES.push({ t: +(s.t1 - TRW[s.tr] / FPS).toFixed(3), s: TR_SFX[s.tr], g: .8 }); });
CUES.push({ t: .25, s: 'riser', g: .9, d: +(st(7) - .3).toFixed(3) }); CUES.push({ t: st(7) - .02, s: 'braam', g: 1 });   // gancho: riser hasta "1 Million"
CUES.sort((a, b) => a.t - b.t);
const shotAt = T => { for (let i = 0; i < S.length; i++) if (T < S[i].t1) return i; return S.length - 1; };
function renderShot(i, T, tr, a) {
  const s = S[i], lt = T - s.t0, d = s.t1 - s.t0, L = { lt, k: clamp(lt / d), T, d, t0: s.t0, t1: s.t1 };
  hideAll(); BAD.length = 0; s.fn(L); if (location.search.includes('noao')) ao.enabled = false;
  if (s.zoom === 'slow' || T < st(7)) { const e = s.zoom === 'slow' ? easeIn(L.k) : easeIn(clamp(T / st(7))); grade.uniforms.vig.value = lerp(grade.uniforms.vig.value, .85, e); camera.fov *= lerp(1, .92, e); }
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


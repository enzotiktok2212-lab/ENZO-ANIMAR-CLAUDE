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
